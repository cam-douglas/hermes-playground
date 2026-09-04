#!/usr/bin/env node
/**
 * Hellbox — letterpress composing-room classifier.
 * A hellbox that melts the standing line when sticky
 * CLAUDE_PROJECT_DIR ENOENT exits 2 is read as deny — it is
 * type already scrapped. Score the form or admit the line
 * already scrapped.
 *
 *   echo '{"enoent":true,"exitCode":2}' | node hellbox.mjs
 *   node hellbox.mjs ticket.json
 *
 * Idle word is set (HOLD: CLAUDE_PROJECT_DIR follows
 * change_directory; UserPromptSubmit resolves; the standing
 * line stays set in the form).
 * Seeded state is scrapped / #92168 (sticky launch pin +
 * ENOENT + exit 2 read as deny + silent erase).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score composing-room fixtures for whether the form held
 * or already scrapped the standing line.
 *
 * Primary #92168: change_directory leaves $CLAUDE_PROJECT_DIR
 * at the launch project, and the resulting ENOENT silently
 * erases every user prompt (exit 2 reads as deny). Reporter
 * Rasherb69 (Lewis Bacon). Filed 2026-09-04T17:30:41Z.
 * OPEN. Labels: bug, has-repro, platform:macos, area:hooks,
 * data-loss. Claude Code 2.1.204. Claude desktop app.
 * macOS 26.5.2 arm64. Node v24.15.0. python3 3.14.5.
 * Shell-form hooks.
 *
 * Hypothesis only (NON-BINDING): change_directory loads the
 * new project's hooks and settings but leaves
 * $CLAUDE_PROJECT_DIR pinned at the launch directory (often
 * a scratch workspace). Newly-adopted UserPromptSubmit hooks
 * resolve under that old path, miss the script (ENOENT),
 * python3/argparse exit 2, and UserPromptSubmit treats exit 2
 * as deny — so the prompt is erased and never reaches the
 * model. SessionStart does not fire on mid-session
 * change_directory, so the pin is never repaired. Discard if
 * issue evidence disagrees. Do not claim Claude Code source
 * you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "set",
  "scrapped",
  "sticky",
  "enoent",
  "exit2",
  "erase",
  "launch-pin",
  "hold",
]);
export const IDLE_WORD = "set";
export const SEEDED_WORD = "scrapped";
export const HOLD_VERDICTS = Object.freeze(["set", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92168;
export const PRIMARY_ISSUES = Object.freeze([92168]);
export const COUSINS = Object.freeze([88830, 81291, 87890]);
export const COUSIN_ISSUE = 88830;
export const DIFFERENT_CLASS = Object.freeze([92074]);
export const BACKUPS = Object.freeze([92171, 92166, 92158]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92168";
export const TITLE =
  "change_directory leaves $CLAUDE_PROJECT_DIR at the launch project, and the resulting ENOENT silently erases every user prompt (exit 2 reads as deny)";
export const FILED_AT = "2026-09-04T17:30:41Z";
export const UPDATED_AT = "2026-09-04T17:32:10Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:hooks",
  "data-loss",
]);
export const REPORTER = "Rasherb69";
export const REPORTER_NAME = "Lewis Bacon";
export const PLATFORM = "macOS 26.5.2 arm64";
export const APP_VERSION = "2.1.204";
export const NODE_VERSION = "v24.15.0";
export const PYTHON_VERSION = "3.14.5";
export const DESKTOP = "Claude desktop app";
export const HOOK_FORM = "shell-form";
export const AREA = "area:hooks";
export const EVIDENCE = "sticky-launch-dir-enoent-exit2-erase";
export const ERASED_COUNT = 4;
export const WINDOW_SECONDS = 33;
export const EXIT_CODE = 2;
export const HOOK_EVENT = "UserPromptSubmit";
export const LAUNCH_DIR = "/scratch/launch-workspace";
export const ADOPTED_DIR = "/adopted/project";
export const HUB_LINE =
  "03:50 hellbox: a hellbox that melts the standing line when sticky CLAUDE_PROJECT_DIR ENOENT exits 2 is read as deny — it is type already scrapped. Score the form or admit the line already scrapped.";
export const MARK = "03:50 / hermes catalog #140 / #92168";
export const PHRASE =
  "Score the form or admit the line already scrapped.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: change_directory loads the new project's hooks and settings but leaves $CLAUDE_PROJECT_DIR pinned at the launch directory (often a scratch workspace). Newly-adopted UserPromptSubmit hooks resolve under that old path, miss the script (ENOENT), python3/argparse exit 2, and UserPromptSubmit treats exit 2 as deny — so the prompt is erased and never reaches the model. SessionStart does not fire on mid-session change_directory, so the pin is never repaired. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is STICKY LAUNCH $CLAUDE_PROJECT_DIR AFTER change_directory, THEN USERPROMPTSUBMIT ENOENT EXIT 2 READ AS DENY, SILENT PROMPT ERASE on Claude Code 2.1.204 in the Claude desktop app. macOS 26.5.2 arm64. Node v24.15.0. python3 3.14.5. Shell-form hooks. change_directory loads new project hooks/settings but does not repoint $CLAUDE_PROJECT_DIR (stays at launch dir, often scratch workspace). Newly-adopted UserPromptSubmit hooks resolve under the old path → ENOENT. python3 exits 2 on missing script; argparse also exits 2; UserPromptSubmit treats exit 2 as deny and erases the prompt. Prompt never reaches the model; four consecutive prompts erased in 33 seconds in the wild. Asking what is wrong is itself a prompt, so the question is destroyed; only recoverable via session JSONL. SessionStart hooks do not fire on mid-session change_directory (partial init). Suggested fixes: repoint CLAUDE_PROJECT_DIR; distinguish cannot-run vs deny; never erase silently. Shell-form workaround with fallback path; exec-form cannot express fallback (related #81291). Reporter Rasherb69 (Lewis Bacon). Filed 2026-09-04. OPEN, bug, has-repro, platform:macos, area:hooks, data-loss. Not Cupel era-legacy draft-07 assay. Not Oubliette cold-parent Dispatch queue. Not Ephemera 5m wick rewrite. Not Commutator sibling-slot stray. Not Heddle. Not Hectograph OTEL scrub.";
export const HOLD_RESULT =
  "set form; CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set; idle word set";
export const FORBIDDEN_IDLE = Object.freeze([
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
  "crossed",
  "homed",
  "slipped",
  "fouled",
  "mangled",
  "verbatim",
  "unbolted",
  "snagged",
  "sounded",
  "muted",
  "moored",
  "aloft",
  "resolved",
  "literal",
  "sealed",
  "blanked",
  "attested",
  "usurped",
  "swaged",
  "torn",
  "armed",
  "unheard",
  "scrapped",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Homograph",
  "Deckle",
  "Damper",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Bodoni Moda",
  "Outfit",
  "Eczar",
  "Schibsted Grotesk",
  "Martian Mono",
  "Newsreader",
  "Figtree",
  "Source Code Pro",
  "Source Serif 4",
  "Libre Franklin",
  "JetBrains Mono",
  "Literata",
  "Manrope",
  "Cormorant",
  "Fira Code",
]);
export const NOT_PRODUCTS = Object.freeze([
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

function formOf(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.form && typeof src.form === "object" ? src.form : {};
  return {
    changeDirectory: firstBool(nested.changeDirectory, src.changeDirectory, src.cd),
    projectDirRepointed: firstBool(
      nested.projectDirRepointed,
      src.projectDirRepointed,
      src.repointed,
    ),
    claudeProjectDir: firstText(
      nested.claudeProjectDir,
      src.claudeProjectDir,
      src.CLAUDE_PROJECT_DIR,
    ),
    launchDir: firstText(nested.launchDir, src.launchDir, src.launch),
    adoptedDir: firstText(nested.adoptedDir, src.adoptedDir, src.cwd),
    hookResolvedPath: firstText(
      nested.hookResolvedPath,
      src.hookResolvedPath,
      src.hookPath,
    ),
    hookEvent: firstText(nested.hookEvent, src.hookEvent, src.event),
    hookForm: firstText(nested.hookForm, src.hookForm),
    enoent: firstBool(nested.enoent, src.enoent),
    exitCode: firstNum(nested.exitCode, src.exitCode, src.exit),
    treatExit2AsDeny: firstBool(
      nested.treatExit2AsDeny,
      src.treatExit2AsDeny,
      src.denyOnExit2,
    ),
    promptErased: firstBool(nested.promptErased, src.promptErased, src.erased),
    promptReachedModel: firstBool(
      nested.promptReachedModel,
      src.promptReachedModel,
      src.reachedModel,
    ),
    consecutiveErased: firstNum(
      nested.consecutiveErased,
      src.consecutiveErased,
      src.erasedCount,
    ),
    windowSeconds: firstNum(nested.windowSeconds, src.windowSeconds),
    sessionStartFired: firstBool(
      nested.sessionStartFired,
      src.sessionStartFired,
    ),
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
    set: null,
    scrapped: null,
    changeDirectory: null,
    projectDirRepointed: null,
    claudeProjectDir: "",
    launchDir: "",
    adoptedDir: "",
    hookResolvedPath: "",
    hookEvent: "",
    hookForm: "",
    enoent: null,
    exitCode: null,
    treatExit2AsDeny: null,
    promptErased: null,
    promptReachedModel: null,
    consecutiveErased: null,
    windowSeconds: null,
    sessionStartFired: null,
    platform: "",
    appVersion: "",
    nodeVersion: "",
    pythonVersion: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedSet() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "composing-room",
    persistHold: true,
    set: true,
    scrapped: false,
    changeDirectory: true,
    projectDirRepointed: true,
    claudeProjectDir: ADOPTED_DIR,
    launchDir: LAUNCH_DIR,
    adoptedDir: ADOPTED_DIR,
    hookResolvedPath: `${ADOPTED_DIR}/.claude/hooks/user-prompt-submit.py`,
    hookEvent: HOOK_EVENT,
    hookForm: HOOK_FORM,
    enoent: false,
    exitCode: 0,
    treatExit2AsDeny: false,
    promptErased: false,
    promptReachedModel: true,
    consecutiveErased: 0,
    windowSeconds: 0,
    sessionStartFired: true,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "set; CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set; idle word set",
  };
}

export function seedScrapped() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "composing-room",
    persistHold: false,
    set: false,
    scrapped: true,
    changeDirectory: true,
    projectDirRepointed: false,
    claudeProjectDir: LAUNCH_DIR,
    launchDir: LAUNCH_DIR,
    adoptedDir: ADOPTED_DIR,
    hookResolvedPath: `${LAUNCH_DIR}/.claude/hooks/user-prompt-submit.py`,
    hookEvent: HOOK_EVENT,
    hookForm: HOOK_FORM,
    enoent: true,
    exitCode: EXIT_CODE,
    treatExit2AsDeny: true,
    promptErased: true,
    promptReachedModel: false,
    consecutiveErased: ERASED_COUNT,
    windowSeconds: WINDOW_SECONDS,
    sessionStartFired: false,
    platform: PLATFORM,
    appVersion: APP_VERSION,
    nodeVersion: NODE_VERSION,
    pythonVersion: PYTHON_VERSION,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "scrapped; #92168; sticky launch CLAUDE_PROJECT_DIR; UserPromptSubmit ENOENT; python3 exit 2 read as deny; four prompts erased in 33 seconds; Rasherb69; 2.1.204; macOS 26.5.2 arm64; area:hooks",
  };
}

export function seedSticky() {
  return {
    ...blankTicket(),
    seed: "sticky",
    source: "composing-room",
    persistHold: false,
    scrapped: true,
    changeDirectory: true,
    projectDirRepointed: false,
    claudeProjectDir: LAUNCH_DIR,
    launchDir: LAUNCH_DIR,
    adoptedDir: ADOPTED_DIR,
    sessionStartFired: false,
    outputText:
      "sticky; change_directory loads new project hooks/settings but does not repoint $CLAUDE_PROJECT_DIR; stays at launch dir",
  };
}

export function seedEnoent() {
  return {
    ...blankTicket(),
    seed: "enoent",
    source: "composing-room",
    persistHold: false,
    scrapped: true,
    changeDirectory: true,
    projectDirRepointed: false,
    claudeProjectDir: LAUNCH_DIR,
    launchDir: LAUNCH_DIR,
    adoptedDir: ADOPTED_DIR,
    hookResolvedPath: `${LAUNCH_DIR}/.claude/hooks/user-prompt-submit.py`,
    hookEvent: HOOK_EVENT,
    enoent: true,
    outputText:
      "enoent; newly-adopted UserPromptSubmit hooks resolve under the old launch path → ENOENT",
  };
}

export function seedExit2() {
  return {
    ...blankTicket(),
    seed: "exit2",
    source: "composing-room",
    persistHold: false,
    scrapped: true,
    enoent: true,
    exitCode: EXIT_CODE,
    treatExit2AsDeny: true,
    hookEvent: HOOK_EVENT,
    outputText:
      "exit2; python3 exits 2 on missing script; argparse also exits 2; UserPromptSubmit treats exit 2 as deny",
  };
}

export function seedErase() {
  return {
    ...blankTicket(),
    seed: "erase",
    source: "composing-room",
    persistHold: false,
    scrapped: true,
    treatExit2AsDeny: true,
    promptErased: true,
    promptReachedModel: false,
    consecutiveErased: ERASED_COUNT,
    windowSeconds: WINDOW_SECONDS,
    outputText:
      "erase; prompt never reaches the model; four consecutive prompts erased in 33 seconds; asking what is wrong is itself a prompt",
  };
}

export function seedLaunchPin() {
  return {
    ...blankTicket(),
    seed: "launch-pin",
    source: "composing-room",
    persistHold: false,
    scrapped: true,
    changeDirectory: true,
    projectDirRepointed: false,
    claudeProjectDir: LAUNCH_DIR,
    launchDir: LAUNCH_DIR,
    adoptedDir: ADOPTED_DIR,
    sessionStartFired: false,
    outputText:
      "launch-pin; $CLAUDE_PROJECT_DIR stays at the launch project (often scratch workspace); SessionStart does not fire on mid-session change_directory",
  };
}

export function seedHold() {
  return {
    ...seedSet(),
    seed: "hold",
    outputText:
      "hold; CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set; idle word set",
  };
}

export function seedCousin() {
  return {
    ...seedSet(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #88830 #81291 #87890 — cite only, not the #92168 hellbox form; different-class cite #92074 hooks don't fire in VS Code — not erase",
  };
}

export function emptyTicket() {
  return seedSet();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const form = formOf({ ...src, ...nested });
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    set: firstBool(nested.set, src.set),
    scrapped: firstBool(nested.scrapped, src.scrapped),
    changeDirectory: form.changeDirectory,
    projectDirRepointed: form.projectDirRepointed,
    claudeProjectDir: form.claudeProjectDir,
    launchDir: form.launchDir,
    adoptedDir: form.adoptedDir,
    hookResolvedPath: form.hookResolvedPath,
    hookEvent: form.hookEvent,
    hookForm: form.hookForm,
    enoent: form.enoent,
    exitCode: form.exitCode,
    treatExit2AsDeny: form.treatExit2AsDeny,
    promptErased: form.promptErased,
    promptReachedModel: form.promptReachedModel,
    consecutiveErased: form.consecutiveErased,
    windowSeconds: form.windowSeconds,
    sessionStartFired: form.sessionStartFired,
    platform: firstText(nested.platform, src.platform),
    appVersion: firstText(nested.appVersion, src.appVersion),
    nodeVersion: firstText(nested.nodeVersion, src.nodeVersion),
    pythonVersion: firstText(nested.pythonVersion, src.pythonVersion),
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
  const form = formOf(row);
  return (
    row.persistHold == null &&
    row.set == null &&
    row.scrapped == null &&
    form.changeDirectory == null &&
    form.projectDirRepointed == null &&
    !form.claudeProjectDir &&
    form.enoent == null &&
    form.exitCode == null &&
    form.promptErased == null &&
    form.promptReachedModel == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSet,
  [SEEDED_WORD]: seedScrapped,
  sticky: seedSticky,
  enoent: seedEnoent,
  exit2: seedExit2,
  erase: seedErase,
  "launch-pin": seedLaunchPin,
  launchPin: seedLaunchPin,
  hold: seedHold,
  cousin: seedCousin,
  88830: seedCousin,
  81291: seedCousin,
  87890: seedCousin,
  92074: seedCousin,
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
    return { ...seedScrapped(), ...cloned, ...raw };
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
    ticket.appVersion,
    ticket.claudeProjectDir,
    ticket.launchDir,
    ticket.hookResolvedPath,
    ticket.hookEvent,
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
    launchPin: "launch-pin",
    launch_pin: "launch-pin",
    "exit-2": "exit2",
    exit_2: "exit2",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isCleanForm(ticket) {
  const row = cloneTicket(ticket);
  if (
    row.projectDirRepointed === true &&
    row.promptReachedModel === true &&
    row.promptErased !== true &&
    row.enoent !== true
  ) {
    return true;
  }
  if (row.set === true && row.scrapped !== true && row.promptReachedModel === true) {
    return true;
  }
  return false;
}

export function scrappedPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.scrapped === true) return true;
  if (row.enoent === true && (row.exitCode === EXIT_CODE || row.treatExit2AsDeny === true)) {
    return true;
  }
  if (row.promptErased === true && row.promptReachedModel === false) {
    return true;
  }
  if (
    row.changeDirectory === true &&
    row.projectDirRepointed === false &&
    row.claudeProjectDir &&
    row.launchDir &&
    row.claudeProjectDir === row.launchDir
  ) {
    return true;
  }
  return false;
}

export function setPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.set === true && row.scrapped !== true) return true;
  if (isCleanForm(row) && row.scrapped !== true) return true;
  return false;
}

export function isSet(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.scrapped !== true && setPattern(row)) {
    return true;
  }
  if (setPattern(row) && row.scrapped !== true && !scrappedPattern(row)) {
    return true;
  }
  return false;
}

export function isScrapped(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (DIFFERENT_CLASS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (scrappedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      DIFFERENT_CLASS.includes(row.issue) ||
      /cousin-not-primary|#88830|#81291|#87890|#92074/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const scrappedNow = !cousinOnly && isScrapped(row);
  const setNow = !scrappedNow && isSet(row);
  const sticky =
    named === "sticky" ||
    (row.changeDirectory === true && row.projectDirRepointed === false) ||
    /does not repoint|stays at launch/i.test(text);
  const enoent =
    named === "enoent" ||
    row.enoent === true ||
    /ENOENT|resolve under the old/i.test(text);
  const exit2 =
    named === "exit2" ||
    row.exitCode === EXIT_CODE ||
    row.treatExit2AsDeny === true ||
    /exit 2|treats exit 2 as deny/i.test(text);
  const erase =
    named === "erase" ||
    row.promptErased === true ||
    row.promptReachedModel === false ||
    /never reaches the model|prompts erased/i.test(text);
  const launchPin =
    named === "launch-pin" ||
    (row.claudeProjectDir &&
      row.launchDir &&
      row.claudeProjectDir === row.launchDir &&
      row.projectDirRepointed === false) ||
    /stays at the launch project|scratch workspace/i.test(text);
  const scrapped =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (scrappedNow || named === SEEDED_WORD || /scrapped|#92168/i.test(text));
  const set = HOLD_VERDICTS.includes(named) || (setNow && !scrapped);
  return {
    named,
    cousinOnly,
    scrappedNow,
    setNow,
    sticky,
    enoent,
    exit2,
    erase,
    launchPin,
    scrapped,
    set,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.set && !flags.scrapped) chips.push("set");
  if (flags.scrapped) chips.push("scrapped");
  if (flags.sticky && flags.scrapped) chips.push("sticky");
  if (flags.enoent && flags.scrapped) chips.push("enoent");
  if (flags.exit2 && flags.scrapped) chips.push("exit2");
  if (flags.erase && flags.scrapped) chips.push("erase");
  if (flags.launchPin && flags.scrapped) chips.push("launch-pin");
  if ((flags.set || flags.named === "hold") && !flags.scrapped) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "set") {
    reasons.push(
      "set; CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set",
    );
    reasons.push("hold: the form stayed locked; idle word set");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set",
    );
  }
  if (verdict === "scrapped" || flags.scrapped) {
    reasons.push(
      "scrapped; #92168; sticky launch CLAUDE_PROJECT_DIR + ENOENT + exit 2 read as deny",
    );
  }
  if (verdict === "sticky" || (flags.sticky && flags.scrapped)) {
    reasons.push(
      "sticky; change_directory loads new hooks/settings but does not repoint $CLAUDE_PROJECT_DIR",
    );
  }
  if (verdict === "enoent" || (flags.enoent && flags.scrapped)) {
    reasons.push(
      "enoent; newly-adopted UserPromptSubmit hooks resolve under the old launch path",
    );
  }
  if (verdict === "exit2" || (flags.exit2 && flags.scrapped)) {
    reasons.push(
      "exit2; python3/argparse exit 2; UserPromptSubmit treats exit 2 as deny",
    );
  }
  if (verdict === "erase" || (flags.erase && flags.scrapped)) {
    reasons.push(
      "erase; prompt never reaches the model; four consecutive prompts erased in 33 seconds",
    );
  }
  if (verdict === "launch-pin" || (flags.launchPin && flags.scrapped)) {
    reasons.push(
      "launch-pin; $CLAUDE_PROJECT_DIR stays at the launch project; SessionStart does not fire mid-session",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Hellbox; cite-only #88830 #81291 #87890 — different surfaces from #92168 hellbox form; different-class cite #92074; primary stays #92168",
    );
  }
  if (verdict === "scrapped" || flags.scrapped) {
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
  if (named === IDLE_WORD && (flags.set || !flags.scrapped)) return "set";
  if (named === "hold" && !flags.scrapped) return "hold";
  if (named === SEEDED_WORD) return "scrapped";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "set";
  if (flags.scrapped) return "scrapped";
  if (flags.set) return "set";
  return "set";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "scrapped" || flags.scrapped) {
    return {
      case: "scrapped — sticky launch CLAUDE_PROJECT_DIR + ENOENT + exit 2 dumped the standing line into the hellbox",
      claudeProjectDir: ticket.claudeProjectDir || LAUNCH_DIR,
      exitCode: ticket.exitCode ?? EXIT_CODE,
      erased: ticket.consecutiveErased ?? ERASED_COUNT,
      mark: "hellbox scrapped; admit the line already scrapped",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set",
      claudeProjectDir: ADOPTED_DIR,
      exitCode: 0,
      erased: 0,
      mark: "hellbox hold; the form stays locked",
      note: "Hold: the form stays locked.",
    };
  }
  return {
    case: "set — CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set; idle word set",
    claudeProjectDir: ADOPTED_DIR,
    exitCode: 0,
    erased: 0,
    mark: "hellbox set; idle word set",
    note: "Set: the standing line stayed in the form.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const scrapped = verdict === "scrapped" || flags.scrapped;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    set: verdict === "set" || (flags.set && !scrapped),
    scrapped,
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
  if (name === SEEDED_WORD || name === 92168 || name === "92168") {
    return analyze(seedScrapped());
  }
  if (name === "sticky") return analyze(seedSticky());
  if (name === "enoent") return analyze(seedEnoent());
  if (name === "exit2" || name === "exit-2") return analyze(seedExit2());
  if (name === "erase") return analyze(seedErase());
  if (name === "launch-pin" || name === "launchPin") {
    return analyze(seedLaunchPin());
  }
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "open") {
    return analyze(seedSet());
  }
  if (
    name === 88830 ||
    name === "88830" ||
    name === 81291 ||
    name === "81291" ||
    name === 87890 ||
    name === "87890" ||
    name === 92074 ||
    name === "92074" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSet());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "scrapped" || (result.scrapped && result.alarm)
          ? `scrapped hellbox #${FEATURED_ISSUE}: sticky launch CLAUDE_PROJECT_DIR, UserPromptSubmit ENOENT, exit 2 read as deny, standing line erased. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. The form stayed locked. Score the form."
            : `set hellbox. Idle word ${IDLE_WORD}. CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set.`,
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
