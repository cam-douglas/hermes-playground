import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ASHPAN_TRAYS,
  ASHPAN_WALK,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  CLI_UUID,
  COUSINS,
  DELETE_LOG,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GET_SESSION,
  HOLD,
  IDLE_WORD,
  INTERNAL_ID,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_FILE,
  SAMPLE_INDEX,
  SAMPLE_LIST,
  SAMPLE_SPAWN,
  SAMPLE_UUID,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  SURFACE,
  TITLE,
  TRANSCRIPT_NAME,
  TRANSCRIPT_PATH,
  TRANSCRIPT_SIZE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectFile,
  inspectIndex,
  inspectList,
  inspectSpawn,
  inspectUuid,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAshpan,
  seedAshpanned,
  seedCliUuidSplit,
  seedFileLingers,
  seedHold,
  seedIndexGone,
  seedListBlank,
  seedOrphanJsonl,
  seedSpawnedChild,
  seedSwept,
} from "./ashpan.mjs";

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
  return fileURLToPath(new URL("./ashpan.mjs", import.meta.url));
}

test("idle swept is a hold; transcript gone with the index", () => {
  const result = analyze(seedSwept());
  assert.equal(result.verdict, "swept");
  assert.equal(result.idleWord, "swept");
  assert.equal(IDLE_WORD, "swept");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.swept, true);
  assert.equal(result.phrase, "admit swept");
  assert.equal(result.ashpanned, false);
  assert.equal(result.orphanJsonl, false);
  assert.equal(result.fileLingers, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify swept", () => {
  assert.equal(classify(emptyTicket()), "swept");
  assert.equal(classify(""), "swept");
  assert.equal(classify(null), "swept");
  assert.equal(decide({}), "swept");
});

test("#93780 seeded path scores ashpan when the jsonl remains after index delete", () => {
  const result = analyze(seedAshpanned());
  assert.equal(result.verdict, "ashpan");
  assert.equal(result.seededWord, "ashpanned");
  assert.equal(SEEDED_WORD, "ashpanned");
  assert.equal(PRODUCT_WORD, "ashpan");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.ashpanned, true);
  assert.equal(result.phrase, "score ashpan");
  assert.equal(result.orphanJsonl, true);
  assert.equal(result.spawnedChild, true);
  assert.equal(result.fileLingers, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("orphan jsonl plus file-lingers is the #93780 ashpan", () => {
  const file = inspectFile({ ashpanned: true, fileLingers: true });
  assert.equal(file.stamp, "ash-in-pan");
  assert.equal(file.lingers, true);
  const scored = scoreGate({
    ashpanned: true,
    orphanJsonl: true,
    spawnedChild: true,
    indexGone: true,
    cliUuidSplit: true,
    fileLingers: true,
    listBlank: true,
    cue: "ashpanned",
    index: SAMPLE_INDEX,
    file: SAMPLE_FILE,
    uuid: SAMPLE_UUID,
  });
  assert.equal(scored.verdict, "ashpan");
  assert.equal(scored.orphanJsonl, true);
  const open = inspectFile({ swept: true, fileLingers: false });
  assert.equal(open.stamp, "pan-swept");
});

test("path word is orphan-jsonl; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "orphan-jsonl");
  const result = analyze(seedOrphanJsonl());
  assert.equal(result.verdict, "orphan-jsonl");
  assert.equal(result.pathWord, "orphan-jsonl");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "orphan-jsonl", preferSeed: true, ashpanned: true }),
    "orphan-jsonl",
  );
  assert.equal(classify(seedFileLingers()), "file-lingers");
});

