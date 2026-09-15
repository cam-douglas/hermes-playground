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
  LIVE_SOURCE,
  MARKETPLACE_ID,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CENOTAPH_PROOF,
  SEEDED_WORD,
  STATE,
  CENOTAPH_WALK,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCacheMiss,
  inspectEnabledCleared,
  inspectLastUpdated,
  inspectMarketplaceUpdate,
  inspectRemoveAdd,
  mapCenotaph,
  observeDeadInstall,
  polishPlaque,
  readBooth,
  recoverEnabledPlugins,
  resolveMarketplaceUpdate,
  rewriteInstallLocation,
  score,
  scoreDeadInstall,
  scoreGate,
  scoreWalk,
  seedCacheMiss,
  seedCenotaph,
  seedDeadInstall,
  seedHomed,
  seedProduct,
  seedRelocated,
  seedRepointed,
  seedSettled,
} from "./cenotaph.mjs";

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
  return fileURLToPath(new URL("./cenotaph.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "23:50 cenotaph: a memorial / empty-tomb / sepulchre / cenotaph-yard booth for #94452. A directory marketplace whose recorded installLocation no longer exists never loads again: every launch re-fetches from source but keeps the dead path, and marketplace update fails on it. Idle homed / seeded cenotaph / path dead-install. Score cenotaph or admit homed.";

test("idle homed is a hold; rewrite installLocation to live source.path", () => {
  const result = analyze(seedHomed());
  assert.equal(result.verdict, "homed");
  assert.equal(result.idleWord, "homed");
  assert.equal(IDLE_WORD, "homed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.homed, true);
  assert.equal(result.phrase, "admit homed");
  assert.equal(result.cenotaph, false);
  assert.equal(result.deadInstall, false);
  assert.ok(HOLD_ALIASES.includes("repointed"));
  assert.ok(HOLD_ALIASES.includes("relocated"));
  assert.ok(HOLD_ALIASES.includes("settled"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "lasting");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "single");
  assert.notEqual(IDLE_WORD, "pledged");
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "stood");
});

test("empty ticket and empty stdin classify homed", () => {
  assert.equal(classify(emptyTicket()), "homed");
  assert.equal(classify(""), "homed");
  assert.equal(classify(null), "homed");
  assert.equal(decide({}), "homed");
});

test("#94452 seeded path scores cenotaph when the stone is unmoved", () => {
  const result = analyze(seedCenotaph());
  assert.equal(result.verdict, "cenotaph");
  assert.equal(result.seededWord, "cenotaph");
  assert.equal(SEEDED_WORD, "cenotaph");
  assert.equal(PRODUCT_WORD, "cenotaph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.cenotaph, true);
  assert.equal(result.phrase, "score cenotaph");
  assert.equal(result.deadInstall, true);
  assert.equal(result.cacheMiss, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "stratum");
  assert.notEqual(SEEDED_WORD, "tmesis");
  assert.notEqual(SEEDED_WORD, "vedette");
  assert.notEqual(PATH_WORD, "layer-unsealed");
  assert.notEqual(PATH_WORD, "mid-inject");
  assert.notEqual(PATH_WORD, "idle-exit");
});

test("educational dead-install helpers encode published homed vs unmoved paths", () => {
  assert.equal(CODE_BUILD, "2.1.272");
  assert.equal(MARKETPLACE_ID, "mkt-a");
  const wet = observeDeadInstall({ installLocationMissing: true });
  assert.equal(wet.installLocationMissing, true);
  const shut = observeDeadInstall({ homed: true });
  assert.equal(shut.installLocation, LIVE_SOURCE);
  const stuck = rewriteInstallLocation({ dead: true });
  assert.equal(stuck.installLocation !== LIVE_SOURCE, true);
  const moved = rewriteInstallLocation({ homed: true });
  assert.equal(moved.installLocation, LIVE_SOURCE);
  const polished = polishPlaque({});
  assert.equal(polished.installLocationRewritten, false);
  const held = polishPlaque({ homed: true });
  assert.equal(held.installLocationRewritten, true);
  const fail = resolveMarketplaceUpdate({});
  assert.equal(fail.resolvedFrom, "installLocation");
  const ok = resolveMarketplaceUpdate({ homed: true });
  assert.equal(ok.resolvedFrom, "source");
  const cleared = recoverEnabledPlugins({});
  assert.equal(cleared.pluginsStayEnabled, false);
  const kept = recoverEnabledPlugins({ homed: true });
  assert.equal(kept.pluginsStayEnabled, true);
  const scored = scoreDeadInstall({
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
  });
  assert.equal(scored.cenotaph, true);
  assert.equal(scored.deadInstall, true);
  const intactPath = scoreDeadInstall({ homed: true });
  assert.equal(intactPath.cenotaph, false);
  assert.equal(intactPath.homed, true);
});

test("inspectors mark last-updated and cache-miss", () => {
  const plaque = inspectLastUpdated({ cenotaph: true, lastUpdated: true });
  assert.equal(plaque.stamp, "last-updated");
  assert.equal(plaque.flagged, true);
  const miss = inspectCacheMiss({ cenotaph: true, cacheMiss: true });
  assert.equal(miss.stamp, "cache-miss");
  assert.equal(miss.missed, true);
  const scored = scoreGate({
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
    cue: "cenotaph",
  });
  assert.equal(scored.verdict, "cenotaph");
  const open = inspectLastUpdated({ homed: true, cenotaph: false });
  assert.equal(open.stamp, "repointed");
});

test("path word is dead-install; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "dead-install");
  const result = analyze(seedDeadInstall());
  assert.equal(result.verdict, "dead-install");
  assert.equal(result.pathWord, "dead-install");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "dead-install",
      preferSeed: true,
      cenotaph: true,
    }),
    "dead-install",
  );
  assert.equal(classify({ seed: "last-updated", preferSeed: true }), "last-updated");
  assert.equal(score(seedDeadInstall()), "cenotaph");
});

