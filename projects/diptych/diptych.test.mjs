import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DESKTOP_BUILD,
  DIPTYCH_WALK,
  DISTRIBUTION,
  EVERY_TURN,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  HOST_OS,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  MOBILE_SURFACE,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESULT_LINE,
  RULED_OUT,
  SAMPLE_DIPTYCH_PROOF,
  SEEDED_WORD,
  STATE,
  SUGGESTED_FIX,
  SURFACE,
  SYNTHETIC_PAIR,
  SYNTHETIC_REMINDER,
  SYNTHETIC_SINGLE,
  TAIL_LINE,
  TITLE,
  TOOL_NAME,
  VERDICTS,
  analyze,
  classify,
  decide,
  diagnose,
  emptyTicket,
  evaluateLeaves,
  fingerprint,
  handle,
  inspectDoubleRender,
  inspectPersistedTwice,
  inspectReminderInjected,
  inspectRestatement,
  inspectSendUserMessage,
  mapDiptych,
  readBooth,
  score,
  scoreBriefEcho,
  scoreGate,
  scoreWalk,
  seedBriefEcho,
  seedDiptych,
  seedProduct,
  seedRestatement,
  seedSendUserMessage,
  seedSingle,
} from "./diptych.mjs";

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
  return fileURLToPath(new URL("./diptych.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "18:50 diptych: a scriptorium / hinged wax-tablet / illuminated diptych booth for #94397. Remote Control (mobile) brief mode: every assistant reply rendered twice — plain text plus SendUserMessage restatement. Idle single / seeded diptych / path brief-echo. Score diptych or admit single.";

test("idle single is a hold; one reply per turn", () => {
  const result = analyze(seedSingle());
  assert.equal(result.verdict, "single");
  assert.equal(result.idleWord, "single");
  assert.equal(IDLE_WORD, "single");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.single, true);
  assert.equal(result.phrase, "admit single");
  assert.equal(result.diptych, false);
  assert.equal(result.briefEcho, false);
  assert.ok(HOLD_ALIASES.includes("once"));
  assert.ok(HOLD_ALIASES.includes("solo"));
  assert.ok(HOLD_ALIASES.includes("folio"));
  assert.ok(HOLD_ALIASES.includes("simplex"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "pledged");
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "released");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
});

test("empty ticket and empty stdin classify single", () => {
  assert.equal(classify(emptyTicket()), "single");
  assert.equal(classify(""), "single");
  assert.equal(classify(null), "single");
  assert.equal(decide({}), "single");
  assert.equal(diagnose("").verdict, "single");
});

test("#94397 seeded path scores diptych when the hinge opens a second leaf", () => {
  const result = analyze(seedDiptych());
  assert.equal(result.verdict, "diptych");
  assert.equal(result.seededWord, "diptych");
  assert.equal(SEEDED_WORD, "diptych");
  assert.equal(PRODUCT_WORD, "diptych");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.diptych, true);
  assert.equal(result.phrase, "score diptych");
  assert.equal(result.briefEcho, true);
  assert.equal(result.sendUserMessage, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "vizard");
  assert.notEqual(SEEDED_WORD, "treacle");
  assert.notEqual(SEEDED_WORD, "somnus");
  assert.notEqual(SEEDED_WORD, "cresset");
  assert.notEqual(SEEDED_WORD, "dictabelt");
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(SEEDED_WORD, "diplopia");
  assert.notEqual(PATH_WORD, "background-reset");
  assert.notEqual(PATH_WORD, "streaming-stall");
  assert.notEqual(PATH_WORD, "device-absent");
  assert.notEqual(PATH_WORD, "hold-leak");
  assert.notEqual(PATH_WORD, "segment-drop");
});

