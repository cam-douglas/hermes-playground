import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DESKTOP_VERSION,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LIVENESS_FN,
  NAV_ACTIVE,
  NAV_ENTRIES,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PIER_STATIONS,
  PONTOON_WALK,
  PREV_DESKTOP,
  PRODUCT_WORD,
  QUIT_CLEANUP,
  SEEDED_WORD,
  SESSIONS_STOPPED,
  STATE,
  TITLE,
  TRIGGERS,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectPier,
  readPier,
  readTide,
  score,
  scoreGate,
  scoreWalk,
  seedAfloat,
  seedBridgeLoss,
  seedComputeOnly,
  seedEligibleButDark,
  seedHold,
  seedNavRestore,
  seedNoLoadTrigger,
  seedOnQuitStopAll,
  seedPhoneEmpty,
  seedPontoon,
  seedSidebarLie,
  seedStealthRelaunch,
  seedWashed,
} from "./pontoon.mjs";

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

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./pontoon.mjs", import.meta.url));
}

test("idle afloat is a hold; RC attached and phone can reach", () => {
  const result = analyze(seedAfloat());
  assert.equal(result.verdict, "afloat");
  assert.equal(result.idleWord, "afloat");
  assert.equal(IDLE_WORD, "afloat");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.afloat, true);
  assert.equal(result.phrase, "admit afloat");
  assert.equal(result.rcAttached, true);
  assert.equal(result.phoneEmpty, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify afloat", () => {
  assert.equal(classify(emptyTicket()), "afloat");
  assert.equal(classify(""), "afloat");
  assert.equal(classify(null), "afloat");
  assert.equal(decide({}), "afloat");
});

test("#93288 seeded path scores washed when stealth relaunch stops bridges", () => {
  const result = analyze(seedWashed());
  assert.equal(result.verdict, "washed");
  assert.equal(result.seededWord, "washed");
  assert.equal(SEEDED_WORD, "washed");
  assert.equal(PRODUCT_WORD, "pontoon");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.washed, true);
  assert.equal(result.phrase, "score pontoon");
  assert.equal(result.stealthRelaunch, true);
  assert.equal(result.onQuitStopAll, true);
  assert.equal(result.sessionsStopped, 10);
  assert.equal(result.phoneEmpty, true);
  assert.equal(result.sidebarIntact, true);
  assert.equal(result.eligible, true);
  assert.equal(result.loadTrigger, false);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("stealth relaunch plus stop-all is the #93288 wash", () => {
  const span = inspectPier({
    stealthRelaunch: true,
    onQuitStopAll: true,
    phoneEmpty: true,
    washed: true,
    bridgesGone: true,
  });
  assert.equal(span.afloat, false);
  assert.equal(span.washed, true);
  assert.equal(span.stamp, "washed");
  const scored = scoreGate({
    stealthRelaunch: true,
    onQuitStopAll: true,
    sessionsStopped: 10,
    phoneEmpty: true,
    sidebarIntact: true,
    eligible: true,
    bridgesGone: true,
    washed: true,
    cue: "washed",
  });
  assert.equal(scored.verdict, "washed");
  assert.equal(scored.phoneEmpty, true);
  const calm = inspectPier({
    rcAttached: true,
    phoneEmpty: false,
    washed: false,
  });
  assert.equal(calm.afloat, true);
  assert.equal(calm.stamp, "afloat");
});

test("path word is bridge-loss; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "bridge-loss");
  const result = analyze(seedBridgeLoss());
  assert.equal(result.verdict, "bridge-loss");
  assert.equal(result.pathWord, "bridge-loss");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "bridge-loss", preferSeed: true, bridgesGone: true }),
    "bridge-loss",
  );
  assert.equal(classify(seedSidebarLie()), "sidebar-lie");
});

