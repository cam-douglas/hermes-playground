import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubLacunaLedger,
  linearLacunaTicket,
  slackLacunaAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CLUSTER_76493,
  CLUSTER_76844,
  CLUSTER_78147,
  CLUSTER_80871,
  CODEX_CHATS,
  CODEX_INDEX,
  CODEX_USAGE,
  CONTRAST_84284,
  DEMO_HWM,
  DEMO_NEXT_ID,
  DEMO_SURVIVING,
  DEMO_TASKLIST_EMPTY,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SAME_CLASS_88346,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneProbe,
  collatedOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  fingerprintDir,
  forbiddenIdleWords,
  isIdle,
  isOffLacuna,
  parseLacunaJson,
  probeFromDir,
  reasonsOf,
  score,
  scoreDir,
  seed90709,
  seedCodex32697,
  seedCollated,
  seedContrast84284,
  seedControl,
  seedCounterfeitEmpty,
  seedDelayedWipe,
  seedGapped,
  seedIntact,
  seedReset,
  seedResumedPast,
  seedScraped,
  seedSkipped,
  seedVanished,
  seedWatermarked,
  verdictOf,
} from "./lacuna.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|^nested$|^cut$|^switched$|^spilled$|^true$|^home$|^gripped$|^swung$|^lacuna$|^palimpsest$|^quoin$|^ambo$|^pulpit$|^lectern$|^nave$|^slype$|^tally$|^pale$|^chatelaine$|^byline$|^cubby$|^ullage$|^veto$|^husk$/;

function assertIdleNeverLacuna(result) {
  assert.equal(result.idleWord, "collated");
  assert.equal(IDLE_WORD, "collated");
  assert.doesNotMatch(result.idleWord, /lacuna/i);
  assert.doesNotMatch(IDLE_WORD, /^lacuna$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.collated, "boolean");
  assert.equal(typeof result.feed, "string");
}

function fakeStore({ ids = [], highwatermark = null } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "lacuna-"));
  for (const id of ids) {
    writeFileSync(join(dir, `${id}.json`), JSON.stringify({ id, subject: `task ${id}` }));
  }
  if (highwatermark != null) {
    writeFileSync(join(dir, ".highwatermark"), String(highwatermark));
  }
  writeFileSync(join(dir, ".lock"), "");
  return dir;
}

test("1 seed 90709 scraped is scraped, slack, linear, idleWord collated, never collated", () => {
  const seed = seedScraped();
  const result = decide(seed);
  assert.equal(result.verdict, "scraped");
  assert.equal(result.state, "scraped");
  assert.equal(result.decision, "scraped");
  assert.equal(classify(seed.lacuna), "scraped");
  assert.equal(verdictOf(seed.lacuna), "scraped");
  assert.notEqual(result.verdict, "collated");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.scraped, true);
  assert.equal(result.collated, false);
  assertIdleNeverLacuna(result);
  assert.equal(result.session, "90709-scraped");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.deepEqual(result.facts.files, []);
  assert.equal(result.facts.highwatermark, DEMO_HWM);
  assert.equal(result.facts.taskList, DEMO_TASKLIST_EMPTY);
  assert.equal(result.facts.nextCreateId, DEMO_NEXT_ID);
  assert.equal(result.facts.triad, true);
  assert.match(result.feed, /Scraped|unlinked|primary #90709/i);
  assert.match(result.slackCopy, /Lacuna scraped/);
  assert.equal(decideSeed("scraped").verdict, "scraped");
  assert.equal(decideSeed("90709").verdict, "scraped");
  assert.equal(decideSeed(90709).verdict, "scraped");
  assert.equal(decide(seed90709()).verdict, "scraped");
});

test("2 idle/empty/{} is collated, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "collated");
  assert.equal(result.verdict, "collated");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.collated, true);
  assert.equal(classify({}), "collated");
  assert.equal(classify(emptyProbe()), "collated");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).collated, true);
  assertIdleNeverLacuna(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "collated");
  assert.equal(bailed.idleWord, "collated");
  const empty = decide({});
  assert.equal(empty.verdict, "collated");
  assert.match(empty.feed, /Collated/);
});

