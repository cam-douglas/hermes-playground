import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  COLLIDED_SLUG,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOMOGRAPH_PLAQUES,
  HOMOGRAPH_WALK,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEMMA_A,
  LEMMA_B,
  LEMMA_A_KIND,
  LEMMA_B_KIND,
  NOT_PRODUCTS,
  OS_LABEL,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_LEMMA,
  SAMPLE_MEMORY,
  SAMPLE_ORPHAN,
  SAMPLE_SHELF,
  SAMPLE_VOLUME,
  SEEDED_WORD,
  SESSION_KIND,
  SHELL_LABEL,
  STATE,
  STORE_ROOT,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectLemma,
  inspectMemory,
  inspectOrphan,
  inspectShelf,
  inspectVolume,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAsciiPrefix,
  seedCollided,
  seedDashCollapse,
  seedDistinct,
  seedHashedPath,
  seedHold,
  seedHomograph,
  seedLemmaA,
  seedLemmaB,
  seedLossySlug,
  seedMemoryLeak,
  seedOrphanStore,
  seedPercentEncode,
  seedShelfMerge,
  seedSilentRevive,
} from "./homograph.mjs";

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
  return fileURLToPath(new URL("./homograph.mjs", import.meta.url));
}

test("idle distinct is a hold; paths keep separate memory", () => {
  const result = analyze(seedDistinct());
  assert.equal(result.verdict, "distinct");
  assert.equal(result.idleWord, "distinct");
  assert.equal(IDLE_WORD, "distinct");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.distinct, true);
  assert.equal(result.phrase, "admit distinct");
  assert.equal(result.collided, false);
  assert.equal(result.lossySlug, false);
  assert.equal(result.hashedPath, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify distinct", () => {
  assert.equal(classify(emptyTicket()), "distinct");
  assert.equal(classify(""), "distinct");
  assert.equal(classify(null), "distinct");
  assert.equal(decide({}), "distinct");
});

test("#93743 seeded path scores homograph when the lemmas collide", () => {
  const result = analyze(seedCollided());
  assert.equal(result.verdict, "homograph");
  assert.equal(result.seededWord, "collided");
  assert.equal(SEEDED_WORD, "collided");
  assert.equal(PRODUCT_WORD, "homograph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.collided, true);
  assert.equal(result.phrase, "score homograph");
  assert.equal(result.dashCollapse, true);
  assert.equal(result.orphanStore, true);
  assert.equal(result.memoryLeak, true);
  assert.equal(result.lossySlug, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("dash-collapse plus orphan store is the #93743 homograph", () => {
  const shelf = inspectShelf({ collided: true, lossySlug: true });
  assert.equal(shelf.stamp, "shelf-collapsed");
  assert.equal(shelf.collapsed, true);
  const scored = scoreGate({
    collided: true,
    dashCollapse: true,
    orphanStore: true,
    lemmaB: true,
    lossySlug: true,
    shelfMerge: true,
    memoryLeak: true,
    silentRevive: true,
    cue: "collided",
    lemma: SAMPLE_LEMMA,
    shelf: SAMPLE_SHELF,
  });
  assert.equal(scored.verdict, "homograph");
  assert.equal(scored.lossySlug, true);
  const open = inspectShelf({ distinct: true, hashedPath: true });
  assert.equal(open.stamp, "shelf-distinct");
});

test("path word is lossy-slug; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "lossy-slug");
  const result = analyze(seedLossySlug());
  assert.equal(result.verdict, "lossy-slug");
  assert.equal(result.pathWord, "lossy-slug");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "lossy-slug", preferSeed: true, collided: true }),
    "lossy-slug",
  );
  assert.equal(classify(seedDashCollapse()), "dash-collapse");
});