test("educational leaf helper encodes published single vs brief-echo paths", () => {
  assert.equal(CODE_BUILD, "2.1.266");
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  assert.equal(HOST_OS, "macOS 26.6.2 Apple Silicon");
  assert.equal(MOBILE_SURFACE, "Claude mobile iOS local agent mode");
  assert.equal(TOOL_NAME, "SendUserMessage");
  assert.equal(RESULT_LINE, "Message delivered to user.");
  assert.equal(TAIL_LINE, "No response requested.");
  assert.equal(EVERY_TURN, true);
  assert.equal(SYNTHETIC_SINGLE.replies, 1);
  assert.equal(SYNTHETIC_REMINDER.injected, true);
  assert.equal(SYNTHETIC_PAIR.persisted, true);
  const doubled = evaluateLeaves({ restated: true });
  assert.equal(doubled.doubled, true);
  assert.equal(doubled.synthetic, true);
  const control = evaluateLeaves({ single: true });
  assert.equal(control.doubled, false);
  const scored = scoreBriefEcho({
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
  });
  assert.equal(scored.diptych, true);
  assert.equal(scored.briefEcho, true);
  const quietPath = scoreBriefEcho({ single: true });
  assert.equal(quietPath.diptych, false);
  assert.equal(quietPath.single, true);
});

test("inspectors mark sendusermessage and reminder-injected", () => {
  const tool = inspectSendUserMessage({ diptych: true, sendUserMessage: true });
  assert.equal(tool.stamp, "sendusermessage");
  assert.equal(tool.tool, true);
  const rubric = inspectReminderInjected({ diptych: true, reminderInjected: true });
  assert.equal(rubric.stamp, "reminder-injected");
  assert.equal(rubric.injected, true);
  const scored = scoreGate({
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
    cue: "diptych",
  });
  assert.equal(scored.verdict, "diptych");
  const open = inspectSendUserMessage({ single: true, diptych: false });
  assert.equal(open.stamp, "no-tool");
});

test("path word is brief-echo; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "brief-echo");
  const result = analyze(seedBriefEcho());
  assert.equal(result.verdict, "brief-echo");
  assert.equal(result.pathWord, "brief-echo");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "brief-echo",
      preferSeed: true,
      diptych: true,
    }),
    "brief-echo",
  );
  assert.equal(classify({ seed: "sendusermessage", preferSeed: true }), "sendusermessage");
  assert.equal(score(seedBriefEcho()), "diptych");
});

test("HOLD includes single", () => {
  assert.ok(HOLD.includes("single"));
  assert.equal(HOLD.length, 1);
  assert.equal(classify({ seed: "once", preferSeed: true }), "once");
  assert.equal(classify({ seed: "solo", preferSeed: true }), "solo");
  assert.equal(classify({ seed: "folio", preferSeed: true }), "folio");
  assert.equal(classify({ seed: "simplex", preferSeed: true }), "simplex");
});

test("alarm chips: sendusermessage, brief-echo, diptych", () => {
  assert.equal(classify({ seed: "sendusermessage", preferSeed: true }), "sendusermessage");
  assert.equal(classify(seedBriefEcho()), "brief-echo");
  assert.equal(classify(seedProduct()), "diptych");
  assert.equal(classify(seedSendUserMessage()), "sendusermessage");
  assert.equal(classify(seedRestatement()), "restatement");
  assert.equal(classify({ seed: "double-render", preferSeed: true }), "double-render");
  assert.equal(classify({ seed: "94397", preferSeed: true }), "94397");
});

