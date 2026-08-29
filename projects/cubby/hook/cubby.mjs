/**
 * Cubby — school/office mailroom cubby
 * wall for Claude Code auto-memory that
 * silently resolves to the wrong
 * ancestor-encoded project cache
 * directory, so a real user-authored
 * safety rule in the repo's
 * authoritative memory/ never reaches
 * the session.
 *
 * Recurrence of closed #52772/#53734
 * with fresh harm (#90604): session cwd
 * was /home/user/source/soft-shop (git
 * root with populated memory/), but
 * `# auto memory` was injected from
 * ~/.claude/projects/-home-user/memory/
 * (ancestor /home/user). Neither local
 * cache matched the repo's
 * authoritative memory (hundreds of
 * files missing). A "never git push
 * origin main without go-ahead" rule
 * was invisible; the session pushed to
 * main three times. Chosen cache path
 * is never surfaced in the system
 * prompt/transcript, so the mismatch
 * is undetectable without a manual
 * directory diff.
 *
 * A stuffed cubby is not a hold. Score
 * the wall or admit stowed.
 *
 * Primary #90604: open, filed
 * 2026-08-29, platform:linux,
 * area:core, memory. Auto-memory cache
 * path silently stale/wrong-directory;
 * real safety rule missed. Recurrence
 * of #52772/#53734.
 *
 * Same-class (cite, do not invent):
 *   #52772 — CLOSED. Auto memory
 *            system prompt path uses
 *            CWD-based path but /memory
 *            creates directory at
 *            git-root-based path.
 *   #53734 — CLOSED. Auto-memory
 *            resolver walks up to
 *            ancestor-encoded project
 *            directory instead of
 *            cwd-encoded path.
 *   #89915 — OPEN. Memory directory
 *            resolves to wrong project
 *            hash.
 *   #90046 — OPEN. Memory store path
 *            mismatch between
 *            transcript and index in
 *            repository subdirectories
 *            (transcript under
 *            repo/sub slug, index READ
 *            from repo slug).
 *   #85591 — OPEN. Read tool returns
 *            project-specific
 *            auto-memory content when
 *            global memory path is
 *            specified.
 *   #88945 — OPEN. Path-scoped rules
 *            never match outside the
 *            project root, making the
 *            auto-memory directory
 *            unreachable.
 *   #76617 — OPEN. Non-ASCII username
 *            in path corrupts
 *            project-slug, breaking
 *            session/memory continuity.
 *
 * Cross-ecosystem:
 *   openai/codex#16799 — Cross-project,
 *            cross-session state leak
 *            (approved command paths
 *            leak across projects).
 *   openai/codex#37950 — Realtime
 *            voice sessions do not
 *            receive AGENTS.md /
 *            Personality instructions
 *            that text sessions do
 *            (instructions fail to
 *            reach session).
 *
 * Verdicts: stowed | misfiled |
 *           ancestor | stale |
 *           invisible | walked-up |
 *           unsurfaced | ghosted |
 *           mirrored-fail | restored
 * Idle word is stowed (correct
 * cwd/git-root cache used;
 * authoritative memory mirrored;
 * safety rules visible; cache path
 * would be detectable).
 * NEVER use cubby / empty / silent /
 * mute / idle / dead as idle.
 * NEVER reuse posted, bunged, belayed,
 * rove, keyed, housed, beamed, snug,
 * hung, appointed, cinched, gauged,
 * stamped, overrun, pratique, wound,
 * bound, stilled, stabled, drained,
 * flat, fit, spoilt, laid, unlinked,
 * tight, banked, roosted, stocked,
 * seated, heard, clear, paired,
 * kernel, latched, upheld, sterling,
 * home, valid, dry, sealed, quiet,
 * seised, rung, moored.
 * Do NOT ship Sorter, Fiche, Carrel,
 * Niche, Locker, Pigeon, Tray,
 * Cabinet, Folio, Docket, Alcove,
 * Stack, Binder, Press, Rolodex,
 * Cardex, Misfile, Shelf, Pigeonhole
 * as the product name. Product name
 * is Cubby only.
 *
 * Slack alarm on misfiled / ancestor /
 * stale / invisible / walked-up /
 * ghosted / mirrored-fail.
 * Linear ticket on invisible /
 * ancestor / walked-up / ghosted.
 * GitHub cubby-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   invisible > ancestor > walked-up >
 *   misfiled > stale > ghosted >
 *   mirrored-fail > unsurfaced >
 *   restored > stowed
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90604 invisible pentad
 * (ancestor-encoded cache, safety
 * rule only in authoritative memory,
 * hundreds of files missing, cache
 * path unsurfaced, cwd/git-root
 * encode a different cubby).
 *
 * stowed is true ONLY when the cache
 * matches cwd/git-root, authoritative
 * memory is mirrored, safety rules
 * would be visible, the cache path
 * would be detectable, and the
 * verdict is not a failure class.
 *
 * Why this is not a clone:
 * NOT Ullage — silent 157K context
 *     drop then prefix-frozen cache
 *     thrash. Cubby is wrong
 *     *directory* for auto-memory
 *     injection, not context
 *     compaction.
 * NOT Iota — path-key casing /
 *     type-case identity. Cubby is
 *     ancestor-walk / hash mismatch
 *     for memory cache, not case
 *     folding.
 * NOT Fob — Keychain credential
 *     litter.
 * NOT Cinch — silent partial folder
 *     mounts on scheduled Cowork.
 * NOT Wicket — worktree isolation
 *     gatehouse.
 * NOT Grille — Bash-steered edits
 *     under bypass-permissions.
 * NOT Spile — hook stdin wedge /
 *     unenforced timeout.
 * NOT Bollard — RC env orphan after
 *     supervisor gap.
 * NOT Clew — sandbox deny-list
 *     E2BIG.
 * NOT Hasp — file-path lease races.
 * Different problem: AUTO-MEMORY
 * RESOLVES TO ANCESTOR/WRONG-HASH
 * CACHE → SAFETY RULES IN
 * AUTHORITATIVE MEMORY NEVER REACH
 * THE SESSION.
 * Different UI: school/office
 * mailroom cubby wall — warm oak
 * cubbies with brass nameplates,
 * wrong ancestor cubby lit amber,
 * correct project cubby empty of the
 * safety-rule envelope, directory-
 * diff lamp, mirror-fail stamp.
 * Different idle: stowed.
 */

