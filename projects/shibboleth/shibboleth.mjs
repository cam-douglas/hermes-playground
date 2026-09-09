#!/usr/bin/env node
/**
 * Shibboleth — river-ford / border watchword booth.
 *
 * Educational diagnostic model for a published GrowthBook gate:
 * the bundled clientKey is rejected by cdn.growthbook.io with
 * HTTP 400 Invalid API Key, zero flags load, and `claude doctor`
 * reports the feature-flag service as unreachable (offline or
 * blocked) so Remote Control fails closed.
 *
 *   node shibboleth.mjs data/shibbolethed.json
 *   echo '{"seed":"shibbolethed"}' | node shibboleth.mjs
 *
 * Idle word is admitted (HOLD: key accepted, flags load, Remote
 * Control eligibility verified).
 * Path word is shibbolethed (bundled clientKey → 400 Invalid API
 * Key → zero flags → doctor says unreachable → Remote Control
 * fails closed).
 * Seeded recover word is countersigned (rotated/restored key
 * accepted; honest Invalid-API-Key surface instead of fake offline).
 *
 * Encoded from anthropics/claude-code#92966 issue body only.
 * Hypothesis (NON-BINDING): hardcoded GrowthBook clientKey
 * rejected upstream → flags fail closed → eligibility check
 * misreports as network unreachable. Invite verify against
 * #92966 text only.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop automation.
 * No payloads. No secrets beyond the already-public clientKey
 * string from the issue.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "admitted",
  "shibbolethed",
  "countersigned",
  "invalid-api-key",
  "zero-flags",
  "doctor-unreachable",
  "remote-control-closed",
  "channels-dark",
  "key-hardcoded",
  "curl-400",
  "cousins",
  "before-after",
  "fixtures",
  "proxy-ruled-out",
  "env-ruled-out",
]);

export const IDLE_WORD = "admitted";
export const PATH_WORD = "shibbolethed";
export const SEEDED_WORD = "countersigned";
export const HOLD = Object.freeze(["admitted"]);
export const RECOVER = Object.freeze(["countersigned"]);
export const ALARM = Object.freeze(VERDICTS.filter((name) => name !== "admitted"));
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "deeded",
  "parked",
  "epitaphed",
  "inscribed",
  "collated",
  "stereotyped",
  "emended",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "banked",
  "intact",
  "culled",
  "enrolled",
  "escheated",
  "as-penned",
  "rewritten",
  "rove",
  "vaulted",
  "cleared",
  "fouled",
  "voided",
  "snuffed",
  "tenured",
  "armed",
  "staked",
  "homesteaded",
]);
export const FORBIDDEN_SEED = Object.freeze([...FORBIDDEN_IDLE]);

export const FEATURED_ISSUE = 92966;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92966";
export const TITLE =
  '[BUG] Bundled GrowthBook clientKey still returns 400 "Invalid API Key" on 2.1.266 — Remote Control fails closed (regression/reopen of #64151)';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const VERSION = "2.1.266";
export const OS_NAME = "macOS arm64";
export const REPORTER = "achobgood";
export const FILED_AT = "2026-09-09T01:50:25Z";
export const CLIENT_KEY = "sdk-zAZezfDKGoZuXXKe";
export const API_HOST = "https://cdn.growthbook.io";
export const FEATURES_PATH = `/api/features/${CLIENT_KEY}`;
export const CURL_URL = `${API_HOST}${FEATURES_PATH}`;
export const HTTP_STATUS = 400;
export const ERROR_BODY = '{"status":400,"error":"Invalid API Key"}';
export const ERROR_PHRASE = "Invalid API Key";
export const CURL_HITS = 5;
export const FLAGS_LOADED_PATH = 0;
export const DOCTOR_HEADLINE =
  "Couldn't verify Remote Control eligibility — the feature-flag service was unreachable (offline or blocked). Retry, or run with --debug / claude doctor for details.";
export const DOCTOR_DETAIL =
  "Remote Control availability could not be verified (no server response this session)";
export const AUTH = Object.freeze({
  loggedIn: true,
  authMethod: "claude.ai",
  apiProvider: "firstParty",
  analyticsDisabled: false,
  subscriptionType: "max",
});
export const ENV_VARS_UNSET = Object.freeze([
  "DISABLE_TELEMETRY",
  "DISABLE_GROWTHBOOK",
  "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
  "DO_NOT_TRACK",
]);

export const COUSINS = Object.freeze([
  {
    issue: 64151,
    title:
      'Bundled GrowthBook clientKey intermittently returns 400 "Invalid API Key"',
    state: "CLOSED",
    citeOnly: true,
    why: "same key, same Invalid API Key symptom; closed stale 2026-09-05 without a fix — #92966 reopens it",
  },
  {
    issue: 92661,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 91717,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 89292,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 92683,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 33041,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 66556,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 92760,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
  {
    issue: 91459,
    title: "Remote Control cousin",
    citeOnly: true,
    why: "Remote Control surface cousin — cite only; do not build",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "homestead",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "quill",
  "colophon",
  "sallyport",
]);

/**
 * Published ford walk from #92966 only. Facts from the issue body —
 * no invented doctor lines beyond the published Remote Control text.
 */
