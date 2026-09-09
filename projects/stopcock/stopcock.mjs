#!/usr/bin/env node
/**
 * Stopcock — brass plumbing / copper-pipe workshop booth.
 *
 * Educational diagnostic model for a published Claude Code MCP defect:
 * a long Streamable HTTP MCP `tools/call` should stay OPEN when every
 * documented timeout knob is raised or disabled. Instead the valve is
 * SEATED — a hidden ~6-minute hard seat closes the call with
 * "The operation timed out." even though the MCP server stays healthy.
 *
 *   node stopcock.mjs data/seated.json
 *   echo '{"seed":"seated"}' | node stopcock.mjs
 *
 * Idle word is open (HOLD: the valve stays open for a long Streamable
 * HTTP MCP tools/call when documented timeout knobs are raised or
 * disabled; the server stays connected and does not itself return
 * an error).
 * Seeded word is seated (#93143: hard ~352–363s / ~6 min cut despite
 * per-server timeout 86400000, CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0,
 * and server requestTimeout=0; is_error true; "The operation timed
 * out."; client aborts its own tools/call).
 * Path word is stopcock (a hidden ~6-minute hard seat that closes a
 * long Streamable HTTP MCP tools/call despite raised knobs is not an
 * open valve — it is a seated stopcock).
 *
 * Encoded from anthropics/claude-code#93143 issue body only.
 * Hypothesis (NON-BINDING): the Claude client may apply a fixed
 * undocumented internal wall-clock ceiling around ~360s to Streamable
 * HTTP MCP tools/call that ignores the documented per-server timeout
 * and CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0. Verify against #93143
 * text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "open",
  "seated",
  "stopcock",
  "hold",
  "hard-ceiling",
  "six-minute-seat",
  "timeout-knobs-ignored",
  "idle-timeout-zero",
  "server-timeout-24h",
  "streamable-http",
  "tools-call",
  "operation-timed-out",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "open";
export const PATH_WORD = "stopcock";
export const SEEDED_WORD = "seated";
export const HOLD = Object.freeze(["open", "hold"]);
export const RECOVER = Object.freeze(["open", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "open" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "preserved",
  "discarded",
  "fresh",
  "stamped",
  "cleared",
  "mounded",
  "distinct",
  "conflated",
  "held",
  "steered",
  "raised",
  "fallen",
  "sterling",
  "primed",
  "flashed",
  "lodged",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
  "freewheeling",
  "doubled",
  "stereotype",
  "parergon",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "seated"),
);

export const FEATURED_ISSUE = 93143;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93143";
export const TITLE =
  '[BUG] Streamable HTTP MCP tool call still times out ("The operation timed out.") at ~6min despite per-server timeout, CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0, and a requestTimeout=0 server';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:mcp",
]);
export const CLAUDE_VERSION = "2.1.266";
export const AUTHOR = "wilmacedo";
export const FILED = "2026-09-09T16:53:02Z";
export const OS = "Ubuntu/Debian Linux";
export const TRANSPORT = "http";
export const PROTOCOL = "Streamable HTTP";
export const TOOL = "wait_forever";
export const PER_SERVER_TIMEOUT_MS = 86400000;
export const IDLE_TIMEOUT_ENV = "CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT";
export const IDLE_TIMEOUT_VALUE = 0;
export const REQUEST_TIMEOUT = 0;
export const CEILING_LOW = 352;
export const CEILING_HIGH = 363;
export const CEILING_SPREAD = 11;
export const MEASUREMENTS = Object.freeze([352, 363.1, 362.5, 357.8]);
export const PROGRESS_SECONDS = Object.freeze([300, 330]);
export const ERROR_CONTENT = "The operation timed out.";
export const IS_ERROR = true;
export const PHRASE =
  "a hidden ~6-minute hard seat that closes a long Streamable HTTP MCP tools/call despite raised knobs is not an open valve — it is a seated stopcock. Score seated or admit open.";

export const FINGERPRINT_LINES = Object.freeze([
  "The operation timed out.",
  "is_error: true",
  "CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0",
  "timeout: 86400000",
  "elapsed seconds: ~352-365",
]);

export const COUSINS = Object.freeze([
  {
    issue: 50289,
    title:
      ".mcp.json per-server timeout field no longer honored for HTTP MCP tool calls since 2.1.113",
    state: "CLOSED",
    hasRepro: true,
    citeOnly: true,
    why: "same general area (per-server HTTP timeout config silently ignored) but that report's observed ceiling was ~60s, this one is ~360s, and it does not cover CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT failing to disable the check; cite only; do not clone",
  },
  {
    issue: 16837,
    title: "Claude code does not obey values of MCP_TIMEOUT longer than 60 seconds",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "long-open issue in the same recurring theme (documented MCP timeout config being ignored) but a different specific variable (MCP_TIMEOUT connection timeout) than either of the two knobs tested here; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "parergon",
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "clepsydra",
  "fusee",
  "procrustes",
  "reed",
  "quench",
  "wildcat",
  "snatch",
  "deadman",
]);

/**
 * Published stopcock walk from #93143 only. Facts from the issue body.
 * An open valve keeps a long Streamable HTTP tools/call flowing.
 * A seated valve is cut by a hidden ~6-minute hard ceiling.
 */
