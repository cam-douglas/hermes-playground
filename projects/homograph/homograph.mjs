#!/usr/bin/env node
/**
 * Homograph — lexicographer’s homograph desk / dictionary headword
 * collision booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code derives `~/.claude/projects/<slug>/` by collapsing
 * non-ASCII path characters (e.g. Korean) into a generic `-`. Distinct
 * folders can encode to the *identical* slug (same dash count), so a
 * new project silently inherits/overwrites memory+session data of an
 * unrelated — even deleted — project. Repro on Windows: folder A
 * `…/근평 웹만들기` writes memory, delete A, folder B
 * `…/비계량지표평가` loads A's Supabase HR-app memory into an
 * unrelated HWP/PDF tool session. Both →
 * `C--Users-<user>-Downloads--------`.
 *
 *   node homograph.mjs data/collided.json
 *   echo '{"seed":"collided"}' | node homograph.mjs
 *
 * Idle word is distinct (HOLD: paths keep separate memory).
 * Seeded word is collided (#93743 — lossy dash-collapse merges
 * memories).
 * Path word is lossy-slug.
 * Product score word is homograph (Score homograph or admit distinct.).
 *
 * Encoded from anthropics/claude-code#93743 issue text only.
 * Hypothesis (NON-BINDING): slug should hash the full absolute path or
 * percent-encode UTF-8; orphan stores for deleted paths should not
 * silent-revive. Verify against #93743 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude. No
 * secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "distinct",
  "collided",
  "homograph",
  "lossy-slug",
  "hold",
  "hashed-path",
  "percent-encode",
  "orphan-store",
  "dash-collapse",
  "lemma-a",
  "lemma-b",
  "shelf-merge",
  "memory-leak",
  "silent-revive",
  "ascii-prefix",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "distinct";
export const PATH_WORD = "lossy-slug";
export const SEEDED_WORD = "collided";
export const PRODUCT_WORD = "homograph";
export const HOLD = Object.freeze(["distinct", "hold"]);
export const RECOVER = Object.freeze(["distinct", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "intact",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "lit",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "collided" && name !== "homograph"),
);

export const FEATURED_ISSUE = 93743;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93743";
export const TITLE =
  "Project memory/session storage collides across different projects due to non-ASCII path slug encoding";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:windows",
  "area:core",
]);
export const PLATFORM = "windows";
export const LEMMA_A = "근평 웹만들기";
export const LEMMA_B = "비계량지표평가";
export const LEMMA_A_KIND = "Supabase-based HR evaluation web app";
export const LEMMA_B_KIND = "HWP/PDF parsing tool";
export const COLLIDED_SLUG = "C--Users-<user>-Downloads--------";
export const PARENT_PATH = "C:\\Users\\<user>\\Downloads";
export const STORE_ROOT = "~/.claude/projects/<slug>/";
export const ORPHAN_MEMORY = "memory/*.md";
export const OS_LABEL = "Windows 11 Pro (10.0.26200)";
export const SHELL_LABEL = "Git Bash / PowerShell";
export const SURFACE = "desktop app, Code tab";
export const PHRASE = "Score homograph or admit distinct.";
export const DISTRIBUTION =
  "Claude Code derives ~/.claude/projects/<slug>/ by converting the working-directory path into a slug. Non-ASCII characters (e.g. Korean) appear to be collapsed into a generic - regardless of their actual content, so two completely different folder names can produce the identical slug. When that happens, the new project silently inherits (and can overwrite) the memory/session data of an unrelated — even long-deleted — project. Repro: folder A C:\\Users\\<user>\\Downloads\\근평 웹만들기 writes memory; delete A; folder B C:\\Users\\<user>\\Downloads\\비계량지표평가 loads A's Supabase HR-app memory into an unrelated HWP/PDF tool session because both paths encoded to C--Users-<user>-Downloads-------- (dash count happened to match). Expected: unique per real path (hash of the full path, or percent-encoding non-ASCII bytes). Storage for a path that no longer exists should not be silently reused. Impact: cross-project memory/session leakage.";
export const SESSION_KIND =
  "Windows 11 Pro desktop Code-tab session. Two Korean-named folders under the same Downloads parent collapse to the same all-dash slug. Folder A (근평 웹만들기, Supabase HR app) writes memory; A is deleted; folder B (비계량지표평가, HWP/PDF tool) opens A's orphan store. Slug: C--Users-<user>-Downloads--------.";
export const RULED_OUT = Object.freeze([
  "the folders being the same project under two names (they are unrelated: HR web app vs HWP/PDF tool)",
  "the reporter needing to rename working folders with an ASCII prefix as the real fix (a stopgap only)",
  "dash-count uniqueness as a durable identifier (it only worked until two names produced the same length of collapsed dashes)",
  "orphan stores being harmless once the source folder is deleted (the stale store was silently revived)",
]);
export const EXPECTED = Object.freeze([
  "the slug/identifier for a project's storage directory should be unique per real path (hash of the full absolute path, or percent-encode UTF-8 instead of collapsing non-ASCII to a fixed placeholder)",
  "storage for a path that no longer exists on disk should not be silently reused by an unrelated new path",
  "if the original path no longer exists, mark the store orphaned or refuse to load it without an explicit adopt step",
]);

export const HOMOGRAPH_PLAQUES = Object.freeze([
  { id: "lemma-a", label: "lemma A", count: LEMMA_A, note: "HR web app" },
  { id: "lemma-b", label: "lemma B", count: LEMMA_B, note: "HWP/PDF tool" },
  { id: "slug", label: "shelf mark", count: "all-dash", note: COLLIDED_SLUG },
  { id: "store", label: "orphan", count: "revived", note: "memory/*.md" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "lemma-slip",
    survey: "lay two lemma slips (근평 웹만들기 vs 비계량지표평가)",
    kind: "lemma-slip",
    note: "seeded: two different headwords after script marks are stripped look identical",
  },
  {
    id: "shelf-mark",
    survey: "read the shelf mark (non-ASCII collapsed to a generic dash)",
    kind: "shelf-mark",
    note: "seeded: both paths encode to C--Users-<user>-Downloads--------",
  },
  {
    id: "volume-spine",
    survey: "open the volume (wrong dictionary volume comes off the shelf)",
    kind: "volume-spine",
    note: "seeded: B's session opens A's volume because the shelf mark collided",
  },
  {
    id: "collation-desk",
    survey: "collate memory slips (A's Supabase HR notes appear under B)",
    kind: "collation-desk",
    note: "seeded: cross-project memory/session leakage",
  },
  {
    id: "orphan-quire",
    survey: "check the orphan quire (deleted path store silent-revives)",
    kind: "orphan-quire",
    note: "seeded: A's folder is gone; its memory/*.md still loads for B",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "lossy-slug",
  "collided",
  "dash-collapse",
  "orphan-store",
  "silent-revive",
  "memory-leak",
  "lemma-a",
  "lemma-b",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91735,
    title: "same non-ASCII collide",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91735 same non-ASCII collide. Related encoding, not this Windows repro. Do not rebuild",
  },
  {
    issue: 70076,
    title: "all non-alnum → - guaranteed collisions",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #70076 all non-alnum → dash, guaranteed collisions. Broader charset rule. Do not rebuild",
  },
  {
    issue: 69752,
    title: "absolute-path key orphans on move",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #69752 absolute-path key orphans on move. Related orphan store, different trigger. Do not rebuild",
  },
  {
    issue: 89915,
    title: "wrong project hash",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #89915 wrong project hash. Different identifier defect. Do not rebuild",
  },
  {
    issue: 85595,
    title: "memory vs transcript key inconsistency",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #85595 memory vs transcript key inconsistency. Different keying surface. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93757,
    title: "reconnect discards /model",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93746,
    title: "enableArtifact false kills scratchpad",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93744,
    title: "/goal stop evaluator blind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93722,
    title: "worktree connector disable-list",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93672,
    title: "idle_prompt while background subagents still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93680,
    title: "Bash mkdir via /proc/self/fd",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93694,
    title: "WSL Open-in paths",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palimpsest",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "oubliette",
  "ephemera",
  "homonym",
]);

export const SAMPLE_LEMMA = Object.freeze({
  a: LEMMA_A,
  b: LEMMA_B,
  strippedSame: true,
});

export const SAMPLE_DISTINCT_LEMMA = Object.freeze({
  a: LEMMA_A,
  b: LEMMA_B,
  strippedSame: false,
});

export const SAMPLE_SHELF = Object.freeze({
  slug: COLLIDED_SLUG,
  collapsed: true,
  dashCountMatch: true,
});

export const SAMPLE_DISTINCT_SHELF = Object.freeze({
  slugA: "hash-or-percent-a",
  slugB: "hash-or-percent-b",
  collapsed: false,
  dashCountMatch: false,
});

export const SAMPLE_VOLUME = Object.freeze({
  opened: "A",
  requested: "B",
  wrongVolume: true,
});

export const SAMPLE_DISTINCT_VOLUME = Object.freeze({
  opened: "B",
  requested: "B",
  wrongVolume: false,
});

export const SAMPLE_MEMORY = Object.freeze({
  leaked: true,
  from: LEMMA_A_KIND,
  into: LEMMA_B_KIND,
});

export const SAMPLE_DISTINCT_MEMORY = Object.freeze({
  leaked: false,
  from: null,
  into: LEMMA_B_KIND,
});

export const SAMPLE_ORPHAN = Object.freeze({
  sourceDeleted: true,
  storePresent: true,
  revived: true,
});

export const SAMPLE_DISTINCT_ORPHAN = Object.freeze({
  sourceDeleted: false,
  storePresent: false,
  revived: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "two lemmas keep distinct shelves; memory stays separate" },
  { t: "lemma-a", line: "folder A 근평 웹만들기 writes Supabase HR-app memory" },
  { t: "strip", line: "non-ASCII runes collapse to a generic dash — distinguishing bytes thrown away" },
  { t: "delete", line: "folder A deleted from disk; orphan store remains under the all-dash shelf mark" },
  { t: "lemma-b", line: "folder B 비계량지표평가 opens an unrelated HWP/PDF tool session" },
  { t: "slug", line: "both paths encode to C--Users-<user>-Downloads--------" },
  { t: "merge", line: "same dash count — shelf marks collide; wrong volume opens" },
  { t: "leak", line: "B loads A's memory/*.md — HR-app notes in an HWP/PDF session" },
  { t: "revive", line: "deleted-path store silent-revives; no adopt step" },
  { t: "path", line: "lossy-slug — dash-collapse of non-ASCII is the encoding path" },
  { t: "score", line: "when two lemmas share one shelf mark the booth is a homograph — Score homograph or admit distinct." },
]);

export function inspectLemma(input = {}) {
  const lemma =
    input.lemma && typeof input.lemma === "object"
      ? input.lemma
      : input.distinct === true && input.collided !== true
        ? SAMPLE_DISTINCT_LEMMA
        : SAMPLE_LEMMA;
  const forcedSame =
    input.collided === true ||
    input.lossySlug === true ||
    input.event === "collided" ||
    input.event === "homograph" ||
    input.event === "lossy-slug" ||
    input.event === "lemma-a" ||
    input.event === "lemma-b";
  const strippedSame =
    forcedSame ? true : lemma.strippedSame === true && input.distinct !== true;
  return {
    a: lemma.a || LEMMA_A,
    b: lemma.b || LEMMA_B,
    strippedSame,
    stamp: strippedSame ? "headwords-stripped" : "headwords-distinct",
    note: strippedSame
      ? "two lemmas look identical after script marks are stripped"
      : "two lemmas keep distinct headwords after collation",
  };
}

export function inspectShelf(input = {}) {
  const shelf =
    input.shelf && typeof input.shelf === "object"
      ? input.shelf
      : input.distinct === true && input.collided !== true
        ? SAMPLE_DISTINCT_SHELF
        : SAMPLE_SHELF;
  const forcedCollapse =
    input.dashCollapse === true ||
    input.event === "dash-collapse" ||
    input.lossySlug === true ||
    (input.collided === true && input.distinct !== true);
  const collapsed = forcedCollapse ? true : shelf.collapsed === true;
  return {
    slug: collapsed ? COLLIDED_SLUG : shelf.slugA || "hashed-path",
    collapsed,
    dashCountMatch: collapsed,
    stamp: collapsed ? "shelf-collapsed" : "shelf-distinct",
    note: collapsed
      ? "shelf mark collapsed to C--Users-<user>-Downloads--------"
      : "shelf marks stay unique per real path",
  };
}

export function inspectVolume(input = {}) {
  const volume =
    input.volume && typeof input.volume === "object"
      ? input.volume
      : input.distinct === true && input.collided !== true
        ? SAMPLE_DISTINCT_VOLUME
        : SAMPLE_VOLUME;
  const forcedWrong =
    input.wrongVolume === true ||
    input.event === "shelf-merge" ||
    input.lossySlug === true ||
    (input.collided === true && input.distinct !== true);
  const wrongVolume = forcedWrong ? true : volume.wrongVolume === true;
  return {
    opened: wrongVolume ? "A" : volume.opened || "B",
    requested: "B",
    wrongVolume,
    stamp: wrongVolume ? "wrong-volume" : "volume-own",
    note: wrongVolume
      ? "wrong volume opens — B's session draws A's spine"
      : "each lemma opens its own volume",
  };
}

export function inspectMemory(input = {}) {
  const memory =
    input.memory && typeof input.memory === "object"
      ? input.memory
      : input.distinct === true && input.collided !== true
        ? SAMPLE_DISTINCT_MEMORY
        : SAMPLE_MEMORY;
  const forcedLeak =
    input.memoryLeak === true ||
    input.event === "memory-leak" ||
    input.event === "collided" ||
    (input.collided === true && input.distinct !== true);
  const leaked = forcedLeak ? true : memory.leaked === true;
  return {
    leaked,
    from: leaked ? LEMMA_A_KIND : null,
    into: LEMMA_B_KIND,
    stamp: leaked ? "memory-leaked" : "memory-distinct",
    note: leaked
      ? "A's Supabase HR-app memory loads into B's HWP/PDF session"
      : "each path keeps separate memory",
  };
}

export function inspectOrphan(input = {}) {
  const orphan =
    input.orphan && typeof input.orphan === "object"
      ? input.orphan
      : input.distinct === true && input.collided !== true
        ? SAMPLE_DISTINCT_ORPHAN
        : SAMPLE_ORPHAN;
  const forcedRevive =
    input.silentRevive === true ||
    input.event === "silent-revive" ||
    input.event === "orphan-store" ||
    input.lossySlug === true ||
    (input.collided === true && input.distinct !== true);
  const revived = forcedRevive ? true : orphan.revived === true;
  return {
    sourceDeleted: revived,
    storePresent: revived,
    revived,
    stamp: revived ? "orphan-revived" : "orphan-quiet",
    note: revived
      ? "deleted-path store silent-revives — no adopt step"
      : "no orphan store waiting to revive under a new lemma",
  };
}

export function readBooth(input = {}) {
  const lemma = inspectLemma(input);
  const shelf = inspectShelf(input);
  const volume = inspectVolume(input);
  const memory = inspectMemory(input);
  const orphan = inspectOrphan(input);
  const collided =
    input.distinct !== true &&
    ((shelf.collapsed && memory.leaked) ||
      (orphan.revived && volume.wrongVolume) ||
      input.collided === true);
  const distinct = input.distinct === true && collided !== true && !shelf.collapsed;
  const path =
    shelf.collapsed &&
    (input.event === "lossy-slug" || input.lossySlug === true);
  return {
    lemma,
    shelf,
    volume,
    memory,
    orphan,
    plaques: HOMOGRAPH_PLAQUES,
    stations: BOOTH_STATIONS,
    collided: collided && !distinct && !path,
    distinct:
      distinct ||
      (!shelf.collapsed &&
        !memory.leaked &&
        input.collided !== true &&
        input.lossySlug !== true),
    lossySlug: path && !distinct,
    mark:
      path && !distinct
        ? "lossy-slug"
        : collided && !distinct
          ? "collided"
          : "distinct",
  };
}

/**
 * Published homograph walk from #93743 only. Facts from the issue text.
 * A distinct booth keeps separate memory per real path.
 * A collided booth merges two lemmas after lossy dash-collapse.
 * A lossy-slug booth names the encoding path.
 */
