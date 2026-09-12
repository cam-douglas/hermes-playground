import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BILLABLE_TOKENS,
  BOOTH_STATIONS,
  CACHE_READ_PCT,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FIRING_COUNT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GALLEY_PLAQUES,
  GALLEY_WALK,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MODEL_CALLS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BILL,
  SAMPLE_FORME,
  SAMPLE_PRESS,
  SAMPLE_SHEET,
  SAMPLE_STICK,
  SEEDED_WORD,
  SESSION_COST,
  SESSION_KIND,
  STATE,
  STOP_EXIT,
  SUBAGENT_FIRINGS,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBill,
  inspectForme,
  inspectPress,
  inspectSheet,
  inspectStick,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAdvisoryOnce,
  seedBackgroundExempt,
  seedBilled,
  seedCacheRead,
  seedComposingStick,
  seedDry,
  seedFourFirings,
  seedGalley,
  seedHold,
  seedMainSessionTax,
  seedSkipLive,
  seedStopDirty,
  seedUnboundSignature,
  seedWetProof,
} from "./galley.mjs";

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
  return fileURLToPath(new URL("./galley.mjs", import.meta.url));
}

test("idle dry is a hold; tree mid-write is respected and no false Stop bills", () => {
  const result = analyze(seedDry());
  assert.equal(result.verdict, "dry");
  assert.equal(result.idleWord, "dry");
  assert.equal(IDLE_WORD, "dry");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.dry, true);
  assert.equal(result.phrase, "admit dry");
  assert.equal(result.billed, false);
  assert.equal(result.stopDirty, false);
  assert.equal(result.skipLive, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify dry", () => {
  assert.equal(classify(emptyTicket()), "dry");
  assert.equal(classify(""), "dry");
  assert.equal(classify(null), "dry");
  assert.equal(decide({}), "dry");
});

test("#93745 seeded path scores galley when the wet proof is billed", () => {
  const result = analyze(seedBilled());
  assert.equal(result.verdict, "galley");
  assert.equal(result.seededWord, "billed");
  assert.equal(SEEDED_WORD, "billed");
  assert.equal(PRODUCT_WORD, "galley");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.billed, true);
  assert.equal(result.phrase, "score galley");
  assert.equal(result.wetProof, true);
  assert.equal(result.dirtyTree, true);
  assert.equal(result.backgroundLive, true);
  assert.equal(result.stopDirty, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("dirty tree plus live background agent is the #93745 galley", () => {
  const sheet = inspectSheet({ billed: true, stopDirty: true });
  assert.equal(sheet.stamp, "ink-wet");
  assert.equal(sheet.wet, true);
  const scored = scoreGate({
    billed: true,
    wetProof: true,
    dirtyTree: true,
    stopFired: true,
    fourFirings: true,
    cacheRead: true,
    mainSessionTax: true,
    backgroundLive: true,
    stopDirty: true,
    cue: "billed",
    stick: SAMPLE_STICK,
    sheet: SAMPLE_SHEET,
  });
  assert.equal(scored.verdict, "galley");
  assert.equal(scored.stopDirty, true);
  const open = inspectSheet({ dry: true, skipLive: true });
  assert.equal(open.stamp, "sheet-dry");
});

test("path word is stop-dirty; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "stop-dirty");
  const result = analyze(seedStopDirty());
  assert.equal(result.verdict, "stop-dirty");
  assert.equal(result.pathWord, "stop-dirty");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "stop-dirty", preferSeed: true, billed: true }),
    "stop-dirty",
  );
  assert.equal(classify(seedWetProof()), "wet-proof");
});