export const STOPCOCK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-open",
    valveOpen: true,
    knobsHonored: true,
    knobsRaised: true,
    hardCeiling: false,
    timedOut: false,
    isError: false,
    serverHealthy: true,
    streamableHttp: true,
    toolsCall: true,
    clientAbort: false,
    cue: "open",
    note: "idle HOLD: valve stays open for a long Streamable HTTP MCP tools/call when documented timeout knobs are raised or disabled",
  },
  {
    t: "transport",
    event: "streamable-http",
    streamableHttp: true,
    transport: TRANSPORT,
    protocol: PROTOCOL,
    cue: "seated",
    note: 'transport is type:"http" (Streamable HTTP, single POST per JSON-RPC call), not SSE',
  },
  {
    t: "call",
    event: "tools-call",
    toolsCall: true,
    tool: TOOL,
    neverResponds: true,
    cue: "seated",
    note: "tools/call genuinely needs to stay open for several minutes (human-in-the-loop wait); bare Streamable HTTP MCP whose tool never responds",
  },
  {
    t: "knob-a",
    event: "server-timeout-24h",
    knobsRaised: true,
    serverTimeout24h: true,
    perServerTimeoutMs: PER_SERVER_TIMEOUT_MS,
    cue: "seated",
    note: "per-server timeout field in mcpServers set to 86400000 (24h)",
  },
  {
    t: "knob-b",
    event: "idle-timeout-zero",
    knobsRaised: true,
    idleTimeoutZero: true,
    idleTimeoutEnv: IDLE_TIMEOUT_ENV,
    idleTimeoutValue: IDLE_TIMEOUT_VALUE,
    cue: "seated",
    note: "CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0 on the claude process (confirmed received as 0)",
  },
  {
    t: "knob-c",
    event: "timeout-knobs-ignored",
    knobsRaised: true,
    knobsHonored: false,
    requestTimeoutRuledOut: true,
    requestTimeout: REQUEST_TIMEOUT,
    cue: "seated",
    note: "every documented mechanism to raise or disable that timeout was applied at the same time; server requestTimeout=0 ruled out — timing unchanged",
  },
  {
    t: "progress",
    event: "six-minute-seat",
    hardCeiling: true,
    progressSeconds: [...PROGRESS_SECONDS],
    cue: "seated",
    note: "CLI emits tool_progress heartbeat at elapsed_time_seconds 300 and 330 shortly before the timeout fires — not treated as silent/idle, yet still aborts",
  },
  {
    t: "ceiling",
    event: "hard-ceiling",
    hardCeiling: true,
    elapsedSeconds: 363.1,
    ceilingLow: CEILING_LOW,
    ceilingHigh: CEILING_HIGH,
    measurements: [...MEASUREMENTS],
    cue: "seated",
    note: "consistently narrow ~352-363 second window (352.x, 363.1, 362.5, 357.8 — an 11-second spread); reads like one fixed undocumented internal timeout",
  },
  {
    t: "abort",
    event: "operation-timed-out",
    timedOut: true,
    isError: true,
    operationTimedOut: true,
    errorContent: ERROR_CONTENT,
    clientAbort: true,
    serverHealthy: true,
    cue: "seated",
    note: 'is_error true; content "The operation timed out."; MCP server stays healthy; claude client aborts its own tools/call',
  },
  {
    t: "seat",
    event: "seated",
    valveOpen: false,
    knobsHonored: false,
    knobsRaised: true,
    hardCeiling: true,
    timedOut: true,
    isError: true,
    operationTimedOut: true,
    clientAbort: true,
    serverHealthy: true,
    streamableHttp: true,
    toolsCall: true,
    elapsedSeconds: 363.1,
    cue: "seated",
    note: "hidden ~6-minute hard seat closes the valve despite knobs; score seated",
  },
  {
    t: "path",
    event: "stopcock",
    stopcock: true,
    cue: "seated",
    note: "a hidden ~6-minute hard seat that closes a long Streamable HTTP MCP tools/call despite raised knobs is not an open valve — it is a seated stopcock",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    valveOpen: true,
    knobsHonored: true,
    knobsRaised: true,
    hardCeiling: false,
    timedOut: false,
    isError: false,
    operationTimedOut: false,
    serverHealthy: true,
    streamableHttp: true,
    toolsCall: true,
    clientAbort: false,
    cue: "open",
  };
}

