import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CANARD_WALK,
  CHIPS,
  CLAUDE_VERSION,
  COMMAND,
  COUSINS,
  DISTRIBUTION,
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
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CANARDED_DESK,
  SAMPLE_MUSL,
  SAMPLE_ONEDRIVE,
  SAMPLE_SPAWN,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectMuslMislabel,
  inspectOnedriveCwd,
  inspectSpawnEnoent,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCanard,
  seedCanarded,
  seedCandid,
  seedHold,
  seedMuslMislabel,
  seedOnedriveCwd,
  seedOnedriveCwdMislabel,
  seedSpawnEnoent,
} from "./canard.mjs";

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
  return fileURLToPath(new URL("./canard.mjs", import.meta.url));
}

test("idle candid is a hold; ENOENT / cwd stay honest", () => {
  const result = analyze(seedCandid());
  assert.equal(result.verdict, "candid");
  assert.equal(result.idleWord, "candid");
  assert.equal(IDLE_WORD, "candid");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.candid, true);
  assert.equal(result.phrase, "admit candid");
  assert.equal(result.canarded, false);
  assert.equal(result.onedriveCwdMislabel, false);
  assert.ok(HOLD_ALIASES.includes("candid"));
  assert.ok(HOLD_ALIASES.includes("honest-spawn"));
  assert.ok(HOLD_ALIASES.includes("plain-enoent"));
  assert.ok(HOLD_ALIASES.includes("windows-honest"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify candid", () => {
  assert.equal(classify(emptyTicket()), "candid");
  assert.equal(classify(""), "candid");
  assert.equal(classify(null), "candid");
  assert.equal(decide({}), "candid");
});

test("#93766 seeded path scores canard when musl/glibc mislabels spawn ENOENT", () => {
  const result = analyze(seedCanarded());
  assert.equal(result.verdict, "canard");
  assert.equal(result.seededWord, "canarded");
  assert.equal(SEEDED_WORD, "canarded");
  assert.equal(PRODUCT_WORD, "canard");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.canarded, true);
  assert.equal(result.phrase, "score canard");
  assert.equal(result.onedriveCwdMislabel, true);
  assert.equal(result.spawnEnoent, true);
  assert.equal(result.muslMislabel, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("spawn ENOENT plus musl mislabel is the #93766 canard", () => {
  const spawn = inspectSpawnEnoent({ canarded: true, spawnEnoent: true });
  assert.equal(spawn.stamp, "spawn-enoent");
  assert.equal(spawn.enoent, true);
  const scored = scoreGate({
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    onedriveCwd: true,
    cue: "canarded",
    spawn: SAMPLE_SPAWN,
    musl: SAMPLE_MUSL,
    cwd: SAMPLE_ONEDRIVE,
  });
  assert.equal(scored.verdict, "canard");
  assert.equal(scored.onedriveCwdMislabel, true);
  const open = inspectSpawnEnoent({ candid: true, spawnEnoent: false });
  assert.equal(open.stamp, "spawn-ok");
});

test("path word is onedrive-cwd-mislabel; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "onedrive-cwd-mislabel");
  const result = analyze(seedOnedriveCwdMislabel());
  assert.equal(result.verdict, "onedrive-cwd-mislabel");
  assert.equal(result.pathWord, "onedrive-cwd-mislabel");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "onedrive-cwd-mislabel", preferSeed: true, canarded: true }),
    "onedrive-cwd-mislabel",
  );
  assert.equal(classify(seedSpawnEnoent()), "spawn-enoent");
});

