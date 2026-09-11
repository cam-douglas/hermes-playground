#!/usr/bin/env node
/**
 * Attainder — parchment bill-of-attainder / court-of-attainder booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Parked-permission retirement always stamps toolDenialKind:
 * "user-rejected", even when the actual cause is an internal session
 * reset (e.g. after /mcp reconnect), not a real user action. No
 * permission prompt appeared. The user did not Esc/Ctrl+C. The tool
 * was already in settings.json permissions.allow.
 *
 *   node attainder.mjs data/attainted.json
 *   echo '{"seed":"attainted"}' | node attainder.mjs
 *
 * Idle word is untainted (HOLD: honest path when a real user
 * rejection of a shown prompt is correctly labeled).
 * Seeded word is attainted (#93529: false user-rejected stamp from
 * parked-permission retirement after internal session reset).
 * Path word is retire-parked.
 * Product score word is attainder (score attainder or admit
 * untainted).
 *
 * Encoded from anthropics/claude-code#93529 issue text only.
 * Hypothesis (NON-BINDING): session-reset path md() may abort
 * abortController and, unless retireParkedPermission:false, call
 * resume/retirement Lo() with default reason "interrupt"; inside
 * retirement, toolDenialKind / non_execution_kind is hardcoded to
 * "user-rejected" with a fixed denial string even when the reason
 * was an internal interrupt/session reset. The already-computed
 * outcome (retired_unanswered / retire_superseded /
 * retire_write_failed) is discarded for the denial kind. Verify
 * against #93529 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "hold",
  "allow-listed",
  "no-prompt",
  "no-keypress",
  "session-reset",
  "parked-permission",
  "control-response",
  "default-interrupt",
  "hardcoded-denial",
  "user-rejected-stamp",
  "mcp-reconnect",
  "sublime-batch",
  "retire-parked-false",
  "honest-outcome",
  "genuine-no",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "untainted";
export const PATH_WORD = "retire-parked";
export const SEEDED_WORD = "attainted";
export const PRODUCT_WORD = "attainder";
export const HOLD = Object.freeze(["untainted", "hold"]);
export const RECOVER = Object.freeze(["untainted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "sealed",
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
    (name) => name !== "attainted" && name !== "attainder",
  ),
);

export const FEATURED_ISSUE = 93529;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93529";
export const TITLE =
  'Parked-permission "retirement" always stamps toolDenialKind:"user-rejected", even when the actual cause is an internal session reset (e.g. after /mcp reconnect), not a real user action';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tools",
  "area:core",
  "area:mcp",
]);
export const AUTHOR = "dpc00";
export const FILED = "2026-09-11T03:45:10Z";
export const CLAUDE_CODE_VERSION = "2.1.268";
export const OS = "Windows x64";
export const CLIENT = "claude.exe native Windows x64";
export const DISTRIBUTION =
  "native/Bun-compiled claude.exe; @anthropic-ai/claude-code npm package is a thin installer fetching @anthropic-ai/claude-code-win32-x64";
export const SESSION_KIND =
  "native Windows x64; parked-permission retirement after /mcp reconnect; mcp__sublime-mcp__batch; zero visible prompt";
export const TOOL_NAME = "mcp__sublime-mcp__batch";
export const MCP_RECONNECT_SERVER = "github";
export const DENIAL_KIND = "user-rejected";
export const DENIAL_STRING =
  "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.";
export const DEFAULT_REASON = "interrupt";
export const RESET_FN = "md()";
export const RETIRE_FN = "Lo()";
export const RETIREMENT_FN = "Uu()";
export const RETIRE_FLAG = "retireParkedPermission:false";
export const AWAITING = "control_response";
export const PHRASE =
  "when parked-permission retirement after an internal session reset stamps toolDenialKind user-rejected with no prompt and no keypress, score attainder or admit untainted.";

export const COURT_STATIONS = Object.freeze([
  {
    id: "roll",
    survey: "unroll the bill (allow-list / no prompt)",
    kind: "roll",
    note: "seeded: tool already in settings.json permissions.allow; no permission prompt appeared",
  },
  {
    id: "desk",
    survey: "read the clerk desk (parked permission)",
    kind: "desk",
    note: "seeded: internal parked-permission state machine tracks a tool awaiting control_response",
  },
  {
    id: "stamp",
    survey: "lower the iron stamp (session-reset retirement)",
    kind: "stamp",
    note: "seeded: md() aborts abortController and, unless retireParkedPermission:false, calls Lo() with default reason interrupt",
  },
  {
    id: "seal",
    survey: "read the wax seal (user-rejected stamp)",
    kind: "seal",
    note: "seeded: retirement hardcodes toolDenialKind / non_execution_kind to user-rejected with a fixed denial string",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "retire-parked",
  "attainted",
  "allow-listed",
  "no-prompt",
  "no-keypress",
  "session-reset",
  "hardcoded-denial",
  "user-rejected-stamp",
]);

export const COUSINS = Object.freeze([
  {
    issue: 86001,
    title:
      "mid-execution interrupt reuses the denial wording; user DID interrupt",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — mid-execution interrupt wrong label; user DID interrupt; do not rebuild",
  },
  {
    issue: 51674,
    title:
      "same symptom and /mcp reconnect workaround; closed not_planned; root cause unknown",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed not_planned, same symptom/workaround, root cause unknown; this report is the follow-up; do not rebuild",
  },
  {
    issue: 47282,
    title: "earlier wording problem; stale-closed and locked",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — earlier wording problem, stale-closed; do not rebuild",
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
    issue: 93507,
    title: "Cowork egress allowlist regression",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93512,
    title: "Cowork egress allowlist regression (sibling)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export function inspectRoll(input = {}) {
  const allowListed =
    input.allowListed === true ||
    input.event === "allow-listed" ||
    (input.attainted === true && input.untainted !== true);
  const noPrompt =
    input.noPrompt === true ||
    input.event === "no-prompt" ||
    (input.attainted === true && input.promptShown !== true);
  return {
    allowListed,
    noPrompt,
    stamp: allowListed || noPrompt ? "rolled" : "blank",
    note:
      allowListed || noPrompt
        ? "bill unrolled — tool already in permissions.allow; no permission prompt appeared"
        : "no allow-list / no-prompt stand on this roll",
  };
}

export function inspectDesk(input = {}) {
  const parked =
    input.parkedPermission === true ||
    input.awaitingControl === true ||
    input.event === "parked-permission" ||
    input.event === "control-response" ||
    (input.attainted === true && input.untainted !== true);
  return {
    parked,
    stamp: parked ? "parked" : "clear",
    note: parked
      ? "clerk desk holds a parked permission awaiting control_response"
      : "clerk desk is clear — no parked permission on the blotter",
  };
}

export function inspectReset(input = {}) {
  const reset =
    input.sessionReset === true ||
    input.mcpReconnect === true ||
    input.event === "session-reset" ||
    input.event === "mcp-reconnect" ||
    (input.attainted === true && input.untainted !== true);
  return {
    reset,
    stamp: reset ? "reset" : "steady",
    note: reset
      ? "session-reset path md() aborted abortController after /mcp reconnect"
      : "no internal session reset on this docket",
  };
}

export function inspectStamp(input = {}) {
  const lowered =
    input.defaultInterrupt === true ||
    input.retireParked === true ||
    input.event === "default-interrupt" ||
    input.event === "retire-parked" ||
    (input.attainted === true && input.untainted !== true);
  return {
    lowered,
    stamp: lowered ? "interrupt" : "honest",
    note: lowered
      ? "iron stamp lowered — Lo() called with default reason interrupt unless retireParkedPermission:false"
      : "iron stamp stays honest — no default-interrupt retirement",
  };
}

export function inspectSeal(input = {}) {
  const falseStamp =
    input.hardcodedDenial === true ||
    input.userRejectedStamp === true ||
    input.event === "hardcoded-denial" ||
    input.event === "user-rejected-stamp" ||
    (input.attainted === true && input.untainted !== true);
  const genuine =
    input.genuineNo === true ||
    input.event === "genuine-no" ||
    (input.untainted === true &&
      input.promptShown === true &&
      input.attainted !== true);
  return {
    falseStamp: falseStamp && !genuine,
    genuine: genuine && !falseStamp,
    stamp: falseStamp && !genuine ? "attainted" : "untainted",
    note:
      falseStamp && !genuine
        ? "wax seal attainted — toolDenialKind hardcoded user-rejected with no prompt and no keypress"
        : "wax seal untainted — user-rejected reserved for a genuine prompt no",
  };
}

export function readCourt(input = {}) {
  const roll = inspectRoll(input);
  const desk = inspectDesk(input);
  const reset = inspectReset(input);
  const stamp = inspectStamp(input);
  const seal = inspectSeal(input);
  const attainted =
    seal.stamp === "attainted" ||
    stamp.stamp === "interrupt" ||
    input.attainted === true;
  const untainted =
    input.untainted === true &&
    attainted !== true &&
    seal.stamp === "untainted" &&
    stamp.stamp === "honest";
  return {
    roll,
    desk,
    reset,
    stamp,
    seal,
    stations: COURT_STATIONS,
    attainted: attainted && !untainted,
    untainted:
      untainted ||
      (seal.stamp === "untainted" &&
        stamp.stamp === "honest" &&
        input.attainted !== true),
    mark: attainted && !untainted ? "attainted" : "untainted",
  };
}

/**
 * Published attainder walk from #93529 only. Facts from the issue text.
 * An untainted booth reserves user-rejected for a genuine prompt "no".
 * An attainted booth stamps user-rejected after parked-permission
 * retirement from an internal session reset with no prompt and no
 * keypress.
 */
