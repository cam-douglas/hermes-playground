#!/usr/bin/env node
/**
 * Entresol — gallery mezzanine / intermediate-floor booth.
 *
 * Educational diagnostic model for a published memory-walk defect:
 * a session started inside a git worktree should load the CLAUDE.md
 * in the directory directly above it when that directory holds the
 * worktree's own repository (docs say every ancestor is read).
 * Instead that parent CLAUDE.md is skipped — every CLAUDE.md above
 * that point loads, and the same parent hands its CLAUDE.md down
 * without trouble to a plain (non-worktree) child. The skip is the
 * specific pairing: child is a worktree OF the repository the parent
 * directory holds. Neither parent/CLAUDE.md nor parent/.claude/CLAUDE.md
 * arrives. Workaround (@-import per worktree) drifts across branches.
 *
 *   node entresol.mjs data/bypassed.json
 *   echo '{"seed":"bypassed"}' | node entresol.mjs
 *
 * Idle word is lodged (HOLD: parent CLAUDE.md reaches the worktree
 * session). Seeded word is bypassed (#93010: parent CLAUDE.md absent
 * for worktree child of that parent's repository). Path word is
 * cutaway (the mezzanine floor whose shared instructions are cut away).
 *
 * Encoded from anthropics/claude-code#93010 issue body only.
 * Hypothesis (NON-BINDING): memory walk may treat the worktree's
 * gitdir/parent boundary as a stop so the directory holding the bare
 * repository is skipped even though docs say every ancestor is read;
 * verify against #93010 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "lodged",
  "bypassed",
  "cutaway",
  "hold",
  "case-d-worktree-child",
  "case-c-plain-child",
  "bare-parent-alone-ok",
  "worktree-elsewhere-ok",
  "worktree-of-different-repo-ok",
  "parent-dot-claude-also-skipped",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "lodged";
export const PATH_WORD = "cutaway";
export const SEEDED_WORD = "bypassed";
export const HOLD = Object.freeze(["lodged", "hold"]);
export const RECOVER = Object.freeze(["lodged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "lodged" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  FORBIDDEN_IDLE.filter((name) => name !== "bypassed"),
);

export const FEATURED_ISSUE = 93010;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93010";
export const TITLE =
  "CLAUDE.md in the directory above a git worktree is not loaded when that directory holds the worktree's repository";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const REPORTER = "jdavidbush";
export const FILED_AT = "2026-09-09T06:09:19Z";
export const PRODUCT =
  "Claude Code 2.1.266 and 2.1.251, macOS 15, plain claude from shell";
export const DARWIN = "25.6.0";
export const MACOS = "15";
export const VERSIONS = Object.freeze(["2.1.266", "2.1.251"]);
export const MODES = Object.freeze(["-p print mode", "interactive"]);
export const DOCS =
  "Manage Claude's memory: reads recursively from cwd up to but not including /";
export const NO_SYMLINKS = true;
export const FRESH_SESSIONS_ONLY = true;
export const WORKAROUND =
  "@-import per worktree drifts across branches (16 worktrees; corrected text on shared branch while 15 still read old)";

export const PARENT_WORD_WORKTREE = "zorb-parent-WORKTREE";
export const PARENT_WORD_PLAIN = "zorb-parent-PLAIN";
export const CHILD_WORD_D = "zorb-child-D";
export const CHILD_WORD_C = "zorb-child-C";

export const COUSINS = Object.freeze([
  {
    issue: 23565,
    title: "memory files loaded twice in worktree",
    state: "OPEN",
    citeOnly: true,
    why: "opposite symptom — cite only; do not clone",
  },
  {
    issue: 39920,
    title: "auto-memory of manual worktree resolves to main worktree path",
    state: "OPEN",
    citeOnly: true,
    why: "path resolution class — Entresol is the skipped parent floor; cite only",
  },
  {
    issue: 27994,
    title: "project root resolves to bare-repo directory not worktree",
    state: "OPEN",
    citeOnly: true,
    why: "root-resolution class — cite only; do not clone",
  },
  {
    issue: 90572,
    title: "built-in worktree silently disregards project CLAUDE.md",
    state: "OPEN",
    citeOnly: true,
    why: "built-in worktree class — Entresol is a session started inside a worktree; cite only",
  },
  {
    issue: 83411,
    title: "Desktop worktrees don't init submodules — CLAUDE.md imports broken",
    state: "OPEN",
    citeOnly: true,
    why: "submodule import class — cite only; do not clone",
  },
  {
    issue: 87824,
    title: "CLAUDE.md re-injected on cd via different relative path (worktree round-trip)",
    state: "OPEN",
    citeOnly: true,
    why: "cd re-injection class — cite only; do not clone",
  },
  {
    issue: 76119,
    title: "desktop worktree sessions should inherit base repo .claude config",
    state: "OPEN",
    citeOnly: true,
    why: "desktop config inherit class — cite only; do not clone",
  },
  {
    issue: 16600,
    title: "memory traversal should respect git worktree boundaries",
    state: "OPEN",
    citeOnly: true,
    why: "boundary class — Entresol is the skipped parent of THAT repository; cite only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "guillotine",
  "greenroom",
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
  "assay",
]);

/**
 * Published entresol walk from #93010 only. Facts from the issue body.
 * Docs say every ancestor is read. The mezzanine that holds the
 * worktree's repository is the floor that is cut away.
 */
