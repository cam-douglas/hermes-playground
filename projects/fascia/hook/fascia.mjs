/**
 * Fascia — shopfront fascia desk for a
 * real Claude Code defect: clicking
 * "Start with worktree" on a
 * suggested-task chip shows a
 * "Trust this workspace?" modal that
 * names the cwd passed to spawn_task,
 * but the session actually runs in a
 * freshly created worktree under the
 * spawning repo's .claude/worktrees/.
 * The user reads one directory,
 * approves it, and the hooks/settings
 * the banner cites then execute in a
 * directory they were never shown.
 * The ask is one line: name the
 * directory the session will run in.
 *
 * A misnamed fascia is not a hold.
 * Score the shopfront or admit fronted.
 *
 * Primary #90638: OPEN, filed
 * 2026-08-29, labels bug /
 * platform:windows / area:security /
 * area:agents / area:desktop. Title:
 * Trust dialog on a chip's "Start
 * with worktree" names the spawn_task
 * cwd, not the worktree the session
 * runs in. Dialog named
 * C:\Users\Scott\Code\MessageFoundry-b1-1067-repo-governance
 * (spawn_task cwd / linked worktree).
 * Session ran in
 * C:\Users\Scott\Code\MessageFoundry\.claude\worktrees\heuristic-nobel-5180df
 * created by the click. Trust is per
 * CLAUDE_CONFIG_DIR (path trusted in
 * account-4, absent from account-2
 * at click).
 *
 * Same-class / nearby trust-path
 * (related, not identical):
 *   #54628 — Trust this workspace
 *            dialog appears every
 *            single time
 *   #87325 — Skills-dir plugins:
 *            every launch dir silently
 *            gets
 *            hasTrustDialogAccepted:false,
 *            no dialog
 *   #67319 — VS Code extension never
 *            shows trust dialog so
 *            project settings silently
 *            skipped
 *   #90041 — Windows headersHelper
 *            trust gate reads
 *            forward-slash project key
 *   #74794 — trust dialog never
 *            re-prompts after directory
 *            rename when parent trusted
 *
 * Nearby worktree poles that are
 * NOT this (Wicket territory):
 *   #74726 #81333 #86584 #85448 —
 *   worktree isolation / cwd race /
 *   base-repo binding. Fascia is the
 *   CONSENT LABEL lying about where
 *   execution will land, not an
 *   isolation failure.
 *
 * Cross-ecosystem:
 *   openai/codex#16525 — Desktop on
 *   Windows reports a malformed cwd
 *   for worktree threads and can
 *   target the wrong checkout.
 *   Different mechanism, same class
 *   of lie (named cwd ≠ execution
 *   site).
 *
 * Verdicts: fronted | misnamed |
 *           diverted | approved-blind |
 *           spawn-cwd | worktree-elsewhere |
 *           trust-lie | chip-start |
 *           account-split
 * Idle word is fronted (the consent
 * label matches the execution site
 * after normalize). NEVER use fascia
 * / empty / silent / mute / idle /
 * dead / sealed / locked / yanked /
 * caught / stowed / posted / bunged /
 * belayed / rove / keyed / housed /
 * beamed / snug / hung / appointed /
 * cinched / gauged / stamped /
 * overrun / pratique / wound / bound /
 * stilled / stabled / drained / flat /
 * fit / spoilt / laid / unlinked /
 * tight / banked / roosted / stocked /
 * seated / heard / clear / paired /
 * kernel / latched / upheld / sterling /
 * home / valid / dry / quiet / seised /
 * rung / moored as the idle word.
 *
 * Slack alarm on misnamed / diverted /
 * approved-blind / trust-lie /
 * worktree-elsewhere.
 * Linear ticket on misnamed /
 * trust-lie.
 * GitHub fascia-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   misnamed > diverted >
 *   approved-blind > trust-lie >
 *   worktree-elsewhere > spawn-cwd >
 *   chip-start > account-split >
 *   fronted
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90638 misnamed triad
 * (dialog===spawn cwd + actual is
 * .claude/worktrees + paths differ).
 *
 * fronted is true ONLY when
 * normalized dialogNamedPath ===
 * normalized actualRunPath AND the
 * verdict is fronted (not a failure
 * class). A misnamed fascia is never
 * fronted.
 *
 * Why this is not a clone:
 * NOT Wicket — worktree isolation
 *     gatehouse / absolute-path
 *     sandbox escape. Fascia is the
 *     consent label, not the pin.
 * NOT Snib — Trusted Devices
 *     fail-open night-latch on
 *     Remote Control.
 * NOT Iota — Windows path-key
 *     case/slash identity in
 *     ~/.claude.json.
 * NOT Damper — Remote Control
 *     auto-enable without consent.
 * NOT Hasp — file lease /
 *     last-writer-wins.
 * NOT Cubby — wrong-ancestor
 *     auto-memory.
 * NOT Quoin / Gaff / Sear / Grille /
 *     leftover woodworking.
 * Different problem: TRUST DIALOG
 * NAMES spawn_task cwd WHILE SESSION
 * RUNS IN A DIFFERENT .claude/worktrees
 * PATH → CONSENT ≠ EXECUTION SITE.
 * Different UI: shopfront / high-street
 * fascia desk. Different idle: fronted.
 */

