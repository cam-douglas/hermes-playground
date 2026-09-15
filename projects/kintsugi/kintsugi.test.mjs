import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DISTRIBUTION,
  EVIDENCE_ROWS,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  MARKETPLACE_A,
  MARKETPLACE_B,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_KINTSUGI_PROOF,
  SEEDED_WORD,
  STATE,
  KINTSUGI_WALK,
  SURFACE,
  TITLE,
  TREAT_AS_EMPTY_LINE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectLastUpdatedMissing,
  inspectMarketplaceCli,
  inspectParseError,
  inspectPluginListLie,
  inspectRewriteAbort,
  inspectTreatAsEmpty,
  mapKintsugi,
  observeHealAbort,
  readBooth,
  repairKnownMarketplaces,
  rewriteAbortWrite,
  score,
  scoreGate,
  scoreHealAbort,
  scoreWalk,
  seedFused,
  seedGilded,
  seedHealAbort,
  seedHealed,
  seedKintsugi,
  seedLastUpdatedMissing,
  seedMended,
  seedParseError,
  seedProduct,
  seedTreatAsEmpty,
  treatAsEmptyFile,
} from "./kintsugi.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./kintsugi.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "00:50 kintsugi: an urushi lacquer / gold seam / broken ceramic / kiln / repair-bench booth for #94451. known_marketplaces.json is never repaired once invalid: one entry missing lastUpdated (or a parse error) disables plugins from every marketplace; the reconciler, marketplace add and marketplace remove all fail re-reading it. Idle mended / seeded kintsugi / path heal-abort. Score kintsugi or admit mended.";

test("idle mended is a hold; quarantine+rebuild or per-entry validate", () => {
  const result = analyze(seedMended());
  assert.equal(result.verdict, "mended");
  assert.equal(result.idleWord, "mended");
  assert.equal(IDLE_WORD, "mended");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mended, true);
  assert.equal(result.phrase, "admit mended");
  assert.equal(result.kintsugi, false);
  assert.equal(result.healAbort, false);
  assert.ok(HOLD_ALIASES.includes("healed"));
  assert.ok(HOLD_ALIASES.includes("gilded"));
  assert.ok(HOLD_ALIASES.includes("fused"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "lasting");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "repointed");
  assert.notEqual(IDLE_WORD, "relocated");
  assert.notEqual(IDLE_WORD, "settled");
});

test("empty ticket and empty stdin classify mended", () => {
  assert.equal(classify(emptyTicket()), "mended");
  assert.equal(classify(""), "mended");
  assert.equal(classify(null), "mended");
  assert.equal(decide({}), "mended");
});

test("#94451 seeded path scores kintsugi when the gold never sets", () => {
  const result = analyze(seedKintsugi());
  assert.equal(result.verdict, "kintsugi");
  assert.equal(result.seededWord, "kintsugi");
  assert.equal(SEEDED_WORD, "kintsugi");
  assert.equal(PRODUCT_WORD, "kintsugi");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.kintsugi, true);
  assert.equal(result.phrase, "score kintsugi");
  assert.equal(result.healAbort, true);
  assert.equal(result.treatAsEmpty, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "cenotaph");
  assert.notEqual(SEEDED_WORD, "stratum");
  assert.notEqual(SEEDED_WORD, "tmesis");
  assert.notEqual(PATH_WORD, "dead-install");
  assert.notEqual(PATH_WORD, "layer-unsealed");
  assert.notEqual(PATH_WORD, "mid-inject");
});

