import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubRepairLedger, linearWedgedIncident, slackBrickAlarm } from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  HOLLOW_SIGNATURE_63147,
  IDLE_WORD,
  PLACEHOLDER,
  VERDICTS,
  decide,
  decideSeed,
  emptyAction,
  emptyDesk,
  inspectBlocks,
  repairTranscript,
  seed10199,
  seed25290,
  seed36551,
  seed63147,
  seed63335,
  seed63463,
  seed68768,
  stripPoison,
  verdictOf,
} from "./sigil.mjs";
import { handle } from "./index.mjs";

test("1 seed 63147 is hollow, alarm, idleWord valid, signature retained", () => {
  const seed = seed63147();
  const result = decide(seed);
  assert.equal(result.verdict, "hollow");
  assert.equal(result.state, "hollow");
  assert.equal(result.decision, "hollow");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "valid");
  assert.equal(IDLE_WORD, "valid");
  assert.doesNotMatch(result.idleWord, /sigil/i);
  assert.equal(result.session, "63147");
  assert.equal(result.issue, 63147);
  assert.equal(result.content[0].type, "thinking");
  assert.equal(result.content[0].thinking, "");
  assert.equal(result.content[0].signature, HOLLOW_SIGNATURE_63147);
  assert.ok(result.content[0].signature.length > 0);
  assert.equal(result.poison[0].kind, "hollow");
  assert.equal(result.poison[0].textLen, 0);
  assert.equal(result.poison[0].signatureLen, HOLLOW_SIGNATURE_63147.length);
  assert.equal(decideSeed(63147).verdict, "hollow");
  assert.equal(decideSeed(seed63147).verdict, "hollow");
  assert.equal(decideSeed("63147").verdict, "hollow");
});

test("2 idle/clear/{} is valid, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "valid");
  assert.equal(result.idleWord, "valid");
  assert.equal(result.verdict, "valid");
  assert.equal(result.decision, "valid");
  assert.equal(result.alarm, false);
  assert.deepEqual(emptyDesk().content, []);
  assert.deepEqual(emptyDesk().errors, []);
  assert.doesNotMatch(result.state, /sigil/i);
  assert.doesNotMatch(result.idleWord, /sigil/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "valid");
  assert.equal(cleared.idleWord, "valid");
  assert.equal(cleared.content.length, 0);
  assert.doesNotMatch(cleared.state, /sigil/i);
  assert.doesNotMatch(cleared.idleWord, /sigil/i);
  const empty = decide({});
  assert.equal(empty.verdict, "valid");
  assert.equal(empty.idleWord, "valid");
  assert.doesNotMatch(empty.idleWord, /sigil/i);
});

test("3 seed 68768 is unsigned, empty thinking, missing signature", () => {
  const result = decide(seed68768());
  assert.equal(result.verdict, "unsigned");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 68768);
  assert.equal(result.content[0].type, "thinking");
  assert.equal(result.content[0].thinking, "");
  assert.equal(result.content[0].signature, "");
  assert.equal(result.poison[0].kind, "unsigned");
  assert.equal(result.poison[0].hasSignature, false);
});

test("4 seed 63463 is wedged, interleaved thinking + subagent 400", () => {
  const result = decide(seed63463());
  assert.equal(result.verdict, "wedged");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 63463);
  assert.match(result.errors[0], /cannot be modified/);
  assert.equal(result.content.some((block) => block.name === "Task"), true);
  assert.ok(result.content.filter((block) => block.type === "thinking").length >= 2);
});

test("5 seed 63335 is wedged, signed thinking replayed modified", () => {
  const result = decide(seed63335());
  assert.equal(result.verdict, "wedged");
  assert.equal(result.alarm, true);
  assert.match(result.errors[0], /cannot be modified/);
  assert.equal(result.content[0].type, "thinking");
  assert.ok(result.content[0].thinking.length > 0);
  assert.ok(result.content[0].signature.length > 0);
});

test("6 seed 10199 is wedged, long-session 400 loop", () => {
  const result = decide(seed10199());
  assert.equal(result.verdict, "wedged");
  assert.equal(result.alarm, true);
  assert.match(result.errors[0], /messages\.71\.content\.8/);
  assert.match(result.errors[0], /cannot be modified/);
});

