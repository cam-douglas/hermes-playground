#!/usr/bin/env node
/**
 * Cenotaph — memorial / empty-tomb / sepulchre /
 * cenotaph-yard booth.
 * A *cenotaph* is a monument for someone buried elsewhere;
 * here `installLocation` is a carved stone pointing at a
 * path that no longer exists while the living `source.path`
 * still stands. Every launch re-polishes the plaque
 * (`lastUpdated`) but never moves the stone. Marble bone /
 * bronze plaque / moss / void. NOT Stratum geology cores.
 * NOT Tmesis parchment. NOT Vedette cavalry lantern. NOT
 * Orloj Prague clock. NOT Brisure herald college. NOT
 * Diptych wax-tablet. NOT Vizard masque-ball. NOT Treacle
 * kettle. NOT Somnus sleep clinic. NOT Cresset fire-basket.
 * NOT Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Stereotype foundry. NOT
 * Cachet wax-seal. NOT the older vacant-monument #90771
 * booth. NOT Sepulchre burial-vault.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: a directory-source marketplace whose recorded
 * `installLocation` is ENOENT never loads again. Every
 * launch re-fetches from source, bumps `lastUpdated`, and
 * leaves the dead path. `claude plugin marketplace update`
 * fails on the dead path. Only recovery is remove then add,
 * which also clears `enabledPlugins`.
 *
 * Encoded from anthropics/claude-code#94452 issue text only.
 * Hypothesis (NON-BINDING — issue text): when a directory
 * marketplace's recorded `installLocation` is ENOENT, the
 * re-fetch path bumps `lastUpdated` but never rewrites
 * `installLocation` from live `source.path`, so every
 * launch misses the same way and `marketplace update` also
 * opens the dead path. Invite verify against #94452 text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix. No
 * network. No exploits. No live Claude.
 *
 *   node cenotaph.mjs data/cenotaph.json
 *   echo '{"seed":"cenotaph"}' | node cenotaph.mjs
 *
 * Idle word is homed (HOLD: rewrite `installLocation` to
 * live `source.path` when ENOENT on re-fetch).
 * HOLD aliases: repointed, relocated, settled.
 * Seeded word is cenotaph (#94452 path).
 * Path word is dead-install.
 * Product score word is cenotaph (Score cenotaph or admit homed.).
 *
 * NOT #94451 (known_marketplaces.json never repaired once
 * invalid). NOT #82272 (installLocation string-prefix vs
 * realpath). NOT #36575 CLOSED (portable installLocation).
 * NOT #94516 (marketplace refresh stale content).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "homed",
  "cenotaph",
  "dead-install",
  "repointed",
  "relocated",
  "settled",
  "cache-miss",
  "last-updated",
  "marketplace-update",
  "remove-add",
  "enabled-cleared",
  "94452",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "homed";
export const PATH_WORD = "dead-install";
export const SEEDED_WORD = "cenotaph";
export const PRODUCT_WORD = "cenotaph";
export const HOLD = Object.freeze(["homed"]);
export const HOLD_ALIASES = Object.freeze(["repointed", "relocated", "settled"]);
export const RECOVER = Object.freeze(["homed"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "shared",
  "contiguous",
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
  "cleared",
  "stood",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "frangible",
  "nameplate",
  "matryoshka",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
]);

export const FEATURED_ISSUE = 94452;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94452";
export const TITLE =
  "A directory marketplace whose recorded installLocation no longer exists never loads again: every launch re-fetches from source but keeps the dead path, and claude plugin marketplace update fails on it";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "platform:wsl", "area:plugins"]);
export const PLATFORM = "wsl";
export const SURFACE = "dead-install";
export const HOST =
  "Claude Code 2.1.272; isolated config dir repro; no login needed (plugin loading before auth)";
export const CHECKED_ON =
  "Published report: directory-source marketplace; installLocation in known_marketplaces.json points at a path that no longer exists while source.path still exists; every launch re-fetches, bumps lastUpdated, leaves the dead path";
export const BUILD = "Claude Code 2.1.272";
export const SELECTED_MODEL =
  "Dead installLocation never rewritten from live source.path — not a model defect";
export const OS = "WSL; isolated config dir; area:plugins";
export const PHRASE = "Score cenotaph or admit homed.";
export const DISTRIBUTION =
  "Claude Code 2.1.272; isolated config dir repro; no login needed (plugin loading before auth). directory-source marketplace. known_marketplaces.json records installLocation pointing at a path that no longer exists while source.path still exists. Every launch: Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT. Bumps lastUpdated but leaves installLocation pointing at the dead path — rewritten every launch, never the wrong field. claude plugin marketplace update mkt-a fails on the dead path instead of resolving from source. claude plugin list shows cache-miss; no recovery guidance. Only recovery: remove then add — but remove also deletes the marketplace's plugins from enabledPlugins, so after recovering the plugin stays disabled. For directory source, Claude Code itself records installLocation equal to source.path on add; once they diverge (config carried across machines / dirs; cf. #36575, #82272), entry stays stuck even though the correct value sits in the same entry.";

export const CODE_BUILD = "2.1.272";
export const MARKETPLACE_ID = "mkt-a";
export const CONFIG_FILE = "known_marketplaces.json";
export const DEAD_PATH = "/dead/install/mkt-a";
export const LIVE_SOURCE = "/live/source/mkt-a";
export const CACHE_MISS_LINE =
  "Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT";

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_HOMED = Object.freeze({
  kind: "homed",
  installLocation: LIVE_SOURCE,
  sourcePath: LIVE_SOURCE,
  sourceType: "directory",
  lastUpdatedBumped: false,
  deadInstall: false,
  note: "stone moved — installLocation rewritten to live source.path",
  synthetic: true,
});
export const SYNTHETIC_CENOTAPH = Object.freeze({
  kind: "cenotaph",
  installLocation: DEAD_PATH,
  sourcePath: LIVE_SOURCE,
  sourceType: "directory",
  lastUpdatedBumped: true,
  deadInstall: true,
  note: "plaque polished; stone still points at the dead path",
  synthetic: true,
});
export const SYNTHETIC_DEAD_INSTALL = Object.freeze({
  kind: "dead-install",
  rows: [
    { lane: "source.type", block: "directory", live: true, note: "directory-source marketplace" },
    { lane: "source.path", block: LIVE_SOURCE, live: true, note: "living source still stands" },
    { lane: "installLocation", block: DEAD_PATH, live: false, note: "carved stone points at ENOENT" },
    { lane: "lastUpdated", block: "bumped", live: false, note: "plaque re-polished every launch" },
    { lane: "marketplace update", block: "ENOENT", live: false, note: "opens the dead path, not source" },
    { lane: "plugin list", block: "cache-miss", live: false, note: "no recovery guidance" },
  ],
  note: "six-row evidence: living source; dead installLocation; polished plaque",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "source.type",
    role: "source",
    content: "directory",
    live: true,
    dead: false,
  },
  {
    lane: "source.path",
    role: "source",
    content: LIVE_SOURCE,
    live: true,
    dead: false,
  },
  {
    lane: "installLocation",
    role: "install",
    content: DEAD_PATH,
    live: false,
    dead: true,
  },
  {
    lane: "lastUpdated",
    role: "plaque",
    content: "bumped every launch; stone unmoved",
    live: false,
    dead: false,
    polished: true,
  },
  {
    lane: "marketplace update",
    role: "cli",
    content: "claude plugin marketplace update mkt-a → ENOENT on dead path",
    live: false,
    dead: true,
  },
  {
    lane: "plugin list",
    role: "cli",
    content: "cache-miss; no recovery guidance",
    live: false,
    dead: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "living-source",
    lost: "Living source — source.path still stands while the stone points elsewhere",
    control: "A homed stone would be rewritten to the live source.path",
    story: "the grove is still there; the monument does not face it",
  },
  {
    id: "carved-stone",
    lost: "Carved stone — installLocation in known_marketplaces.json points at ENOENT",
    control: "the stone would be recarved to the living path",
    story: "Claude Code itself recorded installLocation equal to source.path on add",
  },
  {
    id: "bronze-plaque",
    lost: "Bronze plaque — lastUpdated is bumped on every launch re-fetch",
    control: "polishing would also move the stone",
    story: "the plaque is rewritten every launch, never the wrong field — just never the right one",
  },
  {
    id: "void-path",
    lost: "Void path — Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT",
    control: "a missing installLocation would resolve from source",
    story: "every launch misses the same way",
  },
  {
    id: "update-fail",
    lost: "Update fail — claude plugin marketplace update mkt-a opens the dead path",
    control: "marketplace update would resolve from source",
    story: "the update command walks to the empty grave",
  },
  {
    id: "enabled-cleared",
    lost: "Enabled-cleared — remove then add is the only recovery, and remove deletes enabledPlugins",
    control: "re-fetch would rewrite installLocation so remove+add is not required",
    story: "after recovering, the plugin stays disabled",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "living-source",
    survey: "homed HOLD: rewrite installLocation to live source.path when ENOENT on re-fetch",
    kind: "homed",
    note: "idle/control: the living source still stands; the stone should face it",
  },
  {
    id: "carved-stone",
    survey: "installLocation in known_marketplaces.json points at a path that no longer exists",
    kind: "cenotaph",
    note: "seeded: carved stone pointing at a grave elsewhere",
  },
  {
    id: "bronze-plaque",
    survey: "every launch re-fetches and bumps lastUpdated but leaves the dead path",
    kind: "cenotaph",
    note: "seeded: plaque polished, stone unmoved",
  },
  {
    id: "void-path",
    survey: "Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT",
    kind: "cenotaph",
    note: "seeded: void at the recorded installLocation",
  },
  {
    id: "update-fail",
    survey: "claude plugin marketplace update mkt-a fails on the dead path instead of resolving from source",
    kind: "cenotaph",
    note: "seeded: update walks the empty grave",
  },
  {
    id: "enabled-cleared",
    survey: "dead-install — remove then add is the only recovery; remove clears enabledPlugins",
    kind: "cenotaph",
    note: "path: dead-install names the stuck stone",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "cache-miss",
    label: "cache-miss",
    count: "plugin list",
    note: "claude plugin list shows cache-miss; no recovery guidance",
  },
  {
    id: "last-updated",
    label: "last-updated",
    count: "plaque",
    note: "lastUpdated bumped every launch; installLocation unmoved",
  },
  {
    id: "marketplace-update",
    label: "marketplace-update",
    count: "ENOENT",
    note: "marketplace update opens the dead path instead of source",
  },
  {
    id: "dead-install",
    label: "dead-install",
    count: "installLocation",
    note: "recorded installLocation is ENOENT while source.path lives",
  },
  {
    id: "remove-add",
    label: "remove-add",
    count: "only recovery",
    note: "only recovery is remove then add",
  },
  {
    id: "enabled-cleared",
    label: "enabled-cleared",
    count: "plugins",
    note: "remove also deletes the marketplace's plugins from enabledPlugins",
  },
]);

export const RULED_OUT = Object.freeze([
  " #94451 — known_marketplaces.json never repaired once invalid (missing lastUpdated / parse error disables ALL marketplaces) — DIFFERENT; cite only",
  " #82272 — installLocation validated by string prefix not realpath (symlink CLAUDE_CONFIG_DIR) — DIFFERENT; cite only",
  " #36575 CLOSED — portable paths for installLocation cross-platform — DIFFERENT; cite only",
  " #94516 — marketplace refresh can install unmerged/stale content without signal — DIFFERENT; cite only",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit / false success — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — orphan scheduled-task ticks — DIFFERENT",
  "Cancellans/#94400 — deferred-delta / tools-array drop — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
  "Cachet/#93490 — resume flattens array+cache_control — DIFFERENT",
  "Stereotype — plugin freshness / version-only stamp — DIFFERENT",
  "older vacant-monument / #90771 booth — DIFFERENT product, same slug remasked",
  "Sepulchre — burial-vault / session-dead — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "On re-fetch because recorded installLocation is missing, write resolved source.path back as installLocation",
  "claude plugin marketplace update should resolve from source, not the dead path",
  "remove then add should not be the only recovery",
]);

export const SUGGESTED_FIX = Object.freeze([
  "When re-fetch finds recorded installLocation ENOENT, write resolved source.path back as installLocation",
  "marketplace update should resolve from source",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "dead-install",
  "cenotaph",
  "cache-miss",
  "last-updated",
  "marketplace-update",
  "enabled-cleared",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94451,
    title: "known_marketplaces.json never repaired once invalid (missing lastUpdated / parse error disables ALL marketplaces)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94451 is a parse/lastUpdated invalidation that disables ALL marketplaces. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 82272,
    title: "installLocation validated by string prefix not realpath (symlink CLAUDE_CONFIG_DIR)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #82272 is prefix-not-realpath validation. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 36575,
    title: "portable paths for installLocation cross-platform",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — #36575 CLOSED portable installLocation. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94516,
    title: "marketplace refresh can install unmerged/stale content without signal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94516 is stale refresh content. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94496, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94499, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94522, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94520, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94509, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94507, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
]);

export const SAMPLE_KIND_IDLE = "living-source";
export const SAMPLE_KIND_SEEDED = "dead-install";
export const SAMPLE_HOLDING_IDLE = "memorial-yard";
export const SAMPLE_HOLDING_SEEDED = "carved-stone";

export const SAMPLE_HOMED_PROOF = Object.freeze({
  homed: true,
  cenotaph: false,
  deadInstall: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_CENOTAPH_PROOF = Object.freeze({
  homed: false,
  cenotaph: true,
  deadInstall: true,
  cacheMiss: true,
  lastUpdated: true,
  marketplaceUpdate: true,
  removeAdd: true,
  enabledCleared: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  homedWatch: { ...SYNTHETIC_HOMED },
  cenotaphWatch: { ...SYNTHETIC_CENOTAPH },
  deadInstallShape: { ...SYNTHETIC_DEAD_INSTALL },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds homed: rewrite installLocation to live source.path when ENOENT on re-fetch" },
  { t: "dead-install", line: "installLocation is ENOENT; source.path still stands; lastUpdated bumped" },
  { t: "path", line: "dead-install — stone points at the empty grave; marketplace update fails on it" },
  { t: "score", line: "when the stone is never moved the booth is cenotaph — Score cenotaph or admit homed." },
]);

const FORCE_FLAGS = [
  "deadInstall",
  "cacheMiss",
  "lastUpdated",
  "marketplaceUpdate",
  "removeAdd",
  "enabledCleared",
];

const ISSUE_CUE_RE =
  /94452|installLocation|known_marketplaces|source\.path|marketplace update|mkt-a|ENOENT|enabledPlugins|directory-source|dead path/i;

/**
 * Educational dead-install observer. Not a Claude Code patch.
 * Encodes only the published #94452 shapes.
 *
 * source.path still stands. homed=true rewrites installLocation to it.
 */
