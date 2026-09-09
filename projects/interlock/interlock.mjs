#!/usr/bin/env node
/**
 * Interlock — plant-floor safety INTERLOCK booth / machine-guard lockout.
 *
 * Educational diagnostic model for a published Dispatch cwd lock:
 * Desktop 1.49585.0 (Linux) refuses `start_code_task` with
 * "A Claude Code session (local_…) is already active in this
 * directory" after the UI warms a finished session. Stale records
 * with no live query no longer block; a warmed idle `query` does.
 *
 *   node interlock.mjs data/interlocked.json
 *   echo '{"seed":"interlocked"}' | node interlock.mjs
 *
 * Idle word is passable (HOLD: folder stays open for Dispatch;
 * busy-check would look at a turn in flight, not an attached CLI).
 * Path word is interlocked (UI-warmed idle session holds the cwd
 * against Dispatch via exclusiveCwd).
 * Seeded recover word is detached (CLI/query released; busy-check
 * only, or exclusiveCwd no longer hardcoded).
 *
 * Encoded from anthropics/claude-code#92976 issue body only.
 * Hypothesis (NON-BINDING): UI warm attaches CLI so `query` is
 * truthy; findActiveSessionByCwd treats warmed-idle as active;
 * exclusiveCwd on Dispatch refuses start_code_task. Invite verify
 * against #92976 text only.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop automation.
 * No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "passable",
  "interlocked",
  "detached",
  "stale-records-fixed",
  "ui-warm-relock",
  "query-present-idle",
  "warm-lifecycle-when-hidden",
  "exclusivecwd-hardcoded",
  "concurrent-local-ok",
  "dispatch-only-block",
  "timeline",
  "cifs-non-git",
  "no-archive-tool",
  "error-already-active",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "passable";
export const PATH_WORD = "interlocked";
export const SEEDED_WORD = "detached";
export const HOLD = Object.freeze(["passable"]);
export const RECOVER = Object.freeze(["detached"]);
export const ALARM = Object.freeze(VERDICTS.filter((name) => name !== "passable"));
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "admitted",
  "shibbolethed",
  "countersigned",
  "deeded",
  "homesteaded",
  "staked",
  "parked",
  "epitaphed",
  "inscribed",
  "collated",
  "stereotyped",
  "emended",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "banked",
  "intact",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
  "fouled",
  "voided",
  "rewritten",
]);
export const FORBIDDEN_SEED = Object.freeze([...FORBIDDEN_IDLE]);

export const FEATURED_ISSUE = 92976;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92976";
export const TITLE =
  "Dispatch start_code_task still blocked in 1.49585.0: opening a finished session in the UI re-locks the folder (follow-up to #91745, #92452, #92462)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "regression",
  "area:desktop",
]);
export const DESKTOP_VERSION = "1.49585.0";
export const PREVIOUS_DESKTOP = "1.40609.1";
export const VERSION = "2.1.260";
export const ELECTRON = "44";
export const OS_NAME = "Ubuntu 26.04 Hyper-V";
export const REPORTER = "terrapin-lee";
export const FILED_AT = "2026-09-09T02:34:59Z";
export const BLOCKER_SESSION = "local_4c2ba47d-...";
export const CHILD_SESSION = "local_09c8d558-...";
export const ERROR_TEXT =
  "Failed to start code session: A Claude Code session (local_4c2ba47d-...) is already active in this directory.";
export const ERROR_PHRASE = "already active";
export const WARM_LIFECYCLE_ARM = "when-hidden";
export const IDLE_TIMER_HIDDEN_S = Object.freeze([900, 1800]);
export const LAST_TURN_MINUTES = 47;
export const DISPATCH_PARENT_ORIGIN = "local";
export const EXCLUSIVE_CWD = true;
export const CONCURRENT_SESSIONS = 4;
export const DISPATCH_TOOLS = Object.freeze([
  "session_info",
  "list_sessions",
  "read_transcript",
  "start_task",
  "start_code_task",
  "send_message",
  "set_agent_name",
  "list_code_workspaces",
  "list_projects",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91745,
    title: "stale-record cwd lock cousin",
    state: "CLOSED",
    citeOnly: true,
    why: "stale-record half cited from #92976; findActiveSessionByCwd now skips records with no live query — cite only; do not build",
  },
  {
    issue: 92452,
    title: "cwd exclusivity cousin",
    state: "OPEN",
    citeOnly: true,
    why: "cwd / Dispatch exclusivity cousin — cite only; do not build",
  },
  {
    issue: 92462,
    title: "stale-record cwd lock cousin",
    state: "CLOSED",
    citeOnly: true,
    why: "stale-record half genuinely fixed in 1.49585.0 — cite only; this ship is the UI-warm re-lock after that fix",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "quill",
  "colophon",
  "sallyport",
]);

/**
 * Published plant-floor walk from #92976 only. Facts from the issue
 * body — clocks are the published local-time timeline.
 */
