#!/usr/bin/env node
/**
 * Monstrance — sanctuary monstrance / exposition booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * In Cowork, host-executing tools Bash/WebFetch/etc. are withdrawn and
 * replaced by mcp__workspace__bash / mcp__workspace__web_fetch.
 * The Artifact tool still loads (on the allowed list) but its read
 * path looks for native WebFetch, which no longer exists. The refusal
 * falsely blames "your WebFetch deny rule (WebFetch)" even when no
 * deny rule exists in any settings file. Because publish to an
 * existing artifact requires reading the live version first, publish
 * is also refused unless force: true. A session that CREATED the
 * artifact can publish without read (bug invisible until a later
 * session updates it). Contrast: Claude Code surface with native
 * WebFetch present — read succeeds.
 *
 *   node monstrance.mjs data/withheld.json
 *   echo '{"seed":"withheld"}' | node monstrance.mjs
 *
 * Idle word is viewed (HOLD: live artifact readable via the fetch
 * Cowork actually provides).
 * Seeded word is withheld (#93563 phantom WebFetch deny; content withheld).
 * Path word is phantom-deny.
 * Product score word is monstrance (Score monstrance or admit viewed.).
 *
 * Encoded from anthropics/claude-code#93563 issue text only.
 * Hypothesis (NON-BINDING): Cowork disallow list includes WebFetch;
 * Artifact still wired to native WebFetch; absence is surfaced as a
 * user deny rule. Verify against #93563 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "hold",
  "native-webfetch",
  "mcp-substitute",
  "force-true",
  "created-session-ok",
  "later-session-refuse",
  "deny-rule-absent",
  "artifact-read",
  "artifact-publish",
  "host-withdrawn",
  "luna-veiled",
  "sacristy-unused",
  "phantom-ribbon",
  "cowork-surface",
  "code-surface",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "viewed";
export const PATH_WORD = "phantom-deny";
export const SEEDED_WORD = "withheld";
export const PRODUCT_WORD = "monstrance";
export const HOLD = Object.freeze(["viewed", "hold"]);
export const RECOVER = Object.freeze(["viewed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "compline",
  "lingering",
  "unrung",
  "closed",
  "cipherlock",
  "sealed",
  "blanked",
  "concurrent-write",
  "attainder",
  "untainted",
  "attainted",
  "retire-parked",
  "sourdine",
  "voiced",
  "muted",
  "mid-narration",
  "forksink",
  "lodged",
  "dropped",
  "source-fork",
  "foxfire",
  "kindled",
  "painted",
  "never-turns",
  "pentimento",
  "flushed",
  "lagged",
  "one-behind",
  "vinculum",
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "cachet",
  "imprimatur",
  "ukase",
  "understudy",
  "fetch",
  "hit",
  "flattened",
  "string-carrier",
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
  "quietus",
  "rubric",
  "recension",
  "priory",
  "waived",
  "refused",
  "imprinted",
  "ukased",
  "miscast",
  "ghosted",
  "scraped",
  "fabricated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "withheld" && name !== "monstrance",
  ),
);

export const FEATURED_ISSUE = 93563;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93563";
export const TITLE =
  "[BUG] Artifact tool cannot read live artifacts in Cowork — read path binds to native WebFetch, which Cowork substitutes with mcp__workspace__web_fetch";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:cowork",
]);
export const CLAUDE_CODE_VERSION = "1.49585.0";
export const OS = "macOS";
export const CLIENT = "Cowork surface";
export const DESKTOP_BUILD = "Claude desktop app 1.49585.0 (Cowork surface)";
export const COMMIT_STAMP = "2026-09-08";
export const MODEL = "Opus";
export const PLATFORM = "Anthropic API";
export const NATIVE_BASH = 0;
export const NATIVE_WEBFETCH = 0;
export const MCP_BASH = 2935;
export const MCP_WEB_FETCH_COUNT = 1024;
export const WEBSEARCH_COUNT = 596;
export const READ_COUNT = 414;
export const ARTIFACT_COUNT = 21;
export const MCP_WEB_FETCH = "mcp__workspace__web_fetch";
export const MCP_BASH_TOOL = "mcp__workspace__bash";
export const DISALLOW_LIST = Object.freeze([
  "Bash",
  "PowerShell",
  "NotebookEdit",
  "REPL",
  "JavaScript",
  "WebFetch",
]);
export const FEATURE_FLAG = "coworkWebFetchViaApi";
export const FEATURE_KEY = 1978029737;
export const REFUSAL_BLAME = "your WebFetch deny rule (WebFetch)";
export const FORCE_FLAG = "force: true";
export const DISTRIBUTION =
  "Claude desktop app 1.49585.0 (Cowork surface) — prod build, commit timestamp 2026-09-08. Not the npm CLI. Opus. macOS. Anthropic API. Personal Claude Pro.";
export const SESSION_KIND =
  "Cowork sandbox: host-executing Bash/WebFetch withdrawn; mcp__workspace__bash / mcp__workspace__web_fetch substituted; Artifact still on allowed list; read path binds native WebFetch";
export const PHRASE = "Score monstrance or admit viewed.";

export const SANCTUARY_STATIONS = Object.freeze([
  {
    id: "luna",
    survey: "open the luna glass (live artifact should show through)",
    kind: "luna",
    note: "seeded: luna glass is veiled — Artifact read looks for native WebFetch and finds none",
  },
  {
    id: "rays",
    survey: "spread the gilt rays (exposition of the live host)",
    kind: "rays",
    note: "seeded: gilt rays dim — live content is withheld behind a phantom deny",
  },
  {
    id: "host",
    survey: "expose the consecrated host (live artifact body)",
    kind: "host",
    note: "seeded: host withheld — publish to an existing artifact also refused unless force: true",
  },
  {
    id: "sacristy",
    survey: "check the sacristy shelf (mcp__workspace__web_fetch unused)",
    kind: "sacristy",
    note: "seeded: substitute vessel sits unused — 1024 successful mcp__workspace__web_fetch calls elsewhere",
  },
  {
    id: "ribbon",
    survey: "read the phantom DENY ribbon (false accusation)",
    kind: "ribbon",
    note: "seeded: ribbon blames your WebFetch deny rule (WebFetch) though no deny rule exists in any settings file",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "phantom-deny",
  "withheld",
  "native-webfetch",
  "mcp-substitute",
  "deny-rule-absent",
  "later-session-refuse",
  "force-true",
  "host-withdrawn",
]);

export const COUSINS = Object.freeze([
  {
    issue: 89786,
    title:
      "Agent session cannot publish to a co-written Artifact after a colleague self-publishes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Artifact version-conflict after self-publish; do not rebuild",
  },
  {
    issue: 89990,
    title:
      "Artifact publish: identical content already refused ... resent unchanged for content whose hash changed",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — false identical-content gate; do not rebuild",
  },
  {
    issue: 90468,
    title:
      "Artifact publish stuck in a loop refusing content as identical to a previously refused version",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — publish-refusal loop; do not rebuild",
  },
  {
    issue: 89793,
    title:
      "Artifact publish permanently refused as resent unchanged after a viewed-check rejection",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — viewed-check then resent-unchanged; do not rebuild",
  },
  {
    issue: 91126,
    title:
      "Artifact tool became disabled mid-session; previously published Artifact URLs return Page not found",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Artifact disabled mid-session; do not rebuild",
  },
  {
    issue: 87734,
    title:
      "Artifact publish auto-arms a Monitor whose stop surfaces despite quietLifecycle/ambient",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — auto-armed Monitor; do not rebuild",
  },
  {
    issue: 87962,
    title:
      "Artifact live-update monitor persists indefinitely in scheduled-task sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — monitor_ws linger; do not rebuild",
  },
  {
    issue: 93005,
    title:
      "Artifact iframe missing microphone in allow attribute — getUserMedia always NotAllowedError",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — iframe allow microphone; do not rebuild",
  },
  {
    issue: 92740,
    title: "Imprimatur — Artifact approval under Skip-all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only paradigm cousin — already shipped Imprimatur; do not re-ship",
  },
  {
    issue: 92833,
    title: "Ukase — mcp__workspace__bash permission",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only paradigm cousin — already shipped Ukase; do not re-ship",
  },
  {
    issue: 92426,
    title: "Understudy — miscast substitute",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only paradigm cousin — already shipped Understudy; do not re-ship",
  },
  {
    issue: 90755,
    title: "Fetch — keyed reply",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only paradigm cousin — already shipped Fetch; do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93530, title: "Esc kills an unrelated background subagent irrecoverably", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93556, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93553, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93544, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93439, title: "Binary Read skips PreToolUse", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93438, title: "Worktree cwd bleed", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93475, title: "Effort selector needs a very tall terminal", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93534, title: "Desktop Code tab: long unsent prompt disappears during composition", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93508, title: "Documents preview_start TCC getcwd deny", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93532, title: "Documents-folder permission is lost on every embedded CLI auto-update", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "priory",
  "imprimatur",
  "understudy",
  "fetch",
]);

export function inspectLuna(input = {}) {
  const veiled =
    input.nativeWebfetchMissing === true ||
    input.lunaVeiled === true ||
    input.event === "luna-veiled" ||
    input.event === "native-webfetch" ||
    (input.withheld === true && input.viewed !== true);
  return {
    veiled,
    stamp: veiled ? "veiled" : "clear",
    note: veiled
      ? "luna glass veiled — Artifact read looks for native WebFetch and finds none"
      : "luna glass clear — live artifact readable via the fetch Cowork actually provides",
  };
}

export function inspectRays(input = {}) {
  const dim =
    input.withheld === true ||
    input.event === "withheld" ||
    input.hostWithdrawn === true ||
    (input.nativeWebfetchMissing === true && input.viewed !== true);
  return {
    dim,
    stamp: dim ? "dim" : "gilt",
    note: dim
      ? "gilt rays dim — live content is withheld behind a phantom deny"
      : "gilt rays shining — exposition of the live host",
  };
}

export function inspectHost(input = {}) {
  const occulted =
    input.withheld === true ||
    input.laterSessionRefuse === true ||
    input.event === "later-session-refuse" ||
    input.event === "withheld" ||
    (input.artifactReadRefused === true && input.viewed !== true);
  return {
    occulted,
    stamp: occulted ? "withheld" : "exposed",
    note: occulted
      ? "host withheld — publish to an existing artifact also refused unless force: true"
      : "host exposed — live artifact body readable; publish proceeds without force: true",
  };
}

export function inspectSacristy(input = {}) {
  const unused =
    input.mcpSubstituteUnused === true ||
    input.event === "sacristy-unused" ||
    input.event === "mcp-substitute" ||
    (input.withheld === true &&
      input.viewed !== true &&
      input.mcpSubstituteUsed !== true);
  return {
    unused,
    stamp: unused ? "unused" : "in-use",
    note: unused
      ? "sacristy shelf unused — mcp__workspace__web_fetch sits idle while Artifact hunts native WebFetch"
      : "sacristy vessel in use — Artifact read routed through mcp__workspace__web_fetch",
  };
}

export function inspectRibbon(input = {}) {
  const accused =
    input.phantomDeny === true ||
    input.event === "phantom-deny" ||
    input.event === "phantom-ribbon" ||
    input.event === "deny-rule-absent" ||
    (input.denyRuleAbsent === true && input.viewed !== true);
  return {
    accused,
    stamp: accused ? "deny" : "honest",
    note: accused
      ? "phantom DENY ribbon — blames your WebFetch deny rule (WebFetch) though no deny rule exists"
      : "no ribbon — when a tool is genuinely unavailable the error does not invent a deny rule",
  };
}

export function readSanctuary(input = {}) {
  const luna = inspectLuna(input);
  const rays = inspectRays(input);
  const host = inspectHost(input);
  const sacristy = inspectSacristy(input);
  const ribbon = inspectRibbon(input);
  const withheld =
    host.stamp === "withheld" ||
    luna.stamp === "veiled" ||
    ribbon.stamp === "deny" ||
    input.withheld === true;
  const viewed =
    input.viewed === true &&
    withheld !== true &&
    luna.stamp === "clear" &&
    host.stamp === "exposed";
  const phantomDeny = ribbon.stamp === "deny" || input.phantomDeny === true;
  return {
    luna,
    rays,
    host,
    sacristy,
    ribbon,
    stations: SANCTUARY_STATIONS,
    withheld: withheld && !viewed && !phantomDeny,
    viewed:
      viewed ||
      (luna.stamp === "clear" &&
        host.stamp === "exposed" &&
        input.withheld !== true &&
        input.phantomDeny !== true),
    phantomDeny: phantomDeny && !viewed,
    mark:
      phantomDeny && !viewed
        ? "phantom-deny"
        : withheld && !viewed
          ? "withheld"
          : "viewed",
  };
}

/**
 * Published monstrance walk from #93563 only. Facts from the issue text.
 * A viewed booth reads the live artifact via the fetch Cowork actually
 * provides. A withheld booth hunts native WebFetch and veils the host.
 * A phantom-deny booth only accuses a deny rule that does not exist.
 */
