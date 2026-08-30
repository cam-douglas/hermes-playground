/**
 * Pale — Tudor / medieval
 * jurisdiction pale (a fenced
 * parish) for a real Claude Code
 * defect: project hooks fail open
 * with zero signal when the
 * session's project root is not
 * the directory that holds
 * `.claude/settings.json`. Start
 * one directory above a repo, or
 * from a monorepo package
 * subdirectory, and every
 * PreToolUse / PostToolUse / Stop
 * hook is silently absent. The
 * fence never walked up. cwd can
 * even be the repo. Nothing warns.
 *
 * A session beyond the pale is
 * not a hold. Score the fence or
 * admit bound.
 *
 * Primary #90683: OPEN, filed
 * 2026-08-30. Title: Hooks are
 * silently absent when the
 * project root isn't the repo
 * root. Labels: bug, area:hooks.
 *
 * Same-class nearby (scoreable,
 * not the primary):
 *   #76441 Launching from a
 *     subdirectory silently loads
 *     ZERO project hooks
 *   #79111 Subdirectory launches
 *     skip repo-root hooks
 *     (fail-open) while permission
 *     grants still persist
 *   #86187 `.claude/settings.json`
 *     ignored from a subdirectory
 *     (still repros; cites #10367,
 *     #8810)
 *   #79480 PreToolUse hooks in
 *     project `.claude/settings.json`
 *     are silently not registered
 *   #89215 Claude Code on the Web:
 *     repository settings silently
 *     ignored, hooks never run
 *   #78505 Cloud multi-repo
 *     sessions never load repo
 *     settings; CLAUDE_PROJECT_DIR
 *     empty
 *   #88871 FEATURE: Load trusted
 *     hooks from nested repos /
 *     --add-dir directories
 *
 * Related, different (label, do
 * not treat as this bug):
 *   #90647 Chatelaine — mcpOAuth
 *     nested inside Anthropic
 *     Keychain identity
 *   #90672 Waif — Bash timeout
 *     does not kill child tree
 *   #90668 Berth — spawn_task
 *     chip shares parent tree
 *   #90661 Carrel — launch.json
 *     resolved from session cwd
 *   #90662 Byline — phantom hook
 *     agent_id
 *   #90638 Fascia — trust dialog
 *     names wrong cwd
 *   Damper — remote-control auto-on
 *   Snib — trusted-devices fail-open
 *
 * Cross-ecosystem nearby, not
 * identical:
 *   openai/codex#28903 AGENTS.md
 *     not loaded from ancestor
 *     directories above repo root
 *   openai/codex#30789 submodule
 *     walk stops; superproject
 *     AGENTS.md silently ignored
 *   openai/codex#38065 AGENTS.md
 *     not resolved per repository
 *     in multi-root workspaces
 *
 * Verdicts: bound | beyond |
 *           unhooked | rootless |
 *           silent | above |
 *           subdir | walkless |
 *           fail-open | off-pale
 * Idle word is bound (within the
 * pale / hooks bound).
 * NEVER use bound for a failure.
 * NEVER use pale / empty / silent /
 * mute / idle / sheltered /
 * alongside / seated / credited /
 * level / verbatim / fronted /
 * locked / yanked / caught /
 * stowed / posted / bunged /
 * belayed / rove / keyed / housed /
 * beamed / snug / hung / appointed /
 * cinched / gauged / stamped /
 * overrun / pratique / wound /
 * girt / nested / cut / switched /
 * spilled as the idle word.
 *
 * Slack chip + Linear ticket on
 * beyond / unhooked / rootless /
 * silent / above / subdir /
 * walkless / fail-open. GitHub
 * pale-ledger of scored intakes
 * on every score.
 *
 * Priority when multiple match:
 *   unique nearby without the
 *   #90683 triad
 *     (wrong project root +
 *     settings present
 *     below/elsewhere + hooks
 *     absent with no warning)
 *   keep their own seeds
 *   > beyond (triad)
 *   > fail-open
 *   > unhooked
 *   > above
 *   > walkless
 *   > silent
 *   > rootless
 *   > bound
 *
 * Unique nearby flags win their
 * own seeds because those seeds
 * do not carry the #90683 triad.
 *
 * bound is true ONLY when the
 * verdict is bound (idle, or
 * honest control: session project
 * root == directory containing
 * `.claude/settings.json`; hooks
 * registered and would fire).
 * Seeded 90683 numbers must
 * produce beyond / bound=false.
 * A session beyond the pale is
 * never bound.
 *
 * Why this is not a clone:
 * NOT Chatelaine — mcpOAuth
 *     nested inside identity.
 *     Opposite storage problem.
 * NOT Waif — Bash timeout does
 *     not kill child process tree.
 * NOT Berth — shared spawn_task
 *     tree.
 * NOT Carrel — launch.json from
 *     session cwd.
 * NOT Byline — phantom hook
 *     agent_id.
 * NOT Fascia — trust dialog
 *     names wrong cwd.
 * NOT Damper / Snib — different
 *     fail-open surfaces.
 * NOT leftover woodworking /
 *     millimetre-slider /
 *     chatelaine-chain /
 *     foundling / harbour clones.
 * Different problem: project
 * hooks fail open with zero
 * signal when project root ≠
 * settings-bearing directory.
 * Different UI: Tudor pale
 * fence / peat ditch / iron-gall
 * / limestone boundary stones.
 * Different idle: bound.
 */

