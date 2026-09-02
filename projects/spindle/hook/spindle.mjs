#!/usr/bin/env node
/**
 * Spindle — machine-shop spindle / shared-ways chip-sweep atelier classifier.
 * A spindle that sweeps a live sibling is not a hold.
 * Score the purge or admit swept.
 *
 *   echo '{"startupCleanup":true,"siblingLive":true}' | node spindle.mjs
 *   node spindle.mjs ticket.json
 *
 * Idle word is fenced (HOLD: cleanup never touches alive sibling dirs;
 * liveness is process/lock; process-gone or lock-stale required
 * before delete).
 * Seeded state is swept / #91402 (new-session startup cleanup deletes
 * live sibling Bash background-task captures under the shared project
 * temp root; liveness judged by output-file mtime; silent mid-execution
 * loss).
 * NEVER idle as tolled / mute / honored / discarded / arrested /
 * skipped / indexed / jumped / chocked / rolled / clasped / sprung /
 * drained / hinged / pealed / warded / pooled / cased / aired /
 * sifted / stocked / stationed.
 *
 * Primary #91402: In multi-session use on one machine (several
 * interactive Claude Code sessions plus background subagents sharing
 * one project temp root under %LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\),
 * a new session's startup cleanup deletes the Bash background-task
 * output captures (tasks/<task-id>.output) of sibling sessions that
 * are still running. Liveness appears to be judged by the output
 * file's modification time rather than the session's process or lock.
 * Result: monitors, background dispatches and parent sessions lose
 * their task output mid-execution, silently. First seen 1 Sep 2026,
 * recurring since. Claude Code 2.1.211 Windows. Reporter Row-Nation.
 * Filed 2026-09-02T05:44:45Z. OPEN. Labels: bug, platform:windows,
 * area:core, area:bash.
 *
 * Hypothesis only (NON-BINDING): new-session startup cleanup walks
 * the shared project temp and treats stale output-file mtime as dead,
 * so a long-running sibling Bash capture under tasks/<task-id>.output
 * is purged while the process is still live. Do not claim a root
 * cause in Claude Code source you have not seen. Verify against the
 * issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the spindle is fenced or swept.
 *
 * NOT Knell #91298 (Agent tool Spawned successfully mute child death
 * — cite as stay-off).
 * NOT Tumbler #74256 (PermissionRequest ExitPlanMode allow discarded).
 * NOT Escapement #91400 (scheduled mid-run stall — cite as stay-off).
 * NOT Clew / Hasp.
 * NOT Quire #91284 (silent session-transcript writer death — backup).
 * NOT Shear #79879 (Bash timeout hard-kill / auto-background — backup
 * / cousin, cite-only).
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick / geneva-drive / maltese-cross /
 * escapement pallet-fork / locksmith pin-tumbler / funeral-bell.
 * Product name stays Spindle. Do not rename to Sweep / Ways / Chip /
 * Purge / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula /
 * Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice /
 * Alidade / Cockade / Lye / Clew / Hasp / Shear / Quire.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "fenced",
  "swept",
  "sibling-live",
  "mtime-false-liveness",
  "startup-cleanup",
  "shared-temp-root",
  "output-truncated",
  "silent-deletion",
  "multi-session",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "fenced";
export const SEEDED_WORD = "swept";
export const HOLD_VERDICTS = Object.freeze(["fenced", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91402;
export const PRIMARY_ISSUES = Object.freeze([91402]);
export const COUSINS = Object.freeze([79879]);
export const COUSIN_ISSUE = 79879;
export const CROSS_ECOSYSTEM = Object.freeze(["openai/codex#35433"]);
export const NOT_PRODUCTS = Object.freeze([
  "knell",
  "tumbler",
  "escapement",
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
  "clew",
  "hasp",
  "shear",
  "quire",
  "woodworking",
  "mm-slider",
  "millrace",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "geneva-drive",
  "maltese-cross",
  "escapement pallet-fork",
  "locksmith pin-tumbler",
  "funeral-bell",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91402";
export const TITLE =
  "[BUG] Startup cleanup deletes live sibling sessions' Bash task output under the shared project temp root";
export const FILED_AT = "2026-09-02T05:44:45Z";
export const UPDATED_AT = "2026-09-02T05:45:55Z";
export const LABELS = Object.freeze([
  "bug",
  "platform:windows",
  "area:core",
  "area:bash",
]);
export const REPORTER = "Row-Nation";
export const VERSION = "2.1.211";
export const PLATFORM = "Windows";
export const TEMP_ROOT =
  "%LOCALAPPDATA%\\Temp\\claude\\<project-slug>\\<session-id>\\";
export const TASK_OUTPUT = "tasks/<task-id>.output";
export const FIRST_SEEN = "1 Sep 2026";
export const RUN_IN_BACKGROUND = "run_in_background";
export const HUB_LINE =
  "15:50 spindle: a spindle that sweeps a live sibling is not a hold. Score the purge or admit swept.";
export const MARK = "15:50 / hermes catalog #116 / #91402";
export const PHRASE =
  "a spindle that sweeps a live sibling is not a hold. Score the purge or admit swept.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: new-session startup cleanup walks the shared project temp and treats stale output-file mtime as dead, so a long-running sibling Bash capture under tasks/<task-id>.output is purged while the process is still live. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is NEW-SESSION STARTUP CLEANUP DELETES LIVE SIBLING BASH TASK OUTPUTS (mtime false-liveness). Multi-session use plus background subagents share one project temp root under %LOCALAPPDATA%\\Temp\\claude\\<project-slug>\\<session-id>\\. Session B startup cleanup deletes session A's still-running tasks/<task-id>.output. Liveness is judged by the output file's modification time rather than the session's process or lock. Silent; parent sees empty or truncated capture. First seen 1 Sep 2026, recurring. Repro: long run_in_background in A → start B same project → A's output deleted or truncated mid-run. Expected: never touch alive sibling dirs; require process-gone or lock-stale before delete. Claude Code 2.1.211 Windows. Reporter Row-Nation, 2026-09-02T05:44:45Z. Workarounds adopted: judge long-running dispatch outcomes from a durable project log rather than the harness capture; write background outputs to durable project paths; avoid starting new sessions mid-dispatch. Root cause is harness-side; no local hooks or settings trigger or control this. NOT Knell #91298 (Agent tool Spawned successfully mute child death). NOT Tumbler #74256. NOT Escapement #91400 scheduled. NOT Clew / Hasp. NOT Quire #91284 (backup). NOT Shear #79879 (backup/cousin). NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler / funeral-bell. Product name stays Spindle.";
export const FORBIDDEN_IDLE = Object.freeze([
  "tolled",
  "mute",
  "honored",
  "discarded",
  "arrested",
  "skipped",
  "indexed",
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
]);
export const BANNED_NAMES = Object.freeze([
  "Sweep",
  "Ways",
  "Chip",
  "Purge",
  "Knell",
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Postern",
  "Carillon",
  "Sluice",
  "Alidade",
  "Cockade",
  "Lye",
  "Clew",
  "Hasp",
  "Shear",
  "Quire",
]);
export const FORBIDDEN_UI = Object.freeze([
  "peal-board",
  "oak belfry",
  "registers three",
  "strikes one",
  "pin-tumbler",
  "keyway",
  "pallet-fork",
  "geneva-drive",
  "maltese-cross",
  "scotch-block",
  "pintle hinge",
  "postern door",
  "escape wheel",
  "balance spring",
  "chapter-ring",
  "oil stone",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "millrace",
  "woodworking",
  "mm-slider",
  "postern-gate",
  "night bailey",
  "rudder pintle",
  "gudgeon",
  "timber scotch",
  "wagon wheel",
  "iron rail",
  "switchman's hut",
  "bow fibula",
  "catch-plate",
  "cloak fold",
  "type-case",
  "lead sorts",
  "vermilion virgule",
  "wire mesh",
  "ore grit",
  "grain loft",
  "airing hatch",
  "sluice-gate",
  "pool-gauge",
  "plane-table",
  "jeweler's loupe",
  "steel driving pin",
  "shear line",
  "strike plate",
  "pin stacks",
  "ward cuts",
  "funeral-bell",
  "mourning ribbon",
  "untolled rope",
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
    siblingLive: null,
    outputDeleted: null,
    outputTruncated: null,
    mtimeLiveness: null,
    processLockLiveness: null,
    startupCleanup: null,
    sharedTempRoot: null,
    silentDeletion: null,
    multiSession: null,
    backgroundSubagents: null,
    runInBackground: null,
    sessionAAlive: null,
    sessionBCleanup: null,
    hasClearRepro: null,
    processGone: null,
    lockStale: null,
    siblingDirsUntouched: null,
    version: "",
    platform: "",
    reporter: "",
    tempRoot: "",
    taskOutputPath: "",
    cousin: "",
    outputText: "",
  };
}

export function seedFenced() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    siblingLive: true,
    outputDeleted: false,
    outputTruncated: false,
    mtimeLiveness: false,
    processLockLiveness: true,
    startupCleanup: true,
    sharedTempRoot: true,
    silentDeletion: false,
    multiSession: true,
    backgroundSubagents: true,
    runInBackground: true,
    sessionAAlive: true,
    sessionBCleanup: true,
    hasClearRepro: false,
    processGone: false,
    lockStale: false,
    siblingDirsUntouched: true,
    version: VERSION,
    platform: PLATFORM,
    reporter: "",
    tempRoot: TEMP_ROOT,
    taskOutputPath: TASK_OUTPUT,
    cousin: "",
    outputText:
      "fenced; cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete; idle word fenced",
  };
}

export function seedSwept() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    siblingLive: true,
    outputDeleted: true,
    outputTruncated: true,
    mtimeLiveness: true,
    processLockLiveness: false,
    startupCleanup: true,
    sharedTempRoot: true,
    silentDeletion: true,
    multiSession: true,
    backgroundSubagents: true,
    runInBackground: true,
    sessionAAlive: true,
    sessionBCleanup: true,
    hasClearRepro: true,
    processGone: false,
    lockStale: false,
    siblingDirsUntouched: false,
    version: VERSION,
    platform: PLATFORM,
    tempRoot: TEMP_ROOT,
    taskOutputPath: TASK_OUTPUT,
    cousin: "",
    outputText:
      "swept; #91402; new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; tasks/<task-id>.output deleted or truncated mid-run; silent; %LOCALAPPDATA%\\Temp\\claude; run_in_background; 2.1.211; Windows; Row-Nation; first seen 1 Sep 2026",
  };
}

export function seedSiblingLive() {
  return {
    seed: "sibling-live",
    source: "atelier",
    siblingLive: true,
    sessionAAlive: true,
    runInBackground: true,
    outputDeleted: true,
    startupCleanup: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    outputText:
      "sibling-live; session A's still-running tasks/<task-id>.output deleted by session B startup cleanup",
  };
}

export function seedMtimeFalseLiveness() {
  return {
    seed: "mtime-false-liveness",
    source: "atelier",
    mtimeLiveness: true,
    processLockLiveness: false,
    siblingLive: true,
    outputDeleted: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    outputText:
      "mtime-false-liveness; liveness judged by output file mtime rather than process or lock",
  };
}

export function seedStartupCleanup() {
  return {
    seed: "startup-cleanup",
    source: "atelier",
    startupCleanup: true,
    sessionBCleanup: true,
    siblingLive: true,
    outputDeleted: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    outputText:
      "startup-cleanup; session B startup cleanup deletes session A's still-running Bash background-task captures",
  };
}

export function seedSharedTempRoot() {
  return {
    seed: "shared-temp-root",
    source: "atelier",
    sharedTempRoot: true,
    multiSession: true,
    backgroundSubagents: true,
    siblingLive: true,
    outputDeleted: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    tempRoot: TEMP_ROOT,
    outputText:
      "shared-temp-root; multi-session plus background subagents share project temp %LOCALAPPDATA%\\Temp\\claude\\<project-slug>\\<session-id>\\",
  };
}

export function seedOutputTruncated() {
  return {
    seed: "output-truncated",
    source: "atelier",
    outputTruncated: true,
    outputDeleted: true,
    siblingLive: true,
    silentDeletion: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    taskOutputPath: TASK_OUTPUT,
    outputText:
      "output-truncated; parent session reads an empty or truncated .output file; capture lost mid-execution",
  };
}

export function seedSilentDeletion() {
  return {
    seed: "silent-deletion",
    source: "atelier",
    silentDeletion: true,
    outputDeleted: true,
    siblingLive: true,
    startupCleanup: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    outputText:
      "silent-deletion; none; the deletion is silent; parent sees empty or truncated capture",
  };
}

export function seedMultiSession() {
  return {
    seed: "multi-session",
    source: "atelier",
    multiSession: true,
    backgroundSubagents: true,
    sharedTempRoot: true,
    siblingLive: true,
    startupCleanup: true,
    outputDeleted: true,
    siblingDirsUntouched: false,
    hasClearRepro: true,
    outputText:
      "multi-session; several interactive sessions plus background subagents share one project temp root",
  };
}

export function seedHasClearRepro() {
  return {
    seed: "has-clear-repro",
    source: "atelier",
    siblingLive: true,
    outputDeleted: true,
    outputTruncated: true,
    mtimeLiveness: true,
    startupCleanup: true,
    sharedTempRoot: true,
    silentDeletion: true,
    multiSession: true,
    runInBackground: true,
    hasClearRepro: true,
    siblingDirsUntouched: false,
    reporter: REPORTER,
    version: VERSION,
    platform: PLATFORM,
    outputText:
      "has-clear-repro; Row-Nation filed #91402; 2.1.211 Windows; long run_in_background in A then start B same project; first seen 1 Sep 2026; recurring",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    siblingLive: true,
    outputDeleted: false,
    outputTruncated: false,
    mtimeLiveness: false,
    processLockLiveness: true,
    startupCleanup: true,
    sharedTempRoot: true,
    silentDeletion: false,
    multiSession: true,
    hasClearRepro: false,
    processGone: false,
    lockStale: false,
    siblingDirsUntouched: true,
    outputText:
      "hold; cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete; the spindle is fenced",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "79879",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #79879 Bash timeout silently hard-kills (exit 143) — Shear backup/cousin cite; not the #91402 startup-cleanup live-sibling sweep",
  };
}

export function emptyTicket() {
  return seedFenced();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.spindle && typeof src.spindle === "object" && src.spindle) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.ways && typeof src.ways === "object" && src.ways) ||
    (src.sweep && typeof src.sweep === "object" && src.sweep) ||
    (src.shop && typeof src.shop === "object" && src.shop) ||
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
    siblingLive: firstBool(nested.siblingLive, nested.sibling_live, src.siblingLive),
    outputDeleted: firstBool(
      nested.outputDeleted,
      nested.output_deleted,
      src.outputDeleted,
    ),
    outputTruncated: firstBool(
      nested.outputTruncated,
      nested.output_truncated,
      src.outputTruncated,
    ),
    mtimeLiveness: firstBool(
      nested.mtimeLiveness,
      nested.mtime_liveness,
      src.mtimeLiveness,
    ),
    processLockLiveness: firstBool(
      nested.processLockLiveness,
      nested.process_lock_liveness,
      src.processLockLiveness,
    ),
    startupCleanup: firstBool(
      nested.startupCleanup,
      nested.startup_cleanup,
      src.startupCleanup,
    ),
    sharedTempRoot: firstBool(
      nested.sharedTempRoot,
      nested.shared_temp_root,
      src.sharedTempRoot,
    ),
    silentDeletion: firstBool(
      nested.silentDeletion,
      nested.silent_deletion,
      src.silentDeletion,
    ),
    multiSession: firstBool(
      nested.multiSession,
      nested.multi_session,
      src.multiSession,
    ),
    backgroundSubagents: firstBool(
      nested.backgroundSubagents,
      nested.background_subagents,
      src.backgroundSubagents,
    ),
    runInBackground: firstBool(
      nested.runInBackground,
      nested.run_in_background,
      src.runInBackground,
    ),
    sessionAAlive: firstBool(
      nested.sessionAAlive,
      nested.session_a_alive,
      src.sessionAAlive,
    ),
    sessionBCleanup: firstBool(
      nested.sessionBCleanup,
      nested.session_b_cleanup,
      src.sessionBCleanup,
    ),
    hasClearRepro: firstBool(
      nested.hasClearRepro,
      nested.has_clear_repro,
      src.hasClearRepro,
    ),
    processGone: firstBool(nested.processGone, nested.process_gone, src.processGone),
    lockStale: firstBool(nested.lockStale, nested.lock_stale, src.lockStale),
    siblingDirsUntouched: firstBool(
      nested.siblingDirsUntouched,
      nested.sibling_dirs_untouched,
      src.siblingDirsUntouched,
    ),
    version: firstText(nested.version, src.version),
    platform: firstText(nested.platform, src.platform),
    tempRoot: firstText(nested.tempRoot, nested.temp_root, src.tempRoot),
    taskOutputPath: firstText(
      nested.taskOutputPath,
      nested.task_output_path,
      src.taskOutputPath,
    ),
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
    row.siblingLive == null &&
    row.outputDeleted == null &&
    row.outputTruncated == null &&
    row.mtimeLiveness == null &&
    row.startupCleanup == null &&
    row.silentDeletion == null &&
    row.sharedTempRoot == null &&
    row.multiSession == null &&
    row.siblingDirsUntouched == null &&
    row.processLockLiveness == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedFenced,
  [SEEDED_WORD]: seedSwept,
  "sibling-live": seedSiblingLive,
  "mtime-false-liveness": seedMtimeFalseLiveness,
  "startup-cleanup": seedStartupCleanup,
  "shared-temp-root": seedSharedTempRoot,
  "output-truncated": seedOutputTruncated,
  "silent-deletion": seedSilentDeletion,
  "multi-session": seedMultiSession,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  79879: seedCousin,
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
    return { ...seedSwept(), ...cloned, ...raw };
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
    ticket.tempRoot,
    ticket.taskOutputPath,
    ticket.reporter,
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

export function isFenced(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.siblingDirsUntouched === true &&
    row.processLockLiveness === true &&
    row.outputDeleted !== true
  ) {
    return true;
  }
  return false;
}

export function isSwept(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.startupCleanup === true &&
      row.siblingLive === true &&
      row.outputDeleted === true) ||
    row.mtimeLiveness === true ||
    row.silentDeletion === true ||
    row.outputTruncated === true
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
      /cousin-not-primary|#79879|openai\/codex#35433|#35433/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const sweptNow = !cousinOnly && isSwept(row);
  const fencedNow = !sweptNow && isFenced(row);
  const siblingLive =
    row.siblingLive === true ||
    row.sessionAAlive === true ||
    named === "sibling-live" ||
    /sibling-live|still-running|live sibling/i.test(text);
  const mtimeFalseLiveness =
    row.mtimeLiveness === true ||
    named === "mtime-false-liveness" ||
    /mtime-false-liveness|mtime|modification time/i.test(text);
  const startupCleanup =
    row.startupCleanup === true ||
    row.sessionBCleanup === true ||
    named === "startup-cleanup" ||
    /startup-cleanup|startup cleanup/i.test(text);
  const sharedTempRoot =
    row.sharedTempRoot === true ||
    named === "shared-temp-root" ||
    /shared-temp-root|LOCALAPPDATA|shared project temp/i.test(text);
  const outputTruncated =
    row.outputTruncated === true ||
    named === "output-truncated" ||
    /output-truncated|truncated|empty or truncated/i.test(text);
  const silentDeletion =
    row.silentDeletion === true ||
    named === "silent-deletion" ||
    /silent-deletion|deletion is silent|silently/i.test(text);
  const multiSession =
    row.multiSession === true ||
    named === "multi-session" ||
    /multi-session|background subagents/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|Row-Nation|2\.1\.211|run_in_background|1 Sep 2026/i.test(
      text,
    );
  const swept =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (sweptNow || named === SEEDED_WORD || /swept|#91402/i.test(text));
  const fenced =
    named === IDLE_WORD || named === "hold" || (fencedNow && !swept);
  return {
    named,
    cousinOnly,
    sweptNow,
    fencedNow,
    siblingLive,
    mtimeFalseLiveness,
    startupCleanup,
    sharedTempRoot,
    outputTruncated,
    silentDeletion,
    multiSession,
    hasClearRepro,
    swept,
    fenced,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.fenced && !flags.swept) chips.push("fenced");
  if (flags.swept) chips.push("swept");
  if (flags.siblingLive && flags.swept) chips.push("sibling-live");
  if (flags.mtimeFalseLiveness && flags.swept) chips.push("mtime-false-liveness");
  if (flags.startupCleanup && flags.swept) chips.push("startup-cleanup");
  if (flags.sharedTempRoot && flags.swept) chips.push("shared-temp-root");
  if (flags.outputTruncated && flags.swept) chips.push("output-truncated");
  if (flags.silentDeletion && flags.swept) chips.push("silent-deletion");
  if (flags.multiSession && flags.swept) chips.push("multi-session");
  if (flags.hasClearRepro && flags.swept) chips.push("has-clear-repro");
  if ((flags.fenced || flags.named === "hold") && !flags.swept) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "fenced") {
    reasons.push(
      "fenced; cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete",
    );
    reasons.push(
      "hold: the spindle is fenced; score treats a process/lock liveness check as a hold",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete; the spindle is fenced",
    );
  }
  if (verdict === "swept" || flags.swept) {
    reasons.push(
      "swept; #91402; new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; silent mid-execution loss",
    );
  }
  if (flags.siblingLive || verdict === "sibling-live") {
    reasons.push(
      "sibling-live; session A's still-running tasks/<task-id>.output deleted by session B startup cleanup",
    );
  }
  if (flags.mtimeFalseLiveness || verdict === "mtime-false-liveness") {
    reasons.push(
      "mtime-false-liveness; liveness judged by output file mtime rather than process or lock",
    );
  }
  if (flags.startupCleanup || verdict === "startup-cleanup") {
    reasons.push(
      "startup-cleanup; session B startup cleanup deletes session A's still-running Bash background-task captures",
    );
  }
  if (flags.sharedTempRoot || verdict === "shared-temp-root") {
    reasons.push(
      `shared-temp-root; multi-session plus background subagents share project temp ${TEMP_ROOT}`,
    );
  }
  if (flags.outputTruncated || verdict === "output-truncated") {
    reasons.push(
      "output-truncated; parent session reads an empty or truncated .output file; capture lost mid-execution",
    );
  }
  if (flags.silentDeletion || verdict === "silent-deletion") {
    reasons.push(
      "silent-deletion; none; the deletion is silent; parent sees empty or truncated capture",
    );
  }
  if (flags.multiSession || verdict === "multi-session") {
    reasons.push(
      "multi-session; several interactive sessions plus background subagents share one project temp root",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; ${VERSION} ${PLATFORM}; long ${RUN_IN_BACKGROUND} in A then start B same project; first seen ${FIRST_SEEN}; recurring`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Spindle; cite-only #79879 Bash timeout hard-kill (Shear backup) / openai/codex#35433 Windows background shell child, not the startup-cleanup live-sibling sweep",
    );
  }
  if (verdict === "swept" || flags.swept) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "fenced" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.fenced || !flags.swept)) return "fenced";
  if (named === "hold" && !flags.swept) return "hold";
  if (named === SEEDED_WORD) return "swept";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "fenced";
  if (flags.swept) return "swept";
  if (flags.fenced) return "fenced";
  return "fenced";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "swept" || flags.swept) {
    return {
      case: "swept — chip-sweep crossed the fence; live sibling ways bare",
      rope: "shared ways unswept of a live capture; startup cleanup ran",
      clapper: `mtime false-liveness · ${TASK_OUTPUT} gone · silent`,
      chamber: "empty sibling bay; parent reads truncated capture",
      mark: "chip fence breached; the spindle swept a live sibling",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "fenced — cleanup never touches alive sibling dirs",
      rope: "process/lock liveness; process-gone or lock-stale before delete",
      clapper: "shared ways hold · sibling capture intact · fence up",
      chamber: "chip ledger records the hold; the spindle is fenced",
      mark: "chip fence up; the spindle is fenced",
      note: "Hold: the spindle is fenced.",
    };
  }
  return {
    case: "fenced — cleanup never touches alive sibling dirs",
    rope: "process/lock liveness; no mtime false-liveness",
    clapper: "sibling capture intact · shared ways hold",
    chamber: "chip ledger quiet; atelier fenced",
    mark: "chip fence up; idle word fenced",
    note: "Fenced: the spindle holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const swept = verdict === "swept" || flags.swept;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    fenced: verdict === "fenced" || (flags.fenced && !swept),
    swept,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: chamberOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91402 || name === "91402") {
    return analyze(seedSwept());
  }
  if (name === "sibling-live") return analyze(seedSiblingLive());
  if (name === "mtime-false-liveness") return analyze(seedMtimeFalseLiveness());
  if (name === "startup-cleanup") return analyze(seedStartupCleanup());
  if (name === "shared-temp-root") return analyze(seedSharedTempRoot());
  if (name === "output-truncated") return analyze(seedOutputTruncated());
  if (name === "silent-deletion") return analyze(seedSilentDeletion());
  if (name === "multi-session") return analyze(seedMultiSession());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "fenced" || name === "open") {
    return analyze(seedFenced());
  }
  if (name === 79879 || name === "79879" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedFenced());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "swept" || (result.swept && result.alarm)
          ? `swept spindle #${FEATURED_ISSUE}: startup cleanup deleted live sibling ${TASK_OUTPUT}; mtime false-liveness. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Cleanup never touches alive sibling dirs. Score the purge."
            : `fenced spindle. Idle word ${IDLE_WORD}. Cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete.`,
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
