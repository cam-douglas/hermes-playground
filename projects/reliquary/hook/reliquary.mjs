#!/usr/bin/env node
/**
 * Reliquary — vault-latch / relic-case atelier classifier.
 * A reliquary that rejects the overnight session is not a vault.
 * Score the latch or admit the relic never seated.
 *
 *   echo '{"einvalOpen":true,"hardcodedX86Flags":true}' | node reliquary.mjs
 *   node reliquary.mjs ticket.json
 *
 * Idle word is latched (HOLD: vault latched closed; overnight
 * session relic seated in the case; nothing to mourn).
 * Seeded state is vanished / #91433 (EINVAL latch on aarch64;
 * overnight session missing from sidebar plaque while CLI
 * transcript body still exists).
 * NEVER idle as sealed / rebound / dark / spurious / fenced /
 * swept / tolled / mute / honored / discarded / arrested /
 * skipped / indexed / jumped / chocked / rolled / clasped /
 * sprung / drained / hinged / pealed / warded / pooled / cased /
 * aired / sifted / stocked / stationed / marvered / unpinned /
 * rinsed / literal / choked / opened / stalled / fused / forged /
 * attributed.
 *
 * Primary #91433: Desktop Linux ARM64 session registry saves
 * fail with EINVAL because hardcoded x86-64 O_DIRECTORY|O_NOFOLLOW
 * bits mean O_DIRECT on aarch64. Every sidebar persist fails
 * silently. Sessions work in memory, then vanish from the sidebar
 * (and Archived) after restart. CLI transcripts under
 * ~/.claude/projects/ still resume. Last successful local_*.json
 * write 2026-09-01 08:26; failures from 09:07 when embedded
 * runtime updated 2.1.237→2.1.247 (73 EINVAL lines in main.log).
 * Path: mkdirPrivate → ensureStorageDir → writeSessionToDisk.
 * Asks: use runtime require('fs').constants (or skip unsupported
 * bits); surface repeated save failures instead of silent history
 * loss. Claude Desktop 1.40609.0 deb arm64; Ubuntu VM under
 * Parallels on Apple Silicon. Reporter usman1501. Filed
 * 2026-09-02T08:33:26Z. OPEN. Labels: bug, has repro,
 * platform:linux, regression, data-loss, area:desktop.
 *
 * Hypothesis only (NON-BINDING): bundler may have inlined
 * x86-64 O_* numeric literals into the Desktop embed path
 * (constants-browserify-style). Do not claim a root cause in
 * Claude Code source you have not seen beyond the issue's
 * measured repro. Verify against the issue text and discard
 * if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the vault is latched or vanished.
 *
 * NOT Annunciator #91419 (StopFailure false alarms on parent —
 * loud polarity).
 * NOT Caisson #91405 (worktree pool wrong rebind + dirty wipe).
 * NOT Spindle #91402 (startup cleanup deletes live sibling Bash
 * outputs).
 * NOT Knell #91298 (Agent-tool silent child death).
 * NOT Tumbler / Escapement / Geneva / Scotch / Carillon / Pintle /
 * Fibula / Virgule / Riddle / Garner / Postern / Sluice.
 * NOT Reveille / callboard / slype muster-roster ink metaphors
 * (sidebar-list surface — stay off).
 * NOT Fid #88747 / Toggle #91422 / Collet #53940 (Annunciator
 * backups — cousins only).
 * NOT leftover woodworking / mm-slider / millrace / locksmith /
 * campanology / berth clones.
 * Product name stays Reliquary. Do not rename to Annunciator /
 * Caisson / Spindle / Knell / Tumbler / Escapement / Geneva /
 * Scotch / Fibula / Virgule / Riddle / Garner / Pintle /
 * Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew /
 * Hasp / Berth / Bollard / Reveille / Callboard.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "latched",
  "vanished",
  "einval-open",
  "odirect-poison",
  "hardcoded-x86-flags",
  "aarch64-native-ok",
  "sidebar-vanish",
  "cli-resume-survives",
  "seventy-three-einval",
  "runtime-regression",
  "overnight-session-lost",
  "ensure-storage-dir",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "latched";
export const SEEDED_WORD = "vanished";
export const HOLD_VERDICTS = Object.freeze(["latched", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91433;
export const PRIMARY_ISSUES = Object.freeze([91433]);
export const COUSINS = Object.freeze([91409, 88747, 91400, 91392]);
export const COUSIN_ISSUE = 91409;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const BACKUPS = Object.freeze([
  { name: "Jalousie", issue: 87730 },
  { name: "Fairlead", issue: 88423 },
  { name: "Cartouche", issue: 91392 },
]);
export const NOT_PRODUCTS = Object.freeze([
  "annunciator",
  "caisson",
  "spindle",
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
  "berth",
  "bollard",
  "reveille",
  "callboard",
  "fid",
  "toggle",
  "collet",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "berth clones",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91433";
export const TITLE =
  "[BUG] Desktop (Linux ARM64): session registry saves fail with EINVAL — sessions vanish from sidebar on restart";
export const FILED_AT = "2026-09-02T08:33:26Z";
export const UPDATED_AT = "2026-09-02T08:34:41Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "regression",
  "data-loss",
  "area:desktop",
]);
export const REPORTER = "usman1501";
export const VERSION = "2.1.247";
export const LAST_WORKING = "2.1.237";
export const DESKTOP_VERSION = "1.40609.0";
export const PLATFORM = "Linux ARM64";
export const ARCH = "aarch64";
export const ERRNO = -22;
export const ERRNO_CODE = "EINVAL";
export const O_DIRECTORY = "O_DIRECTORY";
export const O_NOFOLLOW = "O_NOFOLLOW";
export const O_DIRECT = "O_DIRECT";
export const X86_O_DIRECTORY = "0o200000";
export const X86_O_NOFOLLOW = "0o400000";
export const EINVAL_LINES = 73;
export const LAST_SUCCESS = "2026-09-01 08:26";
export const FIRST_FAILURE = "2026-09-01 09:07";
export const STORAGE_DIR = "claude-code-sessions";
export const DESKTOP_SESSIONS = "~/.config/Claude/claude-code-sessions";
export const LOCAL_JSON = "local_*.json";
export const CLI_PROJECTS = "~/.claude/projects/";
export const CLI_RESUME = "claude --resume";
export const MKDIR_PRIVATE = "mkdirPrivate";
export const ENSURE_STORAGE_DIR = "ensureStorageDir";
export const WRITE_SESSION_TO_DISK = "writeSessionToDisk";
export const OPEN_FLAGS = "O_RDONLY|O_DIRECTORY|O_NOFOLLOW";
export const FILESYSTEM = "ext4";
export const ASK_RUNTIME_CONSTANTS = "require('fs').constants";
export const HUB_LINE =
  "18:50 reliquary: a reliquary that rejects the overnight session is not a vault. Score the latch or admit the relic never seated.";
export const MARK = "18:50 / hermes catalog #119 / #91433";
export const PHRASE =
  "a reliquary that rejects the overnight session is not a vault. Score the latch or admit the relic never seated.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: bundler may have inlined x86-64 O_* numeric literals into the Desktop embed path (constants-browserify-style). Do not claim a root cause in Claude Code source you have not seen beyond the issue's measured repro. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DESKTOP LINUX ARM64 SESSION REGISTRY SAVES FAIL WITH EINVAL BECAUSE HARDCODED X86 O_DIRECTORY|O_NOFOLLOW BITS MEAN O_DIRECT ON AARCH64; SILENT OVERNIGHT SIDEBAR VANISH / DATA-LOSS; CLI TRANSCRIPT STILL RESUMES; REGRESSION 2.1.237→2.1.247; AREA:DESKTOP. mkdirPrivate → ensureStorageDir → writeSessionToDisk open with O_RDONLY|O_DIRECTORY|O_NOFOLLOW using hardcoded x86-64 flag values. On aarch64, x86-64's O_DIRECTORY (0o200000) is O_DIRECT; open() on a directory returns EINVAL (-22). Native aarch64 flags succeed; 0o200000|0o400000 reproduce EINVAL. Last successful local_*.json 2026-09-01 08:26; failures from 09:07; 73 EINVAL lines. claude --resume still works. Reporter usman1501. Claude Desktop 1.40609.0 deb arm64.";
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "rebound",
  "dark",
  "spurious",
  "fenced",
  "swept",
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
  "marvered",
  "unpinned",
  "rinsed",
  "literal",
  "choked",
  "opened",
  "stalled",
  "fused",
  "forged",
  "attributed",
]);
export const BANNED_NAMES = Object.freeze([
  "Annunciator",
  "Caisson",
  "Spindle",
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
  "Carillon",
  "Postern",
  "Sluice",
  "Berth",
  "Bollard",
  "Reveille",
  "Callboard",
]);
export const FORBIDDEN_UI = Object.freeze([
  "industrial amber annunciator",
  "dry-dock steel caisson",
  "chip-sweep ways",
  "funeral bell rope",
  "pin-tumbler keyway desk",
  "maltese-cross geneva",
  "wagon scotch-block",
  "composing stick case",
  "riddle-sieve mesh",
  "grain loft garner",
  "muster-roster ink",
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

function blankTicket() {
  return {
    seed: "",
    issue: null,
    title: "",
    url: "",
    source: "",
    isolation: "",
    cousin: "",
    vaultLatched: null,
    relicSeated: null,
    einvalOpen: null,
    odirectPoison: null,
    hardcodedX86Flags: null,
    aarch64NativeOk: null,
    sidebarVanish: null,
    cliResumeSurvives: null,
    seventyThreeEinval: null,
    runtimeRegression: null,
    overnightSessionLost: null,
    ensureStorageDir: null,
    writeSessionToDisk: null,
    mkdirPrivate: null,
    hasClearRepro: null,
    errno: null,
    errnoCode: "",
    x86ODirectory: "",
    oDirect: "",
    oNofollow: "",
    oDirectory: "",
    openFlags: "",
    arch: "",
    platform: "",
    version: "",
    lastWorking: "",
    desktopVersion: "",
    reporter: "",
    einvalLines: null,
    lastSuccess: "",
    firstFailure: "",
    storageDir: "",
    localJson: "",
    cliResume: "",
    cliProjects: "",
    desktopSessions: "",
    filesystem: "",
    outputText: "",
  };
}

export function seedLatched() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    vaultLatched: true,
    relicSeated: true,
    einvalOpen: false,
    odirectPoison: false,
    hardcodedX86Flags: false,
    aarch64NativeOk: true,
    sidebarVanish: false,
    cliResumeSurvives: true,
    seventyThreeEinval: false,
    runtimeRegression: false,
    overnightSessionLost: false,
    ensureStorageDir: true,
    writeSessionToDisk: true,
    mkdirPrivate: true,
    hasClearRepro: false,
    errno: 0,
    errnoCode: "",
    x86ODirectory: "",
    oDirect: "",
    oNofollow: O_NOFOLLOW,
    oDirectory: O_DIRECTORY,
    openFlags: OPEN_FLAGS,
    arch: ARCH,
    platform: PLATFORM,
    version: LAST_WORKING,
    lastWorking: LAST_WORKING,
    desktopVersion: DESKTOP_VERSION,
    reporter: "",
    einvalLines: 0,
    lastSuccess: LAST_SUCCESS,
    firstFailure: "",
    storageDir: STORAGE_DIR,
    localJson: LOCAL_JSON,
    cliResume: CLI_RESUME,
    cliProjects: CLI_PROJECTS,
    desktopSessions: DESKTOP_SESSIONS,
    filesystem: FILESYSTEM,
    outputText:
      "latched; vault latched closed; overnight session relic seated in the case; native aarch64 O_DIRECTORY|O_NOFOLLOW succeed; nothing to mourn; idle word latched",
  };
}

export function seedVanished() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    vaultLatched: false,
    relicSeated: false,
    einvalOpen: true,
    odirectPoison: true,
    hardcodedX86Flags: true,
    aarch64NativeOk: true,
    sidebarVanish: true,
    cliResumeSurvives: true,
    seventyThreeEinval: true,
    runtimeRegression: true,
    overnightSessionLost: true,
    ensureStorageDir: true,
    writeSessionToDisk: true,
    mkdirPrivate: true,
    hasClearRepro: true,
    errno: ERRNO,
    errnoCode: ERRNO_CODE,
    x86ODirectory: X86_O_DIRECTORY,
    oDirect: O_DIRECT,
    oNofollow: O_NOFOLLOW,
    oDirectory: O_DIRECTORY,
    openFlags: OPEN_FLAGS,
    arch: ARCH,
    platform: PLATFORM,
    version: VERSION,
    lastWorking: LAST_WORKING,
    desktopVersion: DESKTOP_VERSION,
    reporter: REPORTER,
    einvalLines: EINVAL_LINES,
    lastSuccess: LAST_SUCCESS,
    firstFailure: FIRST_FAILURE,
    storageDir: STORAGE_DIR,
    localJson: LOCAL_JSON,
    cliResume: CLI_RESUME,
    cliProjects: CLI_PROJECTS,
    desktopSessions: DESKTOP_SESSIONS,
    filesystem: FILESYSTEM,
    outputText:
      "vanished; #91433; EINVAL latch on aarch64; overnight session missing from sidebar plaque while CLI transcript body still exists; hardcoded x86-64 O_DIRECTORY|O_NOFOLLOW (0o200000|0o400000) mean O_DIRECT; open() EINVAL (-22); mkdirPrivate → ensureStorageDir → writeSessionToDisk; 73 EINVAL lines; runtime 2.1.237→2.1.247; claude --resume still works; usman1501; Linux ARM64; data-loss; area:desktop",
  };
}

export function seedEinvalOpen() {
  return {
    ...blankTicket(),
    seed: "einval-open",
    source: "atelier",
    einvalOpen: true,
    errno: ERRNO,
    errnoCode: ERRNO_CODE,
    outputText:
      "einval-open; EINVAL: invalid argument, open claude-code-sessions; errno -22",
  };
}

export function seedOdirectPoison() {
  return {
    ...blankTicket(),
    seed: "odirect-poison",
    source: "atelier",
    odirectPoison: true,
    x86ODirectory: X86_O_DIRECTORY,
    oDirect: O_DIRECT,
    oDirectory: O_DIRECTORY,
    outputText:
      "odirect-poison; on aarch64, x86-64 O_DIRECTORY (0o200000) is O_DIRECT",
  };
}

export function seedHardcodedX86Flags() {
  return {
    ...blankTicket(),
    seed: "hardcoded-x86-flags",
    source: "atelier",
    hardcodedX86Flags: true,
    openFlags: OPEN_FLAGS,
    x86ODirectory: X86_O_DIRECTORY,
    oNofollow: O_NOFOLLOW,
    outputText:
      "hardcoded-x86-flags; bundler shim / constants-browserify-style hardcodes x86-64 O_DIRECTORY|O_NOFOLLOW instead of runtime fs.constants",
  };
}

export function seedAarch64NativeOk() {
  return {
    ...blankTicket(),
    seed: "aarch64-native-ok",
    source: "atelier",
    aarch64NativeOk: true,
    arch: ARCH,
    openFlags: OPEN_FLAGS,
    outputText:
      "aarch64-native-ok; native aarch64 os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW succeeds on the storage directory",
  };
}

export function seedSidebarVanish() {
  return {
    ...blankTicket(),
    seed: "sidebar-vanish",
    source: "atelier",
    sidebarVanish: true,
    relicSeated: false,
    outputText:
      "sidebar-vanish; after quit/reopen the session is gone from the sidebar and Archived",
  };
}

export function seedCliResumeSurvives() {
  return {
    ...blankTicket(),
    seed: "cli-resume-survives",
    source: "atelier",
    cliResumeSurvives: true,
    cliResume: CLI_RESUME,
    cliProjects: CLI_PROJECTS,
    outputText:
      "cli-resume-survives; CLI transcripts under ~/.claude/projects/ still resume with claude --resume",
  };
}

export function seedSeventyThreeEinval() {
  return {
    ...blankTicket(),
    seed: "seventy-three-einval",
    source: "atelier",
    seventyThreeEinval: true,
    einvalLines: EINVAL_LINES,
    errnoCode: ERRNO_CODE,
    outputText:
      "seventy-three-einval; 73 EINVAL lines in ~/.config/Claude/logs/main.log since the update",
  };
}

export function seedRuntimeRegression() {
  return {
    ...blankTicket(),
    seed: "runtime-regression",
    source: "atelier",
    runtimeRegression: true,
    version: VERSION,
    lastWorking: LAST_WORKING,
    lastSuccess: LAST_SUCCESS,
    firstFailure: FIRST_FAILURE,
    outputText:
      "runtime-regression; last successful local_*.json 2026-09-01 08:26; failures from 09:07; embedded runtime 2.1.237→2.1.247",
  };
}

export function seedOvernightSessionLost() {
  return {
    ...blankTicket(),
    seed: "overnight-session-lost",
    source: "atelier",
    overnightSessionLost: true,
    sidebarVanish: true,
    outputText:
      "overnight-session-lost; author lost a full overnight working session from the sidebar; silent history loss",
  };
}

export function seedEnsureStorageDir() {
  return {
    ...blankTicket(),
    seed: "ensure-storage-dir",
    source: "atelier",
    ensureStorageDir: true,
    writeSessionToDisk: true,
    mkdirPrivate: true,
    outputText:
      "ensure-storage-dir; mkdirPrivate → ensureStorageDir → writeSessionToDisk open of claude-code-sessions",
  };
}

export function seedHasClearRepro() {
  return {
    ...blankTicket(),
    seed: "has-clear-repro",
    source: "atelier",
    hasClearRepro: true,
    issue: FEATURED_ISSUE,
    reporter: REPORTER,
    version: VERSION,
    platform: PLATFORM,
    arch: ARCH,
    outputText:
      "has-clear-repro; usman1501 filed #91433; has repro; Linux ARM64; aarch64; data-loss; area:desktop; 0o200000|0o400000 reproduce EINVAL",
  };
}

export function seedHold() {
  return {
    ...seedLatched(),
    seed: "hold",
    outputText:
      "hold; vault latched closed; overnight session relic seated in the case; the reliquary holds",
  };
}

export function seedCousin() {
  return {
    ...seedLatched(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #91409 Windows junction AppData silent state loss — cite only, not the #91433 aarch64 EINVAL latch",
  };
}

export function emptyTicket() {
  return seedLatched();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    vaultLatched: firstBool(nested.vaultLatched, src.vaultLatched),
    relicSeated: firstBool(nested.relicSeated, src.relicSeated),
    einvalOpen: firstBool(nested.einvalOpen, src.einvalOpen),
    odirectPoison: firstBool(nested.odirectPoison, src.odirectPoison),
    hardcodedX86Flags: firstBool(
      nested.hardcodedX86Flags,
      src.hardcodedX86Flags,
    ),
    aarch64NativeOk: firstBool(nested.aarch64NativeOk, src.aarch64NativeOk),
    sidebarVanish: firstBool(nested.sidebarVanish, src.sidebarVanish),
    cliResumeSurvives: firstBool(
      nested.cliResumeSurvives,
      src.cliResumeSurvives,
    ),
    seventyThreeEinval: firstBool(
      nested.seventyThreeEinval,
      src.seventyThreeEinval,
    ),
    runtimeRegression: firstBool(
      nested.runtimeRegression,
      src.runtimeRegression,
    ),
    overnightSessionLost: firstBool(
      nested.overnightSessionLost,
      src.overnightSessionLost,
    ),
    ensureStorageDir: firstBool(nested.ensureStorageDir, src.ensureStorageDir),
    writeSessionToDisk: firstBool(
      nested.writeSessionToDisk,
      src.writeSessionToDisk,
    ),
    mkdirPrivate: firstBool(nested.mkdirPrivate, src.mkdirPrivate),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    errno: firstNum(nested.errno, src.errno),
    errnoCode: firstText(nested.errnoCode, src.errnoCode),
    x86ODirectory: firstText(nested.x86ODirectory, src.x86ODirectory),
    oDirect: firstText(nested.oDirect, src.oDirect),
    oNofollow: firstText(nested.oNofollow, src.oNofollow),
    oDirectory: firstText(nested.oDirectory, src.oDirectory),
    openFlags: firstText(nested.openFlags, src.openFlags),
    arch: firstText(nested.arch, src.arch),
    platform: firstText(nested.platform, src.platform),
    version: firstText(nested.version, src.version),
    lastWorking: firstText(nested.lastWorking, src.lastWorking),
    desktopVersion: firstText(nested.desktopVersion, src.desktopVersion),
    reporter: firstText(nested.reporter, src.reporter),
    einvalLines: firstNum(nested.einvalLines, src.einvalLines),
    lastSuccess: firstText(nested.lastSuccess, src.lastSuccess),
    firstFailure: firstText(nested.firstFailure, src.firstFailure),
    storageDir: firstText(nested.storageDir, src.storageDir),
    localJson: firstText(nested.localJson, src.localJson),
    cliResume: firstText(nested.cliResume, src.cliResume),
    cliProjects: firstText(nested.cliProjects, src.cliProjects),
    desktopSessions: firstText(nested.desktopSessions, src.desktopSessions),
    filesystem: firstText(nested.filesystem, src.filesystem),
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
    row.vaultLatched == null &&
    row.relicSeated == null &&
    row.einvalOpen == null &&
    row.odirectPoison == null &&
    row.hardcodedX86Flags == null &&
    row.sidebarVanish == null &&
    row.overnightSessionLost == null &&
    row.runtimeRegression == null &&
    row.seventyThreeEinval == null &&
    row.ensureStorageDir == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedLatched,
  [SEEDED_WORD]: seedVanished,
  "einval-open": seedEinvalOpen,
  "odirect-poison": seedOdirectPoison,
  "hardcoded-x86-flags": seedHardcodedX86Flags,
  "aarch64-native-ok": seedAarch64NativeOk,
  "sidebar-vanish": seedSidebarVanish,
  "cli-resume-survives": seedCliResumeSurvives,
  "seventy-three-einval": seedSeventyThreeEinval,
  "runtime-regression": seedRuntimeRegression,
  "overnight-session-lost": seedOvernightSessionLost,
  "ensure-storage-dir": seedEnsureStorageDir,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  91409: seedCousin,
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
    return { ...seedVanished(), ...cloned, ...raw };
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
    ticket.reporter,
    ticket.version,
    ticket.platform,
    ticket.arch,
    ticket.errnoCode,
    ticket.x86ODirectory,
    ticket.oDirect,
    ticket.storageDir,
    ticket.cliResume,
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

export function isLatched(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.vaultLatched === true &&
    row.relicSeated === true &&
    row.einvalOpen !== true &&
    row.sidebarVanish !== true &&
    row.overnightSessionLost !== true &&
    row.hardcodedX86Flags !== true
  ) {
    return true;
  }
  return false;
}

export function isVanished(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.einvalOpen === true && row.hardcodedX86Flags === true) ||
    (row.sidebarVanish === true && row.overnightSessionLost === true) ||
    (row.einvalOpen === true &&
      (row.errno === ERRNO || row.errnoCode === ERRNO_CODE) &&
      row.odirectPoison === true)
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
      /cousin-not-primary|#91409|#88747|#91400|#91392/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const vanishedNow = !cousinOnly && isVanished(row);
  const latchedNow = !vanishedNow && isLatched(row);
  const einvalOpen =
    row.einvalOpen === true ||
    row.errno === ERRNO ||
    named === "einval-open" ||
    /einval-open|EINVAL|errno -22|errno: -22/i.test(text);
  const odirectPoison =
    row.odirectPoison === true ||
    named === "odirect-poison" ||
    /odirect-poison|O_DIRECT|0o200000/i.test(text);
  const hardcodedX86Flags =
    row.hardcodedX86Flags === true ||
    named === "hardcoded-x86-flags" ||
    /hardcoded-x86-flags|hardcoded x86|constants-browserify|fs\.constants/i.test(
      text,
    );
  const aarch64NativeOk =
    row.aarch64NativeOk === true ||
    named === "aarch64-native-ok" ||
    /aarch64-native-ok|native aarch64/i.test(text);
  const sidebarVanish =
    row.sidebarVanish === true ||
    named === "sidebar-vanish" ||
    /sidebar-vanish|vanish from the sidebar|gone from the sidebar/i.test(text);
  const cliResumeSurvives =
    row.cliResumeSurvives === true ||
    named === "cli-resume-survives" ||
    /cli-resume-survives|claude --resume|~\/\.claude\/projects/i.test(text);
  const seventyThreeEinval =
    row.seventyThreeEinval === true ||
    row.einvalLines === EINVAL_LINES ||
    named === "seventy-three-einval" ||
    /seventy-three-einval|73 EINVAL/i.test(text);
  const runtimeRegression =
    row.runtimeRegression === true ||
    named === "runtime-regression" ||
    /runtime-regression|2\.1\.237|2\.1\.247|08:26|09:07/i.test(text);
  const overnightSessionLost =
    row.overnightSessionLost === true ||
    named === "overnight-session-lost" ||
    /overnight-session-lost|overnight working session|overnight session/i.test(
      text,
    );
  const ensureStorageDir =
    row.ensureStorageDir === true ||
    row.writeSessionToDisk === true ||
    row.mkdirPrivate === true ||
    named === "ensure-storage-dir" ||
    /ensure-storage-dir|ensureStorageDir|writeSessionToDisk|mkdirPrivate/i.test(
      text,
    );
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|usman1501|has repro|Linux ARM64|area:desktop/i.test(text);
  const vanished =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (vanishedNow || named === SEEDED_WORD || /vanished|#91433/i.test(text));
  const latched =
    named === IDLE_WORD || named === "hold" || (latchedNow && !vanished);
  return {
    named,
    cousinOnly,
    vanishedNow,
    latchedNow,
    einvalOpen,
    odirectPoison,
    hardcodedX86Flags,
    aarch64NativeOk,
    sidebarVanish,
    cliResumeSurvives,
    seventyThreeEinval,
    runtimeRegression,
    overnightSessionLost,
    ensureStorageDir,
    hasClearRepro,
    vanished,
    latched,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.latched && !flags.vanished) chips.push("latched");
  if (flags.vanished) chips.push("vanished");
  if (flags.einvalOpen && flags.vanished) chips.push("einval-open");
  if (flags.odirectPoison && flags.vanished) chips.push("odirect-poison");
  if (flags.hardcodedX86Flags && flags.vanished) {
    chips.push("hardcoded-x86-flags");
  }
  if (flags.aarch64NativeOk && flags.vanished) chips.push("aarch64-native-ok");
  if (flags.sidebarVanish && flags.vanished) chips.push("sidebar-vanish");
  if (flags.cliResumeSurvives && flags.vanished) {
    chips.push("cli-resume-survives");
  }
  if (flags.seventyThreeEinval && flags.vanished) {
    chips.push("seventy-three-einval");
  }
  if (flags.runtimeRegression && flags.vanished) {
    chips.push("runtime-regression");
  }
  if (flags.overnightSessionLost && flags.vanished) {
    chips.push("overnight-session-lost");
  }
  if (flags.ensureStorageDir && flags.vanished) chips.push("ensure-storage-dir");
  if (flags.hasClearRepro && flags.vanished) chips.push("has-clear-repro");
  if ((flags.latched || flags.named === "hold") && !flags.vanished) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "latched") {
    reasons.push(
      "latched; vault latched closed; overnight session relic seated in the case; nothing to mourn",
    );
    reasons.push(
      "hold: the reliquary latches each Desktop sidebar session under claude-code-sessions; native aarch64 flags succeed",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; vault latched closed; overnight session relic seated in the case; the reliquary holds",
    );
  }
  if (verdict === "vanished" || flags.vanished) {
    reasons.push(
      "vanished; #91433; EINVAL latch on aarch64; overnight session missing from sidebar plaque while CLI transcript body still exists",
    );
  }
  if (flags.einvalOpen || verdict === "einval-open") {
    reasons.push(
      "einval-open; EINVAL: invalid argument, open claude-code-sessions; errno -22",
    );
  }
  if (flags.odirectPoison || verdict === "odirect-poison") {
    reasons.push(
      "odirect-poison; on aarch64, x86-64 O_DIRECTORY (0o200000) is O_DIRECT; open() on a directory with O_DIRECT returns EINVAL (-22)",
    );
  }
  if (flags.hardcodedX86Flags || verdict === "hardcoded-x86-flags") {
    reasons.push(
      "hardcoded-x86-flags; storage-dir verification opens with hardcoded x86-64 O_DIRECTORY|O_NOFOLLOW bit values, not runtime fs.constants",
    );
  }
  if (flags.aarch64NativeOk || verdict === "aarch64-native-ok") {
    reasons.push(
      "aarch64-native-ok; native aarch64 O_RDONLY|O_DIRECTORY|O_NOFOLLOW succeed; 0o200000|0o400000 reproduce EINVAL",
    );
  }
  if (flags.sidebarVanish || verdict === "sidebar-vanish") {
    reasons.push(
      "sidebar-vanish; sessions work in memory then vanish from the sidebar and Archived after restart",
    );
  }
  if (flags.cliResumeSurvives || verdict === "cli-resume-survives") {
    reasons.push(
      "cli-resume-survives; CLI transcripts under ~/.claude/projects/ still resume with claude --resume",
    );
  }
  if (flags.seventyThreeEinval || verdict === "seventy-three-einval") {
    reasons.push(
      "seventy-three-einval; 73 EINVAL lines in main.log since the embedded runtime update",
    );
  }
  if (flags.runtimeRegression || verdict === "runtime-regression") {
    reasons.push(
      "runtime-regression; last successful local_*.json 2026-09-01 08:26; failures from 09:07; runtime 2.1.237→2.1.247",
    );
  }
  if (flags.overnightSessionLost || verdict === "overnight-session-lost") {
    reasons.push(
      "overnight-session-lost; author lost a full overnight working session from the sidebar; silent history loss",
    );
  }
  if (flags.ensureStorageDir || verdict === "ensure-storage-dir") {
    reasons.push(
      "ensure-storage-dir; mkdirPrivate → ensureStorageDir → writeSessionToDisk open of ~/.config/Claude/claude-code-sessions",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; ${PLATFORM}; ${ARCH}; ${ERRNO_CODE} ${ERRNO}; runtime ${LAST_WORKING}→${VERSION}; data-loss; area:desktop`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Reliquary; cite-only #91409 Windows junction AppData / #88747 absolute core.hooksPath / #91400 scheduled-task process leak / #91392 three independently-generated names, not the #91433 aarch64 EINVAL latch",
    );
  }
  if (verdict === "vanished" || flags.vanished) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "latched" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.latched || !flags.vanished)) return "latched";
  if (named === "hold" && !flags.vanished) return "hold";
  if (named === SEEDED_WORD) return "vanished";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "latched";
  if (flags.vanished) return "vanished";
  if (flags.latched) return "latched";
  return "latched";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "vanished" || flags.vanished) {
    return {
      case: "vanished — relic plaque empty after the overnight",
      rope: "EINVAL (-22) latch on aarch64; 0o200000 is O_DIRECT poison",
      clapper: `73 EINVAL · ${LAST_WORKING}→${VERSION} · ${LAST_SUCCESS} then ${FIRST_FAILURE}`,
      chamber: "sidebar plaque empty; CLI transcript body still under ~/.claude/projects/",
      mark: "reliquary rejected the overnight session; admit the relic never seated",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "latched — vault latched closed; relic seated",
      rope: "native aarch64 O_DIRECTORY|O_NOFOLLOW; no EINVAL",
      clapper: "local_*.json writes; sidebar plaque holds the overnight relic",
      chamber: "the reliquary holds; nothing to mourn",
      mark: "vault latched; the reliquary holds",
      note: "Hold: the reliquary is latched.",
    };
  }
  return {
    case: "latched — vault latched closed; relic seated",
    rope: "runtime fs.constants; aarch64 bits match the machine",
    clapper: "ensureStorageDir opens the case; writeSessionToDisk seats the relic",
    chamber: "brass latch quiet; atelier latched",
    mark: "vault latched; idle word latched",
    note: "Latched: the reliquary holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const vanished = verdict === "vanished" || flags.vanished;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    latched: verdict === "latched" || (flags.latched && !vanished),
    vanished,
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
  if (name === SEEDED_WORD || name === 91433 || name === "91433") {
    return analyze(seedVanished());
  }
  if (name === "einval-open" || name === "einval") {
    return analyze(seedEinvalOpen());
  }
  if (name === "odirect-poison" || name === "odirect") {
    return analyze(seedOdirectPoison());
  }
  if (name === "hardcoded-x86-flags") {
    return analyze(seedHardcodedX86Flags());
  }
  if (name === "aarch64-native-ok") return analyze(seedAarch64NativeOk());
  if (name === "sidebar-vanish") return analyze(seedSidebarVanish());
  if (name === "cli-resume-survives") return analyze(seedCliResumeSurvives());
  if (name === "seventy-three-einval") {
    return analyze(seedSeventyThreeEinval());
  }
  if (name === "runtime-regression" || name === "runtime-2.1.247") {
    return analyze(seedRuntimeRegression());
  }
  if (name === "overnight-session-lost") {
    return analyze(seedOvernightSessionLost());
  }
  if (name === "ensure-storage-dir") return analyze(seedEnsureStorageDir());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "latched" || name === "open") {
    return analyze(seedLatched());
  }
  if (
    name === 91409 ||
    name === "91409" ||
    name === "cousin" ||
    name === 88747 ||
    name === "88747" ||
    name === 91400 ||
    name === "91400" ||
    name === 91392 ||
    name === "91392"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedLatched());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "vanished" || (result.vanished && result.alarm)
          ? `vanished reliquary #${FEATURED_ISSUE}: EINVAL latch on aarch64; overnight session missing from sidebar while CLI transcript still resumes. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Vault latched closed; overnight session relic seated in the case. Latch the vault."
            : `latched reliquary. Idle word ${IDLE_WORD}. Vault latched closed; overnight session relic seated; nothing to mourn.`,
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
