#!/usr/bin/env node
/**
 * Paraph — notarial / signature-paraph / issuer-seal booth.
 *
 * Educational diagnostic model for a published Claude Desktop defect:
 * BYO OAuth MCP connect against a Snowflake-hosted MCP server fails the
 * version-negotiation probe with a malformed RFC 8414 §3.3 Issuer
 * mismatch error. Both expected and received open with a literal quote
 * but close with the literal characters %22. The error is byte-identical
 * across materially different configs. Claude Code CLI succeeds against
 * the same server. No browser OAuth window opens on Desktop. Failed
 * request is HTTP …/mcp-servers/<server> → initialize.
 *
 *   node paraph.mjs data/paraph.json
 *   echo '{"seed":"mismatched"}' | node paraph.mjs
 *
 * Idle word is sealed (HOLD: issuer strings compared with real quotes;
 * error formatter shows real values; Desktop OAuth window opens;
 * Desktop matches CLI success).
 * Seeded word is mismatched (#93327: %22 closing artifact).
 * Path word is issuer.
 * Product score word is paraph (score paraph or admit sealed).
 *
 * Encoded from anthropics/claude-code#93327 issue body only.
 * Hypothesis (NON-BINDING): broken string-interpolation / hardcoded
 * %22 in Desktop version-negotiation probe error formatter.
 * Verify against #93327 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No live Snowflake. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sealed",
  "mismatched",
  "paraph",
  "issuer",
  "hold",
  "byo-oauth",
  "percent-22",
  "malformed-template",
  "config-invariant",
  "desktop-only",
  "cli-ok",
  "cross-platform",
  "regression",
  "rfc-8414",
  "version-negotiation-probe",
  "no-browser-window",
  "initialize-fail",
  "sign-in-test",
  "quoted",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "sealed";
export const PATH_WORD = "issuer";
export const SEEDED_WORD = "mismatched";
export const PRODUCT_WORD = "paraph";
export const HOLD = Object.freeze(["sealed", "hold"]);
export const RECOVER = Object.freeze(["sealed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  FORBIDDEN_IDLE.filter((name) => name !== "mismatched" && name !== "paraph"),
);

export const FEATURED_ISSUE = 93327;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93327";
export const TITLE =
  "[BUG] Desktop: BYO OAuth MCP connect fails with malformed \"Issuer mismatch (RFC 8414 §3.3)\" error — same version-negotiation probe as #87713";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "platform:macos",
  "area:auth",
  "area:mcp",
  "regression",
  "area:desktop",
]);
export const AUTHOR = "Simonmaignan";
export const FILED = "2026-09-10T10:44:19Z";
export const DESKTOP_VERSION = "1.49585.0";
export const DESKTOP_BUILD = "41ad1d";
export const OS =
  "Windows (reporter); macOS (colleague, identical error)";
export const OAUTH_MODE = "byo";
export const TRANSPORT = "http";
export const CONNECTOR_NAME = "snowflake_test";
export const ISSUER_HOST = "<account>.snowflakecomputing.com";
export const ISSUER_PATH = "/oauth";
export const ISSUER_URL = `https://${ISSUER_HOST}${ISSUER_PATH}`;
export const ERROR_PREFIX =
  "Version negotiation probe failed: Issuer mismatch in authorization server metadata (RFC 8414 §3.3):";
export const ERROR_SHOWN =
  'expected "https://<account>.snowflakecomputing.com/oauth%22, received "https://<account>.snowflakecomputing.com/oauth%22';
export const ERROR_TEXT = `${ERROR_PREFIX} ${ERROR_SHOWN}`;
export const FAILED_REQUEST =
  "HTTP https://<account>.snowflakecomputing.com/api/v2/databases/<db>/schemas/<schema>/mcp-servers/<server> → initialize";
export const QUOTE_OPEN = '"';
export const QUOTE_CLOSE_ARTIFACT = "%22";
export const CLI_COMMAND = "claude mcp add-json";
export const PHRASE =
  "when Desktop BYO OAuth MCP connect fails the version-negotiation probe with a malformed RFC 8414 issuer mismatch whose quotes open real and close %22, score paraph or admit sealed.";

export const SEAL_STATIONS = Object.freeze([
  {
    id: "instrument",
    rite: "read the notarial instrument",
    kind: "issuer",
    note: "issuer strings should compare with real quotes; formatter should show real values",
  },
  {
    id: "paraph",
    rite: "sound the signature paraph",
    kind: "quotes",
    note: "both expected and received open with \" and close with literal %22",
  },
  {
    id: "press",
    rite: "check the wax press",
    kind: "desktop",
    note: "Desktop Sign in & test never opens a browser OAuth window",
  },
  {
    id: "cli",
    rite: "ask whether the CLI still authenticates",
    kind: "cli",
    note: "claude mcp add-json against the same URL/account/OAuth succeeds",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "byo-oauth",
  "percent-22",
  "malformed-template",
  "config-invariant",
  "desktop-only",
  "cli-ok",
  "cross-platform",
  "regression",
  "rfc-8414",
  "version-negotiation-probe",
  "no-browser-window",
  "initialize-fail",
]);

export const COUSINS = Object.freeze([
  {
    issue: 87713,
    title:
      "version-negotiation probe wraps a client-side auth error, misclassified as transport (no-cached-tokens first-connect)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same probe subsystem, different code path; do not rebuild",
  },
  {
    issue: 90970,
    title: "related prior art in the same subsystem",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 88370,
    title: "related prior art in the same subsystem",
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
  "drift-radar",
  "reorder-radar",
]);

/**
 * Sound the issuer quotes — real closing quotes, or the %22 artifact.
 */
