import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubCodaLedger, linearRecoveryTicket, slackSpliceAlarm } from "./adapters.mjs";
import {
  IDLE_WORD,
  decide,
  decideSeed,
  emptyAction,
  emptyGalley,
  lastText,
  seed17591,
  seed20190,
  seed24849,
  seed58109,
  seed74260,
  seed81838,
  textOf,
} from "./coda.mjs";
import { handle } from "./index.mjs";

test("1 seed 81838 is split, last message only, idleWord intact, completeness < 0.3, lost > 0", () => {
  const seed = seed81838();
  const result = decide(seed);
  assert.equal(result.verdict, "split");
  assert.equal(result.state, "split");
  assert.equal(result.decision, "split");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.doesNotMatch(result.idleWord, /coda/i);
  assert.equal(result.delivered, lastText(result.blocks));
  assert.notEqual(result.delivered, result.whole);
  assert.ok(result.completeness < 0.3);
  assert.ok(result.lost > 0);
  assert.equal(result.blocks[0].stopReason, "max_tokens");
  assert.equal(result.blocks[1].stopReason, "end_turn");
  assert.equal(decideSeed(seed81838).verdict, "split");
  assert.equal(decideSeed(81838).verdict, "split");
});

test("2 idle/clear is intact, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "intact");
  assert.equal(result.idleWord, "intact");
  assert.equal(result.verdict, "intact");
  assert.equal(result.decision, "intact");
  assert.deepEqual(emptyGalley().blocks, []);
  assert.equal(emptyGalley().persisted, true);
  assert.doesNotMatch(result.state, /coda/i);
  assert.doesNotMatch(result.idleWord, /coda/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "intact");
  assert.equal(cleared.idleWord, "intact");
  assert.equal(cleared.delivered, "");
  assert.equal(cleared.blocks.length, 0);
  assert.doesNotMatch(cleared.state, /coda/i);
  assert.doesNotMatch(cleared.idleWord, /coda/i);
  const empty = decide({});
  assert.equal(empty.verdict, "intact");
  assert.doesNotMatch(empty.idleWord, /coda/i);
});

