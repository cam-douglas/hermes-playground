#!/usr/bin/env node
/**
 * Parergon — manuscript marginalia / aside-panel booth.
 *
 * Educational diagnostic model for a published Claude Desktop defect:
 * an open `/btw` side chat should stay PRESERVED while open (idle gate
 * counts it as active work, or stealth relaunch restores the aside).
 * Instead the aside is DISCARDED — stealth update treats the open side
 * chat as idle, quits, and restores navigation only; in-memory side
 * chat is gone.
 *
 *   node parergon.mjs data/discarded.json
 *   echo '{"seed":"discarded"}' | node parergon.mjs
 *
 * Idle word is preserved (HOLD: idle gate counts an open side chat as
 * active work, or stealth relaunch restores the aside alongside
 * navigation).
 * Seeded word is discarded (#93122: stealth idle timeout over an open
 * `/btw` panel; Saving 0 session + 0 pane popout(s); Restoring
 * navigation only; side chat and its answer gone).
 * Path word is parergon (a stealth update that treats an open /btw
 * side chat as idle is not preserving the aside — it is a discarded
 * parergon).
 *
 * Encoded from anthropics/claude-code#93122 issue body only.
 * Hypothesis (NON-BINDING): the idle gate that exists to prevent a
 * stealth relaunch over live work may omit side chats from "active",
 * and because side-chat state is in-memory only the seamless relaunch
 * can restore navigation without the aside. Verify against #93122
 * text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "preserved",
  "discarded",
  "parergon",
  "hold",
  "stealth-idle",
  "side-chat-in-memory",
  "zero-popouts",
  "restore-navigation-only",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "preserved";
export const PATH_WORD = "parergon";
export const SEEDED_WORD = "discarded";
export const HOLD = Object.freeze(["preserved", "hold"]);
export const RECOVER = Object.freeze(["preserved", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "preserved" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "fresh",
  "stamped",
  "cleared",
  "mounded",
  "distinct",
  "conflated",
  "held",
  "steered",
  "raised",
  "fallen",
  "sterling",
  "primed",
  "flashed",
  "lodged",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
  "freewheeling",
  "doubled",
  "stereotype",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "discarded"),
);

export const FEATURED_ISSUE = 93122;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93122";
export const TITLE =
  "[BUG] Stealth update restarts over an open `/btw` side chat and discards it";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const DESKTOP_FROM = "1.46388.1";
export const DESKTOP_TO = "1.49585.0";
export const BUNDLED_CODE = "2.1.260";
export const ARCH = "macOS arm64";
export const MACOS = "26.6.2";
export const IDLE_MINUTES = 10;
export const ELAPSED_MINUTES = 41;
export const ENFORCEMENT_HOURS = 72;
export const NAV_ENTRIES = 3;
export const NAV_ACTIVE = 2;
export const NAV_DROPPED = 0;
export const POPOUT_SESSIONS = 0;
export const POPOUT_PANES = 0;
export const COMMAND = "/btw";
export const LOG_SAVE =
  "[popout-restore] Saving 0 session + 0 pane popout(s) for next launch";
export const LOG_TRIGGER =
  "[stealth-update] Triggering stealth update after idle timeout";
export const LOG_QUIT = "Successfully run onQuitCleanup: local-session-stop-all";
export const LOG_RESTORE =
  "[stealth-relaunch] Restoring navigation (3 entries, active=2, dropped=0)";
export const PHRASE =
  "a stealth update that treats an open /btw side chat as idle is not preserving the aside — it is a discarded parergon. Score discarded or admit preserved.";

export const FINGERPRINT_LINES = Object.freeze([
  "Saving 0 session + 0 pane popout(s) for next launch",
  "Triggering stealth update after idle timeout",
  "Successfully run onQuitCleanup: local-session-stop-all",
  "Restoring navigation (3 entries, active=2, dropped=0)",
  "side chat state is in-memory only",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92207,
    title:
      "Stealth update relaunches desktop on idle, severing Remote Control sessions",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    labeledDuplicate: true,
    why: "stealth idle relaunch severs Remote Control sessions, not an open /btw side chat discarded because the idle gate ignores the aside; cite only; do not clone",
  },
  {
    issue: 92010,
    title:
      "Remote Control session paused by idle timeout ~15 min after stealth-update relaunch",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "RC hold not restored after stealth-update relaunch, not /btw side-chat discard; cite only; do not clone",
  },
  {
    issue: 91915,
    title:
      "Remote control never re-established after idle-triggered auto-update relaunch",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "headless Remote Control unreachable after idle-triggered auto-update relaunch, not in-memory /btw aside wipe; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "wildcat",
]);

/**
 * Published parergon walk from #93122 only. Facts from the issue body.
 * A preserved aside stays while the side chat is open (counted, or restored).
 * A discarded aside is wiped by stealth idle; navigation comes back alone.
 */