test("HOLD includes homed; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("homed"));
  const repointed = analyze(seedRepointed());
  assert.equal(repointed.verdict, "repointed");
  assert.equal(classify({ seed: "relocated", preferSeed: true }), "relocated");
  assert.equal(classify({ seed: "settled", preferSeed: true }), "settled");
});

test("alarm chips: last-updated, cache-miss, cenotaph", () => {
  assert.equal(classify({ seed: "last-updated", preferSeed: true }), "last-updated");
  assert.equal(classify(seedDeadInstall()), "dead-install");
  assert.equal(classify(seedProduct()), "cenotaph");
  assert.equal(classify(seedCacheMiss()), "cache-miss");
  assert.equal(classify({ seed: "marketplace-update", preferSeed: true }), "marketplace-update");
});

test("booth fixtures flip homed vs cenotaph vs dead-install", () => {
  const idle = scoreGate(seedHomed());
  const seeded = scoreGate(seedCenotaph());
  const homed = readData("homed.json");
  const cenotaph = readData("cenotaph.json");
  const issued = readData("94452.json");
  const path = readData("dead-install.json");
  assert.equal(idle.verdict, "homed");
  assert.equal(seeded.verdict, "cenotaph");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedHomed()), "homed");
  assert.equal(score(seedCenotaph()), "cenotaph");
  assert.equal(score({ seed: "dead-install", preferSeed: true }), "cenotaph");
  assert.equal(homed.deadInstall, false);
  assert.equal(homed.homed, true);
  assert.equal(scoreGate(homed).verdict, "homed");
  assert.equal(cenotaph.deadInstall, true);
  assert.equal(cenotaph.cacheMiss, true);
  assert.equal(classify(cenotaph), "cenotaph");
  assert.equal(issued.issue, 94452);
  assert.equal(classify(issued), "cenotaph");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /homed|repointed|relocated|settled/i);
  assert.match(path.paths[1].result, /dead-install|cache-miss|last-updated|marketplace-update|remove-add/i);
  assert.equal(classify(path), "dead-install");
  assert.equal(cenotaph.hubCount, "CENOTAPH");
  assert.equal(cenotaph.issue, 94452);
  assert.equal(cenotaph.cenotaph, true);
  assert.equal(classify(readData("repointed.json")), "repointed");
  assert.equal(classify(readData("relocated.json")), "relocated");
  assert.equal(classify(readData("settled.json")), "settled");
  assert.equal(classify(readData("last-updated.json")), "last-updated");
  assert.equal(classify(readData("marketplace-update.json")), "marketplace-update");
  assert.equal(classify(readData("cache-miss.json")), "cache-miss");
  assert.equal(classify(readData("remove-add.json")), "remove-add");
  assert.equal(classify(readData("enabled-cleared.json")), "enabled-cleared");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94451, 82272, 36575, 94516]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("plaque.json")), "cache-miss");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("homed"));
  assert.ok(CHIPS.includes("cenotaph"));
  assert.ok(CHIPS.includes("dead-install"));
  assert.ok(CHIPS.includes("last-updated"));
  assert.ok(CHIPS.includes("cache-miss"));
  assert.ok(CHIPS.includes("marketplace-update"));
  assert.ok(CHIPS.includes("settled"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("cenotaph"));
  assert.ok(ALARM.includes("dead-install"));
  assert.ok(ALARM.includes("last-updated"));
  assert.ok(ALARM.includes("cache-miss"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cenotaph walk scores cenotaph after the homed hold", () => {
  const booth = scoreWalk({ rows: CENOTAPH_WALK });
  assert.equal(booth.verdict, "cenotaph");
  assert.ok(booth.cenotaphCount >= 1);
  const idle = booth.rows.find((row) => row.event === "memorial-yard");
  assert.equal(idle.homed, true);
  assert.equal(idle.verdict, "homed");
  const cut = booth.rows.find((row) => row.event === "dead-install");
  assert.equal(cut.deadInstall, true);
  const path = booth.rows.find(
    (row) => row.event === "dead-install" && row.t === "path",
  );
  assert.equal(path.verdict, "dead-install");
});

test("CENOTAPH_WALK constant matches the issue core walk", () => {
  assert.equal(CENOTAPH_WALK[0].event, "memorial-yard");
  const cut = CENOTAPH_WALK.find((row) => row.event === "dead-install");
  assert.equal(cut.deadInstall || cut.cacheMiss, true);
  const path = CENOTAPH_WALK.find((row) => row.t === "path");
  assert.equal(path.cenotaph, true);
  const scoreRow = CENOTAPH_WALK.find((row) => row.event === "cenotaph");
  assert.equal(scoreRow.cenotaph, true);
  assert.equal(scoreRow.cacheMiss, true);
});

test("positive control memorial-yard stays homed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "homed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "homed");
  const hold = walk.rows.find((row) => row.event === "memorial-yard");
  assert.equal(hold.homed, true);
  assert.equal(hold.verdict, "homed");
});

