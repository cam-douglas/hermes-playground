#!/usr/bin/env node
/**
 * Calends — stone calendar / fasti booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop Scheduled Tasks missed-run catch-up fires without
 * re-validating day-of-week (and possibly date) of the cron.
 * Docs say on app start/wake, Desktop checks missed runs in the last
 * seven days and starts exactly one catch-up for the most recently
 * missed time. Day-restricted crons (e.g. `0 19 * * 1` Monday-only,
 * `45 18 * * 3` Wednesday-only) should only catch up to a time that
 * itself falls on the correct DOW — they do not. Observed: five tasks
 * with different weekly schedules (Fri-only, Wed-only×2, Mon-only,
 * Thu-only) all fired within ~4 minutes (~12:15–12:19 AM local) on a
 * Friday (matches only one schedule). list_task_runs shows correctly-
 * timed runs mixed with sporadic wrong-day fires. Misfires report
 * status: succeeded. No setting to disable catch-up.
 *
 *   node calends.mjs data/misfired.json
 *   echo '{"seed":"misfired"}' | node calends.mjs
 *
 * Idle word is due (HOLD: catch-up only when DOW/date fields match;
 * calendar day correct).
 * Seeded word is misfired (#93687 — wrong-day catch-up; status succeeded).
 * Path word is catchup-dow.
 * Product score word is calends (Score calends or admit due.).
 *
 * Encoded from anthropics/claude-code#93687 issue text only.
 * Hypothesis (NON-BINDING): catch-up may compute “most recently missed
 * time” from time-of-day alone and skip DOW/DOM. Verify against #93687
 * text only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits. No live
 * Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "due",
  "misfired",
  "calends",
  "catchup-dow",
  "hold",
  "wrong-day-cluster",
  "status-succeeded",
  "no-disable-setting",
  "dow-ignored",
  "cron-full-fields",
  "list-task-runs",
  "outbound-risk",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "due";
export const PATH_WORD = "catchup-dow";
export const SEEDED_WORD = "misfired";
export const PRODUCT_WORD = "calends";
export const HOLD = Object.freeze(["due", "hold"]);
export const RECOVER = Object.freeze(["due", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "misfired" && name !== "calends"),
);

export const FEATURED_ISSUE = 93687;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93687";
export const TITLE =
  "[BUG] Desktop Scheduled Tasks catch-up ignores day-of-week/date cron fields, fires on wrong days";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:desktop",
]);
export const PLATFORM = "Windows";
export const AUTHOR = "erikholz";
export const CLUSTER_START = "12:15";
export const CLUSTER_END = "12:19";
export const CLUSTER_DAY = "Friday";
export const TASK_COUNT = 5;
export const LOOKBACK_DAYS = 7;
export const MONDAY_CRON = "0 19 * * 1";
export const WEDNESDAY_CRON = "45 18 * * 3";
export const SCHEMA_FIELDS = Object.freeze([
  "enabled",
  "cronExpression",
  "fireAt",
  "prompt",
  "title",
  "description",
  "notifyOnCompletion",
]);
export const PHRASE = "Score calends or admit due.";
export const DISTRIBUTION =
  "Claude Code Desktop app, Windows. Scheduled tasks configured via the schedule skill / mcp__scheduled-tasks__* tools. Missed-run catch-up on app start/wake checks the last seven days and starts exactly one catch-up for the most recently missed time. Day-restricted crons (0 19 * * 1 Monday-only, 45 18 * * 3 Wednesday-only) fire on the wrong weekday. Five tasks (Fri-only, Wed-only×2, Mon-only, Thu-only) all fired within ~4 minutes (~12:15–12:19 AM local) on a Friday. list_task_runs mixes correctly-timed runs with sporadic wrong-day fires. Misfires report status: succeeded. Schemas expose only enabled/cronExpression/fireAt/prompt/title/description/notifyOnCompletion — no disable-catch-up setting.";
export const SESSION_KIND =
  "Desktop Scheduled Tasks catch-up. Docs: on start/wake, one catch-up for the most recently missed time in the last seven days. Observed Friday cluster 12:15–12:19 AM local across five differently-scheduled weekly tasks. Thursday-only fires on Sunday and Friday; Wednesday-only fires on Friday and Thursday. Outbound risk: Gmail drafts, Jira issues, git commits. One Gmail/Jira task exited early via a prompt-level “nothing new this week” guard.";

export const WEEKDAY_PLAQUES = Object.freeze([
  { id: "fri", cronHint: "Friday-only", marked: "Friday", struckOn: "Friday" },
  { id: "wed-a", cronHint: "Wednesday-only", marked: "Wednesday", struckOn: "Friday" },
  { id: "wed-b", cronHint: "Wednesday-only", marked: "Wednesday", struckOn: "Friday" },
  { id: "mon", cronHint: "Monday-only", marked: "Monday", struckOn: "Friday" },
  { id: "thu", cronHint: "Thursday-only", marked: "Thursday", struckOn: "Friday" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "fasti",
    survey: "read the fasti stone (weekday marks should be the only days the hand may strike)",
    kind: "fasti",
    note: "seeded: catch-up hand strikes unmarked weekdays; Friday cluster rings four wrong plaques",
  },
  {
    id: "hand",
    survey: "watch the catch-up hand (should walk the cron’s full field set)",
    kind: "hand",
    note: "seeded: hand walks time-of-day only and skips the DOW mark",
  },
  {
    id: "nundinae",
    survey: "read the nundinal weekday letters (DOW field already structured in cron)",
    kind: "nundinae",
    note: "seeded: nundinal letters ignored — Monday-only and Wednesday-only fire on Friday",
  },
  {
    id: "kalends",
    survey: "feel the kalends / date field (day-of-month should constrain catch-up)",
    kind: "kalends",
    note: "seeded: date field possibly skipped with DOW; catch-up picks a clock time in the last seven days",
  },
  {
    id: "acta",
    survey: "read the acta diurna (list_task_runs should only show matching-day fires)",
    kind: "acta",
    note: "seeded: acta mixes correctly-timed runs with sporadic wrong-day fires; status succeeded",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "catchup-dow",
  "misfired",
  "wrong-day-cluster",
  "status-succeeded",
  "no-disable-setting",
  "dow-ignored",
  "list-task-runs",
  "outbound-risk",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93015,
    title: "scheduled tasks stamp lastRunAt but never birth",
    state: "OPEN",
    citeOnly: true,
    product: "Flashpan",
    why: "Cite-only cousin — different defect (stamp without session birth). Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93683,
    title: "tool-result instruction injection / Rider",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93672,
    title: "idle_prompt while background subagents still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93680,
    title: "Bash mkdir via /proc/self/fd",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash ~8175 truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
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
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "sluice",
  "spillway",
  "leat",
  "portcullis",
  "postern",
  "embrasure",
  "wicket",
  "gnomon",
  "almanac",
  "clepsydra",
]);

export const SAMPLE_FASTI = Object.freeze({
  marked: true,
  struckWrong: true,
});

export const SAMPLE_DUE_FASTI = Object.freeze({
  marked: true,
  struckWrong: false,
});

export const SAMPLE_HAND = Object.freeze({
  skipDow: true,
  skipDom: true,
});

export const SAMPLE_DUE_HAND = Object.freeze({
  skipDow: false,
  skipDom: false,
});

export const SAMPLE_NUNDINAE = Object.freeze({
  dowHonored: false,
});

export const SAMPLE_DUE_NUNDINAE = Object.freeze({
  dowHonored: true,
});

export const SAMPLE_KALENDS = Object.freeze({
  dateHonored: false,
});

export const SAMPLE_DUE_KALENDS = Object.freeze({
  dateHonored: true,
});

export const SAMPLE_ACTA = Object.freeze({
  wrongDayFires: true,
  statusSucceeded: true,
});

export const SAMPLE_DUE_ACTA = Object.freeze({
  wrongDayFires: false,
  statusSucceeded: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "catch-up only when DOW/date fields match; calendar day correct" },
  { t: "docs", line: "on start/wake, one catch-up for the most recently missed time in last seven days" },
  { t: "mon", line: "0 19 * * 1 Monday-only should only catch up to a Monday" },
  { t: "wed", line: "45 18 * * 3 Wednesday-only should only catch up to a Wednesday" },
  { t: "cluster", line: "five weekly tasks fire ~12:15–12:19 AM local on a Friday" },
  { t: "acta", line: "list_task_runs mixes correctly-timed runs with sporadic wrong-day fires" },
  { t: "thu", line: "Thursday-only fires on Sunday and Friday" },
  { t: "wed2", line: "Wednesday-only fires on Friday and Thursday" },
  { t: "ok", line: "misfires report status: succeeded" },
  { t: "schema", line: "no disable-catch-up setting — only enabled/cronExpression/fireAt/prompt/title/description/notifyOnCompletion" },
  { t: "path", line: "catchup-dow — catch-up walks time-of-day and skips the DOW mark" },
  { t: "score", line: "when the hand skips the weekday the stone rings the wrong calends — Score calends or admit due." },
]);

export function inspectFasti(input = {}) {
  const fasti =
    input.fasti && typeof input.fasti === "object"
      ? input.fasti
      : input.due === true && input.misfired !== true
        ? SAMPLE_DUE_FASTI
        : SAMPLE_FASTI;
  const forcedWrong =
    input.misfired === true ||
    input.wrongDayCluster === true ||
    input.event === "misfired" ||
    input.event === "calends" ||
    input.event === "wrong-day-cluster" ||
    input.catchupDow === true;
  const struckWrong = forcedWrong
    ? true
    : fasti.struckWrong === true && input.due !== true;
  return {
    marked: true,
    struckWrong,
    stamp: struckWrong ? "struck" : "marked",
    note: struckWrong
      ? "fasti stone struck on unmarked weekdays — Friday cluster rings four wrong plaques"
      : "fasti stone only struck on marked weekdays — catch-up honors the calendar day",
  };
}

export function inspectHand(input = {}) {
  const hand =
    input.hand && typeof input.hand === "object"
      ? input.hand
      : input.due === true && input.misfired !== true
        ? SAMPLE_DUE_HAND
        : SAMPLE_HAND;
  const forcedSkip =
    input.dowIgnored === true ||
    input.event === "dow-ignored" ||
    input.catchupDow === true ||
    (input.misfired === true && input.due !== true);
  const skipDow = forcedSkip ? true : hand.skipDow === true && hand.skipDom !== false;
  return {
    skipDow,
    skipDom: skipDow || hand.skipDom === true,
    stamp: skipDow ? "skip-dow" : "full-fields",
    note: skipDow
      ? "catch-up hand walks time-of-day only and skips the DOW mark"
      : "catch-up hand walks the cron’s full field set including DOW and day-of-month",
  };
}

export function inspectNundinae(input = {}) {
  const nundinae =
    input.nundinae && typeof input.nundinae === "object"
      ? input.nundinae
      : input.due === true && input.misfired !== true
        ? SAMPLE_DUE_NUNDINAE
        : SAMPLE_NUNDINAE;
  const forcedIgnore =
    input.dowIgnored === true ||
    input.event === "dow-ignored" ||
    input.wrongDayCluster === true ||
    (input.misfired === true && input.due !== true);
  const honored = forcedIgnore ? false : nundinae.dowHonored === true;
  return {
    dowHonored: honored,
    stamp: honored ? "honored" : "ignored",
    note: honored
      ? "nundinal letters honored — Monday-only catch-up stays on Monday"
      : "nundinal letters ignored — Monday-only and Wednesday-only fire on Friday",
  };
}

export function inspectKalends(input = {}) {
  const kalends =
    input.kalends && typeof input.kalends === "object"
      ? input.kalends
      : input.due === true && input.misfired !== true
        ? SAMPLE_DUE_KALENDS
        : SAMPLE_KALENDS;
  const forcedSkip =
    input.event === "cron-full-fields" && input.due !== true
      ? false
      : input.catchupDow === true ||
        input.misfired === true ||
        input.event === "calends";
  const honored = forcedSkip ? false : kalends.dateHonored === true || input.due === true;
  return {
    dateHonored: honored,
    stamp: honored ? "honored" : "skipped",
    note: honored
      ? "kalends date field constrains catch-up to the matching day-of-month"
      : "kalends date field possibly skipped — catch-up picks a clock time in the last seven days",
  };
}

export function inspectActa(input = {}) {
  const acta =
    input.acta && typeof input.acta === "object"
      ? input.acta
      : input.due === true && input.misfired !== true
        ? SAMPLE_DUE_ACTA
        : SAMPLE_ACTA;
  const forcedWrong =
    input.listTaskRuns === true ||
    input.event === "list-task-runs" ||
    input.statusSucceeded === true ||
    input.event === "status-succeeded" ||
    (input.misfired === true && input.due !== true);
  const wrong = forcedWrong ? true : acta.wrongDayFires === true;
  return {
    wrongDayFires: wrong,
    statusSucceeded: wrong || acta.statusSucceeded === true,
    stamp: wrong ? "wrong-day" : "matching-day",
    note: wrong
      ? "acta diurna mixes correctly-timed runs with sporadic wrong-day fires; status succeeded"
      : "acta diurna only records fires whose weekday matches the cron",
  };
}

export function readBooth(input = {}) {
  const fasti = inspectFasti(input);
  const hand = inspectHand(input);
  const nundinae = inspectNundinae(input);
  const kalends = inspectKalends(input);
  const acta = inspectActa(input);
  const misfired =
    input.due !== true &&
    ((fasti.struckWrong && hand.skipDow) ||
      (nundinae.dowHonored === false && acta.wrongDayFires) ||
      input.misfired === true);
  const due = input.due === true && misfired !== true && !fasti.struckWrong;
  const path =
    hand.skipDow &&
    (input.event === "catchup-dow" || input.catchupDow === true);
  return {
    fasti,
    hand,
    nundinae,
    kalends,
    acta,
    plaques: WEEKDAY_PLAQUES,
    stations: BOOTH_STATIONS,
    misfired: misfired && !due && !path,
    due:
      due ||
      (!fasti.struckWrong &&
        nundinae.dowHonored &&
        input.misfired !== true &&
        input.catchupDow !== true),
    catchupDow: path && !due,
    mark:
      path && !due
        ? "catchup-dow"
        : misfired && !due
          ? "misfired"
          : "due",
  };
}

/**
 * Published calends walk from #93687 only. Facts from the issue text.
 * A due booth only catch-up-fires when DOW/date fields match.
 * A misfired booth rings unmarked weekdays with status succeeded.
 * A catchup-dow booth names the skipped DOW field as the path.
 */
