#!/usr/bin/env node
/**
 * Anarthria — ENT / laryngology / voice-clinic booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * After auto-updating to 2.1.269, text inserted by a voice dictation
 * tool (Wispr Flow — clipboard + simulated Ctrl+V) is no longer
 * inserted into the Claude Code prompt when Claude Code runs in the
 * VS Code integrated terminal over Remote-WSL. Nothing appears in the
 * prompt; the text is silently dropped.
 *
 * Running 2.1.268 in the exact same terminal works. 2.1.269 in
 * Windows Terminal (same WSL distro) works. Plain bash and PowerShell
 * in the same VS Code terminal work. Failure is exactly the
 * intersection 2.1.269 × VS Code integrated terminal.
 *
 *   node anarthria.mjs data/anarthria.json
 *   echo '{"seed":"anarthria"}' | node anarthria.mjs
 *
 * Idle word is articulate (HOLD: paste lands; prompt receives dictation).
 * Seeded word is anarthria (#93782 — dictation Ctrl+V silently dropped
 * in VS Code WSL terminal on 2.1.269).
 * Path word is dictation-paste-drop.
 * Product score word is anarthria (Score anarthria or admit articulate.).
 *
 * Encoded from anthropics/claude-code#93782 issue text only.
 * Hypothesis (NON-BINDING): 2.1.269 terminal keyboard-input parser
 * changes (F1/F2/F4 in kitty-protocol terminals, Delete in st,
 * Alt+arrows in rxvt-unicode, Shift+punctuation in WezTerm) have a
 * side effect on how pasted input from xterm.js (VS Code's terminal)
 * is consumed. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude. No secrets.
 *
 * NOT Trismus/#93823 (UNUserNotification XPC lockjaw).
 * NOT Foundling/#93889 (subagent Bash orphaning).
 * NOT Gleaner/#93794 (unreaped `&`).
 * NOT Stet/#93778 (dictation buffer restores over composer edits).
 * NOT Deadkey/#93788 (ESC-CSI never resolve).
 * Anarthria is specifically a dictation→clipboard→Ctrl+V insert path
 * that never reaches the Claude Code prompt in the VS Code WSL
 * terminal on 2.1.269.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "hold",
  "phonated",
  "received",
  "landing",
  "larynx-open",
  "clipboard-heard",
  "wispr-ctrlv",
  "vscode-wsl",
  "regression-21269",
  "windows-terminal-ok",
  "plain-bash-ok",
  "silent-drop",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "articulate";
export const PATH_WORD = "dictation-paste-drop";
export const SEEDED_WORD = "anarthria";
export const PRODUCT_WORD = "anarthria";
export const HOLD = Object.freeze(["articulate", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "articulate",
  "phonated",
  "received",
  "landing",
  "larynx-open",
  "clipboard-heard",
]);
export const RECOVER = Object.freeze(["articulate", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "unlocked",
  "responsive",
  "async-notif",
  "free-main",
  "unclenched",
  "main-blocked",
  "xpc-close",
  "add-notification",
  "force-quit-only",
  "code-tab-terminal-done",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
  "airlock",
  "equalized",
  "blown",
  "socat-race",
  "scotoma",
  "legible",
  "scotomized",
  "command-args-blind",
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd",
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
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
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
  "inherited",
  "unreaped-ampersand",
  "ppid-one",
  "yes-wall",
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
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
  "warm",
  "sheltered",
  "waif",
  "jetsam",
  "bonded",
  "registered",
  "warded",
  "parented",
  "silted",
  "drained",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "anarthria"),
);

export const FEATURED_ISSUE = 93782;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93782";
export const TITLE =
  "[BUG] Regression in 2.1.269: dictation-tool paste (clipboard + simulated Ctrl+V) not inserted in VS Code integrated terminal (WSL2) — 2.1.268 works";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:tui",
  "area:ide",
  "platform:vscode",
  "regression",
  "platform:wsl",
]);
export const PLATFORM = "wsl";
export const SURFACE = "vscode-wsl-dictation-paste";
export const HOST = "VS Code integrated terminal over Remote-WSL";
export const CHECKED_ON =
  "Claude Code 2.1.269 native installer, WSL2 Ubuntu, VS Code 1.137.0 Remote-WSL";
export const BUILD = "2.1.269";
export const GOOD_VERSION = "2.1.268";
export const WISPR = "Wispr Flow 1.6.827";
export const INSERT_PATH = "clipboard + simulated Ctrl+V";
export const VSCODE = "1.137.0 (Remote-WSL)";
export const EXTENSION = "anthropic.claude-code 2.1.269";
export const DISTRO = "WSL2 Ubuntu";
export const LINUX = "6.6.114.1-microsoft-standard-WSL2";
export const WINDOWS = "Windows 11";
export const CHANGELOG =
  "2.1.269 changelog includes terminal keyboard-input fixes (F1/F2/F4 in kitty-protocol terminals, Delete in st, Alt+arrows in rxvt-unicode, Shift+punctuation in WezTerm)";
export const INTERSECTION = "2.1.269 × VS Code integrated terminal";
export const WORKAROUND =
  "Pin 2.1.268 or run Claude Code in Windows Terminal instead of the VS Code integrated terminal";
export const PHRASE = "Score anarthria or admit articulate.";
export const DISTRIBUTION =
  "After auto-updating to 2.1.269, text inserted by a voice dictation tool (Wispr Flow — clipboard + simulated Ctrl+V) is no longer inserted into the Claude Code prompt when Claude Code runs in the VS Code integrated terminal (Remote-WSL). Nothing appears in the prompt; the text is silently dropped. Running 2.1.268 in the exact same terminal works, so this is a regression introduced in 2.1.269. 2.1.269 in Windows Terminal (same WSL distro) works. Plain bash prompt in the same VS Code terminal (no Claude Code) works. PowerShell in the VS Code integrated terminal works. Failure is exactly the intersection 2.1.269 × VS Code integrated terminal; neither factor alone reproduces it. Ruled out: VS Code screen-reader mode (editor.accessibilitySupport off), Claude Code voice mode, extension version (2.1.268 CLI works while extension stays 2.1.269), IDE integration (TERM_PROGRAM=xterm /ide), Wispr Flow version. Cousin cite-only: microsoft/vscode#282290 (Wispr/screen-reader detection — ruled out by reporter).";

export const RULED_OUT = Object.freeze([
  "VS Code screen-reader mode — editor.accessibilitySupport explicitly set to off, full VS Code restart — no change",
  "microsoft/vscode#282290 Wispr/screen-reader detection — ruled out by reporter; unrelated to this 2.1.269 regression",
  "Claude Code voice mode — voice.enabled: false (and legacy voiceEnabled: false), fresh session — no change",
  "VS Code extension version — 2.1.268 CLI works while the extension stays at 2.1.269",
  "IDE integration — launching with TERM_PROGRAM=xterm (preventing auto-connect) does not help; neither does disconnecting via /ide",
  "Wispr Flow version — 1.6.827 was installed a day before the regression and worked fine with 2.1.268 the whole day",
  "Trismus/#93823 UNUserNotification XPC lockjaw — that is a macOS Desktop freeze, not a dictation paste drop",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a Ctrl+V insert path",
  "Gleaner/#93794 unreaped `&` leftover harvest — Bash-call end, not a silent paste drop",
  "Stet/#93778 dictation buffer restores over composer edits — different dictation surface (composer, not VS Code WSL terminal prompt)",
  "Deadkey/#93788 ESC-CSI never resolve — key decode, not clipboard+Ctrl+V swallow",
]);
export const EXPECTED = Object.freeze([
  "Dictation paste (clipboard + simulated Ctrl+V) must insert into the Claude Code prompt",
  "Same insert behavior in the VS Code integrated terminal as in Windows Terminal / plain bash / PowerShell",
  "2.1.269 must not silently drop paste that 2.1.268 accepted in the same terminal",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "wispr-ctrlv",
    label: "Wispr Ctrl+V",
    count: "clipboard",
    note: "Wispr Flow inserts via clipboard + simulated Ctrl+V; voice arrives at the clipboard",
  },
  {
    id: "vscode-wsl",
    label: "VS Code WSL",
    count: "integrated",
    note: "Claude Code in the VS Code integrated terminal over Remote-WSL",
  },
  {
    id: "regression-21269",
    label: "2.1.269",
    count: "regression",
    note: "2.1.269 silently drops the paste; 2.1.268 in the same terminal works",
  },
  {
    id: "silent-drop",
    label: "silent drop",
    count: "swallowed",
    note: "nothing appears in the prompt; the text is silently dropped",
  },
  {
    id: "windows-terminal-ok",
    label: "Windows Terminal OK",
    count: "contrast",
    note: "2.1.269 in Windows Terminal (same WSL distro) inserts dictation",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "articulate-glottis",
    survey:
      "paste lands; prompt receives dictation; larynx of the prompt stays open",
    kind: "articulate",
    note: "idle: voice-strip open — the hold/good path",
  },
  {
    id: "wispr-ctrlv",
    survey:
      "Wispr Flow writes the clipboard and simulates Ctrl+V; voice has arrived",
    kind: "anarthria",
    note: "seeded: clipboard heard; larynx still silent",
  },
  {
    id: "vscode-wsl",
    survey:
      "Claude Code 2.1.269 in the VS Code integrated terminal over Remote-WSL",
    kind: "anarthria",
    note: "seeded: the intersection host where the paste is swallowed",
  },
  {
    id: "dictation-paste-drop",
    survey:
      "clipboard + Ctrl+V never reaches the Claude Code prompt; text is silently dropped",
    kind: "anarthria",
    note: "path: dictation-paste-drop names the mute larynx vs an articulate insert",
  },
  {
    id: "anarthria",
    survey:
      "voice arrives; prompt stays silent — 2.1.269 × VS Code integrated terminal",
    kind: "anarthria",
    note: "seeded: anarthria — the larynx of the prompt never phonates the paste",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "dictation-paste-drop",
  "anarthria",
  "wispr-ctrlv",
  "vscode-wsl",
  "regression-21269",
  "silent-drop",
]);

export const COUSINS = Object.freeze([
  {
    issue: 282290,
    repo: "microsoft/vscode",
    title:
      "Wispr Flow triggers VS Code screen-reader detection",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — reporter ruled this out (accessibilitySupport off, full restart, no change); do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "schism",
  "gleaner",
  "waif",
  "jetsam",
  "ashpan",
  "snatch",
  "disseisin",
  "rescript",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "rasure",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
  "flashpan",
  "guillotine",
  "parergon",
  "followspot",
  "calends",
  "alidade",
  "diopter",
  "sluice",
  "hysteresis",
]);

export const SAMPLE_CLIPBOARD = "heard";
export const SAMPLE_CLIPBOARD_IDLE = "ready";
export const SAMPLE_PROMPT_IDLE = "receives";
export const SAMPLE_PROMPT_SEEDED = "silent";

export const SAMPLE_ARTICULATE_PROOF = Object.freeze({
  articulate: true,
  anarthria: false,
  dictationPasteDrop: false,
  wisprCtrlV: false,
  vscodeWsl: false,
  regression21269: false,
  silentDrop: false,
  windowsTerminalOk: false,
  plainBashOk: false,
  version: GOOD_VERSION,
});

export const SAMPLE_ANARTHRIA_PROOF = Object.freeze({
  articulate: false,
  anarthria: true,
  dictationPasteDrop: true,
  wisprCtrlV: true,
  vscodeWsl: true,
  regression21269: true,
  silentDrop: true,
  windowsTerminalOk: false,
  plainBashOk: false,
  version: BUILD,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds articulate: paste lands; prompt receives dictation; larynx open" },
  { t: "wispr-ctrlv", line: "Wispr Flow writes clipboard and simulates Ctrl+V; voice has arrived" },
  { t: "vscode-wsl", line: "Claude Code 2.1.269 in VS Code integrated terminal over Remote-WSL" },
  { t: "path", line: "dictation-paste-drop — clipboard + Ctrl+V never reaches the prompt; text swallowed" },
  { t: "score", line: "when 2.1.269 × VS Code terminal swallows the paste the booth is anarthria — Score anarthria or admit articulate." },
]);

/**
 * Scope map: open glottis vs mute larynx on a swallowed paste.
 * Idle/articulate: paste lands; prompt receives; larynx open.
 * Seeded/anarthria: clipboard heard; Ctrl+V dropped; prompt silent.
 */