test("HOLD includes distinct / hold", () => {
  assert.ok(HOLD.includes("distinct"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: dash-collapse, orphan-store, memory-leak, silent-revive", () => {
  assert.equal(classify(seedDashCollapse()), "dash-collapse");
  assert.equal(classify(seedLemmaA()), "lemma-a");
  assert.equal(classify(seedLemmaB()), "lemma-b");
  assert.equal(classify(seedOrphanStore()), "orphan-store");
  assert.equal(classify(seedShelfMerge()), "shelf-merge");
  assert.equal(classify(seedMemoryLeak()), "memory-leak");
  assert.equal(classify(seedSilentRevive()), "silent-revive");
  assert.equal(classify(seedHashedPath()), "hashed-path");
  assert.equal(classify(seedPercentEncode()), "percent-encode");
  assert.equal(classify(seedAsciiPrefix()), "ascii-prefix");
  assert.equal(classify(seedHomograph()), "homograph");
});

test("booth fixtures flip distinct vs collided vs lossy-slug vs homograph", () => {
  const idle = scoreGate(seedDistinct());
  const seeded = scoreGate(seedCollided());
  const distinct = readData("distinct.json");
  const collided = readData("collided.json");
  const path = readData("lossy-slug.json");
  const product = readData("homograph.json");
  const collapse = readData("dash-collapse.json");
  const orphan = readData("orphan-store.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "distinct");
  assert.equal(seeded.verdict, "homograph");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDistinct()), "distinct");
  assert.equal(score(seedCollided()), "homograph");
  assert.equal(distinct.hashedPath, true);
  assert.equal(distinct.distinct, true);
  assert.equal(scoreGate(distinct).verdict, "distinct");
  assert.equal(collided.dashCollapse, true);
  assert.equal(collided.orphanStore, true);
  assert.equal(collided.memoryLeak, true);
  assert.equal(classify(collided), "collided");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /hash|percent-encode|unique/i);
  assert.match(path.paths[1].result, /C--Users|Downloads|dash/i);
  assert.equal(classify(path), "lossy-slug");
  assert.equal(classify(product), "homograph");
  assert.equal(product.hubCount, "HOMOGRAPH");
  assert.equal(collided.issue, 93743);
  assert.equal(collided.collided, true);
  assert.equal(classify(collapse), "dash-collapse");
  assert.equal(classify(orphan), "orphan-store");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("distinct"));
  assert.ok(CHIPS.includes("collided"));
  assert.ok(CHIPS.includes("homograph"));
  assert.ok(CHIPS.includes("lossy-slug"));
  assert.ok(CHIPS.includes("dash-collapse"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("collided"));
  assert.ok(ALARM.includes("lossy-slug"));
  assert.ok(ALARM.includes("dash-collapse"));
  assert.ok(ALARM.includes("homograph"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published homograph walk scores homograph after the idle hold", () => {
  const booth = scoreWalk({ rows: HOMOGRAPH_WALK });
  assert.equal(booth.verdict, "homograph");
  assert.ok(booth.collidedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-distinct");
  assert.equal(idle.distinct, true);
  assert.equal(idle.verdict, "distinct");
  const strip = booth.rows.find((row) => row.event === "dash-collapse");
  assert.equal(strip.dashCollapse, true);
  const path = booth.rows.find((row) => row.event === "lossy-slug" && row.t === "path");
  assert.equal(path.verdict, "lossy-slug");
});

test("HOMOGRAPH_WALK constant matches the issue headword walk", () => {
  assert.equal(HOMOGRAPH_WALK[0].event, "cue-distinct");
  const strip = HOMOGRAPH_WALK.find((row) => row.event === "dash-collapse");
  assert.equal(strip.dashCollapse, true);
  const path = HOMOGRAPH_WALK.find((row) => row.t === "path");
  assert.equal(path.collided, true);
  const scoreRow = HOMOGRAPH_WALK.find((row) => row.event === "homograph");
  assert.equal(scoreRow.collided, true);
});

test("positive control hashed-path stays distinct", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "distinct");
  const ok = walk.rows.find((row) => row.event === "hashed-path");
  assert.equal(ok.verdict, "distinct");
  const hold = walk.rows.find((row) => row.event === "cue-distinct");
  assert.equal(hold.distinct, true);
  assert.equal(hold.verdict, "distinct");
});

test("issue constants encode only #93743 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93743);
  assert.ok(ISSUE_URL.includes("93743"));
  assert.match(TITLE, /memory\/session/i);
  assert.match(TITLE, /non-ASCII/i);
  assert.match(TITLE, /slug/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(PLATFORM, "windows");
  assert.equal(LEMMA_A, "근평 웹만들기");
  assert.equal(LEMMA_B, "비계량지표평가");
  assert.match(LEMMA_A_KIND, /Supabase|HR/i);
  assert.match(LEMMA_B_KIND, /HWP|PDF/i);
  assert.equal(COLLIDED_SLUG, "C--Users-<user>-Downloads--------");
  assert.equal(STORE_ROOT, "~/.claude/projects/<slug>/");
  assert.match(OS_LABEL, /Windows 11/);
  assert.match(SHELL_LABEL, /Git Bash|PowerShell/);
  assert.match(SURFACE, /desktop|Code tab/);
  assert.equal(HOMOGRAPH_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /unrelated|HR|HWP|prefix|dash-count|orphan/i.test(row)));
  assert.ok(EXPECTED.some((row) => /hash|percent-encode|orphan/i.test(row)));
  assert.match(DISTRIBUTION, /근평|비계량|C--Users|Downloads--------/);
  assert.match(SESSION_KIND, /근평|비계량|C--Users/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("lossy-slug"));
  assert.ok(FINGERPRINT_LINES.includes("collided"));
  assert.match(PHRASE, /Score homograph or admit distinct/);
  assert.equal(SAMPLE_LEMMA.strippedSame, true);
  assert.equal(SAMPLE_SHELF.collapsed, true);
  assert.equal(SAMPLE_VOLUME.wrongVolume, true);
  assert.equal(SAMPLE_MEMORY.leaked, true);
  assert.equal(SAMPLE_ORPHAN.revived, true);
});

