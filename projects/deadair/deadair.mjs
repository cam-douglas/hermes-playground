#!/usr/bin/env node
/**
 * Dead Air — radio / broadcast control-room booth.
 *
 * Educational diagnostic model for a published Claude Code
 * networking defect: the circuit should keep the carrier live
 * (timely HTTP response, or at least a logged timeout/retry).
 * Instead the request is TCP-ACKed by Cloudflare and never
 * answered; the client waits ~900s (API_TIMEOUT_MS=900000)
 * with nothing logged — no error, no retry, no timeout event —
 * because the socket stayed Established and keepalives were
 * ACKed, then silently retries and succeeds.
 *
 *   node deadair.mjs data/deadair.json
 *   echo '{"seed":"deadair"}' | node deadair.mjs
 *
 * Idle word is carrier (HOLD: the circuit stays live — request
 * gets a timely response; productive carrier; timeout/retry
 * would be logged if anything failed).
 * Seeded word is deadair (#93155: TCP alive, keepalives ACKed,
 * 0 response bytes, 900s silent wait, zero log lines, then
 * silent retry).
 * Path word is squelch (a live keepalive answering for fifteen
 * minutes with zero response bytes and zero log lines is not a
 * carrier — it is dead air / a squelch).
 *
 * Encoded from anthropics/claude-code#93155 issue body only.
 * Hypothesis (NON-BINDING): client may treat an Established TCP
 * socket with keepalive ACKs as healthy progress and therefore
 * skip timeout/retry logging for a full API_TIMEOUT_MS window
 * even when zero response bytes arrive. Verify against #93155
 * text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "carrier",
  "deadair",
  "squelch",
  "hold",
  "timely-response",
  "ewr-colo",
  "keepalive-acked",
  "zero-response-bytes",
  "api-timeout-900s",
  "no-log-entry",
  "quantized-stalls",
  "stream-idle-120s",
  "clean-bos-control",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "carrier";
export const PATH_WORD = "squelch";
export const SEEDED_WORD = "deadair";
export const HOLD = Object.freeze(["carrier", "timely-response", "hold"]);
export const RECOVER = Object.freeze(["carrier", "timely-response", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "moored",
  "scuttled",
  "scuttle",
  "open",
  "seated",
  "stopcock",
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
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
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
  FORBIDDEN_IDLE.filter((name) => name !== "deadair"),
);

export const FEATURED_ISSUE = 93155;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93155";
export const TITLE =
  "Requests silently stall for 900s with no error or retry logged";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:networking",
]);
export const AUTHOR = "dehuman8";
export const FILED = "2026-09-09";
export const CLIENT = "Claude Code 2.1.260 (claude-desktop)";
export const OS = "Windows 11 Pro 26200";
export const NODE = "24.18.1";
export const BASE_URL = "default ANTHROPIC_BASE_URL";
export const PROXY = "none";
export const MCP = "none";
export const DEFENDER = "Windows Defender only";
export const API_TIMEOUT_MS = 900000;
export const UPLOADED_BYTES = 907582;
export const RESPONSE_BYTES = 0;
export const RETRANSMISSIONS = 0;
export const KEEPALIVE_S = 63.5;
export const PACKETS = 690;
export const FLOWS = 19;
export const IPV4 = "160.79.104.10";
export const IPV6 = "2607:6bc0::10";
export const PORT = 443;
export const AFFECTED_PATH = "Spectrum IPv6 → Cloudflare EWR";
export const CLEAN_PATH = "T-Mobile → BOS";
export const TRANSIT = "Zayo AS6461";
export const ORD_NOTE = "Spectrum IPv4 → ORD untested";
export const BOS_CONCURRENT = 12;
export const STREAM_IDLE_S = 120.0;
export const STREAM_IDLE_KNOB = "CLAUDE_BYTE_STREAM_IDLE_TIMEOUT_MS";
export const FREQ_AFFECTED = "3/1000";
export const FREQ_CLEAN = "0/4485";
export const WEEKS_BLAMED_MODEM = 3;
export const STALL_WINDOW = "16:30:24Z → 17:00:23Z";
export const QUANTIZED_1X = Object.freeze([
  903.1, 903.2, 903.4, 904.5, 907.7, 909.2, 911.1, 913.7, 914.4, 914.7,
]);
export const QUANTIZED_2X = Object.freeze([1807.5, 1810.8]);
export const QUANTIZED_3X = Object.freeze([2709.0]);
export const LOG_RETRIES = 0;
export const LOG_API_ERRORS = 0;
export const PHRASE =
  "a live keepalive answering for fifteen minutes with zero response bytes and zero log lines is not a carrier — it is dead air / a squelch. Score deadair or admit carrier.";

export const FINGERPRINT_LINES = Object.freeze([
  "API_TIMEOUT_MS=900000",
  "total response data bytes received: 0",
  "keepalive ACKed IMMEDIATELY",
  "connection retries : 0",
  "api errors         : 0",
  "Spectrum IPv6 → EWR",
  "T-Mobile → BOS",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93120,
    title:
      'Desktop app: repeated "Request failed · Retrying (n/10)", sometimes needs a full restart',
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "retries ARE visible on screen; opposite of a silent 900s wait with zero log lines; cite only; do not clone",
  },
  {
    issue: 87424,
    title:
      "[BUG] Intermittent ECONNRESET on both desktop app and standalone CLI, no VPN/proxy",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "TCP raises ECONNRESET and retries are logged; this booth is Established + keepalive ACK + 0 response bytes + nothing logged; cite only; do not clone",
  },
  {
    issue: 74544,
    title:
      "1M-context session becomes unrecoverable: ECONNRESET on large uncached requests, and /compact fails with the same error",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "large uncached 1M-context ECONNRESET is logged; not a silent 900s EWR stall with 0 response bytes; cite only; do not clone",
  },
  {
    issue: 90764,
    title:
      "[BUG] ECONNRESET on all local sessions (CLI + desktop) while other HTTP clients reach the same hosts successfully — macOS arm64, v2.1.251",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "immediate ECONNRESET on every local session; not a 900s silent wait after Cloudflare ACK; cite only; do not clone",
  },
  {
    issue: 91970,
    title:
      "[BUG] ECONNRESET on all requests — other HTTP clients succeed to the same host on the same machine",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "every launch fails with logged ECONNRESET; not a silent Established-socket stall; cite only; do not clone",
  },
  {
    issue: 90964,
    title:
      "[BUG] ECONNRESET repeatedly drops interactive sessions after several minutes of active work (macOS, v2.1.251)",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "mid-task ECONNRESET with Retrying n/10; TCP signalled an error; cite only; do not clone",
  },
  {
    issue: 32982,
    title:
      "[BUG] Remote Control sessions die after ~20 min idle — server TTL ignores keepalives",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Remote Control idle TTL ignores keepalives; not Spectrum IPv6 → EWR API request with 0 HTTP bytes; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
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
 * Published deadair walk from #93155 only. Facts from the issue body.
 * A carrier circuit returns a timely response (or logs the timeout).
 * Dead air is TCP alive + keepalive ACK + 0 response bytes + 900s silence.
 */
