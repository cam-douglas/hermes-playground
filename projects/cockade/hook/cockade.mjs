#!/usr/bin/env node
/**
 * Cockade — milliner / hatter's cockade-bench classifier.
 * A cockade seated on ultracode with no opt-in, while the brim
 * ticket still reads xhigh, is not a hold. Score the brim or
 * admit unpinned.
 *
 *   echo '{"slider":"ultracode","header":"Fable 5 with xhigh effort"}' | node cockade.mjs
 *   node cockade.mjs ticket.json
 *
 * Idle word is unpinned (ultracode off; header honest; slider on
 * documented default high; no cockade on the hat).
 * Seeded state is cocked / #91033.
 * NEVER idle as cocked, armed, ultracode, cockade, rinsed, scrubbed,
 * stripped, lye, vacant, reserved, advowson, smutch, plain, seated,
 * bound, hallmarked, pointed, collapsed, spoiled, banked, misstruck,
 * hunting, traced, coupled, fallen, struck, torn, sealed, intact,
 * shed, hollow, dated, backed, cued, fresh, engaged, stood, muted,
 * liveried, penned, flagged, prompted, ghosted, widowed, discarded,
 * fabricated-verified, looped, empty-fork, clamped, detached,
 * regrown, excised, cauterized.
 *
 * Primary #91033: Ultracode arms with no ultracode setting in any
 * scope; header shows plain "with xhigh effort" while it is active.
 * Badge is truthful. Header mislabels. /effort xhigh is a silent
 * no-op because ultracode reports its level as xhigh.
 *
 * Hypothesis only (NON-BINDING): undocumented / spontaneous
 * ultracode arm (possibly a saved plain xhigh seated as ultracode)
 * plus a header that prints ultracode's internal reported level
 * (xhigh) so /effort xhigh is a silent no-op. Do not claim a root
 * cause in Claude Code source you have not seen.
 *
 * NOT Lye (#91020 env-scrub). NOT Advowson (#91005 Workflow name).
 * NOT Smutch (#90993 Icon\r). NOT Bitting (#90970 MCP mint).
 * NOT Puncheon (#90962 BOM). NOT Gnomon (#90954 mtime).
 * NOT Spoil (#90943 GIT_INDEX_FILE). NOT Pale (#90683).
 * NOT Pawl (#90784). NOT Ambo (#90685). NOT Chatelaine (#90647).
 * NOT Bulla MSIX. NOT Limpet process leak. NOT #91026 picker.
 * NOT #91028 MSIX RPC. NOT #91017 session index. NOT #91034.
 * NOT #91031 connectors-until-/login.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "cocked",
  "mislabeled",
  "silent-noop",
  "xhigh-mask",
  "no-opt-in",
  "slider-ultracode",
  "header-lie",
  "effort-xhigh",
  "workflows-armed",
  "settings-absent",
  "env-unset",
  "persist-miss",
  "badge-true",
  "fable-default",
  "undocumented",
  "unpinned",
  "documented-default",
]);
export const IDLE_WORD = "unpinned";
export const SEEDED_WORD = "cocked";
export const HOLD_VERDICTS = Object.freeze([
  "unpinned",
  "documented-default",
  "high-hold",
]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91033;
export const PRIMARY_ISSUES = Object.freeze([91033]);
export const SAME_CLASS = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
  "lye",
  "advowson",
  "smutch",
  "bitting",
  "puncheon",
  "gnomon",
  "spoil",
  "trammel",
  "pale",
  "pawl",
  "ambo",
  "chatelaine",
  "bulla",
  "limpet",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91033";
export const TITLE =
  'Ultracode arms with no ultracode setting in any scope; header shows plain "with xhigh effort" while it is active';
export const REPORTER = "kenflorian";
export const FILED_AT = "2026-08-31T16:46:22Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tui",
  "area:statusline",
]);
export const CLI_VERSION = "2.1.251";
export const PLATFORM = "Windows 11 Pro";
export const TERMINAL = "VS Code terminal (Git Bash)";
export const INSTALL = "npm-global";
export const PLAN = "Claude Max";
export const MODEL_FABLE = "Fable 5";
export const HEADER_SEEDED = "Fable 5 with xhigh effort";
export const SLIDER_SEEDED = "ultracode";
export const SLIDER_LABEL = "xhigh + workflows";
export const BADGE_SEEDED = "ultracode";
export const FABLE_DEFAULT_EFFORT = "high";
export const ULTRACODE_DEFAULT = "unset, so ultracode is off";
export const STATUSLINE_DOC =
  "Ultracode is not a distinct level and reports as `xhigh`";
export const CHANGELOG_243 =
  "Fixed the `/model` picker silently ignoring an Ultracode selection; picking Ultracode now applies it to the current session.";
export const HUB_LINE =
  "02:50 cockade: a cockade seated on ultracode with no opt-in is not a hold. Score the brim or admit unpinned.";
export const MARK = "02:50 / hermes catalog #100 / #91033";
export const PHRASE =
  "A cockade seated on ultracode with no opt-in, while the brim ticket still reads xhigh, is not a hold. Score the brim or admit unpinned.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as an undocumented / spontaneous ultracode arm (possibly a saved plain xhigh seated as ultracode) plus a header that prints ultracode's internal reported level (xhigh) so /effort xhigh is a silent no-op. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is UNDOCUMENTED ULTRACODE ARM + HEADER HIDES ULTRACODE AS \"xhigh effort\" + /effort xhigh SILENT NO-OP. NOT Lye env-scrub. NOT Advowson Workflow name silent built-in. NOT Smutch Icon\\r folder stamps. NOT Bitting Slack MCP mint exclusivity. NOT Puncheon BOM-less .ps1. NOT process leaks. NOT MSIX. NOT virtual-drive picker. NOT connectors-until-/login.";
export const FORBIDDEN_IDLE = Object.freeze([
  "cocked",
  "armed",
  "ultracode",
  "cockade",
  "rinsed",
  "scrubbed",
  "stripped",
  "lye",
  "vacant",
  "reserved",
  "advowson",
  "smutch",
  "plain",
  "seated",
  "bound",
  "hallmarked",
  "pointed",
  "collapsed",
  "spoiled",
  "banked",
  "misstruck",
  "hunting",
  "traced",
  "coupled",
  "fallen",
  "struck",
  "torn",
  "sealed",
  "intact",
  "shed",
  "hollow",
  "dated",
  "backed",
  "cued",
  "fresh",
  "engaged",
  "stood",
  "muted",
  "liveried",
  "penned",
  "flagged",
  "prompted",
  "ghosted",
  "widowed",
  "discarded",
  "fabricated-verified",
  "looped",
  "empty-fork",
  "clamped",
  "detached",
  "regrown",
  "excised",
  "cauterized",
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
    slider: "",
    header: "",
    badge: null,
    ultracodeKeyPresent: null,
    fableEffortSetting: null,
    envEffort: null,
    effortXhighWrote: null,
    managedSettingsPresent: null,
    projectSettingsHaveKeys: null,
    claudeJsonHasEffort: null,
    launchFlags: null,
    model: "",
    opusXhighSeated: null,
    documentedDefault: null,
    unpinnedHold: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedUnpinned();
}

export function seedUnpinned() {
  return {
    seed: IDLE_WORD,
    issue: null,
    slider: "high",
    header: "Fable 5 with high effort",
    badge: null,
    ultracodeKeyPresent: false,
    fableEffortSetting: null,
    envEffort: null,
    effortXhighWrote: false,
    managedSettingsPresent: false,
    projectSettingsHaveKeys: false,
    claudeJsonHasEffort: false,
    launchFlags: false,
    model: "fable-5",
    opusXhighSeated: false,
    documentedDefault: true,
    unpinnedHold: true,
    outputText:
      "unpinned; ultracode off; header honest; slider on documented default high; no cockade on the hat; Fable 5 default effort is high; ultracode settings key unset so ultracode is off",
  };
}

export function seedDocumentedDefault() {
  return {
    seed: "documented-default",
    issue: FEATURED_ISSUE,
    slider: "high",
    header: "Fable 5 with high effort",
    badge: null,
    ultracodeKeyPresent: false,
    fableEffortSetting: null,
    envEffort: null,
    effortXhighWrote: false,
    managedSettingsPresent: false,
    projectSettingsHaveKeys: false,
    claudeJsonHasEffort: false,
    launchFlags: false,
    model: "fable-5",
    opusXhighSeated: false,
    documentedDefault: true,
    unpinnedHold: true,
    outputText:
      "documented-default; Fable 5 default effort is high; ultracode unset so ultracode is off; slider on high; header honest; high-hold; unpinned",
  };
}

export function seedCocked() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    slider: SLIDER_SEEDED,
    header: HEADER_SEEDED,
    badge: BADGE_SEEDED,
    ultracodeKeyPresent: false,
    fableEffortSetting: null,
    envEffort: null,
    effortXhighWrote: false,
    managedSettingsPresent: false,
    projectSettingsHaveKeys: false,
    claudeJsonHasEffort: false,
    launchFlags: false,
    model: "fable-5",
    opusXhighSeated: true,
    documentedDefault: false,
    unpinnedHold: false,
    cliVersion: CLI_VERSION,
    platform: PLATFORM,
    terminal: TERMINAL,
    install: INSTALL,
    plan: PLAN,
    sliderLabel: SLIDER_LABEL,
    fableDefaultEffort: FABLE_DEFAULT_EFFORT,
    ultracodeDefault: ULTRACODE_DEFAULT,
    statuslineDoc: STATUSLINE_DOC,
    changelog243: CHANGELOG_243,
    opusSettings: { "claude-opus-5": { effortLevel: "xhigh" } },
    outputText:
      "Ultracode arms with no ultracode setting in any scope; header shows plain \"with xhigh effort\" while it is active; opening /effort shows the slider marker sitting ON the ultracode position (xhigh + workflows) while the session header in the same frame reads Fable 5 with xhigh effort; the badge was truthful (footer badge: ultracode); the HEADER is the element mislabeling the state; ultracode reports its level as xhigh internally per statusline docs; two defects: (1) Ultracode is armed with no ultracode opt-in anywhere (2) Header hides ultracode; fresh Fable 5 session boots with /effort slider on ultracode despite ~/.claude/settings.json no ultracode key only modelSettings claude-opus-5 effortLevel xhigh — no effort setting at all for Fable 5; project .claude/settings.json / .claude/settings.local.json no ultracode/effort keys; no managed settings file C:\\ProgramData\\ClaudeCode\\ absent; CLAUDE_CODE_EFFORT_LEVEL unset in process, user, and machine scope; no --effort/--settings launch flags (plain claude); ~/.claude.json no effort-level or ultracode state (only UI flags like effortCalloutDismissed); docs: ultracode default is unset so ultracode is off; Fable 5 default effort is high; if Fable 5 intentionally defaults to ultracode that is undocumented; Opus 5 (1M) session also showed the ultracode badge while its header read with xhigh effort with the only relevant config being the per-model xhigh entry — suggesting a saved plain xhigh may also be loaded/seated as ultracode; with effort actually at ultracode, /effort xhigh is a silent no-op — no modelSettings entry is written; impossible to leave ultracode via /effort xhigh; only selecting a different level (or the slider) forces a write; CHANGELOG 2.1.243 fixed /model picker silently ignoring Ultracode selection; cocked; no-opt-in; header-lie; silent-noop; badge-true; settings-absent; env-unset",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.cockade && typeof src.cockade === "object" && src.cockade) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
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
    slider: firstText(nested.slider, src.slider),
    header: firstText(nested.header, src.header),
    badge:
      nested.badge === null
        ? null
        : src.badge === null
          ? null
          : firstText(nested.badge, src.badge) || null,
    ultracodeKeyPresent: firstBool(
      nested.ultracodeKeyPresent,
      nested.ultracode_key_present,
      src.ultracodeKeyPresent,
    ),
    fableEffortSetting:
      nested.fableEffortSetting === null
        ? null
        : firstText(nested.fableEffortSetting, nested.fable_effort_setting, src.fableEffortSetting) ||
          null,
    envEffort:
      nested.envEffort === null
        ? null
        : firstText(nested.envEffort, nested.env_effort, src.envEffort) || null,
    effortXhighWrote: firstBool(
      nested.effortXhighWrote,
      nested.effort_xhigh_wrote,
      src.effortXhighWrote,
    ),
    managedSettingsPresent: firstBool(
      nested.managedSettingsPresent,
      nested.managed_settings_present,
      src.managedSettingsPresent,
    ),
    projectSettingsHaveKeys: firstBool(
      nested.projectSettingsHaveKeys,
      nested.project_settings_have_keys,
      src.projectSettingsHaveKeys,
    ),
    claudeJsonHasEffort: firstBool(
      nested.claudeJsonHasEffort,
      nested.claude_json_has_effort,
      src.claudeJsonHasEffort,
    ),
    launchFlags: firstBool(nested.launchFlags, nested.launch_flags, src.launchFlags),
    model: firstText(nested.model, src.model),
    opusXhighSeated: firstBool(
      nested.opusXhighSeated,
      nested.opus_xhigh_seated,
      src.opusXhighSeated,
    ),
    documentedDefault: firstBool(
      nested.documentedDefault,
      nested.documented_default,
      src.documentedDefault,
    ),
    unpinnedHold: firstBool(
      nested.unpinnedHold,
      nested.unpinned_hold,
      src.unpinnedHold,
    ),
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
  return (
    !firstText(input?.slider, input?.header) &&
    input?.badge == null &&
    input?.ultracodeKeyPresent == null &&
    input?.effortXhighWrote == null &&
    input?.unpinnedHold == null &&
    input?.documentedDefault == null
  );
}

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
    return { ...seedCocked(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedCocked(), ...cloned, ...raw };
  }
  if (cloned.seed === "documented-default" && coreMissing) {
    return { ...seedDocumentedDefault(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedUnpinned(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.header, ticket.slider, ticket.badge]
    .filter(Boolean)
    .join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) &&
    named !== IDLE_WORD &&
    named !== SEEDED_WORD &&
    !HOLD_VERDICTS.includes(named);
  const namedHold =
    named === IDLE_WORD ||
    named === "documented-default" ||
    named === "high-hold";
  const sliderUltracode =
    row.slider === "ultracode" ||
    /slider (marker )?(sitting )?ON the ultracode|slider on ultracode|xhigh \+ workflows|marker sits on ultracode/i.test(
      text,
    );
  const headerText = String(row.header || "");
  const headerXhigh = /with xhigh effort/i.test(headerText) || /header.*with xhigh effort|reads \"Fable 5 with xhigh effort\"|header shows plain \"with xhigh effort\"/i.test(text);
  const headerHasUltracode = /\bultracode\b/i.test(headerText);
  const headerLie =
    (sliderUltracode && headerXhigh && !headerHasUltracode) ||
    /header (is the element )?mislabel|header hides ultracode|header-lie|brim ticket still reads xhigh/i.test(
      text,
    );
  const badgeTrue =
    row.badge === "ultracode" ||
    /footer badge:\s*[\"']?ultracode|badge was truthful|badge-true|badge truthful/i.test(
      text,
    );
  const noOptIn =
    (row.ultracodeKeyPresent === false &&
      (row.envEffort == null || row.envEffort === "") &&
      row.managedSettingsPresent === false &&
      row.launchFlags === false &&
      row.projectSettingsHaveKeys !== true) ||
    /no ultracode (setting|opt-in|key)|no-opt-in|no ultracode key anywhere/i.test(
      text,
    );
  const settingsAbsent =
    row.ultracodeKeyPresent === false ||
    /settings-absent|no `ultracode` key|no ultracode key/i.test(text);
  const envUnset =
    row.envEffort == null ||
    row.envEffort === "" ||
    /env-unset|CLAUDE_CODE_EFFORT_LEVEL unset/i.test(text);
  const silentNoop =
    (row.effortXhighWrote === false && sliderUltracode) ||
    /silent no-op|silent-noop|\/effort xhigh is a silent/i.test(text);
  const persistMiss =
    silentNoop ||
    /persist-miss|no `?modelSettings`? entry is written/i.test(text);
  const xhighMask =
    headerLie ||
    /xhigh-mask|reports (its level )?as `?xhigh`?|header renders the reported level/i.test(
      text,
    );
  const workflowsArmed =
    sliderUltracode || /workflows-armed|xhigh \+ workflows|dynamic-workflow/i.test(text);
  const fableDefault =
    ((row.fableEffortSetting == null || row.fableEffortSetting === "") &&
      sliderUltracode &&
      /fable/i.test(String(row.model || text))) ||
    /no effort setting at all for Fable 5|fable-default|Fable 5 default effort is `?high`?/i.test(
      text,
    );
  const undocumented =
    (sliderUltracode && noOptIn) ||
    /undocumented|intentionally defaults to ultracode|arming spontaneously/i.test(
      text,
    );
  const cocked =
    !namedHold &&
    sliderUltracode &&
    noOptIn &&
    (headerLie || headerXhigh) &&
    !namedAlarm;
  const unpinned =
    !namedAlarm &&
    !cocked &&
    !sliderUltracode &&
    (row.unpinnedHold === true ||
      row.documentedDefault === true ||
      namedHold ||
      (/unpinned|ultracode off|header honest|slider on documented default high|no cockade on the hat/i.test(
        text,
      ) &&
        row.slider !== "ultracode"));
  const documentedDefault =
    !sliderUltracode &&
    (row.documentedDefault === true ||
      named === "documented-default" ||
      (/documented-default|documented default high/i.test(text) && !cocked));
  return {
    sliderUltracode,
    headerXhigh,
    headerHasUltracode,
    headerLie,
    badgeTrue,
    noOptIn,
    settingsAbsent,
    envUnset,
    silentNoop,
    persistMiss,
    xhighMask,
    workflowsArmed,
    fableDefault,
    undocumented,
    cocked,
    unpinned,
    documentedDefault,
    namedAlarm,
    namedHold,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.cocked) chips.push("cocked");
  if (flags.unpinned && !flags.cocked) chips.push("unpinned");
  if (flags.documentedDefault && !flags.cocked) chips.push("documented-default");
  if (flags.headerLie && !flags.unpinned) chips.push("mislabeled");
  if (flags.silentNoop && !flags.unpinned) chips.push("silent-noop");
  if (flags.xhighMask && !flags.unpinned) chips.push("xhigh-mask");
  if (flags.noOptIn && flags.sliderUltracode && !flags.unpinned) {
    chips.push("no-opt-in");
  }
  if (flags.sliderUltracode && !flags.unpinned) chips.push("slider-ultracode");
  if (flags.headerLie && !flags.unpinned) chips.push("header-lie");
  if (flags.silentNoop && !flags.unpinned) chips.push("effort-xhigh");
  if (flags.workflowsArmed && !flags.unpinned) chips.push("workflows-armed");
  if (flags.settingsAbsent && flags.sliderUltracode && !flags.unpinned) {
    chips.push("settings-absent");
  }
  if (flags.envUnset && flags.sliderUltracode && !flags.unpinned) {
    chips.push("env-unset");
  }
  if (flags.persistMiss && !flags.unpinned) chips.push("persist-miss");
  if (flags.badgeTrue && flags.sliderUltracode && !flags.unpinned) {
    chips.push("badge-true");
  }
  if (flags.fableDefault && flags.sliderUltracode && !flags.unpinned) {
    chips.push("fable-default");
  }
  if (flags.undocumented && flags.sliderUltracode && !flags.unpinned) {
    chips.push("undocumented");
  }
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "unpinned" || verdict === "documented-default") {
    reasons.push("ultracode off; header honest; slider on documented default high");
    reasons.push("hold: no cockade on the hat; admit unpinned");
  }
  if (flags.sliderUltracode) {
    reasons.push(
      `slider marker sitting ON ultracode (${SLIDER_LABEL})`,
    );
  }
  if (flags.headerLie || flags.headerXhigh) {
    reasons.push(
      `header reads "${ticket.header || HEADER_SEEDED}" — ultracode hidden as xhigh`,
    );
  }
  if (flags.badgeTrue) {
    reasons.push("footer badge ultracode is truthful; the header is the lie");
  }
  if (flags.noOptIn) {
    reasons.push(
      "no ultracode key in user/project/managed settings; CLAUDE_CODE_EFFORT_LEVEL unset; no --effort/--settings flags",
    );
  }
  if (flags.silentNoop) {
    reasons.push(
      "/effort xhigh is a silent no-op — no modelSettings entry is written because ultracode reports as xhigh",
    );
  }
  if (flags.fableDefault && flags.sliderUltracode) {
    reasons.push(
      "Fable 5 has no effort setting; documented default is high, not ultracode",
    );
  }
  if (flags.cocked) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  if (verdict !== "unpinned" && flags.sliderUltracode) {
    reasons.push(CONTRAST_NOTE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.unpinned) return "unpinned";
  if (named === SEEDED_WORD) return "cocked";
  if (named === "documented-default" || named === "high-hold") {
    return named === "high-hold" ? "documented-default" : "documented-default";
  }
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.cocked) return "cocked";
  if (flags.silentNoop && flags.headerLie && flags.noOptIn) return "cocked";
  if (flags.headerLie) return "header-lie";
  if (flags.silentNoop) return "silent-noop";
  if (flags.sliderUltracode && flags.noOptIn) return "no-opt-in";
  if (flags.sliderUltracode) return "slider-ultracode";
  if (flags.unpinned) return "unpinned";
  if (flags.documentedDefault) return "documented-default";
  return "unpinned";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    unpinned: verdict === "unpinned" || flags.unpinned,
    cocked: verdict === "cocked" || flags.cocked,
    documentedDefault: verdict === "documented-default" || flags.documentedDefault,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      brim: flags.headerLie
        ? "the brim ticket still reads xhigh while the cockade sits on ultracode"
        : flags.unpinned
          ? "the brim ticket matches the block; no cockade"
          : "brim ticket unread",
      cockade: flags.sliderUltracode
        ? "silk cockade seated on ultracode (xhigh + workflows)"
        : "no cockade on the hat",
      book: flags.noOptIn && flags.sliderUltracode
        ? "no order in the book — no ultracode opt-in in any drawer"
        : "the book matches the brim",
      persist: flags.silentNoop
        ? "/effort xhigh writes nothing; ultracode reports as xhigh"
        : "no silent no-op",
      note: flags.cocked
        ? PHRASE
        : flags.documentedDefault || flags.unpinned
          ? "Unpinned: ultracode off; header honest; slider on documented default high."
          : PHRASE,
    },
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
  if (name === SEEDED_WORD || name === 91033 || name === "91033") {
    return analyze(seedCocked());
  }
  if (name === "documented-default" || name === "high-hold") {
    return analyze(seedDocumentedDefault());
  }
  if (name === IDLE_WORD || name === "unpinned") {
    return analyze(seedUnpinned());
  }
  return analyze(seedUnpinned());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.cocked
        ? `cocked bench #${FEATURED_ISSUE}: slider on ultracode (${SLIDER_LABEL}); header "${HEADER_SEEDED}"; badge truthful; no ultracode key anywhere; /effort xhigh silent no-op. ${HYPOTHESIS_NOTE}`
        : result.verdict === "documented-default"
          ? `documented-default bench. Fable 5 default effort is high. Ultracode unset. Hold.`
          : `unpinned bench. Idle word ${IDLE_WORD}. Ultracode off; header honest; slider on documented default high; no cockade on the hat.`,
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
