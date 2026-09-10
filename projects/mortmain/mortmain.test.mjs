import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHEST_DRAWERS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DENIED_PATHS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GIT_VERSION,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MORTMAIN_WALK,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  SEEDED_WORD,
  STAGED_PHANTOM_COUNT,
  STATE,
  TITLE,
  TOUCH_DENIED,
  TRACKED_SKILL_COUNT,
  VERDICTS,
  analyze,
  classify,
  compareDeed,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readChest,
  readSeal,
  score,
  scoreGate,
  scoreWalk,
  seedAuthorlessDiff,
  seedDenyWithinAllow,
  seedFreehold,
  seedHeadBehind,
  seedHold,
  seedMortmain,
  seedPhantom,
  seedSilentWarning,
  seedTrackedClaudePaths,
  seedUnlinkDenied,
} from "./mortmain.mjs";

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
  return fileURLToPath(new URL("./mortmain.mjs", import.meta.url));
}

test("idle freehold is a hold; tracked paths alienable; tree matches HEAD", () => {
  const result = analyze(seedFreehold());
  assert.equal(result.verdict, "freehold");
  assert.equal(result.idleWord, "freehold");
  assert.equal(IDLE_WORD, "freehold");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.freehold, true);
  assert.equal(result.phrase, "admit freehold");
  assert.equal(result.denyWithinAllow, false);
  assert.equal(result.unlinkDenied, false);
  assert.equal(result.headBehind, false);
  assert.equal(result.authorlessDiff, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify freehold", () => {
  assert.equal(classify(emptyTicket()), "freehold");
  assert.equal(classify(""), "freehold");
  assert.equal(classify(null), "freehold");
  assert.equal(decide({}), "freehold");
});

test("#93173 seeded path scores mortmain when denyWithinAllow freezes tracked .claude", () => {
  const result = analyze(seedMortmain());
  assert.equal(result.verdict, "mortmain");
  assert.equal(result.seededWord, "mortmain");
  assert.equal(SEEDED_WORD, "mortmain");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mortmain, true);
  assert.equal(result.phrase, "score mortmain");
  assert.equal(result.denyWithinAllow, true);
  assert.equal(result.trackedClaudePaths, true);
  assert.equal(result.unlinkDenied, true);
  assert.equal(result.headBehind, true);
  assert.equal(result.authorlessDiff, true);
  assert.equal(result.silentWarning, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is phantom; named phantom seed holds the path", () => {
  assert.equal(PATH_WORD, "phantom");
  const result = analyze(seedPhantom());
  assert.equal(result.verdict, "phantom");
  assert.equal(result.pathWord, "phantom");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("phantom.json")), "phantom");
});

