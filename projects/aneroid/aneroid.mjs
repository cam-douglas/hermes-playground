#!/usr/bin/env node
/**
 * Aneroid — aneroid-barometer / meteorological instrument-panel booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * VS Code extension 2.1.269 (win32-x64); CLI 2.1.158; Windows 11
 * Enterprise 10.0.26200; Opus 5, 1M context; settings.json
 * autoCompactWindow: 500000. The context ring and hover are computed
 * against the model's context window, not the configured
 * autoCompactWindow. The string autoCompactWindow does not appear in
 * webview/index.js (0 hits) but appears 18 times in bin/claude.exe.
 * Webview is handed
 *   contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000
 * then suppresses the ring while U >= 50 against that wrong window.
 * Ring first appears ~500k tokens used; auto-compaction fires almost
 * immediately; hover says "50% of context remaining until auto-compact"
 * when none remains; bottom-right says "50% context used" measured
 * against 1M. Lowering autoCompactWindow to compact sooner can remove
 * the warning entirely.
 *
 *   node aneroid.mjs data/aneroided.json
 *   echo '{"seed":"aneroided"}' | node aneroid.mjs
 *
 * Idle word is calibrated (HOLD: ring scored against autoCompactWindow;
 * warning appears with runway before compact).
 * Seeded word is aneroided (#93901 — wrong model window + hard 50%
 * suppression = no warning before auto-compact).
 * Path word is wrong-window-ring.
 * Product score word is aneroid (Score aneroid or admit calibrated.).
 *
 * Encoded from anthropics/claude-code#93901 issue text only.
 * Hypothesis (NON-BINDING): the webview never receives the
 * CLI-resolved autoCompactWindow, so percentages and the hard 50%
 * suppress gate run against the model window. The issue grepped 0
 * hits in webview/index.js and 18 in bin/claude.exe — offered as the
 * issue's own evidence, not a source-root-cause claim beyond that
 * grep. Verify against #93901 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "calibrated",
  "aneroided",
  "aneroid",
  "wrong-window-ring",
  "hold",
  "correct-window",
  "ring-ahead",
  "runway",
  "model-window",
  "hover-mislabel",
  "fifty-suppress",
  "no-runway",
  "settings-absent",
  "webview-zero-hits",
  "cli-eighteen",
  "compact-immediate",
  "lower-window-worse",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "calibrated";
export const PATH_WORD = "wrong-window-ring";
export const SEEDED_WORD = "aneroided";
export const PRODUCT_WORD = "aneroid";
export const HOLD = Object.freeze(["calibrated", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "calibrated",
  "correct-window",
  "ring-ahead",
  "runway",
]);
export const RECOVER = Object.freeze(["calibrated", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "aneroided" && name !== "aneroid"),
);

export const FEATURED_ISSUE = 93901;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93901";
export const TITLE =
  "VS Code extension: context ring ignores autoCompactWindow, giving no warning before auto-compact fires";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:ide",
  "platform:vscode",
]);
export const PLATFORM = "vscode";
export const CLAUDE_VERSION =
  "VS Code extension 2.1.269 (win32-x64) / CLI 2.1.158";
export const GOOD_VERSION =
  "ring scored against CLI-resolved autoCompactWindow; warning appears with runway before compact";
export const SURFACE = "vscode-extension-webview";
export const HOST = "windows-vscode";
export const INSTALL_PATH = "~/.claude/settings.json";
export const COMMAND =
  "set autoCompactWindow 500000 on Opus 5 1M; watch ring vs hover vs compact";
export const PHRASE = "Score aneroid or admit calibrated.";
export const DISTRIBUTION =
  "Claude Code VS Code extension 2.1.269 (win32-x64); CLI 2.1.158; Windows 11 Enterprise 10.0.26200. Model: Opus 5, 1M context. ~/.claude/settings.json contains \"autoCompactWindow\": 500000. The string autoCompactWindow does not occur in webview/index.js (0 hits) but appears 18 times in bin/claude.exe. Webview is handed contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000 then suppresses the ring while U >= 50 against that wrong window. Ring first appears ~500k tokens used; auto-compaction fires almost immediately. Hover: \"50% of context remaining until auto-compact\" when none remains. Bottom-right: \"50% context used\" measured against 1M. Lowering autoCompactWindow to compact sooner can remove the warning entirely. CLI xRH/yX4 is correct against the resolved window; $88 reports source as settings. On a 1M model the ring cannot render below roughly 461k–494k tokens used. Workaround: set autoCompactWindow above ~500k; usable runway ≈ autoCompactWindow - 500000. Scope: measured against the VS Code extension bundle; desktop likely shares the webview (#91385 comparable) but was not verified.";
export const RULED_OUT = Object.freeze([
  "A missing settings.json key — autoCompactWindow: 500000 is set; the CLI resolves it ($88 source=settings)",
  "#90756 — Desktop UI control to set the value; different ask: this is the ring misreporting once the value is already set",
  "#91385 — hard per-prompt window hit mid-turn where compaction cannot help; different problem: this is the configured window absent from the webview bundle plus a hard-coded 50% suppress",
]);
export const EXPECTED = Object.freeze([
  "The ring should reflect the configured auto-compact window, not the model's 1M window",
  "The ring should appear far enough ahead of compaction to be actionable",
  "Hover should not say remaining until auto-compact when remaining is measured against the model window",
  "Lowering autoCompactWindow to compact sooner should not remove the warning",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "wrong-scale", label: "model window", count: "1M", note: "ring scored against usageData.contextWindow minus maxOutputTokens minus 13000, not autoCompactWindow" },
  { id: "fifty-gate", label: "U >= 50", count: "suppress", note: "hard-coded suppress while percent remaining of the wrong window is >= 50" },
  { id: "hover-lie", label: "hover mislabel", count: "50%", note: "50% of context remaining until auto-compact when none remains" },
  { id: "webview-gap", label: "0 hits", count: "webview", note: "autoCompactWindow does not appear in webview/index.js; 18 hits in bin/claude.exe" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "calibrated-gate",
    survey: "ring scored against autoCompactWindow; warning appears with runway before compact",
    kind: "calibrated",
    note: "idle: the capsule reads the configured window — the hold/good path",
  },
  {
    id: "model-window",
    survey: "webview handed contextWindow: usageData.contextWindow - maxOutputTokens - 13000",
    kind: "aneroided",
    note: "seeded: the dial is locked to the model's 1M scale",
  },
  {
    id: "fifty-suppress",
    survey: "if (U >= 50) return null — ring hidden until ~50% of the wrong window is gone",
    kind: "aneroided",
    note: "seeded: warning needle never lifts before the storm",
  },
  {
    id: "hover-mislabel",
    survey: "hover says 50% of context remaining until auto-compact when none remains",
    kind: "aneroided",
    note: "seeded: U is percent of the model window remaining, mislabelled as until auto-compact",
  },
  {
    id: "wrong-window-ring",
    survey: "ring first appears ~500k; compact fires almost immediately; lowering the window can hide the ring",
    kind: "aneroided",
    note: "path: wrong-window-ring names the sealed gauge that never warns in time",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "wrong-window-ring",
  "aneroided",
  "model-window",
  "hover-mislabel",
  "fifty-suppress",
]);

export const COUSINS = Object.freeze([
  {
    issue: 90756,
    title: "Desktop: expose the auto-compact window in the usage ring",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — UI control to set the value; different problem: this booth is the ring misreporting once the value is already set — do not re-ship",
  },
  {
    issue: 91385,
    title: "Context ring no longer warns before the window limit",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — hard per-prompt window mid-turn where compaction cannot help; different problem: configured window absent from the webview — do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93744, title: "backup #93744 (/goal Stop evaluator blind)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93862, title: "backup #93862 (socat race)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93859, title: "backup #93859 (desktop session fork)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93863, title: "backup #93863 (getcwd EPERM)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889 (orphan bash)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
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
]);

export const MODEL_WINDOW = 1000000;
export const AUTO_COMPACT_WINDOW = 500000;
export const MAX_OUTPUT_RESERVE = 32000;
export const BUFFER_TOKENS = 13000;
export const SUPPRESS_REMAINING = 50;
export const WEBVIEW_HITS = 0;
export const CLI_HITS = 18;

export const SAMPLE_CALIBRATED_PANEL = Object.freeze({
  autoCompactWindow: AUTO_COMPACT_WINDOW,
  modelWindow: MODEL_WINDOW,
  usesConfiguredWindow: true,
  ringVisibleAhead: true,
  hoverHonest: true,
  version: GOOD_VERSION,
});

export const SAMPLE_ANEROIDED_PANEL = Object.freeze({
  autoCompactWindow: AUTO_COMPACT_WINDOW,
  modelWindow: MODEL_WINDOW,
  usesConfiguredWindow: false,
  ringVisibleAhead: false,
  hoverHonest: false,
  tokensUsedAtRing: 500000,
  compactFiresImmediately: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_WRONG_WINDOW = Object.freeze({
  handed:
    "contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000",
  modelWindow: MODEL_WINDOW,
  autoCompactWindow: AUTO_COMPACT_WINDOW,
  usesModelWindow: true,
  webviewHits: WEBVIEW_HITS,
  cliHits: CLI_HITS,
});

export const SAMPLE_CALIBRATED_WINDOW = Object.freeze({
  handed: "CLI ul(model, autoCompactWindow).window",
  modelWindow: MODEL_WINDOW,
  autoCompactWindow: AUTO_COMPACT_WINDOW,
  usesModelWindow: false,
  webviewHits: 1,
  cliHits: CLI_HITS,
});

export const SAMPLE_HOVER_MISLABEL = Object.freeze({
  popup: "50% of context remaining until auto-compact.",
  title: "50% context used - click to compact",
  bottomRight: "50% context used",
  remainingUntilCompact: 0,
  measuredAgainst: "model-window",
});

export const SAMPLE_HOVER_HONEST = Object.freeze({
  popup: "runway remaining until auto-compact against autoCompactWindow",
  title: "context used against autoCompactWindow - click to compact",
  bottomRight: "percent of configured window",
  remainingUntilCompact: true,
  measuredAgainst: "autoCompactWindow",
});

export const SAMPLE_FIFTY_SUPPRESS = Object.freeze({
  threshold: SUPPRESS_REMAINING,
  rule: "if (U >= 50) return null",
  suppressed: true,
  firstRenderTokens: 500000,
  cannotRenderBelow: [461000, 494000],
});

export const SAMPLE_RING_AHEAD = Object.freeze({
  threshold: SUPPRESS_REMAINING,
  rule: "suppress derived from configured window",
  suppressed: false,
  firstRenderTokens: 250000,
  cannotRenderBelow: [0, 0],
});

export const SAMPLE_SETTINGS_SNIPPET = Object.freeze({
  path: "~/.claude/settings.json",
  autoCompactWindow: 500000,
  model: "Opus 5",
  context: "1M",
});

export const SAMPLE_LOWER_WINDOW_WORSE = Object.freeze({
  below500k: "none — the ring never renders first",
  at500k: "~zero; the render threshold and the compaction point coincide",
  at600k: "roughly 30k–125k tokens",
  invertIntent: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds calibrated: ring scored against autoCompactWindow; warning appears with runway before compact" },
  { t: "settings-absent", line: "autoCompactWindow does not appear in webview/index.js (0 hits); 18 hits in bin/claude.exe" },
  { t: "model-window", line: "webview handed contextWindow: usageData.contextWindow - maxOutputTokens - 13000" },
  { t: "fifty-suppress", line: "if (U >= 50) return null against the wrong window; ring hidden until ~500k" },
  { t: "path", line: "wrong-window-ring — first appears ~500k; compact fires almost immediately; hover says 50% remaining when none remains" },
  { t: "score", line: "when the sealed gauge reads the 1M scale the warning needle never lifts before the storm — Score aneroid or admit calibrated." },
]);

export function computeRing(input = {}) {
  const tokensUsed = Number(input.tokensUsed ?? input.used ?? 500000);
  const calibrated = input.calibrated === true && input.aneroided !== true;
  const windowSize = calibrated
    ? Number(input.autoCompactWindow ?? AUTO_COMPACT_WINDOW)
    : Number(input.modelWindow ?? MODEL_WINDOW);
  const maxOut = Number(input.maxOutputTokens ?? MAX_OUTPUT_RESERVE);
  const reserve = Number(input.reserve ?? BUFFER_TOKENS);
  const J = windowSize - maxOut - reserve;
  const z = J > 0 ? Math.min((tokensUsed / J) * 100, 100) : 0;
  const U = 100 - z;
  const suppressed = U >= SUPPRESS_REMAINING;
  return {
    tokensUsed,
    windowSize,
    J,
    z,
    U,
    suppressed,
    measuredAgainst: calibrated ? "autoCompactWindow" : "model-window",
    title: `${Math.round(z)}% context used - click to compact`,
    popup: `${Math.round(U)}% of context remaining until auto-compact.`,
    stamp: suppressed ? "fifty-suppress" : calibrated ? "ring-ahead" : "wrong-window-ring",
  };
}

export function inspectWindow(input = {}) {
  const win =
    input.window && typeof input.window === "object"
      ? input.window
      : input.calibrated === true && input.aneroided !== true
        ? SAMPLE_CALIBRATED_WINDOW
        : SAMPLE_WRONG_WINDOW;
  const forced =
    input.modelWindow === true ||
    input.wrongWindowRing === true ||
    input.event === "model-window" ||
    input.event === "wrong-window-ring" ||
    input.event === "aneroided" ||
    input.event === "aneroid" ||
    input.aneroided === true;
  const wrong = forced ? true : win.usesModelWindow === true && input.calibrated !== true;
  return {
    usesModelWindow: wrong,
    modelWindow: MODEL_WINDOW,
    autoCompactWindow: AUTO_COMPACT_WINDOW,
    handed: wrong
      ? SAMPLE_WRONG_WINDOW.handed
      : SAMPLE_CALIBRATED_WINDOW.handed,
    stamp: wrong ? "model-window" : "correct-window",
    note: wrong
      ? "webview handed the model's window minus maxOutputTokens minus 13000"
      : "ring scored against CLI-resolved autoCompactWindow",
  };
}

export function inspectRing(input = {}) {
  const ring =
    input.ring && typeof input.ring === "object"
      ? input.ring
      : input.calibrated === true && input.aneroided !== true
        ? SAMPLE_RING_AHEAD
        : SAMPLE_FIFTY_SUPPRESS;
  const forced =
    input.fiftySuppress === true ||
    input.event === "fifty-suppress" ||
    input.event === "aneroided" ||
    input.event === "aneroid" ||
    input.aneroided === true;
  const suppressed = forced ? true : ring.suppressed === true && input.calibrated !== true;
  return {
    suppressed,
    threshold: SUPPRESS_REMAINING,
    firstRenderTokens: suppressed ? 500000 : ring.firstRenderTokens || 250000,
    stamp: suppressed ? "fifty-suppress" : "ring-ahead",
    note: suppressed
      ? "ring suppressed while U >= 50 against the model window; first appears ~500k"
      : "ring appears with runway before compact against the configured window",
  };
}

export function inspectHover(input = {}) {
  const hover =
    input.hover && typeof input.hover === "object"
      ? input.hover
      : input.calibrated === true && input.aneroided !== true
        ? SAMPLE_HOVER_HONEST
        : SAMPLE_HOVER_MISLABEL;
  const forced =
    input.hoverMislabel === true ||
    input.event === "hover-mislabel" ||
    input.event === "aneroided" ||
    input.event === "aneroid";
  const lie = forced ? true : hover.measuredAgainst === "model-window" && input.calibrated !== true;
  return {
    popup: lie
      ? SAMPLE_HOVER_MISLABEL.popup
      : hover.popup || SAMPLE_HOVER_HONEST.popup,
    bottomRight: lie
      ? SAMPLE_HOVER_MISLABEL.bottomRight
      : hover.bottomRight || SAMPLE_HOVER_HONEST.bottomRight,
    remainingUntilCompact: lie ? 0 : true,
    stamp: lie ? "hover-mislabel" : "hover-honest",
    note: lie
      ? "50% of context remaining until auto-compact when none remains"
      : "hover names remaining against the configured autoCompactWindow",
  };
}

export function inspectSettings(input = {}) {
  const settings =
    input.settings && typeof input.settings === "object"
      ? input.settings
      : SAMPLE_SETTINGS_SNIPPET;
  const forced =
    input.settingsAbsent === true ||
    input.webviewZeroHits === true ||
    input.event === "settings-absent" ||
    input.event === "webview-zero-hits" ||
    input.event === "aneroided" ||
    input.event === "aneroid" ||
    input.aneroided === true;
  const absent = forced ? true : input.calibrated !== true;
  return {
    path: settings.path || INSTALL_PATH,
    autoCompactWindow: settings.autoCompactWindow ?? AUTO_COMPACT_WINDOW,
    webviewHits: absent ? WEBVIEW_HITS : 1,
    cliHits: CLI_HITS,
    stamp: absent ? "settings-absent" : "settings-present",
    note: absent
      ? "autoCompactWindow in settings.json; 0 hits in webview/index.js; 18 hits in bin/claude.exe"
      : "configured window is threaded into the webview",
  };
}

export function inspectThreshold(input = {}) {
  const table =
    input.lowerWindow && typeof input.lowerWindow === "object"
      ? input.lowerWindow
      : SAMPLE_LOWER_WINDOW_WORSE;
  const forced =
    input.lowerWindowWorse === true ||
    input.noRunway === true ||
    input.compactImmediate === true ||
    input.event === "lower-window-worse" ||
    input.event === "no-runway" ||
    input.event === "compact-immediate" ||
    input.event === "aneroided" ||
    input.event === "aneroid";
  const invert = forced ? true : table.invertIntent === true && input.calibrated !== true;
  return {
    invertIntent: invert,
    at500k: table.at500k,
    below500k: table.below500k,
    stamp: invert ? "lower-window-worse" : "runway-holds",
    note: invert
      ? "lowering autoCompactWindow to compact sooner can remove the warning entirely"
      : "lowering the configured window still leaves a warning runway",
  };
}

export function readBooth(input = {}) {
  const window = inspectWindow(input);
  const ring = inspectRing(input);
  const hover = inspectHover(input);
  const settings = inspectSettings(input);
  const threshold = inspectThreshold(input);
  const aneroided =
    input.calibrated !== true &&
    ((window.usesModelWindow === true && ring.suppressed === true) ||
      input.aneroided === true);
  const calibrated =
    input.calibrated === true && aneroided !== true && window.usesModelWindow !== true;
  const path =
    (input.event === "wrong-window-ring" || input.wrongWindowRing === true) &&
    (window.usesModelWindow === true || input.aneroided === true);
  return {
    window,
    ring,
    hover,
    settings,
    threshold,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    aneroided: aneroided && !calibrated && !path,
    calibrated: calibrated || (!aneroided && !path && input.aneroided !== true && input.wrongWindowRing !== true && window.usesModelWindow !== true),
    wrongWindowRing: path && !calibrated,
    mark:
      path && !calibrated
        ? "wrong-window-ring"
        : aneroided && !calibrated
          ? "aneroided"
          : "calibrated",
  };
}

/**
 * Published aneroid walk from #93901 only. Facts from the issue text.
 * A calibrated booth scores the ring against autoCompactWindow with runway.
 * An aneroided booth scores against the model window and suppresses until 50%.
 * A wrong-window-ring booth names that path.
 */
