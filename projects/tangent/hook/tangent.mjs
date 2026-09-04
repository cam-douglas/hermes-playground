#!/usr/bin/env node
/**
 * Tangent — clavichord / keyboard-protocol sounding-board classifier.
 * A tangent that never strikes the shifted pitch is not a keyed
 * note — it is a muted string. Score the strike or admit the
 * alternate field already muted.
 *
 *   echo '{"sequence":"ESC[49:33;2u","parsedGlyph":"1"}' | node tangent.mjs
 *   node tangent.mjs ticket.json
 *
 * Idle word is sounded (HOLD: Shift-only CSI-u uses the alternate
 * field; ! / ? / : / A insert correctly).
 * Seeded state is muted / #92021 (ESC[>5u] requested; shifted
 * sub-parameter never parsed; symbols wrong or blank on
 * WezTerm/WSL).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the tangent sounded
 * (alternate field consumed) or already muted (flag 4
 * requested; shifted field ignored).
 *
 * Primary #92021: Shifted keys lost in WezTerm since 2.1.247:
 * Kitty "report alternate keys" flag is requested but the
 * shifted-key field is never parsed. Reporter chadkirst-authid.
 * Filed 2026-09-04T08:16:01Z. OPEN. Labels: bug, has repro,
 * platform:windows, platform:wsl, area:tui, regression.
 *
 * Hypothesis only (NON-BINDING): Kitty flag 4 requests
 * alternate keys but the CSI-u parser never consumes the
 * shifted sub-parameter (and event-type modifier form fails
 * the regex). Discard if issue evidence disagrees. Do not
 * claim Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sounded",
  "muted",
  "unshifted",
  "flag-4",
  "csi-u",
  "conpty-blank",
  "event-type-drop",
  "symbol-wrong",
  "alternate-ignored",
  "hold",
]);
export const IDLE_WORD = "sounded";
export const SEEDED_WORD = "muted";
export const HOLD_VERDICTS = Object.freeze(["sounded", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92021;
export const PRIMARY_ISSUES = Object.freeze([92021]);
export const COUSINS = Object.freeze([90067, 71700, 77386]);
export const COUSIN_ISSUE = 90067;
export const BACKUPS = Object.freeze([{ name: "Lock-hang", issue: 91987 }]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92021";
export const TITLE =
  '[BUG] Shifted keys lost in WezTerm since 2.1.247: Kitty "report alternate keys" flag is requested but the shifted-key field is never parsed';
export const FILED_AT = "2026-09-04T08:16:01Z";
export const UPDATED_AT = "2026-09-04T08:17:09Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "platform:wsl",
  "area:tui",
  "regression",
]);
export const REPORTER = "chadkirst-authid";
export const VERSION = "2.1.260";
export const LAST_WORKING = "2.1.246";
export const REGRESSION_AT = "2.1.247";
export const PLATFORM =
  "WezTerm 20240203 on Windows 11 hosting WSL2 Ubuntu";
export const AREA = "area:tui";
export const EVIDENCE = "kitty-flag-4-shifted-subparameter-never-parsed";
export const TERM_PROGRAM = "WezTerm";
export const WEZTERM = "20240203-110809-5046fc22";
export const FLAG_246 = ">1u";
export const FLAG_247 = ">5u";
export const FLAG_4 = 4;
export const SEQ_SHIFT_1 = "ESC[49:33;2u";
export const SEQ_SHIFT_SEMI = "ESC[59:58;2u";
export const SEQ_SHIFT_SLASH = "ESC[47:63;2u";
export const SEQ_SHIFT_A = "ESC[97:65;2u";
export const SEQ_EVENT_TYPE = "ESC[97:65;2:1u";
export const SEQ_EVENT_BARE = "ESC[97;2:1u";
export const SEQ_SHIFT_TAB = "ESC[9;2u";
export const SEQ_SHIFT_ENTER = "ESC[13;2u";
export const SEQ_NUMLOCK = "ESC[97:65;130u";
export const REPORTED_REGEX =
  "^\\x1b\\[(\\d+)(?::(\\d*)(?::(\\d+))?)?(?:;(\\d+))?u";
export const INSERT_TABLE = Object.freeze([
  { input: "ESC[97:65;2u", expected: "A", actual: "A", note: "letter via uppercase" },
  { input: "ESC[49:33;2u", expected: "!", actual: "1", note: "symbol-wrong" },
  { input: "ESC[59:58;2u", expected: ":", actual: ";", note: "symbol-wrong" },
  { input: "ESC[47:63;2u", expected: "?", actual: "/", note: "symbol-wrong" },
  { input: "ESC[97:65;2:1u", expected: "A", actual: "", note: "event-type-drop" },
  { input: "ESC[97;2:1u", expected: "A", actual: "", note: "event-type-drop" },
  { input: "ESC[97:65;130u", expected: "A", actual: "A", note: "numlock-ok" },
  { input: "ESC[9;2u", expected: "mode-cycle", actual: "mode-cycle", note: "shift-tab-ok" },
  { input: "ESC[13;2u", expected: "newline", actual: "newline", note: "shift-enter-ok" },
]);
export const HUB_LINE =
  "08:50 tangent: a tangent that never strikes the shifted pitch is not a keyed note — it is a muted string. Score the strike or admit the alternate field already muted.";
export const MARK = "08:50 / hermes catalog #132 / #92021";
export const PHRASE =
  "Score the strike or admit the alternate field already muted.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: Kitty flag 4 requests alternate keys but the CSI-u parser never consumes the shifted sub-parameter (and event-type modifier form fails the regex). Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is TUI KITTY CSI-U SHIFTED-FIELD PARSE ON WEZTERM/WSL. Since 2.1.247 Claude Code enables Kitty keyboard protocol with flag 4 (report alternate keys) by sending ESC[>5u; 2.1.246 sent ESC[>1u. WezTerm encodes Shift+1 as ESC[49:33;2u (unshifted 1, shifted !). The CSI-u parser reads the first sub-parameter (unshifted key) and the third (base layout, used for Ctrl) but never the second (shifted key), and reconstructs by uppercasing the unshifted key — wrong for symbols (1 instead of !, ; instead of :, / instead of ?). On WezTerm→ConPTY→WSL colon-bearing sequences often insert NOTHING (Shift+A / Shift+1 / Shift+?). Shift+Tab / Shift+Enter still work. Secondary: CSI-u with event-type sub-field ESC[97:65;2:1u dropped by a regex that only accepts a bare modifier number. Reporter chadkirst-authid. Filed 2026-09-04. OPEN, bug, has repro, platform:windows, platform:wsl, area:tui, regression. Claude Code 2.1.260; last working 2.1.246; WezTerm 20240203 on Windows 11 hosting WSL2 Ubuntu.";
export const FORBIDDEN_IDLE = Object.freeze([
  "slipped",
  "fouled",
  "verbatim",
  "mangled",
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
  "homed",
  "crossed",
  "armed",
  "unheard",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Knock",
  "Frisket",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Fraunces",
  "Outfit",
  "IBM Plex Mono",
  "Playfair Display",
  "Playfair",
  "DM Sans",
  "Fragment Mono",
  "Fragment",
  "Petrona",
  "Sora",
  "Fira Code",
  "Fira",
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "knock",
  "frisket",
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
    persistStrike: null,
    sounded: null,
    muted: null,
    sequence: "",
    unshifted: null,
    shifted: null,
    modifier: null,
    eventType: null,
    parsedGlyph: "",
    expectedGlyph: "",
    flagRequested: "",
    flag4: null,
    alternateConsumed: null,
    conptyBlank: null,
    eventTypeDrop: null,
    symbolWrong: null,
    unshiftedOnly: null,
    csiU: null,
    platform: "",
    area: "",
    evidence: "",
    cliVersion: "",
    lastWorking: "",
    reporter: "",
    term: "",
    outputText: "",
  };
}

export function seedSounded() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistStrike: true,
    sounded: true,
    muted: false,
    sequence: SEQ_SHIFT_1,
    unshifted: 49,
    shifted: 33,
    modifier: 2,
    parsedGlyph: "!",
    expectedGlyph: "!",
    flagRequested: FLAG_247,
    flag4: true,
    alternateConsumed: true,
    conptyBlank: false,
    eventTypeDrop: false,
    symbolWrong: false,
    unshiftedOnly: false,
    csiU: true,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    lastWorking: LAST_WORKING,
    term: TERM_PROGRAM,
    outputText:
      "sounded; Shift-only CSI-u uses alternate field; ! / ? / : / A insert correctly; idle word sounded",
  };
}

export function seedMuted() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistStrike: false,
    sounded: false,
    muted: true,
    sequence: SEQ_SHIFT_1,
    unshifted: 49,
    shifted: 33,
    modifier: 2,
    parsedGlyph: "1",
    expectedGlyph: "!",
    flagRequested: FLAG_247,
    flag4: true,
    alternateConsumed: false,
    conptyBlank: true,
    eventTypeDrop: true,
    symbolWrong: true,
    unshiftedOnly: true,
    csiU: true,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    lastWorking: LAST_WORKING,
    reporter: REPORTER,
    term: TERM_PROGRAM,
    outputText:
      "muted; #92021; ESC[>5u] requested; shifted sub-parameter never parsed; ESC[49:33;2u] inserts 1 not !; WezTerm/WSL colon sequences often blank; chadkirst-authid; 2.1.260; last working 2.1.246; area:tui",
  };
}

export function seedUnshifted() {
  return {
    ...blankTicket(),
    seed: "unshifted",
    source: "atelier",
    unshiftedOnly: true,
    sequence: SEQ_SHIFT_1,
    unshifted: 49,
    shifted: 33,
    parsedGlyph: "1",
    expectedGlyph: "!",
    muted: true,
    persistStrike: false,
    outputText:
      "unshifted; parser reads first sub-parameter (unshifted 49) and reconstructs by uppercasing; never the second (shifted 33)",
  };
}

export function seedFlag4() {
  return {
    ...blankTicket(),
    seed: "flag-4",
    source: "atelier",
    flag4: true,
    flagRequested: FLAG_247,
    muted: true,
    persistStrike: false,
    outputText:
      "flag-4; 2.1.247+ sends ESC[>5u] (Kitty flag 4 = report alternate keys); 2.1.246 sent ESC[>1u]; requesting flag 4 without consuming the field it adds",
  };
}

export function seedCsiU() {
  return {
    ...blankTicket(),
    seed: "csi-u",
    source: "atelier",
    csiU: true,
    sequence: SEQ_SHIFT_1,
    muted: true,
    persistStrike: false,
    outputText:
      "csi-u; WezTerm encodes Shift+1 as ESC[49:33;2u (unshifted 1, shifted !); CSI-u carrying a shifted-key field is valid protocol input",
  };
}

export function seedConptyBlank() {
  return {
    ...blankTicket(),
    seed: "conpty-blank",
    source: "atelier",
    conptyBlank: true,
    sequence: SEQ_SHIFT_1,
    parsedGlyph: "",
    expectedGlyph: "!",
    muted: true,
    persistStrike: false,
    outputText:
      "conpty-blank; WezTerm→ConPTY→WSL colon-bearing sequences often insert NOTHING (Shift+A / Shift+1 / Shift+?); Shift+Tab / Shift+Enter still work",
  };
}

export function seedEventTypeDrop() {
  return {
    ...blankTicket(),
    seed: "event-type-drop",
    source: "atelier",
    eventTypeDrop: true,
    eventType: 1,
    sequence: SEQ_EVENT_TYPE,
    parsedGlyph: "",
    expectedGlyph: "A",
    muted: true,
    persistStrike: false,
    outputText:
      "event-type-drop; ESC[97:65;2:1u dropped by a regex that only accepts a bare modifier number",
  };
}

export function seedSymbolWrong() {
  return {
    ...blankTicket(),
    seed: "symbol-wrong",
    source: "atelier",
    symbolWrong: true,
    sequence: SEQ_SHIFT_1,
    parsedGlyph: "1",
    expectedGlyph: "!",
    muted: true,
    persistStrike: false,
    outputText:
      "symbol-wrong; ESC[49:33;2u] inserts 1 not !; ESC[59:58;2u] inserts ; not :; ESC[47:63;2u] inserts / not ?",
  };
}

export function seedAlternateIgnored() {
  return {
    ...blankTicket(),
    seed: "alternate-ignored",
    source: "atelier",
    alternateConsumed: false,
    shifted: 33,
    unshifted: 49,
    sequence: SEQ_SHIFT_1,
    muted: true,
    persistStrike: false,
    outputText:
      "alternate-ignored; CSI-u parser never consumes the second (shifted) sub-parameter; flag 4 asked for the pitch the tangent never struck",
  };
}

export function seedHold() {
  return {
    ...seedSounded(),
    seed: "hold",
    outputText:
      "hold; Shift-only CSI-u uses alternate field; ! / ? / : / A insert correctly; the string sounds; idle word sounded",
  };
}

export function seedCousin() {
  return {
    ...seedSounded(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #90067 earlier WezTerm shifted-punctuation regression — cite only, not the #92021 flag-4 / shifted-field parse",
  };
}

export function emptyTicket() {
  return seedSounded();
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
    persistStrike: firstBool(nested.persistStrike, src.persistStrike),
    sounded: firstBool(nested.sounded, src.sounded),
    muted: firstBool(nested.muted, src.muted),
    sequence: firstText(nested.sequence, src.sequence),
    unshifted: firstNum(nested.unshifted, src.unshifted),
    shifted: firstNum(nested.shifted, src.shifted),
    modifier: firstNum(nested.modifier, src.modifier),
    eventType: firstNum(nested.eventType, src.eventType),
    parsedGlyph: firstText(nested.parsedGlyph, src.parsedGlyph),
    expectedGlyph: firstText(nested.expectedGlyph, src.expectedGlyph),
    flagRequested: firstText(nested.flagRequested, src.flagRequested),
    flag4: firstBool(nested.flag4, src.flag4),
    alternateConsumed: firstBool(
      nested.alternateConsumed,
      src.alternateConsumed,
    ),
    conptyBlank: firstBool(nested.conptyBlank, src.conptyBlank),
    eventTypeDrop: firstBool(nested.eventTypeDrop, src.eventTypeDrop),
    symbolWrong: firstBool(nested.symbolWrong, src.symbolWrong),
    unshiftedOnly: firstBool(nested.unshiftedOnly, src.unshiftedOnly),
    csiU: firstBool(nested.csiU, src.csiU),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    lastWorking: firstText(nested.lastWorking, src.lastWorking),
    reporter: firstText(nested.reporter, src.reporter),
    term: firstText(nested.term, src.term),
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
    row.persistStrike == null &&
    row.sounded == null &&
    row.muted == null &&
    !row.sequence &&
    row.parsedGlyph == null &&
    row.alternateConsumed == null &&
    row.conptyBlank == null &&
    row.eventTypeDrop == null &&
    row.symbolWrong == null &&
    row.unshiftedOnly == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSounded,
  [SEEDED_WORD]: seedMuted,
  unshifted: seedUnshifted,
  "flag-4": seedFlag4,
  "csi-u": seedCsiU,
  "conpty-blank": seedConptyBlank,
  "event-type-drop": seedEventTypeDrop,
  "symbol-wrong": seedSymbolWrong,
  "alternate-ignored": seedAlternateIgnored,
  hold: seedHold,
  cousin: seedCousin,
  90067: seedCousin,
  71700: seedCousin,
  77386: seedCousin,
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
    return { ...seedMuted(), ...cloned, ...raw };
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
    ticket.sequence,
    ticket.flagRequested,
    ticket.parsedGlyph,
    ticket.expectedGlyph,
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

function glyphMiss(row) {
  if (row.parsedGlyph && row.expectedGlyph && row.parsedGlyph !== row.expectedGlyph) {
    return true;
  }
  if (row.conptyBlank === true && row.expectedGlyph && row.parsedGlyph === "") {
    return true;
  }
  return false;
}

function strikeMissed(row) {
  if (row.alternateConsumed === false && row.shifted != null) return true;
  if (row.unshiftedOnly === true) return true;
  if (row.flag4 === true && row.alternateConsumed === false) return true;
  if (glyphMiss(row)) return true;
  if (row.eventTypeDrop === true) return true;
  if (row.conptyBlank === true) return true;
  if (row.symbolWrong === true) return true;
  return false;
}

export function isSounded(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.persistStrike === true &&
    row.muted !== true &&
    row.alternateConsumed !== false &&
    !strikeMissed(row)
  ) {
    return true;
  }
  return false;
}

export function isMuted(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.muted === true ||
    strikeMissed(row) ||
    (row.persistStrike === false && row.flag4 === true) ||
    (row.alternateConsumed === false && row.sounded === false)
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
    (COUSINS.includes(row.issue) || /cousin-not-primary|#90067|#71700|#77386/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const mutedNow = !cousinOnly && isMuted(row);
  const soundedNow = !mutedNow && isSounded(row);
  const unshifted =
    row.unshiftedOnly === true ||
    named === "unshifted" ||
    /unshifted|first sub-parameter|uppercas/i.test(text);
  const flag4 =
    row.flag4 === true ||
    named === "flag-4" ||
    row.flagRequested === FLAG_247 ||
    />5u|flag 4|report alternate keys/i.test(text);
  const csiU =
    row.csiU === true ||
    named === "csi-u" ||
    /csi-u|ESC\[49:33;2u|49:33;2u/i.test(text) ||
    /ESC\[\d/.test(row.sequence || "");
  const conptyBlank =
    row.conptyBlank === true ||
    named === "conpty-blank" ||
    /conpty-blank|ConPTY|insert NOTHING|colon-bearing/i.test(text);
  const eventTypeDrop =
    row.eventTypeDrop === true ||
    named === "event-type-drop" ||
    row.eventType === 1 ||
    /event-type-drop|2:1u|bare modifier/i.test(text);
  const symbolWrong =
    row.symbolWrong === true ||
    named === "symbol-wrong" ||
    (row.parsedGlyph === "1" && row.expectedGlyph === "!") ||
    /symbol-wrong|inserts 1 not !|instead of !/i.test(text);
  const alternateIgnored =
    row.alternateConsumed === false ||
    named === "alternate-ignored" ||
    /alternate-ignored|never consumes the second|shifted sub-parameter never/i.test(
      text,
    );
  const muted =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (mutedNow || named === SEEDED_WORD || /muted|#92021/i.test(text));
  const sounded =
    named === IDLE_WORD ||
    named === "hold" ||
    (soundedNow && !muted);
  return {
    named,
    cousinOnly,
    mutedNow,
    soundedNow,
    unshifted,
    flag4,
    csiU,
    conptyBlank,
    eventTypeDrop,
    symbolWrong,
    alternateIgnored,
    muted,
    sounded,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sounded && !flags.muted) chips.push("sounded");
  if (flags.muted) chips.push("muted");
  if (flags.unshifted && flags.muted) chips.push("unshifted");
  if (flags.flag4 && flags.muted) chips.push("flag-4");
  if (flags.csiU && flags.muted) chips.push("csi-u");
  if (flags.conptyBlank && flags.muted) chips.push("conpty-blank");
  if (flags.eventTypeDrop && flags.muted) chips.push("event-type-drop");
  if (flags.symbolWrong && flags.muted) chips.push("symbol-wrong");
  if (flags.alternateIgnored && flags.muted) chips.push("alternate-ignored");
  if ((flags.sounded || flags.named === "hold") && !flags.muted) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sounded") {
    reasons.push(
      "sounded; Shift-only CSI-u uses alternate field; ! / ? / : / A insert correctly",
    );
    reasons.push("hold: the tangent struck the shifted pitch; idle word sounded");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; Shift-only CSI-u uses alternate field; ! / ? / : / A insert correctly; the string sounds",
    );
  }
  if (verdict === "muted" || flags.muted) {
    reasons.push(
      "muted; #92021; ESC[>5u] requested; shifted sub-parameter never parsed; ESC[49:33;2u] inserts 1 not !",
    );
  }
  if (verdict === "unshifted" || (flags.unshifted && flags.muted)) {
    reasons.push(
      "unshifted; parser reads first sub-parameter (unshifted 49) and reconstructs by uppercasing; never the second (shifted 33)",
    );
  }
  if (verdict === "flag-4" || (flags.flag4 && flags.muted)) {
    reasons.push(
      "flag-4; 2.1.247+ sends ESC[>5u] (Kitty flag 4 = report alternate keys); 2.1.246 sent ESC[>1u]; requesting flag 4 without consuming the field it adds",
    );
  }
  if (verdict === "csi-u" || (flags.csiU && flags.muted)) {
    reasons.push(
      "csi-u; WezTerm encodes Shift+1 as ESC[49:33;2u (unshifted 1, shifted !)",
    );
  }
  if (verdict === "conpty-blank" || (flags.conptyBlank && flags.muted)) {
    reasons.push(
      "conpty-blank; WezTerm→ConPTY→WSL colon-bearing sequences often insert NOTHING; Shift+Tab / Shift+Enter still work",
    );
  }
  if (verdict === "event-type-drop" || (flags.eventTypeDrop && flags.muted)) {
    reasons.push(
      "event-type-drop; ESC[97:65;2:1u dropped by a regex that only accepts a bare modifier number",
    );
  }
  if (verdict === "symbol-wrong" || (flags.symbolWrong && flags.muted)) {
    reasons.push(
      "symbol-wrong; ESC[49:33;2u] inserts 1 not !; ESC[59:58;2u] inserts ; not :; ESC[47:63;2u] inserts / not ?",
    );
  }
  if (verdict === "alternate-ignored" || (flags.alternateIgnored && flags.muted)) {
    reasons.push(
      "alternate-ignored; CSI-u parser never consumes the second (shifted) sub-parameter",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Tangent; cite-only #90067 (earlier WezTerm shifted punctuation), #71700 (Kitty allow-list / Alacritty), #77386 (Ctrl non-Latin layouts) — different surfaces from #92021 flag-4 / shifted-field parse; primary stays #92021",
    );
  }
  if (verdict === "muted" || flags.muted) {
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
  if (named === IDLE_WORD && (flags.sounded || !flags.muted)) return "sounded";
  if (named === "hold" && !flags.muted) return "hold";
  if (named === SEEDED_WORD) return "muted";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "sounded";
  if (flags.muted) return "muted";
  if (flags.sounded) return "sounded";
  return "sounded";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "muted" || flags.muted) {
    return {
      case: "muted — flag 4 requested; shifted field never struck",
      sequence: ticket.sequence || SEQ_SHIFT_1,
      parsed: ticket.parsedGlyph || "1",
      expected: ticket.expectedGlyph || "!",
      flag: ticket.flagRequested || FLAG_247,
      mark: "tangent muted; admit the alternate field already muted",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — Shift-only CSI-u uses the alternate field",
      sequence: SEQ_SHIFT_1,
      parsed: "!",
      expected: "!",
      flag: FLAG_247,
      mark: "tangent hold; the string sounds",
      note: "Hold: the string sounds.",
    };
  }
  return {
    case: "sounded — Shift-only CSI-u uses alternate field; ! / ? / : / A insert",
    sequence: SEQ_SHIFT_1,
    parsed: "!",
    expected: "!",
    flag: FLAG_247,
    mark: "tangent sounded; idle word sounded",
    note: "Sounded: the string sounds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const muted = verdict === "muted" || flags.muted;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sounded: verdict === "sounded" || (flags.sounded && !muted),
    muted,
    unshifted: flags.unshifted && muted,
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
  if (name === SEEDED_WORD || name === 92021 || name === "92021") {
    return analyze(seedMuted());
  }
  if (name === "unshifted") return analyze(seedUnshifted());
  if (name === "flag-4") return analyze(seedFlag4());
  if (name === "csi-u") return analyze(seedCsiU());
  if (name === "conpty-blank") return analyze(seedConptyBlank());
  if (name === "event-type-drop") return analyze(seedEventTypeDrop());
  if (name === "symbol-wrong") return analyze(seedSymbolWrong());
  if (name === "alternate-ignored") return analyze(seedAlternateIgnored());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sounded" || name === "open") {
    return analyze(seedSounded());
  }
  if (
    name === 90067 ||
    name === "90067" ||
    name === 71700 ||
    name === "71700" ||
    name === 77386 ||
    name === "77386" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSounded());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "muted" || (result.muted && result.alarm)
          ? `muted tangent #${FEATURED_ISSUE}: Kitty flag 4 (ESC[>5u]) requested; shifted CSI-u sub-parameter never parsed. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Shift-only CSI-u uses the alternate field. Score the strike."
            : `sounded tangent. Idle word ${IDLE_WORD}. Shift-only CSI-u uses alternate field; ! / ? / : / A insert correctly.`,
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
