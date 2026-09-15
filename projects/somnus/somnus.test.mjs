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
  CREATED_VIA,
  CRON,
  DAYS_LOST,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FOLDERS_STATE,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FROZEN_NEXT_RUN,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REQUIRES_LOCAL_DEVICE,
  RULED_OUT,
  SAMPLE_SOMNUS_PROOF,
  SEEDED_WORD,
  SOMNUS_WALK,
  STATE,
  SURFACE,
  SUSPENSION_REASON,
  SYNTHETIC_CADENCE,
  SYNTHETIC_FROZEN,
  SYNTHETIC_SLEEP_MISS,
  TASK_ID,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  evaluateDispatch,
  fingerprint,
  handle,
  inspectFrozenNext,
  inspectLidClosed,
  inspectNoNotify,
  inspectNoResume,
  inspectSleepMiss,
  mapSomnus,
  readBooth,
  score,
  scoreDeviceAbsent,
  scoreGate,
  scoreWalk,
  seedCadence,
  seedDeviceAbsent,
  seedProduct,
  seedSleepMiss,
  seedSomnus,
} from "./somnus.mjs";

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
  return fileURLToPath(new URL("./somnus.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "14:50 somnus: a somnus / night-nursery / moon-watch / sleep-clinic booth for #94415. Cowork cloud scheduled task with requires_local_device:true is permanently disabled (suspension_reason=device_absent) after one fire while the bound Mac is asleep. Dispatch stamps the latch before any session; no resume; no notify; next_run_at frozen. Idle cadence / seeded somnus / path device-absent. Score somnus or admit cadence.";

test("idle cadence is a hold; recurring cloud trigger stays enabled across a sleep miss", () => {
  const result = analyze(seedCadence());
  assert.equal(result.verdict, "cadence");
  assert.equal(result.idleWord, "cadence");
  assert.equal(IDLE_WORD, "cadence");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.cadence, true);
  assert.equal(result.phrase, "admit cadence");
  assert.equal(result.somnus, false);
  assert.equal(result.deviceAbsent, false);
  assert.ok(HOLD_ALIASES.includes("armed"));
  assert.ok(HOLD_ALIASES.includes("bound"));
  assert.ok(HOLD_ALIASES.includes("listed"));
  assert.ok(HOLD_ALIASES.includes("scheduled"));
  assert.ok(HOLD_ALIASES.includes("muster-ok"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "released");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "slack");
  assert.notEqual(IDLE_WORD, "yielding");
  assert.notEqual(IDLE_WORD, "extinguished");
  assert.notEqual(IDLE_WORD, "idle-ok");
  assert.notEqual(IDLE_WORD, "suspend-ready");
});

test("empty ticket and empty stdin classify cadence", () => {
  assert.equal(classify(emptyTicket()), "cadence");
  assert.equal(classify(""), "cadence");
  assert.equal(classify(null), "cadence");
  assert.equal(decide({}), "cadence");
});

test("#94415 seeded path scores somnus when one sleep snuffs the schedule", () => {
  const result = analyze(seedSomnus());
  assert.equal(result.verdict, "somnus");
  assert.equal(result.seededWord, "somnus");
  assert.equal(SEEDED_WORD, "somnus");
  assert.equal(PRODUCT_WORD, "somnus");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.somnus, true);
  assert.equal(result.phrase, "score somnus");
  assert.equal(result.deviceAbsent, true);
  assert.equal(result.sleepMiss, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "cresset");
  assert.notEqual(SEEDED_WORD, "dictabelt");
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(SEEDED_WORD, "cancellans");
  assert.notEqual(PATH_WORD, "hold-leak");
  assert.notEqual(PATH_WORD, "segment-drop");
  assert.notEqual(PATH_WORD, "orphan-tick");
  assert.notEqual(PATH_WORD, "deferred-delta");
  assert.notEqual(PATH_WORD, "phantom-prompt");
});