export function observeDeadInstall({
  installLocationMissing = true,
  sourcePathExists = true,
  homed = false,
} = {}) {
  if (homed === true) {
    return {
      installLocationMissing: false,
      sourcePathExists: true,
      installLocation: LIVE_SOURCE,
      phrase: "admit homed",
      synthetic: true,
    };
  }
  return {
    installLocationMissing: installLocationMissing === true,
    sourcePathExists: sourcePathExists === true,
    installLocation: installLocationMissing ? DEAD_PATH : LIVE_SOURCE,
    phrase: installLocationMissing ? "score cenotaph" : "admit homed",
    note: installLocationMissing
      ? "recorded installLocation is ENOENT while source.path still stands"
      : "stone faces the living source",
    synthetic: true,
  };
}

/**
 * Educational installLocation rewrite. Not a Claude Code patch.
 * HOLD: write resolved source.path back as installLocation.
 */
export function rewriteInstallLocation({
  dead = true,
  sourcePath = LIVE_SOURCE,
  homed = false,
} = {}) {
  if (homed === true) {
    return {
      installLocation: sourcePath,
      phrase: "admit homed",
      note: "stone moved to live source.path",
      synthetic: true,
    };
  }
  const stuck = dead === true;
  return {
    installLocation: stuck ? DEAD_PATH : sourcePath,
    phrase: stuck ? "score cenotaph" : "admit homed",
    note: stuck
      ? "re-fetch leaves installLocation pointing at the dead path"
      : "installLocation matches source.path",
    synthetic: true,
  };
}

