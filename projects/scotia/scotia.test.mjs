import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  SCOTIA_WALK,
  CHIPS,
  CLAUDE_VERSION,
  COMMAND,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_SCOTIATED_ATELIER,
  SAMPLE_VTE,
  SAMPLE_DECSTBM,
  SAMPLE_BLANK_BAND,
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
  inspectVteScroll,
  inspectTenguGate,
  inspectBlankBand,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedScotia,
  seedScotiated,
  seedFlush,
  seedHold,
  seedVteScroll,
  seedTenguMarlinPorch,
  seedDecstbmUndershoot,
  seedBlankBand,
} from "./scotia.mjs";

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
  return fileURLToPath(new URL("./scotia.mjs", import.meta.url));
}

test("idle flush is a hold; bottom block stays on the last row", () => {
  const result = analyze(seedFlush());
  assert.equal(result.verdict, "flush");
  assert.equal(result.idleWord, "flush");
  assert.equal(IDLE_WORD, "flush");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flush, true);
  assert.equal(result.phrase, "admit flush");
  assert.equal(result.scotiated, false);
  assert.equal(result.decstbmUndershoot, false);
  assert.ok(HOLD_ALIASES.includes("flush"));
  assert.ok(HOLD_ALIASES.includes("seated"));
  assert.ok(HOLD_ALIASES.includes("last-row"));
  assert.ok(HOLD_ALIASES.includes("mac-flush"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify flush", () => {
  assert.equal(classify(emptyTicket()), "flush");
  assert.equal(classify(""), "flush");
  assert.equal(classify(null), "flush");
  assert.equal(decide({}), "flush");
});

test("#93764 seeded path scores scotia when DECSTBM leaves a hollow gap", () => {
  const result = analyze(seedScotiated());
  assert.equal(result.verdict, "scotia");
  assert.equal(result.seededWord, "scotiated");
  assert.equal(SEEDED_WORD, "scotiated");
  assert.equal(PRODUCT_WORD, "scotia");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scotiated, true);
  assert.equal(result.phrase, "score scotia");
  assert.equal(result.decstbmUndershoot, true);
  assert.equal(result.blankBand, true);
  assert.equal(result.vteScroll, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("blank band plus VTE scroll is the #93764 scotia", () => {
  const band = inspectBlankBand({ scotiated: true, blankBand: true });
  assert.equal(band.stamp, "blank-band");
  assert.equal(band.underBottomBlock, true);
  const scored = scoreGate({
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    vteScroll: true,
    tenguMarlinPorch: true,
    cue: "scotiated",
    band: SAMPLE_BLANK_BAND,
    vte: SAMPLE_VTE,
    region: SAMPLE_DECSTBM,
  });
  assert.equal(scored.verdict, "scotia");
  assert.equal(scored.decstbmUndershoot, true);
  const open = inspectBlankBand({ flush: true, blankBand: false });
  assert.equal(open.stamp, "last-row");
});

test("path word is decstbm-undershoot; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "decstbm-undershoot");
  const result = analyze(seedDecstbmUndershoot());
  assert.equal(result.verdict, "decstbm-undershoot");
  assert.equal(result.pathWord, "decstbm-undershoot");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "decstbm-undershoot", preferSeed: true, scotiated: true }),
    "decstbm-undershoot",
  );
  assert.equal(classify(seedBlankBand()), "blank-band");
});