test("HOLD includes afloat / hold", () => {
  assert.ok(HOLD.includes("afloat"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: stealth, quit, nav, sidebar, phone, eligible, load, compute", () => {
  assert.equal(classify(seedStealthRelaunch()), "stealth-relaunch");
  assert.equal(classify(seedOnQuitStopAll()), "on-quit-stop-all");
  assert.equal(analyze(seedOnQuitStopAll()).sessionsStopped, 10);
  assert.equal(classify(seedNavRestore()), "nav-restore");
  assert.equal(classify(seedSidebarLie()), "sidebar-lie");
  assert.equal(classify(seedPhoneEmpty()), "phone-empty");
  assert.equal(classify(seedEligibleButDark()), "eligible-but-dark");
  assert.equal(classify(seedNoLoadTrigger()), "no-load-trigger");
  assert.equal(classify(seedComputeOnly()), "compute-only-liveness");
  assert.equal(classify(seedPontoon()), "pontoon");
});

test("fixture toggle flips afloat vs washed", () => {
  const idle = scoreGate(seedAfloat());
  const seeded = scoreGate(readData("pontoon.json"));
  assert.equal(idle.verdict, "afloat");
  assert.equal(seeded.verdict, "washed");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAfloat()), "afloat");
  assert.equal(score(readData("pontoon.json")), "washed");
  const fixture = readData("pontoon.json");
  assert.equal(fixture.sessionsStopped, 10);
  assert.equal(fixture.phoneEmpty, true);
  assert.equal(fixture.sidebarIntact, true);
  assert.equal(fixture.eligible, true);
  assert.equal(fixture.loadTrigger, false);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("afloat"));
  assert.ok(CHIPS.includes("washed"));
  assert.ok(CHIPS.includes("pontoon"));
  assert.ok(CHIPS.includes("bridge-loss"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("washed"));
  assert.ok(ALARM.includes("bridge-loss"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published pontoon walk scores washed after the idle hold", () => {
  const desk = scoreWalk({ rows: PONTOON_WALK });
  assert.equal(desk.verdict, "washed");
  assert.ok(desk.washedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-afloat");
  assert.equal(idle.afloat, true);
  assert.equal(idle.verdict, "afloat");
  const relaunch = desk.rows.find((row) => row.event === "stealth-relaunch");
  assert.equal(relaunch.stealthRelaunch, true);
  const quit = desk.rows.find((row) => row.event === "on-quit-stop-all");
  assert.equal(quit.sessionsStopped, 10);
  const nav = desk.rows.find((row) => row.event === "nav-restore");
  assert.equal(nav.navRestore, true);
  const lie = desk.rows.find((row) => row.event === "sidebar-lie");
  assert.equal(lie.sidebarIntact, true);
  const phone = desk.rows.find((row) => row.event === "phone-empty");
  assert.equal(phone.phoneEmpty, true);
  const eligible = desk.rows.find((row) => row.event === "eligible-but-dark");
  assert.equal(eligible.eligible, true);
  const load = desk.rows.find((row) => row.event === "no-load-trigger");
  assert.equal(load.loadTrigger, false);
  const live = desk.rows.find((row) => row.event === "compute-only-liveness");
  assert.equal(live.turnRunning, false);
  const cut = desk.rows.find((row) => row.event === "washed");
  assert.equal(cut.washed, true);
  const path = desk.rows.find((row) => row.event === "bridge-loss");
  assert.equal(path.verdict, "bridge-loss");
});

test("PONTOON_WALK constant matches the issue pier walk", () => {
  assert.equal(PONTOON_WALK[0].event, "cue-afloat");
  const quit = PONTOON_WALK.find((row) => row.event === "on-quit-stop-all");
  assert.equal(quit.sessionsStopped, 10);
  const cut = PONTOON_WALK.find((row) => row.event === "washed");
  assert.equal(cut.phoneEmpty, true);
  const path = PONTOON_WALK.find((row) => row.event === "bridge-loss");
  assert.equal(path.bridgesGone, true);
});

test("issue constants encode only #93288 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93288);
  assert.ok(ISSUE_URL.includes("93288"));
  assert.match(TITLE, /Remote Control session bridge/);
  assert.match(TITLE, /no recovery and no notice/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(AUTHOR, "joshwillett");
  assert.equal(FILED, "2026-09-10T07:25:00Z");
  assert.equal(CLAUDE_VERSION, "2.1.260");
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.equal(PREV_DESKTOP, "1.46388.4");
  assert.match(OS, /macOS 15\.6/);
  assert.equal(SESSIONS_STOPPED, 10);
  assert.equal(NAV_ENTRIES, 50);
  assert.equal(NAV_ACTIVE, 49);
  assert.equal(LIVENESS_FN, "hasActiveClaudeWork");
  assert.match(QUIT_CLEANUP, /onQuitCleanup/);
  assert.deepEqual([...TRIGGERS], ["first_turn", "cold_resume", "warm_send"]);
  assert.equal(PIER_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("Stopping 10 active session(s) on quit"));
  assert.ok(FINGERPRINT_LINES.includes("remoteControlAutoEligible: true"));
  assert.match(PHRASE, /score pontoon or admit afloat/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "reaped",
    "restored",
    "expanded",
    "laid",
    "released",
    "freehold",
    "trunked",
    "tokenized",
    "locked",
    "scratched",
    "unmasked",
    "revenant",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
    "concordant",
    "mismatched",
    "concordat",
    "header-mismatch",
    "moored",
    "scuttled",
    "held",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("afloat pier flips washed back when bridges stay up", () => {
  const tape = {
    afloat: true,
    rcAttached: true,
    phoneEmpty: false,
    washed: false,
    bridgesGone: false,
    cue: "afloat",
  };
  assert.equal(scoreGate(tape).verdict, "afloat");
  tape.afloat = false;
  tape.washed = true;
  tape.phoneEmpty = true;
  tape.bridgesGone = true;
  tape.stealthRelaunch = true;
  tape.cue = "washed";
  assert.equal(scoreGate(tape).verdict, "washed");
  tape.afloat = true;
  tape.washed = false;
  tape.phoneEmpty = false;
  tape.bridgesGone = false;
  tape.stealthRelaunch = false;
  tape.rcAttached = true;
  tape.cue = "afloat";
  assert.equal(scoreGate(tape).verdict, "afloat");
});

test("pier, tide, and sidebar mark wash after stealth relaunch", () => {
  const idle = inspectPier({
    rcAttached: true,
    phoneEmpty: false,
  });
  assert.equal(idle.stamp, "afloat");
  assert.equal(idle.washed, false);
  const cut = inspectPier({
    washed: true,
    bridgesGone: true,
    phoneEmpty: true,
  });
  assert.equal(cut.stamp, "washed");
  const live = readTide({
    stealthRelaunch: false,
    onQuitStopAll: false,
  });
  assert.equal(live.stamp, "afloat");
  const reject = readTide({
    stealthRelaunch: true,
    onQuitStopAll: true,
    sessionsStopped: 10,
  });
  assert.equal(reject.stamp, "washed");
  assert.equal(reject.sessionsStopped, 10);
  const desk = readPier({
    stealthRelaunch: true,
    onQuitStopAll: true,
    phoneEmpty: true,
    sidebarIntact: true,
    washed: true,
    bridgesGone: true,
  });
  assert.equal(desk.washed, true);
  assert.equal(desk.cue, "washed");
  const calm = readPier({
    rcAttached: true,
    phoneEmpty: false,
    washed: false,
  });
  assert.equal(calm.washed, false);
  assert.equal(calm.cue, "afloat");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 73565);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("replevin"));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("buoy"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93279);
  assert.equal(BACKUPS[5].issue, 93239);
  assert.equal(BACKUPS[6].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/pontoon.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "afloat");
  assert.equal(JSON.parse(seeded.stdout).verdict, "washed");
});

test("handle exposes published hypothesis and #93288 headline", () => {
  const result = handle(readData("pontoon.json"));
  assert.equal(result.published.issue, 93288);
  assert.equal(result.published.claudeVersion, "2.1.260");
  assert.equal(result.published.author, "joshwillett");
  assert.equal(result.published.sessionsStopped, 10);
  assert.equal(result.published.desktopVersion, "1.49585.0");
  assert.deepEqual(result.published.cousins, [73565]);
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /maybeAutoEnableRemoteControl/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedWashed()),
    /washed\|phone=empty\|sidebar=intact\|eligible=true\|relaunch=stealth\|cue=washed/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a harbor pontoon / floating-bridge pier, not a treaty desk", () => {
  const page = readPage();
  assert.match(page, /Petrona/);
  assert.match(page, /Figtree/);
  assert.match(page, /Azeret Mono/);
  assert.match(page, /pontoon|floating-bridge|timber deck|harbor/i);
  assert.match(page, /#061018|#2b1d12|#b7c5d0|#e59a18|#c9a36a/);
  assert.match(page, /afloat/);
  assert.match(page, /washed/);
  assert.match(page, /bridge-loss/);
  assert.match(page, /score pontoon or admit afloat/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /18:50/);
  assert.match(page, /#268/);
  assert.match(page, /#93288/);
  assert.match(page, /joshwillett/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /Sound the fog/);
  assert.match(page, /Score pontoon/);
  assert.match(page, /Walk the pier/);
  assert.match(page, /Check the bridges/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /DM Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#f7e8c8/);
  assert.doesNotMatch(page, /#a11f32/);
  assert.doesNotMatch(page, /#1a140e/);
  assert.doesNotMatch(page, /#d4b05a/);
  assert.doesNotMatch(page, /#0c0a0d/);
  assert.doesNotMatch(page, /#cfc6b8/);
  assert.doesNotMatch(page, /#6e5a9a/);
  assert.doesNotMatch(page, /#b34728/);
  assert.doesNotMatch(page, /#e6d5b8/);
  assert.doesNotMatch(page, /#1b4d3e/);
  assert.doesNotMatch(page, /#a86b32/);
  assert.doesNotMatch(page, /#f4ead6/);
  assert.doesNotMatch(page, /#1c2744/);
  assert.doesNotMatch(page, /#c47a2c/);
  assert.doesNotMatch(page, /#f0d9a0/);
  assert.doesNotMatch(page, /#0a0e1c/);
  assert.doesNotMatch(page, /#12151f/);
  assert.doesNotMatch(page, /#c3924a/);
  assert.doesNotMatch(page, /#efe6d4/);
  assert.doesNotMatch(page, /séance|seance|process-tomb|graveyard|charcoal bone|cold violet/i);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /philology|ochre gloss|cognate desk/i);
  assert.doesNotMatch(page, /writ desk|bond parchment|court green|bronze seal/i);
  assert.doesNotMatch(page, /flintlock|flash-pan|priming-pan/i);
  assert.doesNotMatch(page, /water clock/);
  assert.doesNotMatch(page, /chancery|treaty-desk|protocol.desk|diplomatic|seal-wax/i);
  assert.doesNotMatch(page, /parchment vellum|walnut ink/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\breplevin\b/);
  assert.doesNotMatch(page, /\bcognate\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bexpanded\b/);
  assert.doesNotMatch(page, /\brestored\b/);
  assert.doesNotMatch(page, /\bconcordant\b/);
  assert.doesNotMatch(page, /\bmismatched\b/);
  assert.doesNotMatch(page, /\bconcordat\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.match(page, /NOT Concordat/i);
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Buoy/i);
  assert.match(page, /NOT Vernier/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Pontoon/);
  assert.match(readme, /#93288/);
  assert.match(readme, /afloat/);
  assert.match(readme, /washed/);
  assert.match(readme, /bridge-loss/);
  assert.match(readme, /Petrona/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Azeret Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT Replevin/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Buoy/i);
  assert.match(readme, /NOT Vernier/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/pontoon/);
  assert.match(readme, /node --test projects\/pontoon\/pontoon\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /maybeAutoEnableRemoteControl/);
  assert.match(readme, /hasActiveClaudeWork/);
  assert.match(readme, /onQuitCleanup/);
  assert.match(readme, /#93279/);
  assert.match(readme, /#73565/);
});

test("catalog #268 features Pontoon only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 268);
  assert.equal(catalog.products[0].name, "Pontoon");
  assert.equal(catalog.products[0].slug, "pontoon");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/pontoon/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /18:50/);
  assert.match(catalog.products[0].summary, /pontoon/);
  assert.match(catalog.products[0].summary, /#93288/);
  assert.match(catalog.products[0].summary, /afloat/);
  const concordat = catalog.products.find((row) => row.slug === "concordat");
  assert.ok(concordat);
  assert.equal(concordat.featured, false);
  const revenant = catalog.products.find((row) => row.slug === "revenant");
  assert.ok(revenant);
  assert.equal(revenant.featured, false);
  const drift = catalog.products.find((row) => row.slug === "drift-radar");
  assert.ok(drift);
  assert.equal(drift.featured, false);
  const reorder = catalog.products.find((row) => row.slug === "reorder-radar");
  assert.ok(reorder);
  assert.equal(reorder.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "pontoon").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93288") && row.slug !== "pontoon"));
});

test("vercel rewrites pontoon to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/pontoon");
  assert.equal(vercel.rewrites[0].destination, "/projects/pontoon");
  assert.equal(vercel.rewrites[1].source, "/pontoon/");
  assert.equal(vercel.rewrites[1].destination, "/projects/pontoon");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