export function mapScope(input = {}) {
  const anarthria =
    input.anarthria === true ||
    input.dictationPasteDrop === true ||
    input.silentDrop === true ||
    input.wisprCtrlV === true ||
    input.vscodeWsl === true ||
    input.regression21269 === true;
  const articulate = input.articulate === true && !anarthria;
  return {
    stamp: anarthria ? "dictation-paste-drop" : "articulate-glottis",
    larynxLane: anarthria ? "mute" : "open",
    clipboardLane: anarthria ? "heard" : "ready",
    promptLane: anarthria ? "silent" : "receives",
    ribbon: anarthria ? "anarthria" : "articulate",
    articulate,
  };
}

export function inspectClipboard(input = {}) {
  const hit =
    input.dictationPasteDrop === true ||
    input.anarthria === true ||
    input.wisprCtrlV === true;
  if (input.articulate === true && !hit) {
    return {
      stamp: "clipboard-ready",
      heard: SAMPLE_CLIPBOARD_IDLE,
      listed: true,
    };
  }
  if (hit) {
    return {
      stamp: "clipboard-heard",
      heard: SAMPLE_CLIPBOARD,
      listed: false,
      tool: WISPR,
      path: INSERT_PATH,
    };
  }
  return {
    stamp: "clipboard-idle",
    listed: true,
  };
}

