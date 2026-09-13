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
  COUSINS,
  PHOSPHENE_WALK,
  DISTRIBUTION,
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
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_PHOSPHENE_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCpu,
  inspectField,
  inspectLayer,
  mapPerimetry,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedPrepareLayer0,
  seedPhosphene,
  seedQuiescent,
  seedHold,
  seedLayerTreeWalk,
  seedProduct,
  seedCaPrepare,
} from "./phosphene.mjs";

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
  return fileURLToPath(new URL("./phosphene.mjs", import.meta.url));
}

test("idle quiescent is a hold; WindowServer cooled 3-6%", () => {
  const result = analyze(seedQuiescent());
  assert.equal(result.verdict, "quiescent");
  assert.equal(result.idleWord, "quiescent");
  assert.equal(IDLE_WORD, "quiescent");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.quiescent, true);
  assert.equal(result.phrase, "admit quiescent");
  assert.equal(result.phosphene, false);
  assert.equal(result.layerTreeWalk, false);
  assert.ok(HOLD_ALIASES.includes("quiescent"));
  assert.ok(HOLD_ALIASES.includes("cooled"));
  assert.ok(HOLD_ALIASES.includes("steady-frame"));
  assert.ok(HOLD_ALIASES.includes("idle-ws"));
  assert.ok(HOLD_ALIASES.includes("no-rewalk"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify quiescent", () => {
  assert.equal(classify(emptyTicket()), "quiescent");
  assert.equal(classify(""), "quiescent");
  assert.equal(classify(null), "quiescent");
  assert.equal(decide({}), "quiescent");
});

test("#94003 seeded path scores phosphene when WindowServer re-walks", () => {
  const result = analyze(seedPhosphene());
  assert.equal(result.verdict, "phosphene");
  assert.equal(result.seededWord, "phosphene");
  assert.equal(SEEDED_WORD, "phosphene");
  assert.equal(PRODUCT_WORD, "phosphene");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.phosphene, true);
  assert.equal(result.phrase, "score phosphene");
  assert.equal(result.layerTreeWalk, true);
  assert.equal(result.caPrepare, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark flashing field and prepare_layer0", () => {
  const field = inspectField({ phosphene: true, layerTreeWalk: true });
  assert.equal(field.stamp, "field-flashing");
  assert.equal(field.flashing, true);
  const layer = inspectLayer({ phosphene: true, prepareLayer0: true });
  assert.equal(layer.stamp, "prepare-layer0");
  assert.equal(layer.depth, 50);
  const cpu = inspectCpu({ phosphene: true, windowserver47: true });
  assert.equal(cpu.stamp, "windowserver-47");
  const scored = scoreGate({
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    prepareLayer0: true,
    cue: "phosphene",
  });
  assert.equal(scored.verdict, "phosphene");
  const open = inspectField({ quiescent: true, phosphene: false });
  assert.equal(open.stamp, "field-cooled");
});

test("path word is layer-tree-walk; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "layer-tree-walk");
  const result = analyze(seedLayerTreeWalk());
  assert.equal(result.verdict, "layer-tree-walk");
  assert.equal(result.pathWord, "layer-tree-walk");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "layer-tree-walk", preferSeed: true, phosphene: true }),
    "layer-tree-walk",
  );
  assert.equal(classify(seedCaPrepare()), "ca-prepare");
});

