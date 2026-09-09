#!/usr/bin/env node
/**
 * Midden — archaeological refuse-heap / ash-and-bone strata booth.
 *
 * Educational diagnostic model for a published Desktop WorktreePool defect:
 * a refuse heap should stay CLEARED after one GC pass (partial-remove
 * orphan removed; store entry pruned; retries stop). Instead the heap is
 * MOUNDED — git worktree remove --force and the manual-cleanup fallback
 * both refuse for the same missing .git link, the store entry is never
 * pruned, and the same five-line cycle remounds every 30 minutes.
 *
 *   node midden.mjs data/mounded.json
 *   echo '{"seed":"mounded"}' | node midden.mjs
 *
 * Idle word is cleared (HOLD: GC treats partial-remove as expected,
 * removes the directory after git worktree prune, or marks the store
 * entry permanently-failed after the first failure so the loop stops).
 * Seeded word is mounded (#93081: git remove fails with fatal: is not
 * a working tree; fallback refuses with .git link missing (partial
 * remove); not safe to rm; store claims prune but the entry remains;
 * 853 repeats / 20 days / 13 updates).
 * Path word is midden (a WorktreePool that remounds the same orphan
 * every half hour is not cleared — it is a midden).
 *
 * Encoded from anthropics/claude-code#93081 issue body only.
 * Hypothesis (NON-BINDING): WorktreePool GC may treat the same missing
 * .git link as both "not a working tree" (so git remove fails) and
 * "not safe to rm" (so fallback refuses), then log a prune that does
 * not remove the store entry — so the next 30-minute tick rediscovers
 * the same orphan. Verify against #93081 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "cleared",
  "mounded",
  "midden",
  "hold",
  "partial-remove",
  "git-remove-fails",
  "fallback-refuses",
  "store-not-pruned",
  "thirty-minute-cadence",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "cleared";
export const PATH_WORD = "midden";
export const SEEDED_WORD = "mounded";
export const HOLD = Object.freeze(["cleared", "hold"]);
export const RECOVER = Object.freeze(["cleared", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "cleared" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "distinct",
  "conflated",
  "diplopic",
  "held",
  "steered",
  "greenroomed",
  "raised",
  "fallen",
  "scaffold",
  "lodged",
  "bypassed",
  "cutaway",
  "sterling",
  "debased",
  "rubbed",
  "primed",
  "flashed",
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
  "stereotyped",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "mounded"),
);

export const FEATURED_ISSUE = 93081;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93081";
export const TITLE =
  "[BUG] Orphaned worktree entry is retried every 30 minutes forever; cleanup can never succeed";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:desktop",
]);
export const REPORTER = "emanon-i";
export const FILED_AT = "2026-09-09T12:45:23Z";
export const PRODUCT = "Claude desktop for Windows WorktreePool GC";
export const VERSION = "1.49585.0.0";
export const FIRST_OBSERVED = "1.34493.1.0";
export const CLAUDE_CODE_VERSION = "2.1.216";
export const PLATFORM = "windows";
export const WINDOWS_BUILD = "11 Pro build 26220";
export const GIT_VERSION = "2.53.0.windows.1";
export const WORKTREE_NAME = "clever-bassi-12c5dc";
export const WORKTREE_PATH =
  "<repo>\\.claude\\worktrees\\clever-bassi-12c5dc";
export const LEASED_BY = "none";
export const GIT_EXIT = 128;
export const CADENCE_MINUTES = 30;
export const CYCLES = 853;
export const DAYS = 20;
export const UPDATES = 13;
export const FIRST_APPEARANCE = "2026-08-21";
export const STILL_GOING = "2026-09-09";
export const LOG_CLAIM =
  "[WorktreePool] Pruning orphaned store entry clever-bassi-12c5dc (directory gone or not a worktree)";
export const GIT_FATAL = "fatal: is not a working tree";
export const FALLBACK_REFUSAL =
  ".git link missing (partial remove); not safe to rm";
export const PHRASE =
  "a WorktreePool that remounds the same orphan every half hour is not cleared — it is a midden. Score mounded or admit cleared.";

export const FIVE_LINE_CYCLE = Object.freeze([
  '[info] [WorktreePool] Pruning orphaned store entry clever-bassi-12c5dc (directory gone or not a worktree)',
  '[info] Removing worktree "clever-bassi-12c5dc" (leased by none): <repo>\\.claude\\worktrees\\clever-bassi-12c5dc',
  "[error] Git command failed: git -c core.longpaths=true worktree remove --force … { code: 128, stderr: \"fatal: '…' is not a working tree\" }",
  "[warn] Git worktree remove failed, will try manual cleanup: fatal: '…' is not a working tree",
  "[warn] Keeping worktree dir …: git status failed (.git link missing (partial remove)); not safe to rm. Remove manually if no longer needed.",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "Pruning orphaned store entry",
  "is not a working tree",
  "Git worktree remove failed, will try manual cleanup",
  ".git link missing (partial remove); not safe to rm",
  "Keeping worktree dir",
]);

export const COUSINS = Object.freeze([
  {
    issue: 75911,
    title:
      "Desktop app's worktree pool reclaims/re-leases a directory while a session is still using it, detaching HEAD mid-task",
    state: "OPEN",
    citeOnly: true,
    why: "same WorktreePool family but a premature reclaim/re-lease race on a live session, not an orphaned partial-remove GC deadlock; cite only; do not clone",
  },
  {
    issue: 78350,
    title:
      "[WorktreePool] reaps a worktree while its leasing session is actively running",
    state: "OPEN",
    citeOnly: true,
    why: "live-session reap (lease printed then removed), not a leftover directory that can never be cleaned; cite only; do not clone",
  },
  {
    issue: 91405,
    title:
      "Worktree pool assigns relaunched sessions to the wrong worktree (95% of sessions measured)",
    state: "OPEN",
    citeOnly: true,
    why: "wrong-slot rebind / dirty reset, not the five-line 30-minute orphan retry; cite only; do not clone",
  },
  {
    issue: 91246,
    title:
      "Desktop: pooled session worktrees are never reclaimed — archiving pools instead of removing, with no expiry",
    state: "OPEN",
    citeOnly: true,
    why: "opposite heap problem — archive pools forever with no expiry, not a GC that retries a partial-remove forever; cite only; do not clone",
  },
  {
    issue: 92078,
    title:
      "[BUG] Desktop (macOS): background full checkout of pooled worktrees is unthrottled",
    state: "OPEN",
    citeOnly: true,
    why: "checkout throughput / disk growth, not orphan-cleanup deadlock; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "quill",
  "colophon",
  "sallyport",
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
  "assay",
  "afterimage",
  "diopter",
]);

/**
 * Published midden walk from #93081 only. Facts from the issue body.
 * A cleared heap finishes one GC pass and stops. A mounded heap
 * remounds the same orphan every 30 minutes.
 */
