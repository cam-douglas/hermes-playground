#!/usr/bin/env node
/**
 * Stratum — geology / core-sample / bedding-plane /
 * field-stratigraphy booth.
 * A *stratum* is a distinct geological layer / bedding plane.
 * Docs describe project context (CLAUDE.md, auto memory) as a
 * sealed stratum between system and conversation that parallel
 * shafts should share; instead the layer never gets its own
 * cache_control bedding plane, so parallel sessions never
 * share the project bed. Shale / ochre core / slate. NOT
 * Tmesis manuscript parchment. NOT Vedette cavalry lantern.
 * NOT Orloj Prague clock. NOT Brisure herald college. NOT
 * Diptych wax-tablet. NOT Vizard masque-ball. NOT Treacle
 * kettle. NOT Somnus sleep clinic. NOT Cresset fire-basket.
 * NOT Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Stereotype foundry. NOT
 * Cachet wax-seal. NOT Hectograph gelatin.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: the CLAUDE.md / auto-memory block sits in
 * messages[0] after the system breakpoint, with no
 * cache_control of its own. No request ever writes a cache
 * entry ending at that layer, so no other session can read
 * it. Measured over 703 session starts: zero cross-session
 * hits beyond the system prompt layer.
 *
 * Encoded from anthropics/claude-code#94417 issue text only.
 * Hypothesis (NON-BINDING — issue text): project context is
 * placed inside messages[0] after the system breakpoint
 * without its own cache_control, so no cacheable prefix ends
 * at that layer and parallel sessions never share it. Invite
 * verify against #94417 text only. Do NOT claim a root cause
 * in Claude Code source you have not seen. Do NOT implement
 * a Claude Code fix. No network. No exploits. No live Claude.
 *
 *   node stratum.mjs data/stratum.json
 *   echo '{"seed":"stratum"}' | node stratum.mjs
 *
 * Idle word is shared (HOLD: seal the project-context bed
 * with its own cache_control so parallel shafts share it).
 * HOLD aliases: layered, sealed, common.
 * Seeded word is stratum (#94417 path).
 * Path word is layer-unsealed.
 * Product score word is stratum (Score stratum or admit shared.).
 *
 * NOT Cancellans/#94400 (resume fork drops initial tools).
 * NOT Cachet/#93490 (resume flattens array+cache_control).
 * NOT Mojibake/#93848 (encoding U+FFFD in CLAUDE.md).
 * NOT Stereotype (plugin freshness). NOT Veto/palimpsest.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "shared",
  "stratum",
  "layer-unsealed",
  "layered",
  "sealed",
  "common",
  "no-breakpoint",
  "messages-zero",
  "cache-miss",
  "project-context",
  "parallel-shafts",
  "94417",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "shared";
export const PATH_WORD = "layer-unsealed";
export const SEEDED_WORD = "stratum";
export const PRODUCT_WORD = "stratum";
export const HOLD = Object.freeze(["shared"]);
export const HOLD_ALIASES = Object.freeze(["layered", "sealed", "common"]);
export const RECOVER = Object.freeze(["shared"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "contiguous",
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
  "cleared",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "cachet",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
]);

export const FEATURED_ISSUE = 94417;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94417";
export const TITLE =
  "CLAUDE.md / auto-memory block is never shared across sessions: it sits in messages[0] after the system breakpoint, with no cache_control of its own";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "area:core"]);
export const PLATFORM = "windows";
export const SURFACE = "layer-unsealed";
export const HOST =
  "Claude Code 2.1.270 (also 2.1.266); Windows 11; Opus 5; subscription (1h TTL); CLI and desktop";
export const CHECKED_ON =
  "Published report: project context sits in messages[0] after the system breakpoint with no cache_control of its own; 703 starts, zero cross-session hits beyond the system prompt layer";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "Project-context layer never sealed with its own cache_control — not a model defect";
export const OS = "Windows 11; CLI and desktop; area:core";
export const PHRASE = "Score stratum or admit shared.";
export const DISTRIBUTION =
  "Claude Code 2.1.270 (also 2.1.266); Windows 11; Opus 5; Claude subscription (1h TTL). Both cc_entrypoint=cli and claude-desktop. Docs layer table: System prompt → Project context (CLAUDE.md, auto memory, unscoped rules) → Conversation. Cache scope: sessions run in parallel in the same directory build matching prefixes and read each other's cache. Blog: Static system prompt & Tools (globally cached), CLAUDE.md (cached within a project), Session context (cached within a session), Conversation messages. Captured first-turn request: tools[18] no cache_control; system[2] and system[3] have cache_control; messages[0] role=user starts with <system-reminder> CLAUDE.md (global + project) + MEMORY.md then userEmail, commit attribution, then the user's prompt; messages[1] role=system has cache_control and a per-session UUID scratchpad path. Between the last system breakpoint and the next one: the CLAUDE.md block, the user's first prompt, and a session-specific block. Prefix ending at messages[1] can never match another session. Nothing writes an entry ending after messages[0].content[0]. 703 sessions; 474 started while another session in the same directory was active within 60 minutes. cache_read_input_tokens 46,328 on every directory (system layer); 49,760 / 49,769 / 50,595 / 52,548 constant per directory (system[3] auto-memory path). Anything larger only on --resume. Zero of 474 warm starts read beyond system[3]. cache_creation_input_tokens 23–36k, of which CLAUDE.md+MEMORY is roughly 4–7k tokens that would be byte-identical between sessions of the same directory.";

export const CODE_BUILD = "2.1.270";
export const ALSO_BUILD = "2.1.266";
export const SESSION_STARTS = 703;
export const WARM_STARTS = 474;
export const CROSS_SESSION_HITS = 0;
export const SYSTEM_LAYER_TOKENS = 46328;
export const PROJECT_LAYER_TOKENS_MIN = 4000;
export const PROJECT_LAYER_TOKENS_MAX = 7000;
export const CACHE_CREATE_MIN = 23000;
export const CACHE_CREATE_MAX = 36000;
export const TTL_HOURS = 1;
export const DIRECTORY_LAYER_READS = Object.freeze([
  49760, 49769, 50595, 52548,
]);

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_SHARED = Object.freeze({
  kind: "shared",
  sealed: true,
  cacheControlOnProject: true,
  messagesZeroHoldsPrompt: false,
  sessionOverburdenSeals: false,
  crossSessionHits: WARM_STARTS,
  note: "bedding plane holds — project bed sealed so parallel shafts share it",
  synthetic: true,
});
export const SYNTHETIC_STRATUM = Object.freeze({
  kind: "stratum",
  sealed: false,
  cacheControlOnProject: false,
  messagesZeroHoldsPrompt: true,
  sessionOverburdenSeals: true,
  crossSessionHits: 0,
  note: "project bed sits in messages[0] with no cache_control; parallel shafts miss it",
  synthetic: true,
});
export const SYNTHETIC_LAYER_UNSEALED = Object.freeze({
  kind: "layer-unsealed",
  rows: [
    { lane: "tools[18]", block: "tools", cacheControl: false, note: "DeferredToolPlaceholder present" },
    { lane: "system[2]", block: "core-instructions", cacheControl: true, note: "system breakpoint" },
    { lane: "system[3]", block: "static+memory-path", cacheControl: true, note: "per-directory auto memory path" },
    { lane: "messages[0].content[0]", block: "CLAUDE.md+MEMORY.md", cacheControl: false, note: "project context after breakpoint" },
    { lane: "messages[0].content[3..]", block: "user-prompt", cacheControl: false, note: "first prompt in the same message" },
    { lane: "messages[1]", block: "session-context", cacheControl: true, note: "session UUID scratchpad; never matches another shaft" },
  ],
  note: "six-row evidence: system sealed; project bed unsealed; session overburden seals too late",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "tools[18]",
    role: "tools",
    content: "18 tools; DeferredToolPlaceholder present",
    cacheControl: false,
    shared: false,
  },
  {
    lane: "system[2]",
    role: "system",
    content: "core instructions",
    cacheControl: true,
    shared: true,
  },
  {
    lane: "system[3]",
    role: "system",
    content: "static instructions + auto-memory path",
    cacheControl: true,
    shared: true,
  },
  {
    lane: "messages[0].content[0]",
    role: "user",
    content: "<system-reminder> CLAUDE.md (global + project) + MEMORY.md",
    cacheControl: false,
    shared: false,
    unsealed: true,
  },
  {
    lane: "messages[0].content[3..]",
    role: "user",
    content: "the user's prompt (or /command + skill body)",
    cacheControl: false,
    shared: false,
  },
  {
    lane: "messages[1]",
    role: "system",
    content: "SessionStart + Environment + Scratchpad …\\<session uuid>\\scratchpad",
    cacheControl: true,
    shared: false,
    sessionSpecific: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "system-bedrock",
    lost: "System bedrock — system[2]/system[3] sealed; only layer that parallel shafts actually share",
    control: "A shared core would keep this bed and add a plane on the project bed",
    story: "the shale basement already has its own bedding plane",
  },
  {
    id: "project-bed",
    lost: "Project bed — CLAUDE.md + MEMORY.md sits in messages[0].content[0] after the breakpoint",
    control: "the project bed would be its own cached stratum",
    story: "docs name this layer; the request never seals it",
  },
  {
    id: "unsealed-plane",
    lost: "Unsealed plane — no cache_control on the CLAUDE.md block",
    control: "a cache_control marker would end a prefix at the project bed",
    story: "the bedding plane is missing so no cache entry ends here",
  },
  {
    id: "first-prompt",
    lost: "First prompt — the user's first turn lives in later blocks of the same messages[0]",
    control: "the prompt would sit after a sealed project bed",
    story: "prompt and project clay are poured as one unsealed lift",
  },
  {
    id: "session-overburden",
    lost: "Session overburden — next cache_control is on messages[1] with a per-session UUID",
    control: "session context would stay per-session without swallowing the project bed",
    story: "the overburden seals too late and never matches another shaft",
  },
  {
    id: "parallel-shafts",
    lost: "Parallel shafts — 0 of 474 warm starts read beyond system[3]",
    control: "parallel sessions in the same directory would share the 4–7k project tokens",
    story: "two cores from the same bed never read the same project layer",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "system-bedrock",
    survey: "shared HOLD: seal the project-context bed with its own cache_control so parallel shafts share it",
    kind: "shared",
    note: "idle/control: system bedrock already sealed; project bed should be too",
  },
  {
    id: "project-bed",
    survey: "CLAUDE.md + MEMORY.md emitted as messages[0].content[0] after the system breakpoint",
    kind: "stratum",
    note: "seeded: project bed after the breakpoint, not as system[4]",
  },
  {
    id: "unsealed-plane",
    survey: "no cache_control on the CLAUDE.md / auto-memory block",
    kind: "stratum",
    note: "seeded: missing bedding plane",
  },
  {
    id: "first-prompt",
    survey: "user prompt is a later block of the same messages[0]",
    kind: "stratum",
    note: "seeded: prompt mixed into the unsealed lift",
  },
  {
    id: "session-overburden",
    survey: "next cache_control is on a session-context message with a per-session UUID",
    kind: "stratum",
    note: "seeded: overburden seals too late",
  },
  {
    id: "parallel-shafts",
    survey: "layer-unsealed — 0 of 474 warm starts read beyond system[3]",
    kind: "stratum",
    note: "path: layer-unsealed names the cross-session miss",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "no-breakpoint",
    label: "no-breakpoint",
    count: "messages[0]",
    note: "project context sits after the system breakpoint, not as its own sealed system block",
  },
  {
    id: "messages-zero",
    label: "messages-zero",
    count: "content[0]",
    note: "CLAUDE.md is the first content block of the first user message",
  },
  {
    id: "cache-miss",
    label: "cache-miss",
    count: "0/474",
    note: "zero warm starts read beyond the system prompt layer",
  },
  {
    id: "layer-unsealed",
    label: "layer-unsealed",
    count: "no cache_control",
    note: "no request writes a cache entry ending at the project bed",
  },
  {
    id: "project-context",
    label: "project-context",
    count: "4–7k",
    note: "CLAUDE.md+MEMORY tokens that would be byte-identical between sessions",
  },
  {
    id: "parallel-shafts",
    label: "parallel-shafts",
    count: "703/474",
    note: "703 starts; 474 warm; zero cross-session hits beyond system[3]",
  },
]);

export const RULED_OUT = Object.freeze([
  "Cancellans/#94400 — resume fork drops initial tools → cache miss — DIFFERENT; cite only",
  "Cachet/#93490 — resume flattens array+cache_control seal — DIFFERENT; cite only",
  "Stereotype — plugin freshness / version-only stamp — DIFFERENT; cite only",
  "Mojibake/#93848 — encoding U+FFFD in CLAUDE.md — DIFFERENT; cite only",
  "Hysteresis — effort-dial remanence rewrite — DIFFERENT; cite only",
  "Diopter — scratchpad UUID lens — DIFFERENT; cite only",
  "Setoff / Plimsoll / Graft / Ephemera — other cache themes — DIFFERENT; cite only",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit / false success — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — orphan scheduled-task ticks — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
  "Fetchling/#94065 — skill $N swap — DIFFERENT",
  "Veto/palimpsest — CLAUDE.md overlay booth — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "Parallel sessions in the same directory read the CLAUDE.md / auto-memory block from cache, as documented",
  "Put a cache_control marker on the CLAUDE.md block (messages[0].content[0]), or move the block to system[4] with its own marker, ahead of the first user prompt",
  "Session-context message (messages[1]) stays per-session, matching what the blog already says about it",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Put a cache_control marker on the CLAUDE.md block (messages[0].content[0])",
  "Or move the block to system[4] with its own marker, ahead of the first user prompt",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "layer-unsealed",
  "stratum",
  "no-breakpoint",
  "messages-zero",
  "cache-miss",
  "parallel-shafts",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94400,
    title: "resume fork drops a tool from the parent's initial tools array so the first request misses the prompt cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Cancellans/#94400 is a resume-fork tools-array drop. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93490,
    title: "resume flattens array+cache_control seal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Cachet/#93490 is a resume flatten of array+cache_control. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93848,
    title: "encoding U+FFFD in CLAUDE.md",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Mojibake/#93848 is encoding replacement in CLAUDE.md. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 91151,
    title: "resume cache collapses to system+tools floor",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #91151 is a resume cache collapse to the system+tools floor. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94496, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94499, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "stereotype",
  "cachet",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
]);

export const SAMPLE_KIND_IDLE = "system-bedrock";
export const SAMPLE_KIND_SEEDED = "layer-unsealed";
export const SAMPLE_HOLDING_IDLE = "field-stratigraphy";
export const SAMPLE_HOLDING_SEEDED = "unsealed-plane";

export const SAMPLE_SHARED_PROOF = Object.freeze({
  shared: true,
  stratum: false,
  layerUnsealed: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_STRATUM_PROOF = Object.freeze({
  shared: false,
  stratum: true,
  layerUnsealed: true,
  noBreakpoint: true,
  messagesZero: true,
  cacheMiss: true,
  projectContext: true,
  parallelShafts: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  sharedWatch: { ...SYNTHETIC_SHARED },
  stratumWatch: { ...SYNTHETIC_STRATUM },
  layerUnsealedShape: { ...SYNTHETIC_LAYER_UNSEALED },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds shared: seal the project-context bed with its own cache_control so parallel shafts share it" },
  { t: "layer-unsealed", line: "CLAUDE.md sits in messages[0] after the system breakpoint with no cache_control" },
  { t: "path", line: "layer-unsealed — no cache entry ends at the project bed; 0/474 warm starts share it" },
  { t: "score", line: "when the bedding plane is missing the booth is stratum — Score stratum or admit shared." },
]);

const FORCE_FLAGS = [
  "layerUnsealed",
  "noBreakpoint",
  "messagesZero",
  "cacheMiss",
  "projectContext",
  "parallelShafts",
];

const ISSUE_CUE_RE =
  /94417|CLAUDE\.md|auto-memory|cache_control|messages\[0\]|system breakpoint|project context|4–7k|4-7k|474 warm|703 session/i;

/**
 * Educational system-breakpoint observer. Not a Claude Code patch.
 * Encodes only the published #94417 shapes.
 *
 * system[2]/system[3] carry cache_control. shared=true keeps the
 * project bed sealed as well.
 */
