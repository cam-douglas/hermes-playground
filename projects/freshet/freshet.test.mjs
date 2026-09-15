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
  DESKTOP_141,
  DESKTOP_146,
  DESKTOP_152,
  DIFF_COUNT,
  DISTRIBUTION,
  DROWN_HOURS,
  EVIDENCE_ROWS,
  EVENTS_PER_HOUR,
  EVENTS_PER_MIN,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FRESHET_WALK,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INIT_COUNT,
  INIT_INTERVAL_SEC,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  LOAD_CLICKS,
  LOAD_EARLIER_LINE,
  NOT_PRODUCTS,
  NOISE_AFTER,
  PAGE_CAP,
  PAGE_SIZE,
  PATH_WORD,
  PHRASE,
  PLAQUE_LINE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RATE_141,
  RATE_146,
  RATE_152,
  RULED_OUT,
  SAMPLE_FRESHET_PROOF,
  SEEDED_WORD,
  SESSION_EVENTS,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  WINDOW_SIZE,
  analyze,
  classify,
  decide,
  drownConversation,
  emptyTicket,
  fingerprint,
  handle,
  inspectDesktopOnly,
  inspectDesktopPoll,
  inspectInitRate,
  inspectInitializeCadence,
  inspectNoMessagesPlaque,
  inspectNoMessagesYet,
  inspectSystemInit,
  inspectWindowDrown,
  loadEarlierPages,
  mapFreshet,
  observeInitCadence,
  pageTranscriptWindow,
  readBooth,
  score,
  scoreGate,
  scoreInitFlood,
  scoreWalk,
  seedBuoyed,
  seedCharted,
  seedFreshet,
  seedInitFlood,
  seedInitializeCadence,
  seedNoMessagesYet,
  seedProduct,
  seedSounding,
  seedSurfaced,
  seedWindowDrown,
} from "./freshet.mjs";

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
  return fileURLToPath(new URL("./freshet.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "00:50 freshet: a river-stage / staff-gauge / flood-crest / floodplain booth for #94430. Desktop Remote Control re-sends initialize every 60s; system/init+status flood pushes past the 2,000-event transcript window so the session opens as No messages yet. Idle buoyed / seeded freshet / path init-flood. Score freshet or admit buoyed.";

test("idle buoyed is a hold; conversation still findable above the waterline", () => {
  const result = analyze(seedBuoyed());
  assert.equal(result.verdict, "buoyed");
  assert.equal(result.idleWord, "buoyed");
  assert.equal(IDLE_WORD, "buoyed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.buoyed, true);
  assert.equal(result.phrase, "admit buoyed");
  assert.equal(result.freshet, false);
  assert.equal(result.initFlood, false);
  assert.ok(HOLD_ALIASES.includes("surfaced"));
  assert.ok(HOLD_ALIASES.includes("charted"));
  assert.ok(HOLD_ALIASES.includes("sounding"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "lasting");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "cleared");
});

test("empty ticket and empty stdin classify buoyed", () => {
  assert.equal(classify(emptyTicket()), "buoyed");
  assert.equal(classify(""), "buoyed");
  assert.equal(classify(null), "buoyed");
  assert.equal(decide({}), "buoyed");
});

test("#94430 seeded path scores freshet when the window drowns", () => {
  const result = analyze(seedFreshet());
  assert.equal(result.verdict, "freshet");
  assert.equal(result.seededWord, "freshet");
  assert.equal(SEEDED_WORD, "freshet");
  assert.equal(PRODUCT_WORD, "freshet");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.freshet, true);
  assert.equal(result.phrase, "score freshet");
  assert.equal(result.initFlood, true);
  assert.equal(result.desktopPoll, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "kintsugi");
  assert.notEqual(SEEDED_WORD, "cenotaph");
  assert.notEqual(SEEDED_WORD, "stratum");
  assert.notEqual(PATH_WORD, "heal-abort");
  assert.notEqual(PATH_WORD, "dead-install");
  assert.notEqual(PATH_WORD, "layer-unsealed");
  assert.notEqual(PATH_WORD, "mid-inject");
  assert.notEqual(PATH_WORD, "idle-exit");
});

test("educational init-flood helpers encode published buoyed vs drowned paths", () => {
  assert.equal(CODE_BUILD, "2.1.272");
  assert.equal(DESKTOP_141, "1.44121.4");
  assert.equal(DESKTOP_146, "1.46388.1");
  assert.equal(DESKTOP_152, "1.52386.6");
  assert.equal(INIT_INTERVAL_SEC, 60);
  assert.equal(WINDOW_SIZE, 2000);
  assert.equal(PAGE_SIZE, 500);
  assert.equal(PAGE_CAP, 4);
  assert.equal(EVENTS_PER_MIN, 14);
  assert.equal(EVENTS_PER_HOUR, 800);
  assert.equal(DROWN_HOURS, 2.5);
  assert.equal(RATE_141, 20);
  assert.equal(RATE_146, 120);
  assert.equal(RATE_152, 180);
  const wet = observeInitCadence({ desktop: true });
  assert.equal(wet.polling, true);
  const shut = observeInitCadence({ buoyed: true });
  assert.equal(shut.polling, false);
  const stuck = pageTranscriptWindow({});
  assert.equal(stuck.stopped, true);
  const moved = pageTranscriptWindow({ buoyed: true });
  assert.equal(moved.stopped, false);
  const empty = drownConversation({});
  assert.equal(empty.drowned, true);
  const held = drownConversation({ buoyed: true });
  assert.equal(held.drowned, false);
  const fail = inspectDesktopPoll({});
  assert.equal(fail.polling, true);
  const ok = inspectDesktopPoll({ buoyed: true });
  assert.equal(ok.polling, false);
  const lie = inspectNoMessagesPlaque({});
  assert.equal(lie.lie, true);
  const honest = inspectNoMessagesPlaque({ buoyed: true });
  assert.equal(honest.lie, false);
  const rate = inspectInitRate({});
  assert.equal(rate.regression, true);
  const old = inspectInitRate({ buoyed: true });
  assert.equal(old.regression, false);
  const clicks = loadEarlierPages({});
  assert.equal(clicks.clicks, 8);
  const scored = scoreInitFlood({
    freshet: true,
    initFlood: true,
    desktopPoll: true,
  });
  assert.equal(scored.freshet, true);
  assert.equal(scored.initFlood, true);
  const intactPath = scoreInitFlood({ buoyed: true });
  assert.equal(intactPath.freshet, false);
  assert.equal(intactPath.buoyed, true);
});

test("inspectors mark initialize-cadence and window-drown", () => {
  const cadence = inspectInitializeCadence({ freshet: true, initializeCadence: true });
  assert.equal(cadence.stamp, "initialize-cadence");
  assert.equal(cadence.flagged, true);
  const window = inspectWindowDrown({ freshet: true, windowDrown: true });
  assert.equal(window.stamp, "window-drown");
  assert.equal(window.missed, true);
  const scored = scoreGate({
    freshet: true,
    initFlood: true,
    desktopPoll: true,
    cue: "freshet",
  });
  assert.equal(scored.verdict, "freshet");
  const open = inspectInitializeCadence({ buoyed: true, freshet: false });
  assert.equal(open.stamp, "surfaced");
});

test("path word is init-flood; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "init-flood");
  const result = analyze(seedInitFlood());
  assert.equal(result.verdict, "init-flood");
  assert.equal(result.pathWord, "init-flood");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "init-flood",
      preferSeed: true,
      freshet: true,
    }),
    "init-flood",
  );
  assert.equal(classify({ seed: "initialize-cadence", preferSeed: true }), "initialize-cadence");
  assert.equal(score(seedInitFlood()), "freshet");
});

