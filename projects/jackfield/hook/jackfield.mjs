#!/usr/bin/env node
/**
 * Jackfield — studio jackfield / channel-strip atelier classifier.
 * A jackfield that patches Windows keystrokes onto a Mac bus is not
 * a channel strip — it is a crossed circuit. Score the home or admit
 * the session already left its machine.
 *
 *   echo '{"windowsInputOnMac":true,"hostnameReturnsMac":true}' | node jackfield.mjs
 *   node jackfield.mjs ticket.json
 *
 * Idle word is homed (HOLD: a desktop session stays bound to the
 * machine and directory that owns it; input on Windows executes on
 * Windows).
 * Seeded state is crossed / #91511 (Windows input routes to
 * unrelated macOS session executor; hostname returns Mac/Darwin;
 * dual-title shared transcript; no host indication).
 * NEVER idle as armed / unheard / unbolted / snagged / reeved /
 * fouled / creased / bled / latched / vanished / sealed / rebound /
 * dark / spurious / fenced / swept / tolled / mute / honored /
 * discarded / arrested / skipped / indexed / jumped / chocked /
 * rolled / clasped / sprung / drained / hinged / pealed / warded /
 * pooled / cased / aired / sifted / stocked / stationed / marvered /
 * unpinned / rinsed / literal / choked / opened / stalled / fused /
 * forged / attributed.
 *
 * Primary #91511: Desktop app: input typed into a Windows session
 * executes in an unrelated macOS session (cross-machine session
 * mix-up). Measured on Claude Code 2.1.247 desktop (Windows +
 * macOS Darwin 25.6.0), same account. Reporter barthaines. Filed
 * 2026-09-02T13:41:51Z. OPEN. Labels: bug, has repro,
 * platform:windows, platform:macos, area:security, area:desktop.
 *
 * Facts from the issue only:
 * - Machine A: macOS session local_fee0634c-6124-4544-b69b-b653bf4fc0e4,
 *   title "Phase 3B implementation", Mac cwd
 * - Machine B: Windows session titled "Device test setup" (older,
 *   used for repeated git pulls on Windows)
 * - "Pull the latest from GitHub" typed into Windows session B
 *   executed on the Mac checkout ("Already up to date"); nothing
 *   ran on Windows
 * - After Windows reboot/restart: session B shows session A's
 *   entire transcript under B's own title and B's own sidebar
 *   history (Mac list_sessions has no "Device test setup")
 * - Decisive: hostname typed into Windows window executed on Mac,
 *   returned Mac / Darwin, output appeared in both windows
 * - Two distinct session records, one per machine, rendering one
 *   transcript; Windows input routed to Mac session's executor
 * - Impact: any destructive command would have run on the wrong
 *   machine
 * - Platform: Windows + macOS desktop; area:security + area:desktop
 *
 * Hypothesis only (NON-BINDING): desktop Remote Control /
 * account-level session bridge may bind UI windows to a remote
 * executor without surfacing the host; Windows and macOS session
 * records can share one live transcript while retaining distinct
 * titles/sidebars. Do not claim source you have not seen beyond
 * the issue's hostname-pin and dual-window evidence.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * No session-hijack instructions beyond documenting the reported
 * hostname-pin facts. Score whether the session is homed or crossed.
 *
 * NOT Tocsin #91503 (subagent Bash(run_in_background:true)
 * completion queued with no idle-wake consumer).
 * NOT Bolter #91422 (dontAsk cp/mv option-token matcher).
 * NOT Deadeye #91226 (relative PreToolUse Bash hook path × drifted
 * cwd deadlock).
 * NOT Reglet #91443 / Reliquary #91433 / Annunciator #91419 /
 * Caisson #91405 / Spindle #91402 / Knell #91298.
 * NOT Escapement / #91527 / #91528 / Fairlead #88423 as primary.
 * NOT Tumbler / Geneva / Scotch / Carillon / Pintle / Fibula /
 * Virgule / Riddle / Garner / Postern / Sluice / Reveille /
 * callboard / standing-rigging deadeye / flour-mill bolter /
 * watchhouse tocsin metaphors.
 * Product name stays Jackfield. Do not rename to Tocsin / Bolter /
 * Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle /
 * Knell / Tumbler / Escapement / Geneva / Scotch / Fibula /
 * Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice /
 * Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard /
 * Reveille / Callboard / Quench / Scrim / Knock / Platen /
 * Blackhole / Skipjack / Clepsydra.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "homed",
  "crossed",
  "windows-input",
  "macos-executor",
  "hostname-pin",
  "dual-title",
  "shared-transcript",
  "invisible-host",
  "remote-control",
  "list-sessions-asymmetry",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "homed";
export const SEEDED_WORD = "crossed";
export const HOLD_VERDICTS = Object.freeze(["homed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91511;
export const PRIMARY_ISSUES = Object.freeze([91511]);
export const COUSINS = Object.freeze([91055, 88501, 90433, 78776]);
export const COUSIN_ISSUE = 91055;
export const RELATED_IN_ISSUE = Object.freeze([91055, 88501, 90433, 78776]);
export const NOT_THAT_ISSUE = 91503;
export const BACKUPS = Object.freeze([
  { name: "Crimp", issue: 91520 },
  { name: "Codicil", issue: 91513 },
  { name: "Caret", issue: 91526 },
  { name: "Accrete", issue: 91512 },
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "quench",
  "scrim",
  "knock",
  "platen",
  "blackhole",
  "skipjack",
  "clepsydra",
  "fairlead",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "standing-rigging",
  "flour-mill",
  "watchhouse",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91511";
export const TITLE =
  "Desktop app: input typed into a Windows session executes in an unrelated macOS session (cross-machine session mix-up)";
export const FILED_AT = "2026-09-02T13:41:51Z";
export const UPDATED_AT = "2026-09-02T14:03:16Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "platform:macos",
  "area:security",
  "area:desktop",
]);
export const REPORTER = "barthaines";
export const VERSION = "2.1.247";
export const PLATFORM = "Windows + macOS desktop";
export const DARWIN = "Darwin 25.6.0";
export const HOSTNAME_RESULT = "Mac";
export const HOSTNAME_OS = "Darwin";
export const WINDOWS_TITLE = "Device test setup";
export const MACOS_TITLE = "Phase 3B implementation";
export const MACOS_SESSION = "local_fee0634c-6124-4544-b69b-b653bf4fc0e4";
export const MAC_CWD = "/Users/bart_1/dev/repo/gemini/tabletop_5e";
export const PULL_PHRASE = "Pull the latest from GitHub";
export const PULL_RESULT = "Already up to date";
export const SIDEBAR_FOREIGN = "Build 70 assembly";
export const EVIDENCE = "hostname-pin";
export const HUB_LINE =
  "01:50 jackfield: a jackfield that patches Windows keystrokes onto a Mac bus is not a channel strip — it is a crossed circuit. Score the home or admit the session already left its machine.";
export const MARK = "01:50 / hermes catalog #124 / #91511";
export const PHRASE =
  "a jackfield that patches Windows keystrokes onto a Mac bus is not a channel strip — it is a crossed circuit. Score the home or admit the session already left its machine.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: desktop Remote Control / account-level session bridge may bind UI windows to a remote executor without surfacing the host; Windows and macOS session records can share one live transcript while retaining distinct titles/sidebars. Do not claim source you have not seen beyond the issue's hostname-pin and dual-window evidence.";
export const CONTRAST_NOTE =
  "This is DESKTOP CROSS-MACHINE SESSION MIX-UP — WINDOWS INPUT EXECUTES ON UNRELATED MACOS SESSION; HOSTNAME RETURNS MAC/DARWIN; TWO SESSION RECORDS SHARE ONE TRANSCRIPT; AREA:SECURITY+DESKTOP. Machine A: macOS session local_fee0634c-6124-4544-b69b-b653bf4fc0e4, title Phase 3B implementation, Mac cwd. Machine B: Windows session titled Device test setup. Pull the latest from GitHub typed into Windows session B executed on the Mac checkout (Already up to date); nothing ran on Windows. After Windows reboot: session B shows session A's entire transcript under B's own title and B's own sidebar history. Mac list_sessions has no Device test setup. Decisive: hostname typed into the Windows window executed on Mac, returned Mac / Darwin, output appeared in both windows. Two distinct session records, one per machine, rendering one transcript; Windows input routed to Mac session's executor. Impact: any destructive command would have run on the wrong machine. Reporter barthaines. Claude Code 2.1.247 desktop (Windows + macOS Darwin 25.6.0), same account. Filed 2026-09-02. OPEN, has repro, platform:windows, platform:macos, area:security, area:desktop.";
export const FORBIDDEN_IDLE = Object.freeze([
  "armed",
  "unheard",
  "unbolted",
  "snagged",
  "reeved",
  "fouled",
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
  "Fairlead",
]);
export const FORBIDDEN_UI = Object.freeze([
  "watchhouse fire-bell",
  "flour-mill bolting-cloth",
  "standing-rigging deadeye",
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
    sessionHomed: null,
    windowsInputOnWindows: null,
    windowsInputOnMac: null,
    hostnameReturnsLocal: null,
    hostnameReturnsMac: null,
    dualTitle: null,
    sharedTranscript: null,
    invisibleHost: null,
    remoteControl: null,
    listSessionsAsymmetry: null,
    windowsInput: null,
    macosExecutor: null,
    hostnamePin: null,
    hasClearRepro: null,
    windowsTitle: "",
    macosTitle: "",
    macosSessionId: "",
    hostnameResult: "",
    pullPhrase: "",
    pullResult: "",
    platform: "",
    area: "",
    evidence: "",
    cliVersion: "",
    reporter: "",
    observed: "",
    darwin: "",
    outputText: "",
  };
}

export function seedHomed() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    sessionHomed: true,
    windowsInputOnWindows: true,
    windowsInputOnMac: false,
    hostnameReturnsLocal: true,
    hostnameReturnsMac: false,
    dualTitle: false,
    sharedTranscript: false,
    invisibleHost: false,
    remoteControl: false,
    listSessionsAsymmetry: false,
    windowsInput: true,
    macosExecutor: false,
    hostnamePin: false,
    hasClearRepro: false,
    windowsTitle: WINDOWS_TITLE,
    macosTitle: MACOS_TITLE,
    platform: PLATFORM,
    area: "area:security + area:desktop",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    darwin: DARWIN,
    outputText:
      "homed; a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows; idle word homed",
  };
}

export function seedCrossed() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    sessionHomed: false,
    windowsInputOnWindows: false,
    windowsInputOnMac: true,
    hostnameReturnsLocal: false,
    hostnameReturnsMac: true,
    dualTitle: true,
    sharedTranscript: true,
    invisibleHost: true,
    remoteControl: true,
    listSessionsAsymmetry: true,
    windowsInput: true,
    macosExecutor: true,
    hostnamePin: true,
    hasClearRepro: true,
    windowsTitle: WINDOWS_TITLE,
    macosTitle: MACOS_TITLE,
    macosSessionId: MACOS_SESSION,
    hostnameResult: `${HOSTNAME_RESULT} / ${HOSTNAME_OS}`,
    pullPhrase: PULL_PHRASE,
    pullResult: PULL_RESULT,
    platform: PLATFORM,
    area: "area:security + area:desktop",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    observed: "2026-09-02",
    darwin: DARWIN,
    outputText:
      "crossed; #91511; Windows input routes to unrelated macOS session executor; hostname returns Mac / Darwin; dual-title shared transcript; list_sessions asymmetry; Pull the latest from GitHub executed on Mac; Already up to date; Device test setup / Phase 3B implementation; barthaines; Claude Code 2.1.247; Windows + macOS Darwin 25.6.0; area:security area:desktop",
  };
}

export function seedWindowsInput() {
  return {
    ...blankTicket(),
    seed: "windows-input",
    source: "atelier",
    windowsInput: true,
    windowsTitle: WINDOWS_TITLE,
    outputText:
      "windows-input; input typed into a Windows session titled Device test setup",
  };
}

export function seedMacosExecutor() {
  return {
    ...blankTicket(),
    seed: "macos-executor",
    source: "atelier",
    macosExecutor: true,
    windowsInputOnMac: true,
    macosTitle: MACOS_TITLE,
    macosSessionId: MACOS_SESSION,
    outputText:
      "macos-executor; Windows input routed to Mac session local_fee0634c-6124-4544-b69b-b653bf4fc0e4 executor; Pull the latest from GitHub executed on the Mac checkout (Already up to date)",
  };
}

export function seedHostnamePin() {
  return {
    ...blankTicket(),
    seed: "hostname-pin",
    source: "atelier",
    hostnamePin: true,
    hostnameReturnsMac: true,
    hostnameResult: `${HOSTNAME_RESULT} / ${HOSTNAME_OS}`,
    outputText:
      "hostname-pin; hostname typed into the Windows window executed on Mac, returned Mac / Darwin, output appeared in both windows",
  };
}

export function seedDualTitle() {
  return {
    ...blankTicket(),
    seed: "dual-title",
    source: "atelier",
    dualTitle: true,
    windowsTitle: WINDOWS_TITLE,
    macosTitle: MACOS_TITLE,
    outputText:
      "dual-title; two distinct session records render one transcript under Device test setup and Phase 3B implementation",
  };
}

export function seedSharedTranscript() {
  return {
    ...blankTicket(),
    seed: "shared-transcript",
    source: "atelier",
    sharedTranscript: true,
    outputText:
      "shared-transcript; after Windows reboot, session B shows session A's entire transcript under B's own title and sidebar",
  };
}

export function seedInvisibleHost() {
  return {
    ...blankTicket(),
    seed: "invisible-host",
    source: "atelier",
    invisibleHost: true,
    outputText:
      "invisible-host; no host indication; Windows window does not show that the executor is Mac / Darwin",
  };
}

export function seedRemoteControl() {
  return {
    ...blankTicket(),
    seed: "remote-control",
    source: "atelier",
    remoteControl: true,
    outputText:
      "remote-control; Remote Control / account-level session bridge cousin cite; no host indication on the current session",
  };
}

export function seedListSessionsAsymmetry() {
  return {
    ...blankTicket(),
    seed: "list-sessions-asymmetry",
    source: "atelier",
    listSessionsAsymmetry: true,
    windowsTitle: WINDOWS_TITLE,
    outputText:
      "list-sessions-asymmetry; Mac list_sessions has no Device test setup; Windows sidebar keeps its own history",
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
    cliVersion: VERSION,
    platform: PLATFORM,
    darwin: DARWIN,
    outputText:
      "has-clear-repro; barthaines filed #91511; has repro; area:security; area:desktop; platform:windows; platform:macos; Claude Code 2.1.247; Darwin 25.6.0",
  };
}

export function seedHold() {
  return {
    ...seedHomed(),
    seed: "hold",
    outputText:
      "hold; a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows; the jackfield holds",
  };
}

export function seedCousin() {
  return {
    ...seedHomed(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #91055 session created on machine A opened from machine B silently executes on A with no host indication — cite only, not the #91511 Windows-to-macOS hostname-pin mix-up",
  };
}

export function emptyTicket() {
  return seedHomed();
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
    sessionHomed: firstBool(nested.sessionHomed, src.sessionHomed),
    windowsInputOnWindows: firstBool(
      nested.windowsInputOnWindows,
      src.windowsInputOnWindows,
    ),
    windowsInputOnMac: firstBool(nested.windowsInputOnMac, src.windowsInputOnMac),
    hostnameReturnsLocal: firstBool(
      nested.hostnameReturnsLocal,
      src.hostnameReturnsLocal,
    ),
    hostnameReturnsMac: firstBool(
      nested.hostnameReturnsMac,
      src.hostnameReturnsMac,
    ),
    dualTitle: firstBool(nested.dualTitle, src.dualTitle),
    sharedTranscript: firstBool(nested.sharedTranscript, src.sharedTranscript),
    invisibleHost: firstBool(nested.invisibleHost, src.invisibleHost),
    remoteControl: firstBool(nested.remoteControl, src.remoteControl),
    listSessionsAsymmetry: firstBool(
      nested.listSessionsAsymmetry,
      src.listSessionsAsymmetry,
    ),
    windowsInput: firstBool(nested.windowsInput, src.windowsInput),
    macosExecutor: firstBool(nested.macosExecutor, src.macosExecutor),
    hostnamePin: firstBool(nested.hostnamePin, src.hostnamePin),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    windowsTitle: firstText(nested.windowsTitle, src.windowsTitle),
    macosTitle: firstText(nested.macosTitle, src.macosTitle),
    macosSessionId: firstText(nested.macosSessionId, src.macosSessionId),
    hostnameResult: firstText(nested.hostnameResult, src.hostnameResult),
    pullPhrase: firstText(nested.pullPhrase, src.pullPhrase),
    pullResult: firstText(nested.pullResult, src.pullResult),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    reporter: firstText(nested.reporter, src.reporter),
    observed: firstText(nested.observed, src.observed),
    darwin: firstText(nested.darwin, src.darwin),
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
    row.sessionHomed == null &&
    row.windowsInputOnWindows == null &&
    row.windowsInputOnMac == null &&
    row.hostnameReturnsLocal == null &&
    row.hostnameReturnsMac == null &&
    row.dualTitle == null &&
    row.sharedTranscript == null &&
    row.invisibleHost == null &&
    row.remoteControl == null &&
    row.listSessionsAsymmetry == null &&
    row.windowsInput == null &&
    row.macosExecutor == null &&
    row.hostnamePin == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedHomed,
  [SEEDED_WORD]: seedCrossed,
  "windows-input": seedWindowsInput,
  windows: seedWindowsInput,
  "macos-executor": seedMacosExecutor,
  macos: seedMacosExecutor,
  "hostname-pin": seedHostnamePin,
  hostname: seedHostnamePin,
  "dual-title": seedDualTitle,
  "shared-transcript": seedSharedTranscript,
  "invisible-host": seedInvisibleHost,
  "remote-control": seedRemoteControl,
  "list-sessions-asymmetry": seedListSessionsAsymmetry,
  "list-sessions": seedListSessionsAsymmetry,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  91055: seedCousin,
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
    return { ...seedCrossed(), ...cloned, ...raw };
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
    ticket.windowsTitle,
    ticket.macosTitle,
    ticket.macosSessionId,
    ticket.hostnameResult,
    ticket.pullPhrase,
    ticket.pullResult,
    ticket.platform,
    ticket.area,
    ticket.evidence,
    ticket.darwin,
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

export function isHomed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.sessionHomed === true &&
    row.windowsInputOnWindows === true &&
    row.windowsInputOnMac !== true &&
    row.hostnameReturnsMac !== true
  ) {
    return true;
  }
  return false;
}

export function isCrossed(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.windowsInputOnMac === true && row.hostnameReturnsMac === true) ||
    (row.dualTitle === true && row.sharedTranscript === true) ||
    (row.macosExecutor === true && row.hostnamePin === true) ||
    (row.listSessionsAsymmetry === true && row.windowsInputOnMac === true)
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
      /cousin-not-primary|#91055|#88501|#90433|#78776/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const crossedNow = !cousinOnly && isCrossed(row);
  const homedNow = !crossedNow && isHomed(row);
  const windowsInput =
    row.windowsInput === true ||
    named === "windows-input" ||
    /windows-input|typed into.*Windows|Device test setup/i.test(text);
  const macosExecutor =
    row.macosExecutor === true ||
    row.windowsInputOnMac === true ||
    named === "macos-executor" ||
    /macos-executor|executed on the Mac|Mac session.*executor|Already up to date/i.test(
      text,
    );
  const hostnamePin =
    row.hostnamePin === true ||
    row.hostnameReturnsMac === true ||
    named === "hostname-pin" ||
    /hostname-pin|hostname.*Mac|Mac \/ Darwin|returned Mac/i.test(text);
  const dualTitle =
    row.dualTitle === true ||
    named === "dual-title" ||
    /dual-title|Device test setup|Phase 3B implementation|two distinct session/i.test(
      text,
    );
  const sharedTranscript =
    row.sharedTranscript === true ||
    named === "shared-transcript" ||
    /shared-transcript|entire transcript|one transcript/i.test(text);
  const invisibleHost =
    row.invisibleHost === true ||
    named === "invisible-host" ||
    /invisible-host|no host indication|invisible host/i.test(text);
  const remoteControl =
    row.remoteControl === true ||
    named === "remote-control" ||
    /remote-control|Remote Control|account-level session bridge/i.test(text);
  const listSessionsAsymmetry =
    row.listSessionsAsymmetry === true ||
    named === "list-sessions-asymmetry" ||
    /list-sessions-asymmetry|list_sessions|no Device test setup/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|barthaines|has repro|area:security|area:desktop/i.test(
      text,
    );
  const crossed =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (crossedNow || named === SEEDED_WORD || /crossed|#91511/i.test(text));
  const homed =
    named === IDLE_WORD || named === "hold" || (homedNow && !crossed);
  return {
    named,
    cousinOnly,
    crossedNow,
    homedNow,
    windowsInput,
    macosExecutor,
    hostnamePin,
    dualTitle,
    sharedTranscript,
    invisibleHost,
    remoteControl,
    listSessionsAsymmetry,
    hasClearRepro,
    crossed,
    homed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.homed && !flags.crossed) chips.push("homed");
  if (flags.crossed) chips.push("crossed");
  if (flags.windowsInput && flags.crossed) chips.push("windows-input");
  if (flags.macosExecutor && flags.crossed) chips.push("macos-executor");
  if (flags.hostnamePin && flags.crossed) chips.push("hostname-pin");
  if (flags.dualTitle && flags.crossed) chips.push("dual-title");
  if (flags.sharedTranscript && flags.crossed) chips.push("shared-transcript");
  if (flags.invisibleHost && flags.crossed) chips.push("invisible-host");
  if (flags.remoteControl && flags.crossed) chips.push("remote-control");
  if (flags.listSessionsAsymmetry && flags.crossed) {
    chips.push("list-sessions-asymmetry");
  }
  if (flags.hasClearRepro && flags.crossed) chips.push("has-clear-repro");
  if ((flags.homed || flags.named === "hold") && !flags.crossed) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "homed") {
    reasons.push(
      "homed; a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows",
    );
    reasons.push(
      "hold: the jackfield keeps each session channel on its own machine bus",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows; the jackfield holds",
    );
  }
  if (verdict === "crossed" || flags.crossed) {
    reasons.push(
      "crossed; #91511; Windows input routes to unrelated macOS session executor; hostname returns Mac / Darwin; dual-title shared transcript; no host indication",
    );
  }
  if (flags.windowsInput || verdict === "windows-input") {
    reasons.push(
      "windows-input; input typed into a Windows session titled Device test setup",
    );
  }
  if (flags.macosExecutor || verdict === "macos-executor") {
    reasons.push(
      "macos-executor; Windows input routed to Mac session local_fee0634c-6124-4544-b69b-b653bf4fc0e4 executor; Pull the latest from GitHub executed on the Mac checkout (Already up to date)",
    );
  }
  if (flags.hostnamePin || verdict === "hostname-pin") {
    reasons.push(
      "hostname-pin; hostname typed into the Windows window executed on Mac, returned Mac / Darwin, output appeared in both windows",
    );
  }
  if (flags.dualTitle || verdict === "dual-title") {
    reasons.push(
      "dual-title; two distinct session records render one transcript under Device test setup and Phase 3B implementation",
    );
  }
  if (flags.sharedTranscript || verdict === "shared-transcript") {
    reasons.push(
      "shared-transcript; after Windows reboot, session B shows session A's entire transcript under B's own title and sidebar",
    );
  }
  if (flags.invisibleHost || verdict === "invisible-host") {
    reasons.push(
      "invisible-host; no host indication; Windows window does not show that the executor is Mac / Darwin",
    );
  }
  if (flags.remoteControl || verdict === "remote-control") {
    reasons.push(
      "remote-control; Remote Control / account-level session bridge cousin cite; no host indication on the current session",
    );
  }
  if (flags.listSessionsAsymmetry || verdict === "list-sessions-asymmetry") {
    reasons.push(
      "list-sessions-asymmetry; Mac list_sessions has no Device test setup; Windows sidebar keeps its own history",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; ${PLATFORM}; ${DARWIN}; area:security; area:desktop; platform:windows; platform:macos`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Jackfield; cite-only #91055 session created on A opened from B silently executes on A with no host indication / #88501 Remote Control bridged session gives no host indication / #90433 sidebar session titles leak across machines / #78776 feature request to keep sessions local per device — not the #91511 Windows-to-macOS hostname-pin mix-up",
    );
  }
  if (verdict === "crossed" || flags.crossed) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "homed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.homed || !flags.crossed)) return "homed";
  if (named === "hold" && !flags.crossed) return "hold";
  if (named === SEEDED_WORD) return "crossed";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "homed";
  if (flags.crossed) return "crossed";
  if (flags.homed) return "homed";
  return "homed";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "crossed" || flags.crossed) {
    return {
      case: "crossed — Windows keystrokes patched onto a Mac bus",
      bus: "Windows session Device test setup → macOS executor Phase 3B implementation",
      patch: "hostname typed on Windows returned Mac / Darwin",
      pin: "two session records, one transcript; list_sessions asymmetry",
      mark: "jackfield crossed; admit the session already left its machine",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "homed — each session channel stays on its own machine bus",
      bus: "Windows input executes on Windows; macOS input executes on macOS",
      patch: "no cross-machine patch cord",
      pin: "hostname on Windows returns the Windows host",
      mark: "jackfield homed; the channel strip holds",
      note: "Hold: the jackfield is homed.",
    };
  }
  return {
    case: "homed — each session channel stays on its own machine bus",
    bus: "desktop session bound to the machine and directory that owns it",
    patch: "jacks seated on their own buses",
    pin: "hostname pin quiet; local executor",
    mark: "jackfield homed; idle word homed",
    note: "Homed: the jackfield holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const crossed = verdict === "crossed" || flags.crossed;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    homed: verdict === "homed" || (flags.homed && !crossed),
    crossed,
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
  if (name === SEEDED_WORD || name === 91511 || name === "91511") {
    return analyze(seedCrossed());
  }
  if (name === "windows-input" || name === "windows") {
    return analyze(seedWindowsInput());
  }
  if (name === "macos-executor" || name === "macos") {
    return analyze(seedMacosExecutor());
  }
  if (name === "hostname-pin" || name === "hostname") {
    return analyze(seedHostnamePin());
  }
  if (name === "dual-title") return analyze(seedDualTitle());
  if (name === "shared-transcript") return analyze(seedSharedTranscript());
  if (name === "invisible-host") return analyze(seedInvisibleHost());
  if (name === "remote-control") return analyze(seedRemoteControl());
  if (name === "list-sessions-asymmetry" || name === "list-sessions") {
    return analyze(seedListSessionsAsymmetry());
  }
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "homed" || name === "open") {
    return analyze(seedHomed());
  }
  if (
    name === 91055 ||
    name === "91055" ||
    name === "cousin" ||
    name === 88501 ||
    name === "88501" ||
    name === 90433 ||
    name === "90433" ||
    name === 78776 ||
    name === "78776"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedHomed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "crossed" || (result.crossed && result.alarm)
          ? `crossed jackfield #${FEATURED_ISSUE}: Windows input routes to unrelated macOS session executor; hostname returns Mac / Darwin; dual-title shared transcript. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. A desktop session stays bound to the machine and directory that owns it. Patch the jackfield."
            : `homed jackfield. Idle word ${IDLE_WORD}. A desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows.`,
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
