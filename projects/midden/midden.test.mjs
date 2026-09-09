import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CADENCE_MINUTES,
  CHIPS,
  CLAUDE_CODE_VERSION,
  COUSINS,
  CYCLES,
  DAYS,
  FALLBACK_REFUSAL,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_APPEARANCE,
  FIRST_OBSERVED,
  FIVE_LINE_CYCLE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GIT_EXIT,
  GIT_FATAL,
  GIT_VERSION,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEASED_BY,
  LOG_CLAIM,
  MIDDEN_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  REPORTER,
  SEEDED_WORD,
  STATE,
  STILL_GOING,
  TITLE,
  UPDATES,
  VERDICTS,
  VERSION,
  WINDOWS_BUILD,
  WORKTREE_NAME,
  WORKTREE_PATH,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedCleared,
  seedFallbackRefuses,
  seedGitRemoveFails,
  seedMidden,
  seedMounded,
  seedPartialRemove,
  seedStoreNotPruned,
  seedThirtyMinuteCadence,
} from "./midden.mjs";

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
  return fileURLToPath(new URL("./midden.mjs", import.meta.url));
}

test("idle cleared is a hold; one GC pass stops", () => {
  const result = analyze(seedCleared());
  assert.equal(result.verdict, "cleared");
  assert.equal(result.idleWord, "cleared");
  assert.equal(IDLE_WORD, "cleared");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.cleared, true);
  assert.equal(result.phrase, "admit cleared");
  assert.equal(result.storePruned, true);
  assert.equal(result.retryLoop, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify cleared", () => {
  assert.equal(classify(emptyTicket()), "cleared");
  assert.equal(classify(""), "cleared");
  assert.equal(classify(null), "cleared");
  assert.equal(decide({}), "cleared");
});

test("#93081 seeded path scores mounded when both refuse and store stays", () => {
  const result = analyze(seedMounded());
  assert.equal(result.verdict, "mounded");
  assert.equal(result.seededWord, "mounded");
  assert.equal(SEEDED_WORD, "mounded");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mounded, true);
  assert.equal(result.phrase, "score mounded");
  assert.equal(result.gitRemoveFails, true);
  assert.equal(result.fallbackRefuses, true);
  assert.equal(result.storePruned, false);
  assert.equal(result.retryLoop, true);
  assert.equal(result.cadenceMinutes, 30);
  assert.equal(result.cycles, 853);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is midden; named midden seed holds the path", () => {
  assert.equal(PATH_WORD, "midden");
  const result = analyze(seedMidden());
  assert.equal(result.verdict, "midden");
  assert.equal(result.pathWord, "midden");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("midden.json")), "midden");
});

test("deadlock chips: git remove fails, fallback refuses, store stays, 30m cadence, partial-remove", () => {
  const git = analyze(seedGitRemoveFails());
  assert.equal(git.gitRemoveFails, true);
  assert.equal(git.gitFatal, GIT_FATAL);
  assert.equal(classify(readData("git-remove-fails.json")), "git-remove-fails");
  const fallback = analyze(seedFallbackRefuses());
  assert.equal(fallback.fallbackRefuses, true);
  assert.match(fallback.fallbackRefusal, /partial remove/);
  assert.equal(classify(readData("fallback-refuses.json")), "fallback-refuses");
  const store = analyze(seedStoreNotPruned());
  assert.equal(store.storePruned, false);
  assert.equal(store.logClaimsPrune, true);
  assert.equal(classify(readData("store-not-pruned.json")), "store-not-pruned");
  const cadence = analyze(seedThirtyMinuteCadence());
  assert.equal(cadence.cadenceMinutes, 30);
  assert.equal(classify(readData("thirty-minute-cadence.json")), "thirty-minute-cadence");
  const partial = analyze(seedPartialRemove());
  assert.equal(partial.partialRemove, true);
  assert.equal(classify(readData("partial-remove.json")), "partial-remove");
});

