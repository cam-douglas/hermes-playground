#!/usr/bin/env node
/**
 * Diptych — scriptorium / hinged wax-tablet / illuminated choir-book /
 * ink-and-gilt / oxidized-copper hinge booth.
 * A *diptych* is a hinged two-panel writing tablet / altarpiece — two
 * leaves that should show related but distinct panels, or a single
 * closed book. Here the session should leave **one** leaf (one reply).
 * Brief mode injects a reminder that the first leaf was invisible, so
 * the model opens a second leaf via SendUserMessage and the client
 * hangs both.
 * Parchment / iron-gall ink / indigo / gilt / oxidized copper.
 * NOT Vizard masque-ball. NOT Treacle copper kettle. NOT Somnus
 * moon-watch. NOT Cresset iron-basket. NOT Dictabelt wax-belt.
 * NOT Lemure lararium. NOT Cancellans binder. NOT Arras tapestry.
 * NOT Diplopia subdirectory rooms (DIFFERENT product). NOT Fetchling
 * / Eidolon / Hectograph / Stereotype / Caret doubling metaphors.
 *
 * Educational diagnostic model for a published Claude Remote Control
 * mobile brief-mode defect: every assistant reply is rendered twice.
 * The model ends the turn with ordinary assistant text; a reminder
 * is injected that in brief mode plain assistant text is hidden and
 * only SendUserMessage reaches the user; the model restates via
 * SendUserMessage; the client renders both, so the reminder's
 * premise does not hold. Not a streaming artifact: both copies are
 * persisted in the session transcript, survive reload, and remain
 * when reopened on desktop. Happens on every substantive turn,
 * every session.
 *
 * Encoded from anthropics/claude-code#94397 issue text only.
 * Hypothesis (NON-BINDING — issue text): brief-mode reminder +
 * visible plain assistant text guarantees a doubled billed
 * restatement via SendUserMessage on every substantive mobile
 * Remote Control turn. Invite verify against #94397 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node diptych.mjs data/diptych.json
 *   echo '{"seed":"diptych"}' | node diptych.mjs
 *
 * Idle word is single (HOLD: one reply per turn).
 * HOLD aliases: once, solo, folio, simplex.
 * Seeded word is diptych (#94397 path).
 * Path word is brief-echo.
 * Product score word is diptych (Score diptych or admit single.).
 *
 * NOT #88897 (client-side RC duplicate render; slash-command pills
 * + stuck spinner; single delivery). NOT #81080 (slash typed during
 * pending bg notification renders twice). NOT #83229 (Stop hook
 * reprints corrected answer). Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "single",
  "diptych",
  "brief-echo",
  "once",
  "solo",
  "folio",
  "simplex",
  "sendusermessage",
  "restatement",
  "double-render",
  "paraphrase-pair",
  "reminder-injected",
  "plain-not-hidden",
  "persisted-twice",
  "every-turn",
  "mobile-brief",
  "94397",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "single";
export const PATH_WORD = "brief-echo";
export const SEEDED_WORD = "diptych";
export const PRODUCT_WORD = "diptych";
export const HOLD = Object.freeze(["single"]);
export const HOLD_ALIASES = Object.freeze([
  "once",
  "solo",
  "folio",
  "simplex",
]);
export const RECOVER = Object.freeze(["single"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "pledged",
  "brisk",
  "cadence",
  "released",
  "verbatim",
  "quiet",
  "intact",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "masked-true",
  "retained",
  "sticky-model",
  "held",
  "chosen",
  "unmasked",
  "snap",
  "ready",
  "instant",
  "bash-fast",
  "suspend-ready",
  "cleared",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "armed",
  "bound",
  "listed",
  "scheduled",
  "muster-ok",
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
  "dragnet",
  "diplopia",
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
  "rostered",
  "lararium",
  "stilled",
  "removable",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "swapped",
  "remote-reattach",
  "precedence",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "dragnet",
  "diplopia",
  "changeling",
  "fetchling",
  "eidolon",
  "hectograph",
  "stereotype",
  "caret",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "quietus",
  "unmasked",
  "precedence",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "swapped",
  "remote-reattach",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94397;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94397";
export const TITLE =
  "[BUG] Remote Control (mobile): every assistant reply is rendered twice — the brief-mode reminder makes the model restate it via SendUserMessage";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "platform:ios",
  "area:agent-view",
]);
export const PLATFORM = "ios";
export const SURFACE = "brief-echo";
export const HOST =
  "Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile iOS local agent mode driven from the phone";
export const CHECKED_ON =
  "Published report: every assistant reply appears twice in a row on Remote Control mobile brief mode; second copy a slight paraphrase; both persisted; every substantive turn, every session";
export const BUILD =
  "Claude desktop 1.52386.6; Claude Code CLI 2.1.266; Claude mobile iOS local agent mode";
export const SELECTED_MODEL =
  "Remote Control mobile brief-mode double-render via SendUserMessage restatement — not a model defect";
export const OS =
  "iOS mobile + macOS 26.6.2 Apple Silicon host; platform:ios / platform:macos / area:agent-view";
export const PHRASE = "Score diptych or admit single.";
export const DISTRIBUTION =
  "Every assistant reply appears twice in a row; the second copy is a slight paraphrase of the first. Not a streaming artifact: both copies are persisted in the session transcript, survive reload, and remain when reopened on desktop. Happens on every substantive turn, every session, not occasionally. Why (per issue): the model ends the turn with ordinary assistant text; a reminder is injected that in brief mode plain assistant text is hidden and only SendUserMessage reaches the user; the model restates via SendUserMessage; the client renders both, so the reminder's premise does not hold. Transcript sequence every duplicated pair: (1) [assistant/text] full answer; (2) [user/text] reminder: You ended without calling SendUserMessage… brief mode… Call it now…; (3) [assistant/tool] SendUserMessage {\"message\": \"<same answer, reworded>\"}; (4) [user/result] \"Message delivered to user.\"; (5) [assistant/text] No response requested. Steps: drive session from mobile (brief mode) → send substantive message → see answer, Sent/Stopped separator, then near-identical restatement. Expected: one reply per turn. Suggested fix (cite only, do not implement): suppress plain assistant text as the reminder asserts, OR stop injecting the reminder and render plain text alone. Env: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile iOS local agent mode driven from the phone.";

export const DESKTOP_BUILD = "1.52386.6";
export const CODE_BUILD = "2.1.266";
export const HOST_OS = "macOS 26.6.2 Apple Silicon";
export const MOBILE_SURFACE = "Claude mobile iOS local agent mode";
export const TOOL_NAME = "SendUserMessage";
export const RESULT_LINE = "Message delivered to user.";
export const TAIL_LINE = "No response requested.";
export const EVERY_TURN = true;

/**
 * Synthetic example-data — reconstructs published transcript shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_SINGLE = Object.freeze({
  replies: 1,
  plainVisible: false,
  sendUserMessage: false,
  note: "one reply per turn — the closed diptych",
  synthetic: true,
});
export const SYNTHETIC_REMINDER = Object.freeze({
  injected: true,
  text: "You ended without calling SendUserMessage… brief mode… Call it now…",
  premise: "plain assistant text is hidden; only SendUserMessage reaches the user",
  synthetic: true,
});
export const SYNTHETIC_PAIR = Object.freeze({
  first: "[assistant/text] full answer",
  reminder: "[user/text] You ended without calling SendUserMessage… brief mode… Call it now…",
  restatement: "[assistant/tool] SendUserMessage {\"message\": \"<same answer, reworded>\"}",
  result: "[user/result] Message delivered to user.",
  tail: "[assistant/text] No response requested.",
  persisted: true,
  survivesReload: true,
  desktopReopen: true,
  everyTurn: true,
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "hinged-tablet",
    lost: "Hinged tablet — the session should leave one closed leaf",
    control: "One reply per turn; the diptych stays shut",
    story: "the hinge opens a second leaf the reminder said was invisible",
  },
  {
    id: "left-leaf",
    lost: "Left leaf — ordinary assistant text, the full answer",
    control: "Plain assistant text should be hidden if brief mode says so",
    story: "the first leaf is written and hung anyway",
  },
  {
    id: "reminder-rubric",
    lost: "Reminder rubric — You ended without calling SendUserMessage…",
    control: "A reminder should not force a second billed restatement",
    story: "the rubric tells the scribe the first leaf was invisible",
  },
  {
    id: "right-leaf",
    lost: "Right leaf — SendUserMessage restates the same answer, reworded",
    control: "SendUserMessage should be the only visible panel, or none extra",
    story: "the second leaf is a paraphrase-pair of the first",
  },
  {
    id: "oxidized-hinge",
    lost: "Oxidized hinge — client hangs both leaves after Sent/Stopped",
    control: "The hinge should show one panel, not both",
    story: "the copper corners hold two panels the premise said were one",
  },
  {
    id: "illuminated-choir",
    lost: "Illuminated choir — both copies persist, survive reload, reopen on desktop",
    control: "A single folio should remain after reload",
    story: "the choir-book keeps both verses on every substantive turn",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "hinged-tablet",
    survey: "ordinary single: one reply per turn; the diptych stays shut",
    kind: "single",
    note: "idle/control: one leaf, one reply",
  },
  {
    id: "left-leaf",
    survey: "model ends the turn with ordinary assistant text",
    kind: "diptych",
    note: "seeded: first leaf is the full answer",
  },
  {
    id: "reminder-rubric",
    survey: "reminder injected: brief mode hides plain text; Call SendUserMessage now",
    kind: "diptych",
    note: "seeded: rubric claims the first leaf was invisible",
  },
  {
    id: "right-leaf",
    survey: "model restates via SendUserMessage {message: same answer, reworded}",
    kind: "diptych",
    note: "seeded: second leaf is a paraphrase",
  },
  {
    id: "oxidized-hinge",
    survey: "client renders both after the Sent/Stopped separator",
    kind: "diptych",
    note: "seeded: the reminder's premise does not hold",
  },
  {
    id: "illuminated-choir",
    survey: "brief-echo — both copies persist, survive reload, every turn",
    kind: "diptych",
    note: "path: brief-echo names the double leaf",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "sendusermessage",
    label: "sendusermessage",
    count: "tool",
    note: "SendUserMessage restates the same answer, reworded",
  },
  {
    id: "restatement",
    label: "restatement",
    count: "second leaf",
    note: "Second copy is a slight paraphrase of the first",
  },
  {
    id: "double-render",
    label: "double-render",
    count: "both hung",
    note: "Client renders plain assistant text AND the tool restatement",
  },
  {
    id: "paraphrase-pair",
    label: "paraphrase-pair",
    count: "twice in a row",
    note: "Near-identical restatement after Sent/Stopped",
  },
  {
    id: "reminder-injected",
    label: "reminder-injected",
    count: "brief mode",
    note: "You ended without calling SendUserMessage… Call it now…",
  },
  {
    id: "plain-not-hidden",
    label: "plain-not-hidden",
    count: "visible",
    note: "The reminder's premise (plain text hidden) does not hold",
  },
]);

export const RULED_OUT = Object.freeze([
  "#88897 — duplicate rendering under Remote Control, but user slash-command pills + stuck spinner; verified client-side render duplication with single delivery — OPPOSITE of #94397 (model genuinely produces the answer a second time); cite only",
  "#81080 — slash command typed during pending bg notification renders twice — DIFFERENT; cite only",
  "#83229 — Stop hook reprints corrected answer — DIFFERENT; cite only",
  "Vizard/#94398 — backgrounding resets model to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell ~154s first-call stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent permanent disable — DIFFERENT",
  "Cresset/#94420 — keep-awake hold leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — ghost orphan ScheduledTasks — DIFFERENT",
  "Cancellans/#94400 — resume-fork deferred_tools_delta — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
  "Diplopia — subdirectory rooms double-vision acuity — DIFFERENT product; do not remask",
  "Fetchling/#94065 — DIFFERENT doubling metaphor",
  "Eidolon / Hectograph / Stereotype / Caret — DIFFERENT doubling metaphors",
]);

export const EXPECTED = Object.freeze([
  "One reply per turn",
  "Brief mode should not hang both the plain assistant text and the SendUserMessage restatement",
  "If the reminder asserts plain assistant text is hidden, the client should suppress it",
  "If the client renders plain text, the reminder should not be injected",
]);

export const SUGGESTED_FIX = Object.freeze([
  "suppress plain assistant text as the reminder asserts",
  "OR stop injecting the reminder and render plain text alone",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "brief-echo",
  "diptych",
  "sendusermessage",
  "restatement",
  "double-render",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88897,
    title: "Remote Control duplicate rendering — slash-command pills + stuck spinner; client-side render duplication with single delivery",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — client-side RC duplicate render with a single delivery. #94397 is the opposite: the model produces the answer a second time. Do not rebuild. Do not conflate.",
  },
  {
    issue: 81080,
    title: "slash command typed during pending bg notification renders twice",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — slash-during-pending duplicate paint. Do not rebuild. Do not conflate.",
  },
  {
    issue: 83229,
    title: "Stop hook reprints corrected answer",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Stop hook reprint, not brief-mode SendUserMessage restatement. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94396, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "diplopia",
  "fetchling",
  "eidolon",
  "hectograph",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "changeling",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "quietus",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "rasure",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "hinged-tablet";
export const SAMPLE_KIND_SEEDED = "brief-echo";
export const SAMPLE_HOLDING_IDLE = "once";
export const SAMPLE_HOLDING_SEEDED = "right-leaf";

export const SAMPLE_SINGLE_PROOF = Object.freeze({
  single: true,
  diptych: false,
  briefEcho: false,
  sendUserMessage: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DIPTYCH_PROOF = Object.freeze({
  single: false,
  diptych: true,
  briefEcho: true,
  sendUserMessage: true,
  restatement: true,
  doubleRender: true,
  paraphrasePair: true,
  reminderInjected: true,
  plainNotHidden: true,
  persistedTwice: true,
  everyTurn: true,
  mobileBrief: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  singleCase: { ...SYNTHETIC_SINGLE },
  reminder: { ...SYNTHETIC_REMINDER },
  pair: { ...SYNTHETIC_PAIR },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds single: one reply per turn; the diptych stays shut" },
  { t: "brief-echo", line: "plain assistant text then reminder then SendUserMessage restatement" },
  { t: "path", line: "brief-echo — both leaves hung; persisted twice; every turn" },
  { t: "score", line: "when the hinge opens a second leaf the booth is diptych — Score diptych or admit single." },
]);

const FORCE_FLAGS = [
  "briefEcho",
  "sendUserMessage",
  "restatement",
  "doubleRender",
  "paraphrasePair",
  "reminderInjected",
  "plainNotHidden",
  "persistedTwice",
  "everyTurn",
  "mobileBrief",
];

const ISSUE_CUE_RE =
  /94397|SendUserMessage|brief mode|Message delivered to user|No response requested|1\.52386\.6|2\.1\.266/i;

/**
 * Educational leaf evaluation. Not a Claude Code patch.
 * Encodes only the published #94397 shapes.
 * single=true is the HOLD / one-reply path.
 *
 * Single/HOLD when: one reply per turn; the diptych stays shut.
 * Diptych / brief-echo when: plain text plus SendUserMessage restatement.
 */
