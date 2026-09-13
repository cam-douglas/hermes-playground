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
  ORIEL_WALK,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_ORIEL_PROOF,
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
  inspectBay,
  inspectManuscript,
  inspectMargin,
  mapScope,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedEmptyMargin,
  seedHold,
  seedMaximised,
  seedOriel,
  seedPlanNoReflow,
  seedPopOut,
  seedProduct,
  seedReflowed,
} from "./oriel.mjs";

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
  return fileURLToPath(new URL("./oriel.mjs", import.meta.url));
}

test("idle reflowed is a hold; plan text uses available window width", () => {
  const result = analyze(seedReflowed());
  assert.equal(result.verdict, "reflowed");
  assert.equal(result.idleWord, "reflowed");
  assert.equal(IDLE_WORD, "reflowed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.reflowed, true);
  assert.equal(result.phrase, "admit reflowed");
  assert.equal(result.oriel, false);
  assert.equal(result.planNoReflow, false);
  assert.ok(HOLD_ALIASES.includes("reflowed"));
  assert.ok(HOLD_ALIASES.includes("spanned"));
  assert.ok(HOLD_ALIASES.includes("sashed"));
  assert.ok(HOLD_ALIASES.includes("bayed"));
  assert.ok(HOLD_ALIASES.includes("projected"));
  assert.ok(HOLD_ALIASES.includes("fenestrated"));
  assert.ok(HOLD_ALIASES.includes("width-fit"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify reflowed", () => {
  assert.equal(classify(emptyTicket()), "reflowed");
  assert.equal(classify(""), "reflowed");
  assert.equal(classify(null), "reflowed");
  assert.equal(decide({}), "reflowed");
});

test("#93809 seeded path scores oriel when the manuscript stays narrow", () => {
  const result = analyze(seedOriel());
  assert.equal(result.verdict, "oriel");
  assert.equal(result.seededWord, "oriel");
  assert.equal(SEEDED_WORD, "oriel");
  assert.equal(PRODUCT_WORD, "oriel");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.oriel, true);
  assert.equal(result.phrase, "score oriel");
  assert.equal(result.planNoReflow, true);
  assert.equal(result.emptyMargin, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("plan-no-reflow plus empty-margin is the #93809 oriel", () => {
  const manuscript = inspectManuscript({ oriel: true, planNoReflow: true });
  assert.equal(manuscript.stamp, "manuscript-fixed");
  assert.match(manuscript.text, /fixed-column/i);
  const scored = scoreGate({
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
    popOut: true,
    cue: "oriel",
  });
  assert.equal(scored.verdict, "oriel");
  assert.equal(scored.planNoReflow, true);
  const open = inspectBay({ reflowed: true, planNoReflow: false });
  assert.equal(open.stamp, "bay-sashed");
});

test("path word is plan-no-reflow; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "plan-no-reflow");
  const result = analyze(seedPlanNoReflow());
  assert.equal(result.verdict, "plan-no-reflow");
  assert.equal(result.pathWord, "plan-no-reflow");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "plan-no-reflow", preferSeed: true, oriel: true }),
    "plan-no-reflow",
  );
  assert.equal(classify(seedPopOut()), "pop-out");
});

test("HOLD includes reflowed / hold", () => {
  assert.ok(HOLD.includes("reflowed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: maximised, empty-margin, oriel", () => {
  assert.equal(classify(seedMaximised()), "maximised");
  assert.equal(classify(seedEmptyMargin()), "empty-margin");
  assert.equal(classify(seedProduct()), "oriel");
});

test("booth fixtures flip reflowed vs oriel vs plan-no-reflow", () => {
  const idle = scoreGate(seedReflowed());
  const seeded = scoreGate(seedOriel());
  const reflowed = readData("reflowed.json");
  const oriel = readData("oriel.json");
  const path = readData("plan-no-reflow.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "reflowed");
  assert.equal(seeded.verdict, "oriel");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedReflowed()), "reflowed");
  assert.equal(score(seedOriel()), "oriel");
  assert.equal(reflowed.planNoReflow, false);
  assert.equal(reflowed.reflowed, true);
  assert.equal(scoreGate(reflowed).verdict, "reflowed");
  assert.equal(oriel.planNoReflow, true);
  assert.equal(oriel.emptyMargin, true);
  assert.equal(oriel.popOut, true);
  assert.equal(classify(oriel), "oriel");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /reflowed|available window width|manuscript spans|sash/i);
  assert.match(path.paths[1].result, /empty|margin|fixed column|does not|reflow/i);
  assert.equal(classify(path), "plan-no-reflow");
  assert.equal(oriel.hubCount, "ORIEL");
  assert.equal(oriel.issue, 93809);
  assert.equal(oriel.oriel, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("spanned.json")), "spanned");
  assert.equal(classify(readData("sashed.json")), "sashed");
  assert.equal(classify(readData("bayed.json")), "bayed");
  assert.equal(classify(readData("projected.json")), "projected");
  assert.equal(classify(readData("fenestrated.json")), "fenestrated");
  assert.equal(classify(readData("width-fit.json")), "width-fit");
  assert.equal(classify(readData("fixed-column.json")), "fixed-column");
  assert.equal(classify(readData("empty-margin.json")), "empty-margin");
  assert.equal(classify(readData("pop-out.json")), "pop-out");
  assert.equal(classify(readData("maximised.json")), "maximised");
  assert.equal(classify(readData("macos-desktop.json")), "macos-desktop");
  assert.equal(classify(readData("plan-window.json")), "plan-window");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("reflowed"));
  assert.ok(CHIPS.includes("oriel"));
  assert.ok(CHIPS.includes("plan-no-reflow"));
  assert.ok(CHIPS.includes("pop-out"));
  assert.ok(CHIPS.includes("maximised"));
  assert.ok(CHIPS.includes("spanned"));
  assert.ok(CHIPS.includes("empty-margin"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("oriel"));
  assert.ok(ALARM.includes("plan-no-reflow"));
  assert.ok(ALARM.includes("pop-out"));
  assert.ok(ALARM.includes("empty-margin"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published oriel walk scores oriel after the idle hold", () => {
  const booth = scoreWalk({ rows: ORIEL_WALK });
  assert.equal(booth.verdict, "oriel");
  assert.ok(booth.orielCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-reflowed");
  assert.equal(idle.reflowed, true);
  assert.equal(idle.verdict, "reflowed");
  const cut = booth.rows.find((row) => row.event === "plan-no-reflow");
  assert.equal(cut.planNoReflow, true);
  const path = booth.rows.find((row) => row.event === "plan-no-reflow" && row.t === "path");
  assert.equal(path.verdict, "plan-no-reflow");
});

test("ORIEL_WALK constant matches the issue bay walk", () => {
  assert.equal(ORIEL_WALK[0].event, "cue-reflowed");
  const cut = ORIEL_WALK.find((row) => row.event === "plan-no-reflow");
  assert.equal(cut.planNoReflow, true);
  const path = ORIEL_WALK.find((row) => row.t === "path");
  assert.equal(path.oriel, true);
  const scoreRow = ORIEL_WALK.find((row) => row.event === "oriel");
  assert.equal(scoreRow.oriel, true);
});

test("positive control reflowed sash stays reflowed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "reflowed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "reflowed");
  const hold = walk.rows.find((row) => row.event === "cue-reflowed");
  assert.equal(hold.reflowed, true);
  assert.equal(hold.verdict, "reflowed");
});

test("issue constants encode only #93809 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93809);
  assert.ok(ISSUE_URL.includes("93809"));
  assert.match(TITLE, /Pop-out|maximised|reflow|window width|#62543/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Claude Desktop|macOS/);
  assert.equal(BUILD, "2.1.268");
  assert.equal(SURFACE, "macos-desktop-plan-pop-out");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:ui",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(EXPECTED.some((row) => /reflow|available window width/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.268|pop-out|maximised|empty margin|#62543|#57749/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("plan-no-reflow"));
  assert.ok(FINGERPRINT_LINES.includes("oriel"));
  assert.equal(PHRASE, "Score oriel or admit reflowed.");
  assert.equal(SAMPLE_ORIEL_PROOF.planNoReflow, true);
});

test("has-repro fingerprints encode the published oriel proof", () => {
  const result = handle(seedOriel());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "macos-desktop-plan-pop-out");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedOriel()),
    /oriel\|bay=projected\|ms=fixed-column\|margin=empty\|path=plan-no-reflow\|cue=plan-no-reflow/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes articulate/anarthria and recent catalog words", () => {
  const required = [
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
    "store-slug-collide",
    "unitary",
    "tessellated",
    "tessera",
    "version-path-tcc",
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "as-penned",
    "stet",
    "rubric",
    "galley",
    "quoin",
    "casement",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("reflowed booth flips oriel back when the manuscript spans", () => {
  const tape = {
    reflowed: true,
    oriel: false,
    planNoReflow: false,
    cue: "reflowed",
  };
  assert.equal(scoreGate(tape).verdict, "reflowed");
  tape.reflowed = false;
  tape.oriel = true;
  tape.planNoReflow = true;
  tape.emptyMargin = true;
  tape.cue = "oriel";
  assert.equal(scoreGate(tape).verdict, "oriel");
  tape.reflowed = true;
  tape.oriel = false;
  tape.planNoReflow = false;
  tape.emptyMargin = false;
  tape.cue = "reflowed";
  assert.equal(scoreGate(tape).verdict, "reflowed");
});

test("bay, manuscript, margin, and readBooth mark the oriel proof", () => {
  const idle = inspectBay({
    reflowed: true,
  });
  assert.equal(idle.stamp, "bay-sashed");
  const manuscript = inspectManuscript({ oriel: true, fixedColumn: true });
  assert.equal(manuscript.stamp, "manuscript-fixed");
  assert.equal(manuscript.fixed, true);
  const margin = inspectMargin({ oriel: true, emptyMargin: true });
  assert.equal(margin.stamp, "margin-empty");
  const booth = readBooth({
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
  });
  assert.equal(booth.oriel, true);
  assert.equal(booth.mark, "oriel");
  const open = readBooth({
    reflowed: true,
    oriel: false,
    planNoReflow: false,
  });
  assert.equal(open.oriel, false);
  assert.equal(open.mark, "reflowed");
});

test("mapScope encodes the published fixed column", () => {
  const miss = mapScope({ oriel: true, planNoReflow: true });
  assert.equal(miss.stamp, "plan-no-reflow");
  assert.equal(miss.manuscriptLane, "fixed-column");
  assert.equal(miss.ribbon, "oriel");
  const clear = mapScope({ reflowed: true, oriel: false });
  assert.equal(clear.stamp, "reflowed-sash");
  assert.equal(clear.bayLane, "sashed");
  assert.equal(clear.manuscriptLane, "spanned");
});

test("inspectMargin encodes the empty right margin path", () => {
  const gap = inspectMargin({ oriel: true, emptyMargin: true });
  assert.equal(gap.stamp, "margin-empty");
  assert.equal(gap.empty, true);
  assert.match(gap.text, /empty/i);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 62543);
  assert.equal(COUSINS[1].issue, 57749);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("rubric"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[9].issue, 93957);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93809));
  assert.ok(!BACKUPS.some((row) => row.issue === 62543));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/oriel.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const reflowedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/reflowed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(reflowedFix.status, 0, reflowedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const reflowedOut = JSON.parse(reflowedFix.stdout);
  assert.equal(idleOut.verdict, "reflowed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "oriel");
  assert.equal(seededOut.alarm, true);
  assert.equal(reflowedOut.verdict, "reflowed");
  assert.equal(reflowedOut.hold, true);
  assert.match(reflowedOut.phrase, /admit reflowed/);
});

test("handle exposes published hypothesis and #93809 headline", () => {
  const result = handle(seedOriel());
  assert.equal(result.published.issue, 93809);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [62543, 57749]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93967));
  assert.ok(result.published.backups.includes(93957));
  assert.ok(!result.published.backups.includes(93809));
  assert.match(result.published.hypothesis, /max-width|narrow centered column|NON-BINDING|#93809/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93809/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Gothic / Tudor oriel bay-window booth, not voice-clinic or lockjaw", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /DM Sans|DM\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /oriel|reflowed|plan-no-reflow|mullion|leaded|sash|bay-window|manuscript/i);
  assert.match(page, /#5C584F|#F4EFE4|#1A1916|#C9953A|#3F6B58|#A85A4A/i);
  assert.match(page, /\breflowed\b/);
  assert.match(page, /\boriel\b/);
  assert.match(page, /plan-no-reflow/);
  assert.match(page, /Score oriel or admit reflowed/i);
  assert.match(page, /#62543|#57749|cousin/i);
  assert.match(page, /#336/);
  assert.match(page, /#93809/);
  assert.match(page, /Admit reflowed/);
  assert.match(page, /Score oriel/);
  assert.match(page, /Walk plan-no-reflow/);
  assert.match(page, /Compare reflowed \/ oriel/);
  assert.match(page, /Pin idle reflowed/);
  assert.match(page, /Pin seeded oriel/);
  assert.match(page, /Pin plan-no-reflow/);
  assert.match(page, /Span the manuscript/);
  assert.match(page, /pop-out|maximised|2\.1\.268|macOS Desktop|empty margin/i);
  assert.match(page, /mullion|leaded|sill|sash|bay|fenestrat/i);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /#2A6F6A/);
  assert.doesNotMatch(page, /#F7F3EB/);
  assert.doesNotMatch(page, /#1C1A17/);
  assert.doesNotMatch(page, /#C47A2C/);
  assert.doesNotMatch(page, /#A84B5B/);
  assert.doesNotMatch(page, /#F4F1EA/);
  assert.doesNotMatch(page, /#1A1F24/);
  assert.doesNotMatch(page, /#B33A3A/);
  assert.doesNotMatch(page, /#7A858F/);
  assert.doesNotMatch(page, /#C4922A/);
  assert.doesNotMatch(page, /#E8ECE8/);
  assert.doesNotMatch(page, /#F3EDE3/);
  assert.doesNotMatch(page, /#1E1A17/);
  assert.doesNotMatch(page, /#A84B5C/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#3E6B5A/);
  assert.doesNotMatch(page, /#FAF7F1/);
  assert.doesNotMatch(page, /#1A1520/);
  assert.doesNotMatch(page, /#F4ECDF/);
  assert.doesNotMatch(page, /#B83A2E/);
  assert.doesNotMatch(page, /#2F6F5E/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field|gleaner.s field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /compositor|foul-proof|geta-tofu|type case|rice-paper/i);
  assert.doesNotMatch(page, /privacy pane|limestone|mica grout|tesserae/i);
  assert.doesNotMatch(page, /fused ligature|manuscript crasis|store drawer/i);
  assert.doesNotMatch(page, /cavalry|dispatch-rider|headersHelper|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parchment scrape|rasure|CreationTime/i);
  assert.doesNotMatch(page, /intake board|foundling-home intake/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward|foundling wheel|brass name-token/i);
  assert.doesNotMatch(page, /B-H curve|remanence|ferrite charcoal/i);
  assert.doesNotMatch(page, /limber-hole|bilge drain|oak floor timbers/i);
  assert.doesNotMatch(page, /millimeter|woodworking|dovetail|mortise/i);
  assert.doesNotMatch(page, /enamel chair|forceps tray|trigeminal|lockjaw|jaw clamp/i);
  assert.doesNotMatch(page, /laryngoscope|voice-strip|glottis|phonat/i);
  assert.doesNotMatch(page, /swift_addon|addNotificationRequest|UNUserNotification/i);
  assert.doesNotMatch(page, /\blimber\b/);
  assert.doesNotMatch(page, /\btrismus\b/);
  assert.doesNotMatch(page, /notif-xpc-deadlock/);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
  assert.doesNotMatch(page, /\bverbatim\b/);
  assert.doesNotMatch(page, /\bmojibaked\b/);
  assert.doesNotMatch(page, /fffd-spall/);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd/);
  assert.doesNotMatch(page, /\bvested\b/);
  assert.doesNotMatch(page, /\bunseised\b/);
  assert.doesNotMatch(page, /preview-eperm/);
  assert.doesNotMatch(page, /\bunitary\b/);
  assert.doesNotMatch(page, /\btessellated\b/);
  assert.doesNotMatch(page, /version-path-tcc/);
  assert.doesNotMatch(page, /\binjective\b/);
  assert.doesNotMatch(page, /\bcrased\b/);
  assert.doesNotMatch(page, /store-slug-collide/);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\bfiliated\b/);
  assert.doesNotMatch(page, /\bfoundling\b/);
  assert.doesNotMatch(page, /subagent-bash-outlive/);
  assert.doesNotMatch(page, /\barticulate\b/);
  assert.doesNotMatch(page, /\banarthria\b/);
  assert.doesNotMatch(page, /dictation-paste-drop/);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Rubric/i);
  assert.match(page, /NOT Galley/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Oriel/);
  assert.match(readme, /#93809/);
  assert.match(readme, /\breflowed\b/);
  assert.match(readme, /\boriel\b/);
  assert.match(readme, /plan-no-reflow/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Anarthria/i);
  assert.match(readme, /NOT Trismus/i);
  assert.match(readme, /NOT Foundling/i);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Rubric/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /pop-out|maximised|2\.1\.268|macOS Desktop|empty margin/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/oriel/);
  assert.match(readme, /node --test projects\/oriel\/oriel\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /oriel|bay-window|mullion|leaded|sash/i);
  assert.match(readme, /Score oriel or admit reflowed/);
  assert.match(readme, /#62543/);
  assert.match(readme, /#57749/);
  assert.match(readme, /#93772|#93770|#93777|#93821|#93811|#93924|#93925|#93954|#93967|#93957/);
  assert.match(readme, /19:50/);
  assert.match(readme, /Do NOT implement a fix/i);
});

test("catalog features Oriel only; Anarthria unfeatured; product count 336", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 336);
  assert.equal(hub.products.length, 336);
  assert.equal(catalog.products[0].name, "Oriel");
  assert.equal(catalog.products[0].slug, "oriel");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/oriel/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /19:50 oriel|#93809|bay-window|reflowed|plan-no-reflow/i);
  assert.match(catalog.products[0].summary, /\breflowed\b/);
  assert.match(catalog.products[0].summary, /\boriel\b/);
  assert.match(catalog.products[0].summary, /plan-no-reflow/);
  assert.match(catalog.products[0].summary, /Score oriel or admit reflowed/);
  assert.equal(hub.products[0].slug, "oriel");
  assert.equal(hub.products[0].featured, true);
  const anarthria = catalog.products.find((row) => row.slug === "anarthria");
  assert.ok(anarthria);
  assert.equal(anarthria.featured, false);
  const trismus = catalog.products.find((row) => row.slug === "trismus");
  assert.ok(trismus);
  assert.equal(trismus.featured, false);
  const foundling = catalog.products.find((row) => row.slug === "foundling");
  assert.ok(foundling);
  assert.equal(foundling.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "oriel").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93809") && row.slug !== "oriel"));
});

test("vercel rewrites oriel to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/oriel");
  assert.equal(vercel.rewrites[0].destination, "/projects/oriel");
  assert.equal(vercel.rewrites[1].source, "/oriel/");
  assert.equal(vercel.rewrites[1].destination, "/projects/oriel");
  assert.equal(vercel.rewrites[2].source, "/oriel/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/oriel/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
