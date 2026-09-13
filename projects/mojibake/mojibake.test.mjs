import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BLOCK_CHARS,
  BOOTH_STATIONS,
  CACHE_WITH_CORRUPT,
  CACHE_WITH_WORKAROUND,
  CHAR_INDEX,
  CHIPS,
  CLAUDE_MD_PATH,
  CLAUDE_VERSION,
  CLEAN_OF_17,
  CLEAN_SID,
  CLEAN_SNIPPET,
  CORRUPT_OF_17,
  CORRUPT_SID,
  CORRUPT_SNIPPET,
  COUSINS,
  DIFFLIB_OPCODE,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FILE_BYTES,
  FILE_DECODE_OK,
  FILE_ENCODING,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HANGUL,
  HANGUL_UTF8,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MOJIBAKE_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  POWERSHELL,
  PRODUCT_WORD,
  REPLACEMENT,
  RULED_OUT,
  SAMPLE_CACHE,
  SAMPLE_CORRUPT,
  SAMPLE_MOJIBAKED_PROOF,
  SAMPLE_SPALL,
  SEEDED_WORD,
  SESSION_COUNT,
  STATE,
  SURFACE,
  TITLE,
  UTF8_OFFSET_BLOCK,
  UTF8_OFFSET_FILE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCache,
  inspectHangul,
  inspectSpall,
  mapChase,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCacheMiss,
  seedCorruptedVariant,
  seedFffdSpall,
  seedHold,
  seedMojibake,
  seedMojibaked,
  seedVerbatim,
} from "./mojibake.mjs";

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
  return fileURLToPath(new URL("./mojibake.mjs", import.meta.url));
}

test("idle verbatim is a hold; CLAUDE.md UTF-8 reaches the API intact", () => {
  const result = analyze(seedVerbatim());
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.idleWord, "verbatim");
  assert.equal(IDLE_WORD, "verbatim");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.verbatim, true);
  assert.equal(result.phrase, "admit verbatim");
  assert.equal(result.mojibaked, false);
  assert.equal(result.fffdSpall, false);
  assert.ok(HOLD_ALIASES.includes("verbatim"));
  assert.ok(HOLD_ALIASES.includes("intact-utf8"));
  assert.ok(HOLD_ALIASES.includes("cache-hit"));
  assert.ok(HOLD_ALIASES.includes("prefix-stable"));
  assert.ok(HOLD_ALIASES.includes("hangul-kept"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify verbatim", () => {
  assert.equal(classify(emptyTicket()), "verbatim");
  assert.equal(classify(""), "verbatim");
  assert.equal(classify(null), "verbatim");
  assert.equal(decide({}), "verbatim");
});

test("#93848 seeded path scores mojibake when the chase is mojibaked", () => {
  const result = analyze(seedMojibaked());
  assert.equal(result.verdict, "mojibake");
  assert.equal(result.seededWord, "mojibaked");
  assert.equal(SEEDED_WORD, "mojibaked");
  assert.equal(PRODUCT_WORD, "mojibake");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mojibaked, true);
  assert.equal(result.phrase, "score mojibake");
  assert.equal(result.fffdSpall, true);
  assert.equal(result.cacheMiss, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fffd-spall plus cache miss is the #93848 mojibake", () => {
  const cut = inspectSpall({ mojibaked: true, fffdSpall: true });
  assert.equal(cut.stamp, "fffd-spall");
  assert.equal(cut.replacements, 3);
  const scored = scoreGate({
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    corruptedVariant: true,
    cue: "mojibaked",
    spall: SAMPLE_SPALL,
    hangul: { kept: false },
  });
  assert.equal(scored.verdict, "mojibake");
  assert.equal(scored.fffdSpall, true);
  const open = inspectSpall({ verbatim: true, fffdSpall: false });
  assert.equal(open.stamp, "hangul-kept");
});

test("path word is fffd-spall; tofu path seed holds the path", () => {
  assert.equal(PATH_WORD, "fffd-spall");
  const result = analyze(seedFffdSpall());
  assert.equal(result.verdict, "fffd-spall");
  assert.equal(result.pathWord, "fffd-spall");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "fffd-spall", preferSeed: true, mojibaked: true }),
    "fffd-spall",
  );
  assert.equal(classify(seedCacheMiss()), "cache-miss");
});

