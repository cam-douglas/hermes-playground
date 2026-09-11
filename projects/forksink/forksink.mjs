#!/usr/bin/env node
/**
 * Forksink — municipal storm-drain / catch-basin / grate booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A SessionStart hook that returns hookSpecificOutput.additionalContext
 * runs and produces output when the session is created by a rewind
 * (source=fork), but the model never receives the text. The same hook
 * injects correctly on source=startup and source=compact.
 *
 *   node forksink.mjs data/dropped.json
 *   echo '{"seed":"dropped"}' | node forksink.mjs
 *
 * Idle word is lodged (HOLD: additionalContext reached the model on
 * fork the same way it does on startup/compact).
 * Seeded word is dropped (#93458: hook ran, exit 0, valid JSON, but
 * the model never received additionalContext when source=fork).
 * Path word is source-fork.
 * Product score word is forksink (score forksink or admit lodged).
 *
 * Encoded from anthropics/claude-code#93458 issue text only.
 * Hypothesis (NON-BINDING): a forked session may inherit the parent's
 * context snapshot and skip re-applying SessionStart additionalContext,
 * so state that changes during a session (parity failures, SessionEnd
 * findings, to-do queue) stays stale after rewind with no alarm.
 * Verify against #93458 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "lodged",
  "dropped",
  "forksink",
  "source-fork",
  "hold",
  "hook-ran",
  "exit-zero",
  "valid-json",
  "no-model-text",
  "silent-drop",
  "rewind-fork",
  "startup-lodged",
  "compact-lodged",
  "marker-abc",
  "marker-xyz",
  "stale-inherit",
  "no-alarm",
  "session-end-live",
  "self-trace",
  "emitted-2430",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "lodged";
export const PATH_WORD = "source-fork";
export const SEEDED_WORD = "dropped";
export const PRODUCT_WORD = "forksink";
export const HOLD = Object.freeze(["lodged", "hold"]);
export const RECOVER = Object.freeze(["lodged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
    (name) => name !== "dropped" && name !== "forksink",
  ),
);

export const FEATURED_ISSUE = 93458;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93458";
export const TITLE =
  "SessionStart hook additionalContext silently dropped when source=fork (rewind); startup/compact inject normally";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:hooks",
  "area:desktop",
]);
export const AUTHOR = "turtleziv";
export const FILED = "2026-09-10T19:50:08Z";
export const CLAUDE_CODE_VERSION = "2.1.263";
export const OS = "Windows 10 (10.0.19045)";
export const CLIENT = "Claude Code desktop app, Code tab";
export const SHELL = "Git Bash";
export const MODEL = "Opus 5 (claude-opus-5)";
export const PLATFORM = "Anthropic API (Claude subscription)";
export const SESSION_KIND =
  "Claude Code desktop app Code tab; SessionStart hook via Git Bash; rewind creates source=fork";
export const MARKER_START = "MARKER_ABC123";
export const MARKER_REWIND = "MARKER_XYZ789";
export const REWIND_AT = "2026-09-11 03:36:24";
export const HOOK_TRACE_AT = "2026-09-11 03:36:25";
export const RESUME_SESSION_AT = "80b720a2-3ec9-4011-a5a2-c6e516465920";
export const FORK_SESSION = "local_8021f6c5-e5fc-405e-8bc0-802d8729512b";
export const EMITTED_CHARS = 2430;
export const REWIND_COUNT = 5;
export const REWIND_LOG =
  "2026-09-11 03:36:24 [info] [Rewind] resumeSessionAt=80b720a2-3ec9-4011-a5a2-c6e516465920 + forkSession for session local_8021f6c5-e5fc-405e-8bc0-802d8729512b";
export const HOOK_TRACE =
  "2026-09-11 03:36:25 session_orient SessionStart ran：source=fork 注入 2430 字元";
export const PHRASE =
  "when a SessionStart hook's additionalContext vanishes on source=fork while startup/compact still lodge it, score forksink or admit lodged.";

export const DRAIN_STATIONS = Object.freeze([
  {
    id: "grate",
    survey: "lift the grate (SessionStart hook self-trace)",
    kind: "hook",
    note: "seeded: hook ran on source=fork and wrote a self-trace one second after rewind",
  },
  {
    id: "basin",
    survey: "sound the basin (valid JSON additionalContext)",
    kind: "json",
    note: "seeded: hook exits 0 and emits valid JSON; 2430 characters of additionalContext",
  },
  {
    id: "street",
    survey: "read the street surface (startup / compact lodge)",
    kind: "street",
    note: "seeded: same hook lodges additionalContext on source=startup and source=compact",
  },
  {
    id: "sink",
    survey: "watch the sink (fork / rewind drop)",
    kind: "sink",
    note: "seeded: rewind source=fork runoff vanishes; model never receives the text",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "source-fork",
  "dropped",
  "hook-ran",
  "exit-zero",
  "valid-json",
  "no-model-text",
  "silent-drop",
  "rewind-fork",
]);

export const COUSINS = Object.freeze([
  {
    issue: 69848,
    title: "Windows-wide additionalContext injection failure",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed Windows-wide additionalContext injection failure; broader surface; do not rebuild",
  },
  {
    issue: 88086,
    title:
      "VS Code extension SessionStart plugin hook additionalContext logged succeeded but never injected",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — VS Code extension SessionStart plugin hook; logged succeeded but never injected; do not rebuild",
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
  {
    issue: 93508,
    title: "Documents preview_start TCC getcwd deny",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export function inspectHook(input = {}) {
  const ran =
    input.hookRan === true ||
    input.selfTrace === true ||
    input.event === "hook-ran" ||
    input.event === "self-trace" ||
    (input.sourceFork === true && input.exitZero === true) ||
    (input.dropped === true && input.lodged !== true);
  const exitZero =
    input.exitZero === true ||
    input.exitCode === 0 ||
    input.event === "exit-zero" ||
    ran;
  return {
    ran: ran || exitZero,
    exitZero,
    stamp: ran ? "ran" : "quiet",
    note: ran
      ? "SessionStart hook ran and produced output — self-trace recorded source=fork"
      : "no SessionStart self-trace on this grate",
  };
}

export function inspectJson(input = {}) {
  const valid =
    input.validJson === true ||
    input.event === "valid-json" ||
    input.additionalContext != null ||
    input.emittedChars > 0 ||
    (input.dropped === true && input.lodged !== true) ||
    input.hookRan === true;
  const chars =
    Number.isFinite(input.emittedChars) && input.emittedChars > 0
      ? input.emittedChars
      : valid
        ? EMITTED_CHARS
        : 0;
  return {
    valid,
    chars,
    stamp: valid ? "valid" : "empty",
    note: valid
      ? `hook exits 0 and emits valid JSON additionalContext (${chars} characters)`
      : "no valid additionalContext JSON on the basin",
  };
}

export function inspectStreet(input = {}) {
  const lodged =
    input.startupLodged === true ||
    input.compactLodged === true ||
    input.event === "startup-lodged" ||
    input.event === "compact-lodged" ||
    (input.lodged === true &&
      input.dropped !== true &&
      input.sourceFork !== true);
  return {
    lodged,
    stamp: lodged ? "lodged" : "dry",
    note: lodged
      ? "startup/compact runoff stays lodged on the street surface"
      : "street surface is dry — no startup/compact lodge recorded",
  };
}

export function inspectSink(input = {}) {
  const vanished =
    input.sourceFork === true ||
    input.silentDrop === true ||
    input.noModelText === true ||
    input.event === "source-fork" ||
    input.event === "rewind-fork" ||
    (input.dropped === true && input.lodged !== true);
  return {
    vanished,
    stamp: vanished ? "dropped" : "lodged",
    note: vanished
      ? "fork/rewind runoff vanishes into the sink with no alarm"
      : "sink holds — additionalContext reached the model on fork",
  };
}

export function inspectModel(input = {}) {
  const received =
    input.modelReceived === true ||
    (input.lodged === true &&
      input.dropped !== true &&
      input.noModelText !== true &&
      input.sourceFork !== true);
  const missing =
    input.noModelText === true ||
    input.modelReceived === false ||
    (input.dropped === true && input.lodged !== true && !received);
  return {
    received: received && !missing,
    missing: missing && !received,
    stamp: missing && !received ? "dropped" : "lodged",
    note:
      missing && !received
        ? "model never received additionalContext after source=fork"
        : "model sees additionalContext the same way it does on startup/compact",
  };
}

export function readBasin(input = {}) {
  const hook = inspectHook(input);
  const json = inspectJson(input);
  const street = inspectStreet(input);
  const sink = inspectSink(input);
  const model = inspectModel(input);
  const dropped =
    sink.stamp === "dropped" ||
    model.stamp === "dropped" ||
    input.dropped === true;
  const lodged =
    input.lodged === true &&
    dropped !== true &&
    sink.stamp === "lodged" &&
    model.stamp === "lodged";
  return {
    hook,
    json,
    street,
    sink,
    model,
    stations: DRAIN_STATIONS,
    dropped: dropped && !lodged,
    lodged:
      lodged ||
      (street.stamp === "lodged" &&
        sink.stamp === "lodged" &&
        model.stamp === "lodged" &&
        input.dropped !== true),
    mark: dropped && !lodged ? "dropped" : "lodged",
  };
}

/**
 * Published forksink walk from #93458 only. Facts from the issue text.
 * A lodged booth keeps additionalContext on fork the same way
 * startup/compact do. A dropped booth is hook-ran + exit 0 + valid
 * JSON whose additionalContext never reaches the model on source=fork.
 */