export const MONSTRANCE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-viewed",
    viewed: true,
    withheld: false,
    mcpSubstituteUsed: true,
    artifactRead: true,
    cue: "viewed",
    note: "idle HOLD: honest path — live artifact readable via the fetch Cowork actually provides",
  },
  {
    t: "withdraw",
    event: "host-withdrawn",
    withheld: true,
    hostWithdrawn: true,
    cue: "withheld",
    note: "Cowork withdraws native Bash and WebFetch; substitutes mcp workspace tools",
  },
  {
    t: "substitute",
    event: "mcp-substitute",
    withheld: true,
    mcpSubstituteUnused: true,
    hostWithdrawn: true,
    cue: "withheld",
    note: "mcp__workspace__web_fetch is provided and works elsewhere (1024 calls) but Artifact does not use it",
  },
  {
    t: "bind",
    event: "native-webfetch",
    withheld: true,
    nativeWebfetchMissing: true,
    artifactBoundNative: true,
    cue: "withheld",
    note: "Artifact still loads (allowed list) but its read path binds to native WebFetch",
  },
  {
    t: "miss",
    event: "luna-veiled",
    withheld: true,
    lunaVeiled: true,
    nativeWebfetchMissing: true,
    cue: "withheld",
    note: "native WebFetch no longer exists in the session; luna glass is veiled",
  },
  {
    t: "ribbon",
    event: "phantom-deny",
    withheld: true,
    phantomDeny: true,
    denyRuleAbsent: true,
    cue: "withheld",
    note: "refusal blames your WebFetch deny rule (WebFetch) even when no deny rule exists",
  },
  {
    t: "host",
    event: "withheld",
    withheld: true,
    artifactReadRefused: true,
    cue: "withheld",
    note: "live content was withheld here by your WebFetch deny rule (WebFetch)",
  },
  {
    t: "later",
    event: "later-session-refuse",
    withheld: true,
    laterSessionRefuse: true,
    cue: "withheld",
    note: "a later Cowork session cannot read an artifact it did not create",
  },
  {
    t: "force",
    event: "force-true",
    withheld: true,
    forceTrue: true,
    laterSessionRefuse: true,
    cue: "withheld",
    note: "publish to an existing artifact also refused unless force: true",
  },
  {
    t: "path",
    event: "phantom-deny",
    withheld: true,
    phantomDeny: true,
    denyRuleAbsent: true,
    cue: "withheld",
    note: "phantom-deny — user hunted phantom config; settings files have no WebFetch deny",
  },
  {
    t: "score",
    event: "monstrance",
    withheld: true,
    hostWithdrawn: true,
    nativeWebfetchMissing: true,
    mcpSubstituteUnused: true,
    phantomDeny: true,
    cue: "withheld",
    note: "monstrance — gilt rays around a veiled luna; the real vessel sits unused in the sacristy",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "code",
    event: "code-surface",
    viewed: true,
    codeSurface: true,
    cue: "viewed",
    note: "positive control: Claude Code surface with native WebFetch present — read succeeds",
  },
  {
    t: "route",
    event: "mcp-substitute",
    viewed: true,
    mcpSubstituteUsed: true,
    cue: "viewed",
    note: "positive control: Artifact read routed through mcp__workspace__web_fetch",
  },
  {
    t: "read",
    event: "artifact-read",
    viewed: true,
    artifactRead: true,
    mcpSubstituteUsed: true,
    cue: "viewed",
    note: "positive control: live artifact readable; publish proceeds without force: true",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    viewed: true,
    withheld: false,
    mcpSubstituteUsed: true,
    artifactRead: true,
    cue: "viewed",
  };
}