test("HOLD includes verbatim / hold", () => {
  assert.ok(HOLD.includes("verbatim"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: cache-miss, corrupted-variant, mojibake", () => {
  assert.equal(classify(seedCacheMiss()), "cache-miss");
  assert.equal(classify(seedCorruptedVariant()), "corrupted-variant");
  assert.equal(classify(seedMojibake()), "mojibake");
});

test("booth fixtures flip verbatim vs mojibaked vs fffd-spall vs mojibake", () => {
  const idle = scoreGate(seedVerbatim());
  const seeded = scoreGate(seedMojibaked());
  const verbatim = readData("verbatim.json");
  const mojibaked = readData("mojibaked.json");
  const path = readData("fffd-spall.json");
  const product = readData("mojibake.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "verbatim");
  assert.equal(seeded.verdict, "mojibake");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedVerbatim()), "verbatim");
  assert.equal(score(seedMojibaked()), "mojibake");
  assert.equal(verbatim.fffdSpall, false);
  assert.equal(verbatim.verbatim, true);
  assert.equal(scoreGate(verbatim).verdict, "verbatim");
  assert.equal(mojibaked.fffdSpall, true);
  assert.equal(mojibaked.cacheMiss, true);
  assert.equal(mojibaked.corruptedVariant, true);
  assert.equal(classify(mojibaked), "mojibaked");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /CLAUDE\.md|UTF-8|불|FFFD|prefix/i);
  assert.match(path.paths[1].result, /3615|7982|7665|FFFD|cache/i);
  assert.equal(classify(path), "fffd-spall");
  assert.equal(classify(product), "mojibake");
  assert.equal(product.hubCount, "MOJIBAKE");
  assert.equal(mojibaked.issue, 93848);
  assert.equal(mojibaked.mojibaked, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("clean-variant.json")), "clean-variant");
  assert.equal(classify(readData("corrupted-variant.json")), "corrupted-variant");
  assert.equal(classify(readData("cache-miss.json")), "cache-miss");
  assert.equal(classify(readData("hangul-불.json")), "hangul-불");
  assert.equal(classify(readData("intact-utf8.json")), "intact-utf8");
  assert.equal(classify(readData("cache-hit.json")), "cache-hit");
  assert.equal(classify(readData("prefix-stable.json")), "prefix-stable");
  assert.equal(classify(readData("hangul-kept.json")), "hangul-kept");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("verbatim"));
  assert.ok(CHIPS.includes("mojibaked"));
  assert.ok(CHIPS.includes("mojibake"));
  assert.ok(CHIPS.includes("fffd-spall"));
  assert.ok(CHIPS.includes("cache-miss"));
  assert.ok(CHIPS.includes("hangul-불"));
  assert.ok(CHIPS.includes("intact-utf8"));
  assert.ok(CHIPS.includes("cache-hit"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("mojibaked"));
  assert.ok(ALARM.includes("fffd-spall"));
  assert.ok(ALARM.includes("cache-miss"));
  assert.ok(ALARM.includes("mojibake"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published mojibake walk scores mojibake after the idle hold", () => {
  const booth = scoreWalk({ rows: MOJIBAKE_WALK });
  assert.equal(booth.verdict, "mojibake");
  assert.ok(booth.mojibakedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-verbatim");
  assert.equal(idle.verbatim, true);
  assert.equal(idle.verdict, "verbatim");
  const cut = booth.rows.find((row) => row.event === "fffd-spall");
  assert.equal(cut.fffdSpall, true);
  const path = booth.rows.find((row) => row.event === "fffd-spall" && row.t === "path");
  assert.equal(path.verdict, "fffd-spall");
});

test("MOJIBAKE_WALK constant matches the issue chase walk", () => {
  assert.equal(MOJIBAKE_WALK[0].event, "cue-verbatim");
  const cut = MOJIBAKE_WALK.find((row) => row.event === "fffd-spall");
  assert.equal(cut.fffdSpall, true);
  const path = MOJIBAKE_WALK.find((row) => row.t === "path");
  assert.equal(path.mojibaked, true);
  const scoreRow = MOJIBAKE_WALK.find((row) => row.event === "mojibake");
  assert.equal(scoreRow.mojibaked, true);
});

test("positive control verbatim chase stays verbatim", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "verbatim");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "verbatim");
  const hold = walk.rows.find((row) => row.event === "cue-verbatim");
  assert.equal(hold.verbatim, true);
  assert.equal(hold.verdict, "verbatim");
});

