#!/usr/bin/env node
/**
 * Mortmain — medieval muniment-room / dead-hand charter booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * the booth should keep tracked agent-config paths freehold (git can
 * check them out; tree matches HEAD; no phantom authorship). Instead
 * sandbox denyWithinAllow treats version-controlled .claude/** as
 * agent config and blocks writes, so git switch leaves a half-updated
 * tree that looks like deliberate WIP.
 *
 *   node mortmain.mjs data/mortmain.json
 *   echo '{"seed":"mortmain"}' | node mortmain.mjs
 *
 * Idle word is freehold (HOLD: tracked .claude paths alienable; git
 * can checkout; tree matches HEAD; no authorless diffs).
 * Seeded word is mortmain (#93173: denyWithinAllow freezes writes
 * under tracked .claude/skills, .claude/hooks, .claude/settings.json;
 * switch cannot unlink; HEAD may stay behind; phantoms appear).
 * Path word is phantom (named path — authorless diffs after a
 * half-updated tree; later sessions treat them as real work).
 *
 * Encoded from anthropics/claude-code#93173 issue body only.
 * Hypothesis (NON-BINDING): denyWithinAllow lists repo-relative
 * agent-config paths and never reconciles them against git ls-files,
 * so a version-controlled .claude file is treated as agent config and
 * git cannot unlink it. Verify against #93173 text only. Do NOT claim
 * a root cause in Claude Code source you have not seen. Do NOT
 * implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "freehold",
  "mortmain",
  "phantom",
  "hold",
  "deny-within-allow",
  "tracked-claude-paths",
  "unlink-denied",
  "head-behind",
  "authorless-diff",
  "silent-warning",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "freehold";
export const PATH_WORD = "phantom";
export const SEEDED_WORD = "mortmain";
export const HOLD = Object.freeze(["freehold", "hold"]);
export const RECOVER = Object.freeze(["freehold", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "mortmain"),
);

export const FEATURED_ISSUE = 93173;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93173";
export const TITLE =
  "Bash sandbox denies writes to /.claude/ paths, silently corrupting the git working tree in repos that track files there";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "area:sandbox",
]);
export const AUTHOR = "jakes-space";
export const FILED = "2026-09-09T19:14:43Z";
export const CLAUDE_VERSION = "2.1.255";
export const SURFACE = "desktop app (Code tab)";
export const OS = "macOS 15.7.9 arm64";
export const GIT_VERSION = "2.50.1";
export const SANDBOX_ENABLED = true;
export const AUTO_ALLOW_BASH = true;
export const TRACKED_SKILL_COUNT = 12;
export const STAGED_PHANTOM_COUNT = 488;
export const TOUCH_DENIED = "Operation not permitted";
export const UNLINK_WARNING =
  "warning: unable to unlink '.claude/skills/<skill>/SKILL.md': Operation not permitted";
export const CONFIG_LOCK_ERROR =
  "error: could not lock config file <repo>/.git/config: Operation not permitted";
export const PHRASE =
  "when denyWithinAllow freezes tracked .claude paths so git cannot unlink them and the tree fills with authorless diffs, mortmain never stays freehold — score mortmain or admit freehold.";

export const DENIED_PATHS = Object.freeze([
  "<worktree>/.claude/skills",
  "<worktree>/.claude/hooks",
  "<worktree>/.claude/settings.json",
]);

export const CHEST_DRAWERS = Object.freeze([
  {
    id: "skills",
    path: ".claude/skills",
    kind: "tracked-dir",
    files: 12,
    note: "pnpm monorepo shares skill definitions through the repo",
  },
  {
    id: "hooks",
    path: ".claude/hooks",
    kind: "tracked-dir",
    files: null,
    note: "denyWithinAllow treats hooks as agent config",
  },
  {
    id: "settings",
    path: ".claude/settings.json",
    kind: "tracked-file",
    files: 1,
    note: "repo-relative settings frozen by the dead hand",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "denyWithinAllow",
  "unable to unlink '.claude/skills",
  "Operation not permitted",
  "could not lock config file",
  "git rev-parse --abbrev-ref HEAD still reports the old branch",
  "488 files then showed as staged changes",
  "plain git switch recovers HEAD",
  "authorless",
  "sandbox.enabled: true",
]);

export const COUSINS = Object.freeze([
  {
    issue: 53891,
    title:
      "sandbox write-deny on .claude/commands blocks git worktree/checkout for tracked slash commands",
    state: "CLOSED",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin from the #93173 brief — write-deny on tracked .claude/commands blocks worktree/checkout; different path family; do not rebuild",
  },
  {
    issue: 85072,
    title:
      "sandbox auto write-protection of .claude/skills undocumented / cannot lift via allowWrite",
    state: "CLOSED",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin — undocumented auto-protect of .claude/skills; cannot lift via allowWrite; do not rebuild",
  },
  {
    issue: 54189,
    title:
      "CLI sandbox intercepts .claude/** writes even when permission-prompt-tool grants",
    state: "CLOSED",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin — CLI sandbox intercepts .claude/** writes after a grant; do not rebuild",
  },
  {
    issue: 79945,
    title:
      "sandbox write-deny on .claude/.cc-writes prevents git worktree removal after ExitWorktree",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin — .claude/.cc-writes deny blocks worktree removal after ExitWorktree; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93182,
    title: "server-side tools unblockable",
    state: "OPEN",
    citeOnly: true,
    why: "server-side tools unblockable — backup, not primary; cite in data only",
  },
  {
    issue: 93219,
    title: "Vernier macOS effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — macOS effort slider inert — backup, not primary; cite in data only",
  },
  {
    issue: 93207,
    title: "iOS plan approval setMode auto discards prePlanMode",
    state: "OPEN",
    citeOnly: true,
    why: "iOS plan approval setMode auto discards prePlanMode — backup, not primary; cite in data only",
  },
  {
    issue: 93198,
    title: "Cedilla accented path file panel",
    state: "OPEN",
    citeOnly: true,
    why: "Cedilla accented path file panel — backup, not primary; cite in data only",
  },
  {
    issue: 93177,
    title: "opusplan stays on Opus after exiting plan mode",
    state: "OPEN",
    citeOnly: true,
    why: "opusplan stays on Opus after exiting plan mode — backup, not primary; cite in data only",
  },
  {
    issue: 93210,
    title: "sidebar groups stale order key",
    state: "OPEN",
    citeOnly: true,
    why: "sidebar groups stale order key — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "oubliette",
  "ephemera",
  "embrasure",
]);

/**
 * Conceptual iron chest — drawers for tracked .claude paths the
 * muniment room should keep alienable (freehold).
 */
