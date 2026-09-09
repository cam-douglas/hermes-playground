import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  CHIPS,
  CLI,
  CONFIG_SPLIT,
  COUSINS,
  DERBY_WALK,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GAP_MS,
  HOLD,
  IDLE_WORD,
  INSTALL,
  ISSUE_URL,
  LABELS,
  LOG_A,
  LOG_B,
  NODE,
  NOT_PRODUCTS,
  NPM,
  NPM_COMMAND,
  OS,
  PACKAGE,
  PACKAGE_DIR,
  PATH_WORD,
  PHRASE,
  REINSTALL,
  SEEDED_WORD,
  STATE,
  SYMLINK,
  SYMLINK_MTIME,
  TEMP_RETIRE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedCommandNotFound,
  seedConcurrentSessions,
  seedDanglingSymlink,
  seedDerby,
  seedEmptyPackageDir,
  seedLocked,
  seedNpmDebugPair,
  seedScratched,
  seedSharedTempRetire,
  seedSighupVsOk,
  seedSkipInFlight,
} from "./derby.mjs";

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
  return fileURLToPath(new URL("./derby.mjs", import.meta.url));
}

test("idle locked is a hold; one updater in flight; others skip", () => {
  const result = analyze(seedLocked());
  assert.equal(result.verdict, "locked");
  assert.equal(result.idleWord, "locked");
  assert.equal(IDLE_WORD, "locked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.locked, true);
  assert.equal(result.phrase, "admit locked");
  assert.equal(result.updaterLock, true);
  assert.equal(result.skipInFlight, true);
  assert.equal(result.installIntact, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify locked", () => {
  assert.equal(classify(emptyTicket()), "locked");
  assert.equal(classify(""), "locked");
  assert.equal(classify(null), "locked");
  assert.equal(decide({}), "locked");
});

test("#93197 seeded path scores scratched when concurrent npm-global retire races", () => {
  const result = analyze(seedScratched());
  assert.equal(result.verdict, "scratched");
  assert.equal(result.seededWord, "scratched");
  assert.equal(SEEDED_WORD, "scratched");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scratched, true);
  assert.equal(result.phrase, "score scratched");
  assert.equal(result.sharedTempRetire, true);
  assert.equal(result.danglingSymlink, true);
  assert.equal(result.commandNotFound, true);
  assert.equal(result.sighupVsOk, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is derby; named derby seed holds the path", () => {
  assert.equal(PATH_WORD, "derby");
  const result = analyze(seedDerby());
  assert.equal(result.verdict, "derby");
  assert.equal(result.pathWord, "derby");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("derby.json")), "derby");
});

test("HOLD includes locked / skip-in-flight / hold", () => {
  assert.ok(HOLD.includes("locked"));
  assert.ok(HOLD.includes("skip-in-flight"));
  assert.ok(HOLD.includes("hold"));
  const skip = analyze(seedSkipInFlight());
  assert.equal(skip.verdict, "skip-in-flight");
  assert.equal(skip.hold, true);
  assert.equal(classify(readData("skip-in-flight.json")), "skip-in-flight");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: concurrent, retire, sighup, dangling, missing, empty, logs", () => {
  const concurrent = analyze(seedConcurrentSessions());
  assert.equal(concurrent.concurrentSessions, true);
  assert.equal(classify(readData("concurrent-sessions.json")), "concurrent-sessions");
  const retire = analyze(seedSharedTempRetire());
  assert.equal(retire.sharedTempRetire, true);
  assert.equal(classify(readData("shared-temp-retire.json")), "shared-temp-retire");
  const sighup = analyze(seedSighupVsOk());
  assert.equal(sighup.sighupVsOk, true);
  assert.equal(classify(readData("sighup-vs-ok.json")), "sighup-vs-ok");
  const link = analyze(seedDanglingSymlink());
  assert.equal(link.danglingSymlink, true);
  assert.equal(classify(readData("dangling-symlink.json")), "dangling-symlink");
  const missing = analyze(seedCommandNotFound());
  assert.equal(missing.commandNotFound, true);
  assert.equal(classify(readData("command-not-found.json")), "command-not-found");
  const empty = analyze(seedEmptyPackageDir());
  assert.equal(empty.emptyPackageDir, true);
  assert.equal(classify(readData("empty-package-dir.json")), "empty-package-dir");
  const logs = analyze(seedNpmDebugPair());
  assert.equal(logs.twoNpmDebugLogs, true);
  assert.equal(classify(readData("npm-debug-pair.json")), "npm-debug-pair");
});

