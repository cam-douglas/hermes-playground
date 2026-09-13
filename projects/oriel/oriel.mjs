#!/usr/bin/env node
/**
 * Oriel — Gothic / Tudor oriel bay-window architectural booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On Claude Code 2.1.268 in the macOS Desktop app, when using
 * expand/pop-out for a plan, OR when maximised within the app, plan
 * text does NOT expand/reflow to fill the window width. A large empty
 * margin remains on the right regardless of window size.
 *
 * Expected: plan text should reflow and use available window width.
 *
 *   node oriel.mjs data/oriel.json
 *   echo '{"seed":"oriel"}' | node oriel.mjs
 *
 * Idle word is reflowed (HOLD: plan text uses available window width).
 * Seeded word is oriel (#93809 — pop-out/maximised plan window does
 * not reflow text to the available width).
 * Path word is plan-no-reflow.
 * Product score word is oriel (Score oriel or admit reflowed.).
 *
 * Encoded from anthropics/claude-code#93809 issue text only.
 * Hypothesis (NON-BINDING): a fixed max-width / narrow centered
 * column CSS likely survives into pop-out/maximised surfaces. Do NOT
 * claim a root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude. No secrets.
 *
 * NOT Anarthria/#93782 (ENT voice-clinic dictation paste drop).
 * NOT Trismus/#93823 (UNUserNotification XPC lockjaw).
 * NOT Foundling/#93889 (subagent Bash orphaning).
 * NOT Crasis/#93960 (store-slug collide).
 * NOT Tessera/#93929 (version-path TCC).
 * NOT Mojibake/#93848 (FFFD spall).
 * NOT Scissel/#93915 (argv trunc).
 * NOT Feoffee/#93863 (preview EPERM).
 * NOT Apograph/#93859 (reopen fork).
 * NOT Airlock/#93862 (socat race).
 * NOT Scotoma/#93744 (command-args blind).
 * NOT Stet/#93778 (dictation buffer restore).
 * NOT Rubric (list renumber).
 * NOT Galley / Quoin / Casement booths.
 * Oriel is specifically a macOS Desktop pop-out/maximised plan window
 * whose manuscript stays in a fixed column while the bay opens wide.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "hold",
  "spanned",
  "sashed",
  "bayed",
  "projected",
  "fenestrated",
  "width-fit",
  "fixed-column",
  "empty-margin",
  "pop-out",
  "maximised",
  "macos-desktop",
  "plan-window",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "reflowed";
export const PATH_WORD = "plan-no-reflow";
export const SEEDED_WORD = "oriel";
export const PRODUCT_WORD = "oriel";
export const HOLD = Object.freeze(["reflowed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "reflowed",
  "spanned",
  "sashed",
  "bayed",
  "projected",
  "fenestrated",
  "width-fit",
]);
export const RECOVER = Object.freeze(["reflowed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "phonated",
  "received",
  "larynx-open",
  "clipboard-heard",
  "wispr-ctrlv",
  "vscode-wsl",
  "silent-drop",
  "as-penned",
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
  "rubric",
  "quoin",
  "casement",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "oriel"),
);

export const FEATURED_ISSUE = 93809;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93809";
export const TITLE =
  "[BUG] Pop-out/maximised plan window: text doesn't reflow to window width (related to #62543, closed not-planned)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:ui",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "macos-desktop-plan-pop-out";
export const HOST = "Claude Desktop macOS app";
export const CHECKED_ON = "Claude Code 2.1.268 on macOS Desktop app";
export const BUILD = "2.1.268";
export const PHRASE = "Score oriel or admit reflowed.";
export const DISTRIBUTION =
  "On Claude Code 2.1.268 in the macOS Desktop app, when using expand/pop-out for a plan, OR when maximised within the app, plan text does NOT expand/reflow to fill the window width. A large empty margin remains on the right regardless of window size. Expected: plan text should reflow and use available window width. Related cite-only: #62543 CLOSED as duplicate/not-planned (Plan side panel: content stops expanding at a fixed width — large wasted empty margins on wider panel). Related cite-only: #57749 CLOSED feature (Plan mode panel: use available window width on Desktop — currently narrow centered column) — Windows-labeled but same narrow-column family. Reporter re-raises specifically for the pop-out/maximised-window case as deterministic wasted space.";

export const RULED_OUT = Object.freeze([
  "Anarthria/#93782 dictation-paste-drop — VS Code WSL paste swallow, not a plan-window reflow",
  "Trismus/#93823 UNUserNotification XPC lockjaw — macOS Desktop freeze, not a fixed plan column",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a plan manuscript width",
  "Stet/#93778 dictation buffer restores over composer edits — composer buffer, not pop-out width",
  "Rubric list-renumber — rubricator numbering, not a bay-window reflow",
  "Galley / Quoin / Casement mentions — different print-shop and sash-hardware booths; Oriel is the projecting bay",
]);
export const EXPECTED = Object.freeze([
  "Plan text should reflow and use available window width",
  "Pop-out / expand for a plan should let the manuscript span the bay",
  "Maximised-within-the-app plan window should not keep a large empty right margin",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "pop-out",
    label: "pop-out",
    count: "expand",
    note: "expand/pop-out for a plan: text does not reflow to window width",
  },
  {
    id: "maximised",
    label: "maximised",
    count: "in-app",
    note: "maximised within the app: plan text stays in a fixed column",
  },
  {
    id: "empty-margin",
    label: "empty margin",
    count: "right",
    note: "large empty margin remains on the right regardless of window size",
  },
  {
    id: "fixed-column",
    label: "fixed column",
    count: "narrow",
    note: "plan manuscript stays in a fixed / narrow column while the bay opens wide",
  },
  {
    id: "macos-desktop",
    label: "macOS Desktop",
    count: "2.1.268",
    note: "Claude Code 2.1.268 on macOS Desktop app",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "reflowed-sash",
    survey:
      "plan text uses available window width; the sash opens and the manuscript spans",
    kind: "reflowed",
    note: "idle: bay sashed — the hold/good path",
  },
  {
    id: "pop-out",
    survey:
      "expand/pop-out for a plan: the bay projects but the manuscript stays narrow",
    kind: "oriel",
    note: "seeded: pop-out surface where reflow fails",
  },
  {
    id: "maximised",
    survey:
      "maximised within the app: window width grows; plan text does not",
    kind: "oriel",
    note: "seeded: maximised surface with empty right margin",
  },
  {
    id: "plan-no-reflow",
    survey:
      "plan text does not expand/reflow to fill the window width; empty right margin remains",
    kind: "oriel",
    note: "path: plan-no-reflow names the fixed column vs a reflowed manuscript",
  },
  {
    id: "oriel",
    survey:
      "the oriel bay opens wide but the plan manuscript stays in a fixed column",
    kind: "oriel",
    note: "seeded: oriel — wasted empty right margin on pop-out/maximised plan window",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "plan-no-reflow",
  "oriel",
  "pop-out",
  "maximised",
  "empty-margin",
  "fixed-column",
]);

export const COUSINS = Object.freeze([
  {
    issue: 62543,
    repo: "anthropics/claude-code",
    title:
      "Plan side panel: content stops expanding at a fixed width — large wasted empty margins on wider panel",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — closed as duplicate/not-planned; reporter re-raises the pop-out/maximised case; do not rebuild as a separate booth",
  },
  {
    issue: 57749,
    repo: "anthropics/claude-code",
    title:
      "Plan mode panel: use available window width on Desktop (currently narrow centered column)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — closed feature; Windows-labeled but same narrow-column family; do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "anarthria",
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
  "rubric",
  "galley",
  "quoin",
  "casement",
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

export const SAMPLE_MANUSCRIPT_IDLE = "spanned";
export const SAMPLE_MANUSCRIPT_SEEDED = "fixed-column";
export const SAMPLE_MARGIN_IDLE = "used";
export const SAMPLE_MARGIN_SEEDED = "empty";

export const SAMPLE_REFLOWED_PROOF = Object.freeze({
  reflowed: true,
  oriel: false,
  planNoReflow: false,
  popOut: false,
  maximised: false,
  emptyMargin: false,
  fixedColumn: false,
  macosDesktop: false,
  version: BUILD,
});

export const SAMPLE_ORIEL_PROOF = Object.freeze({
  reflowed: false,
  oriel: true,
  planNoReflow: true,
  popOut: true,
  maximised: true,
  emptyMargin: true,
  fixedColumn: true,
  macosDesktop: true,
  version: BUILD,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds reflowed: plan text uses available window width; sash open; manuscript spans" },
  { t: "pop-out", line: "expand/pop-out for a plan: bay projects; manuscript stays in a fixed column" },
  { t: "maximised", line: "maximised within the app: window width grows; empty right margin remains" },
  { t: "path", line: "plan-no-reflow — plan text does not expand/reflow to fill the window width" },
  { t: "score", line: "when the bay opens wide and the manuscript stays narrow the booth is oriel — Score oriel or admit reflowed." },
]);

/**
 * Scope map: spanned manuscript vs fixed column in a projecting bay.
 * Idle/reflowed: sash open; manuscript spans; margin used.
 * Seeded/oriel: bay projected; manuscript fixed; empty right margin.
 */