test("HOLD includes dry / hold", () => {
  assert.ok(HOLD.includes("dry"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: wet-proof, four-firings, cache-read, main-session-tax", () => {
  assert.equal(classify(seedWetProof()), "wet-proof");
  assert.equal(classify(seedComposingStick()), "composing-stick");
  assert.equal(classify(seedUnboundSignature()), "unbound-signature");
  assert.equal(classify(seedFourFirings()), "four-firings");
  assert.equal(classify(seedCacheRead()), "cache-read");
  assert.equal(classify(seedMainSessionTax()), "main-session-tax");
  assert.equal(classify(seedBackgroundExempt()), "background-exempt");
  assert.equal(classify(seedSkipLive()), "skip-live");
  assert.equal(classify(seedAdvisoryOnce()), "advisory-once");
  assert.equal(classify(seedGalley()), "galley");
});

test("booth fixtures flip dry vs billed vs stop-dirty vs galley", () => {
  const idle = scoreGate(seedDry());
  const seeded = scoreGate(seedBilled());
  const dry = readData("dry.json");
  const billed = readData("billed.json");
  const path = readData("stop-dirty.json");
  const product = readData("galley.json");
  const wet = readData("wet-proof.json");
  const firings = readData("four-firings.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "dry");
  assert.equal(seeded.verdict, "galley");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDry()), "dry");
  assert.equal(score(seedBilled()), "galley");
  assert.equal(dry.skipLive, true);
  assert.equal(dry.dry, true);
  assert.equal(scoreGate(dry).verdict, "dry");
  assert.equal(billed.wetProof, true);
  assert.equal(billed.dirtyTree, true);
  assert.equal(billed.fourFirings, true);
  assert.equal(classify(billed), "billed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /skip|background|dirty/i);
  assert.match(path.paths[1].result, /stop|exit 2|synthetic/i);
  assert.equal(classify(path), "stop-dirty");
  assert.equal(classify(product), "galley");
  assert.equal(product.hubCount, "GALLEY");
  assert.equal(billed.issue, 93745);
  assert.equal(billed.billed, true);
  assert.equal(classify(wet), "wet-proof");
  assert.equal(classify(firings), "four-firings");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("dry"));
  assert.ok(CHIPS.includes("billed"));
  assert.ok(CHIPS.includes("galley"));
  assert.ok(CHIPS.includes("stop-dirty"));
  assert.ok(CHIPS.includes("wet-proof"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("billed"));
  assert.ok(ALARM.includes("stop-dirty"));
  assert.ok(ALARM.includes("wet-proof"));
  assert.ok(ALARM.includes("galley"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published galley walk scores galley after the idle hold", () => {
  const booth = scoreWalk({ rows: GALLEY_WALK });
  assert.equal(booth.verdict, "galley");
  assert.ok(booth.billedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-dry");
  assert.equal(idle.dry, true);
  assert.equal(idle.verdict, "dry");
  const sheet = booth.rows.find((row) => row.event === "wet-proof");
  assert.equal(sheet.wetProof, true);
  const path = booth.rows.find((row) => row.event === "stop-dirty" && row.t === "path");
  assert.equal(path.verdict, "stop-dirty");
});

test("GALLEY_WALK constant matches the issue wet-proof walk", () => {
  assert.equal(GALLEY_WALK[0].event, "cue-dry");
  const sheet = GALLEY_WALK.find((row) => row.event === "wet-proof");
  assert.equal(sheet.wetProof, true);
  const path = GALLEY_WALK.find((row) => row.t === "path");
  assert.equal(path.billed, true);
  const scoreRow = GALLEY_WALK.find((row) => row.event === "galley");
  assert.equal(scoreRow.billed, true);
});

test("positive control skip-live stays dry", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "dry");
  const ok = walk.rows.find((row) => row.event === "skip-live");
  assert.equal(ok.verdict, "dry");
  const hold = walk.rows.find((row) => row.event === "cue-dry");
  assert.equal(hold.dry, true);
  assert.equal(hold.verdict, "dry");
});

test("issue constants encode only #93745 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93745);
  assert.ok(ISSUE_URL.includes("93745"));
  assert.match(TITLE, /Stop hook/i);
  assert.match(TITLE, /background agent/i);
  assert.match(TITLE, /mid-write/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("area:cost"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:claude-code-web"));
  assert.ok(LABELS.includes("platform:web"));
  assert.equal(PLATFORM, "web");
  assert.equal(FIRING_COUNT, 4);
  assert.equal(SESSION_COST, 3.25);
  assert.equal(BILLABLE_TOKENS, 5525683);
  assert.equal(CACHE_READ_PCT, 85);
  assert.equal(MODEL_CALLS, 17);
  assert.equal(SUBAGENT_FIRINGS, 0);
  assert.equal(STOP_EXIT, 2);
  assert.equal(GALLEY_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /normal correct state|mid-write|race/i.test(row)));
  assert.ok(EXPECTED.some((row) => /skip|advisory|background/i.test(row)));
  assert.match(DISTRIBUTION, /4 firings|\$3\.25|5\.5M|85%/);
  assert.match(SESSION_KIND, /4 firings|\$3\.25|0 firings/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("stop-dirty"));
  assert.ok(FINGERPRINT_LINES.includes("billed"));
  assert.match(PHRASE, /Score galley or admit dry/);
  assert.equal(SAMPLE_STICK.typeLoose, true);
  assert.equal(SAMPLE_SHEET.wet, true);
  assert.equal(SAMPLE_PRESS.stopExit, 2);
  assert.equal(SAMPLE_BILL.firings, 4);
  assert.equal(SAMPLE_FORME.agentsLive, true);
});

test("has-repro fingerprints encode the published billed galley", () => {
  const result = handle(seedBilled());
  assert.equal(result.published.platform, "web");
  assert.match(result.published.sessionKind, /4 firings/);
  assert.equal(result.published.sessionCost, 3.25);
  assert.match(
    fingerprint(seedBilled()),
    /galley\|sheet=wet\|forme=live\|press=wet-pull\|bill=four-firings\|cache=85\|path=stop-dirty\|cue=stop-dirty/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Rescript and Monadnock", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("dry booth flips billed back when the sheets stay dry", () => {
  const tape = {
    dry: true,
    billed: false,
    skipLive: true,
    cue: "dry",
  };
  assert.equal(scoreGate(tape).verdict, "dry");
  tape.dry = false;
  tape.billed = true;
  tape.wetProof = true;
  tape.dirtyTree = true;
  tape.fourFirings = true;
  tape.cue = "billed";
  assert.equal(scoreGate(tape).verdict, "galley");
  tape.dry = true;
  tape.billed = false;
  tape.wetProof = false;
  tape.dirtyTree = false;
  tape.fourFirings = false;
  tape.cue = "dry";
  assert.equal(scoreGate(tape).verdict, "dry");
});

test("stick, sheet, press, bill, forme, and readBooth mark the billed galley", () => {
  const idle = inspectStick({
    dry: true,
    skipLive: true,
    stick: { mainTurnEnded: false, typeLoose: false },
  });
  assert.equal(idle.stamp, "type-set");
  const sheet = inspectSheet({ billed: true, sheet: SAMPLE_SHEET });
  assert.equal(sheet.stamp, "ink-wet");
  assert.equal(sheet.wet, true);
  const press = inspectPress({
    stopFired: true,
    press: SAMPLE_PRESS,
  });
  assert.equal(press.stamp, "wet-pull");
  const bill = inspectBill({ billed: true, fourFirings: true });
  assert.equal(bill.stamp, "billed");
  const forme = inspectForme({ billed: true, backgroundLive: true });
  assert.equal(forme.stamp, "agents-live");
  const booth = readBooth({
    billed: true,
    wetProof: true,
    dirtyTree: true,
    stick: SAMPLE_STICK,
    sheet: SAMPLE_SHEET,
  });
  assert.equal(booth.billed, true);
  assert.equal(booth.mark, "billed");
  const open = readBooth({
    dry: true,
    billed: false,
    skipLive: true,
  });
  assert.equal(open.billed, false);
  assert.equal(open.mark, "dry");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 83924);
  assert.equal(COUSINS[1].issue, 85787);
  assert.equal(COUSINS[2].issue, 69586);
  assert.equal(COUSINS[3].issue, 40442);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /83924|unpushed|rebuild/i);
  assert.match(COUSINS[1].why, /85787|warning/i);
  assert.match(COUSINS[2].why, /69586|signature|Unverified/i);
  assert.match(COUSINS[3].why, /40442|loop|cache/i);
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
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93743);
  assert.equal(BACKUPS[1].issue, 93722);
  assert.equal(BACKUPS[2].issue, 93746);
  assert.equal(BACKUPS[3].issue, 93744);
  assert.equal(BACKUPS[4].issue, 93672);
  assert.equal(BACKUPS[5].issue, 93652);
  assert.equal(BACKUPS[6].issue, 93680);
  assert.equal(BACKUPS[7].issue, 93618);
  assert.equal(BACKUPS[8].issue, 93694);
  assert.equal(BACKUPS[9].issue, 93735);
  assert.equal(BACKUPS[10].issue, 93733);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /non-ASCII|ligature/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/billed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const dryFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dry.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(dryFix.status, 0, dryFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "dry");
  assert.equal(JSON.parse(seeded.stdout).verdict, "billed");
  assert.equal(JSON.parse(dryFix.stdout).verdict, "dry");
});

test("handle exposes published hypothesis and #93745 headline", () => {
  const result = handle(seedBilled());
  assert.equal(result.published.issue, 93745);
  assert.equal(result.published.platform, "web");
  assert.deepEqual(result.published.cousins, [83924, 85787, 69586, 40442]);
  assert.ok(result.published.backups.includes(93743));
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93672));
  assert.match(result.published.hypothesis, /background_tasks|agent status|blocking Stop/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93745/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a printer galley wet-proof booth, not rescript or monadnock", () => {
  const page = readPage();
  assert.match(page, /Young Serif|Young\+Serif/);
  assert.match(page, /Sora/);
  assert.match(page, /Azeret Mono|Azeret\+Mono/);
  assert.match(page, /galley|wet-proof|wet proof|unbound|composing stick/i);
  assert.match(page, /#DDD6C8|#141210|#C2301A|#A67C3D|#221F1B|#3E4A42/i);
  assert.match(page, /\bdry\b/);
  assert.match(page, /\bbilled\b/);
  assert.match(page, /stop-dirty/);
  assert.match(page, /Score galley or admit dry/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#304/);
  assert.match(page, /#93745/);
  assert.match(page, /Dry the sheets/);
  assert.match(page, /Score galley/);
  assert.match(page, /Walk the galley/);
  assert.match(page, /Compare dry \/ billed/);
  assert.match(page, /Pin idle dry/);
  assert.match(page, /Pin seeded billed/);
  assert.match(page, /Pin stop-dirty/);
  assert.match(page, /Hold the dry/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
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
  assert.doesNotMatch(page, /#F4EBD0/);
  assert.doesNotMatch(page, /#8B2E2E/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#9B2D2D/);
  assert.doesNotMatch(page, /#2B2F36/);
  assert.doesNotMatch(page, /#6B8F71/);
  assert.doesNotMatch(page, /#A8C5D4/);
  assert.doesNotMatch(page, /#E8A54B/);
  assert.doesNotMatch(page, /#0D0B10/);
  assert.doesNotMatch(page, /#F5C542/);
  assert.doesNotMatch(page, /#8B1E3F/);
  assert.doesNotMatch(page, /#3D5A80/);
  assert.doesNotMatch(page, /#6B4C9A/);
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
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Galley/);
  assert.match(readme, /#93745/);
  assert.match(readme, /\bdry\b/);
  assert.match(readme, /\bbilled\b/);
  assert.match(readme, /stop-dirty/);
  assert.match(readme, /Young Serif/);
  assert.match(readme, /Sora/);
  assert.match(readme, /Azeret Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /#83924/);
  assert.match(readme, /#85787/);
  assert.match(readme, /#69586/);
  assert.match(readme, /#40442/);
  assert.match(readme, /4 firings|\$3\.25|5\.5M|85%/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/galley/);
  assert.match(readme, /node --test projects\/galley\/galley\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /galley|wet-proof|composing stick|unbound/i);
  assert.match(readme, /Score galley or admit dry/);
  assert.match(readme, /#93743|#93722|#93746|#93744|#93672|#93652|#93680|#93618|#93694|#93735|#93733/);
});

test("catalog features Galley only; Rescript unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 304);
  assert.equal(hub.products.length, 304);
  assert.equal(catalog.products[0].name, "Galley");
  assert.equal(catalog.products[0].slug, "galley");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/galley/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /galley|#93745|wet-proof|printer/i);
  assert.match(catalog.products[0].summary, /\bdry\b/);
  assert.match(catalog.products[0].summary, /\bbilled\b/);
  assert.match(catalog.products[0].summary, /stop-dirty/);
  assert.match(catalog.products[0].summary, /Score galley or admit dry/);
  assert.equal(hub.products[0].slug, "galley");
  assert.equal(hub.products[0].featured, true);
  const rescript = catalog.products.find((row) => row.slug === "rescript");
  assert.ok(rescript);
  assert.equal(rescript.featured, false);
  const monadnock = catalog.products.find((row) => row.slug === "monadnock");
  assert.ok(monadnock);
  assert.equal(monadnock.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "galley").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93745") && row.slug !== "galley"));
});

test("vercel rewrites galley to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/galley");
  assert.equal(vercel.rewrites[0].destination, "/projects/galley");
  assert.equal(vercel.rewrites[1].source, "/galley/");
  assert.equal(vercel.rewrites[1].destination, "/projects/galley");
  assert.equal(vercel.rewrites[2].source, "/galley/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/galley/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