test("7 strip of 63147 → stripped, thinking gone, text/tool_use byte-stable", () => {
  const hollow = decide(seed63147());
  assert.equal(hollow.verdict, "hollow");
  const text = hollow.content[1];
  const tool = hollow.content[2];
  const stripped = decide({ action: "strip", desk: hollow.desk });
  assert.equal(stripped.verdict, "stripped");
  assert.equal(stripped.state, "stripped");
  assert.equal(stripped.decision, "stripped");
  assert.equal(stripped.alarm, false);
  assert.equal(stripped.recovered, true);
  assert.equal(stripped.stripped, true);
  assert.equal(stripped.content.some((block) => block.type === "thinking"), false);
  assert.deepEqual(stripped.content[0], text);
  assert.deepEqual(stripped.content[1], tool);
  assert.equal(stripped.dropped[0].kind, "hollow");
  assert.equal(stripped.resumeSafe, true);
});

test("8 quarantine of 63147 → resume-safe, no hollow replay", () => {
  const hollow = decide(seed63147());
  const sealed = decide({ action: "quarantine", desk: hollow.desk });
  assert.equal(sealed.verdict, "resume-safe");
  assert.equal(sealed.state, "resume-safe");
  assert.equal(sealed.decision, "resume-safe");
  assert.equal(sealed.alarm, false);
  assert.equal(sealed.quarantined, true);
  assert.equal(sealed.resumeSafe, true);
  assert.equal(inspectBlocks(sealed.content).some((row) => row.kind === "hollow"), false);
  assert.equal(inspectBlocks(sealed.content).some((row) => row.kind === "unsigned"), false);
});

test("9 strip of 68768 → stripped, unsigned gone, text/tool_use kept", () => {
  const unsigned = decide(seed68768());
  const stripped = decide({ action: "strip", desk: unsigned.desk });
  assert.equal(stripped.verdict, "stripped");
  assert.equal(stripped.content.some((block) => block.type === "thinking"), false);
  assert.equal(stripped.content[0].type, "text");
  assert.equal(stripped.content[0].text, "Running the permission-mode switch.");
  assert.equal(stripped.content[1].type, "tool_use");
  assert.equal(stripped.content[1].name, "Bash");
  assert.equal(stripped.dropped[0].kind, "unsigned");
});

