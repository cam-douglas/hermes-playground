#!/usr/bin/env node
/**
 * Nullarbor — Nullarbor Plain / empty-bearer ticket booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A plugin-defined HTTP MCP server whose Authorization header uses
 * ${VAR} substitution fails to connect on 2.1.260 with HTTP 401,
 * because the header is sent with no token in it. The identical
 * plugin, environment variable, shell and config connect on 2.1.247
 * and 2.1.223. Direct POST evidence: expanded Bearer token → 200;
 * literal unexpanded Bearer ${VAR} → 403; Bearer  (empty) → 401.
 * 2.1.260 matches the empty case, not trailing-brace corruption.
 * Reproduces from a plain shell; desktop happens to bundle 2.1.260.
 *
 *   node nullarbor.mjs data/emptied.json
 *   echo '{"seed":"emptied"}' | node nullarbor.mjs
 *
 * Idle word is stamped (HOLD: ${VAR} expands from process env;
 * Authorization Bearer token present; claude mcp list Connected;
 * direct POST with expanded token → HTTP 200).
 * Seeded word is emptied (#93595 — 2.1.260 expands plugin HTTP MCP
 * ${VAR} header to empty → HTTP 401 matching Bearer  empty case).
 * Path word is empty-expand.
 * Product score word is nullarbor (Score nullarbor or admit stamped.).
 *
 * Encoded from anthropics/claude-code#93595 issue text only.
 * Hypothesis (NON-BINDING): plugin HTTP MCP ${VAR} header expansion
 * should resolve from the CLI process environment on 2.1.260 exactly
 * as it does on 2.1.247 / 2.1.223. Verify against #93595 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "stamped",
  "emptied",
  "nullarbor",
  "empty-expand",
  "hold",
  "token-present",
  "connected",
  "http-200",
  "http-401",
  "http-403",
  "bearer-empty",
  "not-literal",
  "not-trailing-brace",
  "plugin-http",
  "var-header",
  "process-env",
  "desktop-bundle",
  "npm-global",
  "plain-shell",
  "bisect-260",
  "last-working-247",
  "regression-248-260",
  "false-token-check",
  "oauth-disabled",
  "byte-identical",
  "no-competing-mcp",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "stamped";
export const PATH_WORD = "empty-expand";
export const SEEDED_WORD = "emptied";
export const PRODUCT_WORD = "nullarbor";
export const HOLD = Object.freeze(["stamped", "hold"]);
export const RECOVER = Object.freeze(["stamped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "counterfoil",
  "cachet",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "emptied" && name !== "nullarbor",
  ),
);

export const FEATURED_ISSUE = 93595;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93595";
export const TITLE =
  "[BUG] Plugin HTTP MCP ${VAR} header expansion resolves to empty in 2.1.260 (works in 2.1.247 / 2.1.223) — bearer token never sent";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:mcp",
  "regression",
  "area:plugins",
]);
export const WORKING_VERSIONS = Object.freeze(["2.1.223", "2.1.247"]);
export const FAILED_VERSION = "2.1.260";
export const LAST_WORKING = "2.1.247";
export const REGRESSION_BRACKET = "2.1.248–2.1.260";
export const CLAUDE_CODE_VERSION = "2.1.260";
export const OS = "Windows 11 Pro 10.0.26200";
export const HEADER_TEMPLATE = "Bearer ${SONAR_TOKEN}";
export const HEADER_EMPTY = "Bearer ";
export const HTTP_EXPANDED = 200;
export const HTTP_LITERAL = 403;
export const HTTP_EMPTY = 401;
export const MCP_TYPE = "http";
export const PHRASE = "Score nullarbor or admit stamped.";
export const DISTRIBUTION =
  "Plugin-defined HTTP MCP server with Authorization: Bearer ${VAR}. 2.1.260 sends the header with no token (HTTP 401). Identical plugin + env + shell + config connect on 2.1.247 and 2.1.223. Desktop bundles 2.1.260 under %APPDATA%\\Claude\\claude-code\\<version>\\ while npm-global PATH may be older. Reproduces from a plain shell.";
export const SESSION_KIND =
  "Install plugin with type http + Authorization Bearer ${SOME_TOKEN}; set SOME_TOKEN in user env; confirm direct POST 200 with expanded token; claude mcp list on 2.1.247 → Connected; same on 2.1.260 → Failed HTTP 401. No config, plugin, token or environment change between the two binaries.";

export const PLAIN_STATIONS = Object.freeze([
  {
    id: "booth",
    survey: "approach the blank ticket booth (bearer should be stamped from process env)",
    kind: "booth",
    note: "seeded: the ticket booth stays blank — ${VAR} expands to empty and no bearer is stamped",
  },
  {
    id: "saltbush",
    survey: "look across the saltbush expanse (Authorization should carry a token)",
    kind: "saltbush",
    note: "seeded: the plain is empty — header is sent as Bearer  with no token",
  },
  {
    id: "horizon",
    survey: "read the horizon codes (expanded 200 / literal 403 / empty 401)",
    kind: "horizon",
    note: "seeded: 2.1.260 matches empty 401, not literal-unexpanded 403",
  },
  {
    id: "mirage",
    survey: "walk the Eyre mile-posts (2.1.223 Connected, 2.1.247 Connected, 2.1.260 Failed)",
    kind: "mirage",
    note: "seeded: bisect same machine/shell/config/env isolates the 2.1.260 binary",
  },
  {
    id: "blotter",
    survey: "press the brass stamp (token present in process env; not profile scripts)",
    kind: "blotter",
    note: "seeded: var inherited from process env; error text falsely says check the token is valid",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "empty-expand",
  "emptied",
  "http-401",
  "bearer-empty",
  "not-literal",
  "bisect-260",
  "desktop-bundle",
  "plain-shell",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84367,
    title: "cite-only cousin — trailing } leaks → HTTP 400 / badly formatted",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — trailing brace corrupts the header → HTTP 400 on 2.1.222 which still works for this reporter's empty-expand case. Do not rebuild",
  },
  {
    issue: 84314,
    title: "cite-only cousin — non-deterministic ${VAR} for MCP env on Linux",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — non-deterministic ${VAR} expansion for MCP env on Linux. Do not rebuild",
  },
  {
    issue: 90074,
    title: "cite-only cousin — Windows desktop sanitizes stdio MCP env",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Windows desktop sanitizes stdio MCP env — ruled out; var present in 2.1.260's own env. Do not rebuild",
  },
  {
    issue: 91307,
    title: "cite-only cousin — host-app state Desktop vs Terminal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Gitea MCP auth differs Desktop vs Terminal framed as host-app state; this reproduces from a plain shell. Do not rebuild",
  },
  {
    issue: 90677,
    title: "cite-only cousin — related MCP / plugin header surface",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 90050,
    title: "cite-only cousin — related MCP / plugin header surface",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93585,
    title: "stale cloud branch after pre-warm; alt Anachronism",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93570,
    title: "single-task shutdown kills all; alt Overkill",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93589,
    title: "Cowork egress additional domains ignored",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash ~8175 truncation + backslash halving",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93615,
    title: "scheduled WebSearch hangs",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93622,
    title: "channel messages merge lose prompt cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "petard",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "counterfoil",
  "cachet",
  "mondegreen",
  "seizing",
  "hangfire",
  "flashpan",
  "frizzen",
]);

export const SAMPLE_POSTS = Object.freeze([
  {
    id: "expanded",
    authorization: "Bearer $TOKEN (shell-expanded)",
    http: 200,
    note: "direct POST with expanded token — credential itself works",
  },
  {
    id: "literal",
    authorization: "Bearer ${SONAR_TOKEN} (literal, unexpanded)",
    http: 403,
    note: "unexpanded literal is 403 — not the 2.1.260 case",
  },
  {
    id: "empty",
    authorization: "Bearer  (empty)",
    http: 401,
    note: "empty bearer is 401 — 2.1.260 matches this case",
  },
]);

export const SAMPLE_BISECT = Object.freeze([
  { version: "2.1.223", origin: "npm-global on PATH", result: "Connected", http: null },
  { version: "2.1.247", origin: "older desktop-bundled build, still on disk", result: "Connected", http: null },
  { version: "2.1.260", origin: "current desktop-bundled build", result: "Failed", http: 401 },
]);

export const SAMPLE_STAMPED_BISECT = Object.freeze([
  { version: "2.1.223", origin: "npm-global on PATH", result: "Connected", http: null },
  { version: "2.1.247", origin: "older desktop-bundled build, still on disk", result: "Connected", http: null },
  { version: "2.1.260", origin: "current desktop-bundled build", result: "Connected", http: null },
]);

export const SAMPLE_TICKET = Object.freeze({
  stamped: false,
  emptied: true,
  bearerPresent: false,
  impression: "blank",
});

export const SAMPLE_STAMPED_TICKET = Object.freeze({
  stamped: true,
  emptied: false,
  bearerPresent: true,
  impression: "brass",
});

export const SAMPLE_HORIZON = Object.freeze({
  expanded: 200,
  literal: 403,
  empty: 401,
  match: "empty",
});

export const SAMPLE_STAMPED_HORIZON = Object.freeze({
  expanded: 200,
  literal: 403,
  empty: 401,
  match: "expanded",
});

export const SAMPLE_HEADER = Object.freeze({
  template: HEADER_TEMPLATE,
  expanded: false,
  empty: true,
  literal: false,
  sent: HEADER_EMPTY,
});

export const SAMPLE_STAMPED_HEADER = Object.freeze({
  template: HEADER_TEMPLATE,
  expanded: true,
  empty: false,
  literal: false,
  sent: "Bearer <token>",
});

export const SAMPLE_BUNDLE = Object.freeze({
  desktopBundled: true,
  npmGlobalOlder: true,
  plainShellRepro: true,
  desktopPath: "%APPDATA%\\Claude\\claude-code\\2.1.260\\",
});

export const SAMPLE_STAMPED_BUNDLE = Object.freeze({
  desktopBundled: false,
  npmGlobalOlder: false,
  plainShellRepro: false,
  desktopPath: "",
});

export const SAMPLE_LOG = Object.freeze([
  { t: "idle", line: "${VAR} expands from process env; Bearer token present; mcp list Connected; expanded POST → 200" },
  { t: "plugin", line: "plugin type http + Authorization: Bearer ${SONAR_TOKEN}" },
  { t: "env", line: "SOME_TOKEN inherited from process env — not profile scripts" },
  { t: "post-200", line: "direct POST Bearer $TOKEN (expanded) → HTTP 200" },
  { t: "247", line: "claude mcp list on 2.1.247 → Connected" },
  { t: "260", line: "claude mcp list on 2.1.260 → Failed HTTP 401" },
  { t: "empty", line: "2.1.260 matches Bearer  (empty) → 401, not literal ${VAR} → 403" },
  { t: "brace", line: "not #84367 trailing-brace leak (that one is HTTP 400 on 2.1.222)" },
  { t: "bundle", line: "desktop bundles 2.1.260 under %APPDATA%\\Claude\\claude-code\\<version>\\" },
  { t: "shell", line: "reproduces from a plain shell; not only desktop-vs-terminal" },
  { t: "error", line: "error text falsely says Check that the token is valid; OAuth fallback disabled" },
  { t: "score", line: "empty-expand across the Nullarbor — Score nullarbor or admit stamped." },
]);

export function inspectTicket(input = {}) {
  const ticket =
    input.ticket && typeof input.ticket === "object"
      ? input.ticket
      : input.stamped === true && input.emptied !== true
        ? SAMPLE_STAMPED_TICKET
        : SAMPLE_TICKET;
  const forcedEmpty =
    input.emptied === true ||
    input.bearerEmpty === true ||
    input.http401 === true ||
    input.event === "emptied" ||
    input.event === "bearer-empty" ||
    input.event === "http-401" ||
    input.emptyExpand === true;
  const bearerPresent = forcedEmpty
    ? false
    : ticket.bearerPresent === true ||
      input.tokenPresent === true ||
      input.stamped === true;
  const emptied = forcedEmpty || ticket.emptied === true || !bearerPresent;
  return {
    stamped: !emptied && bearerPresent,
    emptied,
    bearerPresent,
    impression: emptied ? "blank" : "brass",
    stamp: emptied && !bearerPresent ? "emptied" : "stamped",
    note: bearerPresent
      ? "ticket booth stamped — ${VAR} expanded; Bearer token present"
      : "ticket booth emptied — header sent with no token; the plain is blank",
  };
}

export function inspectHorizon(input = {}) {
  const horizon =
    input.horizon && typeof input.horizon === "object"
      ? input.horizon
      : input.stamped === true && input.emptied !== true
        ? SAMPLE_STAMPED_HORIZON
        : SAMPLE_HORIZON;
  const forcedEmpty =
    input.http401 === true ||
    input.event === "http-401" ||
    input.bearerEmpty === true ||
    (input.emptied === true && input.stamped !== true);
  const forcedLiteral =
    input.http403 === true || input.event === "http-403";
  const match = forcedEmpty
    ? "empty"
    : forcedLiteral
      ? "literal"
      : horizon.match || (input.http200 === true ? "expanded" : "empty");
  return {
    expanded: horizon.expanded || HTTP_EXPANDED,
    literal: horizon.literal || HTTP_LITERAL,
    empty: horizon.empty || HTTP_EMPTY,
    match,
    stamp: match,
    note:
      match === "expanded"
        ? "horizon codes — expanded Bearer POST lands 200; mcp list Connected"
        : match === "literal"
          ? "horizon codes — literal unexpanded ${VAR} is 403, not the 2.1.260 case"
          : "horizon codes — 2.1.260 matches empty Bearer  → 401, not literal 403",
  };
}

export function inspectHeader(input = {}) {
  const header =
    input.header && typeof input.header === "object"
      ? input.header
      : input.stamped === true && input.emptied !== true
        ? SAMPLE_STAMPED_HEADER
        : SAMPLE_HEADER;
  const forcedEmpty =
    input.bearerEmpty === true ||
    input.emptyExpand === true ||
    input.event === "empty-expand" ||
    input.event === "bearer-empty" ||
    input.emptied === true ||
    (input.http401 === true && input.stamped !== true);
  const empty = forcedEmpty ? true : header.empty === true;
  return {
    template: header.template || HEADER_TEMPLATE,
    expanded: forcedEmpty ? false : header.expanded === true,
    empty,
    literal: header.literal === true && !empty,
    sent: empty ? HEADER_EMPTY : header.sent || HEADER_TEMPLATE,
    stamp: empty ? "empty" : header.expanded === true ? "expanded" : "literal",
    note: empty
      ? "header blotter — ${VAR} expands to empty; sent as Bearer  "
      : "header blotter — ${VAR} expands from process env; Bearer token present",
  };
}

export function inspectBisect(input = {}) {
  const rows = Array.isArray(input.bisect)
    ? input.bisect
    : SAMPLE_BISECT;
  const sampleCalm =
    rows === SAMPLE_BISECT && input.stamped === true && input.emptied !== true;
  const forcedFail =
    input.bisect260 === true ||
    input.event === "bisect-260" ||
    (input.emptied === true && input.stamped !== true);
  const failed =
    !sampleCalm &&
    (forcedFail ||
      rows.some((row) => row.version === FAILED_VERSION && row.result === "Failed"));
  return {
    failed,
    lastWorking: LAST_WORKING,
    failedVersion: FAILED_VERSION,
    rows: sampleCalm ? SAMPLE_STAMPED_BISECT : rows,
    stamp: failed ? "failed-260" : "connected",
    note: failed
      ? "Eyre mile-posts — 2.1.223 Connected, 2.1.247 Connected, 2.1.260 Failed HTTP 401"
      : "Eyre mile-posts stamped — working binaries stay Connected",
  };
}

export function inspectBundle(input = {}) {
  const bundle =
    input.bundle && typeof input.bundle === "object"
      ? input.bundle
      : input.stamped === true && input.emptied !== true
        ? SAMPLE_STAMPED_BUNDLE
        : SAMPLE_BUNDLE;
  const forced =
    input.desktopBundle === true ||
    input.plainShell === true ||
    input.event === "desktop-bundle" ||
    input.event === "plain-shell" ||
    input.emptied === true;
  return {
    desktopBundled: forced ? true : bundle.desktopBundled === true,
    npmGlobalOlder: bundle.npmGlobalOlder === true || input.npmGlobal === true,
    plainShellRepro: forced ? true : bundle.plainShellRepro === true,
    stamp: forced || bundle.desktopBundled ? "bundled-260" : "npm-working",
    note:
      forced || bundle.desktopBundled
        ? "desktop bundles 2.1.260; npm-global PATH may be older; plain-shell still fails"
        : "working npm-global binary on PATH; desktop bundle not in play",
  };
}

export function readBooth(input = {}) {
  const ticket = inspectTicket(input);
  const horizon = inspectHorizon(input);
  const header = inspectHeader(input);
  const bisect = inspectBisect(input);
  const bundle = inspectBundle(input);
  const emptied =
    input.stamped !== true &&
    ((ticket.emptied && !ticket.bearerPresent) ||
      horizon.match === "empty" ||
      input.emptied === true);
  const stamped =
    input.stamped === true &&
    emptied !== true &&
    ticket.bearerPresent &&
    horizon.match === "expanded";
  const path =
    header.empty &&
    (input.event === "empty-expand" || input.emptyExpand === true);
  return {
    ticket,
    horizon,
    header,
    bisect,
    bundle,
    stations: PLAIN_STATIONS,
    emptied: emptied && !stamped && !path,
    stamped:
      stamped ||
      (ticket.bearerPresent &&
        horizon.match === "expanded" &&
        input.emptied !== true &&
        input.emptyExpand !== true),
    emptyExpand: path && !stamped,
    mark:
      path && !stamped
        ? "empty-expand"
        : emptied && !stamped
          ? "emptied"
          : "stamped",
  };
}

/**
 * Published nullarbor walk from #93595 only. Facts from the issue text.
 * A stamped booth expands ${VAR} from process env and stays Connected.
 * An emptied booth on 2.1.260 sends Bearer  empty → HTTP 401.
 * An empty-expand booth names the empty substitution as the path.
 */
