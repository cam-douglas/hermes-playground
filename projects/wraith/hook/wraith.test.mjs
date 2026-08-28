import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubWraithLedger,
  linearWraithTicket,
  slackWraithAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  ghostedOf,
  isIdle,
  prunedOf,
  reasonsOf,
  score,
  seed70071Severed,
  seed75355Stale,
  seed86129Orphaned,
  seed90373Pruned,
  seedEjected,
  seedGhosted,
  seedHeld,
  seedResurfaced,
  seedUnlinked,
  seedVoided,
  unlinkedOf,
  verdictOf,
} from "./wraith.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverWraith(result) {
  assert.equal(result.idleWord, "unlinked");
  assert.equal(IDLE_WORD, "unlinked");
  assert.doesNotMatch(result.idleWord, /wraith/i);
  assert.doesNotMatch(result.state, /wraith/i);
  assert.doesNotMatch(IDLE_WORD, /wraith/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(result.idleWord, /tight|banked|seised|seated|latched|stocked|roosted/);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.unlinked, "boolean");
  assert.equal(typeof result.ghosted, "boolean");
  assert.equal(typeof result.pruned, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90373 pruned is pruned, slack, linear, idleWord unlinked", () => {
  const seed = seed90373Pruned();
  const result = decide(seed);
  assert.equal(result.verdict, "pruned");
  assert.equal(result.state, "pruned");
  assert.equal(result.decision, "pruned");
  assert.equal(classify(seed.probe), "pruned");
  assert.equal(verdictOf(seed.probe), "pruned");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.imagePruned, true);
  assert.equal(result.imageUnlinked, false);
  assert.equal(result.unlinked, false);
  assert.equal(result.pruned, true);
  assert.equal(result.ghosted, false);
  assertIdleNeverWraith(result);
  assert.equal(result.session, "90373-pruned");
  assert.equal(result.issue, 90373);
  assert.equal(result.updaterPrunedRunningVersion, true);
  assert.equal(result.imageDeleted, true);
  assert.equal(result.grantsStillOn, true);
  assert.equal(result.readEperm, true);
  assert.equal(result.bashEperm, true);
  assert.match(result.feed, /updater removed the running version/);
  assert.equal(decideSeed(90373).verdict, "pruned");
  assert.equal(decideSeed("pruned").verdict, "pruned");
  assert.equal(decideSeed("90373-pruned").verdict, "pruned");
});

test("2 idle/empty/{} is unlinked, never the product name, never empty, never tight/seised", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "unlinked");
  assert.equal(result.verdict, "unlinked");
  assert.equal(result.decision, "unlinked");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.unlinked, true);
  assert.equal(result.pruned, false);
  assert.equal(classify({}), "unlinked");
  assert.equal(classify(emptyProbe()), "unlinked");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverWraith(result);
  const seated = decide({ action: "seat" });
  assert.equal(seated.state, "unlinked");
  assert.equal(seated.idleWord, "unlinked");
  assert.equal(seated.updaterPrunedRunningVersion, false);
  assert.doesNotMatch(seated.state, /wraith/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "unlinked");
  assert.equal(empty.idleWord, "unlinked");
});

test("3 ghosted: grants ON, in-app grant no-op, reads EPERM", () => {
  const result = decide(seedGhosted());
  assert.equal(result.verdict, "ghosted");
  assert.equal(result.grantsStillOn, true);
  assert.equal(result.inAppGrantSuccessNoOp, true);
  assert.equal(result.readEperm, true);
  assert.equal(result.updaterPrunedRunningVersion, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.ghosted, true);
  assert.match(result.feed, /grants still ON/);
  assert.equal(decideSeed("ghosted").verdict, "ghosted");
});

test("4 voided: TCC EPERM mid-session, no warning", () => {
  const result = decide(seedVoided());
  assert.equal(result.verdict, "voided");
  assert.equal(result.issue, 80941);
  assert.equal(result.readEperm, true);
  assert.equal(result.bashEperm, true);
  assert.equal(result.grantsStillOn, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /EPERM mid-session/);
  assert.equal(decideSeed(80941).verdict, "voided");
});

