import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CAT_PATH,
  CHIPS,
  CRASH_DATE,
  CRASH_TIMES,
  DESKTOP,
  DLL_PATH,
  ELECTRON_CROSS,
  EMBEDDED_CC,
  EVENT_3010,
  EVENT_3033,
  EXIT_CODE,
  FEATURED_ISSUE,
  FILED_AT,
  GPU,
  GPU_DRIVER,
  HOLD_VERDICTS,
  HUB_LINE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PACKAGE_FAMILY,
  PACKAGE_STATUS_BLOWN,
  PHRASE,
  PRIMARY_ISSUES,
  REJECTED_THIS_HOUR,
  REPORTER,
  SAME_CLASS,
  SIGNATURE_KIND,
  STANDALONE_CC,
  STATUS_PATH_NOT_FOUND,
  TITLE,
  UPDATER_FAMILY,
  VERDICTS,
  WIN_BUILD,
  analyze,
  chipsOf,
  classify,
  cloneTicket,
  crashTimeline,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isBlownSignature,
  isSealedHold,
  parseProbeLog,
  score,
  seedBlown,
  seedCatMissing,
  seedCatalogVoid,
  seedEvent3010,
  seedEvent3033,
  seedGpuDead,
  seedInPlace,
  seedNeedsRemediation,
  seedSealed,
  seedSessionsKilled,
  seedSwiftshaderBlocked,
  seedUnpackagedClear,
} from "./bulla.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./bulla.mjs", import.meta.url));
}

test("90891 seed is blown/alarm — in-place mutate of sealed MSIX", () => {
  const seed = seedBlown();
  const result = score(seed);
  assert.equal(result.verdict, "blown");
  assert.equal(result.blown, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "sealed");
  assert.equal(IDLE_WORD, "sealed");
  assert.doesNotMatch(result.idleWord, /bulla|^wax$|^lead$|^papal$|^chancery$|^msix$|^package$|^gpu$|^cat$|^desktop$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.inPlaceWrite, true);
  assert.equal(seed.catPresent, false);
  assert.equal(seed.event3010, true);
  assert.equal(seed.event3033, true);
  assert.equal(seed.gpuCrashed, true);
  assert.equal(seed.sessionsKilled, true);
  assert.equal(seed.packageStatus, PACKAGE_STATUS_BLOWN);
  assert.equal(seed.unpackagedOk, true);
  assert.equal(seed.dllBlocked, true);
  assert.equal(seed.exitCode, EXIT_CODE);
  assert.equal(seed.desktopVersion, DESKTOP);
  assert.equal(seed.embeddedCli, EMBEDDED_CC);
  assert.equal(seed.standaloneCli, STANDALONE_CC);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isBlownSignature(seed), true);
  assert.ok(result.chips.includes("blown"));
  assert.ok(result.chips.includes("in-place"));
  assert.ok(result.chips.includes("cat-missing"));
  assert.ok(result.chips.includes("event-3010"));
  assert.ok(result.chips.includes("event-3033"));
  assert.ok(result.chips.includes("gpu-dead"));
  assert.ok(result.chips.includes("sessions-killed"));
  assert.ok(result.chips.includes("unpackaged-clear"));
  assert.ok(!result.chips.includes("sealed"));
});

test("sealed seed is sealed/hold — intact cat, GPU alive, sessions running", () => {
  const seed = seedSealed();
  const result = score(seed);
  assert.equal(result.verdict, "sealed");
  assert.equal(result.sealed, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "sealed");
  assert.equal(seed.catPresent, true);
  assert.equal(seed.inPlaceWrite, false);
  assert.equal(seed.gpuCrashed, false);
  assert.equal(seed.sessionsKilled, false);
  assert.equal(isSealedHold(seed), true);
  assert.ok(result.chips.includes("sealed"));
});

test("empty / healthy ticket lands on sealed; emptyTicket is the seeded blown", () => {
  assert.equal(score({}).verdict, "sealed");
  assert.equal(
    score({
      inPlaceWrite: false,
      catPresent: true,
      event3010: false,
      event3033: false,
      gpuCrashed: false,
      sessionsKilled: false,
      packageStatus: "Ok",
      dllBlocked: false,
    }).verdict,
    "sealed",
  );
  assert.equal(emptyTicket().seed, "blown");
  assert.equal(score(emptyTicket()).verdict, "blown");
  assert.equal(
    cloneTicket({ in_place_write: true, cat_present: false, event_3010: true }).inPlaceWrite,
    true,
  );
});

