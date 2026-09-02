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
  COUSIN_ISSUE,
  CREATE_TOOL,
  CRON_EXPRESSION,
  CROSS_ECOSYSTEM,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INTERFACE,
  IS_RUNNING,
  ISSUE_URL,
  LABELS,
  LAST_RUN_AT,
  LIST_TOOL,
  MARK,
  NOT_PRODUCTS,
  OBSERVED_MINUTES,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  PUSH_NOTIFICATION,
  REPORTER,
  RUN_NOW,
  SCHEDULED_TASKS_PATH,
  SEEDED_WORD,
  SKIPPED_MARK,
  SOCIAL_METRICS,
  STALL_COUNT,
  STALL_GLOB,
  STALL_READS,
  STALL_TOOL_CALLS,
  TASK_DEFINITIONS,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isArrested,
  isSkipped,
  normalize,
  score,
  seedArrested,
  seedCloudOkLocalBad,
  seedCousin,
  seedHasClearRepro,
  seedHold,
  seedIsrunningStuck,
  seedLastrunatLies,
  seedMidRunStall,
  seedPushnotificationRuledOut,
  seedRunNowRepro,
  seedSkipped,
} from "./escapement.mjs";

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
  return fileURLToPath(new URL("./escapement.mjs", import.meta.url));
}