/**
 * Educational plaque polish. Not a Claude Code patch.
 * Published: lastUpdated is bumped; installLocation is not rewritten.
 */
export function polishPlaque({
  lastUpdatedBumped = true,
  installLocationRewritten = false,
  homed = false,
} = {}) {
  if (homed === true || installLocationRewritten === true) {
    return {
      lastUpdatedBumped: true,
      installLocationRewritten: true,
      phrase: "admit homed",
      synthetic: true,
    };
  }
  return {
    lastUpdatedBumped: lastUpdatedBumped === true,
    installLocationRewritten: false,
    phrase: "score cenotaph",
    note: "plaque re-polished; stone unmoved",
    synthetic: true,
  };
}

/**
 * Educational marketplace-update resolver. Not a Claude Code patch.
 * Published: update fails on the dead path instead of resolving from source.
 */
export function resolveMarketplaceUpdate({
  fromSource = false,
  fromInstallLocation = true,
  homed = false,
} = {}) {
  if (homed === true || fromSource === true) {
    return {
      resolvedFrom: "source",
      phrase: "admit homed",
      synthetic: true,
    };
  }
  const fails = fromInstallLocation === true;
  return {
    resolvedFrom: fails ? "installLocation" : "source",
    phrase: fails ? "score cenotaph" : "admit homed",
    note: fails
      ? "marketplace update opens the dead path"
      : "marketplace update resolves from source",
    synthetic: true,
  };
}

