#!/usr/bin/env node
/**
 * Outrider — cavalry outrider / dispatch-rider / ahead-of-baggage-train booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * MCP servers configured with `headersHelper` issue the initial connect
 * request WITHOUT waiting for the helper to finish. If the helper is
 * still running, the request goes with NO Authorization header → 401/403
 * → the server is marked "requires authentication" for the entire
 * session. The helper is NOT cancelled; it completes moments later with
 * a valid credential which is then discarded. The documented 10s helper
 * timeout is never reached. Different subset of servers fails each
 * launch (depends on helper speed).
 *
 *   node outrider.mjs data/outridden.json
 *   echo '{"seed":"outridden"}' | node outrider.mjs
 *
 * Idle word is credentialed (HOLD: connect waits until headersHelper
 * returns / timeout).
 * Seeded word is outridden (#93776 — bare connect rode ahead; 403;
 * needs-auth; valid token discarded 135ms later).
 * Path word is early-connect.
 * Product score word is outrider (Score outrider or admit credentialed.).
 *
 * Encoded from anthropics/claude-code#93776 issue text only.
 * Hypothesis (NON-BINDING): await headersHelper before first connect
 * (bounded by 10s timeout); on 401/403 retry after helper resolves;
 * log when helper did not resolve before connect. Verify against
 * #93776 text only. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "hold",
  "helper-invoked",
  "bare-post",
  "discarded-token",
  "needs-auth",
  "helper-pending",
  "ten-second-timeout",
  "concurrent-helpers",
  "access-log-split",
  "retry-same-pending",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "credentialed";
export const PATH_WORD = "early-connect";
export const SEEDED_WORD = "outridden";
export const PRODUCT_WORD = "outrider";
export const HOLD = Object.freeze(["credentialed", "hold"]);
export const RECOVER = Object.freeze(["credentialed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "blank",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "intact",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "outridden" && name !== "outrider"),
);

export const FEATURED_ISSUE = 93776;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93776";
export const TITLE =
  "MCP connect is issued before `headersHelper` resolves — slow helpers silently lose their auth header";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:mcp",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.266";
export const SURFACE = "Claude Code desktop, Windows 11";
export const HELPER_KIND = "headersHelper";
export const HELPER_INVOKED_AT = "05:57:47.227";
export const CLIENT_POST_AT = "05:57:52.593";
export const HELPER_RETURN_AT = "05:57:52.728";
export const TOO_LATE_MS = 135;
export const HELPER_ELAPSED_MS = 5501;
export const CLIENT_WAIT_S = 5.37;
export const RETRY_MS = 250;
export const TIMEOUT_S = 10;
export const HELPER_RANGE = "1.7–5.5s";
export const POST_STATUS = 403;
export const BOUND_STATUS = 400;
export const GATE_MARK = "requires authentication";
export const PHRASE = "Score outrider or admit credentialed.";
export const DISTRIBUTION =
  "MCP servers configured with headersHelper. Initial connect request issued WITHOUT waiting for helper to finish. If helper still running → request goes with NO Authorization header → 401/403 → server marked \"requires authentication\" for entire session. Helper is NOT cancelled; completes moments later with valid credential which is then discarded. Documented 10s helper timeout never reached; connect fires well before. Different subset of servers fails each launch (depends on helper speed) → looks like per-server problem. Evidence: helper invoked 05:57:47.227; client POST 05:57:52.593 HTTP 403 no Authorization; helper returns valid token 05:57:52.728 — 135ms too late; helper elapsed 5,501 ms; client waited ~5.37s then sent anyway. Same window: some servers with finished helpers bound (400 with valid bearer); others 403 no bearer. Retry ~250ms later fails identically because helper still running. Helpers shell out to cloud CLI (AWS Secrets Manager); 1.7–5.5s under load. Expected: do not send connect until helper resolves or timeout; OR retry 401/403 AFTER helper resolves; surface log line. Related cite: #84778 (failed attach at startup is terminal). Workaround (not fix): cache credential so helper returns in ms.";
export const SESSION_KIND =
  "Claude Code 2.1.266 desktop, Windows 11. MCP servers with headersHelper. Helper shells out to AWS Secrets Manager via AWS CLI. Bare connect POST with no Authorization; 403; needs-auth for the session; valid token discarded 135ms later.";
export const RULED_OUT = Object.freeze([
  "failed attach at startup is terminal (#84778)",
  "needs-auth cache poisoned (#80635)",
  "HTTP MCP ${VAR} header empty (#93595)",
  "Authorization header badly built (#84367)",
  "GitHub MCP Authorization badly formatted (#90677)",
]);
export const EXPECTED = Object.freeze([
  "do not send connect until helper resolves or timeout",
  "OR retry 401/403 AFTER helper resolves",
  "surface log line when helper did not resolve before connect",
]);

export const OUTRIDER_POUCHES = Object.freeze([
  { id: "pouch", label: "sealed dispatch pouch", count: "late", note: "headersHelper +135ms" },
  { id: "courier", label: "cavalry outrider", count: "ahead", note: "bare connect rode first" },
  { id: "gate", label: "bare-header gate", count: "stamped", note: "needs-auth for the session" },
  { id: "timeout", label: "ten-second timeout", count: "unreached", note: "connect fired at ~5.37s" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "helper-lane",
    survey: "invoke the headersHelper pouch",
    kind: "helper",
    note: "seeded: helper invoked 05:57:47.227 — still running at connect",
  },
  {
    id: "early-post",
    survey: "watch the courier ride ahead of the pouch",
    kind: "connect",
    note: "seeded: client POST 05:57:52.593 HTTP 403 no Authorization",
  },
  {
    id: "gate-iron",
    survey: "read the needs-auth branding iron",
    kind: "gate",
    note: "seeded: server marked requires authentication for the entire session",
  },
  {
    id: "late-pouch",
    survey: "receive the sealed pouch 135ms too late",
    kind: "token",
    note: "seeded: helper returns valid token 05:57:52.728 — discarded",
  },
  {
    id: "retry-lane",
    survey: "retry ~250ms later while the helper is still pending",
    kind: "retry",
    note: "seeded: retry fails identically because helper still running",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "early-connect",
  "outridden",
  "helper-invoked",
  "bare-post",
  "discarded-token",
  "needs-auth",
  "helper-pending",
  "ten-second-timeout",
  "concurrent-helpers",
  "access-log-split",
  "retry-same-pending",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84778,
    title: "failed attach at startup is terminal",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #84778 failed attach at startup is terminal. Related session-death after a failed MCP attach, not the headersHelper timing race. Do not rebuild",
  },
  {
    issue: 80635,
    title: "needs-auth cache poisoned",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #80635 needs-auth cache poisoned. Related needs-auth branding, not connect-before-helper. Do not rebuild",
  },
  {
    issue: 93595,
    title: "HTTP MCP ${VAR} header empty",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93595 HTTP MCP ${VAR} header empty. Related missing Authorization, not the slow-helper race. Do not rebuild",
  },
  {
    issue: 84367,
    title: "Authorization header badly built",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #84367 Authorization header badly built. Related header construction, not headersHelper timing. Do not rebuild",
  },
  {
    issue: 90677,
    title: "GitHub MCP Authorization badly formatted",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #90677 GitHub MCP Authorization badly formatted. Related Authorization formatting, not early-connect. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93766,
    title: "OneDrive musl/glibc false error",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93764,
    title: "DECSTBM blank rows",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93754,
    title: "remoteControlAtStartup toggle",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93751,
    title: "phantom Chrome",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93744,
    title: "/goal Stop evaluator blind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93772,
    title: "diagram→section poster",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93770,
    title: "TUI copy padding artifacts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "quench",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "wraith",
  "scrim",
  "knock",
  "palimpsest",
  "oubliette",
  "ephemera",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
]);

export const SAMPLE_HELPER = Object.freeze({
  invokedAt: HELPER_INVOKED_AT,
  returnedAt: HELPER_RETURN_AT,
  elapsedMs: HELPER_ELAPSED_MS,
  pendingAtConnect: true,
  cancelled: false,
  validToken: true,
  discarded: true,
});

export const SAMPLE_CREDENTIALED_HELPER = Object.freeze({
  invokedAt: HELPER_INVOKED_AT,
  returnedAt: "05:57:51.000",
  elapsedMs: 3773,
  pendingAtConnect: false,
  cancelled: false,
  validToken: true,
  discarded: false,
});

export const SAMPLE_CONNECT = Object.freeze({
  postedAt: CLIENT_POST_AT,
  waitedS: CLIENT_WAIT_S,
  authorization: false,
  status: POST_STATUS,
  early: true,
});

export const SAMPLE_CREDENTIALED_CONNECT = Object.freeze({
  postedAt: "05:57:51.010",
  waitedS: 3.78,
  authorization: true,
  status: BOUND_STATUS,
  early: false,
});

export const SAMPLE_GATE = Object.freeze({
  stamped: true,
  mark: GATE_MARK,
  sessionWide: true,
});

export const SAMPLE_CREDENTIALED_GATE = Object.freeze({
  stamped: false,
  mark: null,
  sessionWide: false,
});

export const SAMPLE_RETRY = Object.freeze({
  afterMs: RETRY_MS,
  helperStillPending: true,
  identicalFail: true,
});

export const SAMPLE_CREDENTIALED_RETRY = Object.freeze({
  afterMs: 0,
  helperStillPending: false,
  identicalFail: false,
});

export const SAMPLE_ACCESS = Object.freeze({
  boundWithBearer: 2,
  forbiddenNoBearer: 4,
  split: true,
});

export const SAMPLE_CREDENTIALED_ACCESS = Object.freeze({
  boundWithBearer: 6,
  forbiddenNoBearer: 0,
  split: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "gate holds the courier until the headersHelper pouch returns or the 10s timeout" },
  { t: "helper-invoked", line: "helper invoked 05:57:47.227 — shells out to AWS Secrets Manager" },
  { t: "early-connect", line: "client waited ~5.37s then sent the connect anyway — 10s timeout never reached" },
  { t: "bare-post", line: "client POST 05:57:52.593 HTTP 403 no Authorization" },
  { t: "needs-auth", line: "gate stamps requires authentication for the entire session" },
  { t: "helper-pending", line: "helper is NOT cancelled; still running when the courier arrives" },
  { t: "discarded-token", line: "helper returns a valid token 05:57:52.728 — 135ms too late — discarded" },
  { t: "retry-same-pending", line: "retry ~250ms later fails identically because helper still running" },
  { t: "concurrent-helpers", line: "helpers 1.7–5.5s under load; different subset fails each launch" },
  { t: "access-log-split", line: "same window: some servers 400 with valid bearer; others 403 no bearer" },
  { t: "ten-second-timeout", line: "documented 10s helper timeout never reached; connect fired well before" },
  { t: "path", line: "early-connect — the courier rode ahead of the sealed pouch" },
  { t: "score", line: "when the pouch arrives 135ms too late the booth is outrider — Score outrider or admit credentialed." },
]);

export function inspectHelper(input = {}) {
  const helper =
    input.helper && typeof input.helper === "object"
      ? input.helper
      : input.credentialed === true && input.outridden !== true
        ? SAMPLE_CREDENTIALED_HELPER
        : SAMPLE_HELPER;
  const forcedPending =
    input.helperPending === true ||
    input.helperInvoked === true ||
    input.event === "helper-invoked" ||
    input.event === "helper-pending" ||
    input.event === "outridden" ||
    input.event === "outrider" ||
    input.event === "early-connect";
  const pending = forcedPending
    ? true
    : helper.pendingAtConnect === true && input.credentialed !== true;
  return {
    invokedAt: helper.invokedAt || HELPER_INVOKED_AT,
    returnedAt: pending ? HELPER_RETURN_AT : helper.returnedAt,
    elapsedMs: pending ? HELPER_ELAPSED_MS : helper.elapsedMs,
    pendingAtConnect: pending,
    cancelled: false,
    validToken: true,
    discarded: pending,
    stamp: pending ? "pouch-late" : "pouch-bound",
    note: pending
      ? "headersHelper still running at connect — valid token discarded 135ms later"
      : "headersHelper resolved before connect — pouch bound to the courier",
  };
}

export function inspectConnect(input = {}) {
  const connect =
    input.connect && typeof input.connect === "object"
      ? input.connect
      : input.credentialed === true && input.outridden !== true
        ? SAMPLE_CREDENTIALED_CONNECT
        : SAMPLE_CONNECT;
  const forcedEarly =
    input.earlyConnect === true ||
    input.barePost === true ||
    input.event === "early-connect" ||
    input.event === "bare-post" ||
    input.event === "outridden" ||
    input.event === "outrider";
  const early = forcedEarly ? true : connect.early === true && input.credentialed !== true;
  return {
    postedAt: early ? CLIENT_POST_AT : connect.postedAt,
    waitedS: early ? CLIENT_WAIT_S : connect.waitedS,
    authorization: !early,
    status: early ? POST_STATUS : BOUND_STATUS,
    early,
    stamp: early ? "connect-bare" : "connect-held",
    note: early
      ? "bare connect POST with no Authorization — HTTP 403"
      : "connect held until headersHelper returned — bearer bound",
  };
}

export function inspectGate(input = {}) {
  const gate =
    input.gate && typeof input.gate === "object"
      ? input.gate
      : input.credentialed === true && input.outridden !== true
        ? SAMPLE_CREDENTIALED_GATE
        : SAMPLE_GATE;
  const forcedStamp =
    input.needsAuth === true ||
    input.event === "needs-auth" ||
    input.event === "outridden" ||
    input.event === "outrider" ||
    (input.outridden === true && input.credentialed !== true);
  const stamped = forcedStamp ? true : gate.stamped === true;
  return {
    stamped,
    mark: stamped ? GATE_MARK : null,
    sessionWide: stamped,
    stamp: stamped ? "gate-needs-auth" : "gate-open",
    note: stamped
      ? "gate stamps requires authentication for the entire session"
      : "gate stays open — courier is credentialed",
  };
}

export function inspectRetry(input = {}) {
  const retry =
    input.retry && typeof input.retry === "object"
      ? input.retry
      : input.credentialed === true && input.outridden !== true
        ? SAMPLE_CREDENTIALED_RETRY
        : SAMPLE_RETRY;
  const forcedSame =
    input.retrySamePending === true ||
    input.event === "retry-same-pending" ||
    (input.outridden === true && input.credentialed !== true);
  const same = forcedSame ? true : retry.identicalFail === true;
  return {
    afterMs: same ? RETRY_MS : 0,
    helperStillPending: same,
    identicalFail: same,
    stamp: same ? "retry-same-pending" : "retry-after-resolve",
    note: same
      ? "retry ~250ms later fails identically because helper still running"
      : "no same-pending retry — connect waited for the pouch",
  };
}

export function inspectAccess(input = {}) {
  const access =
    input.access && typeof input.access === "object"
      ? input.access
      : input.credentialed === true && input.outridden !== true
        ? SAMPLE_CREDENTIALED_ACCESS
        : SAMPLE_ACCESS;
  const forcedSplit =
    input.accessLogSplit === true ||
    input.event === "access-log-split" ||
    input.event === "concurrent-helpers" ||
    (input.outridden === true && input.credentialed !== true);
  const split = forcedSplit ? true : access.split === true;
  return {
    boundWithBearer: split ? 2 : 6,
    forbiddenNoBearer: split ? 4 : 0,
    split,
    stamp: split ? "log-split" : "log-bound",
    note: split
      ? "same window: some servers 400 with valid bearer; others 403 no bearer"
      : "access log shows bound bearers — no 403-without-header split",
  };
}

export function readBooth(input = {}) {
  const helper = inspectHelper(input);
  const connect = inspectConnect(input);
  const gate = inspectGate(input);
  const retry = inspectRetry(input);
  const access = inspectAccess(input);
  const outridden =
    input.credentialed !== true &&
    ((connect.early && helper.pendingAtConnect) ||
      (gate.stamped && helper.discarded) ||
      input.outridden === true);
  const credentialed =
    input.credentialed === true && outridden !== true && !connect.early;
  const path =
    connect.early &&
    (input.event === "early-connect" || input.earlyConnect === true);
  return {
    helper,
    connect,
    gate,
    retry,
    access,
    pouches: OUTRIDER_POUCHES,
    stations: BOOTH_STATIONS,
    outridden: outridden && !credentialed && !path,
    credentialed:
      credentialed ||
      (!connect.early &&
        !helper.pendingAtConnect &&
        input.outridden !== true &&
        input.earlyConnect !== true),
    earlyConnect: path && !credentialed,
    mark:
      path && !credentialed
        ? "early-connect"
        : outridden && !credentialed
          ? "outridden"
          : "credentialed",
  };
}

/**
 * Published outrider walk from #93776 only. Facts from the issue text.
 * A credentialed booth holds connect until headersHelper returns / timeout.
 * An outridden booth lets the bare connect ride ahead; the pouch arrives
 * 135ms too late and is discarded; the gate marks needs-auth.
 * An early-connect booth names the courier-ahead path.
 */
