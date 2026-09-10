#!/usr/bin/env node
/**
 * Fomite — sterile-lab / epidemiology booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * `claude plugin install` / `claude plugin update` from a directory
 * marketplace copies the marketplace root into
 * `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`
 * WITHOUT honoring `.gitignore`. Measured: cache copy 128M vs
 * git-tracked 4.5M (`node_modules` 51M). A root `.env` (gitignored
 * secrets by convention) is copied with no warning and persists
 * until the install is replaced. The copy already excludes `.git`
 * but does not read `.gitignore` / global excludes / core.excludesFile.
 *
 *   node fomite.mjs data/fomite.json
 *   echo '{"seed":"contaminated"}' | node fomite.mjs
 *
 * Idle word is scrubbed (HOLD: gitignore honored; no .env /
 * node_modules in versioned cache; install matches tracked tree).
 * Seeded word is contaminated (#93423: directory marketplace
 * install copies gitignored files including root .env).
 * Path word is gitignore.
 * Product score word is fomite (score fomite or admit scrubbed).
 *
 * Encoded from anthropics/claude-code#93423 issue body only.
 * Hypothesis (NON-BINDING): directory-marketplace install walks
 * the marketplace root with a naive copy that excludes `.git`
 * but never consults `.gitignore`, global excludes, or
 * `core.excludesFile`, so gitignored secrets and scratch hitchhike
 * into the versioned cache. Verify against #93423 text only.
 * Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "hold",
  "env-hitch",
  "node-modules",
  "cache-bloat",
  "no-warning",
  "excludes-git",
  "skip-gitignore",
  "directory-source",
  "persists",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "scrubbed";
export const PATH_WORD = "gitignore";
export const SEEDED_WORD = "contaminated";
export const PRODUCT_WORD = "fomite";
export const HOLD = Object.freeze(["scrubbed", "hold"]);
export const RECOVER = Object.freeze(["scrubbed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "slipped",
  "sprung",
  "springe",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "voided",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "contaminated" && name !== "fomite",
  ),
);

export const FEATURED_ISSUE = 93423;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93423";
export const TITLE =
  "[BUG] plugin install copies gitignored files, including a root .env, from a directory marketplace";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:security",
  "area:plugins",
]);
export const AUTHOR = "bostonaholic";
export const FILED = "2026-09-10T17:37:24Z";
export const CLAUDE_CODE_VERSION = "2.1.266";
export const OS = "macOS";
export const OS_VERSION = "26.6.2";
export const ARCH = "arm64";
export const SHELL = "zsh";
export const MARKETPLACE = "team-dev";
export const PLUGIN = "team";
export const PLUGIN_VERSION = "0.97.0-claude.20260910173552";
export const CACHE_PATH =
  "~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/";
export const MEASURED_CACHE = "128M";
export const MEASURED_TRACKED = "4.5M";
export const MEASURED_NODE_MODULES = "51M";
export const SKILLS = 90;
export const AGENTS = 13;
export const CHECKOUT = "github.com/bostonaholic/team";
export const ENV_PROBE = "TEAM_DEV_COPY_PROBE=not-a-real-secret";
export const ENV_CACHE_PATH =
  "~/.claude/plugins/cache/team-dev/team/0.97.0-claude.20260910173552/.env";
export const SCRATCH = Object.freeze([
  ".playwright-mcp/",
  ".claude/worktrees/",
  ".agents/friction-log/",
]);
export const PHRASE =
  "when a directory marketplace install copies gitignored files including a root .env into the versioned plugin cache with no warning, score fomite or admit scrubbed.";

export const BENCH_STATIONS = Object.freeze([
  {
    id: "glass-slide",
    survey: "read the glass slide",
    kind: "install",
    note: "directory marketplace copy into versioned cache",
  },
  {
    id: "culture-dish",
    survey: "stain the culture dish",
    kind: "gitignore",
    note: "copy excludes .git but does not read .gitignore",
  },
  {
    id: "agar",
    survey: "assay the agar",
    kind: "bloat",
    note: "cache copy 128M vs git-tracked 4.5M; node_modules 51M",
  },
  {
    id: "hitch",
    survey: "audit the hitch",
    kind: "secret",
    note: "root .env probe TEAM_DEV_COPY_PROBE copied with no warning",
  },
]);

export const COPY_TABLE = Object.freeze([
  {
    name: ".git",
    tracked: false,
    gitignored: false,
    copied: false,
    note: "already excluded",
  },
  {
    name: ".env",
    tracked: false,
    gitignored: true,
    copied: true,
    note: "root secrets by convention; no warning",
  },
  {
    name: "node_modules/",
    tracked: false,
    gitignored: true,
    copied: true,
    note: "51M of the 128M vs 4.5M gap",
  },
  {
    name: ".playwright-mcp/",
    tracked: false,
    gitignored: true,
    copied: true,
    note: "local scratch hitch",
  },
  {
    name: ".claude/worktrees/",
    tracked: false,
    gitignored: true,
    copied: true,
    note: "local scratch hitch",
  },
  {
    name: ".agents/friction-log/",
    tracked: false,
    gitignored: true,
    copied: true,
    note: "local scratch hitch",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "env-hitch",
  "node-modules",
  "cache-bloat",
  "no-warning",
  "excludes-git",
  "skip-gitignore",
  "directory-source",
  "persists",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93426,
    title: "host writes .in_use/.orphaned_at into pinned plugin tree",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild as this product",
  },
  {
    issue: 92354,
    title:
      "Plugin cache: a new version dir inherits the previous one's untracked files",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Graft copy-forward; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93429,
    title: "Desktop drops image source path",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93403,
    title: "nested skills never load in auto mode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93405,
    title: "autoMode trusted-repo path pinned user-global",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93402,
    title: "Cmd+Enter interrupts instead of queues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93426,
    title: "host writes .in_use/.orphaned_at into pinned plugin tree",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "fosse",
  "hibernacle",
  "scapegoat",
  "graft",
  "snubber",
  "springe",
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "flashpan",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Read whether .gitignore / global excludes / core.excludesFile
 * were honored on the directory-marketplace copy.
 */
