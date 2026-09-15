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
  DELETE_REJECT,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GHOST_IDS,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEGACY_HOME,
  LEMURE_WALK,
  LINES_PER_DAY,
  MCP_DELETE,
  MCP_LIST,
  MCP_WORKING_COUNT,
  MERCARI_ERR,
  NOT_PRODUCTS,
  OHAYO_WARN,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_LEMURE_PROOF,
  SEEDED_WORD,
  SHRINE_NAMES,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  WORKING_ROOT,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDispatcher,
  inspectLegacyPath,
  inspectMcp,
  inspectRegistry,
  inspectRestart,
  inspectUi,
  mapLemure,
  readBooth,
  rosterGhosts,
  score,
  scoreGate,
  scoreOrphanTick,
  scoreWalk,
  seedHold,
  seedLemure,
  seedMinuteTick,
  seedOrphanTick,
  seedProduct,
  seedQuiet,
} from "./lemure.mjs";

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
  return fileURLToPath(new URL("./lemure.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "10:50 lemure: a lararium / salt-bean / Lemuria-rite / household-shrine booth for #94410. Desktop ScheduledTasks manager still dispatches two deleted/legacy tasks once per minute (ohayo-morning-report, mercari-daily-sales-check). Logs show task file not found / ENOENT at legacy path ~/Claude/Scheduled/.../SKILL.md. Tasks absent from Routines UI, scheduled-tasks MCP list, on-disk ~/.claude/scheduled-tasks/, and scheduled-tasks.json. MCP delete says not found. Survives full app restart. ~1440 lines/day of log noise. Idle quiet / seeded lemure / path orphan-tick. Score lemure or admit quiet.";

test("idle quiet is a hold; no orphan minute-ticks; ghosts absent or listed and deletable", () => {
  const result = analyze(seedQuiet());
  assert.equal(result.verdict, "quiet");
  assert.equal(result.idleWord, "quiet");
  assert.equal(IDLE_WORD, "quiet");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.quiet, true);
  assert.equal(result.phrase, "admit quiet");
  assert.equal(result.lemure, false);
  assert.equal(result.orphanTick, false);
  assert.ok(HOLD_ALIASES.includes("rostered"));
  assert.ok(HOLD_ALIASES.includes("enrolled"));
  assert.ok(HOLD_ALIASES.includes("lararium"));
  assert.ok(HOLD_ALIASES.includes("stilled"));
  assert.ok(HOLD_ALIASES.includes("listed"));
  assert.ok(HOLD_ALIASES.includes("removable"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "armed");
  assert.notEqual(IDLE_WORD, "affixed");
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "primed");
  assert.notEqual(IDLE_WORD, "confirmed");
  assert.notEqual(IDLE_WORD, "blanked");
});

test("empty ticket and empty stdin classify quiet", () => {
  assert.equal(classify(emptyTicket()), "quiet");
  assert.equal(classify(""), "quiet");
  assert.equal(classify(null), "quiet");
  assert.equal(decide({}), "quiet");
});

test("#94410 seeded path scores lemure when the dispatcher walks unlisted names", () => {
  const result = analyze(seedLemure());
  assert.equal(result.verdict, "lemure");
  assert.equal(result.seededWord, "lemure");
  assert.equal(SEEDED_WORD, "lemure");
  assert.equal(PRODUCT_WORD, "lemure");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lemure, true);
  assert.equal(result.phrase, "score lemure");
  assert.equal(result.orphanTick, true);
  assert.equal(result.ghostDispatch, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "flashpan");
  assert.notEqual(SEEDED_WORD, "mirage");
  assert.notEqual(SEEDED_WORD, "deadlight");
  assert.notEqual(SEEDED_WORD, "cancellans");
  assert.notEqual(PATH_WORD, "deferred-delta");
  assert.notEqual(PATH_WORD, "lastRunAt");
});

