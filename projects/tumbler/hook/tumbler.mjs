#!/usr/bin/env node
/**
 * Tumbler — locksmith pin-tumbler / keyway atelier classifier.
 * A tumbler that discards an allow is not a hold.
 * Score the keyway or admit discarded.
 *
 *   echo '{"hookEvent":"PermissionRequest","toolName":"ExitPlanMode","decisionBehavior":"allow","decisionDiscarded":true}' | node tumbler.mjs
 *   node tumbler.mjs ticket.json
 *
 * Idle word is honored (HOLD: PermissionRequest allow applied;
 * chooser skipped; updatedPermissions take effect; plan implements).
 * Seeded state is discarded / #74256 (hook returns allow; decision
 * silently discarded; chooser still blocks; updatedPermissions dropped).
 * NEVER idle as jumped, chocked, rolled, clasped, sprung, drained,
 * hinged, pealed, warded, pooled, cased, aired, sifted, stocked,
 * stationed, marvered, unpinned, rinsed, literal, choked, indexed,
 * arrested, skipped.
 *
 * Primary #74256: PermissionRequest hook returning
 * decision.behavior: "allow" for ExitPlanMode is executed (stdin
 * delivered, stdout read) but the decision is discarded. Native
 * plan-approval chooser still displayed: "Claude has written up a
 * plan and is ready to execute. Would you like to proceed?" Blocks
 * session until answered manually; breaks out-of-band / browser
 * plan-approval UIs. Variants ignored on 2.1.201: allow +
 * updatedPermissions (setMode acceptEdits), bare allow, PreToolUse
 * permissionDecision allow. Deny path still works (deny + message
 * round-trips; model revises and retries ExitPlanMode). Version
 * bracket: 2.1.198 allow honored (chooser skipped, plan implemented);
 * 2.1.199 and 2.1.201 allow ignored (chooser blocks). Reproduced
 * programmatically against TUI and in desktop app; model-independent
 * (Haiku 4.5 and Opus-class). Staff (bcherny) reproduced on v2.1.233:
 * hook runs; chooser shows Yes auto-accept / Yes manually approve /
 * Tell Claude what to change; hello.txt never created;
 * updatedPermissions dropped. Workaround confirmed by author and by
 * jbeno on 2.1.238 and 2.1.258: echo tool_input as
 * decision.updatedInput skips chooser. Staff assessment notes:
 * PermissionRequest docs never mention updatedInput requirement;
 * bare allow silently discarded with no warning to hook author.
 *
 * Hypothesis only (NON-BINDING): since 2.1.199, PermissionRequest
 * allow for tools whose approval card is the user interaction is
 * discarded unless updatedInput is present; deny untouched; docs
 * under-specify. Do not claim a root cause in Claude Code source
 * you have not seen. Verify against the issue text and discard if
 * wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the keyway is honored or discarded.
 *
 * NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab
 * — cite as stay-off).
 * NOT Carillon #91250 (plugin SessionStart first-wins — already
 * shipped; Sheaf/#91250 is a clone — do not ship).
 * NOT Pintle #91226 (PreToolUse Bash relative-path cwd deadlock).
 * NOT Escapement #91371 (local scheduled mid-run isRunning stall →
 * Skipped).
 * NOT Scotch #91324 (SCM recovery Access denied).
 * NOT Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 /
 * Postern #91223 / Sluice #91265.
 * NOT #90685 (systemMessage never rendered — cite-only cousin).
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick / geneva-drive / maltese-cross /
 * escapement pallet-fork.
 * Product name stays Tumbler. Do not rename to Lock / Keyway /
 * Permission / Plan / Hooks / Geneva / Scotch / Fibula / Virgule /
 * Riddle / Garner / Pintle / Postern / Escapement / Carillon.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "honored",
  "discarded",
  "chooser-blocks",
  "allow-ignored",
  "deny-still-works",
  "updatedinput-workaround",
  "updatedpermissions-dropped",
  "docs-gap",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "honored";
export const SEEDED_WORD = "discarded";
export const HOLD_VERDICTS = Object.freeze(["honored", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 74256;
export const PRIMARY_ISSUES = Object.freeze([74256]);
export const COUSINS = Object.freeze([90685, 71061, 50660, 84098, 89251]);
export const COUSIN_ISSUE = 90685;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
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
  "escapement",
  "sheaf",
  "knell",
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
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/74256";
export const TITLE =
  "[BUG] PermissionRequest hook 'allow' for ExitPlanMode is ignored since v2.1.199 — plan-approval chooser still blocks";
export const FILED_AT = "2026-07-04T18:49:46Z";
export const LABELS = Object.freeze([
  "bug",
  "documentation",
  "has repro",
  "platform:macos",
  "area:core",
  "area:hooks",
  "regression",
  "reproduced",
]);
export const REPORTER = "blimmer";
export const STAFF = "bcherny";
export const CONFIRMER = "jbeno";
export const HOOK_EVENT = "PermissionRequest";
export const TOOL_NAME = "ExitPlanMode";
export const DECISION_ALLOW = "allow";
export const DECISION_DENY = "deny";
export const CHOOSER_PROMPT = "Would you like to proceed?";
export const CHOOSER_FULL =
  "Claude has written up a plan and is ready to execute. Would you like to proceed?";
export const CHOOSER_YES_AUTO = "Yes, auto-accept edits";
export const CHOOSER_YES_MANUAL = "Yes, manually approve edits";
export const CHOOSER_TELL = "Tell Claude what to change";
export const SET_MODE = "setMode";
export const ACCEPT_EDITS = "acceptEdits";
export const UPDATED_PERMISSIONS = "updatedPermissions";
export const UPDATED_INPUT = "updatedInput";
export const TOOL_INPUT = "tool_input";
export const HELLO_TXT = "hello.txt";
export const LAST_GOOD = "2.1.198";
export const FIRST_BROKEN = "2.1.199";
export const ALSO_BROKEN = "2.1.201";
export const STAFF_VERSION = "2.1.233";
export const WORKAROUND_VERSION_A = "2.1.238";
export const CONFIRMED_VERSION = "2.1.258";
export const PLATFORM = "macOS";
export const INTERFACE = "desktop app";
export const HAIKU = "Haiku 4.5";
export const PLAN_MODE = "plan";
export const PRETOOLUSE = "PreToolUse";
export const PERMISSION_DECISION = "permissionDecision";
export const HUB_LINE =
  "13:50 tumbler: a tumbler that discards an allow is not a hold. Score the keyway or admit discarded.";
export const MARK = "13:50 / hermes catalog #114 / #74256";
export const PHRASE =
  "a tumbler that discards an allow is not a hold. Score the keyway or admit discarded.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: since 2.1.199, PermissionRequest allow for tools whose approval card is the user interaction is discarded unless updatedInput is present; deny untouched; docs under-specify. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is PERMISSIONREQUEST HOOK RETURNS allow FOR ExitPlanMode BUT THE DECISION IS SILENTLY DISCARDED SO THE PLAN-APPROVAL CHOOSER STILL BLOCKS; updatedPermissions DROPPED; DENY PATH STILL WORKS; LAST GOOD 2.1.198; FIRST BROKEN 2.1.199; CONFIRMED ON 2.1.258. PermissionRequest hook returning decision.behavior: \"allow\" for ExitPlanMode is executed (stdin delivered, stdout read) but decision discarded. Native plan-approval chooser still displayed: \"Claude has written up a plan and is ready to execute. Would you like to proceed?\" Blocks session until answered manually; breaks out-of-band / browser plan-approval UIs. Variants ignored on 2.1.201: allow+updatedPermissions (setMode acceptEdits), bare allow, PreToolUse permissionDecision allow. Deny path still works (deny+message round-trips; model revises and retries ExitPlanMode). Version bracket: 2.1.198 allow honored (chooser skipped, plan implemented); 2.1.199 and 2.1.201 allow ignored (chooser blocks). Reproduced programmatically against TUI and in desktop app; model-independent (Haiku 4.5 and Opus-class). Staff (bcherny) reproduced on v2.1.233: hook runs; chooser shows Yes auto-accept / Yes manually approve / Tell Claude what to change; hello.txt never created; updatedPermissions dropped. Workaround confirmed by author and by jbeno on 2.1.238 and 2.1.258: echo tool_input as decision.updatedInput skips chooser. Staff assessment notes: PermissionRequest docs never mention updatedInput requirement; bare allow silently discarded with no warning to hook author. NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab — cite as stay-off). NOT Carillon #91250 (plugin SessionStart first-wins — already shipped; Sheaf/#91250 is a clone — do not ship). NOT Pintle #91226 (PreToolUse Bash relative-path cwd deadlock). NOT Escapement #91371 (local scheduled mid-run isRunning stall → Skipped). NOT Scotch #91324 (SCM recovery Access denied). NOT Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 / Postern #91223 / Sluice #91265. NOT #90685 (systemMessage never rendered — cite-only). NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork. Product name stays Tumbler.";
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
  "indexed",
  "arrested",
  "skipped",
]);
export const BANNED_NAMES = Object.freeze([
  "Lock",
  "Keyway",
  "Permission",
  "Plan",
  "Hooks",
  "Geneva",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Postern",
  "Escapement",
  "Carillon",
  "Sheaf",
]);
export const FORBIDDEN_UI = Object.freeze([
  "pallet-fork",
  "geneva-drive",
  "maltese-cross",
  "scotch-block",
  "peal-board",
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
  "belfry",
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
    hookEvent: "",
    toolName: "",
    decisionBehavior: "",
    hookFired: null,
    stdinDelivered: null,
    stdoutRead: null,
    decisionDiscarded: null,
    chooserBlocks: null,
    chooserSkipped: null,
    allowApplied: null,
    updatedPermissionsApplied: null,
    updatedPermissionsDropped: null,
    setMode: "",
    denyWorks: null,
    denyRoundTrips: null,
    lastGood: "",
    firstBroken: "",
    confirmedVersion: "",
    staffVersion: "",
    updatedInputPresent: null,
    updatedInputWorkaround: null,
    docsGap: null,
    bareAllowSilent: null,
    helloTxtCreated: null,
    planImplemented: null,
    hasClearRepro: null,
    preToolUseAllowIgnored: null,
    reporter: "",
    staff: "",
    confirmer: "",
    platform: "",
    interface: "",
    cousin: "",
    outputText: "",
  };
}

export function seedHonored() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: false,
    chooserBlocks: false,
    chooserSkipped: true,
    allowApplied: true,
    updatedPermissionsApplied: true,
    updatedPermissionsDropped: false,
    setMode: ACCEPT_EDITS,
    denyWorks: true,
    denyRoundTrips: true,
    lastGood: LAST_GOOD,
    firstBroken: "",
    confirmedVersion: "",
    staffVersion: "",
    updatedInputPresent: false,
    updatedInputWorkaround: false,
    docsGap: false,
    bareAllowSilent: false,
    helloTxtCreated: true,
    planImplemented: true,
    hasClearRepro: false,
    preToolUseAllowIgnored: false,
    reporter: "",
    staff: "",
    confirmer: "",
    platform: PLATFORM,
    interface: INTERFACE,
    cousin: "",
    outputText:
      "honored; PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements; idle word honored",
  };
}

export function seedDiscarded() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    staff: STAFF,
    confirmer: CONFIRMER,
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedPermissionsApplied: false,
    updatedPermissionsDropped: true,
    setMode: ACCEPT_EDITS,
    denyWorks: true,
    denyRoundTrips: true,
    lastGood: LAST_GOOD,
    firstBroken: FIRST_BROKEN,
    confirmedVersion: CONFIRMED_VERSION,
    staffVersion: STAFF_VERSION,
    updatedInputPresent: false,
    updatedInputWorkaround: false,
    docsGap: true,
    bareAllowSilent: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    preToolUseAllowIgnored: true,
    platform: PLATFORM,
    interface: INTERFACE,
    cousin: "",
    outputText:
      "discarded; #74256; PermissionRequest allow for ExitPlanMode silently discarded; chooser still blocks; Would you like to proceed?; updatedPermissions dropped; deny still works; 2.1.198 honored; 2.1.199 first broken; 2.1.258 confirmed",
  };
}

export function seedChooserBlocks() {
  return {
    seed: "chooser-blocks",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedPermissionsDropped: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    outputText:
      "chooser-blocks; native plan-approval chooser still displayed: Claude has written up a plan and is ready to execute. Would you like to proceed?; Yes auto-accept / Yes manually approve / Tell Claude what to change",
  };
}

export function seedAllowIgnored() {
  return {
    seed: "allow-ignored",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedPermissionsDropped: true,
    setMode: ACCEPT_EDITS,
    preToolUseAllowIgnored: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    outputText:
      "allow-ignored; variants ignored on 2.1.201: allow+updatedPermissions (setMode acceptEdits), bare allow, PreToolUse permissionDecision allow",
  };
}

export function seedDenyStillWorks() {
  return {
    seed: "deny-still-works",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_DENY,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    denyWorks: true,
    denyRoundTrips: true,
    updatedPermissionsDropped: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    outputText:
      "deny-still-works; deny path still works; deny+message round-trips; model revises and retries ExitPlanMode",
  };
}

export function seedUpdatedinputWorkaround() {
  return {
    seed: "updatedinput-workaround",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedInputPresent: true,
    updatedInputWorkaround: true,
    updatedPermissionsDropped: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    confirmer: CONFIRMER,
    reporter: REPORTER,
    outputText:
      "updatedinput-workaround; echo tool_input as decision.updatedInput skips chooser; confirmed by blimmer and jbeno on 2.1.238 and 2.1.258",
  };
}

export function seedUpdatedpermissionsDropped() {
  return {
    seed: "updatedpermissions-dropped",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedPermissionsApplied: false,
    updatedPermissionsDropped: true,
    setMode: ACCEPT_EDITS,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    staff: STAFF,
    staffVersion: STAFF_VERSION,
    outputText:
      "updatedpermissions-dropped; updatedPermissions (setMode acceptEdits) dropped along with the allow; hello.txt never created; bcherny on 2.1.233",
  };
}

export function seedDocsGap() {
  return {
    seed: "docs-gap",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    docsGap: true,
    bareAllowSilent: true,
    updatedPermissionsDropped: true,
    helloTxtCreated: false,
    planImplemented: false,
    hasClearRepro: true,
    staff: STAFF,
    outputText:
      "docs-gap; PermissionRequest docs never mention updatedInput requirement; bare allow silently discarded with no warning to hook author",
  };
}

export function seedHasClearRepro() {
  return {
    seed: "has-clear-repro",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: true,
    chooserBlocks: true,
    chooserSkipped: false,
    allowApplied: false,
    updatedPermissionsDropped: true,
    hasClearRepro: true,
    helloTxtCreated: false,
    planImplemented: false,
    reporter: REPORTER,
    staff: STAFF,
    confirmer: CONFIRMER,
    lastGood: LAST_GOOD,
    firstBroken: FIRST_BROKEN,
    confirmedVersion: CONFIRMED_VERSION,
    staffVersion: STAFF_VERSION,
    platform: PLATFORM,
    outputText:
      "has-clear-repro; blimmer filed #74256; bcherny reproduced on 2.1.233; jbeno confirmed 2.1.258; PermissionRequest ExitPlanMode; plan mode; hello.txt; has repro",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    hookEvent: HOOK_EVENT,
    toolName: TOOL_NAME,
    decisionBehavior: DECISION_ALLOW,
    hookFired: true,
    stdinDelivered: true,
    stdoutRead: true,
    decisionDiscarded: false,
    chooserBlocks: false,
    chooserSkipped: true,
    allowApplied: true,
    updatedPermissionsApplied: true,
    updatedPermissionsDropped: false,
    setMode: ACCEPT_EDITS,
    helloTxtCreated: true,
    planImplemented: true,
    hasClearRepro: false,
    outputText:
      "hold; PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements; the keyway is honored",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "90685",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #90685 systemMessage never rendered — cite; not the #74256 PermissionRequest allow discarded for ExitPlanMode",
  };
}

export function emptyTicket() {
  return seedHonored();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.tumbler && typeof src.tumbler === "object" && src.tumbler) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.keyway && typeof src.keyway === "object" && src.keyway) ||
    (src.lock && typeof src.lock === "object" && src.lock) ||
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
    staff: firstText(nested.staff, src.staff),
    confirmer: firstText(nested.confirmer, src.confirmer),
    source: firstText(nested.source, src.source),
    hookEvent: firstText(nested.hookEvent, nested.hook_event, src.hookEvent),
    toolName: firstText(nested.toolName, nested.tool_name, src.toolName),
    decisionBehavior: firstText(
      nested.decisionBehavior,
      nested.decision_behavior,
      nested.behavior,
      src.decisionBehavior,
    ),
    hookFired: firstBool(nested.hookFired, nested.hook_fired, src.hookFired),
    stdinDelivered: firstBool(
      nested.stdinDelivered,
      nested.stdin_delivered,
      src.stdinDelivered,
    ),
    stdoutRead: firstBool(nested.stdoutRead, nested.stdout_read, src.stdoutRead),
    decisionDiscarded: firstBool(
      nested.decisionDiscarded,
      nested.decision_discarded,
      src.decisionDiscarded,
    ),
    chooserBlocks: firstBool(
      nested.chooserBlocks,
      nested.chooser_blocks,
      src.chooserBlocks,
    ),
    chooserSkipped: firstBool(
      nested.chooserSkipped,
      nested.chooser_skipped,
      src.chooserSkipped,
    ),
    allowApplied: firstBool(
      nested.allowApplied,
      nested.allow_applied,
      src.allowApplied,
    ),
    updatedPermissionsApplied: firstBool(
      nested.updatedPermissionsApplied,
      nested.updated_permissions_applied,
      src.updatedPermissionsApplied,
    ),
    updatedPermissionsDropped: firstBool(
      nested.updatedPermissionsDropped,
      nested.updated_permissions_dropped,
      src.updatedPermissionsDropped,
    ),
    setMode: firstText(nested.setMode, nested.set_mode, src.setMode),
    denyWorks: firstBool(nested.denyWorks, nested.deny_works, src.denyWorks),
    denyRoundTrips: firstBool(
      nested.denyRoundTrips,
      nested.deny_round_trips,
      src.denyRoundTrips,
    ),
    lastGood: firstText(nested.lastGood, nested.last_good, src.lastGood),
    firstBroken: firstText(
      nested.firstBroken,
      nested.first_broken,
      src.firstBroken,
    ),
    confirmedVersion: firstText(
      nested.confirmedVersion,
      nested.confirmed_version,
      src.confirmedVersion,
    ),
    staffVersion: firstText(
      nested.staffVersion,
      nested.staff_version,
      src.staffVersion,
    ),
    updatedInputPresent: firstBool(
      nested.updatedInputPresent,
      nested.updated_input_present,
      src.updatedInputPresent,
    ),
    updatedInputWorkaround: firstBool(
      nested.updatedInputWorkaround,
      nested.updated_input_workaround,
      src.updatedInputWorkaround,
    ),
    docsGap: firstBool(nested.docsGap, nested.docs_gap, src.docsGap),
    bareAllowSilent: firstBool(
      nested.bareAllowSilent,
      nested.bare_allow_silent,
      src.bareAllowSilent,
    ),
    helloTxtCreated: firstBool(
      nested.helloTxtCreated,
      nested.hello_txt_created,
      src.helloTxtCreated,
    ),
    planImplemented: firstBool(
      nested.planImplemented,
      nested.plan_implemented,
      src.planImplemented,
    ),
    hasClearRepro: firstBool(
      nested.hasClearRepro,
      nested.has_clear_repro,
      src.hasClearRepro,
    ),
    preToolUseAllowIgnored: firstBool(
      nested.preToolUseAllowIgnored,
      nested.pre_tool_use_allow_ignored,
      src.preToolUseAllowIgnored,
    ),
    platform: firstText(nested.platform, src.platform),
    interface: firstText(nested.interface, src.interface),
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
    row.decisionDiscarded == null &&
    row.chooserBlocks == null &&
    row.allowApplied == null &&
    row.chooserSkipped == null &&
    row.updatedPermissionsDropped == null &&
    row.updatedPermissionsApplied == null &&
    row.planImplemented == null &&
    row.helloTxtCreated == null &&
    row.decisionBehavior == null &&
    row.denyWorks == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedHonored,
  [SEEDED_WORD]: seedDiscarded,
  "chooser-blocks": seedChooserBlocks,
  "allow-ignored": seedAllowIgnored,
  "deny-still-works": seedDenyStillWorks,
  "updatedinput-workaround": seedUpdatedinputWorkaround,
  "updatedpermissions-dropped": seedUpdatedpermissionsDropped,
  "docs-gap": seedDocsGap,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  90685: seedCousin,
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
    return { ...seedDiscarded(), ...cloned, ...raw };
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
    ticket.hookEvent,
    ticket.toolName,
    ticket.decisionBehavior,
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

export function isHonored(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.allowApplied === true &&
    row.chooserSkipped === true &&
    row.planImplemented === true
  ) {
    return true;
  }
  return false;
}

export function isDiscarded(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.decisionDiscarded === true ||
    (row.chooserBlocks === true &&
      (row.allowApplied === false || row.decisionBehavior === DECISION_ALLOW))
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
      /cousin-not-primary|#90685|#71061|#50660|#84098|#89251/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const discardedNow = !cousinOnly && isDiscarded(row);
  const honoredNow = !discardedNow && isHonored(row);
  const chooserBlocks =
    row.chooserBlocks === true ||
    named === "chooser-blocks" ||
    /chooser-blocks|Would you like to proceed|chooser still blocks/i.test(text);
  const allowIgnored =
    named === "allow-ignored" ||
    row.preToolUseAllowIgnored === true ||
    /allow-ignored|bare allow|permissionDecision|setMode acceptEdits/i.test(text);
  const denyStillWorks =
    row.denyWorks === true ||
    row.denyRoundTrips === true ||
    named === "deny-still-works" ||
    /deny-still-works|deny path still works|deny\+message/i.test(text);
  const updatedInputWorkaround =
    row.updatedInputWorkaround === true ||
    row.updatedInputPresent === true ||
    named === "updatedinput-workaround" ||
    /updatedinput-workaround|updatedInput|tool_input/i.test(text);
  const updatedPermissionsDropped =
    row.updatedPermissionsDropped === true ||
    named === "updatedpermissions-dropped" ||
    /updatedpermissions-dropped|updatedPermissions dropped|updatedPermissions/i.test(
      text,
    );
  const docsGap =
    row.docsGap === true ||
    row.bareAllowSilent === true ||
    named === "docs-gap" ||
    /docs-gap|docs never mention|silently discarded with no warning/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|blimmer|bcherny|2\.1\.233|2\.1\.258|hello\.txt|plan mode/i.test(
      text,
    );
  const discarded =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (discardedNow || named === SEEDED_WORD || /discarded|#74256/i.test(text));
  const honored =
    named === IDLE_WORD || named === "hold" || (honoredNow && !discarded);
  return {
    named,
    cousinOnly,
    discardedNow,
    honoredNow,
    chooserBlocks,
    allowIgnored,
    denyStillWorks,
    updatedInputWorkaround,
    updatedPermissionsDropped,
    docsGap,
    hasClearRepro,
    discarded,
    honored,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.honored && !flags.discarded) chips.push("honored");
  if (flags.discarded) chips.push("discarded");
  if (flags.chooserBlocks && flags.discarded) chips.push("chooser-blocks");
  if (flags.allowIgnored && flags.discarded) chips.push("allow-ignored");
  if (flags.denyStillWorks && flags.discarded) chips.push("deny-still-works");
  if (flags.updatedInputWorkaround && flags.discarded) {
    chips.push("updatedinput-workaround");
  }
  if (flags.updatedPermissionsDropped && flags.discarded) {
    chips.push("updatedpermissions-dropped");
  }
  if (flags.docsGap && flags.discarded) chips.push("docs-gap");
  if (flags.hasClearRepro && flags.discarded) chips.push("has-clear-repro");
  if ((flags.honored || flags.named === "hold") && !flags.discarded) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "honored") {
    reasons.push(
      "honored; PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements",
    );
    reasons.push(
      "hold: the keyway is honored; score treats an applied allow that skips the chooser",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements; the keyway is honored",
    );
  }
  if (verdict === "discarded" || flags.discarded) {
    reasons.push(
      "discarded; #74256; PermissionRequest allow for ExitPlanMode silently discarded; chooser still blocks; updatedPermissions dropped",
    );
  }
  if (flags.chooserBlocks || verdict === "chooser-blocks") {
    reasons.push(
      `chooser-blocks; native plan-approval chooser still displayed: ${CHOOSER_FULL}`,
    );
  }
  if (flags.allowIgnored || verdict === "allow-ignored") {
    reasons.push(
      `allow-ignored; variants ignored on ${ALSO_BROKEN}: allow+${UPDATED_PERMISSIONS} (${SET_MODE} ${ACCEPT_EDITS}), bare allow, ${PRETOOLUSE} ${PERMISSION_DECISION} allow`,
    );
  }
  if (flags.denyStillWorks || verdict === "deny-still-works") {
    reasons.push(
      `deny-still-works; deny path still works; deny+message round-trips; model revises and retries ${TOOL_NAME}`,
    );
  }
  if (flags.updatedInputWorkaround || verdict === "updatedinput-workaround") {
    reasons.push(
      `updatedinput-workaround; echo ${TOOL_INPUT} as decision.${UPDATED_INPUT} skips chooser; confirmed by ${REPORTER} and ${CONFIRMER} on ${WORKAROUND_VERSION_A} and ${CONFIRMED_VERSION}`,
    );
  }
  if (flags.updatedPermissionsDropped || verdict === "updatedpermissions-dropped") {
    reasons.push(
      `updatedpermissions-dropped; ${UPDATED_PERMISSIONS} (${SET_MODE} ${ACCEPT_EDITS}) dropped; ${HELLO_TXT} never created; ${STAFF} on ${STAFF_VERSION}`,
    );
  }
  if (flags.docsGap || verdict === "docs-gap") {
    reasons.push(
      `docs-gap; ${HOOK_EVENT} docs never mention ${UPDATED_INPUT} requirement; bare allow silently discarded with no warning to hook author`,
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; ${STAFF} reproduced on ${STAFF_VERSION}; ${CONFIRMER} confirmed ${CONFIRMED_VERSION}; ${HOOK_EVENT} ${TOOL_NAME}; ${PLAN_MODE} mode; ${HELLO_TXT}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Tumbler; cite-only #90685 systemMessage / #71061 closed / #50660 PreToolUse deny / #84098 / #89251, not the PermissionRequest allow discarded for ExitPlanMode",
    );
  }
  if (verdict === "discarded" || flags.discarded) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "honored" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.honored || !flags.discarded)) return "honored";
  if (named === "hold" && !flags.discarded) return "hold";
  if (named === SEEDED_WORD) return "discarded";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "honored";
  if (flags.discarded) return "discarded";
  if (flags.honored) return "honored";
  return "honored";
}

function keywayOf(flags, ticket, verdict) {
  if (verdict === "discarded" || flags.discarded) {
    return {
      case: "discarded — tumblers accept the key then silently discard the allow",
      keyway: "key seated; stdin delivered; stdout allow read; decision discarded",
      plug: `${HOOK_EVENT} ${DECISION_ALLOW} · ${TOOL_NAME} · chooser still blocks`,
      bolt: "bolt stays thrown; updatedPermissions dropped",
      mark: "brass pin aside; the allow was discarded",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "honored — PermissionRequest allow applied; chooser skipped",
      keyway: "pins at the shear line; plug turns; bolt retracts",
      plug: "allow applied · updatedPermissions take effect · plan implements",
      bolt: "bolt withdrawn from the strike plate",
      mark: "brass pin on the shear line; the keyway is honored",
      note: "Hold: the keyway is honored.",
    };
  }
  return {
    case: "honored — allow applied; chooser skipped; plan implements",
    keyway: "pins at the shear line; no discarded allow",
    plug: "PermissionRequest allow applied · updatedPermissions take effect",
    bolt: "bolt retracted; atelier quiet",
    mark: "brass pin on the shear line; idle word honored",
    note: "Honored: the keyway holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const discarded = verdict === "discarded" || flags.discarded;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    honored: verdict === "honored" || (flags.honored && !discarded),
    discarded,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: keywayOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 74256 || name === "74256") {
    return analyze(seedDiscarded());
  }
  if (name === "chooser-blocks") return analyze(seedChooserBlocks());
  if (name === "allow-ignored") return analyze(seedAllowIgnored());
  if (name === "deny-still-works") return analyze(seedDenyStillWorks());
  if (name === "updatedinput-workaround") {
    return analyze(seedUpdatedinputWorkaround());
  }
  if (name === "updatedpermissions-dropped") {
    return analyze(seedUpdatedpermissionsDropped());
  }
  if (name === "docs-gap") return analyze(seedDocsGap());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "honored" || name === "open") {
    return analyze(seedHonored());
  }
  if (name === 90685 || name === "90685" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedHonored());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "discarded" || (result.discarded && result.alarm)
          ? `discarded tumbler #${FEATURED_ISSUE}: ${HOOK_EVENT} ${DECISION_ALLOW} for ${TOOL_NAME} silently discarded; chooser still blocks; ${UPDATED_PERMISSIONS} dropped. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. PermissionRequest allow applied. Score the keyway."
            : `honored tumbler. Idle word ${IDLE_WORD}. PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements.`,
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