export function seedOpen() {
  return { ...emptyTicket() };
}

export function seedSeated() {
  return {
    seed: SEEDED_WORD,
    valveOpen: false,
    knobsHonored: false,
    knobsRaised: true,
    hardCeiling: true,
    timedOut: true,
    isError: true,
    operationTimedOut: true,
    errorContent: ERROR_CONTENT,
    clientAbort: true,
    serverHealthy: true,
    streamableHttp: true,
    toolsCall: true,
    idleTimeoutZero: true,
    serverTimeout24h: true,
    requestTimeoutRuledOut: true,
    perServerTimeoutMs: PER_SERVER_TIMEOUT_MS,
    idleTimeoutValue: IDLE_TIMEOUT_VALUE,
    elapsedSeconds: 363.1,
    ceilingLow: CEILING_LOW,
    ceilingHigh: CEILING_HIGH,
    measurements: [...MEASUREMENTS],
    cue: "seated",
    issue: FEATURED_ISSUE,
  };
}

export function seedStopcock() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    stopcock: true,
    cue: "seated",
  };
}

export function seedHardCeiling() {
  return {
    seed: "hard-ceiling",
    hardCeiling: true,
    elapsedSeconds: 363.1,
    ceilingLow: CEILING_LOW,
    ceilingHigh: CEILING_HIGH,
    measurements: [...MEASUREMENTS],
    cue: "seated",
  };
}

export function seedSixMinuteSeat() {
  return {
    seed: "six-minute-seat",
    hardCeiling: true,
    progressSeconds: [...PROGRESS_SECONDS],
    cue: "seated",
  };
}

export function seedTimeoutKnobsIgnored() {
  return {
    seed: "timeout-knobs-ignored",
    knobsRaised: true,
    knobsHonored: false,
    requestTimeoutRuledOut: true,
    cue: "seated",
  };
}

export function seedIdleTimeoutZero() {
  return {
    seed: "idle-timeout-zero",
    idleTimeoutZero: true,
    idleTimeoutEnv: IDLE_TIMEOUT_ENV,
    idleTimeoutValue: IDLE_TIMEOUT_VALUE,
    cue: "seated",
  };
}

export function seedServerTimeout24h() {
  return {
    seed: "server-timeout-24h",
    serverTimeout24h: true,
    perServerTimeoutMs: PER_SERVER_TIMEOUT_MS,
    cue: "seated",
  };
}

export function seedStreamableHttp() {
  return {
    seed: "streamable-http",
    streamableHttp: true,
    transport: TRANSPORT,
    protocol: PROTOCOL,
    cue: "seated",
  };
}

export function seedToolsCall() {
  return {
    seed: "tools-call",
    toolsCall: true,
    tool: TOOL,
    neverResponds: true,
    cue: "seated",
  };
}