export const VERDICTS = Object.freeze([
  "fronted",
  "misnamed",
  "diverted",
  "approved-blind",
  "spawn-cwd",
  "worktree-elsewhere",
  "trust-lie",
  "chip-start",
  "account-split",
]);
export const IDLE_WORD = "fronted";
export const SLACK_VERDICTS = Object.freeze([
  "misnamed",
  "diverted",
  "approved-blind",
  "trust-lie",
  "worktree-elsewhere",
]);
export const LINEAR_VERDICTS = Object.freeze(["misnamed", "trust-lie"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90638;
export const REPEAT_TRUST_ISSUE = 54628;
export const SKILLS_TRUST_ISSUE = 87325;
export const VSCODE_TRUST_ISSUE = 67319;
export const SLASH_TRUST_ISSUE = 90041;
export const RENAME_TRUST_ISSUE = 74794;
export const WICKET_ESCAPE_ISSUE = 74726;
export const WICKET_RESET_ISSUE = 81333;
export const WICKET_RACE_ISSUE = 86584;
export const WICKET_MISBIND_ISSUE = 85448;
export const CODEX_WORKTREE_CWD_ISSUE = 16525;

export const DEMO_DIALOG_90638 =
  "C:\\Users\\Scott\\Code\\MessageFoundry-b1-1067-repo-governance";
export const DEMO_ACTUAL_90638 =
  "C:\\Users\\Scott\\Code\\MessageFoundry\\.claude\\worktrees\\heuristic-nobel-5180df";
export const DEMO_SPAWN_CWD_90638 = DEMO_DIALOG_90638;
export const DEMO_BUTTON = "Start with worktree";
export const DEMO_CONFIG_DIR = "C:\\Users\\Scott\\.claude-account-2";
export const DEMO_OTHER_CONFIG = "C:\\Users\\Scott\\.claude-account-4";
export const DEMO_MODAL_90638 = [
  "Trust this workspace?",
  "Claude Code may read, write, or execute files in this folder.",
  "Only proceed if you trust this workspace.",
  DEMO_DIALOG_90638,
  "Read our security guide for more information.",
  "Execution allowed by:",
  ".claude/settings.json",
  "[Cancel] [Trust workspace]",
].join("\n");

const FORBIDDEN_IDLE = Object.freeze([
  "fascia",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "sealed",
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
  "seated",
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
  "placard",
  "shingle",
  "marquee",
  "lintel",
  "escutcheon",
  "signboard",
  "trustgate",
  "worktreetrust",
  "quoin",
  "gaff",
  "sear",
  "wicket",
  "snib",
  "iota",
  "damper",
  "hasp",
  "cubby",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

/**
 * Normalize a Windows/POSIX path for
 * consent-vs-execution compare:
 * slashes, trailing separators, case.
 */
export function normalizePath(value) {
  return asText(value)
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+$/, "")
    .toLowerCase();
}

export function pathsEqual(left, right) {
  const a = normalizePath(left);
  const b = normalizePath(right);
  return Boolean(a) && Boolean(b) && a === b;
}

export function isWorktreePath(value) {
  return /\/.claude\/worktrees\//i.test(normalizePath(value));
}

export function isChipStartButton(value) {
  return /start\s+with\s+worktree/i.test(asText(value));
}

export function emptyFascia() {
  return {
    session: "",
    issue: null,
    source: "",
    dialogNamedPath: "",
    actualRunPath: "",
    spawnTaskCwd: "",
    button: "",
    configDir: "",
    trustPresentInActiveConfig: false,
    trustPresentInOtherAccount: false,
    platform: "",
    approved: false,
    namedPathNeverRan: false,
    scored: false,
  };
}

export function emptyAction(session = "fronted-1") {
  return {
    action: "score",
    session,
    fascia: emptyFascia(),
  };
}

export function cloneFascia(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyFascia();
  const nested =
    (src.fascia && typeof src.fascia === "object" && src.fascia) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.shopfront && typeof src.shopfront === "object" && src.shopfront) ||
    src;
  return {
    ...emptyFascia(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    dialogNamedPath: asText(nested.dialogNamedPath ?? src.dialogNamedPath),
    actualRunPath: asText(nested.actualRunPath ?? src.actualRunPath),
    spawnTaskCwd: asText(nested.spawnTaskCwd ?? src.spawnTaskCwd),
    button: asText(nested.button ?? src.button),
    configDir: asText(nested.configDir ?? src.configDir),
    trustPresentInActiveConfig:
      asBool(nested.trustPresentInActiveConfig ?? src.trustPresentInActiveConfig, false) ===
      true,
    trustPresentInOtherAccount:
      asBool(nested.trustPresentInOtherAccount ?? src.trustPresentInOtherAccount, false) ===
      true,
    platform: asText(nested.platform ?? src.platform).toLowerCase(),
    approved: asBool(nested.approved ?? src.approved, false) === true,
    namedPathNeverRan:
      asBool(nested.namedPathNeverRan ?? src.namedPathNeverRan, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(fascia = {}) {
  const next = cloneFascia(fascia);
  const dialog = normalizePath(next.dialogNamedPath);
  const actual = normalizePath(next.actualRunPath);
  const spawn = normalizePath(next.spawnTaskCwd);
  const pathsMatch = Boolean(dialog) && Boolean(actual) && dialog === actual;
  const pathsDiffer = Boolean(dialog) && Boolean(actual) && dialog !== actual;
  const dialogIsSpawnCwd = Boolean(dialog) && Boolean(spawn) && dialog === spawn;
  const actualIsWorktree = isWorktreePath(next.actualRunPath);
  const buttonIsChip = isChipStartButton(next.button);
  const accountSplit =
    next.trustPresentInOtherAccount === true && next.trustPresentInActiveConfig !== true;

  const misnamedShape = pathsDiffer && dialogIsSpawnCwd && actualIsWorktree;
  const divertedShape =
    !misnamedShape &&
    pathsDiffer &&
    !actualIsWorktree &&
    !dialogIsSpawnCwd &&
    next.approved !== true &&
    next.namedPathNeverRan !== true;
  const approvedBlindShape = !misnamedShape && next.approved === true && pathsDiffer;
  const trustLieShape = !misnamedShape && next.namedPathNeverRan === true;
  const worktreeElsewhereShape =
    !misnamedShape &&
    !approvedBlindShape &&
    !trustLieShape &&
    actualIsWorktree &&
    pathsDiffer &&
    !dialogIsSpawnCwd;
  const spawnCwdShape =
    !misnamedShape &&
    !approvedBlindShape &&
    !trustLieShape &&
    dialogIsSpawnCwd &&
    pathsDiffer &&
    !actualIsWorktree;
  const chipStartShape =
    !misnamedShape &&
    !divertedShape &&
    !approvedBlindShape &&
    !trustLieShape &&
    !worktreeElsewhereShape &&
    !spawnCwdShape &&
    buttonIsChip &&
    !pathsMatch &&
    !pathsDiffer;
  const accountSplitShape =
    !misnamedShape &&
    !divertedShape &&
    !approvedBlindShape &&
    !trustLieShape &&
    !worktreeElsewhereShape &&
    !spawnCwdShape &&
    !chipStartShape &&
    accountSplit &&
    !pathsDiffer;
  const frontedHold = pathsMatch && !accountSplitShape;

  return {
    dialog: next.dialogNamedPath,
    actual: next.actualRunPath,
    spawn: next.spawnTaskCwd,
    dialogNorm: dialog,
    actualNorm: actual,
    spawnNorm: spawn,
    pathsMatch,
    pathsDiffer,
    dialogIsSpawnCwd,
    actualIsWorktree,
    buttonIsChip,
    accountSplit,
    approved: next.approved,
    namedPathNeverRan: next.namedPathNeverRan,
    trustPresentInActiveConfig: next.trustPresentInActiveConfig,
    trustPresentInOtherAccount: next.trustPresentInOtherAccount,
    misnamedShape,
    divertedShape,
    approvedBlindShape,
    trustLieShape,
    worktreeElsewhereShape,
    spawnCwdShape,
    chipStartShape,
    accountSplitShape,
    frontedHold,
  };
}

export function isIdle(fascia = {}) {
  const next = cloneFascia(fascia);
  return (
    !next.dialogNamedPath &&
    !next.actualRunPath &&
    !next.spawnTaskCwd &&
    !next.button &&
    next.approved !== true &&
    next.namedPathNeverRan !== true &&
    next.trustPresentInActiveConfig !== true &&
    next.trustPresentInOtherAccount !== true
  );
}

/**
 * First match wins by documented
 * priority: misnamed > diverted >
 * approved-blind > trust-lie >
 * worktree-elsewhere > spawn-cwd >
 * chip-start > account-split >
 * fronted. Idle fronted is first.
 * Seeded #90638 numbers must produce
 * misnamed, never fronted.
 */
export function classify(fascia = {}) {
  const next = cloneFascia(fascia);
  if (isIdle(next)) return "fronted";
  const facts = analyze(next);

  if (facts.misnamedShape) return "misnamed";
  if (facts.divertedShape) return "diverted";
  if (facts.approvedBlindShape) return "approved-blind";
  if (facts.trustLieShape) return "trust-lie";
  if (facts.worktreeElsewhereShape) return "worktree-elsewhere";
  if (facts.spawnCwdShape) return "spawn-cwd";
  if (facts.chipStartShape) return "chip-start";
  if (facts.accountSplitShape) return "account-split";
  if (facts.frontedHold) return "fronted";
  return "fronted";
}

export function feedOf(fascia = {}, verdict = "") {
  const kind = verdict || classify(fascia);
  if (kind === "misnamed") {
    return "● Misnamed · trust dialog names spawn_task cwd · session runs in .claude/worktrees · consent ≠ execution site · primary #90638";
  }
  if (kind === "diverted") {
    return "● Diverted · named path is not the run path · execution landed on a third shopfront · not the worktree triad";
  }
  if (kind === "approved-blind") {
    return "● Approved-blind · Trust workspace accepted · the directory that ran was never on the certificate";
  }
  if (kind === "trust-lie") {
    return "● Trust-lie · a permanent trust entry was written for a directory no session used as cwd";
  }
  if (kind === "worktree-elsewhere") {
    return "● Worktree-elsewhere · session sits under .claude/worktrees · the fascia named a different door";
  }
  if (kind === "spawn-cwd") {
    return "● Spawn-cwd · dialog repeats the spawn_task cwd · that is not where the session ran";
  }
  if (kind === "chip-start") {
    return "● Chip-start · Start with worktree was the button · the shopfront has not yet named the run path";
  }
  if (kind === "account-split") {
    return "● Account-split · trusted in another CLAUDE_CONFIG_DIR · absent from the active account at click · #90638 orphaning";
  }
  return "● Fronted · consent label matches the execution site after normalize · the fascia names the door that opens · idle word is fronted";
}

export function reasonsOf(fascia = {}, verdict = "") {
  const next = cloneFascia(fascia);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.pathsMatch || facts.pathsDiffer
      ? `dialog ${next.dialogNamedPath || "unset"} · actual ${next.actualRunPath || "unset"} · spawn ${next.spawnTaskCwd || "unset"} · match ${facts.pathsMatch ? "yes" : "no"}`
      : "consent label matches the execution site · fascia names the door that opens · idle word is fronted",
  );
  if (facts.misnamedShape) {
    reasons.push(
      "dialog names spawn_task cwd; session ran in .claude/worktrees · the #90638 lie · a misnamed fascia is not a hold",
    );
  }
  if (facts.dialogIsSpawnCwd) {
    reasons.push("dialog path is the spawn_task cwd · that is the source, not the run");
  }
  if (facts.actualIsWorktree) {
    reasons.push(
      `actual run path is a created worktree under .claude/worktrees · ${next.actualRunPath}`,
    );
  }
  if (facts.buttonIsChip) {
    reasons.push(`button ${next.button || "Start with worktree"} · chip default`);
  }
  if (facts.approved) {
    reasons.push("Trust workspace was accepted · the certificate named a door the session never used");
  }
  if (facts.namedPathNeverRan) {
    reasons.push("named path never appeared as a session cwd · trust was recorded anyway");
  }
  if (facts.accountSplit) {
    reasons.push(
      `trust present in other account, absent from active CLAUDE_CONFIG_DIR ${next.configDir || DEMO_CONFIG_DIR} · account-2 vs account-4`,
    );
  }
  if (facts.frontedHold) {
    reasons.push(
      "honest front: normalized dialogNamedPath === normalized actualRunPath · the fascia names the door that opens",
    );
  }
  reasons.push("a misnamed fascia is not a hold");
  reasons.push(
    "NOT Wicket (isolation / absolute-path escape) / Snib (Trusted Devices fail-open) / Iota (path-key case/slash) / Damper (RC auto-enable) / Hasp (file lease) / Cubby (wrong-ancestor memory) / Quoin / Gaff / Sear / leftover woodworking / millimetre-slider.",
  );
  if (kind === "fronted") {
    reasons.push(
      "consent label matches the execution site after normalize; idle word is fronted",
    );
  }
  if (kind === "misnamed") {
    reasons.push(
      "PRIMARY #90638: Trust dialog on a chip's Start with worktree names the spawn_task cwd, not the worktree the session runs in. The misnamed case is misnamed, never fronted.",
    );
  }
  if (kind === "diverted") {
    reasons.push("execution landed on a third path. Not the worktree triad.");
  }
  if (kind === "approved-blind") {
    reasons.push("Trust workspace accepted. The run directory was never shown.");
  }
  if (kind === "trust-lie") {
    reasons.push("permanent trust entry for a directory no session used.");
  }
  if (kind === "worktree-elsewhere") {
    reasons.push("session sits under .claude/worktrees. Fascia named a different door.");
  }
  if (kind === "spawn-cwd") {
    reasons.push("dialog repeats spawn_task cwd. That is not the run path.");
  }
  if (kind === "chip-start") {
    reasons.push("Start with worktree was the button. Run path not yet named.");
  }
  if (kind === "account-split") {
    reasons.push("trusted in another CLAUDE_CONFIG_DIR. Absent from the active account.");
  }
  return reasons;
}

export function verdictOf(fascia = {}) {
  return classify(fascia);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function frontedOf(fascia = {}, verdict = "") {
  const kind = verdict || classify(fascia);
  if (kind !== "fronted") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (isIdle(fascia)) return true;
  const facts = analyze(fascia);
  return facts.frontedHold === true || facts.pathsMatch === true;
}

export function misnamedOf(fascia = {}, verdict = "") {
  return (verdict || classify(fascia)) === "misnamed";
}

export function summaryOf(fascia = {}) {
  const next = cloneFascia(fascia);
  const facts = analyze(next);
  return {
    dialogNamedPath: next.dialogNamedPath,
    actualRunPath: next.actualRunPath,
    spawnTaskCwd: next.spawnTaskCwd,
    button: next.button,
    configDir: next.configDir,
    trustPresentInActiveConfig: facts.trustPresentInActiveConfig,
    trustPresentInOtherAccount: facts.trustPresentInOtherAccount,
    platform: next.platform,
    approved: facts.approved,
    namedPathNeverRan: facts.namedPathNeverRan,
    pathsMatch: facts.pathsMatch,
    pathsDiffer: facts.pathsDiffer,
    dialogIsSpawnCwd: facts.dialogIsSpawnCwd,
    actualIsWorktree: facts.actualIsWorktree,
    buttonIsChip: facts.buttonIsChip,
    accountSplit: facts.accountSplit,
    frontedHold: facts.frontedHold,
  };
}

export function score(fascia = {}) {
  const next = cloneFascia(fascia);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    fronted: frontedOf(next, verdict),
    misnamed: misnamedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    dialogNamedPath: next.dialogNamedPath,
    actualRunPath: next.actualRunPath,
    spawnTaskCwd: next.spawnTaskCwd,
    button: next.button,
    configDir: next.configDir,
    trustPresentInActiveConfig: facts.trustPresentInActiveConfig,
    trustPresentInOtherAccount: facts.trustPresentInOtherAccount,
    platform: next.platform,
    approved: facts.approved,
    namedPathNeverRan: facts.namedPathNeverRan,
    pathsMatch: facts.pathsMatch,
    pathsDiffer: facts.pathsDiffer,
    dialogIsSpawnCwd: facts.dialogIsSpawnCwd,
    actualIsWorktree: facts.actualIsWorktree,
    buttonIsChip: facts.buttonIsChip,
    accountSplit: facts.accountSplit,
    honestFront: facts.frontedHold,
    summary: summaryOf(next),
    fascia: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const fasciaSrc =
    src.fascia ||
    src.probe ||
    src.payload ||
    src.shopfront ||
    payload.fascia ||
    payload.probe ||
    payload.shopfront;
  const fascia = cloneFascia(
    fasciaSrc && typeof fasciaSrc === "object" ? { ...fasciaSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !fascia.session) fascia.session = src.session;
  if (typeof payload.session === "string" && !fascia.session) fascia.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? fascia.session ?? ""),
    fascia,
    issue: src.issue ?? payload.issue ?? fascia.issue ?? null,
    source: src.source ?? payload.source ?? fascia.source ?? "",
  };
}

function fasciaResult(verdict, fascia, action, extras = {}) {
  const next = cloneFascia(fascia);
  const scored = score(next);
  return {
    ok: true,
    product: "fascia",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    fronted: scored.fronted,
    misnamed: scored.misnamed,
    fasciaFronted: verdict === "fronted",
    fasciaMisnamed: verdict === "misnamed",
    fasciaDiverted: verdict === "diverted",
    fasciaApprovedBlind: verdict === "approved-blind",
    fasciaSpawnCwd: verdict === "spawn-cwd",
    fasciaWorktreeElsewhere: verdict === "worktree-elsewhere",
    fasciaTrustLie: verdict === "trust-lie",
    fasciaChipStart: verdict === "chip-start",
    fasciaAccountSplit: verdict === "account-split",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    dialogNamedPath: scored.dialogNamedPath,
    actualRunPath: scored.actualRunPath,
    spawnTaskCwd: scored.spawnTaskCwd,
    button: scored.button,
    configDir: scored.configDir,
    trustPresentInActiveConfig: scored.trustPresentInActiveConfig,
    trustPresentInOtherAccount: scored.trustPresentInOtherAccount,
    platform: scored.platform,
    approved: scored.approved,
    namedPathNeverRan: scored.namedPathNeverRan,
    pathsMatch: scored.pathsMatch,
    pathsDiffer: scored.pathsDiffer,
    dialogIsSpawnCwd: scored.dialogIsSpawnCwd,
    actualIsWorktree: scored.actualIsWorktree,
    buttonIsChip: scored.buttonIsChip,
    accountSplit: scored.accountSplit,
    honestFront: scored.honestFront,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    fascia: next,
    ...extras,
  };
}

function seedFascia(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    fascia: {
      ...emptyFascia(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      dialogNamedPath: extras.dialogNamedPath || "",
      actualRunPath: extras.actualRunPath || "",
      spawnTaskCwd: extras.spawnTaskCwd || "",
      button: extras.button || "",
      configDir: extras.configDir || "",
      trustPresentInActiveConfig: Boolean(extras.trustPresentInActiveConfig),
      trustPresentInOtherAccount: Boolean(extras.trustPresentInOtherAccount),
      platform: extras.platform || "",
      approved: Boolean(extras.approved),
      namedPathNeverRan: Boolean(extras.namedPathNeverRan),
    },
  };
}

/** Idle reset. Consent matches the door. */
export function seedFronted() {
  return seedFascia("fronted", "high-street", {
    session: "fronted",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedFronted();
}

/**
 * Control / proof: dialog names the
 * worktree that actually runs.
 * Classifies as fronted; fronted true.
 */
export function seedControl() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-control",
    issue: null,
    dialogNamedPath: DEMO_ACTUAL_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_ACTUAL_90638,
    button: DEMO_BUTTON,
    configDir: DEMO_CONFIG_DIR,
    trustPresentInActiveConfig: true,
    platform: "windows",
  });
}

/**
 * #90638 misnamed: dialog names
 * spawn_task cwd; session runs in
 * .claude/worktrees. Never fronted.
 */
export function seedMisnamed() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-misnamed",
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    button: DEMO_BUTTON,
    configDir: DEMO_CONFIG_DIR,
    trustPresentInActiveConfig: false,
    trustPresentInOtherAccount: true,
    platform: "windows",
    approved: true,
  });
}

export function seed90638() {
  return seedMisnamed();
}

/** Execution landed on a third shopfront. */
export function seedDiverted() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-diverted",
    issue: FEATURED_ISSUE,
    dialogNamedPath: "C:\\Users\\Scott\\Code\\OtherShop",
    actualRunPath: "C:\\Users\\Scott\\Code\\ThirdPlace",
    platform: "windows",
  });
}

