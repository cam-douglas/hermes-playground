import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEMO_COMPOSED,
  DEMO_EPERM,
  DEMO_THREAT,
  FEATURED_ISSUE,
  IDLE_WORD,
  SAME_CLASS_65627,
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
  looksEperm,
  looksFileFix,
  looksLongInline,
  parseTranscript,
  pennedOf,
  reasonsOf,
  score,
  seed90706,
  seedBilledRetry,
  seedCmdlineShape,
  seedControl,
  seedEpermBare,
  seedEvents1116,
  seedFilefix,
  seedFlagged,
  seedPenned,
  seedReset,
  seedScriptClears,
  seedToastOnly,
  seedUndiagnosed,
  verdictOf,
} from "./pinfold.mjs";
import { handle } from "./index.mjs";

const PRIOR_IDLES =
  /underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|mute|idle|silent|^pinfold$|^palimpsest$|^escutcheon$|^slype$|^calque$|^gasket$|^fob$|^chatelaine$|^lacuna$|^ambo$/;

function assertIdleNeverPinfold(result) {
  assert.equal(result.idleWord, "penned");
  assert.equal(IDLE_WORD, "penned");
  assert.doesNotMatch(result.idleWord, /pinfold/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90706 flagged is flagged, never penned", () => {
  const seed = seedFlagged();
  const result = decide(seed);
  assert.equal(result.verdict, "flagged");
  assert.equal(result.state, "flagged");
  assert.equal(classify(seed.pinfold), "flagged");
  assert.equal(verdictOf(seed.pinfold), "flagged");
  assert.notEqual(result.verdict, "penned");
  assert.equal(result.alarm, true);
  assert.equal(result.flagged, true);
  assert.equal(result.penned, false);
  assertIdleNeverPinfold(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.flaggedTriad, true);
  assert.equal(result.facts.longInline, true);
  assert.equal(result.facts.fileFix, true);
  assert.equal(result.facts.eperm, true);
  assert.match(result.feed, /Flagged|FileFix|#90706/i);
  assert.equal(decideSeed("flagged").verdict, "flagged");
  assert.equal(decideSeed("90706").verdict, "flagged");
  assert.equal(decide(seed90706()).verdict, "flagged");
});

test("2 idle/empty/{} is penned, never the product name, never a prior idle", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "penned");
  assert.equal(result.alarm, false);
  assert.equal(result.penned, true);
  assert.equal(classify({}), "penned");
  assert.equal(classify(emptyProbe()), "penned");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).penned, true);
  assertIdleNeverPinfold(result);
  assert.equal(decide({ action: "bail" }).verdict, "penned");
  assert.equal(decide({}).verdict, "penned");
  assert.equal(decide(seedReset()).verdict, "penned");
});

test("3 honest penned hold: short command, spawn ok, no FileFix", () => {
  const result = decide(seedPenned());
  assert.equal(result.verdict, "penned");
  assert.equal(result.alarm, false);
  assert.equal(result.penned, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.shortCommand, true);
  assert.equal(result.facts.eperm, false);
  assert.match(result.feed, /Penned|spawn ok|idle word is penned/i);
  assert.equal(decideSeed("control").verdict, "penned");
  assert.equal(decide(seedControl()).penned, true);
  assert.equal(pennedOf(seedPenned().pinfold), true);
});

test("4 penned must not be confused with flagged or a named fail", () => {
  const hold = decide(seedPenned());
  const flagged = decide(seedFlagged());
  const eperm = decide(seedEpermBare());
  assert.equal(hold.verdict, "penned");
  assert.equal(flagged.verdict, "flagged");
  assert.equal(eperm.verdict, "eperm-bare");
  assert.notEqual(hold.verdict, flagged.verdict);
  assert.equal(hold.penned, true);
  assert.equal(flagged.penned, false);
});

