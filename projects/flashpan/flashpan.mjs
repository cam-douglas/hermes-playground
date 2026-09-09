#!/usr/bin/env node
/**
 * Flashpan — flintlock flash-pan / priming-pan booth.
 *
 * Educational diagnostic model for a published scheduled-task defect:
 * lastRunAt should advance only when a new session transcript is
 * actually created (birth-time proof). Failed launches should leave a
 * failed-run state or notification. Run now and cron should share the
 * same honest path. Instead the pan powder flashes — lastRunAt stamps
 * fresh, enabled stays true, nextRunAt looks sensible, differently-
 * scheduled tasks stamp in a <1s cluster — and the main charge never
 * fires: zero new session births by birth time. No error. No
 * notification. No failed-run state. Manual Run now fails the same way.
 *
 *   node flashpan.mjs data/flashed.json
 *   echo '{"seed":"flashed"}' | node flashpan.mjs
 *
 * Idle word is primed (HOLD: lastRunAt advances only when a new
 * session transcript is actually created — birth-time proof; failed
 * launches leave a failed-run state / notification; Run now and cron
 * share the same honest path).
 * Seeded word is flashed (#93015: lastRunAt fresh, enabled true,
 * nextRunAt sensible, stamp-clusters across differently-scheduled
 * tasks within <1s, zero new session births by birth time; Run now
 * also launches nothing; no error/notification/failed-run).
 * Path word is flashpanned.
 *
 * Encoded from anthropics/claude-code#93015 issue body only.
 * Hypothesis (NON-BINDING): session launcher fails closed after
 * uptime while the scheduler still stamps lastRunAt as success;
 * verify against #93015 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "primed",
  "flashed",
  "lastRunAt-false-signal",
  "zero-births",
  "stamp-cluster",
  "run-now-same-fail",
  "birth-time-not-mtime",
  "no-failed-run-state",
  "silent-healthy-registry",
  "restart-window-only",
  "has-repro",
  "hold",
  "flashpanned",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "primed";
export const PATH_WORD = "flashpanned";
export const SEEDED_WORD = "flashed";
export const HOLD = Object.freeze(["primed", "hold"]);
export const RECOVER = Object.freeze(["primed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "primed" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "flashed",
  "sheared",
  "unretracted",
  "emended",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "secateured",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "flashed"),
);

export const FEATURED_ISSUE = 93015;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93015";
export const TITLE =
  "Scheduled tasks stamp lastRunAt but never launch a session (no error, no failed-run state)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:routines",
]);
export const REPORTER = "sathishrao02";
export const FILED_AT = "2026-09-09T06:39:28Z";
export const PRODUCT =
  "Claude Code desktop app (Code tab), macOS 15.6 (Darwin 25.6.0)";
export const SESSION_PATH = "~/.claude/projects/<project>/<uuid>.jsonl";
export const BIRTH_STAT = "stat -f '%SB'";
export const CLUSTER_MS = 430;
export const CLUSTER_SPAN_S = 0.43;
export const DAILY_BIRTHS_BASELINE_MIN = 8;
export const DAILY_BIRTHS_BASELINE_MAX = 12;
export const ZERO_BIRTH_DATES = Object.freeze([
  "2026-09-06",
  "2026-09-07",
  "2026-09-09",
]);
export const RESTART_WINDOW_BIRTHS = 6;
export const RESTART_WINDOW_MINUTES = 25;
export const TASKS_STOPPED = 8;
export const FIRST_OBSERVED = "2026-09-06";
export const STILL_OCCURRING = "2026-09-09";

export const STAMP_CLUSTER = Object.freeze([
  {
    at: "04:11:21.158Z",
    task: "A",
    scheduledLocal: "07:07",
  },
  {
    at: "04:11:21.160Z",
    task: "B",
    scheduledLocal: "09:35",
  },
  {
    at: "04:11:21.586Z",
    task: "C",
    scheduledLocal: "07:07",
  },
]);

export const COUSINS = Object.freeze([
  {
    issue: 91527,
    title: "scheduler skips / reports success (lastRunAt) with no session",
    state: "OPEN",
    citeOnly: true,
    why: "same false-success lastRunAt class — cite only; do not clone",
  },
  {
    issue: 80671,
    title: "Cowork lastRunAt advances without session executing",
    state: "OPEN",
    citeOnly: true,
    why: "Cowork lastRunAt advances without session executing — cite only; do not clone",
  },
  {
    issue: 92429,
    title: "marks completed without actually running",
    state: "OPEN",
    citeOnly: true,
    why: "marks completed without actually running — cite only; do not clone",
  },
  {
    issue: 89936,
    title:
      "INVERSE class: lastRunAt never updates while nextRunAt advances (silent never-executes)",
    state: "OPEN",
    citeOnly: true,
    why: "inverse class — lastRunAt never updates while nextRunAt advances; Flashpan is lastRunAt that *does* stamp — cite only",
  },
  {
    issue: 90215,
    title: "silent fail with no lastRunAt",
    state: "OPEN",
    citeOnly: true,
    why: "silent fail with no lastRunAt — Flashpan stamps lastRunAt; cite only",
  },
  {
    issue: 72195,
    title: "CLOSED same shape historically",
    state: "CLOSED",
    citeOnly: true,
    why: "historical same shape — cite only; do not clone",
  },
  {
    issue: 92972,
    title:
      "DIFFERENT: task runs but session never registers with Remote Control / mobile",
    state: "OPEN",
    citeOnly: true,
    why: "session is born locally but never registers remotely — Flashpan is no session born at all; cite only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "hangfire",
  "detent",
  "oubliette",
  "ephemera",
]);

/**
 * Published flash-pan walk from #93015 only. Facts from the issue body.
 */
