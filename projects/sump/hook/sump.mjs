/**
 * Sump — basement catch-pit desk for Claude Code worktree
 * provisioning that writes Git LFS hooks into a literal
 * relative path `dev/null/` (a real directory with
 * post-checkout, post-commit, post-merge, pre-push LFS
 * shims) instead of the shared `.git/hooks/` /
 * `core.hookspath` target. Hooks are inert (real hookspath
 * is correct) but litter `git status` as untracked clutter.
 * A path that should vanish into null became a shelf of silt.
 *
 * A null path is not a hold. Score the silt or admit drained.
 *
 * Primary #90456: worktree provisioning writes Git LFS hooks
 * to a literal `dev/null/` directory instead of `.git/hooks/`.
 * Worktrees with worktree-scoped `core.hookspath` got
 * `dev/null/` (empty or fully populated with valid LFS hook
 * scripts). Correlation with LFS install racing before
 * hookspath is established. Suggested fix: skip per-worktree
 * LFS install OR resolve hooks dir via
 * `git rev-parse --git-common-dir` / read-back of
 * `core.hookspath` as an absolute path.
 *
 * Hypothesis (from the issue text, not invented): the wrong
 * path is a relative `dev/null` resolved before the
 * worktree hookspath is absolute. On Windows there is no
 * `/dev/null` device, so git-lfs 3.x `filepath.Join`s a
 * relative `./dev/null/` and writes the four shims there.
 *
 * Verdicts: drained | silted | clogged | fouled | pooled
 *           | diverted | littered | phantom | absolute | hooked
 * Idle word is drained (sump emptied; no literal `dev/null/`
 * litter). NEVER use the product name sump as the idle/state
 * word. NEVER use empty. NEVER reuse flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard,
 * clear, paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed (as idle), quiet, seised.
 *
 * Slack sump alarm on silted / clogged / fouled / littered.
 * Linear ticket on silted / clogged / fouled.
 * GitHub sump-ledger of silt events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Wicket (gatehouse / worktree isolation probe). Wicket
 * scores isolation pin vs promise; Sump scores a wrong-path
 * LFS hook install that materializes `/dev/null` as a folder.
 * NOT Scant (timber yard / shell-snapshot PATH truncation).
 * NOT Pleat (tailor fold / mid-turn Desktop collapse).
 * NOT Chad / Kist / Wraith / Gasket / Damper / Cote / Larder /
 * Tappet / Aside / Chute / Tain / Husk / Snib / Veto / Assay /
 * Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom /
 * Hasp / Parity / Reveille / Quench / Scrim / Knock.
 * Different problem: literal `dev/null/` LFS hook litter
 * during worktree provision.
 * Different UI: industrial basement sump pit / wet concrete /
 * rust grate / bilge pump / silt tray.
 * Different idle: drained.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Kerf, Crop, Stump, Snip, Quill,
 * Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion,
 * Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan,
 * Sluice, Culvert, Weir, Bung, Void, Limbo, Oubliette.
 * Product name is Sump only.
 */

