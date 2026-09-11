#!/usr/bin/env node
/**
 * Foxfire — marsh foxfire / bioluminescence observation booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * With Remote Control attached to an otherwise idle Claude Code CLI,
 * a submitted message can be painted as dim text in the local
 * composer but never start a turn. No transcript user row. No
 * queue-operation. Session stays idle until a local Escape/retype.
 *
 *   node foxfire.mjs data/painted.json
 *   echo '{"seed":"painted"}' | node foxfire.mjs
 *
 * Idle word is kindled (HOLD: remote message became a real user
 * turn; transcript user row + turn started; not mere composer paint).
 * Seeded word is painted (#93502: dim composer text only; no
 * transcript user row; no queue-operation; no turn; session stays
 * idle).
 * Path word is never-turns.
 * Product score word is foxfire (score foxfire or admit kindled).
 *
 * Encoded from anthropics/claude-code#93502 issue text only.
 * Hypothesis (NON-BINDING): idle path may paint PTY composer
 * without enqueueing a turn / queue-operation after a clean Stop.
 * Verify against #93502 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "kindled",
  "painted",
  "foxfire",
  "never-turns",
  "hold",
  "composer-paint",
  "no-transcript",
  "no-queue",
  "no-pty-input",
  "stop-clean",
  "mid-turn-absorbed",
  "queue-enqueue",
  "absorbed-mid-turn",
  "prevented-false",
  "continue-true",
  "dim-text",
  "f-831",
  "idle-after-stop",
  "no-delivery-failure",
  "workaround",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "kindled";
export const PATH_WORD = "never-turns";
export const SEEDED_WORD = "painted";
export const PRODUCT_WORD = "foxfire";
export const HOLD = Object.freeze(["kindled", "hold"]);
export const RECOVER = Object.freeze(["kindled", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "painted" && name !== "foxfire",
  ),
);

export const FEATURED_ISSUE = 93502;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93502";
export const TITLE =
  "Remote Control message paints in idle CLI composer but never starts a turn";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:tui",
]);
export const AUTHOR = "kschzt";
export const FILED = "2026-09-11T01:14:36Z";
export const CLAUDE_CODE_VERSION = "2.1.267";
export const OS = "macOS";
export const CLIENT = "claude.ai/code from another device";
export const SESSION_KIND =
  "Remote Control attached to an otherwise idle Claude Code CLI after a completed turn";
export const REMOTE_MESSAGE = "build the F-831 control";
export const ASSISTANT_ENDED = "2026-09-10T21:38:01.662Z";
export const HOOK_CONTINUE_AT = "2026-09-10T21:38:02.014Z";
export const HOOK_EMPTY_AT = "2026-09-10T21:38:02.195Z";
export const STOP_SUMMARY_AT = "2026-09-10T21:38:02.199Z";
export const PAINT_AT = "2026-09-10T21:38:03.640Z";
export const PAINT_LAG_SECONDS = 1.44;
export const QUEUE_ENQUEUE_AT = "2026-09-10T21:47:05.062Z";
export const ABSORBED_AT = "2026-09-10T21:47:17.234Z";
export const ABSORB_SECONDS = 12.172;
export const ABSORB_REASON = "absorbed_mid_turn";
export const PHRASE =
  "when a Remote Control message to an idle CLI paints dim composer text without starting a turn, score foxfire or admit kindled.";

export const LANTERN_STATIONS = Object.freeze([
  {
    id: "lantern",
    survey: "watch the lantern glass (PTY composer paint)",
    kind: "composer",
    note: "seeded: PTY output paints the remote message as dim composer text",
  },
  {
    id: "peat",
    survey: "sound the peat bank (transcript user row)",
    kind: "transcript",
    note: "seeded: no corresponding transcript user row",
  },
  {
    id: "mist",
    survey: "part the mist (queue-operation)",
    kind: "queue",
    note: "seeded: no transcript queue-operation row",
  },
  {
    id: "water",
    survey: "read the dark water (turn start)",
    kind: "turn",
    note: "seeded: no turn began; session remains idle",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "never-turns",
  "painted",
  "composer-paint",
  "no-transcript",
  "no-queue",
  "no-pty-input",
  "idle-after-stop",
  "dim-text",
]);

export const COUSINS = Object.freeze([
  {
    issue: 78177,
    title:
      "Remote Control message paints in idle CLI composer but never starts a turn (closed stale prior)",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed stale prior of the same paint stall; do not rebuild",
  },
  {
    issue: 51267,
    title: "broader input-stall report",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — broader input-stall; do not rebuild",
  },
  {
    issue: 93288,
    title:
      "Remote Control bridges washed on Desktop restart (Pontoon)",
    state: "OPEN",
    citeOnly: true,
    product: "pontoon",
    why: "Cite-only catalog cousin — RC bridges washed; different defect; do not rebuild",
  },
  {
    issue: 92596,
    title: "Windows assistant paint deltas stay latent (Afterimage)",
    state: "OPEN",
    citeOnly: true,
    product: "afterimage",
    why: "Cite-only catalog cousin — Windows assistant paint deltas; different defect; do not rebuild",
  },
  {
    issue: 92694,
    title: "AskUserQuestion caret paint after blur (Espagnolette)",
    state: "OPEN",
    citeOnly: true,
    product: "espagnolette",
    why: "Cite-only catalog cousin — caret paint after blur; different defect; do not rebuild",
  },
  {
    issue: 90881,
    title: "painted clear that never ran (Trompe)",
    state: "OPEN",
    citeOnly: true,
    product: "trompe",
    why: "Cite-only catalog cousin — painted clear; different defect; do not rebuild",
  },
  {
    issue: 93012,
    title: "Remote Control environment-label split (Diplopia)",
    state: "OPEN",
    citeOnly: true,
    product: "diplopia",
    why: "Cite-only catalog cousin — RC environment-label split; different defect; do not rebuild",
  },
  {
    issue: 92966,
    title: "Remote Control GrowthBook 400 (Shibboleth)",
    state: "OPEN",
    citeOnly: true,
    product: "shibboleth",
    why: "Cite-only catalog cousin — RC GrowthBook 400; different defect; do not rebuild",
  },
  {
    issue: 92249,
    title: "Remote Control tool blanking (Deadlight)",
    state: "OPEN",
    citeOnly: true,
    product: "deadlight",
    why: "Cite-only catalog cousin — RC tool blanking; different defect; do not rebuild",
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
    issue: 93475,
    title:
      "[BUG] Effort selector (Alt+P / plan mode) requires very tall terminal to display; unusable at standard terminal heights",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title:
      "Read tool never triggers PreToolUse hooks for binary files (Desktop App, \"Code\" tab)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title:
      '[Bug] Agent dispatch with isolation:"worktree" causes cwd state bleed into parent session',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title:
      "[BUG] Desktop Directory → Plugins: duplicate cards, cards shown under the wrong marketplace, and no working uninstall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93495,
    title:
      "Claude Desktop 1.49585.0 freezes: main thread deadlocks on synchronous UNUserNotificationCenter XPC call (macOS, regression of #57706)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93469,
    title: "~/.claude silent reset",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93474,
    title: "LSP plugins missing lspServers",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export function inspectComposer(input = {}) {
  const dim =
    input.composerPaint === true ||
    input.dimComposer === true ||
    input.dimText === true ||
    input.event === "painted-composer" ||
    (input.painted === true && input.kindled !== true);
  const kindled =
    input.kindled === true ||
    (input.turnStarted === true && input.transcriptUserRow === true);
  const painted = dim && input.kindled !== true && !kindled;
  return {
    dim: painted,
    live: kindled && !painted,
    stamp: painted ? "painted" : "kindled",
    text: painted
      ? input.remoteMessage || REMOTE_MESSAGE
      : input.remoteMessage || null,
    note: painted
      ? "PTY output painted the remote message as dim composer text"
      : "composer is not a mere paint — the lantern kindled a real turn",
  };
}

export function inspectTranscript(input = {}) {
  const row =
    input.transcriptUserRow === true ||
    input.userRow === true ||
    (input.kindled === true && input.painted !== true);
  const missing =
    input.noTranscript === true ||
    input.transcriptUserRow === false ||
    (input.painted === true && input.kindled !== true && !row);
  const painted = missing && input.kindled !== true;
  return {
    userRow: row && !painted,
    missing: painted,
    stamp: painted ? "painted" : "kindled",
    note: painted
      ? "no corresponding transcript user row"
      : "transcript user row present — remote message became model input",
  };
}

export function inspectQueue(input = {}) {
  const enqueue =
    input.queueOperation === true ||
    input.queueEnqueue === true ||
    input.event === "queue-enqueue" ||
    (input.absorbedMidTurn === true && input.kindled !== false);
  const missing =
    input.noQueue === true ||
    input.queueOperation === false ||
    (input.painted === true &&
      input.kindled !== true &&
      input.absorbedMidTurn !== true &&
      !enqueue);
  const painted = missing && input.kindled !== true && !enqueue;
  return {
    enqueue: enqueue && !painted,
    missing: painted,
    stamp: painted ? "painted" : "kindled",
    note: painted
      ? "no transcript queue-operation row"
      : "queue-operation present — remote delivery enqueued or absorbed mid-turn",
  };
}

export function inspectTurn(input = {}) {
  const started =
    input.turnStarted === true ||
    input.absorbedMidTurn === true ||
    (input.kindled === true && input.painted !== true);
  const idle =
    input.sessionIdle === true ||
    input.neverTurns === true ||
    input.event === "never-turns" ||
    (input.painted === true && input.kindled !== true && !started);
  const painted = idle && input.kindled !== true && !started;
  return {
    started: started && !painted,
    idle: painted,
    stamp: painted ? "painted" : "kindled",
    note: painted
      ? "no turn began; session remains idle"
      : "turn started — remote message kindled a real user turn",
  };
}

export function inspectHooks(input = {}) {
  const clean =
    input.stopClean === true ||
    input.preventedFalse === true ||
    input.continueTrue === true ||
    input.event === "stop-clean" ||
    input.kindled === true ||
    input.painted === true;
  return {
    clean: clean || input.stopClean !== false,
    preventedContinuation: input.preventedContinuation === true,
    stamp: "kindled",
    note:
      "Stop hooks completed normally (continue:true then {}); preventedContinuation:false — hooks themselves do not prevent Remote Control delivery",
  };
}

export function readLantern(input = {}) {
  const composer = inspectComposer(input);
  const transcript = inspectTranscript(input);
  const queue = inspectQueue(input);
  const turn = inspectTurn(input);
  const hooks = inspectHooks(input);
  const painted =
    composer.stamp === "painted" ||
    transcript.stamp === "painted" ||
    queue.stamp === "painted" ||
    turn.stamp === "painted" ||
    input.painted === true;
  const kindled =
    input.kindled === true &&
    painted !== true &&
    composer.stamp === "kindled";
  return {
    composer,
    transcript,
    queue,
    turn,
    hooks,
    stations: LANTERN_STATIONS,
    painted: painted && !kindled,
    kindled:
      kindled ||
      (composer.stamp === "kindled" &&
        transcript.stamp === "kindled" &&
        queue.stamp === "kindled" &&
        turn.stamp === "kindled" &&
        input.painted !== true),
    mark: painted && !kindled ? "painted" : "kindled",
  };
}

/**
 * Published foxfire walk from #93502 only. Facts from the issue text.
 * A kindled booth turns a Remote Control message into a real user
 * turn (transcript user row + turn started). A painted booth is dim
 * composer text with no transcript, no queue-operation, and no turn.
 */