export const NULLARBOR_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-stamped",
    stamped: true,
    emptied: false,
    tokenPresent: true,
    connected: true,
    http200: true,
    cue: "stamped",
    note: "idle HOLD: ${VAR} expands from process env; Bearer token present; mcp list Connected; expanded POST → 200",
  },
  {
    t: "plugin",
    event: "plugin-http",
    emptied: true,
    pluginHttp: true,
    varHeader: true,
    cue: "emptied",
    note: "plugin type http + Authorization: Bearer ${SONAR_TOKEN}",
  },
  {
    t: "env",
    event: "process-env",
    emptied: true,
    processEnv: true,
    tokenPresent: true,
    cue: "emptied",
    note: "SOME_TOKEN inherited from process env — not profile scripts",
  },
  {
    t: "post-200",
    event: "http-200",
    emptied: true,
    http200: true,
    cue: "emptied",
    note: "direct POST Bearer $TOKEN (expanded) → HTTP 200",
  },
  {
    t: "247",
    event: "last-working-247",
    emptied: true,
    lastWorking247: true,
    connected: true,
    cue: "emptied",
    note: "claude mcp list on 2.1.247 → Connected",
  },
  {
    t: "260",
    event: "bisect-260",
    emptied: true,
    bisect260: true,
    http401: true,
    cue: "emptied",
    note: "claude mcp list on 2.1.260 → Failed HTTP 401",
  },
  {
    t: "empty",
    event: "bearer-empty",
    emptied: true,
    bearerEmpty: true,
    http401: true,
    notLiteral: true,
    cue: "emptied",
    note: "2.1.260 matches Bearer  (empty) → 401, not literal ${VAR} → 403",
  },
  {
    t: "brace",
    event: "not-trailing-brace",
    emptied: true,
    notTrailingBrace: true,
    cue: "emptied",
    note: "not #84367 trailing-brace leak (HTTP 400 on 2.1.222 which still works here)",
  },
  {
    t: "bundle",
    event: "desktop-bundle",
    emptied: true,
    desktopBundle: true,
    cue: "emptied",
    note: "desktop bundles 2.1.260 under %APPDATA%\\Claude\\claude-code\\<version>\\",
  },
  {
    t: "shell",
    event: "plain-shell",
    emptied: true,
    plainShell: true,
    cue: "emptied",
    note: "reproduces from a plain shell; not only desktop-vs-terminal",
  },
  {
    t: "error",
    event: "false-token-check",
    emptied: true,
    falseTokenCheck: true,
    oauthDisabled: true,
    cue: "emptied",
    note: "error text falsely says Check that the token is valid; OAuth fallback disabled",
  },
  {
    t: "path",
    event: "empty-expand",
    emptied: true,
    emptyExpand: true,
    bearerEmpty: true,
    cue: "emptied",
    note: "empty-expand — ${VAR} resolves to empty, not a literal unexpanded string",
  },
  {
    t: "score",
    event: "nullarbor",
    emptied: true,
    bearerEmpty: true,
    http401: true,
    emptyExpand: true,
    cue: "emptied",
    note: "nullarbor — the ticket booth is empty across the saltbush plain",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "http-200",
    stamped: true,
    http200: true,
    cue: "stamped",
    note: "positive control: expanded Bearer POST → HTTP 200",
  },
  {
    t: "connected",
    event: "cue-stamped",
    stamped: true,
    connected: true,
    tokenPresent: true,
    cue: "stamped",
    note: "positive control: mcp list Connected; token present",
  },
  {
    t: "247",
    event: "last-working-247",
    stamped: true,
    lastWorking247: true,
    cue: "stamped",
    note: "positive control: 2.1.247 Connected",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    stamped: true,
    emptied: false,
    tokenPresent: true,
    connected: true,
    http200: true,
    cue: "stamped",
  };
}

