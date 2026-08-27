import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubSpendLedger, linearQuotaTicket, slackAlarm } from "./adapters.mjs";
import {
  DEFAULT_THRESHOLD,
  decide,
  emptySession,
  fuseState,
  raiseThreshold,
  seedRunaway,
} from "./fuse.mjs";
import { handle } from "./index.mjs";

test("seed runaway is already burning — meter is not empty", () => {
  const seed = seedRunaway();
  const result = decide(seed);
  assert.equal(result.snapshot.tokens > 3_000_000, true, `expected a live burn, got ${result.snapshot.tokens}`);
  assert.equal(result.snapshot.usd > 40, true);
  assert.equal(result.state, "warning");
  assert.equal(result.decision, "continue");
  assert.equal(result.snapshot.session, "fanout-83025");
  assert.equal(result.snapshot.sources.subagents > result.snapshot.sources.parent, true);
});

test("idle word is cool, never the product name", () => {
  const result = decide(emptySession("idle"));
  assert.equal(result.state, "cool");
  assert.equal(result.idleWord, "cool");
  assert.equal(result.decision, "continue");
  assert.equal(result.snapshot.tokens, 0);
  assert.doesNotMatch(result.state, /quench/i);
  assert.doesNotMatch(result.idleWord, /quench/i);
  assert.equal(fuseState(emptySession()), "cool");
});

test("armed stays under the fuse", () => {
  const result = decide({
    sources: { parent: 100_000, subagents: 40_000, hooks: 10_000, workflows: 10_000 },
  });
  assert.equal(result.state, "armed");
  assert.equal(result.decision, "continue");
  assert.ok(result.ratio < 0.8);
});

test("crossing the fuse trips a hard kill", () => {
  const result = decide({
    sources: { parent: 1_000_000, subagents: 3_500_000, hooks: 200_000, workflows: 400_000 },
    threshold: DEFAULT_THRESHOLD,
  });
  assert.equal(result.state, "tripped");
  assert.equal(result.decision, "kill");
  assert.ok(result.ratio >= 1);
});

test("kill action cuts even when under the wire", () => {
  const result = decide({
    action: "kill",
    sources: { parent: 10_000, subagents: 0, hooks: 0, workflows: 0 },
  });
  assert.equal(result.action, "kill");
  assert.equal(result.decision, "kill");
  assert.equal(result.state, "tripped");
  assert.equal(result.snapshot.killed, true);
});

test("raise limit lifts the fuse and can return to armed", () => {
  const before = decide(seedRunaway());
  assert.equal(before.state, "warning");
  const after = decide({ ...seedRunaway(), action: "raise", threshold: DEFAULT_THRESHOLD });
  assert.deepEqual(after.threshold, raiseThreshold(DEFAULT_THRESHOLD));
  assert.equal(after.state, "armed");
  assert.equal(after.decision, "continue");
  assert.equal(after.snapshot.raised, 1);
});

test("demo adapters stay honest without secrets", async () => {
  const tripped = decide({
    action: "kill",
    session: "fanout-83025",
    agents: 82,
    sources: seedRunaway().sources,
  });
  const sinks = await fire(tripped, {});
  const slack = sinks.events.find((row) => row.adapter === "slack");
  const github = sinks.events.find((row) => row.adapter === "github");
  const linear = sinks.events.find((row) => row.adapter === "linear");
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /would post to slack/i);
  assert.match(slack.summary, /kill ack/i);
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would write/i);
  assert.match(github.summary, /spend ledger/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open a linear quota-blown ticket/i);
});

test("cool snapshot skips spend and slack", () => {
  const cool = decide(emptySession());
  const slack = slackAlarm(cool, {});
  const github = githubSpendLedger(cool, {});
  const linear = linearQuotaTicket(cool, {});
  assert.match(slack.summary, /fuse is cool/i);
  assert.match(github.summary, /fuse is cool/i);
  assert.match(linear.summary, /no trip/i);
  assert.doesNotMatch(JSON.stringify({ slack, github, linear }).toLowerCase(), /grant|redact|veil|dlp/);
});

test("hook handle returns continue|kill plus demo sinks", async () => {
  const out = await handle(seedRunaway(), {});
  assert.equal(out.ok, true);
  assert.equal(out.product, "quench");
  assert.equal(out.hook_event_name, "UsageSnapshot");
  assert.ok(["continue", "kill"].includes(out.decision));
  assert.ok(out.sinks.some((row) => row.adapter === "slack" && row.mode === "demo"));
  assert.ok(out.sinks.some((row) => row.adapter === "github" && /would write/i.test(row.summary)));
  const kill = await handle({ ...seedRunaway(), action: "kill" }, {});
  assert.equal(kill.decision, "kill");
  assert.equal(kill.permissionDecision, "deny");
  assert.equal(kill.hookSpecificOutput.decision.interrupt, true);
});