export function inspectPaste(input = {}) {
  const hit =
    input.anarthria === true ||
    input.dictationPasteDrop === true ||
    input.wisprCtrlV === true ||
    input.silentDrop === true;
  if (input.articulate === true && input.wisprCtrlV !== true) {
    return {
      stamp: "paste-lands",
      dropped: false,
      path: INSERT_PATH,
    };
  }
  return {
    stamp: hit ? "paste-dropped" : "paste-idle",
    dropped: hit,
    path: INSERT_PATH,
  };
}

export function inspectPrompt(input = {}) {
  const silent =
    input.silentDrop === true ||
    input.anarthria === true ||
    input.dictationPasteDrop === true;
  if (input.articulate === true && input.silentDrop !== true) {
    return {
      stamp: "prompt-receives",
      silent: false,
      text: SAMPLE_PROMPT_IDLE,
    };
  }
  return {
    stamp: silent ? "prompt-silent" : "prompt-idle",
    silent,
    text: silent ? SAMPLE_PROMPT_SEEDED : "",
  };
}

export function inspectTerminal(input = {}) {
  const vscode =
    input.vscodeWsl === true ||
    input.anarthria === true;
  return {
    stamp: vscode ? "vscode-wsl" : "terminal-idle",
    vscode,
    host: vscode ? HOST : "",
    windowsTerminalOk: input.windowsTerminalOk === true,
    plainBashOk: input.plainBashOk === true,
  };
}

