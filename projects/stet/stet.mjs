#!/usr/bin/env node
/**
 * Stet — copy-desk / blue-pencil / galley-proof margin-mark booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code desktop (Windows) dictation treats its own prior buffer
 * as source of truth. Speak into the message box, edit by hand without
 * stopping the mic, speak again: the manual edit is wiped; the box
 * restores the last dictation buffer and appends new speech to that.
 * Paste text, Shift+Enter blank lines, start speaking: blank lines
 * are discarded and speech is glued onto the pasted text.
 *
 *   node stet.mjs data/rewound.json
 *   echo '{"seed":"rewound"}' | node stet.mjs
 *
 * Idle word is stetted (HOLD: user edit stands; box + cursor are
 * source of truth; mic appends to current contents).
 * Seeded word is rewound (#93778 dictation restored previous buffer).
 * Path word is mic-resume-wipe.
 * Product score word is stet (Score stet or admit stetted.).
 *
 * Encoded from anthropics/claude-code#93778 issue text only.
 * Hypothesis (NON-BINDING): dictation keeps an internal buffer and
 * on resume overwrites the composer from that buffer instead of
 * reading current DOM/value + selection. Verify against #93778 text
 * only. Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "stetted",
  "rewound",
  "stet",
  "mic-resume-wipe",
  "hold",
  "manual-edit-wiped",
  "blank-lines-discarded",
  "box-source-of-truth",
  "buffer-restore",
  "cursor-ignored",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "stetted";
export const PATH_WORD = "mic-resume-wipe";
export const SEEDED_WORD = "rewound";
export const PRODUCT_WORD = "stet";
export const HOLD = Object.freeze(["stetted", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "stetted",
  "box-source-of-truth",
  "cursor-honored",
  "edit-stands",
]);
export const RECOVER = Object.freeze(["stetted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "sighted",
  "blindsided",
  "blindside",
  "compare-ref-unreachable",
  "scoped",
  "interdicted",
  "interdict",
  "chrome-prohibit-bleed",
  "duplex",
  "simplexed",
  "simplex",
  "mobile-uplink-silent",
  "keyed",
  "deadkeyed",
  "deadkey",
  "esc-csi-dead",
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
  FORBIDDEN_IDLE.filter((name) => name !== "rewound" && name !== "stet"),
);

export const FEATURED_ISSUE = 93778;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93778";
export const TITLE =
  "Dictation: speaking after a manual edit discards the edit and resumes from the old text";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:a11y",
  "area:desktop",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "Windows 11 Pro 26200";
export const GOOD_VERSION =
  "dictation treats the text box as source of truth and appends at the cursor to current contents including whitespace";
export const SURFACE = "Claude Code desktop app (Windows 11 Pro 26200)";
export const HOST = "Desktop app";
export const INSTALL_PATH = "Desktop / Windows message-box dictation";
export const COMMAND = "dictate → edit by hand (mic still on) → speak again";
export const PHRASE = "Score stet or admit stetted.";
export const DISTRIBUTION =
  "Claude Code desktop app (Windows 11 Pro 26200), dictation / voice input in the message box. Problem 1: dictate a sentence, click in and correct it by hand without stopping the microphone, then speak again — the manual edit is wiped; the box is restored to the text dictation last produced, and the new speech is appended to that. Workaround: switch the microphone off before touching the keyboard. Problem 2: paste text, press Shift+Enter a few times for blank lines, start speaking — the blank lines are discarded and speech is glued onto the pasted text; there is no way to dictate a new paragraph after pasted text. Same root cause: dictation treats its own prior buffer as source of truth instead of the live text box and cursor, including whitespace the user added. Requested fix: treat the text box as the source of truth; when dictation resumes, append to the box's current contents at the cursor. Problem 3: words are dropped and substituted often enough that a sentence frequently has to be corrected before sending, which then runs straight into Problem 1. Microphone: Jabra Link 390 USB headset. Heavy daily dictation user.";
export const RULED_OUT = Object.freeze([
  "cannot append a second dictation (#91202) — here the second speech does land, but it lands on a restored prior buffer",
  "mic button disappears once text is present (#93165) — the mic stays available; the wipe is on resume",
  "dictation audio with no transcript (#93636) — speech is transcribed; the wrong buffer is restored",
  "dictation-tool paste WSL regression (#93782) — this is desktop Windows message-box dictation, not a WSL paste path",
]);
export const EXPECTED = Object.freeze([
  "the new speech is appended to the text as it now stands after a manual edit",
  "the new speech begins where the cursor is, after any blank lines the user added",
  "dictation treats the text box as the source of truth and never restores a previous dictation buffer over the user's own edits or whitespace",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "margin", label: "margin rule", count: "desk-set", note: "copy-desk galley — not turf, vellum, radio, or platen" },
  { id: "stet-mark", label: "stet. underline", count: "stands", note: "user edit stands; box + cursor are source of truth" },
  { id: "pencil", label: "blue pencil", count: "stroke", note: "manual correction in the message box while the mic is live" },
  { id: "slip", label: "proof slip", count: "rewound", note: "dictation restored the prior buffer over the live galley" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "stetted-gate",
    survey: "watch the live text box and cursor stay source of truth on mic resume",
    kind: "stetted",
    note: "idle: the proofreader's stet. stands — the hold/good path",
  },
  {
    id: "manual-edit-wiped",
    survey: "dictate, click in and edit by hand without stopping the mic, speak again",
    kind: "rewound",
    note: "seeded: manual edit is wiped; box restores the last dictation buffer",
  },
  {
    id: "blank-lines-discarded",
    survey: "paste text, Shift+Enter blank lines, start speaking",
    kind: "rewound",
    note: "seeded: blank lines discarded; speech glued onto pasted text",
  },
  {
    id: "buffer-restore",
    survey: "compare the restored box to the last dictation buffer, not the live galley",
    kind: "rewound",
    note: "seeded: dictation treats its own prior buffer as source of truth",
  },
  {
    id: "cursor-ignored",
    survey: "resume speech where the cursor actually sits, including whitespace",
    kind: "rewound",
    note: "seeded: new speech is appended to the restored buffer, not at the cursor",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mic-resume-wipe",
  "rewound",
  "manual-edit-wiped",
  "blank-lines-discarded",
  "buffer-restore",
  "cursor-ignored",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91202,
    title: "Cannot append a second dictation",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91202 cannot append second dictation. Distinct: here the second speech does land, but it lands on a restored prior buffer over the live box. Do not rebuild",
  },
  {
    issue: 93165,
    title: "Mic button disappears once text is present",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93165 mic button disappears once text. Distinct: the mic stays available; the wipe is on resume. Do not rebuild",
  },
  {
    issue: 93636,
    title: "Dictation audio with no transcript",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93636 dictation audio no transcript. Distinct: speech is transcribed; the wrong buffer is restored. Do not rebuild",
  },
  {
    issue: 93782,
    title: "Dictation-tool paste WSL regression",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93782 dictation-tool paste WSL regression. Distinct: this is desktop Windows message-box dictation, not a WSL paste path. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93800, title: "backup #93800", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93807, title: "backup #93807", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93808, title: "backup #93808", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93795, title: "backup #93795", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93834, title: "backup #93834", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93825, title: "backup #93825", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93779, title: "backup #93779", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const SAMPLE_STETTED_DESK = Object.freeze({
  boxSourceOfTruth: true,
  cursorHonored: true,
  whitespaceKept: true,
  bufferRestored: false,
  version: GOOD_VERSION,
});

export const SAMPLE_REWOUND_DESK = Object.freeze({
  boxSourceOfTruth: false,
  cursorHonored: false,
  whitespaceKept: false,
  bufferRestored: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_MANUAL_EDIT = Object.freeze({
  dictatedThenEdited: true,
  micLeftOn: true,
  editWiped: true,
  restoredToLastDictation: true,
});

export const SAMPLE_STETTED_EDIT = Object.freeze({
  dictatedThenEdited: true,
  micLeftOn: true,
  editWiped: false,
  restoredToLastDictation: false,
  speechAppendedToCurrent: true,
});

export const SAMPLE_BLANK_LINES = Object.freeze({
  pasted: true,
  shiftEnterBlanks: true,
  blanksDiscarded: true,
  speechGluedToPaste: true,
});

export const SAMPLE_STETTED_BLANKS = Object.freeze({
  pasted: true,
  shiftEnterBlanks: true,
  blanksDiscarded: false,
  speechGluedToPaste: false,
  speechAfterBlanks: true,
});

export const SAMPLE_BUFFER = Object.freeze({
  priorBufferKept: true,
  liveBoxIgnored: true,
  restored: true,
});

export const SAMPLE_STETTED_BUFFER = Object.freeze({
  priorBufferKept: false,
  liveBoxIgnored: false,
  restored: false,
  boxReadOnResume: true,
});

export const SAMPLE_CURSOR = Object.freeze({
  cursorIgnored: true,
  appendAtCursor: false,
  whitespaceIgnored: true,
});

export const SAMPLE_STETTED_CURSOR = Object.freeze({
  cursorIgnored: false,
  appendAtCursor: true,
  whitespaceIgnored: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds stetted: user edit stands; box + cursor are source of truth" },
  { t: "manual-edit-wiped", line: "dictate, hand-edit with mic still on, speak again — manual edit is wiped" },
  { t: "blank-lines-discarded", line: "paste + Shift+Enter blanks; speech glued onto pasted text" },
  { t: "buffer-restore", line: "box restored to the last dictation buffer; live galley ignored" },
  { t: "cursor-ignored", line: "new speech appends to the restored buffer, not at the cursor" },
  { t: "path", line: "mic-resume-wipe — dictation resumes from its own prior buffer" },
  { t: "score", line: "when resume restores the old buffer over the live box the booth is stet — Score stet or admit stetted." },
]);

export function inspectManualEditWiped(input = {}) {
  const edit =
    input.manualEdit && typeof input.manualEdit === "object"
      ? input.manualEdit
      : input.stetted === true && input.rewound !== true
        ? SAMPLE_STETTED_EDIT
        : SAMPLE_MANUAL_EDIT;
  const forced =
    input.manualEditWiped === true ||
    input.event === "manual-edit-wiped" ||
    input.event === "rewound" ||
    input.event === "stet" ||
    input.rewound === true;
  const wiped = forced ? true : edit.editWiped === true && input.stetted !== true;
  return {
    dictatedThenEdited: true,
    micLeftOn: true,
    editWiped: wiped,
    restoredToLastDictation: wiped,
    stamp: wiped ? "manual-edit-wiped" : "edit-stands",
    note: wiped
      ? "manual edit is wiped; the box restores the last dictation buffer and appends new speech to that"
      : "user edit stands; new speech appends to the text as it now stands",
  };
}

export function inspectBlankLinesDiscarded(input = {}) {
  const blanks =
    input.blankLines && typeof input.blankLines === "object"
      ? input.blankLines
      : input.stetted === true && input.rewound !== true
        ? SAMPLE_STETTED_BLANKS
        : SAMPLE_BLANK_LINES;
  const forced =
    input.blankLinesDiscarded === true ||
    input.event === "blank-lines-discarded" ||
    input.event === "rewound" ||
    input.event === "stet";
  const discarded = forced ? true : blanks.blanksDiscarded === true && input.stetted !== true;
  return {
    pasted: true,
    shiftEnterBlanks: true,
    blanksDiscarded: discarded,
    speechGluedToPaste: discarded,
    stamp: discarded ? "blank-lines-discarded" : "whitespace-kept",
    note: discarded
      ? "blank lines discarded; speech glued onto the pasted text as one block"
      : "speech begins where the cursor is, after the blank lines",
  };
}

export function inspectBufferRestore(input = {}) {
  const buffer =
    input.buffer && typeof input.buffer === "object"
      ? input.buffer
      : input.stetted === true && input.rewound !== true
        ? SAMPLE_STETTED_BUFFER
        : SAMPLE_BUFFER;
  const forced =
    input.bufferRestored === true ||
    input.event === "buffer-restore" ||
    input.event === "rewound" ||
    input.event === "stet";
  const restored = forced ? true : buffer.restored === true && input.stetted !== true;
  return {
    priorBufferKept: restored,
    liveBoxIgnored: restored,
    restored,
    stamp: restored ? "buffer-restore" : "box-read",
    note: restored
      ? "dictation restores a previous buffer over the user's own edits"
      : "on resume the live box is read; no prior buffer is written back",
  };
}

export function inspectCursorIgnored(input = {}) {
  const cursor =
    input.cursor && typeof input.cursor === "object"
      ? input.cursor
      : input.stetted === true && input.rewound !== true
        ? SAMPLE_STETTED_CURSOR
        : SAMPLE_CURSOR;
  const forced =
    input.cursorIgnored === true ||
    input.event === "cursor-ignored" ||
    input.event === "mic-resume-wipe" ||
    input.event === "rewound" ||
    input.event === "stet";
  const ignored = forced ? true : cursor.cursorIgnored === true && input.stetted !== true;
  return {
    cursorIgnored: ignored,
    appendAtCursor: !ignored,
    whitespaceIgnored: ignored,
    stamp: ignored ? "cursor-ignored" : "cursor-honored",
    note: ignored
      ? "new speech is appended to the restored buffer, not at the live cursor"
      : "new speech appends at the cursor to current contents including whitespace",
  };
}

export function inspectBoxSourceOfTruth(input = {}) {
  const desk =
    input.desk && typeof input.desk === "object"
      ? input.desk
      : input.stetted === true && input.rewound !== true
        ? SAMPLE_STETTED_DESK
        : SAMPLE_REWOUND_DESK;
  const forced =
    input.boxSourceOfTruth === true ||
    input.event === "box-source-of-truth";
  const honored =
    forced ||
    (input.stetted === true && input.rewound !== true) ||
    desk.boxSourceOfTruth === true;
  const live = honored && input.rewound !== true && input.stet !== true;
  return {
    boxSourceOfTruth: live,
    cursorHonored: live,
    whitespaceKept: live,
    bufferRestored: !live,
    stamp: live ? "box-source-of-truth" : "buffer-as-truth",
    note: live
      ? "text box + cursor are source of truth; mic appends to current contents"
      : "dictation treats its own prior buffer as source of truth",
  };
}

export function readBooth(input = {}) {
  const edit = inspectManualEditWiped(input);
  const blanks = inspectBlankLinesDiscarded(input);
  const buffer = inspectBufferRestore(input);
  const cursor = inspectCursorIgnored(input);
  const box = inspectBoxSourceOfTruth(input);
  const rewound =
    input.stetted !== true &&
    ((edit.editWiped && buffer.restored && cursor.cursorIgnored) ||
      input.rewound === true);
  const stetted =
    input.stetted === true && rewound !== true && edit.editWiped !== true;
  const path =
    (input.event === "mic-resume-wipe" || input.micResumeWipe === true) &&
    (cursor.cursorIgnored || input.rewound === true);
  return {
    edit,
    blanks,
    buffer,
    cursor,
    box,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    rewound: rewound && !stetted && !path,
    stetted: stetted || (!rewound && !path && input.rewound !== true && input.micResumeWipe !== true && edit.editWiped !== true),
    micResumeWipe: path && !stetted,
    mark:
      path && !stetted
        ? "mic-resume-wipe"
        : rewound && !stetted
          ? "rewound"
          : "stetted",
  };
}

/**
 * Published stet walk from #93778 only. Facts from the issue text.
 * A stetted booth keeps the live box + cursor as source of truth.
 * A rewound booth restores the prior dictation buffer over edits.
 * A mic-resume-wipe booth names the resume path.
 */