export const GATE_WALK = Object.freeze([
  {
    t: "10:28",
    event: "stop-hook",
    lastTurnCompleted: true,
    lastTurnMinutesAgo: 0,
    queryPresent: true,
    warmed: false,
    turnInFlight: false,
    sessionStopped: false,
    exclusiveCwd: true,
    dispatchBlocked: false,
    startCodeTaskSucceeded: null,
  },
  {
    t: "10:32",
    event: "upgrade",
    desktopFrom: PREVIOUS_DESKTOP,
    desktopTo: DESKTOP_VERSION,
    queryPresent: true,
    warmed: false,
    turnInFlight: false,
    exclusiveCwd: true,
    dispatchBlocked: false,
  },
  {
    t: "10:35",
    event: "stop-session",
    queryPresent: false,
    warmed: false,
    turnInFlight: false,
    sessionStopped: true,
    exclusiveCwd: true,
    dispatchBlocked: false,
    staleRecordsSkipped: true,
    folderPassable: true,
    startCodeTaskSucceeded: null,
  },
  {
    t: "10:43",
    event: "start-success",
    queryPresent: false,
    warmed: false,
    turnInFlight: false,
    sessionStopped: true,
    exclusiveCwd: true,
    dispatchBlocked: false,
    startCodeTaskSucceeded: true,
    childSession: CHILD_SESSION,
    folderPassable: true,
    staleRecordsSkipped: true,
  },
  {
    t: "10:55",
    event: "ui-warm",
    queryPresent: true,
    warmed: true,
    turnInFlight: false,
    sessionStopped: true,
    lastTurnMinutesAgo: 27,
    exclusiveCwd: true,
    dispatchBlocked: false,
    startCodeTaskSucceeded: true,
    armWhenHidden: true,
    hidden: false,
    idleTimersArmed: false,
    sessionId: BLOCKER_SESSION,
  },
  {
    t: "11:15",
    event: "start-fail",
    queryPresent: true,
    warmed: true,
    turnInFlight: false,
    sessionStopped: true,
    lastTurnMinutesAgo: LAST_TURN_MINUTES,
    exclusiveCwd: true,
    dispatchBlocked: true,
    errorAlreadyActive: true,
    error: ERROR_TEXT,
    startCodeTaskSucceeded: false,
    armWhenHidden: true,
    hidden: false,
    idleTimersArmed: false,
    concurrentLocalOk: true,
    sessionId: BLOCKER_SESSION,
    cifsNonGit: true,
    archiveToolPresent: false,
  },
]);

export function errorBlock(text = ERROR_TEXT) {
  return text;
}

