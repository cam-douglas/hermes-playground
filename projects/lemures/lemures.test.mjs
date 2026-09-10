import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BASH_AT,
  BRIDGE_NOTE,
  CHIPS,
  CLAUDE_VERSION,
  CLEAR_AT,
  CONTENT_SHAPE,
  COUSINS,
  COURTYARD_STATIONS,
  EMIT_STAMP,
  FEATURED_ISSUE,
  FILED,
  FINDER,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  IMAGE_PROMPT_AT,
  ISSUE_URL,
  LABELS,
  LEMURES_WALK,
  METADATA_FIELD,
  MODEL,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PREV_ASK_AT,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  clashCymbals,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readCourtyard,
  score,
  scoreGate,
  scoreWalk,
  seedBridgeSurvives,
  seedEmitNow,
  seedGuardPasses,
  seedHold,
  seedImageSkip,
  seedLaid,
  seedLemures,
  seedNeverReset,
  seedProcessScoped,
  seedRcMirror,
  seedRemanent,
  seedStringOnly,
  throwBeans,
} from "./lemures.mjs";

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
  return fileURLToPath(new URL("./lemures.mjs", import.meta.url));
}

test("idle laid is a hold; classifier laid on conversation reset", () => {
  const result = analyze(seedLaid());
  assert.equal(result.verdict, "laid");
  assert.equal(result.idleWord, "laid");
  assert.equal(IDLE_WORD, "laid");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.laid, true);
  assert.equal(result.phrase, "admit laid");
  assert.equal(result.cleared, false);
  assert.equal(result.imagePrompt, false);
  assert.equal(result.neverReset, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify laid", () => {
  assert.equal(classify(emptyTicket()), "laid");
  assert.equal(classify(""), "laid");
  assert.equal(classify(null), "laid");
  assert.equal(decide({}), "laid");
});

test("#93256 seeded path scores lemures when remanent latestAsk walks after /clear", () => {
  const result = analyze(seedLemures());
  assert.equal(result.verdict, "lemures");
  assert.equal(result.seededWord, "lemures");
  assert.equal(SEEDED_WORD, "lemures");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lemures, true);
  assert.equal(result.phrase, "score lemures");
  assert.equal(result.cleared, true);
  assert.equal(result.imagePrompt, true);
  assert.equal(result.neverReset, true);
  assert.equal(result.processScoped, true);
  assert.equal(result.stringOnly, true);
  assert.equal(result.emitNow, true);
  assert.equal(result.guardPasses, true);
  assert.equal(result.rcMirror, true);
  assert.equal(result.bridgeSurvives, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is remanent; named remanent seed holds the path", () => {
  assert.equal(PATH_WORD, "remanent");
  const result = analyze(seedRemanent());
  assert.equal(result.verdict, "remanent");
  assert.equal(result.pathWord, "remanent");
  assert.equal(result.hold, false);
  assert.equal(classify({ seed: "remanent", preferSeed: true, remanent: true }), "remanent");
});

