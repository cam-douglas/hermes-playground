#!/usr/bin/env node
/**
 * Cupel — bone-ash assay-office classifier.
 * A cupel that scorches draft-07 MCP alloy after the era probe
 * marks the sibling exchange legacy is not a clean assay — it is
 * a charge already scorched. Score the cupel or admit the charge
 * already scorched.
 *
 *   echo '{"dialect":"draft-07","toolsCall":"refused"}' | node cupel.mjs
 *   node cupel.mjs charge.json
 *
 * Idle word is pure (HOLD: 2020-12 schemas accepted; the cupel
 * stays bone-ash; idle word pure).
 * Seeded state is scorched / #92122 (draft-07 rejected / era-legacy
 * shared-pool path).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score assay-shaped fixtures for whether the cupel held
 * or already scorched the charge.
 *
 * Primary #92122: Filesystem extension broken in Cowork/Code
 * sessions on 1.46388.2: era probe marks server legacy, then
 * draft-07 tool schemas rejected. Reporter aflewis. Filed
 * 2026-09-04T15:30:23Z. OPEN. Labels: bug, has repro,
 * platform:macos, area:mcp, area:cowork, area:desktop.
 * macOS Apple Silicon. Claude Desktop 1.46388.2 (worked on
 * 1.40609.1). Electron 42.10.0. Bundled Node 24.18.1.
 * @modelcontextprotocol/server-filesystem v2026.7.4.
 *
 * Hypothesis only (NON-BINDING): Shared-pool transport probes
 * in place and marks era legacy when sibling exchange incomplete;
 * after reconnect, a 2020-12-only validator rejects draft-07
 * outputSchema that most MCP servers still ship — so Cowork/Code
 * refuse tools while the desktop app path still connects.
 * Discard if issue evidence disagrees. Do not claim Claude Code
 * source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "pure",
  "scorched",
  "legacy",
  "draft07",
  "shared-pool",
  "refused",
  "fourteen",
  "hold",
]);
export const IDLE_WORD = "pure";
export const SEEDED_WORD = "scorched";
export const HOLD_VERDICTS = Object.freeze(["pure", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92122;
export const PRIMARY_ISSUES = Object.freeze([92122]);
export const COUSINS = Object.freeze([88988, 88882, 90549, 90245, 87633, 86142]);
export const COUSIN_ISSUE = 88988;
export const DIFFERENT_CLASS = Object.freeze([92091, 80174]);
export const BACKUPS = Object.freeze([92120, 92118, 92078]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92122";
export const TITLE =
  "Filesystem extension broken in Cowork/Code sessions on 1.46388.2: era probe marks server legacy, then draft-07 tool schemas rejected";
export const FILED_AT = "2026-09-04T15:30:23Z";
export const UPDATED_AT = "2026-09-04T15:31:50Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:mcp",
  "area:cowork",
  "area:desktop",
]);
export const REPORTER = "aflewis";
export const PLATFORM = "macOS Apple Silicon";
export const APP_VERSION = "1.46388.2";
export const WORKED_ON = "1.40609.1";
export const ELECTRON = "42.10.0";
export const BUNDLED_NODE = "24.18.1";
export const SERVER_PACKAGE = "@modelcontextprotocol/server-filesystem";
export const SERVER_VERSION = "2026.7.4";
export const DESKTOP = "Claude Desktop";
export const AREA = "area:mcp";
export const EVIDENCE = "era-legacy-then-draft07-outputschema-refused";
export const FIRST_FAILURE = "2026-09-04 08:48";
export const TOOL_COUNT = 14;
export const REFUSED_TOOLS = Object.freeze([
  "list_directory",
  "get_file_info",
  "list_allowed_directories",
]);
export const DRAFT07_URI = "http://json-schema.org/draft-07/schema#";
export const DIALECT_2020_12 = "2020-12";
export const ERA_PROBE_LINE =
  "Era probe verdict: legacy (sibling did not complete the exchange)";
export const VERSION_NEGOTIATION_LINE =
  "Version negotiation failed: the connection closed during the server/discover probe (this transport probed in place - the disposable sibling probe requires the SDK's base StdioClientTransport)";
export const CONTEXT_SHARED_POOL = "shared-pool";
export const OUTPUT_SCHEMA_LINE =
  'Tool \'list_directory\' has an invalid outputSchema: JSON Schema declares an unsupported dialect ("$schema": "http://json-schema.org/draft-07/schema#"). The default validator supports JSON Schema 2020-12 only.';
export const VALIDATOR_ONLY = "JSON Schema 2020-12 only";
export const ALLOWED_DIRS = 4;
export const HUB_LINE =
  "01:50 cupel: a cupel that scorches draft-07 MCP alloy after the era probe marks the sibling exchange legacy is not a clean assay — it is a charge already scorched. Score the cupel or admit the charge already scorched.";
export const MARK = "01:50 / hermes catalog #139 / #92122";
export const PHRASE =
  "Score the cupel or admit the charge already scorched.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: Shared-pool transport probes in place and marks era legacy when sibling exchange incomplete; after reconnect, a 2020-12-only validator rejects draft-07 outputSchema that most MCP servers still ship — so Cowork/Code refuse tools while the desktop app path still connects. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is FILESYSTEM EXTENSION ERA-PROBE LEGACY THEN DRAFT-07 OUTPUTSCHEMA REFUSAL on Claude Desktop 1.46388.2 Cowork/Code shared-pool. macOS Apple Silicon; Electron 42.10.0; bundled Node 24.18.1; @modelcontextprotocol/server-filesystem v2026.7.4. Worked on 1.40609.1. Failure 1: Era probe verdict legacy (sibling did not complete the exchange); server connects for the desktop app itself, then Version negotiation failed during server/discover probe (transport probed in place — disposable sibling probe requires SDK base StdioClientTransport); context shared-pool. Failure 2 after clean reinstall: 14 tools announced, every tools/call refused before disk — invalid outputSchema draft-07; default validator supports 2020-12 only. Same on list_directory, get_file_info, list_allowed_directories. Support confirmed no user config workaround. draft-07 is what most published MCP servers ship. Expected: validator accepts draft-07 OR bundled packages ship 2020-12. Reporter aflewis. Filed 2026-09-04. OPEN, bug, has repro, platform:macos, area:mcp, area:cowork, area:desktop. Not Oubliette cold-parent Dispatch queue. Not Ephemera 5m wick rewrite. Not Commutator sibling-slot stray. Not Heddle. Not Hectograph OTEL scrub.";
export const HOLD_RESULT =
  "pure cupel; 2020-12 schemas accepted; the charge stayed bullion; idle word pure";
export const FORBIDDEN_IDLE = Object.freeze([
  "cold",
  "voided",
  "banked",
  "rewritten",
  "keyed",
  "strayed",
  "scrubbed",
  "pulled",
  "enacted",
  "withheld",
  "masked",
  "bled",
  "crossed",
  "homed",
  "slipped",
  "fouled",
  "mangled",
  "verbatim",
  "unbolted",
  "snagged",
  "sounded",
  "muted",
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
  "armed",
  "unheard",
  "scorched",
]);
export const BANNED_NAMES = Object.freeze([
  "Oubliette",
  "Ephemera",
  "Commutator",
  "Heddle",
  "Hectograph",
  "Placet",
  "Frisket",
  "Tangent",
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
]);
export const FORBIDDEN_UI = Object.freeze([
  "Eczar",
  "Schibsted Grotesk",
  "Martian Mono",
  "Newsreader",
  "Figtree",
  "Source Code Pro",
  "Source Serif 4",
  "Libre Franklin",
  "JetBrains Mono",
  "Literata",
  "Manrope",
  "Cormorant",
  "Fraunces",
  "Fira Code",
  "DM Sans",
]);
export const NOT_PRODUCTS = Object.freeze([
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
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

function assayOf(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.assay && typeof src.assay === "object" ? src.assay : {};
  return {
    dialect: firstText(nested.dialect, src.dialect, src.schema, src.$schema),
    eraProbe: firstText(nested.eraProbe, src.eraProbe, src.era),
    siblingComplete: firstBool(nested.siblingComplete, src.siblingComplete),
    context: firstText(nested.context, src.context, src.pool),
    toolsAnnounced: firstNum(nested.toolsAnnounced, src.toolsAnnounced, src.toolCount),
    toolsCall: firstText(nested.toolsCall, src.toolsCall, src.call),
    outputSchemaValid: firstBool(nested.outputSchemaValid, src.outputSchemaValid),
    validator: firstText(nested.validator, src.validator),
    connectDesk: firstBool(nested.connectDesk, src.connectDesk),
    connectSharedPool: firstBool(nested.connectSharedPool, src.connectSharedPool),
    beforeDisk: firstBool(nested.beforeDisk, src.beforeDisk),
    toolName: firstText(nested.toolName, src.toolName, src.tool),
  };
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
    persistHold: null,
    pure: null,
    scorched: null,
    dialect: "",
    eraProbe: "",
    siblingComplete: null,
    context: "",
    toolsAnnounced: null,
    toolsCall: "",
    outputSchemaValid: null,
    validator: "",
    connectDesk: null,
    connectSharedPool: null,
    beforeDisk: null,
    toolName: "",
    eraProbeLine: "",
    versionNegotiationLine: "",
    outputSchemaLine: "",
    platform: "",
    appVersion: "",
    workedOn: "",
    electron: "",
    bundledNode: "",
    serverPackage: "",
    serverVersion: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedPure() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "assay-office",
    persistHold: true,
    pure: true,
    scorched: false,
    dialect: DIALECT_2020_12,
    eraProbe: "current",
    siblingComplete: true,
    context: "desk-app",
    toolsAnnounced: TOOL_COUNT,
    toolsCall: "accepted",
    outputSchemaValid: true,
    validator: "accepts-declared-dialect",
    connectDesk: true,
    connectSharedPool: true,
    beforeDisk: false,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "pure; 2020-12 schemas accepted; the charge stayed bullion; idle word pure",
  };
}

export function seedScorched() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "assay-office",
    persistHold: false,
    pure: false,
    scorched: true,
    dialect: "draft-07",
    eraProbe: "legacy",
    siblingComplete: false,
    context: CONTEXT_SHARED_POOL,
    toolsAnnounced: TOOL_COUNT,
    toolsCall: "refused",
    outputSchemaValid: false,
    validator: VALIDATOR_ONLY,
    connectDesk: true,
    connectSharedPool: false,
    beforeDisk: true,
    toolName: "list_directory",
    eraProbeLine: ERA_PROBE_LINE,
    versionNegotiationLine: VERSION_NEGOTIATION_LINE,
    outputSchemaLine: OUTPUT_SCHEMA_LINE,
    platform: PLATFORM,
    appVersion: APP_VERSION,
    workedOn: WORKED_ON,
    electron: ELECTRON,
    bundledNode: BUNDLED_NODE,
    serverPackage: SERVER_PACKAGE,
    serverVersion: SERVER_VERSION,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "scorched; #92122; era probe legacy; sibling did not complete the exchange; shared-pool; 14 tools announced; draft-07 outputSchema refused before disk; aflewis; 1.46388.2; macOS Apple Silicon; area:mcp",
  };
}

export function seedLegacy() {
  return {
    ...blankTicket(),
    seed: "legacy",
    source: "assay-office",
    persistHold: false,
    scorched: true,
    eraProbe: "legacy",
    siblingComplete: false,
    context: CONTEXT_SHARED_POOL,
    connectDesk: true,
    connectSharedPool: false,
    eraProbeLine: ERA_PROBE_LINE,
    versionNegotiationLine: VERSION_NEGOTIATION_LINE,
    outputText:
      "legacy; Era probe verdict: legacy (sibling did not complete the exchange); Version negotiation failed during server/discover probe; context shared-pool",
  };
}

export function seedDraft07() {
  return {
    ...blankTicket(),
    seed: "draft07",
    source: "assay-office",
    persistHold: false,
    scorched: true,
    dialect: "draft-07",
    toolsCall: "refused",
    outputSchemaValid: false,
    validator: VALIDATOR_ONLY,
    beforeDisk: true,
    outputSchemaLine: OUTPUT_SCHEMA_LINE,
    outputText:
      'draft07; invalid outputSchema — JSON Schema declares unsupported dialect "$schema": "http://json-schema.org/draft-07/schema#". Default validator supports JSON Schema 2020-12 only',
  };
}

export function seedSharedPool() {
  return {
    ...blankTicket(),
    seed: "shared-pool",
    source: "assay-office",
    persistHold: false,
    scorched: true,
    eraProbe: "legacy",
    context: CONTEXT_SHARED_POOL,
    connectDesk: true,
    connectSharedPool: false,
    outputText:
      "shared-pool; server connects for the desktop app itself, then fails only for Cowork/Code shared-pool",
  };
}

export function seedRefused() {
  return {
    ...blankTicket(),
    seed: "refused",
    source: "assay-office",
    persistHold: false,
    scorched: true,
    dialect: "draft-07",
    toolsCall: "refused",
    beforeDisk: true,
    toolName: "list_directory",
    outputText:
      "refused; every tools/call refused before disk; same on list_directory, get_file_info, list_allowed_directories",
  };
}

export function seedFourteen() {
  return {
    ...blankTicket(),
    seed: "fourteen",
    source: "assay-office",
    persistHold: false,
    scorched: true,
    toolsAnnounced: TOOL_COUNT,
    toolsCall: "refused",
    dialect: "draft-07",
    outputSchemaValid: false,
    outputText:
      "fourteen; connection succeeds, 14 tools announced, but every tools/call refused before disk",
  };
}

export function seedHold() {
  return {
    ...seedPure(),
    seed: "hold",
    outputText:
      "hold; 2020-12 schemas accepted; the charge stayed bullion; idle word pure",
  };
}

export function seedCousin() {
  return {
    ...seedPure(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #88988 #88882 #90549 #90245 #87633 #86142 (closed) — cite only, not the #92122 cupel assay; different-class cite #92091 stale allowed-directory list, #80174 agent-mode drops Filesystem",
  };
}

export function emptyTicket() {
  return seedPure();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const assay = assayOf({ ...src, ...nested });
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    pure: firstBool(nested.pure, src.pure),
    scorched: firstBool(nested.scorched, src.scorched),
    dialect: assay.dialect,
    eraProbe: assay.eraProbe,
    siblingComplete: assay.siblingComplete,
    context: assay.context,
    toolsAnnounced: assay.toolsAnnounced,
    toolsCall: assay.toolsCall,
    outputSchemaValid: assay.outputSchemaValid,
    validator: assay.validator,
    connectDesk: assay.connectDesk,
    connectSharedPool: assay.connectSharedPool,
    beforeDisk: assay.beforeDisk,
    toolName: assay.toolName,
    eraProbeLine: firstText(nested.eraProbeLine, src.eraProbeLine),
    versionNegotiationLine: firstText(
      nested.versionNegotiationLine,
      src.versionNegotiationLine,
    ),
    outputSchemaLine: firstText(nested.outputSchemaLine, src.outputSchemaLine),
    platform: firstText(nested.platform, src.platform),
    appVersion: firstText(nested.appVersion, src.appVersion),
    workedOn: firstText(nested.workedOn, src.workedOn),
    electron: firstText(nested.electron, src.electron),
    bundledNode: firstText(nested.bundledNode, src.bundledNode),
    serverPackage: firstText(nested.serverPackage, src.serverPackage),
    serverVersion: firstText(nested.serverVersion, src.serverVersion),
    reporter: firstText(nested.reporter, src.reporter),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
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
  const assay = assayOf(row);
  return (
    row.persistHold == null &&
    row.pure == null &&
    row.scorched == null &&
    !assay.dialect &&
    !assay.eraProbe &&
    assay.siblingComplete == null &&
    !assay.context &&
    assay.toolsAnnounced == null &&
    !assay.toolsCall &&
    assay.outputSchemaValid == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedPure,
  [SEEDED_WORD]: seedScorched,
  legacy: seedLegacy,
  draft07: seedDraft07,
  "draft-07": seedDraft07,
  "shared-pool": seedSharedPool,
  sharedPool: seedSharedPool,
  refused: seedRefused,
  fourteen: seedFourteen,
  hold: seedHold,
  cousin: seedCousin,
  88988: seedCousin,
  88882: seedCousin,
  90549: seedCousin,
  90245: seedCousin,
  87633: seedCousin,
  86142: seedCousin,
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
    return { ...seedScorched(), ...cloned, ...raw };
  }
  if (
    (COUSINS.includes(issue) || DIFFERENT_CLASS.includes(issue)) &&
    coreMissing
  ) {
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
    ticket.appVersion,
    ticket.dialect,
    ticket.eraProbe,
    ticket.context,
    ticket.toolsCall,
    ticket.validator,
    ticket.eraProbeLine,
    ticket.versionNegotiationLine,
    ticket.outputSchemaLine,
    ticket.toolName,
    ticket.area,
    ticket.evidence,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const aliases = {
    "draft-07": "draft07",
    "draft-7": "draft07",
    draft_07: "draft07",
    sharedPool: "shared-pool",
    shared_pool: "shared-pool",
    "fourteen-tools": "fourteen",
    fourteenTools: "fourteen",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function dialectIsDraft07(value) {
  const raw = String(value || "").toLowerCase();
  return (
    raw.includes("draft-07") ||
    raw.includes("draft07") ||
    raw.includes("draft-7") ||
    raw === DRAFT07_URI.toLowerCase()
  );
}

function dialectIs202012(value) {
  const raw = String(value || "").toLowerCase();
  return raw.includes("2020-12") || raw.includes("202012");
}

export function isCleanAssay(ticket) {
  const row = cloneTicket(ticket);
  if (dialectIs202012(row.dialect) && row.toolsCall === "accepted" && row.outputSchemaValid !== false) {
    return true;
  }
  if (row.pure === true && row.scorched !== true && row.toolsCall === "accepted") {
    return true;
  }
  return false;
}

export function scorchedPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.scorched === true) return true;
  if (dialectIsDraft07(row.dialect) && (row.outputSchemaValid === false || row.toolsCall === "refused")) {
    return true;
  }
  if (row.eraProbe === "legacy" && row.context === CONTEXT_SHARED_POOL) {
    return true;
  }
  if (row.toolsCall === "refused" && row.beforeDisk === true) {
    return true;
  }
  return false;
}

export function purePattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.pure === true && row.scorched !== true) return true;
  if (isCleanAssay(row) && row.scorched !== true) return true;
  return false;
}

export function isPure(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.scorched !== true && purePattern(row)) {
    return true;
  }
  if (purePattern(row) && row.scorched !== true && !scorchedPattern(row)) {
    return true;
  }
  return false;
}

export function isScorched(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (DIFFERENT_CLASS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (scorchedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      DIFFERENT_CLASS.includes(row.issue) ||
      /cousin-not-primary|#88988|#88882|#90549|#90245|#87633|#86142|#92091|#80174/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const scorchedNow = !cousinOnly && isScorched(row);
  const pureNow = !scorchedNow && isPure(row);
  const legacy =
    named === "legacy" ||
    row.eraProbe === "legacy" ||
    /Era probe verdict: legacy|sibling did not complete the exchange/i.test(text);
  const draft07 =
    named === "draft07" ||
    dialectIsDraft07(row.dialect) ||
    /unsupported dialect|draft-07\/schema/i.test(text);
  const sharedPool =
    named === "shared-pool" ||
    row.context === CONTEXT_SHARED_POOL ||
    /shared-pool|fails only for Cowork/i.test(text);
  const refused =
    named === "refused" ||
    row.toolsCall === "refused" ||
    row.beforeDisk === true ||
    /refused before disk|invalid outputSchema/i.test(text);
  const fourteen =
    named === "fourteen" ||
    row.toolsAnnounced === TOOL_COUNT ||
    /14 tools announced/i.test(text);
  const scorched =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (scorchedNow || named === SEEDED_WORD || /scorched|#92122/i.test(text));
  const pure = HOLD_VERDICTS.includes(named) || (pureNow && !scorched);
  return {
    named,
    cousinOnly,
    scorchedNow,
    pureNow,
    legacy,
    draft07,
    sharedPool,
    refused,
    fourteen,
    scorched,
    pure,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.pure && !flags.scorched) chips.push("pure");
  if (flags.scorched) chips.push("scorched");
  if (flags.legacy && flags.scorched) chips.push("legacy");
  if (flags.draft07 && flags.scorched) chips.push("draft07");
  if (flags.sharedPool && flags.scorched) chips.push("shared-pool");
  if (flags.refused && flags.scorched) chips.push("refused");
  if (flags.fourteen && flags.scorched) chips.push("fourteen");
  if ((flags.pure || flags.named === "hold") && !flags.scorched) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "pure") {
    reasons.push(
      "pure; 2020-12 schemas accepted; the charge stayed bullion",
    );
    reasons.push("hold: the cupel stayed bone-ash; idle word pure");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; 2020-12 schemas accepted; the charge stayed bullion",
    );
  }
  if (verdict === "scorched" || flags.scorched) {
    reasons.push(
      "scorched; #92122; draft-07 rejected / era-legacy shared-pool path",
    );
  }
  if (verdict === "legacy" || (flags.legacy && flags.scorched)) {
    reasons.push(
      "legacy; Era probe verdict: legacy (sibling did not complete the exchange); transport probed in place",
    );
  }
  if (verdict === "draft07" || (flags.draft07 && flags.scorched)) {
    reasons.push(
      'draft07; unsupported dialect "$schema": "http://json-schema.org/draft-07/schema#"; validator is 2020-12 only',
    );
  }
  if (verdict === "shared-pool" || (flags.sharedPool && flags.scorched)) {
    reasons.push(
      "shared-pool; desktop app connects; Cowork/Code shared-pool fails the discover probe",
    );
  }
  if (verdict === "refused" || (flags.refused && flags.scorched)) {
    reasons.push(
      "refused; tools/call refused before disk on list_directory, get_file_info, list_allowed_directories",
    );
  }
  if (verdict === "fourteen" || (flags.fourteen && flags.scorched)) {
    reasons.push(
      "fourteen; 14 tools announced after reinstall, then every tools/call refused",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Cupel; cite-only #88988 #88882 #90549 #90245 #87633 #86142 (closed) — different surfaces from #92122 cupel assay; different-class cite #92091 #80174; primary stays #92122",
    );
  }
  if (verdict === "scorched" || flags.scorched) {
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
  if (named === IDLE_WORD && (flags.pure || !flags.scorched)) return "pure";
  if (named === "hold" && !flags.scorched) return "hold";
  if (named === SEEDED_WORD) return "scorched";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "pure";
  if (flags.scorched) return "scorched";
  if (flags.pure) return "pure";
  return "pure";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "scorched" || flags.scorched) {
    return {
      case: "scorched — draft-07 MCP alloy scorched after era probe marked sibling exchange legacy",
      dialect: ticket.dialect || "draft-07",
      eraProbe: ticket.eraProbe || "legacy",
      context: ticket.context || CONTEXT_SHARED_POOL,
      toolsAnnounced: ticket.toolsAnnounced ?? TOOL_COUNT,
      mark: "cupel scorched; admit the charge already scorched",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — 2020-12 schemas accepted; the charge stayed bullion",
      dialect: DIALECT_2020_12,
      eraProbe: "current",
      context: "desk-app",
      toolsAnnounced: TOOL_COUNT,
      mark: "cupel hold; the cupel stays bone-ash",
      note: "Hold: the cupel stays bone-ash.",
    };
  }
  return {
    case: "pure — 2020-12 accepted; the charge stayed bullion; idle word pure",
    dialect: DIALECT_2020_12,
    eraProbe: "current",
    context: "desk-app",
    toolsAnnounced: TOOL_COUNT,
    mark: "cupel pure; idle word pure",
    note: "Pure: 2020-12 passed; the cupel stayed bone-ash.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const scorched = verdict === "scorched" || flags.scorched;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    pure: verdict === "pure" || (flags.pure && !scorched),
    scorched,
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
  if (name === SEEDED_WORD || name === 92122 || name === "92122") {
    return analyze(seedScorched());
  }
  if (name === "legacy") return analyze(seedLegacy());
  if (name === "draft07" || name === "draft-07") return analyze(seedDraft07());
  if (name === "shared-pool" || name === "sharedPool") {
    return analyze(seedSharedPool());
  }
  if (name === "refused") return analyze(seedRefused());
  if (name === "fourteen" || name === "fourteen-tools") {
    return analyze(seedFourteen());
  }
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "open") {
    return analyze(seedPure());
  }
  if (
    name === 88988 ||
    name === "88988" ||
    name === 88882 ||
    name === "88882" ||
    name === 90549 ||
    name === "90549" ||
    name === 90245 ||
    name === "90245" ||
    name === 87633 ||
    name === "87633" ||
    name === 86142 ||
    name === "86142" ||
    name === 92091 ||
    name === "92091" ||
    name === 80174 ||
    name === "80174" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedPure());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "scorched" || (result.scorched && result.alarm)
          ? `scorched cupel #${FEATURED_ISSUE}: era probe marked sibling exchange legacy, then draft-07 outputSchema refused on the shared-pool path. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. The cupel stayed bone-ash. Score the cupel."
            : `pure cupel. Idle word ${IDLE_WORD}. 2020-12 schemas accepted; the charge stayed bullion.`,
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
