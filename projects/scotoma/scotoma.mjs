#!/usr/bin/env node
/**
 * Scotoma — ophthalmology / Humphrey-style visual-field / perimetry booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code 2.1.268; macOS 15 (Darwin 25.5.0), Apple Silicon, zsh;
 * Opus 5 (1M context). A goal set with `/goal <instruction>` is stored
 * in the transcript only inside `<command-args>`. The Stop-condition
 * evaluator appears not to read that field, so it repeatedly fires,
 * cannot confirm the goal, and eventually reports its own condition
 * as unachievable — while the goal text was present in the transcript
 * the whole time. Unattended long-running session interrupted ~9
 * times; last firings produced no new work. Slash-command scan of the
 * session JSONL returns only two entries (`/clear` at line 7, `/goal`
 * at line 12). Not caused by a user Stop hook — the user's only Stop
 * hook is a fail-open telemetry shim that never inspects goal state
 * or command metadata.
 *
 *   node scotoma.mjs data/scotomized.json
 *   echo '{"seed":"scotomized"}' | node scotoma.mjs
 *
 * Idle word is legible (HOLD: goal instruction readable by the
 * evaluator path; field clear).
 * Seeded word is scotomized (#93744 — goal exists only in
 * command-args and the evaluator cannot confirm).
 * Path word is command-args-blind.
 * Product score word is scotoma (Score scotoma or admit legible.).
 *
 * Encoded from anthropics/claude-code#93744 issue text only.
 * Hypothesis (NON-BINDING): the Stop-condition evaluator does not
 * read `<command-args>`, the only field that stores the `/goal`
 * instruction, so it cannot confirm the goal and keeps re-firing
 * until it declares the condition unachievable. Confirming that the
 * evaluator truly cannot see `<command-args>` requires internal
 * knowledge — that part is inferred from the observed behavior, not
 * verified from source. Verify against #93744 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "legible",
  "scotomized",
  "scotoma",
  "command-args-blind",
  "hold",
  "goal-readable",
  "field-clear",
  "evaluator-sees",
  "command-args-only",
  "no-user-message-goal",
  "stop-loop-nine",
  "unachievable-declare",
  "slash-scan-present",
  "fail-open-hook",
  "not-user-hook",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "legible";
export const PATH_WORD = "command-args-blind";
export const SEEDED_WORD = "scotomized";
export const PRODUCT_WORD = "scotoma";
export const HOLD = Object.freeze(["legible", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "legible",
  "goal-readable",
  "field-clear",
  "evaluator-sees",
]);
export const RECOVER = Object.freeze(["legible", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "unreaped-ampersand",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
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
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scotomized" && name !== "scotoma"),
);

export const FEATURED_ISSUE = 93744;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93744";
export const TITLE =
  "/goal: Stop condition evaluator cannot see the instruction passed via /goal, loops until it declares itself unachievable";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "Claude Code 2.1.268";
export const GOOD_VERSION =
  "evaluator reads the /goal instruction from <command-args> (or a persisted session goal field) and Stop stops re-firing once unachievable";
export const SURFACE = "stop-condition-evaluator";
export const HOST = "macos-darwin";
export const INSTALL_PATH = "~/.claude/projects/<project>/<session>.jsonl";
export const COMMAND =
  "/goal Read plans/<file>.md and proceed. Discuss with the reviewer from the planning stage on.";
export const PHRASE = "Score scotoma or admit legible.";
export const STOP_FIRINGS = 9;
export const SLASH_CLEAR_LINE = 7;
export const SLASH_GOAL_LINE = 12;
export const GOAL_INSTRUCTION =
  "Read plans/<file>.md and proceed. Discuss with the reviewer from the planning stage on. I'm going to sleep, so decide the suitable direction yourselves and complete as much of the project goal as you can.";
export const DISTRIBUTION =
  "Claude Code 2.1.268; macOS 15 (Darwin 25.5.0), Apple Silicon, zsh; Opus 5 (1M context). Observed 2026-09-12, unattended overnight session. A goal set with `/goal <instruction>` is stored in the transcript only inside `<command-args>`. There is no separate user-message record carrying that text. A scan of the transcript for slash-command records returns only two entries for the whole session (`/clear` at line 7, `/goal` at line 12). Despite that, Stop fired ~9 times, each time unable to confirm the goal, and the final firing stated the condition was structurally unachievable. Last several firings produced no new work. This was not caused by a user hook — the user's only Stop hook is a fail-open telemetry shim that never inspects goal, command-args, or command-name. Confirming whether the evaluator truly cannot see `<command-args>` requires internal knowledge — inferred from the observed behavior, not verified from source.";
export const RULED_OUT = Object.freeze([
  "A user Stop hook inspecting goal state — the user's only Stop hook is a fail-open telemetry shim with no reference to goal, command-args, or command-name",
  "#83266 — /goal Stop hook skipped while a background task is live and never re-evaluated when it ends; different problem: here Stop does fire, repeatedly, and cannot see the instruction",
  "#85182 — /goal stalls in plan mode because Stop cannot fire on a plan-approval prompt; different problem: here Stop fires ~9 times and then declares unachievable",
  "#79981 — built-in /goal should be case-insensitive; different problem: command matching, not evaluator reading command-args",
  "#90558 — allow the built-in /goal Stop hook under allowManagedHooksOnly; different ask: hook eligibility, not a scotoma over command-args",
]);
export const EXPECTED = Object.freeze([
  "The Stop-condition evaluator should read the goal from <command-args> (the only place it is stored)",
  "/goal should additionally persist the goal in a field the evaluator does read (e.g. session-level goal state)",
  "When the evaluator determines its condition can never be satisfied, it should stop re-firing instead of looping",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "args-only", label: "command-args", count: "only", note: "goal instruction stored only inside <command-args> on a type:user command-metadata record" },
  { id: "no-user-msg", label: "no user-message", count: "absent", note: "no separate user-message record carries the /goal instruction" },
  { id: "stop-nine", label: "Stop loop", count: "~9", note: "unattended session interrupted ~9 times; last firings produced no new work" },
  { id: "unachievable", label: "unachievable", count: "final", note: "final firing declared the condition structurally unachievable while the goal text was present" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "legible-gate",
    survey: "goal instruction readable by the evaluator path; field clear",
    kind: "legible",
    note: "idle: the perimetry chart has no scotoma over command-args — the hold/good path",
  },
  {
    id: "command-args-only",
    survey: "instruction exists in exactly one place — <command-name>/goal</command-name> plus <command-args>…",
    kind: "scotomized",
    note: "seeded: the goal is written on the chart in the command-args sector",
  },
  {
    id: "no-user-message-goal",
    survey: "no separate user-message record carrying that text",
    kind: "scotomized",
    note: "seeded: the evaluator's usual isopter does not cross that sector",
  },
  {
    id: "stop-loop-nine",
    survey: "Stop fired ~9 times, each time unable to confirm the goal",
    kind: "scotomized",
    note: "seeded: the bowl keeps presenting the same missed stimulus",
  },
  {
    id: "command-args-blind",
    survey: "evaluator appears not to read <command-args>; final firing declares unachievable",
    kind: "scotomized",
    note: "path: command-args-blind names the scotoma over the only field that holds the goal",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "command-args-blind",
  "scotomized",
  "command-args-only",
  "no-user-message-goal",
  "stop-loop-nine",
]);

export const COUSINS = Object.freeze([
  {
    issue: 83266,
    title: "[BUG] /goal Stop hook is skipped while a background task is live and never re-evaluated when it ends, leaving the session idle indefinitely",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Stop never fires while a background task is live; different problem: here Stop fires ~9 times and cannot see command-args — do not re-ship",
  },
  {
    issue: 85182,
    title: "[BUG] /goal stalls indefinitely when the model enters plan mode — the Stop hook cannot fire on a plan-approval prompt",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Stop cannot fire on a plan-approval prompt; different problem: here Stop fires and then declares unachievable — do not re-ship",
  },
  {
    issue: 79981,
    title: "Built-in slash commands (e.g. /goal) should be case-insensitive, or the \"Unknown command\" error should suggest a close match",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — command matching / case; different problem: evaluator reading command-args — do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93862, title: "backup #93862 (socat race)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93859, title: "backup #93859 (desktop session fork)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93863, title: "backup #93863 (getcwd EPERM)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889 (orphan bash)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
  "flashpan",
  "guillotine",
  "parergon",
  "followspot",
  "calends",
  "alidade",
  "diopter",
  "sluice",
]);

export const SAMPLE_LEGIBLE_CHART = Object.freeze({
  commandArgsPresent: true,
  evaluatorReadsCommandArgs: true,
  userMessageGoal: true,
  sessionGoalField: true,
  stopFirings: 0,
  unachievable: false,
  version: GOOD_VERSION,
});

export const SAMPLE_SCOTOMIZED_CHART = Object.freeze({
  commandArgsPresent: true,
  evaluatorReadsCommandArgs: false,
  userMessageGoal: false,
  sessionGoalField: false,
  stopFirings: STOP_FIRINGS,
  unachievable: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_COMMAND_ARGS_ONLY = Object.freeze({
  store: "<command-name>/goal</command-name><command-args>Read plans/<file>.md and proceed. …</command-args>",
  type: "user",
  commandName: "/goal",
  commandArgsOnly: true,
  userMessageGoal: false,
  sessionGoalField: false,
});

export const SAMPLE_GOAL_READABLE = Object.freeze({
  store: "session-level goal state plus <command-args>",
  type: "user",
  commandName: "/goal",
  commandArgsOnly: false,
  userMessageGoal: true,
  sessionGoalField: true,
});

export const SAMPLE_EVALUATOR_BLIND = Object.freeze({
  readsCommandArgs: false,
  confirmsGoal: false,
  missedSector: "command-args",
  inferredNotSourced: true,
});

export const SAMPLE_EVALUATOR_SEES = Object.freeze({
  readsCommandArgs: true,
  confirmsGoal: true,
  missedSector: null,
  inferredNotSourced: false,
});

export const SAMPLE_STOP_LOOP = Object.freeze({
  firings: STOP_FIRINGS,
  lastFiringsNoNewWork: true,
  unachievable: true,
  looping: true,
});

export const SAMPLE_STOP_QUIET = Object.freeze({
  firings: 0,
  lastFiringsNoNewWork: false,
  unachievable: false,
  looping: false,
});

export const SAMPLE_SLASH_SCAN = Object.freeze({
  entries: 2,
  clearLine: SLASH_CLEAR_LINE,
  goalLine: SLASH_GOAL_LINE,
  commands: ["/clear", "/goal"],
  goalPresent: true,
});

export const SAMPLE_FAIL_OPEN_HOOK = Object.freeze({
  userHook: true,
  failOpenTelemetry: true,
  inspectsGoal: false,
  inspectsCommandArgs: false,
  inspectsCommandName: false,
  causedTheLoop: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds legible: goal instruction readable by the evaluator path; field clear" },
  { t: "command-args-only", line: "instruction exists in exactly one place — <command-name>/goal</command-name> plus <command-args>" },
  { t: "no-user-message-goal", line: "no separate user-message record carrying that text" },
  { t: "stop-loop-nine", line: "Stop fired ~9 times, each time unable to confirm the goal" },
  { t: "path", line: "command-args-blind — evaluator appears not to read <command-args>; slash scan still shows /goal at line 12" },
  { t: "score", line: "when the perimetry chart has a scotoma over command-args the booth is scotoma — Score scotoma or admit legible." },
]);

/**
 * Humphrey-style field map: which sectors the evaluator sees.
 * Idle/legible: command-args stimulus is detected (field clear).
 * Seeded/scotomized: command-args stimulus is present but missed.
 */