test("decideSeed covers every named verdict and 90891 alias", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "sealed");
    assert.doesNotMatch(result.idleWord, /bulla|^wax$|^lead$|^papal$|^chancery$/i);
  }
  assert.equal(decide({ action: "90891" }).verdict, "blown");
  assert.equal(decide({ action: "blown" }).verdict, "blown");
  assert.equal(decide({ action: "sealed" }).verdict, "sealed");
});

test("rule: in-place + cat missing + 3010 + 3033 + GPU + sessions is blown", () => {
  const primary = {
    inPlaceWrite: true,
    catPresent: false,
    event3010: true,
    event3033: true,
    gpuCrashed: true,
    sessionsKilled: true,
    packageStatus: "Modified, NeedsRemediation",
    dllBlocked: true,
    unpackagedOk: true,
  };
  const result = score(primary);
  assert.equal(result.verdict, "blown");
  assert.equal(result.alarm, true);
  assert.equal(isBlownSignature(primary), true);

  const aliases = {
    in_place_write: true,
    cat_present: false,
    event_3010: true,
    event_3033: true,
    gpu_crashed: true,
    sessions_killed: true,
    package_status: "NeedsRemediation",
    dll_blocked: true,
  };
  assert.equal(score(aliases).verdict, "blown");
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedInPlace()).verdict, "in-place");
  assert.equal(score(seedCatMissing()).verdict, "cat-missing");
  assert.equal(score(seedGpuDead()).verdict, "gpu-dead");
  assert.equal(score(seedSessionsKilled()).verdict, "sessions-killed");
  assert.equal(score(seedNeedsRemediation()).verdict, "needs-remediation");
  assert.equal(score(seedUnpackagedClear()).verdict, "unpackaged-clear");
  assert.equal(score(seedSwiftshaderBlocked()).verdict, "swiftshader-blocked");
  assert.equal(score(seedCatalogVoid()).verdict, "catalog-void");
  assert.equal(score(seedEvent3010()).verdict, "event-3010");
  assert.equal(score(seedEvent3033()).verdict, "event-3033");
  assert.ok(chipsOf(seedInPlace()).includes("in-place"));
  assert.ok(chipsOf(seedCatMissing()).includes("cat-missing"));
  assert.ok(chipsOf(seedEvent3010()).includes("event-3010"));
  assert.ok(chipsOf(seedEvent3033()).includes("event-3033"));
  assert.equal(isSealedHold(seedBlown()), false);
});

test("local fingerprint files keep issue numbers and #90891 facts only", () => {
  const primary = readData("90891.json");
  const hold = readData("sealed.json");
  const blown = readData("blown.json");
  const inPlace = readData("in-place.json");
  const catMissing = readData("cat-missing.json");
  const gpuDead = readData("gpu-dead.json");
  const sessionsKilled = readData("sessions-killed.json");
  const needs = readData("needs-remediation.json");
  const unpackaged = readData("unpackaged-clear.json");
  const swift = readData("swiftshader-blocked.json");
  const catalogVoid = readData("catalog-void.json");
  const ev3010 = readData("event-3010.json");
  const ev3033 = readData("event-3033.json");
  const chips = readData("chips.json");
  const prints = readData("fingerprints.json");
  assert.equal(primary.issue, 90891);
  assert.equal(primary.inPlaceWrite, true);
  assert.equal(primary.catPresent, false);
  assert.equal(primary.event3010, true);
  assert.equal(primary.event3033, true);
  assert.equal(primary.gpuCrashed, true);
  assert.equal(primary.sessionsKilled, true);
  assert.equal(primary.packageStatus, PACKAGE_STATUS_BLOWN);
  assert.equal(primary.unpackagedOk, true);
  assert.equal(primary.exitCode, EXIT_CODE);
  assert.equal(score(primary).verdict, "blown");
  assert.equal(hold.issue, 90891);
  assert.equal(score(hold).verdict, "sealed");
  assert.equal(score(blown).verdict, "blown");
  assert.equal(score(inPlace).verdict, "in-place");
  assert.equal(score(catMissing).verdict, "cat-missing");
  assert.equal(score(gpuDead).verdict, "gpu-dead");
  assert.equal(score(sessionsKilled).verdict, "sessions-killed");
  assert.equal(score(needs).verdict, "needs-remediation");
  assert.equal(score(unpackaged).verdict, "unpackaged-clear");
  assert.equal(score(swift).verdict, "swiftshader-blocked");
  assert.equal(score(catalogVoid).verdict, "catalog-void");
  assert.equal(score(ev3010).verdict, "event-3010");
  assert.equal(score(ev3033).verdict, "event-3033");
  assert.equal(chips.idleWord, "sealed");
  assert.equal(FILED_AT, "2026-08-31T04:07:51Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:windows", "area:desktop"]);
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
  assert.equal(prints.featured, 90891);
  assert.equal(prints.primary[0].issue, 90891);
});

