import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
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
  SAMPLE_BLANK_LINES,
  SAMPLE_BUFFER,
  SAMPLE_CURSOR,
  SAMPLE_MANUAL_EDIT,
  SAMPLE_REWOUND_DESK,
  SEEDED_WORD,
  STATE,
  STET_WALK,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBlankLinesDiscarded,
  inspectBufferRestore,
  inspectCursorIgnored,
  inspectManualEditWiped,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBlankLinesDiscarded,
  seedBufferRestore,
  seedCursorIgnored,
  seedHold,
  seedManualEditWiped,
  seedMicResumeWipe,
  seedRewound,
  seedStet,
  seedStetted,
} from "./stet.mjs";

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
  return fileURLToPath(new URL("./stet.mjs", import.meta.url));
}

test("idle stetted is a hold; box + cursor stay source of truth", () => {
  const result = analyze(seedStetted());
  assert.equal(result.verdict, "stetted");
  assert.equal(result.idleWord, "stetted");
  assert.equal(IDLE_WORD, "stetted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stetted, true);
  assert.equal(result.phrase, "admit stetted");
  assert.equal(result.rewound, false);
  assert.equal(result.micResumeWipe, false);
  assert.ok(HOLD_ALIASES.includes("stetted"));
  assert.ok(HOLD_ALIASES.includes("box-source-of-truth"));
  assert.ok(HOLD_ALIASES.includes("cursor-honored"));
  assert.ok(HOLD_ALIASES.includes("edit-stands"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify stetted", () => {
  assert.equal(classify(emptyTicket()), "stetted");
  assert.equal(classify(""), "stetted");
  assert.equal(classify(null), "stetted");
  assert.equal(decide({}), "stetted");
});

test("#93778 seeded path scores stet when dictation restores the prior buffer", () => {
  const result = analyze(seedRewound());
  assert.equal(result.verdict, "stet");
  assert.equal(result.seededWord, "rewound");
  assert.equal(SEEDED_WORD, "rewound");
  assert.equal(PRODUCT_WORD, "stet");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.rewound, true);
  assert.equal(result.phrase, "score stet");
  assert.equal(result.micResumeWipe, true);
  assert.equal(result.manualEditWiped, true);
  assert.equal(result.blankLinesDiscarded, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("manual edit wiped plus buffer restore is the #93778 stet", () => {
  const edit = inspectManualEditWiped({ rewound: true, manualEditWiped: true });
  assert.equal(edit.stamp, "manual-edit-wiped");
  assert.equal(edit.editWiped, true);
  const scored = scoreGate({
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    bufferRestored: true,
    cursorIgnored: true,
    cue: "rewound",
    manualEdit: SAMPLE_MANUAL_EDIT,
    blankLines: SAMPLE_BLANK_LINES,
    buffer: SAMPLE_BUFFER,
    cursor: SAMPLE_CURSOR,
  });
  assert.equal(scored.verdict, "stet");
  assert.equal(scored.micResumeWipe, true);
  const open = inspectManualEditWiped({ stetted: true, manualEditWiped: false });
  assert.equal(open.stamp, "edit-stands");
});

test("path word is mic-resume-wipe; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "mic-resume-wipe");
  const result = analyze(seedMicResumeWipe());
  assert.equal(result.verdict, "mic-resume-wipe");
  assert.equal(result.pathWord, "mic-resume-wipe");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "mic-resume-wipe", preferSeed: true, rewound: true }),
    "mic-resume-wipe",
  );
  assert.equal(classify(seedManualEditWiped()), "manual-edit-wiped");
});

test("HOLD includes stetted / hold", () => {
  assert.ok(HOLD.includes("stetted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: manual-edit-wiped, blank-lines-discarded, buffer-restore, cursor-ignored", () => {
  assert.equal(classify(seedManualEditWiped()), "manual-edit-wiped");
  assert.equal(classify(seedBlankLinesDiscarded()), "blank-lines-discarded");
  assert.equal(classify(seedBufferRestore()), "buffer-restore");
  assert.equal(classify(seedCursorIgnored()), "cursor-ignored");
  assert.equal(classify(seedStet()), "stet");
});

test("booth fixtures flip stetted vs rewound vs mic-resume-wipe vs stet", () => {
  const idle = scoreGate(seedStetted());
  const seeded = scoreGate(seedRewound());
  const stetted = readData("stetted.json");
  const rewound = readData("rewound.json");
  const path = readData("mic-resume-wipe.json");
  const product = readData("stet.json");
  const wiped = readData("manual-edit-wiped.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "stetted");
  assert.equal(seeded.verdict, "stet");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedStetted()), "stetted");
  assert.equal(score(seedRewound()), "stet");
  assert.equal(stetted.manualEditWiped, false);
  assert.equal(stetted.stetted, true);
  assert.equal(scoreGate(stetted).verdict, "stetted");
  assert.equal(rewound.micResumeWipe, true);
  assert.equal(rewound.manualEditWiped, true);
  assert.equal(rewound.blankLinesDiscarded, true);
  assert.equal(classify(rewound), "rewound");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /box|cursor|edit|buffer|whitespace/i);
  assert.match(path.paths[1].result, /wipe|restore|buffer|blank|glued/i);
  assert.equal(classify(path), "mic-resume-wipe");
  assert.equal(classify(product), "stet");
  assert.equal(product.hubCount, "STET");
  assert.equal(rewound.issue, 93778);
  assert.equal(rewound.rewound, true);
  assert.equal(classify(wiped), "manual-edit-wiped");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("blank-lines-discarded.json")), "blank-lines-discarded");
  assert.equal(classify(readData("buffer-restore.json")), "buffer-restore");
  assert.equal(classify(readData("cursor-ignored.json")), "cursor-ignored");
  assert.equal(classify(readData("box-source-of-truth.json")), "box-source-of-truth");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("stetted"));
  assert.ok(CHIPS.includes("rewound"));
  assert.ok(CHIPS.includes("stet"));
  assert.ok(CHIPS.includes("mic-resume-wipe"));
  assert.ok(CHIPS.includes("manual-edit-wiped"));
  assert.ok(CHIPS.includes("blank-lines-discarded"));
  assert.ok(CHIPS.includes("buffer-restore"));
  assert.ok(CHIPS.includes("cursor-ignored"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("rewound"));
  assert.ok(ALARM.includes("mic-resume-wipe"));
  assert.ok(ALARM.includes("manual-edit-wiped"));
  assert.ok(ALARM.includes("stet"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published stet walk scores stet after the idle hold", () => {
  const booth = scoreWalk({ rows: STET_WALK });
  assert.equal(booth.verdict, "stet");
  assert.ok(booth.rewoundCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-stetted");
  assert.equal(idle.stetted, true);
  assert.equal(idle.verdict, "stetted");
  const wiped = booth.rows.find((row) => row.event === "manual-edit-wiped");
  assert.equal(wiped.manualEditWiped, true);
  const path = booth.rows.find((row) => row.event === "mic-resume-wipe" && row.t === "path");
  assert.equal(path.verdict, "mic-resume-wipe");
});

test("STET_WALK constant matches the issue copy-desk walk", () => {
  assert.equal(STET_WALK[0].event, "cue-stetted");
  const wiped = STET_WALK.find((row) => row.event === "manual-edit-wiped");
  assert.equal(wiped.manualEditWiped, true);
  const path = STET_WALK.find((row) => row.t === "path");
  assert.equal(path.rewound, true);
  const scoreRow = STET_WALK.find((row) => row.event === "stet");
  assert.equal(scoreRow.rewound, true);
});

test("positive control box-source-of-truth stays stetted", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "stetted");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "stetted");
  const hold = walk.rows.find((row) => row.event === "cue-stetted");
  assert.equal(hold.stetted, true);
  assert.equal(hold.verdict, "stetted");
});