export function observeSystemBreakpoint({
  systemSealed = true,
  projectSealed = false,
  shared = false,
} = {}) {
  if (shared === true) {
    return {
      systemSealed: true,
      projectSealed: true,
      phrase: "admit shared",
      synthetic: true,
    };
  }
  return {
    systemSealed: systemSealed === true,
    projectSealed: projectSealed === true,
    phrase: projectSealed ? "admit shared" : "score stratum",
    note: projectSealed
      ? "project bed has its own cache_control bedding plane"
      : "system breakpoint sealed; project bed is not",
    synthetic: true,
  };
}

/**
 * Educational project-context placement. Not a Claude Code patch.
 * Published path: CLAUDE.md is the first content block of messages[0].
 */
export function placeProjectContext({
  inMessagesZero = true,
  cacheControl = false,
  shared = false,
} = {}) {
  if (shared === true) {
    return {
      lane: "system[4]",
      cacheControl: true,
      phrase: "admit shared",
      note: "project bed moved ahead of the first user prompt and sealed",
      synthetic: true,
    };
  }
  const unsealed = inMessagesZero === true && cacheControl !== true;
  return {
    lane: inMessagesZero ? "messages[0].content[0]" : "system[4]",
    cacheControl: cacheControl === true,
    phrase: unsealed ? "score stratum" : "admit shared",
    note: unsealed
      ? "CLAUDE.md sits in messages[0] after the system breakpoint with no cache_control"
      : "project bed is sealed",
    synthetic: true,
  };
}