export const DEADAIR_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-carrier",
    timelyResponse: true,
    timeoutLogged: true,
    retryLogged: true,
    tcpEstablished: true,
    keepaliveAcked: true,
    responseBytes: 2048,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    stallSeconds: 4,
    noLogEntry: false,
    ewrColo: false,
    bosControl: true,
    cue: "carrier",
    note: "idle HOLD: the circuit stays live — request gets a timely response; timeout/retry would be logged if anything failed",
  },
  {
    t: "upload",
    event: "request-acked",
    tcpEstablished: true,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    responseBytes: 0,
    cue: "deadair",
    note: "907,582 bytes uploaded; every byte ACKed; 0 retransmissions",
  },
  {
    t: "silence",
    event: "zero-response-bytes",
    tcpEstablished: true,
    responseBytes: 0,
    uploadedBytes: UPLOADED_BYTES,
    cue: "deadair",
    note: "total response data bytes received: 0 — no HTTP response ever returned",
  },
  {
    t: "probe",
    event: "keepalive-acked",
    tcpEstablished: true,
    keepaliveAcked: true,
    keepaliveS: KEEPALIVE_S,
    responseBytes: 0,
    cue: "deadair",
    note: "keepalive probe at 63.5s ACKed immediately; socket stayed Established",
  },
  {
    t: "colo",
    event: "ewr-colo",
    ewrColo: true,
    bosControl: false,
    affectedPath: AFFECTED_PATH,
    transit: TRANSIT,
    responseBytes: 0,
    cue: "deadair",
    note: "Spectrum IPv6 → Cloudflare EWR colo; IPv6 leaves via Zayo AS6461",
  },
  {
    t: "clock",
    event: "api-timeout-900s",
    apiTimeoutMs: API_TIMEOUT_MS,
    stallSeconds: 903.1,
    quantized: true,
    responseBytes: 0,
    noLogEntry: true,
    cue: "deadair",
    note: "client waits exactly ~900s (API_TIMEOUT_MS=900000 from desktop-injected env)",
  },
  {
    t: "log",
    event: "no-log-entry",
    noLogEntry: true,
    timeoutLogged: false,
    retryLogged: false,
    errorLogged: false,
    logRetries: LOG_RETRIES,
    logApiErrors: LOG_API_ERRORS,
    cue: "deadair",
    note: "connection retries : 0; api errors : 0 — nothing logged; TCP produced no error",
  },
  {
    t: "quantize",
    event: "quantized-stalls",
    quantized: true,
    stallSeconds: 903.1,
    apiTimeoutMs: API_TIMEOUT_MS,
    cue: "deadair",
    note: "stalls quantized at multiples of 900s (903–914s, 1807s, 2709s)",
  },
  {
    t: "idle-timer",
    event: "stream-idle-120s",
    streamIdle120: true,
    streamIdleS: STREAM_IDLE_S,
    streamIdleKnob: STREAM_IDLE_KNOB,
    cue: "deadair",
    note: "separate ~120.0s stream-idle timer; CLAUDE_BYTE_STREAM_IDLE_TIMEOUT_MS unset",
  },
  {
    t: "control",
    event: "clean-bos-control",
    bosControl: true,
    ewrColo: false,
    timelyResponse: true,
    responseBytes: 2048,
    cleanPath: CLEAN_PATH,
    freqClean: FREQ_CLEAN,
    cue: "carrier",
    note: "T-Mobile → BOS: 0/4485 stalls; 12 concurrent IPv6 connections clean",
  },
  {
    t: "air",
    event: "deadair",
    timelyResponse: false,
    timeoutLogged: false,
    retryLogged: false,
    tcpEstablished: true,
    keepaliveAcked: true,
    responseBytes: 0,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    stallSeconds: 903.1,
    apiTimeoutMs: API_TIMEOUT_MS,
    noLogEntry: true,
    ewrColo: true,
    bosControl: false,
    quantized: true,
    cue: "deadair",
    note: "TCP alive, keepalives ACKed, 0 response bytes, 900s silent wait, zero log lines, then silent retry",
  },
  {
    t: "path",
    event: "squelch",
    squelch: true,
    cue: "deadair",
    note: "a live keepalive answering for fifteen minutes with zero response bytes and zero log lines is not a carrier — it is dead air / a squelch",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    timelyResponse: true,
    timeoutLogged: true,
    retryLogged: true,
    errorLogged: false,
    tcpEstablished: true,
    keepaliveAcked: true,
    responseBytes: 2048,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    stallSeconds: 4,
    noLogEntry: false,
    ewrColo: false,
    bosControl: true,
    quantized: false,
    streamIdle120: false,
    squelch: false,
    cue: "carrier",
  };
}