export function mapField(input = {}) {
  const firings = Number(input.stopFirings ?? input.firings ?? STOP_FIRINGS);
  const legible = input.legible === true && input.scotomized !== true;
  const commandArgsPresent = input.commandArgsPresent !== false;
  const evaluatorSees = legible;
  const missed = !evaluatorSees && commandArgsPresent;
  return {
    commandArgsPresent,
    evaluatorSees,
    userMessageGoal: evaluatorSees,
    sessionGoalField: evaluatorSees,
    missedSector: missed ? "command-args" : null,
    stopFirings: evaluatorSees ? 0 : firings,
    reliability: {
      fixationLosses: evaluatorSees ? 0 : firings,
      falseNegatives: evaluatorSees ? 0 : 1,
      falsePositives: 0,
    },
    dB: evaluatorSees ? 32 : 0,
    stamp: missed ? "command-args-blind" : "field-clear",
    note: missed
      ? "stimulus present in command-args; evaluator miss — scotoma over that sector"
      : "command-args stimulus detected; field clear",
  };
}

export function inspectGoalStore(input = {}) {
  const store =
    input.store && typeof input.store === "object"
      ? input.store
      : input.legible === true && input.scotomized !== true
        ? SAMPLE_GOAL_READABLE
        : SAMPLE_COMMAND_ARGS_ONLY;
  const forced =
    input.commandArgsOnly === true ||
    input.noUserMessageGoal === true ||
    input.event === "command-args-only" ||
    input.event === "no-user-message-goal" ||
    input.event === "scotomized" ||
    input.event === "scotoma" ||
    input.scotomized === true;
  const argsOnly = forced ? true : store.commandArgsOnly === true && input.legible !== true;
  return {
    commandArgsOnly: argsOnly,
    userMessageGoal: !argsOnly,
    sessionGoalField: !argsOnly,
    commandName: "/goal",
    stamp: argsOnly ? "command-args-only" : "goal-readable",
    note: argsOnly
      ? "instruction exists in exactly one place — a type:user record whose content is command metadata"
      : "goal persisted in a field the evaluator reads (session goal or user-message)",
  };
}

