import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  SIMULACRUM_WALK,
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
  SAMPLE_HOLLOW_GALLERY,
  SAMPLE_NAVIGATE_HOLLOW,
  SAMPLE_LIST_LIE,
  SAMPLE_PAGE_HANG,
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
  inspectListConnected,
  inspectNavigate,
  inspectSwitchBrowser,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedSimulacrum,
  seedHollow,
  seedTethered,
  seedHold,
  seedNavigateFalseSuccess,
  seedTabIdHollow,
  seedPhantomNavigate,
  seedNoBrowserProcess,
  seedListConnectedLie,
} from "./simulacrum.mjs";

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
  return fileURLToPath(new URL("./simulacrum.mjs", import.meta.url));
}

test("idle tethered is a hold; real extension reachable; navigate drives a live window", () => {
  const result = analyze(seedTethered());
  assert.equal(result.verdict, "tethered");
  assert.equal(result.idleWord, "tethered");
  assert.equal(IDLE_WORD, "tethered");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.tethered, true);
  assert.equal(result.phrase, "admit tethered");
  assert.equal(result.hollow, false);
  assert.equal(result.phantomNavigate, false);
  assert.ok(HOLD_ALIASES.includes("tethered"));
  assert.ok(HOLD_ALIASES.includes("reachable"));
  assert.ok(HOLD_ALIASES.includes("live-window"));
  assert.ok(HOLD_ALIASES.includes("process-present"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify tethered", () => {
  assert.equal(classify(emptyTicket()), "tethered");
  assert.equal(classify(""), "tethered");
  assert.equal(classify(null), "tethered");
  assert.equal(decide({}), "tethered");
});

test("#93751 seeded path scores simulacrum when the CRT is hollow", () => {
  const result = analyze(seedHollow());
  assert.equal(result.verdict, "simulacrum");
  assert.equal(result.seededWord, "hollow");
  assert.equal(SEEDED_WORD, "hollow");
  assert.equal(PRODUCT_WORD, "simulacrum");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.hollow, true);
  assert.equal(result.phrase, "score simulacrum");
  assert.equal(result.phantomNavigate, true);
  assert.equal(result.noBrowserProcess, true);
  assert.equal(result.navigateFalseSuccess, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("list lie plus hollow navigate is the #93751 simulacrum", () => {
  const list = inspectListConnected({ hollow: true, listConnectedLie: true });
  assert.equal(list.stamp, "list-connected-lie");
  assert.equal(list.processRunning, false);
  const scored = scoreGate({
    hollow: true,
    phantomNavigate: true,
    noBrowserProcess: true,
    listConnectedLie: true,
    navigateFalseSuccess: true,
    tabIdHollow: true,
    cue: "hollow",
    list: SAMPLE_LIST_LIE,
    navigate: SAMPLE_NAVIGATE_HOLLOW,
  });
  assert.equal(scored.verdict, "simulacrum");
  assert.equal(scored.phantomNavigate, true);
  const open = inspectListConnected({ tethered: true, listConnectedLie: false });
  assert.equal(open.stamp, "list-live");
});

test("path word is phantom-navigate; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "phantom-navigate");
  const result = analyze(seedPhantomNavigate());
  assert.equal(result.verdict, "phantom-navigate");
  assert.equal(result.pathWord, "phantom-navigate");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "phantom-navigate", preferSeed: true, hollow: true }),
    "phantom-navigate",
  );
  assert.equal(classify(seedNoBrowserProcess()), "no-browser-process");
});

