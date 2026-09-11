#!/usr/bin/env node
/**
 * Irons — sailing vessel in irons / head-to-wind booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * scheduled / cron / background Claude Code sessions hang indefinitely
 * on WebSearch (no result, no error, no timeout; lastActivityAt freezes;
 * session stays "running"), while the identical WebSearch query in an
 * interactive session on the same machine / account returns in a few
 * seconds. Capping WebSearch to 2 calls still hangs on the first call.
 * Evidence sessions: local_aa541c89…, local_3d6a8422…, local_7e5dc769…
 * (Windows desktop Scheduled Tasks / scheduled-tasks MCP).
 *
 *   node irons.mjs data/becalmed.json
 *   echo '{"seed":"becalmed"}' | node irons.mjs
 *
 * Idle word is underway (HOLD: interactive WebSearch returns in seconds;
 * vessel has way).
 * Seeded word is becalmed (#93615 — scheduled session stuck mid-WebSearch
 * with zero progress).
 * Path word is cron-websearch.
 * Product score word is irons (Score irons or admit underway.).
 *
 * Encoded from anthropics/claude-code#93615 issue text only.
 * Hypothesis (NON-BINDING): scheduled/background sessions may lack the
 * interactive WebSearch auth/session/egress path or miss a timeout.
 * Verify against #93615 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix. No network.
 * No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "underway",
  "becalmed",
  "irons",
  "cron-websearch",
  "hold",
  "websearch-hang",
  "no-timeout",
  "last-activity-freeze",
  "session-running",
  "first-call-hang",
  "interactive-ok",
  "cap-two",
  "interrupt-mid-call",
  "windows-desktop",
  "scheduled-tasks-mcp",
  "fifth-call-stall",
  "run-now",
  "cron-trigger",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "underway";
export const PATH_WORD = "cron-websearch";
export const SEEDED_WORD = "becalmed";
export const PRODUCT_WORD = "irons";
export const HOLD = Object.freeze(["underway", "hold"]);
export const RECOVER = Object.freeze(["underway", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  FORBIDDEN_IDLE.filter(
    (name) => name !== "becalmed" && name !== "irons",
  ),
);

export const FEATURED_ISSUE = 93615;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93615";
export const TITLE =
  "[BUG] Scheduled tasks: WebSearch tool calls hang indefinitely in background/cron-triggered sessions";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tools",
  "area:desktop",
  "area:routines",
]);
export const PLATFORM = "Windows";
export const MODEL = "Sonnet (default)";
export const TRIGGER = "Scheduled Tasks / scheduled-tasks MCP";
export const RUN1_ID = "local_aa541c89-94e6-44e3-9a0c-5dac2a188f0b";
export const RUN2_ID = "local_3d6a8422-0097-4fb2-9eb1-9fbaf195ba9e";
export const RUN3_ID = "local_7e5dc769-7eaf-4aba-bdee-c65ee8d910b5";
export const RUN1_STARTED = "2026-09-11T08:55:28Z";
export const RUN1_CHECKED = "2026-09-11T10:36:05Z";
export const RUN1_STALL = "5th WebSearch";
export const RUN2_MESSAGES = "41->49";
export const RUN3_CREATED = "2026-09-11T11:56:00Z";
export const RUN3_CHECKED = "2026-09-11T12:13:19Z";
export const CAP_TWO = 2;
export const INTERRUPT_MARK = "[Request interrupted by user for tool use]";
export const PHRASE = "Score irons or admit underway.";
export const DISTRIBUTION =
  "Windows desktop Scheduled Tasks / scheduled-tasks MCP. Scheduled/cron/background Claude Code sessions hang indefinitely on WebSearch — no result, no error, no timeout; lastActivityAt freezes; session stays running. Identical WebSearch query in an interactive session on the same machine/account returns in a few seconds. Cap WebSearch to 2 calls still hangs on the first call.";
export const SESSION_KIND =
  "Windows scheduled-task session. Run 1 local_aa541c89… started 2026-09-11T08:55:28Z, stalled on the 5th WebSearch, still running at 2026-09-11T10:36:05Z (~1h40m). Run 2 local_3d6a8422… trickled 41→49 messages then stopped mid-WebSearch. Run 3 local_7e5dc769… created 2026-09-11T11:56:00Z, hung on the first WebSearch, still stuck after 17 minutes (2026-09-11T12:13:19Z). Interrupt landed mid-WebSearch-tool-call.";

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "helm",
    survey: "read the helm (vessel should have way, not sit head-to-wind)",
    kind: "helm",
    note: "seeded: helm locked head-to-wind; sails aback; no way on",
  },
  {
    id: "kite",
    survey: "watch the WebSearch kite (should fill on the first puff)",
    kind: "kite",
    note: "seeded: cron kite never fills — no result, no error, no timeout",
  },
  {
    id: "chronometer",
    survey: "read the scheduled chronometer (lastActivityAt should advance)",
    kind: "chronometer",
    note: "seeded: lastActivityAt freezes while the session stays running",
  },
  {
    id: "wind",
    survey: "compare the interactive wind gauge (same query, same machine)",
    kind: "wind",
    note: "seeded: interactive gauge shows breeze in seconds; cron path is calm",
  },
  {
    id: "log",
    survey: "read the session log (progress, or zero way)",
    kind: "log",
    note: "seeded: status running, zero new activity; interrupt mid-WebSearch",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "cron-websearch",
  "becalmed",
  "websearch-hang",
  "no-timeout",
  "last-activity-freeze",
  "session-running",
  "first-call-hang",
  "interactive-ok",
]);

export const COUSINS = Object.freeze([
  {
    issue: 89639,
    title: "macOS scheduled-task sessions wedge mid tool-call (WebSearch/WebFetch) for days",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — scheduled-task mid-tool wedge. Do not rebuild",
  },
  {
    issue: 83859,
    title: "headless claude -p stalls ~405s early",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — headless stall. Do not rebuild",
  },
  {
    issue: 91723,
    title: "WebSearch quota exhausted without warning",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — quota warning. Do not rebuild",
  },
  {
    issue: 81478,
    title: "WebSearch model-access / adaptive-thinking failures",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — WebSearch model-access. Do not rebuild",
  },
  {
    issue: 89633,
    title: "WebSearch model-access / adaptive-thinking failures",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — WebSearch adaptive-thinking. Do not rebuild",
  },
  {
    issue: 85119,
    title: "VS Code ignores WebFetch/WebSearch permission rules",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — permission rules. Do not rebuild",
  },
  {
    issue: 47180,
    title: "Cowork scheduled tasks ignore Always-allow permissions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Always-allow ignore. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93570,
    title: "single-task shutdown kills all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93589,
    title: "Cowork egress additional domains ignored",
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
  {
    issue: 93622,
    title: "channel messages merge lose prompt cache",
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
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export const SAMPLE_HELM = Object.freeze({
  headToWind: true,
  way: false,
  sailsAback: true,
});

export const SAMPLE_UNDERWAY_HELM = Object.freeze({
  headToWind: false,
  way: true,
  sailsAback: false,
});

export const SAMPLE_KITE = Object.freeze({
  filled: false,
  luffing: true,
  result: false,
  error: false,
  timeout: false,
});

export const SAMPLE_UNDERWAY_KITE = Object.freeze({
  filled: true,
  luffing: false,
  result: true,
  error: false,
  timeout: false,
});

export const SAMPLE_CHRONOMETER = Object.freeze({
  frozen: true,
  lastActivityAt: RUN1_STARTED,
  advancing: false,
});

export const SAMPLE_UNDERWAY_CHRONOMETER = Object.freeze({
  frozen: false,
  lastActivityAt: RUN1_CHECKED,
  advancing: true,
});

export const SAMPLE_WIND = Object.freeze({
  interactiveBreeze: true,
  cronBreeze: false,
  seconds: true,
});

export const SAMPLE_UNDERWAY_WIND = Object.freeze({
  interactiveBreeze: true,
  cronBreeze: true,
  seconds: true,
});

export const SAMPLE_LOG = Object.freeze({
  running: true,
  progress: false,
  interrupted: true,
});

export const SAMPLE_UNDERWAY_LOG = Object.freeze({
  running: false,
  progress: true,
  interrupted: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "interactive WebSearch returns in seconds; vessel has way" },
  { t: "cron", line: "scheduled-tasks MCP / cron / Run now spawns a background session" },
  { t: "kite", line: "agent calls WebSearch once — the kite should fill" },
  { t: "hang", line: "no result, no error, no timeout — kite luffs" },
  { t: "freeze", line: "lastActivityAt stops advancing; chronometer frozen" },
  { t: "running", line: "session status stays running with zero new activity" },
  { t: "cap", line: "prompt capped at 2 WebSearch calls; hang recurs on the first call" },
  { t: "control", line: "identical query in an interactive session returns in a few seconds" },
  { t: "interrupt", line: "[Request interrupted by user for tool use] mid-WebSearch" },
  { t: "path", line: "cron-websearch — scheduled path never fills the kite" },
  { t: "score", line: "when the scheduled kite never fills, the vessel sits in irons — Score irons or admit underway." },
]);

export function inspectHelm(input = {}) {
  const helm =
    input.helm && typeof input.helm === "object"
      ? input.helm
      : input.underway === true && input.becalmed !== true
        ? SAMPLE_UNDERWAY_HELM
        : SAMPLE_HELM;
  const forcedIrons =
    input.becalmed === true ||
    input.websearchHang === true ||
    input.event === "becalmed" ||
    input.event === "irons" ||
    input.event === "websearch-hang" ||
    input.cronWebsearch === true;
  const way = forcedIrons
    ? false
    : helm.way === true ||
      input.underway === true ||
      input.interactiveOk === true;
  return {
    way,
    headToWind: !way,
    sailsAback: !way,
    stamp: way ? "underway" : "irons",
    note: way
      ? "helm has way — interactive WebSearch returned; vessel is not in irons"
      : "helm locked head-to-wind — scheduled kite never filled; vessel in irons",
  };
}

export function inspectKite(input = {}) {
  const kite =
    input.kite && typeof input.kite === "object"
      ? input.kite
      : input.underway === true && input.becalmed !== true
        ? SAMPLE_UNDERWAY_KITE
        : SAMPLE_KITE;
  const forcedLuff =
    input.websearchHang === true ||
    input.event === "websearch-hang" ||
    input.noTimeout === true ||
    (input.becalmed === true && input.underway !== true);
  const luffing = forcedLuff ? true : kite.luffing === true && kite.filled !== true;
  return {
    filled: !luffing,
    luffing,
    result: !luffing,
    error: false,
    timeout: false,
    stamp: luffing ? "luff" : "filled",
    note: luffing
      ? "WebSearch kite never fills — no result, no error, no timeout"
      : "WebSearch kite filled in seconds — interactive breeze",
  };
}

export function inspectChronometer(input = {}) {
  const chronometer =
    input.chronometer && typeof input.chronometer === "object"
      ? input.chronometer
      : input.underway === true && input.becalmed !== true
        ? SAMPLE_UNDERWAY_CHRONOMETER
        : SAMPLE_CHRONOMETER;
  const forcedFreeze =
    input.lastActivityFreeze === true ||
    input.event === "last-activity-freeze" ||
    (input.becalmed === true && input.underway !== true);
  const frozen = forcedFreeze ? true : chronometer.frozen === true;
  return {
    frozen,
    lastActivityAt: frozen ? RUN1_STARTED : chronometer.lastActivityAt || RUN1_CHECKED,
    advancing: !frozen,
    stamp: frozen ? "frozen" : "live",
    note: frozen
      ? "scheduled chronometer frozen — lastActivityAt stopped advancing"
      : "chronometer live — lastActivityAt still advancing",
  };
}

export function inspectWind(input = {}) {
  const wind =
    input.wind && typeof input.wind === "object"
      ? input.wind
      : input.underway === true && input.becalmed !== true
        ? SAMPLE_UNDERWAY_WIND
        : SAMPLE_WIND;
  const forcedSplit =
    input.interactiveOk === true ||
    input.event === "interactive-ok" ||
    (input.becalmed === true && input.underway !== true);
  const cronBreeze = forcedSplit ? false : wind.cronBreeze === true;
  return {
    interactiveBreeze: true,
    cronBreeze,
    seconds: true,
    stamp: cronBreeze ? "both" : "split",
    note: cronBreeze
      ? "interactive and cron gauges both show breeze"
      : "interactive wind gauge shows breeze; cron path is calm",
  };
}

export function inspectLog(input = {}) {
  const log =
    input.sessionLog && typeof input.sessionLog === "object"
      ? input.sessionLog
      : input.underway === true && input.becalmed !== true
        ? SAMPLE_UNDERWAY_LOG
        : SAMPLE_LOG;
  const forcedStuck =
    input.sessionRunning === true ||
    input.event === "session-running" ||
    input.firstCallHang === true ||
    (input.becalmed === true && input.underway !== true);
  const stuck = forcedStuck ? true : log.running === true && log.progress !== true;
  return {
    running: stuck || log.running === true,
    progress: !stuck,
    interrupted: stuck,
    stamp: stuck ? "stuck" : "way",
    note: stuck
      ? "session stays running with zero progress; interrupt landed mid-WebSearch"
      : "session made way — WebSearch returned and the log advanced",
  };
}

export function readBooth(input = {}) {
  const helm = inspectHelm(input);
  const kite = inspectKite(input);
  const chronometer = inspectChronometer(input);
  const wind = inspectWind(input);
  const sessionLog = inspectLog(input);
  const becalmed =
    input.underway !== true &&
    ((kite.luffing && chronometer.frozen) ||
      (helm.headToWind && sessionLog.running) ||
      input.becalmed === true);
  const underway =
    input.underway === true &&
    becalmed !== true &&
    helm.way;
  const path =
    (kite.luffing && wind.interactiveBreeze && !wind.cronBreeze) &&
    (input.event === "cron-websearch" || input.cronWebsearch === true);
  return {
    helm,
    kite,
    chronometer,
    wind,
    sessionLog,
    stations: BOOTH_STATIONS,
    becalmed: becalmed && !underway && !path,
    underway:
      underway ||
      (helm.way &&
        kite.filled &&
        input.becalmed !== true &&
        input.cronWebsearch !== true),
    cronWebsearch: path && !underway,
    mark:
      path && !underway
        ? "cron-websearch"
        : becalmed && !underway
          ? "becalmed"
          : "underway",
  };
}

/**
 * Published irons walk from #93615 only. Facts from the issue text.
 * An underway booth fills the interactive kite in seconds.
 * A becalmed booth hangs the scheduled kite with zero progress.
 * A cron-websearch booth names the scheduled WebSearch hang as the path.
 */