test("HOLD includes quiescent / hold", () => {
  assert.ok(HOLD.includes("quiescent"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: ca-prepare, prepare-layer0, phosphene", () => {
  assert.equal(classify(seedCaPrepare()), "ca-prepare");
  assert.equal(classify(seedPrepareLayer0()), "prepare-layer0");
  assert.equal(classify(seedProduct()), "phosphene");
});

test("booth fixtures flip quiescent vs phosphene vs layer-tree-walk", () => {
  const idle = scoreGate(seedQuiescent());
  const seeded = scoreGate(seedPhosphene());
  const quiescent = readData("quiescent.json");
  const phosphene = readData("phosphene.json");
  const path = readData("layer-tree-walk.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "quiescent");
  assert.equal(seeded.verdict, "phosphene");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedQuiescent()), "quiescent");
  assert.equal(score(seedPhosphene()), "phosphene");
  assert.equal(quiescent.layerTreeWalk, false);
  assert.equal(quiescent.quiescent, true);
  assert.equal(scoreGate(quiescent).verdict, "quiescent");
  assert.equal(phosphene.layerTreeWalk, true);
  assert.equal(phosphene.caPrepare, true);
  assert.equal(phosphene.prepareLayer0, true);
  assert.equal(classify(phosphene), "phosphene");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /quiescent|cooled|steady-frame|idle-ws|no-rewalk/i);
  assert.match(path.paths[1].result, /47%|50|120 Hz|prepare_layer0|WindowServer/i);
  assert.equal(classify(path), "layer-tree-walk");
  assert.equal(phosphene.hubCount, "PHOSPHENE");
  assert.equal(phosphene.issue, 94003);
  assert.equal(phosphene.phosphene, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("cooled.json")), "cooled");
  assert.equal(classify(readData("steady-frame.json")), "steady-frame");
  assert.equal(classify(readData("idle-ws.json")), "idle-ws");
  assert.equal(classify(readData("no-rewalk.json")), "no-rewalk");
  assert.equal(classify(readData("ca-prepare.json")), "ca-prepare");
  assert.equal(classify(readData("prepare-layer0.json")), "prepare-layer0");
  assert.equal(classify(readData("windowserver-47.json")), "windowserver-47");
  assert.equal(classify(readData("layer-depth-50.json")), "layer-depth-50");
  assert.equal(classify(readData("refresh-120.json")), "refresh-120");
  assert.equal(classify(readData("streaming-cpu.json")), "streaming-cpu");
  assert.equal(classify(readData("idle-cpu.json")), "idle-cpu");
  assert.equal(classify(readData("liquid-xdr.json")), "liquid-xdr");
  assert.equal(classify(readData("m3-pro.json")), "m3-pro");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("quiescent"));
  assert.ok(CHIPS.includes("phosphene"));
  assert.ok(CHIPS.includes("layer-tree-walk"));
  assert.ok(CHIPS.includes("ca-prepare"));
  assert.ok(CHIPS.includes("prepare-layer0"));
  assert.ok(CHIPS.includes("cooled"));
  assert.ok(CHIPS.includes("steady-frame"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("phosphene"));
  assert.ok(ALARM.includes("layer-tree-walk"));
  assert.ok(ALARM.includes("ca-prepare"));
  assert.ok(ALARM.includes("prepare-layer0"));
  assert.ok(ALARM.includes("windowserver-47"));
  assert.ok(ALARM.includes("layer-depth-50"));
  assert.ok(ALARM.includes("refresh-120"));
  assert.ok(ALARM.includes("streaming-cpu"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published phosphene walk scores phosphene after the idle hold", () => {
  const booth = scoreWalk({ rows: PHOSPHENE_WALK });
  assert.equal(booth.verdict, "phosphene");
  assert.ok(booth.phospheneCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-quiescent");
  assert.equal(idle.quiescent, true);
  assert.equal(idle.verdict, "quiescent");
  const cut = booth.rows.find((row) => row.event === "layer-tree-walk");
  assert.equal(cut.layerTreeWalk, true);
  const path = booth.rows.find((row) => row.event === "layer-tree-walk" && row.t === "path");
  assert.equal(path.verdict, "layer-tree-walk");
});

test("PHOSPHENE_WALK constant matches the issue clinic walk", () => {
  assert.equal(PHOSPHENE_WALK[0].event, "cue-quiescent");
  const cut = PHOSPHENE_WALK.find((row) => row.event === "layer-tree-walk");
  assert.equal(cut.layerTreeWalk, true);
  const path = PHOSPHENE_WALK.find((row) => row.t === "path");
  assert.equal(path.phosphene, true);
  const scoreRow = PHOSPHENE_WALK.find((row) => row.event === "phosphene");
  assert.equal(scoreRow.phosphene, true);
});

test("positive control quiescent field stays quiescent", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "quiescent");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "quiescent");
  const hold = walk.rows.find((row) => row.event === "cue-quiescent");
  assert.equal(hold.quiescent, true);
  assert.equal(hold.verdict, "quiescent");
});

test("issue constants encode only #94003 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94003);
  assert.ok(ISSUE_URL.includes("94003"));
  assert.match(TITLE, /WindowServer|47%|CoreAnimation|120 Hz/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Claude Desktop/);
  assert.equal(BUILD, "1.52386.3");
  assert.equal(SURFACE, "layer-tree-walk");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:macos", "performance", "area:desktop"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Parablepsis|#93954/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Demesne|#93989/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Scotoma|#93744/i.test(row)));
  assert.ok(EXPECTED.some((row) => /3-6%|47%|50-level|120 Hz|prepare_layer0/i.test(row)));
  assert.match(DISTRIBUTION, /1\.52386\.3|26\.6\.2|M3 Pro|1512x982|120 Hz|47%|3-6%|50/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("layer-tree-walk"));
  assert.ok(FINGERPRINT_LINES.includes("phosphene"));
  assert.equal(PHRASE, "Score phosphene or admit quiescent.");
  assert.equal(SAMPLE_PHOSPHENE_PROOF.layerTreeWalk, true);
});