export function mapScope(input = {}) {
  const oriel =
    input.oriel === true ||
    input.planNoReflow === true ||
    input.emptyMargin === true ||
    input.fixedColumn === true ||
    input.popOut === true ||
    input.maximised === true;
  const reflowed = input.reflowed === true && !oriel;
  return {
    stamp: oriel ? "plan-no-reflow" : "reflowed-sash",
    bayLane: oriel ? "projected" : "sashed",
    manuscriptLane: oriel ? "fixed-column" : "spanned",
    marginLane: oriel ? "empty" : "used",
    ribbon: oriel ? "oriel" : "reflowed",
    reflowed,
  };
}

export function inspectBay(input = {}) {
  const hit =
    input.planNoReflow === true ||
    input.oriel === true ||
    input.popOut === true ||
    input.maximised === true;
  if (input.reflowed === true && !hit) {
    return {
      stamp: "bay-sashed",
      projected: false,
      listed: true,
    };
  }
  if (hit) {
    return {
      stamp: "bay-projected",
      projected: true,
      listed: false,
      host: HOST,
      surface: SURFACE,
    };
  }
  return {
    stamp: "bay-idle",
    listed: true,
  };
}

export function inspectManuscript(input = {}) {
  const hit =
    input.oriel === true ||
    input.planNoReflow === true ||
    input.fixedColumn === true;
  if (input.reflowed === true && input.fixedColumn !== true) {
    return {
      stamp: "manuscript-spanned",
      fixed: false,
      text: SAMPLE_MANUSCRIPT_IDLE,
    };
  }
  return {
    stamp: hit ? "manuscript-fixed" : "manuscript-idle",
    fixed: hit,
    text: hit ? SAMPLE_MANUSCRIPT_SEEDED : "",
  };
}

