#!/usr/bin/env node
/**
 * Counterfoil — cheque-counter / ticket-stub / banker's counterfoil booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * `claude mcp add-json <name> '<json>' --client-secret` for an HTTP MCP
 * server whose JSON has a non-empty `headers` field stores the OAuth
 * client secret under a credential-store key computed WITHOUT the
 * headers, while `claude mcp login <name>` looks the secret up under a
 * key computed WITH the headers. Lookup misses → token exchange goes
 * out with no `client_secret` → auth server rejects (GitHub remote MCP:
 * "The client_id and/or client_secret passed are incorrect."). Same
 * defect as closed-stale #67528; still present in 2.1.267.
 *
 *   node counterfoil.mjs data/counterfoil.json
 *   echo '{"seed":"skewed"}' | node counterfoil.mjs
 *
 * Idle word is matched (HOLD: store + login use same keyFor with full
 * config incl. headers).
 * Seeded word is skewed (#93446: headers-stripped store vs
 * headers-included lookup).
 * Path word is headers-hash.
 * Product score word is counterfoil (score counterfoil or admit matched).
 *
 * Encoded from anthropics/claude-code#93446 issue body only.
 * Hypothesis (NON-BINDING): add-json persists the full config then
 * calls saveMcpClientSecret with a rebuilt {type,url} that drops
 * headers, while login hashes the full stored config, so keyFor
 * diverges. Verify against #93446 text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement
 * a fix. No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "matched",
  "skewed",
  "counterfoil",
  "headers-hash",
  "hold",
  "add-json",
  "client-secret",
  "keyFor",
  "headers-stripped",
  "headers-included",
  "token-exchange",
  "no-secret",
  "github-mcp",
  "stale-67528",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "matched";
export const PATH_WORD = "headers-hash";
export const SEEDED_WORD = "skewed";
export const PRODUCT_WORD = "counterfoil";
export const HOLD = Object.freeze(["matched", "hold"]);
export const RECOVER = Object.freeze(["matched", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "traced",
  "pathless",
  "image-cache",
  "lucida",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "slipped",
  "sprung",
  "springe",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
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
  "oubliette",
  "voided",
  "ephemera",
  "commutator",
  "heddle",
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
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "flushed",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "diopter",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "skewed" && name !== "counterfoil",
  ),
);

export const FEATURED_ISSUE = 93446;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93446";
export const TITLE =
  "[BUG] `mcp add-json --client-secret` stores secret under headers-stripped key, login looks up headers-included key (#67528 closed as stale, still present in 2.1.267)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:auth",
  "area:mcp",
]);
export const AUTHOR = "medley56";
export const FILED = "2026-09-10T18:54:06Z";
export const CLAUDE_CODE_VERSION = "2.1.197";
export const CONFIRMED_BINARY = "2.1.267";
export const STALE_COUSIN = 67528;
export const STALE_VERSION = "2.1.173";
export const STALE_CLOSED = "2026-07-22";
export const OS = "Ubuntu/Debian Linux";
export const IMAGE = "python:3.13-slim";
export const SHELL = "zsh";
export const TERMINAL = "VS Code integrated terminal";
export const ENV = "VS Code devcontainer";
export const CREDENTIAL_STORE = "$CLAUDE_CONFIG_DIR/.credentials.json";
export const SERVER_NAME = "github";
export const GITHUB_MCP_URL = "https://api.githubcopilot.com/mcp/";
export const HEADER_NAME = "X-MCP-Toolsets";
export const HEADER_VALUE = "default,actions";
export const TOOLSETS_HEADER = Object.freeze({
  "X-MCP-Toolsets": "default,actions",
});
export const STORE_KEY_PUBLISHED = "github|1eea5f274543f247";
export const LOOKUP_KEY_PUBLISHED = "github|01759ec9120e7ef8";
export const STORE_PAYLOAD =
  '{"type":"http","url":"https://api.githubcopilot.com/mcp/","headers":{}}';
export const LOOKUP_PAYLOAD =
  '{"type":"http","url":"https://api.githubcopilot.com/mcp/","headers":{"X-MCP-Toolsets":"default,actions"}}';
export const REJECT =
  "The client_id and/or client_secret passed are incorrect.";
export const MCP_ADD_UNAFFECTED = true;
export const PHRASE =
  "when add-json --client-secret stores the secret under a headers-stripped keyFor while mcp login looks it up under a headers-included key, score counterfoil or admit matched.";

export const BENCH_STATIONS = Object.freeze([
  {
    id: "stub",
    survey: "read the counterfoil stub",
    kind: "store",
    note: "add-json persists full config then stores secret on rebuilt {type,url}",
  },
  {
    id: "grille",
    survey: "look through the brass grille",
    kind: "lookup",
    note: "mcp login hashes the full stored config including headers",
  },
  {
    id: "stamp",
    survey: "ink the dating stamp",
    kind: "keys",
    note: "store github|1eea5f274543f247 vs login github|01759ec9120e7ef8",
  },
  {
    id: "blotter",
    survey: "audit the ledger blotter",
    kind: "exchange",
    note: "lookup miss → token exchange with no client_secret → GitHub reject",
  },
]);

export const KEY_TABLE = Object.freeze([
  {
    where: "mcpOAuthClientConfig (secret stored by add-json)",
    key: STORE_KEY_PUBLISHED,
    hashed: STORE_PAYLOAD,
    headers: "stripped",
  },
  {
    where: "mcpOAuth (session created by mcp login)",
    key: LOOKUP_KEY_PUBLISHED,
    hashed: LOOKUP_PAYLOAD,
    headers: "included",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "add-json",
  "client-secret",
  "keyFor",
  "headers-stripped",
  "headers-included",
  "token-exchange",
  "no-secret",
  "github-mcp",
]);

export const COUSINS = Object.freeze([
  {
    issue: 67528,
    title:
      "MCP OAuth --client-secret stored under wrong keychain key when HTTP server has custom headers — token exchange sent without secret",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed stale, same defect; do not rebuild",
  },
  {
    issue: 89969,
    title:
      "Plugin MCP servers: ${user_config.*} is not substituted inside the oauth block, and the unsubstituted clientId gets cached in the keychain",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby MCP OAuth key / keychain; do not rebuild",
  },
  {
    issue: 84839,
    title:
      'Kaggle MCP OAuth fails at token exchange: "client_secret_basic authentication requires a client_secret"',
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby MCP OAuth token-exchange secret miss; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93458,
    title: "SessionStart hook additionalContext silently dropped when source=fork",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 92264,
    title: "Idle background session stops advancing while async subagents are in flight",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 86531,
    title: "/rename renames other concurrent sessions (cross-session title contamination)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93403,
    title: "nested skills never load in auto mode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93445,
    title: "/branch RC reconnection record",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93405,
    title: "autoMode trusted-repo path pinned user-global",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93402,
    title: "Cmd+Enter interrupts instead of queues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93426,
    title: "host writes .in_use/.orphaned_at into pinned plugin tree",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "scapegoat",
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "diopter",
  "ward",
  "latchkey",
  "bitting",
  "escutcheon",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
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
  "flashpan",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "mirage",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
]);

export function keyPayload(cfg = {}) {
  return JSON.stringify({
    type: cfg.type || "http",
    url: cfg.url || GITHUB_MCP_URL,
    headers: cfg.headers && Object.keys(cfg.headers).length ? cfg.headers : {},
  });
}

/**
 * Educational keyFor from the published #93446 shape.
 * Uses the issue's published GitHub hashes when the payload matches;
 * otherwise a booth-local suffix. Not a live credential hash. Not a fix.
 */
