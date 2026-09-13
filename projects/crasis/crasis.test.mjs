import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHECKED_ON,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  CRASIS_WALK,
  DISTRIBUTION,
  ENCODING_RULE,
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
  ISSUE_URL,
  KOREAN_A,
  KOREAN_B,
  KOREAN_CONTROL,
  LABELS,
  MEMORY_SNIPPET,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CRASED_PROOF,
  SAMPLE_PATH_A,
  SAMPLE_PATH_B,
  SAMPLE_PATH_CONTROL,
  SAMPLE_PATH_HYPHEN,
  SAMPLE_PATH_SLASH,
  SAMPLE_SLUG_LEN3,
  SAMPLE_SLUG_LEN4,
  SAMPLE_SLUG_SEP,
  SCAN_STORES,
  SECRET_CODE,
  SEEDED_WORD,
  SEP_HYPHEN,
  SEP_SLASH,
  SIX_CLIENT_COUNT,
  SIX_CLIENT_STORE,
  STATE,
  STORE_ROOT,
  SURFACE,
  TITLE,
  VERDICTS,
  WORKAROUND,
  WORKAROUND_LIMIT,
  analyze,
  classify,
  decide,
  emptyTicket,
  encodeStoreSlug,
  fingerprint,
  handle,
  inspectCollapse,
  inspectMemory,
  inspectSeparator,
  inspectSlug,
  mapLigature,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCrased,
  seedCrasis,
  seedHold,
  seedInjective,
  seedMemoryLeak,
  seedNonAsciiCollapse,
  seedSeparatorAmbiguity,
  seedStoreSlugCollide,
  slugsCollide,
} from "./crasis.mjs";

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
  return fileURLToPath(new URL("./crasis.mjs", import.meta.url));
}