test("issue constants encode only #93848 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93848);
  assert.ok(ISSUE_URL.includes("93848"));
  assert.match(TITLE, /CLAUDE\.md|U\+FFFD|prompt|Windows|2\.1\.258/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /Windows 11 22H2|10\.0\.22621/);
  assert.equal(POWERSHELL, "PowerShell 7");
  assert.equal(CLAUDE_VERSION, "2.1.258");
  assert.match(GOOD_VERSION, /UTF-8|prefix|intact/i);
  assert.equal(SURFACE, "embedded-claude-md");
  assert.equal(CLAUDE_MD_PATH, "%USERPROFILE%\\.claude\\CLAUDE.md");
  assert.equal(FILE_BYTES, 19597);
  assert.equal(FILE_ENCODING, "UTF-8 without BOM");
  assert.match(FILE_DECODE_OK, /utf-8/);
  assert.equal(CHAR_INDEX, 3615);
  assert.equal(BLOCK_CHARS, 19136);
  assert.equal(UTF8_OFFSET_BLOCK, 7982);
  assert.equal(UTF8_OFFSET_FILE, 7665);
  assert.equal(HANGUL, "불");
  assert.equal(HANGUL_UTF8, "EB B6 88");
  assert.equal(REPLACEMENT, "U+FFFD × 3");
  assert.equal(CLEAN_SNIPPET, "바람이 불어 창문이 흔들리는 탓에 …");
  assert.equal(CORRUPT_SNIPPET, "바람이 ���어 창문이 흔들리는 탓에 …");
  assert.equal(DIFFLIB_OPCODE, "('replace', 3615, 3616, 3615, 3618)");
  assert.equal(CLEAN_SID, "600ce64a");
  assert.equal(CORRUPT_SID, "8fdae59a");
  assert.equal(CLEAN_OF_17, 14);
  assert.equal(CORRUPT_OF_17, 3);
  assert.equal(SESSION_COUNT, 4);
  assert.equal(CACHE_WITH_CORRUPT, "75-76%");
  assert.equal(CACHE_WITH_WORKAROUND, "91.6%");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:core",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /4 KiB|8 KiB|16 KiB|boundary/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /not modified|decode/i.test(row)));
  assert.ok(EXPECTED.some((row) => /UTF-8|prefix|identical/i.test(row)));
  assert.match(DISTRIBUTION, /3615|7982|7665|불|FFFD|#40396|#88836|2\.1\.258/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("fffd-spall"));
  assert.ok(FINGERPRINT_LINES.includes("mojibaked"));
  assert.equal(PHRASE, "Score mojibake or admit verbatim.");
  assert.equal(SAMPLE_MOJIBAKED_PROOF.fffdSpall, true);
  assert.equal(SAMPLE_SPALL.charIndex, 3615);
  assert.equal(SAMPLE_CORRUPT.sid, "8fdae59a");
});