export const ENTRESOL_WALK = Object.freeze([
  {
    t: "docs",
    event: "docs-every-ancestor",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: true,
    parentDotClaudeLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D, PARENT_WORD_WORKTREE],
    note: "docs: reads recursively from cwd up to but not including /",
  },
  {
    t: "C",
    event: "case-c-plain-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: false,
    childIsPlain: true,
    parentClaudeMdLoaded: true,
    parentDotClaudeLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_C, PARENT_WORD_PLAIN],
    childWord: CHILD_WORD_C,
    parentWord: PARENT_WORD_PLAIN,
  },
  {
    t: "D",
    event: "case-d-worktree-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    childIsPlain: false,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
    childWord: CHILD_WORD_D,
    parentWord: PARENT_WORD_WORKTREE,
  },
  {
    t: "dot",
    event: "parent-dot-claude-also-skipped",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
  },
  {
    t: "bare",
    event: "bare-parent-alone-ok",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: false,
    childIsWorktree: false,
    parentClaudeMdLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [PARENT_WORD_PLAIN],
  },
  {
    t: "else",
    event: "worktree-elsewhere-ok",
    parentHoldsRepo: false,
    childIsWorktree: true,
    childIsWorktreeOfParentRepo: false,
    parentClaudeMdLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [PARENT_WORD_PLAIN, CHILD_WORD_C],
  },
  {
    t: "other",
    event: "worktree-of-different-repo-ok",
    parentHoldsRepo: false,
    parentIsWorktreeOfDifferentRepo: true,
    childIsWorktreeOfParentRepo: false,
    parentClaudeMdLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [PARENT_WORD_PLAIN],
  },
  {
    t: "cut",
    event: "cutaway",
    cutaway: true,
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
  },
]);

export const SIX_FIXTURE_MATRIX = Object.freeze([
  {
    id: "D",
    name: "case-d-worktree-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    fails: true,
    parentWordArrives: false,
  },
  {
    id: "C",
    name: "case-c-plain-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: false,
    childIsPlain: true,
    fails: false,
    parentWordArrives: true,
  },
  {
    id: "bare",
    name: "bare-parent-alone-ok",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: false,
    childIsWorktree: false,
    fails: false,
    parentWordArrives: true,
  },
  {
    id: "else",
    name: "worktree-elsewhere-ok",
    parentHoldsRepo: false,
    childIsWorktree: true,
    childIsWorktreeOfParentRepo: false,
    fails: false,
    parentWordArrives: true,
  },
  {
    id: "other",
    name: "worktree-of-different-repo-ok",
    parentIsWorktreeOfDifferentRepo: true,
    childIsWorktreeOfParentRepo: false,
    fails: false,
    parentWordArrives: true,
  },
  {
    id: "dot",
    name: "parent-dot-claude-also-skipped",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentDotClaude: true,
    fails: true,
    parentWordArrives: false,
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: true,
    parentDotClaudeLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D, PARENT_WORD_WORKTREE],
    missingWords: [],
    childWord: CHILD_WORD_D,
    parentWord: PARENT_WORD_WORKTREE,
    noSymlinks: true,
    freshSession: true,
  };
}

export function seedLodged() {
  return { ...emptyTicket() };
}