test("educational dispatch helper encodes published cadence vs device-absent paths", () => {
  assert.equal(CODE_BUILD, "2.1.268");
  assert.equal(DESKTOP_BUILD, "1.49585.0");
  assert.equal(CREATED_VIA, "meta_mcp");
  assert.equal(REQUIRES_LOCAL_DEVICE, true);
  assert.equal(CRON, "45 0-4,13-23 * * *");
  assert.equal(SUSPENSION_REASON, "device_absent");
  assert.equal(FROZEN_NEXT_RUN, "2026-09-11T03:45:00Z");
  assert.equal(DAYS_LOST, 3);
  assert.equal(TASK_ID, "trig_01CkjM7FPtbe9R8BtVMjYvks");
  assert.equal(FOLDERS_STATE, "FOLDERS_STATE_PRESENT");
  assert.equal(SYNTHETIC_CADENCE.enabled, true);
  assert.equal(SYNTHETIC_SLEEP_MISS.enabled, false);
  assert.equal(SYNTHETIC_FROZEN.next_run_at, FROZEN_NEXT_RUN);
  const disabled = evaluateDispatch({ deviceAsleep: true, deviceAbsent: true });
  assert.equal(disabled.disabled, true);
  assert.equal(disabled.synthetic, true);
  const control = evaluateDispatch({ cadence: true });
  assert.equal(control.disabled, false);
  const scored = scoreDeviceAbsent({
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
  });
  assert.equal(scored.somnus, true);
  assert.equal(scored.deviceAbsent, true);
  const quietPath = scoreDeviceAbsent({ cadence: true });
  assert.equal(quietPath.somnus, false);
  assert.equal(quietPath.cadence, true);
});

test("inspectors mark sleep-miss and no-resume", () => {
  const miss = inspectSleepMiss({ somnus: true, sleepMiss: true });
  assert.equal(miss.stamp, "sleep-miss");
  assert.equal(miss.miss, true);
  const resume = inspectNoResume({ somnus: true, noResume: true });
  assert.equal(resume.stamp, "no-resume");
  assert.equal(resume.stuck, true);
  const scored = scoreGate({
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
    cue: "somnus",
  });
  assert.equal(scored.verdict, "somnus");
  const open = inspectSleepMiss({ cadence: true, somnus: false });
  assert.equal(open.stamp, "skip-and-continue");
});

test("path word is device-absent; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "device-absent");
  const result = analyze(seedDeviceAbsent());
  assert.equal(result.verdict, "device-absent");
  assert.equal(result.pathWord, "device-absent");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "device-absent",
      preferSeed: true,
      somnus: true,
    }),
    "device-absent",
  );
  assert.equal(classify({ seed: "sleep-miss", preferSeed: true }), "sleep-miss");
  assert.equal(score(seedDeviceAbsent()), "somnus");
});

test("HOLD includes cadence", () => {
  assert.ok(HOLD.includes("cadence"));
  assert.equal(HOLD.length, 1);
  assert.equal(classify({ seed: "armed", preferSeed: true }), "armed");
  assert.equal(classify({ seed: "bound", preferSeed: true }), "bound");
  assert.equal(classify({ seed: "listed", preferSeed: true }), "listed");
  assert.equal(classify({ seed: "scheduled", preferSeed: true }), "scheduled");
  assert.equal(classify({ seed: "muster-ok", preferSeed: true }), "muster-ok");
});

test("alarm chips: sleep-miss, no-resume, device-absent, somnus", () => {
  assert.equal(classify({ seed: "sleep-miss", preferSeed: true }), "sleep-miss");
  assert.equal(classify(seedDeviceAbsent()), "device-absent");
  assert.equal(classify(seedProduct()), "somnus");
  assert.equal(classify(seedSleepMiss()), "sleep-miss");
  assert.equal(classify({ seed: "no-resume", preferSeed: true }), "no-resume");
  assert.equal(classify({ seed: "frozen-next", preferSeed: true }), "frozen-next");
});

