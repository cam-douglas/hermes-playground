#!/usr/bin/env node
/**
 * Compline — cloister / monastic evening-office / compline booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On a `claude remote-control` bridge, every scheduled routine
 * firing spawns a local `claude --print --resume=<cse_…>` child.
 * When the run completes, nothing sends `end_session`. The process
 * stays resident indefinitely, holding a concurrent-session slot.
 * Archive-forced `end_session` exits non-zero and flips Routines UI
 * to cancelled while API `last_run.status` stays SUCCEEDED.
 *
 *   node compline.mjs data/lingering.json
 *   echo '{"seed":"lingering"}' | node compline.mjs
 *
 * Idle word is closed (HOLD: end_session on completion, exit 0,
 * slot freed).
 * Seeded word is lingering (#93549 run succeeded; no end_session;
 * process resident).
 * Path word is unrung.
 * Product score word is compline (score compline or admit closed).
 *
 * Encoded from anthropics/claude-code#93549 issue text only.
 * Hypothesis (NON-BINDING): routine completion path never owns
 * end_session on bridge-spawned print-resume children; archive
 * path uses non-zero exit; UI derives cancelled from archived
 * session state. Verify against #93549 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "closed",
  "lingering",
  "compline",
  "unrung",
  "hold",
  "bridge-fire",
  "print-resume",
  "result-success",
  "no-end-session",
  "process-resident",
  "slot-held",
  "capacity-full",
  "archive-end-session",
  "exit-nonzero",
  "ui-cancelled",
  "api-succeeded",
  "end-session-on-completion",
  "exit-zero",
  "slot-freed",
  "persist-session-false",
  "control-trial",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "closed";
export const PATH_WORD = "unrung";
export const SEEDED_WORD = "lingering";
export const PRODUCT_WORD = "compline";
export const HOLD = Object.freeze(["closed", "hold"]);
export const RECOVER = Object.freeze(["closed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "quietus",
  "rubric",
  "recension",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "lingering" && name !== "compline",
  ),
);

export const FEATURED_ISSUE = 93549;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93549";
export const TITLE =
  "remote-control: routine sessions are never sent end_session on completion, and when it is sent the harness exits non-zero.";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:routines",
]);
export const CLAUDE_CODE_VERSION = "2.1.247";
export const OS = "macOS Apple Silicon";
export const CLIENT = "Desktop";
export const SPAWN_FLAG = "claude remote-control --spawn=same-dir";
export const TRIGGERS_PATH = "/v1/code/triggers";
export const TRIGGER_KIND = "bridge";
export const CHILD_COMMAND = "claude --print --resume=<cse_…>";
export const PROCESS_COUNT = 14;
export const COMBINED_RSS = "~1.9 GB";
export const OLDEST_DAYS = 10;
export const CONTROL_GAP = "six minutes";
export const COMPLETED_AT = "01:18:02";
export const STILL_ALIVE_AFTER = "20 minutes";
export const SUCCESS_TURNS = 51;
export const SUCCESS_DURATION = "720s";
export const RESIDENT_HOURS = 18;
export const RATE_LIMIT_EVENTS = 9;
export const HOOK_EVENTS = 3;
export const DISTRIBUTION =
  "Claude Code 2.1.247; macOS Apple Silicon; Desktop; claude remote-control --spawn=same-dir; cloud routines /v1/code/triggers targeting kind: bridge";
export const SESSION_KIND =
  "remote-control bridge routine; print-resume child; persist_session:false desired; no idle/TTL/reap; cli_bg_* tools miss bridge sessions";
export const PHRASE =
  "when a remote-control bridge routine run completes successfully but never receives end_session and the child stays resident holding a concurrent-session slot (and archive-forced end_session exits non-zero flipping UI to cancelled while API stays SUCCEEDED), score compline or admit closed.";

export const CLOISTER_STATIONS = Object.freeze([
  {
    id: "candle",
    survey: "light the stall candle (bridge routine fire / print-resume child)",
    kind: "candle",
    note: "seeded: every scheduled routine on a remote-control bridge spawns claude --print --resume=<cse_…>",
  },
  {
    id: "stall",
    survey: "keep the choir stall (process resident / concurrent slot)",
    kind: "stall",
    note: "seeded: run completes; process stays resident indefinitely holding a concurrent-session slot",
  },
  {
    id: "choir",
    survey: "count the choir (capacity / 14 processes)",
    kind: "choir",
    note: "seeded: after 10 days, 14 processes, ~1.9 GB RSS combined; next firing cannot spawn",
  },
  {
    id: "bell",
    survey: "ring the closing bell (end_session / archive knell)",
    kind: "bell",
    note: "seeded: completion never rings end_session; archive-forced knell exits non-zero and cancels the UI",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "unrung",
  "lingering",
  "no-end-session",
  "process-resident",
  "slot-held",
  "archive-end-session",
  "exit-nonzero",
  "ui-cancelled",
]);

export const COUSINS = Object.freeze([
  {
    issue: 54626,
    title:
      "closed COMPLETED; behaviour persists — scheduled/routine session teardown",
    state: "COMPLETED",
    citeOnly: true,
    why: "Cite-only cousin — closed COMPLETED but behaviour persists; do not rebuild",
  },
  {
    issue: 74682,
    title: "FEATURE auto-archive scheduled/routine sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — FEATURE auto-archive; do not rebuild",
  },
  {
    issue: 83718,
    title: "archived session background process keeps running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — archive leaves the process running; do not rebuild",
  },
  {
    issue: 73900,
    title: "archive_session self deletes worktree but resumes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — archive_session worktree; do not rebuild",
  },
  {
    issue: 72308,
    title: "Desktop scheduled/background never exit",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Desktop scheduled tasks; fourth-spawner family; do not rebuild",
  },
  {
    issue: 68626,
    title: "Windows headless leak",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Windows headless leak; do not rebuild",
  },
  {
    issue: 73631,
    title: "agent-view stale done sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — agent-view stale done sessions; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93475, title: "Effort selector needs a very tall terminal", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93439, title: "Binary Read skips PreToolUse", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93438, title: "Worktree cwd bleed", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93466, title: "Directory Plugins duplicate cards", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93495, title: "Desktop UNUserNotificationCenter deadlock", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93508, title: "Documents preview_start TCC getcwd deny", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93530, title: "Esc kills an unrelated background subagent irrecoverably", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93536, title: "ExitPlanMode consistently returns rejected with inconsistent embedded approval text", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93534, title: "Desktop Code tab: long unsent prompt disappears during composition", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93532, title: "Documents-folder permission is lost on every embedded CLI auto-update", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93494, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93525, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 34690, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export function inspectCandle(input = {}) {
  const lit =
    input.bridgeFire === true ||
    input.printResume === true ||
    input.event === "bridge-fire" ||
    input.event === "print-resume" ||
    (input.lingering === true && input.closed !== true);
  return {
    lit,
    stamp: lit ? "lit" : "snuffed",
    note: lit
      ? "stall candle lit — bridge routine fire spawned claude --print --resume=<cse_…>"
      : "stall candle snuffed — no bridge routine child in the stall",
  };
}

export function inspectStall(input = {}) {
  const warm =
    input.processResident === true ||
    input.slotHeld === true ||
    input.event === "process-resident" ||
    input.event === "slot-held" ||
    (input.lingering === true && input.closed !== true);
  return {
    warm,
    stamp: warm ? "warm" : "empty",
    note: warm
      ? "choir stall warm — process resident, holding a concurrent-session slot"
      : "choir stall empty — slot freed after end_session and exit 0",
  };
}

export function inspectChoir(input = {}) {
  const full =
    input.capacityFull === true ||
    input.event === "capacity-full" ||
    (input.lingering === true &&
      input.processResident === true &&
      input.closed !== true &&
      (input.capacityFull === true || input.processCount >= PROCESS_COUNT));
  return {
    full,
    stamp: full ? "full" : "open",
    note: full
      ? "choir full — 14 processes, ~1.9 GB RSS; next firing cannot spawn"
      : "choir open — concurrent-session slots still free",
  };
}

export function inspectBell(input = {}) {
  const archived =
    input.archiveEndSession === true ||
    input.event === "archive-end-session" ||
    input.event === "unrung" ||
    (input.unrung === true && input.closed !== true);
  const silent =
    input.noEndSession === true ||
    input.event === "no-end-session" ||
    (input.lingering === true &&
      input.closed !== true &&
      input.archiveEndSession !== true);
  const said =
    input.endSessionOnCompletion === true ||
    input.event === "end-session-on-completion" ||
    (input.closed === true &&
      input.exitZero === true &&
      input.lingering !== true);
  if (archived && !said) {
    return {
      archived: true,
      silent: false,
      said: false,
      stamp: "cancelled",
      note: "archive-forced knell — end_session exits non-zero; UI cancelled; API last_run.status SUCCEEDED",
    };
  }
  if (silent && !said) {
    return {
      archived: false,
      silent: true,
      said: false,
      stamp: "silent",
      note: "closing bell silent — completion never rang end_session; only rate_limit_event ×9, system/hook_* ×3",
    };
  }
  return {
    archived: false,
    silent: false,
    said: true,
    stamp: "closed",
    note: "compline said — end_session on completion, exit 0, slot freed",
  };
}

export function readCloister(input = {}) {
  const candle = inspectCandle(input);
  const stall = inspectStall(input);
  const choir = inspectChoir(input);
  const bell = inspectBell(input);
  const lingering =
    stall.stamp === "warm" ||
    candle.stamp === "lit" ||
    bell.stamp === "silent" ||
    input.lingering === true;
  const closed =
    input.closed === true &&
    lingering !== true &&
    stall.stamp === "empty" &&
    bell.stamp === "closed";
  const unrung = bell.stamp === "cancelled" || input.unrung === true;
  return {
    candle,
    stall,
    choir,
    bell,
    stations: CLOISTER_STATIONS,
    lingering: lingering && !closed && !unrung,
    closed:
      closed ||
      (stall.stamp === "empty" &&
        bell.stamp === "closed" &&
        input.lingering !== true &&
        input.unrung !== true),
    unrung: unrung && !closed,
    mark: unrung && !closed ? "unrung" : lingering && !closed ? "lingering" : "closed",
  };
}

/**
 * Published compline walk from #93549 only. Facts from the issue text.
 * A closed booth rings end_session on completion, exits 0, frees the slot.
 * A lingering booth finishes the routine and keeps the print-resume child
 * resident with no end_session. An unrung booth only rings via archive,
 * then exits non-zero and cancels the UI while API stays SUCCEEDED.
 */
