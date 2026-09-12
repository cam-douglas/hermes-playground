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
  CLAUDE_VERSION,
  CONFIG_DIR,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INCIDENT_3_AT,
  INCIDENT_4_AT,
  INCIDENT_COUNT,
  INSTALL,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS_NAME,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PREV_VERSION,
  PRODUCT_WORD,
  RASURE_LEAVES,
  RASURE_WALK,
  RULED_OUT,
  SAMPLE_BACKUP,
  SAMPLE_INTACT_LEAF,
  SAMPLE_JSON,
  SAMPLE_LEAF,
  SAMPLE_SECRETS,
  SAMPLE_SETTINGS,
  SEEDED_WORD,
  SECRETS_COUNT,
  STATE,
  SURFACE,
  TITLE,
  TRANSCRIPT_COUNT_3,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBackup,
  inspectClaudeJson,
  inspectLeaf,
  inspectSecrets,
  inspectSettings,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBackupStamp,
  seedBlankClaudeJson,
  seedCreationTimeFlip,
  seedHold,
  seedIntact,
  seedRasure,
  seedRasured,
  seedSecretsLost,
  seedStubsSettings,
  seedWholesaleWipe,
} from "./rasure.mjs";

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
  return fileURLToPath(new URL("./rasure.mjs", import.meta.url));
}

test("idle intact is a hold; CreationTime stable; config survives", () => {
  const result = analyze(seedIntact());
  assert.equal(result.verdict, "intact");
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.intact, true);
  assert.equal(result.phrase, "admit intact");
  assert.equal(result.rasured, false);
  assert.equal(result.creationTimeFlip, false);
  assert.equal(result.wholesaleWipe, false);
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

test("#93791 seeded path scores rasure when CreationTime flips after wholesale wipe", () => {
  const result = analyze(seedRasured());
  assert.equal(result.verdict, "rasure");
  assert.equal(result.seededWord, "rasured");
  assert.equal(SEEDED_WORD, "rasured");
  assert.equal(PRODUCT_WORD, "rasure");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.rasured, true);
  assert.equal(result.phrase, "score rasure");
  assert.equal(result.creationTimeFlip, true);
  assert.equal(result.wholesaleWipe, true);
  assert.equal(result.blankClaudeJson, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("creation-time-flip plus wholesale-wipe is the #93791 rasure", () => {
  const leaf = inspectLeaf({ rasured: true, creationTimeFlip: true });
  assert.equal(leaf.stamp, "leaf-new");
  assert.equal(leaf.creationTimeFlipped, true);
  const scored = scoreGate({
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    stubsSettings: true,
    secretsLost: true,
    backupStamp: true,
    cue: "rasured",
    leaf: SAMPLE_LEAF,
    json: SAMPLE_JSON,
    settings: SAMPLE_SETTINGS,
  });
  assert.equal(scored.verdict, "rasure");
  assert.equal(scored.creationTimeFlip, true);
  const open = inspectLeaf({ intact: true, creationTimeFlip: false });
  assert.equal(open.stamp, "leaf-held");
});

test("path word is creation-time-flip; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "creation-time-flip");
  const result = analyze(seedCreationTimeFlip());
  assert.equal(result.verdict, "creation-time-flip");
  assert.equal(result.pathWord, "creation-time-flip");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "creation-time-flip", preferSeed: true, rasured: true }),
    "creation-time-flip",
  );
  assert.equal(classify(seedWholesaleWipe()), "wholesale-wipe");
});

