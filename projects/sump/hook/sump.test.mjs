import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSumpLedger,
  linearSumpTicket,
  slackSumpAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LFS_HOOKS,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  cloggedOf,
  clusterOf,
  decide,
  decideSeed,
  drainedOf,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseWorktreeStatus,
  reasonsOf,
  score,
  seed90456Silted,
  seedAbsolute,
  seedClogged,
  seedDiverted,
  seedDrained,
  seedFouled,
  seedHooked,
  seedLittered,
  seedPhantom,
  seedPooled,
  siltedOf,
  verdictOf,
} from "./sump.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverSump(result) {
  assert.equal(result.idleWord, "drained");
  assert.equal(IDLE_WORD, "drained");
  assert.doesNotMatch(result.idleWord, /sump/i);
  assert.doesNotMatch(IDLE_WORD, /sump/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.drained, "boolean");
  assert.equal(typeof result.silted, "boolean");
  assert.equal(typeof result.clogged, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90456 silted is silted, slack, linear, idleWord drained", () => {
  const seed = seed90456Silted();
  const result = decide(seed);
  assert.equal(result.verdict, "silted");
  assert.equal(result.state, "silted");
  assert.equal(result.decision, "silted");
  assert.equal(classify(seed.probe), "silted");
  assert.equal(verdictOf(seed.probe), "silted");
  assert.notEqual(result.verdict, "drained");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.pitSilted, true);
  assert.equal(result.pitDrained, false);
  assert.equal(result.drained, false);
  assert.equal(result.silted, true);
  assert.equal(result.clogged, false);
  assertIdleNeverSump(result);
  assert.equal(result.session, "90456-silted");
  assert.equal(result.issue, 90456);
  assert.equal(result.literalNullDir, true);
  assert.deepEqual(result.hookFiles, [...LFS_HOOKS]);
  assert.equal(result.fullyPopulated, true);
  assert.equal(result.gitStatusUntracked, true);
  assert.match(result.feed, /literal dev\/null\/ pit holds stranded LFS hooks/i);
  assert.ok(result.cluster.includes("clogged"));
  assert.ok(result.cluster.includes("fouled"));
  assert.ok(result.cluster.includes("littered"));
  assert.ok(result.cluster.includes("diverted"));
  assert.ok(result.cluster.includes("phantom"));
  assert.ok(result.cluster.includes("absolute"));
  assert.ok(result.cluster.includes("hooked"));
  assert.ok(!result.cluster.includes("silted"));
  assert.ok(!result.cluster.includes("drained"));
  assert.equal(decideSeed(90456).verdict, "silted");
  assert.equal(decideSeed("silted").verdict, "silted");
  assert.equal(decideSeed("90456-silted").verdict, "silted");
});

test("2 idle/empty/{} is drained, never the product name, never empty, never flat", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "drained");
  assert.equal(result.verdict, "drained");
  assert.equal(result.decision, "drained");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.drained, true);
  assert.equal(result.silted, false);
  assert.equal(classify({}), "drained");
  assert.equal(classify(emptyProbe()), "drained");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverSump(result);
  const seated = decide({ action: "shut" });
  assert.equal(seated.state, "drained");
  assert.equal(seated.idleWord, "drained");
  assert.equal(seated.literalNullDir, false);
  assert.doesNotMatch(seated.state, /sump/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "drained");
  assert.equal(empty.idleWord, "drained");
});

test("3 clogged: grate packed with all four LFS hook shims", () => {
  const result = decide(seedClogged());
  assert.equal(result.verdict, "clogged");
  assert.equal(result.fullyPopulated, true);
  assert.equal(result.literalNullDir, true);
  assert.equal(result.gitStatusUntracked, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.clogged, true);
  assert.match(result.feed, /grate packed/i);
  assert.equal(decideSeed("clogged").verdict, "clogged");
});