test("3 honest collated hold: store complete, TaskList truthful, no orphan watermark", () => {
  const result = decide(seedCollated());
  assert.equal(result.verdict, "collated");
  assert.equal(result.alarm, false);
  assert.equal(result.collated, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.highwatermark, null);
  assert.equal(result.facts.files[0], 1);
  assert.equal(result.facts.honest, true);
  assert.match(result.feed, /Collated|store complete|idle word is collated/i);
  assert.equal(decideSeed("control").verdict, "collated");
  assert.equal(decideSeed("healthy").verdict, "collated");
  assert.equal(decide(seedControl()).collated, true);
  assert.equal(collatedOf(seedCollated().lacuna), true);
});

test("4 collated must not be confused with scraped, gapped, or contrast", () => {
  const hold = decide(seedCollated());
  const denied = decide(seedScraped());
  const gapped = decide(seedGapped());
  const contrast = decide(seedContrast84284());
  assert.equal(hold.verdict, "collated");
  assert.equal(denied.verdict, "scraped");
  assert.equal(gapped.verdict, "gapped");
  assert.equal(contrast.verdict, "counterfeit-empty");
  assert.notEqual(hold.verdict, denied.verdict);
  assert.notEqual(hold.verdict, gapped.verdict);
  assert.equal(hold.collated, true);
  assert.equal(denied.collated, false);
  assert.equal(gapped.collated, false);
  assert.equal(contrast.collated, false);
  assert.equal(contrast.alarm, false);
});

test("5 fake task dir: scraped vs collated vs gapped vs counterfeit-empty", () => {
  const scrapedDir = fakeStore({ ids: [], highwatermark: 22 });
  const collatedDir = fakeStore({ ids: [1, 2, 3, 4, 5], highwatermark: null });
  const gappedDir = fakeStore({ ids: [23, 24, 25, 26, 27, 28, 29, 30, 31], highwatermark: 22 });
  const emptyWipeDir = fakeStore({ ids: [], highwatermark: 22 });
  try {
    const scrapedPrint = fingerprintDir(scrapedDir);
    assert.deepEqual(scrapedPrint.files, []);
    assert.equal(scrapedPrint.highwatermark, 22);
    assert.equal(scrapedPrint.hasOne, false);
    const scraped = scoreDir(scrapedDir, {
      taskList: DEMO_TASKLIST_EMPTY,
      deleteEvent: false,
    });
    assert.equal(scraped.verdict, "scraped");
    assert.equal(scraped.collated, false);
    assert.equal(scraped.facts.triad, true);

    const collatedPrint = fingerprintDir(collatedDir);
    assert.deepEqual(collatedPrint.files, [1, 2, 3, 4, 5]);
    assert.equal(collatedPrint.highwatermark, null);
    assert.equal(collatedPrint.hasOne, true);
    const collated = scoreDir(collatedDir, {
      taskList: "1..5 present",
      deleteEvent: false,
    });
    assert.equal(collated.verdict, "collated");
    assert.equal(collated.collated, true);
    assert.equal(collated.facts.honest, true);

    const gappedPrint = fingerprintDir(gappedDir);
    assert.equal(gappedPrint.lowestSurviving, 23);
    assert.equal(gappedPrint.highwatermark, 22);
    const gapped = scoreDir(gappedDir, { deleteEvent: false });
    assert.equal(gapped.verdict, "gapped");
    assert.equal(gapped.facts.gappedShape, true);
    assert.equal(gapped.facts.lowestSurviving, 23);

    const counterfeit = scoreDir(emptyWipeDir, {
      taskList: DEMO_TASKLIST_EMPTY,
      nearbyCounterfeitEmpty: true,
      deleteEvent: false,
    });
    assert.equal(counterfeit.verdict, "counterfeit-empty");
    assert.equal(counterfeit["counterfeit-empty"], true);
    assert.notEqual(counterfeit.verdict, "collated");
  } finally {
    rmSync(scrapedDir, { recursive: true, force: true });
    rmSync(collatedDir, { recursive: true, force: true });
    rmSync(gappedDir, { recursive: true, force: true });
    rmSync(emptyWipeDir, { recursive: true, force: true });
  }
});