export function readChest(drawers = CHEST_DRAWERS) {
  return {
    drawers: drawers.length,
    paths: drawers.map((row) => row.path),
    ids: drawers.map((row) => row.id),
    trackedSkills: TRACKED_SKILL_COUNT,
    kinds: drawers.map((row) => row.kind),
  };
}

/**
 * Conceptual wax seal — freehold (can alienate / git can checkout)
 * vs mortmain (dead hand freezes writes under tracked .claude).
 */
export function readSeal(input = {}) {
  const deny = input.denyWithinAllow === true;
  const tracked = input.trackedClaudePaths !== false;
  const frozen = deny && tracked;
  return {
    freehold: !frozen,
    frozen,
    lamp: frozen ? "mortmain" : "freehold",
    denyWithinAllow: deny,
    trackedClaudePaths: tracked,
    touchDenied: frozen ? TOUCH_DENIED : null,
    touchElsewhereOk: true,
  };
}

export function compareDeed(input = {}) {
  const chest = readChest(input.drawers || CHEST_DRAWERS);
  const seal = readSeal(input);
  const unlinkDenied = input.unlinkDenied === true || seal.frozen;
  const headBehind = input.headBehind === true;
  const authorless = input.authorlessDiff === true || headBehind;
  const deadHand = seal.frozen && unlinkDenied;
  return {
    chest,
    seal,
    unlinkDenied,
    headBehind,
    authorless,
    deadHand,
    cue: deadHand ? "mortmain" : "freehold",
  };
}

/**
 * Published mortmain walk from #93173 only. Facts from the issue body.
 * A freehold booth keeps tracked .claude paths alienable. A mortmain
 * booth freezes them so git cannot unlink and the tree fills with
 * authorless diffs.
 */
