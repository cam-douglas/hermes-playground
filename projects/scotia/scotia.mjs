#!/usr/bin/env node
/**
 * Scotia — classical scotia / shadow-gap / column-molding booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * The DECSTBM scroll-region renderer leaves 2–3 blank rows under the
 * prompt on Linux (VTE / Black Box). Once the conversation fills the
 * screen, the TUI stops short of the window bottom. Blank rows sit
 * below the last line of the bottom block (auto-mode hint / remote-
 * control indicator). Sometimes one more blank row appears mid-session.
 * Rows stay empty forever. macOS with the same setup (kitty / iTerm /
 * Terminal.app on 2.1.268) does NOT show the gap — the bottom block
 * ends on the last row.
 *
 *   node scotia.mjs data/scotiated.json
 *   echo '{"seed":"scotiated"}' | node scotia.mjs
 *
 * Idle word is flush (HOLD: bottom block ends on last terminal row;
 * no hollow gap).
 * Seeded word is scotiated (#93764 — 2–3 blank rows under the bottom
 * block on Linux VTE with DECSTBM on).
 * Path word is decstbm-undershoot.
 * Product score word is scotia (Score scotia or admit flush.).
 *
 * Encoded from anthropics/claude-code#93764 issue text only.
 * Hypothesis (NON-BINDING): bottom chrome height reservation under
 * DECSTBM is oversized vs what is drawn on VTE Linux, so cleared
 * margin rows appear as a permanent blank band; macOS default path
 * does not hit that undershoot. Verify against #93764 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "flush",
  "scotiated",
  "scotia",
  "decstbm-undershoot",
  "hold",
  "seated",
  "last-row",
  "mac-flush",
  "blank-band",
  "vte-scroll",
  "tengu-marlin-porch",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "flush";
export const PATH_WORD = "decstbm-undershoot";
export const SEEDED_WORD = "scotiated";
export const PRODUCT_WORD = "scotia";
export const HOLD = Object.freeze(["flush", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "flush",
  "seated",
  "last-row",
  "mac-flush",
]);
export const RECOVER = Object.freeze(["flush", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "unreaped-ampersand",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
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
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scotiated" && name !== "scotia"),
);

export const FEATURED_ISSUE = 93764;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93764";
export const TITLE =
  "[BUG] DECSTBM renderer leaves 2-3 blank rows under the prompt on Linux (VTE / Black Box)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tui",
]);
export const PLATFORM = "linux";
export const CLAUDE_VERSION = "2.1.267";
export const GOOD_VERSION =
  "macOS 2.1.268 kitty/iTerm/Terminal.app — bottom block ends on the last row; no hollow gap";
export const SURFACE = "tui-decstbm";
export const HOST = "linux-vte";
export const INSTALL_PATH = "native Linux binary; TERM=xterm-256color; no tmux/zellij";
export const COMMAND =
  "fill the conversation until the TUI occupies the window — watch the 2–3 blank rows under the bottom block";
export const PHRASE = "Score scotia or admit flush.";
export const DISTRIBUTION =
  "Claude Code 2.1.267 native Linux. Terminal: Black Box (VTE 0.84, XTVERSION reply VTE(8401)), TERM=xterm-256color, no tmux/zellij. Once the conversation fills the screen, the TUI stops 2–3 rows short of the window bottom. Blank rows sit below the last line of the bottom block (the auto-mode hint, or the remote-control indicator when shown). Sometimes one more blank row is added during a session. The rows stay empty at all times. On macOS with the same setup (Claude Code 2.1.268 on kitty, iTerm2, Terminal.app) the bottom block ends on the last row. Debug log: XTVERSION VTE(8401); DECRQM(2026) sync unsupported; DECSTBM enabled (TMUX unset, ZELLIJ unset, TERM_PROGRAM=Black Box). Renderer enabled via CLAUDE_CODE_DECSTBM or remote gate tengu_marlin_porch. Env var unset so the gate is on. No local toggle to disable. The gap looks like the bottom block is laid out taller than what is actually drawn, and the extra rows are cleared instead of being given back to the content area.";
export const RULED_OUT = Object.freeze([
  "Terminal padding — padding is 0; a plain shell in the same window uses every row",
  "statusLine script — same gap with a different statusLine script and with the old one",
  "Environment pollution — same gap with env -i HOME=... PATH=... TERM=xterm-256color LANG=C.UTF-8 claude",
  "LINES/COLUMNS — not set anywhere; stty size reports the real window size",
  "A single Linux emulator — other Linux terminal emulators show the same gap",
]);
export const EXPECTED = Object.freeze([
  "the bottom block should end on the last row of the terminal, as it does with the default renderer",
  "reserved chrome height should match what is actually drawn so leftover rows return to content",
  "macOS flush behavior (last row seated) should hold on Linux VTE when DECSTBM is on",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "column-base", label: "scotia hollow", count: "atelier", note: "concave molding under the column — not press-room, galley, or turf" },
  { id: "decstbm-brackets", label: "DECSTBM brackets", count: "scroll-region", note: "DECSTBM enabled; TMUX/ZELLIJ unset; TERM_PROGRAM=Black Box" },
  { id: "vte-chip", label: "VTE chip", count: "VTE(8401)", note: "XTVERSION reply VTE(8401); Black Box VTE 0.84" },
  { id: "blank-void", label: "blank-row void", count: "2-3 rows", note: "empty band under the bottom block; rows stay empty forever" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "flush-gate",
    survey: "bottom block ends on the last terminal row; no hollow gap",
    kind: "flush",
    note: "idle: the atelier stays flush — the hold/good path",
  },
  {
    id: "blank-band",
    survey: "TUI stops 2–3 rows short; blank rows sit under the auto-mode / remote-control block",
    kind: "scotiated",
    note: "seeded: hollow shadow-gap under the prompt on Linux VTE",
  },
  {
    id: "vte-scroll",
    survey: "XTVERSION VTE(8401); DECSTBM enabled on Black Box; other Linux emulators still gap",
    kind: "scotiated",
    note: "seeded: VTE scroll-region path; macOS kitty/iTerm/Terminal.app stay flush",
  },
  {
    id: "tengu-marlin-porch",
    survey: "renderer on via CLAUDE_CODE_DECSTBM or remote gate tengu_marlin_porch; env unset so gate is on; no disable",
    kind: "scotiated",
    note: "seeded: no local toggle; extra rows cleared instead of returned to content",
  },
  {
    id: "decstbm-undershoot",
    survey: "bottom chrome reserved taller than drawn; 2–3 cleared rows stay as a permanent blank band",
    kind: "scotiated",
    note: "path: DECSTBM undershoot leaves a scotia hollow under the prompt",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "decstbm-undershoot",
  "scotiated",
  "blank-band",
  "vte-scroll",
  "tengu-marlin-porch",
]);

export const COUSINS = Object.freeze([
  {
    issue: 4136,
    title: "blank space at the bottom of the terminal on Linux",
    state: "CLOSED",
    citeOnly: true,
    why: "closed stale — blank space bottom Linux; cite only",
  },
  {
    issue: 83660,
    title: "one unused row under tmux",
    state: "OPEN",
    citeOnly: true,
    why: "one unused row under tmux — a similar height reservation; cite only",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "canard",
  "stet",
  "blindside",
  "interdict",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
  "cachet",
  "ukase",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
]);

export const SAMPLE_FLUSH_ATELIER = Object.freeze({
  lastRow: true,
  hollowGap: false,
  blankRows: 0,
  decstbmOn: false,
  version: GOOD_VERSION,
});

export const SAMPLE_SCOTIATED_ATELIER = Object.freeze({
  lastRow: false,
  hollowGap: true,
  blankRows: 3,
  decstbmOn: true,
  vteLinux: true,
  tenguGate: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_BLANK_BAND = Object.freeze({
  blankRows: 3,
  underBottomBlock: true,
  foreverEmpty: true,
  midSessionExtra: true,
});

export const SAMPLE_FLUSH_BAND = Object.freeze({
  blankRows: 0,
  underBottomBlock: false,
  foreverEmpty: false,
  midSessionExtra: false,
  seated: true,
});

export const SAMPLE_VTE = Object.freeze({
  xtversion: "VTE(8401)",
  emulator: "Black Box",
  vte: "0.84",
  term: "xterm-256color",
  linux: true,
  macFlush: false,
});

export const SAMPLE_MAC_FLUSH_HOST = Object.freeze({
  xtversion: "kitty/iTerm/Terminal.app",
  emulator: "macOS",
  linux: false,
  macFlush: true,
  lastRow: true,
});

export const SAMPLE_DECSTBM = Object.freeze({
  enabled: true,
  tmux: false,
  zellij: false,
  termProgram: "Black Box",
  envVar: false,
  tenguMarlinPorch: true,
  noDisable: true,
});

export const SAMPLE_FLUSH_REGION = Object.freeze({
  enabled: false,
  tmux: false,
  zellij: false,
  defaultRenderer: true,
  lastRow: true,
});

export const SAMPLE_FLUSH_SURFACE = Object.freeze({
  lastRow: true,
  hollowGap: false,
  returnedToContent: true,
});

export const SAMPLE_SCOTIATED_SURFACE = Object.freeze({
  lastRow: false,
  hollowGap: true,
  returnedToContent: false,
  laidOutTallerThanDrawn: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds flush: bottom block ends on the last terminal row; no hollow gap" },
  { t: "blank-band", line: "TUI stops 2–3 rows short; blank rows sit under the auto-mode / remote-control block" },
  { t: "vte-scroll", line: "XTVERSION VTE(8401); DECSTBM enabled on Black Box Linux; macOS stays flush" },
  { t: "tengu-marlin-porch", line: "gate tengu_marlin_porch on; CLAUDE_CODE_DECSTBM unset; no local disable" },
  { t: "path", line: "decstbm-undershoot — reserved chrome taller than drawn; extra rows cleared, not returned" },
  { t: "score", line: "when Linux VTE leaves a 2–3 row hollow under the prompt the booth is scotia — Score scotia or admit flush." },
]);

export function inspectBlankBand(input = {}) {
  const band =
    input.band && typeof input.band === "object"
      ? input.band
      : input.flush === true && input.scotiated !== true
        ? SAMPLE_FLUSH_BAND
        : SAMPLE_BLANK_BAND;
  const forced =
    input.blankBand === true ||
    input.event === "blank-band" ||
    input.event === "scotiated" ||
    input.event === "scotia" ||
    input.scotiated === true;
  const hollow = forced ? true : band.blankRows > 0 && input.flush !== true;
  return {
    blankRows: hollow ? band.blankRows || 3 : 0,
    underBottomBlock: hollow,
    foreverEmpty: hollow,
    stamp: hollow ? "blank-band" : "last-row",
    note: hollow
      ? "2–3 blank rows under the bottom block; rows stay empty forever"
      : "bottom block seated on the last terminal row; no hollow gap",
  };
}

export function inspectVteScroll(input = {}) {
  const host =
    input.vte && typeof input.vte === "object"
      ? input.vte
      : input.flush === true && input.scotiated !== true
        ? SAMPLE_MAC_FLUSH_HOST
        : SAMPLE_VTE;
  const forced =
    input.vteScroll === true ||
    input.event === "vte-scroll" ||
    input.event === "scotiated" ||
    input.event === "scotia";
  const vte = forced ? true : host.linux === true && input.flush !== true;
  return {
    linux: vte,
    xtversion: vte ? "VTE(8401)" : host.xtversion || "mac-flush",
    stamp: vte ? "vte-scroll" : "mac-flush",
    note: vte
      ? "VTE(8401) Black Box Linux — DECSTBM scroll-region path shows the gap"
      : "macOS kitty/iTerm/Terminal.app — bottom block ends on the last row",
  };
}

export function inspectTenguGate(input = {}) {
  const region =
    input.region && typeof input.region === "object"
      ? input.region
      : input.flush === true && input.scotiated !== true
        ? SAMPLE_FLUSH_REGION
        : SAMPLE_DECSTBM;
  const forced =
    input.tenguMarlinPorch === true ||
    input.event === "tengu-marlin-porch" ||
    input.event === "decstbm-undershoot" ||
    input.event === "scotiated" ||
    input.event === "scotia";
  const gate = forced ? true : region.enabled === true && input.flush !== true;
  return {
    enabled: gate,
    tenguMarlinPorch: gate,
    noDisable: gate,
    stamp: gate ? "tengu-marlin-porch" : "default-renderer",
    note: gate
      ? "DECSTBM on via tengu_marlin_porch (CLAUDE_CODE_DECSTBM unset); no local toggle"
      : "default renderer; reserved height matches what is drawn",
  };
}

export function inspectFlushSurface(input = {}) {
  const surface =
    input.surface && typeof input.surface === "object"
      ? input.surface
      : input.flush === true && input.scotiated !== true
        ? SAMPLE_FLUSH_SURFACE
        : SAMPLE_SCOTIATED_SURFACE;
  const forced =
    input.flushSurface === true ||
    input.event === "seated" ||
    input.event === "last-row" ||
    input.event === "mac-flush";
  const flush =
    forced ||
    (input.flush === true && input.scotiated !== true) ||
    surface.lastRow === true;
  const live = flush && input.scotiated !== true && input.scotia !== true;
  return {
    lastRow: live,
    hollowGap: !live,
    returnedToContent: live,
    stamp: live ? "seated" : "scotia-hollow",
    note: live
      ? "bottom block ends on the last row; no hollow shadow-gap"
      : "bottom chrome reserved taller than drawn; extra rows cleared",
  };
}

export function readBooth(input = {}) {
  const band = inspectBlankBand(input);
  const vte = inspectVteScroll(input);
  const gate = inspectTenguGate(input);
  const flushSurface = inspectFlushSurface(input);
  const scotiated =
    input.flush !== true &&
    ((band.underBottomBlock && vte.linux && gate.enabled) ||
      input.scotiated === true);
  const flush =
    input.flush === true && scotiated !== true && band.underBottomBlock !== true;
  const path =
    (input.event === "decstbm-undershoot" || input.decstbmUndershoot === true) &&
    (band.underBottomBlock || input.scotiated === true);
  return {
    band,
    vte,
    gate,
    flushSurface,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    scotiated: scotiated && !flush && !path,
    flush: flush || (!scotiated && !path && input.scotiated !== true && input.decstbmUndershoot !== true && band.underBottomBlock !== true),
    decstbmUndershoot: path && !flush,
    mark:
      path && !flush
        ? "decstbm-undershoot"
        : scotiated && !flush
          ? "scotiated"
          : "flush",
  };
}

/**
 * Published scotia walk from #93764 only. Facts from the issue text.
 * A flush booth seats the bottom block on the last terminal row.
 * A scotiated booth leaves 2–3 blank rows under the bottom block on Linux VTE with DECSTBM on.
 * A decstbm-undershoot booth names that path.
 */