export const CALENDS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-due",
    due: true,
    misfired: false,
    cue: "due",
    note: "idle HOLD: catch-up only when DOW/date fields match; calendar day correct",
  },
  {
    t: "docs",
    event: "cron-full-fields",
    due: true,
    cronFullFields: true,
    cue: "due",
    note: "docs: on start/wake, one catch-up for the most recently missed time in last seven days",
  },
  {
    t: "mon",
    event: "dow-ignored",
    misfired: true,
    dowIgnored: true,
    cue: "misfired",
    note: "0 19 * * 1 Monday-only should only catch up to a Monday",
  },
  {
    t: "wed",
    event: "dow-ignored",
    misfired: true,
    dowIgnored: true,
    cue: "misfired",
    note: "45 18 * * 3 Wednesday-only should only catch up to a Wednesday",
  },
  {
    t: "cluster",
    event: "wrong-day-cluster",
    misfired: true,
    wrongDayCluster: true,
    cue: "misfired",
    note: "five weekly tasks fire ~12:15–12:19 AM local on a Friday",
  },
  {
    t: "acta",
    event: "list-task-runs",
    misfired: true,
    listTaskRuns: true,
    cue: "misfired",
    note: "list_task_runs mixes correctly-timed runs with sporadic wrong-day fires",
  },
  {
    t: "thu",
    event: "wrong-day-cluster",
    misfired: true,
    wrongDayCluster: true,
    cue: "misfired",
    note: "Thursday-only fires on Sunday and Friday",
  },
  {
    t: "wed2",
    event: "wrong-day-cluster",
    misfired: true,
    wrongDayCluster: true,
    cue: "misfired",
    note: "Wednesday-only fires on Friday and Thursday",
  },
  {
    t: "ok",
    event: "status-succeeded",
    misfired: true,
    statusSucceeded: true,
    cue: "misfired",
    note: "misfires report status: succeeded",
  },
  {
    t: "schema",
    event: "no-disable-setting",
    misfired: true,
    noDisableSetting: true,
    cue: "misfired",
    note: "no disable-catch-up setting — schemas omit a catch-up toggle",
  },
  {
    t: "risk",
    event: "outbound-risk",
    misfired: true,
    outboundRisk: true,
    cue: "misfired",
    note: "Gmail drafts, Jira issues, git commits can duplicate or run with wrong-day assumptions",
  },
  {
    t: "path",
    event: "catchup-dow",
    misfired: true,
    catchupDow: true,
    dowIgnored: true,
    wrongDayCluster: true,
    cue: "misfired",
    note: "catchup-dow — catch-up walks time-of-day and skips the DOW mark",
  },
  {
    t: "score",
    event: "calends",
    misfired: true,
    wrongDayCluster: true,
    statusSucceeded: true,
    noDisableSetting: true,
    dowIgnored: true,
    listTaskRuns: true,
    outboundRisk: true,
    catchupDow: true,
    cue: "misfired",
    note: "calends — when the hand skips the weekday the stone rings the wrong day",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cron-full-fields",
    due: true,
    cronFullFields: true,
    cue: "due",
    note: "positive control: catch-up walks the cron’s full field set including DOW",
  },
  {
    t: "monday",
    event: "cue-due",
    due: true,
    cue: "due",
    note: "positive control: Monday-only 0 19 * * 1 catch-up stays on a Monday",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    due: true,
    misfired: false,
    cronFullFields: true,
    cue: "due",
  };
}

