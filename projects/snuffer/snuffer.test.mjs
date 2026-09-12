import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ABSENT_BUILDS,
  ALARM,
  ARTIFACT_ELIGIBLE,
  ARTIFACT_ENV,
  ARTIFACT_KEY,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COUPLING,
  COUSINS,
  DISTRIBUTION,
  ENV_UPDATE,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_WORKING,
  NOT_PRODUCTS,
  OS_LABEL,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRESENT_BUILDS,
  PRODUCT_WORD,
  REGRESSION_BUILD,
  RULED_OUT,
  SAMPLE_DOOR,
  SAMPLE_FLAME,
  SAMPLE_GANG,
  SAMPLE_TAPER,
  SAMPLE_TENGU,
  SCRATCHPAD_LINE,
  SEEDED_WORD,
  SESSION_KIND,
  SETTINGS_PATH,
  SHELL_LABEL,
  SNUFFER_PLAQUES,
  SNUFFER_WALK,
  STATE,
  SURFACE,
  TENGU_DEFAULT,
  TENGU_FLAG,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDoor,
  inspectFlame,
  inspectGang,
  inspectTaper,
  inspectTengu,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedArtifactGate,
  seedDecoupleGates,
  seedEnableArtifactFalse,
  seedEnvironmentUpdate,
  seedGangedOr,
  seedHold,
  seedLit,
  seedOneWayDoor,
  seedRegression186,
  seedScratchpadLine,
  seedSnuffed,
  seedSnuffer,
  seedTenguScratch,
} from "./snuffer.mjs";

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
  return fileURLToPath(new URL("./snuffer.mjs", import.meta.url));
}

test("idle lit is a hold; scratchpad directory still announced", () => {
  const result = analyze(seedLit());
  assert.equal(result.verdict, "lit");
  assert.equal(result.idleWord, "lit");
  assert.equal(IDLE_WORD, "lit");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.lit, true);
  assert.equal(result.phrase, "admit lit");
  assert.equal(result.snuffed, false);
  assert.equal(result.gangedOr, false);
  assert.equal(result.decoupleGates, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify lit", () => {
  assert.equal(classify(emptyTicket()), "lit");
  assert.equal(classify(""), "lit");
  assert.equal(classify(null), "lit");
  assert.equal(decide({}), "lit");
});

test("#93746 seeded path scores snuffer when the taper is snuffed", () => {
  const result = analyze(seedSnuffed());
  assert.equal(result.verdict, "snuffer");
  assert.equal(result.seededWord, "snuffed");
  assert.equal(SEEDED_WORD, "snuffed");
  assert.equal(PRODUCT_WORD, "snuffer");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.snuffed, true);
  assert.equal(result.phrase, "score snuffer");
  assert.equal(result.tenguScratch, true);
  assert.equal(result.oneWayDoor, true);
  assert.equal(result.environmentUpdate, true);
  assert.equal(result.gangedOr, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("tengu-scratch plus one-way-door is the #93746 snuffer", () => {
  const taper = inspectTaper({ snuffed: true, gangedOr: true });
  assert.equal(taper.stamp, "taper-gone");
  assert.equal(taper.gone, true);
  const scored = scoreGate({
    snuffed: true,
    tenguScratch: true,
    artifactGate: true,
    oneWayDoor: true,
    gangedOr: true,
    environmentUpdate: true,
    scratchpadLine: true,
    enableArtifactFalse: true,
    regression186: true,
    cue: "snuffed",
    taper: SAMPLE_TAPER,
    flame: SAMPLE_FLAME,
  });
  assert.equal(scored.verdict, "snuffer");
  assert.equal(scored.gangedOr, true);
  const open = inspectTaper({ lit: true, decoupleGates: true });
  assert.equal(open.stamp, "taper-announced");
});

test("path word is ganged-or; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "ganged-or");
  const result = analyze(seedGangedOr());
  assert.equal(result.verdict, "ganged-or");
  assert.equal(result.pathWord, "ganged-or");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "ganged-or", preferSeed: true, snuffed: true }),
    "ganged-or",
  );
  assert.equal(classify(seedOneWayDoor()), "one-way-door");
});

