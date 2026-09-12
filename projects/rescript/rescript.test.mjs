import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALSO_VERSIONS,
  BACKUPS,
  BOOTH_STATIONS,
  CHANCERY_PLAQUES,
  CHIPS,
  CODE_VERSION,
  COUSINS,
  DISARM_DAYS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOOK_COUNT,
  HOOKS_ADDED,
  HOOK_WINDOW_END,
  HOOK_WINDOW_START,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MODEL_SAVE_AT,
  MODEL_SAVE_LINE,
  NOT_PRODUCTS,
  NOTICED_AT,
  OS_NAME,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESCRIPT_WALK,
  RULED_OUT,
  SAMPLE_CHARTER,
  SAMPLE_INK,
  SAMPLE_PRESS,
  SAMPLE_QUIRE,
  SAMPLE_SCROLL,
  SEEDED_WORD,
  SESSION_KIND,
  SESSION_RESUMED,
  SESSION_STARTED,
  SETTINGS_PATH,
  STATE,
  SURVIVOR_CUTOFF,
  TITLE,
  VANISHED_COUNT,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCharter,
  inspectInk,
  inspectPress,
  inspectQuire,
  inspectScroll,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBackwardHooks,
  seedFiveVanished,
  seedForwardModel,
  seedHold,
  seedIntact,
  seedMergeToDisk,
  seedNineteenHooks,
  seedRescript,
  seedScraped,
  seedSerializerFingerprint,
  seedSnapshotWrite,
  seedStaleScroll,
  seedThreeDays,
} from "./rescript.mjs";

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
  return fileURLToPath(new URL("./rescript.mjs", import.meta.url));
}

test("idle intact is a hold; disk charter is merged and hooks remain", () => {
  const result = analyze(seedIntact());
  assert.equal(result.verdict, "intact");
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.intact, true);
  assert.equal(result.phrase, "admit intact");
  assert.equal(result.scraped, false);
  assert.equal(result.snapshotWrite, false);
  assert.equal(result.mergeToDisk, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify intact", () => {
  assert.equal(classify(emptyTicket()), "intact");
  assert.equal(classify(""), "intact");
  assert.equal(classify(null), "intact");
  assert.equal(decide({}), "intact");
});

test("#93742 seeded path scores rescript when the charter is scraped", () => {
  const result = analyze(seedScraped());
  assert.equal(result.verdict, "rescript");
  assert.equal(result.seededWord, "scraped");
  assert.equal(SEEDED_WORD, "scraped");
  assert.equal(PRODUCT_WORD, "rescript");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scraped, true);
  assert.equal(result.phrase, "score rescript");
  assert.equal(result.staleScroll, true);
  assert.equal(result.forwardModel, true);
  assert.equal(result.backwardHooks, true);
  assert.equal(result.snapshotWrite, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("stale-scroll plus forward-model is the #93742 rescript", () => {
  const charter = inspectCharter({ scraped: true, snapshotWrite: true });
  assert.equal(charter.stamp, "scraped");
  assert.equal(charter.scraped, true);
  const scored = scoreGate({
    scraped: true,
    staleScroll: true,
    forwardModel: true,
    backwardHooks: true,
    serializerFingerprint: true,
    nineteenHooks: true,
    fiveVanished: true,
    threeDays: true,
    snapshotWrite: true,
    cue: "scraped",
    charter: SAMPLE_CHARTER,
    scroll: SAMPLE_SCROLL,
  });
  assert.equal(scored.verdict, "rescript");
  assert.equal(scored.snapshotWrite, true);
  const open = inspectCharter({ intact: true, mergeToDisk: true });
  assert.equal(open.stamp, "merged");
});

test("path word is snapshot-write; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "snapshot-write");
  const result = analyze(seedSnapshotWrite());
  assert.equal(result.verdict, "snapshot-write");
  assert.equal(result.pathWord, "snapshot-write");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "snapshot-write", preferSeed: true, scraped: true }),
    "snapshot-write",
  );
  assert.equal(classify(seedStaleScroll()), "stale-scroll");
});