test("6 gapped / watermarked / resumed-past / vanished nearby flags win their own seeds", () => {
  const gapped = decide(seedGapped());
  assert.equal(gapped.verdict, "gapped");
  assert.equal(gapped.gapped, true);
  assert.equal(gapped.collated, false);
  assert.equal(gapped.alarm, true);
  assert.deepEqual(gapped.facts.files, DEMO_SURVIVING.slice());
  assert.equal(analyze(seedGapped().lacuna).triad, false);
  assert.match(gapped.feed, /Gapped|highwatermark\+1/i);

  const mark = decide(seedWatermarked());
  assert.equal(mark.verdict, "watermarked");
  assert.equal(mark.watermarked, true);
  assert.equal(mark.facts.nearbyWatermarked, true);
  assert.match(mark.feed, /Watermarked|fingerprint of the wipe/i);

  const resume = decide(seedResumedPast());
  assert.equal(resume.verdict, "resumed-past");
  assert.equal(resume["resumed-past"], true);
  assert.equal(resume.facts.nextCreateId, DEMO_NEXT_ID);
  assert.match(resume.feed, /Resumed-past|highwatermark \+ 1/i);

  const gone = decide(seedVanished());
  assert.equal(gone.verdict, "vanished");
  assert.equal(gone.vanished, true);
  assert.match(gone.feed, /Vanished|no delete event/i);
});

test("7 intact / counterfeit-empty / skipped / delayed-wipe nearby flags win", () => {
  const intact = decide(seedIntact());
  assert.equal(intact.verdict, "intact");
  assert.equal(intact.intact, true);
  assert.equal(intact.collated, false);
  assert.equal(intact.alarm, false);
  assert.equal(intact.facts.files.includes(1), true);
  assert.equal(intact.facts.highwatermark, null);
  assert.match(intact.feed, /Intact|1\.json|not the idle admit/i);

  const empty = decide(seedCounterfeitEmpty());
  assert.equal(empty.verdict, "counterfeit-empty");
  assert.equal(empty["counterfeit-empty"], true);
  assert.equal(empty.collated, false);
  assert.equal(empty.alarm, true);
  assert.match(empty.feed, /Counterfeit-empty|never-created/i);

  const skip = decide(seedSkipped());
  assert.equal(skip.verdict, "skipped");
  assert.equal(skip.skipped, true);
  assert.match(skip.feed, /Skipped|jump the lacuna/i);

  const delayed = decide(seedDelayedWipe());
  assert.equal(delayed.verdict, "delayed-wipe");
  assert.equal(delayed["delayed-wipe"], true);
  assert.equal(delayed.issue, SAME_CLASS_88346);
  assert.equal(delayed.facts.wipeDelayMs, 5100);
  assert.match(delayed.feed, /Delayed-wipe|#88346/i);
});

test("8 contrast #84284 is labeled counterfeit-empty, not scraped; Codex is vanished", () => {
  const contrast = decide(seedContrast84284());
  assert.equal(contrast.verdict, "counterfeit-empty");
  assert.equal(contrast.alarm, false);
  assert.equal(contrast.issue, CONTRAST_84284);
  assert.equal(isOffLacuna(seedContrast84284().lacuna), true);
  assert.equal(analyze(seedContrast84284().lacuna).triad, false);
  assert.equal(contrast.facts.addressableById, true);
  assert.equal(decideSeed("84284").verdict, "counterfeit-empty");
  assert.equal(decideSeed("contrast").verdict, "counterfeit-empty");

  const codex = decide(seedCodex32697());
  assert.equal(codex.verdict, "vanished");
  assert.equal(codex.alarm, false);
  assert.equal(codex.issue, CODEX_INDEX);
  assert.equal(decideSeed("32697").verdict, "vanished");
});

test("9 admit does not lie: scraped stays scraped; restore shows #90709", () => {
  const admitted = decide({ action: "admit", lacuna: seedScraped().lacuna });
  assert.equal(admitted.verdict, "scraped");
  assert.equal(admitted.collated, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "scraped");
  assert.equal(restored.facts.triad, true);
  const reset = decide(seedReset());
  assert.equal(reset.verdict, "collated");
  const control = decide({ action: "control" });
  assert.equal(control.verdict, "collated");
});

test("10 slack + linear fire on alarm verdicts; github ledger on every score", () => {
  for (const kind of SLACK_VERDICTS) {
    assert.ok(ALARM_VERDICTS.includes(kind));
    assert.ok(LINEAR_VERDICTS.includes(kind));
  }
  const denied = decide(seedScraped());
  const slack = slackLacunaAlarm(denied, {});
  assert.match(slack.summary, /Would post to Slack/);
  const linear = linearLacunaTicket(denied, {});
  assert.match(linear.summary, /Would open a Linear ticket/);
  const github = githubLacunaLedger(denied, {});
  assert.match(github.summary, /Would append a GitHub lacuna-ledger/);
  const hold = decide(seedCollated());
  assert.match(slackLacunaAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearLacunaTicket(hold, {}).summary, /Would skip Linear/);
});

test("11 fire() demo sinks without secrets", async () => {
  const result = decide(seedScraped());
  const out = await fire(result, {});
  assert.equal(out.events.length, 3);
  assert.equal(out.events[0].adapter, "slack");
  assert.equal(out.events[1].adapter, "github");
  assert.equal(out.events[2].adapter, "linear");
  assert.ok(out.events.every((row) => row.mode === "demo"));
});

test("12 handle deny on scraped, allow on collated", async () => {
  const deny = await handle(seedScraped());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "scraped");
  assert.ok(Array.isArray(deny.sinks));
  const allow = await handle(seedCollated());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "collated");
});

