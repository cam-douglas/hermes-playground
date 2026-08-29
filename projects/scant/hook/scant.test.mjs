import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubScantLedger,
  linearScantTicket,
  slackScantAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CMDLINE_LIMIT,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  SNAPSHOT_WALL,
  SNAPSHOT_WALL_HI,
  SNAPSHOT_WALL_LO,
  VERDICTS,
  classify,
  cloneProbe,
  clusterOf,
  cutToBytes,
  decide,
  decideSeed,
  detectUnclosedPathQuote,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  clippedOf,
  inspectSnapshot,
  isIdle,
  scantOf,
  fitOf,
  reasonsOf,
  score,
  seed90421Scant,
  seedBloated,
  seedClipped,
  seedFit,
  seedMute,
  seedOpen,
  seedPoisoned,
  seedSealed,
  seedStubbed,
  seedTrue,
  utf8Bytes,
  verdictOf,
} from "./scant.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverScant(result) {
  assert.equal(result.idleWord, "fit");
  assert.equal(IDLE_WORD, "fit");
  assert.doesNotMatch(result.idleWord, /scant/i);
  assert.doesNotMatch(IDLE_WORD, /scant/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(result.idleWord, /spoilt|laid|unlinked|tight|banked|seised|seated|latched|stocked|roosted/);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.fit, "boolean");
  assert.equal(typeof result.scant, "boolean");
  assert.equal(typeof result.clipped, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
  assert.ok(result.measure && typeof result.measure.bytes === "number");
}

test("1 seed 90421 scant is scant, slack, not linear, idleWord fit", () => {
  const seed = seed90421Scant();
  const result = decide(seed);
  assert.equal(result.verdict, "scant");
  assert.equal(result.state, "scant");
  assert.equal(result.decision, "scant");
  assert.equal(classify(seed.probe), "scant");
  assert.equal(verdictOf(seed.probe), "scant");
  assert.notEqual(result.verdict, "fit");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.boardScant, true);
  assert.equal(result.boardFit, false);
  assert.equal(result.fit, false);
  assert.equal(result.scant, true);
  assertIdleNeverScant(result);
  assert.equal(result.session, "90421-scant");
  assert.equal(result.issue, 90421);
  assert.equal(result.unclosedPathQuote, true);
  assert.equal(result.truncatedMidPath, true);
  assert.ok(result.bytes >= SNAPSHOT_WALL_LO && result.bytes <= SNAPSHOT_WALL_HI);
  assert.equal(result.bytes, SNAPSHOT_WALL);
  assert.match(result.feed, /truncated mid-PATH|unclosed quote|cut short/i);
  assert.ok(result.cluster.includes("clipped"));
  assert.ok(result.cluster.includes("open"));
  assert.ok(result.cluster.includes("bloated"));
  assert.ok(result.cluster.includes("stubbed"));
  assert.ok(!result.cluster.includes("scant"));
  assert.ok(!result.cluster.includes("fit"));
  assert.equal(decideSeed(90421).verdict, "scant");
  assert.equal(decideSeed("scant").verdict, "scant");
  assert.equal(decideSeed("90421-scant").verdict, "scant");
});

test("2 idle/empty/{} is fit, never the product name, never empty, never spoilt", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "fit");
  assert.equal(result.verdict, "fit");
  assert.equal(result.decision, "fit");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.fit, true);
  assert.equal(result.scant, false);
  assert.equal(classify({}), "fit");
  assert.equal(classify(emptyProbe()), "fit");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverScant(result);
  const seated = decide({ action: "rack" });
  assert.equal(seated.state, "fit");
  assert.equal(seated.idleWord, "fit");
  assert.equal(seated.snapshot, "");
  assert.doesNotMatch(seated.state, /scant/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "fit");
  assert.equal(empty.idleWord, "fit");
});

test("3 clipped: hit the ~7.2KB wall, PATH quote closed", () => {
  const result = decide(seedClipped());
  assert.equal(result.verdict, "clipped");
  assert.equal(result.hitWall, true);
  assert.equal(result.unclosedPathQuote, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.ok(result.bytes >= SNAPSHOT_WALL_LO);
  assert.match(result.feed, /8191|7\.2KB wall/i);
  assert.equal(decideSeed("clipped").verdict, "clipped");
});

test("4 open: unclosed PATH quote under the wall", () => {
  const result = decide(seedOpen());
  assert.equal(result.verdict, "open");
  assert.equal(result.unclosedPathQuote, true);
  assert.equal(result.hitWall, false);
  assert.equal(result.issue, 85111);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /unclosed PATH quote/i);
  assert.equal(decideSeed(85111).verdict, "open");
});

