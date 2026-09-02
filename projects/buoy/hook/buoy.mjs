#!/usr/bin/env node
/**
 * Buoy — harbor layer sounding-board classifier.
 * A buoy that never settles back to the waterline is not a
 * mooring — it is a float stuck aloft. Score the layer or
 * admit the latch already captured.
 *
 *   echo '{"layer":3,"wasAlwaysOnTop":true}' | node buoy.mjs
 *   node buoy.mjs ticket.json
 *
 * Idle word is moored (HOLD: kCGWindowLayer=0, normal document
 * z-order). Seeded state is aloft / #91569 (layer=3
 * NSFloatingWindowLevel sticky; wasAlwaysOnTop latch true).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the main window layer is
 * moored (layer=0) or aloft (layer=3 latch captured).
 *
 * Primary #91569: macOS main window left at Floating level
 * (layer=3) after Computer Use side panel restores. Reporter
 * junqiu-lei. Filed 2026-09-02T18:18:25Z. OPEN. Labels: bug,
 * has-repro, platform:macos, area:desktop.
 *
 * Hypothesis only (NON-BINDING): stealth-relaunch
 * setAlwaysOnTop(true) until focus; if CU docks before clear,
 * wasAlwaysOnTop is captured true and every restore re-applies
 * setAlwaysOnTop(true, 'floating'); discard if issue evidence
 * disagrees.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "moored",
  "aloft",
  "floating",
  "latch-captured",
  "stealth-relaunch",
  "cu-side-panel",
  "docked-restored",
  "layer-3-sticky",
  "no-always-on-top-pref",
  "full-quit-clears",
  "hold",
]);
export const IDLE_WORD = "moored";
export const SEEDED_WORD = "aloft";
export const HOLD_VERDICTS = Object.freeze(["moored", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91569;
export const PRIMARY_ISSUES = Object.freeze([91569]);
export const COUSINS = Object.freeze([89467, 66516, 91230]);
export const COUSIN_ISSUE = 89467;
export const BACKUPS = Object.freeze([
  { name: "Caret", issue: 91526 },
  { name: "Hawser", issue: 91578 },
  { name: "Frisket", issue: 91574 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91569";
export const TITLE =
  "macOS main window left at Floating level (layer=3) after Computer Use side panel restores";
export const FILED_AT = "2026-09-02T18:18:25Z";
export const UPDATED_AT = "2026-09-02T18:19:36Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:desktop",
]);
export const REPORTER = "junqiu-lei";
export const VERSION = "1.40609.1";
export const CLI_VERSION = "2.1.255";
export const PREVIOUS_VERSION = "1.40609.0";
export const PLATFORM = "macOS (Darwin 25.5.0)";
export const AREA = "area:desktop";
export const EVIDENCE = "kCGWindowLayer-3-after-cu-side-panel-restore";
export const LAYER_NORMAL = 0;
export const LAYER_FLOATING = 3;
export const WINDOW_LEVEL = "NSFloatingWindowLevel";
export const MEASURED =
  "num=26927 layer=3 alpha=1 name= bounds={Height=869; Width=1512; X=49; Y=38;}";
export const MEASURED_AT = "2026-09-02";
export const STEALTH_RELAUNCH_AT = "2026-09-01T12:15:36";
export const DOCK_RESTORE_PAIRS = Object.freeze([
  { docked: "2026-09-01T17:05:45", restored: "2026-09-01T17:09:35" },
  { docked: "2026-09-01T17:11:13", restored: "2026-09-01T17:12:12" },
  { docked: "2026-09-01T17:13:59", restored: "2026-09-01T17:17:47" },
  { docked: "2026-09-01T17:18:06", restored: "2026-09-01T17:22:34" },
]);
export const HUB_LINE =
  "06:50 buoy: a buoy that never settles back to the waterline is not a mooring — it is a float stuck aloft. Score the layer or admit the latch already captured.";
export const MARK = "06:50 / hermes catalog #129 / #91569";
export const PHRASE =
  "Score the layer or admit the latch already captured.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: stealth-relaunch setAlwaysOnTop(true) until focus; if CU docks before clear, wasAlwaysOnTop captured true and every restore re-applies setAlwaysOnTop(true, 'floating'); discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is MACOS MAIN WINDOW LEFT AT FLOATING LEVEL (LAYER=3) AFTER COMPUTER USE SIDE PANEL RESTORES; AREA:DESKTOP; PLATFORM:MACOS. After Computer Use, main window stays at kCGWindowLayer=3 (NSFloatingWindowLevel); normal is layer=0. Measured via CGWindowListCopyWindowInfo while idle (no CU session): num=26927 layer=3 alpha=1 name= bounds={Height=869; Width=1512; X=49; Y=38;}. Full-size main window, not the side panel. No user setting / no always-on-top key in prefs. Logs show stealth-relaunch (12:15:36, update 1.40609.0 → 1.40609.1) then four balanced cu-side-panel docked/restored pairs; window still floating next day (2026-09-02). Workaround: full quit (Cmd+Q) clears it; merely closing the window does not. Likely latch: stealth-relaunch setAlwaysOnTop(true, 'normal', -1) until once('focus'); dock saves wasAlwaysOnTop: e.isAlwaysOnTop() then setAlwaysOnTop(true, 'floating'); restore writes back the captured value. Desktop app 1.40609.1 (bundled CLI 2.1.255); macOS Darwin 25.5.0. Reporter junqiu-lei. Filed 2026-09-02. OPEN, bug, has-repro, platform:macos, area:desktop.";
export const FORBIDDEN_IDLE = Object.freeze([
  "resolved",
  "literal",
  "sealed",
  "blanked",
  "attested",
  "usurped",
  "swaged",
  "torn",
  "homed",
  "crossed",
  "armed",
  "unheard",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Source Serif 4",
  "Work Sans",
  "Inconsolata",
  "Spectral",
  "Karla",
  "IBM Plex Mono",
  "Cormorant Garamond",
  "Figtree",
  "Azeret Mono",
  "Newsreader",
  "Manrope",
  "JetBrains Mono",
  "Brygada 1918",
  "Atkinson Hyperlegible",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "pintle",
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
    persistLayer: null,
    moored: null,
    aloft: null,
    layer: null,
    windowLevel: "",
    wasAlwaysOnTop: null,
    latchCaptured: null,
    stealthRelaunch: null,
    cuSidePanel: null,
    dockedRestored: null,
    layer3Sticky: null,
    noAlwaysOnTopPref: null,
    fullQuitClears: null,
    idleNoCuSession: null,
    fullSizeMainWindow: null,
    measured: "",
    measuredAt: "",
    stealthRelaunchAt: "",
    pairCount: null,
    platform: "",
    area: "",
    evidence: "",
    appVersion: "",
    cliVersion: "",
    previousVersion: "",
    reporter: "",
    outputText: "",
  };
}

export function seedMoored() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistLayer: true,
    moored: true,
    aloft: false,
    layer: LAYER_NORMAL,
    windowLevel: "normal",
    wasAlwaysOnTop: false,
    latchCaptured: false,
    stealthRelaunch: false,
    cuSidePanel: false,
    dockedRestored: false,
    layer3Sticky: false,
    noAlwaysOnTopPref: false,
    fullQuitClears: false,
    idleNoCuSession: true,
    fullSizeMainWindow: true,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    appVersion: VERSION,
    cliVersion: CLI_VERSION,
    outputText:
      "moored; kCGWindowLayer=0; normal document z-order; wasAlwaysOnTop latch clear; idle word moored",
  };
}

export function seedAloft() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistLayer: false,
    moored: false,
    aloft: true,
    layer: LAYER_FLOATING,
    windowLevel: WINDOW_LEVEL,
    wasAlwaysOnTop: true,
    latchCaptured: true,
    stealthRelaunch: true,
    cuSidePanel: true,
    dockedRestored: true,
    layer3Sticky: true,
    noAlwaysOnTopPref: true,
    fullQuitClears: true,
    idleNoCuSession: true,
    fullSizeMainWindow: true,
    measured: MEASURED,
    measuredAt: MEASURED_AT,
    stealthRelaunchAt: STEALTH_RELAUNCH_AT,
    pairCount: 4,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    appVersion: VERSION,
    cliVersion: CLI_VERSION,
    previousVersion: PREVIOUS_VERSION,
    reporter: REPORTER,
    outputText:
      "aloft; #91569; kCGWindowLayer=3 NSFloatingWindowLevel; wasAlwaysOnTop latch true; stealth-relaunch then four balanced cu-side-panel docked/restored pairs; still floating next day; junqiu-lei; Desktop 1.40609.1; macOS Darwin 25.5.0; area:desktop",
  };
}

export function seedFloating() {
  return {
    ...blankTicket(),
    seed: "floating",
    source: "atelier",
    layer: LAYER_FLOATING,
    windowLevel: WINDOW_LEVEL,
    aloft: true,
    persistLayer: false,
    outputText:
      "floating; kCGWindowLayer=3 is NSFloatingWindowLevel; normal document window is layer=0",
  };
}

export function seedLatchCaptured() {
  return {
    ...blankTicket(),
    seed: "latch-captured",
    source: "atelier",
    wasAlwaysOnTop: true,
    latchCaptured: true,
    aloft: true,
    persistLayer: false,
    outputText:
      "latch-captured; wasAlwaysOnTop captured true at dock; every restore re-applies setAlwaysOnTop(true, 'floating')",
  };
}

export function seedStealthRelaunch() {
  return {
    ...blankTicket(),
    seed: "stealth-relaunch",
    source: "atelier",
    stealthRelaunch: true,
    stealthRelaunchAt: STEALTH_RELAUNCH_AT,
    previousVersion: PREVIOUS_VERSION,
    appVersion: VERSION,
    aloft: true,
    persistLayer: false,
    outputText:
      "stealth-relaunch; 2026-09-01 12:15:36 setAlwaysOnTop(true, 'normal', -1) until once('focus'); update 1.40609.0 → 1.40609.1",
  };
}

export function seedCuSidePanel() {
  return {
    ...blankTicket(),
    seed: "cu-side-panel",
    source: "atelier",
    cuSidePanel: true,
    aloft: true,
    persistLayer: false,
    outputText:
      "cu-side-panel; dock saves wasAlwaysOnTop then setAlwaysOnTop(true, 'floating'); restore writes the captured value back",
  };
}

export function seedDockedRestored() {
  return {
    ...blankTicket(),
    seed: "docked-restored",
    source: "atelier",
    dockedRestored: true,
    pairCount: 4,
    aloft: true,
    persistLayer: false,
    outputText:
      "docked-restored; four balanced cu-side-panel docked/restored pairs on 2026-09-01; window still floating next day",
  };
}

export function seedLayer3Sticky() {
  return {
    ...blankTicket(),
    seed: "layer-3-sticky",
    source: "atelier",
    layer: LAYER_FLOATING,
    layer3Sticky: true,
    idleNoCuSession: true,
    fullSizeMainWindow: true,
    measured: MEASURED,
    measuredAt: MEASURED_AT,
    aloft: true,
    persistLayer: false,
    outputText:
      "layer-3-sticky; measured idle no CU session: num=26927 layer=3; full-size main window not side panel; still floating 2026-09-02",
  };
}

export function seedNoAlwaysOnTopPref() {
  return {
    ...blankTicket(),
    seed: "no-always-on-top-pref",
    source: "atelier",
    noAlwaysOnTopPref: true,
    aloft: true,
    persistLayer: false,
    outputText:
      "no-always-on-top-pref; no user setting / no always-on-top key in prefs",
  };
}

export function seedFullQuitClears() {
  return {
    ...blankTicket(),
    seed: "full-quit-clears",
    source: "atelier",
    fullQuitClears: true,
    aloft: true,
    persistLayer: false,
    outputText:
      "full-quit-clears; workaround: full quit (Cmd+Q) clears the floating level; merely closing the window does not",
  };
}

export function seedHold() {
  return {
    ...seedMoored(),
    seed: "hold",
    outputText:
      "hold; kCGWindowLayer=0; wasAlwaysOnTop latch clear; the waterline holds; idle word moored",
  };
}

export function seedCousin() {
  return {
    ...seedMoored(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #89467 Windows WS_EX_TOPMOST left set — cite only, not the #91569 macOS layer=3 latch",
  };
}

export function emptyTicket() {
  return seedMoored();
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
    persistLayer: firstBool(nested.persistLayer, src.persistLayer),
    moored: firstBool(nested.moored, src.moored),
    aloft: firstBool(nested.aloft, src.aloft),
    layer: firstNum(nested.layer, src.layer),
    windowLevel: firstText(nested.windowLevel, src.windowLevel),
    wasAlwaysOnTop: firstBool(nested.wasAlwaysOnTop, src.wasAlwaysOnTop),
    latchCaptured: firstBool(nested.latchCaptured, src.latchCaptured),
    stealthRelaunch: firstBool(nested.stealthRelaunch, src.stealthRelaunch),
    cuSidePanel: firstBool(nested.cuSidePanel, src.cuSidePanel),
    dockedRestored: firstBool(nested.dockedRestored, src.dockedRestored),
    layer3Sticky: firstBool(nested.layer3Sticky, src.layer3Sticky),
    noAlwaysOnTopPref: firstBool(
      nested.noAlwaysOnTopPref,
      src.noAlwaysOnTopPref,
    ),
    fullQuitClears: firstBool(nested.fullQuitClears, src.fullQuitClears),
    idleNoCuSession: firstBool(nested.idleNoCuSession, src.idleNoCuSession),
    fullSizeMainWindow: firstBool(
      nested.fullSizeMainWindow,
      src.fullSizeMainWindow,
    ),
    measured: firstText(nested.measured, src.measured),
    measuredAt: firstText(nested.measuredAt, src.measuredAt),
    stealthRelaunchAt: firstText(
      nested.stealthRelaunchAt,
      src.stealthRelaunchAt,
    ),
    pairCount: firstNum(nested.pairCount, src.pairCount),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    appVersion: firstText(nested.appVersion, src.appVersion),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    previousVersion: firstText(nested.previousVersion, src.previousVersion),
    reporter: firstText(nested.reporter, src.reporter),
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
    row.persistLayer == null &&
    row.moored == null &&
    row.aloft == null &&
    row.layer == null &&
    row.wasAlwaysOnTop == null &&
    row.latchCaptured == null &&
    row.layer3Sticky == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedMoored,
  [SEEDED_WORD]: seedAloft,
  floating: seedFloating,
  "latch-captured": seedLatchCaptured,
  "stealth-relaunch": seedStealthRelaunch,
  "cu-side-panel": seedCuSidePanel,
  "docked-restored": seedDockedRestored,
  "layer-3-sticky": seedLayer3Sticky,
  "no-always-on-top-pref": seedNoAlwaysOnTopPref,
  "full-quit-clears": seedFullQuitClears,
  hold: seedHold,
  cousin: seedCousin,
  89467: seedCousin,
  66516: seedCousin,
  91230: seedCousin,
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
    return { ...seedAloft(), ...cloned, ...raw };
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
    ticket.windowLevel,
    ticket.measured,
    ticket.platform,
    ticket.area,
    ticket.evidence,
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

export function isMoored(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.persistLayer === true &&
    row.aloft !== true &&
    row.layer !== LAYER_FLOATING &&
    row.wasAlwaysOnTop !== true
  ) {
    return true;
  }
  return false;
}

export function isAloft(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.aloft === true ||
    row.layer === LAYER_FLOATING ||
    row.wasAlwaysOnTop === true ||
    (row.persistLayer === false && row.latchCaptured === true) ||
    (row.layer3Sticky === true && row.moored === false)
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
      /cousin-not-primary|#89467|#66516|#91230/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const aloftNow = !cousinOnly && isAloft(row);
  const mooredNow = !aloftNow && isMoored(row);
  const floating =
    row.layer === LAYER_FLOATING ||
    named === "floating" ||
    /floating|kCGWindowLayer=3|NSFloatingWindowLevel/i.test(text);
  const latchCaptured =
    row.wasAlwaysOnTop === true ||
    row.latchCaptured === true ||
    named === "latch-captured" ||
    /latch-captured|wasAlwaysOnTop captured|latch already captured/i.test(text);
  const stealthRelaunch =
    row.stealthRelaunch === true ||
    named === "stealth-relaunch" ||
    /stealth-relaunch|12:15:36/i.test(text);
  const cuSidePanel =
    row.cuSidePanel === true ||
    named === "cu-side-panel" ||
    /cu-side-panel|setAlwaysOnTop\(true, 'floating'\)/i.test(text);
  const dockedRestored =
    row.dockedRestored === true ||
    named === "docked-restored" ||
    /docked-restored|four balanced|docked\/restored pairs/i.test(text);
  const layer3Sticky =
    row.layer3Sticky === true ||
    named === "layer-3-sticky" ||
    /layer-3-sticky|still floating next day|num=26927/i.test(text);
  const noAlwaysOnTopPref =
    row.noAlwaysOnTopPref === true ||
    named === "no-always-on-top-pref" ||
    /no-always-on-top-pref|no always-on-top key|no user setting/i.test(text);
  const fullQuitClears =
    row.fullQuitClears === true ||
    named === "full-quit-clears" ||
    /full-quit-clears|full quit|Cmd\+Q/i.test(text);
  const aloft =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (aloftNow || named === SEEDED_WORD || /aloft|#91569/i.test(text));
  const moored =
    named === IDLE_WORD ||
    named === "hold" ||
    (mooredNow && !aloft);
  return {
    named,
    cousinOnly,
    aloftNow,
    mooredNow,
    floating,
    latchCaptured,
    stealthRelaunch,
    cuSidePanel,
    dockedRestored,
    layer3Sticky,
    noAlwaysOnTopPref,
    fullQuitClears,
    aloft,
    moored,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.moored && !flags.aloft) chips.push("moored");
  if (flags.aloft) chips.push("aloft");
  if (flags.floating && flags.aloft) chips.push("floating");
  if (flags.latchCaptured && flags.aloft) chips.push("latch-captured");
  if (flags.stealthRelaunch && flags.aloft) chips.push("stealth-relaunch");
  if (flags.cuSidePanel && flags.aloft) chips.push("cu-side-panel");
  if (flags.dockedRestored && flags.aloft) chips.push("docked-restored");
  if (flags.layer3Sticky && flags.aloft) chips.push("layer-3-sticky");
  if (flags.noAlwaysOnTopPref && flags.aloft) {
    chips.push("no-always-on-top-pref");
  }
  if (flags.fullQuitClears && flags.aloft) chips.push("full-quit-clears");
  if ((flags.moored || flags.named === "hold") && !flags.aloft) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "moored") {
    reasons.push(
      "moored; kCGWindowLayer=0; normal document z-order; wasAlwaysOnTop latch clear",
    );
    reasons.push("hold: the waterline is a mooring; idle word moored");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; kCGWindowLayer=0; wasAlwaysOnTop latch clear; the waterline holds",
    );
  }
  if (verdict === "aloft" || flags.aloft) {
    reasons.push(
      "aloft; #91569; kCGWindowLayer=3 NSFloatingWindowLevel; wasAlwaysOnTop latch true",
    );
  }
  if (flags.floating || verdict === "floating") {
    reasons.push(
      "floating; kCGWindowLayer=3 is NSFloatingWindowLevel; normal document window is layer=0",
    );
  }
  if (flags.latchCaptured || verdict === "latch-captured") {
    reasons.push(
      "latch-captured; wasAlwaysOnTop captured true at dock; every restore re-applies setAlwaysOnTop(true, 'floating')",
    );
  }
  if (flags.stealthRelaunch || verdict === "stealth-relaunch") {
    reasons.push(
      "stealth-relaunch; 2026-09-01 12:15:36 setAlwaysOnTop(true, 'normal', -1) until once('focus'); update 1.40609.0 → 1.40609.1",
    );
  }
  if (flags.cuSidePanel || verdict === "cu-side-panel") {
    reasons.push(
      "cu-side-panel; dock saves wasAlwaysOnTop then setAlwaysOnTop(true, 'floating'); restore writes the captured value back",
    );
  }
  if (flags.dockedRestored || verdict === "docked-restored") {
    reasons.push(
      "docked-restored; four balanced cu-side-panel docked/restored pairs on 2026-09-01; window still floating next day",
    );
  }
  if (flags.layer3Sticky || verdict === "layer-3-sticky") {
    reasons.push(
      "layer-3-sticky; measured idle no CU session: num=26927 layer=3; full-size main window not side panel; still floating 2026-09-02",
    );
  }
  if (flags.noAlwaysOnTopPref || verdict === "no-always-on-top-pref") {
    reasons.push(
      "no-always-on-top-pref; no user setting / no always-on-top key in prefs",
    );
  }
  if (flags.fullQuitClears || verdict === "full-quit-clears") {
    reasons.push(
      "full-quit-clears; workaround: full quit (Cmd+Q) clears the floating level; merely closing the window does not",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Buoy; cite-only #89467 Windows WS_EX_TOPMOST / #66516 closed-as-invalid same macOS symptom / #91230 CU window move/maximize same subsystem — primary stays #91569",
    );
  }
  if (verdict === "aloft" || flags.aloft) {
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
  if (named === IDLE_WORD && (flags.moored || !flags.aloft)) return "moored";
  if (named === "hold" && !flags.aloft) return "hold";
  if (named === SEEDED_WORD) return "aloft";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "moored";
  if (flags.aloft) return "aloft";
  if (flags.moored) return "moored";
  return "moored";
}

function boardOf(flags, ticket, verdict) {
  if (verdict === "aloft" || flags.aloft) {
    return {
      case: "aloft — layer=3 floating sticky; wasAlwaysOnTop latch true",
      layer: LAYER_FLOATING,
      waterline: "layer 0 never regained",
      latch: "wasAlwaysOnTop captured true",
      mark: "buoy aloft; admit the latch already captured",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — layer=0; latch clear",
      layer: LAYER_NORMAL,
      waterline: "layer 0 waterline holds",
      latch: "wasAlwaysOnTop false",
      mark: "buoy hold; the waterline holds",
      note: "Hold: the waterline holds.",
    };
  }
  return {
    case: "moored — layer=0; normal document z-order",
    layer: LAYER_NORMAL,
    waterline: "layer 0 waterline",
    latch: "wasAlwaysOnTop latch clear",
    mark: "buoy moored; idle word moored",
    note: "Moored: the waterline holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const aloft = verdict === "aloft" || flags.aloft;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    moored: verdict === "moored" || (flags.moored && !aloft),
    aloft,
    floating: flags.floating && aloft,
    latchCaptured: flags.latchCaptured && aloft,
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
  if (name === SEEDED_WORD || name === 91569 || name === "91569") {
    return analyze(seedAloft());
  }
  if (name === "floating") return analyze(seedFloating());
  if (name === "latch-captured") return analyze(seedLatchCaptured());
  if (name === "stealth-relaunch") return analyze(seedStealthRelaunch());
  if (name === "cu-side-panel") return analyze(seedCuSidePanel());
  if (name === "docked-restored") return analyze(seedDockedRestored());
  if (name === "layer-3-sticky") return analyze(seedLayer3Sticky());
  if (name === "no-always-on-top-pref") {
    return analyze(seedNoAlwaysOnTopPref());
  }
  if (name === "full-quit-clears") return analyze(seedFullQuitClears());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "moored" || name === "open") {
    return analyze(seedMoored());
  }
  if (
    name === 89467 ||
    name === "89467" ||
    name === 66516 ||
    name === "66516" ||
    name === 91230 ||
    name === "91230" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedMoored());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "aloft" || (result.aloft && result.alarm)
          ? `aloft buoy #${FEATURED_ISSUE}: macOS main window left at Floating level (layer=3) after Computer Use side panel restores. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. kCGWindowLayer=0. Score the layer."
            : `moored buoy. Idle word ${IDLE_WORD}. kCGWindowLayer=0; normal document z-order; wasAlwaysOnTop latch clear.`,
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
