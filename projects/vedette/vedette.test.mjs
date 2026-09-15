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
  DISABLE_ENV,
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
  IDLE_WINDOW_SEC,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLACEHOLDER,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_VEDETTE_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VEDETTE_WALK,
  VERDICTS,
  analyze,
  classify,
  decide,
  disableBackgroundTasks,
  emptyTicket,
  fingerprint,
  handle,
  honorStation,
  inspectBackgrounded,
  inspectDisable,
  inspectFalseSuccess,
  inspectSixHundred,
  inspectStopped,
  mapVedette,
  observeBackground,
  observeIdleWindow,
  readBooth,
  reportParentResult,
  score,
  scoreGate,
  scoreIdleExit,
  scoreWalk,
  seedCrewed,
  seedIdleExit,
  seedProduct,
  seedSixHundred,
  seedStationed,
  seedVedette,
} from "./vedette.mjs";

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
  return fileURLToPath(new URL("./vedette.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "20:50 vedette: a cavalry vedette / outpost lantern / picket-line booth for #94392. Headless claude -p exits with its own background subagents still running; every in-flight Task is reported stopped and the run still ends result.subtype=success, exit code 0. Idle stationed / seeded vedette / path idle-exit. Score vedette or admit stationed.";

test("idle stationed is a hold; parent stays until background Tasks return", () => {
  const result = analyze(seedStationed());
  assert.equal(result.verdict, "stationed");
  assert.equal(result.idleWord, "stationed");
  assert.equal(IDLE_WORD, "stationed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stationed, true);
  assert.equal(result.phrase, "admit stationed");
  assert.equal(result.vedette, false);
  assert.equal(result.idleExit, false);
  assert.ok(HOLD_ALIASES.includes("crewed"));
  assert.ok(HOLD_ALIASES.includes("posted"));
  assert.ok(HOLD_ALIASES.includes("vigil"));
  assert.ok(HOLD_ALIASES.includes("tethered"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
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

test("empty ticket and empty stdin classify stationed", () => {
  assert.equal(classify(emptyTicket()), "stationed");
  assert.equal(classify(""), "stationed");
  assert.equal(classify(null), "stationed");
  assert.equal(decide({}), "stationed");
});

test("#94392 seeded path scores vedette when the column marches off and vedettes stay on post", () => {
  const result = analyze(seedVedette());
  assert.equal(result.verdict, "vedette");
  assert.equal(result.seededWord, "vedette");
  assert.equal(SEEDED_WORD, "vedette");
  assert.equal(PRODUCT_WORD, "vedette");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.vedette, true);
  assert.equal(result.phrase, "score vedette");
  assert.equal(result.idleExit, true);
  assert.equal(result.sixHundred, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "orloj");
  assert.notEqual(SEEDED_WORD, "brisure");
  assert.notEqual(SEEDED_WORD, "diptych");
  assert.notEqual(PATH_WORD, "half-life");
  assert.notEqual(PATH_WORD, "fork-resume");
  assert.notEqual(PATH_WORD, "orphan-tick");
});

test("educational idle-exit helper encodes published stationed vs idle-exit paths", () => {
  assert.equal(IDLE_WINDOW_SEC, 600);
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(PLACEHOLDER, "Async agent launched successfully");
  assert.equal(DISABLE_ENV, "CLAUDE_CODE_DISABLE_BACKGROUND_TASKS");
  const fg = observeBackground({ runInBackground: false });
  assert.equal(fg.isBackgrounded, false);
  const bg = observeBackground({ omitFlag: true });
  assert.equal(bg.isBackgrounded, true);
  assert.equal(bg.placeholder, PLACEHOLDER);
  const windowed = observeIdleWindow({ sinceLastTurnSec: 651, completions: 0 });
  assert.equal(windowed.exited, true);
  const held = observeIdleWindow({ stationed: true, sinceLastTurnSec: 651, completions: 0 });
  assert.equal(held.exited, false);
  const lost = reportParentResult({ tasksStopped: 11 });
  assert.equal(lost.subtype, "success");
  assert.equal(lost.exitCode, 0);
  const wait = honorStation({ stationed: true });
  assert.equal(wait.stationed, true);
  const dropped = honorStation({ stationed: false });
  assert.equal(dropped.stationed, false);
  const workaround = disableBackgroundTasks({ enabled: true });
  assert.equal(workaround.foregroundOnly, true);
  const scored = scoreIdleExit({
    vedette: true,
    idleExit: true,
    sixHundred: true,
  });
  assert.equal(scored.vedette, true);
  assert.equal(scored.idleExit, true);
  const intactPath = scoreIdleExit({ stationed: true });
  assert.equal(intactPath.vedette, false);
  assert.equal(intactPath.stationed, true);
});

test("inspectors mark backgrounded and six-hundred idle window", () => {
  const bg = inspectBackgrounded({ vedette: true, backgrounded: true });
  assert.equal(bg.stamp, "backgrounded");
  assert.equal(bg.flagged, true);
  const six = inspectSixHundred({ vedette: true, sixHundred: true });
  assert.equal(six.stamp, "six-hundred");
  assert.equal(six.windowed, true);
  const scored = scoreGate({
    vedette: true,
    idleExit: true,
    sixHundred: true,
    cue: "vedette",
  });
  assert.equal(scored.verdict, "vedette");
  const open = inspectBackgrounded({ stationed: true, vedette: false });
  assert.equal(open.stamp, "crewed");
});

test("path word is idle-exit; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "idle-exit");
  const result = analyze(seedIdleExit());
  assert.equal(result.verdict, "idle-exit");
  assert.equal(result.pathWord, "idle-exit");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "idle-exit",
      preferSeed: true,
      vedette: true,
    }),
    "idle-exit",
  );
  assert.equal(classify({ seed: "backgrounded", preferSeed: true }), "backgrounded");
  assert.equal(score(seedIdleExit()), "vedette");
});

test("HOLD includes stationed; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("stationed"));
  const crewed = analyze(seedCrewed());
  assert.equal(crewed.verdict, "crewed");
  assert.equal(classify({ seed: "posted", preferSeed: true }), "posted");
  assert.equal(classify({ seed: "vigil", preferSeed: true }), "vigil");
  assert.equal(classify({ seed: "tethered", preferSeed: true }), "tethered");
});

test("alarm chips: backgrounded, six-hundred, vedette", () => {
  assert.equal(classify({ seed: "backgrounded", preferSeed: true }), "backgrounded");
  assert.equal(classify(seedIdleExit()), "idle-exit");
  assert.equal(classify(seedProduct()), "vedette");
  assert.equal(classify(seedSixHundred()), "six-hundred");
  assert.equal(classify({ seed: "false-success", preferSeed: true }), "false-success");
});

test("booth fixtures flip stationed vs vedette vs idle-exit", () => {
  const idle = scoreGate(seedStationed());
  const seeded = scoreGate(seedVedette());
  const stationed = readData("stationed.json");
  const vedette = readData("vedette.json");
  const issued = readData("94392.json");
  const path = readData("idle-exit.json");
  assert.equal(idle.verdict, "stationed");
  assert.equal(seeded.verdict, "vedette");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedStationed()), "stationed");
  assert.equal(score(seedVedette()), "vedette");
  assert.equal(score({ seed: "idle-exit", preferSeed: true }), "vedette");
  assert.equal(stationed.idleExit, false);
  assert.equal(stationed.stationed, true);
  assert.equal(scoreGate(stationed).verdict, "stationed");
  assert.equal(vedette.idleExit, true);
  assert.equal(vedette.sixHundred, true);
  assert.equal(classify(vedette), "vedette");
  assert.equal(issued.issue, 94392);
  assert.equal(classify(issued), "vedette");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /stationed|crewed|posted|vigil|tethered/i);
  assert.match(path.paths[1].result, /idle-exit|backgrounded|six-hundred|false-success|stopped-tasks/i);
  assert.equal(classify(path), "idle-exit");
  assert.equal(vedette.hubCount, "VEDETTE");
  assert.equal(vedette.issue, 94392);
  assert.equal(vedette.vedette, true);
  assert.equal(classify(readData("crewed.json")), "crewed");
  assert.equal(classify(readData("posted.json")), "posted");
  assert.equal(classify(readData("vigil.json")), "vigil");
  assert.equal(classify(readData("tethered.json")), "tethered");
  assert.equal(classify(readData("backgrounded.json")), "backgrounded");
  assert.equal(classify(readData("six-hundred.json")), "six-hundred");
  assert.equal(classify(readData("false-success.json")), "false-success");
  assert.equal(classify(readData("stopped-tasks.json")), "stopped-tasks");
  assert.equal(classify(readData("disable-bg.json")), "disable-bg");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [63023, 65968]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("stationed"));
  assert.ok(CHIPS.includes("vedette"));
  assert.ok(CHIPS.includes("idle-exit"));
  assert.ok(CHIPS.includes("backgrounded"));
  assert.ok(CHIPS.includes("six-hundred"));
  assert.ok(CHIPS.includes("false-success"));
  assert.ok(CHIPS.includes("tethered"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("vedette"));
  assert.ok(ALARM.includes("idle-exit"));
  assert.ok(ALARM.includes("backgrounded"));
  assert.ok(ALARM.includes("six-hundred"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published vedette walk scores vedette after the idle hold", () => {
  const booth = scoreWalk({ rows: VEDETTE_WALK });
  assert.equal(booth.verdict, "vedette");
  assert.ok(booth.vedetteCount >= 1);
  const idle = booth.rows.find((row) => row.event === "field-desk");
  assert.equal(idle.stationed, true);
  assert.equal(idle.verdict, "stationed");
  const cut = booth.rows.find((row) => row.event === "idle-exit");
  assert.equal(cut.idleExit, true);
  const path = booth.rows.find(
    (row) => row.event === "idle-exit" && row.t === "path",
  );
  assert.equal(path.verdict, "idle-exit");
});

test("VEDETTE_WALK constant matches the issue picket walk", () => {
  assert.equal(VEDETTE_WALK[0].event, "field-desk");
  const cut = VEDETTE_WALK.find((row) => row.event === "idle-exit");
  assert.equal(cut.idleExit || cut.sixHundred, true);
  const path = VEDETTE_WALK.find((row) => row.t === "path");
  assert.equal(path.vedette, true);
  const scoreRow = VEDETTE_WALK.find((row) => row.event === "vedette");
  assert.equal(scoreRow.vedette, true);
  assert.equal(scoreRow.sixHundred, true);
});

test("positive control field-desk folio stays stationed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "stationed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "stationed");
  const hold = walk.rows.find((row) => row.event === "field-desk");
  assert.equal(hold.stationed, true);
  assert.equal(hold.verdict, "stationed");
});

