import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubVetoLedger,
  linearSilentOverride,
  slackVetoAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  FAIL_CLOSED,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  namesGhostTool,
  overlayPresent,
  seed80988,
  seed81263,
  seed87635,
  seedDeadlock,
  seedRestored,
  seedShadowed,
  seedSilent,
  seedUpheld,
  verdictOf,
} from "./veto.mjs";
import { handle } from "./index.mjs";

test("1 seed 80988 is vetoed, fail-closed, idleWord upheld", () => {
  const seed = seed80988();
  const result = decide(seed);
  assert.equal(result.verdict, "vetoed");
  assert.equal(result.state, "vetoed");
  assert.equal(result.decision, "vetoed");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.idleWord, "upheld");
  assert.equal(IDLE_WORD, "upheld");
  assert.doesNotMatch(result.idleWord, /veto/i);
  assert.doesNotMatch(result.idleWord, /still/i);
  assert.doesNotMatch(result.idleWord, /sterling/i);
  assert.equal(result.session, "80988");
  assert.equal(result.issue, 80988);
  assert.equal(result.overlayPresent, true);
  assert.equal(result.observedAgentDispatches, 0);
  assert.equal(result.mandate, true);
  assert.equal(result.opus5, true);
  assert.equal(decideSeed(80988).verdict, "vetoed");
  assert.equal(decideSeed(seed80988).verdict, "vetoed");
});

test("2 idle/clear/{} is upheld, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "upheld");
  assert.equal(result.idleWord, "upheld");
  assert.equal(result.verdict, "upheld");
  assert.equal(result.decision, "upheld");
  assert.equal(result.alarm, false);
  assert.equal(emptyProbe().systemPromptText, "");
  assert.doesNotMatch(result.state, /veto/i);
  assert.doesNotMatch(result.idleWord, /veto/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "upheld");
  assert.equal(cleared.idleWord, "upheld");
  assert.equal(cleared.systemPromptText, "");
  const empty = decide({});
  assert.equal(empty.verdict, "upheld");
  assert.equal(empty.idleWord, "upheld");
});

test("3 upheld: sonnet, no heron_brook lines, user policy stands", () => {
  const result = decide(seedUpheld());
  assert.equal(result.verdict, "upheld");
  assert.equal(result.alarm, false);
  assert.equal(result.overlayPresent, false);
  assert.equal(result.mandate, true);
  assert.equal(result.opus5, false);
  assert.match(result.model, /sonnet/i);
  assert.ok(result.observedAgentDispatches > 0);
});

test("4 shadowed: injection present, user policy visible, critic dispatched", () => {
  const result = decide(seedShadowed());
  assert.equal(result.verdict, "shadowed");
  assert.equal(result.overlayPresent, true);
  assert.equal(result.mandate, true);
  assert.ok(result.observedAgentDispatches > 0);
  assert.equal(result.alarm, false);
  assert.ok(result.reasons.some((row) => /visible underneath/i.test(row)));
});

test("5 misattributed #87635: model blames the user's CLAUDE.md", () => {
  const result = decide(seed87635());
  assert.equal(result.verdict, "misattributed");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, 87635);
  assert.equal(result.overlayPresent, true);
  assert.match(result.modelAttribution, /your CLAUDE\.md/);
  assert.doesNotMatch(result.claudeMdText, /AgentTool/);
});

test("6 ghost #81263: clamp names AgentTool, surface tool is Agent", () => {
  const result = decide(seed81263());
  assert.equal(result.verdict, "ghost");
  assert.equal(result.issue, 81263);
  assert.equal(result.namesGhostTool, true);
  assert.equal(namesGhostTool(result.probe), true);
  assert.match(result.systemPromptText, /AgentTool/);
  assert.match(result.systemPromptText, /\bAgent\b/);
  assert.equal(result.mandate, false);
  assert.equal(result.alarm, false);
});

test("7 deadlock: parent write blocked and mandated Agent never dispatched", () => {
  const result = decide(seedDeadlock());
  assert.equal(result.verdict, "deadlock");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.parentWriteBlocked, true);
  assert.equal(result.observedAgentDispatches, 0);
  assert.equal(result.overlayPresent, true);
  assert.equal(result.mandate, true);
});

test("8 silent: conflict resolved with no operator signal", () => {
  const result = decide(seedSilent());
  assert.equal(result.verdict, "silent");
  assert.equal(result.overlayPresent, true);
  assert.equal(result.mandate, true);
  assert.equal(result.observedAgentDispatches, 0);
  assert.equal(result.operatorSignaled, false);
  assert.equal(result.alarm, false);
  assert.ok(result.reasons.some((row) => /no signal/i.test(row)));
});

