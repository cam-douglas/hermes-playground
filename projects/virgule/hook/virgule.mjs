#!/usr/bin/env node
/**
 * Virgule — compositor’s type-case / composing-stick classifier.
 * A virgule that only strikes at index zero is not a hold.
 * Score the stick or admit cased.
 *
 *   echo '{"caretIndex":12,"menuOpens":false,"slashLiteral":true,"wordBoundary":true,"lineStartBroken":true,"menuHealthyAtZero":true,"discoveryDead":true,"invocationWorks":true}' | node virgule.mjs
 *   node virgule.mjs ticket.json
 *
 * Idle word is cased (HOLD: / at word boundary opens slash/skills menu;
 * mid-message discovery works; selection inserts at caret; tokens like
 * src/utils stay silent).
 * Seeded state is literal / #91337 (/ mid-message inserts literal slash;
 * menu only at message index 0; line-start after newline also broken;
 * menu healthy at index 0; full-name invocation still works;
 * regression 2.1.246→2.1.247).
 * NEVER idle as literal, jammed, sifted, stocked, aired, drained,
 * hinged, pealed, warded, first-wins, seized, pooled.
 *
 * Primary #91337: Typing / no longer opens the slash-command / skill
 * menu unless / is at index 0 of the message. After any preceding
 * character, / is inserted as a literal slash and no menu appears.
 * Bound to index 0, not to the start of a line: in a multi-line
 * message, / as the first character of the second line does nothing
 * either. Not limited to skills: built-in commands, plugin commands,
 * and file-based skills from ~/.claude/skills/ alike. The menu itself
 * is healthy at index 0 (lists everything correctly) — this is not
 * #48963 / #49148 (entries missing from the picker); only the trigger
 * position. Invocation still works, discovery doesn’t: typing a skill
 * name in full mid-message still gets picked up and run; only the
 * menu is gone. Both surfaces: Claude Code desktop app and terminal
 * CLI. Used to work until ~2026-08-29; last good 2.1.246; first bad
 * 2.1.247. CLI 2.1.257 and desktop embedded 2.1.255 both reproduce.
 * macOS 26.4 arm64; Terminal.app zsh + desktop app. No console error.
 *
 * Hypothesis only (NON-BINDING): the 2.1.247 fix tightening what
 * counts as a slash command (`/--` prompts) may also have tightened
 * where the menu is allowed to trigger (index 0 only). Do not claim
 * a root cause in Claude Code source you have not seen. Verify
 * against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the stick is cased or literal.
 *
 * NOT riddle-sieve / foundry mesh / duplicate-ip firewall abort.
 * NOT grain loft / garner / bin / airing-hatch.
 * NOT millrace / sluice-gate / pool-gauge.
 * NOT peal-board / belfry / carillon.
 * NOT postern-gate / night bailey.
 * NOT plane-table / alidade.
 * NOT rudder pintle / gudgeon / tiller.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Virgule. Do not rename to Slash / Menu / Trigger /
 * Index / Composer / Stick / Case / Sort / Riddle / Garner / Pintle.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "cased",
  "literal",
  "index-zero-only",
  "mid-message-literal",
  "line-start-broken",
  "menu-healthy-at-zero",
  "discovery-dead",
  "invocation-still-works",
  "regression-2-1-247",
  "word-boundary-expected",
  "hold",
]);
export const IDLE_WORD = "cased";
export const SEEDED_WORD = "literal";
export const HOLD_VERDICTS = Object.freeze(["cased", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91337;
export const PRIMARY_ISSUES = Object.freeze([91337]);
export const COUSINS = Object.freeze([
  48963, 49148, 55173, 44488, 40413, 29752, 13073,
]);
export const COUSIN_ISSUE = 48963;
export const NOT_PRODUCTS = Object.freeze([
  "riddle",
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "cockade",
  "lye",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91337";
export const TITLE =
  "[BUG] `/` no longer opens the slash-command menu mid-message — only at index 0 (regressed in 2.1.247, last good 2.1.246)";
export const FILED_AT = "2026-09-01T22:31:58Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:tui",
  "regression",
  "area:skills",
]);
export const REPORTER = "MaksimCher";
export const LAST_GOOD = "2.1.246";
export const FIRST_BAD = "2.1.247";
export const CLI_VERSION = "2.1.257";
export const DESKTOP_EMBEDDED = "2.1.255";
export const DESKTOP_APP = "1.40609.1";
export const PLATFORM = "macos";
export const OS = "macOS 26.4";
export const ARCH = "arm64";
export const SHELL = "Terminal.app zsh";
export const SURFACES = Object.freeze(["desktop", "cli"]);
export const INDEX_ZERO = 0;
export const MID_MESSAGE_CARET = 12;
export const TOKEN_SILENT = Object.freeze(["src/utils", "and/or", "http://"]);
export const CHANGELOG_247 =
  "Fixed prompts beginning with `/--` … being rejected as an unknown slash command instead of being sent to Claude";
export const CHANGELOG_250 =
  "Changed the action menu to list slash commands in a filterable Slash commands dialog instead of inline";
export const INSTALL_246 = "2026-08-26";
export const INSTALL_247 = "2026-08-28";
export const INSTALL_255 = "2026-09-01";
export const ONSET = "~2026-08-29";
export const SKILLS_PATH = "~/.claude/skills/";
export const HUB_LINE =
  "08:50 virgule: a virgule that only strikes at index zero is not a hold. Score the stick or admit cased.";
export const MARK = "08:50 / hermes catalog #109 / #91337";
export const PHRASE =
  "A virgule that only strikes at index zero is not a hold. Score the stick or admit cased.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: the 2.1.247 fix tightening what counts as a slash command (`/--` prompts) may also have tightened where the menu is allowed to trigger (index 0 only). Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is SLASH / SKILLS MENU TRIGGER BOUND TO MESSAGE INDEX 0 ONLY (regression 2.1.246→2.1.247); MID-MESSAGE DISCOVERY DEAD WHILE FULL-NAME INVOCATION STILL WORKS. Typing / no longer opens the slash-command / skill menu unless / is at index 0 of the message. After any preceding character, / is inserted as a literal slash and no menu appears. Bound to index 0, not to the start of a line: in a multi-line message, / as the first character of the second line does nothing either. Menu is healthy at index 0 — this is not #48963 / #49148 (entries missing from the picker); only the trigger position. Invocation still works: typing a skill name in full mid-message still runs. Both surfaces: Claude Code desktop app and terminal CLI. Last good 2.1.246; first bad 2.1.247. CLI 2.1.257 and desktop embedded 2.1.255 both reproduce. Expected: / at a word boundary opens the menu; / inside a token stays silent (src/utils, and/or, http://). NOT Riddle #91327 (devcontainer ipset duplicate + set -e firewall abort / mesh sieve). NOT Garner #91246 (Desktop archive-to-pool no TTL / loft). NOT Pintle #91226 (PreToolUse Bash relative-path cwd-drift deadlock). NOT Carillon #91250 (plugin SessionStart first-wins). NOT Postern #91223 (socket-dir squat). NOT Sluice #91265 (Cowork Toke/File/SeAt kernel pool leak / millrace). NOT Alidade #91055 (silent foreign host). NOT Cockade #91033 (ultracode badge / effort slider mismatch). NOT leftover woodworking / mm-slider. Product name stays Virgule.";
export const FORBIDDEN_IDLE = Object.freeze([
  "literal",
  "jammed",
  "sifted",
  "stocked",
  "aired",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "first-wins",
  "seized",
  "pooled",
]);
export const BANNED_NAMES = Object.freeze([
  "Slash",
  "Menu",
  "Trigger",
  "Index",
  "Composer",
  "Stick",
  "Case",
  "Sort",
  "Riddle",
  "Garner",
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "wire mesh",
  "ore grit",
  "copper rivet",
  "coal strap",
  "grain loft",
  "airing hatch",
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "postern-gate",
  "night bailey",
  "plane-table",
  "rudder pintle",
  "gudgeon",
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

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    caretIndex: null,
    menuOpens: null,
    slashLiteral: null,
    wordBoundary: null,
    lineStartBroken: null,
    menuHealthyAtZero: null,
    discoveryDead: null,
    invocationWorks: null,
    indexZeroOnly: null,
    midMessageLiteral: null,
    tokenSilent: null,
    lastGood: "",
    firstBad: "",
    cliVersion: "",
    desktopVersion: "",
    surfaces: [],
    cousin: "",
    outputText: "",
  };
}

export function seedCased() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "composer",
    caretIndex: INDEX_ZERO,
    menuOpens: true,
    slashLiteral: false,
    wordBoundary: true,
    lineStartBroken: false,
    menuHealthyAtZero: true,
    discoveryDead: false,
    invocationWorks: true,
    indexZeroOnly: false,
    midMessageLiteral: false,
    tokenSilent: true,
    lastGood: LAST_GOOD,
    firstBad: "",
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    cousin: "",
    outputText:
      "cased; / at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; tokens like src/utils stay silent; idle word cased",
  };
}

export function seedLiteral() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    tokenSilent: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    cousin: "",
    outputText:
      "literal; #91337; / mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247; CLI 2.1.257 and desktop embedded 2.1.255 both reproduce",
  };
}

export function seedIndexZeroOnly() {
  return {
    seed: "index-zero-only",
    source: "composer",
    caretIndex: INDEX_ZERO,
    menuOpens: true,
    slashLiteral: false,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "index-zero-only; slash/skills menu trigger bound to message index 0 only; after any preceding character the virgule is silent",
  };
}

export function seedMidMessageLiteral() {
  return {
    seed: "mid-message-literal",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "mid-message-literal; type review this then / → literal / inserted, no menu; word boundary after whitespace does not open the rail",
  };
}

export function seedLineStartBroken() {
  return {
    seed: "line-start-broken",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "line-start-broken; review this + newline + / on line 2 → literal /, no menu; bound to index 0, not to the start of a line",
  };
}

export function seedMenuHealthyAtZero() {
  return {
    seed: "menu-healthy-at-zero",
    source: "composer",
    caretIndex: INDEX_ZERO,
    menuOpens: true,
    slashLiteral: false,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "menu-healthy-at-zero; at index 0 the menu opens and lists everything correctly; this is not #48963 / #49148 (entries missing from the picker); only the trigger position",
  };
}

export function seedDiscoveryDead() {
  return {
    seed: "discovery-dead",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "discovery-dead; mid-message slash/skills menu is gone; built-in commands, plugin commands, and file-based skills from ~/.claude/skills/ alike are unreachable mid-message",
  };
}

export function seedInvocationStillWorks() {
  return {
    seed: "invocation-still-works",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "invocation-still-works; typing a skill name in full mid-message still gets picked up and run; only the menu is gone",
  };
}

export function seedRegression247() {
  return {
    seed: "regression-2-1-247",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "regression-2-1-247; last working version 2.1.246; first bad 2.1.247; desktop-app logs installed 2.1.246 on 2026-08-26; 2.1.247 on 2026-08-28; 2.1.255 on 2026-09-01; used to work until ~2026-08-29",
  };
}

export function seedWordBoundaryExpected() {
  return {
    seed: "word-boundary-expected",
    source: "composer",
    caretIndex: MID_MESSAGE_CARET,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    tokenSilent: true,
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "word-boundary-expected; / at a word boundary (start of message, or immediately after whitespace or newline) should open the menu, filter as you type, insert selection at caret leaving surrounding text intact; / inside a token stays silent (src/utils, and/or, http://)",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "composer",
    caretIndex: INDEX_ZERO,
    menuOpens: true,
    slashLiteral: false,
    wordBoundary: true,
    lineStartBroken: false,
    menuHealthyAtZero: true,
    discoveryDead: false,
    invocationWorks: true,
    indexZeroOnly: false,
    midMessageLiteral: false,
    tokenSilent: true,
    lastGood: LAST_GOOD,
    firstBad: "",
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "hold; / at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; the stick is cased",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "composer",
    cousin: "48963",
    lastGood: LAST_GOOD,
    firstBad: FIRST_BAD,
    cliVersion: CLI_VERSION,
    desktopVersion: DESKTOP_EMBEDDED,
    surfaces: [...SURFACES],
    outputText:
      "cousin-not-primary; #48963 picker entries missing — different failure mode; menu is healthy at index 0 here; not the #91337 trigger-position regression",
  };
}

export function emptyTicket() {
  return seedCased();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.virgule && typeof src.virgule === "object" && src.virgule) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.stick && typeof src.stick === "object" && src.stick) ||
    src;
  const surfaces = Array.isArray(nested.surfaces)
    ? nested.surfaces
    : Array.isArray(src.surfaces)
      ? src.surfaces
      : [];
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
    caretIndex: firstNum(nested.caretIndex, nested.caret_index, src.caretIndex),
    menuOpens: firstBool(nested.menuOpens, nested.menu_opens, src.menuOpens),
    slashLiteral: firstBool(
      nested.slashLiteral,
      nested.slash_literal,
      src.slashLiteral,
    ),
    wordBoundary: firstBool(
      nested.wordBoundary,
      nested.word_boundary,
      src.wordBoundary,
    ),
    lineStartBroken: firstBool(
      nested.lineStartBroken,
      nested.line_start_broken,
      src.lineStartBroken,
    ),
    menuHealthyAtZero: firstBool(
      nested.menuHealthyAtZero,
      nested.menu_healthy_at_zero,
      src.menuHealthyAtZero,
    ),
    discoveryDead: firstBool(
      nested.discoveryDead,
      nested.discovery_dead,
      src.discoveryDead,
    ),
    invocationWorks: firstBool(
      nested.invocationWorks,
      nested.invocation_works,
      src.invocationWorks,
    ),
    indexZeroOnly: firstBool(
      nested.indexZeroOnly,
      nested.index_zero_only,
      src.indexZeroOnly,
    ),
    midMessageLiteral: firstBool(
      nested.midMessageLiteral,
      nested.mid_message_literal,
      src.midMessageLiteral,
    ),
    tokenSilent: firstBool(
      nested.tokenSilent,
      nested.token_silent,
      src.tokenSilent,
    ),
    lastGood: firstText(nested.lastGood, nested.last_good, src.lastGood),
    firstBad: firstText(nested.firstBad, nested.first_bad, src.firstBad),
    cliVersion: firstText(
      nested.cliVersion,
      nested.cli_version,
      src.cliVersion,
    ),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      nested.version,
      src.desktopVersion,
    ),
    surfaces,
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
    row.caretIndex == null &&
    row.menuOpens == null &&
    row.slashLiteral == null &&
    row.wordBoundary == null &&
    row.lineStartBroken == null &&
    row.menuHealthyAtZero == null &&
    row.discoveryDead == null &&
    row.invocationWorks == null &&
    row.indexZeroOnly == null &&
    row.midMessageLiteral == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedCased,
  [SEEDED_WORD]: seedLiteral,
  "index-zero-only": seedIndexZeroOnly,
  "mid-message-literal": seedMidMessageLiteral,
  "line-start-broken": seedLineStartBroken,
  "menu-healthy-at-zero": seedMenuHealthyAtZero,
  "discovery-dead": seedDiscoveryDead,
  "invocation-still-works": seedInvocationStillWorks,
  "regression-2-1-247": seedRegression247,
  "word-boundary-expected": seedWordBoundaryExpected,
  hold: seedHold,
  cousin: seedCousin,
  48963: seedCousin,
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
    return { ...seedLiteral(), ...cloned, ...raw };
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

export function isCased(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.menuOpens === true &&
    row.slashLiteral === false &&
    row.discoveryDead === false
  ) {
    return true;
  }
  return false;
}

export function isLiteral(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.slashLiteral === true &&
    row.menuOpens === false &&
    (row.caretIndex > 0 ||
      row.lineStartBroken === true ||
      row.indexZeroOnly === true ||
      row.midMessageLiteral === true ||
      row.discoveryDead === true)
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
      /cousin-not-primary|#48963|#49148|#55173|#44488|#40413|#29752|#13073/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const literalNow = !cousinOnly && isLiteral(row);
  const casedNow = !literalNow && isCased(row);
  const indexZeroOnly =
    row.indexZeroOnly === true ||
    named === "index-zero-only" ||
    /index-zero-only|index 0 only|bound to (message )?index 0/i.test(text);
  const midMessage =
    row.midMessageLiteral === true ||
    row.slashLiteral === true ||
    named === "mid-message-literal" ||
    /mid-message-literal|literal slash|literal \//i.test(text);
  const lineStart =
    row.lineStartBroken === true ||
    named === "line-start-broken" ||
    /line-start-broken|second line|start of a line/i.test(text);
  const menuHealthy =
    row.menuHealthyAtZero === true ||
    named === "menu-healthy-at-zero" ||
    /menu-healthy-at-zero|lists everything correctly|menu itself is healthy/i.test(
      text,
    );
  const discovery =
    row.discoveryDead === true ||
    named === "discovery-dead" ||
    /discovery-dead|menu is gone|unreachable mid-message/i.test(text);
  const invocation =
    row.invocationWorks === true ||
    named === "invocation-still-works" ||
    /invocation-still-works|skill name in full|still gets picked up/i.test(
      text,
    );
  const regression =
    row.firstBad === FIRST_BAD ||
    row.lastGood === LAST_GOOD ||
    named === "regression-2-1-247" ||
    /regression-2-1-247|2\.1\.247|2\.1\.246/i.test(text);
  const wordBoundary =
    row.wordBoundary === true ||
    named === "word-boundary-expected" ||
    /word-boundary-expected|word boundary/i.test(text);
  const literal =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (literalNow || named === SEEDED_WORD || /literal|#91337/i.test(text));
  const cased =
    named === IDLE_WORD ||
    named === "hold" ||
    (casedNow && !literal);
  return {
    named,
    cousinOnly,
    literalNow,
    casedNow,
    indexZeroOnly,
    midMessage,
    lineStart,
    menuHealthy,
    discovery,
    invocation,
    regression,
    wordBoundary,
    literal,
    cased,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.cased && !flags.literal) chips.push("cased");
  if (flags.literal) chips.push("literal");
  if (flags.indexZeroOnly && flags.literal) chips.push("index-zero-only");
  if (flags.midMessage && flags.literal) chips.push("mid-message-literal");
  if (flags.lineStart && flags.literal) chips.push("line-start-broken");
  if (flags.menuHealthy && flags.literal) chips.push("menu-healthy-at-zero");
  if (flags.discovery && flags.literal) chips.push("discovery-dead");
  if (flags.invocation && flags.literal) chips.push("invocation-still-works");
  if (flags.regression && flags.literal) chips.push("regression-2-1-247");
  if (flags.wordBoundary && flags.literal) chips.push("word-boundary-expected");
  if ((flags.cased || flags.named === "hold") && !flags.literal) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "cased") {
    reasons.push(
      "cased; / at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; tokens like src/utils stay silent",
    );
    reasons.push("hold: the stick is cased; score treats word-boundary virgule");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; / at word boundary opens slash/skills menu; mid-message discovery works; the stick is cased",
    );
  }
  if (verdict === "literal" || flags.literal) {
    reasons.push(
      "literal; #91337; / mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247",
    );
  }
  if (flags.indexZeroOnly || verdict === "index-zero-only") {
    reasons.push(
      "index-zero-only; slash/skills menu trigger bound to message index 0 only",
    );
  }
  if (flags.midMessage || verdict === "mid-message-literal") {
    reasons.push(
      "mid-message-literal; after any preceding character, / is inserted as a literal slash and no menu appears",
    );
  }
  if (flags.lineStart || verdict === "line-start-broken") {
    reasons.push(
      "line-start-broken; bound to index 0, not to the start of a line; / as the first character of the second line does nothing either",
    );
  }
  if (flags.menuHealthy || verdict === "menu-healthy-at-zero") {
    reasons.push(
      "menu-healthy-at-zero; at index 0 the menu opens and lists everything correctly; this is not #48963 / #49148",
    );
  }
  if (flags.discovery || verdict === "discovery-dead") {
    reasons.push(
      `discovery-dead; mid-message menu gone; built-in commands, plugin commands, and file-based skills from ${SKILLS_PATH} alike are unreachable mid-message`,
    );
  }
  if (flags.invocation || verdict === "invocation-still-works") {
    reasons.push(
      "invocation-still-works; typing a skill name in full mid-message still gets picked up and run; only the menu is gone",
    );
  }
  if (flags.regression || verdict === "regression-2-1-247") {
    reasons.push(
      `regression-2-1-247; last working version ${LAST_GOOD}; first bad ${FIRST_BAD}; desktop-app logs installed ${LAST_GOOD} on ${INSTALL_246}; ${FIRST_BAD} on ${INSTALL_247}; ${DESKTOP_EMBEDDED} on ${INSTALL_255}; used to work until ${ONSET}`,
    );
  }
  if (flags.wordBoundary || verdict === "word-boundary-expected") {
    reasons.push(
      "word-boundary-expected; / at a word boundary should open the menu, filter as you type, insert selection at caret; / inside a token stays silent (src/utils, and/or, http://)",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Virgule; cite-only slash/skills UX surface, not the index-0 trigger-position regression",
    );
  }
  if (verdict === "literal" || flags.literal) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "cased" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.cased || !flags.literal)) return "cased";
  if (named === "hold" && !flags.literal) return "hold";
  if (named === SEEDED_WORD) return "literal";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "cased";
  if (flags.literal) return "literal";
  if (flags.cased) return "cased";
  return "cased";
}

function stickOf(flags, ticket, verdict) {
  if (verdict === "literal" || flags.literal) {
    return {
      case: "literal — virgule only strikes at index zero",
      stick: "brass composing stick shut mid-message; lead sorts idle",
      rail: "slash/skills rail closed after any preceding character",
      caret: `caret index ${ticket.caretIndex ?? MID_MESSAGE_CARET} · literal /`,
      mark: "vermilion virgule jammed at the left of the stick",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "cased — word-boundary virgule opens the rail",
      stick: "brass composing stick open; sorts seated",
      rail: "slash/skills rail open at word boundary",
      caret: "caret at a word boundary · selection inserts in place",
      mark: "vermilion virgule seated in the stick",
      note: "Hold: the stick is cased.",
    };
  }
  return {
    case: "cased — / at word boundary opens the menu",
    stick: "brass composing stick open; mid-message discovery works",
    rail: "slash/skills rail filters as you type",
    caret: "caret at word boundary · tokens like src/utils stay silent",
    mark: "vermilion virgule seated; idle word cased",
    note: "Cased: the stick holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const literal = verdict === "literal" || flags.literal;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    cased: verdict === "cased" || (flags.cased && !literal),
    literal,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: stickOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91337 || name === "91337") {
    return analyze(seedLiteral());
  }
  if (name === "index-zero-only") return analyze(seedIndexZeroOnly());
  if (name === "mid-message-literal") return analyze(seedMidMessageLiteral());
  if (name === "line-start-broken") return analyze(seedLineStartBroken());
  if (name === "menu-healthy-at-zero") return analyze(seedMenuHealthyAtZero());
  if (name === "discovery-dead") return analyze(seedDiscoveryDead());
  if (name === "invocation-still-works") {
    return analyze(seedInvocationStillWorks());
  }
  if (name === "regression-2-1-247") return analyze(seedRegression247());
  if (name === "word-boundary-expected") {
    return analyze(seedWordBoundaryExpected());
  }
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "cased" || name === "seated") {
    return analyze(seedCased());
  }
  if (name === 48963 || name === "48963" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedCased());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "literal" || (result.literal && result.alarm)
          ? `literal virgule #${FEATURED_ISSUE}: slash/skills menu trigger bound to message index 0 only; mid-message / inserts a literal slash; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression ${LAST_GOOD}→${FIRST_BAD}. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. / at word boundary opens the slash/skills menu. Score the stick."
            : `cased virgule. Idle word ${IDLE_WORD}. / at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret.`,
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
