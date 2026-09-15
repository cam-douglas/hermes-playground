import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BASH_CALLS,
  BASH_MEDIAN_S,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PERMISSION_DECISION_MS,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  POWERSHELL_CALLS,
  POWERSHELL_MEDIAN_S,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_TREACLE_PROOF,
  SEEDED_WORD,
  STALL_GAP_S,
  STATE,
  SURFACE,
  SYNTHETIC_BRISK,
  SYNTHETIC_FIRST_CALL,
  SYNTHETIC_STALL,
  TITLE,
  TREACLE_WALK,
  VERDICTS,
  analyze,
  classify,
  decide,
  diagnose,
  emptyTicket,
  evaluateStall,
  fingerprint,
  handle,
  inspectAstParser,
  inspectFirstCall,
  inspectPermissionDialogLate,
  inspectProbeBeforeStart,
  inspectStallGap,
  mapTreacle,
  readBooth,
  score,
  scoreGate,
  scoreStreamingStall,
  scoreWalk,
  seedAstParser,
  seedBrisk,
  seedFirstCall,
  seedProduct,
  seedStreamingStall,
  seedTreacle,
} from "./treacle.mjs";

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
  return fileURLToPath(new URL("./treacle.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "15:50 treacle: a treacle / copper kettle / treacle-well / sticky-ladle confectionery booth for #94344. On Claude Desktop (Code tab) on Windows, every NEW PowerShell tool call waits ~153–160s (median 154.1s / 1244 calls) from tool_use until the command starts; Bash is ~2.7s; permission dialog after the wait; repeats 2–3s. Idle brisk / seeded treacle / path streaming-stall. Score treacle or admit brisk.";

test("idle brisk is a hold; PowerShell should start promptly like Bash", () => {
  const result = analyze(seedBrisk());
  assert.equal(result.verdict, "brisk");
  assert.equal(result.idleWord, "brisk");
  assert.equal(IDLE_WORD, "brisk");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.brisk, true);
  assert.equal(result.phrase, "admit brisk");
  assert.equal(result.treacle, false);
  assert.equal(result.streamingStall, false);
  assert.ok(HOLD_ALIASES.includes("snap"));
  assert.ok(HOLD_ALIASES.includes("ready"));
  assert.ok(HOLD_ALIASES.includes("instant"));
  assert.ok(HOLD_ALIASES.includes("bash-fast"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "released");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
});

test("empty ticket and empty stdin classify brisk", () => {
  assert.equal(classify(emptyTicket()), "brisk");
  assert.equal(classify(""), "brisk");
  assert.equal(classify(null), "brisk");
  assert.equal(decide({}), "brisk");
  assert.equal(diagnose("").verdict, "brisk");
});

test("#94344 seeded path scores treacle when the first unique pour clings", () => {
  const result = analyze(seedTreacle());
  assert.equal(result.verdict, "treacle");
  assert.equal(result.seededWord, "treacle");
  assert.equal(SEEDED_WORD, "treacle");
  assert.equal(PRODUCT_WORD, "treacle");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.treacle, true);
  assert.equal(result.phrase, "score treacle");
  assert.equal(result.streamingStall, true);
  assert.equal(result.firstCall, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "somnus");
  assert.notEqual(SEEDED_WORD, "cresset");
  assert.notEqual(SEEDED_WORD, "dictabelt");
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(PATH_WORD, "device-absent");
  assert.notEqual(PATH_WORD, "hold-leak");
  assert.notEqual(PATH_WORD, "segment-drop");
  assert.notEqual(PATH_WORD, "orphan-tick");
});

test("educational stall helper encodes published brisk vs streaming-stall paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(DESKTOP_BUILD, "1.52386.6.0");
  assert.equal(POWERSHELL_CALLS, 1244);
  assert.equal(POWERSHELL_MEDIAN_S, 154.1);
  assert.equal(BASH_CALLS, 10827);
  assert.equal(BASH_MEDIAN_S, 2.7);
  assert.equal(STALL_GAP_S, 150.0);
  assert.equal(PERMISSION_DECISION_MS, 150717);
  assert.equal(SYNTHETIC_BRISK.waitMs, 2700);
  assert.equal(SYNTHETIC_FIRST_CALL.waitS, 153.2);
  assert.equal(SYNTHETIC_STALL.permissionDecisionMs, PERMISSION_DECISION_MS);
  const stalled = evaluateStall({ firstUnique: true });
  assert.equal(stalled.stalled, true);
  assert.equal(stalled.synthetic, true);
  const control = evaluateStall({ brisk: true });
  assert.equal(control.stalled, false);
  const scored = scoreStreamingStall({
    treacle: true,
    streamingStall: true,
    firstCall: true,
  });
  assert.equal(scored.treacle, true);
  assert.equal(scored.streamingStall, true);
  const quietPath = scoreStreamingStall({ brisk: true });
  assert.equal(quietPath.treacle, false);
  assert.equal(quietPath.brisk, true);
});