test("HOLD includes swept / hold", () => {
  assert.ok(HOLD.includes("swept"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: spawned-child, index-gone, cli-uuid-split, file-lingers", () => {
  assert.equal(classify(seedSpawnedChild()), "spawned-child");
  assert.equal(classify(seedIndexGone()), "index-gone");
  assert.equal(classify(seedCliUuidSplit()), "cli-uuid-split");
  assert.equal(classify(seedFileLingers()), "file-lingers");
  assert.equal(classify(seedListBlank()), "list-blank");
  assert.equal(classify(seedAshpan()), "ashpan");
});

test("booth fixtures flip swept vs ashpanned vs orphan-jsonl vs ashpan", () => {
  const idle = scoreGate(seedSwept());
  const seeded = scoreGate(seedAshpanned());
  const swept = readData("swept.json");
  const ashpanned = readData("ashpanned.json");
  const path = readData("orphan-jsonl.json");
  const product = readData("ashpan.json");
  const spawn = readData("spawned-child.json");
  const gone = readData("index-gone.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "swept");
  assert.equal(seeded.verdict, "ashpan");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSwept()), "swept");
  assert.equal(score(seedAshpanned()), "ashpan");
  assert.equal(swept.fileLingers, false);
  assert.equal(swept.swept, true);
  assert.equal(scoreGate(swept).verdict, "swept");
  assert.equal(ashpanned.orphanJsonl, true);
  assert.equal(ashpanned.spawnedChild, true);
  assert.equal(ashpanned.fileLingers, true);
  assert.equal(classify(ashpanned), "ashpanned");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /transcript unrecoverable after deletion/i);
  assert.match(path.paths[1].result, /index gone|file lingers|UUID/i);
  assert.equal(classify(path), "orphan-jsonl");
  assert.equal(classify(product), "ashpan");
  assert.equal(product.hubCount, "ASHPAN");
  assert.equal(ashpanned.issue, 93780);
  assert.equal(ashpanned.ashpanned, true);
  assert.equal(classify(spawn), "spawned-child");
  assert.equal(classify(gone), "index-gone");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("cli-uuid-split.json")), "cli-uuid-split");
  assert.equal(classify(readData("file-lingers.json")), "file-lingers");
  assert.equal(classify(readData("list-blank.json")), "list-blank");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("swept"));
  assert.ok(CHIPS.includes("ashpanned"));
  assert.ok(CHIPS.includes("ashpan"));
  assert.ok(CHIPS.includes("orphan-jsonl"));
  assert.ok(CHIPS.includes("spawned-child"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("ashpanned"));
  assert.ok(ALARM.includes("orphan-jsonl"));
  assert.ok(ALARM.includes("spawned-child"));
  assert.ok(ALARM.includes("ashpan"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published ashpan walk scores ashpan after the idle hold", () => {
  const booth = scoreWalk({ rows: ASHPAN_WALK });
  assert.equal(booth.verdict, "ashpan");
  assert.ok(booth.ashpannedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-swept");
  assert.equal(idle.swept, true);
  assert.equal(idle.verdict, "swept");
  const spawn = booth.rows.find((row) => row.event === "spawned-child");
  assert.equal(spawn.spawnedChild, true);
  const path = booth.rows.find((row) => row.event === "orphan-jsonl" && row.t === "path");
  assert.equal(path.verdict, "orphan-jsonl");
});

test("ASHPAN_WALK constant matches the issue grate walk", () => {
  assert.equal(ASHPAN_WALK[0].event, "cue-swept");
  const spawn = ASHPAN_WALK.find((row) => row.event === "spawned-child");
  assert.equal(spawn.spawnedChild, true);
  const path = ASHPAN_WALK.find((row) => row.t === "path");
  assert.equal(path.ashpanned, true);
  const scoreRow = ASHPAN_WALK.find((row) => row.event === "ashpan");
  assert.equal(scoreRow.ashpanned, true);
});

test("positive control delete-with-file stays swept", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "swept");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "swept");
  const hold = walk.rows.find((row) => row.event === "cue-swept");
  assert.equal(hold.swept, true);
  assert.equal(hold.verdict, "swept");
});