export const STET_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-stetted",
    stetted: true,
    rewound: false,
    cue: "stetted",
    note: "idle HOLD: user edit stands; box + cursor are source of truth — the hold/good path",
  },
  {
    t: "manual-edit-wiped",
    event: "manual-edit-wiped",
    rewound: true,
    manualEditWiped: true,
    cue: "rewound",
    note: "dictate, hand-edit with mic still on, speak again — edit wiped",
  },
  {
    t: "blank-lines-discarded",
    event: "blank-lines-discarded",
    rewound: true,
    blankLinesDiscarded: true,
    cue: "rewound",
    note: "paste + Shift+Enter blanks; speech glued onto pasted text",
  },
  {
    t: "buffer-restore",
    event: "buffer-restore",
    rewound: true,
    bufferRestored: true,
    cue: "rewound",
    note: "box restored to the last dictation buffer",
  },
  {
    t: "cursor-ignored",
    event: "cursor-ignored",
    rewound: true,
    cursorIgnored: true,
    cue: "rewound",
    note: "new speech appends to the restored buffer, not at the cursor",
  },
  {
    t: "path",
    event: "mic-resume-wipe",
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    cue: "rewound",
    note: "mic-resume-wipe — dictation resumes from its own prior buffer",
  },
  {
    t: "score",
    event: "stet",
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    bufferRestored: true,
    cursorIgnored: true,
    cue: "rewound",
    note: "stet — when resume restores the old buffer over the live box the booth never stays stetted",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-stetted",
    stetted: true,
    rewound: false,
    cue: "stetted",
    note: "positive control: live box + cursor stay source of truth",
  },
  {
    t: "announce",
    event: "cue-stetted",
    stetted: true,
    cue: "stetted",
    note: "positive control: stet. stands in the margin",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    stetted: true,
    rewound: false,
    micResumeWipe: false,
    cue: "stetted",
  };
}