export const FLASH_WALK = Object.freeze([
  {
    t: "stamp",
    event: "lastRunAt-false-signal",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    stampCluster: false,
    birthTimeUsed: true,
  },
  {
    t: "births",
    event: "zero-births",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    dailyBirths: 0,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    birthTimeUsed: true,
  },
  {
    t: "cluster",
    event: "stamp-cluster",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    stampCluster: true,
    clusterMs: CLUSTER_MS,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    birthTimeUsed: true,
  },
  {
    t: "manual",
    event: "run-now-same-fail",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    runNowLaunched: false,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    birthTimeUsed: true,
  },
  {
    t: "quiet",
    event: "no-failed-run-state",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    birthTimeUsed: true,
  },
  {
    t: "registry",
    event: "silent-healthy-registry",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    enabled: true,
    nextRunAtSensibile: true,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    runNowLaunched: false,
    birthTimeUsed: true,
  },
  {
    t: "restart",
    event: "restart-window-only",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    restartWindowBirths: RESTART_WINDOW_BIRTHS,
    restartWindowMinutes: RESTART_WINDOW_MINUTES,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    birthTimeUsed: true,
  },
  {
    t: "clock",
    event: "birth-time-not-mtime",
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    birthTimeUsed: true,
    mtimeMisleading: true,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: true,
    sessionBorn: true,
    failedRunSurfaced: true,
    notification: true,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: true,
    runNowHonest: true,
    cronHonest: true,
    stampCluster: false,
    birthTimeUsed: true,
    mtimeMisleading: false,
    launchAttempted: true,
  };
}

export function seedPrimed() {
  return { ...emptyTicket() };
}

export function seedFlashed() {
  return {
    seed: SEEDED_WORD,
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    failedRunSurfaced: false,
    notification: false,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: false,
    runNowHonest: false,
    cronHonest: false,
    stampCluster: true,
    clusterMs: CLUSTER_MS,
    birthTimeUsed: true,
    mtimeMisleading: true,
    launchAttempted: true,
    dailyBirths: 0,
    issue: FEATURED_ISSUE,
  };
}

export function seedFlashpanned() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    flashpanned: true,
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: false,
    sessionBorn: false,
    failedRunSurfaced: false,
    notification: false,
    error: false,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      lastRunAtStamped: false,
      lastRunAtFresh: false,
      lastRunAtHonest: false,
      sessionBorn: false,
      failedRunSurfaced: false,
      notification: false,
      error: false,
      enabled: false,
      nextRunAtSensibile: false,
      runNowLaunched: false,
      runNowHonest: false,
      cronHonest: false,
      stampCluster: false,
      clusterMs: null,
      birthTimeUsed: false,
      mtimeMisleading: false,
      launchAttempted: false,
      flashpanned: false,
      dailyBirths: null,
      restartWindowBirths: null,
      restartWindowMinutes: null,
    };
  }
  const lastRunAtStamped =
    raw.lastRunAtStamped === true ||
    raw.lastRunAtFresh === true ||
    raw.lastRunAt === true;
  const sessionBorn =
    raw.sessionBorn === true ||
    raw.newSessionBirth === true ||
    raw.sessionCreated === true;
  const failedRunSurfaced =
    raw.failedRunSurfaced === true ||
    raw.failedRunState === true ||
    raw.failedRun === true;
  const notification =
    raw.notification === true || raw.notified === true;
  const error = raw.error === true || raw.errorSurfaced === true;
  const stampCluster =
    raw.stampCluster === true ||
    (Number(raw.clusterMs) > 0 && Number(raw.clusterMs) < 1000);
  return {
    lastRunAtStamped,
    lastRunAtFresh: raw.lastRunAtFresh === true || lastRunAtStamped,
    lastRunAtHonest:
      raw.lastRunAtHonest === true ||
      (lastRunAtStamped && sessionBorn) ||
      (!lastRunAtStamped && !sessionBorn && (failedRunSurfaced || notification)),
    sessionBorn,
    failedRunSurfaced,
    notification,
    error,
    enabled: raw.enabled === true,
    nextRunAtSensibile:
      raw.nextRunAtSensibile === true || raw.nextRunAtSensible === true,
    runNowLaunched:
      raw.runNowLaunched === true || raw.runNowSessionBorn === true,
    runNowHonest: raw.runNowHonest === true,
    cronHonest: raw.cronHonest === true,
    stampCluster,
    clusterMs: raw.clusterMs != null ? Number(raw.clusterMs) : null,
    birthTimeUsed:
      raw.birthTimeUsed === true || raw.birthTime === true,
    mtimeMisleading:
      raw.mtimeMisleading === true || raw.mtimeLies === true,
    launchAttempted:
      raw.launchAttempted === true ||
      lastRunAtStamped ||
      raw.runNow === true,
    flashpanned: raw.flashpanned === true,
    dailyBirths:
      raw.dailyBirths != null ? Number(raw.dailyBirths) : null,
    restartWindowBirths:
      raw.restartWindowBirths != null
        ? Number(raw.restartWindowBirths)
        : null,
    restartWindowMinutes:
      raw.restartWindowMinutes != null
        ? Number(raw.restartWindowMinutes)
        : null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.lastRunAtStamped != null ||
        ticket.lastRunAtFresh != null ||
        ticket.lastRunAtHonest != null ||
        ticket.sessionBorn != null ||
        ticket.failedRunSurfaced != null ||
        ticket.notification != null ||
        ticket.enabled != null ||
        ticket.nextRunAtSensibile != null ||
        ticket.nextRunAtSensible != null ||
        ticket.runNowLaunched != null ||
        ticket.stampCluster != null ||
        ticket.flashpanned != null ||
        ticket.dailyBirths != null ||
        ticket.event),
  );
}

