#!/usr/bin/env node
/**
 * Deadkey — typographic dead-key / typewriter platen booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On 2.1.269 every key that sends an ESC-prefixed escape/CSI sequence
 * is dead in the composer. Every single-byte key still works.
 * Reverting to 2.1.268 restores the CSI keys with nothing else changed.
 *
 *   node deadkey.mjs data/deadkeyed.json
 *   echo '{"seed":"deadkeyed"}' | node deadkey.mjs
 *
 * Idle word is keyed (HOLD: CSI keys act; cursor moves — the good path).
 * Seeded word is deadkeyed (#93788 ESC-CSI dead).
 * Path word is esc-csi-dead.
 * Product score word is deadkey (Score deadkey or admit keyed.).
 *
 * Encoded from anthropics/claude-code#93788 issue text only.
 * Hypothesis (NON-BINDING): fullscreen/TUI input path in 2.1.269 stopped
 * recognizing CSI/ESC-prefixed sequences while single-byte readline still
 * works. Verify against #93788 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "keyed",
  "deadkeyed",
  "deadkey",
  "esc-csi-dead",
  "hold",
  "csi-left",
  "csi-right",
  "csi-up",
  "csi-down",
  "home-end",
  "single-byte-ok",
  "silent-fail",
  "binary-swap",
  "fullscreen-tui",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "keyed";
export const PATH_WORD = "esc-csi-dead";
export const SEEDED_WORD = "deadkeyed";
export const PRODUCT_WORD = "deadkey";
export const HOLD = Object.freeze(["keyed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "keyed",
  "composed",
  "resolved",
  "cursor-moves",
]);
export const RECOVER = Object.freeze(["keyed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "gleaned",
  "orphaned",
  "gleaner",
  "unreaped-ampersand",
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
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
  "blank",
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
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "deadkeyed" && name !== "deadkey"),
);

export const FEATURED_ISSUE = 93788;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93788";
export const TITLE =
  "2.1.269: all ESC-sequence keys (arrows, Home, End) dead in the composer; single-byte keys unaffected; 2.1.268 is fine";
export const STATE = "OPEN";
export const LABELS = Object.freeze([]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.269";
export const GOOD_VERSION = "2.1.268";
export const SURFACE =
  "macOS arm64, AbsoluteTelnet over SSH, TERM xterm-256color, tui fullscreen (set since 2026-07-30; not the variable), no keybindings.json, no vim mode";
export const TERM = "xterm-256color";
export const HOST = "AbsoluteTelnet over SSH";
export const TUI_FULLSCREEN_SINCE = "2026-07-30";
export const DEAD_SEQUENCES = Object.freeze([
  { key: "Left", seq: "ESC [ D" },
  { key: "Right", seq: "ESC [ C" },
  { key: "Up", seq: "ESC [ A" },
  { key: "Down", seq: "ESC [ B" },
  { key: "Home", seq: "ESC [ H" },
  { key: "End", seq: "ESC [ F" },
]);
export const WORKING_BYTES = Object.freeze([
  "Backspace 0x7F",
  "Ctrl-A",
  "Ctrl-E",
  "Ctrl-B",
  "Ctrl-F",
  "Ctrl-P",
  "Ctrl-N",
]);
export const WORKAROUND = "Ctrl-B/F/A/E still move cursor";
export const PHRASE = "Score deadkey or admit keyed.";
export const DISTRIBUTION =
  "On 2.1.269 every key that sends an ESC-prefixed escape/CSI sequence is dead in the composer; every single-byte key still works. Reverting to 2.1.268 restores them with nothing else changed. Dead: Left/Right/Up/Down (ESC [ D/C/A/B), Home/End (ESC [ H/F). Still working: Backspace 0x7F, Ctrl-A/E/B/F/P/N and other single control bytes. Fail silently — no echo, cursor does not move. Same terminal cat -v shows CSI intact; only Claude Code fails to act. /exit + --continue still dead; binary symlink swap 2.1.268↔2.1.269 in same tab proves build not session state. Env: macOS arm64, AbsoluteTelnet over SSH, TERM xterm-256color, tui fullscreen (set since 2026-07-30; not the variable), no keybindings.json, no vim mode. Workaround: Ctrl-B/F/A/E still move cursor.";
export const RULED_OUT = Object.freeze([
  "TUI raw mode after SIGCONT (#88249)",
  "wheel becomes arrows without mouse tracking (#91142)",
]);
export const EXPECTED = Object.freeze([
  "Composer should act on ESC-prefixed CSI sequences (arrows, Home, End) as it did in 2.1.268",
  "Single-byte keys should continue to type (already do)",
  "A dead CSI key should not fail silently — cursor should move or the sequence should be visible",
]);

export const PLATEN_STRIPS = Object.freeze([
  { id: "platen", label: "carbon platen", count: "roller", note: "near-black platen holds the ivory paper" },
  { id: "dead-key", label: "dead-key lever", count: "ESC-CSI", note: "composing key that should combine — here it never resolves" },
  { id: "ribbon", label: "error ribbon", count: "mute-red", note: "silent fail: no echo, cursor does not move" },
  { id: "brass", label: "brass typebar", count: "0x7F", note: "single-byte keys still strike the paper" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "compose-gate",
    survey: "watch CSI keys resolve and the cursor move on the platen",
    kind: "keyed",
    note: "idle: CSI keys act; cursor moves; composing key combines — the hold/good path",
  },
  {
    id: "csi-left",
    survey: "press Left / Right / Up / Down (ESC [ D/C/A/B)",
    kind: "deadkeyed",
    note: "seeded: arrows dead in the composer on 2.1.269",
  },
  {
    id: "home-end",
    survey: "press Home / End (ESC [ H/F)",
    kind: "deadkeyed",
    note: "seeded: Home/End dead; same ESC-prefixed CSI family",
  },
  {
    id: "single-byte-ok",
    survey: "strike Backspace 0x7F and Ctrl-A/E/B/F/P/N",
    kind: "deadkeyed",
    note: "seeded: every single-byte key still types; workaround Ctrl-B/F/A/E still move cursor",
  },
  {
    id: "binary-swap",
    survey: "swap the 2.1.268↔2.1.269 symlink in the same tab",
    kind: "deadkeyed",
    note: "seeded: build not session state; /exit + --continue still dead",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "esc-csi-dead",
  "deadkeyed",
  "csi-left",
  "single-byte-ok",
  "silent-fail",
  "binary-swap",
  "fullscreen-tui",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88249,
    title: "TUI raw mode after SIGCONT",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #88249 TUI raw mode after SIGCONT. Distinct: this booth encodes ESC-CSI keys dead in the 2.1.269 composer, not SIGCONT raw-mode loss. Do not rebuild",
  },
  {
    issue: 91142,
    title: "wheel becomes arrows without mouse tracking",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91142 wheel becomes arrows without mouse tracking. Distinct: here CSI arrows themselves are dead; the wheel is not the subject. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93801, title: "Remote Control mobile send silently fails", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93798, title: "chrome MCP Prohibited actions govern Bash/SSH", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93786, title: "subagent worktree diffs invisible", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93778, title: "dictation after manual edit discards edit", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93800, title: "Clear slash not clearing session name", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93795, title: "VS Code 60s subprocess init", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "oubliette",
  "ephemera",
  "followspot",
  "mondegreen",
  "parergon",
  "guillotine",
  "flashpan",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "eidolon",
  "calends",
  "weir",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
]);

export const SAMPLE_KEYED_PLATEN = Object.freeze({
  csiActs: true,
  cursorMoves: true,
  composed: true,
  deadCount: 0,
  version: GOOD_VERSION,
});

export const SAMPLE_DEADKEYED_PLATEN = Object.freeze({
  csiActs: false,
  cursorMoves: false,
  composed: false,
  deadCount: 6,
  version: CLAUDE_VERSION,
});

export const SAMPLE_CSI = Object.freeze({
  left: "ESC [ D",
  right: "ESC [ C",
  up: "ESC [ A",
  down: "ESC [ B",
  home: "ESC [ H",
  end: "ESC [ F",
  recognized: false,
});

export const SAMPLE_KEYED_CSI = Object.freeze({
  left: "ESC [ D",
  right: "ESC [ C",
  up: "ESC [ A",
  down: "ESC [ B",
  home: "ESC [ H",
  end: "ESC [ F",
  recognized: true,
});

export const SAMPLE_SINGLE_BYTE = Object.freeze({
  backspace: "0x7F",
  ctrl: ["A", "E", "B", "F", "P", "N"],
  stillTypes: true,
});

export const SAMPLE_SILENT = Object.freeze({
  echo: false,
  cursorMoves: false,
  silent: true,
});

export const SAMPLE_KEYED_SILENT = Object.freeze({
  echo: true,
  cursorMoves: true,
  silent: false,
});

export const SAMPLE_SWAP = Object.freeze({
  from: GOOD_VERSION,
  to: CLAUDE_VERSION,
  sameTab: true,
  continueStillDead: true,
  buildNotSession: true,
});

export const SAMPLE_KEYED_SWAP = Object.freeze({
  from: GOOD_VERSION,
  to: GOOD_VERSION,
  sameTab: false,
  continueStillDead: false,
  buildNotSession: false,
});

export const SAMPLE_FULLSCREEN = Object.freeze({
  tuiFullscreen: true,
  since: TUI_FULLSCREEN_SINCE,
  notTheVariable: true,
  term: TERM,
  host: HOST,
});

export const SAMPLE_CATV = Object.freeze({
  catVIntact: true,
  composerActs: false,
  onlyClaudeFails: true,
});

export const SAMPLE_KEYED_CATV = Object.freeze({
  catVIntact: true,
  composerActs: true,
  onlyClaudeFails: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "platen holds: CSI keys act; cursor moves; composing key combines" },
  { t: "csi-left", line: "Left/Right/Up/Down ESC [ D/C/A/B dead in the composer on 2.1.269" },
  { t: "home-end", line: "Home/End ESC [ H/F dead — same ESC-prefixed CSI family" },
  { t: "single-byte-ok", line: "Backspace 0x7F and Ctrl-A/E/B/F/P/N still type" },
  { t: "silent-fail", line: "no echo; cursor does not move" },
  { t: "cat-v", line: "same terminal cat -v shows CSI intact; only Claude Code fails to act" },
  { t: "binary-swap", line: "symlink swap 2.1.268↔2.1.269 in the same tab — build not session state" },
  { t: "fullscreen-tui", line: "tui fullscreen set since 2026-07-30; not the variable; AbsoluteTelnet over SSH; TERM xterm-256color" },
  { t: "path", line: "esc-csi-dead — ESC-CSI never resolve on the platen" },
  { t: "score", line: "when ESC-CSI stay dead the booth is deadkey — Score deadkey or admit keyed." },
]);

export function inspectCsi(input = {}) {
  const platen =
    input.platen && typeof input.platen === "object"
      ? input.platen
      : input.keyed === true && input.deadkeyed !== true
        ? SAMPLE_KEYED_PLATEN
        : SAMPLE_DEADKEYED_PLATEN;
  const forcedDead =
    input.deadkeyed === true ||
    input.event === "deadkeyed" ||
    input.event === "deadkey" ||
    input.event === "esc-csi-dead" ||
    input.event === "csi-left" ||
    input.csiLeft === true;
  const csiActs = forcedDead ? false : platen.csiActs === true;
  const deadCount = forcedDead ? 6 : platen.deadCount || 0;
  return {
    csiActs,
    cursorMoves: csiActs,
    composed: csiActs,
    deadCount,
    version: csiActs ? GOOD_VERSION : CLAUDE_VERSION,
    stamp: csiActs ? "csi-resolves" : "csi-dead",
    note: csiActs
      ? "CSI keys act; cursor moves; composing key combines"
      : "ESC-prefixed CSI sequences never resolve — arrows/Home/End permanently dead",
  };
}

export function inspectSingleByte(input = {}) {
  const bytes =
    input.singleByte && typeof input.singleByte === "object"
      ? input.singleByte
      : SAMPLE_SINGLE_BYTE;
  const forced =
    input.singleByteOk === true ||
    input.event === "single-byte-ok" ||
    input.event === "deadkeyed" ||
    input.event === "deadkey";
  const stillTypes = forced ? true : bytes.stillTypes === true;
  return {
    backspace: stillTypes ? "0x7F" : null,
    ctrl: stillTypes ? [...WORKING_BYTES.slice(1)] : [],
    stillTypes,
    stamp: stillTypes ? "single-byte-ok" : "bytes-dark",
    note: stillTypes
      ? "Backspace 0x7F and Ctrl-A/E/B/F/P/N still type; workaround Ctrl-B/F/A/E still move cursor"
      : "single-byte keys also dark — not the published #93788 shape",
  };
}

export function inspectSilentFail(input = {}) {
  const silent =
    input.silent && typeof input.silent === "object"
      ? input.silent
      : input.keyed === true && input.deadkeyed !== true
        ? SAMPLE_KEYED_SILENT
        : SAMPLE_SILENT;
  const forced =
    input.silentFail === true ||
    input.event === "silent-fail" ||
    input.event === "deadkeyed" ||
    input.event === "deadkey";
  const muted = forced ? true : silent.silent === true && input.keyed !== true;
  return {
    echo: !muted,
    cursorMoves: !muted,
    silent: muted,
    stamp: muted ? "silent-fail" : "echo-ok",
    note: muted
      ? "fail silently — no echo, cursor does not move"
      : "cursor moves; the platen echoes the strike",
  };
}

export function inspectBinarySwap(input = {}) {
  const swap =
    input.swap && typeof input.swap === "object"
      ? input.swap
      : input.keyed === true && input.deadkeyed !== true
        ? SAMPLE_KEYED_SWAP
        : SAMPLE_SWAP;
  const forced =
    input.binarySwap === true ||
    input.event === "binary-swap" ||
    input.event === "deadkeyed" ||
    input.event === "deadkey";
  const swapped = forced ? true : swap.buildNotSession === true && input.keyed !== true;
  return {
    from: swapped ? GOOD_VERSION : GOOD_VERSION,
    to: swapped ? CLAUDE_VERSION : GOOD_VERSION,
    sameTab: swapped,
    continueStillDead: swapped,
    buildNotSession: swapped,
    stamp: swapped ? "268-269-swap" : "build-holds",
    note: swapped
      ? "binary symlink swap 2.1.268↔2.1.269 in the same tab; /exit + --continue still dead — build not session state"
      : "2.1.268 holds — CSI keys act",
  };
}

export function inspectFullscreen(input = {}) {
  const screen =
    input.fullscreen && typeof input.fullscreen === "object"
      ? input.fullscreen
      : SAMPLE_FULLSCREEN;
  const forced =
    input.fullscreenTui === true ||
    input.event === "fullscreen-tui" ||
    input.event === "deadkeyed" ||
    input.event === "deadkey";
  const tui = forced ? true : screen.tuiFullscreen === true;
  return {
    tuiFullscreen: tui,
    since: tui ? TUI_FULLSCREEN_SINCE : null,
    notTheVariable: tui,
    term: tui ? TERM : null,
    host: tui ? HOST : null,
    stamp: tui ? "fullscreen-tui" : "no-tui",
    note: tui
      ? "tui fullscreen set since 2026-07-30; not the variable; AbsoluteTelnet over SSH; TERM xterm-256color"
      : "no fullscreen TUI stamp on this pass",
  };
}

export function inspectCatV(input = {}) {
  const tape =
    input.catV && typeof input.catV === "object"
      ? input.catV
      : input.keyed === true && input.deadkeyed !== true
        ? SAMPLE_KEYED_CATV
        : SAMPLE_CATV;
  const forced =
    input.catVIntact === true ||
    input.event === "deadkeyed" ||
    input.event === "deadkey" ||
    input.event === "esc-csi-dead";
  const intact = tape.catVIntact !== false;
  const composerActs = forced
    ? false
    : input.keyed === true
      ? true
      : tape.composerActs === true;
  return {
    catVIntact: intact,
    composerActs,
    onlyClaudeFails: intact && !composerActs,
    stamp: composerActs ? "composer-acts" : "cat-v-intact",
    note: composerActs
      ? "terminal CSI and composer both act"
      : "same terminal cat -v shows CSI intact; only Claude Code fails to act",
  };
}

export function readBooth(input = {}) {
  const csi = inspectCsi(input);
  const singleByte = inspectSingleByte(input);
  const silent = inspectSilentFail(input);
  const swap = inspectBinarySwap(input);
  const fullscreen = inspectFullscreen(input);
  const catV = inspectCatV(input);
  const deadkeyed =
    input.keyed !== true &&
    ((!csi.csiActs && silent.silent) ||
      (swap.buildNotSession && !csi.csiActs) ||
      input.deadkeyed === true);
  const keyed =
    input.keyed === true && deadkeyed !== true && csi.csiActs === true;
  const path =
    (input.event === "esc-csi-dead" || input.escCsiDead === true) &&
    (!csi.csiActs || input.deadkeyed === true);
  return {
    csi,
    singleByte,
    silent,
    swap,
    fullscreen,
    catV,
    strips: PLATEN_STRIPS,
    stations: BOOTH_STATIONS,
    deadkeyed: deadkeyed && !keyed && !path,
    keyed: keyed || (!deadkeyed && !path && input.deadkeyed !== true && input.escCsiDead !== true && csi.csiActs),
    escCsiDead: path && !keyed,
    mark:
      path && !keyed
        ? "esc-csi-dead"
        : deadkeyed && !keyed
          ? "deadkeyed"
          : "keyed",
  };
}

/**
 * Published deadkey walk from #93788 only. Facts from the issue text.
 * A keyed booth resolves CSI/ESC sequences and moves the cursor.
 * A deadkeyed booth leaves ESC-CSI permanently dead.
 * An esc-csi-dead booth names the dead-key path.
 */