test("educational roster helper encodes published quiet vs orphan-tick paths", () => {
  assert.deepEqual([...GHOST_IDS], [
    "ohayo-morning-report",
    "mercari-daily-sales-check",
  ]);
  assert.equal(LEGACY_HOME, "~/Claude/Scheduled/");
  assert.equal(WORKING_ROOT, "~/.claude/scheduled-tasks/");
  assert.equal(MCP_LIST, "list_scheduled_tasks");
  assert.equal(MCP_DELETE, "delete_scheduled_task");
  assert.equal(MCP_WORKING_COUNT, 33);
  assert.equal(LINES_PER_DAY, 1440);
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  assert.equal(CODE_BUILD, "2.1.270");
  assert.match(OHAYO_WARN, /ohayo-morning-report|SKILL\.md/);
  assert.match(MERCARI_ERR, /ENOENT|mercari-daily-sales-check/);
  assert.match(DELETE_REJECT, /not found/);
  const dropped = rosterGhosts({ quiet: false });
  assert.equal(dropped.orphan, true);
  assert.ok(dropped.ghosts.includes("ohayo-morning-report"));
  const control = rosterGhosts({ quiet: true });
  assert.equal(control.orphan, false);
  assert.equal(control.rostered, true);
  const listed = rosterGhosts({
    tickingIds: [...GHOST_IDS],
    uiIds: [...GHOST_IDS],
    mcpIds: [...GHOST_IDS],
    diskIds: [...GHOST_IDS],
    deleteAccepted: true,
  });
  assert.equal(listed.orphan, false);
  const none = rosterGhosts({ tickingIds: [] });
  assert.equal(none.orphan, false);
  const scored = scoreOrphanTick({
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
  });
  assert.equal(scored.lemure, true);
  assert.equal(scored.orphanTick, true);
  const quietPath = scoreOrphanTick({ quiet: true });
  assert.equal(quietPath.lemure, false);
  assert.equal(quietPath.quiet, true);
});

test("inspectors mark ghost dispatch and vanished legacy path", () => {
  const dispatch = inspectDispatcher({ lemure: true, ghostDispatch: true });
  assert.equal(dispatch.stamp, "ghost-dispatch");
  assert.equal(dispatch.ticking, true);
  const legacy = inspectLegacyPath({ lemure: true, legacyMissing: true });
  assert.equal(legacy.stamp, "legacy-path");
  assert.equal(legacy.missing, true);
  const scored = scoreGate({
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
    cue: "lemure",
  });
  assert.equal(scored.verdict, "lemure");
  const open = inspectDispatcher({ quiet: true, lemure: false });
  assert.equal(open.stamp, "dispatcher-still");
});

test("path word is orphan-tick; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "orphan-tick");
  const result = analyze(seedOrphanTick());
  assert.equal(result.verdict, "orphan-tick");
  assert.equal(result.pathWord, "orphan-tick");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "orphan-tick",
      preferSeed: true,
      lemure: true,
    }),
    "orphan-tick",
  );
  assert.equal(classify({ seed: "minute-tick", preferSeed: true }), "minute-tick");
  assert.equal(score(seedOrphanTick()), "lemure");
});