export const SCOTIA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-flush",
    flush: true,
    scotiated: false,
    cue: "flush",
    note: "idle HOLD: bottom block ends on the last terminal row; no hollow gap — the hold/good path",
  },
  {
    t: "blank-band",
    event: "blank-band",
    scotiated: true,
    blankBand: true,
    cue: "scotiated",
    note: "TUI stops 2–3 rows short; blank rows sit under the bottom block",
  },
  {
    t: "vte-scroll",
    event: "vte-scroll",
    scotiated: true,
    vteScroll: true,
    cue: "scotiated",
    note: "XTVERSION VTE(8401); DECSTBM on Black Box Linux",
  },
  {
    t: "tengu-marlin-porch",
    event: "tengu-marlin-porch",
    scotiated: true,
    tenguMarlinPorch: true,
    cue: "scotiated",
    note: "gate tengu_marlin_porch on; CLAUDE_CODE_DECSTBM unset; no local disable",
  },
  {
    t: "path",
    event: "decstbm-undershoot",
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    cue: "scotiated",
    note: "decstbm-undershoot — reserved chrome taller than drawn; extra rows cleared",
  },
  {
    t: "score",
    event: "scotia",
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    vteScroll: true,
    tenguMarlinPorch: true,
    cue: "scotiated",
    note: "scotia — when Linux VTE leaves a 2–3 row hollow under the prompt the booth never stays flush",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-flush",
    flush: true,
    scotiated: false,
    cue: "flush",
    note: "positive control: last row seated; no hollow gap",
  },
  {
    t: "announce",
    event: "cue-flush",
    flush: true,
    cue: "flush",
    note: "positive control: the column stays flush",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    flush: true,
    scotiated: false,
    decstbmUndershoot: false,
    cue: "flush",
  };
}

