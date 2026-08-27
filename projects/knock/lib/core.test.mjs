import assert from "node:assert/strict";
import test from "node:test";
import {
  applyDecision,
  clampTtl,
  hashArgs,
  hookDecisionPayload,
  parseHookPayload,
  remainingMs,
  seedKnocks,
  shouldEscalateLinear,
  shouldTimeout,
  slackApprovalBlocks,
  STATUSES,
} from "./core.mjs";

test("arg hashes are stable across key order", () => {
  assert.equal(hashArgs({ b: 1, a: 2 }), hashArgs({ a: 2, b: 1 }));
  assert.notEqual(hashArgs({ a: 1 }), hashArgs({ a: 2 }));
});

test("TTL is clamped so a run cannot hang for 55 minutes", () => {
  assert.equal(clampTtl(3300), 600);
  assert.equal(clampTtl(2), 8);
  assert.equal(clampTtl("nope"), 120);
});

test("Claude Code PermissionRequest payloads parse", () => {
  const parsed = parseHookPayload({
    hook_event_name: "PermissionRequest",
    tool_name: "Bash",
    tool_input: { command: "ls" },
    session_id: "sess_1",
    agent_id: "sub-2",
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.toolName, "Bash");
  assert.equal(parsed.runId, "sess_1");
  assert.equal(parsed.agentId, "sub-2");
  assert.equal(parsed.argHash, hashArgs({ command: "ls" }));
});

test("PreToolUse-shaped payloads parse", () => {
  const parsed = parseHookPayload({
    hook_event_name: "PreToolUse",
    toolName: "Write",
    toolInput: { path: "x.ts" },
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.hookEvent, "PreToolUse");
  assert.equal(parsed.toolName, "Write");
});

test("missing tool name is rejected", () => {
  const parsed = parseHookPayload({ run_id: "r" });
  assert.equal(parsed.ok, false);
});

test("approve / deny / timeout change grant state", () => {
  const now = 1_000_000;
  const knock = {
    id: "kn_1",
    status: STATUSES.pending,
    toolName: "Bash",
    argHash: "abc",
    agentId: "a",
    runId: "r",
    createdAt: now,
    expiresAt: now + 120_000,
  };
  const allowed = applyDecision(knock, "allow", "ada", now + 1000);
  assert.equal(allowed.ok, true);
  assert.equal(allowed.knock.status, STATUSES.allowed);
  assert.equal(allowed.knock.grant.scope, "this_run_only");
  assert.equal(allowed.knock.grant.runId, "r");

  const denied = applyDecision(knock, "deny", "sam", now + 1000);
  assert.equal(denied.knock.status, STATUSES.denied);
  assert.equal(denied.knock.grant, null);

  const timed = applyDecision(knock, "timeout", "timeout", now + 120_000);
  assert.equal(timed.knock.status, STATUSES.timed_out);
  assert.match(timed.knock.decisionReason, /never hangs/);

  const already = applyDecision(allowed.knock, "deny", "x", now + 2000);
  assert.equal(already.ok, false);
});

test("timeout and linear escalate use clocks, not vibes", () => {
  const now = 5_000_000;
  const knock = {
    status: STATUSES.pending,
    createdAt: now - 25_000,
    expiresAt: now + 1000,
    linearIssueId: null,
  };
  assert.equal(shouldTimeout(knock, now), false);
  assert.equal(shouldTimeout({ ...knock, expiresAt: now - 1 }, now), true);
  assert.equal(shouldEscalateLinear(knock, 20, now), true);
  assert.equal(shouldEscalateLinear({ ...knock, linearIssueId: "LIN-1" }, 20, now), false);
  assert.equal(remainingMs({ ...knock, expiresAt: now + 4000 }, now), 4000);
});

test("Slack approval card is a real Block Kit message", () => {
  const payload = slackApprovalBlocks(
    {
      id: "kn_abc",
      toolName: "Bash",
      agentId: "sub",
      runId: "run_1",
      argHash: "deadbeef",
      reason: "classifier denied",
      createdAt: 0,
      expiresAt: 120_000,
    },
    "https://example.test",
  );
  assert.match(payload.text, /Bash/);
  assert.equal(payload.blocks[0].type, "header");
  assert.equal(payload.blocks[1].type, "section");
  assert.equal(payload.blocks[2].type, "divider");
  assert.equal(payload.blocks[3].type, "actions");
  assert.equal(payload.blocks[3].elements[0].action_id, "knock_approve_btn");
  assert.equal(payload.blocks[3].elements[1].action_id, "knock_deny_btn");
  assert.equal(payload.blocks[4].type, "context");
});

test("hook decision payload is PermissionRequest-shaped", () => {
  const payload = hookDecisionPayload({
    id: "kn_1",
    status: STATUSES.allowed,
    decidedBy: "ada",
    grant: { scope: "this_run_only" },
  });
  assert.equal(payload.decision, "allow");
  assert.equal(payload.hookSpecificOutput.decision.behavior, "allow");
});

test("demo seed has pending, allowed, denied, timed out", () => {
  const seeded = seedKnocks(Date.now());
  const statuses = seeded.map((item) => item.status).sort();
  assert.deepEqual(statuses, ["allowed", "denied", "pending", "timed_out"]);
});