export const IRONS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-underway",
    underway: true,
    becalmed: false,
    interactiveOk: true,
    cue: "underway",
    note: "idle HOLD: interactive WebSearch returns in seconds; vessel has way",
  },
  {
    t: "cron",
    event: "cron-trigger",
    becalmed: true,
    cronTrigger: true,
    cue: "becalmed",
    note: "scheduled-tasks MCP / cron / Run now spawns a background session",
  },
  {
    t: "kite",
    event: "websearch-hang",
    becalmed: true,
    websearchHang: true,
    cue: "becalmed",
    note: "agent calls WebSearch once — the kite should fill",
  },
  {
    t: "hang",
    event: "no-timeout",
    becalmed: true,
    websearchHang: true,
    noTimeout: true,
    cue: "becalmed",
    note: "no result, no error, no timeout — kite luffs",
  },
  {
    t: "freeze",
    event: "last-activity-freeze",
    becalmed: true,
    lastActivityFreeze: true,
    cue: "becalmed",
    note: "lastActivityAt stops advancing; chronometer frozen",
  },
  {
    t: "running",
    event: "session-running",
    becalmed: true,
    sessionRunning: true,
    cue: "becalmed",
    note: "session status stays running with zero new activity",
  },
  {
    t: "cap",
    event: "first-call-hang",
    becalmed: true,
    firstCallHang: true,
    capTwo: true,
    cue: "becalmed",
    note: "prompt capped at 2 WebSearch calls; hang recurs on the first call",
  },
  {
    t: "control",
    event: "interactive-ok",
    underway: true,
    interactiveOk: true,
    cue: "underway",
    note: "identical query in an interactive session returns in a few seconds",
  },
  {
    t: "interrupt",
    event: "interrupt-mid-call",
    becalmed: true,
    interruptMidCall: true,
    websearchHang: true,
    cue: "becalmed",
    note: "[Request interrupted by user for tool use] mid-WebSearch",
  },
  {
    t: "path",
    event: "cron-websearch",
    becalmed: true,
    cronWebsearch: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    cue: "becalmed",
    note: "cron-websearch — scheduled path never fills the kite",
  },
  {
    t: "score",
    event: "irons",
    becalmed: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    sessionRunning: true,
    firstCallHang: true,
    cronWebsearch: true,
    cue: "becalmed",
    note: "irons — when the scheduled kite never fills, the vessel sits head-to-wind",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "interactive-ok",
    underway: true,
    interactiveOk: true,
    cue: "underway",
    note: "positive control: identical WebSearch query in an interactive session returns in seconds",
  },
  {
    t: "direct",
    event: "cue-underway",
    underway: true,
    cue: "underway",
    note: "positive control: interactive session on the same machine/account has way",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    underway: true,
    becalmed: false,
    interactiveOk: true,
    cue: "underway",
  };
}