export const MIDDEN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-cleared",
    gitLinkPresent: false,
    directoryExists: false,
    storePruned: true,
    retryLoop: false,
    gcPasses: 1,
    cue: "cleared",
    note: "idle HOLD: one GC pass treats partial-remove as expected and clears the orphan; retries stop",
  },
  {
    t: "partial",
    event: "partial-remove",
    gitLinkPresent: false,
    directoryExists: true,
    partialRemove: true,
    cue: "mounded",
    note: ".git link file gone, directory still exists",
  },
  {
    t: "git",
    event: "git-remove-fails",
    gitRemoveFails: true,
    gitFatal: GIT_FATAL,
    gitExit: GIT_EXIT,
    cue: "mounded",
    note: "git worktree remove --force fails with fatal: is not a working tree",
  },
  {
    t: "fallback",
    event: "fallback-refuses",
    fallbackRefuses: true,
    fallbackRefusal: FALLBACK_REFUSAL,
    cue: "mounded",
    note: "manual-cleanup fallback refuses: .git link missing (partial remove); not safe to rm",
  },
  {
    t: "store",
    event: "store-not-pruned",
    storePruned: false,
    logClaimsPrune: true,
    cue: "mounded",
    note: "log line claims pruning orphaned store entry but the entry is not pruned",
  },
  {
    t: "cadence",
    event: "thirty-minute-cadence",
    cadenceMinutes: CADENCE_MINUTES,
    retryLoop: true,
    cycles: CYCLES,
    days: DAYS,
    updates: UPDATES,
    cue: "mounded",
    note: "same five-line sequence every 30 minutes; 853 repeats / 20 days / 13 updates",
  },
  {
    t: "path",
    event: "midden",
    midden: true,
    cue: "mounded",
    note: "a WorktreePool that remounds the same orphan every half hour is not cleared",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    gitLinkPresent: false,
    directoryExists: false,
    storePruned: true,
    retryLoop: false,
    gcPasses: 1,
    gitRemoveFails: false,
    fallbackRefuses: false,
    partialRemove: false,
    logClaimsPrune: false,
    midden: false,
    cue: "cleared",
  };
}

export function seedCleared() {
  return { ...emptyTicket() };
}

export function seedMounded() {
  return {
    seed: SEEDED_WORD,
    gitLinkPresent: false,
    directoryExists: true,
    partialRemove: true,
    gitRemoveFails: true,
    gitFatal: GIT_FATAL,
    gitExit: GIT_EXIT,
    fallbackRefuses: true,
    fallbackRefusal: FALLBACK_REFUSAL,
    storePruned: false,
    logClaimsPrune: true,
    retryLoop: true,
    cadenceMinutes: CADENCE_MINUTES,
    cycles: CYCLES,
    days: DAYS,
    updates: UPDATES,
    worktree: WORKTREE_NAME,
    leasedBy: LEASED_BY,
    cue: "mounded",
    issue: FEATURED_ISSUE,
    version: VERSION,
  };
}

