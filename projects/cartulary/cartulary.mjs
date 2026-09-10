#!/usr/bin/env node
/**
 * Cartulary — monastic charter-register / cartulary-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * ~/.claude/.credentials.json → mcpOAuth grows without bound. Every
 * new session re-stores the OAuth record for each claude.ai connector
 * under a new key and a new serverUrl even though the access/refresh
 * token is identical. Observed 1,681 records / 906 KB, same token ×113.
 * serverUrl is session-scoped (CCR session path). Record key is
 * <ServerName>|<16-hex hash> derived from that URL. Only 2 of 1,681
 * records carry expiresAt.
 *
 *   node cartulary.mjs data/cartulary.json
 *   echo '{"seed":"accreted"}' | node cartulary.mjs
 *
 * Idle word is bound (HOLD: one record per connector; key by
 * mcp_server_id not session URL; update in place; prune ended
 * sessions; identical tokens deduped; credentials.json stays small).
 * Seeded word is accreted (#93331: session-scoped serverUrl re-keys
 * every session; same token ×113; 1,681 / 906 KB).
 * Path word is session-url.
 * Product score word is cartulary (score cartulary or admit bound).
 *
 * Encoded from anthropics/claude-code#93331 issue body only.
 * Hypothesis (NON-BINDING): credential key derived from session-scoped
 * CCR MCP URL instead of stable connector / mcp_server_id.
 * Verify against #93331 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "bound",
  "accreted",
  "cartulary",
  "session-url",
  "hold",
  "mcp-oauth",
  "session-scoped",
  "fresh-key",
  "identical-tokens",
  "no-expires",
  "times-113",
  "records-1681",
  "connectors-29",
  "growth-28",
  "stable-key",
  "prune-ended",
  "dedupe-write",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "bound";
export const PATH_WORD = "session-url";
export const SEEDED_WORD = "accreted";
export const PRODUCT_WORD = "cartulary";
export const HOLD = Object.freeze(["bound", "hold"]);
export const RECOVER = Object.freeze(["bound", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "afloat",
  "washed",
  "bridge-loss",
  "pontoon",
  "concordant",
  "mismatched-header",
  "header-mismatch",
  "concordat",
  "reaped",
  "revenant",
  "wedged",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
  "precedence",
  "carrier",
  "moored",
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "accreted" && name !== "cartulary"),
);

export const FEATURED_ISSUE = 93331;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93331";
export const TITLE =
  "[BUG] .credentials.json mcpOAuth grows unbounded: claude.ai connector tokens re-stored under a session-scoped serverUrl every session (1,681 records / 906 KB, same token ×113)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:auth",
  "area:mcp",
  "area:security",
]);
export const AUTHOR = "kevinmcmurphy";
export const FILED = "2026-09-10T11:40:38Z";
export const CLAUDE_CODE_VERSION = "2.1.265";
export const OS = "macOS 26 (Darwin 25.3.0), Apple Silicon";
export const AUTH_MODE = "claude.ai login (no API key)";
export const CREDENTIALS_PATH = "~/.claude/.credentials.json";
export const STORE_KEY = "mcpOAuth";
export const RECORD_COUNT = 1681;
export const FILE_SIZE_KB = 906;
export const CONNECTOR_COUNT = 29;
export const RECORDS_PER_CONNECTOR = 113;
export const DISTINCT_ACCESS_TOKENS = 1;
export const DISTINCT_REFRESH_TOKENS = 1;
export const DISTINCT_SERVER_URLS = 113;
export const DISTINCT_CLIENT_IDS = 113;
export const EXPIRES_AT_COUNT = 2;
export const GROWTH_FROM = 1653;
export const GROWTH_TO = 1681;
export const GROWTH_NEW = 28;
export const GROWTH_SESSIONS = 2;
export const GROWTH_CONNECTORS = 14;
export const KEY_PATTERN = "<ServerName>|<16-hex hash>";
export const SERVER_URL_PATTERN =
  "https://api.anthropic.com/v2/ccr-sessions/<session-id>/mcp?mcp_server_id=…&mcp_url=…&toolbox_mcp_server_id=…";
export const PHRASE =
  "when mcpOAuth re-stores identical connector tokens under a new session-scoped serverUrl every session so credentials.json accretes unboundedly, score cartulary or admit bound.";

export const LECTERN_STATIONS = Object.freeze([
  {
    id: "lectern",
    rite: "open the oak lectern",
    kind: "register",
    note: "one record per connector; key by mcp_server_id not session URL",
  },
  {
    id: "quire",
    rite: "turn the bound quire",
    kind: "tokens",
    note: "identical tokens should update in place, not accrete under a new folio",
  },
  {
    id: "inkhorn",
    rite: "dip the inkhorn",
    kind: "keying",
    note: "session-scoped CCR URL re-keys every session as <ServerName>|<16-hex hash>",
  },
  {
    id: "candle",
    rite: "read by candle",
    kind: "expiry",
    note: "only 2 of 1,681 records carry expiresAt; the rest have no cleanup cue",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mcp-oauth",
  "session-scoped",
  "fresh-key",
  "identical-tokens",
  "no-expires",
  "times-113",
  "records-1681",
  "connectors-29",
  "growth-28",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91158,
    title: "Keychain accumulate without bound",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 91180,
    title: "credentials diverge",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 92748,
    title: "store MCP OAuth separately",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 88487,
    title: "Desktop update wipes claudeAiOauth",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 91641,
    title: "shared refresh token",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 89671,
    title: "token corrupted by status check",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 87405,
    title: "tokenless stub",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 74250,
    title: "parallel sessions break refresh rotation",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 83707,
    title: "empty accessToken registrations",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93279,
    title: "HTTP MCP ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93270,
    title: "Workflow kill leaks agents blocking archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93269,
    title: "archive_session live-work names four causes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93265,
    title: "ShipIt non-ASCII env double-encode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93280,
    title: "dame-moji registry",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops flags",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93219,
    title: "Vernier millimeter-slider leftover — do not ship",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover woodworking; forbidden as primary",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "flashpan",
  "clepsydra",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "ephemera",
  "oubliette",
  "buoy",
  "bollard",
  "bitts",
  "hawser",
  "vernier",
  "scion",
  "commutator",
  "heddle",
  "guillotine",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "caret",
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
  "palimpsest",
  "relict",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Read how the register is keyed — stable connector id, or session URL.
 */