test("HOLD includes flush / hold", () => {
  assert.ok(HOLD.includes("flush"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: blank-band, vte-scroll, tengu-marlin-porch", () => {
  assert.equal(classify(seedBlankBand()), "blank-band");
  assert.equal(classify(seedVteScroll()), "vte-scroll");
  assert.equal(classify(seedTenguMarlinPorch()), "tengu-marlin-porch");
  assert.equal(classify(seedScotia()), "scotia");
});

test("booth fixtures flip flush vs scotiated vs decstbm-undershoot vs scotia", () => {
  const idle = scoreGate(seedFlush());
  const seeded = scoreGate(seedScotiated());
  const flush = readData("flush.json");
  const scotiated = readData("scotiated.json");
  const path = readData("decstbm-undershoot.json");
  const product = readData("scotia.json");
  const band = readData("blank-band.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "flush");
  assert.equal(seeded.verdict, "scotia");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFlush()), "flush");
  assert.equal(score(seedScotiated()), "scotia");
  assert.equal(flush.blankBand, false);
  assert.equal(flush.flush, true);
  assert.equal(scoreGate(flush).verdict, "flush");
  assert.equal(scotiated.decstbmUndershoot, true);
  assert.equal(scotiated.blankBand, true);
  assert.equal(scotiated.vteScroll, true);
  assert.equal(classify(scotiated), "scotiated");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /last row|bottom block|flush|hollow/i);
  assert.match(path.paths[1].result, /DECSTBM|blank|VTE|undershoot/i);
  assert.equal(classify(path), "decstbm-undershoot");
  assert.equal(classify(product), "scotia");
  assert.equal(product.hubCount, "SCOTIA");
  assert.equal(scotiated.issue, 93764);
  assert.equal(scotiated.scotiated, true);
  assert.equal(classify(band), "blank-band");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("vte-scroll.json")), "vte-scroll");
  assert.equal(classify(readData("tengu-marlin-porch.json")), "tengu-marlin-porch");
  assert.equal(classify(readData("seated.json")), "seated");
  assert.equal(classify(readData("last-row.json")), "last-row");
  assert.equal(classify(readData("mac-flush.json")), "mac-flush");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("flush"));
  assert.ok(CHIPS.includes("scotiated"));
  assert.ok(CHIPS.includes("scotia"));
  assert.ok(CHIPS.includes("decstbm-undershoot"));
  assert.ok(CHIPS.includes("blank-band"));
  assert.ok(CHIPS.includes("vte-scroll"));
  assert.ok(CHIPS.includes("tengu-marlin-porch"));
  assert.ok(CHIPS.includes("seated"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("scotiated"));
  assert.ok(ALARM.includes("decstbm-undershoot"));
  assert.ok(ALARM.includes("blank-band"));
  assert.ok(ALARM.includes("scotia"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published scotia walk scores scotia after the idle hold", () => {
  const booth = scoreWalk({ rows: SCOTIA_WALK });
  assert.equal(booth.verdict, "scotia");
  assert.ok(booth.scotiatedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-flush");
  assert.equal(idle.flush, true);
  assert.equal(idle.verdict, "flush");
  const band = booth.rows.find((row) => row.event === "blank-band");
  assert.equal(band.blankBand, true);
  const path = booth.rows.find((row) => row.event === "decstbm-undershoot" && row.t === "path");
  assert.equal(path.verdict, "decstbm-undershoot");
});

test("SCOTIA_WALK constant matches the issue atelier walk", () => {
  assert.equal(SCOTIA_WALK[0].event, "cue-flush");
  const band = SCOTIA_WALK.find((row) => row.event === "blank-band");
  assert.equal(band.blankBand, true);
  const path = SCOTIA_WALK.find((row) => row.t === "path");
  assert.equal(path.scotiated, true);
  const scoreRow = SCOTIA_WALK.find((row) => row.event === "scotia");
  assert.equal(scoreRow.scotiated, true);
});

test("positive control seated last-row stays flush", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "flush");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "flush");
  const hold = walk.rows.find((row) => row.event === "cue-flush");
  assert.equal(hold.flush, true);
  assert.equal(hold.verdict, "flush");
});

test("issue constants encode only #93764 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93764);
  assert.ok(ISSUE_URL.includes("93764"));
  assert.match(TITLE, /DECSTBM|blank rows|Linux|VTE|Black Box/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux");
  assert.match(CLAUDE_VERSION, /2\.1\.267/);
  assert.match(GOOD_VERSION, /macOS|2\.1\.268|last row|kitty|iTerm/i);
  assert.equal(SURFACE, "tui-decstbm");
  assert.equal(HOST, "linux-vte");
  assert.match(INSTALL_PATH, /Linux|xterm-256color|tmux/i);
  assert.match(COMMAND, /blank|bottom block|conversation/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:linux",
    "area:tui",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /padding|plain shell/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /statusLine/i.test(row)));
  assert.ok(EXPECTED.some((row) => /last row|default renderer|flush/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.267|VTE\(8401\)|DECSTBM|tengu_marlin_porch|Black Box|2–3|2-3/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("decstbm-undershoot"));
  assert.ok(FINGERPRINT_LINES.includes("scotiated"));
  assert.equal(PHRASE, "Score scotia or admit flush.");
  assert.equal(SAMPLE_SCOTIATED_ATELIER.hollowGap, true);
  assert.equal(SAMPLE_BLANK_BAND.blankRows, 3);
  assert.equal(SAMPLE_VTE.xtversion, "VTE(8401)");
  assert.equal(SAMPLE_DECSTBM.tenguMarlinPorch, true);
});