export const ATTAINDER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-untainted",
    untainted: true,
    attainted: false,
    promptShown: true,
    genuineNo: true,
    noPrompt: false,
    noKeypress: false,
    cue: "untainted",
    note: "idle HOLD: honest path when a real user rejection of a shown prompt is correctly labeled",
  },
  {
    t: "roll",
    event: "allow-listed",
    attainted: true,
    allowListed: true,
    cue: "attainted",
    note: "tool already in settings.json permissions.allow",
  },
  {
    t: "desk",
    event: "no-prompt",
    attainted: true,
    noPrompt: true,
    allowListed: true,
    cue: "attainted",
    note: "no permission prompt appeared — confirmed directly with the user",
  },
  {
    t: "clerk",
    event: "no-keypress",
    attainted: true,
    noKeypress: true,
    cue: "attainted",
    note: "user did not press Esc, Ctrl+C, or otherwise interrupt anything",
  },
  {
    t: "reconnect",
    event: "mcp-reconnect",
    attainted: true,
    mcpReconnect: true,
    cue: "attainted",
    note: "/mcp reconnect of an unrelated github server for an auth token fix",
  },
  {
    t: "reset",
    event: "session-reset",
    attainted: true,
    sessionReset: true,
    mcpReconnect: true,
    cue: "attainted",
    note: "session-reset path md() aborts abortController",
  },
  {
    t: "parked",
    event: "parked-permission",
    attainted: true,
    parkedPermission: true,
    awaitingControl: true,
    cue: "attainted",
    note: "parked-permission state machine tracks a tool awaiting control_response",
  },
  {
    t: "iron",
    event: "default-interrupt",
    attainted: true,
    defaultInterrupt: true,
    retireParked: true,
    cue: "attainted",
    note: "unless retireParkedPermission:false, Lo() is called with default reason interrupt",
  },
  {
    t: "wax",
    event: "hardcoded-denial",
    attainted: true,
    hardcodedDenial: true,
    userRejectedStamp: true,
    cue: "attainted",
    note: "Uu() hardcodes toolDenialKind / non_execution_kind to user-rejected with the fixed denial string",
  },
  {
    t: "path",
    event: "retire-parked",
    attainted: true,
    retireParked: true,
    sessionReset: true,
    parkedPermission: true,
    hardcodedDenial: true,
    cue: "attainted",
    note: "retire-parked — parked-permission retirement after internal session reset stamps user-rejected",
  },
  {
    t: "score",
    event: "attainder",
    attainted: true,
    allowListed: true,
    noPrompt: true,
    noKeypress: true,
    sessionReset: true,
    parkedPermission: true,
    defaultInterrupt: true,
    hardcodedDenial: true,
    userRejectedStamp: true,
    mcpReconnect: true,
    sublimeBatch: true,
    cue: "attainted",
    note: "attainder — wax seal attainted after parked-permission retirement; no prompt and no keypress",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "prompt",
    event: "genuine-no",
    untainted: true,
    promptShown: true,
    genuineNo: true,
    cue: "untainted",
    note: "positive control: a permission prompt was shown and the user answered no — user-rejected is honest",
  },
  {
    t: "honest",
    event: "honest-outcome",
    untainted: true,
    honestOutcome: true,
    promptShown: true,
    genuineNo: true,
    cue: "untainted",
    note: "positive control: reserve user-rejected for a genuine prompt no; other paths keep an honest outcome",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    untainted: true,
    attainted: false,
    promptShown: true,
    genuineNo: true,
    noPrompt: false,
    noKeypress: false,
    cue: "untainted",
  };
}

