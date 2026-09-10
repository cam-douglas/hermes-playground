import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CACHET_WALK,
  CACHE_CONTROL,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CONTENT_LENGTH,
  COUSINS,
  CROSS_HIT_READ,
  CROSS_HIT_WRITE,
  DESK_STATIONS,
  FABLE_DOCS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FRESH_CARRIER,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MESSAGE_INDEX,
  MESSAGE_ROLE,
  MODEL_FABLE,
  MODEL_OPUS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PROBE_TOKENS,
  PRODUCT_WORD,
  REAL_REWRITE_READ,
  REAL_REWRITE_WRITE,
  RESUME_CARRIER,
  SEEDED_WORD,
  SESSION_KIND,
  SESSION_START,
  STATE,
  TERMINAL,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCacheControl,
  inspectCarrier,
  inspectMeters,
  inspectModel,
  inspectPrefix,
  readFolio,
  score,
  scoreGate,
  scoreWalk,
  seedArrayCarrier,
  seedBackgroundFork,
  seedCacheControl,
  seedCachet,
  seedEnvironment,
  seedFableMiss,
  seedFlattened,
  seedFreshStart,
  seedHit,
  seedHold,
  seedOpusHit,
  seedPlainString,
  seedPrefixBust,
  seedProbe,
  seedResume,
  seedRewrite,
  seedSessionStart,
  seedStringCarrier,
} from "./cachet.mjs";

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
  return fileURLToPath(new URL("./cachet.mjs", import.meta.url));
}

test("idle hit is a hold; ARRAY carrier + cache_control; prefix matches; cache_read past floor", () => {
  const result = analyze(seedHit());
  assert.equal(result.verdict, "hit");
  assert.equal(result.idleWord, "hit");
  assert.equal(IDLE_WORD, "hit");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.hit, true);
  assert.equal(result.phrase, "admit hit");
  assert.equal(result.stringCarrier, false);
  assert.equal(result.prefixBust, false);
  assert.equal(result.cacheControlDropped, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify hit", () => {
  assert.equal(classify(emptyTicket()), "hit");
  assert.equal(classify(""), "hit");
  assert.equal(classify(null), "hit");
  assert.equal(decide({}), "hit");
});

test("#93490 seeded path scores flattened when Fable resume stringifies messages[1]", () => {
  const result = analyze(seedFlattened());
  assert.equal(result.verdict, "flattened");
  assert.equal(result.seededWord, "flattened");
  assert.equal(SEEDED_WORD, "flattened");
  assert.equal(PRODUCT_WORD, "cachet");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.flattened, true);
  assert.equal(result.phrase, "score cachet");
  assert.equal(result.resume, true);
  assert.equal(result.fable, true);
  assert.equal(result.stringCarrier, true);
  assert.equal(result.plainString, true);
  assert.equal(result.cacheControlDropped, true);
  assert.equal(result.prefixBust, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("Fable resume plus STRING carrier is the #93490 cachet", () => {
  const carrier = inspectCarrier({
    resume: true,
    stringCarrier: true,
    plainString: true,
    fable: true,
  });
  assert.equal(carrier.stamp, "flattened");
  assert.equal(carrier.string, true);
  const scored = scoreGate({
    flattened: true,
    resume: true,
    fable: true,
    stringCarrier: true,
    plainString: true,
    cacheControlDropped: true,
    prefixBust: true,
    cue: "flattened",
  });
  assert.equal(scored.verdict, "flattened");
  assert.equal(scored.prefixBust, true);
  const calm = inspectCacheControl({ hit: true, cacheControl: true });
  assert.equal(calm.stamp, "hit");
});

test("path word is string-carrier; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "string-carrier");
  const result = analyze(seedStringCarrier());
  assert.equal(result.verdict, "string-carrier");
  assert.equal(result.pathWord, "string-carrier");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "string-carrier", preferSeed: true, flattened: true }),
    "string-carrier",
  );
  assert.equal(classify(seedResume()), "resume");
});