export function seedStamped() {
  return { ...emptyTicket() };
}

export function seedEmptied() {
  return {
    seed: SEEDED_WORD,
    stamped: false,
    emptied: true,
    pluginHttp: true,
    varHeader: true,
    processEnv: true,
    tokenPresent: true,
    http200: true,
    lastWorking247: true,
    bisect260: true,
    http401: true,
    bearerEmpty: true,
    notLiteral: true,
    notTrailingBrace: true,
    desktopBundle: true,
    npmGlobal: true,
    plainShell: true,
    falseTokenCheck: true,
    oauthDisabled: true,
    byteIdentical: true,
    noCompetingMcp: true,
    emptyExpand: true,
    cue: "emptied",
    issue: FEATURED_ISSUE,
    ticket: SAMPLE_TICKET,
    horizon: SAMPLE_HORIZON,
    header: SAMPLE_HEADER,
    bisect: SAMPLE_BISECT,
    bundle: SAMPLE_BUNDLE,
  };
}

export function seedNullarbor() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    emptied: true,
    bearerEmpty: true,
    http401: true,
    emptyExpand: true,
    cue: "emptied",
  };
}

export function seedEmptyExpand() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    emptied: true,
    emptyExpand: true,
    bearerEmpty: true,
    event: "empty-expand",
    cue: "emptied",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    stamped: true,
    cue: "stamped",
  };
}

