import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ANEROID_WALK,
  AUTO_COMPACT_WINDOW,
  BACKUPS,
  BOOTH_STATIONS,
  BUFFER_TOKENS,
  CHIPS,
  CLAUDE_VERSION,
  CLI_HITS,
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
  MODEL_WINDOW,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_ANEROIDED_PANEL,
  SAMPLE_HOVER_MISLABEL,
  SAMPLE_SETTINGS_SNIPPET,
  SAMPLE_WRONG_WINDOW,
  SEEDED_WORD,
  STATE,
  SUPPRESS_REMAINING,
  SURFACE,
  TITLE,
  VERDICTS,
  WEBVIEW_HITS,
  analyze,
  classify,
  computeRing,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectHover,
  inspectRing,
  inspectWindow,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAneroid,
  seedAneroided,
  seedCalibrated,
  seedFiftySuppress,
  seedHold,
  seedHoverMislabel,
  seedModelWindow,
  seedWrongWindowRing,
} from "./aneroid.mjs";

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
  return fileURLToPath(new URL("./aneroid.mjs", import.meta.url));
}

test("idle calibrated is a hold; ring scored against autoCompactWindow with runway", () => {
  const result = analyze(seedCalibrated());
  assert.equal(result.verdict, "calibrated");
  assert.equal(result.idleWord, "calibrated");
  assert.equal(IDLE_WORD, "calibrated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.calibrated, true);
  assert.equal(result.phrase, "admit calibrated");
  assert.equal(result.aneroided, false);
  assert.equal(result.wrongWindowRing, false);
  assert.ok(HOLD_ALIASES.includes("calibrated"));
  assert.ok(HOLD_ALIASES.includes("correct-window"));
  assert.ok(HOLD_ALIASES.includes("ring-ahead"));
  assert.ok(HOLD_ALIASES.includes("runway"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify calibrated", () => {
  assert.equal(classify(emptyTicket()), "calibrated");
  assert.equal(classify(""), "calibrated");
  assert.equal(classify(null), "calibrated");
  assert.equal(decide({}), "calibrated");
});

test("#93901 seeded path scores aneroid when the capsule is aneroided", () => {
  const result = analyze(seedAneroided());
  assert.equal(result.verdict, "aneroid");
  assert.equal(result.seededWord, "aneroided");
  assert.equal(SEEDED_WORD, "aneroided");
  assert.equal(PRODUCT_WORD, "aneroid");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.aneroided, true);
  assert.equal(result.phrase, "score aneroid");
  assert.equal(result.wrongWindowRing, true);
  assert.equal(result.modelWindow, true);
  assert.equal(result.fiftySuppress, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("wrong model window plus fifty-suppress is the #93901 aneroid", () => {
  const window = inspectWindow({ aneroided: true, modelWindow: true });
  assert.equal(window.stamp, "model-window");
  assert.equal(window.usesModelWindow, true);
  const scored = scoreGate({
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    hoverMislabel: true,
    fiftySuppress: true,
    cue: "aneroided",
    window: SAMPLE_WRONG_WINDOW,
    hover: SAMPLE_HOVER_MISLABEL,
  });
  assert.equal(scored.verdict, "aneroid");
  assert.equal(scored.wrongWindowRing, true);
  const open = inspectWindow({ calibrated: true, modelWindow: false });
  assert.equal(open.stamp, "correct-window");
});

test("path word is wrong-window-ring; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "wrong-window-ring");
  const result = analyze(seedWrongWindowRing());
  assert.equal(result.verdict, "wrong-window-ring");
  assert.equal(result.pathWord, "wrong-window-ring");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "wrong-window-ring", preferSeed: true, aneroided: true }),
    "wrong-window-ring",
  );
  assert.equal(classify(seedModelWindow()), "model-window");
});

test("HOLD includes calibrated / hold", () => {
  assert.ok(HOLD.includes("calibrated"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: model-window, hover-mislabel, fifty-suppress", () => {
  assert.equal(classify(seedModelWindow()), "model-window");
  assert.equal(classify(seedHoverMislabel()), "hover-mislabel");
  assert.equal(classify(seedFiftySuppress()), "fifty-suppress");
  assert.equal(classify(seedAneroid()), "aneroid");
});

test("booth fixtures flip calibrated vs aneroided vs wrong-window-ring vs aneroid", () => {
  const idle = scoreGate(seedCalibrated());
  const seeded = scoreGate(seedAneroided());
  const calibrated = readData("calibrated.json");
  const aneroided = readData("aneroided.json");
  const path = readData("wrong-window-ring.json");
  const product = readData("aneroid.json");
  const hover = readData("hover-mislabel.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "calibrated");
  assert.equal(seeded.verdict, "aneroid");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCalibrated()), "calibrated");
  assert.equal(score(seedAneroided()), "aneroid");
  assert.equal(calibrated.modelWindow, false);
  assert.equal(calibrated.calibrated, true);
  assert.equal(scoreGate(calibrated).verdict, "calibrated");
  assert.equal(aneroided.wrongWindowRing, true);
  assert.equal(aneroided.modelWindow, true);
  assert.equal(aneroided.fiftySuppress, true);
  assert.equal(classify(aneroided), "aneroided");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /autoCompactWindow|configured|window|calibrated/i);
  assert.match(path.paths[1].result, /500k|50%|auto-compact|suppress/i);
  assert.equal(classify(path), "wrong-window-ring");
  assert.equal(classify(product), "aneroid");
  assert.equal(product.hubCount, "ANEROID");
  assert.equal(aneroided.issue, 93901);
  assert.equal(aneroided.aneroided, true);
  assert.equal(classify(hover), "hover-mislabel");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("model-window.json")), "model-window");
  assert.equal(classify(readData("fifty-suppress.json")), "fifty-suppress");
  assert.equal(classify(readData("no-runway.json")), "no-runway");
  assert.equal(classify(readData("settings-absent.json")), "settings-absent");
  assert.equal(classify(readData("webview-zero-hits.json")), "webview-zero-hits");
  assert.equal(classify(readData("cli-eighteen.json")), "cli-eighteen");
  assert.equal(classify(readData("compact-immediate.json")), "compact-immediate");
  assert.equal(classify(readData("lower-window-worse.json")), "lower-window-worse");
  assert.equal(classify(readData("correct-window.json")), "correct-window");
  assert.equal(classify(readData("ring-ahead.json")), "ring-ahead");
  assert.equal(classify(readData("runway.json")), "runway");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  const usage = readData("wrong-window-usage.json");
  assert.equal(usage.tokensUsed, 500000);
  assert.equal(usage.modelWindow, 1000000);
  assert.equal(usage.autoCompactWindow, 500000);
  const calUsage = readData("calibrated-usage.json");
  assert.equal(calUsage.usesConfiguredWindow, true);
  const hoverStrings = readData("hover-strings.json");
  assert.match(hoverStrings.popup, /50% of context remaining until auto-compact/);
  const settings = readData("settings-snippet.json");
  assert.equal(settings.autoCompactWindow, 500000);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("calibrated"));
  assert.ok(CHIPS.includes("aneroided"));
  assert.ok(CHIPS.includes("aneroid"));
  assert.ok(CHIPS.includes("wrong-window-ring"));
  assert.ok(CHIPS.includes("model-window"));
  assert.ok(CHIPS.includes("hover-mislabel"));
  assert.ok(CHIPS.includes("fifty-suppress"));
  assert.ok(CHIPS.includes("no-runway"));
  assert.ok(CHIPS.includes("settings-absent"));
  assert.ok(CHIPS.includes("webview-zero-hits"));
  assert.ok(CHIPS.includes("cli-eighteen"));
  assert.ok(CHIPS.includes("compact-immediate"));
  assert.ok(CHIPS.includes("lower-window-worse"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("aneroided"));
  assert.ok(ALARM.includes("wrong-window-ring"));
  assert.ok(ALARM.includes("hover-mislabel"));
  assert.ok(ALARM.includes("aneroid"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published aneroid walk scores aneroid after the idle hold", () => {
  const booth = scoreWalk({ rows: ANEROID_WALK });
  assert.equal(booth.verdict, "aneroid");
  assert.ok(booth.aneroidedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-calibrated");
  assert.equal(idle.calibrated, true);
  assert.equal(idle.verdict, "calibrated");
  const lie = booth.rows.find((row) => row.event === "model-window");
  assert.equal(lie.modelWindow, true);
  const path = booth.rows.find((row) => row.event === "wrong-window-ring" && row.t === "path");
  assert.equal(path.verdict, "wrong-window-ring");
});

test("ANEROID_WALK constant matches the issue panel walk", () => {
  assert.equal(ANEROID_WALK[0].event, "cue-calibrated");
  const lie = ANEROID_WALK.find((row) => row.event === "settings-absent");
  assert.equal(lie.webviewZeroHits, true);
  const path = ANEROID_WALK.find((row) => row.t === "path");
  assert.equal(path.aneroided, true);
  const scoreRow = ANEROID_WALK.find((row) => row.event === "aneroid");
  assert.equal(scoreRow.aneroided, true);
});

test("positive control correct window stays calibrated", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "calibrated");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "calibrated");
  const hold = walk.rows.find((row) => row.event === "cue-calibrated");
  assert.equal(hold.calibrated, true);
  assert.equal(hold.verdict, "calibrated");
});