export function keyFor(serverName, cfg = {}) {
  const name = serverName || SERVER_NAME;
  const payload = keyPayload(cfg);
  if (payload === STORE_PAYLOAD) return STORE_KEY_PUBLISHED;
  if (payload === LOOKUP_PAYLOAD) return LOOKUP_KEY_PUBLISHED;
  const empty =
    !cfg.headers ||
    (typeof cfg.headers === "object" && Object.keys(cfg.headers).length === 0);
  return `${name}|${empty ? "stripped" : "included"}`;
}

export function inspectStore(input = {}) {
  const stripped =
    input.headersStripped === true ||
    input.storeStripped === true ||
    input.addJson === true ||
    (input.storeHeaders === false && input.matched !== true);
  const full =
    input.storeFull === true ||
    input.storeHeaders === true ||
    input.mcpAdd === true;
  return {
    stripped: stripped && input.matched !== true && !full,
    full: full && !stripped,
    key: stripped && input.matched !== true && !full
      ? STORE_KEY_PUBLISHED
      : LOOKUP_KEY_PUBLISHED,
    stamp: stripped && input.matched !== true && !full ? "skewed" : "matched",
  };
}

export function inspectLookup(input = {}) {
  const included =
    input.headersIncluded === true ||
    input.lookupIncluded === true ||
    input.loginFull === true ||
    input.lookupHeaders !== false;
  const miss =
    input.lookupMiss === true ||
    input.noSecret === true ||
    (input.headersStripped === true && included && input.matched !== true);
  return {
    included: included && input.matched !== true,
    miss: miss && input.matched !== true,
    key: included ? LOOKUP_KEY_PUBLISHED : STORE_KEY_PUBLISHED,
    stamp: miss && input.matched !== true ? "skewed" : "matched",
  };
}

