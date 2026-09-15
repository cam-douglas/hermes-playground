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
  CROSS_SESSION_HITS,
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
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_STRATUM_PROOF,
  SEEDED_WORD,
  SESSION_STARTS,
  STATE,
  STRATUM_WALK,
  SURFACE,
  TITLE,
  VERDICTS,
  WARM_STARTS,
  analyze,
  assemblePrefix,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCacheMiss,
  inspectMessagesZero,
  inspectNoBreakpoint,
  inspectParallelShafts,
  inspectProjectContext,
  mapStratum,
  measureCrossSessionHits,
  observeSystemBreakpoint,
  placeProjectContext,
  readBooth,
  score,
  scoreGate,
  scoreLayerUnsealed,
  scoreWalk,
  sealBeddingPlane,
  seedCacheMiss,
  seedCommon,
  seedLayerUnsealed,
  seedLayered,
  seedProduct,
  seedShared,
  seedStratum,
} from "./stratum.mjs";

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
  return fileURLToPath(new URL("./stratum.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "22:50 stratum: a geology / core-sample / bedding-plane / field-stratigraphy booth for #94417. CLAUDE.md / auto-memory sits in messages[0] after the system breakpoint with no cache_control of its own, so parallel sessions never share the project bed. Idle shared / seeded stratum / path layer-unsealed. Score stratum or admit shared.";

test("idle shared is a hold; seal the project bed so parallel shafts share it", () => {
  const result = analyze(seedShared());
  assert.equal(result.verdict, "shared");
  assert.equal(result.idleWord, "shared");
  assert.equal(IDLE_WORD, "shared");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.shared, true);
  assert.equal(result.phrase, "admit shared");
  assert.equal(result.stratum, false);
  assert.equal(result.layerUnsealed, false);
  assert.ok(HOLD_ALIASES.includes("layered"));
  assert.ok(HOLD_ALIASES.includes("sealed"));
  assert.ok(HOLD_ALIASES.includes("common"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
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
});

test("empty ticket and empty stdin classify shared", () => {
  assert.equal(classify(emptyTicket()), "shared");
  assert.equal(classify(""), "shared");
  assert.equal(classify(null), "shared");
  assert.equal(decide({}), "shared");
});

test("#94417 seeded path scores stratum when the project bed is unsealed", () => {
  const result = analyze(seedStratum());
  assert.equal(result.verdict, "stratum");
  assert.equal(result.seededWord, "stratum");
  assert.equal(SEEDED_WORD, "stratum");
  assert.equal(PRODUCT_WORD, "stratum");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.stratum, true);
  assert.equal(result.phrase, "score stratum");
  assert.equal(result.layerUnsealed, true);
  assert.equal(result.cacheMiss, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "tmesis");
  assert.notEqual(SEEDED_WORD, "vedette");
  assert.notEqual(SEEDED_WORD, "orloj");
  assert.notEqual(PATH_WORD, "mid-inject");
  assert.notEqual(PATH_WORD, "idle-exit");
  assert.notEqual(PATH_WORD, "orphan-tick");
});

test("educational layer-unsealed helper encodes published shared vs unsealed paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(SESSION_STARTS, 703);
  assert.equal(WARM_STARTS, 474);
  assert.equal(CROSS_SESSION_HITS, 0);
  const wet = observeSystemBreakpoint({ projectSealed: false });
  assert.equal(wet.projectSealed, false);
  const shut = observeSystemBreakpoint({ shared: true });
  assert.equal(shut.projectSealed, true);
  const placed = placeProjectContext({ inMessagesZero: true, cacheControl: false });
  assert.equal(placed.lane, "messages[0].content[0]");
  const deferred = placeProjectContext({ shared: true });
  assert.equal(deferred.cacheControl, true);
  const broken = sealBeddingPlane({});
  assert.equal(broken.sealed, false);
  const held = sealBeddingPlane({ shared: true });
  assert.equal(held.sealed, true);
  const miss = measureCrossSessionHits({});
  assert.equal(miss.hitsBeyondSystem, 0);
  const hit = measureCrossSessionHits({ shared: true });
  assert.equal(hit.hitsBeyondSystem, WARM_STARTS);
  const fail = assemblePrefix({});
  assert.equal(fail.sessionSpecific, true);
  const ok = assemblePrefix({ shared: true });
  assert.equal(ok.matchable, true);
  const scored = scoreLayerUnsealed({
    stratum: true,
    layerUnsealed: true,
    cacheMiss: true,
  });
  assert.equal(scored.stratum, true);
  assert.equal(scored.layerUnsealed, true);
  const intactPath = scoreLayerUnsealed({ shared: true });
  assert.equal(intactPath.stratum, false);
  assert.equal(intactPath.shared, true);
});

test("inspectors mark no-breakpoint and cache-miss", () => {
  const cmd = inspectNoBreakpoint({ stratum: true, noBreakpoint: true });
  assert.equal(cmd.stamp, "no-breakpoint");
  assert.equal(cmd.flagged, true);
  const seal = inspectCacheMiss({ stratum: true, cacheMiss: true });
  assert.equal(seal.stamp, "cache-miss");
  assert.equal(seal.missed, true);
  const scored = scoreGate({
    stratum: true,
    layerUnsealed: true,
    cacheMiss: true,
    cue: "stratum",
  });
  assert.equal(scored.verdict, "stratum");
  const open = inspectNoBreakpoint({ shared: true, stratum: false });
  assert.equal(open.stamp, "layered");
});

test("path word is layer-unsealed; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "layer-unsealed");
  const result = analyze(seedLayerUnsealed());
  assert.equal(result.verdict, "layer-unsealed");
  assert.equal(result.pathWord, "layer-unsealed");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "layer-unsealed",
      preferSeed: true,
      stratum: true,
    }),
    "layer-unsealed",
  );
  assert.equal(classify({ seed: "no-breakpoint", preferSeed: true }), "no-breakpoint");
  assert.equal(score(seedLayerUnsealed()), "stratum");
});