export function inspectMargin(input = {}) {
  const empty =
    input.emptyMargin === true ||
    input.oriel === true ||
    input.planNoReflow === true;
  if (input.reflowed === true && input.emptyMargin !== true) {
    return {
      stamp: "margin-used",
      empty: false,
      text: SAMPLE_MARGIN_IDLE,
    };
  }
  return {
    stamp: empty ? "margin-empty" : "margin-idle",
    empty,
    text: empty ? SAMPLE_MARGIN_SEEDED : "",
    note: empty
      ? "large empty margin remains on the right regardless of window size"
      : "",
  };
}

export function inspectWindow(input = {}) {
  const popOut = input.popOut === true || input.oriel === true;
  const maximised = input.maximised === true || input.oriel === true;
  return {
    stamp: popOut || maximised ? "window-wide" : "window-idle",
    popOut,
    maximised,
    host: popOut || maximised ? HOST : "",
  };
}

export function inspectPlatform(input = {}) {
  const macos =
    input.macosDesktop === true ||
    input.oriel === true;
  return {
    stamp: macos ? "macos-desktop" : "platform-idle",
    macos,
    host: macos ? HOST : "",
    build: macos ? BUILD : "",
    checkedOn: macos ? CHECKED_ON : "",
  };
}

export function inspectReflow(input = {}) {
  const stuck =
    input.planNoReflow === true ||
    input.oriel === true ||
    input.fixedColumn === true;
  if (input.reflowed === true && input.planNoReflow !== true) {
    return {
      stamp: "reflow-held",
      stuck: false,
    };
  }
  return {
    stamp: stuck ? "plan-no-reflow" : "reflow-idle",
    stuck,
    note: stuck
      ? "plan text does NOT expand/reflow to fill the window width"
      : "",
  };
}