export function evaluateLeaves({
  single = false,
  reminder = false,
  restated = false,
  bothRendered = false,
} = {}) {
  if (single === true && !restated && !bothRendered) {
    return {
      doubled: false,
      leaves: 1,
      phrase: "admit single",
      synthetic: true,
    };
  }
  const doubled =
    restated === true || bothRendered === true || reminder === true;
  return {
    doubled,
    leaves: doubled ? 2 : 1,
    phrase: doubled ? "score diptych" : "admit single",
    synthetic: true,
  };
}

export function scoreBriefEcho(input = {}) {
  const singleHold = input.single === true && input.diptych !== true;
  const leaves = evaluateLeaves({
    single: singleHold,
    reminder: input.reminderInjected === true,
    restated:
      input.sendUserMessage === true ||
      input.restatement === true ||
      input.diptych === true,
    bothRendered:
      input.doubleRender === true ||
      input.briefEcho === true ||
      input.paraphrasePair === true,
  });
  const diptych =
    !singleHold &&
    (leaves.doubled === true ||
      input.diptych === true ||
      input.briefEcho === true ||
      input.sendUserMessage === true);
  return {
    single: !diptych,
    diptych,
    briefEcho: diptych,
    leaves,
    phrase: diptych ? "score diptych" : "admit single",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94397") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapDiptych(input = {}) {
  const diptych = isDiptychInput(input);
  const single = input.single === true && !diptych;
  return {
    stamp: diptych ? "brief-echo" : "once",
    holdingLane: diptych ? "right-leaf" : "once",
    kindLane: diptych ? "brief-echo" : "hinged-tablet",
    bindLane: diptych ? "oxidized-hinge" : "folio",
    ribbon: diptych ? "diptych" : "single",
    single,
  };
}

export function inspectSendUserMessage(input = {}) {
  const tool =
    input.sendUserMessage === true ||
    input.diptych === true ||
    input.briefEcho === true ||
    isDiptychInput(input);
  if (input.single === true && !tool) {
    return { stamp: "no-tool", tool: false, note: "no SendUserMessage restatement" };
  }
  return {
    stamp: tool ? "sendusermessage" : "tool-idle",
    tool,
    note: tool
      ? "sendusermessage — model restates via SendUserMessage {message: same answer, reworded}"
      : "",
  };
}

export function inspectRestatement(input = {}) {
  const restated =
    input.restatement === true ||
    input.diptych === true ||
    isDiptychInput(input);
  if (input.single === true && !restated) {
    return { stamp: "one-leaf", restated: false };
  }
  return {
    stamp: restated ? "restatement" : "restate-idle",
    restated,
    note: restated
      ? "restatement — second copy is a slight paraphrase of the first"
      : "",
  };
}

export function inspectDoubleRender(input = {}) {
  const both =
    input.doubleRender === true ||
    input.diptych === true ||
    input.briefEcho === true ||
    isDiptychInput(input);
  if (input.single === true && !both) {
    return { stamp: "one-panel", both: false };
  }
  return {
    stamp: both ? "double-render" : "render-idle",
    both,
    note: both
      ? "double-render — client hangs both the plain text and the tool restatement"
      : "",
  };
}

export function inspectReminderInjected(input = {}) {
  const injected =
    input.reminderInjected === true ||
    input.diptych === true ||
    isDiptychInput(input);
  if (input.single === true && !injected) {
    return { stamp: "no-rubric", injected: false };
  }
  return {
    stamp: injected ? "reminder-injected" : "rubric-idle",
    injected,
    note: injected
      ? "reminder-injected — You ended without calling SendUserMessage… brief mode… Call it now…"
      : "",
  };
}

export function inspectPersistedTwice(input = {}) {
  const twice =
    input.persistedTwice === true ||
    input.diptych === true ||
    isDiptychInput(input);
  if (input.single === true && !twice) {
    return { stamp: "one-folio", twice: false };
  }
  return {
    stamp: twice ? "persisted-twice" : "persist-idle",
    twice,
    note: twice
      ? "persisted-twice — both copies survive reload and desktop reopen"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "hinged-tablet": input.diptych || input.briefEcho,
    "left-leaf": input.diptych || input.plainNotHidden,
    "reminder-rubric": input.reminderInjected || input.diptych,
    "right-leaf": input.sendUserMessage || input.restatement || input.diptych,
    "oxidized-hinge": input.doubleRender || input.briefEcho,
    "illuminated-choir": input.persistedTwice || input.everyTurn,
  };
  return (
    map[id] === true ||
    input.briefEcho === true ||
    input.diptych === true
  );
}

function isDiptychInput(input = {}) {
  return (
    input.diptych === true ||
    input.briefEcho === true ||
    input.sendUserMessage === true ||
    input.restatement === true ||
    input.doubleRender === true ||
    input.paraphrasePair === true ||
    input.reminderInjected === true ||
    input.plainNotHidden === true ||
    input.persistedTwice === true ||
    input.everyTurn === true ||
    input.mobileBrief === true
  );
}

export function readBooth(input = {}) {
  const diptych = isDiptychInput(input);
  const single = input.single === true && !diptych;
  return {
    mark: diptych ? "diptych" : "single",
    single,
    diptych,
    briefEcho: input.briefEcho === true || diptych,
    sendUserMessage: input.sendUserMessage === true,
    restatement: input.restatement === true,
    doubleRender: input.doubleRender === true,
    paraphrasePair: input.paraphrasePair === true,
    reminderInjected: input.reminderInjected === true,
    plainNotHidden: input.plainNotHidden === true,
    persistedTwice: input.persistedTwice === true,
    everyTurn: input.everyTurn === true,
    mobileBrief: input.mobileBrief === true,
    clinic: mapDiptych(input),
    tool: inspectSendUserMessage(input),
    restated: inspectRestatement(input),
    both: inspectDoubleRender(input),
    rubric: inspectReminderInjected(input),
    persist: inspectPersistedTwice(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const DIPTYCH_WALK = Object.freeze([
  {
    t: "idle",
    event: "once",
    single: true,
    diptych: false,
    cue: "single",
    note: "idle HOLD: one reply per turn; the diptych stays shut",
  },
  {
    t: "brief-echo",
    event: "brief-echo",
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
    restatement: true,
    reminderInjected: true,
    cue: "diptych",
    note: "plain assistant text then reminder then SendUserMessage restatement",
  },
  {
    t: "path",
    event: "brief-echo",
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
    restatement: true,
    doubleRender: true,
    paraphrasePair: true,
    reminderInjected: true,
    plainNotHidden: true,
    persistedTwice: true,
    everyTurn: true,
    mobileBrief: true,
    cue: "diptych",
    note: "brief-echo — both leaves hung; persisted twice; every turn",
  },
  {
    t: "score",
    event: "diptych",
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
    restatement: true,
    doubleRender: true,
    paraphrasePair: true,
    reminderInjected: true,
    plainNotHidden: true,
    persistedTwice: true,
    everyTurn: true,
    mobileBrief: true,
    cue: "diptych",
    note: "diptych — the hinge opens a second leaf the reminder said was invisible",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "once",
    single: true,
    diptych: false,
    cue: "single",
    note: "positive control: one reply per turn; the diptych stays shut",
  },
  {
    t: "admit",
    event: "once",
    single: true,
    cue: "single",
    note: "positive control: the booth admits single",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    single: true,
    diptych: false,
    briefEcho: false,
    cue: "single",
  };
}

export function seedSingle() {
  return { ...emptyTicket() };
}

export function seedDiptych() {
  return {
    seed: SEEDED_WORD,
    single: false,
    diptych: true,
    briefEcho: true,
    sendUserMessage: true,
    restatement: true,
    doubleRender: true,
    paraphrasePair: true,
    reminderInjected: true,
    plainNotHidden: true,
    persistedTwice: true,
    everyTurn: true,
    mobileBrief: true,
    cue: "diptych",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DIPTYCH_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    diptych: true,
    briefEcho: true,
    cue: "diptych",
  };
}

export function seedBriefEcho() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    diptych: true,
    briefEcho: true,
    event: "brief-echo",
    cue: "diptych",
  };
}

export function seedOnce() {
  return { seed: "once", preferSeed: true, single: true, cue: "single" };
}

export function seedSolo() {
  return { seed: "solo", preferSeed: true, single: true, cue: "single" };
}

export function seedFolio() {
  return { seed: "folio", preferSeed: true, single: true, cue: "single" };
}

export function seedSimplex() {
  return { seed: "simplex", preferSeed: true, single: true, cue: "single" };
}

export function seedSendUserMessage() {
  return {
    seed: "sendusermessage",
    preferSeed: true,
    sendUserMessage: true,
    cue: "diptych",
  };
}

export function seedRestatement() {
  return {
    seed: "restatement",
    preferSeed: true,
    restatement: true,
    cue: "diptych",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      single: false,
      diptych: false,
      briefEcho: false,
      sendUserMessage: false,
      restatement: false,
      doubleRender: false,
      paraphrasePair: false,
      reminderInjected: false,
      plainNotHidden: false,
      persistedTwice: false,
      everyTurn: false,
      mobileBrief: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    single: raw.single === true,
    diptych: raw.diptych === true || raw.event === "diptych",
    briefEcho:
      raw.briefEcho === true || raw.event === "brief-echo",
    sendUserMessage:
      raw.sendUserMessage === true || raw.event === "sendusermessage",
    restatement:
      raw.restatement === true || raw.event === "restatement",
    doubleRender:
      raw.doubleRender === true || raw.event === "double-render",
    paraphrasePair:
      raw.paraphrasePair === true || raw.event === "paraphrase-pair",
    reminderInjected:
      raw.reminderInjected === true || raw.event === "reminder-injected",
    plainNotHidden:
      raw.plainNotHidden === true || raw.event === "plain-not-hidden",
    persistedTwice:
      raw.persistedTwice === true || raw.event === "persisted-twice",
    everyTurn:
      raw.everyTurn === true || raw.event === "every-turn",
    mobileBrief:
      raw.mobileBrief === true || raw.event === "mobile-brief",
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
      (ticket.single != null ||
        ticket.diptych != null ||
        ticket.briefEcho != null ||
        ticket.sendUserMessage != null ||
        ticket.restatement != null ||
        ticket.doubleRender != null ||
        ticket.paraphrasePair != null ||
        ticket.reminderInjected != null ||
        ticket.plainNotHidden != null ||
        ticket.persistedTwice != null ||
        ticket.everyTurn != null ||
        ticket.mobileBrief != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isSingle(row) {
  if (row.diptych && row.cue !== "single") return false;
  if (row.cue === "diptych" || row.cue === "brief-echo") return false;
  if (
    row.briefEcho &&
    row.sendUserMessage &&
    row.cue !== "single" &&
    row.single !== true
  ) {
    return false;
  }
  if (
    row.single === true &&
    row.diptych !== true &&
    row.cue !== "diptych"
  ) {
    return true;
  }
  if (
    row.cue === "single" &&
    row.diptych !== true &&
    row.briefEcho !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isBriefEcho(row) {
  return (
    row.event === "brief-echo" &&
    !isSingle(row) &&
    (row.briefEcho === true ||
      row.sendUserMessage === true ||
      row.diptych === true)
  );
}

function isDiptychRow(row) {
  if (isSingle(row)) return false;
  if (isBriefEcho(row) && row.cue !== "diptych") return false;
  if (row.cue === "diptych") return true;
  if (row.diptych === true) return true;
  if (row.briefEcho === true && row.sendUserMessage === true) return true;
  if (
    row.briefEcho === true ||
    row.sendUserMessage === true ||
    row.restatement === true ||
    row.doubleRender === true ||
    row.paraphrasePair === true ||
    row.reminderInjected === true ||
    row.plainNotHidden === true ||
    row.persistedTwice === true ||
    row.everyTurn === true ||
    row.mobileBrief === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one diptych pass against the hinged tablet.
 * single: one reply per turn.
 * diptych: plain text plus SendUserMessage restatement.
 * brief-echo: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBriefEcho(row) ||
    (row.briefEcho && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "brief-echo";
  } else if (isDiptychRow(row)) {
    verdict = "diptych";
  } else if (isSingle(row)) {
    verdict = "single";
  } else if (
    row.briefEcho ||
    row.sendUserMessage ||
    row.restatement ||
    row.doubleRender ||
    row.paraphrasePair ||
    row.reminderInjected ||
    row.plainNotHidden ||
    row.persistedTwice ||
    row.everyTurn ||
    row.mobileBrief
  ) {
    verdict = "diptych";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "diptych";
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
    single: verdict === "single",
    diptych: verdict === "diptych" || verdict === SEEDED_WORD,
    briefEcho:
      row.briefEcho === true ||
      verdict === "brief-echo" ||
      verdict === PATH_WORD,
    sendUserMessage: row.sendUserMessage,
    restatement: row.restatement,
    doubleRender: row.doubleRender,
    paraphrasePair: row.paraphrasePair,
    reminderInjected: row.reminderInjected,
    plainNotHidden: row.plainNotHidden,
    persistedTwice: row.persistedTwice,
    everyTurn: row.everyTurn,
    mobileBrief: row.mobileBrief,
    cue: hold
      ? "single"
      : row.briefEcho || verdict === "brief-echo"
        ? "brief-echo"
        : "diptych",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit single" : "score diptych",
    toolInspect: inspectSendUserMessage(row),
    restatedInspect: inspectRestatement(row),
    bothInspect: inspectDoubleRender(row),
    rubricInspect: inspectReminderInjected(row),
    persistInspect: inspectPersistedTwice(row),
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
      : DIPTYCH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "diptych");
  const path = scored.filter((row) => row.verdict === "brief-echo");
  const single = scored.filter((row) => row.verdict === "single");
  const headline =
    scored.find((row) => row.event === "diptych") ||
    scored.find((row) => row.event === "brief-echo") ||
    scored.find((row) => row.event === "sendusermessage") ||
    charged[charged.length - 1];
  let verdict = "single";
  if (charged.length) verdict = "diptych";
  else if (path.length && !single.length) {
    verdict = "brief-echo";
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
    diptychCount: charged.length,
    pathCount: path.length,
    singleCount: single.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit single" : "score diptych",
    note: headline
      ? "Remote Control (mobile) brief mode: every assistant reply rendered twice — plain text plus SendUserMessage restatement. Desktop 1.52386.6; CLI 2.1.266; iOS local agent; macOS 26.6.2. Cite-only cousins #88897 #81080 #83229."
      : "published diptych walk scored against single vs diptych",
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
    seeded !== "single" &&
    seeded !== "diptych" &&
    seeded !== "brief-echo" &&
    ticket.single == null &&
    ticket.diptych == null &&
    ticket.briefEcho == null &&
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
    single: scored.single ?? false,
    diptych: scored.diptych ?? false,
    briefEcho: scored.briefEcho ?? false,
    sendUserMessage: scored.sendUserMessage ?? false,
    restatement: scored.restatement ?? false,
    doubleRender: scored.doubleRender ?? false,
    paraphrasePair: scored.paraphrasePair ?? false,
    reminderInjected: scored.reminderInjected ?? false,
    plainNotHidden: scored.plainNotHidden ?? false,
    persistedTwice: scored.persistedTwice ?? false,
    everyTurn: scored.everyTurn ?? false,
    mobileBrief: scored.mobileBrief ?? false,
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
    result.briefEcho || result.diptych
      ? "kind=brief-echo"
      : "kind=hinged-tablet",
    result.sendUserMessage || result.diptych
      ? "ref=sendusermessage"
      : "ref=once",
    result.briefEcho || result.verdict === "brief-echo"
      ? "path=brief-echo"
      : "path=single",
    result.cue === "single"
      ? "cue=single"
      : result.cue === "brief-echo"
        ? "cue=brief-echo"
        : "cue=diptych",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    single: result.single,
    diptych: result.diptych,
    briefEcho: result.briefEcho,
    sendUserMessage: result.sendUserMessage,
    restatement: result.restatement,
    doubleRender: result.doubleRender,
    paraphrasePair: result.paraphrasePair,
    reminderInjected: result.reminderInjected,
    plainNotHidden: result.plainNotHidden,
    persistedTwice: result.persistedTwice,
    everyTurn: result.everyTurn,
    mobileBrief: result.mobileBrief,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    tool: inspectSendUserMessage({
      single: result.single,
      diptych: result.diptych,
      sendUserMessage: result.sendUserMessage,
    }),
    restated: inspectRestatement({
      single: result.single,
      diptych: result.diptych,
      restatement: result.restatement,
    }),
    both: inspectDoubleRender({
      single: result.single,
      diptych: result.diptych,
      doubleRender: result.doubleRender,
    }),
    rubric: inspectReminderInjected({
      single: result.single,
      diptych: result.diptych,
      reminderInjected: result.reminderInjected,
    }),
    persist: inspectPersistedTwice({
      single: result.single,
      diptych: result.diptych,
      persistedTwice: result.persistedTwice,
    }),
    clinic: mapDiptych({
      single: result.single,
      diptych: result.diptych,
      briefEcho: result.briefEcho,
      sendUserMessage: result.sendUserMessage,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      diptych: result.diptych === true || result.verdict === "diptych",
    })),
    leakPath: scoreBriefEcho({
      single: result.single === true && !result.diptych,
      diptych: result.diptych,
      briefEcho: result.briefEcho,
      sendUserMessage: result.sendUserMessage,
      restatement: result.restatement,
      doubleRender: result.doubleRender,
      paraphrasePair: result.paraphrasePair,
      reminderInjected: result.reminderInjected,
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
      hypothesis:
        "NON-BINDING (issue text): brief-mode reminder + visible plain assistant text guarantees a doubled billed restatement via SendUserMessage on every substantive mobile Remote Control turn. Invite verify against #94397 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