test("HOLD includes lit / hold", () => {
  assert.ok(HOLD.includes("lit"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: tengu-scratch, one-way-door, environment-update, regression-186", () => {
  assert.equal(classify(seedTenguScratch()), "tengu-scratch");
  assert.equal(classify(seedEnableArtifactFalse()), "enable-artifact-false");
  assert.equal(classify(seedRegression186()), "regression-186");
  assert.equal(classify(seedOneWayDoor()), "one-way-door");
  assert.equal(classify(seedEnvironmentUpdate()), "environment-update");
  assert.equal(classify(seedScratchpadLine()), "scratchpad-line");
  assert.equal(classify(seedArtifactGate()), "artifact-gate");
  assert.equal(classify(seedDecoupleGates()), "decouple-gates");
  assert.equal(classify(seedSnuffer()), "snuffer");
});

test("booth fixtures flip lit vs snuffed vs ganged-or vs snuffer", () => {
  const idle = scoreGate(seedLit());
  const seeded = scoreGate(seedSnuffed());
  const lit = readData("lit.json");
  const snuffed = readData("snuffed.json");
  const path = readData("ganged-or.json");
  const product = readData("snuffer.json");
  const tengu = readData("tengu-scratch.json");
  const door = readData("one-way-door.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "lit");
  assert.equal(seeded.verdict, "snuffer");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLit()), "lit");
  assert.equal(score(seedSnuffed()), "snuffer");
  assert.equal(lit.decoupleGates, true);
  assert.equal(lit.lit, true);
  assert.equal(scoreGate(lit).verdict, "lit");
  assert.equal(snuffed.tenguScratch, true);
  assert.equal(snuffed.oneWayDoor, true);
  assert.equal(snuffed.environmentUpdate, true);
  assert.equal(classify(snuffed), "snuffed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /own setting|enableArtifact/i);
  assert.match(path.paths[1].result, /2\.1\.186|isArtifactToolEligible/i);
  assert.equal(classify(path), "ganged-or");
  assert.equal(classify(product), "snuffer");
  assert.equal(product.hubCount, "SNUFFER");
  assert.equal(snuffed.issue, 93746);
  assert.equal(snuffed.snuffed, true);
  assert.equal(classify(tengu), "tengu-scratch");
  assert.equal(classify(door), "one-way-door");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("artifact-gate.json")), "artifact-gate");
  assert.equal(classify(readData("environment-update.json")), "environment-update");
  assert.equal(classify(readData("regression-186.json")), "regression-186");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("lit"));
  assert.ok(CHIPS.includes("snuffed"));
  assert.ok(CHIPS.includes("snuffer"));
  assert.ok(CHIPS.includes("ganged-or"));
  assert.ok(CHIPS.includes("tengu-scratch"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("snuffed"));
  assert.ok(ALARM.includes("ganged-or"));
  assert.ok(ALARM.includes("tengu-scratch"));
  assert.ok(ALARM.includes("snuffer"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published snuffer walk scores snuffer after the idle hold", () => {
  const booth = scoreWalk({ rows: SNUFFER_WALK });
  assert.equal(booth.verdict, "snuffer");
  assert.ok(booth.snuffedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-lit");
  assert.equal(idle.lit, true);
  assert.equal(idle.verdict, "lit");
  const falseKey = booth.rows.find((row) => row.event === "enable-artifact-false");
  assert.equal(falseKey.enableArtifactFalse, true);
  const path = booth.rows.find((row) => row.event === "ganged-or" && row.t === "path");
  assert.equal(path.verdict, "ganged-or");
});

test("SNUFFER_WALK constant matches the issue taper walk", () => {
  assert.equal(SNUFFER_WALK[0].event, "cue-lit");
  const falseKey = SNUFFER_WALK.find((row) => row.event === "enable-artifact-false");
  assert.equal(falseKey.enableArtifactFalse, true);
  const path = SNUFFER_WALK.find((row) => row.t === "path");
  assert.equal(path.snuffed, true);
  const scoreRow = SNUFFER_WALK.find((row) => row.event === "snuffer");
  assert.equal(scoreRow.snuffed, true);
});

test("positive control decouple-gates stays lit", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "lit");
  const ok = walk.rows.find((row) => row.event === "decouple-gates");
  assert.equal(ok.verdict, "lit");
  const hold = walk.rows.find((row) => row.event === "cue-lit");
  assert.equal(hold.lit, true);
  assert.equal(hold.verdict, "lit");
});

test("issue constants encode only #93746 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93746);
  assert.ok(ISSUE_URL.includes("93746"));
  assert.match(TITLE, /enableArtifact/i);
  assert.match(TITLE, /scratchpad/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(PLATFORM, "windows");
  assert.equal(CLAUDE_VERSION, "2.1.269");
  assert.equal(LAST_WORKING, "2.1.185");
  assert.equal(REGRESSION_BUILD, "2.1.186");
  assert.equal(TENGU_FLAG, "tengu_scratch");
  assert.equal(TENGU_DEFAULT, false);
  assert.equal(ARTIFACT_KEY, "enableArtifact");
  assert.equal(ARTIFACT_ENV, "CLAUDE_CODE_DISABLE_ARTIFACT");
  assert.equal(SETTINGS_PATH, "~/.claude/settings.json");
  assert.equal(SCRATCHPAD_LINE, "Scratchpad directory:");
  assert.match(ENV_UPDATE, /no longer available/);
  assert.match(COUPLING, /tengu_scratch/);
  assert.match(ARTIFACT_ELIGIBLE, /!br\(\)/);
  assert.ok(ABSENT_BUILDS.includes(185));
  assert.ok(PRESENT_BUILDS.includes(186));
  assert.ok(PRESENT_BUILDS.includes(269));
  assert.match(OS_LABEL, /Windows/);
  assert.match(SHELL_LABEL, /PowerShell/);
  assert.match(SURFACE, /Anthropic API/);
  assert.equal(SNUFFER_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /unrelated|opt-in|2\.1\.185|announced/i.test(row)));
  assert.ok(EXPECTED.some((row) => /own setting|tengu_scratch|one-way/i.test(row)));
  assert.match(DISTRIBUTION, /enableArtifact|tengu_scratch|2\.1\.186|Scratchpad directory/);
  assert.match(SESSION_KIND, /2\.1\.269|enableArtifact|PowerShell/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("ganged-or"));
  assert.ok(FINGERPRINT_LINES.includes("snuffed"));
  assert.match(PHRASE, /Score snuffer or admit lit/);
  assert.equal(SAMPLE_TAPER.gone, true);
  assert.equal(SAMPLE_FLAME.snuffed, true);
  assert.equal(SAMPLE_GANG.coupled, true);
  assert.equal(SAMPLE_TENGU.on, false);
  assert.equal(SAMPLE_DOOR.oneWay, true);
});