export const VERDICTS = Object.freeze([
  "drained",
  "silted",
  "clogged",
  "fouled",
  "pooled",
  "diverted",
  "littered",
  "phantom",
  "absolute",
  "hooked",
]);
export const IDLE_WORD = "drained";
export const SLACK_VERDICTS = Object.freeze(["silted", "clogged", "fouled", "littered"]);
export const LINEAR_VERDICTS = Object.freeze(["silted", "clogged", "fouled"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const LFS_HOOKS = Object.freeze([
  "post-checkout",
  "post-commit",
  "post-merge",
  "pre-push",
]);

const FORBIDDEN_IDLE = Object.freeze([
  "sump",
  "empty",
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
  "kerf",
  "crop",
  "stump",
  "snip",
  "quill",
  "nib",
  "trunc",
  "ferrule",
  "livery",
  "nixie",
  "crypt",
  "fold",
  "accordion",
  "bellows",
  "drain",
  "null",
  "sink",
  "gutter",
  "pit",
  "ash",
  "ashcan",
  "sluice",
  "culvert",
  "weir",
  "bung",
  "void",
  "limbo",
  "oubliette",
  "pleat",
  "scant",
  "chad",
  "wicket",
  "knock",
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

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

function asHookList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function hasHookFiles(probe) {
  return Array.isArray(probe.hookFiles) && probe.hookFiles.length > 0;
}

export function emptyProbe() {
  return {
    literalNullDir: false,
    hookFiles: [],
    emptyNullDir: false,
    fullyPopulated: false,
    hooksLandedInNull: false,
    hooksAreLfsShims: false,
    gitStatusUntracked: false,
    pathResolvedRelative: false,
    hooksNeverFire: false,
    hooksLookReal: false,
    realHookspathCorrect: false,
    hookspathClaimed: "",
    hookspathIsAbsolute: false,
    relativeNullWrite: false,
    lfsInstallRaced: false,
    lfsShimsPresent: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "drained-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const pit = src.pit && typeof src.pit === "object" ? src.pit : {};
  const grate = src.grate && typeof src.grate === "object" ? src.grate : {};
  const bilge = src.bilge && typeof src.bilge === "object" ? src.bilge : {};
  const silt = src.silt && typeof src.silt === "object" ? src.silt : {};
  const pick = (key) => src[key] ?? pit[key] ?? grate[key] ?? bilge[key] ?? silt[key];
  const files = asHookList(pick("hookFiles"));
  return {
    ...emptyProbe(),
    literalNullDir: asBool(pick("literalNullDir")),
    hookFiles: files,
    emptyNullDir: asBool(pick("emptyNullDir")),
    fullyPopulated: asBool(pick("fullyPopulated")) || files.length >= LFS_HOOKS.length,
    hooksLandedInNull: asBool(pick("hooksLandedInNull")),
    hooksAreLfsShims: asBool(pick("hooksAreLfsShims")),
    gitStatusUntracked: asBool(pick("gitStatusUntracked")),
    pathResolvedRelative: asBool(pick("pathResolvedRelative")),
    hooksNeverFire: asBool(pick("hooksNeverFire")),
    hooksLookReal: asBool(pick("hooksLookReal")),
    realHookspathCorrect: asBool(pick("realHookspathCorrect")),
    hookspathClaimed: asText(pick("hookspathClaimed")),
    hookspathIsAbsolute: asBool(pick("hookspathIsAbsolute")),
    relativeNullWrite: asBool(pick("relativeNullWrite")),
    lfsInstallRaced: asBool(pick("lfsInstallRaced")),
    lfsShimsPresent: asBool(pick("lfsShimsPresent")),
    observed: asBool(src.observed ?? pit.observed ?? grate.observed ?? bilge.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? pit.source ?? grate.source ?? bilge.source),
    issue: asIssue(src.issue ?? pit.issue ?? grate.issue ?? bilge.issue),
    scored: asBool(src.scored ?? pit.scored ?? grate.scored ?? bilge.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.literalNullDir &&
    !hasHookFiles(next) &&
    !next.emptyNullDir &&
    !next.fullyPopulated &&
    !next.hooksLandedInNull &&
    !next.hooksAreLfsShims &&
    !next.gitStatusUntracked &&
    !next.pathResolvedRelative &&
    !next.hooksNeverFire &&
    !next.hooksLookReal &&
    !next.realHookspathCorrect &&
    asText(next.hookspathClaimed).trim() === "" &&
    !next.hookspathIsAbsolute &&
    !next.relativeNullWrite &&
    !next.lfsInstallRaced &&
    !next.lfsShimsPresent &&
    !next.observed
  );
}

export function isLiteralNullPath(value) {
  const text = asText(value).trim();
  if (!text) return false;
  return /(?:^|[\\/])dev[\\/]null(?:[\\/]|$)/i.test(text) && !/^[/\\]dev[/\\]null$/i.test(text.replace(/\\/g, "/"));
}

export function parseWorktreeStatus(raw = "") {
  const text = asText(raw);
  const hookFiles = [];
  for (const name of LFS_HOOKS) {
    const re = new RegExp(`dev[\\\\/]null[\\\\/]${name}\\b`, "i");
    if (re.test(text)) hookFiles.push(name);
  }
  const literalNullDir = /dev[\\/]null/i.test(text);
  const hookspathMatch = text.match(/core\.hooks(?:path|Path)\s*[=:]\s*(\S+)/i);
  const hookspathClaimed = hookspathMatch ? hookspathMatch[1] : "";
  const hookspathIsAbsolute = /^([A-Za-z]:[\\/]|\/)/.test(hookspathClaimed);
  return {
    literalNullDir,
    hookFiles,
    emptyNullDir: literalNullDir && hookFiles.length === 0,
    fullyPopulated: hookFiles.length >= LFS_HOOKS.length,
    hooksLandedInNull: hookFiles.length > 0,
    gitStatusUntracked: /untracked|^\?\?/im.test(text) && literalNullDir,
    hookspathClaimed,
    hookspathIsAbsolute,
    pathResolvedRelative: isLiteralNullPath(hookspathClaimed) || /(?:^|[\s=])dev[\\/]null/i.test(text),
    relativeNullWrite: /dev[\\/]null/i.test(text) && !/\/dev\/null\b/.test(text.replace(/\\/g, "/").replace(/^\s*/, "")),
  };
}

/**
 * First match wins. Idle drained is first. Classes stay
 * distinguishable: a null path is not a hold. This is a
 * wrong-path LFS hook install that materializes `/dev/null`
 * as a folder.
 * NOT Wicket (isolation pin). NOT Scant (PATH truncation).
 * NOT Pleat (mid-turn fold). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "drained";

  const files = next.hookFiles;
  const hasFiles = files.length > 0;
  const populated = next.fullyPopulated || files.length >= LFS_HOOKS.length;

  if (
    next.literalNullDir &&
    next.hooksLandedInNull &&
    hasFiles &&
    populated &&
    next.gitStatusUntracked
  ) {
    return "silted";
  }
  if (next.literalNullDir && populated && hasFiles) return "clogged";
  if (next.literalNullDir && next.hooksAreLfsShims && next.hooksLandedInNull && hasFiles) {
    return "fouled";
  }
  if (next.literalNullDir && next.emptyNullDir && !hasFiles) return "pooled";
  if (next.pathResolvedRelative) return "diverted";
  if (next.literalNullDir && next.gitStatusUntracked) return "littered";
  if (next.hooksNeverFire && (next.hooksLookReal || next.hooksAreLfsShims)) return "phantom";
  if (next.hookspathIsAbsolute && next.relativeNullWrite) return "absolute";
  if (next.hooksAreLfsShims || next.lfsShimsPresent) return "hooked";
  if (next.literalNullDir) return "silted";
  return "drained";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (next.literalNullDir && next.fullyPopulated) add("clogged");
  if (next.hooksAreLfsShims && next.hooksLandedInNull) add("fouled");
  if (next.literalNullDir && next.emptyNullDir) add("pooled");
  if (next.pathResolvedRelative) add("diverted");
  if (next.gitStatusUntracked) add("littered");
  if (next.hooksNeverFire && (next.hooksLookReal || next.hooksAreLfsShims)) add("phantom");
  if (next.hookspathIsAbsolute && next.relativeNullWrite) add("absolute");
  if (next.hooksAreLfsShims || next.lfsShimsPresent) add("hooked");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "silted") {
    return "● Silted · literal dev/null/ pit holds stranded LFS hooks · untracked silt";
  }
  if (kind === "clogged") {
    return "● Clogged · grate packed with all four LFS hook shims";
  }
  if (kind === "fouled") {
    return "● Fouled · LFS shims contaminate the literal null pit";
  }
  if (kind === "pooled") {
    return "● Pooled · empty literal dev/null/ directory standing · no files yet";
  }
  if (kind === "diverted") {
    return "● Diverted · hooks path resolved relative · null became a folder";
  }
  if (kind === "littered") {
    return "● Littered · git status shows untracked dev/null/ clutter";
  }
  if (kind === "phantom") {
    return "● Phantom · hooks look real but never fire · real hookspath is elsewhere";
  }
  if (kind === "absolute") {
    return "● Absolute · claimed hookspath is absolute · write targeted relative null";
  }
  if (kind === "hooked") {
    return "● Hooked · LFS shims present · install ran against the wrong hold";
  }
  return "● Drained · sump emptied · no literal dev/null/ litter · idle word is drained";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.literalNullDir
      ? "literal relative path dev/null/ is present as a real directory"
      : "no literal dev/null/ pit on this worktree",
  );
  reasons.push(
    hasHookFiles(next)
      ? `hook files in the pit: ${next.hookFiles.join(", ")}`
      : "no hook files stranded in a null pit",
  );
  reasons.push(
    asText(next.hookspathClaimed).trim()
      ? `claimed core.hookspath ${asText(next.hookspathClaimed).trim()}`
      : "no claimed core.hookspath on this probe",
  );
  reasons.push(
    next.hookspathIsAbsolute
      ? "claimed hookspath is an absolute path"
      : "claimed hookspath is not absolute",
  );
  reasons.push(
    next.hooksLandedInNull
      ? "LFS hooks landed in the literal null directory"
      : "hooks did not land in a literal null directory",
  );
  reasons.push(
    next.pathResolvedRelative
      ? "path resolved relative (dev/null, not /dev/null or NUL)"
      : "path was not scored as a relative null",
  );
  reasons.push(
    next.realHookspathCorrect
      ? "real worktree core.hookspath is already correct (hooks in the pit are inert)"
      : "real hookspath was not scored as correct",
  );
  if (next.emptyNullDir) {
    reasons.push("literal pit is an empty directory only (race interrupted after mkdir)");
  }
  if (next.fullyPopulated) {
    reasons.push("pit is fully populated: post-checkout, post-commit, post-merge, pre-push");
  }
  if (next.hooksAreLfsShims || next.lfsShimsPresent) {
    reasons.push("files are valid Git LFS hook shims (git-lfs <verb> \"$@\")");
  }
  if (next.gitStatusUntracked) {
    reasons.push("git status shows the pit as untracked clutter");
  }
  if (next.hooksNeverFire) {
    reasons.push("hooks in the pit never fire; real hookspath points elsewhere");
  }
  if (next.relativeNullWrite) {
    reasons.push("write targeted a relative null path before hookspath was absolute");
  }
  if (next.lfsInstallRaced) {
    reasons.push("LFS install raced before worktree hookspath was established");
  }
  if (next.observed) {
    reasons.push("Pit sounded: literal dir, hook files, claimed hookspath vs landed path");
  }
  reasons.push("a null path is not a hold");
  reasons.push(
    "NOT Wicket (isolation pin) / Scant (PATH truncation) / Pleat (mid-turn fold) / Chad / leftover woodworking / millimetre-slider",
  );
  if (kind === "drained") {
    reasons.push("sump emptied or desk idle; idle word is drained");
  }
  if (kind === "silted") {
    reasons.push(
      "PRIMARY #90456: worktree provisioning wrote Git LFS hooks to a literal dev/null/ directory instead of .git/hooks/ (relaxed-keller fully populated)",
    );
  }
  if (kind === "clogged") {
    reasons.push("grate packed with all four LFS hook shims; the pit is clogged");
  }
  if (kind === "fouled") {
    reasons.push("LFS shims contaminate the literal null pit");
  }
  if (kind === "pooled") {
    reasons.push(
      "PRIMARY contrast #90456 objective-dijkstra: worktree-scoped hookspath set, literal pit present as an empty directory only",
    );
  }
  if (kind === "diverted") {
    reasons.push(
      "path resolved relative before worktree hookspath was absolute; /dev/null became ./dev/null/",
    );
  }
  if (kind === "littered") {
    reasons.push("git status / git status --untracked-files=all shows the pit as clutter");
  }
  if (kind === "phantom") {
    reasons.push(
      "hooks look real (valid LFS shims) but never fire; real hookspath is correct. Shape #69453: Windows worktree junk dev/null/ of git-lfs hooks",
    );
  }
  if (kind === "absolute") {
    reasons.push("claimed core.hookspath is already absolute; the stray write targeted relative null");
  }
  if (kind === "hooked") {
    reasons.push("LFS shims present; per-worktree lfs install ran against the wrong hold");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) {
    reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function drainedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "drained";
}

export function siltedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "silted";
}

export function cloggedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "clogged";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], drained, silted, clogged }
 * Deterministic. First match wins. Idle drained first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  const cluster = clusterOf(next, verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    drained: drainedOf(next, verdict),
    silted: siltedOf(next, verdict),
    clogged: cloggedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    literalNullDir: pick("literalNullDir"),
    hookFiles: pick("hookFiles"),
    emptyNullDir: pick("emptyNullDir"),
    fullyPopulated: pick("fullyPopulated"),
    hooksLandedInNull: pick("hooksLandedInNull"),
    hooksAreLfsShims: pick("hooksAreLfsShims"),
    gitStatusUntracked: pick("gitStatusUntracked"),
    pathResolvedRelative: pick("pathResolvedRelative"),
    hooksNeverFire: pick("hooksNeverFire"),
    hooksLookReal: pick("hooksLookReal"),
    realHookspathCorrect: pick("realHookspathCorrect"),
    hookspathClaimed: pick("hookspathClaimed"),
    hookspathIsAbsolute: pick("hookspathIsAbsolute"),
    relativeNullWrite: pick("relativeNullWrite"),
    lfsInstallRaced: pick("lfsInstallRaced"),
    lfsShimsPresent: pick("lfsShimsPresent"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    pit: fromFields.pit,
    grate: fromFields.grate,
    bilge: fromFields.bilge,
    silt: fromFields.silt,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "sump",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    drained: scored.drained,
    silted: scored.silted,
    clogged: scored.clogged,
    cluster: scored.cluster,
    pitDrained: verdict === "drained",
    pitSilted: verdict === "silted",
    pitClogged: verdict === "clogged",
    pitFouled: verdict === "fouled",
    pitPooled: verdict === "pooled",
    pitDiverted: verdict === "diverted",
    pitLittered: verdict === "littered",
    pitPhantom: verdict === "phantom",
    pitAbsolute: verdict === "absolute",
    pitHooked: verdict === "hooked",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    literalNullDir: next.literalNullDir,
    hookFiles: next.hookFiles,
    emptyNullDir: next.emptyNullDir,
    fullyPopulated: next.fullyPopulated,
    hooksLandedInNull: next.hooksLandedInNull,
    hooksAreLfsShims: next.hooksAreLfsShims,
    gitStatusUntracked: next.gitStatusUntracked,
    pathResolvedRelative: next.pathResolvedRelative,
    hooksNeverFire: next.hooksNeverFire,
    hooksLookReal: next.hooksLookReal,
    realHookspathCorrect: next.realHookspathCorrect,
    hookspathClaimed: next.hookspathClaimed,
    hookspathIsAbsolute: next.hookspathIsAbsolute,
    relativeNullWrite: next.relativeNullWrite,
    lfsInstallRaced: next.lfsInstallRaced,
    lfsShimsPresent: next.lfsShimsPresent,
    observed: next.observed,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      literalNullDir: Boolean(extras.literalNullDir),
      hookFiles: asHookList(extras.hookFiles),
      emptyNullDir: Boolean(extras.emptyNullDir),
      fullyPopulated: Boolean(extras.fullyPopulated),
      hooksLandedInNull: Boolean(extras.hooksLandedInNull),
      hooksAreLfsShims: Boolean(extras.hooksAreLfsShims),
      gitStatusUntracked: Boolean(extras.gitStatusUntracked),
      pathResolvedRelative: Boolean(extras.pathResolvedRelative),
      hooksNeverFire: Boolean(extras.hooksNeverFire),
      hooksLookReal: Boolean(extras.hooksLookReal),
      realHookspathCorrect: Boolean(extras.realHookspathCorrect),
      hookspathClaimed: extras.hookspathClaimed || "",
      hookspathIsAbsolute: Boolean(extras.hookspathIsAbsolute),
      relativeNullWrite: Boolean(extras.relativeNullWrite),
      lfsInstallRaced: Boolean(extras.lfsInstallRaced),
      lfsShimsPresent: Boolean(extras.lfsShimsPresent),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / shut. Sump emptied. Nothing scored. */
export function seedDrained() {
  return seedProbe("drained", "pit", {
    session: "drained",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90456 silted.
 * relaxed-keller-24b3f9: worktree-scoped hookspath correct
 * (absolute), literal `dev/null/` fully populated with valid
 * LFS hook shims. Cluster: clogged, fouled, littered,
 * diverted, phantom, absolute, hooked.
 */
export function seed90456Silted() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-silted",
    literalNullDir: true,
    hookFiles: LFS_HOOKS.slice(),
    fullyPopulated: true,
    hooksLandedInNull: true,
    hooksAreLfsShims: true,
    gitStatusUntracked: true,
    pathResolvedRelative: true,
    hooksNeverFire: true,
    hooksLookReal: true,
    realHookspathCorrect: true,
    hookspathClaimed: "D:\\wkspaces\\Reveal-Platform\\.git\\hooks",
    hookspathIsAbsolute: true,
    relativeNullWrite: true,
    lfsInstallRaced: true,
    lfsShimsPresent: true,
  });
}

/** Clogged: grate packed with all four shims, no status silt flag. */
export function seedClogged() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-clogged",
    literalNullDir: true,
    hookFiles: LFS_HOOKS.slice(),
    fullyPopulated: true,
    hooksLandedInNull: true,
  });
}

/** Fouled: LFS shims in the pit, partial (not all four). */
export function seedFouled() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-fouled",
    literalNullDir: true,
    hookFiles: ["post-checkout", "pre-push"],
    hooksLandedInNull: true,
    hooksAreLfsShims: true,
  });
}

