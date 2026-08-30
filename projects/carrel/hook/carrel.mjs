/**
 * Carrel — library reading-room desk for a
 * real Claude Code defect: preview_start
 * matches `name` against the orchestrator
 * session's .claude/launch.json, not the
 * calling subagent's own file in its git
 * worktree. A lane with isolation:
 * "worktree" (or EnterWorktree) cannot
 * have private preview config.
 *
 * A borrowed carrel is not a hold.
 * Score the reading room or admit seated.
 *
 * Primary #90661: OPEN, filed
 * 2026-08-29, labels bug / has repro /
 * platform:macos / area:agents. Title:
 * preview_start resolves .claude/launch.json
 * from the session cwd, not the calling
 * agent's, so concurrent worktree lanes
 * must contend for one config file.
 *
 * Minimal repro: root launch.json has
 * name root-web port 3000; worktree
 * launch.json has name lane-web port
 * 3101; session at project root launches
 * a subagent whose cwd is the worktree;
 * subagent calls preview_start({ name:
 * "lane-web" }); observed: name is
 * matched against the session file,
 * lane-web is missing, attempt proceeds
 * against root-web / port 3000.
 *
 * Same-class nearby (scoreable, not
 * the primary):
 *   #63008 preview_start spawns the
 *     dev server with main-repo cwd
 *     instead of the session's
 *     worktree cwd.
 *   #76496 preview_start fails to
 *     find .claude/launch.json inside
 *     nested .claude/worktrees/<name>/
 *     even when the file exists at
 *     the path the error cites.
 *
 * Related, different (label, do not
 * treat as this bug):
 *   #86039 relative cwd values inside
 *     launch.json resolving against
 *     the session worktree on
 *     UI-initiated launches.
 *   #85319 Start-dev-server button vs
 *     configured url.
 *
 * Cross-ecosystem nearby, not identical:
 *   openai/codex#18969 Support cwd for
 *     spawn_agent (child inherits
 *     parent cwd).
 *   openai/codex#23095 spawn_agent
 *     workspace/worktree directory.
 *   openai/codex#30570 worktree-aware
 *     thread environment.
 *
 * Downstream: narduk-enterprises/
 * agent-infrastructure#845 PreToolUse
 * hook refusing writes to a launch.json
 * outside the calling agent's tree.
 *
 * Verdicts: seated | borrowed |
 *           misfiled | contended |
 *           overwritten | sibling-served |
 *           lane-blind | nested-miss |
 *           main-spawn | fallback-ok |
 *           off-shelf
 * Idle word is seated (preview_start
 * resolved launch.json from the calling
 * agent's own worktree; healthy hold).
 * NEVER use carrel / empty / silent /
 * mute / idle / credited / level /
 * verbatim / fronted / locked / yanked /
 * caught / stowed / posted / bunged /
 * belayed / rove / keyed / housed /
 * beamed / snug / hung / appointed /
 * cinched / gauged / stamped / overrun /
 * pratique / wound / bound / stilled /
 * home / laid / spoilt / fit / flat /
 * drained / or the rest of the catalog
 * idle list as the idle word.
 *
 * Slack alarm on borrowed / misfiled /
 * contended / overwritten /
 * sibling-served / lane-blind /
 * nested-miss / main-spawn.
 * Linear ticket on borrowed / misfiled /
 * sibling-served / contended.
 * GitHub carrel-ledger of scored rooms
 * on every score.
 *
 * Priority when multiple match:
 *   off-shelf > sibling-served >
 *   overwritten > contended >
 *   nested-miss > main-spawn >
 *   borrowed > misfiled > lane-blind >
 *   fallback-ok > seated
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90661 triad (session file
 * used + caller has its own file +
 * session cwd ≠ caller cwd).
 *
 * seated is true ONLY when the verdict
 * is seated (idle, or honest control:
 * launch.json resolved from the calling
 * agent's worktree). A borrowed room is
 * never seated.
 *
 * Why this is not a clone:
 * NOT Wicket — worktree isolation
 *     escapes: absolute Edit/Write
 *     lands in the main checkout.
 * NOT Fascia — trust dialog names
 *     spawn_task cwd while the session
 *     runs in .claude/worktrees.
 * NOT Hasp — file-lease last-writer-
 *     wins on the same path.
 * NOT Iota — Windows path-key identity
 *     in ~/.claude.json.
 * NOT Cinch — silent partial folder
 *     mounts.
 * NOT Cubby — wrong-ancestor
 *     auto-memory.
 * NOT Byline — phantom hook agent_id.
 * NOT Datum / Calque / leftover
 *     woodworking / millimetre-slider
 *     clones.
 * Different problem: which launch.json
 * file preview_start discovers, session
 * cwd vs caller cwd, plus the silent
 * shared-file race the workaround
 * forces.
 * Different UI: library reading room /
 * private-looking carrels / communal
 * card catalog.
 * Different idle: seated.
 */