test("issue constants encode only #93901 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93901);
  assert.ok(ISSUE_URL.includes("93901"));
  assert.match(TITLE, /autoCompactWindow|context ring|auto-compact/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "vscode");
  assert.match(CLAUDE_VERSION, /2\.1\.269|2\.1\.158|VS Code/);
  assert.match(GOOD_VERSION, /autoCompactWindow|runway|configured/i);
  assert.equal(SURFACE, "vscode-extension-webview");
  assert.equal(HOST, "windows-vscode");
  assert.match(INSTALL_PATH, /settings\.json/);
  assert.match(COMMAND, /autoCompactWindow|500000|Opus 5/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "area:ide",
    "platform:vscode",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /90756|UI control|set the value/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /91385|per-prompt|mid-turn/i.test(row)));
  assert.ok(EXPECTED.some((row) => /auto-compact window|configured|runway|warning/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|500000|webview\/index\.js|1M|Opus 5|50%/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("wrong-window-ring"));
  assert.ok(FINGERPRINT_LINES.includes("aneroided"));
  assert.equal(PHRASE, "Score aneroid or admit calibrated.");
  assert.equal(SAMPLE_ANEROIDED_PANEL.usesConfiguredWindow, false);
  assert.equal(SAMPLE_HOVER_MISLABEL.remainingUntilCompact, 0);
  assert.equal(SAMPLE_WRONG_WINDOW.webviewHits, 0);
  assert.equal(SAMPLE_SETTINGS_SNIPPET.autoCompactWindow, 500000);
  assert.equal(MODEL_WINDOW, 1000000);
  assert.equal(AUTO_COMPACT_WINDOW, 500000);
  assert.equal(BUFFER_TOKENS, 13000);
  assert.equal(SUPPRESS_REMAINING, 50);
  assert.equal(WEBVIEW_HITS, 0);
  assert.equal(CLI_HITS, 18);
});