test("has-repro fingerprints encode the published collided homograph", () => {
  const result = handle(seedCollided());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.sessionKind, /근평|비계량/);
  assert.equal(result.published.collidedSlug, COLLIDED_SLUG);
  assert.match(
    fingerprint(seedCollided()),
    /homograph\|lemma=stripped\|shelf=collapsed\|orphan=revived\|memory=leaked\|path=lossy-slug\|cue=lossy-slug/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Galley and Rescript", () => {
  const required = [
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "intact",
    "scraped",
    "rescript",
    "snapshot-write",
    "fresh",
    "residual",
    "monadnock",
    "submodule-base",
    "plain",
    "ridden",
    "attachment-rider",
    "rider",
    "lit",
    "dark",
    "spawn-mcp-focus",
    "followspot",
    "due",
    "misfired",
    "catchup-dow",
    "calends",
    "flowing",
    "dammed",
    "egress-allowlist",
    "weir",
    "underway",
    "becalmed",
    "cron-websearch",
    "irons",
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
    "lodged",
    "kindled",
    "flushed",
    "solitary",
    "hit",
    "dropped",
    "painted",
    "lagged",
    "twinlinked",
    "flattened",
    "held",
    "steered",
    "greenroomed",
    "palimpsest",
    "oubliette",
    "ephemera",
    "homonym",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("distinct booth flips collided back when the shelves stay separate", () => {
  const tape = {
    distinct: true,
    collided: false,
    hashedPath: true,
    cue: "distinct",
  };
  assert.equal(scoreGate(tape).verdict, "distinct");
  tape.distinct = false;
  tape.collided = true;
  tape.dashCollapse = true;
  tape.orphanStore = true;
  tape.memoryLeak = true;
  tape.cue = "collided";
  assert.equal(scoreGate(tape).verdict, "homograph");
  tape.distinct = true;
  tape.collided = false;
  tape.dashCollapse = false;
  tape.orphanStore = false;
  tape.memoryLeak = false;
  tape.cue = "distinct";
  assert.equal(scoreGate(tape).verdict, "distinct");
});

test("lemma, shelf, volume, memory, orphan, and readBooth mark the collided homograph", () => {
  const idle = inspectLemma({
    distinct: true,
    hashedPath: true,
    lemma: { a: LEMMA_A, b: LEMMA_B, strippedSame: false },
  });
  assert.equal(idle.stamp, "headwords-distinct");
  const shelf = inspectShelf({ collided: true, shelf: SAMPLE_SHELF });
  assert.equal(shelf.stamp, "shelf-collapsed");
  assert.equal(shelf.collapsed, true);
  const volume = inspectVolume({
    wrongVolume: true,
    volume: SAMPLE_VOLUME,
  });
  assert.equal(volume.stamp, "wrong-volume");
  const memory = inspectMemory({ collided: true, memoryLeak: true });
  assert.equal(memory.stamp, "memory-leaked");
  const orphan = inspectOrphan({ collided: true, silentRevive: true });
  assert.equal(orphan.stamp, "orphan-revived");
  const booth = readBooth({
    collided: true,
    dashCollapse: true,
    orphanStore: true,
    lemma: SAMPLE_LEMMA,
    shelf: SAMPLE_SHELF,
  });
  assert.equal(booth.collided, true);
  assert.equal(booth.mark, "collided");
  const open = readBooth({
    distinct: true,
    collided: false,
    hashedPath: true,
  });
  assert.equal(open.collided, false);
  assert.equal(open.mark, "distinct");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 91735);
  assert.equal(COUSINS[1].issue, 70076);
  assert.equal(COUSINS[2].issue, 69752);
  assert.equal(COUSINS[3].issue, 89915);
  assert.equal(COUSINS[4].issue, 85595);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /91735|non-ASCII|rebuild/i);
  assert.match(COUSINS[1].why, /70076|non-alnum|dash/i);
  assert.match(COUSINS[2].why, /69752|orphan|move/i);
  assert.match(COUSINS[3].why, /89915|hash/i);
  assert.match(COUSINS[4].why, /85595|transcript|memory/i);
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("monadnock"));
  assert.ok(NOT_PRODUCTS.includes("rider"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("homonym"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 93757);
  assert.equal(BACKUPS[1].issue, 93746);
  assert.equal(BACKUPS[2].issue, 93744);
  assert.equal(BACKUPS[3].issue, 93722);
  assert.equal(BACKUPS[4].issue, 93672);
  assert.equal(BACKUPS[5].issue, 93652);
  assert.equal(BACKUPS[6].issue, 93680);
  assert.equal(BACKUPS[7].issue, 93618);
  assert.equal(BACKUPS[8].issue, 93694);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /reconnect|\/model/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/collided.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const distinctFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/distinct.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(distinctFix.status, 0, distinctFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "distinct");
  assert.equal(JSON.parse(seeded.stdout).verdict, "collided");
  assert.equal(JSON.parse(distinctFix.stdout).verdict, "distinct");
});

test("handle exposes published hypothesis and #93743 headline", () => {
  const result = handle(seedCollided());
  assert.equal(result.published.issue, 93743);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [91735, 70076, 69752, 89915, 85595]);
  assert.ok(result.published.backups.includes(93757));
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93672));
  assert.ok(!result.published.backups.includes(93745));
  assert.match(result.published.hypothesis, /hash|percent-encode|orphan/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93743/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a lexicographer homograph desk, not galley or rescript", () => {
  const page = readPage();
  assert.match(page, /EB Garamond|EB\+Garamond/);
  assert.match(page, /Nunito Sans|Nunito\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /homograph|headword|lemma|lexicographer|dictionary/i);
  assert.match(page, /#EFE6D2|#1A2748|#C94A32|#3F3F3D|#F8F3E6/i);
  assert.match(page, /\bdistinct\b/);
  assert.match(page, /\bcollided\b/);
  assert.match(page, /lossy-slug/);
  assert.match(page, /Score homograph or admit distinct/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#305/);
  assert.match(page, /#93743/);
  assert.match(page, /Keep shelves distinct/);
  assert.match(page, /Score homograph/);
  assert.match(page, /Walk the headwords/);
  assert.match(page, /Compare distinct \/ collided/);
  assert.match(page, /Pin idle distinct/);
  assert.match(page, /Pin seeded collided/);
  assert.match(page, /Pin lossy-slug/);
  assert.match(page, /Hold the distinct/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#DDD6C8/);
  assert.doesNotMatch(page, /#141210/);
  assert.doesNotMatch(page, /#C2301A/);
  assert.doesNotMatch(page, /#A67C3D/);
  assert.doesNotMatch(page, /#221F1B/);
  assert.doesNotMatch(page, /#3E4A42/);
  assert.doesNotMatch(page, /#F4EBD0/);
  assert.doesNotMatch(page, /#8B2E2E/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#9B2D2D/);
  assert.doesNotMatch(page, /#2B2F36/);
  assert.doesNotMatch(page, /composing stick|wet-proof|wet proof|unbound-signature|pull press|type-rail|galley-bed/i);
  assert.doesNotMatch(page, /chancery|wax-seal|wax seal|scrolled-rescript|lectern/i);
  assert.doesNotMatch(page, /trig survey|trig cairn|residual peak|nested massif|fetch sill/i);
  assert.doesNotMatch(page, /clerk desk|bill-rider|parliamentary|staple-pin/i);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /\bdry\b/);
  assert.doesNotMatch(page, /\bbilled\b/);
  assert.doesNotMatch(page, /stop-dirty/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\bscraped\b/);
  assert.doesNotMatch(page, /snapshot-write/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bresidual\b/);
  assert.doesNotMatch(page, /submodule-base/);
  assert.doesNotMatch(page, /\bplain\b/);
  assert.doesNotMatch(page, /\bridden\b/);
  assert.doesNotMatch(page, /attachment-rider/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bdark\b/);
  assert.doesNotMatch(page, /spawn-mcp-focus/);
  assert.doesNotMatch(page, /\bdue\b/);
  assert.doesNotMatch(page, /\bmisfired\b/);
  assert.doesNotMatch(page, /catchup-dow/);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /greenroomed/);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Rescript/i);
  assert.match(page, /NOT Monadnock/i);
  assert.match(page, /NOT Rider/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Palimpsest/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Homonym/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Homograph/);
  assert.match(readme, /#93743/);
  assert.match(readme, /\bdistinct\b/);
  assert.match(readme, /\bcollided\b/);
  assert.match(readme, /lossy-slug/);
  assert.match(readme, /EB Garamond/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Rescript/i);
  assert.match(readme, /NOT Monadnock/i);
  assert.match(readme, /NOT Rider/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Palimpsest/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Homonym/i);
  assert.match(readme, /#91735/);
  assert.match(readme, /#70076/);
  assert.match(readme, /#69752/);
  assert.match(readme, /#89915/);
  assert.match(readme, /#85595/);
  assert.match(readme, /근평|비계량|C--Users/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/homograph/);
  assert.match(readme, /node --test projects\/homograph\/homograph\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /lexicographer|headword|lemma|dictionary/i);
  assert.match(readme, /Score homograph or admit distinct/);
  assert.match(readme, /#93757|#93746|#93744|#93722|#93672|#93652|#93680|#93618|#93694/);
  assert.doesNotMatch(readme, /#93745/);
});

test("catalog features Homograph only; Galley unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 305);
  assert.equal(hub.products.length, 305);
  assert.equal(catalog.products[0].name, "Homograph");
  assert.equal(catalog.products[0].slug, "homograph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/homograph/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /homograph|#93743|lexicographer|headword/i);
  assert.match(catalog.products[0].summary, /\bdistinct\b/);
  assert.match(catalog.products[0].summary, /\bcollided\b/);
  assert.match(catalog.products[0].summary, /lossy-slug/);
  assert.match(catalog.products[0].summary, /Score homograph or admit distinct/);
  assert.equal(hub.products[0].slug, "homograph");
  assert.equal(hub.products[0].featured, true);
  const galley = catalog.products.find((row) => row.slug === "galley");
  assert.ok(galley);
  assert.equal(galley.featured, false);
  const rescript = catalog.products.find((row) => row.slug === "rescript");
  assert.ok(rescript);
  assert.equal(rescript.featured, false);
  const monadnock = catalog.products.find((row) => row.slug === "monadnock");
  assert.ok(monadnock);
  assert.equal(monadnock.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "homograph").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93743") && row.slug !== "homograph"));
});

test("vercel rewrites homograph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/homograph");
  assert.equal(vercel.rewrites[0].destination, "/projects/homograph");
  assert.equal(vercel.rewrites[1].source, "/homograph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/homograph");
  assert.equal(vercel.rewrites[2].source, "/homograph/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/homograph/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