test("booth fixtures flip cadence vs somnus vs device-absent", () => {
  const idle = scoreGate(seedCadence());
  const seeded = scoreGate(seedSomnus());
  const cadence = readData("cadence.json");
  const somnus = readData("somnus.json");
  const issued = readData("94415.json");
  const path = readData("device-absent.json");
  assert.equal(idle.verdict, "cadence");
  assert.equal(seeded.verdict, "somnus");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCadence()), "cadence");
  assert.equal(score(seedSomnus()), "somnus");
  assert.equal(score({ seed: "device-absent", preferSeed: true }), "somnus");
  assert.equal(cadence.deviceAbsent, false);
  assert.equal(cadence.cadence, true);
  assert.equal(scoreGate(cadence).verdict, "cadence");
  assert.equal(somnus.deviceAbsent, true);
  assert.equal(somnus.sleepMiss, true);
  assert.equal(classify(somnus), "somnus");
  assert.equal(issued.issue, 94415);
  assert.equal(classify(issued), "somnus");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /cadence|armed|bound|listed|scheduled|muster-ok/i);
  assert.match(path.paths[1].result, /device-absent|sleep-miss|no-resume/i);
  assert.equal(classify(path), "device-absent");
  assert.equal(somnus.hubCount, "SOMNUS");
  assert.equal(somnus.issue, 94415);
  assert.equal(somnus.somnus, true);
  assert.equal(classify(readData("armed.json")), "armed");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("listed.json")), "listed");
  assert.equal(classify(readData("scheduled.json")), "scheduled");
  assert.equal(classify(readData("muster-ok.json")), "muster-ok");
  assert.equal(classify(readData("sleep-miss.json")), "sleep-miss");
  assert.equal(classify(readData("no-resume.json")), "no-resume");
  assert.equal(classify(readData("no-notify.json")), "no-notify");
  assert.equal(classify(readData("frozen-next.json")), "frozen-next");
  assert.equal(classify(readData("lid-closed.json")), "lid-closed");
  assert.equal(classify(readData("update-trigger.json")), "update-trigger");
  assert.equal(classify(readData("requires-device.json")), "requires-device");
  assert.equal(classify(readData("cloud-bound.json")), "cloud-bound");
  assert.equal(classify(readData("catch-up.json")), "catch-up");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94420, 94392, 94410]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("cadence"));
  assert.ok(CHIPS.includes("somnus"));
  assert.ok(CHIPS.includes("device-absent"));
  assert.ok(CHIPS.includes("sleep-miss"));
  assert.ok(CHIPS.includes("no-resume"));
  assert.ok(CHIPS.includes("muster-ok"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("somnus"));
  assert.ok(ALARM.includes("device-absent"));
  assert.ok(ALARM.includes("sleep-miss"));
  assert.ok(ALARM.includes("no-resume"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published somnus walk scores somnus after the idle hold", () => {
  const booth = scoreWalk({ rows: SOMNUS_WALK });
  assert.equal(booth.verdict, "somnus");
  assert.ok(booth.somnusCount >= 1);
  const idle = booth.rows.find((row) => row.event === "muster-ok");
  assert.equal(idle.cadence, true);
  assert.equal(idle.verdict, "cadence");
  const cut = booth.rows.find((row) => row.event === "device-absent");
  assert.equal(cut.deviceAbsent, true);
  const path = booth.rows.find(
    (row) => row.event === "device-absent" && row.t === "path",
  );
  assert.equal(path.verdict, "device-absent");
});

test("SOMNUS_WALK constant matches the issue clinic walk", () => {
  assert.equal(SOMNUS_WALK[0].event, "muster-ok");
  const cut = SOMNUS_WALK.find((row) => row.event === "device-absent");
  assert.equal(cut.deviceAbsent || cut.sleepMiss, true);
  const path = SOMNUS_WALK.find((row) => row.t === "path");
  assert.equal(path.somnus, true);
  const scoreRow = SOMNUS_WALK.find((row) => row.event === "somnus");
  assert.equal(scoreRow.somnus, true);
  assert.equal(scoreRow.sleepMiss, true);
});

test("positive control muster-ok desk stays cadence", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "cadence");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "cadence");
  const hold = walk.rows.find((row) => row.event === "muster-ok");
  assert.equal(hold.cadence, true);
  assert.equal(hold.verdict, "cadence");
});