/**
 * Educational remove+add recovery. Not a Claude Code patch.
 * Published: remove also deletes the marketplace's plugins from enabledPlugins.
 */
export function recoverEnabledPlugins({
  removeAdd = true,
  pluginsStayEnabled = false,
  homed = false,
} = {}) {
  if (homed === true) {
    return {
      removeAddRequired: false,
      pluginsStayEnabled: true,
      phrase: "admit homed",
      synthetic: true,
    };
  }
  const cleared = removeAdd === true && pluginsStayEnabled !== true;
  return {
    removeAddRequired: removeAdd === true,
    pluginsStayEnabled: pluginsStayEnabled === true,
    phrase: cleared ? "score cenotaph" : "admit homed",
    note: cleared
      ? "remove then add is the only recovery; after recovering the plugin stays disabled"
      : "plugins stay enabled",
    synthetic: true,
  };
}

export function scoreDeadInstall(input = {}) {
  const homedHold = input.homed === true && input.cenotaph !== true;
  const stone = observeDeadInstall({
    installLocationMissing: !homedHold,
    homed: homedHold,
  });
  const cenotaph =
    !homedHold &&
    (input.cenotaph === true ||
      input.deadInstall === true ||
      input.cacheMiss === true ||
      input.lastUpdated === true ||
      input.marketplaceUpdate === true ||
      input.enabledCleared === true ||
      stone.installLocationMissing === true);
  return {
    homed: !cenotaph,
    cenotaph,
    deadInstall: cenotaph,
    stone,
    phrase: cenotaph ? "score cenotaph" : "admit homed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94452") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapCenotaph(input = {}) {
  const cenotaph = isCenotaphInput(input);
  const homed = input.homed === true && !cenotaph;
  return {
    stamp: cenotaph ? "dead-install" : "memorial-yard",
    holdingLane: cenotaph ? "carved-stone" : "memorial-yard",
    kindLane: cenotaph ? "dead-install" : "living-source",
    bindLane: cenotaph ? "bronze-plaque" : "settled",
    ribbon: cenotaph ? "cenotaph" : "homed",
    homed,
  };
}

export function inspectCacheMiss(input = {}) {
  const missed =
    input.cacheMiss === true ||
    input.cenotaph === true ||
    input.deadInstall === true ||
    isCenotaphInput(input);
  if (input.homed === true && !missed) {
    return { stamp: "settled", missed: false };
  }
  return {
    stamp: missed ? "cache-miss" : "cache-idle",
    missed,
    note: missed
      ? "cache-miss — claude plugin list shows cache-miss; no recovery guidance"
      : "",
  };
}

export function inspectLastUpdated(input = {}) {
  const flagged =
    input.lastUpdated === true ||
    input.cenotaph === true ||
    isCenotaphInput(input);
  if (input.homed === true && !flagged) {
    return { stamp: "repointed", flagged: false, note: "plaque and stone move together" };
  }
  return {
    stamp: flagged ? "last-updated" : "plaque-idle",
    flagged,
    note: flagged
      ? "last-updated — plaque re-polished every launch; stone unmoved"
      : "",
  };
}

export function inspectMarketplaceUpdate(input = {}) {
  const flagged =
    input.marketplaceUpdate === true ||
    input.cenotaph === true ||
    isCenotaphInput(input);
  if (input.homed === true && !flagged) {
    return { stamp: "relocated", flagged: false };
  }
  return {
    stamp: flagged ? "marketplace-update" : "update-idle",
    flagged,
    note: flagged
      ? "marketplace-update — update opens the dead path instead of source"
      : "",
  };
}

export function inspectRemoveAdd(input = {}) {
  const flagged =
    input.removeAdd === true ||
    input.cenotaph === true ||
    isCenotaphInput(input);
  if (input.homed === true && !flagged) {
    return { stamp: "living-source", flagged: false };
  }
  return {
    stamp: flagged ? "remove-add" : "recover-idle",
    flagged,
    note: flagged
      ? "remove-add — only recovery is remove then add"
      : "",
  };
}

export function inspectEnabledCleared(input = {}) {
  const flagged =
    input.enabledCleared === true ||
    input.cenotaph === true ||
    isCenotaphInput(input);
  if (input.homed === true && !flagged) {
    return { stamp: "repointed", flagged: false };
  }
  return {
    stamp: flagged ? "enabled-cleared" : "enabled-idle",
    flagged,
    note: flagged
      ? "enabled-cleared — remove deletes the marketplace's plugins from enabledPlugins"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "living-source": input.cenotaph || input.deadInstall,
    "carved-stone": input.cenotaph || input.deadInstall,
    "bronze-plaque": input.lastUpdated || input.deadInstall || input.cenotaph,
    "void-path": input.cacheMiss || input.cenotaph,
    "update-fail": input.marketplaceUpdate || input.cenotaph,
    "enabled-cleared": input.enabledCleared || input.removeAdd || input.cenotaph,
  };
  return (
    map[id] === true ||
    input.deadInstall === true ||
    input.cenotaph === true
  );
}

function isCenotaphInput(input = {}) {
  return (
    input.cenotaph === true ||
    input.deadInstall === true ||
    input.cacheMiss === true ||
    input.lastUpdated === true ||
    input.marketplaceUpdate === true ||
    input.removeAdd === true ||
    input.enabledCleared === true
  );
}

export function readBooth(input = {}) {
  const cenotaph = isCenotaphInput(input);
  const homed = input.homed === true && !cenotaph;
  return {
    mark: cenotaph ? "cenotaph" : "homed",
    homed,
    cenotaph,
    deadInstall: input.deadInstall === true || cenotaph,
    cacheMiss: input.cacheMiss === true,
    lastUpdated: input.lastUpdated === true,
    marketplaceUpdate: input.marketplaceUpdate === true,
    removeAdd: input.removeAdd === true,
    enabledCleared: input.enabledCleared === true,
    post: mapCenotaph(input),
    cache: inspectCacheMiss(input),
    plaque: inspectLastUpdated(input),
    update: inspectMarketplaceUpdate(input),
    recover: inspectRemoveAdd(input),
    enabled: inspectEnabledCleared(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const CENOTAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "memorial-yard",
    homed: true,
    cenotaph: false,
    cue: "homed",
    note: "idle HOLD: rewrite installLocation to live source.path when ENOENT on re-fetch",
  },
  {
    t: "dead-install",
    event: "dead-install",
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
    lastUpdated: true,
    cue: "cenotaph",
    note: "installLocation is ENOENT; source.path still stands; lastUpdated bumped",
  },
  {
    t: "path",
    event: "dead-install",
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
    lastUpdated: true,
    marketplaceUpdate: true,
    removeAdd: true,
    enabledCleared: true,
    cue: "cenotaph",
    note: "dead-install — stone points at the empty grave; marketplace update fails on it",
  },
  {
    t: "score",
    event: "cenotaph",
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
    lastUpdated: true,
    marketplaceUpdate: true,
    removeAdd: true,
    enabledCleared: true,
    cue: "cenotaph",
    note: "cenotaph — the stone is never moved to the living source",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "memorial-yard",
    homed: true,
    cenotaph: false,
    cue: "homed",
    note: "positive control: rewrite installLocation to live source.path",
  },
  {
    t: "admit",
    event: "memorial-yard",
    homed: true,
    cue: "homed",
    note: "positive control: the yard admits homed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    homed: true,
    cenotaph: false,
    deadInstall: false,
    cue: "homed",
  };
}

export function seedHomed() {
  return { ...emptyTicket() };
}

export function seedCenotaph() {
  return {
    seed: SEEDED_WORD,
    homed: false,
    cenotaph: true,
    deadInstall: true,
    cacheMiss: true,
    lastUpdated: true,
    marketplaceUpdate: true,
    removeAdd: true,
    enabledCleared: true,
    cue: "cenotaph",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_CENOTAPH_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    cenotaph: true,
    deadInstall: true,
    cue: "cenotaph",
  };
}

export function seedDeadInstall() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    cenotaph: true,
    deadInstall: true,
    event: "dead-install",
    cue: "cenotaph",
  };
}