export const FOXFIRE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-kindled",
    kindled: true,
    painted: false,
    turnStarted: true,
    transcriptUserRow: true,
    queueOperation: true,
    stopClean: true,
    cue: "kindled",
    note: "idle HOLD: remote message became a real user turn; transcript user row + turn started; not mere composer paint",
  },
  {
    t: "stop",
    event: "stop-clean",
    stopClean: true,
    continueTrue: true,
    preventedFalse: true,
    kindled: true,
    assistantEnded: ASSISTANT_ENDED,
    hookContinueAt: HOOK_CONTINUE_AT,
    hookEmptyAt: HOOK_EMPTY_AT,
    stopSummaryAt: STOP_SUMMARY_AT,
    cue: "kindled",
    note: "Stop hooks completed normally (continue:true then {}); preventedContinuation:false at 21:38:02.199Z",
  },
  {
    t: "remote",
    event: "remote-submit",
    painted: true,
    dimComposer: true,
    sessionIdle: true,
    paintAt: PAINT_AT,
    paintLagSeconds: PAINT_LAG_SECONDS,
    remoteMessage: REMOTE_MESSAGE,
    cue: "painted",
    note: "1.44s after clean Stop, Remote Control submitted `build the F-831 control` to the idle CLI",
  },
  {
    t: "lantern",
    event: "painted-composer",
    painted: true,
    composerPaint: true,
    dimComposer: true,
    dimText: true,
    remoteMessage: REMOTE_MESSAGE,
    noPtyInput: true,
    cue: "painted",
    note: "PTY output painted remote message as dim composer text; no matching PTY input",
  },
  {
    t: "peat",
    event: "no-transcript",
    painted: true,
    noTranscript: true,
    transcriptUserRow: false,
    cue: "painted",
    note: "no corresponding transcript user row",
  },
  {
    t: "mist",
    event: "no-queue",
    painted: true,
    noQueue: true,
    queueOperation: false,
    cue: "painted",
    note: "no transcript queue-operation row",
  },
  {
    t: "path",
    event: "never-turns",
    neverTurns: true,
    painted: true,
    sessionIdle: true,
    turnStarted: false,
    cue: "painted",
    note: "never-turns — no turn began; session remains idle",
  },
  {
    t: "score",
    event: "foxfire",
    painted: true,
    composerPaint: true,
    noTranscript: true,
    noQueue: true,
    neverTurns: true,
    sessionIdle: true,
    cue: "painted",
    note: "foxfire — marsh glow that looks like fire but is not combustion; dim composer paint is not a real turn",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "mid",
    event: "queue-enqueue",
    kindled: true,
    midTurn: true,
    queueEnqueue: true,
    queueOperation: true,
    enqueueAt: QUEUE_ENQUEUE_AT,
    cue: "kindled",
    note: "positive control: message delivered while a turn was active produced transcript queue-operation enqueue at 21:47:05.062Z",
  },
  {
    t: "absorb",
    event: "absorbed-mid-turn",
    kindled: true,
    absorbedMidTurn: true,
    absorbReason: ABSORB_REASON,
    absorbedAt: ABSORBED_AT,
    absorbSeconds: ABSORB_SECONDS,
    turnStarted: true,
    transcriptUserRow: true,
    cue: "kindled",
    note: "removed with reason absorbed_mid_turn at 21:47:17.234Z; assistant followed it (~12.172s). Hooks do not prevent Remote Control delivery.",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    kindled: true,
    painted: false,
    turnStarted: true,
    transcriptUserRow: true,
    queueOperation: true,
    stopClean: true,
    cue: "kindled",
  };
}