test("4 fouled: LFS shims contaminate the pit, partial", () => {
  const result = decide(seedFouled());
  assert.equal(result.verdict, "fouled");
  assert.equal(result.hooksAreLfsShims, true);
  assert.equal(result.hooksLandedInNull, true);
  assert.equal(result.fullyPopulated, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.match(result.feed, /LFS shims contaminate/i);
  assert.equal(decideSeed("fouled").verdict, "fouled");
});

test("5 pooled: empty literal directory only", () => {
  const result = decide(seedPooled());
  assert.equal(result.verdict, "pooled");
  assert.equal(result.emptyNullDir, true);
  assert.equal(result.literalNullDir, true);
  assert.deepEqual(result.hookFiles, []);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.match(result.feed, /empty literal/i);
  assert.equal(decideSeed("pooled").verdict, "pooled");
});

test("6 diverted: path resolved relative", () => {
  const result = decide(seedDiverted());
  assert.equal(result.verdict, "diverted");
  assert.equal(result.pathResolvedRelative, true);
  assert.equal(result.literalNullDir, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /resolved relative/i);
  assert.equal(decideSeed("diverted").verdict, "diverted");
});

test("7 littered: git status untracked clutter", () => {
  const result = decide(seedLittered());
  assert.equal(result.verdict, "littered");
  assert.equal(result.gitStatusUntracked, true);
  assert.equal(result.literalNullDir, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /untracked/i);
  assert.equal(decideSeed("littered").verdict, "littered");
});

test("8 phantom: hooks look real but never fire", () => {
  const result = decide(seedPhantom());
  assert.equal(result.verdict, "phantom");
  assert.equal(result.hooksNeverFire, true);
  assert.equal(result.hooksLookReal, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /never fire/i);
  assert.equal(decideSeed("phantom").verdict, "phantom");
});

test("9 absolute: claimed hookspath absolute vs relative null write", () => {
  const result = decide(seedAbsolute());
  assert.equal(result.verdict, "absolute");
  assert.equal(result.hookspathIsAbsolute, true);
  assert.equal(result.relativeNullWrite, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /absolute/i);
  assert.equal(decideSeed("absolute").verdict, "absolute");
});

test("10 hooked: LFS shims present", () => {
  const result = decide(seedHooked());
  assert.equal(result.verdict, "hooked");
  assert.equal(result.hooksAreLfsShims, true);
  assert.equal(result.lfsShimsPresent, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /LFS shims present/i);
  assert.equal(decideSeed("hooked").verdict, "hooked");
});

test("11 drained seed is drained and never alarms", () => {
  const result = decide(seedDrained());
  assert.equal(result.verdict, "drained");
  assert.equal(result.literalNullDir, false);
  assert.equal(result.drained, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Drained/);
  assert.equal(decideSeed("drained").verdict, "drained");
});

test("12 score() idle probe is drained and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "drained");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.drained, true);
  assert.equal(result.silted, false);
  assert.equal(result.clogged, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "drained",
    "silted",
    "clogged",
    "fouled",
    "pooled",
    "diverted",
    "littered",
    "phantom",
    "absolute",
    "hooked",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["silted", "clogged", "fouled", "littered"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["silted", "clogged", "fouled"]);
  assert.equal(IDLE_WORD, "drained");
  assert.doesNotMatch(IDLE_WORD, /sump/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /flat|fit|spoilt|laid|unlinked|tight|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|unlinked|wraith|kist|knock|spoilt|flat|fit/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["drained", seedDrained],
    ["silted", seed90456Silted],
    ["clogged", seedClogged],
    ["fouled", seedFouled],
    ["pooled", seedPooled],
    ["diverted", seedDiverted],
    ["littered", seedLittered],
    ["phantom", seedPhantom],
    ["absolute", seedAbsolute],
    ["hooked", seedHooked],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: silted stays silted", () => {
  const result = decide({ ...seed90456Silted(), action: "admit" });
  assert.equal(result.verdict, "silted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /drained/);
  assert.doesNotMatch(result.verdict, /sump/i);
});

test("16 score / stamp / pump scores silted", () => {
  const result = decide({ ...seed90456Silted(), action: "score" });
  assert.equal(result.verdict, "silted");
  assert.equal(result.action, "score");
  assert.equal(result.literalNullDir, true);
  const stamped = decide({ ...seed90456Silted(), action: "stamp" });
  assert.equal(stamped.verdict, "silted");
  assert.equal(stamped.action, "stamp");
  const pumped = decide({ ...seed90456Silted(), action: "pump" });
  assert.equal(pumped.verdict, "silted");
  assert.equal(pumped.action, "score");
});

test("17 shut / bail / drained returns idle drained", () => {
  const shut = decide({ ...seed90456Silted(), action: "shut" });
  assert.equal(shut.verdict, "drained");
  assert.equal(shut.action, "shut");
  assert.equal(shut.literalNullDir, false);
  assert.equal(isIdle(shut.probe), true);
  assertIdleNeverSump(shut);
  const bailed = decide({ ...seedClogged(), action: "bail" });
  assert.equal(bailed.verdict, "drained");
  assert.equal(isIdle(bailed.probe), true);
  const idle = decide({ ...seedFouled(), action: "drained" });
  assert.equal(idle.verdict, "drained");
});

test("18 silt on idle produces silted pit", () => {
  const result = decide({ action: "silt", probe: emptyProbe() });
  assert.equal(result.verdict, "silted");
  assert.equal(result.action, "silt");
  assert.equal(result.literalNullDir, true);
  assert.deepEqual(result.hookFiles, [...LFS_HOOKS]);
  assert.equal(result.silted, true);
});

test("19 silt on a pooled probe becomes silted", () => {
  const result = decide({ ...seedPooled(), action: "silt" });
  assert.equal(result.verdict, "silted");
  assert.equal(result.action, "silt");
  assert.equal(result.fullyPopulated, true);
});

test("20 ledger marks the pit sound and does not lie", () => {
  const result = decide({ ...seed90456Silted(), action: "ledger" });
  assert.equal(result.verdict, "silted");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Pit sounded/.test(line)));
});

test("21 observe on fouled stays fouled", () => {
  const result = decide({ ...seedFouled(), action: "observe" });
  assert.equal(result.verdict, "fouled");
  assert.equal(result.observed, true);
  assert.equal(result.hooksAreLfsShims, true);
});

test("22 silted beats clogged when status silt is also present", () => {
  assert.equal(
    classify({
      literalNullDir: true,
      hookFiles: [...LFS_HOOKS],
      hooksLandedInNull: true,
      fullyPopulated: true,
      gitStatusUntracked: true,
    }),
    "silted",
  );
});

test("23 clogged requires the full grate without status silt", () => {
  assert.equal(
    classify({
      literalNullDir: true,
      hookFiles: [...LFS_HOOKS],
      hooksLandedInNull: true,
      fullyPopulated: true,
    }),
    "clogged",
  );
});

test("24 fouled requires LFS shims in a partial pit", () => {
  assert.equal(
    classify({
      literalNullDir: true,
      hookFiles: ["post-checkout"],
      hooksLandedInNull: true,
      hooksAreLfsShims: true,
    }),
    "fouled",
  );
  assert.equal(
    classify({
      literalNullDir: true,
      hookFiles: ["post-checkout"],
      hooksLandedInNull: true,
    }),
    "silted",
  );
});

test("25 pooled requires empty dir, not just a flag", () => {
  assert.equal(classify({ emptyNullDir: true }), "drained");
  assert.equal(
    classify({
      literalNullDir: true,
      emptyNullDir: true,
    }),
    "pooled",
  );
});

test("26 nested pit / grate / bilge / silt fields clone", () => {
  const probe = cloneProbe({
    pit: {
      literalNullDir: true,
      hookFiles: [...LFS_HOOKS],
      hooksLandedInNull: true,
      gitStatusUntracked: true,
    },
  });
  assert.equal(classify(probe), "silted");
  const grate = cloneProbe({
    grate: { pathResolvedRelative: true },
  });
  assert.equal(classify(grate), "diverted");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("silted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("clogged"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("fouled"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("littered"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("drained"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("pooled"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("diverted"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("phantom"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("absolute"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("hooked"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 drained / silted / clogged helpers", () => {
  assert.equal(drainedOf(seed90456Silted().probe), false);
  assert.equal(siltedOf(seed90456Silted().probe), true);
  assert.equal(cloggedOf(seed90456Silted().probe), false);
  assert.equal(drainedOf(emptyProbe()), true);
  assert.equal(cloggedOf(seedClogged().probe), true);
  assert.equal(siltedOf(seedClogged().probe), false);
  assert.equal(drainedOf(seedDiverted().probe), false);
});

test("29 feed and reasons never use sump or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "drained");
  assert.doesNotMatch(idle.feed, /idle word is sump/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is sump/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "drained"), /Drained/);
  assert.ok(reasonsOf(emptyProbe(), "drained").some((line) => /idle word is drained/.test(line)));
});

test("30 forbidden idle list includes sump, empty, flat, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("sump"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("flat"));
  assert.ok(words.includes("fit"));
  assert.ok(words.includes("spoilt"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("drain"));
  assert.ok(words.includes("null"));
  assert.ok(words.includes("wicket"));
  assert.ok(words.includes("oubliette"));
  assert.ok(!words.includes("drained"));
});

test("31 demo sinks: Slack on alarm; Linear on silted/clogged/fouled; GitHub always", async () => {
  const silted = decide(seed90456Silted());
  const slack = slackSumpAlarm(silted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubSumpLedger(silted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub sump-ledger/);
  const linear = linearSumpTicket(silted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const diverted = decide(seedDiverted());
  const linearSkip = linearSumpTicket(diverted, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackSumpAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearSumpTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(silted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const silted = decide(seed90456Silted());
  const slack = slackSumpAlarm(silted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubSumpLedger(silted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearSumpTicket(silted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on drained / pooled / diverted / phantom / absolute / hooked", () => {
  for (const seed of [seedDrained, seedPooled, seedDiverted, seedPhantom, seedAbsolute, seedHooked]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackSumpAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on silted, clogged, and fouled", () => {
  assert.equal(decide(seed90456Silted()).linear, true);
  assert.equal(decide(seedClogged()).linear, true);
  assert.equal(decide(seedFouled()).linear, true);
  assert.equal(decide(seedLittered()).linear, false);
  assert.equal(decide(seedPooled()).linear, false);
  assert.equal(decide(seedDrained()).linear, false);
});

test("35 GitHub ledger fires on idle/shut scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const shut = decide({ action: "shut" });
  assert.equal(shut.github, true);
});

test("36 handle silted / clogged / fouled / littered deny", async () => {
  const silted = await handle(seed90456Silted(), {});
  assert.equal(silted.permissionDecision, "deny");
  assert.match(silted.hookSpecificOutput.decision.message, /silted/);
  const clogged = await handle(seedClogged(), {});
  assert.equal(clogged.permissionDecision, "deny");
  const fouled = await handle(seedFouled(), {});
  assert.equal(fouled.permissionDecision, "deny");
  const littered = await handle(seedLittered(), {});
  assert.equal(littered.permissionDecision, "deny");
});

test("37 handle drained / pooled / diverted / phantom / absolute / hooked allow", async () => {
  const idle = await handle({ action: "shut" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /drained/);
  const pooled = await handle(seedPooled(), {});
  assert.equal(pooled.permissionDecision, "allow");
  const diverted = await handle(seedDiverted(), {});
  assert.equal(diverted.permissionDecision, "allow");
  const phantom = await handle(seedPhantom(), {});
  assert.equal(phantom.permissionDecision, "allow");
  const absolute = await handle(seedAbsolute(), {});
  assert.equal(absolute.permissionDecision, "allow");
  const hooked = await handle(seedHooked(), {});
  assert.equal(hooked.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is drained", async () => {
  const server = listen(19070);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19070/health");
  const info = await health.json();
  assert.equal(info.product, "sump");
  assert.match(info.verbs, /silted/);
  const res = await fetch("http://127.0.0.1:19070/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "drained");
  assert.equal(body.idleWord, "drained");
  const scored = await fetch("http://127.0.0.1:19070/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90456Silted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "silted");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19071);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19071/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19071/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    drained: seedDrained,
    silted: seed90456Silted,
    clogged: seedClogged,
    fouled: seedFouled,
    pooled: seedPooled,
    diverted: seedDiverted,
    littered: seedLittered,
    phantom: seedPhantom,
    absolute: seedAbsolute,
    hooked: seedHooked,
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

test("41 admit does not lie on every fault class", () => {
  const rows = [
    ["silted", seed90456Silted],
    ["clogged", seedClogged],
    ["fouled", seedFouled],
    ["pooled", seedPooled],
    ["diverted", seedDiverted],
    ["littered", seedLittered],
    ["phantom", seedPhantom],
    ["absolute", seedAbsolute],
    ["hooked", seedHooked],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word drained, seeded silted, not wicket/pleat", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /drained/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /Silt/);
  assert.match(html, /silted/);
  assert.match(html, /90456/);
  assert.match(html, /seedOf\("silted"\)|probe = seedOf\("silted"\)/);
  assert.doesNotMatch(html, /Admit sump/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sump"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "flat"/);
  assert.match(html, /const IDLE_WORD = "drained"/);
  assert.match(html, /grate|bilge|silt|concrete|pump|ochre|teal/i);
  assert.match(html, /06:50 Sydney · sump/);
  assert.match(html, /null path is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Sump/);
  assert.match(html, /Space Grotesk|IBM Plex Mono/);
});

test("43 HTML why-not names Wicket, Scant, Pleat, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Scant/);
  assert.match(html, /NOT Pleat/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Sump is a gatehouse/i);
  assert.doesNotMatch(html, /Sump is a timber yard/i);
  assert.doesNotMatch(html, /this is a tailor/i);
});

test("44 README names Wicket / Scant / Pleat contrast and drained idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Wicket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /NOT Pleat/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*drained\*\*/);
  assert.match(readme, /#90456|#90456/);
  assert.match(readme, /#69453|#69453/);
  assert.doesNotMatch(readme, /idle word is sump/i);
  assert.doesNotMatch(readme, /idle word is flat/i);
  assert.doesNotMatch(readme, /Sump is a gatehouse/i);
});

test("45 score() silted includes silted and not drained", () => {
  const result = score(seed90456Silted().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "silted");
  assert.equal(result.drained, false);
  assert.equal(result.silted, true);
  assert.equal(result.clogged, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const silted = decide(seed90456Silted());
  const events = await fire(silted, { SUMP_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted silted/);
});

test("47 fire live github and linear paths", async () => {
  const silted = decide(seed90456Silted());
  const events = await fire(
    silted,
    {
      SUMP_GITHUB_TOKEN: "tok",
      SUMP_LINEAR_KEY: "lin",
      SUMP_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "SMP-1", url: "https://linear.app/smp-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /SMP-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90456Silted().probe, "silted").some((line) => /#90456/.test(line)));
  assert.ok(reasonsOf(seedPooled().probe, "pooled").some((line) => /#90456/.test(line)));
  assert.ok(reasonsOf(seedPhantom().probe, "phantom").some((line) => /#69453|#90456/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const silted = decide(seed90456Silted());
  const slack = slackSumpAlarm(silted, {});
  const github = githubSumpLedger(silted, {});
  const linear = linearSumpTicket(silted, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(silted, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 34 products, Leat featured, Sump listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 34);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Leat");
  const sump = catalog.products.find((row) => row.slug === "sump");
  assert.ok(sump);
  assert.equal(sump.featured, false);
  assert.equal(sump.href, "/sump/");
  assert.equal(sump.day, "2026-08-29");
  assert.match(sump.summary, /06:50|null path is not a hold|drained/);
  const pleat = catalog.products.find((row) => row.slug === "pleat");
  assert.ok(pleat);
  assert.equal(pleat.featured, false);
  const scant = catalog.products.find((row) => row.slug === "scant");
  assert.ok(scant);
  assert.equal(scant.featured, false);
  const chad = catalog.products.find((row) => row.slug === "chad");
  assert.ok(chad);
  assert.equal(chad.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "leat");
  assert.equal(slugs[1], "shunt");
  assert.ok(slugs.includes("scant"));
  assert.ok(slugs.includes("wicket"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("drain"));
  assert.ok(!slugs.includes("null"));
  assert.ok(!slugs.includes("oubliette"));
});

test("51 vercel rewrite order puts /shunt then /sump before /pleat, /scant and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/leat");
  assert.equal(sources[1], "/leat/");
  assert.equal(sources[2], "/shunt");
  assert.equal(sources[3], "/shunt/");
  assert.ok(sources.includes("/pleat"));
  assert.ok(sources.includes("/scant"));
  assert.ok(sources.includes("/chad"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/shunt") < sources.indexOf("/sump"));
  assert.ok(sources.indexOf("/sump") < sources.indexOf("/pleat"));
  assert.ok(sources.indexOf("/sump/") < sources.indexOf("/:slug"));
});

test("52 hours.json keeps the 06:50 Sydney Sump ship after Shunt", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  const sump = hours.find((row) => row.stem === "2026-08-29-sump");
  assert.ok(sump);
  assert.equal(sump.date, "2026-08-29");
  assert.equal(sump.time, "06:50");
  assert.equal(sump.tz, "Australia/Sydney");
  assert.equal(sump.title, "Sump");
  assert.equal(sump.kind, "ship");
  assert.match(sump.note, /drained/);
  assert.match(sump.note, /Pleat/);
  assert.match(sump.note, /Scant/);
  assert.equal(hours[0].stem, "2026-08-29-leat");
  assert.equal(hours[1].stem, "2026-08-29-shunt");
  assert.ok(hours.some((row) => row.stem === "2026-08-29-sump"));
});

test("53 clusterOf on #90456 includes clogged fouled littered diverted phantom absolute hooked", () => {
  const cluster = clusterOf(seed90456Silted().probe, "silted");
  assert.deepEqual(
    cluster
      .filter((word) =>
        ["clogged", "fouled", "littered", "diverted", "phantom", "absolute", "hooked"].includes(word),
      )
      .sort(),
    ["absolute", "clogged", "diverted", "fouled", "hooked", "littered", "phantom"],
  );
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    literalNullDir: "true",
    hookFiles: "post-checkout,post-commit,post-merge,pre-push",
    hooksLandedInNull: "true",
    gitStatusUntracked: "true",
    emptyNullDir: "false",
  });
  assert.equal(probe.literalNullDir, true);
  assert.equal(probe.emptyNullDir, false);
  assert.equal(probe.gitStatusUntracked, true);
  assert.deepEqual(probe.hookFiles, [...LFS_HOOKS]);
  assert.equal(classify(probe), "silted");
});

test("55 parseWorktreeStatus detects literal pit and LFS hooks from pasted status", () => {
  const parsed = parseWorktreeStatus(`
On branch worktree
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	dev/null/post-checkout
	dev/null/post-commit
	dev/null/post-merge
	dev/null/pre-push
core.hookspath=D:\\wkspaces\\Reveal-Platform\\.git\\hooks
`);
  assert.equal(parsed.literalNullDir, true);
  assert.deepEqual(parsed.hookFiles, [...LFS_HOOKS]);
  assert.equal(parsed.fullyPopulated, true);
  assert.equal(parsed.gitStatusUntracked, true);
  assert.match(parsed.hookspathClaimed, /Reveal-Platform/);
  assert.equal(parsed.hookspathIsAbsolute, true);
});