export function inspectQuotes(input = {}) {
  const expected = String(input.expected ?? input.expectedShown ?? "");
  const received = String(input.received ?? input.receivedShown ?? "");
  const opensWithQuote =
    input.opensWithQuote === true || expected.startsWith(QUOTE_OPEN);
  const closesWithPercent22 =
    input.percent22 === true ||
    input.closesWithPercent22 === true ||
    expected.endsWith(QUOTE_CLOSE_ARTIFACT) ||
    (expected.includes(QUOTE_CLOSE_ARTIFACT) &&
      !expected.endsWith(QUOTE_OPEN));
  const malformed =
    input.malformedTemplate === true ||
    (opensWithQuote &&
      (input.percent22 === true ||
        input.closesWithPercent22 === true ||
        expected.endsWith(QUOTE_CLOSE_ARTIFACT)));
  const matchingShown =
    input.matchingShown === true ||
    (expected && received && expected === received);
  const realQuotes =
    input.realQuotes === true &&
    input.percent22 !== true &&
    input.malformedTemplate !== true;
  return {
    opensWithQuote,
    closesWithPercent22:
      closesWithPercent22 || input.percent22 === true || malformed,
    malformed: malformed && !realQuotes,
    matchingShown,
    percent22: (closesWithPercent22 || input.percent22 === true) && !realQuotes,
    stamp: realQuotes ? "sealed" : malformed || closesWithPercent22 ? "mismatched" : "sealed",
  };
}

/**
 * Read the wax press — Desktop OAuth window opens, or stays dark.
 */
export function readPress(input = {}) {
  const windowOpens =
    input.oauthWindow === true && input.noBrowserWindow !== true;
  const dark =
    input.noBrowserWindow === true ||
    input.oauthWindow === false ||
    input.initializeFail === true;
  return {
    oauthWindow: windowOpens,
    noBrowserWindow: dark && !windowOpens,
    initializeFail: input.initializeFail === true,
    stamp: dark && !windowOpens ? "mismatched" : "sealed",
  };
}

/**
 * Read whether CLI still authenticates the same issuer.
 */
export function readCli(input = {}) {
  const cliOk = input.cliOk === true || input.cliSucceeds === true;
  const desktopOnly =
    input.desktopOnly === true ||
    (cliOk && (input.probeFailed === true || input.noBrowserWindow === true));
  return {
    cliOk,
    desktopOnly,
    stamp: cliOk && input.desktopOnly === true ? "mismatched" : cliOk && !input.probeFailed ? "sealed" : "mismatched",
  };
}

export function readInstrument(input = {}) {
  const quotes = inspectQuotes(input);
  const press = readPress(input);
  const cli = readCli(input);
  const mismatched =
    quotes.stamp === "mismatched" ||
    press.stamp === "mismatched" ||
    input.mismatched === true;
  const sealed =
    input.sealed === true &&
    mismatched !== true &&
    quotes.stamp === "sealed";
  return {
    quotes,
    press,
    cli,
    stations: SEAL_STATIONS,
    mismatched: mismatched && !sealed,
    sealed: sealed || (quotes.stamp === "sealed" && !mismatched && input.mismatched !== true),
    cue: mismatched && !sealed ? "mismatched" : "sealed",
  };
}