/** Pooled: #90456 objective-dijkstra empty directory only. */
export function seedPooled() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-pooled",
    literalNullDir: true,
    emptyNullDir: true,
    realHookspathCorrect: true,
    hookspathClaimed: "D:\\wkspaces\\Reveal-Platform\\.git\\hooks",
    hookspathIsAbsolute: true,
  });
}

/** Diverted: path resolved relative; no pit yet. */
export function seedDiverted() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-diverted",
    pathResolvedRelative: true,
    relativeNullWrite: true,
    hookspathClaimed: "dev/null",
  });
}

/** Littered: pit present as untracked clutter, no LFS shims scored. */
export function seedLittered() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-littered",
    literalNullDir: true,
    gitStatusUntracked: true,
  });
}

/** Phantom: hooks look real but never fire. */
export function seedPhantom() {
  return seedProbe(69453, "anthropics/claude-code#69453", {
    session: "69453-phantom",
    hooksNeverFire: true,
    hooksLookReal: true,
    hooksAreLfsShims: true,
    realHookspathCorrect: true,
  });
}

/** Absolute: claimed hookspath is absolute; write targeted relative null. */
export function seedAbsolute() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-absolute",
    hookspathIsAbsolute: true,
    relativeNullWrite: true,
    hookspathClaimed: "D:\\wkspaces\\Reveal-Platform\\.git\\hooks",
    realHookspathCorrect: true,
  });
}