test("9 restored: UserPromptSubmit standing-request satisfies the clamp", () => {
  const result = decide(seedRestored());
  assert.equal(result.verdict, "restored");
  assert.equal(result.restored, true);
  assert.equal(result.overlayPresent, true);
  assert.match(result.additionalContext, /user requested/i);
  assert.ok(result.observedAgentDispatches > 0);
  assert.equal(result.alarm, false);

  const applied = decide({ action: "restore", probe: seed80988().probe });
  assert.equal(applied.verdict, "restored");
  assert.equal(applied.restored, true);
});

test("10 fail-closed on vetoed / misattributed / deadlock", async () => {
  const vetoed = await handle(seed80988(), {});
  assert.equal(vetoed.permissionDecision, "deny");
  assert.equal(vetoed.hookSpecificOutput.decision.interrupt, true);

  const blamed = await handle(seed87635(), {});
  assert.equal(blamed.permissionDecision, "deny");

  const stuck = await handle(seedDeadlock(), {});
  assert.equal(stuck.permissionDecision, "deny");

  const ok = await handle({ action: "clear" }, {});
  assert.equal(ok.verdict, "upheld");
  assert.equal(ok.permissionDecision, "allow");
  assert.doesNotMatch(ok.idleWord, /veto/i);
});

test("11 Slack: vetoed/misattributed/deadlock would-post; upheld skip", () => {
  const vetoed = slackVetoAlarm(decide(seed80988()), {});
  assert.equal(vetoed.mode, "demo");
  assert.match(vetoed.summary, /would post/i);
  assert.match(vetoed.summary, /overlay alarm/i);
  assert.doesNotMatch(vetoed.summary, /\b200\b/);

  const blamed = slackVetoAlarm(decide(seed87635()), {});
  assert.match(blamed.summary, /would post/i);

  const stuck = slackVetoAlarm(decide(seedDeadlock()), {});
  assert.match(stuck.summary, /would post/i);

  const idle = slackVetoAlarm(decide({ action: "clear" }), {});
  assert.match(idle.summary, /skip/i);
  assert.match(idle.summary, /upheld/i);
  assert.doesNotMatch(idle.summary, /\b200\b/);
});

test("12 GitHub ledger: every scored probe, no token → demo row", () => {
  const githubAlarm = githubVetoLedger(decide(seed80988()), {});
  assert.equal(githubAlarm.mode, "demo");
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /veto ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);

  const githubIdle = githubVetoLedger(decide({ action: "clear" }), {});
  assert.match(githubIdle.summary, /would append/i);
});

test("13 Linear: vetoed/misattributed incident demo; other classes skip", () => {
  const linearVetoed = linearSilentOverride(decide(seed80988()), {});
  assert.match(linearVetoed.summary, /would open/i);
  assert.match(linearVetoed.summary, /silent-override/i);
  assert.doesNotMatch(linearVetoed.summary, /\b200\b/);

  const linearBlamed = linearSilentOverride(decide(seed87635()), {});
  assert.match(linearBlamed.summary, /would open/i);

  const linearIdle = linearSilentOverride(decide({ action: "clear" }), {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /upheld/i);

  const linearGhost = linearSilentOverride(decide(seed81263()), {});
  assert.match(linearGhost.summary, /skip/i);

  const linearDeadlock = linearSilentOverride(decide(seedDeadlock()), {});
  assert.match(linearDeadlock.summary, /skip/i);
});

test("14 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed80988()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("15 locked vocabulary and idle word", () => {
  assert.deepEqual(
    [...VERDICTS],
    ["upheld", "shadowed", "vetoed", "misattributed", "ghost", "deadlock", "silent", "restored"],
  );
  assert.deepEqual([...FAIL_CLOSED], ["vetoed", "misattributed", "deadlock"]);
  assert.deepEqual([...ALARM_VERDICTS], ["vetoed", "misattributed", "deadlock"]);
  assert.deepEqual([...SLACK_VERDICTS], ["vetoed", "misattributed", "deadlock"]);
  assert.deepEqual([...LINEAR_VERDICTS], ["vetoed", "misattributed"]);
  assert.equal(ALARM_VERDICTS.includes("upheld"), false);
  assert.equal(IDLE_WORD, "upheld");
  assert.doesNotMatch(IDLE_WORD, /veto/i);
  assert.doesNotMatch(IDLE_WORD, /still/i);
  assert.doesNotMatch(IDLE_WORD, /sterling/i);
  assert.equal(classify(emptyProbe()), "upheld");
  assert.equal(verdictOf(seed80988().probe), "vetoed");
  assert.equal(overlayPresent(seed80988().probe), true);
  assert.equal(overlayPresent(seedUpheld().probe), false);
});
