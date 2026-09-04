#!/usr/bin/env node
/**
 * Relict — glacial-relict / fossil-outcrop classifier.
 * A relict that keeps a versioned WindowsApps Run path after
 * the MSIX folder is gone is not a live startup — it is an
 * outcrop already orphaned. Score the relict or admit the
 * path already orphaned.
 *
 *   echo '{"testPath":false,"runKeyWritten":true}' | node relict.mjs
 *   node relict.mjs ticket.json
 *
 * Idle word is live (HOLD: StartupTask API keeps the path
 * current / the task stays enabled).
 * Seeded state is orphaned / #92173 (stale versioned Run
 * key; package folder gone; silent fail every logon).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score outcrop fixtures for whether the StartupTask stayed
 * live or the Run key already orphaned the path.
 *
 * Primary #92173: Claude Desktop (Windows/MSIX) "launch at
 * startup" writes a versioned WindowsApps path to HKCU\Run,
 * so it silently breaks at the next auto-update. Reporter
 * iamsteamboat. Filed 2026-09-04T17:51:50Z. OPEN. Labels:
 * invalid. Claude Desktop 1.46388.1.0 MSIX
 * Claude_pzs8sxrjxfjjc. Windows 11 Home 10.0.26200.
 *
 * Hypothesis only (NON-BINDING): toggle wrote a versioned
 * HKCU\Run instead of enabling the StartupTask API; updates
 * do not refresh Run; silent fail. Discard if issue evidence
 * disagrees. Do not claim Claude Desktop source you have
 * not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "live",
  "orphaned",
  "versioned",
  "silent",
  "demoted",
  "approved",
  "startup-task",
  "run-key",
  "missing-folder",
  "bound",
]);
export const IDLE_WORD = "live";
export const SEEDED_WORD = "orphaned";
export const HOLD_VERDICTS = Object.freeze(["live", "bound"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92173;
export const PRIMARY_ISSUES = Object.freeze([92173]);
export const COUSINS = Object.freeze([92167, 89912, 91482, 85689]);
export const COUSIN_ISSUE = 92167;
export const DIFFERENT_CLASS = Object.freeze([91750]);
export const BACKUPS = Object.freeze([92187, 92171, 92166]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92173";
export const TITLE =
  '[BUG] Claude Desktop (Windows/MSIX): "launch at startup" writes a versioned WindowsApps path to HKCU\\Run, so it silently breaks at the next auto-update';
export const FILED_AT = "2026-09-04T17:51:50Z";
export const UPDATED_AT = "2026-09-04T17:52:47Z";
export const LABELS = Object.freeze(["invalid"]);
export const REPORTER = "iamsteamboat";
export const PLATFORM = "Windows 11 Home 10.0.26200";
export const DESKTOP_VERSION = "1.46388.1.0";
export const PACKAGE_FAMILY = "Claude_pzs8sxrjxfjjc";
export const TOGGLE_VERSION = "1.24012.11.0";
export const BREAK_VERSION = "1.25927.0.0";
export const UPDATES_SINCE = 9;
export const RUN_HIVE = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
export const RUN_VALUE = "Claude";
export const RUN_PATH =
  "C:\\Program Files\\WindowsApps\\Claude_1.24012.11.0_x64__pzs8sxrjxfjjc\\app\\claude.exe";
export const CURRENT_PATH =
  "C:\\Program Files\\WindowsApps\\Claude_1.46388.1.0_x64__pzs8sxrjxfjjc\\app\\claude.exe";
export const STARTUP_TASK = "ClaudeStartup";
export const STARTUP_TASK_STATE = 0;
export const USER_ENABLED_ONCE = 0;
export const AREA = "area:desktop";
export const EVIDENCE = "versioned-run-key-missing-folder-silent-fail";
export const HUB_LINE =
  "04:50 relict: a relict that keeps a versioned WindowsApps Run path after the MSIX folder is gone is not a live startup — it is an outcrop already orphaned. Score the relict or admit the path already orphaned.";
export const MARK = "04:50 / hermes catalog #141 / #92173";
export const PHRASE =
  "Score the relict or admit the path already orphaned.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: toggle wrote a versioned HKCU\\Run instead of enabling the StartupTask API; updates do not refresh Run; silent fail. Discard if issue evidence disagrees. Do not claim Claude Desktop source you have not seen.";
export const CONTRAST_NOTE =
  "This is VERSIONED WINDOWSAPPS PATH WRITTEN TO HKCU\\RUN ON CLAUDE DESKTOP MSIX, THEN THE NEXT AUTO-UPDATE REMOVES THAT VERSION FOLDER AND THE RUN ENTRY IS NEVER REWRITTEN, SO LOGON LAUNCH FAILS SILENTLY. Claude Desktop 1.46388.1.0 MSIX Claude_pzs8sxrjxfjjc. Windows 11 Home 10.0.26200. Toggle enabled on 1.24012.11.0; next update 1.25927.0.0 removed the folder; nine updates later Run still points at 1.24012.11.0; Test-Path False. Entry never under Explorer\\StartupApproved\\Run, so Settings → Apps → Startup never shows it failing. Package manifest declares windows.startupTask (ClaudeStartup) but State=0 Disabled / UserEnabledStartupOnce=0 — the toggle used the wrong mechanism. Reporter iamsteamboat. Filed 2026-09-04. OPEN, invalid. Not Hellbox sticky CLAUDE_PROJECT_DIR ENOENT erase. Not Cupel draft-07 assay. Not Oubliette cold-parent Dispatch queue. Not Ephemera 5m wick. Not Commutator sibling-slot stray. Not Reliquary.";
export const HOLD_RESULT =
  "live outcrop; StartupTask API keeps the path current / the task stays enabled; idle word live";
export const FORBIDDEN_IDLE = Object.freeze([
  "set",
  "scrapped",
  "pure",
  "scorched",
  "cold",
  "voided",
  "banked",
  "rewritten",
  "keyed",
  "strayed",
  "scrubbed",
  "pulled",
  "enacted",
  "withheld",
  "masked",
  "bled",
]);
export const BANNED_NAMES = Object.freeze([
  "Hellbox",
  "Cupel",
  "Oubliette",
  "Ephemera",
  "Commutator",
  "Heddle",
  "Hectograph",
  "Placet",
  "Frisket",
  "Tangent",
  "Hawser",
  "Caret",
  "Buoy",
  "Solecism",
  "Coffer",
  "Codicil",
  "Crimp",
  "Jackfield",
  "Tocsin",
  "Bolter",
  "Deadeye",
  "Reglet",
  "Reliquary",
  "Annunciator",
  "Caisson",
  "Spindle",
  "Knell",
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Pintle",
  "Homograph",
  "Deckle",
  "Damper",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Fraunces",
  "DM Sans",
  "IBM Plex Mono",
  "Bodoni Moda",
  "Outfit",
  "Eczar",
  "Schibsted Grotesk",
  "Martian Mono",
  "Newsreader",
  "Figtree",
  "Source Code Pro",
]);
export const NOT_PRODUCTS = Object.freeze([
  "hellbox",
  "cupel",
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "pintle",
  "homograph",
  "deckle",
  "damper",
]);

function firstText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return null;
}

function outcropOf(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.outcrop && typeof src.outcrop === "object" ? src.outcrop : {};
  return {
    runKeyWritten: firstBool(nested.runKeyWritten, src.runKeyWritten, src.runKey),
    runKeyPath: firstText(nested.runKeyPath, src.runKeyPath, src.path),
    runKeyVersion: firstText(nested.runKeyVersion, src.runKeyVersion, src.version),
    currentPackageVersion: firstText(
      nested.currentPackageVersion,
      src.currentPackageVersion,
      src.packageVersion,
    ),
    packageFolderExists: firstBool(
      nested.packageFolderExists,
      src.packageFolderExists,
      src.folderExists,
    ),
    testPath: firstBool(nested.testPath, src.testPath),
    startupApproved: firstBool(nested.startupApproved, src.startupApproved, src.approved),
    startupTaskDeclared: firstBool(
      nested.startupTaskDeclared,
      src.startupTaskDeclared,
      src.declared,
    ),
    startupTaskName: firstText(
      nested.startupTaskName,
      src.startupTaskName,
      src.taskName,
    ),
    startupTaskState: firstNum(
      nested.startupTaskState,
      src.startupTaskState,
      src.taskState,
    ),
    userEnabledStartupOnce: firstNum(
      nested.userEnabledStartupOnce,
      src.userEnabledStartupOnce,
    ),
    toggleEnabled: firstBool(nested.toggleEnabled, src.toggleEnabled, src.toggle),
    silentFail: firstBool(nested.silentFail, src.silentFail, src.silent),
    updatesSinceBreak: firstNum(
      nested.updatesSinceBreak,
      src.updatesSinceBreak,
      src.updates,
    ),
    mechanism: firstText(nested.mechanism, src.mechanism),
  };
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    title: "",
    url: "",
    source: "",
    isolation: "",
    cousin: "",
    persistHold: null,
    live: null,
    orphaned: null,
    runKeyWritten: null,
    runKeyPath: "",
    runKeyVersion: "",
    currentPackageVersion: "",
    packageFolderExists: null,
    testPath: null,
    startupApproved: null,
    startupTaskDeclared: null,
    startupTaskName: "",
    startupTaskState: null,
    userEnabledStartupOnce: null,
    toggleEnabled: null,
    silentFail: null,
    updatesSinceBreak: null,
    mechanism: "",
    platform: "",
    desktopVersion: "",
    packageFamily: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedLive() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "outcrop",
    persistHold: true,
    live: true,
    orphaned: false,
    runKeyWritten: false,
    runKeyPath: "",
    runKeyVersion: "",
    currentPackageVersion: DESKTOP_VERSION,
    packageFolderExists: true,
    testPath: true,
    startupApproved: true,
    startupTaskDeclared: true,
    startupTaskName: STARTUP_TASK,
    startupTaskState: 1,
    userEnabledStartupOnce: 1,
    toggleEnabled: true,
    silentFail: false,
    updatesSinceBreak: 0,
    mechanism: "startup-task",
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "live; StartupTask API keeps the path current / the task stays enabled; idle word live",
  };
}

export function seedOrphaned() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "outcrop",
    persistHold: false,
    live: false,
    orphaned: true,
    runKeyWritten: true,
    runKeyPath: RUN_PATH,
    runKeyVersion: TOGGLE_VERSION,
    currentPackageVersion: DESKTOP_VERSION,
    packageFolderExists: false,
    testPath: false,
    startupApproved: false,
    startupTaskDeclared: true,
    startupTaskName: STARTUP_TASK,
    startupTaskState: STARTUP_TASK_STATE,
    userEnabledStartupOnce: USER_ENABLED_ONCE,
    toggleEnabled: true,
    silentFail: true,
    updatesSinceBreak: UPDATES_SINCE,
    mechanism: "run-key",
    platform: PLATFORM,
    desktopVersion: DESKTOP_VERSION,
    packageFamily: PACKAGE_FAMILY,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "orphaned; #92173; versioned HKCU\\Run still points at 1.24012.11.0; Test-Path False; ClaudeStartup State=0; nine updates later; iamsteamboat; 1.46388.1.0; Windows 11 Home; area:desktop",
  };
}

export function seedVersioned() {
  return {
    ...blankTicket(),
    seed: "versioned",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    runKeyWritten: true,
    runKeyPath: RUN_PATH,
    runKeyVersion: TOGGLE_VERSION,
    currentPackageVersion: DESKTOP_VERSION,
    mechanism: "run-key",
    outputText:
      "versioned; HKCU\\Run Claude writes a versioned WindowsApps path; MSIX installs into a version-named folder",
  };
}

export function seedSilent() {
  return {
    ...blankTicket(),
    seed: "silent",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    silentFail: true,
    testPath: false,
    packageFolderExists: false,
    outputText:
      "silent; at every logon Windows tries to launch a path that does not exist and fails silently",
  };
}

export function seedDemoted() {
  return {
    ...blankTicket(),
    seed: "demoted",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    startupTaskDeclared: true,
    startupTaskName: STARTUP_TASK,
    startupTaskState: STARTUP_TASK_STATE,
    userEnabledStartupOnce: USER_ENABLED_ONCE,
    outputText:
      "demoted; ClaudeStartup State=0 Disabled / UserEnabledStartupOnce=0 — the toggle used the wrong mechanism",
  };
}

export function seedApproved() {
  return {
    ...blankTicket(),
    seed: "approved",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    startupApproved: false,
    runKeyWritten: true,
    outputText:
      "approved; entry was never under Explorer\\StartupApproved\\Run, so Settings → Apps → Startup never shows it failing",
  };
}

export function seedStartupTask() {
  return {
    ...blankTicket(),
    seed: "startup-task",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    startupTaskDeclared: true,
    startupTaskName: STARTUP_TASK,
    startupTaskState: STARTUP_TASK_STATE,
    userEnabledStartupOnce: USER_ENABLED_ONCE,
    mechanism: "run-key",
    outputText:
      "startup-task; package manifest declares windows.startupTask (ClaudeStartup) but the task stays Disabled",
  };
}

export function seedRunKey() {
  return {
    ...blankTicket(),
    seed: "run-key",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    runKeyWritten: true,
    runKeyPath: RUN_PATH,
    runKeyVersion: TOGGLE_VERSION,
    mechanism: "run-key",
    outputText:
      "run-key; HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Claude still points at 1.24012.11.0",
  };
}

export function seedMissingFolder() {
  return {
    ...blankTicket(),
    seed: "missing-folder",
    source: "outcrop",
    persistHold: false,
    orphaned: true,
    packageFolderExists: false,
    testPath: false,
    runKeyVersion: TOGGLE_VERSION,
    currentPackageVersion: DESKTOP_VERSION,
    outputText:
      "missing-folder; next auto-update 1.25927.0.0 removed the version folder; Test-Path False; nine updates later still gone",
  };
}

export function seedBound() {
  return {
    ...seedLive(),
    seed: "bound",
    outputText:
      "bound; StartupTask API keeps the path current / the task stays enabled; idle word live",
  };
}

export function seedCousin() {
  return {
    ...seedLive(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #92167 #89912 #91482 #85689 — cite only, not the #92173 relict outcrop; different-class cite #91750 file-handler registration — not Run",
  };
}

export function emptyTicket() {
  return seedLive();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const outcrop = outcropOf({ ...src, ...nested });
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    live: firstBool(nested.live, src.live),
    orphaned: firstBool(nested.orphaned, src.orphaned),
    runKeyWritten: outcrop.runKeyWritten,
    runKeyPath: outcrop.runKeyPath,
    runKeyVersion: outcrop.runKeyVersion,
    currentPackageVersion: outcrop.currentPackageVersion,
    packageFolderExists: outcrop.packageFolderExists,
    testPath: outcrop.testPath,
    startupApproved: outcrop.startupApproved,
    startupTaskDeclared: outcrop.startupTaskDeclared,
    startupTaskName: outcrop.startupTaskName,
    startupTaskState: outcrop.startupTaskState,
    userEnabledStartupOnce: outcrop.userEnabledStartupOnce,
    toggleEnabled: outcrop.toggleEnabled,
    silentFail: outcrop.silentFail,
    updatesSinceBreak: outcrop.updatesSinceBreak,
    mechanism: outcrop.mechanism,
    platform: firstText(nested.platform, src.platform),
    desktopVersion: firstText(nested.desktopVersion, src.desktopVersion),
    packageFamily: firstText(nested.packageFamily, src.packageFamily),
    reporter: firstText(nested.reporter, src.reporter),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
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
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  const outcrop = outcropOf(row);
  return (
    row.persistHold == null &&
    row.live == null &&
    row.orphaned == null &&
    outcrop.runKeyWritten == null &&
    !outcrop.runKeyPath &&
    outcrop.packageFolderExists == null &&
    outcrop.testPath == null &&
    outcrop.silentFail == null &&
    outcrop.startupTaskState == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedLive,
  [SEEDED_WORD]: seedOrphaned,
  versioned: seedVersioned,
  silent: seedSilent,
  demoted: seedDemoted,
  approved: seedApproved,
  "startup-task": seedStartupTask,
  startupTask: seedStartupTask,
  "run-key": seedRunKey,
  runKey: seedRunKey,
  "missing-folder": seedMissingFolder,
  missingFolder: seedMissingFolder,
  bound: seedBound,
  cousin: seedCousin,
  92167: seedCousin,
  89912: seedCousin,
  91482: seedCousin,
  85689: seedCousin,
  91750: seedCousin,
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
    return { ...seedOrphaned(), ...cloned, ...raw };
  }
  if (
    (COUSINS.includes(issue) || DIFFERENT_CLASS.includes(issue)) &&
    coreMissing
  ) {
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
    ticket.reporter,
    ticket.platform,
    ticket.desktopVersion,
    ticket.runKeyPath,
    ticket.runKeyVersion,
    ticket.startupTaskName,
    ticket.mechanism,
    ticket.area,
    ticket.evidence,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const aliases = {
    startupTask: "startup-task",
    startup_task: "startup-task",
    runKey: "run-key",
    run_key: "run-key",
    missingFolder: "missing-folder",
    missing_folder: "missing-folder",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isCleanOutcrop(ticket) {
  const row = cloneTicket(ticket);
  if (
    row.startupTaskState != null &&
    row.startupTaskState !== 0 &&
    row.silentFail !== true &&
    row.testPath !== false
  ) {
    return true;
  }
  if (row.live === true && row.orphaned !== true && row.mechanism === "startup-task") {
    return true;
  }
  return false;
}

export function orphanedPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.orphaned === true) return true;
  if (row.testPath === false && row.runKeyWritten === true) return true;
  if (row.packageFolderExists === false && row.runKeyWritten === true) return true;
  if (
    row.runKeyWritten === true &&
    row.runKeyVersion &&
    row.currentPackageVersion &&
    row.runKeyVersion !== row.currentPackageVersion &&
    (row.testPath === false || row.packageFolderExists === false)
  ) {
    return true;
  }
  if (row.silentFail === true && row.testPath === false) return true;
  return false;
}

export function livePattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.live === true && row.orphaned !== true) return true;
  if (isCleanOutcrop(row) && row.orphaned !== true) return true;
  return false;
}

export function isLive(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "bound") return true;
  if (row.persistHold === true && row.orphaned !== true && livePattern(row)) {
    return true;
  }
  if (livePattern(row) && row.orphaned !== true && !orphanedPattern(row)) {
    return true;
  }
  return false;
}

export function isOrphaned(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (DIFFERENT_CLASS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "bound") {
    return true;
  }
  if (orphanedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      DIFFERENT_CLASS.includes(row.issue) ||
      /cousin-not-primary|#92167|#89912|#91482|#85689|#91750/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const orphanedNow = !cousinOnly && isOrphaned(row);
  const liveNow = !orphanedNow && isLive(row);
  const versioned =
    named === "versioned" ||
    (row.runKeyWritten === true &&
      row.runKeyVersion &&
      row.currentPackageVersion &&
      row.runKeyVersion !== row.currentPackageVersion) ||
    /versioned WindowsApps|version-named folder/i.test(text);
  const silent =
    named === "silent" ||
    row.silentFail === true ||
    /fails silently|silent fail/i.test(text);
  const demoted =
    named === "demoted" ||
    (row.startupTaskState === 0 && row.userEnabledStartupOnce === 0) ||
    /State=0|wrong mechanism/i.test(text);
  const approved =
    named === "approved" ||
    row.startupApproved === false ||
    /StartupApproved|never shows it failing/i.test(text);
  const startupTask =
    named === "startup-task" ||
    (row.startupTaskDeclared === true && row.startupTaskState === 0) ||
    /windows\.startupTask|ClaudeStartup/i.test(text);
  const runKey =
    named === "run-key" ||
    row.mechanism === "run-key" ||
    row.runKeyWritten === true ||
    /HKCU\\.*\\Run|Run\\Claude/i.test(text);
  const missingFolder =
    named === "missing-folder" ||
    row.packageFolderExists === false ||
    row.testPath === false ||
    /Test-Path False|removed the version folder/i.test(text);
  const orphaned =
    named !== IDLE_WORD &&
    named !== "bound" &&
    !cousinOnly &&
    (orphanedNow || named === SEEDED_WORD || /orphaned|#92173/i.test(text));
  const live = HOLD_VERDICTS.includes(named) || (liveNow && !orphaned);
  return {
    named,
    cousinOnly,
    orphanedNow,
    liveNow,
    versioned,
    silent,
    demoted,
    approved,
    startupTask,
    runKey,
    missingFolder,
    orphaned,
    live,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.live && !flags.orphaned) chips.push("live");
  if (flags.orphaned) chips.push("orphaned");
  if (flags.versioned && flags.orphaned) chips.push("versioned");
  if (flags.silent && flags.orphaned) chips.push("silent");
  if (flags.demoted && flags.orphaned) chips.push("demoted");
  if (flags.approved && flags.orphaned) chips.push("approved");
  if (flags.startupTask && flags.orphaned) chips.push("startup-task");
  if (flags.runKey && flags.orphaned) chips.push("run-key");
  if (flags.missingFolder && flags.orphaned) chips.push("missing-folder");
  if ((flags.live || flags.named === "bound") && !flags.orphaned) {
    chips.push("bound");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "live") {
    reasons.push(
      "live; StartupTask API keeps the path current / the task stays enabled",
    );
    reasons.push("bound: the outcrop stays live; idle word live");
  }
  if (verdict === "bound") {
    reasons.push(
      "bound; StartupTask API keeps the path current / the task stays enabled",
    );
  }
  if (verdict === "orphaned" || flags.orphaned) {
    reasons.push(
      "orphaned; #92173; versioned HKCU\\Run + missing folder + silent logon fail",
    );
  }
  if (verdict === "versioned" || (flags.versioned && flags.orphaned)) {
    reasons.push(
      "versioned; HKCU\\Run writes a versioned WindowsApps path; MSIX installs into a version-named folder",
    );
  }
  if (verdict === "silent" || (flags.silent && flags.orphaned)) {
    reasons.push(
      "silent; logon launch fails silently; Settings never shows it failing",
    );
  }
  if (verdict === "demoted" || (flags.demoted && flags.orphaned)) {
    reasons.push(
      "demoted; ClaudeStartup State=0 Disabled / UserEnabledStartupOnce=0",
    );
  }
  if (verdict === "approved" || (flags.approved && flags.orphaned)) {
    reasons.push(
      "approved; never under Explorer\\StartupApproved\\Run",
    );
  }
  if (verdict === "startup-task" || (flags.startupTask && flags.orphaned)) {
    reasons.push(
      "startup-task; package manifest declares windows.startupTask (ClaudeStartup) but the task stays Disabled",
    );
  }
  if (verdict === "run-key" || (flags.runKey && flags.orphaned)) {
    reasons.push(
      "run-key; HKCU\\...\\Run\\Claude still points at 1.24012.11.0",
    );
  }
  if (verdict === "missing-folder" || (flags.missingFolder && flags.orphaned)) {
    reasons.push(
      "missing-folder; 1.25927.0.0 removed the version folder; Test-Path False; nine updates later still gone",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Relict; cite-only #92167 #89912 #91482 #85689 — different surfaces from #92173 relict outcrop; different-class cite #91750; primary stays #92173",
    );
  }
  if (verdict === "orphaned" || flags.orphaned) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (!HOLD_VERDICTS.includes(verdict)) {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.live || !flags.orphaned)) return "live";
  if (named === "bound" && !flags.orphaned) return "bound";
  if (named === SEEDED_WORD) return "orphaned";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "live";
  if (flags.orphaned) return "orphaned";
  if (flags.live) return "live";
  return "live";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "orphaned" || flags.orphaned) {
    return {
      case: "orphaned — versioned HKCU\\Run + missing folder dumped the path into a fossil outcrop",
      runKeyPath: ticket.runKeyPath || RUN_PATH,
      runKeyVersion: ticket.runKeyVersion || TOGGLE_VERSION,
      testPath: ticket.testPath === true,
      updates: ticket.updatesSinceBreak ?? UPDATES_SINCE,
      mark: "relict orphaned; admit the path already orphaned",
      note: PHRASE,
    };
  }
  if (verdict === "bound") {
    return {
      case: "bound — StartupTask API keeps the path current / the task stays enabled",
      runKeyPath: CURRENT_PATH,
      runKeyVersion: DESKTOP_VERSION,
      testPath: true,
      updates: 0,
      mark: "relict bound; the outcrop stays live",
      note: "Bound: the StartupTask stays enabled.",
    };
  }
  return {
    case: "live — StartupTask API keeps the path current / the task stays enabled; idle word live",
    runKeyPath: CURRENT_PATH,
    runKeyVersion: DESKTOP_VERSION,
    testPath: true,
    updates: 0,
    mark: "relict live; idle word live",
    note: "Live: the StartupTask keeps the path current.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const orphaned = verdict === "orphaned" || flags.orphaned;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    live: verdict === "live" || (flags.live && !orphaned),
    orphaned,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: deskOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 92173 || name === "92173") {
    return analyze(seedOrphaned());
  }
  if (name === "versioned") return analyze(seedVersioned());
  if (name === "silent") return analyze(seedSilent());
  if (name === "demoted") return analyze(seedDemoted());
  if (name === "approved") return analyze(seedApproved());
  if (name === "startup-task" || name === "startupTask") {
    return analyze(seedStartupTask());
  }
  if (name === "run-key" || name === "runKey") return analyze(seedRunKey());
  if (name === "missing-folder" || name === "missingFolder") {
    return analyze(seedMissingFolder());
  }
  if (name === "bound") return analyze(seedBound());
  if (name === IDLE_WORD || name === "open") {
    return analyze(seedLive());
  }
  if (
    name === 92167 ||
    name === "92167" ||
    name === 89912 ||
    name === "89912" ||
    name === 91482 ||
    name === "91482" ||
    name === 85689 ||
    name === "85689" ||
    name === 91750 ||
    name === "91750" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedLive());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "orphaned" || (result.orphaned && result.alarm)
          ? `orphaned relict #${FEATURED_ISSUE}: versioned HKCU\\Run, missing WindowsApps folder, silent logon fail. ${HYPOTHESIS_NOTE}`
          : result.verdict === "bound"
            ? "bound. The outcrop stayed live. Score the relict."
            : `live relict. Idle word ${IDLE_WORD}. StartupTask API keeps the path current / the task stays enabled.`,
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