export function seedFlush() {
  return { ...emptyTicket() };
}

export function seedScotiated() {
  return {
    seed: SEEDED_WORD,
    flush: false,
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    vteScroll: true,
    tenguMarlinPorch: true,
    flushSurface: false,
    cue: "scotiated",
    issue: FEATURED_ISSUE,
    band: SAMPLE_BLANK_BAND,
    vte: SAMPLE_VTE,
    region: SAMPLE_DECSTBM,
    surface: SAMPLE_SCOTIATED_SURFACE,
  };
}

export function seedScotia() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    vteScroll: true,
    tenguMarlinPorch: true,
    cue: "scotiated",
  };
}

export function seedDecstbmUndershoot() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scotiated: true,
    decstbmUndershoot: true,
    blankBand: true,
    vteScroll: true,
    event: "decstbm-undershoot",
    cue: "scotiated",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    flush: true,
    cue: "flush",
  };
}

export function seedBlankBand() {
  return {
    seed: "blank-band",
    preferSeed: true,
    blankBand: true,
    cue: "scotiated",
  };
}

export function seedVteScroll() {
  return {
    seed: "vte-scroll",
    preferSeed: true,
    vteScroll: true,
    cue: "scotiated",
  };
}

export function seedTenguMarlinPorch() {
  return {
    seed: "tengu-marlin-porch",
    preferSeed: true,
    tenguMarlinPorch: true,
    cue: "scotiated",
  };
}