test("issue constants encode only #93780 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93780);
  assert.ok(ISSUE_URL.includes("93780"));
  assert.match(TITLE, /delete_session/i);
  assert.match(TITLE, /transcript|\.jsonl|spawned|child/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:security"));
  assert.ok(LABELS.includes("area:agents"));
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.266/);
  assert.match(SURFACE, /macOS/);
  assert.equal(INTERNAL_ID, "local_14e76123-1f6e-45a2-9fc9-4c57b0880187");
  assert.equal(CLI_UUID, "98d5ed86-0690-45e2-bcb9-4e6eeaeffbab");
  assert.equal(TRANSCRIPT_NAME, "98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl");
  assert.match(TRANSCRIPT_PATH, /98d5ed86-0690-45e2-bcb9-4e6eeaeffbab\.jsonl/);
  assert.match(TRANSCRIPT_SIZE, /2\.9MB/);
  assert.match(DELETE_LOG, /LocalSessions\.delete/);
  assert.equal(GET_SESSION, "not found");
  assert.equal(ASHPAN_TRAYS.length, 4);
  assert.ok(RULED_OUT.some((row) => /81843|82788|71773/i.test(row)));
  assert.ok(EXPECTED.some((row) => /unrecoverable|delete the raw/i.test(row)));
  assert.match(DISTRIBUTION, /delete_session|spawned|2\.9MB|local_14e76123|98d5ed86/);
  assert.match(SESSION_KIND, /spawn_task|scheduled-task-launched|2\.1\.266|macOS/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("orphan-jsonl"));
  assert.ok(FINGERPRINT_LINES.includes("ashpanned"));
  assert.equal(PHRASE, "Score ashpan or admit swept.");
  assert.equal(SAMPLE_INDEX.gone, true);
  assert.equal(SAMPLE_FILE.lingers, true);
  assert.equal(SAMPLE_UUID.split, true);
  assert.equal(SAMPLE_LIST.blank, true);
  assert.equal(SAMPLE_SPAWN.spawned, true);
});

