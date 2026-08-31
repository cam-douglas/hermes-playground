#!/usr/bin/env node
/**
 * Bitting — locksmith's bitting-bench classifier.
 * A sibling key with yesterday's cut is not a hold.
 * Score the tumblers or admit seated.
 *
 *   echo '{"concurrentSessions":true,"sharedCredential":true}' | node bitting.mjs
 *   node bitting.mjs ticket.json
 *
 * Idle word is seated (key seats; tumblers align; initialize answers).
 * Seeded state is bound / #90970.
 * NEVER idle as "bitting", "bound", "token", "timeout", "mcp",
 * "slack", "hallmarked", "pointed", "collapsed", "spoiled",
 * "banked", "misstruck", "hunting", "traced".
 *
 * Primary #90970: Slack MCP http protocol-negotiation probe
 * hangs → 30s CONNECT_TIMEOUT in every concurrent Claude Code
 * session except the one that most recently minted an OAuth
 * token. plugin:slack:slack (https://mcp.slack.com/mcp).
 * Endpoint is healthy; stored token was valid for the minting
 * session. http-transport version-negotiation probe gets no
 * answer (fixed 5s), falls back to pinned legacy, exhausts
 * remaining 30s budget. Gated by server-side flag
 * tengu_mcp_protocol_negotiation_http = true. All sessions
 * share one credential entry (Slack plugin fixed
 * callbackPort: 3118). Session b35777c5 successfully called
 * slack_read_thread while session 40a9b36f hit version
 * negotiation probe timeout / CONNECT_TIMEOUT. When a stale
 * token is cleanly rejected: unauthorized: AuthenticateToken
 * authentication failed in 0.4–10s, but slack is never written
 * to ~/.claude/mcp-needs-auth-cache.json (unlike linear,
 * google-workspace-*, databricks, figma) → no re-auth prompt;
 * silent retry into 30s timeout. 15 distinct session IDs hit
 * this on 2026-08-31.
 *
 * Related (cite, not primary): #77130 one session /login/refresh
 * invalidates connectors in all other concurrent sessions;
 * #48993; #43000; #51319 / slackapi/slack-mcp-plugin#46.
 *
 * Contrast: clean AuthenticateToken reject in 0.4–10s vs
 * probe hang mislabeled as CONNECT_TIMEOUT. Slack absent from
 * the needs-auth cache.
 * NOT Reed, Fusee, Visa, Hasp, Parity, Fathom, Knock, Quench,
 * Puncheon, Gnomon, Spoil, Trammel.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "bound",
  "seated",
  "token-mint",
  "session-exclusivity",
  "protocol-negotiation",
  "connect-timeout",
  "shared-credential",
  "stale-token",
  "needs-auth-miss",
  "pinned-legacy",
  "probe-hang",
  "concurrent-sessions",
  "misattributed-network",
  "rebroadcast",
]);
export const IDLE_WORD = "seated";
export const SEEDED_WORD = "bound";
export const HOLD_VERDICTS = Object.freeze(["seated"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "seated"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90970;
export const PRIMARY_ISSUES = Object.freeze([90970]);
export const SAME_CLASS = Object.freeze([77130, 48993, 43000, 51319]);
export const SLACK_PLUGIN_ISSUE = 46;
export const NOT_PRODUCTS = Object.freeze([
  "reed",
  "fusee",
  "visa",
  "hasp",
  "parity",
  "fathom",
  "knock",
  "quench",
  "puncheon",
  "gnomon",
  "spoil",
  "trammel",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90970";
export const TITLE =
  "[BUG] Slack MCP: http protocol-negotiation probe hangs → 30s CONNECT_TIMEOUT in every session except the one that most recently minted a token.";
export const REPORTER = "mocca102";
export const FILED_AT = "2026-08-31T12:22:25Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:mcp",
]);
export const PLUGIN = "plugin:slack:slack";
export const ENDPOINT = "https://mcp.slack.com/mcp";
export const CALLBACK_PORT = 3118;
export const FLAG = "tengu_mcp_protocol_negotiation_http";
export const PROBE_MS = 5000;
export const CONNECT_TIMEOUT_MS = 30000;
export const CLEAN_REJECT_MIN_S = 0.4;
export const CLEAN_REJECT_MAX_S = 10;
export const DISTINCT_SESSIONS = 15;
export const WORKING_SESSION = "b35777c5";
export const HUNG_SESSION = "40a9b36f";
export const WORKING_TOOL = "slack_read_thread";
export const AUTH_ERROR = "unauthorized: AuthenticateToken authentication failed";
export const NEEDS_AUTH_CACHE = "~/.claude/mcp-needs-auth-cache.json";
export const CACHE_PRESENT = Object.freeze([
  "linear",
  "google-workspace-*",
  "databricks",
  "figma",
]);
export const CACHE_ABSENT = "slack";
export const HUB_LINE =
  "22:50 bitting: a sibling key with yesterday's cut is not a hold. Score the tumblers or admit seated.";
export const MARK = "22:50 / hermes catalog #96 / #90970";
export const PHRASE = "a sibling key with yesterday's cut is not a hold";
export const CONTRAST_NOTE =
  "clean AuthenticateToken reject in 0.4–10s vs probe hang mislabeled as CONNECT_TIMEOUT; slack is never written to mcp-needs-auth-cache.json";
export const HYPOTHESIS_NOTE =
  "A key's bitting is the cut pattern that must match the tumblers. Only the most recently cut key (most recently minted OAuth token) turns the lock. Sibling sessions still hold the previous cut — they bind in the wards and hang, reported as a network timeout instead of a wrong key.";
export const FORBIDDEN_IDLE = Object.freeze([
  "bitting",
  "bound",
  "token",
  "timeout",
  "mcp",
  "slack",
  "hallmarked",
  "pointed",
  "collapsed",
  "spoiled",
  "banked",
  "misstruck",
  "hunting",
  "traced",
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
    mostRecentMint: null,
    concurrentSessions: null,
    sharedCredential: null,
    probeHang: null,
    protocolNegotiation: null,
    pinnedLegacy: null,
    connectTimeout: null,
    staleToken: null,
    needsAuthMiss: null,
    cleanReject: null,
    siblingWorking: null,
    healthyEndpoint: null,
    flagGated: null,
    seatedHold: null,
    sessionId: "",
    siblingSessionId: "",
    distinctSessions: null,
    callbackPort: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedSeated();
}

export function seedSeated() {
  return {
    seed: IDLE_WORD,
    issue: null,
    mostRecentMint: true,
    concurrentSessions: false,
    sharedCredential: false,
    probeHang: false,
    protocolNegotiation: false,
    pinnedLegacy: false,
    connectTimeout: false,
    staleToken: false,
    needsAuthMiss: false,
    cleanReject: false,
    siblingWorking: false,
    healthyEndpoint: true,
    flagGated: false,
    seatedHold: true,
    sessionId: "",
    siblingSessionId: "",
    distinctSessions: 1,
    callbackPort: CALLBACK_PORT,
    outputText:
      "key seats; tumblers align; initialize answers; seated",
  };
}

export function seedBound() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    plugin: PLUGIN,
    endpoint: ENDPOINT,
    mostRecentMint: false,
    concurrentSessions: true,
    sharedCredential: true,
    probeHang: true,
    protocolNegotiation: true,
    pinnedLegacy: true,
    connectTimeout: true,
    staleToken: true,
    needsAuthMiss: true,
    cleanReject: false,
    siblingWorking: true,
    healthyEndpoint: true,
    flagGated: true,
    seatedHold: false,
    sessionId: HUNG_SESSION,
    siblingSessionId: WORKING_SESSION,
    distinctSessions: DISTINCT_SESSIONS,
    callbackPort: CALLBACK_PORT,
    flag: FLAG,
    probeMs: PROBE_MS,
    connectTimeoutMs: CONNECT_TIMEOUT_MS,
    workingTool: WORKING_TOOL,
    sameClass: [...SAME_CLASS],
    slackPlugin: SLACK_PLUGIN_ISSUE,
    outputText:
      "plugin:slack:slack https://mcp.slack.com/mcp fails in every concurrent session except the one that most recently minted an OAuth token; CONNECT_TIMEOUT after 30000ms; endpoint is healthy; stored token was valid for the minting session; http-transport version-negotiation probe gets no answer (fixed 5s), falls back to pinned legacy, exhausts remaining 30s budget; tengu_mcp_protocol_negotiation_http = true; all sessions share one credential entry (Slack plugin fixed callbackPort: 3118); session b35777c5 successfully called slack_read_thread while session 40a9b36f hit version negotiation probe timeout / CONNECT_TIMEOUT; slack is never written to ~/.claude/mcp-needs-auth-cache.json (unlike linear, google-workspace-*, databricks, figma); 15 distinct session IDs; misattributed as a network timeout instead of a wrong key",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.bitting && typeof src.bitting === "object" && src.bitting) ||
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
    mostRecentMint: firstBool(
      nested.mostRecentMint,
      nested.most_recent_mint,
      nested.tokenMint,
      src.mostRecentMint,
    ),
    concurrentSessions: firstBool(
      nested.concurrentSessions,
      nested.concurrent_sessions,
      src.concurrentSessions,
    ),
    sharedCredential: firstBool(
      nested.sharedCredential,
      nested.shared_credential,
      src.sharedCredential,
    ),
    probeHang: firstBool(
      nested.probeHang,
      nested.probe_hang,
      src.probeHang,
    ),
    protocolNegotiation: firstBool(
      nested.protocolNegotiation,
      nested.protocol_negotiation,
      src.protocolNegotiation,
    ),
    pinnedLegacy: firstBool(
      nested.pinnedLegacy,
      nested.pinned_legacy,
      src.pinnedLegacy,
    ),
    connectTimeout: firstBool(
      nested.connectTimeout,
      nested.connect_timeout,
      src.connectTimeout,
    ),
    staleToken: firstBool(
      nested.staleToken,
      nested.stale_token,
      src.staleToken,
    ),
    needsAuthMiss: firstBool(
      nested.needsAuthMiss,
      nested.needs_auth_miss,
      src.needsAuthMiss,
    ),
    cleanReject: firstBool(
      nested.cleanReject,
      nested.clean_reject,
      src.cleanReject,
    ),
    siblingWorking: firstBool(
      nested.siblingWorking,
      nested.sibling_working,
      src.siblingWorking,
    ),
    healthyEndpoint: firstBool(
      nested.healthyEndpoint,
      nested.healthy_endpoint,
      src.healthyEndpoint,
    ),
    flagGated: firstBool(
      nested.flagGated,
      nested.flag_gated,
      src.flagGated,
    ),
    seatedHold: firstBool(
      nested.seatedHold,
      nested.seated_hold,
      src.seatedHold,
    ),
    sessionId: firstText(nested.sessionId, nested.session_id, src.sessionId),
    siblingSessionId: firstText(
      nested.siblingSessionId,
      nested.sibling_session_id,
      src.siblingSessionId,
    ),
    distinctSessions: firstNum(
      nested.distinctSessions,
      nested.distinct_sessions,
      src.distinctSessions,
    ),
    callbackPort: firstNum(
      nested.callbackPort,
      nested.callback_port,
      src.callbackPort,
    ),
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
  return (
    input.concurrentSessions == null &&
    input.sharedCredential == null &&
    input.probeHang == null &&
    input.connectTimeout == null &&
    input.seatedHold == null &&
    input.mostRecentMint == null
  );
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
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedBound(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedBound(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedSeated(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) && named !== IDLE_WORD && named !== SEEDED_WORD;
  const concurrent =
    row.concurrentSessions === true ||
    /concurrent (Claude Code )?sessions|every concurrent session|15 distinct session/i.test(
      text,
    );
  const sharedCred =
    row.sharedCredential === true ||
    /share one credential|shared-credential|callbackPort:\s*3118|callbackPort 3118/i.test(
      text,
    );
  const tokenMint =
    row.mostRecentMint === true ||
    /most recently minted|token-mint|minted an OAuth token/i.test(text);
  const exclusive =
    /session-exclusivity|except the one that most recently minted|only the most recently/i.test(
      text,
    ) ||
    (tokenMint && concurrent);
  const proto =
    row.protocolNegotiation === true ||
    /protocol-negotiation|version-negotiation|tengu_mcp_protocol_negotiation_http/i.test(
      text,
    );
  const hang =
    row.probeHang === true ||
    /probe hangs|probe-hang|probe gets no answer|version negotiation probe timeout/i.test(
      text,
    );
  const pinned =
    row.pinnedLegacy === true ||
    /pinned legacy|pinned-legacy/i.test(text);
  const timeout =
    row.connectTimeout === true ||
    /CONNECT_TIMEOUT|connect-timeout|30000ms|30s budget/i.test(text);
  const stale =
    row.staleToken === true ||
    /stale-token|stale token|previous cut|yesterday's cut/i.test(text);
  const cacheMiss =
    row.needsAuthMiss === true ||
    /needs-auth-miss|slack is never written|mcp-needs-auth-cache/i.test(text);
  const mislabeled =
    /misattributed-network|mislabeled as CONNECT_TIMEOUT|reported as a network timeout/i.test(
      text,
    ) ||
    (timeout && hang && !namedAlarm);
  const rebroadcast =
    /rebroadcast|#77130|login\/refresh invalidates/i.test(text);
  const clean =
    row.cleanReject === true ||
    /AuthenticateToken authentication failed|clean reject/i.test(text);
  const sibling =
    row.siblingWorking === true ||
    /b35777c5|slack_read_thread while session/i.test(text);
  const healthy =
    row.healthyEndpoint === true ||
    /endpoint is healthy/i.test(text);
  const gated =
    row.flagGated === true ||
    /tengu_mcp_protocol_negotiation_http\s*=\s*true/i.test(text);
  const seatedHold =
    row.seatedHold === true ||
    (/key seats|tumblers align|initialize answers/i.test(text) && !namedAlarm);
  const seated =
    !namedAlarm &&
    seatedHold &&
    !hang &&
    !timeout &&
    !stale &&
    !cacheMiss;
  const bound =
    !namedAlarm &&
    concurrent &&
    sharedCred &&
    hang &&
    timeout &&
    stale &&
    cacheMiss &&
    !clean &&
    !seated;
  return {
    concurrent,
    sharedCred,
    tokenMint,
    exclusive,
    proto,
    hang,
    pinned,
    timeout,
    stale,
    cacheMiss,
    mislabeled,
    rebroadcast,
    clean,
    sibling,
    healthy,
    gated,
    seatedHold,
    seated,
    bound,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.bound) chips.push("bound");
  if (flags.seated) chips.push("seated");
  if (flags.tokenMint && !flags.seated) chips.push("token-mint");
  if (flags.exclusive && !flags.seated) chips.push("session-exclusivity");
  if (flags.proto && !flags.seated) chips.push("protocol-negotiation");
  if (flags.timeout && !flags.seated) chips.push("connect-timeout");
  if (flags.sharedCred && !flags.seated) chips.push("shared-credential");
  if (flags.stale && !flags.seated) chips.push("stale-token");
  if (flags.cacheMiss && !flags.seated) chips.push("needs-auth-miss");
  if (flags.pinned && !flags.seated) chips.push("pinned-legacy");
  if (flags.hang && !flags.seated) chips.push("probe-hang");
  if (flags.concurrent && !flags.seated) chips.push("concurrent-sessions");
  if (flags.mislabeled && !flags.seated) chips.push("misattributed-network");
  if (flags.rebroadcast && !flags.seated) chips.push("rebroadcast");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "seated") {
    reasons.push("key seats; tumblers align; initialize answers");
    reasons.push("hold: this is a seated key, not a bound sibling");
  }
  if (flags.concurrent) {
    reasons.push(
      "15 distinct session IDs hit this on 2026-08-31; every concurrent session except the most recent mint fails",
    );
  }
  if (flags.sharedCred) {
    reasons.push(
      "all sessions share one credential entry (Slack plugin fixed callbackPort: 3118)",
    );
  }
  if (flags.tokenMint || flags.exclusive) {
    reasons.push(
      "only the session that most recently minted an OAuth token turns the lock",
    );
  }
  if (flags.proto || flags.gated) {
    reasons.push(
      "gated by server-side flag tengu_mcp_protocol_negotiation_http = true",
    );
  }
  if (flags.hang) {
    reasons.push(
      "http-transport version-negotiation probe gets no answer (fixed 5s)",
    );
  }
  if (flags.pinned) {
    reasons.push("falls back to pinned legacy after the 5s probe");
  }
  if (flags.timeout) {
    reasons.push(
      "exhausts remaining 30s budget; surfaces as CONNECT_TIMEOUT after 30000ms",
    );
  }
  if (flags.stale) {
    reasons.push(
      "stored token was valid for the minting session; sibling holds the previous cut",
    );
  }
  if (flags.cacheMiss) {
    reasons.push(
      "slack is never written to ~/.claude/mcp-needs-auth-cache.json (unlike linear, google-workspace-*, databricks, figma) — no re-auth prompt",
    );
  }
  if (flags.sibling) {
    reasons.push(
      "session b35777c5 successfully called slack_read_thread while session 40a9b36f hit version negotiation probe timeout / CONNECT_TIMEOUT",
    );
  }
  if (flags.healthy) {
    reasons.push("endpoint https://mcp.slack.com/mcp is healthy");
  }
  if (flags.clean) {
    reasons.push(
      "when a stale token is cleanly rejected: unauthorized: AuthenticateToken authentication failed in 0.4–10s",
    );
  }
  if (flags.mislabeled) {
    reasons.push(
      "bind in the wards is reported as a network timeout instead of a wrong key",
    );
  }
  if (flags.rebroadcast) {
    reasons.push(
      "related #77130: one session /login/refresh invalidates connectors in all other concurrent sessions",
    );
  }
  if (flags.bound) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  if (verdict !== "seated" && (flags.clean || flags.cacheMiss)) {
    reasons.push(CONTRAST_NOTE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags, chips) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.seated) return "seated";
  if (named === SEEDED_WORD) return "bound";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.bound) return "bound";
  if (flags.rebroadcast) return "rebroadcast";
  if (flags.mislabeled) return "misattributed-network";
  if (flags.cacheMiss) return "needs-auth-miss";
  if (flags.hang) return "probe-hang";
  if (flags.pinned) return "pinned-legacy";
  if (flags.timeout) return "connect-timeout";
  if (flags.proto) return "protocol-negotiation";
  if (flags.stale) return "stale-token";
  if (flags.sharedCred) return "shared-credential";
  if (flags.exclusive) return "session-exclusivity";
  if (flags.tokenMint) return "token-mint";
  if (flags.concurrent) return "concurrent-sessions";
  if (flags.seated) return "seated";
  return "seated";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "seated";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    seated: verdict === "seated" || flags.seated,
    bound: verdict === "bound" || flags.bound,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      ring: flags.concurrent
        ? "15 sibling keys on one ring; only the newest cut turns"
        : "one key; the tumblers seat",
      probe: flags.hang
        ? "5s negotiation gets no answer → pinned legacy → 30s CONNECT_TIMEOUT"
        : flags.clean
          ? "AuthenticateToken reject in 0.4–10s"
          : "initialize answers; no probe hang",
      cache: flags.cacheMiss
        ? "slack ABSENT from ~/.claude/mcp-needs-auth-cache.json"
        : "needs-auth cache is not in play",
      lock: flags.bound
        ? "stale bitting binds in the wards; reported as a network timeout"
        : flags.seated
          ? "key seats; tumblers align"
          : "lock not yet scored",
      note: flags.bound
        ? "A sibling key with yesterday's cut is not a hold. Score the tumblers or admit seated."
        : flags.clean || flags.cacheMiss
          ? CONTRAST_NOTE
          : "Seated: key seats; tumblers align; initialize answers.",
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
  if (name === SEEDED_WORD || name === 90970 || name === "90970") {
    return analyze(seedBound());
  }
  if (name === IDLE_WORD || name === "seated") {
    return analyze(seedSeated());
  }
  return analyze(seedSeated());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.bound
        ? `bound bitting #${FEATURED_ISSUE}: ${PLUGIN} ${ENDPOINT}; session ${HUNG_SESSION} CONNECT_TIMEOUT while ${WORKING_SESSION} ${WORKING_TOOL}; slack absent from ${NEEDS_AUTH_CACHE}. ${HYPOTHESIS_NOTE}`
        : `seated bench. Idle word ${IDLE_WORD}. Key seats; tumblers align; initialize answers.`,
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
