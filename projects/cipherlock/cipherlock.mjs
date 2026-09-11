#!/usr/bin/env node
/**
 * Cipherlock — vault / bank-safe / cipher-lock booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On macOS, MCP OAuth entries in the shared Keychain item
 * `Claude Code-credentials` get rewritten with empty
 * accessToken/refreshToken (and no clientId) while the refresh
 * tokens are still valid, when several `claude` processes touch
 * the store concurrently. The user must re-run /mcp and re-auth
 * every server on every new session.
 *
 *   node cipherlock.mjs data/blanked.json
 *   echo '{"seed":"blanked"}' | node cipherlock.mjs
 *
 * Idle word is sealed (HOLD: honest path — tokens held).
 * Seeded word is blanked (#93537 concurrent wipe).
 * Path word is concurrent-write.
 * Product score word is cipherlock (score cipherlock or admit
 * sealed).
 *
 * Encoded from anthropics/claude-code#93537 issue text only.
 * Hypothesis (NON-BINDING): concurrent Keychain read-modify-write
 * without re-read-before-write / per-entry merge lets one process
 * overwrite another's rotated tokens with empty stubs. Verify
 * against #93537 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "hold",
  "healthy-refresh",
  "concurrent-sessions",
  "mcp-list",
  "killed-mid-run",
  "auth-cache",
  "stub-blob",
  "keychain-rewrite",
  "empty-tokens",
  "slack-intact",
  "no-client-id",
  "needs-auth",
  "re-read-before-write",
  "per-entry-merge",
  "tokens-held",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "sealed";
export const PATH_WORD = "concurrent-write";
export const SEEDED_WORD = "blanked";
export const PRODUCT_WORD = "cipherlock";
export const HOLD = Object.freeze(["sealed", "hold"]);
export const RECOVER = Object.freeze(["sealed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "lodged",
  "dropped",
  "forksink",
  "source-fork",
  "kindled",
  "painted",
  "foxfire",
  "never-turns",
  "flushed",
  "lagged",
  "one-behind",
  "pentimento",
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "vinculum",
  "hit",
  "flattened",
  "string-carrier",
  "cachet",
  "steady",
  "strobing",
  "off-label",
  "strobe",
  "matched",
  "skewed",
  "headers-hash",
  "counterfoil",
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
  "mismatched",
  "issuer",
  "paraph",
  "sterling",
  "debased",
  "hallmark",
  "remanent",
  "collimated",
  "diopter",
  "hysteresis",
  "banked",
  "ephemera",
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
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "culled",
  "intact",
  "procrustes",
  "drained",
  "gated",
  "sump",
  "spillway",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "blanked" && name !== "cipherlock",
  ),
);

export const FEATURED_ISSUE = 93537;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93537";
export const TITLE =
  "macOS: concurrent claude processes zero MCP OAuth entries in shared Keychain blob despite valid refresh tokens";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:auth",
  "area:mcp",
]);
export const AUTHOR = "DABH";
export const FILED = "2026-09-11T04:52:54Z";
export const CLAUDE_CODE_VERSION = "2.1.268";
export const OS = "macOS 26 (Darwin 25.6.0)";
export const CLIENT = "native install";
export const DISTRIBUTION =
  "Claude Code 2.1.268 native install; macOS 26 Darwin 25.6.0; shared Keychain item Claude Code-credentials";
export const SESSION_KIND =
  "macOS Keychain MCP-only; 7 concurrent claude processes; claude mcp list from another shell (one killed mid-run); notion/atlassian blanked, Slack intact";
export const KEYCHAIN_ITEM = "Claude Code-credentials";
export const SERVERS = Object.freeze([
  "atlassian (user scope)",
  "notion (user scope)",
  "plugin:slack:slack",
]);
export const PROCESS_COUNT = 7;
export const PROCESS_VERSIONS =
  "2.1.206 (x3, month-old sessions), 2.1.263, 2.1.267, 2.1.268 (x2)";
export const HEALTHY_REFRESH_AT = "04:29:47";
export const AUTH_CACHE_AT = "04:32:14 and 04:39:19";
export const KILL_AFTER = "~75s";
export const KEYCHAIN_REWRITE_AT = "04:42:16";
export const REAUTH_COUNT = 33;
export const DISTINCT_FROM = 91009;
export const FALLBACK_STORE = "~/.claude/.credentials.json";
export const AUTH_CACHE_FILE = "~/.claude/mcp-needs-auth-cache.json";
export const PHRASE =
  "when concurrent claude processes rewrite Claude Code-credentials MCP OAuth entries with empty accessToken/refreshToken and no clientId while refresh tokens are still valid, score cipherlock or admit sealed.";

export const VAULT_STATIONS = Object.freeze([
  {
    id: "door",
    survey: "read the steel door (shared Keychain item)",
    kind: "door",
    note: "seeded: Claude Code-credentials holds mcpOAuth for notion, atlassian, Slack",
  },
  {
    id: "dial",
    survey: "spin the brass dial (concurrent claude processes)",
    kind: "dial",
    note: "seeded: 7 concurrent claude processes across mixed versions touch the store",
  },
  {
    id: "slot",
    survey: "slide the keycard (claude mcp list from another shell)",
    kind: "slot",
    note: "seeded: non-interactive claude mcp list runs; one killed after ~75s",
  },
  {
    id: "box",
    survey: "open the vault box (token fields)",
    kind: "box",
    note: "seeded: notion and atlassian empty accessToken/refreshToken and no clientId; Slack intact",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "concurrent-write",
  "blanked",
  "empty-tokens",
  "no-client-id",
  "keychain-rewrite",
  "killed-mid-run",
  "slack-intact",
  "needs-auth",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91009,
    title:
      "Windows file-store / claudeAiOauth refresh-rotation race across concurrent sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Windows file store, claudeAiOauth login; distinct from this macOS Keychain MCP-only wipe; do not rebuild",
  },
  {
    issue: 91199,
    title:
      "MCP OAuth --client-secret / oauth.clientSecret silently discarded",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — confidential-client secret dropped; same Keychain item, different defect; do not rebuild",
  },
  {
    issue: 92839,
    title:
      "macOS Keychain argv fallback for oversized OAuth payload fails silently (pbt)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — oversized payload persistence; do not rebuild",
  },
  {
    issue: 89969,
    title:
      "${user_config.*} not substituted inside oauth block; unsubstituted clientId cached in Keychain",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — plugin oauth placeholder cache; do not rebuild",
  },
  {
    issue: 90647,
    title:
      "Claude account logout/switch discards all MCP OAuth grants stored inside the account credential",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — logout blast radius; do not rebuild",
  },
  {
    issue: 91158,
    title:
      "plaintext refresh token plus unbounded Keychain item accumulation",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — hygiene / plaintext store; do not rebuild",
  },
  {
    issue: 92149,
    title:
      "oauth_scope_insufficient surfaced as Claude.ai login rejected; orphaned Keychain services",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — scope error + orphan services; do not rebuild",
  },
  {
    issue: 87405,
    title:
      "tokenless credential stub in .credentials.json blocks Keychain refresh",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — stub blocks refresh; related surface, different trigger; do not rebuild",
  },
  {
    issue: 84274,
    title:
      "MCP OAuth access token never persisted; server reverts after restart",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — persist-never; do not rebuild",
  },
  {
    issue: 84275,
    title:
      "Claude Code-credentials-* items created daily and never cleaned up",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — daily item accretion; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93475,
    title: "Effort selector needs a very tall terminal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title: "Binary Read skips PreToolUse",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title: "Worktree cwd bleed",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title: "Directory Plugins duplicate cards",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93495,
    title: "Desktop UNUserNotificationCenter deadlock",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93508,
    title: "Documents preview_start TCC getcwd deny",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93530,
    title: "Esc kills an unrelated background subagent irrecoverably",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93536,
    title:
      "ExitPlanMode consistently returns rejected with inconsistent embedded approval text",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93534,
    title:
      "Desktop Code tab: long unsent prompt disappears during composition",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93532,
    title:
      "Documents-folder permission is lost on every embedded CLI auto-update",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "scapegoat",
  "cartulary",
  "paraph",
  "hallmark",
  "diopter",
  "hysteresis",
  "ephemera",
  "flashpan",
  "mirage",
  "glowplug",
  "deadlight",
  "ukase",
  "almanac",
  "stroboscope",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "espagnolette",
  "trompe",
  "shibboleth",
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
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
  "procrustes",
  "sump",
  "spillway",
  "quietus",
  "rubric",
  "recension",
]);

export function inspectDoor(input = {}) {
  const rewritten =
    input.keychainRewrite === true ||
    input.event === "keychain-rewrite" ||
    (input.blanked === true && input.sealed !== true);
  return {
    rewritten,
    stamp: rewritten ? "rewritten" : "held",
    note: rewritten
      ? "steel door rewritten — Claude Code-credentials mcpOAuth blob overwritten"
      : "steel door held — Keychain item Claude Code-credentials keeps valid tokens",
  };
}

export function inspectDial(input = {}) {
  const concurrent =
    input.concurrentSessions === true ||
    input.event === "concurrent-sessions" ||
    (input.blanked === true && input.sealed !== true);
  return {
    concurrent,
    stamp: concurrent ? "spinning" : "still",
    note: concurrent
      ? "brass dial spinning — 7 concurrent claude processes across mixed versions"
      : "brass dial still — no concurrent writers on the combination",
  };
}

export function inspectSlot(input = {}) {
  const listed =
    input.mcpList === true ||
    input.killedMidRun === true ||
    input.event === "mcp-list" ||
    input.event === "killed-mid-run" ||
    (input.blanked === true && input.sealed !== true);
  return {
    listed,
    stamp: listed ? "swiped" : "parked",
    note: listed
      ? "keycard swiped — claude mcp list from another shell; one killed after ~75s"
      : "keycard parked — no concurrent mcp list swipe",
  };
}

export function inspectBox(input = {}) {
  const empty =
    input.emptyTokens === true ||
    input.noClientId === true ||
    input.event === "empty-tokens" ||
    input.event === "no-client-id" ||
    (input.blanked === true && input.sealed !== true);
  const held =
    input.tokensHeld === true ||
    input.event === "tokens-held" ||
    (input.sealed === true &&
      input.healthyRefresh === true &&
      input.blanked !== true);
  return {
    empty: empty && !held,
    held: held && !empty,
    stamp: empty && !held ? "blanked" : "sealed",
    note:
      empty && !held
        ? "vault box blanked — notion and atlassian empty accessToken/refreshToken and no clientId"
        : "vault box sealed — tokens held; refresh tokens still valid",
  };
}

export function readVault(input = {}) {
  const door = inspectDoor(input);
  const dial = inspectDial(input);
  const slot = inspectSlot(input);
  const box = inspectBox(input);
  const blanked =
    box.stamp === "blanked" ||
    door.stamp === "rewritten" ||
    input.blanked === true;
  const sealed =
    input.sealed === true &&
    blanked !== true &&
    box.stamp === "sealed" &&
    door.stamp === "held";
  return {
    door,
    dial,
    slot,
    box,
    stations: VAULT_STATIONS,
    blanked: blanked && !sealed,
    sealed:
      sealed ||
      (box.stamp === "sealed" &&
        door.stamp === "held" &&
        input.blanked !== true),
    mark: blanked && !sealed ? "blanked" : "sealed",
  };
}

/**
 * Published cipherlock walk from #93537 only. Facts from the issue text.
 * A sealed booth holds valid MCP OAuth tokens in Claude Code-credentials.
 * A blanked booth rewrites notion/atlassian entries with empty tokens
 * after concurrent writers plus claude mcp list (one killed mid-run).
 */