export function inspectKeys(input = {}) {
  const storeCfg = input.storeCfg || {
    type: "http",
    url: input.url || GITHUB_MCP_URL,
    headers:
      input.storeHeaders === true || input.matched === true
        ? { ...(input.headers || TOOLSETS_HEADER) }
        : {},
  };
  const lookupCfg = input.lookupCfg || {
    type: "http",
    url: input.url || GITHUB_MCP_URL,
    headers:
      input.lookupHeaders === false
        ? {}
        : { ...(input.headers || TOOLSETS_HEADER) },
  };
  const storeKey = keyFor(input.serverName || SERVER_NAME, storeCfg);
  const lookupKey = keyFor(input.serverName || SERVER_NAME, lookupCfg);
  const same = storeKey === lookupKey;
  const skewed = !same && input.matched !== true;
  return {
    storeKey,
    lookupKey,
    storePayload: keyPayload(storeCfg),
    lookupPayload: keyPayload(lookupCfg),
    same,
    skewed,
    stamp: skewed ? "skewed" : "matched",
  };
}

export function readBench(input = {}) {
  const store = inspectStore(input);
  const lookup = inspectLookup(input);
  const keys = inspectKeys(input);
  const skewed =
    store.stamp === "skewed" ||
    lookup.stamp === "skewed" ||
    keys.stamp === "skewed" ||
    input.skewed === true;
  const matched =
    input.matched === true &&
    skewed !== true &&
    store.stamp === "matched";
  return {
    store,
    lookup,
    keys,
    stations: BENCH_STATIONS,
    skewed: skewed && !matched,
    matched:
      matched ||
      (store.stamp === "matched" &&
        lookup.stamp === "matched" &&
        keys.stamp === "matched" &&
        input.skewed !== true),
    mark: skewed && !matched ? "skewed" : "matched",
  };
}

/**
 * Published counterfoil walk from #93446 only. Facts from the issue body.
 * A matched booth stores and looks up under the same keyFor with the
 * full config including headers. A skewed booth stores on a rebuilt
 * {type,url} that drops headers, then login hashes the full config.
 */