function isPrimed(row) {
  if (row.flashpanned) return false;
  if (row.lastRunAtStamped && !row.sessionBorn) return false;
  if (row.stampCluster && !row.sessionBorn) return false;
  if (row.dailyBirths === 0 && row.lastRunAtStamped) return false;
  const honestStamp = row.lastRunAtHonest === true;
  const birthProof = row.sessionBorn === true && row.lastRunAtStamped === true;
  const failedLoud =
    !row.sessionBorn &&
    row.launchAttempted &&
    (row.failedRunSurfaced || row.notification);
  const idleHold =
    (birthProof || failedLoud || (honestStamp && !row.stampCluster)) &&
    !row.flashpanned;
  return idleHold && !(row.lastRunAtStamped && !row.sessionBorn);
}

function isFlashed(row) {
  if (row.sessionBorn && row.lastRunAtHonest && !row.stampCluster) {
    return false;
  }
  const silentFalseSuccess =
    row.lastRunAtStamped &&
    !row.sessionBorn &&
    !row.failedRunSurfaced &&
    !row.notification &&
    !row.error;
  if (silentFalseSuccess) return true;
  if (row.stampCluster && !row.sessionBorn) return true;
  if (row.dailyBirths === 0 && row.lastRunAtStamped) return true;
  if (
    row.lastRunAtFresh &&
    row.enabled &&
    row.nextRunAtSensibile &&
    !row.sessionBorn &&
    !row.failedRunSurfaced
  ) {
    return true;
  }
  if (row.runNowLaunched === false && row.lastRunAtStamped && !row.sessionBorn) {
    return true;
  }
  return false;
}

function isFlashpanned(row) {
  return row.flashpanned === true && !isPrimed(row);
}