export function inspectGitignore(input = {}) {
  const honored =
    input.gitignoreHonored === true ||
    input.honored === true ||
    (input.skipGitignore !== true &&
      input.gitignoreUnread !== true &&
      input.envHitch !== true &&
      input.nodeModulesCopied !== true &&
      input.scrubbed === true);
  const unread =
    input.skipGitignore === true ||
    input.gitignoreUnread === true ||
    input.gitignoreHonored === false;
  return {
    honored: honored && !unread,
    unread: unread && input.scrubbed !== true,
    excludesGit:
      input.excludesGit === true || input.copyExcludesGit === true,
    stamp: unread && input.scrubbed !== true ? "contaminated" : "scrubbed",
  };
}

/**
 * Assay whether a root .env hitchhiked into the versioned cache.
 */
export function inspectEnvHitch(input = {}) {
  const hitch =
    input.envHitch === true ||
    input.envCopied === true ||
    input.rootEnv === true ||
    Boolean(input.envProbe) ||
    Boolean(input.envCachePath);
  return {
    hitch: hitch && input.scrubbed !== true,
    probe: hitch ? ENV_PROBE : "",
    path: hitch ? ENV_CACHE_PATH : "",
    stamp: hitch && input.scrubbed !== true ? "contaminated" : "scrubbed",
  };
}

/**
 * Assay node_modules / cache-bloat hitch from #93423 measures.
 */