export function inspectKeying(input = {}) {
  const sessionScoped =
    input.sessionScoped === true ||
    input.freshKey === true ||
    Boolean(input.serverUrl && String(input.serverUrl).includes("ccr-sessions"));
  const stable =
    input.stableKey === true &&
    input.sessionScoped !== true &&
    input.freshKey !== true;
  return {
    sessionScoped: sessionScoped && !stable,
    freshKey: (input.freshKey === true || sessionScoped) && !stable,
    stableKey: stable,
    stamp: stable ? "bound" : sessionScoped ? "accreted" : "bound",
  };
}

/**
 * Read whether tokens match across folios (hash-compared, no secrets).
 */
export function readFolio(input = {}) {
  const identical =
    input.identicalTokens === true ||
    input.tokensMatch === true ||
    (input.distinctAccessTokens === 1 &&
      input.distinctRefreshTokens === 1 &&
      (input.recordsPerConnector >= RECORDS_PER_CONNECTOR ||
        input.distinctServerUrls >= DISTINCT_SERVER_URLS));
  const times113 =
    input.times113 === true ||
    input.recordsPerConnector === RECORDS_PER_CONNECTOR;
  return {
    identicalTokens: identical,
    times113,
    stamp: identical && times113 ? "accreted" : identical ? "accreted" : "bound",
  };
}

/**
 * Read the register index — record count, expiry, day growth.
 */