/**
 * Published paraph walk from #93327 only. Facts from the issue body.
 * A sealed instrument compares issuer strings with real quotes, shows
 * real values, opens the Desktop OAuth window, and matches CLI success.
 * A mismatched instrument shows the %22 closing artifact and the probe
 * fails; CLI still works.
 */
export const PARAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-sealed",
    sealed: true,
    realQuotes: true,
    matchingIssuers: true,
    oauthWindow: true,
    desktopMatchesCli: true,
    mismatched: false,
    percent22: false,
    cue: "sealed",
    note: "idle HOLD: issuer strings compared with real quotes; error formatter shows real values; Desktop OAuth window opens; Desktop matches CLI success",
  },
  {
    t: "byo",
    event: "byo-oauth",
    byoOauth: true,
    oauthMode: OAUTH_MODE,
    cue: "mismatched",
    note: "BYO OAuth: oauth.mode byo, explicit clientId/clientSecret/authorizationServer",
  },
  {
    t: "sign",
    event: "sign-in-test",
    signInTest: true,
    cue: "mismatched",
    note: "Desktop Developer → Sign in & test / Apply Changes",
  },
  {
    t: "probe",
    event: "version-negotiation-probe",
    versionNegotiationProbe: true,
    probeFailed: true,
    cue: "mismatched",
    note: "Version negotiation probe failed — same subsystem as #87713, different code path",
  },
  {
    t: "artifact",
    event: "percent-22",
    percent22: true,
    closesWithPercent22: true,
    expected: 'https://<account>.snowflakecomputing.com/oauth%22',
    received: 'https://<account>.snowflakecomputing.com/oauth%22',
    cue: "mismatched",
    note: "both expected and received close with literal characters %22",
  },
  {
    t: "template",
    event: "malformed-template",
    malformedTemplate: true,
    percent22: true,
    opensWithQuote: true,
    closesWithPercent22: true,
    cue: "mismatched",
    note: "message template opens with literal \" and closes with %22 — broken interpolation, not a genuine issuer mismatch",
  },
  {
    t: "config",
    event: "config-invariant",
    configInvariant: true,
    percent22: true,
    cue: "mismatched",
    note: "byte-identical error across hostname case variants and a from-scratch minimal config",
  },
  {
    t: "window",
    event: "no-browser-window",
    noBrowserWindow: true,
    oauthWindow: false,
    cue: "mismatched",
    note: "no browser OAuth window opens on Desktop failure",
  },
  {
    t: "init",
    event: "initialize-fail",
    initializeFail: true,
    failedRequest: FAILED_REQUEST,
    cue: "mismatched",
    note: "Failed request: HTTP …/mcp-servers/<server> → initialize",
  },
  {
    t: "cli",
    event: "cli-ok",
    cliOk: true,
    desktopOnly: true,
    cue: "mismatched",
    note: "Claude Code CLI claude mcp add-json connects and authenticates successfully",
  },
  {
    t: "cut",
    event: "mismatched",
    sealed: false,
    mismatched: true,
    percent22: true,
    malformedTemplate: true,
    configInvariant: true,
    noBrowserWindow: true,
    initializeFail: true,
    cliOk: true,
    desktopOnly: true,
    byoOauth: true,
    versionNegotiationProbe: true,
    cue: "mismatched",
    note: "Desktop probe fails with malformed issuer quotes; CLI still works",
  },
  {
    t: "path",
    event: "issuer",
    mismatched: true,
    percent22: true,
    cue: "mismatched",
    note: "issuer — RFC 8414 §3.3 issuer-string path through the version-negotiation probe",
  },
  {
    t: "score",
    event: "paraph",
    mismatched: true,
    percent22: true,
    cue: "mismatched",
    note: "paraph — score the notarial flourish that closed with %22 instead of a real quote",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    sealed: true,
    realQuotes: true,
    matchingIssuers: true,
    oauthWindow: true,
    desktopMatchesCli: true,
    mismatched: false,
    percent22: false,
    malformedTemplate: false,
    noBrowserWindow: false,
    initializeFail: false,
    cue: "sealed",
  };
}