export function seedOperationTimedOut() {
  return {
    seed: "operation-timed-out",
    timedOut: true,
    isError: true,
    operationTimedOut: true,
    errorContent: ERROR_CONTENT,
    clientAbort: true,
    serverHealthy: true,
    cue: "seated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      valveOpen: false,
      knobsHonored: false,
      knobsRaised: false,
      hardCeiling: false,
      timedOut: false,
      isError: false,
      operationTimedOut: false,
      serverHealthy: false,
      streamableHttp: false,
      toolsCall: false,
      clientAbort: false,
      idleTimeoutZero: false,
      serverTimeout24h: false,
      requestTimeoutRuledOut: false,
      neverResponds: false,
      stopcock: false,
      elapsedSeconds: null,
      ceilingLow: null,
      ceilingHigh: null,
      measurements: null,
      progressSeconds: null,
      perServerTimeoutMs: null,
      idleTimeoutValue: null,
      idleTimeoutEnv: null,
      errorContent: null,
      transport: null,
      protocol: null,
      tool: null,
      requestTimeout: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    valveOpen: raw.valveOpen === true,
    knobsHonored: raw.knobsHonored === true,
    knobsRaised: raw.knobsRaised === true,
    hardCeiling: raw.hardCeiling === true,
    timedOut: raw.timedOut === true,
    isError: raw.isError === true,
    operationTimedOut: raw.operationTimedOut === true,
    serverHealthy: raw.serverHealthy === true,
    streamableHttp: raw.streamableHttp === true,
    toolsCall: raw.toolsCall === true,
    clientAbort: raw.clientAbort === true,
    idleTimeoutZero: raw.idleTimeoutZero === true,
    serverTimeout24h: raw.serverTimeout24h === true,
    requestTimeoutRuledOut: raw.requestTimeoutRuledOut === true,
    neverResponds: raw.neverResponds === true,
    stopcock: raw.stopcock === true,
    elapsedSeconds: raw.elapsedSeconds ?? null,
    ceilingLow: raw.ceilingLow ?? null,
    ceilingHigh: raw.ceilingHigh ?? null,
    measurements: Array.isArray(raw.measurements) ? raw.measurements : null,
    progressSeconds: Array.isArray(raw.progressSeconds)
      ? raw.progressSeconds
      : null,
    perServerTimeoutMs: raw.perServerTimeoutMs ?? raw.timeout ?? null,
    idleTimeoutValue:
      raw.idleTimeoutValue === 0 || raw.idleTimeoutValue
        ? raw.idleTimeoutValue
        : null,
    idleTimeoutEnv: raw.idleTimeoutEnv || null,
    errorContent: raw.errorContent || raw.content || null,
    transport: raw.transport || null,
    protocol: raw.protocol || null,
    tool: raw.tool || null,
    requestTimeout: raw.requestTimeout ?? null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.valveOpen != null ||
        ticket.knobsHonored != null ||
        ticket.knobsRaised != null ||
        ticket.hardCeiling != null ||
        ticket.timedOut != null ||
        ticket.isError != null ||
        ticket.operationTimedOut != null ||
        ticket.serverHealthy != null ||
        ticket.streamableHttp != null ||
        ticket.toolsCall != null ||
        ticket.clientAbort != null ||
        ticket.stopcock != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.elapsedSeconds != null ||
        ticket.idleTimeoutZero != null ||
        ticket.serverTimeout24h != null),
  );
}

function inCeilingWindow(seconds) {
  if (seconds == null) return false;
  const n = Number(seconds);
  return n >= CEILING_LOW && n <= CEILING_HIGH + 2;
}

function isOpen(row) {
  if (row.stopcock) return false;
  if (row.cue === "seated") return false;
  if (row.hardCeiling && row.timedOut) return false;
  if (row.isError && row.operationTimedOut) return false;
  if (row.clientAbort && row.serverHealthy && row.timedOut) return false;
  if (
    row.valveOpen === true &&
    row.knobsHonored === true &&
    row.hardCeiling !== true &&
    row.timedOut !== true &&
    row.cue !== "seated"
  ) {
    return true;
  }
  if (row.cue === "open" && row.hardCeiling !== true && row.timedOut !== true) {
    return true;
  }
  return false;
}

function isSeated(row) {
  if (row.stopcock && row.cue !== "open") return false;
  if (row.cue === "seated") return true;
  if (row.hardCeiling && (row.timedOut || row.isError)) return true;
  if (row.operationTimedOut && row.isError) return true;
  if (row.clientAbort && row.serverHealthy && row.timedOut) return true;
  if (
    row.knobsRaised &&
    row.knobsHonored === false &&
    (row.hardCeiling || row.timedOut || inCeilingWindow(row.elapsedSeconds))
  ) {
    return true;
  }
  if (inCeilingWindow(row.elapsedSeconds) && row.isError) return true;
  return false;
}

function isStopcockPath(row) {
  return row.stopcock === true && !isOpen(row);
}

