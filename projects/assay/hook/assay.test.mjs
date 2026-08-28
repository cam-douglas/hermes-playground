import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubAssayLedger,
  linearImpurityIncident,
  slackImpurityAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyCharge,
  hasBoundaryGhost,
  isAbsorbed,
  isGarbled,
  isHollow,
  isJsonXmlMix,
  isLeaked,
  isRetried,
  isSpoiled,
  isTainted,
  missingRequired,
  residueNames,
  seed19765,
  seed26379,
  seed31517,
  seed49747,
  seed62123,
  seed63604,
  seed63870,
  seed64108,
  seed64774,
  seed66153,
  seed67307,
  seed70657,
  seed84362,
  seed84405,
  seedSterling,
  verdictOf,
} from "./assay.mjs";
import { handle } from "./index.mjs";

test("1 seed 84405 is tainted, linear, idleWord sterling, boundary tag in parsed string", () => {
  const seed = seed84405();
  const result = decide(seed);
  assert.equal(result.verdict, "tainted");
  assert.equal(result.state, "tainted");
  assert.equal(result.decision, "tainted");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.idleWord, "sterling");
  assert.equal(IDLE_WORD, "sterling");
  assert.doesNotMatch(result.idleWord, /assay/i);
  assert.equal(result.session, "84405");
  assert.equal(result.issue, 84405);
  assert.equal(result.parseOk, true);
  assert.equal(hasBoundaryGhost(result.delivered), true);
  assert.match(result.delivered.body, /<parameter name=/);
  assert.equal(result.delivered.tags.length, 2);
  assert.match(result.impurity, /boundary tag/i);
  assert.equal(decideSeed(84405).verdict, "tainted");
  assert.equal(decideSeed(seed84405).verdict, "tainted");
  assert.equal(decideSeed("84405").verdict, "tainted");
});

test("2 idle/clear/{} is sterling, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "sterling");
  assert.equal(result.idleWord, "sterling");
  assert.equal(result.verdict, "sterling");
  assert.equal(result.decision, "sterling");
  assert.equal(result.alarm, false);
  assert.equal(emptyCharge().tool, "");
  assert.equal(emptyCharge().raw, "");
  assert.doesNotMatch(result.state, /assay/i);
  assert.doesNotMatch(result.idleWord, /assay/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "sterling");
  assert.equal(cleared.idleWord, "sterling");
  assert.equal(cleared.raw, "");
  assert.doesNotMatch(cleared.state, /assay/i);
  assert.doesNotMatch(cleared.idleWord, /assay/i);
  const empty = decide({});
  assert.equal(empty.verdict, "sterling");
  assert.equal(empty.idleWord, "sterling");
  assert.doesNotMatch(empty.idleWord, /assay/i);
});

test("3 sterling control weighs clean and can be admitted", () => {
  const result = decide(seedSterling());
  assert.equal(result.verdict, "sterling");
  assert.equal(result.alarm, false);
  assert.equal(result.parseOk, true);
  assert.equal(hasBoundaryGhost(result.delivered), false);
  assert.deepEqual(missingRequired(result.schema, result.delivered), []);
  assert.equal(isTainted(result.charge), false);
  assert.equal(isAbsorbed(result.charge), false);
  assert.equal(isLeaked(result.charge), false);
  const admitted = decide({ action: "admit", charge: result.charge });
  assert.equal(admitted.verdict, "sterling");
  assert.equal(admitted.admitted, true);
  assert.equal(admitted.refused, false);
});

test("4 seed 84362 is absorbed: vanished field, residue in host", () => {
  const result = decide(seed84362());
  assert.equal(result.verdict, "absorbed");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, 84362);
  assert.equal(result.parseOk, true);
  assert.ok(residueNames(result.delivered).includes("tags"));
  assert.equal(result.delivered.tags, undefined);
  assert.match(result.delivered.body, /<parameter name="tags"/);
  assert.match(result.impurity, /swallowed|vanished/i);
});