export function seedSealed() {
  return { ...emptyTicket() };
}

export function seedMismatched() {
  return {
    seed: SEEDED_WORD,
    sealed: false,
    mismatched: true,
    percent22: true,
    malformedTemplate: true,
    configInvariant: true,
    noBrowserWindow: true,
    initializeFail: true,
    cliOk: true,
    desktopOnly: true,
    byoOauth: true,
    versionNegotiationProbe: true,
    crossPlatform: true,
    regression: true,
    rfc8414: true,
    opensWithQuote: true,
    closesWithPercent22: true,
    expected: 'https://<account>.snowflakecomputing.com/oauth%22',
    received: 'https://<account>.snowflakecomputing.com/oauth%22',
    oauthWindow: false,
    desktopMatchesCli: false,
    cue: "mismatched",
    issue: FEATURED_ISSUE,
  };
}

export function seedParaph() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    mismatched: true,
    percent22: true,
    cue: "mismatched",
  };
}

export function seedIssuer() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    mismatched: true,
    percent22: true,
    cue: "mismatched",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedByoOauth() {
  return {
    seed: "byo-oauth",
    preferSeed: true,
    byoOauth: true,
    cue: "mismatched",
  };
}

export function seedPercent22() {
  return {
    seed: "percent-22",
    preferSeed: true,
    percent22: true,
    cue: "mismatched",
  };
}

export function seedMalformedTemplate() {
  return {
    seed: "malformed-template",
    preferSeed: true,
    malformedTemplate: true,
    cue: "mismatched",
  };
}

export function seedConfigInvariant() {
  return {
    seed: "config-invariant",
    preferSeed: true,
    configInvariant: true,
    cue: "mismatched",
  };
}

export function seedDesktopOnly() {
  return {
    seed: "desktop-only",
    preferSeed: true,
    desktopOnly: true,
    cue: "mismatched",
  };
}

export function seedCliOk() {
  return {
    seed: "cli-ok",
    preferSeed: true,
    cliOk: true,
    cue: "mismatched",
  };
}

export function seedNoBrowserWindow() {
  return {
    seed: "no-browser-window",
    preferSeed: true,
    noBrowserWindow: true,
    cue: "mismatched",
  };
}

export function seedInitializeFail() {
  return {
    seed: "initialize-fail",
    preferSeed: true,
    initializeFail: true,
    cue: "mismatched",
  };
}