export function seedUntainted() {
  return { ...emptyTicket() };
}

export function seedAttainted() {
  return {
    seed: SEEDED_WORD,
    untainted: false,
    attainted: true,
    allowListed: true,
    noPrompt: true,
    noKeypress: true,
    sessionReset: true,
    parkedPermission: true,
    awaitingControl: true,
    defaultInterrupt: true,
    retireParked: true,
    hardcodedDenial: true,
    userRejectedStamp: true,
    mcpReconnect: true,
    sublimeBatch: true,
    cue: "attainted",
    issue: FEATURED_ISSUE,
  };
}

export function seedAttainder() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    attainted: true,
    allowListed: true,
    noPrompt: true,
    noKeypress: true,
    sessionReset: true,
    parkedPermission: true,
    hardcodedDenial: true,
    cue: "attainted",
  };
}

export function seedRetireParked() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    attainted: true,
    retireParked: true,
    sessionReset: true,
    parkedPermission: true,
    hardcodedDenial: true,
    cue: "attainted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    untainted: true,
    cue: "untainted",
  };
}

export function seedAllowListed() {
  return {
    seed: "allow-listed",
    preferSeed: true,
    allowListed: true,
    cue: "attainted",
  };
}

export function seedNoPrompt() {
  return {
    seed: "no-prompt",
    preferSeed: true,
    noPrompt: true,
    cue: "attainted",
  };
}