export function inspectEvaluator(input = {}) {
  const ev =
    input.evaluator && typeof input.evaluator === "object"
      ? input.evaluator
      : input.legible === true && input.scotomized !== true
        ? SAMPLE_EVALUATOR_SEES
        : SAMPLE_EVALUATOR_BLIND;
  const forced =
    input.commandArgsBlind === true ||
    input.event === "command-args-blind" ||
    input.event === "scotomized" ||
    input.event === "scotoma" ||
    input.scotomized === true;
  const blind = forced ? true : ev.readsCommandArgs !== true && input.legible !== true;
  return {
    readsCommandArgs: !blind,
    confirmsGoal: !blind,
    missedSector: blind ? "command-args" : null,
    inferredNotSourced: blind,
    stamp: blind ? "command-args-blind" : "evaluator-sees",
    note: blind
      ? "Stop-condition evaluator appears not to read <command-args> — inferred from observed behavior, not verified from source"
      : "evaluator reads the /goal instruction from command-args or session goal state",
  };
}

export function inspectStopLoop(input = {}) {
  const loop =
    input.stop && typeof input.stop === "object"
      ? input.stop
      : input.legible === true && input.scotomized !== true
        ? SAMPLE_STOP_QUIET
        : SAMPLE_STOP_LOOP;
  const forced =
    input.stopLoopNine === true ||
    input.unachievableDeclare === true ||
    input.event === "stop-loop-nine" ||
    input.event === "unachievable-declare" ||
    input.event === "scotomized" ||
    input.event === "scotoma" ||
    input.scotomized === true;
  const looping = forced ? true : loop.looping === true && input.legible !== true;
  return {
    firings: looping ? loop.firings || STOP_FIRINGS : 0,
    lastFiringsNoNewWork: looping,
    unachievable: looping,
    looping,
    stamp: looping ? "stop-loop-nine" : "stop-quiet",
    note: looping
      ? "Stop fired ~9 times; final firing declared the condition structurally unachievable"
      : "Stop does not loop; goal is confirmable or the evaluator stops once unachievable",
  };
}