export function seedStetted() {
  return { ...emptyTicket() };
}

export function seedRewound() {
  return {
    seed: SEEDED_WORD,
    stetted: false,
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    bufferRestored: true,
    cursorIgnored: true,
    cue: "rewound",
    issue: FEATURED_ISSUE,
    manualEdit: SAMPLE_MANUAL_EDIT,
    blankLines: SAMPLE_BLANK_LINES,
    buffer: SAMPLE_BUFFER,
    cursor: SAMPLE_CURSOR,
  };
}

export function seedStet() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    bufferRestored: true,
    cursorIgnored: true,
    cue: "rewound",
  };
}

export function seedMicResumeWipe() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    rewound: true,
    micResumeWipe: true,
    manualEditWiped: true,
    blankLinesDiscarded: true,
    event: "mic-resume-wipe",
    cue: "rewound",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    stetted: true,
    cue: "stetted",
  };
}

export function seedManualEditWiped() {
  return {
    seed: "manual-edit-wiped",
    preferSeed: true,
    manualEditWiped: true,
    cue: "rewound",
  };
}

export function seedBlankLinesDiscarded() {
  return {
    seed: "blank-lines-discarded",
    preferSeed: true,
    blankLinesDiscarded: true,
    cue: "rewound",
  };
}

export function seedBufferRestore() {
  return {
    seed: "buffer-restore",
    preferSeed: true,
    bufferRestored: true,
    cue: "rewound",
  };
}