export const CIPHERLOCK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-sealed",
    sealed: true,
    blanked: false,
    tokensHeld: true,
    healthyRefresh: true,
    emptyTokens: false,
    cue: "sealed",
    note: "idle HOLD: honest path — tokens held in Claude Code-credentials",
  },
  {
    t: "refresh",
    event: "healthy-refresh",
    sealed: true,
    tokensHeld: true,
    healthyRefresh: true,
    cue: "sealed",
    note: "04:29:47 Keychain item modified by a healthy refresh; valid access + refresh for all three servers",
  },
  {
    t: "dial",
    event: "concurrent-sessions",
    blanked: true,
    concurrentSessions: true,
    cue: "blanked",
    note: "7 concurrent claude processes: 2.1.206 (x3), 2.1.263, 2.1.267, 2.1.268 (x2)",
  },
  {
    t: "slot",
    event: "mcp-list",
    blanked: true,
    mcpList: true,
    cue: "blanked",
    note: "claude mcp list from a non-interactive shell",
  },
  {
    t: "kill",
    event: "killed-mid-run",
    blanked: true,
    killedMidRun: true,
    mcpList: true,
    cue: "blanked",
    note: "one claude mcp list killed after ~75s",
  },
  {
    t: "cache",
    event: "auth-cache",
    blanked: true,
    authCache: true,
    cue: "blanked",
    note: "04:32:14 and 04:39:19 ~/.claude/mcp-needs-auth-cache.json flags all three servers",
  },
  {
    t: "stub",
    event: "stub-blob",
    blanked: true,
    stubBlob: true,
    cue: "blanked",
    note: "tokenless mcpOAuth stub blob written to fallback ~/.claude/.credentials.json",
  },
  {
    t: "door",
    event: "keychain-rewrite",
    blanked: true,
    keychainRewrite: true,
    cue: "blanked",
    note: "04:42:16 Keychain item rewritten after another claude mcp list",
  },
  {
    t: "box",
    event: "empty-tokens",
    blanked: true,
    emptyTokens: true,
    noClientId: true,
    cue: "blanked",
    note: "notion and atlassian empty accessToken/refreshToken and no clientId",
  },
  {
    t: "slack",
    event: "slack-intact",
    blanked: true,
    slackIntact: true,
    emptyTokens: true,
    cue: "blanked",
    note: "plugin:slack:slack entry intact while the other two report Needs authentication",
  },
  {
    t: "path",
    event: "concurrent-write",
    blanked: true,
    concurrentWrite: true,
    concurrentSessions: true,
    mcpList: true,
    keychainRewrite: true,
    emptyTokens: true,
    cue: "blanked",
    note: "concurrent-write — several processes touch the store; one overwrite zeros valid refresh tokens",
  },
  {
    t: "score",
    event: "cipherlock",
    blanked: true,
    concurrentSessions: true,
    mcpList: true,
    killedMidRun: true,
    authCache: true,
    stubBlob: true,
    keychainRewrite: true,
    emptyTokens: true,
    noClientId: true,
    slackIntact: true,
    needsAuth: true,
    cue: "blanked",
    note: "cipherlock — vault box blanked after concurrent Keychain writers; refresh tokens were still valid",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "held",
    event: "tokens-held",
    sealed: true,
    tokensHeld: true,
    cue: "sealed",
    note: "positive control: entries with a valid refresh token stay held",
  },
  {
    t: "refresh",
    event: "healthy-refresh",
    sealed: true,
    healthyRefresh: true,
    tokensHeld: true,
    cue: "sealed",
    note: "positive control: a healthy refresh keeps access + refresh for all three servers",
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
    blanked: false,
    tokensHeld: true,
    healthyRefresh: true,
    emptyTokens: false,
    cue: "sealed",
  };
}

