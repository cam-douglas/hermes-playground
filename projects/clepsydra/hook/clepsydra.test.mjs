import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  analyze,
  classify,
  score,
  scoreFields,
  handle,
  seeds,
  seedDripping,
  seedArrested,
  seedCredited,
  fingerprint,
  signals,
  drippingSignal,
  arrestedSignal,
  creditedSignal,
  partialCreditSignal,
  exporterHealthySignal,
  otherInstrumentsSignal,
  onsetSharpSignal,
  processAgeGuessSignal,
  ruledOutMatrixSignal,
  transcriptGroundTruthSignal,
  cisternCredited,
  spoutWasArrested,
  exporterStillHealthy,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  CISTERN_LEDGER,
  CAPTURE_TABLE,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./clepsydra.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92776 fixture scores arrested", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92776.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "arrested");
  assert.equal(out.arrested, true);
  assert.ok(out.chips.includes("arrested"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is dripping", () => {
  const out = decide({});
  assert.equal(out.verdict, "dripping");
  assert.equal(out.dripping, true);
  assert.equal(out.arrested, false);
  assert.ok(HOLD.has("dripping"));
  assert.equal(IDLE_WORD, "dripping");
});

test("dripping fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "dripping.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "dripping");
  assert.equal(out.dripping, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded arrested scores arrested", () => {
  const out = decide(seedArrested());
  assert.equal(out.verdict, "arrested");
  assert.equal(out.arrested, true);
  assert.ok(out.chips.includes("arrested"));
  assert.ok(out.chips.includes("partial-credit"));
  assert.ok(out.chips.includes("exporter-healthy"));
  assert.ok(ALARM.has(out.verdict));
});

test("credited seed is a hold", () => {
  const out = decide(seedCredited());
  assert.equal(out.verdict, "credited");
  assert.equal(out.credited, true);
  assert.equal(out.arrested, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "arrested");
  assert.equal(ADMIT_WORD, "credited");
});

test("dripping seed is idle hold", () => {
  const out = decide(seedDripping());
  assert.equal(out.verdict, "dripping");
  assert.equal(out.dripping, true);
  assert.ok(HOLD.has("dripping"));
});

test("partial-credit chip", () => {
  const out = decide({ seed: "partial-credit", partialCredit: true });
  assert.equal(out.verdict, "partial-credit");
  assert.equal(out.arrested, true);
  assert.match(out.reasons.join(" "), /50 of 207/);
  assert.match(out.reasons.join(" "), /157 dropped/);
});

test("exporter-healthy chip", () => {
  const out = decide({ seed: "exporter-healthy", exporterHealthy: true });
  assert.equal(out.verdict, "exporter-healthy");
  assert.match(out.reasons.join(" "), /15 samples/);
  assert.match(out.reasons.join(" "), /exporter/);
});

test("other-instruments-advance vs exporter-healthy contrast", () => {
  const other = decide({ seed: "other-instruments-advance", otherInstrumentsAdvance: true });
  const exporter = decide({ seed: "exporter-healthy", exporterHealthy: true });
  assert.equal(other.verdict, "other-instruments-advance");
  assert.equal(exporter.verdict, "exporter-healthy");
  assert.equal(CISTERN_LEDGER.find((c) => c.id === "spout").tally, "tracks then arrests");
  assert.match(CISTERN_LEDGER.find((c) => c.id === "basin").tally, /LOC \+1021/);
});

test("other-instruments-advance chip", () => {
  const out = decide({ seed: "other-instruments-advance", otherInstrumentsAdvance: true });
  assert.equal(out.verdict, "other-instruments-advance");
  assert.match(out.reasons.join(" "), /lines_of_code/);
  assert.match(out.reasons.join(" "), /commit\.count/);
});

test("onset-sharp chip", () => {
  const out = decide({ seed: "onset-sharp", onsetSharp: true });
  assert.equal(out.verdict, "onset-sharp");
  assert.match(out.reasons.join(" "), /request for request/);
  assert.match(out.reasons.join(" "), /one request's worth/);
});

test("process-age-guess chip", () => {
  const out = decide({ seed: "process-age-guess", processAgeGuess: true });
  assert.equal(out.verdict, "process-age-guess");
  assert.match(out.reasons.join(" "), /NON-BINDING/);
  assert.match(out.reasons.join(" "), /process age/);
});

test("ruled-out-matrix chip", () => {
  const out = decide({ seed: "ruled-out-matrix", ruledOutMatrix: true });
  assert.equal(out.verdict, "ruled-out-matrix");
  assert.match(out.reasons.join(" "), /isCompactSummary/);
  assert.match(out.reasons.join(" "), /query-source/);
});

test("transcript-ground-truth chip", () => {
  const out = decide({ seed: "transcript-ground-truth", transcriptGroundTruth: true });
  assert.equal(out.verdict, "transcript-ground-truth");
  assert.match(out.reasons.join(" "), /53dd124d/);
  assert.match(out.reasons.join(" "), /message\.id/);
});

test("cousins cite-only #33904 CLOSED", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /33904/);
  assert.match(out.reasons.join(" "), /92776/);
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[0].id, 33904);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "dripping");
  assert.equal(score(seedCredited()).verdict, "credited");
  assert.equal(handle('{"seed":"arrested","arrested":true}').verdict, "arrested");
  assert.equal(handle({ seed: "credited", credited: true }).verdict, "credited");
  const bag = seeds();
  assert.equal(decide(bag.dripping).verdict, "dripping");
  assert.equal(decide(bag.arrested).verdict, "arrested");
  assert.equal(decide(bag.credited).verdict, "credited");
  assert.equal(scoreFields(seedArrested()).arrested, true);
});