test("idle injective is a hold; one path, one store", () => {
  const result = analyze(seedInjective());
  assert.equal(result.verdict, "injective");
  assert.equal(result.idleWord, "injective");
  assert.equal(IDLE_WORD, "injective");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.injective, true);
  assert.equal(result.phrase, "admit injective");
  assert.equal(result.crased, false);
  assert.equal(result.storeSlugCollide, false);
  assert.ok(HOLD_ALIASES.includes("injective"));
  assert.ok(HOLD_ALIASES.includes("distinct"));
  assert.ok(HOLD_ALIASES.includes("sealed"));
  assert.ok(HOLD_ALIASES.includes("separate"));
  assert.ok(HOLD_ALIASES.includes("one-path-one-store"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify injective", () => {
  assert.equal(classify(emptyTicket()), "injective");
  assert.equal(classify(""), "injective");
  assert.equal(classify(null), "injective");
  assert.equal(decide({}), "injective");
});

test("#93960 seeded path scores crasis when the slug is crased", () => {
  const result = analyze(seedCrased());
  assert.equal(result.verdict, "crasis");
  assert.equal(result.seededWord, "crased");
  assert.equal(SEEDED_WORD, "crased");
  assert.equal(PRODUCT_WORD, "crasis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.crased, true);
  assert.equal(result.phrase, "score crasis");
  assert.equal(result.storeSlugCollide, true);
  assert.equal(result.nonAsciiCollapse, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("store-slug-collide plus non-ASCII collapse is the #93960 crasis", () => {
  const cut = inspectSlug({ crased: true, storeSlugCollide: true });
  assert.equal(cut.stamp, "store-slug-collide");
  assert.equal(cut.collide, true);
  const scored = scoreGate({
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    separatorAmbiguity: true,
    memoryLeak: true,
    cue: "crased",
  });
  assert.equal(scored.verdict, "crasis");
  assert.equal(scored.storeSlugCollide, true);
  const open = inspectSlug({ injective: true, storeSlugCollide: false });
  assert.equal(open.stamp, "one-path-one-store");
});

test("path word is store-slug-collide; fused slug seed holds the path", () => {
  assert.equal(PATH_WORD, "store-slug-collide");
  const result = analyze(seedStoreSlugCollide());
  assert.equal(result.verdict, "store-slug-collide");
  assert.equal(result.pathWord, "store-slug-collide");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "store-slug-collide", preferSeed: true, crased: true }),
    "store-slug-collide",
  );
  assert.equal(classify(seedNonAsciiCollapse()), "non-ascii-collapse");
});

test("HOLD includes injective / hold", () => {
  assert.ok(HOLD.includes("injective"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: memory-leak, separator-ambiguity, crasis", () => {
  assert.equal(classify(seedMemoryLeak()), "memory-leak");
  assert.equal(classify(seedSeparatorAmbiguity()), "separator-ambiguity");
  assert.equal(classify(seedCrasis()), "crasis");
});

test("booth fixtures flip injective vs crased vs store-slug-collide vs crasis", () => {
  const idle = scoreGate(seedInjective());
  const seeded = scoreGate(seedCrased());
  const injective = readData("injective.json");
  const crased = readData("crased.json");
  const path = readData("store-slug-collide.json");
  const product = readData("crasis.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "injective");
  assert.equal(seeded.verdict, "crasis");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedInjective()), "injective");
  assert.equal(score(seedCrased()), "crasis");
  assert.equal(injective.storeSlugCollide, false);
  assert.equal(injective.injective, true);
  assert.equal(scoreGate(injective).verdict, "injective");
  assert.equal(crased.storeSlugCollide, true);
  assert.equal(crased.nonAsciiCollapse, true);
  assert.equal(crased.separatorAmbiguity, true);
  assert.equal(classify(crased), "crased");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /one path|one store|injective|MEMORY/i);
  assert.match(path.paths[1].result, /가나다|라마바|clash----|ALPHA-777/i);
  assert.equal(classify(path), "store-slug-collide");
  assert.equal(classify(product), "crasis");
  assert.equal(product.hubCount, "CRASIS");
  assert.equal(crased.issue, 93960);
  assert.equal(crased.crased, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("non-ascii-collapse.json")), "non-ascii-collapse");
  assert.equal(classify(readData("separator-ambiguity.json")), "separator-ambiguity");
  assert.equal(classify(readData("control-length.json")), "control-length");
  assert.equal(classify(readData("memory-leak.json")), "memory-leak");
  assert.equal(classify(readData("transcript-pool.json")), "transcript-pool");
  assert.equal(classify(readData("auto-memory-workaround.json")), "auto-memory-workaround");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("injective"));
  assert.ok(CHIPS.includes("crased"));
  assert.ok(CHIPS.includes("crasis"));
  assert.ok(CHIPS.includes("store-slug-collide"));
  assert.ok(CHIPS.includes("non-ascii-collapse"));
  assert.ok(CHIPS.includes("memory-leak"));
  assert.ok(CHIPS.includes("distinct"));
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("crased"));
  assert.ok(ALARM.includes("store-slug-collide"));
  assert.ok(ALARM.includes("memory-leak"));
  assert.ok(ALARM.includes("crasis"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published crasis walk scores crasis after the idle hold", () => {
  const booth = scoreWalk({ rows: CRASIS_WALK });
  assert.equal(booth.verdict, "crasis");
  assert.ok(booth.crasedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-injective");
  assert.equal(idle.injective, true);
  assert.equal(idle.verdict, "injective");
  const cut = booth.rows.find((row) => row.event === "store-slug-collide");
  assert.equal(cut.storeSlugCollide, true);
  const path = booth.rows.find((row) => row.event === "store-slug-collide" && row.t === "path");
  assert.equal(path.verdict, "store-slug-collide");
});

test("CRASIS_WALK constant matches the issue drawer walk", () => {
  assert.equal(CRASIS_WALK[0].event, "cue-injective");
  const cut = CRASIS_WALK.find((row) => row.event === "store-slug-collide");
  assert.equal(cut.storeSlugCollide, true);
  const path = CRASIS_WALK.find((row) => row.t === "path");
  assert.equal(path.crased, true);
  const scoreRow = CRASIS_WALK.find((row) => row.event === "crasis");
  assert.equal(scoreRow.crased, true);
});

test("positive control injective drawers stay injective", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "injective");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "injective");
  const hold = walk.rows.find((row) => row.event === "cue-injective");
  assert.equal(hold.injective, true);
  assert.equal(hold.verdict, "injective");
});

