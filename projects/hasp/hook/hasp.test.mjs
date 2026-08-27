import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubLeaseLedger, linearLostWorkTicket, slackClobberAlarm } from "./adapters.mjs";
import {
  IDLE_WORD,
  decide,
  decideSeed,
  emptyAction,
  emptyBoard,
  seed33741,
  seed38541,
  seed85597,
  seed90146,
} from "./hasp.mjs";
import { handle } from "./index.mjs";

test("1 seed 90146 is clobber, holder session-a, session session-b, alarm true, idleWord loose", () => {
  const seed = seed90146();
  const result = decide(seed);
  assert.equal(result.verdict, "clobber");
  assert.equal(result.state, "clobber");
  assert.equal(result.decision, "clobber");
  assert.equal(result.holder, "session-a");
  assert.equal(result.session, "session-b");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "loose");
  assert.equal(IDLE_WORD, "loose");
  assert.doesNotMatch(result.idleWord, /hasp/i);
  assert.match(result.path, /wip\.ts/);
  assert.equal(decideSeed(seed90146).verdict, "clobber");
});

test("2 idle/clear is loose, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "loose");
  assert.equal(result.idleWord, "loose");
  assert.equal(result.verdict, "loose");
  assert.equal(result.decision, "loose");
  assert.doesNotMatch(result.state, /hasp/i);
  assert.doesNotMatch(result.idleWord, /hasp/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "loose");
  assert.equal(cleared.idleWord, "loose");
  assert.doesNotMatch(cleared.state, /hasp/i);
  assert.doesNotMatch(cleared.idleWord, /hasp/i);
  const empty = decide({});
  assert.equal(empty.verdict, "loose");
  assert.doesNotMatch(empty.idleWord, /hasp/i);
});

test("3 seed 85597 clobber, path catchup.md, currentHash r1a770", () => {
  const result = decide(seed85597());
  assert.equal(result.verdict, "clobber");
  assert.match(result.path, /catchup\.md/);
  assert.equal(result.currentHash, "r1a770");
  assert.equal(result.holder, "session-a");
  assert.equal(result.session, "session-b");
});

test("4 seed 38541 clobber, path checkout.ts", () => {
  const result = decide(seed38541());
  assert.equal(result.verdict, "clobber");
  assert.match(result.path, /checkout\.ts/);
  assert.equal(result.holder, "session-a");
  assert.equal(result.currentHash, "c0d3x1");
});

test("5 seed 33741 clobber, session cli-b, holder cli-a", () => {
  const result = decide(seed33741());
  assert.equal(result.verdict, "clobber");
  assert.equal(result.session, "cli-b");
  assert.equal(result.holder, "cli-a");
  assert.match(result.path, /cap_sid/);
  assert.equal(result.currentHash, "sid-aa");
});

test("6 seize on loose path is seized", () => {
  const result = decide({
    action: "seize",
    session: "session-a",
    path: "src/free.ts",
    nextHash: "h1",
    board: emptyBoard(),
  });
  assert.equal(result.verdict, "seized");
  assert.equal(result.holder, "session-a");
  assert.equal(result.currentHash, "h1");
  assert.equal(result.alarm, false);
});

test("7 second session yields when hasp is live", () => {
  const first = decide({
    action: "seize",
    session: "session-a",
    path: "src/live.ts",
    board: emptyBoard(),
  });
  assert.equal(first.verdict, "seized");
  const second = decide({
    action: "seize",
    session: "session-b",
    path: "src/live.ts",
    board: first.board,
  });
  assert.equal(second.verdict, "yield");
  assert.equal(second.holder, "session-a");
  assert.equal(second.session, "session-b");
});

test("8 holder write with matching hash stays seized and updates hash", () => {
  const seized = decide({
    action: "seize",
    session: "session-a",
    path: "src/cas.ts",
    nextHash: "aaa111",
    board: emptyBoard(),
  });
  const written = decide({
    action: "write",
    session: "session-a",
    path: "src/cas.ts",
    expectedHash: "aaa111",
    nextHash: "bbb222",
    board: seized.board,
  });
  assert.equal(written.verdict, "seized");
  assert.equal(written.currentHash, "bbb222");
  assert.equal(written.holder, "session-a");
});