export function seedNoKeypress() {
  return {
    seed: "no-keypress",
    preferSeed: true,
    noKeypress: true,
    cue: "attainted",
  };
}

export function seedSessionReset() {
  return {
    seed: "session-reset",
    preferSeed: true,
    sessionReset: true,
    cue: "attainted",
  };
}

export function seedParkedPermission() {
  return {
    seed: "parked-permission",
    preferSeed: true,
    parkedPermission: true,
    cue: "attainted",
  };
}

export function seedControlResponse() {
  return {
    seed: "control-response",
    preferSeed: true,
    awaitingControl: true,
    cue: "attainted",
  };
}

export function seedDefaultInterrupt() {
  return {
    seed: "default-interrupt",
    preferSeed: true,
    defaultInterrupt: true,
    cue: "attainted",
  };
}

export function seedHardcodedDenial() {
  return {
    seed: "hardcoded-denial",
    preferSeed: true,
    hardcodedDenial: true,
    cue: "attainted",
  };
}

export function seedUserRejectedStamp() {
  return {
    seed: "user-rejected-stamp",
    preferSeed: true,
    userRejectedStamp: true,
    cue: "attainted",
  };
}

export function seedMcpReconnect() {
  return {
    seed: "mcp-reconnect",
    preferSeed: true,
    mcpReconnect: true,
    cue: "attainted",
  };
}

export function seedSublimeBatch() {
  return {
    seed: "sublime-batch",
    preferSeed: true,
    sublimeBatch: true,
    cue: "attainted",
  };
}

export function seedRetireParkedFalse() {
  return {
    seed: "retire-parked-false",
    preferSeed: true,
    retireParkedFalse: true,
    cue: "attainted",
  };
}

export function seedHonestOutcome() {
  return {
    seed: "honest-outcome",
    preferSeed: true,
    honestOutcome: true,
    cue: "untainted",
  };
}