export function seedBypassed() {
  return {
    seed: SEEDED_WORD,
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    childIsPlain: false,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
    childWord: CHILD_WORD_D,
    parentWord: PARENT_WORD_WORKTREE,
    noSymlinks: true,
    freshSession: true,
    issue: FEATURED_ISSUE,
    versions: [...VERSIONS],
    darwin: DARWIN,
  };
}

export function seedCutaway() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    cutaway: true,
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
  };
}

export function seedCaseC() {
  return {
    seed: "case-c-plain-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: false,
    childIsPlain: true,
    parentClaudeMdLoaded: true,
    parentDotClaudeLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_C, PARENT_WORD_PLAIN],
    missingWords: [],
    childWord: CHILD_WORD_C,
    parentWord: PARENT_WORD_PLAIN,
    noSymlinks: true,
    freshSession: true,
  };
}

export function seedCaseD() {
  return {
    seed: "case-d-worktree-child",
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    childIsPlain: false,
    parentClaudeMdLoaded: false,
    parentDotClaudeLoaded: false,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D],
    missingWords: [PARENT_WORD_WORKTREE],
    childWord: CHILD_WORD_D,
    parentWord: PARENT_WORD_WORKTREE,
    noSymlinks: true,
    freshSession: true,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      parentHoldsRepo: false,
      childIsWorktreeOfParentRepo: false,
      childIsWorktree: false,
      childIsPlain: false,
      parentIsWorktreeOfDifferentRepo: false,
      parentClaudeMdLoaded: false,
      parentDotClaudeLoaded: false,
      ancestorsAboveLoaded: false,
      loadedWords: [],
      missingWords: [],
      childWord: null,
      parentWord: null,
      cutaway: false,
      noSymlinks: true,
      freshSession: true,
      event: null,
      t: null,
    };
  }
  const loadedWords = Array.isArray(raw.loadedWords)
    ? raw.loadedWords.map(String)
    : [];
  const missingWords = Array.isArray(raw.missingWords)
    ? raw.missingWords.map(String)
    : [];
  const parentWord =
    raw.parentWord ||
    (loadedWords.includes(PARENT_WORD_WORKTREE)
      ? PARENT_WORD_WORKTREE
      : loadedWords.includes(PARENT_WORD_PLAIN)
        ? PARENT_WORD_PLAIN
        : null);
  const childWord =
    raw.childWord ||
    (loadedWords.includes(CHILD_WORD_D)
      ? CHILD_WORD_D
      : loadedWords.includes(CHILD_WORD_C)
        ? CHILD_WORD_C
        : null);
  const parentClaudeMdLoaded =
    raw.parentClaudeMdLoaded === true ||
    loadedWords.includes(PARENT_WORD_WORKTREE) ||
    loadedWords.includes(PARENT_WORD_PLAIN);
  const parentDotClaudeLoaded =
    raw.parentDotClaudeLoaded === true || raw.dotClaudeLoaded === true;
  return {
    parentHoldsRepo:
      raw.parentHoldsRepo === true || raw.parentHoldsBareRepo === true,
    childIsWorktreeOfParentRepo: raw.childIsWorktreeOfParentRepo === true,
    childIsWorktree:
      raw.childIsWorktree === true || raw.childIsWorktreeOfParentRepo === true,
    childIsPlain: raw.childIsPlain === true,
    parentIsWorktreeOfDifferentRepo:
      raw.parentIsWorktreeOfDifferentRepo === true,
    parentClaudeMdLoaded:
      raw.parentClaudeMdLoaded === false ? false : parentClaudeMdLoaded,
    parentDotClaudeLoaded:
      raw.parentDotClaudeLoaded === false ? false : parentDotClaudeLoaded,
    ancestorsAboveLoaded: raw.ancestorsAboveLoaded !== false,
    loadedWords,
    missingWords,
    childWord,
    parentWord,
    cutaway: raw.cutaway === true,
    noSymlinks: raw.noSymlinks !== false,
    freshSession: raw.freshSession !== false,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.parentHoldsRepo != null ||
        ticket.parentHoldsBareRepo != null ||
        ticket.childIsWorktreeOfParentRepo != null ||
        ticket.parentClaudeMdLoaded != null ||
        ticket.parentDotClaudeLoaded != null ||
        ticket.cutaway != null ||
        ticket.loadedWords != null ||
        ticket.missingWords != null ||
        ticket.event),
  );
}