export const VERDICTS = Object.freeze([
  "seated",
  "borrowed",
  "misfiled",
  "contended",
  "overwritten",
  "sibling-served",
  "lane-blind",
  "nested-miss",
  "main-spawn",
  "fallback-ok",
  "off-shelf",
]);
export const IDLE_WORD = "seated";
export const SLACK_VERDICTS = Object.freeze([
  "borrowed",
  "misfiled",
  "contended",
  "overwritten",
  "sibling-served",
  "lane-blind",
  "nested-miss",
  "main-spawn",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "borrowed",
  "misfiled",
  "sibling-served",
  "contended",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90661;
export const NEARBY_63008 = 63008;
export const NEARBY_76496 = 76496;
export const RELATED_86039 = 86039;
export const RELATED_85319 = 85319;
export const CODEX_SPAWN_CWD = 18969;
export const CODEX_WORKTREE = 23095;
export const CODEX_THREAD_ENV = 30570;
export const DOWNSTREAM_845 = 845;

export const DEMO_SESSION_CWD = "/Users/ada/src/hermes";
export const DEMO_CALLER_CWD = "/Users/ada/src/hermes/.claude/worktrees/lane-a";
export const DEMO_SESSION_LAUNCH = "/Users/ada/src/hermes/.claude/launch.json";
export const DEMO_CALLER_LAUNCH =
  "/Users/ada/src/hermes/.claude/worktrees/lane-a/.claude/launch.json";
export const DEMO_NESTED_LAUNCH =
  "/Users/ada/src/hermes/.claude/worktrees/lane-web/.claude/launch.json";
export const DEMO_ROOT_NAME = "root-web";
export const DEMO_LANE_NAME = "lane-web";
export const DEMO_ROOT_PORT = 3000;
export const DEMO_LANE_PORT = 3101;
export const DEMO_VERSION = "preview_start";
export const DEMO_DAY = "2026-08-29";

const FORBIDDEN_IDLE = Object.freeze([
  "carrel",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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

function asNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
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

export function callerWorktreeRoot(cwd) {
  const p = normPath(cwd);
  const nested = p.match(/^(.*\/\.claude\/worktrees\/[^/]+)/);
  if (nested) return nested[1];
  return p;
}

function namesOf(configs) {
  if (!Array.isArray(configs)) return [];
  return configs
    .map((row) => (typeof row === "string" ? row : row && row.name))
    .filter(Boolean)
    .map((name) => String(name));
}

function portsOf(configs) {
  if (!Array.isArray(configs)) return [];
  return configs
    .map((row) => (row && typeof row === "object" ? row.port : null))
    .filter((port) => port != null);
}

export function emptyCarrel() {
  return {
    session: "",
    issue: null,
    source: "",
    sessionCwd: "",
    callerCwd: "",
    launchJsonPathUsed: "",
    requestedName: "",
    sessionConfigs: [],
    callerConfigs: [],
    configsInScope: [],
    spawnCwd: "",
    port: null,
    servedWorktree: "",
    siblingWrites: 0,
    lastWriterWins: false,
    errorOnContention: false,
    callerLaunchExists: null,
    sessionLaunchExists: null,
    fallbackExplicit: false,
    fileExistsAtCitedPath: false,
    lookupFailed: false,
    citedPath: "",
    isolation: "",
    discoveryRoot: "",
    callerCwdWalked: null,
    nameMatchedAgainst: "",
    nearby: "",
    relativeCwdInsideLaunch: false,
    wicketEscape: false,
    fasciaTrust: false,
    haspLease: false,
    bylineGhost: false,
    issue86039: false,
    issue85319: false,
    scored: false,
  };
}

export function cloneCarrel(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.carrel && typeof src.carrel === "object"
      ? src.carrel
      : src.probe && typeof src.probe === "object"
        ? src.probe
        : src.room && typeof src.room === "object"
          ? src.room
          : src;
  const preview =
    nested.preview_start && typeof nested.preview_start === "object"
      ? nested.preview_start
      : src.preview_start && typeof src.preview_start === "object"
        ? src.preview_start
        : {};
  const base = emptyCarrel();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    sessionCwd: asText(nested.sessionCwd || src.sessionCwd || ""),
    callerCwd: asText(nested.callerCwd || src.callerCwd || ""),
    launchJsonPathUsed: asText(
      nested.launchJsonPathUsed || src.launchJsonPathUsed || "",
    ),
    requestedName: asText(
      nested.requestedName ||
        preview.name ||
        src.requestedName ||
        src.name ||
        "",
    ),
    sessionConfigs: Array.isArray(nested.sessionConfigs)
      ? nested.sessionConfigs.slice()
      : Array.isArray(src.sessionConfigs)
        ? src.sessionConfigs.slice()
        : [],
    callerConfigs: Array.isArray(nested.callerConfigs)
      ? nested.callerConfigs.slice()
      : Array.isArray(src.callerConfigs)
        ? src.callerConfigs.slice()
        : [],
    configsInScope: Array.isArray(nested.configsInScope)
      ? nested.configsInScope.slice()
      : Array.isArray(src.configsInScope)
        ? src.configsInScope.slice()
        : [],
    spawnCwd: asText(nested.spawnCwd || src.spawnCwd || ""),
    port: nested.port ?? src.port ?? preview.port ?? null,
    servedWorktree: asText(nested.servedWorktree || src.servedWorktree || ""),
    siblingWrites: asNum(nested.siblingWrites ?? src.siblingWrites, 0),
    lastWriterWins: asBool(nested.lastWriterWins ?? src.lastWriterWins, false),
    errorOnContention: asBool(
      nested.errorOnContention ?? src.errorOnContention,
      false,
    ),
    callerLaunchExists:
      nested.callerLaunchExists ?? src.callerLaunchExists ?? null,
    sessionLaunchExists:
      nested.sessionLaunchExists ?? src.sessionLaunchExists ?? null,
    fallbackExplicit: asBool(
      nested.fallbackExplicit ?? src.fallbackExplicit,
      false,
    ),
    fileExistsAtCitedPath: asBool(
      nested.fileExistsAtCitedPath ?? src.fileExistsAtCitedPath,
      false,
    ),
    lookupFailed: asBool(nested.lookupFailed ?? src.lookupFailed, false),
    citedPath: asText(nested.citedPath || src.citedPath || ""),
    isolation: asText(nested.isolation || src.isolation || ""),
    discoveryRoot: asText(nested.discoveryRoot || src.discoveryRoot || ""),
    callerCwdWalked:
      nested.callerCwdWalked ?? src.callerCwdWalked ?? null,
    nameMatchedAgainst: asText(
      nested.nameMatchedAgainst || src.nameMatchedAgainst || "",
    ),
    nearby: asText(nested.nearby || src.nearby || ""),
    relativeCwdInsideLaunch: asBool(
      nested.relativeCwdInsideLaunch ?? src.relativeCwdInsideLaunch,
      false,
    ),
    wicketEscape: asBool(nested.wicketEscape ?? src.wicketEscape, false),
    fasciaTrust: asBool(nested.fasciaTrust ?? src.fasciaTrust, false),
    haspLease: asBool(nested.haspLease ?? src.haspLease, false),
    bylineGhost: asBool(nested.bylineGhost ?? src.bylineGhost, false),
    issue86039: asBool(nested.issue86039 ?? src.issue86039, false),
    issue85319: asBool(nested.issue85319 ?? src.issue85319, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

function callerHasOwnFile(row) {
  if (row.callerLaunchExists === false) return false;
  if (row.callerLaunchExists === true) return true;
  if (namesOf(row.callerConfigs).length > 0) return true;
  if (row.callerLaunchPath) return true;
  return false;
}

function sessionHasFile(row) {
  if (row.sessionLaunchExists === false) return false;
  if (row.sessionLaunchExists === true) return true;
  if (namesOf(row.sessionConfigs).length > 0) return true;
  return false;
}

function usedCallerFile(row, callerRoot) {
  const used = normPath(row.launchJsonPathUsed);
  return Boolean(used && callerRoot && pathUnder(used, callerRoot));
}

function usedSessionFile(row, sessionCwd, callerRoot) {
  const used = normPath(row.launchJsonPathUsed);
  if (!used || !sessionCwd) return false;
  if (callerRoot && pathUnder(used, callerRoot)) return false;
  return pathUnder(used, sessionCwd);
}

export function isOffShelf(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  if (
    nearby === "86039" ||
    nearby === "85319" ||
    nearby === "wicket" ||
    nearby === "fascia" ||
    nearby === "hasp" ||
    nearby === "byline" ||
    nearby === "iota" ||
    nearby === "cinch" ||
    nearby === "cubby"
  ) {
    return true;
  }
  return Boolean(
    row.relativeCwdInsideLaunch ||
      row.wicketEscape ||
      row.fasciaTrust ||
      row.haspLease ||
      row.bylineGhost ||
      row.issue86039 ||
      row.issue85319,
  );
}

export function isIdle(row = {}) {
  const probe = cloneCarrel(row);
  if (probe.scored) {
    return !(
      probe.sessionCwd ||
      probe.callerCwd ||
      probe.launchJsonPathUsed ||
      probe.requestedName ||
      namesOf(probe.sessionConfigs).length ||
      namesOf(probe.callerConfigs).length ||
      probe.spawnCwd ||
      probe.servedWorktree ||
      probe.siblingWrites ||
      probe.lookupFailed ||
      probe.nearby ||
      isOffShelf(probe)
    );
  }
  return !(
    probe.sessionCwd ||
    probe.callerCwd ||
    probe.launchJsonPathUsed ||
    probe.requestedName ||
    namesOf(probe.sessionConfigs).length ||
    namesOf(probe.callerConfigs).length ||
    probe.spawnCwd ||
    probe.servedWorktree ||
    probe.siblingWrites ||
    probe.lookupFailed ||
    probe.nearby ||
    isOffShelf(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneCarrel(input);
  const sessionCwd = normPath(row.sessionCwd);
  const callerCwd = normPath(row.callerCwd);
  const callerRoot = callerWorktreeRoot(callerCwd);
  const used = normPath(row.launchJsonPathUsed);
  const requested = asText(row.requestedName);
  const sessionNames = namesOf(row.sessionConfigs);
  const callerNames = namesOf(row.callerConfigs);
  const scopeNames = namesOf(row.configsInScope).length
    ? namesOf(row.configsInScope)
    : usedCallerFile(row, callerRoot)
      ? callerNames
      : sessionNames;
  const usedCaller = usedCallerFile(row, callerRoot);
  const usedSession = usedSessionFile(row, sessionCwd, callerRoot);
  const hasCaller = callerHasOwnFile(row);
  const nameInCaller = Boolean(requested && callerNames.includes(requested));
  const nameInSession = Boolean(requested && sessionNames.includes(requested));
  const nameInScope = Boolean(requested && scopeNames.includes(requested));
  const splitCwds = Boolean(sessionCwd && callerCwd && sessionCwd !== callerCwd);

  const offShelf = isOffShelf(row);
  const siblingServed = Boolean(
    row.servedWorktree &&
      callerCwd &&
      normPath(row.servedWorktree) !== callerCwd &&
      normPath(row.servedWorktree) !== callerRoot &&
      row.port != null,
  );
  const overwritten = Boolean(
    row.lastWriterWins &&
      row.errorOnContention === false &&
      asNum(row.siblingWrites) >= 2,
  );
  const contended = asNum(row.siblingWrites) >= 2 && !overwritten;
  const nestedMiss = Boolean(
    row.lookupFailed &&
      row.fileExistsAtCitedPath &&
      /\.claude\/worktrees\//.test(row.citedPath || used || ""),
  );
  const spawn = normPath(row.spawnCwd);
  const mainSpawn = Boolean(
    spawn &&
      sessionCwd &&
      callerCwd &&
      splitCwds &&
      usedCaller &&
      !usedSession &&
      (spawn === sessionCwd ||
        (pathUnder(spawn, sessionCwd) && !pathUnder(spawn, callerRoot))),
  );
  const borrowed = Boolean(splitCwds && usedSession && hasCaller);
  const misfiled = Boolean(
    requested &&
      !nameInScope &&
      nameInCaller &&
      (usedSession ||
        asText(row.nameMatchedAgainst).toLowerCase() === "orchestrator"),
  );
  const laneBlind = Boolean(
    splitCwds &&
      !usedCaller &&
      (row.callerCwdWalked === false ||
        (row.discoveryRoot &&
          normPath(row.discoveryRoot) === sessionCwd &&
          normPath(row.discoveryRoot) !== callerCwd)),
  );
  const fallbackOk = Boolean(
    !hasCaller &&
      sessionHasFile(row) &&
      usedSession &&
      row.fallbackExplicit &&
      !borrowed,
  );
  const seatedHold = Boolean(
    usedCaller && nameInCaller && !usedSession && !offShelf,
  );

  let eventClass = "idle";
  if (offShelf) eventClass = "off-shelf";
  else if (siblingServed) eventClass = "sibling-served";
  else if (overwritten || contended) eventClass = "shared-catalog";
  else if (nestedMiss) eventClass = "nested-miss";
  else if (mainSpawn) eventClass = "main-spawn";
  else if (borrowed || misfiled || laneBlind) eventClass = "session-cwd-discovery";
  else if (fallbackOk) eventClass = "fallback-ok";
  else if (seatedHold) eventClass = "caller-cwd-discovery";

  return {
    sessionCwd,
    callerCwd,
    callerRoot,
    used,
    requested,
    sessionNames,
    callerNames,
    scopeNames,
    usedCaller,
    usedSession,
    hasCaller,
    nameInCaller,
    nameInSession,
    nameInScope,
    splitCwds,
    offShelf,
    siblingServed,
    overwritten,
    contended,
    nestedMiss,
    mainSpawn,
    borrowed,
    misfiled,
    laneBlind,
    fallbackOk,
    seatedHold,
    eventClass,
    sessionPorts: portsOf(row.sessionConfigs),
    callerPorts: portsOf(row.callerConfigs),
  };
}

export function classify(input = {}) {
  const row = cloneCarrel(input);
  if (isOffShelf(row)) return "off-shelf";
  if (isIdle(row)) return "seated";
  const facts = analyze(row);
  if (facts.siblingServed) return "sibling-served";
  if (facts.overwritten) return "overwritten";
  if (facts.contended) return "contended";
  if (facts.nestedMiss) return "nested-miss";
  if (facts.mainSpawn) return "main-spawn";
  if (facts.borrowed) return "borrowed";
  if (facts.misfiled) return "misfiled";
  if (facts.laneBlind) return "lane-blind";
  if (facts.fallbackOk) return "fallback-ok";
  if (facts.seatedHold) return "seated";
  return "seated";
}

export function feedOf(kind) {
  if (kind === "borrowed") {
    return "● Borrowed · preview_start resolved launch.json from the session cwd instead of the calling agent's · primary #90661";
  }
  if (kind === "misfiled") {
    return "● Misfiled · name matched against orchestrator configurations; lane name missing from the communal catalog";
  }
  if (kind === "contended") {
    return "● Contended · N lanes writing one shared launch.json · last writer is not a hold";
  }
  if (kind === "overwritten") {
    return "● Overwritten · last-writer-wins on the communal catalog, no error";
  }
  if (kind === "sibling-served") {
    return "● Sibling-served · preview serving a sibling worktree under this lane's port";
  }
  if (kind === "lane-blind") {
    return "● Lane-blind · caller cwd ignored for launch.json discovery";
  }
  if (kind === "nested-miss") {
    return "● Nested-miss · #76496 file exists in nested .claude/worktrees/<name>/ but lookup fails";
  }
  if (kind === "main-spawn") {
    return "● Main-spawn · #63008 spawn cwd is the main repo, not the worktree";
  }
  if (kind === "fallback-ok") {
    return "● Fallback-ok · caller has no file; session fallback is explicit and safe";
  }
  if (kind === "off-shelf") {
    return "● Off-shelf · related slip, not #90661 discovery-from-session-cwd · label, do not treat as this bug";
  }
  return "● Seated · preview_start resolved launch.json from the calling agent's own worktree · hold is quiet · idle word is seated";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "borrowed" || facts.borrowed) {
    reasons.push(
      `#90661 session file used (${facts.used || DEMO_SESSION_LAUNCH}) instead of caller file`,
    );
  }
  if (kind === "misfiled" || facts.misfiled) {
    reasons.push(
      `name ${facts.requested || DEMO_LANE_NAME} missing from orchestrator configurations ${facts.scopeNames.join(",") || DEMO_ROOT_NAME}`,
    );
  }
  if (facts.splitCwds) {
    reasons.push(`session cwd ${facts.sessionCwd} ≠ caller cwd ${facts.callerCwd}`);
  }
  if (facts.hasCaller) reasons.push("caller has its own launch.json");
  if (facts.usedSession) reasons.push("launchJsonPathUsed is under the session cwd");
  if (facts.usedCaller) reasons.push("launchJsonPathUsed is under the caller worktree");
  if (facts.siblingServed) reasons.push("served worktree is a sibling of this lane");
  if (facts.overwritten) reasons.push("last-writer-wins with no error");
  if (facts.contended) reasons.push("N lanes writing one shared launch.json");
  if (facts.nestedMiss) reasons.push("#76496 cited path exists but lookup failed");
  if (facts.mainSpawn) reasons.push("#63008 spawn cwd is main repo not worktree");
  if (facts.fallbackOk) reasons.push("explicit session fallback; caller has no file");
  if (facts.offShelf) {
    reasons.push(
      "off-shelf nearby: #86039 / Wicket-escape / Fascia-trust / Hasp-lease / Byline-ghost — not this bug",
    );
  }
  if (kind === "seated") {
    reasons.push("caller-cwd discovery; private carrel holds");
  }
  return reasons;
}

function carrelResult(kind, room, action = {}) {
  const facts = analyze(room);
  const alarm = SLACK_VERDICTS.includes(kind);
  const linear = LINEAR_VERDICTS.includes(kind);
  return {
    product: "carrel",
    action: action.action || "score",
    session: room.session || action.session || "",
    issue: room.issue ?? action.issue ?? null,
    source: room.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    seated: kind === "seated",
    borrowed: kind === "borrowed",
    misfiled: kind === "misfiled",
    contended: kind === "contended",
    overwritten: kind === "overwritten",
    siblingServed: kind === "sibling-served",
    laneBlind: kind === "lane-blind",
    nestedMiss: kind === "nested-miss",
    mainSpawn: kind === "main-spawn",
    fallbackOk: kind === "fallback-ok",
    offShelf: kind === "off-shelf",
    alarm,
    slack: alarm,
    linear,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "off-shelf" && kind !== "seated" && kind !== "fallback-ok",
    facts: {
      sessionCwd: facts.sessionCwd,
      callerCwd: facts.callerCwd,
      launchJsonPathUsed: facts.used,
      requestedName: facts.requested,
      sessionNames: facts.sessionNames,
      callerNames: facts.callerNames,
      scopeNames: facts.scopeNames,
      usedSession: facts.usedSession,
      usedCaller: facts.usedCaller,
      borrowed: facts.borrowed,
      misfiled: facts.misfiled,
    },
    room,
    reasons: reasonsOf(room, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(room = {}) {
  const row = cloneCarrel(room);
  const kind = classify(row);
  return carrelResult(kind, row, { action: "score" });
}

export function verdictOf(room = {}) {
  return classify(room);
}

export function seatedOf(room = {}) {
  return classify(room) === "seated";
}

export function flagsOf(room = {}) {
  return analyze(room);
}

export function reasonsList(room = {}) {
  return reasonsOf(room, classify(room));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    carrel: {
      ...emptyCarrel(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedSeated() {
  return baseSeed("seated-hold", FEATURED_ISSUE, {
    source: "honest caller-cwd hold",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_CALLER_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    configsInScope: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    spawnCwd: DEMO_CALLER_CWD,
    port: DEMO_LANE_PORT,
    servedWorktree: DEMO_CALLER_CWD,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
    callerCwdWalked: true,
    discoveryRoot: DEMO_CALLER_CWD,
  });
}

export function seedControl() {
  return seedSeated();
}

export function seedReset() {
  return { action: "bail", carrel: emptyCarrel() };
}

export function seedBorrowed() {
  return baseSeed("90661-borrowed", FEATURED_ISSUE, {
    source: "primary #90661 session-cwd discovery",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    configsInScope: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    spawnCwd: DEMO_SESSION_CWD,
    port: DEMO_ROOT_PORT,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
    callerCwdWalked: false,
    discoveryRoot: DEMO_SESSION_CWD,
  });
}

export function seed90661() {
  return seedBorrowed();
}

export function seedMisfiled() {
  return baseSeed("90661-misfiled", FEATURED_ISSUE, {
    source: "name matched against orchestrator configurations",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_CALLER_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    configsInScope: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    nameMatchedAgainst: "orchestrator",
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
    callerCwdWalked: true,
    discoveryRoot: DEMO_CALLER_CWD,
    spawnCwd: DEMO_CALLER_CWD,
    port: DEMO_ROOT_PORT,
  });
}

export function seedContended() {
  return baseSeed("90661-contended", FEATURED_ISSUE, {
    source: "N lanes writing one shared launch.json",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    siblingWrites: 3,
    lastWriterWins: false,
    errorOnContention: false,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
  });
}

export function seedOverwritten() {
  return baseSeed("90661-overwritten", FEATURED_ISSUE, {
    source: "last-writer-wins, no error",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: "lane-c-web", port: 3103 }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    siblingWrites: 3,
    lastWriterWins: true,
    errorOnContention: false,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
  });
}

export function seedSiblingServed() {
  return baseSeed("90661-sibling-served", FEATURED_ISSUE, {
    source: "preview serving a sibling worktree under this lane's port",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    spawnCwd: DEMO_SESSION_CWD,
    port: DEMO_LANE_PORT,
    servedWorktree: DEMO_SESSION_CWD,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
  });
}

export function seedLaneBlind() {
  return baseSeed("90661-lane-blind", FEATURED_ISSUE, {
    source: "caller cwd ignored for discovery",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: "",
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
    callerCwdWalked: false,
    discoveryRoot: DEMO_SESSION_CWD,
  });
}

export function seedNestedMiss() {
  return baseSeed("76496-nested-miss", NEARBY_76496, {
    source: "nearby #76496 nested worktree lookup miss",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: "/Users/ada/src/hermes/.claude/worktrees/lane-web",
    launchJsonPathUsed: "",
    citedPath: DEMO_NESTED_LAUNCH,
    fileExistsAtCitedPath: true,
    lookupFailed: true,
    requestedName: DEMO_LANE_NAME,
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    callerLaunchExists: true,
    sessionLaunchExists: true,
    isolation: "worktree",
  });
}

export function seedMainSpawn() {
  return baseSeed("63008-main-spawn", NEARBY_63008, {
    source: "nearby #63008 spawn cwd is main repo",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_CALLER_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    configsInScope: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    spawnCwd: DEMO_SESSION_CWD,
    port: DEMO_LANE_PORT,
    isolation: "worktree",
    callerLaunchExists: true,
    sessionLaunchExists: true,
    callerCwdWalked: true,
    discoveryRoot: DEMO_CALLER_CWD,
  });
}

export function seedFallbackOk() {
  return baseSeed("fallback-ok", FEATURED_ISSUE, {
    source: "caller has no file; session fallback explicit and safe",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    requestedName: DEMO_ROOT_NAME,
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [],
    configsInScope: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    spawnCwd: DEMO_SESSION_CWD,
    port: DEMO_ROOT_PORT,
    isolation: "worktree",
    callerLaunchExists: false,
    sessionLaunchExists: true,
    fallbackExplicit: true,
  });
}

export function seedOffShelf86039() {
  return baseSeed("86039-in-card", RELATED_86039, {
    source: "related #86039 relative cwd inside launch.json — not discovery",
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_CALLER_LAUNCH,
    requestedName: DEMO_LANE_NAME,
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT, cwd: "." }],
    relativeCwdInsideLaunch: true,
    issue86039: true,
    nearby: "86039",
    callerLaunchExists: true,
    isolation: "worktree",
  });
}

export function seedWicketEscape() {
  return baseSeed("wicket-escape", 74726, {
    source: "NOT this: Wicket isolation escape, absolute Edit/Write to main",
    nearby: "wicket",
    wicketEscape: true,
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    isolation: "worktree",
  });
}

export function seedFasciaTrust() {
  return baseSeed("fascia-trust", 90638, {
    source: "NOT this: Fascia trust dialog names spawn_task cwd",
    nearby: "fascia",
    fasciaTrust: true,
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
  });
}

export function seedHaspLease() {
  return baseSeed("hasp-lease", 90146, {
    source: "NOT this: Hasp file-lease last-writer-wins on a generic path",
    nearby: "hasp",
    haspLease: true,
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
  });
}

export function seedBylineGhost() {
  return baseSeed("byline-ghost", 90662, {
    source: "NOT this: Byline phantom hook agent_id",
    nearby: "byline",
    bylineGhost: true,
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
  });
}

const SEEDS = {
  seated: seedSeated,
  control: seedSeated,
  healthy: seedSeated,
  hold: seedSeated,
  borrowed: seedBorrowed,
  90661: seedBorrowed,
  "90661": seedBorrowed,
  misfiled: seedMisfiled,
  contended: seedContended,
  overwritten: seedOverwritten,
  "sibling-served": seedSiblingServed,
  sibling: seedSiblingServed,
  "lane-blind": seedLaneBlind,
  "nested-miss": seedNestedMiss,
  76496: seedNestedMiss,
  "76496": seedNestedMiss,
  "main-spawn": seedMainSpawn,
  63008: seedMainSpawn,
  "63008": seedMainSpawn,
  "fallback-ok": seedFallbackOk,
  fallback: seedFallbackOk,
  "86039": seedOffShelf86039,
  86039: seedOffShelf86039,
  wicket: seedWicketEscape,
  fascia: seedFasciaTrust,
  hasp: seedHaspLease,
  byline: seedBylineGhost,
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
    return { action: payload, carrel: emptyCarrel() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const carrel = cloneCarrel(nestedAction || src);
  return {
    action,
    session: asText(src.session || carrel.session),
    issue: asIssue(src.issue ?? carrel.issue),
    source: asText(src.source || carrel.source),
    carrel,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let room = cloneCarrel(action.carrel);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "seated" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return carrelResult("seated", emptyCarrel(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "desk" || verb === "room") {
    room = seedSeated().carrel;
    return carrelResult(classify(room), room, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "borrowed" || verb === "incident" || verb === "90661") {
    room = seedBorrowed().carrel;
    return carrelResult(classify(room), room, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-room") {
    room = { ...room, scored: true };
    return carrelResult(classify(room), room, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    room = { ...room, scored: true };
    return carrelResult(classify(room), room, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  room = { ...room, scored: true };
  return carrelResult(classify(room), room, action);
}

export function parseLaunchJson(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const configs = Array.isArray(raw.configurations)
      ? raw.configurations
      : Array.isArray(raw.configs)
        ? raw.configs
        : [];
    return configs;
  }
  const text = asText(raw).trim();
  if (!text) return [];
  try {
    return parseLaunchJson(JSON.parse(text));
  } catch {
    return [];
  }
}

export function parsePreviewStart(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return asText(raw.name || raw.requestedName || "");
  }
  const text = asText(raw).trim();
  if (!text) return "";
  const call = text.match(/preview_start\s*\(\s*\{[\s\S]*?name\s*:\s*["']([^"']+)["']/i);
  if (call) return call[1];
  try {
    const parsed = JSON.parse(text);
    return parsePreviewStart(parsed);
  } catch {
    return "";
  }
}

export function parseCarrelJson(raw) {
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw)) {
      return cloneCarrel({ sessionConfigs: raw, scored: true });
    }
    if (raw.carrel || raw.probe || raw.room || raw.sessionCwd || raw.callerCwd || raw.preview_start) {
      return cloneCarrel({ ...raw, scored: true });
    }
    if (raw.configurations || raw.configs) {
      return cloneCarrel({
        sessionConfigs: parseLaunchJson(raw),
        scored: true,
      });
    }
    if (raw.name && !raw.sessionCwd) {
      return cloneCarrel({ requestedName: raw.name, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyCarrel();
  try {
    return parseCarrelJson(JSON.parse(text));
  } catch {
    const name = parsePreviewStart(text);
    if (name) return cloneCarrel({ requestedName: name, scored: true });
    return emptyCarrel();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, carrel: emptyCarrel() };
}