test("5 poisoned: every Bash call unexpected EOF", () => {
  const result = decide(seedPoisoned());
  assert.equal(result.verdict, "poisoned");
  assert.equal(result.bashUnexpectedEof, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /unexpected EOF/i);
  assert.equal(decideSeed("poisoned").verdict, "poisoned");
});

test("6 bloated: plugin PATH would push over the wall", () => {
  const result = decide(seedBloated());
  assert.equal(result.verdict, "bloated");
  assert.equal(result.pluginPathBloat, true);
  assert.equal(result.pluginCount, 35);
  assert.equal(result.measuredFullLength, 9800);
  assert.equal(result.hitWall, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /plugin PATH/i);
  assert.equal(decideSeed("bloated").verdict, "bloated");
});

test("7 stubbed: file ends mid-entry, no PATH export", () => {
  const result = decide(seedStubbed());
  assert.equal(result.verdict, "stubbed");
  assert.equal(result.issue, 83243);
  assert.equal(result.endsMidEntry, true);
  assert.equal(result.unclosedPathQuote, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /mid-entry|mid-PATH/i);
  assert.equal(decideSeed(83243).verdict, "stubbed");
});

test("8 mute: snapshot deleted, silent no-op Bash", () => {
  const result = decide(seedMute());
  assert.equal(result.verdict, "mute");
  assert.equal(result.snapshotDeleted, true);
  assert.equal(result.silentNoOpBash, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /silent no-op|exit 0/i);
  assert.equal(decideSeed("mute").verdict, "mute");
});

test("9 sealed: on-disk repair, session still dead", () => {
  const result = decide(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.onDiskRepairAttempted, true);
  assert.equal(result.sessionStillDead, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /in-memory capture|on-disk repair/i);
  assert.equal(decideSeed("sealed").verdict, "sealed");
});

test("10 true: measured full length would have fit", () => {
  const result = decide(seedTrue());
  assert.equal(result.verdict, "true");
  assert.ok(result.bytes < SNAPSHOT_WALL_LO);
  assert.equal(result.unclosedPathQuote, false);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /would have fit/i);
  assert.equal(decideSeed("true").verdict, "true");
});

test("11 fit seed is fit and never alarms", () => {
  const result = decide(seedFit());
  assert.equal(result.verdict, "fit");
  assert.equal(result.snapshot, "");
  assert.equal(result.fit, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Fit/);
  assert.equal(decideSeed("fit").verdict, "fit");
});

test("12 score() idle probe is fit and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "fit");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fit, true);
  assert.equal(result.scant, false);
  assert.equal(result.clipped, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "fit",
    "scant",
    "clipped",
    "open",
    "poisoned",
    "bloated",
    "stubbed",
    "mute",
    "sealed",
    "true",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["scant", "clipped", "poisoned", "bloated"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["poisoned", "clipped"]);
  assert.equal(IDLE_WORD, "fit");
  assert.doesNotMatch(IDLE_WORD, /scant/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /spoilt|laid|unlinked|tight|banked|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /chad|unlinked|wraith|kist|knock|spoilt/);
  assert.equal(SNAPSHOT_WALL_LO, 7187);
  assert.equal(SNAPSHOT_WALL_HI, 7195);
  assert.equal(SNAPSHOT_WALL, 7191);
  assert.equal(CMDLINE_LIMIT, 8191);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["fit", seedFit],
    ["scant", seed90421Scant],
    ["clipped", seedClipped],
    ["open", seedOpen],
    ["poisoned", seedPoisoned],
    ["bloated", seedBloated],
    ["stubbed", seedStubbed],
    ["mute", seedMute],
    ["sealed", seedSealed],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: scant stays scant", () => {
  const result = decide({ ...seed90421Scant(), action: "admit" });
  assert.equal(result.verdict, "scant");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /fit/);
  assert.notEqual(result.idleWord, "scant");
});

