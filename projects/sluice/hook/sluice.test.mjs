import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  DESKTOP_VERSION,
  FAMILY,
  FEATURED_ISSUE,
  FILED_AT,
  FILE_OBJECTS_FLOOD,
  FILE_OBJECTS_REBOOT,
  FILE_RATE_ON,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  NTFC_ISSUE_45921,
  NTFC_ISSUE_67819,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEAT_OBJECTS_FLOOD,
  SEAT_OBJECTS_REBOOT,
  SEEDED_WORD,
  TITLE,
  TOKE_OBJECTS_FLOOD,
  TOKE_OBJECTS_REBOOT,
  TOKE_RATE_ON,
  UNACCOUNTED_GB,
  USER_MODE_PAGED_GB,
  VERDICTS,
  WINDOWS_BUILD,
  WSL_ISSUE,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedCousin,
  seedDrained,
  seedFileClimbing,
  seedNtfCCousin,
  seedPooled,
  seedStackOff,
  seedTokeClimbing,
  seedWatchdog,
} from "./sluice.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./sluice.mjs", import.meta.url));
}

test("idle drained is a hold; pool tags quiet after reboot or stack OFF", () => {
  const result = analyze(seedDrained());
  assert.equal(result.verdict, "drained");
  assert.equal(result.idleWord, "drained");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pooled, false);
  assert.equal(result.drained, true);
  assert.ok(result.chips.includes("drained"));
  assert.ok(!result.chips.includes("pooled"));
  assert.ok(!result.chips.includes("toke-climbing"));
  assert.doesNotMatch(
    result.idleWord,
    /pooled|sluice|limpet|quench|bulla|alidade|parison|cockade|lye|stationed|displaced|hung|marvered|unpinned|shed|sealed|blown/i,
  );
});

test("empty ticket and empty stdin classify drained", () => {
  assert.equal(classify(emptyTicket()), "drained");
  assert.equal(classify(""), "drained");
  assert.equal(classify(null), "drained");
  assert.equal(decideSeed("drained").verdict, "drained");
});