test("HOLD includes intact / hold", () => {
  assert.ok(HOLD.includes("intact"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: stale-scroll, forward-model, backward-hooks, five-vanished", () => {
  assert.equal(classify(seedStaleScroll()), "stale-scroll");
  assert.equal(classify(seedForwardModel()), "forward-model");
  assert.equal(classify(seedBackwardHooks()), "backward-hooks");
  assert.equal(classify(seedSerializerFingerprint()), "serializer-fingerprint");
  assert.equal(classify(seedNineteenHooks()), "nineteen-hooks");
  assert.equal(classify(seedFiveVanished()), "five-vanished");
  assert.equal(classify(seedThreeDays()), "three-days");
  assert.equal(classify(seedMergeToDisk()), "merge-to-disk");
  assert.equal(classify(seedRescript()), "rescript");
});

test("booth fixtures flip intact vs scraped vs snapshot-write vs rescript", () => {
  const idle = scoreGate(seedIntact());
  const seeded = scoreGate(seedScraped());
  const intact = readData("intact.json");
  const scraped = readData("scraped.json");
  const path = readData("snapshot-write.json");
  const product = readData("rescript.json");
  const staleScroll = readData("stale-scroll.json");
  const forward = readData("forward-model.json");
  const vanished = readData("five-vanished.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "intact");
  assert.equal(seeded.verdict, "rescript");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedIntact()), "intact");
  assert.equal(score(seedScraped()), "rescript");
  assert.equal(intact.mergeToDisk, true);
  assert.equal(intact.intact, true);
  assert.equal(scoreGate(intact).verdict, "intact");
  assert.equal(scraped.staleScroll, true);
  assert.equal(scraped.forwardModel, true);
  assert.equal(scraped.fiveVanished, true);
  assert.equal(classify(scraped), "scraped");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /merge|disk|charter/i);
  assert.match(path.paths[1].result, /snapshot|scroll|rewrit/i);
  assert.equal(classify(path), "snapshot-write");
  assert.equal(classify(product), "rescript");
  assert.equal(product.hubCount, "RESCRIPT");
  assert.equal(scraped.issue, 93742);
  assert.equal(scraped.scraped, true);
  assert.equal(classify(staleScroll), "stale-scroll");
  assert.equal(classify(forward), "forward-model");
  assert.equal(classify(vanished), "five-vanished");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("intact"));
  assert.ok(CHIPS.includes("scraped"));
  assert.ok(CHIPS.includes("rescript"));
  assert.ok(CHIPS.includes("snapshot-write"));
  assert.ok(CHIPS.includes("stale-scroll"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("scraped"));
  assert.ok(ALARM.includes("snapshot-write"));
  assert.ok(ALARM.includes("stale-scroll"));
  assert.ok(ALARM.includes("rescript"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published rescript walk scores rescript after the idle hold", () => {
  const booth = scoreWalk({ rows: RESCRIPT_WALK });
  assert.equal(booth.verdict, "rescript");
  assert.ok(booth.scrapedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-intact");
  assert.equal(idle.intact, true);
  assert.equal(idle.verdict, "intact");
  const scroll = booth.rows.find((row) => row.event === "stale-scroll");
  assert.equal(scroll.staleScroll, true);
  const path = booth.rows.find((row) => row.event === "snapshot-write");
  assert.equal(path.verdict, "snapshot-write");
});

test("RESCRIPT_WALK constant matches the issue chancery walk", () => {
  assert.equal(RESCRIPT_WALK[0].event, "cue-intact");
  const scroll = RESCRIPT_WALK.find((row) => row.event === "stale-scroll");
  assert.equal(scroll.staleScroll, true);
  const path = RESCRIPT_WALK.find((row) => row.event === "snapshot-write");
  assert.equal(path.scraped, true);
  const scoreRow = RESCRIPT_WALK.find((row) => row.event === "rescript");
  assert.equal(scoreRow.scraped, true);
});

test("positive control merge-to-disk stays intact", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "intact");
  const ok = walk.rows.find((row) => row.event === "merge-to-disk");
  assert.equal(ok.verdict, "intact");
  const hold = walk.rows.find((row) => row.event === "cue-intact");
  assert.equal(hold.intact, true);
  assert.equal(hold.verdict, "intact");
});

test("issue constants encode only #93742 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93742);
  assert.ok(ISSUE_URL.includes("93742"));
  assert.match(TITLE, /save-as-default/i);
  assert.match(TITLE, /settings\.json/i);
  assert.match(TITLE, /hooks/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("data-loss"));
  assert.equal(PLATFORM, "linux");
  assert.equal(CODE_VERSION, "2.1.269");
  assert.deepEqual([...ALSO_VERSIONS], ["2.1.267", "2.1.268"]);
  assert.equal(OS_NAME, "Linux Ubuntu 26.04 bash");
  assert.equal(HOOK_COUNT, 19);
  assert.equal(VANISHED_COUNT, 5);
  assert.equal(DISARM_DAYS, 3);
  assert.match(MODEL_SAVE_LINE, /Fable 5\.1/);
  assert.equal(SETTINGS_PATH, "~/.claude/settings.json");
  assert.equal(HOOK_WINDOW_START, "2026-09-07 22:16");
  assert.equal(HOOK_WINDOW_END, "2026-09-08 00:18");
  assert.equal(SURVIVOR_CUTOFF, "2026-08-27");
  assert.equal(HOOKS_ADDED, "2026-09-08 04:16–06:18");
  assert.equal(SESSION_STARTED, "2026-08-13");
  assert.equal(SESSION_RESUMED, "2026-09-08 15:17");
  assert.equal(MODEL_SAVE_AT, "2026-09-10 14:30:46");
  assert.equal(NOTICED_AT, "2026-09-11");
  assert.equal(CHANCERY_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /Write\/Edit\/Bash|transcripts/.test(row)));
  assert.ok(EXPECTED.some((row) => /merge|disk|snapshot/i.test(row)));
  assert.match(DISTRIBUTION, /19/);
  assert.match(SESSION_KIND, /2\.1\.269|19/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("snapshot-write"));
  assert.ok(FINGERPRINT_LINES.includes("scraped"));
  assert.match(PHRASE, /Score rescript or admit intact/);
  assert.equal(SAMPLE_CHARTER.scraped, true);
  assert.equal(SAMPLE_SCROLL.older, true);
  assert.equal(SAMPLE_PRESS.wholeFile, true);
  assert.equal(SAMPLE_QUIRE.vanished, 5);
  assert.equal(SAMPLE_INK.literalUtf8, true);
});

