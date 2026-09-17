#!/usr/bin/env node
/**
 * Precis — mechanical precis / ratchet / invoked-skills /
 * reknit-wheel atelier booth.
 * A *precis* is the spring-loaded pin that drops into a
 * ratchet notch so the wheel indexes with a click you can
 * feel. Session-row left-clicks should seat in that notch
 * (invoked-skills finds the row; the precis clicks; the session
 * opens). After 2.1.270 shared mouse dispatch, the click
 * lands but the pin never seats — deaf click / missing
 * precis on fullscreen macOS Terminal.app.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: since 2.1.270, left clicking a session row in
 * the `claude agents` list no longer opens that session.
 * Nothing happens on click. Keyboard navigation (arrows +
 * Enter) still works. Rolling back to 2.1.270 restores
 * clicking. 2.1.270 is still affected. Fullscreen TUI on
 * Apple Terminal.app. The session row's own onClick looks
 * unchanged; the shared mouse dispatch changed — click
 * position is now resolved to a node in a separate step,
 * and a new hover scope / summaryOnly mechanism was added.
 *
 * Encoded from anthropics/claude-code#94564 issue text only.
 * Hypothesis (NON-BINDING — issue text): the shared
 * invoked-skillsing change looks like the likely cause, since
 * only clicking regressed. Invite verify against #94564
 * text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a Claude
 * Code fix. No network. No exploits. No live Claude.
 *
 *   node precis.mjs data/paraphrase.json
 *   echo '{"seed":"paraphrase"}' | node precis.mjs
 *
 * Idle word is reknit (HOLD: click seats in the precis;
 * invoked-skills finds the row; session opens).
 * HOLD aliases: grafted-skill, carried, attached.
 * Primary idle is reknit because Cathead already used seated.
 * Seeded word is paraphrase (#94564 path).
 * Path word is skill-drop.
 * Product score word is precis (Score precis or
 * admit reknit.).
 *
 * NOT Prosopon/#94575 (advisor-shadow). NOT Slipway/#94458
 * (iface-swap). NOT Freshet/#94430 (init-flood).
 * NOT Kintsugi/#94451 (heal-abort). NOT Cenotaph/#94452
 * (dead-install). NOT Stratum/#94417. NOT Tmesis/#86198.
 * NOT Vedette/#94392. NOT Orloj/#94393. NOT Brisure/#94396.
 * NOT Diptych/#94397. NOT Vizard/#94398. NOT Treacle/Somnus.
 * NOT Gauntlet. NOT Cathead (seated / ptmx-race).
 * Issue text names no cousin tickets — cousins stay empty.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "reknit",
  "paraphrase",
  "skill-drop",
  "grafted-skill",
  "carried",
  "attached",
  "invoked-skills",
  "compact-manual",
  "summary-only",
  "token-budget",
  "skill-body",
  "docs-reattach",
  "invoked-block",
  "terminal-app",
  "94564",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "reknit";
export const PATH_WORD = "skill-drop";
export const SEEDED_WORD = "paraphrase";
export const PRODUCT_WORD = "precis";
export const HOLD = Object.freeze(["reknit"]);
export const HOLD_ALIASES = Object.freeze(["grafted-skill", "carried", "attached"]);
export const RECOVER = Object.freeze(["reknit"]);
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

export const FEATURED_ISSUE = 94564;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94564";
export const TITLE =
  "Invoked skill not re-attached after manual /compact; only the summary's paraphrase survives";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:skills",
  "area:compaction",
]);
export const PLATFORM = "macos";
export const SURFACE = "skill-drop";
export const HOST =
  "Claude Code 2.1.270; macOS; project skill ~5279 bytes invoked as slash command; manual /compact; preTokens ~213828 → postTokens ~8106";
export const CHECKED_ON =
  "Published report: after manual /compact, no invoked_skills block / skill content survives — only the compaction summary paraphrase; paraphrase lost critical detail (a background subagent → background subagents); model spawned a new subagent for every write";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "failure is post-compact skill re-attach / paraphrase-only survival, not a model-routing miss";
export const OS = "macOS";
export const PHRASE = "Score precis or admit reknit.";
export const DISTRIBUTION =
  "Claude Code 2.1.270 on macOS. Docs: compaction should re-attach the most recent invocation of each skill after the summary (first 5k tokens each, 25k combined). User invoked a project skill (~5279 bytes) as a slash command, then ran manual /compact (preTokens ~213828 → postTokens ~8106). After compact: no invoked_skills block; skill body gone; only summary paraphrase remains. Paraphrase blurred a background subagent constraint into background subagents, causing extra subagent spawns on writes. Synthetic scoring only — no live Claude.";

export const CODE_BUILD = "2.1.270";
export const CODE_BUILD_OK = "2.1.270";
export const CODE_BUILD_STILL = "2.1.270";
export const TERMINAL = "macOS";
export const TERM = "project-skill";
export const TUI_MODE = "manual-compact";
export const SETTINGS_KEY = "compact";
export const COMMAND = "/compact";
export const WORKAROUND = "re-invoke skill after compact";
export const ROW_KINDS = Object.freeze([
  "invoked_skills block",
  "skill body (5k cap)",
  "summary paraphrase",
  "docs re-attach path",
]);

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_REKNIT = Object.freeze({
  kind: "reknit",
  clickSeats: true,
  skillDrop: false,
  note: "click seats in the precis; invoked-skills finds the row; session opens",
  synthetic: true,
});
export const SYNTHETIC_PARAPHRASE = Object.freeze({
  kind: "paraphrase",
  clickSeats: false,
  skillDrop: true,
  note: "left click lands; selection does nothing; precis never seats",
  synthetic: true,
});
export const SYNTHETIC_SKILL_DROP = Object.freeze({
  kind: "skill-drop",
  rows: [
    { lane: "Pinned", block: "left click ignored", live: false, note: "paraphrase" },
    { lane: "Ready for review", block: "left click ignored", live: false, note: "paraphrase" },
    { lane: "Working", block: "left click ignored", live: false, note: "paraphrase" },
    { lane: "Completed", block: "left click ignored", live: false, note: "paraphrase" },
    { lane: "keyboard", block: "arrows + Enter still open", live: true, note: "docs-reattach" },
    { lane: "rollback", block: "2.1.270 restores click", live: true, note: "reknit on pin" },
  ],
  note: "four session-row kinds plus docs-reattach and rollback",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "invoked_skills block",
    click: "missing",
    keyboard: "n/a",
    live: false,
    paraphrase: true,
  },
  {
    lane: "skill body (5k cap)",
    click: "dropped",
    keyboard: "n/a",
    live: false,
    paraphrase: true,
  },
  {
    lane: "summary paraphrase",
    click: "survives",
    keyboard: "n/a",
    live: true,
    paraphrase: true,
  },
  {
    lane: "docs re-attach path",
    click: "expected",
    keyboard: "n/a",
    live: false,
    paraphrase: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "ratchet-wheel",
    lost: "Ratchet wheel — session-row clicks spin the wheel but never index",
    control: "A reknit wheel would seat the precis and open the row",
    story: "left click lands; the wheel does not click into the next tooth",
  },
  {
    id: "precis-pin",
    lost: "Precis pin — invoked-skills never drops the pin into the row notch",
    control: "the pin would seat when the click resolves to the session node",
    story: "shared dispatch now resolves click to a node in a separate step",
  },
  {
    id: "click-pawl",
    lost: "Click pawl — no tactile precis feedback; deaf click",
    control: "the pawl would click when the row is selected",
    story: "selection does nothing; keyboard arrows + Enter still work",
  },
  {
    id: "hit-plate",
    lost: "Hit plate — hover scope / summaryOnly miss the session row",
    control: "the plate would register the row under the cursor",
    story: "new hover scope / summaryOnly mechanism added in 2.1.270",
  },
  {
    id: "reknit-dial",
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
    survey: "reknit HOLD: click seats in the precis; invoked-skills finds the row; session opens",
    kind: "reknit",
    note: "idle/control: the pin drops into the notch",
  },
  {
    id: "precis-pin",
    survey: "shared mouse dispatch resolves click to a node in a separate step",
    kind: "paraphrase",
    note: "seeded: the pin never drops",
  },
  {
    id: "click-pawl",
    survey: "left click on claude agents session row does nothing",
    kind: "paraphrase",
    note: "seeded: paraphrase; no precis feedback",
  },
  {
    id: "hit-plate",
    survey: "hover scope / summaryOnly added; invoked-skills misses the row",
    kind: "paraphrase",
    note: "seeded: the plate does not register the row",
  },
  {
    id: "reknit-dial",
    survey: "fullscreen macOS Terminal.app; 2.1.270 works; 2.1.270/2.1.270 broken",
    kind: "paraphrase",
    note: "seeded: the dial lost its index on fullscreen",
  },
  {
    id: "index-seat",
    survey: "skill-drop — row onClick unchanged; only clicking regressed; docs-reattach",
    kind: "paraphrase",
    note: "path: skill-drop names the missing precis",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "invoked-skills",
    label: "invoked-skills",
    count: "miss",
    note: "click position resolved to a node in a separate step",
  },
  {
    id: "compact-manual",
    label: "compact-manual",
    count: "scope",
    note: "new hover scope / summaryOnly mechanism in 2.1.270",
  },
  {
    id: "summary-only",
    label: "summary-only",
    count: "key",
    note: "summaryOnly added to shared mouse dispatch",
  },
  {
    id: "token-budget",
    label: "token-budget",
    count: "full",
    note: "tui fullscreen on Apple Terminal.app",
  },
  {
    id: "skill-body",
    label: "skill-body",
    count: "same",
    note: "session row onClick looks unchanged",
  },
  {
    id: "skill-drop",
    label: "skill-drop",
    count: "dead",
    note: "path: shared hit testing change; only clicking regressed",
  },
]);

export const RULED_OUT = Object.freeze([
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
  "Manual /compact re-attaches invoked skills after the summary per docs",
  "Skill body returns in invoked_skills block — admit reknit",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Restore post-compact skill re-attach so invoked_skills follows the summary",
  "Keep paraphrase faithful to singular/plural constraints (e.g. background subagent)",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "skill-drop",
  "precis",
  "invoked-skills",
  "compact-manual",
  "summary-only",
  "paraphrase",
]);

export const COUSINS = Object.freeze([]);

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
export const SAMPLE_KIND_SEEDED = "skill-drop";
export const SAMPLE_HOLDING_IDLE = "atelier-bench";
export const SAMPLE_HOLDING_SEEDED = "paraphrase";

export const SAMPLE_REKNIT_PROOF = Object.freeze({
  reknit: true,
  paraphrase: false,
  skillDrop: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_PARAPHRASE_PROOF = Object.freeze({
  reknit: false,
  paraphrase: true,
  skillDrop: true,
  invokedSkills: true,
  compactManual: true,
  summaryOnly: true,
  tokenBudget: true,
  skillBody: true,
  docsReattach: true,
  invokedBlock: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  reknitWatch: { ...SYNTHETIC_REKNIT },
  paraphraseWatch: { ...SYNTHETIC_PARAPHRASE },
  skillDropShape: { ...SYNTHETIC_SKILL_DROP },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds reknit: click seats in the precis; session opens" },
  { t: "skill-drop", line: "shared mouse dispatch resolves click to a node in a separate step" },
  { t: "path", line: "skill-drop — invoked-skills/precis feedback gone on fullscreen Terminal.app" },
  { t: "score", line: "when the pin never seats the booth is paraphrase — Score precis or admit reknit." },
]);

const FORCE_FLAGS = [
  "skillDrop",
  "invokedSkills",
  "compactManual",
  "summaryOnly",
  "tokenBudget",
  "skillBody",
  "docsReattach",
  "invokedBlock",
  "paraphrase",
];

const ISSUE_CUE_RE =
  /94564|paraphrase|skill-drop|claude agents|summaryOnly|hover scope|2\.1\.271|fullscreen/i;

/**
 * Educational skill-drop observer. Not a Claude Code patch.
 * Encodes only the published #94564 shapes.
 *
 * Click lands; selection does nothing.
 */
