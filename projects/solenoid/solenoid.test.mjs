import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  SOLENOID_WALK,
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
  SAMPLE_INERT_ATELIER,
  SAMPLE_WARM_GAP,
  SAMPLE_SETTINGS_JSON,
  SAMPLE_TOGGLE_DEAD,
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
  inspectWarmGap,
  inspectSettingsJson,
  inspectToggleFidelity,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedSolenoid,
  seedInert,
  seedEngaged,
  seedHold,
  seedFirstMessageArm,
  seedSettingsJson,
  seedWarmBeforeMessage,
  seedToggleFidelity,
} from "./solenoid.mjs";

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
  return fileURLToPath(new URL("./solenoid.mjs", import.meta.url));
}

test("idle engaged is a hold; RC arms at warm before any message", () => {
  const result = analyze(seedEngaged());
  assert.equal(result.verdict, "engaged");
  assert.equal(result.idleWord, "engaged");
  assert.equal(IDLE_WORD, "engaged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.engaged, true);
  assert.equal(result.phrase, "admit engaged");
  assert.equal(result.inert, false);
  assert.equal(result.warmBeforeMessage, false);
  assert.ok(HOLD_ALIASES.includes("engaged"));
  assert.ok(HOLD_ALIASES.includes("armed"));
  assert.ok(HOLD_ALIASES.includes("coil-pulled"));
  assert.ok(HOLD_ALIASES.includes("bridge-ready"));
  assert.ok(HOLD_ALIASES.includes("warm-armed"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify engaged", () => {
  assert.equal(classify(emptyTicket()), "engaged");
  assert.equal(classify(""), "engaged");
  assert.equal(classify(null), "engaged");
  assert.equal(decide({}), "engaged");
});

test("#93754 seeded path scores solenoid when the coil stays inert until first message", () => {
  const result = analyze(seedInert());
  assert.equal(result.verdict, "solenoid");
  assert.equal(result.seededWord, "inert");
  assert.equal(SEEDED_WORD, "inert");
  assert.equal(PRODUCT_WORD, "solenoid");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.inert, true);
  assert.equal(result.phrase, "score solenoid");
  assert.equal(result.warmBeforeMessage, true);
  assert.equal(result.toggleFidelity, true);
  assert.equal(result.firstMessageArm, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("toggle fidelity plus first-message arm is the #93754 solenoid", () => {
  const toggle = inspectToggleFidelity({ inert: true, toggleFidelity: true });
  assert.equal(toggle.stamp, "toggle-fidelity");
  assert.equal(toggle.newSessionsGetRc, false);
  const scored = scoreGate({
    inert: true,
    warmBeforeMessage: true,
    toggleFidelity: true,
    firstMessageArm: true,
    settingsJson: true,
    cue: "inert",
    toggle: SAMPLE_TOGGLE_DEAD,
    gap: SAMPLE_WARM_GAP,
    keys: SAMPLE_SETTINGS_JSON,
  });
  assert.equal(scored.verdict, "solenoid");
  assert.equal(scored.warmBeforeMessage, true);
  const open = inspectToggleFidelity({ engaged: true, toggleFidelity: false });
  assert.equal(open.stamp, "toggle-live");
});

test("path word is warm-before-message; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "warm-before-message");
  const result = analyze(seedWarmBeforeMessage());
  assert.equal(result.verdict, "warm-before-message");
  assert.equal(result.pathWord, "warm-before-message");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "warm-before-message", preferSeed: true, inert: true }),
    "warm-before-message",
  );
  assert.equal(classify(seedToggleFidelity()), "toggle-fidelity");
});

test("HOLD includes engaged / hold", () => {
  assert.ok(HOLD.includes("engaged"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: toggle-fidelity, first-message-arm, settings-json", () => {
  assert.equal(classify(seedToggleFidelity()), "toggle-fidelity");
  assert.equal(classify(seedFirstMessageArm()), "first-message-arm");
  assert.equal(classify(seedSettingsJson()), "settings-json");
  assert.equal(classify(seedSolenoid()), "solenoid");
});

test("booth fixtures flip engaged vs inert vs warm-before-message vs solenoid", () => {
  const idle = scoreGate(seedEngaged());
  const seeded = scoreGate(seedInert());
  const engaged = readData("engaged.json");
  const inert = readData("inert.json");
  const path = readData("warm-before-message.json");
  const product = readData("solenoid.json");
  const toggle = readData("toggle-fidelity.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "engaged");
  assert.equal(seeded.verdict, "solenoid");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEngaged()), "engaged");
  assert.equal(score(seedInert()), "solenoid");
  assert.equal(engaged.toggleFidelity, false);
  assert.equal(engaged.engaged, true);
  assert.equal(scoreGate(engaged).verdict, "engaged");
  assert.equal(inert.warmBeforeMessage, true);
  assert.equal(inert.toggleFidelity, true);
  assert.equal(inert.firstMessageArm, true);
  assert.equal(classify(inert), "inert");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /warm|focus|message|engaged/i);
  assert.match(path.paths[1].result, /sendMessage|toggle|settings\.json|28/i);
  assert.equal(classify(path), "warm-before-message");
  assert.equal(classify(product), "solenoid");
  assert.equal(product.hubCount, "SOLENOID");
  assert.equal(inert.issue, 93754);
  assert.equal(inert.inert, true);
  assert.equal(classify(toggle), "toggle-fidelity");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("first-message-arm.json")), "first-message-arm");
  assert.equal(classify(readData("settings-json.json")), "settings-json");
  assert.equal(classify(readData("armed.json")), "armed");
  assert.equal(classify(readData("coil-pulled.json")), "coil-pulled");
  assert.equal(classify(readData("bridge-ready.json")), "bridge-ready");
  assert.equal(classify(readData("warm-armed.json")), "warm-armed");
  assert.equal(classify(readData("mac-absent.json")), "mac-absent");
  assert.equal(classify(readData("win-disconnected.json")), "win-disconnected");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("engaged"));
  assert.ok(CHIPS.includes("inert"));
  assert.ok(CHIPS.includes("solenoid"));
  assert.ok(CHIPS.includes("warm-before-message"));
  assert.ok(CHIPS.includes("toggle-fidelity"));
  assert.ok(CHIPS.includes("first-message-arm"));
  assert.ok(CHIPS.includes("settings-json"));
  assert.ok(CHIPS.includes("armed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("inert"));
  assert.ok(ALARM.includes("warm-before-message"));
  assert.ok(ALARM.includes("toggle-fidelity"));
  assert.ok(ALARM.includes("solenoid"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published solenoid walk scores solenoid after the idle hold", () => {
  const booth = scoreWalk({ rows: SOLENOID_WALK });
  assert.equal(booth.verdict, "solenoid");
  assert.ok(booth.inertCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-engaged");
  assert.equal(idle.engaged, true);
  assert.equal(idle.verdict, "engaged");
  const toggle = booth.rows.find((row) => row.event === "toggle-fidelity");
  assert.equal(toggle.toggleFidelity, true);
  const path = booth.rows.find((row) => row.event === "warm-before-message" && row.t === "path");
  assert.equal(path.verdict, "warm-before-message");
});

test("SOLENOID_WALK constant matches the issue atelier walk", () => {
  assert.equal(SOLENOID_WALK[0].event, "cue-engaged");
  const toggle = SOLENOID_WALK.find((row) => row.event === "toggle-fidelity");
  assert.equal(toggle.toggleFidelity, true);
  const path = SOLENOID_WALK.find((row) => row.t === "path");
  assert.equal(path.inert, true);
  const scoreRow = SOLENOID_WALK.find((row) => row.event === "solenoid");
  assert.equal(scoreRow.inert, true);
});

test("positive control armed warm stays engaged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "engaged");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "engaged");
  const hold = walk.rows.find((row) => row.event === "cue-engaged");
  assert.equal(hold.engaged, true);
  assert.equal(hold.verdict, "engaged");
});

test("issue constants encode only #93754 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93754);
  assert.ok(ISSUE_URL.includes("93754"));
  assert.match(TITLE, /remote control|Settings toggle|first message|macOS/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /Desktop|macOS|15\.7\.7|24G720/);
  assert.match(GOOD_VERSION, /WarmLifecycle|sendMessage|warm/i);
  assert.equal(SURFACE, "desktop-settings-rc");
  assert.equal(HOST, "macos-desktop");
  assert.match(INSTALL_PATH, /settings\.json|~\/\.claude/);
  assert.match(COMMAND, /Remote Control|WarmLifecycle|sendMessage/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /settings\.json|remoteControlAtStartup/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /toggle|switch/i.test(row)));
  assert.ok(EXPECTED.some((row) => /Settings|remoteControlAtStartup|first message|warm/i.test(row)));
  assert.match(DISTRIBUTION, /15\.7\.7|remoteControlAtStartup|sendMessage|21:21:22|disconnected|24G720/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("warm-before-message"));
  assert.ok(FINGERPRINT_LINES.includes("inert"));
  assert.equal(PHRASE, "Score solenoid or admit engaged.");
  assert.equal(SAMPLE_INERT_ATELIER.firstMessageRequired, true);
  assert.equal(SAMPLE_WARM_GAP.gapSeconds, 28);
  assert.equal(SAMPLE_TOGGLE_DEAD.toggleFlips, true);
  assert.equal(SAMPLE_SETTINGS_JSON.remoteControlAtStartup, true);
});