test("fingerprint and signals detect clepsydra facts", () => {
  assert.equal(
    drippingSignal("idle cistern is dripping; pin idle dripping; token and cost drips credited for the whole session"),
    true
  );
  assert.equal(
    arrestedSignal("OTel spout arrested; silently stop recording main-loop; usage is lost"),
    true
  );
  assert.equal(creditedSignal("already credited; every API request's usage recorded"), true);
  assert.equal(partialCreditSignal("partial-credit 50 of 207 157 dropped"), true);
  assert.equal(exporterHealthySignal("exporter-healthy 15 samples"), true);
  assert.equal(otherInstrumentsSignal("other-instruments-advance lines_of_code.count"), true);
  assert.equal(onsetSharpSignal("onset-sharp tracks the transcript request for request"), true);
  assert.equal(processAgeGuessSignal("process-age-guess process age or cumulative turn"), true);
  assert.equal(ruledOutMatrixSignal("ruled-out-matrix isCompactSummary pmset -g log"), true);
  assert.equal(transcriptGroundTruthSignal("transcript-ground-truth 53dd124d message.usage"), true);
  const hits = signals(seedArrested());
  assert.equal(hits.arrested || hits.partialCredit || hits.exporterHealthy, true);
  const print = fingerprint(seedArrested());
  assert.equal(print.arrestedHit, true);
  assert.equal(print.spoutArrested, true);
});

test("fingerprint scores credited cistern path", () => {
  const print = fingerprint(seedCredited());
  assert.equal(print.creditedClean, true);
  assert.equal(print.arrestedHit, false);
  const out = decide({ ...seedCredited(), seed: "credited" });
  assert.equal(out.credited, true);
  assert.equal(out.verdict, "credited");
  assert.equal(cisternCredited(seedCredited()), true);
  assert.equal(cisternCredited(seedArrested()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedArrested());
  assert.equal(alarm.arrested, true);
  const hold = classify(seedCredited());
  assert.equal(hold.credited, true);
  const idle = classify(seedDripping());
  assert.equal(idle.dripping, true);
});

test("helpers encode spout arrest + exporter health", () => {
  assert.equal(spoutWasArrested(seedArrested()), true);
  assert.equal(exporterStillHealthy(seedArrested()), true);
  assert.equal(spoutWasArrested(seedDripping()), false);
  assert.equal(spoutWasArrested({ arrested: true }), true);
  assert.equal(exporterStillHealthy({ exporterHealthy: true }), true);
});

test("cistern ledger encodes the issue split", () => {
  assert.ok(CISTERN_LEDGER.some((row) => row.id === "spout" && /token\.usage/i.test(row.role)));
  assert.ok(CISTERN_LEDGER.some((row) => row.id === "basin" && /LOC/i.test(row.tally)));
  assert.ok(CISTERN_LEDGER.some((row) => row.id === "credited" && /whole session/i.test(row.note)));
  assert.ok(CISTERN_LEDGER.length === 3);
  assert.equal(CAPTURE_TABLE.length, 3);
  assert.equal(CAPTURE_TABLE[0].captured, "25%");
  assert.equal(CAPTURE_TABLE[1].captured, "100%");
  assert.equal(CAPTURE_TABLE[2].captured, "0%");
});

test("measured facts from #92776", () => {
  assert.equal(MEASURED.issue, 92776);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:core",
    "platform:aws-bedrock"
  ]);
  assert.equal(MEASURED.filed, "2026-09-08T04:33:31Z");
  assert.match(MEASURED.claude, /2\.1\.263/);
  assert.match(MEASURED.claude, /37ae3f38d765199d54a6913cd61c6c9ad8576cc6/);
  assert.equal(MEASURED.os, "macOS");
  assert.equal(MEASURED.terminal, "iTerm2");
  assert.equal(MEASURED.platform, "AWS Bedrock");
  assert.equal(MEASURED.model, "Opus");
  assert.equal(MEASURED.session, "53dd124d");
  assert.equal(MEASURED.activeTimePinned, 197.968);
  assert.equal(MEASURED.exporterSamplesPer15m, 15);
  assert.equal(MEASURED.creditedInFull, 50);
  assert.equal(MEASURED.droppedEntirely, 157);
  assert.equal(MEASURED.cost8Sep.recorded, 2.62);
  assert.equal(MEASURED.cost8Sep.incurred, 25.98);
  assert.equal(IDLE_WORD, "dripping");
  assert.equal(SEEDED_WORD, "arrested");
  assert.equal(ADMIT_WORD, "credited");
});