export function observeSkillDrop({
  clickLanded = true,
  selectionOpened = false,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      clickLanded: true,
      selectionOpened: true,
      dead: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const dead = clickLanded === true && selectionOpened === false;
  return {
    clickLanded,
    selectionOpened,
    dead,
    phrase: dead ? "score precis" : "admit reknit",
    note: dead
      ? "left click lands; selection does nothing; precis never seats"
      : "click seats in the notch",
    synthetic: true,
  };
}

/**
 * Educational invoked-skills observer. Not a Claude Code patch.
 * Published: click position resolved to a node in a separate step.
 */
export function inspectInvokedSkills({
  resolvedSeparately = true,
  foundRow = false,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      resolvedSeparately,
      foundRow: true,
      missed: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const missed = resolvedSeparately === true && foundRow === false;
  return {
    resolvedSeparately,
    foundRow,
    missed,
    phrase: missed ? "score precis" : "admit reknit",
    note: missed
      ? "invoked-skills — click resolved separately; row not found"
      : "invoked-skills seated the row",
    synthetic: true,
  };
}

/**
 * Educational compact-manual observer. Not a Claude Code patch.
 * Published: new hover scope / summaryOnly mechanism.
 */
export function inspectCompactManual({
  summaryOnly = true,
  compactManual = true,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      summaryOnly,
      compactManual,
      missed: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const missed = summaryOnly === true && compactManual === true;
  return {
    summaryOnly,
    compactManual,
    missed,
    phrase: missed ? "score precis" : "admit reknit",
    note: missed
      ? "compact-manual — summaryOnly mechanism added in 2.1.270"
      : "no compact-manual miss",
    synthetic: true,
  };
}

/**
 * Educational paraphrase observer. Not a Claude Code patch.
 * Published: left click session row does nothing.
 */
export function inspectParaphrase({
  leftClick = true,
  opened = false,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      leftClick,
      opened: true,
      deaf: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const deaf = leftClick === true && opened === false;
  return {
    leftClick,
    opened,
    deaf,
    phrase: deaf ? "score precis" : "admit reknit",
    note: deaf
      ? "paraphrase — left click on claude agents row is ignored"
      : "click opened the session",
    synthetic: true,
  };
}

/**
 * Educational docs-reattach observer. Not a Claude Code patch.
 * Published: arrows + Enter still work.
 */
export function inspectDocsReattach({
  arrowsEnter = true,
  opened = true,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      arrowsEnter,
      opened: true,
      stillWorks: true,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const stillWorks = arrowsEnter === true && opened === true;
  return {
    arrowsEnter,
    opened,
    stillWorks,
    phrase: stillWorks ? "score precis" : "admit reknit",
    note: stillWorks
      ? "docs-reattach — arrows + Enter still open the session"
      : "keyboard path not in the published report",
    synthetic: true,
  };
}

/**
 * Educational token-budget observer. Not a Claude Code patch.
 * Published: tui fullscreen on Terminal.app.
 */
export function inspectTokenBudget({
  preTokens = 213828,
  postTokens = 8106,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      preTokens,
      postTokens,
      flagged: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const flagged = preTokens > postTokens && postTokens < 20_000;
  return {
    preTokens,
    postTokens,
    flagged,
    phrase: flagged ? "score precis" : "admit reknit",
    note: flagged
      ? "token-budget — manual /compact collapsed preTokens ~213828 → postTokens ~8106"
      : "not the published compaction token shape",
    synthetic: true,
  };
}

/**
 * Educational skill-body observer. Not a Claude Code patch.
 * Published: session row onClick looks unchanged.
 */
export function inspectSkillBody({
  unchanged = true,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      unchanged,
      flagged: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  return {
    unchanged,
    flagged: unchanged === true,
    phrase: unchanged ? "score precis" : "admit reknit",
    note: unchanged
      ? "skill-body — session row onClick looks unchanged"
      : "row handler changed in the published compare",
    synthetic: true,
  };
}

/**
 * Educational invoked-block observer. Not a Claude Code patch.
 * Published: 2.1.270 shared mouse dispatch changed.
 */
export function inspectInvokedBlock({
  version = CODE_BUILD,
  changed = true,
  reknit = false,
} = {}) {
  if (reknit === true) {
    return {
      version: CODE_BUILD_OK,
      changed: false,
      flagged: false,
      phrase: "admit reknit",
      synthetic: true,
    };
  }
  const flagged = version === CODE_BUILD && changed === true;
  return {
    version,
    changed,
    flagged,
    phrase: flagged ? "score precis" : "admit reknit",
    note: flagged
      ? "invoked-block — 2.1.270 resolves click to a node in a separate step"
      : "shared dispatch not in the published compare",
    synthetic: true,
  };
}

export function scoreSkillDrop(input = {}) {
  const reknitHold = input.reknit === true && input.paraphrase !== true;
  const dead = observeSkillDrop({
    clickLanded: true,
    selectionOpened: reknitHold,
    reknit: reknitHold,
  });
  const paraphrase =
    !reknitHold &&
    (input.paraphrase === true ||
      input.skillDrop === true ||
      input.invokedSkills === true ||
      input.compactManual === true ||
      input.summaryOnly === true ||
      input.invokedBlock === true ||
      dead.dead === true);
  return {
    reknit: !paraphrase,
    paraphrase,
    skillDrop: paraphrase,
    dead,
    phrase: paraphrase ? "score precis" : "admit reknit",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94564") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapPrecis(input = {}) {
  const paraphrase = isParaphraseInput(input);
  const reknit = input.reknit === true && !paraphrase;
  return {
    stamp: paraphrase ? "skill-drop" : "atelier-bench",
    holdingLane: paraphrase ? "paraphrase" : "atelier-bench",
    kindLane: paraphrase ? "skill-drop" : "ratchet-wheel",
    bindLane: paraphrase ? "invoked-skills" : "precis-pin",
    ribbon: paraphrase ? "paraphrase" : "reknit",
    reknit,
  };
}

export function inspectInvokedSkillsMark(input = {}) {
  const flagged =
    input.invokedSkills === true ||
    input.paraphrase === true ||
    isParaphraseInput(input);
  if (input.reknit === true && !flagged) {
    return { stamp: "grafted-skill", flagged: false, note: "pin still reknit" };
  }
  return {
    stamp: flagged ? "invoked-skills" : "pin-idle",
    flagged,
    note: flagged
      ? "invoked-skills — click resolved separately; row not found"
      : "",
  };
}

export function inspectCompactManualMark(input = {}) {
  const missed =
    input.compactManual === true ||
    input.summaryOnly === true ||
    input.paraphrase === true ||
    input.skillDrop === true ||
    isParaphraseInput(input);
  if (input.reknit === true && !missed) {
    return { stamp: "carried", missed: false };
  }
  return {
    stamp: missed ? "compact-manual" : "pin-idle",
    missed,
    note: missed
      ? "compact-manual — summaryOnly mechanism added in 2.1.270"
      : "",
  };
}

export function inspectSummaryOnlyMark(input = {}) {
  const flagged =
    input.summaryOnly === true ||
    input.paraphrase === true ||
    isParaphraseInput(input);
  if (input.reknit === true && !flagged) {
    return { stamp: "attached", flagged: false };
  }
  return {
    stamp: flagged ? "summary-only" : "pin-idle",
    flagged,
    note: flagged
      ? "summary-only — shared mouse dispatch added summaryOnly"
      : "",
  };
}

export function inspectTokenBudgetMark(input = {}) {
  const flagged =
    input.tokenBudget === true ||
    input.paraphrase === true ||
    isParaphraseInput(input);
  if (input.reknit === true && !flagged) {
    return { stamp: "ratchet-wheel", flagged: false };
  }
  return {
    stamp: flagged ? "token-budget" : "pin-idle",
    flagged,
    note: flagged
      ? "token-budget — Apple Terminal.app; tui fullscreen"
      : "",
  };
}

export function inspectSkillBodyMark(input = {}) {
  const flagged =
    input.skillBody === true ||
    input.docsReattach === true ||
    input.invokedBlock === true ||
    input.paraphrase === true ||
    isParaphraseInput(input);
  if (input.reknit === true && !flagged) {
    return { stamp: "grafted-skill", flagged: false };
  }
  return {
    stamp: flagged ? "skill-body" : "pin-idle",
    flagged,
    note: flagged
      ? "skill-body — session row onClick looks unchanged"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "ratchet-wheel": input.paraphrase || input.skillDrop,
    "precis-pin": input.paraphrase || input.skillDrop || input.invokedSkills,
    "click-pawl": input.paraphrase || input.invokedBlock,
    "hit-plate": input.compactManual || input.summaryOnly || input.paraphrase,
    "reknit-dial": input.tokenBudget || input.paraphrase,
    "index-seat": input.skillBody || input.paraphrase,
  };
  return (
    map[id] === true ||
    input.skillDrop === true ||
    input.paraphrase === true
  );
}

function isParaphraseInput(input = {}) {
  return (
    input.paraphrase === true ||
    input.skillDrop === true ||
    input.invokedSkills === true ||
    input.compactManual === true ||
    input.summaryOnly === true ||
    input.tokenBudget === true ||
    input.skillBody === true ||
    input.docsReattach === true ||
    input.invokedBlock === true
  );
}

export function readBooth(input = {}) {
  const paraphrase = isParaphraseInput(input);
  const reknit = input.reknit === true && !paraphrase;
  return {
    mark: paraphrase ? "paraphrase" : "reknit",
    reknit,
    paraphrase,
    skillDrop: input.skillDrop === true || paraphrase,
    invokedSkills: input.invokedSkills === true,
    compactManual: input.compactManual === true,
    summaryOnly: input.summaryOnly === true,
    tokenBudget: input.tokenBudget === true,
    skillBody: input.skillBody === true,
    docsReattach: input.docsReattach === true,
    invokedBlock: input.invokedBlock === true,
    post: mapPrecis(input),
    hit: inspectInvokedSkillsMark(input),
    hover: inspectCompactManualMark(input),
    key: inspectSummaryOnlyMark(input),
    fullscreen: inspectTokenBudgetMark(input),
    row: inspectSkillBodyMark(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const PRECIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "atelier-bench",
    reknit: true,
    paraphrase: false,
    cue: "reknit",
    note: "idle HOLD: click seats in the precis; invoked-skills finds the row; session opens",
  },
  {
    t: "skill-drop",
    event: "skill-drop",
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
    invokedBlock: true,
    cue: "paraphrase",
    note: "shared mouse dispatch resolves click to a node in a separate step",
  },
  {
    t: "path",
    event: "skill-drop",
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
    compactManual: true,
    summaryOnly: true,
    tokenBudget: true,
    skillBody: true,
    docsReattach: true,
    invokedBlock: true,
    cue: "paraphrase",
    note: "skill-drop — invoked-skills/precis feedback gone on fullscreen Terminal.app",
  },
  {
    t: "score",
    event: "paraphrase",
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
    compactManual: true,
    summaryOnly: true,
    tokenBudget: true,
    skillBody: true,
    docsReattach: true,
    invokedBlock: true,
    cue: "paraphrase",
    note: "paraphrase — pin never seated; keyboard still indexes",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "atelier-bench",
    reknit: true,
    paraphrase: false,
    cue: "reknit",
    note: "positive control: click seats in the precis; session opens",
  },
  {
    t: "admit",
    event: "atelier-bench",
    reknit: true,
    cue: "reknit",
    note: "positive control: the ratchet admits reknit",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    reknit: true,
    paraphrase: false,
    skillDrop: false,
    cue: "reknit",
  };
}

export function seedReknit() {
  return { ...emptyTicket() };
}

export function seedParaphrase() {
  return {
    seed: SEEDED_WORD,
    reknit: false,
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
    compactManual: true,
    summaryOnly: true,
    tokenBudget: true,
    skillBody: true,
    docsReattach: true,
    invokedBlock: true,
    cue: "paraphrase",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_PARAPHRASE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "paraphrase",
    preferSeed: true,
    paraphrase: true,
    skillDrop: true,
    cue: "paraphrase",
  };
}

export function seedSkillDrop() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    paraphrase: true,
    skillDrop: true,
    event: "skill-drop",
    cue: "paraphrase",
  };
}

export function seedGraftedSkill() {
  return { seed: "grafted-skill", preferSeed: true, reknit: true, cue: "reknit" };
}

export function seedCarried() {
  return { seed: "carried", preferSeed: true, reknit: true, cue: "reknit" };
}

export function seedAttached() {
  return { seed: "attached", preferSeed: true, reknit: true, cue: "reknit" };
}

export function seedInvokedSkills() {
  return {
    seed: "invoked-skills",
    preferSeed: true,
    invokedSkills: true,
    cue: "paraphrase",
  };
}

export function seedCompactManual() {
  return {
    seed: "compact-manual",
    preferSeed: true,
    compactManual: true,
    cue: "paraphrase",
  };
}

export function seedSummaryOnly() {
  return {
    seed: "summary-only",
    preferSeed: true,
    summaryOnly: true,
    cue: "paraphrase",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      reknit: false,
      paraphrase: false,
      skillDrop: false,
      invokedSkills: false,
      compactManual: false,
      summaryOnly: false,
      tokenBudget: false,
      skillBody: false,
      docsReattach: false,
      invokedBlock: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    reknit: raw.reknit === true,
    paraphrase: raw.paraphrase === true || raw.event === "paraphrase",
    skillDrop: raw.skillDrop === true || raw.event === "skill-drop",
    invokedSkills: raw.invokedSkills === true || raw.event === "invoked-skills",
    compactManual: raw.compactManual === true || raw.event === "compact-manual",
    summaryOnly: raw.summaryOnly === true || raw.event === "summary-only",
    tokenBudget: raw.tokenBudget === true || raw.event === "token-budget",
    skillBody: raw.skillBody === true || raw.event === "skill-body",
    docsReattach: raw.docsReattach === true || raw.event === "docs-reattach",
    invokedBlock: raw.invokedBlock === true || raw.event === "invoked-block",
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
      (ticket.reknit != null ||
        ticket.paraphrase != null ||
        ticket.skillDrop != null ||
        ticket.invokedSkills != null ||
        ticket.compactManual != null ||
        ticket.summaryOnly != null ||
        ticket.tokenBudget != null ||
        ticket.skillBody != null ||
        ticket.docsReattach != null ||
        ticket.invokedBlock != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isReknit(row) {
  if (row.paraphrase && row.cue !== "reknit") return false;
  if (row.cue === "paraphrase" || row.cue === "skill-drop") return false;
  if (
    row.skillDrop &&
    row.invokedSkills &&
    row.cue !== "reknit" &&
    row.reknit !== true
  ) {
    return false;
  }
  if (
    row.reknit === true &&
    row.paraphrase !== true &&
    row.cue !== "paraphrase"
  ) {
    return true;
  }
  if (
    row.cue === "reknit" &&
    row.paraphrase !== true &&
    row.skillDrop !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSkillDropRow(row) {
  return (
    row.event === "skill-drop" &&
    !isReknit(row) &&
    (row.skillDrop === true ||
      row.invokedSkills === true ||
      row.paraphrase === true)
  );
}

function isParaphraseRow(row) {
  if (isReknit(row)) return false;
  if (isSkillDropRow(row) && row.cue !== "paraphrase") return false;
  if (row.cue === "paraphrase") return true;
  if (row.paraphrase === true) return true;
  if (row.skillDrop === true && row.invokedSkills === true) return true;
  if (
    row.skillDrop === true ||
    row.invokedSkills === true ||
    row.compactManual === true ||
    row.summaryOnly === true ||
    row.tokenBudget === true ||
    row.skillBody === true ||
    row.docsReattach === true ||
    row.invokedBlock === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one precis pass against the ratchet.
 * reknit: click seats in the precis; session opens.
 * paraphrase: left click lands; selection does nothing.
 * skill-drop: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSkillDropRow(row) ||
    (row.skillDrop && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "skill-drop";
  } else if (isParaphraseRow(row)) {
    verdict = "paraphrase";
  } else if (isReknit(row)) {
    verdict = "reknit";
  } else if (
    row.skillDrop ||
    row.invokedSkills ||
    row.compactManual ||
    row.summaryOnly ||
    row.tokenBudget ||
    row.skillBody ||
    row.docsReattach ||
    row.invokedBlock
  ) {
    verdict = "paraphrase";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "paraphrase";
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
    reknit: verdict === "reknit",
    paraphrase: verdict === "paraphrase" || verdict === SEEDED_WORD,
    skillDrop:
      row.skillDrop === true ||
      verdict === "skill-drop" ||
      verdict === PATH_WORD,
    invokedSkills: row.invokedSkills,
    compactManual: row.compactManual,
    summaryOnly: row.summaryOnly,
    tokenBudget: row.tokenBudget,
    skillBody: row.skillBody,
    docsReattach: row.docsReattach,
    invokedBlock: row.invokedBlock,
    cue: hold
      ? "reknit"
      : row.skillDrop || verdict === "skill-drop"
        ? "skill-drop"
        : "paraphrase",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit reknit" : "score precis",
    hitInspect: inspectInvokedSkillsMark(row),
    hoverInspect: inspectCompactManualMark(row),
    keyInspect: inspectSummaryOnlyMark(row),
    fullscreenInspect: inspectTokenBudgetMark(row),
    rowInspect: inspectSkillBodyMark(row),
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
      : PRECIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "paraphrase");
  const path = scored.filter((row) => row.verdict === "skill-drop");
  const reknit = scored.filter((row) => row.verdict === "reknit");
  const headline =
    scored.find((row) => row.event === "paraphrase") ||
    scored.find((row) => row.event === "skill-drop") ||
    scored.find((row) => row.event === "invoked-skills") ||
    charged[charged.length - 1];
  let verdict = "reknit";
  if (charged.length) verdict = "paraphrase";
  else if (path.length && !reknit.length) {
    verdict = "skill-drop";
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
    paraphraseCount: charged.length,
    pathCount: path.length,
    reknitCount: reknit.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit reknit" : "score precis",
    note: headline
      ? "After 2.1.270 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing. Issue text names no cousin tickets."
      : "published precis walk scored against reknit vs paraphrase",
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
    seeded !== "reknit" &&
    seeded !== "paraphrase" &&
    seeded !== "skill-drop" &&
    ticket.reknit == null &&
    ticket.paraphrase == null &&
    ticket.skillDrop == null &&
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
    reknit: scored.reknit ?? false,
    paraphrase: scored.paraphrase ?? false,
    skillDrop: scored.skillDrop ?? false,
    invokedSkills: scored.invokedSkills ?? false,
    compactManual: scored.compactManual ?? false,
    summaryOnly: scored.summaryOnly ?? false,
    tokenBudget: scored.tokenBudget ?? false,
    skillBody: scored.skillBody ?? false,
    docsReattach: scored.docsReattach ?? false,
    invokedBlock: scored.invokedBlock ?? false,
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
    result.skillDrop || result.paraphrase
      ? "kind=skill-drop"
      : "kind=ratchet-wheel",
    result.invokedSkills || result.paraphrase
      ? "ref=invoked-skills"
      : "ref=atelier-bench",
    result.skillDrop || result.verdict === "skill-drop"
      ? "path=skill-drop"
      : "path=reknit",
    result.cue === "reknit"
      ? "cue=reknit"
      : result.cue === "skill-drop"
        ? "cue=skill-drop"
        : "cue=paraphrase",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    reknit: result.reknit,
    paraphrase: result.paraphrase,
    skillDrop: result.skillDrop,
    invokedSkills: result.invokedSkills,
    compactManual: result.compactManual,
    summaryOnly: result.summaryOnly,
    tokenBudget: result.tokenBudget,
    skillBody: result.skillBody,
    docsReattach: result.docsReattach,
    invokedBlock: result.invokedBlock,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    hit: inspectInvokedSkillsMark({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      invokedSkills: result.invokedSkills,
    }),
    hover: inspectCompactManualMark({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      compactManual: result.compactManual,
    }),
    key: inspectSummaryOnlyMark({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      summaryOnly: result.summaryOnly,
    }),
    fullscreen: inspectTokenBudgetMark({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      tokenBudget: result.tokenBudget,
    }),
    row: inspectSkillBodyMark({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      skillBody: result.skillBody,
    }),
    post: mapPrecis({
      reknit: result.reknit,
      paraphrase: result.paraphrase,
      skillDrop: result.skillDrop,
      invokedSkills: result.invokedSkills,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      paraphrase: result.paraphrase === true || result.verdict === "paraphrase",
    })),
    leakPath: scoreSkillDrop({
      reknit: result.reknit === true && !result.paraphrase,
      paraphrase: result.paraphrase,
      skillDrop: result.skillDrop,
      invokedSkills: result.invokedSkills,
      compactManual: result.compactManual,
      summaryOnly: result.summaryOnly,
      invokedBlock: result.invokedBlock,
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
        "NON-BINDING (issue text): post-compact skill re-attach path may have failed — only the compaction summary paraphrase survives while invoked_skills / skill body is missing. Invite verify against #94564 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