test("3 seed 58109 is snip, last text before tool_use, verdict dropped", () => {
  const result = decide(seed58109());
  assert.equal(result.verdict, "snip");
  assert.equal(result.alarm, true);
  assert.equal(result.delivered, "Let me also examine that...");
  assert.equal(result.delivered, lastText(result.blocks.filter((block) => block.type === "text")));
  assert.match(result.whole, /## Verdict/);
  assert.doesNotMatch(result.delivered, /## Verdict/);
  assert.equal(result.blocks[2].type, "tool_use");
  assert.equal(result.blocks[2].name, "TaskUpdate");
});

test("4 seed 20190 is void, terminal tool_use, all text lost", () => {
  const result = decide(seed20190());
  assert.equal(result.verdict, "void");
  assert.equal(result.alarm, true);
  assert.equal(result.delivered, "");
  assert.equal(result.blocks[result.blocks.length - 1].type, "tool_use");
  assert.equal(result.blocks[result.blocks.length - 1].name, "TaskUpdate");
  assert.match(result.whole, /SteerTrue/);
  assert.ok(result.lost > 0);
});

test("5 seed 74260 is swallow, never persisted, splice cannot recover", () => {
  const result = decide(seed74260());
  assert.equal(result.verdict, "swallow");
  assert.equal(result.alarm, true);
  assert.equal(result.persisted, false);
  assert.equal(result.delivered, "");
  assert.equal(result.claimed, "Did you review the list printed above?");
  assert.equal(result.blocks[2].name, "AskUserQuestion");
  const spliced = decide({ action: "splice", galley: result.galley });
  assert.equal(spliced.verdict, "swallow");
  assert.equal(spliced.recovered, false);
  assert.equal(spliced.persisted, false);
});

test("6 seed 17591 is raw, JSONL is not the summary", () => {
  const result = decide(seed17591());
  assert.equal(result.verdict, "raw");
  assert.equal(result.alarm, true);
  assert.equal(result.rawJsonl, true);
  assert.match(result.delivered, /"type"\s*:\s*"assistant"/);
  assert.match(result.whole, /findings are in the summary/);
  assert.doesNotMatch(result.whole, /"type":"assistant"/);
});

test("7 seed 24849 is snip, middle line S-0391 missing from delivered", () => {
  const result = decide(seed24849());
  assert.equal(result.verdict, "snip");
  assert.equal(result.alarm, true);
  assert.doesNotMatch(result.delivered, /S-0391/);
  assert.match(result.whole, /S-0391/);
  assert.equal(result.blocks.length, 1);
  assert.equal(result.blocks[0].type, "text");
  assert.ok(result.lost > 0);
});

test("8 splice of 81838 recovers the whole and becomes intact", () => {
  const split = decide(seed81838());
  assert.equal(split.verdict, "split");
  const spliced = decide({ action: "splice", galley: split.galley });
  assert.equal(spliced.verdict, "intact");
  assert.equal(spliced.alarm, false);
  assert.equal(spliced.recovered, true);
  assert.equal(spliced.delivered, spliced.whole);
  assert.equal(spliced.completeness, 1);
  assert.equal(spliced.lost, 0);
});

test("9 splice of 20190 recovers void into intact", () => {
  const voided = decide(seed20190());
  assert.equal(voided.verdict, "void");
  const spliced = decide({ action: "splice", galley: voided.galley });
  assert.equal(spliced.verdict, "intact");
  assert.equal(spliced.recovered, true);
  assert.equal(spliced.delivered, spliced.whole);
  assert.match(spliced.delivered, /SteerTrue/);
});

test("10 splice of 17591 prefers the summary over the JSONL dump", () => {
  const raw = decide(seed17591());
  assert.equal(raw.verdict, "raw");
  const spliced = decide({ action: "splice", galley: raw.galley });
  assert.equal(spliced.verdict, "intact");
  assert.equal(spliced.rawJsonl, false);
  assert.equal(spliced.recovered, true);
  assert.equal(spliced.delivered, spliced.whole);
  assert.match(spliced.delivered, /findings are in the summary/);
  assert.doesNotMatch(spliced.delivered, /"type":"assistant"/);
});

test("11 textOf concatenates every text block in order", () => {
  const joined = textOf([
    { type: "text", text: "alpha" },
    { type: "thinking", text: "ignore" },
    { type: "text", text: " beta" },
    { type: "tool_use", name: "TaskUpdate", text: "nope" },
    { type: "text", text: " gamma" },
  ]);
  assert.equal(joined, "alpha beta gamma");
  assert.equal(lastText([{ type: "text", text: "one" }, { type: "text", text: "two" }]), "two");
});

test("12 adapters skip Slack/Linear when intact, demo when no secrets", () => {
  const alarm = decide(seed81838());
  const slackAlarm = slackSpliceAlarm(alarm, {});
  const githubAlarm = githubCodaLedger(alarm, {});
  const linearAlarm = linearRecoveryTicket(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.match(slackAlarm.summary, /would post/i);
  assert.equal(githubAlarm.mode, "demo");
  assert.match(githubAlarm.summary, /would append/i);
  assert.equal(linearAlarm.mode, "demo");
  assert.match(linearAlarm.summary, /would open/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
  assert.doesNotMatch(linearAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackSpliceAlarm(idle, {});
  const linearIdle = linearRecoveryTicket(idle, {});
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /intact/i);
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /intact/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);
});

test("13 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed81838()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("14 handle denies on alarm and allows intact", async () => {
  const denied = await handle(seed81838(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "coda");
  assert.equal(denied.verdict, "split");
  assert.equal(denied.hook_event_name, "PostToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "intact");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /coda/i);
});
