#!/usr/bin/env node
/**
 * Vedette — cavalry vedette / outpost lantern / picket-line /
 * field-desk booth.
 * A *vedette* is a mounted outpost scout left on watch: the
 * parent `-p` column marches off (~600s idle window) while the
 * Task vedettes are still on post. Every in-flight Task is then
 * reported `stopped`, yet the parent returns `success` / exit 0.
 * Field olive / lantern amber / canvas khaki / signal crimson /
 * night. NOT Orloj clock tower. NOT Brisure herald college.
 * NOT Diptych wax-tablet. NOT Vizard masque-ball. NOT Treacle
 * kettle. NOT Somnus sleep clinic. NOT Cresset fire-basket.
 * NOT Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry.
 *
 * Educational diagnostic model for a published Claude Code
 * headless `-p` defect: when the model omits `run_in_background`,
 * the CLI still backgrounds (`is_backgrounded: true`, tool_result
 * placeholder "Async agent launched successfully"). The main turn
 * ends. If no completion lands within ~600s of the previous turn,
 * the `-p` process exits: every in-flight subagent gets
 * `system/task_notification` status `stopped`; the parent never
 * sees results; the final `result` is `subtype: success`,
 * `is_error: false`, exit code 0. Distinct from #63023 / #65968
 * (idle/pause harvest of background tasks) and from Lemure
 * (orphan scheduled-task ticks) and Followspot (spawn MCP
 * focus): this is headless `-p` idle-exit with false success
 * while Tasks are still running.
 *
 * Encoded from anthropics/claude-code#94392 issue text only.
 * Hypothesis (NON-BINDING — issue text): parent `-p` idle window
 * (~600s) exits while background Tasks still running; every
 * in-flight Task reported stopped; result still success / exit 0.
 * Invite verify against #94392 text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT
 * implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node vedette.mjs data/vedette.json
 *   echo '{"seed":"vedette"}' | node vedette.mjs
 *
 * Idle word is stationed (HOLD: parent stays until background
 * Tasks complete / return results).
 * HOLD aliases: crewed, posted, vigil, tethered.
 * Seeded word is vedette (#94392 path).
 * Path word is idle-exit.
 * Product score word is vedette (Score vedette or admit stationed.).
 *
 * NOT #63023 / #65968 (idle/pause harvest of background tasks).
 * NOT Lemure (orphan scheduled-task ticks).
 * NOT Followspot (spawn MCP focus).
 * Same family of "background task" words but DIFFERENT defect.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "stationed",
  "vedette",
  "idle-exit",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "backgrounded",
  "six-hundred",
  "false-success",
  "stopped-tasks",
  "disable-bg",
  "94392",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "stationed";
export const PATH_WORD = "idle-exit";
export const SEEDED_WORD = "vedette";
export const PRODUCT_WORD = "vedette";
export const HOLD = Object.freeze(["stationed"]);
export const HOLD_ALIASES = Object.freeze([
  "crewed",
  "posted",
  "vigil",
  "tethered",
]);
export const RECOVER = Object.freeze(["stationed"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "sealed",
  "silenced",
  "living",
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
]);

export const FEATURED_ISSUE = 94392;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94392";
export const TITLE =
  "Headless `claude -p` exits with its own background subagents still running; every in-flight Task is reported `stopped` and the run still ends `result.subtype=success`, exit code 0";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:agents",
  "area:cli",
]);
export const PLATFORM = "linux";
export const SURFACE = "idle-exit";
export const HOST =
  "Claude Code CLI 2.1.270 (also 2.1.267–2.1.269); Linux x64; claude -p --output-format stream-json --verbose; unattended cron (no TTY)";
export const CHECKED_ON =
  "Published report: when the model omits run_in_background the CLI still backgrounds; if no completion within ~600s of the previous turn, -p exits with every in-flight Task stopped and result.subtype=success, exit code 0";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "Headless -p idle-exit — not a model defect";
export const OS = "Linux x64; platform:linux / area:agents / area:cli";
export const PHRASE = "Score vedette or admit stationed.";
export const DISTRIBUTION =
  "CLI 2.1.270 Linux, claude -p --output-format stream-json --verbose, unattended cron (no TTY). Orchestrator dispatches 5–11 custom subagents via Agent/Task in one turn. When the model omits run_in_background, CLI still backgrounds (is_backgrounded: true, tool_result placeholder \"Async agent launched successfully\"). Main turn ends. If no completion within ~600s of previous turn, -p process exits: every in-flight subagent gets system/task_notification status stopped; parent never sees results; final result is subtype: success, is_error: false, exit code 0. Offline control with two long-sleep backgrounded subagents exited ~651s after previous turn while subagents still alive. Explicit run_in_background: false keeps foreground and returns results. Workaround: CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1. Measured 2026-09-14: sessions with 5–11 backgrounded tasks; last completion-to-exit gap 602–603s. Distinct from #63023 / #65968 (idle/pause harvest). Expected: refuse to exit while unresolved background tasks remain, or end with a non-success result and non-zero exit that names the stopped tasks.";

export const CODE_BUILD = "2.1.270";
export const IDLE_WINDOW_SEC = 600;
export const CONTROL_EXIT_SEC = 651;
export const GAP_LOW_SEC = 602;
export const GAP_HIGH_SEC = 603;
export const PLACEHOLDER = "Async agent launched successfully";
export const DISABLE_ENV = "CLAUDE_CODE_DISABLE_BACKGROUND_TASKS";
export const RESULT_SUBTYPE = "success";
export const EXIT_CODE = 0;

/**
 * Synthetic example-data — reconstructs published -p shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_STATIONED = Object.freeze({
  kind: "stationed",
  runInBackground: false,
  isBackgrounded: false,
  tasksInFlight: 2,
  tasksStopped: 0,
  resultSubtype: null,
  exitCode: null,
  note: "picket holds — stationed until Tasks return",
  synthetic: true,
});
export const SYNTHETIC_VEDETTE = Object.freeze({
  kind: "vedette",
  runInBackground: undefined,
  omitFlag: true,
  isBackgrounded: true,
  placeholder: PLACEHOLDER,
  idleWindowSec: IDLE_WINDOW_SEC,
  tasksStopped: 11,
  resultSubtype: RESULT_SUBTYPE,
  isError: false,
  exitCode: EXIT_CODE,
  note: "parent column marches off; vedettes still on post; reported stopped; success / 0",
  synthetic: true,
});
export const SYNTHETIC_IDLE_EXIT = Object.freeze({
  kind: "idle-exit",
  sinceLastTurnSec: CONTROL_EXIT_SEC,
  completions: 0,
  tasksStillAlive: true,
  exited: true,
  note: "offline control exited ~651s after previous turn while subagents still alive",
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "picket-line",
    lost: "Picket line — parent -p should stay until background Tasks return results",
    control: "A stationed column would wait for every vedette on post",
    story: "the field-desk should not fold while scouts are still out",
  },
  {
    id: "omit-post",
    lost: "Omit post — model omits run_in_background; CLI still backgrounds",
    control: "omitting the flag would keep the Task in the foreground",
    story: "the lantern is hung without an order and the post is still taken",
  },
  {
    id: "lantern-placeholder",
    lost: "Lantern placeholder — tool_result is Async agent launched successfully",
    control: "the parent would keep the result channel open",
    story: "the outpost lantern is lit as a placeholder, not a return",
  },
  {
    id: "six-hundred-watch",
    lost: "Six-hundred watch — no completion within ~600s of previous turn",
    control: "the idle window would not dismiss a column that still owns Tasks",
    story: "the picket-line clock strikes 600 and the column marches",
  },
  {
    id: "stopped-vedettes",
    lost: "Stopped vedettes — every in-flight Task gets status stopped",
    control: "in-flight Tasks would complete or fail with a named result",
    story: "the scouts are still alive; the ledger writes stopped",
  },
  {
    id: "false-column",
    lost: "False column — result.subtype=success, is_error=false, exit code 0",
    control: "a lost wave would be a non-success result and a non-zero exit",
    story: "the column reports success while the picket is still crewed",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "picket-line",
    survey: "stationed HOLD: parent stays until background Tasks complete / return results",
    kind: "stationed",
    note: "idle/control: column and vedettes agree to hold the line",
  },
  {
    id: "omit-post",
    survey: "model omits run_in_background; CLI still backgrounds is_backgrounded: true",
    kind: "vedette",
    note: "seeded: omit-flag still hangs the lantern",
  },
  {
    id: "lantern-placeholder",
    survey: "Task tool_result placeholder Async agent launched successfully",
    kind: "vedette",
    note: "seeded: main turn ends awaiting returns",
  },
  {
    id: "six-hundred-watch",
    survey: "if no completion within ~600s of previous turn, -p exits",
    kind: "vedette",
    note: "seeded: six-hundred idle window",
  },
  {
    id: "stopped-vedettes",
    survey: "every in-flight subagent gets system/task_notification status stopped",
    kind: "vedette",
    note: "seeded: parent never sees results",
  },
  {
    id: "false-column",
    survey: "idle-exit — result.subtype=success, is_error=false, exit code 0",
    kind: "vedette",
    note: "path: idle-exit names the false-success march",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "backgrounded",
    label: "backgrounded",
    count: "is_backgrounded",
    note: "is_backgrounded: true when run_in_background is omitted",
  },
  {
    id: "six-hundred",
    label: "six-hundred",
    count: "600s",
    note: "No completion within ~600s of the previous turn",
  },
  {
    id: "false-success",
    label: "false-success",
    count: "exit 0",
    note: "result.subtype=success, is_error=false, exit code 0",
  },
  {
    id: "stopped-tasks",
    label: "stopped-tasks",
    count: "stopped",
    note: "Every in-flight Task gets task_notification status stopped",
  },
  {
    id: "disable-bg",
    label: "disable-bg",
    count: "env",
    note: "Workaround: CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1",
  },
  {
    id: "omit-flag",
    label: "omit-flag",
    count: "omit",
    note: "Model omits run_in_background; CLI still backgrounds",
  },
]);

export const RULED_OUT = Object.freeze([
  "#63023 — Background agents silently die on session pause/resume — idle/pause harvest — DIFFERENT defect; cite only",
  "#65968 — closed as a duplicate of #63023, also framed around idle/suspend boundaries — DIFFERENT; cite only",
  "Lemure/#94410 — orphan scheduled-task ticks — DIFFERENT",
  "Followspot/#93714 — spawn MCP focus — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life during an active session — DIFFERENT",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo double render — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Cancellans/#94400 — resume-fork deferred_tools_delta — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "A per-command foreground-only flag for -p (the equivalent of the env switch), so unattended runs are deterministic regardless of what the model passes",
  "In -p mode, refuse to exit while the session still owns unresolved background tasks: either wait for them (bounded by a configurable deadline) or end with a non-success result (subtype other than success, non-zero exit code) that names the stopped tasks",
  "Today a lost wave is indistinguishable from a clean run without parsing task_notification records",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Do not exit -p while unresolved background Tasks remain, or fail the result when they are stopped",
  "Honor omitted run_in_background as foreground, matching explicit run_in_background: false",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "idle-exit",
  "vedette",
  "backgrounded",
  "six-hundred",
  "false-success",
  "stopped-tasks",
]);

export const COUSINS = Object.freeze([
  {
    issue: 63023,
    title: "Background agents silently die on session pause/resume",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #63023 is idle/pause harvest of background tasks. DIFFERENT failure mode. Do not rebuild. Do not conflate.",
  },
  {
    issue: 65968,
    title: "idle/suspend boundaries (closed as a duplicate of #63023)",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — #65968 is framed around idle/suspend boundaries. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export const SAMPLE_KIND_IDLE = "picket-line";
export const SAMPLE_KIND_SEEDED = "idle-exit";
export const SAMPLE_HOLDING_IDLE = "field-desk";
export const SAMPLE_HOLDING_SEEDED = "six-hundred-watch";

export const SAMPLE_STATIONED_PROOF = Object.freeze({
  stationed: true,
  vedette: false,
  idleExit: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_VEDETTE_PROOF = Object.freeze({
  stationed: false,
  vedette: true,
  idleExit: true,
  backgrounded: true,
  sixHundred: true,
  falseSuccess: true,
  stoppedTasks: true,
  disableBg: true,
  omitFlag: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  stationedWatch: { ...SYNTHETIC_STATIONED },
  vedetteWatch: { ...SYNTHETIC_VEDETTE },
  idleExitShape: { ...SYNTHETIC_IDLE_EXIT },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds stationed: parent stays until background Tasks complete / return results" },
  { t: "idle-exit", line: "no completion within ~600s; every in-flight Task reported stopped" },
  { t: "path", line: "idle-exit — result.subtype=success, exit code 0; Tasks still running" },
  { t: "score", line: "when the column marches off and the vedettes are still on post the booth is vedette — Score vedette or admit stationed." },
]);

const FORCE_FLAGS = [
  "idleExit",
  "backgrounded",
  "sixHundred",
  "falseSuccess",
  "stoppedTasks",
  "disableBg",
  "omitFlag",
];

const ISSUE_CUE_RE =
  /94392|claude -p|is_backgrounded|Async agent launched|task_notification|run_in_background|CLAUDE_CODE_DISABLE_BACKGROUND_TASKS|subtype.: .success|600 s|651/i;

/**
 * Educational background observer. Not a Claude Code patch.
 * Encodes only the published #94392 shapes.
 *
 * omit / true → is_backgrounded true, placeholder launch.
 * explicit false → foreground, results in-turn.
 */