export function seedKindled() {
  return { ...emptyTicket() };
}

export function seedPainted() {
  return {
    seed: SEEDED_WORD,
    kindled: false,
    painted: true,
    composerPaint: true,
    dimComposer: true,
    dimText: true,
    noTranscript: true,
    transcriptUserRow: false,
    noQueue: true,
    queueOperation: false,
    noPtyInput: true,
    neverTurns: true,
    sessionIdle: true,
    turnStarted: false,
    remoteMessage: REMOTE_MESSAGE,
    cue: "painted",
    issue: FEATURED_ISSUE,
  };
}

export function seedFoxfire() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    painted: true,
    composerPaint: true,
    noTranscript: true,
    noQueue: true,
    neverTurns: true,
    cue: "painted",
  };
}

export function seedNeverTurns() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    painted: true,
    neverTurns: true,
    sessionIdle: true,
    turnStarted: false,
    noTranscript: true,
    noQueue: true,
    cue: "painted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    kindled: true,
    cue: "kindled",
  };
}

export function seedComposerPaint() {
  return {
    seed: "composer-paint",
    preferSeed: true,
    composerPaint: true,
    cue: "painted",
  };
}

export function seedNoTranscript() {
  return {
    seed: "no-transcript",
    preferSeed: true,
    noTranscript: true,
    cue: "painted",
  };
}