export function alreadyActiveLine(sessionId = BLOCKER_SESSION) {
  return `Failed to start code session: A Claude Code session (${sessionId}) is already active in this directory.`;
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    queryPresent: false,
    warmed: false,
    turnInFlight: false,
    lastTurnMinutesAgo: 0,
    exclusiveCwd: true,
    dispatchBlocked: false,
    errorAlreadyActive: false,
    staleRecordsSkipped: true,
    concurrentLocalOk: true,
    armWhenHidden: true,
    hidden: false,
    idleTimersArmed: false,
    cifsNonGit: true,
    archiveToolPresent: false,
    errorMentionsCloseOrArchive: false,
    sessionStopped: true,
    startCodeTaskSucceeded: true,
    detached: false,
    busyCheckOnly: false,
    folderPassable: true,
  };
}

export function seedPassable() {
  return { ...emptyTicket() };
}

export function seedInterlocked() {
  return {
    seed: PATH_WORD,
    queryPresent: true,
    warmed: true,
    turnInFlight: false,
    lastTurnMinutesAgo: LAST_TURN_MINUTES,
    exclusiveCwd: true,
    dispatchBlocked: true,
    errorAlreadyActive: true,
    error: ERROR_TEXT,
    staleRecordsSkipped: true,
    concurrentLocalOk: true,
    armWhenHidden: true,
    hidden: false,
    idleTimersArmed: false,
    cifsNonGit: true,
    archiveToolPresent: false,
    errorMentionsCloseOrArchive: false,
    sessionStopped: true,
    startCodeTaskSucceeded: false,
    detached: false,
    busyCheckOnly: false,
    folderPassable: false,
    sessionId: BLOCKER_SESSION,
    desktopVersion: DESKTOP_VERSION,
    version: VERSION,
  };
}

export function seedDetached() {
  return {
    seed: SEEDED_WORD,
    queryPresent: false,
    warmed: false,
    previouslyWarmed: true,
    turnInFlight: false,
    lastTurnMinutesAgo: LAST_TURN_MINUTES,
    exclusiveCwd: false,
    dispatchBlocked: false,
    errorAlreadyActive: false,
    staleRecordsSkipped: true,
    concurrentLocalOk: true,
    armWhenHidden: true,
    hidden: true,
    idleTimersArmed: true,
    cifsNonGit: true,
    archiveToolPresent: false,
    errorMentionsCloseOrArchive: false,
    sessionStopped: true,
    startCodeTaskSucceeded: true,
    detached: true,
    busyCheckOnly: true,
    folderPassable: true,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      queryPresent: false,
      warmed: false,
      previouslyWarmed: false,
      turnInFlight: false,
      lastTurnMinutesAgo: 0,
      exclusiveCwd: false,
      dispatchBlocked: false,
      errorAlreadyActive: false,
      error: null,
      staleRecordsSkipped: false,
      concurrentLocalOk: false,
      armWhenHidden: false,
      hidden: false,
      idleTimersArmed: false,
      cifsNonGit: false,
      archiveToolPresent: false,
      errorMentionsCloseOrArchive: false,
      sessionStopped: false,
      startCodeTaskSucceeded: null,
      detached: false,
      busyCheckOnly: false,
      folderPassable: false,
      sessionId: null,
    };
  }
  const error = raw.error || raw.errorText || null;
  const errorAlreadyActive =
    raw.errorAlreadyActive === true ||
    (typeof error === "string" && error.includes(ERROR_PHRASE));
  return {
    queryPresent:
      raw.queryPresent === true || raw.query === true || raw.hasQuery === true,
    warmed: raw.warmed === true || raw.uiWarm === true,
    previouslyWarmed: raw.previouslyWarmed === true,
    turnInFlight: raw.turnInFlight === true || raw.busy === true,
    lastTurnMinutesAgo:
      raw.lastTurnMinutesAgo != null
        ? Number(raw.lastTurnMinutesAgo)
        : raw.idleMinutes != null
          ? Number(raw.idleMinutes)
          : 0,
    exclusiveCwd: raw.exclusiveCwd === true || raw.exclusivecwd === true,
    dispatchBlocked:
      raw.dispatchBlocked === true || raw.startCodeTaskSucceeded === false,
    errorAlreadyActive,
    error,
    staleRecordsSkipped: raw.staleRecordsSkipped === true,
    concurrentLocalOk: raw.concurrentLocalOk === true,
    armWhenHidden:
      raw.armWhenHidden === true ||
      raw.warmLifecycleArm === WARM_LIFECYCLE_ARM,
    hidden: raw.hidden === true,
    idleTimersArmed: raw.idleTimersArmed === true,
    cifsNonGit: raw.cifsNonGit === true,
    archiveToolPresent: raw.archiveToolPresent === true,
    errorMentionsCloseOrArchive: raw.errorMentionsCloseOrArchive === true,
    sessionStopped: raw.sessionStopped === true,
    startCodeTaskSucceeded:
      raw.startCodeTaskSucceeded == null
        ? null
        : raw.startCodeTaskSucceeded === true,
    detached: raw.detached === true,
    busyCheckOnly: raw.busyCheckOnly === true,
    folderPassable: raw.folderPassable === true,
    sessionId: raw.sessionId || raw.blockerSession || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    version: raw.version || null,
    desktopVersion: raw.desktopVersion || raw.desktop || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.queryPresent != null ||
        ticket.query != null ||
        ticket.hasQuery != null ||
        ticket.warmed != null ||
        ticket.uiWarm != null ||
        ticket.turnInFlight != null ||
        ticket.busy != null ||
        ticket.exclusiveCwd != null ||
        ticket.exclusivecwd != null ||
        ticket.dispatchBlocked != null ||
        ticket.errorAlreadyActive != null ||
        ticket.sessionStopped != null ||
        ticket.startCodeTaskSucceeded != null ||
        ticket.detached != null ||
        ticket.busyCheckOnly != null ||
        ticket.folderPassable != null ||
        ticket.staleRecordsSkipped != null ||
        ticket.event),
  );
}

