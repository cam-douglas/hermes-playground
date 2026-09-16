#!/usr/bin/env node
/**
 * Detent — mechanical detent / ratchet / hit-test /
 * notched-wheel atelier booth.
 * A *detent* is the spring-loaded pin that drops into a
 * ratchet notch so the wheel indexes with a click you can
 * feel. Session-row left-clicks should seat in that notch
 * (hit-test finds the row; the detent clicks; the session
 * opens). After 2.1.271 shared mouse dispatch, the click
 * lands but the pin never seats — deaf click / missing
 * detent on fullscreen macOS Terminal.app.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: since 2.1.271, left clicking a session row in
 * the `claude agents` list no longer opens that session.
 * Nothing happens on click. Keyboard navigation (arrows +
 * Enter) still works. Rolling back to 2.1.270 restores
 * clicking. 2.1.272 is still affected. Fullscreen TUI on
 * Apple Terminal.app. The session row's own onClick looks
 * unchanged; the shared mouse dispatch changed — click
 * position is now resolved to a node in a separate step,
 * and a new hover scope / elementKey mechanism was added.
 *
 * Encoded from anthropics/claude-code#94565 issue text only.
 * Hypothesis (NON-BINDING — issue text): the shared
 * hit-testing change looks like the likely cause, since
 * only clicking regressed. Invite verify against #94565
 * text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a Claude
 * Code fix. No network. No exploits. No live Claude.
 *
 *   node detent.mjs data/deaf-click.json
 *   echo '{"seed":"deaf-click"}' | node detent.mjs
 *
 * Idle word is notched (HOLD: click seats in the detent;
 * hit-test finds the row; session opens).
 * HOLD aliases: engaged, indexed, seated-click.
 * Primary idle is notched because Cathead already used seated.
 * Seeded word is deaf-click (#94565 path).
 * Path word is mouse-dead.
 * Product score word is detent (Score detent or
 * admit notched.).
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
  "notched",
  "deaf-click",
  "mouse-dead",
  "engaged",
  "indexed",
  "seated-click",
  "hit-test",
  "hover-scope",
  "element-key",
  "fullscreen-tui",
  "row-onclick",
  "keyboard-ok",
  "shared-dispatch",
  "terminal-app",
  "94565",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "notched";
export const PATH_WORD = "mouse-dead";
export const SEEDED_WORD = "deaf-click";
export const PRODUCT_WORD = "detent";
export const HOLD = Object.freeze(["notched"]);
export const HOLD_ALIASES = Object.freeze(["engaged", "indexed", "seated-click"]);
export const RECOVER = Object.freeze(["notched"]);
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

export const FEATURED_ISSUE = 94565;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94565";
export const TITLE =
  "Clicking a session row in `claude agents` does nothing since 2.1.271 (fullscreen, macOS Terminal.app)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:tui",
  "regression",
  "area:agent-view",
]);
export const PLATFORM = "macos";
export const SURFACE = "mouse-dead";
export const HOST =
  "Claude Code 2.1.271 and 2.1.272 broken, 2.1.270 works; macOS (Darwin 25.5.0); Apple Terminal.app; TERM=xterm-256color; Use Option as Meta key enabled; tui fullscreen";
export const CHECKED_ON =
  "Published report: left click on claude agents session row ignored since 2.1.271 on fullscreen macOS Terminal.app; keyboard arrows + Enter still open; rollback to 2.1.270 restores click; 2.1.272 still affected; shared mouse dispatch now resolves click to a node in a separate step with hover scope / elementKey";
export const BUILD = "Claude Code 2.1.271";
export const SELECTED_MODEL =
  "failure is a TUI hit-test / mouse dispatch miss, not a model-routing miss";
export const OS = "macOS (Darwin 25.5.0)";
export const PHRASE = "Score detent or admit notched.";
export const DISTRIBUTION =
  "Claude Code broken in 2.1.271 and 2.1.272; works in 2.1.270. Native installer ~/.local/share/claude/versions. macOS Darwin 25.5.0. Apple Terminal.app, TERM=xterm-256color, Use Option as Meta key enabled. TUI mode fullscreen via \"tui\": \"fullscreen\" in ~/.claude/settings.json. Command: claude agents. Left click any session row (Pinned, Ready for review, Working, Completed) is ignored. Keyboard navigation (arrows + Enter) still works. Session row onClick looks unchanged; shared mouse dispatch changed — click position resolved to a node in a separate step; new hover scope / elementKey. Workaround: pin 2.1.270 with DISABLE_AUTOUPDATER=1.";

export const CODE_BUILD = "2.1.271";
export const CODE_BUILD_OK = "2.1.270";
export const CODE_BUILD_STILL = "2.1.272";
export const TERMINAL = "Apple Terminal.app";
export const TERM = "xterm-256color";
export const TUI_MODE = "fullscreen";
export const SETTINGS_KEY = "tui";
export const COMMAND = "claude agents";
export const WORKAROUND = "DISABLE_AUTOUPDATER=1";
export const ROW_KINDS = Object.freeze([
  "Pinned",
  "Ready for review",
  "Working",
  "Completed",
]);

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_NOTCHED = Object.freeze({
  kind: "notched",
  clickSeats: true,
  mouseDead: false,
  note: "click seats in the detent; hit-test finds the row; session opens",
  synthetic: true,
});
export const SYNTHETIC_DEAF_CLICK = Object.freeze({
  kind: "deaf-click",
  clickSeats: false,
  mouseDead: true,
  note: "left click lands; selection does nothing; detent never seats",
  synthetic: true,
});
export const SYNTHETIC_MOUSE_DEAD = Object.freeze({
  kind: "mouse-dead",
  rows: [
    { lane: "Pinned", block: "left click ignored", live: false, note: "deaf-click" },
    { lane: "Ready for review", block: "left click ignored", live: false, note: "deaf-click" },
    { lane: "Working", block: "left click ignored", live: false, note: "deaf-click" },
    { lane: "Completed", block: "left click ignored", live: false, note: "deaf-click" },
    { lane: "keyboard", block: "arrows + Enter still open", live: true, note: "keyboard-ok" },
    { lane: "rollback", block: "2.1.270 restores click", live: true, note: "notched on pin" },
  ],
  note: "four session-row kinds plus keyboard-ok and rollback",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "Pinned",
    click: "ignored",
    keyboard: "opens",
    live: false,
    deafClick: true,
  },
  {
    lane: "Ready for review",
    click: "ignored",
    keyboard: "opens",
    live: false,
    deafClick: true,
  },
  {
    lane: "Working",
    click: "ignored",
    keyboard: "opens",
    live: false,
    deafClick: true,
  },
  {
    lane: "Completed",
    click: "ignored",
    keyboard: "opens",
    live: false,
    deafClick: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "ratchet-wheel",
    lost: "Ratchet wheel — session-row clicks spin the wheel but never index",
    control: "A notched wheel would seat the detent and open the row",
    story: "left click lands; the wheel does not click into the next tooth",
  },
  {
    id: "detent-pin",
    lost: "Detent pin — hit-test never drops the pin into the row notch",
    control: "the pin would seat when the click resolves to the session node",
    story: "shared dispatch now resolves click to a node in a separate step",
  },
  {
    id: "click-pawl",
    lost: "Click pawl — no tactile detent feedback; deaf click",
    control: "the pawl would click when the row is selected",
    story: "selection does nothing; keyboard arrows + Enter still work",
  },
  {
    id: "hit-plate",
    lost: "Hit plate — hover scope / elementKey miss the session row",
    control: "the plate would register the row under the cursor",
    story: "new hover scope / elementKey mechanism added in 2.1.271",
  },
  {
    id: "notched-dial",
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
    survey: "notched HOLD: click seats in the detent; hit-test finds the row; session opens",
    kind: "notched",
    note: "idle/control: the pin drops into the notch",
  },
  {
    id: "detent-pin",
    survey: "shared mouse dispatch resolves click to a node in a separate step",
    kind: "deaf-click",
    note: "seeded: the pin never drops",
  },
  {
    id: "click-pawl",
    survey: "left click on claude agents session row does nothing",
    kind: "deaf-click",
    note: "seeded: deaf-click; no detent feedback",
  },
  {
    id: "hit-plate",
    survey: "hover scope / elementKey added; hit-test misses the row",
    kind: "deaf-click",
    note: "seeded: the plate does not register the row",
  },
  {
    id: "notched-dial",
    survey: "fullscreen macOS Terminal.app; 2.1.270 works; 2.1.271/2.1.272 broken",
    kind: "deaf-click",
    note: "seeded: the dial lost its index on fullscreen",
  },
  {
    id: "index-seat",
    survey: "mouse-dead — row onClick unchanged; only clicking regressed; keyboard-ok",
    kind: "deaf-click",
    note: "path: mouse-dead names the missing detent",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "hit-test",
    label: "hit-test",
    count: "miss",
    note: "click position resolved to a node in a separate step",
  },
  {
    id: "hover-scope",
    label: "hover-scope",
    count: "scope",
    note: "new hover scope / elementKey mechanism in 2.1.271",
  },
  {
    id: "element-key",
    label: "element-key",
    count: "key",
    note: "elementKey added to shared mouse dispatch",
  },
  {
    id: "fullscreen-tui",
    label: "fullscreen-tui",
    count: "full",
    note: "tui fullscreen on Apple Terminal.app",
  },
  {
    id: "row-onclick",
    label: "row-onclick",
    count: "same",
    note: "session row onClick looks unchanged",
  },
  {
    id: "mouse-dead",
    label: "mouse-dead",
    count: "dead",
    note: "path: shared hit testing change; only clicking regressed",
  },
]);

export const RULED_OUT = Object.freeze([
  " #94564 — backup next-focus — DIFFERENT; cite only",
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
  "Left click on a claude agents session row opens that session",
  "Hit-test / detent feedback returns on fullscreen macOS Terminal.app",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Restore session-row hit-test so the shared mouse dispatch still seats the clicked row",
  "Keep keyboard arrows + Enter; do not lose the click path after hover scope / elementKey",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mouse-dead",
  "detent",
  "hit-test",
  "hover-scope",
  "element-key",
  "deaf-click",
]);

export const COUSINS = Object.freeze([]);

export const BACKUPS = Object.freeze([
  { issue: 94564, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
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
export const SAMPLE_KIND_SEEDED = "mouse-dead";
export const SAMPLE_HOLDING_IDLE = "atelier-bench";
export const SAMPLE_HOLDING_SEEDED = "deaf-click";

export const SAMPLE_NOTCHED_PROOF = Object.freeze({
  notched: true,
  deafClick: false,
  mouseDead: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DEAF_CLICK_PROOF = Object.freeze({
  notched: false,
  deafClick: true,
  mouseDead: true,
  hitTest: true,
  hoverScope: true,
  elementKey: true,
  fullscreenTui: true,
  rowOnclick: true,
  keyboardOk: true,
  sharedDispatch: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  notchedWatch: { ...SYNTHETIC_NOTCHED },
  deafClickWatch: { ...SYNTHETIC_DEAF_CLICK },
  mouseDeadShape: { ...SYNTHETIC_MOUSE_DEAD },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds notched: click seats in the detent; session opens" },
  { t: "mouse-dead", line: "shared mouse dispatch resolves click to a node in a separate step" },
  { t: "path", line: "mouse-dead — hit-test/detent feedback gone on fullscreen Terminal.app" },
  { t: "score", line: "when the pin never seats the booth is deaf-click — Score detent or admit notched." },
]);

const FORCE_FLAGS = [
  "mouseDead",
  "hitTest",
  "hoverScope",
  "elementKey",
  "fullscreenTui",
  "rowOnclick",
  "keyboardOk",
  "sharedDispatch",
  "deafClick",
];

const ISSUE_CUE_RE =
  /94565|deaf-click|mouse-dead|claude agents|elementKey|hover scope|2\.1\.271|fullscreen/i;

/**
 * Educational mouse-dead observer. Not a Claude Code patch.
 * Encodes only the published #94565 shapes.
 *
 * Click lands; selection does nothing.
 */
