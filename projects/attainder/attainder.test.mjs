import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ATTAINDER_WALK,
  AUTHOR,
  AWAITING,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  COURT_STATIONS,
  DEFAULT_REASON,
  DENIAL_KIND,
  DENIAL_STRING,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MCP_RECONNECT_SERVER,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESET_FN,
  RETIRE_FLAG,
  RETIRE_FN,
  RETIREMENT_FN,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  TOOL_NAME,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDesk,
  inspectReset,
  inspectRoll,
  inspectSeal,
  inspectStamp,
  readCourt,
  score,
  scoreGate,
  scoreWalk,
  seedAllowListed,
  seedAttainder,
  seedAttainted,
  seedControlResponse,
  seedDefaultInterrupt,
  seedGenuineNo,
  seedHardcodedDenial,
  seedHold,
  seedHonestOutcome,
  seedMcpReconnect,
  seedNoKeypress,
  seedNoPrompt,
  seedParkedPermission,
  seedRetireParked,
  seedRetireParkedFalse,
  seedSessionReset,
  seedSublimeBatch,
  seedUntainted,
  seedUserRejectedStamp,
} from "./attainder.mjs";

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
  return fileURLToPath(new URL("./attainder.mjs", import.meta.url));
}

test("idle untainted is a hold; a real user rejection of a shown prompt is correctly labeled", () => {
  const result = analyze(seedUntainted());
  assert.equal(result.verdict, "untainted");
  assert.equal(result.idleWord, "untainted");
  assert.equal(IDLE_WORD, "untainted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.untainted, true);
  assert.equal(result.phrase, "admit untainted");
  assert.equal(result.attainted, false);
  assert.equal(result.retireParked, false);
  assert.equal(result.genuineNo, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify untainted", () => {
  assert.equal(classify(emptyTicket()), "untainted");
  assert.equal(classify(""), "untainted");
  assert.equal(classify(null), "untainted");
  assert.equal(decide({}), "untainted");
});

test("#93529 seeded path scores attainted when retirement stamps user-rejected with no prompt and no keypress", () => {
  const result = analyze(seedAttainted());
  assert.equal(result.verdict, "attainted");
  assert.equal(result.seededWord, "attainted");
  assert.equal(SEEDED_WORD, "attainted");
  assert.equal(PRODUCT_WORD, "attainder");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.attainted, true);
  assert.equal(result.phrase, "score attainder");
  assert.equal(result.allowListed, true);
  assert.equal(result.noPrompt, true);
  assert.equal(result.noKeypress, true);
  assert.equal(result.sessionReset, true);
  assert.equal(result.parkedPermission, true);
  assert.equal(result.hardcodedDenial, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("allow-listed plus no prompt plus session-reset retirement is the #93529 attainder", () => {
  const roll = inspectRoll({
    attainted: true,
    allowListed: true,
    noPrompt: true,
  });
  assert.equal(roll.stamp, "rolled");
  assert.equal(roll.allowListed, true);
  const scored = scoreGate({
    attainted: true,
    allowListed: true,
    noPrompt: true,
    noKeypress: true,
    sessionReset: true,
    parkedPermission: true,
    hardcodedDenial: true,
    cue: "attainted",
  });
  assert.equal(scored.verdict, "attainted");
  assert.equal(scored.retireParked, false);
  const calm = inspectSeal({ untainted: true, promptShown: true, genuineNo: true });
  assert.equal(calm.stamp, "untainted");
});

test("path word is retire-parked; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "retire-parked");
  const result = analyze(seedRetireParked());
  assert.equal(result.verdict, "retire-parked");
  assert.equal(result.pathWord, "retire-parked");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "retire-parked", preferSeed: true, attainted: true }),
    "retire-parked",
  );
  assert.equal(classify(seedNoPrompt()), "no-prompt");
});