export function seedTokenPresent() {
  return { seed: "token-present", preferSeed: true, tokenPresent: true, cue: "stamped" };
}

export function seedConnected() {
  return { seed: "connected", preferSeed: true, connected: true, cue: "stamped" };
}

export function seedHttp200() {
  return { seed: "http-200", preferSeed: true, http200: true, cue: "stamped" };
}

export function seedHttp401() {
  return { seed: "http-401", preferSeed: true, http401: true, cue: "emptied" };
}

export function seedHttp403() {
  return { seed: "http-403", preferSeed: true, http403: true, cue: "emptied" };
}

export function seedBearerEmpty() {
  return { seed: "bearer-empty", preferSeed: true, bearerEmpty: true, cue: "emptied" };
}

export function seedNotLiteral() {
  return { seed: "not-literal", preferSeed: true, notLiteral: true, cue: "emptied" };
}

export function seedNotTrailingBrace() {
  return { seed: "not-trailing-brace", preferSeed: true, notTrailingBrace: true, cue: "emptied" };
}

export function seedPluginHttp() {
  return { seed: "plugin-http", preferSeed: true, pluginHttp: true, cue: "emptied" };
}

export function seedVarHeader() {
  return { seed: "var-header", preferSeed: true, varHeader: true, cue: "emptied" };
}