test("10 Slack adapter: no webhook → demo would-post; valid skips", () => {
  const alarm = decide(seed63147());
  const slackAlarm = slackBrickAlarm(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.equal(slackAlarm.ok, true);
  assert.match(slackAlarm.summary, /would post/i);
  assert.match(slackAlarm.summary, /brick alarm/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackBrickAlarm(idle, {});
  assert.equal(slackIdle.mode, "demo");
  assert.equal(slackIdle.ok, true);
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /valid/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
});

test("11 GitHub ledger: no token → demo row; repair writes ledger", () => {
  const alarm = decide(seed63147());
  const githubAlarm = githubRepairLedger(alarm, {});
  assert.equal(githubAlarm.mode, "demo");
  assert.equal(githubAlarm.ok, true);
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /repair ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);

  const repaired = decide({ action: "strip", desk: alarm.desk });
  const githubRepair = githubRepairLedger(repaired, {});
  assert.match(githubRepair.summary, /would append a GitHub repair ledger row/i);
  assert.doesNotMatch(githubRepair.summary, /\b200\b/);
});

test("12 Linear: no key → wedged incident demo; valid/stripped skip", () => {
  const wedged = decide(seed63463());
  const linearWedged = linearWedgedIncident(wedged, {});
  assert.equal(linearWedged.mode, "demo");
  assert.equal(linearWedged.ok, true);
  assert.match(linearWedged.summary, /would open/i);
  assert.match(linearWedged.summary, /wedged-session/i);
  assert.doesNotMatch(linearWedged.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const linearIdle = linearWedgedIncident(idle, {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /valid/i);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);

  const stripped = decide({ action: "strip", desk: decide(seed63147()).desk });
  const linearStripped = linearWedgedIncident(stripped, {});
  assert.match(linearStripped.summary, /skip/i);
  assert.match(linearStripped.summary, /stripped/i);
});

test("13 handle() PostToolUse: alarm → deny; valid → allow", async () => {
  const denied = await handle(seed63147(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "sigil");
  assert.equal(denied.verdict, "hollow");
  assert.equal(denied.hook_event_name, "PostToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "valid");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /sigil/i);
  assert.doesNotMatch(allowed.idleWord, /sigil/i);
});

test("14 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed63147()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("15 alarm set is hollow/unsigned/wedged; idle word is valid", () => {
  assert.deepEqual([...VERDICTS], ["valid", "hollow", "unsigned", "wedged", "stripped", "resume-safe"]);
  assert.deepEqual([...ALARM_VERDICTS], ["hollow", "unsigned", "wedged"]);
  assert.equal(ALARM_VERDICTS.includes("valid"), false);
  assert.equal(ALARM_VERDICTS.includes("stripped"), false);
  assert.equal(ALARM_VERDICTS.includes("resume-safe"), false);
  assert.equal(IDLE_WORD, "valid");
  assert.doesNotMatch(IDLE_WORD, /sigil/i);
});

test("16 thinking-only message gets placeholder; signatures are never invented", () => {
  const content = [{ type: "thinking", thinking: "", signature: HOLLOW_SIGNATURE_63147 }];
  const cleaned = stripPoison(content);
  assert.equal(cleaned.length, 1);
  assert.equal(cleaned[0].type, "text");
  assert.equal(cleaned[0].text, PLACEHOLDER);
  assert.equal(Object.hasOwn(cleaned[0], "signature"), false);
  const findings = inspectBlocks(content);
  assert.equal(findings[0].kind, "hollow");
});

test("17 inspectBlocks classifies hollow, unsigned, and valid thinking", () => {
  const findings = inspectBlocks([
    { type: "thinking", thinking: "", signature: HOLLOW_SIGNATURE_63147 },
    { type: "thinking", thinking: "", signature: "" },
    { type: "thinking", thinking: "plan the edit", signature: HOLLOW_SIGNATURE_63147 },
    { type: "text", text: "ok" },
    { type: "tool_use", id: "tu1", name: "Read" },
  ]);
  assert.equal(findings[0].kind, "hollow");
  assert.equal(findings[1].kind, "unsigned");
  assert.equal(findings[2].kind, "valid");
  assert.equal(findings[3].kind, "keep");
  assert.equal(findings[4].kind, "keep");
  assert.equal(verdictOf({ content: [findings[2]].map(() => ({ type: "thinking", thinking: "plan the edit", signature: HOLLOW_SIGNATURE_63147 })) }), "valid");
});

test("18 repairTranscript JSONL drops hollow thinking and ledgers the change", () => {
  const lines = [
    JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text: "go" }] } }),
    JSON.stringify({
      type: "assistant",
      message: {
        role: "assistant",
        content: [
          { type: "thinking", thinking: "", signature: HOLLOW_SIGNATURE_63147 },
          { type: "text", text: "Inspecting the stream handler." },
        ],
      },
    }),
  ].join("\n");
  const repaired = repairTranscript(lines);
  assert.equal(repaired.repaired, true);
  assert.equal(repaired.dropped, 1);
  assert.equal(repaired.ledger[0].kind, "hollow");
  const assistant = repaired.messages[1];
  assert.equal(assistant.message.content.some((block) => block.type === "thinking"), false);
  assert.equal(assistant.message.content[0].type, "text");
  assert.equal(assistant.message.content[0].text, "Inspecting the stream handler.");
});

test("19 hold keeps the poison verdict and still alarms", () => {
  const hollow = decide(seed63147());
  const held = decide({ action: "hold", desk: hollow.desk });
  assert.equal(held.verdict, "hollow");
  assert.equal(held.held, true);
  assert.equal(held.alarm, true);
  const unsigned = decide({ action: "hold", desk: decide(seed68768()).desk });
  assert.equal(unsigned.verdict, "unsigned");
  assert.equal(unsigned.held, true);
});

test("20 cousin seeds 25290 wedged encrypted, 36551 unsigned incompatible", () => {
  const encrypted = decide(seed25290());
  assert.equal(encrypted.verdict, "wedged");
  assert.equal(encrypted.alarm, true);
  assert.match(encrypted.errors[0], /invalid_encrypted_content/);
  assert.equal(inspectBlocks(encrypted.content)[0].kind, "encrypted");

  const incompatible = decide(seed36551());
  assert.equal(incompatible.verdict, "unsigned");
  assert.equal(incompatible.alarm, true);
  assert.equal(inspectBlocks(incompatible.content)[0].kind, "incompatible");

  const cleaned = decide({ action: "strip", desk: incompatible.desk });
  assert.equal(cleaned.verdict, "stripped");
  assert.equal(cleaned.content.some((block) => block.type === "reasoning"), false);
  assert.equal(cleaned.content[0].type, "text");
});