export function inspectCacheCopy(input = {}) {
  const nodeModules =
    input.nodeModulesCopied === true ||
    input.nodeModules === true ||
    input.nodeModulesSize === MEASURED_NODE_MODULES;
  const bloat =
    input.cacheBloat === true ||
    input.cacheSize === MEASURED_CACHE ||
    nodeModules;
  return {
    nodeModules: nodeModules && input.scrubbed !== true,
    bloat: bloat && input.scrubbed !== true,
    cacheSize: bloat ? MEASURED_CACHE : MEASURED_TRACKED,
    trackedSize: MEASURED_TRACKED,
    nodeModulesSize: nodeModules ? MEASURED_NODE_MODULES : "0",
    stamp: (nodeModules || bloat) && input.scrubbed !== true
      ? "contaminated"
      : "scrubbed",
  };
}

export function readBench(input = {}) {
  const ignore = inspectGitignore(input);
  const env = inspectEnvHitch(input);
  const cache = inspectCacheCopy(input);
  const contaminated =
    ignore.stamp === "contaminated" ||
    env.stamp === "contaminated" ||
    cache.stamp === "contaminated" ||
    input.contaminated === true;
  const scrubbed =
    input.scrubbed === true &&
    contaminated !== true &&
    ignore.stamp === "scrubbed";
  return {
    ignore,
    env,
    cache,
    stations: BENCH_STATIONS,
    contaminated: contaminated && !scrubbed,
    scrubbed:
      scrubbed ||
      (ignore.stamp === "scrubbed" &&
        env.stamp === "scrubbed" &&
        cache.stamp === "scrubbed" &&
        input.contaminated !== true),
    mark: contaminated && !scrubbed ? "contaminated" : "scrubbed",
  };
}

/**
 * Published fomite walk from #93423 only. Facts from the issue body.
 * A scrubbed bench honors .gitignore so the versioned cache matches
 * the tracked tree (4.5M) with no .env / node_modules. A contaminated
 * bench copies gitignored files from a directory marketplace,
 * including a root .env, with no warning.
 */
export const FOMITE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-scrubbed",
    scrubbed: true,
    gitignoreHonored: true,
    envHitch: false,
    nodeModulesCopied: false,
    contaminated: false,
    cue: "scrubbed",
    note: "idle HOLD: gitignore honored; no .env / node_modules in versioned cache; install matches tracked tree",
  },
  {
    t: "add",
    event: "marketplace-add",
    directorySource: true,
    scrubbed: true,
    gitignoreHonored: true,
    cue: "scrubbed",
    note: "claude plugin marketplace add <path> --scope user — directory source",
  },
  {
    t: "install",
    event: "plugin-install",
    directorySource: true,
    contaminated: true,
    cue: "contaminated",
    note: "claude plugin install <plugin>@<marketplace> --scope user copies the marketplace root",
  },
  {
    t: "git",
    event: "copy-excludes-git",
    excludesGit: true,
    copyExcludesGit: true,
    contaminated: true,
    cue: "contaminated",
    note: "copy already excludes .git — some filtering happens",
  },
  {
    t: "ignore",
    event: "skip-gitignore",
    skipGitignore: true,
    gitignoreUnread: true,
    gitignoreHonored: false,
    contaminated: true,
    cue: "contaminated",
    note: "does not read .gitignore / global excludes / core.excludesFile",
  },
  {
    t: "env",
    event: "env-hitch",
    envHitch: true,
    envCopied: true,
    rootEnv: true,
    envProbe: ENV_PROBE,
    contaminated: true,
    cue: "contaminated",
    note: "root .env probe TEAM_DEV_COPY_PROBE copied into versioned cache with no warning",
  },
  {
    t: "nm",
    event: "node-modules-51M",
    nodeModulesCopied: true,
    nodeModules: true,
    nodeModulesSize: MEASURED_NODE_MODULES,
    contaminated: true,
    cue: "contaminated",
    note: "node_modules/ accounts for 51M of the cache vs tracked gap",
  },
  {
    t: "size",
    event: "cache-128M",
    cacheBloat: true,
    cacheSize: MEASURED_CACHE,
    trackedSize: MEASURED_TRACKED,
    contaminated: true,
    cue: "contaminated",
    note: "cache copy 128M vs content tracked by git 4.5M",
  },
  {
    t: "scratch",
    event: "scratch-hitch",
    contaminated: true,
    scratch: true,
    cue: "contaminated",
    note: "rest is local scratch: .playwright-mcp/ .claude/worktrees/ .agents/friction-log/",
  },
  {
    t: "ui",
    event: "no-warning",
    noWarning: true,
    contaminated: true,
    cue: "contaminated",
    note: "the install prints no warning",
  },
  {
    t: "persist",
    event: "persists-until-replaced",
    persists: true,
    contaminated: true,
    cue: "contaminated",
    note: "the copied file stays until the install is replaced",
  },
  {
    t: "stain",
    event: "contaminated",
    scrubbed: false,
    contaminated: true,
    skipGitignore: true,
    envHitch: true,
    nodeModulesCopied: true,
    cacheBloat: true,
    noWarning: true,
    excludesGit: true,
    directorySource: true,
    persists: true,
    cue: "contaminated",
    note: "#93423: directory marketplace install copies gitignored files including root .env",
  },
  {
    t: "path",
    event: "gitignore",
    contaminated: true,
    gitignore: true,
    skipGitignore: true,
    cue: "contaminated",
    note: "gitignore — directory copy never consults ignore rules",
  },
  {
    t: "score",
    event: "fomite",
    contaminated: true,
    gitignore: true,
    cue: "contaminated",
    note: "fomite — score the object that carried infection on the install copy",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    scrubbed: true,
    gitignoreHonored: true,
    envHitch: false,
    nodeModulesCopied: false,
    contaminated: false,
    cue: "scrubbed",
  };
}