/**
 * Score one priming seating against the flash-pan booth.
 * primed: lastRunAt advances only with a real session birth; failed
 *   launches leave a failed-run / notification; Run now and cron honest.
 * flashed: lastRunAt stamps; no session born; no failed-run; cluster.
 * flashpanned: named path — damp powder still believed fired.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isFlashpanned(row)) {
    verdict = "flashpanned";
  } else if (isFlashed(row)) {
    verdict = "flashed";
  } else if (isPrimed(row)) {
    verdict = "primed";
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
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    primed: verdict === "primed",
    flashed: verdict === "flashed" || verdict === SEEDED_WORD,
    flashpanned: verdict === "flashpanned" || verdict === PATH_WORD,
    lastRunAtStamped: row.lastRunAtStamped,
    lastRunAtFresh: row.lastRunAtFresh,
    lastRunAtHonest: row.lastRunAtHonest,
    sessionBorn: row.sessionBorn,
    failedRunSurfaced: row.failedRunSurfaced,
    notification: row.notification,
    error: row.error,
    enabled: row.enabled,
    nextRunAtSensibile: row.nextRunAtSensibile,
    runNowLaunched: row.runNowLaunched,
    runNowHonest: row.runNowHonest,
    cronHonest: row.cronHonest,
    stampCluster: row.stampCluster,
    clusterMs: row.clusterMs,
    birthTimeUsed: row.birthTimeUsed,
    mtimeMisleading: row.mtimeMisleading,
    launchAttempted: row.launchAttempted,
    dailyBirths: row.dailyBirths,
    restartWindowBirths: row.restartWindowBirths,
    restartWindowMinutes: row.restartWindowMinutes,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit primed" : "score flashed",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : FLASH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const flashed = scored.filter((row) => row.verdict === "flashed");
  const flashpanned = scored.filter((row) => row.verdict === "flashpanned");
  const primed = scored.filter((row) => row.verdict === "primed");
  const headline =
    scored.find((row) => row.event === "stamp-cluster") ||
    scored.find((row) => row.event === "zero-births") ||
    scored.find((row) => row.event === "run-now-same-fail") ||
    scored.find((row) => row.event === "no-failed-run-state") ||
    scored.find((row) => row.event === "lastRunAt-false-signal") ||
    flashed[flashed.length - 1];
  let verdict = "primed";
  if (flashed.length) verdict = "flashed";
  else if (flashpanned.length && !primed.length) verdict = "flashpanned";
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
    flashedCount: flashed.length,
    flashpannedCount: flashpanned.length,
    primedCount: primed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit primed" : "score flashed",
    note: headline
      ? "lastRunAt stamps without a session birth; stamp-clusters across differently-scheduled tasks; Run now fails the same way; no failed-run state"
      : "published flash-pan walk scored against primed vs flashed",
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
    seeded !== "primed" &&
    seeded !== "flashed" &&
    seeded !== "flashpanned" &&
    ticket.lastRunAtStamped == null &&
    ticket.sessionBorn == null &&
    ticket.failedRunSurfaced == null &&
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
    clusterMs: scored.clusterMs ?? CLUSTER_MS,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.lastRunAtHonest ? "stamp=honest" : "stamp=fresh",
    result.sessionBorn ? "birth=yes" : "birth=zero",
    result.failedRunSurfaced || result.notification ? "fail=loud" : "fail=silent",
    result.stampCluster ? "cluster=<1s" : "cluster=none",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      reporter: REPORTER,
      filedAt: FILED_AT,
      product: PRODUCT,
      sessionPath: SESSION_PATH,
      birthStat: BIRTH_STAT,
      clusterMs: CLUSTER_MS,
      clusterSpanS: CLUSTER_SPAN_S,
      dailyBirthsBaseline: [DAILY_BIRTHS_BASELINE_MIN, DAILY_BIRTHS_BASELINE_MAX],
      zeroBirthDates: [...ZERO_BIRTH_DATES],
      restartWindowBirths: RESTART_WINDOW_BIRTHS,
      restartWindowMinutes: RESTART_WINDOW_MINUTES,
      tasksStopped: TASKS_STOPPED,
      firstObserved: FIRST_OBSERVED,
      stillOccurring: STILL_OCCURRING,
      stampCluster: STAMP_CLUSTER,
      cousins: COUSINS.map((row) => row.issue),
      asks: [
        "do not stamp lastRunAt unless a session was actually created",
        "surface a failed launch: a failed-run state, or a notification",
        "confirm or deny whether an open session can block a scheduled launch",
      ],
      hypothesis:
        "session launcher fails closed after uptime while the scheduler still stamps lastRunAt as success",
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
