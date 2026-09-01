#!/usr/bin/env node
/**
 * Garner — grain loft / bin / airing-hatch classifier.
 * An archive that stocks the loft instead of airing it is not a hold.
 * Score the loft or admit aired.
 *
 *   echo '{"archived":true,"poolRelease":true,"leasedBy":null,"stillOnDisk":true,"gitWorktreeListed":true,"ttlPresent":false,"docsSayRemove":true,"artifactBytes":"6.3G","cleanupPeriodDaysApplies":false}' | node garner.mjs
 *   node garner.mjs ticket.json
 *
 * Idle word is aired (HOLD: archive removes worktree; bin empty; disk reclaimed).
 * Seeded state is stocked / #91246 (archive → pool release; leasedBy null;
 * still on disk; git worktree listed; no TTL; artifacts kept).
 * NEVER idle as stocked, pooled, drained, hinged, pealed, warded,
 * first-wins, seized.
 *
 * Primary #91246: Desktop archive releases a session worktree to a reuse
 * pool with no expiry. Docs say the archive icon removes the worktree.
 * Cleanup path runs and succeeds but does not delete. Directory still on
 * disk; still listed by `git worktree list`. Cost is artifacts inside the
 * worktree (reporter's labeled sizes: .next 5.0G + node_modules 1.2G +
 * checkout ~120M = 6.3G total). Mechanism itself cheap (~120M shared
 * objects). Parallel sessions cannot share one worktree; pool only
 * recycles idle ones → multiplies with parallelism and never shrinks.
 * git-worktrees.json has createdAt + pooledAt but no TTL / expiry /
 * max-age. Only GC state is untrackedDirGc for `.claude/worktrees` roots.
 * cleanupPeriodDays appears only in transcript-retention paths.
 * pooledAt used for reuse ordering, not eviction.
 *
 * Hypothesis only (NON-BINDING): treat missing pool TTL/eviction +
 * archive-to-pool instead of remove as the defect; docs/archive UX
 * claiming removal while WorktreePool releases is unhealthy; applying
 * cleanupPeriodDays (or a size/count bound) to Desktop Code-tab session
 * worktrees is healthy. Do not claim a root cause in Claude Code source
 * you have not seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the loft is aired or stocked.
 *
 * NOT millrace / sluice-gate / pool-gauge.
 * NOT peal-board / belfry / carillon.
 * NOT postern-gate / night bailey.
 * NOT plane-table / alidade.
 * NOT rudder pintle / gudgeon / tiller.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Garner. Do not rename to Granary / Bin / Loft /
 * Silo / Hopper / Crib / Barn / Mill / Sluice / Pool / Gauge.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "aired",
  "stocked",
  "archived-to-pool",
  "no-ttl",
  "still-on-disk",
  "git-worktree-listed",
  "leasedBy-null",
  "artifacts-kept",
  "docs-say-remove",
  "cleanupPeriodDays-misses-desktop",
  "untrackedDirGc-only",
  "pooledAt-for-reuse-not-evict",
  "parallel-multiplies",
  "hold",
]);
export const IDLE_WORD = "aired";
export const SEEDED_WORD = "stocked";
export const HOLD_VERDICTS = Object.freeze(["aired", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91246;
export const PRIMARY_ISSUES = Object.freeze([91246]);
export const COUSINS = Object.freeze([
  88239, 83180, 76144, 75911, 88883, 87963, 84162,
]);
export const COUSIN_ISSUE = 88239;
export const NOT_PRODUCTS = Object.freeze([
  "sluice",
  "millrace",
  "pool-gauge",
  "pintle",
  "carillon",
  "postern",
  "alidade",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91246";
export const TITLE =
  "Desktop: pooled session worktrees are never reclaimed — archiving pools instead of removing, with no expiry";
export const FILED_AT = "2026-09-01T15:09:32Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:desktop",
]);
export const REPORTER = "secondl1ght";
export const DESKTOP_VERSION = "1.40609.0";
export const PLATFORM = "linux";
export const DISTRO = "Ubuntu";
export const ARTIFACT_TOTAL = "6.3G";
export const ARTIFACT_NEXT = "5.0G";
export const ARTIFACT_NODE_MODULES = "1.2G";
export const ARTIFACT_CHECKOUT = "~120M";
export const ARTIFACT_MECHANISM = "~120M";
export const CREATED_AT = 1788230281178;
export const POOLED_AT = 1788239112270;
export const CONFIG_PATH = "~/.config/Claude/git-worktrees.json";
export const DOCS_LINE =
  "To remove a worktree when you're done, hover over the session in the sidebar and click the archive icon.";
export const POOL_LOG =
  "[WorktreePool] Released worktree … to pool (was leased by local_…)";
export const CLEANUP_LOG = "Cleaning up worktree …";
export const HUB_LINE =
  "06:50 garner: an archive that stocks the loft instead of airing it is not a hold. Score the loft or admit aired.";
export const MARK = "06:50 / hermes catalog #107 / #91246";
export const PHRASE =
  "An archive that stocks the loft instead of airing it is not a hold. Score the loft or admit aired.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat missing pool TTL/eviction + archive-to-pool instead of remove as the defect; docs/archive UX claiming removal while WorktreePool releases is unhealthy; applying cleanupPeriodDays (or a size/count bound) to Desktop Code-tab session worktrees is healthy. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DESKTOP ARCHIVE RELEASES SESSION WORKTREE TO A POOL WITH NO EXPIRY — DOCS SAY REMOVE; DISK NEVER RECLAIMED. Archive via sidebar icon logs cleanup then WorktreePool release. Cleanup succeeds but does not delete. Directory still on disk; still listed by git worktree list. git-worktrees.json has createdAt + pooledAt but no TTL. untrackedDirGc only covers .claude/worktrees roots. cleanupPeriodDays is transcript-retention, not Desktop Code-tab session worktrees. pooledAt orders reuse, not eviction. Reporter's labeled sizes: .next 5.0G + node_modules 1.2G + checkout ~120M = 6.3G total. NOT Sluice millrace/pool-gauge/sluice-gate. NOT Pintle relative PreToolUse Bash cwd-drift. NOT Carillon SessionStart first-wins. NOT Postern socket-dir squat. NOT Alidade foreign host. NOT leftover woodworking / mm-slider. Product name stays Garner.";
export const FORBIDDEN_IDLE = Object.freeze([
  "stocked",
  "pooled",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "first-wins",
  "seized",
]);
export const BANNED_NAMES = Object.freeze([
  "Granary",
  "Bin",
  "Loft",
  "Silo",
  "Hopper",
  "Crib",
  "Barn",
  "Mill",
  "Sluice",
  "Pool",
  "Gauge",
]);
export const FORBIDDEN_UI = Object.freeze([
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "carillon",
  "postern-gate",
  "night bailey",
  "plane-table",
  "alidade",
  "rudder pintle",
  "gudgeon",
  "woodworking",
  "mm-slider",
]);

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function firstLease(...values) {
  for (const value of values) {
    if (value === null) return null;
    if (value === "") return null;
    if (value !== undefined) return String(value);
  }
  return undefined;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    archived: null,
    poolRelease: null,
    leasedBy: undefined,
    stillOnDisk: null,
    gitWorktreeListed: null,
    ttlPresent: null,
    docsSayRemove: null,
    artifactBytes: "",
    artifactNext: "",
    artifactNodeModules: "",
    artifactCheckout: "",
    cleanupPeriodDaysApplies: null,
    untrackedDirGcOnly: null,
    pooledAtForReuseNotEvict: null,
    parallelMultiplies: null,
    createdAt: null,
    pooledAt: null,
    cousin: "",
    desktopVersion: "",
    platform: "",
    outputText: "",
  };
}

export function seedAired() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "desktop",
    archived: true,
    poolRelease: false,
    leasedBy: null,
    stillOnDisk: false,
    gitWorktreeListed: false,
    ttlPresent: true,
    docsSayRemove: true,
    artifactBytes: "",
    artifactNext: "",
    artifactNodeModules: "",
    artifactCheckout: "",
    cleanupPeriodDaysApplies: true,
    untrackedDirGcOnly: false,
    pooledAtForReuseNotEvict: false,
    parallelMultiplies: false,
    createdAt: null,
    pooledAt: null,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "aired; archive removes the worktree; bin empty; disk reclaimed; idle word aired",
  };
}

export function seedStocked() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    docsSayRemove: true,
    artifactBytes: ARTIFACT_TOTAL,
    artifactNext: ARTIFACT_NEXT,
    artifactNodeModules: ARTIFACT_NODE_MODULES,
    artifactCheckout: ARTIFACT_CHECKOUT,
    cleanupPeriodDaysApplies: false,
    untrackedDirGcOnly: true,
    pooledAtForReuseNotEvict: true,
    parallelMultiplies: true,
    createdAt: CREATED_AT,
    pooledAt: POOLED_AT,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "stocked; #91246; archive → pool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept (.next 5.0G + node_modules 1.2G + checkout ~120M = 6.3G); Desktop 1.40609.0; Ubuntu",
  };
}

export function seedArchivedToPool() {
  return {
    seed: "archived-to-pool",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    docsSayRemove: true,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "archived-to-pool; cleanup path runs and succeeds then WorktreePool released worktree to pool (was leased by local_…)",
  };
}

export function seedNoTtl() {
  return {
    seed: "no-ttl",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    createdAt: CREATED_AT,
    pooledAt: POOLED_AT,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "no-ttl; git-worktrees.json entries have createdAt + pooledAt but no TTL / expiry / max-age",
  };
}

export function seedStillOnDisk() {
  return {
    seed: "still-on-disk",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "still-on-disk; cleanup succeeds but does not delete; directory still present on disk",
  };
}

export function seedGitWorktreeListed() {
  return {
    seed: "git-worktree-listed",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "git-worktree-listed; directory still listed by git worktree list after archive",
  };
}

export function seedLeasedByNull() {
  return {
    seed: "leasedBy-null",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "leasedBy-null; pooled with leasedBy: null; idle stock, not removed",
  };
}

export function seedArtifactsKept() {
  return {
    seed: "artifacts-kept",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    artifactBytes: ARTIFACT_TOTAL,
    artifactNext: ARTIFACT_NEXT,
    artifactNodeModules: ARTIFACT_NODE_MODULES,
    artifactCheckout: ARTIFACT_CHECKOUT,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "artifacts-kept; reporter labeled .next 5.0G + node_modules 1.2G + checkout ~120M = 6.3G total; mechanism itself ~120M shared objects",
  };
}

export function seedDocsSayRemove() {
  return {
    seed: "docs-say-remove",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    docsSayRemove: true,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "docs-say-remove; desktop docs: hover session → archive icon removes the worktree; observed: pooled",
  };
}

export function seedCleanupPeriodMisses() {
  return {
    seed: "cleanupPeriodDays-misses-desktop",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    cleanupPeriodDaysApplies: false,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "cleanupPeriodDays-misses-desktop; cleanupPeriodDays appears only in transcript-retention; Desktop Code-tab session worktrees fall outside interactive exit, subagent cleanup, and the periodic sweep",
  };
}

export function seedUntrackedDirGcOnly() {
  return {
    seed: "untrackedDirGc-only",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    untrackedDirGcOnly: true,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "untrackedDirGc-only; only GC state is untrackedDirGc for .claude/worktrees roots; registered worktrees have no comparable expiry",
  };
}

export function seedPooledAtReuse() {
  return {
    seed: "pooledAt-for-reuse-not-evict",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    pooledAtForReuseNotEvict: true,
    pooledAt: POOLED_AT,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "pooledAt-for-reuse-not-evict; pooledAt appears used for reuse ordering, not eviction; no reapWorktree / pruneWorktree / staleWorktree / maxAgeMs / maxWorktrees / evict found for pool eviction",
  };
}

export function seedParallelMultiplies() {
  return {
    seed: "parallel-multiplies",
    source: "desktop",
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    parallelMultiplies: true,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "parallel-multiplies; parallel sessions cannot share one worktree; pool only recycles idle ones → multiplies with parallelism and never shrinks",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "desktop",
    archived: true,
    poolRelease: false,
    leasedBy: null,
    stillOnDisk: false,
    gitWorktreeListed: false,
    ttlPresent: true,
    docsSayRemove: true,
    cleanupPeriodDaysApplies: true,
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "hold; archive empties the bin; the loft is aired; disk reclaimed",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "desktop",
    cousin: "88239",
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #88239 OPEN — teardown refuses on a clean worktree and surfaces an error; not missing pool expiry",
  };
}

export function emptyTicket() {
  return seedAired();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.garner && typeof src.garner === "object" && src.garner) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.loft && typeof src.loft === "object" && src.loft) ||
    src;
  const leased = firstLease(nested.leasedBy, nested.leased_by, src.leasedBy);
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    source: firstText(nested.source, src.source),
    archived: firstBool(nested.archived, src.archived),
    poolRelease: firstBool(
      nested.poolRelease,
      nested.pool_release,
      src.poolRelease,
    ),
    leasedBy: leased,
    stillOnDisk: firstBool(
      nested.stillOnDisk,
      nested.still_on_disk,
      src.stillOnDisk,
    ),
    gitWorktreeListed: firstBool(
      nested.gitWorktreeListed,
      nested.git_worktree_listed,
      src.gitWorktreeListed,
    ),
    ttlPresent: firstBool(nested.ttlPresent, nested.ttl_present, src.ttlPresent),
    docsSayRemove: firstBool(
      nested.docsSayRemove,
      nested.docs_say_remove,
      src.docsSayRemove,
    ),
    artifactBytes: firstText(
      nested.artifactBytes,
      nested.artifact_bytes,
      src.artifactBytes,
    ),
    artifactNext: firstText(
      nested.artifactNext,
      nested.artifact_next,
      src.artifactNext,
    ),
    artifactNodeModules: firstText(
      nested.artifactNodeModules,
      nested.artifact_node_modules,
      src.artifactNodeModules,
    ),
    artifactCheckout: firstText(
      nested.artifactCheckout,
      nested.artifact_checkout,
      src.artifactCheckout,
    ),
    cleanupPeriodDaysApplies: firstBool(
      nested.cleanupPeriodDaysApplies,
      nested.cleanup_period_days_applies,
      src.cleanupPeriodDaysApplies,
    ),
    untrackedDirGcOnly: firstBool(
      nested.untrackedDirGcOnly,
      nested.untracked_dir_gc_only,
      src.untrackedDirGcOnly,
    ),
    pooledAtForReuseNotEvict: firstBool(
      nested.pooledAtForReuseNotEvict,
      nested.pooled_at_for_reuse_not_evict,
      src.pooledAtForReuseNotEvict,
    ),
    parallelMultiplies: firstBool(
      nested.parallelMultiplies,
      nested.parallel_multiplies,
      src.parallelMultiplies,
    ),
    createdAt: firstNum(nested.createdAt, nested.created_at, src.createdAt),
    pooledAt: firstNum(nested.pooledAt, nested.pooled_at, src.pooledAt),
    cousin: firstText(nested.cousin, src.cousin),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      nested.version,
      src.desktopVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (key === "leasedBy") {
      if (Object.prototype.hasOwnProperty.call(obj, "leasedBy") && value !== undefined) {
        out[key] = value;
      }
      continue;
    }
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.archived == null &&
    row.poolRelease == null &&
    row.stillOnDisk == null &&
    row.gitWorktreeListed == null &&
    row.ttlPresent == null &&
    row.docsSayRemove == null &&
    row.cleanupPeriodDaysApplies == null &&
    !row.artifactBytes
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedAired,
  [SEEDED_WORD]: seedStocked,
  "archived-to-pool": seedArchivedToPool,
  "no-ttl": seedNoTtl,
  "still-on-disk": seedStillOnDisk,
  "git-worktree-listed": seedGitWorktreeListed,
  "leasedBy-null": seedLeasedByNull,
  "artifacts-kept": seedArtifactsKept,
  "docs-say-remove": seedDocsSayRemove,
  "cleanupPeriodDays-misses-desktop": seedCleanupPeriodMisses,
  "untrackedDirGc-only": seedUntrackedDirGcOnly,
  "pooledAt-for-reuse-not-evict": seedPooledAtReuse,
  "parallel-multiplies": seedParallelMultiplies,
  hold: seedHold,
  cousin: seedCousin,
  88239: seedCousin,
};

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedStocked(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.cousin, ticket.seed]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function labeledArtifact(ticket) {
  const blob = [
    ticket.artifactBytes,
    ticket.artifactNext,
    ticket.artifactNodeModules,
    ticket.artifactCheckout,
    ticket.outputText,
  ]
    .filter(Boolean)
    .join(" ");
  return /6\.3G|5\.0G|1\.2G|~120M|120M/.test(blob);
}

export function isAired(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.archived === true && row.poolRelease === false && row.stillOnDisk === false) {
    return true;
  }
  return false;
}

export function isStocked(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.archived === true &&
    row.poolRelease === true &&
    row.stillOnDisk === true &&
    row.ttlPresent === false
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#88239|#83180|#76144|#75911|#88883|#87963|#84162/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const stockedNow = !cousinOnly && isStocked(row);
  const airedNow = !stockedNow && isAired(row);
  const poolRelease =
    row.poolRelease === true ||
    named === "archived-to-pool" ||
    /archived-to-pool|Released worktree|to pool/i.test(text);
  const noTtl =
    row.ttlPresent === false ||
    named === "no-ttl" ||
    /no-ttl|no TTL|no expiry|no max-age/i.test(text);
  const stillOnDisk =
    row.stillOnDisk === true ||
    named === "still-on-disk" ||
    /still-on-disk|still present on disk|still on disk/i.test(text);
  const listed =
    row.gitWorktreeListed === true ||
    named === "git-worktree-listed" ||
    /git-worktree-listed|git worktree list/i.test(text);
  const leasedNull =
    row.leasedBy === null ||
    named === "leasedBy-null" ||
    /leasedBy-null|leasedBy: null|leasedBy null/i.test(text);
  const artifacts =
    labeledArtifact(row) ||
    named === "artifacts-kept" ||
    /artifacts-kept|6\.3G/i.test(text);
  const docsRemove =
    row.docsSayRemove === true ||
    named === "docs-say-remove" ||
    /docs-say-remove|archive icon removes/i.test(text);
  const cleanupMiss =
    row.cleanupPeriodDaysApplies === false ||
    named === "cleanupPeriodDays-misses-desktop" ||
    /cleanupPeriodDays-misses-desktop|transcript-retention|Code-tab/i.test(text);
  const untrackedOnly =
    row.untrackedDirGcOnly === true ||
    named === "untrackedDirGc-only" ||
    /untrackedDirGc-only|untrackedDirGc/i.test(text);
  const reuseNotEvict =
    row.pooledAtForReuseNotEvict === true ||
    named === "pooledAt-for-reuse-not-evict" ||
    /pooledAt-for-reuse-not-evict|reuse ordering|not for eviction/i.test(text);
  const parallel =
    row.parallelMultiplies === true ||
    named === "parallel-multiplies" ||
    /parallel-multiplies|multiplies with parallelism/i.test(text);
  const stocked =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (stockedNow || named === SEEDED_WORD || /stocked|#91246/i.test(text));
  const aired =
    named === IDLE_WORD ||
    named === "hold" ||
    (airedNow && !stocked);
  return {
    named,
    cousinOnly,
    stockedNow,
    airedNow,
    poolRelease,
    noTtl,
    stillOnDisk,
    listed,
    leasedNull,
    artifacts,
    docsRemove,
    cleanupMiss,
    untrackedOnly,
    reuseNotEvict,
    parallel,
    stocked,
    aired,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.aired && !flags.stocked) chips.push("aired");
  if (flags.stocked) chips.push("stocked");
  if (flags.poolRelease && flags.stocked) chips.push("archived-to-pool");
  if (flags.noTtl && flags.stocked) chips.push("no-ttl");
  if (flags.stillOnDisk && flags.stocked) chips.push("still-on-disk");
  if (flags.listed && flags.stocked) chips.push("git-worktree-listed");
  if (flags.leasedNull && flags.stocked) chips.push("leasedBy-null");
  if (flags.artifacts && flags.stocked) chips.push("artifacts-kept");
  if (flags.docsRemove && flags.stocked) chips.push("docs-say-remove");
  if (flags.cleanupMiss && flags.stocked) {
    chips.push("cleanupPeriodDays-misses-desktop");
  }
  if (flags.untrackedOnly && flags.stocked) chips.push("untrackedDirGc-only");
  if (flags.reuseNotEvict && flags.stocked) {
    chips.push("pooledAt-for-reuse-not-evict");
  }
  if (flags.parallel && flags.stocked) chips.push("parallel-multiplies");
  if ((flags.aired || flags.named === "hold") && !flags.stocked) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "aired") {
    reasons.push("aired; archive removes the worktree; bin empty; disk reclaimed");
    reasons.push("hold: the loft is aired; score treats remove-on-archive");
  }
  if (verdict === "hold") {
    reasons.push("hold; archive empties the bin; the loft is aired; disk reclaimed");
  }
  if (verdict === "stocked" || flags.stocked) {
    reasons.push(
      "stocked; #91246; archive → WorktreePool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept",
    );
  }
  if (flags.poolRelease || verdict === "archived-to-pool") {
    reasons.push(
      `archived-to-pool; ${CLEANUP_LOG} then ${POOL_LOG}`,
    );
  }
  if (flags.noTtl || verdict === "no-ttl") {
    reasons.push(
      `no-ttl; ${CONFIG_PATH} has createdAt + pooledAt but no TTL / expiry / max-age`,
    );
  }
  if (flags.stillOnDisk || verdict === "still-on-disk") {
    reasons.push(
      "still-on-disk; cleanup path runs and succeeds but does not delete; directory still present",
    );
  }
  if (flags.listed || verdict === "git-worktree-listed") {
    reasons.push(
      "git-worktree-listed; still listed by git worktree list after archive",
    );
  }
  if (flags.leasedNull || verdict === "leasedBy-null") {
    reasons.push("leasedBy-null; pooled with leasedBy: null");
  }
  if (flags.artifacts || verdict === "artifacts-kept") {
    reasons.push(
      `artifacts-kept; reporter labeled .next ${ARTIFACT_NEXT} + node_modules ${ARTIFACT_NODE_MODULES} + checkout ${ARTIFACT_CHECKOUT} = ${ARTIFACT_TOTAL} total; mechanism itself ${ARTIFACT_MECHANISM} shared objects`,
    );
  }
  if (flags.docsRemove || verdict === "docs-say-remove") {
    reasons.push(`docs-say-remove; ${DOCS_LINE}`);
  }
  if (flags.cleanupMiss || verdict === "cleanupPeriodDays-misses-desktop") {
    reasons.push(
      "cleanupPeriodDays-misses-desktop; cleanupPeriodDays is transcript-retention; Desktop Code-tab session worktrees fall outside interactive exit, subagent cleanup, and the periodic sweep (skip list leaves --worktree sessions you have not backgrounded)",
    );
  }
  if (flags.untrackedOnly || verdict === "untrackedDirGc-only") {
    reasons.push(
      "untrackedDirGc-only; only GC state is untrackedDirGc for .claude/worktrees roots; registered worktrees have no comparable expiry",
    );
  }
  if (flags.reuseNotEvict || verdict === "pooledAt-for-reuse-not-evict") {
    reasons.push(
      "pooledAt-for-reuse-not-evict; pooledAt appears used for reuse ordering, not eviction",
    );
  }
  if (flags.parallel || verdict === "parallel-multiplies") {
    reasons.push(
      "parallel-multiplies; concurrent sessions cannot share one worktree; pool only recycles idle ones and never shrinks",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Garner; cite-only worktree surface, not missing pool expiry on Desktop archive",
    );
  }
  if (verdict === "stocked" || flags.stocked) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "aired" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.aired || !flags.stocked)) return "aired";
  if (named === "hold" && !flags.stocked) return "hold";
  if (named === SEEDED_WORD) return "stocked";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "aired";
  if (flags.stocked) return "stocked";
  if (flags.aired) return "aired";
  return "aired";
}

function loftOf(flags, ticket, verdict) {
  if (verdict === "stocked" || flags.stocked) {
    return {
      bin: "stocked — archive released the filled bin into the silent pool",
      latch: "archive latch closed; WorktreePool release, not remove",
      hatch: "airing hatch shut; no TTL to air the loft",
      chalk: `leasedBy: null · still on disk · git worktree listed · ${ARTIFACT_TOTAL}`,
      sheaf: "wheat marks the filled sacks; grain sits forever",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      bin: "empty — archive emptied the bin",
      latch: "archive latch honored remove",
      hatch: "airing hatch open",
      chalk: "hold · loft aired · disk reclaimed",
      sheaf: "no sacks on the boards",
      note: "Hold: the loft is aired.",
    };
  }
  return {
    bin: "empty — archive removed the worktree",
    latch: "archive latch aired the loft",
    hatch: "airing hatch open; disk reclaimed",
    chalk: "aired · idle word aired",
    sheaf: "no sacks on the boards",
    note: "Aired: the loft is empty.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const stocked = verdict === "stocked" || flags.stocked;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    aired: verdict === "aired" || (flags.aired && !stocked),
    stocked,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: loftOf(flags, ticket, verdict),
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 91246 || name === "91246") {
    return analyze(seedStocked());
  }
  if (name === "archived-to-pool") return analyze(seedArchivedToPool());
  if (name === "no-ttl") return analyze(seedNoTtl());
  if (name === "still-on-disk") return analyze(seedStillOnDisk());
  if (name === "git-worktree-listed") return analyze(seedGitWorktreeListed());
  if (name === "leasedBy-null") return analyze(seedLeasedByNull());
  if (name === "artifacts-kept") return analyze(seedArtifactsKept());
  if (name === "docs-say-remove") return analyze(seedDocsSayRemove());
  if (name === "cleanupPeriodDays-misses-desktop") {
    return analyze(seedCleanupPeriodMisses());
  }
  if (name === "untrackedDirGc-only") return analyze(seedUntrackedDirGcOnly());
  if (name === "pooledAt-for-reuse-not-evict") return analyze(seedPooledAtReuse());
  if (name === "parallel-multiplies") return analyze(seedParallelMultiplies());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "aired" || name === "emptied") {
    return analyze(seedAired());
  }
  if (name === 88239 || name === "88239" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedAired());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "stocked" || (result.stocked && result.alarm)
          ? `stocked garner #${FEATURED_ISSUE}: Desktop archive released the session worktree to a pool with no expiry; leasedBy null; still on disk; git worktree listed; artifacts kept. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Archive empties the bin. Score the loft."
            : `aired garner. Idle word ${IDLE_WORD}. Archive removes the worktree; bin empty; disk reclaimed.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