test("fixture toggle flips cleared vs mounded", () => {
  const cleared = scoreGate(readData("cleared.json"));
  const mounded = scoreGate(readData("mounded.json"));
  assert.equal(cleared.verdict, "cleared");
  assert.equal(mounded.verdict, "mounded");
  assert.notEqual(cleared.verdict, mounded.verdict);
  assert.equal(score(readData("cleared.json")), "cleared");
  assert.equal(score(readData("mounded.json")), "mounded");
  assert.equal(score(readData("93081.json")), "mounded");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("partial-remove.json")), "partial-remove");
  assert.equal(classify(readData("git-remove-fails.json")), "git-remove-fails");
  assert.equal(classify(readData("fallback-refuses.json")), "fallback-refuses");
  assert.equal(classify(readData("store-not-pruned.json")), "store-not-pruned");
  assert.equal(classify(readData("thirty-minute-cadence.json")), "thirty-minute-cadence");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published midden walk scores mounded after the deadlock remounds", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "mounded");
  assert.ok(night.moundedCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-cleared");
  assert.equal(idle.storePruned, true);
  assert.equal(idle.verdict, "cleared");
  const git = night.rows.find((row) => row.event === "git-remove-fails");
  assert.equal(git.verdict, "mounded");
  assert.equal(git.gitRemoveFails, true);
  const fallback = night.rows.find((row) => row.event === "fallback-refuses");
  assert.equal(fallback.fallbackRefuses, true);
  const cadence = night.rows.find((row) => row.event === "thirty-minute-cadence");
  assert.equal(cadence.cadenceMinutes, 30);
  assert.equal(cadence.cycles, 853);
  const path = night.rows.find((row) => row.event === "midden");
  assert.equal(path.verdict, "midden");
});

test("MIDDEN_WALK constant matches the issue five-line deadlock", () => {
  assert.equal(MIDDEN_WALK[0].event, "cue-cleared");
  const partial = MIDDEN_WALK.find((row) => row.event === "partial-remove");
  assert.equal(partial.gitLinkPresent, false);
  assert.equal(partial.directoryExists, true);
  const git = MIDDEN_WALK.find((row) => row.event === "git-remove-fails");
  assert.equal(git.gitExit, 128);
  const fallback = MIDDEN_WALK.find((row) => row.event === "fallback-refuses");
  assert.match(fallback.fallbackRefusal, /not safe to rm/);
  const store = MIDDEN_WALK.find((row) => row.event === "store-not-pruned");
  assert.equal(store.storePruned, false);
  assert.equal(store.logClaimsPrune, true);
  const cadence = MIDDEN_WALK.find((row) => row.event === "thirty-minute-cadence");
  assert.equal(cadence.cycles, 853);
  assert.equal(cadence.days, 20);
  assert.equal(cadence.updates, 13);
});

test("issue constants encode only #93081 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93081);
  assert.ok(ISSUE_URL.includes("93081"));
  assert.match(TITLE, /Orphaned worktree/);
  assert.match(TITLE, /30 minutes/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(REPORTER, "emanon-i");
  assert.equal(FILED_AT, "2026-09-09T12:45:23Z");
  assert.equal(VERSION, "1.49585.0.0");
  assert.equal(FIRST_OBSERVED, "1.34493.1.0");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.216");
  assert.equal(PLATFORM, "windows");
  assert.equal(WINDOWS_BUILD, "11 Pro build 26220");
  assert.equal(GIT_VERSION, "2.53.0.windows.1");
  assert.equal(WORKTREE_NAME, "clever-bassi-12c5dc");
  assert.match(WORKTREE_PATH, /clever-bassi-12c5dc/);
  assert.equal(LEASED_BY, "none");
  assert.equal(GIT_EXIT, 128);
  assert.equal(CADENCE_MINUTES, 30);
  assert.equal(CYCLES, 853);
  assert.equal(DAYS, 20);
  assert.equal(UPDATES, 13);
  assert.equal(FIRST_APPEARANCE, "2026-08-21");
  assert.equal(STILL_GOING, "2026-09-09");
  assert.match(LOG_CLAIM, /Pruning orphaned store entry/);
  assert.match(GIT_FATAL, /is not a working tree/);
  assert.match(FALLBACK_REFUSAL, /\.git link missing \(partial remove\)/);
  assert.equal(FIVE_LINE_CYCLE.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("is not a working tree"));
  assert.match(PHRASE, /not cleared — it is a midden/);
  assert.ok(HOLD.includes("cleared"));
  assert.ok(ALARM.includes("mounded"));
  assert.ok(ALARM.includes("midden"));
  assert.ok(CHIPS.includes("thirty-minute-cadence"));
  assert.ok(VERDICTS.includes("git-remove-fails"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "distinct",
    "conflated",
    "diplopic",
    "held",
    "steered",
    "greenroomed",
    "raised",
    "fallen",
    "scaffold",
    "lodged",
    "bypassed",
    "cutaway",
    "sterling",
    "debased",
    "rubbed",
    "primed",
    "flashed",
    "flashpanned",
    "unshorn",
    "sheared",
    "secateured",
    "emended",
    "unretracted",
    "palinoded",
    "ferruled",
    "interlocked",
    "passable",
    "admitted",
    "deeded",
    "parked",
    "shibbolethed",
    "countersigned",
    "homesteaded",
    "staked",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring a one-pass prune flips mounded to cleared", () => {
  const tape = {
    gitLinkPresent: false,
    directoryExists: false,
    storePruned: true,
    retryLoop: false,
    gcPasses: 1,
    cue: "cleared",
  };
  assert.equal(scoreGate(tape).verdict, "cleared");
  tape.gitRemoveFails = true;
  tape.fallbackRefuses = true;
  tape.directoryExists = true;
  tape.storePruned = false;
  tape.retryLoop = true;
  tape.cue = "mounded";
  assert.equal(scoreGate(tape).verdict, "mounded");
  tape.gitRemoveFails = false;
  tape.fallbackRefuses = false;
  tape.directoryExists = false;
  tape.storePruned = true;
  tape.retryLoop = false;
  tape.cue = "cleared";
  assert.equal(scoreGate(tape).verdict, "cleared");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [75911, 78350, 91405, 91246, 92078],
  );
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 75911);
  assert.equal(COUSINS[4].issue, 92078);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published windows WorktreePool walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /WorktreePool|worktree/i);
  assert.match(repro.note, /30/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const cleared = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cleared.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const mounded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/mounded.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(cleared.status, 0, cleared.stderr);
  assert.equal(mounded.status, 0, mounded.stderr);
  assert.equal(JSON.parse(cleared.stdout).verdict, "cleared");
  assert.equal(JSON.parse(mounded.stdout).verdict, "mounded");
});