export function inspectSlashScan(input = {}) {
  const scan =
    input.slash && typeof input.slash === "object"
      ? input.slash
      : SAMPLE_SLASH_SCAN;
  const forced =
    input.slashScanPresent === true ||
    input.event === "slash-scan-present" ||
    input.event === "scotomized" ||
    input.event === "scotoma" ||
    input.scotomized === true;
  const present = forced || scan.goalPresent === true || input.legible === true;
  return {
    entries: scan.entries || 2,
    clearLine: scan.clearLine || SLASH_CLEAR_LINE,
    goalLine: scan.goalLine || SLASH_GOAL_LINE,
    commands: scan.commands || ["/clear", "/goal"],
    goalPresent: present,
    stamp: present ? "slash-scan-present" : "slash-scan-empty",
    note: present
      ? "/clear at line 7, /goal at line 12 — the slash scan shows /goal present"
      : "no slash-command /goal record in the transcript",
  };
}

export function inspectHook(input = {}) {
  const hook =
    input.hook && typeof input.hook === "object"
      ? input.hook
      : SAMPLE_FAIL_OPEN_HOOK;
  const forced =
    input.failOpenHook === true ||
    input.notUserHook === true ||
    input.event === "fail-open-hook" ||
    input.event === "not-user-hook" ||
    input.event === "scotomized" ||
    input.event === "scotoma";
  const failOpen = forced ? true : hook.failOpenTelemetry === true && hook.causedTheLoop !== true;
  return {
    userHook: true,
    failOpenTelemetry: failOpen,
    inspectsGoal: false,
    inspectsCommandArgs: false,
    inspectsCommandName: false,
    causedTheLoop: false,
    stamp: failOpen ? "fail-open-hook" : "hook-implicated",
    note: failOpen
      ? "fail-open telemetry shim never inspects goal, command-args, or command-name — not the cause"
      : "user hook would have to inspect goal state to be implicated; published hook does not",
  };
}