test("has-repro fingerprints encode the published ashpanned grate", () => {
  const result = handle(seedAshpanned());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.sessionKind, /spawn_task|2\.1\.266/);
  assert.equal(result.published.internalId, INTERNAL_ID);
  assert.match(
    fingerprint(seedAshpanned()),
    /ashpan\|index=burned\|file=lingers\|session=spawned-child\|get=not-found\|path=orphan-jsonl\|cue=orphan-jsonl/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Outrider and Necrology", () => {
  const required = [
    "credentialed",
    "outridden",
    "outrider",
    "early-connect",
    "attested",
    "necrologized",
    "necrology",
    "incomplete-listing",
    "named",
    "blank",
    "innominate",
    "icon-only",
    "lit",
    "snuffed",
    "snuffer",
    "ganged-or",
    "pledged",
    "swapped",
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
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
    "quench",
    "stopcock",
    "hasp",
    "scuttle",
    "aphonia",
    "muzzle",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "knell",
    "wraith",
    "scrim",
    "knock",
    "reliquary",
    "cenotaph",
    "afterimage",
    "midden",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("swept booth flips ashpanned back when the pan stays empty", () => {
  const tape = {
    swept: true,
    ashpanned: false,
    fileLingers: false,
    cue: "swept",
  };
  assert.equal(scoreGate(tape).verdict, "swept");
  tape.swept = false;
  tape.ashpanned = true;
  tape.orphanJsonl = true;
  tape.fileLingers = true;
  tape.spawnedChild = true;
  tape.cue = "ashpanned";
  assert.equal(scoreGate(tape).verdict, "ashpan");
  tape.swept = true;
  tape.ashpanned = false;
  tape.orphanJsonl = false;
  tape.fileLingers = false;
  tape.spawnedChild = false;
  tape.cue = "swept";
  assert.equal(scoreGate(tape).verdict, "swept");
});

test("index, file, uuid, list, spawn, and readBooth mark the ashpanned grate", () => {
  const idle = inspectFile({
    swept: true,
    fileLingers: false,
    file: { lingers: false, parseable: false },
  });
  assert.equal(idle.stamp, "pan-swept");
  const index = inspectIndex({ ashpanned: true, index: SAMPLE_INDEX });
  assert.equal(index.stamp, "ledger-burned");
  assert.equal(index.gone, true);
  const uuid = inspectUuid({
    cliUuidSplit: true,
    uuid: SAMPLE_UUID,
  });
  assert.equal(uuid.stamp, "uuid-split");
  const list = inspectList({ ashpanned: true, listBlank: true });
  assert.equal(list.stamp, "list-blank");
  const spawn = inspectSpawn({ ashpanned: true, spawnedChild: true });
  assert.equal(spawn.stamp, "spawned-child");
  const booth = readBooth({
    ashpanned: true,
    fileLingers: true,
    index: SAMPLE_INDEX,
    file: SAMPLE_FILE,
  });
  assert.equal(booth.ashpanned, true);
  assert.equal(booth.mark, "ashpanned");
  const open = readBooth({
    swept: true,
    ashpanned: false,
    fileLingers: false,
  });
  assert.equal(open.ashpanned, false);
  assert.equal(open.mark, "swept");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 81843);
  assert.equal(COUSINS[1].issue, 82788);
  assert.equal(COUSINS[2].issue, 71773);
  assert.equal(COUSINS[3].issue, 79293);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /81843|corruption|unsynchronized|rebuild/i);
  assert.match(COUSINS[1].why, /82788|sidebar|spawned/i);
  assert.match(COUSINS[2].why, /71773|spawnedBy|list_sessions/i);
  assert.match(COUSINS[3].why, /79293|system-reminder|different defect/i);
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
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
  assert.ok(NOT_PRODUCTS.includes("reliquary"));
  assert.ok(NOT_PRODUCTS.includes("cenotaph"));
  assert.ok(NOT_PRODUCTS.includes("wraith"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("scrim"));
  assert.ok(NOT_PRODUCTS.includes("knock"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93778);
  assert.equal(BACKUPS[1].issue, 93777);
  assert.equal(BACKUPS[2].issue, 93754);
  assert.equal(BACKUPS[3].issue, 93751);
  assert.equal(BACKUPS[4].issue, 93750);
  assert.equal(BACKUPS[5].issue, 93744);
  assert.equal(BACKUPS[6].issue, 93733);
  assert.equal(BACKUPS[7].issue, 93782);
  assert.equal(BACKUPS[8].issue, 93779);
  assert.equal(BACKUPS[9].issue, 93766);
  assert.equal(BACKUPS[10].issue, 93764);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/ashpanned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const sweptFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/swept.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(sweptFix.status, 0, sweptFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "swept");
  assert.equal(JSON.parse(seeded.stdout).verdict, "ashpanned");
  assert.equal(JSON.parse(sweptFix.stdout).verdict, "swept");
});

test("handle exposes published hypothesis and #93780 headline", () => {
  const result = handle(seedAshpanned());
  assert.equal(result.published.issue, 93780);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [81843, 82788, 71773, 79293]);
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93750));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93733));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(result.published.backups.includes(93779));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(!result.published.backups.includes(93780));
  assert.ok(!result.published.backups.includes(93776));
  assert.match(result.published.hypothesis, /local_<uuid>|CLI UUID|spawned-child|file-unlink/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93780/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an industrial grate ashpan booth, not outrider or necrology", () => {
  const page = readPage();
  assert.match(page, /Teko/);
  assert.match(page, /Nunito Sans|Nunito\+Sans/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /ashpan|ashpanned|grate|foundry|orphan-jsonl/i);
  assert.match(page, /#1A1A1A|#9A9A94|#C45C26|#2C2C2C|#E8E4DC|#8B4513/i);
  assert.match(page, /\bswept\b/);
  assert.match(page, /\bashpanned\b/);
  assert.match(page, /orphan-jsonl/);
  assert.match(page, /Score ashpan or admit swept/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#311/);
  assert.match(page, /#93780/);
  assert.match(page, /Sweep the grate/);
  assert.match(page, /Score ashpan/);
  assert.match(page, /Walk the orphan-jsonl/);
  assert.match(page, /Compare swept \/ ashpanned/);
  assert.match(page, /Pin idle swept/);
  assert.match(page, /Pin seeded ashpanned/);
  assert.match(page, /Pin orphan-jsonl/);
  assert.match(page, /Hold the swept/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#C4A574/);
  assert.doesNotMatch(page, /#0B1C2C/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /#5C3A21/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#3A4550/);
  assert.doesNotMatch(page, /#EDE3C8/);
  assert.doesNotMatch(page, /#1A1410/);
  assert.doesNotMatch(page, /#3F6B55/);
  assert.doesNotMatch(page, /#A02A38/);
  assert.doesNotMatch(page, /#8D8576/);
  assert.doesNotMatch(page, /#12141A/);
  assert.doesNotMatch(page, /#D7DCE5/);
  assert.doesNotMatch(page, /#0B0D12/);
  assert.doesNotMatch(page, /#2A9D8F/);
  assert.doesNotMatch(page, /#C1121F/);
  assert.doesNotMatch(page, /#FFF8EC/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch|needs-auth branding/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk|torn census/i);
  assert.doesNotMatch(page, /blank nameplate|UIA Name|sendIcon|WCAG 4\.1\.2/i);
  assert.doesNotMatch(page, /pledged heir|court ledger|cradle-swap|fairy-gold|swaddling/i);
  assert.doesNotMatch(page, /lemma slip|lexicographer|shelf mark|orphan quire/i);
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
  assert.doesNotMatch(page, /artifact flame|scratchpad taper|brass snuffer|ganged-or bar/i);
  assert.doesNotMatch(page, /reliquary latch|cenotaph vacant|CRT residual|GC refuse/i);
  assert.doesNotMatch(page, /\bcredentialed\b/);
  assert.doesNotMatch(page, /\boutridden\b/);
  assert.doesNotMatch(page, /early-connect/);
  assert.doesNotMatch(page, /\battested\b/);
  assert.doesNotMatch(page, /\bnecrologized\b/);
  assert.doesNotMatch(page, /incomplete-listing/);
  assert.doesNotMatch(page, /\bnamed\b/);
  assert.doesNotMatch(page, /icon-only/);
  assert.doesNotMatch(page, /\bpledged\b/);
  assert.doesNotMatch(page, /\bswapped\b/);
  assert.doesNotMatch(page, /remote-reattach/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bcollided\b/);
  assert.doesNotMatch(page, /lossy-slug/);
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
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /ganged-or/);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Necrology/i);
  assert.match(page, /NOT Innominate/i);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
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
  assert.match(page, /NOT Reliquary/i);
  assert.match(page, /NOT Cenotaph/i);
  assert.match(page, /NOT Wraith/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Oubliette/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Ashpan/);
  assert.match(readme, /#93780/);
  assert.match(readme, /\bswept\b/);
  assert.match(readme, /\bashpanned\b/);
  assert.match(readme, /orphan-jsonl/);
  assert.match(readme, /Teko/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Necrology/i);
  assert.match(readme, /NOT Innominate/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
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
  assert.match(readme, /NOT Reliquary/i);
  assert.match(readme, /NOT Cenotaph/i);
  assert.match(readme, /NOT Wraith/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Oubliette/i);
  assert.match(readme, /#81843/);
  assert.match(readme, /#82788/);
  assert.match(readme, /#71773/);
  assert.match(readme, /#79293/);
  assert.match(readme, /delete_session|orphan|\.jsonl|spawned|local_14e76123|98d5ed86/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/ashpan/);
  assert.match(readme, /node --test projects\/ashpan\/ashpan\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /ashpan|grate|foundry|ash/i);
  assert.match(readme, /Score ashpan or admit swept/);
  assert.match(readme, /#93778|#93777|#93754|#93751|#93750|#93744|#93733|#93782|#93779|#93766|#93764/);
  assert.match(readme, /17:50/);
});

test("catalog features Ashpan only; Outrider unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 311);
  assert.equal(hub.products.length, 311);
  assert.equal(catalog.products[0].name, "Ashpan");
  assert.equal(catalog.products[0].slug, "ashpan");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/ashpan/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /17:50 ashpan|#93780|industrial grate|ashpan/i);
  assert.match(catalog.products[0].summary, /\bswept\b/);
  assert.match(catalog.products[0].summary, /\bashpanned\b/);
  assert.match(catalog.products[0].summary, /orphan-jsonl/);
  assert.match(catalog.products[0].summary, /Score ashpan or admit swept/);
  assert.equal(hub.products[0].slug, "ashpan");
  assert.equal(hub.products[0].featured, true);
  const outrider = catalog.products.find((row) => row.slug === "outrider");
  assert.ok(outrider);
  assert.equal(outrider.featured, false);
  const necrology = catalog.products.find((row) => row.slug === "necrology");
  assert.ok(necrology);
  assert.equal(necrology.featured, false);
  const innominate = catalog.products.find((row) => row.slug === "innominate");
  assert.ok(innominate);
  assert.equal(innominate.featured, false);
  const snuffer = catalog.products.find((row) => row.slug === "snuffer");
  assert.ok(snuffer);
  assert.equal(snuffer.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "ashpan").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93780") && row.slug !== "ashpan"));
});

test("vercel rewrites ashpan to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/ashpan");
  assert.equal(vercel.rewrites[0].destination, "/projects/ashpan");
  assert.equal(vercel.rewrites[1].source, "/ashpan/");
  assert.equal(vercel.rewrites[1].destination, "/projects/ashpan");
  assert.equal(vercel.rewrites[2].source, "/ashpan/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/ashpan/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