test("HOLD includes quiet / hold", () => {
  assert.ok(HOLD.includes("quiet"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: minute-tick, orphan-tick, lemure", () => {
  assert.equal(classify({ seed: "minute-tick", preferSeed: true }), "minute-tick");
  assert.equal(classify(seedOrphanTick()), "orphan-tick");
  assert.equal(classify(seedProduct()), "lemure");
  assert.equal(classify(seedMinuteTick()), "minute-tick");
  assert.equal(classify({ seed: "legacy-path", preferSeed: true }), "legacy-path");
});

test("booth fixtures flip quiet vs lemure vs orphan-tick", () => {
  const idle = scoreGate(seedQuiet());
  const seeded = scoreGate(seedLemure());
  const quiet = readData("quiet.json");
  const lemure = readData("lemure.json");
  const issued = readData("94410.json");
  const path = readData("orphan-tick.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "quiet");
  assert.equal(seeded.verdict, "lemure");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedQuiet()), "quiet");
  assert.equal(score(seedLemure()), "lemure");
  assert.equal(score({ seed: "orphan-tick", preferSeed: true }), "lemure");
  assert.equal(quiet.orphanTick, false);
  assert.equal(quiet.quiet, true);
  assert.equal(scoreGate(quiet).verdict, "quiet");
  assert.equal(lemure.orphanTick, true);
  assert.equal(lemure.ghostDispatch, true);
  assert.equal(classify(lemure), "lemure");
  assert.equal(issued.issue, 94410);
  assert.equal(classify(issued), "lemure");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /quiet|rostered|enrolled|lararium|stilled|listed|removable/i);
  assert.match(path.paths[1].result, /orphan-tick|ENOENT|legacy/i);
  assert.equal(classify(path), "orphan-tick");
  assert.equal(lemure.hubCount, "LEMURE");
  assert.equal(lemure.issue, 94410);
  assert.equal(lemure.lemure, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("rostered.json")), "rostered");
  assert.equal(classify(readData("enrolled.json")), "enrolled");
  assert.equal(classify(readData("lararium.json")), "lararium");
  assert.equal(classify(readData("stilled.json")), "stilled");
  assert.equal(classify(readData("listed.json")), "listed");
  assert.equal(classify(readData("removable.json")), "removable");
  assert.equal(classify(readData("legacy-path.json")), "legacy-path");
  assert.equal(classify(readData("enoent-skip.json")), "enoent-skip");
  assert.equal(classify(readData("mcp-absent.json")), "mcp-absent");
  assert.equal(classify(readData("ui-absent.json")), "ui-absent");
  assert.equal(classify(readData("registry-miss.json")), "registry-miss");
  assert.equal(classify(readData("restart-survives.json")), "restart-survives");
  assert.equal(classify(readData("minute-tick.json")), "minute-tick");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [93015, 92920, 92249, 91527]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("quiet"));
  assert.ok(CHIPS.includes("lemure"));
  assert.ok(CHIPS.includes("orphan-tick"));
  assert.ok(CHIPS.includes("minute-tick"));
  assert.ok(CHIPS.includes("legacy-path"));
  assert.ok(CHIPS.includes("enoent-skip"));
  assert.ok(CHIPS.includes("rostered"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lemure"));
  assert.ok(ALARM.includes("orphan-tick"));
  assert.ok(ALARM.includes("minute-tick"));
  assert.ok(ALARM.includes("legacy-path"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published lemure walk scores lemure after the idle hold", () => {
  const booth = scoreWalk({ rows: LEMURE_WALK });
  assert.equal(booth.verdict, "lemure");
  assert.ok(booth.lemureCount >= 1);
  const idle = booth.rows.find((row) => row.event === "rostered");
  assert.equal(idle.quiet, true);
  assert.equal(idle.verdict, "quiet");
  const cut = booth.rows.find((row) => row.event === "orphan-tick");
  assert.equal(cut.orphanTick, true);
  const path = booth.rows.find(
    (row) => row.event === "orphan-tick" && row.t === "path",
  );
  assert.equal(path.verdict, "orphan-tick");
});

test("LEMURE_WALK constant matches the issue shrine walk", () => {
  assert.equal(LEMURE_WALK[0].event, "rostered");
  const cut = LEMURE_WALK.find((row) => row.event === "orphan-tick");
  assert.equal(cut.orphanTick || cut.ghostDispatch, true);
  const path = LEMURE_WALK.find((row) => row.t === "path");
  assert.equal(path.lemure, true);
  const scoreRow = LEMURE_WALK.find((row) => row.event === "lemure");
  assert.equal(scoreRow.lemure, true);
  assert.equal(scoreRow.restartSurvives, true);
});

test("positive control rostered shrine stays quiet", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "quiet");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "quiet");
  const hold = walk.rows.find((row) => row.event === "rostered");
  assert.equal(hold.quiet, true);
  assert.equal(hold.verdict, "quiet");
});