export const OUTRIDER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-credentialed",
    credentialed: true,
    outridden: false,
    cue: "credentialed",
    note: "idle HOLD: connect waits until headersHelper returns / timeout",
  },
  {
    t: "helper-invoked",
    event: "helper-invoked",
    outridden: true,
    helperInvoked: true,
    cue: "outridden",
    note: "helper invoked 05:57:47.227 (pid 19512)",
  },
  {
    t: "path",
    event: "early-connect",
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    cue: "outridden",
    note: "client waited ~5.37s then sent the connect anyway",
  },
  {
    t: "bare-post",
    event: "bare-post",
    outridden: true,
    barePost: true,
    cue: "outridden",
    note: "client POST 05:57:52.593 HTTP 403 no Authorization",
  },
  {
    t: "needs-auth",
    event: "needs-auth",
    outridden: true,
    needsAuth: true,
    cue: "outridden",
    note: "server marked requires authentication for the entire session",
  },
  {
    t: "helper-pending",
    event: "helper-pending",
    outridden: true,
    helperPending: true,
    cue: "outridden",
    note: "helper is NOT cancelled; still running at connect",
  },
  {
    t: "discarded-token",
    event: "discarded-token",
    outridden: true,
    discardedToken: true,
    cue: "outridden",
    note: "helper returns valid token 05:57:52.728 — 135ms too late — discarded",
  },
  {
    t: "retry-same-pending",
    event: "retry-same-pending",
    outridden: true,
    retrySamePending: true,
    cue: "outridden",
    note: "retry ~250ms later fails identically because helper still running",
  },
  {
    t: "concurrent-helpers",
    event: "concurrent-helpers",
    outridden: true,
    concurrentHelpers: true,
    cue: "outridden",
    note: "helpers 1.7–5.5s under load; different subset fails each launch",
  },
  {
    t: "access-log-split",
    event: "access-log-split",
    outridden: true,
    accessLogSplit: true,
    cue: "outridden",
    note: "same window: some servers 400 with valid bearer; others 403 no bearer",
  },
  {
    t: "ten-second-timeout",
    event: "ten-second-timeout",
    outridden: true,
    tenSecondTimeout: true,
    cue: "outridden",
    note: "documented 10s helper timeout never reached; connect fired well before",
  },
  {
    t: "path",
    event: "early-connect",
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    barePost: true,
    cue: "outridden",
    note: "early-connect — the courier rode ahead of the sealed pouch",
  },
  {
    t: "score",
    event: "outrider",
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    barePost: true,
    discardedToken: true,
    needsAuth: true,
    helperPending: true,
    tenSecondTimeout: true,
    concurrentHelpers: true,
    accessLogSplit: true,
    retrySamePending: true,
    cue: "outridden",
    note: "outrider — when the pouch arrives 135ms too late the booth never stays credentialed",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "helper-invoked",
    credentialed: true,
    helperInvoked: false,
    cue: "credentialed",
    note: "positive control: do not send connect until helper resolves or timeout",
  },
  {
    t: "announce",
    event: "cue-credentialed",
    credentialed: true,
    cue: "credentialed",
    note: "positive control: headersHelper pouch bound before the courier rides",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    credentialed: true,
    outridden: false,
    helperPending: false,
    cue: "credentialed",
  };
}