test("issue constants encode only #94415 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94415);
  assert.ok(ISSUE_URL.includes("94415"));
  assert.match(TITLE, /device_absent|asleep|never auto-resumes/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /1\.49585\.0|2\.1\.268|Apple Silicon/i);
  assert.equal(BUILD, "Claude Desktop (Cowork) 1.49585.0; Claude Code 2.1.268");
  assert.equal(SURFACE, "device-absent");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:cowork"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#94420/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94392/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94410/i.test(row)));
  assert.ok(EXPECTED.some((row) => /skipped|preserved|next hourly/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /device_absent|requires_local_device|update_trigger|1\.49585\.0/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("device-absent"));
  assert.ok(FINGERPRINT_LINES.includes("somnus"));
  assert.equal(PHRASE, "Score somnus or admit cadence.");
  assert.equal(SAMPLE_SOMNUS_PROOF.deviceAbsent, true);
  assert.equal(SAMPLE_SOMNUS_PROOF.names.length, 6);
  assert.equal(SAMPLE_SOMNUS_PROOF.synthetic, true);
});

test("has-repro fingerprints encode the published somnus proof", () => {
  const result = handle(seedSomnus());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "device-absent");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSomnus()),
    /somnus\|kind=device-absent\|ref=sleep-miss\|path=device-absent\|cue=device-absent/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "released",
    "verbatim",
    "quiet",
    "intact",
    "slack",
    "yielding",
    "extinguished",
    "idle-ok",
    "suspend-ready",
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
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("cadence booth flips somnus back when the desk admits cadence", () => {
  const tape = {
    cadence: true,
    somnus: false,
    deviceAbsent: false,
    cue: "cadence",
  };
  assert.equal(scoreGate(tape).verdict, "cadence");
  tape.cadence = false;
  tape.somnus = true;
  tape.deviceAbsent = true;
  tape.cue = "somnus";
  assert.equal(scoreGate(tape).verdict, "somnus");
  tape.cadence = true;
  tape.somnus = false;
  tape.deviceAbsent = false;
  tape.cue = "cadence";
  assert.equal(scoreGate(tape).verdict, "cadence");
});

test("sleep-miss, no-resume, and readBooth mark the somnus proof", () => {
  const miss = inspectSleepMiss({ somnus: true });
  assert.equal(miss.stamp, "sleep-miss");
  const resume = inspectNoResume({ somnus: true, noResume: true });
  assert.equal(resume.stamp, "no-resume");
  assert.equal(resume.stuck, true);
  const booth = readBooth({
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
  });
  assert.equal(booth.somnus, true);
  assert.equal(booth.mark, "somnus");
  const open = readBooth({
    cadence: true,
    somnus: false,
    deviceAbsent: false,
  });
  assert.equal(open.somnus, false);
  assert.equal(open.mark, "cadence");
  assert.equal(inspectNoNotify({ somnus: true, noNotify: true }).stamp, "no-notify");
  assert.equal(inspectFrozenNext({ somnus: true, frozenNext: true }).stamp, "frozen-next");
  assert.equal(inspectLidClosed({ somnus: true, lidClosed: true }).stamp, "lid-closed");
});