export function readBooth(input = {}) {
  const oriel =
    input.oriel === true ||
    input.planNoReflow === true ||
    input.emptyMargin === true ||
    input.fixedColumn === true ||
    input.popOut === true ||
    input.maximised === true;
  const reflowed = input.reflowed === true && !oriel;
  return {
    mark: oriel ? "oriel" : reflowed || !oriel ? "reflowed" : "oriel",
    reflowed,
    oriel,
    planNoReflow: input.planNoReflow === true || oriel,
    popOut: input.popOut === true,
    maximised: input.maximised === true,
    emptyMargin: input.emptyMargin === true,
    fixedColumn: input.fixedColumn === true,
    macosDesktop: input.macosDesktop === true,
    scope: mapScope(input),
    bay: inspectBay(input),
    manuscript: inspectManuscript(input),
    margin: inspectMargin(input),
    window: inspectWindow(input),
    platform: inspectPlatform(input),
    reflow: inspectReflow(input),
    log: input.log || [],
  };
}

export const ORIEL_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-reflowed",
    reflowed: true,
    oriel: false,
    cue: "reflowed",
    note: "idle HOLD: plan text uses available window width; sash open; manuscript spans — the hold/good path",
  },
  {
    t: "pop-out",
    event: "pop-out",
    oriel: true,
    popOut: true,
    cue: "oriel",
    note: "expand/pop-out for a plan: bay projects; manuscript stays narrow",
  },
  {
    t: "maximised",
    event: "maximised",
    oriel: true,
    maximised: true,
    cue: "oriel",
    note: "maximised within the app: window width grows; empty right margin remains",
  },
  {
    t: "path",
    event: "plan-no-reflow",
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
    cue: "oriel",
    note: "plan-no-reflow — plan text does not expand/reflow to fill the window width",
  },
  {
    t: "score",
    event: "oriel",
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
    popOut: true,
    cue: "oriel",
    note: "oriel — when the bay opens wide and the manuscript stays narrow the booth is oriel",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-reflowed",
    reflowed: true,
    oriel: false,
    cue: "reflowed",
    note: "positive control: plan text uses available width; manuscript spans",
  },
  {
    t: "announce",
    event: "cue-reflowed",
    reflowed: true,
    cue: "reflowed",
    note: "positive control: the bay stays reflowed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    reflowed: true,
    oriel: false,
    planNoReflow: false,
    cue: "reflowed",
  };
}

export function seedReflowed() {
  return { ...emptyTicket() };
}

export function seedOriel() {
  return {
    seed: SEEDED_WORD,
    reflowed: false,
    oriel: true,
    planNoReflow: true,
    popOut: true,
    maximised: true,
    emptyMargin: true,
    fixedColumn: true,
    macosDesktop: true,
    cue: "oriel",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ORIEL_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
    cue: "oriel",
  };
}

export function seedPlanNoReflow() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    oriel: true,
    planNoReflow: true,
    emptyMargin: true,
    event: "plan-no-reflow",
    cue: "oriel",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedPopOut() {
  return {
    seed: "pop-out",
    preferSeed: true,
    popOut: true,
    cue: "oriel",
  };
}

export function seedMaximised() {
  return {
    seed: "maximised",
    preferSeed: true,
    maximised: true,
    cue: "oriel",
  };
}

export function seedEmptyMargin() {
  return {
    seed: "empty-margin",
    preferSeed: true,
    emptyMargin: true,
    cue: "oriel",
  };
}

export function seedFixedColumn() {
  return {
    seed: "fixed-column",
    preferSeed: true,
    fixedColumn: true,
    cue: "oriel",
  };
}

export function seedMacosDesktop() {
  return {
    seed: "macos-desktop",
    preferSeed: true,
    macosDesktop: true,
    cue: "oriel",
  };
}