test("issue constants encode only #94452 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94452);
  assert.ok(ISSUE_URL.includes("94452"));
  assert.match(TITLE, /installLocation|directory marketplace|marketplace update/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /wsl/i);
  assert.match(HOST, /2\.1\.272|isolated config|no login/i);
  assert.equal(BUILD, "Claude Code 2.1.272");
  assert.equal(SURFACE, "dead-install");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:wsl", "area:plugins"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 6);
  assert.equal(EVIDENCE_ROWS[2].dead, true);
  assert.equal(EVIDENCE_ROWS[1].live, true);
  assert.equal(EVIDENCE_ROWS[3].polished, true);
  assert.ok(RULED_OUT.some((row) => /#94451/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#82272/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#36575/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#86198/i.test(row)));
  assert.ok(EXPECTED.some((row) => /source\.path|marketplace update|remove/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /installLocation|known_marketplaces|lastUpdated|mkt-a|enabledPlugins|2\.1\.272/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("dead-install"));
  assert.ok(FINGERPRINT_LINES.includes("cenotaph"));
  assert.equal(PHRASE, "Score cenotaph or admit homed.");
  assert.equal(SAMPLE_CENOTAPH_PROOF.deadInstall, true);
  assert.equal(SAMPLE_CENOTAPH_PROOF.names.length, 6);
  assert.equal(seedSettled().seed, "settled");
  assert.equal(seedRelocated().seed, "relocated");
});

test("has-repro fingerprints encode the published cenotaph proof", () => {
  const result = handle(seedCenotaph());
  assert.equal(result.published.platform, "wsl");
  assert.equal(result.published.surface, "dead-install");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedCenotaph()),
    /cenotaph\|kind=dead-install\|ref=cache-miss\|path=dead-install\|cue=dead-install/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and shared/contiguous/stationed", () => {
  const required = [
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "verbatim",
    "quiet",
    "intact",
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("homed booth flips cenotaph back when the yard admits homed", () => {
  const tape = {
    homed: true,
    cenotaph: false,
    deadInstall: false,
    cue: "homed",
  };
  assert.equal(scoreGate(tape).verdict, "homed");
  tape.homed = false;
  tape.cenotaph = true;
  tape.deadInstall = true;
  tape.cue = "cenotaph";
  assert.equal(scoreGate(tape).verdict, "cenotaph");
  tape.homed = true;
  tape.cenotaph = false;
  tape.deadInstall = false;
  tape.cue = "homed";
  assert.equal(scoreGate(tape).verdict, "homed");
});

test("inspectors and readBooth mark the cenotaph proof", () => {
  const plaque = inspectLastUpdated({ cenotaph: true });
  assert.equal(plaque.stamp, "last-updated");
  const miss = inspectCacheMiss({ cenotaph: true, cacheMiss: true });
  assert.equal(miss.stamp, "cache-miss");
  assert.equal(miss.missed, true);
  const booth = readBooth({
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
  });
  assert.equal(booth.cenotaph, true);
  assert.equal(booth.mark, "cenotaph");
  const open = readBooth({
    homed: true,
    cenotaph: false,
    deadInstall: false,
  });
  assert.equal(open.cenotaph, false);
  assert.equal(open.mark, "homed");
  assert.equal(inspectMarketplaceUpdate({ cenotaph: true, marketplaceUpdate: true }).stamp, "marketplace-update");
  assert.equal(inspectRemoveAdd({ cenotaph: true, removeAdd: true }).stamp, "remove-add");
  assert.equal(inspectEnabledCleared({ cenotaph: true, enabledCleared: true }).stamp, "enabled-cleared");
});

test("mapCenotaph encodes the published dead-install", () => {
  const miss = mapCenotaph({ cenotaph: true, deadInstall: true });
  assert.equal(miss.stamp, "dead-install");
  assert.equal(miss.holdingLane, "carved-stone");
  assert.equal(miss.ribbon, "cenotaph");
  const clear = mapCenotaph({ homed: true, cenotaph: false });
  assert.equal(clear.stamp, "memorial-yard");
  assert.equal(clear.kindLane, "living-source");
  assert.equal(clear.holdingLane, "memorial-yard");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94451, 82272, 36575, 94516]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("stratum"));
  assert.ok(NOT_PRODUCTS.includes("tmesis"));
  assert.ok(NOT_PRODUCTS.includes("vedette"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 94451);
  assert.equal(BACKUPS[12].issue, 94507);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94452));
  assert.ok(!COUSINS.some((row) => row.issue === 94452));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cenotaph.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const homedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/homed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(homedFix.status, 0, homedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const homedOut = JSON.parse(homedFix.stdout);
  assert.equal(idleOut.verdict, "homed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "cenotaph");
  assert.equal(seededOut.alarm, true);
  assert.equal(homedOut.verdict, "homed");
  assert.equal(homedOut.hold, true);
  assert.match(homedOut.phrase, /admit homed/);
});

test("handle exposes published hypothesis and #94452 headline", () => {
  const result = handle(seedCenotaph());
  assert.equal(result.published.issue, 94452);
  assert.equal(result.published.platform, "wsl");
  assert.deepEqual(result.published.cousins, [94451, 82272, 36575, 94516]);
  assert.ok(result.published.backups.includes(94451));
  assert.ok(result.published.backups.includes(94507));
  assert.ok(!result.published.backups.includes(94452));
  assert.match(
    result.published.hypothesis,
    /installLocation|source\.path|NON-BINDING|#94452/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94452/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 6);
});

test("model has no static node: imports so the homed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("homed page is a memorial yard, not a core-sample or vacant sarcophagus", () => {
  const page = readPage();
  assert.match(page, /family=Newsreader|Newsreader/);
  assert.match(page, /family=Karla|Karla/);
  assert.match(page, /family=Fragment\+Mono|Fragment Mono/);
  assert.match(
    page,
    /cenotaph|homed|dead-install|living-source|carved-stone|bronze-plaque|memorial-yard/i,
  );
  assert.match(page, /#E8E2D6|#8B6914|#3F5A45|#5C5650|#1A1814|#C4B59A|#0E0D0B/i);
  assert.match(page, /\bhomed\b/);
  assert.match(page, /\bcenotaph\b/);
  assert.match(page, /dead-install/);
  assert.match(page, /Score cenotaph or admit homed/i);
  assert.match(page, /#383/);
  assert.match(page, /#94452/);
  assert.match(page, /Admit homed/);
  assert.match(page, /Score cenotaph/);
  assert.match(page, /Walk dead-install/);
  assert.match(page, /Compare homed \/ cenotaph/);
  assert.match(page, /Pin idle homed/);
  assert.match(page, /Pin seeded cenotaph/);
  assert.match(page, /Pin dead-install/);
  assert.match(page, /Stamp cache-miss/);
  assert.match(page, /Score booth/);
  assert.match(page, /cenotaph-score/);
  assert.match(
    page,
    /installLocation|known_marketplaces|source\.path|lastUpdated|mkt-a|enabledPlugins/i,
  );
  assert.match(page, /living-source|carved-stone|bronze-plaque|void-path|update-fail|enabled-cleared/i);
  assert.match(
    page,
    /<svg[\s\S]*class="living-source"|class="carved-stone"|class="bronze-plaque"|class="void-path"|class="update-fail"/i,
  );
  assert.match(page, /body\.homed|body\.cenotaph|body\.dead-install/);
  assert.match(page, /evidence-table|installLocation|source\.path|lastUpdated/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
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
  assert.doesNotMatch(page, /vacant sarcophagus|fallen from the wall|Portland-stone/i);
  assert.doesNotMatch(page, /admit shared|Score stratum|idle shared/i);
  assert.doesNotMatch(page, /admit contiguous|Score tmesis|idle contiguous/i);
  assert.doesNotMatch(page, /admit stationed|Score vedette|idle stationed/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
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
  assert.match(page, /NOT Stratum/i);
  assert.match(page, /NOT Tmesis/i);
  assert.match(page, /NOT #94451/i);
  assert.match(page, /NOT #82272/i);
  assert.match(page, /#94451/);
  assert.match(page, /#82272/);
  assert.match(page, /#36575/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cenotaph/);
  assert.match(readme, /#94452/);
  assert.match(readme, /\bhomed\b/);
  assert.match(readme, /\bcenotaph\b/);
  assert.match(readme, /dead-install/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Fragment Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Bebas Neue/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /installLocation|known_marketplaces|source\.path|lastUpdated/i);
  assert.match(readme, /NOT #94451/);
  assert.match(readme, /NOT #82272/);
  assert.match(readme, /NOT #36575/);
  assert.match(readme, /#94451/);
  assert.match(readme, /#82272/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cenotaph/);
  assert.match(readme, /node --test projects\/cenotaph\/cenotaph\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /memorial|empty-tomb|cenotaph-yard|carved stone|bronze plaque/i);
  assert.match(readme, /Score cenotaph or admit homed/);
  assert.match(readme, /#94451|#94507/);
  assert.doesNotMatch(readme, /backup #94452|#94452 as next/);
  assert.match(readme, /23:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bstratum\b/);
  assert.doesNotMatch(readme, /\btmesis\b/);
  assert.doesNotMatch(readme, /\bvedette\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Cenotaph/);
  assert.match(runLog, /23:50/);
});

test("catalog features Cenotaph only; Stratum unfeatured; product count 383", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 383);
  assert.equal(hub.products.length, 383);
  assert.equal(catalog.products[0].name, "Cenotaph");
  assert.equal(catalog.products[0].slug, "cenotaph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cenotaph/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bhomed\b/);
  assert.match(catalog.products[0].summary, /\bcenotaph\b/);
  assert.match(catalog.products[0].summary, /dead-install/);
  assert.match(catalog.products[0].summary, /Score cenotaph or admit homed/);
  assert.match(catalog.products[0].summary, /#94452/);
  assert.match(catalog.products[0].summary, /23:50/);
  assert.equal(hub.products[0].slug, "cenotaph");
  assert.equal(hub.products[0].featured, true);
  const stratum = catalog.products.find((row) => row.slug === "stratum");
  assert.ok(stratum);
  assert.equal(stratum.featured, false);
  const tmesis = catalog.products.find((row) => row.slug === "tmesis");
  assert.ok(tmesis);
  assert.equal(tmesis.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "cenotaph" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94452") && row.slug !== "cenotaph",
    ),
  );
});

test("vercel rewrites cenotaph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cenotaph");
  assert.equal(vercel.rewrites[0].destination, "/projects/cenotaph");
  assert.equal(vercel.rewrites[1].source, "/cenotaph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cenotaph");
  assert.equal(vercel.rewrites[2].source, "/cenotaph/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cenotaph/:path*");
  assert.equal(vercel.rewrites[3].source, "/stratum");
  assert.equal(vercel.rewrites[3].destination, "/projects/stratum");
});

test("no leftover clone / parchment / lantern / clock / vacant-sarcophagus content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk|outpost-lantern|picket-line|cavalry-vedette|spliced-parchment|editorial-desk|iron-gall|vacant sarcophagus|Portland-stone/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock|outpost lantern|picket-line clock|spliced parchment|vacant sarcophagus/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