export function seedCredentialed() {
  return { ...emptyTicket() };
}

export function seedOutridden() {
  return {
    seed: SEEDED_WORD,
    credentialed: false,
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    barePost: true,
    discardedToken: true,
    needsAuth: true,
    helperPending: true,
    tenSecondTimeout: true,
    concurrentHelpers: true,
    accessLogSplit: true,
    retrySamePending: true,
    cue: "outridden",
    issue: FEATURED_ISSUE,
    helper: SAMPLE_HELPER,
    connect: SAMPLE_CONNECT,
    gate: SAMPLE_GATE,
    retry: SAMPLE_RETRY,
    access: SAMPLE_ACCESS,
  };
}

export function seedOutrider() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    barePost: true,
    discardedToken: true,
    needsAuth: true,
    helperPending: true,
    tenSecondTimeout: true,
    concurrentHelpers: true,
    accessLogSplit: true,
    retrySamePending: true,
    cue: "outridden",
  };
}

export function seedEarlyConnect() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    event: "early-connect",
    cue: "outridden",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    credentialed: true,
    cue: "credentialed",
  };
}

export function seedHelperInvoked() {
  return {
    seed: "helper-invoked",
    preferSeed: true,
    helperInvoked: true,
    cue: "outridden",
  };
}

export function seedBarePost() {
  return {
    seed: "bare-post",
    preferSeed: true,
    barePost: true,
    cue: "outridden",
  };
}