function pairingFails(row) {
  return (
    row.parentHoldsRepo === true &&
    row.childIsWorktreeOfParentRepo === true &&
    row.parentClaudeMdLoaded === false
  );
}

function isLodged(row) {
  if (row.cutaway) return false;
  if (pairingFails(row)) return false;
  const parentArrived =
    row.parentClaudeMdLoaded === true &&
    !row.missingWords.includes(PARENT_WORD_WORKTREE);
  if (row.childIsWorktreeOfParentRepo && parentArrived) return true;
  if (
    row.childIsWorktreeOfParentRepo &&
    row.loadedWords.includes(PARENT_WORD_WORKTREE)
  ) {
    return true;
  }
  if (
    !row.childIsWorktreeOfParentRepo &&
    row.parentClaudeMdLoaded &&
    row.childIsPlain
  ) {
    return false;
  }
  return (
    parentArrived &&
    row.childIsWorktreeOfParentRepo === true &&
    !row.missingWords.includes(PARENT_WORD_WORKTREE)
  );
}

function isBypassed(row) {
  if (pairingFails(row)) return true;
  const parentWordGone =
    row.missingWords.includes(PARENT_WORD_WORKTREE) ||
    (row.parentWord === PARENT_WORD_WORKTREE &&
      !row.loadedWords.includes(PARENT_WORD_WORKTREE));
  if (
    row.parentHoldsRepo &&
    row.childIsWorktreeOfParentRepo &&
    parentWordGone &&
    row.parentClaudeMdLoaded === false
  ) {
    return true;
  }
  return false;
}

function isCutaway(row) {
  return row.cutaway === true && !isLodged(row);
}