test("HOLD includes shared; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("shared"));
  const layered = analyze(seedLayered());
  assert.equal(layered.verdict, "layered");
  assert.equal(classify({ seed: "sealed", preferSeed: true }), "sealed");
  assert.equal(classify({ seed: "common", preferSeed: true }), "common");
});

test("alarm chips: no-breakpoint, cache-miss, stratum", () => {
  assert.equal(classify({ seed: "no-breakpoint", preferSeed: true }), "no-breakpoint");
  assert.equal(classify(seedLayerUnsealed()), "layer-unsealed");
  assert.equal(classify(seedProduct()), "stratum");
  assert.equal(classify(seedCacheMiss()), "cache-miss");
  assert.equal(classify({ seed: "messages-zero", preferSeed: true }), "messages-zero");
});

test("booth fixtures flip shared vs stratum vs layer-unsealed", () => {
  const idle = scoreGate(seedShared());
  const seeded = scoreGate(seedStratum());
  const shared = readData("shared.json");
  const stratum = readData("stratum.json");
  const issued = readData("94417.json");
  const path = readData("layer-unsealed.json");
  assert.equal(idle.verdict, "shared");
  assert.equal(seeded.verdict, "stratum");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedShared()), "shared");
  assert.equal(score(seedStratum()), "stratum");
  assert.equal(score({ seed: "layer-unsealed", preferSeed: true }), "stratum");
  assert.equal(shared.layerUnsealed, false);
  assert.equal(shared.shared, true);
  assert.equal(scoreGate(shared).verdict, "shared");
  assert.equal(stratum.layerUnsealed, true);
  assert.equal(stratum.cacheMiss, true);
  assert.equal(classify(stratum), "stratum");
  assert.equal(issued.issue, 94417);
  assert.equal(classify(issued), "stratum");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /shared|layered|sealed|common/i);
  assert.match(path.paths[1].result, /layer-unsealed|no-breakpoint|messages-zero|cache-miss|project-context/i);
  assert.equal(classify(path), "layer-unsealed");
  assert.equal(stratum.hubCount, "STRATUM");
  assert.equal(stratum.issue, 94417);
  assert.equal(stratum.stratum, true);
  assert.equal(classify(readData("layered.json")), "layered");
  assert.equal(classify(readData("sealed.json")), "sealed");
  assert.equal(classify(readData("common.json")), "common");
  assert.equal(classify(readData("no-breakpoint.json")), "no-breakpoint");
  assert.equal(classify(readData("messages-zero.json")), "messages-zero");
  assert.equal(classify(readData("cache-miss.json")), "cache-miss");
  assert.equal(classify(readData("project-context.json")), "project-context");
  assert.equal(classify(readData("parallel-shafts.json")), "parallel-shafts");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94400, 93490, 93848, 91151]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("core.json")), "cache-miss");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("shared"));
  assert.ok(CHIPS.includes("stratum"));
  assert.ok(CHIPS.includes("layer-unsealed"));
  assert.ok(CHIPS.includes("no-breakpoint"));
  assert.ok(CHIPS.includes("cache-miss"));
  assert.ok(CHIPS.includes("messages-zero"));
  assert.ok(CHIPS.includes("common"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("stratum"));
  assert.ok(ALARM.includes("layer-unsealed"));
  assert.ok(ALARM.includes("no-breakpoint"));
  assert.ok(ALARM.includes("cache-miss"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published stratum walk scores stratum after the shared hold", () => {
  const booth = scoreWalk({ rows: STRATUM_WALK });
  assert.equal(booth.verdict, "stratum");
  assert.ok(booth.stratumCount >= 1);
  const idle = booth.rows.find((row) => row.event === "field-stratigraphy");
  assert.equal(idle.shared, true);
  assert.equal(idle.verdict, "shared");
  const cut = booth.rows.find((row) => row.event === "layer-unsealed");
  assert.equal(cut.layerUnsealed, true);
  const path = booth.rows.find(
    (row) => row.event === "layer-unsealed" && row.t === "path",
  );
  assert.equal(path.verdict, "layer-unsealed");
});

test("STRATUM_WALK constant matches the issue core walk", () => {
  assert.equal(STRATUM_WALK[0].event, "field-stratigraphy");
  const cut = STRATUM_WALK.find((row) => row.event === "layer-unsealed");
  assert.equal(cut.layerUnsealed || cut.cacheMiss, true);
  const path = STRATUM_WALK.find((row) => row.t === "path");
  assert.equal(path.stratum, true);
  const scoreRow = STRATUM_WALK.find((row) => row.event === "stratum");
  assert.equal(scoreRow.stratum, true);
  assert.equal(scoreRow.cacheMiss, true);
});

test("positive control field-stratigraphy core stays shared", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "shared");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "shared");
  const hold = walk.rows.find((row) => row.event === "field-stratigraphy");
  assert.equal(hold.shared, true);
  assert.equal(hold.verdict, "shared");
});