test("HOLD includes candid / hold", () => {
  assert.ok(HOLD.includes("candid"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: spawn-enoent, musl-mislabel, onedrive-cwd", () => {
  assert.equal(classify(seedSpawnEnoent()), "spawn-enoent");
  assert.equal(classify(seedMuslMislabel()), "musl-mislabel");
  assert.equal(classify(seedOnedriveCwd()), "onedrive-cwd");
  assert.equal(classify(seedCanard()), "canard");
});

test("booth fixtures flip candid vs canarded vs onedrive-cwd-mislabel vs canard", () => {
  const idle = scoreGate(seedCandid());
  const seeded = scoreGate(seedCanarded());
  const candid = readData("candid.json");
  const canarded = readData("canarded.json");
  const path = readData("onedrive-cwd-mislabel.json");
  const product = readData("canard.json");
  const spawn = readData("spawn-enoent.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "candid");
  assert.equal(seeded.verdict, "canard");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCandid()), "candid");
  assert.equal(score(seedCanarded()), "canard");
  assert.equal(candid.spawnEnoent, false);
  assert.equal(candid.candid, true);
  assert.equal(scoreGate(candid).verdict, "candid");
  assert.equal(canarded.onedriveCwdMislabel, true);
  assert.equal(canarded.spawnEnoent, true);
  assert.equal(canarded.muslMislabel, true);
  assert.equal(classify(canarded), "canarded");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /ENOENT|cwd|honest|spawn/i);
  assert.match(path.paths[1].result, /musl|glibc|ENOENT|OneDrive/i);
  assert.equal(classify(path), "onedrive-cwd-mislabel");
  assert.equal(classify(product), "canard");
  assert.equal(product.hubCount, "CANARD");
  assert.equal(canarded.issue, 93766);
  assert.equal(canarded.canarded, true);
  assert.equal(classify(spawn), "spawn-enoent");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("musl-mislabel.json")), "musl-mislabel");
  assert.equal(classify(readData("onedrive-cwd.json")), "onedrive-cwd");
  assert.equal(classify(readData("honest-spawn.json")), "honest-spawn");
  assert.equal(classify(readData("plain-enoent.json")), "plain-enoent");
  assert.equal(classify(readData("windows-honest.json")), "windows-honest");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("candid"));
  assert.ok(CHIPS.includes("canarded"));
  assert.ok(CHIPS.includes("canard"));
  assert.ok(CHIPS.includes("onedrive-cwd-mislabel"));
  assert.ok(CHIPS.includes("spawn-enoent"));
  assert.ok(CHIPS.includes("musl-mislabel"));
  assert.ok(CHIPS.includes("onedrive-cwd"));
  assert.ok(CHIPS.includes("honest-spawn"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("canarded"));
  assert.ok(ALARM.includes("onedrive-cwd-mislabel"));
  assert.ok(ALARM.includes("spawn-enoent"));
  assert.ok(ALARM.includes("canard"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published canard walk scores canard after the idle hold", () => {
  const booth = scoreWalk({ rows: CANARD_WALK });
  assert.equal(booth.verdict, "canard");
  assert.ok(booth.canardedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-candid");
  assert.equal(idle.candid, true);
  assert.equal(idle.verdict, "candid");
  const spawn = booth.rows.find((row) => row.event === "spawn-enoent");
  assert.equal(spawn.spawnEnoent, true);
  const path = booth.rows.find((row) => row.event === "onedrive-cwd-mislabel" && row.t === "path");
  assert.equal(path.verdict, "onedrive-cwd-mislabel");
});

test("CANARD_WALK constant matches the issue press-room walk", () => {
  assert.equal(CANARD_WALK[0].event, "cue-candid");
  const spawn = CANARD_WALK.find((row) => row.event === "spawn-enoent");
  assert.equal(spawn.spawnEnoent, true);
  const path = CANARD_WALK.find((row) => row.t === "path");
  assert.equal(path.canarded, true);
  const scoreRow = CANARD_WALK.find((row) => row.event === "canard");
  assert.equal(scoreRow.canarded, true);
});

test("positive control honest-spawn stays candid", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "candid");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "candid");
  const hold = walk.rows.find((row) => row.event === "cue-candid");
  assert.equal(hold.candid, true);
  assert.equal(hold.verdict, "candid");
});

test("issue constants encode only #93766 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93766);
  assert.ok(ISSUE_URL.includes("93766"));
  assert.match(TITLE, /OneDrive|musl|glibc|spawn|VS Code/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.match(GOOD_VERSION, /ENOENT|Projects\\test|musl|glibc/i);
  assert.equal(SURFACE, "vscode-extension");
  assert.equal(HOST, "windows");
  assert.match(INSTALL_PATH, /claude\.exe|native-binary/i);
  assert.match(COMMAND, /OneDrive|VS Code|Claude Code panel/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:ide",
    "platform:vscode",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /Antivirus|Defender/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /--version|standalone/i.test(row)));
  assert.ok(EXPECTED.some((row) => /ENOENT|musl|glibc|OneDrive|Dropbox/i.test(row)));
  assert.match(DISTRIBUTION, /OneDrive|ENOENT|musl|glibc|2\.1\.269|C:\\Projects\\test|claudeProcessWrapper/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("onedrive-cwd-mislabel"));
  assert.ok(FINGERPRINT_LINES.includes("canarded"));
  assert.equal(PHRASE, "Score canard or admit candid.");
  assert.equal(SAMPLE_CANARDED_DESK.muslMislabel, true);
  assert.equal(SAMPLE_SPAWN.enoent, true);
  assert.equal(SAMPLE_MUSL.muslHeadline, true);
  assert.equal(SAMPLE_ONEDRIVE.cloudSync, true);
});