export const FORKSINK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-lodged",
    lodged: true,
    dropped: false,
    modelReceived: true,
    startupLodged: true,
    compactLodged: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    cue: "lodged",
    note: "idle HOLD: additionalContext reached the model on fork the same way it does on startup/compact",
  },
  {
    t: "startup",
    event: "startup-lodged",
    lodged: true,
    startupLodged: true,
    modelReceived: true,
    marker: MARKER_START,
    cue: "lodged",
    note: "source=startup: ask if MARKER_ABC123 is in context → yes",
  },
  {
    t: "compact",
    event: "compact-lodged",
    lodged: true,
    compactLodged: true,
    modelReceived: true,
    cue: "lodged",
    note: "source=compact injects correctly — output visible in those sessions' context",
  },
  {
    t: "marker",
    event: "marker-change",
    lodged: true,
    marker: MARKER_REWIND,
    cue: "lodged",
    note: "change the marker to MARKER_XYZ789, then rewind to a message before the first ask",
  },
  {
    t: "rewind",
    event: "rewind-fork",
    dropped: true,
    sourceFork: true,
    rewindAt: REWIND_AT,
    resumeSessionAt: RESUME_SESSION_AT,
    forkSession: FORK_SESSION,
    cue: "dropped",
    note: "app log [Rewind] resumeSessionAt=80b720a2-3ec9-4011-a5a2-c6e516465920 + forkSession",
  },
  {
    t: "grate",
    event: "hook-ran",
    dropped: true,
    hookRan: true,
    selfTrace: true,
    sourceFork: true,
    exitZero: true,
    hookTraceAt: HOOK_TRACE_AT,
    emittedChars: EMITTED_CHARS,
    cue: "dropped",
    note: "hook self-trace one second later: SessionStart ran source=fork, emitted 2430 characters",
  },
  {
    t: "basin",
    event: "valid-json",
    dropped: true,
    validJson: true,
    exitZero: true,
    sourceFork: true,
    cue: "dropped",
    note: "hook exits 0 and emits valid JSON; nothing reports failure",
  },
  {
    t: "sink",
    event: "no-model-text",
    dropped: true,
    noModelText: true,
    modelReceived: false,
    sourceFork: true,
    marker: MARKER_REWIND,
    cue: "dropped",
    note: "ask if MARKER_XYZ789 is in context → no; session contained none of those 2430 characters",
  },
  {
    t: "path",
    event: "source-fork",
    sourceFork: true,
    dropped: true,
    silentDrop: true,
    noModelText: true,
    cue: "dropped",
    note: "source-fork — additionalContext silently dropped on rewind; no stated docs exception",
  },
  {
    t: "score",
    event: "forksink",
    dropped: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    sourceFork: true,
    noModelText: true,
    silentDrop: true,
    cue: "dropped",
    note: "forksink — street-surface runoff lodges on startup/compact; fork/rewind vanishes into the sink with no alarm",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "startup",
    event: "startup-lodged",
    lodged: true,
    startupLodged: true,
    modelReceived: true,
    marker: MARKER_START,
    cue: "lodged",
    note: "positive control: same hook, same machine, same project, same settings — source=startup injects MARKER_ABC123",
  },
  {
    t: "compact",
    event: "compact-lodged",
    lodged: true,
    compactLodged: true,
    modelReceived: true,
    cue: "lodged",
    note: "positive control: source=compact injects normally — output visible in those sessions' context",
  },
  {
    t: "end",
    event: "session-end-live",
    lodged: true,
    sessionEndLive: true,
    cue: "lodged",
    note: "neighbouring SessionEnd hooks fire normally around the same minutes, so hooks as a whole were live",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    lodged: true,
    dropped: false,
    modelReceived: true,
    startupLodged: true,
    compactLodged: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    cue: "lodged",
  };
}