export const HOMOGRAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-distinct",
    distinct: true,
    collided: false,
    cue: "distinct",
    note: "idle HOLD: paths keep separate memory; two lemmas stay on distinct shelves",
  },
  {
    t: "lemma-a",
    event: "lemma-a",
    distinct: true,
    hashedPath: true,
    cue: "distinct",
    note: "folder A 근평 웹만들기 writes memory under its own shelf mark",
  },
  {
    t: "strip",
    event: "dash-collapse",
    collided: true,
    dashCollapse: true,
    cue: "collided",
    note: "non-ASCII runes collapse to a generic dash — distinguishing bytes thrown away",
  },
  {
    t: "delete",
    event: "orphan-store",
    collided: true,
    orphanStore: true,
    cue: "collided",
    note: "folder A deleted; orphan store remains under the all-dash shelf mark",
  },
  {
    t: "lemma-b",
    event: "lemma-b",
    collided: true,
    lemmaB: true,
    cue: "collided",
    note: "folder B 비계량지표평가 opens an unrelated HWP/PDF tool session",
  },
  {
    t: "slug",
    event: "lossy-slug",
    collided: true,
    lossySlug: true,
    dashCollapse: true,
    cue: "collided",
    note: "both paths encode to C--Users-<user>-Downloads--------",
  },
  {
    t: "merge",
    event: "shelf-merge",
    collided: true,
    shelfMerge: true,
    cue: "collided",
    note: "same dash count — shelf marks collide; wrong volume opens",
  },
  {
    t: "leak",
    event: "memory-leak",
    collided: true,
    memoryLeak: true,
    cue: "collided",
    note: "B loads A's memory/*.md — HR-app notes in an HWP/PDF session",
  },
  {
    t: "revive",
    event: "silent-revive",
    collided: true,
    silentRevive: true,
    cue: "collided",
    note: "deleted-path store silent-revives; no adopt step",
  },
  {
    t: "path",
    event: "lossy-slug",
    collided: true,
    lossySlug: true,
    dashCollapse: true,
    orphanStore: true,
    cue: "collided",
    note: "lossy-slug — dash-collapse of non-ASCII is the encoding path",
  },
  {
    t: "score",
    event: "homograph",
    collided: true,
    lossySlug: true,
    dashCollapse: true,
    orphanStore: true,
    memoryLeak: true,
    silentRevive: true,
    cue: "collided",
    note: "homograph — when two lemmas share one shelf mark the booth never stays distinct",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "hashed-path",
    distinct: true,
    hashedPath: true,
    cue: "distinct",
    note: "positive control: slug is a hash of the full absolute path",
  },
  {
    t: "encode",
    event: "cue-distinct",
    distinct: true,
    cue: "distinct",
    note: "positive control: percent-encode UTF-8; orphan store not revived",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    distinct: true,
    collided: false,
    hashedPath: true,
    cue: "distinct",
  };
}

