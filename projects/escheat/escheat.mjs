#!/usr/bin/env node
/**
 * Escheat — feudal escheat chamber / royal escheator desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * a worktree session should keep the git worktree lock released when
 * the session ends (shutdown that writes bridge-session / last-prompt
 * also releases the lock; failing that, a later session in the same
 * repo treats a lock whose recorded PID is not running as stale and
 * reaps it). Instead VS Code window-close dies without releasing
 * .git/worktrees/<name>/locked, the file keeps naming the dead PID,
 * prune skips it, remove refuses without --force, and --resume from
 * the main checkout does not list the session.
 *
 *   node escheat.mjs data/escheat.json
 *   echo '{"seed":"escheat"}' | node escheat.mjs
 *
 * Idle word is released (HOLD: lock released on session end; later
 * session would find nothing to reap).
 * Seeded word is escheat (#93231: window-close shutdown writes
 * bridge-session / last-prompt but leaves locked naming a dead PID;
 * no later reaper).
 * Path word is stale (named path — later session treats a lock whose
 * recorded PID is not running as stale and should reap it; it does not).
 *
 * Encoded from anthropics/claude-code#93231 issue body only.
 * Hypothesis (NON-BINDING): the VS Code window-close shutdown that
 * writes bridge-session / last-prompt does not release the worktree
 * lock, and a later session does not treat a lock whose recorded PID
 * is not running as stale. Verify against #93231 text only. Do NOT
 * claim a root cause in Claude Code source you have not seen. Do NOT
 * implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "released",
  "escheat",
  "stale",
  "hold",
  "window-close",
  "lock-unreleased",
  "dead-pid",
  "prune-skips",
  "remove-refuses",
  "resume-hidden",
  "shutdown-wrote",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "released";
export const PATH_WORD = "stale";
export const SEEDED_WORD = "escheat";
export const HOLD = Object.freeze(["released", "hold"]);
export const RECOVER = Object.freeze(["released", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "freehold",
  "mortmain",
  "phantom",
  "trunked",
  "strowger",
  "exchanged",
  "tokenized",
  "mondegreen",
  "parsed",
  "locked",
  "scratched",
  "derby",
  "unmasked",
  "vizard",
  "precedence",
  "carrier",
  "deadair",
  "squelch",
  "moored",
  "scuttled",
  "scuttle",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
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
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
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
  "culled",
  "sole",
  "slipped",
  "sprung",
  "corked",
  "relayed",
  "oubliette",
  "ephemera",
  "embrasure",
  "midden",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "escheat"),
);

export const FEATURED_ISSUE = 93231;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93231";
export const TITLE =
  "Session exit on VS Code window close never releases its git worktree lock; `locked` keeps naming the dead PID and no later session reaps it";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
  "platform:vscode",
]);
export const AUTHOR = "cgopal";
export const FILED = "2026-09-10T00:28:34Z";
export const CLAUDE_VERSION = "2.1.118";
export const SURFACE = "VS Code 1.137.0 (entrypoint claude-vscode)";
export const OS = "Windows 11 Pro 10.0.26200";
export const GIT_VERSION = "2.53.0.windows.1";
export const DEAD_PID = 75688;
export const LOCK_TEXT = "claude session feature-branch (pid 75688)";
export const WORKTREE_PATH =
  "X:\\myrepo\\.claude\\worktrees\\feature-branch";
export const WORKTREE_BRANCH = "worktree-feature-branch";
export const MAIN_CHECKOUT = "X:\\myrepo";
export const LOCK_PATH = ".git/worktrees/feature-branch/locked";
export const FINAL_TURN = "20:17:04";
export const WINDOW_CLOSE = "~20:22";
export const NEW_SESSION = "20:24";
export const STOP_REASON = "end_turn";
export const PHRASE =
  "when VS Code window-close shutdown leaves the git worktree lock naming a dead PID with no later reaper, escheat never stays released — score escheat or admit released.";

export const COFFER_SLIPS = Object.freeze([
  {
    id: "lock-file",
    path: ".git/worktrees/feature-branch/locked",
    kind: "lock-file",
    note: "names claude session feature-branch (pid 75688)",
  },
  {
    id: "worktree",
    path: "X:\\myrepo\\.claude\\worktrees\\feature-branch",
    kind: "orphan-worktree",
    note: "branch worktree-feature-branch under main checkout X:\\myrepo",
  },
  {
    id: "resume",
    path: "claude --resume from X:\\myrepo",
    kind: "resume-hidden",
    note: "session not listed from the main checkout",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "claude session feature-branch (pid 75688)",
  "bridge-session",
  "last-prompt",
  "stop_reason end_turn",
  ".git/worktrees/feature-branch/locked",
  "Get-Process",
  "git worktree prune",
  "git worktree remove",
  "--resume",
  "worktree-feature-branch",
]);

export const COUSINS = Object.freeze([
  {
    issue: 79888,
    title: "bg session locks not released on end",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin from the #93231 brief — background session locks not released on end; do not rebuild",
  },
  {
    issue: 51643,
    title: "detect/clean stale-PID locks",
    state: "CLOSED",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin — closed detect/clean stale-PID locks; do not rebuild",
  },
  {
    issue: 77268,
    title: "cite-only cousin from the #93231 brief",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "Cite-only cousin from the #93231 brief — do not rebuild",
  },
  {
    issue: 84787,
    title: "cite-only cousin from the #93231 brief",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "Cite-only cousin from the #93231 brief — do not rebuild",
  },
  {
    issue: 89199,
    title: "cite-only cousin from the #93231 brief",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "Cite-only cousin from the #93231 brief — do not rebuild",
  },
  {
    issue: 28546,
    title: "stale index.lock — different",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "Cite-only cousin — stale index.lock is a different lock family; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93219,
    title: "Vernier — effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — effort slider inert — backup, not primary; cite in data only",
  },
  {
    issue: 93207,
    title: "iOS plan approval setMode auto",
    state: "OPEN",
    citeOnly: true,
    why: "iOS plan approval setMode auto — backup, not primary; cite in data only",
  },
  {
    issue: 93198,
    title: "Cedilla accented paths",
    state: "OPEN",
    product: "Cedilla",
    citeOnly: true,
    why: "Cedilla accented paths — backup, not primary; cite in data only",
  },
  {
    issue: 93177,
    title: "opusplan stays Opus",
    state: "OPEN",
    citeOnly: true,
    why: "opusplan stays Opus — backup, not primary; cite in data only",
  },
  {
    issue: 93210,
    title: "sidebar stale order",
    state: "OPEN",
    citeOnly: true,
    why: "sidebar stale order — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "mortmain",
  "midden",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
]);

/**
 * Conceptual iron coffer — slips for the orphan worktree the
 * escheator should keep released after session end.
 */