test("issue constants encode only #93778 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93778);
  assert.ok(ISSUE_URL.includes("93778"));
  assert.match(TITLE, /dictation|manual edit|old text/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(CLAUDE_VERSION, /Windows 11 Pro 26200/);
  assert.match(GOOD_VERSION, /text box|source of truth|cursor/i);
  assert.match(SURFACE, /Desktop|Windows 11/i);
  assert.match(HOST, /Desktop/);
  assert.match(INSTALL_PATH, /dictation|Windows/i);
  assert.match(COMMAND, /dictate|edit by hand|speak again/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:a11y",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /91202/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /93165/i.test(row)));
  assert.ok(EXPECTED.some((row) => /source of truth|cursor|blank/i.test(row)));
  assert.match(DISTRIBUTION, /manual edit|blank lines|Shift\+Enter|Jabra|Windows 11|source of truth/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("mic-resume-wipe"));
  assert.ok(FINGERPRINT_LINES.includes("rewound"));
  assert.equal(PHRASE, "Score stet or admit stetted.");
  assert.equal(SAMPLE_REWOUND_DESK.bufferRestored, true);
  assert.equal(SAMPLE_MANUAL_EDIT.editWiped, true);
  assert.equal(SAMPLE_BLANK_LINES.blanksDiscarded, true);
  assert.equal(SAMPLE_BUFFER.restored, true);
  assert.equal(SAMPLE_CURSOR.cursorIgnored, true);
});

test("has-repro fingerprints encode the published rewound desk", () => {
  const result = handle(seedRewound());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.surface, /Desktop|Windows 11/);
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedRewound()),
    /stet\|edit=wiped\|blanks=discarded\|buffer=restored\|cursor=ignored\|path=mic-resume-wipe\|cue=mic-resume-wipe/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism", () => {
  const required = [
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

test("stetted booth flips rewound back when the live box stands", () => {
  const tape = {
    stetted: true,
    rewound: false,
    manualEditWiped: false,
    cue: "stetted",
  };
  assert.equal(scoreGate(tape).verdict, "stetted");
  tape.stetted = false;
  tape.rewound = true;
  tape.micResumeWipe = true;
  tape.manualEditWiped = true;
  tape.blankLinesDiscarded = true;
  tape.cue = "rewound";
  assert.equal(scoreGate(tape).verdict, "stet");
  tape.stetted = true;
  tape.rewound = false;
  tape.micResumeWipe = false;
  tape.manualEditWiped = false;
  tape.blankLinesDiscarded = false;
  tape.cue = "stetted";
  assert.equal(scoreGate(tape).verdict, "stetted");
});

test("edit, blanks, buffer, cursor, and readBooth mark the rewound desk", () => {
  const idle = inspectManualEditWiped({
    stetted: true,
    manualEdit: { dictatedThenEdited: true, micLeftOn: true, editWiped: false },
  });
  assert.equal(idle.stamp, "edit-stands");
  const blanks = inspectBlankLinesDiscarded({ rewound: true, blankLines: SAMPLE_BLANK_LINES });
  assert.equal(blanks.stamp, "blank-lines-discarded");
  assert.equal(blanks.blanksDiscarded, true);
  const buffer = inspectBufferRestore({
    bufferRestored: true,
    buffer: SAMPLE_BUFFER,
  });
  assert.equal(buffer.stamp, "buffer-restore");
  const cursor = inspectCursorIgnored({ rewound: true, cursorIgnored: true });
  assert.equal(cursor.stamp, "cursor-ignored");
  const booth = readBooth({
    rewound: true,
    manualEditWiped: true,
    manualEdit: SAMPLE_MANUAL_EDIT,
    blankLines: SAMPLE_BLANK_LINES,
    buffer: SAMPLE_BUFFER,
    cursor: SAMPLE_CURSOR,
  });
  assert.equal(booth.rewound, true);
  assert.equal(booth.mark, "rewound");
  const open = readBooth({
    stetted: true,
    rewound: false,
    manualEditWiped: false,
  });
  assert.equal(open.rewound, false);
  assert.equal(open.mark, "stetted");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 91202);
  assert.equal(COUSINS[1].issue, 93165);
  assert.equal(COUSINS[2].issue, 93636);
  assert.equal(COUSINS[3].issue, 93782);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /91202|rebuild/i);
  assert.match(COUSINS[1].why, /93165|rebuild/i);
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
  assert.equal(BACKUPS.length, 20);
  assert.equal(BACKUPS[0].issue, 93766);
  assert.equal(BACKUPS[1].issue, 93764);
  assert.equal(BACKUPS[2].issue, 93754);
  assert.equal(BACKUPS[3].issue, 93751);
  assert.equal(BACKUPS[4].issue, 93744);
  assert.equal(BACKUPS[5].issue, 93772);
  assert.equal(BACKUPS[6].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93777);
  assert.equal(BACKUPS[8].issue, 93782);
  assert.equal(BACKUPS[9].issue, 93800);
  assert.equal(BACKUPS[10].issue, 93809);
  assert.equal(BACKUPS[11].issue, 93807);
  assert.equal(BACKUPS[12].issue, 93808);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93778));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/rewound.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const stettedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/stetted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(stettedFix.status, 0, stettedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const stettedOut = JSON.parse(stettedFix.stdout);
  assert.equal(idleOut.verdict, "stetted");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "rewound");
  assert.equal(seededOut.alarm, true);
  assert.equal(stettedOut.verdict, "stetted");
  assert.equal(stettedOut.hold, true);
});