export const ANEROID_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-calibrated",
    calibrated: true,
    aneroided: false,
    cue: "calibrated",
    note: "idle HOLD: ring scored against autoCompactWindow; warning appears with runway before compact — the hold/good path",
  },
  {
    t: "settings-absent",
    event: "settings-absent",
    aneroided: true,
    settingsAbsent: true,
    webviewZeroHits: true,
    cue: "aneroided",
    note: "autoCompactWindow does not appear in webview/index.js (0 hits); 18 hits in bin/claude.exe",
  },
  {
    t: "model-window",
    event: "model-window",
    aneroided: true,
    modelWindow: true,
    cue: "aneroided",
    note: "webview handed contextWindow: usageData.contextWindow - maxOutputTokens - 13000",
  },
  {
    t: "fifty-suppress",
    event: "fifty-suppress",
    aneroided: true,
    fiftySuppress: true,
    cue: "aneroided",
    note: "if (U >= 50) return null against the wrong window",
  },
  {
    t: "path",
    event: "wrong-window-ring",
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    fiftySuppress: true,
    cue: "aneroided",
    note: "wrong-window-ring — first appears ~500k; compact fires almost immediately",
  },
  {
    t: "score",
    event: "aneroid",
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    hoverMislabel: true,
    fiftySuppress: true,
    cue: "aneroided",
    note: "aneroid — when the sealed gauge reads the 1M scale the warning needle never lifts before the storm",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-calibrated",
    calibrated: true,
    aneroided: false,
    cue: "calibrated",
    note: "positive control: ring scored against autoCompactWindow; runway before compact",
  },
  {
    t: "announce",
    event: "cue-calibrated",
    calibrated: true,
    cue: "calibrated",
    note: "positive control: the capsule stays calibrated",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    calibrated: true,
    aneroided: false,
    wrongWindowRing: false,
    cue: "calibrated",
  };
}