export function seedMidden() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    midden: true,
    cue: "mounded",
  };
}

export function seedPartialRemove() {
  return {
    seed: "partial-remove",
    gitLinkPresent: false,
    directoryExists: true,
    partialRemove: true,
    cue: "mounded",
  };
}

export function seedGitRemoveFails() {
  return {
    seed: "git-remove-fails",
    gitRemoveFails: true,
    gitFatal: GIT_FATAL,
    gitExit: GIT_EXIT,
    cue: "mounded",
  };
}

export function seedFallbackRefuses() {
  return {
    seed: "fallback-refuses",
    fallbackRefuses: true,
    fallbackRefusal: FALLBACK_REFUSAL,
    cue: "mounded",
  };
}

export function seedStoreNotPruned() {
  return {
    seed: "store-not-pruned",
    storePruned: false,
    logClaimsPrune: true,
    cue: "mounded",
  };
}

export function seedThirtyMinuteCadence() {
  return {
    seed: "thirty-minute-cadence",
    cadenceMinutes: CADENCE_MINUTES,
    retryLoop: true,
    cycles: CYCLES,
    cue: "mounded",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      gitLinkPresent: false,
      directoryExists: false,
      storePruned: false,
      retryLoop: false,
      gcPasses: 0,
      gitRemoveFails: false,
      fallbackRefuses: false,
      partialRemove: false,
      logClaimsPrune: false,
      midden: false,
      gitFatal: null,
      fallbackRefusal: null,
      gitExit: null,
      cadenceMinutes: null,
      cycles: null,
      days: null,
      updates: null,
      worktree: null,
      leasedBy: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    gitLinkPresent: raw.gitLinkPresent === true,
    directoryExists: raw.directoryExists === true,
    storePruned: raw.storePruned === true,
    retryLoop: raw.retryLoop === true,
    gcPasses: Number.isFinite(raw.gcPasses) ? raw.gcPasses : 0,
    gitRemoveFails: raw.gitRemoveFails === true,
    fallbackRefuses: raw.fallbackRefuses === true,
    partialRemove:
      raw.partialRemove === true ||
      (raw.gitLinkPresent === false && raw.directoryExists === true),
    logClaimsPrune: raw.logClaimsPrune === true,
    midden: raw.midden === true,
    gitFatal: raw.gitFatal || null,
    fallbackRefusal: raw.fallbackRefusal || null,
    gitExit: raw.gitExit ?? null,
    cadenceMinutes: raw.cadenceMinutes ?? null,
    cycles: raw.cycles ?? null,
    days: raw.days ?? null,
    updates: raw.updates ?? null,
    worktree: raw.worktree || raw.worktreeName || null,
    leasedBy: raw.leasedBy || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.gitLinkPresent != null ||
        ticket.directoryExists != null ||
        ticket.storePruned != null ||
        ticket.retryLoop != null ||
        ticket.gitRemoveFails != null ||
        ticket.fallbackRefuses != null ||
        ticket.partialRemove != null ||
        ticket.logClaimsPrune != null ||
        ticket.midden != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.cadenceMinutes != null ||
        ticket.cycles != null),
  );
}

function isCleared(row) {
  if (row.midden) return false;
  if (row.cue === "mounded") return false;
  if (row.retryLoop) return false;
  if (row.gitRemoveFails && row.fallbackRefuses && row.storePruned === false) {
    return false;
  }
  if (row.storePruned === true && row.retryLoop !== true && row.cue !== "mounded") {
    return true;
  }
  if (row.cue === "cleared" && row.retryLoop !== true) {
    return true;
  }
  if (
    row.gcPasses === 1 &&
    row.storePruned === true &&
    row.directoryExists === false &&
    !row.retryLoop
  ) {
    return true;
  }
  return false;
}

function isMounded(row) {
  if (row.midden && row.cue !== "cleared") return false;
  if (row.cue === "mounded") return true;
  if (row.gitRemoveFails && row.fallbackRefuses && row.storePruned === false) {
    return true;
  }
  if (row.retryLoop && row.cadenceMinutes === CADENCE_MINUTES) return true;
  if (row.partialRemove && row.gitRemoveFails && row.fallbackRefuses) return true;
  if (row.logClaimsPrune && row.storePruned === false && row.retryLoop) {
    return true;
  }
  return false;
}

function isMiddenPath(row) {
  return row.midden === true && !isCleared(row);
}