export const COUNTERFOIL_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-matched",
    matched: true,
    storeHeaders: true,
    lookupHeaders: true,
    headersStripped: false,
    skewed: false,
    cue: "matched",
    note: "idle HOLD: store + login use same keyFor with full config incl. headers",
  },
  {
    t: "add",
    event: "add-json-persist",
    addJson: true,
    persistFull: true,
    matched: true,
    cue: "matched",
    note: "add-json persists the full config (incl. headers) to .claude.json",
  },
  {
    t: "store",
    event: "save-secret-stripped",
    addJson: true,
    headersStripped: true,
    storeStripped: true,
    storeHeaders: false,
    skewed: true,
    cue: "skewed",
    note: "saveMcpClientSecret rebuilt {type,url} dropping headers → key hashed with headers:{}",
  },
  {
    t: "key",
    event: "store-key",
    headersStripped: true,
    storeKey: STORE_KEY_PUBLISHED,
    storePayload: STORE_PAYLOAD,
    skewed: true,
    cue: "skewed",
    note: "mcpOAuthClientConfig github|1eea5f274543f247 hashed with empty headers",
  },
  {
    t: "login",
    event: "mcp-login",
    login: true,
    loginFull: true,
    headersIncluded: true,
    lookupHeaders: true,
    skewed: true,
    cue: "skewed",
    note: "claude mcp login github looks the secret up under keyFor with the full stored config",
  },
  {
    t: "lookup",
    event: "lookup-key",
    headersIncluded: true,
    lookupKey: LOOKUP_KEY_PUBLISHED,
    lookupPayload: LOOKUP_PAYLOAD,
    skewed: true,
    cue: "skewed",
    note: "mcpOAuth github|01759ec9120e7ef8 hashed with X-MCP-Toolsets",
  },
  {
    t: "miss",
    event: "lookup-miss",
    lookupMiss: true,
    skewed: true,
    cue: "skewed",
    note: "store key ≠ login key; secret not found",
  },
  {
    t: "exchange",
    event: "token-exchange",
    tokenExchange: true,
    noSecret: true,
    skewed: true,
    cue: "skewed",
    note: "token exchange goes out with no client_secret",
  },
  {
    t: "reject",
    event: "github-reject",
    githubMcp: true,
    reject: REJECT,
    skewed: true,
    cue: "skewed",
    note: 'GitHub remote MCP: "The client_id and/or client_secret passed are incorrect."',
  },
  {
    t: "stain",
    event: "skewed",
    matched: false,
    skewed: true,
    addJson: true,
    headersStripped: true,
    headersIncluded: true,
    lookupMiss: true,
    noSecret: true,
    tokenExchange: true,
    githubMcp: true,
    cue: "skewed",
    note: "#93446: headers-stripped store vs headers-included lookup",
  },
  {
    t: "path",
    event: "headers-hash",
    skewed: true,
    headersHash: true,
    headersStripped: true,
    cue: "skewed",
    note: "headers-hash — keyFor hashes {type,url,headers}; add-json drops headers on store",
  },
  {
    t: "score",
    event: "counterfoil",
    skewed: true,
    headersHash: true,
    cue: "skewed",
    note: "counterfoil — score the stub filed under a different serial than the cheque presented at the grille",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    matched: true,
    storeHeaders: true,
    lookupHeaders: true,
    headersStripped: false,
    skewed: false,
    cue: "matched",
  };
}

export function seedMatched() {
  return { ...emptyTicket() };
}

export function seedSkewed() {
  return {
    seed: SEEDED_WORD,
    matched: false,
    skewed: true,
    addJson: true,
    headersStripped: true,
    storeStripped: true,
    storeHeaders: false,
    headersIncluded: true,
    lookupIncluded: true,
    lookupHeaders: true,
    loginFull: true,
    lookupMiss: true,
    noSecret: true,
    tokenExchange: true,
    githubMcp: true,
    storeKey: STORE_KEY_PUBLISHED,
    lookupKey: LOOKUP_KEY_PUBLISHED,
    reject: REJECT,
    cue: "skewed",
    issue: FEATURED_ISSUE,
  };
}

export function seedCounterfoil() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    skewed: true,
    headersHash: true,
    cue: "skewed",
  };
}

export function seedHeadersHash() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    skewed: true,
    headersHash: true,
    headersStripped: true,
    cue: "skewed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedAddJson() {
  return {
    seed: "add-json",
    preferSeed: true,
    addJson: true,
    cue: "skewed",
  };
}

export function seedClientSecret() {
  return {
    seed: "client-secret",
    preferSeed: true,
    clientSecret: true,
    cue: "skewed",
  };
}

export function seedKeyFor() {
  return {
    seed: "keyFor",
    preferSeed: true,
    keyFor: true,
    cue: "skewed",
  };
}

export function seedHeadersStripped() {
  return {
    seed: "headers-stripped",
    preferSeed: true,
    headersStripped: true,
    cue: "skewed",
  };
}

