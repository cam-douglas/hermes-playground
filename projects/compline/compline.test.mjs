import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  CLOISTER_STATIONS,
  COMBINED_RSS,
  COMPLETED_AT,
  COMPLINE_WALK,
  CONTROL_GAP,
  COUSINS,
  CHILD_COMMAND,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOOK_EVENTS,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OLDEST_DAYS,
  OS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PROCESS_COUNT,
  PRODUCT_WORD,
  RATE_LIMIT_EVENTS,
  RESIDENT_HOURS,
  SEEDED_WORD,
  SESSION_KIND,
  SPAWN_FLAG,
  STATE,
  STILL_ALIVE_AFTER,
  SUCCESS_DURATION,
  SUCCESS_TURNS,
  TITLE,
  TRIGGER_KIND,
  TRIGGERS_PATH,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBell,
  inspectCandle,
  inspectChoir,
  inspectStall,
  readCloister,
  score,
  scoreGate,
  scoreWalk,
  seedApiSucceeded,
  seedArchiveEndSession,
  seedBridgeFire,
  seedCapacityFull,
  seedClosed,
  seedCompline,
  seedControlTrial,
  seedEndSessionOnCompletion,
  seedExitNonzero,
  seedExitZero,
  seedHold,
  seedLingering,
  seedNoEndSession,
  seedPersistSessionFalse,
  seedPrintResume,
  seedProcessResident,
  seedResultSuccess,
  seedSlotFreed,
  seedSlotHeld,
  seedUiCancelled,
  seedUnrung,
} from "./compline.mjs";

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
  return fileURLToPath(new URL("./compline.mjs", import.meta.url));
}

test("idle closed is a hold; end_session on completion, exit 0, slot freed", () => {
  const result = analyze(seedClosed());
  assert.equal(result.verdict, "closed");
  assert.equal(result.idleWord, "closed");
  assert.equal(IDLE_WORD, "closed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.closed, true);
  assert.equal(result.phrase, "admit closed");
  assert.equal(result.lingering, false);
  assert.equal(result.unrung, false);
  assert.equal(result.endSessionOnCompletion, true);
  assert.equal(result.exitZero, true);
  assert.equal(result.slotFreed, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify closed", () => {
  assert.equal(classify(emptyTicket()), "closed");
  assert.equal(classify(""), "closed");
  assert.equal(classify(null), "closed");
  assert.equal(decide({}), "closed");
});

test("#93549 seeded path scores lingering when the print-resume child stays resident", () => {
  const result = analyze(seedLingering());
  assert.equal(result.verdict, "lingering");
  assert.equal(result.seededWord, "lingering");
  assert.equal(SEEDED_WORD, "lingering");
  assert.equal(PRODUCT_WORD, "compline");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lingering, true);
  assert.equal(result.phrase, "score compline");
  assert.equal(result.bridgeFire, true);
  assert.equal(result.printResume, true);
  assert.equal(result.resultSuccess, true);
  assert.equal(result.noEndSession, true);
  assert.equal(result.processResident, true);
  assert.equal(result.slotHeld, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("result success plus no end_session plus resident process is the #93549 compline", () => {
  const candle = inspectCandle({
    lingering: true,
    bridgeFire: true,
    printResume: true,
  });
  assert.equal(candle.stamp, "lit");
  assert.equal(candle.lit, true);
  const scored = scoreGate({
    lingering: true,
    bridgeFire: true,
    printResume: true,
    resultSuccess: true,
    noEndSession: true,
    processResident: true,
    slotHeld: true,
    cue: "lingering",
  });
  assert.equal(scored.verdict, "lingering");
  assert.equal(scored.unrung, false);
  const calm = inspectBell({
    closed: true,
    endSessionOnCompletion: true,
    exitZero: true,
  });
  assert.equal(calm.stamp, "closed");
});

test("path word is unrung; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "unrung");
  const result = analyze(seedUnrung());
  assert.equal(result.verdict, "unrung");
  assert.equal(result.pathWord, "unrung");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "unrung", preferSeed: true, lingering: true }),
    "unrung",
  );
  assert.equal(classify(seedPrintResume()), "print-resume");
});