export const DEADKEY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-keyed",
    keyed: true,
    deadkeyed: false,
    cue: "keyed",
    note: "idle HOLD: CSI keys act; cursor moves; composing key combines — the hold/good path",
  },
  {
    t: "csi-left",
    event: "csi-left",
    deadkeyed: true,
    csiLeft: true,
    cue: "deadkeyed",
    note: "Left/Right/Up/Down ESC [ D/C/A/B dead in the composer",
  },
  {
    t: "home-end",
    event: "home-end",
    deadkeyed: true,
    homeEnd: true,
    cue: "deadkeyed",
    note: "Home/End ESC [ H/F dead — same ESC-prefixed CSI family",
  },
  {
    t: "single-byte-ok",
    event: "single-byte-ok",
    deadkeyed: true,
    singleByteOk: true,
    cue: "deadkeyed",
    note: "Backspace 0x7F and Ctrl-A/E/B/F/P/N still type",
  },
  {
    t: "silent-fail",
    event: "silent-fail",
    deadkeyed: true,
    silentFail: true,
    cue: "deadkeyed",
    note: "fail silently — no echo, cursor does not move",
  },
  {
    t: "binary-swap",
    event: "binary-swap",
    deadkeyed: true,
    binarySwap: true,
    cue: "deadkeyed",
    note: "symlink swap 2.1.268↔2.1.269 in the same tab — build not session state",
  },
  {
    t: "fullscreen-tui",
    event: "fullscreen-tui",
    deadkeyed: true,
    fullscreenTui: true,
    cue: "deadkeyed",
    note: "tui fullscreen set since 2026-07-30; not the variable",
  },
  {
    t: "path",
    event: "esc-csi-dead",
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    cue: "deadkeyed",
    note: "esc-csi-dead — ESC-CSI never resolve on the platen",
  },
  {
    t: "score",
    event: "deadkey",
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    binarySwap: true,
    fullscreenTui: true,
    singleByteOk: true,
    cue: "deadkeyed",
    note: "deadkey — when ESC-CSI stay dead the booth never stays keyed",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-keyed",
    keyed: true,
    deadkeyed: false,
    cue: "keyed",
    note: "positive control: CSI keys act; cursor moves",
  },
  {
    t: "announce",
    event: "cue-keyed",
    keyed: true,
    cue: "keyed",
    note: "positive control: 2.1.268 — composing key combines",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    keyed: true,
    deadkeyed: false,
    escCsiDead: false,
    cue: "keyed",
  };
}