export function seedCarrier() {
  return { ...emptyTicket() };
}

export function seedDeadair() {
  return {
    seed: SEEDED_WORD,
    timelyResponse: false,
    timeoutLogged: false,
    retryLogged: false,
    errorLogged: false,
    tcpEstablished: true,
    keepaliveAcked: true,
    responseBytes: 0,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    stallSeconds: 903.1,
    apiTimeoutMs: API_TIMEOUT_MS,
    noLogEntry: true,
    ewrColo: true,
    bosControl: false,
    quantized: true,
    keepaliveS: KEEPALIVE_S,
    cue: "deadair",
    issue: FEATURED_ISSUE,
  };
}

export function seedSquelch() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    squelch: true,
    cue: "deadair",
  };
}

export function seedTimelyResponse() {
  return {
    seed: "timely-response",
    preferSeed: true,
    timelyResponse: true,
    responseBytes: 2048,
    timeoutLogged: true,
    cue: "carrier",
  };
}

export function seedEwrColo() {
  return {
    seed: "ewr-colo",
    ewrColo: true,
    bosControl: false,
    affectedPath: AFFECTED_PATH,
    transit: TRANSIT,
    cue: "deadair",
  };
}

export function seedKeepaliveAcked() {
  return {
    seed: "keepalive-acked",
    tcpEstablished: true,
    keepaliveAcked: true,
    keepaliveS: KEEPALIVE_S,
    responseBytes: 0,
    cue: "deadair",
  };
}