test("HOLD includes closed / hold", () => {
  assert.ok(HOLD.includes("closed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: bridge-fire, print-resume, no-end-session, process-resident, archive-end-session, unrung", () => {
  assert.equal(classify(seedBridgeFire()), "bridge-fire");
  assert.equal(classify(seedPrintResume()), "print-resume");
  assert.equal(classify(seedResultSuccess()), "result-success");
  assert.equal(classify(seedNoEndSession()), "no-end-session");
  assert.equal(classify(seedProcessResident()), "process-resident");
  assert.equal(classify(seedSlotHeld()), "slot-held");
  assert.equal(classify(seedCapacityFull()), "capacity-full");
  assert.equal(classify(seedArchiveEndSession()), "archive-end-session");
  assert.equal(classify(seedExitNonzero()), "exit-nonzero");
  assert.equal(classify(seedUiCancelled()), "ui-cancelled");
  assert.equal(classify(seedApiSucceeded()), "api-succeeded");
  assert.equal(classify(seedEndSessionOnCompletion()), "end-session-on-completion");
  assert.equal(classify(seedExitZero()), "exit-zero");
  assert.equal(classify(seedSlotFreed()), "slot-freed");
  assert.equal(classify(seedPersistSessionFalse()), "persist-session-false");
  assert.equal(classify(seedControlTrial()), "control-trial");
  assert.equal(classify(seedCompline()), "compline");
});

test("booth fixtures flip closed vs lingering vs unrung vs compline", () => {
  const idle = scoreGate(seedClosed());
  const seeded = scoreGate(readData("lingering.json"));
  const closed = readData("closed.json");
  const lingering = readData("lingering.json");
  const path = readData("unrung.json");
  const product = readData("compline.json");
  const capacity = readData("capacity-full.json");
  assert.equal(idle.verdict, "closed");
  assert.equal(seeded.verdict, "lingering");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedClosed()), "closed");
  assert.equal(score(readData("lingering.json")), "lingering");
  assert.equal(closed.endSessionOnCompletion, true);
  assert.equal(closed.closed, true);
  assert.equal(scoreGate(closed).verdict, "closed");
  assert.equal(lingering.noEndSession, true);
  assert.equal(lingering.processResident, true);
  assert.equal(lingering.bridgeFire, true);
  assert.equal(classify(lingering), "lingering");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /print --resume/);
  assert.match(path.paths[2].result, /API SUCCEEDED/);
  assert.equal(classify(path), "unrung");
  assert.equal(classify(product), "compline");
  assert.equal(product.hubCount, "COMPLINE");
  assert.equal(lingering.issue, 93549);
  assert.equal(lingering.lingering, true);
  assert.equal(capacity.processCount, 14);
  assert.equal(classify(capacity), "capacity-full");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("closed"));
  assert.ok(CHIPS.includes("lingering"));
  assert.ok(CHIPS.includes("compline"));
  assert.ok(CHIPS.includes("unrung"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lingering"));
  assert.ok(ALARM.includes("unrung"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published compline walk scores lingering after the idle hold", () => {
  const cloister = scoreWalk({ rows: COMPLINE_WALK });
  assert.equal(cloister.verdict, "lingering");
  assert.ok(cloister.lingeringCount >= 1);
  const idle = cloister.rows.find((row) => row.event === "cue-closed");
  assert.equal(idle.closed, true);
  assert.equal(idle.verdict, "closed");
  const fire = cloister.rows.find((row) => row.event === "bridge-fire");
  assert.equal(fire.bridgeFire, true);
  const silent = cloister.rows.find((row) => row.event === "no-end-session");
  assert.equal(silent.lingering, true);
  const resident = cloister.rows.find((row) => row.event === "process-resident");
  assert.equal(resident.processResident, true);
  const path = cloister.rows.find((row) => row.event === "unrung");
  assert.equal(path.verdict, "unrung");
});

test("COMPLINE_WALK constant matches the issue cloister walk", () => {
  assert.equal(COMPLINE_WALK[0].event, "cue-closed");
  const fire = COMPLINE_WALK.find((row) => row.event === "bridge-fire");
  assert.equal(fire.bridgeFire, true);
  const path = COMPLINE_WALK.find((row) => row.event === "unrung");
  assert.equal(path.lingering, true);
  const scoreRow = COMPLINE_WALK.find((row) => row.event === "compline");
  assert.equal(scoreRow.lingering, true);
});

test("positive control end-session-on-completion stays closed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "closed");
  const said = walk.rows.find((row) => row.event === "end-session-on-completion");
  assert.equal(said.verdict, "closed");
  const exit = walk.rows.find((row) => row.event === "exit-zero");
  assert.equal(exit.exitZero, true);
  assert.equal(exit.verdict, "closed");
});

test("issue constants encode only #93549 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93549);
  assert.ok(ISSUE_URL.includes("93549"));
  assert.match(TITLE, /end_session/);
  assert.match(TITLE, /exits non-zero/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:routines"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.247");
  assert.equal(OS, "macOS Apple Silicon");
  assert.equal(CLIENT, "Desktop");
  assert.equal(SPAWN_FLAG, "claude remote-control --spawn=same-dir");
  assert.equal(TRIGGERS_PATH, "/v1/code/triggers");
  assert.equal(TRIGGER_KIND, "bridge");
  assert.equal(CHILD_COMMAND, "claude --print --resume=<cse_…>");
  assert.equal(PROCESS_COUNT, 14);
  assert.equal(COMBINED_RSS, "~1.9 GB");
  assert.equal(OLDEST_DAYS, 10);
  assert.equal(CONTROL_GAP, "six minutes");
  assert.equal(COMPLETED_AT, "01:18:02");
  assert.equal(STILL_ALIVE_AFTER, "20 minutes");
  assert.equal(SUCCESS_TURNS, 51);
  assert.equal(SUCCESS_DURATION, "720s");
  assert.equal(RESIDENT_HOURS, 18);
  assert.equal(RATE_LIMIT_EVENTS, 9);
  assert.equal(HOOK_EVENTS, 3);
  assert.match(DISTRIBUTION, /kind: bridge/);
  assert.match(SESSION_KIND, /print-resume/);
  assert.equal(CLOISTER_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("unrung"));
  assert.ok(FINGERPRINT_LINES.includes("lingering"));
  assert.match(PHRASE, /score compline or admit closed/);
});

test("has-repro fingerprints encode the published lingering child", () => {
  const result = handle(readData("lingering.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.247");
  assert.match(result.published.sessionKind, /print-resume/);
  assert.equal(result.published.childCommand, "claude --print --resume=<cse_…>");
  assert.match(
    fingerprint(seedLingering()),
    /lingering\|candle=lit\|stall=warm\|choir=open\|bell=silent\|path=closed\|cue=lingering/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Cipherlock and Attainder", () => {
  const required = [
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "untainted",
    "attainted",
    "attainder",
    "voiced",
    "muted",
    "sourdine",
    "kindled",
    "painted",
    "foxfire",
    "lodged",
    "dropped",
    "forksink",
    "flushed",
    "lagged",
    "pentimento",
    "solitary",
    "twinlinked",
    "vinculum",
    "hit",
    "flattened",
    "cachet",
    "washed",
    "pontoon",
    "quietus",
    "reaped",
    "revenant",
    "hawser",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("closed cloister flips lingering back when end_session is said", () => {
  const tape = {
    closed: true,
    lingering: false,
    endSessionOnCompletion: true,
    exitZero: true,
    slotFreed: true,
    noEndSession: false,
    cue: "closed",
  };
  assert.equal(scoreGate(tape).verdict, "closed");
  tape.closed = false;
  tape.lingering = true;
  tape.bridgeFire = true;
  tape.printResume = true;
  tape.resultSuccess = true;
  tape.noEndSession = true;
  tape.processResident = true;
  tape.cue = "lingering";
  assert.equal(scoreGate(tape).verdict, "lingering");
  tape.closed = true;
  tape.lingering = false;
  tape.noEndSession = false;
  tape.processResident = false;
  tape.endSessionOnCompletion = true;
  tape.exitZero = true;
  tape.cue = "closed";
  assert.equal(scoreGate(tape).verdict, "closed");
});

test("candle, stall, choir, bell, and readCloister mark lingering after a silent office", () => {
  const idle = inspectCandle({ closed: true, bridgeFire: false });
  assert.equal(idle.stamp, "snuffed");
  const candle = inspectCandle({
    lingering: true,
    bridgeFire: true,
    printResume: true,
  });
  assert.equal(candle.stamp, "lit");
  assert.equal(candle.lit, true);
  const stall = inspectStall({
    lingering: true,
    processResident: true,
    slotHeld: true,
  });
  assert.equal(stall.stamp, "warm");
  assert.equal(stall.warm, true);
  const choir = inspectChoir({
    lingering: true,
    capacityFull: true,
    processResident: true,
    processCount: 14,
  });
  assert.equal(choir.stamp, "full");
  assert.equal(choir.full, true);
  const bell = inspectBell({
    lingering: true,
    noEndSession: true,
  });
  assert.equal(bell.stamp, "silent");
  assert.equal(bell.silent, true);
  const archived = inspectBell({
    archiveEndSession: true,
    unrung: true,
  });
  assert.equal(archived.stamp, "cancelled");
  const cloister = readCloister({
    lingering: true,
    bridgeFire: true,
    printResume: true,
    noEndSession: true,
    processResident: true,
  });
  assert.equal(cloister.lingering, true);
  assert.equal(cloister.mark, "lingering");
  const calm = readCloister({
    closed: true,
    lingering: false,
    endSessionOnCompletion: true,
    exitZero: true,
    slotFreed: true,
  });
  assert.equal(calm.lingering, false);
  assert.equal(calm.mark, "closed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 54626);
  assert.equal(COUSINS[1].issue, 74682);
  assert.equal(COUSINS[2].issue, 83718);
  assert.equal(COUSINS[3].issue, 73900);
  assert.equal(COUSINS[4].issue, 72308);
  assert.equal(COUSINS[5].issue, 68626);
  assert.equal(COUSINS[6].issue, 73631);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cipherlock"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("quietus"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(NOT_PRODUCTS.includes("priory"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 93475);
  assert.equal(BACKUPS[10].issue, 93494);
  assert.equal(BACKUPS[11].issue, 93525);
  assert.equal(BACKUPS[12].issue, 34690);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lingering.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "closed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "lingering");
});

test("handle exposes published hypothesis and #93549 headline", () => {
  const result = handle(readData("lingering.json"));
  assert.equal(result.published.issue, 93549);
  assert.equal(result.published.claudeCodeVersion, "2.1.247");
  assert.deepEqual(result.published.cousins, [
    54626, 74682, 83718, 73900, 72308, 68626, 73631,
  ]);
  assert.ok(result.published.backups.includes(93475));
  assert.ok(result.published.backups.includes(93494));
  assert.ok(result.published.backups.includes(93525));
  assert.ok(result.published.backups.includes(34690));
  assert.match(result.published.hypothesis, /end_session/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a cloister / evening-office / compline booth, not vault or parchment", () => {
  const page = readPage();
  assert.match(page, /Alegreya/);
  assert.match(page, /Karla/);
  assert.match(page, /Red Hat Mono/);
  assert.match(page, /compline|cloister|choir stall|evening-office|closing bell/i);
  assert.match(page, /#1A1528|#E8C872|#8A8478|#EDE6D9|#9B3B4A|#5C4A7A/i);
  assert.match(page, /\bclosed\b/);
  assert.match(page, /lingering/);
  assert.match(page, /unrung/);
  assert.match(page, /score compline or admit closed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /16:50/);
  assert.match(page, /#288/);
  assert.match(page, /#93549/);
  assert.match(page, /2\.1\.247/);
  assert.match(page, /remote-control/);
  assert.match(page, /end_session/);
  assert.match(page, /print --resume/);
  assert.match(page, /Ring compline/);
  assert.match(page, /Score compline/);
  assert.match(page, /Open the stall/);
  assert.match(page, /Compare closed \/ lingering/);
  assert.match(page, /Pin idle closed/);
  assert.match(page, /Pin seeded lingering/);
  assert.match(page, /Pin unrung/);
  assert.match(page, /Clear the choir/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /#0E1218/);
  assert.doesNotMatch(page, /#C8A15A/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#8B1E1E/);
  assert.doesNotMatch(page, /#F0E6A8/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F2C14E/);
  assert.doesNotMatch(page, /#FFB020/);
  assert.doesNotMatch(page, /#3ECFBF/);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\bblanked\b/);
  assert.doesNotMatch(page, /\buntainted\b/);
  assert.doesNotMatch(page, /\battainted\b/);
  assert.doesNotMatch(page, /\bvoiced\b/);
  assert.doesNotMatch(page, /\bmuted\b/);
  assert.doesNotMatch(page, /\bmid-narration\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bdropped\b/);
  assert.doesNotMatch(page, /\bsource-fork\b/);
  assert.doesNotMatch(page, /\bkindled\b/);
  assert.doesNotMatch(page, /\bpainted\b/);
  assert.match(page, /NOT Cipherlock/i);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Quietus/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Compline/);
  assert.match(readme, /#93549/);
  assert.match(readme, /\bclosed\b/);
  assert.match(readme, /lingering/);
  assert.match(readme, /unrung/);
  assert.match(readme, /Alegreya/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Red Hat Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Cipherlock/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /2\.1\.247/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/compline/);
  assert.match(readme, /node --test projects\/compline\/compline\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /cloister|evening-office|choir stall|closing bell/i);
  assert.match(readme, /#54626/);
  assert.match(readme, /#72308/);
  assert.match(readme, /end_session/);
  assert.match(readme, /print --resume/);
});

test("catalog features Compline only; Cipherlock unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 288);
  assert.equal(hub.products.length, 288);
  assert.equal(catalog.products[0].name, "Compline");
  assert.equal(catalog.products[0].slug, "compline");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/compline/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /16:50/);
  assert.match(catalog.products[0].summary, /compline/);
  assert.match(catalog.products[0].summary, /#93549/);
  assert.match(catalog.products[0].summary, /\bclosed\b/);
  assert.match(catalog.products[0].summary, /lingering/);
  assert.match(catalog.products[0].summary, /unrung/);
  assert.equal(hub.products[0].slug, "compline");
  assert.equal(hub.products[0].featured, true);
  const cipherlock = catalog.products.find((row) => row.slug === "cipherlock");
  assert.ok(cipherlock);
  assert.equal(cipherlock.featured, false);
  const attainder = catalog.products.find((row) => row.slug === "attainder");
  assert.ok(attainder);
  assert.equal(attainder.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "compline").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93549") && row.slug !== "compline"));
});

test("vercel rewrites compline to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/compline");
  assert.equal(vercel.rewrites[0].destination, "/projects/compline");
  assert.equal(vercel.rewrites[1].source, "/compline/");
  assert.equal(vercel.rewrites[1].destination, "/projects/compline");
  assert.equal(vercel.rewrites[2].source, "/compline/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/compline/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