export function seedViewed() {
  return { ...emptyTicket() };
}

export function seedWithheld() {
  return {
    seed: SEEDED_WORD,
    viewed: false,
    withheld: true,
    hostWithdrawn: true,
    nativeWebfetchMissing: true,
    artifactBoundNative: true,
    mcpSubstituteUnused: true,
    artifactReadRefused: true,
    phantomDeny: true,
    denyRuleAbsent: true,
    cue: "withheld",
    issue: FEATURED_ISSUE,
  };
}

export function seedMonstrance() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    withheld: true,
    hostWithdrawn: true,
    nativeWebfetchMissing: true,
    mcpSubstituteUnused: true,
    phantomDeny: true,
    cue: "withheld",
  };
}

export function seedPhantomDeny() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    withheld: true,
    phantomDeny: true,
    denyRuleAbsent: true,
    cue: "withheld",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    viewed: true,
    cue: "viewed",
  };
}

export function seedNativeBind() {
  return {
    seed: "native-webfetch",
    preferSeed: true,
    nativeWebfetchMissing: true,
    artifactBoundNative: true,
    cue: "withheld",
  };
}

export function seedMcpSubstitute() {
  return {
    seed: "mcp-substitute",
    preferSeed: true,
    mcpSubstituteUnused: true,
    cue: "withheld",
  };
}