/**
 * Score one WorktreePool GC pass against the midden booth.
 * cleared: one GC pass removes the partial-remove orphan and stops.
 * mounded: git remove and fallback both refuse; store stays; 30m retry.
 * midden: named path — the same orphan remounds forever.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isMiddenPath(row)) {
    verdict = "midden";
  } else if (isMounded(row)) {
    verdict = "mounded";
  } else if (isCleared(row)) {
    verdict = "cleared";
  } else if (
    row.gitRemoveFails ||
    row.fallbackRefuses ||
    row.partialRemove ||
    row.retryLoop ||
    (row.logClaimsPrune && row.storePruned === false)
  ) {
    verdict = "mounded";
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
    cleared: verdict === "cleared",
    mounded: verdict === "mounded" || verdict === SEEDED_WORD,
    midden: verdict === "midden" || verdict === PATH_WORD,
    gitLinkPresent: row.gitLinkPresent,
    directoryExists: row.directoryExists,
    storePruned: row.storePruned,
    retryLoop: row.retryLoop,
    gcPasses: row.gcPasses,
    gitRemoveFails: row.gitRemoveFails,
    fallbackRefuses: row.fallbackRefuses,
    partialRemove: row.partialRemove,
    logClaimsPrune: row.logClaimsPrune,
    gitFatal: row.gitFatal,
    fallbackRefusal: row.fallbackRefusal,
    gitExit: row.gitExit,
    cadenceMinutes: row.cadenceMinutes,
    cycles: row.cycles,
    days: row.days,
    updates: row.updates,
    worktree: row.worktree,
    leasedBy: row.leasedBy,
    cue: hold ? "cleared" : "mounded",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit cleared" : "score mounded",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : MIDDEN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const mounded = scored.filter((row) => row.verdict === "mounded");
  const midden = scored.filter((row) => row.verdict === "midden");
  const cleared = scored.filter((row) => row.verdict === "cleared");
  const headline =
    scored.find((row) => row.event === "thirty-minute-cadence") ||
    scored.find((row) => row.event === "fallback-refuses") ||
    scored.find((row) => row.event === "midden") ||
    mounded[mounded.length - 1];
  let verdict = "cleared";
  if (mounded.length) verdict = "mounded";
  else if (midden.length && !cleared.length) verdict = "midden";
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
    moundedCount: mounded.length,
    middenCount: midden.length,
    clearedCount: cleared.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit cleared" : "score mounded",
    note: headline
      ? "git worktree remove and manual fallback both refuse for the same missing .git link; store entry never pruned; same cycle every 30m"
      : "published midden walk scored against cleared vs mounded",
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
    seeded !== "cleared" &&
    seeded !== "mounded" &&
    seeded !== "midden" &&
    ticket.gitRemoveFails == null &&
    ticket.fallbackRefuses == null &&
    ticket.partialRemove == null &&
    ticket.storePruned == null &&
    ticket.retryLoop == null &&
    ticket.midden == null &&
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
    gitRemoveFails: scored.gitRemoveFails ?? false,
    fallbackRefuses: scored.fallbackRefuses ?? false,
    storePruned: scored.storePruned ?? false,
    retryLoop: scored.retryLoop ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.gitRemoveFails ? "git=fatal-not-a-working-tree" : "git=ok",
    result.fallbackRefuses ? "fallback=not-safe-to-rm" : "fallback=clears",
    result.storePruned ? "store=pruned" : "store=not-pruned",
    result.cue === "cleared" ? "cue=cleared" : "cue=mounded",
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
      version: VERSION,
      firstObserved: FIRST_OBSERVED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      platform: PLATFORM,
      windowsBuild: WINDOWS_BUILD,
      gitVersion: GIT_VERSION,
      worktree: WORKTREE_NAME,
      worktreePath: WORKTREE_PATH,
      leasedBy: LEASED_BY,
      gitExit: GIT_EXIT,
      cadenceMinutes: CADENCE_MINUTES,
      cycles: CYCLES,
      days: DAYS,
      updates: UPDATES,
      firstAppearance: FIRST_APPEARANCE,
      stillGoing: STILL_GOING,
      logClaim: LOG_CLAIM,
      gitFatal: GIT_FATAL,
      fallbackRefusal: FALLBACK_REFUSAL,
      fiveLineCycle: [...FIVE_LINE_CYCLE],
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "manual-cleanup fallback treats .git link missing (partial remove) as expected and removes the directory (after git worktree prune)",
        "or the store entry is pruned / marked permanently-failed after the first failure so GC stops",
        "surface the leftover directory to the user once instead of infinite 30-minute retries",
      ],
      hypothesis:
        "WorktreePool GC may treat the same missing .git link as both not a working tree (so git remove fails) and not safe to rm (so fallback refuses), then log a prune that does not remove the store entry — so the next 30-minute tick rediscovers the same orphan",
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
