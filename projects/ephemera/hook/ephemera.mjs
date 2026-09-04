#!/usr/bin/env node
/**
 * Ephemera — archive / wick-lit folio atelier classifier.
 * A ephemera that rewrites the whole folio when the five-minute
 * wick burns out mid-turn is not a warm cache — it is a bank
 * already rewritten. Score the wick or admit the folio already
 * rewritten.
 *
 *   echo '{"cache_read_input_tokens":33578,"cache_creation":{"ephemeral_5m_input_tokens":213484},"call":8}' | node ephemera.mjs
 *   node ephemera.mjs ticket.json
 *
 * Idle word is banked (HOLD: cache_read is the folio; ephemeral_5m
 * is only the new leaf; the five-minute wick still holds).
 * Seeded state is rewritten / #92090 (cache_creation ephemeral_5m
 * is huge and cache_read ≈ system prefix on a non-first call).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score usage-shaped fixtures for whether the wick banked the
 * folio or already reprinted it.
 *
 * Primary #92090: Fable 5.1 subagents re-cache their entire
 * context (200-430K tokens) turn after turn: the 5-minute
 * subagent TTL expires inside Fable 5.1's long turns.
 * Reporter lucascampolina. Filed 2026-09-04T13:49:33Z. OPEN.
 * Labels: bug, has repro, platform:macos, area:cost, area:agents.
 * Claude Code 2.1.258 (data); 2.1.260 installed. macOS 26
 * (Darwin 25.6.0). claude-fable-5-1. Max 20x. Session
 * 2026-09-03 15:24-16:21 UTC.
 *
 * Hypothesis only (NON-BINDING): background subagents sit on the
 * documented 5-minute ephemeral prompt-cache TTL; a single Fable
 * 5.1 turn (thinking + tools) often takes 5–10 minutes, so the
 * next request reprints the folio at cache-write rates. Discard
 * if issue evidence disagrees. Do not claim Claude Code source
 * you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "banked",
  "rewritten",
  "ephemeral-5m",
  "system-prefix",
  "cache-creation",
  "cache-read",
  "fable-5-1",
  "parallel-eight",
  "hold",
]);
export const IDLE_WORD = "banked";
export const SEEDED_WORD = "rewritten";
export const HOLD_VERDICTS = Object.freeze(["banked", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92090;
export const PRIMARY_ISSUES = Object.freeze([92090]);
export const COUSINS = Object.freeze([84289, 87215, 89621, 91289]);
export const COUSIN_ISSUE = 84289;
export const BACKUPS = Object.freeze([92089, 92074, 92076]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92090";
export const TITLE =
  "Fable 5.1 subagents re-cache their entire context (200-430K tokens) turn after turn: the 5-minute subagent TTL expires inside Fable 5.1's long turns. 8 parallel agents re-wrote 2.9M tokens in 40 min; 0 such rewrites on Opus 5 / Fable 5 subagents in the same week";
export const FILED_AT = "2026-09-04T13:49:33Z";
export const UPDATED_AT = "2026-09-04T13:50:34Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:cost",
  "area:agents",
]);
export const REPORTER = "lucascampolina";
export const PLATFORM = "macOS 26 (Darwin 25.6.0)";
export const CLI_VERSION = "2.1.258";
export const CLI_INSTALLED = "2.1.260";
export const ALSO_SEEN = Object.freeze(["2.1.255"]);
export const MODEL = "claude-fable-5-1";
export const PLAN = "Max 20x subscription";
export const SESSION_WINDOW = "2026-09-03 15:24-16:21 UTC";
export const SYSTEM_PREFIX = 33578;
export const TTL_SECONDS = 300;
export const TTL_BUCKET = "5m";
export const FULL_REWRITE_WRITE_MIN = 150000;
export const FULL_REWRITE_READ_MAX = 50000;
export const REWRITE_COUNT = 10;
export const REWRITE_TOKENS = 2884476;
export const PARALLEL_AGENTS = 8;
export const LIST_WRITE_USD_PER_MTOK = 12.5;
export const APPROX_USD = 36;
export const AREA = "area:cost";
export const EVIDENCE = "fable-5-1-subagent-5m-ephemeral-cache-rewrite";
export const HUB_LINE =
  "23:50 ephemera: a ephemera that rewrites the whole folio when the five-minute wick burns out mid-turn is not a warm cache — it is a bank already rewritten. Score the wick or admit the folio already rewritten.";
export const MARK = "23:50 / hermes catalog #137 / #92090";
export const PHRASE =
  "Score the wick or admit the folio already rewritten.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: background subagents sit on the documented 5-minute ephemeral prompt-cache TTL; a single Fable 5.1 turn (thinking + tools) often takes 5–10 minutes, so the next request reprints the folio at cache-write rates. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is 5-MINUTE EPHEMERAL SUBAGENT CACHE REWRITE under long Fable 5.1 turns. Claude Code 2.1.258 (data); 2.1.260 installed; also seen on 2.1.255. macOS 26 (Darwin 25.6.0). claude-fable-5-1 parent and subagents. Max 20x. Session 2026-09-03 15:24-16:21 UTC. 8 parallel research subagents. 10 full-context rewrites = 2.88M cache-write tokens in under 40 minutes (~$36 at $12.50/MTok). cache_read pinned at the shared system prefix 33,578; cache_creation.ephemeral_5m rewrites 213K–432K. Same-week: Fable 5 and Opus 5 subagents 0 such rewrites; Fable 5.1 had all 10. Reporter lucascampolina. Filed 2026-09-04. OPEN, bug, has repro, platform:macos, area:cost, area:agents. Not compaction (ullage/fathom/reveille). Not a cron fusee. Not Commutator sibling-slot stray. Not Hectograph OTEL scrub.";
export const HOLD_RESULT =
  "banked folio; cache_read is the conversation; ephemeral_5m is only the new leaf; idle word banked";
export const AFTER_REWRITE_READ = 304655;
export const AFTER_REWRITE_WRITE = 1595;
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const BANNED_NAMES = Object.freeze([
  "Clepsydra",
  "Fusee",
  "Ullage",
  "Fathom",
  "Reveille",
  "Tocsin",
  "Commutator",
  "Heddle",
  "Hectograph",
  "Placet",
  "Frisket",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Source Serif 4",
  "Libre Franklin",
  "JetBrains Mono",
  "Literata",
  "Manrope",
  "IBM Plex Mono",
  "IBM Plex",
  "Cormorant",
  "Fraunces",
  "Outfit",
  "Fira Code",
]);
export const NOT_PRODUCTS = Object.freeze([
  "clepsydra",
  "fusee",
  "ullage",
  "fathom",
  "reveille",
  "tocsin",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
]);
export const REQUEST_IDS = Object.freeze([
  "req_011Cegkz4G6pcp4BEBcMx6rf",
  "req_011CegnDk6hur3TpBiVRvN4q",
  "req_011CegngQGcCaZWFDeX27bDL",
  "req_011CegnitdUmztSGZ4bGCB8D",
  "req_011Cego5JuHbpDSJMVwt2Asm",
  "req_011Cego3ZRc6wkH66oMVNNoP",
  "req_011CegoBhEso5yJELccfnF52",
  "req_011CegoUp38R6HcmFZNVDyxf",
  "req_011CegodGZ3FfZ9eJ6APREGg",
  "req_011Cegog36FiqUspbW2DW9N8",
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

function usageOf(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.usage && typeof src.usage === "object" ? src.usage : {};
  const creation =
    (src.cache_creation && typeof src.cache_creation === "object" && src.cache_creation) ||
    (nested.cache_creation && typeof nested.cache_creation === "object" && nested.cache_creation) ||
    {};
  return {
    cacheRead: firstNum(
      nested.cache_read_input_tokens,
      src.cache_read_input_tokens,
      src.cacheRead,
    ),
    cacheCreation: firstNum(
      nested.cache_creation_input_tokens,
      src.cache_creation_input_tokens,
      src.cacheCreation,
      creation.ephemeral_5m_input_tokens,
    ),
    ephemeral5m: firstNum(
      creation.ephemeral_5m_input_tokens,
      src.ephemeral5m,
      src.cacheCreationEphemeral5m,
      nested.cache_creation_input_tokens,
      src.cache_creation_input_tokens,
    ),
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
    banked: null,
    rewritten: null,
    firstCall: null,
    call: null,
    agent: "",
    cache_read_input_tokens: null,
    cache_creation_input_tokens: null,
    cache_creation: null,
    ttlBucket: "",
    ttlSeconds: null,
    systemPrefix: null,
    gapMin: null,
    requestId: "",
    model: "",
    parallelAgents: null,
    rewriteCount: null,
    rewriteTokens: null,
    platform: "",
    cliVersion: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedBanked() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistHold: true,
    banked: true,
    rewritten: false,
    firstCall: false,
    call: 9,
    cache_read_input_tokens: AFTER_REWRITE_READ,
    cache_creation_input_tokens: AFTER_REWRITE_WRITE,
    cache_creation: { ephemeral_5m_input_tokens: AFTER_REWRITE_WRITE },
    ttlBucket: TTL_BUCKET,
    systemPrefix: SYSTEM_PREFIX,
    model: MODEL,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "banked; cache_read 304655 / cache_creation 1595; the folio held; idle word banked",
  };
}

export function seedRewritten() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistHold: false,
    banked: false,
    rewritten: true,
    firstCall: false,
    call: 8,
    agent: "a3ab40ae",
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 213484,
    cache_creation: { ephemeral_5m_input_tokens: 213484 },
    ttlBucket: TTL_BUCKET,
    ttlSeconds: TTL_SECONDS,
    systemPrefix: SYSTEM_PREFIX,
    gapMin: 3.5,
    requestId: REQUEST_IDS[0],
    model: MODEL,
    parallelAgents: PARALLEL_AGENTS,
    rewriteCount: REWRITE_COUNT,
    rewriteTokens: REWRITE_TOKENS,
    platform: PLATFORM,
    cliVersion: CLI_VERSION,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "rewritten; #92090; cache_read 0 / cache_creation.ephemeral_5m 213484 on call 8; five-minute wick burned out mid-turn; lucascampolina; 2.1.258; macOS 26; area:cost",
  };
}

export function seedEphemeral5m() {
  return {
    ...blankTicket(),
    seed: "ephemeral-5m",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 10,
    ttlBucket: TTL_BUCKET,
    ttlSeconds: TTL_SECONDS,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 271077,
    cache_creation: { ephemeral_5m_input_tokens: 271077 },
    outputText:
      "ephemeral-5m; subagent TTL bucket is 5m; a Fable 5.1 turn routinely outlasts the wick",
  };
}

export function seedSystemPrefix() {
  return {
    ...blankTicket(),
    seed: "system-prefix",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 9,
    systemPrefix: SYSTEM_PREFIX,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 212879,
    cache_creation: { ephemeral_5m_input_tokens: 212879 },
    outputText:
      "system-prefix; cache_read_input_tokens pinned at the shared system prefix 33578",
  };
}

export function seedCacheCreation() {
  return {
    ...blankTicket(),
    seed: "cache-creation",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 8,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 270587,
    cache_creation: { ephemeral_5m_input_tokens: 270587 },
    outputText:
      "cache-creation; usage.cache_creation.ephemeral_5m_input_tokens equals the whole conversation",
  };
}

export function seedCacheRead() {
  return {
    ...blankTicket(),
    seed: "cache-read",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 10,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 263804,
    cache_creation: { ephemeral_5m_input_tokens: 263804 },
    outputText:
      "cache-read; cache_read_input_tokens equals the system-prefix size on a non-first request",
  };
}

export function seedFable51() {
  return {
    ...blankTicket(),
    seed: "fable-5-1",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 12,
    model: MODEL,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 319053,
    cache_creation: { ephemeral_5m_input_tokens: 319053 },
    outputText:
      "fable-5-1; same-week comparison: Fable 5 and Opus 5 had 0 rewrites; Fable 5.1 had all 10",
  };
}

export function seedParallelEight() {
  return {
    ...blankTicket(),
    seed: "parallel-eight",
    source: "atelier",
    persistHold: false,
    rewritten: true,
    firstCall: false,
    call: 10,
    parallelAgents: PARALLEL_AGENTS,
    rewriteCount: REWRITE_COUNT,
    rewriteTokens: REWRITE_TOKENS,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation_input_tokens: 271077,
    cache_creation: { ephemeral_5m_input_tokens: 271077 },
    outputText:
      "parallel-eight; parent launched 8 research subagents; 10 full-context rewrites in under 40 minutes",
  };
}

export function seedHold() {
  return {
    ...seedBanked(),
    seed: "hold",
    outputText:
      "hold; the wick held; cache_read is the folio; ephemeral_5m is only the new leaf; idle word banked",
  };
}

export function seedCousin() {
  return {
    ...seedBanked(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #84289 docs vs reality on subagent TTL; #87215 parked-wake re-cache; #89621 multimodal re-cache; #91289 Fable 5.1 burning limits — cite only, not the #92090 five-minute wick rewrite",
  };
}

export function emptyTicket() {
  return seedBanked();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const usage = usageOf({ ...src, ...nested });
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    banked: firstBool(nested.banked, src.banked),
    rewritten: firstBool(nested.rewritten, src.rewritten),
    firstCall: firstBool(nested.firstCall, src.firstCall),
    call: firstNum(nested.call, src.call, src.callNumber),
    agent: firstText(nested.agent, src.agent),
    cache_read_input_tokens: usage.cacheRead,
    cache_creation_input_tokens: usage.cacheCreation,
    cache_creation:
      (nested.cache_creation && typeof nested.cache_creation === "object"
        ? nested.cache_creation
        : null) ||
      (src.cache_creation && typeof src.cache_creation === "object"
        ? src.cache_creation
        : usage.ephemeral5m != null
          ? { ephemeral_5m_input_tokens: usage.ephemeral5m }
          : null),
    ttlBucket: firstText(nested.ttlBucket, src.ttlBucket, src.ttl),
    ttlSeconds: firstNum(nested.ttlSeconds, src.ttlSeconds),
    systemPrefix: firstNum(nested.systemPrefix, src.systemPrefix),
    gapMin: firstNum(nested.gapMin, src.gapMin),
    requestId: firstText(nested.requestId, src.requestId),
    model: firstText(nested.model, src.model),
    parallelAgents: firstNum(nested.parallelAgents, src.parallelAgents),
    rewriteCount: firstNum(nested.rewriteCount, src.rewriteCount),
    rewriteTokens: firstNum(nested.rewriteTokens, src.rewriteTokens),
    platform: firstText(nested.platform, src.platform),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
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
  const usage = usageOf(row);
  return (
    row.persistHold == null &&
    row.banked == null &&
    row.rewritten == null &&
    usage.cacheRead == null &&
    usage.ephemeral5m == null &&
    usage.cacheCreation == null &&
    row.call == null &&
    row.firstCall == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedBanked,
  [SEEDED_WORD]: seedRewritten,
  "ephemeral-5m": seedEphemeral5m,
  "system-prefix": seedSystemPrefix,
  "cache-creation": seedCacheCreation,
  "cache-read": seedCacheRead,
  "fable-5-1": seedFable51,
  "parallel-eight": seedParallelEight,
  hold: seedHold,
  cousin: seedCousin,
  84289: seedCousin,
  87215: seedCousin,
  89621: seedCousin,
  91289: seedCousin,
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
    return { ...seedRewritten(), ...cloned, ...raw };
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
    ticket.model,
    ticket.ttlBucket,
    ticket.requestId,
    ticket.agent,
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
    ephemeral5m: "ephemeral-5m",
    "ephemeral_5m": "ephemeral-5m",
    fable51: "fable-5-1",
    "fable-5.1": "fable-5-1",
    parallel8: "parallel-eight",
    "parallel-8": "parallel-eight",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function ephemeralOf(ticket) {
  const usage = usageOf(ticket);
  return usage.ephemeral5m;
}

export function cacheReadOf(ticket) {
  return usageOf(ticket).cacheRead;
}

export function isFirstCall(ticket) {
  if (ticket.firstCall === true) return true;
  if (ticket.firstCall === false) return false;
  if (ticket.call === 1) return true;
  return false;
}

export function nearSystemPrefix(read) {
  if (read == null) return false;
  return read <= FULL_REWRITE_READ_MAX && (read === 0 || Math.abs(read - SYSTEM_PREFIX) <= 32);
}

export function rewritePattern(ticket) {
  const usage = usageOf(ticket);
  const write = usage.ephemeral5m ?? usage.cacheCreation;
  const read = usage.cacheRead;
  if (isFirstCall(ticket)) return false;
  if (ticket.rewritten === true) return true;
  if (write == null || read == null) return false;
  return write >= FULL_REWRITE_WRITE_MIN && nearSystemPrefix(read);
}

export function bankedPattern(ticket) {
  const usage = usageOf(ticket);
  const write = usage.ephemeral5m ?? usage.cacheCreation;
  const read = usage.cacheRead;
  if (ticket.banked === true && ticket.rewritten !== true) return true;
  if (read == null || write == null) return false;
  return read > FULL_REWRITE_READ_MAX && write < FULL_REWRITE_WRITE_MIN;
}

export function isBanked(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.rewritten !== true && bankedPattern(row)) {
    return true;
  }
  if (bankedPattern(row) && row.rewritten !== true && !rewritePattern(row)) {
    return true;
  }
  return false;
}

export function isRewritten(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (rewritePattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#84289|#87215|#89621|#91289/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const rewrittenNow = !cousinOnly && isRewritten(row);
  const bankedNow = !rewrittenNow && isBanked(row);
  const ephemeral5m =
    named === "ephemeral-5m" ||
    row.ttlBucket === TTL_BUCKET ||
    row.ttlSeconds === TTL_SECONDS ||
    /ephemeral_5m|ephemeral-5m|five-minute|5m TTL|5-minute/i.test(text);
  const systemPrefix =
    named === "system-prefix" ||
    row.cache_read_input_tokens === SYSTEM_PREFIX ||
    row.systemPrefix === SYSTEM_PREFIX ||
    /system-prefix|system prefix|33,?578/i.test(text);
  const cacheCreation =
    named === "cache-creation" ||
    (ephemeralOf(row) != null && ephemeralOf(row) >= FULL_REWRITE_WRITE_MIN) ||
    /cache-creation|cache_creation|ephemeral_5m_input_tokens/i.test(text);
  const cacheRead =
    named === "cache-read" ||
    nearSystemPrefix(row.cache_read_input_tokens) ||
    /cache-read|cache_read_input_tokens/i.test(text);
  const fable51 =
    named === "fable-5-1" ||
    row.model === MODEL ||
    /fable-5-1|fable 5\.1|claude-fable-5-1/i.test(text);
  const parallelEight =
    named === "parallel-eight" ||
    row.parallelAgents === PARALLEL_AGENTS ||
    /parallel-eight|8 (parallel |research )?subagents|8 parallel/i.test(text);
  const rewritten =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (rewrittenNow || named === SEEDED_WORD || /rewritten|#92090/i.test(text));
  const banked = HOLD_VERDICTS.includes(named) || (bankedNow && !rewritten);
  return {
    named,
    cousinOnly,
    rewrittenNow,
    bankedNow,
    ephemeral5m,
    systemPrefix,
    cacheCreation,
    cacheRead,
    fable51,
    parallelEight,
    rewritten,
    banked,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.banked && !flags.rewritten) chips.push("banked");
  if (flags.rewritten) chips.push("rewritten");
  if (flags.ephemeral5m && flags.rewritten) chips.push("ephemeral-5m");
  if (flags.systemPrefix && flags.rewritten) chips.push("system-prefix");
  if (flags.cacheCreation && flags.rewritten) chips.push("cache-creation");
  if (flags.cacheRead && flags.rewritten) chips.push("cache-read");
  if (flags.fable51 && flags.rewritten) chips.push("fable-5-1");
  if (flags.parallelEight && flags.rewritten) chips.push("parallel-eight");
  if ((flags.banked || flags.named === "hold") && !flags.rewritten) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "banked") {
    reasons.push(
      "banked; cache_read is the folio; ephemeral_5m is only the new leaf; the five-minute wick still holds",
    );
    reasons.push("hold: the wick banked the folio; idle word banked");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; the wick held; cache_read is the folio; ephemeral_5m is only the new leaf",
    );
  }
  if (verdict === "rewritten" || flags.rewritten) {
    reasons.push(
      "rewritten; #92090; cache_creation.ephemeral_5m is huge and cache_read ≈ system prefix on a non-first call; the five-minute wick burned out mid-turn",
    );
  }
  if (verdict === "ephemeral-5m" || (flags.ephemeral5m && flags.rewritten)) {
    reasons.push(
      "ephemeral-5m; subagent TTL bucket is 5m; a Fable 5.1 turn (thinking + tools) routinely takes 5–10 minutes",
    );
  }
  if (verdict === "system-prefix" || (flags.systemPrefix && flags.rewritten)) {
    reasons.push(
      "system-prefix; cache_read_input_tokens pinned at the shared system prefix 33,578",
    );
  }
  if (verdict === "cache-creation" || (flags.cacheCreation && flags.rewritten)) {
    reasons.push(
      "cache-creation; usage.cache_creation.ephemeral_5m_input_tokens equals the whole conversation (213K–432K)",
    );
  }
  if (verdict === "cache-read" || (flags.cacheRead && flags.rewritten)) {
    reasons.push(
      "cache-read; cache_read_input_tokens equals the system-prefix size on a non-first request",
    );
  }
  if (verdict === "fable-5-1" || (flags.fable51 && flags.rewritten)) {
    reasons.push(
      "fable-5-1; same-week comparison: Fable 5 and Opus 5 subagents had 0 such rewrites; Fable 5.1 had all 10",
    );
  }
  if (verdict === "parallel-eight" || (flags.parallelEight && flags.rewritten)) {
    reasons.push(
      "parallel-eight; 8 research subagents; 10 full-context rewrites = 2.88M tokens in under 40 minutes",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Ephemera; cite-only #84289 (docs vs reality on subagent TTL), #87215 (parked-wake re-cache), #89621 (multimodal re-cache), #91289 (Fable 5.1 burning limits) — different surfaces from #92090 five-minute wick rewrite; primary stays #92090",
    );
  }
  if (verdict === "rewritten" || flags.rewritten) {
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
  if (named === IDLE_WORD && (flags.banked || !flags.rewritten)) return "banked";
  if (named === "hold" && !flags.rewritten) return "hold";
  if (named === SEEDED_WORD) return "rewritten";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "banked";
  if (flags.rewritten) return "rewritten";
  if (flags.banked) return "banked";
  return "banked";
}

function deskOf(flags, ticket, verdict) {
  const usage = usageOf(ticket);
  if (verdict === "rewritten" || flags.rewritten) {
    return {
      case: "rewritten — five-minute wick burned out mid-turn",
      ttl: ticket.ttlBucket || TTL_BUCKET,
      cacheRead: usage.cacheRead ?? SYSTEM_PREFIX,
      ephemeral5m: usage.ephemeral5m ?? usage.cacheCreation ?? 213484,
      call: ticket.call ?? 8,
      mark: "ephemera rewritten; admit the folio already rewritten",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — the wick held the folio",
      ttl: TTL_BUCKET,
      cacheRead: usage.cacheRead ?? AFTER_REWRITE_READ,
      ephemeral5m: usage.ephemeral5m ?? AFTER_REWRITE_WRITE,
      call: ticket.call ?? 2,
      mark: "ephemera hold; the wick banks",
      note: "Hold: the wick banks.",
    };
  }
  return {
    case: "banked — cache_read is the folio; ephemeral_5m is only the new leaf",
    ttl: TTL_BUCKET,
    cacheRead: usage.cacheRead ?? AFTER_REWRITE_READ,
    ephemeral5m: usage.ephemeral5m ?? AFTER_REWRITE_WRITE,
    call: ticket.call ?? 9,
    mark: "ephemera banked; idle word banked",
    note: "Banked: the wick still holds the folio.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const rewritten = verdict === "rewritten" || flags.rewritten;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    banked: verdict === "banked" || (flags.banked && !rewritten),
    rewritten,
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
  if (name === SEEDED_WORD || name === 92090 || name === "92090") {
    return analyze(seedRewritten());
  }
  if (name === "ephemeral-5m" || name === "ephemeral5m") {
    return analyze(seedEphemeral5m());
  }
  if (name === "system-prefix") return analyze(seedSystemPrefix());
  if (name === "cache-creation") return analyze(seedCacheCreation());
  if (name === "cache-read") return analyze(seedCacheRead());
  if (name === "fable-5-1" || name === "fable51") return analyze(seedFable51());
  if (name === "parallel-eight" || name === "parallel-8") {
    return analyze(seedParallelEight());
  }
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "banked" || name === "open") {
    return analyze(seedBanked());
  }
  if (
    name === 84289 ||
    name === "84289" ||
    name === 87215 ||
    name === "87215" ||
    name === 89621 ||
    name === "89621" ||
    name === 91289 ||
    name === "91289" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedBanked());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "rewritten" || (result.rewritten && result.alarm)
          ? `rewritten ephemera #${FEATURED_ISSUE}: cache_creation.ephemeral_5m reprinted the folio after the five-minute wick burned out mid-turn. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. The wick banked the folio. Score the wick."
            : `banked ephemera. Idle word ${IDLE_WORD}. cache_read is the folio; ephemeral_5m is only the new leaf.`,
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