test("5 orphaned #86129: spawn success + child ENOENT", () => {
  const result = decide(seed86129Orphaned());
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.issue, 86129);
  assert.equal(result.spawnSuccessEnoent, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Spawned successfully/);
  assert.equal(decideSeed(86129).verdict, "orphaned");
  assert.equal(decideSeed("orphaned").verdict, "orphaned");
});

test("6 severed #70071: remote-control green, new sessions EPERM", () => {
  const result = decide(seed70071Severed());
  assert.equal(result.verdict, "severed");
  assert.equal(result.issue, 70071);
  assert.equal(result.remoteControlGreenButEperm, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /connected \/ green/);
  assert.equal(decideSeed(70071).verdict, "severed");
});

test("7 stale #75355: lsof /proc/exe shows (deleted)", () => {
  const result = decide(seed75355Stale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.issue, 75355);
  assert.equal(result.lsofOrProcExeDeleted, true);
  assert.equal(result.imageDeleted, true);
  assert.equal(result.updaterPrunedRunningVersion, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /\(deleted\)/);
  assert.equal(decideSeed(75355).verdict, "stale");
});

test("8 resurfaced: post-update session reads the same file", () => {
  const result = decide(seedResurfaced());
  assert.equal(result.verdict, "resurfaced");
  assert.equal(result.postUpdateSessionReadsOk, true);
  assert.equal(result.readEperm, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /grant still exists/);
  assert.equal(decideSeed("resurfaced").verdict, "resurfaced");
});

test("9 ejected: only restart restores capability", () => {
  const result = decide(seedEjected());
  assert.equal(result.verdict, "ejected");
  assert.equal(result.restartRestores, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /only restart restores/);
  assert.equal(decideSeed("ejected").verdict, "ejected");
});

test("10 held: current-image session, path readable, grants match", () => {
  const result = decide(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.grantsStillOn, true);
  assert.equal(result.imageDeleted, false);
  assert.equal(result.readEperm, false);
  assert.equal(result.unlinked, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /grants match reality/);
  assert.equal(decideSeed("held").verdict, "held");
});

test("11 unlinked seed is unlinked and never alarms", () => {
  const result = decide(seedUnlinked());
  assert.equal(result.verdict, "unlinked");
  assert.equal(result.updaterPrunedRunningVersion, false);
  assert.equal(result.unlinked, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Unlinked/);
  assert.equal(decideSeed("unlinked").verdict, "unlinked");
});

