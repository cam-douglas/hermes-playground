#!/usr/bin/env node
/**
 * Carillon — peal-board / carillon-console / belfry classifier.
 * A peal that registers three bells and strikes one is not a hold.
 * Score the peal or admit pealed.
 *
 *   echo '{"pluginSessionStartRegistered":3,"pluginSessionStartDispatched":1}' | node carillon.mjs
 *   node carillon.mjs ticket.json
 *
 * Idle word is pealed (settings.json three SessionStart handlers
 * all fire and deliver additionalContext; board 3/3).
 * Seeded state is first-wins / #91250 (/hooks counts 3 plugins,
 * only the first-registered peals; 1 struck + 2 muted; no error).
 * NEVER idle as first-wins, drained, pooled, warded, squatted,
 * stationed, displaced, hung, marvered, unpinned, shed, sealed,
 * rinsed, vacant, postern, sluice.
 *
 * Primary #91250: only one plugin SessionStart hook executes when
 * multiple are registered. First-registered wins; the rest are
 * dropped with no error. /reload-plugins and /hooks still count
 * every hook. settings.json SessionStart hooks are unaffected.
 *
 * Hypothesis only (NON-BINDING): treat this as first-wins dispatch
 * on plugin SessionStart (registry N, peal 1). Do not claim a root
 * cause in Claude Code source you have not seen. Verify against
 * the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the peal is pealed or first-wins.
 *
 * NOT Callboard (skills roster / callboard).
 * NOT Pale / Ambo / Tappet / Pawl (terminalSequence / cwd-not-repo-root hooks).
 * NOT Postern #91223 (socket-dir squat / night bailey).
 * NOT Sluice #91265 (Cowork Toke/File/SeAt millrace).
 * NOT Alidade #91055. NOT Parison #91037. NOT Cockade #91033.
 * NOT Lye #91020. NOT Limpet #89275. NOT Quench. NOT Bulla #90891.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Carillon. Do not rename to Peal / Belfry /
 * Campanile / Change / Sally / Treble / Tenor / Clapper / Bellcote.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "pealed",
  "first-wins",
  "registered-not-pealed",
  "settings-all-fire",
  "plugin-only-drop",
  "silent-no-error",
  "hooks-count-lies",
  "reload-plugins-ok",
  "additionalContext-one",
  "regression-216",
  "hold",
]);
export const IDLE_WORD = "pealed";
export const SEEDED_WORD = "first-wins";
export const HOLD_VERDICTS = Object.freeze(["pealed", "hold", "settings-all-fire"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91250;
export const PRIMARY_ISSUES = Object.freeze([91250]);
export const CLAUDE_COUSINS = Object.freeze([
  88086, 88650, 83643, 75972, 76297, 78455, 10373,
]);
export const CODEX_COUSINS = Object.freeze([39895, 42079, 34321]);
export const COUSINS = Object.freeze([...CLAUDE_COUSINS, ...CODEX_COUSINS]);
export const COUSIN_ISSUE = 88086;
export const CODEX_COUSIN = 39895;
export const NOT_PRODUCTS = Object.freeze([
  "callboard",
  "pale",
  "ambo",
  "tappet",
  "pawl",
  "postern",
  "sluice",
  "alidade",
  "parison",
  "cockade",
  "lye",
  "limpet",
  "quench",
  "bulla",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91250";
export const COUSIN_URL =
  "https://github.com/anthropics/claude-code/issues/88086";
export const CODEX_URL = "https://github.com/openai/codex/issues/39895";
export const TITLE =
  "[BUG] Only one SessionStart hook executes when multiple are registered";
export const FILED_AT = "2026-09-01T15:19:35Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:hooks",
  "regression",
  "area:plugins",
]);
export const REPORTER = "thoeltig";
export const CLAUDE_VERSION = "2.1.252";
export const LAST_WORKING_VERSION = "2.1.198";
export const LAST_WORKING_SEEN = "2026-07-02";
export const BROKEN_FROM = "2.1.216";
export const BROKEN_TO = "2.1.252";
export const BROKEN_FROM_DATE = "2026-07-21";
export const BROKEN_TO_DATE = "2026-09-01";
export const UNVERIFIED_FROM = "2.1.199";
export const UNVERIFIED_TO = "2.1.215";
export const BROKEN_VERSION_COUNT = 18;
export const BROKEN_SESSION_COUNT = 85;
export const MAX_PEALS_BROKEN = 1;
export const MAX_PEALS_WORKING = 4;
export const SETTINGS_FIRED = 3;
export const PLUGIN_REGISTERED = 3;
export const PLUGIN_PEALED = 1;
export const PLATFORM = "windows";
export const TERMINAL = "Windows Terminal";
export const HUB_LINE =
  "04:50 carillon: a peal that registers three bells and strikes one is not a hold. Score the peal or admit pealed.";
export const MARK = "04:50 / hermes catalog #105 / #91250";
export const PHRASE =
  "A peal that registers three bells and strikes one is not a hold. Score the peal or admit pealed.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as first-wins dispatch on plugin SessionStart (registry N, peal 1). Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is PLUGIN SESSIONSTART FIRST-WINS DISPATCH — REGISTRY COUNTS EVERY HOOK, PEAL STRIKES ONE. settings.json SessionStart hooks fire. Plugin-contributed SessionStart hooks of the same shape (no matcher key) drop after the first-registered. No error. NOT Callboard. NOT Pale/Ambo/Tappet/Pawl. NOT Postern #91223. NOT Sluice #91265. NOT Alidade #91055. NOT Parison #91037. NOT Cockade #91033. NOT Lye #91020. NOT Limpet #89275. NOT Quench. NOT Bulla #90891. Product name stays Carillon.";
export const FORBIDDEN_IDLE = Object.freeze([
  "first-wins",
  "drained",
  "pooled",
  "warded",
  "squatted",
  "stationed",
  "displaced",
  "hung",
  "marvered",
  "unpinned",
  "shed",
  "sealed",
  "rinsed",
  "vacant",
  "postern",
  "sluice",
]);
export const BANNED_NAMES = Object.freeze([
  "Peal",
  "Belfry",
  "Campanile",
  "Change",
  "Sally",
  "Treble",
  "Tenor",
  "Clapper",
  "Bellcote",
  "Postern",
  "Sluice",
  "Alidade",
  "Callboard",
]);
export const FORBIDDEN_UI = Object.freeze([
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "postern-gate",
  "night bailey",
  "plane-table",
  "millimeter-slider",
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

function versionParts(value) {
  const match = String(value || "").match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function cmpVersion(a, b) {
  const left = versionParts(a);
  const right = versionParts(b);
  if (!left || !right) return null;
  for (let i = 0; i < 3; i += 1) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return 0;
}

export function inBrokenRange(version) {
  const from = cmpVersion(version, BROKEN_FROM);
  const to = cmpVersion(version, BROKEN_TO);
  return from != null && to != null && from >= 0 && to <= 0;
}

export function inWorkingRange(version) {
  const cmp = cmpVersion(version, LAST_WORKING_VERSION);
  return cmp != null && cmp <= 0;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    pluginSessionStartRegistered: null,
    pluginSessionStartDispatched: null,
    settingsSessionStartRegistered: null,
    settingsSessionStartDispatched: null,
    hooksCount: null,
    additionalContextDelivered: null,
    matcherPresent: null,
    errorLogged: null,
    reloadPluginsCountsAll: null,
    cousin: "",
    claudeVersion: "",
    platform: "",
    terminal: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedPealed();
}

export function seedPealed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "settings",
    pluginSessionStartRegistered: 0,
    pluginSessionStartDispatched: 0,
    settingsSessionStartRegistered: SETTINGS_FIRED,
    settingsSessionStartDispatched: SETTINGS_FIRED,
    hooksCount: SETTINGS_FIRED,
    additionalContextDelivered: SETTINGS_FIRED,
    matcherPresent: true,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    terminal: TERMINAL,
    outputText:
      "pealed; settings.json three SessionStart handlers all fire and delivered their additionalContext (two commands in one matcher group, plus a second group); board 3/3; idle word pealed",
  };
}

export function seedFirstWins() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: PLUGIN_REGISTERED,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    terminal: TERMINAL,
    outputText:
      "first-wins; /hooks counts 3 plugins; only first peals; 1 struck + 2 muted; no error logged; registration succeeds; dispatch does not; Claude Code 2.1.252; Windows; Windows Terminal; no matcher key",
  };
}

export function seedRegisteredNotPealed() {
  return {
    seed: "registered-not-pealed",
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: PLUGIN_REGISTERED,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "registered-not-pealed; registry counts 3 plugin SessionStart hooks; peal strikes 1; registration ≠ dispatch",
  };
}

export function seedSettingsAllFire() {
  return {
    seed: "settings-all-fire",
    source: "settings",
    pluginSessionStartRegistered: 0,
    pluginSessionStartDispatched: 0,
    settingsSessionStartRegistered: SETTINGS_FIRED,
    settingsSessionStartDispatched: SETTINGS_FIRED,
    hooksCount: SETTINGS_FIRED,
    additionalContextDelivered: SETTINGS_FIRED,
    matcherPresent: true,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "settings-all-fire; hooks defined in settings.json are unaffected; three registered (two commands in one matcher group, plus a second group) and all three ran and delivered their additionalContext",
  };
}

export function seedPluginOnlyDrop() {
  return {
    seed: "plugin-only-drop",
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: SETTINGS_FIRED,
    settingsSessionStartDispatched: SETTINGS_FIRED,
    hooksCount: 6,
    additionalContextDelivered: 4,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "plugin-only-drop; the problem is specific to plugin-contributed hooks; settings.json SessionStart hooks still fire",
  };
}

export function seedSilentNoError() {
  return {
    seed: "silent-no-error",
    source: "plugin",
    pluginSessionStartRegistered: 2,
    pluginSessionStartDispatched: 1,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: 2,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "silent-no-error; the other never executes and no error was logged",
  };
}

export function seedHooksCountLies() {
  return {
    seed: "hooks-count-lies",
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: PLUGIN_REGISTERED,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "hooks-count-lies; /hooks count all hooks, so registration succeeds but dispatch does not",
  };
}

export function seedReloadPluginsOk() {
  return {
    seed: "reload-plugins-ok",
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: PLUGIN_REGISTERED,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "reload-plugins-ok; /reload-plugins and /hooks count all hooks, so registration succeeds but dispatch does not",
  };
}

export function seedAdditionalContextOne() {
  return {
    seed: "additionalContext-one",
    source: "plugin",
    pluginSessionStartRegistered: 2,
    pluginSessionStartDispatched: 1,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: 2,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "additionalContext-one; only one hook's context arrives; the other leaves no transcript entry",
  };
}

export function seedRegression216() {
  return {
    seed: "regression-216",
    source: "plugin",
    pluginSessionStartRegistered: PLUGIN_REGISTERED,
    pluginSessionStartDispatched: PLUGIN_PEALED,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: PLUGIN_REGISTERED,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    outputText:
      "regression-216; v2.1.216 – v2.1.252 (2026-07-21 → 2026-09-01) Broken — 18 versions, 85 sessions, never more than one; last working v2.1.198 (last seen 2026-07-02) multiple plugin SessionStart hooks ran per session, up to 4",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "plugin",
    pluginSessionStartRegistered: MAX_PEALS_WORKING,
    pluginSessionStartDispatched: MAX_PEALS_WORKING,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: MAX_PEALS_WORKING,
    additionalContextDelivered: MAX_PEALS_WORKING,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    claudeVersion: LAST_WORKING_VERSION,
    platform: PLATFORM,
    outputText:
      "hold; up to v2.1.198 (last seen 2026-07-02) Working — multiple plugin SessionStart hooks ran per session, up to 4; all hooks should fire",
  };
}

export function seedCousin() {
  return {
    seed: "plugin-only-drop",
    issue: COUSIN_ISSUE,
    source: "plugin",
    pluginSessionStartRegistered: 1,
    pluginSessionStartDispatched: 1,
    settingsSessionStartRegistered: 0,
    settingsSessionStartDispatched: 0,
    hooksCount: 1,
    additionalContextDelivered: 0,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    cousin: "88086",
    claudeVersion: "2.1.236",
    platform: "macos",
    outputText:
      "cousin-not-primary; #88086 OPEN — VS Code extension: SessionStart plugin hook additionalContext logged as succeeded but never injected into model context",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.carillon && typeof src.carillon === "object" && src.carillon) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.peal && typeof src.peal === "object" && src.peal) ||
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
    pluginSessionStartRegistered: firstNum(
      nested.pluginSessionStartRegistered,
      nested.plugin_session_start_registered,
      nested.registeredPluginSessionStart,
      src.pluginSessionStartRegistered,
    ),
    pluginSessionStartDispatched: firstNum(
      nested.pluginSessionStartDispatched,
      nested.plugin_session_start_dispatched,
      nested.dispatched,
      nested.pealedCount,
      src.pluginSessionStartDispatched,
    ),
    settingsSessionStartRegistered: firstNum(
      nested.settingsSessionStartRegistered,
      nested.settings_session_start_registered,
      src.settingsSessionStartRegistered,
    ),
    settingsSessionStartDispatched: firstNum(
      nested.settingsSessionStartDispatched,
      nested.settings_session_start_dispatched,
      src.settingsSessionStartDispatched,
    ),
    hooksCount: firstNum(nested.hooksCount, nested.hooks_count, src.hooksCount),
    additionalContextDelivered: firstNum(
      nested.additionalContextDelivered,
      nested.additional_context_delivered,
      src.additionalContextDelivered,
    ),
    matcherPresent: firstBool(
      nested.matcherPresent,
      nested.matcher_present,
      src.matcherPresent,
    ),
    errorLogged: firstBool(nested.errorLogged, nested.error_logged, src.errorLogged),
    reloadPluginsCountsAll: firstBool(
      nested.reloadPluginsCountsAll,
      nested.reload_plugins_counts_all,
      src.reloadPluginsCountsAll,
    ),
    cousin: firstText(nested.cousin, src.cousin),
    claudeVersion: firstText(
      nested.claudeVersion,
      nested.claude_version,
      nested.version,
      src.claudeVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    terminal: firstText(nested.terminal, src.terminal),
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
    row.pluginSessionStartRegistered == null &&
    row.pluginSessionStartDispatched == null &&
    row.settingsSessionStartRegistered == null &&
    row.settingsSessionStartDispatched == null &&
    row.hooksCount == null &&
    row.additionalContextDelivered == null &&
    row.matcherPresent == null &&
    row.errorLogged == null &&
    row.reloadPluginsCountsAll == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedPealed,
  [SEEDED_WORD]: seedFirstWins,
  "registered-not-pealed": seedRegisteredNotPealed,
  "settings-all-fire": seedSettingsAllFire,
  "plugin-only-drop": seedPluginOnlyDrop,
  "silent-no-error": seedSilentNoError,
  "hooks-count-lies": seedHooksCountLies,
  "reload-plugins-ok": seedReloadPluginsOk,
  "additionalContext-one": seedAdditionalContextOne,
  "regression-216": seedRegression216,
  hold: seedHold,
  cousin: seedCousin,
  88086: seedCousin,
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
    return { ...seedFirstWins(), ...cloned, ...raw };
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
  const pluginReg = row.pluginSessionStartRegistered;
  const pluginPeal = row.pluginSessionStartDispatched;
  const settingsReg = row.settingsSessionStartRegistered;
  const settingsPeal = row.settingsSessionStartDispatched;
  const pluginMismatch =
    pluginReg != null && pluginPeal != null && pluginReg !== pluginPeal;
  const pluginFirstWins =
    pluginReg != null &&
    pluginPeal != null &&
    pluginReg > 1 &&
    pluginPeal === 1;
  const settingsAllFire =
    settingsReg != null &&
    settingsPeal != null &&
    settingsReg > 0 &&
    settingsReg === settingsPeal;
  const pluginAllFire =
    pluginReg != null &&
    pluginPeal != null &&
    pluginReg > 1 &&
    pluginReg === pluginPeal;
  const registryLies =
    (row.hooksCount != null &&
      pluginReg != null &&
      row.hooksCount >= pluginReg &&
      pluginMismatch) ||
    /hooks-count-lies|\/hooks count/i.test(text);
  const silent =
    row.errorLogged === false || /no error|silent-no-error/i.test(text);
  const reloadOk =
    row.reloadPluginsCountsAll === true ||
    /reload-plugins-ok|\/reload-plugins/i.test(text);
  const oneContext =
    row.additionalContextDelivered === 1 &&
    ((pluginReg != null && pluginReg > 1) ||
      /additionalContext-one|only one hook's context/i.test(text));
  const noMatcher =
    row.matcherPresent === false || /no matcher key/i.test(text);
  const pluginOnly =
    row.source === "plugin" ||
    /plugin-only-drop|plugin-contributed|specific to plugin/i.test(text);
  const settingsSource = row.source === "settings" || settingsAllFire;
  const broken = inBrokenRange(row.claudeVersion) || named === "regression-216";
  const working = inWorkingRange(row.claudeVersion) && pluginAllFire;
  const firstWins =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "settings-all-fire" &&
    (pluginFirstWins ||
      named === SEEDED_WORD ||
      /first-wins|first wins|registered first wins/i.test(text));
  const pealed =
    named === IDLE_WORD ||
    (settingsAllFire && !pluginFirstWins && named !== SEEDED_WORD) ||
    (working && named === "hold");
  const cousinOnly =
    (row.issue === COUSIN_ISSUE ||
      row.cousin === "88086" ||
      /cousin-not-primary|#88086/i.test(text)) &&
    !firstWins &&
    named !== SEEDED_WORD;
  return {
    pluginReg,
    pluginPeal,
    settingsReg,
    settingsPeal,
    pluginMismatch,
    pluginFirstWins,
    settingsAllFire,
    pluginAllFire,
    registryLies,
    silent,
    reloadOk,
    oneContext,
    noMatcher,
    pluginOnly,
    settingsSource,
    broken,
    working,
    firstWins,
    pealed,
    cousinOnly,
    named,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.pealed && !flags.firstWins) chips.push("pealed");
  if (flags.firstWins) chips.push("first-wins");
  if (flags.pluginMismatch) chips.push("registered-not-pealed");
  if (flags.settingsAllFire) chips.push("settings-all-fire");
  if (flags.pluginOnly && flags.pluginMismatch) chips.push("plugin-only-drop");
  if (flags.silent && flags.pluginMismatch) chips.push("silent-no-error");
  if (flags.registryLies) chips.push("hooks-count-lies");
  if (flags.reloadOk && flags.pluginMismatch) chips.push("reload-plugins-ok");
  if (flags.oneContext) chips.push("additionalContext-one");
  if (flags.broken && (flags.firstWins || flags.pluginMismatch)) {
    chips.push("regression-216");
  }
  if ((flags.pealed || flags.pluginAllFire || flags.named === "hold") && !flags.firstWins) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "pealed") {
    reasons.push(
      "pealed; settings.json three SessionStart handlers all fire and delivered their additionalContext; board 3/3",
    );
    reasons.push("hold: the peal scores; every registered settings bell strikes");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; all hooks should fire; up to v2.1.198 multiple plugin SessionStart hooks ran per session, up to 4",
    );
  }
  if (verdict === "first-wins" || flags.firstWins) {
    reasons.push(
      `first-wins; whichever plugin SessionStart is registered first wins; the rest are dropped; registry ${flags.pluginReg ?? PLUGIN_REGISTERED}, peal ${flags.pluginPeal ?? PLUGIN_PEALED}`,
    );
  }
  if (flags.pluginMismatch || verdict === "registered-not-pealed") {
    reasons.push(
      "registered-not-pealed; /hooks still count every hook; dispatch does not match the registry",
    );
  }
  if (flags.settingsAllFire || verdict === "settings-all-fire") {
    reasons.push(
      "settings-all-fire; hooks defined in settings.json are unaffected; three ran and delivered additionalContext",
    );
  }
  if (flags.pluginOnly || verdict === "plugin-only-drop") {
    reasons.push(
      "plugin-only-drop; the problem is specific to plugin-contributed hooks of the same shape, no matcher key",
    );
  }
  if (flags.silent || verdict === "silent-no-error") {
    reasons.push(
      "silent-no-error; the other never executes and no error was logged",
    );
  }
  if (flags.registryLies || verdict === "hooks-count-lies") {
    reasons.push(
      "hooks-count-lies; /hooks count all hooks, so registration succeeds but dispatch does not",
    );
  }
  if (flags.reloadOk || verdict === "reload-plugins-ok") {
    reasons.push(
      "reload-plugins-ok; /reload-plugins counts all hooks; registration looks healthy",
    );
  }
  if (flags.oneContext || verdict === "additionalContext-one") {
    reasons.push(
      "additionalContext-one; only one hook's context arrives; the other leaves no transcript entry",
    );
  }
  if (flags.broken || verdict === "regression-216") {
    reasons.push(
      `regression-216; v${BROKEN_FROM} – v${BROKEN_TO} (${BROKEN_FROM_DATE} → ${BROKEN_TO_DATE}) Broken — ${BROKEN_VERSION_COUNT} versions, ${BROKEN_SESSION_COUNT} sessions, never more than one`,
    );
  }
  if (flags.working) {
    reasons.push(
      `working range; up to v${LAST_WORKING_VERSION} (last seen ${LAST_WORKING_SEEN}) multiple plugin SessionStart hooks ran per session, up to ${MAX_PEALS_WORKING}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin #88086 is not Carillon; VS Code additionalContext inject miss is cite-only",
    );
  }
  if (verdict === "first-wins" || flags.firstWins) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "pealed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.pealed || !flags.firstWins)) return "pealed";
  if (named === "hold" && !flags.firstWins) return "hold";
  if (named === SEEDED_WORD) return "first-wins";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.firstWins) return "first-wins";
  if (flags.pluginAllFire && flags.working) return "hold";
  if (flags.settingsAllFire && !flags.pluginFirstWins) return "pealed";
  if (flags.pluginMismatch) return "registered-not-pealed";
  if (flags.pealed) return "pealed";
  return "pealed";
}

function boardOf(flags, ticket, verdict) {
  const registered = flags.pluginReg ?? flags.settingsReg ?? 0;
  const struck =
    verdict === "pealed" || verdict === "hold" || verdict === "settings-all-fire"
      ? flags.settingsPeal ?? flags.pluginPeal ?? registered
      : flags.pluginPeal ?? 0;
  const muted = Math.max(0, (flags.pluginReg ?? 0) - (flags.pluginPeal ?? 0));
  if (verdict === "first-wins" || flags.firstWins) {
    return {
      registered: flags.pluginReg ?? PLUGIN_REGISTERED,
      struck: flags.pluginPeal ?? PLUGIN_PEALED,
      muted: (flags.pluginReg ?? PLUGIN_REGISTERED) - (flags.pluginPeal ?? PLUGIN_PEALED),
      first: "struck — first-registered plugin SessionStart",
      rest: "muted — dropped with no error",
      candle: "gutters — registry N, peal 1",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      registered: flags.pluginReg ?? MAX_PEALS_WORKING,
      struck: flags.pluginPeal ?? MAX_PEALS_WORKING,
      muted: 0,
      first: "struck — working-range plugin SessionStart",
      rest: "struck — multiple plugin SessionStart hooks ran, up to 4",
      candle: "steady — the peal holds",
      note: "Hold: all hooks should fire.",
    };
  }
  return {
    registered: flags.settingsReg ?? SETTINGS_FIRED,
    struck: flags.settingsPeal ?? SETTINGS_FIRED,
    muted: 0,
    first: "struck — settings.json SessionStart",
    rest: "struck — all three delivered additionalContext",
    candle: "steady — board 3/3; idle word pealed",
    note: "Pealed: settings.json three SessionStart handlers all fire.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const firstWins = verdict === "first-wins" || flags.firstWins;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    pealed: verdict === "pealed" || (flags.pealed && !firstWins),
    firstWins,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: boardOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91250 || name === "91250") {
    return analyze(seedFirstWins());
  }
  if (name === "registered-not-pealed") return analyze(seedRegisteredNotPealed());
  if (name === "settings-all-fire") return analyze(seedSettingsAllFire());
  if (name === "plugin-only-drop") return analyze(seedPluginOnlyDrop());
  if (name === "silent-no-error") return analyze(seedSilentNoError());
  if (name === "hooks-count-lies") return analyze(seedHooksCountLies());
  if (name === "reload-plugins-ok") return analyze(seedReloadPluginsOk());
  if (name === "additionalContext-one") return analyze(seedAdditionalContextOne());
  if (name === "regression-216") return analyze(seedRegression216());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "pealed") {
    return analyze(seedPealed());
  }
  if (name === 88086 || name === "88086" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedPealed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "first-wins" || (result.firstWins && result.alarm)
          ? `first-wins peal #${FEATURED_ISSUE}: /hooks counts ${result.ticket.pluginSessionStartRegistered ?? PLUGIN_REGISTERED} plugin SessionStart hooks; only the first-registered peals; the rest are dropped with no error. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? `hold. Up to v${LAST_WORKING_VERSION} multiple plugin SessionStart hooks ran per session, up to ${MAX_PEALS_WORKING}. Score the peal.`
            : result.verdict === "settings-all-fire"
              ? "settings-all-fire. settings.json three SessionStart handlers all fire and delivered additionalContext."
              : `pealed carillon. Idle word ${IDLE_WORD}. settings.json three SessionStart handlers all fire; board 3/3.`,
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
