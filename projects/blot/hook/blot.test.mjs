import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubBlotLedger, linearRecoveryTicket, slackBlotAlarm } from "./adapters.mjs";
import {
  IDLE_WORD,
  PLACEHOLDER,
  decide,
  decideSeed,
  emptyAction,
  emptyTray,
  seed10833,
  seed16169,
  seed24387,
  seed32764,
  seed47391,
} from "./blot.mjs";
import { handle } from "./index.mjs";

test("1 seed 24387 is spoof, alarm true, idleWord clear, preview matches OSStatus", () => {
  const seed = seed24387();
  const result = decide(seed);
  assert.equal(result.verdict, "spoof");
  assert.equal(result.state, "spoof");
  assert.equal(result.decision, "spoof");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "clear");
  assert.equal(IDLE_WORD, "clear");
  assert.doesNotMatch(result.idleWord, /blot/i);
  assert.equal(result.session, "24387");
  assert.equal(result.issue, 24387);
  assert.equal(result.frames[0].bytes, 173);
  assert.match(result.frames[0].preview, /OSStatus error -2700/);
  assert.equal(result.frames[0].magic, "text");
  assert.equal(result.frames[0].claimedType, "image/png");
  assert.equal(result.frames[0].baked, true);
  assert.equal(result.frames[0].looping, false);
  assert.equal(result.poison.length, 1);
  assert.doesNotMatch(result.idleWord, /blot/i);
  assert.doesNotMatch(JSON.stringify({ idleWord: result.idleWord, state: result.state }), /blot/i);
});

test("2 idle/clear/{} is clear, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "clear");
  assert.equal(result.idleWord, "clear");
  assert.equal(result.verdict, "clear");
  assert.equal(result.decision, "clear");
  assert.equal(result.alarm, false);
  assert.deepEqual(emptyTray().frames, []);
  assert.doesNotMatch(result.state, /blot/i);
  assert.doesNotMatch(result.idleWord, /blot/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "clear");
  assert.equal(cleared.idleWord, "clear");
  assert.equal(cleared.frames.length, 0);
  assert.equal(cleared.poison.length, 0);
  assert.doesNotMatch(cleared.state, /blot/i);
  assert.doesNotMatch(cleared.idleWord, /blot/i);
  const empty = decide({});
  assert.equal(empty.verdict, "clear");
  assert.equal(empty.idleWord, "clear");
  assert.doesNotMatch(empty.idleWord, /blot/i);
});

test("3 seed 16169 is heic", () => {
  const result = decide(seed16169());
  assert.equal(result.verdict, "heic");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 16169);
  assert.match(result.frames[0].path, /IMG_1042\.HEIC/);
  assert.equal(result.frames[0].claimedType, "image/heic");
  assert.equal(result.frames[0].magic, "heic");
  assert.equal(result.frames[0].bytes, 482000);
  assert.equal(result.frames[0].baked, true);
});

test("4 seed 32764 is lfs, preview includes git-lfs", () => {
  const result = decide(seed32764());
  assert.equal(result.verdict, "lfs");
  assert.equal(result.alarm, true);
  assert.match(result.frames[0].preview, /git-lfs/);
  assert.match(result.frames[0].preview, /version https:\/\/git-lfs\.github\.com\/spec\/v1/);
  assert.equal(result.frames[0].magic, "lfs");
  assert.equal(result.frames[0].bytes, 131);
  assert.equal(result.frames[0].claimedType, "image/png");
});

test("5 seed 47391 is replay, looping", () => {
  const result = decide(seed47391());
  assert.equal(result.verdict, "replay");
  assert.equal(result.alarm, true);
  assert.equal(result.looping, true);
  assert.equal(result.frames[0].looping, true);
  assert.equal(result.frames[0].baked, true);
  assert.equal(result.frames[0].magic, "png");
  assert.equal(result.frames[0].apiStatus, 400);
});

test("6 seed 10833 is replay (looping HEIC thread)", () => {
  const result = decide(seed10833());
  assert.equal(result.verdict, "replay");
  assert.equal(result.alarm, true);
  assert.equal(result.looping, true);
  assert.equal(result.frames[0].looping, true);
  assert.equal(result.frames[0].magic, "heic");
  assert.equal(result.frames[0].claimedType, "image/heic");
  assert.equal(result.source, "openai/codex#10833");
});