function isInterlocked(row) {
  if (row.detached || row.busyCheckOnly) return false;
  return (
    row.warmed &&
    row.queryPresent &&
    !row.turnInFlight &&
    row.exclusiveCwd
  );
}

function isDetached(row) {
  if (row.turnInFlight) return false;
  if (row.detached && !row.dispatchBlocked) return true;
  if (row.busyCheckOnly && !row.exclusiveCwd && !row.dispatchBlocked) return true;
  if (
    row.previouslyWarmed &&
    !row.queryPresent &&
    !row.warmed &&
    !row.dispatchBlocked
  ) {
    return true;
  }
  return false;
}

function isPassable(row) {
  if (isInterlocked(row)) return false;
  if (row.folderPassable && !row.dispatchBlocked) return true;
  if (!row.queryPresent && !row.dispatchBlocked && !row.warmed) return true;
  if (row.sessionStopped && !row.queryPresent && !row.dispatchBlocked) return true;
  if (row.staleRecordsSkipped && !row.warmed && !row.dispatchBlocked) return true;
  return false;
}

/**
 * Score one plant-floor crossing against the Dispatch interlock gate.
 * passable: folder open for Dispatch; no live query, or stale records
 *   skipped; busy-check would see no turn in flight.
 * interlocked: UI-warmed idle session holds the cwd; exclusiveCwd
 *   refuses start_code_task with already-active.
 * detached: CLI/query released; busy-check only, or exclusiveCwd off.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isInterlocked(row)) {
    verdict = "interlocked";
  } else if (isDetached(row)) {
    verdict = "detached";
  } else if (isPassable(row)) {
    verdict = "passable";
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
    passable: verdict === "passable",
    interlocked: verdict === "interlocked",
    detached: verdict === "detached" || verdict === SEEDED_WORD,
    queryPresent: row.queryPresent,
    warmed: row.warmed,
    previouslyWarmed: row.previouslyWarmed,
    turnInFlight: row.turnInFlight,
    lastTurnMinutesAgo: row.lastTurnMinutesAgo,
    exclusiveCwd: row.exclusiveCwd,
    dispatchBlocked: row.dispatchBlocked,
    errorAlreadyActive: row.errorAlreadyActive,
    error: row.error,
    staleRecordsSkipped: row.staleRecordsSkipped,
    concurrentLocalOk: row.concurrentLocalOk,
    armWhenHidden: row.armWhenHidden,
    hidden: row.hidden,
    idleTimersArmed: row.idleTimersArmed,
    cifsNonGit: row.cifsNonGit,
    archiveToolPresent: row.archiveToolPresent,
    errorMentionsCloseOrArchive: row.errorMentionsCloseOrArchive,
    sessionStopped: row.sessionStopped,
    startCodeTaskSucceeded: row.startCodeTaskSucceeded,
    busyCheckOnly: row.busyCheckOnly,
    folderPassable: row.folderPassable,
    sessionId: row.sessionId,
    event: row.event,
    t: row.t,
    version: row.version,
    desktopVersion: row.desktopVersion,
    phrase: hold ? "admit passable" : "score interlocked",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : GATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const interlocked = scored.filter((row) => row.verdict === "interlocked");
  const detached = scored.filter((row) => row.verdict === "detached");
  const passable = scored.filter((row) => row.verdict === "passable");
  const headline =
    scored.find((row) => row.event === "start-fail") ||
    interlocked[interlocked.length - 1];
  let verdict = "passable";
  if (interlocked.length) verdict = "interlocked";
  else if (detached.length && !passable.length) verdict = "detached";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "passable",
    alarm: verdict !== "passable",
    interlockedCount: interlocked.length,
    detachedCount: detached.length,
    passableCount: passable.length,
    headline,
    rows: scored,
    phrase: verdict === "passable" ? "admit passable" : "score interlocked",
    note: headline
      ? "UI-warmed idle session interlocks the cwd; exclusiveCwd refuses start_code_task after 10:55 warm"
      : "published Dispatch interlock walk scored against passable vs interlocked",
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
    seeded !== "passable" &&
    seeded !== "interlocked" &&
    seeded !== "detached" &&
    ticket.queryPresent == null &&
    ticket.warmed == null &&
    ticket.exclusiveCwd == null &&
    ticket.dispatchBlocked == null &&
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
    errorBlock: errorBlock(),
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.queryPresent ? "query=on" : "query=off",
    result.warmed ? "warm=on" : "warm=off",
    result.turnInFlight ? "turn=flight" : "turn=idle",
    result.exclusiveCwd ? "exclusive=on" : "exclusive=off",
    result.dispatchBlocked ? "dispatch=block" : "dispatch=open",
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
      desktopVersion: DESKTOP_VERSION,
      previousDesktop: PREVIOUS_DESKTOP,
      version: VERSION,
      electron: ELECTRON,
      os: OS_NAME,
      reporter: REPORTER,
      filedAt: FILED_AT,
      blockerSession: BLOCKER_SESSION,
      childSession: CHILD_SESSION,
      errorText: ERROR_TEXT,
      warmLifecycleArm: WARM_LIFECYCLE_ARM,
      idleTimersHiddenS: [...IDLE_TIMER_HIDDEN_S],
      lastTurnMinutes: LAST_TURN_MINUTES,
      dispatchParentOrigin: DISPATCH_PARENT_ORIGIN,
      exclusiveCwd: EXCLUSIVE_CWD,
      concurrentSessions: CONCURRENT_SESSIONS,
      dispatchTools: [...DISPATCH_TOOLS],
      cifsNonGit: true,
      archiveToolPresent: false,
      workaround:
        "busy-check (turn in flight) not attached-CLI; or stop hardcoding exclusiveCwd on Dispatch",
      hypothesis:
        "UI warm attaches CLI so query is truthy; findActiveSessionByCwd treats warmed-idle as active; exclusiveCwd on Dispatch refuses start_code_task",
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