test("has-repro fingerprints encode the published phosphene proof", () => {
  const result = handle(seedPhosphene());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "layer-tree-walk");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedPhosphene()),
    /phosphene\|kind=layer-tree-walk\|cpu=47\|path=layer-tree-walk\|cue=layer-tree-walk/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes diplomatic/demesned and recent catalog words", () => {
  const required = [
    "diplomatic",
    "parablepsis",
    "latin1-edit-wipe",
    "demesned",
    "demesne",
    "home-bind-overreach",
    "diagrammed",
    "cartouche",
    "section-poster",
    "unattainted",
    "attaint",
    "session-attainder",
    "reflowed",
    "oriel",
    "plan-no-reflow",
    "articulate",
    "anarthria",
    "dictation-paste-drop",
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "injective",
    "crased",
    "crasis",
    "unitary",
    "tessellated",
    "verbatim",
    "mojibaked",
    "afterimage",
    "scotoma",
    "followspot",
    "thrash",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("quiescent booth flips phosphene back when the field is cooled", () => {
  const tape = {
    quiescent: true,
    phosphene: false,
    layerTreeWalk: false,
    cue: "quiescent",
  };
  assert.equal(scoreGate(tape).verdict, "quiescent");
  tape.quiescent = false;
  tape.phosphene = true;
  tape.layerTreeWalk = true;
  tape.caPrepare = true;
  tape.cue = "phosphene";
  assert.equal(scoreGate(tape).verdict, "phosphene");
  tape.quiescent = true;
  tape.phosphene = false;
  tape.layerTreeWalk = false;
  tape.caPrepare = false;
  tape.cue = "quiescent";
  assert.equal(scoreGate(tape).verdict, "quiescent");
});

test("field, layer, cpu, and readBooth mark the phosphene proof", () => {
  const idle = inspectField({
    quiescent: true,
  });
  assert.equal(idle.stamp, "field-cooled");
  const layer = inspectLayer({ phosphene: true, prepareLayer0: true });
  assert.equal(layer.stamp, "prepare-layer0");
  assert.equal(layer.depth, 50);
  const cpu = inspectCpu({ phosphene: true, windowserver47: true });
  assert.equal(cpu.stamp, "windowserver-47");
  const booth = readBooth({
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
  });
  assert.equal(booth.phosphene, true);
  assert.equal(booth.mark, "phosphene");
  const open = readBooth({
    quiescent: true,
    phosphene: false,
    layerTreeWalk: false,
  });
  assert.equal(open.phosphene, false);
  assert.equal(open.mark, "quiescent");
});

test("mapPerimetry encodes the published flashing field", () => {
  const miss = mapPerimetry({ phosphene: true, layerTreeWalk: true });
  assert.equal(miss.stamp, "layer-tree-walk");
  assert.equal(miss.holdingLane, "flashing");
  assert.equal(miss.ribbon, "phosphene");
  const clear = mapPerimetry({ quiescent: true, phosphene: false });
  assert.equal(clear.stamp, "quiescent-field");
  assert.equal(clear.kindLane, "steady-frame");
  assert.equal(clear.holdingLane, "cooled");
});

test("cousins cite #93811 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 93811);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("thrash"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93996);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94003));
  assert.ok(!BACKUPS.some((row) => row.issue === 93811));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/phosphene.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const quiescentFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/quiescent.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(quiescentFix.status, 0, quiescentFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const quiescentOut = JSON.parse(quiescentFix.stdout);
  assert.equal(idleOut.verdict, "quiescent");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "phosphene");
  assert.equal(seededOut.alarm, true);
  assert.equal(quiescentOut.verdict, "quiescent");
  assert.equal(quiescentOut.hold, true);
  assert.match(quiescentOut.phrase, /admit quiescent/);
});