export function seedZeroResponseBytes() {
  return {
    seed: "zero-response-bytes",
    responseBytes: 0,
    uploadedBytes: UPLOADED_BYTES,
    retransmissions: 0,
    tcpEstablished: true,
    cue: "deadair",
  };
}

export function seedApiTimeout900s() {
  return {
    seed: "api-timeout-900s",
    apiTimeoutMs: API_TIMEOUT_MS,
    stallSeconds: 903.1,
    quantized: true,
    cue: "deadair",
  };
}

export function seedNoLogEntry() {
  return {
    seed: "no-log-entry",
    noLogEntry: true,
    timeoutLogged: false,
    retryLogged: false,
    errorLogged: false,
    logRetries: LOG_RETRIES,
    logApiErrors: LOG_API_ERRORS,
    cue: "deadair",
  };
}

export function seedQuantizedStalls() {
  return {
    seed: "quantized-stalls",
    quantized: true,
    stallSeconds: 903.1,
    apiTimeoutMs: API_TIMEOUT_MS,
    cue: "deadair",
  };
}

export function seedStreamIdle120s() {
  return {
    seed: "stream-idle-120s",
    streamIdle120: true,
    streamIdleS: STREAM_IDLE_S,
    streamIdleKnob: STREAM_IDLE_KNOB,
    cue: "deadair",
  };
}

export function seedCleanBosControl() {
  return {
    seed: "clean-bos-control",
    preferSeed: true,
    bosControl: true,
    ewrColo: false,
    timelyResponse: true,
    responseBytes: 2048,
    cleanPath: CLEAN_PATH,
    cue: "carrier",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      timelyResponse: false,
      timeoutLogged: false,
      retryLogged: false,
      errorLogged: false,
      tcpEstablished: false,
      keepaliveAcked: false,
      noLogEntry: false,
      ewrColo: false,
      bosControl: false,
      quantized: false,
      streamIdle120: false,
      squelch: false,
      responseBytes: null,
      uploadedBytes: null,
      retransmissions: null,
      stallSeconds: null,
      apiTimeoutMs: null,
      keepaliveS: null,
      logRetries: null,
      logApiErrors: null,
      streamIdleS: null,
      streamIdleKnob: null,
      affectedPath: null,
      cleanPath: null,
      transit: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    timelyResponse: raw.timelyResponse === true,
    timeoutLogged: raw.timeoutLogged === true,
    retryLogged: raw.retryLogged === true,
    errorLogged: raw.errorLogged === true,
    tcpEstablished: raw.tcpEstablished === true,
    keepaliveAcked: raw.keepaliveAcked === true,
    noLogEntry: raw.noLogEntry === true,
    ewrColo: raw.ewrColo === true,
    bosControl: raw.bosControl === true,
    quantized: raw.quantized === true,
    streamIdle120: raw.streamIdle120 === true,
    squelch: raw.squelch === true,
    responseBytes: raw.responseBytes ?? null,
    uploadedBytes: raw.uploadedBytes ?? null,
    retransmissions: raw.retransmissions ?? null,
    stallSeconds: raw.stallSeconds ?? null,
    apiTimeoutMs: raw.apiTimeoutMs ?? null,
    keepaliveS: raw.keepaliveS ?? null,
    logRetries: raw.logRetries ?? null,
    logApiErrors: raw.logApiErrors ?? null,
    streamIdleS: raw.streamIdleS ?? null,
    streamIdleKnob: raw.streamIdleKnob || null,
    affectedPath: raw.affectedPath || null,
    cleanPath: raw.cleanPath || null,
    transit: raw.transit || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.timelyResponse != null ||
        ticket.timeoutLogged != null ||
        ticket.retryLogged != null ||
        ticket.tcpEstablished != null ||
        ticket.keepaliveAcked != null ||
        ticket.responseBytes != null ||
        ticket.noLogEntry != null ||
        ticket.ewrColo != null ||
        ticket.squelch != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.stallSeconds != null ||
        ticket.apiTimeoutMs != null),
  );
}