export function seedForceTrue() {
  return {
    seed: "force-true",
    preferSeed: true,
    forceTrue: true,
    cue: "withheld",
  };
}

export function seedCreatedSessionOk() {
  return {
    seed: "created-session-ok",
    preferSeed: true,
    createdSessionOk: true,
    cue: "withheld",
  };
}

export function seedLaterSessionRefuse() {
  return {
    seed: "later-session-refuse",
    preferSeed: true,
    laterSessionRefuse: true,
    cue: "withheld",
  };
}

export function seedDenyRuleAbsent() {
  return {
    seed: "deny-rule-absent",
    preferSeed: true,
    denyRuleAbsent: true,
    cue: "withheld",
  };
}

export function seedArtifactRead() {
  return {
    seed: "artifact-read",
    preferSeed: true,
    artifactRead: true,
    cue: "viewed",
  };
}

export function seedArtifactPublish() {
  return {
    seed: "artifact-publish",
    preferSeed: true,
    artifactPublish: true,
    cue: "withheld",
  };
}

export function seedHostWithdrawn() {
  return {
    seed: "host-withdrawn",
    preferSeed: true,
    hostWithdrawn: true,
    cue: "withheld",
  };
}

export function seedLunaVeiled() {
  return {
    seed: "luna-veiled",
    preferSeed: true,
    lunaVeiled: true,
    cue: "withheld",
  };
}

