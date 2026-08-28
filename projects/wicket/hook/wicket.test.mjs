import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubIsolationLedger,
  linearDataLossIncident,
  slackIsolationAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyGate,
  isRelativeTo,
  normalizePath,
  reboundPath,
  seed56137,
  seed59628,
  seed64322,
  seed74726,
  seed81333,
  seed85448,
  seed86584reap,
  seed86584swap,
  seed89102,
  seedHome,
  verdictOf,
} from "./wicket.mjs";
import { handle } from "./index.mjs";

test("1 seed 74726 is escape, alarm, idleWord home, absolute path in main", () => {
  const seed = seed74726();
  const result = decide(seed);
  assert.equal(result.verdict, "escape");
  assert.equal(result.state, "escape");
  assert.equal(result.decision, "escape");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "home");
  assert.equal(IDLE_WORD, "home");
  assert.doesNotMatch(result.idleWord, /wicket/i);
  assert.equal(result.session, "74726");
  assert.equal(result.issue, 74726);
  assert.equal(result.filePath, "/repo/src/handler.ts");
  assert.equal(result.pin, "/repo/.claude/worktrees/agent-74726");
  assert.equal(result.contained, false);
  assert.equal(result.dataLoss, true);
  assert.equal(isRelativeTo(result.filePath, result.pin), false);
  assert.equal(isRelativeTo(result.filePath, result.main), true);
  assert.equal(decideSeed(74726).verdict, "escape");
  assert.equal(decideSeed(seed74726).verdict, "escape");
  assert.equal(decideSeed("74726").verdict, "escape");
});

test("2 idle/clear/{} is home, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "home");
  assert.equal(result.idleWord, "home");
  assert.equal(result.verdict, "home");
  assert.equal(result.decision, "home");
  assert.equal(result.alarm, false);
  assert.equal(emptyGate().pin, "");
  assert.equal(emptyGate().filePath, "");
  assert.doesNotMatch(result.state, /wicket/i);
  assert.doesNotMatch(result.idleWord, /wicket/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "home");
  assert.equal(cleared.idleWord, "home");
  assert.equal(cleared.filePath, "");
  assert.doesNotMatch(cleared.state, /wicket/i);
  assert.doesNotMatch(cleared.idleWord, /wicket/i);
  const empty = decide({});
  assert.equal(empty.verdict, "home");
  assert.equal(empty.idleWord, "home");
  assert.doesNotMatch(empty.idleWord, /wicket/i);
});

test("3 home: write inside the pinned worktree is admitted", () => {
  const result = decide(seedHome());
  assert.equal(result.verdict, "home");
  assert.equal(result.alarm, false);
  assert.equal(result.contained, true);
  assert.equal(result.dataLoss, false);
  assert.equal(isRelativeTo(result.filePath, result.pin), true);
  const admitted = decide({ action: "admit", gate: result.gate });
  assert.equal(admitted.verdict, "home");
  assert.equal(admitted.admitted, true);
  assert.equal(admitted.refused, false);
});

test("4 sibling-prefix false-friend: /tmp/wt-other is not inside /tmp/wt", () => {
  assert.equal(isRelativeTo("/tmp/wt-other/src/app.ts", "/tmp/wt"), false);
  assert.equal(isRelativeTo("/tmp/wt/src/app.ts", "/tmp/wt"), true);
  assert.equal(normalizePath("/tmp/wt-other").startsWith(normalizePath("/tmp/wt")), true);
  const result = decide(seed64322());
  assert.equal(result.verdict, "escape");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 64322);
  assert.equal(result.filePath, "/tmp/wt-other/src/app.ts");
  assert.equal(result.pin, "/tmp/wt");
  assert.equal(result.contained, false);
  assert.equal(result.prefixFalseFriend, true);
  const insideSibling = decide({
    gate: {
      pin: "/tmp/wt-other",
      main: "/tmp/main",
      filePath: "/tmp/wt-other/src/app.ts",
      cwd: "/tmp/wt-other",
      tool: "Write",
      isolation: "worktree",
    },
  });
  assert.equal(insideSibling.verdict, "home");
  assert.equal(insideSibling.contained, true);
  assert.equal(insideSibling.prefixFalseFriend, false);
});