test("HOLD includes freehold / hold", () => {
  assert.ok(HOLD.includes("freehold"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: deny, tracked, unlink, head, authorless, silent", () => {
  const deny = analyze(seedDenyWithinAllow());
  assert.equal(deny.denyWithinAllow, true);
  assert.equal(classify(readData("deny-within-allow.json")), "deny-within-allow");
  const tracked = analyze(seedTrackedClaudePaths());
  assert.equal(tracked.trackedClaudePaths, true);
  assert.equal(classify(readData("tracked-claude-paths.json")), "tracked-claude-paths");
  const unlink = analyze(seedUnlinkDenied());
  assert.equal(unlink.unlinkDenied, true);
  assert.equal(classify(readData("unlink-denied.json")), "unlink-denied");
  const head = analyze(seedHeadBehind());
  assert.equal(head.headBehind, true);
  assert.equal(classify(readData("head-behind.json")), "head-behind");
  const authorless = analyze(seedAuthorlessDiff());
  assert.equal(authorless.authorlessDiff, true);
  assert.equal(classify(readData("authorless-diff.json")), "authorless-diff");
  const silent = analyze(seedSilentWarning());
  assert.equal(silent.silentWarning, true);
  assert.equal(classify(readData("silent-warning.json")), "silent-warning");
});

test("fixture toggle flips freehold vs mortmain", () => {
  const freehold = scoreGate(readData("freehold.json"));
  const mortmain = scoreGate(readData("mortmain.json"));
  assert.equal(freehold.verdict, "freehold");
  assert.equal(mortmain.verdict, "mortmain");
  assert.notEqual(freehold.verdict, mortmain.verdict);
  assert.equal(score(readData("freehold.json")), "freehold");
  assert.equal(score(readData("mortmain.json")), "mortmain");
  assert.equal(score(readData("93173.json")), "mortmain");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("deny-within-allow.json")), "deny-within-allow");
  assert.equal(classify(readData("tracked-claude-paths.json")), "tracked-claude-paths");
  assert.equal(classify(readData("unlink-denied.json")), "unlink-denied");
  assert.equal(classify(readData("head-behind.json")), "head-behind");
  assert.equal(classify(readData("authorless-diff.json")), "authorless-diff");
  assert.equal(classify(readData("silent-warning.json")), "silent-warning");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published mortmain walk scores mortmain after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "mortmain");
  assert.ok(night.mortmainCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-freehold");
  assert.equal(idle.freehold, true);
  assert.equal(idle.verdict, "freehold");
  const deny = night.rows.find((row) => row.event === "deny-within-allow");
  assert.equal(deny.denyWithinAllow, true);
  const tracked = night.rows.find((row) => row.event === "tracked-claude-paths");
  assert.equal(tracked.trackedClaudePaths, true);
  const unlink = night.rows.find((row) => row.event === "unlink-denied");
  assert.equal(unlink.unlinkDenied, true);
  const head = night.rows.find((row) => row.event === "head-behind");
  assert.equal(head.headBehind, true);
  const diffs = night.rows.find((row) => row.event === "authorless-diff");
  assert.equal(diffs.authorlessDiff, true);
  const warn = night.rows.find((row) => row.event === "silent-warning");
  assert.equal(warn.silentWarning, true);
  const hear = night.rows.find((row) => row.event === "mortmain");
  assert.equal(hear.denyWithinAllow, true);
  const path = night.rows.find((row) => row.event === "phantom");
  assert.equal(path.verdict, "phantom");
});

test("MORTMAIN_WALK constant matches the issue dead-hand walk", () => {
  assert.equal(MORTMAIN_WALK[0].event, "cue-freehold");
  const deny = MORTMAIN_WALK.find((row) => row.event === "deny-within-allow");
  assert.equal(deny.denyWithinAllow, true);
  const tracked = MORTMAIN_WALK.find((row) => row.event === "tracked-claude-paths");
  assert.equal(tracked.trackedClaudePaths, true);
  const hear = MORTMAIN_WALK.find((row) => row.event === "mortmain");
  assert.equal(hear.unlinkDenied, true);
  const path = MORTMAIN_WALK.find((row) => row.event === "phantom");
  assert.equal(path.phantom, true);
});