export function inspectVersion(input = {}) {
  const regression =
    input.regression21269 === true ||
    input.anarthria === true;
  if (input.articulate === true && input.regression21269 !== true) {
    return {
      stamp: "version-good",
      build: GOOD_VERSION,
      regression: false,
    };
  }
  return {
    stamp: regression ? "regression-21269" : "version-idle",
    build: regression ? BUILD : "",
    good: GOOD_VERSION,
    regression,
    intersection: regression ? INTERSECTION : "",
  };
}

export function inspectDrop(input = {}) {
  const dropped =
    input.silentDrop === true ||
    input.anarthria === true;
  if (input.articulate === true && input.silentDrop !== true) {
    return {
      stamp: "drop-held",
      dropped: false,
    };
  }
  return {
    stamp: dropped ? "silent-drop" : "drop-idle",
    dropped,
    note: dropped ? "nothing appears in the prompt; the text is silently dropped" : "",
  };
}

export function readBooth(input = {}) {
  const anarthria =
    input.anarthria === true ||
    input.dictationPasteDrop === true ||
    input.silentDrop === true ||
    input.wisprCtrlV === true ||
    input.vscodeWsl === true ||
    input.regression21269 === true;
  const articulate = input.articulate === true && !anarthria;
  return {
    mark: anarthria ? "anarthria" : articulate || !anarthria ? "articulate" : "anarthria",
    articulate,
    anarthria,
    dictationPasteDrop: input.dictationPasteDrop === true || anarthria,
    wisprCtrlV: input.wisprCtrlV === true,
    vscodeWsl: input.vscodeWsl === true,
    regression21269: input.regression21269 === true,
    silentDrop: input.silentDrop === true,
    windowsTerminalOk: input.windowsTerminalOk === true,
    plainBashOk: input.plainBashOk === true,
    scope: mapScope(input),
    clipboard: inspectClipboard(input),
    paste: inspectPaste(input),
    prompt: inspectPrompt(input),
    terminal: inspectTerminal(input),
    version: inspectVersion(input),
    drop: inspectDrop(input),
    log: input.log || [],
  };
}