test("5 seed 89102 is latch, even pwd refused", () => {
  const result = decide(seed89102());
  assert.equal(result.verdict, "latch");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 89102);
  assert.equal(result.command, "pwd");
  assert.equal(result.latch, true);
  assert.equal(isRelativeTo(result.filePath, result.pin), true);
});

test("6 seed 86584 reap: idle parent reaps a live child's worktree", () => {
  const result = decide(seed86584reap());
  assert.equal(result.verdict, "reap");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 86584);
  assert.equal(result.reaped, true);
  assert.equal(result.childAlive, true);
  assert.equal(result.parentIdle, true);
  assert.equal(result.session, "86584-reap");
});

test("7 seed 86584 swap: sibling cwd leaked onto this pin", () => {
  const result = decide(seed86584swap());
  assert.equal(result.verdict, "swap");
  assert.equal(result.alarm, false);
  assert.equal(result.issue, 86584);
  assert.equal(result.cwd, "/repo/.claude/worktrees/agent-b");
  assert.equal(result.pin, "/repo/.claude/worktrees/agent-a");
  assert.equal(result.siblingCwd, "/repo/.claude/worktrees/agent-b");
  assert.notEqual(result.cwd, result.pin);
});

test("8 seed 85448 is misbind: bound to caller cwd, not target repo", () => {
  const result = decide(seed85448());
  assert.equal(result.verdict, "misbind");
  assert.equal(result.alarm, false);
  assert.equal(result.issue, 85448);
  assert.equal(result.bindCwd, "/workspace/repo-A");
  assert.equal(result.targetRepo, "/workspace/repo-D");
  assert.notEqual(result.bindCwd, result.targetRepo);
});

test("9 seed 81333 reset-hard unguarded in main is escape data-loss", () => {
  const result = decide(seed81333());
  assert.equal(result.verdict, "escape");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 81333);
  assert.equal(result.resetHard, true);
  assert.equal(result.guardFired, false);
  assert.equal(result.dataLoss, true);
  assert.equal(result.mutatedMain, true);
  assert.match(result.command, /git reset --hard/);
  assert.equal(isRelativeTo(result.cwd, result.pin), false);
  assert.equal(isRelativeTo(result.cwd, result.main), true);
});

test("10 same escape class: 59628 and 56137 write the parent checkout", () => {
  const parent = decide(seed59628());
  assert.equal(parent.verdict, "escape");
  assert.equal(parent.filePath, "/io/io_utils.py");
  assert.equal(parent.dataLoss, true);
  const group = decide(seed56137());
  assert.equal(group.verdict, "escape");
  assert.equal(group.filePath, "/app/src/seed.ts");
  assert.equal(isRelativeTo(group.filePath, group.pin), false);
});

test("11 rebound of 74726 → home, path rewritten into the pin", () => {
  const escaped = decide(seed74726());
  assert.equal(escaped.verdict, "escape");
  const bounced = decide({ action: "rebound", gate: escaped.gate });
  assert.equal(bounced.verdict, "home");
  assert.equal(bounced.rebound, true);
  assert.equal(bounced.admitted, true);
  assert.equal(bounced.alarm, false);
  assert.equal(bounced.filePath, "/repo/.claude/worktrees/agent-74726/src/handler.ts");
  assert.equal(isRelativeTo(bounced.filePath, bounced.pin), true);
  assert.equal(bounced.contained, true);
  assert.equal(
    reboundPath("/tmp/wt-other/src/app.ts", "/tmp/wt"),
    "/tmp/wt/src/app.ts",
  );
});

test("12 refuse keeps the failure class; hold keeps it too", () => {
  const escaped = decide(seed74726());
  const refused = decide({ action: "refuse", gate: escaped.gate });
  assert.equal(refused.verdict, "escape");
  assert.equal(refused.refused, true);
  assert.equal(refused.alarm, true);
  const held = decide({ action: "hold", gate: escaped.gate });
  assert.equal(held.verdict, "escape");
  assert.equal(held.held, true);
  assert.equal(held.alarm, true);
  const latchHeld = decide({ action: "hold", gate: decide(seed89102()).gate });
  assert.equal(latchHeld.verdict, "latch");
  assert.equal(latchHeld.held, true);
});