export function seedKeyed() {
  return { ...emptyTicket() };
}

export function seedDeadkeyed() {
  return {
    seed: SEEDED_WORD,
    keyed: false,
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    binarySwap: true,
    fullscreenTui: true,
    singleByteOk: true,
    cue: "deadkeyed",
    issue: FEATURED_ISSUE,
    platen: SAMPLE_DEADKEYED_PLATEN,
    singleByte: SAMPLE_SINGLE_BYTE,
    silent: SAMPLE_SILENT,
    swap: SAMPLE_SWAP,
    fullscreen: SAMPLE_FULLSCREEN,
    catV: SAMPLE_CATV,
  };
}

export function seedDeadkey() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    binarySwap: true,
    fullscreenTui: true,
    singleByteOk: true,
    cue: "deadkeyed",
  };
}

export function seedEscCsiDead() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    deadkeyed: true,
    escCsiDead: true,
    csiLeft: true,
    silentFail: true,
    event: "esc-csi-dead",
    cue: "deadkeyed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    keyed: true,
    cue: "keyed",
  };
}

export function seedCsiLeft() {
  return {
    seed: "csi-left",
    preferSeed: true,
    csiLeft: true,
    cue: "deadkeyed",
  };
}

export function seedCsiRight() {
  return {
    seed: "csi-right",
    preferSeed: true,
    csiRight: true,
    cue: "deadkeyed",
  };
}