export const ANARTHRIA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-articulate",
    articulate: true,
    anarthria: false,
    cue: "articulate",
    note: "idle HOLD: paste lands; prompt receives dictation; larynx open — the hold/good path",
  },
  {
    t: "wispr-ctrlv",
    event: "wispr-ctrlv",
    anarthria: true,
    wisprCtrlV: true,
    cue: "anarthria",
    note: "Wispr Flow writes clipboard and simulates Ctrl+V; voice has arrived",
  },
  {
    t: "vscode-wsl",
    event: "vscode-wsl",
    anarthria: true,
    vscodeWsl: true,
    cue: "anarthria",
    note: "Claude Code 2.1.269 in VS Code integrated terminal over Remote-WSL",
  },
  {
    t: "path",
    event: "dictation-paste-drop",
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
    cue: "anarthria",
    note: "dictation-paste-drop — clipboard + Ctrl+V never reaches the prompt",
  },
  {
    t: "score",
    event: "anarthria",
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
    wisprCtrlV: true,
    cue: "anarthria",
    note: "anarthria — when 2.1.269 × VS Code terminal swallows the paste the booth is anarthria",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-articulate",
    articulate: true,
    anarthria: false,
    cue: "articulate",
    note: "positive control: paste lands; larynx open",
  },
  {
    t: "announce",
    event: "cue-articulate",
    articulate: true,
    cue: "articulate",
    note: "positive control: the glottis stays articulate",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    articulate: true,
    anarthria: false,
    dictationPasteDrop: false,
    cue: "articulate",
  };
}

export function seedArticulate() {
  return { ...emptyTicket() };
}

export function seedAnarthria() {
  return {
    seed: SEEDED_WORD,
    articulate: false,
    anarthria: true,
    dictationPasteDrop: true,
    wisprCtrlV: true,
    vscodeWsl: true,
    regression21269: true,
    silentDrop: true,
    cue: "anarthria",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ANARTHRIA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
    cue: "anarthria",
  };
}