export function seedCursorIgnored() {
  return {
    seed: "cursor-ignored",
    preferSeed: true,
    cursorIgnored: true,
    cue: "rewound",
  };
}

export function seedBoxSourceOfTruth() {
  return {
    seed: "box-source-of-truth",
    preferSeed: true,
    stetted: true,
    cue: "stetted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      stetted: false,
      rewound: false,
      micResumeWipe: false,
      manualEditWiped: false,
      blankLinesDiscarded: false,
      bufferRestored: false,
      cursorIgnored: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    stetted: raw.stetted === true,
    rewound:
      raw.rewound === true ||
      raw.event === "rewound" ||
      raw.event === "stet",
    micResumeWipe:
      raw.micResumeWipe === true || raw.event === "mic-resume-wipe",
    manualEditWiped: raw.manualEditWiped === true || raw.event === "manual-edit-wiped",
    blankLinesDiscarded: raw.blankLinesDiscarded === true || raw.event === "blank-lines-discarded",
    bufferRestored: raw.bufferRestored === true || raw.event === "buffer-restore",
    cursorIgnored: raw.cursorIgnored === true || raw.event === "cursor-ignored",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    manualEdit: raw.manualEdit,
    blankLines: raw.blankLines,
    buffer: raw.buffer,
    cursor: raw.cursor,
    desk: raw.desk,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.stetted != null ||
        ticket.rewound != null ||
        ticket.micResumeWipe != null ||
        ticket.manualEditWiped != null ||
        ticket.blankLinesDiscarded != null ||
        ticket.bufferRestored != null ||
        ticket.cursorIgnored != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.manualEdit ||
        ticket.blankLines ||
        ticket.buffer ||
        ticket.cursor),
  );
}