test("has-repro fingerprints encode the published snuffed snuffer", () => {
  const result = handle(seedSnuffed());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.sessionKind, /enableArtifact|2\.1\.269/);
  assert.equal(result.published.scratchpadLine, SCRATCHPAD_LINE);
  assert.match(
    fingerprint(seedSnuffed()),
    /snuffer\|taper=gone\|tengu=off\|door=one-way\|env=withdrawn\|path=ganged-or\|cue=ganged-or/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Changeling and Homograph", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("lit booth flips snuffed back when the taper stays announced", () => {
  const tape = {
    lit: true,
    snuffed: false,
    decoupleGates: true,
    cue: "lit",
  };
  assert.equal(scoreGate(tape).verdict, "lit");
  tape.lit = false;
  tape.snuffed = true;
  tape.tenguScratch = true;
  tape.oneWayDoor = true;
  tape.environmentUpdate = true;
  tape.cue = "snuffed";
  assert.equal(scoreGate(tape).verdict, "snuffer");
  tape.lit = true;
  tape.snuffed = false;
  tape.tenguScratch = false;
  tape.oneWayDoor = false;
  tape.environmentUpdate = false;
  tape.cue = "lit";
  assert.equal(scoreGate(tape).verdict, "lit");
});

test("taper, flame, gang, tengu, door, and readBooth mark the snuffed snuffer", () => {
  const idle = inspectTaper({
    lit: true,
    decoupleGates: true,
    taper: { announced: true, line: SCRATCHPAD_LINE, gone: false },
  });
  assert.equal(idle.stamp, "taper-announced");
  const flame = inspectFlame({ snuffed: true, flame: SAMPLE_FLAME });
  assert.equal(flame.stamp, "flame-snuffed");
  assert.equal(flame.snuffed, true);
  const gang = inspectGang({
    gangedOr: true,
    gang: SAMPLE_GANG,
  });
  assert.equal(gang.stamp, "gang-coupled");
  const tengu = inspectTengu({ snuffed: true, tenguScratch: true });
  assert.equal(tengu.stamp, "tengu-off");
  const door = inspectDoor({ snuffed: true, oneWayDoor: true });
  assert.equal(door.stamp, "door-one-way");
  const booth = readBooth({
    snuffed: true,
    tenguScratch: true,
    oneWayDoor: true,
    taper: SAMPLE_TAPER,
    flame: SAMPLE_FLAME,
  });
  assert.equal(booth.snuffed, true);
  assert.equal(booth.mark, "snuffed");
  const open = readBooth({
    lit: true,
    snuffed: false,
    decoupleGates: true,
  });
  assert.equal(open.snuffed, false);
  assert.equal(open.mark, "lit");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 87734);
  assert.equal(COUSINS[1].issue, 91395);
  assert.equal(COUSINS[2].issue, 92166);
  assert.equal(COUSINS[3].issue, 78013);
  assert.equal(COUSINS[4].issue, 80606);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /87734|CLAUDE_CODE_DISABLE_ARTIFACT|rebuild/i);
  assert.match(COUSINS[1].why, /91395|schema|deny/i);
  assert.match(COUSINS[2].why, /92166|scratchpad|tmp/i);
  assert.match(COUSINS[3].why, /78013|CLAUDE_SCRATCHPAD/i);
  assert.match(COUSINS[4].why, /80606|enableArtifact|claude -p/i);
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
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("homonym"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 93744);
  assert.equal(BACKUPS[1].issue, 93722);
  assert.equal(BACKUPS[2].issue, 93672);
  assert.equal(BACKUPS[3].issue, 93652);
  assert.equal(BACKUPS[4].issue, 93680);
  assert.equal(BACKUPS[5].issue, 93618);
  assert.equal(BACKUPS[6].issue, 93694);
  assert.equal(BACKUPS[7].issue, 93751);
  assert.equal(BACKUPS[8].issue, 93761);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /goal|evaluator/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/snuffed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const litFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lit.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(litFix.status, 0, litFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "lit");
  assert.equal(JSON.parse(seeded.stdout).verdict, "snuffed");
  assert.equal(JSON.parse(litFix.stdout).verdict, "lit");
});