test("has-repro fingerprints encode the published aneroided panel", () => {
  const result = handle(seedAneroided());
  assert.equal(result.published.platform, "vscode");
  assert.equal(result.published.surface, "vscode-extension-webview");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedAneroided()),
    /aneroid\|window=model\|ring=suppressed\|hover=mislabel\|path=wrong-window-ring\|cue=wrong-window-ring/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict", () => {
  const required = [
    "simulacrum",
    "tethered",
    "hollow",
    "phantom-navigate",
    "solenoid",
    "engaged",
    "inert",
    "warm-before-message",
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
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
    "pontoon",
    "washed",
    "outrider",
    "credentialed",
    "early-connect",
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
    "attested",
    "necrology",
    "named",
    "innominate",
    "lit",
    "snuffer",
    "pledged",
    "changeling",
    "distinct",
    "homograph",
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
    "scapegoat",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("calibrated booth flips aneroided back when the ring reads the configured window", () => {
  const tape = {
    calibrated: true,
    aneroided: false,
    modelWindow: false,
    cue: "calibrated",
  };
  assert.equal(scoreGate(tape).verdict, "calibrated");
  tape.calibrated = false;
  tape.aneroided = true;
  tape.wrongWindowRing = true;
  tape.modelWindow = true;
  tape.fiftySuppress = true;
  tape.cue = "aneroided";
  assert.equal(scoreGate(tape).verdict, "aneroid");
  tape.calibrated = true;
  tape.aneroided = false;
  tape.wrongWindowRing = false;
  tape.modelWindow = false;
  tape.fiftySuppress = false;
  tape.cue = "calibrated";
  assert.equal(scoreGate(tape).verdict, "calibrated");
});

test("window, ring, hover, and readBooth mark the aneroided panel", () => {
  const idle = inspectWindow({
    calibrated: true,
    window: { usesModelWindow: false },
  });
  assert.equal(idle.stamp, "correct-window");
  const ring = inspectRing({ aneroided: true, ring: { suppressed: true } });
  assert.equal(ring.stamp, "fifty-suppress");
  assert.equal(ring.suppressed, true);
  const hover = inspectHover({
    hoverMislabel: true,
  });
  assert.equal(hover.stamp, "hover-mislabel");
  const booth = readBooth({
    aneroided: true,
    modelWindow: true,
    window: SAMPLE_WRONG_WINDOW,
    ring: { suppressed: true },
  });
  assert.equal(booth.aneroided, true);
  assert.equal(booth.mark, "aneroided");
  const open = readBooth({
    calibrated: true,
    aneroided: false,
    modelWindow: false,
  });
  assert.equal(open.aneroided, false);
  assert.equal(open.mark, "calibrated");
});

test("computeRing encodes the published wrong-window arithmetic", () => {
  const wrong = computeRing({ tokensUsed: 500000, calibrated: false });
  assert.equal(wrong.measuredAgainst, "model-window");
  assert.ok(wrong.U >= 40);
  assert.match(wrong.popup, /remaining until auto-compact/);
  const cal = computeRing({ tokensUsed: 500000, calibrated: true, autoCompactWindow: 500000 });
  assert.equal(cal.measuredAgainst, "autoCompactWindow");
  assert.ok(cal.z > wrong.z);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 90756);
  assert.equal(COUSINS[1].issue, 91385);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("simulacrum"));
  assert.ok(NOT_PRODUCTS.includes("solenoid"));
  assert.ok(NOT_PRODUCTS.includes("scotia"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 93744);
  assert.equal(BACKUPS[1].issue, 93772);
  assert.equal(BACKUPS[2].issue, 93770);
  assert.equal(BACKUPS[3].issue, 93777);
  assert.equal(BACKUPS[4].issue, 93782);
  assert.equal(BACKUPS[5].issue, 93862);
  assert.equal(BACKUPS[6].issue, 93859);
  assert.equal(BACKUPS[7].issue, 93863);
  assert.equal(BACKUPS[8].issue, 93889);
  assert.equal(BACKUPS[9].issue, 93821);
  assert.equal(BACKUPS[10].issue, 93811);
  assert.equal(BACKUPS[11].issue, 93809);
  assert.equal(BACKUPS[12].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93901));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/aneroided.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const calibratedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/calibrated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(calibratedFix.status, 0, calibratedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const calibratedOut = JSON.parse(calibratedFix.stdout);
  assert.equal(idleOut.verdict, "calibrated");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "aneroided");
  assert.equal(seededOut.alarm, true);
  assert.equal(calibratedOut.verdict, "calibrated");
  assert.equal(calibratedOut.hold, true);
});