export function seedDiscardedToken() {
  return {
    seed: "discarded-token",
    preferSeed: true,
    discardedToken: true,
    cue: "outridden",
  };
}

export function seedNeedsAuth() {
  return {
    seed: "needs-auth",
    preferSeed: true,
    needsAuth: true,
    cue: "outridden",
  };
}

export function seedHelperPending() {
  return {
    seed: "helper-pending",
    preferSeed: true,
    helperPending: true,
    cue: "outridden",
  };
}

export function seedTenSecondTimeout() {
  return {
    seed: "ten-second-timeout",
    preferSeed: true,
    tenSecondTimeout: true,
    cue: "outridden",
  };
}

export function seedConcurrentHelpers() {
  return {
    seed: "concurrent-helpers",
    preferSeed: true,
    concurrentHelpers: true,
    cue: "outridden",
  };
}

export function seedAccessLogSplit() {
  return {
    seed: "access-log-split",
    preferSeed: true,
    accessLogSplit: true,
    cue: "outridden",
  };
}

export function seedRetrySamePending() {
  return {
    seed: "retry-same-pending",
    preferSeed: true,
    retrySamePending: true,
    cue: "outridden",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      credentialed: false,
      outridden: false,
      earlyConnect: false,
      helperInvoked: false,
      barePost: false,
      discardedToken: false,
      needsAuth: false,
      helperPending: false,
      tenSecondTimeout: false,
      concurrentHelpers: false,
      accessLogSplit: false,
      retrySamePending: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    credentialed: raw.credentialed === true,
    outridden:
      raw.outridden === true ||
      raw.event === "outridden" ||
      raw.event === "outrider",
    earlyConnect: raw.earlyConnect === true || raw.event === "early-connect",
    helperInvoked: raw.helperInvoked === true || raw.event === "helper-invoked",
    barePost: raw.barePost === true || raw.event === "bare-post",
    discardedToken:
      raw.discardedToken === true || raw.event === "discarded-token",
    needsAuth: raw.needsAuth === true || raw.event === "needs-auth",
    helperPending: raw.helperPending === true || raw.event === "helper-pending",
    tenSecondTimeout:
      raw.tenSecondTimeout === true || raw.event === "ten-second-timeout",
    concurrentHelpers:
      raw.concurrentHelpers === true || raw.event === "concurrent-helpers",
    accessLogSplit:
      raw.accessLogSplit === true || raw.event === "access-log-split",
    retrySamePending:
      raw.retrySamePending === true || raw.event === "retry-same-pending",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    helper: raw.helper,
    connect: raw.connect,
    gate: raw.gate,
    retry: raw.retry,
    access: raw.access,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.credentialed != null ||
        ticket.outridden != null ||
        ticket.earlyConnect != null ||
        ticket.helperInvoked != null ||
        ticket.barePost != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.helper ||
        ticket.connect ||
        ticket.gate),
  );
}