export function seedRepointed() {
  return { seed: "repointed", preferSeed: true, homed: true, cue: "homed" };
}

export function seedRelocated() {
  return { seed: "relocated", preferSeed: true, homed: true, cue: "homed" };
}

export function seedSettled() {
  return { seed: "settled", preferSeed: true, homed: true, cue: "homed" };
}

export function seedCacheMiss() {
  return {
    seed: "cache-miss",
    preferSeed: true,
    cacheMiss: true,
    cue: "cenotaph",
  };
}

export function seedLastUpdated() {
  return {
    seed: "last-updated",
    preferSeed: true,
    lastUpdated: true,
    cue: "cenotaph",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      homed: false,
      cenotaph: false,
      deadInstall: false,
      cacheMiss: false,
      lastUpdated: false,
      marketplaceUpdate: false,
      removeAdd: false,
      enabledCleared: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    homed: raw.homed === true,
    cenotaph: raw.cenotaph === true || raw.event === "cenotaph",
    deadInstall: raw.deadInstall === true || raw.event === "dead-install",
    cacheMiss: raw.cacheMiss === true || raw.event === "cache-miss",
    lastUpdated: raw.lastUpdated === true || raw.event === "last-updated",
    marketplaceUpdate: raw.marketplaceUpdate === true || raw.event === "marketplace-update",
    removeAdd: raw.removeAdd === true || raw.event === "remove-add",
    enabledCleared: raw.enabledCleared === true || raw.event === "enabled-cleared",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.homed != null ||
        ticket.cenotaph != null ||
        ticket.deadInstall != null ||
        ticket.cacheMiss != null ||
        ticket.lastUpdated != null ||
        ticket.marketplaceUpdate != null ||
        ticket.removeAdd != null ||
        ticket.enabledCleared != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isHomed(row) {
  if (row.cenotaph && row.cue !== "homed") return false;
  if (row.cue === "cenotaph" || row.cue === "dead-install") return false;
  if (
    row.deadInstall &&
    row.cacheMiss &&
    row.cue !== "homed" &&
    row.homed !== true
  ) {
    return false;
  }
  if (
    row.homed === true &&
    row.cenotaph !== true &&
    row.cue !== "cenotaph"
  ) {
    return true;
  }
  if (
    row.cue === "homed" &&
    row.cenotaph !== true &&
    row.deadInstall !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isDeadInstall(row) {
  return (
    row.event === "dead-install" &&
    !isHomed(row) &&
    (row.deadInstall === true ||
      row.cacheMiss === true ||
      row.cenotaph === true)
  );
}

function isCenotaphRow(row) {
  if (isHomed(row)) return false;
  if (isDeadInstall(row) && row.cue !== "cenotaph") return false;
  if (row.cue === "cenotaph") return true;
  if (row.cenotaph === true) return true;
  if (row.deadInstall === true && row.cacheMiss === true) return true;
  if (
    row.deadInstall === true ||
    row.cacheMiss === true ||
    row.lastUpdated === true ||
    row.marketplaceUpdate === true ||
    row.removeAdd === true ||
    row.enabledCleared === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cenotaph pass against the memorial yard.
 * homed: rewrite installLocation to live source.path when ENOENT.
 * cenotaph: stone points at a dead path; plaque is polished.
 * dead-install: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDeadInstall(row) ||
    (row.deadInstall && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "dead-install";
  } else if (isCenotaphRow(row)) {
    verdict = "cenotaph";
  } else if (isHomed(row)) {
    verdict = "homed";
  } else if (
    row.deadInstall ||
    row.cacheMiss ||
    row.lastUpdated ||
    row.marketplaceUpdate ||
    row.removeAdd ||
    row.enabledCleared
  ) {
    verdict = "cenotaph";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "cenotaph";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    homed: verdict === "homed",
    cenotaph: verdict === "cenotaph" || verdict === SEEDED_WORD,
    deadInstall:
      row.deadInstall === true ||
      verdict === "dead-install" ||
      verdict === PATH_WORD,
    cacheMiss: row.cacheMiss,
    lastUpdated: row.lastUpdated,
    marketplaceUpdate: row.marketplaceUpdate,
    removeAdd: row.removeAdd,
    enabledCleared: row.enabledCleared,
    cue: hold
      ? "homed"
      : row.deadInstall || verdict === "dead-install"
        ? "dead-install"
        : "cenotaph",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit homed" : "score cenotaph",
    cacheInspect: inspectCacheMiss(row),
    plaqueInspect: inspectLastUpdated(row),
    updateInspect: inspectMarketplaceUpdate(row),
    recoverInspect: inspectRemoveAdd(row),
    enabledInspect: inspectEnabledCleared(row),
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
      : CENOTAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "cenotaph");
  const path = scored.filter((row) => row.verdict === "dead-install");
  const homed = scored.filter((row) => row.verdict === "homed");
  const headline =
    scored.find((row) => row.event === "cenotaph") ||
    scored.find((row) => row.event === "dead-install") ||
    scored.find((row) => row.event === "cache-miss") ||
    charged[charged.length - 1];
  let verdict = "homed";
  if (charged.length) verdict = "cenotaph";
  else if (path.length && !homed.length) {
    verdict = "dead-install";
  }
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
    cenotaphCount: charged.length,
    pathCount: path.length,
    homedCount: homed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit homed" : "score cenotaph",
    note: headline
      ? "A directory marketplace whose recorded installLocation no longer exists never loads again: every launch re-fetches from source but keeps the dead path, and claude plugin marketplace update fails on it. Cite-only cousins #94451 #82272 #36575 #94516."
      : "published cenotaph walk scored against homed vs cenotaph",
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
    seeded !== "homed" &&
    seeded !== "cenotaph" &&
    seeded !== "dead-install" &&
    ticket.homed == null &&
    ticket.cenotaph == null &&
    ticket.deadInstall == null &&
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
    homed: scored.homed ?? false,
    cenotaph: scored.cenotaph ?? false,
    deadInstall: scored.deadInstall ?? false,
    cacheMiss: scored.cacheMiss ?? false,
    lastUpdated: scored.lastUpdated ?? false,
    marketplaceUpdate: scored.marketplaceUpdate ?? false,
    removeAdd: scored.removeAdd ?? false,
    enabledCleared: scored.enabledCleared ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.deadInstall || result.cenotaph
      ? "kind=dead-install"
      : "kind=living-source",
    result.cacheMiss || result.cenotaph
      ? "ref=cache-miss"
      : "ref=memorial-yard",
    result.deadInstall || result.verdict === "dead-install"
      ? "path=dead-install"
      : "path=homed",
    result.cue === "homed"
      ? "cue=homed"
      : result.cue === "dead-install"
        ? "cue=dead-install"
        : "cue=cenotaph",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    homed: result.homed,
    cenotaph: result.cenotaph,
    deadInstall: result.deadInstall,
    cacheMiss: result.cacheMiss,
    lastUpdated: result.lastUpdated,
    marketplaceUpdate: result.marketplaceUpdate,
    removeAdd: result.removeAdd,
    enabledCleared: result.enabledCleared,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cache: inspectCacheMiss({
      homed: result.homed,
      cenotaph: result.cenotaph,
      cacheMiss: result.cacheMiss,
    }),
    plaque: inspectLastUpdated({
      homed: result.homed,
      cenotaph: result.cenotaph,
      lastUpdated: result.lastUpdated,
    }),
    update: inspectMarketplaceUpdate({
      homed: result.homed,
      cenotaph: result.cenotaph,
      marketplaceUpdate: result.marketplaceUpdate,
    }),
    recover: inspectRemoveAdd({
      homed: result.homed,
      cenotaph: result.cenotaph,
      removeAdd: result.removeAdd,
    }),
    enabled: inspectEnabledCleared({
      homed: result.homed,
      cenotaph: result.cenotaph,
      enabledCleared: result.enabledCleared,
    }),
    post: mapCenotaph({
      homed: result.homed,
      cenotaph: result.cenotaph,
      deadInstall: result.deadInstall,
      cacheMiss: result.cacheMiss,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      cenotaph: result.cenotaph === true || result.verdict === "cenotaph",
    })),
    leakPath: scoreDeadInstall({
      homed: result.homed === true && !result.cenotaph,
      cenotaph: result.cenotaph,
      deadInstall: result.deadInstall,
      cacheMiss: result.cacheMiss,
      lastUpdated: result.lastUpdated,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): when a directory marketplace's recorded installLocation is ENOENT, the re-fetch path bumps lastUpdated but never rewrites installLocation from live source.path, so every launch misses the same way and marketplace update also opens the dead path. Invite verify against #94452 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