test("HOLD includes untainted / hold", () => {
  assert.ok(HOLD.includes("untainted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: allow-listed, no-prompt, session-reset, parked-permission, hardcoded-denial, retire-parked", () => {
  assert.equal(classify(seedAllowListed()), "allow-listed");
  assert.equal(classify(seedNoPrompt()), "no-prompt");
  assert.equal(classify(seedNoKeypress()), "no-keypress");
  assert.equal(classify(seedSessionReset()), "session-reset");
  assert.equal(classify(seedParkedPermission()), "parked-permission");
  assert.equal(classify(seedControlResponse()), "control-response");
  assert.equal(classify(seedDefaultInterrupt()), "default-interrupt");
  assert.equal(classify(seedHardcodedDenial()), "hardcoded-denial");
  assert.equal(classify(seedUserRejectedStamp()), "user-rejected-stamp");
  assert.equal(classify(seedMcpReconnect()), "mcp-reconnect");
  assert.equal(classify(seedSublimeBatch()), "sublime-batch");
  assert.equal(classify(seedRetireParkedFalse()), "retire-parked-false");
  assert.equal(classify(seedHonestOutcome()), "honest-outcome");
  assert.equal(classify(seedGenuineNo()), "genuine-no");
  assert.equal(classify(seedAttainder()), "attainder");
});

test("booth fixtures flip untainted vs attainted vs retire-parked vs attainder", () => {
  const idle = scoreGate(seedUntainted());
  const seeded = scoreGate(readData("attainted.json"));
  const untainted = readData("untainted.json");
  const attainted = readData("attainted.json");
  const path = readData("retire-parked.json");
  const product = readData("attainder.json");
  assert.equal(idle.verdict, "untainted");
  assert.equal(seeded.verdict, "attainted");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUntainted()), "untainted");
  assert.equal(score(readData("attainted.json")), "attainted");
  assert.equal(untainted.genuineNo, true);
  assert.equal(untainted.untainted, true);
  assert.equal(scoreGate(untainted).verdict, "untainted");
  assert.equal(attainted.noPrompt, true);
  assert.equal(attainted.hardcodedDenial, true);
  assert.equal(attainted.parkedPermission, true);
  assert.equal(classify(attainted), "attainted");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /permissions\.allow/);
  assert.match(path.paths[2].result, /iron stamp/);
  assert.equal(classify(path), "retire-parked");
  assert.equal(classify(product), "attainder");
  assert.equal(product.hubCount, "ATTAINDER");
  assert.equal(attainted.issue, 93529);
  assert.equal(attainted.attainted, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("untainted"));
  assert.ok(CHIPS.includes("attainted"));
  assert.ok(CHIPS.includes("attainder"));
  assert.ok(CHIPS.includes("retire-parked"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("attainted"));
  assert.ok(ALARM.includes("retire-parked"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published attainder walk scores attainted after the idle hold", () => {
  const court = scoreWalk({ rows: ATTAINDER_WALK });
  assert.equal(court.verdict, "attainted");
  assert.ok(court.attaintedCount >= 1);
  const idle = court.rows.find((row) => row.event === "cue-untainted");
  assert.equal(idle.untainted, true);
  assert.equal(idle.verdict, "untainted");
  const allow = court.rows.find((row) => row.event === "allow-listed");
  assert.equal(allow.allowListed, true);
  const prompt = court.rows.find((row) => row.event === "no-prompt");
  assert.equal(prompt.attainted, true);
  const reset = court.rows.find((row) => row.event === "session-reset");
  assert.equal(reset.sessionReset, true);
  const denial = court.rows.find((row) => row.event === "hardcoded-denial");
  assert.equal(denial.hardcodedDenial, true);
  const path = court.rows.find((row) => row.event === "retire-parked");
  assert.equal(path.verdict, "retire-parked");
});

test("ATTAINDER_WALK constant matches the issue court walk", () => {
  assert.equal(ATTAINDER_WALK[0].event, "cue-untainted");
  const allow = ATTAINDER_WALK.find((row) => row.event === "allow-listed");
  assert.equal(allow.allowListed, true);
  const path = ATTAINDER_WALK.find((row) => row.event === "retire-parked");
  assert.equal(path.attainted, true);
  const scoreRow = ATTAINDER_WALK.find((row) => row.event === "attainder");
  assert.equal(scoreRow.attainted, true);
});

test("positive control genuine-no stays untainted", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "untainted");
  const genuine = walk.rows.find((row) => row.event === "genuine-no");
  assert.equal(genuine.verdict, "untainted");
  const honest = walk.rows.find((row) => row.event === "honest-outcome");
  assert.equal(honest.honestOutcome, true);
  assert.equal(honest.verdict, "untainted");
});

test("issue constants encode only #93529 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93529);
  assert.ok(ISSUE_URL.includes("93529"));
  assert.match(TITLE, /toolDenialKind:"user-rejected"/);
  assert.match(TITLE, /internal session reset/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:tools"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(AUTHOR, "dpc00");
  assert.equal(FILED, "2026-09-11T03:45:10Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.268");
  assert.equal(OS, "Windows x64");
  assert.equal(CLIENT, "claude.exe native Windows x64");
  assert.match(DISTRIBUTION, /claude-code-win32-x64/);
  assert.equal(
    SESSION_KIND,
    "native Windows x64; parked-permission retirement after /mcp reconnect; mcp__sublime-mcp__batch; zero visible prompt",
  );
  assert.equal(TOOL_NAME, "mcp__sublime-mcp__batch");
  assert.equal(MCP_RECONNECT_SERVER, "github");
  assert.equal(DENIAL_KIND, "user-rejected");
  assert.match(DENIAL_STRING, /The user doesn't want to proceed with this tool use/);
  assert.equal(DEFAULT_REASON, "interrupt");
  assert.equal(RESET_FN, "md()");
  assert.equal(RETIRE_FN, "Lo()");
  assert.equal(RETIREMENT_FN, "Uu()");
  assert.equal(RETIRE_FLAG, "retireParkedPermission:false");
  assert.equal(AWAITING, "control_response");
  assert.equal(COURT_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("retire-parked"));
  assert.ok(FINGERPRINT_LINES.includes("attainted"));
  assert.match(PHRASE, /score attainder or admit untainted/);
});

test("has-repro fingerprints encode the published false stamp", () => {
  const result = handle(readData("attainted.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "dpc00");
  assert.equal(
    result.published.sessionKind,
    "native Windows x64; parked-permission retirement after /mcp reconnect; mcp__sublime-mcp__batch; zero visible prompt",
  );
  assert.equal(result.published.denialKind, "user-rejected");
  assert.match(
    fingerprint(seedAttainted()),
    /attainted\|roll=allow\|desk=parked\|reset=md\|stamp=interrupt\|seal=user-rejected\|path=retire-parked\|cue=attainted/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Sourdine and Forksink", () => {
  const required = [
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "lodged",
    "dropped",
    "forksink",
    "source-fork",
    "kindled",
    "painted",
    "foxfire",
    "never-turns",
    "flushed",
    "lagged",
    "one-behind",
    "pentimento",
    "solitary",
    "twinlinked",
    "bridge-refuse",
    "vinculum",
    "hit",
    "flattened",
    "string-carrier",
    "cachet",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("untainted court flips attainted back when a genuine prompt no is correctly labeled", () => {
  const tape = {
    untainted: true,
    attainted: false,
    promptShown: true,
    genuineNo: true,
    noPrompt: false,
    cue: "untainted",
  };
  assert.equal(scoreGate(tape).verdict, "untainted");
  tape.untainted = false;
  tape.attainted = true;
  tape.allowListed = true;
  tape.noPrompt = true;
  tape.noKeypress = true;
  tape.sessionReset = true;
  tape.parkedPermission = true;
  tape.hardcodedDenial = true;
  tape.cue = "attainted";
  assert.equal(scoreGate(tape).verdict, "attainted");
  tape.untainted = true;
  tape.attainted = false;
  tape.hardcodedDenial = false;
  tape.noPrompt = false;
  tape.promptShown = true;
  tape.genuineNo = true;
  tape.cue = "untainted";
  assert.equal(scoreGate(tape).verdict, "untainted");
});

test("roll, desk, reset, stamp, seal, and readCourt mark attainted after retirement", () => {
  const idle = inspectRoll({ untainted: true, allowListed: false });
  assert.equal(idle.stamp, "blank");
  const roll = inspectRoll({
    attainted: true,
    allowListed: true,
    noPrompt: true,
  });
  assert.equal(roll.stamp, "rolled");
  assert.equal(roll.allowListed, true);
  const desk = inspectDesk({
    attainted: true,
    parkedPermission: true,
    awaitingControl: true,
  });
  assert.equal(desk.stamp, "parked");
  assert.equal(desk.parked, true);
  const reset = inspectReset({
    attainted: true,
    sessionReset: true,
    mcpReconnect: true,
  });
  assert.equal(reset.stamp, "reset");
  assert.equal(reset.reset, true);
  const stamp = inspectStamp({
    attainted: true,
    defaultInterrupt: true,
    retireParked: true,
  });
  assert.equal(stamp.stamp, "interrupt");
  assert.equal(stamp.lowered, true);
  const seal = inspectSeal({
    attainted: true,
    hardcodedDenial: true,
    userRejectedStamp: true,
  });
  assert.equal(seal.stamp, "attainted");
  assert.equal(seal.falseStamp, true);
  const court = readCourt({
    attainted: true,
    allowListed: true,
    noPrompt: true,
    sessionReset: true,
    parkedPermission: true,
    hardcodedDenial: true,
  });
  assert.equal(court.attainted, true);
  assert.equal(court.mark, "attainted");
  const calm = readCourt({
    untainted: true,
    attainted: false,
    promptShown: true,
    genuineNo: true,
  });
  assert.equal(calm.attainted, false);
  assert.equal(calm.mark, "untainted");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 86001);
  assert.equal(COUSINS[1].issue, 51674);
  assert.equal(COUSINS[2].issue, 47282);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("sump"));
  assert.ok(NOT_PRODUCTS.includes("spillway"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93475);
  assert.equal(BACKUPS[1].issue, 93439);
  assert.equal(BACKUPS[2].issue, 93438);
  assert.equal(BACKUPS[3].issue, 93466);
  assert.equal(BACKUPS[4].issue, 93495);
  assert.equal(BACKUPS[5].issue, 93508);
  assert.equal(BACKUPS[6].issue, 93507);
  assert.equal(BACKUPS[7].issue, 93512);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/attainted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "untainted");
  assert.equal(JSON.parse(seeded.stdout).verdict, "attainted");
});

test("handle exposes published hypothesis and #93529 headline", () => {
  const result = handle(readData("attainted.json"));
  assert.equal(result.published.issue, 93529);
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "dpc00");
  assert.deepEqual(result.published.cousins, [86001, 51674, 47282]);
  assert.ok(result.published.backups.includes(93475));
  assert.ok(result.published.backups.includes(93508));
  assert.ok(result.published.backups.includes(93507));
  assert.ok(result.published.backups.includes(93512));
  assert.match(result.published.hypothesis, /session-reset path md\(\)/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a parchment court-of-attainder booth, not a concert hall or storm-drain", () => {
  const page = readPage();
  assert.match(page, /Old Standard TT/);
  assert.match(page, /Public Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /attainder|bill-of-attainder|court-of-attainder|wax seal|iron stamp|rolled parchment|clerk desk/i);
  assert.match(page, /#E8DFC8|#1A1510|#8B1E1E|#4A4A48|#2C2416|#F0E6A8/i);
  assert.match(page, /\buntainted\b/);
  assert.match(page, /attainted/);
  assert.match(page, /retire-parked/);
  assert.match(page, /score attainder or admit untainted/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /14:50/);
  assert.match(page, /#286/);
  assert.match(page, /#93529/);
  assert.match(page, /dpc00/);
  assert.match(page, /2\.1\.268/);
  assert.match(page, /toolDenialKind/);
  assert.match(page, /user-rejected/);
  assert.match(page, /parked-permission|parked permission/i);
  assert.match(page, /Unroll the bill/);
  assert.match(page, /Score attainder/);
  assert.match(page, /Stamp the seal/);
  assert.match(page, /Compare clerk \/ court/);
  assert.match(page, /Pin idle untainted/);
  assert.match(page, /Pin seeded attainted/);
  assert.match(page, /Pin retire-parked/);
  assert.match(page, /Clear the docket/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Eczar/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /#1a1218/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F2C14E/);
  assert.doesNotMatch(page, /#6B2D3C/);
  assert.doesNotMatch(page, /#12151a/);
  assert.doesNotMatch(page, /#FFB020/);
  assert.doesNotMatch(page, /#3ECFBF/);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\bvoiced\b/);
  assert.doesNotMatch(page, /\bmuted\b/);
  assert.doesNotMatch(page, /\bmid-narration\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bdropped\b/);
  assert.doesNotMatch(page, /\bsource-fork\b/);
  assert.doesNotMatch(page, /\bkindled\b/);
  assert.doesNotMatch(page, /\bpainted\b/);
  assert.doesNotMatch(page, /\bnever-turns\b/);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Strobe/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Attainder/);
  assert.match(readme, /#93529/);
  assert.match(readme, /\buntainted\b/);
  assert.match(readme, /attainted/);
  assert.match(readme, /retire-parked/);
  assert.match(readme, /Old Standard TT/);
  assert.match(readme, /Public Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /NOT Vinculum/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /2\.1\.268/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/attainder/);
  assert.match(readme, /node --test projects\/attainder\/attainder\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /bill-of-attainder|court-of-attainder|wax seal|iron stamp|parchment/i);
  assert.match(readme, /#86001/);
  assert.match(readme, /#51674/);
  assert.match(readme, /#47282/);
  assert.match(readme, /toolDenialKind/);
  assert.match(readme, /parked-permission|parked permission/i);
});

test("catalog features Attainder only; Sourdine unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 286);
  assert.equal(hub.products.length, 286);
  assert.equal(catalog.products[0].name, "Attainder");
  assert.equal(catalog.products[0].slug, "attainder");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/attainder/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /14:50/);
  assert.match(catalog.products[0].summary, /attainder/);
  assert.match(catalog.products[0].summary, /#93529/);
  assert.match(catalog.products[0].summary, /\buntainted\b/);
  assert.match(catalog.products[0].summary, /attainted/);
  assert.match(catalog.products[0].summary, /retire-parked/);
  assert.equal(hub.products[0].slug, "attainder");
  assert.equal(hub.products[0].featured, true);
  const sourdine = catalog.products.find((row) => row.slug === "sourdine");
  assert.ok(sourdine);
  assert.equal(sourdine.featured, false);
  const forksink = catalog.products.find((row) => row.slug === "forksink");
  assert.ok(forksink);
  assert.equal(forksink.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "attainder").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93529") && row.slug !== "attainder"));
});

test("vercel rewrites attainder to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/attainder");
  assert.equal(vercel.rewrites[0].destination, "/projects/attainder");
  assert.equal(vercel.rewrites[1].source, "/attainder/");
  assert.equal(vercel.rewrites[1].destination, "/projects/attainder");
  assert.equal(vercel.rewrites[2].source, "/attainder/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/attainder/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