test("issue constants encode only #93173 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93173);
  assert.ok(ISSUE_URL.includes("93173"));
  assert.match(TITLE, /\.claude/);
  assert.match(TITLE, /working tree/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:bash"));
  assert.ok(LABELS.includes("area:sandbox"));
  assert.equal(AUTHOR, "jakes-space");
  assert.equal(FILED, "2026-09-09T19:14:43Z");
  assert.equal(CLAUDE_VERSION, "2.1.255");
  assert.equal(OS, "macOS 15.7.9 arm64");
  assert.equal(GIT_VERSION, "2.50.1");
  assert.equal(TRACKED_SKILL_COUNT, 12);
  assert.equal(STAGED_PHANTOM_COUNT, 488);
  assert.equal(TOUCH_DENIED, "Operation not permitted");
  assert.equal(DENIED_PATHS.length, 3);
  assert.equal(CHEST_DRAWERS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("denyWithinAllow"));
  assert.match(PHRASE, /denyWithinAllow freezes tracked \.claude paths/);
  assert.match(PHRASE, /mortmain never stays freehold/);
  assert.ok(HOLD.includes("freehold"));
  assert.ok(ALARM.includes("mortmain"));
  assert.ok(ALARM.includes("phantom"));
  assert.ok(CHIPS.includes("deny-within-allow"));
  assert.ok(VERDICTS.includes("walk"));
  assert.ok(VERDICTS.includes("backups"));
  assert.ok(VERDICTS.includes("unlink-denied"));
  assert.ok(VERDICTS.includes("head-behind"));
  assert.ok(VERDICTS.includes("authorless-diff"));
  assert.ok(VERDICTS.includes("silent-warning"));
  assert.ok(VERDICTS.includes("tracked-claude-paths"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "trunked",
    "strowger",
    "exchanged",
    "tokenized",
    "mondegreen",
    "parsed",
    "locked",
    "scratched",
    "derby",
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
    "corked",
    "relayed",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring alienable paths flips mortmain to freehold", () => {
  const tape = {
    freehold: true,
    trackedClaudePaths: true,
    denyWithinAllow: false,
    unlinkDenied: false,
    headBehind: false,
    authorlessDiff: false,
    cue: "freehold",
  };
  assert.equal(scoreGate(tape).verdict, "freehold");
  tape.freehold = false;
  tape.denyWithinAllow = true;
  tape.unlinkDenied = true;
  tape.headBehind = true;
  tape.authorlessDiff = true;
  tape.cue = "mortmain";
  assert.equal(scoreGate(tape).verdict, "mortmain");
  tape.freehold = true;
  tape.denyWithinAllow = false;
  tape.unlinkDenied = false;
  tape.headBehind = false;
  tape.authorlessDiff = false;
  tape.cue = "freehold";
  assert.equal(scoreGate(tape).verdict, "freehold");
});

test("chest lists tracked drawers; wax seal freezes on denyWithinAllow", () => {
  const chest = readChest();
  assert.equal(chest.drawers, 3);
  assert.ok(chest.paths.includes(".claude/skills"));
  assert.ok(chest.paths.includes(".claude/hooks"));
  assert.ok(chest.paths.includes(".claude/settings.json"));
  assert.equal(chest.trackedSkills, 12);
  const live = readSeal({ denyWithinAllow: false, trackedClaudePaths: true });
  assert.equal(live.freehold, true);
  assert.equal(live.lamp, "freehold");
  const cut = readSeal({ denyWithinAllow: true, trackedClaudePaths: true });
  assert.equal(cut.freehold, false);
  assert.equal(cut.lamp, "mortmain");
  assert.equal(cut.touchDenied, "Operation not permitted");
  const deed = compareDeed({ denyWithinAllow: true, trackedClaudePaths: true });
  assert.equal(deed.deadHand, true);
  assert.equal(deed.cue, "mortmain");
  const idle = compareDeed({ denyWithinAllow: false });
  assert.equal(idle.deadHand, false);
  assert.equal(idle.cue, "freehold");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [53891, 85072, 54189, 79945],
  );
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 53891);
  assert.equal(COUSINS[1].issue, 85072);
  assert.equal(COUSINS[2].issue, 54189);
  assert.equal(COUSINS[3].issue, 79945);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("derby"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("embrasure"));
  assert.equal(classify(cousins), "cousins");
  const backups = readData("backups.json");
  assert.equal(backups.verdict, "backups");
  assert.deepEqual(
    backups.backupsCiteOnly.map((row) => row.issue),
    [93182, 93219, 93207, 93198, 93177, 93210],
  );
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93182);
  assert.equal(classify(backups), "backups");
});

test("has-repro encodes published denyWithinAllow / unlink walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /denyWithinAllow/);
  assert.match(repro.note, /unlink/);
  assert.match(repro.note, /jakes-space/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const freehold = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/freehold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const mortmain = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/mortmain.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(freehold.status, 0, freehold.stderr);
  assert.equal(mortmain.status, 0, mortmain.stderr);
  assert.equal(JSON.parse(freehold.stdout).verdict, "freehold");
  assert.equal(JSON.parse(mortmain.stdout).verdict, "mortmain");
});