test("12 score() idle probe is unlinked and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "unlinked");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unlinked, true);
  assert.equal(result.ghosted, false);
  assert.equal(result.pruned, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "unlinked",
    "pruned",
    "ghosted",
    "voided",
    "orphaned",
    "severed",
    "stale",
    "resurfaced",
    "ejected",
    "held",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["pruned", "ghosted", "voided", "orphaned", "severed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["pruned", "orphaned", "severed"]);
  assert.equal(IDLE_WORD, "unlinked");
  assert.doesNotMatch(IDLE_WORD, /wraith/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /tight|banked|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /wraith/);
  assert.doesNotMatch(VERDICTS.join(" "), /seised/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["unlinked", seedUnlinked],
    ["pruned", seed90373Pruned],
    ["ghosted", seedGhosted],
    ["voided", seedVoided],
    ["orphaned", seed86129Orphaned],
    ["severed", seed70071Severed],
    ["stale", seed75355Stale],
    ["resurfaced", seedResurfaced],
    ["ejected", seedEjected],
    ["held", seedHeld],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: pruned stays pruned", () => {
  const result = decide({ ...seed90373Pruned(), action: "admit" });
  assert.equal(result.verdict, "pruned");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /wraith/i);
  assert.doesNotMatch(result.verdict, /unlinked/);
});

test("16 press scores pruned", () => {
  const result = decide({ ...seed90373Pruned(), action: "press" });
  assert.equal(result.verdict, "pruned");
  assert.equal(result.action, "press");
  assert.equal(result.updaterPrunedRunningVersion, true);
});

test("17 seat / clear returns idle unlinked", () => {
  const seated = decide({ ...seed90373Pruned(), action: "seat" });
  assert.equal(seated.verdict, "unlinked");
  assert.equal(seated.action, "seat");
  assert.equal(seated.updaterPrunedRunningVersion, false);
  assert.equal(isIdle(seated.probe), true);
  assertIdleNeverWraith(seated);
  const cleared = decide({ ...seedGhosted(), action: "clear" });
  assert.equal(cleared.verdict, "unlinked");
  assert.equal(cleared.action, "seat");
  assert.equal(isIdle(cleared.probe), true);
});

test("18 unlink on idle produces pruned afterimage", () => {
  const result = decide({ action: "unlink", probe: emptyProbe() });
  assert.equal(result.verdict, "pruned");
  assert.equal(result.action, "unlink");
  assert.equal(result.updaterPrunedRunningVersion, true);
  assert.equal(result.imageDeleted, true);
  assert.equal(result.pruned, true);
});

test("19 unlink on a ghosted probe becomes pruned", () => {
  const result = decide({ ...seedGhosted(), action: "unlink" });
  assert.equal(result.verdict, "pruned");
  assert.equal(result.action, "unlink");
  assert.equal(result.updaterPrunedRunningVersion, true);
});

test("20 trace marks the lsof/proc check and does not lie", () => {
  const result = decide({ ...seed90373Pruned(), action: "trace" });
  assert.equal(result.verdict, "pruned");
  assert.equal(result.action, "trace");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Trace checked/.test(line)));
});

test("21 observe on held stays held", () => {
  const result = decide({ ...seedHeld(), action: "observe" });
  assert.equal(result.verdict, "held");
  assert.equal(result.observed, true);
  assert.equal(result.grantsStillOn, true);
});

test("22 hold produces a current-image hold", () => {
  const result = decide({ ...seed90373Pruned(), action: "hold" });
  assert.equal(result.action, "hold");
  assert.equal(result.verdict, "held");
  assert.equal(result.grantsStillOn, true);
  assert.equal(result.imageDeleted, false);
  assert.equal(result.unlinked, false);
});

test("23 hold on idle produces held", () => {
  const result = decide({ action: "hold", probe: emptyProbe() });
  assert.equal(result.verdict, "held");
  assert.equal(result.grantsStillOn, true);
});

test("24 orphaned beats pruned when spawn success ENOENT is set", () => {
  assert.equal(
    classify({
      spawnSuccessEnoent: true,
      updaterPrunedRunningVersion: true,
      imageDeleted: true,
    }),
    "orphaned",
  );
});

test("25 severed beats pruned when remote-control is green-but-EPERM", () => {
  assert.equal(
    classify({
      remoteControlGreenButEperm: true,
      updaterPrunedRunningVersion: true,
    }),
    "severed",
  );
});

test("26 pruned requires updater prune and does not steal ghosted", () => {
  assert.equal(
    classify({
      updaterPrunedRunningVersion: true,
      imageDeleted: true,
      grantsStillOn: true,
      readEperm: true,
    }),
    "pruned",
  );
  assert.equal(
    classify({
      grantsStillOn: true,
      inAppGrantSuccessNoOp: true,
      readEperm: true,
    }),
    "ghosted",
  );
});

test("27 ghosted does not steal voided (in-app grant no-op vs bare EPERM)", () => {
  assert.equal(classify(seedGhosted().probe), "ghosted");
  assert.equal(classify(seedVoided().probe), "voided");
  assert.notEqual(seedGhosted().probe.inAppGrantSuccessNoOp, seedVoided().probe.inAppGrantSuccessNoOp);
});

test("28 stale requires (deleted) inode and does not steal pruned", () => {
  assert.equal(classify(seed90373Pruned().probe), "pruned");
  assert.equal(classify(seed75355Stale().probe), "stale");
  assert.equal(seed75355Stale().probe.updaterPrunedRunningVersion, false);
  assert.equal(seed75355Stale().probe.lsofOrProcExeDeleted, true);
});

