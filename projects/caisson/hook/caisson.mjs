#!/usr/bin/env node
/**
 * Caisson — dry-dock caisson / worktree-pool berth atelier classifier.
 * A caisson that reseats the wrong hull is not a hold.
 * Score the seal or admit rebound.
 *
 *   echo '{"wrongWorktree":true,"chipRelaunch":true}' | node caisson.mjs
 *   node caisson.mjs ticket.json
 *
 * Idle word is sealed (HOLD: relaunch bound to correct branch-named
 * cradle; dirty cradles never power-washed to pool).
 * Seeded state is rebound / #91405 (`rebindWorktree` to wrong slot;
 * Reset dirty wipe; 95.5% wrong berth).
 * NEVER idle as fenced / swept / tolled / mute / honored / discarded /
 * arrested / skipped / indexed / jumped / chocked / rolled / clasped /
 * sprung / drained / hinged / pealed / warded / pooled / cased / aired /
 * sifted / stocked / stationed / marvered / unpinned / rinsed / literal /
 * choked / opened / stalled / fused / forged / attributed.
 *
 * Primary #91405: Desktop app automatic worktree feature; ~44 pooled
 * worktrees; multiple parallel sessions on one repository. Reopen from
 * a background-task chip (“continue this work”) places the session in
 * a worktree that does not correspond to the work it was given.
 * Session identity and title always correct — only the working
 * directory is wrong. Measured 42/44 (95.5%) wrong; example expected
 * clever-rosalind-ef53a2 vs actual elegant-euler-7d5da0. 11/44 sessions
 * have transcript written into two different project directories
 * (pre- and post-relocation fingerprint). Data loss when pool resets
 * a dirty worktree (`[WorktreePool] Reset dirty worktree … to clean
 * for pooling`) — uncommitted files destroyed, unrecoverable.
 * Mid-use reassignment observed (worktree repointed during a
 * 24-minute test run). Mechanism: on close, Cleaning up / unregister
 * then still Releases to pool; later `[rebindWorktree] Rebound` often
 * without fresh `git worktree add`; folder may lack `.git` → fall
 * through to shared root → self-perpetuating; newer variant does real
 * `git worktree add` but wrong branch. Windows aggravator: cleanup
 * fails partway when preview server/terminal holds files open.
 * Ask: bind reopened session to branch (unique/stable), not recycled
 * folder path; never reset dirty worktree to pool — refuse recycle
 * or preserve first. Claude Code Desktop / Windows 11. Reporter
 * IT-RT. Filed 2026-09-02T06:21:58Z. OPEN. Labels: bug, has repro,
 * platform:windows, area:core, data-loss, area:desktop.
 *
 * Hypothesis only (NON-BINDING): pool may key relaunch by recycled
 * folder slot rather than branch identity, and may treat “dirty” as
 * “safe to wipe for reuse.” Do not claim a root cause in Claude Code
 * source you have not seen. Verify against the issue text and discard
 * if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the caisson is sealed or rebound.
 *
 * NOT Spindle #91402 (startup cleanup deletes live sibling Bash task
 * outputs under shared temp — cite as stay-off).
 * NOT Knell #91298 (Agent-tool custom child silent death after
 * Spawned successfully).
 * NOT Tumbler #74256 (PermissionRequest ExitPlanMode allow discarded).
 * NOT Escapement #91371 / #91400 (scheduled-task process lifecycle).
 * NOT Geneva #91296 / Scotch #91324 / Carillon / Pintle / Fibula /
 * Virgule / Riddle / Garner / Postern / Sluice.
 * NOT Clew (sandbox ARG_MAX) / Hasp (path lease).
 * NOT Berth / Bollard catalog entries (different products — do not
 * clone their UI even though nautical).
 * NOT Sapper #89251 (PreToolUse Bash write steer — deferred backup).
 * NOT Quire #91284 / Shear #79879 / Moniker #90153 (Spindle backups —
 * do not auto-pick).
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick / geneva-drive / escapement / locksmith /
 * campanology / spindle chip-sweep.
 * Product name stays Caisson. Do not rename to Berth / Bollard /
 * Cradle / Gate / Hull / Spindle / Knell / Tumbler / Escapement /
 * Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle /
 * Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sealed",
  "rebound",
  "wrong-worktree",
  "dirty-reset-wipe",
  "rebind-without-add",
  "dual-transcript-path",
  "chip-relaunch",
  "branch-bind",
  "folder-slot-recycle",
  "windows-file-lock",
  "has-clear-repro",
  "data-loss",
  "hold",
]);
export const IDLE_WORD = "sealed";
export const SEEDED_WORD = "rebound";
export const HOLD_VERDICTS = Object.freeze(["sealed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91405;
export const PRIMARY_ISSUES = Object.freeze([91405]);
export const COUSINS = Object.freeze([79366]);
export const COUSIN_ISSUE = 79366;
export const CROSS_ECOSYSTEM = Object.freeze([
  "openai/codex#42001",
  "openai/codex#42201",
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "sapper",
  "quire",
  "shear",
  "moniker",
  "woodworking",
  "mm-slider",
  "millrace",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "geneva-drive",
  "escapement pallet-fork",
  "locksmith pin-tumbler",
  "campanology",
  "spindle chip-sweep",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91405";
export const TITLE =
  "Worktree pool assigns relaunched sessions to the wrong worktree (95% of sessions measured), and can discard uncommitted work";
export const FILED_AT = "2026-09-02T06:21:58Z";
export const UPDATED_AT = "2026-09-02T06:23:03Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
  "data-loss",
  "area:desktop",
]);
export const REPORTER = "IT-RT";
export const VERSION = "Claude Code Desktop";
export const PLATFORM = "Windows 11";
export const MEASURED_WRONG = 42;
export const MEASURED_TOTAL = 44;
export const MEASURED_RATE = "95.5%";
export const TRANSCRIPT_COUNT = 1764;
export const POOLED_WORKTREES = 44;
export const DUAL_PATH_COUNT = 11;
export const EXPECTED_WORKTREE = "clever-rosalind-ef53a2";
export const ACTUAL_WORKTREE = "elegant-euler-7d5da0";
export const REBIND_TOKEN = "rebindWorktree";
export const RESET_DIRTY_TOKEN = "Reset dirty worktree";
export const BACKGROUND_TASK_CHIP = "background-task chip";
export const CONTINUE_THIS_WORK = "continue this work";
export const MID_USE_MINUTES = 24;
export const HUB_LINE =
  "16:50 caisson: a caisson that reseats the wrong hull is not a hold. Score the seal or admit rebound.";
export const MARK = "16:50 / hermes catalog #117 / #91405";
export const PHRASE =
  "a caisson that reseats the wrong hull is not a hold. Score the seal or admit rebound.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: pool may key relaunch by recycled folder slot rather than branch identity, and may treat “dirty” as “safe to wipe for reuse.” Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DESKTOP WORKTREE POOL ASSIGNS CHIP-RELAUNCHED SESSIONS TO THE WRONG WORKTREE (95.5% MEASURED) AND CAN RESET DIRTY WORKTREES DESTROYING UNCOMMITTED WORK; TITLE CORRECT / CWD WRONG; rebindWorktree; data-loss; WINDOWS DESKTOP. Desktop automatic worktree feature; ~44 pooled worktrees; multiple parallel sessions on one repository. Reopen from a background-task chip (“continue this work”) places the session in a worktree that does not correspond to the work it was given. Session identity and title always correct — only the working directory is wrong. Measured 42/44 (95.5%) wrong across 1,764 transcripts; example expected clever-rosalind-ef53a2 vs actual elegant-euler-7d5da0. 11/44 sessions have transcript written into two different project directories (pre- and post-relocation fingerprint). Data loss when pool resets a dirty worktree ([WorktreePool] Reset dirty worktree … to clean for pooling) — uncommitted files destroyed, unrecoverable. Mid-use reassignment observed (worktree repointed during a 24-minute test run). Mechanism: on close, Cleaning up / unregister then still Releases to pool; later [rebindWorktree] Rebound often without fresh git worktree add; folder may lack .git → fall through to shared root → self-perpetuating; newer variant does real git worktree add but wrong branch. Windows aggravator: cleanup fails partway when preview server/terminal holds files open. Ask: bind reopened session to branch (unique/stable), not recycled folder path; never reset dirty worktree to pool — refuse recycle or preserve first. Claude Code Desktop / Windows 11. Reporter IT-RT, 2026-09-02T06:21:58Z. Labels: bug, has repro, platform:windows, area:core, data-loss, area:desktop. NOT Spindle #91402 (startup cleanup deletes live sibling Bash task outputs under shared temp). NOT Knell #91298. NOT Tumbler #74256. NOT Escapement #91371 / #91400. NOT Geneva / Scotch / Carillon / Pintle / Fibula / Virgule / Riddle / Garner / Postern / Sluice. NOT Clew / Hasp. NOT Berth / Bollard catalog entries. NOT Sapper #89251. NOT Quire #91284 / Shear #79879 / Moniker #90153. NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / escapement / locksmith / campanology / spindle chip-sweep. Product name stays Caisson.";
export const FORBIDDEN_IDLE = Object.freeze([
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
  "Berth",
  "Bollard",
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
  "Postern",
  "Carillon",
  "Sluice",
  "Alidade",
  "Cockade",
  "Lye",
  "Clew",
  "Hasp",
  "Sapper",
  "Quire",
  "Shear",
  "Moniker",
]);
export const FORBIDDEN_UI = Object.freeze([
  "shared ways",
  "headstock",
  "swarf pile",
  "oak belfry",
  "funeral-bell",
  "untolled rope",
  "pin-tumbler",
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
  "woodworking",
  "mm-slider",
  "postern-gate",
  "night bailey",
  "rudder pintle",
  "gudgeon",
  "timber scotch",
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
  "mourning ribbon",
  "bollard bitts",
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
    branchBound: null,
    dirtyCradlePreserved: null,
    correctCradle: null,
    wrongWorktree: null,
    dirtyResetWipe: null,
    rebindWithoutAdd: null,
    dualTranscriptPath: null,
    chipRelaunch: null,
    branchBindAsk: null,
    folderSlotRecycle: null,
    windowsFileLock: null,
    hasClearRepro: null,
    dataLoss: null,
    titleCorrect: null,
    cwdWrong: null,
    rebindWorktree: null,
    gitWorktreeAdd: null,
    missingGit: null,
    fallThroughRoot: null,
    midUseReassignment: null,
    uncommittedDestroyed: null,
    backgroundTaskChip: null,
    continueThisWork: null,
    measuredWrong: null,
    measuredTotal: null,
    measuredRate: "",
    transcriptCount: null,
    pooledWorktrees: null,
    dualPathCount: null,
    expectedWorktree: "",
    actualWorktree: "",
    version: "",
    platform: "",
    reporter: "",
    cousin: "",
    outputText: "",
  };
}

export function seedSealed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    branchBound: true,
    dirtyCradlePreserved: true,
    correctCradle: true,
    wrongWorktree: false,
    dirtyResetWipe: false,
    rebindWithoutAdd: false,
    dualTranscriptPath: false,
    chipRelaunch: true,
    branchBindAsk: true,
    folderSlotRecycle: false,
    windowsFileLock: false,
    hasClearRepro: false,
    dataLoss: false,
    titleCorrect: true,
    cwdWrong: false,
    rebindWorktree: false,
    gitWorktreeAdd: true,
    missingGit: false,
    fallThroughRoot: false,
    midUseReassignment: false,
    uncommittedDestroyed: false,
    backgroundTaskChip: true,
    continueThisWork: true,
    measuredWrong: 0,
    measuredTotal: MEASURED_TOTAL,
    measuredRate: "",
    transcriptCount: TRANSCRIPT_COUNT,
    pooledWorktrees: POOLED_WORKTREES,
    dualPathCount: 0,
    expectedWorktree: EXPECTED_WORKTREE,
    actualWorktree: EXPECTED_WORKTREE,
    version: VERSION,
    platform: PLATFORM,
    reporter: "",
    cousin: "",
    outputText:
      "sealed; relaunch bound to correct branch-named cradle; dirty cradles never power-washed to pool; title and cwd both match; idle word sealed",
  };
}

export function seedRebound() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    branchBound: false,
    dirtyCradlePreserved: false,
    correctCradle: false,
    wrongWorktree: true,
    dirtyResetWipe: true,
    rebindWithoutAdd: true,
    dualTranscriptPath: true,
    chipRelaunch: true,
    branchBindAsk: true,
    folderSlotRecycle: true,
    windowsFileLock: true,
    hasClearRepro: true,
    dataLoss: true,
    titleCorrect: true,
    cwdWrong: true,
    rebindWorktree: true,
    gitWorktreeAdd: false,
    missingGit: true,
    fallThroughRoot: true,
    midUseReassignment: true,
    uncommittedDestroyed: true,
    backgroundTaskChip: true,
    continueThisWork: true,
    measuredWrong: MEASURED_WRONG,
    measuredTotal: MEASURED_TOTAL,
    measuredRate: MEASURED_RATE,
    transcriptCount: TRANSCRIPT_COUNT,
    pooledWorktrees: POOLED_WORKTREES,
    dualPathCount: DUAL_PATH_COUNT,
    expectedWorktree: EXPECTED_WORKTREE,
    actualWorktree: ACTUAL_WORKTREE,
    version: VERSION,
    platform: PLATFORM,
    cousin: "",
    outputText:
      "rebound; #91405; rebindWorktree to wrong slot; Reset dirty worktree to clean for pooling; 42/44 (95.5%) wrong; 1764 transcripts; expected clever-rosalind-ef53a2 vs actual elegant-euler-7d5da0; title correct / cwd wrong; background-task chip; continue this work; dual project directories; Windows 11 Desktop; IT-RT; data-loss",
  };
}

export function seedWrongWorktree() {
  return {
    seed: "wrong-worktree",
    source: "atelier",
    wrongWorktree: true,
    chipRelaunch: true,
    cwdWrong: true,
    titleCorrect: true,
    correctCradle: false,
    hasClearRepro: true,
    expectedWorktree: EXPECTED_WORKTREE,
    actualWorktree: ACTUAL_WORKTREE,
    outputText:
      "wrong-worktree; expected clever-rosalind-ef53a2 vs actual elegant-euler-7d5da0; title correct / cwd wrong",
  };
}

export function seedDirtyResetWipe() {
  return {
    seed: "dirty-reset-wipe",
    source: "atelier",
    dirtyResetWipe: true,
    dataLoss: true,
    uncommittedDestroyed: true,
    dirtyCradlePreserved: false,
    hasClearRepro: true,
    outputText:
      "dirty-reset-wipe; [WorktreePool] Reset dirty worktree … to clean for pooling; uncommitted files destroyed, unrecoverable",
  };
}

export function seedRebindWithoutAdd() {
  return {
    seed: "rebind-without-add",
    source: "atelier",
    rebindWithoutAdd: true,
    rebindWorktree: true,
    gitWorktreeAdd: false,
    missingGit: true,
    fallThroughRoot: true,
    hasClearRepro: true,
    outputText:
      "rebind-without-add; [rebindWorktree] Rebound often without fresh git worktree add; folder may lack .git → fall through to shared root",
  };
}

export function seedDualTranscriptPath() {
  return {
    seed: "dual-transcript-path",
    source: "atelier",
    dualTranscriptPath: true,
    chipRelaunch: true,
    wrongWorktree: true,
    cwdWrong: true,
    hasClearRepro: true,
    dualPathCount: DUAL_PATH_COUNT,
    outputText:
      "dual-transcript-path; 11/44 sessions have transcript written into two different project directories (pre- and post-relocation fingerprint)",
  };
}

export function seedChipRelaunch() {
  return {
    seed: "chip-relaunch",
    source: "atelier",
    chipRelaunch: true,
    backgroundTaskChip: true,
    continueThisWork: true,
    cwdWrong: true,
    titleCorrect: true,
    wrongWorktree: true,
    hasClearRepro: true,
    outputText:
      "chip-relaunch; reopen from a background-task chip (“continue this work”) places the session in a worktree that does not correspond to the work",
  };
}

export function seedBranchBind() {
  return {
    seed: "branch-bind",
    source: "atelier",
    branchBindAsk: true,
    folderSlotRecycle: true,
    branchBound: false,
    hasClearRepro: true,
    outputText:
      "branch-bind; bind a reopened session to its branch (unique/stable), rather than to a worktree folder path, which is a recycled slot",
  };
}

export function seedFolderSlotRecycle() {
  return {
    seed: "folder-slot-recycle",
    source: "atelier",
    folderSlotRecycle: true,
    branchBound: false,
    wrongWorktree: true,
    hasClearRepro: true,
    outputText:
      "folder-slot-recycle; pool reseats by recycled folder path rather than branch identity; contents change",
  };
}

export function seedWindowsFileLock() {
  return {
    seed: "windows-file-lock",
    source: "atelier",
    windowsFileLock: true,
    platform: PLATFORM,
    hasClearRepro: true,
    outputText:
      "windows-file-lock; Windows aggravator: cleanup fails partway when a preview server or terminal holds files open, leaving partially-deleted, unregistered folders behind",
  };
}

export function seedHasClearRepro() {
  return {
    seed: "has-clear-repro",
    source: "atelier",
    hasClearRepro: true,
    wrongWorktree: true,
    chipRelaunch: true,
    cwdWrong: true,
    dirtyResetWipe: true,
    dataLoss: true,
    dualTranscriptPath: true,
    reporter: REPORTER,
    version: VERSION,
    platform: PLATFORM,
    measuredWrong: MEASURED_WRONG,
    measuredTotal: MEASURED_TOTAL,
    measuredRate: MEASURED_RATE,
    transcriptCount: TRANSCRIPT_COUNT,
    outputText:
      "has-clear-repro; IT-RT filed #91405; 42/44 (95.5%); 1764 transcripts; has repro; Claude Code Desktop; Windows 11",
  };
}

export function seedDataLoss() {
  return {
    seed: "data-loss",
    source: "atelier",
    dataLoss: true,
    dirtyResetWipe: true,
    uncommittedDestroyed: true,
    dirtyCradlePreserved: false,
    hasClearRepro: true,
    outputText:
      "data-loss; uncommitted files destroyed, unrecoverable; Reset dirty worktree to clean for pooling; nothing in stash, reflog, or dangling object",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    branchBound: true,
    dirtyCradlePreserved: true,
    correctCradle: true,
    wrongWorktree: false,
    dirtyResetWipe: false,
    rebindWithoutAdd: false,
    dualTranscriptPath: false,
    cwdWrong: false,
    dataLoss: false,
    titleCorrect: true,
    hasClearRepro: false,
    uncommittedDestroyed: false,
    outputText:
      "hold; relaunch bound to correct branch-named cradle; dirty cradles never power-washed to pool; the caisson is sealed",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "79366",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #79366 worktree sessions reuse an existing worktree directory from a previous session — cite only; not the #91405 chip-relaunch wrong-berth rebound",
  };
}

export function emptyTicket() {
  return seedSealed();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.caisson && typeof src.caisson === "object" && src.caisson) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.dock && typeof src.dock === "object" && src.dock) ||
    (src.cradle && typeof src.cradle === "object" && src.cradle) ||
    (src.gate && typeof src.gate === "object" && src.gate) ||
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
    branchBound: firstBool(nested.branchBound, nested.branch_bound, src.branchBound),
    dirtyCradlePreserved: firstBool(
      nested.dirtyCradlePreserved,
      nested.dirty_cradle_preserved,
      src.dirtyCradlePreserved,
    ),
    correctCradle: firstBool(
      nested.correctCradle,
      nested.correct_cradle,
      src.correctCradle,
    ),
    wrongWorktree: firstBool(
      nested.wrongWorktree,
      nested.wrong_worktree,
      src.wrongWorktree,
    ),
    dirtyResetWipe: firstBool(
      nested.dirtyResetWipe,
      nested.dirty_reset_wipe,
      src.dirtyResetWipe,
    ),
    rebindWithoutAdd: firstBool(
      nested.rebindWithoutAdd,
      nested.rebind_without_add,
      src.rebindWithoutAdd,
    ),
    dualTranscriptPath: firstBool(
      nested.dualTranscriptPath,
      nested.dual_transcript_path,
      src.dualTranscriptPath,
    ),
    chipRelaunch: firstBool(
      nested.chipRelaunch,
      nested.chip_relaunch,
      src.chipRelaunch,
    ),
    branchBindAsk: firstBool(
      nested.branchBindAsk,
      nested.branch_bind_ask,
      src.branchBindAsk,
    ),
    folderSlotRecycle: firstBool(
      nested.folderSlotRecycle,
      nested.folder_slot_recycle,
      src.folderSlotRecycle,
    ),
    windowsFileLock: firstBool(
      nested.windowsFileLock,
      nested.windows_file_lock,
      src.windowsFileLock,
    ),
    hasClearRepro: firstBool(
      nested.hasClearRepro,
      nested.has_clear_repro,
      src.hasClearRepro,
    ),
    dataLoss: firstBool(nested.dataLoss, nested.data_loss, src.dataLoss),
    titleCorrect: firstBool(
      nested.titleCorrect,
      nested.title_correct,
      src.titleCorrect,
    ),
    cwdWrong: firstBool(nested.cwdWrong, nested.cwd_wrong, src.cwdWrong),
    rebindWorktree: firstBool(
      nested.rebindWorktree,
      nested.rebind_worktree,
      src.rebindWorktree,
    ),
    gitWorktreeAdd: firstBool(
      nested.gitWorktreeAdd,
      nested.git_worktree_add,
      src.gitWorktreeAdd,
    ),
    missingGit: firstBool(nested.missingGit, nested.missing_git, src.missingGit),
    fallThroughRoot: firstBool(
      nested.fallThroughRoot,
      nested.fall_through_root,
      src.fallThroughRoot,
    ),
    midUseReassignment: firstBool(
      nested.midUseReassignment,
      nested.mid_use_reassignment,
      src.midUseReassignment,
    ),
    uncommittedDestroyed: firstBool(
      nested.uncommittedDestroyed,
      nested.uncommitted_destroyed,
      src.uncommittedDestroyed,
    ),
    backgroundTaskChip: firstBool(
      nested.backgroundTaskChip,
      nested.background_task_chip,
      src.backgroundTaskChip,
    ),
    continueThisWork: firstBool(
      nested.continueThisWork,
      nested.continue_this_work,
      src.continueThisWork,
    ),
    measuredWrong: firstNum(
      nested.measuredWrong,
      nested.measured_wrong,
      src.measuredWrong,
    ),
    measuredTotal: firstNum(
      nested.measuredTotal,
      nested.measured_total,
      src.measuredTotal,
    ),
    measuredRate: firstText(
      nested.measuredRate,
      nested.measured_rate,
      src.measuredRate,
    ),
    transcriptCount: firstNum(
      nested.transcriptCount,
      nested.transcript_count,
      src.transcriptCount,
    ),
    pooledWorktrees: firstNum(
      nested.pooledWorktrees,
      nested.pooled_worktrees,
      src.pooledWorktrees,
    ),
    dualPathCount: firstNum(
      nested.dualPathCount,
      nested.dual_path_count,
      src.dualPathCount,
    ),
    expectedWorktree: firstText(
      nested.expectedWorktree,
      nested.expected_worktree,
      src.expectedWorktree,
    ),
    actualWorktree: firstText(
      nested.actualWorktree,
      nested.actual_worktree,
      src.actualWorktree,
    ),
    version: firstText(nested.version, src.version),
    platform: firstText(nested.platform, src.platform),
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
    row.branchBound == null &&
    row.dirtyCradlePreserved == null &&
    row.correctCradle == null &&
    row.wrongWorktree == null &&
    row.dirtyResetWipe == null &&
    row.rebindWithoutAdd == null &&
    row.dualTranscriptPath == null &&
    row.chipRelaunch == null &&
    row.folderSlotRecycle == null &&
    row.windowsFileLock == null &&
    row.dataLoss == null &&
    row.cwdWrong == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSealed,
  [SEEDED_WORD]: seedRebound,
  "wrong-worktree": seedWrongWorktree,
  "dirty-reset-wipe": seedDirtyResetWipe,
  "rebind-without-add": seedRebindWithoutAdd,
  "dual-transcript-path": seedDualTranscriptPath,
  "chip-relaunch": seedChipRelaunch,
  "branch-bind": seedBranchBind,
  "folder-slot-recycle": seedFolderSlotRecycle,
  "windows-file-lock": seedWindowsFileLock,
  "has-clear-repro": seedHasClearRepro,
  "data-loss": seedDataLoss,
  hold: seedHold,
  cousin: seedCousin,
  79366: seedCousin,
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
    return { ...seedRebound(), ...cloned, ...raw };
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
    ticket.expectedWorktree,
    ticket.actualWorktree,
    ticket.reporter,
    ticket.measuredRate,
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

export function isSealed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.branchBound === true &&
    row.dirtyCradlePreserved === true &&
    row.correctCradle === true &&
    row.wrongWorktree !== true &&
    row.dirtyResetWipe !== true &&
    row.cwdWrong !== true
  ) {
    return true;
  }
  return false;
}

export function isRebound(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.wrongWorktree === true &&
      row.chipRelaunch === true &&
      row.cwdWrong === true) ||
    (row.dirtyResetWipe === true && row.dataLoss === true) ||
    (row.rebindWorktree === true && row.gitWorktreeAdd === false) ||
    row.uncommittedDestroyed === true
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
      /cousin-not-primary|#79366|openai\/codex#42001|openai\/codex#42201|#42001|#42201/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const reboundNow = !cousinOnly && isRebound(row);
  const sealedNow = !reboundNow && isSealed(row);
  const wrongWorktree =
    row.wrongWorktree === true ||
    named === "wrong-worktree" ||
    /wrong-worktree|clever-rosalind|elegant-euler|wrong worktree|cwd wrong/i.test(
      text,
    );
  const dirtyResetWipe =
    row.dirtyResetWipe === true ||
    named === "dirty-reset-wipe" ||
    /dirty-reset-wipe|Reset dirty worktree|to clean for pooling/i.test(text);
  const rebindWithoutAdd =
    row.rebindWithoutAdd === true ||
    named === "rebind-without-add" ||
    /rebind-without-add|rebindWorktree|without fresh git worktree add/i.test(
      text,
    );
  const dualTranscriptPath =
    row.dualTranscriptPath === true ||
    named === "dual-transcript-path" ||
    /dual-transcript-path|two different project directories|pre- and post-relocation/i.test(
      text,
    );
  const chipRelaunch =
    row.chipRelaunch === true ||
    row.backgroundTaskChip === true ||
    named === "chip-relaunch" ||
    /chip-relaunch|background-task chip|continue this work/i.test(text);
  const branchBind =
    row.branchBindAsk === true ||
    named === "branch-bind" ||
    /branch-bind|bind.*branch|branch \(unique\/stable\)|not recycled folder/i.test(
      text,
    );
  const folderSlotRecycle =
    row.folderSlotRecycle === true ||
    named === "folder-slot-recycle" ||
    /folder-slot-recycle|recycled folder|recycled slot/i.test(text);
  const windowsFileLock =
    row.windowsFileLock === true ||
    named === "windows-file-lock" ||
    /windows-file-lock|preview server|holds files open|Windows aggravator/i.test(
      text,
    );
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|IT-RT|42\/44|95\.5%|1764|has repro/i.test(text);
  const dataLoss =
    row.dataLoss === true ||
    row.uncommittedDestroyed === true ||
    named === "data-loss" ||
    /data-loss|uncommitted files destroyed|unrecoverable/i.test(text);
  const rebound =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (reboundNow || named === SEEDED_WORD || /rebound|#91405/i.test(text));
  const sealed =
    named === IDLE_WORD || named === "hold" || (sealedNow && !rebound);
  return {
    named,
    cousinOnly,
    reboundNow,
    sealedNow,
    wrongWorktree,
    dirtyResetWipe,
    rebindWithoutAdd,
    dualTranscriptPath,
    chipRelaunch,
    branchBind,
    folderSlotRecycle,
    windowsFileLock,
    hasClearRepro,
    dataLoss,
    rebound,
    sealed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sealed && !flags.rebound) chips.push("sealed");
  if (flags.rebound) chips.push("rebound");
  if (flags.wrongWorktree && flags.rebound) chips.push("wrong-worktree");
  if (flags.dirtyResetWipe && flags.rebound) chips.push("dirty-reset-wipe");
  if (flags.rebindWithoutAdd && flags.rebound) chips.push("rebind-without-add");
  if (flags.dualTranscriptPath && flags.rebound) {
    chips.push("dual-transcript-path");
  }
  if (flags.chipRelaunch && flags.rebound) chips.push("chip-relaunch");
  if (flags.branchBind && flags.rebound) chips.push("branch-bind");
  if (flags.folderSlotRecycle && flags.rebound) {
    chips.push("folder-slot-recycle");
  }
  if (flags.windowsFileLock && flags.rebound) chips.push("windows-file-lock");
  if (flags.hasClearRepro && flags.rebound) chips.push("has-clear-repro");
  if (flags.dataLoss && flags.rebound) chips.push("data-loss");
  if ((flags.sealed || flags.named === "hold") && !flags.rebound) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sealed") {
    reasons.push(
      "sealed; relaunch bound to correct branch-named cradle; dirty cradles never power-washed to pool",
    );
    reasons.push(
      "hold: the caisson is sealed; score treats a branch-bound cradle with preserved dirty plates as a hold",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; relaunch bound to correct branch-named cradle; dirty cradles never power-washed to pool; the caisson is sealed",
    );
  }
  if (verdict === "rebound" || flags.rebound) {
    reasons.push(
      "rebound; #91405; rebindWorktree to wrong slot; Reset dirty worktree wipe; 42/44 (95.5%) wrong berth",
    );
  }
  if (flags.wrongWorktree || verdict === "wrong-worktree") {
    reasons.push(
      `wrong-worktree; expected ${EXPECTED_WORKTREE} vs actual ${ACTUAL_WORKTREE}; title correct / cwd wrong`,
    );
  }
  if (flags.dirtyResetWipe || verdict === "dirty-reset-wipe") {
    reasons.push(
      "dirty-reset-wipe; [WorktreePool] Reset dirty worktree … to clean for pooling; uncommitted files destroyed",
    );
  }
  if (flags.rebindWithoutAdd || verdict === "rebind-without-add") {
    reasons.push(
      "rebind-without-add; [rebindWorktree] Rebound often without fresh git worktree add; folder may lack .git",
    );
  }
  if (flags.dualTranscriptPath || verdict === "dual-transcript-path") {
    reasons.push(
      "dual-transcript-path; 11/44 sessions have transcript written into two different project directories (pre- and post-relocation fingerprint)",
    );
  }
  if (flags.chipRelaunch || verdict === "chip-relaunch") {
    reasons.push(
      "chip-relaunch; reopen from a background-task chip (“continue this work”) lands in a worktree that does not correspond to the work",
    );
  }
  if (flags.branchBind || verdict === "branch-bind") {
    reasons.push(
      "branch-bind; bind a reopened session to its branch (unique/stable), not a recycled folder path",
    );
  }
  if (flags.folderSlotRecycle || verdict === "folder-slot-recycle") {
    reasons.push(
      "folder-slot-recycle; pool reseats by recycled folder slot rather than branch identity",
    );
  }
  if (flags.windowsFileLock || verdict === "windows-file-lock") {
    reasons.push(
      "windows-file-lock; cleanup fails partway when a preview server or terminal holds files open",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; ${MEASURED_WRONG}/${MEASURED_TOTAL} (${MEASURED_RATE}); ${TRANSCRIPT_COUNT} transcripts; ${VERSION}; ${PLATFORM}`,
    );
  }
  if (flags.dataLoss || verdict === "data-loss") {
    reasons.push(
      "data-loss; uncommitted files destroyed, unrecoverable; nothing in stash, reflog, or dangling object",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Caisson; cite-only #79366 worktree reuse / openai/codex#42001 stale cwd / openai/codex#42201 dirty worktree deploy, not the #91405 chip-relaunch wrong-berth rebound",
    );
  }
  if (verdict === "rebound" || flags.rebound) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "sealed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.sealed || !flags.rebound)) return "sealed";
  if (named === "hold" && !flags.rebound) return "hold";
  if (named === SEEDED_WORD) return "rebound";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "sealed";
  if (flags.rebound) return "rebound";
  if (flags.sealed) return "sealed";
  return "sealed";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "rebound" || flags.rebound) {
    return {
      case: "rebound — hull reseated on a wrong recycled cradle",
      rope: "floating gate open; rebindWorktree without a matching branch",
      clapper: `42/44 · ${MEASURED_RATE} · title correct / cwd wrong`,
      chamber: "dirty-plates wash spray; uncommitted plates gone",
      mark: "caisson reseated the wrong hull; admit rebound",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "sealed — relaunch bound to the correct branch-named cradle",
      rope: "dirty cradles never power-washed to the pool",
      clapper: "title and cwd match · gate closed · plates intact",
      chamber: "dual-path ledger quiet; the caisson is sealed",
      mark: "floating gate closed; the caisson is sealed",
      note: "Hold: the caisson is sealed.",
    };
  }
  return {
    case: "sealed — relaunch bound to the correct branch-named cradle",
    rope: "dirty cradles never power-washed to the pool",
    clapper: "title and cwd match · no Reset dirty wipe",
    chamber: "waterline quiet; atelier sealed",
    mark: "floating gate closed; idle word sealed",
    note: "Sealed: the caisson holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const rebound = verdict === "rebound" || flags.rebound;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sealed: verdict === "sealed" || (flags.sealed && !rebound),
    rebound,
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
  if (name === SEEDED_WORD || name === 91405 || name === "91405") {
    return analyze(seedRebound());
  }
  if (name === "wrong-worktree") return analyze(seedWrongWorktree());
  if (name === "dirty-reset-wipe") return analyze(seedDirtyResetWipe());
  if (name === "rebind-without-add") return analyze(seedRebindWithoutAdd());
  if (name === "dual-transcript-path") return analyze(seedDualTranscriptPath());
  if (name === "chip-relaunch") return analyze(seedChipRelaunch());
  if (name === "branch-bind") return analyze(seedBranchBind());
  if (name === "folder-slot-recycle") return analyze(seedFolderSlotRecycle());
  if (name === "windows-file-lock") return analyze(seedWindowsFileLock());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "data-loss") return analyze(seedDataLoss());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sealed" || name === "open") {
    return analyze(seedSealed());
  }
  if (name === 79366 || name === "79366" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSealed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "rebound" || (result.rebound && result.alarm)
          ? `rebound caisson #${FEATURED_ISSUE}: rebindWorktree reseated the hull on a wrong cradle; Reset dirty wipe. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Relaunch bound to the correct branch-named cradle. Score the seal."
            : `sealed caisson. Idle word ${IDLE_WORD}. Relaunch bound to the correct branch-named cradle; dirty cradles never power-washed to the pool.`,
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