test("mapSomnus encodes the published device-absent", () => {
  const miss = mapSomnus({ somnus: true, deviceAbsent: true });
  assert.equal(miss.stamp, "device-absent");
  assert.equal(miss.holdingLane, "absent-chip");
  assert.equal(miss.ribbon, "somnus");
  const clear = mapSomnus({ cadence: true, somnus: false });
  assert.equal(clear.stamp, "muster-ok");
  assert.equal(clear.kindLane, "moon-watch");
  assert.equal(clear.holdingLane, "muster-ok");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94420, 94392, 94410]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cresset"));
  assert.ok(NOT_PRODUCTS.includes("dictabelt"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 94344);
  assert.equal(BACKUPS[12].issue, 92268);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94415));
  assert.ok(!COUSINS.some((row) => row.issue === 94415));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/somnus.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const cadenceFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cadence.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(cadenceFix.status, 0, cadenceFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const cadenceOut = JSON.parse(cadenceFix.stdout);
  assert.equal(idleOut.verdict, "cadence");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "somnus");
  assert.equal(seededOut.alarm, true);
  assert.equal(cadenceOut.verdict, "cadence");
  assert.equal(cadenceOut.hold, true);
  assert.match(cadenceOut.phrase, /admit cadence/);
});

test("handle exposes published hypothesis and #94415 headline", () => {
  const result = handle(seedSomnus());
  assert.equal(result.published.issue, 94415);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [94420, 94392, 94410]);
  assert.ok(result.published.backups.includes(94344));
  assert.ok(result.published.backups.includes(92268));
  assert.ok(!result.published.backups.includes(94415));
  assert.match(
    result.published.hypothesis,
    /device_absent|dispatch|NON-BINDING|#94415/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94415/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the moon-watch can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("moon-watch is a somnus booth, not iron-basket / wax-belt / lararium / binder", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.match(
    page,
    /somnus|cadence|device-absent|moon-watch|nursery-desk|absent-chip|cadence-dial/i,
  );
  assert.match(page, /#12162E|#F3EBDD|#C5CDD8|#8B6FCF|#2E9A96/i);
  assert.match(page, /\bcadence\b/);
  assert.match(page, /\bsomnus\b/);
  assert.match(page, /device-absent/);
  assert.match(page, /Score somnus or admit cadence/i);
  assert.match(page, /#374/);
  assert.match(page, /#94415/);
  assert.match(page, /Admit cadence/);
  assert.match(page, /Score somnus/);
  assert.match(page, /Walk device-absent/);
  assert.match(page, /Compare cadence \/ somnus/);
  assert.match(page, /Pin idle cadence/);
  assert.match(page, /Pin seeded somnus/);
  assert.match(page, /Pin device-absent/);
  assert.match(page, /Stamp sleep-miss/);
  assert.match(page, /Score booth/);
  assert.match(page, /somnus-score/);
  assert.match(
    page,
    /1\.49585\.0|2\.1\.268|device_absent|requires_local_device|update_trigger/i,
  );
  assert.match(page, /moon-watch|nursery-desk|absent-chip|cadence-dial|sleep-ledger|lid-closed/i);
  assert.match(
    page,
    /<svg[\s\S]*class="moon-watch"|class="cadence-dial"|class="sleep-ledger"|class="nursery-crib"/i,
  );
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Playfair\+Display|Playfair Display/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /#E07020|#2A2E33|#E8E4DC|#0E1218|#F0C14A|#3D6F8C/);
  assert.doesNotMatch(page, /#C9893A|#F4EFE4|#1A1612|#D64545|#4A5560|#2F6B4F/);
  assert.doesNotMatch(page, /#A39888|#F7F4EC|#120E0C|#C17A3A|#16182F|#E24A32/);
  assert.doesNotMatch(page, /#1B2430|#C23B22|#F4ECD8|#0D0C0A|#E0A100|#2A9D8F/);
  assert.doesNotMatch(page, /iron-basket|ember-snuff|gnome-dial|battlement|hold-ledger/);
  assert.doesNotMatch(page, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press|sewing-thread|replacement-leaf/);
  assert.doesNotMatch(page, /salt-circle|bean-rite|ember-tick|ashlar-wall/i);
  assert.doesNotMatch(page, /theater|tapestry|curtain-aisle|gallery-wing|Polonius|proscenium/i);
  assert.doesNotMatch(page, /admit released|Score cresset|idle released/i);
  assert.doesNotMatch(page, /admit verbatim|Score dictabelt|idle verbatim/i);
  assert.doesNotMatch(page, /admit quiet|Score lemure|idle quiet/i);
  assert.doesNotMatch(page, /admit intact|Score cancellans|idle intact/i);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.match(page, /NOT Cresset/i);
  assert.match(page, /NOT Dictabelt/i);
  assert.match(page, /NOT Lemure/i);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /#94420/);
  assert.match(page, /#94392/);
  assert.match(page, /#94410/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Somnus/);
  assert.match(readme, /#94415/);
  assert.match(readme, /\bcadence\b/);
  assert.match(readme, /\bsomnus\b/);
  assert.match(readme, /device-absent/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /1\.49585\.0|device_absent|requires_local_device|update_trigger/i);
  assert.match(readme, /NOT #94420/);
  assert.match(readme, /NOT #94392/);
  assert.match(readme, /NOT #94410/);
  assert.match(readme, /NOT Cresset\/#94420/);
  assert.match(readme, /NOT Dictabelt\/#94406/);
  assert.match(readme, /NOT Lemure\/#94410/);
  assert.match(readme, /#94420/);
  assert.match(readme, /#94392/);
  assert.match(readme, /#94410/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/somnus/);
  assert.match(readme, /node --test projects\/somnus\/somnus\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /night-nursery|moon-watch|sleep-clinic|somnus/i);
  assert.match(readme, /Score somnus or admit cadence/);
  assert.match(readme, /#94344|#94398|#92268/);
  assert.match(readme, /14:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /iron fire-basket|ember-snuff|gnome-dial|battlement/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Somnus/);
  assert.match(runLog, /14:50/);
});

test("catalog features Somnus only; Cresset unfeatured; product count 374", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 374);
  assert.equal(hub.products.length, 374);
  assert.equal(catalog.products[0].name, "Somnus");
  assert.equal(catalog.products[0].slug, "somnus");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/somnus/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bcadence\b/);
  assert.match(catalog.products[0].summary, /\bsomnus\b/);
  assert.match(catalog.products[0].summary, /device-absent/);
  assert.match(catalog.products[0].summary, /Score somnus or admit cadence/);
  assert.match(catalog.products[0].summary, /#94415/);
  assert.match(catalog.products[0].summary, /14:50/);
  assert.equal(hub.products[0].slug, "somnus");
  assert.equal(hub.products[0].featured, true);
  const cresset = catalog.products.find((row) => row.slug === "cresset");
  assert.ok(cresset);
  assert.equal(cresset.featured, false);
  const dictabelt = catalog.products.find((row) => row.slug === "dictabelt");
  assert.ok(dictabelt);
  assert.equal(dictabelt.featured, false);
  const lemure = catalog.products.find((row) => row.slug === "lemure");
  assert.ok(lemure);
  assert.equal(lemure.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "somnus").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94415") && row.slug !== "somnus",
    ),
  );
});

test("vercel rewrites somnus to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/somnus");
  assert.equal(vercel.rewrites[0].destination, "/projects/somnus");
  assert.equal(vercel.rewrites[1].source, "/somnus/");
  assert.equal(vercel.rewrites[1].destination, "/projects/somnus");
  assert.equal(vercel.rewrites[2].source, "/somnus/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/somnus/:path*");
  assert.equal(vercel.rewrites[3].source, "/cresset");
  assert.equal(vercel.rewrites[3].destination, "/projects/cresset");
});

test("no leftover clone / iron-basket / wax-belt content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme, source]) {
    assert.doesNotMatch(blob, /iron-basket|ember-snuff|gnome-dial|battlement|wax-belt|stenotype/i);
  }
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