test("fixture toggle flips locked vs scratched", () => {
  const locked = scoreGate(readData("locked.json"));
  const scratched = scoreGate(readData("scratched.json"));
  assert.equal(locked.verdict, "locked");
  assert.equal(scratched.verdict, "scratched");
  assert.notEqual(locked.verdict, scratched.verdict);
  assert.equal(score(readData("locked.json")), "locked");
  assert.equal(score(readData("scratched.json")), "scratched");
  assert.equal(score(readData("93197.json")), "scratched");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("concurrent-sessions.json")), "concurrent-sessions");
  assert.equal(classify(readData("shared-temp-retire.json")), "shared-temp-retire");
  assert.equal(classify(readData("sighup-vs-ok.json")), "sighup-vs-ok");
  assert.equal(classify(readData("dangling-symlink.json")), "dangling-symlink");
  assert.equal(classify(readData("command-not-found.json")), "command-not-found");
  assert.equal(classify(readData("empty-package-dir.json")), "empty-package-dir");
  assert.equal(classify(readData("npm-debug-pair.json")), "npm-debug-pair");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("skip-in-flight.json")), "skip-in-flight");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published derby walk scores scratched after the hold floods", () => {
  const card = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(card.verdict, "scratched");
  assert.ok(card.scratchedCount >= 1);
  const idle = card.rows.find((row) => row.event === "cue-locked");
  assert.equal(idle.updaterLock, true);
  assert.equal(idle.verdict, "locked");
  const concurrent = card.rows.find((row) => row.event === "concurrent-sessions");
  assert.equal(concurrent.gapMs, 90);
  const retire = card.rows.find((row) => row.event === "shared-temp-retire");
  assert.equal(
    retire.tempRetire,
    "/opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V",
  );
  const sighup = card.rows.find((row) => row.event === "sighup-vs-ok");
  assert.equal(sighup.sighupVsOk, true);
  const empty = card.rows.find((row) => row.event === "empty-package-dir");
  assert.equal(empty.emptyPackageDir, true);
  const link = card.rows.find((row) => row.event === "dangling-symlink");
  assert.equal(link.symlink, "/opt/homebrew/bin/claude");
  const missing = card.rows.find((row) => row.event === "command-not-found");
  assert.equal(missing.commandNotFound, true);
  const scratch = card.rows.find((row) => row.event === "scratched");
  assert.equal(scratch.sharedTempRetire, true);
  const path = card.rows.find((row) => row.event === "derby");
  assert.equal(path.verdict, "derby");
});

test("DERBY_WALK constant matches the issue retire walk", () => {
  assert.equal(DERBY_WALK[0].event, "cue-locked");
  const concurrent = DERBY_WALK.find((row) => row.event === "concurrent-sessions");
  assert.equal(concurrent.gapMs, 90);
  assert.equal(concurrent.configSplit, "different CLAUDE_CONFIG_DIR");
  const logs = DERBY_WALK.find((row) => row.event === "npm-debug-pair");
  assert.equal(logs.logA, "2026-09-09T14_02_34_904Z-debug-0.log");
  assert.equal(logs.logB, "2026-09-09T14_02_34_992Z-debug-0.log");
  const retire = DERBY_WALK.find((row) => row.event === "shared-temp-retire");
  assert.match(retire.tempRetire, /\.claude-code-2DTsDk1V/);
  const scratch = DERBY_WALK.find((row) => row.event === "scratched");
  assert.equal(scratch.danglingSymlink, true);
  const path = DERBY_WALK.find((row) => row.event === "derby");
  assert.equal(path.derby, true);
});