test("handle exposes published hypothesis and #94003 headline", () => {
  const result = handle(seedPhosphene());
  assert.equal(result.published.issue, 94003);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93811]);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93996));
  assert.ok(!result.published.backups.includes(94003));
  assert.match(result.published.hypothesis, /Electron|prepare_layer0|NON-BINDING|#94003/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94003/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an entoptic clinic booth, not collation desk or manor", () => {
  const page = readPage();
  assert.match(page, /family=Syne|Syne/);
  assert.match(page, /family=Sora|Sora/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(page, /phosphene|quiescent|layer-tree-walk|entoptic|vitreous|visual-field/i);
  assert.match(page, /#12151C|#8B7CFF|#E8FF6A|#F4F1EA|#1F6F6A|#4A5568/i);
  assert.match(page, /\bquiescent\b/);
  assert.match(page, /\bphosphene\b/);
  assert.match(page, /layer-tree-walk/);
  assert.match(page, /Score phosphene or admit quiescent/i);
  assert.match(page, /#341/);
  assert.match(page, /#94003/);
  assert.match(page, /Admit quiescent/);
  assert.match(page, /Score phosphene/);
  assert.match(page, /Walk layer-tree-walk/);
  assert.match(page, /Compare quiescent \/ phosphene/);
  assert.match(page, /Pin idle quiescent/);
  assert.match(page, /Pin seeded phosphene/);
  assert.match(page, /Pin layer-tree-walk/);
  assert.match(page, /Chart the field/);
  assert.match(page, /Score booth/);
  assert.match(page, /phosphene-score/);
  assert.match(page, /WindowServer|47%|50|120 Hz|prepare_layer0|1\.52386\.3/i);
  assert.match(page, /entoptic|vitreous|isopter|sclera|iris|phosphene/i);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.doesNotMatch(page, /Epilogue/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Instrument Serif|Instrument\+Serif/);
  assert.doesNotMatch(page, /Plus Jakarta|Plus\+Jakarta/);
  assert.doesNotMatch(page, /#E2E6EC/);
  assert.doesNotMatch(page, /#1F2B4D/);
  assert.doesNotMatch(page, /#7C2434/);
  assert.doesNotMatch(page, /#B8944A/);
  assert.doesNotMatch(page, /#E4D5B5/);
  assert.doesNotMatch(page, /#1A4A36/);
  assert.doesNotMatch(page, /#4A3018/);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Parablepsis/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Thrash/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Phosphene/);
  assert.match(readme, /#94003/);
  assert.match(readme, /\bquiescent\b/);
  assert.match(readme, /\bphosphene\b/);
  assert.match(readme, /layer-tree-walk/);
  assert.match(readme, /Syne/);
  assert.match(readme, /Sora/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /UnifrakturMaguntia/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /WINDOWSERVER CA LAYER-TREE THRASH/i);
  assert.match(readme, /NOT Parablepsis\/#93954/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Cartouche\/#93772/);
  assert.match(readme, /NOT Attaint\/#93821/);
  assert.match(readme, /NOT Oriel\/#93809/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Trismus\/#93823/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /#93811/);
  assert.match(readme, /WindowServer|47%|50|120 Hz|1\.52386\.3|M3 Pro/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/phosphene/);
  assert.match(readme, /node --test projects\/phosphene\/phosphene\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /entoptic|vitreous|visual-field|ophthalmolog/i);
  assert.match(readme, /Score phosphene or admit quiescent/);
  assert.match(readme, /#93770|#93777|#93924|#93925|#93967|#93957|#93987|#93996/);
  assert.match(readme, /00:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Phosphene/);
  assert.match(runLog, /00:50/);
});

test("catalog features Phosphene only; Parablepsis unfeatured; product count 341", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 341);
  assert.equal(hub.products.length, 341);
  assert.equal(catalog.products[0].name, "Phosphene");
  assert.equal(catalog.products[0].slug, "phosphene");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/phosphene/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "00:50 phosphene: an ophthalmology / entoptic / visual-field booth for #94003. While a response streams, WindowServer re-walks a ~50-level CoreAnimation tree at 120 Hz (~47% CPU; idle 3-6%). Idle quiescent / seeded phosphene / path layer-tree-walk. Score phosphene or admit quiescent.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bquiescent\b/);
  assert.match(catalog.products[0].summary, /\bphosphene\b/);
  assert.match(catalog.products[0].summary, /layer-tree-walk/);
  assert.match(catalog.products[0].summary, /Score phosphene or admit quiescent/);
  assert.equal(hub.products[0].slug, "phosphene");
  assert.equal(hub.products[0].featured, true);
  const parablepsis = catalog.products.find((row) => row.slug === "parablepsis");
  assert.ok(parablepsis);
  assert.equal(parablepsis.featured, false);
  const demesne = catalog.products.find((row) => row.slug === "demesne");
  assert.ok(demesne);
  assert.equal(demesne.featured, false);
  const cartouche = catalog.products.find((row) => row.slug === "cartouche");
  assert.ok(cartouche);
  assert.equal(cartouche.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "phosphene").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94003") && row.slug !== "phosphene"));
});

test("vercel rewrites phosphene to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/phosphene");
  assert.equal(vercel.rewrites[0].destination, "/projects/phosphene");
  assert.equal(vercel.rewrites[1].source, "/phosphene/");
  assert.equal(vercel.rewrites[1].destination, "/projects/phosphene");
  assert.equal(vercel.rewrites[2].source, "/phosphene/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/phosphene/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