/** Hooked: LFS shims present; install ran. */
export function seedHooked() {
  return seedProbe(90456, "anthropics/claude-code#90456", {
    session: "90456-hooked",
    hooksAreLfsShims: true,
    lfsShimsPresent: true,
  });
}

const SEEDS = {
  drained: seedDrained,
  silted: seed90456Silted,
  90456: seed90456Silted,
  "90456-silted": seed90456Silted,
  clogged: seedClogged,
  "90456-clogged": seedClogged,
  fouled: seedFouled,
  "90456-fouled": seedFouled,
  pooled: seedPooled,
  "90456-pooled": seedPooled,
  diverted: seedDiverted,
  "90456-diverted": seedDiverted,
  littered: seedLittered,
  "90456-littered": seedLittered,
  phantom: seedPhantom,
  69453: seedPhantom,
  "69453-phantom": seedPhantom,
  absolute: seedAbsolute,
  "90456-absolute": seedAbsolute,
  hooked: seedHooked,
  "90456-hooked": seedHooked,
};

function siltedStrike(session) {
  return {
    ...emptyProbe(),
    literalNullDir: true,
    hookFiles: LFS_HOOKS.slice(),
    fullyPopulated: true,
    hooksLandedInNull: true,
    hooksAreLfsShims: true,
    gitStatusUntracked: true,
    pathResolvedRelative: true,
    hooksNeverFire: true,
    hooksLookReal: true,
    realHookspathCorrect: true,
    hookspathClaimed: "D:\\wkspaces\\Reveal-Platform\\.git\\hooks",
    hookspathIsAbsolute: true,
    relativeNullWrite: true,
    lfsInstallRaced: true,
    lfsShimsPresent: true,
    session: session || "silted",
    source: "pit",
    issue: 90456,
    scored: true,
  };
}

function drainedHold(session) {
  return {
    ...emptyProbe(),
    session: session || "drained",
    source: "hold",
    scored: true,
  };
}

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
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "shut" || verb === "bail" || verb === "drained" || verb === "drain") {
    return pack("drained", emptyProbe(), { ...action, action: verb === "drain" ? "bail" : verb });
  }

  if (verb === "silt" || verb === "flood" || verb === "foul") {
    probe = siltedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "silt" });
  }

  if (verb === "pump-out" || verb === "dry-out") {
    probe = drainedHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bail" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "pump") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "pump" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