export function seedHeadersIncluded() {
  return {
    seed: "headers-included",
    preferSeed: true,
    headersIncluded: true,
    cue: "skewed",
  };
}

export function seedTokenExchange() {
  return {
    seed: "token-exchange",
    preferSeed: true,
    tokenExchange: true,
    cue: "skewed",
  };
}

export function seedNoSecret() {
  return {
    seed: "no-secret",
    preferSeed: true,
    noSecret: true,
    cue: "skewed",
  };
}

export function seedGithubMcp() {
  return {
    seed: "github-mcp",
    preferSeed: true,
    githubMcp: true,
    cue: "skewed",
  };
}

export function seedStale67528() {
  return {
    seed: "stale-67528",
    preferSeed: true,
    stale: true,
    cue: "skewed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      matched: false,
      skewed: false,
      headersHash: false,
      addJson: false,
      mcpAdd: false,
      persistFull: false,
      headersStripped: false,
      storeStripped: false,
      storeHeaders: false,
      headersIncluded: false,
      lookupIncluded: false,
      lookupHeaders: true,
      loginFull: false,
      lookupMiss: false,
      noSecret: false,
      tokenExchange: false,
      githubMcp: false,
      clientSecret: false,
      keyFor: false,
      login: false,
      stale: false,
      storeKey: null,
      lookupKey: null,
      storePayload: null,
      lookupPayload: null,
      reject: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    matched: raw.matched === true,
    skewed: raw.skewed === true,
    headersHash: raw.headersHash === true || raw.event === "headers-hash",
    addJson: raw.addJson === true,
    mcpAdd: raw.mcpAdd === true,
    persistFull: raw.persistFull === true,
    headersStripped:
      raw.headersStripped === true || raw.storeStripped === true,
    storeStripped: raw.storeStripped === true,
    storeHeaders: raw.storeHeaders === true,
    headersIncluded:
      raw.headersIncluded === true || raw.lookupIncluded === true,
    lookupIncluded: raw.lookupIncluded === true,
    lookupHeaders: raw.lookupHeaders !== false,
    loginFull: raw.loginFull === true,
    lookupMiss: raw.lookupMiss === true,
    noSecret: raw.noSecret === true,
    tokenExchange: raw.tokenExchange === true,
    githubMcp: raw.githubMcp === true,
    clientSecret: raw.clientSecret === true,
    keyFor: raw.keyFor === true,
    login: raw.login === true,
    stale: raw.stale === true,
    storeKey: raw.storeKey == null ? null : raw.storeKey,
    lookupKey: raw.lookupKey == null ? null : raw.lookupKey,
    storePayload: raw.storePayload == null ? null : raw.storePayload,
    lookupPayload: raw.lookupPayload == null ? null : raw.lookupPayload,
    reject: raw.reject == null ? null : raw.reject,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.matched != null ||
        ticket.skewed != null ||
        ticket.headersHash != null ||
        ticket.addJson != null ||
        ticket.headersStripped != null ||
        ticket.headersIncluded != null ||
        ticket.lookupMiss != null ||
        ticket.noSecret != null ||
        ticket.tokenExchange != null ||
        ticket.githubMcp != null ||
        ticket.storeHeaders != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isMatched(row) {
  if (row.skewed && row.cue !== "matched") return false;
  if (
    row.cue === "skewed" ||
    row.cue === "counterfoil" ||
    row.cue === "headers-hash"
  ) {
    return false;
  }
  if (row.headersStripped && row.cue !== "matched") return false;
  if (row.lookupMiss && row.cue !== "matched") return false;
  if (row.noSecret && row.cue !== "matched") return false;
  if (
    row.matched === true &&
    row.skewed !== true &&
    row.cue !== "skewed"
  ) {
    return true;
  }
  if (
    row.cue === "matched" &&
    row.skewed !== true &&
    row.headersStripped !== true &&
    row.lookupMiss !== true &&
    row.noSecret !== true
  ) {
    return true;
  }
  if (
    row.storeHeaders === true &&
    row.skewed !== true &&
    row.headersStripped !== true
  ) {
    return true;
  }
  return false;
}

function isSkewed(row) {
  if (isMatched(row)) return false;
  if (row.cue === "skewed" || row.cue === "counterfoil") return true;
  if (row.skewed === true) return true;
  if (
    row.headersStripped === true ||
    row.lookupMiss === true ||
    row.noSecret === true ||
    (row.storeKey &&
      row.lookupKey &&
      row.storeKey !== row.lookupKey)
  ) {
    return true;
  }
  if (
    row.addJson &&
    (row.headersIncluded || row.tokenExchange) &&
    row.storeHeaders !== true
  ) {
    return true;
  }
  return false;
}

function isHeadersHashPath(row) {
  return (
    row.event === "headers-hash" &&
    !isMatched(row) &&
    (row.skewed === true ||
      row.headersHash === true ||
      row.headersStripped === true)
  );
}

/**
 * Score one blotter pass against the counterfoil booth.
 * matched: store + login use same keyFor with full config incl. headers.
 * skewed: headers-stripped store vs headers-included lookup.
 * headers-hash: named path — keyFor hashes {type,url,headers}.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHeadersHashPath(row) ||
    (row.headersHash && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "headers-hash";
  } else if (isSkewed(row)) {
    verdict = "skewed";
  } else if (isMatched(row)) {
    verdict = "matched";
  } else if (
    row.headersStripped ||
    row.lookupMiss ||
    row.noSecret ||
    row.tokenExchange ||
    row.addJson ||
    row.headersIncluded ||
    row.githubMcp
  ) {
    verdict = "skewed";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const store = inspectStore(row);
  const lookup = inspectLookup(row);
  const keys = inspectKeys({
    ...row,
    matched: verdict === "matched" || verdict === "hold",
    storeHeaders: row.storeHeaders,
    lookupHeaders: row.lookupHeaders,
    headers: ticket.headers || TOOLSETS_HEADER,
    storeCfg: ticket.storeCfg,
    lookupCfg: ticket.lookupCfg,
    serverName: ticket.serverName,
  });
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    matched: verdict === "matched" || verdict === "hold",
    skewed:
      verdict === "skewed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    headersHash:
      row.headersHash === true ||
      verdict === "headers-hash" ||
      verdict === PATH_WORD,
    addJson: row.addJson,
    mcpAdd: row.mcpAdd,
    persistFull: row.persistFull,
    headersStripped: row.headersStripped,
    storeStripped: row.storeStripped,
    storeHeaders: row.storeHeaders,
    headersIncluded: row.headersIncluded,
    lookupIncluded: row.lookupIncluded,
    lookupHeaders: row.lookupHeaders,
    loginFull: row.loginFull,
    lookupMiss: row.lookupMiss,
    noSecret: row.noSecret,
    tokenExchange: row.tokenExchange,
    githubMcp: row.githubMcp,
    clientSecret: row.clientSecret,
    keyFor: row.keyFor,
    login: row.login,
    stale: row.stale,
    storeKey: row.storeKey || keys.storeKey,
    lookupKey: row.lookupKey || keys.lookupKey,
    storePayload: row.storePayload || keys.storePayload,
    lookupPayload: row.lookupPayload || keys.lookupPayload,
    reject: row.reject,
    cue: hold ? "matched" : "skewed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit matched" : "score counterfoil",
    store,
    lookup,
    keys,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : COUNTERFOIL_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const skewed = scored.filter((row) => row.verdict === "skewed");
  const path = scored.filter((row) => row.verdict === "headers-hash");
  const matched = scored.filter((row) => row.verdict === "matched");
  const headline =
    scored.find((row) => row.event === "skewed") ||
    scored.find((row) => row.event === "lookup-miss") ||
    scored.find((row) => row.event === "headers-hash") ||
    skewed[skewed.length - 1];
  let verdict = "matched";
  if (skewed.length) verdict = "skewed";
  else if (path.length && !matched.length) verdict = "headers-hash";
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
    skewedCount: skewed.length,
    pathCount: path.length,
    matchedCount: matched.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit matched" : "score counterfoil",
    note: headline
      ? "Claude Code 2.1.197 reproduced; 2.1.267 linux-x64 binary confirmed unchanged; add-json headers-stripped store vs login headers-included lookup; GitHub reject no client_secret."
      : "published counterfoil walk scored against matched vs skewed",
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
    seeded !== "matched" &&
    seeded !== "skewed" &&
    seeded !== "headers-hash" &&
    seeded !== "counterfoil" &&
    ticket.matched == null &&
    ticket.skewed == null &&
    ticket.headersHash == null &&
    ticket.headersStripped == null &&
    ticket.lookupMiss == null &&
    ticket.noSecret == null &&
    ticket.addJson == null &&
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
    matched: scored.matched ?? false,
    skewed: scored.skewed ?? false,
    headersHash: scored.headersHash ?? false,
    addJson: scored.addJson ?? false,
    headersStripped: scored.headersStripped ?? false,
    headersIncluded: scored.headersIncluded ?? false,
    lookupMiss: scored.lookupMiss ?? false,
    noSecret: scored.noSecret ?? false,
    tokenExchange: scored.tokenExchange ?? false,
    githubMcp: scored.githubMcp ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.headersStripped ? "store=stripped" : "store=full",
    result.headersIncluded || result.lookupHeaders !== false
      ? "lookup=included"
      : "lookup=stripped",
    result.lookupMiss ? "lookup=miss" : "lookup=hit",
    result.noSecret ? "secret=absent" : "secret=present",
    result.cue === "matched" ? "cue=matched" : "cue=skewed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const bench = readBench({
    matched: result.matched,
    skewed: result.skewed,
    headersStripped: result.headersStripped,
    storeStripped: result.storeStripped,
    storeHeaders: result.storeHeaders,
    addJson: result.addJson,
    mcpAdd: result.mcpAdd,
    headersIncluded: result.headersIncluded,
    lookupIncluded: result.lookupIncluded,
    lookupHeaders: result.lookupHeaders,
    loginFull: result.loginFull,
    lookupMiss: result.lookupMiss,
    noSecret: result.noSecret,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    bench,
    store: inspectStore({
      headersStripped: result.headersStripped,
      storeStripped: result.storeStripped,
      storeHeaders: result.storeHeaders,
      addJson: result.addJson,
      mcpAdd: result.mcpAdd,
      matched: result.matched,
    }),
    lookup: inspectLookup({
      headersIncluded: result.headersIncluded,
      lookupIncluded: result.lookupIncluded,
      loginFull: result.loginFull,
      lookupMiss: result.lookupMiss,
      noSecret: result.noSecret,
      headersStripped: result.headersStripped,
      matched: result.matched,
    }),
    keys: inspectKeys({
      matched: result.matched,
      storeHeaders: result.storeHeaders,
      lookupHeaders: result.lookupHeaders,
      headersStripped: result.headersStripped,
    }),
    stations: BENCH_STATIONS.map((row) => ({
      ...row,
      skewed: result.skewed === true || result.verdict === "skewed",
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
      confirmedBinary: CONFIRMED_BINARY,
      staleCousin: STALE_COUSIN,
      staleVersion: STALE_VERSION,
      staleClosed: STALE_CLOSED,
      os: OS,
      image: IMAGE,
      shell: SHELL,
      terminal: TERMINAL,
      env: ENV,
      credentialStore: CREDENTIAL_STORE,
      serverName: SERVER_NAME,
      githubMcpUrl: GITHUB_MCP_URL,
      headerName: HEADER_NAME,
      headerValue: HEADER_VALUE,
      storeKey: STORE_KEY_PUBLISHED,
      lookupKey: LOOKUP_KEY_PUBLISHED,
      storePayload: STORE_PAYLOAD,
      lookupPayload: LOOKUP_PAYLOAD,
      reject: REJECT,
      mcpAddUnaffected: MCP_ADD_UNAFFECTED,
      keyTable: KEY_TABLE,
      stations: BENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "add-json should pass the same config object it persists to the secret-store function (as claude mcp add already does)",
        "store key and login-time lookup key match",
        "the secret is included in the token exchange",
      ],
      hypothesis:
        "NON-BINDING: add-json persists the full config then calls saveMcpClientSecret with a rebuilt {type,url} that drops headers, while login hashes the full stored config, so keyFor diverges. Verify against #93446 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