test("has-repro fingerprints encode the published canarded desk", () => {
  const result = handle(seedCanarded());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "vscode-extension");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedCanarded()),
    /canard\|spawn=enoent\|label=musl\|cwd=onedrive\|path=onedrive-cwd-mislabel\|cue=onedrive-cwd-mislabel/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Stet, Blindside, Interdict, Simplex, Deadkey", () => {
  const required = [
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
    "duplex",
    "simplexed",
    "simplex",
    "mobile-uplink-silent",
    "keyed",
    "deadkeyed",
    "deadkey",
    "esc-csi-dead",
    "gleaned",
    "orphaned",
    "gleaner",
    "unreaped-ampersand",
    "live",
    "schismed",
    "schism",
    "resume-while-live",
    "intact",
    "rasured",
    "rasure",
    "creation-time-flip",
    "swept",
    "ashpanned",
    "ashpan",
    "orphan-jsonl",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("candid booth flips canarded back when the wire stays honest", () => {
  const tape = {
    candid: true,
    canarded: false,
    spawnEnoent: false,
    cue: "candid",
  };
  assert.equal(scoreGate(tape).verdict, "candid");
  tape.candid = false;
  tape.canarded = true;
  tape.onedriveCwdMislabel = true;
  tape.spawnEnoent = true;
  tape.muslMislabel = true;
  tape.cue = "canarded";
  assert.equal(scoreGate(tape).verdict, "canard");
  tape.candid = true;
  tape.canarded = false;
  tape.onedriveCwdMislabel = false;
  tape.spawnEnoent = false;
  tape.muslMislabel = false;
  tape.cue = "candid";
  assert.equal(scoreGate(tape).verdict, "candid");
});

test("spawn, musl, cwd, and readBooth mark the canarded desk", () => {
  const idle = inspectSpawnEnoent({
    candid: true,
    spawn: { enoent: false, exeExists: true, standaloneWorks: true, launched: true },
  });
  assert.equal(idle.stamp, "spawn-ok");
  const musl = inspectMuslMislabel({ canarded: true, musl: SAMPLE_MUSL });
  assert.equal(musl.stamp, "musl-mislabel");
  assert.equal(musl.muslHeadline, true);
  const cwd = inspectOnedriveCwd({
    onedriveCwd: true,
    cwd: SAMPLE_ONEDRIVE,
  });
  assert.equal(cwd.stamp, "onedrive-cwd");
  const booth = readBooth({
    canarded: true,
    spawnEnoent: true,
    spawn: SAMPLE_SPAWN,
    musl: SAMPLE_MUSL,
    cwd: SAMPLE_ONEDRIVE,
  });
  assert.equal(booth.canarded, true);
  assert.equal(booth.mark, "canarded");
  const open = readBooth({
    candid: true,
    canarded: false,
    spawnEnoent: false,
  });
  assert.equal(open.canarded, false);
  assert.equal(open.mark, "candid");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("sostenuto"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("tabula"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93764);
  assert.equal(BACKUPS[1].issue, 93754);
  assert.equal(BACKUPS[2].issue, 93744);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93821);
  assert.equal(BACKUPS[5].issue, 93811);
  assert.equal(BACKUPS[6].issue, 93809);
  assert.equal(BACKUPS[7].issue, 93751);
  assert.equal(BACKUPS[8].issue, 93772);
  assert.equal(BACKUPS[9].issue, 93770);
  assert.equal(BACKUPS[10].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93766));
  assert.ok(!BACKUPS.some((row) => row.issue === 93778));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/canarded.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const candidFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/candid.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(candidFix.status, 0, candidFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const candidOut = JSON.parse(candidFix.stdout);
  assert.equal(idleOut.verdict, "candid");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "canarded");
  assert.equal(seededOut.alarm, true);
  assert.equal(candidOut.verdict, "candid");
  assert.equal(candidOut.hold, true);
});