export function seedNoQueue() {
  return {
    seed: "no-queue",
    preferSeed: true,
    noQueue: true,
    cue: "painted",
  };
}

export function seedNoPtyInput() {
  return {
    seed: "no-pty-input",
    preferSeed: true,
    noPtyInput: true,
    cue: "painted",
  };
}

export function seedStopClean() {
  return {
    seed: "stop-clean",
    preferSeed: true,
    stopClean: true,
    cue: "kindled",
  };
}

export function seedMidTurnAbsorbed() {
  return {
    seed: "mid-turn-absorbed",
    preferSeed: true,
    absorbedMidTurn: true,
    cue: "kindled",
  };
}

export function seedQueueEnqueue() {
  return {
    seed: "queue-enqueue",
    preferSeed: true,
    queueEnqueue: true,
    cue: "kindled",
  };
}

export function seedAbsorbedMidTurn() {
  return {
    seed: "absorbed-mid-turn",
    preferSeed: true,
    absorbedMidTurn: true,
    cue: "kindled",
  };
}

export function seedPreventedFalse() {
  return {
    seed: "prevented-false",
    preferSeed: true,
    preventedFalse: true,
    cue: "kindled",
  };
}

export function seedContinueTrue() {
  return {
    seed: "continue-true",
    preferSeed: true,
    continueTrue: true,
    cue: "kindled",
  };
}