test("HOLD includes buoyed; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("buoyed"));
  const surfaced = analyze(seedSurfaced());
  assert.equal(surfaced.verdict, "surfaced");
  assert.equal(classify({ seed: "charted", preferSeed: true }), "charted");
  assert.equal(classify({ seed: "sounding", preferSeed: true }), "sounding");
});

test("alarm chips: initialize-cadence, window-drown, freshet", () => {
  assert.equal(classify({ seed: "initialize-cadence", preferSeed: true }), "initialize-cadence");
  assert.equal(classify(seedInitFlood()), "init-flood");
  assert.equal(classify(seedProduct()), "freshet");
  assert.equal(classify(seedWindowDrown()), "window-drown");
  assert.equal(classify({ seed: "no-messages-yet", preferSeed: true }), "no-messages-yet");
});

test("booth fixtures flip buoyed vs freshet vs init-flood", () => {
  const idle = scoreGate(seedBuoyed());
  const seeded = scoreGate(seedFreshet());
  const buoyed = readData("buoyed.json");
  const freshet = readData("freshet.json");
  const issued = readData("94430.json");
  const path = readData("init-flood.json");
  assert.equal(idle.verdict, "buoyed");
  assert.equal(seeded.verdict, "freshet");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedBuoyed()), "buoyed");
  assert.equal(score(seedFreshet()), "freshet");
  assert.equal(score({ seed: "init-flood", preferSeed: true }), "freshet");
  assert.equal(buoyed.initFlood, false);
  assert.equal(buoyed.buoyed, true);
  assert.equal(scoreGate(buoyed).verdict, "buoyed");
  assert.equal(freshet.initFlood, true);
  assert.equal(freshet.desktopPoll, true);
  assert.equal(classify(freshet), "freshet");
  assert.equal(issued.issue, 94430);
  assert.equal(classify(issued), "freshet");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /buoyed|surfaced|charted|sounding/i);
  assert.match(path.paths[1].result, /init-flood|initialize-cadence|window-drown|no-messages-yet|desktop-poll/i);
  assert.equal(classify(path), "init-flood");
  assert.equal(freshet.hubCount, "FRESHET");
  assert.equal(freshet.issue, 94430);
  assert.equal(freshet.freshet, true);
  assert.equal(classify(readData("surfaced.json")), "surfaced");
  assert.equal(classify(readData("charted.json")), "charted");
  assert.equal(classify(readData("sounding.json")), "sounding");
  assert.equal(classify(readData("initialize-cadence.json")), "initialize-cadence");
  assert.equal(classify(readData("window-drown.json")), "window-drown");
  assert.equal(classify(readData("no-messages-yet.json")), "no-messages-yet");
  assert.equal(classify(readData("desktop-poll.json")), "desktop-poll");
  assert.equal(classify(readData("browser-quiet.json")), "browser-quiet");
  assert.equal(classify(readData("system-init.json")), "system-init");
  assert.equal(classify(readData("load-earlier.json")), "load-earlier");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94396, 94397, 94451, 94452, 93490]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("gauge.json")), "window-drown");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("buoyed"));
  assert.ok(CHIPS.includes("freshet"));
  assert.ok(CHIPS.includes("init-flood"));
  assert.ok(CHIPS.includes("initialize-cadence"));
  assert.ok(CHIPS.includes("window-drown"));
  assert.ok(CHIPS.includes("no-messages-yet"));
  assert.ok(CHIPS.includes("sounding"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("freshet"));
  assert.ok(ALARM.includes("init-flood"));
  assert.ok(ALARM.includes("initialize-cadence"));
  assert.ok(ALARM.includes("window-drown"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published freshet walk scores freshet after the buoyed hold", () => {
  const booth = scoreWalk({ rows: FRESHET_WALK });
  assert.equal(booth.verdict, "freshet");
  assert.ok(booth.freshetCount >= 1);
  const idle = booth.rows.find((row) => row.event === "floodplain");
  assert.equal(idle.buoyed, true);
  assert.equal(idle.verdict, "buoyed");
  const cut = booth.rows.find((row) => row.event === "init-flood");
  assert.equal(cut.initFlood, true);
  const path = booth.rows.find(
    (row) => row.event === "init-flood" && row.t === "path",
  );
  assert.equal(path.verdict, "init-flood");
});

test("FRESHET_WALK constant matches the issue core walk", () => {
  assert.equal(FRESHET_WALK[0].event, "floodplain");
  const cut = FRESHET_WALK.find((row) => row.event === "init-flood");
  assert.equal(cut.initFlood || cut.desktopPoll, true);
  const path = FRESHET_WALK.find((row) => row.t === "path");
  assert.equal(path.freshet, true);
  const scoreRow = FRESHET_WALK.find((row) => row.event === "freshet");
  assert.equal(scoreRow.freshet, true);
  assert.equal(scoreRow.desktopPoll, true);
});

test("positive control floodplain stays buoyed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "buoyed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "buoyed");
  const hold = walk.rows.find((row) => row.event === "floodplain");
  assert.equal(hold.buoyed, true);
  assert.equal(hold.verdict, "buoyed");
});