test("handle exposes published hypothesis and #93901 headline", () => {
  const result = handle(seedAneroided());
  assert.equal(result.published.issue, 93901);
  assert.equal(result.published.platform, "vscode");
  assert.deepEqual(result.published.cousins, [90756, 91385]);
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93862));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93901));
  assert.match(result.published.hypothesis, /autoCompactWindow|webview|50%|model window/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93901/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an aneroid-barometer / instrument-panel booth, not simulacrum or solenoid", () => {
  const page = readPage();
  assert.match(page, /Orbitron/);
  assert.match(page, /Exo 2|Exo\+2/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /aneroid|calibrated|aneroided|wrong-window-ring|capsule|barometer|storm/i);
  assert.match(page, /#1A1C1F|#C9A227|#F0A202|#3EE8E0|#1B6B6B/i);
  assert.match(page, /\bcalibrated\b/);
  assert.match(page, /\baneroided\b/);
  assert.match(page, /wrong-window-ring/);
  assert.match(page, /Score aneroid or admit calibrated/i);
  assert.match(page, /#90756|#91385|cousin/i);
  assert.match(page, /#324/);
  assert.match(page, /#93901/);
  assert.match(page, /Admit calibrated/);
  assert.match(page, /Score aneroid/);
  assert.match(page, /Walk wrong-window-ring/);
  assert.match(page, /Compare calibrated \/ aneroided/);
  assert.match(page, /Pin idle calibrated/);
  assert.match(page, /Pin seeded aneroided/);
  assert.match(page, /Pin wrong-window-ring/);
  assert.match(page, /Seal the capsule/);
  assert.match(page, /autoCompactWindow|500000|50% of context remaining|webview\/index\.js|2\.1\.269|Opus 5/i);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Bodoni/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /#8B95A3/);
  assert.doesNotMatch(page, /#E07A28/);
  assert.doesNotMatch(page, /#2FDBA0/);
  assert.doesNotMatch(page, /#C4452A/);
  assert.doesNotMatch(page, /#0A1424/);
  assert.doesNotMatch(page, /#171412/);
  assert.doesNotMatch(page, /#5DFF7A/);
  assert.doesNotMatch(page, /#3A2458/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|onQuitCleanup/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|headersHelper/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /remoteControlAtStartup|WarmLifecycle/);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /list_connected_browsers|Navigated to/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
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
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Aneroid/);
  assert.match(readme, /#93901/);
  assert.match(readme, /\bcalibrated\b/);
  assert.match(readme, /\baneroided\b/);
  assert.match(readme, /wrong-window-ring/);
  assert.match(readme, /Orbitron/);
  assert.match(readme, /Exo 2/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /autoCompactWindow|webview\/index\.js|500000|50% of context remaining|2\.1\.269/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/aneroid/);
  assert.match(readme, /node --test projects\/aneroid\/aneroid\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /aneroid|barometer|instrument-panel|capsule|storm/i);
  assert.match(readme, /Score aneroid or admit calibrated/);
  assert.match(readme, /#90756/);
  assert.match(readme, /#91385/);
  assert.match(readme, /#93744|#93772|#93770|#93777|#93782|#93862|#93859|#93863|#93889|#93821|#93811|#93809|#93823/);
  assert.match(readme, /06:50/);
});

test("catalog features Aneroid only; Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 324);
  assert.equal(hub.products.length, 324);
  assert.equal(catalog.products[0].name, "Aneroid");
  assert.equal(catalog.products[0].slug, "aneroid");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/aneroid/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /06:50 aneroid|#93901|aneroid-barometer|instrument-panel/i);
  assert.match(catalog.products[0].summary, /\bcalibrated\b/);
  assert.match(catalog.products[0].summary, /\baneroided\b/);
  assert.match(catalog.products[0].summary, /wrong-window-ring/);
  assert.match(catalog.products[0].summary, /Score aneroid or admit calibrated/);
  assert.equal(hub.products[0].slug, "aneroid");
  assert.equal(hub.products[0].featured, true);
  const simulacrum = catalog.products.find((row) => row.slug === "simulacrum");
  assert.ok(simulacrum);
  assert.equal(simulacrum.featured, false);
  const solenoid = catalog.products.find((row) => row.slug === "solenoid");
  assert.ok(solenoid);
  assert.equal(solenoid.featured, false);
  const scotia = catalog.products.find((row) => row.slug === "scotia");
  assert.ok(scotia);
  assert.equal(scotia.featured, false);
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
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "aneroid").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93901") && row.slug !== "aneroid"));
});

test("vercel rewrites aneroid to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/aneroid");
  assert.equal(vercel.rewrites[0].destination, "/projects/aneroid");
  assert.equal(vercel.rewrites[1].source, "/aneroid/");
  assert.equal(vercel.rewrites[1].destination, "/projects/aneroid");
  assert.equal(vercel.rewrites[2].source, "/aneroid/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/aneroid/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