export function seedDistinct() {
  return { ...emptyTicket() };
}

export function seedCollided() {
  return {
    seed: SEEDED_WORD,
    distinct: false,
    collided: true,
    dashCollapse: true,
    orphanStore: true,
    lemmaB: true,
    lossySlug: true,
    shelfMerge: true,
    memoryLeak: true,
    silentRevive: true,
    cue: "collided",
    issue: FEATURED_ISSUE,
    lemma: SAMPLE_LEMMA,
    shelf: SAMPLE_SHELF,
    volume: SAMPLE_VOLUME,
    memory: SAMPLE_MEMORY,
    orphan: SAMPLE_ORPHAN,
  };
}

export function seedHomograph() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    collided: true,
    dashCollapse: true,
    orphanStore: true,
    lemmaB: true,
    lossySlug: true,
    shelfMerge: true,
    memoryLeak: true,
    silentRevive: true,
    cue: "collided",
  };
}

export function seedLossySlug() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    collided: true,
    lossySlug: true,
    dashCollapse: true,
    orphanStore: true,
    event: "lossy-slug",
    cue: "collided",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    distinct: true,
    cue: "distinct",
  };
}

export function seedHashedPath() {
  return {
    seed: "hashed-path",
    preferSeed: true,
    hashedPath: true,
    cue: "distinct",
  };
}