test("issue constants encode only #94392 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94392);
  assert.ok(ISSUE_URL.includes("94392"));
  assert.match(TITLE, /claude -p|stopped|success|exit code 0/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.270|Linux|no TTY/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "idle-exit");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:agents", "area:cli"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#63023/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#65968/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Lemure|#94410/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Followspot|#93714/i.test(row)));
  assert.ok(EXPECTED.some((row) => /foreground-only|unresolved background|non-success/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /is_backgrounded|Async agent launched|600s|651s|CLAUDE_CODE_DISABLE_BACKGROUND_TASKS|run_in_background/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("idle-exit"));
  assert.ok(FINGERPRINT_LINES.includes("vedette"));
  assert.equal(PHRASE, "Score vedette or admit stationed.");
  assert.equal(SAMPLE_VEDETTE_PROOF.idleExit, true);
  assert.equal(SAMPLE_VEDETTE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published vedette proof", () => {
  const result = handle(seedVedette());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "idle-exit");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedVedette()),
    /vedette\|kind=idle-exit\|ref=stopped-tasks\|path=idle-exit\|cue=idle-exit/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and lasting/enrolled/single", () => {
  const required = [
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

test("stationed booth flips vedette back when the picket admits stationed", () => {
  const tape = {
    stationed: true,
    vedette: false,
    idleExit: false,
    cue: "stationed",
  };
  assert.equal(scoreGate(tape).verdict, "stationed");
  tape.stationed = false;
  tape.vedette = true;
  tape.idleExit = true;
  tape.cue = "vedette";
  assert.equal(scoreGate(tape).verdict, "vedette");
  tape.stationed = true;
  tape.vedette = false;
  tape.idleExit = false;
  tape.cue = "stationed";
  assert.equal(scoreGate(tape).verdict, "stationed");
});

test("background, six, false-success, and readBooth mark the vedette proof", () => {
  const bg = inspectBackgrounded({ vedette: true });
  assert.equal(bg.stamp, "backgrounded");
  const six = inspectSixHundred({ vedette: true, sixHundred: true });
  assert.equal(six.stamp, "six-hundred");
  assert.equal(six.windowed, true);
  const booth = readBooth({
    vedette: true,
    idleExit: true,
    sixHundred: true,
  });
  assert.equal(booth.vedette, true);
  assert.equal(booth.mark, "vedette");
  const open = readBooth({
    stationed: true,
    vedette: false,
    idleExit: false,
  });
  assert.equal(open.vedette, false);
  assert.equal(open.mark, "stationed");
  assert.equal(inspectFalseSuccess({ vedette: true, falseSuccess: true }).stamp, "false-success");
  assert.equal(inspectStopped({ vedette: true, stoppedTasks: true }).stamp, "stopped-tasks");
  assert.equal(inspectDisable({ vedette: true, disableBg: true }).stamp, "disable-bg");
});

test("mapVedette encodes the published idle-exit", () => {
  const miss = mapVedette({ vedette: true, idleExit: true });
  assert.equal(miss.stamp, "idle-exit");
  assert.equal(miss.holdingLane, "six-hundred-watch");
  assert.equal(miss.ribbon, "vedette");
  const clear = mapVedette({ stationed: true, vedette: false });
  assert.equal(clear.stamp, "field-desk");
  assert.equal(clear.kindLane, "picket-line");
  assert.equal(clear.holdingLane, "field-desk");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.deepEqual(COUSINS.map((row) => row.issue), [63023, 65968]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("orloj"));
  assert.ok(NOT_PRODUCTS.includes("brisure"));
  assert.ok(NOT_PRODUCTS.includes("diptych"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 94393);
  assert.equal(BACKUPS[10].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94392));
  assert.ok(!COUSINS.some((row) => row.issue === 94392));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/vedette.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const stationedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/stationed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(stationedFix.status, 0, stationedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const stationedOut = JSON.parse(stationedFix.stdout);
  assert.equal(idleOut.verdict, "stationed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "vedette");
  assert.equal(seededOut.alarm, true);
  assert.equal(stationedOut.verdict, "stationed");
  assert.equal(stationedOut.hold, true);
  assert.match(stationedOut.phrase, /admit stationed/);
});

test("handle exposes published hypothesis and #94392 headline", () => {
  const result = handle(seedVedette());
  assert.equal(result.published.issue, 94392);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [63023, 65968]);
  assert.ok(result.published.backups.includes(94393));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94392));
  assert.match(
    result.published.hypothesis,
    /600s|stopped|NON-BINDING|#94392/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94392/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the stationed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("stationed page is a cavalry vedette picket, not clock tower or herald college", () => {
  const page = readPage();
  assert.match(page, /family=Bebas\+Neue|Bebas Neue/);
  assert.match(page, /family=IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.match(page, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.match(
    page,
    /vedette|stationed|idle-exit|picket-line|outpost-lantern|field-desk|cavalry/i,
  );
  assert.match(page, /#1B2A1E|#E0A84A|#D9C7A3|#B8332A|#0A100C/i);
  assert.match(page, /\bstationed\b/);
  assert.match(page, /\bvedette\b/);
  assert.match(page, /idle-exit/);
  assert.match(page, /Score vedette or admit stationed/i);
  assert.match(page, /#380/);
  assert.match(page, /#94392/);
  assert.match(page, /Admit stationed/);
  assert.match(page, /Score vedette/);
  assert.match(page, /Walk idle-exit/);
  assert.match(page, /Compare stationed \/ vedette/);
  assert.match(page, /Pin idle stationed/);
  assert.match(page, /Pin seeded vedette/);
  assert.match(page, /Pin idle-exit/);
  assert.match(page, /Stamp six-hundred/);
  assert.match(page, /Score booth/);
  assert.match(page, /vedette-score/);
  assert.match(
    page,
    /is_backgrounded|Async agent launched|600s|CLAUDE_CODE_DISABLE_BACKGROUND_TASKS|run_in_background/i,
  );
  assert.match(page, /picket-line|omit-post|lantern-placeholder|six-hundred-watch|stopped-vedettes|false-column/i);
  assert.match(
    page,
    /<svg[\s\S]*class="picket-line"|class="outpost-lantern"|class="field-desk"|class="cavalry-vedette"|class="signal-pennant"/i,
  );
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /prague orloj|astronomical clock|zodiac dial|automaton tower|calendar dial/i);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
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
  assert.match(page, /NOT Orloj/i);
  assert.match(page, /NOT Lemure/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT #63023/i);
  assert.match(page, /NOT #65968/i);
  assert.match(page, /#63023/);
  assert.match(page, /#65968/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Vedette/);
  assert.match(readme, /#94392/);
  assert.match(readme, /\bstationed\b/);
  assert.match(readme, /\bvedette\b/);
  assert.match(readme, /idle-exit/);
  assert.match(readme, /Bebas Neue/);
  assert.match(readme, /IBM Plex Sans/);
  assert.match(readme, /Share Tech Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /is_backgrounded|Async agent launched|600s|CLAUDE_CODE_DISABLE_BACKGROUND_TASKS|run_in_background/i);
  assert.match(readme, /NOT #63023/);
  assert.match(readme, /NOT #65968/);
  assert.match(readme, /NOT Lemure\/#94410/);
  assert.match(readme, /NOT Followspot\/#93714/);
  assert.match(readme, /NOT Orloj\/#94393/);
  assert.match(readme, /NOT Brisure\/#94396/);
  assert.match(readme, /#63023/);
  assert.match(readme, /#65968/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/vedette/);
  assert.match(readme, /node --test projects\/vedette\/vedette\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /cavalry|outpost lantern|picket-line|field-desk/i);
  assert.match(readme, /Score vedette or admit stationed/);
  assert.match(readme, /#94393|#94458|#94151/);
  assert.doesNotMatch(readme, /backup #94392|#94392 as next/);
  assert.match(readme, /20:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\borloj\b/);
  assert.doesNotMatch(readme, /\bbrisure\b/);
  assert.doesNotMatch(readme, /\bdiptych\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Vedette/);
  assert.match(runLog, /20:50/);
});

test("catalog features Vedette only; Orloj unfeatured; product count 380", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 380);
  assert.equal(hub.products.length, 380);
  assert.equal(catalog.products[0].name, "Vedette");
  assert.equal(catalog.products[0].slug, "vedette");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/vedette/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bstationed\b/);
  assert.match(catalog.products[0].summary, /\bvedette\b/);
  assert.match(catalog.products[0].summary, /idle-exit/);
  assert.match(catalog.products[0].summary, /Score vedette or admit stationed/);
  assert.match(catalog.products[0].summary, /#94392/);
  assert.match(catalog.products[0].summary, /20:50/);
  assert.equal(hub.products[0].slug, "vedette");
  assert.equal(hub.products[0].featured, true);
  const orloj = catalog.products.find((row) => row.slug === "orloj");
  assert.ok(orloj);
  assert.equal(orloj.featured, false);
  const brisure = catalog.products.find((row) => row.slug === "brisure");
  assert.ok(brisure);
  assert.equal(brisure.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "vedette" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94392") && row.slug !== "vedette",
    ),
  );
});

test("vercel rewrites vedette to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/vedette");
  assert.equal(vercel.rewrites[0].destination, "/projects/vedette");
  assert.equal(vercel.rewrites[1].source, "/vedette/");
  assert.equal(vercel.rewrites[1].destination, "/projects/vedette");
  assert.equal(vercel.rewrites[2].source, "/vedette/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/vedette/:path*");
  assert.equal(vercel.rewrites[3].source, "/orloj");
  assert.equal(vercel.rewrites[3].destination, "/projects/orloj");
});

test("no leftover clone / clock / herald / wax-tablet content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
