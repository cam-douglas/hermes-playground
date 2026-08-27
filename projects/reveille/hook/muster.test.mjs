import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubMusterLedger, linearOrphanTicket, slackMuster } from "./adapters.mjs";
import {
  HEARTBEAT_TTL_MS,
  decide,
  emptyRoster,
  findCollision,
  musterState,
  refreshStatuses,
  seedCollision,
} from "./muster.mjs";
import { handle } from "./index.mjs";

const NOW = 1_700_000_000_000;

test("seed hold — duplicate dispatch on claimed artifact", () => {
  const seed = seedCollision(NOW);
  const result = decide({
    ...seed,
    action: "dispatch",
    now: NOW,
    dispatch: {
      id: "retry-implementer",
      role: "implementer",
      artifact: "src/auth/session.ts",
    },
  });
  assert.equal(result.snapshot.session, "compact-90036");
  assert.equal(result.snapshot.roster.length, 3);
  assert.equal(result.decision, "hold");
  assert.equal(result.state, "held");
  assert.equal(result.snapshot.held, true);
  assert.equal(result.snapshot.collision.existing.artifact, "src/auth/session.ts");
  assert.equal(result.snapshot.collision.incoming.id, "retry-implementer");
  const implementer = result.snapshot.roster.find((row) => row.id === "implementer");
  assert.equal(implementer.status, "live");
  assert.equal(implementer.artifact, "src/auth/session.ts");
});

test("idle word is quiet, never the product name", () => {
  const result = decide(emptyRoster("idle", NOW));
  assert.equal(result.state, "quiet");
  assert.equal(result.idleWord, "quiet");
  assert.equal(result.decision, "clear");
  assert.equal(result.snapshot.roster.length, 0);
  assert.doesNotMatch(result.state, /reveille/i);
  assert.doesNotMatch(result.idleWord, /reveille/i);
  assert.equal(musterState(emptyRoster()), "quiet");
});

test("compaction preserves roster and increments the count", () => {
  const seed = seedCollision(NOW);
  const ids = seed.roster.map((row) => row.id);
  const result = decide({ ...seed, action: "compact", now: NOW });
  assert.equal(result.action, "compact");
  assert.equal(result.snapshot.compactionCount, 1);
  assert.equal(result.snapshot.roster.length, 3);
  assert.deepEqual(result.snapshot.roster.map((row) => row.id), ids);
  assert.equal(result.snapshot.roster.find((row) => row.id === "implementer").status, "live");
  assert.equal(result.snapshot.roster.find((row) => row.id === "tester").status, "live");
  assert.equal(result.snapshot.roster.find((row) => row.id === "docs").status, "orphaned");
  const again = decide({ ...result.snapshot, action: "compact", now: NOW });
  assert.equal(again.snapshot.compactionCount, 2);
  assert.equal(again.snapshot.roster.length, 3);
});

test("orphan TTL marks missed heartbeats", () => {
  const result = decide({
    session: "ttl-1",
    now: NOW,
    ttlMs: HEARTBEAT_TTL_MS,
    roster: [
      {
        id: "docs",
        role: "docs",
        artifact: "docs/session.md",
        lastHeartbeat: NOW - HEARTBEAT_TTL_MS - 1,
        status: "live",
        claimed: true,
      },
    ],
  });
  assert.equal(result.snapshot.roster[0].status, "orphaned");
  assert.equal(result.decision, "orphan");
  assert.equal(result.state, "missing");
  const refreshed = refreshStatuses(
    [{ id: "docs", role: "docs", artifact: "docs/session.md", lastHeartbeat: NOW - HEARTBEAT_TTL_MS - 1 }],
    NOW,
    HEARTBEAT_TTL_MS,
  );
  assert.equal(refreshed[0].status, "orphaned");
});

