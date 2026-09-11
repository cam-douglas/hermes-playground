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
  COUSINS,
  DESKTOP_BUILD,
  DISK_LOW_DAY,
  DISSEISIN_WALK,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOME_PATH,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOG_PATH,
  MANOR_STATIONS,
  NOT_PRODUCTS,
  OS,
  PAIR_COUNT,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RCW_PATTERN,
  RCW_USER,
  RECOVERY_ATTEMPT,
  RECOVERY_FAILED,
  SAMPLE_DOCKET,
  SAMPLE_GHOST,
  SAMPLE_TENEMENT,
  SDK_BINARY,
  SEEDED_WORD,
  SESSION_KIND,
  SESSIONS_PREFIX,
  SPAN_DAYS,
  SPAN_END,
  SPAN_START,
  STATE,
  SUPPORT_MAILS,
  SUPPORT_SINCE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDocket,
  inspectGhost,
  inspectRoll,
  inspectTenement,
  inspectWrit,
  readManor,
  score,
  scoreGate,
  scoreWalk,
  seedAdmitGone,
  seedCleanReconnect,
  seedCoworkdLog,
  seedDiskLowRuledOut,
  seedDisseised,
  seedDisseisin,
  seedFolderLost,
  seedFourteenDays,
  seedGhostConnected,
  seedHold,
  seedHomeEvaporated,
  seedHomeIntact,
  seedPairThirty,
  seedRcwUser,
  seedRecoveryFailed,
  seedSeised,
  seedSessionsVoid,
  seedToolCallsFail,
  seedVmRestart,
} from "./disseisin.mjs";

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
  return fileURLToPath(new URL("./disseisin.mjs", import.meta.url));
}

test("idle seised is a hold; home intact after restart", () => {
  const result = analyze(seedSeised());
  assert.equal(result.verdict, "seised");
  assert.equal(result.idleWord, "seised");
  assert.equal(IDLE_WORD, "seised");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.seised, true);
  assert.equal(result.phrase, "admit seised");
  assert.equal(result.disseised, false);
  assert.equal(result.homeEvaporated, false);
  assert.equal(result.homeIntact, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify seised", () => {
  assert.equal(classify(emptyTicket()), "seised");
  assert.equal(classify(""), "seised");
  assert.equal(classify(null), "seised");
  assert.equal(decide({}), "seised");
});

test("#93574 seeded path scores disseised when the home evaporates", () => {
  const result = analyze(seedDisseised());
  assert.equal(result.verdict, "disseised");
  assert.equal(result.seededWord, "disseised");
  assert.equal(SEEDED_WORD, "disseised");
  assert.equal(PRODUCT_WORD, "disseisin");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.disseised, true);
  assert.equal(result.phrase, "score disseisin");
  assert.equal(result.sessionsVoid, true);
  assert.equal(result.recoveryFailed, true);
  assert.equal(result.ghostConnected, true);
  assert.equal(result.toolCallsFail, true);
  assert.equal(result.vmRestart, true);
  assert.equal(result.homeEvaporated, true);
  assert.equal(result.pairThirty, true);
  assert.equal(result.diskLowRuledOut, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("sessions void plus ghost connected is the #93574 disseisin", () => {
  const tenement = inspectTenement({ tenement: SAMPLE_TENEMENT, sessionsVoid: true });
  assert.equal(tenement.stamp, "void");
  assert.equal(tenement.voided, true);
  assert.equal(tenement.path, HOME_PATH);
  const scored = scoreGate({
    disseised: true,
    sessionsVoid: true,
    recoveryFailed: true,
    ghostConnected: true,
    toolCallsFail: true,
    vmRestart: true,
    homeEvaporated: true,
    cue: "disseised",
    tenement: SAMPLE_TENEMENT,
    ghost: SAMPLE_GHOST,
  });
  assert.equal(scored.verdict, "disseised");
  assert.equal(scored.homeEvaporated, true);
  const calm = inspectTenement({ seised: true, homeIntact: true });
  assert.equal(calm.stamp, "intact");
});

test("path word is home-evaporated; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "home-evaporated");
  const result = analyze(seedHomeEvaporated());
  assert.equal(result.verdict, "home-evaporated");
  assert.equal(result.pathWord, "home-evaporated");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "home-evaporated", preferSeed: true, disseised: true }),
    "home-evaporated",
  );
  assert.equal(classify(seedSessionsVoid()), "sessions-void");
});