export const VERDICTS = Object.freeze([
  "bound",
  "beyond",
  "unhooked",
  "rootless",
  "silent",
  "above",
  "subdir",
  "walkless",
  "fail-open",
  "off-pale",
]);
export const IDLE_WORD = "bound";
export const SLACK_VERDICTS = Object.freeze([
  "beyond",
  "unhooked",
  "rootless",
  "silent",
  "above",
  "subdir",
  "walkless",
  "fail-open",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90683;
export const NEARBY_76441 = 76441;
export const NEARBY_79111 = 79111;
export const NEARBY_86187 = 86187;
export const NEARBY_79480 = 79480;
export const NEARBY_89215 = 89215;
export const NEARBY_78505 = 78505;
export const NEARBY_88871 = 88871;
export const RELATED_CHATELAINE = 90647;
export const RELATED_WAIF = 90672;
export const RELATED_BERTH = 90668;
export const RELATED_CARREL = 90661;
export const RELATED_BYLINE = 90662;
export const RELATED_FASCIA = 90638;
export const CODEX_ANCESTOR_AGENTS = 28903;
export const CODEX_SUBMODULE_AGENTS = 30789;
export const CODEX_MULTIROOT_AGENTS = 38065;

export const DEMO_REPO = "/work/acme";
export const DEMO_PARENT = "/work";
export const DEMO_SUBDIR = "/work/acme/packages/app";
export const DEMO_SETTINGS = "/work/acme/.claude/settings.json";
export const DEMO_HOOKS = 3;
export const DEMO_DAY = "2026-08-30";
export const DEMO_VERSION = "pale-fence";

const FORBIDDEN_IDLE = Object.freeze([
  "pale",
  "empty",
  "silent",
  "mute",
  "idle",
  "sheltered",
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
  "girt",
  "nested",
  "cut",
  "switched",
  "spilled",
  "bailey",
  "soke",
  "stile",
  "limen",
  "verge",
  "franchise",
  "bailiwick",
  "precinct",
  "demesne",
  "march",
  "mark",
  "stockade",
  "enceinte",
  "motte",
  "keep",
  "barbican",
  "postern",
  "outparish",
  "wapentake",
  "chatelaine",
  "waif",
  "berth",
  "carrel",
  "byline",
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

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    settingsPresentOnDisk: null,
    sessionProjectRoot: "",
    settingsDir: "",
    rootsMatch: null,
    hooksRegisteredCount: 0,
    warningEmitted: null,
    startedAboveRepo: null,
    startedInSubdir: null,
    walkUpAttempted: null,
    toolProceededUnhooked: null,
    nearbySubdirMiss: false,
    nearbyWebIgnore: false,
    nearbyCloudEmpty: false,
    nearby: "",
    scored: false,
  };
}

function nestObject(src) {
  if (src.pale && typeof src.pale === "object") return src.pale;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.intake && typeof src.intake === "object") return src.intake;
  if (src.fence && typeof src.fence === "object") return src.fence;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    settingsPresentOnDisk: asNullableBool(
      nested.settingsPresentOnDisk ?? src.settingsPresentOnDisk,
    ),
    sessionProjectRoot: asText(
      nested.sessionProjectRoot || src.sessionProjectRoot || base.sessionProjectRoot,
    ),
    settingsDir: asText(nested.settingsDir || src.settingsDir || base.settingsDir),
    rootsMatch: asNullableBool(nested.rootsMatch ?? src.rootsMatch),
    hooksRegisteredCount: asNum(
      nested.hooksRegisteredCount ?? src.hooksRegisteredCount,
      0,
    ),
    warningEmitted: asNullableBool(nested.warningEmitted ?? src.warningEmitted),
    startedAboveRepo: asNullableBool(
      nested.startedAboveRepo ?? src.startedAboveRepo,
    ),
    startedInSubdir: asNullableBool(
      nested.startedInSubdir ?? src.startedInSubdir,
    ),
    walkUpAttempted: asNullableBool(
      nested.walkUpAttempted ?? src.walkUpAttempted,
    ),
    toolProceededUnhooked: asNullableBool(
      nested.toolProceededUnhooked ?? src.toolProceededUnhooked,
    ),
    nearbySubdirMiss: asBool(nested.nearbySubdirMiss ?? src.nearbySubdirMiss, false),
    nearbyWebIgnore: asBool(nested.nearbyWebIgnore ?? src.nearbyWebIgnore, false),
    nearbyCloudEmpty: asBool(nested.nearbyCloudEmpty ?? src.nearbyCloudEmpty, false),
    nearby: asText(nested.nearby || src.nearby || ""),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function isOffPale(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "waif" ||
    nearby === "90672" ||
    nearby === "berth" ||
    nearby === "90668" ||
    nearby === "carrel" ||
    nearby === "90661" ||
    nearby === "byline" ||
    nearby === "90662" ||
    nearby === "fascia" ||
    nearby === "90638" ||
    nearby === "damper" ||
    nearby === "snib"
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.settingsPresentOnDisk != null ||
    probe.sessionProjectRoot ||
    probe.settingsDir ||
    probe.rootsMatch != null ||
    probe.hooksRegisteredCount ||
    probe.warningEmitted != null ||
    probe.startedAboveRepo != null ||
    probe.startedInSubdir != null ||
    probe.walkUpAttempted != null ||
    probe.toolProceededUnhooked != null ||
    probe.nearbySubdirMiss ||
    probe.nearbyWebIgnore ||
    probe.nearbyCloudEmpty ||
    isOffPale(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const settingsPresent = row.settingsPresentOnDisk === true;
  const rootsMiss = row.rootsMatch === false;
  const rootsMatch = row.rootsMatch === true;
  const hooksZero = row.hooksRegisteredCount === 0;
  const noWarn = row.warningEmitted === false;
  const above = row.startedAboveRepo === true;
  const inSubdir = row.startedInSubdir === true;
  const walkless = row.walkUpAttempted === false;
  const failOpen = row.toolProceededUnhooked === true;
  const uniqueNearby = Boolean(
    row.nearbySubdirMiss || row.nearbyWebIgnore || row.nearbyCloudEmpty || isOffPale(row),
  );
  const triad = Boolean(
    settingsPresent && rootsMiss && hooksZero && noWarn && !uniqueNearby,
  );
  const honestHold = Boolean(
    settingsPresent &&
      rootsMatch &&
      row.hooksRegisteredCount > 0 &&
      failOpen !== true &&
      row.nearbySubdirMiss !== true &&
      row.nearbyWebIgnore !== true &&
      row.nearbyCloudEmpty !== true &&
      !isOffPale(row),
  );

  let eventClass = "idle";
  if (isOffPale(row) && !triad) eventClass = "off-pale";
  else if (row.nearbySubdirMiss && !triad) eventClass = "subdir";
  else if (row.nearbyWebIgnore && !triad) eventClass = "silent";
  else if (row.nearbyCloudEmpty && !triad) eventClass = "rootless";
  else if (triad) eventClass = "beyond";
  else if (failOpen && hooksZero && !triad) eventClass = "fail-open";
  else if (settingsPresent && hooksZero && rootsMatch && !triad) eventClass = "unhooked";
  else if (above && !triad) eventClass = "above";
  else if (walkless && !rootsMatch && settingsPresent) eventClass = "walkless";
  else if (noWarn && (hooksZero || rootsMiss) && !honestHold) eventClass = "silent";
  else if (rootsMiss) eventClass = "rootless";
  else if (honestHold || isIdle(row)) eventClass = "bound";
  else eventClass = "bound";

  return {
    settingsPresent,
    rootsMiss,
    rootsMatch,
    hooksZero,
    noWarn,
    above,
    inSubdir,
    walkless,
    failOpen,
    uniqueNearby,
    triad,
    honestHold,
    offPale: isOffPale(row),
    eventClass,
    hooksRegisteredCount: row.hooksRegisteredCount,
    sessionProjectRoot: row.sessionProjectRoot,
    settingsDir: row.settingsDir,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "bound";
  const facts = analyze(row);
  if (!facts.triad) {
    if (facts.offPale) return "off-pale";
    if (row.nearbySubdirMiss) return "subdir";
    if (row.nearbyWebIgnore) return "silent";
    if (row.nearbyCloudEmpty) return "rootless";
  }
  if (facts.triad) return "beyond";
  if (facts.failOpen && facts.hooksZero) return "fail-open";
  if (facts.settingsPresent && facts.hooksZero && facts.rootsMatch) return "unhooked";
  if (facts.above) return "above";
  if (facts.walkless && !facts.rootsMatch && facts.settingsPresent) return "walkless";
  if (facts.noWarn && (facts.hooksZero || facts.rootsMiss) && !facts.honestHold) {
    return "silent";
  }
  if (facts.rootsMiss) return "rootless";
  return "bound";
}

export function feedOf(kind) {
  if (kind === "beyond") {
    return "● Beyond · started outside the repo that holds .claude/settings.json · hooks absent · no warning · primary #90683";
  }
  if (kind === "unhooked") {
    return "● Unhooked · settings file present on disk under the repo · zero hooks armed in the session";
  }
  if (kind === "rootless") {
    return "● Rootless · project root resolution missed the settings-bearing directory";
  }
  if (kind === "silent") {
    return "● Silent · no misconfiguration signal / no warning at session start";
  }
  if (kind === "above") {
    return "● Above · session started in a parent of the repo that holds settings";
  }
  if (kind === "subdir") {
    return "● Subdir · nearby #76441/#79111/#86187 launched from a package subdirectory · no walk-up";
  }
  if (kind === "walkless") {
    return "● Walkless · loader never walks up to find .claude/settings.json";
  }
  if (kind === "fail-open") {
    return "● Fail-open · a write or tool proceeded without the hook that should have blocked it";
  }
  if (kind === "off-pale") {
    return "● Off-pale · Chatelaine / Waif / Berth / Carrel / Byline-shaped different bug · labeled, not this fence";
  }
  return "● Bound · session project root == directory containing .claude/settings.json · hooks registered and would fire · idle word is bound";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "beyond" || facts.triad) {
    reasons.push(
      "#90683 wrong project root + settings present below/elsewhere + hooks absent with no warning",
    );
  }
  if (facts.settingsPresent) {
    reasons.push(".claude/settings.json present on disk under the repo");
  }
  if (facts.rootsMiss) {
    reasons.push(
      `session project root ${row.sessionProjectRoot || "—"} ≠ settings dir ${row.settingsDir || "—"}`,
    );
  }
  if (facts.rootsMatch) {
    reasons.push("session project root matches the settings-bearing directory");
  }
  if (facts.hooksZero && !isIdle(row)) {
    reasons.push("zero PreToolUse / PostToolUse / Stop hooks registered in session");
  }
  if (row.hooksRegisteredCount > 0) {
    reasons.push(`${row.hooksRegisteredCount} hook(s) registered and would fire`);
  }
  if (facts.noWarn) reasons.push("no misconfiguration warning at session start");
  if (facts.above) reasons.push("session started in a parent of the repo");
  if (facts.inSubdir) reasons.push("session started in a package subdirectory");
  if (facts.walkless) reasons.push("loader never walked up to find .claude/settings.json");
  if (facts.failOpen) {
    reasons.push("a write a hook should have blocked went through");
  }
  if (row.nearbySubdirMiss || kind === "subdir") {
    reasons.push("nearby #76441/#79111/#86187 subdirectory launch · no walk-up");
  }
  if (row.nearbyWebIgnore) {
    reasons.push("nearby #89215 Claude Code on the Web silently ignored repo settings");
  }
  if (row.nearbyCloudEmpty || kind === "rootless") {
    if (row.nearbyCloudEmpty) {
      reasons.push("nearby #78505 cloud multi-repo · CLAUDE_PROJECT_DIR empty");
    }
  }
  if (kind === "walkless") {
    reasons.push("nearby #88871 feature: load trusted hooks from nested repos / --add-dir");
  }
  if (kind === "unhooked") {
    reasons.push("nearby #79480 PreToolUse hooks in project settings silently not registered");
  }
  if (facts.offPale || kind === "off-pale") {
    reasons.push(
      "off-pale nearby: Chatelaine #90647 / Waif #90672 / Berth #90668 / Carrel #90661 / Byline #90662 / Fascia #90638 / Damper / Snib — labeled, not this fence",
    );
  }
  if (kind === "bound") {
    reasons.push(
      "session project root == settings dir; hooks armed; walk-up or explicit root correct; idle word is bound",
    );
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "beyond") {
    return "Pale beyond · hooks silently absent · fence never walked up · #90683";
  }
  if (kind === "unhooked") {
    return "Pale unhooked · settings on disk · zero hooks armed";
  }
  if (kind === "rootless") {
    return "Pale rootless · project root missed the settings-bearing directory";
  }
  if (kind === "silent") {
    return "Pale silent · no warning at session start";
  }
  if (kind === "above") {
    return "Pale above · session started in a parent of the repo";
  }
  if (kind === "subdir") {
    return "Pale subdir · package subdirectory launch · zero project hooks";
  }
  if (kind === "walkless") {
    return "Pale walkless · loader never walks up to .claude/settings.json";
  }
  if (kind === "fail-open") {
    return `Pale fail-open · a write proceeded unhooked · ${facts.hooksRegisteredCount || 0} hooks armed`;
  }
  return "";
}

function fenceResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const alarm = SLACK_VERDICTS.includes(kind);
  return {
    product: "pale",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    bound: kind === "bound",
    beyond: kind === "beyond",
    unhooked: kind === "unhooked",
    rootless: kind === "rootless",
    silent: kind === "silent",
    above: kind === "above",
    subdir: kind === "subdir",
    walkless: kind === "walkless",
    "fail-open": kind === "fail-open",
    "off-pale": kind === "off-pale",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "bound" && kind !== "off-pale",
    offPale: facts.offPale,
    slackCopy: slackCopy(kind, facts),
    facts: {
      settingsPresentOnDisk: facts.settingsPresent,
      sessionProjectRoot: facts.sessionProjectRoot,
      settingsDir: facts.settingsDir,
      rootsMatch: probe.rootsMatch,
      hooksRegisteredCount: facts.hooksRegisteredCount,
      warningEmitted: probe.warningEmitted,
      startedAboveRepo: facts.above,
      startedInSubdir: facts.inSubdir,
      walkUpAttempted: probe.walkUpAttempted,
      toolProceededUnhooked: facts.failOpen,
      nearbySubdirMiss: probe.nearbySubdirMiss,
      nearbyWebIgnore: probe.nearbyWebIgnore,
      nearbyCloudEmpty: probe.nearbyCloudEmpty,
      triad: facts.triad,
      offPale: facts.offPale,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  return fenceResult(kind, row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function boundOf(probe = {}) {
  return classify(probe) === "bound";
}

export function flagsOf(probe = {}) {
  return analyze(probe);
}

export function reasonsList(probe = {}) {
  return reasonsOf(probe, classify(probe));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    pale: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedBound() {
  return baseSeed("bound-hold", FEATURED_ISSUE, {
    source: "honest control: project root matches settings dir; hooks armed",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_REPO,
    settingsDir: DEMO_REPO,
    rootsMatch: true,
    hooksRegisteredCount: DEMO_HOOKS,
    warningEmitted: false,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: true,
    toolProceededUnhooked: false,
  });
}

export function seedControl() {
  return seedBound();
}

export function seedReset() {
  return { action: "bail", pale: emptyProbe() };
}

export function seedBeyond() {
  return baseSeed("90683-beyond", FEATURED_ISSUE, {
    source: "primary #90683 started above the repo; hooks silently absent",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_PARENT,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 0,
    warningEmitted: false,
    startedAboveRepo: true,
    startedInSubdir: false,
    walkUpAttempted: false,
    toolProceededUnhooked: true,
  });
}

export function seed90683() {
  return seedBeyond();
}

export function seedUnhooked() {
  return baseSeed("79480-unhooked", NEARBY_79480, {
    source: "nearby #79480 PreToolUse hooks in project settings silently not registered",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_REPO,
    settingsDir: DEMO_REPO,
    rootsMatch: true,
    hooksRegisteredCount: 0,
    warningEmitted: true,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: true,
    toolProceededUnhooked: false,
  });
}

export function seedRootless() {
  return baseSeed("78505-rootless", NEARBY_78505, {
    source: "nearby #78505 cloud multi-repo · CLAUDE_PROJECT_DIR empty",
    settingsPresentOnDisk: true,
    sessionProjectRoot: "",
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 1,
    warningEmitted: true,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: true,
    toolProceededUnhooked: false,
    nearbyCloudEmpty: true,
  });
}

export function seedSilent() {
  return baseSeed("89215-silent", NEARBY_89215, {
    source: "nearby #89215 Claude Code on the Web silently ignored repo settings",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_REPO,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 2,
    warningEmitted: false,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: true,
    toolProceededUnhooked: false,
    nearbyWebIgnore: true,
  });
}

export function seedAbove() {
  return baseSeed("90683-above", FEATURED_ISSUE, {
    source: "session started in a parent of the repo; warning did fire",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_PARENT,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 0,
    warningEmitted: true,
    startedAboveRepo: true,
    startedInSubdir: false,
    walkUpAttempted: false,
    toolProceededUnhooked: false,
  });
}

export function seedSubdir() {
  return baseSeed("76441-subdir", NEARBY_76441, {
    source: "nearby #76441/#79111/#86187 launched from a package subdirectory",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_SUBDIR,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 0,
    warningEmitted: false,
    startedAboveRepo: false,
    startedInSubdir: true,
    walkUpAttempted: false,
    toolProceededUnhooked: false,
    nearbySubdirMiss: true,
  });
}

export function seedWalkless() {
  return baseSeed("88871-walkless", NEARBY_88871, {
    source: "nearby #88871 loader never walks up to find .claude/settings.json",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_SUBDIR,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 0,
    warningEmitted: true,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: false,
    toolProceededUnhooked: false,
  });
}

export function seedFailOpen() {
  return baseSeed("90683-fail-open", FEATURED_ISSUE, {
    source: "a write a hook should have blocked went through; roots matched",
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_REPO,
    settingsDir: DEMO_REPO,
    rootsMatch: true,
    hooksRegisteredCount: 0,
    warningEmitted: true,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: true,
    toolProceededUnhooked: true,
  });
}

export function seedOffPale() {
  return baseSeed("off-pale-chatelaine", RELATED_CHATELAINE, {
    source: "NOT this: Chatelaine #90647 mcpOAuth nested inside identity",
    nearby: "chatelaine",
    settingsPresentOnDisk: false,
    sessionProjectRoot: "",
    settingsDir: "",
    rootsMatch: null,
    hooksRegisteredCount: 0,
    warningEmitted: null,
    startedAboveRepo: false,
    startedInSubdir: false,
    walkUpAttempted: null,
    toolProceededUnhooked: false,
  });
}

const SEEDS = {
  bound: seedBound,
  control: seedBound,
  healthy: seedBound,
  hold: seedBound,
  beyond: seedBeyond,
  90683: seedBeyond,
  "90683": seedBeyond,
  unhooked: seedUnhooked,
  79480: seedUnhooked,
  "79480": seedUnhooked,
  rootless: seedRootless,
  78505: seedRootless,
  "78505": seedRootless,
  silent: seedSilent,
  89215: seedSilent,
  "89215": seedSilent,
  above: seedAbove,
  subdir: seedSubdir,
  76441: seedSubdir,
  "76441": seedSubdir,
  79111: seedSubdir,
  "79111": seedSubdir,
  86187: seedSubdir,
  "86187": seedSubdir,
  walkless: seedWalkless,
  88871: seedWalkless,
  "88871": seedWalkless,
  "fail-open": seedFailOpen,
  failopen: seedFailOpen,
  "off-pale": seedOffPale,
  offpale: seedOffPale,
  chatelaine: seedOffPale,
  90647: seedOffPale,
  "90647": seedOffPale,
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
    return { action: payload, pale: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const pale = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || pale.session),
    issue: asIssue(src.issue ?? pale.issue),
    source: asText(src.source || pale.source),
    pale,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.pale);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "bound" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return fenceResult("bound", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedBound().pale;
    return fenceResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "beyond" || verb === "incident" || verb === "90683") {
    probe = seedBeyond().pale;
    return fenceResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-pale") {
    probe = { ...probe, scored: true };
    return fenceResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return fenceResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return fenceResult(classify(probe), probe, action);
}

export function parsePaleJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.pale ||
      raw.probe ||
      raw.intake ||
      raw.fence ||
      raw.settingsPresentOnDisk != null ||
      raw.sessionProjectRoot != null ||
      raw.rootsMatch != null ||
      raw.hooksRegisteredCount != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parsePaleJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, pale: emptyProbe() };
}
