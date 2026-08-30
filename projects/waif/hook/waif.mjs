/**
 * Waif — parish foundling-home
 * intake board for a real Claude
 * Code defect: when a Bash tool
 * call hits its timeout, the tool
 * returns a timeout error to the
 * model, but child processes
 * spawned by the command (find,
 * grep, pipelines, etc.) are NOT
 * killed — only abandoned. Orphans
 * keep crawling/scanning with a
 * dead parent PID. On Windows this
 * has left 21+ find.exe/grep.exe
 * orphans holding ~50% of a
 * 16-core machine via Defender; on
 * POSIX the process group is not
 * killed either. Impact is
 * invisible to the model (it only
 * sees the timeout) and lands as
 * machine-wide CPU/AV load.
 *
 * An abandoned child is not a hold.
 * Score the ward or admit sheltered.
 *
 * Primary #90672: OPEN, filed
 * 2026-08-30. Title: Bash tool
 * timeout does not terminate the
 * child process tree — orphaned
 * processes keep running
 * indefinitely.
 *
 * Same-class nearby (scoreable,
 * not the primary):
 *   #78030 Windows/Git Bash: Bash
 *     tool does not reap its child
 *     on timeout
 *   #76353 Bash tool leaks orphaned
 *     child processes on Windows
 *     timeout
 *   #85200 TaskStop does not kill
 *     the process tree (orphaned
 *     rm -rf)
 *   #84464 Background Bash falsely
 *     "was stopped" while process
 *     tree orphaned
 *   #82433 Backgrounded (&) shell
 *     children survive Bash-tool
 *     timeout as PID-1 orphans
 *   #76056 grep→ugrep shim children
 *     not killed on timeout
 *   #84647 orphaned grep reached
 *     20 GB RSS after timeout
 *   #79727 memory-pressure reap
 *     kills only tracked shell;
 *     child tree survives
 *
 * Related, different (label, do
 * not treat as this bug):
 *   #90616 Gaff — timeout-kill DID
 *     happen but was reported as
 *     "completed (exit 0)". Gaff =
 *     false completion billing.
 *     Waif = the tree was never
 *     killed; orphans keep running
 *     after the model already saw
 *     timeout.
 *   #90668 Berth — shared
 *     spawn_task tree.
 *   #90661 Carrel — launch.json
 *     session-cwd.
 *   #90662 Byline — phantom hook
 *     agent_id.
 *
 * Cross-ecosystem nearby, not
 * identical:
 *   openai/codex#35393 Windows
 *     shell timeout/cancellation
 *     can orphan descendants
 *   openai/codex#30802 WSL child
 *     processes survive Codex
 *     shell timeout/cancellation
 *   openai/codex#37770 search/grep
 *     processes run indefinitely
 *     with no timeout (orphaned rg)
 *   openai/codex#25388 orphaned
 *     zsh shell-snapshot processes
 *     burning ~100% CPU
 *
 * Verdicts: sheltered | abandoned |
 *           orphaned | tree-alive |
 *           parent-dead |
 *           timeout-seen |
 *           group-unkilled |
 *           job-missing |
 *           taskkill-skipped |
 *           defender-load |
 *           off-ward
 * Idle word is sheltered (child
 * taken in / tree reaped; hold is
 * quiet).
 * NEVER use waif / empty / silent /
 * mute / idle / alongside / seated /
 * credited / level / verbatim /
 * fronted / locked / yanked /
 * caught / stowed / posted /
 * bunged / belayed / rove / keyed /
 * housed / beamed / snug / hung /
 * appointed / cinched / gauged /
 * stamped / overrun / pratique /
 * wound / bound / stilled /
 * stabled / drained / flat / fit /
 * spoilt / laid / unlinked / tight /
 * banked / roosted / stocked /
 * heard / clear / paired / kernel /
 * latched / upheld / sterling /
 * home / valid / dry / quiet /
 * seised / rung / moored / claimed /
 * adopted / warded / reaped /
 * orphaned as the idle word.
 *
 * Slack alarm + Linear ticket on
 * abandoned / orphaned / tree-alive /
 * parent-dead / timeout-seen /
 * group-unkilled / job-missing /
 * taskkill-skipped / defender-load.
 * GitHub waif-ledger of scored
 * intakes on every score.
 *
 * Priority when multiple match:
 *   off-ward > abandoned >
 *   defender-load > taskkill-skipped >
 *   job-missing > group-unkilled >
 *   parent-dead > tree-alive >
 *   orphaned > timeout-seen >
 *   sheltered
 *
 * Unique nearby flags win their
 * own seeds because those seeds do
 * not carry the #90672 triad
 * (timedOut + children still
 * running with dead/missing parent
 * + model already saw timeout).
 *
 * sheltered is true ONLY when the
 * verdict is sheltered (idle, or
 * honest control: timeout killed
 * the whole tree via Job Object /
 * process group). Seeded 90672
 * orphans are never sheltered.
 *
 * Why this is not a clone:
 * NOT Gaff — timeout-kill DID
 *     happen; receipt said
 *     completed exit 0. #90616.
 * NOT Berth — shared spawn_task
 *     tree #90668.
 * NOT Carrel — launch.json
 *     session-cwd #90661.
 * NOT Byline — phantom hook
 *     agent_id #90662.
 * NOT Datum / Calque / Fascia /
 *     Quoin / Sear / Cubby /
 *     Grille / Spile / Bollard /
 *     leftover woodworking.
 * Different problem: Bash timeout
 * returns an error to the model
 * but does not kill the child
 * process tree.
 * Different UI: Victorian parish
 * foundling-home intake board.
 * Different idle: sheltered.
 */