export function seedSpanned() {
  return {
    seed: "spanned",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedSashed() {
  return {
    seed: "sashed",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedBayed() {
  return {
    seed: "bayed",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedProjected() {
  return {
    seed: "projected",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedFenestrated() {
  return {
    seed: "fenestrated",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function seedWidthFit() {
  return {
    seed: "width-fit",
    preferSeed: true,
    reflowed: true,
    cue: "reflowed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      reflowed: false,
      oriel: false,
      planNoReflow: false,
      popOut: false,
      maximised: false,
      emptyMargin: false,
      fixedColumn: false,
      macosDesktop: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    reflowed: raw.reflowed === true,
    oriel: raw.oriel === true || raw.event === "oriel",
    planNoReflow:
      raw.planNoReflow === true || raw.event === "plan-no-reflow",
    popOut: raw.popOut === true || raw.event === "pop-out",
    maximised: raw.maximised === true || raw.event === "maximised",
    emptyMargin: raw.emptyMargin === true || raw.event === "empty-margin",
    fixedColumn: raw.fixedColumn === true || raw.event === "fixed-column",
    macosDesktop:
      raw.macosDesktop === true || raw.event === "macos-desktop",
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
      (ticket.reflowed != null ||
        ticket.oriel != null ||
        ticket.planNoReflow != null ||
        ticket.popOut != null ||
        ticket.maximised != null ||
        ticket.emptyMargin != null ||
        ticket.fixedColumn != null ||
        ticket.macosDesktop != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isReflowed(row) {
  if (row.oriel && row.cue !== "reflowed") return false;
  if (row.cue === "oriel" || row.cue === "plan-no-reflow") {
    return false;
  }
  if (
    row.planNoReflow &&
    row.emptyMargin &&
    row.cue !== "reflowed" &&
    row.reflowed !== true
  ) {
    return false;
  }
  if (row.reflowed === true && row.oriel !== true && row.cue !== "oriel") {
    return true;
  }
  if (
    row.cue === "reflowed" &&
    row.oriel !== true &&
    row.planNoReflow !== true &&
    row.emptyMargin !== true &&
    row.popOut !== true &&
    row.maximised !== true &&
    row.fixedColumn !== true
  ) {
    return true;
  }
  return false;
}

function isPlanNoReflow(row) {
  return (
    row.event === "plan-no-reflow" &&
    !isReflowed(row) &&
    (row.planNoReflow === true ||
      row.emptyMargin === true ||
      row.fixedColumn === true)
  );
}

function isOrielRow(row) {
  if (isReflowed(row)) return false;
  if (isPlanNoReflow(row) && row.cue !== "oriel") return false;
  if (row.cue === "oriel") return true;
  if (row.oriel === true) return true;
  if (row.planNoReflow === true && row.emptyMargin === true) {
    return true;
  }
  if (
    row.planNoReflow === true ||
    row.emptyMargin === true ||
    row.popOut === true ||
    row.maximised === true ||
    row.fixedColumn === true ||
    row.macosDesktop === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one oriel pass against the bay-window chart.
 * reflowed: plan text uses available window width.
 * oriel: pop-out/maximised plan window keeps a fixed column.
 * plan-no-reflow: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPlanNoReflow(row) ||
    (row.planNoReflow && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "plan-no-reflow";
  } else if (isOrielRow(row)) {
    verdict = "oriel";
  } else if (isReflowed(row)) {
    verdict = "reflowed";
  } else if (
    row.planNoReflow ||
    row.emptyMargin ||
    row.popOut ||
    row.maximised ||
    row.fixedColumn
  ) {
    verdict = "oriel";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const bay = inspectBay(row);
  const manuscript = inspectManuscript(row);
  const margin = inspectMargin(row);
  const windowInspect = inspectWindow(row);
  const platform = inspectPlatform(row);
  const reflow = inspectReflow(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    reflowed: verdict === "reflowed" || verdict === "hold",
    oriel: verdict === "oriel" || verdict === SEEDED_WORD,
    planNoReflow:
      row.planNoReflow === true ||
      verdict === "plan-no-reflow" ||
      verdict === PATH_WORD,
    popOut: row.popOut,
    maximised: row.maximised,
    emptyMargin: row.emptyMargin,
    fixedColumn: row.fixedColumn,
    macosDesktop: row.macosDesktop,
    cue: hold
      ? "reflowed"
      : row.planNoReflow || verdict === "plan-no-reflow"
        ? "plan-no-reflow"
        : "oriel",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit reflowed" : "score oriel",
    bayInspect: bay,
    manuscriptInspect: manuscript,
    marginInspect: margin,
    windowInspect,
    platformInspect: platform,
    reflowInspect: reflow,
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
      : ORIEL_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "oriel");
  const path = scored.filter((row) => row.verdict === "plan-no-reflow");
  const reflowed = scored.filter((row) => row.verdict === "reflowed");
  const headline =
    scored.find((row) => row.event === "oriel") ||
    scored.find((row) => row.event === "plan-no-reflow") ||
    scored.find((row) => row.event === "pop-out") ||
    dead[dead.length - 1];
  let verdict = "reflowed";
  if (dead.length) verdict = "oriel";
  else if (path.length && !reflowed.length) verdict = "plan-no-reflow";
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
    orielCount: dead.length,
    pathCount: path.length,
    reflowedCount: reflowed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit reflowed" : "score oriel",
    note: headline
      ? "Claude Desktop macOS pop-out/maximised plan window does not reflow text to the available width; empty right margin remains. Cousins #62543 and #57749 are cite-only."
      : "published oriel walk scored against reflowed vs oriel",
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
    seeded !== "reflowed" &&
    seeded !== "oriel" &&
    seeded !== "plan-no-reflow" &&
    ticket.reflowed == null &&
    ticket.oriel == null &&
    ticket.planNoReflow == null &&
    ticket.emptyMargin == null &&
    ticket.popOut == null &&
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
    reflowed: scored.reflowed ?? false,
    oriel: scored.oriel ?? false,
    planNoReflow: scored.planNoReflow ?? false,
    popOut: scored.popOut ?? false,
    maximised: scored.maximised ?? false,
    emptyMargin: scored.emptyMargin ?? false,
    fixedColumn: scored.fixedColumn ?? false,
    macosDesktop: scored.macosDesktop ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.popOut || result.oriel ? "bay=projected" : "bay=sashed",
    result.fixedColumn || result.oriel ? "ms=fixed-column" : "ms=spanned",
    result.emptyMargin || result.oriel ? "margin=empty" : "margin=used",
    result.planNoReflow || result.verdict === "plan-no-reflow"
      ? "path=plan-no-reflow"
      : "path=reflowed",
    result.cue === "reflowed"
      ? "cue=reflowed"
      : result.cue === "plan-no-reflow"
        ? "cue=plan-no-reflow"
        : "cue=oriel",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    reflowed: result.reflowed,
    oriel: result.oriel,
    planNoReflow: result.planNoReflow,
    popOut: result.popOut,
    maximised: result.maximised,
    emptyMargin: result.emptyMargin,
    fixedColumn: result.fixedColumn,
    macosDesktop: result.macosDesktop,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    bay: inspectBay({
      reflowed: result.reflowed,
      oriel: result.oriel,
      planNoReflow: result.planNoReflow,
      popOut: result.popOut,
      maximised: result.maximised,
    }),
    manuscript: inspectManuscript({
      reflowed: result.reflowed,
      oriel: result.oriel,
      planNoReflow: result.planNoReflow,
      fixedColumn: result.fixedColumn,
    }),
    margin: inspectMargin({
      reflowed: result.reflowed,
      oriel: result.oriel,
      planNoReflow: result.planNoReflow,
      emptyMargin: result.emptyMargin,
    }),
    window: inspectWindow({
      reflowed: result.reflowed,
      oriel: result.oriel,
      popOut: result.popOut,
      maximised: result.maximised,
    }),
    platform: inspectPlatform({
      reflowed: result.reflowed,
      oriel: result.oriel,
      macosDesktop: result.macosDesktop,
    }),
    reflow: inspectReflow({
      reflowed: result.reflowed,
      oriel: result.oriel,
      planNoReflow: result.planNoReflow,
      fixedColumn: result.fixedColumn,
    }),
    scope: mapScope({
      reflowed: result.reflowed,
      oriel: result.oriel,
      planNoReflow: result.planNoReflow,
      emptyMargin: result.emptyMargin,
      fixedColumn: result.fixedColumn,
      popOut: result.popOut,
      maximised: result.maximised,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      oriel: result.oriel === true || result.verdict === "oriel",
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
        "NON-BINDING: a fixed max-width / narrow centered column CSS likely survives into pop-out/maximised surfaces. Invite verify against #93809 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