test("has-repro fingerprints encode the published inert atelier", () => {
  const result = handle(seedInert());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "desktop-settings-rc");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedInert()),
    /solenoid\|toggle=dead\|arm=first-message\|keys=file-only\|path=warm-before-message\|cue=warm-before-message/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Scotia, Canard, Stet, Blindside, Interdict, Pontoon, Outrider", () => {
  const required = [
    "scotia",
    "scotiated",
    "decstbm-undershoot",
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

test("engaged booth flips inert back when the coil pulls at warm", () => {
  const tape = {
    engaged: true,
    inert: false,
    toggleFidelity: false,
    cue: "engaged",
  };
  assert.equal(scoreGate(tape).verdict, "engaged");
  tape.engaged = false;
  tape.inert = true;
  tape.warmBeforeMessage = true;
  tape.toggleFidelity = true;
  tape.firstMessageArm = true;
  tape.cue = "inert";
  assert.equal(scoreGate(tape).verdict, "solenoid");
  tape.engaged = true;
  tape.inert = false;
  tape.warmBeforeMessage = false;
  tape.toggleFidelity = false;
  tape.firstMessageArm = false;
  tape.cue = "engaged";
  assert.equal(scoreGate(tape).verdict, "engaged");
});

test("toggle, warm gap, keys, and readBooth mark the inert atelier", () => {
  const idle = inspectToggleFidelity({
    engaged: true,
    toggle: { toggleFlips: true, newSessionsGetRc: true, writesRemoteControlAtStartup: true },
  });
  assert.equal(idle.stamp, "toggle-live");
  const warm = inspectWarmGap({ inert: true, gap: SAMPLE_WARM_GAP });
  assert.equal(warm.stamp, "first-message-arm");
  assert.equal(warm.rcAtWarm, false);
  const keys = inspectSettingsJson({
    settingsJson: true,
    keys: SAMPLE_SETTINGS_JSON,
  });
  assert.equal(keys.stamp, "settings-json");
  const booth = readBooth({
    inert: true,
    toggleFidelity: true,
    toggle: SAMPLE_TOGGLE_DEAD,
    gap: SAMPLE_WARM_GAP,
    keys: SAMPLE_SETTINGS_JSON,
  });
  assert.equal(booth.inert, true);
  assert.equal(booth.mark, "inert");
  const open = readBooth({
    engaged: true,
    inert: false,
    toggleFidelity: false,
  });
  assert.equal(open.inert, false);
  assert.equal(open.mark, "engaged");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 84502);
  assert.equal(COUSINS[1].issue, 48949);
  assert.equal(COUSINS[2].issue, 90768);
  assert.equal(COUSINS[3].issue, 84994);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("scotia"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93751);
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
  assert.ok(!BACKUPS.some((row) => row.issue === 93754));
  assert.ok(!BACKUPS.some((row) => row.issue === 93764));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/inert.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const engagedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/engaged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(engagedFix.status, 0, engagedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const engagedOut = JSON.parse(engagedFix.stdout);
  assert.equal(idleOut.verdict, "engaged");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "inert");
  assert.equal(seededOut.alarm, true);
  assert.equal(engagedOut.verdict, "engaged");
  assert.equal(engagedOut.hold, true);
});