export function observeBackground({
  runInBackground,
  omitFlag = false,
  stationed = false,
} = {}) {
  if (stationed === true) {
    return {
      isBackgrounded: false,
      placeholder: null,
      phrase: "admit stationed",
      synthetic: true,
    };
  }
  const omitted = omitFlag === true || runInBackground === undefined;
  if (runInBackground === false) {
    return {
      isBackgrounded: false,
      placeholder: null,
      phrase: "admit stationed",
      note: "explicit run_in_background: false keeps foreground and returns results",
      synthetic: true,
    };
  }
  if (omitted || runInBackground === true) {
    return {
      isBackgrounded: true,
      placeholder: PLACEHOLDER,
      phrase: "score vedette",
      note: "CLI backgrounds; tool_result is Async agent launched successfully",
      synthetic: true,
    };
  }
  return {
    isBackgrounded: false,
    placeholder: null,
    phrase: "admit stationed",
    synthetic: true,
  };
}

/**
 * Educational idle-window observer. Not a Claude Code patch.
 * If no completion within ~600s of previous turn, -p exits.
 */
export function observeIdleWindow({
  sinceLastTurnSec = 0,
  completions = 0,
  stationed = false,
} = {}) {
  if (stationed === true) {
    return {
      exited: false,
      idleWindowSec: IDLE_WINDOW_SEC,
      phrase: "admit stationed",
      synthetic: true,
    };
  }
  const exited = completions === 0 && sinceLastTurnSec >= IDLE_WINDOW_SEC;
  return {
    exited,
    idleWindowSec: IDLE_WINDOW_SEC,
    sinceLastTurnSec,
    completions,
    phrase: exited ? "score vedette" : "admit stationed",
    note: exited
      ? "no completion within ~600s of previous turn; -p exits"
      : "idle window has not elapsed",
    synthetic: true,
  };
}