function isCarrier(row) {
  if (row.squelch) return false;
  if (row.cue === "deadair") return false;
  if (
    row.tcpEstablished &&
    row.keepaliveAcked &&
    row.responseBytes === 0 &&
    row.noLogEntry
  ) {
    return false;
  }
  if (
    row.timelyResponse === true &&
    row.responseBytes != null &&
    row.responseBytes > 0 &&
    row.cue !== "deadair"
  ) {
    return true;
  }
  if (
    row.cue === "carrier" &&
    row.noLogEntry !== true &&
    !(row.responseBytes === 0 && row.keepaliveAcked)
  ) {
    return true;
  }
  return false;
}

function isDeadair(row) {
  if (row.squelch && row.cue !== "carrier") return false;
  if (row.cue === "deadair") return true;
  if (
    row.tcpEstablished &&
    row.keepaliveAcked &&
    row.responseBytes === 0 &&
    row.noLogEntry
  ) {
    return true;
  }
  if (
    row.ewrColo &&
    row.responseBytes === 0 &&
    (row.noLogEntry || row.timeoutLogged === false)
  ) {
    return true;
  }
  if (
    row.apiTimeoutMs === API_TIMEOUT_MS &&
    row.responseBytes === 0 &&
    row.noLogEntry
  ) {
    return true;
  }
  return false;
}

function isSquelchPath(row) {
  return row.squelch === true && !isCarrier(row);
}