export function seedDictationPasteDrop() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
    event: "dictation-paste-drop",
    cue: "anarthria",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function seedWisprCtrlV() {
  return {
    seed: "wispr-ctrlv",
    preferSeed: true,
    wisprCtrlV: true,
    cue: "anarthria",
  };
}

export function seedVscodeWsl() {
  return {
    seed: "vscode-wsl",
    preferSeed: true,
    vscodeWsl: true,
    cue: "anarthria",
  };
}

export function seedRegression21269() {
  return {
    seed: "regression-21269",
    preferSeed: true,
    regression21269: true,
    cue: "anarthria",
  };
}

export function seedSilentDrop() {
  return {
    seed: "silent-drop",
    preferSeed: true,
    silentDrop: true,
    cue: "anarthria",
  };
}

export function seedWindowsTerminalOk() {
  return {
    seed: "windows-terminal-ok",
    preferSeed: true,
    windowsTerminalOk: true,
    cue: "articulate",
  };
}

export function seedPlainBashOk() {
  return {
    seed: "plain-bash-ok",
    preferSeed: true,
    plainBashOk: true,
    cue: "articulate",
  };
}

export function seedPhonated() {
  return {
    seed: "phonated",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function seedReceived() {
  return {
    seed: "received",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function seedLanding() {
  return {
    seed: "landing",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function seedLarynxOpen() {
  return {
    seed: "larynx-open",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function seedClipboardHeard() {
  return {
    seed: "clipboard-heard",
    preferSeed: true,
    articulate: true,
    cue: "articulate",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      articulate: false,
      anarthria: false,
      dictationPasteDrop: false,
      wisprCtrlV: false,
      vscodeWsl: false,
      regression21269: false,
      silentDrop: false,
      windowsTerminalOk: false,
      plainBashOk: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    articulate: raw.articulate === true,
    anarthria:
      raw.anarthria === true ||
      raw.event === "anarthria",
    dictationPasteDrop:
      raw.dictationPasteDrop === true || raw.event === "dictation-paste-drop",
    wisprCtrlV: raw.wisprCtrlV === true || raw.event === "wispr-ctrlv",
    vscodeWsl: raw.vscodeWsl === true || raw.event === "vscode-wsl",
    regression21269:
      raw.regression21269 === true || raw.event === "regression-21269",
    silentDrop: raw.silentDrop === true || raw.event === "silent-drop",
    windowsTerminalOk:
      raw.windowsTerminalOk === true || raw.event === "windows-terminal-ok",
    plainBashOk: raw.plainBashOk === true || raw.event === "plain-bash-ok",
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
      (ticket.articulate != null ||
        ticket.anarthria != null ||
        ticket.dictationPasteDrop != null ||
        ticket.wisprCtrlV != null ||
        ticket.vscodeWsl != null ||
        ticket.regression21269 != null ||
        ticket.silentDrop != null ||
        ticket.windowsTerminalOk != null ||
        ticket.plainBashOk != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isArticulate(row) {
  if (row.anarthria && row.cue !== "articulate") return false;
  if (
    row.cue === "anarthria" ||
    row.cue === "dictation-paste-drop"
  ) {
    return false;
  }
  if (
    row.dictationPasteDrop &&
    row.silentDrop &&
    row.cue !== "articulate" &&
    row.articulate !== true
  ) {
    return false;
  }
  if (row.articulate === true && row.anarthria !== true && row.cue !== "anarthria") {
    return true;
  }
  if (
    row.cue === "articulate" &&
    row.anarthria !== true &&
    row.dictationPasteDrop !== true &&
    row.silentDrop !== true &&
    row.wisprCtrlV !== true &&
    row.vscodeWsl !== true &&
    row.regression21269 !== true
  ) {
    return true;
  }
  return false;
}

function isDictationPasteDrop(row) {
  return (
    row.event === "dictation-paste-drop" &&
    !isArticulate(row) &&
    (row.dictationPasteDrop === true ||
      row.silentDrop === true ||
      row.wisprCtrlV === true)
  );
}

function isAnarthriaRow(row) {
  if (isArticulate(row)) return false;
  if (isDictationPasteDrop(row) && row.cue !== "anarthria") return false;
  if (row.cue === "anarthria") return true;
  if (row.anarthria === true) return true;
  if (row.dictationPasteDrop === true && row.silentDrop === true) {
    return true;
  }
  if (
    row.dictationPasteDrop === true ||
    row.silentDrop === true ||
    row.wisprCtrlV === true ||
    row.vscodeWsl === true ||
    row.regression21269 === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one anarthria pass against the laryngoscope chart.
 * articulate: paste lands; prompt receives dictation.
 * anarthria: 2.1.269 × VS Code WSL terminal silently drops Ctrl+V.
 * dictation-paste-drop: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDictationPasteDrop(row) ||
    (row.dictationPasteDrop && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "dictation-paste-drop";
  } else if (isAnarthriaRow(row)) {
    verdict = "anarthria";
  } else if (isArticulate(row)) {
    verdict = "articulate";
  } else if (
    row.dictationPasteDrop ||
    row.silentDrop ||
    row.wisprCtrlV ||
    row.vscodeWsl ||
    row.regression21269
  ) {
    verdict = "anarthria";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const clipboard = inspectClipboard(row);
  const paste = inspectPaste(row);
  const prompt = inspectPrompt(row);
  const terminal = inspectTerminal(row);
  const version = inspectVersion(row);
  const drop = inspectDrop(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    articulate: verdict === "articulate" || verdict === "hold",
    anarthria: verdict === "anarthria" || verdict === SEEDED_WORD,
    dictationPasteDrop:
      row.dictationPasteDrop === true ||
      verdict === "dictation-paste-drop" ||
      verdict === PATH_WORD,
    wisprCtrlV: row.wisprCtrlV,
    vscodeWsl: row.vscodeWsl,
    regression21269: row.regression21269,
    silentDrop: row.silentDrop,
    windowsTerminalOk: row.windowsTerminalOk,
    plainBashOk: row.plainBashOk,
    cue: hold
      ? "articulate"
      : row.dictationPasteDrop || verdict === "dictation-paste-drop"
        ? "dictation-paste-drop"
        : "anarthria",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit articulate" : "score anarthria",
    clipboardInspect: clipboard,
    pasteInspect: paste,
    promptInspect: prompt,
    terminalInspect: terminal,
    versionInspect: version,
    dropInspect: drop,
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
      : ANARTHRIA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "anarthria");
  const path = scored.filter((row) => row.verdict === "dictation-paste-drop");
  const articulate = scored.filter((row) => row.verdict === "articulate");
  const headline =
    scored.find((row) => row.event === "anarthria") ||
    scored.find((row) => row.event === "dictation-paste-drop") ||
    scored.find((row) => row.event === "wispr-ctrlv") ||
    dead[dead.length - 1];
  let verdict = "articulate";
  if (dead.length) verdict = "anarthria";
  else if (path.length && !articulate.length) verdict = "dictation-paste-drop";
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
    anarthriaCount: dead.length,
    pathCount: path.length,
    articulateCount: articulate.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit articulate" : "score anarthria",
    note: headline
      ? "2.1.269 × VS Code integrated terminal over Remote-WSL silently drops Wispr Flow clipboard+Ctrl+V; cousin microsoft/vscode#282290 is cite-only and ruled out. 2.1.268 and Windows Terminal / plain bash / PowerShell OK."
      : "published anarthria walk scored against articulate vs anarthria",
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
    seeded !== "articulate" &&
    seeded !== "anarthria" &&
    seeded !== "dictation-paste-drop" &&
    ticket.articulate == null &&
    ticket.anarthria == null &&
    ticket.dictationPasteDrop == null &&
    ticket.silentDrop == null &&
    ticket.wisprCtrlV == null &&
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
    articulate: scored.articulate ?? false,
    anarthria: scored.anarthria ?? false,
    dictationPasteDrop: scored.dictationPasteDrop ?? false,
    wisprCtrlV: scored.wisprCtrlV ?? false,
    vscodeWsl: scored.vscodeWsl ?? false,
    regression21269: scored.regression21269 ?? false,
    silentDrop: scored.silentDrop ?? false,
    windowsTerminalOk: scored.windowsTerminalOk ?? false,
    plainBashOk: scored.plainBashOk ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.wisprCtrlV || result.anarthria ? "clip=heard" : "clip=ready",
    result.silentDrop || result.anarthria ? "paste=dropped" : "paste=lands",
    result.vscodeWsl || result.anarthria ? "term=vscode-wsl" : "term=open",
    result.dictationPasteDrop || result.verdict === "dictation-paste-drop"
      ? "path=dictation-paste-drop"
      : "path=articulate",
    result.cue === "articulate"
      ? "cue=articulate"
      : result.cue === "dictation-paste-drop"
        ? "cue=dictation-paste-drop"
        : "cue=anarthria",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    articulate: result.articulate,
    anarthria: result.anarthria,
    dictationPasteDrop: result.dictationPasteDrop,
    wisprCtrlV: result.wisprCtrlV,
    vscodeWsl: result.vscodeWsl,
    regression21269: result.regression21269,
    silentDrop: result.silentDrop,
    windowsTerminalOk: result.windowsTerminalOk,
    plainBashOk: result.plainBashOk,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    clipboard: inspectClipboard({
      articulate: result.articulate,
      anarthria: result.anarthria,
      dictationPasteDrop: result.dictationPasteDrop,
      wisprCtrlV: result.wisprCtrlV,
    }),
    paste: inspectPaste({
      articulate: result.articulate,
      anarthria: result.anarthria,
      dictationPasteDrop: result.dictationPasteDrop,
      wisprCtrlV: result.wisprCtrlV,
      silentDrop: result.silentDrop,
    }),
    prompt: inspectPrompt({
      articulate: result.articulate,
      anarthria: result.anarthria,
      dictationPasteDrop: result.dictationPasteDrop,
      silentDrop: result.silentDrop,
    }),
    terminal: inspectTerminal({
      articulate: result.articulate,
      anarthria: result.anarthria,
      vscodeWsl: result.vscodeWsl,
      windowsTerminalOk: result.windowsTerminalOk,
      plainBashOk: result.plainBashOk,
    }),
    version: inspectVersion({
      articulate: result.articulate,
      anarthria: result.anarthria,
      regression21269: result.regression21269,
    }),
    drop: inspectDrop({
      articulate: result.articulate,
      anarthria: result.anarthria,
      silentDrop: result.silentDrop,
    }),
    scope: mapScope({
      articulate: result.articulate,
      anarthria: result.anarthria,
      dictationPasteDrop: result.dictationPasteDrop,
      silentDrop: result.silentDrop,
      wisprCtrlV: result.wisprCtrlV,
      vscodeWsl: result.vscodeWsl,
      regression21269: result.regression21269,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      anarthria:
        result.anarthria === true ||
        result.verdict === "anarthria",
    })),
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
      goodVersion: GOOD_VERSION,
      wispr: WISPR,
      insertPath: INSERT_PATH,
      vscode: VSCODE,
      extension: EXTENSION,
      distro: DISTRO,
      linux: LINUX,
      windows: WINDOWS,
      changelog: CHANGELOG,
      intersection: INTERSECTION,
      workaround: WORKAROUND,
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
        "NON-BINDING: 2.1.269 terminal keyboard-input parser changes have a side effect on how pasted input from xterm.js (VS Code's terminal) is consumed. Invite verify against #93782 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