export function seedUnderway() {
  return { ...emptyTicket() };
}

export function seedBecalmed() {
  return {
    seed: SEEDED_WORD,
    underway: false,
    becalmed: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    sessionRunning: true,
    firstCallHang: true,
    interactiveOk: true,
    capTwo: true,
    interruptMidCall: true,
    cronTrigger: true,
    cronWebsearch: true,
    cue: "becalmed",
    issue: FEATURED_ISSUE,
    helm: SAMPLE_HELM,
    kite: SAMPLE_KITE,
    chronometer: SAMPLE_CHRONOMETER,
    wind: SAMPLE_WIND,
    sessionLog: SAMPLE_LOG,
  };
}

export function seedIrons() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    becalmed: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    sessionRunning: true,
    firstCallHang: true,
    cronWebsearch: true,
    cue: "becalmed",
  };
}

export function seedCronWebsearch() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    becalmed: true,
    cronWebsearch: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    event: "cron-websearch",
    cue: "becalmed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    underway: true,
    cue: "underway",
  };
}

export function seedWebsearchHang() {
  return { seed: "websearch-hang", preferSeed: true, websearchHang: true, cue: "becalmed" };
}

export function seedNoTimeout() {
  return { seed: "no-timeout", preferSeed: true, noTimeout: true, cue: "becalmed" };
}