export function seedDimText() {
  return {
    seed: "dim-text",
    preferSeed: true,
    dimText: true,
    cue: "painted",
  };
}

export function seedF831() {
  return {
    seed: "f-831",
    preferSeed: true,
    f831: true,
    remoteMessage: REMOTE_MESSAGE,
    cue: "painted",
  };
}

export function seedIdleAfterStop() {
  return {
    seed: "idle-after-stop",
    preferSeed: true,
    idleAfterStop: true,
    cue: "painted",
  };
}

export function seedNoDeliveryFailure() {
  return {
    seed: "no-delivery-failure",
    preferSeed: true,
    noDeliveryFailure: true,
    cue: "painted",
  };
}

export function seedWorkaround() {
  return {
    seed: "workaround",
    preferSeed: true,
    workaround: true,
    cue: "painted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      kindled: false,
      painted: false,
      composerPaint: false,
      dimComposer: false,
      dimText: false,
      noTranscript: false,
      transcriptUserRow: false,
      noQueue: false,
      queueOperation: false,
      queueEnqueue: false,
      noPtyInput: false,
      neverTurns: false,
      sessionIdle: false,
      turnStarted: false,
      stopClean: false,
      continueTrue: false,
      preventedFalse: false,
      preventedContinuation: false,
      absorbedMidTurn: false,
      midTurn: false,
      idleAfterStop: false,
      noDeliveryFailure: false,
      workaround: false,
      f831: false,
      remoteMessage: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    kindled: raw.kindled === true,
    painted: raw.painted === true,
    composerPaint:
      raw.composerPaint === true ||
      raw.dimComposer === true ||
      raw.event === "painted-composer",
    dimComposer: raw.dimComposer === true || raw.composerPaint === true,
    dimText: raw.dimText === true,
    noTranscript:
      raw.noTranscript === true ||
      raw.transcriptUserRow === false ||
      raw.event === "no-transcript",
    transcriptUserRow: raw.transcriptUserRow === true || raw.userRow === true,
    noQueue:
      raw.noQueue === true ||
      raw.queueOperation === false ||
      raw.event === "no-queue",
    queueOperation: raw.queueOperation === true,
    queueEnqueue: raw.queueEnqueue === true || raw.event === "queue-enqueue",
    noPtyInput: raw.noPtyInput === true || raw.event === "no-pty-input",
    neverTurns:
      raw.neverTurns === true ||
      raw.event === "never-turns",
    sessionIdle: raw.sessionIdle === true,
    turnStarted: raw.turnStarted === true,
    stopClean: raw.stopClean === true || raw.event === "stop-clean",
    continueTrue: raw.continueTrue === true,
    preventedFalse: raw.preventedFalse === true,
    preventedContinuation: raw.preventedContinuation === true,
    absorbedMidTurn:
      raw.absorbedMidTurn === true ||
      raw.event === "absorbed-mid-turn" ||
      raw.event === "mid-turn-absorbed",
    midTurn: raw.midTurn === true,
    idleAfterStop: raw.idleAfterStop === true,
    noDeliveryFailure: raw.noDeliveryFailure === true,
    workaround: raw.workaround === true,
    f831: raw.f831 === true,
    remoteMessage: raw.remoteMessage == null ? null : raw.remoteMessage,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.kindled != null ||
        ticket.painted != null ||
        ticket.composerPaint != null ||
        ticket.dimComposer != null ||
        ticket.noTranscript != null ||
        ticket.transcriptUserRow != null ||
        ticket.noQueue != null ||
        ticket.queueOperation != null ||
        ticket.neverTurns != null ||
        ticket.sessionIdle != null ||
        ticket.turnStarted != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isKindled(row) {
  if (row.painted && row.cue !== "kindled") return false;
  if (
    row.cue === "painted" ||
    row.cue === "foxfire" ||
    row.cue === "never-turns"
  ) {
    return false;
  }
  if (row.neverTurns && row.cue !== "kindled" && row.kindled !== true) {
    return false;
  }
  if (
    row.composerPaint &&
    row.noTranscript &&
    row.noQueue &&
    row.cue !== "kindled" &&
    row.kindled !== true
  ) {
    return false;
  }
  if (
    row.kindled === true &&
    row.painted !== true &&
    row.cue !== "painted"
  ) {
    return true;
  }
  if (
    row.cue === "kindled" &&
    row.painted !== true &&
    row.neverTurns !== true &&
    row.noTranscript !== true
  ) {
    return true;
  }
  if (
    row.transcriptUserRow === true &&
    row.turnStarted === true &&
    row.painted !== true &&
    row.neverTurns !== true
  ) {
    return true;
  }
  if (
    (row.absorbedMidTurn === true ||
      row.queueEnqueue === true ||
      row.stopClean === true) &&
    row.painted !== true &&
    row.neverTurns !== true
  ) {
    return true;
  }
  return false;
}

function isPainted(row) {
  if (isKindled(row)) return false;
  if (row.cue === "painted" || row.cue === "foxfire") return true;
  if (row.painted === true) return true;
  if (
    row.composerPaint === true ||
    row.neverTurns === true ||
    row.noTranscript === true ||
    row.noQueue === true ||
    (row.dimComposer === true && row.kindled !== true && row.turnStarted !== true)
  ) {
    return true;
  }
  if (
    row.sessionIdle &&
    (row.dimText || row.noPtyInput || row.idleAfterStop) &&
    row.kindled !== true
  ) {
    return true;
  }
  return false;
}

function isNeverTurnsPath(row) {
  return (
    row.event === "never-turns" &&
    !isKindled(row) &&
    (row.painted === true ||
      row.neverTurns === true ||
      row.sessionIdle === true)
  );
}

/**
 * Score one lantern pass against the foxfire booth.
 * kindled: remote message became a real user turn; transcript user row + turn started.
 * painted: dim composer text only; no transcript user row; no queue-operation; no turn.
 * never-turns: named path — session stays idle after composer paint.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isNeverTurnsPath(row) ||
    (row.neverTurns && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "never-turns";
  } else if (isPainted(row)) {
    verdict = "painted";
  } else if (isKindled(row)) {
    verdict = "kindled";
  } else if (
    row.composerPaint ||
    row.neverTurns ||
    row.noTranscript ||
    (row.dimComposer && !row.turnStarted)
  ) {
    verdict = "painted";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const composer = inspectComposer(row);
  const transcript = inspectTranscript(row);
  const queue = inspectQueue(row);
  const turn = inspectTurn(row);
  const hooks = inspectHooks(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    kindled: verdict === "kindled" || verdict === "hold",
    painted:
      verdict === "painted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    neverTurns:
      row.neverTurns === true ||
      verdict === "never-turns" ||
      verdict === PATH_WORD,
    composerPaint: row.composerPaint,
    dimComposer: row.dimComposer,
    dimText: row.dimText,
    noTranscript: row.noTranscript,
    transcriptUserRow: row.transcriptUserRow,
    noQueue: row.noQueue,
    queueOperation: row.queueOperation,
    queueEnqueue: row.queueEnqueue,
    noPtyInput: row.noPtyInput,
    sessionIdle: row.sessionIdle,
    turnStarted: row.turnStarted,
    stopClean: row.stopClean,
    continueTrue: row.continueTrue,
    preventedFalse: row.preventedFalse,
    preventedContinuation: row.preventedContinuation,
    absorbedMidTurn: row.absorbedMidTurn,
    midTurn: row.midTurn,
    idleAfterStop: row.idleAfterStop,
    noDeliveryFailure: row.noDeliveryFailure,
    workaround: row.workaround,
    f831: row.f831,
    remoteMessage: row.remoteMessage,
    cue: hold ? "kindled" : "painted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit kindled" : "score foxfire",
    composerInspect: composer,
    transcriptInspect: transcript,
    queueInspect: queue,
    turnInspect: turn,
    hookInspect: hooks,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : FOXFIRE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const painted = scored.filter((row) => row.verdict === "painted");
  const path = scored.filter((row) => row.verdict === "never-turns");
  const kindled = scored.filter((row) => row.verdict === "kindled");
  const headline =
    scored.find((row) => row.event === "painted-composer") ||
    scored.find((row) => row.event === "never-turns") ||
    scored.find((row) => row.event === "remote-submit") ||
    painted[painted.length - 1];
  let verdict = "kindled";
  if (painted.length) verdict = "painted";
  else if (path.length && !kindled.length) verdict = "never-turns";
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
    paintedCount: painted.length,
    pathCount: path.length,
    kindledCount: kindled.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit kindled" : "score foxfire",
    note: headline
      ? "Claude Code 2.1.267 macOS; Remote Control client claude.ai/code; idle CLI after a completed turn; PTY painted `build the F-831 control` as dim composer text 1.44s after clean Stop with no transcript user row, no queue-operation, and no turn."
      : "published foxfire walk scored against kindled vs painted",
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
    seeded !== "kindled" &&
    seeded !== "painted" &&
    seeded !== "never-turns" &&
    seeded !== "foxfire" &&
    ticket.kindled == null &&
    ticket.painted == null &&
    ticket.composerPaint == null &&
    ticket.noTranscript == null &&
    ticket.neverTurns == null &&
    ticket.dimComposer == null &&
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
    kindled: scored.kindled ?? false,
    painted: scored.painted ?? false,
    neverTurns: scored.neverTurns ?? false,
    composerPaint: scored.composerPaint ?? false,
    noTranscript: scored.noTranscript ?? false,
    noQueue: scored.noQueue ?? false,
    turnStarted: scored.turnStarted ?? false,
    sessionIdle: scored.sessionIdle ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.composerPaint || result.dimComposer
      ? "composer=dim"
      : "composer=kindled",
    result.transcriptUserRow
      ? "transcript=user-row"
      : "transcript=none",
    result.queueOperation || result.queueEnqueue
      ? "queue=enqueue"
      : "queue=none",
    result.turnStarted || result.absorbedMidTurn
      ? "turn=started"
      : "turn=idle",
    result.neverTurns || result.verdict === "never-turns"
      ? "path=never-turns"
      : "path=kindled",
    result.cue === "kindled" ? "cue=kindled" : "cue=painted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const lantern = readLantern({
    kindled: result.kindled,
    painted: result.painted,
    composerPaint: result.composerPaint,
    dimComposer: result.dimComposer,
    dimText: result.dimText,
    noTranscript: result.noTranscript,
    transcriptUserRow: result.transcriptUserRow,
    noQueue: result.noQueue,
    queueOperation: result.queueOperation,
    queueEnqueue: result.queueEnqueue,
    neverTurns: result.neverTurns,
    sessionIdle: result.sessionIdle,
    turnStarted: result.turnStarted,
    stopClean: result.stopClean,
    absorbedMidTurn: result.absorbedMidTurn,
    remoteMessage: result.remoteMessage,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    lantern,
    composer: inspectComposer({
      kindled: result.kindled,
      painted: result.painted,
      composerPaint: result.composerPaint,
      dimComposer: result.dimComposer,
      dimText: result.dimText,
      turnStarted: result.turnStarted,
      transcriptUserRow: result.transcriptUserRow,
      remoteMessage: result.remoteMessage,
    }),
    transcript: inspectTranscript({
      kindled: result.kindled,
      painted: result.painted,
      noTranscript: result.noTranscript,
      transcriptUserRow: result.transcriptUserRow,
    }),
    queue: inspectQueue({
      kindled: result.kindled,
      painted: result.painted,
      noQueue: result.noQueue,
      queueOperation: result.queueOperation,
      queueEnqueue: result.queueEnqueue,
      absorbedMidTurn: result.absorbedMidTurn,
    }),
    turn: inspectTurn({
      kindled: result.kindled,
      painted: result.painted,
      sessionIdle: result.sessionIdle,
      neverTurns: result.neverTurns,
      turnStarted: result.turnStarted,
      absorbedMidTurn: result.absorbedMidTurn,
    }),
    hooks: inspectHooks({
      kindled: result.kindled,
      painted: result.painted,
      stopClean: result.stopClean,
      continueTrue: result.continueTrue,
      preventedFalse: result.preventedFalse,
    }),
    stations: LANTERN_STATIONS.map((row) => ({
      ...row,
      painted: result.painted === true || result.verdict === "painted",
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
      sessionKind: SESSION_KIND,
      remoteMessage: REMOTE_MESSAGE,
      assistantEnded: ASSISTANT_ENDED,
      hookContinueAt: HOOK_CONTINUE_AT,
      hookEmptyAt: HOOK_EMPTY_AT,
      stopSummaryAt: STOP_SUMMARY_AT,
      paintAt: PAINT_AT,
      paintLagSeconds: PAINT_LAG_SECONDS,
      queueEnqueueAt: QUEUE_ENQUEUE_AT,
      absorbedAt: ABSORBED_AT,
      absorbSeconds: ABSORB_SECONDS,
      absorbReason: ABSORB_REASON,
      stations: LANTERN_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "a Remote Control message submitted to an idle CLI becomes a user turn without local terminal input",
        "the message appears as a transcript user row, not only as dim composer paint",
        "a queue-operation records delivery when the session is idle, just as mid-turn enqueue/absorb already does",
        "remote users receive a delivery failure if the idle path cannot start a turn",
      ],
      hypothesis:
        "NON-BINDING: idle path may paint PTY composer without enqueueing a turn / queue-operation after a clean Stop. The mid-turn positive control (queue-operation enqueue, absorbed_mid_turn, assistant followed) shows hooks themselves do not prevent Remote Control delivery. Verify against #93502 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