export function seedSeated() {
  return {
    seed: "seated",
    preferSeed: true,
    flush: true,
    cue: "flush",
  };
}

export function seedLastRow() {
  return {
    seed: "last-row",
    preferSeed: true,
    flush: true,
    cue: "flush",
  };
}

export function seedMacFlush() {
  return {
    seed: "mac-flush",
    preferSeed: true,
    flush: true,
    cue: "flush",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      flush: false,
      scotiated: false,
      decstbmUndershoot: false,
      blankBand: false,
      vteScroll: false,
      tenguMarlinPorch: false,
      flushSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    flush: raw.flush === true,
    scotiated:
      raw.scotiated === true ||
      raw.event === "scotiated" ||
      raw.event === "scotia",
    decstbmUndershoot:
      raw.decstbmUndershoot === true || raw.event === "decstbm-undershoot",
    blankBand: raw.blankBand === true || raw.event === "blank-band",
    vteScroll: raw.vteScroll === true || raw.event === "vte-scroll",
    tenguMarlinPorch:
      raw.tenguMarlinPorch === true || raw.event === "tengu-marlin-porch",
    flushSurface: raw.flushSurface === true || raw.event === "seated",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    band: raw.band,
    vte: raw.vte,
    region: raw.region,
    surface: raw.surface,
    atelier: raw.atelier,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.flush != null ||
        ticket.scotiated != null ||
        ticket.decstbmUndershoot != null ||
        ticket.blankBand != null ||
        ticket.vteScroll != null ||
        ticket.tenguMarlinPorch != null ||
        ticket.flushSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.band ||
        ticket.vte ||
        ticket.region ||
        ticket.surface),
  );
}