/**
 * Educational parent-result observer. Not a Claude Code patch.
 * Lost wave is still subtype success / exit 0.
 */
export function reportParentResult({
  tasksInFlight = 0,
  tasksStopped = 0,
  stationed = false,
} = {}) {
  if (stationed === true) {
    return {
      subtype: null,
      isError: false,
      exitCode: null,
      waiting: true,
      phrase: "admit stationed",
      synthetic: true,
    };
  }
  const lost = tasksStopped > 0 || tasksInFlight > 0;
  return {
    subtype: lost ? RESULT_SUBTYPE : RESULT_SUBTYPE,
    isError: false,
    exitCode: EXIT_CODE,
    waiting: false,
    tasksStopped,
    phrase: lost ? "score vedette" : "admit stationed",
    note: lost
      ? "result.subtype=success, is_error=false, exit code 0 while Tasks stopped"
      : "no lost wave",
    synthetic: true,
  };
}

/**
 * Educational station honor. Not a Claude Code patch.
 * stationed=true is the HOLD / wait-for-returns path.
 */
export function honorStation({
  stationed = false,
  tasksInFlight = 0,
} = {}) {
  if (stationed === true) {
    return {
      stationed: true,
      waiting: true,
      tasksInFlight,
      phrase: "admit stationed",
      synthetic: true,
    };
  }
  return {
    stationed: false,
    waiting: false,
    tasksInFlight,
    phrase: "score vedette",
    synthetic: true,
  };
}