export const VERDICTS = Object.freeze([
  "sheltered",
  "abandoned",
  "orphaned",
  "tree-alive",
  "parent-dead",
  "timeout-seen",
  "group-unkilled",
  "job-missing",
  "taskkill-skipped",
  "defender-load",
  "off-ward",
]);
export const IDLE_WORD = "sheltered";
export const SLACK_VERDICTS = Object.freeze([
  "abandoned",
  "orphaned",
  "tree-alive",
  "parent-dead",
  "timeout-seen",
  "group-unkilled",
  "job-missing",
  "taskkill-skipped",
  "defender-load",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90672;
export const NEARBY_78030 = 78030;
export const NEARBY_76353 = 76353;
export const NEARBY_85200 = 85200;
export const NEARBY_84464 = 84464;
export const NEARBY_82433 = 82433;
export const NEARBY_76056 = 76056;
export const NEARBY_84647 = 84647;
export const NEARBY_79727 = 79727;
export const RELATED_GAFF = 90616;
export const RELATED_BERTH = 90668;
export const RELATED_CARREL = 90661;
export const RELATED_BYLINE = 90662;
export const CODEX_WIN_ORPHAN = 35393;
export const CODEX_WSL_ORPHAN = 30802;
export const CODEX_RG_ORPHAN = 37770;
export const CODEX_ZSH_CPU = 25388;

export const DEMO_CHILD_COUNT = 21;
export const DEMO_CPU_PCT = 50;
export const DEMO_RSS_MB = 420;
export const DEMO_DEFENDER_RSS = 20480;
export const DEMO_PARENT_PID = 18432;
export const DEMO_ORPHAN_PIDS = Object.freeze([
  19001, 19002, 19003, 19004, 19005,
]);
export const DEMO_COMMAND =
  'find / -name "*.js" | grep -i cache';
export const DEMO_MODEL_SAW = "timeout";
export const DEMO_PLATFORM_WIN = "win32";
export const DEMO_PLATFORM_POSIX = "linux";
export const DEMO_VERSION = "bash-timeout";
export const DEMO_DAY = "2026-08-30";
export const DEFENDER_CPU_MARK = 40;
export const DEFENDER_RSS_MARK = 1024;

const FORBIDDEN_IDLE = Object.freeze([
  "waif",
  "empty",
  "silent",
  "mute",
  "idle",
  "alongside",
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
  "claimed",
  "adopted",
  "warded",
  "reaped",
  "orphaned",
  "gaff",
  "berth",
  "carrel",
  "byline",
  "datum",
  "calque",
  "fascia",
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

function asNum(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
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

export function isWindows(platform) {
  const p = asText(platform).toLowerCase();
  return p === "win32" || p === "windows" || p === "win" || p === "msys" || p === "cygwin";
}

export function isPosix(platform) {
  const p = asText(platform).toLowerCase();
  return (
    p === "linux" ||
    p === "darwin" ||
    p === "posix" ||
    p === "freebsd" ||
    p === "unix"
  );
}

export function modelSawTimeout(value) {
  const v = asText(value).toLowerCase().replace(/[\s-]+/g, "_");
  return (
    v === "timeout" ||
    v === "timeout_error" ||
    v === "timed_out" ||
    v === "timedout" ||
    v === "bash_timeout"
  );
}

export function emptyWaif() {
  return {
    session: "",
    issue: null,
    source: "",
    timedOut: null,
    parentAlive: null,
    childCount: 0,
    childrenWithDeadParent: 0,
    processGroupKilled: null,
    jobObjectAttached: null,
    taskkillTreeUsed: null,
    platform: "",
    rssMb: 0,
    cpuPct: 0,
    modelSaw: "",
    parentPid: null,
    orphanPids: [],
    command: "",
    reportedExit: null,
    reportedStatus: "",
    nearby: "",
    gaffBilled: false,
    berthCohabited: false,
    carrelLaunch: false,
    bylineGhost: false,
    scored: false,
  };
}

export function cloneWaif(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.waif && typeof src.waif === "object"
      ? src.waif
      : src.probe && typeof src.probe === "object"
        ? src.probe
        : src.ward && typeof src.ward === "object"
          ? src.ward
          : src.intake && typeof src.intake === "object"
            ? src.intake
            : src;
  const bash =
    nested.bash && typeof nested.bash === "object"
      ? nested.bash
      : src.bash && typeof src.bash === "object"
        ? src.bash
        : {};
  const base = emptyWaif();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    timedOut: asNullableBool(nested.timedOut ?? src.timedOut ?? bash.timedOut),
    parentAlive: asNullableBool(nested.parentAlive ?? src.parentAlive ?? bash.parentAlive),
    childCount: asNum(nested.childCount ?? src.childCount ?? bash.childCount, 0),
    childrenWithDeadParent: asNum(
      nested.childrenWithDeadParent ?? src.childrenWithDeadParent ?? bash.childrenWithDeadParent,
      0,
    ),
    processGroupKilled: asNullableBool(
      nested.processGroupKilled ?? src.processGroupKilled ?? bash.processGroupKilled,
    ),
    jobObjectAttached: asNullableBool(
      nested.jobObjectAttached ?? src.jobObjectAttached ?? bash.jobObjectAttached,
    ),
    taskkillTreeUsed: asNullableBool(
      nested.taskkillTreeUsed ?? src.taskkillTreeUsed ?? bash.taskkillTreeUsed,
    ),
    platform: asText(nested.platform || src.platform || bash.platform || ""),
    rssMb: asNum(nested.rssMb ?? src.rssMb ?? bash.rssMb, 0),
    cpuPct: asNum(nested.cpuPct ?? src.cpuPct ?? bash.cpuPct, 0),
    modelSaw: asText(nested.modelSaw || src.modelSaw || bash.modelSaw || ""),
    parentPid: nested.parentPid ?? src.parentPid ?? bash.parentPid ?? null,
    orphanPids: asList(nested.orphanPids ?? src.orphanPids ?? bash.orphanPids),
    command: asText(nested.command || src.command || bash.command || ""),
    reportedExit: nested.reportedExit ?? src.reportedExit ?? bash.reportedExit ?? null,
    reportedStatus: asText(
      nested.reportedStatus || src.reportedStatus || bash.reportedStatus || "",
    ),
    nearby: asText(nested.nearby || src.nearby || ""),
    gaffBilled: asBool(nested.gaffBilled ?? src.gaffBilled, false),
    berthCohabited: asBool(nested.berthCohabited ?? src.berthCohabited, false),
    carrelLaunch: asBool(nested.carrelLaunch ?? src.carrelLaunch, false),
    bylineGhost: asBool(nested.bylineGhost ?? src.bylineGhost, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function isOffWard(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  if (
    nearby === "gaff" ||
    nearby === "90616" ||
    nearby === "berth" ||
    nearby === "90668" ||
    nearby === "carrel" ||
    nearby === "90661" ||
    nearby === "byline" ||
    nearby === "90662"
  ) {
    return true;
  }
  return Boolean(
    row.gaffBilled || row.berthCohabited || row.carrelLaunch || row.bylineGhost,
  );
}

export function isIdle(row = {}) {
  const probe = cloneWaif(row);
  return !(
    probe.timedOut != null ||
    probe.parentAlive != null ||
    probe.childCount ||
    probe.childrenWithDeadParent ||
    probe.processGroupKilled != null ||
    probe.jobObjectAttached != null ||
    probe.taskkillTreeUsed != null ||
    probe.platform ||
    probe.rssMb ||
    probe.cpuPct ||
    probe.modelSaw ||
    probe.parentPid != null ||
    probe.orphanPids.length ||
    probe.command ||
    probe.reportedExit != null ||
    probe.reportedStatus ||
    probe.nearby ||
    isOffWard(probe)
  );
}

export function treeWasKilled(row = {}) {
  const childrenGone = row.childCount === 0 && row.childrenWithDeadParent === 0;
  const reaped =
    row.processGroupKilled === true ||
    row.jobObjectAttached === true ||
    row.taskkillTreeUsed === true;
  return Boolean(reaped && childrenGone);
}

export function analyze(input = {}) {
  const row = cloneWaif(input);
  const win = isWindows(row.platform);
  const posix = isPosix(row.platform);
  const timeout = row.timedOut === true;
  const parentDead = row.parentAlive === false;
  const parentAlive = row.parentAlive === true;
  const childrenAlive = row.childCount > 0;
  const deadParentKids = row.childrenWithDeadParent > 0;
  const sawTimeout = modelSawTimeout(row.modelSaw);
  const killed = treeWasKilled(row);
  const offWard = isOffWard(row);
  const abandoned = Boolean(
    timeout && parentDead && deadParentKids && sawTimeout && !killed && !offWard,
  );
  const defenderLoad = Boolean(
    !killed &&
      !offWard &&
      !abandoned &&
      childrenAlive &&
      (row.cpuPct >= DEFENDER_CPU_MARK || row.rssMb >= DEFENDER_RSS_MARK),
  );
  const taskkillSkipped = Boolean(
    win &&
      timeout &&
      childrenAlive &&
      row.taskkillTreeUsed === false &&
      !killed &&
      !offWard &&
      !abandoned,
  );
  const jobMissing = Boolean(
    win &&
      timeout &&
      childrenAlive &&
      row.jobObjectAttached === false &&
      !killed &&
      !offWard &&
      !abandoned,
  );
  const groupUnkilled = Boolean(
    posix &&
      timeout &&
      childrenAlive &&
      row.processGroupKilled === false &&
      !killed &&
      !offWard &&
      !abandoned,
  );
  const parentDeadHold = Boolean(
    parentDead && childrenAlive && !deadParentKids && !killed && !offWard && !abandoned,
  );
  const treeAlive = Boolean(
    childrenAlive && parentAlive && !timeout && !killed && !offWard && !abandoned,
  );
  const orphaned = Boolean(deadParentKids && !killed && !offWard && !abandoned);
  const timeoutSeen = Boolean(
    timeout && sawTimeout && childrenAlive && !killed && !offWard && !abandoned,
  );
  const shelteredHold = Boolean(killed && !offWard);

  let eventClass = "idle";
  if (offWard) eventClass = "off-ward";
  else if (abandoned) eventClass = "abandoned";
  else if (defenderLoad) eventClass = "defender-load";
  else if (taskkillSkipped) eventClass = "taskkill-skipped";
  else if (jobMissing) eventClass = "job-missing";
  else if (groupUnkilled) eventClass = "group-unkilled";
  else if (parentDeadHold) eventClass = "parent-dead";
  else if (treeAlive) eventClass = "tree-alive";
  else if (orphaned) eventClass = "orphaned";
  else if (timeoutSeen) eventClass = "timeout-seen";
  else if (shelteredHold) eventClass = "tree-reaped";

  return {
    timeout,
    parentDead,
    parentAlive,
    childrenAlive,
    deadParentKids,
    sawTimeout,
    killed,
    offWard,
    abandoned,
    defenderLoad,
    taskkillSkipped,
    jobMissing,
    groupUnkilled,
    parentDeadHold,
    treeAlive,
    orphaned,
    timeoutSeen,
    shelteredHold,
    win,
    posix,
    eventClass,
    childCount: row.childCount,
    childrenWithDeadParent: row.childrenWithDeadParent,
    cpuPct: row.cpuPct,
    rssMb: row.rssMb,
    platform: row.platform,
    modelSaw: row.modelSaw,
    command: row.command,
  };
}

export function classify(input = {}) {
  const row = cloneWaif(input);
  if (isOffWard(row)) return "off-ward";
  if (isIdle(row)) return "sheltered";
  const facts = analyze(row);
  if (facts.abandoned) return "abandoned";
  if (facts.defenderLoad) return "defender-load";
  if (facts.taskkillSkipped) return "taskkill-skipped";
  if (facts.jobMissing) return "job-missing";
  if (facts.groupUnkilled) return "group-unkilled";
  if (facts.parentDeadHold) return "parent-dead";
  if (facts.treeAlive) return "tree-alive";
  if (facts.orphaned) return "orphaned";
  if (facts.timeoutSeen) return "timeout-seen";
  if (facts.shelteredHold) return "sheltered";
  return "sheltered";
}

export function feedOf(kind) {
  if (kind === "abandoned") {
    return "● Abandoned · Bash timed out; model saw the timeout; child tree still crawling with a dead parent · primary #90672";
  }
  if (kind === "orphaned") {
    return "● Orphaned · children still running after the parent PID died";
  }
  if (kind === "tree-alive") {
    return "● Tree-alive · descendant find/grep/pipeline processes still running after the Bash parent left";
  }
  if (kind === "parent-dead") {
    return "● Parent-dead · tracked shell is gone; the child tree was never reaped";
  }
  if (kind === "timeout-seen") {
    return "● Timeout-seen · model already received the timeout error while children still run";
  }
  if (kind === "group-unkilled") {
    return "● Group-unkilled · POSIX process group was not killed on Bash-tool timeout";
  }
  if (kind === "job-missing") {
    return "● Job-missing · Windows Job Object was never attached to the Bash spawn";
  }
  if (kind === "taskkill-skipped") {
    return "● Taskkill-skipped · Windows taskkill /T never used; descendants survive";
  }
  if (kind === "defender-load") {
    return "● Defender-load · orphan find.exe/grep.exe holding machine-wide CPU/AV load";
  }
  if (kind === "off-ward") {
    return "● Off-ward · Gaff false-complete or other catalog problem · labeled, not this foundling case";
  }
  return "● Sheltered · timeout killed the whole tree via Job Object / process group · hold is quiet · idle word is sheltered";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "abandoned" || facts.abandoned) {
    reasons.push(
      `#90672 timed out; ${facts.childrenWithDeadParent || DEMO_CHILD_COUNT} children still running with dead parent; model saw timeout`,
    );
  }
  if (facts.timeout) reasons.push("Bash tool timed out");
  if (facts.parentDead) reasons.push("parent PID is dead / missing");
  if (facts.childrenAlive) {
    reasons.push(`${facts.childCount} child process(es) still running`);
  }
  if (facts.deadParentKids) {
    reasons.push(`${facts.childrenWithDeadParent} children with a dead parent PID`);
  }
  if (facts.sawTimeout) reasons.push(`model already saw ${facts.modelSaw || "timeout"}`);
  if (facts.killed) reasons.push("process tree was terminated on timeout/cancel");
  if (facts.taskkillSkipped || kind === "taskkill-skipped") {
    reasons.push("Windows taskkill /T was never used");
  }
  if (facts.jobMissing || kind === "job-missing") {
    reasons.push("Windows Job Object was never attached");
  }
  if (facts.groupUnkilled || kind === "group-unkilled") {
    reasons.push("POSIX process group was not killed");
  }
  if (facts.defenderLoad || kind === "defender-load") {
    reasons.push(
      `orphan load cpu ${facts.cpuPct}% rss ${facts.rssMb} MB (Defender / machine-wide)`,
    );
  }
  if (facts.offWard) {
    reasons.push(
      "off-ward nearby: #90616 Gaff false-complete / #90668 Berth / #90661 Carrel / #90662 Byline — not this ward",
    );
  }
  if (kind === "sheltered") {
    reasons.push("tree reaped; child taken in; hold is quiet");
  }
  return reasons;
}

function waifResult(kind, ward, action = {}) {
  const facts = analyze(ward);
  const alarm = SLACK_VERDICTS.includes(kind);
  const linear = LINEAR_VERDICTS.includes(kind);
  return {
    product: "waif",
    action: action.action || "score",
    session: ward.session || action.session || "",
    issue: ward.issue ?? action.issue ?? null,
    source: ward.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    sheltered: kind === "sheltered",
    abandoned: kind === "abandoned",
    orphaned: kind === "orphaned",
    treeAlive: kind === "tree-alive",
    parentDead: kind === "parent-dead",
    timeoutSeen: kind === "timeout-seen",
    groupUnkilled: kind === "group-unkilled",
    jobMissing: kind === "job-missing",
    taskkillSkipped: kind === "taskkill-skipped",
    defenderLoad: kind === "defender-load",
    offWard: kind === "off-ward",
    alarm,
    slack: alarm,
    linear,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "off-ward" && kind !== "sheltered",
    facts: {
      timedOut: facts.timeout,
      parentAlive: ward.parentAlive,
      childCount: facts.childCount,
      childrenWithDeadParent: facts.childrenWithDeadParent,
      processGroupKilled: ward.processGroupKilled,
      jobObjectAttached: ward.jobObjectAttached,
      taskkillTreeUsed: ward.taskkillTreeUsed,
      platform: facts.platform,
      rssMb: facts.rssMb,
      cpuPct: facts.cpuPct,
      modelSaw: facts.modelSaw,
      killed: facts.killed,
      abandoned: facts.abandoned,
      command: facts.command,
    },
    ward,
    reasons: reasonsOf(ward, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(ward = {}) {
  const row = cloneWaif(ward);
  const kind = classify(row);
  return waifResult(kind, row, { action: "score" });
}

export function verdictOf(ward = {}) {
  return classify(ward);
}

export function shelteredOf(ward = {}) {
  return classify(ward) === "sheltered";
}

export function flagsOf(ward = {}) {
  return analyze(ward);
}

export function reasonsList(ward = {}) {
  return reasonsOf(ward, classify(ward));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    waif: {
      ...emptyWaif(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedSheltered() {
  return baseSeed("sheltered-hold", FEATURED_ISSUE, {
    source: "honest timeout killed the whole tree",
    timedOut: true,
    parentAlive: false,
    childCount: 0,
    childrenWithDeadParent: 0,
    processGroupKilled: true,
    jobObjectAttached: true,
    taskkillTreeUsed: true,
    platform: DEMO_PLATFORM_WIN,
    rssMb: 0,
    cpuPct: 0,
    modelSaw: DEMO_MODEL_SAW,
    parentPid: DEMO_PARENT_PID,
    orphanPids: [],
    command: DEMO_COMMAND,
    reportedStatus: "timeout",
  });
}

export function seedControl() {
  return seedSheltered();
}

export function seedReset() {
  return { action: "bail", waif: emptyWaif() };
}

export function seedAbandoned() {
  return baseSeed("90672-abandoned", FEATURED_ISSUE, {
    source: "primary #90672 abandoned child process tree",
    timedOut: true,
    parentAlive: false,
    childCount: DEMO_CHILD_COUNT,
    childrenWithDeadParent: DEMO_CHILD_COUNT,
    processGroupKilled: false,
    jobObjectAttached: false,
    taskkillTreeUsed: false,
    platform: DEMO_PLATFORM_WIN,
    rssMb: DEMO_RSS_MB,
    cpuPct: DEMO_CPU_PCT,
    modelSaw: DEMO_MODEL_SAW,
    parentPid: DEMO_PARENT_PID,
    orphanPids: DEMO_ORPHAN_PIDS.slice(),
    command: DEMO_COMMAND,
    reportedStatus: "timeout",
  });
}

export function seed90672() {
  return seedAbandoned();
}

export function seedTaskkillSkipped() {
  return baseSeed("78030-taskkill-skipped", NEARBY_78030, {
    source: "nearby #78030 Windows taskkill /T never used",
    timedOut: true,
    parentAlive: true,
    childCount: 4,
    childrenWithDeadParent: 0,
    processGroupKilled: false,
    jobObjectAttached: false,
    taskkillTreeUsed: false,
    platform: DEMO_PLATFORM_WIN,
    rssMb: 80,
    cpuPct: 12,
    modelSaw: DEMO_MODEL_SAW,
    command: "find . -name '*.exe'",
  });
}

export function seed78030() {
  return seedTaskkillSkipped();
}

export function seedJobMissing() {
  return baseSeed("76353-job-missing", NEARBY_76353, {
    source: "nearby #76353 Windows Job Object never attached",
    timedOut: true,
    parentAlive: true,
    childCount: 6,
    childrenWithDeadParent: 0,
    processGroupKilled: null,
    jobObjectAttached: false,
    taskkillTreeUsed: true,
    platform: DEMO_PLATFORM_WIN,
    rssMb: 64,
    cpuPct: 8,
    modelSaw: DEMO_MODEL_SAW,
    command: "grep -R TODO .",
  });
}

export function seed76353() {
  return seedJobMissing();
}

export function seedGroupUnkilled() {
  return baseSeed("82433-group-unkilled", NEARBY_82433, {
    source: "nearby #82433 POSIX process group not killed",
    timedOut: true,
    parentAlive: true,
    childCount: 3,
    childrenWithDeadParent: 0,
    processGroupKilled: false,
    jobObjectAttached: null,
    taskkillTreeUsed: null,
    platform: DEMO_PLATFORM_POSIX,
    rssMb: 48,
    cpuPct: 18,
    modelSaw: DEMO_MODEL_SAW,
    command: "find / -name cache &",
  });
}

export function seed82433() {
  return seedGroupUnkilled();
}

export function seedParentDead() {
  return baseSeed("79727-parent-dead", NEARBY_79727, {
    source: "nearby #79727 tracked shell reaped; child tree survives",
    timedOut: false,
    parentAlive: false,
    childCount: 5,
    childrenWithDeadParent: 0,
    processGroupKilled: false,
    jobObjectAttached: false,
    taskkillTreeUsed: false,
    platform: DEMO_PLATFORM_POSIX,
    rssMb: 96,
    cpuPct: 22,
    modelSaw: "",
    command: "rg --hidden .",
  });
}

export function seedTreeAlive() {
  return baseSeed("85200-tree-alive", NEARBY_85200, {
    source: "nearby #85200 TaskStop left the process tree running",
    timedOut: false,
    parentAlive: true,
    childCount: 2,
    childrenWithDeadParent: 0,
    processGroupKilled: false,
    jobObjectAttached: false,
    taskkillTreeUsed: false,
    platform: DEMO_PLATFORM_POSIX,
    rssMb: 32,
    cpuPct: 9,
    modelSaw: "stopped",
    command: "rm -rf /tmp/scratch",
  });
}

export function seedOrphaned() {
  return baseSeed("76056-orphaned", NEARBY_76056, {
    source: "nearby #76056 grep→ugrep shim children not killed",
    timedOut: false,
    parentAlive: false,
    childCount: 2,
    childrenWithDeadParent: 2,
    processGroupKilled: false,
    jobObjectAttached: null,
    taskkillTreeUsed: null,
    platform: DEMO_PLATFORM_POSIX,
    rssMb: 40,
    cpuPct: 6,
    modelSaw: "",
    command: "grep -R pattern .",
  });
}

export function seedDefenderLoad() {
  return baseSeed("84647-defender-load", NEARBY_84647, {
    source: "nearby #84647 orphaned grep reached 20 GB RSS / Defender load",
    timedOut: true,
    parentAlive: true,
    childCount: 8,
    childrenWithDeadParent: 0,
    processGroupKilled: false,
    jobObjectAttached: false,
    taskkillTreeUsed: true,
    platform: DEMO_PLATFORM_WIN,
    rssMb: DEMO_DEFENDER_RSS,
    cpuPct: DEMO_CPU_PCT,
    modelSaw: DEMO_MODEL_SAW,
    command: "grep -R cache C:\\",
  });
}

export function seedTimeoutSeen() {
  return baseSeed("84464-timeout-seen", NEARBY_84464, {
    source: "nearby #84464 model saw timeout/stopped while children still run",
    timedOut: true,
    parentAlive: true,
    childCount: 3,
    childrenWithDeadParent: 0,
    processGroupKilled: null,
    jobObjectAttached: null,
    taskkillTreeUsed: null,
    platform: "",
    rssMb: 24,
    cpuPct: 5,
    modelSaw: DEMO_MODEL_SAW,
    command: DEMO_COMMAND,
  });
}

export function seedOffWardGaff() {
  return baseSeed("gaff-billed", RELATED_GAFF, {
    source: "NOT this: Gaff false exit-0 after kill",
    nearby: "gaff",
    gaffBilled: true,
    timedOut: true,
    parentAlive: false,
    childCount: 0,
    childrenWithDeadParent: 0,
    processGroupKilled: true,
    jobObjectAttached: true,
    taskkillTreeUsed: true,
    platform: "darwin",
    rssMb: 0,
    cpuPct: 0,
    modelSaw: "completed",
    reportedExit: 0,
    reportedStatus: "completed",
    command: 'for i in $(seq 1 10); do echo "iter $i"; sleep 90; done; echo "DONE"',
  });
}

export function seedOffWardBerth() {
  return baseSeed("berth-cohabited", RELATED_BERTH, {
    source: "NOT this: Berth shared spawn_task tree",
    nearby: "berth",
    berthCohabited: true,
  });
}

const SEEDS = {
  sheltered: seedSheltered,
  control: seedSheltered,
  healthy: seedSheltered,
  hold: seedSheltered,
  abandoned: seedAbandoned,
  90672: seedAbandoned,
  "90672": seedAbandoned,
  "taskkill-skipped": seedTaskkillSkipped,
  78030: seedTaskkillSkipped,
  "78030": seedTaskkillSkipped,
  "job-missing": seedJobMissing,
  76353: seedJobMissing,
  "76353": seedJobMissing,
  "group-unkilled": seedGroupUnkilled,
  82433: seedGroupUnkilled,
  "82433": seedGroupUnkilled,
  "parent-dead": seedParentDead,
  79727: seedParentDead,
  "79727": seedParentDead,
  "tree-alive": seedTreeAlive,
  85200: seedTreeAlive,
  "85200": seedTreeAlive,
  orphaned: seedOrphaned,
  76056: seedOrphaned,
  "76056": seedOrphaned,
  "defender-load": seedDefenderLoad,
  84647: seedDefenderLoad,
  "84647": seedDefenderLoad,
  "timeout-seen": seedTimeoutSeen,
  84464: seedTimeoutSeen,
  "84464": seedTimeoutSeen,
  gaff: seedOffWardGaff,
  "90616": seedOffWardGaff,
  90616: seedOffWardGaff,
  berth: seedOffWardBerth,
  "90668": seedOffWardBerth,
  90668: seedOffWardBerth,
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
    return { action: payload, waif: emptyWaif() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const waif = cloneWaif(nestedAction || src);
  return {
    action,
    session: asText(src.session || waif.session),
    issue: asIssue(src.issue ?? waif.issue),
    source: asText(src.source || waif.source),
    waif,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let ward = cloneWaif(action.waif);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "sheltered" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return waifResult("sheltered", emptyWaif(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "ward" || verb === "hold") {
    ward = seedSheltered().waif;
    return waifResult(classify(ward), ward, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "abandoned" || verb === "incident" || verb === "90672") {
    ward = seedAbandoned().waif;
    return waifResult(classify(ward), ward, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-waif") {
    ward = { ...ward, scored: true };
    return waifResult(classify(ward), ward, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    ward = { ...ward, scored: true };
    return waifResult(classify(ward), ward, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  ward = { ...ward, scored: true };
  return waifResult(classify(ward), ward, action);
}

export function parseBashTimeout(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return {
      timedOut: asBool(raw.timedOut, false),
      modelSaw: asText(raw.modelSaw || raw.status || ""),
      childCount: asNum(raw.childCount, 0),
    };
  }
  const text = asText(raw).trim();
  if (!text) return { timedOut: false, modelSaw: "", childCount: 0 };
  const timedOut = /timed?\s*out|timeout/i.test(text);
  const child = text.match(/(\d+)\s+(?:child|orphan|find\.exe|grep\.exe)/i);
  try {
    return parseBashTimeout(JSON.parse(text));
  } catch {
    return {
      timedOut,
      modelSaw: timedOut ? "timeout" : "",
      childCount: child ? Number(child[1]) : 0,
    };
  }
}

export function parseWaifJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.waif ||
      raw.probe ||
      raw.ward ||
      raw.intake ||
      raw.timedOut != null ||
      raw.childCount != null ||
      raw.bash
    ) {
      return cloneWaif({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyWaif();
  try {
    return parseWaifJson(JSON.parse(text));
  } catch {
    const bash = parseBashTimeout(text);
    if (bash.timedOut || bash.childCount) {
      return cloneWaif({
        timedOut: bash.timedOut,
        modelSaw: bash.modelSaw,
        childCount: bash.childCount,
        scored: true,
      });
    }
    return emptyWaif();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, waif: emptyWaif() };
}