export function seedLodged() {
  return { ...emptyTicket() };
}

export function seedDropped() {
  return {
    seed: SEEDED_WORD,
    lodged: false,
    dropped: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    selfTrace: true,
    sourceFork: true,
    noModelText: true,
    modelReceived: false,
    silentDrop: true,
    emittedChars: EMITTED_CHARS,
    marker: MARKER_REWIND,
    cue: "dropped",
    issue: FEATURED_ISSUE,
  };
}

export function seedForksink() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    dropped: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    sourceFork: true,
    noModelText: true,
    silentDrop: true,
    cue: "dropped",
  };
}

export function seedSourceFork() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    dropped: true,
    sourceFork: true,
    silentDrop: true,
    noModelText: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    cue: "dropped",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    lodged: true,
    cue: "lodged",
  };
}

export function seedHookRan() {
  return {
    seed: "hook-ran",
    preferSeed: true,
    hookRan: true,
    cue: "dropped",
  };
}

export function seedExitZero() {
  return {
    seed: "exit-zero",
    preferSeed: true,
    exitZero: true,
    cue: "dropped",
  };
}

export function seedValidJson() {
  return {
    seed: "valid-json",
    preferSeed: true,
    validJson: true,
    cue: "dropped",
  };
}

export function seedNoModelText() {
  return {
    seed: "no-model-text",
    preferSeed: true,
    noModelText: true,
    cue: "dropped",
  };
}