export function seedProcessEnv() {
  return { seed: "process-env", preferSeed: true, processEnv: true, cue: "emptied" };
}

export function seedDesktopBundle() {
  return { seed: "desktop-bundle", preferSeed: true, desktopBundle: true, cue: "emptied" };
}

export function seedNpmGlobal() {
  return { seed: "npm-global", preferSeed: true, npmGlobal: true, cue: "emptied" };
}

export function seedPlainShell() {
  return { seed: "plain-shell", preferSeed: true, plainShell: true, cue: "emptied" };
}

export function seedBisect260() {
  return { seed: "bisect-260", preferSeed: true, bisect260: true, cue: "emptied" };
}

export function seedLastWorking247() {
  return { seed: "last-working-247", preferSeed: true, lastWorking247: true, cue: "emptied" };
}

export function seedRegression248260() {
  return { seed: "regression-248-260", preferSeed: true, regression248260: true, cue: "emptied" };
}

export function seedFalseTokenCheck() {
  return { seed: "false-token-check", preferSeed: true, falseTokenCheck: true, cue: "emptied" };
}

export function seedOauthDisabled() {
  return { seed: "oauth-disabled", preferSeed: true, oauthDisabled: true, cue: "emptied" };
}

export function seedByteIdentical() {
  return { seed: "byte-identical", preferSeed: true, byteIdentical: true, cue: "emptied" };
}