test("has-repro fingerprints encode the published mojibaked proof", () => {
  const result = handle(seedMojibaked());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "embedded-claude-md");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedMojibaked()),
    /mojibake\|hangul=fffd\|cache=miss\|path=fffd-spall\|cue=fffd-spall/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Scissel, Feoffee, Apograph, Airlock", () => {
  const required = [
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
    "calibrated",
    "aneroided",
    "wrong-window-ring",
    "simulacrum",
    "tethered",
    "hollow",
    "phantom-navigate",
    "solenoid",
    "engaged",
    "inert",
    "warm-before-message",
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "gleaned",
    "orphaned",
    "inherited",
    "gleaner",
    "live",
    "schismed",
    "schism",
    "swept",
    "ashpanned",
    "ashpan",
    "seised",
    "disseised",
    "disseisin",
    "intact",
    "rasure",
    "keyed",
    "voiced",
    "muted",
    "sourdine",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
    "scapegoat",
    "galley",
    "stop-dirty",
    "primed",
    "warm",
    "armed",
    "coil-pulled",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("verbatim booth flips mojibaked back when the chase keeps Hangul", () => {
  const tape = {
    verbatim: true,
    mojibaked: false,
    fffdSpall: false,
    cue: "verbatim",
  };
  assert.equal(scoreGate(tape).verdict, "verbatim");
  tape.verbatim = false;
  tape.mojibaked = true;
  tape.fffdSpall = true;
  tape.cacheMiss = true;
  tape.cue = "mojibaked";
  assert.equal(scoreGate(tape).verdict, "mojibake");
  tape.verbatim = true;
  tape.mojibaked = false;
  tape.fffdSpall = false;
  tape.cacheMiss = false;
  tape.cue = "verbatim";
  assert.equal(scoreGate(tape).verdict, "verbatim");
});

test("spall, cache, hangul, and readBooth mark the mojibaked proof", () => {
  const idle = inspectSpall({
    verbatim: true,
    spall: { replacements: 0 },
  });
  assert.equal(idle.stamp, "hangul-kept");
  const cache = inspectCache({ mojibaked: true, cache: SAMPLE_CACHE });
  assert.equal(cache.stamp, "cache-miss");
  assert.equal(cache.sid, "8fdae59a");
  const hangul = inspectHangul({ verbatim: true, hangulKept: true });
  assert.equal(hangul.stamp, "hangul-불");
  const booth = readBooth({
    mojibaked: true,
    fffdSpall: true,
    spall: SAMPLE_SPALL,
  });
  assert.equal(booth.mojibaked, true);
  assert.equal(booth.mark, "mojibaked");
  const open = readBooth({
    verbatim: true,
    mojibaked: false,
    fffdSpall: false,
  });
  assert.equal(open.mojibaked, false);
  assert.equal(open.mark, "verbatim");
});

test("mapChase encodes the published tofu spall", () => {
  const miss = mapChase({ mojibaked: true, fffdSpall: true });
  assert.equal(miss.stamp, "fffd-spall");
  assert.equal(miss.sortLane, "tofu");
  assert.equal(miss.seal, "mojibaked");
  const clear = mapChase({ verbatim: true, mojibaked: false });
  assert.equal(clear.stamp, "verbatim-chase");
  assert.equal(clear.sortLane, "hangul-kept");
  assert.equal(clear.cacheLane, "hit");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 40396);
  assert.equal(COUSINS[1].issue, 88836);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
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
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("waif"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93889);
  assert.equal(BACKUPS[5].issue, 93821);
  assert.equal(BACKUPS[6].issue, 93811);
  assert.equal(BACKUPS[7].issue, 93809);
  assert.equal(BACKUPS[8].issue, 93823);
  assert.equal(BACKUPS[9].issue, 93929);
  assert.equal(BACKUPS[10].issue, 93924);
  assert.equal(BACKUPS[11].issue, 93925);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93848));
  assert.ok(!BACKUPS.some((row) => row.issue === 40396));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/mojibaked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const verbatimFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/verbatim.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(verbatimFix.status, 0, verbatimFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const verbatimOut = JSON.parse(verbatimFix.stdout);
  assert.equal(idleOut.verdict, "verbatim");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "mojibaked");
  assert.equal(seededOut.alarm, true);
  assert.equal(verbatimOut.verdict, "verbatim");
  assert.equal(verbatimOut.hold, true);
});