export const PARERGON_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-preserved",
    sideChatOpen: true,
    sideChatInMemory: true,
    idleGateCountsSideChat: true,
    stealthTriggered: false,
    popoutsSaved: 0,
    navigationRestored: false,
    sessionStateRestored: false,
    sideChatRestored: true,
    asideKept: true,
    cue: "preserved",
    note: "idle HOLD: idle gate counts an open /btw side chat as active work; stealth deferred; aside stays",
  },
  {
    t: "mount",
    event: "side-chat-in-memory",
    sideChatOpen: true,
    sideChatInMemory: true,
    command: COMMAND,
    cue: "discarded",
    note: "/btw side chat panel mounted and remained open with content; state is in-memory only",
  },
  {
    t: "unfocus",
    event: "stealth-idle",
    sideChatOpen: true,
    idleGateCountsSideChat: false,
    windowUnfocused: true,
    notFullscreen: true,
    idleMinutes: IDLE_MINUTES,
    idlePath: true,
    enforcementFar: true,
    elapsedMinutes: ELAPSED_MINUTES,
    cue: "discarded",
    note: "focus moved to another app (terminal); Desktop unfocused, not fullscreen; ~10 minutes idle; 72h enforcement nowhere near expiry — idle path, not deadline",
  },
  {
    t: "save",
    event: "zero-popouts",
    popoutsSaved: 0,
    popoutSessions: POPOUT_SESSIONS,
    popoutPanes: POPOUT_PANES,
    logSave: LOG_SAVE,
    cue: "discarded",
    note: "T-0m01s [popout-restore] Saving 0 session + 0 pane popout(s) for next launch — correctly reports nothing persistable for the side chat",
  },
  {
    t: "trigger",
    event: "stealth-update",
    stealthTriggered: true,
    idlePath: true,
    logTrigger: LOG_TRIGGER,
    cue: "discarded",
    note: "T+0m00s [stealth-update] Triggering stealth update after idle timeout",
  },
  {
    t: "quit",
    event: "onQuitCleanup",
    stealthTriggered: true,
    logQuit: LOG_QUIT,
    cue: "discarded",
    note: "T+0m01s Successfully run onQuitCleanup: local-session-stop-all",
  },
  {
    t: "restore",
    event: "restore-navigation-only",
    navigationRestored: true,
    sessionStateRestored: false,
    sideChatRestored: false,
    navEntries: NAV_ENTRIES,
    navActive: NAV_ACTIVE,
    navDropped: NAV_DROPPED,
    logRestore: LOG_RESTORE,
    cue: "discarded",
    note: "T+0m19s [stealth-relaunch] Restoring navigation (3 entries, active=2, dropped=0) restores which views were open, not live session state",
  },
  {
    t: "wipe",
    event: "discarded",
    sideChatOpen: false,
    sideChatInMemory: true,
    idleGateCountsSideChat: false,
    stealthTriggered: true,
    popoutsSaved: 0,
    navigationRestored: true,
    sessionStateRestored: false,
    sideChatRestored: false,
    asideKept: false,
    noWarning: true,
    noRecovery: true,
    cue: "discarded",
    note: "side chat and its answer were gone; destroyed with no warning and no recovery path",
  },
  {
    t: "path",
    event: "parergon",
    parergon: true,
    cue: "discarded",
    note: "a stealth update that treats an open /btw side chat as idle is not preserving the aside — it is a discarded parergon",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    sideChatOpen: true,
    sideChatInMemory: true,
    idleGateCountsSideChat: true,
    stealthTriggered: false,
    popoutsSaved: 0,
    navigationRestored: false,
    sessionStateRestored: false,
    sideChatRestored: true,
    asideKept: true,
    cue: "preserved",
  };
}

