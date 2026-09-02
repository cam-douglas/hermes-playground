#!/usr/bin/env node
/**
 * Geneva — watchmaker geneva-drive / maltese-cross atelier classifier.
 * A geneva that cannot index bypass is not a hold.
 * Score the cross or admit indexed.
 *
 *   echo '{"settingsSourceListed":true,"valueApplied":false,"bypassInCycle":false}' | node geneva.mjs
 *   node geneva.mjs ticket.json
 *
 * Idle word is indexed (HOLD: project-local defaultMode honored;
 * bypassPermissions present in Shift+Tab cycle; session starts in bypass).
 * Seeded state is jumped / #91296 (local file listed as a setting source
 * but bypass slot missing from the cycle; value ignored).
 * NEVER idle as jumped, chocked, rolled, clasped, sprung, drained,
 * hinged, pealed, warded, pooled, cased, aired, sifted, stocked,
 * stationed, marvered, unpinned, rinsed, literal, choked.
 *
 * Primary #91296: permissions.defaultMode: "bypassPermissions" in a
 * project's .claude/settings.local.json is silently ignored. Bypass
 * never appears in the Shift+Tab mode cycle; session starts in a
 * different mode. User-level ~/.claude/settings.json has
 * defaultMode: "auto"; project-local has bypassPermissions. Docs:
 * project-local should take precedence; a defaultMode other than
 * "auto" should apply from any settings file. Actual cycle: only
 * default (manual), acceptEdits, plan, and auto — bypassPermissions
 * completely absent. /status shows Setting sources: User settings,
 * Shared project settings, Project local settings — file loaded,
 * value not applied to the cycle. Workaround: claude --permission-mode
 * bypassPermissions and claude --dangerously-skip-permissions restore
 * bypass to the cycle. Isolates settings-file resolution, not bypass
 * disabled for the account. Env: Claude Code 2.1.257, CLI terminal,
 * macOS, Claude Max personal; /Library/Application Support/ClaudeCode/managed-settings.json
 * empty. Comment (uyu423): same after upgrade to 2.1.258; neither
 * user auto nor project bypass applied; only --dangerously-skip-permissions
 * works.
 *
 * Hypothesis only (NON-BINDING): settings merger lists project-local
 * as a source but drops defaultMode: bypassPermissions from the cycle
 * set when user-level defaultMode is "auto". Flags inject the mode
 * after cycle construction. Do not claim a root cause in Claude Code
 * source you have not seen. Verify against the issue text and discard
 * if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the cross is indexed or jumped.
 *
 * NOT Postern #91223 (anyone can bar a postern / who-can-lock).
 * NOT Pintle #91226 (PreToolUse Bash relative-path deadlock).
 * NOT Wastebook #91270 (always-allow leak).
 * NOT Chatelaine/Bitting (OAuth).
 * NOT #86478 (flags also ignored; session stays auto — cite-only; here flags work).
 * NOT #75235 (Desktop settings.json defaultMode — cite-only).
 * NOT #88051 (home settings.local.json only in $HOME — cite-only).
 * NOT #90415 (Browser confirmation ignores allow/defaultMode — cite-only).
 * NOT Scotch #91324 / Fibula #91306 / Virgule #91337 / Riddle #91327 /
 * Garner #91246 / Carillon / Sluice #91265.
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick.
 * Product name stays Geneva. Do not rename to Settings / Cycle /
 * Bypass / Permissions / Mode / Scotch / Fibula / Virgule / Riddle /
 * Garner / Pintle / Postern.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "indexed",
  "jumped",
  "settings-loaded",
  "value-ignored",
  "cycle-missing-bypass",
  "flag-workaround",
  "user-auto-conflict",
  "has-repro",
  "hold",
]);
export const IDLE_WORD = "indexed";
export const SEEDED_WORD = "jumped";
export const HOLD_VERDICTS = Object.freeze(["indexed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91296;
export const PRIMARY_ISSUES = Object.freeze([91296]);
export const COUSINS = Object.freeze([75235, 86478, 88051, 90415, 83421]);
export const COUSIN_ISSUE = 75235;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
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
  "chatelaine",
  "bitting",
  "wastebook",
  "woodworking",
  "mm-slider",
  "millrace",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91296";
export const TITLE =
  "defaultMode: bypassPermissions in .claude/settings.local.json silently ignored, missing from Shift+Tab cycle";
export const FILED_AT = "2026-09-01T19:03:16Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:permissions",
]);
export const REPORTER = "jimmyjayp";
export const COMMENTER = "uyu423";
export const SETTINGS_LOCAL = ".claude/settings.local.json";
export const USER_SETTINGS = "~/.claude/settings.json";
export const MANAGED_SETTINGS =
  "/Library/Application Support/ClaudeCode/managed-settings.json";
export const DEFAULT_MODE = "bypassPermissions";
export const USER_DEFAULT_MODE = "auto";
export const CYCLE_ACTUAL = Object.freeze([
  "default",
  "acceptEdits",
  "plan",
  "auto",
]);
export const CYCLE_EXPECTED = Object.freeze([
  "default",
  "acceptEdits",
  "plan",
  "auto",
  "bypassPermissions",
]);
export const STATUS_SOURCES =
  "Setting sources: User settings, Shared project settings, Project local settings";
export const SHIFT_TAB = "Shift+Tab";
export const FLAG_PERMISSION_MODE = "--permission-mode bypassPermissions";
export const FLAG_DANGEROUSLY = "--dangerously-skip-permissions";
export const VERSION = "2.1.257";
export const COMMENT_VERSION = "2.1.258";
export const PLATFORM = "macos";
export const INTERFACE = "CLI terminal";
export const PLAN = "Claude Max personal";
export const HUB_LINE =
  "11:50 geneva: a geneva that cannot index bypass is not a hold. Score the cross or admit indexed.";
export const MARK = "11:50 / hermes catalog #112 / #91296";
export const PHRASE =
  "A geneva that cannot index bypass is not a hold. Score the cross or admit indexed.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: settings merger lists project-local as a source but drops defaultMode: bypassPermissions from the cycle set when user-level defaultMode is \"auto\". Flags inject the mode after cycle construction. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is PROJECT .claude/settings.local.json permissions.defaultMode: bypassPermissions IS SILENTLY IGNORED FOR THE SHIFT+TAB CYCLE EVEN THOUGH /status LISTS THE FILE AS A SETTING SOURCE; CLI FLAGS STILL RESTORE THE MODE. permissions.defaultMode: \"bypassPermissions\" in a project's .claude/settings.local.json is silently ignored. Bypass never appears in the Shift+Tab mode cycle; session starts in a different mode. User-level ~/.claude/settings.json has defaultMode: \"auto\"; project-local has bypassPermissions. Docs: project-local should take precedence; a defaultMode other than \"auto\" should apply from any settings file. Actual cycle: only default (manual), acceptEdits, plan, and auto — bypassPermissions completely absent. /status shows Setting sources: User settings, Shared project settings, Project local settings — file loaded, value not applied to the cycle. Workaround: claude --permission-mode bypassPermissions and claude --dangerously-skip-permissions restore bypass to the cycle. Isolates settings-file resolution, not bypass disabled for the account. Env: Claude Code 2.1.257, CLI terminal, macOS, Claude Max personal; /Library/Application Support/ClaudeCode/managed-settings.json empty. Comment (uyu423): same after upgrade to 2.1.258; neither user auto nor project bypass applied; only --dangerously-skip-permissions works. NOT Postern #91223 (anyone can bar a postern / who-can-lock). NOT Pintle #91226 (PreToolUse Bash relative-path deadlock). NOT Wastebook #91270 (always-allow leak). NOT Chatelaine/Bitting (OAuth). NOT #86478 (flags also ignored; session stays auto — cite-only; here flags work). NOT #75235 (Desktop settings.json defaultMode — cite-only). NOT #88051 (home settings.local.json only in $HOME — cite-only). NOT #90415 (Browser confirmation ignores allow/defaultMode — cite-only). NOT Scotch #91324 / Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 / Carillon / Sluice #91265. NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick. Product name stays Geneva.";
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
]);
export const BANNED_NAMES = Object.freeze([
  "Settings",
  "Cycle",
  "Bypass",
  "Permissions",
  "Mode",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Postern",
]);
export const FORBIDDEN_UI = Object.freeze([
  "timber scotch",
  "wagon wheel",
  "iron rail",
  "scotch-block",
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
  "postern door",
  "night bailey",
  "plane-table",
  "rudder pintle",
  "pintle hinge",
  "gudgeon",
  "woodworking",
  "mm-slider",
  "wagon-scotch",
  "cloak-pin",
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
    settingsFile: "",
    userSettingsFile: "",
    managedSettingsFile: "",
    defaultMode: "",
    userDefaultMode: "",
    projectDefaultMode: "",
    settingsLocalPresent: null,
    defaultModeBypass: null,
    projectLocalHonored: null,
    bypassInCycle: null,
    sessionStartsBypass: null,
    settingsSourceListed: null,
    valueApplied: null,
    cycleModes: [],
    flagRestores: null,
    permissionModeFlag: null,
    dangerouslySkip: null,
    version: "",
    commentVersion: "",
    platform: "",
    interface: "",
    plan: "",
    managedSettingsEmpty: null,
    hasRepro: null,
    reporter: "",
    commenter: "",
    cousin: "",
    outputText: "",
  };
}

export function seedIndexed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    userSettingsFile: USER_SETTINGS,
    managedSettingsFile: MANAGED_SETTINGS,
    defaultMode: DEFAULT_MODE,
    userDefaultMode: USER_DEFAULT_MODE,
    projectDefaultMode: DEFAULT_MODE,
    settingsLocalPresent: true,
    defaultModeBypass: true,
    projectLocalHonored: true,
    bypassInCycle: true,
    sessionStartsBypass: true,
    settingsSourceListed: true,
    valueApplied: true,
    cycleModes: [...CYCLE_EXPECTED],
    flagRestores: false,
    permissionModeFlag: false,
    dangerouslySkip: false,
    version: VERSION,
    commentVersion: COMMENT_VERSION,
    platform: PLATFORM,
    interface: INTERFACE,
    plan: PLAN,
    managedSettingsEmpty: true,
    hasRepro: false,
    reporter: "",
    commenter: "",
    cousin: "",
    outputText:
      "indexed; project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass; idle word indexed",
  };
}

export function seedJumped() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    commenter: COMMENTER,
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    userSettingsFile: USER_SETTINGS,
    managedSettingsFile: MANAGED_SETTINGS,
    defaultMode: DEFAULT_MODE,
    userDefaultMode: USER_DEFAULT_MODE,
    projectDefaultMode: DEFAULT_MODE,
    settingsLocalPresent: true,
    defaultModeBypass: true,
    projectLocalHonored: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    settingsSourceListed: true,
    valueApplied: false,
    cycleModes: [...CYCLE_ACTUAL],
    flagRestores: true,
    permissionModeFlag: true,
    dangerouslySkip: true,
    version: VERSION,
    commentVersion: COMMENT_VERSION,
    platform: PLATFORM,
    interface: INTERFACE,
    plan: PLAN,
    managedSettingsEmpty: true,
    hasRepro: true,
    cousin: "",
    outputText:
      "jumped; #91296; .claude/settings.local.json listed as a setting source but bypassPermissions missing from Shift+Tab cycle; value ignored; default/acceptEdits/plan/auto only",
  };
}

export function seedSettingsLoaded() {
  return {
    seed: "settings-loaded",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    settingsLocalPresent: true,
    settingsSourceListed: true,
    valueApplied: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    projectLocalHonored: false,
    defaultModeBypass: true,
    version: VERSION,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "settings-loaded; /status Setting sources: User settings, Shared project settings, Project local settings; file loaded, value not applied to the cycle",
  };
}

export function seedValueIgnored() {
  return {
    seed: "value-ignored",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    defaultMode: DEFAULT_MODE,
    defaultModeBypass: true,
    settingsSourceListed: true,
    valueApplied: false,
    projectLocalHonored: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    version: VERSION,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "value-ignored; permissions.defaultMode: bypassPermissions in .claude/settings.local.json is silently ignored",
  };
}

export function seedCycleMissingBypass() {
  return {
    seed: "cycle-missing-bypass",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    defaultModeBypass: true,
    bypassInCycle: false,
    sessionStartsBypass: false,
    settingsSourceListed: true,
    valueApplied: false,
    projectLocalHonored: false,
    cycleModes: [...CYCLE_ACTUAL],
    version: VERSION,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "cycle-missing-bypass; Shift+Tab cycle only default (manual), acceptEdits, plan, and auto — bypassPermissions completely absent",
  };
}

export function seedFlagWorkaround() {
  return {
    seed: "flag-workaround",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    defaultModeBypass: true,
    bypassInCycle: false,
    sessionStartsBypass: false,
    settingsSourceListed: true,
    valueApplied: false,
    projectLocalHonored: false,
    flagRestores: true,
    permissionModeFlag: true,
    dangerouslySkip: true,
    version: VERSION,
    commentVersion: COMMENT_VERSION,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "flag-workaround; claude --permission-mode bypassPermissions and claude --dangerously-skip-permissions restore bypass to the cycle; isolates settings-file resolution, not bypass disabled for the account",
  };
}

export function seedUserAutoConflict() {
  return {
    seed: "user-auto-conflict",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    userSettingsFile: USER_SETTINGS,
    userDefaultMode: USER_DEFAULT_MODE,
    projectDefaultMode: DEFAULT_MODE,
    defaultModeBypass: true,
    settingsSourceListed: true,
    valueApplied: false,
    projectLocalHonored: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    version: VERSION,
    commentVersion: COMMENT_VERSION,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "user-auto-conflict; user-level ~/.claude/settings.json has defaultMode: auto; project-local has bypassPermissions; docs say project-local should take precedence",
  };
}

export function seedHasRepro() {
  return {
    seed: "has-repro",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    defaultModeBypass: true,
    settingsSourceListed: true,
    valueApplied: false,
    projectLocalHonored: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    version: VERSION,
    platform: PLATFORM,
    hasRepro: true,
    reporter: REPORTER,
    outputText:
      "has-repro; jimmyjayp filed #91296; labels include has repro; platform:macos area:permissions; Claude Code 2.1.257 CLI terminal macOS",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    settingsFile: SETTINGS_LOCAL,
    defaultMode: DEFAULT_MODE,
    defaultModeBypass: true,
    projectLocalHonored: true,
    bypassInCycle: true,
    sessionStartsBypass: true,
    settingsSourceListed: true,
    valueApplied: true,
    cycleModes: [...CYCLE_EXPECTED],
    flagRestores: false,
    version: VERSION,
    platform: PLATFORM,
    hasRepro: false,
    outputText:
      "hold; project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass; the cross is indexed",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "75235",
    version: VERSION,
    outputText:
      "cousin-not-primary; #75235 Desktop settings.json defaultMode — cite; not the #91296 project-local settings.local.json Shift+Tab jump",
  };
}

export function emptyTicket() {
  return seedIndexed();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.geneva && typeof src.geneva === "object" && src.geneva) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.cross && typeof src.cross === "object" && src.cross) ||
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
    commenter: firstText(nested.commenter, src.commenter),
    source: firstText(nested.source, src.source),
    settingsFile: firstText(
      nested.settingsFile,
      nested.settings_file,
      src.settingsFile,
    ),
    userSettingsFile: firstText(
      nested.userSettingsFile,
      nested.user_settings_file,
      src.userSettingsFile,
    ),
    managedSettingsFile: firstText(
      nested.managedSettingsFile,
      nested.managed_settings_file,
      src.managedSettingsFile,
    ),
    defaultMode: firstText(
      nested.defaultMode,
      nested.default_mode,
      src.defaultMode,
    ),
    userDefaultMode: firstText(
      nested.userDefaultMode,
      nested.user_default_mode,
      src.userDefaultMode,
    ),
    projectDefaultMode: firstText(
      nested.projectDefaultMode,
      nested.project_default_mode,
      src.projectDefaultMode,
    ),
    settingsLocalPresent: firstBool(
      nested.settingsLocalPresent,
      nested.settings_local_present,
      src.settingsLocalPresent,
    ),
    defaultModeBypass: firstBool(
      nested.defaultModeBypass,
      nested.default_mode_bypass,
      src.defaultModeBypass,
    ),
    projectLocalHonored: firstBool(
      nested.projectLocalHonored,
      nested.project_local_honored,
      src.projectLocalHonored,
    ),
    bypassInCycle: firstBool(
      nested.bypassInCycle,
      nested.bypass_in_cycle,
      src.bypassInCycle,
    ),
    sessionStartsBypass: firstBool(
      nested.sessionStartsBypass,
      nested.session_starts_bypass,
      src.sessionStartsBypass,
    ),
    settingsSourceListed: firstBool(
      nested.settingsSourceListed,
      nested.settings_source_listed,
      src.settingsSourceListed,
    ),
    valueApplied: firstBool(
      nested.valueApplied,
      nested.value_applied,
      src.valueApplied,
    ),
    cycleModes: Array.isArray(nested.cycleModes)
      ? nested.cycleModes
      : Array.isArray(nested.cycle_modes)
        ? nested.cycle_modes
        : Array.isArray(src.cycleModes)
          ? src.cycleModes
          : [],
    flagRestores: firstBool(
      nested.flagRestores,
      nested.flag_restores,
      src.flagRestores,
    ),
    permissionModeFlag: firstBool(
      nested.permissionModeFlag,
      nested.permission_mode_flag,
      src.permissionModeFlag,
    ),
    dangerouslySkip: firstBool(
      nested.dangerouslySkip,
      nested.dangerously_skip,
      src.dangerouslySkip,
    ),
    version: firstText(nested.version, src.version),
    commentVersion: firstText(
      nested.commentVersion,
      nested.comment_version,
      src.commentVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    interface: firstText(nested.interface, src.interface),
    plan: firstText(nested.plan, src.plan),
    managedSettingsEmpty: firstBool(
      nested.managedSettingsEmpty,
      nested.managed_settings_empty,
      src.managedSettingsEmpty,
    ),
    hasRepro: firstBool(nested.hasRepro, nested.has_repro, src.hasRepro),
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
    row.settingsSourceListed == null &&
    row.valueApplied == null &&
    row.bypassInCycle == null &&
    row.sessionStartsBypass == null &&
    row.projectLocalHonored == null &&
    row.defaultModeBypass == null &&
    row.flagRestores == null &&
    row.settingsLocalPresent == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedIndexed,
  [SEEDED_WORD]: seedJumped,
  "settings-loaded": seedSettingsLoaded,
  "value-ignored": seedValueIgnored,
  "cycle-missing-bypass": seedCycleMissingBypass,
  "flag-workaround": seedFlagWorkaround,
  "user-auto-conflict": seedUserAutoConflict,
  "has-repro": seedHasRepro,
  hold: seedHold,
  cousin: seedCousin,
  75235: seedCousin,
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
    return { ...seedJumped(), ...cloned, ...raw };
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
    ticket.settingsFile,
    ticket.defaultMode,
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

export function isIndexed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.projectLocalHonored === true &&
    row.bypassInCycle === true &&
    row.sessionStartsBypass === true &&
    row.valueApplied === true
  ) {
    return true;
  }
  return false;
}

export function isJumped(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.settingsSourceListed === true &&
    (row.valueApplied === false ||
      row.bypassInCycle === false ||
      row.projectLocalHonored === false ||
      row.sessionStartsBypass === false)
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
      /cousin-not-primary|#75235|#86478|#88051|#90415|#83421/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const jumpedNow = !cousinOnly && isJumped(row);
  const indexedNow = !jumpedNow && isIndexed(row);
  const settingsLoaded =
    row.settingsSourceListed === true ||
    named === "settings-loaded" ||
    /settings-loaded|Setting sources|Project local settings/i.test(text);
  const valueIgnored =
    row.valueApplied === false ||
    named === "value-ignored" ||
    /value-ignored|silently ignored|value not applied/i.test(text);
  const cycleMissing =
    row.bypassInCycle === false ||
    named === "cycle-missing-bypass" ||
    /cycle-missing-bypass|completely absent|missing from Shift\+Tab/i.test(
      text,
    );
  const flagWorkaround =
    row.flagRestores === true ||
    row.permissionModeFlag === true ||
    row.dangerouslySkip === true ||
    named === "flag-workaround" ||
    /flag-workaround|--permission-mode|--dangerously-skip-permissions/i.test(
      text,
    );
  const userAutoConflict =
    row.userDefaultMode === USER_DEFAULT_MODE ||
    named === "user-auto-conflict" ||
    /user-auto-conflict|defaultMode: auto|user-level/i.test(text);
  const hasRepro =
    row.hasRepro === true ||
    named === "has-repro" ||
    /has-repro|has repro/i.test(text);
  const jumped =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (jumpedNow || named === SEEDED_WORD || /jumped|#91296/i.test(text));
  const indexed =
    named === IDLE_WORD ||
    named === "hold" ||
    (indexedNow && !jumped);
  return {
    named,
    cousinOnly,
    jumpedNow,
    indexedNow,
    settingsLoaded,
    valueIgnored,
    cycleMissing,
    flagWorkaround,
    userAutoConflict,
    hasRepro,
    jumped,
    indexed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.indexed && !flags.jumped) chips.push("indexed");
  if (flags.jumped) chips.push("jumped");
  if (flags.settingsLoaded && flags.jumped) chips.push("settings-loaded");
  if (flags.valueIgnored && flags.jumped) chips.push("value-ignored");
  if (flags.cycleMissing && flags.jumped) chips.push("cycle-missing-bypass");
  if (flags.flagWorkaround && flags.jumped) chips.push("flag-workaround");
  if (flags.userAutoConflict && flags.jumped) chips.push("user-auto-conflict");
  if (flags.hasRepro && flags.jumped) chips.push("has-repro");
  if ((flags.indexed || flags.named === "hold") && !flags.jumped) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "indexed") {
    reasons.push(
      "indexed; project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass",
    );
    reasons.push("hold: the cross is indexed; score treats honored project-local defaultMode");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; the cross is indexed",
    );
  }
  if (verdict === "jumped" || flags.jumped) {
    reasons.push(
      "jumped; #91296; .claude/settings.local.json listed as a setting source but bypassPermissions missing from Shift+Tab cycle; value ignored",
    );
  }
  if (flags.settingsLoaded || verdict === "settings-loaded") {
    reasons.push(
      `settings-loaded; /status ${STATUS_SOURCES}; file loaded, value not applied to the cycle`,
    );
  }
  if (flags.valueIgnored || verdict === "value-ignored") {
    reasons.push(
      `value-ignored; permissions.defaultMode: ${DEFAULT_MODE} in ${SETTINGS_LOCAL} is silently ignored`,
    );
  }
  if (flags.cycleMissing || verdict === "cycle-missing-bypass") {
    reasons.push(
      `cycle-missing-bypass; ${SHIFT_TAB} cycle only ${CYCLE_ACTUAL.join(", ")} — ${DEFAULT_MODE} completely absent`,
    );
  }
  if (flags.flagWorkaround || verdict === "flag-workaround") {
    reasons.push(
      `flag-workaround; ${FLAG_PERMISSION_MODE} and ${FLAG_DANGEROUSLY} restore bypass to the cycle; isolates settings-file resolution`,
    );
  }
  if (flags.userAutoConflict || verdict === "user-auto-conflict") {
    reasons.push(
      `user-auto-conflict; user-level ${USER_SETTINGS} has defaultMode: ${USER_DEFAULT_MODE}; project-local has ${DEFAULT_MODE}`,
    );
  }
  if (flags.hasRepro || verdict === "has-repro") {
    reasons.push(
      `has-repro; ${REPORTER} filed #${FEATURED_ISSUE}; labels include has repro; Claude Code ${VERSION}; comment ${COMMENTER} on ${COMMENT_VERSION}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Geneva; cite-only Desktop / home / flag / browser defaultMode cousins, not the project-local settings.local.json Shift+Tab jump",
    );
  }
  if (verdict === "jumped" || flags.jumped) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "indexed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.indexed || !flags.jumped)) return "indexed";
  if (named === "hold" && !flags.jumped) return "hold";
  if (named === SEEDED_WORD) return "jumped";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "indexed";
  if (flags.jumped) return "jumped";
  if (flags.indexed) return "indexed";
  return "indexed";
}

function crossOf(flags, ticket, verdict) {
  if (verdict === "jumped" || flags.jumped) {
    return {
      case: "jumped — local file listed; bypass slot missing",
      pin: "steel driving pin skips the bypass tooth; maltese-cross jumps",
      catch: `${ticket.settingsFile || SETTINGS_LOCAL} · ${STATUS_SOURCES} · cycle missing ${DEFAULT_MODE}`,
      cloak: "wheel jumps; value ignored",
      mark: "brass geneva aside; the cross jumped",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "indexed — project-local defaultMode honored",
      pin: "steel driving pin seats the bypass tooth; maltese-cross indexes",
      catch: "bypassPermissions in Shift+Tab · session starts in bypass",
      cloak: "wheel held; atelier quiet",
      mark: "brass geneva on the arbor; the cross is indexed",
      note: "Hold: the cross is indexed.",
    };
  }
  return {
    case: "indexed — project-local honored; bypass in the cycle",
    pin: "steel driving pin on the landing tooth; no jump",
    catch: "settings.local.json applied · Shift+Tab contains bypassPermissions",
    cloak: "wheel indexed on the jewel",
    mark: "brass geneva on the arbor; idle word indexed",
    note: "Indexed: the cross holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const jumped = verdict === "jumped" || flags.jumped;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    indexed: verdict === "indexed" || (flags.indexed && !jumped),
    jumped,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: crossOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91296 || name === "91296") {
    return analyze(seedJumped());
  }
  if (name === "settings-loaded") return analyze(seedSettingsLoaded());
  if (name === "value-ignored") return analyze(seedValueIgnored());
  if (name === "cycle-missing-bypass") return analyze(seedCycleMissingBypass());
  if (name === "flag-workaround") return analyze(seedFlagWorkaround());
  if (name === "user-auto-conflict") return analyze(seedUserAutoConflict());
  if (name === "has-repro") return analyze(seedHasRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "indexed" || name === "open") {
    return analyze(seedIndexed());
  }
  if (name === 75235 || name === "75235" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedIndexed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "jumped" || (result.jumped && result.alarm)
          ? `jumped geneva #${FEATURED_ISSUE}: ${SETTINGS_LOCAL} listed as a setting source but ${DEFAULT_MODE} missing from ${SHIFT_TAB} cycle; value ignored. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Project-local defaultMode honored. Score the cross."
            : `indexed geneva. Idle word ${IDLE_WORD}. Project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass.`,
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