export function seedPercentEncode() {
  return {
    seed: "percent-encode",
    preferSeed: true,
    cue: "distinct",
  };
}

export function seedOrphanStore() {
  return {
    seed: "orphan-store",
    preferSeed: true,
    orphanStore: true,
    cue: "collided",
  };
}

export function seedDashCollapse() {
  return {
    seed: "dash-collapse",
    preferSeed: true,
    dashCollapse: true,
    cue: "collided",
  };
}

export function seedLemmaA() {
  return {
    seed: "lemma-a",
    preferSeed: true,
    cue: "collided",
  };
}

export function seedLemmaB() {
  return {
    seed: "lemma-b",
    preferSeed: true,
    lemmaB: true,
    cue: "collided",
  };
}

export function seedShelfMerge() {
  return {
    seed: "shelf-merge",
    preferSeed: true,
    shelfMerge: true,
    cue: "collided",
  };
}

export function seedMemoryLeak() {
  return {
    seed: "memory-leak",
    preferSeed: true,
    memoryLeak: true,
    cue: "collided",
  };
}

export function seedSilentRevive() {
  return {
    seed: "silent-revive",
    preferSeed: true,
    silentRevive: true,
    cue: "collided",
  };
}

export function seedAsciiPrefix() {
  return {
    seed: "ascii-prefix",
    preferSeed: true,
    cue: "collided",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      distinct: false,
      collided: false,
      lossySlug: false,
      hashedPath: false,
      dashCollapse: false,
      orphanStore: false,
      lemmaB: false,
      shelfMerge: false,
      memoryLeak: false,
      silentRevive: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    distinct: raw.distinct === true,
    collided:
      raw.collided === true ||
      raw.event === "collided" ||
      raw.event === "homograph",
    lossySlug: raw.lossySlug === true || raw.event === "lossy-slug",
    hashedPath: raw.hashedPath === true || raw.event === "hashed-path",
    dashCollapse: raw.dashCollapse === true || raw.event === "dash-collapse",
    orphanStore: raw.orphanStore === true || raw.event === "orphan-store",
    lemmaB: raw.lemmaB === true || raw.event === "lemma-b",
    shelfMerge: raw.shelfMerge === true || raw.event === "shelf-merge",
    memoryLeak: raw.memoryLeak === true || raw.event === "memory-leak",
    silentRevive: raw.silentRevive === true || raw.event === "silent-revive",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    lemma: raw.lemma,
    shelf: raw.shelf,
    volume: raw.volume,
    memory: raw.memory,
    orphan: raw.orphan,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.distinct != null ||
        ticket.collided != null ||
        ticket.lossySlug != null ||
        ticket.dashCollapse != null ||
        ticket.orphanStore != null ||
        ticket.memoryLeak != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.lemma ||
        ticket.shelf ||
        ticket.memory),
  );
}

