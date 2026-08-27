import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubReedLedger, linearReseatTicket, slackRegistryAlarm } from "./adapters.mjs";
import {
  IDLE_WORD,
  decide,
  decideSeed,
  emptyAction,
  emptyCabinet,
  emptyReed,
  seed11489,
  seed35298,
  seed37417,
  seed74329,
  seed82746,
  seed83838,
  seed86080,
} from "./reed.mjs";
import { handle } from "./index.mjs";

test("1 seed 83838 is chatter, playwright stdio, oneShot, idleWord open", () => {
  const seed = seed83838();
  const result = decide(seed);
  assert.equal(result.verdict, "chatter");
  assert.equal(result.state, "chatter");
  assert.equal(result.decision, "chatter");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "open");
  assert.equal(IDLE_WORD, "open");
  assert.doesNotMatch(result.idleWord, /reed/i);
  assert.equal(result.reeds[0].id, "playwright");
  assert.equal(result.reeds[0].transport, "stdio");
  assert.equal(result.reeds[0].alive, true);
  assert.equal(result.reeds[0].handshake, true);
  assert.equal(result.reeds[0].listed, false);
  assert.equal(result.reeds[0].oneShot, true);
  assert.match(result.reeds[0].error, /No such tool available: mcp__playwright__browser_navigate/);
  assert.equal(decideSeed(seed83838).verdict, "chatter");
  assert.equal(decideSeed(83838).verdict, "chatter");
});

test("2 idle/clear is open, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "open");
  assert.equal(result.idleWord, "open");
  assert.equal(result.verdict, "open");
  assert.equal(result.decision, "open");
  assert.deepEqual(emptyCabinet().reeds, []);
  assert.equal(emptyReed().alive, false);
  assert.doesNotMatch(result.state, /reed/i);
  assert.doesNotMatch(result.idleWord, /reed/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "open");
  assert.equal(cleared.idleWord, "open");
  assert.equal(cleared.reeds.length, 0);
  assert.doesNotMatch(cleared.state, /reed/i);
  assert.doesNotMatch(cleared.idleWord, /reed/i);
  const empty = decide({});
  assert.equal(empty.verdict, "open");
  assert.doesNotMatch(empty.idleWord, /reed/i);
});

test("3 seed 74329 is leak, python-interpreter stdio leaked", () => {
  const result = decide(seed74329());
  assert.equal(result.verdict, "leak");
  assert.equal(result.alarm, true);
  assert.equal(result.reeds[0].id, "python-interpreter");
  assert.equal(result.reeds[0].transport, "stdio");
  assert.equal(result.reeds[0].leaked, true);
  assert.equal(result.reeds[0].oneShot, true);
  assert.equal(result.reeds[0].listed, false);
});

test("4 seed 82746 is open, dead stdio, no respawn", () => {
  const result = decide(seed82746());
  assert.equal(result.verdict, "open");
  assert.equal(result.alarm, false);
  assert.equal(result.reeds[0].id, "playwright");
  assert.equal(result.reeds[0].alive, false);
  assert.equal(result.reeds[0].handshake, false);
  assert.equal(result.reeds[0].listed, false);
  assert.equal(result.reeds[0].callable, false);
  assert.equal(result.reeds[0].oneShot, false);
  assert.equal(result.reeds[0].leaked, false);
});

test("5 seed 86080 is drop, local-fs stays set", () => {
  const result = decide(seed86080());
  assert.equal(result.verdict, "drop");
  assert.equal(result.alarm, true);
  const atlassian = result.reeds.find((row) => row.id === "atlassian");
  const gmail = result.reeds.find((row) => row.id === "gmail");
  const local = result.reeds.find((row) => row.id === "local-fs");
  assert.equal(atlassian.groupDrop, true);
  assert.equal(gmail.groupDrop, true);
  assert.equal(atlassian.verdict, "drop");
  assert.equal(gmail.verdict, "drop");
  assert.equal(local.transport, "stdio");
  assert.equal(local.alive, true);
  assert.equal(local.handshake, true);
  assert.equal(local.listed, true);
  assert.equal(local.callable, true);
  assert.equal(local.verdict, "set");
});