test("HOLD includes tethered / hold", () => {
  assert.ok(HOLD.includes("tethered"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: no-browser-process, list-connected-lie, navigate-false-success", () => {
  assert.equal(classify(seedNoBrowserProcess()), "no-browser-process");
  assert.equal(classify(seedListConnectedLie()), "list-connected-lie");
  assert.equal(classify(seedNavigateFalseSuccess()), "navigate-false-success");
  assert.equal(classify(seedTabIdHollow()), "tab-id-hollow");
  assert.equal(classify(seedSimulacrum()), "simulacrum");
});

test("booth fixtures flip tethered vs hollow vs phantom-navigate vs simulacrum", () => {
  const idle = scoreGate(seedTethered());
  const seeded = scoreGate(seedHollow());
  const tethered = readData("tethered.json");
  const hollow = readData("hollow.json");
  const path = readData("phantom-navigate.json");
  const product = readData("simulacrum.json");
  const lie = readData("list-connected-lie.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "tethered");
  assert.equal(seeded.verdict, "simulacrum");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedTethered()), "tethered");
  assert.equal(score(seedHollow()), "simulacrum");
  assert.equal(tethered.noBrowserProcess, false);
  assert.equal(tethered.tethered, true);
  assert.equal(scoreGate(tethered).verdict, "tethered");
  assert.equal(hollow.phantomNavigate, true);
  assert.equal(hollow.noBrowserProcess, true);
  assert.equal(hollow.navigateFalseSuccess, true);
  assert.equal(classify(hollow), "hollow");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /list|reachable|process|tethered/i);
  assert.match(path.paths[1].result, /Navigated|tab|window|410375950/i);
  assert.equal(classify(path), "phantom-navigate");
  assert.equal(classify(product), "simulacrum");
  assert.equal(product.hubCount, "SIMULACRUM");
  assert.equal(hollow.issue, 93751);
  assert.equal(hollow.hollow, true);
  assert.equal(classify(lie), "list-connected-lie");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("no-browser-process.json")), "no-browser-process");
  assert.equal(classify(readData("navigate-false-success.json")), "navigate-false-success");
  assert.equal(classify(readData("tab-id-hollow.json")), "tab-id-hollow");
  assert.equal(classify(readData("switch-browser-disagree.json")), "switch-browser-disagree");
  assert.equal(classify(readData("document-idle-hang.json")), "document-idle-hang");
  assert.equal(classify(readData("reconnect-not-durable.json")), "reconnect-not-durable");
  assert.equal(classify(readData("not-78096.json")), "not-78096");
  assert.equal(classify(readData("reachable.json")), "reachable");
  assert.equal(classify(readData("live-window.json")), "live-window");
  assert.equal(classify(readData("process-present.json")), "process-present");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("tethered"));
  assert.ok(CHIPS.includes("hollow"));
  assert.ok(CHIPS.includes("simulacrum"));
  assert.ok(CHIPS.includes("phantom-navigate"));
  assert.ok(CHIPS.includes("no-browser-process"));
  assert.ok(CHIPS.includes("list-connected-lie"));
  assert.ok(CHIPS.includes("navigate-false-success"));
  assert.ok(CHIPS.includes("tab-id-hollow"));
  assert.ok(CHIPS.includes("switch-browser-disagree"));
  assert.ok(CHIPS.includes("document-idle-hang"));
  assert.ok(CHIPS.includes("reconnect-not-durable"));
  assert.ok(CHIPS.includes("not-78096"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("hollow"));
  assert.ok(ALARM.includes("phantom-navigate"));
  assert.ok(ALARM.includes("list-connected-lie"));
  assert.ok(ALARM.includes("simulacrum"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published simulacrum walk scores simulacrum after the idle hold", () => {
  const booth = scoreWalk({ rows: SIMULACRUM_WALK });
  assert.equal(booth.verdict, "simulacrum");
  assert.ok(booth.hollowCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-tethered");
  assert.equal(idle.tethered, true);
  assert.equal(idle.verdict, "tethered");
  const lie = booth.rows.find((row) => row.event === "no-browser-process");
  assert.equal(lie.noBrowserProcess, true);
  const path = booth.rows.find((row) => row.event === "phantom-navigate" && row.t === "path");
  assert.equal(path.verdict, "phantom-navigate");
});

test("SIMULACRUM_WALK constant matches the issue gallery walk", () => {
  assert.equal(SIMULACRUM_WALK[0].event, "cue-tethered");
  const lie = SIMULACRUM_WALK.find((row) => row.event === "no-browser-process");
  assert.equal(lie.listConnectedLie, true);
  const path = SIMULACRUM_WALK.find((row) => row.t === "path");
  assert.equal(path.hollow, true);
  const scoreRow = SIMULACRUM_WALK.find((row) => row.event === "simulacrum");
  assert.equal(scoreRow.hollow, true);
});

test("positive control live window stays tethered", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "tethered");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "tethered");
  const hold = walk.rows.find((row) => row.event === "cue-tethered");
  assert.equal(hold.tethered, true);
  assert.equal(hold.verdict, "tethered");
});