export function seedCalibrated() {
  return { ...emptyTicket() };
}

export function seedAneroided() {
  return {
    seed: SEEDED_WORD,
    calibrated: false,
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    hoverMislabel: true,
    fiftySuppress: true,
    noRunway: true,
    settingsAbsent: true,
    webviewZeroHits: true,
    cliEighteen: true,
    compactImmediate: true,
    lowerWindowWorse: true,
    calibratedSurface: false,
    cue: "aneroided",
    issue: FEATURED_ISSUE,
    window: SAMPLE_WRONG_WINDOW,
    ring: SAMPLE_FIFTY_SUPPRESS,
    hover: SAMPLE_HOVER_MISLABEL,
    settings: SAMPLE_SETTINGS_SNIPPET,
    lowerWindow: SAMPLE_LOWER_WINDOW_WORSE,
  };
}

export function seedAneroid() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    hoverMislabel: true,
    fiftySuppress: true,
    cue: "aneroided",
  };
}

export function seedWrongWindowRing() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    aneroided: true,
    wrongWindowRing: true,
    modelWindow: true,
    fiftySuppress: true,
    event: "wrong-window-ring",
    cue: "aneroided",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    calibrated: true,
    cue: "calibrated",
  };
}

export function seedModelWindow() {
  return {
    seed: "model-window",
    preferSeed: true,
    modelWindow: true,
    cue: "aneroided",
  };
}