test("6 seed 35298 is stuck, notion connector", () => {
  const result = decide(seed35298());
  assert.equal(result.verdict, "stuck");
  assert.equal(result.alarm, true);
  assert.equal(result.reeds[0].id, "notion");
  assert.equal(result.reeds[0].transport, "connector");
  assert.equal(result.reeds[0].alive, true);
  assert.equal(result.reeds[0].handshake, true);
  assert.equal(result.reeds[0].listed, false);
});

test("7 seed 37417 is stuck, list_changed note", () => {
  const result = decide(seed37417());
  assert.equal(result.verdict, "stuck");
  assert.equal(result.reeds[0].id, "dynamic-tools");
  assert.equal(result.reeds[0].transport, "http");
  assert.equal(result.reeds[0].handshake, true);
  assert.equal(result.reeds[0].listed, false);
  assert.match(result.reeds[0].note, /list_changed/);
});

test("8 seed 11489 is open, dead http, no heartbeat", () => {
  const result = decide(seed11489());
  assert.equal(result.verdict, "open");
  assert.equal(result.alarm, false);
  assert.equal(result.reeds[0].id, "codex-mcp");
  assert.equal(result.reeds[0].transport, "http");
  assert.equal(result.reeds[0].alive, false);
  assert.equal(result.reeds[0].handshake, false);
});

test("9 reseat of chatter is set", () => {
  const chatter = decide(seed83838());
  assert.equal(chatter.verdict, "chatter");
  const seated = decide({ action: "reseat", cabinet: chatter.cabinet });
  assert.equal(seated.verdict, "set");
  assert.equal(seated.alarm, false);
  assert.equal(seated.reeds[0].alive, true);
  assert.equal(seated.reeds[0].handshake, true);
  assert.equal(seated.reeds[0].listed, true);
  assert.equal(seated.reeds[0].callable, true);
  assert.equal(seated.reeds[0].oneShot, false);
  assert.equal(seated.reeds[0].leaked, false);
  assert.equal(seated.reeds[0].reseated, true);
});

test("10 respawn of dead stdio is leak not set", () => {
  const dead = decide(seed82746());
  assert.equal(dead.verdict, "open");
  const respawned = decide({ action: "respawn", cabinet: dead.cabinet });
  assert.equal(respawned.verdict, "leak");
  assert.notEqual(respawned.verdict, "set");
  assert.equal(respawned.reeds[0].alive, true);
  assert.equal(respawned.reeds[0].handshake, true);
  assert.equal(respawned.reeds[0].listed, false);
  assert.equal(respawned.reeds[0].callable, false);
  assert.equal(respawned.reeds[0].oneShot, true);
  assert.equal(respawned.reeds[0].leaked, true);
  assert.equal(respawned.reeds[0].transport, "stdio");
});

test("11 slack demo on chatter, skip on open", () => {
  const chatter = slackRegistryAlarm(decide(seed83838()), {});
  assert.equal(chatter.mode, "demo");
  assert.match(chatter.summary, /would post/i);
  assert.match(chatter.summary, /chatter|registry alarm/i);
  assert.doesNotMatch(chatter.summary, /\b200\b/);

  const idle = slackRegistryAlarm(decide({ action: "clear" }), {});
  assert.match(idle.summary, /skip/i);
  assert.match(idle.summary, /open/i);
  assert.doesNotMatch(idle.summary, /\b200\b/);
});

test("12 github/linear honest without secrets", () => {
  const result = decide(seed83838());
  const github = githubReedLedger(result, {});
  const linear = linearReseatTicket(result, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would append/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open/i);
  assert.doesNotMatch(github.summary, /\b200\b/);
  assert.doesNotMatch(linear.summary, /\b200\b/);
  assert.doesNotMatch(JSON.stringify({ github, linear }).toLowerCase(), /"mode":"live"/);
});

test("13 handle denies chatter and allows open", async () => {
  const denied = await handle(seed83838(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "reed");
  assert.equal(denied.verdict, "chatter");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "open");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /reed/i);
});

test("14 connected without listed is stuck", () => {
  const result = decide({
    action: "probe",
    cabinet: {
      reeds: [
        {
          id: "connected",
          transport: "http",
          alive: true,
          handshake: true,
          listed: false,
          callable: false,
        },
      ],
    },
  });
  assert.equal(result.verdict, "stuck");
  assert.equal(result.alarm, true);
  assert.equal(result.reeds[0].handshake, true);
  assert.equal(result.reeds[0].listed, false);
});

test("15 fire returns three honest demo events", async () => {
  const sinks = await fire(decide(seed83838()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});