test("16 score / measure scores scant", () => {
  const result = decide({ ...seed90421Scant(), action: "score" });
  assert.equal(result.verdict, "scant");
  assert.equal(result.action, "score");
  assert.equal(result.unclosedPathQuote, true);
  const measured = decide({ ...seed90421Scant(), action: "measure" });
  assert.equal(measured.verdict, "scant");
  assert.equal(measured.action, "measure");
});

test("17 rack / seat / fit returns idle fit", () => {
  const rack = decide({ ...seed90421Scant(), action: "rack" });
  assert.equal(rack.verdict, "fit");
  assert.equal(rack.action, "rack");
  assert.equal(rack.snapshot, "");
  assert.equal(isIdle(rack.probe), true);
  assertIdleNeverScant(rack);
  const seated = decide({ ...seedClipped(), action: "seat" });
  assert.equal(seated.verdict, "fit");
  assert.equal(isIdle(seated.probe), true);
  const fit = decide({ ...seedPoisoned(), action: "fit" });
  assert.equal(fit.verdict, "fit");
});

test("18 clip on idle produces scant board", () => {
  const result = decide({ action: "clip", probe: emptyProbe() });
  assert.equal(result.verdict, "scant");
  assert.equal(result.action, "clip");
  assert.equal(result.unclosedPathQuote, true);
  assert.equal(result.scant, true);
});

test("19 clip on an open probe becomes scant", () => {
  const result = decide({ ...seedOpen(), action: "clip" });
  assert.equal(result.verdict, "scant");
  assert.equal(result.action, "clip");
  assert.equal(result.unclosedPathQuote, true);
});

test("20 true control is the healthy hold, never idle fit", () => {
  const result = decide({ ...seed90421Scant(), action: "true" });
  assert.equal(result.verdict, "true");
  assert.equal(result.action, "true");
  assert.equal(result.unclosedPathQuote, false);
  assert.equal(result.fit, false);
  assert.equal(result.scant, false);
});

test("21 chalk marks the board check and does not lie", () => {
  const result = decide({ ...seed90421Scant(), action: "chalk" });
  assert.equal(result.verdict, "scant");
  assert.equal(result.action, "chalk");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Yard checked/.test(line)));
});

test("22 observe on stubbed stays stubbed", () => {
  const result = decide({ ...seedStubbed(), action: "observe" });
  assert.equal(result.verdict, "stubbed");
  assert.equal(result.observed, true);
  assert.equal(result.endsMidEntry, true);
});

test("23 scant beats clipped when mid-PATH and unclosed", () => {
  assert.equal(
    classify({
      snapshot: seed90421Scant().probe.snapshot,
      pluginPathBloat: true,
    }),
    "scant",
  );
});

test("24 poisoned beats scant when every Bash call EOF", () => {
  assert.equal(
    classify({
      snapshot: seed90421Scant().probe.snapshot,
      bashUnexpectedEof: true,
    }),
    "poisoned",
  );
});

test("25 sealed beats true when repair did not heal the session", () => {
  assert.equal(
    classify({
      snapshot: seedTrue().probe.snapshot,
      onDiskRepairAttempted: true,
      sessionStillDead: true,
    }),
    "sealed",
  );
});

test("26 mute requires deleted snapshot or silent no-op", () => {
  assert.equal(classify({ snapshotDeleted: true }), "mute");
  assert.equal(classify({ silentNoOpBash: true }), "mute");
  assert.equal(classify({}), "fit");
});

test("27 nested board / yard / rack / slab fields clone", () => {
  const probe = cloneProbe({
    board: {
      snapshot: seed90421Scant().probe.snapshot,
    },
  });
  assert.equal(classify(probe), "scant");
  const yard = cloneProbe({
    yard: { snapshotDeleted: true, silentNoOpBash: true },
  });
  assert.equal(classify(yard), "mute");
});