export function observeMouseDead({
  clickLanded = true,
  selectionOpened = false,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      clickLanded: true,
      selectionOpened: true,
      dead: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const dead = clickLanded === true && selectionOpened === false;
  return {
    clickLanded,
    selectionOpened,
    dead,
    phrase: dead ? "score detent" : "admit notched",
    note: dead
      ? "left click lands; selection does nothing; detent never seats"
      : "click seats in the notch",
    synthetic: true,
  };
}

/**
 * Educational hit-test observer. Not a Claude Code patch.
 * Published: click position resolved to a node in a separate step.
 */
export function inspectHitTest({
  resolvedSeparately = true,
  foundRow = false,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      resolvedSeparately,
      foundRow: true,
      missed: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const missed = resolvedSeparately === true && foundRow === false;
  return {
    resolvedSeparately,
    foundRow,
    missed,
    phrase: missed ? "score detent" : "admit notched",
    note: missed
      ? "hit-test — click resolved separately; row not found"
      : "hit-test seated the row",
    synthetic: true,
  };
}

/**
 * Educational hover-scope observer. Not a Claude Code patch.
 * Published: new hover scope / elementKey mechanism.
 */
export function inspectHoverScope({
  elementKey = true,
  hoverScope = true,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      elementKey,
      hoverScope,
      missed: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const missed = elementKey === true && hoverScope === true;
  return {
    elementKey,
    hoverScope,
    missed,
    phrase: missed ? "score detent" : "admit notched",
    note: missed
      ? "hover-scope — elementKey mechanism added in 2.1.271"
      : "no hover-scope miss",
    synthetic: true,
  };
}

/**
 * Educational deaf-click observer. Not a Claude Code patch.
 * Published: left click session row does nothing.
 */
export function inspectDeafClick({
  leftClick = true,
  opened = false,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      leftClick,
      opened: true,
      deaf: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const deaf = leftClick === true && opened === false;
  return {
    leftClick,
    opened,
    deaf,
    phrase: deaf ? "score detent" : "admit notched",
    note: deaf
      ? "deaf-click — left click on claude agents row is ignored"
      : "click opened the session",
    synthetic: true,
  };
}

/**
 * Educational keyboard-ok observer. Not a Claude Code patch.
 * Published: arrows + Enter still work.
 */
export function inspectKeyboardOk({
  arrowsEnter = true,
  opened = true,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      arrowsEnter,
      opened: true,
      stillWorks: true,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const stillWorks = arrowsEnter === true && opened === true;
  return {
    arrowsEnter,
    opened,
    stillWorks,
    phrase: stillWorks ? "score detent" : "admit notched",
    note: stillWorks
      ? "keyboard-ok — arrows + Enter still open the session"
      : "keyboard path not in the published report",
    synthetic: true,
  };
}

/**
 * Educational fullscreen-tui observer. Not a Claude Code patch.
 * Published: tui fullscreen on Terminal.app.
 */
export function inspectFullscreenTui({
  fullscreen = true,
  terminal = TERMINAL,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      fullscreen,
      terminal,
      flagged: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const flagged = fullscreen === true && terminal === TERMINAL;
  return {
    fullscreen,
    terminal,
    flagged,
    phrase: flagged ? "score detent" : "admit notched",
    note: flagged
      ? "fullscreen-tui — Apple Terminal.app; tui fullscreen"
      : "not the published fullscreen Terminal.app shape",
    synthetic: true,
  };
}

/**
 * Educational row-onclick observer. Not a Claude Code patch.
 * Published: session row onClick looks unchanged.
 */
export function inspectRowOnclick({
  unchanged = true,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      unchanged,
      flagged: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  return {
    unchanged,
    flagged: unchanged === true,
    phrase: unchanged ? "score detent" : "admit notched",
    note: unchanged
      ? "row-onclick — session row onClick looks unchanged"
      : "row handler changed in the published compare",
    synthetic: true,
  };
}

/**
 * Educational shared-dispatch observer. Not a Claude Code patch.
 * Published: 2.1.271 shared mouse dispatch changed.
 */
export function inspectSharedDispatch({
  version = CODE_BUILD,
  changed = true,
  notched = false,
} = {}) {
  if (notched === true) {
    return {
      version: CODE_BUILD_OK,
      changed: false,
      flagged: false,
      phrase: "admit notched",
      synthetic: true,
    };
  }
  const flagged = version === CODE_BUILD && changed === true;
  return {
    version,
    changed,
    flagged,
    phrase: flagged ? "score detent" : "admit notched",
    note: flagged
      ? "shared-dispatch — 2.1.271 resolves click to a node in a separate step"
      : "shared dispatch not in the published compare",
    synthetic: true,
  };
}

export function scoreMouseDead(input = {}) {
  const notchedHold = input.notched === true && input.deafClick !== true;
  const dead = observeMouseDead({
    clickLanded: true,
    selectionOpened: notchedHold,
    notched: notchedHold,
  });
  const deafClick =
    !notchedHold &&
    (input.deafClick === true ||
      input.mouseDead === true ||
      input.hitTest === true ||
      input.hoverScope === true ||
      input.elementKey === true ||
      input.sharedDispatch === true ||
      dead.dead === true);
  return {
    notched: !deafClick,
    deafClick,
    mouseDead: deafClick,
    dead,
    phrase: deafClick ? "score detent" : "admit notched",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94565") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapDetent(input = {}) {
  const deafClick = isDeafClickInput(input);
  const notched = input.notched === true && !deafClick;
  return {
    stamp: deafClick ? "mouse-dead" : "atelier-bench",
    holdingLane: deafClick ? "deaf-click" : "atelier-bench",
    kindLane: deafClick ? "mouse-dead" : "ratchet-wheel",
    bindLane: deafClick ? "hit-test" : "detent-pin",
    ribbon: deafClick ? "deaf-click" : "notched",
    notched,
  };
}

export function inspectHitTestMark(input = {}) {
  const flagged =
    input.hitTest === true ||
    input.deafClick === true ||
    isDeafClickInput(input);
  if (input.notched === true && !flagged) {
    return { stamp: "engaged", flagged: false, note: "pin still notched" };
  }
  return {
    stamp: flagged ? "hit-test" : "pin-idle",
    flagged,
    note: flagged
      ? "hit-test — click resolved separately; row not found"
      : "",
  };
}

export function inspectHoverScopeMark(input = {}) {
  const missed =
    input.hoverScope === true ||
    input.elementKey === true ||
    input.deafClick === true ||
    input.mouseDead === true ||
    isDeafClickInput(input);
  if (input.notched === true && !missed) {
    return { stamp: "indexed", missed: false };
  }
  return {
    stamp: missed ? "hover-scope" : "pin-idle",
    missed,
    note: missed
      ? "hover-scope — elementKey mechanism added in 2.1.271"
      : "",
  };
}

export function inspectElementKeyMark(input = {}) {
  const flagged =
    input.elementKey === true ||
    input.deafClick === true ||
    isDeafClickInput(input);
  if (input.notched === true && !flagged) {
    return { stamp: "seated-click", flagged: false };
  }
  return {
    stamp: flagged ? "element-key" : "pin-idle",
    flagged,
    note: flagged
      ? "element-key — shared mouse dispatch added elementKey"
      : "",
  };
}

export function inspectFullscreenMark(input = {}) {
  const flagged =
    input.fullscreenTui === true ||
    input.deafClick === true ||
    isDeafClickInput(input);
  if (input.notched === true && !flagged) {
    return { stamp: "ratchet-wheel", flagged: false };
  }
  return {
    stamp: flagged ? "fullscreen-tui" : "pin-idle",
    flagged,
    note: flagged
      ? "fullscreen-tui — Apple Terminal.app; tui fullscreen"
      : "",
  };
}

export function inspectRowOnclickMark(input = {}) {
  const flagged =
    input.rowOnclick === true ||
    input.keyboardOk === true ||
    input.sharedDispatch === true ||
    input.deafClick === true ||
    isDeafClickInput(input);
  if (input.notched === true && !flagged) {
    return { stamp: "engaged", flagged: false };
  }
  return {
    stamp: flagged ? "row-onclick" : "pin-idle",
    flagged,
    note: flagged
      ? "row-onclick — session row onClick looks unchanged"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "ratchet-wheel": input.deafClick || input.mouseDead,
    "detent-pin": input.deafClick || input.mouseDead || input.hitTest,
    "click-pawl": input.deafClick || input.sharedDispatch,
    "hit-plate": input.hoverScope || input.elementKey || input.deafClick,
    "notched-dial": input.fullscreenTui || input.deafClick,
    "index-seat": input.rowOnclick || input.deafClick,
  };
  return (
    map[id] === true ||
    input.mouseDead === true ||
    input.deafClick === true
  );
}

function isDeafClickInput(input = {}) {
  return (
    input.deafClick === true ||
    input.mouseDead === true ||
    input.hitTest === true ||
    input.hoverScope === true ||
    input.elementKey === true ||
    input.fullscreenTui === true ||
    input.rowOnclick === true ||
    input.keyboardOk === true ||
    input.sharedDispatch === true
  );
}

export function readBooth(input = {}) {
  const deafClick = isDeafClickInput(input);
  const notched = input.notched === true && !deafClick;
  return {
    mark: deafClick ? "deaf-click" : "notched",
    notched,
    deafClick,
    mouseDead: input.mouseDead === true || deafClick,
    hitTest: input.hitTest === true,
    hoverScope: input.hoverScope === true,
    elementKey: input.elementKey === true,
    fullscreenTui: input.fullscreenTui === true,
    rowOnclick: input.rowOnclick === true,
    keyboardOk: input.keyboardOk === true,
    sharedDispatch: input.sharedDispatch === true,
    post: mapDetent(input),
    hit: inspectHitTestMark(input),
    hover: inspectHoverScopeMark(input),
    key: inspectElementKeyMark(input),
    fullscreen: inspectFullscreenMark(input),
    row: inspectRowOnclickMark(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const DETENT_WALK = Object.freeze([
  {
    t: "idle",
    event: "atelier-bench",
    notched: true,
    deafClick: false,
    cue: "notched",
    note: "idle HOLD: click seats in the detent; hit-test finds the row; session opens",
  },
  {
    t: "mouse-dead",
    event: "mouse-dead",
    deafClick: true,
    mouseDead: true,
    hitTest: true,
    sharedDispatch: true,
    cue: "deaf-click",
    note: "shared mouse dispatch resolves click to a node in a separate step",
  },
  {
    t: "path",
    event: "mouse-dead",
    deafClick: true,
    mouseDead: true,
    hitTest: true,
    hoverScope: true,
    elementKey: true,
    fullscreenTui: true,
    rowOnclick: true,
    keyboardOk: true,
    sharedDispatch: true,
    cue: "deaf-click",
    note: "mouse-dead — hit-test/detent feedback gone on fullscreen Terminal.app",
  },
  {
    t: "score",
    event: "deaf-click",
    deafClick: true,
    mouseDead: true,
    hitTest: true,
    hoverScope: true,
    elementKey: true,
    fullscreenTui: true,
    rowOnclick: true,
    keyboardOk: true,
    sharedDispatch: true,
    cue: "deaf-click",
    note: "deaf-click — pin never seated; keyboard still indexes",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "atelier-bench",
    notched: true,
    deafClick: false,
    cue: "notched",
    note: "positive control: click seats in the detent; session opens",
  },
  {
    t: "admit",
    event: "atelier-bench",
    notched: true,
    cue: "notched",
    note: "positive control: the ratchet admits notched",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    notched: true,
    deafClick: false,
    mouseDead: false,
    cue: "notched",
  };
}

export function seedNotched() {
  return { ...emptyTicket() };
}

export function seedDeafClick() {
  return {
    seed: SEEDED_WORD,
    notched: false,
    deafClick: true,
    mouseDead: true,
    hitTest: true,
    hoverScope: true,
    elementKey: true,
    fullscreenTui: true,
    rowOnclick: true,
    keyboardOk: true,
    sharedDispatch: true,
    cue: "deaf-click",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DEAF_CLICK_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "deaf-click",
    preferSeed: true,
    deafClick: true,
    mouseDead: true,
    cue: "deaf-click",
  };
}

export function seedMouseDead() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    deafClick: true,
    mouseDead: true,
    event: "mouse-dead",
    cue: "deaf-click",
  };
}

export function seedEngaged() {
  return { seed: "engaged", preferSeed: true, notched: true, cue: "notched" };
}

export function seedIndexed() {
  return { seed: "indexed", preferSeed: true, notched: true, cue: "notched" };
}

export function seedSeatedClick() {
  return { seed: "seated-click", preferSeed: true, notched: true, cue: "notched" };
}

export function seedHitTest() {
  return {
    seed: "hit-test",
    preferSeed: true,
    hitTest: true,
    cue: "deaf-click",
  };
}

export function seedHoverScope() {
  return {
    seed: "hover-scope",
    preferSeed: true,
    hoverScope: true,
    cue: "deaf-click",
  };
}

export function seedElementKey() {
  return {
    seed: "element-key",
    preferSeed: true,
    elementKey: true,
    cue: "deaf-click",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      notched: false,
      deafClick: false,
      mouseDead: false,
      hitTest: false,
      hoverScope: false,
      elementKey: false,
      fullscreenTui: false,
      rowOnclick: false,
      keyboardOk: false,
      sharedDispatch: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    notched: raw.notched === true,
    deafClick: raw.deafClick === true || raw.event === "deaf-click",
    mouseDead: raw.mouseDead === true || raw.event === "mouse-dead",
    hitTest: raw.hitTest === true || raw.event === "hit-test",
    hoverScope: raw.hoverScope === true || raw.event === "hover-scope",
    elementKey: raw.elementKey === true || raw.event === "element-key",
    fullscreenTui: raw.fullscreenTui === true || raw.event === "fullscreen-tui",
    rowOnclick: raw.rowOnclick === true || raw.event === "row-onclick",
    keyboardOk: raw.keyboardOk === true || raw.event === "keyboard-ok",
    sharedDispatch: raw.sharedDispatch === true || raw.event === "shared-dispatch",
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
      (ticket.notched != null ||
        ticket.deafClick != null ||
        ticket.mouseDead != null ||
        ticket.hitTest != null ||
        ticket.hoverScope != null ||
        ticket.elementKey != null ||
        ticket.fullscreenTui != null ||
        ticket.rowOnclick != null ||
        ticket.keyboardOk != null ||
        ticket.sharedDispatch != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isNotched(row) {
  if (row.deafClick && row.cue !== "notched") return false;
  if (row.cue === "deaf-click" || row.cue === "mouse-dead") return false;
  if (
    row.mouseDead &&
    row.hitTest &&
    row.cue !== "notched" &&
    row.notched !== true
  ) {
    return false;
  }
  if (
    row.notched === true &&
    row.deafClick !== true &&
    row.cue !== "deaf-click"
  ) {
    return true;
  }
  if (
    row.cue === "notched" &&
    row.deafClick !== true &&
    row.mouseDead !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isMouseDead(row) {
  return (
    row.event === "mouse-dead" &&
    !isNotched(row) &&
    (row.mouseDead === true ||
      row.hitTest === true ||
      row.deafClick === true)
  );
}

function isDeafClickRow(row) {
  if (isNotched(row)) return false;
  if (isMouseDead(row) && row.cue !== "deaf-click") return false;
  if (row.cue === "deaf-click") return true;
  if (row.deafClick === true) return true;
  if (row.mouseDead === true && row.hitTest === true) return true;
  if (
    row.mouseDead === true ||
    row.hitTest === true ||
    row.hoverScope === true ||
    row.elementKey === true ||
    row.fullscreenTui === true ||
    row.rowOnclick === true ||
    row.keyboardOk === true ||
    row.sharedDispatch === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one detent pass against the ratchet.
 * notched: click seats in the detent; session opens.
 * deaf-click: left click lands; selection does nothing.
 * mouse-dead: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMouseDead(row) ||
    (row.mouseDead && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mouse-dead";
  } else if (isDeafClickRow(row)) {
    verdict = "deaf-click";
  } else if (isNotched(row)) {
    verdict = "notched";
  } else if (
    row.mouseDead ||
    row.hitTest ||
    row.hoverScope ||
    row.elementKey ||
    row.fullscreenTui ||
    row.rowOnclick ||
    row.keyboardOk ||
    row.sharedDispatch
  ) {
    verdict = "deaf-click";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "deaf-click";
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
    notched: verdict === "notched",
    deafClick: verdict === "deaf-click" || verdict === SEEDED_WORD,
    mouseDead:
      row.mouseDead === true ||
      verdict === "mouse-dead" ||
      verdict === PATH_WORD,
    hitTest: row.hitTest,
    hoverScope: row.hoverScope,
    elementKey: row.elementKey,
    fullscreenTui: row.fullscreenTui,
    rowOnclick: row.rowOnclick,
    keyboardOk: row.keyboardOk,
    sharedDispatch: row.sharedDispatch,
    cue: hold
      ? "notched"
      : row.mouseDead || verdict === "mouse-dead"
        ? "mouse-dead"
        : "deaf-click",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit notched" : "score detent",
    hitInspect: inspectHitTestMark(row),
    hoverInspect: inspectHoverScopeMark(row),
    keyInspect: inspectElementKeyMark(row),
    fullscreenInspect: inspectFullscreenMark(row),
    rowInspect: inspectRowOnclickMark(row),
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
      : DETENT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "deaf-click");
  const path = scored.filter((row) => row.verdict === "mouse-dead");
  const notched = scored.filter((row) => row.verdict === "notched");
  const headline =
    scored.find((row) => row.event === "deaf-click") ||
    scored.find((row) => row.event === "mouse-dead") ||
    scored.find((row) => row.event === "hit-test") ||
    charged[charged.length - 1];
  let verdict = "notched";
  if (charged.length) verdict = "deaf-click";
  else if (path.length && !notched.length) {
    verdict = "mouse-dead";
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
    deafClickCount: charged.length,
    pathCount: path.length,
    notchedCount: notched.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit notched" : "score detent",
    note: headline
      ? "After 2.1.271 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing. Issue text names no cousin tickets."
      : "published detent walk scored against notched vs deaf-click",
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
    seeded !== "notched" &&
    seeded !== "deaf-click" &&
    seeded !== "mouse-dead" &&
    ticket.notched == null &&
    ticket.deafClick == null &&
    ticket.mouseDead == null &&
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
    notched: scored.notched ?? false,
    deafClick: scored.deafClick ?? false,
    mouseDead: scored.mouseDead ?? false,
    hitTest: scored.hitTest ?? false,
    hoverScope: scored.hoverScope ?? false,
    elementKey: scored.elementKey ?? false,
    fullscreenTui: scored.fullscreenTui ?? false,
    rowOnclick: scored.rowOnclick ?? false,
    keyboardOk: scored.keyboardOk ?? false,
    sharedDispatch: scored.sharedDispatch ?? false,
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
    result.mouseDead || result.deafClick
      ? "kind=mouse-dead"
      : "kind=ratchet-wheel",
    result.hitTest || result.deafClick
      ? "ref=hit-test"
      : "ref=atelier-bench",
    result.mouseDead || result.verdict === "mouse-dead"
      ? "path=mouse-dead"
      : "path=notched",
    result.cue === "notched"
      ? "cue=notched"
      : result.cue === "mouse-dead"
        ? "cue=mouse-dead"
        : "cue=deaf-click",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    notched: result.notched,
    deafClick: result.deafClick,
    mouseDead: result.mouseDead,
    hitTest: result.hitTest,
    hoverScope: result.hoverScope,
    elementKey: result.elementKey,
    fullscreenTui: result.fullscreenTui,
    rowOnclick: result.rowOnclick,
    keyboardOk: result.keyboardOk,
    sharedDispatch: result.sharedDispatch,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    hit: inspectHitTestMark({
      notched: result.notched,
      deafClick: result.deafClick,
      hitTest: result.hitTest,
    }),
    hover: inspectHoverScopeMark({
      notched: result.notched,
      deafClick: result.deafClick,
      hoverScope: result.hoverScope,
    }),
    key: inspectElementKeyMark({
      notched: result.notched,
      deafClick: result.deafClick,
      elementKey: result.elementKey,
    }),
    fullscreen: inspectFullscreenMark({
      notched: result.notched,
      deafClick: result.deafClick,
      fullscreenTui: result.fullscreenTui,
    }),
    row: inspectRowOnclickMark({
      notched: result.notched,
      deafClick: result.deafClick,
      rowOnclick: result.rowOnclick,
    }),
    post: mapDetent({
      notched: result.notched,
      deafClick: result.deafClick,
      mouseDead: result.mouseDead,
      hitTest: result.hitTest,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      deafClick: result.deafClick === true || result.verdict === "deaf-click",
    })),
    leakPath: scoreMouseDead({
      notched: result.notched === true && !result.deafClick,
      deafClick: result.deafClick,
      mouseDead: result.mouseDead,
      hitTest: result.hitTest,
      hoverScope: result.hoverScope,
      elementKey: result.elementKey,
      sharedDispatch: result.sharedDispatch,
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
        "NON-BINDING (issue text): the shared hit-testing change looks like the likely cause, since only clicking regressed — click position is now resolved to a node in a separate step, and a new hover scope / elementKey mechanism was added. Invite verify against #94565 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