export function readBooth(input = {}) {
  const store = inspectGoalStore(input);
  const ev = inspectEvaluator(input);
  const loop = inspectStopLoop(input);
  const slash = inspectSlashScan(input);
  const hook = inspectHook(input);
  const scotomized =
    input.legible !== true &&
    ((store.commandArgsOnly === true && ev.readsCommandArgs === false) ||
      input.scotomized === true);
  const legible =
    input.legible === true && scotomized !== true && ev.readsCommandArgs === true;
  const path =
    (input.event === "command-args-blind" || input.commandArgsBlind === true) &&
    (ev.readsCommandArgs === false || input.scotomized === true);
  return {
    store,
    ev,
    loop,
    slash,
    hook,
    field: mapField(input),
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    scotomized: scotomized && !legible && !path,
    legible: legible || (!scotomized && !path && input.scotomized !== true && input.commandArgsBlind !== true && ev.readsCommandArgs !== false),
    commandArgsBlind: path && !legible,
    mark:
      path && !legible
        ? "command-args-blind"
        : scotomized && !legible
          ? "scotomized"
          : "legible",
  };
}

/**
 * Published scotoma walk from #93744 only. Facts from the issue text.
 * A legible booth lets the evaluator read the /goal instruction.
 * A scotomized booth stores the goal only in command-args.
 * A command-args-blind booth names that path.
 */
export const SCOTOMA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-legible",
    legible: true,
    scotomized: false,
    cue: "legible",
    note: "idle HOLD: goal instruction readable by the evaluator path; field clear — the hold/good path",
  },
  {
    t: "command-args-only",
    event: "command-args-only",
    scotomized: true,
    commandArgsOnly: true,
    cue: "scotomized",
    note: "instruction exists in exactly one place — <command-name>/goal</command-name> plus <command-args>",
  },
  {
    t: "no-user-message-goal",
    event: "no-user-message-goal",
    scotomized: true,
    noUserMessageGoal: true,
    cue: "scotomized",
    note: "no separate user-message record carrying that text",
  },
  {
    t: "stop-loop-nine",
    event: "stop-loop-nine",
    scotomized: true,
    stopLoopNine: true,
    cue: "scotomized",
    note: "Stop fired ~9 times, each time unable to confirm the goal",
  },
  {
    t: "path",
    event: "command-args-blind",
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    cue: "scotomized",
    note: "command-args-blind — evaluator appears not to read <command-args>",
  },
  {
    t: "score",
    event: "scotoma",
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    stopLoopNine: true,
    unachievableDeclare: true,
    cue: "scotomized",
    note: "scotoma — when the chart has a blind spot over command-args the evaluator keeps declaring unachievable",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-legible",
    legible: true,
    scotomized: false,
    cue: "legible",
    note: "positive control: evaluator reads the /goal instruction; field clear",
  },
  {
    t: "announce",
    event: "cue-legible",
    legible: true,
    cue: "legible",
    note: "positive control: the field stays legible",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    legible: true,
    scotomized: false,
    commandArgsBlind: false,
    cue: "legible",
  };
}

export function seedLegible() {
  return { ...emptyTicket() };
}

export function seedScotomized() {
  return {
    seed: SEEDED_WORD,
    legible: false,
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    stopLoopNine: true,
    unachievableDeclare: true,
    slashScanPresent: true,
    failOpenHook: true,
    notUserHook: true,
    legibleSurface: false,
    cue: "scotomized",
    issue: FEATURED_ISSUE,
    store: SAMPLE_COMMAND_ARGS_ONLY,
    evaluator: SAMPLE_EVALUATOR_BLIND,
    stop: SAMPLE_STOP_LOOP,
    slash: SAMPLE_SLASH_SCAN,
    hook: SAMPLE_FAIL_OPEN_HOOK,
  };
}

