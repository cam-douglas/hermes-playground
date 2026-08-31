#!/usr/bin/env node
/**
 * Puncheon — goldsmith / pewterer puncheon-rack assay.
 * An unstruck mark is not a hold. Score the gold or admit hallmarked.
 *
 *   node puncheon.mjs --table
 *   node puncheon.mjs ticket.json
 *   echo '{"seed":"misstruck"}' | node puncheon.mjs
 *
 * Idle word is hallmarked (BOM EF BB BF present, or ASCII-only).
 * Seeded state is misstruck / #90962.
 * NEVER idle as "puncheon", "misstruck", "bom", "utf", "quote",
 * "powershell", "gnomon", "pointed", "collapsed", "spoiled",
 * "banked", "traced", "struck", "torn".
 *
 * Primary #90962: Write tool emits .ps1 as UTF-8 without BOM.
 * Windows PowerShell 5.1 (powershell.exe, not pwsh 7) reads
 * BOM-less as machine ANSI. Measured Win11 26200,
 * powershell.exe 5.1.22621.6133, ANSI CP 1252.
 * Em dash U+2014 is UTF-8 E2 80 94. Byte 0x94 in CP1252 is
 * U+201D right double quotation mark. PowerShell accepts smart
 * quotes as string delimiters → The string is missing the
 * terminator: "
 * Under Task Scheduler: result 0x80070001, no transcript, no
 * log, task history shows action completed. Two repair scripts
 * sat scheduled four days; every status surface said armed;
 * ran zero times.
 * Fix must be per file type: .ps1/.psm1/.bat/.cmd on Windows
 * → emit UTF-8 BOM or restrict to ASCII; .md/.json/agent/skill
 * defs → strip a leading BOM. Blanket always-BOM would break
 * #73158 (BOM makes an agent file silently invisible).
 * Their tree: 16 of 67 .ps1 files are non-ASCII with no BOM
 * (narrative, not a fixture count).
 *
 * This hook assays raw bytes in Node. It does not require
 * Windows PowerShell 5.1. BOM-less files decode as CP1252;
 * with-BOM files decode as UTF-8 after stripping EF BB BF.
 *
 * Same-class cite (not primary): #73158 opposite-bom agent.md;
 * #58545 CLOSED dup; #28316 CLOSED dup; yiliangs/agent-usage-stat#116;
 * #13363; npm/cmd-shim#177; #43024 (prior understated).
 * NOT Gnomon, Spoil, Trammel, Soundpost, Flong, Bulla.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "misstruck",
  "hallmarked",
  "no-bom",
  "mojibake-quote",
  "em-dash",
  "cp1252",
  "parser-error",
  "silent-schedule",
  "0x80070001",
  "per-extension",
  "opposite-bom",
  "ps51-ansi",
  "string-terminator",
  "task-success",
]);
export const IDLE_WORD = "hallmarked";
export const SEEDED_WORD = "misstruck";
export const HOLD_VERDICTS = Object.freeze(["hallmarked"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "hallmarked"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90962;
export const PRIMARY_ISSUES = Object.freeze([90962]);
export const SAME_CLASS = Object.freeze([
  73158, 58545, 28316, 13363, 43024,
]);
export const AGENT_USAGE_STAT = 116;
export const CMD_SHIM = 177;
export const OPPOSITE_BOM_ISSUE = 73158;
export const NOT_PRODUCTS = Object.freeze([
  "gnomon",
  "spoil",
  "trammel",
  "soundpost",
  "flong",
  "bulla",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90962";
export const TITLE =
  "[BUG] Windows: Write tool emits .ps1 without a BOM; PowerShell 5.1 parses it as ANSI and a mojibake quote kills the script - silently when scheduled (0x80070001, no log)";
export const REPORTER = "tonydzi";
export const REPORTER_NAME = "Anton Dziatkovskii";
export const FILED_AT = "2026-08-31T11:01:52Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:tools",
]);
export const OS_NAME = "Windows 11 Pro 10.0.26200";
export const POWERSHELL = "5.1.22621.6133";
export const ANSI_CP = 1252;
export const TREE_NON_ASCII = 16;
export const TREE_PS1 = 67;
export const ARMED_DAYS = 4;
export const SCHEDULER_RESULT = "0x80070001";
export const MISSING_DQ = 'The string is missing the terminator: "';
export const MISSING_SQ = "The string is missing the terminator: '";
export const BOM = Object.freeze([0xef, 0xbb, 0xbf]);
export const EM_DASH = "\u2014";
export const EM_DASH_UTF8 = Object.freeze([0xe2, 0x80, 0x94]);
export const RIGHT_DQ = "\u201d";
export const LEFT_DQ = "\u201c";
export const LEFT_SQ = "\u2018";
export const RIGHT_SQ = "\u2019";
export const CYRILLIC_YO = "\u0451";
export const CYRILLIC_REPORT = "\u043e\u0442\u0447\u0451\u0442";
export const ARROW = "\u2192";
export const CHECK = "\u2705";
export const HUB_LINE =
  "21:50 puncheon: an unstruck mark is not a hold. Score the gold or admit hallmarked.";
export const MARK = "21:50 / hermes catalog #95 / #90962";
export const PHRASE = "an unstruck mark is not a hold";
export const CONTRAST_NOTE =
  "per-extension: .ps1/.psm1/.bat/.cmd on Windows emit UTF-8 BOM or ASCII; .md/.json/agent/skill defs strip a leading BOM";
export const HYPOTHESIS_NOTE =
  "A puncheon is the punch that strikes the mark; the UTF-8 BOM is the mark that tells the reader this is UTF-8. Without it, PowerShell 5.1 assays the metal as ANSI and the em-dash strike comes out a quotation mark.";
export const FORBIDDEN_IDLE = Object.freeze([
  "puncheon",
  "misstruck",
  "bom",
  "utf",
  "quote",
  "powershell",
  "gnomon",
  "pointed",
  "collapsed",
  "spoiled",
  "banked",
  "traced",
  "struck",
  "torn",
]);

const CP1252_80_9F = Object.freeze([
  0x20ac, 0x0081, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021,
  0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, 0x008d, 0x017d, 0x008f,
  0x0090, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
  0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x009d, 0x017e, 0x0178,
]);

const DANGER = new Set(["\u201c", "\u201d", "\u2018", "\u2019"]);
const DQ_DELIMS = new Set(['"', "\u201c", "\u201d"]);
const SQ_DELIMS = new Set(["'", "\u2018", "\u2019"]);

export function bytesOf(input) {
  if (Buffer.isBuffer(input)) return Buffer.from(input);
  if (input instanceof Uint8Array) return Buffer.from(input);
  if (Array.isArray(input)) return Buffer.from(input);
  if (typeof input === "string") return Buffer.from(input, "utf8");
  return Buffer.alloc(0);
}

export function startsWithBom(buf) {
  const b = bytesOf(buf);
  return b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf;
}

export function firstBytes(buf, n = 3) {
  const b = bytesOf(buf);
  return Array.from(b.subarray(0, n));
}

export function firstBytesHex(buf, n = 8) {
  return Array.from(bytesOf(buf).subarray(0, n))
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

export function isAsciiBytes(buf) {
  return bytesOf(buf).every((byte) => byte < 0x80);
}

export function decodeCp1252(buf) {
  const b = bytesOf(buf);
  let out = "";
  for (const byte of b) {
    if (byte >= 0x80 && byte <= 0x9f) {
      out += String.fromCodePoint(CP1252_80_9F[byte - 0x80]);
    } else {
      out += String.fromCharCode(byte);
    }
  }
  return out;
}

export function decodeFile(buf) {
  const b = bytesOf(buf);
  if (startsWithBom(b)) {
    return {
      bom: true,
      encoding: "utf-8",
      text: b.subarray(3).toString("utf8"),
      bytes: b,
    };
  }
  return {
    bom: false,
    encoding: "cp1252",
    text: decodeCp1252(b),
    bytes: b,
  };
}

export function tokenizePS(text) {
  const errors = [];
  let state = "code";
  let opener = "";
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (state === "comment") {
      if (ch === "\n" || ch === "\r") state = "code";
      continue;
    }
    if (state === "dquote") {
      if (DQ_DELIMS.has(ch)) {
        state = "code";
        opener = "";
      }
      continue;
    }
    if (state === "squote") {
      if (SQ_DELIMS.has(ch)) {
        state = "code";
        opener = "";
      }
      continue;
    }
    if (ch === "#") {
      state = "comment";
      continue;
    }
    if (DQ_DELIMS.has(ch)) {
      state = "dquote";
      opener = '"';
      continue;
    }
    if (SQ_DELIMS.has(ch)) {
      state = "squote";
      opener = "'";
    }
  }
  if (state === "dquote") errors.push(MISSING_DQ);
  if (state === "squote") errors.push(MISSING_SQ);
  return {
    errors,
    state,
    opener,
    dangerChars: [...text].filter((ch) => DANGER.has(ch)),
  };
}

function extensionOf(opts = {}) {
  const name = String(opts.filename || opts.kind || opts.ext || "").toLowerCase();
  if (name.includes("agent") || name.endsWith(".md")) return "agent";
  if (/\.(ps1|psm1|bat|cmd)$/.test(name)) return "script";
  if (name === "ps1" || name === "psm1" || name === "bat" || name === "cmd") {
    return "script";
  }
  if (name === "agent.md" || name === "agent") return "agent";
  return opts.kind === "agent" || opts.kind === "agent.md" ? "agent" : "script";
}

export function assay(buf, opts = {}) {
  const b = bytesOf(buf);
  const decoded = decodeFile(b);
  const ext = extensionOf(opts);
  const ascii = isAsciiBytes(decoded.bom ? b.subarray(3) : b);
  const tokens = tokenizePS(decoded.text);
  const scheduled =
    opts.scheduled === true ||
    opts.result === SCHEDULER_RESULT ||
    opts.history === "completed";

  if (ext === "agent") {
    const front = decoded.text.replace(/^\uFEFF/, "").startsWith("---");
    const grade = decoded.bom ? "SKIPPED" : front ? "REGISTERED" : "REGISTERED";
    return {
      grade,
      parseErrors: 0,
      parseError: null,
      bom: decoded.bom,
      encoding: decoded.encoding,
      ascii,
      text: decoded.text,
      tokens,
      hex: firstBytesHex(b, 8),
      firstBytes: firstBytes(b, 3),
      oppositeBom: decoded.bom,
      chips: decoded.bom
        ? ["opposite-bom", "per-extension"]
        : ["hallmarked", "per-extension"],
    };
  }

  let grade = "OK";
  let parseError = null;
  if (tokens.errors.length > 0) {
    grade = "BROKEN";
    parseError = tokens.errors[0];
  } else if (!decoded.bom && !ascii) {
    grade = "RISK";
  } else {
    grade = "OK";
  }

  if (
    scheduled &&
    grade === "BROKEN" &&
    (opts.result || SCHEDULER_RESULT) === SCHEDULER_RESULT &&
    opts.logExists === false &&
    (opts.history || "completed") === "completed"
  ) {
    return {
      grade: "silent-schedule",
      parseErrors: tokens.errors.length,
      parseError,
      bom: decoded.bom,
      encoding: decoded.encoding,
      ascii,
      text: decoded.text,
      tokens,
      hex: firstBytesHex(b, 8),
      firstBytes: firstBytes(b, 3),
      result: SCHEDULER_RESULT,
      logExists: false,
      history: "completed",
      chips: [
        "silent-schedule",
        "0x80070001",
        "task-success",
        "parser-error",
        "no-bom",
      ],
    };
  }

  const chips = [];
  if (grade === "OK") chips.push("hallmarked");
  if (grade === "BROKEN") chips.push("misstruck", "parser-error", "string-terminator");
  if (grade === "RISK") chips.push("ps51-ansi");
  if (!decoded.bom && !ascii) chips.push("no-bom", "cp1252", "ps51-ansi");
  if (decoded.text.includes(RIGHT_DQ) || decoded.text.includes(LEFT_DQ)) {
    chips.push("mojibake-quote", "em-dash");
  }
  if (tokens.errors.length) chips.push("parser-error", "string-terminator");

  return {
    grade,
    parseErrors: tokens.errors.length,
    parseError,
    bom: decoded.bom,
    encoding: decoded.encoding,
    ascii,
    text: decoded.text,
    tokens,
    hex: firstBytesHex(b, 8),
    firstBytes: firstBytes(b, 3),
    chips: [...new Set(chips)],
  };
}

export function fixtureSource(id) {
  const table = {
    1: `Write-Host "report ${EM_DASH} nightly"`,
    2: `Write-Host "report ${EM_DASH} nightly"`,
    3: `$n = 1 ${EM_DASH} 2`,
    4: `Write-Host '${CYRILLIC_REPORT}'`,
    5: `# report ${EM_DASH} nightly`,
    6: `# ${CYRILLIC_REPORT}`,
    7: `# next ${ARROW} step`,
    8: `Write-Host "ok ${CHECK}"`,
    9: `Write-Host "ok"`,
    10: "---\nname: goldsmith\n",
    11: "---\nname: goldsmith\n",
    12: `Write-Host "report ${EM_DASH} nightly"`,
  };
  return table[id] || "";
}

export function buildFixture(id) {
  const source = fixtureSource(id);
  const raw = Buffer.from(source, "utf8");
  if (id === 2 || id === 10) {
    return Buffer.concat([Buffer.from(BOM), raw]);
  }
  return raw;
}

export function fixtureMeta(id) {
  const kinds = {
    1: { kind: "ps1", filename: "report.ps1" },
    2: { kind: "ps1", filename: "report.ps1" },
    3: { kind: "ps1", filename: "bare.ps1" },
    4: { kind: "ps1", filename: "cyrillic.ps1" },
    5: { kind: "ps1", filename: "comment-dash.ps1" },
    6: { kind: "ps1", filename: "comment-cyr.ps1" },
    7: { kind: "ps1", filename: "comment-arrow.ps1" },
    8: { kind: "ps1", filename: "emoji.ps1" },
    9: { kind: "ps1", filename: "ascii.ps1" },
    10: { kind: "agent.md", filename: "agent.md" },
    11: { kind: "agent.md", filename: "agent.md" },
    12: {
      kind: "ps1",
      filename: "report.ps1",
      scheduled: true,
      result: SCHEDULER_RESULT,
      logExists: false,
      history: "completed",
    },
  };
  return kinds[id] || { kind: "ps1" };
}

export const TABLE_EXPECT = Object.freeze([
  Object.freeze({
    id: 1,
    grade: "BROKEN",
    parseError: MISSING_DQ,
    parseErrors: 1,
  }),
  Object.freeze({ id: 2, grade: "OK", parseErrors: 0 }),
  Object.freeze({
    id: 3,
    grade: "BROKEN",
    parseError: MISSING_DQ,
    parseErrors: 1,
  }),
  Object.freeze({
    id: 4,
    grade: "BROKEN",
    parseError: MISSING_SQ,
    parseErrors: 1,
  }),
  Object.freeze({ id: 5, grade: "RISK", parseErrors: 0 }),
  Object.freeze({ id: 6, grade: "RISK", parseErrors: 0 }),
  Object.freeze({ id: 7, grade: "RISK", parseErrors: 0 }),
  Object.freeze({ id: 8, grade: "RISK", parseErrors: 0 }),
  Object.freeze({ id: 9, grade: "OK", parseErrors: 0 }),
  Object.freeze({ id: 10, grade: "SKIPPED" }),
  Object.freeze({ id: 11, grade: "REGISTERED" }),
  Object.freeze({ id: 12, grade: "silent-schedule" }),
]);

export function assayFixture(id) {
  return assay(buildFixture(id), fixtureMeta(id));
}

export function assayTable() {
  return TABLE_EXPECT.map((row) => ({
    ...row,
    result: assayFixture(row.id),
    bytes: buildFixture(row.id),
  }));
}

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
    bom: null,
    noBom: null,
    emDash: null,
    cp1252: null,
    parseError: null,
    scheduled: null,
    oppositeBom: null,
    asciiOnly: null,
    perExtension: null,
    taskSuccess: null,
    result: "",
    logExists: null,
    history: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedHallmarked();
}

export function seedHallmarked() {
  return {
    seed: IDLE_WORD,
    issue: null,
    bom: true,
    noBom: false,
    emDash: false,
    cp1252: false,
    parseError: false,
    scheduled: false,
    oppositeBom: false,
    asciiOnly: true,
    perExtension: true,
    taskSuccess: false,
    result: "",
    logExists: true,
    history: "",
    outputText:
      "BOM EF BB BF present, or ASCII-only; punches sit; scripts parse; hallmarked",
  };
}

export function seedMisstruck() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    os: OS_NAME,
    powershell: POWERSHELL,
    ansiCp: ANSI_CP,
    bom: false,
    noBom: true,
    emDash: true,
    cp1252: true,
    parseError: true,
    scheduled: true,
    oppositeBom: false,
    asciiOnly: false,
    perExtension: true,
    taskSuccess: true,
    result: SCHEDULER_RESULT,
    logExists: false,
    history: "completed",
    sameClass: [...SAME_CLASS],
    outputText:
      "Write-Host \"report — nightly\" UTF-8 no BOM; first bytes are not EF BB BF; CP1252 0x94 = U+201D; The string is missing the terminator: \"; scheduled result 0x80070001; logExists=false; history=completed; four-day armed-but-never-ran; 16 of 67 .ps1 non-ASCII no BOM",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.puncheon && typeof src.puncheon === "object" && src.puncheon) ||
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
    bom: firstBool(nested.bom, src.bom),
    noBom: firstBool(nested.noBom, nested.no_bom, src.noBom),
    emDash: firstBool(nested.emDash, nested.em_dash, src.emDash),
    cp1252: firstBool(nested.cp1252, src.cp1252),
    parseError: firstBool(
      nested.parseError,
      nested.parse_error,
      nested.parserError,
      src.parseError,
    ),
    scheduled: firstBool(nested.scheduled, src.scheduled),
    oppositeBom: firstBool(
      nested.oppositeBom,
      nested.opposite_bom,
      src.oppositeBom,
    ),
    asciiOnly: firstBool(nested.asciiOnly, nested.ascii_only, src.asciiOnly),
    perExtension: firstBool(
      nested.perExtension,
      nested.per_extension,
      src.perExtension,
    ),
    taskSuccess: firstBool(
      nested.taskSuccess,
      nested.task_success,
      src.taskSuccess,
    ),
    result: firstText(nested.result, src.result),
    logExists: firstBool(nested.logExists, nested.log_exists, src.logExists),
    history: firstText(nested.history, src.history),
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
  const missingCore =
    input.bom == null &&
    input.noBom == null &&
    input.emDash == null &&
    input.parseError == null &&
    input.asciiOnly == null;
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && missingCore) {
    return { ...seedMisstruck(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && missingCore) {
    return { ...seedMisstruck(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && missingCore) {
    return { ...seedHallmarked(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.seed].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const noBom =
    row.noBom === true ||
    row.bom === false ||
    /no[- ]bom|without a BOM|first bytes are not EF BB BF|BOM-less/i.test(text);
  const hasBom =
    row.bom === true ||
    /BOM EF BB BF present|starts EF BB BF|with-BOM/i.test(text);
  const emDash =
    row.emDash === true ||
    /em dash|em-dash|U\+2014|E2 80 94/i.test(text);
  const cp1252 =
    row.cp1252 === true ||
    /cp1252|CP 1252|ANSI CP 1252|0x94/i.test(text);
  const mojibakeQuote =
    /mojibake-quote|U\+201D|right double quotation/i.test(text) ||
    (emDash && noBom && cp1252);
  const parserError =
    row.parseError === true ||
    /parser-error|ParserError|missing the terminator/i.test(text);
  const stringTerminator =
    parserError || /string-terminator|missing the terminator/i.test(text);
  const scheduled =
    row.scheduled === true ||
    /silent-schedule|four-day|armed-but-never-ran|Task Scheduler/i.test(text);
  const code80070001 =
    row.result === SCHEDULER_RESULT ||
    /0x80070001|incorrect function/i.test(text);
  const taskSuccess =
    row.taskSuccess === true ||
    row.history === "completed" ||
    /action completed|task-success|history=completed/i.test(text);
  const oppositeBom =
    row.oppositeBom === true ||
    /opposite-bom|#73158|agent\.md starting EF BB BF|silently (prevents|skipped|invisible)/i.test(
      text,
    );
  const perExtension =
    row.perExtension === true ||
    /per-extension|per file type|\.ps1\/\.psm1/i.test(text);
  const ps51 =
    /ps51-ansi|PowerShell 5\.1|powershell\.exe|ANSI/i.test(text) ||
    (noBom && (emDash || cp1252));
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) && named !== IDLE_WORD && named !== SEEDED_WORD;
  const asciiOnly =
    row.asciiOnly === true ||
    (/ASCII-only|pure ASCII|punches sit|scripts parse/i.test(text) && !namedAlarm);
  const hallmarked =
    (hasBom || asciiOnly) &&
    !parserError &&
    !scheduled &&
    !oppositeBom &&
    !namedAlarm;
  const misstruck =
    !namedAlarm &&
    ((emDash && noBom && parserError) ||
      (row.seed === SEEDED_WORD && parserError) ||
      (noBom && emDash && cp1252 && parserError));
  return {
    noBom,
    hasBom,
    emDash,
    cp1252,
    mojibakeQuote,
    parserError,
    stringTerminator,
    scheduled,
    code80070001,
    taskSuccess,
    oppositeBom,
    perExtension,
    ps51,
    asciiOnly,
    hallmarked,
    misstruck,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.misstruck) chips.push("misstruck");
  if (flags.hallmarked) chips.push("hallmarked");
  if (flags.noBom && !flags.hallmarked) chips.push("no-bom");
  if (flags.mojibakeQuote && !flags.hallmarked) chips.push("mojibake-quote");
  if (flags.emDash && !flags.hallmarked) chips.push("em-dash");
  if (flags.cp1252 && !flags.hallmarked) chips.push("cp1252");
  if (flags.parserError && !flags.hallmarked) chips.push("parser-error");
  if (flags.scheduled && !flags.hallmarked) chips.push("silent-schedule");
  if (flags.code80070001 && !flags.hallmarked) chips.push("0x80070001");
  if (flags.perExtension) chips.push("per-extension");
  if (flags.oppositeBom) chips.push("opposite-bom");
  if (flags.ps51 && !flags.hallmarked) chips.push("ps51-ansi");
  if (flags.stringTerminator && !flags.hallmarked) chips.push("string-terminator");
  if (flags.taskSuccess && !flags.hallmarked) chips.push("task-success");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "hallmarked") {
    reasons.push("BOM EF BB BF present, or ASCII-only; punches sit; scripts parse");
    reasons.push("hold: this is a hallmarked sheet, not a misstruck puncheon");
  }
  if (flags.noBom) {
    reasons.push("Write tool emits .ps1 as UTF-8 without BOM; first bytes are not EF BB BF");
  }
  if (flags.emDash) {
    reasons.push("em dash U+2014 is UTF-8 E2 80 94");
  }
  if (flags.cp1252 || flags.mojibakeQuote) {
    reasons.push("byte 0x94 in CP1252 is U+201D right double quotation mark");
  }
  if (flags.parserError || flags.stringTerminator) {
    reasons.push(MISSING_DQ);
  }
  if (flags.scheduled || flags.code80070001) {
    reasons.push(
      "Task Scheduler result 0x80070001 (incorrect function); no transcript; no log; history shows action completed",
    );
  }
  if (flags.taskSuccess) {
    reasons.push("four-day armed-but-never-ran; every status surface said armed; ran zero times");
  }
  if (flags.oppositeBom) {
    reasons.push(
      "opposite-bom #73158: agent.md starting EF BB BF is silently skipped / invisible",
    );
  }
  if (flags.perExtension) {
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.ps51) {
    reasons.push(
      "Windows PowerShell 5.1 (powershell.exe 5.1.22621.6133, not pwsh 7) assays BOM-less as ANSI CP 1252",
    );
  }
  if (flags.misstruck) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags, chips) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.hallmarked) return "hallmarked";
  if (named === SEEDED_WORD) return "misstruck";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.misstruck) return "misstruck";
  if (flags.oppositeBom) return "opposite-bom";
  if (flags.scheduled && flags.code80070001) return "silent-schedule";
  if (flags.hallmarked) return "hallmarked";
  if (flags.parserError) return "parser-error";
  if (flags.stringTerminator) return "string-terminator";
  if (flags.mojibakeQuote) return "mojibake-quote";
  if (flags.emDash) return "em-dash";
  if (flags.cp1252) return "cp1252";
  if (flags.noBom) return "no-bom";
  if (flags.ps51) return "ps51-ansi";
  if (flags.taskSuccess) return "task-success";
  if (flags.code80070001) return "0x80070001";
  if (flags.perExtension) return "per-extension";
  return "hallmarked";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "hallmarked";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    hallmarked: verdict === "hallmarked" || flags.hallmarked,
    misstruck: verdict === "misstruck" || flags.misstruck,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    hex: {
      utf8: "E2 80 94",
      cp1252: "0x94",
      unicode: "U+201D",
      bom: "EF BB BF",
    },
    contrast: {
      punch: flags.emDash && flags.noBom
        ? "em-dash puncheon struck a quote into the gold"
        : "punches sit; the sheet is hallmarked",
      assay: flags.cp1252
        ? "PS 5.1 assays the metal as CP1252; 0x94 = U+201D"
        : flags.hasBom || flags.asciiOnly
          ? "BOM or ASCII; the reader knows the metal"
          : "metal not yet scored",
      schedule: flags.scheduled || flags.code80070001
        ? "0x80070001, no log, action completed, four-day armed"
        : "no silent schedule",
      opposite: flags.oppositeBom
        ? "agent.md with BOM is an invisible punch / #73158"
        : "agent front matter without BOM registers",
      note: flags.misstruck
        ? "An unstruck mark is not a hold. Score the gold or admit hallmarked."
        : flags.perExtension
          ? CONTRAST_NOTE
          : "Hallmarked: BOM present or ASCII-only; the punches sit.",
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
  if (name === SEEDED_WORD || name === 90962 || name === "90962") {
    return analyze(seedMisstruck());
  }
  if (name === IDLE_WORD || name === "hallmarked") {
    return analyze(seedHallmarked());
  }
  return analyze(seedHallmarked());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.misstruck
        ? `misstruck puncheon #${FEATURED_ISSUE}: Write-Host "report — nightly" UTF-8 no BOM; CP1252 0x94 = U+201D; ${MISSING_DQ}; scheduler ${SCHEDULER_RESULT}. ${HYPOTHESIS_NOTE}`
        : `hallmarked rack. Idle word ${IDLE_WORD}. BOM present or ASCII-only; the punches sit.`,
    },
  };
}

function readArgTicket(argv) {
  if (argv[2] === "--table") return { __table: true };
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
  if (ticket && ticket.__table) {
    const rows = assayTable().map((row) => ({
      id: row.id,
      grade: row.result.grade,
      parseError: row.result.parseError,
      parseErrors: row.result.parseErrors,
      hex: row.result.hex,
      bom: row.result.bom,
    }));
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    return rows;
  }
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
