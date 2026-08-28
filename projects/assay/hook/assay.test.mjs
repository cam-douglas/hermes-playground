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
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyCharge,
  hasBoundaryGhost,
  isAbsorb,
  isGhost,
  isJsonXmlMix,
  isMix,
  isPrefix,
  isRetry,
  isSilent,
  missingRequired,
  residueNames,
  seed19765,
  seed31517,
  seed49747,
  seed63879,
  seed64774,
  seed69522,
  seed70544,
  seed70657,
  seed84362,
  seed84405,
  seedIntact,
  seedSilent,
  verdictOf,
} from "./assay.mjs";
import { handle } from "./index.mjs";

test("1 seed 84405 is ghost, alarm, idleWord intact, boundary tag in parsed string", () => {
  const seed = seed84405();
  const result = decide(seed);
  assert.equal(result.verdict, "ghost");
  assert.equal(result.state, "ghost");
  assert.equal(result.decision, "ghost");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.doesNotMatch(result.idleWord, /assay/i);
  assert.equal(result.session, "84405");
  assert.equal(result.issue, 84405);
  assert.equal(result.parseOk, true);
  assert.equal(hasBoundaryGhost(result.delivered), true);
  assert.match(result.delivered.body, /<parameter name=/);
  assert.equal(result.delivered.tags.length, 2);
  assert.match(result.impurity, /boundary tag/i);
  assert.equal(decideSeed(84405).verdict, "ghost");
  assert.equal(decideSeed(seed84405).verdict, "ghost");
  assert.equal(decideSeed("84405").verdict, "ghost");
});

test("2 idle/clear/{} is intact, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "intact");
  assert.equal(result.idleWord, "intact");
  assert.equal(result.verdict, "intact");
  assert.equal(result.decision, "intact");
  assert.equal(result.alarm, false);
  assert.equal(emptyCharge().tool, "");
  assert.equal(emptyCharge().raw, "");
  assert.doesNotMatch(result.state, /assay/i);
  assert.doesNotMatch(result.idleWord, /assay/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "intact");
  assert.equal(cleared.idleWord, "intact");
  assert.equal(cleared.raw, "");
  assert.doesNotMatch(cleared.state, /assay/i);
  assert.doesNotMatch(cleared.idleWord, /assay/i);
  const empty = decide({});
  assert.equal(empty.verdict, "intact");
  assert.equal(empty.idleWord, "intact");
  assert.doesNotMatch(empty.idleWord, /assay/i);
});

test("3 intact control weighs clean and can be admitted", () => {
  const result = decide(seedIntact());
  assert.equal(result.verdict, "intact");
  assert.equal(result.alarm, false);
  assert.equal(result.parseOk, true);
  assert.equal(hasBoundaryGhost(result.delivered), false);
  assert.deepEqual(missingRequired(result.schema, result.delivered), []);
  assert.equal(isGhost(result.charge), false);
  assert.equal(isAbsorb(result.charge), false);
  assert.equal(isMix(result.charge), false);
  const admitted = decide({ action: "admit", charge: result.charge });
  assert.equal(admitted.verdict, "intact");
  assert.equal(admitted.admitted, true);
  assert.equal(admitted.refused, false);
});

test("4 seed 84362 is absorb: vanished field, residue in host", () => {
  const result = decide(seed84362());
  assert.equal(result.verdict, "absorb");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, 84362);
  assert.equal(result.parseOk, true);
  assert.ok(result.missing.includes("tags") || result.charge.delivered.tags === undefined);
  assert.ok(residueNames(result.delivered).includes("tags"));
  assert.equal(result.delivered.tags, undefined);
  assert.match(result.delivered.body, /<parameter name="tags"/);
  assert.match(result.impurity, /vanished/i);
});

test("5 seed 64774 is retry: unparseable and retry also failed", () => {
  const result = decide(seed64774());
  assert.equal(result.verdict, "retry");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 64774);
  assert.equal(result.parseOk, false);
  assert.equal(result.retryFailed, true);
  assert.equal(isRetry(result.charge), true);
  assert.match(result.raw, /retry also failed/i);
});

test("6 seed 49747 is mix: XML-into-JSON, required field undefined", () => {
  const result = decide(seed49747());
  assert.equal(result.verdict, "mix");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 49747);
  assert.equal(isJsonXmlMix(result.raw), true);
  assert.equal(isMix(result.charge), true);
  assert.equal(result.delivered.files_modified, undefined);
  assert.match(result.raw, /<\/parameter>/);
  assert.match(result.raw, /"summary_of_changes"/);
});

test("7 seed 63879 / 70544 is prefix: stray court or dropped antml:", () => {
  const court = decide(seed63879());
  assert.equal(court.verdict, "prefix");
  assert.equal(court.alarm, true);
  assert.equal(court.issue, 63879);
  assert.equal(court.strayToken, "court");
  assert.equal(court.droppedNamespace, true);
  assert.equal(isPrefix(court.charge), true);
  assert.match(court.raw, /^court</);

  const bare = decide(seed70544());
  assert.equal(bare.verdict, "prefix");
  assert.equal(bare.issue, 70544);
  assert.equal(bare.droppedNamespace, true);
  assert.doesNotMatch(bare.raw, /antml:/);
});

test("8 seed 69522 is mangled: unicode-escaped args fail JSON parse", () => {
  const result = decide(seed69522());
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 69522);
  assert.equal(result.parseOk, false);
  assert.match(result.raw, /\\uC548/);
  assert.match(result.impurity, /unicode-escaped/i);
});

