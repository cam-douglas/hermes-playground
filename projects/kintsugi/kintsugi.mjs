#!/usr/bin/env node
/**
 * Kintsugi — urushi lacquer / gold seam / broken ceramic /
 * kiln / repair-bench booth.
 * *Kintsugi* is the Japanese craft of repairing broken pottery
 * with lacquer and gold. Claude Code already attempts a rebuild
 * (treat-as-empty + reinstall), but every write still presses
 * the unbroken crack — the writer re-reads the corrupt vessel
 * and aborts — so the gold never sets. One hairline fracture
 * (missing `lastUpdated`) shatters the whole cupboard of
 * marketplaces. NOT Cenotaph marble memorial. NOT Stratum
 * geology cores. NOT Tmesis parchment. NOT Vedette cavalry
 * lantern. NOT Orloj Prague clock. NOT Brisure herald college.
 * NOT Diptych wax-tablet. NOT Vizard masque-ball. NOT Treacle
 * kettle. NOT Somnus sleep clinic. NOT Cresset fire-basket.
 * NOT Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Stereotype foundry. NOT
 * Cachet wax-seal.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: `known_marketplaces.json` is never repaired once
 * invalid. One entry missing `lastUpdated` (or a JSON parse
 * error) disables plugins from every marketplace. The
 * reconciler, `marketplace add`, and `marketplace remove`
 * all fail re-reading it. A *missing* file heals; an
 * *invalid* file does not. Only recovery today: delete the
 * file by hand.
 *
 * Encoded from anthropics/claude-code#94451 issue text only.
 * Hypothesis (NON-BINDING — issue text): when
 * `known_marketplaces.json` is invalid, the reconciler treats
 * it as empty and schedules reinstalls, but the install/write
 * path re-reads and re-validates the same invalid file and
 * aborts, so repair never lands; per-entry validate or
 * quarantine+rebuild aside would heal. Invite verify against
 * #94451 text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a Claude Code
 * fix. No network. No exploits. No live Claude.
 *
 *   node kintsugi.mjs data/kintsugi.json
 *   echo '{"seed":"kintsugi"}' | node kintsugi.mjs
 *
 * Idle word is mended (HOLD: false promise that the repair
 * landed — quarantine+rebuild or per-entry validate).
 * HOLD aliases: healed, gilded, fused.
 * Seeded word is kintsugi (#94451 path).
 * Path word is heal-abort.
 * Product score word is kintsugi (Score kintsugi or admit mended.).
 *
 * NOT #94452 (directory marketplace dead installLocation).
 * NOT #84501 (UTF-8 BOM trigger). NOT #19065 (zero-byte hang).
 * NOT #56967 (trailing comma writer). NOT #94516 (marketplace
 * refresh stale/unmerged content).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "mended",
  "kintsugi",
  "heal-abort",
  "healed",
  "gilded",
  "fused",
  "lastUpdated-missing",
  "parse-error",
  "treat-as-empty",
  "rewrite-abort",
  "marketplace-remove",
  "marketplace-add",
  "plugin-list-lie",
  "94451",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "mended";
export const PATH_WORD = "heal-abort";
export const SEEDED_WORD = "kintsugi";
export const PRODUCT_WORD = "kintsugi";
export const HOLD = Object.freeze(["mended"]);
export const HOLD_ALIASES = Object.freeze(["healed", "gilded", "fused"]);
export const RECOVER = Object.freeze(["mended"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "homed",
  "shared",
  "contiguous",
  "stationed",
  "lasting",
  "enrolled",
  "cleared",
  "repointed",
  "relocated",
  "settled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
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
  "dead-install",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "cenotaph",
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
  "dead-install",
]);

export const FEATURED_ISSUE = 94451;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94451";
export const TITLE =
  "[BUG] known_marketplaces.json is never repaired once invalid: one entry missing lastUpdated (or a parse error) disables plugins from every marketplace, and the reconciler, marketplace add and marketplace remove all fail re-reading it";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "platform:wsl",
  "area:plugins",
]);
export const PLATFORM = "linux/wsl";
export const SURFACE = "heal-abort";
export const HOST =
  "Claude Code 2.1.272; isolated config dir; no login needed (plugin loading and the reconciler run before the auth check)";
export const CHECKED_ON =
  "Published report: known_marketplaces.json invalid (one entry missing lastUpdated, or a truncated parse-error file); reconciler treats as empty and schedules reinstalls; every install write re-reads the same invalid file and aborts; marketplace add/remove fail the same way; plugin list still reports ✔ enabled while every launch loads zero";
export const BUILD = "Claude Code 2.1.272";
export const SELECTED_MODEL =
  "Failure happens before any model call — not a model defect";
export const OS = "Ubuntu/Debian Linux (WSL2); bash non-interactive";
export const PHRASE = "Score kintsugi or admit mended.";
export const DISTRIBUTION =
  "Claude Code 2.1.272; isolated config dir repro; no login needed (plugin loading and the reconciler run before the auth check). known_marketplaces.json goes invalid through one entry missing lastUpdated (whole-file schema reject: Marketplace configuration file is corrupted: mkt-a.lastUpdated: Invalid input) or a truncated JSON parse error (Unterminated string). Reconciler logs failed to load known_marketplaces.json, treating as empty and tries to reinstall each marketplace declared in extraKnownMarketplaces. Every install fails because the write path re-reads and re-validates the same invalid file and aborts. Installing valid mkt-b fails with mkt-a's error. claude plugin marketplace remove and marketplace add fail with the same error. claude plugin list reports both plugins ✔ enabled while every launch loads zero (Registered 0 hooks from 0 plugins). A missing file heals: delete it by hand, first launch rebuilds, second loads both plugins. An invalid file does not. Cases 1 and 2 print the same thing on every further launch; the file is never rewritten.";

export const CODE_BUILD = "2.1.272";
export const MARKETPLACE_A = "mkt-a";
export const MARKETPLACE_B = "mkt-b";
export const CONFIG_FILE = "known_marketplaces.json";
export const TREAT_AS_EMPTY_LINE =
  "failed to load known_marketplaces.json, treating as empty";
export const CORRUPT_LINE =
  "Marketplace configuration file is corrupted: mkt-a.lastUpdated: Invalid input";
export const PARSE_LINE =
  "Failed to load marketplace configuration: JSON Parse error: Unterminated string";
export const LIST_LIE_LINE = "Status: ✔ enabled";
export const ZERO_LOAD_LINE = "Registered 0 hooks from 0 plugins";

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_MENDED = Object.freeze({
  kind: "mended",
  fileValid: true,
  lastUpdatedPresent: true,
  parseOk: true,
  rewriteAborted: false,
  note: "gold set — quarantine+rebuild or per-entry validate landed",
  synthetic: true,
});
export const SYNTHETIC_KINTSUGI = Object.freeze({
  kind: "kintsugi",
  fileValid: false,
  lastUpdatedPresent: false,
  parseOk: true,
  rewriteAborted: true,
  note: "gold never sets — writer re-reads the corrupt vessel and aborts",
  synthetic: true,
});
export const SYNTHETIC_HEAL_ABORT = Object.freeze({
  kind: "heal-abort",
  rows: [
    { lane: "known_marketplaces.json", block: "invalid", live: false, note: "one entry missing lastUpdated or parse error" },
    { lane: "reconciler", block: TREAT_AS_EMPTY_LINE, live: false, note: "treats as empty; schedules reinstalls" },
    { lane: "extraKnownMarketplaces", block: "mkt-a(install), mkt-b(install)", live: false, note: "both scheduled" },
    { lane: "install write", block: "re-read abort", live: false, note: "writer re-validates the same invalid file" },
    { lane: "plugin list", block: LIST_LIE_LINE, live: false, note: "reports enabled while launch loads zero" },
    { lane: "control missing file", block: "heals", live: true, note: "delete by hand; next launch rebuilds" },
  ],
  note: "six-row evidence: cracked vessel; gold never sets; heal-abort",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "known_marketplaces.json",
    role: "vessel",
    content: "invalid — mkt-a.lastUpdated missing or truncated parse error",
    live: false,
    cracked: true,
  },
  {
    lane: "reconciler",
    role: "lacquer",
    content: TREAT_AS_EMPTY_LINE,
    live: false,
    cracked: true,
  },
  {
    lane: "extraKnownMarketplaces",
    role: "kiln",
    content: "mkt-a(install), mkt-b(install)",
    live: false,
    cracked: true,
  },
  {
    lane: "install write",
    role: "gold",
    content: "re-reads the same invalid file and aborts",
    live: false,
    cracked: true,
    aborted: true,
  },
  {
    lane: "plugin list",
    role: "lie",
    content: "✔ enabled while Registered 0 hooks from 0 plugins",
    live: false,
    cracked: true,
  },
  {
    lane: "missing-file control",
    role: "heal",
    content: "delete the file; first launch rebuilds; second loads both plugins",
    live: true,
    cracked: false,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "cracked-vessel",
    lost: "Cracked vessel — known_marketplaces.json is invalid; one missing lastUpdated rejects the whole cupboard",
    control: "A mended vessel would validate per entry or quarantine the crack",
    story: "one hairline fracture shatters every marketplace",
  },
  {
    id: "gold-seam",
    lost: "Gold seam — the reconciler already decided to treat the file as empty",
    control: "the writer would agree and let the rebuild land",
    story: "lacquer is mixed; the gold is never pressed into the crack",
  },
  {
    id: "kiln-bench",
    lost: "Kiln bench — extraKnownMarketplaces schedules mkt-a and mkt-b reinstalls",
    control: "each install would write a fresh vessel",
    story: "the kiln is lit; every pot comes out still cracked",
  },
  {
    id: "treat-as-empty",
    lost: "Treat-as-empty — failed to load known_marketplaces.json, treating as empty",
    control: "treat-as-empty would move the corrupt file aside",
    story: "the bench pretends the cupboard is bare, then opens the same cracked bowl",
  },
  {
    id: "rewrite-abort",
    lost: "Rewrite-abort — install write re-reads and re-validates the same invalid file",
    control: "the writer would skip the invalid file and rebuild",
    story: "every write presses the unbroken crack",
  },
  {
    id: "plugin-list-lie",
    lost: "Plugin-list-lie — claude plugin list reports ✔ enabled while every launch loads zero",
    control: "list would match what the launch actually loaded",
    story: "the cupboard label still says full; the kiln is empty",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "cracked-vessel",
    survey: "mended HOLD: quarantine+rebuild or per-entry validate so the gold can set",
    kind: "mended",
    note: "idle/control: the repair Claude Code already attempts should land",
  },
  {
    id: "gold-seam",
    survey: "one entry missing lastUpdated rejects the whole file; installing valid mkt-b fails with mkt-a's error",
    kind: "kintsugi",
    note: "seeded: gold never sets",
  },
  {
    id: "kiln-bench",
    survey: "truncated/parse-error file → same reconciler sequence",
    kind: "kintsugi",
    note: "seeded: two triggers, same outcome",
  },
  {
    id: "treat-as-empty",
    survey: "reconciler logs failed to load known_marketplaces.json, treating as empty",
    kind: "kintsugi",
    note: "seeded: treat-as-empty then reinstall",
  },
  {
    id: "rewrite-abort",
    survey: "install write re-reads and re-validates the same invalid file and aborts",
    kind: "kintsugi",
    note: "seeded: the writer is the only part that disagrees",
  },
  {
    id: "plugin-list-lie",
    survey: "heal-abort — plugin list reports ✔ enabled; marketplace add and remove fail; only delete-by-hand heals",
    kind: "kintsugi",
    note: "path: heal-abort names the gold that never sets",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "lastUpdated-missing",
    label: "lastUpdated-missing",
    count: "schema",
    note: "one entry missing lastUpdated → whole-file schema reject",
  },
  {
    id: "parse-error",
    label: "parse-error",
    count: "JSON",
    note: "truncated file: JSON Parse error: Unterminated string",
  },
  {
    id: "treat-as-empty",
    label: "treat-as-empty",
    count: "reconciler",
    note: "failed to load known_marketplaces.json, treating as empty",
  },
  {
    id: "rewrite-abort",
    label: "rewrite-abort",
    count: "writer",
    note: "install write re-reads the same invalid file and aborts",
  },
  {
    id: "heal-abort",
    label: "heal-abort",
    count: "repair",
    note: "rebuild is attempted; the gold never sets",
  },
  {
    id: "plugin-list-lie",
    label: "plugin-list-lie",
    count: "list",
    note: "plugin list reports ✔ enabled while every launch loads zero",
  },
]);

export const RULED_OUT = Object.freeze([
  " #94452 — directory marketplace dead installLocation ENOENT while source.path lives — DIFFERENT; cite only",
  " #84501 — UTF-8 BOM trigger; asks to tolerate it on read and warn at startup — DIFFERENT; cite only",
  " #19065 — zero-byte / empty-file hang — DIFFERENT; cite only",
  " #56967 — trailing comma written by /plugin marketplace add — DIFFERENT; cite only",
  " #94516 — marketplace refresh can install unmerged/stale content without signal — DIFFERENT; cite only",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
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
]);

export const EXPECTED = Object.freeze([
  "Validate per entry — skip or quarantine an entry that fails the schema and keep loading the rest",
  "When the file cannot be loaded at all, move it aside (known_marketplaces.json.corrupt-<timestamp>) and rebuild from extraKnownMarketplaces",
  "claude plugin marketplace remove should work on an invalid file",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Per-entry validate or quarantine+rebuild aside so the reconciler's treat-as-empty rebuild can land",
  "marketplace add and marketplace remove should not re-read an invalid file and abort",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "heal-abort",
  "kintsugi",
  "treat-as-empty",
  "rewrite-abort",
  "lastUpdated-missing",
  "plugin-list-lie",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84501,
    title: "UTF-8 BOM trigger; asks to tolerate it on read and warn at startup",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #84501 is a BOM route into an invalid file. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 19065,
    title: "zero-byte / empty-file hang",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #19065 is a zero-byte hang route. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 56967,
    title: "trailing comma written by /plugin marketplace add",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #56967 is a trailing-comma writer route. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94516,
    title: "marketplace refresh can install unmerged/stale content without signal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94516 is stale refresh content. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94452,
    title: "directory marketplace dead installLocation ENOENT while source.path lives",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94452 / Cenotaph is a dead installLocation never rewritten. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
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
  { issue: 94547, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94546, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94530, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "cenotaph",
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

export const SAMPLE_KIND_IDLE = "cracked-vessel";
export const SAMPLE_KIND_SEEDED = "heal-abort";
export const SAMPLE_HOLDING_IDLE = "repair-bench";
export const SAMPLE_HOLDING_SEEDED = "gold-seam";

export const SAMPLE_MENDED_PROOF = Object.freeze({
  mended: true,
  kintsugi: false,
  healAbort: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_KINTSUGI_PROOF = Object.freeze({
  mended: false,
  kintsugi: true,
  healAbort: true,
  lastUpdatedMissing: true,
  parseError: true,
  treatAsEmpty: true,
  rewriteAbort: true,
  marketplaceRemove: true,
  marketplaceAdd: true,
  pluginListLie: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  mendedWatch: { ...SYNTHETIC_MENDED },
  kintsugiWatch: { ...SYNTHETIC_KINTSUGI },
  healAbortShape: { ...SYNTHETIC_HEAL_ABORT },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds mended: quarantine+rebuild or per-entry validate so the gold can set" },
  { t: "heal-abort", line: "file is invalid; reconciler treats as empty; writer re-reads and aborts" },
  { t: "path", line: "heal-abort — gold never sets; marketplace add and remove fail" },
  { t: "score", line: "when the gold never sets the booth is kintsugi — Score kintsugi or admit mended." },
]);

const FORCE_FLAGS = [
  "healAbort",
  "lastUpdatedMissing",
  "parseError",
  "treatAsEmpty",
  "rewriteAbort",
  "marketplaceRemove",
  "marketplaceAdd",
  "pluginListLie",
];

const ISSUE_CUE_RE =
  /94451|known_marketplaces|lastUpdated|treating as empty|extraKnownMarketplaces|mkt-a|mkt-b|Unterminated string|plugin list|marketplace remove|marketplace add/i;

/**
 * Educational heal-abort observer. Not a Claude Code patch.
 * Encodes only the published #94451 shapes.
 *
 * A missing file heals. An invalid file does not.
 */
