#!/usr/bin/env node
/**
 * Deadeye — standing-rigging / lignum-vitae deadeye atelier classifier.
 * A deadeye that reeves the hook lanyard against the moving block is
 * not standing rigging — it is foul. Score the reeve or admit the
 * Bash already seized.
 *
 *   echo '{"relativePath":true,"driftedCwd":true}' | node deadeye.mjs
 *   node deadeye.mjs ticket.json
 *
 * Idle word is reeved (HOLD: lanyard reeved against mast /
 * $CLAUDE_PROJECT_DIR; Bash free).
 * Seeded state is fouled / #91226 (relative hook path fouled against
 * drifted Bash cwd → ENOENT seize → permanent deadlock).
 * NEVER idle as creased / bled / latched / vanished / sealed / rebound /
 * dark / spurious / fenced / swept / tolled / mute / honored / discarded /
 * arrested / skipped / indexed / jumped / chocked / rolled / clasped /
 * sprung / drained / hinged / pealed / warded / pooled / cased / aired /
 * sifted / stocked / stationed / marvered / unpinned / rinsed / literal /
 * choked / opened / stalled / fused / forged / attributed.
 *
 * Primary #91226: PreToolUse Bash hook with relative command path can
 * permanently deadlock the Bash tool for the rest of a session.
 * Hook config: PreToolUse Bash matcher, type: command, relative command
 * e.g. python3 scripts/harness_health_dashboard/guard-deploy-commands.py,
 * optional timeout/statusMessage. Bash tool cwd persists across tool
 * calls. After cd some/subdirectory && ..., further Bash fails with
 * PreToolUse:Bash hook error ENOENT resolving the relative path against
 * the subdirectory. Hook script still exists at <repo_root>/scripts/...
 * — resolution is against drifted cwd, not project root. Corrective cd
 * also goes through the broken hook and is rejected. Fresh non-worktree
 * subagent inherits broken state; isolation: "worktree" subagent gets
 * working Bash (fresh cwd). Expected: relative hook paths resolve
 * against $CLAUDE_PROJECT_DIR; hook spawn failure (ENOENT) must not
 * permanently deadlock Bash. Impact: unrecoverable without ending the
 * session. Claude Code 2.1.252; macOS Darwin 25.6.0. Reporter
 * hamazinger. Filed 2026-09-01T13:40:21Z. OPEN. Labels: bug, has repro,
 * platform:macos, area:bash, area:hooks. Recurrence of closed #32361 /
 * #5176 / #50960; $CLAUDE_PROJECT_DIR is documented mitigation but bare
 * relative paths still ship.
 *
 * Hypothesis only (NON-BINDING): hook spawn may resolve relative
 * commands against the Bash tool's current process cwd rather than
 * project root. Do not claim source you have not seen beyond the
 * issue's measured repro. Verify against the issue text and discard
 * if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the lanyard is reeved or fouled.
 *
 * NOT Reglet #91443 (CRLF / empty-index stageCheckout before
 * .gitattributes).
 * NOT Reliquary #91433 (aarch64 O_* EINVAL session vanish / data-loss).
 * NOT Annunciator #91419 (StopFailure false alarms on parent —
 * loud polarity).
 * NOT Caisson #91405 (worktree pool wrong rebind + dirty wipe).
 * NOT Spindle #91402 (startup cleanup deletes live sibling Bash
 * outputs — related Bash surface, different failure: cleanup race ≠
 * relative-hook cwd deadlock).
 * NOT Knell #91298 (Agent-tool silent child death).
 * NOT Fairlead #88423 as primary (bg Bash/Monitor wake misrouted to
 * lead — different agent-wake class).
 * NOT Tumbler / Escapement / Geneva / Scotch / Carillon / Pintle /
 * Fibula / Virgule / Riddle / Garner / Postern / Sluice.
 * NOT Reveille / callboard / slype muster-roster ink metaphors.
 * NOT Toggle (prior deferred name for #91422 — this hour's #91422
 * backup is Bolter, not Toggle).
 * NOT leftover woodworking / mm-slider / millrace / locksmith /
 * campanology / berth clones / letterpress galley Reglet UI.
 * Product name stays Deadeye. Do not rename to Reglet / Reliquary /
 * Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement /
 * Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle /
 * Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew /
 * Hasp / Berth / Bollard / Reveille / Callboard.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "reeved",
  "fouled",
  "relative-path",
  "drifted-cwd",
  "enoent-seize",
  "pretooluse-before-command",
  "persistent-bash-cwd",
  "corrective-cd-fails",
  "subagent-inherit",
  "isolation-worktree-escape",
  "claude-project-dir-fix",
  "recurrence",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "reeved";
export const SEEDED_WORD = "fouled";
export const HOLD_VERDICTS = Object.freeze(["reeved", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91226;
export const PRIMARY_ISSUES = Object.freeze([91226]);
export const COUSINS = Object.freeze([32361, 5176, 50960, 88830, 87890]);
export const COUSIN_ISSUE = 32361;
export const CROSS_ECOSYSTEM = Object.freeze([26675]);
export const BACKUPS = Object.freeze([
  { name: "Bolter", issue: 91422 },
  { name: "Clepsydra", issue: 91414 },
  { name: "Platen", issue: 91438 },
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "fairlead",
  "toggle",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "berth clones",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91226";
export const TITLE =
  "PreToolUse Bash hook with relative command path can permanently deadlock the Bash tool for the rest of a session";
export const FILED_AT = "2026-09-01T13:40:21Z";
export const UPDATED_AT = "2026-09-01T13:41:29Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "area:hooks",
]);
export const REPORTER = "hamazinger";
export const VERSION = "2.1.252";
export const PLATFORM = "macOS";
export const DARWIN = "Darwin 25.6.0";
export const PRETOOLUSE = "PreToolUse";
export const BASH = "Bash";
export const HOOK_TYPE = "command";
export const HOOK_COMMAND =
  "python3 scripts/harness_health_dashboard/guard-deploy-commands.py";
export const HOOK_TIMEOUT = 10;
export const ENOENT = "ENOENT";
export const CLAUDE_PROJECT_DIR = "$CLAUDE_PROJECT_DIR";
export const ISOLATION_WORKTREE = 'isolation: "worktree"';
export const CD_SUBDIR = "cd some/subdirectory";
export const PWD = "pwd";
export const ECHO_TEST = "echo test";
export const SETTINGS = ".claude/settings.json";
export const HUB_LINE =
  "20:50 deadeye: a deadeye that reeves the hook lanyard against the moving block is not standing rigging — it is foul. Score the reeve or admit the Bash already seized.";
export const MARK = "20:50 / hermes catalog #121 / #91226";
export const PHRASE =
  "a deadeye that reeves the hook lanyard against the moving block is not standing rigging — it is foul. Score the reeve or admit the Bash already seized.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: hook spawn may resolve relative commands against the Bash tool's current process cwd rather than project root. Do not claim source you have not seen beyond the issue's measured repro. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is RELATIVE PRETOOLUSE BASH HOOK PATH RESOLVES AGAINST DRIFTED BASH CWD → PERMANENT BASH DEADLOCK; WORKTREE ISOLATION ESCAPES; RECURRENCE OF #32361/#5176/#50960; AREA:BASH+HOOKS. PreToolUse Bash matcher, type: command, relative command e.g. python3 scripts/harness_health_dashboard/guard-deploy-commands.py. Bash tool cwd persists across tool calls. After cd some/subdirectory && ..., further Bash fails with PreToolUse:Bash hook error ENOENT resolving the relative path against the subdirectory. Hook script still exists at <repo_root>/scripts/... — resolution is against drifted cwd, not project root. Corrective cd also goes through the broken hook and is rejected — no in-session recovery. Fresh non-worktree subagent inherits broken state; isolation: \"worktree\" subagent gets working Bash (fresh cwd). Expected: relative hook paths resolve against $CLAUDE_PROJECT_DIR; hook spawn failure (ENOENT) must not permanently deadlock Bash. Impact: unrecoverable without ending the session; mid-task Bash-based work silently dies. Reporter hamazinger. Claude Code 2.1.252; macOS Darwin 25.6.0. Filed 2026-09-01. OPEN, has repro, platform:macos, area:bash, area:hooks.";
export const FORBIDDEN_IDLE = Object.freeze([
  "creased",
  "bled",
  "latched",
  "vanished",
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
  "letterpress cream galley",
  "vault-latch relic case",
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
    lanyardReevedAgainstMast: null,
    projectRootStable: null,
    bashFree: null,
    relativePath: null,
    driftedCwd: null,
    enoentSeize: null,
    pretooluseBeforeCommand: null,
    persistentBashCwd: null,
    correctiveCdFails: null,
    subagentInherit: null,
    isolationWorktreeEscape: null,
    claudeProjectDirFix: null,
    recurrence: null,
    hasClearRepro: null,
    hookMatcher: "",
    hookType: "",
    hookCommand: "",
    claudeProjectDir: "",
    isolationWorktree: "",
    cwdPersist: null,
    platform: "",
    cliVersion: "",
    reporter: "",
    observed: "",
    outputText: "",
  };
}

export function seedReeved() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    lanyardReevedAgainstMast: true,
    projectRootStable: true,
    bashFree: true,
    relativePath: false,
    driftedCwd: false,
    enoentSeize: false,
    pretooluseBeforeCommand: false,
    persistentBashCwd: true,
    correctiveCdFails: false,
    subagentInherit: false,
    isolationWorktreeEscape: true,
    claudeProjectDirFix: true,
    recurrence: false,
    hasClearRepro: false,
    hookMatcher: BASH,
    hookType: HOOK_TYPE,
    hookCommand: HOOK_COMMAND,
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    isolationWorktree: ISOLATION_WORKTREE,
    cwdPersist: true,
    platform: PLATFORM,
    cliVersion: VERSION,
    reporter: "",
    observed: "",
    outputText:
      "reeved; lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free; idle word reeved",
  };
}

export function seedFouled() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    lanyardReevedAgainstMast: false,
    projectRootStable: false,
    bashFree: false,
    relativePath: true,
    driftedCwd: true,
    enoentSeize: true,
    pretooluseBeforeCommand: true,
    persistentBashCwd: true,
    correctiveCdFails: true,
    subagentInherit: true,
    isolationWorktreeEscape: true,
    claudeProjectDirFix: false,
    recurrence: true,
    hasClearRepro: true,
    hookMatcher: BASH,
    hookType: HOOK_TYPE,
    hookCommand: HOOK_COMMAND,
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    isolationWorktree: ISOLATION_WORKTREE,
    cwdPersist: true,
    platform: PLATFORM,
    cliVersion: VERSION,
    reporter: REPORTER,
    observed: "2026-09-01",
    outputText:
      "fouled; #91226; relative PreToolUse Bash hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock; python3 scripts/harness_health_dashboard/guard-deploy-commands.py; cd some/subdirectory; pwd fails; echo test fails; corrective cd rejected; subagent inherit; isolation: \"worktree\" escapes; $CLAUDE_PROJECT_DIR is documented mitigation; hamazinger; Claude Code 2.1.252; macOS Darwin 25.6.0; area:bash area:hooks",
  };
}

export function seedRelativePath() {
  return {
    ...blankTicket(),
    seed: "relative-path",
    source: "atelier",
    relativePath: true,
    hookCommand: HOOK_COMMAND,
    hookType: HOOK_TYPE,
    outputText:
      "relative-path; PreToolUse Bash matcher, type: command, relative command e.g. python3 scripts/harness_health_dashboard/guard-deploy-commands.py",
  };
}

export function seedDriftedCwd() {
  return {
    ...blankTicket(),
    seed: "drifted-cwd",
    source: "atelier",
    driftedCwd: true,
    cwdPersist: true,
    outputText:
      "drifted-cwd; after cd some/subdirectory && ..., Bash cwd has left the implicit root",
  };
}

export function seedEnoentSeize() {
  return {
    ...blankTicket(),
    seed: "enoent-seize",
    source: "atelier",
    enoentSeize: true,
    outputText:
      "enoent-seize; PreToolUse:Bash hook error ENOENT resolving the relative path against the subdirectory; pwd fails; echo test fails",
  };
}

export function seedPretooluseBeforeCommand() {
  return {
    ...blankTicket(),
    seed: "pretooluse-before-command",
    source: "atelier",
    pretooluseBeforeCommand: true,
    hookMatcher: BASH,
    outputText:
      "pretooluse-before-command; PreToolUse runs before the user command so every subsequent Bash call fails the same way",
  };
}

export function seedPersistentBashCwd() {
  return {
    ...blankTicket(),
    seed: "persistent-bash-cwd",
    source: "atelier",
    persistentBashCwd: true,
    cwdPersist: true,
    outputText:
      "persistent-bash-cwd; Bash tool cwd persists across tool calls (documented behavior)",
  };
}

export function seedCorrectiveCdFails() {
  return {
    ...blankTicket(),
    seed: "corrective-cd-fails",
    source: "atelier",
    correctiveCdFails: true,
    outputText:
      "corrective-cd-fails; a corrective cd also goes through the broken hook and is rejected — no in-session recovery",
  };
}

export function seedSubagentInherit() {
  return {
    ...blankTicket(),
    seed: "subagent-inherit",
    source: "atelier",
    subagentInherit: true,
    outputText:
      "subagent-inherit; fresh non-worktree subagent inherits the broken cwd state",
  };
}

export function seedIsolationWorktreeEscape() {
  return {
    ...blankTicket(),
    seed: "isolation-worktree-escape",
    source: "atelier",
    isolationWorktreeEscape: true,
    isolationWorktree: ISOLATION_WORKTREE,
    outputText:
      "isolation-worktree-escape; isolation: \"worktree\" subagent gets working Bash (fresh cwd)",
  };
}

export function seedClaudeProjectDirFix() {
  return {
    ...blankTicket(),
    seed: "claude-project-dir-fix",
    source: "atelier",
    claudeProjectDirFix: true,
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    outputText:
      "claude-project-dir-fix; $CLAUDE_PROJECT_DIR is documented mitigation; expected: relative hook paths resolve against a stable root",
  };
}

export function seedRecurrence() {
  return {
    ...blankTicket(),
    seed: "recurrence",
    source: "atelier",
    recurrence: true,
    outputText:
      "recurrence; closed #32361 / #5176 / #50960 — same relative PreToolUse × cd CWD class; bare relative paths still ship",
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
    platform: PLATFORM,
    cliVersion: VERSION,
    outputText:
      "has-clear-repro; hamazinger filed #91226; has repro; platform:macos; area:bash; area:hooks; Claude Code 2.1.252; Darwin 25.6.0",
  };
}

export function seedHold() {
  return {
    ...seedReeved(),
    seed: "hold",
    outputText:
      "hold; lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free; the deadeye holds",
  };
}

export function seedCousin() {
  return {
    ...seedReeved(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #32361 closed same relative PreToolUse × cd CWD class — cite only, not the #91226 standing-rigging deadlock",
  };
}

export function emptyTicket() {
  return seedReeved();
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
    lanyardReevedAgainstMast: firstBool(
      nested.lanyardReevedAgainstMast,
      src.lanyardReevedAgainstMast,
    ),
    projectRootStable: firstBool(nested.projectRootStable, src.projectRootStable),
    bashFree: firstBool(nested.bashFree, src.bashFree),
    relativePath: firstBool(nested.relativePath, src.relativePath),
    driftedCwd: firstBool(nested.driftedCwd, src.driftedCwd),
    enoentSeize: firstBool(nested.enoentSeize, src.enoentSeize),
    pretooluseBeforeCommand: firstBool(
      nested.pretooluseBeforeCommand,
      src.pretooluseBeforeCommand,
    ),
    persistentBashCwd: firstBool(nested.persistentBashCwd, src.persistentBashCwd),
    correctiveCdFails: firstBool(nested.correctiveCdFails, src.correctiveCdFails),
    subagentInherit: firstBool(nested.subagentInherit, src.subagentInherit),
    isolationWorktreeEscape: firstBool(
      nested.isolationWorktreeEscape,
      src.isolationWorktreeEscape,
    ),
    claudeProjectDirFix: firstBool(
      nested.claudeProjectDirFix,
      src.claudeProjectDirFix,
    ),
    recurrence: firstBool(nested.recurrence, src.recurrence),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    hookMatcher: firstText(nested.hookMatcher, src.hookMatcher),
    hookType: firstText(nested.hookType, src.hookType),
    hookCommand: firstText(nested.hookCommand, src.hookCommand),
    claudeProjectDir: firstText(nested.claudeProjectDir, src.claudeProjectDir),
    isolationWorktree: firstText(nested.isolationWorktree, src.isolationWorktree),
    cwdPersist: firstBool(nested.cwdPersist, src.cwdPersist),
    platform: firstText(nested.platform, src.platform),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    reporter: firstText(nested.reporter, src.reporter),
    observed: firstText(nested.observed, src.observed),
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
    row.lanyardReevedAgainstMast == null &&
    row.projectRootStable == null &&
    row.relativePath == null &&
    row.driftedCwd == null &&
    row.enoentSeize == null &&
    row.pretooluseBeforeCommand == null &&
    row.persistentBashCwd == null &&
    row.correctiveCdFails == null &&
    row.subagentInherit == null &&
    row.isolationWorktreeEscape == null &&
    row.claudeProjectDirFix == null &&
    row.recurrence == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedReeved,
  [SEEDED_WORD]: seedFouled,
  "relative-path": seedRelativePath,
  "drifted-cwd": seedDriftedCwd,
  "enoent-seize": seedEnoentSeize,
  enoent: seedEnoentSeize,
  "pretooluse-before-command": seedPretooluseBeforeCommand,
  pretooluse: seedPretooluseBeforeCommand,
  "persistent-bash-cwd": seedPersistentBashCwd,
  "corrective-cd-fails": seedCorrectiveCdFails,
  "subagent-inherit": seedSubagentInherit,
  "isolation-worktree-escape": seedIsolationWorktreeEscape,
  "worktree-escape": seedIsolationWorktreeEscape,
  "claude-project-dir-fix": seedClaudeProjectDirFix,
  "project-dir": seedClaudeProjectDirFix,
  recurrence: seedRecurrence,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  32361: seedCousin,
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
    return { ...seedFouled(), ...cloned, ...raw };
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
    ticket.platform,
    ticket.hookCommand,
    ticket.hookMatcher,
    ticket.claudeProjectDir,
    ticket.isolationWorktree,
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

export function isReeved(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.lanyardReevedAgainstMast === true &&
    row.projectRootStable === true &&
    row.relativePath !== true &&
    row.driftedCwd !== true &&
    row.enoentSeize !== true
  ) {
    return true;
  }
  return false;
}

export function isFouled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.relativePath === true && row.driftedCwd === true) ||
    (row.enoentSeize === true && row.pretooluseBeforeCommand === true) ||
    (row.correctiveCdFails === true && row.persistentBashCwd === true && row.enoentSeize === true)
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
      /cousin-not-primary|#32361|#5176|#50960|#88830|#87890|#26675/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const fouledNow = !cousinOnly && isFouled(row);
  const reevedNow = !fouledNow && isReeved(row);
  const relativePath =
    row.relativePath === true ||
    named === "relative-path" ||
    /relative-path|relative command|python3 scripts\//i.test(text);
  const driftedCwd =
    row.driftedCwd === true ||
    named === "drifted-cwd" ||
    /drifted-cwd|drifted cwd|cd some\/subdirectory/i.test(text);
  const enoentSeize =
    row.enoentSeize === true ||
    named === "enoent-seize" ||
    /enoent-seize|ENOENT|pwd fails/i.test(text);
  const pretooluseBeforeCommand =
    row.pretooluseBeforeCommand === true ||
    named === "pretooluse-before-command" ||
    /pretooluse-before-command|PreToolUse.*before|hook error before/i.test(text);
  const persistentBashCwd =
    row.persistentBashCwd === true ||
    row.cwdPersist === true ||
    named === "persistent-bash-cwd" ||
    /persistent-bash-cwd|cwd persists|documented behavior/i.test(text);
  const correctiveCdFails =
    row.correctiveCdFails === true ||
    named === "corrective-cd-fails" ||
    /corrective-cd-fails|corrective cd|no in-session recovery/i.test(text);
  const subagentInherit =
    row.subagentInherit === true ||
    named === "subagent-inherit" ||
    /subagent-inherit|non-worktree subagent|inherits the broken/i.test(text);
  const isolationWorktreeEscape =
    row.isolationWorktreeEscape === true ||
    named === "isolation-worktree-escape" ||
    /isolation-worktree-escape|isolation: "worktree"|fresh cwd/i.test(text);
  const claudeProjectDirFix =
    row.claudeProjectDirFix === true ||
    named === "claude-project-dir-fix" ||
    /claude-project-dir-fix|\$CLAUDE_PROJECT_DIR/i.test(text);
  const recurrence =
    row.recurrence === true ||
    named === "recurrence" ||
    /recurrence|#32361|#5176|#50960/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|hamazinger|has repro|platform:macos|area:bash|area:hooks/i.test(
      text,
    );
  const fouled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (fouledNow || named === SEEDED_WORD || /fouled|#91226/i.test(text));
  const reeved =
    named === IDLE_WORD || named === "hold" || (reevedNow && !fouled);
  return {
    named,
    cousinOnly,
    fouledNow,
    reevedNow,
    relativePath,
    driftedCwd,
    enoentSeize,
    pretooluseBeforeCommand,
    persistentBashCwd,
    correctiveCdFails,
    subagentInherit,
    isolationWorktreeEscape,
    claudeProjectDirFix,
    recurrence,
    hasClearRepro,
    fouled,
    reeved,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.reeved && !flags.fouled) chips.push("reeved");
  if (flags.fouled) chips.push("fouled");
  if (flags.relativePath && flags.fouled) chips.push("relative-path");
  if (flags.driftedCwd && flags.fouled) chips.push("drifted-cwd");
  if (flags.enoentSeize && flags.fouled) chips.push("enoent-seize");
  if (flags.pretooluseBeforeCommand && flags.fouled) {
    chips.push("pretooluse-before-command");
  }
  if (flags.persistentBashCwd && flags.fouled) chips.push("persistent-bash-cwd");
  if (flags.correctiveCdFails && flags.fouled) chips.push("corrective-cd-fails");
  if (flags.subagentInherit && flags.fouled) chips.push("subagent-inherit");
  if (flags.isolationWorktreeEscape && flags.fouled) {
    chips.push("isolation-worktree-escape");
  }
  if (flags.claudeProjectDirFix && flags.fouled) {
    chips.push("claude-project-dir-fix");
  }
  if (flags.recurrence && flags.fouled) chips.push("recurrence");
  if (flags.hasClearRepro && flags.fouled) chips.push("has-clear-repro");
  if ((flags.reeved || flags.named === "hold") && !flags.fouled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "reeved") {
    reasons.push(
      "reeved; lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free",
    );
    reasons.push(
      "hold: the deadeye reeves the hook lanyard against the mast; standing rigging",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free; the deadeye holds",
    );
  }
  if (verdict === "fouled" || flags.fouled) {
    reasons.push(
      "fouled; #91226; relative PreToolUse Bash hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock",
    );
  }
  if (flags.relativePath || verdict === "relative-path") {
    reasons.push(
      "relative-path; PreToolUse Bash matcher, type: command, relative command e.g. python3 scripts/harness_health_dashboard/guard-deploy-commands.py",
    );
  }
  if (flags.driftedCwd || verdict === "drifted-cwd") {
    reasons.push(
      "drifted-cwd; after cd some/subdirectory && ..., resolution is against the subdirectory, not project root",
    );
  }
  if (flags.enoentSeize || verdict === "enoent-seize") {
    reasons.push(
      "enoent-seize; PreToolUse:Bash hook error ENOENT; hook script still exists at <repo_root>/scripts/...; pwd and echo fail",
    );
  }
  if (flags.pretooluseBeforeCommand || verdict === "pretooluse-before-command") {
    reasons.push(
      "pretooluse-before-command; PreToolUse runs before the user command so every subsequent Bash call fails the same way",
    );
  }
  if (flags.persistentBashCwd || verdict === "persistent-bash-cwd") {
    reasons.push(
      "persistent-bash-cwd; Bash tool cwd persists across tool calls (documented behavior)",
    );
  }
  if (flags.correctiveCdFails || verdict === "corrective-cd-fails") {
    reasons.push(
      "corrective-cd-fails; a corrective cd also goes through the broken hook and is rejected — no in-session recovery",
    );
  }
  if (flags.subagentInherit || verdict === "subagent-inherit") {
    reasons.push(
      "subagent-inherit; fresh non-worktree subagent inherits the broken cwd state",
    );
  }
  if (flags.isolationWorktreeEscape || verdict === "isolation-worktree-escape") {
    reasons.push(
      "isolation-worktree-escape; isolation: \"worktree\" subagent gets working Bash (fresh cwd)",
    );
  }
  if (flags.claudeProjectDirFix || verdict === "claude-project-dir-fix") {
    reasons.push(
      "claude-project-dir-fix; $CLAUDE_PROJECT_DIR is documented mitigation; expected: relative hook paths resolve against a stable root",
    );
  }
  if (flags.recurrence || verdict === "recurrence") {
    reasons.push(
      "recurrence; closed #32361 / #5176 / #50960 — same relative PreToolUse × cd CWD class; bare relative paths still ship",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; ${PLATFORM}; ${DARWIN}; CLI ${VERSION}; area:bash; area:hooks`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Deadeye; cite-only #32361 / #5176 / #50960 same relative PreToolUse × cd CWD class / #88830 hook failures invisible in desktop / #87890 EnterWorktree does not propagate to PreToolUse (opposite polarity) / openai/codex#26675 PostToolUse relative command, not the #91226 standing-rigging deadlock",
    );
  }
  if (verdict === "fouled" || flags.fouled) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "reeved" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.reeved || !flags.fouled)) return "reeved";
  if (named === "hold" && !flags.fouled) return "hold";
  if (named === SEEDED_WORD) return "fouled";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "reeved";
  if (flags.fouled) return "fouled";
  if (flags.reeved) return "reeved";
  return "reeved";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "fouled" || flags.fouled) {
    return {
      case: "fouled — relative hook lanyard seized against the moving block",
      rope: "relative PreToolUse command resolved against drifted Bash cwd",
      clapper: `ENOENT on <drifted_cwd>/${HOOK_COMMAND.split(" ").slice(1).join(" ")}`,
      chamber: "every subsequent Bash call fails before the user command; no in-session recovery",
      mark: "deadeye reeved the lanyard against the moving block; admit the Bash already seized",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "reeved — lanyard against the mast; Bash free",
      rope: "$CLAUDE_PROJECT_DIR; relative path pinned to project root",
      clapper: "PreToolUse finds the hook; pwd and echo still run",
      chamber: "the deadeye holds; nothing to score",
      mark: "deadeye reeved; standing rigging",
      note: "Hold: the deadeye is reeved.",
    };
  }
  return {
    case: "reeved — lanyard against the mast; Bash free",
    rope: "hook lanyard reeved against $CLAUDE_PROJECT_DIR; cwd may drift",
    clapper: "relative command still finds <repo_root>/scripts/...",
    chamber: "sea indigo quiet; atelier reeved",
    mark: "deadeye reeved; idle word reeved",
    note: "Reeved: the deadeye holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const fouled = verdict === "fouled" || flags.fouled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    reeved: verdict === "reeved" || (flags.reeved && !fouled),
    fouled,
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
  if (name === SEEDED_WORD || name === 91226 || name === "91226") {
    return analyze(seedFouled());
  }
  if (name === "relative-path") return analyze(seedRelativePath());
  if (name === "drifted-cwd") return analyze(seedDriftedCwd());
  if (name === "enoent-seize" || name === "enoent") {
    return analyze(seedEnoentSeize());
  }
  if (name === "pretooluse-before-command" || name === "pretooluse") {
    return analyze(seedPretooluseBeforeCommand());
  }
  if (name === "persistent-bash-cwd") return analyze(seedPersistentBashCwd());
  if (name === "corrective-cd-fails") return analyze(seedCorrectiveCdFails());
  if (name === "subagent-inherit") return analyze(seedSubagentInherit());
  if (name === "isolation-worktree-escape" || name === "worktree-escape") {
    return analyze(seedIsolationWorktreeEscape());
  }
  if (name === "claude-project-dir-fix" || name === "project-dir") {
    return analyze(seedClaudeProjectDirFix());
  }
  if (name === "recurrence") return analyze(seedRecurrence());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "reeved" || name === "open") {
    return analyze(seedReeved());
  }
  if (
    name === 32361 ||
    name === "32361" ||
    name === "cousin" ||
    name === 5176 ||
    name === "5176" ||
    name === 50960 ||
    name === "50960" ||
    name === 88830 ||
    name === "88830" ||
    name === 87890 ||
    name === "87890" ||
    name === 26675 ||
    name === "26675"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedReeved());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "fouled" || (result.fouled && result.alarm)
          ? `fouled deadeye #${FEATURED_ISSUE}: relative PreToolUse Bash hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free. Reeve the deadeye."
            : `reeved deadeye. Idle word ${IDLE_WORD}. Lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free.`,
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