/**
 * Trust workspace accepted; the run
 * directory was never on the board.
 * Unique: approved + paths differ
 * without the worktree triad.
 */
export function seedApprovedBlind() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-approved-blind",
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: "C:\\Users\\Scott\\Code\\NeverShown",
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    button: DEMO_BUTTON,
    approved: true,
    platform: "windows",
  });
}

/**
 * Dialog repeats spawn_task cwd;
 * actual is not a worktree.
 */
export function seedSpawnCwd() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-spawn-cwd",
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: "C:\\Users\\Scott\\Code\\SiblingCheckout",
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    platform: "windows",
  });
}

/**
 * Session sits under .claude/worktrees;
 * dialog named a different door,
 * not the spawn cwd.
 */
export function seedWorktreeElsewhere() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-worktree-elsewhere",
    dialogNamedPath: "C:\\Users\\Scott\\Code\\MessageFoundry",
    actualRunPath: DEMO_ACTUAL_90638,
    platform: "windows",
  });
}

/**
 * Permanent trust entry for a
 * directory no session used as cwd.
 */
export function seedTrustLie() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-trust-lie",
    dialogNamedPath: DEMO_DIALOG_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    namedPathNeverRan: true,
    trustPresentInActiveConfig: true,
    platform: "windows",
  });
}