export function seedSilentDrop() {
  return {
    seed: "silent-drop",
    preferSeed: true,
    silentDrop: true,
    cue: "dropped",
  };
}

export function seedRewindFork() {
  return {
    seed: "rewind-fork",
    preferSeed: true,
    sourceFork: true,
    cue: "dropped",
  };
}

export function seedStartupLodged() {
  return {
    seed: "startup-lodged",
    preferSeed: true,
    startupLodged: true,
    cue: "lodged",
  };
}

export function seedCompactLodged() {
  return {
    seed: "compact-lodged",
    preferSeed: true,
    compactLodged: true,
    cue: "lodged",
  };
}

export function seedMarkerAbc() {
  return {
    seed: "marker-abc",
    preferSeed: true,
    marker: MARKER_START,
    cue: "lodged",
  };
}

export function seedMarkerXyz() {
  return {
    seed: "marker-xyz",
    preferSeed: true,
    marker: MARKER_REWIND,
    cue: "dropped",
  };
}

export function seedStaleInherit() {
  return {
    seed: "stale-inherit",
    preferSeed: true,
    staleInherit: true,
    cue: "dropped",
  };
}

export function seedNoAlarm() {
  return {
    seed: "no-alarm",
    preferSeed: true,
    noAlarm: true,
    cue: "dropped",
  };
}

export function seedSessionEndLive() {
  return {
    seed: "session-end-live",
    preferSeed: true,
    sessionEndLive: true,
    cue: "lodged",
  };
}

