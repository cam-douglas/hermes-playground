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
  DISTRIBUTION,
  ERROR_SIGNATURE,
  EVIDENCE_ROWS,
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
  MESSAGE_ID,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_TMESIS_PROOF,
  SEEDED_WORD,
  SESSION_ID,
  SLASH_COMMAND,
  STATE,
  STU_UUID,
  SURFACE,
  TITLE,
  TMESIS_WALK,
  TOOL_USE_ID,
  VERDICTS,
  analyze,
  assembleRequest,
  chainParentUuid,
  classify,
  decide,
  deferInjection,
  detectOrphanResult,
  emptyTicket,
  fingerprint,
  handle,
  inspectFourHundred,
  inspectLocalCommand,
  inspectOrphan,
  inspectParentBreak,
  inspectSlashEffort,
  mapTmesis,
  observeAdvisorFlight,
  readBooth,
  score,
  scoreGate,
  scoreMidInject,
  scoreWalk,
  seedBound,
  seedContiguous,
  seedFourHundred,
  seedJoined,
  seedMidInject,
  seedProduct,
  seedTmesis,
  spliceSlashCommand,
} from "./tmesis.mjs";

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
  return fileURLToPath(new URL("./tmesis.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "21:50 tmesis: a manuscript / rhetoric / spliced parchment / editorial desk booth for #86198. Running a slash command (/effort) while advisor is in flight injects local_command records mid-message and permanently 400s the session. Idle contiguous / seeded tmesis / path mid-inject. Score tmesis or admit contiguous.";

test("idle contiguous is a hold; defer local_command until the advisor clause closes", () => {
  const result = analyze(seedContiguous());
  assert.equal(result.verdict, "contiguous");
  assert.equal(result.idleWord, "contiguous");
  assert.equal(IDLE_WORD, "contiguous");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.contiguous, true);
  assert.equal(result.phrase, "admit contiguous");
  assert.equal(result.tmesis, false);
  assert.equal(result.midInject, false);
  assert.ok(HOLD_ALIASES.includes("joined"));
  assert.ok(HOLD_ALIASES.includes("uncut"));
  assert.ok(HOLD_ALIASES.includes("bound"));
  assert.ok(HOLD_ALIASES.includes("clause-shut"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "lasting");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "single");
  assert.notEqual(IDLE_WORD, "pledged");
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
});

test("empty ticket and empty stdin classify contiguous", () => {
  assert.equal(classify(emptyTicket()), "contiguous");
  assert.equal(classify(""), "contiguous");
  assert.equal(classify(null), "contiguous");
  assert.equal(decide({}), "contiguous");
});

test("#86198 seeded path scores tmesis when the slash ribbon cuts the wet clause", () => {
  const result = analyze(seedTmesis());
  assert.equal(result.verdict, "tmesis");
  assert.equal(result.seededWord, "tmesis");
  assert.equal(SEEDED_WORD, "tmesis");
  assert.equal(PRODUCT_WORD, "tmesis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.tmesis, true);
  assert.equal(result.phrase, "score tmesis");
  assert.equal(result.midInject, true);
  assert.equal(result.fourHundred, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "vedette");
  assert.notEqual(SEEDED_WORD, "orloj");
  assert.notEqual(SEEDED_WORD, "brisure");
  assert.notEqual(PATH_WORD, "idle-exit");
  assert.notEqual(PATH_WORD, "half-life");
  assert.notEqual(PATH_WORD, "orphan-tick");
});

test("educational mid-inject helper encodes published contiguous vs mid-inject paths", () => {
  assert.equal(CODE_BUILD, "2.1.226");
  assert.equal(SLASH_COMMAND, "/effort");
  assert.equal(TOOL_USE_ID, "srvtoolu_01MF7bundmTNou6yC7iNqAs6");
  assert.equal(MESSAGE_ID, "msg_011CdyMt");
  assert.equal(SESSION_ID, "f11035d0-7407-4b01-8b8a-b9aaf785457d");
  const wet = observeAdvisorFlight({ inFlight: true, messageClosed: false });
  assert.equal(wet.inFlight, true);
  const shut = observeAdvisorFlight({ contiguous: true });
  assert.equal(shut.inFlight, false);
  const splice = spliceSlashCommand({ inFlight: true, command: "/effort" });
  assert.equal(splice.injected, true);
  const deferred = spliceSlashCommand({ contiguous: true, command: "/effort" });
  assert.equal(deferred.deferred, true);
  const broken = chainParentUuid({});
  assert.equal(broken.broken, true);
  assert.equal(broken.parentUuid, "4867dfdb");
  const held = chainParentUuid({ contiguous: true });
  assert.equal(held.broken, false);
  assert.equal(held.parentUuid, STU_UUID);
  const orphan = detectOrphanResult({});
  assert.equal(orphan.orphan, true);
  const dropped = detectOrphanResult({ dropOrphans: true });
  assert.equal(dropped.dropped, true);
  const fail = assembleRequest({});
  assert.equal(fail.status, 400);
  assert.match(fail.error, /unexpected tool_use_id/);
  const ok = assembleRequest({ contiguous: true });
  assert.equal(ok.status, 200);
  const wait = deferInjection({ messageClosed: true });
  assert.equal(wait.deferred, true);
  const early = deferInjection({ messageClosed: false });
  assert.equal(early.deferred, false);
  const scored = scoreMidInject({
    tmesis: true,
    midInject: true,
    fourHundred: true,
  });
  assert.equal(scored.tmesis, true);
  assert.equal(scored.midInject, true);
  const intactPath = scoreMidInject({ contiguous: true });
  assert.equal(intactPath.tmesis, false);
  assert.equal(intactPath.contiguous, true);
});

test("inspectors mark local-command and four-hundred seal", () => {
  const cmd = inspectLocalCommand({ tmesis: true, localCommand: true });
  assert.equal(cmd.stamp, "local-command");
  assert.equal(cmd.flagged, true);
  const seal = inspectFourHundred({ tmesis: true, fourHundred: true });
  assert.equal(seal.stamp, "four-hundred");
  assert.equal(seal.sealed, true);
  const scored = scoreGate({
    tmesis: true,
    midInject: true,
    fourHundred: true,
    cue: "tmesis",
  });
  assert.equal(scored.verdict, "tmesis");
  const open = inspectLocalCommand({ contiguous: true, tmesis: false });
  assert.equal(open.stamp, "joined");
});

test("path word is mid-inject; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "mid-inject");
  const result = analyze(seedMidInject());
  assert.equal(result.verdict, "mid-inject");
  assert.equal(result.pathWord, "mid-inject");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "mid-inject",
      preferSeed: true,
      tmesis: true,
    }),
    "mid-inject",
  );
  assert.equal(classify({ seed: "local-command", preferSeed: true }), "local-command");
  assert.equal(score(seedMidInject()), "tmesis");
});