test("has-repro fingerprints encode the published scotiated atelier", () => {
  const result = handle(seedScotiated());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "tui-decstbm");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedScotiated()),
    /scotia\|band=blank\|host=vte\|gate=tengu\|path=decstbm-undershoot\|cue=decstbm-undershoot/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Canard, Stet, Blindside, Interdict, Simplex", () => {
  const required = [
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd-mislabel",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "duplex",
    "simplexed",
    "simplex",
    "mobile-uplink-silent",
    "keyed",
    "deadkeyed",
    "deadkey",
    "esc-csi-dead",
    "gleaned",
    "orphaned",
    "gleaner",
    "unreaped-ampersand",
    "live",
    "schismed",
    "schism",
    "resume-while-live",
    "intact",
    "rasured",
    "rasure",
    "creation-time-flip",
    "swept",
    "ashpanned",
    "ashpan",
    "orphan-jsonl",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("flush booth flips scotiated back when the column stays seated", () => {
  const tape = {
    flush: true,
    scotiated: false,
    blankBand: false,
    cue: "flush",
  };
  assert.equal(scoreGate(tape).verdict, "flush");
  tape.flush = false;
  tape.scotiated = true;
  tape.decstbmUndershoot = true;
  tape.blankBand = true;
  tape.vteScroll = true;
  tape.cue = "scotiated";
  assert.equal(scoreGate(tape).verdict, "scotia");
  tape.flush = true;
  tape.scotiated = false;
  tape.decstbmUndershoot = false;
  tape.blankBand = false;
  tape.vteScroll = false;
  tape.cue = "flush";
  assert.equal(scoreGate(tape).verdict, "flush");
});

test("blank band, VTE, gate, and readBooth mark the scotiated atelier", () => {
  const idle = inspectBlankBand({
    flush: true,
    band: { blankRows: 0, underBottomBlock: false, foreverEmpty: false, seated: true },
  });
  assert.equal(idle.stamp, "last-row");
  const vte = inspectVteScroll({ scotiated: true, vte: SAMPLE_VTE });
  assert.equal(vte.stamp, "vte-scroll");
  assert.equal(vte.linux, true);
  const gate = inspectTenguGate({
    tenguMarlinPorch: true,
    region: SAMPLE_DECSTBM,
  });
  assert.equal(gate.stamp, "tengu-marlin-porch");
  const booth = readBooth({
    scotiated: true,
    blankBand: true,
    band: SAMPLE_BLANK_BAND,
    vte: SAMPLE_VTE,
    region: SAMPLE_DECSTBM,
  });
  assert.equal(booth.scotiated, true);
  assert.equal(booth.mark, "scotiated");
  const open = readBooth({
    flush: true,
    scotiated: false,
    blankBand: false,
  });
  assert.equal(open.scotiated, false);
  assert.equal(open.mark, "flush");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 4136);
  assert.equal(COUSINS[1].issue, 83660);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("sostenuto"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("tabula"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93754);
  assert.equal(BACKUPS[1].issue, 93744);
  assert.equal(BACKUPS[2].issue, 93782);
  assert.equal(BACKUPS[3].issue, 93821);
  assert.equal(BACKUPS[4].issue, 93811);
  assert.equal(BACKUPS[5].issue, 93809);
  assert.equal(BACKUPS[6].issue, 93751);
  assert.equal(BACKUPS[7].issue, 93772);
  assert.equal(BACKUPS[8].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93777);
  assert.equal(BACKUPS[10].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93764));
  assert.ok(!BACKUPS.some((row) => row.issue === 93766));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scotiated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const flushFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/flush.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(flushFix.status, 0, flushFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const flushOut = JSON.parse(flushFix.stdout);
  assert.equal(idleOut.verdict, "flush");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "scotiated");
  assert.equal(seededOut.alarm, true);
  assert.equal(flushOut.verdict, "flush");
  assert.equal(flushOut.hold, true);
});

