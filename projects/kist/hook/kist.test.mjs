import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubKistLedger,
  linearKistTicket,
  slackKistAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  clusterOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hollowOf,
  isIdle,
  kistedOf,
  laidOf,
  reasonsOf,
  score,
  seed65838Split,
  seed90387Kisted,
  seedHollow,
  seedLaid,
  seedLost,
  seedRecalled,
  seedRisen,
  seedSealed,
  seedStuck,
  seedVeiled,
  verdictOf,
} from "./kist.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverKist(result) {
  assert.equal(result.idleWord, "laid");
  assert.equal(IDLE_WORD, "laid");
  assert.doesNotMatch(result.idleWord, /kist/i);
  assert.doesNotMatch(IDLE_WORD, /kist/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(result.idleWord, /unlinked|tight|banked|seised|seated|latched|stocked|roosted/);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.laid, "boolean");
  assert.equal(typeof result.kisted, "boolean");
  assert.equal(typeof result.hollow, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90387 kisted is kisted, slack, linear, idleWord laid", () => {
  const seed = seed90387Kisted();
  const result = decide(seed);
  assert.equal(result.verdict, "kisted");
  assert.equal(result.state, "kisted");
  assert.equal(result.decision, "kisted");
  assert.equal(classify(seed.probe), "kisted");
  assert.equal(verdictOf(seed.probe), "kisted");
  assert.notEqual(result.verdict, "laid");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.lidKisted, true);
  assert.equal(result.lidLaid, false);
  assert.equal(result.laid, false);
  assert.equal(result.kisted, true);
  assert.equal(result.hollow, false);
  assertIdleNeverKist(result);
  assert.equal(result.session, "90387-kisted");
  assert.equal(result.issue, 90387);
  assert.equal(result.teardownCause, "auto-update");
  assert.equal(result.ccrArchiveRequested, true);
  assert.equal(result.ccrUnarchiveRequested, false);
  assert.equal(result.localUnarchiveRan, true);
  assert.equal(result.ccrArchiveCount, 278);
  assert.equal(result.ccrUnarchiveCount, 0);
  assert.equal(result.localUnarchiveCount, 3);
  assert.match(result.feed, /archived on teardown/);
  assert.ok(result.cluster.includes("hollow"));
  assert.ok(result.cluster.includes("stuck"));
  assert.ok(result.cluster.includes("lost"));
  assert.ok(result.cluster.includes("veiled"));
  assert.ok(result.cluster.includes("sealed"));
  assert.ok(result.cluster.includes("recalled"));
  assert.ok(!result.cluster.includes("kisted"));
  assert.ok(!result.cluster.includes("laid"));
  assert.equal(decideSeed(90387).verdict, "kisted");
  assert.equal(decideSeed("kisted").verdict, "kisted");
  assert.equal(decideSeed("90387-kisted").verdict, "kisted");
});

test("2 idle/empty/{} is laid, never the product name, never empty, never unlinked", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "laid");
  assert.equal(result.verdict, "laid");
  assert.equal(result.decision, "laid");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.laid, true);
  assert.equal(result.kisted, false);
  assert.equal(classify({}), "laid");
  assert.equal(classify(emptyProbe()), "laid");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverKist(result);
  const seated = decide({ action: "shut" });
  assert.equal(seated.state, "laid");
  assert.equal(seated.idleWord, "laid");
  assert.equal(seated.ccrArchiveRequested, false);
  assert.doesNotMatch(seated.state, /kist/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "laid");
  assert.equal(empty.idleWord, "laid");
});

test("3 risen: CCR unarchive reached cloud, back on the default list", () => {
  const result = decide(seedRisen());
  assert.equal(result.verdict, "risen");
  assert.equal(result.ccrUnarchiveRequested, true);
  assert.equal(result.onMobileDefaultList, true);
  assert.equal(result.cloudStillArchived, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /back on the default list/);
  assert.equal(decideSeed("risen").verdict, "risen");
});