test("HOLD includes contiguous; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("contiguous"));
  const joined = analyze(seedJoined());
  assert.equal(joined.verdict, "joined");
  assert.equal(classify({ seed: "uncut", preferSeed: true }), "uncut");
  assert.equal(classify({ seed: "bound", preferSeed: true }), "bound");
  assert.equal(classify({ seed: "clause-shut", preferSeed: true }), "clause-shut");
});

test("alarm chips: local-command, four-hundred, tmesis", () => {
  assert.equal(classify({ seed: "local-command", preferSeed: true }), "local-command");
  assert.equal(classify(seedMidInject()), "mid-inject");
  assert.equal(classify(seedProduct()), "tmesis");
  assert.equal(classify(seedFourHundred()), "four-hundred");
  assert.equal(classify({ seed: "orphan-result", preferSeed: true }), "orphan-result");
});

test("booth fixtures flip contiguous vs tmesis vs mid-inject", () => {
  const idle = scoreGate(seedContiguous());
  const seeded = scoreGate(seedTmesis());
  const contiguous = readData("contiguous.json");
  const tmesis = readData("tmesis.json");
  const issued = readData("86198.json");
  const path = readData("mid-inject.json");
  assert.equal(idle.verdict, "contiguous");
  assert.equal(seeded.verdict, "tmesis");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedContiguous()), "contiguous");
  assert.equal(score(seedTmesis()), "tmesis");
  assert.equal(score({ seed: "mid-inject", preferSeed: true }), "tmesis");
  assert.equal(contiguous.midInject, false);
  assert.equal(contiguous.contiguous, true);
  assert.equal(scoreGate(contiguous).verdict, "contiguous");
  assert.equal(tmesis.midInject, true);
  assert.equal(tmesis.fourHundred, true);
  assert.equal(classify(tmesis), "tmesis");
  assert.equal(issued.issue, 86198);
  assert.equal(classify(issued), "tmesis");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /contiguous|joined|uncut|bound|clause-shut/i);
  assert.match(path.paths[1].result, /mid-inject|local-command|orphan-result|parent-break|four-hundred/i);
  assert.equal(classify(path), "mid-inject");
  assert.equal(tmesis.hubCount, "TMESIS");
  assert.equal(tmesis.issue, 86198);
  assert.equal(tmesis.tmesis, true);
  assert.equal(classify(readData("joined.json")), "joined");
  assert.equal(classify(readData("uncut.json")), "uncut");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("clause-shut.json")), "clause-shut");
  assert.equal(classify(readData("local-command.json")), "local-command");
  assert.equal(classify(readData("orphan-result.json")), "orphan-result");
  assert.equal(classify(readData("parent-break.json")), "parent-break");
  assert.equal(classify(readData("four-hundred.json")), "four-hundred");
  assert.equal(classify(readData("slash-effort.json")), "slash-effort");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [81397, 92509, 81233, 60523]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("chain.json")), "parent-break");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("contiguous"));
  assert.ok(CHIPS.includes("tmesis"));
  assert.ok(CHIPS.includes("mid-inject"));
  assert.ok(CHIPS.includes("local-command"));
  assert.ok(CHIPS.includes("four-hundred"));
  assert.ok(CHIPS.includes("orphan-result"));
  assert.ok(CHIPS.includes("clause-shut"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("tmesis"));
  assert.ok(ALARM.includes("mid-inject"));
  assert.ok(ALARM.includes("local-command"));
  assert.ok(ALARM.includes("four-hundred"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published tmesis walk scores tmesis after the contiguous hold", () => {
  const booth = scoreWalk({ rows: TMESIS_WALK });
  assert.equal(booth.verdict, "tmesis");
  assert.ok(booth.tmesisCount >= 1);
  const idle = booth.rows.find((row) => row.event === "editorial-desk");
  assert.equal(idle.contiguous, true);
  assert.equal(idle.verdict, "contiguous");
  const cut = booth.rows.find((row) => row.event === "mid-inject");
  assert.equal(cut.midInject, true);
  const path = booth.rows.find(
    (row) => row.event === "mid-inject" && row.t === "path",
  );
  assert.equal(path.verdict, "mid-inject");
});

test("TMESIS_WALK constant matches the issue folio walk", () => {
  assert.equal(TMESIS_WALK[0].event, "editorial-desk");
  const cut = TMESIS_WALK.find((row) => row.event === "mid-inject");
  assert.equal(cut.midInject || cut.fourHundred, true);
  const path = TMESIS_WALK.find((row) => row.t === "path");
  assert.equal(path.tmesis, true);
  const scoreRow = TMESIS_WALK.find((row) => row.event === "tmesis");
  assert.equal(scoreRow.tmesis, true);
  assert.equal(scoreRow.fourHundred, true);
});

test("positive control editorial-desk folio stays contiguous", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "contiguous");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "contiguous");
  const hold = walk.rows.find((row) => row.event === "editorial-desk");
  assert.equal(hold.contiguous, true);
  assert.equal(hold.verdict, "contiguous");
});

