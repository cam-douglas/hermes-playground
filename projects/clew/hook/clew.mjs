/**
 * Clew — rigger's / sailmaker's clew desk
 * for a real Claude Code sandbox choke: Bash sandbox
 * winds roughly two filesystem deny entries per
 * registered git worktree onto a single clew (the
 * whole sandbox profile is stuffed into one
 * `/bin/bash -c "<bwrap …>"` argument). At ~250
 * worktrees the ball crosses Linux MAX_ARG_STRLEN
 * (128 KB per argv). Then every Bash spawn dies
 * with E2BIG — including `sleep 5`. Sudden, total,
 * not gradual. The denies exist as the mitigation
 * for GHSA-7835-87q9-rgvv / CVE-2026-55607
 * (worktree path-confusion sandbox escape); dropping
 * them is not the ask. The product scores the coil:
 * a working-size clew (spawn lives) is rove. A
 * fouled clew (E2BIG, spawn dead) is scored honestly
 * and is never rove.
 *
 * Primary #90569: open, has repro, filed 2026-08-29,
 * Linux, Claude Code 2.1.251. 261 registered
 * worktrees; 687 deny paths of which 524 are
 * worktree-admin files; command line 130.7KB across
 * 3 args (largest single arg 130.7KB); environment
 * 9.5KB. Measured.
 *
 * Same-class (cite, do not invent):
 *   #73468 — macOS sandbox-exec -p exceeds ARG_MAX
 *            with many git worktrees
 *   #73437 — E2BIG from unbounded ancestor rule
 *            expansion with many worktrees (macOS)
 *   #82840 — seatbelt profile grows one deny per
 *            registered worktree → E2BIG; profile
 *            cached per session
 *   #74081 — Linux recursive Read() deny globs
 *            expand to per-file bwrap binds → E2BIG
 *            on echo hello
 *   #82173 — absolute deny patterns joined to cwd
 *            inflate profile; E2BIG with only 5
 *            worktrees
 *   #78253 — spawn E2BIG; profile size scales with
 *            working-tree file count
 *   #51126 — mechanics: bubblewrap wrapped in a
 *            single /bin/bash -c string vs
 *            MAX_ARG_STRLEN
 *   #46461 — mid-path glob deny rules expand
 *            per-file → E2BIG
 *   #74032 — worktree isolation inflates env past
 *            ARG_MAX
 *
 * Cross-ecosystem:
 *   openai/codex#33479 — :workspace_roots write
 *            rules recursively expand until E2BIG
 *   openai/codex#37632 — same class regression on
 *            0.147.0
 *   openai/codex#34878 — notify payload as single
 *            argv exceeds MAX_ARG_STRLEN
 *
 * Verdicts: rove | fouled | overcoiled | choked
 *           | twinned | swollen | jammed | pruned
 *           | cached | globbed
 * Idle word is rove (sheet reeved; clew a working
 * size; bash can spawn).
 * NEVER use clew / empty / silent / mute / idle /
 * dead as idle. NEVER reuse keyed, housed, beamed,
 * snug, hung, appointed, cinched, gauged, stamped,
 * overrun, pratique, wound, bound, stilled, stabled,
 * drained, flat, fit, spoilt, laid, unlinked, tight,
 * banked, roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised, rung.
 *
 * Slack alarm on fouled / overcoiled / choked /
 * jammed / swollen / cached / globbed.
 * Linear ticket on fouled / choked / jammed.
 * GitHub clew-ledger of scored coils on every score.
 *
 * Priority when multiple match:
 *   fouled > overcoiled > choked > twinned > swollen
 *   > jammed > cached > globbed > pruned > rove
 * Unique nearby flags (cached / globbed / pruned)
 * still win their own seeds because those seeds do
 * not carry the fouled pentad.
 *
 * Why this is not a clone:
 * NOT Wicket — isolation pin vs actual isolation
 *     (writes escaping a pinned worktree). Opposite
 *     pole: Wicket is a leak; Clew is a choke.
 * NOT Scant — PATH truncation inside a shell
 *     snapshot. Clew is the sandbox profile itself
 *     as one argv.
 * NOT Sump — literal /dev/null LFS hooks.
 * NOT Cinch — silent partial folder mounts.
 * NOT Hasp — file lease / last-writer-wins.
 * NOT Sounder — missed background wakeup (waiter
 *     exited; notification never re-invoked).
 * NOT leftover woodworking / millimetre-slider.
 * Do NOT ship alternate names Plimsoll, Flake,
 * Hawse, Skein, Oakum, Burthen, Marline, Bight,
 * Rode, Stow, Lading, Coil, Flemish, Thrum, Ravel.
 * Product name is Clew only.
 * Different problem: DENY LIST GROWS TWO ENTRIES
 * PER WORKTREE → SINGLE BWRAP ARGV CROSSES
 * MAX_ARG_STRLEN → EVERY BASH SPAWN DIES WITH
 * E2BIG. Sudden, total, not gradual.
 * Different UI: sail loft / rigger's bench. Hemp
 * clew, tarred oak, brass thimble, lignum sheave,
 * lantern. A growing ball of yarn that swells
 * toward a 128KB load line.
 * Different idle: rove.
 */

