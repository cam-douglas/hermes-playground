import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEMO_CURRENT,
  DEMO_DIALOG,
  DEMO_PATH,
  FEATURED_ISSUE,
  IDLE_WORD,
  SAME_CLASS_49282,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  liveriedOf,
  looksBareVersionDialog,
  looksCurrentShim,
  looksVersionedDesktopPath,
  parseTranscript,
  reasonsOf,
  score,
  seed90748,
  seedBareVersion,
  seedCloudMount,
  seedControl,
  seedCurrentShim,
  seedFdaInert,
  seedLiveried,
  seedOvernightBurst,
  seedPathChurn,
  seedPrompted,
  seedReset,
  seedSignedStable,
  seedStrangerPath,
  seedTccOrphan,
  seedVersionFolder,
  verdictOf,
} from "./livery.mjs";
import { handle } from "./index.mjs";

const PRIOR_IDLES =
  /penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|mute|idle|silent|flat|^livery$|^pinfold$|^palimpsest$|^escutcheon$|^slype$|^chatelaine$|^fob$|^visa$|^sigil$|^hasp$|^knock$|^pleat$/;

function assertIdleNeverLivery(result) {
  assert.equal(result.idleWord, "liveried");
  assert.equal(IDLE_WORD, "liveried");
  assert.doesNotMatch(result.idleWord, /livery$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90748 prompted is prompted, never liveried", () => {
  const seed = seedPrompted();
  const result = decide(seed);
  assert.equal(result.verdict, "prompted");
  assert.equal(result.state, "prompted");
  assert.equal(classify(seed.livery), "prompted");
  assert.equal(verdictOf(seed.livery), "prompted");
  assert.notEqual(result.verdict, "liveried");
  assert.equal(result.alarm, true);
  assert.equal(result.prompted, true);
  assert.equal(result.liveried, false);
  assertIdleNeverLivery(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.promptedTriad, true);
  assert.equal(result.facts.versionedDesktop, true);
  assert.equal(result.facts.bareVersion, true);
  assert.match(result.feed, /Prompted|TCC|#90748/i);
  assert.equal(decideSeed("prompted").verdict, "prompted");
  assert.equal(decideSeed("90748").verdict, "prompted");
  assert.equal(decide(seed90748()).verdict, "prompted");
});

test("2 idle/empty/{} is liveried, never the product name, never a prior idle", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "liveried");
  assert.equal(result.alarm, false);
  assert.equal(result.liveried, true);
  assert.equal(classify({}), "liveried");
  assert.equal(classify(emptyProbe()), "liveried");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).liveried, true);
  assertIdleNeverLivery(result);
  assert.equal(decide({ action: "bail" }).verdict, "liveried");
  assert.equal(decide({}).verdict, "liveried");
  assert.equal(decide(seedReset()).verdict, "liveried");
});

test("3 honest liveried hold: current shim, grants persist, no burst", () => {
  const result = decide(seedLiveried());
  assert.equal(result.verdict, "liveried");
  assert.equal(result.alarm, false);
  assert.equal(result.liveried, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.currentShim, true);
  assert.equal(result.facts.promptedTriad, false);
  assert.match(result.feed, /Liveried|grants persist|idle word is liveried/i);
  assert.equal(decideSeed("control").verdict, "liveried");
  assert.equal(decide(seedControl()).liveried, true);
  assert.equal(liveriedOf(seedLiveried().livery), true);
});

test("4 liveried must not be confused with prompted or a named fail", () => {
  const hold = decide(seedLiveried());
  const prompted = decide(seedPrompted());
  const churn = decide(seedPathChurn());
  assert.equal(hold.verdict, "liveried");
  assert.equal(prompted.verdict, "prompted");
  assert.equal(churn.verdict, "path-churn");
  assert.notEqual(hold.verdict, prompted.verdict);
  assert.equal(hold.liveried, true);
  assert.equal(prompted.liveried, false);
});