function isStetted(row) {
  if (row.rewound && row.cue !== "stetted") return false;
  if (
    row.cue === "rewound" ||
    row.cue === "stet" ||
    row.cue === "mic-resume-wipe"
  ) {
    return false;
  }
  if (
    row.micResumeWipe &&
    row.manualEditWiped &&
    row.cue !== "stetted" &&
    row.stetted !== true
  ) {
    return false;
  }
  if (
    row.micResumeWipe &&
    row.blankLinesDiscarded &&
    row.cue !== "stetted" &&
    row.stetted !== true
  ) {
    return false;
  }
  if (row.stetted === true && row.rewound !== true && row.cue !== "rewound") {
    return true;
  }
  if (
    row.cue === "stetted" &&
    row.rewound !== true &&
    row.micResumeWipe !== true &&
    row.manualEditWiped !== true &&
    row.blankLinesDiscarded !== true
  ) {
    return true;
  }
  return false;
}

function isMicResumeWipePath(row) {
  return (
    row.event === "mic-resume-wipe" &&
    !isStetted(row) &&
    (row.micResumeWipe === true ||
      row.manualEditWiped === true ||
      row.blankLinesDiscarded === true)
  );
}

function isRewound(row) {
  if (isStetted(row)) return false;
  if (isMicResumeWipePath(row) && row.cue !== "rewound") return false;
  if (row.cue === "rewound" || row.cue === "stet") return true;
  if (row.rewound === true) return true;
  if (
    row.micResumeWipe === true &&
    row.manualEditWiped === true &&
    row.blankLinesDiscarded === true
  ) {
    return true;
  }
  if (row.micResumeWipe === true && row.manualEditWiped === true) {
    return true;
  }
  if (
    row.manualEditWiped === true ||
    row.blankLinesDiscarded === true ||
    row.bufferRestored === true ||
    (row.micResumeWipe === true && row.blankLinesDiscarded === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one stet pass against the copy-desk galley.
 * stetted: user edit stands; box + cursor are source of truth.
 * rewound / stet: dictation restored the prior buffer over the live box.
 * mic-resume-wipe: resume appends to the old buffer, not the cursor.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMicResumeWipePath(row) ||
    (row.micResumeWipe && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mic-resume-wipe";
  } else if (isRewound(row)) {
    verdict = "stet";
  } else if (isStetted(row)) {
    verdict = "stetted";
  } else if (
    row.micResumeWipe ||
    row.manualEditWiped ||
    row.blankLinesDiscarded ||
    (row.bufferRestored && !row.stetted)
  ) {
    verdict = "stet";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const edit = inspectManualEditWiped(row);
  const blanks = inspectBlankLinesDiscarded(row);
  const buffer = inspectBufferRestore(row);
  const cursor = inspectCursorIgnored(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    stetted: verdict === "stetted" || verdict === "hold",
    rewound:
      verdict === "rewound" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    micResumeWipe:
      row.micResumeWipe === true ||
      verdict === "mic-resume-wipe" ||
      verdict === PATH_WORD,
    manualEditWiped: row.manualEditWiped,
    blankLinesDiscarded: row.blankLinesDiscarded,
    bufferRestored: row.bufferRestored,
    cursorIgnored: row.cursorIgnored,
    cue: hold
      ? "stetted"
      : row.micResumeWipe || verdict === "mic-resume-wipe"
        ? "mic-resume-wipe"
        : "rewound",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit stetted" : "score stet",
    editInspect: edit,
    blanksInspect: blanks,
    bufferInspect: buffer,
    cursorInspect: cursor,
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
      : STET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "stet" || row.verdict === "rewound",
  );
  const path = scored.filter((row) => row.verdict === "mic-resume-wipe");
  const stetted = scored.filter((row) => row.verdict === "stetted");
  const headline =
    scored.find((row) => row.event === "rewound") ||
    scored.find((row) => row.event === "mic-resume-wipe") ||
    scored.find((row) => row.event === "manual-edit-wiped") ||
    dead[dead.length - 1];
  let verdict = "stetted";
  if (dead.length) verdict = "stet";
  else if (path.length && !stetted.length) verdict = "mic-resume-wipe";
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
    rewoundCount: dead.length,
    pathCount: path.length,
    stettedCount: stetted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit stetted" : "score stet",
    note: headline
      ? "Dictation restores its prior buffer over manual composer edits and discarded whitespace on mic resume; cousins are second-dictation / mic-button / no-transcript / WSL-paste, not this buffer-over-live-box wipe."
      : "published stet walk scored against stetted vs rewound",
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
    seeded !== "stetted" &&
    seeded !== "rewound" &&
    seeded !== "mic-resume-wipe" &&
    seeded !== "stet" &&
    ticket.stetted == null &&
    ticket.rewound == null &&
    ticket.micResumeWipe == null &&
    ticket.manualEditWiped == null &&
    ticket.blankLinesDiscarded == null &&
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
    stetted: scored.stetted ?? false,
    rewound: scored.rewound ?? false,
    micResumeWipe: scored.micResumeWipe ?? false,
    manualEditWiped: scored.manualEditWiped ?? false,
    blankLinesDiscarded: scored.blankLinesDiscarded ?? false,
    bufferRestored: scored.bufferRestored ?? false,
    cursorIgnored: scored.cursorIgnored ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.manualEditWiped || result.rewound ? "edit=wiped" : "edit=stands",
    result.blankLinesDiscarded || result.rewound ? "blanks=discarded" : "blanks=kept",
    result.bufferRestored || result.rewound ? "buffer=restored" : "buffer=unread",
    result.cursorIgnored || result.rewound ? "cursor=ignored" : "cursor=honored",
    result.micResumeWipe || result.verdict === "mic-resume-wipe"
      ? "path=mic-resume-wipe"
      : "path=stetted",
    result.cue === "stetted"
      ? "cue=stetted"
      : result.cue === "mic-resume-wipe"
        ? "cue=mic-resume-wipe"
        : "cue=rewound",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    stetted: result.stetted,
    rewound: result.rewound,
    micResumeWipe: result.micResumeWipe,
    manualEditWiped: result.manualEditWiped,
    blankLinesDiscarded: result.blankLinesDiscarded,
    bufferRestored: result.bufferRestored,
    cursorIgnored: result.cursorIgnored,
    manualEdit: input && input.manualEdit,
    blankLines: input && input.blankLines,
    buffer: input && input.buffer,
    cursor: input && input.cursor,
    desk: input && input.desk,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    edit: inspectManualEditWiped({
      stetted: result.stetted,
      rewound: result.rewound,
      manualEditWiped: result.manualEditWiped,
      manualEdit: input && input.manualEdit,
    }),
    blanks: inspectBlankLinesDiscarded({
      stetted: result.stetted,
      rewound: result.rewound,
      blankLinesDiscarded: result.blankLinesDiscarded,
      blankLines: input && input.blankLines,
    }),
    buffer: inspectBufferRestore({
      stetted: result.stetted,
      rewound: result.rewound,
      bufferRestored: result.bufferRestored,
      buffer: input && input.buffer,
    }),
    cursor: inspectCursorIgnored({
      stetted: result.stetted,
      rewound: result.rewound,
      cursorIgnored: result.cursorIgnored,
      cursor: input && input.cursor,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      rewound:
        result.rewound === true ||
        result.verdict === "rewound" ||
        result.verdict === "stet",
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
        "NON-BINDING: dictation keeps an internal buffer and on resume overwrites the composer from that buffer instead of reading current DOM/value + selection. Invite verify against #93778 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