test("13 verdicts locked; idle never a banned name", () => {
  assert.deepEqual(VERDICTS, [
    "collated",
    "scraped",
    "gapped",
    "watermarked",
    "resumed-past",
    "vanished",
    "intact",
    "counterfeit-empty",
    "skipped",
    "delayed-wipe",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("lacuna"));
  assert.ok(banned.includes("palimpsest"));
  assert.ok(banned.includes("quoin"));
  assert.ok(banned.includes("ambo"));
  assert.ok(banned.includes("unheard"));
  assert.ok(banned.includes("slype"));
  assert.ok(banned.includes("tally"));
  assert.ok(banned.includes("pale"));
  assert.ok(banned.includes("chatelaine"));
  assert.ok(!banned.includes("collated"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("14 parseLacunaJson + cloneProbe + reasons + feed + probeFromDir shapes", () => {
  const parsed = parseLacunaJson({
    files: [],
    highwatermark: 22,
    taskList: DEMO_TASKLIST_EMPTY,
  });
  assert.equal(parsed.highwatermark, 22);
  assert.equal(parsed.taskList, DEMO_TASKLIST_EMPTY);
  const cloned = cloneProbe({ lacuna: { highwatermark: 4 } });
  assert.equal(cloned.highwatermark, 4);
  const reasons = reasonsOf(seedScraped().lacuna, "scraped");
  assert.ok(reasons.some((row) => /#90709/.test(row)));
  assert.match(feedOf("collated"), /Collated/);
  assertScoreShape(score(seedScraped().lacuna));
  const dir = fakeStore({ ids: [1], highwatermark: null });
  try {
    const probe = probeFromDir(dir, { taskList: "1 present" });
    assert.deepEqual(probe.files, [1]);
    assert.equal(probe.highwatermark, null);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("15 contrast constants and nearby priors exist as citations, not clones", () => {
  assert.equal(CONTRAST_84284, 84284);
  assert.equal(SAME_CLASS_88346, 88346);
  assert.equal(CLUSTER_78147, 78147);
  assert.equal(CLUSTER_76844, 76844);
  assert.equal(CLUSTER_80871, 80871);
  assert.equal(CLUSTER_76493, 76493);
  assert.equal(CODEX_INDEX, 32697);
  assert.equal(CODEX_CHATS, 40674);
  assert.equal(CODEX_USAGE, 35784);
  assert.equal(FEATURED_ISSUE, 90709);
});

test("16 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Ambo/i);
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /NOT \**Tally/i);
  assert.match(readme, /NOT \**Pale/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /NOT \**Byline/i);
  assert.match(readme, /NOT \**Cubby/i);
  assert.match(readme, /NOT \**Veto/i);
  assert.match(readme, /#84284/);
  assert.match(readme, /collated/);
  assert.match(readme, /NEVER use collated for a failure/i);
  assert.match(readme, /#90709/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*collated\*\*/);
});

test("17 listen health + handle contrast is allow (labeled, not alarm)", async () => {
  const contrast = await handle(seedContrast84284());
  assert.equal(contrast.verdict, "counterfeit-empty");
  assert.equal(contrast.permissionDecision, "allow");
  const server = listen(0);
  await new Promise((resolve) => server.close(resolve));
});

test("18 fail chips never use the idle word", () => {
  const fails = [
    seedScraped(),
    seedGapped(),
    seedWatermarked(),
    seedResumedPast(),
    seedVanished(),
    seedCounterfeitEmpty(),
    seedSkipped(),
    seedDelayedWipe(),
  ];
  for (const seed of fails) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "collated");
    assert.equal(result.collated, false);
    assert.doesNotMatch(result.verdict, /collated/i);
  }
});