export function seedHoverMislabel() {
  return {
    seed: "hover-mislabel",
    preferSeed: true,
    hoverMislabel: true,
    cue: "aneroided",
  };
}

export function seedFiftySuppress() {
  return {
    seed: "fifty-suppress",
    preferSeed: true,
    fiftySuppress: true,
    cue: "aneroided",
  };
}

export function seedNoRunway() {
  return {
    seed: "no-runway",
    preferSeed: true,
    noRunway: true,
    cue: "aneroided",
  };
}

export function seedSettingsAbsent() {
  return {
    seed: "settings-absent",
    preferSeed: true,
    settingsAbsent: true,
    cue: "aneroided",
  };
}

export function seedWebviewZeroHits() {
  return {
    seed: "webview-zero-hits",
    preferSeed: true,
    webviewZeroHits: true,
    cue: "aneroided",
  };
}

export function seedCliEighteen() {
  return {
    seed: "cli-eighteen",
    preferSeed: true,
    cliEighteen: true,
    cue: "aneroided",
  };
}

export function seedCompactImmediate() {
  return {
    seed: "compact-immediate",
    preferSeed: true,
    compactImmediate: true,
    cue: "aneroided",
  };
}

export function seedLowerWindowWorse() {
  return {
    seed: "lower-window-worse",
    preferSeed: true,
    lowerWindowWorse: true,
    cue: "aneroided",
  };
}

