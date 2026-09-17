#!/usr/bin/env node
/**
 * Apocope — linguistic end-clip / manuscript elision /
 * WebFetch truncation booth.
 * *Apocope* is the cutting-off of a word's end. WebFetch
 * silently truncates long pages at a fixed character limit;
 * the tool description omits the ceiling, the result carries
 * no truncation flag, and the web-fetch subagent cannot curl
 * to recover the tail. Idle should be **flagged** (truncation
 * declared/signaled/marked). Instead the booth is **truncated**
 * after an **unmarked** cut.
 *
 * Educational diagnostic model for anthropics/claude-code#95127:
 * WebFetch returns a prefix of long pages (~39,415 of 502,907
 * chars on rfc9110.txt) with nothing in the result telling
 * the calling model the fetch was partial. Human docs mention
 * curl via Bash for the full page — but that never reaches the
 * model; tool description has no truncation/limit/size; curl
 * remedy appears scoped to unreachable hosts, not dropped
 * content. web-fetch subagent toolset is WebFetch + handback +
 * advisor — no Bash. Env: Claude Code 2.1.274, Linux arm64,
 * Opus.
 *
 * Encoded from #95127 issue text only. Hypothesis NON-BINDING:
 * truncation is invisible because tool desc + result + subagent
 * prompt omit the signal. Invite verify against #95127 text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix. No
 * network. No exploits. No live Claude sessions.
 *
 *   node apocope.mjs data/truncated.json
 *   echo '{"seed":"truncated"}' | node apocope.mjs
 *
 * Idle word is flagged (HOLD: truncation declared/signaled/marked).
 * HOLD aliases: declared, signaled, marked.
 * Seeded word is truncated. Path word is unmarked.
 * Product score word is apocope (Score apocope or admit flagged.).
 *
 * NOT Precis/#94564 (skill-drop / reknit). NOT Dictabelt/#94406
 * (segment-drop / verbatim). NOT Sepulchre (different metaphor).
 * Cousins cite-only: #51783, #22937, #58467, #50647, #59882,
 * #53297, #90416, #73514 — do not rebuild.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "flagged",
  "truncated",
  "unmarked",
  "declared",
  "signaled",
  "marked",
  "webfetch",
  "tool-desc",
  "unmarked-result",
  "percent-kept",
  "rfc9110",
  "curl-remedy",
  "web-fetch-subagent",
  "no-bash",
  "95127",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "flagged";
export const PATH_WORD = "unmarked";
export const SEEDED_WORD = "truncated";
export const PRODUCT_WORD = "apocope";
export const HOLD = Object.freeze(["flagged"]);
export const HOLD_ALIASES = Object.freeze(["declared", "signaled", "marked"]);
export const RECOVER = Object.freeze(["flagged"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "ascribed",
  "credited",
  "named",
  "billed",
  "moored",
  "lashed",
  "warped",
  "fendered",
  "slipped",
  "iface-swap",
  "buoyed",
  "freshet",
  "init-flood",
  "mended",
  "kintsugi",
  "heal-abort",
  "homed",
  "cenotaph",
  "dead-install",
  "shared",
  "stratum",
  "layer-unsealed",
  "contiguous",
  "tmesis",
  "mid-inject",
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "seated",
  "brisk",
  "cadence",
  "released",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "blazoned",
  "tabard",
  "surfaced",
  "charted",
  "sounding",
  "cleared",
  "repointed",
  "relocated",
  "settled",
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
  "ptmx-race",
  "advisor-shadow",
  "raced",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "prosopon",
  "miscast",
  "slipway",
  "slipped",
  "freshet",
  "kintsugi",
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
  "init-flood",
  "heal-abort",
  "dead-install",
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
  "hawser",
  "bollard",
  "gangway",
  "iface-swap",
  "advisor-shadow",
  "gauntlet",
  "cathead",
  "ptmx-race",
  "seated",
]);

export const FEATURED_ISSUE = 95127;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/95127";
export const TITLE =
  "[BUG] WebFetch truncation is invisible to the model — absent from the tool description, unmarked in the result, and the web-fetch subagent can neither detect nor recover from it";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tools",
]);
export const PLATFORM = "linux";
export const SURFACE = "unmarked";
export const HOST =
  "Claude Code 2.1.274; Linux arm64; Opus; WebFetch on rfc9110.txt returned 39,415 of 502,907 characters (~7.8%) with no truncation flag in the result";
export const CHECKED_ON =
  "Published report: WebFetch truncates at a fixed character limit; tool description has no mention of truncation, limit, size, or length; result does not flag partial fetch; human docs say use curl via Bash for full page but that does not reach the model; web-fetch subagent has WebFetch + handback + advisor only — no Bash";
export const BUILD = "Claude Code 2.1.274";
export const SELECTED_MODEL = "Opus";
export const OS = "Linux arm64";
export const PHRASE = "Score apocope or admit flagged.";
export const DISTRIBUTION =
  "Claude Code 2.1.274 on Linux arm64 with Opus. WebFetch silently truncates long pages. On rfc9110.txt the tool returned 39,415 of 502,907 characters (~7.8%); nothing in the result flags partial content to the calling model, so page doesn't mention X is indistinguishable from truncated tail didn't mention X. Desired (narrative only): state limit+remedy in tool desc; mark truncation in result (truncated: true + retained/total); tell web-fetch subagent; caller-facing description. Synthetic scoring only — no live Claude.";

export const CODE_BUILD = "2.1.274";
export const CODE_BUILD_OK = "2.1.274";
export const CODE_BUILD_STILL = "2.1.274";
export const TERMINAL = "linux";
export const TERM = "arm64";
export const TUI_MODE = "webfetch";
export const SETTINGS_KEY = "webfetch";
export const COMMAND = "WebFetch";
export const WORKAROUND = "curl via Bash for full page (docs; not in tool desc for dropped content)";
export const ROW_KINDS = Object.freeze([
  "tool description (no limit)",
  "WebFetch result (unmarked)",
  "rfc9110 retained slice",
  "curl-via-Bash remedy (docs only)",
]);

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_FLAGGED = Object.freeze({
  kind: "flagged",
  clickSeats: true,
  unmarked: false,
  note: "click seats in the apocope; webfetch finds the row; session opens",
  synthetic: true,
});
export const SYNTHETIC_TRUNCATED = Object.freeze({
  kind: "truncated",
  clickSeats: false,
  unmarked: true,
  note: "left click lands; selection does nothing; apocope never seats",
  synthetic: true,
});
export const SYNTHETIC_UNMARKED = Object.freeze({
  kind: "unmarked",
  rows: [
    { lane: "Pinned", block: "left click ignored", live: false, note: "truncated" },
    { lane: "Ready for review", block: "left click ignored", live: false, note: "truncated" },
    { lane: "Working", block: "left click ignored", live: false, note: "truncated" },
    { lane: "Completed", block: "left click ignored", live: false, note: "truncated" },
    { lane: "keyboard", block: "arrows + Enter still open", live: true, note: "curl-remedy" },
    { lane: "rollback", block: "2.1.274 restores click", live: true, note: "flagged on pin" },
  ],
  note: "four session-row kinds plus curl-remedy and rollback",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "tool description",
    click: "no limit",
    keyboard: "n/a",
    live: false,
    truncated: true,
  },
  {
    lane: "WebFetch result",
    click: "unmarked",
    keyboard: "n/a",
    live: false,
    truncated: true,
  },
  {
    lane: "rfc9110.txt retained",
    click: "39415",
    keyboard: "502907 total",
    live: false,
    truncated: true,
  },
  {
    lane: "curl-via-Bash remedy",
    click: "docs only",
    keyboard: "not in tool desc",
    live: false,
    truncated: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "ratchet-wheel",
    lost: "Ratchet wheel — session-row clicks spin the wheel but never index",
    control: "A flagged wheel would seat the apocope and open the row",
    story: "left click lands; the wheel does not click into the next tooth",
  },
  {
    id: "apocope-pin",
    lost: "Apocope pin — webfetch never drops the pin into the row notch",
    control: "the pin would seat when the click resolves to the session node",
    story: "shared dispatch now resolves click to a node in a separate step",
  },
  {
    id: "click-pawl",
    lost: "Click pawl — no tactile apocope feedback; deaf click",
    control: "the pawl would click when the row is selected",
    story: "selection does nothing; keyboard arrows + Enter still work",
  },
  {
    id: "hit-plate",
    lost: "Hit plate — hover scope / unmarkedResult miss the session row",
    control: "the plate would register the row under the cursor",
    story: "new hover scope / unmarkedResult mechanism added in 2.1.274",
  },
  {
    id: "flagged-dial",
    lost: "Notched dial — fullscreen Terminal.app loses the index seat",
    control: "fullscreen TUI would still notch the clicked row",
    story: "tui fullscreen on Apple Terminal.app; TERM=xterm-256color",
  },
  {
    id: "index-seat",
    lost: "Index seat — row onClick looks unchanged; shared dispatch is the miss",
    control: "the seat would still fire the row's own onClick",
    story: "session row onClick unchanged; only clicking regressed",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "ratchet-wheel",
    survey: "flagged HOLD: click seats in the apocope; webfetch finds the row; session opens",
    kind: "flagged",
    note: "idle/control: the pin drops into the notch",
  },
  {
    id: "apocope-pin",
    survey: "shared mouse dispatch resolves click to a node in a separate step",
    kind: "truncated",
    note: "seeded: the pin never drops",
  },
  {
    id: "click-pawl",
    survey: "left click on claude agents session row does nothing",
    kind: "truncated",
    note: "seeded: truncated; no apocope feedback",
  },
  {
    id: "hit-plate",
    survey: "hover scope / unmarkedResult added; webfetch misses the row",
    kind: "truncated",
    note: "seeded: the plate does not register the row",
  },
  {
    id: "flagged-dial",
    survey: "fullscreen macOS Terminal.app; 2.1.274 works; 2.1.274/2.1.274 broken",
    kind: "truncated",
    note: "seeded: the dial lost its index on fullscreen",
  },
  {
    id: "index-seat",
    survey: "unmarked — row onClick unchanged; only clicking regressed; curl-remedy",
    kind: "truncated",
    note: "path: unmarked names the missing apocope",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "webfetch",
    label: "webfetch",
    count: "miss",
    note: "click position resolved to a node in a separate step",
  },
  {
    id: "tool-desc",
    label: "tool-desc",
    count: "scope",
    note: "new hover scope / unmarkedResult mechanism in 2.1.274",
  },
  {
    id: "unmarked-result",
    label: "unmarked-result",
    count: "key",
    note: "unmarkedResult added to shared mouse dispatch",
  },
  {
    id: "percent-kept",
    label: "percent-kept",
    count: "full",
    note: "tui fullscreen on Apple Terminal.app",
  },
  {
    id: "rfc9110",
    label: "rfc9110",
    count: "same",
    note: "session row onClick looks unchanged",
  },
  {
    id: "unmarked",
    label: "unmarked",
    count: "dead",
    note: "path: shared hit testing change; only clicking regressed",
  },
]);

export const RULED_OUT = Object.freeze([
  " Precis/#94564 — skill-drop / reknit / compact paraphrase — DIFFERENT",
  " Dictabelt/#94406 — segment-drop / verbatim — DIFFERENT",
  " Detent/#94565 — mouse-dead / notched-wheel — DIFFERENT",
  " Dictabelt — segment-drop / verbatim — DIFFERENT",
  " Mojibake — fffd-spall — DIFFERENT",
  " Rasure/Cancellans/Rescript — intact / creation-time — DIFFERENT",
  " #94565 — detent hit-test — DIFFERENT; cite only",
  " #94553 — backup next-focus — DIFFERENT; cite only",
  " #94560 — backup next-focus — DIFFERENT; cite only",
  " #93924 — RC local slowdown — DIFFERENT; cite only; backup next-focus",
  " #93770 — copy padding artifacts — DIFFERENT; enhancement; backup next-focus",
  " #93777 — Vercel MCP teamId — DIFFERENT; cite only; backup next-focus",
  " #94151 — Shift+PageUp Konsole — DIFFERENT; cite only; backup next-focus",
  "Prosopon/#94575 — advisor-shadow / Fable paint — DIFFERENT",
  "Slipway/#94458 — dry-dock iface-swap — DIFFERENT",
  "Freshet/#94430 — river-stage init-flood — DIFFERENT",
  "Kintsugi/#94451 — gold never sets — DIFFERENT",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — herald college — DIFFERENT",
  "Diptych/#94397 — wax-tablet brief-echo — DIFFERENT",
  "Vizard/#94398 — Renaissance masque / background-reset — DIFFERENT",
  "Gauntlet — tilting-yard iron-glove — DIFFERENT",
  "Cathead/#93624 — seated / ptmx-race — DIFFERENT; do not reuse seated",
]);

export const EXPECTED = Object.freeze([
  "WebFetch result flags truncation (truncated: true + retained/total)",
  "Tool description states character limit and curl recovery — admit flagged",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Restore post-compact skill re-attach so invoked_skills follows the summary",
  "Keep truncated faithful to singular/plural constraints (e.g. background subagent)",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "unmarked",
  "apocope",
  "webfetch",
  "tool-desc",
  "unmarked-result",
  "truncated",
  "rfc9110",
]);

export const COUSINS = Object.freeze([
  { issue: 51783, title: "closed docs cousin", state: "CLOSED", citeOnly: true },
  { issue: 22937, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
  { issue: 58467, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
  { issue: 50647, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
  { issue: 59882, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
  { issue: 53297, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
  { issue: 90416, title: "PDF silent truncate (open)", state: "OPEN", citeOnly: true },
  { issue: 73514, title: "cite-only cousin", state: "UNKNOWN", citeOnly: true },
]);

export const BACKUPS = Object.freeze([
  { issue: 94565, title: "backup next-focus — detent mouse-dead", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94553, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94560, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus — RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus — copy padding artifacts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus — Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus — Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "prosopon",
  "slipway",
  "freshet",
  "kintsugi",
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
  "hawser",
  "bollard",
  "gangway",
  "gauntlet",
  "cathead",
]);

export const SAMPLE_KIND_IDLE = "ratchet-wheel";
export const SAMPLE_KIND_SEEDED = "unmarked";
export const SAMPLE_HOLDING_IDLE = "atelier-bench";
export const SAMPLE_HOLDING_SEEDED = "truncated";

export const SAMPLE_FLAGGED_PROOF = Object.freeze({
  flagged: true,
  truncated: false,
  unmarked: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_TRUNCATED_PROOF = Object.freeze({
  flagged: false,
  truncated: true,
  unmarked: true,
  webfetch: true,
  toolDesc: true,
  unmarkedResult: true,
  percentKept: true,
  rfc9110: true,
  curlRemedy: true,
  webFetchSubagent: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  flaggedWatch: { ...SYNTHETIC_FLAGGED },
  truncatedWatch: { ...SYNTHETIC_TRUNCATED },
  unmarkedShape: { ...SYNTHETIC_UNMARKED },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds flagged: click seats in the apocope; session opens" },
  { t: "unmarked", line: "shared mouse dispatch resolves click to a node in a separate step" },
  { t: "path", line: "unmarked — webfetch/apocope feedback gone on fullscreen Terminal.app" },
  { t: "score", line: "when the pin never seats the booth is truncated — Score apocope or admit flagged." },
]);

const FORCE_FLAGS = [
  "unmarked",
  "webfetch",
  "toolDesc",
  "unmarkedResult",
  "percentKept",
  "rfc9110",
  "curlRemedy",
  "webFetchSubagent",
  "truncated",
];

const ISSUE_CUE_RE =
  /95127|truncated|unmarked|claude agents|unmarkedResult|hover scope|2\.1\.271|fullscreen/i;

/**
 * Educational unmarked observer. Not a Claude Code patch.
 * Encodes only the published #95127 shapes.
 *
 * Click lands; selection does nothing.
 */