export const MORTMAIN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-freehold",
    freehold: true,
    trackedClaudePaths: true,
    denyWithinAllow: false,
    unlinkDenied: false,
    headBehind: false,
    authorlessDiff: false,
    silentWarning: false,
    sandboxEnabled: true,
    cue: "freehold",
    note: "idle HOLD: tracked .claude paths alienable; git can checkout; tree matches HEAD; no phantom authorship",
  },
  {
    t: "deny",
    event: "deny-within-allow",
    denyWithinAllow: true,
    sandboxEnabled: true,
    trackedClaudePaths: true,
    cue: "mortmain",
    note: "sandbox denyWithinAllow lists repo-relative .claude/skills, .claude/hooks, .claude/settings.json",
  },
  {
    t: "tracked",
    event: "tracked-claude-paths",
    trackedClaudePaths: true,
    denyWithinAllow: true,
    sandboxEnabled: true,
    cue: "mortmain",
    note: "pnpm monorepo tracks ~12 files under .claude/skills/** as ordinary version-controlled content",
  },
  {
    t: "touch",
    event: "touch-denied",
    denyWithinAllow: true,
    trackedClaudePaths: true,
    touchDenied: true,
    cue: "mortmain",
    note: "touch <worktree>/.claude/skills/sandbox-write-probe → Operation not permitted; touch elsewhere succeeds",
  },
  {
    t: "switch",
    event: "unlink-denied",
    unlinkDenied: true,
    denyWithinAllow: true,
    trackedClaudePaths: true,
    cue: "mortmain",
    note: "git switch -c my-branch origin/some-branch → unable to unlink .claude/skills/**; may fail locking .git/config",
  },
  {
    t: "head",
    event: "head-behind",
    headBehind: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    trackedClaudePaths: true,
    cue: "mortmain",
    note: "rev-parse still reports the old branch while the working tree has been updated",
  },
  {
    t: "diffs",
    event: "authorless-diff",
    authorlessDiff: true,
    headBehind: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    stagedPhantoms: STAGED_PHANTOM_COUNT,
    cue: "mortmain",
    note: "hundreds of staged phantoms; git records no author; later sessions treat them as real work",
  },
  {
    t: "warn",
    event: "silent-warning",
    silentWarning: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    cue: "mortmain",
    note: "step exits in a way that reads as success apart from warning: lines; only signal is a warning inside one tool call",
  },
  {
    t: "cut",
    event: "mortmain",
    freehold: false,
    trackedClaudePaths: true,
    denyWithinAllow: true,
    unlinkDenied: true,
    headBehind: true,
    authorlessDiff: true,
    silentWarning: true,
    sandboxEnabled: true,
    cue: "mortmain",
    note: "dead hand freezes tracked .claude paths; score mortmain",
  },
  {
    t: "path",
    event: "phantom",
    phantom: true,
    cue: "mortmain",
    note: "when denyWithinAllow freezes tracked .claude paths so git cannot unlink them and the tree fills with authorless diffs, phantom never stays freehold",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    freehold: true,
    trackedClaudePaths: true,
    denyWithinAllow: false,
    unlinkDenied: false,
    headBehind: false,
    authorlessDiff: false,
    silentWarning: false,
    sandboxEnabled: true,
    touchDenied: false,
    cue: "freehold",
  };
}

export function seedFreehold() {
  return { ...emptyTicket() };
}

export function seedMortmain() {
  return {
    seed: SEEDED_WORD,
    freehold: false,
    trackedClaudePaths: true,
    denyWithinAllow: true,
    unlinkDenied: true,
    headBehind: true,
    authorlessDiff: true,
    silentWarning: true,
    sandboxEnabled: true,
    touchDenied: true,
    cue: "mortmain",
    issue: FEATURED_ISSUE,
  };
}

export function seedPhantom() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    phantom: true,
    cue: "mortmain",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    freehold: true,
    trackedClaudePaths: true,
    cue: "freehold",
  };
}

export function seedDenyWithinAllow() {
  return {
    seed: "deny-within-allow",
    denyWithinAllow: true,
    sandboxEnabled: true,
    trackedClaudePaths: true,
    cue: "mortmain",
  };
}

export function seedTrackedClaudePaths() {
  return {
    seed: "tracked-claude-paths",
    trackedClaudePaths: true,
    denyWithinAllow: true,
    sandboxEnabled: true,
    cue: "mortmain",
  };
}

export function seedUnlinkDenied() {
  return {
    seed: "unlink-denied",
    unlinkDenied: true,
    denyWithinAllow: true,
    trackedClaudePaths: true,
    cue: "mortmain",
  };
}