test("educational heal-abort helpers encode published mended vs unrepaired paths", () => {
  assert.equal(CODE_BUILD, "2.1.272");
  assert.equal(MARKETPLACE_A, "mkt-a");
  assert.equal(MARKETPLACE_B, "mkt-b");
  const wet = observeHealAbort({ fileInvalid: true });
  assert.equal(wet.fileInvalid, true);
  const shut = observeHealAbort({ mended: true });
  assert.equal(shut.repaired, true);
  const stuck = repairKnownMarketplaces({ invalid: true });
  assert.equal(stuck.repaired, false);
  const moved = repairKnownMarketplaces({ mended: true });
  assert.equal(moved.repaired, true);
  const empty = treatAsEmptyFile({});
  assert.equal(empty.rebuildLands, false);
  const held = treatAsEmptyFile({ mended: true });
  assert.equal(held.rebuildLands, true);
  const fail = rewriteAbortWrite({});
  assert.equal(fail.abort, true);
  const ok = rewriteAbortWrite({ mended: true });
  assert.equal(ok.abort, false);
  const lie = inspectPluginListLie({});
  assert.equal(lie.lie, true);
  const honest = inspectPluginListLie({ mended: true });
  assert.equal(honest.lie, false);
  const scored = scoreHealAbort({
    kintsugi: true,
    healAbort: true,
    treatAsEmpty: true,
  });
  assert.equal(scored.kintsugi, true);
  assert.equal(scored.healAbort, true);
  const intactPath = scoreHealAbort({ mended: true });
  assert.equal(intactPath.kintsugi, false);
  assert.equal(intactPath.mended, true);
});

test("inspectors mark lastUpdated-missing and treat-as-empty", () => {
  const missing = inspectLastUpdatedMissing({ kintsugi: true, lastUpdatedMissing: true });
  assert.equal(missing.stamp, "lastUpdated-missing");
  assert.equal(missing.flagged, true);
  const empty = inspectTreatAsEmpty({ kintsugi: true, treatAsEmpty: true });
  assert.equal(empty.stamp, "treat-as-empty");
  assert.equal(empty.flagged, true);
  const scored = scoreGate({
    kintsugi: true,
    healAbort: true,
    treatAsEmpty: true,
    cue: "kintsugi",
  });
  assert.equal(scored.verdict, "kintsugi");
  const open = inspectLastUpdatedMissing({ mended: true, kintsugi: false });
  assert.equal(open.stamp, "healed");
});

test("path word is heal-abort; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "heal-abort");
  const result = analyze(seedHealAbort());
  assert.equal(result.verdict, "heal-abort");
  assert.equal(result.pathWord, "heal-abort");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "heal-abort",
      preferSeed: true,
      kintsugi: true,
    }),
    "heal-abort",
  );
  assert.equal(classify({ seed: "lastUpdated-missing", preferSeed: true }), "lastUpdated-missing");
  assert.equal(score(seedHealAbort()), "kintsugi");
});

test("HOLD includes mended; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("mended"));
  const healed = analyze(seedHealed());
  assert.equal(healed.verdict, "healed");
  assert.equal(classify({ seed: "gilded", preferSeed: true }), "gilded");
  assert.equal(classify({ seed: "fused", preferSeed: true }), "fused");
});

test("alarm chips: lastUpdated-missing, treat-as-empty, kintsugi", () => {
  assert.equal(classify({ seed: "lastUpdated-missing", preferSeed: true }), "lastUpdated-missing");
  assert.equal(classify(seedHealAbort()), "heal-abort");
  assert.equal(classify(seedProduct()), "kintsugi");
  assert.equal(classify(seedTreatAsEmpty()), "treat-as-empty");
  assert.equal(classify({ seed: "rewrite-abort", preferSeed: true }), "rewrite-abort");
});

