import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARCH,
  BUNDLED_CODE,
  CHIPS,
  COMMAND,
  COUSINS,
  DESKTOP_FROM,
  DESKTOP_TO,
  ELAPSED_MINUTES,
  ENFORCEMENT_HOURS,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_MINUTES,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOG_QUIT,
  LOG_RESTORE,
  LOG_SAVE,
  LOG_TRIGGER,
  MACOS,
  NAV_ACTIVE,
  NAV_DROPPED,
  NAV_ENTRIES,
  NOT_PRODUCTS,
  PARERGON_WALK,
  PATH_WORD,
  PHRASE,
  POPOUT_PANES,
  POPOUT_SESSIONS,
  SEEDED_WORD,
  STATE,
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
  seedDiscarded,
  seedParergon,
  seedPreserved,
  seedRestoreNavigationOnly,
  seedSideChatInMemory,
  seedStealthIdle,
  seedZeroPopouts,
} from "./parergon.mjs";

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
  return fileURLToPath(new URL("./parergon.mjs", import.meta.url));
}

test("idle preserved is a hold; idle gate counts the aside", () => {
  const result = analyze(seedPreserved());
  assert.equal(result.verdict, "preserved");
  assert.equal(result.idleWord, "preserved");
  assert.equal(IDLE_WORD, "preserved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.preserved, true);
  assert.equal(result.phrase, "admit preserved");
  assert.equal(result.idleGateCountsSideChat, true);
  assert.equal(result.stealthTriggered, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify preserved", () => {
  assert.equal(classify(emptyTicket()), "preserved");
  assert.equal(classify(""), "preserved");
  assert.equal(classify(null), "preserved");
  assert.equal(decide({}), "preserved");
});

test("#93122 seeded path scores discarded when stealth idle wipes the aside", () => {
  const result = analyze(seedDiscarded());
  assert.equal(result.verdict, "discarded");
  assert.equal(result.seededWord, "discarded");
  assert.equal(SEEDED_WORD, "discarded");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.discarded, true);
  assert.equal(result.phrase, "score discarded");
  assert.equal(result.idleGateCountsSideChat, false);
  assert.equal(result.stealthTriggered, true);
  assert.equal(result.navigationRestored, true);
  assert.equal(result.sideChatRestored, false);
  assert.equal(result.popoutsSaved, 0);
  assert.equal(result.idleMinutes, 10);
  assert.equal(result.elapsedMinutes, 41);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is parergon; named parergon seed holds the path", () => {
  assert.equal(PATH_WORD, "parergon");
  const result = analyze(seedParergon());
  assert.equal(result.verdict, "parergon");
  assert.equal(result.pathWord, "parergon");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("parergon.json")), "parergon");
});

test("aside chips: stealth-idle, side-chat-in-memory, zero-popouts, restore-navigation-only", () => {
  const idle = analyze(seedStealthIdle());
  assert.equal(idle.idleGateCountsSideChat, false);
  assert.equal(idle.stealthTriggered, true);
  assert.equal(classify(readData("stealth-idle.json")), "stealth-idle");
  const memory = analyze(seedSideChatInMemory());
  assert.equal(memory.sideChatInMemory, true);
  assert.equal(memory.command, COMMAND);
  assert.equal(classify(readData("side-chat-in-memory.json")), "side-chat-in-memory");
  const popouts = analyze(seedZeroPopouts());
  assert.equal(popouts.popoutsSaved, 0);
  assert.equal(classify(readData("zero-popouts.json")), "zero-popouts");
  const restore = analyze(seedRestoreNavigationOnly());
  assert.equal(restore.navigationRestored, true);
  assert.equal(restore.sideChatRestored, false);
  assert.equal(restore.navEntries, 3);
  assert.equal(classify(readData("restore-navigation-only.json")), "restore-navigation-only");
});