export function seedCorrectWindow() {
  return {
    seed: "correct-window",
    preferSeed: true,
    calibrated: true,
    cue: "calibrated",
  };
}

export function seedRingAhead() {
  return {
    seed: "ring-ahead",
    preferSeed: true,
    calibrated: true,
    cue: "calibrated",
  };
}

export function seedRunway() {
  return {
    seed: "runway",
    preferSeed: true,
    calibrated: true,
    cue: "calibrated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      calibrated: false,
      aneroided: false,
      wrongWindowRing: false,
      modelWindow: false,
      hoverMislabel: false,
      fiftySuppress: false,
      noRunway: false,
      settingsAbsent: false,
      webviewZeroHits: false,
      cliEighteen: false,
      compactImmediate: false,
      lowerWindowWorse: false,
      calibratedSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    calibrated: raw.calibrated === true,
    aneroided:
      raw.aneroided === true ||
      raw.event === "aneroided" ||
      raw.event === "aneroid",
    wrongWindowRing:
      raw.wrongWindowRing === true || raw.event === "wrong-window-ring",
    modelWindow: raw.modelWindow === true || raw.event === "model-window",
    hoverMislabel: raw.hoverMislabel === true || raw.event === "hover-mislabel",
    fiftySuppress: raw.fiftySuppress === true || raw.event === "fifty-suppress",
    noRunway: raw.noRunway === true || raw.event === "no-runway",
    settingsAbsent: raw.settingsAbsent === true || raw.event === "settings-absent",
    webviewZeroHits: raw.webviewZeroHits === true || raw.event === "webview-zero-hits",
    cliEighteen: raw.cliEighteen === true || raw.event === "cli-eighteen",
    compactImmediate: raw.compactImmediate === true || raw.event === "compact-immediate",
    lowerWindowWorse: raw.lowerWindowWorse === true || raw.event === "lower-window-worse",
    calibratedSurface: raw.calibratedSurface === true || raw.event === "correct-window",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    window: raw.window,
    ring: raw.ring,
    hover: raw.hover,
    settings: raw.settings,
    lowerWindow: raw.lowerWindow,
    panel: raw.panel,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.calibrated != null ||
        ticket.aneroided != null ||
        ticket.wrongWindowRing != null ||
        ticket.modelWindow != null ||
        ticket.hoverMislabel != null ||
        ticket.fiftySuppress != null ||
        ticket.noRunway != null ||
        ticket.settingsAbsent != null ||
        ticket.webviewZeroHits != null ||
        ticket.cliEighteen != null ||
        ticket.compactImmediate != null ||
        ticket.lowerWindowWorse != null ||
        ticket.calibratedSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.window ||
        ticket.ring ||
        ticket.hover ||
        ticket.settings ||
        ticket.lowerWindow),
  );
}