export function seedLastActivityFreeze() {
  return { seed: "last-activity-freeze", preferSeed: true, lastActivityFreeze: true, cue: "becalmed" };
}

export function seedSessionRunning() {
  return { seed: "session-running", preferSeed: true, sessionRunning: true, cue: "becalmed" };
}

export function seedFirstCallHang() {
  return { seed: "first-call-hang", preferSeed: true, firstCallHang: true, cue: "becalmed" };
}

export function seedInteractiveOk() {
  return { seed: "interactive-ok", preferSeed: true, interactiveOk: true, cue: "underway" };
}

export function seedCapTwo() {
  return { seed: "cap-two", preferSeed: true, capTwo: true, cue: "becalmed" };
}

export function seedInterruptMidCall() {
  return { seed: "interrupt-mid-call", preferSeed: true, interruptMidCall: true, cue: "becalmed" };
}

export function seedWindowsDesktop() {
  return { seed: "windows-desktop", preferSeed: true, windowsDesktop: true, cue: "becalmed" };
}

export function seedScheduledTasksMcp() {
  return { seed: "scheduled-tasks-mcp", preferSeed: true, scheduledTasksMcp: true, cue: "becalmed" };
}

export function seedFifthCallStall() {
  return { seed: "fifth-call-stall", preferSeed: true, fifthCallStall: true, cue: "becalmed" };
}