function isDistinct(row) {
  if (row.collided && row.cue !== "distinct") return false;
  if (
    row.cue === "collided" ||
    row.cue === "homograph" ||
    row.cue === "lossy-slug"
  ) {
    return false;
  }
  if (
    row.dashCollapse &&
    row.orphanStore &&
    row.cue !== "distinct" &&
    row.distinct !== true
  ) {
    return false;
  }
  if (
    row.lossySlug &&
    row.dashCollapse &&
    row.cue !== "distinct" &&
    row.distinct !== true
  ) {
    return false;
  }
  if (row.distinct === true && row.collided !== true && row.cue !== "collided") {
    return true;
  }
  if (
    row.cue === "distinct" &&
    row.collided !== true &&
    row.dashCollapse !== true &&
    row.lossySlug !== true
  ) {
    return true;
  }
  if (
    row.hashedPath === true &&
    row.collided !== true &&
    row.dashCollapse !== true &&
    row.orphanStore !== true &&
    row.lossySlug !== true
  ) {
    return true;
  }
  return false;
}

function isLossySlugPath(row) {
  return (
    row.event === "lossy-slug" &&
    !isDistinct(row) &&
    (row.lossySlug === true ||
      row.dashCollapse === true ||
      row.orphanStore === true)
  );
}