export function readCoffer(slips = COFFER_SLIPS) {
  return {
    slips: slips.length,
    paths: slips.map((row) => row.path),
    ids: slips.map((row) => row.id),
    kinds: slips.map((row) => row.kind),
    deadPid: DEAD_PID,
    lockText: LOCK_TEXT,
  };
}

/**
 * Conceptual wax escheat seal — released (lock given back) vs
 * escheat (crown keeps the orphan worktree after the tenant dies).
 */
export function readSeal(input = {}) {
  const windowClose = input.windowClose === true;
  const lockUnreleased = input.lockUnreleased === true;
  const deadPid = input.deadPid === true;
  const taken = windowClose && lockUnreleased && deadPid;
  return {
    released: !taken,
    taken,
    lamp: taken ? "escheat" : "released",
    windowClose,
    lockUnreleased,
    deadPid,
    lockText: taken ? LOCK_TEXT : null,
    pid: taken ? DEAD_PID : null,
  };
}

export function compareInquest(input = {}) {
  const coffer = readCoffer(input.slips || COFFER_SLIPS);
  const seal = readSeal(input);
  const pruneSkips = input.pruneSkips === true || seal.taken;
  const removeRefuses = input.removeRefuses === true || seal.taken;
  const resumeHidden = input.resumeHidden === true;
  const crownTakes = seal.taken && pruneSkips;
  return {
    coffer,
    seal,
    pruneSkips,
    removeRefuses,
    resumeHidden,
    crownTakes,
    cue: crownTakes ? "escheat" : "released",
  };
}