test("issue constants encode only #93197 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93197);
  assert.ok(ISSUE_URL.includes("93197"));
  assert.match(TITLE, /two concurrent sessions race on the npm-global install/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:packaging"));
  assert.match(CLI, /2\.1\.266/);
  assert.equal(NPM, "npm 11.12.1");
  assert.equal(NODE, "Node 25.9.0");
  assert.match(OS, /Darwin 25\.6\.0/);
  assert.match(INSTALL, /Homebrew/);
  assert.equal(PACKAGE, "@anthropic-ai/claude-code@2.1.266");
  assert.match(NPM_COMMAND, /npm install --global/);
  assert.match(TEMP_RETIRE, /\.claude-code-2DTsDk1V/);
  assert.equal(PACKAGE_DIR, "/opt/homebrew/lib/node_modules/@anthropic-ai/");
  assert.equal(SYMLINK, "/opt/homebrew/bin/claude");
  assert.equal(GAP_MS, 90);
  assert.equal(LOG_A, "2026-09-09T14_02_34_904Z-debug-0.log");
  assert.equal(LOG_B, "2026-09-09T14_02_34_992Z-debug-0.log");
  assert.equal(SYMLINK_MTIME, "07:05:03 PDT");
  assert.equal(REINSTALL, "07:08");
  assert.equal(CONFIG_SPLIT, "different CLAUDE_CONFIG_DIR");
  assert.equal(AUTHOR, "saltydoctor");
  assert.equal(FILED, "2026-09-09T20:45:46Z");
  assert.ok(FINGERPRINT_LINES.includes("dangling symlink"));
  assert.ok(FINGERPRINT_LINES.includes("claude: command not found"));
  assert.match(PHRASE, /scratch the shared plate/);
  assert.ok(HOLD.includes("locked"));
  assert.ok(ALARM.includes("scratched"));
  assert.ok(ALARM.includes("derby"));
  assert.ok(CHIPS.includes("shared-temp-retire"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "deadair",
    "squelch",
    "moored",
    "scuttled",
    "scuttle",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "fresh",
    "stamped",
    "cleared",
    "mounded",
    "distinct",
    "conflated",
    "held",
    "steered",
    "raised",
    "fallen",
    "sterling",
    "primed",
    "lodged",
    "parergon",
    "stereotype",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring the updater lock flips scratched to locked", () => {
  const tape = {
    updaterLock: true,
    skipInFlight: true,
    installIntact: true,
    concurrentSessions: false,
    sharedTempRetire: false,
    danglingSymlink: false,
    commandNotFound: false,
    cue: "locked",
  };
  assert.equal(scoreGate(tape).verdict, "locked");
  tape.updaterLock = false;
  tape.skipInFlight = false;
  tape.installIntact = false;
  tape.concurrentSessions = true;
  tape.sharedTempRetire = true;
  tape.danglingSymlink = true;
  tape.commandNotFound = true;
  tape.cue = "scratched";
  assert.equal(scoreGate(tape).verdict, "scratched");
  tape.updaterLock = true;
  tape.skipInFlight = true;
  tape.installIntact = true;
  tape.concurrentSessions = false;
  tape.sharedTempRetire = false;
  tape.danglingSymlink = false;
  tape.commandNotFound = false;
  tape.cue = "locked";
  assert.equal(scoreGate(tape).verdict, "locked");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [88091, 90233, 86496, 86941, 84081, 84224, 85154, 996],
  );
  assert.equal(COUSINS.length, 8);
  assert.equal(COUSINS[0].issue, 88091);
  assert.equal(COUSINS[7].issue, 996);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("understudy"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("trompe"));
  assert.ok(NOT_PRODUCTS.includes("homonym"));
  assert.ok(NOT_PRODUCTS.includes("shibboleth"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published macos homebrew walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /2\.1\.266/);
  assert.match(repro.note, /11\.12\.1/);
  assert.match(repro.note, /25\.9\.0/);
  assert.match(repro.note, /Darwin 25\.6\.0/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const locked = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/locked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const scratched = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scratched.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(locked.status, 0, locked.stderr);
  assert.equal(scratched.status, 0, scratched.stderr);
  assert.equal(JSON.parse(locked.stdout).verdict, "locked");
  assert.equal(JSON.parse(scratched.stdout).verdict, "scratched");
});

test("handle exposes published hypothesis and #93197 headline", () => {
  const result = handle(readData("93197.json"));
  assert.equal(result.published.issue, 93197);
  assert.equal(result.published.cli, "Claude Code 2.1.266");
  assert.equal(result.published.npm, "npm 11.12.1");
  assert.equal(result.published.tempRetire, TEMP_RETIRE);
  assert.equal(result.published.symlink, "/opt/homebrew/bin/claude");
  assert.equal(result.published.gapMs, 90);
  assert.deepEqual(result.published.cousins, [
    88091, 90233, 86496, 86941, 84081, 84224, 85154, 996,
  ]);
  assert.match(result.published.hypothesis, /cross-process lock/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedScratched()),
    /scratched\|lock=none\|skip=no\|install=empty\|retire=shared\|link=dangling\|cmd=missing/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a racecourse starting-gate, not a masquerade or radio studio", () => {
  const page = readPage();
  assert.match(page, /Bodoni Moda/);
  assert.match(page, /Manrope/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /racecourse|starting-gate|photo-finish|paddock|silk/i);
  assert.match(page, /#14110c|#3d6b2a|#2a4a1c/);
  assert.match(page, /#8b1538|#e8c547|#f5c542/);
  assert.match(page, /#efe8d6|#4a5560|#f7f1e4/);
  assert.match(page, /locked/);
  assert.match(page, /scratched/);
  assert.match(page, /derby/);
  assert.match(page, /score scratched or admit locked/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /07:50/);
  assert.match(page, /#256/);
  assert.match(page, /#93197/);
  assert.match(page, /\.claude-code-2DTsDk1V/);
  assert.match(page, /command not found/);
  assert.match(page, /14_02_34_904Z/);
  assert.match(page, /14_02_34_992Z/);
  assert.match(page, /SIGHUP/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Playfair|Outfit|Cardo|Bitter|Roboto Mono|Cinzel/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#c4a05a/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /#e8a317/);
  assert.doesNotMatch(page, /#6ee87a/);
  assert.doesNotMatch(page, /#121212/);
  assert.doesNotMatch(page, /#b87333/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#2d6a5a/);
  assert.doesNotMatch(page, /#2a0814/);
  assert.doesNotMatch(page, /#7a1428/);
  assert.doesNotMatch(page, /#e6c36a/);
  assert.doesNotMatch(page, /#f3ead6/);
  assert.doesNotMatch(page, /ON.?AIR|vu-meter|copper mic/i);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /masquerade|filigree|vizard atelier/i);
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bsquelch\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bmounded\b/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bconflated\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bdiplopic\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\bstopcock\b/);
  assert.doesNotMatch(page, /\bunmasked\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bprecedence\b/);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Understudy/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Trompe/i);
  assert.match(page, /NOT Homonym/i);
  assert.match(page, /NOT Shibboleth/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Derby/);
  assert.match(readme, /#93197/);
  assert.match(readme, /locked/);
  assert.match(readme, /scratched/);
  assert.match(readme, /derby/);
  assert.match(readme, /Bodoni Moda/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Vizard/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /NOT Scuttle/i);
  assert.match(readme, /NOT Stopcock/i);
  assert.match(readme, /NOT Parergon/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/derby/);
  assert.match(readme, /node --test projects\/derby\/derby\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #256 features Derby; Vizard stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 256);
  assert.equal(catalog.products[0].name, "Derby");
  assert.equal(catalog.products[0].slug, "derby");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/derby/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /07:50/);
  assert.match(catalog.products[0].summary, /derby/);
  assert.match(catalog.products[0].summary, /#93197/);
  assert.match(catalog.products[0].summary, /locked/);
  assert.match(catalog.products[0].summary, /scratched/);
  const vizard = catalog.products.find((row) => row.slug === "vizard");
  assert.ok(vizard);
  assert.equal(vizard.featured, false);
  const deadair = catalog.products.find((row) => row.slug === "deadair");
  assert.ok(deadair);
  assert.equal(deadair.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites derby to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/derby");
  assert.equal(vercel.rewrites[0].destination, "/projects/derby");
  assert.equal(vercel.rewrites[1].source, "/derby/");
  assert.equal(vercel.rewrites[1].destination, "/projects/derby");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