test("13 Slack adapter: no webhook → demo would-post; home skips", () => {
  const alarm = decide(seed74726());
  const slackAlarm = slackIsolationAlarm(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.equal(slackAlarm.ok, true);
  assert.match(slackAlarm.summary, /would post/i);
  assert.match(slackAlarm.summary, /isolation alarm/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackIsolationAlarm(idle, {});
  assert.equal(slackIdle.mode, "demo");
  assert.equal(slackIdle.ok, true);
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /home/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
});

test("14 GitHub ledger: no token → demo row, never a fake 200", () => {
  const alarm = decide(seed74726());
  const githubAlarm = githubIsolationLedger(alarm, {});
  assert.equal(githubAlarm.mode, "demo");
  assert.equal(githubAlarm.ok, true);
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /isolation ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
});

test("15 Linear: no key → data-loss incident demo; home/latch skip", () => {
  const loss = decide(seed81333());
  const linearLoss = linearDataLossIncident(loss, {});
  assert.equal(linearLoss.mode, "demo");
  assert.equal(linearLoss.ok, true);
  assert.match(linearLoss.summary, /would open/i);
  assert.match(linearLoss.summary, /data-loss/i);
  assert.doesNotMatch(linearLoss.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const linearIdle = linearDataLossIncident(idle, {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /home/i);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);

  const latch = decide(seed89102());
  const linearLatch = linearDataLossIncident(latch, {});
  assert.match(linearLatch.summary, /skip/i);
  assert.match(linearLatch.summary, /latch/i);
});

test("16 handle() PreToolUse: alarm → deny; home → allow", async () => {
  const denied = await handle(seed74726(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "wicket");
  assert.equal(denied.verdict, "escape");
  assert.equal(denied.hook_event_name, "PreToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "home");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /wicket/i);
  assert.doesNotMatch(allowed.idleWord, /wicket/i);
});

test("17 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed74726()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("18 alarm set is escape/latch/reap; idle word is home", () => {
  assert.deepEqual([...VERDICTS], ["home", "escape", "latch", "reap", "swap", "misbind"]);
  assert.deepEqual([...ALARM_VERDICTS], ["escape", "latch", "reap"]);
  assert.equal(ALARM_VERDICTS.includes("home"), false);
  assert.equal(ALARM_VERDICTS.includes("swap"), false);
  assert.equal(ALARM_VERDICTS.includes("misbind"), false);
  assert.equal(IDLE_WORD, "home");
  assert.doesNotMatch(IDLE_WORD, /wicket/i);
});

test("19 isRelativeTo is a parents walk, not a string prefix", () => {
  assert.equal(isRelativeTo("/tmp/wt/src", "/tmp/wt"), true);
  assert.equal(isRelativeTo("/tmp/wt", "/tmp/wt"), true);
  assert.equal(isRelativeTo("/tmp/wt-other", "/tmp/wt"), false);
  assert.equal(isRelativeTo("/tmp/wt-other/file", "/tmp/wt"), false);
  assert.equal(isRelativeTo("/tmp/w/src", "/tmp/wt"), false);
  assert.equal(isRelativeTo("C:/Users/paul/source/repos/Andoneer/src/a.ts", "C:/Users/paul/source/repos/Andoneer"), true);
  assert.equal(
    isRelativeTo(
      "C:/Users/paul/source/repos/Andoneer-other/src/a.ts",
      "C:/Users/paul/source/repos/Andoneer",
    ),
    false,
  );
  assert.equal(normalizePath("C:\\Users\\paul\\source\\repos\\Andoneer"), "C:/Users/paul/source/repos/Andoneer");
  assert.equal(classify(emptyGate()), "home");
  assert.equal(verdictOf(seedHome().gate), "home");
});

test("20 admit of an escape still names the class; rebound of prefix friend is home", () => {
  const escaped = decide(seed74726());
  const admitted = decide({ action: "admit", gate: escaped.gate });
  assert.equal(admitted.verdict, "escape");
  assert.equal(admitted.admitted, false);
  assert.equal(admitted.refused, true);
  const prefix = decide(seed64322());
  const bounced = decide({ action: "rebound", gate: prefix.gate });
  assert.equal(bounced.verdict, "home");
  assert.equal(bounced.filePath, "/tmp/wt/src/app.ts");
});
