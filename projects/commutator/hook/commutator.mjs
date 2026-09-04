#!/usr/bin/env node
/**
 * Commutator — rotary brush-gear / segment drum atelier classifier.
 * A commutator that seats a late reply on a sibling segment is not
 * a timeout — it is a brush already strayed. Score the drum or
 * admit the batch already lied.
 *
 *   echo '{"siblingSlot":true,"lateReply":true}' | node commutator.mjs
 *   node commutator.mjs ticket.json
 *
 * Idle word is keyed (HOLD: each concurrent tools/call result
 * matches its own JSON-RPC id; late reply never seats a sibling).
 * Seeded state is strayed / #91958 (slow call reports timeout
 * while the late real result lands in a sibling call's slot).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the drum keyed each result
 * to its own id or already seated a late reply on a sibling.
 *
 * Primary #91958: MCP streamable-http: a slow tool call's result
 * lands in a sibling call's slot in a concurrent batch.
 * Reporter keithkessleraz. Filed 2026-09-04T02:07:13Z. OPEN.
 * Labels: bug, has repro, platform:macos, area:mcp.
 * Claude Code 2.1.185; macOS 26.5.2; remote MCP streamable-http
 * via claude.ai connector; FastMCP 3.2.4.
 *
 * Hypothesis only (NON-BINDING): after the client's per-call
 * timeout, a late reply attaches to a still-pending sibling
 * instead of matching strictly by JSON-RPC id. Discard if issue
 * evidence disagrees. Do not claim Claude Code source you have
 * not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "keyed",
  "strayed",
  "streamable-http",
  "mcp-session",
  "tools-call-batch",
  "json-rpc-id",
  "late-reply",
  "sibling-slot",
  "client-timeout",
  "server-exonerated",
  "sequential-clean",
  "well-formed-wrong",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "keyed";
export const SEEDED_WORD = "strayed";
export const HOLD_VERDICTS = Object.freeze(["keyed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91958;
export const PRIMARY_ISSUES = Object.freeze([91958]);
export const COUSINS = Object.freeze([91414, 92046, 92065]);
export const COUSIN_ISSUE = 91414;
export const BACKUPS = Object.freeze([92079, 92059, 92053]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91958";
export const TITLE =
  "MCP streamable-http: a slow tool call's result lands in a sibling call's slot in a concurrent batch";
export const FILED_AT = "2026-09-04T02:07:13Z";
export const UPDATED_AT = "2026-09-04T12:06:15Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:mcp",
]);
export const REPORTER = "keithkessleraz";
export const PLATFORM = "macOS 26.5.2";
export const CLI_VERSION = "2.1.185";
export const SERVER = "FastMCP 3.2.4";
export const SDK = "MCP Python SDK 1.27.0";
export const CONNECTOR = "claude.ai connector";
export const TRANSPORT = "streamable-http";
export const SESSION_HEADER = "Mcp-Session-Id";
export const TIMEOUT_PHRASE =
  "Tool call timed out waiting for server response";
export const OBSERVED = "2026-09-03 ~21:11 UTC and 2026-09-04 ~00:38 UTC";
export const AREA = "area:mcp";
export const EVIDENCE = "streamable-http-concurrent-batch-json-rpc-id-miscorrelation";
export const INCIDENT_1_AT = "2026-09-03 ~21:11 UTC";
export const INCIDENT_1_BATCH = 12;
export const INCIDENT_1_TIMEOUT = "get_tag_vocabulary";
export const INCIDENT_1_LANDED = "get_park";
export const INCIDENT_2_AT = "2026-09-04 ~00:38 UTC";
export const INCIDENT_2_BATCH = 3;
export const INCIDENT_2_TOOLS = Object.freeze([
  "get_park",
  "search_waypoints",
  "compute_route",
]);
export const INCIDENT_2_TIMEOUT = "get_park";
export const INCIDENT_2_LANDED = "compute_route";
export const SERVER_CONFIGS = 28;
export const SERVER_REPETITIONS = 5;
export const SERVER_CALLS = 1200;
export const SSE_REPLY_FRAMES = 0;
export const HUB_LINE =
  "22:50 commutator: a commutator that seats a late reply on a sibling segment is not a timeout — it is a brush already strayed. Score the drum or admit the batch already lied.";
export const MARK = "22:50 / hermes catalog #136 / #91958";
export const PHRASE =
  "Score the drum or admit the batch already lied.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: after the client's per-call timeout, a late reply attaches to a still-pending sibling instead of matching strictly by JSON-RPC id. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is STREAMABLE-HTTP CONCURRENT BATCH JSON-RPC ID MIS-CORRELATION / SIBLING-SLOT STRAY. Claude Code 2.1.185; macOS 26.5.2; remote MCP streamable-http via the claude.ai connector; FastMCP 3.2.4; MCP Python SDK 1.27.0; nginx; OAuth 2.1. Concurrent tools/call batch on one Mcp-Session-Id. Incident 1 (~2026-09-03 21:11 UTC): batch 12; timed out get_tag_vocabulary (fast DB); payload landed in get_park; both handlers completed. Incident 2 (~2026-09-04 00:38 UTC): batch 3 (get_park, search_waypoints, compute_route); timed out get_park (slow API); payload landed in compute_route; search_waypoints correct. Sequential re-run clean. Server ~1200-call sweep: 28 configs × 5, batches 3 and 12, zero misroutes; SSE GET zero reply frames. Reporter keithkessleraz. Filed 2026-09-04. OPEN, bug, has repro, platform:macos, area:mcp.";
export const HOLD_RESULT =
  "keyed drum; each concurrent tools/call result matches its own JSON-RPC id; late reply never seats a sibling segment; idle word keyed";
export const FORBIDDEN_IDLE = Object.freeze([
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
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Spectral",
  "Figtree",
  "Fraunces",
  "Outfit",
  "Fira Code",
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
    persistHold: null,
    keyed: null,
    strayed: null,
    transport: "",
    sessionId: "",
    batchSize: null,
    timedOutTool: "",
    landedInTool: "",
    handlersCompleted: null,
    sequentialClean: null,
    serverMisroutes: null,
    serverCalls: null,
    serverConfigs: null,
    serverRepetitions: null,
    sseReplyFrames: null,
    timeoutMessage: "",
    lateReply: null,
    siblingSlot: null,
    wellFormedWrong: null,
    jsonRpcIdMatched: null,
    incident: "",
    incidentAt: "",
    platform: "",
    cliVersion: "",
    server: "",
    connector: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedKeyed() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistHold: true,
    keyed: true,
    strayed: false,
    transport: TRANSPORT,
    sessionId: SESSION_HEADER,
    jsonRpcIdMatched: true,
    siblingSlot: false,
    lateReply: false,
    wellFormedWrong: false,
    sequentialClean: true,
    serverMisroutes: 0,
    serverCalls: SERVER_CALLS,
    sseReplyFrames: SSE_REPLY_FRAMES,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "keyed; each concurrent tools/call result matches its own JSON-RPC id; late reply never seats a sibling; idle word keyed",
  };
}

export function seedStrayed() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistHold: false,
    keyed: false,
    strayed: true,
    transport: TRANSPORT,
    sessionId: SESSION_HEADER,
    batchSize: INCIDENT_1_BATCH,
    timedOutTool: INCIDENT_1_TIMEOUT,
    landedInTool: INCIDENT_1_LANDED,
    handlersCompleted: true,
    sequentialClean: true,
    serverMisroutes: 0,
    serverCalls: SERVER_CALLS,
    serverConfigs: SERVER_CONFIGS,
    serverRepetitions: SERVER_REPETITIONS,
    sseReplyFrames: SSE_REPLY_FRAMES,
    timeoutMessage: TIMEOUT_PHRASE,
    lateReply: true,
    siblingSlot: true,
    wellFormedWrong: true,
    jsonRpcIdMatched: false,
    incident: "1",
    incidentAt: INCIDENT_1_AT,
    platform: PLATFORM,
    cliVersion: CLI_VERSION,
    server: SERVER,
    connector: CONNECTOR,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "strayed; #91958; concurrent tools/call batch on one Mcp-Session-Id over streamable-http; timed out get_tag_vocabulary; payload landed in get_park; well-formed wrong tool result; keithkessleraz; 2.1.185; macOS 26.5.2; FastMCP 3.2.4; area:mcp",
  };
}

export function seedStreamableHttp() {
  return {
    ...blankTicket(),
    seed: "streamable-http",
    source: "atelier",
    transport: TRANSPORT,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    outputText:
      "streamable-http; remote MCP over streamable-http via the claude.ai connector; not local stdio",
  };
}

export function seedMcpSession() {
  return {
    ...blankTicket(),
    seed: "mcp-session",
    source: "atelier",
    sessionId: SESSION_HEADER,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    outputText:
      "mcp-session; concurrent tools/call batch on one Mcp-Session-Id",
  };
}

export function seedToolsCallBatch() {
  return {
    ...blankTicket(),
    seed: "tools-call-batch",
    source: "atelier",
    batchSize: INCIDENT_1_BATCH,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    outputText:
      "tools-call-batch; concurrent tools/call batch issued in one turn; incident 1 batch 12; incident 2 batch 3",
  };
}

export function seedJsonRpcId() {
  return {
    ...blankTicket(),
    seed: "json-rpc-id",
    source: "atelier",
    jsonRpcIdMatched: false,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    outputText:
      "json-rpc-id; expected own result or own timeout matched to own JSON-RPC id; late reply never attaches to a different call",
  };
}

export function seedLateReply() {
  return {
    ...blankTicket(),
    seed: "late-reply",
    source: "atelier",
    lateReply: true,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    timeoutMessage: TIMEOUT_PHRASE,
    outputText:
      "late-reply; after the client per-call timeout the real result arrived late and seated a sibling segment",
  };
}

export function seedSiblingSlot() {
  return {
    ...blankTicket(),
    seed: "sibling-slot",
    source: "atelier",
    siblingSlot: true,
    timedOutTool: INCIDENT_1_TIMEOUT,
    landedInTool: INCIDENT_1_LANDED,
    persistHold: false,
    strayed: true,
    lateReply: true,
    outputText:
      "sibling-slot; payload of the timed-out call landed in a sibling call's slot",
  };
}

export function seedClientTimeout() {
  return {
    ...blankTicket(),
    seed: "client-timeout",
    source: "atelier",
    timeoutMessage: TIMEOUT_PHRASE,
    timedOutTool: INCIDENT_1_TIMEOUT,
    persistHold: false,
    strayed: true,
    lateReply: true,
    siblingSlot: true,
    outputText:
      "client-timeout; client reported Tool call timed out waiting for server response while the handler completed server-side",
  };
}

export function seedServerExonerated() {
  return {
    ...blankTicket(),
    seed: "server-exonerated",
    source: "atelier",
    serverMisroutes: 0,
    serverCalls: SERVER_CALLS,
    serverConfigs: SERVER_CONFIGS,
    serverRepetitions: SERVER_REPETITIONS,
    sseReplyFrames: SSE_REPLY_FRAMES,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    outputText:
      "server-exonerated; hand-rolled streamable-http client; 28 configs × 5; batches 3 and 12; ~1200 tools/call; zero misroutes; SSE GET zero reply frames",
  };
}

export function seedSequentialClean() {
  return {
    ...blankTicket(),
    seed: "sequential-clean",
    source: "atelier",
    sequentialClean: true,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    outputText:
      "sequential-clean; neither incident reproduced on a sequential re-run of the same calls",
  };
}

export function seedWellFormedWrong() {
  return {
    ...blankTicket(),
    seed: "well-formed-wrong",
    source: "atelier",
    wellFormedWrong: true,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    outputText:
      "well-formed-wrong; model gets a well-formed but wrong tool result with no signal anything is wrong",
  };
}

export function seedHasClearRepro() {
  return {
    ...blankTicket(),
    seed: "has-clear-repro",
    source: "atelier",
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    outputText:
      "has-clear-repro; OPEN bug has-repro platform:macos area:mcp; two production incidents plus a server-side wire sweep",
  };
}

export function seedHold() {
  return {
    ...seedKeyed(),
    seed: "hold",
    outputText:
      "hold; each result keyed to its own JSON-RPC id; the drum holds; idle word keyed",
  };
}

export function seedBatch12() {
  return {
    ...blankTicket(),
    seed: "tools-call-batch",
    source: "atelier",
    incident: "1",
    incidentAt: INCIDENT_1_AT,
    batchSize: INCIDENT_1_BATCH,
    timedOutTool: INCIDENT_1_TIMEOUT,
    landedInTool: INCIDENT_1_LANDED,
    handlersCompleted: true,
    transport: TRANSPORT,
    sessionId: SESSION_HEADER,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    timeoutMessage: TIMEOUT_PHRASE,
    outputText:
      "tools-call-batch; incident 1 (~2026-09-03 21:11 UTC); batch 12; timed out get_tag_vocabulary (fast DB); payload landed in get_park; both handlers completed",
  };
}

export function seedBatch3() {
  return {
    ...blankTicket(),
    seed: "tools-call-batch",
    source: "atelier",
    incident: "2",
    incidentAt: INCIDENT_2_AT,
    batchSize: INCIDENT_2_BATCH,
    timedOutTool: INCIDENT_2_TIMEOUT,
    landedInTool: INCIDENT_2_LANDED,
    handlersCompleted: true,
    transport: TRANSPORT,
    sessionId: SESSION_HEADER,
    persistHold: false,
    strayed: true,
    siblingSlot: true,
    lateReply: true,
    timeoutMessage: TIMEOUT_PHRASE,
    outputText:
      "tools-call-batch; incident 2 (~2026-09-04 00:38 UTC); batch 3 (get_park, search_waypoints, compute_route); timed out get_park (slow API); payload landed in compute_route; search_waypoints correct",
  };
}

export function seedTimeoutTagVocab() {
  return {
    ...seedClientTimeout(),
    timedOutTool: INCIDENT_1_TIMEOUT,
    landedInTool: INCIDENT_1_LANDED,
    incident: "1",
    incidentAt: INCIDENT_1_AT,
    batchSize: INCIDENT_1_BATCH,
    outputText:
      "client-timeout; incident 1 timed out get_tag_vocabulary (fast, DB-only) while the handler completed at 21:11:01",
  };
}

export function seedLandedGetPark() {
  return {
    ...seedSiblingSlot(),
    timedOutTool: INCIDENT_1_TIMEOUT,
    landedInTool: INCIDENT_1_LANDED,
    incident: "1",
    incidentAt: INCIDENT_1_AT,
    batchSize: INCIDENT_1_BATCH,
    outputText:
      "sibling-slot; incident 1 payload of get_tag_vocabulary landed in get_park; get_park handler completed at 21:11:02",
  };
}

export function seedTimeoutGetPark() {
  return {
    ...seedClientTimeout(),
    timedOutTool: INCIDENT_2_TIMEOUT,
    landedInTool: INCIDENT_2_LANDED,
    incident: "2",
    incidentAt: INCIDENT_2_AT,
    batchSize: INCIDENT_2_BATCH,
    outputText:
      "client-timeout; incident 2 timed out get_park (slow, external Park Service API) while the handler ran server-side",
  };
}

export function seedLandedComputeRoute() {
  return {
    ...seedSiblingSlot(),
    timedOutTool: INCIDENT_2_TIMEOUT,
    landedInTool: INCIDENT_2_LANDED,
    incident: "2",
    incidentAt: INCIDENT_2_AT,
    batchSize: INCIDENT_2_BATCH,
    outputText:
      "sibling-slot; incident 2 payload of get_park landed in compute_route; search_waypoints was correct",
  };
}

export function seedCousin() {
  return {
    ...seedKeyed(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #91414 MCP HTTP first-turn subscriptions/listen freeze; #92046 Windows Claude_Browser MCP registers zero tools; #92065 mcp__claude-in-chrome__* absent on Windows MSIX — cite only, not the #91958 concurrent batch sibling-slot stray",
  };
}

export function emptyTicket() {
  return seedKeyed();
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
    persistHold: firstBool(nested.persistHold, src.persistHold),
    keyed: firstBool(nested.keyed, src.keyed),
    strayed: firstBool(nested.strayed, src.strayed),
    transport: firstText(nested.transport, src.transport),
    sessionId: firstText(nested.sessionId, src.sessionId, src.mcpSessionId),
    batchSize: firstNum(nested.batchSize, src.batchSize),
    timedOutTool: firstText(nested.timedOutTool, src.timedOutTool),
    landedInTool: firstText(nested.landedInTool, src.landedInTool),
    handlersCompleted: firstBool(
      nested.handlersCompleted,
      src.handlersCompleted,
    ),
    sequentialClean: firstBool(nested.sequentialClean, src.sequentialClean),
    serverMisroutes: firstNum(nested.serverMisroutes, src.serverMisroutes),
    serverCalls: firstNum(nested.serverCalls, src.serverCalls),
    serverConfigs: firstNum(nested.serverConfigs, src.serverConfigs),
    serverRepetitions: firstNum(
      nested.serverRepetitions,
      src.serverRepetitions,
    ),
    sseReplyFrames: firstNum(nested.sseReplyFrames, src.sseReplyFrames),
    timeoutMessage: firstText(nested.timeoutMessage, src.timeoutMessage),
    lateReply: firstBool(nested.lateReply, src.lateReply),
    siblingSlot: firstBool(nested.siblingSlot, src.siblingSlot),
    wellFormedWrong: firstBool(nested.wellFormedWrong, src.wellFormedWrong),
    jsonRpcIdMatched: firstBool(nested.jsonRpcIdMatched, src.jsonRpcIdMatched),
    incident: firstText(nested.incident, src.incident),
    incidentAt: firstText(nested.incidentAt, src.incidentAt),
    platform: firstText(nested.platform, src.platform),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    server: firstText(nested.server, src.server),
    connector: firstText(nested.connector, src.connector),
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
  return (
    row.persistHold == null &&
    row.keyed == null &&
    row.strayed == null &&
    row.siblingSlot == null &&
    row.lateReply == null &&
    row.jsonRpcIdMatched == null &&
    row.wellFormedWrong == null &&
    !row.timedOutTool &&
    !row.landedInTool &&
    !row.timeoutMessage &&
    row.batchSize == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedKeyed,
  [SEEDED_WORD]: seedStrayed,
  "streamable-http": seedStreamableHttp,
  "mcp-session": seedMcpSession,
  "mcp-session-id": seedMcpSession,
  "tools-call-batch": seedToolsCallBatch,
  "json-rpc-id": seedJsonRpcId,
  "late-reply": seedLateReply,
  "sibling-slot": seedSiblingSlot,
  "client-timeout": seedClientTimeout,
  "server-exonerated": seedServerExonerated,
  "sequential-clean": seedSequentialClean,
  "well-formed-wrong": seedWellFormedWrong,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  batch12: seedBatch12,
  batch3: seedBatch3,
  "timeout-tag-vocab": seedTimeoutTagVocab,
  "landed-get-park": seedLandedGetPark,
  "timeout-get-park": seedTimeoutGetPark,
  "landed-compute-route": seedLandedComputeRoute,
  cousin: seedCousin,
  91414: seedCousin,
  92046: seedCousin,
  92065: seedCousin,
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
    return { ...seedStrayed(), ...cloned, ...raw };
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
    ticket.server,
    ticket.connector,
    ticket.transport,
    ticket.sessionId,
    ticket.timedOutTool,
    ticket.landedInTool,
    ticket.timeoutMessage,
    ticket.incident,
    ticket.incidentAt,
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
    "mcp-session-id": "mcp-session",
    batch12: "tools-call-batch",
    batch3: "tools-call-batch",
    "timeout-tag-vocab": "client-timeout",
    "timeout-get-park": "client-timeout",
    "landed-get-park": "sibling-slot",
    "landed-compute-route": "sibling-slot",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function hasTimeoutPhrase(row) {
  if (row.timeoutMessage && /timed out waiting for server response/i.test(row.timeoutMessage)) {
    return true;
  }
  const blob = `${row.outputText || ""}\n${row.timeoutMessage || ""}`;
  return /Tool call timed out waiting for server response/i.test(blob);
}

function slotCrossed(row) {
  if (row.siblingSlot === true) return true;
  const timed = String(row.timedOutTool || "");
  const landed = String(row.landedInTool || "");
  return Boolean(timed && landed && timed !== landed);
}

function holdPattern(row) {
  return (
    row.jsonRpcIdMatched === true &&
    row.siblingSlot !== true &&
    row.lateReply !== true &&
    row.strayed !== true &&
    !slotCrossed(row)
  );
}

function strayedPattern(row) {
  if (row.strayed === true) return true;
  if (slotCrossed(row)) return true;
  if (row.lateReply === true && row.siblingSlot !== false) return true;
  if (row.wellFormedWrong === true && row.jsonRpcIdMatched === false) return true;
  return false;
}

export function isKeyed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.strayed !== true && holdPattern(row)) {
    return true;
  }
  if (holdPattern(row) && row.strayed !== true) return true;
  return false;
}

export function isStrayed(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (strayedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#91414|#92046|#92065/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const strayedNow = !cousinOnly && isStrayed(row);
  const keyedNow = !strayedNow && isKeyed(row);
  const streamableHttp =
    named === "streamable-http" ||
    /streamable-http/i.test(row.transport || "") ||
    /streamable-http/i.test(text);
  const mcpSession =
    named === "mcp-session" ||
    /Mcp-Session-Id/i.test(row.sessionId || "") ||
    /Mcp-Session-Id|mcp-session/i.test(text);
  const toolsCallBatch =
    named === "tools-call-batch" ||
    row.batchSize === 3 ||
    row.batchSize === 12 ||
    /tools\/call|tools-call-batch|batch 12|batch 3/i.test(text);
  const jsonRpcId =
    named === "json-rpc-id" ||
    row.jsonRpcIdMatched === false ||
    /JSON-RPC id|json-rpc-id/i.test(text);
  const lateReply =
    named === "late-reply" ||
    row.lateReply === true ||
    /late-reply|late reply|late real result/i.test(text);
  const siblingSlot =
    named === "sibling-slot" ||
    slotCrossed(row) ||
    /sibling-slot|sibling call's slot|sibling segment/i.test(text);
  const clientTimeout =
    named === "client-timeout" ||
    hasTimeoutPhrase(row) ||
    Boolean(row.timedOutTool) ||
    /client-timeout|timed out/i.test(text);
  const serverExonerated =
    named === "server-exonerated" ||
    (row.serverMisroutes === 0 && (row.serverCalls === SERVER_CALLS || row.serverCalls >= 1000)) ||
    /server-exonerated|zero misroutes|~1200/i.test(text);
  const sequentialClean =
    named === "sequential-clean" ||
    row.sequentialClean === true ||
    /sequential-clean|sequential re-run/i.test(text);
  const wellFormedWrong =
    named === "well-formed-wrong" ||
    row.wellFormedWrong === true ||
    /well-formed-wrong|well-formed but wrong|well-formed wrong/i.test(text);
  const hasClearRepro =
    named === "has-clear-repro" ||
    /has-clear-repro|has repro/i.test(text);
  const strayed =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (strayedNow || named === SEEDED_WORD || /strayed|#91958/i.test(text));
  const keyed = HOLD_VERDICTS.includes(named) || (keyedNow && !strayed);
  return {
    named,
    cousinOnly,
    strayedNow,
    keyedNow,
    streamableHttp,
    mcpSession,
    toolsCallBatch,
    jsonRpcId,
    lateReply,
    siblingSlot,
    clientTimeout,
    serverExonerated,
    sequentialClean,
    wellFormedWrong,
    hasClearRepro,
    strayed,
    keyed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.keyed && !flags.strayed) chips.push("keyed");
  if (flags.strayed) chips.push("strayed");
  if (flags.streamableHttp && flags.strayed) chips.push("streamable-http");
  if (flags.mcpSession && flags.strayed) chips.push("mcp-session");
  if (flags.toolsCallBatch && flags.strayed) chips.push("tools-call-batch");
  if (flags.jsonRpcId && flags.strayed) chips.push("json-rpc-id");
  if (flags.lateReply && flags.strayed) chips.push("late-reply");
  if (flags.siblingSlot && flags.strayed) chips.push("sibling-slot");
  if (flags.clientTimeout && flags.strayed) chips.push("client-timeout");
  if (flags.serverExonerated && flags.strayed) chips.push("server-exonerated");
  if (flags.sequentialClean && flags.strayed) chips.push("sequential-clean");
  if (flags.wellFormedWrong && flags.strayed) chips.push("well-formed-wrong");
  if (flags.hasClearRepro && flags.strayed) chips.push("has-clear-repro");
  if ((flags.keyed || flags.named === "hold") && !flags.strayed) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "keyed") {
    reasons.push(
      "keyed; each concurrent tools/call result matches its own JSON-RPC id; late reply never seats a sibling",
    );
    reasons.push("hold: the drum keyed each result; idle word keyed");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; each result keyed to its own JSON-RPC id; the drum holds",
    );
  }
  if (verdict === "strayed" || flags.strayed) {
    reasons.push(
      "strayed; #91958; concurrent tools/call batch on one Mcp-Session-Id over streamable-http; a slow call timed out while its real result landed in a sibling slot",
    );
  }
  if (verdict === "streamable-http" || (flags.streamableHttp && flags.strayed)) {
    reasons.push(
      "streamable-http; remote MCP over streamable-http via the claude.ai connector; not local stdio",
    );
  }
  if (verdict === "mcp-session" || (flags.mcpSession && flags.strayed)) {
    reasons.push("mcp-session; concurrent tools/call batch on one Mcp-Session-Id");
  }
  if (verdict === "tools-call-batch" || (flags.toolsCallBatch && flags.strayed)) {
    reasons.push(
      "tools-call-batch; concurrent tools/call batch; incident 1 batch 12; incident 2 batch 3",
    );
  }
  if (verdict === "json-rpc-id" || (flags.jsonRpcId && flags.strayed)) {
    reasons.push(
      "json-rpc-id; expected own result or own timeout matched to own JSON-RPC id",
    );
  }
  if (verdict === "late-reply" || (flags.lateReply && flags.strayed)) {
    reasons.push(
      "late-reply; after the client per-call timeout the real result arrived late",
    );
  }
  if (verdict === "sibling-slot" || (flags.siblingSlot && flags.strayed)) {
    reasons.push(
      "sibling-slot; payload of the timed-out call landed in a sibling call's slot",
    );
  }
  if (verdict === "client-timeout" || (flags.clientTimeout && flags.strayed)) {
    reasons.push(
      "client-timeout; Tool call timed out waiting for server response while the handler completed server-side",
    );
  }
  if (
    verdict === "server-exonerated" ||
    (flags.serverExonerated && flags.strayed)
  ) {
    reasons.push(
      "server-exonerated; hand-rolled client; 28 configs × 5; batches 3 and 12; ~1200 calls; zero misroutes; SSE GET zero reply frames",
    );
  }
  if (
    verdict === "sequential-clean" ||
    (flags.sequentialClean && flags.strayed)
  ) {
    reasons.push(
      "sequential-clean; neither incident reproduced on a sequential re-run of the same calls",
    );
  }
  if (
    verdict === "well-formed-wrong" ||
    (flags.wellFormedWrong && flags.strayed)
  ) {
    reasons.push(
      "well-formed-wrong; model gets a well-formed but wrong tool result with no signal",
    );
  }
  if (verdict === "has-clear-repro" || (flags.hasClearRepro && flags.strayed)) {
    reasons.push(
      "has-clear-repro; OPEN bug has-repro platform:macos area:mcp; two production incidents",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Commutator; cite-only #91414 (MCP HTTP first-turn subscriptions/listen freeze), #92046 (Windows Claude_Browser MCP registers zero tools), #92065 (mcp__claude-in-chrome__* absent on Windows MSIX) — different surfaces from #91958 concurrent batch sibling-slot stray; primary stays #91958",
    );
  }
  if (verdict === "strayed" || flags.strayed) {
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
  if (named === IDLE_WORD && (flags.keyed || !flags.strayed)) return "keyed";
  if (named === "hold" && !flags.strayed) return "hold";
  if (named === SEEDED_WORD) return "strayed";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "keyed";
  if (flags.strayed) return "strayed";
  if (flags.keyed) return "keyed";
  return "keyed";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "strayed" || flags.strayed) {
    return {
      case: "strayed — late reply seated a sibling segment",
      transport: ticket.transport || TRANSPORT,
      session: ticket.sessionId || SESSION_HEADER,
      timedOut: ticket.timedOutTool || INCIDENT_1_TIMEOUT,
      landed: ticket.landedInTool || INCIDENT_1_LANDED,
      jsonRpc: ticket.jsonRpcIdMatched === true ? "matched" : "mis-correlated",
      mark: "commutator strayed; admit the batch already lied",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — each result keyed to its own JSON-RPC id",
      transport: TRANSPORT,
      session: SESSION_HEADER,
      timedOut: "none",
      landed: "own slot",
      jsonRpc: "matched",
      mark: "commutator hold; the drum keys each result",
      note: "Hold: the drum keys.",
    };
  }
  return {
    case: "keyed — each concurrent tools/call result matches its own JSON-RPC id",
    transport: TRANSPORT,
    session: SESSION_HEADER,
    timedOut: "none",
    landed: "own slot",
    jsonRpc: "matched",
    mark: "commutator keyed; idle word keyed",
    note: "Keyed: the drum keys each result to its own segment.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const strayed = verdict === "strayed" || flags.strayed;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    keyed: verdict === "keyed" || (flags.keyed && !strayed),
    strayed,
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
  if (name === SEEDED_WORD || name === 91958 || name === "91958") {
    return analyze(seedStrayed());
  }
  if (name === "streamable-http") return analyze(seedStreamableHttp());
  if (name === "mcp-session" || name === "mcp-session-id") {
    return analyze(seedMcpSession());
  }
  if (name === "tools-call-batch") return analyze(seedToolsCallBatch());
  if (name === "json-rpc-id") return analyze(seedJsonRpcId());
  if (name === "late-reply") return analyze(seedLateReply());
  if (name === "sibling-slot") return analyze(seedSiblingSlot());
  if (name === "client-timeout") return analyze(seedClientTimeout());
  if (name === "server-exonerated") return analyze(seedServerExonerated());
  if (name === "sequential-clean") return analyze(seedSequentialClean());
  if (name === "well-formed-wrong") return analyze(seedWellFormedWrong());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === "batch12") return analyze(seedBatch12());
  if (name === "batch3") return analyze(seedBatch3());
  if (name === "timeout-tag-vocab") return analyze(seedTimeoutTagVocab());
  if (name === "landed-get-park") return analyze(seedLandedGetPark());
  if (name === "timeout-get-park") return analyze(seedTimeoutGetPark());
  if (name === "landed-compute-route") return analyze(seedLandedComputeRoute());
  if (name === IDLE_WORD || name === "keyed" || name === "open") {
    return analyze(seedKeyed());
  }
  if (
    name === 91414 ||
    name === "91414" ||
    name === 92046 ||
    name === "92046" ||
    name === 92065 ||
    name === "92065" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedKeyed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "strayed" || (result.strayed && result.alarm)
          ? `strayed commutator #${FEATURED_ISSUE}: concurrent tools/call batch on one Mcp-Session-Id over streamable-http seated a late reply on a sibling slot. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Each result keyed to its own JSON-RPC id. Score the drum."
            : `keyed commutator. Idle word ${IDLE_WORD}. Each concurrent tools/call result matches its own JSON-RPC id; late reply never seats a sibling.`,
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