test("issue constants encode only #94410 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94410);
  assert.ok(ISSUE_URL.includes("94410"));
  assert.match(TITLE, /ghost scheduled tasks|every minute|absent from UI/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /1\.52386\.6|2\.1\.270|macOS/i);
  assert.equal(BUILD, "Claude Desktop 1.52386.6; Claude Code 2.1.270; macOS 26.6.2");
  assert.equal(SURFACE, "orphan-tick");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:desktop", "area:routines"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(SHRINE_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Flashpan|#93015/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Mirage|#92920/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Deadlight|#92249/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Cancellans|#94400/i.test(row)));
  assert.ok(EXPECTED.some((row) => /stale registration|delete_scheduled_task|task file/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /ohayo-morning-report|mercari-daily-sales-check|ENOENT|1440|list_scheduled_tasks|not found/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("orphan-tick"));
  assert.ok(FINGERPRINT_LINES.includes("lemure"));
  assert.equal(PHRASE, "Score lemure or admit quiet.");
  assert.equal(SAMPLE_LEMURE_PROOF.orphanTick, true);
  assert.equal(SAMPLE_LEMURE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published lemure proof", () => {
  const result = handle(seedLemure());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "orphan-tick");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedLemure()),
    /lemure\|kind=orphan-tick\|ref=legacy-path\|path=orphan-tick\|cue=orphan-tick/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and primed/confirmed/blanked", () => {
  const required = [
    "intact",
    "cleared",
    "armed",
    "sealed",
    "latched",
    "guarded",
    "affixed",
    "unpacked",
    "draped",
    "hung",
    "screened",
    "scoped",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "primed",
    "confirmed",
    "blanked",
    "cancellans",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "flashpan",
    "mirage",
    "deadlight",
    "glowplug",
    "relict",
    "ashpan",
    "gleaner",
    "knock",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
    "root-find",
    "reload-blind",
    "deferred-delta",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("quiet booth flips lemure back when the shrine admits quiet", () => {
  const tape = {
    quiet: true,
    lemure: false,
    orphanTick: false,
    cue: "quiet",
  };
  assert.equal(scoreGate(tape).verdict, "quiet");
  tape.quiet = false;
  tape.lemure = true;
  tape.orphanTick = true;
  tape.cue = "lemure";
  assert.equal(scoreGate(tape).verdict, "lemure");
  tape.quiet = true;
  tape.lemure = false;
  tape.orphanTick = false;
  tape.cue = "quiet";
  assert.equal(scoreGate(tape).verdict, "quiet");
});

test("dispatcher, legacy, mcp, and readBooth mark the lemure proof", () => {
  const dispatch = inspectDispatcher({ lemure: true });
  assert.equal(dispatch.stamp, "ghost-dispatch");
  const legacy = inspectLegacyPath({ lemure: true, legacyMissing: true });
  assert.equal(legacy.stamp, "legacy-path");
  assert.equal(legacy.missing, true);
  const booth = readBooth({
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
  });
  assert.equal(booth.lemure, true);
  assert.equal(booth.mark, "lemure");
  const open = readBooth({
    quiet: true,
    lemure: false,
    orphanTick: false,
  });
  assert.equal(open.lemure, false);
  assert.equal(open.mark, "quiet");
  assert.equal(inspectMcp({ lemure: true, mcpAbsent: true }).stamp, "mcp-absent");
  assert.equal(inspectUi({ lemure: true, uiAbsent: true }).stamp, "ui-absent");
  assert.equal(inspectRegistry({ lemure: true, registryMiss: true }).stamp, "registry-miss");
  assert.equal(inspectRestart({ lemure: true, restartSurvives: true }).stamp, "restart-survives");
});

test("mapLemure encodes the published orphan-tick", () => {
  const miss = mapLemure({ lemure: true, orphanTick: true });
  assert.equal(miss.stamp, "orphan-tick");
  assert.equal(miss.holdingLane, "enoent-skip");
  assert.equal(miss.ribbon, "lemure");
  const clear = mapLemure({ quiet: true, lemure: false });
  assert.equal(clear.stamp, "rostered");
  assert.equal(clear.kindLane, "lararium");
  assert.equal(clear.holdingLane, "rostered");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [93015, 92920, 92249, 91527]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("deadlight"));
  assert.ok(NOT_PRODUCTS.includes("glowplug"));
  assert.ok(NOT_PRODUCTS.includes("relict"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[3].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94410));
  assert.ok(!COUSINS.some((row) => row.issue === 94410));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lemure.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const quietFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/quiet.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(quietFix.status, 0, quietFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const quietOut = JSON.parse(quietFix.stdout);
  assert.equal(idleOut.verdict, "quiet");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "lemure");
  assert.equal(seededOut.alarm, true);
  assert.equal(quietOut.verdict, "quiet");
  assert.equal(quietOut.hold, true);
  assert.match(quietOut.phrase, /admit quiet/);
});

test("handle exposes published hypothesis and #94410 headline", () => {
  const result = handle(seedLemure());
  assert.equal(result.published.issue, 94410);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93015, 92920, 92249, 91527]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94410));
  assert.match(
    result.published.hypothesis,
    /ScheduledTasks|legacy|NON-BINDING|#94410/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94410/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the quiet page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("quiet page is a lararium rite, not flashpan / mirage / cancellans folio", () => {
  const page = readPage();
  assert.match(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /Fira\+Code|Fira Code/);
  assert.match(
    page,
    /lemure|quiet|orphan-tick|lararium|salt-circle|bean-rite|ember-tick|ashlar/i,
  );
  assert.match(page, /#A39888|#F7F4EC|#120E0C|#C17A3A|#16182F|#E24A32/i);
  assert.match(page, /\bquiet\b/);
  assert.match(page, /\blemure\b/);
  assert.match(page, /orphan-tick/);
  assert.match(page, /Score lemure or admit quiet/i);
  assert.match(page, /#371/);
  assert.match(page, /#94410/);
  assert.match(page, /Admit quiet/);
  assert.match(page, /Score lemure/);
  assert.match(page, /Walk orphan-tick/);
  assert.match(page, /Compare quiet \/ lemure/);
  assert.match(page, /Pin idle quiet/);
  assert.match(page, /Pin seeded lemure/);
  assert.match(page, /Pin orphan-tick/);
  assert.match(page, /Stamp minute-tick/);
  assert.match(page, /Score booth/);
  assert.match(page, /lemure-score/);
  assert.match(
    page,
    /ohayo-morning-report|mercari-daily-sales-check|ENOENT|list_scheduled_tasks|ScheduledTasks|1440/i,
  );
  assert.match(page, /lararium-niche|ghost-ohayo|ghost-mercari|salt-circle|bean-rite|ember-tick/i);
  assert.match(
    page,
    /<svg[\s\S]*class="lararium-niche"|class="salt-circle"|class="bean-rite"|class="ember-tick"|class="ashlar-wall"|class="bronze-lamp"/i,
  );
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /#1B2430|#C23B22|#F4ECD8|#0D0C0A|#E0A100|#2A9D8F/);
  assert.doesNotMatch(page, /#1A0F1C|#C9A227|#F3EDE0|#8B1E3F|#4ECDC4/);
  assert.doesNotMatch(page, /#1E1740|#E09A3A|#F6EFD8|#3DD6D0|#120E28/);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press|sewing-thread|replacement-leaf/);
  assert.doesNotMatch(page, /flintlock|flash-pan|priming-pan|lastRunAt/i);
  assert.doesNotMatch(page, /desert observatory|heat-haze|sand-dune/i);
  assert.doesNotMatch(page, /millimeter-slider|leftover-instrument|woodworking|dovetail/i);
  assert.doesNotMatch(page, /theater|tapestry|curtain-aisle|gallery-wing|Polonius|proscenium/i);
  assert.doesNotMatch(page, /wax-seal atelier|glass ampule|shear-pin|wax press/i);
  assert.doesNotMatch(page, /hotel door-plate|mahogany door|front-desk ledger/i);
  assert.doesNotMatch(page, /admit intact|Score cancellans|idle intact/i);
  assert.doesNotMatch(page, /admit primed|Score flashpan|idle primed/i);
  assert.doesNotMatch(page, /admit confirmed|Score mirage|idle confirmed/i);
  assert.doesNotMatch(page, /admit cleared|Score arras|idle cleared/i);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /\bfrangible\b/);
  assert.doesNotMatch(page, /\bflashpan\b/);
  assert.doesNotMatch(page, /\bmirage\b/);
  assert.doesNotMatch(page, /\bdeadlight\b/);
  assert.doesNotMatch(page, /\bglowplug\b/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Deadlight/i);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /NOT Arras/i);
  assert.match(page, /NOT Glowplug/i);
  assert.match(page, /#93015/);
  assert.match(page, /#92920/);
  assert.match(page, /#92249/);
  assert.match(page, /#91527/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Lemure/);
  assert.match(readme, /#94410/);
  assert.match(readme, /\bquiet\b/);
  assert.match(readme, /\blemure\b/);
  assert.match(readme, /orphan-tick/);
  assert.match(readme, /Bodoni Moda/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Fira Code/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /ohayo-morning-report|mercari-daily-sales-check|ENOENT|ScheduledTasks/i);
  assert.match(readme, /NOT Flashpan\/#93015/);
  assert.match(readme, /NOT Mirage\/#92920/);
  assert.match(readme, /NOT Deadlight\/#92249/);
  assert.match(readme, /NOT Glowplug\/#85050/);
  assert.match(readme, /NOT Relict/);
  assert.match(readme, /NOT Ashpan\/#93780/);
  assert.match(readme, /NOT Gleaner\/#93794/);
  assert.match(readme, /NOT Cancellans\/#94400/);
  assert.match(readme, /NOT Arras\/#94348/);
  assert.match(readme, /NOT Frangible\/#94362/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /#93015/);
  assert.match(readme, /#92920/);
  assert.match(readme, /#92249/);
  assert.match(readme, /#91527/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/lemure/);
  assert.match(readme, /node --test projects\/lemure\/lemure\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /lararium|salt-bean|Lemuria|household-shrine|restless dead/i);
  assert.match(readme, /Score lemure or admit quiet/);
  assert.match(readme, /#93924|#93770|#93777|#94151/);
  assert.match(readme, /10:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /millimeter-slider|leftover-instrument|woodworking|dovetail/);
  assert.doesNotMatch(readme, /\bcancellans\b/);
  assert.doesNotMatch(readme, /\bflashpan\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Lemure/);
  assert.match(runLog, /10:50/);
});

test("catalog features Lemure only; Cancellans unfeatured; product count 371", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 371);
  assert.equal(hub.products.length, 371);
  assert.equal(catalog.products[0].name, "Lemure");
  assert.equal(catalog.products[0].slug, "lemure");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/lemure/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bquiet\b/);
  assert.match(catalog.products[0].summary, /\blemure\b/);
  assert.match(catalog.products[0].summary, /orphan-tick/);
  assert.match(catalog.products[0].summary, /Score lemure or admit quiet/);
  assert.match(catalog.products[0].summary, /#94410/);
  assert.equal(hub.products[0].slug, "lemure");
  assert.equal(hub.products[0].featured, true);
  const cancellans = catalog.products.find((row) => row.slug === "cancellans");
  assert.ok(cancellans);
  assert.equal(cancellans.featured, false);
  const arras = catalog.products.find((row) => row.slug === "arras");
  assert.ok(arras);
  assert.equal(arras.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "lemure").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94410") && row.slug !== "lemure",
    ),
  );
});

test("vercel rewrites lemure to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/lemure");
  assert.equal(vercel.rewrites[0].destination, "/projects/lemure");
  assert.equal(vercel.rewrites[1].source, "/lemure/");
  assert.equal(vercel.rewrites[1].destination, "/projects/lemure");
  assert.equal(vercel.rewrites[2].source, "/lemure/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/lemure/:path*");
  assert.equal(vercel.rewrites[3].source, "/cancellans");
  assert.equal(vercel.rewrites[3].destination, "/projects/cancellans");
});

test("no leftover clone / millimeter-slider / woodworking content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme, source]) {
    assert.doesNotMatch(blob, /millimeter-slider|leftover instrument|dovetail jig|marking gauge/i);
  }
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