export const GATE_WALK = Object.freeze([
  {
    t: "launch",
    event: "launch",
    version: VERSION,
    clientKey: CLIENT_KEY,
    keyHardcoded: true,
    keyAccepted: true,
    flagsLoaded: 1,
    remoteControlEligible: true,
    doctorFrame: "eligible",
  },
  {
    t: "speak",
    event: "growthbook-fetch",
    clientKey: CLIENT_KEY,
    apiHost: API_HOST,
    keyHardcoded: true,
    keyAccepted: true,
    flagsLoaded: 1,
    remoteControlEligible: true,
    doctorFrame: "eligible",
  },
  {
    t: "400",
    event: "cdn-400",
    clientKey: CLIENT_KEY,
    apiHost: API_HOST,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    errorBody: ERROR_BODY,
    keyAccepted: false,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
    curlHits: CURL_HITS,
  },
  {
    t: "flags",
    event: "zero-flags",
    clientKey: CLIENT_KEY,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    keyAccepted: false,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
  },
  {
    t: "doctor",
    event: "doctor-unreachable",
    clientKey: CLIENT_KEY,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    keyAccepted: false,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    doctorHeadline: DOCTOR_HEADLINE,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
  },
  {
    t: "gate",
    event: "remote-control-closed",
    clientKey: CLIENT_KEY,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    keyAccepted: false,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
    proxyRuledOut: true,
    envVarsUnset: true,
    authValid: true,
  },
  {
    t: "channels",
    event: "channels-dark",
    clientKey: CLIENT_KEY,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    keyAccepted: false,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
  },
]);

export function curlLine(key = CLIENT_KEY) {
  return `curl ${API_HOST}/api/features/${key}`;
}

export function errorBlock(body = ERROR_BODY) {
  return `HTTP ${HTTP_STATUS} ${body}`;
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    clientKey: CLIENT_KEY,
    apiHost: API_HOST,
    keyAccepted: true,
    httpStatus: 200,
    invalidApiKey: false,
    flagsLoaded: 12,
    doctorFrame: "eligible",
    doctorUnreachable: false,
    honestSurface: true,
    remoteControlEligible: true,
    remoteControlClosed: false,
    channelsDark: false,
    keyHardcoded: true,
    keyRotated: false,
    proxyRuledOut: true,
    envVarsUnset: true,
    authValid: true,
  };
}

export function seedAdmitted() {
  return { ...emptyTicket() };
}

export function seedShibbolethed() {
  return {
    seed: PATH_WORD,
    clientKey: CLIENT_KEY,
    apiHost: API_HOST,
    keyAccepted: false,
    httpStatus: HTTP_STATUS,
    error: ERROR_PHRASE,
    errorBody: ERROR_BODY,
    invalidApiKey: true,
    flagsLoaded: FLAGS_LOADED_PATH,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    doctorHeadline: DOCTOR_HEADLINE,
    doctorDetail: DOCTOR_DETAIL,
    honestSurface: false,
    remoteControlEligible: false,
    remoteControlClosed: true,
    channelsDark: true,
    keyHardcoded: true,
    keyRotated: false,
    curlHits: CURL_HITS,
    proxyRuledOut: true,
    envVarsUnset: true,
    authValid: true,
    version: VERSION,
  };
}

export function seedCountersigned() {
  return {
    seed: SEEDED_WORD,
    clientKey: "sdk-rotated-restored",
    apiHost: API_HOST,
    keyAccepted: true,
    httpStatus: 200,
    invalidApiKey: false,
    flagsLoaded: 12,
    doctorFrame: "eligible",
    doctorUnreachable: false,
    honestSurface: true,
    remoteControlEligible: true,
    remoteControlClosed: false,
    channelsDark: false,
    keyHardcoded: false,
    keyRotated: true,
    proxyRuledOut: true,
    envVarsUnset: true,
    authValid: true,
  };
}