test("handle exposes published hypothesis and #93173 headline", () => {
  const result = handle(readData("93173.json"));
  assert.equal(result.published.issue, 93173);
  assert.equal(result.published.claudeVersion, "2.1.255");
  assert.equal(result.published.trackedSkillCount, 12);
  assert.equal(result.published.stagedPhantomCount, 488);
  assert.equal(result.published.touchDenied, "Operation not permitted");
  assert.deepEqual(result.published.cousins, [53891, 85072, 54189, 79945]);
  assert.deepEqual(result.published.backups, [93182, 93219, 93207, 93198, 93177, 93210]);
  assert.match(result.published.hypothesis, /denyWithinAllow/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedMortmain()),
    /mortmain\|deny=within-allow\|paths=tracked\|unlink=denied\|head=behind\|diff=authorless\|warn=silent/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a muniment / charter booth, not a switchboard or racecourse", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /muniment|charter|deed|wax seal|iron chest|dead.?hand/i);
  assert.match(page, /#16110c|#241c14|#32281e/);
  assert.match(page, /#cbb892|#9a2434|#c4a04a/);
  assert.match(page, /freehold/);
  assert.match(page, /mortmain/);
  assert.match(page, /phantom/);
  assert.match(page, /score mortmain or admit freehold/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /11:50/);
  assert.match(page, /#259/);
  assert.match(page, /#93173/);
  assert.match(page, /denyWithinAllow/);
  assert.match(page, /\.claude\/skills/);
  assert.match(page, /unable to unlink/);
  assert.match(page, /jakes-space/);
  assert.match(page, /2\.1\.255/);
  assert.match(page, /15\.7\.9/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Playfair|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#07090d/);
  assert.doesNotMatch(page, /#10151c/);
  assert.doesNotMatch(page, /#181f28/);
  assert.doesNotMatch(page, /#c8963e/);
  assert.doesNotMatch(page, /#e39b24/);
  assert.doesNotMatch(page, /#efe3c4/);
  assert.doesNotMatch(page, /#e23b3b/);
  assert.doesNotMatch(page, /#120e18/);
  assert.doesNotMatch(page, /#1b1526/);
  assert.doesNotMatch(page, /#241c32/);
  assert.doesNotMatch(page, /#d4b46a/);
  assert.doesNotMatch(page, /#c45a78/);
  assert.doesNotMatch(page, /#7eb8a4/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /ON.?AIR|vu-meter|copper mic/i);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /masquerade|filigree|vizard atelier/i);
  assert.doesNotMatch(page, /racecourse|starting-gate|photo-finish|paddock|silk/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bexchanged\b/);
  assert.doesNotMatch(page, /\btokenized\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bparsed\b/);
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bsquelch\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bunmasked\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\blocked\b/);
  assert.doesNotMatch(page, /\bscratched\b/);
  assert.doesNotMatch(page, /\bderby\b/);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Derby/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Mortmain/);
  assert.match(readme, /#93173/);
  assert.match(readme, /freehold/);
  assert.match(readme, /mortmain/);
  assert.match(readme, /phantom/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Derby/i);
  assert.match(readme, /NOT Vizard/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/mortmain/);
  assert.match(readme, /node --test projects\/mortmain\/mortmain\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /denyWithinAllow/);
  assert.match(readme, /\.claude\/skills/);
});

test("catalog #259 features Mortmain; Strowger stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 259);
  assert.equal(catalog.products[0].name, "Mortmain");
  assert.equal(catalog.products[0].slug, "mortmain");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/mortmain/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /11:50/);
  assert.match(catalog.products[0].summary, /mortmain/);
  assert.match(catalog.products[0].summary, /#93173/);
  assert.match(catalog.products[0].summary, /freehold/);
  const strowger = catalog.products.find((row) => row.slug === "strowger");
  assert.ok(strowger);
  assert.equal(strowger.featured, false);
  const mondegreen = catalog.products.find((row) => row.slug === "mondegreen");
  assert.ok(mondegreen);
  assert.equal(mondegreen.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "mortmain").length, 1);
});

test("vercel rewrites mortmain to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/mortmain");
  assert.equal(vercel.rewrites[0].destination, "/projects/mortmain");
  assert.equal(vercel.rewrites[1].source, "/mortmain/");
  assert.equal(vercel.rewrites[1].destination, "/projects/mortmain");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