test("booth fixtures flip mended vs kintsugi vs heal-abort", () => {
  const idle = scoreGate(seedMended());
  const seeded = scoreGate(seedKintsugi());
  const mended = readData("mended.json");
  const kintsugi = readData("kintsugi.json");
  const issued = readData("94451.json");
  const path = readData("heal-abort.json");
  assert.equal(idle.verdict, "mended");
  assert.equal(seeded.verdict, "kintsugi");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedMended()), "mended");
  assert.equal(score(seedKintsugi()), "kintsugi");
  assert.equal(score({ seed: "heal-abort", preferSeed: true }), "kintsugi");
  assert.equal(mended.healAbort, false);
  assert.equal(mended.mended, true);
  assert.equal(scoreGate(mended).verdict, "mended");
  assert.equal(kintsugi.healAbort, true);
  assert.equal(kintsugi.treatAsEmpty, true);
  assert.equal(classify(kintsugi), "kintsugi");
  assert.equal(issued.issue, 94451);
  assert.equal(classify(issued), "kintsugi");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /mended|healed|gilded|fused/i);
  assert.match(path.paths[1].result, /heal-abort|treat-as-empty|lastUpdated-missing|rewrite-abort|plugin-list-lie/i);
  assert.equal(classify(path), "heal-abort");
  assert.equal(kintsugi.hubCount, "KINTSUGI");
  assert.equal(kintsugi.issue, 94451);
  assert.equal(kintsugi.kintsugi, true);
  assert.equal(classify(readData("healed.json")), "healed");
  assert.equal(classify(readData("gilded.json")), "gilded");
  assert.equal(classify(readData("fused.json")), "fused");
  assert.equal(classify(readData("lastUpdated-missing.json")), "lastUpdated-missing");
  assert.equal(classify(readData("rewrite-abort.json")), "rewrite-abort");
  assert.equal(classify(readData("treat-as-empty.json")), "treat-as-empty");
  assert.equal(classify(readData("parse-error.json")), "parse-error");
  assert.equal(classify(readData("marketplace-remove.json")), "marketplace-remove");
  assert.equal(classify(readData("marketplace-add.json")), "marketplace-add");
  assert.equal(classify(readData("plugin-list-lie.json")), "plugin-list-lie");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [84501, 19065, 56967, 94516, 94452]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("kiln.json")), "treat-as-empty");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("mended"));
  assert.ok(CHIPS.includes("kintsugi"));
  assert.ok(CHIPS.includes("heal-abort"));
  assert.ok(CHIPS.includes("lastUpdated-missing"));
  assert.ok(CHIPS.includes("treat-as-empty"));
  assert.ok(CHIPS.includes("rewrite-abort"));
  assert.ok(CHIPS.includes("fused"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("kintsugi"));
  assert.ok(ALARM.includes("heal-abort"));
  assert.ok(ALARM.includes("lastUpdated-missing"));
  assert.ok(ALARM.includes("treat-as-empty"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published kintsugi walk scores kintsugi after the mended hold", () => {
  const booth = scoreWalk({ rows: KINTSUGI_WALK });
  assert.equal(booth.verdict, "kintsugi");
  assert.ok(booth.kintsugiCount >= 1);
  const idle = booth.rows.find((row) => row.event === "repair-bench");
  assert.equal(idle.mended, true);
  assert.equal(idle.verdict, "mended");
  const cut = booth.rows.find((row) => row.event === "heal-abort");
  assert.equal(cut.healAbort, true);
  const path = booth.rows.find(
    (row) => row.event === "heal-abort" && row.t === "path",
  );
  assert.equal(path.verdict, "heal-abort");
});

test("KINTSUGI_WALK constant matches the issue core walk", () => {
  assert.equal(KINTSUGI_WALK[0].event, "repair-bench");
  const cut = KINTSUGI_WALK.find((row) => row.event === "heal-abort");
  assert.equal(cut.healAbort || cut.treatAsEmpty, true);
  const path = KINTSUGI_WALK.find((row) => row.t === "path");
  assert.equal(path.kintsugi, true);
  const scoreRow = KINTSUGI_WALK.find((row) => row.event === "kintsugi");
  assert.equal(scoreRow.kintsugi, true);
  assert.equal(scoreRow.treatAsEmpty, true);
});

test("positive control repair-bench stays mended", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "mended");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "mended");
  const hold = walk.rows.find((row) => row.event === "repair-bench");
  assert.equal(hold.mended, true);
  assert.equal(hold.verdict, "mended");
});