test("5 seed 64774 / 62123 is retried; 63604 is garbled", () => {
  const retried = decide(seed64774());
  assert.equal(retried.verdict, "retried");
  assert.equal(retried.alarm, true);
  assert.equal(retried.issue, 64774);
  assert.equal(retried.parseOk, false);
  assert.equal(retried.retryFailed, true);
  assert.equal(isRetried(retried.charge), true);

  const traffic = decide(seed62123());
  assert.equal(traffic.verdict, "retried");
  assert.equal(traffic.issue, 62123);
  assert.equal(traffic.retryFailed, true);

  const discarded = decide(seed63604());
  assert.equal(discarded.verdict, "garbled");
  assert.equal(discarded.issue, 63604);
  assert.equal(discarded.retryFailed, false);
  assert.equal(isGarbled(discarded.charge), true);
});

test("6 seed 49747 is leaked: XML-into-JSON, required field undefined", () => {
  const result = decide(seed49747());
  assert.equal(result.verdict, "leaked");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 49747);
  assert.equal(isJsonXmlMix(result.raw), true);
  assert.equal(isLeaked(result.charge), true);
  assert.equal(result.delivered.files_modified, undefined);
  assert.match(result.raw, /<\/parameter>/);
  assert.match(result.raw, /"summary_of_changes"/);
});

test("7 hollow seeds: court/call + invoke rendered as plain text", () => {
  for (const [fn, issue] of [
    [seed63870, 63870],
    [seed64108, 64108],
    [seed66153, 66153],
    [seed67307, 67307],
  ]) {
    const result = decide(fn());
    assert.equal(result.verdict, "hollow", String(issue));
    assert.equal(result.alarm, true);
    assert.equal(result.issue, issue);
    assert.equal(result.charge.plainText, true);
    assert.equal(result.charge.dispatched, false);
    assert.equal(isHollow(result.charge), true);
  }
});