test("5 parseTranscript scores long Bypass -Command + FileFix + EPERM as flagged", () => {
  const transcript = [
    DEMO_COMPOSED,
    DEMO_THREAT,
    "resourceType: CmdLine",
    DEMO_EPERM,
    "Defender operational events 1116/1117",
    "DidThreatExecute False",
    "no file quarantined",
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(looksLongInline(probe.composedCommand, probe.bodyKind), true);
  assert.equal(looksFileFix(probe.threatName), true);
  assert.equal(looksEperm(probe.spawnError), true);
  const result = score(probe);
  assert.ok(result.verdict === "flagged" || result.verdict === "eperm-bare");
  assert.equal(result.penned, false);
  assert.equal(result.alarm, true);
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedEpermBare()).verdict, "eperm-bare");
  assert.equal(decide(seedCmdlineShape()).verdict, "cmdline-shape");
  assert.equal(decide(seedFilefix()).verdict, "filefix");
  assert.equal(decide(seedToastOnly()).verdict, "toast-only");
  assert.equal(decide(seedBilledRetry()).verdict, "billed-retry");
  assert.equal(decide(seedScriptClears()).verdict, "script-clears");
  assert.equal(decide(seedScriptClears()).penned, false);
  assert.equal(decide(seedScriptClears()).alarm, false);
  assert.equal(decide(seedEvents1116()).verdict, "events-1116");
  assert.equal(decide(seedUndiagnosed()).verdict, "undiagnosed");
  assert.match(feedOf("script-clears"), /ps1|cmdline shape/i);
  assert.match(feedOf("events-1116"), /1116/);
});

test("7 admit does not lie: flagged stays flagged; restore shows #90706", () => {
  const admitted = decide({ action: "admit", pinfold: seedFlagged().pinfold });
  assert.equal(admitted.verdict, "flagged");
  assert.equal(admitted.penned, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "flagged");
  assert.equal(restored.facts.flaggedTriad, true);
  assert.equal(decide(seedReset()).verdict, "penned");
  assert.equal(decide({ action: "control" }).verdict, "penned");
});

test("8 handle deny on flagged, allow on penned and script-clears", async () => {
  const deny = await handle(seedFlagged());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "flagged");
  const allow = await handle(seedPenned());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "penned");
  const keep = await handle(seedScriptClears());
  assert.equal(keep.permissionDecision, "allow");
  assert.equal(keep.verdict, "script-clears");
});

test("9 verdicts locked; idle never a banned name; fail chips never penned", () => {
  assert.deepEqual(VERDICTS, [
    "penned",
    "flagged",
    "eperm-bare",
    "cmdline-shape",
    "filefix",
    "toast-only",
    "billed-retry",
    "script-clears",
    "events-1116",
    "undiagnosed",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("pinfold"));
  assert.ok(banned.includes("underwrit"));
  assert.ok(banned.includes("plated"));
  assert.ok(banned.includes("palimpsest"));
  assert.ok(banned.includes("slype"));
  assert.ok(banned.includes("escutcheon"));
  assert.ok(!banned.includes("penned"));
  assert.ok(ALARM_VERDICTS.includes("flagged"));
  assert.ok(ALARM_VERDICTS.includes("eperm-bare"));
  assert.ok(!ALARM_VERDICTS.includes("penned"));
  assert.ok(!ALARM_VERDICTS.includes("script-clears"));
  for (const seed of [
    seedFlagged(),
    seedEpermBare(),
    seedCmdlineShape(),
    seedFilefix(),
    seedToastOnly(),
    seedBilledRetry(),
    seedScriptClears(),
    seedEvents1116(),
    seedUndiagnosed(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "penned");
    assert.equal(result.penned, false);
  }
});

test("10 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /NOT \**Escutcheon/i);
  assert.match(readme, /NOT \**Palimpsest/i);
  assert.match(readme, /NOT \**Calque/i);
  assert.match(readme, /NOT \**Gasket/i);
  assert.match(readme, /NOT \**Fob/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /penned/);
  assert.match(readme, /NEVER use penned for a failure/i);
  assert.match(readme, /#90706/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*penned\*\*/);
});

test("11 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90706);
  assert.equal(SAME_CLASS_65627, 65627);
  assert.match(reasonsOf(seedFlagged().pinfold, "flagged").join("\n"), /#90706/);
  assert.equal(analyze(seedFlagged().pinfold).flaggedTriad, true);
  assert.equal(analyze(seedPenned().pinfold).honest, true);
});

test("12 JSON probe shape scores composedCommand/threat/spawn/events", () => {
  const probe = {
    composedCommand: DEMO_COMPOSED,
    threatName: DEMO_THREAT,
    resourceType: "CmdLine",
    spawnError: DEMO_EPERM,
    spawnPath: "C:\\Users\\user\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe",
    events: [1116, 1117],
    didThreatExecute: false,
    fileQuarantined: false,
    invokedAs: "inline-command",
    bodyKind: "byte-patch",
    userSawToast: true,
    modelSawHint: false,
  };
  const result = score(probe);
  assert.equal(result.verdict, "flagged");
  assert.equal(result.penned, false);
  assert.equal(result.alarm, true);
  assert.ok(Array.isArray(result.reasons));
  assert.ok(result.reasons.length > 0);
});