export function seedDue() {
  return { ...emptyTicket() };
}

export function seedMisfired() {
  return {
    seed: SEEDED_WORD,
    due: false,
    misfired: true,
    wrongDayCluster: true,
    statusSucceeded: true,
    noDisableSetting: true,
    dowIgnored: true,
    listTaskRuns: true,
    outboundRisk: true,
    catchupDow: true,
    cue: "misfired",
    issue: FEATURED_ISSUE,
    fasti: SAMPLE_FASTI,
    hand: SAMPLE_HAND,
    nundinae: SAMPLE_NUNDINAE,
    kalends: SAMPLE_KALENDS,
    acta: SAMPLE_ACTA,
  };
}

export function seedCalends() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    misfired: true,
    wrongDayCluster: true,
    statusSucceeded: true,
    noDisableSetting: true,
    dowIgnored: true,
    listTaskRuns: true,
    outboundRisk: true,
    catchupDow: true,
    cue: "misfired",
  };
}

export function seedCatchupDow() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    misfired: true,
    catchupDow: true,
    dowIgnored: true,
    wrongDayCluster: true,
    event: "catchup-dow",
    cue: "misfired",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    due: true,
    cue: "due",
  };
}

export function seedWrongDayCluster() {
  return {
    seed: "wrong-day-cluster",
    preferSeed: true,
    wrongDayCluster: true,
    cue: "misfired",
  };
}