test("HOLD is dripping/credited; ALARM is arrested family", () => {
  assert.ok(HOLD.has("dripping"));
  assert.ok(HOLD.has("credited"));
  assert.equal(ALARM.has("dripping"), false);
  assert.equal(ALARM.has("credited"), false);
  for (const chip of [
    "arrested",
    "partial-credit",
    "exporter-healthy",
    "other-instruments-advance",
    "onset-sharp",
    "process-age-guess",
    "ruled-out-matrix",
    "transcript-ground-truth",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "dripping",
    "arrested",
    "credited",
    "partial-credit",
    "exporter-healthy",
    "other-instruments-advance",
    "onset-sharp",
    "process-age-guess",
    "ruled-out-matrix",
    "transcript-ground-truth",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites #33904 CLOSED only", () => {
  assert.equal(COUSINS.length, 1);
  assert.ok(COUSINS.some((c) => c.id === 33904 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "dripping.json",
    "arrested.json",
    "credited.json",
    "92776.json",
    "partial-credit.json",
    "exporter-healthy.json",
    "other-instruments-advance.json",
    "onset-sharp.json",
    "process-age-guess.json",
    "ruled-out-matrix.json",
    "transcript-ground-truth.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92776|clepsydra|dripping|arrested|credited/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "dripping");
  assert.equal(index.narrativeNotFixture.seeded, "arrested");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:core"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:macos"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a marble cistern water-clock, not a clone", () => {
  assert.match(page, /EB Garamond/);
  assert.match(page, /Barlow/);
  assert.match(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.match(page, /arrested/);
  assert.match(page, /credited/);
  assert.match(page, /\bdripping\b/);
  assert.match(page, /#92776/);
  assert.match(page, /Clepsydra/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /14:50 \/ hermes catalog #220 \/ #92776/);
  assert.match(page, /Score arrested/);
  assert.match(page, /Admit credited/);
  assert.match(page, /Pin idle dripping/);
  assert.match(page, /Reset to dripping/);
  assert.match(page, /token\.usage/);
  assert.match(page, /cost\.usage/);
  assert.match(page, /active_time\.total/);
  assert.match(page, /53dd124d/);
  assert.match(page, /marble/);
  assert.match(page, /clepsydra/i);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /PTY BIND/);
  assert.doesNotMatch(page, /ivory-and-ebony/i);
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /dark hold timber/i);
  assert.doesNotMatch(page, /letterpress set-off/i);
  assert.doesNotMatch(page, /dampened tympan/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /casement-fastener/i);
  assert.doesNotMatch(page, /censor's imprimatur/i);
  assert.doesNotMatch(page, /nihil-obstat/i);
  assert.doesNotMatch(page, /herald's byname/i);
  assert.doesNotMatch(page, /mason's battlement/i);
  assert.doesNotMatch(page, /piano cream/i);
  assert.doesNotMatch(page, /CRT phosphor/i);
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
  assert.doesNotMatch(page, /\bchorded\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bmeshed\b/);
  assert.doesNotMatch(page, /\bpiped\b/);
  assert.doesNotMatch(page, /\bswallowed\b/);
  assert.doesNotMatch(page, /\bunbound\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bwaived\b/);
  assert.doesNotMatch(page, /\bbricked\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\bladen\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\brefused\b/);
  assert.doesNotMatch(page, /\bimprinted\b/);
  assert.doesNotMatch(page, /\bcorked\b/);
  assert.doesNotMatch(page, /\blatent\b/);
  assert.doesNotMatch(page, /\bsilted\b/);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bquieted\b/);
  assert.doesNotMatch(page, /\bcribbed\b/);
  assert.doesNotMatch(page, /\bsprung\b/);
  assert.doesNotMatch(page, /\bremoored\b/);
  assert.doesNotMatch(page, /\baddressed\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brelayed\b/);
  assert.doesNotMatch(page, /\bflushed\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\bambered\b/);
  assert.doesNotMatch(page, /\bbynamed\b/);
  assert.doesNotMatch(page, /\bcrenelled\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bsole\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bporous\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsevered\b/);
  assert.doesNotMatch(page, /\bmisrouted\b/);
  assert.doesNotMatch(page, /\badrift\b/);
});

test("README anti-clone encodes the clepsydra thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /token\.usage/);
  assert.match(readme, /cost\.usage/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/clepsydra\//);
  assert.match(readme, /Score arrested or admit credited/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /NOT Ptybind/);
  assert.match(readme, /NOT Dunnage/);
  assert.match(readme, /NOT Setoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(hookReadme, /dripping/);
  assert.match(hookReadme, /arrested/);
  assert.match(hookReadme, /credited/);
  assert.match(dataReadme, /dripping/);
  assert.match(dataReadme, /arrested/);
  assert.match(dataReadme, /credited/);
});