export function observeHealAbort({
  fileInvalid = true,
  missingFile = false,
  mended = false,
} = {}) {
  if (mended === true || missingFile === true) {
    return {
      fileInvalid: false,
      missingFile: missingFile === true,
      repaired: true,
      phrase: "admit mended",
      synthetic: true,
    };
  }
  return {
    fileInvalid: fileInvalid === true,
    missingFile: false,
    repaired: false,
    phrase: fileInvalid ? "score kintsugi" : "admit mended",
    note: fileInvalid
      ? "invalid file is never repaired; writer re-reads and aborts"
      : "vessel is valid",
    synthetic: true,
  };
}

/**
 * Educational known_marketplaces repair. Not a Claude Code patch.
 * HOLD: quarantine+rebuild or per-entry validate.
 */
export function repairKnownMarketplaces({
  invalid = true,
  quarantine = false,
  perEntry = false,
  mended = false,
} = {}) {
  if (mended === true || quarantine === true || perEntry === true) {
    return {
      repaired: true,
      phrase: "admit mended",
      note: "gold set — corrupt vessel moved aside or crack quarantined",
      synthetic: true,
    };
  }
  const stuck = invalid === true;
  return {
    repaired: !stuck,
    phrase: stuck ? "score kintsugi" : "admit mended",
    note: stuck
      ? "repair never lands; writer re-reads the same invalid file"
      : "vessel valid",
    synthetic: true,
  };
}