test("8 seed 70657 is spoiled: contaminates later history", () => {
  const result = decide(seed70657());
  assert.equal(result.verdict, "spoiled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 70657);
  assert.equal(result.contaminates, true);
  assert.equal(isSpoiled(result.charge), true);
  assert.match(result.impurity, /contaminat/i);
});

test("9 Codex 19765 / 31517 garbled; 26379 spoiled", () => {
  const truncated = decide(seed19765());
  assert.equal(truncated.verdict, "garbled");
  assert.equal(truncated.issue, 19765);
  assert.equal(truncated.argumentsKind, "truncated");
  assert.match(truncated.impurity, /truncated/i);

  const wrapped = decide(seed31517());
  assert.equal(wrapped.verdict, "garbled");
  assert.equal(wrapped.issue, 31517);
  assert.equal(typeof wrapped.delivered, "string");

  const poison = decide(seed26379());
  assert.equal(poison.verdict, "spoiled");
  assert.equal(poison.issue, 26379);
  assert.equal(poison.contaminates, true);
});

test("10 fire / weigh / admit / refuse / hold", () => {
  const tainted = decide(seed84405());
  const fired = decide({ action: "fire", charge: tainted.charge });
  assert.equal(fired.verdict, "tainted");
  assert.equal(fired.fired, true);

  const weighed = decide({ action: "weigh", charge: tainted.charge });
  assert.equal(weighed.verdict, "tainted");
  assert.equal(weighed.weighed, true);

  const refused = decide({ action: "refuse", charge: tainted.charge });
  assert.equal(refused.verdict, "tainted");
  assert.equal(refused.refused, true);

  const held = decide({ action: "hold", charge: tainted.charge });
  assert.equal(held.verdict, "tainted");
  assert.equal(held.held, true);

  const admittedBad = decide({ action: "admit", charge: tainted.charge });
  assert.equal(admittedBad.verdict, "tainted");
  assert.equal(admittedBad.admitted, false);
  assert.equal(admittedBad.refused, true);

  const admittedClean = decide({ action: "admit", charge: decide(seedSterling()).charge });
  assert.equal(admittedClean.verdict, "sterling");
  assert.equal(admittedClean.admitted, true);
});

test("11 Slack: absorbed/hollow would-post; tainted/sterling skip", () => {
  const absorbed = slackImpurityAlarm(decide(seed84362()), {});
  assert.equal(absorbed.mode, "demo");
  assert.match(absorbed.summary, /would post/i);
  assert.match(absorbed.summary, /impurity alarm/i);
  assert.doesNotMatch(absorbed.summary, /\b200\b/);

  const hollow = slackImpurityAlarm(decide(seed63870()), {});
  assert.match(hollow.summary, /would post/i);

  const tainted = slackImpurityAlarm(decide(seed84405()), {});
  assert.match(tainted.summary, /skip/i);
  assert.match(tainted.summary, /tainted/i);

  const idle = slackImpurityAlarm(decide({ action: "clear" }), {});
  assert.match(idle.summary, /skip/i);
  assert.match(idle.summary, /sterling/i);
  assert.doesNotMatch(idle.summary, /\b200\b/);
});

test("12 GitHub ledger: no token → demo row, never a fake 200", () => {
  const githubAlarm = githubAssayLedger(decide(seed84405()), {});
  assert.equal(githubAlarm.mode, "demo");
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /assay ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
});

test("13 Linear: tainted/absorbed incident demo; other classes skip", () => {
  const linearTainted = linearImpurityIncident(decide(seed84405()), {});
  assert.match(linearTainted.summary, /would open/i);
  assert.match(linearTainted.summary, /tool-assay/i);
  assert.doesNotMatch(linearTainted.summary, /\b200\b/);

  const linearAbsorbed = linearImpurityIncident(decide(seed84362()), {});
  assert.match(linearAbsorbed.summary, /would open/i);

  const linearIdle = linearImpurityIncident(decide({ action: "clear" }), {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /sterling/i);

  const linearHollow = linearImpurityIncident(decide(seed63870()), {});
  assert.match(linearHollow.summary, /skip/i);
});

test("14 handle() PreToolUse: alarm → deny; sterling → allow", async () => {
  const denied = await handle(seed84405(), {});
  assert.equal(denied.product, "assay");
  assert.equal(denied.verdict, "tainted");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "sterling");
  assert.equal(allowed.permissionDecision, "allow");
  assert.doesNotMatch(allowed.state, /assay/i);
  assert.doesNotMatch(allowed.idleWord, /assay/i);
});

test("15 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed84362()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("16 locked vocabulary and idle word", () => {
  assert.deepEqual(
    [...VERDICTS],
    ["sterling", "tainted", "absorbed", "leaked", "hollow", "garbled", "spoiled", "retried"],
  );
  assert.deepEqual(
    [...ALARM_VERDICTS],
    ["tainted", "absorbed", "leaked", "hollow", "garbled", "spoiled", "retried"],
  );
  assert.deepEqual([...SLACK_VERDICTS], ["absorbed", "hollow"]);
  assert.deepEqual([...LINEAR_VERDICTS], ["absorbed", "tainted"]);
  assert.equal(ALARM_VERDICTS.includes("sterling"), false);
  assert.equal(IDLE_WORD, "sterling");
  assert.doesNotMatch(IDLE_WORD, /assay/i);
  assert.equal(classify(emptyCharge()), "sterling");
  assert.equal(verdictOf(seed84405().charge), "tainted");
});

test("17 tainted is not absorbed: parse ok, every declared field present", () => {
  const result = decide(seed84405());
  assert.equal(isTainted(result.charge), true);
  assert.equal(isAbsorbed(result.charge), false);
  assert.deepEqual(missingRequired(result.schema, result.delivered), []);
});