test("handle exposes published hypothesis and #93764 headline", () => {
  const result = handle(seedScotiated());
  assert.equal(result.published.issue, 93764);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [4136, 83660]);
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93821));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93764));
  assert.ok(!result.published.backups.includes(93766));
  assert.match(result.published.hypothesis, /DECSTBM|VTE|blank|undershoot|chrome/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93764/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a classical scotia / shadow-gap atelier, not canard or stet", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /scotia|flush|scotiated|decstbm-undershoot|shadow-gap|column|molding|DECSTBM|VTE/i);
  assert.match(page, /#D8D0C0|#1A1814|#C48A2A|#2F6F6A|#0E0D0B|#3F5C3A|#5A4E3A/i);
  assert.match(page, /\bflush\b/);
  assert.match(page, /\bscotiated\b/);
  assert.match(page, /decstbm-undershoot/);
  assert.match(page, /Score scotia or admit flush/i);
  assert.match(page, /#4136|#83660|cousin/i);
  assert.match(page, /#321/);
  assert.match(page, /#93764/);
  assert.match(page, /Admit flush/);
  assert.match(page, /Score scotia/);
  assert.match(page, /Walk decstbm-undershoot/);
  assert.match(page, /Compare flush \/ scotiated/);
  assert.match(page, /Pin idle flush/);
  assert.match(page, /Pin seeded scotiated/);
  assert.match(page, /Pin decstbm-undershoot/);
  assert.match(page, /Hold the flush/);
  assert.match(page, /DECSTBM|VTE\(8401\)|Black Box|2\.1\.267|tengu_marlin_porch|Linux/i);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /Roboto Mono|Roboto\+Mono/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Bebas Neue|Bebas\+Neue/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /#E4D4A4/);
  assert.doesNotMatch(page, /#8B241C/);
  assert.doesNotMatch(page, /#3E6F96/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#2B5EA7/);
  assert.doesNotMatch(page, /#B33A3A/);
  assert.doesNotMatch(page, /#0B1F14/);
  assert.doesNotMatch(page, /#F0A202/);
  assert.doesNotMatch(page, /#1A0B18/);
  assert.doesNotMatch(page, /#041018/);
  assert.doesNotMatch(page, /#4CFF9A/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd-mislabel/);
  assert.doesNotMatch(page, /\bstetted\b/);
  assert.doesNotMatch(page, /\brewound\b/);
  assert.doesNotMatch(page, /mic-resume-wipe/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bblindsided\b/);
  assert.doesNotMatch(page, /compare-ref-unreachable/);
  assert.doesNotMatch(page, /\bscoped\b/);
  assert.doesNotMatch(page, /\binterdicted\b/);
  assert.doesNotMatch(page, /chrome-prohibit-bleed/);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Scotia/);
  assert.match(readme, /#93764/);
  assert.match(readme, /\bflush\b/);
  assert.match(readme, /\bscotiated\b/);
  assert.match(readme, /decstbm-undershoot/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /DECSTBM|VTE|blank row/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/scotia/);
  assert.match(readme, /node --test projects\/scotia\/scotia\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /scotia|shadow-gap|column|molding|DECSTBM/i);
  assert.match(readme, /Score scotia or admit flush/);
  assert.match(readme, /#4136|#83660/);
  assert.match(readme, /#93754|#93744|#93782|#93821|#93811|#93809|#93751|#93772|#93770|#93777|#93823/);
  assert.match(readme, /03:50/);
});

test("catalog features Scotia only; Canard, Stet, Blindside, Interdict, Simplex unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 321);
  assert.equal(hub.products.length, 321);
  assert.equal(catalog.products[0].name, "Scotia");
  assert.equal(catalog.products[0].slug, "scotia");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/scotia/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /03:50 scotia|#93764|shadow-gap|column-molding/i);
  assert.match(catalog.products[0].summary, /\bflush\b/);
  assert.match(catalog.products[0].summary, /\bscotiated\b/);
  assert.match(catalog.products[0].summary, /decstbm-undershoot/);
  assert.match(catalog.products[0].summary, /Score scotia or admit flush/);
  assert.equal(hub.products[0].slug, "scotia");
  assert.equal(hub.products[0].featured, true);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  const stet = catalog.products.find((row) => row.slug === "stet");
  assert.ok(stet);
  assert.equal(stet.featured, false);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  const simplex = catalog.products.find((row) => row.slug === "simplex");
  assert.ok(simplex);
  assert.equal(simplex.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "scotia").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93764") && row.slug !== "scotia"));
});

test("vercel rewrites scotia to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/scotia");
  assert.equal(vercel.rewrites[0].destination, "/projects/scotia");
  assert.equal(vercel.rewrites[1].source, "/scotia/");
  assert.equal(vercel.rewrites[1].destination, "/projects/scotia");
  assert.equal(vercel.rewrites[2].source, "/scotia/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/scotia/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