export function normalizeGate(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      clientKey: null,
      apiHost: API_HOST,
      keyAccepted: false,
      httpStatus: null,
      error: null,
      errorBody: null,
      invalidApiKey: false,
      flagsLoaded: 0,
      doctorFrame: null,
      doctorUnreachable: false,
      honestSurface: false,
      remoteControlEligible: false,
      remoteControlClosed: false,
      channelsDark: false,
      keyHardcoded: false,
      keyRotated: false,
      curlHits: 0,
      proxyRuledOut: false,
      envVarsUnset: false,
      authValid: false,
    };
  }
  const httpStatus =
    raw.httpStatus != null
      ? Number(raw.httpStatus)
      : raw.status != null
        ? Number(raw.status)
        : null;
  const flagsLoaded =
    raw.flagsLoaded != null
      ? Number(raw.flagsLoaded)
      : raw.growthBookFeaturesLoaded != null
        ? Number(raw.growthBookFeaturesLoaded)
        : 0;
  const doctorFrame =
    raw.doctorFrame ||
    (raw.doctorUnreachable === true
      ? "unreachable"
      : raw.honestSurface === true && raw.keyAccepted === false
        ? "invalid-api-key"
        : raw.remoteControlEligible === true
          ? "eligible"
          : null);
  const invalidApiKey =
    raw.invalidApiKey === true ||
    raw.error === ERROR_PHRASE ||
    (typeof raw.errorBody === "string" && raw.errorBody.includes(ERROR_PHRASE)) ||
    (httpStatus === 400 && raw.keyAccepted === false);
  return {
    clientKey: raw.clientKey || raw.key || null,
    apiHost: raw.apiHost || API_HOST,
    keyAccepted: raw.keyAccepted === true,
    httpStatus,
    error: raw.error || (invalidApiKey ? ERROR_PHRASE : null),
    errorBody: raw.errorBody || null,
    invalidApiKey,
    flagsLoaded,
    doctorFrame,
    doctorUnreachable:
      raw.doctorUnreachable === true || doctorFrame === "unreachable",
    honestSurface:
      raw.honestSurface === true ||
      doctorFrame === "invalid-api-key" ||
      doctorFrame === "eligible",
    remoteControlEligible: raw.remoteControlEligible === true,
    remoteControlClosed:
      raw.remoteControlClosed === true || raw.remoteControlEligible === false,
    channelsDark: raw.channelsDark === true || raw.channelsAvailable === false,
    keyHardcoded: raw.keyHardcoded === true,
    keyRotated: raw.keyRotated === true,
    curlHits: raw.curlHits != null ? Number(raw.curlHits) : 0,
    proxyRuledOut: raw.proxyRuledOut === true,
    envVarsUnset: raw.envVarsUnset === true,
    authValid: raw.authValid === true,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    version: raw.version || null,
  };
}

function hasGateFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.clientKey != null ||
        ticket.keyAccepted != null ||
        ticket.httpStatus != null ||
        ticket.invalidApiKey != null ||
        ticket.flagsLoaded != null ||
        ticket.doctorFrame != null ||
        ticket.doctorUnreachable != null ||
        ticket.remoteControlEligible != null ||
        ticket.remoteControlClosed != null ||
        ticket.channelsDark != null ||
        ticket.keyHardcoded != null ||
        ticket.keyRotated != null ||
        ticket.honestSurface != null ||
        ticket.event),
  );
}