/**
 * Published escheat walk from #93231 only. Facts from the issue body.
 * A released booth keeps the worktree lock given back on session end.
 * An escheat booth leaves locked naming a dead PID with no later reaper.
 */
export const ESCHEAT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-released",
    released: true,
    windowClose: false,
    shutdownWrote: false,
    lockUnreleased: false,
    deadPid: false,
    pruneSkips: false,
    removeRefuses: false,
    resumeHidden: false,
    cue: "released",
    note: "idle HOLD: worktree lock released on session end; later session finds nothing to reap",
  },
  {
    t: "close",
    event: "window-close",
    windowClose: true,
    cue: "escheat",
    note: "~20:22 VS Code closed; session running in .claude/worktrees/feature-branch",
  },
  {
    t: "shutdown",
    event: "shutdown-wrote",
    shutdownWrote: true,
    windowClose: true,
    cue: "escheat",
    note: "shutdown writes bridge-session and last-prompt; process exits",
  },
  {
    t: "lock",
    event: "lock-unreleased",
    lockUnreleased: true,
    shutdownWrote: true,
    windowClose: true,
    cue: "escheat",
    note: "lock file unchanged: claude session feature-branch (pid 75688)",
  },
  {
    t: "pid",
    event: "dead-pid",
    deadPid: true,
    lockUnreleased: true,
    windowClose: true,
    cue: "escheat",
    note: "20:24 new session in main checkout; PID 75688 confirmed dead",
  },
  {
    t: "prune",
    event: "prune-skips",
    pruneSkips: true,
    lockUnreleased: true,
    deadPid: true,
    cue: "escheat",
    note: "git worktree list still shows locked; prune will not remove",
  },
  {
    t: "remove",
    event: "remove-refuses",
    removeRefuses: true,
    pruneSkips: true,
    lockUnreleased: true,
    cue: "escheat",
    note: "git worktree remove errors without --force",
  },
  {
    t: "resume",
    event: "resume-hidden",
    resumeHidden: true,
    windowClose: true,
    cue: "escheat",
    note: "session not listed by --resume from the main checkout; work looks lost",
  },
  {
    t: "cut",
    event: "escheat",
    released: false,
    windowClose: true,
    shutdownWrote: true,
    lockUnreleased: true,
    deadPid: true,
    pruneSkips: true,
    removeRefuses: true,
    resumeHidden: true,
    cue: "escheat",
    note: "crown takes the orphan worktree; score escheat",
  },
  {
    t: "path",
    event: "stale",
    stale: true,
    cue: "escheat",
    note: "when window-close leaves locked naming a dead PID with no later reaper, stale never stays released",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    released: true,
    windowClose: false,
    shutdownWrote: false,
    lockUnreleased: false,
    deadPid: false,
    pruneSkips: false,
    removeRefuses: false,
    resumeHidden: false,
    cue: "released",
  };
}

export function seedReleased() {
  return { ...emptyTicket() };
}

export function seedEscheat() {
  return {
    seed: SEEDED_WORD,
    released: false,
    windowClose: true,
    shutdownWrote: true,
    lockUnreleased: true,
    deadPid: true,
    pruneSkips: true,
    removeRefuses: true,
    resumeHidden: true,
    cue: "escheat",
    issue: FEATURED_ISSUE,
  };
}

export function seedStale() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    stale: true,
    cue: "escheat",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    released: true,
    cue: "released",
  };
}

export function seedWindowClose() {
  return {
    seed: "window-close",
    windowClose: true,
    cue: "escheat",
  };
}