test("4 hollow: local active + reattached, cloud still archived", () => {
  const result = decide(seedHollow());
  assert.equal(result.verdict, "hollow");
  assert.equal(result.localSessionActive, true);
  assert.equal(result.reattachedBridgeId, true);
  assert.equal(result.cloudStillArchived, true);
  assert.equal(result.teardownCause, "");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.hollow, true);
  assert.match(result.feed, /cenotaph/);
  assert.equal(decideSeed("hollow").verdict, "hollow");
});

test("5 stuck: local unarchive, zero CCR unarchive", () => {
  const result = decide(seedStuck());
  assert.equal(result.verdict, "stuck");
  assert.equal(result.localUnarchiveRan, true);
  assert.equal(result.ccrUnarchiveRequested, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.match(result.feed, /zero CCR unarchive/);
  assert.equal(decideSeed("stuck").verdict, "stuck");
});

test("6 lost: gone from mobile default list, only under Archived", () => {
  const result = decide(seedLost());
  assert.equal(result.verdict, "lost");
  assert.equal(result.vanishedFromDefault, true);
  assert.equal(result.archivedFilterOnly, true);
  assert.equal(result.onMobileDefaultList, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /gone from the mobile default list/);
  assert.equal(decideSeed("lost").verdict, "lost");
});

test("7 sealed: no desktop-side action restores the cloud session", () => {
  const result = decide(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.noDesktopRestore, true);
  assert.equal(result.cloudStillArchived, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /no desktop-side action restores/);
  assert.equal(decideSeed("sealed").verdict, "sealed");
});

test("8 recalled: reopened locally, reattached to original bridge id", () => {
  const result = decide(seedRecalled());
  assert.equal(result.verdict, "recalled");
  assert.equal(result.reopenedLocally, true);
  assert.equal(result.reattachedBridgeId, true);
  assert.equal(result.cloudStillArchived, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /original bridge session id/);
  assert.equal(decideSeed("recalled").verdict, "recalled");
});

test("9 split #65838: archive state differs per client", () => {
  const result = decide(seed65838Split());
  assert.equal(result.verdict, "split");
  assert.equal(result.issue, 65838);
  assert.equal(result.archiveStateDiffersPerClient, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /#65838/);
  assert.equal(decideSeed(65838).verdict, "split");
});

test("10 veiled: listed only under the Archived filter", () => {
  const result = decide(seedVeiled());
  assert.equal(result.verdict, "veiled");
  assert.equal(result.archivedFilterOnly, true);
  assert.equal(result.vanishedFromDefault, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /Archived filter/);
  assert.equal(decideSeed("veiled").verdict, "veiled");
});

test("11 laid seed is laid and never alarms", () => {
  const result = decide(seedLaid());
  assert.equal(result.verdict, "laid");
  assert.equal(result.ccrArchiveRequested, false);
  assert.equal(result.laid, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Laid/);
  assert.equal(decideSeed("laid").verdict, "laid");
});

test("12 score() idle probe is laid and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "laid");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.laid, true);
  assert.equal(result.kisted, false);
  assert.equal(result.hollow, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "laid",
    "kisted",
    "risen",
    "hollow",
    "stuck",
    "lost",
    "sealed",
    "recalled",
    "split",
    "veiled",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["kisted", "hollow", "stuck", "lost", "sealed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["kisted", "lost", "sealed"]);
  assert.equal(IDLE_WORD, "laid");
  assert.doesNotMatch(IDLE_WORD, /kist/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /unlinked|tight|banked|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /kist[^e]|unlinked|wraith/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["laid", seedLaid],
    ["kisted", seed90387Kisted],
    ["risen", seedRisen],
    ["hollow", seedHollow],
    ["stuck", seedStuck],
    ["lost", seedLost],
    ["sealed", seedSealed],
    ["recalled", seedRecalled],
    ["split", seed65838Split],
    ["veiled", seedVeiled],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: kisted stays kisted", () => {
  const result = decide({ ...seed90387Kisted(), action: "admit" });
  assert.equal(result.verdict, "kisted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /kist$/i);
  assert.doesNotMatch(result.verdict, /laid/);
});

test("16 score / lift scores kisted", () => {
  const result = decide({ ...seed90387Kisted(), action: "score" });
  assert.equal(result.verdict, "kisted");
  assert.equal(result.action, "score");
  assert.equal(result.ccrArchiveRequested, true);
  const lifted = decide({ ...seed90387Kisted(), action: "lift" });
  assert.equal(lifted.verdict, "kisted");
  assert.equal(lifted.action, "lift");
});

test("17 shut / seat / clear returns idle laid", () => {
  const shut = decide({ ...seed90387Kisted(), action: "shut" });
  assert.equal(shut.verdict, "laid");
  assert.equal(shut.action, "shut");
  assert.equal(shut.ccrArchiveRequested, false);
  assert.equal(isIdle(shut.probe), true);
  assertIdleNeverKist(shut);
  const seated = decide({ ...seedHollow(), action: "seat" });
  assert.equal(seated.verdict, "laid");
  assert.equal(isIdle(seated.probe), true);
  const cleared = decide({ ...seedLost(), action: "clear" });
  assert.equal(cleared.verdict, "laid");
  assert.equal(cleared.action, "shut");
});

test("18 kist on idle produces kisted funeral", () => {
  const result = decide({ action: "kist", probe: emptyProbe() });
  assert.equal(result.verdict, "kisted");
  assert.equal(result.action, "kist");
  assert.equal(result.ccrArchiveRequested, true);
  assert.equal(result.teardownCause, "auto-update");
  assert.equal(result.kisted, true);
});

test("19 kist on a hollow probe becomes kisted", () => {
  const result = decide({ ...seedHollow(), action: "kist" });
  assert.equal(result.verdict, "kisted");
  assert.equal(result.action, "kist");
  assert.equal(result.ccrArchiveRequested, true);
});

test("20 ledger marks the funeral check and does not lie", () => {
  const result = decide({ ...seed90387Kisted(), action: "ledger" });
  assert.equal(result.verdict, "kisted");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Ledger checked/.test(line)));
});

test("21 observe on recalled stays recalled", () => {
  const result = decide({ ...seedRecalled(), action: "observe" });
  assert.equal(result.verdict, "recalled");
  assert.equal(result.observed, true);
  assert.equal(result.reopenedLocally, true);
});

test("22 unarchive produces risen", () => {
  const result = decide({ ...seed90387Kisted(), action: "unarchive" });
  assert.equal(result.action, "unarchive");
  assert.equal(result.verdict, "risen");
  assert.equal(result.ccrUnarchiveRequested, true);
  assert.equal(result.onMobileDefaultList, true);
  assert.equal(result.kisted, false);
});

test("23 unarchive on idle produces risen", () => {
  const result = decide({ action: "unarchive", probe: emptyProbe() });
  assert.equal(result.verdict, "risen");
  assert.equal(result.ccrUnarchiveRequested, true);
});

test("24 reopen produces recalled", () => {
  const result = decide({ action: "reopen", probe: emptyProbe() });
  assert.equal(result.verdict, "recalled");
  assert.equal(result.action, "reopen");
  assert.equal(result.reopenedLocally, true);
  assert.equal(result.reattachedBridgeId, true);
});

test("25 split beats kisted when archive state differs per client", () => {
  assert.equal(
    classify({
      archiveStateDiffersPerClient: true,
      teardownCause: "auto-update",
      ccrArchiveRequested: true,
    }),
    "split",
  );
});

test("26 risen beats kisted when CCR unarchive reached the default list", () => {
  assert.equal(
    classify({
      ccrUnarchiveRequested: true,
      onMobileDefaultList: true,
      cloudStillArchived: false,
      teardownCause: "auto-update",
      ccrArchiveRequested: true,
    }),
    "risen",
  );
});

test("27 kisted requires teardown archive and does not steal hollow", () => {
  assert.equal(
    classify({
      teardownCause: "auto-update",
      ccrArchiveRequested: true,
      localSessionActive: true,
      reattachedBridgeId: true,
      cloudStillArchived: true,
    }),
    "kisted",
  );
  assert.equal(
    classify({
      localSessionActive: true,
      reattachedBridgeId: true,
      cloudStillArchived: true,
    }),
    "hollow",
  );
});

test("28 user archive and token-refresh and idle are not kisted", () => {
  assert.equal(
    classify({ teardownCause: "user archive", ccrArchiveRequested: true, userArchiveAction: true }),
    "laid",
  );
  assert.equal(
    classify({ teardownCause: "token-refresh", ccrArchiveRequested: true }),
    "laid",
  );
  assert.equal(
    classify({ teardownCause: "idle", ccrArchiveRequested: true }),
    "laid",
  );
});

test("29 server-mode is unaffected and is not kisted", () => {
  assert.equal(
    classify({
      teardownCause: "server-mode",
      serverMode: true,
      ccrArchiveRequested: true,
    }),
    "laid",
  );
});

test("30 app quit teardown with CCR archive is kisted", () => {
  assert.equal(
    classify({
      teardownCause: "app quit",
      ccrArchiveRequested: true,
    }),
    "kisted",
  );
});

test("31 nested lid / funeral / ledger / chest fields clone", () => {
  const probe = cloneProbe({
    funeral: { teardownCause: "auto-update", ccrArchiveRequested: true },
  });
  assert.equal(classify(probe), "kisted");
  const ledger = cloneProbe({
    ledger: { archiveStateDiffersPerClient: true },
  });
  assert.equal(classify(ledger), "split");
});

test("32 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("kisted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hollow"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stuck"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("lost"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("sealed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("laid"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("risen"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("recalled"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("split"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("veiled"), { slack: false, linear: false, github: true, alarm: false });
});

test("33 laid / kisted / hollow helpers", () => {
  assert.equal(laidOf(seed90387Kisted().probe), false);
  assert.equal(kistedOf(seed90387Kisted().probe), true);
  assert.equal(hollowOf(seed90387Kisted().probe), false);
  assert.equal(laidOf(emptyProbe()), true);
  assert.equal(hollowOf(seedHollow().probe), true);
  assert.equal(kistedOf(seedHollow().probe), false);
  assert.equal(laidOf(seedRecalled().probe), false);
});

test("34 feed and reasons never use kist or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "laid");
  assert.doesNotMatch(idle.feed, /idle word is kist/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is kist/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "laid"), /Laid/);
  assert.ok(reasonsOf(emptyProbe(), "laid").some((line) => /idle word is laid/.test(line)));
});

test("35 forbidden idle list includes kist, empty, unlinked, wraith, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("kist"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("unlinked"));
  assert.ok(words.includes("wraith"));
  assert.ok(words.includes("tight"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("livery"));
  assert.ok(words.includes("banked"));
  assert.ok(words.includes("crypt"));
  assert.ok(!words.includes("laid"));
});

test("36 demo sinks: Slack on alarm; Linear on kisted/lost/sealed; GitHub always", async () => {
  const kisted = decide(seed90387Kisted());
  const slack = slackKistAlarm(kisted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubKistLedger(kisted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub kist-ledger/);
  const linear = linearKistTicket(kisted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackKistAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearKistTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(kisted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("37 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const kisted = decide(seed90387Kisted());
  const slack = slackKistAlarm(kisted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubKistLedger(kisted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearKistTicket(kisted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("38 Slack skip on laid / risen / recalled / split / veiled", () => {
  for (const seed of [seedLaid, seedRisen, seedRecalled, seed65838Split, seedVeiled]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackKistAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("39 Linear only on kisted, lost, and sealed", () => {
  assert.equal(decide(seed90387Kisted()).linear, true);
  assert.equal(decide(seedLost()).linear, true);
  assert.equal(decide(seedSealed()).linear, true);
  assert.equal(decide(seedHollow()).linear, false);
  assert.equal(decide(seedStuck()).linear, false);
  assert.equal(decide(seedLaid()).linear, false);
});

test("40 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const shut = decide({ action: "shut" });
  assert.equal(shut.github, true);
});

test("41 handle kisted / hollow / stuck / lost / sealed deny", async () => {
  const kisted = await handle(seed90387Kisted(), {});
  assert.equal(kisted.permissionDecision, "deny");
  assert.match(kisted.hookSpecificOutput.decision.message, /kisted/);
  const hollow = await handle(seedHollow(), {});
  assert.equal(hollow.permissionDecision, "deny");
  const stuck = await handle(seedStuck(), {});
  assert.equal(stuck.permissionDecision, "deny");
  const lost = await handle(seedLost(), {});
  assert.equal(lost.permissionDecision, "deny");
  const sealed = await handle(seedSealed(), {});
  assert.equal(sealed.permissionDecision, "deny");
});

test("42 handle laid / risen / recalled / split / veiled allow", async () => {
  const idle = await handle({ action: "shut" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /laid/);
  const risen = await handle(seedRisen(), {});
  assert.equal(risen.permissionDecision, "allow");
  const recalled = await handle(seedRecalled(), {});
  assert.equal(recalled.permissionDecision, "allow");
  const split = await handle(seed65838Split(), {});
  assert.equal(split.permissionDecision, "allow");
  const veiled = await handle(seedVeiled(), {});
  assert.equal(veiled.permissionDecision, "allow");
});

test("43 listen GET health and POST empty body is laid", async () => {
  const server = listen(19087);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19087/health");
  const info = await health.json();
  assert.equal(info.product, "kist");
  assert.match(info.verbs, /kisted/);
  const res = await fetch("http://127.0.0.1:19087/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "laid");
  assert.equal(body.idleWord, "laid");
  const scored = await fetch("http://127.0.0.1:19087/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90387Kisted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "kisted");
  await new Promise((resolve) => server.close(resolve));
});

test("44 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19088);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19088/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19088/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("45 every verdict is uniquely first-match on its seed", () => {
  const map = {
    laid: seedLaid,
    kisted: seed90387Kisted,
    risen: seedRisen,
    hollow: seedHollow,
    stuck: seedStuck,
    lost: seedLost,
    sealed: seedSealed,
    recalled: seedRecalled,
    split: seed65838Split,
    veiled: seedVeiled,
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

test("46 admit does not lie on every fault class", () => {
  const rows = [
    ["kisted", seed90387Kisted],
    ["risen", seedRisen],
    ["hollow", seedHollow],
    ["stuck", seedStuck],
    ["lost", seedLost],
    ["sealed", seedSealed],
    ["recalled", seedRecalled],
    ["split", seed65838Split],
    ["veiled", seedVeiled],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("47 desk HTML sanity: idle word laid, seeded kisted, kist not afterimage", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /laid/);
  assert.match(html, /Score|Lift/);
  assert.match(html, /Shut/);
  assert.match(html, /kisted/);
  assert.match(html, /90387/);
  assert.match(html, /seedOf\("kisted"\)|probe = seedOf\("kisted"\)/);
  assert.doesNotMatch(html, /Admit kist/);
  assert.doesNotMatch(html, /const IDLE_WORD = "kist"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "unlinked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "tight"/);
  assert.match(html, /const IDLE_WORD = "laid"/);
  assert.match(html, /kist|chest|lid|ledger|funeral/i);
  assert.match(html, /02:50 Sydney · kist/);
  assert.match(html, /session still on the default list is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="bench"|class="bourdon"|class="lagging"|class="flange"|class="packing"/);
  assert.doesNotMatch(html, /--void:|--frost:|--ice:|--after:|--tomb:/);
  assert.doesNotMatch(html, /--linen:|--hessian:|--brass:|--lead:/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Kist/);
});

test("48 HTML why-not names Wraith, Damper, leftover, Snib, Cote, Reveille, Gasket", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Wraith/);
  assert.match(html, /NOT Damper/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Cote|NOT Cote \/ Nixie/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /NOT Gasket/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Kist is an afterimage/i);
  assert.doesNotMatch(html, /Kist is a chimney damper/i);
  assert.doesNotMatch(html, /this is a livery of seisin/i);
});

test("49 README names Wraith contrast and laid idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Wraith/);
  assert.match(readme, /NOT Damper/);
  assert.match(readme, /NOT Snib/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*laid\*\*/);
  assert.match(readme, /#90387|#90387/);
  assert.match(readme, /#87335|#87335/);
  assert.match(readme, /#65838|#65838/);
  assert.doesNotMatch(readme, /idle word is kist/i);
  assert.doesNotMatch(readme, /idle word is unlinked/i);
  assert.doesNotMatch(readme, /Kist is an afterimage/i);
});

test("50 score() kisted includes kisted and not laid", () => {
  const result = score(seed90387Kisted().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "kisted");
  assert.equal(result.laid, false);
  assert.equal(result.kisted, true);
  assert.equal(result.hollow, false);
});

test("51 fire live slack posts when fetch ok", async () => {
  const kisted = decide(seed90387Kisted());
  const events = await fire(kisted, { KIST_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted kisted/);
});

test("52 fire live github and linear paths", async () => {
  const kisted = decide(seed90387Kisted());
  const events = await fire(
    kisted,
    {
      KIST_GITHUB_TOKEN: "tok",
      KIST_LINEAR_KEY: "lin",
      KIST_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "KST-1", url: "https://linear.app/kst-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /KST-1/);
});

test("53 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90387Kisted().probe, "kisted").some((line) => /#90387/.test(line)));
  assert.ok(reasonsOf(seed65838Split().probe, "split").some((line) => /#65838/.test(line)));
});

test("54 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const kisted = decide(seed90387Kisted());
  const slack = slackKistAlarm(kisted, {});
  const github = githubKistLedger(kisted, {});
  const linear = linearKistTicket(kisted, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(kisted, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("55 catalog wiring: 28 products, Kist featured, Wraith listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 28);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Kist");
  assert.equal(featured[0].slug, "kist");
  assert.equal(featured[0].href, "/kist/");
  assert.equal(featured[0].day, "2026-08-29");
  assert.match(featured[0].summary, /02:50|kist|session still on the default list is not a hold|laid/);
  const wraith = catalog.products.find((row) => row.slug === "wraith");
  assert.ok(wraith);
  assert.equal(wraith.featured, false);
  const gasket = catalog.products.find((row) => row.slug === "gasket");
  assert.ok(gasket);
  assert.equal(gasket.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "kist");
  assert.ok(slugs.includes("wraith"));
  assert.ok(slugs.includes("gasket"));
  assert.ok(slugs.includes("damper"));
  assert.ok(slugs.includes("cote"));
  assert.ok(!slugs.includes("livery"));
});

test("56 vercel rewrite order puts /kist before /wraith and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/kist");
  assert.equal(sources[1], "/kist/");
  assert.ok(sources.includes("/wraith"));
  assert.ok(sources.includes("/gasket"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/kist") < sources.indexOf("/wraith"));
  assert.ok(sources.indexOf("/kist/") < sources.indexOf("/:slug"));
  assert.ok(!sources.includes("/livery"));
});

test("57 hours.json prepends the 02:50 Sydney Kist ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-kist");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "02:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Kist");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /laid/);
  assert.match(hours[0].note, /Wraith/);
});

test("58 clusterOf on #90387 includes hollow stuck lost veiled sealed recalled", () => {
  const cluster = clusterOf(seed90387Kisted().probe, "kisted");
  assert.deepEqual(
    cluster.filter((word) => ["hollow", "stuck", "lost", "veiled", "sealed", "recalled"].includes(word)).sort(),
    ["hollow", "lost", "recalled", "sealed", "stuck", "veiled"],
  );
});

test("59 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    teardownCause: "auto-update",
    ccrArchiveRequested: "true",
    ccrUnarchiveRequested: "false",
    ccrArchiveCount: "278",
  });
  assert.equal(probe.ccrArchiveRequested, true);
  assert.equal(probe.ccrUnarchiveRequested, false);
  assert.equal(probe.ccrArchiveCount, 278);
  assert.equal(classify(probe), "kisted");
});