test("has-repro fingerprints encode the published scraped chancery", () => {
  const result = handle(seedScraped());
  assert.equal(result.published.platform, "linux");
  assert.match(result.published.sessionKind, /19/);
  assert.match(result.published.modelSaveLine, /Fable 5\.1/);
  assert.match(
    fingerprint(seedScraped()),
    /rescript\|charter=scraped\|scroll=older\|press=rescript\|quire=five-vanished\|ink=literal-utf8\|path=snapshot-write\|cue=snapshot-write/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Monadnock and Rider", () => {
  const required = [
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

test("intact booth flips scraped back when the charter is merged", () => {
  const tape = {
    intact: true,
    scraped: false,
    mergeToDisk: true,
    cue: "intact",
  };
  assert.equal(scoreGate(tape).verdict, "intact");
  tape.intact = false;
  tape.scraped = true;
  tape.staleScroll = true;
  tape.forwardModel = true;
  tape.fiveVanished = true;
  tape.cue = "scraped";
  assert.equal(scoreGate(tape).verdict, "rescript");
  tape.intact = true;
  tape.scraped = false;
  tape.staleScroll = false;
  tape.forwardModel = false;
  tape.fiveVanished = false;
  tape.cue = "intact";
  assert.equal(scoreGate(tape).verdict, "intact");
});

test("charter, scroll, press, quire, ink, and readBooth mark the scraped lectern", () => {
  const idle = inspectCharter({
    intact: true,
    mergeToDisk: true,
    charter: { merged: true, scraped: false },
  });
  assert.equal(idle.stamp, "merged");
  const scroll = inspectScroll({ scraped: true, scroll: SAMPLE_SCROLL });
  assert.equal(scroll.stamp, "older-scroll");
  assert.equal(scroll.older, true);
  const press = inspectPress({
    forwardModel: true,
    press: SAMPLE_PRESS,
  });
  assert.equal(press.stamp, "rescript-issued");
  const quire = inspectQuire({ scraped: true, snapshotWrite: true });
  assert.equal(quire.stamp, "five-vanished");
  const ink = inspectInk({ scraped: true, serializerFingerprint: true });
  assert.equal(ink.stamp, "literal-utf8");
  const booth = readBooth({
    scraped: true,
    staleScroll: true,
    forwardModel: true,
    charter: SAMPLE_CHARTER,
    scroll: SAMPLE_SCROLL,
  });
  assert.equal(booth.scraped, true);
  assert.equal(booth.mark, "scraped");
  const open = readBooth({
    intact: true,
    scraped: false,
    mergeToDisk: true,
  });
  assert.equal(open.scraped, false);
  assert.equal(open.mark, "intact");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 76749);
  assert.equal(COUSINS[1].issue, 93469);
  assert.equal(COUSINS[2].issue, 79403);
  assert.equal(COUSINS[3].issue, 89215);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /76749|env|rebuild/i);
  assert.match(COUSINS[1].why, /93469|opus/i);
  assert.match(COUSINS[2].why, /79403|malformed/i);
  assert.match(COUSINS[3].why, /89215|ignored/i);
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
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93722);
  assert.equal(BACKUPS[1].issue, 93743);
  assert.equal(BACKUPS[2].issue, 93745);
  assert.equal(BACKUPS[3].issue, 93672);
  assert.equal(BACKUPS[4].issue, 93652);
  assert.equal(BACKUPS[5].issue, 93680);
  assert.equal(BACKUPS[6].issue, 93618);
  assert.equal(BACKUPS[7].issue, 93694);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /worktree connector|umbilical/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scraped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "intact");
  assert.equal(JSON.parse(seeded.stdout).verdict, "scraped");
});