test("inspectors mark first-call and stall-gap", () => {
  const first = inspectFirstCall({ treacle: true, firstCall: true });
  assert.equal(first.stamp, "first-call");
  assert.equal(first.first, true);
  const gap = inspectStallGap({ treacle: true, stallGap: true });
  assert.equal(gap.stamp, "stall-gap");
  assert.equal(gap.gap, true);
  const scored = scoreGate({
    treacle: true,
    streamingStall: true,
    firstCall: true,
    cue: "treacle",
  });
  assert.equal(scored.verdict, "treacle");
  const open = inspectFirstCall({ brisk: true, treacle: false });
  assert.equal(open.stamp, "prompt-start");
});

test("path word is streaming-stall; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "streaming-stall");
  const result = analyze(seedStreamingStall());
  assert.equal(result.verdict, "streaming-stall");
  assert.equal(result.pathWord, "streaming-stall");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "streaming-stall",
      preferSeed: true,
      treacle: true,
    }),
    "streaming-stall",
  );
  assert.equal(classify({ seed: "first-call", preferSeed: true }), "first-call");
  assert.equal(score(seedStreamingStall()), "treacle");
});

test("HOLD includes brisk", () => {
  assert.ok(HOLD.includes("brisk"));
  assert.equal(HOLD.length, 1);
  assert.equal(classify({ seed: "snap", preferSeed: true }), "snap");
  assert.equal(classify({ seed: "ready", preferSeed: true }), "ready");
  assert.equal(classify({ seed: "instant", preferSeed: true }), "instant");
  assert.equal(classify({ seed: "bash-fast", preferSeed: true }), "bash-fast");
});

test("alarm chips: first-call, streaming-stall, treacle", () => {
  assert.equal(classify({ seed: "first-call", preferSeed: true }), "first-call");
  assert.equal(classify(seedStreamingStall()), "streaming-stall");
  assert.equal(classify(seedProduct()), "treacle");
  assert.equal(classify(seedFirstCall()), "first-call");
  assert.equal(classify(seedAstParser()), "ast-parser");
  assert.equal(classify({ seed: "permission-dialog-late", preferSeed: true }), "permission-dialog-late");
});