export function seedPreserved() {
  return { ...emptyTicket() };
}

export function seedDiscarded() {
  return {
    seed: SEEDED_WORD,
    sideChatOpen: true,
    sideChatInMemory: true,
    idleGateCountsSideChat: false,
    stealthTriggered: true,
    popoutsSaved: 0,
    popoutSessions: POPOUT_SESSIONS,
    popoutPanes: POPOUT_PANES,
    navigationRestored: true,
    sessionStateRestored: false,
    sideChatRestored: false,
    asideKept: false,
    windowUnfocused: true,
    notFullscreen: true,
    idleMinutes: IDLE_MINUTES,
    idlePath: true,
    enforcementFar: true,
    elapsedMinutes: ELAPSED_MINUTES,
    noWarning: true,
    noRecovery: true,
    desktopFrom: DESKTOP_FROM,
    desktopTo: DESKTOP_TO,
    bundledCode: BUNDLED_CODE,
    arch: ARCH,
    macos: MACOS,
    command: COMMAND,
    cue: "discarded",
    issue: FEATURED_ISSUE,
  };
}

export function seedParergon() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    parergon: true,
    cue: "discarded",
  };
}

export function seedStealthIdle() {
  return {
    seed: "stealth-idle",
    idleGateCountsSideChat: false,
    stealthTriggered: true,
    idlePath: true,
    idleMinutes: IDLE_MINUTES,
    windowUnfocused: true,
    notFullscreen: true,
    cue: "discarded",
  };
}

export function seedSideChatInMemory() {
  return {
    seed: "side-chat-in-memory",
    sideChatOpen: true,
    sideChatInMemory: true,
    command: COMMAND,
    cue: "discarded",
  };
}

export function seedZeroPopouts() {
  return {
    seed: "zero-popouts",
    popoutsSaved: 0,
    popoutSessions: POPOUT_SESSIONS,
    popoutPanes: POPOUT_PANES,
    logSave: LOG_SAVE,
    cue: "discarded",
  };
}

export function seedRestoreNavigationOnly() {
  return {
    seed: "restore-navigation-only",
    navigationRestored: true,
    sessionStateRestored: false,
    sideChatRestored: false,
    navEntries: NAV_ENTRIES,
    navActive: NAV_ACTIVE,
    navDropped: NAV_DROPPED,
    logRestore: LOG_RESTORE,
    cue: "discarded",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sideChatOpen: false,
      sideChatInMemory: false,
      idleGateCountsSideChat: false,
      stealthTriggered: false,
      popoutsSaved: null,
      navigationRestored: false,
      sessionStateRestored: false,
      sideChatRestored: false,
      asideKept: false,
      windowUnfocused: false,
      notFullscreen: false,
      idlePath: false,
      enforcementFar: false,
      noWarning: false,
      noRecovery: false,
      parergon: false,
      idleMinutes: null,
      elapsedMinutes: null,
      popoutSessions: null,
      popoutPanes: null,
      navEntries: null,
      navActive: null,
      navDropped: null,
      desktopFrom: null,
      desktopTo: null,
      bundledCode: null,
      arch: null,
      macos: null,
      command: null,
      logSave: null,
      logTrigger: null,
      logQuit: null,
      logRestore: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sideChatOpen: raw.sideChatOpen === true,
    sideChatInMemory: raw.sideChatInMemory === true,
    idleGateCountsSideChat: raw.idleGateCountsSideChat === true,
    stealthTriggered: raw.stealthTriggered === true,
    popoutsSaved:
      raw.popoutsSaved == null && raw.popoutSessions == null
        ? null
        : Number(raw.popoutsSaved ?? raw.popoutSessions ?? 0),
    navigationRestored: raw.navigationRestored === true,
    sessionStateRestored: raw.sessionStateRestored === true,
    sideChatRestored: raw.sideChatRestored === true,
    asideKept: raw.asideKept === true,
    windowUnfocused: raw.windowUnfocused === true,
    notFullscreen: raw.notFullscreen === true,
    idlePath: raw.idlePath === true,
    enforcementFar: raw.enforcementFar === true,
    noWarning: raw.noWarning === true,
    noRecovery: raw.noRecovery === true,
    parergon: raw.parergon === true,
    idleMinutes: raw.idleMinutes ?? null,
    elapsedMinutes: raw.elapsedMinutes ?? null,
    popoutSessions: raw.popoutSessions ?? null,
    popoutPanes: raw.popoutPanes ?? null,
    navEntries: raw.navEntries ?? null,
    navActive: raw.navActive ?? null,
    navDropped: raw.navDropped ?? null,
    desktopFrom: raw.desktopFrom || null,
    desktopTo: raw.desktopTo || null,
    bundledCode: raw.bundledCode || null,
    arch: raw.arch || null,
    macos: raw.macos || null,
    command: raw.command || raw.slash || null,
    logSave: raw.logSave || null,
    logTrigger: raw.logTrigger || null,
    logQuit: raw.logQuit || null,
    logRestore: raw.logRestore || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.sideChatOpen != null ||
        ticket.sideChatInMemory != null ||
        ticket.idleGateCountsSideChat != null ||
        ticket.stealthTriggered != null ||
        ticket.popoutsSaved != null ||
        ticket.navigationRestored != null ||
        ticket.sessionStateRestored != null ||
        ticket.sideChatRestored != null ||
        ticket.asideKept != null ||
        ticket.parergon != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.idleMinutes != null ||
        ticket.navEntries != null),
  );
}