test("29 resurfaced requires post-update read and does not steal held", () => {
  assert.equal(classify(seedResurfaced().probe), "resurfaced");
  assert.equal(classify(seedHeld().probe), "held");
  assert.equal(seedResurfaced().probe.postUpdateSessionReadsOk, true);
  assert.equal(seedHeld().probe.postUpdateSessionReadsOk, false);
});

test("30 ejected requires restart and does not steal unlinked", () => {
  assert.equal(classify({ restartRestores: true }), "ejected");
  assert.equal(classify(emptyProbe()), "unlinked");
});

test("31 nested pane / image / inode / tombstone fields clone", () => {
  const probe = cloneProbe({
    pane: { updaterPrunedRunningVersion: true, imageDeleted: true },
  });
  assert.equal(classify(probe), "pruned");
  const inode = cloneProbe({
    inode: { lsofOrProcExeDeleted: true, imageDeleted: true },
  });
  assert.equal(classify(inode), "stale");
});

test("32 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("pruned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("ghosted"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("voided"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("orphaned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("severed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("unlinked"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("held"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("stale"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("resurfaced"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("ejected"), { slack: false, linear: false, github: true, alarm: false });
});

test("33 unlinked / ghosted / pruned helpers", () => {
  assert.equal(unlinkedOf(seed90373Pruned().probe), false);
  assert.equal(prunedOf(seed90373Pruned().probe), true);
  assert.equal(ghostedOf(seed90373Pruned().probe), false);
  assert.equal(unlinkedOf(emptyProbe()), true);
  assert.equal(ghostedOf(seedGhosted().probe), true);
  assert.equal(prunedOf(seedGhosted().probe), false);
  assert.equal(unlinkedOf(seedHeld().probe), false);
});

test("34 feed and reasons never use wraith or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "unlinked");
  assert.doesNotMatch(idle.feed, /idle word is wraith/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is wraith/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "unlinked"), /Unlinked/);
  assert.ok(reasonsOf(emptyProbe(), "unlinked").some((line) => /idle word is unlinked/.test(line)));
});

test("35 forbidden idle list includes wraith, empty, tight, seised, banked", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("wraith"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("tight"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("livery"));
  assert.ok(words.includes("banked"));
  assert.ok(words.includes("seated"));
  assert.ok(words.includes("latched"));
  assert.ok(!words.includes("unlinked"));
});

test("36 demo sinks: Slack on alarm; Linear on pruned/orphaned/severed; GitHub always", async () => {
  const pruned = decide(seed90373Pruned());
  const slack = slackWraithAlarm(pruned, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubWraithLedger(pruned, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub wraith-ledger/);
  const linear = linearWraithTicket(pruned, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackWraithAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearWraithTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(pruned, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("37 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const pruned = decide(seed90373Pruned());
  const slack = slackWraithAlarm(pruned, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubWraithLedger(pruned, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearWraithTicket(pruned, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("38 Slack skip on unlinked / held / stale / resurfaced / ejected", () => {
  for (const seed of [seedUnlinked, seedHeld, seed75355Stale, seedResurfaced, seedEjected]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackWraithAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("39 Linear only on pruned, orphaned, and severed", () => {
  assert.equal(decide(seed90373Pruned()).linear, true);
  assert.equal(decide(seed86129Orphaned()).linear, true);
  assert.equal(decide(seed70071Severed()).linear, true);
  assert.equal(decide(seedGhosted()).linear, false);
  assert.equal(decide(seedVoided()).linear, false);
  assert.equal(decide(seedUnlinked()).linear, false);
});

test("40 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const seated = decide({ action: "seat" });
  assert.equal(seated.github, true);
});

test("41 handle pruned / ghosted / voided / orphaned / severed deny", async () => {
  const pruned = await handle(seed90373Pruned(), {});
  assert.equal(pruned.permissionDecision, "deny");
  assert.match(pruned.hookSpecificOutput.decision.message, /pruned/);
  const ghosted = await handle(seedGhosted(), {});
  assert.equal(ghosted.permissionDecision, "deny");
  const voided = await handle(seedVoided(), {});
  assert.equal(voided.permissionDecision, "deny");
  const orphaned = await handle(seed86129Orphaned(), {});
  assert.equal(orphaned.permissionDecision, "deny");
  const severed = await handle(seed70071Severed(), {});
  assert.equal(severed.permissionDecision, "deny");
});

test("42 handle unlinked / held / stale / resurfaced / ejected allow", async () => {
  const idle = await handle({ action: "seat" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /unlinked/);
  const held = await handle(seedHeld(), {});
  assert.equal(held.permissionDecision, "allow");
  const stale = await handle(seed75355Stale(), {});
  assert.equal(stale.permissionDecision, "allow");
  const resurfaced = await handle(seedResurfaced(), {});
  assert.equal(resurfaced.permissionDecision, "allow");
  const ejected = await handle(seedEjected(), {});
  assert.equal(ejected.permissionDecision, "allow");
});

test("43 listen GET health and POST empty body is unlinked", async () => {
  const server = listen(19073);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19073/health");
  const info = await health.json();
  assert.equal(info.product, "wraith");
  assert.match(info.verbs, /pruned/);
  const res = await fetch("http://127.0.0.1:19073/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "unlinked");
  assert.equal(body.idleWord, "unlinked");
  const scored = await fetch("http://127.0.0.1:19073/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90373Pruned()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "pruned");
  await new Promise((resolve) => server.close(resolve));
});

test("44 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19074);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19074/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19074/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("45 every verdict is uniquely first-match on its seed", () => {
  const map = {
    unlinked: seedUnlinked,
    pruned: seed90373Pruned,
    ghosted: seedGhosted,
    voided: seedVoided,
    orphaned: seed86129Orphaned,
    severed: seed70071Severed,
    stale: seed75355Stale,
    resurfaced: seedResurfaced,
    ejected: seedEjected,
    held: seedHeld,
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
    ["pruned", seed90373Pruned],
    ["ghosted", seedGhosted],
    ["voided", seedVoided],
    ["orphaned", seed86129Orphaned],
    ["severed", seed70071Severed],
    ["stale", seed75355Stale],
    ["resurfaced", seedResurfaced],
    ["ejected", seedEjected],
    ["held", seedHeld],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("47 desk HTML sanity: idle word unlinked, seeded pruned, afterimage not flange", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /unlinked/);
  assert.match(html, /Press|Score/);
  assert.match(html, /Seat/);
  assert.match(html, /Trace/);
  assert.match(html, /Unlink/);
  assert.match(html, /Hold/);
  assert.match(html, /pruned/);
  assert.match(html, /90373/);
  assert.match(html, /seedOf\("pruned"\)|probe = seedOf\("pruned"\)/);
  assert.doesNotMatch(html, /Admit wraith/);
  assert.doesNotMatch(html, /const IDLE_WORD = "wraith"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "tight"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "seised"/);
  assert.match(html, /const IDLE_WORD = "unlinked"/);
  assert.match(html, /afterimage|tombstone|inode|deleted/i);
  assert.match(html, /01:50 Sydney · wraith/);
  assert.match(html, /grant that is still ON is not a hold/i);
  assert.doesNotMatch(html, /class="bench"|class="bourdon"|class="lagging"|class="flange"|class="packing"/);
  assert.doesNotMatch(html, /--linen:|--hessian:|--brass:|--lead:/);
  assert.doesNotMatch(html, /baize|parchment|manor.court/i);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
});

test("48 HTML why-not names Gasket, Damper, Snib, Knock, Husk, Livery", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Gasket/);
  assert.match(html, /NOT Damper/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Knock/);
  assert.match(html, /NOT Husk/);
  assert.match(html, /NOT Livery/);
  assert.match(html, /NOT Cote|NOT Cote \/ Nixie/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider/);
  assert.doesNotMatch(html, /Wraith is a steam flange/i);
  assert.doesNotMatch(html, /Wraith is a chimney damper/i);
  assert.doesNotMatch(html, /this is a livery of seisin/i);
});

test("49 README names Gasket contrast and unlinked idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Gasket/);
  assert.match(readme, /NOT Damper/);
  assert.match(readme, /NOT Snib/);
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Livery/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*unlinked\*\*/);
  assert.match(readme, /#90373|#90373/);
  assert.match(readme, /#86129|#86129/);
  assert.match(readme, /#75355|#75355/);
  assert.match(readme, /#70071|#70071/);
  assert.doesNotMatch(readme, /idle word is wraith/i);
  assert.doesNotMatch(readme, /Wraith is a steam flange/i);
  assert.doesNotMatch(readme, /disclaimer-spawn is the thesis/);
});

test("50 score() pruned includes pruned and not unlinked", () => {
  const result = score(seed90373Pruned().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "pruned");
  assert.equal(result.unlinked, false);
  assert.equal(result.pruned, true);
  assert.equal(result.ghosted, false);
});

test("51 fire live slack posts when fetch ok", async () => {
  const pruned = decide(seed90373Pruned());
  const events = await fire(pruned, { WRAITH_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted pruned/);
});

test("52 fire live github and linear paths", async () => {
  const pruned = decide(seed90373Pruned());
  const events = await fire(
    pruned,
    {
      WRAITH_GITHUB_TOKEN: "tok",
      WRAITH_LINEAR_KEY: "lin",
      WRAITH_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "WRA-1", url: "https://linear.app/wra-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /WRA-1/);
});

test("53 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90373Pruned().probe, "pruned").some((line) => /#90373/.test(line)));
  assert.ok(reasonsOf(seed86129Orphaned().probe, "orphaned").some((line) => /#86129/.test(line)));
  assert.ok(reasonsOf(seed75355Stale().probe, "stale").some((line) => /#75355/.test(line)));
  assert.ok(reasonsOf(seed70071Severed().probe, "severed").some((line) => /#70071/.test(line)));
});

test("54 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const pruned = decide(seed90373Pruned());
  const slack = slackWraithAlarm(pruned, {});
  const github = githubWraithLedger(pruned, {});
  const linear = linearWraithTicket(pruned, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(pruned, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("55 catalog wiring: 27 products, Wraith featured, Gasket listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 27);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Wraith");
  assert.equal(featured[0].slug, "wraith");
  assert.equal(featured[0].href, "/wraith/");
  assert.match(featured[0].summary, /01:50|wraith|grant that is still ON is not a hold|unlinked/);
  const gasket = catalog.products.find((row) => row.slug === "gasket");
  assert.ok(gasket);
  assert.equal(gasket.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.ok(slugs.includes("damper"));
  assert.ok(slugs.includes("cote"));
  assert.ok(!slugs.includes("livery"));
});

test("56 vercel rewrite order puts /wraith before /gasket and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/wraith");
  assert.equal(sources[1], "/wraith/");
  assert.ok(sources.includes("/gasket"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/wraith") < sources.indexOf("/gasket"));
  assert.ok(sources.indexOf("/wraith/") < sources.indexOf("/:slug"));
  assert.ok(!sources.includes("/livery"));
});

test("57 hours.json prepends the 01:50 Sydney Wraith ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-wraith");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "01:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Wraith");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /unlinked/);
  assert.match(hours[0].note, /Gasket/);
});

test("58 restart action produces ejected", () => {
  const result = decide({ action: "restart", probe: emptyProbe() });
  assert.equal(result.verdict, "ejected");
  assert.equal(result.action, "restart");
  assert.equal(result.restartRestores, true);
});

test("59 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    updaterPrunedRunningVersion: "true",
    imageDeleted: "1",
    grantsStillOn: "false",
  });
  assert.equal(probe.updaterPrunedRunningVersion, true);
  assert.equal(probe.imageDeleted, true);
  assert.equal(probe.grantsStillOn, false);
  assert.equal(classify(probe), "pruned");
});