export function seedRunNow() {
  return { seed: "run-now", preferSeed: true, runNow: true, cue: "becalmed" };
}

export function seedCronTrigger() {
  return { seed: "cron-trigger", preferSeed: true, cronTrigger: true, cue: "becalmed" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      underway: false,
      becalmed: false,
      cronWebsearch: false,
      websearchHang: false,
      noTimeout: false,
      lastActivityFreeze: false,
      sessionRunning: false,
      firstCallHang: false,
      interactiveOk: false,
      capTwo: false,
      interruptMidCall: false,
      windowsDesktop: false,
      scheduledTasksMcp: false,
      fifthCallStall: false,
      runNow: false,
      cronTrigger: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    underway: raw.underway === true,
    becalmed:
      raw.becalmed === true ||
      raw.event === "becalmed" ||
      raw.event === "irons",
    cronWebsearch: raw.cronWebsearch === true || raw.event === "cron-websearch",
    websearchHang: raw.websearchHang === true || raw.event === "websearch-hang",
    noTimeout: raw.noTimeout === true || raw.event === "no-timeout",
    lastActivityFreeze:
      raw.lastActivityFreeze === true || raw.event === "last-activity-freeze",
    sessionRunning: raw.sessionRunning === true || raw.event === "session-running",
    firstCallHang: raw.firstCallHang === true || raw.event === "first-call-hang",
    interactiveOk: raw.interactiveOk === true || raw.event === "interactive-ok",
    capTwo: raw.capTwo === true || raw.event === "cap-two",
    interruptMidCall:
      raw.interruptMidCall === true || raw.event === "interrupt-mid-call",
    windowsDesktop: raw.windowsDesktop === true || raw.event === "windows-desktop",
    scheduledTasksMcp:
      raw.scheduledTasksMcp === true || raw.event === "scheduled-tasks-mcp",
    fifthCallStall: raw.fifthCallStall === true || raw.event === "fifth-call-stall",
    runNow: raw.runNow === true || raw.event === "run-now",
    cronTrigger: raw.cronTrigger === true || raw.event === "cron-trigger",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    helm: raw.helm,
    kite: raw.kite,
    chronometer: raw.chronometer,
    wind: raw.wind,
    sessionLog: raw.sessionLog,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.underway != null ||
        ticket.becalmed != null ||
        ticket.cronWebsearch != null ||
        ticket.websearchHang != null ||
        ticket.noTimeout != null ||
        ticket.lastActivityFreeze != null ||
        ticket.sessionRunning != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.helm ||
        ticket.kite ||
        ticket.chronometer),
  );
}