test("encodeStoreSlug models the published non-injective mapping", () => {
  assert.equal(encodeStoreSlug(SAMPLE_PATH_A), SAMPLE_SLUG_LEN3);
  assert.equal(encodeStoreSlug(SAMPLE_PATH_B), SAMPLE_SLUG_LEN3);
  assert.equal(encodeStoreSlug(SAMPLE_PATH_CONTROL), SAMPLE_SLUG_LEN4);
  assert.ok(slugsCollide(SAMPLE_PATH_A, SAMPLE_PATH_B));
  assert.ok(!slugsCollide(SAMPLE_PATH_A, SAMPLE_PATH_CONTROL));
  assert.equal(encodeStoreSlug(SAMPLE_PATH_HYPHEN), SAMPLE_SLUG_SEP);
  assert.equal(encodeStoreSlug(SAMPLE_PATH_SLASH), SAMPLE_SLUG_SEP);
  assert.ok(slugsCollide(SAMPLE_PATH_HYPHEN, SAMPLE_PATH_SLASH));
  assert.equal(encodeStoreSlug("a-b"), encodeStoreSlug("a\\b"));
  assert.equal(encodeStoreSlug("ab-cd"), encodeStoreSlug("ab/cd"));
  assert.equal(encodeStoreSlug(KOREAN_A).length, encodeStoreSlug(KOREAN_B).length);
  assert.notEqual(encodeStoreSlug(KOREAN_A).length, encodeStoreSlug(KOREAN_CONTROL).length);
  assert.match(ENCODING_RULE, /non-alphanumeric|single -/i);
});