export function seedSacristyUnused() {
  return {
    seed: "sacristy-unused",
    preferSeed: true,
    mcpSubstituteUnused: true,
    cue: "withheld",
  };
}

export function seedPhantomRibbon() {
  return {
    seed: "phantom-ribbon",
    preferSeed: true,
    phantomDeny: true,
    cue: "withheld",
  };
}

export function seedCoworkSurface() {
  return {
    seed: "cowork-surface",
    preferSeed: true,
    coworkSurface: true,
    cue: "withheld",
  };
}

export function seedCodeSurface() {
  return {
    seed: "code-surface",
    preferSeed: true,
    codeSurface: true,
    cue: "viewed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      viewed: false,
      withheld: false,
      phantomDeny: false,
      hostWithdrawn: false,
      nativeWebfetchMissing: false,
      artifactBoundNative: false,
      mcpSubstituteUnused: false,
      mcpSubstituteUsed: false,
      artifactReadRefused: false,
      artifactRead: false,
      artifactPublish: false,
      laterSessionRefuse: false,
      createdSessionOk: false,
      denyRuleAbsent: false,
      forceTrue: false,
      lunaVeiled: false,
      coworkSurface: false,
      codeSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    viewed: raw.viewed === true,
    withheld: raw.withheld === true,
    phantomDeny:
      raw.phantomDeny === true ||
      raw.event === "phantom-deny" ||
      raw.event === "phantom-ribbon",
    hostWithdrawn:
      raw.hostWithdrawn === true || raw.event === "host-withdrawn",
    nativeWebfetchMissing:
      raw.nativeWebfetchMissing === true || raw.event === "native-webfetch",
    artifactBoundNative: raw.artifactBoundNative === true,
    mcpSubstituteUnused:
      raw.mcpSubstituteUnused === true ||
      raw.event === "sacristy-unused" ||
      raw.event === "mcp-substitute",
    mcpSubstituteUsed: raw.mcpSubstituteUsed === true,
    artifactReadRefused: raw.artifactReadRefused === true,
    artifactRead:
      raw.artifactRead === true || raw.event === "artifact-read",
    artifactPublish:
      raw.artifactPublish === true || raw.event === "artifact-publish",
    laterSessionRefuse:
      raw.laterSessionRefuse === true ||
      raw.event === "later-session-refuse",
    createdSessionOk:
      raw.createdSessionOk === true ||
      raw.event === "created-session-ok",
    denyRuleAbsent:
      raw.denyRuleAbsent === true || raw.event === "deny-rule-absent",
    forceTrue: raw.forceTrue === true || raw.event === "force-true",
    lunaVeiled: raw.lunaVeiled === true || raw.event === "luna-veiled",
    coworkSurface:
      raw.coworkSurface === true || raw.event === "cowork-surface",
    codeSurface: raw.codeSurface === true || raw.event === "code-surface",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.viewed != null ||
        ticket.withheld != null ||
        ticket.phantomDeny != null ||
        ticket.hostWithdrawn != null ||
        ticket.nativeWebfetchMissing != null ||
        ticket.artifactBoundNative != null ||
        ticket.mcpSubstituteUnused != null ||
        ticket.mcpSubstituteUsed != null ||
        ticket.artifactReadRefused != null ||
        ticket.artifactRead != null ||
        ticket.laterSessionRefuse != null ||
        ticket.denyRuleAbsent != null ||
        ticket.forceTrue != null ||
        ticket.lunaVeiled != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isViewed(row) {
  if (row.withheld && row.cue !== "viewed") return false;
  if (
    row.cue === "withheld" ||
    row.cue === "monstrance" ||
    row.cue === "phantom-deny"
  ) {
    return false;
  }
  if (
    row.nativeWebfetchMissing &&
    row.artifactBoundNative &&
    row.cue !== "viewed" &&
    row.viewed !== true
  ) {
    return false;
  }
  if (
    row.phantomDeny &&
    row.denyRuleAbsent &&
    row.cue !== "viewed" &&
    row.viewed !== true
  ) {
    return false;
  }
  if (
    row.viewed === true &&
    row.withheld !== true &&
    row.cue !== "withheld"
  ) {
    return true;
  }
  if (
    row.cue === "viewed" &&
    row.withheld !== true &&
    row.nativeWebfetchMissing !== true &&
    row.phantomDeny !== true
  ) {
    return true;
  }
  if (
    (row.mcpSubstituteUsed === true ||
      row.codeSurface === true ||
      row.artifactRead === true) &&
    row.withheld !== true &&
    row.nativeWebfetchMissing !== true &&
    row.phantomDeny !== true &&
    row.artifactReadRefused !== true
  ) {
    return true;
  }
  return false;
}

function isPhantomDenyPath(row) {
  return (
    row.event === "phantom-deny" &&
    !isViewed(row) &&
    (row.phantomDeny === true ||
      row.denyRuleAbsent === true ||
      row.event === "phantom-ribbon")
  );
}

function isWithheld(row) {
  if (isViewed(row)) return false;
  if (isPhantomDenyPath(row) && row.cue !== "withheld") return false;
  if (row.cue === "withheld" || row.cue === "monstrance") return true;
  if (row.withheld === true) return true;
  if (
    row.nativeWebfetchMissing === true &&
    row.artifactBoundNative === true &&
    row.mcpSubstituteUnused === true
  ) {
    return true;
  }
  if (
    row.hostWithdrawn === true &&
    row.artifactReadRefused === true
  ) {
    return true;
  }
  if (
    row.laterSessionRefuse === true ||
    row.lunaVeiled === true ||
    row.phantomDeny === true ||
    (row.hostWithdrawn === true &&
      row.mcpSubstituteUnused === true &&
      row.mcpSubstituteUsed !== true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one sanctuary pass against the monstrance booth.
 * viewed: live artifact readable via the fetch Cowork actually provides.
 * withheld: Artifact hunts native WebFetch; live content withheld.
 * phantom-deny: refusal invents a WebFetch deny rule that does not exist.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPhantomDenyPath(row) ||
    (row.phantomDeny && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "phantom-deny";
  } else if (isWithheld(row)) {
    verdict = "withheld";
  } else if (isViewed(row)) {
    verdict = "viewed";
  } else if (
    row.nativeWebfetchMissing ||
    row.mcpSubstituteUnused ||
    row.hostWithdrawn ||
    (row.artifactReadRefused && !row.mcpSubstituteUsed)
  ) {
    verdict = "withheld";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const luna = inspectLuna(row);
  const rays = inspectRays(row);
  const host = inspectHost(row);
  const sacristy = inspectSacristy(row);
  const ribbon = inspectRibbon(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    viewed: verdict === "viewed" || verdict === "hold",
    withheld:
      verdict === "withheld" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    phantomDeny:
      row.phantomDeny === true ||
      verdict === "phantom-deny" ||
      verdict === PATH_WORD,
    hostWithdrawn: row.hostWithdrawn,
    nativeWebfetchMissing: row.nativeWebfetchMissing,
    artifactBoundNative: row.artifactBoundNative,
    mcpSubstituteUnused: row.mcpSubstituteUnused,
    mcpSubstituteUsed: row.mcpSubstituteUsed,
    artifactReadRefused: row.artifactReadRefused,
    artifactRead: row.artifactRead,
    artifactPublish: row.artifactPublish,
    laterSessionRefuse: row.laterSessionRefuse,
    createdSessionOk: row.createdSessionOk,
    denyRuleAbsent: row.denyRuleAbsent,
    forceTrue: row.forceTrue,
    lunaVeiled: row.lunaVeiled,
    coworkSurface: row.coworkSurface,
    codeSurface: row.codeSurface,
    cue: hold
      ? "viewed"
      : row.phantomDeny || verdict === "phantom-deny"
        ? "phantom-deny"
        : "withheld",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit viewed" : "score monstrance",
    lunaInspect: luna,
    raysInspect: rays,
    hostInspect: host,
    sacristyInspect: sacristy,
    ribbonInspect: ribbon,
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
      : MONSTRANCE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const withheld = scored.filter((row) => row.verdict === "withheld");
  const path = scored.filter((row) => row.verdict === "phantom-deny");
  const viewed = scored.filter((row) => row.verdict === "viewed");
  const headline =
    scored.find((row) => row.event === "withheld") ||
    scored.find((row) => row.event === "phantom-deny") ||
    scored.find((row) => row.event === "native-webfetch") ||
    withheld[withheld.length - 1];
  let verdict = "viewed";
  if (withheld.length) verdict = "withheld";
  else if (path.length && !viewed.length) verdict = "phantom-deny";
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
    withheldCount: withheld.length,
    pathCount: path.length,
    viewedCount: viewed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit viewed" : "score monstrance",
    note: headline
      ? "Claude desktop app 1.49585.0 Cowork surface; host Bash/WebFetch withdrawn; mcp__workspace__web_fetch unused by Artifact; native WebFetch missing; phantom deny rule; later session refuse; force: true."
      : "published monstrance walk scored against viewed vs withheld",
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
    seeded !== "viewed" &&
    seeded !== "withheld" &&
    seeded !== "phantom-deny" &&
    seeded !== "monstrance" &&
    ticket.viewed == null &&
    ticket.withheld == null &&
    ticket.nativeWebfetchMissing == null &&
    ticket.phantomDeny == null &&
    ticket.hostWithdrawn == null &&
    ticket.mcpSubstituteUnused == null &&
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
    viewed: scored.viewed ?? false,
    withheld: scored.withheld ?? false,
    phantomDeny: scored.phantomDeny ?? false,
    hostWithdrawn: scored.hostWithdrawn ?? false,
    nativeWebfetchMissing: scored.nativeWebfetchMissing ?? false,
    artifactBoundNative: scored.artifactBoundNative ?? false,
    mcpSubstituteUnused: scored.mcpSubstituteUnused ?? false,
    mcpSubstituteUsed: scored.mcpSubstituteUsed ?? false,
    artifactReadRefused: scored.artifactReadRefused ?? false,
    artifactRead: scored.artifactRead ?? false,
    laterSessionRefuse: scored.laterSessionRefuse ?? false,
    denyRuleAbsent: scored.denyRuleAbsent ?? false,
    forceTrue: scored.forceTrue ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.nativeWebfetchMissing || result.lunaVeiled || result.withheld
      ? "luna=veiled"
      : "luna=clear",
    result.withheld || result.hostWithdrawn
      ? "rays=dim"
      : "rays=gilt",
    result.withheld || result.laterSessionRefuse || result.artifactReadRefused
      ? "host=withheld"
      : "host=exposed",
    result.mcpSubstituteUnused || result.withheld
      ? "sacristy=unused"
      : "sacristy=in-use",
    result.phantomDeny || result.verdict === "phantom-deny"
      ? "ribbon=deny"
      : "ribbon=honest",
    result.phantomDeny || result.verdict === "phantom-deny"
      ? "path=phantom-deny"
      : "path=viewed",
    result.cue === "viewed"
      ? "cue=viewed"
      : result.cue === "phantom-deny"
        ? "cue=phantom-deny"
        : "cue=withheld",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const sanctuary = readSanctuary({
    viewed: result.viewed,
    withheld: result.withheld,
    phantomDeny: result.phantomDeny,
    hostWithdrawn: result.hostWithdrawn,
    nativeWebfetchMissing: result.nativeWebfetchMissing,
    artifactBoundNative: result.artifactBoundNative,
    mcpSubstituteUnused: result.mcpSubstituteUnused,
    mcpSubstituteUsed: result.mcpSubstituteUsed,
    artifactReadRefused: result.artifactReadRefused,
    laterSessionRefuse: result.laterSessionRefuse,
    denyRuleAbsent: result.denyRuleAbsent,
    lunaVeiled: result.lunaVeiled,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    sanctuary,
    luna: inspectLuna({
      viewed: result.viewed,
      withheld: result.withheld,
      nativeWebfetchMissing: result.nativeWebfetchMissing,
      lunaVeiled: result.lunaVeiled,
    }),
    rays: inspectRays({
      viewed: result.viewed,
      withheld: result.withheld,
      hostWithdrawn: result.hostWithdrawn,
      nativeWebfetchMissing: result.nativeWebfetchMissing,
    }),
    host: inspectHost({
      viewed: result.viewed,
      withheld: result.withheld,
      laterSessionRefuse: result.laterSessionRefuse,
      artifactReadRefused: result.artifactReadRefused,
    }),
    sacristy: inspectSacristy({
      viewed: result.viewed,
      withheld: result.withheld,
      mcpSubstituteUnused: result.mcpSubstituteUnused,
      mcpSubstituteUsed: result.mcpSubstituteUsed,
    }),
    ribbon: inspectRibbon({
      viewed: result.viewed,
      withheld: result.withheld,
      phantomDeny: result.phantomDeny,
      denyRuleAbsent: result.denyRuleAbsent,
    }),
    stations: SANCTUARY_STATIONS.map((row) => ({
      ...row,
      withheld: result.withheld === true || result.verdict === "withheld",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      os: OS,
      client: CLIENT,
      desktopBuild: DESKTOP_BUILD,
      commitStamp: COMMIT_STAMP,
      model: MODEL,
      platform: PLATFORM,
      nativeBash: NATIVE_BASH,
      nativeWebfetch: NATIVE_WEBFETCH,
      mcpBash: MCP_BASH,
      mcpWebFetchCount: MCP_WEB_FETCH_COUNT,
      websearchCount: WEBSEARCH_COUNT,
      readCount: READ_COUNT,
      artifactCount: ARTIFACT_COUNT,
      mcpWebFetch: MCP_WEB_FETCH,
      mcpBashTool: MCP_BASH_TOOL,
      disallowList: [...DISALLOW_LIST],
      featureFlag: FEATURE_FLAG,
      featureKey: FEATURE_KEY,
      refusalBlame: REFUSAL_BLAME,
      forceFlag: FORCE_FLAG,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: SANCTUARY_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "Artifact should read the live artifact via the fetch capability Cowork actually provides (mcp__workspace__web_fetch)",
        "publish should proceed normally without force: true — the same way it works on the Claude Code surface",
        "when a tool genuinely is unavailable, the error should not attribute it to a user-configured deny rule that does not exist",
      ],
      hypothesis:
        "NON-BINDING: Cowork disallow list includes WebFetch; Artifact still wired to native WebFetch; absence is surfaced as a user deny rule. Verify against #93563 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
