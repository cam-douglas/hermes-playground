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
  COMMAND,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOAL_INSTRUCTION,
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
  SAMPLE_COMMAND_ARGS_ONLY,
  SAMPLE_EVALUATOR_BLIND,
  SAMPLE_SCOTOMIZED_CHART,
  SAMPLE_SLASH_SCAN,
  SAMPLE_STOP_LOOP,
  SCOTOMA_WALK,
  SEEDED_WORD,
  SLASH_CLEAR_LINE,
  SLASH_GOAL_LINE,
  STATE,
  STOP_FIRINGS,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectEvaluator,
  inspectGoalStore,
  inspectStopLoop,
  mapField,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCommandArgsBlind,
  seedCommandArgsOnly,
  seedHold,
  seedLegible,
  seedNoUserMessageGoal,
  seedScotoma,
  seedScotomized,
  seedStopLoopNine,
} from "./scotoma.mjs";

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
  return fileURLToPath(new URL("./scotoma.mjs", import.meta.url));
}

test("idle legible is a hold; goal instruction readable by the evaluator path", () => {
  const result = analyze(seedLegible());
  assert.equal(result.verdict, "legible");
  assert.equal(result.idleWord, "legible");
  assert.equal(IDLE_WORD, "legible");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.legible, true);
  assert.equal(result.phrase, "admit legible");
  assert.equal(result.scotomized, false);
  assert.equal(result.commandArgsBlind, false);
  assert.ok(HOLD_ALIASES.includes("legible"));
  assert.ok(HOLD_ALIASES.includes("goal-readable"));
  assert.ok(HOLD_ALIASES.includes("field-clear"));
  assert.ok(HOLD_ALIASES.includes("evaluator-sees"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify legible", () => {
  assert.equal(classify(emptyTicket()), "legible");
  assert.equal(classify(""), "legible");
  assert.equal(classify(null), "legible");
  assert.equal(decide({}), "legible");
});

test("#93744 seeded path scores scotoma when the chart is scotomized", () => {
  const result = analyze(seedScotomized());
  assert.equal(result.verdict, "scotoma");
  assert.equal(result.seededWord, "scotomized");
  assert.equal(SEEDED_WORD, "scotomized");
  assert.equal(PRODUCT_WORD, "scotoma");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scotomized, true);
  assert.equal(result.phrase, "score scotoma");
  assert.equal(result.commandArgsBlind, true);
  assert.equal(result.commandArgsOnly, true);
  assert.equal(result.noUserMessageGoal, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("command-args-only plus evaluator miss is the #93744 scotoma", () => {
  const store = inspectGoalStore({ scotomized: true, commandArgsOnly: true });
  assert.equal(store.stamp, "command-args-only");
  assert.equal(store.commandArgsOnly, true);
  const scored = scoreGate({
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    stopLoopNine: true,
    cue: "scotomized",
    store: SAMPLE_COMMAND_ARGS_ONLY,
    evaluator: SAMPLE_EVALUATOR_BLIND,
  });
  assert.equal(scored.verdict, "scotoma");
  assert.equal(scored.commandArgsBlind, true);
  const open = inspectGoalStore({ legible: true, commandArgsOnly: false });
  assert.equal(open.stamp, "goal-readable");
});

test("path word is command-args-blind; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "command-args-blind");
  const result = analyze(seedCommandArgsBlind());
  assert.equal(result.verdict, "command-args-blind");
  assert.equal(result.pathWord, "command-args-blind");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "command-args-blind", preferSeed: true, scotomized: true }),
    "command-args-blind",
  );
  assert.equal(classify(seedCommandArgsOnly()), "command-args-only");
});