test("handle exposes published hypothesis and #93848 headline", () => {
  const result = handle(seedMojibaked());
  assert.equal(result.published.issue, 93848);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [40396, 88836]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93929));
  assert.ok(result.published.backups.includes(93925));
  assert.ok(!result.published.backups.includes(93848));
  assert.match(result.published.hypothesis, /encoding|wchar|U\+FFFD|불|NON-BINDING/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93848/);
  assert.equal(result.published.charIndex, 3615);
  assert.equal(result.published.hangul, "불");
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a compositor / foul-proof / geta-tofu booth, not scissel or feoffee", () => {
  const page = readPage();
  assert.match(page, /Syne/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /mojibake|verbatim|mojibaked|fffd-spall|compositor|foul-proof|geta|tofu/i);
  assert.match(page, /#F4EFE6|#1A1612|#C41E6A|#C9892E|#1F6F6A|#3D3832/i);
  assert.match(page, /\bverbatim\b/);
  assert.match(page, /\bmojibaked\b/);
  assert.match(page, /fffd-spall/);
  assert.match(page, /Score mojibake or admit verbatim/i);
  assert.match(page, /#40396|#88836|cousin/i);
  assert.match(page, /#330/);
  assert.match(page, /#93848/);
  assert.match(page, /Admit verbatim/);
  assert.match(page, /Score mojibake/);
  assert.match(page, /Walk fffd-spall/);
  assert.match(page, /Compare verbatim \/ mojibaked/);
  assert.match(page, /Pin idle verbatim/);
  assert.match(page, /Pin seeded mojibaked/);
  assert.match(page, /Pin fffd-spall/);
  assert.match(page, /Ink the forme/);
  assert.match(page, /3615|7982|7665|불|U\+FFFD|2\.1\.258/i);
  assert.match(page, /type case|chase|tofu|foul-proof|compositor/i);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
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
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
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
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Waif/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Snatch/i);
  assert.match(page, /NOT Disseisin/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Mojibake/);
  assert.match(readme, /#93848/);
  assert.match(readme, /\bverbatim\b/);
  assert.match(readme, /\bmojibaked\b/);
  assert.match(readme, /fffd-spall/);
  assert.match(readme, /Syne/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Waif/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Snatch/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /3615|7982|7665|불|U\+FFFD|2\.1\.258/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/mojibake/);
  assert.match(readme, /node --test projects\/mojibake\/mojibake\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /mojibake|compositor|foul-proof|geta-tofu/i);
  assert.match(readme, /Score mojibake or admit verbatim/);
  assert.match(readme, /#40396|#88836/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93889|#93821|#93811|#93809|#93823|#93929|#93924|#93925/);
  assert.match(readme, /12:50/);
});

test("catalog features Tessera; Mojibake, Scissel, Feoffee, Apograph unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 331);
  assert.equal(hub.products.length, 331);
  assert.equal(catalog.products[0].name, "Tessera");
  assert.equal(catalog.products[0].slug, "tessera");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/tessera/");
  const mojibake = catalog.products.find((row) => row.slug === "mojibake");
  assert.ok(mojibake);
  assert.equal(mojibake.featured, false);
  assert.equal(mojibake.href, "/mojibake/");
  assert.equal(mojibake.day, "2026-09-13");
  assert.match(mojibake.summary, /12:50 mojibake|#93848|compositor|foul-proof|geta-tofu/i);
  assert.match(mojibake.summary, /\bverbatim\b/);
  assert.match(mojibake.summary, /\bmojibaked\b/);
  assert.match(mojibake.summary, /fffd-spall/);
  assert.match(mojibake.summary, /Score mojibake or admit verbatim/);
  assert.equal(hub.products[0].slug, "tessera");
  assert.equal(hub.products[0].featured, true);
  const scissel = catalog.products.find((row) => row.slug === "scissel");
  assert.ok(scissel);
  assert.equal(scissel.featured, false);
  const feoffee = catalog.products.find((row) => row.slug === "feoffee");
  assert.ok(feoffee);
  assert.equal(feoffee.featured, false);
  const apograph = catalog.products.find((row) => row.slug === "apograph");
  assert.ok(apograph);
  assert.equal(apograph.featured, false);
  const airlock = catalog.products.find((row) => row.slug === "airlock");
  assert.ok(airlock);
  assert.equal(airlock.featured, false);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "mojibake").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93848") && row.slug !== "mojibake"));
});

test("vercel rewrites mojibake after tessera at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/tessera");
  assert.equal(vercel.rewrites[3].source, "/mojibake");
  assert.equal(vercel.rewrites[3].destination, "/projects/mojibake");
  assert.equal(vercel.rewrites[4].source, "/mojibake/");
  assert.equal(vercel.rewrites[4].destination, "/projects/mojibake");
  assert.equal(vercel.rewrites[5].source, "/mojibake/:path*");
  assert.equal(vercel.rewrites[5].destination, "/projects/mojibake/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