export function seedLockUnreleased() {
  return {
    seed: "lock-unreleased",
    lockUnreleased: true,
    windowClose: true,
    shutdownWrote: true,
    cue: "escheat",
  };
}

export function seedDeadPid() {
  return {
    seed: "dead-pid",
    deadPid: true,
    lockUnreleased: true,
    windowClose: true,
    cue: "escheat",
  };
}

export function seedPruneSkips() {
  return {
    seed: "prune-skips",
    pruneSkips: true,
    lockUnreleased: true,
    deadPid: true,
    cue: "escheat",
  };
}

export function seedRemoveRefuses() {
  return {
    seed: "remove-refuses",
    removeRefuses: true,
    pruneSkips: true,
    lockUnreleased: true,
    cue: "escheat",
  };
}

export function seedResumeHidden() {
  return {
    seed: "resume-hidden",
    resumeHidden: true,
    windowClose: true,
    cue: "escheat",
  };
}

export function seedShutdownWrote() {
  return {
    seed: "shutdown-wrote",
    shutdownWrote: true,
    windowClose: true,
    cue: "escheat",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      released: false,
      windowClose: false,
      shutdownWrote: false,
      lockUnreleased: false,
      deadPid: false,
      pruneSkips: false,
      removeRefuses: false,
      resumeHidden: false,
      stale: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    released: raw.released === true,
    windowClose: raw.windowClose === true,
    shutdownWrote: raw.shutdownWrote === true,
    lockUnreleased: raw.lockUnreleased === true,
    deadPid: raw.deadPid === true,
    pruneSkips: raw.pruneSkips === true,
    removeRefuses: raw.removeRefuses === true,
    resumeHidden: raw.resumeHidden === true,
    stale: raw.stale === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.released != null ||
        ticket.windowClose != null ||
        ticket.shutdownWrote != null ||
        ticket.lockUnreleased != null ||
        ticket.deadPid != null ||
        ticket.pruneSkips != null ||
        ticket.removeRefuses != null ||
        ticket.resumeHidden != null ||
        ticket.stale != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isReleased(row) {
  if (row.stale) return false;
  if (row.cue === "escheat") return false;
  if (row.windowClose && row.lockUnreleased && row.released !== true) {
    return false;
  }
  if (row.lockUnreleased && row.deadPid) return false;
  if (
    row.released === true &&
    row.windowClose !== true &&
    row.cue !== "escheat"
  ) {
    return true;
  }
  if (
    row.cue === "released" &&
    row.windowClose !== true &&
    row.lockUnreleased !== true
  ) {
    return true;
  }
  return false;
}

function isEscheat(row) {
  if (row.stale && row.cue !== "released") return false;
  if (row.cue === "escheat") return true;
  if (row.windowClose && row.lockUnreleased && row.deadPid) return true;
  if (row.lockUnreleased && row.deadPid && row.pruneSkips) return true;
  if (row.lockUnreleased && row.removeRefuses) return true;
  if (row.windowClose && row.shutdownWrote && row.lockUnreleased) return true;
  if (row.deadPid && row.resumeHidden && row.lockUnreleased) return true;
  return false;
}

function isStalePath(row) {
  return row.stale === true && !isReleased(row);
}

/**
 * Score one inquest pass against the escheat booth.
 * released: lock given back on session end; later session finds nothing to reap.
 * escheat: window-close leaves locked naming a dead PID; no later reaper.
 * stale: named path — later session should reap a dead-PID lock; it does not.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isStalePath(row)) {
    verdict = "stale";
  } else if (isEscheat(row)) {
    verdict = "escheat";
  } else if (isReleased(row)) {
    verdict = "released";
  } else if (
    row.windowClose ||
    row.lockUnreleased ||
    row.deadPid ||
    row.pruneSkips ||
    row.removeRefuses ||
    row.resumeHidden ||
    row.shutdownWrote
  ) {
    verdict = "escheat";
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
    released: verdict === "released",
    escheat: verdict === "escheat" || verdict === SEEDED_WORD,
    stale: verdict === "stale" || verdict === PATH_WORD,
    windowClose: row.windowClose,
    shutdownWrote: row.shutdownWrote,
    lockUnreleased: row.lockUnreleased,
    deadPid: row.deadPid,
    pruneSkips: row.pruneSkips,
    removeRefuses: row.removeRefuses,
    resumeHidden: row.resumeHidden,
    cue: hold ? "released" : "escheat",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit released" : "score escheat",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : ESCHEAT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const escheat = scored.filter((row) => row.verdict === "escheat");
  const stale = scored.filter((row) => row.verdict === "stale");
  const released = scored.filter((row) => row.verdict === "released");
  const headline =
    scored.find((row) => row.event === "escheat") ||
    scored.find((row) => row.event === "dead-pid") ||
    scored.find((row) => row.event === "lock-unreleased") ||
    scored.find((row) => row.event === "stale") ||
    escheat[escheat.length - 1];
  let verdict = "released";
  if (escheat.length) verdict = "escheat";
  else if (stale.length && !released.length) verdict = "stale";
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
    escheatCount: escheat.length,
    staleCount: stale.length,
    releasedCount: released.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit released" : "score escheat",
    note: headline
      ? "window-close leaves locked naming a dead PID; prune skips; remove refuses; no later reaper."
      : "published escheat walk scored against released vs escheat",
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
    seeded !== "released" &&
    seeded !== "escheat" &&
    seeded !== "stale" &&
    ticket.released == null &&
    ticket.windowClose == null &&
    ticket.lockUnreleased == null &&
    ticket.deadPid == null &&
    ticket.stale == null &&
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
    released: scored.released ?? false,
    windowClose: scored.windowClose ?? false,
    shutdownWrote: scored.shutdownWrote ?? false,
    lockUnreleased: scored.lockUnreleased ?? false,
    deadPid: scored.deadPid ?? false,
    pruneSkips: scored.pruneSkips ?? false,
    removeRefuses: scored.removeRefuses ?? false,
    resumeHidden: scored.resumeHidden ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.windowClose ? "window=close" : "window=open",
    result.shutdownWrote ? "shutdown=wrote" : "shutdown=none",
    result.lockUnreleased ? "lock=unreleased" : "lock=released",
    result.deadPid ? "pid=dead" : "pid=live",
    result.pruneSkips ? "prune=skips" : "prune=ok",
    result.removeRefuses ? "remove=refuses" : "remove=ok",
    result.cue === "released" ? "cue=released" : "cue=escheat",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const inquest = compareInquest({
    windowClose: result.windowClose,
    lockUnreleased: result.lockUnreleased,
    deadPid: result.deadPid,
    pruneSkips: result.pruneSkips,
    removeRefuses: result.removeRefuses,
    resumeHidden: result.resumeHidden,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    inquest,
    coffer: readCoffer(),
    seal: readSeal({
      windowClose: result.windowClose,
      lockUnreleased: result.lockUnreleased,
      deadPid: result.deadPid,
    }),
    slips: COFFER_SLIPS.map((row) => ({
      ...row,
      taken: result.lockUnreleased === true || result.verdict === "escheat",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      os: OS,
      gitVersion: GIT_VERSION,
      deadPid: DEAD_PID,
      lockText: LOCK_TEXT,
      worktreePath: WORKTREE_PATH,
      worktreeBranch: WORKTREE_BRANCH,
      mainCheckout: MAIN_CHECKOUT,
      lockPath: LOCK_PATH,
      finalTurn: FINAL_TURN,
      windowClose: WINDOW_CLOSE,
      newSession: NEW_SESSION,
      stopReason: STOP_REASON,
      slips: COFFER_SLIPS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "release the worktree lock on the same shutdown that writes bridge-session / last-prompt",
        "or a later session in the same repo treats a lock whose recorded PID is not running as stale and reaps it",
      ],
      hypothesis:
        "NON-BINDING: the VS Code window-close shutdown that writes bridge-session / last-prompt does not release the worktree lock, and a later session does not treat a lock whose recorded PID is not running as stale",
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