/**
 * Score one ford crossing against the GrowthBook watchword gate.
 * admitted: key accepted; flags load; doctor verifies eligibility;
 *   Remote Control stays open.
 * shibbolethed: bundled clientKey → 400 Invalid API Key → zero flags
 *   → doctor says unreachable → Remote Control fails closed.
 * countersigned: rotated/restored key accepted; honest Invalid-API-Key
 *   surface instead of fake offline.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeGate(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const keyRejected =
    row.keyAccepted === false &&
    (row.httpStatus === 400 || row.invalidApiKey);
  const zeroFlags = row.flagsLoaded === 0;
  const doctorLies = row.doctorFrame === "unreachable" || row.doctorUnreachable;
  const rcClosed =
    row.remoteControlClosed || row.remoteControlEligible === false;
  const keyOk = row.keyAccepted === true && row.httpStatus !== 400;
  const flagsOk = row.flagsLoaded > 0;
  const doctorHonest =
    row.honestSurface &&
    row.doctorFrame !== "unreachable" &&
    !row.doctorUnreachable;
  const rcOpen = row.remoteControlEligible === true && !row.remoteControlClosed;

  let verdict = IDLE_WORD;
  if (keyRejected && zeroFlags && doctorLies && rcClosed) {
    verdict = "shibbolethed";
  } else if (row.keyRotated && keyOk && flagsOk && doctorHonest && rcOpen) {
    verdict = "countersigned";
  } else if (keyOk && flagsOk && rcOpen && doctorHonest) {
    verdict = "admitted";
  } else if (keyRejected && zeroFlags && rcClosed) {
    verdict = "shibbolethed";
  }

  if (seeded && (!hasGateFields(ticket) || ticket.preferSeed === true)) {
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
    admitted: verdict === "admitted",
    shibbolethed: verdict === "shibbolethed",
    countersigned: verdict === "countersigned" || verdict === SEEDED_WORD,
    clientKey: row.clientKey,
    apiHost: row.apiHost,
    keyAccepted: row.keyAccepted,
    httpStatus: row.httpStatus,
    error: row.error,
    errorBody: row.errorBody,
    invalidApiKey: row.invalidApiKey,
    flagsLoaded: row.flagsLoaded,
    zeroFlags,
    doctorFrame: row.doctorFrame,
    doctorUnreachable: row.doctorUnreachable,
    honestSurface: row.honestSurface,
    remoteControlEligible: row.remoteControlEligible,
    remoteControlClosed: rcClosed,
    channelsDark: row.channelsDark,
    keyHardcoded: row.keyHardcoded,
    keyRotated: row.keyRotated,
    curlHits: row.curlHits,
    proxyRuledOut: row.proxyRuledOut,
    envVarsUnset: row.envVarsUnset,
    authValid: row.authValid,
    event: row.event,
    t: row.t,
    version: row.version,
    phrase: hold ? "admit admitted" : "score shibbolethed",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : GATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeGate(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const shibbolethed = scored.filter((row) => row.verdict === "shibbolethed");
  const countersigned = scored.filter((row) => row.verdict === "countersigned");
  const admitted = scored.filter((row) => row.verdict === "admitted");
  const headline =
    scored.find((row) => row.event === "remote-control-closed") ||
    shibbolethed[shibbolethed.length - 1];
  let verdict = "admitted";
  if (shibbolethed.length) verdict = "shibbolethed";
  else if (countersigned.length && !admitted.length) verdict = "countersigned";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "admitted",
    alarm: verdict !== "admitted",
    shibbolethedCount: shibbolethed.length,
    countersignedCount: countersigned.length,
    admittedCount: admitted.length,
    headline,
    rows: scored,
    phrase: verdict === "admitted" ? "admit admitted" : "score shibbolethed",
    note: headline
      ? "bundled clientKey returns 400 Invalid API Key; zero flags; doctor says unreachable; Remote Control fails closed"
      : "published GrowthBook watchword walk scored against admitted vs shibbolethed",
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
    seeded !== "admitted" &&
    seeded !== "shibbolethed" &&
    seeded !== "countersigned" &&
    ticket.keyAccepted == null &&
    ticket.httpStatus == null &&
    ticket.flagsLoaded == null &&
    ticket.doctorFrame == null &&
    ticket.remoteControlEligible == null &&
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
      : seeded && !hasGateFields(ticket) && !multi
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
    errorBlock: errorBlock(),
    doctorHeadline: DOCTOR_HEADLINE,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.keyAccepted ? "key=ok" : "key=400",
    result.flagsLoaded > 0 ? "flags=load" : "flags=zero",
    result.doctorUnreachable ? "doctor=unreachable" : "doctor=honest",
    result.remoteControlEligible ? "rc=open" : "rc=closed",
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
      version: VERSION,
      os: OS_NAME,
      reporter: REPORTER,
      filedAt: FILED_AT,
      clientKey: CLIENT_KEY,
      apiHost: API_HOST,
      curlUrl: CURL_URL,
      httpStatus: HTTP_STATUS,
      errorBody: ERROR_BODY,
      curlHits: CURL_HITS,
      flagsLoadedPath: FLAGS_LOADED_PATH,
      doctorHeadline: DOCTOR_HEADLINE,
      doctorDetail: DOCTOR_DETAIL,
      auth: { ...AUTH },
      envVarsUnset: [...ENV_VARS_UNSET],
      proxyRuledOut: true,
      keyHardcoded: true,
      workaround: "rotate/restore the GrowthBook clientKey so the CDN accepts it",
      hypothesis:
        "hardcoded GrowthBook clientKey rejected upstream → flags fail closed → eligibility check misreports as network unreachable",
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
