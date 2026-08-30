/**
 * Tally — stevedore / dock chalk-stick
 * desk for a real Claude Code defect:
 * the interactive worktree `/exit`
 * dialog counts commits since
 * worktree *creation*
 * (`git rev-list --count CLAUDE_BASE..HEAD`,
 * CLAUDE_BASE stored in
 * `.git/worktrees/<name>/CLAUDE_BASE`),
 * not unmerged or unpushed work. It
 * warns "You have N commits… All
 * changes and commits will be lost"
 * even when
 * `git rev-list --count origin/main..HEAD`
 * is 0. After
 * `git merge --ff-only origin/main`
 * inside the worktree the dialog
 * count can *grow* while risk shrinks.
 * Only resetting HEAD to the
 * creation-time state returns N to 0.
 *
 * A birth-counted tally is not a
 * hold. Score the board or admit
 * squared.
 *
 * Primary #90692: OPEN, filed
 * 2026-08-30. Labels: bug, has
 * repro, platform:linux, area:tools.
 * Title: Worktree exit dialog counts
 * commits since worktree creation
 * (CLAUDE_BASE), not unmerged work —
 * warns 'will be lost' for fully
 * pushed and merged commits.
 *
 * Related but DISTINCT (cite as
 * contrast, not as this product):
 *   #84856 (closed) and #78355
 *     (open) / #40137 / #71135 —
 *     ExitWorktree *tool* ancestry
 *     check against the default
 *     branch false-positives after
 *     **squash** merges. Tally is
 *     the *interactive* exit dialog
 *     with baseline = worktree
 *     birth. No squash needed;
 *     regular/ff merges still leave
 *     N>0.
 *
 * Same-class / nearby priors
 * (lifecycle confusion, not clones):
 *   openai/codex#35383 worktree
 *     lifecycle / auto-delete
 *   openai/codex#34352
 *     continue-in-worktree cwd
 *
 * Verdicts: squared | birth-counted |
 *           false-loss | merged-still-n |
 *           push-blind | base-frozen |
 *           remount-grew | origin-zero |
 *           chalked | keep-or-lose
 * Idle word is squared (accounts
 * squared / dock tally squared).
 * NEVER use squared for a failure.
 *
 * Slack chip + Linear ticket on
 * false-loss / remount-grew /
 * merged-still-n / push-blind /
 * origin-zero / base-frozen /
 * chalked / birth-counted.
 * GitHub tally-ledger of scored
 * intakes on every score.
 *
 * Priority when multiple match:
 *   unique nearby without the
 *   #90692 triad
 *     (birthCount>0 + originCount=0
 *     + dialogClaimsLoss + pushed
 *     + merged + not squash)
 *   keep their own seeds
 *   > false-loss (triad)
 *   > remount-grew
 *   > merged-still-n
 *   > push-blind
 *   > origin-zero
 *   > base-frozen
 *   > chalked
 *   > birth-counted
 *   > squared
 *
 * Why this is not a clone:
 * NOT Wicket — worktree isolation.
 * NOT Fascia — trust dialog names
 *     spawn cwd while session runs
 *     elsewhere.
 * NOT Berth — spawn_task shares
 *     parent working tree.
 * NOT Pale — hooks silently absent
 *     when project root ≠ repo root.
 * NOT #84856 squash-ancestry
 *     ExitWorktree *tool* refusal.
 * Different UI: stevedore chalk
 * desk, cargo crates, keep-vs-remove
 * gate. Different idle: squared.
 */