test("fixture toggle flips preserved vs discarded", () => {
  const preserved = scoreGate(readData("preserved.json"));
  const discarded = scoreGate(readData("discarded.json"));
  assert.equal(preserved.verdict, "preserved");
  assert.equal(discarded.verdict, "discarded");
  assert.notEqual(preserved.verdict, discarded.verdict);
  assert.equal(score(readData("preserved.json")), "preserved");
  assert.equal(score(readData("discarded.json")), "discarded");
  assert.equal(score(readData("93122.json")), "discarded");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("stealth-idle.json")), "stealth-idle");
  assert.equal(classify(readData("side-chat-in-memory.json")), "side-chat-in-memory");
  assert.equal(classify(readData("zero-popouts.json")), "zero-popouts");
  assert.equal(classify(readData("restore-navigation-only.json")), "restore-navigation-only");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published parergon walk scores discarded after the aside is wiped", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "discarded");
  assert.ok(night.discardedCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-preserved");
  assert.equal(idle.idleGateCountsSideChat, true);
  assert.equal(idle.verdict, "preserved");
  const memory = night.rows.find((row) => row.event === "side-chat-in-memory");
  assert.equal(memory.verdict, "discarded");
  assert.equal(memory.sideChatInMemory, true);
  const stealth = night.rows.find((row) => row.event === "stealth-idle");
  assert.equal(stealth.idleMinutes, 10);
  const wipe = night.rows.find((row) => row.event === "discarded");
  assert.equal(wipe.sideChatRestored, false);
  assert.equal(wipe.noWarning, true);
  const path = night.rows.find((row) => row.event === "parergon");
  assert.equal(path.verdict, "parergon");
});

test("PARERGON_WALK constant matches the issue stealth-/btw walk", () => {
  assert.equal(PARERGON_WALK[0].event, "cue-preserved");
  const memory = PARERGON_WALK.find((row) => row.event === "side-chat-in-memory");
  assert.equal(memory.sideChatInMemory, true);
  const stealth = PARERGON_WALK.find((row) => row.event === "stealth-idle");
  assert.equal(stealth.idleGateCountsSideChat, false);
  assert.equal(stealth.idleMinutes, 10);
  const popouts = PARERGON_WALK.find((row) => row.event === "zero-popouts");
  assert.equal(popouts.popoutsSaved, 0);
  const restore = PARERGON_WALK.find((row) => row.event === "restore-navigation-only");
  assert.equal(restore.navEntries, 3);
  assert.equal(restore.navActive, 2);
  assert.equal(restore.navDropped, 0);
  const wipe = PARERGON_WALK.find((row) => row.event === "discarded");
  assert.equal(wipe.noRecovery, true);
});

