/**
 * Berth — harbour quay desk for a
 * real Claude Code defect: spawn_task
 * chip sessions run in the spawning
 * session's working tree, not an
 * isolated worktree, while the
 * spawning session is still editing
 * that tree.
 *
 * A shared berth is not a hold.
 * Score the quay or admit alongside.
 *
 * Primary #90668: OPEN, filed
 * 2026-08-30, labels bug /
 * platform:macos / area:agents /
 * area:desktop. Title: spawn_task
 * chip runs in the spawning session's
 * working tree, not an isolated
 * worktree — while that session is
 * still editing it.
 *
 * Minimal repro: parent session in
 * ~/code/wolverine calls spawn_task;
 * model-facing text promises a fresh
 * worktree / "chip … start it in a
 * fresh worktree"; user is told a
 * separate local session started;
 * git worktree list shows no new
 * worktree; chip edits appear as
 * interleaved uncommitted files in
 * the parent's tree; chip can create
 * a branch and switch the shared
 * checkout out from under the parent.
 *
 * Same-class nearby (scoreable, not
 * the primary):
 *   #77263 spawn_task text promises
 *     a "fresh worktree" (cwd param
 *     + ack), but chip sessions start
 *     on the primary checkout even
 *     with cwd set to a git repo.
 *   #79234 Chip/spawn_task creates
 *     .claude/worktrees/<name> that
 *     is often NOT a real git
 *     worktree; git checkout -b
 *     claude/<name> runs in the
 *     PARENT repo and silently flips
 *     the shared main checkout
 *     (Windows).
 *
 * Related, different (label, do not
 * treat as this bug):
 *   #90638 Fascia — Trust dialog on
 *     "Start with worktree" *names*
 *     the spawn_task cwd while the
 *     session *does* run in a new
 *     .claude/worktrees path
 *     (consent ≠ execution site).
 *     Berth is when isolation never
 *     happens and both sessions
 *     share one tree.
 *   #90661 Carrel — preview_start
 *     resolves launch.json from
 *     session cwd across concurrent
 *     worktree lanes. Berth is
 *     filesystem cohabitation of
 *     chip vs parent, not launch.json.
 *   #86691 / #81213 — UI preference
 *     / recommend local vs worktree
 *     (feature/UX), not the broken
 *     promise.
 *   #89940 — git status snapshot of
 *     staged deletions inside a
 *     worktree that *does* exist.
 *
 * Cross-ecosystem nearby, not
 * identical:
 *   openai/codex#31572 Desktop
 *     subagents drift across Git
 *     branches in a shared workspace.
 *   openai/codex#33144 Named
 *     subagents intermittently ignore
 *     the requested worktree.
 *   openai/codex#18969 Support cwd
 *     for spawn_agent (child inherits
 *     parent cwd).
 *
 * Verdicts: alongside | cohabited |
 *           promised-fresh | same-floor |
 *           branch-stolen | interleaved |
 *           chip-lied | primary-dock |
 *           cwd-ignored | phantom-tree |
 *           off-quay
 * Idle word is alongside (vessel
 * alone in its allotted berth / real
 * isolated worktree; hold is quiet).
 * NEVER use berth / empty / silent /
 * mute / idle / seated / credited /
 * level / verbatim / fronted / locked /
 * yanked / caught / stowed / posted /
 * bunged / belayed / rove / keyed /
 * housed / beamed / snug / hung /
 * appointed / cinched / gauged /
 * stamped / overrun / pratique /
 * wound / bound / stilled / stabled /
 * drained / flat / fit / spoilt /
 * laid / unlinked / tight / banked /
 * roosted / stocked / heard / clear /
 * paired / kernel / latched / upheld /
 * sterling / home / valid / dry /
 * quiet / seised / rung / moored /
 * or the rest of the catalog idle
 * list as the idle word.
 *
 * Slack alarm + Linear ticket on
 * cohabited / promised-fresh /
 * same-floor / branch-stolen /
 * interleaved / chip-lied /
 * primary-dock / cwd-ignored /
 * phantom-tree.
 * GitHub berth-ledger of scored
 * berths on every score.
 *
 * Priority when multiple match:
 *   off-quay > branch-stolen >
 *   interleaved > cohabited >
 *   phantom-tree > cwd-ignored >
 *   primary-dock > chip-lied >
 *   promised-fresh > same-floor >
 *   alongside
 *
 * alongside is true ONLY when the
 * verdict is alongside. A cohabited
 * berth is never alongside.
 *
 * Why this is not a clone:
 * NOT Carrel — launch.json session-cwd
 *     #90661.
 * NOT Fascia — trust-path consent lie
 *     #90638; worktree exists, dialog
 *     misnames.
 * NOT Byline — phantom hook agent_id
 *     #90662.
 * NOT Datum / Calque / Quoin / Gaff /
 *     Sear / Cubby / Grille / Spile /
 *     Bollard / Clew / Wicket / Hasp.
 * NOT leftover woodworking /
 *     millimetre-slider.
 * Different problem: spawn_task chip
 * docks in the parent's working tree
 * despite promising a fresh worktree.
 * Different UI: harbour / quay /
 * berth board.
 * Different idle: alongside.
 */