/**
 * Score one API request pass against the deadair booth.
 * carrier: timely response (or a logged timeout/retry); productive circuit.
 * deadair: TCP alive + keepalive ACK + 0 response bytes + 900s silence + no log.
 * squelch: named path — a live keepalive with zero bytes is not a carrier.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isSquelchPath(row)) {
    verdict = "squelch";
  } else if (isDeadair(row)) {
    verdict = "deadair";
  } else if (isCarrier(row)) {
    verdict = "carrier";
  } else if (
    row.noLogEntry ||
    (row.responseBytes === 0 && row.keepaliveAcked) ||
    (row.ewrColo && row.responseBytes === 0) ||
    (row.apiTimeoutMs === API_TIMEOUT_MS && row.timeoutLogged === false)
  ) {
    verdict = "deadair";
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
    carrier: verdict === "carrier",
    deadair: verdict === "deadair" || verdict === SEEDED_WORD,
    squelch: verdict === "squelch" || verdict === PATH_WORD,
    timelyResponse: row.timelyResponse,
    timeoutLogged: row.timeoutLogged,
    retryLogged: row.retryLogged,
    errorLogged: row.errorLogged,
    tcpEstablished: row.tcpEstablished,
    keepaliveAcked: row.keepaliveAcked,
    noLogEntry: row.noLogEntry,
    ewrColo: row.ewrColo,
    bosControl: row.bosControl,
    quantized: row.quantized,
    streamIdle120: row.streamIdle120,
    responseBytes: row.responseBytes,
    uploadedBytes: row.uploadedBytes,
    retransmissions: row.retransmissions,
    stallSeconds: row.stallSeconds,
    apiTimeoutMs: row.apiTimeoutMs,
    keepaliveS: row.keepaliveS,
    logRetries: row.logRetries,
    logApiErrors: row.logApiErrors,
    streamIdleS: row.streamIdleS,
    streamIdleKnob: row.streamIdleKnob,
    affectedPath: row.affectedPath,
    cleanPath: row.cleanPath,
    transit: row.transit,
    cue: hold ? "carrier" : "deadair",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit carrier" : "score deadair",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : DEADAIR_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const deadair = scored.filter((row) => row.verdict === "deadair");
  const squelch = scored.filter((row) => row.verdict === "squelch");
  const carrier = scored.filter((row) => row.verdict === "carrier");
  const headline =
    scored.find((row) => row.event === "deadair") ||
    scored.find((row) => row.event === "no-log-entry") ||
    scored.find((row) => row.event === "zero-response-bytes") ||
    scored.find((row) => row.event === "squelch") ||
    deadair[deadair.length - 1];
  let verdict = "carrier";
  if (deadair.length) verdict = "deadair";
  else if (squelch.length && !carrier.length) verdict = "squelch";
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
    deadairCount: deadair.length,
    squelchCount: squelch.length,
    carrierCount: carrier.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit carrier" : "score deadair",
    note: headline
      ? "TCP ACKs + keepalives, 0 response bytes, 900s silent wait with nothing logged; then silent retry."
      : "published deadair walk scored against carrier vs deadair",
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
    seeded !== "carrier" &&
    seeded !== "deadair" &&
    seeded !== "squelch" &&
    ticket.timelyResponse == null &&
    ticket.tcpEstablished == null &&
    ticket.keepaliveAcked == null &&
    ticket.responseBytes == null &&
    ticket.noLogEntry == null &&
    ticket.squelch == null &&
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
    timelyResponse: scored.timelyResponse ?? false,
    timeoutLogged: scored.timeoutLogged ?? false,
    retryLogged: scored.retryLogged ?? false,
    tcpEstablished: scored.tcpEstablished ?? false,
    keepaliveAcked: scored.keepaliveAcked ?? false,
    noLogEntry: scored.noLogEntry ?? false,
    responseBytes: scored.responseBytes ?? null,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.timelyResponse ? "timely=yes" : "timely=no",
    result.keepaliveAcked ? "keepalive=acked" : "keepalive=none",
    result.responseBytes === 0 ? "rx=0" : "rx=bytes",
    result.noLogEntry ? "log=none" : "log=present",
    result.cue === "carrier" ? "cue=carrier" : "cue=deadair",
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
      author: AUTHOR,
      filed: FILED,
      client: CLIENT,
      os: OS,
      node: NODE,
      baseUrl: BASE_URL,
      proxy: PROXY,
      mcp: MCP,
      defender: DEFENDER,
      apiTimeoutMs: API_TIMEOUT_MS,
      uploadedBytes: UPLOADED_BYTES,
      responseBytes: RESPONSE_BYTES,
      retransmissions: RETRANSMISSIONS,
      keepaliveS: KEEPALIVE_S,
      packets: PACKETS,
      flows: FLOWS,
      ipv4: IPV4,
      ipv6: IPV6,
      port: PORT,
      affectedPath: AFFECTED_PATH,
      cleanPath: CLEAN_PATH,
      transit: TRANSIT,
      ordNote: ORD_NOTE,
      bosConcurrent: BOS_CONCURRENT,
      streamIdleS: STREAM_IDLE_S,
      streamIdleKnob: STREAM_IDLE_KNOB,
      freqAffected: FREQ_AFFECTED,
      freqClean: FREQ_CLEAN,
      weeksBlamedModem: WEEKS_BLAMED_MODEM,
      stallWindow: STALL_WINDOW,
      quantized1x: [...QUANTIZED_1X],
      quantized2x: [...QUANTIZED_2X],
      quantized3x: [...QUANTIZED_3X],
      logRetries: LOG_RETRIES,
      logApiErrors: LOG_API_ERRORS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "the circuit should keep the carrier live — timely HTTP response",
        "or at least log the timeout / retry when API_TIMEOUT_MS fires",
        "liveness check on long-silent streams (connection healthy + keepalives so client cannot tell still-thinking from will-never-answer)",
        "reconsider 900s default / surface progress; investigate EWR",
      ],
      hypothesis:
        "NON-BINDING: client may treat an Established TCP socket with keepalive ACKs as healthy progress and therefore skip timeout/retry logging for a full API_TIMEOUT_MS window even when zero response bytes arrive",
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