export function seedStatusSucceeded() {
  return {
    seed: "status-succeeded",
    preferSeed: true,
    statusSucceeded: true,
    cue: "misfired",
  };
}

export function seedNoDisableSetting() {
  return {
    seed: "no-disable-setting",
    preferSeed: true,
    noDisableSetting: true,
    cue: "misfired",
  };
}

export function seedDowIgnored() {
  return {
    seed: "dow-ignored",
    preferSeed: true,
    dowIgnored: true,
    cue: "misfired",
  };
}

export function seedCronFullFields() {
  return {
    seed: "cron-full-fields",
    preferSeed: true,
    cronFullFields: true,
    cue: "due",
  };
}

export function seedListTaskRuns() {
  return {
    seed: "list-task-runs",
    preferSeed: true,
    listTaskRuns: true,
    cue: "misfired",
  };
}

export function seedOutboundRisk() {
  return {
    seed: "outbound-risk",
    preferSeed: true,
    outboundRisk: true,
    cue: "misfired",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      due: false,
      misfired: false,
      catchupDow: false,
      wrongDayCluster: false,
      statusSucceeded: false,
      noDisableSetting: false,
      dowIgnored: false,
      cronFullFields: false,
      listTaskRuns: false,
      outboundRisk: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    due: raw.due === true,
    misfired:
      raw.misfired === true ||
      raw.event === "misfired" ||
      raw.event === "calends",
    catchupDow: raw.catchupDow === true || raw.event === "catchup-dow",
    wrongDayCluster:
      raw.wrongDayCluster === true || raw.event === "wrong-day-cluster",
    statusSucceeded:
      raw.statusSucceeded === true || raw.event === "status-succeeded",
    noDisableSetting:
      raw.noDisableSetting === true || raw.event === "no-disable-setting",
    dowIgnored: raw.dowIgnored === true || raw.event === "dow-ignored",
    cronFullFields:
      raw.cronFullFields === true || raw.event === "cron-full-fields",
    listTaskRuns: raw.listTaskRuns === true || raw.event === "list-task-runs",
    outboundRisk: raw.outboundRisk === true || raw.event === "outbound-risk",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    fasti: raw.fasti,
    hand: raw.hand,
    nundinae: raw.nundinae,
    kalends: raw.kalends,
    acta: raw.acta,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.due != null ||
        ticket.misfired != null ||
        ticket.catchupDow != null ||
        ticket.wrongDayCluster != null ||
        ticket.statusSucceeded != null ||
        ticket.dowIgnored != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.fasti ||
        ticket.hand ||
        ticket.nundinae),
  );
}