export const VERDICTS = Object.freeze([
  "alongside",
  "cohabited",
  "promised-fresh",
  "same-floor",
  "branch-stolen",
  "interleaved",
  "chip-lied",
  "primary-dock",
  "cwd-ignored",
  "phantom-tree",
  "off-quay",
]);
export const IDLE_WORD = "alongside";
export const SLACK_VERDICTS = Object.freeze([
  "cohabited",
  "promised-fresh",
  "same-floor",
  "branch-stolen",
  "interleaved",
  "chip-lied",
  "primary-dock",
  "cwd-ignored",
  "phantom-tree",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90668;
export const NEARBY_77263 = 77263;
export const NEARBY_79234 = 79234;
export const RELATED_FASCIA = 90638;
export const RELATED_CARREL = 90661;
export const RELATED_86691 = 86691;
export const RELATED_81213 = 81213;
export const RELATED_89940 = 89940;
export const CODEX_BRANCH_DRIFT = 31572;
export const CODEX_IGNORE_WORKTREE = 33144;
export const CODEX_SPAWN_CWD = 18969;

export const DEMO_PARENT_CWD = "/Users/ada/code/wolverine";
export const DEMO_CHIP_ISOLATED =
  "/Users/ada/code/wolverine/.claude/worktrees/task_2abc4d00";
export const DEMO_HAND_WORKTREE = "/private/tmp/wolv-4191";
export const DEMO_TASK = "task_2abc4d00";
export const DEMO_TASK_B = "task_1682a38c";
export const DEMO_BRANCH_PARENT = "gh-4188-feature";
export const DEMO_BRANCH_CHIP = "claude/task_2abc4d00";
export const DEMO_77263_PARENT = "/Users/ada/dev";
export const DEMO_77263_CWD = "/Users/ada/dev/app";
export const DEMO_79234_PARENT = "/Users/ada/src/harbour";
export const DEMO_79234_PHANTOM =
  "/Users/ada/src/harbour/.claude/worktrees/cool-williamson-7441df";
export const DEMO_79234_BRANCH = "claude/cool-williamson-7441df";
export const DEMO_INTERLEAVED = Object.freeze([
  "src/ChipTouchedA.cs",
  "src/ChipTouchedB.cs",
  "src/ChipTouchedC.cs",
]);
export const DEMO_VERSION = "spawn_task";
export const DEMO_DAY = "2026-08-30";

const FORBIDDEN_IDLE = Object.freeze([
  "berth",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "bound",
  "stilled",
  "stabled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "quiet",
  "seised",
  "rung",
  "moored",
  "carrel",
  "byline",
  "datum",
  "calque",
  "fascia",
  "wicket",
  "hasp",
  "iota",
  "cinch",
  "cubby",
  "tappet",
  "shunt",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asList(value) {
  if (Array.isArray(value)) return value.map((row) => asText(row)).filter(Boolean);
  if (value == null || value === "") return [];
  return [asText(value)].filter(Boolean);
}

export function normPath(value) {
  return asText(value).replace(/\\/g, "/").replace(/\/+$/, "");
}

export function pathUnder(child, parent) {
  const c = normPath(child);
  const p = normPath(parent);
  if (!c || !p) return false;
  return c === p || c.startsWith(`${p}/`);
}

export function emptyBerth() {
  return {
    session: "",
    issue: null,
    source: "",
    parentCwd: "",
    chipCwd: "",
    worktreeCreated: null,
    worktreeIsGit: null,
    branchBefore: "",
    branchAfter: "",
    promisedFresh: false,
    parentStillEditing: false,
    interleavedPaths: [],
    cwdParam: "",
    cwdIsGitRepo: null,
    toldSeparateSession: false,
    worktreeListBefore: [],
    worktreeListAfter: [],
    phantomPath: "",
    gitDir: "",
    gitCommonDir: "",
    gitToplevel: "",
    startedOnPrimary: false,
    parentUntouched: null,
    nearby: "",
    fasciaTrust: false,
    carrelLaunch: false,
    bylineGhost: false,
    datumWrongBase: false,
    wicketEscape: false,
    haspLease: false,
    issue86691: false,
    issue81213: false,
    issue89940: false,
    scored: false,
  };
}

export function cloneBerth(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.berth && typeof src.berth === "object"
      ? src.berth
      : src.probe && typeof src.probe === "object"
        ? src.probe
        : src.quay && typeof src.quay === "object"
          ? src.quay
          : src.dock && typeof src.dock === "object"
            ? src.dock
            : src;
  const spawn =
    nested.spawn_task && typeof nested.spawn_task === "object"
      ? nested.spawn_task
      : src.spawn_task && typeof src.spawn_task === "object"
        ? src.spawn_task
        : {};
  const base = emptyBerth();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    parentCwd: asText(nested.parentCwd || src.parentCwd || ""),
    chipCwd: asText(
      nested.chipCwd || src.chipCwd || spawn.cwd || spawn.chipCwd || "",
    ),
    worktreeCreated:
      nested.worktreeCreated ?? src.worktreeCreated ?? spawn.worktreeCreated ?? null,
    worktreeIsGit: nested.worktreeIsGit ?? src.worktreeIsGit ?? null,
    branchBefore: asText(nested.branchBefore || src.branchBefore || ""),
    branchAfter: asText(nested.branchAfter || src.branchAfter || ""),
    promisedFresh: asBool(
      nested.promisedFresh ?? src.promisedFresh ?? spawn.promisedFresh,
      false,
    ),
    parentStillEditing: asBool(
      nested.parentStillEditing ?? src.parentStillEditing,
      false,
    ),
    interleavedPaths: asList(nested.interleavedPaths ?? src.interleavedPaths),
    cwdParam: asText(nested.cwdParam || src.cwdParam || spawn.cwdParam || ""),
    cwdIsGitRepo: nested.cwdIsGitRepo ?? src.cwdIsGitRepo ?? null,
    toldSeparateSession: asBool(
      nested.toldSeparateSession ?? src.toldSeparateSession,
      false,
    ),
    worktreeListBefore: asList(nested.worktreeListBefore ?? src.worktreeListBefore),
    worktreeListAfter: asList(nested.worktreeListAfter ?? src.worktreeListAfter),
    phantomPath: asText(nested.phantomPath || src.phantomPath || ""),
    gitDir: asText(nested.gitDir || src.gitDir || ""),
    gitCommonDir: asText(nested.gitCommonDir || src.gitCommonDir || ""),
    gitToplevel: asText(nested.gitToplevel || src.gitToplevel || ""),
    startedOnPrimary: asBool(
      nested.startedOnPrimary ?? src.startedOnPrimary,
      false,
    ),
    parentUntouched: nested.parentUntouched ?? src.parentUntouched ?? null,
    nearby: asText(nested.nearby || src.nearby || ""),
    fasciaTrust: asBool(nested.fasciaTrust ?? src.fasciaTrust, false),
    carrelLaunch: asBool(nested.carrelLaunch ?? src.carrelLaunch, false),
    bylineGhost: asBool(nested.bylineGhost ?? src.bylineGhost, false),
    datumWrongBase: asBool(nested.datumWrongBase ?? src.datumWrongBase, false),
    wicketEscape: asBool(nested.wicketEscape ?? src.wicketEscape, false),
    haspLease: asBool(nested.haspLease ?? src.haspLease, false),
    issue86691: asBool(nested.issue86691 ?? src.issue86691, false),
    issue81213: asBool(nested.issue81213 ?? src.issue81213, false),
    issue89940: asBool(nested.issue89940 ?? src.issue89940, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

function listGrew(before, after) {
  return after.length > before.length;
}

function isLinkedWorktree(row, chipCwd) {
  if (row.worktreeIsGit === false) return false;
  if (row.worktreeIsGit === true && row.worktreeCreated === true) return true;
  const gitDir = normPath(row.gitDir);
  const common = normPath(row.gitCommonDir);
  const top = normPath(row.gitToplevel);
  if (gitDir && common && gitDir !== common && top && chipCwd && top === chipCwd) {
    return true;
  }
  return false;
}

export function isOffQuay(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  if (
    nearby === "fascia" ||
    nearby === "90638" ||
    nearby === "carrel" ||
    nearby === "90661" ||
    nearby === "byline" ||
    nearby === "90662" ||
    nearby === "datum" ||
    nearby === "wicket" ||
    nearby === "hasp" ||
    nearby === "86691" ||
    nearby === "81213" ||
    nearby === "89940"
  ) {
    return true;
  }
  return Boolean(
    row.fasciaTrust ||
      row.carrelLaunch ||
      row.bylineGhost ||
      row.datumWrongBase ||
      row.wicketEscape ||
      row.haspLease ||
      row.issue86691 ||
      row.issue81213 ||
      row.issue89940,
  );
}

export function isIdle(row = {}) {
  const probe = cloneBerth(row);
  return !(
    probe.parentCwd ||
    probe.chipCwd ||
    probe.worktreeCreated != null ||
    probe.worktreeIsGit != null ||
    probe.branchBefore ||
    probe.branchAfter ||
    probe.promisedFresh ||
    probe.parentStillEditing ||
    probe.interleavedPaths.length ||
    probe.cwdParam ||
    probe.cwdIsGitRepo != null ||
    probe.toldSeparateSession ||
    probe.worktreeListBefore.length ||
    probe.worktreeListAfter.length ||
    probe.phantomPath ||
    probe.gitDir ||
    probe.gitCommonDir ||
    probe.gitToplevel ||
    probe.startedOnPrimary ||
    probe.parentUntouched != null ||
    probe.nearby ||
    isOffQuay(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneBerth(input);
  const parentCwd = normPath(row.parentCwd);
  const chipCwd = normPath(row.chipCwd);
  const cwdParam = normPath(row.cwdParam);
  const phantomPath = normPath(row.phantomPath);
  const gitToplevel = normPath(row.gitToplevel);
  const gitDir = normPath(row.gitDir);
  const gitCommonDir = normPath(row.gitCommonDir);
  const sameFloor = Boolean(parentCwd && chipCwd && parentCwd === chipCwd);
  const worktreeOk = isLinkedWorktree(row, chipCwd);
  const worktreeMade = row.worktreeCreated === true;
  const worktreeMissing = row.worktreeCreated === false || (!worktreeMade && !worktreeOk);
  const listUnchanged =
    row.worktreeListBefore.length > 0 &&
    row.worktreeListAfter.length > 0 &&
    !listGrew(row.worktreeListBefore, row.worktreeListAfter);
  const branchMoved = Boolean(
    row.branchBefore &&
      row.branchAfter &&
      row.branchBefore !== row.branchAfter,
  );
  const interleaved = row.interleavedPaths.length > 0 && row.parentStillEditing;
  const parentUntouched = Boolean(
    row.parentUntouched === true ||
      (!interleaved &&
        !branchMoved &&
        worktreeOk &&
        chipCwd &&
        parentCwd &&
        chipCwd !== parentCwd),
  );

  const offQuay = isOffQuay(row);
  const branchStolen = Boolean(branchMoved && !worktreeOk);
  const interleavedHold = Boolean(interleaved && (sameFloor || !worktreeOk));
  const cohabited = Boolean(sameFloor && row.parentStillEditing && !worktreeOk);
  const phantomTree = Boolean(
    (phantomPath || /\.claude\/worktrees\//.test(chipCwd)) &&
      row.worktreeIsGit === false &&
      (gitToplevel === parentCwd ||
        (gitDir && gitCommonDir && gitDir === gitCommonDir) ||
        row.worktreeCreated === true),
  );
  const cwdIgnored = Boolean(
    cwdParam &&
      row.cwdIsGitRepo !== false &&
      worktreeMissing &&
      !worktreeOk,
  );
  const primaryDock = Boolean(row.startedOnPrimary && worktreeMissing && !worktreeOk);
  const chipLied = Boolean(
    (row.toldSeparateSession || row.promisedFresh) &&
      !worktreeOk &&
      sameFloor &&
      !row.startedOnPrimary,
  );
  const promisedFresh = Boolean(row.promisedFresh && worktreeMissing && !worktreeOk);
  const alongsideHold = Boolean(
    worktreeOk &&
      chipCwd &&
      parentCwd &&
      chipCwd !== parentCwd &&
      parentUntouched &&
      !offQuay,
  );

  let eventClass = "idle";
  if (offQuay) eventClass = "off-quay";
  else if (branchStolen) eventClass = "branch-stolen";
  else if (interleavedHold) eventClass = "interleaved";
  else if (cohabited) eventClass = "cohabited";
  else if (phantomTree) eventClass = "phantom-tree";
  else if (cwdIgnored) eventClass = "cwd-ignored";
  else if (primaryDock) eventClass = "primary-dock";
  else if (chipLied) eventClass = "chip-lied";
  else if (promisedFresh) eventClass = "promised-fresh";
  else if (sameFloor) eventClass = "same-floor";
  else if (alongsideHold) eventClass = "isolated-worktree";

  return {
    parentCwd,
    chipCwd,
    cwdParam,
    phantomPath,
    gitToplevel,
    gitDir,
    gitCommonDir,
    sameFloor,
    worktreeOk,
    worktreeMade,
    worktreeMissing,
    listUnchanged,
    branchMoved,
    interleaved,
    parentUntouched,
    offQuay,
    branchStolen,
    interleavedHold,
    cohabited,
    phantomTree,
    cwdIgnored,
    primaryDock,
    chipLied,
    promisedFresh,
    alongsideHold,
    eventClass,
    interleavedPaths: row.interleavedPaths.slice(),
    branchBefore: row.branchBefore,
    branchAfter: row.branchAfter,
  };
}

export function classify(input = {}) {
  const row = cloneBerth(input);
  if (isOffQuay(row)) return "off-quay";
  if (isIdle(row)) return "alongside";
  const facts = analyze(row);
  if (facts.branchStolen) return "branch-stolen";
  if (facts.interleavedHold) return "interleaved";
  if (facts.cohabited) return "cohabited";
  if (facts.phantomTree) return "phantom-tree";
  if (facts.cwdIgnored) return "cwd-ignored";
  if (facts.primaryDock) return "primary-dock";
  if (facts.chipLied) return "chip-lied";
  if (facts.promisedFresh) return "promised-fresh";
  if (facts.sameFloor) return "same-floor";
  if (facts.alongsideHold) return "alongside";
  return "alongside";
}

export function feedOf(kind) {
  if (kind === "cohabited") {
    return "● Cohabited · chip session shares the spawning session's working tree while that session is still editing it · primary #90668";
  }
  if (kind === "promised-fresh") {
    return "● Promised-fresh · tool schema/ack/UI promised a fresh worktree but none was created";
  }
  if (kind === "same-floor") {
    return "● Same-floor · chip cwd is the same absolute filesystem path as the spawning session";
  }
  if (kind === "branch-stolen") {
    return "● Branch-stolen · chip created or checked out a branch that moved the shared tree under the parent";
  }
  if (kind === "interleaved") {
    return "● Interleaved · chip's uncommitted files appear in the parent's git status mid-task";
  }
  if (kind === "chip-lied") {
    return "● Chip-lied · user/model told a separate local session / fresh worktree while cwd is the parent's";
  }
  if (kind === "primary-dock") {
    return "● Primary-dock · started on the primary checkout / project root with no worktree";
  }
  if (kind === "cwd-ignored") {
    return "● Cwd-ignored · #77263 cwd param set to a git repo but still no worktree";
  }
  if (kind === "phantom-tree") {
    return "● Phantom-tree · #79234 .claude/worktrees/<name> exists but is not a real git worktree; git resolves to parent";
  }
  if (kind === "off-quay") {
    return "● Off-quay · related slip, not #90668 shared spawn_task tree · label, do not treat as this berth";
  }
  return "● Alongside · chip session has its own real git worktree; parent tree untouched · hold is quiet · idle word is alongside";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "cohabited" || facts.cohabited) {
    reasons.push(
      `#90668 chip cwd ${facts.chipCwd || DEMO_PARENT_CWD} is the parent's working tree while parent still editing`,
    );
  }
  if (facts.sameFloor) {
    reasons.push(`same absolute path ${facts.parentCwd} === ${facts.chipCwd}`);
  }
  if (facts.worktreeMissing) reasons.push("no isolated git worktree created");
  if (facts.worktreeOk) reasons.push("chip has a real linked git worktree");
  if (facts.branchStolen || kind === "branch-stolen") {
    reasons.push(
      `shared checkout moved ${facts.branchBefore || DEMO_BRANCH_PARENT} → ${facts.branchAfter || DEMO_BRANCH_CHIP}`,
    );
  }
  if (facts.interleavedHold || kind === "interleaved") {
    reasons.push(
      `interleaved paths in parent git status: ${facts.interleavedPaths.join(", ") || DEMO_INTERLEAVED.join(", ")}`,
    );
  }
  if (facts.phantomTree || kind === "phantom-tree") {
    reasons.push(
      `#79234 phantom ${facts.phantomPath || facts.chipCwd} is not a real git worktree`,
    );
  }
  if (facts.cwdIgnored || kind === "cwd-ignored") {
    reasons.push(`#77263 cwd param ${facts.cwdParam || DEMO_77263_CWD} is a git repo but no worktree`);
  }
  if (facts.primaryDock || kind === "primary-dock") {
    reasons.push("started on primary checkout / project root");
  }
  if (facts.chipLied || kind === "chip-lied") {
    reasons.push("told separate local session / fresh worktree while cwd is parent's");
  }
  if (facts.promisedFresh || kind === "promised-fresh") {
    reasons.push("schema/ack promised fresh worktree");
  }
  if (facts.offQuay) {
    reasons.push(
      "off-quay nearby: #90638 Fascia / #90661 Carrel / #90662 Byline / #86691 / #81213 / #89940 — not this berth",
    );
  }
  if (kind === "alongside") {
    reasons.push("isolated worktree; parent tree untouched");
  }
  return reasons;
}

function berthResult(kind, quay, action = {}) {
  const facts = analyze(quay);
  const alarm = SLACK_VERDICTS.includes(kind);
  const linear = LINEAR_VERDICTS.includes(kind);
  return {
    product: "berth",
    action: action.action || "score",
    session: quay.session || action.session || "",
    issue: quay.issue ?? action.issue ?? null,
    source: quay.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    alongside: kind === "alongside",
    cohabited: kind === "cohabited",
    promisedFresh: kind === "promised-fresh",
    sameFloor: kind === "same-floor",
    branchStolen: kind === "branch-stolen",
    interleaved: kind === "interleaved",
    chipLied: kind === "chip-lied",
    primaryDock: kind === "primary-dock",
    cwdIgnored: kind === "cwd-ignored",
    phantomTree: kind === "phantom-tree",
    offQuay: kind === "off-quay",
    alarm,
    slack: alarm,
    linear,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "off-quay" && kind !== "alongside",
    facts: {
      parentCwd: facts.parentCwd,
      chipCwd: facts.chipCwd,
      cwdParam: facts.cwdParam,
      worktreeOk: facts.worktreeOk,
      worktreeMissing: facts.worktreeMissing,
      sameFloor: facts.sameFloor,
      cohabited: facts.cohabited,
      branchStolen: facts.branchStolen,
      interleavedHold: facts.interleavedHold,
      phantomTree: facts.phantomTree,
      cwdIgnored: facts.cwdIgnored,
      promisedFresh: facts.promisedFresh,
      parentUntouched: facts.parentUntouched,
      branchBefore: facts.branchBefore,
      branchAfter: facts.branchAfter,
      interleavedPaths: facts.interleavedPaths,
    },
    quay,
    reasons: reasonsOf(quay, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(quay = {}) {
  const row = cloneBerth(quay);
  const kind = classify(row);
  return berthResult(kind, row, { action: "score" });
}

export function verdictOf(quay = {}) {
  return classify(quay);
}

export function alongsideOf(quay = {}) {
  return classify(quay) === "alongside";
}

export function flagsOf(quay = {}) {
  return analyze(quay);
}

export function reasonsList(quay = {}) {
  return reasonsOf(quay, classify(quay));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    berth: {
      ...emptyBerth(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedAlongside() {
  return baseSeed("alongside-hold", FEATURED_ISSUE, {
    source: "honest isolated worktree hold",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_CHIP_ISOLATED,
    worktreeCreated: true,
    worktreeIsGit: true,
    branchBefore: DEMO_BRANCH_PARENT,
    branchAfter: DEMO_BRANCH_PARENT,
    promisedFresh: true,
    parentStillEditing: true,
    interleavedPaths: [],
    toldSeparateSession: true,
    worktreeListBefore: [DEMO_PARENT_CWD],
    worktreeListAfter: [DEMO_PARENT_CWD, DEMO_CHIP_ISOLATED],
    gitDir: `${DEMO_CHIP_ISOLATED}/.git`,
    gitCommonDir: `${DEMO_PARENT_CWD}/.git`,
    gitToplevel: DEMO_CHIP_ISOLATED,
    startedOnPrimary: false,
    parentUntouched: true,
  });
}

export function seedControl() {
  return seedAlongside();
}

export function seedReset() {
  return { action: "bail", berth: emptyBerth() };
}

export function seedCohabited() {
  return baseSeed("90668-cohabited", FEATURED_ISSUE, {
    source: "primary #90668 shared spawn_task tree",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    branchBefore: DEMO_BRANCH_PARENT,
    branchAfter: DEMO_BRANCH_PARENT,
    promisedFresh: true,
    parentStillEditing: true,
    interleavedPaths: [],
    toldSeparateSession: true,
    worktreeListBefore: [DEMO_PARENT_CWD, DEMO_HAND_WORKTREE],
    worktreeListAfter: [DEMO_PARENT_CWD, DEMO_HAND_WORKTREE],
    gitDir: `${DEMO_PARENT_CWD}/.git`,
    gitCommonDir: `${DEMO_PARENT_CWD}/.git`,
    gitToplevel: DEMO_PARENT_CWD,
    startedOnPrimary: true,
  });
}

export function seed90668() {
  return seedCohabited();
}

export function seedCwdIgnored() {
  return baseSeed("77263-cwd-ignored", NEARBY_77263, {
    source: "nearby #77263 cwd param set to a git repo but no worktree",
    parentCwd: DEMO_77263_PARENT,
    chipCwd: DEMO_77263_CWD,
    cwdParam: DEMO_77263_CWD,
    cwdIsGitRepo: true,
    worktreeCreated: false,
    worktreeIsGit: false,
    promisedFresh: true,
    parentStillEditing: false,
    toldSeparateSession: true,
    worktreeListBefore: [
      `${DEMO_77263_CWD}/.claude/worktrees/a`,
      `${DEMO_77263_CWD}/.claude/worktrees/b`,
    ],
    worktreeListAfter: [
      `${DEMO_77263_CWD}/.claude/worktrees/a`,
      `${DEMO_77263_CWD}/.claude/worktrees/b`,
    ],
    gitDir: `${DEMO_77263_CWD}/.git`,
    gitCommonDir: `${DEMO_77263_CWD}/.git`,
    gitToplevel: DEMO_77263_CWD,
    startedOnPrimary: true,
  });
}

export function seed77263() {
  return seedCwdIgnored();
}

export function seedPhantomTree() {
  return baseSeed("79234-phantom-tree", NEARBY_79234, {
    source: "nearby #79234 .claude/worktrees dir is not a real git worktree",
    parentCwd: DEMO_79234_PARENT,
    chipCwd: DEMO_79234_PHANTOM,
    phantomPath: DEMO_79234_PHANTOM,
    worktreeCreated: true,
    worktreeIsGit: false,
    promisedFresh: true,
    parentStillEditing: false,
    toldSeparateSession: true,
    gitDir: `${DEMO_79234_PARENT}/.git`,
    gitCommonDir: `${DEMO_79234_PARENT}/.git`,
    gitToplevel: DEMO_79234_PARENT,
    startedOnPrimary: false,
    branchBefore: "main",
    branchAfter: "main",
  });
}

export function seed79234() {
  return seedPhantomTree();
}

export function seedBranchStolen() {
  return baseSeed("90668-branch-stolen", FEATURED_ISSUE, {
    source: "chip created a branch that moved the shared tree under the parent",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    branchBefore: DEMO_BRANCH_PARENT,
    branchAfter: DEMO_BRANCH_CHIP,
    promisedFresh: true,
    parentStillEditing: true,
    toldSeparateSession: true,
    startedOnPrimary: true,
    gitToplevel: DEMO_PARENT_CWD,
  });
}

export function seedInterleaved() {
  return baseSeed("90668-interleaved", FEATURED_ISSUE, {
    source: "chip uncommitted files in parent git status mid-task",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    branchBefore: DEMO_BRANCH_PARENT,
    branchAfter: DEMO_BRANCH_PARENT,
    promisedFresh: true,
    parentStillEditing: true,
    interleavedPaths: DEMO_INTERLEAVED.slice(),
    toldSeparateSession: true,
    startedOnPrimary: true,
    gitToplevel: DEMO_PARENT_CWD,
  });
}

export function seedPromisedFresh() {
  return baseSeed("promised-fresh", FEATURED_ISSUE, {
    source: "schema/ack promised fresh worktree; none created",
    promisedFresh: true,
    worktreeCreated: false,
    worktreeIsGit: false,
    parentStillEditing: false,
    toldSeparateSession: false,
    startedOnPrimary: false,
  });
}

export function seedSameFloor() {
  return baseSeed("same-floor", FEATURED_ISSUE, {
    source: "same absolute filesystem path; parent not mid-edit",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    parentStillEditing: false,
    promisedFresh: false,
    toldSeparateSession: false,
    startedOnPrimary: false,
  });
}

export function seedChipLied() {
  return baseSeed("chip-lied", FEATURED_ISSUE, {
    source: "told separate local session while cwd is parent's",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    toldSeparateSession: true,
    promisedFresh: true,
    parentStillEditing: false,
    startedOnPrimary: false,
  });
}

export function seedPrimaryDock() {
  return baseSeed("primary-dock", FEATURED_ISSUE, {
    source: "started on primary checkout with no worktree",
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    worktreeCreated: false,
    worktreeIsGit: false,
    startedOnPrimary: true,
    parentStillEditing: false,
    promisedFresh: false,
    toldSeparateSession: false,
  });
}

export function seedOffQuayFascia() {
  return baseSeed("fascia-trust", RELATED_FASCIA, {
    source: "NOT this: Fascia trust dialog names spawn_task cwd while worktree exists",
    nearby: "fascia",
    fasciaTrust: true,
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_CHIP_ISOLATED,
    worktreeCreated: true,
    worktreeIsGit: true,
    promisedFresh: true,
    parentStillEditing: true,
    parentUntouched: true,
    gitDir: `${DEMO_CHIP_ISOLATED}/.git`,
    gitCommonDir: `${DEMO_PARENT_CWD}/.git`,
    gitToplevel: DEMO_CHIP_ISOLATED,
  });
}

export function seedOffQuayCarrel() {
  return baseSeed("carrel-launch", RELATED_CARREL, {
    source: "NOT this: Carrel preview_start launch.json session-cwd",
    nearby: "carrel",
    carrelLaunch: true,
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_CHIP_ISOLATED,
    worktreeCreated: true,
    worktreeIsGit: true,
  });
}

export function seedOffQuayByline() {
  return baseSeed("byline-ghost", 90662, {
    source: "NOT this: Byline phantom hook agent_id",
    nearby: "byline",
    bylineGhost: true,
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_CHIP_ISOLATED,
  });
}

export function seedOffQuay86691() {
  return baseSeed("86691-ux", RELATED_86691, {
    source: "NOT this: UI preference local vs worktree",
    nearby: "86691",
    issue86691: true,
  });
}

const SEEDS = {
  alongside: seedAlongside,
  control: seedAlongside,
  healthy: seedAlongside,
  hold: seedAlongside,
  cohabited: seedCohabited,
  90668: seedCohabited,
  "90668": seedCohabited,
  "cwd-ignored": seedCwdIgnored,
  77263: seedCwdIgnored,
  "77263": seedCwdIgnored,
  "phantom-tree": seedPhantomTree,
  79234: seedPhantomTree,
  "79234": seedPhantomTree,
  "branch-stolen": seedBranchStolen,
  interleaved: seedInterleaved,
  "promised-fresh": seedPromisedFresh,
  "same-floor": seedSameFloor,
  "chip-lied": seedChipLied,
  "primary-dock": seedPrimaryDock,
  fascia: seedOffQuayFascia,
  "90638": seedOffQuayFascia,
  90638: seedOffQuayFascia,
  carrel: seedOffQuayCarrel,
  "90661": seedOffQuayCarrel,
  90661: seedOffQuayCarrel,
  byline: seedOffQuayByline,
  "86691": seedOffQuay86691,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, berth: emptyBerth() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const berth = cloneBerth(nestedAction || src);
  return {
    action,
    session: asText(src.session || berth.session),
    issue: asIssue(src.issue ?? berth.issue),
    source: asText(src.source || berth.source),
    berth,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let quay = cloneBerth(action.berth);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "alongside" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return berthResult("alongside", emptyBerth(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "quay" || verb === "hold") {
    quay = seedAlongside().berth;
    return berthResult(classify(quay), quay, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "cohabited" || verb === "incident" || verb === "90668") {
    quay = seedCohabited().berth;
    return berthResult(classify(quay), quay, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-berth") {
    quay = { ...quay, scored: true };
    return berthResult(classify(quay), quay, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    quay = { ...quay, scored: true };
    return berthResult(classify(quay), quay, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  quay = { ...quay, scored: true };
  return berthResult(classify(quay), quay, action);
}

export function parseSpawnTask(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return {
      cwd: asText(raw.cwd || raw.cwdParam || raw.chipCwd || ""),
      promisedFresh: asBool(raw.promisedFresh, false),
    };
  }
  const text = asText(raw).trim();
  if (!text) return { cwd: "", promisedFresh: false };
  const cwd = text.match(/cwd\s*[:=]\s*["']([^"']+)["']/i);
  const promised = /fresh worktree/i.test(text);
  try {
    return parseSpawnTask(JSON.parse(text));
  } catch {
    return { cwd: cwd ? cwd[1] : "", promisedFresh: promised };
  }
}

export function parseBerthJson(raw) {
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw)) {
      return cloneBerth({ interleavedPaths: raw, scored: true });
    }
    if (
      raw.berth ||
      raw.probe ||
      raw.quay ||
      raw.dock ||
      raw.parentCwd ||
      raw.chipCwd ||
      raw.spawn_task
    ) {
      return cloneBerth({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyBerth();
  try {
    return parseBerthJson(JSON.parse(text));
  } catch {
    const spawn = parseSpawnTask(text);
    if (spawn.cwd || spawn.promisedFresh) {
      return cloneBerth({
        cwdParam: spawn.cwd,
        chipCwd: spawn.cwd,
        promisedFresh: spawn.promisedFresh,
        scored: true,
      });
    }
    return emptyBerth();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, berth: emptyBerth() };
}