function isPreserved(row) {
  if (row.parergon) return false;
  if (row.cue === "discarded") return false;
  if (row.stealthTriggered && row.sideChatRestored !== true && row.asideKept !== true) {
    return false;
  }
  if (row.asideKept === true && row.cue !== "discarded") return true;
  if (
    row.idleGateCountsSideChat === true &&
    row.stealthTriggered !== true &&
    row.cue !== "discarded"
  ) {
    return true;
  }
  if (row.sideChatRestored === true && row.cue !== "discarded") return true;
  if (row.cue === "preserved" && row.asideKept !== false) return true;
  return false;
}

function isDiscarded(row) {
  if (row.parergon && row.cue !== "preserved") return false;
  if (row.cue === "discarded") return true;
  if (row.stealthTriggered && row.sideChatRestored === false) return true;
  if (row.navigationRestored && row.sessionStateRestored === false && row.sideChatRestored === false) {
    return true;
  }
  if (
    row.idleGateCountsSideChat === false &&
    row.sideChatOpen === true &&
    row.stealthTriggered === true
  ) {
    return true;
  }
  if (row.popoutsSaved === 0 && row.stealthTriggered && !row.asideKept) {
    return true;
  }
  return false;
}

function isParergonPath(row) {
  return row.parergon === true && !isPreserved(row);
}