export function seedSealed() {
  return { ...emptyTicket() };
}

export function seedBlanked() {
  return {
    seed: SEEDED_WORD,
    sealed: false,
    blanked: true,
    concurrentSessions: true,
    mcpList: true,
    killedMidRun: true,
    authCache: true,
    stubBlob: true,
    keychainRewrite: true,
    emptyTokens: true,
    noClientId: true,
    slackIntact: true,
    needsAuth: true,
    concurrentWrite: true,
    cue: "blanked",
    issue: FEATURED_ISSUE,
  };
}

export function seedCipherlock() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    blanked: true,
    concurrentSessions: true,
    mcpList: true,
    killedMidRun: true,
    keychainRewrite: true,
    emptyTokens: true,
    noClientId: true,
    cue: "blanked",
  };
}

export function seedConcurrentWrite() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    blanked: true,
    concurrentWrite: true,
    concurrentSessions: true,
    mcpList: true,
    keychainRewrite: true,
    emptyTokens: true,
    cue: "blanked",
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

export function seedHealthyRefresh() {
  return {
    seed: "healthy-refresh",
    preferSeed: true,
    healthyRefresh: true,
    cue: "sealed",
  };
}

export function seedConcurrentSessions() {
  return {
    seed: "concurrent-sessions",
    preferSeed: true,
    concurrentSessions: true,
    cue: "blanked",
  };
}