/**
 * Score one Streamable HTTP MCP tools/call pass against the stopcock booth.
 * open: valve stays open; knobs honored; no hard ceiling.
 * seated: hidden ~6 min hard seat; is_error; "The operation timed out."
 * stopcock: named path — a hidden hard seat is not an open valve.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isStopcockPath(row)) {
    verdict = "stopcock";
  } else if (isSeated(row)) {
    verdict = "seated";
  } else if (isOpen(row)) {
    verdict = "open";
  } else if (
    row.hardCeiling ||
    row.timedOut ||
    row.operationTimedOut ||
    row.isError ||
    (row.knobsRaised && row.knobsHonored === false) ||
    row.clientAbort ||
    inCeilingWindow(row.elapsedSeconds)
  ) {
    verdict = "seated";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    open: verdict === "open",
    seated: verdict === "seated" || verdict === SEEDED_WORD,
    stopcock: verdict === "stopcock" || verdict === PATH_WORD,
    valveOpen: row.valveOpen,
    knobsHonored: row.knobsHonored,
    knobsRaised: row.knobsRaised,
    hardCeiling: row.hardCeiling,
    timedOut: row.timedOut,
    isError: row.isError,
    operationTimedOut: row.operationTimedOut,
    serverHealthy: row.serverHealthy,
    streamableHttp: row.streamableHttp,
    toolsCall: row.toolsCall,
    clientAbort: row.clientAbort,
    idleTimeoutZero: row.idleTimeoutZero,
    serverTimeout24h: row.serverTimeout24h,
    requestTimeoutRuledOut: row.requestTimeoutRuledOut,
    neverResponds: row.neverResponds,
    elapsedSeconds: row.elapsedSeconds,
    ceilingLow: row.ceilingLow,
    ceilingHigh: row.ceilingHigh,
    measurements: row.measurements,
    progressSeconds: row.progressSeconds,
    perServerTimeoutMs: row.perServerTimeoutMs,
    idleTimeoutValue: row.idleTimeoutValue,
    idleTimeoutEnv: row.idleTimeoutEnv,
    errorContent: row.errorContent,
    transport: row.transport,
    protocol: row.protocol,
    tool: row.tool,
    requestTimeout: row.requestTimeout,
    cue: hold ? "open" : "seated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit open" : "score seated",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : STOPCOCK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const seated = scored.filter((row) => row.verdict === "seated");
  const stopcock = scored.filter((row) => row.verdict === "stopcock");
  const open = scored.filter((row) => row.verdict === "open");
  const headline =
    scored.find((row) => row.event === "seated") ||
    scored.find((row) => row.event === "hard-ceiling") ||
    scored.find((row) => row.event === "operation-timed-out") ||
    scored.find((row) => row.event === "stopcock") ||
    seated[seated.length - 1];
  let verdict = "open";
  if (seated.length) verdict = "seated";
  else if (stopcock.length && !open.length) verdict = "stopcock";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    seatedCount: seated.length,
    stopcockCount: stopcock.length,
    openCount: open.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit open" : "score seated",
    note: headline
      ? "hidden ~6-minute hard seat closes a long Streamable HTTP MCP tools/call despite raised knobs; is_error true; The operation timed out."
      : "published stopcock walk scored against open vs seated",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "open" &&
    seeded !== "seated" &&
    seeded !== "stopcock" &&
    ticket.valveOpen == null &&
    ticket.knobsHonored == null &&
    ticket.hardCeiling == null &&
    ticket.timedOut == null &&
    ticket.isError == null &&
    ticket.operationTimedOut == null &&
    ticket.stopcock == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    hardCeiling: scored.hardCeiling ?? false,
    timedOut: scored.timedOut ?? false,
    isError: scored.isError ?? false,
    knobsHonored: scored.knobsHonored ?? false,
    knobsRaised: scored.knobsRaised ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.knobsHonored ? "knobs=honored" : "knobs=ignored",
    result.hardCeiling ? "ceiling=hard" : "ceiling=none",
    result.timedOut ? "call=timed-out" : "call=flowing",
    result.cue === "open" ? "cue=open" : "cue=seated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeVersion: CLAUDE_VERSION,
      author: AUTHOR,
      filed: FILED,
      os: OS,
      transport: TRANSPORT,
      protocol: PROTOCOL,
      tool: TOOL,
      perServerTimeoutMs: PER_SERVER_TIMEOUT_MS,
      idleTimeoutEnv: IDLE_TIMEOUT_ENV,
      idleTimeoutValue: IDLE_TIMEOUT_VALUE,
      requestTimeout: REQUEST_TIMEOUT,
      ceilingLow: CEILING_LOW,
      ceilingHigh: CEILING_HIGH,
      ceilingSpread: CEILING_SPREAD,
      measurements: [...MEASUREMENTS],
      progressSeconds: [...PROGRESS_SECONDS],
      errorContent: ERROR_CONTENT,
      isError: IS_ERROR,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "with per-server timeout set to 24h and/or CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0, tools/call should not abort at ~6 minutes",
        "honor the 24h ceiling, or (per the =0 docs, disables the check entirely) not idle-timeout at all",
        "for as long as the server stays connected and does not itself return an error",
      ],
      hypothesis:
        "NON-BINDING: the Claude client may apply a fixed undocumented internal wall-clock ceiling around ~360s to Streamable HTTP MCP tools/call that ignores the documented per-server timeout and CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