test("handle exposes published hypothesis and #93754 headline", () => {
  const result = handle(seedInert());
  assert.equal(result.published.issue, 93754);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [84502, 48949, 90768, 84994]);
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93821));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93754));
  assert.ok(!result.published.backups.includes(93764));
  assert.match(result.published.hypothesis, /remoteControlAtStartup|WarmLifecycle|sendMessage|Settings/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93754/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an industrial switchgear / solenoid-coil atelier, not scotia or canard", () => {
  const page = readPage();
  assert.match(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.match(page, /Barlow/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /solenoid|engaged|inert|warm-before-message|coil|plunger|switchgear/i);
  assert.match(page, /#8B95A3|#24303C|#E07A28|#0A1424|#2FDBA0|#C4452A/i);
  assert.match(page, /\bengaged\b/);
  assert.match(page, /\binert\b/);
  assert.match(page, /warm-before-message/);
  assert.match(page, /Score solenoid or admit engaged/i);
  assert.match(page, /#84502|#48949|#90768|#84994|cousin/i);
  assert.match(page, /#322/);
  assert.match(page, /#93754/);
  assert.match(page, /Admit engaged/);
  assert.match(page, /Score solenoid/);
  assert.match(page, /Walk warm-before-message/);
  assert.match(page, /Compare engaged \/ inert/);
  assert.match(page, /Pin idle engaged/);
  assert.match(page, /Pin seeded inert/);
  assert.match(page, /Pin warm-before-message/);
  assert.match(page, /Hold the coil/);
  assert.match(page, /remoteControlAtStartup|WarmLifecycle|sendMessage|settings\.json|15\.7\.7|24G720/i);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /Roboto Mono|Roboto\+Mono/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Bebas Neue|Bebas\+Neue/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /#D8D0C0/);
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
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|onQuitCleanup/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|headersHelper/i);
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
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Solenoid/);
  assert.match(readme, /#93754/);
  assert.match(readme, /\bengaged\b/);
  assert.match(readme, /\binert\b/);
  assert.match(readme, /warm-before-message/);
  assert.match(readme, /Big Shoulders Display/);
  assert.match(readme, /Barlow/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /Remote Control|settings\.json|WarmLifecycle|sendMessage/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/solenoid/);
  assert.match(readme, /node --test projects\/solenoid\/solenoid\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /solenoid|switchgear|coil|plunger/i);
  assert.match(readme, /Score solenoid or admit engaged/);
  assert.match(readme, /#84502|#48949|#90768|#84994/);
  assert.match(readme, /#93751|#93744|#93772|#93770|#93777|#93782|#93821|#93811|#93809|#93823/);
  assert.match(readme, /04:50/);
});

test("catalog features Solenoid only; Scotia, Canard, Stet, Blindside, Interdict, Simplex unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 322);
  assert.equal(hub.products.length, 322);
  assert.equal(catalog.products[0].name, "Solenoid");
  assert.equal(catalog.products[0].slug, "solenoid");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/solenoid/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /04:50 solenoid|#93754|switchgear|solenoid-coil/i);
  assert.match(catalog.products[0].summary, /\bengaged\b/);
  assert.match(catalog.products[0].summary, /\binert\b/);
  assert.match(catalog.products[0].summary, /warm-before-message/);
  assert.match(catalog.products[0].summary, /Score solenoid or admit engaged/);
  assert.equal(hub.products[0].slug, "solenoid");
  assert.equal(hub.products[0].featured, true);
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
  const simplex = catalog.products.find((row) => row.slug === "simplex");
  assert.ok(simplex);
  assert.equal(simplex.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "solenoid").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93754") && row.slug !== "solenoid"));
});

test("vercel rewrites solenoid to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/solenoid");
  assert.equal(vercel.rewrites[0].destination, "/projects/solenoid");
  assert.equal(vercel.rewrites[1].source, "/solenoid/");
  assert.equal(vercel.rewrites[1].destination, "/projects/solenoid");
  assert.equal(vercel.rewrites[2].source, "/solenoid/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/solenoid/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