/**
 * Educational bedding-plane seal. Not a Claude Code patch.
 * A cache_control marker on the CLAUDE.md block would end a
 * prefix at the project bed.
 */
export function sealBeddingPlane({
  cacheControlOnProject = false,
  shared = false,
} = {}) {
  if (shared === true || cacheControlOnProject === true) {
    return {
      sealed: true,
      phrase: "admit shared",
      synthetic: true,
    };
  }
  return {
    sealed: false,
    phrase: "score stratum",
    note: "no cache_control on the CLAUDE.md block; no cache entry ends at the project bed",
    synthetic: true,
  };
}

/**
 * Educational cross-session measurement. Not a Claude Code patch.
 * Published: 0 of 474 warm starts read beyond system[3].
 */
export function measureCrossSessionHits({
  warmStarts = WARM_STARTS,
  hitsBeyondSystem = CROSS_SESSION_HITS,
  shared = false,
} = {}) {
  if (shared === true) {
    return {
      warmStarts,
      hitsBeyondSystem: warmStarts,
      phrase: "admit shared",
      synthetic: true,
    };
  }
  const miss = hitsBeyondSystem === 0;
  return {
    warmStarts,
    hitsBeyondSystem,
    phrase: miss ? "score stratum" : "admit shared",
    note: miss
      ? "zero of the warm starts read beyond the system[3] layer"
      : "parallel shafts shared the project bed",
    synthetic: true,
  };
}