test("booth fixtures flip single vs diptych vs brief-echo", () => {
  const idle = scoreGate(seedSingle());
  const seeded = scoreGate(seedDiptych());
  const single = readData("single.json");
  const diptych = readData("diptych.json");
  const issued = readData("94397.json");
  const path = readData("brief-echo.json");
  assert.equal(idle.verdict, "single");
  assert.equal(seeded.verdict, "diptych");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSingle()), "single");
  assert.equal(score(seedDiptych()), "diptych");
  assert.equal(score({ seed: "brief-echo", preferSeed: true }), "diptych");
  assert.equal(single.briefEcho, false);
  assert.equal(single.single, true);
  assert.equal(scoreGate(single).verdict, "single");
  assert.equal(diptych.briefEcho, true);
  assert.equal(diptych.sendUserMessage, true);
  assert.equal(classify(diptych), "diptych");
  assert.equal(issued.issue, 94397);
  assert.equal(classify(issued), "diptych");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /single|once|solo|folio|simplex/i);
  assert.match(path.paths[1].result, /brief-echo|sendusermessage|restatement/i);
  assert.equal(classify(path), "brief-echo");
  assert.equal(diptych.hubCount, "DIPTYCH");
  assert.equal(diptych.issue, 94397);
  assert.equal(diptych.diptych, true);
  assert.equal(classify(readData("once.json")), "once");
  assert.equal(classify(readData("solo.json")), "solo");
  assert.equal(classify(readData("folio.json")), "folio");
  assert.equal(classify(readData("simplex.json")), "simplex");
  assert.equal(classify(readData("sendusermessage.json")), "sendusermessage");
  assert.equal(classify(readData("restatement.json")), "restatement");
  assert.equal(classify(readData("double-render.json")), "double-render");
  assert.equal(classify(readData("paraphrase-pair.json")), "paraphrase-pair");
  assert.equal(classify(readData("reminder-injected.json")), "reminder-injected");
  assert.equal(classify(readData("plain-not-hidden.json")), "plain-not-hidden");
  assert.equal(classify(readData("persisted-twice.json")), "persisted-twice");
  assert.equal(classify(readData("every-turn.json")), "every-turn");
  assert.equal(classify(readData("mobile-brief.json")), "mobile-brief");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [88897, 81080, 83229]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("single"));
  assert.ok(CHIPS.includes("diptych"));
  assert.ok(CHIPS.includes("brief-echo"));
  assert.ok(CHIPS.includes("sendusermessage"));
  assert.ok(CHIPS.includes("once"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(CHIPS.includes("94397"));
  assert.ok(ALARM.includes("diptych"));
  assert.ok(ALARM.includes("brief-echo"));
  assert.ok(ALARM.includes("sendusermessage"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published diptych walk scores diptych after the idle hold", () => {
  const booth = scoreWalk({ rows: DIPTYCH_WALK });
  assert.equal(booth.verdict, "diptych");
  assert.ok(booth.diptychCount >= 1);
  const idle = booth.rows.find((row) => row.event === "once");
  assert.equal(idle.single, true);
  assert.equal(idle.verdict, "single");
  const cut = booth.rows.find((row) => row.event === "brief-echo");
  assert.equal(cut.briefEcho, true);
  const path = booth.rows.find(
    (row) => row.event === "brief-echo" && row.t === "path",
  );
  assert.equal(path.verdict, "brief-echo");
});

test("DIPTYCH_WALK constant matches the issue scriptorium walk", () => {
  assert.equal(DIPTYCH_WALK[0].event, "once");
  const cut = DIPTYCH_WALK.find((row) => row.event === "brief-echo");
  assert.equal(cut.briefEcho || cut.sendUserMessage, true);
  const path = DIPTYCH_WALK.find((row) => row.t === "path");
  assert.equal(path.diptych, true);
  const scoreRow = DIPTYCH_WALK.find((row) => row.event === "diptych");
  assert.equal(scoreRow.diptych, true);
  assert.equal(scoreRow.sendUserMessage, true);
});

test("positive control once tablet stays single", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "single");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "single");
  const hold = walk.rows.find((row) => row.event === "once");
  assert.equal(hold.single, true);
  assert.equal(hold.verdict, "single");
});