export function seedNoCompetingMcp() {
  return { seed: "no-competing-mcp", preferSeed: true, noCompetingMcp: true, cue: "emptied" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      stamped: false,
      emptied: false,
      emptyExpand: false,
      tokenPresent: false,
      connected: false,
      http200: false,
      http401: false,
      http403: false,
      bearerEmpty: false,
      notLiteral: false,
      notTrailingBrace: false,
      pluginHttp: false,
      varHeader: false,
      processEnv: false,
      desktopBundle: false,
      npmGlobal: false,
      plainShell: false,
      bisect260: false,
      lastWorking247: false,
      regression248260: false,
      falseTokenCheck: false,
      oauthDisabled: false,
      byteIdentical: false,
      noCompetingMcp: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    stamped: raw.stamped === true,
    emptied:
      raw.emptied === true ||
      raw.event === "emptied" ||
      raw.event === "nullarbor",
    emptyExpand: raw.emptyExpand === true || raw.event === "empty-expand",
    tokenPresent: raw.tokenPresent === true,
    connected: raw.connected === true || raw.event === "connected",
    http200: raw.http200 === true || raw.event === "http-200",
    http401: raw.http401 === true || raw.event === "http-401",
    http403: raw.http403 === true || raw.event === "http-403",
    bearerEmpty: raw.bearerEmpty === true || raw.event === "bearer-empty",
    notLiteral: raw.notLiteral === true || raw.event === "not-literal",
    notTrailingBrace:
      raw.notTrailingBrace === true || raw.event === "not-trailing-brace",
    pluginHttp: raw.pluginHttp === true || raw.event === "plugin-http",
    varHeader: raw.varHeader === true || raw.event === "var-header",
    processEnv: raw.processEnv === true || raw.event === "process-env",
    desktopBundle: raw.desktopBundle === true || raw.event === "desktop-bundle",
    npmGlobal: raw.npmGlobal === true || raw.event === "npm-global",
    plainShell: raw.plainShell === true || raw.event === "plain-shell",
    bisect260: raw.bisect260 === true || raw.event === "bisect-260",
    lastWorking247:
      raw.lastWorking247 === true || raw.event === "last-working-247",
    regression248260:
      raw.regression248260 === true || raw.event === "regression-248-260",
    falseTokenCheck:
      raw.falseTokenCheck === true || raw.event === "false-token-check",
    oauthDisabled: raw.oauthDisabled === true || raw.event === "oauth-disabled",
    byteIdentical: raw.byteIdentical === true || raw.event === "byte-identical",
    noCompetingMcp:
      raw.noCompetingMcp === true || raw.event === "no-competing-mcp",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    ticket: raw.ticket,
    horizon: raw.horizon,
    header: raw.header,
    bisect: raw.bisect,
    bundle: raw.bundle,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.stamped != null ||
        ticket.emptied != null ||
        ticket.emptyExpand != null ||
        ticket.tokenPresent != null ||
        ticket.connected != null ||
        ticket.http401 != null ||
        ticket.bearerEmpty != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.ticket ||
        ticket.horizon ||
        ticket.header),
  );
}