test("completed or loud fail + isRunning cleared + next fire allowed → arrested", () => {
  const result = analyze({
    completedOrFailedLoudly: true,
    isRunningCleared: true,
    nextFireAllowed: true,
    isRunning: false,
    nextFireSkipped: false,
    lastRunAtLies: false,
  });
  assert.equal(result.verdict, "arrested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.skipped, false);
  assert.equal(result.arrested, true);
  assert.equal(isArrested(result.ticket), true);
  assert.equal(isSkipped(result.ticket), false);
});

test("isRunning stuck + next fire Skipped + lastRunAt lies → skipped", () => {
  const result = analyze({
    isRunning: true,
    nextFireSkipped: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    stalledMidRun: true,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
  });
  assert.equal(result.verdict, "skipped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.skipped, true);
  assert.equal(isSkipped(result.ticket), true);
  assert.ok(result.chips.includes("skipped"));
  assert.ok(result.chips.includes("isrunning-stuck"));
  assert.ok(result.chips.includes("lastrunat-lies"));
  assert.ok(!result.chips.includes("arrested"));
});

test("idle arrested is a hold; scheduled run completes or fails loudly", () => {
  const result = analyze(seedArrested());
  assert.equal(result.verdict, "arrested");
  assert.equal(result.idleWord, "arrested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.skipped, false);
  assert.equal(result.arrested, true);
  assert.ok(result.chips.includes("arrested"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("skipped"));
  assert.equal(result.ticket.completedOrFailedLoudly, true);
  assert.equal(result.ticket.isRunningCleared, true);
  assert.equal(result.ticket.nextFireAllowed, true);
  assert.match(result.contrast.case, /arrested/i);
  assert.doesNotMatch(
    result.idleWord,
    /jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|indexed/i,
  );
});

test("empty ticket and empty stdin classify arrested", () => {
  assert.equal(classify(emptyTicket()), "arrested");
  assert.equal(classify(""), "arrested");
  assert.equal(classify(null), "arrested");
  assert.equal(decideSeed("arrested").verdict, "arrested");
  assert.equal(decideSeed("open").verdict, "arrested");
});

test("seeded skipped #91371 is alarm with isRunning stuck and next fire Skipped", () => {
  const result = analyze(seedSkipped());
  assert.equal(result.verdict, "skipped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.skipped, true);
  assert.ok(result.chips.includes("skipped"));
  assert.ok(result.chips.includes("isrunning-stuck"));
  assert.ok(result.chips.includes("mid-run-stall"));
  assert.ok(result.chips.includes("lastrunat-lies"));
  assert.ok(result.chips.includes("cloud-ok-local-bad"));
  assert.ok(result.chips.includes("pushnotification-ruled-out"));
  assert.ok(result.chips.includes("run-now-repro"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("arrested"));
  assert.match(result.contrast.case, /skipped/i);
  assert.equal(result.ticket.isRunning, true);
  assert.equal(result.ticket.nextFireSkipped, true);
  assert.equal(result.ticket.lastRunAtLies, true);
  assert.equal(result.ticket.platform, PLATFORM);
  assert.equal(result.ticket.cronExpression, CRON_EXPRESSION);
  assert.equal(result.ticket.createTool, CREATE_TOOL);
});

test("data fixtures classify arrested vs skipped vs named chips", () => {
  assert.equal(classify(readData("arrested.json")), "arrested");
  assert.equal(classify(readData("skipped.json")), "skipped");
  assert.equal(classify(readData("91371.json")), "skipped");
  assert.equal(classify(readData("isrunning-stuck.json")), "isrunning-stuck");
  assert.equal(classify(readData("mid-run-stall.json")), "mid-run-stall");
  assert.equal(classify(readData("lastrunat-lies.json")), "lastrunat-lies");
  assert.equal(classify(readData("cloud-ok-local-bad.json")), "cloud-ok-local-bad");
  assert.equal(classify(readData("pushnotification-ruled-out.json")), "pushnotification-ruled-out");
  assert.equal(classify(readData("run-now-repro.json")), "run-now-repro");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("skipped-fire.json")), "skipped");
  assert.equal(classify(readData("clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("windows-desktop.json")), "has-clear-repro");
});

test("skipped seed is alarm; arrested / hold are holds", () => {
  assert.equal(score(seedSkipped()).alarm, true);
  assert.equal(score(seedSkipped()).hold, false);
  assert.equal(score(seedArrested()).hold, true);
  assert.equal(score(seedArrested()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedIsrunningStuck()).alarm, true);
  assert.equal(score(seedLastrunatLies()).alarm, true);
});

test("normalize seeds 91371 without ticket fields", () => {
  const ticket = normalize({ issue: 91371 });
  assert.equal(ticket.isRunning, true);
  assert.equal(ticket.nextFireSkipped, true);
  assert.equal(ticket.lastRunAtLies, true);
  assert.equal(ticket.stalledMidRun, true);
  assert.equal(ticket.createTool, CREATE_TOOL);
  assert.equal(ticket.cronExpression, CRON_EXPRESSION);
  assert.equal(classify(ticket), "skipped");
});

test("score / decide / handle agree on skipped vs arrested", () => {
  assert.equal(score(seedSkipped()).verdict, "skipped");
  assert.equal(decide(seedArrested()).verdict, "arrested");
  const fail = handle(seedSkipped());
  const hold = handle(seedArrested());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91371/);
  assert.match(fail.hookSpecificOutput.additionalContext, /isRunning/);
  assert.match(hold.hookSpecificOutput.additionalContext, /arrested/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("skipped").verdict, "skipped");
  assert.equal(decideSeed(91371).verdict, "skipped");
  assert.equal(decideSeed("91371").verdict, "skipped");
  assert.equal(decideSeed("arrested").verdict, "arrested");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("isrunning-stuck").verdict, "isrunning-stuck");
  assert.equal(decideSeed("mid-run-stall").verdict, "mid-run-stall");
  assert.equal(decideSeed("lastrunat-lies").verdict, "lastrunat-lies");
  assert.equal(decideSeed("cloud-ok-local-bad").verdict, "cloud-ok-local-bad");
});

test("CLI scores data files", () => {
  const skipped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91371.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(skipped.status, 0, skipped.stderr);
  assert.equal(JSON.parse(skipped.stdout).verdict, "skipped");
  assert.equal(JSON.parse(skipped.stdout).alarm, true);

  const arrested = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/arrested.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(arrested.status, 0, arrested.stderr);
  assert.equal(JSON.parse(arrested.stdout).verdict, "arrested");
  assert.equal(JSON.parse(arrested.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91371);
  assert.deepEqual([...PRIMARY_ISSUES], [91371]);
  assert.equal(COUSIN_ISSUE, 89275);
  assert.deepEqual([...COUSINS], [89275, 91095, 89811, 89135, 88825, 90157, 89936]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-02T02:39:41Z");
  assert.equal(CREATE_TOOL, "mcp__scheduled-tasks__create_scheduled_task");
  assert.equal(LIST_TOOL, "mcp__scheduled-tasks__list_scheduled_tasks");
  assert.equal(SCHEDULED_TASKS_PATH, "~/.claude/scheduled-tasks/");
  assert.equal(CRON_EXPRESSION, "30 8 * * *");
  assert.equal(IS_RUNNING, "isRunning");
  assert.equal(SKIPPED_MARK, "Skipped");
  assert.equal(LAST_RUN_AT, "lastRunAt");
  assert.equal(PUSH_NOTIFICATION, "PushNotification");
  assert.equal(RUN_NOW, "Run now");
  assert.equal(SOCIAL_METRICS, "social-metrics-auto-log");
  assert.equal(STALL_TOOL_CALLS, 4);
  assert.equal(STALL_READS, 2);
  assert.equal(STALL_GLOB, 1);
  assert.equal(STALL_COUNT, 4);
  assert.equal(TASK_DEFINITIONS, 3);
  assert.equal(OBSERVED_MINUTES, 75);
  assert.equal(PLATFORM, "Windows 11");
  assert.equal(INTERFACE, "Claude Desktop");
  assert.equal(REPORTER, "lululin221010");
  assert.equal(IDLE_WORD, "arrested");
  assert.equal(SEEDED_WORD, "skipped");
  assert.notEqual(IDLE_WORD, "skipped");
  assert.notEqual(IDLE_WORD, "jumped");
  assert.notEqual(IDLE_WORD, "chocked");
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
  assert.notEqual(IDLE_WORD, "indexed");
  assert.deepEqual([...HOLD_VERDICTS], ["arrested", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("skipped"));
  assert.ok(ALARM_VERDICTS.includes("isrunning-stuck"));
  assert.ok(ALARM_VERDICTS.includes("lastrunat-lies"));
  assert.ok(!ALARM_VERDICTS.includes("arrested"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 10);
  assert.deepEqual(
    [...LABELS],
    ["bug", "platform:windows", "area:routines"],
  );
  assert.match(TITLE, /Local scheduled tasks/);
  assert.match(TITLE, /silently hang mid-run/);
  assert.match(ISSUE_URL, /91371/);
  assert.match(PHRASE, /arrests mid-beat/i);
  assert.match(PHRASE, /admit arrested/);
  assert.match(HUB_LINE, /12:50 escapement/);
  assert.match(HUB_LINE, /admit arrested/);
  assert.match(MARK, /12:50/);
  assert.match(MARK, /#113/);
  assert.match(MARK, /#91371/);
  assert.match(CONTRAST_NOTE, /isRunning/);
  assert.match(CONTRAST_NOTE, /Skipped/);
  assert.match(CONTRAST_NOTE, /lastRunAt/);
  assert.match(CONTRAST_NOTE, /PushNotification RULED OUT/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("geneva"));
  assert.ok(NOT_PRODUCTS.includes("scotch"));
  assert.ok(NOT_PRODUCTS.includes("fibula"));
  assert.ok(NOT_PRODUCTS.includes("limpet"));
  assert.ok(NOT_PRODUCTS.includes("geneva-drive"));
  assert.ok(NOT_PRODUCTS.includes("maltese-cross"));
  assert.ok(BANNED_NAMES.includes("Geneva"));
  assert.ok(BANNED_NAMES.includes("Scotch"));
  assert.ok(BANNED_NAMES.includes("Limpet"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "arrested");
  assert.equal(chips.seededWord, "skipped");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91371);
  assert.equal(fp.cousin, 89275);
  assert.deepEqual(fp.cousins, [89275, 91095, 89811, 89135, 88825, 90157, 89936]);
  assert.equal(fp.createTool, "mcp__scheduled-tasks__create_scheduled_task");
  assert.equal(fp.cronExpression, "30 8 * * *");
  assert.equal(fp.scheduledTasksPath, "~/.claude/scheduled-tasks/");
  assert.equal(fp.platform, "Windows 11");
  assert.equal(fp.reporter, "lululin221010");
  assert.equal(fp.isRunning, "isRunning");
  assert.equal(fp.skippedMark, "Skipped");
  assert.equal(fp.lastRunAt, "lastRunAt");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "skipped");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.lastRunAtLies, true);
});

test("chipsOf on a raw mid-run stall ticket still marks skipped", () => {
  const chips = chipsOf({
    isRunning: true,
    nextFireSkipped: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    stalledMidRun: true,
    outputText:
      "skipped; #91371; isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies",
  });
  assert.ok(chips.includes("skipped"));
  assert.ok(chips.includes("isrunning-stuck"));
  assert.ok(chips.includes("mid-run-stall"));
  assert.ok(chips.includes("lastrunat-lies"));
  assert.ok(!chips.includes("arrested"));
});

test("cousin #89275 is not conflated with skipped primary", () => {
  assert.notEqual(classify(seedCousin()), "skipped");
  assert.notEqual(classify({ issue: 89275 }), "skipped");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /89275|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become skipped", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "skipped", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91371);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedIsrunningStuck()).verdict, "isrunning-stuck");
  assert.equal(analyze(seedMidRunStall()).verdict, "mid-run-stall");
  assert.equal(analyze(seedLastrunatLies()).verdict, "lastrunat-lies");
  assert.equal(analyze(seedCloudOkLocalBad()).verdict, "cloud-ok-local-bad");
  assert.equal(analyze(seedPushnotificationRuledOut()).verdict, "pushnotification-ruled-out");
  assert.equal(analyze(seedRunNowRepro()).verdict, "run-now-repro");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.completedOrFailedLoudly, true);
  assert.equal(isSkipped(seedArrested()), false);
  assert.equal(isSkipped(seedSkipped()), true);
});

test("living page is an Escapement atelier, idle arrested, seeded skipped", () => {
  const html = readPage();
  assert.match(html, /<title>Escapement/);
  assert.match(html, /Idle word:\s*arrested/);
  assert.match(html, /arrested/);
  assert.match(html, /skipped/);
  assert.match(html, /isrunning-stuck/);
  assert.match(html, /mid-run-stall/);
  assert.match(html, /lastrunat-lies/);
  assert.match(html, /cloud-ok-local-bad/);
  assert.match(html, /pushnotification-ruled-out/);
  assert.match(html, /run-now-repro/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91371/);
  assert.match(html, /#89275/);
  assert.match(html, /#91095/);
  assert.match(html, /#89811/);
  assert.match(html, /#89135/);
  assert.match(html, /#88825/);
  assert.match(html, /#90157/);
  assert.match(html, /#89936/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /12:50/);
  assert.match(html, /catalog #113/);
  assert.match(html, /isRunning/);
  assert.match(html, /Skipped/);
  assert.match(html, /lastRunAt/);
  assert.match(html, /PushNotification/);
  assert.match(html, /4 tool calls/);
  assert.match(html, /2 Reads/);
  assert.match(html, /1 Glob/);
  assert.match(html, /Run now/);
  assert.match(html, /30 8 \* \* \*/);
  assert.match(html, /mcp__scheduled-tasks__create_scheduled_task/);
  assert.match(html, /~\/\.claude\/scheduled-tasks\//);
  assert.match(html, /cloud-ok-local-bad|cloud routine/i);
  assert.match(html, /lululin221010/);
  assert.match(html, /Windows 11/);
  assert.match(html, /75\+/);
  assert.match(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.match(html, /family=Manrope|Manrope/);
  assert.match(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.match(html, /Score the pallet/);
  assert.match(html, /Pin idle arrested/);
  assert.match(html, /Pin seeded skipped/);
  assert.match(html, /Admit arrested/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to arrested/);
  assert.match(html, /escape wheel|pallet fork|balance spring|chapter-ring|oil stone|arbor|clockmaker/i);
  assert.match(html, /LOCAL SCHEDULED TASKS|isRunning: true FOREVER|RULED OUT/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*skipped/i);
  assert.doesNotMatch(html, /Idle word:\s*jumped/i);
  assert.doesNotMatch(html, /Idle word:\s*chocked/i);
  assert.doesNotMatch(html, /Idle word:\s*indexed/i);
  assert.doesNotMatch(html, /Pin idle skipped/);
  assert.doesNotMatch(html, /Pin idle jumped/);
  assert.doesNotMatch(html, /Pin idle indexed/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
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

test("README and page stay Escapement, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Escapement/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /LOCAL SCHEDULED TASKS STALL MID-RUN WITH `isRunning: true` FOREVER|isRunning: true FOREVER SO THE NEXT CRON FIRE IS MARKED "Skipped"/i,
  );
  assert.match(readme, /NOT \*\*Limpet\*\*/);
  assert.match(readme, /NOT \*\*Geneva\*\*/);
  assert.match(readme, /NOT \*\*Scotch\*\*/);
  assert.match(readme, /NOT \*\*Fibula\*\*/);
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /Product name stays \*\*Escapement\*\*/);
  assert.match(readme, /Idle word: \*\*arrested\*\*/);
  assert.match(readme, /#89275/);
  assert.match(readme, /#91095/);
  assert.match(readme, /isRunning/);
  assert.match(readme, /Skipped/);
  assert.match(readme, /lastRunAt/);
  assert.match(readme, /PushNotification/);
  assert.match(readme, /30 8 \* \* \*/);
  assert.match(readme, /mcp__scheduled-tasks__create_scheduled_task/);
  assert.match(readme, /~\/\.claude\/scheduled-tasks\//);
  assert.match(readme, /lululin221010/);
  assert.match(readme, /Windows 11/);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