/**
 * Score one stealth-/btw-aside pass against the parergon booth.
 * preserved: idle gate counts the side chat, or relaunch restores the aside.
 * discarded: stealth idle over an open /btw panel; navigation only; aside gone.
 * parergon: named path — treating the open aside as idle is not preserved.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isParergonPath(row)) {
    verdict = "parergon";
  } else if (isDiscarded(row)) {
    verdict = "discarded";
  } else if (isPreserved(row)) {
    verdict = "preserved";
  } else if (
    row.stealthTriggered ||
    row.idlePath ||
    (row.navigationRestored && !row.sideChatRestored) ||
    (row.popoutsSaved === 0 && row.sideChatInMemory) ||
    (row.idleGateCountsSideChat === false && row.sideChatOpen)
  ) {
    verdict = "discarded";
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
    preserved: verdict === "preserved",
    discarded: verdict === "discarded" || verdict === SEEDED_WORD,
    parergon: verdict === "parergon" || verdict === PATH_WORD,
    sideChatOpen: row.sideChatOpen,
    sideChatInMemory: row.sideChatInMemory,
    idleGateCountsSideChat: row.idleGateCountsSideChat,
    stealthTriggered: row.stealthTriggered,
    popoutsSaved: row.popoutsSaved,
    navigationRestored: row.navigationRestored,
    sessionStateRestored: row.sessionStateRestored,
    sideChatRestored: row.sideChatRestored,
    asideKept: row.asideKept,
    windowUnfocused: row.windowUnfocused,
    notFullscreen: row.notFullscreen,
    idlePath: row.idlePath,
    enforcementFar: row.enforcementFar,
    noWarning: row.noWarning,
    noRecovery: row.noRecovery,
    idleMinutes: row.idleMinutes,
    elapsedMinutes: row.elapsedMinutes,
    popoutSessions: row.popoutSessions,
    popoutPanes: row.popoutPanes,
    navEntries: row.navEntries,
    navActive: row.navActive,
    navDropped: row.navDropped,
    desktopFrom: row.desktopFrom,
    desktopTo: row.desktopTo,
    bundledCode: row.bundledCode,
    arch: row.arch,
    macos: row.macos,
    command: row.command,
    logSave: row.logSave,
    logTrigger: row.logTrigger,
    logQuit: row.logQuit,
    logRestore: row.logRestore,
    cue: hold ? "preserved" : "discarded",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit preserved" : "score discarded",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : PARERGON_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const discarded = scored.filter((row) => row.verdict === "discarded");
  const parergon = scored.filter((row) => row.verdict === "parergon");
  const preserved = scored.filter((row) => row.verdict === "preserved");
  const headline =
    scored.find((row) => row.event === "discarded") ||
    scored.find((row) => row.event === "stealth-idle") ||
    scored.find((row) => row.event === "parergon") ||
    discarded[discarded.length - 1];
  let verdict = "preserved";
  if (discarded.length) verdict = "discarded";
  else if (parergon.length && !preserved.length) verdict = "parergon";
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
    discardedCount: discarded.length,
    parergonCount: parergon.length,
    preservedCount: preserved.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit preserved" : "score discarded",
    note: headline
      ? "stealth update treats an open /btw side chat as idle; Saving 0 popouts; Restoring navigation only; aside gone"
      : "published parergon walk scored against preserved vs discarded",
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
    seeded !== "preserved" &&
    seeded !== "discarded" &&
    seeded !== "parergon" &&
    ticket.sideChatOpen == null &&
    ticket.idleGateCountsSideChat == null &&
    ticket.stealthTriggered == null &&
    ticket.navigationRestored == null &&
    ticket.sideChatRestored == null &&
    ticket.popoutsSaved == null &&
    ticket.parergon == null &&
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
    sideChatOpen: scored.sideChatOpen ?? false,
    idleGateCountsSideChat: scored.idleGateCountsSideChat ?? false,
    stealthTriggered: scored.stealthTriggered ?? false,
    navigationRestored: scored.navigationRestored ?? false,
    sideChatRestored: scored.sideChatRestored ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.idleGateCountsSideChat ? "gate=counts-aside" : "gate=ignores-aside",
    result.stealthTriggered ? "stealth=fired" : "stealth=deferred",
    result.sideChatRestored ? "aside=restored" : "aside=gone",
    result.cue === "preserved" ? "cue=preserved" : "cue=discarded",
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
      desktopFrom: DESKTOP_FROM,
      desktopTo: DESKTOP_TO,
      bundledCode: BUNDLED_CODE,
      arch: ARCH,
      macos: MACOS,
      idleMinutes: IDLE_MINUTES,
      elapsedMinutes: ELAPSED_MINUTES,
      enforcementHours: ENFORCEMENT_HOURS,
      navEntries: NAV_ENTRIES,
      navActive: NAV_ACTIVE,
      navDropped: NAV_DROPPED,
      popoutSessions: POPOUT_SESSIONS,
      popoutPanes: POPOUT_PANES,
      command: COMMAND,
      logSave: LOG_SAVE,
      logTrigger: LOG_TRIGGER,
      logQuit: LOG_QUIT,
      logRestore: LOG_RESTORE,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "defer restart while a side chat is open",
        "or restore the side chat alongside navigation state",
        "idle gate should count an open /btw panel as active work",
      ],
      hypothesis:
        "NON-BINDING: the idle gate that exists to prevent a stealth relaunch over live work may omit side chats from active work, and because side-chat state is in-memory only the seamless relaunch can restore navigation without the aside",
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