export const VERDICTS = Object.freeze([
  "rove",
  "fouled",
  "overcoiled",
  "choked",
  "twinned",
  "swollen",
  "jammed",
  "pruned",
  "cached",
  "globbed",
]);
export const IDLE_WORD = "rove";
export const SLACK_VERDICTS = Object.freeze([
  "fouled",
  "overcoiled",
  "choked",
  "jammed",
  "swollen",
  "cached",
  "globbed",
]);
export const LINEAR_VERDICTS = Object.freeze(["fouled", "choked", "jammed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90569;
export const DEMO_WORKTREE_COUNT = 261;
export const DEMO_WORKTREE_DENY_COUNT = 524;
export const DEMO_TOTAL_DENY_COUNT = 687;
export const DEMO_BASELINE_DENY_COUNT = 160;
export const DEMO_LARGEST_ARG_KB = 130.7;
export const DEMO_ENV_KB = 9.5;
export const DEMO_ARG_COUNT = 3;
export const MAX_ARG_STRLEN = 128 * 1024;
export const DEMO_LARGEST_ARG_BYTES = Math.round(DEMO_LARGEST_ARG_KB * 1024);
export const OVERCOIL_TREE_FLOOR = 40;

const FORBIDDEN_IDLE = Object.freeze([
  "clew",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "sealed",
  "quiet",
  "seised",
  "rung",
  "plimsoll",
  "flake",
  "hawse",
  "skein",
  "oakum",
  "burthen",
  "marline",
  "bight",
  "rode",
  "stow",
  "lading",
  "coil",
  "flemish",
  "thrum",
  "ravel",
  "wicket",
  "scant",
  "sump",
  "cinch",
  "hasp",
  "sounder",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

export function kbToBytes(kb) {
  const n = Number(kb);
  return Number.isFinite(n) ? Math.round(n * 1024) : 0;
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

function asCount(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function asBytes(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function emptyClew() {
  return {
    session: "",
    issue: null,
    source: "",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: 0,
    totalDenyCount: 0,
    largestArgBytes: 0,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
    echoFailed: false,
    monitorFailed: false,
    profileCached: false,
    prunedButNotRestarted: false,
    globExpandedPerFile: false,
    ancestorExpanded: false,
    scored: false,
  };
}

export function emptyAction(session = "rove-1") {
  return {
    action: "score",
    session,
    clew: emptyClew(),
  };
}

export function cloneClew(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyClew();
  const nested =
    (src.clew && typeof src.clew === "object" && src.clew) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.coil && typeof src.coil === "object" && src.coil) ||
    src;
  return {
    ...emptyClew(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    worktreeCount: asCount(nested.worktreeCount ?? src.worktreeCount),
    worktreeDenyCount: asCount(nested.worktreeDenyCount ?? src.worktreeDenyCount),
    baselineDenyCount: asCount(nested.baselineDenyCount ?? src.baselineDenyCount),
    totalDenyCount: asCount(nested.totalDenyCount ?? src.totalDenyCount),
    largestArgBytes: asBytes(nested.largestArgBytes ?? src.largestArgBytes, 0),
    maxArgStrlen: asBytes(nested.maxArgStrlen ?? src.maxArgStrlen, MAX_ARG_STRLEN) || MAX_ARG_STRLEN,
    e2big: asBool(nested.e2big ?? src.e2big, false) === true,
    spawnFailed: asBool(nested.spawnFailed ?? src.spawnFailed, false) === true,
    sleepFailed: asBool(nested.sleepFailed ?? src.sleepFailed, false) === true,
    echoFailed: asBool(nested.echoFailed ?? src.echoFailed, false) === true,
    monitorFailed: asBool(nested.monitorFailed ?? src.monitorFailed, false) === true,
    profileCached: asBool(nested.profileCached ?? src.profileCached, false) === true,
    prunedButNotRestarted:
      asBool(nested.prunedButNotRestarted ?? src.prunedButNotRestarted, false) === true,
    globExpandedPerFile:
      asBool(nested.globExpandedPerFile ?? src.globExpandedPerFile, false) === true,
    ancestorExpanded: asBool(nested.ancestorExpanded ?? src.ancestorExpanded, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

function spawnLivesOf(next) {
  return next.spawnFailed !== true && next.sleepFailed !== true && next.e2big !== true;
}

export function analyze(clew = {}) {
  const next = cloneClew(clew);
  const maxArg = next.maxArgStrlen || MAX_ARG_STRLEN;
  const argOver = next.largestArgBytes >= maxArg;
  const baseline = next.baselineDenyCount > 0 ? next.baselineDenyCount : DEMO_BASELINE_DENY_COUNT;
  const ratio = next.worktreeCount > 0 ? next.worktreeDenyCount / next.worktreeCount : 0;
  const fouledShape =
    next.e2big === true &&
    next.sleepFailed === true &&
    next.spawnFailed === true &&
    argOver &&
    next.worktreeCount >= 250;
  const overcoiledShape =
    next.worktreeCount >= OVERCOIL_TREE_FLOOR &&
    next.worktreeDenyCount >= 2 * next.worktreeCount;
  const chokedShape =
    next.sleepFailed === true &&
    next.echoFailed === true &&
    next.monitorFailed === true &&
    next.e2big === true;
  const twinnedShape = next.worktreeCount > 0 && ratio >= 1.8 && ratio <= 2.2;
  const swollenShape = next.totalDenyCount > baseline + 2 * next.worktreeCount;
  const jammedShape = argOver;
  const cachedShape = next.profileCached === true && next.prunedButNotRestarted === true;
  const globbedShape = next.globExpandedPerFile === true;
  const prunedShape =
    next.scored === true &&
    next.worktreeCount === 0 &&
    next.totalDenyCount > 0 &&
    next.totalDenyCount <= baseline &&
    spawnLivesOf(next) &&
    argOver !== true &&
    next.profileCached !== true &&
    next.prunedButNotRestarted !== true &&
    next.globExpandedPerFile !== true;
  const roveHold =
    spawnLivesOf(next) && next.largestArgBytes < maxArg && next.e2big !== true;
  return {
    worktreeCount: next.worktreeCount,
    worktreeDenyCount: next.worktreeDenyCount,
    baselineDenyCount: next.baselineDenyCount,
    totalDenyCount: next.totalDenyCount,
    largestArgBytes: next.largestArgBytes,
    maxArgStrlen: maxArg,
    e2big: next.e2big,
    spawnFailed: next.spawnFailed,
    sleepFailed: next.sleepFailed,
    echoFailed: next.echoFailed,
    monitorFailed: next.monitorFailed,
    profileCached: next.profileCached,
    prunedButNotRestarted: next.prunedButNotRestarted,
    globExpandedPerFile: next.globExpandedPerFile,
    ancestorExpanded: next.ancestorExpanded,
    argOver,
    ratio,
    spawnLives: spawnLivesOf(next),
    fouledShape,
    overcoiledShape,
    chokedShape,
    twinnedShape,
    swollenShape,
    jammedShape,
    cachedShape,
    globbedShape,
    prunedShape,
    roveHold,
  };
}

export function isIdle(clew = {}) {
  const next = cloneClew(clew);
  return (
    next.worktreeCount <= 0 &&
    next.worktreeDenyCount <= 0 &&
    next.totalDenyCount <= 0 &&
    next.largestArgBytes <= 0 &&
    next.e2big !== true &&
    next.spawnFailed !== true &&
    next.sleepFailed !== true &&
    next.echoFailed !== true &&
    next.monitorFailed !== true &&
    next.profileCached !== true &&
    next.prunedButNotRestarted !== true &&
    next.globExpandedPerFile !== true &&
    next.ancestorExpanded !== true
  );
}

/**
 * First match wins by documented priority:
 * fouled > overcoiled > choked > twinned > swollen
 * > jammed > cached > globbed > pruned > rove.
 * Idle rove is first. Seeded #90569 numbers must
 * produce fouled, never rove. A working-size coil
 * is not a hold.
 */
export function classify(clew = {}) {
  const next = cloneClew(clew);
  if (isIdle(next)) return "rove";
  const facts = analyze(next);

  if (facts.fouledShape) return "fouled";
  if (facts.overcoiledShape) return "overcoiled";
  if (facts.chokedShape) return "choked";
  if (facts.twinnedShape) return "twinned";
  if (facts.swollenShape) return "swollen";
  if (facts.jammedShape) return "jammed";
  if (facts.cachedShape) return "cached";
  if (facts.globbedShape) return "globbed";
  if (facts.prunedShape) return "pruned";
  if (facts.roveHold) return "rove";
  return "rove";
}

export function feedOf(clew = {}, verdict = "") {
  const kind = verdict || classify(clew);
  if (kind === "fouled") {
    return "● Fouled · 261 worktrees · 524 worktree denies · 130.7KB single arg · E2BIG · even sleep 5 fails · primary #90569";
  }
  if (kind === "overcoiled") {
    return "● Overcoiled · deny list grew two entries per registered worktree without bound";
  }
  if (kind === "choked") {
    return "● Choked · every Bash spawn fails (sleep 5 / echo hello / monitor) with E2BIG";
  }
  if (kind === "twinned") {
    return "● Twinned · ~2 deny entries per worktree (admin files under .git/worktrees/<id>/)";
  }
  if (kind === "swollen") {
    return "● Swollen · deny count unbounded vs a fixed baseline (~160 baseline + 2×trees)";
  }
  if (kind === "jammed") {
    return "● Jammed · single /bin/bash -c argument exceeds 128KB MAX_ARG_STRLEN";
  }
  if (kind === "pruned") {
    return "● Pruned · worktrees removed + profile rebuilt · spawn lives again · cure path, not idle";
  }
  if (kind === "cached") {
    return "● Cached · profile cached per session so prune without restart still fouls · macOS #82840 shape";
  }
  if (kind === "globbed") {
    return "● Globbed · recursive deny globs expanded per-file into bwrap binds · #74081 shape";
  }
  return "● Rove · working-size clew · spawn lives · sheet reeved · idle word is rove";
}

export function reasonsOf(clew = {}, verdict = "") {
  const next = cloneClew(clew);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.worktreeCount
      ? `clew coil ${facts.worktreeCount} worktrees · ${facts.worktreeDenyCount} worktree denies · ${facts.totalDenyCount} total denies · largest arg ${facts.largestArgBytes}B of ${facts.maxArgStrlen}B MAX_ARG_STRLEN · e2big ${facts.e2big ? "yes" : "no"}`
      : "line on · sheave free · working-size clew · idle word is rove",
  );
  if (facts.e2big && facts.sleepFailed) {
    reasons.push(
      "every Bash spawn dies with E2BIG — including sleep 5 · sudden, total, not gradual",
    );
  }
  if (facts.argOver) {
    reasons.push(
      `single /bin/bash -c argument ${facts.largestArgBytes}B exceeds ${facts.maxArgStrlen}B MAX_ARG_STRLEN · #51126 mechanics`,
    );
  }
  if (facts.worktreeCount > 0 && facts.worktreeDenyCount >= 2 * facts.worktreeCount) {
    reasons.push(
      `deny list grew two entries per registered worktree without bound · ${facts.worktreeDenyCount} worktree denies / ${facts.worktreeCount} trees`,
    );
  }
  if (facts.twinnedShape) {
    reasons.push(
      `~2 deny entries per worktree (admin files under .git/worktrees/<id>/) · ratio ${facts.ratio.toFixed(3)}`,
    );
  }
  if (facts.swollenShape) {
    reasons.push(
      "deny count unbounded vs a fixed baseline (~160 baseline + 2×trees)",
    );
  }
  if (facts.chokedShape) {
    reasons.push("sleep 5 / echo hello / monitor all fail with E2BIG");
  }
  if (facts.profileCached && facts.prunedButNotRestarted) {
    reasons.push("profile cached per session so prune without restart still fouls · #82840");
  }
  if (facts.globExpandedPerFile) {
    reasons.push("recursive deny globs expanded per-file into bwrap binds · #74081");
  }
  if (facts.ancestorExpanded) {
    reasons.push("unbounded ancestor rule expansion with many worktrees · #73437");
  }
  if (facts.prunedShape) {
    reasons.push("worktrees removed + profile rebuilt · spawn lives again · cure path, not idle");
  }
  reasons.push("a working-size coil is not a hold");
  reasons.push(
    "NOT Wicket (isolation leak — opposite pole: Wicket is a leak; Clew is a choke) / Scant (PATH truncation inside a shell snapshot) / Sump (literal /dev/null LFS hooks) / Cinch (silent partial folder mounts) / Hasp (file lease) / Sounder (missed background wakeup) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "rove") {
    reasons.push(
      "working-size clew; spawn lives; sheet reeved; idle word is rove",
    );
  }
  if (kind === "fouled") {
    reasons.push(
      "PRIMARY #90569: 261 registered worktrees; 687 deny paths of which 524 are worktree-admin files; command line 130.7KB across 3 args (largest single arg 130.7KB); environment 9.5KB. E2BIG. Even sleep 5 fails. The fouled case is fouled, never rove.",
    );
  }
  if (kind === "overcoiled") {
    reasons.push("deny list grew two entries per registered worktree without bound.");
  }
  if (kind === "choked") {
    reasons.push("every Bash spawn fails (sleep 5 / echo hello / monitor) with E2BIG.");
  }
  if (kind === "twinned") {
    reasons.push("~2 deny entries per worktree (admin files under .git/worktrees/<id>/).");
  }
  if (kind === "swollen") {
    reasons.push("deny count unbounded vs a fixed baseline (~160 baseline + 2×trees).");
  }
  if (kind === "jammed") {
    reasons.push("single /bin/bash -c argument exceeds 128KB MAX_ARG_STRLEN.");
  }
  if (kind === "pruned") {
    reasons.push("worktrees removed + profile rebuilt; spawn lives again (cure path, not idle).");
  }
  if (kind === "cached") {
    reasons.push("profile cached per session so prune without restart still fouls.");
  }
  if (kind === "globbed") {
    reasons.push("recursive deny globs expanded per-file into bwrap binds.");
  }
  return reasons;
}

export function verdictOf(clew = {}) {
  return classify(clew);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function roveOf(clew = {}, verdict = "") {
  const next = cloneClew(clew);
  const facts = analyze(next);
  return facts.spawnLives && facts.largestArgBytes < facts.maxArgStrlen && facts.e2big !== true;
}

export function fouledOf(clew = {}, verdict = "") {
  return (verdict || classify(clew)) === "fouled";
}

export function summaryOf(clew = {}) {
  const next = cloneClew(clew);
  const facts = analyze(next);
  return {
    worktreeCount: facts.worktreeCount,
    worktreeDenyCount: facts.worktreeDenyCount,
    baselineDenyCount: facts.baselineDenyCount,
    totalDenyCount: facts.totalDenyCount,
    largestArgBytes: facts.largestArgBytes,
    maxArgStrlen: facts.maxArgStrlen,
    e2big: facts.e2big,
    spawnFailed: facts.spawnFailed,
    sleepFailed: facts.sleepFailed,
    echoFailed: facts.echoFailed,
    monitorFailed: facts.monitorFailed,
    profileCached: facts.profileCached,
    prunedButNotRestarted: facts.prunedButNotRestarted,
    globExpandedPerFile: facts.globExpandedPerFile,
    ancestorExpanded: facts.ancestorExpanded,
  };
}

export function score(clew = {}) {
  const next = cloneClew(clew);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    rove: roveOf(next, verdict),
    fouled: fouledOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    worktreeCount: facts.worktreeCount,
    worktreeDenyCount: facts.worktreeDenyCount,
    baselineDenyCount: facts.baselineDenyCount,
    totalDenyCount: facts.totalDenyCount,
    largestArgBytes: facts.largestArgBytes,
    maxArgStrlen: facts.maxArgStrlen,
    e2big: facts.e2big,
    spawnFailed: facts.spawnFailed,
    sleepFailed: facts.sleepFailed,
    echoFailed: facts.echoFailed,
    monitorFailed: facts.monitorFailed,
    profileCached: facts.profileCached,
    prunedButNotRestarted: facts.prunedButNotRestarted,
    globExpandedPerFile: facts.globExpandedPerFile,
    ancestorExpanded: facts.ancestorExpanded,
    summary: summaryOf(next),
    clew: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const clewSrc =
    src.clew ||
    src.probe ||
    src.payload ||
    src.coil ||
    payload.clew ||
    payload.probe ||
    payload.coil;
  const clew = cloneClew(
    clewSrc && typeof clewSrc === "object" ? { ...clewSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !clew.session) clew.session = src.session;
  if (typeof payload.session === "string" && !clew.session) clew.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? clew.session ?? ""),
    clew,
    issue: src.issue ?? payload.issue ?? clew.issue ?? null,
    source: src.source ?? payload.source ?? clew.source ?? "",
  };
}

function clewResult(verdict, clew, action, extras = {}) {
  const next = cloneClew(clew);
  const scored = score(next);
  return {
    ok: true,
    product: "clew",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    rove: scored.rove,
    fouled: scored.fouled,
    clewRove: verdict === "rove",
    clewFouled: verdict === "fouled",
    clewOvercoiled: verdict === "overcoiled",
    clewChoked: verdict === "choked",
    clewTwinned: verdict === "twinned",
    clewSwollen: verdict === "swollen",
    clewJammed: verdict === "jammed",
    clewPruned: verdict === "pruned",
    clewCached: verdict === "cached",
    clewGlobbed: verdict === "globbed",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    worktreeCount: scored.worktreeCount,
    worktreeDenyCount: scored.worktreeDenyCount,
    baselineDenyCount: scored.baselineDenyCount,
    totalDenyCount: scored.totalDenyCount,
    largestArgBytes: scored.largestArgBytes,
    maxArgStrlen: scored.maxArgStrlen,
    e2big: scored.e2big,
    spawnFailed: scored.spawnFailed,
    sleepFailed: scored.sleepFailed,
    echoFailed: scored.echoFailed,
    monitorFailed: scored.monitorFailed,
    profileCached: scored.profileCached,
    prunedButNotRestarted: scored.prunedButNotRestarted,
    globExpandedPerFile: scored.globExpandedPerFile,
    ancestorExpanded: scored.ancestorExpanded,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    clew: next,
    ...extras,
  };
}

function seedClew(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    clew: {
      ...emptyClew(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      worktreeCount: asCount(extras.worktreeCount),
      worktreeDenyCount: asCount(extras.worktreeDenyCount),
      baselineDenyCount: asCount(extras.baselineDenyCount),
      totalDenyCount: asCount(extras.totalDenyCount),
      largestArgBytes: asBytes(extras.largestArgBytes, 0),
      maxArgStrlen: asBytes(extras.maxArgStrlen, MAX_ARG_STRLEN) || MAX_ARG_STRLEN,
      e2big: Boolean(extras.e2big),
      spawnFailed: Boolean(extras.spawnFailed),
      sleepFailed: Boolean(extras.sleepFailed),
      echoFailed: Boolean(extras.echoFailed),
      monitorFailed: Boolean(extras.monitorFailed),
      profileCached: Boolean(extras.profileCached),
      prunedButNotRestarted: Boolean(extras.prunedButNotRestarted),
      globExpandedPerFile: Boolean(extras.globExpandedPerFile),
      ancestorExpanded: Boolean(extras.ancestorExpanded),
    },
  };
}

/** Healthy rove coil. Working-size clew; spawn lives. */
export function seedRove() {
  return seedClew("rove", "loft", {
    session: "rove",
    issue: null,
    scored: true,
    worktreeCount: 2,
    worktreeDenyCount: 2,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_BASELINE_DENY_COUNT + 2,
    largestArgBytes: 8192,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
    echoFailed: false,
    monitorFailed: false,
  });
}

/** Control: same as rove, session tagged as the healthy proof. */
export function seedControl() {
  return seedClew("rove", "loft", {
    session: "90569-control",
    issue: null,
    worktreeCount: 2,
    worktreeDenyCount: 2,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_BASELINE_DENY_COUNT + 2,
    largestArgBytes: 8192,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
    echoFailed: false,
    monitorFailed: false,
  });
}

/**
 * #90569 fouled: 261 worktrees, 524 worktree denies,
 * 687 total denies, 130.7KB single arg, E2BIG, even
 * sleep 5 fails. A working-size coil is not a hold.
 * The fouled case is fouled, never rove.
 */
export function seedFouled() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-fouled",
    worktreeCount: DEMO_WORKTREE_COUNT,
    worktreeDenyCount: DEMO_WORKTREE_DENY_COUNT,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_TOTAL_DENY_COUNT,
    largestArgBytes: DEMO_LARGEST_ARG_BYTES,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    echoFailed: true,
    monitorFailed: true,
  });
}

export function seed90569() {
  return seedFouled();
}

/** Deny list grew two entries per registered worktree without bound. */
export function seedOvercoiled() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-overcoiled",
    worktreeCount: 80,
    worktreeDenyCount: 160,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_BASELINE_DENY_COUNT + 160,
    largestArgBytes: 48000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
  });
}

/** Every Bash spawn fails with E2BIG. */
export function seedChoked() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-choked",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: 0,
    largestArgBytes: 120000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    echoFailed: true,
    monitorFailed: true,
  });
}