export const COMPLINE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-closed",
    closed: true,
    lingering: false,
    endSessionOnCompletion: true,
    exitZero: true,
    slotFreed: true,
    cue: "closed",
    note: "idle HOLD: honest path — end_session on completion, exit 0, slot freed",
  },
  {
    t: "fire",
    event: "bridge-fire",
    lingering: true,
    bridgeFire: true,
    cue: "lingering",
    note: "scheduled routine fires on a claude remote-control bridge",
  },
  {
    t: "spawn",
    event: "print-resume",
    lingering: true,
    printResume: true,
    bridgeFire: true,
    cue: "lingering",
    note: "local claude --print --resume=<cse_…> child spawned",
  },
  {
    t: "success",
    event: "result-success",
    lingering: true,
    resultSuccess: true,
    printResume: true,
    cue: "lingering",
    note: "result: success is_error=false turns=51 duration=720s",
  },
  {
    t: "silent",
    event: "no-end-session",
    lingering: true,
    noEndSession: true,
    resultSuccess: true,
    cue: "lingering",
    note: "no end_session in log — only rate_limit_event ×9, system/hook_* ×3",
  },
  {
    t: "resident",
    event: "process-resident",
    lingering: true,
    processResident: true,
    noEndSession: true,
    cue: "lingering",
    note: "process still resident 18 hours later; control trial completed 01:18:02 and idle 20 minutes",
  },
  {
    t: "slot",
    event: "slot-held",
    lingering: true,
    slotHeld: true,
    processResident: true,
    cue: "lingering",
    note: "concurrent-session slot held; remote-control has no idle/TTL/reap",
  },
  {
    t: "choir",
    event: "capacity-full",
    lingering: true,
    capacityFull: true,
    processResident: true,
    slotHeld: true,
    processCount: 14,
    cue: "lingering",
    note: "after 10 days: 14 processes, ~1.9 GB RSS; next firing cannot spawn",
  },
  {
    t: "archive",
    event: "archive-end-session",
    lingering: true,
    archiveEndSession: true,
    cue: "lingering",
    note: "archiving the session delivers control_request/end_session; process exits within seconds",
  },
  {
    t: "path",
    event: "unrung",
    lingering: true,
    unrung: true,
    archiveEndSession: true,
    exitNonZero: true,
    uiCancelled: true,
    apiSucceeded: true,
    cue: "lingering",
    note: "unrung — archive-forced knell exits non-zero; UI cancelled; API last_run.status SUCCEEDED",
  },
  {
    t: "score",
    event: "compline",
    lingering: true,
    bridgeFire: true,
    printResume: true,
    resultSuccess: true,
    noEndSession: true,
    processResident: true,
    slotHeld: true,
    cue: "lingering",
    note: "compline — evening office never said; print-resume child keeps the stall warm",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "said",
    event: "end-session-on-completion",
    closed: true,
    endSessionOnCompletion: true,
    cue: "closed",
    note: "positive control: end_session sent when the routine completes",
  },
  {
    t: "exit",
    event: "exit-zero",
    closed: true,
    exitZero: true,
    endSessionOnCompletion: true,
    cue: "closed",
    note: "positive control: that path exits 0 so the run is recorded completed",
  },
  {
    t: "freed",
    event: "slot-freed",
    closed: true,
    slotFreed: true,
    exitZero: true,
    cue: "closed",
    note: "positive control: concurrent-session slot freed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    closed: true,
    lingering: false,
    endSessionOnCompletion: true,
    exitZero: true,
    slotFreed: true,
    cue: "closed",
  };
}