function isCredentialed(row) {
  if (row.outridden && row.cue !== "credentialed") return false;
  if (
    row.cue === "outridden" ||
    row.cue === "outrider" ||
    row.cue === "early-connect"
  ) {
    return false;
  }
  if (
    row.earlyConnect &&
    row.barePost &&
    row.cue !== "credentialed" &&
    row.credentialed !== true
  ) {
    return false;
  }
  if (
    row.earlyConnect &&
    row.helperInvoked &&
    row.cue !== "credentialed" &&
    row.credentialed !== true
  ) {
    return false;
  }
  if (row.credentialed === true && row.outridden !== true && row.cue !== "outridden") {
    return true;
  }
  if (
    row.cue === "credentialed" &&
    row.outridden !== true &&
    row.earlyConnect !== true &&
    row.barePost !== true
  ) {
    return true;
  }
  return false;
}

function isEarlyConnectPath(row) {
  return (
    row.event === "early-connect" &&
    !isCredentialed(row) &&
    (row.earlyConnect === true ||
      row.helperInvoked === true ||
      row.barePost === true)
  );
}

function isOutridden(row) {
  if (isCredentialed(row)) return false;
  if (isEarlyConnectPath(row) && row.cue !== "outridden") return false;
  if (row.cue === "outridden" || row.cue === "outrider") return true;
  if (row.outridden === true) return true;
  if (
    row.earlyConnect === true &&
    row.barePost === true &&
    row.needsAuth === true
  ) {
    return true;
  }
  if (row.earlyConnect === true && row.barePost === true) {
    return true;
  }
  if (
    row.helperInvoked === true ||
    row.discardedToken === true ||
    row.needsAuth === true ||
    (row.earlyConnect === true && row.helperPending === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one outrider pass against the dispatch gate.
 * credentialed: connect waits until headersHelper returns / timeout.
 * outridden / outrider: bare connect rode ahead; 403; needs-auth; token discarded.
 * early-connect: courier rode ahead of the sealed pouch.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isEarlyConnectPath(row) ||
    (row.earlyConnect && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "early-connect";
  } else if (isOutridden(row)) {
    verdict = "outrider";
  } else if (isCredentialed(row)) {
    verdict = "credentialed";
  } else if (
    row.earlyConnect ||
    row.helperInvoked ||
    row.barePost ||
    (row.needsAuth && !row.credentialed)
  ) {
    verdict = "outrider";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const helper = inspectHelper(row);
  const connect = inspectConnect(row);
  const gate = inspectGate(row);
  const retry = inspectRetry(row);
  const access = inspectAccess(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    credentialed: verdict === "credentialed" || verdict === "hold",
    outridden:
      verdict === "outridden" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    earlyConnect:
      row.earlyConnect === true ||
      verdict === "early-connect" ||
      verdict === PATH_WORD,
    helperInvoked: row.helperInvoked,
    barePost: row.barePost,
    discardedToken: row.discardedToken,
    needsAuth: row.needsAuth,
    helperPending: row.helperPending,
    tenSecondTimeout: row.tenSecondTimeout,
    concurrentHelpers: row.concurrentHelpers,
    accessLogSplit: row.accessLogSplit,
    retrySamePending: row.retrySamePending,
    cue: hold
      ? "credentialed"
      : row.earlyConnect || verdict === "early-connect"
        ? "early-connect"
        : "outridden",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit credentialed" : "score outrider",
    helperInspect: helper,
    connectInspect: connect,
    gateInspect: gate,
    retryInspect: retry,
    accessInspect: access,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : OUTRIDER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "outrider" || row.verdict === "outridden",
  );
  const path = scored.filter((row) => row.verdict === "early-connect");
  const credentialed = scored.filter((row) => row.verdict === "credentialed");
  const headline =
    scored.find((row) => row.event === "outridden") ||
    scored.find((row) => row.event === "early-connect") ||
    scored.find((row) => row.event === "bare-post") ||
    dead[dead.length - 1];
  let verdict = "credentialed";
  if (dead.length) verdict = "outrider";
  else if (path.length && !credentialed.length) verdict = "early-connect";
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
    outriddenCount: dead.length,
    pathCount: path.length,
    credentialedCount: credentialed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit credentialed" : "score outrider",
    note: headline
      ? "Bare connect rode ahead of headersHelper; 403 with no Authorization; valid token discarded 135ms later; gate marked needs-auth."
      : "published outrider walk scored against credentialed vs outridden",
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
    seeded !== "credentialed" &&
    seeded !== "outridden" &&
    seeded !== "early-connect" &&
    seeded !== "outrider" &&
    ticket.credentialed == null &&
    ticket.outridden == null &&
    ticket.earlyConnect == null &&
    ticket.barePost == null &&
    ticket.helperInvoked == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
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
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
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
    credentialed: scored.credentialed ?? false,
    outridden: scored.outridden ?? false,
    earlyConnect: scored.earlyConnect ?? false,
    helperInvoked: scored.helperInvoked ?? false,
    barePost: scored.barePost ?? false,
    discardedToken: scored.discardedToken ?? false,
    needsAuth: scored.needsAuth ?? false,
    helperPending: scored.helperPending ?? false,
    tenSecondTimeout: scored.tenSecondTimeout ?? false,
    concurrentHelpers: scored.concurrentHelpers ?? false,
    accessLogSplit: scored.accessLogSplit ?? false,
    retrySamePending: scored.retrySamePending ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.credentialed && !result.outridden ? "pouch=bound" : "pouch=discarded",
    result.earlyConnect || result.outridden ? "connect=bare" : "connect=held",
    result.helperInvoked || result.outridden ? "helper=pending" : "helper=resolved",
    result.needsAuth || result.outridden ? "gate=needs-auth" : "gate=open",
    result.earlyConnect || result.verdict === "early-connect"
      ? "path=early-connect"
      : "path=credentialed",
    result.cue === "credentialed"
      ? "cue=credentialed"
      : result.cue === "early-connect"
        ? "cue=early-connect"
        : "cue=outridden",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    credentialed: result.credentialed,
    outridden: result.outridden,
    earlyConnect: result.earlyConnect,
    helperInvoked: result.helperInvoked,
    barePost: result.barePost,
    discardedToken: result.discardedToken,
    needsAuth: result.needsAuth,
    helperPending: result.helperPending,
    tenSecondTimeout: result.tenSecondTimeout,
    concurrentHelpers: result.concurrentHelpers,
    accessLogSplit: result.accessLogSplit,
    retrySamePending: result.retrySamePending,
    helper: input && input.helper,
    connect: input && input.connect,
    gate: input && input.gate,
    retry: input && input.retry,
    access: input && input.access,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    helper: inspectHelper({
      credentialed: result.credentialed,
      outridden: result.outridden,
      helperPending: result.helperPending,
      helperInvoked: result.helperInvoked,
      helper: input && input.helper,
    }),
    connect: inspectConnect({
      credentialed: result.credentialed,
      outridden: result.outridden,
      earlyConnect: result.earlyConnect,
      barePost: result.barePost,
      connect: input && input.connect,
    }),
    gate: inspectGate({
      credentialed: result.credentialed,
      outridden: result.outridden,
      needsAuth: result.needsAuth,
      gate: input && input.gate,
    }),
    retry: inspectRetry({
      credentialed: result.credentialed,
      outridden: result.outridden,
      retrySamePending: result.retrySamePending,
      retry: input && input.retry,
    }),
    access: inspectAccess({
      credentialed: result.credentialed,
      outridden: result.outridden,
      accessLogSplit: result.accessLogSplit,
      concurrentHelpers: result.concurrentHelpers,
      access: input && input.access,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      outridden:
        result.outridden === true ||
        result.verdict === "outridden" ||
        result.verdict === "outrider",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      helperKind: HELPER_KIND,
      helperInvokedAt: HELPER_INVOKED_AT,
      clientPostAt: CLIENT_POST_AT,
      helperReturnAt: HELPER_RETURN_AT,
      tooLateMs: TOO_LATE_MS,
      helperElapsedMs: HELPER_ELAPSED_MS,
      clientWaitS: CLIENT_WAIT_S,
      retryMs: RETRY_MS,
      timeoutS: TIMEOUT_S,
      helperRange: HELPER_RANGE,
      postStatus: POST_STATUS,
      boundStatus: BOUND_STATUS,
      gateMark: GATE_MARK,
      pouches: OUTRIDER_POUCHES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: await headersHelper before first connect (bounded by the existing 10s timeout); on 401/403 retry after the outstanding helper resolves; surface a log line when the helper did not resolve before connect. Invite verify against #93776 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