test("issue constants encode only #94417 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94417);
  assert.ok(ISSUE_URL.includes("94417"));
  assert.match(TITLE, /CLAUDE\.md|auto-memory|cache_control|messages\[0\]/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.270|Windows 11|Opus 5/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "layer-unsealed");
  assert.deepEqual([...LABELS], ["bug", "has repro", "area:core"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 6);
  assert.equal(EVIDENCE_ROWS[3].unsealed, true);
  assert.equal(EVIDENCE_ROWS[3].cacheControl, false);
  assert.equal(EVIDENCE_ROWS[2].cacheControl, true);
  assert.equal(EVIDENCE_ROWS[5].sessionSpecific, true);
  assert.ok(RULED_OUT.some((row) => /#94400/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#93490/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#93848/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#86198/i.test(row)));
  assert.ok(EXPECTED.some((row) => /cache_control|system\[4\]|parallel/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /CLAUDE\.md|cache_control|messages\[0\]|474|703|system\[3\]/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("layer-unsealed"));
  assert.ok(FINGERPRINT_LINES.includes("stratum"));
  assert.equal(PHRASE, "Score stratum or admit shared.");
  assert.equal(SAMPLE_STRATUM_PROOF.layerUnsealed, true);
  assert.equal(SAMPLE_STRATUM_PROOF.names.length, 6);
  assert.equal(seedCommon().seed, "common");
});

test("has-repro fingerprints encode the published stratum proof", () => {
  const result = handle(seedStratum());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "layer-unsealed");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedStratum()),
    /stratum\|kind=layer-unsealed\|ref=cache-miss\|path=layer-unsealed\|cue=layer-unsealed/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and contiguous/stationed/lasting", () => {
  const required = [
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

test("shared booth flips stratum back when the core admits shared", () => {
  const tape = {
    shared: true,
    stratum: false,
    layerUnsealed: false,
    cue: "shared",
  };
  assert.equal(scoreGate(tape).verdict, "shared");
  tape.shared = false;
  tape.stratum = true;
  tape.layerUnsealed = true;
  tape.cue = "stratum";
  assert.equal(scoreGate(tape).verdict, "stratum");
  tape.shared = true;
  tape.stratum = false;
  tape.layerUnsealed = false;
  tape.cue = "shared";
  assert.equal(scoreGate(tape).verdict, "shared");
});

test("inspectors and readBooth mark the stratum proof", () => {
  const cmd = inspectNoBreakpoint({ stratum: true });
  assert.equal(cmd.stamp, "no-breakpoint");
  const seal = inspectCacheMiss({ stratum: true, cacheMiss: true });
  assert.equal(seal.stamp, "cache-miss");
  assert.equal(seal.missed, true);
  const booth = readBooth({
    stratum: true,
    layerUnsealed: true,
    cacheMiss: true,
  });
  assert.equal(booth.stratum, true);
  assert.equal(booth.mark, "stratum");
  const open = readBooth({
    shared: true,
    stratum: false,
    layerUnsealed: false,
  });
  assert.equal(open.stratum, false);
  assert.equal(open.mark, "shared");
  assert.equal(inspectMessagesZero({ stratum: true, messagesZero: true }).stamp, "messages-zero");
  assert.equal(inspectProjectContext({ stratum: true, projectContext: true }).stamp, "project-context");
  assert.equal(inspectParallelShafts({ stratum: true, parallelShafts: true }).stamp, "parallel-shafts");
});

test("mapStratum encodes the published layer-unsealed", () => {
  const miss = mapStratum({ stratum: true, layerUnsealed: true });
  assert.equal(miss.stamp, "layer-unsealed");
  assert.equal(miss.holdingLane, "unsealed-plane");
  assert.equal(miss.ribbon, "stratum");
  const clear = mapStratum({ shared: true, stratum: false });
  assert.equal(clear.stamp, "field-stratigraphy");
  assert.equal(clear.kindLane, "system-bedrock");
  assert.equal(clear.holdingLane, "field-stratigraphy");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94400, 93490, 93848, 91151]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("tmesis"));
  assert.ok(NOT_PRODUCTS.includes("vedette"));
  assert.ok(NOT_PRODUCTS.includes("orloj"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94452);
  assert.equal(BACKUPS[9].issue, 94499);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94417));
  assert.ok(!COUSINS.some((row) => row.issue === 94417));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/stratum.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const sharedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/shared.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(sharedFix.status, 0, sharedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const sharedOut = JSON.parse(sharedFix.stdout);
  assert.equal(idleOut.verdict, "shared");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "stratum");
  assert.equal(seededOut.alarm, true);
  assert.equal(sharedOut.verdict, "shared");
  assert.equal(sharedOut.hold, true);
  assert.match(sharedOut.phrase, /admit shared/);
});

test("handle exposes published hypothesis and #94417 headline", () => {
  const result = handle(seedStratum());
  assert.equal(result.published.issue, 94417);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [94400, 93490, 93848, 91151]);
  assert.ok(result.published.backups.includes(94452));
  assert.ok(result.published.backups.includes(94499));
  assert.ok(!result.published.backups.includes(94417));
  assert.match(
    result.published.hypothesis,
    /messages\[0\]|cache_control|NON-BINDING|#94417/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94417/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 6);
});

test("model has no static node: imports so the shared page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("shared page is a core-sample desk, not parchment or lantern", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Sora|Sora/);
  assert.match(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /stratum|shared|layer-unsealed|system-bedrock|project-bed|unsealed-plane|field-stratigraphy/i,
  );
  assert.match(page, /#1E262C|#C67B28|#4A5964|#E4B25A|#101418|#8C3A16|#D8C4A0/i);
  assert.match(page, /\bshared\b/);
  assert.match(page, /\bstratum\b/);
  assert.match(page, /layer-unsealed/);
  assert.match(page, /Score stratum or admit shared/i);
  assert.match(page, /#382/);
  assert.match(page, /#94417/);
  assert.match(page, /Admit shared/);
  assert.match(page, /Score stratum/);
  assert.match(page, /Walk layer-unsealed/);
  assert.match(page, /Compare shared \/ stratum/);
  assert.match(page, /Pin idle shared/);
  assert.match(page, /Pin seeded stratum/);
  assert.match(page, /Pin layer-unsealed/);
  assert.match(page, /Stamp cache-miss/);
  assert.match(page, /Score booth/);
  assert.match(page, /stratum-score/);
  assert.match(
    page,
    /CLAUDE\.md|cache_control|messages\[0\]|system breakpoint|474|703/i,
  );
  assert.match(page, /system-bedrock|project-bed|unsealed-plane|session-overburden|parallel-shafts/i);
  assert.match(
    page,
    /<svg[\s\S]*class="system-bedrock"|class="project-bed"|class="unsealed-plane"|class="session-overburden"|class="parallel-shafts"/i,
  );
  assert.match(page, /body\.shared|body\.unsealed|body\.layer-unsealed/);
  assert.match(page, /evidence-table|messages\[0\]|system\[3\]|session uuid/i);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /family=Bebas\+Neue|Bebas Neue/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.doesNotMatch(page, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /#F4E8D0|#2C1B12|#C43C2C|#8B1E1E|#243B55|#C4A46A|#14100C/);
  assert.doesNotMatch(page, /#1B2A1E|#E0A84A|#D9C7A3|#B8332A|#0A100C/);
  assert.doesNotMatch(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /spliced parchment|editorial desk|iron-gall|vermillion splice/i);
  assert.doesNotMatch(page, /cavalry vedette|outpost lantern|picket-line|field olive/i);
  assert.doesNotMatch(page, /prague orloj|astronomical clock|zodiac dial|automaton tower/i);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /admit contiguous|Score tmesis|idle contiguous/i);
  assert.doesNotMatch(page, /admit stationed|Score vedette|idle stationed/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
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
  assert.match(page, /NOT Tmesis/i);
  assert.match(page, /NOT Vedette/i);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT #94400/i);
  assert.match(page, /NOT #93490/i);
  assert.match(page, /#94400/);
  assert.match(page, /#93490/);
  assert.match(page, /#93848/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Stratum/);
  assert.match(readme, /#94417/);
  assert.match(readme, /\bshared\b/);
  assert.match(readme, /\bstratum\b/);
  assert.match(readme, /layer-unsealed/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Sora/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Bebas Neue/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /CLAUDE\.md|cache_control|messages\[0\]|system breakpoint/i);
  assert.match(readme, /NOT #94400/);
  assert.match(readme, /NOT #93490/);
  assert.match(readme, /NOT #93848/);
  assert.match(readme, /NOT Cancellans\/#94400/);
  assert.match(readme, /NOT Cachet\/#93490/);
  assert.match(readme, /#94400/);
  assert.match(readme, /#93490/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/stratum/);
  assert.match(readme, /node --test projects\/stratum\/stratum\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /geology|core-sample|bedding-plane|field-stratigraphy/i);
  assert.match(readme, /Score stratum or admit shared/);
  assert.match(readme, /#94452|#94499/);
  assert.doesNotMatch(readme, /backup #94417|#94417 as next/);
  assert.match(readme, /22:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\btmesis\b/);
  assert.doesNotMatch(readme, /\bvedette\b/);
  assert.doesNotMatch(readme, /\borloj\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Stratum/);
  assert.match(runLog, /22:50/);
});

test("catalog features Stratum only; Tmesis unfeatured; product count 382", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 382);
  assert.equal(hub.products.length, 382);
  assert.equal(catalog.products[0].name, "Stratum");
  assert.equal(catalog.products[0].slug, "stratum");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/stratum/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bshared\b/);
  assert.match(catalog.products[0].summary, /\bstratum\b/);
  assert.match(catalog.products[0].summary, /layer-unsealed/);
  assert.match(catalog.products[0].summary, /Score stratum or admit shared/);
  assert.match(catalog.products[0].summary, /#94417/);
  assert.match(catalog.products[0].summary, /22:50/);
  assert.equal(hub.products[0].slug, "stratum");
  assert.equal(hub.products[0].featured, true);
  const tmesis = catalog.products.find((row) => row.slug === "tmesis");
  assert.ok(tmesis);
  assert.equal(tmesis.featured, false);
  const vedette = catalog.products.find((row) => row.slug === "vedette");
  assert.ok(vedette);
  assert.equal(vedette.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "stratum" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94417") && row.slug !== "stratum",
    ),
  );
});

test("vercel rewrites stratum to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/stratum");
  assert.equal(vercel.rewrites[0].destination, "/projects/stratum");
  assert.equal(vercel.rewrites[1].source, "/stratum/");
  assert.equal(vercel.rewrites[1].destination, "/projects/stratum");
  assert.equal(vercel.rewrites[2].source, "/stratum/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/stratum/:path*");
  assert.equal(vercel.rewrites[3].source, "/tmesis");
  assert.equal(vercel.rewrites[3].destination, "/projects/tmesis");
});

test("no leftover clone / parchment / lantern / clock content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk|outpost-lantern|picket-line|cavalry-vedette|spliced-parchment|editorial-desk|iron-gall/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock|outpost lantern|picket-line clock|spliced parchment/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