test("issue constants encode only #86198 published facts", () => {
  assert.equal(FEATURED_ISSUE, 86198);
  assert.ok(ISSUE_URL.includes("86198"));
  assert.match(TITLE, /\/effort|advisor|local_command|400/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.226|macOS|darwin/i);
  assert.equal(BUILD, "Claude Code 2.1.226");
  assert.equal(SURFACE, "mid-inject");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "reproduced", "platform:macos", "area:core"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].content.includes("server_tool_use"), true);
  assert.equal(EVIDENCE_ROWS[1].content.includes("local_command"), true);
  assert.equal(EVIDENCE_ROWS[2].content.includes("local-command-stdout"), true);
  assert.equal(EVIDENCE_ROWS[3].orphan, true);
  assert.equal(EVIDENCE_ROWS[0].messageId, MESSAGE_ID);
  assert.equal(EVIDENCE_ROWS[3].messageId, MESSAGE_ID);
  assert.equal(EVIDENCE_ROWS[3].parentUuid, "4867dfdb");
  assert.ok(RULED_OUT.some((row) => /#81397/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#92509/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#81233/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#60523/i.test(row)));
  assert.ok(EXPECTED.some((row) => /defer|orphan|message.id/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /advisor_tool_result|server_tool_use|local_command|\/effort|parentUuid|400/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("mid-inject"));
  assert.ok(FINGERPRINT_LINES.includes("tmesis"));
  assert.equal(PHRASE, "Score tmesis or admit contiguous.");
  assert.equal(SAMPLE_TMESIS_PROOF.midInject, true);
  assert.equal(SAMPLE_TMESIS_PROOF.names.length, 6);
  assert.match(ERROR_SIGNATURE, /unexpected tool_use_id/);
  assert.equal(seedBound().seed, "bound");
});

test("has-repro fingerprints encode the published tmesis proof", () => {
  const result = handle(seedTmesis());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "mid-inject");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedTmesis()),
    /tmesis\|kind=mid-inject\|ref=orphan-result\|path=mid-inject\|cue=mid-inject/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and stationed/lasting/enrolled", () => {
  const required = [
    "stationed",
    "lasting",
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "verbatim",
    "quiet",
    "intact",
    "cleared",
    "vedette",
    "orloj",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "idle-exit",
    "half-life",
    "fork-resume",
    "brief-echo",
    "background-reset",
    "streaming-stall",
    "device-absent",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "deferred-delta",
    "phantom-prompt",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("contiguous booth flips tmesis back when the folio admits contiguous", () => {
  const tape = {
    contiguous: true,
    tmesis: false,
    midInject: false,
    cue: "contiguous",
  };
  assert.equal(scoreGate(tape).verdict, "contiguous");
  tape.contiguous = false;
  tape.tmesis = true;
  tape.midInject = true;
  tape.cue = "tmesis";
  assert.equal(scoreGate(tape).verdict, "tmesis");
  tape.contiguous = true;
  tape.tmesis = false;
  tape.midInject = false;
  tape.cue = "contiguous";
  assert.equal(scoreGate(tape).verdict, "contiguous");
});

test("local, orphan, parent, and readBooth mark the tmesis proof", () => {
  const cmd = inspectLocalCommand({ tmesis: true });
  assert.equal(cmd.stamp, "local-command");
  const seal = inspectFourHundred({ tmesis: true, fourHundred: true });
  assert.equal(seal.stamp, "four-hundred");
  assert.equal(seal.sealed, true);
  const booth = readBooth({
    tmesis: true,
    midInject: true,
    fourHundred: true,
  });
  assert.equal(booth.tmesis, true);
  assert.equal(booth.mark, "tmesis");
  const open = readBooth({
    contiguous: true,
    tmesis: false,
    midInject: false,
  });
  assert.equal(open.tmesis, false);
  assert.equal(open.mark, "contiguous");
  assert.equal(inspectOrphan({ tmesis: true, orphanResult: true }).stamp, "orphan-result");
  assert.equal(inspectParentBreak({ tmesis: true, parentBreak: true }).stamp, "parent-break");
  assert.equal(inspectSlashEffort({ tmesis: true, slashEffort: true }).stamp, "slash-effort");
});

test("mapTmesis encodes the published mid-inject", () => {
  const miss = mapTmesis({ tmesis: true, midInject: true });
  assert.equal(miss.stamp, "mid-inject");
  assert.equal(miss.holdingLane, "splice-ribbon");
  assert.equal(miss.ribbon, "tmesis");
  const clear = mapTmesis({ contiguous: true, tmesis: false });
  assert.equal(clear.stamp, "editorial-desk");
  assert.equal(clear.kindLane, "open-folio");
  assert.equal(clear.holdingLane, "editorial-desk");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [81397, 92509, 81233, 60523]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vedette"));
  assert.ok(NOT_PRODUCTS.includes("orloj"));
  assert.ok(NOT_PRODUCTS.includes("brisure"));
  assert.ok(NOT_PRODUCTS.includes("diptych"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94417);
  assert.equal(BACKUPS[8].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 86198));
  assert.ok(!COUSINS.some((row) => row.issue === 86198));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/tmesis.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const contiguousFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/contiguous.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(contiguousFix.status, 0, contiguousFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const contiguousOut = JSON.parse(contiguousFix.stdout);
  assert.equal(idleOut.verdict, "contiguous");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "tmesis");
  assert.equal(seededOut.alarm, true);
  assert.equal(contiguousOut.verdict, "contiguous");
  assert.equal(contiguousOut.hold, true);
  assert.match(contiguousOut.phrase, /admit contiguous/);
});

test("handle exposes published hypothesis and #86198 headline", () => {
  const result = handle(seedTmesis());
  assert.equal(result.published.issue, 86198);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [81397, 92509, 81233, 60523]);
  assert.ok(result.published.backups.includes(94417));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(86198));
  assert.match(
    result.published.hypothesis,
    /local_command|parentUuid|NON-BINDING|#86198/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#86198/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the contiguous page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("contiguous page is a spliced-parchment desk, not lantern or clock tower", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /tmesis|contiguous|mid-inject|open-folio|advisor-ink|splice-ribbon|editorial/i,
  );
  assert.match(page, /#F4E8D0|#2C1B12|#C43C2C|#8B1E1E|#243B55|#C4A46A|#14100C/i);
  assert.match(page, /\bcontiguous\b/);
  assert.match(page, /\btmesis\b/);
  assert.match(page, /mid-inject/);
  assert.match(page, /Score tmesis or admit contiguous/i);
  assert.match(page, /#381/);
  assert.match(page, /#86198/);
  assert.match(page, /Admit contiguous/);
  assert.match(page, /Score tmesis/);
  assert.match(page, /Walk mid-inject/);
  assert.match(page, /Compare contiguous \/ tmesis/);
  assert.match(page, /Pin idle contiguous/);
  assert.match(page, /Pin seeded tmesis/);
  assert.match(page, /Pin mid-inject/);
  assert.match(page, /Stamp four-hundred/);
  assert.match(page, /Score booth/);
  assert.match(page, /tmesis-score/);
  assert.match(
    page,
    /server_tool_use|advisor_tool_result|local_command|parentUuid|\/effort|unexpected tool_use_id/i,
  );
  assert.match(page, /open-folio|advisor-ink|splice-ribbon|parent-chain|four-hundred-seal/i);
  assert.match(
    page,
    /<svg[\s\S]*class="open-folio"|class="advisor-ink"|class="splice-ribbon"|class="parent-chain"|class="four-hundred-seal"/i,
  );
  assert.match(page, /body\.contiguous|body\.spliced|body\.mid-inject/);
  assert.match(page, /evidence-table|79113|8b3c6c8a|4867dfdb/);
  assert.doesNotMatch(page, /family=Bebas\+Neue|Bebas Neue/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.doesNotMatch(page, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /#1B2A1E|#E0A84A|#D9C7A3|#B8332A|#0A100C/);
  assert.doesNotMatch(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /cavalry vedette|outpost lantern|picket-line|field olive/i);
  assert.doesNotMatch(page, /prague orloj|astronomical clock|zodiac dial|automaton tower/i);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /admit stationed|Score vedette|idle stationed/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bdiptych\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /idle-exit/);
  assert.doesNotMatch(page, /half-life/);
  assert.doesNotMatch(page, /fork-resume/);
  assert.doesNotMatch(page, /brief-echo/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.match(page, /NOT Vedette/i);
  assert.match(page, /NOT Orloj/i);
  assert.match(page, /NOT #81397/i);
  assert.match(page, /NOT #81233/i);
  assert.match(page, /NOT #60523/i);
  assert.match(page, /#81397/);
  assert.match(page, /#92509/);
  assert.match(page, /#81233/);
  assert.match(page, /#60523/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Tmesis/);
  assert.match(readme, /#86198/);
  assert.match(readme, /\bcontiguous\b/);
  assert.match(readme, /\btmesis\b/);
  assert.match(readme, /mid-inject/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Bebas Neue/);
  assert.doesNotMatch(readme, /Share Tech Mono/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /server_tool_use|advisor_tool_result|local_command|parentUuid|\/effort/i);
  assert.match(readme, /NOT #81397/);
  assert.match(readme, /NOT #92509/);
  assert.match(readme, /NOT #81233/);
  assert.match(readme, /NOT #60523/);
  assert.match(readme, /NOT Vedette\/#94392/);
  assert.match(readme, /NOT Orloj\/#94393/);
  assert.match(readme, /#81397/);
  assert.match(readme, /#92509/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/tmesis/);
  assert.match(readme, /node --test projects\/tmesis\/tmesis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /manuscript|spliced parchment|editorial desk|rhetoric/i);
  assert.match(readme, /Score tmesis or admit contiguous/);
  assert.match(readme, /#94417|#94151/);
  assert.doesNotMatch(readme, /backup #86198|#86198 as next/);
  assert.match(readme, /21:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bvedette\b/);
  assert.doesNotMatch(readme, /\borloj\b/);
  assert.doesNotMatch(readme, /\bbrisure\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Tmesis/);
  assert.match(runLog, /21:50/);
});

test("catalog features Tmesis only; Vedette unfeatured; product count 381", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 381);
  assert.equal(hub.products.length, 381);
  assert.equal(catalog.products[0].name, "Tmesis");
  assert.equal(catalog.products[0].slug, "tmesis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/tmesis/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bcontiguous\b/);
  assert.match(catalog.products[0].summary, /\btmesis\b/);
  assert.match(catalog.products[0].summary, /mid-inject/);
  assert.match(catalog.products[0].summary, /Score tmesis or admit contiguous/);
  assert.match(catalog.products[0].summary, /#86198/);
  assert.match(catalog.products[0].summary, /21:50/);
  assert.equal(hub.products[0].slug, "tmesis");
  assert.equal(hub.products[0].featured, true);
  const vedette = catalog.products.find((row) => row.slug === "vedette");
  assert.ok(vedette);
  assert.equal(vedette.featured, false);
  const orloj = catalog.products.find((row) => row.slug === "orloj");
  assert.ok(orloj);
  assert.equal(orloj.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "tmesis" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("86198") && row.slug !== "tmesis",
    ),
  );
});

test("vercel rewrites tmesis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/tmesis");
  assert.equal(vercel.rewrites[0].destination, "/projects/tmesis");
  assert.equal(vercel.rewrites[1].source, "/tmesis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/tmesis");
  assert.equal(vercel.rewrites[2].source, "/tmesis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/tmesis/:path*");
  assert.equal(vercel.rewrites[3].source, "/vedette");
  assert.equal(vercel.rewrites[3].destination, "/projects/vedette");
});

test("no leftover clone / lantern / clock / herald content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk|outpost-lantern|picket-line|cavalry-vedette/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock|outpost lantern|picket-line clock/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