export function seedClosed() {
  return { ...emptyTicket() };
}

export function seedLingering() {
  return {
    seed: SEEDED_WORD,
    closed: false,
    lingering: true,
    bridgeFire: true,
    printResume: true,
    resultSuccess: true,
    noEndSession: true,
    processResident: true,
    slotHeld: true,
    cue: "lingering",
    issue: FEATURED_ISSUE,
  };
}

export function seedCompline() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lingering: true,
    bridgeFire: true,
    printResume: true,
    resultSuccess: true,
    noEndSession: true,
    processResident: true,
    slotHeld: true,
    cue: "lingering",
  };
}

export function seedUnrung() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lingering: true,
    unrung: true,
    archiveEndSession: true,
    exitNonZero: true,
    uiCancelled: true,
    apiSucceeded: true,
    cue: "lingering",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    closed: true,
    cue: "closed",
  };
}

export function seedBridgeFire() {
  return {
    seed: "bridge-fire",
    preferSeed: true,
    bridgeFire: true,
    cue: "lingering",
  };
}

export function seedPrintResume() {
  return {
    seed: "print-resume",
    preferSeed: true,
    printResume: true,
    cue: "lingering",
  };
}

export function seedResultSuccess() {
  return {
    seed: "result-success",
    preferSeed: true,
    resultSuccess: true,
    cue: "lingering",
  };
}