test("seeded pooled #91265 is alarm with the millrace chips", () => {
  const result = analyze(seedPooled());
  assert.equal(result.verdict, "pooled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.pooled, true);
  assert.ok(result.chips.includes("pooled"));
  assert.ok(result.chips.includes("toke-climbing"));
  assert.ok(result.chips.includes("file-climbing"));
  assert.ok(result.chips.includes("seat-climbing"));
  assert.ok(result.chips.includes("minifilter-held"));
  assert.ok(result.chips.includes("unaccounted"));
  assert.ok(result.chips.includes("janky"));
  assert.ok(result.chips.includes("reboot-only"));
  assert.ok(!result.chips.includes("drained"));
  assert.ok(!result.chips.includes("stack-off"));
  assert.match(result.contrast.gate, /closed|held/);
  assert.match(result.contrast.pond, /flood/);
  assert.match(result.contrast.race, /2/);
});

test("stack-off is a hold; toke-climbing is an alarm", () => {
  const off = analyze(seedStackOff());
  assert.equal(off.verdict, "stack-off");
  assert.equal(off.hold, true);
  assert.equal(off.alarm, false);
  assert.ok(off.chips.includes("stack-off"));
  assert.ok(!off.chips.includes("pooled"));

  const toke = analyze(seedTokeClimbing());
  assert.equal(toke.verdict, "toke-climbing");
  assert.equal(toke.hold, false);
  assert.equal(toke.alarm, true);
  assert.ok(toke.chips.includes("toke-climbing"));
  assert.ok(!toke.chips.includes("file-climbing"));
  assert.notEqual(toke.verdict, "pooled");
});

test("file-climbing is alarm without becoming pooled when Toke is quiet", () => {
  const result = analyze(seedFileClimbing());
  assert.equal(result.verdict, "file-climbing");
  assert.equal(result.alarm, true);
  assert.ok(result.chips.includes("file-climbing"));
  assert.ok(!result.chips.includes("pooled"));
  assert.ok(!result.chips.includes("toke-climbing"));
});

test("data fixtures classify drained vs pooled vs named chips", () => {
  assert.equal(classify(readData("drained.json")), "drained");
  assert.equal(classify(readData("pooled.json")), "pooled");
  assert.equal(classify(readData("91265.json")), "pooled");
  assert.equal(classify(readData("toke-climbing.json")), "toke-climbing");
  assert.equal(classify(readData("file-climbing.json")), "file-climbing");
  assert.equal(classify(readData("seat-climbing.json")), "seat-climbing");
  assert.equal(classify(readData("minifilter-held.json")), "minifilter-held");
  assert.equal(classify(readData("unaccounted.json")), "unaccounted");
  assert.equal(classify(readData("janky.json")), "janky");
  assert.equal(classify(readData("reboot-only.json")), "reboot-only");
  assert.equal(classify(readData("stack-off.json")), "stack-off");
  assert.equal(classify(readData("ntfC-cousin.json")), "ntfC-cousin");
  assert.equal(classify(readData("watchdog.json")), "watchdog");
});

test("pooled seed is alarm; drained and stack-off seeds are hold", () => {
  assert.equal(score(seedPooled()).alarm, true);
  assert.equal(score(seedPooled()).hold, false);
  assert.equal(score(seedDrained()).hold, true);
  assert.equal(score(seedDrained()).alarm, false);
  assert.equal(score(seedStackOff()).hold, true);
  assert.equal(score(seedStackOff()).alarm, false);
});

test("normalize seeds 91265 without ticket fields", () => {
  const ticket = normalize({ issue: 91265 });
  assert.equal(ticket.coworkStackOn, true);
  assert.equal(ticket.tokeRatePerSec, 2);
  assert.equal(ticket.fileRatePerSec, 11);
  assert.equal(ticket.tokeObjects, 2719886);
  assert.equal(ticket.fileObjects, 6644575);
  assert.equal(ticket.seatObjects, 10855380);
  assert.equal(ticket.unaccountedGB, 7.68);
  assert.equal(classify(ticket), "pooled");
});

test("score / decide / handle agree on pooled vs drained", () => {
  assert.equal(score(seedPooled()).verdict, "pooled");
  assert.equal(decide(seedDrained()).verdict, "drained");
  const fail = handle(seedPooled());
  const hold = handle(seedDrained());
  const off = handle(seedStackOff());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91265/);
  assert.match(hold.hookSpecificOutput.additionalContext, /drained/i);
  assert.match(off.hookSpecificOutput.additionalContext, /stack-off/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("pooled").verdict, "pooled");
  assert.equal(decideSeed(91265).verdict, "pooled");
  assert.equal(decideSeed("91265").verdict, "pooled");
  assert.equal(decideSeed("drained").verdict, "drained");
  assert.equal(decideSeed("stack-off").verdict, "stack-off");
  assert.equal(decideSeed("toke-climbing").verdict, "toke-climbing");
  assert.equal(decideSeed("file-climbing").verdict, "file-climbing");
  assert.equal(decideSeed("ntfC-cousin").verdict, "ntfC-cousin");
  assert.equal(decideSeed("watchdog").verdict, "watchdog");
});