test("HOLD includes legible / hold", () => {
  assert.ok(HOLD.includes("legible"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: command-args-only, no-user-message-goal, stop-loop-nine", () => {
  assert.equal(classify(seedCommandArgsOnly()), "command-args-only");
  assert.equal(classify(seedNoUserMessageGoal()), "no-user-message-goal");
  assert.equal(classify(seedStopLoopNine()), "stop-loop-nine");
  assert.equal(classify(seedScotoma()), "scotoma");
});

test("booth fixtures flip legible vs scotomized vs command-args-blind vs scotoma", () => {
  const idle = scoreGate(seedLegible());
  const seeded = scoreGate(seedScotomized());
  const legible = readData("legible.json");
  const scotomized = readData("scotomized.json");
  const path = readData("command-args-blind.json");
  const product = readData("scotoma.json");
  const argsOnly = readData("command-args-only.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "legible");
  assert.equal(seeded.verdict, "scotoma");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLegible()), "legible");
  assert.equal(score(seedScotomized()), "scotoma");
  assert.equal(legible.commandArgsOnly, false);
  assert.equal(legible.legible, true);
  assert.equal(scoreGate(legible).verdict, "legible");
  assert.equal(scotomized.commandArgsBlind, true);
  assert.equal(scotomized.commandArgsOnly, true);
  assert.equal(scotomized.noUserMessageGoal, true);
  assert.equal(classify(scotomized), "scotomized");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /command-args|evaluator|goal/i);
  assert.match(path.paths[1].result, /user-message|session-level|command-args/i);
  assert.equal(classify(path), "command-args-blind");
  assert.equal(classify(product), "scotoma");
  assert.equal(product.hubCount, "SCOTOMA");
  assert.equal(scotomized.issue, 93744);
  assert.equal(scotomized.scotomized, true);
  assert.equal(classify(argsOnly), "command-args-only");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("no-user-message-goal.json")), "no-user-message-goal");
  assert.equal(classify(readData("stop-loop-nine.json")), "stop-loop-nine");
  assert.equal(classify(readData("unachievable-declare.json")), "unachievable-declare");
  assert.equal(classify(readData("slash-scan-present.json")), "slash-scan-present");
  assert.equal(classify(readData("fail-open-hook.json")), "fail-open-hook");
  assert.equal(classify(readData("not-user-hook.json")), "not-user-hook");
  assert.equal(classify(readData("goal-readable.json")), "goal-readable");
  assert.equal(classify(readData("field-clear.json")), "field-clear");
  assert.equal(classify(readData("evaluator-sees.json")), "evaluator-sees");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  const store = readData("goal-store.json");
  assert.equal(store.commandArgsOnly, true);
  assert.equal(store.userMessageGoal, false);
  assert.match(store.commandArgs, /Read plans/);
  const slash = readData("slash-scan.json");
  assert.equal(slash.goalLine, 12);
  assert.equal(slash.clearLine, 7);
  const firings = readData("stop-firings.json");
  assert.equal(firings.firings, 9);
  assert.equal(firings.unachievable, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("legible"));
  assert.ok(CHIPS.includes("scotomized"));
  assert.ok(CHIPS.includes("scotoma"));
  assert.ok(CHIPS.includes("command-args-blind"));
  assert.ok(CHIPS.includes("command-args-only"));
  assert.ok(CHIPS.includes("no-user-message-goal"));
  assert.ok(CHIPS.includes("stop-loop-nine"));
  assert.ok(CHIPS.includes("unachievable-declare"));
  assert.ok(CHIPS.includes("slash-scan-present"));
  assert.ok(CHIPS.includes("fail-open-hook"));
  assert.ok(CHIPS.includes("not-user-hook"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("scotomized"));
  assert.ok(ALARM.includes("command-args-blind"));
  assert.ok(ALARM.includes("command-args-only"));
  assert.ok(ALARM.includes("scotoma"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published scotoma walk scores scotoma after the idle hold", () => {
  const booth = scoreWalk({ rows: SCOTOMA_WALK });
  assert.equal(booth.verdict, "scotoma");
  assert.ok(booth.scotomizedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-legible");
  assert.equal(idle.legible, true);
  assert.equal(idle.verdict, "legible");
  const lie = booth.rows.find((row) => row.event === "command-args-only");
  assert.equal(lie.commandArgsOnly, true);
  const path = booth.rows.find((row) => row.event === "command-args-blind" && row.t === "path");
  assert.equal(path.verdict, "command-args-blind");
});

test("SCOTOMA_WALK constant matches the issue chart walk", () => {
  assert.equal(SCOTOMA_WALK[0].event, "cue-legible");
  const lie = SCOTOMA_WALK.find((row) => row.event === "command-args-only");
  assert.equal(lie.commandArgsOnly, true);
  const path = SCOTOMA_WALK.find((row) => row.t === "path");
  assert.equal(path.scotomized, true);
  const scoreRow = SCOTOMA_WALK.find((row) => row.event === "scotoma");
  assert.equal(scoreRow.scotomized, true);
});

test("positive control readable goal stays legible", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "legible");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "legible");
  const hold = walk.rows.find((row) => row.event === "cue-legible");
  assert.equal(hold.legible, true);
  assert.equal(hold.verdict, "legible");
});