test("HOLD includes intact / hold", () => {
  assert.ok(HOLD.includes("intact"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: wholesale-wipe, blank-claude-json, stubs-settings, secrets-lost", () => {
  assert.equal(classify(seedWholesaleWipe()), "wholesale-wipe");
  assert.equal(classify(seedBlankClaudeJson()), "blank-claude-json");
  assert.equal(classify(seedStubsSettings()), "stubs-settings");
  assert.equal(classify(seedSecretsLost()), "secrets-lost");
  assert.equal(classify(seedBackupStamp()), "backup-stamp");
  assert.equal(classify(seedRasure()), "rasure");
});

test("booth fixtures flip intact vs rasured vs creation-time-flip vs rasure", () => {
  const idle = scoreGate(seedIntact());
  const seeded = scoreGate(seedRasured());
  const intact = readData("intact.json");
  const rasured = readData("rasured.json");
  const path = readData("creation-time-flip.json");
  const product = readData("rasure.json");
  const wipe = readData("wholesale-wipe.json");
  const blank = readData("blank-claude-json.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "intact");
  assert.equal(seeded.verdict, "rasure");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedIntact()), "intact");
  assert.equal(score(seedRasured()), "rasure");
  assert.equal(intact.creationTimeFlip, false);
  assert.equal(intact.intact, true);
  assert.equal(scoreGate(intact).verdict, "intact");
  assert.equal(rasured.creationTimeFlip, true);
  assert.equal(rasured.wholesaleWipe, true);
  assert.equal(rasured.blankClaudeJson, true);
  assert.equal(classify(rasured), "rasured");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /CreationTime|delete\+recreate/i);
  assert.match(path.paths[1].result, /history|transcripts|hooks/i);
  assert.equal(classify(path), "creation-time-flip");
  assert.equal(classify(product), "rasure");
  assert.equal(product.hubCount, "RASURE");
  assert.equal(rasured.issue, 93791);
  assert.equal(rasured.rasured, true);
  assert.equal(classify(wipe), "wholesale-wipe");
  assert.equal(classify(blank), "blank-claude-json");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("stubs-settings.json")), "stubs-settings");
  assert.equal(classify(readData("secrets-lost.json")), "secrets-lost");
  assert.equal(classify(readData("backup-stamp.json")), "backup-stamp");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("intact"));
  assert.ok(CHIPS.includes("rasured"));
  assert.ok(CHIPS.includes("rasure"));
  assert.ok(CHIPS.includes("creation-time-flip"));
  assert.ok(CHIPS.includes("wholesale-wipe"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("rasured"));
  assert.ok(ALARM.includes("creation-time-flip"));
  assert.ok(ALARM.includes("wholesale-wipe"));
  assert.ok(ALARM.includes("rasure"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published rasure walk scores rasure after the idle hold", () => {
  const booth = scoreWalk({ rows: RASURE_WALK });
  assert.equal(booth.verdict, "rasure");
  assert.ok(booth.rasuredCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-intact");
  assert.equal(idle.intact, true);
  assert.equal(idle.verdict, "intact");
  const wipe = booth.rows.find((row) => row.event === "wholesale-wipe");
  assert.equal(wipe.wholesaleWipe, true);
  const path = booth.rows.find((row) => row.event === "creation-time-flip" && row.t === "path");
  assert.equal(path.verdict, "creation-time-flip");
});

test("RASURE_WALK constant matches the issue leaf walk", () => {
  assert.equal(RASURE_WALK[0].event, "cue-intact");
  const wipe = RASURE_WALK.find((row) => row.event === "wholesale-wipe");
  assert.equal(wipe.wholesaleWipe, true);
  const path = RASURE_WALK.find((row) => row.t === "path");
  assert.equal(path.rasured, true);
  const scoreRow = RASURE_WALK.find((row) => row.event === "rasure");
  assert.equal(scoreRow.rasured, true);
});

test("positive control CreationTime-stable stays intact", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "intact");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "intact");
  const hold = walk.rows.find((row) => row.event === "cue-intact");
  assert.equal(hold.intact, true);
  assert.equal(hold.verdict, "intact");
});

test("issue constants encode only #93791 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93791);
  assert.ok(ISSUE_URL.includes("93791"));
  assert.match(TITLE, /~\/\.claude/i);
  assert.match(TITLE, /wiped|recreated|41415|34330/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("data-loss"));
  assert.equal(PLATFORM, "windows");
  assert.equal(OS_NAME, "Windows 11 Pro");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.equal(PREV_VERSION, "2.1.268");
  assert.match(INSTALL, /~\/\.local\/bin\/claude/);
  assert.match(SURFACE, /Windows 11 Pro/);
  assert.equal(CONFIG_DIR, "~/.claude");
  assert.equal(INCIDENT_COUNT, 4);
  assert.equal(INCIDENT_3_AT, "2026-09-12 07:29:35");
  assert.match(INCIDENT_4_AT, /09:28/);
  assert.equal(TRANSCRIPT_COUNT_3, 7462);
  assert.equal(SECRETS_COUNT, 19);
  assert.equal(RASURE_LEAVES.length, 4);
  assert.ok(RULED_OUT.some((row) => /scheduled task|OneDrive|startup|auto-update/i.test(row)));
  assert.ok(EXPECTED.some((row) => /cloud-sync|merge|41415/i.test(row)));
  assert.match(DISTRIBUTION, /CreationTime|7,462|secrets\/|2\.1\.269|four times/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("creation-time-flip"));
  assert.ok(FINGERPRINT_LINES.includes("rasured"));
  assert.equal(PHRASE, "Score rasure or admit intact.");
  assert.equal(SAMPLE_LEAF.creationTimeFlipped, true);
  assert.equal(SAMPLE_INTACT_LEAF.creationTimeFlipped, false);
  assert.equal(SAMPLE_JSON.blank, true);
  assert.equal(SAMPLE_SETTINGS.stub, true);
  assert.equal(SAMPLE_SECRETS.lost, true);
  assert.equal(SAMPLE_BACKUP.stamped, true);
});