export function seedSelfTrace() {
  return {
    seed: "self-trace",
    preferSeed: true,
    selfTrace: true,
    cue: "dropped",
  };
}

export function seedEmitted2430() {
  return {
    seed: "emitted-2430",
    preferSeed: true,
    emittedChars: EMITTED_CHARS,
    cue: "dropped",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      lodged: false,
      dropped: false,
      hookRan: false,
      exitZero: false,
      validJson: false,
      selfTrace: false,
      sourceFork: false,
      noModelText: false,
      modelReceived: false,
      silentDrop: false,
      startupLodged: false,
      compactLodged: false,
      sessionEndLive: false,
      staleInherit: false,
      noAlarm: false,
      emittedChars: 0,
      additionalContext: null,
      marker: null,
      exitCode: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    lodged: raw.lodged === true,
    dropped: raw.dropped === true,
    hookRan:
      raw.hookRan === true ||
      raw.selfTrace === true ||
      raw.event === "hook-ran" ||
      raw.event === "self-trace",
    exitZero:
      raw.exitZero === true ||
      raw.exitCode === 0 ||
      raw.event === "exit-zero",
    validJson: raw.validJson === true || raw.event === "valid-json",
    selfTrace: raw.selfTrace === true || raw.event === "self-trace",
    sourceFork:
      raw.sourceFork === true ||
      raw.source === "fork" ||
      raw.event === "source-fork" ||
      raw.event === "rewind-fork",
    noModelText:
      raw.noModelText === true ||
      raw.modelReceived === false ||
      raw.event === "no-model-text",
    modelReceived: raw.modelReceived === true,
    silentDrop: raw.silentDrop === true || raw.event === "silent-drop",
    startupLodged:
      raw.startupLodged === true || raw.event === "startup-lodged",
    compactLodged:
      raw.compactLodged === true || raw.event === "compact-lodged",
    sessionEndLive:
      raw.sessionEndLive === true || raw.event === "session-end-live",
    staleInherit: raw.staleInherit === true,
    noAlarm: raw.noAlarm === true,
    emittedChars: Number(raw.emittedChars) || 0,
    additionalContext:
      raw.additionalContext == null ? null : raw.additionalContext,
    marker: raw.marker == null ? null : raw.marker,
    exitCode: raw.exitCode == null ? null : raw.exitCode,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.lodged != null ||
        ticket.dropped != null ||
        ticket.hookRan != null ||
        ticket.exitZero != null ||
        ticket.validJson != null ||
        ticket.sourceFork != null ||
        ticket.noModelText != null ||
        ticket.modelReceived != null ||
        ticket.silentDrop != null ||
        ticket.startupLodged != null ||
        ticket.compactLodged != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isLodged(row) {
  if (row.dropped && row.cue !== "lodged") return false;
  if (
    row.cue === "dropped" ||
    row.cue === "forksink" ||
    row.cue === "source-fork"
  ) {
    return false;
  }
  if (
    row.sourceFork &&
    row.cue !== "lodged" &&
    row.lodged !== true &&
    row.modelReceived !== true
  ) {
    return false;
  }
  if (
    row.noModelText &&
    row.cue !== "lodged" &&
    row.lodged !== true &&
    row.modelReceived !== true
  ) {
    return false;
  }
  if (
    row.lodged === true &&
    row.dropped !== true &&
    row.cue !== "dropped"
  ) {
    return true;
  }
  if (
    row.cue === "lodged" &&
    row.dropped !== true &&
    row.sourceFork !== true &&
    row.noModelText !== true
  ) {
    return true;
  }
  if (
    row.modelReceived === true &&
    row.dropped !== true &&
    row.sourceFork !== true &&
    row.noModelText !== true
  ) {
    return true;
  }
  if (
    (row.startupLodged === true ||
      row.compactLodged === true ||
      row.sessionEndLive === true) &&
    row.dropped !== true &&
    row.sourceFork !== true &&
    row.noModelText !== true
  ) {
    return true;
  }
  return false;
}

function isDropped(row) {
  if (isLodged(row)) return false;
  if (row.cue === "dropped" || row.cue === "forksink") return true;
  if (row.dropped === true) return true;
  if (
    row.sourceFork === true ||
    row.silentDrop === true ||
    row.noModelText === true ||
    (row.hookRan === true &&
      row.validJson === true &&
      row.modelReceived === false)
  ) {
    return true;
  }
  return false;
}

function isSourceForkPath(row) {
  return (
    row.event === "source-fork" &&
    !isLodged(row) &&
    (row.dropped === true ||
      row.sourceFork === true ||
      row.silentDrop === true)
  );
}

/**
 * Score one grate pass against the forksink booth.
 * lodged: additionalContext reached the model on fork the same way
 * it does on startup/compact.
 * dropped: hook ran, exit 0, valid JSON, but the model never received
 * additionalContext when source=fork.
 * source-fork: named path — rewind fork silently drops the payload.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSourceForkPath(row) ||
    (row.sourceFork && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "source-fork";
  } else if (isDropped(row)) {
    verdict = "dropped";
  } else if (isLodged(row)) {
    verdict = "lodged";
  } else if (
    row.sourceFork ||
    row.noModelText ||
    row.silentDrop ||
    (row.hookRan && row.validJson && row.modelReceived === false)
  ) {
    verdict = "dropped";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const hook = inspectHook(row);
  const json = inspectJson(row);
  const street = inspectStreet(row);
  const sink = inspectSink(row);
  const model = inspectModel(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    lodged: verdict === "lodged" || verdict === "hold",
    dropped:
      verdict === "dropped" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    sourceFork:
      row.sourceFork === true ||
      verdict === "source-fork" ||
      verdict === PATH_WORD,
    hookRan: row.hookRan,
    exitZero: row.exitZero,
    validJson: row.validJson,
    selfTrace: row.selfTrace,
    noModelText: row.noModelText,
    modelReceived: row.modelReceived,
    silentDrop: row.silentDrop,
    startupLodged: row.startupLodged,
    compactLodged: row.compactLodged,
    sessionEndLive: row.sessionEndLive,
    staleInherit: row.staleInherit,
    noAlarm: row.noAlarm,
    emittedChars: row.emittedChars,
    additionalContext: row.additionalContext,
    marker: row.marker,
    exitCode: row.exitCode,
    cue: hold ? "lodged" : "dropped",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit lodged" : "score forksink",
    hookInspect: hook,
    jsonInspect: json,
    streetInspect: street,
    sinkInspect: sink,
    modelInspect: model,
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
      : FORKSINK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dropped = scored.filter((row) => row.verdict === "dropped");
  const path = scored.filter((row) => row.verdict === "source-fork");
  const lodged = scored.filter((row) => row.verdict === "lodged");
  const headline =
    scored.find((row) => row.event === "no-model-text") ||
    scored.find((row) => row.event === "source-fork") ||
    scored.find((row) => row.event === "rewind-fork") ||
    dropped[dropped.length - 1];
  let verdict = "lodged";
  if (dropped.length) verdict = "dropped";
  else if (path.length && !lodged.length) verdict = "source-fork";
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
    droppedCount: dropped.length,
    pathCount: path.length,
    lodgedCount: lodged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit lodged" : "score forksink",
    note: headline
      ? "Claude Code 2.1.263 Windows 10; desktop Code tab; Git Bash SessionStart hook; rewind forkSession at 03:36:24; hook self-trace source=fork emitted 2430 characters at 03:36:25; model never received the text. startup/compact still lodge."
      : "published forksink walk scored against lodged vs dropped",
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
    seeded !== "lodged" &&
    seeded !== "dropped" &&
    seeded !== "source-fork" &&
    seeded !== "forksink" &&
    ticket.lodged == null &&
    ticket.dropped == null &&
    ticket.hookRan == null &&
    ticket.sourceFork == null &&
    ticket.noModelText == null &&
    ticket.validJson == null &&
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
    lodged: scored.lodged ?? false,
    dropped: scored.dropped ?? false,
    sourceFork: scored.sourceFork ?? false,
    hookRan: scored.hookRan ?? false,
    exitZero: scored.exitZero ?? false,
    validJson: scored.validJson ?? false,
    noModelText: scored.noModelText ?? false,
    modelReceived: scored.modelReceived ?? false,
    silentDrop: scored.silentDrop ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.hookRan || result.selfTrace ? "hook=ran" : "hook=quiet",
    result.validJson || result.exitZero ? "json=valid" : "json=empty",
    result.startupLodged || result.compactLodged || result.lodged
      ? "street=lodged"
      : "street=dry",
    result.sourceFork || result.silentDrop || result.dropped
      ? "sink=dropped"
      : "sink=lodged",
    result.modelReceived ? "model=saw" : "model=none",
    result.sourceFork || result.verdict === "source-fork"
      ? "path=source-fork"
      : "path=lodged",
    result.cue === "lodged" ? "cue=lodged" : "cue=dropped",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const basin = readBasin({
    lodged: result.lodged,
    dropped: result.dropped,
    hookRan: result.hookRan,
    exitZero: result.exitZero,
    validJson: result.validJson,
    selfTrace: result.selfTrace,
    sourceFork: result.sourceFork,
    noModelText: result.noModelText,
    modelReceived: result.modelReceived,
    silentDrop: result.silentDrop,
    startupLodged: result.startupLodged,
    compactLodged: result.compactLodged,
    sessionEndLive: result.sessionEndLive,
    emittedChars: result.emittedChars,
    additionalContext: result.additionalContext,
    marker: result.marker,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    basin,
    hook: inspectHook({
      lodged: result.lodged,
      dropped: result.dropped,
      hookRan: result.hookRan,
      selfTrace: result.selfTrace,
      exitZero: result.exitZero,
      sourceFork: result.sourceFork,
    }),
    json: inspectJson({
      lodged: result.lodged,
      dropped: result.dropped,
      validJson: result.validJson,
      hookRan: result.hookRan,
      emittedChars: result.emittedChars,
      additionalContext: result.additionalContext,
    }),
    street: inspectStreet({
      lodged: result.lodged,
      dropped: result.dropped,
      startupLodged: result.startupLodged,
      compactLodged: result.compactLodged,
      sourceFork: result.sourceFork,
    }),
    sink: inspectSink({
      lodged: result.lodged,
      dropped: result.dropped,
      sourceFork: result.sourceFork,
      silentDrop: result.silentDrop,
      noModelText: result.noModelText,
    }),
    model: inspectModel({
      lodged: result.lodged,
      dropped: result.dropped,
      modelReceived: result.modelReceived,
      noModelText: result.noModelText,
      sourceFork: result.sourceFork,
    }),
    stations: DRAIN_STATIONS.map((row) => ({
      ...row,
      dropped: result.dropped === true || result.verdict === "dropped",
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
      shell: SHELL,
      model: MODEL,
      platform: PLATFORM,
      sessionKind: SESSION_KIND,
      markerStart: MARKER_START,
      markerRewind: MARKER_REWIND,
      rewindAt: REWIND_AT,
      hookTraceAt: HOOK_TRACE_AT,
      resumeSessionAt: RESUME_SESSION_AT,
      forkSession: FORK_SESSION,
      emittedChars: EMITTED_CHARS,
      rewindCount: REWIND_COUNT,
      rewindLog: REWIND_LOG,
      hookTrace: HOOK_TRACE,
      stations: DRAIN_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "additionalContext reaches the model on source=fork the same way it does on source=startup and source=compact",
        "or the documented SessionStart contract records the fork exception",
        "without an in-hook side effect, ran-but-discarded stays indistinguishable from did-not-run",
        "if inheritance is intentional, the inherited copy is a snapshot from the fork point and goes stale for session-changing state",
      ],
      hypothesis:
        "NON-BINDING: a forked session may inherit the parent's context snapshot and skip re-applying SessionStart additionalContext, so state that changes during a session (parity check failures, SessionEnd findings, a to-do queue) stays stale after rewind with no alarm. Docs list fork as a SessionStart source and say additionalContext is seen by Claude, with no stated exception. Verify against #93458 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