test("clear dispatch claims an open artifact", () => {
  const result = decide({
    ...emptyRoster("open-1", NOW),
    action: "dispatch",
    now: NOW,
    dispatch: { id: "writer", role: "implementer", artifact: "src/new.ts" },
  });
  assert.equal(result.decision, "clear");
  assert.equal(result.state, "mustering");
  assert.equal(result.snapshot.roster.length, 1);
  assert.equal(result.snapshot.roster[0].artifact, "src/new.ts");
  assert.equal(result.snapshot.held, false);
  assert.equal(findCollision(result.snapshot.roster, { id: "other", artifact: "src/new.ts" })?.id, "writer");
});

test("heartbeat re-attaches an orphaned handle", () => {
  const seed = seedCollision(NOW);
  assert.equal(seed.roster.find((row) => row.id === "docs").status, "orphaned");
  const result = decide({
    ...seed,
    action: "heartbeat",
    now: NOW,
    heartbeat: { id: "docs" },
  });
  const docs = result.snapshot.roster.find((row) => row.id === "docs");
  assert.equal(docs.status, "live");
  assert.equal(docs.lastHeartbeat, NOW);
  assert.equal(result.decision, "clear");
  assert.equal(result.state, "mustering");
});

test("demo adapters stay honest without secrets", async () => {
  const held = decide({
    ...seedCollision(NOW),
    action: "dispatch",
    now: NOW,
    dispatch: { id: "retry", role: "implementer", artifact: "src/auth/session.ts" },
  });
  const sinks = await fire(held, {});
  const slack = sinks.events.find((row) => row.adapter === "slack");
  const github = sinks.events.find((row) => row.adapter === "github");
  const linear = sinks.events.find((row) => row.adapter === "linear");
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /would post to slack/i);
  assert.match(slack.summary, /hold/i);
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would write/i);
  assert.match(github.summary, /muster ledger/i);
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(JSON.stringify(sinks).toLowerCase(), /"mode":"live"/);
  assert.doesNotMatch(slack.summary, /\b200\b/);

  const missing = decide(seedCollision(NOW));
  const orphanSinks = await fire(missing, {});
  const ticket = orphanSinks.events.find((row) => row.adapter === "linear");
  assert.equal(ticket.mode, "demo");
  assert.match(ticket.summary, /would open a linear orphan ticket/i);
});

test("quiet snapshot skips sinks", () => {
  const quiet = decide(emptyRoster("idle", NOW));
  const slack = slackMuster(quiet, {});
  const github = githubMusterLedger(quiet, {});
  const linear = linearOrphanTicket(quiet, {});
  assert.match(slack.summary, /muster is quiet/i);
  assert.match(github.summary, /board is quiet/i);
  assert.match(linear.summary, /no orphan ticket/i);
  assert.doesNotMatch(
    JSON.stringify({ slack, github, linear }).toLowerCase(),
    /\bgrant\b|\bredact\b|\bveil\b|\bdlp\b|\bspend\b|\bfuse\b|\bkill\b/,
  );
});

test("hook handle denies hold and orphan", async () => {
  const hold = await handle(
    {
      ...seedCollision(NOW),
      action: "dispatch",
      now: NOW,
      dispatch: { id: "retry", role: "implementer", artifact: "src/auth/session.ts" },
    },
    {},
  );
  assert.equal(hold.ok, true);
  assert.equal(hold.product, "reveille");
  assert.equal(hold.hook_event_name, "MusterCheck");
  assert.equal(hold.decision, "hold");
  assert.equal(hold.permissionDecision, "deny");
  assert.equal(hold.hookSpecificOutput.decision.interrupt, true);
  assert.ok(hold.sinks.some((row) => row.adapter === "slack" && row.mode === "demo"));

  const orphan = await handle(seedCollision(NOW), {});
  assert.equal(orphan.decision, "orphan");
  assert.equal(orphan.state, "missing");
  assert.equal(orphan.permissionDecision, "deny");
  assert.equal(orphan.hookSpecificOutput.decision.interrupt, true);

  const clear = await handle(
    {
      ...emptyRoster("open-1", NOW),
      action: "dispatch",
      now: NOW,
      dispatch: { id: "solo", role: "implementer", artifact: "src/ok.ts" },
    },
    {},
  );
  assert.equal(clear.decision, "clear");
  assert.equal(clear.permissionDecision, "allow");
});