function isFlush(row) {
  if (row.scotiated && row.cue !== "flush") return false;
  if (
    row.cue === "scotiated" ||
    row.cue === "scotia" ||
    row.cue === "decstbm-undershoot"
  ) {
    return false;
  }
  if (
    row.decstbmUndershoot &&
    row.blankBand &&
    row.cue !== "flush" &&
    row.flush !== true
  ) {
    return false;
  }
  if (
    row.decstbmUndershoot &&
    row.vteScroll &&
    row.cue !== "flush" &&
    row.flush !== true
  ) {
    return false;
  }
  if (row.flush === true && row.scotiated !== true && row.cue !== "scotiated") {
    return true;
  }
  if (
    row.cue === "flush" &&
    row.scotiated !== true &&
    row.decstbmUndershoot !== true &&
    row.blankBand !== true &&
    row.vteScroll !== true
  ) {
    return true;
  }
  return false;
}

function isDecstbmUndershootPath(row) {
  return (
    row.event === "decstbm-undershoot" &&
    !isFlush(row) &&
    (row.decstbmUndershoot === true ||
      row.blankBand === true ||
      row.vteScroll === true)
  );
}

function isScotiated(row) {
  if (isFlush(row)) return false;
  if (isDecstbmUndershootPath(row) && row.cue !== "scotiated") return false;
  if (row.cue === "scotiated" || row.cue === "scotia") return true;
  if (row.scotiated === true) return true;
  if (
    row.decstbmUndershoot === true &&
    row.blankBand === true &&
    row.vteScroll === true
  ) {
    return true;
  }
  if (row.decstbmUndershoot === true && row.blankBand === true) {
    return true;
  }
  if (
    row.blankBand === true ||
    row.vteScroll === true ||
    row.tenguMarlinPorch === true ||
    (row.decstbmUndershoot === true && row.vteScroll === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one scotia pass against the column atelier.
 * flush: bottom block ends on last terminal row; no hollow gap.
 * scotiated / scotia: 2–3 blank rows under the bottom block on Linux VTE with DECSTBM on.
 * decstbm-undershoot: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDecstbmUndershootPath(row) ||
    (row.decstbmUndershoot && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "decstbm-undershoot";
  } else if (isScotiated(row)) {
    verdict = "scotia";
  } else if (isFlush(row)) {
    verdict = "flush";
  } else if (
    row.decstbmUndershoot ||
    row.blankBand ||
    row.vteScroll ||
    (row.tenguMarlinPorch && !row.flush)
  ) {
    verdict = "scotia";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const band = inspectBlankBand(row);
  const vte = inspectVteScroll(row);
  const gate = inspectTenguGate(row);
  const flushSurface = inspectFlushSurface(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    flush: verdict === "flush" || verdict === "hold",
    scotiated:
      verdict === "scotiated" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    decstbmUndershoot:
      row.decstbmUndershoot === true ||
      verdict === "decstbm-undershoot" ||
      verdict === PATH_WORD,
    blankBand: row.blankBand,
    vteScroll: row.vteScroll,
    tenguMarlinPorch: row.tenguMarlinPorch,
    flushSurface: row.flushSurface,
    cue: hold
      ? "flush"
      : row.decstbmUndershoot || verdict === "decstbm-undershoot"
        ? "decstbm-undershoot"
        : "scotiated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit flush" : "score scotia",
    bandInspect: band,
    vteInspect: vte,
    gateInspect: gate,
    flushInspect: flushSurface,
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
      : SCOTIA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "scotia" || row.verdict === "scotiated",
  );
  const path = scored.filter((row) => row.verdict === "decstbm-undershoot");
  const flush = scored.filter((row) => row.verdict === "flush");
  const headline =
    scored.find((row) => row.event === "scotiated") ||
    scored.find((row) => row.event === "decstbm-undershoot") ||
    scored.find((row) => row.event === "blank-band") ||
    dead[dead.length - 1];
  let verdict = "flush";
  if (dead.length) verdict = "scotia";
  else if (path.length && !flush.length) verdict = "decstbm-undershoot";
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
    scotiatedCount: dead.length,
    pathCount: path.length,
    flushCount: flush.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit flush" : "score scotia",
    note: headline
      ? "DECSTBM renderer leaves 2–3 blank rows under the bottom block on Linux VTE; macOS stays flush. Cousins #4136 (closed stale) and #83660 (tmux unused row) are cite-only."
      : "published scotia walk scored against flush vs scotiated",
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
    seeded !== "flush" &&
    seeded !== "scotiated" &&
    seeded !== "decstbm-undershoot" &&
    seeded !== "scotia" &&
    ticket.flush == null &&
    ticket.scotiated == null &&
    ticket.decstbmUndershoot == null &&
    ticket.blankBand == null &&
    ticket.vteScroll == null &&
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
    flush: scored.flush ?? false,
    scotiated: scored.scotiated ?? false,
    decstbmUndershoot: scored.decstbmUndershoot ?? false,
    blankBand: scored.blankBand ?? false,
    vteScroll: scored.vteScroll ?? false,
    tenguMarlinPorch: scored.tenguMarlinPorch ?? false,
    flushSurface: scored.flushSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.blankBand || result.scotiated ? "band=blank" : "band=flush",
    result.vteScroll || result.scotiated ? "host=vte" : "host=mac-flush",
    result.tenguMarlinPorch || result.scotiated ? "gate=tengu" : "gate=default",
    result.decstbmUndershoot || result.verdict === "decstbm-undershoot"
      ? "path=decstbm-undershoot"
      : "path=flush",
    result.cue === "flush"
      ? "cue=flush"
      : result.cue === "decstbm-undershoot"
        ? "cue=decstbm-undershoot"
        : "cue=scotiated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    flush: result.flush,
    scotiated: result.scotiated,
    decstbmUndershoot: result.decstbmUndershoot,
    blankBand: result.blankBand,
    vteScroll: result.vteScroll,
    tenguMarlinPorch: result.tenguMarlinPorch,
    flushSurface: result.flushSurface,
    band: input && input.band,
    vte: input && input.vte,
    region: input && input.region,
    surface: input && input.surface,
    atelier: input && input.atelier,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    band: inspectBlankBand({
      flush: result.flush,
      scotiated: result.scotiated,
      blankBand: result.blankBand,
      band: input && input.band,
    }),
    vte: inspectVteScroll({
      flush: result.flush,
      scotiated: result.scotiated,
      vteScroll: result.vteScroll,
      vte: input && input.vte,
    }),
    gate: inspectTenguGate({
      flush: result.flush,
      scotiated: result.scotiated,
      tenguMarlinPorch: result.tenguMarlinPorch,
      region: input && input.region,
    }),
    flushSurface: inspectFlushSurface({
      flush: result.flush,
      scotiated: result.scotiated,
      flushSurface: result.flushSurface,
      surface: input && input.surface,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      scotiated:
        result.scotiated === true ||
        result.verdict === "scotiated" ||
        result.verdict === "scotia",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: bottom chrome height reservation under DECSTBM is oversized vs what is drawn on VTE Linux, so cleared margin rows appear as a permanent blank band; macOS default path does not hit that undershoot. Invite verify against #93764 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