test("5 parseTranscript scores versioned desktop path + bare dialog + zero TCC as prompted", () => {
  const transcript = [
    DEMO_PATH,
    DEMO_DIALOG,
    "Zero rows in the user TCC database for the new path; previous version's grants still present under its own path.",
    "overnight update",
    "kTCCServiceFileProviderDomain Dropbox iCloud Drive",
    "Identifier=com.anthropic.claude-code TeamIdentifier=Q6L2SF6YDW",
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(looksVersionedDesktopPath(probe.executablePath), true);
  assert.equal(looksBareVersionDialog(probe.dialogText), true);
  const result = score(probe);
  assert.ok(result.verdict === "prompted" || result.verdict === "overnight-burst" || result.verdict === "tcc-orphan");
  assert.equal(result.liveried, false);
  assert.equal(result.alarm, true);
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedPathChurn()).verdict, "path-churn");
  assert.equal(decide(seedBareVersion()).verdict, "bare-version");
  assert.equal(decide(seedTccOrphan()).verdict, "tcc-orphan");
  assert.equal(decide(seedFdaInert()).verdict, "fda-inert");
  assert.equal(decide(seedCloudMount()).verdict, "cloud-mount");
  assert.equal(decide(seedOvernightBurst()).verdict, "overnight-burst");
  assert.equal(decide(seedSignedStable()).verdict, "signed-stable");
  assert.equal(decide(seedSignedStable()).liveried, false);
  assert.equal(decide(seedSignedStable()).alarm, false);
  assert.equal(decide(seedStrangerPath()).verdict, "stranger-path");
  assert.equal(decide(seedVersionFolder()).verdict, "version-folder");
  assert.equal(decide(seedCurrentShim()).verdict, "current-shim");
  assert.equal(decide(seedCurrentShim()).liveried, false);
  assert.equal(decide(seedCurrentShim()).alarm, false);
  assert.match(feedOf("current-shim"), /current|stable path/i);
  assert.match(feedOf("signed-stable"), /Q6L2SF6YDW|signed/i);
});

test("7 admit does not lie: prompted stays prompted; restore shows #90748", () => {
  const admitted = decide({ action: "admit", livery: seedPrompted().livery });
  assert.equal(admitted.verdict, "prompted");
  assert.equal(admitted.liveried, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "prompted");
  assert.equal(restored.facts.promptedTriad, true);
  assert.equal(decide(seedReset()).verdict, "liveried");
  assert.equal(decide({ action: "control" }).verdict, "liveried");
});

test("8 handle deny on prompted, allow on liveried and current-shim", async () => {
  const deny = await handle(seedPrompted());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "prompted");
  const allow = await handle(seedLiveried());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "liveried");
  const shim = await handle(seedCurrentShim());
  assert.equal(shim.permissionDecision, "allow");
  assert.equal(shim.verdict, "current-shim");
});

test("9 verdicts locked; idle never a banned name; fail chips never liveried", () => {
  assert.deepEqual(VERDICTS, [
    "liveried",
    "prompted",
    "path-churn",
    "bare-version",
    "tcc-orphan",
    "fda-inert",
    "cloud-mount",
    "overnight-burst",
    "signed-stable",
    "stranger-path",
    "version-folder",
    "current-shim",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("livery"));
  assert.ok(banned.includes("penned"));
  assert.ok(banned.includes("underwrit"));
  assert.ok(banned.includes("plated"));
  assert.ok(banned.includes("pinfold"));
  assert.ok(banned.includes("palimpsest"));
  assert.ok(banned.includes("pleat"));
  assert.ok(!banned.includes("liveried"));
  assert.ok(ALARM_VERDICTS.includes("prompted"));
  assert.ok(ALARM_VERDICTS.includes("path-churn"));
  assert.ok(!ALARM_VERDICTS.includes("liveried"));
  assert.ok(!ALARM_VERDICTS.includes("current-shim"));
  assert.ok(!ALARM_VERDICTS.includes("signed-stable"));
  for (const seed of [
    seedPrompted(),
    seedPathChurn(),
    seedBareVersion(),
    seedTccOrphan(),
    seedFdaInert(),
    seedCloudMount(),
    seedOvernightBurst(),
    seedSignedStable(),
    seedStrangerPath(),
    seedVersionFolder(),
    seedCurrentShim(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "liveried");
    assert.equal(result.liveried, false);
  }
});

test("10 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Pinfold/i);
  assert.match(readme, /NOT \**Palimpsest/i);
  assert.match(readme, /NOT \**Escutcheon/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /NOT \**Fob/i);
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /liveried/);
  assert.match(readme, /NEVER use liveried for a failure/i);
  assert.match(readme, /#90748/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*liveried\*\*/);
});

test("11 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90748);
  assert.equal(SAME_CLASS_49282, 49282);
  assert.match(reasonsOf(seedPrompted().livery, "prompted").join("\n"), /#90748/);
  assert.equal(analyze(seedPrompted().livery).promptedTriad, true);
  assert.equal(analyze(seedLiveried().livery).honest, true);
  assert.equal(looksCurrentShim(DEMO_CURRENT), true);
});

test("12 JSON probe shape scores path/dialog/TCC/FDA", () => {
  const probe = {
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    tccObservation: "Zero rows for the new path; previous version's grants still present.",
    parentFda: true,
    grantsOnNewPath: 0,
    grantsOnOldPath: 7,
    overnight: true,
    cloudMounts: ["Dropbox"],
    services: ["kTCCServiceFileProviderDomain"],
    launchedFrom: "version-folder",
    version: "2.1.247",
  };
  const result = score(probe);
  assert.equal(result.verdict, "prompted");
  assert.equal(result.liveried, false);
  assert.equal(result.alarm, true);
  assert.ok(Array.isArray(result.reasons));
  assert.ok(result.reasons.length > 0);
});