test("handle exposes published hypothesis and #93081 headline", () => {
  const result = handle(readData("93081.json"));
  assert.equal(result.published.issue, 93081);
  assert.equal(result.published.version, "1.49585.0.0");
  assert.equal(result.published.reporter, "emanon-i");
  assert.equal(result.published.worktree, "clever-bassi-12c5dc");
  assert.equal(result.published.cycles, 853);
  assert.deepEqual(result.published.cousins, [75911, 78350, 91405, 91246, 92078]);
  assert.match(result.published.hypothesis, /missing \.git link/);
  assert.match(result.published.hypothesis, /NON-BINDING|30-minute|store entry/);
  assert.match(
    fingerprint(seedMounded()),
    /mounded\|git=fatal-not-a-working-tree\|fallback=not-safe-to-rm\|store=not-pruned/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an archaeological midden booth, not diplopia acuity", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /midden|refuse-heap|strata|ash-and-bone|kiln/i);
  assert.match(page, /#5c3a21/);
  assert.match(page, /#f3ead8/);
  assert.match(page, /#1c1814/);
  assert.match(page, /#9a9488/);
  assert.match(page, /#d4862a/);
  assert.match(page, /cleared/);
  assert.match(page, /mounded/);
  assert.match(page, /midden/);
  assert.match(page, /score mounded or admit cleared/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /22:50/);
  assert.match(page, /#249/);
  assert.match(page, /#93081/);
  assert.match(page, /WorktreePool/);
  assert.match(page, /clever-bassi-12c5dc/);
  assert.match(page, /is not a working tree/);
  assert.match(page, /partial remove/);
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
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /EB Garamond|Barlow/);
  assert.doesNotMatch(page, /Bodoni Moda|Libre Caslon|Literata/);
  assert.doesNotMatch(page, /Chakra Petch|Hind/);
  assert.doesNotMatch(page, /drop-zone|dropzone|drop zone/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /velvet|tungsten|call sheet|cue light/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology|double-vision|acuity booth/i);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bconflated\b/);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /NOT Greenroom/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
  assert.match(page, /NOT Interlock/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Midden/);
  assert.match(readme, /#93081/);
  assert.match(readme, /cleared/);
  assert.match(readme, /mounded/);
  assert.match(readme, /midden/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Do NOT reuse Atkinson Hyperlegible/);
  assert.match(readme, /Do NOT reuse Cormorant/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Diplopia/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/midden/);
  assert.match(readme, /node --test projects\/midden\/midden\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #249 features Midden; Diplopia stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 249);
  assert.equal(catalog.products[0].name, "Midden");
  assert.equal(catalog.products[0].slug, "midden");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/midden/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  assert.match(catalog.products[0].summary, /22:50 midden/);
  const diplopia = catalog.products.find((row) => row.slug === "diplopia");
  assert.ok(diplopia);
  assert.equal(diplopia.featured, false);
  const greenroom = catalog.products.find((row) => row.slug === "greenroom");
  assert.ok(greenroom);
  assert.equal(greenroom.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites midden to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/midden");
  assert.equal(vercel.rewrites[0].destination, "/projects/midden");
  assert.equal(vercel.rewrites[1].source, "/midden/");
  assert.equal(vercel.rewrites[1].destination, "/projects/midden");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