/**
 * Educational prefix assembler. Not a Claude Code patch.
 * A prefix ending at messages[1] includes a per-session UUID
 * and can never match another session.
 */
export function assemblePrefix({
  rows = null,
  shared = false,
} = {}) {
  if (shared === true) {
    return {
      endsAt: "messages[0].content[0]",
      sessionSpecific: false,
      matchable: true,
      phrase: "admit shared",
      synthetic: true,
    };
  }
  const list = Array.isArray(rows) && rows.length ? rows : SYNTHETIC_LAYER_UNSEALED.rows;
  const lastSeal = [...list].reverse().find((row) => row.cacheControl === true) || {};
  const sessionSpecific = lastSeal.block === "session-context";
  return {
    endsAt: lastSeal.lane || "messages[1]",
    sessionSpecific,
    matchable: !sessionSpecific,
    phrase: sessionSpecific ? "score stratum" : "admit shared",
    note: sessionSpecific
      ? "prefix ending at messages[1] includes a per-session UUID and never matches another shaft"
      : "prefix ends at a shared bedding plane",
    synthetic: true,
  };
}

export function scoreLayerUnsealed(input = {}) {
  const sharedHold = input.shared === true && input.stratum !== true;
  const bed = observeSystemBreakpoint({
    projectSealed: sharedHold,
    shared: sharedHold,
  });
  const stratum =
    !sharedHold &&
    (input.stratum === true ||
      input.layerUnsealed === true ||
      input.noBreakpoint === true ||
      input.messagesZero === true ||
      input.cacheMiss === true ||
      input.parallelShafts === true ||
      bed.projectSealed !== true);
  return {
    shared: !stratum,
    stratum,
    layerUnsealed: stratum,
    bed,
    phrase: stratum ? "score stratum" : "admit shared",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94417") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapStratum(input = {}) {
  const stratum = isStratumInput(input);
  const shared = input.shared === true && !stratum;
  return {
    stamp: stratum ? "layer-unsealed" : "field-stratigraphy",
    holdingLane: stratum ? "unsealed-plane" : "field-stratigraphy",
    kindLane: stratum ? "layer-unsealed" : "system-bedrock",
    bindLane: stratum ? "session-overburden" : "common",
    ribbon: stratum ? "stratum" : "shared",
    shared,
  };
}

export function inspectNoBreakpoint(input = {}) {
  const flagged =
    input.noBreakpoint === true ||
    input.stratum === true ||
    input.layerUnsealed === true ||
    isStratumInput(input);
  if (input.shared === true && !flagged) {
    return { stamp: "layered", flagged: false, note: "project bed stays a sealed system layer" };
  }
  return {
    stamp: flagged ? "no-breakpoint" : "breakpoint-idle",
    flagged,
    note: flagged
      ? "no-breakpoint — project context sits after the system breakpoint"
      : "",
  };
}

export function inspectMessagesZero(input = {}) {
  const flagged =
    input.messagesZero === true ||
    input.stratum === true ||
    isStratumInput(input);
  if (input.shared === true && !flagged) {
    return { stamp: "sealed", flagged: false };
  }
  return {
    stamp: flagged ? "messages-zero" : "message-idle",
    flagged,
    note: flagged
      ? "messages-zero — CLAUDE.md is the first content block of the first user message"
      : "",
  };
}

export function inspectCacheMiss(input = {}) {
  const missed =
    input.cacheMiss === true ||
    input.stratum === true ||
    input.layerUnsealed === true ||
    isStratumInput(input);
  if (input.shared === true && !missed) {
    return { stamp: "common", missed: false };
  }
  return {
    stamp: missed ? "cache-miss" : "cache-idle",
    missed,
    note: missed
      ? "cache-miss — zero warm starts read beyond the system prompt layer"
      : "",
  };
}

export function inspectProjectContext(input = {}) {
  const flagged =
    input.projectContext === true ||
    input.stratum === true ||
    isStratumInput(input);
  if (input.shared === true && !flagged) {
    return { stamp: "system-bedrock", flagged: false };
  }
  return {
    stamp: flagged ? "project-context" : "context-idle",
    flagged,
    note: flagged
      ? "project-context — 4–7k CLAUDE.md+MEMORY tokens never get their own cache entry"
      : "",
  };
}

export function inspectParallelShafts(input = {}) {
  const flagged =
    input.parallelShafts === true ||
    input.stratum === true ||
    isStratumInput(input);
  if (input.shared === true && !flagged) {
    return { stamp: "layered", flagged: false };
  }
  return {
    stamp: flagged ? "parallel-shafts" : "shaft-idle",
    flagged,
    note: flagged
      ? "parallel-shafts — 0 of 474 warm starts share the project bed"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "system-bedrock": input.stratum || input.layerUnsealed,
    "project-bed": input.stratum || input.layerUnsealed || input.projectContext,
    "unsealed-plane": input.noBreakpoint || input.layerUnsealed || input.stratum,
    "first-prompt": input.messagesZero || input.stratum,
    "session-overburden": input.cacheMiss || input.stratum,
    "parallel-shafts": input.parallelShafts || input.layerUnsealed || input.stratum,
  };
  return (
    map[id] === true ||
    input.layerUnsealed === true ||
    input.stratum === true
  );
}

function isStratumInput(input = {}) {
  return (
    input.stratum === true ||
    input.layerUnsealed === true ||
    input.noBreakpoint === true ||
    input.messagesZero === true ||
    input.cacheMiss === true ||
    input.projectContext === true ||
    input.parallelShafts === true
  );
}

export function readBooth(input = {}) {
  const stratum = isStratumInput(input);
  const shared = input.shared === true && !stratum;
  return {
    mark: stratum ? "stratum" : "shared",
    shared,
    stratum,
    layerUnsealed: input.layerUnsealed === true || stratum,
    noBreakpoint: input.noBreakpoint === true,
    messagesZero: input.messagesZero === true,
    cacheMiss: input.cacheMiss === true,
    projectContext: input.projectContext === true,
    parallelShafts: input.parallelShafts === true,
    post: mapStratum(input),
    breakpoint: inspectNoBreakpoint(input),
    messages: inspectMessagesZero(input),
    cache: inspectCacheMiss(input),
    context: inspectProjectContext(input),
    shafts: inspectParallelShafts(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const STRATUM_WALK = Object.freeze([
  {
    t: "idle",
    event: "field-stratigraphy",
    shared: true,
    stratum: false,
    cue: "shared",
    note: "idle HOLD: seal the project-context bed with its own cache_control so parallel shafts share it",
  },
  {
    t: "layer-unsealed",
    event: "layer-unsealed",
    stratum: true,
    layerUnsealed: true,
    noBreakpoint: true,
    messagesZero: true,
    cue: "stratum",
    note: "CLAUDE.md sits in messages[0] after the system breakpoint with no cache_control",
  },
  {
    t: "path",
    event: "layer-unsealed",
    stratum: true,
    layerUnsealed: true,
    noBreakpoint: true,
    messagesZero: true,
    cacheMiss: true,
    projectContext: true,
    parallelShafts: true,
    cue: "stratum",
    note: "layer-unsealed — no cache entry ends at the project bed; 0/474 warm starts share it",
  },
  {
    t: "score",
    event: "stratum",
    stratum: true,
    layerUnsealed: true,
    noBreakpoint: true,
    messagesZero: true,
    cacheMiss: true,
    projectContext: true,
    parallelShafts: true,
    cue: "stratum",
    note: "stratum — the project bed never gets its own bedding plane",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "field-stratigraphy",
    shared: true,
    stratum: false,
    cue: "shared",
    note: "positive control: seal the project-context bed with its own cache_control",
  },
  {
    t: "admit",
    event: "field-stratigraphy",
    shared: true,
    cue: "shared",
    note: "positive control: the core admits shared",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    shared: true,
    stratum: false,
    layerUnsealed: false,
    cue: "shared",
  };
}

export function seedShared() {
  return { ...emptyTicket() };
}

export function seedStratum() {
  return {
    seed: SEEDED_WORD,
    shared: false,
    stratum: true,
    layerUnsealed: true,
    noBreakpoint: true,
    messagesZero: true,
    cacheMiss: true,
    projectContext: true,
    parallelShafts: true,
    cue: "stratum",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_STRATUM_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    stratum: true,
    layerUnsealed: true,
    cue: "stratum",
  };
}

export function seedLayerUnsealed() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    stratum: true,
    layerUnsealed: true,
    event: "layer-unsealed",
    cue: "stratum",
  };
}

export function seedLayered() {
  return { seed: "layered", preferSeed: true, shared: true, cue: "shared" };
}

export function seedSealed() {
  return { seed: "sealed", preferSeed: true, shared: true, cue: "shared" };
}

export function seedCommon() {
  return { seed: "common", preferSeed: true, shared: true, cue: "shared" };
}

export function seedNoBreakpoint() {
  return {
    seed: "no-breakpoint",
    preferSeed: true,
    noBreakpoint: true,
    cue: "stratum",
  };
}

export function seedCacheMiss() {
  return {
    seed: "cache-miss",
    preferSeed: true,
    cacheMiss: true,
    cue: "stratum",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      shared: false,
      stratum: false,
      layerUnsealed: false,
      noBreakpoint: false,
      messagesZero: false,
      cacheMiss: false,
      projectContext: false,
      parallelShafts: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    shared: raw.shared === true,
    stratum: raw.stratum === true || raw.event === "stratum",
    layerUnsealed: raw.layerUnsealed === true || raw.event === "layer-unsealed",
    noBreakpoint: raw.noBreakpoint === true || raw.event === "no-breakpoint",
    messagesZero: raw.messagesZero === true || raw.event === "messages-zero",
    cacheMiss: raw.cacheMiss === true || raw.event === "cache-miss",
    projectContext: raw.projectContext === true || raw.event === "project-context",
    parallelShafts: raw.parallelShafts === true || raw.event === "parallel-shafts",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.shared != null ||
        ticket.stratum != null ||
        ticket.layerUnsealed != null ||
        ticket.noBreakpoint != null ||
        ticket.messagesZero != null ||
        ticket.cacheMiss != null ||
        ticket.projectContext != null ||
        ticket.parallelShafts != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isShared(row) {
  if (row.stratum && row.cue !== "shared") return false;
  if (row.cue === "stratum" || row.cue === "layer-unsealed") return false;
  if (
    row.layerUnsealed &&
    row.cacheMiss &&
    row.cue !== "shared" &&
    row.shared !== true
  ) {
    return false;
  }
  if (
    row.shared === true &&
    row.stratum !== true &&
    row.cue !== "stratum"
  ) {
    return true;
  }
  if (
    row.cue === "shared" &&
    row.stratum !== true &&
    row.layerUnsealed !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isLayerUnsealed(row) {
  return (
    row.event === "layer-unsealed" &&
    !isShared(row) &&
    (row.layerUnsealed === true ||
      row.cacheMiss === true ||
      row.stratum === true)
  );
}

function isStratumRow(row) {
  if (isShared(row)) return false;
  if (isLayerUnsealed(row) && row.cue !== "stratum") return false;
  if (row.cue === "stratum") return true;
  if (row.stratum === true) return true;
  if (row.layerUnsealed === true && row.cacheMiss === true) return true;
  if (
    row.layerUnsealed === true ||
    row.noBreakpoint === true ||
    row.messagesZero === true ||
    row.cacheMiss === true ||
    row.projectContext === true ||
    row.parallelShafts === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one stratum pass against the field-stratigraphy desk.
 * shared: seal the project-context bed with its own cache_control.
 * stratum: project bed sits in messages[0] with no bedding plane.
 * layer-unsealed: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isLayerUnsealed(row) ||
    (row.layerUnsealed && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "layer-unsealed";
  } else if (isStratumRow(row)) {
    verdict = "stratum";
  } else if (isShared(row)) {
    verdict = "shared";
  } else if (
    row.layerUnsealed ||
    row.noBreakpoint ||
    row.messagesZero ||
    row.cacheMiss ||
    row.projectContext ||
    row.parallelShafts
  ) {
    verdict = "stratum";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "stratum";
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
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    shared: verdict === "shared",
    stratum: verdict === "stratum" || verdict === SEEDED_WORD,
    layerUnsealed:
      row.layerUnsealed === true ||
      verdict === "layer-unsealed" ||
      verdict === PATH_WORD,
    noBreakpoint: row.noBreakpoint,
    messagesZero: row.messagesZero,
    cacheMiss: row.cacheMiss,
    projectContext: row.projectContext,
    parallelShafts: row.parallelShafts,
    cue: hold
      ? "shared"
      : row.layerUnsealed || verdict === "layer-unsealed"
        ? "layer-unsealed"
        : "stratum",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit shared" : "score stratum",
    breakpointInspect: inspectNoBreakpoint(row),
    messagesInspect: inspectMessagesZero(row),
    cacheInspect: inspectCacheMiss(row),
    contextInspect: inspectProjectContext(row),
    shaftsInspect: inspectParallelShafts(row),
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
      : STRATUM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "stratum");
  const path = scored.filter((row) => row.verdict === "layer-unsealed");
  const shared = scored.filter((row) => row.verdict === "shared");
  const headline =
    scored.find((row) => row.event === "stratum") ||
    scored.find((row) => row.event === "layer-unsealed") ||
    scored.find((row) => row.event === "cache-miss") ||
    charged[charged.length - 1];
  let verdict = "shared";
  if (charged.length) verdict = "stratum";
  else if (path.length && !shared.length) {
    verdict = "layer-unsealed";
  }
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
    stratumCount: charged.length,
    pathCount: path.length,
    sharedCount: shared.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit shared" : "score stratum",
    note: headline
      ? "CLAUDE.md / auto-memory block is never shared across sessions: it sits in messages[0] after the system breakpoint, with no cache_control of its own. Cite-only cousins #94400 #93490 #93848 #91151."
      : "published stratum walk scored against shared vs stratum",
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
    seeded !== "shared" &&
    seeded !== "stratum" &&
    seeded !== "layer-unsealed" &&
    ticket.shared == null &&
    ticket.stratum == null &&
    ticket.layerUnsealed == null &&
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
    shared: scored.shared ?? false,
    stratum: scored.stratum ?? false,
    layerUnsealed: scored.layerUnsealed ?? false,
    noBreakpoint: scored.noBreakpoint ?? false,
    messagesZero: scored.messagesZero ?? false,
    cacheMiss: scored.cacheMiss ?? false,
    projectContext: scored.projectContext ?? false,
    parallelShafts: scored.parallelShafts ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.layerUnsealed || result.stratum
      ? "kind=layer-unsealed"
      : "kind=system-bedrock",
    result.cacheMiss || result.stratum
      ? "ref=cache-miss"
      : "ref=field-stratigraphy",
    result.layerUnsealed || result.verdict === "layer-unsealed"
      ? "path=layer-unsealed"
      : "path=shared",
    result.cue === "shared"
      ? "cue=shared"
      : result.cue === "layer-unsealed"
        ? "cue=layer-unsealed"
        : "cue=stratum",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    shared: result.shared,
    stratum: result.stratum,
    layerUnsealed: result.layerUnsealed,
    noBreakpoint: result.noBreakpoint,
    messagesZero: result.messagesZero,
    cacheMiss: result.cacheMiss,
    projectContext: result.projectContext,
    parallelShafts: result.parallelShafts,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    breakpoint: inspectNoBreakpoint({
      shared: result.shared,
      stratum: result.stratum,
      noBreakpoint: result.noBreakpoint,
    }),
    messages: inspectMessagesZero({
      shared: result.shared,
      stratum: result.stratum,
      messagesZero: result.messagesZero,
    }),
    cache: inspectCacheMiss({
      shared: result.shared,
      stratum: result.stratum,
      cacheMiss: result.cacheMiss,
    }),
    context: inspectProjectContext({
      shared: result.shared,
      stratum: result.stratum,
      projectContext: result.projectContext,
    }),
    shafts: inspectParallelShafts({
      shared: result.shared,
      stratum: result.stratum,
      parallelShafts: result.parallelShafts,
    }),
    post: mapStratum({
      shared: result.shared,
      stratum: result.stratum,
      layerUnsealed: result.layerUnsealed,
      cacheMiss: result.cacheMiss,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      stratum: result.stratum === true || result.verdict === "stratum",
    })),
    leakPath: scoreLayerUnsealed({
      shared: result.shared === true && !result.stratum,
      stratum: result.stratum,
      layerUnsealed: result.layerUnsealed,
      cacheMiss: result.cacheMiss,
      noBreakpoint: result.noBreakpoint,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): project context is placed inside messages[0] after the system breakpoint without its own cache_control, so no cacheable prefix ends at that layer and parallel sessions never share it. Invite verify against #94417 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