test("has-repro fingerprints encode the published rasured leaf", () => {
  const result = handle(seedRasured());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.surface, /Windows 11 Pro|2\.1\.269/);
  assert.equal(result.published.configDir, "~/.claude");
  assert.match(
    fingerprint(seedRasured()),
    /rasure\|leaf=new\|ctime=flipped\|json=blank\|settings=stub\|path=creation-time-flip\|cue=creation-time-flip/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Ashpan and Outrider", () => {
  const required = [
    "swept",
    "ashpanned",
    "ashpan",
    "orphan-jsonl",
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
  assert.ok(!FORBIDDEN_IDLE.includes("intact"));
});

test("intact booth flips rasured back when the leaf stays", () => {
  const tape = {
    intact: true,
    rasured: false,
    creationTimeFlip: false,
    cue: "intact",
  };
  assert.equal(scoreGate(tape).verdict, "intact");
  tape.intact = false;
  tape.rasured = true;
  tape.creationTimeFlip = true;
  tape.wholesaleWipe = true;
  tape.blankClaudeJson = true;
  tape.cue = "rasured";
  assert.equal(scoreGate(tape).verdict, "rasure");
  tape.intact = true;
  tape.rasured = false;
  tape.creationTimeFlip = false;
  tape.wholesaleWipe = false;
  tape.blankClaudeJson = false;
  tape.cue = "intact";
  assert.equal(scoreGate(tape).verdict, "intact");
});

test("leaf, json, settings, secrets, backup, and readBooth mark the rasured leaf", () => {
  const idle = inspectLeaf({
    intact: true,
    creationTimeFlip: false,
    leaf: { creationTimeFlipped: false },
  });
  assert.equal(idle.stamp, "leaf-held");
  const json = inspectClaudeJson({ rasured: true, blankClaudeJson: true });
  assert.equal(json.stamp, "json-blank");
  assert.equal(json.blank, true);
  const settings = inspectSettings({
    stubsSettings: true,
    settings: SAMPLE_SETTINGS,
  });
  assert.equal(settings.stamp, "hooks-missing");
  const secrets = inspectSecrets({ rasured: true, secretsLost: true });
  assert.equal(secrets.stamp, "secrets-lost");
  const backup = inspectBackup({ rasured: true, backupStamp: true });
  assert.equal(backup.stamp, "backup-stamp");
  const booth = readBooth({
    rasured: true,
    creationTimeFlip: true,
    leaf: SAMPLE_LEAF,
    json: SAMPLE_JSON,
  });
  assert.equal(booth.rasured, true);
  assert.equal(booth.mark, "rasured");
  const open = readBooth({
    intact: true,
    rasured: false,
    creationTimeFlip: false,
  });
  assert.equal(open.rasured, false);
  assert.equal(open.mark, "intact");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 41415);
  assert.equal(COUSINS[1].issue, 34330);
  assert.equal(COUSINS[2].issue, 70052);
  assert.equal(COUSINS[3].issue, 54092);
  assert.equal(COUSINS[4].issue, 93742);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /41415|agents|clears|rebuild/i);
  assert.match(COUSINS[1].why, /34330|skills|300ms/i);
  assert.match(COUSINS[2].why, /70052|transcripts/i);
  assert.match(COUSINS[3].why, /54092|transcripts/i);
  assert.match(COUSINS[4].why, /93742|settings|rewrite|recreate/i);
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
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
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93788);
  assert.equal(BACKUPS[1].issue, 93766);
  assert.equal(BACKUPS[2].issue, 93764);
  assert.equal(BACKUPS[3].issue, 93754);
  assert.equal(BACKUPS[4].issue, 93751);
  assert.equal(BACKUPS[5].issue, 93744);
  assert.equal(BACKUPS[6].issue, 93772);
  assert.equal(BACKUPS[7].issue, 93770);
  assert.equal(BACKUPS[8].issue, 93777);
  assert.equal(BACKUPS[9].issue, 93782);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/rasured.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const intactFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/intact.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(intactFix.status, 0, intactFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "intact");
  assert.equal(JSON.parse(seeded.stdout).verdict, "rasured");
  assert.equal(JSON.parse(intactFix.stdout).verdict, "intact");
});