test("handle exposes published hypothesis and #93746 headline", () => {
  const result = handle(seedSnuffed());
  assert.equal(result.published.issue, 93746);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [87734, 91395, 92166, 78013, 80606]);
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93672));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93761));
  assert.ok(!result.published.backups.includes(93746));
  assert.ok(!result.published.backups.includes(93757));
  assert.match(result.published.hypothesis, /tengu_scratch|isArtifactToolEligible|independent/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93746/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a candle-snuffer taper booth, not changeling or homograph", () => {
  const page = readPage();
  assert.match(page, /Playfair Display|Playfair\+Display/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /snuffer|taper|brass|wick|atelier/i);
  assert.match(page, /#F3E5C5|#1A1510|#B08D57|#C45C26|#FFF8EC/i);
  assert.match(page, /\blit\b/);
  assert.match(page, /\bsnuffed\b/);
  assert.match(page, /ganged-or/);
  assert.match(page, /Score snuffer or admit lit/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#307/);
  assert.match(page, /#93746/);
  assert.match(page, /Keep the taper lit/);
  assert.match(page, /Score snuffer/);
  assert.match(page, /Walk the wicks/);
  assert.match(page, /Compare lit \/ snuffed/);
  assert.match(page, /Pin idle lit/);
  assert.match(page, /Pin seeded snuffed/);
  assert.match(page, /Pin ganged-or/);
  assert.match(page, /Hold the lit/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#1B2A24/);
  assert.doesNotMatch(page, /#E8E2D4/);
  assert.doesNotMatch(page, /#C6A15B/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#2E2E2E/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /#DDD6C8/);
  assert.doesNotMatch(page, /#141210/);
  assert.doesNotMatch(page, /#C2301A/);
  assert.doesNotMatch(page, /#A67C3D/);
  assert.doesNotMatch(page, /#221F1B/);
  assert.doesNotMatch(page, /#3E4A42/);
  assert.doesNotMatch(page, /#F4EBD0/);
  assert.doesNotMatch(page, /#8B2E2E/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#9B2D2D/);
  assert.doesNotMatch(page, /#2B2F36/);
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
  assert.match(page, /NOT Quench/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Hasp/i);
  assert.match(page, /NOT Scuttle/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Snuffer/);
  assert.match(readme, /#93746/);
  assert.match(readme, /\blit\b/);
  assert.match(readme, /\bsnuffed\b/);
  assert.match(readme, /ganged-or/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /NOT Quench/i);
  assert.match(readme, /#87734/);
  assert.match(readme, /#91395/);
  assert.match(readme, /#92166/);
  assert.match(readme, /#78013/);
  assert.match(readme, /#80606/);
  assert.match(readme, /enableArtifact|tengu_scratch|2\.1\.186|Scratchpad directory/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/snuffer/);
  assert.match(readme, /node --test projects\/snuffer\/snuffer\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /candle-snuffer|taper booth|ganged OR|brass/i);
  assert.match(readme, /Score snuffer or admit lit/);
  assert.match(readme, /#93744|#93722|#93672|#93652|#93680|#93618|#93694|#93751|#93761/);
  assert.match(readme, /#93757/);
});

test("catalog features Snuffer only; Changeling unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 307);
  assert.equal(hub.products.length, 307);
  assert.equal(catalog.products[0].name, "Snuffer");
  assert.equal(catalog.products[0].slug, "snuffer");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/snuffer/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /snuffer|#93746|candle-snuffer|taper/i);
  assert.match(catalog.products[0].summary, /\blit\b/);
  assert.match(catalog.products[0].summary, /\bsnuffed\b/);
  assert.match(catalog.products[0].summary, /ganged-or/);
  assert.match(catalog.products[0].summary, /Score snuffer or admit lit/);
  assert.equal(hub.products[0].slug, "snuffer");
  assert.equal(hub.products[0].featured, true);
  const changeling = catalog.products.find((row) => row.slug === "changeling");
  assert.ok(changeling);
  assert.equal(changeling.featured, false);
  const homograph = catalog.products.find((row) => row.slug === "homograph");
  assert.ok(homograph);
  assert.equal(homograph.featured, false);
  const galley = catalog.products.find((row) => row.slug === "galley");
  assert.ok(galley);
  assert.equal(galley.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "snuffer").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93746") && row.slug !== "snuffer"));
});

test("vercel rewrites snuffer to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/snuffer");
  assert.equal(vercel.rewrites[0].destination, "/projects/snuffer");
  assert.equal(vercel.rewrites[1].source, "/snuffer/");
  assert.equal(vercel.rewrites[1].destination, "/projects/snuffer");
  assert.equal(vercel.rewrites[2].source, "/snuffer/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/snuffer/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