function isStamped(row) {
  if (row.emptied && row.cue !== "stamped") return false;
  if (
    row.cue === "emptied" ||
    row.cue === "nullarbor" ||
    row.cue === "empty-expand"
  ) {
    return false;
  }
  if (
    row.bearerEmpty &&
    row.http401 &&
    row.cue !== "stamped" &&
    row.stamped !== true
  ) {
    return false;
  }
  if (
    row.emptyExpand &&
    row.bearerEmpty &&
    row.cue !== "stamped" &&
    row.stamped !== true
  ) {
    return false;
  }
  if (row.stamped === true && row.emptied !== true && row.cue !== "emptied") {
    return true;
  }
  if (
    row.cue === "stamped" &&
    row.emptied !== true &&
    row.bearerEmpty !== true &&
    row.emptyExpand !== true
  ) {
    return true;
  }
  if (
    (row.tokenPresent === true || row.connected === true || row.http200 === true) &&
    row.emptied !== true &&
    row.bearerEmpty !== true &&
    row.http401 !== true &&
    row.emptyExpand !== true
  ) {
    return true;
  }
  return false;
}

function isEmptyExpandPath(row) {
  return (
    row.event === "empty-expand" &&
    !isStamped(row) &&
    (row.emptyExpand === true || row.bearerEmpty === true)
  );
}