test("HOLD includes seised / hold", () => {
  assert.ok(HOLD.includes("seised"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: sessions-void, recovery-failed, ghost-connected, vm-restart", () => {
  assert.equal(classify(seedHomeIntact()), "home-intact");
  assert.equal(classify(seedSessionsVoid()), "sessions-void");
  assert.equal(classify(seedRecoveryFailed()), "recovery-failed");
  assert.equal(classify(seedGhostConnected()), "ghost-connected");
  assert.equal(classify(seedToolCallsFail()), "tool-calls-fail");
  assert.equal(classify(seedVmRestart()), "vm-restart");
  assert.equal(classify(seedPairThirty()), "pair-thirty");
  assert.equal(classify(seedFourteenDays()), "fourteen-days");
  assert.equal(classify(seedDiskLowRuledOut()), "disk-low-ruled-out");
  assert.equal(classify(seedRcwUser()), "rcw-user");
  assert.equal(classify(seedCoworkdLog()), "coworkd-log");
  assert.equal(classify(seedFolderLost()), "folder-lost");
  assert.equal(classify(seedAdmitGone()), "admit-gone");
  assert.equal(classify(seedCleanReconnect()), "clean-reconnect");
  assert.equal(classify(seedDisseisin()), "disseisin");
});

test("booth fixtures flip seised vs disseised vs home-evaporated vs disseisin", () => {
  const idle = scoreGate(seedSeised());
  const seeded = scoreGate(readData("disseised.json"));
  const seised = readData("seised.json");
  const disseised = readData("disseised.json");
  const path = readData("home-evaporated.json");
  const product = readData("disseisin.json");
  const sessions = readData("sessions-void.json");
  const recovery = readData("recovery-failed.json");
  const coworkd = readData("coworkd-log.json");
  const ghost = readData("ghost-connected.json");
  const restart = readData("vm-restart.json");
  assert.equal(idle.verdict, "seised");
  assert.equal(seeded.verdict, "disseised");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSeised()), "seised");
  assert.equal(score(readData("disseised.json")), "disseised");
  assert.equal(seised.homeIntact, true);
  assert.equal(seised.seised, true);
  assert.equal(scoreGate(seised).verdict, "seised");
  assert.equal(disseised.sessionsVoid, true);
  assert.equal(disseised.ghostConnected, true);
  assert.equal(disseised.recoveryFailed, true);
  assert.equal(classify(disseised), "disseised");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /\/sessions\//);
  assert.match(path.paths[2].result, /ghost connected/);
  assert.equal(classify(path), "home-evaporated");
  assert.equal(classify(product), "disseisin");
  assert.equal(product.hubCount, "DISSEISIN");
  assert.equal(disseised.issue, 93574);
  assert.equal(disseised.disseised, true);
  assert.equal(classify(sessions), "sessions-void");
  assert.equal(sessions.homePath, HOME_PATH);
  assert.equal(classify(recovery), "recovery-failed");
  assert.equal(classify(coworkd), "coworkd-log");
  assert.match(coworkd.lines[0], /should exist but doesn't/);
  assert.equal(classify(ghost), "ghost-connected");
  assert.equal(classify(restart), "vm-restart");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("seised"));
  assert.ok(CHIPS.includes("disseised"));
  assert.ok(CHIPS.includes("disseisin"));
  assert.ok(CHIPS.includes("home-evaporated"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("disseised"));
  assert.ok(ALARM.includes("home-evaporated"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published disseisin walk scores disseised after the idle hold", () => {
  const manor = scoreWalk({ rows: DISSEISIN_WALK });
  assert.equal(manor.verdict, "disseised");
  assert.ok(manor.disseisedCount >= 1);
  const idle = manor.rows.find((row) => row.event === "cue-seised");
  assert.equal(idle.seised, true);
  assert.equal(idle.verdict, "seised");
  const voided = manor.rows.find((row) => row.event === "sessions-void");
  assert.equal(voided.sessionsVoid, true);
  const path = manor.rows.find((row) => row.event === "home-evaporated");
  assert.equal(path.verdict, "home-evaporated");
});

test("DISSEISIN_WALK constant matches the issue manor walk", () => {
  assert.equal(DISSEISIN_WALK[0].event, "cue-seised");
  const restart = DISSEISIN_WALK.find((row) => row.event === "vm-restart");
  assert.equal(restart.vmRestart, true);
  const path = DISSEISIN_WALK.find((row) => row.event === "home-evaporated");
  assert.equal(path.disseised, true);
  const scoreRow = DISSEISIN_WALK.find((row) => row.event === "disseisin");
  assert.equal(scoreRow.disseised, true);
});

test("positive control home-intact stays seised", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "seised");
  const intact = walk.rows.find((row) => row.event === "home-intact");
  assert.equal(intact.verdict, "seised");
  const admit = walk.rows.find((row) => row.event === "admit-gone");
  assert.equal(admit.admitGone, true);
  assert.equal(admit.verdict, "seised");
});

test("issue constants encode only #93574 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93574);
  assert.ok(ISSUE_URL.includes("93574"));
  assert.match(TITLE, /home directory on VM restart/);
  assert.match(TITLE, /connected folder/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.260");
  assert.match(OS, /macOS 26/);
  assert.match(OS, /Darwin 24\.6\.0/);
  assert.equal(CLIENT, "Cowork");
  assert.equal(SDK_BINARY, "2.1.260");
  assert.match(DESKTOP_BUILD, /2\.1\.260/);
  assert.equal(LOG_PATH, "~/Library/Logs/Claude/coworkd.log");
  assert.equal(RCW_USER, "rcw-01toqkmz1tbremcwdforbzyz");
  assert.ok(RCW_PATTERN.test(RCW_USER));
  assert.equal(HOME_PATH, "/sessions/rcw-01toqkmz1tbremcwdforbzyz");
  assert.equal(SESSIONS_PREFIX, "/sessions/");
  assert.match(RECOVERY_ATTEMPT, /should exist but doesn't/);
  assert.match(RECOVERY_FAILED, /does not exist/);
  assert.equal(PAIR_COUNT, 30);
  assert.equal(SPAN_DAYS, 14);
  assert.equal(SPAN_START, "2026-04-27");
  assert.equal(SPAN_END, "2026-09-10");
  assert.equal(DISK_LOW_DAY, "2026-09-10");
  assert.equal(SUPPORT_MAILS, 7);
  assert.equal(SUPPORT_SINCE, "2026-09-06");
  assert.match(DISTRIBUTION, /2\.1\.260/);
  assert.match(SESSION_KIND, /\/sessions\//);
  assert.equal(MANOR_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("home-evaporated"));
  assert.ok(FINGERPRINT_LINES.includes("disseised"));
  assert.match(PHRASE, /Score disseisin or admit seised/);
  assert.equal(SAMPLE_TENEMENT.path, HOME_PATH);
  assert.equal(SAMPLE_GHOST.folderConnected, true);
  assert.ok(SAMPLE_DOCKET.some((row) => /recovery failed/.test(row.line)));
});

test("has-repro fingerprints encode the published evaporated home", () => {
  const result = handle(readData("disseised.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.match(result.published.sessionKind, /\/sessions\//);
  assert.equal(result.published.rcwUser, RCW_USER);
  assert.match(
    fingerprint(seedDisseised()),
    /disseised\|tenement=void\|roll=rcw\|writ=restart\|ghost=connected\|docket=failed\|path=home-evaporated\|cue=home-evaporated/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Analepsis and Monstrance", () => {
  const required = [
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "compline",
    "lingering",
    "unrung",
    "closed",
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
    "imprimatur",
    "ukase",
    "understudy",
    "fetch",
    "homestead",
    "oubliette",
    "mirage",
    "wraith",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("seised manor flips disseised back when the tenement is restored", () => {
  const tape = {
    seised: true,
    disseised: false,
    homeIntact: true,
    sessionsVoid: false,
    cue: "seised",
  };
  assert.equal(scoreGate(tape).verdict, "seised");
  tape.seised = false;
  tape.disseised = true;
  tape.sessionsVoid = true;
  tape.ghostConnected = true;
  tape.recoveryFailed = true;
  tape.cue = "disseised";
  assert.equal(scoreGate(tape).verdict, "disseised");
  tape.seised = true;
  tape.disseised = false;
  tape.sessionsVoid = false;
  tape.ghostConnected = false;
  tape.recoveryFailed = false;
  tape.cue = "seised";
  assert.equal(scoreGate(tape).verdict, "seised");
});

test("tenement, roll, writ, ghost, docket, and readManor mark the evaporated home", () => {
  const idle = inspectTenement({ seised: true, homeIntact: true });
  assert.equal(idle.stamp, "intact");
  const tenement = inspectTenement({
    disseised: true,
    sessionsVoid: true,
    tenement: SAMPLE_TENEMENT,
  });
  assert.equal(tenement.stamp, "void");
  assert.equal(tenement.voided, true);
  const roll = inspectRoll({
    disseised: true,
    ghostConnected: true,
  });
  assert.equal(roll.stamp, "enrolled");
  assert.equal(roll.claimed, true);
  const writ = inspectWrit({
    disseised: true,
    vmRestart: true,
  });
  assert.equal(writ.stamp, "novel-disseisin");
  assert.equal(writ.issued, true);
  const ghost = inspectGhost({
    disseised: true,
    ghostConnected: true,
  });
  assert.equal(ghost.stamp, "ghost");
  assert.equal(ghost.connected, true);
  const docket = inspectDocket({ docket: SAMPLE_DOCKET });
  assert.equal(docket.stamp, "failed");
  assert.equal(docket.pair, true);
  const manor = readManor({
    disseised: true,
    sessionsVoid: true,
    recoveryFailed: true,
    ghostConnected: true,
    tenement: SAMPLE_TENEMENT,
  });
  assert.equal(manor.disseised, true);
  assert.equal(manor.mark, "disseised");
  const calm = readManor({
    seised: true,
    disseised: false,
    homeIntact: true,
  });
  assert.equal(calm.disseised, false);
  assert.equal(calm.mark, "seised");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 24483);
  assert.equal(COUSINS[1].issue, 24190);
  assert.equal(COUSINS[2].issue, 24549);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("analepsis"));
  assert.ok(NOT_PRODUCTS.includes("monstrance"));
  assert.ok(NOT_PRODUCTS.includes("compline"));
  assert.ok(NOT_PRODUCTS.includes("cipherlock"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("homestead"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93576);
  assert.equal(BACKUPS[1].issue, 93553);
  assert.equal(BACKUPS[2].issue, 93546);
  assert.equal(BACKUPS[3].issue, 93530);
  assert.equal(BACKUPS[4].issue, 93556);
  assert.equal(BACKUPS[5].issue, 93570);
  assert.equal(BACKUPS[6].issue, 93588);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/disseised.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "seised");
  assert.equal(JSON.parse(seeded.stdout).verdict, "disseised");
});

test("handle exposes published hypothesis and #93574 headline", () => {
  const result = handle(readData("disseised.json"));
  assert.equal(result.published.issue, 93574);
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.deepEqual(result.published.cousins, [24483, 24190, 24549]);
  assert.ok(result.published.backups.includes(93576));
  assert.ok(result.published.backups.includes(93588));
  assert.ok(result.published.backups.includes(93570));
  assert.match(result.published.hypothesis, /\/sessions\//);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /ephemeral/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a court-of-novel-disseisin / manor-roll booth, not flashback or sanctuary", () => {
  const page = readPage();
  assert.match(page, /Crimson Pro/);
  assert.match(page, /Red Hat Text/);
  assert.match(page, /Ubuntu Mono/);
  assert.match(page, /disseisin|manor|writ|freehold|seised|tenement|docket/i);
  assert.match(page, /#F7E8C8|#2F2418|#7A3A28|#4E6B4F|#C48A3A|#1E2A24/i);
  assert.match(page, /\bseised\b/);
  assert.match(page, /disseised/);
  assert.match(page, /home-evaporated/);
  assert.match(page, /Score disseisin or admit seised/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /19:50/);
  assert.match(page, /#291/);
  assert.match(page, /#93574/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /rcw-01toqkmz1tbremcwdforbzyz/);
  assert.match(page, /\/sessions\//);
  assert.match(page, /coworkd\.log/);
  assert.match(page, /Call the roll/);
  assert.match(page, /Score disseisin/);
  assert.match(page, /Issue the writ/);
  assert.match(page, /Compare seised \/ disseised/);
  assert.match(page, /Pin idle seised/);
  assert.match(page, /Pin seeded disseised/);
  assert.match(page, /Pin home-evaporated/);
  assert.match(page, /Restore the freehold/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Gilda Display/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Anonymous Pro/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Old Standard TT/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /#F3E6CE/);
  assert.doesNotMatch(page, /#2A1A14/);
  assert.doesNotMatch(page, /#C17A45/);
  assert.doesNotMatch(page, /#3E2C38/);
  assert.doesNotMatch(page, /#140E18/);
  assert.doesNotMatch(page, /#D4A84B/);
  assert.doesNotMatch(page, /#8C6A2F/);
  assert.doesNotMatch(page, /#F4EBD8/);
  assert.doesNotMatch(page, /#8B1E2D/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#F0E6A8/);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\bordered\b/);
  assert.doesNotMatch(page, /\bredelivered\b/);
  assert.doesNotMatch(page, /\bviewed\b/);
  assert.doesNotMatch(page, /\bwithheld\b/);
  assert.doesNotMatch(page, /\bphantom-deny\b/);
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\bblanked\b/);
  assert.doesNotMatch(page, /\blingering\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.match(page, /NOT Analepsis/i);
  assert.match(page, /NOT Monstrance/i);
  assert.match(page, /NOT Compline/i);
  assert.match(page, /NOT Cipherlock/i);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Homestead/i);
  assert.match(page, /NOT Oubliette/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Disseisin/);
  assert.match(readme, /#93574/);
  assert.match(readme, /\bseised\b/);
  assert.match(readme, /disseised/);
  assert.match(readme, /home-evaporated/);
  assert.match(readme, /Crimson Pro/);
  assert.match(readme, /Red Hat Text/);
  assert.match(readme, /Ubuntu Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Analepsis/i);
  assert.match(readme, /NOT Monstrance/i);
  assert.match(readme, /NOT Compline/i);
  assert.match(readme, /NOT Cipherlock/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Homestead/i);
  assert.match(readme, /NOT Oubliette/i);
  assert.match(readme, /2\.1\.260/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/disseisin/);
  assert.match(readme, /node --test projects\/disseisin\/disseisin\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /manor|writ|freehold|novel disseisin/i);
  assert.match(readme, /#24483/);
  assert.match(readme, /#24190/);
  assert.match(readme, /#24549/);
  assert.match(readme, /\/sessions\//);
  assert.match(readme, /Score disseisin or admit seised/);
});

test("catalog features Disseisin only; Analepsis unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 291);
  assert.equal(hub.products.length, 291);
  assert.equal(catalog.products[0].name, "Disseisin");
  assert.equal(catalog.products[0].slug, "disseisin");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/disseisin/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /19:50/);
  assert.match(catalog.products[0].summary, /disseisin/);
  assert.match(catalog.products[0].summary, /#93574/);
  assert.match(catalog.products[0].summary, /\bseised\b/);
  assert.match(catalog.products[0].summary, /disseised/);
  assert.match(catalog.products[0].summary, /home-evaporated/);
  assert.equal(hub.products[0].slug, "disseisin");
  assert.equal(hub.products[0].featured, true);
  const analepsis = catalog.products.find((row) => row.slug === "analepsis");
  assert.ok(analepsis);
  assert.equal(analepsis.featured, false);
  const monstrance = catalog.products.find((row) => row.slug === "monstrance");
  assert.ok(monstrance);
  assert.equal(monstrance.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "disseisin").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93574") && row.slug !== "disseisin"));
});

test("vercel catch-all already serves /:slug to /projects/:slug", () => {
  const vercel = readVercel();
  const bare = vercel.rewrites.find((row) => row.source === "/:slug");
  const slash = vercel.rewrites.find((row) => row.source === "/:slug/");
  assert.ok(bare);
  assert.equal(bare.destination, "/projects/:slug");
  assert.ok(slash);
  assert.equal(slash.destination, "/projects/:slug");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