test("handle exposes published hypothesis and #93791 headline", () => {
  const result = handle(seedRasured());
  assert.equal(result.published.issue, 93791);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [41415, 34330, 70052, 54092, 93742]);
  assert.ok(result.published.backups.includes(93788));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(!result.published.backups.includes(93791));
  assert.ok(!result.published.backups.includes(93780));
  assert.match(result.published.hypothesis, /cloud-sync|repair|merge|41415/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93791/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a parchment rasure scriptorium booth, not ashpan or outrider", () => {
  const page = readPage();
  assert.match(page, /Crimson Pro|Crimson\+Pro/);
  assert.match(page, /Manrope/);
  assert.match(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.match(page, /rasure|rasured|scriptorium|creation-time-flip|parchment/i);
  assert.match(page, /#F4ECD8|#1C1917|#C4B8A0|#7A1F1F|#8B7355|#2A2520/i);
  assert.match(page, /\bintact\b/);
  assert.match(page, /\brasured\b/);
  assert.match(page, /creation-time-flip/);
  assert.match(page, /Score rasure or admit intact/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#312/);
  assert.match(page, /#93791/);
  assert.match(page, /Hold the parchment/);
  assert.match(page, /Score rasure/);
  assert.match(page, /Walk the creation-time-flip/);
  assert.match(page, /Compare intact \/ rasured/);
  assert.match(page, /Pin idle intact/);
  assert.match(page, /Pin seeded rasured/);
  assert.match(page, /Pin creation-time-flip/);
  assert.match(page, /Hold the intact/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
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
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#1A1A1A/);
  assert.doesNotMatch(page, /#9A9A94/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#8B4513/);
  assert.doesNotMatch(page, /#0B1C2C/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /#C4A574/);
  assert.doesNotMatch(page, /industrial grate|ash pan tray|ember glow|foundry blotter/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch|needs-auth branding/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk|torn census/i);
  assert.doesNotMatch(page, /blank nameplate|UIA Name|sendIcon|WCAG 4\.1\.2/i);
  assert.doesNotMatch(page, /pledged heir|court ledger|cradle-swap|fairy-gold|swaddling/i);
  assert.doesNotMatch(page, /lemma slip|lexicographer|shelf mark|orphan quire/i);
  assert.doesNotMatch(page, /composing stick|wet-proof|wet proof|unbound-signature|pull press|type-rail|galley-bed/i);
  assert.doesNotMatch(page, /chancery|scrolled-rescript|lectern/i);
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
  assert.doesNotMatch(page, /\bswept\b/);
  assert.doesNotMatch(page, /\bashpanned\b/);
  assert.doesNotMatch(page, /orphan-jsonl/);
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
  assert.match(page, /NOT Ashpan/i);
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
  assert.match(readme, /Rasure/);
  assert.match(readme, /#93791/);
  assert.match(readme, /\bintact\b/);
  assert.match(readme, /\brasured\b/);
  assert.match(readme, /creation-time-flip/);
  assert.match(readme, /Crimson Pro/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Ashpan/i);
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
  assert.match(readme, /#41415/);
  assert.match(readme, /#34330/);
  assert.match(readme, /#70052/);
  assert.match(readme, /#54092/);
  assert.match(readme, /#93742/);
  assert.match(readme, /CreationTime|~\/\.claude|2\.1\.269|secrets\/|7,462/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/rasure/);
  assert.match(readme, /node --test projects\/rasure\/rasure\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /rasure|scriptorium|parchment/i);
  assert.match(readme, /Score rasure or admit intact/);
  assert.match(readme, /#93788|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782/);
  assert.match(readme, /18:50/);
});

test("catalog features Rasure only; Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 312);
  assert.equal(hub.products.length, 312);
  assert.equal(catalog.products[0].name, "Rasure");
  assert.equal(catalog.products[0].slug, "rasure");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/rasure/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /18:50 rasure|#93791|parchment rasure|scriptorium/i);
  assert.match(catalog.products[0].summary, /\bintact\b/);
  assert.match(catalog.products[0].summary, /\brasured\b/);
  assert.match(catalog.products[0].summary, /creation-time-flip/);
  assert.match(catalog.products[0].summary, /Score rasure or admit intact/);
  assert.equal(hub.products[0].slug, "rasure");
  assert.equal(hub.products[0].featured, true);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  const outrider = catalog.products.find((row) => row.slug === "outrider");
  assert.ok(outrider);
  assert.equal(outrider.featured, false);
  const necrology = catalog.products.find((row) => row.slug === "necrology");
  assert.ok(necrology);
  assert.equal(necrology.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "rasure").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93791") && row.slug !== "rasure"));
});

test("vercel rewrites rasure to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/rasure");
  assert.equal(vercel.rewrites[0].destination, "/projects/rasure");
  assert.equal(vercel.rewrites[1].source, "/rasure/");
  assert.equal(vercel.rewrites[1].destination, "/projects/rasure");
  assert.equal(vercel.rewrites[2].source, "/rasure/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/rasure/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
