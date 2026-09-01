#!/usr/bin/env node
/**
 * Pintle — rudder pintle / gudgeon / tiller classifier.
 * A pintle that misses the gudgeon after one cd is not a hold.
 * Score the hinge or admit hinged.
 *
 *   echo '{"projectRoot":"/opt/project","bashCwd":"/opt/project/src","hookCommand":"python3 scripts/guard.py","resolveMode":"bashCwd"}' | node pintle.mjs
 *   node pintle.mjs ticket.json
 *
 * Idle word is hinged (relative hook resolves from project root;
 * Bash still works after cd because score treats root-anchored resolution).
 * Seeded state is seized / #91226 (cwd drifted; hook ENOENT; every
 * Bash blocked including corrective cd).
 * NEVER idle as seized, pealed, drained, pooled, warded, first-wins.
 *
 * Primary #91226: PreToolUse Bash hook with a relative command path
 * can permanently deadlock the Bash tool for the rest of a session.
 * Bash cwd persists; after `cd some/subdirectory && ...`, relative
 * hook resolution uses the drifted cwd → ENOENT. Then every later
 * Bash call fails before running. A corrective cd also goes through
 * the broken hook. Worktree-isolated subagent was the only in-session
 * escape; ordinary subagent inherits the broken state.
 *
 * Hypothesis only (NON-BINDING): treat resolution against bashCwd
 * for relative paths as the defect; anchoring to projectRoot /
 * $CLAUDE_PROJECT_DIR is healthy. Spawn/ENOENT failures must not
 * hard-block the whole Bash tool forever. Do not claim a root
 * cause in Claude Code source you have not seen. Verify against
 * the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the hinge is hinged or seized.
 *
 * NOT millrace / sluice-gate / pool-gauge.
 * NOT peal-board / belfry / carillon.
 * NOT postern-gate / night bailey.
 * NOT plane-table / alidade.
 * NOT garner grain-bin / woodworking / mm-slider.
 * Product name stays Pintle. Do not rename to Gudgeon / Tiller /
 * Rudder / Hinge / Pin / Strap / Stock.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "hinged",
  "seized",
  "cwd-drifted",
  "hook-enoent",
  "session-deadlock",
  "corrective-cd-blocked",
  "worktree-escape",
  "ordinary-subagent-inherits",
  "absolute-ok",
  "project-dir-anchored",
  "hold",
]);
export const IDLE_WORD = "hinged";
export const SEEDED_WORD = "seized";
export const HOLD_VERDICTS = Object.freeze([
  "hinged",
  "hold",
  "absolute-ok",
  "project-dir-anchored",
]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91226;
export const PRIMARY_ISSUES = Object.freeze([91226]);
export const SAME_CLASS_COUSINS = Object.freeze([32361, 5176]);
export const CLAUDE_COUSINS = Object.freeze([32361, 5176, 87890, 65378]);
export const CODEX_COUSINS = Object.freeze([26675, 23996]);
export const COUSINS = Object.freeze([...CLAUDE_COUSINS, ...CODEX_COUSINS]);
export const COUSIN_ISSUE = 32361;
export const CODEX_COUSIN = 26675;
export const ENTER_WORKTREE_COUSIN = 87890;
export const CWD_DELETED_COUSIN = 65378;
export const NOT_PRODUCTS = Object.freeze([
  "millrace",
  "sluice",
  "pool-gauge",
  "carillon",
  "postern",
  "alidade",
  "garner",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91226";
export const COUSIN_URL =
  "https://github.com/anthropics/claude-code/issues/32361";
export const CODEX_URL = "https://github.com/openai/codex/issues/26675";
export const TITLE =
  "PreToolUse Bash hook with relative command path can permanently deadlock the Bash tool for the rest of a session";
export const FILED_AT = "2026-09-01T13:40:21Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "area:hooks",
]);
export const REPORTER = "hamazinger";
export const CLAUDE_VERSION = "2.1.252";
export const PLATFORM = "macos";
export const HOOK_EVENT = "PreToolUse";
export const HOOK_MATCHER = "Bash";
export const HOOK_COMMAND =
  "python3 scripts/harness_health_dashboard/guard-deploy-commands.py";
export const HOOK_SCRIPT =
  "scripts/harness_health_dashboard/guard-deploy-commands.py";
export const PROJECT_ROOT = "/opt/project";
export const DRIFT_CWD = "/opt/project/some/subdirectory";
export const CLAUDE_PROJECT_DIR = "/opt/project";
export const ABSOLUTE_HOOK = `/opt/project/${HOOK_SCRIPT}`;
export const ANCHORED_HOOK = `$CLAUDE_PROJECT_DIR/${HOOK_SCRIPT}`;
export const ENOENT_PATH = `/opt/project/some/subdirectory/${HOOK_SCRIPT}`;
export const HUB_LINE =
  "05:50 pintle: a pintle that misses the gudgeon after one cd is not a hold. Score the hinge or admit hinged.";
export const MARK = "05:50 / hermes catalog #106 / #91226";
export const PHRASE =
  "A pintle that misses the gudgeon after one cd is not a hold. Score the hinge or admit hinged.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat resolution against bashCwd for relative paths as the defect; anchoring to projectRoot / $CLAUDE_PROJECT_DIR is healthy. Spawn/ENOENT failures must not hard-block the whole Bash tool forever. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is RELATIVE PRETOOLUSE BASH HOOK RESOLUTION AGAINST DRIFTED CWD — ENOENT THEN SESSION-PERMANENT DEADLOCK. Relative command in .claude/settings.json. Bash cwd persists across calls. After cd some/subdirectory the hook misses the gudgeon. Every later Bash call fails before running, including pwd, echo test, and a corrective cd. Ordinary subagent inherits. Worktree-isolated subagent was the only in-session escape. Expected: resolve relative hooks against stable $CLAUDE_PROJECT_DIR / project root. NOT millrace/sluice-gate/pool-gauge. NOT peal-board/belfry/carillon. NOT postern-gate/night bailey. NOT plane-table/alidade. NOT garner grain-bin / woodworking / mm-slider. Product name stays Pintle.";
export const FORBIDDEN_IDLE = Object.freeze([
  "seized",
  "pealed",
  "drained",
  "pooled",
  "warded",
  "first-wins",
]);
export const BANNED_NAMES = Object.freeze([
  "Gudgeon",
  "Tiller",
  "Rudder",
  "Hinge",
  "Pin",
  "Strap",
  "Stock",
  "Carillon",
  "Postern",
  "Sluice",
  "Alidade",
]);
export const FORBIDDEN_UI = Object.freeze([
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "carillon",
  "postern-gate",
  "night bailey",
  "plane-table",
  "alidade",
  "garner grain-bin",
  "woodworking",
  "mm-slider",
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

export function isAbsolutePath(value) {
  const raw = String(value || "");
  if (!raw) return false;
  if (raw.startsWith("$CLAUDE_PROJECT_DIR")) return true;
  if (raw.startsWith("/")) return true;
  if (/^[A-Za-z]:[\\/]/.test(raw)) return true;
  return false;
}

export function hookPathOf(hookCommand) {
  const raw = String(hookCommand || "").trim();
  if (!raw) return "";
  const tokens = raw.split(/\s+/);
  if (
    tokens.length >= 2 &&
    /^(python3?|node|nodejs|bash|sh|zsh|ruby|perl)$/i.test(tokens[0])
  ) {
    return tokens[1];
  }
  return tokens[0];
}

export function normalizePath(value) {
  const raw = String(value || "").replace(/\\/g, "/").replace(/\/+$/, "");
  return raw || "";
}

export function joinPosix(base, rel) {
  const path = String(rel || "");
  if (path.startsWith("$CLAUDE_PROJECT_DIR")) {
    const rest = path.replace(/^\$CLAUDE_PROJECT_DIR\/?/, "");
    const root = normalizePath(base);
    return rest ? `${root}/${rest.replace(/^\.\//, "")}` : root;
  }
  if (isAbsolutePath(path)) return normalizePath(path);
  const root = normalizePath(base);
  const rest = path.replace(/^\.\//, "");
  if (!root) return rest;
  if (!rest) return root;
  return `${root}/${rest}`;
}

export function cwdEqualsRoot(ticket) {
  return normalizePath(ticket.bashCwd) === normalizePath(ticket.projectRoot);
}

export function expectedPath(ticket) {
  const path = hookPathOf(ticket.hookCommand);
  if (isAbsolutePath(path) && !path.startsWith("$CLAUDE_PROJECT_DIR")) {
    return normalizePath(path);
  }
  const rest = path.replace(/^\$CLAUDE_PROJECT_DIR\/?/, "");
  return joinPosix(ticket.projectRoot || ticket.claudeProjectDir, rest);
}

export function resolveHook(ticket) {
  const path = hookPathOf(ticket.hookCommand);
  const mode = String(ticket.resolveMode || "");
  if (isAbsolutePath(path) && !path.startsWith("$CLAUDE_PROJECT_DIR")) {
    return { resolved: normalizePath(path), mode: "absolute", relative: false };
  }
  if (path.startsWith("$CLAUDE_PROJECT_DIR") || mode === "claudeProjectDir") {
    const root = ticket.claudeProjectDir || ticket.projectRoot;
    return {
      resolved: joinPosix(root, path.replace(/^\$CLAUDE_PROJECT_DIR\/?/, "")),
      mode: "claudeProjectDir",
      relative: !isAbsolutePath(path) || path.startsWith("$CLAUDE_PROJECT_DIR"),
    };
  }
  if (mode === "projectRoot") {
    return {
      resolved: joinPosix(ticket.projectRoot, path),
      mode: "projectRoot",
      relative: true,
    };
  }
  return {
    resolved: joinPosix(ticket.bashCwd, path),
    mode: "bashCwd",
    relative: true,
  };
}

export function isHealthyResolve(ticket) {
  const resolved = resolveHook(ticket);
  if (ticket.isolation === "worktree") return true;
  if (resolved.mode === "absolute") return true;
  if (resolved.mode === "projectRoot" || resolved.mode === "claudeProjectDir") {
    return true;
  }
  return cwdEqualsRoot(ticket);
}

export function isSeized(ticket) {
  if (ticket.isolation === "worktree") return false;
  if (isHealthyResolve(ticket)) {
    if (ticket.sessionSeized && resolveHook(ticket).mode === "bashCwd") {
      return true;
    }
    return false;
  }
  return true;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    projectRoot: "",
    bashCwd: "",
    hookCommand: "",
    resolveMode: "",
    claudeProjectDir: "",
    sessionSeized: null,
    correctiveCd: null,
    isolation: "",
    command: "",
    enoent: null,
    cousin: "",
    claudeVersion: "",
    platform: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedHinged();
}

export function seedHinged() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "projectRoot",
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    sessionSeized: false,
    correctiveCd: false,
    isolation: "",
    command: "cd some/subdirectory && pwd",
    enoent: false,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "hinged; relative PreToolUse Bash hook resolves from project root; Bash still works after cd because score treats root-anchored resolution; idle word hinged",
  };
}

export function seedSeized() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    sessionSeized: true,
    correctiveCd: false,
    isolation: "",
    command: "pwd",
    enoent: true,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "seized; #91226; PreToolUse Bash hook relative command; cwd drifted to some/subdirectory; hook ENOENT; every Bash blocked including pwd / echo test; Claude Code 2.1.252; macOS",
  };
}

export function seedCwdDrifted() {
  return {
    seed: "cwd-drifted",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: false,
    command: "cd some/subdirectory && ...",
    enoent: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "cwd-drifted; Bash tool cwd persists across calls; after cd some/subdirectory relative hook resolution uses the drifted cwd",
  };
}

export function seedHookEnoent() {
  return {
    seed: "hook-enoent",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    enoent: true,
    command: "pwd",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "hook-enoent; python3 can't open file /opt/project/some/subdirectory/scripts/harness_health_dashboard/guard-deploy-commands.py: [Errno 2] No such file or directory",
  };
}

export function seedSessionDeadlock() {
  return {
    seed: "session-deadlock",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    correctiveCd: false,
    command: "echo test",
    enoent: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "session-deadlock; every subsequent Bash call fails before running (even pwd / echo test); session-permanent",
  };
}

export function seedCorrectiveCdBlocked() {
  return {
    seed: "corrective-cd-blocked",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    correctiveCd: true,
    command: "cd /opt/project",
    enoent: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "corrective-cd-blocked; a corrective cd also goes through the broken hook and is rejected the same way",
  };
}

export function seedWorktreeEscape() {
  return {
    seed: "worktree-escape",
    source: "settings",
    projectRoot: `${PROJECT_ROOT}/.claude/worktrees/escape`,
    bashCwd: `${PROJECT_ROOT}/.claude/worktrees/escape`,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: false,
    isolation: "worktree",
    command: "pwd",
    enoent: false,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "worktree-escape; isolation: worktree was the only in-session escape; fresh cwd; ordinary subagent is not this",
  };
}

export function seedOrdinarySubagentInherits() {
  return {
    seed: "ordinary-subagent-inherits",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    isolation: "ordinary",
    command: "pwd",
    enoent: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "ordinary-subagent-inherits; a fresh non-worktree-isolated subagent inherited the same broken Bash cwd state",
  };
}

export function seedAbsoluteOk() {
  return {
    seed: "absolute-ok",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: `python3 ${ABSOLUTE_HOOK}`,
    resolveMode: "bashCwd",
    sessionSeized: false,
    command: "cd some/subdirectory && pwd",
    enoent: false,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "absolute-ok; absolute hook path always hinged even after Bash cwd drifts",
  };
}

export function seedProjectDirAnchored() {
  return {
    seed: "project-dir-anchored",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: `python3 ${ANCHORED_HOOK}`,
    resolveMode: "claudeProjectDir",
    claudeProjectDir: CLAUDE_PROJECT_DIR,
    sessionSeized: false,
    command: "cd some/subdirectory && pwd",
    enoent: false,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "project-dir-anchored; relative hook prefixed with $CLAUDE_PROJECT_DIR resolves against a stable project root; hinged after cd",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: PROJECT_ROOT,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: false,
    command: "pwd",
    enoent: false,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "hold; relative hook plus cwd still at project root; the pintle seats the gudgeon",
  };
}

export function seedCousin() {
  return {
    seed: "cwd-drifted",
    issue: COUSIN_ISSUE,
    source: "settings",
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: "scripts/hook.sh",
    resolveMode: "bashCwd",
    cousin: "32361",
    claudeVersion: "2.1.0",
    platform: "macos",
    outputText:
      "cousin-not-primary; #32361 CLOSED — same-class relative path breaks after Bash cd",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.pintle && typeof src.pintle === "object" && src.pintle) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.hinge && typeof src.hinge === "object" && src.hinge) ||
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
    projectRoot: firstText(
      nested.projectRoot,
      nested.project_root,
      src.projectRoot,
    ),
    bashCwd: firstText(nested.bashCwd, nested.bash_cwd, nested.cwd, src.bashCwd),
    hookCommand: firstText(
      nested.hookCommand,
      nested.hook_command,
      nested.commandPath,
      src.hookCommand,
    ),
    resolveMode: firstText(
      nested.resolveMode,
      nested.resolve_mode,
      src.resolveMode,
    ),
    claudeProjectDir: firstText(
      nested.claudeProjectDir,
      nested.claude_project_dir,
      src.claudeProjectDir,
    ),
    sessionSeized: firstBool(
      nested.sessionSeized,
      nested.session_seized,
      src.sessionSeized,
    ),
    correctiveCd: firstBool(
      nested.correctiveCd,
      nested.corrective_cd,
      src.correctiveCd,
    ),
    isolation: firstText(nested.isolation, src.isolation),
    command: firstText(nested.command, src.command),
    enoent: firstBool(nested.enoent, src.enoent),
    cousin: firstText(nested.cousin, src.cousin),
    claudeVersion: firstText(
      nested.claudeVersion,
      nested.claude_version,
      nested.version,
      src.claudeVersion,
    ),
    platform: firstText(nested.platform, src.platform),
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
  return (
    !row.projectRoot &&
    !row.bashCwd &&
    !row.hookCommand &&
    !row.resolveMode &&
    row.sessionSeized == null &&
    row.correctiveCd == null &&
    !row.isolation
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedHinged,
  [SEEDED_WORD]: seedSeized,
  "cwd-drifted": seedCwdDrifted,
  "hook-enoent": seedHookEnoent,
  "session-deadlock": seedSessionDeadlock,
  "corrective-cd-blocked": seedCorrectiveCdBlocked,
  "worktree-escape": seedWorktreeEscape,
  "ordinary-subagent-inherits": seedOrdinarySubagentInherits,
  "absolute-ok": seedAbsoluteOk,
  "project-dir-anchored": seedProjectDirAnchored,
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
    return { ...seedSeized(), ...cloned, ...raw };
  }
  if ((issue === COUSIN_ISSUE || raw.issue === COUSIN_ISSUE) && coreMissing) {
    return { ...seedCousin(), ...cloned, ...raw };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.cousin, ticket.seed]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const resolved = resolveHook(row);
  const expected = expectedPath(row);
  const relative = !isAbsolutePath(hookPathOf(row.hookCommand)) ||
    String(hookPathOf(row.hookCommand)).startsWith("$CLAUDE_PROJECT_DIR");
  const drifted = Boolean(row.projectRoot) && Boolean(row.bashCwd) && !cwdEqualsRoot(row);
  const bashCwdMode = resolved.mode === "bashCwd";
  const seizedNow = isSeized(row);
  const healthy = isHealthyResolve(row);
  const enoent =
    row.enoent === true ||
    (seizedNow && bashCwdMode && drifted) ||
    /hook-enoent|ENOENT|No such file/i.test(text);
  const deadlock =
    row.sessionSeized === true ||
    named === "session-deadlock" ||
    /session-deadlock|every subsequent Bash|session-permanent/i.test(text);
  const corrective =
    row.correctiveCd === true ||
    named === "corrective-cd-blocked" ||
    /corrective-cd-blocked|corrective cd/i.test(text);
  const worktree = row.isolation === "worktree" || named === "worktree-escape";
  const ordinary =
    row.isolation === "ordinary" ||
    named === "ordinary-subagent-inherits" ||
    /ordinary-subagent-inherits|ordinary subagent/i.test(text);
  const absolute = resolved.mode === "absolute" || named === "absolute-ok";
  const anchored =
    resolved.mode === "claudeProjectDir" ||
    resolved.mode === "projectRoot" ||
    named === "project-dir-anchored";
  const seized =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "absolute-ok" &&
    named !== "project-dir-anchored" &&
    named !== "worktree-escape" &&
    (seizedNow ||
      named === SEEDED_WORD ||
      /seized|#91226/i.test(text));
  const hinged =
    named === IDLE_WORD ||
    (healthy && !seized && named !== SEEDED_WORD) ||
    (absolute && named !== SEEDED_WORD) ||
    (anchored && named !== SEEDED_WORD && !seizedNow);
  const cousinOnly =
    (row.issue === COUSIN_ISSUE ||
      row.cousin === "32361" ||
      /cousin-not-primary|#32361/i.test(text)) &&
    named !== SEEDED_WORD;
  return {
    resolved: resolved.resolved,
    expected,
    mode: resolved.mode,
    relative,
    drifted,
    bashCwdMode,
    seizedNow,
    healthy,
    enoent,
    deadlock,
    corrective,
    worktree,
    ordinary,
    absolute,
    anchored,
    seized,
    hinged,
    cousinOnly,
    named,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.hinged && !flags.seized) chips.push("hinged");
  if (flags.seized) chips.push("seized");
  if (flags.drifted && flags.bashCwdMode) chips.push("cwd-drifted");
  if (flags.enoent && flags.seized) chips.push("hook-enoent");
  if (flags.deadlock && flags.seized) chips.push("session-deadlock");
  if (flags.corrective && flags.seized) chips.push("corrective-cd-blocked");
  if (flags.worktree) chips.push("worktree-escape");
  if (flags.ordinary && flags.seized) chips.push("ordinary-subagent-inherits");
  if (flags.absolute && !flags.seized) chips.push("absolute-ok");
  if (flags.anchored && !flags.seized) chips.push("project-dir-anchored");
  if ((flags.hinged || flags.named === "hold" || flags.healthy) && !flags.seized) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "hinged") {
    reasons.push(
      "hinged; relative PreToolUse Bash hook resolves from project root; Bash still works after cd",
    );
    reasons.push("hold: the pintle seats the gudgeon; score treats root-anchored resolution");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; relative hook plus cwd still at project root; the pintle seats the gudgeon",
    );
  }
  if (verdict === "seized" || flags.seized) {
    reasons.push(
      `seized; #91226; relative hook resolved against drifted cwd ${flags.resolved || ENOENT_PATH}; ENOENT; every Bash blocked`,
    );
  }
  if (flags.drifted || verdict === "cwd-drifted") {
    reasons.push(
      "cwd-drifted; Bash tool cwd persists across calls; after cd some/subdirectory relative hook resolution uses the drifted cwd",
    );
  }
  if (flags.enoent || verdict === "hook-enoent") {
    reasons.push(
      `hook-enoent; ${ENOENT_PATH} — [Errno 2] No such file or directory; the script lives at ${ABSOLUTE_HOOK}`,
    );
  }
  if (flags.deadlock || verdict === "session-deadlock") {
    reasons.push(
      "session-deadlock; every subsequent Bash call fails before running (even pwd / echo test)",
    );
  }
  if (flags.corrective || verdict === "corrective-cd-blocked") {
    reasons.push(
      "corrective-cd-blocked; a corrective cd also goes through the broken hook → session-permanent deadlock",
    );
  }
  if (flags.worktree || verdict === "worktree-escape") {
    reasons.push(
      "worktree-escape; isolation: worktree was the only in-session escape (fresh cwd)",
    );
  }
  if (flags.ordinary || verdict === "ordinary-subagent-inherits") {
    reasons.push(
      "ordinary-subagent-inherits; a non-worktree-isolated subagent inherits the broken Bash cwd state",
    );
  }
  if (flags.absolute || verdict === "absolute-ok") {
    reasons.push("absolute-ok; absolute hook path always hinged even after cwd drifts");
  }
  if (flags.anchored || verdict === "project-dir-anchored") {
    reasons.push(
      "project-dir-anchored; $CLAUDE_PROJECT_DIR / project root resolution is healthy",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin #32361 is not Pintle; same-class relative path after Bash cd is cite-only",
    );
  }
  if (verdict === "seized" || flags.seized) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "hinged" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.hinged || !flags.seized)) return "hinged";
  if (named === "hold" && !flags.seized) return "hold";
  if (named === SEEDED_WORD) return "seized";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.seized) return "seized";
  if (flags.absolute) return "absolute-ok";
  if (flags.anchored) return "project-dir-anchored";
  if (flags.hinged) return "hinged";
  return "hinged";
}

function hingeOf(flags, ticket, verdict) {
  if (verdict === "seized" || flags.seized) {
    return {
      pintle: "misses — relative hook resolved against drifted Bash cwd",
      gudgeon: `empty — expected ${flags.expected || ABSOLUTE_HOOK}`,
      tiller: "seized — every Bash stroke fails before running",
      ropes: "fouled — corrective cd also goes through the broken hook",
      compass: "dead — session-permanent deadlock",
      note: PHRASE,
    };
  }
  if (verdict === "worktree-escape") {
    return {
      pintle: "reseated — worktree isolation minted a fresh cwd",
      gudgeon: "held — only in-session escape found",
      tiller: "swung — ordinary subagent is not this",
      ropes: "rove — isolation: worktree",
      compass: "reset — not a healthy default hinge",
      note: "Worktree escape is a workaround, not root-anchored resolution.",
    };
  }
  if (verdict === "absolute-ok") {
    return {
      pintle: "seated — absolute hook path",
      gudgeon: "held — cwd drift cannot miss an absolute pin",
      tiller: "swung — Bash still works after cd",
      ropes: "rove",
      compass: "steady",
      note: "Absolute hook path always hinged.",
    };
  }
  if (verdict === "project-dir-anchored") {
    return {
      pintle: "seated — $CLAUDE_PROJECT_DIR / project root",
      gudgeon: "held — stable root, not Bash cwd",
      tiller: "swung — relative hook still finds the pin after cd",
      ropes: "rove",
      compass: "steady",
      note: "Root-anchored resolution is healthy.",
    };
  }
  return {
    pintle: "seated — relative hook resolves from project root",
    gudgeon: "held — score treats root-anchored resolution",
    tiller: "swung — Bash still works after cd",
    ropes: "rove",
    compass: "steady — idle word hinged",
    note: "Hinged: the pintle seats the gudgeon.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const seized = verdict === "seized" || flags.seized;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    hinged: verdict === "hinged" || (flags.hinged && !seized),
    seized,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: hingeOf(flags, ticket, verdict),
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
    return analyze(seedSeized());
  }
  if (name === "cwd-drifted") return analyze(seedCwdDrifted());
  if (name === "hook-enoent") return analyze(seedHookEnoent());
  if (name === "session-deadlock") return analyze(seedSessionDeadlock());
  if (name === "corrective-cd-blocked") return analyze(seedCorrectiveCdBlocked());
  if (name === "worktree-escape") return analyze(seedWorktreeEscape());
  if (name === "ordinary-subagent-inherits") {
    return analyze(seedOrdinarySubagentInherits());
  }
  if (name === "absolute-ok") return analyze(seedAbsoluteOk());
  if (name === "project-dir-anchored") return analyze(seedProjectDirAnchored());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "hinged" || name === "swung") {
    return analyze(seedHinged());
  }
  if (name === 32361 || name === "32361" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedHinged());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "seized" || (result.seized && result.alarm)
          ? `seized pintle #${FEATURED_ISSUE}: relative PreToolUse Bash hook resolved against drifted cwd; ENOENT; every later Bash call fails before running, including a corrective cd. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Relative hook plus cwd still at project root. Score the hinge."
            : result.verdict === "absolute-ok"
              ? "absolute-ok. Absolute hook path always hinged even after cwd drifts."
              : result.verdict === "project-dir-anchored"
                ? "project-dir-anchored. $CLAUDE_PROJECT_DIR / project root resolution is healthy."
                : `hinged pintle. Idle word ${IDLE_WORD}. Relative hook resolves from project root; Bash still works after cd.`,
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