test("HOLD includes hit / hold", () => {
  assert.ok(HOLD.includes("hit"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: fable-miss, opus-hit, resume, plain-string, prefix-bust, rewrite, session-start", () => {
  assert.equal(classify(seedFableMiss()), "fable-miss");
  assert.equal(classify(seedOpusHit()), "opus-hit");
  assert.equal(classify(seedResume()), "resume");
  assert.equal(classify(seedFreshStart()), "fresh-start");
  assert.equal(classify(seedArrayCarrier()), "array-carrier");
  assert.equal(classify(seedPlainString()), "plain-string");
  assert.equal(classify(seedCacheControl()), "cache-control");
  assert.equal(classify(seedPrefixBust()), "prefix-bust");
  assert.equal(classify(seedRewrite()), "rewrite");
  assert.equal(classify(seedSessionStart()), "session-start");
  assert.equal(classify(seedEnvironment()), "environment");
  assert.equal(classify(seedBackgroundFork()), "background-fork");
  assert.equal(classify(seedProbe()), "probe");
  assert.equal(classify(seedCachet()), "cachet");
});

test("booth fixtures flip hit vs flattened vs string-carrier", () => {
  const idle = scoreGate(seedHit());
  const seeded = scoreGate(readData("flattened.json"));
  const hit = readData("hit.json");
  const flattened = readData("flattened.json");
  const path = readData("string-carrier.json");
  const product = readData("cachet.json");
  assert.equal(idle.verdict, "hit");
  assert.equal(seeded.verdict, "flattened");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedHit()), "hit");
  assert.equal(score(readData("flattened.json")), "flattened");
  assert.equal(hit.arrayCarrier, true);
  assert.equal(hit.hit, true);
  assert.equal(scoreGate(hit).verdict, "hit");
  assert.equal(flattened.contentShape, "STRING");
  assert.equal(flattened.contentLength, CONTENT_LENGTH);
  assert.equal(flattened.resume, true);
  assert.equal(flattened.stringCarrier, true);
  assert.equal(classify(flattened), "flattened");
  assert.equal(path.paths.length, 3);
  assert.equal(
    path.paths[0].rule,
    "fresh start: content is ARRAY with one text block + cache_control {type: ephemeral, ttl: 1h}",
  );
  assert.equal(path.paths[2].result, "string-carrier bust is Fable-specific");
  assert.equal(classify(path), "string-carrier");
  assert.equal(classify(product), "cachet");
  assert.equal(flattened.issue, 93490);
  assert.equal(flattened.contentLength, 26285);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("hit"));
  assert.ok(CHIPS.includes("flattened"));
  assert.ok(CHIPS.includes("cachet"));
  assert.ok(CHIPS.includes("string-carrier"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("flattened"));
  assert.ok(ALARM.includes("string-carrier"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cachet walk scores flattened after the idle hold", () => {
  const desk = scoreWalk({ rows: CACHET_WALK });
  assert.equal(desk.verdict, "flattened");
  assert.ok(desk.flattenedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-hit");
  assert.equal(idle.hit, true);
  assert.equal(idle.verdict, "hit");
  const fresh = desk.rows.find((row) => row.event === "fresh-start");
  assert.equal(fresh.arrayCarrier, true);
  const cross = desk.rows.find((row) => row.event === "cross-hit");
  assert.equal(cross.hit, true);
  const folio = desk.rows.find((row) => row.event === "session-start");
  assert.equal(folio.sessionStart, true);
  const flatten = desk.rows.find((row) => row.event === "plain-string");
  assert.equal(flatten.plainString, true);
  assert.equal(flatten.contentLength, 26285);
  const bust = desk.rows.find((row) => row.event === "prefix-bust");
  assert.equal(bust.prefixBust, true);
  const opus = desk.rows.find((row) => row.event === "opus-hit");
  assert.equal(opus.opus, true);
  const fable = desk.rows.find((row) => row.event === "fable-miss");
  assert.equal(fable.fable, true);
  const path = desk.rows.find((row) => row.event === "string-carrier");
  assert.equal(path.verdict, "string-carrier");
});

test("CACHET_WALK constant matches the issue blotter walk", () => {
  assert.equal(CACHET_WALK[0].event, "cue-hit");
  const flatten = CACHET_WALK.find((row) => row.event === "plain-string");
  assert.equal(flatten.stringCarrier, true);
  const bust = CACHET_WALK.find((row) => row.event === "prefix-bust");
  assert.equal(bust.prefixBust, true);
  const path = CACHET_WALK.find((row) => row.event === "string-carrier");
  assert.equal(path.flattened, true);
  const scoreRow = CACHET_WALK.find((row) => row.event === "cachet");
  assert.equal(scoreRow.flattened, true);
});

test("issue constants encode only #93490 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93490);
  assert.ok(ISSUE_URL.includes("93490"));
  assert.match(TITLE, /session-start context message is replayed as a plain string/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:cost"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("performance"));
  assert.equal(AUTHOR, "vvasic");
  assert.equal(FILED, "2026-09-10T22:38:34Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.268");
  assert.equal(MODEL_FABLE, "fable 5.1");
  assert.equal(MODEL_OPUS, "opus");
  assert.equal(SESSION_KIND, "headless and interactive");
  assert.equal(PLATFORM, "macos");
  assert.equal(TERMINAL, "iTerm2, zsh");
  assert.equal(MESSAGE_INDEX, 1);
  assert.equal(MESSAGE_ROLE, "system");
  assert.match(SESSION_START, /SessionStart hook output/);
  assert.equal(CONTENT_LENGTH, 26285);
  assert.deepEqual(CACHE_CONTROL, { type: "ephemeral", ttl: "1h" });
  assert.equal(FRESH_CARRIER, "ARRAY");
  assert.equal(RESUME_CARRIER, "STRING");
  assert.equal(PROBE_TOKENS, "18-25k");
  assert.equal(REAL_REWRITE_READ, 27000);
  assert.equal(REAL_REWRITE_WRITE, 385000);
  assert.equal(CROSS_HIT_READ, 231238);
  assert.equal(CROSS_HIT_WRITE, 0);
  assert.match(FABLE_DOCS, /Editing earlier turns invalidates thinking blocks/);
  assert.equal(DESK_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("string-carrier"));
  assert.ok(FINGERPRINT_LINES.includes("fable-miss"));
  assert.match(PHRASE, /score cachet or admit hit/);
});

test("has-repro fingerprints encode the published Fable resume window", () => {
  const result = handle(readData("flattened.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "vvasic");
  assert.equal(result.published.sessionKind, "headless and interactive");
  assert.equal(result.published.contentLength, 26285);
  assert.match(
    fingerprint(seedFlattened()),
    /flattened\|path=resume\|carrier=STRING\|cache_control=dropped\|prefix=bust\|model=fable\|cue=flattened/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Strobe and Counterfoil", () => {
  const required = [
    "steady",
    "strobing",
    "off-label",
    "strobe",
    "matched",
    "skewed",
    "headers-hash",
    "counterfoil",
    "traced",
    "pathless",
    "image-cache",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "sterling",
    "debased",
    "hallmark",
    "remanent",
    "collimated",
    "diopter",
    "hysteresis",
    "banked",
    "ephemera",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "oubliette",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("hit blotter flips flattened back when the ARRAY carrier stays affixed", () => {
  const tape = {
    hit: true,
    flattened: false,
    resume: false,
    arrayCarrier: true,
    cacheControl: true,
    prefixBust: false,
    stringCarrier: false,
    cue: "hit",
  };
  assert.equal(scoreGate(tape).verdict, "hit");
  tape.hit = false;
  tape.flattened = true;
  tape.resume = true;
  tape.fable = true;
  tape.stringCarrier = true;
  tape.prefixBust = true;
  tape.cue = "flattened";
  assert.equal(scoreGate(tape).verdict, "flattened");
  tape.hit = true;
  tape.flattened = false;
  tape.resume = false;
  tape.fable = false;
  tape.stringCarrier = false;
  tape.prefixBust = false;
  tape.cue = "hit";
  assert.equal(scoreGate(tape).verdict, "hit");
});

test("carrier, cache_control, prefix, model, and folio mark flattened after Fable resume", () => {
  const idle = inspectCarrier({ arrayCarrier: true, hit: true });
  assert.equal(idle.stamp, "hit");
  assert.equal(idle.array, true);
  const carrier = inspectCarrier({
    resume: true,
    stringCarrier: true,
    plainString: true,
    fable: true,
  });
  assert.equal(carrier.stamp, "flattened");
  assert.equal(carrier.string, true);
  const cacheControl = inspectCacheControl({
    cacheControlDropped: true,
    stringCarrier: true,
  });
  assert.equal(cacheControl.stamp, "flattened");
  assert.equal(cacheControl.value, null);
  const prefix = inspectPrefix({
    prefixBust: true,
    stringCarrier: true,
  });
  assert.equal(prefix.stamp, "flattened");
  assert.equal(prefix.bust, true);
  const model = inspectModel({
    fable: true,
    resume: true,
    fableMiss: true,
  });
  assert.equal(model.stamp, "flattened");
  assert.equal(model.miss, true);
  const meters = inspectMeters({
    flattened: true,
    stringCarrier: true,
    floorStuck: true,
    rewrite: true,
  });
  assert.equal(meters.stamp, "flattened");
  assert.equal(meters.realWrite, 385000);
  const desk = readFolio({
    flattened: true,
    resume: true,
    fable: true,
    stringCarrier: true,
    prefixBust: true,
  });
  assert.equal(desk.flattened, true);
  assert.equal(desk.mark, "flattened");
  const calm = readFolio({
    hit: true,
    flattened: false,
    arrayCarrier: true,
    cacheControl: true,
  });
  assert.equal(calm.flattened, false);
  assert.equal(calm.mark, "hit");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 91971);
  assert.equal(COUSINS[1].issue, 83913);
  assert.equal(COUSINS[2].issue, 44045);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("strobe"));
  assert.ok(NOT_PRODUCTS.includes("counterfoil"));
  assert.ok(NOT_PRODUCTS.includes("lucida"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("diopter"));
  assert.ok(NOT_PRODUCTS.includes("hysteresis"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93485);
  assert.equal(BACKUPS[1].issue, 93458);
  assert.equal(BACKUPS[2].issue, 93439);
  assert.equal(BACKUPS[3].issue, 93475);
  assert.equal(BACKUPS[4].issue, 93438);
  assert.equal(BACKUPS[5].issue, 93466);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/flattened.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "hit");
  assert.equal(JSON.parse(seeded.stdout).verdict, "flattened");
});

test("handle exposes published hypothesis and #93490 headline", () => {
  const result = handle(readData("flattened.json"));
  assert.equal(result.published.issue, 93490);
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "vvasic");
  assert.deepEqual(result.published.cousins, [91971, 83913, 44045]);
  assert.ok(result.published.backups.includes(93485));
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(93466));
  assert.match(result.published.hypothesis, /ARRAY\+cache_control/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a wax-cachet blotter desk, not a hangar strobe or cheque counterfoil", () => {
  const page = readPage();
  assert.match(page, /Cormorant Infant/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /cachet|blotter|folio|wax|press/i);
  assert.match(page, /#5c0a1a|#f3e6c8|#c9a227|#1a1208|#1f3d2a/);
  assert.match(page, /\bhit\b/);
  assert.match(page, /flattened/);
  assert.match(page, /string-carrier/);
  assert.match(page, /score cachet or admit hit/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /09:50/);
  assert.match(page, /#280/);
  assert.match(page, /#93490/);
  assert.match(page, /vvasic/);
  assert.match(page, /2\.1\.268/);
  assert.match(page, /SessionStart/);
  assert.match(page, /26285/);
  assert.match(page, /Fable/);
  assert.match(page, /Opus/);
  assert.match(page, /cache_control/);
  assert.match(page, /Press the cachet/);
  assert.match(page, /Score cachet/);
  assert.match(page, /Affix the folio/);
  assert.match(page, /Compare Fable \/ Opus/);
  assert.match(page, /Pin idle hit/);
  assert.match(page, /Pin seeded flattened/);
  assert.match(page, /Pin string-carrier/);
  assert.match(page, /Clear the blotter/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Libre Franklin/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /#0b1220/);
  assert.doesNotMatch(page, /#3de0ff/);
  assert.doesNotMatch(page, /#7c5cff/);
  assert.doesNotMatch(page, /#0d3b2e/);
  assert.doesNotMatch(page, /#f4efe6/);
  assert.doesNotMatch(page, /#f7f0e4/);
  assert.doesNotMatch(page, /#5c4d8a/);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse/i);
  assert.doesNotMatch(page, /\bsteady\b/);
  assert.doesNotMatch(page, /\bstrobing\b/);
  assert.doesNotMatch(page, /\boff-label\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\bskewed\b/);
  assert.doesNotMatch(page, /\btraced\b/);
  assert.doesNotMatch(page, /\bpathless\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Strobe/i);
  assert.match(page, /NOT Counterfoil/i);
  assert.match(page, /NOT Lucida/i);
  assert.match(page, /NOT Fomite/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Hibernacle/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Hallmark/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cachet/);
  assert.match(readme, /#93490/);
  assert.match(readme, /\bhit\b/);
  assert.match(readme, /flattened/);
  assert.match(readme, /string-carrier/);
  assert.match(readme, /Cormorant Infant/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Strobe/i);
  assert.match(readme, /NOT Counterfoil/i);
  assert.match(readme, /NOT Lucida/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /NOT Snubber/i);
  assert.match(readme, /NOT Fosse/i);
  assert.match(readme, /NOT Hibernacle/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /2\.1\.268/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cachet/);
  assert.match(readme, /node --test projects\/cachet\/cachet\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /ARRAY\+cache_control/);
  assert.match(readme, /#91971/);
  assert.match(readme, /#83913/);
  assert.match(readme, /#44045/);
  assert.match(readme, /blotter/);
  assert.match(readme, /SessionStart/);
});

test("catalog features Cachet only; Strobe and Counterfoil unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 280);
  assert.equal(catalog.products[0].name, "Cachet");
  assert.equal(catalog.products[0].slug, "cachet");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cachet/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /09:50/);
  assert.match(catalog.products[0].summary, /cachet/);
  assert.match(catalog.products[0].summary, /#93490/);
  assert.match(catalog.products[0].summary, /\bhit\b/);
  assert.match(catalog.products[0].summary, /flattened/);
  assert.match(catalog.products[0].summary, /string-carrier/);
  const strobe = catalog.products.find((row) => row.slug === "strobe");
  assert.ok(strobe);
  assert.equal(strobe.featured, false);
  const counterfoil = catalog.products.find((row) => row.slug === "counterfoil");
  assert.ok(counterfoil);
  assert.equal(counterfoil.featured, false);
  const lucida = catalog.products.find((row) => row.slug === "lucida");
  assert.ok(lucida);
  assert.equal(lucida.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cachet").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93490") && row.slug !== "cachet"));
});

test("vercel rewrites cachet to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cachet");
  assert.equal(vercel.rewrites[0].destination, "/projects/cachet");
  assert.equal(vercel.rewrites[1].source, "/cachet/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cachet");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