test("issue constants encode only #94397 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94397);
  assert.ok(ISSUE_URL.includes("94397"));
  assert.match(TITLE, /Remote Control|SendUserMessage|brief-mode|twice/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /ios/i);
  assert.match(HOST, /1\.52386\.6|2\.1\.266|iOS|macOS 26\.6\.2/i);
  assert.match(BUILD, /2\.1\.266|1\.52386\.6/);
  assert.equal(SURFACE, "brief-echo");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "platform:ios", "area:agent-view"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#88897/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#81080/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#83229/i.test(row)));
  assert.ok(EXPECTED.some((row) => /one reply|plain|reminder/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /SendUserMessage|brief mode|twice|2\.1\.266|Message delivered/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("brief-echo"));
  assert.ok(FINGERPRINT_LINES.includes("diptych"));
  assert.equal(PHRASE, "Score diptych or admit single.");
  assert.equal(SAMPLE_DIPTYCH_PROOF.briefEcho, true);
  assert.equal(SAMPLE_DIPTYCH_PROOF.names.length, 6);
  assert.equal(SAMPLE_DIPTYCH_PROOF.synthetic, true);
  assert.ok(SUGGESTED_FIX.some((row) => /suppress|stop injecting/i.test(row)));
});

test("has-repro fingerprints encode the published diptych proof", () => {
  const result = handle(seedDiptych());
  assert.equal(result.published.platform, "ios");
  assert.equal(result.published.surface, "brief-echo");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDiptych()),
    /diptych\|kind=brief-echo\|ref=sendusermessage\|path=brief-echo\|cue=brief-echo/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "pledged",
    "brisk",
    "cadence",
    "released",
    "verbatim",
    "quiet",
    "intact",
    "slack",
    "yielding",
    "extinguished",
    "idle-ok",
    "masked-true",
    "retained",
    "sticky-model",
    "held",
    "chosen",
    "vizard",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "diplopia",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "device-absent",
    "streaming-stall",
    "background-reset",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("single booth flips diptych back when the tablet admits single", () => {
  const tape = {
    single: true,
    diptych: false,
    briefEcho: false,
    cue: "single",
  };
  assert.equal(scoreGate(tape).verdict, "single");
  tape.single = false;
  tape.diptych = true;
  tape.briefEcho = true;
  tape.cue = "diptych";
  assert.equal(scoreGate(tape).verdict, "diptych");
  tape.single = true;
  tape.diptych = false;
  tape.briefEcho = false;
  tape.cue = "single";
  assert.equal(scoreGate(tape).verdict, "single");
});

test("sendusermessage, reminder-injected, and readBooth mark the diptych proof", () => {
  const tool = inspectSendUserMessage({ diptych: true });
  assert.equal(tool.stamp, "sendusermessage");
  const rubric = inspectReminderInjected({ diptych: true, reminderInjected: true });
  assert.equal(rubric.stamp, "reminder-injected");
  assert.equal(rubric.injected, true);
  const booth = readBooth({
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
  });
  assert.equal(booth.diptych, true);
  assert.equal(booth.mark, "diptych");
  const open = readBooth({
    single: true,
    diptych: false,
    briefEcho: false,
  });
  assert.equal(open.diptych, false);
  assert.equal(open.mark, "single");
  assert.equal(inspectRestatement({ diptych: true, restatement: true }).stamp, "restatement");
  assert.equal(inspectDoubleRender({ diptych: true, doubleRender: true }).stamp, "double-render");
  assert.equal(inspectPersistedTwice({ diptych: true, persistedTwice: true }).stamp, "persisted-twice");
});

test("mapDiptych encodes the published brief-echo", () => {
  const miss = mapDiptych({ diptych: true, briefEcho: true });
  assert.equal(miss.stamp, "brief-echo");
  assert.equal(miss.holdingLane, "right-leaf");
  assert.equal(miss.ribbon, "diptych");
  const clear = mapDiptych({ single: true, diptych: false });
  assert.equal(clear.stamp, "once");
  assert.equal(clear.kindLane, "hinged-tablet");
  assert.equal(clear.holdingLane, "once");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.deepEqual(COUSINS.map((row) => row.issue), [88897, 81080, 83229]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("treacle"));
  assert.ok(NOT_PRODUCTS.includes("somnus"));
  assert.ok(NOT_PRODUCTS.includes("cresset"));
  assert.ok(NOT_PRODUCTS.includes("dictabelt"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 94396);
  assert.equal(BACKUPS[11].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94397));
  assert.ok(!COUSINS.some((row) => row.issue === 94397));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/diptych.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const singleFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/single.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(singleFix.status, 0, singleFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const singleOut = JSON.parse(singleFix.stdout);
  assert.equal(idleOut.verdict, "single");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "diptych");
  assert.equal(seededOut.alarm, true);
  assert.equal(singleOut.verdict, "single");
  assert.equal(singleOut.hold, true);
  assert.match(singleOut.phrase, /admit single/);
});

test("handle exposes published hypothesis and #94397 headline", () => {
  const result = handle(seedDiptych());
  assert.equal(result.published.issue, 94397);
  assert.equal(result.published.platform, "ios");
  assert.deepEqual(result.published.cousins, [88897, 81080, 83229]);
  assert.ok(result.published.backups.includes(94396));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(result.published.backups.includes(94452));
  assert.ok(!result.published.backups.includes(94397));
  assert.match(
    result.published.hypothesis,
    /brief-mode|SendUserMessage|NON-BINDING|#94397/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94397/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the scriptorium can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("scriptorium is a diptych booth, not copper-kettle / masque-ball / moon-watch", () => {
  const page = readPage();
  assert.match(page, /family=Spectral|Spectral/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /diptych|single|brief-echo|hinged-tablet|left-leaf|reminder-rubric|right-leaf|oxidized-hinge|illuminated-choir/i,
  );
  assert.match(page, /#E8DCC8|#1C1914|#24356B|#C4A35A|#4A6B52|#7A2E2E/i);
  assert.match(page, /\bsingle\b/);
  assert.match(page, /\bdiptych\b/);
  assert.match(page, /brief-echo/);
  assert.match(page, /Score diptych or admit single/i);
  assert.match(page, /#377/);
  assert.match(page, /#94397/);
  assert.match(page, /Admit single/);
  assert.match(page, /Score diptych/);
  assert.match(page, /Walk brief-echo/);
  assert.match(page, /Compare single \/ diptych/);
  assert.match(page, /Pin idle single/);
  assert.match(page, /Pin seeded diptych/);
  assert.match(page, /Pin brief-echo/);
  assert.match(page, /Stamp sendusermessage/);
  assert.match(page, /Score booth/);
  assert.match(page, /diptych-score/);
  assert.match(
    page,
    /1\.52386\.6|2\.1\.266|SendUserMessage|brief mode|macOS 26\.6\.2/i,
  );
  assert.match(page, /hinged-tablet|left-leaf|reminder-rubric|right-leaf|oxidized-hinge|illuminated-choir/i);
  assert.match(
    page,
    /<svg[\s\S]*class="hinged-tablet"|class="left-leaf"|class="right-leaf"|class="oxidized-hinge"|class="illuminated-choir"/i,
  );
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Cormorant\+Infant|Cormorant Infant/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#4C1E0A|#C46A2B|#F8EBD4|#7A3514|#D4A84B/);
  assert.doesNotMatch(page, /#2A1830|#C9A227|#F4E8D0|#1A1220|#8B2942|#C5CBD3/);
  assert.doesNotMatch(page, /#12162E|#F3EBDD|#C5CDD8|#8B6FCF|#2E9A96/);
  assert.doesNotMatch(page, /#E07020|#2A2E33|#E8E4DC|#0E1218|#F0C14A|#3D6F8C/);
  assert.doesNotMatch(page, /copper-kettle|treacle-well|sticky-ladle|wax-paper-twist|enamel-scale|molasses-pour/);
  assert.doesNotMatch(page, /gilt-edge-vizard|half-mask|masque-ball|velvet-ribbon|looking-glass|dressing-table/);
  assert.doesNotMatch(page, /moon-watch|nursery-desk|absent-chip|cadence-dial|sleep-ledger/);
  assert.doesNotMatch(page, /iron-basket|ember-snuff|gnome-dial|battlement|hold-ledger/);
  assert.doesNotMatch(page, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /admit brisk|Score treacle|idle brisk/i);
  assert.doesNotMatch(page, /admit cadence|Score somnus|idle cadence/i);
  assert.doesNotMatch(page, /admit released|Score cresset|idle released/i);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Treacle/i);
  assert.match(page, /NOT Somnus/i);
  assert.match(page, /NOT Cresset/i);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /#88897/);
  assert.match(page, /#81080/);
  assert.match(page, /#83229/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Diptych/);
  assert.match(readme, /#94397/);
  assert.match(readme, /\bsingle\b/);
  assert.match(readme, /\bdiptych\b/);
  assert.match(readme, /brief-echo/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Infant/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Lora/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /1\.52386\.6|SendUserMessage|2\.1\.266|brief mode/i);
  assert.match(readme, /NOT #88897/);
  assert.match(readme, /NOT #81080/);
  assert.match(readme, /NOT #83229/);
  assert.match(readme, /NOT Vizard\/#94398/);
  assert.match(readme, /NOT Treacle\/#94344/);
  assert.match(readme, /NOT Somnus\/#94415/);
  assert.match(readme, /NOT Cresset\/#94420/);
  assert.match(readme, /NOT Diplopia/);
  assert.match(readme, /#88897/);
  assert.match(readme, /#81080/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/diptych/);
  assert.match(readme, /node --test projects\/diptych\/diptych\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /hinged|wax-tablet|choir-book|scriptorium|oxidized/i);
  assert.match(readme, /Score diptych or admit single/);
  assert.match(readme, /#94396|#94452|#94151/);
  assert.match(readme, /18:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /copper kettle|treacle-well|sticky-ladle|night-nursery|moon-watch|iron fire-basket|wax-belt|stenotype|masque-ball|looking-glass/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Diptych/);
  assert.match(runLog, /18:50/);
});

test("catalog features Diptych only; Vizard unfeatured; product count 377", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 377);
  assert.equal(hub.products.length, 377);
  assert.equal(catalog.products[0].name, "Diptych");
  assert.equal(catalog.products[0].slug, "diptych");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/diptych/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bsingle\b/);
  assert.match(catalog.products[0].summary, /\bdiptych\b/);
  assert.match(catalog.products[0].summary, /brief-echo/);
  assert.match(catalog.products[0].summary, /Score diptych or admit single/);
  assert.match(catalog.products[0].summary, /#94397/);
  assert.match(catalog.products[0].summary, /18:50/);
  assert.equal(hub.products[0].slug, "diptych");
  assert.equal(hub.products[0].featured, true);
  const vizard = catalog.products.find((row) => row.slug === "vizard");
  assert.ok(vizard);
  assert.equal(vizard.featured, false);
  const treacle = catalog.products.find((row) => row.slug === "treacle");
  assert.ok(treacle);
  assert.equal(treacle.featured, false);
  const somnus = catalog.products.find((row) => row.slug === "somnus");
  assert.ok(somnus);
  assert.equal(somnus.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "diptych" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94397") && row.slug !== "diptych",
    ),
  );
});

test("vercel rewrites diptych to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/diptych");
  assert.equal(vercel.rewrites[0].destination, "/projects/diptych");
  assert.equal(vercel.rewrites[1].source, "/diptych/");
  assert.equal(vercel.rewrites[1].destination, "/projects/diptych");
  assert.equal(vercel.rewrites[2].source, "/diptych/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/diptych/:path*");
  assert.equal(vercel.rewrites[3].source, "/vizard");
  assert.equal(vercel.rewrites[3].destination, "/projects/vizard");
});

test("no leftover clone / copper-kettle / masque-ball content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|ember-snuff|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