test("issue constants encode only #93744 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93744);
  assert.ok(ISSUE_URL.includes("93744"));
  assert.match(TITLE, /\/goal|Stop condition|unachievable|command-args|instruction/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.268/);
  assert.match(GOOD_VERSION, /command-args|evaluator|unachievable|session/i);
  assert.equal(SURFACE, "stop-condition-evaluator");
  assert.equal(HOST, "macos-darwin");
  assert.match(INSTALL_PATH, /jsonl|projects/);
  assert.match(COMMAND, /\/goal|plans/);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:core",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /fail-open|telemetry|user hook/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /83266|background task/i.test(row)));
  assert.ok(EXPECTED.some((row) => /command-args|session-level|stop re-firing|unachievable/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.268|macOS 15|Opus 5|command-args|~9|unachievable|line 12/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("command-args-blind"));
  assert.ok(FINGERPRINT_LINES.includes("scotomized"));
  assert.equal(PHRASE, "Score scotoma or admit legible.");
  assert.equal(SAMPLE_SCOTOMIZED_CHART.evaluatorReadsCommandArgs, false);
  assert.equal(SAMPLE_COMMAND_ARGS_ONLY.commandArgsOnly, true);
  assert.equal(SAMPLE_EVALUATOR_BLIND.readsCommandArgs, false);
  assert.equal(SAMPLE_STOP_LOOP.firings, 9);
  assert.equal(SAMPLE_SLASH_SCAN.goalLine, 12);
  assert.equal(STOP_FIRINGS, 9);
  assert.equal(SLASH_CLEAR_LINE, 7);
  assert.equal(SLASH_GOAL_LINE, 12);
  assert.match(GOAL_INSTRUCTION, /Read plans|going to sleep/i);
});