function isUnderway(row) {
  if (row.becalmed && row.cue !== "underway") return false;
  if (
    row.cue === "becalmed" ||
    row.cue === "irons" ||
    row.cue === "cron-websearch"
  ) {
    return false;
  }
  if (
    row.websearchHang &&
    row.noTimeout &&
    row.cue !== "underway" &&
    row.underway !== true
  ) {
    return false;
  }
  if (
    row.cronWebsearch &&
    row.websearchHang &&
    row.cue !== "underway" &&
    row.underway !== true
  ) {
    return false;
  }
  if (row.underway === true && row.becalmed !== true && row.cue !== "becalmed") {
    return true;
  }
  if (
    row.cue === "underway" &&
    row.becalmed !== true &&
    row.websearchHang !== true &&
    row.cronWebsearch !== true
  ) {
    return true;
  }
  if (
    row.interactiveOk === true &&
    row.becalmed !== true &&
    row.websearchHang !== true &&
    row.noTimeout !== true &&
    row.cronWebsearch !== true
  ) {
    return true;
  }
  return false;
}

function isCronWebsearchPath(row) {
  return (
    row.event === "cron-websearch" &&
    !isUnderway(row) &&
    (row.cronWebsearch === true || row.websearchHang === true || row.noTimeout === true)
  );
}