function isDue(row) {
  if (row.misfired && row.cue !== "due") return false;
  if (
    row.cue === "misfired" ||
    row.cue === "calends" ||
    row.cue === "catchup-dow"
  ) {
    return false;
  }
  if (
    row.wrongDayCluster &&
    row.statusSucceeded &&
    row.cue !== "due" &&
    row.due !== true
  ) {
    return false;
  }
  if (
    row.catchupDow &&
    row.dowIgnored &&
    row.cue !== "due" &&
    row.due !== true
  ) {
    return false;
  }
  if (row.due === true && row.misfired !== true && row.cue !== "misfired") {
    return true;
  }
  if (
    row.cue === "due" &&
    row.misfired !== true &&
    row.wrongDayCluster !== true &&
    row.catchupDow !== true
  ) {
    return true;
  }
  if (
    row.cronFullFields === true &&
    row.misfired !== true &&
    row.wrongDayCluster !== true &&
    row.dowIgnored !== true &&
    row.catchupDow !== true
  ) {
    return true;
  }
  return false;
}

function isCatchupDowPath(row) {
  return (
    row.event === "catchup-dow" &&
    !isDue(row) &&
    (row.catchupDow === true || row.dowIgnored === true || row.wrongDayCluster === true)
  );
}

function isMisfired(row) {
  if (isDue(row)) return false;
  if (isCatchupDowPath(row) && row.cue !== "misfired") return false;
  if (row.cue === "misfired" || row.cue === "calends") return true;
  if (row.misfired === true) return true;
  if (
    row.wrongDayCluster === true &&
    row.statusSucceeded === true &&
    row.dowIgnored === true
  ) {
    return true;
  }
  if (row.wrongDayCluster === true && row.statusSucceeded === true) {
    return true;
  }
  if (
    row.wrongDayCluster === true ||
    row.statusSucceeded === true ||
    row.noDisableSetting === true ||
    row.dowIgnored === true ||
    (row.catchupDow === true && row.listTaskRuns === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one calends pass against the stone calendar booth.
 * due: catch-up only when DOW/date fields match; calendar day correct.
 * misfired / calends: wrong-day catch-up; status succeeded.
 * catchup-dow: catch-up walks time-of-day and skips the DOW mark.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCatchupDowPath(row) ||
    (row.catchupDow && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "catchup-dow";
  } else if (isMisfired(row)) {
    verdict = "calends";
  } else if (isDue(row)) {
    verdict = "due";
  } else if (
    row.wrongDayCluster ||
    row.statusSucceeded ||
    row.dowIgnored ||
    (row.catchupDow && !row.cronFullFields)
  ) {
    verdict = "calends";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const fasti = inspectFasti(row);
  const hand = inspectHand(row);
  const nundinae = inspectNundinae(row);
  const kalends = inspectKalends(row);
  const acta = inspectActa(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    due: verdict === "due" || verdict === "hold",
    misfired:
      verdict === "misfired" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    catchupDow:
      row.catchupDow === true ||
      verdict === "catchup-dow" ||
      verdict === PATH_WORD,
    wrongDayCluster: row.wrongDayCluster,
    statusSucceeded: row.statusSucceeded,
    noDisableSetting: row.noDisableSetting,
    dowIgnored: row.dowIgnored,
    cronFullFields: row.cronFullFields,
    listTaskRuns: row.listTaskRuns,
    outboundRisk: row.outboundRisk,
    cue: hold
      ? "due"
      : row.catchupDow || verdict === "catchup-dow"
        ? "catchup-dow"
        : "misfired",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit due" : "score calends",
    fastiInspect: fasti,
    handInspect: hand,
    nundinaeInspect: nundinae,
    kalendsInspect: kalends,
    actaInspect: acta,
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
      : CALENDS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const misfired = scored.filter(
    (row) => row.verdict === "calends" || row.verdict === "misfired",
  );
  const path = scored.filter((row) => row.verdict === "catchup-dow");
  const due = scored.filter((row) => row.verdict === "due");
  const headline =
    scored.find((row) => row.event === "misfired") ||
    scored.find((row) => row.event === "catchup-dow") ||
    scored.find((row) => row.event === "wrong-day-cluster") ||
    misfired[misfired.length - 1];
  let verdict = "due";
  if (misfired.length) verdict = "calends";
  else if (path.length && !due.length) verdict = "catchup-dow";
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
    misfiredCount: misfired.length,
    pathCount: path.length,
    dueCount: due.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit due" : "score calends",
    note: headline
      ? "Desktop Scheduled Tasks; catch-up fires without re-validating DOW/date; Friday cluster 12:15–12:19 AM; status succeeded; no disable-catch-up setting."
      : "published calends walk scored against due vs misfired",
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
    seeded !== "due" &&
    seeded !== "misfired" &&
    seeded !== "catchup-dow" &&
    seeded !== "calends" &&
    ticket.due == null &&
    ticket.misfired == null &&
    ticket.wrongDayCluster == null &&
    ticket.catchupDow == null &&
    ticket.dowIgnored == null &&
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
    due: scored.due ?? false,
    misfired: scored.misfired ?? false,
    catchupDow: scored.catchupDow ?? false,
    wrongDayCluster: scored.wrongDayCluster ?? false,
    statusSucceeded: scored.statusSucceeded ?? false,
    noDisableSetting: scored.noDisableSetting ?? false,
    dowIgnored: scored.dowIgnored ?? false,
    cronFullFields: scored.cronFullFields ?? false,
    listTaskRuns: scored.listTaskRuns ?? false,
    outboundRisk: scored.outboundRisk ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.due && !result.misfired ? "fasti=marked" : "fasti=struck",
    result.dowIgnored || result.misfired ? "hand=skip-dow" : "hand=full-fields",
    result.dowIgnored || result.misfired ? "nundinae=ignored" : "nundinae=honored",
    result.catchupDow || result.misfired ? "kalends=skipped" : "kalends=honored",
    result.listTaskRuns || result.misfired ? "acta=wrong-day" : "acta=matching-day",
    result.catchupDow || result.verdict === "catchup-dow"
      ? "path=catchup-dow"
      : "path=due",
    result.cue === "due"
      ? "cue=due"
      : result.cue === "catchup-dow"
        ? "cue=catchup-dow"
        : "cue=misfired",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    due: result.due,
    misfired: result.misfired,
    catchupDow: result.catchupDow,
    wrongDayCluster: result.wrongDayCluster,
    statusSucceeded: result.statusSucceeded,
    noDisableSetting: result.noDisableSetting,
    dowIgnored: result.dowIgnored,
    cronFullFields: result.cronFullFields,
    listTaskRuns: result.listTaskRuns,
    outboundRisk: result.outboundRisk,
    fasti: input && input.fasti,
    hand: input && input.hand,
    nundinae: input && input.nundinae,
    kalends: input && input.kalends,
    acta: input && input.acta,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    fasti: inspectFasti({
      due: result.due,
      misfired: result.misfired,
      wrongDayCluster: result.wrongDayCluster,
      catchupDow: result.catchupDow,
      fasti: input && input.fasti,
    }),
    hand: inspectHand({
      due: result.due,
      misfired: result.misfired,
      dowIgnored: result.dowIgnored,
      catchupDow: result.catchupDow,
      hand: input && input.hand,
    }),
    nundinae: inspectNundinae({
      due: result.due,
      misfired: result.misfired,
      dowIgnored: result.dowIgnored,
      wrongDayCluster: result.wrongDayCluster,
      nundinae: input && input.nundinae,
    }),
    kalends: inspectKalends({
      due: result.due,
      misfired: result.misfired,
      catchupDow: result.catchupDow,
      kalends: input && input.kalends,
    }),
    acta: inspectActa({
      due: result.due,
      misfired: result.misfired,
      listTaskRuns: result.listTaskRuns,
      statusSucceeded: result.statusSucceeded,
      acta: input && input.acta,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      misfired:
        result.misfired === true ||
        result.verdict === "misfired" ||
        result.verdict === "calends",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      author: AUTHOR,
      clusterStart: CLUSTER_START,
      clusterEnd: CLUSTER_END,
      clusterDay: CLUSTER_DAY,
      taskCount: TASK_COUNT,
      lookbackDays: LOOKBACK_DAYS,
      mondayCron: MONDAY_CRON,
      wednesdayCron: WEDNESDAY_CRON,
      schemaFields: [...SCHEMA_FIELDS],
      plaques: WEEKDAY_PLAQUES,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "Catch-up should compute “the most recently missed time” by walking backward through the cron’s full field set (including day-of-week and day-of-month), so a Wednesday-only task’s most recent missed time is always a Wednesday.",
      ],
      hypothesis:
        "NON-BINDING: missed-run catch-up may pick the most recent clock time in the last 7 days that matches HH:MM while ignoring DOW/DOM constraints. Verify against #93687 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