export function seedScrubbed() {
  return { ...emptyTicket() };
}

export function seedContaminated() {
  return {
    seed: SEEDED_WORD,
    scrubbed: false,
    contaminated: true,
    skipGitignore: true,
    gitignoreUnread: true,
    gitignoreHonored: false,
    excludesGit: true,
    copyExcludesGit: true,
    envHitch: true,
    envCopied: true,
    rootEnv: true,
    envProbe: ENV_PROBE,
    envCachePath: ENV_CACHE_PATH,
    nodeModulesCopied: true,
    nodeModules: true,
    nodeModulesSize: MEASURED_NODE_MODULES,
    cacheBloat: true,
    cacheSize: MEASURED_CACHE,
    trackedSize: MEASURED_TRACKED,
    noWarning: true,
    directorySource: true,
    persists: true,
    scratch: true,
    cue: "contaminated",
    issue: FEATURED_ISSUE,
  };
}

export function seedFomite() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    contaminated: true,
    gitignore: true,
    cue: "contaminated",
  };
}

export function seedGitignore() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    contaminated: true,
    gitignore: true,
    skipGitignore: true,
    cue: "contaminated",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    scrubbed: true,
    cue: "scrubbed",
  };
}

export function seedEnvHitch() {
  return {
    seed: "env-hitch",
    preferSeed: true,
    envHitch: true,
    cue: "contaminated",
  };
}

export function seedNodeModules() {
  return {
    seed: "node-modules",
    preferSeed: true,
    nodeModulesCopied: true,
    cue: "contaminated",
  };
}

export function seedCacheBloat() {
  return {
    seed: "cache-bloat",
    preferSeed: true,
    cacheBloat: true,
    cue: "contaminated",
  };
}

export function seedNoWarning() {
  return {
    seed: "no-warning",
    preferSeed: true,
    noWarning: true,
    cue: "contaminated",
  };
}

export function seedExcludesGit() {
  return {
    seed: "excludes-git",
    preferSeed: true,
    excludesGit: true,
    cue: "contaminated",
  };
}

export function seedSkipGitignore() {
  return {
    seed: "skip-gitignore",
    preferSeed: true,
    skipGitignore: true,
    cue: "contaminated",
  };
}

export function seedDirectorySource() {
  return {
    seed: "directory-source",
    preferSeed: true,
    directorySource: true,
    cue: "contaminated",
  };
}