export function seedGenuineNo() {
  return {
    seed: "genuine-no",
    preferSeed: true,
    genuineNo: true,
    promptShown: true,
    cue: "untainted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      untainted: false,
      attainted: false,
      allowListed: false,
      noPrompt: false,
      noKeypress: false,
      sessionReset: false,
      parkedPermission: false,
      awaitingControl: false,
      defaultInterrupt: false,
      retireParked: false,
      hardcodedDenial: false,
      userRejectedStamp: false,
      mcpReconnect: false,
      sublimeBatch: false,
      retireParkedFalse: false,
      honestOutcome: false,
      genuineNo: false,
      promptShown: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    untainted: raw.untainted === true,
    attainted: raw.attainted === true,
    allowListed:
      raw.allowListed === true || raw.event === "allow-listed",
    noPrompt: raw.noPrompt === true || raw.event === "no-prompt",
    noKeypress: raw.noKeypress === true || raw.event === "no-keypress",
    sessionReset:
      raw.sessionReset === true || raw.event === "session-reset",
    parkedPermission:
      raw.parkedPermission === true ||
      raw.event === "parked-permission",
    awaitingControl:
      raw.awaitingControl === true ||
      raw.event === "control-response",
    defaultInterrupt:
      raw.defaultInterrupt === true ||
      raw.event === "default-interrupt",
    retireParked:
      raw.retireParked === true || raw.event === "retire-parked",
    hardcodedDenial:
      raw.hardcodedDenial === true ||
      raw.event === "hardcoded-denial",
    userRejectedStamp:
      raw.userRejectedStamp === true ||
      raw.event === "user-rejected-stamp" ||
      raw.toolDenialKind === DENIAL_KIND,
    mcpReconnect:
      raw.mcpReconnect === true || raw.event === "mcp-reconnect",
    sublimeBatch:
      raw.sublimeBatch === true || raw.event === "sublime-batch",
    retireParkedFalse:
      raw.retireParkedFalse === true ||
      raw.event === "retire-parked-false",
    honestOutcome:
      raw.honestOutcome === true || raw.event === "honest-outcome",
    genuineNo: raw.genuineNo === true || raw.event === "genuine-no",
    promptShown: raw.promptShown === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.untainted != null ||
        ticket.attainted != null ||
        ticket.allowListed != null ||
        ticket.noPrompt != null ||
        ticket.noKeypress != null ||
        ticket.sessionReset != null ||
        ticket.parkedPermission != null ||
        ticket.hardcodedDenial != null ||
        ticket.userRejectedStamp != null ||
        ticket.mcpReconnect != null ||
        ticket.genuineNo != null ||
        ticket.promptShown != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isUntainted(row) {
  if (row.attainted && row.cue !== "untainted") return false;
  if (
    row.cue === "attainted" ||
    row.cue === "attainder" ||
    row.cue === "retire-parked"
  ) {
    return false;
  }
  if (
    row.hardcodedDenial &&
    row.cue !== "untainted" &&
    row.untainted !== true &&
    row.genuineNo !== true
  ) {
    return false;
  }
  if (
    row.userRejectedStamp &&
    row.cue !== "untainted" &&
    row.untainted !== true &&
    row.genuineNo !== true &&
    row.promptShown !== true
  ) {
    return false;
  }
  if (
    row.untainted === true &&
    row.attainted !== true &&
    row.cue !== "attainted"
  ) {
    return true;
  }
  if (
    row.cue === "untainted" &&
    row.attainted !== true &&
    row.hardcodedDenial !== true
  ) {
    return true;
  }
  if (
    (row.genuineNo === true || row.honestOutcome === true) &&
    row.attainted !== true &&
    row.hardcodedDenial !== true &&
    row.userRejectedStamp !== true
  ) {
    return true;
  }
  if (
    row.promptShown === true &&
    row.genuineNo === true &&
    row.attainted !== true &&
    row.noPrompt !== true
  ) {
    return true;
  }
  return false;
}

function isAttainted(row) {
  if (isUntainted(row)) return false;
  if (row.cue === "attainted" || row.cue === "attainder") return true;
  if (row.attainted === true) return true;
  if (
    row.hardcodedDenial === true ||
    row.userRejectedStamp === true ||
    row.retireParked === true ||
    (row.noPrompt === true &&
      row.sessionReset === true &&
      row.parkedPermission === true)
  ) {
    return true;
  }
  return false;
}

function isRetireParkedPath(row) {
  return (
    row.event === "retire-parked" &&
    !isUntainted(row) &&
    (row.attainted === true ||
      row.retireParked === true ||
      row.parkedPermission === true)
  );
}

/**
 * Score one court pass against the attainder booth.
 * untainted: a real user rejection of a shown prompt is correctly
 * labeled user-rejected.
 * attainted: parked-permission retirement after an internal session
 * reset stamps toolDenialKind user-rejected with no prompt and no
 * keypress.
 * retire-parked: named path — retirement after session reset.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isRetireParkedPath(row) ||
    (row.retireParked && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "retire-parked";
  } else if (isAttainted(row)) {
    verdict = "attainted";
  } else if (isUntainted(row)) {
    verdict = "untainted";
  } else if (
    row.hardcodedDenial ||
    row.userRejectedStamp ||
    row.retireParked ||
    (row.noPrompt && row.sessionReset)
  ) {
    verdict = "attainted";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const roll = inspectRoll(row);
  const desk = inspectDesk(row);
  const reset = inspectReset(row);
  const stamp = inspectStamp(row);
  const seal = inspectSeal(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    untainted: verdict === "untainted" || verdict === "hold",
    attainted:
      verdict === "attainted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    retireParked:
      row.retireParked === true ||
      verdict === "retire-parked" ||
      verdict === PATH_WORD,
    allowListed: row.allowListed,
    noPrompt: row.noPrompt,
    noKeypress: row.noKeypress,
    sessionReset: row.sessionReset,
    parkedPermission: row.parkedPermission,
    awaitingControl: row.awaitingControl,
    defaultInterrupt: row.defaultInterrupt,
    hardcodedDenial: row.hardcodedDenial,
    userRejectedStamp: row.userRejectedStamp,
    mcpReconnect: row.mcpReconnect,
    sublimeBatch: row.sublimeBatch,
    retireParkedFalse: row.retireParkedFalse,
    honestOutcome: row.honestOutcome,
    genuineNo: row.genuineNo,
    promptShown: row.promptShown,
    cue: hold ? "untainted" : "attainted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit untainted" : "score attainder",
    rollInspect: roll,
    deskInspect: desk,
    resetInspect: reset,
    stampInspect: stamp,
    sealInspect: seal,
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
      : ATTAINDER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const attainted = scored.filter((row) => row.verdict === "attainted");
  const path = scored.filter((row) => row.verdict === "retire-parked");
  const untainted = scored.filter((row) => row.verdict === "untainted");
  const headline =
    scored.find((row) => row.event === "hardcoded-denial") ||
    scored.find((row) => row.event === "retire-parked") ||
    scored.find((row) => row.event === "session-reset") ||
    attainted[attainted.length - 1];
  let verdict = "untainted";
  if (attainted.length) verdict = "attainted";
  else if (path.length && !untainted.length) verdict = "retire-parked";
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
    attaintedCount: attainted.length,
    pathCount: path.length,
    untaintedCount: untainted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit untainted" : "score attainder",
    note: headline
      ? "claude.exe v2.1.268 native Windows x64; parked-permission retirement after /mcp reconnect; mcp__sublime-mcp__batch; tool already in permissions.allow; no prompt; no Esc/Ctrl+C; md() → Lo(interrupt) → Uu() stamps toolDenialKind user-rejected."
      : "published attainder walk scored against untainted vs attainted",
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
    seeded !== "untainted" &&
    seeded !== "attainted" &&
    seeded !== "retire-parked" &&
    seeded !== "attainder" &&
    ticket.untainted == null &&
    ticket.attainted == null &&
    ticket.allowListed == null &&
    ticket.noPrompt == null &&
    ticket.sessionReset == null &&
    ticket.parkedPermission == null &&
    ticket.hardcodedDenial == null &&
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
    untainted: scored.untainted ?? false,
    attainted: scored.attainted ?? false,
    retireParked: scored.retireParked ?? false,
    allowListed: scored.allowListed ?? false,
    noPrompt: scored.noPrompt ?? false,
    noKeypress: scored.noKeypress ?? false,
    sessionReset: scored.sessionReset ?? false,
    parkedPermission: scored.parkedPermission ?? false,
    hardcodedDenial: scored.hardcodedDenial ?? false,
    userRejectedStamp: scored.userRejectedStamp ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.allowListed || result.noPrompt ? "roll=allow" : "roll=blank",
    result.parkedPermission || result.awaitingControl
      ? "desk=parked"
      : "desk=clear",
    result.sessionReset || result.mcpReconnect ? "reset=md" : "reset=steady",
    result.defaultInterrupt || result.retireParked
      ? "stamp=interrupt"
      : "stamp=honest",
    result.hardcodedDenial || result.userRejectedStamp || result.attainted
      ? "seal=user-rejected"
      : "seal=genuine-no",
    result.retireParked || result.verdict === "retire-parked"
      ? "path=retire-parked"
      : "path=untainted",
    result.cue === "untainted" ? "cue=untainted" : "cue=attainted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const court = readCourt({
    untainted: result.untainted,
    attainted: result.attainted,
    allowListed: result.allowListed,
    noPrompt: result.noPrompt,
    noKeypress: result.noKeypress,
    sessionReset: result.sessionReset,
    parkedPermission: result.parkedPermission,
    awaitingControl: result.awaitingControl,
    defaultInterrupt: result.defaultInterrupt,
    retireParked: result.retireParked,
    hardcodedDenial: result.hardcodedDenial,
    userRejectedStamp: result.userRejectedStamp,
    mcpReconnect: result.mcpReconnect,
    genuineNo: result.genuineNo,
    promptShown: result.promptShown,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    court,
    roll: inspectRoll({
      untainted: result.untainted,
      attainted: result.attainted,
      allowListed: result.allowListed,
      noPrompt: result.noPrompt,
    }),
    desk: inspectDesk({
      untainted: result.untainted,
      attainted: result.attainted,
      parkedPermission: result.parkedPermission,
      awaitingControl: result.awaitingControl,
    }),
    reset: inspectReset({
      untainted: result.untainted,
      attainted: result.attainted,
      sessionReset: result.sessionReset,
      mcpReconnect: result.mcpReconnect,
    }),
    stamp: inspectStamp({
      untainted: result.untainted,
      attainted: result.attainted,
      defaultInterrupt: result.defaultInterrupt,
      retireParked: result.retireParked,
    }),
    seal: inspectSeal({
      untainted: result.untainted,
      attainted: result.attainted,
      hardcodedDenial: result.hardcodedDenial,
      userRejectedStamp: result.userRejectedStamp,
      genuineNo: result.genuineNo,
      promptShown: result.promptShown,
    }),
    stations: COURT_STATIONS.map((row) => ({
      ...row,
      attainted: result.attainted === true || result.verdict === "attainted",
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
      toolName: TOOL_NAME,
      mcpReconnectServer: MCP_RECONNECT_SERVER,
      denialKind: DENIAL_KIND,
      denialString: DENIAL_STRING,
      defaultReason: DEFAULT_REASON,
      resetFn: RESET_FN,
      retireFn: RETIRE_FN,
      retirementFn: RETIREMENT_FN,
      retireFlag: RETIRE_FLAG,
      awaiting: AWAITING,
      stations: COURT_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "thread the real reason (timeout, denied, interrupt, session reset) into toolDenialKind / non_execution_kind",
        'reserve toolDenialKind:"user-rejected" for cases where a permission prompt genuinely was shown and answered "no"',
        "every other path (timeout, session reset, reconnect-driven retirement, write failure) should use a distinct, honest non_execution_kind",
        "already-computed outcomes retired_unanswered / retire_superseded / retire_write_failed should not be discarded for a hardcoded user-rejected stamp",
      ],
      hypothesis:
        "NON-BINDING: session-reset path md() may abort abortController and, unless retireParkedPermission:false, call resume/retirement Lo() with default reason \"interrupt\"; inside retirement, toolDenialKind / non_execution_kind is hardcoded to \"user-rejected\" with a fixed denial string even when the reason was an internal interrupt/session reset. The already-computed outcome (retired_unanswered / retire_superseded / retire_write_failed) is discarded for the denial kind. Verify against #93529 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