test("issue constants encode only #93751 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93751);
  assert.ok(ISSUE_URL.includes("93751"));
  assert.match(TITLE, /list_connected_browsers|navigate|no browser/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(CLAUDE_VERSION, /1\.0\.92|2\.1\.260|Chrome/);
  assert.match(GOOD_VERSION, /reachable|fail loudly|process/i);
  assert.equal(SURFACE, "claude-in-chrome-mcp");
  assert.equal(HOST, "windows-edge");
  assert.match(INSTALL_PATH, /mcp__claude-in-chrome/);
  assert.match(COMMAND, /list_connected_browsers|navigate|switch_browser|msedge/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "platform:windows",
    "area:chrome",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /78096|stale-name|cache/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /list_connected_browsers|connected/i.test(row)));
  assert.ok(EXPECTED.some((row) => /list_connected_browsers|registered|reachable|fail loudly|switch_browser/i.test(row)));
  assert.match(DISTRIBUTION, /1\.0\.92|Windows 11|Edge|1789165039624|410375950|document_idle|90/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("phantom-navigate"));
  assert.ok(FINGERPRINT_LINES.includes("hollow"));
  assert.equal(PHRASE, "Score simulacrum or admit tethered.");
  assert.equal(SAMPLE_HOLLOW_GALLERY.processRunning, false);
  assert.equal(SAMPLE_NAVIGATE_HOLLOW.tabId, 410375950);
  assert.equal(SAMPLE_LIST_LIE.isLocal, true);
  assert.equal(SAMPLE_PAGE_HANG.hangSeconds, 45);
});

test("has-repro fingerprints encode the published hollow gallery", () => {
  const result = handle(seedHollow());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "claude-in-chrome-mcp");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedHollow()),
    /simulacrum\|process=zero\|nav=hollow\|list=lie\|path=phantom-navigate\|cue=phantom-navigate/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Solenoid, Scotia, Canard, Stet, Blindside, Interdict", () => {
  const required = [
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

test("tethered booth flips hollow back when a live window is behind the glass", () => {
  const tape = {
    tethered: true,
    hollow: false,
    noBrowserProcess: false,
    cue: "tethered",
  };
  assert.equal(scoreGate(tape).verdict, "tethered");
  tape.tethered = false;
  tape.hollow = true;
  tape.phantomNavigate = true;
  tape.noBrowserProcess = true;
  tape.navigateFalseSuccess = true;
  tape.cue = "hollow";
  assert.equal(scoreGate(tape).verdict, "simulacrum");
  tape.tethered = true;
  tape.hollow = false;
  tape.phantomNavigate = false;
  tape.noBrowserProcess = false;
  tape.navigateFalseSuccess = false;
  tape.cue = "tethered";
  assert.equal(scoreGate(tape).verdict, "tethered");
});

test("list, navigate, switch, and readBooth mark the hollow gallery", () => {
  const idle = inspectListConnected({
    tethered: true,
    list: { processRunning: true, reachable: true },
  });
  assert.equal(idle.stamp, "list-live");
  const nav = inspectNavigate({ hollow: true, navigate: SAMPLE_NAVIGATE_HOLLOW });
  assert.equal(nav.stamp, "navigate-false-success");
  assert.equal(nav.windowOpened, false);
  const sw = inspectSwitchBrowser({
    switchBrowserDisagree: true,
  });
  assert.equal(sw.stamp, "switch-browser-disagree");
  const booth = readBooth({
    hollow: true,
    noBrowserProcess: true,
    list: SAMPLE_LIST_LIE,
    navigate: SAMPLE_NAVIGATE_HOLLOW,
  });
  assert.equal(booth.hollow, true);
  assert.equal(booth.mark, "hollow");
  const open = readBooth({
    tethered: true,
    hollow: false,
    noBrowserProcess: false,
  });
  assert.equal(open.hollow, false);
  assert.equal(open.mark, "tethered");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 78096);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
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
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93754);
  assert.equal(BACKUPS[1].issue, 93744);
  assert.equal(BACKUPS[2].issue, 93772);
  assert.equal(BACKUPS[3].issue, 93770);
  assert.equal(BACKUPS[4].issue, 93777);
  assert.equal(BACKUPS[5].issue, 93782);
  assert.equal(BACKUPS[6].issue, 93821);
  assert.equal(BACKUPS[7].issue, 93811);
  assert.equal(BACKUPS[8].issue, 93809);
  assert.equal(BACKUPS[9].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93751));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/hollow.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const tetheredFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/tethered.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(tetheredFix.status, 0, tetheredFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const tetheredOut = JSON.parse(tetheredFix.stdout);
  assert.equal(idleOut.verdict, "tethered");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "hollow");
  assert.equal(seededOut.alarm, true);
  assert.equal(tetheredOut.verdict, "tethered");
  assert.equal(tetheredOut.hold, true);
});