export function seedMcpList() {
  return {
    seed: "mcp-list",
    preferSeed: true,
    mcpList: true,
    cue: "blanked",
  };
}

export function seedKilledMidRun() {
  return {
    seed: "killed-mid-run",
    preferSeed: true,
    killedMidRun: true,
    cue: "blanked",
  };
}

export function seedAuthCache() {
  return {
    seed: "auth-cache",
    preferSeed: true,
    authCache: true,
    cue: "blanked",
  };
}

export function seedStubBlob() {
  return {
    seed: "stub-blob",
    preferSeed: true,
    stubBlob: true,
    cue: "blanked",
  };
}

export function seedKeychainRewrite() {
  return {
    seed: "keychain-rewrite",
    preferSeed: true,
    keychainRewrite: true,
    cue: "blanked",
  };
}

export function seedEmptyTokens() {
  return {
    seed: "empty-tokens",
    preferSeed: true,
    emptyTokens: true,
    cue: "blanked",
  };
}

export function seedSlackIntact() {
  return {
    seed: "slack-intact",
    preferSeed: true,
    slackIntact: true,
    cue: "blanked",
  };
}

export function seedNoClientId() {
  return {
    seed: "no-client-id",
    preferSeed: true,
    noClientId: true,
    cue: "blanked",
  };
}