export function seedHeadBehind() {
  return {
    seed: "head-behind",
    headBehind: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    trackedClaudePaths: true,
    cue: "mortmain",
  };
}

export function seedAuthorlessDiff() {
  return {
    seed: "authorless-diff",
    authorlessDiff: true,
    headBehind: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    cue: "mortmain",
  };
}

export function seedSilentWarning() {
  return {
    seed: "silent-warning",
    silentWarning: true,
    unlinkDenied: true,
    denyWithinAllow: true,
    cue: "mortmain",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      freehold: false,
      trackedClaudePaths: false,
      denyWithinAllow: false,
      unlinkDenied: false,
      headBehind: false,
      authorlessDiff: false,
      silentWarning: false,
      sandboxEnabled: false,
      touchDenied: false,
      phantom: false,
      stagedPhantoms: 0,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    freehold: raw.freehold === true,
    trackedClaudePaths: raw.trackedClaudePaths === true,
    denyWithinAllow: raw.denyWithinAllow === true,
    unlinkDenied: raw.unlinkDenied === true,
    headBehind: raw.headBehind === true,
    authorlessDiff: raw.authorlessDiff === true,
    silentWarning: raw.silentWarning === true,
    sandboxEnabled: raw.sandboxEnabled === true,
    touchDenied: raw.touchDenied === true,
    phantom: raw.phantom === true,
    stagedPhantoms: Number(raw.stagedPhantoms) || 0,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.freehold != null ||
        ticket.trackedClaudePaths != null ||
        ticket.denyWithinAllow != null ||
        ticket.unlinkDenied != null ||
        ticket.headBehind != null ||
        ticket.authorlessDiff != null ||
        ticket.silentWarning != null ||
        ticket.phantom != null ||
        ticket.touchDenied != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isFreehold(row) {
  if (row.phantom) return false;
  if (row.cue === "mortmain") return false;
  if (row.denyWithinAllow && row.trackedClaudePaths && row.freehold !== true) {
    return false;
  }
  if (row.unlinkDenied && row.denyWithinAllow) return false;
  if (
    row.freehold === true &&
    row.denyWithinAllow !== true &&
    row.cue !== "mortmain"
  ) {
    return true;
  }
  if (
    row.cue === "freehold" &&
    row.denyWithinAllow !== true &&
    row.unlinkDenied !== true
  ) {
    return true;
  }
  return false;
}

function isMortmain(row) {
  if (row.phantom && row.cue !== "freehold") return false;
  if (row.cue === "mortmain") return true;
  if (row.denyWithinAllow && row.trackedClaudePaths && row.unlinkDenied) {
    return true;
  }
  if (row.denyWithinAllow && row.headBehind) return true;
  if (row.denyWithinAllow && row.authorlessDiff) return true;
  if (row.denyWithinAllow && row.touchDenied && row.trackedClaudePaths) {
    return true;
  }
  if (row.unlinkDenied && row.headBehind && row.authorlessDiff) return true;
  return false;
}

function isPhantomPath(row) {
  return row.phantom === true && !isFreehold(row);
}

/**
 * Score one charter pass against the mortmain booth.
 * freehold: tracked .claude paths alienable; git can checkout; tree matches HEAD.
 * mortmain: denyWithinAllow freezes tracked .claude; unlink denied; HEAD may lag.
 * phantom: named path — authorless diffs after a half-updated tree.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isPhantomPath(row)) {
    verdict = "phantom";
  } else if (isMortmain(row)) {
    verdict = "mortmain";
  } else if (isFreehold(row)) {
    verdict = "freehold";
  } else if (
    row.denyWithinAllow ||
    row.unlinkDenied ||
    row.headBehind ||
    row.authorlessDiff ||
    row.silentWarning ||
    row.touchDenied
  ) {
    verdict = "mortmain";
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
    freehold: verdict === "freehold",
    mortmain: verdict === "mortmain" || verdict === SEEDED_WORD,
    phantom: verdict === "phantom" || verdict === PATH_WORD,
    trackedClaudePaths: row.trackedClaudePaths,
    denyWithinAllow: row.denyWithinAllow,
    unlinkDenied: row.unlinkDenied,
    headBehind: row.headBehind,
    authorlessDiff: row.authorlessDiff,
    silentWarning: row.silentWarning,
    sandboxEnabled: row.sandboxEnabled,
    touchDenied: row.touchDenied,
    stagedPhantoms: row.stagedPhantoms,
    cue: hold ? "freehold" : "mortmain",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit freehold" : "score mortmain",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : MORTMAIN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const mortmain = scored.filter((row) => row.verdict === "mortmain");
  const phantom = scored.filter((row) => row.verdict === "phantom");
  const freehold = scored.filter((row) => row.verdict === "freehold");
  const headline =
    scored.find((row) => row.event === "mortmain") ||
    scored.find((row) => row.event === "authorless-diff") ||
    scored.find((row) => row.event === "unlink-denied") ||
    scored.find((row) => row.event === "phantom") ||
    mortmain[mortmain.length - 1];
  let verdict = "freehold";
  if (mortmain.length) verdict = "mortmain";
  else if (phantom.length && !freehold.length) verdict = "phantom";
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
    mortmainCount: mortmain.length,
    phantomCount: phantom.length,
    freeholdCount: freehold.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit freehold" : "score mortmain",
    note: headline
      ? "denyWithinAllow freezes tracked .claude paths; git cannot unlink; HEAD may lag; authorless diffs."
      : "published mortmain walk scored against freehold vs mortmain",
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
    seeded !== "freehold" &&
    seeded !== "mortmain" &&
    seeded !== "phantom" &&
    ticket.freehold == null &&
    ticket.denyWithinAllow == null &&
    ticket.trackedClaudePaths == null &&
    ticket.unlinkDenied == null &&
    ticket.headBehind == null &&
    ticket.phantom == null &&
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
    freehold: scored.freehold ?? false,
    trackedClaudePaths: scored.trackedClaudePaths ?? false,
    denyWithinAllow: scored.denyWithinAllow ?? false,
    unlinkDenied: scored.unlinkDenied ?? false,
    headBehind: scored.headBehind ?? false,
    authorlessDiff: scored.authorlessDiff ?? false,
    silentWarning: scored.silentWarning ?? false,
    sandboxEnabled: scored.sandboxEnabled ?? false,
    touchDenied: scored.touchDenied ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.denyWithinAllow ? "deny=within-allow" : "deny=none",
    result.trackedClaudePaths ? "paths=tracked" : "paths=untracked",
    result.unlinkDenied ? "unlink=denied" : "unlink=ok",
    result.headBehind ? "head=behind" : "head=matches",
    result.authorlessDiff ? "diff=authorless" : "diff=none",
    result.silentWarning ? "warn=silent" : "warn=loud",
    result.cue === "freehold" ? "cue=freehold" : "cue=mortmain",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const deed = compareDeed({
    denyWithinAllow: result.denyWithinAllow,
    trackedClaudePaths: result.trackedClaudePaths !== false,
    unlinkDenied: result.unlinkDenied,
    headBehind: result.headBehind,
    authorlessDiff: result.authorlessDiff,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    deed,
    chest: readChest(),
    seal: readSeal({
      denyWithinAllow: result.denyWithinAllow,
      trackedClaudePaths: result.trackedClaudePaths !== false,
    }),
    drawers: CHEST_DRAWERS.map((row) => ({
      ...row,
      frozen: result.denyWithinAllow === true || result.verdict === "mortmain",
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
      sandboxEnabled: SANDBOX_ENABLED,
      autoAllowBash: AUTO_ALLOW_BASH,
      trackedSkillCount: TRACKED_SKILL_COUNT,
      stagedPhantomCount: STAGED_PHANTOM_COUNT,
      touchDenied: TOUCH_DENIED,
      unlinkWarning: UNLINK_WARNING,
      configLockError: CONFIG_LOCK_ERROR,
      deniedPaths: [...DENIED_PATHS],
      drawers: CHEST_DRAWERS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "do not deny tracked paths (reconcile deny vs git ls-files)",
        "or fail loud that the tree may disagree with HEAD",
        "a denied write inside a git invocation should not look like success plus warning:",
        "fresh session worktrees should not inherit authorless phantom diffs",
      ],
      hypothesis:
        "NON-BINDING: denyWithinAllow lists repo-relative agent-config paths and never reconciles them against git ls-files, so a version-controlled .claude file is treated as agent config and git cannot unlink it",
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