test("handle alarms on blown and allows sealed", async () => {
  const fail = await handle(seedBlown());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90891/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedSealed());
  assert.equal(hold.sealed, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /sealed/i);
});

test("CLI stdin JSON and file argument", () => {
  const sealed = JSON.stringify({
    seed: "sealed",
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: "Ok",
    dllBlocked: false,
  });
  const piped = spawnSync(process.execPath, [hookPath()], {
    input: sealed,
    encoding: "utf8",
  });
  assert.equal(piped.status, 0, piped.stderr);
  const fromStdin = JSON.parse(piped.stdout);
  assert.equal(fromStdin.verdict, "sealed");
  assert.equal(fromStdin.hold, true);

  const blownFile = fileURLToPath(new URL("../data/90891.json", import.meta.url));
  const filed = spawnSync(process.execPath, [hookPath(), blownFile], { encoding: "utf8" });
  assert.equal(filed.status, 0, filed.stderr);
  const fromFile = JSON.parse(filed.stdout);
  assert.equal(fromFile.verdict, "blown");
  assert.equal(fromFile.alarm, true);

  const sealedFile = fileURLToPath(new URL("../data/sealed.json", import.meta.url));
  const sealedRun = spawnSync(process.execPath, [hookPath(), sealedFile], { encoding: "utf8" });
  assert.equal(sealedRun.status, 0, sealedRun.stderr);
  assert.equal(JSON.parse(sealedRun.stdout).verdict, "sealed");
});

test("probe-log parser and crash timeline pair Event 3010/3033 with main.log", () => {
  const log = [
    "Event 3010: Code Integrity was unable to load AppxMetadata\\CodeIntegrity.cat — 0xC000003A",
    "Event 3033: claude.exe attempted to load app\\vk_swiftshader.dll",
    "GPU process gone: type: GPU, reason: crashed, exitCode: 101457950, serviceName: GPU",
    "package Modified, NeedsRemediation; standalone unpackaged clear",
  ].join("\n");
  const parsed = parseProbeLog(log);
  assert.equal(parsed.ticket.event3010, true);
  assert.equal(parsed.ticket.event3033, true);
  assert.equal(parsed.ticket.gpuCrashed, true);
  assert.equal(parsed.ticket.catPresent, false);
  assert.equal(score({ ...parsed.ticket, inPlaceWrite: true, sessionsKilled: true, dllBlocked: true }).verdict, "blown");

  const timeline = crashTimeline();
  assert.equal(timeline.length, 5);
  assert.deepEqual(timeline.map((row) => row.time), [...CRASH_TIMES]);
  assert.equal(timeline[0].date, CRASH_DATE);
  assert.equal(timeline[0].event3010.id, EVENT_3010);
  assert.equal(timeline[0].event3033.id, EVENT_3033);
  assert.match(timeline[0].mainLog, /101457950/);
});