function isEmptied(row) {
  if (isStamped(row)) return false;
  if (isEmptyExpandPath(row) && row.cue !== "emptied") return false;
  if (row.cue === "emptied" || row.cue === "nullarbor") return true;
  if (row.emptied === true) return true;
  if (
    row.bearerEmpty === true &&
    row.http401 === true &&
    row.bisect260 === true
  ) {
    return true;
  }
  if (row.http401 === true && row.bearerEmpty === true) {
    return true;
  }
  if (
    row.http401 === true ||
    row.bearerEmpty === true ||
    row.bisect260 === true ||
    (row.emptyExpand === true && row.notLiteral === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one empty-plain pass against the nullarbor booth.
 * stamped: ${VAR} expands; Bearer present; mcp list Connected; POST 200.
 * emptied: 2.1.260 expands ${VAR} to empty; HTTP 401 matching Bearer empty.
 * empty-expand: the empty substitution (not literal unexpanded) is the path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isEmptyExpandPath(row) ||
    (row.emptyExpand && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "empty-expand";
  } else if (isEmptied(row)) {
    verdict = "emptied";
  } else if (isStamped(row)) {
    verdict = "stamped";
  } else if (
    row.bearerEmpty ||
    row.http401 ||
    row.bisect260 ||
    (row.emptyExpand && !row.http200)
  ) {
    verdict = "emptied";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const ticketInspect = inspectTicket(row);
  const horizon = inspectHorizon(row);
  const header = inspectHeader(row);
  const bisect = inspectBisect(row);
  const bundle = inspectBundle(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    stamped: verdict === "stamped" || verdict === "hold",
    emptied:
      verdict === "emptied" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    emptyExpand:
      row.emptyExpand === true ||
      verdict === "empty-expand" ||
      verdict === PATH_WORD,
    tokenPresent: row.tokenPresent,
    connected: row.connected,
    http200: row.http200,
    http401: row.http401,
    http403: row.http403,
    bearerEmpty: row.bearerEmpty,
    notLiteral: row.notLiteral,
    notTrailingBrace: row.notTrailingBrace,
    pluginHttp: row.pluginHttp,
    varHeader: row.varHeader,
    processEnv: row.processEnv,
    desktopBundle: row.desktopBundle,
    npmGlobal: row.npmGlobal,
    plainShell: row.plainShell,
    bisect260: row.bisect260,
    lastWorking247: row.lastWorking247,
    regression248260: row.regression248260,
    falseTokenCheck: row.falseTokenCheck,
    oauthDisabled: row.oauthDisabled,
    byteIdentical: row.byteIdentical,
    noCompetingMcp: row.noCompetingMcp,
    cue: hold
      ? "stamped"
      : row.emptyExpand || verdict === "empty-expand"
        ? "empty-expand"
        : "emptied",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit stamped" : "score nullarbor",
    ticketInspect,
    horizonInspect: horizon,
    headerInspect: header,
    bisectInspect: bisect,
    bundleInspect: bundle,
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
      : NULLARBOR_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const emptied = scored.filter((row) => row.verdict === "emptied");
  const path = scored.filter((row) => row.verdict === "empty-expand");
  const stamped = scored.filter((row) => row.verdict === "stamped");
  const headline =
    scored.find((row) => row.event === "emptied") ||
    scored.find((row) => row.event === "empty-expand") ||
    scored.find((row) => row.event === "http-401") ||
    emptied[emptied.length - 1];
  let verdict = "stamped";
  if (emptied.length) verdict = "emptied";
  else if (path.length && !stamped.length) verdict = "empty-expand";
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
    emptiedCount: emptied.length,
    pathCount: path.length,
    stampedCount: stamped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit stamped" : "score nullarbor",
    note: headline
      ? "Plugin HTTP MCP ${VAR} header on 2.1.260 expands empty; HTTP 401 matches Bearer empty, not literal 403; 2.1.247 Connected; plain-shell repro; desktop bundles 2.1.260."
      : "published nullarbor walk scored against stamped vs emptied",
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
    seeded !== "stamped" &&
    seeded !== "emptied" &&
    seeded !== "empty-expand" &&
    seeded !== "nullarbor" &&
    ticket.stamped == null &&
    ticket.emptied == null &&
    ticket.bearerEmpty == null &&
    ticket.emptyExpand == null &&
    ticket.http401 == null &&
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
    stamped: scored.stamped ?? false,
    emptied: scored.emptied ?? false,
    emptyExpand: scored.emptyExpand ?? false,
    tokenPresent: scored.tokenPresent ?? false,
    connected: scored.connected ?? false,
    http200: scored.http200 ?? false,
    http401: scored.http401 ?? false,
    http403: scored.http403 ?? false,
    bearerEmpty: scored.bearerEmpty ?? false,
    notLiteral: scored.notLiteral ?? false,
    bisect260: scored.bisect260 ?? false,
    desktopBundle: scored.desktopBundle ?? false,
    plainShell: scored.plainShell ?? false,
    falseTokenCheck: scored.falseTokenCheck ?? false,
    oauthDisabled: scored.oauthDisabled ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.emptied || result.bearerEmpty || result.verdict === "emptied" || result.verdict === "nullarbor"
      ? "ticket=emptied"
      : "ticket=stamped",
    result.http401 || result.emptied ? "horizon=401" : "horizon=200",
    result.bearerEmpty || result.emptied ? "header=empty" : "header=expanded",
    result.bisect260 || result.emptied ? "bisect=failed-260" : "bisect=connected",
    result.desktopBundle || result.emptied ? "bundle=desktop-260" : "bundle=npm-working",
    result.emptyExpand || result.verdict === "empty-expand"
      ? "path=empty-expand"
      : "path=stamped",
    result.cue === "stamped"
      ? "cue=stamped"
      : result.cue === "empty-expand"
        ? "cue=empty-expand"
        : "cue=emptied",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    stamped: result.stamped,
    emptied: result.emptied,
    emptyExpand: result.emptyExpand,
    tokenPresent: result.tokenPresent,
    connected: result.connected,
    http200: result.http200,
    http401: result.http401,
    bearerEmpty: result.bearerEmpty,
    bisect260: result.bisect260,
    desktopBundle: result.desktopBundle,
    plainShell: result.plainShell,
    ticket: input && input.ticket,
    horizon: input && input.horizon,
    header: input && input.header,
    bisect: input && input.bisect,
    bundle: input && input.bundle,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    ticket: inspectTicket({
      stamped: result.stamped,
      emptied: result.emptied,
      bearerEmpty: result.bearerEmpty,
      tokenPresent: result.tokenPresent,
      http401: result.http401,
      emptyExpand: result.emptyExpand,
      ticket: input && input.ticket,
    }),
    horizon: inspectHorizon({
      stamped: result.stamped,
      emptied: result.emptied,
      http401: result.http401,
      http403: result.http403,
      http200: result.http200,
      bearerEmpty: result.bearerEmpty,
      horizon: input && input.horizon,
    }),
    header: inspectHeader({
      stamped: result.stamped,
      emptied: result.emptied,
      bearerEmpty: result.bearerEmpty,
      emptyExpand: result.emptyExpand,
      http401: result.http401,
      header: input && input.header,
    }),
    bisect: inspectBisect({
      bisect260: result.bisect260,
      emptied: result.emptied,
      stamped: result.stamped,
      bisect: input && input.bisect,
    }),
    bundle: inspectBundle({
      desktopBundle: result.desktopBundle,
      plainShell: result.plainShell,
      emptied: result.emptied,
      npmGlobal: result.npmGlobal,
      bundle: input && input.bundle,
    }),
    stations: PLAIN_STATIONS.map((row) => ({
      ...row,
      emptied: result.emptied === true || result.verdict === "emptied",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      lastWorking: LAST_WORKING,
      failedVersion: FAILED_VERSION,
      regressionBracket: REGRESSION_BRACKET,
      workingVersions: [...WORKING_VERSIONS],
      os: OS,
      headerTemplate: HEADER_TEMPLATE,
      headerEmpty: HEADER_EMPTY,
      httpExpanded: HTTP_EXPANDED,
      httpLiteral: HTTP_LITERAL,
      httpEmpty: HTTP_EMPTY,
      mcpType: MCP_TYPE,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      posts: SAMPLE_POSTS,
      bisect: SAMPLE_BISECT,
      stations: PLAIN_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "${VAR} in a plugin manifest's mcpServers.*.headers should resolve from the CLI process environment on 2.1.260 exactly as it does on 2.1.247 and 2.1.223, and the server should connect",
      ],
      hypothesis:
        "NON-BINDING: plugin HTTP MCP ${VAR} header expansion should resolve from the CLI process environment on 2.1.260 exactly as on 2.1.247 / 2.1.223. Verify against #93595 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