export function seedScotoma() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    stopLoopNine: true,
    unachievableDeclare: true,
    cue: "scotomized",
  };
}

export function seedCommandArgsBlind() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scotomized: true,
    commandArgsBlind: true,
    commandArgsOnly: true,
    noUserMessageGoal: true,
    event: "command-args-blind",
    cue: "scotomized",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    legible: true,
    cue: "legible",
  };
}

export function seedCommandArgsOnly() {
  return {
    seed: "command-args-only",
    preferSeed: true,
    commandArgsOnly: true,
    cue: "scotomized",
  };
}

export function seedNoUserMessageGoal() {
  return {
    seed: "no-user-message-goal",
    preferSeed: true,
    noUserMessageGoal: true,
    cue: "scotomized",
  };
}

export function seedStopLoopNine() {
  return {
    seed: "stop-loop-nine",
    preferSeed: true,
    stopLoopNine: true,
    cue: "scotomized",
  };
}

export function seedUnachievableDeclare() {
  return {
    seed: "unachievable-declare",
    preferSeed: true,
    unachievableDeclare: true,
    cue: "scotomized",
  };
}

export function seedSlashScanPresent() {
  return {
    seed: "slash-scan-present",
    preferSeed: true,
    slashScanPresent: true,
    cue: "scotomized",
  };
}

export function seedFailOpenHook() {
  return {
    seed: "fail-open-hook",
    preferSeed: true,
    failOpenHook: true,
    cue: "scotomized",
  };
}

export function seedNotUserHook() {
  return {
    seed: "not-user-hook",
    preferSeed: true,
    notUserHook: true,
    cue: "scotomized",
  };
}

export function seedGoalReadable() {
  return {
    seed: "goal-readable",
    preferSeed: true,
    legible: true,
    cue: "legible",
  };
}

export function seedFieldClear() {
  return {
    seed: "field-clear",
    preferSeed: true,
    legible: true,
    cue: "legible",
  };
}

export function seedEvaluatorSees() {
  return {
    seed: "evaluator-sees",
    preferSeed: true,
    legible: true,
    cue: "legible",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      legible: false,
      scotomized: false,
      commandArgsBlind: false,
      commandArgsOnly: false,
      noUserMessageGoal: false,
      stopLoopNine: false,
      unachievableDeclare: false,
      slashScanPresent: false,
      failOpenHook: false,
      notUserHook: false,
      legibleSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    legible: raw.legible === true,
    scotomized:
      raw.scotomized === true ||
      raw.event === "scotomized" ||
      raw.event === "scotoma",
    commandArgsBlind:
      raw.commandArgsBlind === true || raw.event === "command-args-blind",
    commandArgsOnly: raw.commandArgsOnly === true || raw.event === "command-args-only",
    noUserMessageGoal: raw.noUserMessageGoal === true || raw.event === "no-user-message-goal",
    stopLoopNine: raw.stopLoopNine === true || raw.event === "stop-loop-nine",
    unachievableDeclare: raw.unachievableDeclare === true || raw.event === "unachievable-declare",
    slashScanPresent: raw.slashScanPresent === true || raw.event === "slash-scan-present",
    failOpenHook: raw.failOpenHook === true || raw.event === "fail-open-hook",
    notUserHook: raw.notUserHook === true || raw.event === "not-user-hook",
    legibleSurface: raw.legibleSurface === true || raw.event === "goal-readable",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    store: raw.store,
    evaluator: raw.evaluator,
    stop: raw.stop,
    slash: raw.slash,
    hook: raw.hook,
    chart: raw.chart,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.legible != null ||
        ticket.scotomized != null ||
        ticket.commandArgsBlind != null ||
        ticket.commandArgsOnly != null ||
        ticket.noUserMessageGoal != null ||
        ticket.stopLoopNine != null ||
        ticket.unachievableDeclare != null ||
        ticket.slashScanPresent != null ||
        ticket.failOpenHook != null ||
        ticket.notUserHook != null ||
        ticket.legibleSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.store ||
        ticket.evaluator ||
        ticket.stop ||
        ticket.slash ||
        ticket.hook),
  );
}