test("booth fixtures flip brisk vs treacle vs streaming-stall", () => {
  const idle = scoreGate(seedBrisk());
  const seeded = scoreGate(seedTreacle());
  const brisk = readData("brisk.json");
  const treacle = readData("treacle.json");
  const issued = readData("94344.json");
  const path = readData("streaming-stall.json");
  assert.equal(idle.verdict, "brisk");
  assert.equal(seeded.verdict, "treacle");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedBrisk()), "brisk");
  assert.equal(score(seedTreacle()), "treacle");
  assert.equal(score({ seed: "streaming-stall", preferSeed: true }), "treacle");
  assert.equal(brisk.streamingStall, false);
  assert.equal(brisk.brisk, true);
  assert.equal(scoreGate(brisk).verdict, "brisk");
  assert.equal(treacle.streamingStall, true);
  assert.equal(treacle.firstCall, true);
  assert.equal(classify(treacle), "treacle");
  assert.equal(issued.issue, 94344);
  assert.equal(classify(issued), "treacle");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /brisk|snap|ready|instant|bash-fast/i);
  assert.match(path.paths[1].result, /streaming-stall|first-call|ast-parser/i);
  assert.equal(classify(path), "streaming-stall");
  assert.equal(treacle.hubCount, "TREACLE");
  assert.equal(treacle.issue, 94344);
  assert.equal(treacle.treacle, true);
  assert.equal(classify(readData("snap.json")), "snap");
  assert.equal(classify(readData("ready.json")), "ready");
  assert.equal(classify(readData("instant.json")), "instant");
  assert.equal(classify(readData("bash-fast.json")), "bash-fast");
  assert.equal(classify(readData("ast-parser.json")), "ast-parser");
  assert.equal(classify(readData("first-call.json")), "first-call");
  assert.equal(classify(readData("repeat-cached.json")), "repeat-cached");
  assert.equal(classify(readData("permission-dialog-late.json")), "permission-dialog-late");
  assert.equal(classify(readData("stall-gap.json")), "stall-gap");
  assert.equal(classify(readData("permission-ms.json")), "permission-ms");
  assert.equal(classify(readData("encoded-command.json")), "encoded-command");
  assert.equal(classify(readData("probe-before-start.json")), "probe-before-start");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [57960, 94392]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("brisk"));
  assert.ok(CHIPS.includes("treacle"));
  assert.ok(CHIPS.includes("streaming-stall"));
  assert.ok(CHIPS.includes("first-call"));
  assert.ok(CHIPS.includes("bash-fast"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("treacle"));
  assert.ok(ALARM.includes("streaming-stall"));
  assert.ok(ALARM.includes("first-call"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published treacle walk scores treacle after the idle hold", () => {
  const booth = scoreWalk({ rows: TREACLE_WALK });
  assert.equal(booth.verdict, "treacle");
  assert.ok(booth.treacleCount >= 1);
  const idle = booth.rows.find((row) => row.event === "bash-fast");
  assert.equal(idle.brisk, true);
  assert.equal(idle.verdict, "brisk");
  const cut = booth.rows.find((row) => row.event === "streaming-stall");
  assert.equal(cut.streamingStall, true);
  const path = booth.rows.find(
    (row) => row.event === "streaming-stall" && row.t === "path",
  );
  assert.equal(path.verdict, "streaming-stall");
});

test("TREACLE_WALK constant matches the issue kitchen walk", () => {
  assert.equal(TREACLE_WALK[0].event, "bash-fast");
  const cut = TREACLE_WALK.find((row) => row.event === "streaming-stall");
  assert.equal(cut.streamingStall || cut.firstCall, true);
  const path = TREACLE_WALK.find((row) => row.t === "path");
  assert.equal(path.treacle, true);
  const scoreRow = TREACLE_WALK.find((row) => row.event === "treacle");
  assert.equal(scoreRow.treacle, true);
  assert.equal(scoreRow.firstCall, true);
});

test("positive control bash-fast kettle stays brisk", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "brisk");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "brisk");
  const hold = walk.rows.find((row) => row.event === "bash-fast");
  assert.equal(hold.brisk, true);
  assert.equal(hold.verdict, "brisk");
});