export function seedPersists() {
  return {
    seed: "persists",
    preferSeed: true,
    persists: true,
    cue: "contaminated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      scrubbed: false,
      contaminated: false,
      gitignore: false,
      gitignoreHonored: false,
      skipGitignore: false,
      gitignoreUnread: false,
      excludesGit: false,
      copyExcludesGit: false,
      envHitch: false,
      envCopied: false,
      rootEnv: false,
      nodeModulesCopied: false,
      nodeModules: false,
      cacheBloat: false,
      noWarning: false,
      directorySource: false,
      persists: false,
      scratch: false,
      envProbe: null,
      envCachePath: null,
      cacheSize: null,
      trackedSize: null,
      nodeModulesSize: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    scrubbed: raw.scrubbed === true,
    contaminated: raw.contaminated === true,
    gitignore: raw.gitignore === true,
    gitignoreHonored: raw.gitignoreHonored === true,
    skipGitignore: raw.skipGitignore === true,
    gitignoreUnread: raw.gitignoreUnread === true,
    excludesGit: raw.excludesGit === true || raw.copyExcludesGit === true,
    copyExcludesGit: raw.copyExcludesGit === true,
    envHitch: raw.envHitch === true || raw.envCopied === true,
    envCopied: raw.envCopied === true,
    rootEnv: raw.rootEnv === true,
    nodeModulesCopied:
      raw.nodeModulesCopied === true || raw.nodeModules === true,
    nodeModules: raw.nodeModules === true,
    cacheBloat: raw.cacheBloat === true,
    noWarning: raw.noWarning === true,
    directorySource: raw.directorySource === true,
    persists: raw.persists === true,
    scratch: raw.scratch === true,
    envProbe: raw.envProbe == null ? null : raw.envProbe,
    envCachePath: raw.envCachePath == null ? null : raw.envCachePath,
    cacheSize: raw.cacheSize == null ? null : raw.cacheSize,
    trackedSize: raw.trackedSize == null ? null : raw.trackedSize,
    nodeModulesSize:
      raw.nodeModulesSize == null ? null : raw.nodeModulesSize,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.scrubbed != null ||
        ticket.contaminated != null ||
        ticket.gitignore != null ||
        ticket.gitignoreHonored != null ||
        ticket.skipGitignore != null ||
        ticket.envHitch != null ||
        ticket.nodeModulesCopied != null ||
        ticket.cacheBloat != null ||
        ticket.noWarning != null ||
        ticket.directorySource != null ||
        ticket.persists != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isScrubbed(row) {
  if (row.contaminated && row.cue !== "scrubbed") return false;
  if (
    row.cue === "contaminated" ||
    row.cue === "fomite" ||
    row.cue === "gitignore"
  ) {
    return false;
  }
  if (row.envHitch && row.cue !== "scrubbed") return false;
  if (row.nodeModulesCopied && row.cue !== "scrubbed") return false;
  if (row.skipGitignore && row.cue !== "scrubbed") return false;
  if (
    row.scrubbed === true &&
    row.contaminated !== true &&
    row.cue !== "contaminated"
  ) {
    return true;
  }
  if (
    row.cue === "scrubbed" &&
    row.contaminated !== true &&
    row.envHitch !== true &&
    row.nodeModulesCopied !== true &&
    row.skipGitignore !== true
  ) {
    return true;
  }
  if (
    row.gitignoreHonored === true &&
    row.contaminated !== true &&
    row.envHitch !== true &&
    row.nodeModulesCopied !== true
  ) {
    return true;
  }
  return false;
}

function isContaminated(row) {
  if (isScrubbed(row)) return false;
  if (row.cue === "contaminated" || row.cue === "fomite") return true;
  if (row.contaminated === true) return true;
  if (
    row.envHitch === true ||
    row.nodeModulesCopied === true ||
    row.skipGitignore === true ||
    row.cacheSize === MEASURED_CACHE
  ) {
    return true;
  }
  if (
    row.directorySource &&
    (row.noWarning || row.excludesGit) &&
    row.gitignoreHonored !== true
  ) {
    return true;
  }
  return false;
}

function isGitignorePath(row) {
  return (
    row.event === "gitignore" &&
    !isScrubbed(row) &&
    (row.contaminated === true ||
      row.gitignore === true ||
      row.skipGitignore === true)
  );
}

/**
 * Score one bench pass against the fomite booth.
 * scrubbed: gitignore honored; no .env / node_modules; matches tracked tree.
 * contaminated: directory marketplace copy includes gitignored files.
 * gitignore: named path — ignore rules never consulted.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isGitignorePath(row) ||
    (row.gitignore && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "gitignore";
  } else if (isContaminated(row)) {
    verdict = "contaminated";
  } else if (isScrubbed(row)) {
    verdict = "scrubbed";
  } else if (
    row.envHitch ||
    row.nodeModulesCopied ||
    row.skipGitignore ||
    row.cacheBloat ||
    row.noWarning ||
    row.excludesGit ||
    row.directorySource ||
    row.persists
  ) {
    verdict = "contaminated";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const ignore = inspectGitignore(row);
  const env = inspectEnvHitch(row);
  const cache = inspectCacheCopy(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    scrubbed: verdict === "scrubbed" || verdict === "hold",
    contaminated:
      verdict === "contaminated" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    gitignore:
      row.gitignore === true ||
      verdict === "gitignore" ||
      verdict === PATH_WORD,
    gitignoreHonored: row.gitignoreHonored,
    skipGitignore: row.skipGitignore,
    gitignoreUnread: row.gitignoreUnread,
    excludesGit: row.excludesGit,
    copyExcludesGit: row.copyExcludesGit,
    envHitch: row.envHitch,
    envCopied: row.envCopied,
    rootEnv: row.rootEnv,
    nodeModulesCopied: row.nodeModulesCopied,
    nodeModules: row.nodeModules,
    cacheBloat: row.cacheBloat,
    noWarning: row.noWarning,
    directorySource: row.directorySource,
    persists: row.persists,
    scratch: row.scratch,
    envProbe: row.envProbe,
    envCachePath: row.envCachePath,
    cacheSize: row.cacheSize,
    trackedSize: row.trackedSize,
    nodeModulesSize: row.nodeModulesSize,
    cue: hold ? "scrubbed" : "contaminated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit scrubbed" : "score fomite",
    ignore,
    env,
    cache,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : FOMITE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const contaminated = scored.filter((row) => row.verdict === "contaminated");
  const path = scored.filter((row) => row.verdict === "gitignore");
  const scrubbed = scored.filter((row) => row.verdict === "scrubbed");
  const headline =
    scored.find((row) => row.event === "contaminated") ||
    scored.find((row) => row.event === "env-hitch") ||
    scored.find((row) => row.event === "gitignore") ||
    contaminated[contaminated.length - 1];
  let verdict = "scrubbed";
  if (contaminated.length) verdict = "contaminated";
  else if (path.length && !scrubbed.length) verdict = "gitignore";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    contaminatedCount: contaminated.length,
    pathCount: path.length,
    scrubbedCount: scrubbed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit scrubbed" : "score fomite",
    note: headline
      ? "Claude Code 2.1.266; macOS 26.6.2 arm64; directory marketplace copy 128M vs tracked 4.5M; node_modules 51M; root .env hitch with no warning."
      : "published fomite walk scored against scrubbed vs contaminated",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "scrubbed" &&
    seeded !== "contaminated" &&
    seeded !== "gitignore" &&
    seeded !== "fomite" &&
    ticket.scrubbed == null &&
    ticket.contaminated == null &&
    ticket.gitignore == null &&
    ticket.envHitch == null &&
    ticket.nodeModulesCopied == null &&
    ticket.skipGitignore == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    backups: BACKUPS.map((row) => row.issue),
    scrubbed: scored.scrubbed ?? false,
    contaminated: scored.contaminated ?? false,
    gitignore: scored.gitignore ?? false,
    gitignoreHonored: scored.gitignoreHonored ?? false,
    skipGitignore: scored.skipGitignore ?? false,
    envHitch: scored.envHitch ?? false,
    nodeModulesCopied: scored.nodeModulesCopied ?? false,
    cacheBloat: scored.cacheBloat ?? false,
    noWarning: scored.noWarning ?? false,
    directorySource: scored.directorySource ?? false,
    persists: scored.persists ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.gitignoreHonored ? "ignore=honored" : "ignore=unread",
    result.envHitch ? "env=hitch" : "env=clean",
    result.nodeModulesCopied ? "nm=copied" : "nm=absent",
    result.cacheSize === MEASURED_CACHE ? "cache=128M" : "cache=4.5M",
    result.cue === "scrubbed" ? "cue=scrubbed" : "cue=contaminated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const bench = readBench({
    scrubbed: result.scrubbed,
    contaminated: result.contaminated,
    gitignoreHonored: result.gitignoreHonored,
    skipGitignore: result.skipGitignore,
    gitignoreUnread: result.gitignoreUnread,
    excludesGit: result.excludesGit,
    copyExcludesGit: result.copyExcludesGit,
    envHitch: result.envHitch,
    envCopied: result.envCopied,
    rootEnv: result.rootEnv,
    envProbe: result.envProbe,
    envCachePath: result.envCachePath,
    nodeModulesCopied: result.nodeModulesCopied,
    nodeModules: result.nodeModules,
    nodeModulesSize: result.nodeModulesSize,
    cacheBloat: result.cacheBloat,
    cacheSize: result.cacheSize,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    bench,
    ignore: inspectGitignore({
      gitignoreHonored: result.gitignoreHonored,
      skipGitignore: result.skipGitignore,
      gitignoreUnread: result.gitignoreUnread,
      excludesGit: result.excludesGit,
      copyExcludesGit: result.copyExcludesGit,
      envHitch: result.envHitch,
      nodeModulesCopied: result.nodeModulesCopied,
      scrubbed: result.scrubbed,
    }),
    env: inspectEnvHitch({
      envHitch: result.envHitch,
      envCopied: result.envCopied,
      rootEnv: result.rootEnv,
      envProbe: result.envProbe,
      envCachePath: result.envCachePath,
      scrubbed: result.scrubbed,
    }),
    cache: inspectCacheCopy({
      nodeModulesCopied: result.nodeModulesCopied,
      nodeModules: result.nodeModules,
      nodeModulesSize: result.nodeModulesSize,
      cacheBloat: result.cacheBloat,
      cacheSize: result.cacheSize,
      scrubbed: result.scrubbed,
    }),
    stations: BENCH_STATIONS.map((row) => ({
      ...row,
      contaminated:
        result.contaminated === true || result.verdict === "contaminated",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      os: OS,
      osVersion: OS_VERSION,
      arch: ARCH,
      shell: SHELL,
      marketplace: MARKETPLACE,
      plugin: PLUGIN,
      pluginVersion: PLUGIN_VERSION,
      cachePath: CACHE_PATH,
      measuredCache: MEASURED_CACHE,
      measuredTracked: MEASURED_TRACKED,
      measuredNodeModules: MEASURED_NODE_MODULES,
      skills: SKILLS,
      agents: AGENTS,
      checkout: CHECKOUT,
      envProbe: ENV_PROBE,
      envCachePath: ENV_CACHE_PATH,
      scratch: [...SCRATCH],
      copyTable: COPY_TABLE,
      stations: BENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "when the marketplace source is a directory, skip files git ignores",
        "honor global excludes and core.excludesFile",
        "an explicit exclude list in marketplace.json or plugin.json would work too",
      ],
      hypothesis:
        "NON-BINDING: directory-marketplace install walks the marketplace root with a naive copy that excludes .git but never consults .gitignore, global excludes, or core.excludesFile, so gitignored secrets and scratch hitchhike into the versioned cache. Verify against #93423 text only. Do not claim a root cause in Claude Code source you have not seen.",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