export const VERDICTS = Object.freeze([
  "stowed",
  "misfiled",
  "ancestor",
  "stale",
  "invisible",
  "walked-up",
  "unsurfaced",
  "ghosted",
  "mirrored-fail",
  "restored",
]);
export const IDLE_WORD = "stowed";
export const SLACK_VERDICTS = Object.freeze([
  "misfiled",
  "ancestor",
  "stale",
  "invisible",
  "walked-up",
  "ghosted",
  "mirrored-fail",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "invisible",
  "ancestor",
  "walked-up",
  "ghosted",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90604;
export const CWD_GIT_ISSUE = 52772;
export const ANCESTOR_ISSUE = 53734;
export const WRONG_HASH_ISSUE = 89915;
export const TRANSCRIPT_INDEX_ISSUE = 90046;
export const READ_WRONG_SCOPE_ISSUE = 85591;
export const PATH_SCOPED_ISSUE = 88945;
export const NON_ASCII_ISSUE = 76617;
export const CODEX_LEAK_ISSUE = 16799;
export const CODEX_VOICE_ISSUE = 37950;
export const DEMO_CWD = "/home/user/source/soft-shop";
export const DEMO_GIT_ROOT = "/home/user/source/soft-shop";
export const DEMO_EXPECTED_CACHE = "~/.claude/projects/-home-user-source-soft-shop/memory/";
export const DEMO_INJECTED_CACHE = "~/.claude/projects/-home-user/memory/";
export const DEMO_AUTHORITATIVE = "/home/user/source/soft-shop/memory/";
export const DEMO_MISSING_FILE_COUNT = 247;
export const DEMO_MISFILED_CACHE = "~/.claude/projects/-home-user-source-other-shop/memory/";
export const DEMO_WALKED_CWD = "/home/user/source/soft-shop/packages/app";
export const DEMO_WALKED_INJECTED = "~/.claude/projects/-home-user-source-soft-shop/memory/";
export const DEMO_WALKED_EXPECTED = "~/.claude/projects/-home-user-source-soft-shop-packages-app/memory/";

const FORBIDDEN_IDLE = Object.freeze([
  "cubby",
  "sorter",
  "fiche",
  "carrel",
  "niche",
  "locker",
  "pigeon",
  "tray",
  "cabinet",
  "folio",
  "docket",
  "alcove",
  "stack",
  "binder",
  "press",
  "rolodex",
  "cardex",
  "misfile",
  "shelf",
  "pigeonhole",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "sealed",
  "quiet",
  "seised",
  "rung",
  "moored",
  "grille",
  "spile",
  "bollard",
  "clew",
  "ullage",
  "iota",
  "fob",
  "cinch",
  "wicket",
  "hasp",
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

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function normPath(value) {
  const text = asText(value).trim();
  if (!text) return "";
  return text.replace(/\/+$/, "") || text;
}

function pathsDiffer(left, right) {
  const a = normPath(left);
  const b = normPath(right);
  return Boolean(a) && Boolean(b) && a !== b;
}

function pathsMatch(left, right) {
  const a = normPath(left);
  const b = normPath(right);
  return Boolean(a) && Boolean(b) && a === b;
}

export function emptyCubby() {
  return {
    session: "",
    issue: null,
    source: "",
    cwd: "",
    gitRoot: "",
    expectedCachePath: "",
    injectedCachePath: "",
    ancestorWalkUp: false,
    cwdVsGitRootSplit: false,
    authoritativeMemoryPath: "",
    injectedMissingFileCount: 0,
    safetyRuleInAuthoritativeOnly: false,
    cachePathSurfaced: false,
    nonAsciiSlugCorrupt: false,
    wrongProjectHash: false,
    pathScopedUnreachable: false,
    readReturnedWrongScope: false,
    restoredDiagnostic: false,
    scored: false,
  };
}

export function emptyAction(session = "stowed-1") {
  return {
    action: "score",
    session,
    cubby: emptyCubby(),
  };
}

export function cloneCubby(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyCubby();
  const nested =
    (src.cubby && typeof src.cubby === "object" && src.cubby) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.wall && typeof src.wall === "object" && src.wall) ||
    src;
  return {
    ...emptyCubby(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    cwd: asText(nested.cwd ?? src.cwd),
    gitRoot: asText(nested.gitRoot ?? src.gitRoot),
    expectedCachePath: asText(nested.expectedCachePath ?? src.expectedCachePath),
    injectedCachePath: asText(nested.injectedCachePath ?? src.injectedCachePath),
    ancestorWalkUp: asBool(nested.ancestorWalkUp ?? src.ancestorWalkUp, false) === true,
    cwdVsGitRootSplit: asBool(nested.cwdVsGitRootSplit ?? src.cwdVsGitRootSplit, false) === true,
    authoritativeMemoryPath: asText(nested.authoritativeMemoryPath ?? src.authoritativeMemoryPath),
    injectedMissingFileCount: asNumber(nested.injectedMissingFileCount ?? src.injectedMissingFileCount, 0),
    safetyRuleInAuthoritativeOnly:
      asBool(nested.safetyRuleInAuthoritativeOnly ?? src.safetyRuleInAuthoritativeOnly, false) === true,
    cachePathSurfaced: asBool(nested.cachePathSurfaced ?? src.cachePathSurfaced, false) === true,
    nonAsciiSlugCorrupt: asBool(nested.nonAsciiSlugCorrupt ?? src.nonAsciiSlugCorrupt, false) === true,
    wrongProjectHash: asBool(nested.wrongProjectHash ?? src.wrongProjectHash, false) === true,
    pathScopedUnreachable: asBool(nested.pathScopedUnreachable ?? src.pathScopedUnreachable, false) === true,
    readReturnedWrongScope: asBool(nested.readReturnedWrongScope ?? src.readReturnedWrongScope, false) === true,
    restoredDiagnostic: asBool(nested.restoredDiagnostic ?? src.restoredDiagnostic, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(cubby = {}) {
  const next = cloneCubby(cubby);
  const cacheMisfiled = pathsDiffer(next.expectedCachePath, next.injectedCachePath);
  const cacheMatched = pathsMatch(next.expectedCachePath, next.injectedCachePath);
  const invisibleShape = next.safetyRuleInAuthoritativeOnly === true;
  const ancestorShape = invisibleShape !== true && next.ancestorWalkUp === true;
  const walkedUpShape =
    invisibleShape !== true && ancestorShape !== true && next.cwdVsGitRootSplit === true;
  const misfiledShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    cacheMisfiled === true;
  const staleShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    misfiledShape !== true &&
    next.injectedMissingFileCount > 0;
  const ghostedShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    misfiledShape !== true &&
    staleShape !== true &&
    (next.nonAsciiSlugCorrupt === true || next.wrongProjectHash === true);
  const mirroredFailShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    misfiledShape !== true &&
    staleShape !== true &&
    ghostedShape !== true &&
    (next.pathScopedUnreachable === true || next.readReturnedWrongScope === true);
  const unsurfacedShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    misfiledShape !== true &&
    staleShape !== true &&
    ghostedShape !== true &&
    mirroredFailShape !== true &&
    next.cachePathSurfaced !== true &&
    Boolean(asText(next.injectedCachePath));
  const restoredShape =
    invisibleShape !== true &&
    ancestorShape !== true &&
    walkedUpShape !== true &&
    misfiledShape !== true &&
    staleShape !== true &&
    ghostedShape !== true &&
    mirroredFailShape !== true &&
    unsurfacedShape !== true &&
    next.restoredDiagnostic === true;
  const stowedHold =
    cacheMatched === true &&
    next.ancestorWalkUp !== true &&
    next.cwdVsGitRootSplit !== true &&
    next.injectedMissingFileCount <= 0 &&
    next.safetyRuleInAuthoritativeOnly !== true &&
    next.cachePathSurfaced === true &&
    next.nonAsciiSlugCorrupt !== true &&
    next.wrongProjectHash !== true &&
    next.pathScopedUnreachable !== true &&
    next.readReturnedWrongScope !== true &&
    next.restoredDiagnostic !== true;
  return {
    cwd: next.cwd,
    gitRoot: next.gitRoot,
    expectedCachePath: next.expectedCachePath,
    injectedCachePath: next.injectedCachePath,
    ancestorWalkUp: next.ancestorWalkUp,
    cwdVsGitRootSplit: next.cwdVsGitRootSplit,
    authoritativeMemoryPath: next.authoritativeMemoryPath,
    injectedMissingFileCount: next.injectedMissingFileCount,
    safetyRuleInAuthoritativeOnly: next.safetyRuleInAuthoritativeOnly,
    cachePathSurfaced: next.cachePathSurfaced,
    nonAsciiSlugCorrupt: next.nonAsciiSlugCorrupt,
    wrongProjectHash: next.wrongProjectHash,
    pathScopedUnreachable: next.pathScopedUnreachable,
    readReturnedWrongScope: next.readReturnedWrongScope,
    restoredDiagnostic: next.restoredDiagnostic,
    cacheMisfiled,
    cacheMatched,
    invisibleShape,
    ancestorShape,
    walkedUpShape,
    misfiledShape,
    staleShape,
    ghostedShape,
    mirroredFailShape,
    unsurfacedShape,
    restoredShape,
    stowedHold,
  };
}

export function isIdle(cubby = {}) {
  const next = cloneCubby(cubby);
  return (
    !asText(next.cwd) &&
    !asText(next.gitRoot) &&
    !asText(next.expectedCachePath) &&
    !asText(next.injectedCachePath) &&
    !asText(next.authoritativeMemoryPath) &&
    next.ancestorWalkUp !== true &&
    next.cwdVsGitRootSplit !== true &&
    next.injectedMissingFileCount <= 0 &&
    next.safetyRuleInAuthoritativeOnly !== true &&
    next.cachePathSurfaced !== true &&
    next.nonAsciiSlugCorrupt !== true &&
    next.wrongProjectHash !== true &&
    next.pathScopedUnreachable !== true &&
    next.readReturnedWrongScope !== true &&
    next.restoredDiagnostic !== true
  );
}

/**
 * First match wins by documented priority:
 * invisible > ancestor > walked-up >
 * misfiled > stale > ghosted >
 * mirrored-fail > unsurfaced >
 * restored > stowed.
 * Idle stowed is first. Seeded #90604
 * numbers must produce invisible (or
 * ancestor), never stowed. Prefer
 * invisible when the safety rule lives
 * only in authoritative memory. A
 * stuffed cubby is not a hold.
 */
export function classify(cubby = {}) {
  const next = cloneCubby(cubby);
  if (isIdle(next)) return "stowed";
  const facts = analyze(next);

  if (facts.invisibleShape) return "invisible";
  if (facts.ancestorShape) return "ancestor";
  if (facts.walkedUpShape) return "walked-up";
  if (facts.misfiledShape) return "misfiled";
  if (facts.staleShape) return "stale";
  if (facts.ghostedShape) return "ghosted";
  if (facts.mirroredFailShape) return "mirrored-fail";
  if (facts.unsurfacedShape) return "unsurfaced";
  if (facts.restoredShape) return "restored";
  if (facts.stowedHold) return "stowed";
  return "stowed";
}

export function feedOf(cubby = {}, verdict = "") {
  const kind = verdict || classify(cubby);
  if (kind === "invisible") {
    return "● Invisible · safety rule present only in authoritative memory never reached the session · never git push origin main without go-ahead · primary #90604";
  }
  if (kind === "ancestor") {
    return "● Ancestor · resolver walked up to an ancestor-encoded project directory · #53734 / #90604 shape";
  }
  if (kind === "walked-up") {
    return "● Walked-up · CWD vs git-root path split · prompt path and /memory or index path disagree · #52772 / #90046";
  }
  if (kind === "misfiled") {
    return "● Misfiled · injected auto-memory came from a different project-hash folder than the session cwd/git-root encodes";
  }
  if (kind === "stale") {
    return "● Stale · chosen local cache significantly behind authoritative repo memory/ · files missing · mirror step silently failing";
  }
  if (kind === "ghosted") {
    return "● Ghosted · Non-ASCII / hash corruption breaks continuity · #76617 · or wrong project hash · #89915";
  }
  if (kind === "mirrored-fail") {
    return "● Mirrored-fail · Read/tool path returns wrong scope memory · #85591 · or path-scoped rules make auto-memory unreachable · #88945";
  }
  if (kind === "unsurfaced") {
    return "● Unsurfaced · resolved cache path never shown in system prompt or transcript · mismatch undetectable without a manual directory diff";
  }
  if (kind === "restored") {
    return "● Restored · diagnostic surfaces the resolved path and/or re-resolve against actual git-root/cwd · recovery class";
  }
  return "● Stowed · correct cache for cwd/git-root · authoritative memory mirrored · safety rules would be visible · cache path would be detectable · idle word is stowed";
}

export function reasonsOf(cubby = {}, verdict = "") {
  const next = cloneCubby(cubby);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.expectedCachePath ||
      facts.injectedCachePath ||
      facts.ancestorWalkUp ||
      facts.safetyRuleInAuthoritativeOnly ||
      facts.cwdVsGitRootSplit
      ? `cwd ${facts.cwd || "—"} · git-root ${facts.gitRoot || "—"} · expected ${facts.expectedCachePath || "—"} · injected ${facts.injectedCachePath || "—"} · missing ${facts.injectedMissingFileCount} · surfaced ${facts.cachePathSurfaced ? "yes" : "no"}`
      : "correct cubby · authoritative memory mirrored · safety rules visible · cache path detectable · idle word is stowed",
  );
  if (facts.invisibleShape) {
    reasons.push(
      "a concrete safety rule present only in authoritative memory was missing from the injected cache · never git push origin main without go-ahead · the #90604 harm",
    );
  }
  if (facts.ancestorWalkUp) {
    reasons.push(
      "resolver walked up to an ancestor-encoded project directory · #53734 / #90604 · injected ~/.claude/projects/-home-user/memory/ instead of the cwd/git-root cubby",
    );
  }
  if (facts.cwdVsGitRootSplit) {
    reasons.push(
      "CWD vs git-root path split · prompt path and /memory or index path disagree · #52772 / #90046",
    );
  }
  if (facts.cacheMisfiled) {
    reasons.push(
      "injected auto-memory came from a different project-hash folder than the session cwd/git-root encodes",
    );
  }
  if (facts.injectedMissingFileCount > 0) {
    reasons.push(
      `chosen local cache significantly behind authoritative repo memory/ · ${facts.injectedMissingFileCount} files missing · mirror step silently failing`,
    );
  }
  if (facts.cachePathSurfaced !== true && (facts.injectedCachePath || facts.invisibleShape || facts.ancestorWalkUp)) {
    reasons.push(
      "resolved cache path never shown in system prompt or transcript · mismatch undetectable without a manual directory diff",
    );
  }
  if (facts.nonAsciiSlugCorrupt || facts.wrongProjectHash) {
    reasons.push(
      "Non-ASCII / hash corruption breaks continuity (#76617) or wrong project hash (#89915)",
    );
  }
  if (facts.pathScopedUnreachable || facts.readReturnedWrongScope) {
    reasons.push(
      "Read/tool path returns wrong scope memory (#85591) or path-scoped rules make auto-memory unreachable (#88945)",
    );
  }
  if (facts.restoredDiagnostic) {
    reasons.push("diagnostic surfaces the resolved path and/or re-resolve against actual git-root/cwd");
  }
  reasons.push("a stuffed cubby is not a hold");
  reasons.push(
    "NOT Ullage (silent context drop / prefix-frozen cache) / Iota (path-key casing) / Fob (Keychain litter) / Cinch (partial Cowork mounts) / Wicket (worktree gatehouse) / Grille (Bash-steered edits) / Spile (hook stdin wedge) / Bollard (RC env orphan) / Clew (deny-list E2BIG) / Hasp (file-path lease) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "stowed") {
    reasons.push(
      "correct cache for cwd/git-root; authoritative memory mirrored; safety rules would be visible; cache path would be detectable; idle word is stowed",
    );
  }
  if (kind === "invisible") {
    reasons.push(
      "PRIMARY #90604: session cwd /home/user/source/soft-shop; # auto memory injected from ancestor /home/user cache; never-push-main rule invisible. The invisible case is invisible, never stowed.",
    );
  }
  if (kind === "ancestor") {
    reasons.push("resolver walked up to an ancestor-encoded project directory. #53734 / #90604 shape.");
  }
  if (kind === "walked-up") {
    reasons.push("CWD vs git-root path split. Prompt path and /memory or index path disagree.");
  }
  if (kind === "misfiled") {
    reasons.push("injected auto-memory came from a different project-hash folder.");
  }
  if (kind === "stale") {
    reasons.push("chosen local cache significantly behind authoritative repo memory/.");
  }
  if (kind === "ghosted") {
    reasons.push("Non-ASCII slug corruption or wrong project hash broke continuity.");
  }
  if (kind === "mirrored-fail") {
    reasons.push("Read/tool returned wrong-scope memory, or path-scoped rules made auto-memory unreachable.");
  }
  if (kind === "unsurfaced") {
    reasons.push("resolved cache path never shown in system prompt or transcript.");
  }
  if (kind === "restored") {
    reasons.push("diagnostic surfaces the resolved path and/or re-resolves against actual git-root/cwd.");
  }
  return reasons;
}

export function verdictOf(cubby = {}) {
  return classify(cubby);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function stowedOf(cubby = {}, verdict = "") {
  const kind = verdict || classify(cubby);
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (kind === "unsurfaced" || kind === "restored") return false;
  const facts = analyze(cubby);
  if (isIdle(cubby)) return true;
  return facts.stowedHold === true;
}

export function invisibleOf(cubby = {}, verdict = "") {
  return (verdict || classify(cubby)) === "invisible";
}

export function summaryOf(cubby = {}) {
  const next = cloneCubby(cubby);
  const facts = analyze(next);
  return {
    cwd: facts.cwd,
    gitRoot: facts.gitRoot,
    expectedCachePath: facts.expectedCachePath,
    injectedCachePath: facts.injectedCachePath,
    ancestorWalkUp: facts.ancestorWalkUp,
    cwdVsGitRootSplit: facts.cwdVsGitRootSplit,
    authoritativeMemoryPath: facts.authoritativeMemoryPath,
    injectedMissingFileCount: facts.injectedMissingFileCount,
    safetyRuleInAuthoritativeOnly: facts.safetyRuleInAuthoritativeOnly,
    cachePathSurfaced: facts.cachePathSurfaced,
    nonAsciiSlugCorrupt: facts.nonAsciiSlugCorrupt,
    wrongProjectHash: facts.wrongProjectHash,
    pathScopedUnreachable: facts.pathScopedUnreachable,
    readReturnedWrongScope: facts.readReturnedWrongScope,
    restoredDiagnostic: facts.restoredDiagnostic,
  };
}

export function score(cubby = {}) {
  const next = cloneCubby(cubby);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    stowed: stowedOf(next, verdict),
    invisible: invisibleOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    cwd: facts.cwd,
    gitRoot: facts.gitRoot,
    expectedCachePath: facts.expectedCachePath,
    injectedCachePath: facts.injectedCachePath,
    ancestorWalkUp: facts.ancestorWalkUp,
    cwdVsGitRootSplit: facts.cwdVsGitRootSplit,
    authoritativeMemoryPath: facts.authoritativeMemoryPath,
    injectedMissingFileCount: facts.injectedMissingFileCount,
    safetyRuleInAuthoritativeOnly: facts.safetyRuleInAuthoritativeOnly,
    cachePathSurfaced: facts.cachePathSurfaced,
    nonAsciiSlugCorrupt: facts.nonAsciiSlugCorrupt,
    wrongProjectHash: facts.wrongProjectHash,
    pathScopedUnreachable: facts.pathScopedUnreachable,
    readReturnedWrongScope: facts.readReturnedWrongScope,
    restoredDiagnostic: facts.restoredDiagnostic,
    summary: summaryOf(next),
    cubby: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const cubbySrc =
    src.cubby ||
    src.probe ||
    src.payload ||
    src.wall ||
    payload.cubby ||
    payload.probe ||
    payload.wall;
  const cubby = cloneCubby(
    cubbySrc && typeof cubbySrc === "object" ? { ...cubbySrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !cubby.session) cubby.session = src.session;
  if (typeof payload.session === "string" && !cubby.session) cubby.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? cubby.session ?? ""),
    cubby,
    issue: src.issue ?? payload.issue ?? cubby.issue ?? null,
    source: src.source ?? payload.source ?? cubby.source ?? "",
  };
}

function cubbyResult(verdict, cubby, action, extras = {}) {
  const next = cloneCubby(cubby);
  const scored = score(next);
  return {
    ok: true,
    product: "cubby",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    stowed: scored.stowed,
    invisible: scored.invisible,
    cubbyStowed: verdict === "stowed",
    cubbyMisfiled: verdict === "misfiled",
    cubbyAncestor: verdict === "ancestor",
    cubbyStale: verdict === "stale",
    cubbyInvisible: verdict === "invisible",
    cubbyWalkedUp: verdict === "walked-up",
    cubbyUnsurfaced: verdict === "unsurfaced",
    cubbyGhosted: verdict === "ghosted",
    cubbyMirroredFail: verdict === "mirrored-fail",
    cubbyRestored: verdict === "restored",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    cwd: scored.cwd,
    gitRoot: scored.gitRoot,
    expectedCachePath: scored.expectedCachePath,
    injectedCachePath: scored.injectedCachePath,
    ancestorWalkUp: scored.ancestorWalkUp,
    cwdVsGitRootSplit: scored.cwdVsGitRootSplit,
    authoritativeMemoryPath: scored.authoritativeMemoryPath,
    injectedMissingFileCount: scored.injectedMissingFileCount,
    safetyRuleInAuthoritativeOnly: scored.safetyRuleInAuthoritativeOnly,
    cachePathSurfaced: scored.cachePathSurfaced,
    nonAsciiSlugCorrupt: scored.nonAsciiSlugCorrupt,
    wrongProjectHash: scored.wrongProjectHash,
    pathScopedUnreachable: scored.pathScopedUnreachable,
    readReturnedWrongScope: scored.readReturnedWrongScope,
    restoredDiagnostic: scored.restoredDiagnostic,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    cubby: next,
    ...extras,
  };
}

function seedCubby(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    cubby: {
      ...emptyCubby(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      cwd: asText(extras.cwd),
      gitRoot: asText(extras.gitRoot),
      expectedCachePath: asText(extras.expectedCachePath),
      injectedCachePath: asText(extras.injectedCachePath),
      ancestorWalkUp: Boolean(extras.ancestorWalkUp),
      cwdVsGitRootSplit: Boolean(extras.cwdVsGitRootSplit),
      authoritativeMemoryPath: asText(extras.authoritativeMemoryPath),
      injectedMissingFileCount: asNumber(extras.injectedMissingFileCount, 0),
      safetyRuleInAuthoritativeOnly: Boolean(extras.safetyRuleInAuthoritativeOnly),
      cachePathSurfaced: Boolean(extras.cachePathSurfaced),
      nonAsciiSlugCorrupt: Boolean(extras.nonAsciiSlugCorrupt),
      wrongProjectHash: Boolean(extras.wrongProjectHash),
      pathScopedUnreachable: Boolean(extras.pathScopedUnreachable),
      readReturnedWrongScope: Boolean(extras.readReturnedWrongScope),
      restoredDiagnostic: Boolean(extras.restoredDiagnostic),
    },
  };
}

/** Idle reset. Correct cubby. Memory mirrored. Rule visible. */
export function seedStowed() {
  return seedCubby("stowed", "mailroom", {
    session: "stowed",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedStowed();
}

/**
 * Control / proof: correct cwd/git-root
 * cache, authoritative memory mirrored,
 * safety rules visible, cache path
 * surfaced. Classifies as stowed;
 * stowed true.
 */
export function seedControl() {
  return seedCubby(FEATURED_ISSUE, "anthropics/claude-code#90604", {
    session: "90604-control",
    issue: null,
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
    injectedMissingFileCount: 0,
    safetyRuleInAuthoritativeOnly: false,
    cachePathSurfaced: true,
  });
}

/**
 * #90604 invisible: ancestor-encoded
 * cache, safety rule only in
 * authoritative memory, hundreds of
 * files missing, cache path unsurfaced.
 * A stuffed cubby is not a hold. Prefer
 * invisible when the safety rule lives
 * only in authoritative memory. Never
 * stowed.
 */
export function seedInvisible() {
  return seedCubby(FEATURED_ISSUE, "anthropics/claude-code#90604", {
    session: "90604-invisible",
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
    injectedMissingFileCount: DEMO_MISSING_FILE_COUNT,
    safetyRuleInAuthoritativeOnly: true,
    cachePathSurfaced: false,
  });
}

export function seed90604() {
  return seedInvisible();
}

/**
 * Resolver walked up to an ancestor-
 * encoded project directory. Unique
 * flags: walk-up without the safety-
 * rule-invisible harm.
 */
export function seedAncestor() {
  return seedCubby(ANCESTOR_ISSUE, "anthropics/claude-code#53734", {
    session: "90604-ancestor",
    issue: ANCESTOR_ISSUE,
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
  });
}

/** CWD vs git-root path split. Prompt vs /memory disagree. */
export function seedWalkedUp() {
  return seedCubby(CWD_GIT_ISSUE, "anthropics/claude-code#52772", {
    session: "90604-walked-up",
    issue: CWD_GIT_ISSUE,
    cwd: DEMO_WALKED_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_WALKED_EXPECTED,
    injectedCachePath: DEMO_WALKED_INJECTED,
    cwdVsGitRootSplit: true,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
  });
}

/** Different project-hash folder. Not an ancestor walk. */
export function seedMisfiled() {
  return seedCubby(WRONG_HASH_ISSUE, "anthropics/claude-code#89915", {
    session: "90604-misfiled",
    issue: WRONG_HASH_ISSUE,
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_MISFILED_CACHE,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
  });
}

/**
 * Same cubby, cache behind
 * authoritative memory. Unique flags:
 * matching paths, files missing, no
 * safety-rule exclusive.
 */
export function seedStale() {
  return seedCubby(FEATURED_ISSUE, "anthropics/claude-code#90604", {
    session: "90604-stale",
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
    injectedMissingFileCount: DEMO_MISSING_FILE_COUNT,
  });
}

/** Non-ASCII slug corruption or wrong project hash. */
export function seedGhosted() {
  return seedCubby(NON_ASCII_ISSUE, "anthropics/claude-code#76617", {
    session: "90604-ghosted",
    issue: NON_ASCII_ISSUE,
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    nonAsciiSlugCorrupt: true,
    wrongProjectHash: true,
  });
}

/** Read/tool wrong scope, or path-scoped rules unreachable. */
export function seedMirroredFail() {
  return seedCubby(READ_WRONG_SCOPE_ISSUE, "anthropics/claude-code#85591", {
    session: "90604-mirrored-fail",
    issue: READ_WRONG_SCOPE_ISSUE,
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    pathScopedUnreachable: true,
    readReturnedWrongScope: true,
  });
}

/**
 * Cache path never shown in system
 * prompt or transcript. Unique flags:
 * an injected path exists, not
 * surfaced, no higher class.
 */
export function seedUnsurfaced() {
  return seedCubby(FEATURED_ISSUE, "anthropics/claude-code#90604", {
    session: "90604-unsurfaced",
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
    cachePathSurfaced: false,
  });
}

/** Diagnostic surfaces the resolved path / re-resolves. */
export function seedRestored() {
  return seedCubby(FEATURED_ISSUE, "anthropics/claude-code#90604", {
    session: "90604-restored",
    cwd: DEMO_CWD,
    gitRoot: DEMO_GIT_ROOT,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    authoritativeMemoryPath: DEMO_AUTHORITATIVE,
    cachePathSurfaced: true,
    restoredDiagnostic: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyCubby();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneCubby({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneCubby({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const invisible =
    /never git push origin main|#90604|safety rule|push-to-main|authoritative only/i.test(text) &&
    /invisible|missed|never reached|wrong ancestor|injected from/i.test(text);
  const ancestor = /ancestor-encoded|walked up to an ancestor|#53734|ancestor cubby/i.test(text);
  const walkedUp = /walked-up|CWD vs git-root|#52772|#90046|prompt path and \/memory/i.test(text);
  const misfiled = /misfiled|different project-hash|wrong hash folder/i.test(text);
  const stale = /stale|files missing|mirror step silently|hundreds of files/i.test(text);
  const ghosted = /ghosted|Non-ASCII|#76617|wrong project hash|#89915/i.test(text);
  const mirroredFail = /mirrored-fail|#85591|#88945|path-scoped|wrong scope/i.test(text);
  const unsurfaced = /unsurfaced|never shown|manual directory diff|cache path never/i.test(text);
  const restored = /restored|re-resolve|diagnostic surfaces/i.test(text);
  const stowed = /admit stowed|correct cache|authoritative memory mirrored/i.test(text);

  if (invisible) {
    return {
      ...seedInvisible().cubby,
      session: "paste-invisible",
      source: "anthropics/claude-code#90604",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (ancestor && !/invisible/.test(text)) {
    return {
      ...seedAncestor().cubby,
      session: "paste-ancestor",
      source: "anthropics/claude-code#53734",
      issue: ANCESTOR_ISSUE,
      scored: true,
    };
  }
  if (walkedUp) {
    return {
      ...seedWalkedUp().cubby,
      session: "paste-walked-up",
      source: "anthropics/claude-code#52772",
      issue: CWD_GIT_ISSUE,
      scored: true,
    };
  }
  if (misfiled) {
    return {
      ...seedMisfiled().cubby,
      session: "paste-misfiled",
      source: "anthropics/claude-code#89915",
      issue: WRONG_HASH_ISSUE,
      scored: true,
    };
  }
  if (stale && !/invisible/.test(text)) {
    return {
      ...seedStale().cubby,
      session: "paste-stale",
      source: "anthropics/claude-code#90604",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (ghosted) {
    return {
      ...seedGhosted().cubby,
      session: "paste-ghosted",
      source: "anthropics/claude-code#76617",
      issue: NON_ASCII_ISSUE,
      scored: true,
    };
  }
  if (mirroredFail) {
    return {
      ...seedMirroredFail().cubby,
      session: "paste-mirrored-fail",
      source: "anthropics/claude-code#85591",
      issue: READ_WRONG_SCOPE_ISSUE,
      scored: true,
    };
  }
  if (unsurfaced) {
    return {
      ...seedUnsurfaced().cubby,
      session: "paste-unsurfaced",
      source: "anthropics/claude-code#90604",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (restored) {
    return {
      ...seedRestored().cubby,
      session: "paste-restored",
      source: "anthropics/claude-code#90604",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (stowed) {
    return { ...seedStowed().cubby, session: "paste-stowed", source: "paste", scored: true };
  }
  return { ...emptyCubby(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  stowed: seedStowed,
  control: seedControl,
  invisible: seedInvisible,
  90604: seed90604,
  "90604-invisible": seedInvisible,
  ancestor: seedAncestor,
  "walked-up": seedWalkedUp,
  walkedup: seedWalkedUp,
  misfiled: seedMisfiled,
  stale: seedStale,
  ghosted: seedGhosted,
  "mirrored-fail": seedMirroredFail,
  mirroredfail: seedMirroredFail,
  unsurfaced: seedUnsurfaced,
  restored: seedRestored,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  mailroom: seedControl,
  wall: seedControl,
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
  let cubby = cloneCubby(action.cubby);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "stowed" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return cubbyResult("stowed", emptyCubby(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "mailroom" || verb === "wall") {
    cubby = seedControl().cubby;
    return cubbyResult(classify(cubby), cubby, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "invisible" || verb === "incident" || verb === "90604") {
    cubby = seedInvisible().cubby;
    return cubbyResult(classify(cubby), cubby, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "diff" || verb === "score-wall") {
    cubby = { ...cubby, scored: true };
    return cubbyResult(classify(cubby), cubby, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    cubby = { ...cubby, scored: true };
    return cubbyResult(classify(cubby), cubby, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  cubby = { ...cubby, scored: true };
  return cubbyResult(classify(cubby), cubby, action);
}