test("HOLD includes laid / hold", () => {
  assert.ok(HOLD.includes("laid"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: process-scoped, never-reset, string-only, image-skip, emit, guard, rc, bridge", () => {
  assert.equal(analyze(seedProcessScoped()).processScoped, true);
  assert.equal(classify(seedProcessScoped()), "process-scoped");
  assert.equal(analyze(seedNeverReset()).neverReset, true);
  assert.equal(classify(seedNeverReset()), "never-reset");
  assert.equal(analyze(seedStringOnly()).stringOnly, true);
  assert.equal(classify(seedStringOnly()), "string-only");
  assert.equal(analyze(seedImageSkip()).imagePrompt, true);
  assert.equal(classify(seedImageSkip()), "image-skip");
  assert.equal(analyze(seedEmitNow()).emitNow, true);
  assert.equal(classify(seedEmitNow()), "emit-now");
  assert.equal(analyze(seedGuardPasses()).guardPasses, true);
  assert.equal(classify(seedGuardPasses()), "guard-passes");
  assert.equal(analyze(seedRcMirror()).rcMirror, true);
  assert.equal(classify(seedRcMirror()), "rc-mirror");
  assert.equal(analyze(seedBridgeSurvives()).bridgeSurvives, true);
  assert.equal(classify(seedBridgeSurvives()), "bridge-survives");
});

test("fixture toggle flips laid vs lemures", () => {
  const laid = scoreGate(seedLaid());
  const lemures = scoreGate(readData("lemures.json"));
  assert.equal(laid.verdict, "laid");
  assert.equal(lemures.verdict, "lemures");
  assert.notEqual(laid.verdict, lemures.verdict);
  assert.equal(score(seedLaid()), "laid");
  assert.equal(score(readData("lemures.json")), "lemures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("laid"));
  assert.ok(CHIPS.includes("lemures"));
  assert.ok(CHIPS.includes("remanent"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lemures"));
  assert.ok(ALARM.includes("remanent"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published lemures walk scores lemures after the hold floods", () => {
  const night = scoreWalk({ rows: LEMURES_WALK });
  assert.equal(night.verdict, "lemures");
  assert.ok(night.lemuresCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-laid");
  assert.equal(idle.laid, true);
  assert.equal(idle.verdict, "laid");
  const clear = night.rows.find((row) => row.event === "conversation-reset");
  assert.equal(clear.cleared, true);
  const scope = night.rows.find((row) => row.event === "process-scoped");
  assert.equal(scope.processScoped, true);
  const image = night.rows.find((row) => row.event === "image-skip");
  assert.equal(image.imagePrompt, true);
  const emit = night.rows.find((row) => row.event === "emit-now");
  assert.equal(emit.emitNow, true);
  const guard = night.rows.find((row) => row.event === "guard-passes");
  assert.equal(guard.guardPasses, true);
  const mirror = night.rows.find((row) => row.event === "rc-mirror");
  assert.equal(mirror.rcMirror, true);
  const bridge = night.rows.find((row) => row.event === "bridge-survives");
  assert.equal(bridge.bridgeSurvives, true);
  const hear = night.rows.find((row) => row.event === "lemures");
  assert.equal(hear.neverReset, true);
  const path = night.rows.find((row) => row.event === "remanent");
  assert.equal(path.verdict, "remanent");
});

test("LEMURES_WALK constant matches the issue courtyard walk", () => {
  assert.equal(LEMURES_WALK[0].event, "cue-laid");
  const clear = LEMURES_WALK.find((row) => row.event === "conversation-reset");
  assert.equal(clear.cleared, true);
  const image = LEMURES_WALK.find((row) => row.event === "image-skip");
  assert.equal(image.imagePrompt, true);
  const hear = LEMURES_WALK.find((row) => row.event === "lemures");
  assert.equal(hear.bridgeSurvives, true);
  const path = LEMURES_WALK.find((row) => row.event === "remanent");
  assert.equal(path.remanent, true);
});

test("issue constants encode only #93256 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93256);
  assert.ok(ISSUE_URL.includes("93256"));
  assert.match(TITLE, /latestAsk/);
  assert.match(TITLE, /\/clear/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:tui"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:vscode"));
  assert.equal(AUTHOR, "KamilDev");
  assert.equal(FILED, "2026-09-10T03:53:45Z");
  assert.equal(CLAUDE_VERSION, "2.1.267");
  assert.equal(OS, "Windows 11");
  assert.match(SURFACE, /VS Code integrated terminal/);
  assert.match(MODEL, /Opus 5/);
  assert.equal(PREV_ASK_AT, "03:21:09Z");
  assert.equal(CLEAR_AT, "03:24:39Z");
  assert.equal(IMAGE_PROMPT_AT, "03:27:20Z");
  assert.equal(BASH_AT, "03:32:08Z");
  assert.equal(CONTENT_SHAPE, "[image, text]");
  assert.equal(METADATA_FIELD, "external_metadata.task_summary");
  assert.equal(FINDER, "findLatestRealUserAsk");
  assert.equal(EMIT_STAMP, "at: Date.now()");
  assert.match(BRIDGE_NOTE, /bridgeSessionId/);
  assert.equal(COURTYARD_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("latestAsk"));
  assert.ok(FINGERPRINT_LINES.includes("findLatestRealUserAsk"));
  assert.match(PHRASE, /latestAsk across \/clear/);
  assert.match(PHRASE, /lemures never stay laid/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "released",
    "escheat",
    "stale",
    "freehold",
    "mortmain",
    "phantom",
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
    "moored",
    "scuttled",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "cleared",
    "mounded",
    "distinct",
    "held",
    "raised",
    "fallen",
    "primed",
    "flashed",
    "greenroomed",
    "scaffold",
    "stereotype",
    "parergon",
    "lacuna",
    "hangfire",
    "afterimage",
    "remora",
    "quieted",
    "unrung",
    "latent",
    "flushed",
    "collated",
    "stereotyped",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring a laid courtyard flips lemures to laid", () => {
  const tape = {
    laid: true,
    cleared: false,
    imagePrompt: false,
    neverReset: false,
    cue: "laid",
  };
  assert.equal(scoreGate(tape).verdict, "laid");
  tape.laid = false;
  tape.cleared = true;
  tape.imagePrompt = true;
  tape.neverReset = true;
  tape.cue = "lemures";
  assert.equal(scoreGate(tape).verdict, "lemures");
  tape.laid = true;
  tape.cleared = false;
  tape.imagePrompt = false;
  tape.neverReset = false;
  tape.cue = "laid";
  assert.equal(scoreGate(tape).verdict, "laid");
});

test("beans and cymbals mark remanent shades after /clear + image", () => {
  const idleBeans = throwBeans({ laid: true, cleared: false });
  assert.equal(idleBeans.thrown, true);
  assert.equal(idleBeans.rite, "laid");
  const cutBeans = throwBeans({ laid: false, cleared: true });
  assert.equal(cutBeans.thrown, false);
  assert.equal(cutBeans.rite, "lemures");
  const live = clashCymbals({
    cleared: false,
    imagePrompt: false,
    emitNow: false,
  });
  assert.equal(live.clashed, true);
  assert.equal(live.lamp, "laid");
  const cut = clashCymbals({
    cleared: true,
    imagePrompt: true,
    emitNow: true,
  });
  assert.equal(cut.lamp, "lemures");
  assert.equal(cut.guardPasses, true);
  const yard = readCourtyard({
    cleared: true,
    imagePrompt: true,
    neverReset: true,
    emitNow: true,
  });
  assert.equal(yard.remanentShade, true);
  assert.equal(yard.cue, "lemures");
  const calm = readCourtyard({ laid: true, cleared: false });
  assert.equal(calm.remanentShade, false);
  assert.equal(calm.cue, "laid");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 87533);
  assert.equal(COUSINS[0].citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("recension"));
  assert.ok(NOT_PRODUCTS.includes("quietus"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93219);
  assert.equal(BACKUPS[1].issue, 93207);
  assert.equal(BACKUPS[2].issue, 93250);
  assert.equal(BACKUPS[3].issue, 93239);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const laid = spawnSync(
    process.execPath,
    [modelPath()],
    { encoding: "utf8" },
  );
  const lemures = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lemures.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(laid.status, 0, laid.stderr);
  assert.equal(lemures.status, 0, lemures.stderr);
  assert.equal(JSON.parse(laid.stdout).verdict, "laid");
  assert.equal(JSON.parse(lemures.stdout).verdict, "lemures");
});

test("handle exposes published hypothesis and #93256 headline", () => {
  const result = handle(readData("lemures.json"));
  assert.equal(result.published.issue, 93256);
  assert.equal(result.published.claudeVersion, "2.1.267");
  assert.equal(result.published.author, "KamilDev");
  assert.equal(result.published.clearAt, "03:24:39Z");
  assert.equal(result.published.contentShape, "[image, text]");
  assert.deepEqual(result.published.cousins, [87533]);
  assert.deepEqual(result.published.backups, [93219, 93207, 93250, 93239]);
  assert.match(result.published.hypothesis, /process-scoped/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedLemures()),
    /lemures\|clear=yes\|image=skip\|reset=never\|scope=process\|ask=string-only\|emit=now\|cue=lemures/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Lemuria night courtyard, not a chamber or exchange", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Red Hat Text/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /Lemuria|Parentalia|night courtyard|black beans|bronze cymbals|chalk circles|bone-white masks/i);
  assert.match(page, /#0a0e1c|#12151f|#c3924a|#efe6d4/);
  assert.match(page, /laid/);
  assert.match(page, /lemures/);
  assert.match(page, /remanent/);
  assert.match(page, /score lemures or admit laid/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /13:50/);
  assert.match(page, /#261/);
  assert.match(page, /#93256/);
  assert.match(page, /latestAsk/);
  assert.match(page, /findLatestRealUserAsk/);
  assert.match(page, /Date\.now\(\)/);
  assert.match(page, /task_summary/);
  assert.match(page, /bridgeSessionId/);
  assert.match(page, /KamilDev/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /03:24:39Z/);
  assert.match(page, /03:27:20Z/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#0f1a22/);
  assert.doesNotMatch(page, /#17303a/);
  assert.doesNotMatch(page, /#3aa89a/);
  assert.doesNotMatch(page, /#c24e32/);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID|iron coffer/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bfreehold\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Ephemera/i);
  assert.match(page, /NOT Palimpsest/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Quietus/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Lemures/);
  assert.match(readme, /#93256/);
  assert.match(readme, /laid/);
  assert.match(readme, /lemures/);
  assert.match(readme, /remanent/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Red Hat Text/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/lemures/);
  assert.match(readme, /node --test projects\/lemures\/lemures\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /latestAsk/);
  assert.match(readme, /bridgeSessionId/);
});

test("catalog #261 features Lemures; Escheat stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 261);
  assert.equal(catalog.products[0].name, "Lemures");
  assert.equal(catalog.products[0].slug, "lemures");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/lemures/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /13:50/);
  assert.match(catalog.products[0].summary, /lemures/);
  assert.match(catalog.products[0].summary, /#93256/);
  assert.match(catalog.products[0].summary, /laid/);
  const escheat = catalog.products.find((row) => row.slug === "escheat");
  assert.ok(escheat);
  assert.equal(escheat.featured, false);
  const mortmain = catalog.products.find((row) => row.slug === "mortmain");
  assert.ok(mortmain);
  assert.equal(mortmain.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "lemures").length, 1);
});

test("vercel rewrites lemures to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/lemures");
  assert.equal(vercel.rewrites[0].destination, "/projects/lemures");
  assert.equal(vercel.rewrites[1].source, "/lemures/");
  assert.equal(vercel.rewrites[1].destination, "/projects/lemures");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