export const VERDICTS = Object.freeze([
  "squared",
  "birth-counted",
  "false-loss",
  "merged-still-n",
  "push-blind",
  "base-frozen",
  "remount-grew",
  "origin-zero",
  "chalked",
  "keep-or-lose",
]);
export const IDLE_WORD = "squared";
export const SLACK_VERDICTS = Object.freeze([
  "false-loss",
  "remount-grew",
  "merged-still-n",
  "push-blind",
  "origin-zero",
  "base-frozen",
  "chalked",
  "birth-counted",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90692;
export const CONTRAST_84856 = 84856;
export const CONTRAST_78355 = 78355;
export const CONTRAST_40137 = 40137;
export const CONTRAST_71135 = 71135;
export const CODEX_LIFECYCLE = 35383;
export const CODEX_CONTINUE_CWD = 34352;
export const RELATED_WICKET = "wicket";
export const RELATED_FASCIA = 90638;
export const RELATED_BERTH = 90668;
export const RELATED_PALE = 90683;
export const RELATED_CHATELAINE = 90647;
export const RELATED_WAIF = 90672;

export const DEMO_WORKTREE = ".claude/worktrees/test";
export const DEMO_CLAUDE_BASE = ".git/worktrees/test/CLAUDE_BASE";
export const DEMO_BIRTH = "abc1234";
export const DEMO_DAY = "2026-08-30";
export const DEMO_VERSION = "tally-board";

const FORBIDDEN_IDLE = Object.freeze([
  "tally",
  "notch",
  "chalk",
  "quittance",
  "remanet",
  "ledger",
  "stumpage",
  "docket",
  "waybill",
  "manifest",
  "arrear",
  "reckon",
  "escrow",
  "staddle",
  "kerf",
  "freeboard",
  "plimsoll",
  "cadastre",
  "bailey",
  "soke",
  "stile",
  "empty",
  "silent",
  "mute",
  "idle",
  "bound",
  "girt",
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
  "nested",
  "cut",
  "switched",
  "spilled",
  "pale",
  "chatelaine",
  "waif",
  "berth",
  "carrel",
  "byline",
  "fascia",
  "wicket",
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
    birthCount: null,
    originCount: null,
    dialogClaimsLoss: null,
    pushed: null,
    merged: null,
    squash: null,
    remountGrew: null,
    birthBeforeRemount: null,
    baseFrozen: null,
    chalked: null,
    baseline: "",
    claudeBase: "",
    head: "",
    worktree: "",
    nearby: "",
    nearbyMergedStillN: false,
    nearbyPushBlind: false,
    nearbyOriginZero: false,
    nearbyBaseFrozen: false,
    nearbyChalked: false,
    nearbyBirthCounted: false,
    nearbySquashTool: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.tally && typeof src.tally === "object") return src.tally;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.intake && typeof src.intake === "object") return src.intake;
  if (src.board && typeof src.board === "object") return src.board;
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
    birthCount: nested.birthCount == null && src.birthCount == null
      ? null
      : asNum(nested.birthCount ?? src.birthCount, 0),
    originCount: nested.originCount == null && src.originCount == null
      ? null
      : asNum(nested.originCount ?? src.originCount, 0),
    dialogClaimsLoss: asNullableBool(nested.dialogClaimsLoss ?? src.dialogClaimsLoss),
    pushed: asNullableBool(nested.pushed ?? src.pushed),
    merged: asNullableBool(nested.merged ?? src.merged),
    squash: asNullableBool(nested.squash ?? src.squash),
    remountGrew: asNullableBool(nested.remountGrew ?? src.remountGrew),
    birthBeforeRemount: nested.birthBeforeRemount == null && src.birthBeforeRemount == null
      ? null
      : asNum(nested.birthBeforeRemount ?? src.birthBeforeRemount, 0),
    baseFrozen: asNullableBool(nested.baseFrozen ?? src.baseFrozen),
    chalked: asNullableBool(nested.chalked ?? src.chalked),
    baseline: asText(nested.baseline || src.baseline || ""),
    claudeBase: asText(nested.claudeBase || src.claudeBase || ""),
    head: asText(nested.head || src.head || ""),
    worktree: asText(nested.worktree || src.worktree || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyMergedStillN: asBool(nested.nearbyMergedStillN ?? src.nearbyMergedStillN, false),
    nearbyPushBlind: asBool(nested.nearbyPushBlind ?? src.nearbyPushBlind, false),
    nearbyOriginZero: asBool(nested.nearbyOriginZero ?? src.nearbyOriginZero, false),
    nearbyBaseFrozen: asBool(nested.nearbyBaseFrozen ?? src.nearbyBaseFrozen, false),
    nearbyChalked: asBool(nested.nearbyChalked ?? src.nearbyChalked, false),
    nearbyBirthCounted: asBool(nested.nearbyBirthCounted ?? src.nearbyBirthCounted, false),
    nearbySquashTool: asBool(nested.nearbySquashTool ?? src.nearbySquashTool, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function isOffTally(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "84856" ||
    nearby === "78355" ||
    nearby === "40137" ||
    nearby === "71135" ||
    nearby === "squash" ||
    nearby === "wicket" ||
    nearby === "fascia" ||
    nearby === "90638" ||
    nearby === "berth" ||
    nearby === "90668" ||
    nearby === "pale" ||
    nearby === "90683" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "waif" ||
    nearby === "90672" ||
    nearby === "carrel" ||
    nearby === "byline" ||
    nearby === "gaff" ||
    row.nearbySquashTool === true
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.birthCount != null ||
    probe.originCount != null ||
    probe.dialogClaimsLoss != null ||
    probe.pushed != null ||
    probe.merged != null ||
    probe.squash != null ||
    probe.remountGrew != null ||
    probe.birthBeforeRemount != null ||
    probe.baseFrozen != null ||
    probe.chalked != null ||
    probe.baseline ||
    probe.claudeBase ||
    probe.head ||
    probe.worktree ||
    probe.nearbyMergedStillN ||
    probe.nearbyPushBlind ||
    probe.nearbyOriginZero ||
    probe.nearbyBaseFrozen ||
    probe.nearbyChalked ||
    probe.nearbyBirthCounted ||
    probe.nearbySquashTool ||
    isOffTally(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const birth = row.birthCount == null ? 0 : row.birthCount;
  const origin = row.originCount == null ? 0 : row.originCount;
  const uniqueNearby = Boolean(
    row.nearbyMergedStillN ||
      row.nearbyPushBlind ||
      row.nearbyOriginZero ||
      row.nearbyBaseFrozen ||
      row.nearbyChalked ||
      row.nearbyBirthCounted ||
      row.nearbySquashTool ||
      row.remountGrew === true ||
      isOffTally(row),
  );
  const triad = Boolean(
    birth > 0 &&
      origin === 0 &&
      row.dialogClaimsLoss === true &&
      row.pushed === true &&
      row.merged === true &&
      row.squash !== true &&
      !uniqueNearby,
  );
  const honestHold = Boolean(
    birth === 0 &&
      (row.head === "" || row.head === row.claudeBase || row.claudeBase === "") &&
      row.dialogClaimsLoss !== true &&
      !uniqueNearby &&
      !isOffTally(row),
  );

  let eventClass = "idle";
  if (isOffTally(row) && !triad) eventClass = "keep-or-lose";
  else if (row.remountGrew === true && !triad) eventClass = "remount-grew";
  else if (row.nearbyMergedStillN && !triad) eventClass = "merged-still-n";
  else if (row.nearbyPushBlind && !triad) eventClass = "push-blind";
  else if (row.nearbyOriginZero && !triad) eventClass = "origin-zero";
  else if (row.nearbyBaseFrozen && !triad) eventClass = "base-frozen";
  else if (row.nearbyChalked && !triad) eventClass = "chalked";
  else if (row.nearbyBirthCounted && !triad) eventClass = "birth-counted";
  else if (triad) eventClass = "false-loss";
  else if (row.remountGrew === true) eventClass = "remount-grew";
  else if (row.merged === true && birth > 0 && origin === 0) eventClass = "merged-still-n";
  else if (row.pushed === true && row.merged !== true && birth > 0 && origin === 0) {
    eventClass = "push-blind";
  } else if (origin === 0 && birth > 0 && row.originCount != null) eventClass = "origin-zero";
  else if (row.baseFrozen === true && birth > 0) eventClass = "base-frozen";
  else if (row.chalked === true && birth > 0) eventClass = "chalked";
  else if ((row.baseline === "CLAUDE_BASE" || row.claudeBase) && birth > 0) {
    eventClass = "birth-counted";
  } else if (honestHold || isIdle(row)) eventClass = "squared";
  else eventClass = "squared";

  return {
    birth,
    origin,
    uniqueNearby,
    triad,
    honestHold,
    offTally: isOffTally(row),
    eventClass,
    dialogClaimsLoss: row.dialogClaimsLoss,
    pushed: row.pushed,
    merged: row.merged,
    squash: row.squash,
    remountGrew: row.remountGrew,
    baseFrozen: row.baseFrozen,
    chalked: row.chalked,
    baseline: row.baseline,
    claudeBase: row.claudeBase,
    head: row.head,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "squared";
  const facts = analyze(row);
  if (!facts.triad) {
    if (facts.offTally) return "keep-or-lose";
    if (row.remountGrew === true) return "remount-grew";
    if (row.nearbyMergedStillN) return "merged-still-n";
    if (row.nearbyPushBlind) return "push-blind";
    if (row.nearbyOriginZero) return "origin-zero";
    if (row.nearbyBaseFrozen) return "base-frozen";
    if (row.nearbyChalked) return "chalked";
    if (row.nearbyBirthCounted) return "birth-counted";
  }
  if (facts.triad) return "false-loss";
  if (row.remountGrew === true) return "remount-grew";
  if (row.merged === true && facts.birth > 0 && facts.origin === 0) return "merged-still-n";
  if (row.pushed === true && row.merged !== true && facts.birth > 0 && facts.origin === 0) {
    return "push-blind";
  }
  if (facts.origin === 0 && facts.birth > 0 && row.originCount != null) return "origin-zero";
  if (row.baseFrozen === true && facts.birth > 0) return "base-frozen";
  if (row.chalked === true && facts.birth > 0) return "chalked";
  if ((row.baseline === "CLAUDE_BASE" || row.claudeBase) && facts.birth > 0) {
    return "birth-counted";
  }
  return "squared";
}

export function feedOf(kind) {
  if (kind === "false-loss") {
    return "● False-loss · birth tally N>0 · origin/main..HEAD is 0 · dialog claims all commits will be lost · primary #90692";
  }
  if (kind === "remount-grew") {
    return "● Remount-grew · git merge --ff-only origin/main inside the worktree · birth count grew while risk shrank";
  }
  if (kind === "merged-still-n") {
    return "● Merged-still-n · regular or fast-forward merge on the remote · CLAUDE_BASE..HEAD still N>0";
  }
  if (kind === "push-blind") {
    return "● Push-blind · commits already on the remote · dialog still chalks birth notches as loss";
  }
  if (kind === "origin-zero") {
    return "● Origin-zero · git rev-list --count origin/main..HEAD prints 0 · everything contained in the remote default branch";
  }
  if (kind === "base-frozen") {
    return "● Base-frozen · CLAUDE_BASE is the creation-time ref · only a reset to birth returns N to 0";
  }
  if (kind === "chalked") {
    return "● Chalked · the /exit slate notched N since worktree birth · the number measures age, not risk";
  }
  if (kind === "birth-counted") {
    return "● Birth-counted · N is git rev-list --count CLAUDE_BASE..HEAD · baseline is worktree creation, not unmerged work";
  }
  if (kind === "keep-or-lose") {
    return "● Keep-or-lose · #84856 / #78355 squash-ancestry ExitWorktree *tool* · labeled contrast, not this dialog";
  }
  return "● Squared · HEAD == CLAUDE_BASE · birth count 0 · nothing the dock would lose · idle word is squared";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "false-loss" || facts.triad) {
    reasons.push(
      "#90692 birth count CLAUDE_BASE..HEAD > 0 + origin/main..HEAD = 0 + dialog claims loss after push and regular merge",
    );
  }
  if (row.birthCount != null) {
    reasons.push(`git rev-list --count CLAUDE_BASE..HEAD = ${facts.birth}`);
  }
  if (row.originCount != null) {
    reasons.push(`git rev-list --count origin/main..HEAD = ${facts.origin}`);
  }
  if (facts.dialogClaimsLoss) {
    reasons.push('dialog warns "You have N commits… All changes and commits will be lost"');
  }
  if (facts.pushed === true) reasons.push("commits already pushed to the remote");
  if (facts.merged === true && facts.squash !== true) {
    reasons.push("regular or fast-forward merge on the remote — no squash needed");
  }
  if (facts.squash === true) {
    reasons.push("squash merge present — that is #84856 ExitWorktree tool ancestry, not this dialog");
  }
  if (facts.remountGrew) {
    reasons.push(
      `after git merge --ff-only origin/main the birth count grew from ${row.birthBeforeRemount ?? "N"} to ${facts.birth}`,
    );
  }
  if (facts.baseFrozen) {
    reasons.push(`CLAUDE_BASE frozen at ${row.claudeBase || DEMO_BIRTH} in ${DEMO_CLAUDE_BASE}`);
  }
  if (facts.chalked) reasons.push("chalk notches on the /exit slate measure commits since birth");
  if (row.baseline === "CLAUDE_BASE" || kind === "birth-counted") {
    reasons.push("baseline is worktree birth (CLAUDE_BASE), not the default branch");
  }
  if (facts.offTally || kind === "keep-or-lose") {
    reasons.push(
      "keep-or-lose nearby: #84856 / #78355 / #40137 / #71135 squash-ancestry ExitWorktree tool — labeled, not this dialog. Also not Wicket / Fascia / Berth / Pale",
    );
  }
  if (kind === "squared") {
    reasons.push(
      "HEAD == CLAUDE_BASE; birth count 0; dock accounts squared; idle word is squared",
    );
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "false-loss") {
    return `Tally false-loss · birth ${facts.birth} · origin ${facts.origin} · claims will be lost · #90692`;
  }
  if (kind === "remount-grew") {
    return "Tally remount-grew · ff-only origin/main · N grew while risk shrank";
  }
  if (kind === "merged-still-n") {
    return "Tally merged-still-n · regular merge · CLAUDE_BASE..HEAD still N>0";
  }
  if (kind === "push-blind") {
    return "Tally push-blind · already on the remote · dialog still chalks birth";
  }
  if (kind === "origin-zero") {
    return "Tally origin-zero · origin/main..HEAD is 0 · dialog still warns loss";
  }
  if (kind === "base-frozen") {
    return "Tally base-frozen · CLAUDE_BASE stuck at worktree birth";
  }
  if (kind === "chalked") {
    return "Tally chalked · /exit slate notched age, not risk";
  }
  if (kind === "birth-counted") {
    return "Tally birth-counted · N is CLAUDE_BASE..HEAD, not unmerged work";
  }
  return "";
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const alarm = SLACK_VERDICTS.includes(kind);
  return {
    product: "tally",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    squared: kind === "squared",
    "birth-counted": kind === "birth-counted",
    "false-loss": kind === "false-loss",
    "merged-still-n": kind === "merged-still-n",
    "push-blind": kind === "push-blind",
    "base-frozen": kind === "base-frozen",
    "remount-grew": kind === "remount-grew",
    "origin-zero": kind === "origin-zero",
    chalked: kind === "chalked",
    "keep-or-lose": kind === "keep-or-lose",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "squared" && kind !== "keep-or-lose",
    offTally: facts.offTally,
    slackCopy: slackCopy(kind, facts),
    facts: {
      birthCount: facts.birth,
      originCount: facts.origin,
      dialogClaimsLoss: facts.dialogClaimsLoss,
      pushed: facts.pushed,
      merged: facts.merged,
      squash: facts.squash,
      remountGrew: facts.remountGrew,
      baseFrozen: facts.baseFrozen,
      chalked: facts.chalked,
      baseline: facts.baseline,
      claudeBase: facts.claudeBase,
      head: facts.head,
      triad: facts.triad,
      offTally: facts.offTally,
      nearbyMergedStillN: probe.nearbyMergedStillN,
      nearbyPushBlind: probe.nearbyPushBlind,
      nearbyOriginZero: probe.nearbyOriginZero,
      nearbyBaseFrozen: probe.nearbyBaseFrozen,
      nearbyChalked: probe.nearbyChalked,
      nearbyBirthCounted: probe.nearbyBirthCounted,
      nearbySquashTool: probe.nearbySquashTool,
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
  return boardResult(kind, row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function squaredOf(probe = {}) {
  return classify(probe) === "squared";
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
    tally: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedSquared() {
  return baseSeed("squared-hold", FEATURED_ISSUE, {
    source: "honest control: HEAD == CLAUDE_BASE; birth count 0",
    birthCount: 0,
    originCount: 0,
    dialogClaimsLoss: false,
    pushed: false,
    merged: false,
    squash: false,
    remountGrew: false,
    baseFrozen: true,
    chalked: false,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: DEMO_BIRTH,
    worktree: DEMO_WORKTREE,
  });
}

export function seedControl() {
  return seedSquared();
}

export function seedReset() {
  return { action: "bail", tally: emptyProbe() };
}

export function seedFalseLoss() {
  return baseSeed("90692-false-loss", FEATURED_ISSUE, {
    source: "primary #90692 birth N=3 while origin/main..HEAD is 0; dialog claims loss",
    birthCount: 3,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: false,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "def5678",
    worktree: DEMO_WORKTREE,
  });
}

export function seed90692() {
  return seedFalseLoss();
}

export function seedRemountGrew() {
  return baseSeed("90692-remount-grew", FEATURED_ISSUE, {
    source: "after git merge --ff-only origin/main the birth count grew from 3 to 4",
    birthCount: 4,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: true,
    birthBeforeRemount: 3,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "fff9999",
    worktree: DEMO_WORKTREE,
  });
}

export function seedMergedStillN() {
  return baseSeed("90692-merged-still-n", FEATURED_ISSUE, {
    source: "regular or ff merge on the remote; CLAUDE_BASE..HEAD still N>0",
    birthCount: 2,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: false,
    nearbyMergedStillN: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "cafebabe",
    worktree: DEMO_WORKTREE,
  });
}

export function seedPushBlind() {
  return baseSeed("90692-push-blind", FEATURED_ISSUE, {
    source: "commits already pushed; dialog still chalks birth notches",
    birthCount: 1,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: false,
    squash: false,
    remountGrew: false,
    nearbyPushBlind: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "push0001",
    worktree: DEMO_WORKTREE,
  });
}

export function seedOriginZero() {
  return baseSeed("90692-origin-zero", FEATURED_ISSUE, {
    source: "git rev-list --count origin/main..HEAD prints 0",
    birthCount: 1,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: false,
    nearbyOriginZero: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "zero0001",
    worktree: DEMO_WORKTREE,
  });
}

export function seedBaseFrozen() {
  return baseSeed("90692-base-frozen", FEATURED_ISSUE, {
    source: "CLAUDE_BASE frozen at worktree birth; only reset to creation returns N to 0",
    birthCount: 2,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: false,
    nearbyBaseFrozen: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "froz0001",
    worktree: DEMO_WORKTREE,
  });
}

export function seedChalked() {
  return baseSeed("90692-chalked", FEATURED_ISSUE, {
    source: "/exit slate notched N since worktree birth; the number measures age, not risk",
    birthCount: 5,
    originCount: 0,
    dialogClaimsLoss: true,
    pushed: true,
    merged: true,
    squash: false,
    remountGrew: false,
    nearbyChalked: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "chalk001",
    worktree: DEMO_WORKTREE,
  });
}

export function seedBirthCounted() {
  return baseSeed("90692-birth-counted", FEATURED_ISSUE, {
    source: "N is git rev-list --count CLAUDE_BASE..HEAD; baseline is worktree creation",
    birthCount: 2,
    originCount: 1,
    dialogClaimsLoss: true,
    pushed: false,
    merged: false,
    squash: false,
    remountGrew: false,
    nearbyBirthCounted: true,
    baseFrozen: true,
    chalked: true,
    baseline: "CLAUDE_BASE",
    claudeBase: DEMO_BIRTH,
    head: "birth001",
    worktree: DEMO_WORKTREE,
  });
}

export function seedKeepOrLose() {
  return baseSeed("keep-or-lose-84856", CONTRAST_84856, {
    source: "NOT this: #84856 squash-ancestry ExitWorktree tool refusal",
    nearby: "84856",
    nearbySquashTool: true,
    squash: true,
    birthCount: 0,
    originCount: 0,
    dialogClaimsLoss: false,
    pushed: true,
    merged: true,
    remountGrew: false,
    baseline: "default-branch",
    worktree: DEMO_WORKTREE,
  });
}

const SEEDS = {
  squared: seedSquared,
  control: seedSquared,
  healthy: seedSquared,
  hold: seedSquared,
  "false-loss": seedFalseLoss,
  falseloss: seedFalseLoss,
  90692: seedFalseLoss,
  "90692": seedFalseLoss,
  "remount-grew": seedRemountGrew,
  remountgrew: seedRemountGrew,
  "merged-still-n": seedMergedStillN,
  mergedstilln: seedMergedStillN,
  "push-blind": seedPushBlind,
  pushblind: seedPushBlind,
  "origin-zero": seedOriginZero,
  originzero: seedOriginZero,
  "base-frozen": seedBaseFrozen,
  basefrozen: seedBaseFrozen,
  chalked: seedChalked,
  "birth-counted": seedBirthCounted,
  birthcounted: seedBirthCounted,
  "keep-or-lose": seedKeepOrLose,
  keeporlose: seedKeepOrLose,
  84856: seedKeepOrLose,
  "84856": seedKeepOrLose,
  squash: seedKeepOrLose,
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
    return { action: payload, tally: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const tally = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || tally.session),
    issue: asIssue(src.issue ?? tally.issue),
    source: asText(src.source || tally.source),
    tally,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.tally);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "squared" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return boardResult("squared", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedSquared().tally;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "false-loss" || verb === "incident" || verb === "90692") {
    probe = seedFalseLoss().tally;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-tally") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseTallyJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.tally ||
      raw.probe ||
      raw.intake ||
      raw.board ||
      raw.birthCount != null ||
      raw.originCount != null ||
      raw.dialogClaimsLoss != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parseTallyJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, tally: emptyProbe() };
}