test("issue constants encode only #94344 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94344);
  assert.ok(ISSUE_URL.includes("94344"));
  assert.match(TITLE, /PowerShell|154|Windows|#57960/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /1\.52386\.6\.0|2\.1\.270|Windows 11/i);
  assert.match(BUILD, /2\.1\.270|1\.52386\.6\.0/);
  assert.equal(SURFACE, "streaming-stall");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:tools", "area:permissions", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#57960/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94392/i.test(row)));
  assert.ok(EXPECTED.some((row) => /few seconds|immediately|Bash/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /154\.1|permissionDecisionMs|EncodedCommand|2\.1\.270/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("streaming-stall"));
  assert.ok(FINGERPRINT_LINES.includes("treacle"));
  assert.equal(PHRASE, "Score treacle or admit brisk.");
  assert.equal(SAMPLE_TREACLE_PROOF.streamingStall, true);
  assert.equal(SAMPLE_TREACLE_PROOF.names.length, 6);
  assert.equal(SAMPLE_TREACLE_PROOF.synthetic, true);
});

test("has-repro fingerprints encode the published treacle proof", () => {
  const result = handle(seedTreacle());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "streaming-stall");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedTreacle()),
    /treacle\|kind=streaming-stall\|ref=first-call\|path=streaming-stall\|cue=streaming-stall/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "cadence",
    "released",
    "verbatim",
    "quiet",
    "intact",
    "slack",
    "yielding",
    "extinguished",
    "idle-ok",
    "suspend-ready",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "device-absent",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("brisk booth flips treacle back when the kettle admits brisk", () => {
  const tape = {
    brisk: true,
    treacle: false,
    streamingStall: false,
    cue: "brisk",
  };
  assert.equal(scoreGate(tape).verdict, "brisk");
  tape.brisk = false;
  tape.treacle = true;
  tape.streamingStall = true;
  tape.cue = "treacle";
  assert.equal(scoreGate(tape).verdict, "treacle");
  tape.brisk = true;
  tape.treacle = false;
  tape.streamingStall = false;
  tape.cue = "brisk";
  assert.equal(scoreGate(tape).verdict, "brisk");
});

test("first-call, stall-gap, and readBooth mark the treacle proof", () => {
  const first = inspectFirstCall({ treacle: true });
  assert.equal(first.stamp, "first-call");
  const gap = inspectStallGap({ treacle: true, stallGap: true });
  assert.equal(gap.stamp, "stall-gap");
  assert.equal(gap.gap, true);
  const booth = readBooth({
    treacle: true,
    streamingStall: true,
    firstCall: true,
  });
  assert.equal(booth.treacle, true);
  assert.equal(booth.mark, "treacle");
  const open = readBooth({
    brisk: true,
    treacle: false,
    streamingStall: false,
  });
  assert.equal(open.treacle, false);
  assert.equal(open.mark, "brisk");
  assert.equal(inspectAstParser({ treacle: true, astParser: true }).stamp, "ast-parser");
  assert.equal(inspectPermissionDialogLate({ treacle: true, permissionDialogLate: true }).stamp, "permission-dialog-late");
  assert.equal(inspectProbeBeforeStart({ treacle: true, probeBeforeStart: true }).stamp, "probe-before-start");
});

test("mapTreacle encodes the published streaming-stall", () => {
  const miss = mapTreacle({ treacle: true, streamingStall: true });
  assert.equal(miss.stamp, "streaming-stall");
  assert.equal(miss.holdingLane, "sticky-ladle");
  assert.equal(miss.ribbon, "treacle");
  const clear = mapTreacle({ brisk: true, treacle: false });
  assert.equal(clear.stamp, "bash-fast");
  assert.equal(clear.kindLane, "copper-kettle");
  assert.equal(clear.holdingLane, "bash-fast");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.deepEqual(COUSINS.map((row) => row.issue), [57960, 94392]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("somnus"));
  assert.ok(NOT_PRODUCTS.includes("cresset"));
  assert.ok(NOT_PRODUCTS.includes("dictabelt"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 94398);
  assert.equal(BACKUPS[10].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94344));
  assert.ok(!COUSINS.some((row) => row.issue === 94344));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/treacle.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const briskFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/brisk.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(briskFix.status, 0, briskFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const briskOut = JSON.parse(briskFix.stdout);
  assert.equal(idleOut.verdict, "brisk");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "treacle");
  assert.equal(seededOut.alarm, true);
  assert.equal(briskOut.verdict, "brisk");
  assert.equal(briskOut.hold, true);
  assert.match(briskOut.phrase, /admit brisk/);
});

test("handle exposes published hypothesis and #94344 headline", () => {
  const result = handle(seedTreacle());
  assert.equal(result.published.issue, 94344);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [57960, 94392]);
  assert.ok(result.published.backups.includes(94398));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94344));
  assert.match(
    result.published.hypothesis,
    /PowerShell|streaming|NON-BINDING|#94344/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94344/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the copper kettle can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("copper kettle is a treacle booth, not moon-watch / iron-basket / wax-belt", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Infant|Cormorant Infant/);
  assert.match(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /treacle|brisk|streaming-stall|copper-kettle|treacle-well|sticky-ladle|wax-paper-twist|enamel-scale|molasses-pour/i,
  );
  assert.match(page, /#4C1E0A|#C46A2B|#F8EBD4|#7A3514|#D4A84B/i);
  assert.match(page, /\bbrisk\b/);
  assert.match(page, /\btreacle\b/);
  assert.match(page, /streaming-stall/);
  assert.match(page, /Score treacle or admit brisk/i);
  assert.match(page, /#375/);
  assert.match(page, /#94344/);
  assert.match(page, /Admit brisk/);
  assert.match(page, /Score treacle/);
  assert.match(page, /Walk streaming-stall/);
  assert.match(page, /Compare brisk \/ treacle/);
  assert.match(page, /Pin idle brisk/);
  assert.match(page, /Pin seeded treacle/);
  assert.match(page, /Pin streaming-stall/);
  assert.match(page, /Stamp first-call/);
  assert.match(page, /Score booth/);
  assert.match(page, /treacle-score/);
  assert.match(
    page,
    /1\.52386\.6\.0|2\.1\.270|permissionDecisionMs|EncodedCommand|154\.1/i,
  );
  assert.match(page, /copper-kettle|treacle-well|sticky-ladle|wax-paper-twist|enamel-scale|molasses-pour/i);
  assert.match(
    page,
    /<svg[\s\S]*class="copper-kettle"|class="treacle-well"|class="sticky-ladle"|class="enamel-scale"|class="wax-paper-twist"/i,
  );
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Playfair\+Display|Playfair Display/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /#12162E|#F3EBDD|#C5CDD8|#8B6FCF|#2E9A96/);
  assert.doesNotMatch(page, /#E07020|#2A2E33|#E8E4DC|#0E1218|#F0C14A|#3D6F8C/);
  assert.doesNotMatch(page, /#C9893A|#F4EFE4|#1A1612|#D64545|#4A5560|#2F6B4F/);
  assert.doesNotMatch(page, /moon-watch|nursery-desk|absent-chip|cadence-dial|sleep-ledger/);
  assert.doesNotMatch(page, /iron-basket|ember-snuff|gnome-dial|battlement|hold-ledger/);
  assert.doesNotMatch(page, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/);
  assert.doesNotMatch(page, /admit cadence|Score somnus|idle cadence/i);
  assert.doesNotMatch(page, /admit released|Score cresset|idle released/i);
  assert.doesNotMatch(page, /admit verbatim|Score dictabelt|idle verbatim/i);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.match(page, /NOT Somnus/i);
  assert.match(page, /NOT Cresset/i);
  assert.match(page, /NOT Dictabelt/i);
  assert.match(page, /NOT Lemure/i);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /#57960/);
  assert.match(page, /#94392/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Treacle/);
  assert.match(readme, /#94344/);
  assert.match(readme, /\bbrisk\b/);
  assert.match(readme, /\btreacle\b/);
  assert.match(readme, /streaming-stall/);
  assert.match(readme, /Cormorant Infant/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /1\.52386\.6\.0|permissionDecisionMs|EncodedCommand|154\.1/i);
  assert.match(readme, /NOT #57960/);
  assert.match(readme, /NOT #94392/);
  assert.match(readme, /NOT Somnus\/#94415/);
  assert.match(readme, /NOT Cresset\/#94420/);
  assert.match(readme, /NOT Dictabelt\/#94406/);
  assert.match(readme, /#57960/);
  assert.match(readme, /#94392/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/treacle/);
  assert.match(readme, /node --test projects\/treacle\/treacle\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /copper kettle|treacle-well|sticky-ladle|confectionery/i);
  assert.match(readme, /Score treacle or admit brisk/);
  assert.match(readme, /#94398|#94397|#94151/);
  assert.match(readme, /15:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /night-nursery|moon-watch|iron fire-basket|wax-belt|stenotype/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Treacle/);
  assert.match(runLog, /15:50/);
});

test("catalog features Treacle only; Somnus unfeatured; product count 375", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 375);
  assert.equal(hub.products.length, 375);
  assert.equal(catalog.products[0].name, "Treacle");
  assert.equal(catalog.products[0].slug, "treacle");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/treacle/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bbrisk\b/);
  assert.match(catalog.products[0].summary, /\btreacle\b/);
  assert.match(catalog.products[0].summary, /streaming-stall/);
  assert.match(catalog.products[0].summary, /Score treacle or admit brisk/);
  assert.match(catalog.products[0].summary, /#94344/);
  assert.match(catalog.products[0].summary, /15:50/);
  assert.equal(hub.products[0].slug, "treacle");
  assert.equal(hub.products[0].featured, true);
  const somnus = catalog.products.find((row) => row.slug === "somnus");
  assert.ok(somnus);
  assert.equal(somnus.featured, false);
  const cresset = catalog.products.find((row) => row.slug === "cresset");
  assert.ok(cresset);
  assert.equal(cresset.featured, false);
  const dictabelt = catalog.products.find((row) => row.slug === "dictabelt");
  assert.ok(dictabelt);
  assert.equal(dictabelt.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "treacle").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94344") && row.slug !== "treacle",
    ),
  );
});

test("vercel rewrites treacle to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/treacle");
  assert.equal(vercel.rewrites[0].destination, "/projects/treacle");
  assert.equal(vercel.rewrites[1].source, "/treacle/");
  assert.equal(vercel.rewrites[1].destination, "/projects/treacle");
  assert.equal(vercel.rewrites[2].source, "/treacle/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/treacle/:path*");
  assert.equal(vercel.rewrites[3].source, "/somnus");
  assert.equal(vercel.rewrites[3].destination, "/projects/somnus");
});

test("no leftover clone / moon-watch / iron-basket content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /moon-watch|iron-basket|ember-snuff|gnome-dial|battlement|wax-belt|stenotype/i);
  }
  assert.doesNotMatch(source, /moon-watch desk|iron fire-basket|wax-belt stenotype/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