test("issue constants encode only #93960 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93960);
  assert.ok(ISSUE_URL.includes("93960"));
  assert.match(TITLE, /injective|store slug|memory|transcript|#29471/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /Windows 11|10\.0\.26200/);
  assert.match(CHECKED_ON, /2\.1\.238|Windows 11/);
  assert.equal(CLAUDE_VERSION, "2.1.238");
  assert.match(GOOD_VERSION, /one path|one store|injective/i);
  assert.equal(SURFACE, "store-slug");
  assert.equal(STORE_ROOT, "~/.claude/projects/");
  assert.equal(KOREAN_A, "가나다");
  assert.equal(KOREAN_B, "라마바");
  assert.equal(KOREAN_CONTROL, "가나다라");
  assert.equal(SEP_HYPHEN, "ab-cd");
  assert.equal(SEP_SLASH, "ab/cd");
  assert.equal(SCAN_STORES, 1085);
  assert.equal(SIX_CLIENT_COUNT, 6);
  assert.equal(SIX_CLIENT_STORE, "D--Project-Life-Dev-------------");
  assert.equal(SECRET_CODE, "ALPHA-777");
  assert.match(MEMORY_SNIPPET, /ALPHA-777|가나다/);
  assert.equal(WORKAROUND, "autoMemoryDirectory");
  assert.match(WORKAROUND_LIMIT, /memory only|transcripts still pool/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:core",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /MEMORY\.md|session/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#29471|COMPLETED/i.test(row)));
  assert.ok(EXPECTED.some((row) => /unique per real path|hash|path\.json/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.238|가나다|라마바|#29471|#93743|1,085|autoMemoryDirectory/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("store-slug-collide"));
  assert.ok(FINGERPRINT_LINES.includes("crased"));
  assert.equal(PHRASE, "Score crasis or admit injective.");
  assert.equal(SAMPLE_CRASED_PROOF.storeSlugCollide, true);
});

test("has-repro fingerprints encode the published crased proof", () => {
  const result = handle(seedCrased());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "store-slug");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedCrased()),
    /crasis\|collapse=len3\|sep=fused\|memory=leaked\|path=store-slug-collide\|cue=store-slug-collide/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Tessera, Mojibake, Scissel", () => {
  const required = [
    "unitary",
    "tessellated",
    "tessera",
    "version-path-tcc",
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "simulacrum",
    "solenoid",
    "scotia",
    "canard",
    "stet",
    "blindside",
    "schism",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("injective booth flips crased back when drawers stay sealed", () => {
  const tape = {
    injective: true,
    crased: false,
    storeSlugCollide: false,
    cue: "injective",
  };
  assert.equal(scoreGate(tape).verdict, "injective");
  tape.injective = false;
  tape.crased = true;
  tape.storeSlugCollide = true;
  tape.nonAsciiCollapse = true;
  tape.cue = "crased";
  assert.equal(scoreGate(tape).verdict, "crasis");
  tape.injective = true;
  tape.crased = false;
  tape.storeSlugCollide = false;
  tape.nonAsciiCollapse = false;
  tape.cue = "injective";
  assert.equal(scoreGate(tape).verdict, "injective");
});

test("slug, collapse, memory, and readBooth mark the crased proof", () => {
  const idle = inspectSlug({
    injective: true,
    paths: { a: SAMPLE_PATH_A, b: `${SAMPLE_PATH_A}-other` },
  });
  assert.equal(idle.stamp, "one-path-one-store");
  const collapse = inspectCollapse({ crased: true, nonAsciiCollapse: true });
  assert.equal(collapse.stamp, "non-ascii-collapse");
  assert.equal(collapse.collide, true);
  const memory = inspectMemory({ crased: true, memoryLeak: true });
  assert.equal(memory.stamp, "memory-leak");
  assert.equal(memory.leaked, true);
  const booth = readBooth({
    crased: true,
    storeSlugCollide: true,
    paths: { a: SAMPLE_PATH_A, b: SAMPLE_PATH_B },
  });
  assert.equal(booth.crased, true);
  assert.equal(booth.mark, "crased");
  const open = readBooth({
    injective: true,
    crased: false,
    storeSlugCollide: false,
  });
  assert.equal(open.crased, false);
  assert.equal(open.mark, "injective");
});

test("mapLigature encodes the published fused-drawer collapse", () => {
  const miss = mapLigature({ crased: true, storeSlugCollide: true });
  assert.equal(miss.stamp, "store-slug-collide");
  assert.equal(miss.folioLane, "fused");
  assert.equal(miss.seal, "crased");
  const clear = mapLigature({ injective: true, crased: false });
  assert.equal(clear.stamp, "injective-drawers");
  assert.equal(clear.folioLane, "sealed");
  assert.equal(clear.drawerLane, "two-drawers");
});

test("inspectSeparator encodes the #29471 hyphen-vs-slash fuse", () => {
  const sep = inspectSeparator({ crased: true, separatorAmbiguity: true });
  assert.equal(sep.stamp, "separator-ambiguity");
  assert.equal(sep.collide, true);
  assert.equal(sep.slug, "ab-cd");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 29471);
  assert.equal(COUSINS[1].issue, 93743);
  assert.equal(COUSINS[2].issue, 7009);
  assert.equal(COUSINS[3].issue, 21085);
  assert.equal(COUSINS[4].issue, 35162);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93960));
  assert.ok(!BACKUPS.some((row) => row.issue === 29471));
  assert.ok(!BACKUPS.some((row) => row.issue === 93743));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/crased.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const injectiveFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/injective.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(injectiveFix.status, 0, injectiveFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const injectiveOut = JSON.parse(injectiveFix.stdout);
  assert.equal(idleOut.verdict, "injective");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "crased");
  assert.equal(seededOut.alarm, true);
  assert.equal(injectiveOut.verdict, "injective");
  assert.equal(injectiveOut.hold, true);
});

test("handle exposes published hypothesis and #93960 headline", () => {
  const result = handle(seedCrased());
  assert.equal(result.published.issue, 93960);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [29471, 93743, 7009, 21085, 35162]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93924));
  assert.ok(!result.published.backups.includes(93960));
  assert.match(result.published.hypothesis, /non-injective|가나다|NON-BINDING|#93960/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93960/);
  assert.equal(result.published.koreanA, "가나다");
  assert.equal(result.published.secretCode, "ALPHA-777");
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a manuscript crasis / fused-ligature booth, not tessera or mojibake or scissel", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /crasis|injective|crased|store-slug-collide|ligature|manuscript/i);
  assert.match(page, /#1A1520|#F4ECDF|#B83A2E|#2F6F5E/i);
  assert.match(page, /\binjective\b/);
  assert.match(page, /\bcrased\b/);
  assert.match(page, /store-slug-collide/);
  assert.match(page, /Score crasis or admit injective/i);
  assert.match(page, /#29471|#93743|#7009|#21085|#35162|cousin/i);
  assert.match(page, /#332/);
  assert.match(page, /#93960/);
  assert.match(page, /Admit injective/);
  assert.match(page, /Score crasis/);
  assert.match(page, /Walk store-slug-collide/);
  assert.match(page, /Compare injective \/ crased/);
  assert.match(page, /Pin idle injective/);
  assert.match(page, /Pin seeded crased/);
  assert.match(page, /Pin store-slug-collide/);
  assert.match(page, /Fuse the ligature/);
  assert.match(page, /2\.1\.238|Windows 11|가나다|라마바|ALPHA-777|autoMemoryDirectory/i);
  assert.match(page, /crasis|ligature|vellum|drawer|folio/i);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /DM Mono|DM\+Mono/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /#E8E2D6/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#F7F3EA/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#C41E6A/);
  assert.doesNotMatch(page, /#C9892E/);
  assert.doesNotMatch(page, /#1F6F6A/);
  assert.doesNotMatch(page, /#121417/);
  assert.doesNotMatch(page, /#C8CED6/);
  assert.doesNotMatch(page, /#B87333/);
  assert.doesNotMatch(page, /#2C2118/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7A1F1F/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#3F5D4A/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /compositor|foul-proof|geta-tofu|type case|rice-paper/i);
  assert.doesNotMatch(page, /privacy pane|limestone|mica grout|tesserae/i);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
  assert.doesNotMatch(page, /\bverbatim\b/);
  assert.doesNotMatch(page, /\bmojibaked\b/);
  assert.doesNotMatch(page, /fffd-spall/);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd/);
  assert.doesNotMatch(page, /\bvested\b/);
  assert.doesNotMatch(page, /\bunseised\b/);
  assert.doesNotMatch(page, /preview-eperm/);
  assert.doesNotMatch(page, /\bunitary\b/);
  assert.doesNotMatch(page, /\btessellated\b/);
  assert.doesNotMatch(page, /version-path-tcc/);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Homograph/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Crasis/);
  assert.match(readme, /#93960/);
  assert.match(readme, /\binjective\b/);
  assert.match(readme, /\bcrased\b/);
  assert.match(readme, /store-slug-collide/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /2\.1\.238|Windows 11|가나다|라마바|ALPHA-777|autoMemoryDirectory/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/crasis/);
  assert.match(readme, /node --test projects\/crasis\/crasis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /crasis|ligature|manuscript|drawer/i);
  assert.match(readme, /Score crasis or admit injective/);
  assert.match(readme, /#29471|#93743|#7009|#21085|#35162/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93889|#93821|#93811|#93809|#93823|#93924|#93925/);
  assert.match(readme, /16:50/);
});

test("catalog features Crasis only; Tessera unfeatured; product count 332", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 332);
  assert.equal(hub.products.length, 332);
  assert.equal(catalog.products[0].name, "Crasis");
  assert.equal(catalog.products[0].slug, "crasis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/crasis/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /16:50 crasis|#93960|store-slug|MEMORY|injective|crased/i);
  assert.match(catalog.products[0].summary, /\binjective\b/);
  assert.match(catalog.products[0].summary, /\bcrased\b/);
  assert.match(catalog.products[0].summary, /store-slug-collide/);
  assert.match(catalog.products[0].summary, /Score crasis or admit injective/);
  assert.equal(hub.products[0].slug, "crasis");
  assert.equal(hub.products[0].featured, true);
  const tessera = catalog.products.find((row) => row.slug === "tessera");
  assert.ok(tessera);
  assert.equal(tessera.featured, false);
  const mojibake = catalog.products.find((row) => row.slug === "mojibake");
  assert.ok(mojibake);
  assert.equal(mojibake.featured, false);
  const scissel = catalog.products.find((row) => row.slug === "scissel");
  assert.ok(scissel);
  assert.equal(scissel.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "crasis").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93960") && row.slug !== "crasis"));
});

test("vercel rewrites crasis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/crasis");
  assert.equal(vercel.rewrites[0].destination, "/projects/crasis");
  assert.equal(vercel.rewrites[1].source, "/crasis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/crasis");
  assert.equal(vercel.rewrites[2].source, "/crasis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/crasis/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