test("CLI scores data files", () => {
  const pooled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91265.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pooled.status, 0, pooled.stderr);
  assert.equal(JSON.parse(pooled.stdout).verdict, "pooled");
  assert.equal(JSON.parse(pooled.stdout).alarm, true);

  const drained = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/drained.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(drained.status, 0, drained.stderr);
  assert.equal(JSON.parse(drained.stdout).verdict, "drained");
  assert.equal(JSON.parse(drained.stdout).hold, true);

  const off = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/stack-off.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(off.status, 0, off.stderr);
  assert.equal(JSON.parse(off.stdout).verdict, "stack-off");
  assert.equal(JSON.parse(off.stdout).hold, true);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91265);
  assert.deepEqual([...PRIMARY_ISSUES], [91265]);
  assert.deepEqual([...FAMILY], [55361, 45889, 48813, 45921, 67819, 85480]);
  assert.deepEqual(
    [...COUSINS],
    [55361, 45889, 48813, 45921, 67819, 85480, 40804],
  );
  assert.equal(NTFC_ISSUE_45921, 45921);
  assert.equal(NTFC_ISSUE_67819, 67819);
  assert.equal(WSL_ISSUE, 40804);
  assert.equal(FILED_AT, "2026-09-01T16:26:00Z");
  assert.equal(DESKTOP_VERSION, "1.40609.0.0");
  assert.equal(PLATFORM, "windows");
  assert.equal(WINDOWS_BUILD, "Windows 11 Pro 10.0.26200");
  assert.equal(REPORTER, "milandin-hash");
  assert.equal(TOKE_RATE_ON, 2);
  assert.equal(FILE_RATE_ON, 11);
  assert.equal(TOKE_OBJECTS_FLOOD, 2719886);
  assert.equal(FILE_OBJECTS_FLOOD, 6644575);
  assert.equal(SEAT_OBJECTS_FLOOD, 10855380);
  assert.equal(TOKE_OBJECTS_REBOOT, 6499);
  assert.equal(FILE_OBJECTS_REBOOT, 33913);
  assert.equal(SEAT_OBJECTS_REBOOT, 34111);
  assert.equal(UNACCOUNTED_GB, 7.68);
  assert.equal(USER_MODE_PAGED_GB, 0.29);
  assert.equal(IDLE_WORD, "drained");
  assert.equal(SEEDED_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "sluice");
  assert.deepEqual([...HOLD_VERDICTS], ["drained", "stack-off"]);
  assert.ok(ALARM_VERDICTS.includes("pooled"));
  assert.ok(ALARM_VERDICTS.includes("toke-climbing"));
  assert.ok(ALARM_VERDICTS.includes("janky"));
  assert.ok(!ALARM_VERDICTS.includes("drained"));
  assert.ok(!ALARM_VERDICTS.includes("stack-off"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "perf:memory", "area:cowork", "area:desktop"],
  );
  assert.match(TITLE, /Toke\/File\/SeAt/);
  assert.match(ISSUE_URL, /91265/);
  assert.match(PHRASE, /mill pond rising/i);
  assert.match(HUB_LINE, /02:50 sluice/);
  assert.match(HUB_LINE, /admit drained/);
  assert.match(MARK, /02:50/);
  assert.match(MARK, /#103/);
  assert.match(MARK, /#91265/);
  assert.match(CONTRAST_NOTE, /KERNEL-POOL RETENTION/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("limpet"));
  assert.ok(NOT_PRODUCTS.includes("alidade"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.ok(NOT_PRODUCTS.includes("bulla"));
  assert.ok(BANNED_NAMES.includes("Millrace"));
  assert.ok(BANNED_NAMES.includes("Alidade"));
  assert.ok(BANNED_NAMES.includes("Limpet"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "drained");
  assert.equal(chips.seededWord, "pooled");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91265);
  assert.equal(fp.tokeObjectsFlood, 2719886);
  assert.equal(fp.desktopVersion, "1.40609.0.0");
  assert.equal(fp.unaccountedGB, 7.68);
  assert.deepEqual(fp.family, [55361, 45889, 48813, 45921, 67819, 85480]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "pooled");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.tokeObjectsFlood, 2719886);
});

test("chipsOf on a raw pooled ticket still marks Toke/File/SeAt climb", () => {
  const chips = chipsOf({
    coworkStackOn: true,
    tokeRatePerSec: 2,
    fileRatePerSec: 11,
    tokeObjects: 2719886,
    fileObjects: 6644575,
    seatObjects: 10855380,
    unaccountedGB: 7.68,
    userModePagedGB: 0.29,
    uiJankMs: 120,
    rebootClears: true,
    minifilterHeld: true,
    outputText:
      "pooled; Cowork stack ON; Toke climbing ~2/s; File climbing ~11/s; SeAt climbing; unaccounted 7.68 GB; UI jank; only reboot reclaims",
  });
  assert.ok(chips.includes("pooled"));
  assert.ok(chips.includes("toke-climbing"));
  assert.ok(chips.includes("file-climbing"));
  assert.ok(!chips.includes("drained"));
});

test("cousins are not conflated with pooled", () => {
  assert.notEqual(classify(seedCousin("ntfC-cousin")), "pooled");
  assert.notEqual(classify(seedCousin("watchdog")), "pooled");
  assert.notEqual(classify(seedCousin(85480)), "pooled");
  assert.notEqual(classify(seedCousin(55361)), "pooled");
  assert.notEqual(classify({ issue: 45921 }), "pooled");
  assert.notEqual(classify({ issue: 67819 }), "pooled");
  assert.notEqual(classify({ issue: 85480 }), "pooled");
  assert.notEqual(classify({ issue: 40804 }), "pooled");
  const ntfc = analyze(seedNtfCCousin());
  assert.ok(ntfc.reasons.some((row) => /ntfC|not Sluice|#45921/i.test(row)));
  const dog = analyze(seedWatchdog());
  assert.ok(dog.reasons.some((row) => /watchdog|#67819/i.test(row)));
});

test("stack ON + Toke/File climb → pooled; stack OFF + quiet → drained", () => {
  assert.equal(
    classify({
      coworkStackOn: true,
      tokeRatePerSec: 2,
      fileRatePerSec: 11,
      tokeObjects: 2719886,
      fileObjects: 6644575,
      seatObjects: 10855380,
      unaccountedGB: 7.68,
      userModePagedGB: 0.29,
      uiJankMs: 120,
      rebootClears: true,
      outputText: "pooled; Cowork stack ON; Toke climbing; File climbing",
    }),
    "pooled",
  );
  assert.equal(
    classify({
      coworkStackOn: false,
      tokeRatePerSec: 0,
      fileRatePerSec: 0,
      tokeObjects: 6499,
      fileObjects: 33913,
      seatObjects: 34111,
      uiJankMs: 0,
      outputText: "drained race; pool tags quiet; Cowork stack OFF or freshly rebooted",
    }),
    "drained",
  );
});

test("living page is a millrace sluice desk, idle drained, seeded pooled", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*drained/);
  assert.match(html, /drained/);
  assert.match(html, /pooled/);
  assert.match(html, /toke-climbing/);
  assert.match(html, /file-climbing/);
  assert.match(html, /seat-climbing/);
  assert.match(html, /minifilter-held/);
  assert.match(html, /unaccounted/);
  assert.match(html, /janky/);
  assert.match(html, /reboot-only/);
  assert.match(html, /stack-off/);
  assert.match(html, /ntfC-cousin/);
  assert.match(html, /watchdog/);
  assert.match(html, /#91265/);
  assert.match(html, /#45921/);
  assert.match(html, /#67819/);
  assert.match(html, /#85480/);
  assert.match(html, /40804/);
  assert.match(html, /02:50/);
  assert.match(html, /catalog #103/);
  assert.match(html, /1\.40609\.0\.0/);
  assert.match(html, /2,719,886/);
  assert.match(html, /6,644,575/);
  assert.match(html, /10,855,380/);
  assert.match(html, /7\.68/);
  assert.match(html, /Fraunces/);
  assert.match(html, /Source\+Sans\+3|Source Sans 3/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the race/);
  assert.match(html, /Pin idle drained/);
  assert.match(html, /Pin seeded pooled/);
  assert.match(html, /Admit drained/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to drained/);
  assert.match(html, /millrace|mill race|mill pond/i);
  assert.match(html, /sluice/i);
  assert.match(html, /gate wheel|sluice-gate|sluice gate/i);
  assert.match(html, /pool-gauge|pool gauge/i);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Idle word:\s*sluice/i);
  assert.doesNotMatch(html, /Idle word:\s*stationed/i);
  assert.doesNotMatch(html, /Pin idle stationed/);
  assert.doesNotMatch(html, /Pin idle marvered/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the gather/);
  assert.doesNotMatch(html, /Score the brim/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=EB\+Garamond/);
  assert.doesNotMatch(html, /family=Mulish/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /glory hole/i);
  assert.doesNotMatch(html, /hat-block/);
  assert.doesNotMatch(html, /silk cockade/);
  assert.doesNotMatch(html, /lye vat/);
  assert.doesNotMatch(html, /milliner/);
  assert.doesNotMatch(html, /punty/);
  assert.doesNotMatch(html, /plane-table/);
});