export function readRegister(input = {}) {
  const recordCount = Number(input.recordCount ?? 0);
  const unbounded =
    input.unbounded === true ||
    input.countIncreases === true ||
    recordCount >= RECORD_COUNT;
  const noExpires =
    input.noExpiresAt === true ||
    (input.expiresAtCount != null &&
      Number(input.expiresAtCount) <= EXPIRES_AT_COUNT &&
      unbounded);
  return {
    recordCount,
    fileSizeKb: Number(input.fileSizeKb ?? 0),
    unbounded,
    noExpiresAt: noExpires,
    stamp: unbounded || noExpires ? "accreted" : "bound",
  };
}

export function readLectern(input = {}) {
  const keying = inspectKeying(input);
  const folio = readFolio(input);
  const register = readRegister(input);
  const accreted =
    keying.stamp === "accreted" ||
    folio.stamp === "accreted" ||
    register.stamp === "accreted" ||
    input.accreted === true;
  const bound =
    input.bound === true &&
    accreted !== true &&
    keying.stamp === "bound";
  return {
    keying,
    folio,
    register,
    stations: LECTERN_STATIONS,
    accreted: accreted && !bound,
    bound: bound || (keying.stamp === "bound" && !accreted && input.accreted !== true),
    cue: accreted && !bound ? "accreted" : "bound",
  };
}

/**
 * Published cartulary walk from #93331 only. Facts from the issue body.
 * A bound register keeps one record per connector, keys by mcp_server_id,
 * updates in place, prunes ended sessions, and dedupes identical tokens.
 * An accreted register re-keys from a session-scoped serverUrl every
 * session so the same token is copied ×113.
 */
export const CARTULARY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-bound",
    bound: true,
    stableKey: true,
    onePerConnector: true,
    pruneEnded: true,
    tokensDeduped: true,
    accreted: false,
    sessionScoped: false,
    freshKey: false,
    cue: "bound",
    note: "idle HOLD: one record per connector; key by mcp_server_id not session URL; update in place; prune ended sessions; identical tokens deduped; credentials.json stays small",
  },
  {
    t: "login",
    event: "login-connectors",
    loginConnectors: true,
    connectorCount: CONNECTOR_COUNT,
    cue: "accreted",
    note: "claude.ai login with several connectors enabled (~29)",
  },
  {
    t: "count",
    event: "count-mcpoauth",
    countMcpOauth: true,
    cue: "accreted",
    note: "count mcpOAuth records in ~/.claude/.credentials.json",
  },
  {
    t: "start",
    event: "start-session",
    startSession: true,
    cue: "accreted",
    note: "start a new claude session (interactive or claude -p)",
  },
  {
    t: "end",
    event: "end-session",
    endSession: true,
    cue: "accreted",
    note: "end the session — ended sessions are not pruned from the store",
  },
  {
    t: "grow",
    event: "count-increases",
    countIncreases: true,
    cue: "accreted",
    note: "count increases by the number of enabled connectors",
  },
  {
    t: "sid",
    event: "new-session-id",
    newSessionId: true,
    cue: "accreted",
    note: "new records contain the new session id in serverUrl",
  },
  {
    t: "token",
    event: "tokens-match",
    tokensMatch: true,
    identicalTokens: true,
    distinctAccessTokens: DISTINCT_ACCESS_TOKENS,
    distinctRefreshTokens: DISTINCT_REFRESH_TOKENS,
    cue: "accreted",
    note: "token values match the previous records (hash-compared; no secrets)",
  },
  {
    t: "url",
    event: "session-scoped-url",
    sessionScoped: true,
    cue: "accreted",
    note: "serverUrl is session-scoped: CCR /ccr-sessions/<session-id>/mcp?…",
  },
  {
    t: "key",
    event: "fresh-key",
    freshKey: true,
    sessionScoped: true,
    cue: "accreted",
    note: "record key <ServerName>|<16-hex hash> derived from that URL — every session a fresh key",
  },
  {
    t: "exp",
    event: "no-expiresAt",
    noExpiresAt: true,
    expiresAtCount: EXPIRES_AT_COUNT,
    cue: "accreted",
    note: "only 2 of 1,681 records carry expiresAt; rest have no expiry for cleanup",
  },
  {
    t: "cut",
    event: "accreted",
    bound: false,
    accreted: true,
    sessionScoped: true,
    freshKey: true,
    identicalTokens: true,
    tokensMatch: true,
    noExpiresAt: true,
    countIncreases: true,
    newSessionId: true,
    times113: true,
    unbounded: true,
    recordCount: RECORD_COUNT,
    fileSizeKb: FILE_SIZE_KB,
    cue: "accreted",
    note: "mcpOAuth re-stores identical connector tokens under a new session-scoped serverUrl every session",
  },
  {
    t: "path",
    event: "session-url",
    accreted: true,
    sessionScoped: true,
    cue: "accreted",
    note: "session-url — session-scoped CCR MCP serverUrl used as the store key",
  },
  {
    t: "score",
    event: "cartulary",
    accreted: true,
    sessionScoped: true,
    cue: "accreted",
    note: "cartulary — score the register that copied the same grant onto a new folio",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    bound: true,
    stableKey: true,
    onePerConnector: true,
    pruneEnded: true,
    tokensDeduped: true,
    accreted: false,
    sessionScoped: false,
    freshKey: false,
    cue: "bound",
  };
}