test("handle exposes published hypothesis and #93778 headline", () => {
  const result = handle(seedRewound());
  assert.equal(result.published.issue, 93778);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [91202, 93165, 93636, 93782]);
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93807));
  assert.ok(result.published.backups.includes(93808));
  assert.ok(result.published.backups.includes(93800));
  assert.ok(!result.published.backups.includes(93778));
  assert.ok(!result.published.backups.includes(91202));
  assert.match(result.published.hypothesis, /buffer|composer|DOM|selection/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93778/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a copy-desk / blue-pencil booth, not blindside or interdict", () => {
  const page = readPage();
  assert.match(page, /Playfair Display|Playfair\+Display/);
  assert.match(page, /Figtree/);
  assert.match(page, /Fragment Mono|Fragment\+Mono/);
  assert.match(page, /stet|stetted|rewound|mic-resume-wipe|copy-desk|blue-pencil|galley|margin/i);
  assert.match(page, /#F4EFE6|#1C1917|#2B5EA7|#B33A3A|#57534E|#A8A29E/i);
  assert.match(page, /\bstetted\b/);
  assert.match(page, /\brewound\b/);
  assert.match(page, /mic-resume-wipe/);
  assert.match(page, /Score stet or admit stetted/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#319/);
  assert.match(page, /#93778/);
  assert.match(page, /Admit stetted/);
  assert.match(page, /Score stet/);
  assert.match(page, /Walk mic-resume-wipe/);
  assert.match(page, /Compare stetted \/ rewound/);
  assert.match(page, /Pin idle stetted/);
  assert.match(page, /Pin seeded rewound/);
  assert.match(page, /Pin mic-resume-wipe/);
  assert.match(page, /Hold the stetted/);
  assert.match(page, /manual edit|blank lines|Shift\+Enter|source of truth|Jabra|Windows/i);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Bebas Neue|Bebas\+Neue/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Russo One|Russo\+One/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /#0B1F14/);
  assert.doesNotMatch(page, /#F0A202/);
  assert.doesNotMatch(page, /#1A0B18/);
  assert.doesNotMatch(page, /#3A1638/);
  assert.doesNotMatch(page, /#041018/);
  assert.doesNotMatch(page, /#4CFF9A/);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bblindsided\b/);
  assert.doesNotMatch(page, /compare-ref-unreachable/);
  assert.doesNotMatch(page, /\bscoped\b/);
  assert.doesNotMatch(page, /\binterdicted\b/);
  assert.doesNotMatch(page, /chrome-prohibit-bleed/);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Sostenuto/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Stet/);
  assert.match(readme, /#93778/);
  assert.match(readme, /\bstetted\b/);
  assert.match(readme, /\brewound\b/);
  assert.match(readme, /mic-resume-wipe/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /#91202|#93165|#93636|#93782/);
  assert.match(readme, /manual edit|blank lines|source of truth|dictation buffer/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/stet/);
  assert.match(readme, /node --test projects\/stet\/stet\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /stet|copy-desk|blue-pencil|galley|margin/i);
  assert.match(readme, /Score stet or admit stetted/);
  assert.match(readme, /#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93800|#93809|#93807|#93808/);
  assert.match(readme, /01:50/);
});

test("catalog features Stet only; Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 319);
  assert.equal(hub.products.length, 319);
  assert.equal(catalog.products[0].name, "Stet");
  assert.equal(catalog.products[0].slug, "stet");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/stet/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /01:50 stet|#93778|copy-desk|blue-pencil/i);
  assert.match(catalog.products[0].summary, /\bstetted\b/);
  assert.match(catalog.products[0].summary, /\brewound\b/);
  assert.match(catalog.products[0].summary, /mic-resume-wipe/);
  assert.match(catalog.products[0].summary, /Score stet or admit stetted/);
  assert.equal(hub.products[0].slug, "stet");
  assert.equal(hub.products[0].featured, true);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  const simplex = catalog.products.find((row) => row.slug === "simplex");
  assert.ok(simplex);
  assert.equal(simplex.featured, false);
  const deadkey = catalog.products.find((row) => row.slug === "deadkey");
  assert.ok(deadkey);
  assert.equal(deadkey.featured, false);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  const schism = catalog.products.find((row) => row.slug === "schism");
  assert.ok(schism);
  assert.equal(schism.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "stet").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93778") && row.slug !== "stet"));
});

test("vercel rewrites stet to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/stet");
  assert.equal(vercel.rewrites[0].destination, "/projects/stet");
  assert.equal(vercel.rewrites[1].source, "/stet/");
  assert.equal(vercel.rewrites[1].destination, "/projects/stet");
  assert.equal(vercel.rewrites[2].source, "/stet/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/stet/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