test("9 holder write with drifted hash is stale, not clobber", () => {
  const seized = decide({
    action: "seize",
    session: "session-a",
    path: "src/cas.ts",
    nextHash: "aaa111",
    board: emptyBoard(),
  });
  const stale = decide({
    action: "write",
    session: "session-a",
    path: "src/cas.ts",
    expectedHash: "dead00",
    nextHash: "bbb222",
    board: seized.board,
  });
  assert.equal(stale.verdict, "stale");
  assert.notEqual(stale.verdict, "clobber");
  assert.equal(stale.currentHash, "aaa111");
});

test("10 release by holder leaves path loose", () => {
  const seized = decide({
    action: "seize",
    session: "session-a",
    path: "src/done.ts",
    board: emptyBoard(),
  });
  const released = decide({
    action: "release",
    session: "session-a",
    path: "src/done.ts",
    board: seized.board,
  });
  assert.equal(released.verdict, "loose");
  assert.equal(released.holder, null);
});

test("11 release by stranger yields", () => {
  const seized = decide({
    action: "seize",
    session: "session-a",
    path: "src/held.ts",
    board: emptyBoard(),
  });
  const released = decide({
    action: "release",
    session: "session-b",
    path: "src/held.ts",
    board: seized.board,
  });
  assert.equal(released.verdict, "yield");
  assert.equal(released.holder, "session-a");
});

test("12 expired lease can be seized by the other session", () => {
  const seized = decide({
    action: "seize",
    session: "session-a",
    path: "src/old.ts",
    now: 0,
    ttlMs: 1000,
    board: emptyBoard(),
  });
  assert.equal(seized.verdict, "seized");
  const other = decide({
    action: "seize",
    session: "session-b",
    path: "src/old.ts",
    now: 1001,
    board: seized.board,
  });
  assert.equal(other.verdict, "seized");
  assert.equal(other.holder, "session-b");
});

test("13 inspect empty board is loose", () => {
  const result = decide({ action: "inspect", board: emptyBoard() });
  assert.equal(result.verdict, "loose");
  assert.equal(result.idleWord, "loose");
  assert.doesNotMatch(result.idleWord, /hasp/i);
});

test("14 handle denies clobber and fires 3 demo sinks", async () => {
  const out = await handle(seed90146(), {});
  assert.equal(out.ok, true);
  assert.equal(out.product, "hasp");
  assert.equal(out.hook_event_name, "PreToolUse");
  assert.equal(out.verdict, "clobber");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.hookSpecificOutput.decision.interrupt, true);
  assert.equal(out.sinks.length, 3);
  assert.ok(out.sinks.every((row) => row.mode === "demo"));
});

test("15 handle allows a clean seize", async () => {
  const out = await handle(
    { action: "seize", session: "session-a", path: "src/clean.ts", board: emptyBoard() },
    {},
  );
  assert.equal(out.verdict, "seized");
  assert.equal(out.permissionDecision, "allow");
  assert.equal(out.hookSpecificOutput.decision.interrupt, false);
});

test("16 demo adapters stay honest without secrets", async () => {
  const clobbered = decide(seed90146());
  const sinks = await fire(clobbered, {});
  const slack = sinks.events.find((row) => row.adapter === "slack");
  const github = sinks.events.find((row) => row.adapter === "github");
  const linear = sinks.events.find((row) => row.adapter === "linear");
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /would post to slack/i);
  assert.match(slack.summary, /clobber alarm/i);
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would append a github lease ledger row/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open a linear lost-work ticket/i);
  assert.doesNotMatch(JSON.stringify(sinks).toLowerCase(), /"mode":"live"/);
  assert.doesNotMatch(slack.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const skip = slackClobberAlarm(idle, {});
  const ledger = githubLeaseLedger(idle, {});
  const ticket = linearLostWorkTicket(idle, {});
  assert.match(skip.summary, /loose/i);
  assert.match(ledger.summary, /would append a github lease ledger row/i);
  assert.match(ticket.summary, /loose/i);
  assert.doesNotMatch(JSON.stringify({ slack, github, linear }).toLowerCase(), /\b200\b/);
});

test("17 fire returns three events", async () => {
  const sinks = await fire(decide(seed90146()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
});