function isBecalmed(row) {
  if (isUnderway(row)) return false;
  if (isCronWebsearchPath(row) && row.cue !== "becalmed") return false;
  if (row.cue === "becalmed" || row.cue === "irons") return true;
  if (row.becalmed === true) return true;
  if (
    row.websearchHang === true &&
    row.noTimeout === true &&
    row.lastActivityFreeze === true
  ) {
    return true;
  }
  if (row.websearchHang === true && row.noTimeout === true) {
    return true;
  }
  if (
    row.websearchHang === true ||
    row.noTimeout === true ||
    row.lastActivityFreeze === true ||
    row.firstCallHang === true ||
    (row.cronWebsearch === true && row.sessionRunning === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one irons pass against the head-to-wind booth.
 * underway: interactive WebSearch returns in seconds; vessel has way.
 * becalmed / irons: scheduled session stuck mid-WebSearch with zero progress.
 * cron-websearch: scheduled path never fills the kite.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCronWebsearchPath(row) ||
    (row.cronWebsearch && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "cron-websearch";
  } else if (isBecalmed(row)) {
    verdict = "irons";
  } else if (isUnderway(row)) {
    verdict = "underway";
  } else if (
    row.websearchHang ||
    row.noTimeout ||
    row.lastActivityFreeze ||
    (row.cronWebsearch && !row.interactiveOk)
  ) {
    verdict = "irons";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const helm = inspectHelm(row);
  const kite = inspectKite(row);
  const chronometer = inspectChronometer(row);
  const wind = inspectWind(row);
  const sessionLog = inspectLog(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    underway: verdict === "underway" || verdict === "hold",
    becalmed:
      verdict === "becalmed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    cronWebsearch:
      row.cronWebsearch === true ||
      verdict === "cron-websearch" ||
      verdict === PATH_WORD,
    websearchHang: row.websearchHang,
    noTimeout: row.noTimeout,
    lastActivityFreeze: row.lastActivityFreeze,
    sessionRunning: row.sessionRunning,
    firstCallHang: row.firstCallHang,
    interactiveOk: row.interactiveOk,
    capTwo: row.capTwo,
    interruptMidCall: row.interruptMidCall,
    windowsDesktop: row.windowsDesktop,
    scheduledTasksMcp: row.scheduledTasksMcp,
    fifthCallStall: row.fifthCallStall,
    runNow: row.runNow,
    cronTrigger: row.cronTrigger,
    cue: hold
      ? "underway"
      : row.cronWebsearch || verdict === "cron-websearch"
        ? "cron-websearch"
        : "becalmed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit underway" : "score irons",
    helmInspect: helm,
    kiteInspect: kite,
    chronometerInspect: chronometer,
    windInspect: wind,
    logInspect: sessionLog,
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
      : IRONS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const becalmed = scored.filter(
    (row) => row.verdict === "irons" || row.verdict === "becalmed",
  );
  const path = scored.filter((row) => row.verdict === "cron-websearch");
  const underway = scored.filter((row) => row.verdict === "underway");
  const headline =
    scored.find((row) => row.event === "becalmed") ||
    scored.find((row) => row.event === "cron-websearch") ||
    scored.find((row) => row.event === "websearch-hang") ||
    becalmed[becalmed.length - 1];
  let verdict = "underway";
  if (becalmed.length) verdict = "irons";
  else if (path.length && !underway.length) verdict = "cron-websearch";
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
    becalmedCount: becalmed.length,
    pathCount: path.length,
    underwayCount: underway.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit underway" : "score irons",
    note: headline
      ? "Windows scheduled-task session; WebSearch hangs indefinitely on the cron path; interactive control returns in seconds; lastActivityAt freezes; session stays running."
      : "published irons walk scored against underway vs becalmed",
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
    seeded !== "underway" &&
    seeded !== "becalmed" &&
    seeded !== "cron-websearch" &&
    seeded !== "irons" &&
    ticket.underway == null &&
    ticket.becalmed == null &&
    ticket.websearchHang == null &&
    ticket.cronWebsearch == null &&
    ticket.noTimeout == null &&
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
    underway: scored.underway ?? false,
    becalmed: scored.becalmed ?? false,
    cronWebsearch: scored.cronWebsearch ?? false,
    websearchHang: scored.websearchHang ?? false,
    noTimeout: scored.noTimeout ?? false,
    lastActivityFreeze: scored.lastActivityFreeze ?? false,
    sessionRunning: scored.sessionRunning ?? false,
    firstCallHang: scored.firstCallHang ?? false,
    interactiveOk: scored.interactiveOk ?? false,
    capTwo: scored.capTwo ?? false,
    interruptMidCall: scored.interruptMidCall ?? false,
    windowsDesktop: scored.windowsDesktop ?? false,
    scheduledTasksMcp: scored.scheduledTasksMcp ?? false,
    fifthCallStall: scored.fifthCallStall ?? false,
    runNow: scored.runNow ?? false,
    cronTrigger: scored.cronTrigger ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.underway && !result.becalmed ? "helm=underway" : "helm=irons",
    result.websearchHang || result.becalmed ? "kite=luff" : "kite=filled",
    result.lastActivityFreeze || result.becalmed
      ? "chrono=frozen"
      : "chrono=live",
    result.interactiveOk || result.becalmed ? "wind=split" : "wind=both",
    result.sessionRunning || result.becalmed ? "log=stuck" : "log=way",
    result.cronWebsearch || result.verdict === "cron-websearch"
      ? "path=cron-websearch"
      : "path=underway",
    result.cue === "underway"
      ? "cue=underway"
      : result.cue === "cron-websearch"
        ? "cue=cron-websearch"
        : "cue=becalmed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    underway: result.underway,
    becalmed: result.becalmed,
    cronWebsearch: result.cronWebsearch,
    websearchHang: result.websearchHang,
    noTimeout: result.noTimeout,
    lastActivityFreeze: result.lastActivityFreeze,
    sessionRunning: result.sessionRunning,
    firstCallHang: result.firstCallHang,
    interactiveOk: result.interactiveOk,
    helm: input && input.helm,
    kite: input && input.kite,
    chronometer: input && input.chronometer,
    wind: input && input.wind,
    sessionLog: input && input.sessionLog,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    helm: inspectHelm({
      underway: result.underway,
      becalmed: result.becalmed,
      websearchHang: result.websearchHang,
      interactiveOk: result.interactiveOk,
      cronWebsearch: result.cronWebsearch,
      helm: input && input.helm,
    }),
    kite: inspectKite({
      underway: result.underway,
      becalmed: result.becalmed,
      websearchHang: result.websearchHang,
      noTimeout: result.noTimeout,
      kite: input && input.kite,
    }),
    chronometer: inspectChronometer({
      underway: result.underway,
      becalmed: result.becalmed,
      lastActivityFreeze: result.lastActivityFreeze,
      chronometer: input && input.chronometer,
    }),
    wind: inspectWind({
      underway: result.underway,
      becalmed: result.becalmed,
      interactiveOk: result.interactiveOk,
      wind: input && input.wind,
    }),
    sessionLog: inspectLog({
      underway: result.underway,
      becalmed: result.becalmed,
      sessionRunning: result.sessionRunning,
      firstCallHang: result.firstCallHang,
      sessionLog: input && input.sessionLog,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      becalmed:
        result.becalmed === true ||
        result.verdict === "becalmed" ||
        result.verdict === "irons",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      model: MODEL,
      trigger: TRIGGER,
      run1Id: RUN1_ID,
      run2Id: RUN2_ID,
      run3Id: RUN3_ID,
      run1Started: RUN1_STARTED,
      run1Checked: RUN1_CHECKED,
      run1Stall: RUN1_STALL,
      run2Messages: RUN2_MESSAGES,
      run3Created: RUN3_CREATED,
      run3Checked: RUN3_CHECKED,
      capTwo: CAP_TWO,
      interruptMark: INTERRUPT_MARK,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "WebSearch calls from a scheduled/background-triggered session should complete in roughly the same time as an interactive session (seconds), or fail/timeout with an error rather than hanging indefinitely",
      ],
      hypothesis:
        "NON-BINDING: scheduled/background sessions may lack the interactive WebSearch auth/session/egress path or miss a timeout. Verify against #93615 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