/**
 * Score one mezzanine seating against the entresol booth.
 * lodged: parent CLAUDE.md reaches the worktree session.
 * bypassed: parent CLAUDE.md absent for worktree child of that parent's repository.
 * cutaway: named path — the mezzanine floor is cut away.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isCutaway(row)) {
    verdict = "cutaway";
  } else if (isBypassed(row)) {
    verdict = "bypassed";
  } else if (isLodged(row)) {
    verdict = "lodged";
  } else if (row.childIsPlain && row.parentClaudeMdLoaded) {
    verdict = "case-c-plain-child";
  } else if (
    row.parentIsWorktreeOfDifferentRepo &&
    row.parentClaudeMdLoaded
  ) {
    verdict = "worktree-of-different-repo-ok";
  } else if (
    row.childIsWorktree &&
    !row.childIsWorktreeOfParentRepo &&
    row.parentClaudeMdLoaded
  ) {
    verdict = "worktree-elsewhere-ok";
  } else if (
    row.parentHoldsRepo &&
    !row.childIsWorktreeOfParentRepo &&
    !row.childIsWorktree &&
    row.parentClaudeMdLoaded
  ) {
    verdict = "bare-parent-alone-ok";
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
    lodged: verdict === "lodged",
    bypassed: verdict === "bypassed" || verdict === SEEDED_WORD,
    cutaway: verdict === "cutaway" || verdict === PATH_WORD,
    parentHoldsRepo: row.parentHoldsRepo,
    childIsWorktreeOfParentRepo: row.childIsWorktreeOfParentRepo,
    childIsWorktree: row.childIsWorktree,
    childIsPlain: row.childIsPlain,
    parentIsWorktreeOfDifferentRepo: row.parentIsWorktreeOfDifferentRepo,
    parentClaudeMdLoaded: row.parentClaudeMdLoaded,
    parentDotClaudeLoaded: row.parentDotClaudeLoaded,
    ancestorsAboveLoaded: row.ancestorsAboveLoaded,
    loadedWords: row.loadedWords,
    missingWords: row.missingWords,
    childWord: row.childWord,
    parentWord: row.parentWord,
    noSymlinks: row.noSymlinks,
    freshSession: row.freshSession,
    event: row.event,
    t: row.t,
    pairing:
      row.parentHoldsRepo && row.childIsWorktreeOfParentRepo
        ? "parent-holds-repo+worktree-of-that-repo"
        : "not-the-failing-pair",
    phrase: hold ? "admit lodged" : "score bypassed",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : ENTRESOL_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const bypassed = scored.filter((row) => row.verdict === "bypassed");
  const cutaway = scored.filter((row) => row.verdict === "cutaway");
  const lodged = scored.filter((row) => row.verdict === "lodged");
  const headline =
    scored.find((row) => row.event === "case-d-worktree-child") ||
    scored.find((row) => row.event === "parent-dot-claude-also-skipped") ||
    scored.find((row) => row.event === "cutaway") ||
    bypassed[bypassed.length - 1];
  let verdict = "lodged";
  if (bypassed.length) verdict = "bypassed";
  else if (cutaway.length && !lodged.length) verdict = "cutaway";
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
    bypassedCount: bypassed.length,
    cutawayCount: cutaway.length,
    lodgedCount: lodged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit lodged" : "score bypassed",
    note: headline
      ? "parent CLAUDE.md absent for worktree child of that parent's repository; zorb-parent-WORKTREE does not appear; ancestors above still load; plain child of the same parent still loads zorb-parent-PLAIN"
      : "published entresol walk scored against lodged vs bypassed",
  };
}

export function scoreCaseMatrix(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.matrix)
    ? ticket.matrix
    : SIX_FIXTURE_MATRIX;
  const scored = rows.map((row) => {
    const gate = scoreGate({
      ...row,
      parentClaudeMdLoaded: row.fails ? false : true,
      parentDotClaudeLoaded: row.fails ? false : true,
      loadedWords: row.fails
        ? [CHILD_WORD_D]
        : row.childIsPlain
          ? [CHILD_WORD_C, PARENT_WORD_PLAIN]
          : [PARENT_WORD_PLAIN],
      missingWords: row.fails ? [PARENT_WORD_WORKTREE] : [],
      preferSeed: false,
    });
    return {
      ...row,
      verdict: row.fails ? (row.parentDotClaude ? "parent-dot-claude-also-skipped" : "bypassed") : gate.verdict === "bypassed" ? "lodged" : gate.verdict,
      fails: row.fails === true,
    };
  });
  const failing = scored.filter((row) => row.fails);
  const onlyPairingFails = failing.every(
    (row) => row.parentHoldsRepo && row.childIsWorktreeOfParentRepo,
  );
  return {
    verdict: "fixtures",
    onlyPairingFails,
    failingCount: failing.length,
    okCount: scored.length - failing.length,
    rows: scored,
    phrase: "score bypassed",
    note: "six fixtures: only the pairing parent-holds-bare-repository + child-is-worktree-of-THAT-repository fails",
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
    seeded !== "lodged" &&
    seeded !== "bypassed" &&
    seeded !== "cutaway" &&
    ticket.parentHoldsRepo == null &&
    ticket.childIsWorktreeOfParentRepo == null &&
    ticket.parentClaudeMdLoaded == null &&
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
    parentClaudeMdLoaded: scored.parentClaudeMdLoaded ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.childIsWorktreeOfParentRepo ? "child=worktree-of-parent-repo" : "child=not-that-pairing",
    result.parentClaudeMdLoaded ? "parent=loaded" : "parent=absent",
    result.parentDotClaudeLoaded ? "dot=loaded" : "dot=absent",
    result.loadedWords && result.loadedWords.includes(PARENT_WORD_WORKTREE)
      ? "word=zorb-parent-WORKTREE"
      : result.loadedWords && result.loadedWords.includes(PARENT_WORD_PLAIN)
        ? "word=zorb-parent-PLAIN"
        : "word=parent-missing",
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
      darwin: DARWIN,
      macos: MACOS,
      versions: [...VERSIONS],
      modes: [...MODES],
      docs: DOCS,
      noSymlinks: NO_SYMLINKS,
      freshSessionsOnly: FRESH_SESSIONS_ONLY,
      workaround: WORKAROUND,
      parentWordWorktree: PARENT_WORD_WORKTREE,
      parentWordPlain: PARENT_WORD_PLAIN,
      childWordD: CHILD_WORD_D,
      childWordC: CHILD_WORD_C,
      cousins: COUSINS.map((row) => row.issue),
      expected: [
        "read recursively from cwd up to but not including /",
        "load CLAUDE.md in the directory directly above a git worktree when that directory holds the worktree's repository",
        "load parent/.claude/CLAUDE.md in the same shape",
        "do not skip only the pairing parent-holds-repo + child-is-worktree-of-that-repo",
      ],
      hypothesis:
        "memory walk may treat the worktree's gitdir/parent boundary as a stop so the directory holding the bare repository is skipped even though docs say every ancestor is read",
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