export function seedCsiUp() {
  return {
    seed: "csi-up",
    preferSeed: true,
    csiUp: true,
    cue: "deadkeyed",
  };
}

export function seedCsiDown() {
  return {
    seed: "csi-down",
    preferSeed: true,
    csiDown: true,
    cue: "deadkeyed",
  };
}

export function seedHomeEnd() {
  return {
    seed: "home-end",
    preferSeed: true,
    homeEnd: true,
    cue: "deadkeyed",
  };
}

export function seedSingleByteOk() {
  return {
    seed: "single-byte-ok",
    preferSeed: true,
    singleByteOk: true,
    cue: "deadkeyed",
  };
}

export function seedSilentFail() {
  return {
    seed: "silent-fail",
    preferSeed: true,
    silentFail: true,
    cue: "deadkeyed",
  };
}

export function seedBinarySwap() {
  return {
    seed: "binary-swap",
    preferSeed: true,
    binarySwap: true,
    cue: "deadkeyed",
  };
}

export function seedFullscreenTui() {
  return {
    seed: "fullscreen-tui",
    preferSeed: true,
    fullscreenTui: true,
    cue: "deadkeyed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      keyed: false,
      deadkeyed: false,
      escCsiDead: false,
      csiLeft: false,
      csiRight: false,
      csiUp: false,
      csiDown: false,
      homeEnd: false,
      singleByteOk: false,
      silentFail: false,
      binarySwap: false,
      fullscreenTui: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    keyed: raw.keyed === true,
    deadkeyed:
      raw.deadkeyed === true ||
      raw.event === "deadkeyed" ||
      raw.event === "deadkey",
    escCsiDead:
      raw.escCsiDead === true || raw.event === "esc-csi-dead",
    csiLeft: raw.csiLeft === true || raw.event === "csi-left",
    csiRight: raw.csiRight === true || raw.event === "csi-right",
    csiUp: raw.csiUp === true || raw.event === "csi-up",
    csiDown: raw.csiDown === true || raw.event === "csi-down",
    homeEnd: raw.homeEnd === true || raw.event === "home-end",
    singleByteOk: raw.singleByteOk === true || raw.event === "single-byte-ok",
    silentFail: raw.silentFail === true || raw.event === "silent-fail",
    binarySwap: raw.binarySwap === true || raw.event === "binary-swap",
    fullscreenTui: raw.fullscreenTui === true || raw.event === "fullscreen-tui",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    platen: raw.platen,
    singleByte: raw.singleByte,
    silent: raw.silent,
    swap: raw.swap,
    fullscreen: raw.fullscreen,
    catV: raw.catV,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.keyed != null ||
        ticket.deadkeyed != null ||
        ticket.escCsiDead != null ||
        ticket.csiLeft != null ||
        ticket.silentFail != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.platen ||
        ticket.silent ||
        ticket.swap),
  );
}