function isCalibrated(row) {
  if (row.aneroided && row.cue !== "calibrated") return false;
  if (
    row.cue === "aneroided" ||
    row.cue === "aneroid" ||
    row.cue === "wrong-window-ring"
  ) {
    return false;
  }
  if (
    row.wrongWindowRing &&
    row.modelWindow &&
    row.cue !== "calibrated" &&
    row.calibrated !== true
  ) {
    return false;
  }
  if (
    row.wrongWindowRing &&
    row.fiftySuppress &&
    row.cue !== "calibrated" &&
    row.calibrated !== true
  ) {
    return false;
  }
  if (row.calibrated === true && row.aneroided !== true && row.cue !== "aneroided") {
    return true;
  }
  if (
    row.cue === "calibrated" &&
    row.aneroided !== true &&
    row.wrongWindowRing !== true &&
    row.modelWindow !== true &&
    row.fiftySuppress !== true
  ) {
    return true;
  }
  return false;
}

function isWrongWindowPath(row) {
  return (
    row.event === "wrong-window-ring" &&
    !isCalibrated(row) &&
    (row.wrongWindowRing === true ||
      row.modelWindow === true ||
      row.fiftySuppress === true)
  );
}

function isAneroided(row) {
  if (isCalibrated(row)) return false;
  if (isWrongWindowPath(row) && row.cue !== "aneroided") return false;
  if (row.cue === "aneroided" || row.cue === "aneroid") return true;
  if (row.aneroided === true) return true;
  if (
    row.wrongWindowRing === true &&
    row.modelWindow === true &&
    row.fiftySuppress === true
  ) {
    return true;
  }
  if (row.wrongWindowRing === true && row.modelWindow === true) {
    return true;
  }
  if (
    row.modelWindow === true ||
    row.hoverMislabel === true ||
    row.fiftySuppress === true ||
    row.noRunway === true ||
    (row.wrongWindowRing === true && row.fiftySuppress === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one aneroid pass against the sealed gauge.
 * calibrated: ring scored against autoCompactWindow; warning with runway.
 * aneroided / aneroid: wrong model window + hard 50% suppression.
 * wrong-window-ring: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isWrongWindowPath(row) ||
    (row.wrongWindowRing && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "wrong-window-ring";
  } else if (isAneroided(row)) {
    verdict = "aneroid";
  } else if (isCalibrated(row)) {
    verdict = "calibrated";
  } else if (
    row.wrongWindowRing ||
    row.modelWindow ||
    row.fiftySuppress ||
    (row.hoverMislabel && !row.calibrated)
  ) {
    verdict = "aneroid";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const window = inspectWindow(row);
  const ring = inspectRing(row);
  const hover = inspectHover(row);
  const settings = inspectSettings(row);
  const threshold = inspectThreshold(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    calibrated: verdict === "calibrated" || verdict === "hold",
    aneroided:
      verdict === "aneroided" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    wrongWindowRing:
      row.wrongWindowRing === true ||
      verdict === "wrong-window-ring" ||
      verdict === PATH_WORD,
    modelWindow: row.modelWindow,
    hoverMislabel: row.hoverMislabel,
    fiftySuppress: row.fiftySuppress,
    noRunway: row.noRunway,
    settingsAbsent: row.settingsAbsent,
    webviewZeroHits: row.webviewZeroHits,
    cliEighteen: row.cliEighteen,
    compactImmediate: row.compactImmediate,
    lowerWindowWorse: row.lowerWindowWorse,
    calibratedSurface: row.calibratedSurface,
    cue: hold
      ? "calibrated"
      : row.wrongWindowRing || verdict === "wrong-window-ring"
        ? "wrong-window-ring"
        : "aneroided",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit calibrated" : "score aneroid",
    windowInspect: window,
    ringInspect: ring,
    hoverInspect: hover,
    settingsInspect: settings,
    thresholdInspect: threshold,
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
      : ANEROID_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "aneroid" || row.verdict === "aneroided",
  );
  const path = scored.filter((row) => row.verdict === "wrong-window-ring");
  const calibrated = scored.filter((row) => row.verdict === "calibrated");
  const headline =
    scored.find((row) => row.event === "aneroided") ||
    scored.find((row) => row.event === "wrong-window-ring") ||
    scored.find((row) => row.event === "model-window") ||
    dead[dead.length - 1];
  let verdict = "calibrated";
  if (dead.length) verdict = "aneroid";
  else if (path.length && !calibrated.length) verdict = "wrong-window-ring";
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
    aneroidedCount: dead.length,
    pathCount: path.length,
    calibratedCount: calibrated.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit calibrated" : "score aneroid",
    note: headline
      ? "ring scored against the model window, not autoCompactWindow; suppressed while U >= 50; hover says 50% remaining when none remains. Cousins #90756 and #91385 are cite-only."
      : "published aneroid walk scored against calibrated vs aneroided",
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
    seeded !== "calibrated" &&
    seeded !== "aneroided" &&
    seeded !== "wrong-window-ring" &&
    seeded !== "aneroid" &&
    ticket.calibrated == null &&
    ticket.aneroided == null &&
    ticket.wrongWindowRing == null &&
    ticket.modelWindow == null &&
    ticket.fiftySuppress == null &&
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
    calibrated: scored.calibrated ?? false,
    aneroided: scored.aneroided ?? false,
    wrongWindowRing: scored.wrongWindowRing ?? false,
    modelWindow: scored.modelWindow ?? false,
    hoverMislabel: scored.hoverMislabel ?? false,
    fiftySuppress: scored.fiftySuppress ?? false,
    noRunway: scored.noRunway ?? false,
    settingsAbsent: scored.settingsAbsent ?? false,
    webviewZeroHits: scored.webviewZeroHits ?? false,
    cliEighteen: scored.cliEighteen ?? false,
    compactImmediate: scored.compactImmediate ?? false,
    lowerWindowWorse: scored.lowerWindowWorse ?? false,
    calibratedSurface: scored.calibratedSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.modelWindow || result.aneroided ? "window=model" : "window=configured",
    result.fiftySuppress || result.aneroided ? "ring=suppressed" : "ring=ahead",
    result.hoverMislabel || result.aneroided ? "hover=mislabel" : "hover=honest",
    result.wrongWindowRing || result.verdict === "wrong-window-ring"
      ? "path=wrong-window-ring"
      : "path=calibrated",
    result.cue === "calibrated"
      ? "cue=calibrated"
      : result.cue === "wrong-window-ring"
        ? "cue=wrong-window-ring"
        : "cue=aneroided",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    calibrated: result.calibrated,
    aneroided: result.aneroided,
    wrongWindowRing: result.wrongWindowRing,
    modelWindow: result.modelWindow,
    hoverMislabel: result.hoverMislabel,
    fiftySuppress: result.fiftySuppress,
    noRunway: result.noRunway,
    settingsAbsent: result.settingsAbsent,
    webviewZeroHits: result.webviewZeroHits,
    cliEighteen: result.cliEighteen,
    compactImmediate: result.compactImmediate,
    lowerWindowWorse: result.lowerWindowWorse,
    calibratedSurface: result.calibratedSurface,
    window: input && input.window,
    ring: input && input.ring,
    hover: input && input.hover,
    settings: input && input.settings,
    lowerWindow: input && input.lowerWindow,
    panel: input && input.panel,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    window: inspectWindow({
      calibrated: result.calibrated,
      aneroided: result.aneroided,
      modelWindow: result.modelWindow,
      wrongWindowRing: result.wrongWindowRing,
      window: input && input.window,
    }),
    ring: inspectRing({
      calibrated: result.calibrated,
      aneroided: result.aneroided,
      fiftySuppress: result.fiftySuppress,
      ring: input && input.ring,
    }),
    hover: inspectHover({
      calibrated: result.calibrated,
      aneroided: result.aneroided,
      hoverMislabel: result.hoverMislabel,
      hover: input && input.hover,
    }),
    settings: inspectSettings({
      calibrated: result.calibrated,
      aneroided: result.aneroided,
      settingsAbsent: result.settingsAbsent,
      webviewZeroHits: result.webviewZeroHits,
      settings: input && input.settings,
    }),
    threshold: inspectThreshold({
      calibrated: result.calibrated,
      aneroided: result.aneroided,
      lowerWindowWorse: result.lowerWindowWorse,
      noRunway: result.noRunway,
      compactImmediate: result.compactImmediate,
      lowerWindow: input && input.lowerWindow,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      aneroided:
        result.aneroided === true ||
        result.verdict === "aneroided" ||
        result.verdict === "aneroid",
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
        "NON-BINDING: the webview never receives the CLI-resolved autoCompactWindow, so percentages and the hard 50% suppress gate run against the model window. The issue grepped 0 hits in webview/index.js and 18 in bin/claude.exe — offered as the issue's own evidence, not a source-root-cause claim beyond that grep. Invite verify against #93901 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