test("handle exposes published hypothesis and #93742 headline", () => {
  const result = handle(seedScraped());
  assert.equal(result.published.issue, 93742);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [76749, 93469, 79403, 89215]);
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93743));
  assert.ok(result.published.backups.includes(93745));
  assert.match(result.published.hypothesis, /in-memory|snapshot|model key|session load/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93742/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a chancery rescript booth, not monadnock or rider", () => {
  const page = readPage();
  assert.match(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.match(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.match(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.match(page, /chancery|rescript|wax-seal|wax seal|scrolled/i);
  assert.match(page, /#F4EBD0|#1B1A17|#8B2E2E|#C4A35A|#3A342C|#6B3A3A/i);
  assert.match(page, /\bintact\b/);
  assert.match(page, /\bscraped\b/);
  assert.match(page, /snapshot-write/);
  assert.match(page, /Score rescript or admit intact/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#303/);
  assert.match(page, /#93742/);
  assert.match(page, /Merge the charter/);
  assert.match(page, /Score rescript/);
  assert.match(page, /Walk the chancery/);
  assert.match(page, /Compare intact \/ scraped/);
  assert.match(page, /Pin idle intact/);
  assert.match(page, /Pin seeded scraped/);
  assert.match(page, /Pin snapshot-write/);
  assert.match(page, /Hold the intact/);
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
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
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
  assert.match(readme, /Rescript/);
  assert.match(readme, /#93742/);
  assert.match(readme, /\bintact\b/);
  assert.match(readme, /\bscraped\b/);
  assert.match(readme, /snapshot-write/);
  assert.match(readme, /Big Shoulders Display/);
  assert.match(readme, /Atkinson Hyperlegible/);
  assert.match(readme, /Red Hat Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /#76749/);
  assert.match(readme, /#93469/);
  assert.match(readme, /#79403/);
  assert.match(readme, /#89215/);
  assert.match(readme, /19|save-as-default|\\\\uXXXX|Fable 5\.1/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/rescript/);
  assert.match(readme, /node --test projects\/rescript\/rescript\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /chancery|rescript|wax-seal|scroll/i);
  assert.match(readme, /Score rescript or admit intact/);
  assert.match(readme, /#93722|#93743|#93745|#93672|#93652|#93680|#93618|#93694/);
});

test("catalog features Rescript only; Monadnock unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 303);
  assert.equal(hub.products.length, 303);
  assert.equal(catalog.products[0].name, "Rescript");
  assert.equal(catalog.products[0].slug, "rescript");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/rescript/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /chancery|rescript|#93742/i);
  assert.match(catalog.products[0].summary, /\bintact\b/);
  assert.match(catalog.products[0].summary, /\bscraped\b/);
  assert.match(catalog.products[0].summary, /snapshot-write/);
  assert.equal(hub.products[0].slug, "rescript");
  assert.equal(hub.products[0].featured, true);
  const monadnock = catalog.products.find((row) => row.slug === "monadnock");
  assert.ok(monadnock);
  assert.equal(monadnock.featured, false);
  const rider = catalog.products.find((row) => row.slug === "rider");
  assert.ok(rider);
  assert.equal(rider.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "rescript").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93742") && row.slug !== "rescript"));
});

test("vercel rewrites rescript to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/rescript");
  assert.equal(vercel.rewrites[0].destination, "/projects/rescript");
  assert.equal(vercel.rewrites[1].source, "/rescript/");
  assert.equal(vercel.rewrites[1].destination, "/projects/rescript");
  assert.equal(vercel.rewrites[2].source, "/rescript/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/rescript/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