export function seedNoEndSession() {
  return {
    seed: "no-end-session",
    preferSeed: true,
    noEndSession: true,
    cue: "lingering",
  };
}

export function seedProcessResident() {
  return {
    seed: "process-resident",
    preferSeed: true,
    processResident: true,
    cue: "lingering",
  };
}

export function seedSlotHeld() {
  return {
    seed: "slot-held",
    preferSeed: true,
    slotHeld: true,
    cue: "lingering",
  };
}

export function seedCapacityFull() {
  return {
    seed: "capacity-full",
    preferSeed: true,
    capacityFull: true,
    cue: "lingering",
  };
}

export function seedArchiveEndSession() {
  return {
    seed: "archive-end-session",
    preferSeed: true,
    archiveEndSession: true,
    cue: "lingering",
  };
}

export function seedExitNonzero() {
  return {
    seed: "exit-nonzero",
    preferSeed: true,
    exitNonZero: true,
    cue: "lingering",
  };
}

export function seedUiCancelled() {
  return {
    seed: "ui-cancelled",
    preferSeed: true,
    uiCancelled: true,
    cue: "lingering",
  };
}

export function seedApiSucceeded() {
  return {
    seed: "api-succeeded",
    preferSeed: true,
    apiSucceeded: true,
    cue: "lingering",
  };
}

export function seedEndSessionOnCompletion() {
  return {
    seed: "end-session-on-completion",
    preferSeed: true,
    endSessionOnCompletion: true,
    cue: "closed",
  };
}

export function seedExitZero() {
  return {
    seed: "exit-zero",
    preferSeed: true,
    exitZero: true,
    cue: "closed",
  };
}

export function seedSlotFreed() {
  return {
    seed: "slot-freed",
    preferSeed: true,
    slotFreed: true,
    cue: "closed",
  };
}