/** ~2 deny entries per worktree. */
export function seedTwinned() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-twinned",
    worktreeCount: 8,
    worktreeDenyCount: 16,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_BASELINE_DENY_COUNT + 16,
    largestArgBytes: 12000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
  });
}

/** Deny count unbounded vs a fixed baseline. */
export function seedSwollen() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-swollen",
    worktreeCount: 10,
    worktreeDenyCount: 15,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: 400,
    largestArgBytes: 24000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
  });
}

/** Single /bin/bash -c argument exceeds 128KB. */
export function seedJammed() {
  return seedClew(51126, "anthropics/claude-code#51126", {
    session: "51126-jammed",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: 0,
    largestArgBytes: 140000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: false,
    echoFailed: false,
    monitorFailed: false,
  });
}

/** Worktrees removed + profile rebuilt; spawn lives again. */
export function seedPruned() {
  return seedClew(FEATURED_ISSUE, "anthropics/claude-code#90569", {
    session: "90569-pruned",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: DEMO_BASELINE_DENY_COUNT,
    largestArgBytes: 4096,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
    echoFailed: false,
    monitorFailed: false,
  });
}

/** Profile cached per session so prune without restart still fouls. */
export function seedCached() {
  return seedClew(82840, "anthropics/claude-code#82840", {
    session: "82840-cached",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: 0,
    largestArgBytes: 4096,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    echoFailed: false,
    monitorFailed: false,
    profileCached: true,
    prunedButNotRestarted: true,
  });
}