test("issue constants encode only #94430 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94430);
  assert.ok(ISSUE_URL.includes("94430"));
  assert.match(TITLE, /initialize|get_workspace_diff|No messages yet|2,000|Remote Control/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.272|remote-control|1\.52386/i);
  assert.equal(BUILD, "Claude Code 2.1.272 / desktop 1.52386.6");
  assert.equal(SURFACE, "init-flood");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:windows", "regression", "area:desktop", "area:agent-view"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 6);
  assert.equal(EVIDENCE_ROWS[0].drowned, true);
  assert.equal(EVIDENCE_ROWS[5].live, true);
  assert.equal(EVIDENCE_ROWS[3].windowed, true);
  assert.ok(RULED_OUT.some((row) => /#94451/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94396/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94397/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94452/i.test(row)));
  assert.ok(EXPECTED.some((row) => /re-initialize|system\/init|paging|control/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /initialize|get_workspace_diff|2,000|No messages yet|1\.52386|1\.44121|1\.46388/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("init-flood"));
  assert.ok(FINGERPRINT_LINES.includes("freshet"));
  assert.equal(PHRASE, "Score freshet or admit buoyed.");
  assert.equal(SAMPLE_FRESHET_PROOF.initFlood, true);
  assert.equal(SAMPLE_FRESHET_PROOF.names.length, 6);
  assert.equal(seedSounding().seed, "sounding");
  assert.equal(seedCharted().seed, "charted");
  assert.equal(PLAQUE_LINE, "No messages yet");
  assert.equal(LOAD_EARLIER_LINE, "Load earlier messages");
  assert.equal(seedInitializeCadence().seed, "initialize-cadence");
  assert.equal(seedWindowDrown().seed, "window-drown");
  assert.equal(seedNoMessagesYet().seed, "no-messages-yet");
  assert.equal(SESSION_EVENTS, 9081);
  assert.equal(NOISE_AFTER, 5427);
  assert.equal(INIT_COUNT, 1869);
  assert.equal(DIFF_COUNT, 627);
  assert.equal(LOAD_CLICKS, 8);
});

test("has-repro fingerprints encode the published freshet proof", () => {
  const result = handle(seedFreshet());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "init-flood");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedFreshet()),
    /freshet\|kind=init-flood\|ref=initialize-cadence\|path=init-flood\|cue=init-flood/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and mended/homed/shared/contiguous", () => {
  const required = [
    "mended",
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "cleared",
    "kintsugi",
    "cenotaph",
    "stratum",
    "tmesis",
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
    "heal-abort",
    "dead-install",
    "layer-unsealed",
    "mid-inject",
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

test("buoyed booth flips freshet back when the gauge admits buoyed", () => {
  const tape = {
    buoyed: true,
    freshet: false,
    initFlood: false,
    cue: "buoyed",
  };
  assert.equal(scoreGate(tape).verdict, "buoyed");
  tape.buoyed = false;
  tape.freshet = true;
  tape.initFlood = true;
  tape.cue = "freshet";
  assert.equal(scoreGate(tape).verdict, "freshet");
  tape.buoyed = true;
  tape.freshet = false;
  tape.initFlood = false;
  tape.cue = "buoyed";
  assert.equal(scoreGate(tape).verdict, "buoyed");
});

test("inspectors and readBooth mark the freshet proof", () => {
  const cadence = inspectInitializeCadence({ freshet: true });
  assert.equal(cadence.stamp, "initialize-cadence");
  const window = inspectWindowDrown({ freshet: true, windowDrown: true });
  assert.equal(window.stamp, "window-drown");
  assert.equal(window.missed, true);
  const booth = readBooth({
    freshet: true,
    initFlood: true,
    desktopPoll: true,
  });
  assert.equal(booth.freshet, true);
  assert.equal(booth.mark, "freshet");
  const open = readBooth({
    buoyed: true,
    freshet: false,
    initFlood: false,
  });
  assert.equal(open.freshet, false);
  assert.equal(open.mark, "buoyed");
  assert.equal(inspectNoMessagesYet({ freshet: true, noMessagesYet: true }).stamp, "no-messages-yet");
  assert.equal(inspectDesktopOnly({ freshet: true, desktopPoll: true }).stamp, "desktop-poll");
  assert.equal(inspectSystemInit({ freshet: true, systemInit: true }).stamp, "system-init");
});

test("mapFreshet encodes the published init-flood", () => {
  const miss = mapFreshet({ freshet: true, initFlood: true });
  assert.equal(miss.stamp, "init-flood");
  assert.equal(miss.holdingLane, "crest-mark");
  assert.equal(miss.ribbon, "freshet");
  const clear = mapFreshet({ buoyed: true, freshet: false });
  assert.equal(clear.stamp, "floodplain");
  assert.equal(clear.kindLane, "staff-gauge");
  assert.equal(clear.holdingLane, "floodplain");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94396, 94397, 94451, 94452, 93490]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("cenotaph"));
  assert.ok(NOT_PRODUCTS.includes("stratum"));
  assert.ok(NOT_PRODUCTS.includes("tmesis"));
  assert.ok(NOT_PRODUCTS.includes("vedette"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.equal(BACKUPS.length, 15);
  assert.equal(BACKUPS[0].issue, 94458);
  assert.equal(BACKUPS[14].issue, 94516);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94430));
  assert.ok(!COUSINS.some((row) => row.issue === 94430));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/freshet.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const buoyedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/buoyed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(buoyedFix.status, 0, buoyedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const buoyedOut = JSON.parse(buoyedFix.stdout);
  assert.equal(idleOut.verdict, "buoyed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "freshet");
  assert.equal(seededOut.alarm, true);
  assert.equal(buoyedOut.verdict, "buoyed");
  assert.equal(buoyedOut.hold, true);
  assert.match(buoyedOut.phrase, /admit buoyed/);
});

test("handle exposes published hypothesis and #94430 headline", () => {
  const result = handle(seedFreshet());
  assert.equal(result.published.issue, 94430);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [94396, 94397, 94451, 94452, 93490]);
  assert.ok(result.published.backups.includes(94458));
  assert.ok(result.published.backups.includes(94516));
  assert.ok(!result.published.backups.includes(94430));
  assert.match(
    result.published.hypothesis,
    /initialize|system\/init|NON-BINDING|#94430/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94430/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 6);
});

test("model has no static node: imports so the buoyed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("buoyed page is a river-gauge floodplain, not a repair bench or memorial yard", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=DM\+Sans|DM Sans/);
  assert.match(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /freshet|buoyed|init-flood|staff-gauge|crest-mark|event-spool|window-viewport|floodplain/i,
  );
  assert.match(page, /#0B1C2C|#C4A35A|#E8F1F5|#E09F3E|#3D5A6C|#8B7355/i);
  assert.match(page, /\bbuoyed\b/);
  assert.match(page, /\bfreshet\b/);
  assert.match(page, /init-flood/);
  assert.match(page, /Score freshet or admit buoyed/i);
  assert.match(page, /#385/);
  assert.match(page, /#94430/);
  assert.match(page, /Admit buoyed/);
  assert.match(page, /Score freshet/);
  assert.match(page, /Walk init-flood/);
  assert.match(page, /Compare buoyed \/ freshet/);
  assert.match(page, /Pin idle buoyed/);
  assert.match(page, /Pin seeded freshet/);
  assert.match(page, /Pin init-flood/);
  assert.match(page, /Stamp window-drown/);
  assert.match(page, /Score booth/);
  assert.match(page, /Load earlier/);
  assert.match(page, /freshet-score/);
  assert.match(
    page,
    /initialize|get_workspace_diff|system\/init|No messages yet|2,000|2000/i,
  );
  assert.match(page, /gauge|crest-mark|event-spool|window-viewport|no-messages-plaque|load-earlier/i);
  assert.match(
    page,
    /<svg[\s\S]*class="staff-gauge"|class="crest-mark"|class="event-spool"|class="window-viewport"|class="flood-crest"|class="no-messages-plaque"/i,
  );
  assert.match(page, /body\.buoyed|body\.freshet|body\.init-flood/);
  assert.match(page, /evidence-table|initialize|No messages yet|2,000/i);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Bebas\+Neue|Bebas Neue/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /#E8E2D6|#8B6914|#3F5A45|#5C5650|#1A1814|#C4B59A|#0E0D0B/);
  assert.doesNotMatch(page, /#1E262C|#C67B28|#4A5964|#E4B25A|#101418|#8C3A16|#D8C4A0/);
  assert.doesNotMatch(page, /#F4E8D0|#2C1B12|#C43C2C|#8B1E1E|#243B55|#C4A46A|#14100C/);
  assert.doesNotMatch(page, /#1B2A1E|#E0A84A|#D9C7A3|#B8332A|#0A100C/);
  assert.doesNotMatch(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /#D6C7A8|#C67A28|#2C241C|#8C6B48|#E8A44A/);
  assert.doesNotMatch(page, /spliced parchment|editorial desk|iron-gall|vermillion splice/i);
  assert.doesNotMatch(page, /cavalry vedette|outpost lantern|picket-line|field olive/i);
  assert.doesNotMatch(page, /prague orloj|astronomical clock|zodiac dial|automaton tower/i);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /vacant sarcophagus|fallen from the wall|Portland-stone|memorial yard|carved stone|bronze plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /admit mended|Score kintsugi|idle mended/i);
  assert.doesNotMatch(page, /admit shared|Score stratum|idle shared/i);
  assert.doesNotMatch(page, /admit contiguous|Score tmesis|idle contiguous/i);
  assert.doesNotMatch(page, /admit stationed|Score vedette|idle stationed/i);
  assert.doesNotMatch(page, /admit lasting|Score orloj|idle lasting/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /admit homed|Score cenotaph|idle homed/i);
  assert.doesNotMatch(page, /\bkintsugi\b/);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
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
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /dead-install/);
  assert.doesNotMatch(page, /layer-unsealed/);
  assert.doesNotMatch(page, /mid-inject/);
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
  assert.match(page, /NOT Kintsugi/i);
  assert.match(page, /NOT Cenotaph/i);
  assert.match(page, /NOT Stratum/i);
  assert.match(page, /NOT Tmesis/i);
  assert.match(page, /NOT #94451/i);
  assert.match(page, /NOT #94396/i);
  assert.match(page, /#94451/);
  assert.match(page, /#94396/);
  assert.match(page, /#94397/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Freshet/);
  assert.match(readme, /#94430/);
  assert.match(readme, /\bbuoyed\b/);
  assert.match(readme, /\bfreshet\b/);
  assert.match(readme, /init-flood/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Newsreader/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.doesNotMatch(readme, /JetBrains/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Bebas Neue/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /initialize|get_workspace_diff|No messages yet|2,000/i);
  assert.match(readme, /NOT #94451/);
  assert.match(readme, /NOT #94396/);
  assert.match(readme, /NOT #94397/);
  assert.match(readme, /NOT #94452/);
  assert.match(readme, /#94451/);
  assert.match(readme, /#94396/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/freshet/);
  assert.match(readme, /node --test projects\/freshet\/freshet\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /river-stage|staff-gauge|flood-crest|floodplain/i);
  assert.match(readme, /Score freshet or admit buoyed/);
  assert.match(readme, /#94458|#94516/);
  assert.doesNotMatch(readme, /backup #94430|#94430 as next/);
  assert.match(readme, /00:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  assert.doesNotMatch(readme, /\bcenotaph\b/);
  assert.doesNotMatch(readme, /\bstratum\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Freshet/);
  assert.match(runLog, /00:50/);
});

test("catalog features Freshet only; Kintsugi unfeatured; product count 385", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 385);
  assert.equal(hub.products.length, 385);
  assert.equal(catalog.products[0].name, "Freshet");
  assert.equal(catalog.products[0].slug, "freshet");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/freshet/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bbuoyed\b/);
  assert.match(catalog.products[0].summary, /\bfreshet\b/);
  assert.match(catalog.products[0].summary, /init-flood/);
  assert.match(catalog.products[0].summary, /Score freshet or admit buoyed/);
  assert.match(catalog.products[0].summary, /#94430/);
  assert.match(catalog.products[0].summary, /00:50/);
  assert.equal(hub.products[0].slug, "freshet");
  assert.equal(hub.products[0].featured, true);
  const kintsugi = catalog.products.find((row) => row.slug === "kintsugi");
  assert.ok(kintsugi);
  assert.equal(kintsugi.featured, false);
  const cenotaph = catalog.products.find((row) => row.slug === "cenotaph");
  assert.ok(cenotaph);
  assert.equal(cenotaph.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "freshet" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94430") && row.slug !== "freshet",
    ),
  );
});

test("vercel rewrites freshet to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/freshet");
  assert.equal(vercel.rewrites[0].destination, "/projects/freshet");
  assert.equal(vercel.rewrites[1].source, "/freshet/");
  assert.equal(vercel.rewrites[1].destination, "/projects/freshet");
  assert.equal(vercel.rewrites[2].source, "/freshet/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/freshet/:path*");
  assert.equal(vercel.rewrites[3].source, "/kintsugi");
  assert.equal(vercel.rewrites[3].destination, "/projects/kintsugi");
});

test("no leftover clone / pottery / parchment / lantern / vacant-sarcophagus content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack|clock-face|zodiac-dial|automaton-walk|outpost-lantern|picket-line|cavalry-vedette|spliced-parchment|editorial-desk|iron-gall|vacant sarcophagus|Portland-stone|memorial-yard|carved-stone|bronze-plaque|cracked-bowl|urushi-pot|kiln-mouth|gold-seam/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack|prague astronomical clock|outpost lantern|picket-line clock|spliced parchment|vacant sarcophagus|carved stone pointing|urushi pot|cracked bowl/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