export function seedPersistSessionFalse() {
  return {
    seed: "persist-session-false",
    preferSeed: true,
    persistSessionFalse: true,
    cue: "closed",
  };
}

export function seedControlTrial() {
  return {
    seed: "control-trial",
    preferSeed: true,
    controlTrial: true,
    cue: "lingering",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      closed: false,
      lingering: false,
      unrung: false,
      bridgeFire: false,
      printResume: false,
      resultSuccess: false,
      noEndSession: false,
      processResident: false,
      slotHeld: false,
      capacityFull: false,
      archiveEndSession: false,
      exitNonZero: false,
      uiCancelled: false,
      apiSucceeded: false,
      endSessionOnCompletion: false,
      exitZero: false,
      slotFreed: false,
      persistSessionFalse: false,
      controlTrial: false,
      processCount: 0,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    closed: raw.closed === true,
    lingering: raw.lingering === true,
    unrung: raw.unrung === true || raw.event === "unrung",
    bridgeFire: raw.bridgeFire === true || raw.event === "bridge-fire",
    printResume: raw.printResume === true || raw.event === "print-resume",
    resultSuccess:
      raw.resultSuccess === true || raw.event === "result-success",
    noEndSession:
      raw.noEndSession === true || raw.event === "no-end-session",
    processResident:
      raw.processResident === true || raw.event === "process-resident",
    slotHeld: raw.slotHeld === true || raw.event === "slot-held",
    capacityFull:
      raw.capacityFull === true || raw.event === "capacity-full",
    archiveEndSession:
      raw.archiveEndSession === true ||
      raw.event === "archive-end-session",
    exitNonZero:
      raw.exitNonZero === true || raw.event === "exit-nonzero",
    uiCancelled:
      raw.uiCancelled === true || raw.event === "ui-cancelled",
    apiSucceeded:
      raw.apiSucceeded === true || raw.event === "api-succeeded",
    endSessionOnCompletion:
      raw.endSessionOnCompletion === true ||
      raw.event === "end-session-on-completion",
    exitZero: raw.exitZero === true || raw.event === "exit-zero",
    slotFreed: raw.slotFreed === true || raw.event === "slot-freed",
    persistSessionFalse:
      raw.persistSessionFalse === true ||
      raw.event === "persist-session-false",
    controlTrial:
      raw.controlTrial === true || raw.event === "control-trial",
    processCount: Number(raw.processCount) || 0,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.closed != null ||
        ticket.lingering != null ||
        ticket.unrung != null ||
        ticket.bridgeFire != null ||
        ticket.printResume != null ||
        ticket.resultSuccess != null ||
        ticket.noEndSession != null ||
        ticket.processResident != null ||
        ticket.slotHeld != null ||
        ticket.capacityFull != null ||
        ticket.archiveEndSession != null ||
        ticket.exitNonZero != null ||
        ticket.uiCancelled != null ||
        ticket.apiSucceeded != null ||
        ticket.endSessionOnCompletion != null ||
        ticket.exitZero != null ||
        ticket.slotFreed != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isClosed(row) {
  if (row.lingering && row.cue !== "closed") return false;
  if (
    row.cue === "lingering" ||
    row.cue === "compline" ||
    row.cue === "unrung"
  ) {
    return false;
  }
  if (
    row.noEndSession &&
    row.processResident &&
    row.cue !== "closed" &&
    row.closed !== true
  ) {
    return false;
  }
  if (
    row.archiveEndSession &&
    row.exitNonZero &&
    row.cue !== "closed" &&
    row.closed !== true
  ) {
    return false;
  }
  if (
    row.closed === true &&
    row.lingering !== true &&
    row.cue !== "lingering"
  ) {
    return true;
  }
  if (
    row.cue === "closed" &&
    row.lingering !== true &&
    row.processResident !== true &&
    row.noEndSession !== true
  ) {
    return true;
  }
  if (
    (row.endSessionOnCompletion === true ||
      row.exitZero === true ||
      row.slotFreed === true) &&
    row.lingering !== true &&
    row.noEndSession !== true &&
    row.processResident !== true &&
    row.archiveEndSession !== true &&
    row.exitNonZero !== true
  ) {
    return true;
  }
  return false;
}

function isUnrungPath(row) {
  return (
    row.event === "unrung" &&
    !isClosed(row) &&
    (row.unrung === true ||
      row.archiveEndSession === true ||
      row.exitNonZero === true ||
      row.uiCancelled === true)
  );
}

function isLingering(row) {
  if (isClosed(row)) return false;
  if (isUnrungPath(row) && row.cue !== "lingering") return false;
  if (row.cue === "lingering" || row.cue === "compline") return true;
  if (row.lingering === true) return true;
  if (
    row.resultSuccess === true &&
    row.noEndSession === true &&
    row.processResident === true
  ) {
    return true;
  }
  if (
    row.printResume === true &&
    row.resultSuccess === true &&
    row.noEndSession === true
  ) {
    return true;
  }
  if (
    row.noEndSession === true ||
    row.processResident === true ||
    row.slotHeld === true ||
    (row.bridgeFire === true &&
      row.printResume === true &&
      row.endSessionOnCompletion !== true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cloister pass against the compline booth.
 * closed: end_session on completion, exit 0, slot freed.
 * lingering: run succeeded; no end_session; process resident.
 * unrung: completion never rings end_session; archive-forced knell
 * exits non-zero / UI cancelled while API stays SUCCEEDED.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isUnrungPath(row) ||
    (row.unrung && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "unrung";
  } else if (isLingering(row)) {
    verdict = "lingering";
  } else if (isClosed(row)) {
    verdict = "closed";
  } else if (
    row.noEndSession ||
    row.processResident ||
    row.slotHeld ||
    (row.resultSuccess && row.printResume && !row.endSessionOnCompletion)
  ) {
    verdict = "lingering";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const candle = inspectCandle(row);
  const stall = inspectStall(row);
  const choir = inspectChoir(row);
  const bell = inspectBell(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    closed: verdict === "closed" || verdict === "hold",
    lingering:
      verdict === "lingering" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    unrung:
      row.unrung === true ||
      verdict === "unrung" ||
      verdict === PATH_WORD,
    bridgeFire: row.bridgeFire,
    printResume: row.printResume,
    resultSuccess: row.resultSuccess,
    noEndSession: row.noEndSession,
    processResident: row.processResident,
    slotHeld: row.slotHeld,
    capacityFull: row.capacityFull,
    archiveEndSession: row.archiveEndSession,
    exitNonZero: row.exitNonZero,
    uiCancelled: row.uiCancelled,
    apiSucceeded: row.apiSucceeded,
    endSessionOnCompletion: row.endSessionOnCompletion,
    exitZero: row.exitZero,
    slotFreed: row.slotFreed,
    persistSessionFalse: row.persistSessionFalse,
    controlTrial: row.controlTrial,
    processCount: row.processCount,
    cue: hold ? "closed" : row.unrung || verdict === "unrung" ? "unrung" : "lingering",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit closed" : "score compline",
    candleInspect: candle,
    stallInspect: stall,
    choirInspect: choir,
    bellInspect: bell,
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
      : COMPLINE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const lingering = scored.filter((row) => row.verdict === "lingering");
  const path = scored.filter((row) => row.verdict === "unrung");
  const closed = scored.filter((row) => row.verdict === "closed");
  const headline =
    scored.find((row) => row.event === "no-end-session") ||
    scored.find((row) => row.event === "unrung") ||
    scored.find((row) => row.event === "process-resident") ||
    lingering[lingering.length - 1];
  let verdict = "closed";
  if (lingering.length) verdict = "lingering";
  else if (path.length && !closed.length) verdict = "unrung";
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
    lingeringCount: lingering.length,
    pathCount: path.length,
    closedCount: closed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit closed" : "score compline",
    note: headline
      ? "Claude Code 2.1.247 macOS Apple Silicon Desktop; claude remote-control --spawn=same-dir; /v1/code/triggers kind: bridge; print-resume child; result success; no end_session; process resident; archive knell exits non-zero; UI cancelled; API SUCCEEDED."
      : "published compline walk scored against closed vs lingering",
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
    seeded !== "closed" &&
    seeded !== "lingering" &&
    seeded !== "unrung" &&
    seeded !== "compline" &&
    ticket.closed == null &&
    ticket.lingering == null &&
    ticket.noEndSession == null &&
    ticket.processResident == null &&
    ticket.archiveEndSession == null &&
    ticket.bridgeFire == null &&
    ticket.printResume == null &&
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
    closed: scored.closed ?? false,
    lingering: scored.lingering ?? false,
    unrung: scored.unrung ?? false,
    bridgeFire: scored.bridgeFire ?? false,
    printResume: scored.printResume ?? false,
    resultSuccess: scored.resultSuccess ?? false,
    noEndSession: scored.noEndSession ?? false,
    processResident: scored.processResident ?? false,
    slotHeld: scored.slotHeld ?? false,
    capacityFull: scored.capacityFull ?? false,
    archiveEndSession: scored.archiveEndSession ?? false,
    exitNonZero: scored.exitNonZero ?? false,
    uiCancelled: scored.uiCancelled ?? false,
    apiSucceeded: scored.apiSucceeded ?? false,
    endSessionOnCompletion: scored.endSessionOnCompletion ?? false,
    exitZero: scored.exitZero ?? false,
    slotFreed: scored.slotFreed ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.bridgeFire || result.printResume || result.lingering
      ? "candle=lit"
      : "candle=snuffed",
    result.processResident || result.slotHeld || result.lingering
      ? "stall=warm"
      : "stall=empty",
    result.capacityFull ? "choir=full" : "choir=open",
    result.archiveEndSession || result.unrung || result.verdict === "unrung"
      ? "bell=cancelled"
      : result.noEndSession || result.lingering
        ? "bell=silent"
        : "bell=closed",
    result.unrung || result.verdict === "unrung" ? "path=unrung" : "path=closed",
    result.cue === "closed" ? "cue=closed" : result.cue === "unrung" ? "cue=unrung" : "cue=lingering",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const cloister = readCloister({
    closed: result.closed,
    lingering: result.lingering,
    unrung: result.unrung,
    bridgeFire: result.bridgeFire,
    printResume: result.printResume,
    resultSuccess: result.resultSuccess,
    noEndSession: result.noEndSession,
    processResident: result.processResident,
    slotHeld: result.slotHeld,
    capacityFull: result.capacityFull,
    archiveEndSession: result.archiveEndSession,
    exitNonZero: result.exitNonZero,
    uiCancelled: result.uiCancelled,
    apiSucceeded: result.apiSucceeded,
    endSessionOnCompletion: result.endSessionOnCompletion,
    exitZero: result.exitZero,
    slotFreed: result.slotFreed,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    cloister,
    candle: inspectCandle({
      closed: result.closed,
      lingering: result.lingering,
      bridgeFire: result.bridgeFire,
      printResume: result.printResume,
    }),
    stall: inspectStall({
      closed: result.closed,
      lingering: result.lingering,
      processResident: result.processResident,
      slotHeld: result.slotHeld,
    }),
    choir: inspectChoir({
      closed: result.closed,
      lingering: result.lingering,
      capacityFull: result.capacityFull,
      processResident: result.processResident,
    }),
    bell: inspectBell({
      closed: result.closed,
      lingering: result.lingering,
      unrung: result.unrung,
      noEndSession: result.noEndSession,
      archiveEndSession: result.archiveEndSession,
      endSessionOnCompletion: result.endSessionOnCompletion,
      exitZero: result.exitZero,
    }),
    stations: CLOISTER_STATIONS.map((row) => ({
      ...row,
      lingering: result.lingering === true || result.verdict === "lingering",
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
      spawnFlag: SPAWN_FLAG,
      triggersPath: TRIGGERS_PATH,
      triggerKind: TRIGGER_KIND,
      childCommand: CHILD_COMMAND,
      processCount: PROCESS_COUNT,
      combinedRss: COMBINED_RSS,
      oldestDays: OLDEST_DAYS,
      controlGap: CONTROL_GAP,
      completedAt: COMPLETED_AT,
      stillAliveAfter: STILL_ALIVE_AFTER,
      successTurns: SUCCESS_TURNS,
      successDuration: SUCCESS_DURATION,
      residentHours: RESIDENT_HOURS,
      rateLimitEvents: RATE_LIMIT_EVENTS,
      hookEvents: HOOK_EVENTS,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: CLOISTER_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "send end_session when a routine completes, at least for persist_session:false",
        "that path should exit 0 so the run is recorded completed",
        "client should read the run's own status rather than deriving cancelled from archived session state",
      ],
      hypothesis:
        "NON-BINDING: routine completion path never owns end_session on bridge-spawned print-resume children; archive path uses non-zero exit; UI derives cancelled from archived session state. Verify against #93549 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