test("9 seed 70657 is mangled and contaminates later history", () => {
  const result = decide(seed70657());
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 70657);
  assert.equal(result.contaminates, true);
  assert.equal(result.parseOk, false);
  assert.match(result.impurity, /contaminat/i);
  assert.ok(result.history.some((line) => /malformed/i.test(line)));
});

test("10 Codex 19765 is mangled: truncated function_call.arguments", () => {
  const result = decide(seed19765());
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 19765);
  assert.equal(result.argumentsKind, "truncated");
  assert.equal(result.raw.endsWith("}"), false);
  assert.match(result.impurity, /truncated/i);
});

test("11 Codex 31517 is mangled: arguments is a JSON string", () => {
  const result = decide(seed31517());
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 31517);
  assert.equal(result.argumentsKind, "string");
  assert.equal(typeof result.delivered, "string");
  assert.match(result.impurity, /JSON string/i);
});

test("12 silent: empty-string required arg, parse still succeeds", () => {
  const result = decide(seedSilent());
  assert.equal(result.verdict, "silent");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.parseOk, true);
  assert.equal(isSilent(result.charge), true);
  assert.deepEqual(result.empty, ["body"]);
  assert.equal(result.issue, null);
  assert.doesNotMatch(String(result.source), /#\d{4,}/);
});

test("13 fire / weigh / admit / refuse / hold", () => {
  const ghost = decide(seed84405());
  const fired = decide({ action: "fire", charge: ghost.charge });
  assert.equal(fired.verdict, "ghost");
  assert.equal(fired.fired, true);
  assert.equal(fired.weighed, true);

  const weighed = decide({ action: "weigh", charge: ghost.charge });
  assert.equal(weighed.verdict, "ghost");
  assert.equal(weighed.weighed, true);

  const refused = decide({ action: "refuse", charge: ghost.charge });
  assert.equal(refused.verdict, "ghost");
  assert.equal(refused.refused, true);
  assert.equal(refused.admitted, false);

  const held = decide({ action: "hold", charge: ghost.charge });
  assert.equal(held.verdict, "ghost");
  assert.equal(held.held, true);

  const admittedGhost = decide({ action: "admit", charge: ghost.charge });
  assert.equal(admittedGhost.verdict, "ghost");
  assert.equal(admittedGhost.admitted, false);
  assert.equal(admittedGhost.refused, true);

  const admittedClean = decide({ action: "admit", charge: decide(seedIntact()).charge });
  assert.equal(admittedClean.verdict, "intact");
  assert.equal(admittedClean.admitted, true);
});

test("14 Slack adapter: no webhook → demo would-post; intact skips", () => {
  const alarm = decide(seed84405());
  const slackAlarm = slackImpurityAlarm(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.equal(slackAlarm.ok, true);
  assert.match(slackAlarm.summary, /would post/i);
  assert.match(slackAlarm.summary, /impurity alarm/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackImpurityAlarm(idle, {});
  assert.equal(slackIdle.mode, "demo");
  assert.equal(slackIdle.ok, true);
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /intact/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
});

test("15 GitHub ledger: no token → demo row, never a fake 200", () => {
  const alarm = decide(seed84405());
  const githubAlarm = githubAssayLedger(alarm, {});
  assert.equal(githubAlarm.mode, "demo");
  assert.equal(githubAlarm.ok, true);
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /assay ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
});

test("16 Linear: ghost/absorb incident demo; other classes skip", () => {
  const ghost = decide(seed84405());
  const linearGhost = linearImpurityIncident(ghost, {});
  assert.equal(linearGhost.mode, "demo");
  assert.equal(linearGhost.ok, true);
  assert.match(linearGhost.summary, /would open/i);
  assert.match(linearGhost.summary, /impurity/i);
  assert.doesNotMatch(linearGhost.summary, /\b200\b/);

  const absorb = decide(seed84362());
  const linearAbsorb = linearImpurityIncident(absorb, {});
  assert.match(linearAbsorb.summary, /would open/i);

  const idle = decide({ action: "clear" });
  const linearIdle = linearImpurityIncident(idle, {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /intact/i);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);

  const mangled = decide(seed19765());
  const linearMangled = linearImpurityIncident(mangled, {});
  assert.match(linearMangled.summary, /skip/i);
});

test("17 handle() PreToolUse: alarm → deny; intact → allow", async () => {
  const denied = await handle(seed84405(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "assay");
  assert.equal(denied.verdict, "ghost");
  assert.equal(denied.hook_event_name, "PreToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "intact");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /assay/i);
  assert.doesNotMatch(allowed.idleWord, /assay/i);
});

test("18 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed84405()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("19 alarm set and idle word", () => {
  assert.deepEqual(
    [...VERDICTS],
    ["intact", "ghost", "absorb", "mix", "prefix", "silent", "retry", "mangled"],
  );
  assert.deepEqual(
    [...ALARM_VERDICTS],
    ["ghost", "absorb", "mix", "prefix", "silent", "retry", "mangled"],
  );
  assert.deepEqual([...LINEAR_VERDICTS], ["ghost", "absorb"]);
  assert.equal(ALARM_VERDICTS.includes("intact"), false);
  assert.equal(IDLE_WORD, "intact");
  assert.doesNotMatch(IDLE_WORD, /assay/i);
  assert.equal(classify(emptyCharge()), "intact");
  assert.equal(verdictOf(seed84405().charge), "ghost");
});

test("20 ghost is not absorb: parse ok, every declared field present", () => {
  const result = decide(seed84405());
  assert.equal(isGhost(result.charge), true);
  assert.equal(isAbsorb(result.charge), false);
  assert.deepEqual(missingRequired(result.schema, result.delivered), []);
});