test("issue constants encode only #94451 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94451);
  assert.ok(ISSUE_URL.includes("94451"));
  assert.match(TITLE, /known_marketplaces|lastUpdated|marketplace add|marketplace remove/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux|wsl/i);
  assert.match(HOST, /2\.1\.272|isolated config|no login/i);
  assert.equal(BUILD, "Claude Code 2.1.272");
  assert.equal(SURFACE, "heal-abort");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:linux", "platform:wsl", "area:plugins"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 6);
  assert.equal(EVIDENCE_ROWS[0].cracked, true);
  assert.equal(EVIDENCE_ROWS[5].live, true);
  assert.equal(EVIDENCE_ROWS[3].aborted, true);
  assert.ok(RULED_OUT.some((row) => /#94452/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#84501/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#19065/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#56967/i.test(row)));
  assert.ok(EXPECTED.some((row) => /per entry|quarantine|marketplace remove/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /known_marketplaces|lastUpdated|mkt-a|mkt-b|treating as empty|2\.1\.272/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("heal-abort"));
  assert.ok(FINGERPRINT_LINES.includes("kintsugi"));
  assert.equal(PHRASE, "Score kintsugi or admit mended.");
  assert.equal(SAMPLE_KINTSUGI_PROOF.healAbort, true);
  assert.equal(SAMPLE_KINTSUGI_PROOF.names.length, 6);
  assert.equal(seedFused().seed, "fused");
  assert.equal(seedGilded().seed, "gilded");
  assert.match(TREAT_AS_EMPTY_LINE, /treating as empty/);
  assert.equal(seedLastUpdatedMissing().seed, "lastUpdated-missing");
  assert.equal(seedParseError().seed, "parse-error");
});

test("has-repro fingerprints encode the published kintsugi proof", () => {
  const result = handle(seedKintsugi());
  assert.equal(result.published.platform, "linux/wsl");
  assert.equal(result.published.surface, "heal-abort");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedKintsugi()),
    /kintsugi\|kind=heal-abort\|ref=treat-as-empty\|path=heal-abort\|cue=heal-abort/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and homed/shared/contiguous", () => {
  const required = [
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "cleared",
    "stratum",
    "tmesis",
    "vedette",
    "orloj",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "layer-unsealed",
    "mid-inject",
    "idle-exit",
    "half-life",
    "fork-resume",
    "brief-echo",
    "background-reset",
    "streaming-stall",
    "device-absent",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "deferred-delta",
    "phantom-prompt",
    "dead-install",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("mended booth flips kintsugi back when the bench admits mended", () => {
  const tape = {
    mended: true,
    kintsugi: false,
    healAbort: false,
    cue: "mended",
  };
  assert.equal(scoreGate(tape).verdict, "mended");
  tape.mended = false;
  tape.kintsugi = true;
  tape.healAbort = true;
  tape.cue = "kintsugi";
  assert.equal(scoreGate(tape).verdict, "kintsugi");
  tape.mended = true;
  tape.kintsugi = false;
  tape.healAbort = false;
  tape.cue = "mended";
  assert.equal(scoreGate(tape).verdict, "mended");
});

test("inspectors and readBooth mark the kintsugi proof", () => {
  const missing = inspectLastUpdatedMissing({ kintsugi: true });
  assert.equal(missing.stamp, "lastUpdated-missing");
  const empty = inspectTreatAsEmpty({ kintsugi: true, treatAsEmpty: true });
  assert.equal(empty.stamp, "treat-as-empty");
  assert.equal(empty.flagged, true);
  const booth = readBooth({
    kintsugi: true,
    healAbort: true,
    treatAsEmpty: true,
  });
  assert.equal(booth.kintsugi, true);
  assert.equal(booth.mark, "kintsugi");
  const open = readBooth({
    mended: true,
    kintsugi: false,
    healAbort: false,
  });
  assert.equal(open.kintsugi, false);
  assert.equal(open.mark, "mended");
  assert.equal(inspectRewriteAbort({ kintsugi: true, rewriteAbort: true }).stamp, "rewrite-abort");
  assert.equal(inspectMarketplaceCli({ kintsugi: true, marketplaceRemove: true }).stamp, "marketplace-remove");
  assert.equal(inspectParseError({ kintsugi: true, parseError: true }).stamp, "parse-error");
});

test("mapKintsugi encodes the published heal-abort", () => {
  const miss = mapKintsugi({ kintsugi: true, healAbort: true });
  assert.equal(miss.stamp, "heal-abort");
  assert.equal(miss.holdingLane, "gold-seam");
  assert.equal(miss.ribbon, "kintsugi");
  const clear = mapKintsugi({ mended: true, kintsugi: false });
  assert.equal(clear.stamp, "repair-bench");
  assert.equal(clear.kindLane, "cracked-vessel");
  assert.equal(clear.holdingLane, "repair-bench");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.deepEqual(COUSINS.map((row) => row.issue), [84501, 19065, 56967, 94516, 94452]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cenotaph"));
  assert.ok(NOT_PRODUCTS.includes("stratum"));
  assert.ok(NOT_PRODUCTS.includes("tmesis"));
  assert.ok(NOT_PRODUCTS.includes("vedette"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.equal(BACKUPS.length, 15);
  assert.equal(BACKUPS[0].issue, 94430);
  assert.equal(BACKUPS[14].issue, 94530);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94451));
  assert.ok(!COUSINS.some((row) => row.issue === 94451));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/kintsugi.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const mendedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/mended.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(mendedFix.status, 0, mendedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const mendedOut = JSON.parse(mendedFix.stdout);
  assert.equal(idleOut.verdict, "mended");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "kintsugi");
  assert.equal(seededOut.alarm, true);
  assert.equal(mendedOut.verdict, "mended");
  assert.equal(mendedOut.hold, true);
  assert.match(mendedOut.phrase, /admit mended/);
});

test("handle exposes published hypothesis and #94451 headline", () => {
  const result = handle(seedKintsugi());
  assert.equal(result.published.issue, 94451);
  assert.equal(result.published.platform, "linux/wsl");
  assert.deepEqual(result.published.cousins, [84501, 19065, 56967, 94516, 94452]);
  assert.ok(result.published.backups.includes(94430));
  assert.ok(result.published.backups.includes(94530));
  assert.ok(!result.published.backups.includes(94451));
  assert.match(
    result.published.hypothesis,
    /known_marketplaces|treating as empty|NON-BINDING|#94451/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94451/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 6);
});

test("model has no static node: imports so the mended page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("mended page is a repair bench, not a memorial yard or core-sample", () => {
  const page = readPage();
  assert.match(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.match(page, /family=Outfit|Outfit/);
  assert.match(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /kintsugi|mended|heal-abort|cracked-vessel|gold-seam|kiln-bench|repair-bench/i,
  );
  assert.match(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/i);
  assert.match(page, /\bmended\b/);
  assert.match(page, /\bkintsugi\b/);
  assert.match(page, /heal-abort/);
  assert.match(page, /Score kintsugi or admit mended/i);
  assert.match(page, /#384/);
  assert.match(page, /#94451/);
  assert.match(page, /Admit mended/);
  assert.match(page, /Score kintsugi/);
  assert.match(page, /Walk heal-abort/);
  assert.match(page, /Compare mended \/ kintsugi/);
  assert.match(page, /Pin idle mended/);
  assert.match(page, /Pin seeded kintsugi/);
  assert.match(page, /Pin heal-abort/);
  assert.match(page, /Stamp treat-as-empty/);
  assert.match(page, /Score booth/);
  assert.match(page, /kintsugi-score/);
  assert.match(
    page,
    /known_marketplaces|lastUpdated|extraKnownMarketplaces|mkt-a|mkt-b|treating as empty/i,
  );
  assert.match(page, /cracked-vessel|gold-seam|kiln-bench|treat-as-empty|rewrite-abort|plugin-list-lie/i);
  assert.match(
    page,
    /<svg[\s\S]*class="cracked-bowl"|class="gold-seam"|class="kiln-mouth"|class="urushi-pot"|class="shard-tray"/i,
  );
  assert.match(page, /body\.mended|body\.kintsugi|body\.heal-abort/);
  assert.match(page, /evidence-table|known_marketplaces|lastUpdated|treating as empty/i);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Bebas\+Neue|Bebas Neue/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#E8E2D6|#8B6914|#3F5A45|#5C5650|#1A1814|#C4B59A|#0E0D0B/);
  assert.doesNotMatch(page, /#1E262C|#C67B28|#4A5964|#E4B25A|#101418|#8C3A16|#D8C4A0/);
  assert.doesNotMatch(page, /#F4E8D0|#2C1B12|#C43C2C|#8B1E1E|#243B55|#C4A46A|#14100C/);
  assert.doesNotMatch(page, /#1B2A1E|#E0A84A|#D9C7A3|#B8332A|#0A100C/);
  assert.doesNotMatch(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /#D6C7A8|#C67A28|#2C241C|#8C6B48|#E8A44A/);
  assert.doesNotMatch(page, /spliced parchment|editorial desk|iron-gall|vermillion splice/i);
  assert.doesNotMatch(page, /cavalry vedette|outpost lantern|picket-line|field olive/i);
  assert.doesNotMatch(page, /prague orloj|astronomical clock|zodiac dial|automaton tower/i);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /vacant sarcophagus|fallen from the wall|Portland-stone|memorial yard|carved stone|bronze plaque/i);
  assert.doesNotMatch(page, /admit shared|Score stratum|idle shared/i);
  assert.doesNotMatch(page, /admit contiguous|Score tmesis|idle contiguous/i);
  assert.doesNotMatch(page, /admit stationed|Score vedette|idle stationed/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /admit homed|Score cenotaph|idle homed/i);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bdiptych\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /layer-unsealed/);
  assert.doesNotMatch(page, /mid-inject/);
  assert.doesNotMatch(page, /idle-exit/);
  assert.doesNotMatch(page, /half-life/);
  assert.doesNotMatch(page, /fork-resume/);
  assert.doesNotMatch(page, /brief-echo/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /dead-install/);
  assert.match(page, /NOT Cenotaph/i);
  assert.match(page, /NOT Stratum/i);
  assert.match(page, /NOT Tmesis/i);
  assert.match(page, /NOT #94452/i);
  assert.match(page, /NOT #84501/i);
  assert.match(page, /#94452/);
  assert.match(page, /#84501/);
  assert.match(page, /#19065/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Kintsugi/);
  assert.match(readme, /#94451/);
  assert.match(readme, /\bmended\b/);
  assert.match(readme, /\bkintsugi\b/);
  assert.match(readme, /heal-abort/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Newsreader/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Bebas Neue/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /known_marketplaces|lastUpdated|treating as empty|extraKnownMarketplaces/i);
  assert.match(readme, /NOT #94452/);
  assert.match(readme, /NOT #84501/);
  assert.match(readme, /NOT #19065/);
  assert.match(readme, /NOT #56967/);
  assert.match(readme, /#94452/);
  assert.match(readme, /#84501/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/kintsugi/);
  assert.match(readme, /node --test projects\/kintsugi\/kintsugi\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /urushi|gold seam|broken ceramic|kiln|repair bench/i);
  assert.match(readme, /Score kintsugi or admit mended/);
  assert.match(readme, /#94430|#94530/);
  assert.doesNotMatch(readme, /backup #94451|#94451 as next/);
  assert.match(readme, /00:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bcenotaph\b/);
  assert.doesNotMatch(readme, /\bstratum\b/);
  assert.doesNotMatch(readme, /\btmesis\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Kintsugi/);
  assert.match(runLog, /00:50/);
});

test("catalog features Kintsugi only; Cenotaph unfeatured; product count 384", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 384);
  assert.equal(hub.products.length, 384);
  assert.equal(catalog.products[0].name, "Kintsugi");
  assert.equal(catalog.products[0].slug, "kintsugi");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/kintsugi/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bmended\b/);
  assert.match(catalog.products[0].summary, /\bkintsugi\b/);
  assert.match(catalog.products[0].summary, /heal-abort/);
  assert.match(catalog.products[0].summary, /Score kintsugi or admit mended/);
  assert.match(catalog.products[0].summary, /#94451/);
  assert.match(catalog.products[0].summary, /00:50/);
  assert.equal(hub.products[0].slug, "kintsugi");
  assert.equal(hub.products[0].featured, true);
  const cenotaph = catalog.products.find((row) => row.slug === "cenotaph");
  assert.ok(cenotaph);
  assert.equal(cenotaph.featured, false);
  const stratum = catalog.products.find((row) => row.slug === "stratum");
  assert.ok(stratum);
  assert.equal(stratum.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "kintsugi" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94451") && row.slug !== "kintsugi",
    ),
  );
});

test("vercel rewrites kintsugi to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/kintsugi");
  assert.equal(vercel.rewrites[0].destination, "/projects/kintsugi");
  assert.equal(vercel.rewrites[1].source, "/kintsugi/");
  assert.equal(vercel.rewrites[1].destination, "/projects/kintsugi");
  assert.equal(vercel.rewrites[2].source, "/kintsugi/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/kintsugi/:path*");
  assert.equal(vercel.rewrites[3].source, "/cenotaph");
  assert.equal(vercel.rewrites[3].destination, "/projects/cenotaph");
});

test("no leftover clone / parchment / lantern / clock / vacant-sarcophagus content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk|outpost-lantern|picket-line|cavalry-vedette|spliced-parchment|editorial-desk|iron-gall|vacant sarcophagus|Portland-stone|memorial-yard|carved-stone|bronze-plaque/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock|outpost lantern|picket-line clock|spliced parchment|vacant sarcophagus|carved stone pointing/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