/**
 * Educational workaround flag. Not a Claude Code patch.
 * CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1 keeps foreground.
 */
export function disableBackgroundTasks({ enabled = false } = {}) {
  if (enabled === true) {
    return {
      enabled: true,
      schemaOffersBackground: false,
      foregroundOnly: true,
      phrase: "admit stationed",
      env: `${DISABLE_ENV}=1`,
      note: "Agent/Task schema no longer offers run_in_background; every subagent runs in the foreground",
      synthetic: true,
    };
  }
  return {
    enabled: false,
    schemaOffersBackground: true,
    foregroundOnly: false,
    phrase: "score vedette",
    env: `${DISABLE_ENV}=`,
    synthetic: true,
  };
}

export function scoreIdleExit(input = {}) {
  const stationedHold = input.stationed === true && input.vedette !== true;
  const station = honorStation({
    stationed: stationedHold,
    tasksInFlight: input.tasksInFlight ?? 0,
  });
  const vedette =
    !stationedHold &&
    (station.stationed === false ||
      input.vedette === true ||
      input.idleExit === true ||
      input.sixHundred === true ||
      input.backgrounded === true);
  return {
    stationed: !vedette,
    vedette,
    idleExit: vedette,
    station,
    phrase: vedette ? "score vedette" : "admit stationed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94392") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapVedette(input = {}) {
  const vedette = isVedetteInput(input);
  const stationed = input.stationed === true && !vedette;
  return {
    stamp: vedette ? "idle-exit" : "field-desk",
    holdingLane: vedette ? "six-hundred-watch" : "field-desk",
    kindLane: vedette ? "idle-exit" : "picket-line",
    bindLane: vedette ? "stopped-vedettes" : "tethered",
    ribbon: vedette ? "vedette" : "stationed",
    stationed,
  };
}

export function inspectBackgrounded(input = {}) {
  const flagged =
    input.backgrounded === true ||
    input.vedette === true ||
    input.idleExit === true ||
    isVedetteInput(input);
  if (input.stationed === true && !flagged) {
    return { stamp: "crewed", flagged: false, note: "column and vedettes stay crewed" };
  }
  return {
    stamp: flagged ? "backgrounded" : "bg-idle",
    flagged,
    note: flagged
      ? "backgrounded — is_backgrounded: true when run_in_background is omitted"
      : "",
  };
}

export function inspectSixHundred(input = {}) {
  const windowed =
    input.sixHundred === true ||
    input.vedette === true ||
    isVedetteInput(input);
  if (input.stationed === true && !windowed) {
    return { stamp: "posted", windowed: false };
  }
  return {
    stamp: windowed ? "six-hundred" : "watch-idle",
    windowed,
    note: windowed
      ? "six-hundred — no completion within ~600s of the previous turn"
      : "",
  };
}

export function inspectFalseSuccess(input = {}) {
  const falseOk =
    input.falseSuccess === true ||
    input.vedette === true ||
    isVedetteInput(input);
  if (input.stationed === true && !falseOk) {
    return { stamp: "vigil", falseOk: false };
  }
  return {
    stamp: falseOk ? "false-success" : "result-idle",
    falseOk,
    note: falseOk
      ? "false-success — result.subtype=success, is_error=false, exit code 0"
      : "",
  };
}

export function inspectStopped(input = {}) {
  const stopped =
    input.stoppedTasks === true ||
    input.vedette === true ||
    input.idleExit === true ||
    isVedetteInput(input);
  if (input.stationed === true && !stopped) {
    return { stamp: "tethered", stopped: false };
  }
  return {
    stamp: stopped ? "stopped-tasks" : "task-idle",
    stopped,
    note: stopped
      ? "stopped-tasks — every in-flight Task gets task_notification status stopped"
      : "",
  };
}

export function inspectDisable(input = {}) {
  const workaround =
    input.disableBg === true ||
    input.vedette === true ||
    isVedetteInput(input);
  if (input.stationed === true && !workaround) {
    return { stamp: "picket-line", workaround: false };
  }
  return {
    stamp: workaround ? "disable-bg" : "env-idle",
    workaround,
    note: workaround
      ? "disable-bg — CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1 keeps foreground"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "picket-line": input.vedette || input.idleExit,
    "omit-post": input.omitFlag || input.vedette,
    "lantern-placeholder": input.backgrounded || input.vedette,
    "six-hundred-watch": input.sixHundred || input.vedette,
    "stopped-vedettes": input.stoppedTasks || input.vedette,
    "false-column": input.falseSuccess || input.idleExit || input.vedette,
  };
  return (
    map[id] === true ||
    input.idleExit === true ||
    input.vedette === true
  );
}

function isVedetteInput(input = {}) {
  return (
    input.vedette === true ||
    input.idleExit === true ||
    input.backgrounded === true ||
    input.sixHundred === true ||
    input.falseSuccess === true ||
    input.stoppedTasks === true ||
    input.disableBg === true ||
    input.omitFlag === true
  );
}

export function readBooth(input = {}) {
  const vedette = isVedetteInput(input);
  const stationed = input.stationed === true && !vedette;
  return {
    mark: vedette ? "vedette" : "stationed",
    stationed,
    vedette,
    idleExit: input.idleExit === true || vedette,
    backgrounded: input.backgrounded === true,
    sixHundred: input.sixHundred === true,
    falseSuccess: input.falseSuccess === true,
    stoppedTasks: input.stoppedTasks === true,
    disableBg: input.disableBg === true,
    omitFlag: input.omitFlag === true,
    post: mapVedette(input),
    background: inspectBackgrounded(input),
    six: inspectSixHundred(input),
    falseOk: inspectFalseSuccess(input),
    stopped: inspectStopped(input),
    disable: inspectDisable(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const VEDETTE_WALK = Object.freeze([
  {
    t: "idle",
    event: "field-desk",
    stationed: true,
    vedette: false,
    cue: "stationed",
    note: "idle HOLD: parent stays until background Tasks complete / return results",
  },
  {
    t: "idle-exit",
    event: "idle-exit",
    vedette: true,
    idleExit: true,
    sixHundred: true,
    backgrounded: true,
    cue: "vedette",
    note: "no completion within ~600s; every in-flight Task reported stopped",
  },
  {
    t: "path",
    event: "idle-exit",
    vedette: true,
    idleExit: true,
    backgrounded: true,
    sixHundred: true,
    falseSuccess: true,
    stoppedTasks: true,
    disableBg: true,
    omitFlag: true,
    cue: "vedette",
    note: "idle-exit — result.subtype=success, exit code 0; Tasks still running",
  },
  {
    t: "score",
    event: "vedette",
    vedette: true,
    idleExit: true,
    backgrounded: true,
    sixHundred: true,
    falseSuccess: true,
    stoppedTasks: true,
    disableBg: true,
    omitFlag: true,
    cue: "vedette",
    note: "vedette — the parent column marches off; the Task vedettes are still on post",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "field-desk",
    stationed: true,
    vedette: false,
    cue: "stationed",
    note: "positive control: parent stays until background Tasks complete / return results",
  },
  {
    t: "admit",
    event: "field-desk",
    stationed: true,
    cue: "stationed",
    note: "positive control: the picket admits stationed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    stationed: true,
    vedette: false,
    idleExit: false,
    cue: "stationed",
  };
}

export function seedStationed() {
  return { ...emptyTicket() };
}

export function seedVedette() {
  return {
    seed: SEEDED_WORD,
    stationed: false,
    vedette: true,
    idleExit: true,
    backgrounded: true,
    sixHundred: true,
    falseSuccess: true,
    stoppedTasks: true,
    disableBg: true,
    omitFlag: true,
    cue: "vedette",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_VEDETTE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    vedette: true,
    idleExit: true,
    cue: "vedette",
  };
}

export function seedIdleExit() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    vedette: true,
    idleExit: true,
    event: "idle-exit",
    cue: "vedette",
  };
}

export function seedCrewed() {
  return { seed: "crewed", preferSeed: true, stationed: true, cue: "stationed" };
}

export function seedPosted() {
  return { seed: "posted", preferSeed: true, stationed: true, cue: "stationed" };
}

export function seedVigil() {
  return { seed: "vigil", preferSeed: true, stationed: true, cue: "stationed" };
}

export function seedTethered() {
  return { seed: "tethered", preferSeed: true, stationed: true, cue: "stationed" };
}

export function seedBackgrounded() {
  return {
    seed: "backgrounded",
    preferSeed: true,
    backgrounded: true,
    cue: "vedette",
  };
}

export function seedSixHundred() {
  return {
    seed: "six-hundred",
    preferSeed: true,
    sixHundred: true,
    cue: "vedette",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      stationed: false,
      vedette: false,
      idleExit: false,
      backgrounded: false,
      sixHundred: false,
      falseSuccess: false,
      stoppedTasks: false,
      disableBg: false,
      omitFlag: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    stationed: raw.stationed === true,
    vedette: raw.vedette === true || raw.event === "vedette",
    idleExit: raw.idleExit === true || raw.event === "idle-exit",
    backgrounded: raw.backgrounded === true || raw.event === "backgrounded",
    sixHundred: raw.sixHundred === true || raw.event === "six-hundred",
    falseSuccess: raw.falseSuccess === true || raw.event === "false-success",
    stoppedTasks: raw.stoppedTasks === true || raw.event === "stopped-tasks",
    disableBg: raw.disableBg === true || raw.event === "disable-bg",
    omitFlag: raw.omitFlag === true || raw.event === "omit-flag",
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
      (ticket.stationed != null ||
        ticket.vedette != null ||
        ticket.idleExit != null ||
        ticket.backgrounded != null ||
        ticket.sixHundred != null ||
        ticket.falseSuccess != null ||
        ticket.stoppedTasks != null ||
        ticket.disableBg != null ||
        ticket.omitFlag != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isStationed(row) {
  if (row.vedette && row.cue !== "stationed") return false;
  if (row.cue === "vedette" || row.cue === "idle-exit") return false;
  if (
    row.idleExit &&
    row.sixHundred &&
    row.cue !== "stationed" &&
    row.stationed !== true
  ) {
    return false;
  }
  if (
    row.stationed === true &&
    row.vedette !== true &&
    row.cue !== "vedette"
  ) {
    return true;
  }
  if (
    row.cue === "stationed" &&
    row.vedette !== true &&
    row.idleExit !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isIdleExit(row) {
  return (
    row.event === "idle-exit" &&
    !isStationed(row) &&
    (row.idleExit === true ||
      row.sixHundred === true ||
      row.vedette === true)
  );
}

function isVedetteRow(row) {
  if (isStationed(row)) return false;
  if (isIdleExit(row) && row.cue !== "vedette") return false;
  if (row.cue === "vedette") return true;
  if (row.vedette === true) return true;
  if (row.idleExit === true && row.sixHundred === true) return true;
  if (
    row.idleExit === true ||
    row.backgrounded === true ||
    row.sixHundred === true ||
    row.falseSuccess === true ||
    row.stoppedTasks === true ||
    row.disableBg === true ||
    row.omitFlag === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one vedette pass against the picket-line.
 * stationed: parent stays until background Tasks complete / return results.
 * vedette: parent column marches off; Task vedettes still on post; reported stopped; success / 0.
 * idle-exit: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isIdleExit(row) ||
    (row.idleExit && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "idle-exit";
  } else if (isVedetteRow(row)) {
    verdict = "vedette";
  } else if (isStationed(row)) {
    verdict = "stationed";
  } else if (
    row.idleExit ||
    row.backgrounded ||
    row.sixHundred ||
    row.falseSuccess ||
    row.stoppedTasks ||
    row.disableBg ||
    row.omitFlag
  ) {
    verdict = "vedette";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "vedette";
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
    stationed: verdict === "stationed",
    vedette: verdict === "vedette" || verdict === SEEDED_WORD,
    idleExit:
      row.idleExit === true ||
      verdict === "idle-exit" ||
      verdict === PATH_WORD,
    backgrounded: row.backgrounded,
    sixHundred: row.sixHundred,
    falseSuccess: row.falseSuccess,
    stoppedTasks: row.stoppedTasks,
    disableBg: row.disableBg,
    omitFlag: row.omitFlag,
    cue: hold
      ? "stationed"
      : row.idleExit || verdict === "idle-exit"
        ? "idle-exit"
        : "vedette",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit stationed" : "score vedette",
    backgroundInspect: inspectBackgrounded(row),
    sixInspect: inspectSixHundred(row),
    falseInspect: inspectFalseSuccess(row),
    stoppedInspect: inspectStopped(row),
    disableInspect: inspectDisable(row),
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
      : VEDETTE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "vedette");
  const path = scored.filter((row) => row.verdict === "idle-exit");
  const stationed = scored.filter((row) => row.verdict === "stationed");
  const headline =
    scored.find((row) => row.event === "vedette") ||
    scored.find((row) => row.event === "idle-exit") ||
    scored.find((row) => row.event === "six-hundred") ||
    charged[charged.length - 1];
  let verdict = "stationed";
  if (charged.length) verdict = "vedette";
  else if (path.length && !stationed.length) {
    verdict = "idle-exit";
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
    vedetteCount: charged.length,
    pathCount: path.length,
    stationedCount: stationed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit stationed" : "score vedette",
    note: headline
      ? "Headless claude -p exits with its own background subagents still running; every in-flight Task is reported stopped and the run still ends result.subtype=success, exit code 0. Cite-only cousins #63023 #65968."
      : "published vedette walk scored against stationed vs vedette",
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
    seeded !== "stationed" &&
    seeded !== "vedette" &&
    seeded !== "idle-exit" &&
    ticket.stationed == null &&
    ticket.vedette == null &&
    ticket.idleExit == null &&
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
    stationed: scored.stationed ?? false,
    vedette: scored.vedette ?? false,
    idleExit: scored.idleExit ?? false,
    backgrounded: scored.backgrounded ?? false,
    sixHundred: scored.sixHundred ?? false,
    falseSuccess: scored.falseSuccess ?? false,
    stoppedTasks: scored.stoppedTasks ?? false,
    disableBg: scored.disableBg ?? false,
    omitFlag: scored.omitFlag ?? false,
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
    result.idleExit || result.vedette
      ? "kind=idle-exit"
      : "kind=picket-line",
    result.stoppedTasks || result.vedette
      ? "ref=stopped-tasks"
      : "ref=field-desk",
    result.idleExit || result.verdict === "idle-exit"
      ? "path=idle-exit"
      : "path=stationed",
    result.cue === "stationed"
      ? "cue=stationed"
      : result.cue === "idle-exit"
        ? "cue=idle-exit"
        : "cue=vedette",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    stationed: result.stationed,
    vedette: result.vedette,
    idleExit: result.idleExit,
    backgrounded: result.backgrounded,
    sixHundred: result.sixHundred,
    falseSuccess: result.falseSuccess,
    stoppedTasks: result.stoppedTasks,
    disableBg: result.disableBg,
    omitFlag: result.omitFlag,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    background: inspectBackgrounded({
      stationed: result.stationed,
      vedette: result.vedette,
      backgrounded: result.backgrounded,
    }),
    six: inspectSixHundred({
      stationed: result.stationed,
      vedette: result.vedette,
      sixHundred: result.sixHundred,
    }),
    falseOk: inspectFalseSuccess({
      stationed: result.stationed,
      vedette: result.vedette,
      falseSuccess: result.falseSuccess,
    }),
    stopped: inspectStopped({
      stationed: result.stationed,
      vedette: result.vedette,
      stoppedTasks: result.stoppedTasks,
    }),
    disable: inspectDisable({
      stationed: result.stationed,
      vedette: result.vedette,
      disableBg: result.disableBg,
    }),
    post: mapVedette({
      stationed: result.stationed,
      vedette: result.vedette,
      idleExit: result.idleExit,
      sixHundred: result.sixHundred,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      vedette: result.vedette === true || result.verdict === "vedette",
    })),
    leakPath: scoreIdleExit({
      stationed: result.stationed === true && !result.vedette,
      vedette: result.vedette,
      idleExit: result.idleExit,
      sixHundred: result.sixHundred,
      backgrounded: result.backgrounded,
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
      hypothesis:
        "NON-BINDING (issue text): parent -p idle window (~600s) exits while background Tasks still running; every in-flight Task reported stopped; result still success / exit 0. Invite verify against #94392 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