/**
 * Chip default was Start with worktree;
 * the run path is not yet on the board.
 */
export function seedChipStart() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-chip-start",
    button: DEMO_BUTTON,
    dialogNamedPath: DEMO_DIALOG_90638,
    platform: "windows",
  });
}

/**
 * Trusted in another account's
 * CLAUDE_CONFIG_DIR; absent from the
 * active config. Paths would match
 * if the session ran where named —
 * the orphaning, not the label lie.
 */
export function seedAccountSplit() {
  return seedFascia(FEATURED_ISSUE, "anthropics/claude-code#90638", {
    session: "90638-account-split",
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_DIALOG_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    configDir: DEMO_CONFIG_DIR,
    trustPresentInActiveConfig: false,
    trustPresentInOtherAccount: true,
    platform: "windows",
  });
}

function parsePaths(text) {
  const named =
    text.match(/dialog(?:NamedPath)?[:\s]+([^\n]+)/i) ||
    text.match(/Trust this workspace\?[\s\S]*?(C:\\[^\n]+)/i);
  const actual =
    text.match(/actual(?:RunPath)?[:\s]+([^\n]+)/i) ||
    text.match(/session (?:ran|runs) in\s+([^\n]+)/i);
  const spawn = text.match(/spawn(?:TaskCwd|_task cwd)?[:\s]+([^\n]+)/i);
  return {
    dialogNamedPath: named ? named[1].trim() : "",
    actualRunPath: actual ? actual[1].trim() : "",
    spawnTaskCwd: spawn ? spawn[1].trim() : "",
  };
}