function isKeyed(row) {
  if (row.deadkeyed && row.cue !== "keyed") return false;
  if (
    row.cue === "deadkeyed" ||
    row.cue === "deadkey" ||
    row.cue === "esc-csi-dead"
  ) {
    return false;
  }
  if (
    row.escCsiDead &&
    row.csiLeft &&
    row.cue !== "keyed" &&
    row.keyed !== true
  ) {
    return false;
  }
  if (
    row.escCsiDead &&
    row.silentFail &&
    row.cue !== "keyed" &&
    row.keyed !== true
  ) {
    return false;
  }
  if (row.keyed === true && row.deadkeyed !== true && row.cue !== "deadkeyed") {
    return true;
  }
  if (
    row.cue === "keyed" &&
    row.deadkeyed !== true &&
    row.escCsiDead !== true &&
    row.csiLeft !== true &&
    row.silentFail !== true
  ) {
    return true;
  }
  return false;
}

function isEscCsiDeadPath(row) {
  return (
    row.event === "esc-csi-dead" &&
    !isKeyed(row) &&
    (row.escCsiDead === true ||
      row.csiLeft === true ||
      row.silentFail === true)
  );
}

function isDeadkeyed(row) {
  if (isKeyed(row)) return false;
  if (isEscCsiDeadPath(row) && row.cue !== "deadkeyed") return false;
  if (row.cue === "deadkeyed" || row.cue === "deadkey") return true;
  if (row.deadkeyed === true) return true;
  if (
    row.escCsiDead === true &&
    row.csiLeft === true &&
    row.silentFail === true
  ) {
    return true;
  }
  if (row.escCsiDead === true && row.csiLeft === true) {
    return true;
  }
  if (
    row.csiLeft === true ||
    row.csiRight === true ||
    row.csiUp === true ||
    row.csiDown === true ||
    row.homeEnd === true ||
    row.silentFail === true ||
    row.binarySwap === true ||
    row.fullscreenTui === true ||
    row.singleByteOk === true ||
    (row.escCsiDead === true && row.silentFail === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one deadkey pass against the typewriter platen.
 * keyed: CSI keys act; cursor moves; composing key combines.
 * deadkeyed / deadkey: ESC-CSI permanently dead while single-byte keys type.
 * esc-csi-dead: ESC-prefixed sequences never resolve on the platen.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isEscCsiDeadPath(row) ||
    (row.escCsiDead && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "esc-csi-dead";
  } else if (isDeadkeyed(row)) {
    verdict = "deadkey";
  } else if (isKeyed(row)) {
    verdict = "keyed";
  } else if (
    row.escCsiDead ||
    row.csiLeft ||
    row.silentFail ||
    (row.binarySwap && !row.keyed)
  ) {
    verdict = "deadkey";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const csi = inspectCsi(row);
  const singleByte = inspectSingleByte(row);
  const silent = inspectSilentFail(row);
  const swap = inspectBinarySwap(row);
  const fullscreen = inspectFullscreen(row);
  const catV = inspectCatV(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    keyed: verdict === "keyed" || verdict === "hold",
    deadkeyed:
      verdict === "deadkeyed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    escCsiDead:
      row.escCsiDead === true ||
      verdict === "esc-csi-dead" ||
      verdict === PATH_WORD,
    csiLeft: row.csiLeft,
    csiRight: row.csiRight,
    csiUp: row.csiUp,
    csiDown: row.csiDown,
    homeEnd: row.homeEnd,
    singleByteOk: row.singleByteOk,
    silentFail: row.silentFail,
    binarySwap: row.binarySwap,
    fullscreenTui: row.fullscreenTui,
    cue: hold
      ? "keyed"
      : row.escCsiDead || verdict === "esc-csi-dead"
        ? "esc-csi-dead"
        : "deadkeyed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit keyed" : "score deadkey",
    csiInspect: csi,
    singleByteInspect: singleByte,
    silentInspect: silent,
    swapInspect: swap,
    fullscreenInspect: fullscreen,
    catVInspect: catV,
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
      : DEADKEY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "deadkey" || row.verdict === "deadkeyed",
  );
  const path = scored.filter((row) => row.verdict === "esc-csi-dead");
  const keyed = scored.filter((row) => row.verdict === "keyed");
  const headline =
    scored.find((row) => row.event === "deadkeyed") ||
    scored.find((row) => row.event === "esc-csi-dead") ||
    scored.find((row) => row.event === "csi-left") ||
    dead[dead.length - 1];
  let verdict = "keyed";
  if (dead.length) verdict = "deadkey";
  else if (path.length && !keyed.length) verdict = "esc-csi-dead";
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
    deadkeyedCount: dead.length,
    pathCount: path.length,
    keyedCount: keyed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit keyed" : "score deadkey",
    note: headline
      ? "ESC-CSI dead on 2.1.269; single-byte keys type; cat -v intact; binary swap proves build."
      : "published deadkey walk scored against keyed vs deadkeyed",
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
    seeded !== "keyed" &&
    seeded !== "deadkeyed" &&
    seeded !== "esc-csi-dead" &&
    seeded !== "deadkey" &&
    ticket.keyed == null &&
    ticket.deadkeyed == null &&
    ticket.escCsiDead == null &&
    ticket.csiLeft == null &&
    ticket.silentFail == null &&
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
    keyed: scored.keyed ?? false,
    deadkeyed: scored.deadkeyed ?? false,
    escCsiDead: scored.escCsiDead ?? false,
    csiLeft: scored.csiLeft ?? false,
    silentFail: scored.silentFail ?? false,
    binarySwap: scored.binarySwap ?? false,
    fullscreenTui: scored.fullscreenTui ?? false,
    singleByteOk: scored.singleByteOk ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.keyed && !result.deadkeyed ? "csi=acts" : "csi=dead",
    result.escCsiDead || result.deadkeyed ? "keys=deadkeyed" : "keys=keyed",
    result.singleByteOk || result.deadkeyed ? "bytes=ok" : "bytes=idle",
    result.silentFail || result.deadkeyed ? "fail=silent" : "fail=echo",
    result.escCsiDead || result.verdict === "esc-csi-dead"
      ? "path=esc-csi-dead"
      : "path=keyed",
    result.cue === "keyed"
      ? "cue=keyed"
      : result.cue === "esc-csi-dead"
        ? "cue=esc-csi-dead"
        : "cue=deadkeyed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    keyed: result.keyed,
    deadkeyed: result.deadkeyed,
    escCsiDead: result.escCsiDead,
    csiLeft: result.csiLeft,
    silentFail: result.silentFail,
    binarySwap: result.binarySwap,
    fullscreenTui: result.fullscreenTui,
    singleByteOk: result.singleByteOk,
    platen: input && input.platen,
    singleByte: input && input.singleByte,
    silent: input && input.silent,
    swap: input && input.swap,
    fullscreen: input && input.fullscreen,
    catV: input && input.catV,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    csi: inspectCsi({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      platen: input && input.platen,
    }),
    singleByte: inspectSingleByte({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      singleByteOk: result.singleByteOk,
      singleByte: input && input.singleByte,
    }),
    silent: inspectSilentFail({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      silentFail: result.silentFail,
      silent: input && input.silent,
    }),
    swap: inspectBinarySwap({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      binarySwap: result.binarySwap,
      swap: input && input.swap,
    }),
    fullscreen: inspectFullscreen({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      fullscreenTui: result.fullscreenTui,
      fullscreen: input && input.fullscreen,
    }),
    catV: inspectCatV({
      keyed: result.keyed,
      deadkeyed: result.deadkeyed,
      catV: input && input.catV,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      deadkeyed:
        result.deadkeyed === true ||
        result.verdict === "deadkeyed" ||
        result.verdict === "deadkey",
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
      term: TERM,
      host: HOST,
      tuiFullscreenSince: TUI_FULLSCREEN_SINCE,
      deadSequences: DEAD_SEQUENCES,
      workingBytes: [...WORKING_BYTES],
      workaround: WORKAROUND,
      strips: PLATEN_STRIPS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: fullscreen/TUI input path in 2.1.269 stopped recognizing CSI/ESC-prefixed sequences while single-byte readline still works. Invite verify against #93788 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