/** Recursive deny globs expanded per-file into bwrap binds. */
export function seedGlobbed() {
  return seedClew(74081, "anthropics/claude-code#74081", {
    session: "74081-globbed",
    worktreeCount: 0,
    worktreeDenyCount: 0,
    baselineDenyCount: DEMO_BASELINE_DENY_COUNT,
    totalDenyCount: 0,
    largestArgBytes: 24000,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: false,
    echoFailed: true,
    monitorFailed: false,
    globExpandedPerFile: true,
  });
}

/** Idle reset. Line on. Sheave free. Working-size clew. */
export function seedReset() {
  return seedClew("rove", "loft", {
    session: "rove",
    issue: null,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyClew();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneClew({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneClew({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const fouled =
    /261 worktrees|524 worktree den|130\.7KB|even sleep 5 fails|#90569/i.test(text) &&
    /E2BIG|fouled|sleep 5/i.test(text);
  const overcoiled = /two entries per registered worktree without bound|overcoiled/i.test(text);
  const choked = /every Bash spawn fails|sleep 5 \/ echo hello \/ monitor/i.test(text);
  const twinned = /~2 deny entries per worktree|\.git\/worktrees/i.test(text);
  const swollen = /unbounded vs a fixed baseline|~160 baseline/i.test(text);
  const jammed = /exceeds 128KB MAX_ARG_STRLEN|MAX_ARG_STRLEN/i.test(text);
  const pruned = /worktrees removed \+ profile rebuilt|spawn lives again/i.test(text);
  const cached = /profile cached per session|#82840|prunedButNotRestarted/i.test(text);
  const globbed = /globs expanded per-file|#74081|globExpandedPerFile/i.test(text);
  const rove = /admit rove|working-size clew|sheet reeved|spawn lives/i.test(text);

  if (fouled) {
    return {
      ...seedFouled().clew,
      session: "paste-fouled",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (overcoiled) {
    return {
      ...seedOvercoiled().clew,
      session: "paste-overcoiled",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (choked) {
    return {
      ...seedChoked().clew,
      session: "paste-choked",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (twinned) {
    return {
      ...seedTwinned().clew,
      session: "paste-twinned",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (swollen) {
    return {
      ...seedSwollen().clew,
      session: "paste-swollen",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (jammed) {
    return {
      ...seedJammed().clew,
      session: "paste-jammed",
      source: "anthropics/claude-code#51126",
      issue: 51126,
      scored: true,
    };
  }
  if (cached) {
    return {
      ...seedCached().clew,
      session: "paste-cached",
      source: "anthropics/claude-code#82840",
      issue: 82840,
      scored: true,
    };
  }
  if (globbed) {
    return {
      ...seedGlobbed().clew,
      session: "paste-globbed",
      source: "anthropics/claude-code#74081",
      issue: 74081,
      scored: true,
    };
  }
  if (pruned) {
    return {
      ...seedPruned().clew,
      session: "paste-pruned",
      source: "anthropics/claude-code#90569",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (rove) {
    return { ...seedControl().clew, session: "paste-rove", source: "paste", scored: true };
  }
  return { ...emptyClew(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  rove: seedRove,
  control: seedControl,
  fouled: seedFouled,
  90569: seed90569,
  "90569-fouled": seedFouled,
  overcoiled: seedOvercoiled,
  choked: seedChoked,
  twinned: seedTwinned,
  swollen: seedSwollen,
  jammed: seedJammed,
  pruned: seedPruned,
  cached: seedCached,
  globbed: seedGlobbed,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  loft: seedControl,
  bench: seedControl,
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
  let clew = cloneClew(action.clew);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "rove" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return clewResult("rove", emptyClew(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "bench" || verb === "loft") {
    clew = seedControl().clew;
    return clewResult(classify(clew), clew, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "fouled" || verb === "incident" || verb === "90569") {
    clew = seedFouled().clew;
    return clewResult(classify(clew), clew, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "coil" || verb === "reeve") {
    clew = { ...clew, scored: true };
    return clewResult(classify(clew), clew, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "wind") {
    clew = { ...clew, scored: true };
    return clewResult(classify(clew), clew, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "wind" ? "score" : verb,
    });
  }

  clew = { ...clew, scored: true };
  return clewResult(classify(clew), clew, action);
}