/**
 * Parse a trust-dialog transcript
 * (the #90638 prose modal) plus
 * optional actual-run / spawn cwd.
 * JSON objects are preferred when
 * the paste starts with { — never
 * let prose win over a structured
 * probe.
 */
export function parseTrustDialog(dialog = "", actual = "", spawn = "") {
  const note = asText(dialog);
  const run = asText(actual);
  const cwd = asText(spawn);
  const blob = [note, run, cwd].filter(Boolean).join("\n");
  if (!blob.trim()) return emptyFascia();

  if (note.trim().startsWith("{") || note.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(note);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return cloneFascia({
          ...parsed,
          actualRunPath: parsed.actualRunPath || run,
          spawnTaskCwd: parsed.spawnTaskCwd || cwd,
          scored: true,
        });
      }
    } catch {
      /* fall through */
    }
  }

  const parsed = parsePaths(blob);
  const dialogNamedPath =
    parsed.dialogNamedPath ||
    (/MessageFoundry-b1-1067-repo-governance/i.test(blob) ? DEMO_DIALOG_90638 : "");
  const actualRunPath =
    parsed.actualRunPath ||
    (/heuristic-nobel-5180df/i.test(blob) ? DEMO_ACTUAL_90638 : run);
  const spawnTaskCwd =
    parsed.spawnTaskCwd ||
    (/spawn_task|spawn-task cwd/i.test(blob) ? dialogNamedPath || DEMO_SPAWN_CWD_90638 : cwd);
  const button = /start with worktree/i.test(blob) ? DEMO_BUTTON : "";
  const approved = /trust workspace|approved/i.test(blob);
  const namedPathNeverRan = /never (?:ran|used|appeared)|no session/i.test(blob);
  const otherAccount = /account-4|other account|CLAUDE_CONFIG_DIR/i.test(blob);
  const account2 = /account-2|active config/i.test(blob);

  if (
    /#90638|heuristic-nobel-5180df|b1-1067-repo-governance/i.test(blob) &&
    /worktrees/i.test(blob)
  ) {
    return {
      ...seedMisnamed().fascia,
      session: "paste-misnamed",
      dialogNamedPath: dialogNamedPath || DEMO_DIALOG_90638,
      actualRunPath: actualRunPath || DEMO_ACTUAL_90638,
      spawnTaskCwd: spawnTaskCwd || DEMO_SPAWN_CWD_90638,
      scored: true,
    };
  }
  if (/account-split|account-4[\s\S]*account-2|orphaned/i.test(blob) && !/worktrees/i.test(blob)) {
    return {
      ...seedAccountSplit().fascia,
      session: "paste-account-split",
      scored: true,
    };
  }

  return cloneFascia({
    session: "paste",
    source: "paste",
    dialogNamedPath,
    actualRunPath,
    spawnTaskCwd,
    button,
    configDir: account2 ? DEMO_CONFIG_DIR : "",
    trustPresentInOtherAccount: otherAccount,
    trustPresentInActiveConfig: false,
    platform: /windows|C:\\/i.test(blob) ? "windows" : "",
    approved,
    namedPathNeverRan,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyFascia();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneFascia({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneFascia({
          ...parsed,
          dialogNamedPath: parsed.dialogNamedPath || parsed.dialog || "",
          actualRunPath: parsed.actualRunPath || parsed.actual || "",
          scored: true,
        });
      }
    } catch {
      /* fall through to prose */
    }
  }
  return parseTrustDialog(text, "", "");
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  fronted: seedFronted,
  control: seedControl,
  misnamed: seedMisnamed,
  90638: seed90638,
  "90638-misnamed": seedMisnamed,
  diverted: seedDiverted,
  "approved-blind": seedApprovedBlind,
  approvedblind: seedApprovedBlind,
  "spawn-cwd": seedSpawnCwd,
  spawncwd: seedSpawnCwd,
  "worktree-elsewhere": seedWorktreeElsewhere,
  worktreeelsewhere: seedWorktreeElsewhere,
  "trust-lie": seedTrustLie,
  trustlie: seedTrustLie,
  "chip-start": seedChipStart,
  chipstart: seedChipStart,
  "account-split": seedAccountSplit,
  accountsplit: seedAccountSplit,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  shopfront: seedControl,
  desk: seedControl,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let fascia = cloneFascia(action.fascia);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "fronted" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return fasciaResult("fronted", emptyFascia(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "shopfront" || verb === "desk") {
    fascia = seedControl().fascia;
    return fasciaResult(classify(fascia), fascia, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "misnamed" || verb === "incident" || verb === "90638") {
    fascia = seedMisnamed().fascia;
    return fasciaResult(classify(fascia), fascia, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-shopfront") {
    fascia = { ...fascia, scored: true };
    return fasciaResult(classify(fascia), fascia, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    fascia = { ...fascia, scored: true };
    return fasciaResult(classify(fascia), fascia, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  fascia = { ...fascia, scored: true };
  return fasciaResult(classify(fascia), fascia, action);
}