test("28 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("scant"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("clipped"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("poisoned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("bloated"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("fit"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("open"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("stubbed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("mute"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("sealed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("true"), { slack: false, linear: false, github: true, alarm: false });
});

test("29 fit / scant / clipped helpers", () => {
  assert.equal(fitOf(seed90421Scant().probe), false);
  assert.equal(scantOf(seed90421Scant().probe), true);
  assert.equal(clippedOf(seed90421Scant().probe), false);
  assert.equal(fitOf(emptyProbe()), true);
  assert.equal(clippedOf(seedClipped().probe), true);
  assert.equal(scantOf(seedClipped().probe), false);
  assert.equal(fitOf(seedTrue().probe), false);
});

test("30 feed and reasons never use scant or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "fit");
  assert.doesNotMatch(idle.feed, /idle word is scant/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is scant/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "fit"), /Fit/);
  assert.ok(reasonsOf(emptyProbe(), "fit").some((line) => /idle word is fit/.test(line)));
});

test("31 forbidden idle list includes scant, empty, spoilt, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("scant"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("spoilt"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("unlinked"));
  assert.ok(words.includes("tight"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("livery"));
  assert.ok(words.includes("kerf"));
  assert.ok(words.includes("larder"));
  assert.ok(!words.includes("fit"));
});

