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
  COUSINS,
  DEADKEY_WALK,
  DEAD_SEQUENCES,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PLATEN_STRIPS,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CATV,
  SAMPLE_DEADKEYED_PLATEN,
  SAMPLE_SILENT,
  SAMPLE_SINGLE_BYTE,
  SAMPLE_SWAP,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TERM,
  TITLE,
  TUI_FULLSCREEN_SINCE,
  VERDICTS,
  WORKAROUND,
  WORKING_BYTES,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBinarySwap,
  inspectCatV,
  inspectCsi,
  inspectFullscreen,
  inspectSilentFail,
  inspectSingleByte,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBinarySwap,
  seedCsiDown,
  seedCsiLeft,
  seedCsiRight,
  seedCsiUp,
  seedDeadkey,
  seedDeadkeyed,
  seedEscCsiDead,
  seedFullscreenTui,
  seedHold,
  seedHomeEnd,
  seedKeyed,
  seedSilentFail,
  seedSingleByteOk,
} from "./deadkey.mjs";

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
  return fileURLToPath(new URL("./deadkey.mjs", import.meta.url));
}

test("idle keyed is a hold; CSI keys act; cursor moves", () => {
  const result = analyze(seedKeyed());
  assert.equal(result.verdict, "keyed");
  assert.equal(result.idleWord, "keyed");
  assert.equal(IDLE_WORD, "keyed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.keyed, true);
  assert.equal(result.phrase, "admit keyed");
  assert.equal(result.deadkeyed, false);
  assert.equal(result.escCsiDead, false);
  assert.ok(HOLD_ALIASES.includes("keyed"));
  assert.ok(HOLD_ALIASES.includes("composed"));
  assert.ok(HOLD_ALIASES.includes("resolved"));
  assert.ok(HOLD_ALIASES.includes("cursor-moves"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify keyed", () => {
  assert.equal(classify(emptyTicket()), "keyed");
  assert.equal(classify(""), "keyed");
  assert.equal(classify(null), "keyed");
  assert.equal(decide({}), "keyed");
});

test("#93788 seeded path scores deadkey when ESC-CSI never resolve", () => {
  const result = analyze(seedDeadkeyed());
  assert.equal(result.verdict, "deadkey");
  assert.equal(result.seededWord, "deadkeyed");
  assert.equal(SEEDED_WORD, "deadkeyed");
  assert.equal(PRODUCT_WORD, "deadkey");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.deadkeyed, true);
  assert.equal(result.phrase, "score deadkey");
  assert.equal(result.escCsiDead, true);
  assert.equal(result.csiLeft, true);
  assert.equal(result.silentFail, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("CSI dead plus silent fail is the #93788 deadkey", () => {
  const csi = inspectCsi({ deadkeyed: true, csiLeft: true });
  assert.equal(csi.stamp, "csi-dead");
  assert.equal(csi.csiActs, false);
  const scored = scoreGate({
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    binarySwap: true,
    fullscreenTui: true,
    singleByteOk: true,
    cue: "deadkeyed",
    platen: SAMPLE_DEADKEYED_PLATEN,
    silent: SAMPLE_SILENT,
    swap: SAMPLE_SWAP,
  });
  assert.equal(scored.verdict, "deadkey");
  assert.equal(scored.escCsiDead, true);
  const open = inspectCsi({ keyed: true, csiLeft: false });
  assert.equal(open.stamp, "csi-resolves");
});

test("path word is esc-csi-dead; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "esc-csi-dead");
  const result = analyze(seedEscCsiDead());
  assert.equal(result.verdict, "esc-csi-dead");
  assert.equal(result.pathWord, "esc-csi-dead");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "esc-csi-dead", preferSeed: true, deadkeyed: true }),
    "esc-csi-dead",
  );
  assert.equal(classify(seedCsiLeft()), "csi-left");
});

test("HOLD includes keyed / hold", () => {
  assert.ok(HOLD.includes("keyed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: csi-left, csi-right, csi-up, csi-down, home-end, single-byte-ok, silent-fail, binary-swap, fullscreen-tui", () => {
  assert.equal(classify(seedCsiLeft()), "csi-left");
  assert.equal(classify(seedCsiRight()), "csi-right");
  assert.equal(classify(seedCsiUp()), "csi-up");
  assert.equal(classify(seedCsiDown()), "csi-down");
  assert.equal(classify(seedHomeEnd()), "home-end");
  assert.equal(classify(seedSingleByteOk()), "single-byte-ok");
  assert.equal(classify(seedSilentFail()), "silent-fail");
  assert.equal(classify(seedBinarySwap()), "binary-swap");
  assert.equal(classify(seedFullscreenTui()), "fullscreen-tui");
  assert.equal(classify(seedDeadkey()), "deadkey");
});

test("booth fixtures flip keyed vs deadkeyed vs esc-csi-dead vs deadkey", () => {
  const idle = scoreGate(seedKeyed());
  const seeded = scoreGate(seedDeadkeyed());
  const keyed = readData("keyed.json");
  const deadkeyed = readData("deadkeyed.json");
  const path = readData("esc-csi-dead.json");
  const product = readData("deadkey.json");
  const left = readData("csi-left.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "keyed");
  assert.equal(seeded.verdict, "deadkey");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedKeyed()), "keyed");
  assert.equal(score(seedDeadkeyed()), "deadkey");
  assert.equal(keyed.csiLeft, false);
  assert.equal(keyed.keyed, true);
  assert.equal(scoreGate(keyed).verdict, "keyed");
  assert.equal(deadkeyed.escCsiDead, true);
  assert.equal(deadkeyed.csiLeft, true);
  assert.equal(deadkeyed.silentFail, true);
  assert.equal(classify(deadkeyed), "deadkeyed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /CSI|ESC|2\.1\.268/i);
  assert.match(path.paths[1].result, /dead|silent|cursor/i);
  assert.equal(classify(path), "esc-csi-dead");
  assert.equal(classify(product), "deadkey");
  assert.equal(product.hubCount, "DEADKEY");
  assert.equal(deadkeyed.issue, 93788);
  assert.equal(deadkeyed.deadkeyed, true);
  assert.equal(classify(left), "csi-left");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("csi-right.json")), "csi-right");
  assert.equal(classify(readData("csi-up.json")), "csi-up");
  assert.equal(classify(readData("csi-down.json")), "csi-down");
  assert.equal(classify(readData("home-end.json")), "home-end");
  assert.equal(classify(readData("single-byte-ok.json")), "single-byte-ok");
  assert.equal(classify(readData("silent-fail.json")), "silent-fail");
  assert.equal(classify(readData("binary-swap.json")), "binary-swap");
  assert.equal(classify(readData("fullscreen-tui.json")), "fullscreen-tui");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("keyed"));
  assert.ok(CHIPS.includes("deadkeyed"));
  assert.ok(CHIPS.includes("deadkey"));
  assert.ok(CHIPS.includes("esc-csi-dead"));
  assert.ok(CHIPS.includes("csi-left"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("deadkeyed"));
  assert.ok(ALARM.includes("esc-csi-dead"));
  assert.ok(ALARM.includes("silent-fail"));
  assert.ok(ALARM.includes("deadkey"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published deadkey walk scores deadkey after the idle hold", () => {
  const booth = scoreWalk({ rows: DEADKEY_WALK });
  assert.equal(booth.verdict, "deadkey");
  assert.ok(booth.deadkeyedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-keyed");
  assert.equal(idle.keyed, true);
  assert.equal(idle.verdict, "keyed");
  const left = booth.rows.find((row) => row.event === "csi-left");
  assert.equal(left.csiLeft, true);
  const path = booth.rows.find((row) => row.event === "esc-csi-dead" && row.t === "path");
  assert.equal(path.verdict, "esc-csi-dead");
});

test("DEADKEY_WALK constant matches the issue platen walk", () => {
  assert.equal(DEADKEY_WALK[0].event, "cue-keyed");
  const left = DEADKEY_WALK.find((row) => row.event === "csi-left");
  assert.equal(left.csiLeft, true);
  const path = DEADKEY_WALK.find((row) => row.t === "path");
  assert.equal(path.deadkeyed, true);
  const scoreRow = DEADKEY_WALK.find((row) => row.event === "deadkey");
  assert.equal(scoreRow.deadkeyed, true);
});

test("positive control CSI resolve stays keyed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "keyed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "keyed");
  const hold = walk.rows.find((row) => row.event === "cue-keyed");
  assert.equal(hold.keyed, true);
  assert.equal(hold.verdict, "keyed");
});

test("issue constants encode only #93788 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93788);
  assert.ok(ISSUE_URL.includes("93788"));
  assert.match(TITLE, /2\.1\.269|ESC-sequence|arrows|Home|End/i);
  assert.match(TITLE, /2\.1\.268/);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.match(GOOD_VERSION, /2\.1\.268/);
  assert.match(SURFACE, /AbsoluteTelnet|xterm-256color|arm64|fullscreen/);
  assert.equal(TERM, "xterm-256color");
  assert.match(HOST, /AbsoluteTelnet/);
  assert.equal(TUI_FULLSCREEN_SINCE, "2026-07-30");
  assert.equal(DEAD_SEQUENCES.length, 6);
  assert.ok(DEAD_SEQUENCES.some((row) => row.seq === "ESC [ D"));
  assert.ok(DEAD_SEQUENCES.some((row) => row.seq === "ESC [ H"));
  assert.ok(WORKING_BYTES.includes("Backspace 0x7F"));
  assert.match(WORKAROUND, /Ctrl-B\/F\/A\/E/);
  assert.equal(PLATEN_STRIPS.length, 4);
  assert.ok(RULED_OUT.some((row) => /88249/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /91142/i.test(row)));
  assert.ok(EXPECTED.some((row) => /CSI|2\.1\.268/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|ESC \[ D|0x7F|cat -v|AbsoluteTelnet|2\.1\.268/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("esc-csi-dead"));
  assert.ok(FINGERPRINT_LINES.includes("deadkeyed"));
  assert.equal(PHRASE, "Score deadkey or admit keyed.");
  assert.equal(SAMPLE_DEADKEYED_PLATEN.csiActs, false);
  assert.equal(SAMPLE_SILENT.silent, true);
  assert.equal(SAMPLE_SINGLE_BYTE.stillTypes, true);
  assert.equal(SAMPLE_SWAP.buildNotSession, true);
  assert.equal(SAMPLE_CATV.catVIntact, true);
});

test("has-repro fingerprints encode the published deadkeyed platen", () => {
  const result = handle(seedDeadkeyed());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.surface, /2\.1\.269|AbsoluteTelnet/);
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedDeadkeyed()),
    /deadkey\|csi=dead\|keys=deadkeyed\|bytes=ok\|fail=silent\|path=esc-csi-dead\|cue=esc-csi-dead/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Gleaner, Schism, Rasure and Ashpan", () => {
  const required = [
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
    "eidolon",
    "aphonia",
    "muzzle",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "oubliette",
    "ephemera",
    "mondegreen",
    "parergon",
    "guillotine",
    "flashpan",
    "clepsydra",
    "springe",
    "deadlight",
    "damper",
    "sounder",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("keyed booth flips deadkeyed back when CSI resolves", () => {
  const tape = {
    keyed: true,
    deadkeyed: false,
    csiLeft: false,
    cue: "keyed",
  };
  assert.equal(scoreGate(tape).verdict, "keyed");
  tape.keyed = false;
  tape.deadkeyed = true;
  tape.escCsiDead = true;
  tape.csiLeft = true;
  tape.silentFail = true;
  tape.cue = "deadkeyed";
  assert.equal(scoreGate(tape).verdict, "deadkey");
  tape.keyed = true;
  tape.deadkeyed = false;
  tape.escCsiDead = false;
  tape.csiLeft = false;
  tape.silentFail = false;
  tape.cue = "keyed";
  assert.equal(scoreGate(tape).verdict, "keyed");
});

test("csi, single-byte, silent, swap, fullscreen, cat-v, and readBooth mark the deadkeyed platen", () => {
  const idle = inspectCsi({
    keyed: true,
    platen: { csiActs: true, deadCount: 0 },
  });
  assert.equal(idle.stamp, "csi-resolves");
  const silent = inspectSilentFail({ deadkeyed: true, silent: SAMPLE_SILENT });
  assert.equal(silent.stamp, "silent-fail");
  assert.equal(silent.silent, true);
  const bytes = inspectSingleByte({
    singleByteOk: true,
    singleByte: SAMPLE_SINGLE_BYTE,
  });
  assert.equal(bytes.stamp, "single-byte-ok");
  const swap = inspectBinarySwap({ deadkeyed: true, binarySwap: true });
  assert.equal(swap.stamp, "268-269-swap");
  const screen = inspectFullscreen({ deadkeyed: true, fullscreenTui: true });
  assert.equal(screen.stamp, "fullscreen-tui");
  const tape = inspectCatV({ deadkeyed: true });
  assert.equal(tape.stamp, "cat-v-intact");
  const booth = readBooth({
    deadkeyed: true,
    csiLeft: true,
    platen: SAMPLE_DEADKEYED_PLATEN,
    silent: SAMPLE_SILENT,
  });
  assert.equal(booth.deadkeyed, true);
  assert.equal(booth.mark, "deadkeyed");
  const open = readBooth({
    keyed: true,
    deadkeyed: false,
    csiLeft: false,
  });
  assert.equal(open.deadkeyed, false);
  assert.equal(open.mark, "keyed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 88249);
  assert.equal(COUSINS[1].issue, 91142);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /88249|SIGCONT|rebuild/i);
  assert.match(COUSINS[1].why, /91142|wheel|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  assert.ok(NOT_PRODUCTS.includes("springe"));
  assert.ok(NOT_PRODUCTS.includes("deadlight"));
  assert.ok(NOT_PRODUCTS.includes("damper"));
  assert.ok(NOT_PRODUCTS.includes("sounder"));
  assert.equal(BACKUPS.length, 15);
  assert.equal(BACKUPS[0].issue, 93801);
  assert.equal(BACKUPS[1].issue, 93798);
  assert.equal(BACKUPS[2].issue, 93786);
  assert.equal(BACKUPS[3].issue, 93778);
  assert.equal(BACKUPS[4].issue, 93800);
  assert.equal(BACKUPS[5].issue, 93795);
  assert.equal(BACKUPS[6].issue, 93766);
  assert.equal(BACKUPS[7].issue, 93764);
  assert.equal(BACKUPS[8].issue, 93754);
  assert.equal(BACKUPS[9].issue, 93751);
  assert.equal(BACKUPS[10].issue, 93744);
  assert.equal(BACKUPS[11].issue, 93772);
  assert.equal(BACKUPS[12].issue, 93770);
  assert.equal(BACKUPS[13].issue, 93777);
  assert.equal(BACKUPS[14].issue, 93782);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/deadkeyed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const keyedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/keyed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(keyedFix.status, 0, keyedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "keyed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "deadkeyed");
  assert.equal(JSON.parse(keyedFix.stdout).verdict, "keyed");
});

test("handle exposes published hypothesis and #93788 headline", () => {
  const result = handle(seedDeadkeyed());
  assert.equal(result.published.issue, 93788);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [88249, 91142]);
  assert.ok(result.published.backups.includes(93801));
  assert.ok(result.published.backups.includes(93798));
  assert.ok(result.published.backups.includes(93786));
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93800));
  assert.ok(result.published.backups.includes(93795));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(!result.published.backups.includes(93788));
  assert.ok(!result.published.backups.includes(88249));
  assert.match(result.published.hypothesis, /fullscreen|TUI|CSI|ESC/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93788/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a typographic dead-key / typewriter platen booth, not gleaner or schism", () => {
  const page = readPage();
  assert.match(page, /Special Elite|Special\+Elite/);
  assert.match(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /deadkey|deadkeyed|esc-csi-dead|platen|typewriter|dead-key/i);
  assert.match(page, /#0A0908|#F5EFE3|#9C2F2A|#B8924A|#1C1915|#EDE4D2|#161412/i);
  assert.match(page, /\bkeyed\b/);
  assert.match(page, /\bdeadkeyed\b/);
  assert.match(page, /esc-csi-dead/);
  assert.match(page, /Score deadkey or admit keyed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#315/);
  assert.match(page, /#93788/);
  assert.match(page, /Admit keyed/);
  assert.match(page, /Score deadkey/);
  assert.match(page, /Walk esc-csi-dead/);
  assert.match(page, /Compare keyed \/ deadkeyed/);
  assert.match(page, /Pin idle keyed/);
  assert.match(page, /Pin seeded deadkeyed/);
  assert.match(page, /Pin esc-csi-dead/);
  assert.match(page, /Hold the keyed/);
  assert.match(page, /ESC \[ D|ESC \[ H|0x7F|2\.1\.269|2\.1\.268|cat -v|AbsoluteTelnet/i);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.doesNotMatch(page, /Plus Jakarta Sans|Plus\+Jakarta\+Sans/);
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
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Crimson Pro|Crimson\+Pro/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /#0E140C/);
  assert.doesNotMatch(page, /#E8D9A8/);
  assert.doesNotMatch(page, /#2A1F14/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#5B8C5A/);
  assert.doesNotMatch(page, /#B85C38/);
  assert.doesNotMatch(page, /#F4F0E6/);
  assert.doesNotMatch(page, /#0B0A12/);
  assert.doesNotMatch(page, /#E8E4F5/);
  assert.doesNotMatch(page, /#6B3FA0/);
  assert.doesNotMatch(page, /#3D9EBF/);
  assert.doesNotMatch(page, /#C45C8A/);
  assert.doesNotMatch(page, /#1A1A1A/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#0B1C2C/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\blive\b/);
  assert.doesNotMatch(page, /\bschismed\b/);
  assert.doesNotMatch(page, /resume-while-live/);
  assert.doesNotMatch(page, /\bswept\b/);
  assert.doesNotMatch(page, /\bashpanned\b/);
  assert.doesNotMatch(page, /orphan-jsonl/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\brasured\b/);
  assert.doesNotMatch(page, /creation-time-flip/);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Necrology/i);
  assert.match(page, /NOT Innominate/i);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Galley/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Deadkey/);
  assert.match(readme, /#93788/);
  assert.match(readme, /\bkeyed\b/);
  assert.match(readme, /\bdeadkeyed\b/);
  assert.match(readme, /esc-csi-dead/);
  assert.match(readme, /Special Elite/);
  assert.match(readme, /IBM Plex Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Necrology/i);
  assert.match(readme, /NOT Innominate/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /#88249|#91142/);
  assert.match(readme, /2\.1\.269|ESC \[ D|0x7F|cat -v|AbsoluteTelnet|2\.1\.268/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/deadkey/);
  assert.match(readme, /node --test projects\/deadkey\/deadkey\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /deadkey|platen|typewriter|dead-key/i);
  assert.match(readme, /Score deadkey or admit keyed/);
  assert.match(readme, /#93801|#93798|#93786|#93778|#93800|#93795|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782/);
  assert.match(readme, /21:50/);
});

test("catalog features Deadkey only; Gleaner, Schism, Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 315);
  assert.equal(hub.products.length, 315);
  assert.equal(catalog.products[0].name, "Deadkey");
  assert.equal(catalog.products[0].slug, "deadkey");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/deadkey/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /21:50 deadkey|#93788|dead-key|typewriter|platen/i);
  assert.match(catalog.products[0].summary, /\bkeyed\b/);
  assert.match(catalog.products[0].summary, /\bdeadkeyed\b/);
  assert.match(catalog.products[0].summary, /esc-csi-dead/);
  assert.match(catalog.products[0].summary, /Score deadkey or admit keyed/);
  assert.equal(hub.products[0].slug, "deadkey");
  assert.equal(hub.products[0].featured, true);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  const schism = catalog.products.find((row) => row.slug === "schism");
  assert.ok(schism);
  assert.equal(schism.featured, false);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "deadkey").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93788") && row.slug !== "deadkey"));
});

test("vercel rewrites deadkey to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/deadkey");
  assert.equal(vercel.rewrites[0].destination, "/projects/deadkey");
  assert.equal(vercel.rewrites[1].source, "/deadkey/");
  assert.equal(vercel.rewrites[1].destination, "/projects/deadkey");
  assert.equal(vercel.rewrites[2].source, "/deadkey/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/deadkey/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