test("issue constants encode only #93122 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93122);
  assert.ok(ISSUE_URL.includes("93122"));
  assert.match(TITLE, /Stealth update/);
  assert.match(TITLE, /\/btw/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(DESKTOP_FROM, "1.46388.1");
  assert.equal(DESKTOP_TO, "1.49585.0");
  assert.equal(BUNDLED_CODE, "2.1.260");
  assert.equal(ARCH, "macOS arm64");
  assert.equal(MACOS, "26.6.2");
  assert.equal(IDLE_MINUTES, 10);
  assert.equal(ELAPSED_MINUTES, 41);
  assert.equal(ENFORCEMENT_HOURS, 72);
  assert.equal(NAV_ENTRIES, 3);
  assert.equal(NAV_ACTIVE, 2);
  assert.equal(NAV_DROPPED, 0);
  assert.equal(POPOUT_SESSIONS, 0);
  assert.equal(POPOUT_PANES, 0);
  assert.equal(COMMAND, "/btw");
  assert.match(LOG_SAVE, /Saving 0 session \+ 0 pane popout/);
  assert.match(LOG_TRIGGER, /Triggering stealth update after idle timeout/);
  assert.match(LOG_QUIT, /onQuitCleanup: local-session-stop-all/);
  assert.match(LOG_RESTORE, /Restoring navigation \(3 entries, active=2, dropped=0\)/);
  assert.ok(FINGERPRINT_LINES.includes("side chat state is in-memory only"));
  assert.match(PHRASE, /not preserving the aside — it is a discarded parergon/);
  assert.ok(HOLD.includes("preserved"));
  assert.ok(ALARM.includes("discarded"));
  assert.ok(ALARM.includes("parergon"));
  assert.ok(CHIPS.includes("stealth-idle"));
  assert.ok(VERDICTS.includes("zero-popouts"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
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
    "flashed",
    "lodged",
    "bypassed",
    "greenroomed",
    "scaffold",
    "diplopic",
    "freewheeling",
    "doubled",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("counting the aside as active work flips discarded to preserved", () => {
  const tape = {
    sideChatOpen: true,
    sideChatInMemory: true,
    idleGateCountsSideChat: true,
    stealthTriggered: false,
    asideKept: true,
    sideChatRestored: true,
    cue: "preserved",
  };
  assert.equal(scoreGate(tape).verdict, "preserved");
  tape.idleGateCountsSideChat = false;
  tape.stealthTriggered = true;
  tape.asideKept = false;
  tape.sideChatRestored = false;
  tape.navigationRestored = true;
  tape.sessionStateRestored = false;
  tape.popoutsSaved = 0;
  tape.cue = "discarded";
  assert.equal(scoreGate(tape).verdict, "discarded");
  tape.idleGateCountsSideChat = true;
  tape.stealthTriggered = false;
  tape.asideKept = true;
  tape.sideChatRestored = true;
  tape.navigationRestored = false;
  tape.cue = "preserved";
  assert.equal(scoreGate(tape).verdict, "preserved");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [92207, 92010, 91915],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 92207);
  assert.equal(COUSINS[2].issue, 91915);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("wildcat"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published macos desktop /btw walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /\/btw/);
  assert.match(repro.note, /1\.46388\.1/);
  assert.match(repro.note, /1\.49585\.0/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const preserved = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/preserved.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const discarded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/discarded.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(preserved.status, 0, preserved.stderr);
  assert.equal(discarded.status, 0, discarded.stderr);
  assert.equal(JSON.parse(preserved.stdout).verdict, "preserved");
  assert.equal(JSON.parse(discarded.stdout).verdict, "discarded");
});

test("handle exposes published hypothesis and #93122 headline", () => {
  const result = handle(readData("93122.json"));
  assert.equal(result.published.issue, 93122);
  assert.equal(result.published.desktopFrom, "1.46388.1");
  assert.equal(result.published.desktopTo, "1.49585.0");
  assert.equal(result.published.bundledCode, "2.1.260");
  assert.equal(result.published.idleMinutes, 10);
  assert.deepEqual(result.published.cousins, [92207, 92010, 91915]);
  assert.match(result.published.hypothesis, /idle gate/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedDiscarded()),
    /discarded\|gate=ignores-aside\|stealth=fired\|aside=gone/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a manuscript marginalia alcove, not a letterpress foundry", () => {
  const page = readPage();
  assert.match(page, /Instrument Serif/);
  assert.match(page, /Schibsted Grotesk/);
  assert.match(page, /Fragment Mono/);
  assert.match(page, /manuscript|marginalia|aside-panel|side-folio|alcove/i);
  assert.match(page, /#f8f1de/);
  assert.match(page, /#221c14/);
  assert.match(page, /#c81d25/);
  assert.match(page, /#8b8478/);
  assert.match(page, /#44515c/);
  assert.match(page, /preserved/);
  assert.match(page, /discarded/);
  assert.match(page, /parergon/i);
  assert.match(page, /score discarded or admit preserved/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /01:50/);
  assert.match(page, /#251/);
  assert.match(page, /#93122/);
  assert.match(page, /\/btw/);
  assert.match(page, /1\.46388\.1/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /Saving 0 session/);
  assert.match(page, /Restoring navigation/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair Display|Outfit|Space Mono/);
  assert.doesNotMatch(page, /Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /letterpress|foundry|chase|forme/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology|double-vision|acuity booth/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /velvet|tungsten|call sheet|cue light/i);
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
  assert.doesNotMatch(page, /\bfreewheeling\b/);
  assert.doesNotMatch(page, /\bdoubled\b/);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /NOT Greenroom/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
  assert.match(page, /NOT Wildcat/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Parergon/);
  assert.match(readme, /#93122/);
  assert.match(readme, /preserved/);
  assert.match(readme, /discarded/);
  assert.match(readme, /parergon/);
  assert.match(readme, /Instrument Serif/);
  assert.match(readme, /Schibsted Grotesk/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /Do NOT reuse Alegreya/);
  assert.match(readme, /Do NOT reuse Fraunces/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Diplopia/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/parergon/);
  assert.match(readme, /node --test projects\/parergon\/parergon\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #251 features Parergon; Stereotype stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 251);
  assert.equal(catalog.products[0].name, "Parergon");
  assert.equal(catalog.products[0].slug, "parergon");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/parergon/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /01:50 parergon/);
  const stereotype = catalog.products.find((row) => row.slug === "stereotype");
  assert.ok(stereotype);
  assert.equal(stereotype.featured, false);
  const midden = catalog.products.find((row) => row.slug === "midden");
  assert.ok(midden);
  assert.equal(midden.featured, false);
  const diplopia = catalog.products.find((row) => row.slug === "diplopia");
  assert.ok(diplopia);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites parergon to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/parergon");
  assert.equal(vercel.rewrites[0].destination, "/projects/parergon");
  assert.equal(vercel.rewrites[1].source, "/parergon/");
  assert.equal(vercel.rewrites[1].destination, "/projects/parergon");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