function isLegible(row) {
  if (row.scotomized && row.cue !== "legible") return false;
  if (
    row.cue === "scotomized" ||
    row.cue === "scotoma" ||
    row.cue === "command-args-blind"
  ) {
    return false;
  }
  if (
    row.commandArgsBlind &&
    row.commandArgsOnly &&
    row.cue !== "legible" &&
    row.legible !== true
  ) {
    return false;
  }
  if (
    row.commandArgsBlind &&
    row.noUserMessageGoal &&
    row.cue !== "legible" &&
    row.legible !== true
  ) {
    return false;
  }
  if (row.legible === true && row.scotomized !== true && row.cue !== "scotomized") {
    return true;
  }
  if (
    row.cue === "legible" &&
    row.scotomized !== true &&
    row.commandArgsBlind !== true &&
    row.commandArgsOnly !== true &&
    row.noUserMessageGoal !== true
  ) {
    return true;
  }
  return false;
}

function isCommandArgsBlindPath(row) {
  return (
    row.event === "command-args-blind" &&
    !isLegible(row) &&
    (row.commandArgsBlind === true ||
      row.commandArgsOnly === true ||
      row.noUserMessageGoal === true)
  );
}

function isScotomized(row) {
  if (isLegible(row)) return false;
  if (isCommandArgsBlindPath(row) && row.cue !== "scotomized") return false;
  if (row.cue === "scotomized" || row.cue === "scotoma") return true;
  if (row.scotomized === true) return true;
  if (
    row.commandArgsBlind === true &&
    row.commandArgsOnly === true &&
    row.noUserMessageGoal === true
  ) {
    return true;
  }
  if (row.commandArgsBlind === true && row.commandArgsOnly === true) {
    return true;
  }
  if (
    row.commandArgsOnly === true ||
    row.noUserMessageGoal === true ||
    row.stopLoopNine === true ||
    row.unachievableDeclare === true ||
    (row.commandArgsBlind === true && row.noUserMessageGoal === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one scotoma pass against the perimetry chart.
 * legible: goal instruction readable by the evaluator path; field clear.
 * scotomized / scotoma: goal only in command-args; evaluator cannot confirm.
 * command-args-blind: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCommandArgsBlindPath(row) ||
    (row.commandArgsBlind && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "command-args-blind";
  } else if (isScotomized(row)) {
    verdict = "scotoma";
  } else if (isLegible(row)) {
    verdict = "legible";
  } else if (
    row.commandArgsBlind ||
    row.commandArgsOnly ||
    row.noUserMessageGoal ||
    (row.stopLoopNine && !row.legible)
  ) {
    verdict = "scotoma";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const store = inspectGoalStore(row);
  const ev = inspectEvaluator(row);
  const loop = inspectStopLoop(row);
  const slash = inspectSlashScan(row);
  const hook = inspectHook(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    legible: verdict === "legible" || verdict === "hold",
    scotomized:
      verdict === "scotomized" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    commandArgsBlind:
      row.commandArgsBlind === true ||
      verdict === "command-args-blind" ||
      verdict === PATH_WORD,
    commandArgsOnly: row.commandArgsOnly,
    noUserMessageGoal: row.noUserMessageGoal,
    stopLoopNine: row.stopLoopNine,
    unachievableDeclare: row.unachievableDeclare,
    slashScanPresent: row.slashScanPresent,
    failOpenHook: row.failOpenHook,
    notUserHook: row.notUserHook,
    legibleSurface: row.legibleSurface,
    cue: hold
      ? "legible"
      : row.commandArgsBlind || verdict === "command-args-blind"
        ? "command-args-blind"
        : "scotomized",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit legible" : "score scotoma",
    storeInspect: store,
    evaluatorInspect: ev,
    stopInspect: loop,
    slashInspect: slash,
    hookInspect: hook,
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
      : SCOTOMA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "scotoma" || row.verdict === "scotomized",
  );
  const path = scored.filter((row) => row.verdict === "command-args-blind");
  const legible = scored.filter((row) => row.verdict === "legible");
  const headline =
    scored.find((row) => row.event === "scotomized") ||
    scored.find((row) => row.event === "command-args-blind") ||
    scored.find((row) => row.event === "command-args-only") ||
    dead[dead.length - 1];
  let verdict = "legible";
  if (dead.length) verdict = "scotoma";
  else if (path.length && !legible.length) verdict = "command-args-blind";
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
    scotomizedCount: dead.length,
    pathCount: path.length,
    legibleCount: legible.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit legible" : "score scotoma",
    note: headline
      ? "goal stored only in <command-args>; evaluator cannot confirm; Stop fired ~9 times then declared unachievable. Cousins #83266 #85182 #79981 are cite-only."
      : "published scotoma walk scored against legible vs scotomized",
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
    seeded !== "legible" &&
    seeded !== "scotomized" &&
    seeded !== "command-args-blind" &&
    seeded !== "scotoma" &&
    ticket.legible == null &&
    ticket.scotomized == null &&
    ticket.commandArgsBlind == null &&
    ticket.commandArgsOnly == null &&
    ticket.noUserMessageGoal == null &&
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
    legible: scored.legible ?? false,
    scotomized: scored.scotomized ?? false,
    commandArgsBlind: scored.commandArgsBlind ?? false,
    commandArgsOnly: scored.commandArgsOnly ?? false,
    noUserMessageGoal: scored.noUserMessageGoal ?? false,
    stopLoopNine: scored.stopLoopNine ?? false,
    unachievableDeclare: scored.unachievableDeclare ?? false,
    slashScanPresent: scored.slashScanPresent ?? false,
    failOpenHook: scored.failOpenHook ?? false,
    notUserHook: scored.notUserHook ?? false,
    legibleSurface: scored.legibleSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.commandArgsOnly || result.scotomized ? "store=command-args" : "store=readable",
    result.noUserMessageGoal || result.scotomized ? "user-msg=absent" : "user-msg=present",
    result.stopLoopNine || result.scotomized ? "stop=~9" : "stop=quiet",
    result.commandArgsBlind || result.verdict === "command-args-blind"
      ? "path=command-args-blind"
      : "path=legible",
    result.cue === "legible"
      ? "cue=legible"
      : result.cue === "command-args-blind"
        ? "cue=command-args-blind"
        : "cue=scotomized",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    legible: result.legible,
    scotomized: result.scotomized,
    commandArgsBlind: result.commandArgsBlind,
    commandArgsOnly: result.commandArgsOnly,
    noUserMessageGoal: result.noUserMessageGoal,
    stopLoopNine: result.stopLoopNine,
    unachievableDeclare: result.unachievableDeclare,
    slashScanPresent: result.slashScanPresent,
    failOpenHook: result.failOpenHook,
    notUserHook: result.notUserHook,
    legibleSurface: result.legibleSurface,
    store: input && input.store,
    evaluator: input && input.evaluator,
    stop: input && input.stop,
    slash: input && input.slash,
    hook: input && input.hook,
    chart: input && input.chart,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    store: inspectGoalStore({
      legible: result.legible,
      scotomized: result.scotomized,
      commandArgsOnly: result.commandArgsOnly,
      noUserMessageGoal: result.noUserMessageGoal,
      store: input && input.store,
    }),
    evaluator: inspectEvaluator({
      legible: result.legible,
      scotomized: result.scotomized,
      commandArgsBlind: result.commandArgsBlind,
      evaluator: input && input.evaluator,
    }),
    stop: inspectStopLoop({
      legible: result.legible,
      scotomized: result.scotomized,
      stopLoopNine: result.stopLoopNine,
      unachievableDeclare: result.unachievableDeclare,
      stop: input && input.stop,
    }),
    slash: inspectSlashScan({
      legible: result.legible,
      scotomized: result.scotomized,
      slashScanPresent: result.slashScanPresent,
      slash: input && input.slash,
    }),
    hook: inspectHook({
      legible: result.legible,
      scotomized: result.scotomized,
      failOpenHook: result.failOpenHook,
      notUserHook: result.notUserHook,
      hook: input && input.hook,
    }),
    field: mapField({
      legible: result.legible,
      scotomized: result.scotomized,
      commandArgsPresent: true,
      stopFirings: result.stopLoopNine ? STOP_FIRINGS : 0,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      scotomized:
        result.scotomized === true ||
        result.verdict === "scotomized" ||
        result.verdict === "scotoma",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the Stop-condition evaluator does not read <command-args>, the only field that stores the /goal instruction, so it cannot confirm the goal and keeps re-firing until it declares the condition unachievable. Confirming that the evaluator truly cannot see <command-args> requires internal knowledge — inferred from the observed behavior, not verified from source. Invite verify against #93744 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
