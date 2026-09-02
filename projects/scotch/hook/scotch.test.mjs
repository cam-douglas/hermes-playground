import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ACCESS_DENIED,
  ALARM_VERDICTS,
  ARCH,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  EXE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  GPU_GONE,
  GPU_TIMES,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOG_PATH,
  MARK,
  MEMORY_LINE,
  MSIX_FROM,
  MSIX_TO,
  NOT_MAIN,
  NOT_PRODUCTS,
  OPEN_SERVICE,
  OS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  RAM,
  REBOOTS_IN_DAY,
  REPORTER,
  SECOND_INSTANCE,
  SEEDED_WORD,
  SERVICE,
  STOP_WARNING,
  TITLE,
  USED_BY_ANOTHER,
  VERDICTS,
  WARNING,
  WINDOW_DEATHS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isChocked,
  isRolled,
  normalize,
  score,
  seedAccessDenied,
  seedChocked,
  seedCousin,
  seedGpuAdjacent,
  seedHasRepro,
  seedHold,
  seedMsixAdjacent,
  seedOpenService,
  seedRebootOnly,
  seedRecoveryActions,
  seedRolled,
  seedSecondInstance,
  seedUncleanDeath,
} from "./scotch.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./scotch.mjs", import.meta.url));
}

test("armed recovery + no Access is denied → chocked", () => {
  const result = analyze({
    recoveryConfigured: true,
    recoveryArmed: true,
    accessDenied: false,
    openServiceDenied: false,
    crashStaysDown: false,
    rebootRequired: false,
    uncleanDeath: false,
    windowGone: false,
    mainProcessAlive: true,
    secondInstanceSuppressed: false,
  });
  assert.equal(result.verdict, "chocked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rolled, false);
  assert.equal(result.chocked, true);
  assert.equal(isChocked(result.ticket), true);
  assert.equal(isRolled(result.ticket), false);
});

test("Access is denied + recovery unarmed + reboot-only → rolled", () => {
  const result = analyze({
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    windowGone: true,
    mainProcessAlive: true,
    secondInstanceSuppressed: true,
  });
  assert.equal(result.verdict, "rolled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rolled, true);
  assert.equal(isRolled(result.ticket), true);
  assert.ok(result.chips.includes("rolled"));
  assert.ok(result.chips.includes("access-denied"));
  assert.ok(result.chips.includes("recovery-actions"));
  assert.ok(!result.chips.includes("chocked"));
});

test("idle chocked is a hold; recovery actions configured successfully", () => {
  const result = analyze(seedChocked());
  assert.equal(result.verdict, "chocked");
  assert.equal(result.idleWord, "chocked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rolled, false);
  assert.equal(result.chocked, true);
  assert.ok(result.chips.includes("chocked"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("rolled"));
  assert.equal(result.ticket.recoveryConfigured, true);
  assert.equal(result.ticket.accessDenied, false);
  assert.equal(result.ticket.crashStaysDown, false);
  assert.match(result.contrast.case, /chocked/i);
  assert.doesNotMatch(
    result.idleWord,
    /rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked/i,
  );
});

test("empty ticket and empty stdin classify chocked", () => {
  assert.equal(classify(emptyTicket()), "chocked");
  assert.equal(classify(""), "chocked");
  assert.equal(classify(null), "chocked");
  assert.equal(decideSeed("chocked").verdict, "chocked");
  assert.equal(decideSeed("open").verdict, "chocked");
});

test("seeded rolled #91324 is alarm with Access is denied and reboot-only", () => {
  const result = analyze(seedRolled());
  assert.equal(result.verdict, "rolled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rolled, true);
  assert.ok(result.chips.includes("rolled"));
  assert.ok(result.chips.includes("access-denied"));
  assert.ok(result.chips.includes("recovery-actions"));
  assert.ok(result.chips.includes("open-service"));
  assert.ok(result.chips.includes("reboot-only"));
  assert.ok(result.chips.includes("unclean-death"));
  assert.ok(result.chips.includes("gpu-adjacent"));
  assert.ok(result.chips.includes("msix-adjacent"));
  assert.ok(result.chips.includes("second-instance"));
  assert.ok(result.chips.includes("has-repro"));
  assert.ok(!result.chips.includes("chocked"));
  assert.match(result.contrast.case, /rolled/i);
  assert.equal(result.ticket.service, SERVICE);
  assert.equal(result.ticket.exe, EXE);
  assert.equal(result.ticket.logPath, LOG_PATH);
  assert.equal(result.ticket.version, MSIX_FROM);
  assert.equal(result.ticket.platform, PLATFORM);
});

test("data fixtures classify chocked vs rolled vs named chips", () => {
  assert.equal(classify(readData("chocked.json")), "chocked");
  assert.equal(classify(readData("rolled.json")), "rolled");
  assert.equal(classify(readData("91324.json")), "rolled");
  assert.equal(classify(readData("access-denied.json")), "access-denied");
  assert.equal(classify(readData("recovery-actions.json")), "recovery-actions");
  assert.equal(classify(readData("open-service.json")), "open-service");
  assert.equal(classify(readData("reboot-only.json")), "reboot-only");
  assert.equal(classify(readData("unclean-death.json")), "unclean-death");
  assert.equal(classify(readData("gpu-adjacent.json")), "gpu-adjacent");
  assert.equal(classify(readData("msix-adjacent.json")), "msix-adjacent");
  assert.equal(classify(readData("second-instance.json")), "second-instance");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("rolled seed is alarm; chocked / hold are holds", () => {
  assert.equal(score(seedRolled()).alarm, true);
  assert.equal(score(seedRolled()).hold, false);
  assert.equal(score(seedChocked()).hold, true);
  assert.equal(score(seedChocked()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedAccessDenied()).alarm, true);
  assert.equal(score(seedRecoveryActions()).alarm, true);
});

test("normalize seeds 91324 without ticket fields", () => {
  const ticket = normalize({ issue: 91324 });
  assert.equal(ticket.accessDenied, true);
  assert.equal(ticket.recoveryConfigured, false);
  assert.equal(ticket.openServiceDenied, true);
  assert.equal(ticket.crashStaysDown, true);
  assert.equal(ticket.rebootRequired, true);
  assert.equal(ticket.service, SERVICE);
  assert.equal(ticket.exe, EXE);
  assert.equal(classify(ticket), "rolled");
});

test("score / decide / handle agree on rolled vs chocked", () => {
  assert.equal(score(seedRolled()).verdict, "rolled");
  assert.equal(decide(seedChocked()).verdict, "chocked");
  const fail = handle(seedRolled());
  const hold = handle(seedChocked());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91324/);
  assert.match(fail.hookSpecificOutput.additionalContext, /CoworkVMService/);
  assert.match(hold.hookSpecificOutput.additionalContext, /chocked/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("rolled").verdict, "rolled");
  assert.equal(decideSeed(91324).verdict, "rolled");
  assert.equal(decideSeed("91324").verdict, "rolled");
  assert.equal(decideSeed("chocked").verdict, "chocked");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("access-denied").verdict, "access-denied");
  assert.equal(decideSeed("recovery-actions").verdict, "recovery-actions");
  assert.equal(decideSeed("open-service").verdict, "open-service");
  assert.equal(decideSeed("reboot-only").verdict, "reboot-only");
});

test("CLI scores data files", () => {
  const rolled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91324.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(rolled.status, 0, rolled.stderr);
  assert.equal(JSON.parse(rolled.stdout).verdict, "rolled");
  assert.equal(JSON.parse(rolled.stdout).alarm, true);

  const chocked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/chocked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(chocked.status, 0, chocked.stderr);
  assert.equal(JSON.parse(chocked.stdout).verdict, "chocked");
  assert.equal(JSON.parse(chocked.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91324);
  assert.deepEqual([...PRIMARY_ISSUES], [91324]);
  assert.equal(COUSIN_ISSUE, 90105);
  assert.deepEqual([...COUSINS], [90105, 89912, 89692, 89648, 89687]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-01T21:25:43Z");
  assert.equal(SERVICE, "CoworkVMService");
  assert.equal(EXE, "cowork-svc.exe");
  assert.equal(LOG_PATH, "C:\\ProgramData\\Claude\\Logs\\cowork-service.log");
  assert.match(WARNING, /failed to configure recovery actions/);
  assert.match(WARNING, /Access is denied/);
  assert.match(STOP_WARNING, /failed to disarm recovery actions/);
  assert.equal(ACCESS_DENIED, "Access is denied");
  assert.equal(OPEN_SERVICE, "open service: Access is denied");
  assert.equal(GPU_GONE, "GPU process gone");
  assert.deepEqual([...GPU_TIMES], ["11:29:12", "12:50:44"]);
  assert.equal(SECOND_INSTANCE, "second-instance: suppressing duplicate argv");
  assert.equal(NOT_MAIN, "Not main instance, returning early from app ready");
  assert.equal(USED_BY_ANOTHER, "Claude is being used by another program");
  assert.match(MEMORY_LINE, /tree_rss_sum=15216MB/);
  assert.equal(MSIX_FROM, "1.40609.0.0");
  assert.equal(MSIX_TO, "1.40609.1.0");
  assert.equal(OS, "Windows 11 Pro 10.0.26200");
  assert.equal(ARCH, "x64");
  assert.equal(RAM, "64 GB");
  assert.equal(PLATFORM, "windows");
  assert.equal(REBOOTS_IN_DAY, 3);
  assert.equal(WINDOW_DEATHS, 3);
  assert.equal(REPORTER, "danarkind");
  assert.equal(IDLE_WORD, "chocked");
  assert.equal(SEEDED_WORD, "rolled");
  assert.notEqual(IDLE_WORD, "rolled");
  assert.notEqual(IDLE_WORD, "clasped");
  assert.notEqual(IDLE_WORD, "sprung");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "cased");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "sifted");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.deepEqual([...HOLD_VERDICTS], ["chocked", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("rolled"));
  assert.ok(ALARM_VERDICTS.includes("access-denied"));
  assert.ok(ALARM_VERDICTS.includes("reboot-only"));
  assert.ok(!ALARM_VERDICTS.includes("chocked"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:cowork", "area:desktop"],
  );
  assert.match(TITLE, /CoworkVMService/);
  assert.match(TITLE, /Access is denied/);
  assert.match(ISSUE_URL, /91324/);
  assert.match(PHRASE, /cannot arm recovery/i);
  assert.match(HUB_LINE, /10:50 scotch/);
  assert.match(HUB_LINE, /admit chocked/);
  assert.match(MARK, /10:50/);
  assert.match(MARK, /#111/);
  assert.match(MARK, /#91324/);
  assert.match(CONTRAST_NOTE, /CoworkVMService FAILS TO CONFIGURE WINDOWS SCM RECOVERY ACTIONS/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("fibula"));
  assert.ok(NOT_PRODUCTS.includes("virgule"));
  assert.ok(NOT_PRODUCTS.includes("riddle"));
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(BANNED_NAMES.includes("Recovery"));
  assert.ok(BANNED_NAMES.includes("Fibula"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "chocked");
  assert.equal(chips.seededWord, "rolled");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91324);
  assert.equal(fp.cousin, 90105);
  assert.deepEqual(fp.cousins, [90105, 89912, 89692, 89648, 89687]);
  assert.equal(fp.service, "CoworkVMService");
  assert.equal(fp.exe, "cowork-svc.exe");
  assert.equal(fp.msixFrom, "1.40609.0.0");
  assert.equal(fp.logPath, LOG_PATH);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "rolled");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.accessDenied, true);
});

test("chipsOf on a raw Access-is-denied ticket still marks rolled", () => {
  const chips = chipsOf({
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    outputText:
      "rolled; #91324; Access is denied configuring recovery actions; crashed service stays down until reboot",
  });
  assert.ok(chips.includes("rolled"));
  assert.ok(chips.includes("access-denied"));
  assert.ok(chips.includes("recovery-actions"));
  assert.ok(chips.includes("open-service"));
  assert.ok(!chips.includes("chocked"));
});

test("cousin #90105 is not conflated with rolled primary", () => {
  assert.notEqual(classify(seedCousin()), "rolled");
  assert.notEqual(classify({ issue: 90105 }), "rolled");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /90105|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become rolled", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "rolled", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91324);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedAccessDenied()).verdict, "access-denied");
  assert.equal(analyze(seedRecoveryActions()).verdict, "recovery-actions");
  assert.equal(analyze(seedOpenService()).verdict, "open-service");
  assert.equal(analyze(seedRebootOnly()).verdict, "reboot-only");
  assert.equal(analyze(seedUncleanDeath()).verdict, "unclean-death");
  assert.equal(analyze(seedGpuAdjacent()).verdict, "gpu-adjacent");
  assert.equal(analyze(seedMsixAdjacent()).verdict, "msix-adjacent");
  assert.equal(analyze(seedSecondInstance()).verdict, "second-instance");
  assert.equal(analyze(seedHasRepro()).verdict, "has-repro");
  assert.equal(analyze(seedHold()).ticket.recoveryConfigured, true);
  assert.equal(isRolled(seedChocked()), false);
  assert.equal(isRolled(seedRolled()), true);
});

test("living page is a Scotch atelier, idle chocked, seeded rolled", () => {
  const html = readPage();
  assert.match(html, /<title>Scotch/);
  assert.match(html, /Idle word:\s*chocked/);
  assert.match(html, /chocked/);
  assert.match(html, /rolled/);
  assert.match(html, /access-denied/);
  assert.match(html, /recovery-actions/);
  assert.match(html, /open-service/);
  assert.match(html, /reboot-only/);
  assert.match(html, /unclean-death/);
  assert.match(html, /gpu-adjacent/);
  assert.match(html, /msix-adjacent/);
  assert.match(html, /second-instance/);
  assert.match(html, /has-repro/);
  assert.match(html, /#91324/);
  assert.match(html, /#90105/);
  assert.match(html, /#89912/);
  assert.match(html, /#89692/);
  assert.match(html, /#89648/);
  assert.match(html, /#89687/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /10:50/);
  assert.match(html, /catalog #111/);
  assert.match(html, /CoworkVMService/);
  assert.match(html, /cowork-svc\.exe/);
  assert.match(html, /Access is denied/);
  assert.match(html, /recovery actions/);
  assert.match(html, /1\.40609/);
  assert.match(html, /ProgramData/);
  assert.match(html, /GPU process gone/);
  assert.match(html, /family=Spectral|Spectral/);
  assert.match(html, /family=Sora|Sora/);
  assert.match(html, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the block/);
  assert.match(html, /Pin idle chocked/);
  assert.match(html, /Pin seeded rolled/);
  assert.match(html, /Admit chocked/);
  assert.match(html, /timber scotch|wagon wheel|iron rail|chalk marks on sleeper|oil lantern|switchman's hut/i);
  assert.match(html, /CoworkVMService FAILS TO CONFIGURE WINDOWS SCM RECOVERY ACTIONS/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*rolled/i);
  assert.doesNotMatch(html, /Idle word:\s*clasped/i);
  assert.doesNotMatch(html, /Idle word:\s*sprung/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Idle word:\s*cased/i);
  assert.doesNotMatch(html, /Idle word:\s*aired/i);
  assert.doesNotMatch(html, /Idle word:\s*sifted/i);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Pin idle rolled/);
  assert.doesNotMatch(html, /Pin idle clasped/);
  assert.doesNotMatch(html, /Pin idle sprung/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains\+Mono/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Scotch, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Scotch/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /CoworkVMService FAILS TO CONFIGURE WINDOWS SCM RECOVERY ACTIONS/,
  );
  assert.match(readme, /NOT \*\*Sluice\*\*/);
  assert.match(readme, /NOT \*\*Bulla\*\*/);
  assert.match(readme, /NOT \*\*Limpet\*\*/);
  assert.match(readme, /NOT \*\*Fibula\*\*/);
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /Product name stays \*\*Scotch\*\*/);
  assert.match(readme, /Idle word: \*\*chocked\*\*/);
  assert.match(readme, /#90105/);
  assert.match(readme, /#89912/);
  assert.match(readme, /CoworkVMService/);
  assert.match(readme, /cowork-svc\.exe/);
  assert.match(readme, /Access is denied/);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