test("has-repro fingerprints encode the published scotomized chart", () => {
  const result = handle(seedScotomized());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "stop-condition-evaluator");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedScotomized()),
    /scotoma\|store=command-args\|user-msg=absent\|stop=~9\|path=command-args-blind\|cue=command-args-blind/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside", () => {
  const required = [
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
    "onedrive-cwd-mislabel",
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
    "pontoon",
    "washed",
    "outrider",
    "credentialed",
    "early-connect",
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
    "attested",
    "necrology",
    "named",
    "innominate",
    "lit",
    "snuffer",
    "pledged",
    "changeling",
    "distinct",
    "homograph",
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
    "scapegoat",
    "galley",
    "stop-dirty",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("legible booth flips scotomized back when the evaluator reads command-args", () => {
  const tape = {
    legible: true,
    scotomized: false,
    commandArgsOnly: false,
    cue: "legible",
  };
  assert.equal(scoreGate(tape).verdict, "legible");
  tape.legible = false;
  tape.scotomized = true;
  tape.commandArgsBlind = true;
  tape.commandArgsOnly = true;
  tape.noUserMessageGoal = true;
  tape.cue = "scotomized";
  assert.equal(scoreGate(tape).verdict, "scotoma");
  tape.legible = true;
  tape.scotomized = false;
  tape.commandArgsBlind = false;
  tape.commandArgsOnly = false;
  tape.noUserMessageGoal = false;
  tape.cue = "legible";
  assert.equal(scoreGate(tape).verdict, "legible");
});

test("store, evaluator, stop, and readBooth mark the scotomized chart", () => {
  const idle = inspectGoalStore({
    legible: true,
    store: { commandArgsOnly: false, userMessageGoal: true },
  });
  assert.equal(idle.stamp, "goal-readable");
  const ev = inspectEvaluator({ scotomized: true, evaluator: SAMPLE_EVALUATOR_BLIND });
  assert.equal(ev.stamp, "command-args-blind");
  assert.equal(ev.readsCommandArgs, false);
  const loop = inspectStopLoop({
    stopLoopNine: true,
  });
  assert.equal(loop.stamp, "stop-loop-nine");
  const booth = readBooth({
    scotomized: true,
    commandArgsOnly: true,
    store: SAMPLE_COMMAND_ARGS_ONLY,
    evaluator: SAMPLE_EVALUATOR_BLIND,
  });
  assert.equal(booth.scotomized, true);
  assert.equal(booth.mark, "scotomized");
  const open = readBooth({
    legible: true,
    scotomized: false,
    commandArgsOnly: false,
  });
  assert.equal(open.scotomized, false);
  assert.equal(open.mark, "legible");
});

test("mapField encodes the published command-args scotoma", () => {
  const miss = mapField({ scotomized: true, commandArgsPresent: true });
  assert.equal(miss.measuredAgainst || miss.stamp, "command-args-blind");
  assert.equal(miss.missedSector, "command-args");
  assert.equal(miss.evaluatorSees, false);
  assert.equal(miss.reliability.fixationLosses, 9);
  const clear = mapField({ legible: true, scotomized: false });
  assert.equal(clear.stamp, "field-clear");
  assert.equal(clear.evaluatorSees, true);
  assert.ok(clear.dB > miss.dB);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 83266);
  assert.equal(COUSINS[1].issue, 85182);
  assert.equal(COUSINS[2].issue, 79981);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("simulacrum"));
  assert.ok(NOT_PRODUCTS.includes("solenoid"));
  assert.ok(NOT_PRODUCTS.includes("scotia"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93862);
  assert.equal(BACKUPS[5].issue, 93859);
  assert.equal(BACKUPS[6].issue, 93863);
  assert.equal(BACKUPS[7].issue, 93889);
  assert.equal(BACKUPS[8].issue, 93821);
  assert.equal(BACKUPS[9].issue, 93811);
  assert.equal(BACKUPS[10].issue, 93809);
  assert.equal(BACKUPS[11].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93744));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scotomized.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const legibleFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/legible.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(legibleFix.status, 0, legibleFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const legibleOut = JSON.parse(legibleFix.stdout);
  assert.equal(idleOut.verdict, "legible");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "scotomized");
  assert.equal(seededOut.alarm, true);
  assert.equal(legibleOut.verdict, "legible");
  assert.equal(legibleOut.hold, true);
});