export function observeUnmarked({
  clickLanded = true,
  selectionOpened = false,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      clickLanded: true,
      selectionOpened: true,
      dead: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const dead = clickLanded === true && selectionOpened === false;
  return {
    clickLanded,
    selectionOpened,
    dead,
    phrase: dead ? "score apocope" : "admit flagged",
    note: dead
      ? "left click lands; selection does nothing; apocope never seats"
      : "click seats in the notch",
    synthetic: true,
  };
}

/**
 * Educational webfetch observer. Not a Claude Code patch.
 * Published: click position resolved to a node in a separate step.
 */
export function inspectWebfetch({
  resolvedSeparately = true,
  foundRow = false,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      resolvedSeparately,
      foundRow: true,
      missed: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const missed = resolvedSeparately === true && foundRow === false;
  return {
    resolvedSeparately,
    foundRow,
    missed,
    phrase: missed ? "score apocope" : "admit flagged",
    note: missed
      ? "webfetch — click resolved separately; row not found"
      : "webfetch seated the row",
    synthetic: true,
  };
}

/**
 * Educational tool-desc observer. Not a Claude Code patch.
 * Published: new hover scope / unmarkedResult mechanism.
 */
export function inspectToolDesc({
  unmarkedResult = true,
  toolDesc = true,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      unmarkedResult,
      toolDesc,
      missed: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const missed = unmarkedResult === true && toolDesc === true;
  return {
    unmarkedResult,
    toolDesc,
    missed,
    phrase: missed ? "score apocope" : "admit flagged",
    note: missed
      ? "tool-desc — unmarkedResult mechanism added in 2.1.274"
      : "no tool-desc miss",
    synthetic: true,
  };
}

/**
 * Educational truncated observer. Not a Claude Code patch.
 * Published: left click session row does nothing.
 */
export function inspectTruncated({
  leftClick = true,
  opened = false,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      leftClick,
      opened: true,
      deaf: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const deaf = leftClick === true && opened === false;
  return {
    leftClick,
    opened,
    deaf,
    phrase: deaf ? "score apocope" : "admit flagged",
    note: deaf
      ? "truncated — left click on claude agents row is ignored"
      : "click opened the session",
    synthetic: true,
  };
}

/**
 * Educational curl-remedy observer. Not a Claude Code patch.
 * Published: arrows + Enter still work.
 */
export function inspectCurlRemedy({
  arrowsEnter = true,
  opened = true,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      arrowsEnter,
      opened: true,
      stillWorks: true,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const stillWorks = arrowsEnter === true && opened === true;
  return {
    arrowsEnter,
    opened,
    stillWorks,
    phrase: stillWorks ? "score apocope" : "admit flagged",
    note: stillWorks
      ? "curl-remedy — arrows + Enter still open the session"
      : "keyboard path not in the published report",
    synthetic: true,
  };
}

/**
 * Educational percent-kept observer. Not a Claude Code patch.
 * Published: tui fullscreen on Terminal.app.
 */
export function inspectPercentKept({
  retained = 39415,
  total = 502907,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      retained,
      total,
      flagged: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const sliceFlagged = retained < total && retained / total < 0.1;
  return {
    retained,
    total,
    flagged: sliceFlagged,
    phrase: sliceFlagged ? "score apocope" : "admit flagged",
    note: sliceFlagged
      ? "percent-kept — rfc9110.txt retained ~39415 of 502907 (~7.8%)"
      : "not the published rfc9110 slice shape",
    synthetic: true,
  };
}

/**
 * Educational rfc9110 observer. Not a Claude Code patch.
 * Published: session row onClick looks unchanged.
 */
export function inspectRfc9110({
  unchanged = true,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      unchanged,
      flagged: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  return {
    unchanged,
    flagged: unchanged === true,
    phrase: unchanged ? "score apocope" : "admit flagged",
    note: unchanged
      ? "rfc9110 — session row onClick looks unchanged"
      : "row handler changed in the published compare",
    synthetic: true,
  };
}

/**
 * Educational web-fetch-subagent observer. Not a Claude Code patch.
 * Published: 2.1.274 shared mouse dispatch changed.
 */
export function inspectWebFetchSubagent({
  version = CODE_BUILD,
  changed = true,
  hold = false,
} = {}) {
  if (hold === true) {
    return {
      version: CODE_BUILD_OK,
      changed: false,
      flagged: false,
      phrase: "admit flagged",
      synthetic: true,
    };
  }
  const missFlagged = version === CODE_BUILD && changed === true;
  return {
    version,
    changed,
    flagged: missFlagged,
    phrase: missFlagged ? "score apocope" : "admit flagged",
    note: missFlagged
      ? "web-fetch-subagent — 2.1.274 resolves click to a node in a separate step"
      : "shared dispatch not in the published compare",
    synthetic: true,
  };
}

export function scoreUnmarked(input = {}) {
  const flaggedHold = input.flagged === true && input.truncated !== true;
  const dead = observeUnmarked({
    clickLanded: true,
    selectionOpened: flaggedHold,
    flagged: flaggedHold,
  });
  const truncated =
    !flaggedHold &&
    (input.truncated === true ||
      input.unmarked === true ||
      input.webfetch === true ||
      input.toolDesc === true ||
      input.unmarkedResult === true ||
      input.webFetchSubagent === true ||
      dead.dead === true);
  return {
    flagged: !truncated,
    truncated,
    unmarked: truncated,
    dead,
    phrase: truncated ? "score apocope" : "admit flagged",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "95127") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapApocope(input = {}) {
  const truncated = isTruncatedInput(input);
  const flagged = input.flagged === true && !truncated;
  return {
    stamp: truncated ? "unmarked" : "atelier-bench",
    holdingLane: truncated ? "truncated" : "atelier-bench",
    kindLane: truncated ? "unmarked" : "ratchet-wheel",
    bindLane: truncated ? "webfetch" : "apocope-pin",
    ribbon: truncated ? "truncated" : "flagged",
    flagged,
  };
}

export function inspectWebfetchMark(input = {}) {
  const flagged =
    input.webfetch === true ||
    input.truncated === true ||
    isTruncatedInput(input);
  if (input.flagged === true && !flagged) {
    return { stamp: "declared", flagged: false, note: "pin still flagged" };
  }
  return {
    stamp: flagged ? "webfetch" : "pin-idle",
    flagged,
    note: flagged
      ? "webfetch — click resolved separately; row not found"
      : "",
  };
}

export function inspectToolDescMark(input = {}) {
  const missed =
    input.toolDesc === true ||
    input.unmarkedResult === true ||
    input.truncated === true ||
    input.unmarked === true ||
    isTruncatedInput(input);
  if (input.flagged === true && !missed) {
    return { stamp: "signaled", missed: false };
  }
  return {
    stamp: missed ? "tool-desc" : "pin-idle",
    missed,
    note: missed
      ? "tool-desc — unmarkedResult mechanism added in 2.1.274"
      : "",
  };
}

export function inspectUnmarkedResultMark(input = {}) {
  const flagged =
    input.unmarkedResult === true ||
    input.truncated === true ||
    isTruncatedInput(input);
  if (input.flagged === true && !flagged) {
    return { stamp: "marked", flagged: false };
  }
  return {
    stamp: flagged ? "unmarked-result" : "pin-idle",
    flagged,
    note: flagged
      ? "unmarked-result — shared mouse dispatch added unmarkedResult"
      : "",
  };
}

export function inspectPercentKeptMark(input = {}) {
  const flagged =
    input.percentKept === true ||
    input.truncated === true ||
    isTruncatedInput(input);
  if (input.flagged === true && !flagged) {
    return { stamp: "ratchet-wheel", flagged: false };
  }
  return {
    stamp: flagged ? "percent-kept" : "pin-idle",
    flagged,
    note: flagged
      ? "percent-kept — Apple Terminal.app; tui fullscreen"
      : "",
  };
}

export function inspectRfc9110Mark(input = {}) {
  const flagged =
    input.rfc9110 === true ||
    input.curlRemedy === true ||
    input.webFetchSubagent === true ||
    input.truncated === true ||
    isTruncatedInput(input);
  if (input.flagged === true && !flagged) {
    return { stamp: "declared", flagged: false };
  }
  return {
    stamp: flagged ? "rfc9110" : "pin-idle",
    flagged,
    note: flagged
      ? "rfc9110 — session row onClick looks unchanged"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "ratchet-wheel": input.truncated || input.unmarked,
    "apocope-pin": input.truncated || input.unmarked || input.webfetch,
    "click-pawl": input.truncated || input.webFetchSubagent,
    "hit-plate": input.toolDesc || input.unmarkedResult || input.truncated,
    "flagged-dial": input.percentKept || input.truncated,
    "index-seat": input.rfc9110 || input.truncated,
  };
  return (
    map[id] === true ||
    input.unmarked === true ||
    input.truncated === true
  );
}

function isTruncatedInput(input = {}) {
  return (
    input.truncated === true ||
    input.unmarked === true ||
    input.webfetch === true ||
    input.toolDesc === true ||
    input.unmarkedResult === true ||
    input.percentKept === true ||
    input.rfc9110 === true ||
    input.curlRemedy === true ||
    input.webFetchSubagent === true
  );
}

export function readBooth(input = {}) {
  const truncated = isTruncatedInput(input);
  const flagged = input.flagged === true && !truncated;
  return {
    mark: truncated ? "truncated" : "flagged",
    flagged,
    truncated,
    unmarked: input.unmarked === true || truncated,
    webfetch: input.webfetch === true,
    toolDesc: input.toolDesc === true,
    unmarkedResult: input.unmarkedResult === true,
    percentKept: input.percentKept === true,
    rfc9110: input.rfc9110 === true,
    curlRemedy: input.curlRemedy === true,
    webFetchSubagent: input.webFetchSubagent === true,
    post: mapApocope(input),
    hit: inspectWebfetchMark(input),
    hover: inspectToolDescMark(input),
    key: inspectUnmarkedResultMark(input),
    fullscreen: inspectPercentKeptMark(input),
    row: inspectRfc9110Mark(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const APOCOPE_WALK = Object.freeze([
  {
    t: "idle",
    event: "atelier-bench",
    flagged: true,
    truncated: false,
    cue: "flagged",
    note: "idle HOLD: click seats in the apocope; webfetch finds the row; session opens",
  },
  {
    t: "unmarked",
    event: "unmarked",
    truncated: true,
    unmarked: true,
    webfetch: true,
    webFetchSubagent: true,
    cue: "truncated",
    note: "shared mouse dispatch resolves click to a node in a separate step",
  },
  {
    t: "path",
    event: "unmarked",
    truncated: true,
    unmarked: true,
    webfetch: true,
    toolDesc: true,
    unmarkedResult: true,
    percentKept: true,
    rfc9110: true,
    curlRemedy: true,
    webFetchSubagent: true,
    cue: "truncated",
    note: "unmarked — webfetch/apocope feedback gone on fullscreen Terminal.app",
  },
  {
    t: "score",
    event: "truncated",
    truncated: true,
    unmarked: true,
    webfetch: true,
    toolDesc: true,
    unmarkedResult: true,
    percentKept: true,
    rfc9110: true,
    curlRemedy: true,
    webFetchSubagent: true,
    cue: "truncated",
    note: "truncated — pin never seated; keyboard still indexes",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "atelier-bench",
    flagged: true,
    truncated: false,
    cue: "flagged",
    note: "positive control: click seats in the apocope; session opens",
  },
  {
    t: "admit",
    event: "atelier-bench",
    flagged: true,
    cue: "flagged",
    note: "positive control: the ratchet admits flagged",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    flagged: true,
    truncated: false,
    unmarked: false,
    cue: "flagged",
  };
}

export function seedFlagged() {
  return { ...emptyTicket() };
}

export function seedTruncated() {
  return {
    seed: SEEDED_WORD,
    flagged: false,
    truncated: true,
    unmarked: true,
    webfetch: true,
    toolDesc: true,
    unmarkedResult: true,
    percentKept: true,
    rfc9110: true,
    curlRemedy: true,
    webFetchSubagent: true,
    cue: "truncated",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_TRUNCATED_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "truncated",
    preferSeed: true,
    truncated: true,
    unmarked: true,
    cue: "truncated",
  };
}

export function seedUnmarked() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    truncated: true,
    unmarked: true,
    event: "unmarked",
    cue: "truncated",
  };
}

export function seedDeclared() {
  return { seed: "declared", preferSeed: true, flagged: true, cue: "flagged" };
}

export function seedSignaled() {
  return { seed: "signaled", preferSeed: true, flagged: true, cue: "flagged" };
}

export function seedMarked() {
  return { seed: "marked", preferSeed: true, flagged: true, cue: "flagged" };
}

export function seedWebfetch() {
  return {
    seed: "webfetch",
    preferSeed: true,
    webfetch: true,
    cue: "truncated",
  };
}

export function seedToolDesc() {
  return {
    seed: "tool-desc",
    preferSeed: true,
    toolDesc: true,
    cue: "truncated",
  };
}

export function seedUnmarkedResult() {
  return {
    seed: "unmarked-result",
    preferSeed: true,
    unmarkedResult: true,
    cue: "truncated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      flagged: false,
      truncated: false,
      unmarked: false,
      webfetch: false,
      toolDesc: false,
      unmarkedResult: false,
      percentKept: false,
      rfc9110: false,
      curlRemedy: false,
      webFetchSubagent: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    flagged: raw.flagged === true,
    truncated: raw.truncated === true || raw.event === "truncated",
    unmarked: raw.unmarked === true || raw.event === "unmarked",
    webfetch: raw.webfetch === true || raw.event === "webfetch",
    toolDesc: raw.toolDesc === true || raw.event === "tool-desc",
    unmarkedResult: raw.unmarkedResult === true || raw.event === "unmarked-result",
    percentKept: raw.percentKept === true || raw.event === "percent-kept",
    rfc9110: raw.rfc9110 === true || raw.event === "rfc9110",
    curlRemedy: raw.curlRemedy === true || raw.event === "curl-remedy",
    webFetchSubagent: raw.webFetchSubagent === true || raw.event === "web-fetch-subagent",
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
      (ticket.flagged != null ||
        ticket.truncated != null ||
        ticket.unmarked != null ||
        ticket.webfetch != null ||
        ticket.toolDesc != null ||
        ticket.unmarkedResult != null ||
        ticket.percentKept != null ||
        ticket.rfc9110 != null ||
        ticket.curlRemedy != null ||
        ticket.webFetchSubagent != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isFlagged(row) {
  if (row.truncated && row.cue !== "flagged") return false;
  if (row.cue === "truncated" || row.cue === "unmarked") return false;
  if (
    row.unmarked &&
    row.webfetch &&
    row.cue !== "flagged" &&
    row.flagged !== true
  ) {
    return false;
  }
  if (
    row.flagged === true &&
    row.truncated !== true &&
    row.cue !== "truncated"
  ) {
    return true;
  }
  if (
    row.cue === "flagged" &&
    row.truncated !== true &&
    row.unmarked !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isUnmarkedRow(row) {
  return (
    row.event === "unmarked" &&
    !isFlagged(row) &&
    (row.unmarked === true ||
      row.webfetch === true ||
      row.truncated === true)
  );
}

function isTruncatedRow(row) {
  if (isFlagged(row)) return false;
  if (isUnmarkedRow(row) && row.cue !== "truncated") return false;
  if (row.cue === "truncated") return true;
  if (row.truncated === true) return true;
  if (row.unmarked === true && row.webfetch === true) return true;
  if (
    row.unmarked === true ||
    row.webfetch === true ||
    row.toolDesc === true ||
    row.unmarkedResult === true ||
    row.percentKept === true ||
    row.rfc9110 === true ||
    row.curlRemedy === true ||
    row.webFetchSubagent === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one apocope pass against the ratchet.
 * flagged: click seats in the apocope; session opens.
 * truncated: left click lands; selection does nothing.
 * unmarked: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isUnmarkedRow(row) ||
    (row.unmarked && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "unmarked";
  } else if (isTruncatedRow(row)) {
    verdict = "truncated";
  } else if (isFlagged(row)) {
    verdict = "flagged";
  } else if (
    row.unmarked ||
    row.webfetch ||
    row.toolDesc ||
    row.unmarkedResult ||
    row.percentKept ||
    row.rfc9110 ||
    row.curlRemedy ||
    row.webFetchSubagent
  ) {
    verdict = "truncated";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "truncated";
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
    flagged: verdict === "flagged",
    truncated: verdict === "truncated" || verdict === SEEDED_WORD,
    unmarked:
      row.unmarked === true ||
      verdict === "unmarked" ||
      verdict === PATH_WORD,
    webfetch: row.webfetch,
    toolDesc: row.toolDesc,
    unmarkedResult: row.unmarkedResult,
    percentKept: row.percentKept,
    rfc9110: row.rfc9110,
    curlRemedy: row.curlRemedy,
    webFetchSubagent: row.webFetchSubagent,
    cue: hold
      ? "flagged"
      : row.unmarked || verdict === "unmarked"
        ? "unmarked"
        : "truncated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit flagged" : "score apocope",
    hitInspect: inspectWebfetchMark(row),
    hoverInspect: inspectToolDescMark(row),
    keyInspect: inspectUnmarkedResultMark(row),
    fullscreenInspect: inspectPercentKeptMark(row),
    rowInspect: inspectRfc9110Mark(row),
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
      : APOCOPE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "truncated");
  const path = scored.filter((row) => row.verdict === "unmarked");
  const flagged = scored.filter((row) => row.verdict === "flagged");
  const headline =
    scored.find((row) => row.event === "truncated") ||
    scored.find((row) => row.event === "unmarked") ||
    scored.find((row) => row.event === "webfetch") ||
    charged[charged.length - 1];
  let verdict = "flagged";
  if (charged.length) verdict = "truncated";
  else if (path.length && !flagged.length) {
    verdict = "unmarked";
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
    truncatedCount: charged.length,
    pathCount: path.length,
    flaggedCount: flagged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit flagged" : "score apocope",
    note: headline
      ? "After 2.1.274 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing. Issue text names no cousin tickets."
      : "published apocope walk scored against flagged vs truncated",
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
    seeded !== "flagged" &&
    seeded !== "truncated" &&
    seeded !== "unmarked" &&
    ticket.flagged == null &&
    ticket.truncated == null &&
    ticket.unmarked == null &&
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
    flagged: scored.flagged ?? false,
    truncated: scored.truncated ?? false,
    unmarked: scored.unmarked ?? false,
    webfetch: scored.webfetch ?? false,
    toolDesc: scored.toolDesc ?? false,
    unmarkedResult: scored.unmarkedResult ?? false,
    percentKept: scored.percentKept ?? false,
    rfc9110: scored.rfc9110 ?? false,
    curlRemedy: scored.curlRemedy ?? false,
    webFetchSubagent: scored.webFetchSubagent ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD || verdict === SEEDED_WORD) return PRODUCT_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.unmarked || result.truncated
      ? "kind=unmarked"
      : "kind=ratchet-wheel",
    result.webfetch || result.truncated
      ? "ref=webfetch"
      : "ref=atelier-bench",
    result.unmarked || result.verdict === "unmarked"
      ? "path=unmarked"
      : "path=flagged",
    result.cue === "flagged"
      ? "cue=flagged"
      : result.cue === "unmarked"
        ? "cue=unmarked"
        : "cue=truncated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    flagged: result.flagged,
    truncated: result.truncated,
    unmarked: result.unmarked,
    webfetch: result.webfetch,
    toolDesc: result.toolDesc,
    unmarkedResult: result.unmarkedResult,
    percentKept: result.percentKept,
    rfc9110: result.rfc9110,
    curlRemedy: result.curlRemedy,
    webFetchSubagent: result.webFetchSubagent,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    hit: inspectWebfetchMark({
      flagged: result.flagged,
      truncated: result.truncated,
      webfetch: result.webfetch,
    }),
    hover: inspectToolDescMark({
      flagged: result.flagged,
      truncated: result.truncated,
      toolDesc: result.toolDesc,
    }),
    key: inspectUnmarkedResultMark({
      flagged: result.flagged,
      truncated: result.truncated,
      unmarkedResult: result.unmarkedResult,
    }),
    fullscreen: inspectPercentKeptMark({
      flagged: result.flagged,
      truncated: result.truncated,
      percentKept: result.percentKept,
    }),
    row: inspectRfc9110Mark({
      flagged: result.flagged,
      truncated: result.truncated,
      rfc9110: result.rfc9110,
    }),
    post: mapApocope({
      flagged: result.flagged,
      truncated: result.truncated,
      unmarked: result.unmarked,
      webfetch: result.webfetch,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      truncated: result.truncated === true || result.verdict === "truncated",
    })),
    leakPath: scoreUnmarked({
      flagged: result.flagged === true && !result.truncated,
      truncated: result.truncated,
      unmarked: result.unmarked,
      webfetch: result.webfetch,
      toolDesc: result.toolDesc,
      unmarkedResult: result.unmarkedResult,
      webFetchSubagent: result.webFetchSubagent,
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
        "NON-BINDING (issue text): truncation may be invisible because tool description, WebFetch result, and web-fetch subagent prompt omit any signal that the page was cut. Invite verify against #95127 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