function isCollided(row) {
  if (isDistinct(row)) return false;
  if (isLossySlugPath(row) && row.cue !== "collided") return false;
  if (row.cue === "collided" || row.cue === "homograph") return true;
  if (row.collided === true) return true;
  if (
    row.dashCollapse === true &&
    row.orphanStore === true &&
    row.memoryLeak === true
  ) {
    return true;
  }
  if (row.dashCollapse === true && row.orphanStore === true) {
    return true;
  }
  if (
    row.memoryLeak === true ||
    row.silentRevive === true ||
    row.shelfMerge === true ||
    (row.lossySlug === true && row.orphanStore === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one homograph pass against the headword desk.
 * distinct: paths keep separate memory.
 * collided / homograph: lossy dash-collapse merges memories.
 * lossy-slug: non-ASCII path characters collapse to a generic dash.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isLossySlugPath(row) ||
    (row.lossySlug && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "lossy-slug";
  } else if (isCollided(row)) {
    verdict = "homograph";
  } else if (isDistinct(row)) {
    verdict = "distinct";
  } else if (
    row.dashCollapse ||
    row.orphanStore ||
    row.memoryLeak ||
    (row.lossySlug && !row.hashedPath)
  ) {
    verdict = "homograph";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const lemma = inspectLemma(row);
  const shelf = inspectShelf(row);
  const volume = inspectVolume(row);
  const memory = inspectMemory(row);
  const orphan = inspectOrphan(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    distinct: verdict === "distinct" || verdict === "hold",
    collided:
      verdict === "collided" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    lossySlug:
      row.lossySlug === true ||
      verdict === "lossy-slug" ||
      verdict === PATH_WORD,
    hashedPath: row.hashedPath,
    dashCollapse: row.dashCollapse,
    orphanStore: row.orphanStore,
    lemmaB: row.lemmaB,
    shelfMerge: row.shelfMerge,
    memoryLeak: row.memoryLeak,
    silentRevive: row.silentRevive,
    cue: hold
      ? "distinct"
      : row.lossySlug || verdict === "lossy-slug"
        ? "lossy-slug"
        : "collided",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit distinct" : "score homograph",
    lemmaInspect: lemma,
    shelfInspect: shelf,
    volumeInspect: volume,
    memoryInspect: memory,
    orphanInspect: orphan,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : HOMOGRAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const collided = scored.filter(
    (row) => row.verdict === "homograph" || row.verdict === "collided",
  );
  const path = scored.filter((row) => row.verdict === "lossy-slug");
  const distinct = scored.filter((row) => row.verdict === "distinct");
  const headline =
    scored.find((row) => row.event === "collided") ||
    scored.find((row) => row.event === "lossy-slug") ||
    scored.find((row) => row.event === "dash-collapse") ||
    collided[collided.length - 1];
  let verdict = "distinct";
  if (collided.length) verdict = "homograph";
  else if (path.length && !distinct.length) verdict = "lossy-slug";
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
    collidedCount: collided.length,
    pathCount: path.length,
    distinctCount: distinct.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit distinct" : "score homograph",
    note: headline
      ? "Lossy dash-collapse merged two Korean-named folders onto C--Users-<user>-Downloads--------; B loaded A's orphan memory."
      : "published homograph walk scored against distinct vs collided",
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
    seeded !== "distinct" &&
    seeded !== "collided" &&
    seeded !== "lossy-slug" &&
    seeded !== "homograph" &&
    ticket.distinct == null &&
    ticket.collided == null &&
    ticket.dashCollapse == null &&
    ticket.lossySlug == null &&
    ticket.orphanStore == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
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
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
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
    distinct: scored.distinct ?? false,
    collided: scored.collided ?? false,
    lossySlug: scored.lossySlug ?? false,
    hashedPath: scored.hashedPath ?? false,
    dashCollapse: scored.dashCollapse ?? false,
    orphanStore: scored.orphanStore ?? false,
    lemmaB: scored.lemmaB ?? false,
    shelfMerge: scored.shelfMerge ?? false,
    memoryLeak: scored.memoryLeak ?? false,
    silentRevive: scored.silentRevive ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.distinct && !result.collided ? "lemma=distinct" : "lemma=stripped",
    result.dashCollapse || result.collided ? "shelf=collapsed" : "shelf=unique",
    result.silentRevive || result.collided ? "orphan=revived" : "orphan=quiet",
    result.memoryLeak || result.collided ? "memory=leaked" : "memory=separate",
    result.lossySlug || result.verdict === "lossy-slug"
      ? "path=lossy-slug"
      : "path=distinct",
    result.cue === "distinct"
      ? "cue=distinct"
      : result.cue === "lossy-slug"
        ? "cue=lossy-slug"
        : "cue=collided",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    distinct: result.distinct,
    collided: result.collided,
    lossySlug: result.lossySlug,
    hashedPath: result.hashedPath,
    dashCollapse: result.dashCollapse,
    orphanStore: result.orphanStore,
    lemmaB: result.lemmaB,
    shelfMerge: result.shelfMerge,
    memoryLeak: result.memoryLeak,
    silentRevive: result.silentRevive,
    lemma: input && input.lemma,
    shelf: input && input.shelf,
    volume: input && input.volume,
    memory: input && input.memory,
    orphan: input && input.orphan,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    lemma: inspectLemma({
      distinct: result.distinct,
      collided: result.collided,
      lossySlug: result.lossySlug,
      lemma: input && input.lemma,
    }),
    shelf: inspectShelf({
      distinct: result.distinct,
      collided: result.collided,
      dashCollapse: result.dashCollapse,
      lossySlug: result.lossySlug,
      shelf: input && input.shelf,
    }),
    volume: inspectVolume({
      distinct: result.distinct,
      collided: result.collided,
      wrongVolume: result.shelfMerge,
      lossySlug: result.lossySlug,
      volume: input && input.volume,
    }),
    memory: inspectMemory({
      distinct: result.distinct,
      collided: result.collided,
      memoryLeak: result.memoryLeak,
      memory: input && input.memory,
    }),
    orphan: inspectOrphan({
      distinct: result.distinct,
      collided: result.collided,
      silentRevive: result.silentRevive,
      lossySlug: result.lossySlug,
      orphan: input && input.orphan,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      collided:
        result.collided === true ||
        result.verdict === "collided" ||
        result.verdict === "homograph",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      lemmaA: LEMMA_A,
      lemmaB: LEMMA_B,
      lemmaAKind: LEMMA_A_KIND,
      lemmaBKind: LEMMA_B_KIND,
      collidedSlug: COLLIDED_SLUG,
      parentPath: PARENT_PATH,
      storeRoot: STORE_ROOT,
      orphanMemory: ORPHAN_MEMORY,
      osLabel: OS_LABEL,
      shellLabel: SHELL_LABEL,
      surface: SURFACE,
      plaques: HOMOGRAPH_PLAQUES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: slug should hash the full absolute path or percent-encode UTF-8; orphan stores for deleted paths should not silent-revive. Verify against #93743 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