test("handle exposes published hypothesis and #93744 headline", () => {
  const result = handle(seedScotomized());
  assert.equal(result.published.issue, 93744);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [83266, 85182, 79981]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93862));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93744));
  assert.match(result.published.hypothesis, /command-args|evaluator|unachievable|Stop/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93744/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an ophthalmology / visual-field / perimetry booth, not aneroid or blindside", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.match(page, /Figtree/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /scotoma|legible|scotomized|command-args-blind|perimetry|fixation|Humphrey|visual.field/i);
  assert.match(page, /#0C1418|#1E2C32|#F3EBDA|#D4A017|#B81D45|#2A8A7A/i);
  assert.match(page, /\blegible\b/);
  assert.match(page, /\bscotomized\b/);
  assert.match(page, /command-args-blind/);
  assert.match(page, /Score scotoma or admit legible/i);
  assert.match(page, /#83266|#85182|#79981|cousin/i);
  assert.match(page, /#325/);
  assert.match(page, /#93744/);
  assert.match(page, /Admit legible/);
  assert.match(page, /Score scotoma/);
  assert.match(page, /Walk command-args-blind/);
  assert.match(page, /Compare legible \/ scotomized/);
  assert.match(page, /Pin idle legible/);
  assert.match(page, /Pin seeded scotomized/);
  assert.match(page, /Pin command-args-blind/);
  assert.match(page, /Fixate the bowl/);
  assert.match(page, /command-args|unachievable|2\.1\.268|macOS|Opus 5|\/goal/i);
  assert.doesNotMatch(page, /Orbitron/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Bodoni/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /#8B95A3/);
  assert.doesNotMatch(page, /#E07A28/);
  assert.doesNotMatch(page, /#2FDBA0/);
  assert.doesNotMatch(page, /#C4452A/);
  assert.doesNotMatch(page, /#0A1424/);
  assert.doesNotMatch(page, /#171412/);
  assert.doesNotMatch(page, /#5DFF7A/);
  assert.doesNotMatch(page, /#3A2458/);
  assert.doesNotMatch(page, /#1A1C1F/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F0A202/);
  assert.doesNotMatch(page, /#3EE8E0/);
  assert.doesNotMatch(page, /#1B6B6B/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|onQuitCleanup/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|headersHelper/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /remoteControlAtStartup|WarmLifecycle/);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /list_connected_browsers|Navigated to/);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd-mislabel/);
  assert.doesNotMatch(page, /\bstetted\b/);
  assert.doesNotMatch(page, /\brewound\b/);
  assert.doesNotMatch(page, /mic-resume-wipe/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bblindsided\b/);
  assert.doesNotMatch(page, /compare-ref-unreachable/);
  assert.doesNotMatch(page, /\bscoped\b/);
  assert.doesNotMatch(page, /\binterdicted\b/);
  assert.doesNotMatch(page, /chrome-prohibit-bleed/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Galley/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Scotoma/);
  assert.match(readme, /#93744/);
  assert.match(readme, /\blegible\b/);
  assert.match(readme, /\bscotomized\b/);
  assert.match(readme, /command-args-blind/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /command-args|unachievable|2\.1\.268|\/goal/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/scotoma/);
  assert.match(readme, /node --test projects\/scotoma\/scotoma\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /scotoma|perimetry|visual-field|Humphrey|fixation/i);
  assert.match(readme, /Score scotoma or admit legible/);
  assert.match(readme, /#83266/);
  assert.match(readme, /#85182/);
  assert.match(readme, /#79981/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93862|#93859|#93863|#93889|#93821|#93811|#93809|#93823/);
  assert.match(readme, /07:50/);
});

test("catalog features Scotoma only; Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 325);
  assert.equal(hub.products.length, 325);
  assert.equal(catalog.products[0].name, "Scotoma");
  assert.equal(catalog.products[0].slug, "scotoma");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/scotoma/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /07:50 scotoma|#93744|ophthalmology|visual-field|perimetry/i);
  assert.match(catalog.products[0].summary, /\blegible\b/);
  assert.match(catalog.products[0].summary, /\bscotomized\b/);
  assert.match(catalog.products[0].summary, /command-args-blind/);
  assert.match(catalog.products[0].summary, /Score scotoma or admit legible/);
  assert.equal(hub.products[0].slug, "scotoma");
  assert.equal(hub.products[0].featured, true);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const simulacrum = catalog.products.find((row) => row.slug === "simulacrum");
  assert.ok(simulacrum);
  assert.equal(simulacrum.featured, false);
  const solenoid = catalog.products.find((row) => row.slug === "solenoid");
  assert.ok(solenoid);
  assert.equal(solenoid.featured, false);
  const scotia = catalog.products.find((row) => row.slug === "scotia");
  assert.ok(scotia);
  assert.equal(scotia.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  const stet = catalog.products.find((row) => row.slug === "stet");
  assert.ok(stet);
  assert.equal(stet.featured, false);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "scotoma").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93744") && row.slug !== "scotoma"));
});

test("vercel rewrites scotoma to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/scotoma");
  assert.equal(vercel.rewrites[0].destination, "/projects/scotoma");
  assert.equal(vercel.rewrites[1].source, "/scotoma/");
  assert.equal(vercel.rewrites[1].destination, "/projects/scotoma");
  assert.equal(vercel.rewrites[2].source, "/scotoma/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/scotoma/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