export function seedNeedsAuth() {
  return {
    seed: "needs-auth",
    preferSeed: true,
    needsAuth: true,
    cue: "blanked",
  };
}

export function seedReReadBeforeWrite() {
  return {
    seed: "re-read-before-write",
    preferSeed: true,
    reReadBeforeWrite: true,
    cue: "blanked",
  };
}

export function seedPerEntryMerge() {
  return {
    seed: "per-entry-merge",
    preferSeed: true,
    perEntryMerge: true,
    cue: "blanked",
  };
}

export function seedTokensHeld() {
  return {
    seed: "tokens-held",
    preferSeed: true,
    tokensHeld: true,
    cue: "sealed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sealed: false,
      blanked: false,
      tokensHeld: false,
      healthyRefresh: false,
      concurrentSessions: false,
      mcpList: false,
      killedMidRun: false,
      authCache: false,
      stubBlob: false,
      keychainRewrite: false,
      emptyTokens: false,
      noClientId: false,
      slackIntact: false,
      needsAuth: false,
      concurrentWrite: false,
      reReadBeforeWrite: false,
      perEntryMerge: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sealed: raw.sealed === true,
    blanked: raw.blanked === true,
    tokensHeld: raw.tokensHeld === true || raw.event === "tokens-held",
    healthyRefresh:
      raw.healthyRefresh === true || raw.event === "healthy-refresh",
    concurrentSessions:
      raw.concurrentSessions === true ||
      raw.event === "concurrent-sessions",
    mcpList: raw.mcpList === true || raw.event === "mcp-list",
    killedMidRun:
      raw.killedMidRun === true || raw.event === "killed-mid-run",
    authCache: raw.authCache === true || raw.event === "auth-cache",
    stubBlob: raw.stubBlob === true || raw.event === "stub-blob",
    keychainRewrite:
      raw.keychainRewrite === true || raw.event === "keychain-rewrite",
    emptyTokens:
      raw.emptyTokens === true || raw.event === "empty-tokens",
    noClientId: raw.noClientId === true || raw.event === "no-client-id",
    slackIntact:
      raw.slackIntact === true || raw.event === "slack-intact",
    needsAuth: raw.needsAuth === true || raw.event === "needs-auth",
    concurrentWrite:
      raw.concurrentWrite === true || raw.event === "concurrent-write",
    reReadBeforeWrite:
      raw.reReadBeforeWrite === true ||
      raw.event === "re-read-before-write",
    perEntryMerge:
      raw.perEntryMerge === true || raw.event === "per-entry-merge",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.sealed != null ||
        ticket.blanked != null ||
        ticket.tokensHeld != null ||
        ticket.healthyRefresh != null ||
        ticket.concurrentSessions != null ||
        ticket.mcpList != null ||
        ticket.killedMidRun != null ||
        ticket.authCache != null ||
        ticket.stubBlob != null ||
        ticket.keychainRewrite != null ||
        ticket.emptyTokens != null ||
        ticket.noClientId != null ||
        ticket.slackIntact != null ||
        ticket.needsAuth != null ||
        ticket.concurrentWrite != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isSealed(row) {
  if (row.blanked && row.cue !== "sealed") return false;
  if (
    row.cue === "blanked" ||
    row.cue === "cipherlock" ||
    row.cue === "concurrent-write"
  ) {
    return false;
  }
  if (
    row.emptyTokens &&
    row.cue !== "sealed" &&
    row.sealed !== true &&
    row.tokensHeld !== true
  ) {
    return false;
  }
  if (
    row.keychainRewrite &&
    row.cue !== "sealed" &&
    row.sealed !== true &&
    row.tokensHeld !== true
  ) {
    return false;
  }
  if (
    row.sealed === true &&
    row.blanked !== true &&
    row.cue !== "blanked"
  ) {
    return true;
  }
  if (
    row.cue === "sealed" &&
    row.blanked !== true &&
    row.emptyTokens !== true
  ) {
    return true;
  }
  if (
    (row.tokensHeld === true || row.healthyRefresh === true) &&
    row.blanked !== true &&
    row.emptyTokens !== true &&
    row.keychainRewrite !== true
  ) {
    return true;
  }
  return false;
}

function isBlanked(row) {
  if (isSealed(row)) return false;
  if (row.cue === "blanked" || row.cue === "cipherlock") return true;
  if (row.blanked === true) return true;
  if (
    row.emptyTokens === true ||
    row.keychainRewrite === true ||
    row.noClientId === true ||
    (row.concurrentSessions === true &&
      row.mcpList === true &&
      row.emptyTokens !== false)
  ) {
    return true;
  }
  return false;
}

function isConcurrentWritePath(row) {
  return (
    row.event === "concurrent-write" &&
    !isSealed(row) &&
    (row.blanked === true ||
      row.concurrentWrite === true ||
      row.emptyTokens === true)
  );
}

/**
 * Score one vault pass against the cipherlock booth.
 * sealed: tokens held in Claude Code-credentials.
 * blanked: concurrent writers rewrite notion/atlassian with empty
 * accessToken/refreshToken and no clientId while refresh tokens
 * are still valid.
 * concurrent-write: named path — several processes touch the store.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isConcurrentWritePath(row) ||
    (row.concurrentWrite && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "concurrent-write";
  } else if (isBlanked(row)) {
    verdict = "blanked";
  } else if (isSealed(row)) {
    verdict = "sealed";
  } else if (
    row.emptyTokens ||
    row.keychainRewrite ||
    row.noClientId ||
    (row.concurrentSessions && row.mcpList)
  ) {
    verdict = "blanked";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const door = inspectDoor(row);
  const dial = inspectDial(row);
  const slot = inspectSlot(row);
  const box = inspectBox(row);
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
    blanked:
      verdict === "blanked" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    concurrentWrite:
      row.concurrentWrite === true ||
      verdict === "concurrent-write" ||
      verdict === PATH_WORD,
    tokensHeld: row.tokensHeld,
    healthyRefresh: row.healthyRefresh,
    concurrentSessions: row.concurrentSessions,
    mcpList: row.mcpList,
    killedMidRun: row.killedMidRun,
    authCache: row.authCache,
    stubBlob: row.stubBlob,
    keychainRewrite: row.keychainRewrite,
    emptyTokens: row.emptyTokens,
    noClientId: row.noClientId,
    slackIntact: row.slackIntact,
    needsAuth: row.needsAuth,
    reReadBeforeWrite: row.reReadBeforeWrite,
    perEntryMerge: row.perEntryMerge,
    cue: hold ? "sealed" : "blanked",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sealed" : "score cipherlock",
    doorInspect: door,
    dialInspect: dial,
    slotInspect: slot,
    boxInspect: box,
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
      : CIPHERLOCK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const blanked = scored.filter((row) => row.verdict === "blanked");
  const path = scored.filter((row) => row.verdict === "concurrent-write");
  const sealed = scored.filter((row) => row.verdict === "sealed");
  const headline =
    scored.find((row) => row.event === "empty-tokens") ||
    scored.find((row) => row.event === "concurrent-write") ||
    scored.find((row) => row.event === "keychain-rewrite") ||
    blanked[blanked.length - 1];
  let verdict = "sealed";
  if (blanked.length) verdict = "blanked";
  else if (path.length && !sealed.length) verdict = "concurrent-write";
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
    blankedCount: blanked.length,
    pathCount: path.length,
    sealedCount: sealed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sealed" : "score cipherlock",
    note: headline
      ? "Claude Code 2.1.268 native macOS 26; 7 concurrent claude processes; claude mcp list from another shell (one killed ~75s); Keychain Claude Code-credentials rewritten; notion/atlassian empty accessToken/refreshToken and no clientId; Slack intact."
      : "published cipherlock walk scored against sealed vs blanked",
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
    seeded !== "blanked" &&
    seeded !== "concurrent-write" &&
    seeded !== "cipherlock" &&
    ticket.sealed == null &&
    ticket.blanked == null &&
    ticket.emptyTokens == null &&
    ticket.keychainRewrite == null &&
    ticket.concurrentSessions == null &&
    ticket.mcpList == null &&
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
    sealed: scored.sealed ?? false,
    blanked: scored.blanked ?? false,
    concurrentWrite: scored.concurrentWrite ?? false,
    tokensHeld: scored.tokensHeld ?? false,
    healthyRefresh: scored.healthyRefresh ?? false,
    concurrentSessions: scored.concurrentSessions ?? false,
    mcpList: scored.mcpList ?? false,
    killedMidRun: scored.killedMidRun ?? false,
    authCache: scored.authCache ?? false,
    stubBlob: scored.stubBlob ?? false,
    keychainRewrite: scored.keychainRewrite ?? false,
    emptyTokens: scored.emptyTokens ?? false,
    noClientId: scored.noClientId ?? false,
    slackIntact: scored.slackIntact ?? false,
    needsAuth: scored.needsAuth ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.keychainRewrite || result.blanked ? "door=rewritten" : "door=held",
    result.concurrentSessions ? "dial=spinning" : "dial=still",
    result.mcpList || result.killedMidRun ? "slot=swiped" : "slot=parked",
    result.emptyTokens || result.noClientId || result.blanked
      ? "box=blanked"
      : "box=sealed",
    result.slackIntact ? "slack=intact" : "slack=unknown",
    result.concurrentWrite || result.verdict === "concurrent-write"
      ? "path=concurrent-write"
      : "path=sealed",
    result.cue === "sealed" ? "cue=sealed" : "cue=blanked",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const vault = readVault({
    sealed: result.sealed,
    blanked: result.blanked,
    tokensHeld: result.tokensHeld,
    healthyRefresh: result.healthyRefresh,
    concurrentSessions: result.concurrentSessions,
    mcpList: result.mcpList,
    killedMidRun: result.killedMidRun,
    keychainRewrite: result.keychainRewrite,
    emptyTokens: result.emptyTokens,
    noClientId: result.noClientId,
    slackIntact: result.slackIntact,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    vault,
    door: inspectDoor({
      sealed: result.sealed,
      blanked: result.blanked,
      keychainRewrite: result.keychainRewrite,
    }),
    dial: inspectDial({
      sealed: result.sealed,
      blanked: result.blanked,
      concurrentSessions: result.concurrentSessions,
    }),
    slot: inspectSlot({
      sealed: result.sealed,
      blanked: result.blanked,
      mcpList: result.mcpList,
      killedMidRun: result.killedMidRun,
    }),
    box: inspectBox({
      sealed: result.sealed,
      blanked: result.blanked,
      emptyTokens: result.emptyTokens,
      noClientId: result.noClientId,
      tokensHeld: result.tokensHeld,
      healthyRefresh: result.healthyRefresh,
    }),
    stations: VAULT_STATIONS.map((row) => ({
      ...row,
      blanked: result.blanked === true || result.verdict === "blanked",
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
      client: CLIENT,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      keychainItem: KEYCHAIN_ITEM,
      servers: [...SERVERS],
      processCount: PROCESS_COUNT,
      processVersions: PROCESS_VERSIONS,
      healthyRefreshAt: HEALTHY_REFRESH_AT,
      authCacheAt: AUTH_CACHE_AT,
      killAfter: KILL_AFTER,
      keychainRewriteAt: KEYCHAIN_REWRITE_AT,
      reauthCount: REAUTH_COUNT,
      distinctFrom: DISTINCT_FROM,
      fallbackStore: FALLBACK_STORE,
      authCacheFile: AUTH_CACHE_FILE,
      stations: VAULT_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "entries with a valid refresh token are never zeroed by another process",
        "a failed refresh in one process should not overwrite tokens another process just rotated",
        "the store should be re-read before write, or the write should be per-entry",
        "no /logout and no Clear authentication should still leave valid MCP OAuth tokens held",
      ],
      hypothesis:
        "NON-BINDING: concurrent Keychain read-modify-write without re-read-before-write / per-entry merge lets one process overwrite another's rotated tokens with empty stubs. Verify against #93537 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