test("handle exposes published hypothesis and #93766 headline", () => {
  const result = handle(seedCanarded());
  assert.equal(result.published.issue, 93766);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(result.published.backups.includes(93821));
  assert.ok(!result.published.backups.includes(93766));
  assert.ok(!result.published.backups.includes(93778));
  assert.match(result.published.hypothesis, /OneDrive|ENOENT|musl|glibc|reparse/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93766/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a press-room / newspaper-canard booth, not stet or blindside", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /DM Sans|DM\+Sans/);
  assert.match(page, /Roboto Mono|Roboto\+Mono/);
  assert.match(page, /canard|candid|canarded|onedrive-cwd-mislabel|press-room|newspaper|ENOENT|musl|glibc/i);
  assert.match(page, /#E4D4A4|#1F1810|#8B241C|#3E6F96|#A67C2A|#3F5C3A/i);
  assert.match(page, /\bcandid\b/);
  assert.match(page, /\bcanarded\b/);
  assert.match(page, /onedrive-cwd-mislabel/);
  assert.match(page, /Score canard or admit candid/i);
  assert.match(page, /cousin-not-primary|no numbered cousins/i);
  assert.match(page, /#320/);
  assert.match(page, /#93766/);
  assert.match(page, /Admit candid/);
  assert.match(page, /Score canard/);
  assert.match(page, /Walk onedrive-cwd-mislabel/);
  assert.match(page, /Compare candid \/ canarded/);
  assert.match(page, /Pin idle candid/);
  assert.match(page, /Pin seeded canarded/);
  assert.match(page, /Pin onedrive-cwd-mislabel/);
  assert.match(page, /Hold the candid/);
  assert.match(page, /OneDrive|ENOENT|musl|glibc|VS Code|2\.1\.269|C:\\Projects\\test/i);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Bebas Neue|Bebas\+Neue/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#2B5EA7/);
  assert.doesNotMatch(page, /#B33A3A/);
  assert.doesNotMatch(page, /#0B1F14/);
  assert.doesNotMatch(page, /#F0A202/);
  assert.doesNotMatch(page, /#1A0B18/);
  assert.doesNotMatch(page, /#041018/);
  assert.doesNotMatch(page, /#4CFF9A/);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /\bstetted\b/);
  assert.doesNotMatch(page, /\brewound\b/);
  assert.doesNotMatch(page, /mic-resume-wipe/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bblindsided\b/);
  assert.doesNotMatch(page, /compare-ref-unreachable/);
  assert.doesNotMatch(page, /\bscoped\b/);
  assert.doesNotMatch(page, /\binterdicted\b/);
  assert.doesNotMatch(page, /chrome-prohibit-bleed/);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Canard/);
  assert.match(readme, /#93766/);
  assert.match(readme, /\bcandid\b/);
  assert.match(readme, /\bcanarded\b/);
  assert.match(readme, /onedrive-cwd-mislabel/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /Roboto Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /OneDrive|ENOENT|musl|glibc/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/canard/);
  assert.match(readme, /node --test projects\/canard\/canard\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /canard|press-room|newspaper|ENOENT/i);
  assert.match(readme, /Score canard or admit candid/);
  assert.match(readme, /#93764|#93754|#93744|#93782|#93821|#93811|#93809|#93751|#93772|#93770|#93777/);
  assert.match(readme, /02:50/);
});

test("catalog features Canard only; Stet, Blindside, Interdict, Simplex, Deadkey unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 320);
  assert.equal(hub.products.length, 320);
  assert.equal(catalog.products[0].name, "Canard");
  assert.equal(catalog.products[0].slug, "canard");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/canard/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /02:50 canard|#93766|press-room|newspaper-canard/i);
  assert.match(catalog.products[0].summary, /\bcandid\b/);
  assert.match(catalog.products[0].summary, /\bcanarded\b/);
  assert.match(catalog.products[0].summary, /onedrive-cwd-mislabel/);
  assert.match(catalog.products[0].summary, /Score canard or admit candid/);
  assert.equal(hub.products[0].slug, "canard");
  assert.equal(hub.products[0].featured, true);
  const stet = catalog.products.find((row) => row.slug === "stet");
  assert.ok(stet);
  assert.equal(stet.featured, false);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  const simplex = catalog.products.find((row) => row.slug === "simplex");
  assert.ok(simplex);
  assert.equal(simplex.featured, false);
  const deadkey = catalog.products.find((row) => row.slug === "deadkey");
  assert.ok(deadkey);
  assert.equal(deadkey.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "canard").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93766") && row.slug !== "canard"));
});

test("vercel rewrites canard to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/canard");
  assert.equal(vercel.rewrites[0].destination, "/projects/canard");
  assert.equal(vercel.rewrites[1].source, "/canard/");
  assert.equal(vercel.rewrites[1].destination, "/projects/canard");
  assert.equal(vercel.rewrites[2].source, "/canard/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/canard/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