test("handle exposes published hypothesis and #93751 headline", () => {
  const result = handle(seedHollow());
  assert.equal(result.published.issue, 93751);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [78096]);
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93821));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93751));
  assert.match(result.published.hypothesis, /dead registration|list\/navigate|extension-directory|correlation/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93751/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Baudrillard / hyperreality museum booth, not solenoid or interdict", () => {
  const page = readPage();
  assert.match(page, /Syne/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /simulacrum|tethered|hollow|phantom-navigate|mannequin|CRT|vitrine|wax/i);
  assert.match(page, /#171412|#EDE3CF|#5DFF7A|#3A2458|#B8923A|#D9892A/i);
  assert.match(page, /\btethered\b/);
  assert.match(page, /\bhollow\b/);
  assert.match(page, /phantom-navigate/);
  assert.match(page, /Score simulacrum or admit tethered/i);
  assert.match(page, /#78096|cousin/i);
  assert.match(page, /#323/);
  assert.match(page, /#93751/);
  assert.match(page, /Admit tethered/);
  assert.match(page, /Score simulacrum/);
  assert.match(page, /Walk phantom-navigate/);
  assert.match(page, /Compare tethered \/ hollow/);
  assert.match(page, /Pin idle tethered/);
  assert.match(page, /Pin seeded hollow/);
  assert.match(page, /Pin phantom-navigate/);
  assert.match(page, /Hold the glass/);
  assert.match(page, /list_connected_browsers|Navigated|410375950|document_idle|1\.0\.92|Windows 11/i);
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
  assert.match(readme, /Simulacrum/);
  assert.match(readme, /#93751/);
  assert.match(readme, /\btethered\b/);
  assert.match(readme, /\bhollow\b/);
  assert.match(readme, /phantom-navigate/);
  assert.match(readme, /Syne/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /list_connected_browsers|Navigated|document_idle|1\.0\.92/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/simulacrum/);
  assert.match(readme, /node --test projects\/simulacrum\/simulacrum\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /simulacrum|mannequin|CRT|hyperreality|wax/i);
  assert.match(readme, /Score simulacrum or admit tethered/);
  assert.match(readme, /#78096/);
  assert.match(readme, /#93754|#93744|#93772|#93770|#93777|#93782|#93821|#93811|#93809|#93823/);
  assert.match(readme, /05:50/);
});

test("catalog features Simulacrum only; Solenoid, Scotia, Canard, Stet, Blindside, Interdict unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 323);
  assert.equal(hub.products.length, 323);
  assert.equal(catalog.products[0].name, "Simulacrum");
  assert.equal(catalog.products[0].slug, "simulacrum");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/simulacrum/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /05:50 simulacrum|#93751|hyperreality|mannequin|CRT/i);
  assert.match(catalog.products[0].summary, /\btethered\b/);
  assert.match(catalog.products[0].summary, /\bhollow\b/);
  assert.match(catalog.products[0].summary, /phantom-navigate/);
  assert.match(catalog.products[0].summary, /Score simulacrum or admit tethered/);
  assert.equal(hub.products[0].slug, "simulacrum");
  assert.equal(hub.products[0].featured, true);
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
  assert.equal(catalog.products.filter((row) => row.slug === "simulacrum").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93751") && row.slug !== "simulacrum"));
});

test("vercel rewrites simulacrum to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/simulacrum");
  assert.equal(vercel.rewrites[0].destination, "/projects/simulacrum");
  assert.equal(vercel.rewrites[1].source, "/simulacrum/");
  assert.equal(vercel.rewrites[1].destination, "/projects/simulacrum");
  assert.equal(vercel.rewrites[2].source, "/simulacrum/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/simulacrum/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
