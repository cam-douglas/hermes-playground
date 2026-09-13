import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHECKED_ON,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DESKTOP_APP,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FOUNDLING_WALK,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POLL_LOOP,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RELATED_CITE,
  RULED_OUT,
  RUNTIME_MAX,
  RUNTIME_MIN,
  SAMPLE_FOUNDLING_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TASKSTOP_SCOPE,
  TITLE,
  TSC_WAITER,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectHatch,
  inspectPolling,
  inspectRegister,
  inspectTaskStop,
  mapWard,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAgentFinished,
  seedFoundling,
  seedFiliated,
  seedHold,
  seedPollingLoop,
  seedProduct,
  seedSubagentBashOutlive,
  seedTaskstopGap,
} from "./foundling.mjs";

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
  return fileURLToPath(new URL("./foundling.mjs", import.meta.url));
}

test("idle filiated is a hold; parent still on the ward register", () => {
  const result = analyze(seedFiliated());
  assert.equal(result.verdict, "filiated");
  assert.equal(result.idleWord, "filiated");
  assert.equal(IDLE_WORD, "filiated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.filiated, true);
  assert.equal(result.phrase, "admit filiated");
  assert.equal(result.foundling, false);
  assert.equal(result.subagentBashOutlive, false);
  assert.ok(HOLD_ALIASES.includes("filiated"));
  assert.ok(HOLD_ALIASES.includes("bonded"));
  assert.ok(HOLD_ALIASES.includes("registered"));
  assert.ok(HOLD_ALIASES.includes("warded"));
  assert.ok(HOLD_ALIASES.includes("acknowledged"));
  assert.ok(HOLD_ALIASES.includes("parented"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify filiated", () => {
  assert.equal(classify(emptyTicket()), "filiated");
  assert.equal(classify(""), "filiated");
  assert.equal(classify(null), "filiated");
  assert.equal(decide({}), "filiated");
});

test("#93889 seeded path scores foundling when the parent has departed", () => {
  const result = analyze(seedFoundling());
  assert.equal(result.verdict, "foundling");
  assert.equal(result.seededWord, "foundling");
  assert.equal(SEEDED_WORD, "foundling");
  assert.equal(PRODUCT_WORD, "foundling");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.foundling, true);
  assert.equal(result.phrase, "score foundling");
  assert.equal(result.subagentBashOutlive, true);
  assert.equal(result.agentFinished, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("subagent-bash-outlive plus agent-finished is the #93889 foundling", () => {
  const hatch = inspectHatch({ foundling: true, subagentBashOutlive: true });
  assert.equal(hatch.stamp, "cradle-at-hatch");
  assert.equal(hatch.cradle, "at-hatch");
  const scored = scoreGate({
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    pollingLoop: true,
    taskstopGap: true,
    cue: "foundling",
  });
  assert.equal(scored.verdict, "foundling");
  assert.equal(scored.subagentBashOutlive, true);
  const open = inspectRegister({ filiated: true, subagentBashOutlive: false });
  assert.equal(open.stamp, "parent-on-register");
});

test("path word is subagent-bash-outlive; hatch seed holds the path", () => {
  assert.equal(PATH_WORD, "subagent-bash-outlive");
  const result = analyze(seedSubagentBashOutlive());
  assert.equal(result.verdict, "subagent-bash-outlive");
  assert.equal(result.pathWord, "subagent-bash-outlive");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "subagent-bash-outlive", preferSeed: true, foundling: true }),
    "subagent-bash-outlive",
  );
  assert.equal(classify(seedPollingLoop()), "polling-loop");
});

test("HOLD includes filiated / hold", () => {
  assert.ok(HOLD.includes("filiated"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: taskstop-gap, agent-finished, foundling", () => {
  assert.equal(classify(seedTaskstopGap()), "taskstop-gap");
  assert.equal(classify(seedAgentFinished()), "agent-finished");
  assert.equal(classify(seedProduct()), "foundling");
});

test("booth fixtures flip filiated vs foundling vs subagent-bash-outlive", () => {
  const idle = scoreGate(seedFiliated());
  const seeded = scoreGate(seedFoundling());
  const filiated = readData("filiated.json");
  const foundling = readData("foundling.json");
  const path = readData("subagent-bash-outlive.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "filiated");
  assert.equal(seeded.verdict, "foundling");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFiliated()), "filiated");
  assert.equal(score(seedFoundling()), "foundling");
  assert.equal(filiated.subagentBashOutlive, false);
  assert.equal(filiated.filiated, true);
  assert.equal(scoreGate(filiated).verdict, "filiated");
  assert.equal(foundling.subagentBashOutlive, true);
  assert.equal(foundling.agentFinished, true);
  assert.equal(foundling.pollingLoop, true);
  assert.equal(classify(foundling), "foundling");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /filiated|ward register|living agent|bonded/i);
  assert.match(path.paths[1].result, /until false|sleep 3|no owner|hatch/i);
  assert.equal(classify(path), "subagent-bash-outlive");
  assert.equal(foundling.hubCount, "FOUNDLING");
  assert.equal(foundling.issue, 93889);
  assert.equal(foundling.foundling, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("bonded.json")), "bonded");
  assert.equal(classify(readData("registered.json")), "registered");
  assert.equal(classify(readData("warded.json")), "warded");
  assert.equal(classify(readData("acknowledged.json")), "acknowledged");
  assert.equal(classify(readData("parented.json")), "parented");
  assert.equal(classify(readData("polling-loop.json")), "polling-loop");
  assert.equal(classify(readData("taskstop-gap.json")), "taskstop-gap");
  assert.equal(classify(readData("background-panel.json")), "background-panel");
  assert.equal(classify(readData("cmdline-self-match.json")), "cmdline-self-match");
  assert.equal(classify(readData("agent-finished.json")), "agent-finished");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("filiated"));
  assert.ok(CHIPS.includes("foundling"));
  assert.ok(CHIPS.includes("subagent-bash-outlive"));
  assert.ok(CHIPS.includes("polling-loop"));
  assert.ok(CHIPS.includes("taskstop-gap"));
  assert.ok(CHIPS.includes("bonded"));
  assert.ok(CHIPS.includes("warded"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("foundling"));
  assert.ok(ALARM.includes("subagent-bash-outlive"));
  assert.ok(ALARM.includes("polling-loop"));
  assert.ok(ALARM.includes("taskstop-gap"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published foundling walk scores foundling after the idle hold", () => {
  const booth = scoreWalk({ rows: FOUNDLING_WALK });
  assert.equal(booth.verdict, "foundling");
  assert.ok(booth.foundlingCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-filiated");
  assert.equal(idle.filiated, true);
  assert.equal(idle.verdict, "filiated");
  const cut = booth.rows.find((row) => row.event === "subagent-bash-outlive");
  assert.equal(cut.subagentBashOutlive, true);
  const path = booth.rows.find((row) => row.event === "subagent-bash-outlive" && row.t === "path");
  assert.equal(path.verdict, "subagent-bash-outlive");
});

test("FOUNDLING_WALK constant matches the issue hatch walk", () => {
  assert.equal(FOUNDLING_WALK[0].event, "cue-filiated");
  const cut = FOUNDLING_WALK.find((row) => row.event === "subagent-bash-outlive");
  assert.equal(cut.subagentBashOutlive, true);
  const path = FOUNDLING_WALK.find((row) => row.t === "path");
  assert.equal(path.foundling, true);
  const scoreRow = FOUNDLING_WALK.find((row) => row.event === "foundling");
  assert.equal(scoreRow.foundling, true);
});

test("positive control filiated ward stays filiated", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "filiated");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "filiated");
  const hold = walk.rows.find((row) => row.event === "cue-filiated");
  assert.equal(hold.filiated, true);
  assert.equal(hold.verdict, "filiated");
});

test("issue constants encode only #93889 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93889);
  assert.ok(ISSUE_URL.includes("93889"));
  assert.match(TITLE, /subagent|background Bash|polling loop/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /macOS|Claude Desktop|Code tab/);
  assert.match(CHECKED_ON, /2\.1\.260|1\.52386\.3|macOS/);
  assert.equal(CLAUDE_VERSION, "2.1.260");
  assert.equal(DESKTOP_APP, "1.52386.3");
  assert.match(GOOD_VERSION, /terminat|hand|parent|turn ends/i);
  assert.equal(SURFACE, "subagent-background-bash");
  assert.equal(POLL_LOOP, "until false; do sleep 3; done");
  assert.equal(RUNTIME_MIN, 45);
  assert.equal(RUNTIME_MAX, 60);
  assert.match(TASKSTOP_SCOPE, /parent session|own tasks/i);
  assert.equal(TSC_WAITER, "tsc-waiter");
  assert.equal(RELATED_CITE, 93880);
  assert.deepEqual([...LABELS], [
    "bug",
    "platform:macos",
    "area:bash",
    "area:agents",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /Gleaner|#93794|unreaped/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /TaskStop|child agent/i.test(row)));
  assert.ok(EXPECTED.some((row) => /terminated|handed off|stop all from finished/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.260|until false|TaskStop|#93880|#93794|45 to 60/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("subagent-bash-outlive"));
  assert.ok(FINGERPRINT_LINES.includes("foundling"));
  assert.equal(PHRASE, "Score foundling or admit filiated.");
  assert.equal(SAMPLE_FOUNDLING_PROOF.subagentBashOutlive, true);
});

test("has-repro fingerprints encode the published foundling proof", () => {
  const result = handle(seedFoundling());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "subagent-background-bash");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedFoundling()),
    /foundling\|parent=departed\|loop=until-sleep\|taskstop=gap\|path=subagent-bash-outlive\|cue=subagent-bash-outlive/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes gleaner/outrider and recent catalog words", () => {
  const required = [
    "gleaned",
    "orphaned",
    "unreaped-ampersand",
    "gleaner",
    "credentialed",
    "outridden",
    "outrider",
    "early-connect",
    "injective",
    "crased",
    "crasis",
    "store-slug-collide",
    "unitary",
    "tessellated",
    "tessera",
    "version-path-tcc",
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "simulacrum",
    "solenoid",
    "scotia",
    "canard",
    "stet",
    "blindside",
    "schism",
    "intact",
    "rasured",
    "creation-time-flip",
    "sheltered",
    "waif",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("filiated booth flips foundling back when the parent stays on the register", () => {
  const tape = {
    filiated: true,
    foundling: false,
    subagentBashOutlive: false,
    cue: "filiated",
  };
  assert.equal(scoreGate(tape).verdict, "filiated");
  tape.filiated = false;
  tape.foundling = true;
  tape.subagentBashOutlive = true;
  tape.agentFinished = true;
  tape.cue = "foundling";
  assert.equal(scoreGate(tape).verdict, "foundling");
  tape.filiated = true;
  tape.foundling = false;
  tape.subagentBashOutlive = false;
  tape.agentFinished = false;
  tape.cue = "filiated";
  assert.equal(scoreGate(tape).verdict, "filiated");
});

test("register, hatch, polling, and readBooth mark the foundling proof", () => {
  const idle = inspectRegister({
    filiated: true,
  });
  assert.equal(idle.stamp, "parent-on-register");
  const hatch = inspectHatch({ foundling: true, pollingLoop: true });
  assert.equal(hatch.stamp, "cradle-at-hatch");
  assert.equal(hatch.cradle, "at-hatch");
  const polling = inspectPolling({ foundling: true, pollingLoop: true });
  assert.equal(polling.stamp, "polling-loop");
  assert.equal(polling.spinning, true);
  const booth = readBooth({
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
  });
  assert.equal(booth.foundling, true);
  assert.equal(booth.mark, "foundling");
  const open = readBooth({
    filiated: true,
    foundling: false,
    subagentBashOutlive: false,
  });
  assert.equal(open.foundling, false);
  assert.equal(open.mark, "filiated");
});

test("mapWard encodes the published hatch abandonment", () => {
  const miss = mapWard({ foundling: true, subagentBashOutlive: true });
  assert.equal(miss.stamp, "subagent-bash-outlive");
  assert.equal(miss.registerLane, "departed");
  assert.equal(miss.ribbon, "foundling");
  const clear = mapWard({ filiated: true, foundling: false });
  assert.equal(clear.stamp, "filiated-ward");
  assert.equal(clear.registerLane, "warded");
  assert.equal(clear.hatchLane, "cradle-in-ward");
});

test("inspectTaskStop encodes the parent-only TaskStop gap", () => {
  const gap = inspectTaskStop({ foundling: true, taskstopGap: true });
  assert.equal(gap.stamp, "taskstop-gap");
  assert.equal(gap.gap, true);
  assert.match(gap.scope, /parent session|own tasks/i);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 8);
  assert.equal(COUSINS[0].issue, 93794);
  assert.equal(COUSINS[1].issue, 93126);
  assert.equal(COUSINS[2].issue, 88702);
  assert.equal(COUSINS[3].issue, 92583);
  assert.equal(COUSINS[4].issue, 91523);
  assert.equal(COUSINS[5].issue, 81462);
  assert.equal(COUSINS[6].issue, 93880);
  assert.equal(COUSINS[7].issue, 93387);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("waif"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[10].issue, 93954);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93889));
  assert.ok(!BACKUPS.some((row) => row.issue === 93794));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/foundling.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const filiatedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/filiated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(filiatedFix.status, 0, filiatedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const filiatedOut = JSON.parse(filiatedFix.stdout);
  assert.equal(idleOut.verdict, "filiated");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "foundling");
  assert.equal(seededOut.alarm, true);
  assert.equal(filiatedOut.verdict, "filiated");
  assert.equal(filiatedOut.hold, true);
});

test("handle exposes published hypothesis and #93889 headline", () => {
  const result = handle(seedFoundling());
  assert.equal(result.published.issue, 93889);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93794, 93126, 88702, 92583, 91523, 81462, 93880, 93387]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93954));
  assert.ok(!result.published.backups.includes(93889));
  assert.match(result.published.hypothesis, /session-scoped|agent-scoped|TaskStop|NON-BINDING|#93889/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93889/);
  assert.equal(result.published.pollLoop, POLL_LOOP);
  assert.equal(result.published.desktopApp, DESKTOP_APP);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a foundling-hospital / parish-ward booth, not gleaner or crasis", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.match(page, /Nunito Sans|Nunito\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /foundling|filiated|subagent-bash-outlive|hatch|ward|cradle|token/i);
  assert.match(page, /#F3EDE3|#1E1A17|#A84B5C|#B08D57|#3E6B5A|#FAF7F1/i);
  assert.match(page, /\bfiliated\b/);
  assert.match(page, /\bfoundling\b/);
  assert.match(page, /subagent-bash-outlive/);
  assert.match(page, /Score foundling or admit filiated/i);
  assert.match(page, /#93794|#93126|#88702|#92583|#91523|#81462|#93880|#93387|cousin/i);
  assert.match(page, /#333/);
  assert.match(page, /#93889/);
  assert.match(page, /Admit filiated/);
  assert.match(page, /Score foundling/);
  assert.match(page, /Walk subagent-bash-outlive/);
  assert.match(page, /Compare filiated \/ foundling/);
  assert.match(page, /Pin idle filiated/);
  assert.match(page, /Pin seeded foundling/);
  assert.match(page, /Pin subagent-bash-outlive/);
  assert.match(page, /Turn the foundling wheel/);
  assert.match(page, /2\.1\.260|1\.52386\.3|until false|TaskStop|Background tasks/i);
  assert.match(page, /foundling|hatch|ward|linen|cradle|brass token|parish/i);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /#1A1520/);
  assert.doesNotMatch(page, /#F4ECDF/);
  assert.doesNotMatch(page, /#B83A2E/);
  assert.doesNotMatch(page, /#2F6F5E/);
  assert.doesNotMatch(page, /#0E140C/);
  assert.doesNotMatch(page, /#E8D9A8/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#C41E6A/);
  assert.doesNotMatch(page, /#121417/);
  assert.doesNotMatch(page, /#C8CED6/);
  assert.doesNotMatch(page, /#B87333/);
  assert.doesNotMatch(page, /#2C2118/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7A1F1F/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field|gleaner.s field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /compositor|foul-proof|geta-tofu|type case|rice-paper/i);
  assert.doesNotMatch(page, /privacy pane|limestone|mica grout|tesserae/i);
  assert.doesNotMatch(page, /fused ligature|manuscript crasis|store drawer/i);
  assert.doesNotMatch(page, /cavalry|dispatch-rider|headersHelper|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parchment scrape|rasure|CreationTime/i);
  assert.doesNotMatch(page, /intake board|foundling-home intake/i);
  assert.doesNotMatch(page, /millimeter|woodworking|dovetail|mortise/i);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
  assert.doesNotMatch(page, /\bverbatim\b/);
  assert.doesNotMatch(page, /\bmojibaked\b/);
  assert.doesNotMatch(page, /fffd-spall/);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd/);
  assert.doesNotMatch(page, /\bvested\b/);
  assert.doesNotMatch(page, /\bunseised\b/);
  assert.doesNotMatch(page, /preview-eperm/);
  assert.doesNotMatch(page, /\bunitary\b/);
  assert.doesNotMatch(page, /\btessellated\b/);
  assert.doesNotMatch(page, /version-path-tcc/);
  assert.doesNotMatch(page, /\binjective\b/);
  assert.doesNotMatch(page, /\bcrased\b/);
  assert.doesNotMatch(page, /store-slug-collide/);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\bcredentialed\b/);
  assert.doesNotMatch(page, /\boutridden\b/);
  assert.doesNotMatch(page, /early-connect/);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Waif/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Foundling/);
  assert.match(readme, /#93889/);
  assert.match(readme, /\bfiliated\b/);
  assert.match(readme, /\bfoundling\b/);
  assert.match(readme, /subagent-bash-outlive/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /2\.1\.260|1\.52386\.3|until false|TaskStop|Background tasks/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/foundling/);
  assert.match(readme, /node --test projects\/foundling\/foundling\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /foundling|hatch|ward|linen|cradle|parish/i);
  assert.match(readme, /Score foundling or admit filiated/);
  assert.match(readme, /#93794|#93126|#88702|#92583|#91523|#81462|#93880|#93387/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93821|#93811|#93809|#93823|#93924|#93925|#93954/);
  assert.match(readme, /17:50/);
  assert.match(readme, /NOT #93794/);
});

test("catalog features Foundling only; Crasis unfeatured; product count 333", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 333);
  assert.equal(hub.products.length, 333);
  assert.equal(catalog.products[0].name, "Foundling");
  assert.equal(catalog.products[0].slug, "foundling");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/foundling/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /17:50 foundling|#93889|hatch|filiated|subagent-bash-outlive/i);
  assert.match(catalog.products[0].summary, /\bfiliated\b/);
  assert.match(catalog.products[0].summary, /\bfoundling\b/);
  assert.match(catalog.products[0].summary, /subagent-bash-outlive/);
  assert.match(catalog.products[0].summary, /Score foundling or admit filiated/);
  assert.equal(hub.products[0].slug, "foundling");
  assert.equal(hub.products[0].featured, true);
  const crasis = catalog.products.find((row) => row.slug === "crasis");
  assert.ok(crasis);
  assert.equal(crasis.featured, false);
  const tessera = catalog.products.find((row) => row.slug === "tessera");
  assert.ok(tessera);
  assert.equal(tessera.featured, false);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "foundling").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93889") && row.slug !== "foundling"));
});

test("vercel rewrites foundling to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/foundling");
  assert.equal(vercel.rewrites[0].destination, "/projects/foundling");
  assert.equal(vercel.rewrites[1].source, "/foundling/");
  assert.equal(vercel.rewrites[1].destination, "/projects/foundling");
  assert.equal(vercel.rewrites[2].source, "/foundling/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/foundling/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