test("32 demo sinks: Slack on alarm; Linear on poisoned/clipped; GitHub always", async () => {
  const scant = decide(seed90421Scant());
  const slack = slackScantAlarm(scant, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubScantLedger(scant, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub scant-ledger/);
  const linear = linearScantTicket(scant, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would skip Linear/);
  const clipped = decide(seedClipped());
  assert.match(linearScantTicket(clipped, {}).summary, /Would open a Linear ticket/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackScantAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearScantTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(scant, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("33 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const scant = decide(seed90421Scant());
  const slack = slackScantAlarm(scant, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubScantLedger(scant, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearScantTicket(decide(seedPoisoned()), { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("34 Slack skip on fit / open / stubbed / mute / sealed / true", () => {
  for (const seed of [seedFit, seedOpen, seedStubbed, seedMute, seedSealed, seedTrue]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackScantAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("35 Linear only on poisoned and clipped", () => {
  assert.equal(decide(seedPoisoned()).linear, true);
  assert.equal(decide(seedClipped()).linear, true);
  assert.equal(decide(seed90421Scant()).linear, false);
  assert.equal(decide(seedBloated()).linear, false);
  assert.equal(decide(seedFit()).linear, false);
});

test("36 GitHub ledger fires on idle/rack scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const rack = decide({ action: "rack" });
  assert.equal(rack.github, true);
});

test("37 handle scant / clipped / poisoned / bloated deny", async () => {
  const scant = await handle(seed90421Scant(), {});
  assert.equal(scant.permissionDecision, "deny");
  assert.match(scant.hookSpecificOutput.decision.message, /truncated mid-PATH|cut/i);
  const clipped = await handle(seedClipped(), {});
  assert.equal(clipped.permissionDecision, "deny");
  const poisoned = await handle(seedPoisoned(), {});
  assert.equal(poisoned.permissionDecision, "deny");
  const bloated = await handle(seedBloated(), {});
  assert.equal(bloated.permissionDecision, "deny");
});

test("38 handle fit / open / stubbed / mute / sealed / true allow", async () => {
  const idle = await handle({ action: "rack" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /fit/);
  const open = await handle(seedOpen(), {});
  assert.equal(open.permissionDecision, "allow");
  const stubbed = await handle(seedStubbed(), {});
  assert.equal(stubbed.permissionDecision, "allow");
  const mute = await handle(seedMute(), {});
  assert.equal(mute.permissionDecision, "allow");
  const sealed = await handle(seedSealed(), {});
  assert.equal(sealed.permissionDecision, "allow");
  const trued = await handle(seedTrue(), {});
  assert.equal(trued.permissionDecision, "allow");
});

test("39 listen GET health and POST empty body is fit", async () => {
  const server = listen(19421);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19421/health");
  const info = await health.json();
  assert.equal(info.product, "scant");
  assert.match(info.verbs, /clipped/);
  const res = await fetch("http://127.0.0.1:19421/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "fit");
  assert.equal(body.idleWord, "fit");
  const scored = await fetch("http://127.0.0.1:19421/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90421Scant()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "scant");
  await new Promise((resolve) => server.close(resolve));
});

test("40 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19422);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19422/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19422/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("41 every verdict is uniquely first-match on its seed", () => {
  const map = {
    fit: seedFit,
    scant: seed90421Scant,
    clipped: seedClipped,
    open: seedOpen,
    poisoned: seedPoisoned,
    bloated: seedBloated,
    stubbed: seedStubbed,
    mute: seedMute,
    sealed: seedSealed,
    true: seedTrue,
  };
  const seen = new Set();
  for (const [word, seed] of Object.entries(map)) {
    const got = classify(seed().probe);
    assert.equal(got, word, word);
    assert.equal(seen.has(got), false, word);
    seen.add(got);
  }
  assert.equal(seen.size, 10);
});

test("42 admit does not lie on every fault class", () => {
  const rows = [
    ["scant", seed90421Scant],
    ["clipped", seedClipped],
    ["open", seedOpen],
    ["poisoned", seedPoisoned],
    ["bloated", seedBloated],
    ["stubbed", seedStubbed],
    ["mute", seedMute],
    ["sealed", seedSealed],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("43 desk HTML sanity: idle word fit, seeded scant, not chad/kist", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /fit/);
  assert.match(html, /Score/);
  assert.match(html, /Rack/);
  assert.match(html, /Clip/);
  assert.match(html, /True/);
  assert.match(html, /scant/);
  assert.match(html, /90421/);
  assert.match(html, /seedOf\("scant"\)|probe = seedOf\("scant"\)/);
  assert.doesNotMatch(html, /Admit scant/);
  assert.doesNotMatch(html, /const IDLE_WORD = "scant"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "spoilt"/);
  assert.match(html, /const IDLE_WORD = "fit"/);
  assert.match(html, /yard|rack|sawdust|chalk|endgrain|steel|scantling|lumber/i);
  assert.match(html, /04:50 Sydney · scant/);
  assert.match(html, /written shell snapshot is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="bourdon"|class="lagging"|class="flange"|class="packing"/);
  assert.doesNotMatch(html, /class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="precinct"|class="punchcard"|class="hanging"/);
  assert.doesNotMatch(html, /--void:|--frost:|--ice:|--after:|--tomb:/);
  assert.doesNotMatch(html, /--oak:|--ash:|--linen:|--hessian:|--brass:|--lead:/);
  assert.doesNotMatch(html, /--hall:|--manila:|--inkpad:|--curtain:|--precinct:/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Scant/);
});

test("44 HTML why-not names Larder, Reed, Assay, Quench, Wraith, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Assay/);
  assert.match(html, /NOT Quench/);
  assert.match(html, /NOT Wraith/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Scant is a plugin-store freeze/i);
  assert.doesNotMatch(html, /Scant is a hanging-chad/i);
  assert.doesNotMatch(html, /this is a livery of seisin/i);
});

test("45 README names Larder / Reed / Assay contrast and fit idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Larder/);
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /NOT Assay/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*fit\*\*/);
  assert.match(readme, /#90421|#90421/);
  assert.match(readme, /#88311|#88311/);
  assert.match(readme, /#85111|#85111/);
  assert.doesNotMatch(readme, /idle word is scant/i);
  assert.doesNotMatch(readme, /idle word is spoilt/i);
  assert.doesNotMatch(readme, /Scant is a plugin-store freeze/i);
});

test("46 score() scant includes scant and not fit", () => {
  const result = score(seed90421Scant().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "scant");
  assert.equal(result.fit, false);
  assert.equal(result.scant, true);
  assert.equal(result.clipped, false);
});

test("47 fire live slack posts when fetch ok", async () => {
  const scant = decide(seed90421Scant());
  const events = await fire(scant, { SCANT_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted scant/);
});

test("48 fire live github and linear paths", async () => {
  const poisoned = decide(seedPoisoned());
  const events = await fire(
    poisoned,
    {
      SCANT_GITHUB_TOKEN: "tok",
      SCANT_LINEAR_KEY: "lin",
      SCANT_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "SCT-1", url: "https://linear.app/sct-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /SCT-1/);
});

test("49 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90421Scant().probe, "scant").some((line) => /#90421/.test(line)));
  assert.ok(reasonsOf(seedOpen().probe, "open").some((line) => /unclosed PATH quote/.test(line)));
  assert.ok(reasonsOf(seedPoisoned().probe, "poisoned").some((line) => /#90421/.test(line)));
});

test("50 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const scant = decide(seed90421Scant());
  const slack = slackScantAlarm(scant, {});
  const github = githubScantLedger(scant, {});
  const linear = linearScantTicket(scant, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(scant, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("51 catalog wiring: 35 products, Iota featured, Scant listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 35);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Iota");
  const scant = catalog.products.find((row) => row.slug === "scant");
  assert.ok(scant);
  assert.equal(scant.featured, false);
  assert.equal(scant.href, "/scant/");
  assert.equal(scant.day, "2026-08-29");
  assert.match(scant.summary, /04:50|scantling|written shell snapshot is not a hold|fit/);
  const chad = catalog.products.find((row) => row.slug === "chad");
  assert.ok(chad);
  assert.equal(chad.featured, false);
  const kist = catalog.products.find((row) => row.slug === "kist");
  assert.ok(kist);
  assert.equal(kist.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "iota");
  assert.ok(slugs.includes("sump"));
  assert.ok(slugs.includes("pleat"));
  assert.ok(slugs.includes("scant"));
  assert.ok(slugs.includes("chad"));
  assert.ok(slugs.includes("kist"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("livery"));
  assert.ok(!slugs.includes("kerf"));
  assert.ok(!slugs.includes("trunc"));
});

test("52 vercel rewrite order puts /shunt then /sump then /pleat then /scant before /chad and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/iota");
  assert.equal(sources[1], "/iota/");
  assert.equal(sources[2], "/leat");
  assert.equal(sources[3], "/leat/");
  assert.ok(sources.includes("/scant"));
  assert.ok(sources.includes("/chad"));
  assert.ok(sources.includes("/kist"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/shunt") < sources.indexOf("/sump"));
  assert.ok(sources.indexOf("/pleat") < sources.indexOf("/scant"));
  assert.ok(sources.indexOf("/scant") < sources.indexOf("/chad"));
  assert.ok(sources.indexOf("/scant/") < sources.indexOf("/:slug"));
  assert.ok(!sources.includes("/livery"));
  assert.ok(!sources.includes("/kerf"));
});

test("53 hours.json keeps the 04:50 Sydney Scant ship after Shunt, Sump and Pleat", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  const scant = hours.find((row) => row.stem === "2026-08-29-scant");
  assert.ok(scant);
  assert.equal(hours[0].stem, "2026-08-29-iota");
  assert.equal(hours[1].stem, "2026-08-29-leat");
  assert.equal(hours[2].stem, "2026-08-29-shunt");
  assert.ok(hours.some((row) => row.stem === "2026-08-29-scant"));
  assert.equal(scant.date, "2026-08-29");
  assert.equal(scant.time, "04:50");
  assert.equal(scant.tz, "Australia/Sydney");
  assert.equal(scant.title, "Scant");
  assert.equal(scant.kind, "ship");
  assert.match(scant.note, /fit/);
  assert.match(scant.note, /Chad/);
});

test("54 clusterOf on #90421 includes clipped open bloated stubbed", () => {
  const cluster = clusterOf(seed90421Scant().probe, "scant");
  assert.deepEqual(
    cluster.filter((word) => ["clipped", "open", "bloated", "stubbed"].includes(word)).sort(),
    ["bloated", "clipped", "open", "stubbed"],
  );
});

test("55 measure snapshot bytes and detect unclosed PATH quote", () => {
  const snap = seed90421Scant().probe.snapshot;
  assert.equal(utf8Bytes(snap), SNAPSHOT_WALL);
  assert.equal(detectUnclosedPathQuote(snap), true);
  const inspected = inspectSnapshot(snap);
  assert.equal(inspected.hitWall, true);
  assert.equal(inspected.truncatedMidPath, true);
  assert.equal(inspected.pathBreakAt, snap.length);
  const closed = seedTrue().probe.snapshot;
  assert.equal(detectUnclosedPathQuote(closed), false);
  assert.ok(utf8Bytes(closed) < SNAPSHOT_WALL_LO);
  assert.equal(cutToBytes("abcdef", 3), "abc");
  assert.equal(utf8Bytes(cutToBytes(snap, SNAPSHOT_WALL)), SNAPSHOT_WALL);
});