export function seedBound() {
  return { ...emptyTicket() };
}

export function seedAccreted() {
  return {
    seed: SEEDED_WORD,
    bound: false,
    accreted: true,
    sessionScoped: true,
    freshKey: true,
    identicalTokens: true,
    tokensMatch: true,
    noExpiresAt: true,
    countIncreases: true,
    newSessionId: true,
    times113: true,
    unbounded: true,
    loginConnectors: true,
    countMcpOauth: true,
    startSession: true,
    endSession: true,
    recordCount: RECORD_COUNT,
    fileSizeKb: FILE_SIZE_KB,
    connectorCount: CONNECTOR_COUNT,
    recordsPerConnector: RECORDS_PER_CONNECTOR,
    distinctAccessTokens: DISTINCT_ACCESS_TOKENS,
    distinctRefreshTokens: DISTINCT_REFRESH_TOKENS,
    distinctServerUrls: DISTINCT_SERVER_URLS,
    distinctClientIds: DISTINCT_CLIENT_IDS,
    expiresAtCount: EXPIRES_AT_COUNT,
    growthFrom: GROWTH_FROM,
    growthTo: GROWTH_TO,
    growthNew: GROWTH_NEW,
    stableKey: false,
    onePerConnector: false,
    pruneEnded: false,
    tokensDeduped: false,
    cue: "accreted",
    issue: FEATURED_ISSUE,
  };
}

export function seedCartulary() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    accreted: true,
    sessionScoped: true,
    cue: "accreted",
  };
}

export function seedSessionUrl() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    accreted: true,
    sessionScoped: true,
    cue: "accreted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    bound: true,
    cue: "bound",
  };
}

export function seedMcpOauth() {
  return {
    seed: "mcp-oauth",
    preferSeed: true,
    cue: "accreted",
  };
}

export function seedSessionScoped() {
  return {
    seed: "session-scoped",
    preferSeed: true,
    sessionScoped: true,
    cue: "accreted",
  };
}

export function seedFreshKey() {
  return {
    seed: "fresh-key",
    preferSeed: true,
    freshKey: true,
    cue: "accreted",
  };
}

export function seedIdenticalTokens() {
  return {
    seed: "identical-tokens",
    preferSeed: true,
    identicalTokens: true,
    cue: "accreted",
  };
}

export function seedNoExpires() {
  return {
    seed: "no-expires",
    preferSeed: true,
    noExpiresAt: true,
    cue: "accreted",
  };
}

export function seedTimes113() {
  return {
    seed: "times-113",
    preferSeed: true,
    times113: true,
    cue: "accreted",
  };
}