test("verdict and chip lists; idle is never bulla / wax / lead / papal / chancery", () => {
  assert.deepEqual([...VERDICTS], [
    "sealed",
    "blown",
    "in-place",
    "cat-missing",
    "gpu-dead",
    "sessions-killed",
    "needs-remediation",
    "unpackaged-clear",
    "swiftshader-blocked",
    "catalog-void",
    "event-3010",
    "event-3033",
  ]);
  assert.ok(CHIPS.includes("blown"));
  assert.ok(HOLD_VERDICTS.includes("sealed"));
  assert.ok(!HOLD_VERDICTS.includes("bulla"));
  assert.doesNotMatch(IDLE_WORD, /bulla|^wax$|^lead$|^papal$|^chancery$|^msix$|^package$|^gpu$|^cat$|^desktop$/i);
  assert.equal(DESKTOP, "1.40609.0.0");
  assert.equal(PACKAGE_FAMILY, "Claude_1.40609.0.0_x64__pzs8sxrjxfjjc");
  assert.equal(SIGNATURE_KIND, "Developer");
  assert.equal(EMBEDDED_CC, "2.1.247");
  assert.equal(STANDALONE_CC, "2.1.251");
  assert.equal(EXIT_CODE, 101457950);
  assert.equal(STATUS_PATH_NOT_FOUND, "0xC000003A");
  assert.equal(EVENT_3010, 3010);
  assert.equal(EVENT_3033, 3033);
  assert.equal(CAT_PATH, "AppxMetadata\\CodeIntegrity.cat");
  assert.equal(DLL_PATH, "app\\vk_swiftshader.dll");
  assert.equal(REPORTER, "gsl0001");
  assert.equal(WIN_BUILD, "26200");
  assert.equal(GPU, "NVIDIA GeForce RTX 5060 Ti");
  assert.equal(GPU_DRIVER, "32.0.16.1088");
  assert.deepEqual([...PRIMARY_ISSUES], [90891]);
  assert.deepEqual([...SAME_CLASS], [89112, 81341, 89016]);
  assert.deepEqual([...UPDATER_FAMILY], [81875, 89687]);
  assert.deepEqual([...ELECTRON_CROSS], [51761]);
  assert.ok(NOT_PRODUCTS.includes("wraith"));
  assert.ok(NOT_PRODUCTS.includes("trompe"));
  assert.ok(NOT_PRODUCTS.includes("davy"));
  assert.ok(REJECTED_THIS_HOUR.includes(90892));
  assert.ok(REJECTED_THIS_HOUR.includes(90896));
  assert.match(PHRASE, /broken seal is not a hold/i);
  assert.match(HUB_LINE, /15:50 bulla/);
  assert.match(MARK, /15:50/);
  assert.match(MARK, /#89/);
  assert.match(MARK, /#90891/);
  assert.match(ISSUE_URL, /90891/);
});

test("living page seeds sealed idle and names blown; distinct chancery desk", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*sealed/);
  assert.match(html, /sealed/);
  assert.match(html, /blown/);
  assert.match(html, /in-place/);
  assert.match(html, /cat-missing/);
  assert.match(html, /gpu-dead/);
  assert.match(html, /sessions-killed/);
  assert.match(html, /needs-remediation/);
  assert.match(html, /unpackaged-clear/);
  assert.match(html, /swiftshader-blocked/);
  assert.match(html, /catalog-void/);
  assert.match(html, /event-3010/);
  assert.match(html, /event-3033/);
  assert.match(html, /#90891/);
  assert.match(html, /#89112/);
  assert.match(html, /#81341/);
  assert.match(html, /#89016/);
  assert.match(html, /#81875/);
  assert.match(html, /#89687/);
  assert.match(html, /51761/);
  assert.match(html, /15:50/);
  assert.match(html, /catalog #89/);
  assert.match(html, /1\.40609\.0\.0/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /gsl0001/);
  assert.match(html, /Cormorant/);
  assert.match(html, /IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /vk_swiftshader/);
  assert.match(html, /CodeIntegrity\.cat/);
  assert.match(html, /101457950/);
  assert.match(html, /0xC000003A/);
  assert.match(html, /16:46:30/);
  assert.match(html, /20:09:29/);
  assert.doesNotMatch(html, /Idle word:\s*bulla/i);
  assert.doesNotMatch(html, /Idle word:\s*wax/i);
  assert.doesNotMatch(html, /Idle word:\s*lead/i);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /plaster/);
  assert.doesNotMatch(html, /gilt frame/);
  assert.doesNotMatch(html, /pit-black/);
  assert.doesNotMatch(html, /brass gauze/);
  assert.doesNotMatch(html, /safelight/);
  assert.doesNotMatch(html, /Ground glass/);
});
