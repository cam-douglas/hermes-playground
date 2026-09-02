#!/usr/bin/env node
/**
 * Annunciator — industrial annunciator / false-alarm panel atelier classifier.
 * An annunciator that lights for a helper is not a trip.
 * Dark the board or admit the turn never ran.
 *
 *   echo '{"helperForkStopFailure":true,"parentSessionStamp":true}' | node annunciator.mjs
 *   node annunciator.mjs ticket.json
 *
 * Idle word is dark (HOLD: board stays dark until real main turn ends
 * on API error).
 * Seeded state is spurious / #91419 (StopFailure fires for helper
 * forks and background subagent 429s on the parent session_id;
 * /low-priority idle prompt rains failures; 14 hooks/~1min).
 * NEVER idle as sealed / rebound / fenced / swept / tolled / mute /
 * honored / discarded / arrested / skipped / indexed / jumped /
 * chocked / rolled / clasped / sprung / drained / hinged / pealed /
 * warded / pooled / cased / aired / sifted / stocked / stationed /
 * marvered / unpinned / rinsed / literal / choked / opened / stalled /
 * fused / forged / attributed.
 *
 * Primary #91419: StopFailure documented as "the turn ended on an
 * API error" also fires for API errors in internal helper queries
 * (prompt_suggestion, away_summary, extract_memories, agent_summary;
 * skipTranscript: true) and background subagent failures, always
 * with the parent session_id. Measured: nine background agents;
 * seven died on 429; fourteen StopFailure hooks in about a minute
 * for one underlying limit. After /low-priority: parked, no user
 * input; further StopFailure ~20–30s apart (error: rate_limit);
 * no transcript line. Bundle 2.1.258: helper forks share the main
 * query generator; API-error exit emits StopFailure via session.id;
 * only delegated-observation skipped; low-priority retry allow-list
 * excludes helpers → 429 returns null → spurious StopFailure.
 * Payload: error, error_details, last_assistant_message — no
 * querySource / agent_id. Asks: do not fire from skipTranscript
 * forks / non-main querySources; OR add query_source (+ agent_id);
 * look at the 2N cascade. Claude Code 2.1.258, Windows 11;
 * Interactive REPL, bypassPermissions, /low-priority.
 * Reporter KamilDev. Filed 2026-09-02T07:17:32Z. OPEN. Labels:
 * bug, has repro, platform:windows, area:hooks, area:agents.
 *
 * Hypothesis only (NON-BINDING): the shared query generator may
 * treat every API-error exit as a main-turn death because the
 * payload never carries query_source, and /low-priority may return
 * null for helpers instead of waiting. Do not claim a root cause
 * in Claude Code source you have not seen. Verify against the
 * issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the board is dark or spurious.
 *
 * NOT Caisson #91405 (Desktop worktree pool reseats the wrong hull).
 * NOT Spindle #91402 (startup cleanup deletes live sibling Bash
 * task outputs under shared temp).
 * NOT Knell #91298 (opposite polarity — Agent-tool custom child
 * silent death after Spawned successfully).
 * NOT Tumbler #74256 (PermissionRequest ExitPlanMode allow discarded).
 * NOT Escapement / Geneva / Scotch / Carillon / Pintle / Fibula /
 * Virgule / Riddle / Garner / Postern / Sluice.
 * NOT Spigot / Clevis / Effigy.
 * NOT Sapper #89251.
 * NOT #87972 alone (cousin: stall path moved to StopFailure whose
 * decision output is ignored).
 * NOT leftover woodworking / mm-slider / millrace / locksmith /
 * campanology / berth clones.
 * Product name stays Annunciator. Do not rename to Caisson /
 * Spindle / Knell / Tumbler / Escapement / Geneva / Scotch /
 * Fibula / Virgule / Riddle / Garner / Pintle / Carillon /
 * Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp /
 * Berth / Bollard.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "dark",
  "spurious",
  "helper-fork-stopfailure",
  "subagent-429-parent",
  "low-priority-idle-drip",
  "fourteen-hooks-cascade",
  "missing-query-source",
  "skip-transcript-fork",
  "rate-limit-null-retry",
  "delegated-observation-skip",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "dark";
export const SEEDED_WORD = "spurious";
export const HOLD_VERDICTS = Object.freeze(["dark", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91419;
export const PRIMARY_ISSUES = Object.freeze([91419]);
export const COUSINS = Object.freeze([87972, 91414, 91408, 91396]);
export const COUSIN_ISSUE = 87972;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const BACKUPS = Object.freeze([
  { name: "Fid", issue: 88747 },
  { name: "Toggle", issue: 91422 },
  { name: "Collet", issue: 53940 },
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "sapper",
  "spigot",
  "clevis",
  "effigy",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "berth clones",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91419";
export const TITLE =
  "StopFailure fires for internal helper queries and subagent failures on the parent session";
export const FILED_AT = "2026-09-02T07:17:32Z";
export const UPDATED_AT = "2026-09-02T07:18:29Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:hooks",
  "area:agents",
]);
export const REPORTER = "KamilDev";
export const VERSION = "Claude Code 2.1.258";
export const PLATFORM = "Windows 11";
export const HELPERS = Object.freeze([
  "prompt_suggestion",
  "away_summary",
  "extract_memories",
  "agent_summary",
]);
export const BACKGROUND_AGENTS = 9;
export const DIED_ON_429 = 7;
export const STOPFAILURE_HOOKS = 14;
export const CASCADE_WINDOW = "about a minute";
export const DRIP_SECONDS_MIN = 20;
export const DRIP_SECONDS_MAX = 30;
export const STOPFAILURE_MEANING = "the turn ended on an API error";
export const SKIP_TRANSCRIPT = true;
export const PARENT_SESSION_STAMP = "parent session_id";
export const RATE_LIMIT_ERROR = "rate_limit";
export const PAYLOAD_FIELDS = Object.freeze([
  "error",
  "error_details",
  "last_assistant_message",
]);
export const MISSING_PAYLOAD_FIELDS = Object.freeze([
  "querySource",
  "query_source",
  "agent_id",
]);
export const LOW_PRIORITY_TOKEN = "/low-priority";
export const BYPASS_PERMISSIONS = "bypassPermissions";
export const INTERACTIVE_REPL = "Interactive REPL";
export const TWO_N_CASCADE = "2N";
export const HUB_LINE =
  "17:50 annunciator: an annunciator that lights for a helper is not a trip. Dark the board or admit the turn never ran.";
export const MARK = "17:50 / hermes catalog #118 / #91419";
export const PHRASE =
  "an annunciator that lights for a helper is not a trip. Dark the board or admit the turn never ran.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: the shared query generator may treat every API-error exit as a main-turn death because the payload never carries query_source, and /low-priority may return null for helpers instead of waiting. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is STOPFAILURE FALSELY FIRES FOR INTERNAL HELPER FORKS AND BACKGROUND SUBAGENT 429s ON THE PARENT SESSION_ID; UNDER /LOW-PRIORITY IDLE PROMPT RAINS SPURIOUS FAILURES; 14 HOOKS/~1min; 2.1.258 WINDOWS. Documented meaning of StopFailure: the turn ended on an API error. Helpers: prompt_suggestion, away_summary, extract_memories, agent_summary (skipTranscript: true). Nine background agents; seven died on 429; fourteen StopFailure hooks in about a minute. After /low-priority: parked, no user input; further StopFailure ~20–30s apart (error: rate_limit); no transcript line. Payload: error, error_details, last_assistant_message — no querySource / agent_id. Interactive REPL, bypassPermissions, /low-priority. Reporter KamilDev.";
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "rebound",
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
  "Sapper",
  "Spigot",
  "Clevis",
  "Effigy",
]);
export const FORBIDDEN_UI = Object.freeze([
  "floating gate",
  "pool basin",
  "wash spray",
  "chip-sweep ways",
  "funeral bell rope",
  "pin-tumbler keyway desk",
  "maltese-cross geneva",
  "wagon scotch-block",
  "composing stick case",
  "riddle-sieve mesh",
  "grain loft garner",
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
    boardDark: null,
    mainTurnOnly: null,
    helperForkStopFailure: null,
    skipTranscript: null,
    parentSessionStamp: null,
    subagent429Parent: null,
    lowPriorityIdleDrip: null,
    fourteenHooksCascade: null,
    missingQuerySource: null,
    rateLimitNullRetry: null,
    delegatedObservationSkip: null,
    hasClearRepro: null,
    querySourcePresent: null,
    agentIdPresent: null,
    helpers: [],
    backgroundAgents: null,
    diedOn429: null,
    stopFailureHooks: null,
    dripSecondsMin: null,
    dripSecondsMax: null,
    cascadeWindow: "",
    version: "",
    platform: "",
    reporter: "",
    bypassPermissions: null,
    lowPriority: null,
    interactiveRepl: null,
    payloadHasError: null,
    payloadHasErrorDetails: null,
    payloadHasLastAssistant: null,
    noTranscriptLine: null,
    waitingOnAgents: null,
    twoNCascade: null,
    outputText: "",
  };
}

export function seedDark() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    boardDark: true,
    mainTurnOnly: true,
    helperForkStopFailure: false,
    skipTranscript: true,
    parentSessionStamp: false,
    subagent429Parent: false,
    lowPriorityIdleDrip: false,
    fourteenHooksCascade: false,
    missingQuerySource: false,
    rateLimitNullRetry: false,
    delegatedObservationSkip: true,
    hasClearRepro: false,
    querySourcePresent: true,
    agentIdPresent: true,
    helpers: [...HELPERS],
    backgroundAgents: 0,
    diedOn429: 0,
    stopFailureHooks: 0,
    dripSecondsMin: 0,
    dripSecondsMax: 0,
    cascadeWindow: "",
    version: VERSION,
    platform: PLATFORM,
    reporter: "",
    bypassPermissions: true,
    lowPriority: true,
    interactiveRepl: true,
    payloadHasError: false,
    payloadHasErrorDetails: false,
    payloadHasLastAssistant: false,
    noTranscriptLine: false,
    waitingOnAgents: 0,
    twoNCascade: false,
    outputText:
      "dark; board stays dark until the real main turn ends on an API error; helper forks do not light; skipTranscript forks stay off the parent session_id; idle word dark",
  };
}

export function seedSpurious() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    boardDark: false,
    mainTurnOnly: false,
    helperForkStopFailure: true,
    skipTranscript: true,
    parentSessionStamp: true,
    subagent429Parent: true,
    lowPriorityIdleDrip: true,
    fourteenHooksCascade: true,
    missingQuerySource: true,
    rateLimitNullRetry: true,
    delegatedObservationSkip: true,
    hasClearRepro: true,
    querySourcePresent: false,
    agentIdPresent: false,
    helpers: [...HELPERS],
    backgroundAgents: BACKGROUND_AGENTS,
    diedOn429: DIED_ON_429,
    stopFailureHooks: STOPFAILURE_HOOKS,
    dripSecondsMin: DRIP_SECONDS_MIN,
    dripSecondsMax: DRIP_SECONDS_MAX,
    cascadeWindow: CASCADE_WINDOW,
    version: VERSION,
    platform: PLATFORM,
    reporter: REPORTER,
    bypassPermissions: true,
    lowPriority: true,
    interactiveRepl: true,
    payloadHasError: true,
    payloadHasErrorDetails: true,
    payloadHasLastAssistant: true,
    noTranscriptLine: true,
    waitingOnAgents: BACKGROUND_AGENTS,
    twoNCascade: true,
    outputText:
      "spurious; #91419; StopFailure fires for helper forks and background subagent 429s on the parent session_id; prompt_suggestion, away_summary, extract_memories, agent_summary; skipTranscript: true; nine background agents; seven died on 429; fourteen StopFailure hooks in about a minute; /low-priority idle drip ~20–30s (error: rate_limit); no querySource / agent_id; 2.1.258 Windows; KamilDev",
  };
}

export function seedHelperForkStopfailure() {
  return {
    ...blankTicket(),
    seed: "helper-fork-stopfailure",
    source: "atelier",
    helperForkStopFailure: true,
    skipTranscript: true,
    parentSessionStamp: true,
    helpers: [...HELPERS],
    missingQuerySource: true,
    querySourcePresent: false,
    outputText:
      "helper-fork-stopfailure; StopFailure lights for prompt_suggestion, away_summary, extract_memories, agent_summary (skipTranscript: true) on the parent session_id",
  };
}

export function seedSubagent429Parent() {
  return {
    ...blankTicket(),
    seed: "subagent-429-parent",
    source: "atelier",
    subagent429Parent: true,
    parentSessionStamp: true,
    diedOn429: DIED_ON_429,
    waitingOnAgents: BACKGROUND_AGENTS,
    outputText:
      "subagent-429-parent; background subagent 429 deaths stamp the parent session_id",
  };
}

export function seedLowPriorityIdleDrip() {
  return {
    ...blankTicket(),
    seed: "low-priority-idle-drip",
    source: "atelier",
    lowPriorityIdleDrip: true,
    lowPriority: true,
    noTranscriptLine: true,
    dripSecondsMin: DRIP_SECONDS_MIN,
    dripSecondsMax: DRIP_SECONDS_MAX,
    outputText:
      "low-priority-idle-drip; after /low-priority parked with no user input; further StopFailure ~20–30s apart (error: rate_limit); no transcript line",
  };
}

export function seedFourteenHooksCascade() {
  return {
    ...blankTicket(),
    seed: "fourteen-hooks-cascade",
    source: "atelier",
    fourteenHooksCascade: true,
    backgroundAgents: BACKGROUND_AGENTS,
    diedOn429: DIED_ON_429,
    stopFailureHooks: STOPFAILURE_HOOKS,
    twoNCascade: true,
    waitingOnAgents: BACKGROUND_AGENTS,
    cascadeWindow: CASCADE_WINDOW,
    outputText:
      "fourteen-hooks-cascade; nine background agents; seven died on 429; fourteen StopFailure hooks in about a minute for one underlying limit; 2N cascade",
  };
}

export function seedMissingQuerySource() {
  return {
    ...blankTicket(),
    seed: "missing-query-source",
    source: "atelier",
    missingQuerySource: true,
    querySourcePresent: false,
    agentIdPresent: false,
    payloadHasError: true,
    payloadHasErrorDetails: true,
    payloadHasLastAssistant: true,
    outputText:
      "missing-query-source; payload is error, error_details, last_assistant_message — no querySource / agent_id",
  };
}

export function seedSkipTranscriptFork() {
  return {
    ...blankTicket(),
    seed: "skip-transcript-fork",
    source: "atelier",
    skipTranscript: true,
    helperForkStopFailure: true,
    helpers: [...HELPERS],
    outputText:
      "skip-transcript-fork; helper forks (skipTranscript: true) still emit StopFailure",
  };
}

export function seedRateLimitNullRetry() {
  return {
    ...blankTicket(),
    seed: "rate-limit-null-retry",
    source: "atelier",
    rateLimitNullRetry: true,
    lowPriority: true,
    outputText:
      "rate-limit-null-retry; low-priority retry allow-list excludes helpers → 429 returns null → spurious StopFailure",
  };
}

export function seedDelegatedObservationSkip() {
  return {
    ...blankTicket(),
    seed: "delegated-observation-skip",
    source: "atelier",
    delegatedObservationSkip: true,
    helperForkStopFailure: true,
    outputText:
      "delegated-observation-skip; only delegated-observation is skipped; helper forks still fire StopFailure",
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
    version: VERSION,
    platform: PLATFORM,
    backgroundAgents: BACKGROUND_AGENTS,
    diedOn429: DIED_ON_429,
    stopFailureHooks: STOPFAILURE_HOOKS,
    outputText:
      "has-clear-repro; KamilDev filed #91419; has repro; 9/7/14; Claude Code 2.1.258; Windows 11; Interactive REPL; bypassPermissions; /low-priority",
  };
}

export function seedHold() {
  return {
    ...seedDark(),
    seed: "hold",
    outputText:
      "hold; board stays dark until the real main turn ends on an API error; helper forks do not light; the annunciator is dark",
  };
}

export function seedCousin() {
  return {
    ...seedDark(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #87972 Stop hook no longer fires on stream-stall-terminated turns — StopFailure fires instead but its decision output is ignored; cite only, not the #91419 helper-fork false-alarm",
  };
}

export function emptyTicket() {
  return seedDark();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const helpers = Array.isArray(nested.helpers)
    ? nested.helpers
    : Array.isArray(src.helpers)
      ? src.helpers
      : [];
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    boardDark: firstBool(nested.boardDark, src.boardDark),
    mainTurnOnly: firstBool(nested.mainTurnOnly, src.mainTurnOnly),
    helperForkStopFailure: firstBool(
      nested.helperForkStopFailure,
      src.helperForkStopFailure,
    ),
    skipTranscript: firstBool(nested.skipTranscript, src.skipTranscript),
    parentSessionStamp: firstBool(
      nested.parentSessionStamp,
      src.parentSessionStamp,
    ),
    subagent429Parent: firstBool(
      nested.subagent429Parent,
      src.subagent429Parent,
    ),
    lowPriorityIdleDrip: firstBool(
      nested.lowPriorityIdleDrip,
      src.lowPriorityIdleDrip,
    ),
    fourteenHooksCascade: firstBool(
      nested.fourteenHooksCascade,
      src.fourteenHooksCascade,
    ),
    missingQuerySource: firstBool(
      nested.missingQuerySource,
      src.missingQuerySource,
    ),
    rateLimitNullRetry: firstBool(
      nested.rateLimitNullRetry,
      src.rateLimitNullRetry,
    ),
    delegatedObservationSkip: firstBool(
      nested.delegatedObservationSkip,
      src.delegatedObservationSkip,
    ),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    querySourcePresent: firstBool(
      nested.querySourcePresent,
      src.querySourcePresent,
    ),
    agentIdPresent: firstBool(nested.agentIdPresent, src.agentIdPresent),
    helpers: helpers.map(String),
    backgroundAgents: firstNum(nested.backgroundAgents, src.backgroundAgents),
    diedOn429: firstNum(nested.diedOn429, src.diedOn429),
    stopFailureHooks: firstNum(nested.stopFailureHooks, src.stopFailureHooks),
    dripSecondsMin: firstNum(nested.dripSecondsMin, src.dripSecondsMin),
    dripSecondsMax: firstNum(nested.dripSecondsMax, src.dripSecondsMax),
    cascadeWindow: firstText(nested.cascadeWindow, src.cascadeWindow),
    version: firstText(nested.version, src.version),
    platform: firstText(nested.platform, src.platform),
    reporter: firstText(nested.reporter, src.reporter),
    bypassPermissions: firstBool(
      nested.bypassPermissions,
      src.bypassPermissions,
    ),
    lowPriority: firstBool(nested.lowPriority, src.lowPriority),
    interactiveRepl: firstBool(nested.interactiveRepl, src.interactiveRepl),
    payloadHasError: firstBool(nested.payloadHasError, src.payloadHasError),
    payloadHasErrorDetails: firstBool(
      nested.payloadHasErrorDetails,
      src.payloadHasErrorDetails,
    ),
    payloadHasLastAssistant: firstBool(
      nested.payloadHasLastAssistant,
      src.payloadHasLastAssistant,
    ),
    noTranscriptLine: firstBool(nested.noTranscriptLine, src.noTranscriptLine),
    waitingOnAgents: firstNum(nested.waitingOnAgents, src.waitingOnAgents),
    twoNCascade: firstBool(nested.twoNCascade, src.twoNCascade),
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
    row.boardDark == null &&
    row.mainTurnOnly == null &&
    row.helperForkStopFailure == null &&
    row.subagent429Parent == null &&
    row.lowPriorityIdleDrip == null &&
    row.fourteenHooksCascade == null &&
    row.missingQuerySource == null &&
    row.rateLimitNullRetry == null &&
    row.parentSessionStamp == null &&
    row.skipTranscript == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedDark,
  [SEEDED_WORD]: seedSpurious,
  "helper-fork-stopfailure": seedHelperForkStopfailure,
  "subagent-429-parent": seedSubagent429Parent,
  "low-priority-idle-drip": seedLowPriorityIdleDrip,
  "fourteen-hooks-cascade": seedFourteenHooksCascade,
  "missing-query-source": seedMissingQuerySource,
  "skip-transcript-fork": seedSkipTranscriptFork,
  "rate-limit-null-retry": seedRateLimitNullRetry,
  "delegated-observation-skip": seedDelegatedObservationSkip,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  87972: seedCousin,
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
    return { ...seedSpurious(), ...cloned, ...raw };
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
    ticket.version,
    ticket.platform,
    ...(ticket.helpers || []),
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

export function isDark(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.boardDark === true &&
    row.mainTurnOnly === true &&
    row.helperForkStopFailure !== true &&
    row.subagent429Parent !== true &&
    row.lowPriorityIdleDrip !== true &&
    row.fourteenHooksCascade !== true
  ) {
    return true;
  }
  return false;
}

export function isSpurious(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.helperForkStopFailure === true && row.parentSessionStamp === true) ||
    (row.fourteenHooksCascade === true &&
      row.stopFailureHooks === STOPFAILURE_HOOKS) ||
    (row.lowPriorityIdleDrip === true && row.noTranscriptLine === true) ||
    (row.subagent429Parent === true && row.diedOn429 === DIED_ON_429)
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
      /cousin-not-primary|#87972|#91414|#91408|#91396/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const spuriousNow = !cousinOnly && isSpurious(row);
  const darkNow = !spuriousNow && isDark(row);
  const helperForkStopFailure =
    row.helperForkStopFailure === true ||
    named === "helper-fork-stopfailure" ||
    /helper-fork-stopfailure|prompt_suggestion|away_summary|extract_memories|agent_summary/i.test(
      text,
    );
  const subagent429Parent =
    row.subagent429Parent === true ||
    named === "subagent-429-parent" ||
    /subagent-429-parent|background subagent 429|parent session_id/i.test(text);
  const lowPriorityIdleDrip =
    row.lowPriorityIdleDrip === true ||
    named === "low-priority-idle-drip" ||
    /low-priority-idle-drip|\/low-priority|20–30|20-30/i.test(text);
  const fourteenHooksCascade =
    row.fourteenHooksCascade === true ||
    row.stopFailureHooks === STOPFAILURE_HOOKS ||
    named === "fourteen-hooks-cascade" ||
    /fourteen-hooks-cascade|fourteen StopFailure|14 hooks|9\/7\/14/i.test(text);
  const missingQuerySource =
    row.missingQuerySource === true ||
    row.querySourcePresent === false ||
    named === "missing-query-source" ||
    /missing-query-source|no querySource|no query_source/i.test(text);
  const skipTranscriptFork =
    row.skipTranscript === true ||
    named === "skip-transcript-fork" ||
    /skip-transcript-fork|skipTranscript/i.test(text);
  const rateLimitNullRetry =
    row.rateLimitNullRetry === true ||
    named === "rate-limit-null-retry" ||
    /rate-limit-null-retry|429 returns null|retry allow-list excludes/i.test(
      text,
    );
  const delegatedObservationSkip =
    row.delegatedObservationSkip === true ||
    named === "delegated-observation-skip" ||
    /delegated-observation-skip|delegated-observation/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|KamilDev|has repro|2\.1\.258/i.test(text);
  const spurious =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (spuriousNow || named === SEEDED_WORD || /spurious|#91419/i.test(text));
  const dark =
    named === IDLE_WORD || named === "hold" || (darkNow && !spurious);
  return {
    named,
    cousinOnly,
    spuriousNow,
    darkNow,
    helperForkStopFailure,
    subagent429Parent,
    lowPriorityIdleDrip,
    fourteenHooksCascade,
    missingQuerySource,
    skipTranscriptFork,
    rateLimitNullRetry,
    delegatedObservationSkip,
    hasClearRepro,
    spurious,
    dark,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.dark && !flags.spurious) chips.push("dark");
  if (flags.spurious) chips.push("spurious");
  if (flags.helperForkStopFailure && flags.spurious) {
    chips.push("helper-fork-stopfailure");
  }
  if (flags.subagent429Parent && flags.spurious) {
    chips.push("subagent-429-parent");
  }
  if (flags.lowPriorityIdleDrip && flags.spurious) {
    chips.push("low-priority-idle-drip");
  }
  if (flags.fourteenHooksCascade && flags.spurious) {
    chips.push("fourteen-hooks-cascade");
  }
  if (flags.missingQuerySource && flags.spurious) {
    chips.push("missing-query-source");
  }
  if (flags.skipTranscriptFork && flags.spurious) {
    chips.push("skip-transcript-fork");
  }
  if (flags.rateLimitNullRetry && flags.spurious) {
    chips.push("rate-limit-null-retry");
  }
  if (flags.delegatedObservationSkip && flags.spurious) {
    chips.push("delegated-observation-skip");
  }
  if (flags.hasClearRepro && flags.spurious) chips.push("has-clear-repro");
  if ((flags.dark || flags.named === "hold") && !flags.spurious) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "dark") {
    reasons.push(
      "dark; board stays dark until the real main turn ends on an API error; helper forks do not light",
    );
    reasons.push(
      "hold: the annunciator is dark; score treats a main-turn-only StopFailure as a hold",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; board stays dark until the real main turn ends on an API error; helper forks do not light; the annunciator is dark",
    );
  }
  if (verdict === "spurious" || flags.spurious) {
    reasons.push(
      "spurious; #91419; StopFailure fires for helper forks and background subagent 429s on the parent session_id; 9/7/14 in about a minute",
    );
  }
  if (flags.helperForkStopFailure || verdict === "helper-fork-stopfailure") {
    reasons.push(
      "helper-fork-stopfailure; prompt_suggestion, away_summary, extract_memories, agent_summary (skipTranscript: true) light StopFailure on the parent session_id",
    );
  }
  if (flags.subagent429Parent || verdict === "subagent-429-parent") {
    reasons.push(
      "subagent-429-parent; background subagent 429 deaths stamp the parent session_id",
    );
  }
  if (flags.lowPriorityIdleDrip || verdict === "low-priority-idle-drip") {
    reasons.push(
      "low-priority-idle-drip; after /low-priority parked with no user input; further StopFailure ~20–30s apart (error: rate_limit); no transcript line",
    );
  }
  if (flags.fourteenHooksCascade || verdict === "fourteen-hooks-cascade") {
    reasons.push(
      "fourteen-hooks-cascade; nine background agents; seven died on 429; fourteen StopFailure hooks in about a minute for one underlying limit; 2N cascade",
    );
  }
  if (flags.missingQuerySource || verdict === "missing-query-source") {
    reasons.push(
      "missing-query-source; payload is error, error_details, last_assistant_message — no querySource / agent_id",
    );
  }
  if (flags.skipTranscriptFork || verdict === "skip-transcript-fork") {
    reasons.push(
      "skip-transcript-fork; helper forks (skipTranscript: true) still emit StopFailure",
    );
  }
  if (flags.rateLimitNullRetry || verdict === "rate-limit-null-retry") {
    reasons.push(
      "rate-limit-null-retry; low-priority retry allow-list excludes helpers → 429 returns null → spurious StopFailure",
    );
  }
  if (
    flags.delegatedObservationSkip ||
    verdict === "delegated-observation-skip"
  ) {
    reasons.push(
      "delegated-observation-skip; only delegated-observation is skipped; helper forks still fire StopFailure",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; ${BACKGROUND_AGENTS}/${DIED_ON_429}/${STOPFAILURE_HOOKS}; ${VERSION}; ${PLATFORM}; ${INTERACTIVE_REPL}; ${BYPASS_PERMISSIONS}; ${LOW_PRIORITY_TOKEN}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Annunciator; cite-only #87972 stall→StopFailure decision ignored / #91414 MCP listen stall / #91408 approve&&merge interrupt / #91396 fabricated authorization, not the #91419 helper-fork false-alarm",
    );
  }
  if (verdict === "spurious" || flags.spurious) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "dark" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.dark || !flags.spurious)) return "dark";
  if (named === "hold" && !flags.spurious) return "hold";
  if (named === SEEDED_WORD) return "spurious";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "dark";
  if (flags.spurious) return "spurious";
  if (flags.dark) return "dark";
  return "dark";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "spurious" || flags.spurious) {
    return {
      case: "spurious — helper lamps lit for a turn that never ran",
      rope: "parent session_id stamped on every helper and 429 window",
      clapper: `9 / 7 / 14 · ${CASCADE_WINDOW} · ${RATE_LIMIT_ERROR}`,
      chamber: "low-priority idle drip 20–30s; skipTranscript forks still fire",
      mark: "annunciator lit for a helper; admit the turn never ran",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "dark — board stays dark until a real main-turn API error",
      rope: "helper forks stay unlit; parent session_id is not borrowed",
      clapper: "main-turn only · query_source present · no idle drip",
      chamber: "cascade counter at zero; the annunciator is dark",
      mark: "lamp board dark; the annunciator holds",
      note: "Hold: the annunciator is dark.",
    };
  }
  return {
    case: "dark — board stays dark until a real main-turn API error",
    rope: "helper forks stay unlit; skipTranscript forks do not trip",
    clapper: "main-turn only · no parent-session stamp on helpers",
    chamber: "steel fascia quiet; atelier dark",
    mark: "lamp board dark; idle word dark",
    note: "Dark: the annunciator holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const spurious = verdict === "spurious" || flags.spurious;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    dark: verdict === "dark" || (flags.dark && !spurious),
    spurious,
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
  if (name === SEEDED_WORD || name === 91419 || name === "91419") {
    return analyze(seedSpurious());
  }
  if (name === "helper-fork-stopfailure") {
    return analyze(seedHelperForkStopfailure());
  }
  if (name === "subagent-429-parent") return analyze(seedSubagent429Parent());
  if (name === "low-priority-idle-drip") {
    return analyze(seedLowPriorityIdleDrip());
  }
  if (name === "fourteen-hooks-cascade") {
    return analyze(seedFourteenHooksCascade());
  }
  if (name === "missing-query-source") return analyze(seedMissingQuerySource());
  if (name === "skip-transcript-fork") return analyze(seedSkipTranscriptFork());
  if (name === "rate-limit-null-retry") {
    return analyze(seedRateLimitNullRetry());
  }
  if (name === "delegated-observation-skip") {
    return analyze(seedDelegatedObservationSkip());
  }
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "dark" || name === "open") {
    return analyze(seedDark());
  }
  if (
    name === 87972 ||
    name === "87972" ||
    name === "cousin" ||
    name === 91414 ||
    name === "91414" ||
    name === 91408 ||
    name === "91408" ||
    name === 91396 ||
    name === "91396"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedDark());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "spurious" || (result.spurious && result.alarm)
          ? `spurious annunciator #${FEATURED_ISSUE}: StopFailure lit for helper forks and background subagent 429s on the parent session_id; 14 hooks/~1min. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Board stays dark until the real main turn ends on an API error. Dark the board."
            : `dark annunciator. Idle word ${IDLE_WORD}. Board stays dark until the real main turn ends on an API error; helper forks do not light.`,
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