export function seedRecords1681() {
  return {
    seed: "records-1681",
    preferSeed: true,
    recordCount: RECORD_COUNT,
    cue: "accreted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      bound: false,
      accreted: false,
      stableKey: false,
      onePerConnector: false,
      pruneEnded: false,
      tokensDeduped: false,
      sessionScoped: false,
      freshKey: false,
      identicalTokens: false,
      tokensMatch: false,
      noExpiresAt: false,
      countIncreases: false,
      newSessionId: false,
      times113: false,
      unbounded: false,
      loginConnectors: false,
      countMcpOauth: false,
      startSession: false,
      endSession: false,
      recordCount: null,
      fileSizeKb: null,
      connectorCount: null,
      recordsPerConnector: null,
      distinctAccessTokens: null,
      distinctRefreshTokens: null,
      distinctServerUrls: null,
      distinctClientIds: null,
      expiresAtCount: null,
      growthFrom: null,
      growthTo: null,
      growthNew: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    bound: raw.bound === true,
    accreted: raw.accreted === true,
    stableKey: raw.stableKey === true,
    onePerConnector: raw.onePerConnector === true,
    pruneEnded: raw.pruneEnded === true,
    tokensDeduped: raw.tokensDeduped === true,
    sessionScoped: raw.sessionScoped === true,
    freshKey: raw.freshKey === true,
    identicalTokens: raw.identicalTokens === true,
    tokensMatch: raw.tokensMatch === true,
    noExpiresAt: raw.noExpiresAt === true,
    countIncreases: raw.countIncreases === true,
    newSessionId: raw.newSessionId === true,
    times113: raw.times113 === true,
    unbounded: raw.unbounded === true,
    loginConnectors: raw.loginConnectors === true,
    countMcpOauth: raw.countMcpOauth === true,
    startSession: raw.startSession === true,
    endSession: raw.endSession === true,
    recordCount: raw.recordCount == null ? null : raw.recordCount,
    fileSizeKb: raw.fileSizeKb == null ? null : raw.fileSizeKb,
    connectorCount: raw.connectorCount == null ? null : raw.connectorCount,
    recordsPerConnector: raw.recordsPerConnector == null ? null : raw.recordsPerConnector,
    distinctAccessTokens: raw.distinctAccessTokens == null ? null : raw.distinctAccessTokens,
    distinctRefreshTokens: raw.distinctRefreshTokens == null ? null : raw.distinctRefreshTokens,
    distinctServerUrls: raw.distinctServerUrls == null ? null : raw.distinctServerUrls,
    distinctClientIds: raw.distinctClientIds == null ? null : raw.distinctClientIds,
    expiresAtCount: raw.expiresAtCount == null ? null : raw.expiresAtCount,
    growthFrom: raw.growthFrom == null ? null : raw.growthFrom,
    growthTo: raw.growthTo == null ? null : raw.growthTo,
    growthNew: raw.growthNew == null ? null : raw.growthNew,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.bound != null ||
        ticket.accreted != null ||
        ticket.sessionScoped != null ||
        ticket.freshKey != null ||
        ticket.identicalTokens != null ||
        ticket.noExpiresAt != null ||
        ticket.countIncreases != null ||
        ticket.stableKey != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isBound(row) {
  if (row.accreted && row.cue !== "bound") return false;
  if (
    row.cue === "accreted" ||
    row.cue === "cartulary" ||
    row.cue === "session-url"
  ) {
    return false;
  }
  if (row.sessionScoped && row.cue !== "bound") return false;
  if (
    row.bound === true &&
    row.accreted !== true &&
    row.cue !== "accreted"
  ) {
    return true;
  }
  if (
    row.cue === "bound" &&
    row.accreted !== true &&
    row.sessionScoped !== true
  ) {
    return true;
  }
  if (
    row.stableKey === true &&
    row.onePerConnector === true &&
    row.pruneEnded === true &&
    row.tokensDeduped === true &&
    row.accreted !== true &&
    row.sessionScoped !== true
  ) {
    return true;
  }
  return false;
}

function isAccreted(row) {
  if (isBound(row)) return false;
  if (row.cue === "accreted" || row.cue === "cartulary") return true;
  if (row.accreted === true) return true;
  if (
    row.sessionScoped === true ||
    row.freshKey === true ||
    row.identicalTokens === true
  ) {
    return true;
  }
  if (row.noExpiresAt && row.countIncreases) return true;
  if (row.times113 && row.unbounded) return true;
  return false;
}

function isSessionUrlPath(row) {
  return (
    row.event === "session-url" &&
    !isBound(row) &&
    (row.accreted === true || row.sessionScoped === true)
  );
}

/**
 * Score one lectern pass against the cartulary booth.
 * bound: one record per connector; key by mcp_server_id; update in place.
 * accreted: session-scoped serverUrl re-keys; same token ×113; 1,681 / 906 KB.
 * session-url: named path — session-scoped CCR MCP URL used as the store key.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSessionUrlPath(row) ||
    (row.accreted && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "session-url";
  } else if (isAccreted(row)) {
    verdict = "accreted";
  } else if (isBound(row)) {
    verdict = "bound";
  } else if (
    row.accreted ||
    row.sessionScoped ||
    row.freshKey ||
    row.identicalTokens ||
    row.noExpiresAt ||
    row.countIncreases ||
    row.times113 ||
    row.unbounded
  ) {
    verdict = "accreted";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const keying = inspectKeying(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    bound: verdict === "bound" || verdict === "hold",
    accreted:
      verdict === "accreted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    sessionUrl:
      verdict === "session-url" ||
      verdict === PATH_WORD ||
      (keying.sessionScoped && row.event === "session-url"),
    stableKey: row.stableKey,
    onePerConnector: row.onePerConnector,
    pruneEnded: row.pruneEnded,
    tokensDeduped: row.tokensDeduped,
    sessionScoped: row.sessionScoped,
    freshKey: row.freshKey,
    identicalTokens: row.identicalTokens,
    tokensMatch: row.tokensMatch,
    noExpiresAt: row.noExpiresAt,
    countIncreases: row.countIncreases,
    newSessionId: row.newSessionId,
    times113: row.times113,
    unbounded: row.unbounded,
    loginConnectors: row.loginConnectors,
    countMcpOauth: row.countMcpOauth,
    startSession: row.startSession,
    endSession: row.endSession,
    recordCount: row.recordCount,
    fileSizeKb: row.fileSizeKb,
    connectorCount: row.connectorCount,
    recordsPerConnector: row.recordsPerConnector,
    distinctAccessTokens: row.distinctAccessTokens,
    distinctRefreshTokens: row.distinctRefreshTokens,
    distinctServerUrls: row.distinctServerUrls,
    distinctClientIds: row.distinctClientIds,
    expiresAtCount: row.expiresAtCount,
    growthFrom: row.growthFrom,
    growthTo: row.growthTo,
    growthNew: row.growthNew,
    cue: hold ? "bound" : "accreted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit bound" : "score cartulary",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : CARTULARY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const accreted = scored.filter((row) => row.verdict === "accreted");
  const path = scored.filter((row) => row.verdict === "session-url");
  const bound = scored.filter((row) => row.verdict === "bound");
  const headline =
    scored.find((row) => row.event === "accreted") ||
    scored.find((row) => row.event === "session-scoped-url") ||
    scored.find((row) => row.event === "session-url") ||
    accreted[accreted.length - 1];
  let verdict = "bound";
  if (accreted.length) verdict = "accreted";
  else if (path.length && !bound.length) verdict = "session-url";
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
    accretedCount: accreted.length,
    pathCount: path.length,
    boundCount: bound.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit bound" : "score cartulary",
    note: headline
      ? "mcpOAuth re-stores identical connector tokens under a new session-scoped serverUrl every session; 1,681 records / 906 KB; same token ×113."
      : "published cartulary walk scored against bound vs accreted",
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
    seeded !== "bound" &&
    seeded !== "accreted" &&
    seeded !== "session-url" &&
    seeded !== "cartulary" &&
    ticket.bound == null &&
    ticket.accreted == null &&
    ticket.sessionScoped == null &&
    ticket.stableKey == null &&
    ticket.freshKey == null &&
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
    backups: BACKUPS.map((row) => row.issue),
    bound: scored.bound ?? false,
    accreted: scored.accreted ?? false,
    sessionScoped: scored.sessionScoped ?? false,
    freshKey: scored.freshKey ?? false,
    identicalTokens: scored.identicalTokens ?? false,
    noExpiresAt: scored.noExpiresAt ?? false,
    countIncreases: scored.countIncreases ?? false,
    times113: scored.times113 ?? false,
    unbounded: scored.unbounded ?? false,
    stableKey: scored.stableKey ?? false,
    onePerConnector: scored.onePerConnector ?? false,
    pruneEnded: scored.pruneEnded ?? false,
    tokensDeduped: scored.tokensDeduped ?? false,
    recordCount: scored.recordCount ?? null,
    fileSizeKb: scored.fileSizeKb ?? null,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.sessionScoped ? "key=session-url" : "key=stable",
    result.identicalTokens ? "tokens=identical" : "tokens=unique",
    result.noExpiresAt ? "expires=sparse" : "expires=present",
    result.times113 ? "dup=113" : "dup=none",
    result.cue === "bound" ? "cue=bound" : "cue=accreted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const lectern = readLectern({
    bound: result.bound,
    accreted: result.accreted,
    stableKey: result.stableKey,
    sessionScoped: result.sessionScoped,
    freshKey: result.freshKey,
    identicalTokens: result.identicalTokens,
    tokensMatch: result.tokensMatch,
    noExpiresAt: result.noExpiresAt,
    countIncreases: result.countIncreases,
    times113: result.times113,
    unbounded: result.unbounded,
    recordCount: result.recordCount,
    fileSizeKb: result.fileSizeKb,
    recordsPerConnector: result.recordsPerConnector,
    distinctAccessTokens: result.distinctAccessTokens,
    distinctRefreshTokens: result.distinctRefreshTokens,
    distinctServerUrls: result.distinctServerUrls,
    expiresAtCount: result.expiresAtCount,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    lectern,
    keying: inspectKeying({
      sessionScoped: result.sessionScoped,
      freshKey: result.freshKey,
      stableKey: result.stableKey,
    }),
    folio: readFolio({
      identicalTokens: result.identicalTokens,
      tokensMatch: result.tokensMatch,
      times113: result.times113,
      recordsPerConnector: result.recordsPerConnector,
      distinctAccessTokens: result.distinctAccessTokens,
      distinctRefreshTokens: result.distinctRefreshTokens,
      distinctServerUrls: result.distinctServerUrls,
    }),
    register: readRegister({
      recordCount: result.recordCount,
      fileSizeKb: result.fileSizeKb,
      unbounded: result.unbounded,
      countIncreases: result.countIncreases,
      noExpiresAt: result.noExpiresAt,
      expiresAtCount: result.expiresAtCount,
    }),
    stations: LECTERN_STATIONS.map((row) => ({
      ...row,
      accreted: result.accreted === true || result.verdict === "accreted",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      os: OS,
      authMode: AUTH_MODE,
      credentialsPath: CREDENTIALS_PATH,
      storeKey: STORE_KEY,
      recordCount: RECORD_COUNT,
      fileSizeKb: FILE_SIZE_KB,
      connectorCount: CONNECTOR_COUNT,
      recordsPerConnector: RECORDS_PER_CONNECTOR,
      distinctAccessTokens: DISTINCT_ACCESS_TOKENS,
      distinctRefreshTokens: DISTINCT_REFRESH_TOKENS,
      expiresAtCount: EXPIRES_AT_COUNT,
      growthFrom: GROWTH_FROM,
      growthTo: GROWTH_TO,
      growthNew: GROWTH_NEW,
      keyPattern: KEY_PATTERN,
      serverUrlPattern: SERVER_URL_PATTERN,
      stations: LECTERN_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "one record per connector (key by connector / mcp_server_id, not by the session-scoped URL), updated in place on refresh",
        "or prune records whose session has ended, and dedupe identical tokens on write",
      ],
      hypothesis:
        "NON-BINDING: credential key derived from session-scoped CCR MCP URL instead of stable connector / mcp_server_id. Verify against #93331 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