export function seedQuoted() {
  return {
    seed: "quoted",
    preferSeed: true,
    percent22: true,
    cue: "mismatched",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sealed: false,
      mismatched: false,
      realQuotes: false,
      matchingIssuers: false,
      oauthWindow: false,
      desktopMatchesCli: false,
      percent22: false,
      malformedTemplate: false,
      configInvariant: false,
      noBrowserWindow: false,
      initializeFail: false,
      cliOk: false,
      desktopOnly: false,
      byoOauth: false,
      versionNegotiationProbe: false,
      probeFailed: false,
      crossPlatform: false,
      regression: false,
      rfc8414: false,
      opensWithQuote: false,
      closesWithPercent22: false,
      signInTest: false,
      expected: null,
      received: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sealed: raw.sealed === true,
    mismatched: raw.mismatched === true,
    realQuotes: raw.realQuotes === true,
    matchingIssuers: raw.matchingIssuers === true,
    oauthWindow: raw.oauthWindow === true,
    desktopMatchesCli: raw.desktopMatchesCli === true,
    percent22: raw.percent22 === true,
    malformedTemplate: raw.malformedTemplate === true,
    configInvariant: raw.configInvariant === true,
    noBrowserWindow: raw.noBrowserWindow === true,
    initializeFail: raw.initializeFail === true,
    cliOk: raw.cliOk === true,
    desktopOnly: raw.desktopOnly === true,
    byoOauth: raw.byoOauth === true,
    versionNegotiationProbe: raw.versionNegotiationProbe === true,
    probeFailed: raw.probeFailed === true,
    crossPlatform: raw.crossPlatform === true,
    regression: raw.regression === true,
    rfc8414: raw.rfc8414 === true,
    opensWithQuote: raw.opensWithQuote === true,
    closesWithPercent22: raw.closesWithPercent22 === true,
    signInTest: raw.signInTest === true,
    expected: raw.expected == null ? null : raw.expected,
    received: raw.received == null ? null : raw.received,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.sealed != null ||
        ticket.mismatched != null ||
        ticket.realQuotes != null ||
        ticket.percent22 != null ||
        ticket.malformedTemplate != null ||
        ticket.noBrowserWindow != null ||
        ticket.initializeFail != null ||
        ticket.cliOk != null ||
        ticket.byoOauth != null ||
        ticket.oauthWindow != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isSealed(row) {
  if (row.mismatched && row.cue !== "sealed") return false;
  if (
    row.cue === "mismatched" ||
    row.cue === "paraph" ||
    row.cue === "issuer"
  ) {
    return false;
  }
  if (row.percent22 && row.cue !== "sealed") return false;
  if (
    row.sealed === true &&
    row.mismatched !== true &&
    row.cue !== "mismatched"
  ) {
    return true;
  }
  if (
    row.cue === "sealed" &&
    row.mismatched !== true &&
    row.percent22 !== true
  ) {
    return true;
  }
  if (
    row.realQuotes === true &&
    row.matchingIssuers === true &&
    row.oauthWindow === true &&
    row.desktopMatchesCli === true &&
    row.mismatched !== true &&
    row.percent22 !== true
  ) {
    return true;
  }
  return false;
}

function isMismatched(row) {
  if (isSealed(row)) return false;
  if (row.cue === "mismatched" || row.cue === "paraph") return true;
  if (row.mismatched === true) return true;
  if (
    row.percent22 === true ||
    row.malformedTemplate === true ||
    row.closesWithPercent22 === true
  ) {
    return true;
  }
  if (row.noBrowserWindow && row.initializeFail) return true;
  if (row.probeFailed && row.cliOk) return true;
  return false;
}

function isIssuerPath(row) {
  return (
    row.event === "issuer" &&
    !isSealed(row) &&
    (row.mismatched === true || row.percent22 === true)
  );
}

/**
 * Score one instrument pass against the paraph booth.
 * sealed: real quotes; formatter shows real values; OAuth window opens; Desktop matches CLI.
 * mismatched: %22 closing artifact; probe fails; no OAuth window; CLI still works.
 * issuer: named path — RFC 8414 §3.3 issuer-string through the probe.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isIssuerPath(row) ||
    (row.mismatched && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "issuer";
  } else if (isMismatched(row)) {
    verdict = "mismatched";
  } else if (isSealed(row)) {
    verdict = "sealed";
  } else if (
    row.mismatched ||
    row.percent22 ||
    row.malformedTemplate ||
    row.noBrowserWindow ||
    row.initializeFail ||
    row.byoOauth ||
    row.versionNegotiationProbe ||
    row.configInvariant
  ) {
    verdict = "mismatched";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const quotes = inspectQuotes(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    sealed: verdict === "sealed" || verdict === "hold",
    mismatched:
      verdict === "mismatched" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    issuer:
      verdict === "issuer" ||
      verdict === PATH_WORD ||
      (quotes.percent22 && row.event === "issuer"),
    realQuotes: row.realQuotes,
    matchingIssuers: row.matchingIssuers,
    oauthWindow: row.oauthWindow,
    desktopMatchesCli: row.desktopMatchesCli,
    percent22: row.percent22,
    malformedTemplate: row.malformedTemplate,
    configInvariant: row.configInvariant,
    noBrowserWindow: row.noBrowserWindow,
    initializeFail: row.initializeFail,
    cliOk: row.cliOk,
    desktopOnly: row.desktopOnly,
    byoOauth: row.byoOauth,
    versionNegotiationProbe: row.versionNegotiationProbe,
    probeFailed: row.probeFailed,
    crossPlatform: row.crossPlatform,
    regression: row.regression,
    rfc8414: row.rfc8414,
    opensWithQuote: row.opensWithQuote,
    closesWithPercent22: row.closesWithPercent22,
    signInTest: row.signInTest,
    expected: row.expected,
    received: row.received,
    cue: hold ? "sealed" : "mismatched",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sealed" : "score paraph",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : PARAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const mismatched = scored.filter((row) => row.verdict === "mismatched");
  const path = scored.filter((row) => row.verdict === "issuer");
  const sealed = scored.filter((row) => row.verdict === "sealed");
  const headline =
    scored.find((row) => row.event === "mismatched") ||
    scored.find((row) => row.event === "percent-22") ||
    scored.find((row) => row.event === "issuer") ||
    mismatched[mismatched.length - 1];
  let verdict = "sealed";
  if (mismatched.length) verdict = "mismatched";
  else if (path.length && !sealed.length) verdict = "issuer";
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
    mismatchedCount: mismatched.length,
    pathCount: path.length,
    sealedCount: sealed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sealed" : "score paraph",
    note: headline
      ? "Desktop BYO OAuth MCP connect; version-negotiation probe; malformed issuer quotes close with %22; no browser window; CLI still authenticates."
      : "published paraph walk scored against sealed vs mismatched",
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
    seeded !== "sealed" &&
    seeded !== "mismatched" &&
    seeded !== "issuer" &&
    seeded !== "paraph" &&
    ticket.sealed == null &&
    ticket.mismatched == null &&
    ticket.percent22 == null &&
    ticket.realQuotes == null &&
    ticket.byoOauth == null &&
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
    sealed: scored.sealed ?? false,
    mismatched: scored.mismatched ?? false,
    percent22: scored.percent22 ?? false,
    malformedTemplate: scored.malformedTemplate ?? false,
    noBrowserWindow: scored.noBrowserWindow ?? false,
    initializeFail: scored.initializeFail ?? false,
    cliOk: scored.cliOk ?? false,
    desktopOnly: scored.desktopOnly ?? false,
    byoOauth: scored.byoOauth ?? false,
    versionNegotiationProbe: scored.versionNegotiationProbe ?? false,
    realQuotes: scored.realQuotes ?? false,
    oauthWindow: scored.oauthWindow ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.percent22 ? "quotes=%22" : "quotes=real",
    result.malformedTemplate ? "template=malformed" : "template=sound",
    result.noBrowserWindow ? "window=dark" : "window=open",
    result.cliOk ? "cli=ok" : "cli=unknown",
    result.cue === "sealed" ? "cue=sealed" : "cue=mismatched",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const instrument = readInstrument({
    sealed: result.sealed,
    mismatched: result.mismatched,
    realQuotes: result.realQuotes,
    percent22: result.percent22,
    malformedTemplate: result.malformedTemplate,
    noBrowserWindow: result.noBrowserWindow,
    initializeFail: result.initializeFail,
    cliOk: result.cliOk,
    desktopOnly: result.desktopOnly,
    oauthWindow: result.oauthWindow,
    expected: result.expected,
    received: result.received,
    probeFailed: result.probeFailed,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    instrument,
    quotes: inspectQuotes({
      expected: result.expected,
      received: result.received,
      percent22: result.percent22,
      malformedTemplate: result.malformedTemplate,
      opensWithQuote: result.opensWithQuote,
      closesWithPercent22: result.closesWithPercent22,
      realQuotes: result.realQuotes,
    }),
    press: readPress({
      oauthWindow: result.oauthWindow,
      noBrowserWindow: result.noBrowserWindow,
      initializeFail: result.initializeFail,
    }),
    cli: readCli({
      cliOk: result.cliOk,
      desktopOnly: result.desktopOnly,
      probeFailed: result.probeFailed,
      noBrowserWindow: result.noBrowserWindow,
    }),
    stations: SEAL_STATIONS.map((row) => ({
      ...row,
      mismatched: result.mismatched === true || result.verdict === "mismatched",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      desktopVersion: DESKTOP_VERSION,
      desktopBuild: DESKTOP_BUILD,
      os: OS,
      oauthMode: OAUTH_MODE,
      transport: TRANSPORT,
      connectorName: CONNECTOR_NAME,
      issuerUrl: ISSUER_URL,
      errorText: ERROR_TEXT,
      failedRequest: FAILED_REQUEST,
      quoteOpen: QUOTE_OPEN,
      quoteCloseArtifact: QUOTE_CLOSE_ARTIFACT,
      cliCommand: CLI_COMMAND,
      stations: SEAL_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "issuer values should be compared with real quotes and the error should render real values/quoting so users can tell what differs",
        "or the client should recognize a probe/formatting bug and complete the OAuth flow — as Claude Code CLI does against the identical server",
      ],
      hypothesis:
        "NON-BINDING: broken string-interpolation / hardcoded %22 in Desktop version-negotiation probe error formatter. Verify against #93327 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
