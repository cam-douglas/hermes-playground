#!/usr/bin/env node
/**
 * Escapement — clockmaker escapement / pallet-fork atelier classifier.
 * An escapement that arrests mid-beat is not a hold.
 * Score the pallet or admit arrested.
 *
 *   echo '{"isRunning":true,"nextFireSkipped":true,"lastRunAtUpdated":true}' | node escapement.mjs
 *   node escapement.mjs ticket.json
 *
 * Idle word is arrested (HOLD: scheduled run completes or fails loudly;
 * isRunning clears; next cron fire is allowed).
 * Seeded state is skipped / #91371 (isRunning stuck true after mid-run
 * stall; next fire Skipped; lastRunAt lies).
 * NEVER idle as jumped, chocked, rolled, clasped, sprung, drained,
 * hinged, pealed, warded, pooled, cased, aired, sifted, stocked,
 * stationed, marvered, unpinned, rinsed, literal, choked, indexed.
 *
 * Primary #91371: Local scheduled tasks (Routines sidebar /
 * mcp__scheduled-tasks__create_scheduled_task) stall mid-run with no
 * error, timeout, or notification. Stalled session stays
 * isRunning: true indefinitely (observed 75+ minutes;
 * lastActivityAt unchanged). Next cron fire marked "Skipped" because
 * prior run still Running. Reproduced 4 times across 3 task
 * definitions; both automatic cron and manual "Run now". Stall after
 * exactly 4 tool calls in several runs; also after 2 Reads; also
 * after 1 Glob. Removing PushNotification (replaced with Write) still
 * stalled; 4th call became mcp__scheduled-tasks__list_scheduled_tasks.
 * Pre-existing ~6-week-reliable task social-metrics-auto-log also
 * stalled. lastRunAt in list_scheduled_tasks updates even for
 * incomplete runs — cannot verify success from that field alone.
 * Cloud routine on hourly cron in the same session completed
 * successfully multiple times. Env: Windows 11, Claude Desktop,
 * local tasks under ~/.claude/scheduled-tasks/, example cron
 * 30 8 * * *. Expected: complete or fail visibly — not hang forever
 * and silently block future fires.
 *
 * Hypothesis only (NON-BINDING): local scheduled-task runner fails to
 * clear isRunning after a silent mid-session stall, so the scheduler
 * Skips the next fire; lastRunAt is stamped on start not completion.
 * Do not claim a root cause in Claude Code source you have not seen.
 * Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the pallet is arrested or skipped.
 *
 * NOT Limpet #89275 (post-success process never exits / RSS leak —
 * cite-only; here the run never completes).
 * NOT #91095 / #89811 (SUCCEEDED / zero-work with no mid-run hang —
 * cite-only).
 * NOT #89135 / #88825 / #83709 / #90157 (cloud RemoteTrigger stalls —
 * cite-only; reporter's cloud worked).
 * NOT #89936 (lastRunAt never updates — cite-only; here lastRunAt
 * lies by updating).
 * NOT Scotch #91324 (SCM recovery Access denied).
 * NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab).
 * NOT Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 /
 * Pintle #91226 / Carillon / Postern #91223 / Sluice #91265.
 * NOT Catchword #91362 / Spigot #91165 (Geneva backups — do not
 * auto-pick).
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick / geneva-drive / maltese-cross.
 * Product name stays Escapement. Do not rename to Scheduler / Cron /
 * Routines / Tasks / Geneva / Scotch / Fibula / Virgule / Riddle /
 * Garner / Pintle / Postern / Limpet.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "arrested",
  "skipped",
  "isrunning-stuck",
  "mid-run-stall",
  "lastrunat-lies",
  "cloud-ok-local-bad",
  "pushnotification-ruled-out",
  "run-now-repro",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "arrested";
export const SEEDED_WORD = "skipped";
export const HOLD_VERDICTS = Object.freeze(["arrested", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91371;
export const PRIMARY_ISSUES = Object.freeze([91371]);
export const COUSINS = Object.freeze([
  89275, 91095, 89811, 89135, 88825, 90157, 89936,
]);
export const COUSIN_ISSUE = 89275;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
  "geneva",
  "scotch",
  "fibula",
  "virgule",
  "riddle",
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "cockade",
  "lye",
  "limpet",
  "catchword",
  "spigot",
  "knell",
  "sheaf",
  "woodworking",
  "mm-slider",
  "millrace",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "geneva-drive",
  "maltese-cross",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91371";
export const TITLE =
  "[BUG] Local scheduled tasks silently hang mid-run and block later scheduled fires";
export const FILED_AT = "2026-09-02T02:39:41Z";
export const LABELS = Object.freeze([
  "bug",
  "platform:windows",
  "area:routines",
]);
export const REPORTER = "lululin221010";
export const CREATE_TOOL = "mcp__scheduled-tasks__create_scheduled_task";
export const LIST_TOOL = "mcp__scheduled-tasks__list_scheduled_tasks";
export const SCHEDULED_TASKS_PATH = "~/.claude/scheduled-tasks/";
export const CRON_EXPRESSION = "30 8 * * *";
export const IS_RUNNING = "isRunning";
export const SKIPPED_MARK = "Skipped";
export const LAST_RUN_AT = "lastRunAt";
export const LAST_ACTIVITY_AT = "lastActivityAt";
export const PUSH_NOTIFICATION = "PushNotification";
export const RUN_NOW = "Run now";
export const SOCIAL_METRICS = "social-metrics-auto-log";
export const STALL_TOOL_CALLS = 4;
export const STALL_READS = 2;
export const STALL_GLOB = 1;
export const STALL_COUNT = 4;
export const TASK_DEFINITIONS = 3;
export const OBSERVED_MINUTES = 75;
export const PLATFORM = "Windows 11";
export const INTERFACE = "Claude Desktop";
export const HUB_LINE =
  "12:50 escapement: an escapement that arrests mid-beat is not a hold. Score the pallet or admit arrested.";
export const MARK = "12:50 / hermes catalog #113 / #91371";
export const PHRASE =
  "an escapement that arrests mid-beat is not a hold. Score the pallet or admit arrested.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: local scheduled-task runner fails to clear isRunning after a silent mid-session stall, so the scheduler Skips the next fire; lastRunAt is stamped on start not completion. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is LOCAL SCHEDULED TASKS STALL MID-RUN WITH isRunning: true FOREVER SO THE NEXT CRON FIRE IS MARKED \"Skipped\"; lastRunAt UPDATES EVEN FOR INCOMPLETE RUNS; CLOUD ROUTINES WORKED THE SAME MORNING; PushNotification RULED OUT. Local scheduled tasks (Routines sidebar / mcp__scheduled-tasks__create_scheduled_task) stall mid-run with no error, timeout, or notification. Stalled session stays isRunning: true indefinitely (observed 75+ minutes; lastActivityAt unchanged). Next cron fire marked \"Skipped\" because prior run still Running. Reproduced 4 times across 3 task definitions; both automatic cron and manual \"Run now\". Stall after exactly 4 tool calls in several runs; also after 2 Reads; also after 1 Glob. Removing PushNotification (replaced with Write) still stalled; 4th call became mcp__scheduled-tasks__list_scheduled_tasks. Pre-existing ~6-week-reliable task social-metrics-auto-log also stalled. lastRunAt in list_scheduled_tasks updates even for incomplete runs. Cloud routine on hourly cron in the same session completed successfully multiple times. Env: Windows 11, Claude Desktop, local tasks under ~/.claude/scheduled-tasks/, example cron 30 8 * * *. Expected: complete or fail visibly — not hang forever and silently block future fires. NOT Limpet #89275 (post-success process never exits / RSS leak — cite-only; here the run never completes). NOT #91095 / #89811 (SUCCEEDED / zero-work with no mid-run hang — cite-only). NOT #89135 / #88825 / #83709 / #90157 (cloud RemoteTrigger stalls — cite-only; reporter's cloud worked). NOT #89936 (lastRunAt never updates — cite-only; here lastRunAt lies by updating). NOT Scotch #91324 (SCM recovery Access denied). NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab). NOT Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 / Pintle #91226 / Carillon / Postern #91223 / Sluice #91265. NOT Catchword #91362 / Spigot #91165. NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross. Product name stays Escapement.";
export const FORBIDDEN_IDLE = Object.freeze([
  "jumped",
  "chocked",
  "rolled",
  "clasped",
  "sprung",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "pooled",
  "cased",
  "aired",
  "sifted",
  "stocked",
  "stationed",
  "marvered",
  "unpinned",
  "rinsed",
  "literal",
  "choked",
  "indexed",
]);
export const BANNED_NAMES = Object.freeze([
  "Scheduler",
  "Cron",
  "Routines",
  "Tasks",
  "Geneva",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Postern",
  "Limpet",
]);
export const FORBIDDEN_UI = Object.freeze([
  "geneva-drive",
  "maltese-cross",
  "scotch-block",
  "limpet clamp",
  "postern door",
  "pintle hinge",
  "timber scotch",
  "wagon wheel",
  "iron rail",
  "switchman's hut",
  "bow fibula",
  "catch-plate",
  "cloak fold",
  "composing stick",
  "type-case",
  "lead sorts",
  "vermilion virgule",
  "wire mesh",
  "ore grit",
  "grain loft",
  "airing hatch",
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "postern-gate",
  "night bailey",
  "plane-table",
  "rudder pintle",
  "gudgeon",
  "woodworking",
  "mm-slider",
  "wagon-scotch",
  "cloak-pin",
  "jeweler's loupe",
  "steel driving pin",
]);

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    isRunning: null,
    lastActivityAtUnchanged: null,
    lastRunAtUpdated: null,
    lastRunAtLies: null,
    nextFireSkipped: null,
    stalledMidRun: null,
    stallToolCount: null,
    stallAfterReads: null,
    stallAfterGlob: null,
    pushNotificationRuledOut: null,
    runNowReproduced: null,
    cronFire: null,
    cronExpression: "",
    cloudRoutineOk: null,
    localTaskStalled: null,
    scheduledTasksPath: "",
    createTool: "",
    listTool: "",
    platform: "",
    interface: "",
    reporter: "",
    observedMinutes: null,
    socialMetricsAlsoStalled: null,
    hasClearRepro: null,
    completedOrFailedLoudly: null,
    isRunningCleared: null,
    nextFireAllowed: null,
    noErrorTimeoutNotification: null,
    taskCount: null,
    stallCount: null,
    cousin: "",
    outputText: "",
  };
}

export function seedArrested() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    isRunning: false,
    lastActivityAtUnchanged: false,
    lastRunAtUpdated: true,
    lastRunAtLies: false,
    nextFireSkipped: false,
    stalledMidRun: false,
    stallToolCount: 0,
    stallAfterReads: false,
    stallAfterGlob: false,
    pushNotificationRuledOut: false,
    runNowReproduced: false,
    cronFire: true,
    cronExpression: CRON_EXPRESSION,
    cloudRoutineOk: true,
    localTaskStalled: false,
    scheduledTasksPath: SCHEDULED_TASKS_PATH,
    createTool: CREATE_TOOL,
    listTool: LIST_TOOL,
    platform: PLATFORM,
    interface: INTERFACE,
    reporter: "",
    observedMinutes: null,
    socialMetricsAlsoStalled: false,
    hasClearRepro: false,
    completedOrFailedLoudly: true,
    isRunningCleared: true,
    nextFireAllowed: true,
    noErrorTimeoutNotification: false,
    taskCount: 0,
    stallCount: 0,
    cousin: "",
    outputText:
      "arrested; scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed; idle word arrested",
  };
}

export function seedSkipped() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    isRunning: true,
    lastActivityAtUnchanged: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    stalledMidRun: true,
    stallToolCount: STALL_TOOL_CALLS,
    stallAfterReads: true,
    stallAfterGlob: true,
    pushNotificationRuledOut: true,
    runNowReproduced: true,
    cronFire: true,
    cronExpression: CRON_EXPRESSION,
    cloudRoutineOk: true,
    localTaskStalled: true,
    scheduledTasksPath: SCHEDULED_TASKS_PATH,
    createTool: CREATE_TOOL,
    listTool: LIST_TOOL,
    platform: PLATFORM,
    interface: INTERFACE,
    observedMinutes: OBSERVED_MINUTES,
    socialMetricsAlsoStalled: true,
    hasClearRepro: true,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    noErrorTimeoutNotification: true,
    taskCount: TASK_DEFINITIONS,
    stallCount: STALL_COUNT,
    cousin: "",
    outputText:
      "skipped; #91371; isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies; 4 tool calls / 2 Reads / 1 Glob; Run now; cron 30 8 * * *; PushNotification ruled out",
  };
}

export function seedIsrunningStuck() {
  return {
    seed: "isrunning-stuck",
    source: "atelier",
    isRunning: true,
    lastActivityAtUnchanged: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    stalledMidRun: true,
    observedMinutes: OBSERVED_MINUTES,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    noErrorTimeoutNotification: true,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "isrunning-stuck; stalled session stays isRunning: true indefinitely (observed 75+ minutes; lastActivityAt unchanged)",
  };
}

export function seedMidRunStall() {
  return {
    seed: "mid-run-stall",
    source: "atelier",
    isRunning: true,
    stalledMidRun: true,
    stallToolCount: STALL_TOOL_CALLS,
    stallAfterReads: true,
    stallAfterGlob: true,
    lastActivityAtUnchanged: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    noErrorTimeoutNotification: true,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "mid-run-stall; stall mid-run with no error, timeout, or notification; stall after 4 tool calls / 2 Reads / 1 Glob",
  };
}

export function seedLastrunatLies() {
  return {
    seed: "lastrunat-lies",
    source: "atelier",
    isRunning: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    stalledMidRun: true,
    nextFireSkipped: true,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "lastrunat-lies; lastRunAt in list_scheduled_tasks updates even for incomplete runs — cannot verify success from that field alone",
  };
}

export function seedCloudOkLocalBad() {
  return {
    seed: "cloud-ok-local-bad",
    source: "atelier",
    isRunning: true,
    stalledMidRun: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    cloudRoutineOk: true,
    localTaskStalled: true,
    scheduledTasksPath: SCHEDULED_TASKS_PATH,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    platform: PLATFORM,
    interface: INTERFACE,
    hasClearRepro: true,
    outputText:
      "cloud-ok-local-bad; cloud routine on hourly cron completed successfully; local tasks under ~/.claude/scheduled-tasks/ stalled",
  };
}

export function seedPushnotificationRuledOut() {
  return {
    seed: "pushnotification-ruled-out",
    source: "atelier",
    isRunning: true,
    stalledMidRun: true,
    stallToolCount: STALL_TOOL_CALLS,
    pushNotificationRuledOut: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "pushnotification-ruled-out; removing PushNotification (replaced with Write) still stalled; 4th call became mcp__scheduled-tasks__list_scheduled_tasks",
  };
}

export function seedRunNowRepro() {
  return {
    seed: "run-now-repro",
    source: "atelier",
    isRunning: true,
    stalledMidRun: true,
    runNowReproduced: true,
    cronFire: true,
    cronExpression: CRON_EXPRESSION,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    stallCount: STALL_COUNT,
    taskCount: TASK_DEFINITIONS,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "run-now-repro; reproduced 4 times across 3 task definitions; both automatic cron and manual Run now",
  };
}

export function seedHasClearRepro() {
  return {
    seed: "has-clear-repro",
    source: "atelier",
    isRunning: true,
    stalledMidRun: true,
    lastRunAtUpdated: true,
    lastRunAtLies: true,
    nextFireSkipped: true,
    hasClearRepro: true,
    reporter: REPORTER,
    platform: PLATFORM,
    interface: INTERFACE,
    cronExpression: CRON_EXPRESSION,
    createTool: CREATE_TOOL,
    scheduledTasksPath: SCHEDULED_TASKS_PATH,
    stallCount: STALL_COUNT,
    taskCount: TASK_DEFINITIONS,
    completedOrFailedLoudly: false,
    isRunningCleared: false,
    nextFireAllowed: false,
    outputText:
      "has-clear-repro; lululin221010 filed #91371; 4 times across 3 task definitions; cron 30 8 * * *; mcp__scheduled-tasks__create_scheduled_task; ~/.claude/scheduled-tasks/; Windows 11; Claude Desktop",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    isRunning: false,
    lastRunAtUpdated: true,
    lastRunAtLies: false,
    nextFireSkipped: false,
    stalledMidRun: false,
    cronExpression: CRON_EXPRESSION,
    scheduledTasksPath: SCHEDULED_TASKS_PATH,
    createTool: CREATE_TOOL,
    platform: PLATFORM,
    interface: INTERFACE,
    completedOrFailedLoudly: true,
    isRunningCleared: true,
    nextFireAllowed: true,
    hasClearRepro: false,
    outputText:
      "hold; scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed; the pallet is arrested",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "89275",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #89275 post-success process never exits / RSS leak — cite; not the #91371 local scheduled-task mid-run stall",
  };
}

export function emptyTicket() {
  return seedArrested();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.escapement && typeof src.escapement === "object" && src.escapement) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.pallet && typeof src.pallet === "object" && src.pallet) ||
    (src.fork && typeof src.fork === "object" && src.fork) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    source: firstText(nested.source, src.source),
    isRunning: firstBool(nested.isRunning, nested.is_running, src.isRunning),
    lastActivityAtUnchanged: firstBool(
      nested.lastActivityAtUnchanged,
      nested.last_activity_at_unchanged,
      src.lastActivityAtUnchanged,
    ),
    lastRunAtUpdated: firstBool(
      nested.lastRunAtUpdated,
      nested.last_run_at_updated,
      src.lastRunAtUpdated,
    ),
    lastRunAtLies: firstBool(
      nested.lastRunAtLies,
      nested.last_run_at_lies,
      src.lastRunAtLies,
    ),
    nextFireSkipped: firstBool(
      nested.nextFireSkipped,
      nested.next_fire_skipped,
      src.nextFireSkipped,
    ),
    stalledMidRun: firstBool(
      nested.stalledMidRun,
      nested.stalled_mid_run,
      src.stalledMidRun,
    ),
    stallToolCount: firstNum(
      nested.stallToolCount,
      nested.stall_tool_count,
      src.stallToolCount,
    ),
    stallAfterReads: firstBool(
      nested.stallAfterReads,
      nested.stall_after_reads,
      src.stallAfterReads,
    ),
    stallAfterGlob: firstBool(
      nested.stallAfterGlob,
      nested.stall_after_glob,
      src.stallAfterGlob,
    ),
    pushNotificationRuledOut: firstBool(
      nested.pushNotificationRuledOut,
      nested.push_notification_ruled_out,
      src.pushNotificationRuledOut,
    ),
    runNowReproduced: firstBool(
      nested.runNowReproduced,
      nested.run_now_reproduced,
      src.runNowReproduced,
    ),
    cronFire: firstBool(nested.cronFire, nested.cron_fire, src.cronFire),
    cronExpression: firstText(
      nested.cronExpression,
      nested.cron_expression,
      src.cronExpression,
    ),
    cloudRoutineOk: firstBool(
      nested.cloudRoutineOk,
      nested.cloud_routine_ok,
      src.cloudRoutineOk,
    ),
    localTaskStalled: firstBool(
      nested.localTaskStalled,
      nested.local_task_stalled,
      src.localTaskStalled,
    ),
    scheduledTasksPath: firstText(
      nested.scheduledTasksPath,
      nested.scheduled_tasks_path,
      src.scheduledTasksPath,
    ),
    createTool: firstText(nested.createTool, nested.create_tool, src.createTool),
    listTool: firstText(nested.listTool, nested.list_tool, src.listTool),
    platform: firstText(nested.platform, src.platform),
    interface: firstText(nested.interface, src.interface),
    observedMinutes: firstNum(
      nested.observedMinutes,
      nested.observed_minutes,
      src.observedMinutes,
    ),
    socialMetricsAlsoStalled: firstBool(
      nested.socialMetricsAlsoStalled,
      nested.social_metrics_also_stalled,
      src.socialMetricsAlsoStalled,
    ),
    hasClearRepro: firstBool(
      nested.hasClearRepro,
      nested.has_clear_repro,
      src.hasClearRepro,
    ),
    completedOrFailedLoudly: firstBool(
      nested.completedOrFailedLoudly,
      nested.completed_or_failed_loudly,
      src.completedOrFailedLoudly,
    ),
    isRunningCleared: firstBool(
      nested.isRunningCleared,
      nested.is_running_cleared,
      src.isRunningCleared,
    ),
    nextFireAllowed: firstBool(
      nested.nextFireAllowed,
      nested.next_fire_allowed,
      src.nextFireAllowed,
    ),
    noErrorTimeoutNotification: firstBool(
      nested.noErrorTimeoutNotification,
      nested.no_error_timeout_notification,
      src.noErrorTimeoutNotification,
    ),
    taskCount: firstNum(nested.taskCount, nested.task_count, src.taskCount),
    stallCount: firstNum(nested.stallCount, nested.stall_count, src.stallCount),
    cousin: firstText(nested.cousin, src.cousin),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (Array.isArray(value)) {
      if (value.length) out[key] = value;
      continue;
    }
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.isRunning == null &&
    row.nextFireSkipped == null &&
    row.stalledMidRun == null &&
    row.lastRunAtUpdated == null &&
    row.lastRunAtLies == null &&
    row.completedOrFailedLoudly == null &&
    row.isRunningCleared == null &&
    row.nextFireAllowed == null &&
    row.cloudRoutineOk == null &&
    row.pushNotificationRuledOut == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedArrested,
  [SEEDED_WORD]: seedSkipped,
  "isrunning-stuck": seedIsrunningStuck,
  "mid-run-stall": seedMidRunStall,
  "lastrunat-lies": seedLastrunatLies,
  "cloud-ok-local-bad": seedCloudOkLocalBad,
  "pushnotification-ruled-out": seedPushnotificationRuledOut,
  "run-now-repro": seedRunNowRepro,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  89275: seedCousin,
};

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedSkipped(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.cousin,
    ticket.seed,
    ticket.createTool,
    ticket.cronExpression,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isArrested(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.completedOrFailedLoudly === true &&
    row.isRunningCleared === true &&
    row.nextFireAllowed === true
  ) {
    return true;
  }
  return false;
}

export function isSkipped(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.isRunning === true &&
    (row.nextFireSkipped === true ||
      row.lastRunAtLies === true ||
      (row.lastRunAtUpdated === true && row.stalledMidRun === true))
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#89275|#91095|#89811|#89135|#88825|#90157|#89936|#83709/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const skippedNow = !cousinOnly && isSkipped(row);
  const arrestedNow = !skippedNow && isArrested(row);
  const isrunningStuck =
    row.isRunning === true ||
    named === "isrunning-stuck" ||
    /isrunning-stuck|isRunning:\s*true|isRunning stuck|75\+/i.test(text);
  const midRunStall =
    row.stalledMidRun === true ||
    named === "mid-run-stall" ||
    /mid-run-stall|mid-run|4 tool calls|2 Reads|1 Glob/i.test(text);
  const lastRunAtLies =
    row.lastRunAtLies === true ||
    (row.lastRunAtUpdated === true &&
      (row.isRunning === true || row.stalledMidRun === true)) ||
    named === "lastrunat-lies" ||
    /lastrunat-lies|lastRunAt lies|lastRunAt updates even/i.test(text);
  const cloudOkLocalBad =
    (row.cloudRoutineOk === true && row.localTaskStalled === true) ||
    named === "cloud-ok-local-bad" ||
    /cloud-ok-local-bad|cloud routine|local tasks under/i.test(text);
  const pushNotificationRuledOut =
    row.pushNotificationRuledOut === true ||
    named === "pushnotification-ruled-out" ||
    /pushnotification-ruled-out|PushNotification|ruled out/i.test(text);
  const runNowRepro =
    row.runNowReproduced === true ||
    named === "run-now-repro" ||
    /run-now-repro|Run now/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|lululin221010|4 times across 3/i.test(text);
  const skipped =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (skippedNow || named === SEEDED_WORD || /skipped|#91371/i.test(text));
  const arrested =
    named === IDLE_WORD ||
    named === "hold" ||
    (arrestedNow && !skipped);
  return {
    named,
    cousinOnly,
    skippedNow,
    arrestedNow,
    isrunningStuck,
    midRunStall,
    lastRunAtLies,
    cloudOkLocalBad,
    pushNotificationRuledOut,
    runNowRepro,
    hasClearRepro,
    skipped,
    arrested,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.arrested && !flags.skipped) chips.push("arrested");
  if (flags.skipped) chips.push("skipped");
  if (flags.isrunningStuck && flags.skipped) chips.push("isrunning-stuck");
  if (flags.midRunStall && flags.skipped) chips.push("mid-run-stall");
  if (flags.lastRunAtLies && flags.skipped) chips.push("lastrunat-lies");
  if (flags.cloudOkLocalBad && flags.skipped) chips.push("cloud-ok-local-bad");
  if (flags.pushNotificationRuledOut && flags.skipped) {
    chips.push("pushnotification-ruled-out");
  }
  if (flags.runNowRepro && flags.skipped) chips.push("run-now-repro");
  if (flags.hasClearRepro && flags.skipped) chips.push("has-clear-repro");
  if ((flags.arrested || flags.named === "hold") && !flags.skipped) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "arrested") {
    reasons.push(
      "arrested; scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed",
    );
    reasons.push(
      "hold: the pallet is arrested; score treats a completed or loudly failed scheduled run",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed; the pallet is arrested",
    );
  }
  if (verdict === "skipped" || flags.skipped) {
    reasons.push(
      "skipped; #91371; isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies",
    );
  }
  if (flags.isrunningStuck || verdict === "isrunning-stuck") {
    reasons.push(
      `isrunning-stuck; stalled session stays ${IS_RUNNING}: true indefinitely (observed ${OBSERVED_MINUTES}+ minutes; ${LAST_ACTIVITY_AT} unchanged)`,
    );
  }
  if (flags.midRunStall || verdict === "mid-run-stall") {
    reasons.push(
      `mid-run-stall; stall mid-run with no error, timeout, or notification; stall after ${STALL_TOOL_CALLS} tool calls / ${STALL_READS} Reads / ${STALL_GLOB} Glob`,
    );
  }
  if (flags.lastRunAtLies || verdict === "lastrunat-lies") {
    reasons.push(
      `lastrunat-lies; ${LAST_RUN_AT} in list_scheduled_tasks updates even for incomplete runs — cannot verify success from that field alone`,
    );
  }
  if (flags.cloudOkLocalBad || verdict === "cloud-ok-local-bad") {
    reasons.push(
      `cloud-ok-local-bad; cloud routine on hourly cron completed successfully; local tasks under ${SCHEDULED_TASKS_PATH} stalled`,
    );
  }
  if (flags.pushNotificationRuledOut || verdict === "pushnotification-ruled-out") {
    reasons.push(
      `pushnotification-ruled-out; removing ${PUSH_NOTIFICATION} (replaced with Write) still stalled; 4th call became ${LIST_TOOL}`,
    );
  }
  if (flags.runNowRepro || verdict === "run-now-repro") {
    reasons.push(
      `run-now-repro; reproduced ${STALL_COUNT} times across ${TASK_DEFINITIONS} task definitions; both automatic cron and manual "${RUN_NOW}"`,
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; cron ${CRON_EXPRESSION}; ${CREATE_TOOL}; ${SCHEDULED_TASKS_PATH}; ${PLATFORM}; ${INTERFACE}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Escapement; cite-only Limpet / SUCCEEDED / RemoteTrigger / lastRunAt-never cousins, not the local scheduled-task mid-run stall",
    );
  }
  if (verdict === "skipped" || flags.skipped) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "arrested" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.arrested || !flags.skipped)) return "arrested";
  if (named === "hold" && !flags.skipped) return "hold";
  if (named === SEEDED_WORD) return "skipped";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "arrested";
  if (flags.skipped) return "skipped";
  if (flags.arrested) return "arrested";
  return "arrested";
}

function palletOf(flags, ticket, verdict) {
  if (verdict === "skipped" || flags.skipped) {
    return {
      case: "skipped — pallet arrests mid-beat; next fire Skipped",
      pallet: "pallet fork arrests mid-beat; escape wheel will not release the next tooth",
      fork: `${IS_RUNNING}: true · ${SKIPPED_MARK} · ${LAST_RUN_AT} lies`,
      wheel: "wheel stuck; lastRunAt stamped anyway",
      mark: "brass pallet aside; the fire was skipped",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "arrested — scheduled run completes or fails loudly",
      pallet: "pallet fork releases one tooth per scheduled-task beat",
      fork: "isRunning clears · next cron fire allowed",
      wheel: "wheel held; atelier quiet",
      mark: "brass pallet on the arbor; the pallet is arrested",
      note: "Hold: the pallet is arrested.",
    };
  }
  return {
    case: "arrested — one tooth per beat; isRunning clears",
    pallet: "pallet fork on the landing tooth; no mid-beat arrest",
    fork: "complete or fail loudly · next fire allowed",
    wheel: "wheel arrested on the jewel",
    mark: "brass pallet on the arbor; idle word arrested",
    note: "Arrested: the pallet holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const skipped = verdict === "skipped" || flags.skipped;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    arrested: verdict === "arrested" || (flags.arrested && !skipped),
    skipped,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: palletOf(flags, ticket, verdict),
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 91371 || name === "91371") {
    return analyze(seedSkipped());
  }
  if (name === "isrunning-stuck") return analyze(seedIsrunningStuck());
  if (name === "mid-run-stall") return analyze(seedMidRunStall());
  if (name === "lastrunat-lies") return analyze(seedLastrunatLies());
  if (name === "cloud-ok-local-bad") return analyze(seedCloudOkLocalBad());
  if (name === "pushnotification-ruled-out") {
    return analyze(seedPushnotificationRuledOut());
  }
  if (name === "run-now-repro") return analyze(seedRunNowRepro());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "arrested" || name === "open") {
    return analyze(seedArrested());
  }
  if (name === 89275 || name === "89275" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedArrested());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "skipped" || (result.skipped && result.alarm)
          ? `skipped escapement #${FEATURED_ISSUE}: ${IS_RUNNING} stuck true after mid-run stall; next fire ${SKIPPED_MARK}; ${LAST_RUN_AT} lies. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Scheduled run completes or fails loudly. Score the pallet."
            : `arrested escapement. Idle word ${IDLE_WORD}. Scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
