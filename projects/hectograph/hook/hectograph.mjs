#!/usr/bin/env node
/**
 * Hectograph — gelatin hectograph / spirit-duplicator atelier
 * classifier. A hectograph that still pulls a canary when every
 * scrub flag is off is not a private log — it is a gelatin already
 * impressed. Score the gelatin or admit the canary already pulled.
 *
 *   echo '{"flags":{"OTEL_LOG_TOOL_CONTENT":false},"canaryPresent":true}' | node hectograph.mjs
 *   node hectograph.mjs ticket.json
 *
 * Idle word is scrubbed (HOLD: every OTEL_LOG_TOOL_* flag off or
 * unset; canary absent from tool_input / tool_parameters).
 * Seeded state is pulled / #92056 (canary still appears in the
 * exported payload with scrub flags off).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the gelatin scrubbed the
 * canary or already pulled a copy.
 *
 * Primary #92056: Tool argument content is exported in
 * tool_input/tool_parameters regardless of any OTEL_LOG_TOOL_*
 * setting. Reporter michalszelagsonos. Filed 2026-09-04T11:07:44Z.
 * OPEN. Labels: bug, has repro, platform:macos, area:core,
 * area:security. Claude Code 2.1.259 (also 2.1.252, 2.1.258).
 * macOS darwin 25.6.0 arm64. OTLP gRPC to otelcol-contrib 0.160.0
 * on loopback. Observed 2026-09-04.
 *
 * Hypothesis only (NON-BINDING): tool_input / tool_parameters may
 * be serialised onto tool_decision and tool_result events outside
 * the OTEL_LOG_TOOL_* gates, so full_command still leaves even
 * when every scrub flag is off. Discard if issue evidence
 * disagrees. Do not claim Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "scrubbed",
  "pulled",
  "flag-matrix",
  "tool-parameters",
  "tool-input",
  "full-command",
  "content-false",
  "content-zero",
  "flags-unset",
  "hold",
]);
export const IDLE_WORD = "scrubbed";
export const SEEDED_WORD = "pulled";
export const HOLD_VERDICTS = Object.freeze(["scrubbed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92056;
export const PRIMARY_ISSUES = Object.freeze([92056]);
export const COUSINS = Object.freeze([92057, 91766]);
export const COUSIN_ISSUE = 92057;
export const DISTANT_COST = Object.freeze([92033, 92062]);
export const BACKUPS = Object.freeze([92062, 92061]);
export const SKIP_BACKUPS = Object.freeze([92019, 92014]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92056";
export const TITLE =
  "Tool argument content is exported in tool_input/tool_parameters regardless of any OTEL_LOG_TOOL_* setting";
export const FILED_AT = "2026-09-04T11:07:44Z";
export const UPDATED_AT = "2026-09-04T11:08:48Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:security",
]);
export const REPORTER = "michalszelagsonos";
export const PLATFORM = "macOS darwin 25.6.0 arm64";
export const CLI_VERSIONS = Object.freeze(["2.1.259", "2.1.258", "2.1.252"]);
export const CLI_VERSION = "2.1.259";
export const COLLECTOR = "otelcol-contrib 0.160.0 loopback";
export const PROTOCOL = "OTLP gRPC";
export const OBSERVED = "2026-09-04";
export const AREA = "area:security";
export const EVIDENCE = "otel-tool-args-ignore-scrub-flags";
export const CANARY = "HECTOGRAPH_CANARY_DO_NOT_EXPORT";
export const ISSUE_CANARY_NOTE = "CANARY_12345 (issue measurement string; fixtures use HECTOGRAPH_CANARY_DO_NOT_EXPORT)";
export const FLAG_NAMES = Object.freeze([
  "OTEL_LOG_ASSISTANT_RESPONSES",
  "OTEL_LOG_RAW_API_BODIES",
  "OTEL_LOG_TOOL_CONTENT",
  "OTEL_LOG_TOOL_DETAILS",
  "OTEL_LOG_USER_PROMPTS",
]);
export const ATTRIBUTE_PATHS = Object.freeze([
  "tool_decision.tool_parameters.full_command",
  "tool_result.tool_parameters",
  "tool_result.tool_input",
]);
export const FAKE_COMMAND = `echo ${CANARY}`;
export const FAKE_EMAIL_NOTE =
  "user.email arrives as a record attribute on the same events; fixtures never include a real address";
export const HUB_LINE =
  "21:50 hectograph: a hectograph that still pulls a canary when every scrub flag is off is not a private log — it is a gelatin already impressed. Score the gelatin or admit the canary already pulled.";
export const MARK = "21:50 / hermes catalog #135 / #92056";
export const PHRASE =
  "Score the gelatin or admit the canary already pulled.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: tool_input / tool_parameters may be serialised onto tool_decision and tool_result events outside the OTEL_LOG_TOOL_* gates, so full_command still leaves even when every scrub flag is off. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is TELEMETRY / PRIVACY EXPORT: OTEL attributes that ignore scrub flags. Claude Code 2.1.259 (also 2.1.252, 2.1.258), macOS darwin 25.6.0 arm64, OTLP gRPC to otelcol-contrib 0.160.0 on loopback. Five content flags exist; none of them suppresses full bash command text. Canary lands in tool_decision.tool_parameters.full_command, tool_result.tool_parameters, and tool_result.tool_input. Never in the assistant response body. user.email arrives as a record attribute on the same events. Reporter michalszelagsonos. Filed 2026-09-04. OPEN, bug, has repro, platform:macos, area:core, area:security.";
export const HOLD_EXPORT =
  "scrubbed gelatin; OTEL_LOG_TOOL_* off or unset; canary absent from tool_input and tool_parameters; idle word scrubbed";
export const FORBIDDEN_IDLE = Object.freeze([
  "masked",
  "bled",
  "sounded",
  "muted",
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
  "withheld",
  "enacted",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Spectral",
  "Figtree",
  "JetBrains Mono",
  "JetBrains",
  "Libre Baskerville",
  "Karla",
  "IBM Plex Mono",
  "IBM Plex",
  "Instrument Serif",
  "Albert Sans",
  "Spline Sans Mono",
  "Spline Sans",
  "Playfair Display",
  "Playfair",
  "DM Sans",
  "Fragment Mono",
  "Fragment",
  "Petrona",
  "Sora",
]);
export const NOT_PRODUCTS = Object.freeze([
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

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function blankFlags() {
  return {
    OTEL_LOG_ASSISTANT_RESPONSES: null,
    OTEL_LOG_RAW_API_BODIES: null,
    OTEL_LOG_TOOL_CONTENT: null,
    OTEL_LOG_TOOL_DETAILS: null,
    OTEL_LOG_USER_PROMPTS: null,
  };
}

function blankAttributes() {
  return {
    tool_decision: { tool_parameters: { full_command: "" } },
    tool_result: { tool_parameters: {}, tool_input: { command: "" } },
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
    scrubbed: null,
    pulled: null,
    scrubFlagsOff: null,
    canary: "",
    canaryPresent: null,
    flags: blankFlags(),
    attributes: blankAttributes(),
    exportPayload: "",
    fullCommand: "",
    toolParameters: "",
    toolInput: "",
    flagMatrix: "",
    platform: "",
    cliVersion: "",
    collector: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function offFlags(contentValue = null) {
  return {
    OTEL_LOG_ASSISTANT_RESPONSES: null,
    OTEL_LOG_RAW_API_BODIES: null,
    OTEL_LOG_TOOL_CONTENT: contentValue,
    OTEL_LOG_TOOL_DETAILS: null,
    OTEL_LOG_USER_PROMPTS: null,
  };
}

export function pulledAttributes() {
  return {
    tool_decision: {
      tool_parameters: { full_command: FAKE_COMMAND },
    },
    tool_result: {
      tool_parameters: { full_command: FAKE_COMMAND, command: FAKE_COMMAND },
      tool_input: { command: FAKE_COMMAND },
    },
  };
}

export function scrubbedAttributes() {
  return {
    tool_decision: { tool_parameters: { full_command: "" } },
    tool_result: { tool_parameters: {}, tool_input: { command: "" } },
  };
}

export function seedScrubbed() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistHold: true,
    scrubbed: true,
    pulled: false,
    scrubFlagsOff: true,
    canary: CANARY,
    canaryPresent: false,
    flags: offFlags(false),
    attributes: scrubbedAttributes(),
    exportPayload: HOLD_EXPORT,
    fullCommand: "",
    toolParameters: "",
    toolInput: "",
    flagMatrix: "all-off",
    platform: PLATFORM,
    cliVersion: CLI_VERSION,
    collector: COLLECTOR,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "scrubbed; every OTEL_LOG_TOOL_* flag off; canary absent from tool_input and tool_parameters; gelatin holds; idle word scrubbed",
  };
}

export function seedPulled() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistHold: false,
    scrubbed: false,
    pulled: true,
    scrubFlagsOff: true,
    canary: CANARY,
    canaryPresent: true,
    flags: offFlags(false),
    attributes: pulledAttributes(),
    exportPayload: JSON.stringify(pulledAttributes()),
    fullCommand: FAKE_COMMAND,
    toolParameters: FAKE_COMMAND,
    toolInput: FAKE_COMMAND,
    flagMatrix: "all-off",
    platform: PLATFORM,
    cliVersion: CLI_VERSION,
    collector: COLLECTOR,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "pulled; #92056; canary still appears in tool_decision.tool_parameters.full_command, tool_result.tool_parameters, and tool_result.tool_input with OTEL_LOG_TOOL_CONTENT=false; michalszelagsonos; 2.1.259; macOS darwin 25.6.0 arm64; area:security",
  };
}

export function seedFlagMatrix() {
  return {
    ...seedPulled(),
    seed: "flag-matrix",
    issue: null,
    title: "",
    url: "",
    reporter: "",
    outputText:
      "flag-matrix; five content flags unset or off; canary still pulled on every tool attribute path",
  };
}

export function seedToolParameters() {
  return {
    ...blankTicket(),
    seed: "tool-parameters",
    source: "atelier",
    persistHold: false,
    pulled: true,
    scrubFlagsOff: true,
    canary: CANARY,
    canaryPresent: true,
    flags: offFlags(0),
    attributes: {
      tool_decision: { tool_parameters: { full_command: FAKE_COMMAND } },
      tool_result: { tool_parameters: { full_command: FAKE_COMMAND }, tool_input: { command: "" } },
    },
    exportPayload: `tool_decision.tool_parameters.full_command=${FAKE_COMMAND}`,
    fullCommand: FAKE_COMMAND,
    toolParameters: FAKE_COMMAND,
    toolInput: "",
    outputText:
      "tool-parameters; canary present in tool_decision.tool_parameters and tool_result.tool_parameters",
  };
}

export function seedToolInput() {
  return {
    ...blankTicket(),
    seed: "tool-input",
    source: "atelier",
    persistHold: false,
    pulled: true,
    scrubFlagsOff: true,
    canary: CANARY,
    canaryPresent: true,
    flags: offFlags(false),
    attributes: {
      tool_decision: { tool_parameters: { full_command: "" } },
      tool_result: { tool_parameters: {}, tool_input: { command: FAKE_COMMAND } },
    },
    exportPayload: `tool_result.tool_input.command=${FAKE_COMMAND}`,
    fullCommand: "",
    toolParameters: "",
    toolInput: FAKE_COMMAND,
    outputText:
      "tool-input; canary present in tool_result.tool_input.command",
  };
}

export function seedFullCommand() {
  return {
    ...blankTicket(),
    seed: "full-command",
    source: "atelier",
    persistHold: false,
    pulled: true,
    scrubFlagsOff: true,
    canary: CANARY,
    canaryPresent: true,
    flags: offFlags(false),
    attributes: {
      tool_decision: { tool_parameters: { full_command: FAKE_COMMAND } },
      tool_result: { tool_parameters: {}, tool_input: { command: "" } },
    },
    exportPayload: `full_command=${FAKE_COMMAND}`,
    fullCommand: FAKE_COMMAND,
    outputText:
      "full-command; tool_decision.tool_parameters.full_command still carries the bash text",
  };
}

export function seedContentFalse() {
  return {
    ...seedPulled(),
    seed: "content-false",
    issue: null,
    title: "",
    url: "",
    flags: offFlags(false),
    outputText:
      "content-false; OTEL_LOG_TOOL_CONTENT=false; canary still appears in the exported payload",
  };
}

export function seedContentZero() {
  return {
    ...seedPulled(),
    seed: "content-zero",
    issue: null,
    title: "",
    url: "",
    flags: offFlags(0),
    outputText:
      "content-zero; OTEL_LOG_TOOL_CONTENT=0; canary still appears in the exported payload",
  };
}

export function seedFlagsUnset() {
  return {
    ...seedPulled(),
    seed: "flags-unset",
    issue: null,
    title: "",
    url: "",
    flags: blankFlags(),
    flagMatrix: "unset",
    outputText:
      "flags-unset; all OTEL_LOG_* flags unset (default); canary still appears in the exported payload",
  };
}

export function seedHold() {
  return {
    ...seedScrubbed(),
    seed: "hold",
    outputText:
      "hold; gelatin holds; canary absent; scrub flags honored; idle word scrubbed",
  };
}

export function seedCousin() {
  return {
    ...seedScrubbed(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #92057 query_source embeds outputStyle so exact-match filters silently match nothing; #91766 OTEL_LOG_RAW_API_BODIES ignored in project settings — cite only, not the #92056 tool_input/tool_parameters scrub-flag leak",
  };
}

export function emptyTicket() {
  return seedScrubbed();
}

function mergeFlags(a, b) {
  return { ...blankFlags(), ...asObject(a), ...asObject(b) };
}

function mergeAttributes(a, b) {
  const left = asObject(a);
  const right = asObject(b);
  const leftDecision = asObject(left.tool_decision);
  const rightDecision = asObject(right.tool_decision);
  const leftResult = asObject(left.tool_result);
  const rightResult = asObject(right.tool_result);
  return {
    tool_decision: {
      tool_parameters: {
        ...asObject(asObject(leftDecision.tool_parameters)),
        ...asObject(asObject(rightDecision.tool_parameters)),
      },
    },
    tool_result: {
      tool_parameters: {
        ...asObject(leftResult.tool_parameters),
        ...asObject(rightResult.tool_parameters),
      },
      tool_input: {
        ...asObject(leftResult.tool_input),
        ...asObject(rightResult.tool_input),
      },
    },
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    scrubbed: firstBool(nested.scrubbed, src.scrubbed),
    pulled: firstBool(nested.pulled, src.pulled),
    scrubFlagsOff: firstBool(nested.scrubFlagsOff, src.scrubFlagsOff),
    canary: firstText(nested.canary, src.canary) || CANARY,
    canaryPresent: firstBool(nested.canaryPresent, src.canaryPresent),
    flags: mergeFlags(nested.flags, src.flags),
    attributes: mergeAttributes(nested.attributes, src.attributes),
    exportPayload: firstText(nested.exportPayload, src.exportPayload),
    fullCommand: firstText(nested.fullCommand, src.fullCommand),
    toolParameters: firstText(nested.toolParameters, src.toolParameters),
    toolInput: firstText(nested.toolInput, src.toolInput),
    flagMatrix: firstText(nested.flagMatrix, src.flagMatrix),
    platform: firstText(nested.platform, src.platform),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    collector: firstText(nested.collector, src.collector),
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
  const flags = asObject(row.flags);
  const attrs = asObject(row.attributes);
  return (
    row.persistHold == null &&
    row.scrubbed == null &&
    row.pulled == null &&
    row.scrubFlagsOff == null &&
    row.canaryPresent == null &&
    !row.exportPayload &&
    !row.fullCommand &&
    !row.toolParameters &&
    !row.toolInput &&
    !row.flagMatrix &&
    Object.values(flags).every((value) => value == null || value === "") &&
    !JSON.stringify(attrs).includes(CANARY)
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedScrubbed,
  [SEEDED_WORD]: seedPulled,
  "flag-matrix": seedFlagMatrix,
  "tool-parameters": seedToolParameters,
  "tool-input": seedToolInput,
  "full-command": seedFullCommand,
  "content-false": seedContentFalse,
  "content-zero": seedContentZero,
  "flags-unset": seedFlagsUnset,
  hold: seedHold,
  cousin: seedCousin,
  92057: seedCousin,
  91766: seedCousin,
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
    return { ...seedPulled(), ...cloned, ...raw };
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
    ticket.platform,
    ticket.cliVersion,
    ticket.exportPayload,
    ticket.fullCommand,
    ticket.toolParameters,
    ticket.toolInput,
    ticket.flagMatrix,
    ticket.area,
    ticket.evidence,
    JSON.stringify(ticket.flags || {}),
    JSON.stringify(ticket.attributes || {}),
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

export function isFlagOff(value) {
  return (
    value === 0 ||
    value === false ||
    value === "0" ||
    value === "false" ||
    value == null ||
    value === "" ||
    value === "unset"
  );
}

export function flagsWantScrub(flags) {
  const row = asObject(flags);
  const content = row.OTEL_LOG_TOOL_CONTENT;
  if (
    content === 0 ||
    content === false ||
    content === "0" ||
    content === "false"
  ) {
    return true;
  }
  return FLAG_NAMES.every((name) => isFlagOff(row[name]));
}

function blobOf(ticket) {
  return [
    ticket.exportPayload,
    ticket.fullCommand,
    ticket.toolParameters,
    ticket.toolInput,
    ticket.outputText,
    JSON.stringify(ticket.attributes || {}),
  ]
    .filter(Boolean)
    .join("\n");
}

export function canaryInBlob(ticket, canary = CANARY) {
  const row = cloneTicket(ticket);
  if (row.canaryPresent === true) return true;
  const needle = firstText(row.canary, canary) || CANARY;
  return blobOf(row).includes(needle);
}

export function pathHits(ticket) {
  const row = cloneTicket(ticket);
  const blob = blobOf(row);
  const params =
    row.toolParameters ||
    row.attributes?.tool_decision?.tool_parameters?.full_command ||
    row.attributes?.tool_result?.tool_parameters?.full_command ||
    row.attributes?.tool_result?.tool_parameters?.command ||
    "";
  const input =
    row.toolInput ||
    row.attributes?.tool_result?.tool_input?.command ||
    "";
  const full =
    row.fullCommand ||
    row.attributes?.tool_decision?.tool_parameters?.full_command ||
    "";
  const needle = row.canary || CANARY;
  return {
    toolParameters:
      String(params).includes(needle) ||
      /tool_parameters/i.test(blob) && blob.includes(needle) && /tool_parameters/.test(JSON.stringify(row.attributes || {})),
    toolInput:
      String(input).includes(needle) ||
      (/tool_input/i.test(blob) && String(input).includes(needle)),
    fullCommand: String(full).includes(needle),
  };
}

function holdPattern(row) {
  return (
    flagsWantScrub(row.flags) &&
    row.canaryPresent !== true &&
    !canaryInBlob(row) &&
    row.pulled !== true
  );
}

function pulledPattern(row) {
  if (row.pulled === true) return true;
  if (row.canaryPresent === true && flagsWantScrub(row.flags)) return true;
  if (flagsWantScrub(row.flags) && canaryInBlob(row)) return true;
  return false;
}

export function isScrubbed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.pulled !== true && holdPattern(row)) {
    return true;
  }
  if (holdPattern(row) && row.pulled !== true) return true;
  return false;
}

export function isPulled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (pulledPattern(row)) return true;
  return false;
}

function contentValue(flags) {
  const row = asObject(flags);
  return row.OTEL_LOG_TOOL_CONTENT;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#92057|#91766/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const pulledNow = !cousinOnly && isPulled(row);
  const scrubbedNow = !pulledNow && isScrubbed(row);
  const hits = pathHits(row);
  const content = contentValue(row.flags);
  const contentFalse =
    named === "content-false" ||
    content === false ||
    content === "false" ||
    /content-false|OTEL_LOG_TOOL_CONTENT=false/i.test(text);
  const contentZero =
    named === "content-zero" ||
    content === 0 ||
    content === "0" ||
    /content-zero|OTEL_LOG_TOOL_CONTENT=0/i.test(text);
  const flagsUnset =
    named === "flags-unset" ||
    row.flagMatrix === "unset" ||
    /flags-unset|all flags unset|all OTEL_LOG_\* flags unset/i.test(text);
  const flagMatrix =
    named === "flag-matrix" ||
    /flag-matrix|five content flags/i.test(text) ||
    (flagsWantScrub(row.flags) && pulledNow);
  const toolParameters =
    named === "tool-parameters" ||
    hits.toolParameters ||
    /tool-parameters|tool_parameters/i.test(text);
  const toolInput =
    named === "tool-input" ||
    hits.toolInput ||
    /tool-input|tool_input/i.test(text);
  const fullCommand =
    named === "full-command" ||
    hits.fullCommand ||
    /full-command|full_command/i.test(text);
  const pulled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (pulledNow || named === SEEDED_WORD || /pulled|#92056/i.test(text));
  const scrubbed = HOLD_VERDICTS.includes(named) || (scrubbedNow && !pulled);
  return {
    named,
    cousinOnly,
    pulledNow,
    scrubbedNow,
    contentFalse,
    contentZero,
    flagsUnset,
    flagMatrix,
    toolParameters,
    toolInput,
    fullCommand,
    pulled,
    scrubbed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.scrubbed && !flags.pulled) chips.push("scrubbed");
  if (flags.pulled) chips.push("pulled");
  if (flags.flagMatrix && flags.pulled) chips.push("flag-matrix");
  if (flags.toolParameters && flags.pulled) chips.push("tool-parameters");
  if (flags.toolInput && flags.pulled) chips.push("tool-input");
  if (flags.fullCommand && flags.pulled) chips.push("full-command");
  if (flags.contentFalse && flags.pulled) chips.push("content-false");
  if (flags.contentZero && flags.pulled) chips.push("content-zero");
  if (flags.flagsUnset && flags.pulled) chips.push("flags-unset");
  if ((flags.scrubbed || flags.named === "hold") && !flags.pulled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "scrubbed") {
    reasons.push(
      "scrubbed; every OTEL_LOG_TOOL_* flag off; canary absent from tool_input and tool_parameters; gelatin holds",
    );
    reasons.push("hold: the gelatin scrubbed the canary; idle word scrubbed");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; gelatin holds; canary absent; scrub flags honored",
    );
  }
  if (verdict === "pulled" || flags.pulled) {
    reasons.push(
      "pulled; #92056; canary still appears in tool_decision.tool_parameters.full_command, tool_result.tool_parameters, and tool_result.tool_input with scrub flags off",
    );
  }
  if (verdict === "flag-matrix" || (flags.flagMatrix && flags.pulled)) {
    reasons.push(
      "flag-matrix; five content flags unset or off; canary still pulled on every tool attribute path",
    );
  }
  if (verdict === "tool-parameters" || (flags.toolParameters && flags.pulled)) {
    reasons.push(
      "tool-parameters; canary present in tool_decision.tool_parameters and/or tool_result.tool_parameters",
    );
  }
  if (verdict === "tool-input" || (flags.toolInput && flags.pulled)) {
    reasons.push(
      "tool-input; canary present in tool_result.tool_input",
    );
  }
  if (verdict === "full-command" || (flags.fullCommand && flags.pulled)) {
    reasons.push(
      "full-command; tool_decision.tool_parameters.full_command still carries the bash text",
    );
  }
  if (verdict === "content-false" || (flags.contentFalse && flags.pulled)) {
    reasons.push(
      "content-false; OTEL_LOG_TOOL_CONTENT=false; canary still appears in the exported payload",
    );
  }
  if (verdict === "content-zero" || (flags.contentZero && flags.pulled)) {
    reasons.push(
      "content-zero; OTEL_LOG_TOOL_CONTENT=0; canary still appears in the exported payload",
    );
  }
  if (verdict === "flags-unset" || (flags.flagsUnset && flags.pulled)) {
    reasons.push(
      "flags-unset; all OTEL_LOG_* flags unset (default); canary still appears in the exported payload",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Hectograph; cite-only #92057 (query_source embeds outputStyle — related telemetry field pollution), #91766 (OTEL_LOG_RAW_API_BODIES ignored in project settings) — different surfaces from #92056 tool_input/tool_parameters scrub-flag leak; primary stays #92056",
    );
  }
  if (verdict === "pulled" || flags.pulled) {
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
  if (named === IDLE_WORD && (flags.scrubbed || !flags.pulled)) return "scrubbed";
  if (named === "hold" && !flags.pulled) return "hold";
  if (named === SEEDED_WORD) return "pulled";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "scrubbed";
  if (flags.pulled) return "pulled";
  if (flags.scrubbed) return "scrubbed";
  return "scrubbed";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "pulled" || flags.pulled) {
    return {
      case: "pulled — scrub flags off; canary still in the gelatin pull",
      flags: ticket.flagMatrix || "all-off",
      content: String(contentValue(ticket.flags) ?? "unset"),
      canary: ticket.canary || CANARY,
      toolParameters: flags.toolParameters ? "present" : "absent",
      toolInput: flags.toolInput ? "present" : "absent",
      fullCommand: flags.fullCommand ? "present" : "absent",
      mark: "hectograph pulled; admit the canary already pulled",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — gelatin holds; canary absent; scrub flags honored",
      flags: "all-off",
      content: "false",
      canary: "absent",
      toolParameters: "absent",
      toolInput: "absent",
      fullCommand: "absent",
      mark: "hectograph hold; the gelatin scrubs",
      note: "Hold: the gelatin scrubs.",
    };
  }
  return {
    case: "scrubbed — every OTEL_LOG_TOOL_* flag off; canary absent from tool_input and tool_parameters",
    flags: "all-off",
    content: "false",
    canary: "absent",
    toolParameters: "absent",
    toolInput: "absent",
    fullCommand: "absent",
    mark: "hectograph scrubbed; idle word scrubbed",
    note: "Scrubbed: the gelatin holds the canary.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const pulled = verdict === "pulled" || flags.pulled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    scrubbed: verdict === "scrubbed" || (flags.scrubbed && !pulled),
    pulled,
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
  if (name === SEEDED_WORD || name === 92056 || name === "92056") {
    return analyze(seedPulled());
  }
  if (name === "flag-matrix") return analyze(seedFlagMatrix());
  if (name === "tool-parameters") return analyze(seedToolParameters());
  if (name === "tool-input") return analyze(seedToolInput());
  if (name === "full-command") return analyze(seedFullCommand());
  if (name === "content-false") return analyze(seedContentFalse());
  if (name === "content-zero") return analyze(seedContentZero());
  if (name === "flags-unset") return analyze(seedFlagsUnset());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "scrubbed" || name === "open") {
    return analyze(seedScrubbed());
  }
  if (
    name === 92057 ||
    name === "92057" ||
    name === 91766 ||
    name === "91766" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedScrubbed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "pulled" || (result.pulled && result.alarm)
          ? `pulled hectograph #${FEATURED_ISSUE}: canary still appears in tool_input/tool_parameters with scrub flags off. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Gelatin holds; canary absent; scrub flags honored. Score the gelatin."
            : `scrubbed hectograph. Idle word ${IDLE_WORD}. Every OTEL_LOG_TOOL_* flag off; canary absent from tool_input and tool_parameters.`,
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