/**
 * Educational treat-as-empty observer. Not a Claude Code patch.
 * Published: reconciler treats the file as empty then reinstalls.
 */
export function treatAsEmptyFile({
  treatAsEmpty = true,
  rebuildLands = false,
  mended = false,
} = {}) {
  if (mended === true || rebuildLands === true) {
    return {
      treatAsEmpty: true,
      rebuildLands: true,
      phrase: "admit mended",
      synthetic: true,
    };
  }
  return {
    treatAsEmpty: treatAsEmpty === true,
    rebuildLands: false,
    phrase: "score kintsugi",
    note: "treat-as-empty is logged; the rebuild never lands",
    synthetic: true,
  };
}

/**
 * Educational rewrite-abort observer. Not a Claude Code patch.
 * Published: install write re-reads and re-validates the same invalid file.
 */
export function rewriteAbortWrite({
  rereadInvalid = true,
  abort = true,
  mended = false,
} = {}) {
  if (mended === true) {
    return {
      rereadInvalid: false,
      abort: false,
      phrase: "admit mended",
      synthetic: true,
    };
  }
  const fails = rereadInvalid === true && abort === true;
  return {
    rereadInvalid: rereadInvalid === true,
    abort: abort === true,
    phrase: fails ? "score kintsugi" : "admit mended",
    note: fails
      ? "writer re-reads the corrupt vessel and aborts"
      : "writer skips the invalid file",
    synthetic: true,
  };
}