test("7 strip on 24387 → recovered true, verdict clear, poison empty, placeholder present", () => {
  const spoofed = decide(seed24387());
  assert.equal(spoofed.verdict, "spoof");
  const stripped = decide({ action: "strip", tray: spoofed.tray });
  assert.equal(stripped.recovered, true);
  assert.equal(stripped.verdict, "clear");
  assert.equal(stripped.state, "clear");
  assert.equal(stripped.decision, "clear");
  assert.equal(stripped.alarm, false);
  assert.equal(stripped.poison.length, 0);
  assert.match(JSON.stringify(stripped.frames), /\[image removed to fix conversation\]/);
  assert.equal(stripped.placeholder, PLACEHOLDER);
  assert.equal(stripped.frames[0].type, "text");
  assert.equal(stripped.frames[0].text, PLACEHOLDER);
});

test("8 abandon on 24387 → abandoned true, recovered false, verdict still spoof", () => {
  const spoofed = decide(seed24387());
  const abandoned = decide({ action: "abandon", tray: spoofed.tray });
  assert.equal(abandoned.abandoned, true);
  assert.equal(abandoned.abandon, true);
  assert.equal(abandoned.recovered, false);
  assert.equal(abandoned.verdict, "spoof");
  assert.equal(abandoned.alarm, true);
  assert.equal(abandoned.sessionDeleted, true);
  assert.equal(abandoned.frames[0].magic, "text");
});

test("9 Slack adapter: no webhook → demo, ok true, would-post; clear skips", () => {
  const alarm = decide(seed24387());
  const slackAlarm = slackBlotAlarm(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.equal(slackAlarm.ok, true);
  assert.match(slackAlarm.summary, /would post/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackBlotAlarm(idle, {});
  assert.equal(slackIdle.mode, "demo");
  assert.equal(slackIdle.ok, true);
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /clear/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
});

test("10 GitHub ledger: no token → demo row", () => {
  const alarm = decide(seed24387());
  const githubAlarm = githubBlotLedger(alarm, {});
  assert.equal(githubAlarm.mode, "demo");
  assert.equal(githubAlarm.ok, true);
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /blot ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
});

test("11 Linear: no key → demo row; clear skips ticket", () => {
  const alarm = decide(seed24387());
  const linearAlarm = linearRecoveryTicket(alarm, {});
  assert.equal(linearAlarm.mode, "demo");
  assert.equal(linearAlarm.ok, true);
  assert.match(linearAlarm.summary, /would open/i);
  assert.doesNotMatch(linearAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const linearIdle = linearRecoveryTicket(idle, {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /clear/i);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);
});

test("12 handle() PostToolUse: alarm → deny; clear → allow", async () => {
  const denied = await handle(seed24387(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "blot");
  assert.equal(denied.verdict, "spoof");
  assert.equal(denied.hook_event_name, "PostToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "clear");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /blot/i);
  assert.doesNotMatch(allowed.idleWord, /blot/i);
});

test("13 decideSeed(24387) and decideSeed(seed24387) both spoof", () => {
  assert.equal(decideSeed(24387).verdict, "spoof");
  assert.equal(decideSeed(seed24387).verdict, "spoof");
  assert.equal(decideSeed("24387").verdict, "spoof");
});

test("14 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed24387()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("15 rot is valid-magic reject before bake; baked 400 without looping is replay", () => {
  const rot = decide({
    frames: [
      {
        path: "/tmp/corrupt.png",
        claimedType: "image/png",
        magic: "png",
        bytes: 80,
        apiStatus: 400,
        baked: false,
        looping: false,
        decodeFail: true,
      },
    ],
  });
  assert.equal(rot.verdict, "rot");
  assert.equal(rot.alarm, true);

  const replay = decide({
    frames: [
      {
        path: "/tmp/baked.png",
        claimedType: "image/png",
        magic: "png",
        bytes: 80,
        apiStatus: 400,
        baked: true,
        looping: false,
      },
    ],
  });
  assert.equal(replay.verdict, "replay");
});