/**
 * Educational plugin-list lie. Not a Claude Code patch.
 * Published: list reports ✔ enabled while every launch loads zero.
 */
export function inspectPluginListLie({
  listEnabled = true,
  launchLoadsZero = true,
  mended = false,
} = {}) {
  if (mended === true) {
    return {
      listEnabled: true,
      launchLoadsZero: false,
      lie: false,
      phrase: "admit mended",
      synthetic: true,
    };
  }
  const lie = listEnabled === true && launchLoadsZero === true;
  return {
    listEnabled: listEnabled === true,
    launchLoadsZero: launchLoadsZero === true,
    lie,
    phrase: lie ? "score kintsugi" : "admit mended",
    note: lie
      ? "plugin list reports ✔ enabled while Registered 0 hooks from 0 plugins"
      : "list matches launch",
    synthetic: true,
  };
}

export function scoreHealAbort(input = {}) {
  const mendedHold = input.mended === true && input.kintsugi !== true;
  const vessel = observeHealAbort({
    fileInvalid: !mendedHold,
    mended: mendedHold,
  });
  const kintsugi =
    !mendedHold &&
    (input.kintsugi === true ||
      input.healAbort === true ||
      input.lastUpdatedMissing === true ||
      input.parseError === true ||
      input.treatAsEmpty === true ||
      input.rewriteAbort === true ||
      input.pluginListLie === true ||
      vessel.fileInvalid === true);
  return {
    mended: !kintsugi,
    kintsugi,
    healAbort: kintsugi,
    vessel,
    phrase: kintsugi ? "score kintsugi" : "admit mended",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94451") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapKintsugi(input = {}) {
  const kintsugi = isKintsugiInput(input);
  const mended = input.mended === true && !kintsugi;
  return {
    stamp: kintsugi ? "heal-abort" : "repair-bench",
    holdingLane: kintsugi ? "gold-seam" : "repair-bench",
    kindLane: kintsugi ? "heal-abort" : "cracked-vessel",
    bindLane: kintsugi ? "rewrite-abort" : "fused",
    ribbon: kintsugi ? "kintsugi" : "mended",
    mended,
  };
}

export function inspectLastUpdatedMissing(input = {}) {
  const flagged =
    input.lastUpdatedMissing === true ||
    input.kintsugi === true ||
    isKintsugiInput(input);
  if (input.mended === true && !flagged) {
    return { stamp: "healed", flagged: false, note: "per-entry validate keeps the rest" };
  }
  return {
    stamp: flagged ? "lastUpdated-missing" : "schema-idle",
    flagged,
    note: flagged
      ? "lastUpdated-missing — one entry rejects the whole file"
      : "",
  };
}

export function inspectParseError(input = {}) {
  const missed =
    input.parseError === true ||
    input.kintsugi === true ||
    input.healAbort === true ||
    isKintsugiInput(input);
  if (input.mended === true && !missed) {
    return { stamp: "fused", missed: false };
  }
  return {
    stamp: missed ? "parse-error" : "parse-idle",
    missed,
    note: missed
      ? "parse-error — truncated file; JSON Parse error: Unterminated string"
      : "",
  };
}

export function inspectTreatAsEmpty(input = {}) {
  const flagged =
    input.treatAsEmpty === true ||
    input.kintsugi === true ||
    isKintsugiInput(input);
  if (input.mended === true && !flagged) {
    return { stamp: "gilded", flagged: false };
  }
  return {
    stamp: flagged ? "treat-as-empty" : "reconcile-idle",
    flagged,
    note: flagged
      ? "treat-as-empty — reconciler logs treating as empty; rebuild never lands"
      : "",
  };
}

export function inspectRewriteAbort(input = {}) {
  const flagged =
    input.rewriteAbort === true ||
    input.kintsugi === true ||
    isKintsugiInput(input);
  if (input.mended === true && !flagged) {
    return { stamp: "cracked-vessel", flagged: false };
  }
  return {
    stamp: flagged ? "rewrite-abort" : "write-idle",
    flagged,
    note: flagged
      ? "rewrite-abort — writer re-reads the same invalid file and aborts"
      : "",
  };
}

export function inspectMarketplaceCli(input = {}) {
  const flagged =
    input.marketplaceRemove === true ||
    input.marketplaceAdd === true ||
    input.kintsugi === true ||
    isKintsugiInput(input);
  if (input.mended === true && !flagged) {
    return { stamp: "healed", flagged: false };
  }
  return {
    stamp: flagged ? "marketplace-remove" : "cli-idle",
    flagged,
    note: flagged
      ? "marketplace add and remove fail re-reading the same invalid file"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "cracked-vessel": input.kintsugi || input.healAbort,
    "gold-seam": input.kintsugi || input.healAbort || input.lastUpdatedMissing,
    "kiln-bench": input.parseError || input.kintsugi,
    "treat-as-empty": input.treatAsEmpty || input.kintsugi,
    "rewrite-abort": input.rewriteAbort || input.kintsugi,
    "plugin-list-lie": input.pluginListLie || input.marketplaceRemove || input.kintsugi,
  };
  return (
    map[id] === true ||
    input.healAbort === true ||
    input.kintsugi === true
  );
}

function isKintsugiInput(input = {}) {
  return (
    input.kintsugi === true ||
    input.healAbort === true ||
    input.lastUpdatedMissing === true ||
    input.parseError === true ||
    input.treatAsEmpty === true ||
    input.rewriteAbort === true ||
    input.marketplaceRemove === true ||
    input.marketplaceAdd === true ||
    input.pluginListLie === true
  );
}

export function readBooth(input = {}) {
  const kintsugi = isKintsugiInput(input);
  const mended = input.mended === true && !kintsugi;
  return {
    mark: kintsugi ? "kintsugi" : "mended",
    mended,
    kintsugi,
    healAbort: input.healAbort === true || kintsugi,
    lastUpdatedMissing: input.lastUpdatedMissing === true,
    parseError: input.parseError === true,
    treatAsEmpty: input.treatAsEmpty === true,
    rewriteAbort: input.rewriteAbort === true,
    marketplaceRemove: input.marketplaceRemove === true,
    marketplaceAdd: input.marketplaceAdd === true,
    pluginListLie: input.pluginListLie === true,
    post: mapKintsugi(input),
    lastUpdated: inspectLastUpdatedMissing(input),
    parse: inspectParseError(input),
    empty: inspectTreatAsEmpty(input),
    rewrite: inspectRewriteAbort(input),
    cli: inspectMarketplaceCli(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const KINTSUGI_WALK = Object.freeze([
  {
    t: "idle",
    event: "repair-bench",
    mended: true,
    kintsugi: false,
    cue: "mended",
    note: "idle HOLD: quarantine+rebuild or per-entry validate so the gold can set",
  },
  {
    t: "heal-abort",
    event: "heal-abort",
    kintsugi: true,
    healAbort: true,
    lastUpdatedMissing: true,
    treatAsEmpty: true,
    cue: "kintsugi",
    note: "file is invalid; reconciler treats as empty; writer re-reads and aborts",
  },
  {
    t: "path",
    event: "heal-abort",
    kintsugi: true,
    healAbort: true,
    lastUpdatedMissing: true,
    parseError: true,
    treatAsEmpty: true,
    rewriteAbort: true,
    marketplaceRemove: true,
    marketplaceAdd: true,
    pluginListLie: true,
    cue: "kintsugi",
    note: "heal-abort — gold never sets; marketplace add and remove fail",
  },
  {
    t: "score",
    event: "kintsugi",
    kintsugi: true,
    healAbort: true,
    lastUpdatedMissing: true,
    parseError: true,
    treatAsEmpty: true,
    rewriteAbort: true,
    marketplaceRemove: true,
    marketplaceAdd: true,
    pluginListLie: true,
    cue: "kintsugi",
    note: "kintsugi — the gold never sets; the writer presses the unbroken crack",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "repair-bench",
    mended: true,
    kintsugi: false,
    cue: "mended",
    note: "positive control: quarantine+rebuild or per-entry validate",
  },
  {
    t: "admit",
    event: "repair-bench",
    mended: true,
    cue: "mended",
    note: "positive control: the bench admits mended",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    mended: true,
    kintsugi: false,
    healAbort: false,
    cue: "mended",
  };
}

export function seedMended() {
  return { ...emptyTicket() };
}

export function seedKintsugi() {
  return {
    seed: SEEDED_WORD,
    mended: false,
    kintsugi: true,
    healAbort: true,
    lastUpdatedMissing: true,
    parseError: true,
    treatAsEmpty: true,
    rewriteAbort: true,
    marketplaceRemove: true,
    marketplaceAdd: true,
    pluginListLie: true,
    cue: "kintsugi",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_KINTSUGI_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    kintsugi: true,
    healAbort: true,
    cue: "kintsugi",
  };
}

export function seedHealAbort() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    kintsugi: true,
    healAbort: true,
    event: "heal-abort",
    cue: "kintsugi",
  };
}

export function seedHealed() {
  return { seed: "healed", preferSeed: true, mended: true, cue: "mended" };
}

export function seedGilded() {
  return { seed: "gilded", preferSeed: true, mended: true, cue: "mended" };
}

export function seedFused() {
  return { seed: "fused", preferSeed: true, mended: true, cue: "mended" };
}

export function seedLastUpdatedMissing() {
  return {
    seed: "lastUpdated-missing",
    preferSeed: true,
    lastUpdatedMissing: true,
    cue: "kintsugi",
  };
}

export function seedParseError() {
  return {
    seed: "parse-error",
    preferSeed: true,
    parseError: true,
    cue: "kintsugi",
  };
}

export function seedTreatAsEmpty() {
  return {
    seed: "treat-as-empty",
    preferSeed: true,
    treatAsEmpty: true,
    cue: "kintsugi",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      mended: false,
      kintsugi: false,
      healAbort: false,
      lastUpdatedMissing: false,
      parseError: false,
      treatAsEmpty: false,
      rewriteAbort: false,
      marketplaceRemove: false,
      marketplaceAdd: false,
      pluginListLie: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    mended: raw.mended === true,
    kintsugi: raw.kintsugi === true || raw.event === "kintsugi",
    healAbort: raw.healAbort === true || raw.event === "heal-abort",
    lastUpdatedMissing: raw.lastUpdatedMissing === true || raw.event === "lastUpdated-missing",
    parseError: raw.parseError === true || raw.event === "parse-error",
    treatAsEmpty: raw.treatAsEmpty === true || raw.event === "treat-as-empty",
    rewriteAbort: raw.rewriteAbort === true || raw.event === "rewrite-abort",
    marketplaceRemove: raw.marketplaceRemove === true || raw.event === "marketplace-remove",
    marketplaceAdd: raw.marketplaceAdd === true || raw.event === "marketplace-add",
    pluginListLie: raw.pluginListLie === true || raw.event === "plugin-list-lie",
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
      (ticket.mended != null ||
        ticket.kintsugi != null ||
        ticket.healAbort != null ||
        ticket.lastUpdatedMissing != null ||
        ticket.parseError != null ||
        ticket.treatAsEmpty != null ||
        ticket.rewriteAbort != null ||
        ticket.marketplaceRemove != null ||
        ticket.marketplaceAdd != null ||
        ticket.pluginListLie != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isMended(row) {
  if (row.kintsugi && row.cue !== "mended") return false;
  if (row.cue === "kintsugi" || row.cue === "heal-abort") return false;
  if (
    row.healAbort &&
    row.treatAsEmpty &&
    row.cue !== "mended" &&
    row.mended !== true
  ) {
    return false;
  }
  if (
    row.mended === true &&
    row.kintsugi !== true &&
    row.cue !== "kintsugi"
  ) {
    return true;
  }
  if (
    row.cue === "mended" &&
    row.kintsugi !== true &&
    row.healAbort !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isHealAbort(row) {
  return (
    row.event === "heal-abort" &&
    !isMended(row) &&
    (row.healAbort === true ||
      row.treatAsEmpty === true ||
      row.kintsugi === true)
  );
}

function isKintsugiRow(row) {
  if (isMended(row)) return false;
  if (isHealAbort(row) && row.cue !== "kintsugi") return false;
  if (row.cue === "kintsugi") return true;
  if (row.kintsugi === true) return true;
  if (row.healAbort === true && row.treatAsEmpty === true) return true;
  if (
    row.healAbort === true ||
    row.lastUpdatedMissing === true ||
    row.parseError === true ||
    row.treatAsEmpty === true ||
    row.rewriteAbort === true ||
    row.marketplaceRemove === true ||
    row.marketplaceAdd === true ||
    row.pluginListLie === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one kintsugi pass against the repair bench.
 * mended: quarantine+rebuild or per-entry validate so the gold can set.
 * kintsugi: gold never sets; writer re-reads the corrupt vessel.
 * heal-abort: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHealAbort(row) ||
    (row.healAbort && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "heal-abort";
  } else if (isKintsugiRow(row)) {
    verdict = "kintsugi";
  } else if (isMended(row)) {
    verdict = "mended";
  } else if (
    row.healAbort ||
    row.lastUpdatedMissing ||
    row.parseError ||
    row.treatAsEmpty ||
    row.rewriteAbort ||
    row.marketplaceRemove ||
    row.marketplaceAdd ||
    row.pluginListLie
  ) {
    verdict = "kintsugi";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "kintsugi";
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
    mended: verdict === "mended",
    kintsugi: verdict === "kintsugi" || verdict === SEEDED_WORD,
    healAbort:
      row.healAbort === true ||
      verdict === "heal-abort" ||
      verdict === PATH_WORD,
    lastUpdatedMissing: row.lastUpdatedMissing,
    parseError: row.parseError,
    treatAsEmpty: row.treatAsEmpty,
    rewriteAbort: row.rewriteAbort,
    marketplaceRemove: row.marketplaceRemove,
    marketplaceAdd: row.marketplaceAdd,
    pluginListLie: row.pluginListLie,
    cue: hold
      ? "mended"
      : row.healAbort || verdict === "heal-abort"
        ? "heal-abort"
        : "kintsugi",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit mended" : "score kintsugi",
    lastUpdatedInspect: inspectLastUpdatedMissing(row),
    parseInspect: inspectParseError(row),
    emptyInspect: inspectTreatAsEmpty(row),
    rewriteInspect: inspectRewriteAbort(row),
    cliInspect: inspectMarketplaceCli(row),
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
      : KINTSUGI_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "kintsugi");
  const path = scored.filter((row) => row.verdict === "heal-abort");
  const mended = scored.filter((row) => row.verdict === "mended");
  const headline =
    scored.find((row) => row.event === "kintsugi") ||
    scored.find((row) => row.event === "heal-abort") ||
    scored.find((row) => row.event === "treat-as-empty") ||
    charged[charged.length - 1];
  let verdict = "mended";
  if (charged.length) verdict = "kintsugi";
  else if (path.length && !mended.length) {
    verdict = "heal-abort";
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
    kintsugiCount: charged.length,
    pathCount: path.length,
    mendedCount: mended.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit mended" : "score kintsugi",
    note: headline
      ? "known_marketplaces.json is never repaired once invalid: one entry missing lastUpdated (or a parse error) disables plugins from every marketplace, and the reconciler, marketplace add and marketplace remove all fail re-reading it. Cite-only cousins #84501 #19065 #56967 #94516 #94452."
      : "published kintsugi walk scored against mended vs kintsugi",
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
    seeded !== "mended" &&
    seeded !== "kintsugi" &&
    seeded !== "heal-abort" &&
    ticket.mended == null &&
    ticket.kintsugi == null &&
    ticket.healAbort == null &&
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
    mended: scored.mended ?? false,
    kintsugi: scored.kintsugi ?? false,
    healAbort: scored.healAbort ?? false,
    lastUpdatedMissing: scored.lastUpdatedMissing ?? false,
    parseError: scored.parseError ?? false,
    treatAsEmpty: scored.treatAsEmpty ?? false,
    rewriteAbort: scored.rewriteAbort ?? false,
    marketplaceRemove: scored.marketplaceRemove ?? false,
    marketplaceAdd: scored.marketplaceAdd ?? false,
    pluginListLie: scored.pluginListLie ?? false,
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
    result.healAbort || result.kintsugi
      ? "kind=heal-abort"
      : "kind=cracked-vessel",
    result.treatAsEmpty || result.kintsugi
      ? "ref=treat-as-empty"
      : "ref=repair-bench",
    result.healAbort || result.verdict === "heal-abort"
      ? "path=heal-abort"
      : "path=mended",
    result.cue === "mended"
      ? "cue=mended"
      : result.cue === "heal-abort"
        ? "cue=heal-abort"
        : "cue=kintsugi",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    mended: result.mended,
    kintsugi: result.kintsugi,
    healAbort: result.healAbort,
    lastUpdatedMissing: result.lastUpdatedMissing,
    parseError: result.parseError,
    treatAsEmpty: result.treatAsEmpty,
    rewriteAbort: result.rewriteAbort,
    marketplaceRemove: result.marketplaceRemove,
    marketplaceAdd: result.marketplaceAdd,
    pluginListLie: result.pluginListLie,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    lastUpdated: inspectLastUpdatedMissing({
      mended: result.mended,
      kintsugi: result.kintsugi,
      lastUpdatedMissing: result.lastUpdatedMissing,
    }),
    parse: inspectParseError({
      mended: result.mended,
      kintsugi: result.kintsugi,
      parseError: result.parseError,
    }),
    empty: inspectTreatAsEmpty({
      mended: result.mended,
      kintsugi: result.kintsugi,
      treatAsEmpty: result.treatAsEmpty,
    }),
    rewrite: inspectRewriteAbort({
      mended: result.mended,
      kintsugi: result.kintsugi,
      rewriteAbort: result.rewriteAbort,
    }),
    cli: inspectMarketplaceCli({
      mended: result.mended,
      kintsugi: result.kintsugi,
      marketplaceRemove: result.marketplaceRemove,
      marketplaceAdd: result.marketplaceAdd,
    }),
    post: mapKintsugi({
      mended: result.mended,
      kintsugi: result.kintsugi,
      healAbort: result.healAbort,
      treatAsEmpty: result.treatAsEmpty,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      kintsugi: result.kintsugi === true || result.verdict === "kintsugi",
    })),
    leakPath: scoreHealAbort({
      mended: result.mended === true && !result.kintsugi,
      kintsugi: result.kintsugi,
      healAbort: result.healAbort,
      lastUpdatedMissing: result.lastUpdatedMissing,
      treatAsEmpty: result.treatAsEmpty,
      rewriteAbort: result.rewriteAbort,
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
        "NON-BINDING (issue text): when known_marketplaces.json is invalid, the reconciler treats it as empty and schedules reinstalls, but the install/write path re-reads and re-validates the same invalid file and aborts, so repair never lands; per-entry validate or quarantine+rebuild aside would heal. Invite verify against #94451 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
