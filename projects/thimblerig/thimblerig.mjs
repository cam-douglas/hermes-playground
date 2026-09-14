#!/usr/bin/env node
/**
 * Thimblerig — street-corner cups-and-pea / carnival tent /
 * chalk tally booth.
 *
 * Educational diagnostic model for a published Claude Code
 * /context reporting defect: hiding skills
 * (`disable-model-invocation: true`, `disableBundledSkills: true`,
 * etc.) makes the Skills row go down, but the System tools row
 * goes up by exactly the same amount. The total never changes.
 * Re-open of #85439 (auto-closed stale 2026-09-13 despite
 * `reproduced` + maintainer confirmation).
 *
 * Maintainer on #85439 (2.1.233): skill listing is NOT part of
 * tool definitions; sent as a separate note alongside the first
 * message. `/context` still computes System tools as
 * "tools minus the skill listing", carving Skills out of a
 * number that never contained it — rows trade tokens; total
 * does not move. Confirmed reporting bug; payload really shrinks;
 * display lies.
 *
 * Measurements (A/B/C): Skills 3.9k→2.8k→800; System tools
 * 18k→19.1k→21.1k; Total stuck at 27.1k all three.
 *
 *   node thimblerig.mjs data/thimblerig.json
 *   echo '{"seed":"thimblerig"}' | node thimblerig.mjs
 *
 * Idle word is additive (HOLD: Skills row additive; total moves
 * when you trim). HOLD aliases: additive, honest-total, settled,
 * true-sum, skills-additive, account-true.
 * Seeded word is thimblerig (#94174 — the skill-row-carve path).
 * Path word is skill-row-carve.
 * Product score word is thimblerig (Score thimblerig or admit additive.).
 *
 * Encoded from anthropics/claude-code#94174 / #85439 issue text
 * only. Hypothesis (NON-BINDING): `/context` System-tools =
 * tools−skillListing even though listing was never in tools;
 * make Skills additive. Invite verify against issue text only.
 * Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude.
 *
 * NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032.
 * NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041.
 * NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049.
 * NOT Chirograph/#94045. NOT Titulus. NOT Derelict. NOT Vestry.
 * NOT Mondegreen. NOT Afterimage/#92596. NOT Phosphene.
 * NOT Scotoma. NOT Scrim. NOT Aphonia/#92409. NOT Sourdine/#93531.
 * NOT Anarthria/#93782.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #85439 original closed-stale report (same bug); #92255 MCP
 * schemas still consuming after disable (different); #92877
 * /context dollar cost feature; #92881 /context min-token
 * threshold feature; #87281 background job missing skills
 * listing reminder.
 * Thimblerig is specifically: /context carves the Skills listing
 * from a System-tools row that never contained it, so cups
 * trade the pea 1:1 and the chalk total stays frozen.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "additive",
  "thimblerig",
  "skill-row-carve",
  "hold",
  "honest-total",
  "settled",
  "true-sum",
  "skills-additive",
  "account-true",
  "frozen-total",
  "row-trade",
  "carved-listing",
  "baseline-a",
  "disable-invocation-b",
  "disable-bundled-c",
  "reporting-lie",
  "payload-shrinks",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "landing",
]);

export const IDLE_WORD = "additive";
export const PATH_WORD = "skill-row-carve";
export const SEEDED_WORD = "thimblerig";
export const PRODUCT_WORD = "thimblerig";
export const HOLD = Object.freeze(["additive", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "additive",
  "honest-total",
  "settled",
  "true-sum",
  "skills-additive",
  "account-true",
]);
export const RECOVER = Object.freeze(["additive", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "demesned",
  "diagrammed",
  "traced",
  "damped",
  "mounted",
  "warm",
  "honest",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "preserved",
  "raised",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FEATURED_ISSUE = 94174;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94174";
export const TITLE =
  "[BUG] /context: hiding skills moves tokens from Skills to System tools 1:1, total never drops (re-open of #85439, closed as stale)";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "area:tui"]);
export const PLATFORM = "tui";
export const SURFACE = "skill-row-carve";
export const HOST = "Claude Code /context TUI; skill listing note + tool definitions";
export const CHECKED_ON =
  "Originally 2.1.226 macOS 26.6.1 Apple Silicon native; maintainer confirmed 2.1.233; reporter still on 2.1.270 with no changelog fix";
export const BUILD = "/context TUI (2.1.270; confirmed 2.1.233)";
export const SELECTED_MODEL = "claude-opus-5";
export const OS = "macOS 26.6.1 (Darwin 25.6.0)";
export const PHRASE = "Score thimblerig or admit additive.";
export const DISTRIBUTION =
  "Hiding skills (disable-model-invocation: true, disableBundledSkills: true, etc.) makes the /context Skills row go down, but the System tools row goes up by exactly the same amount. Total never changes. Measurements A/B/C: Skills 3.9k (49) → 2.8k (22) → 800 (7); System tools 18k → 19.1k → 21.1k; Total stuck at 27.1k all three. Maintainer on #85439 (2.1.233): skill listing is not part of tool definitions; sent as a separate note alongside the first message. /context still computes System tools as tools minus the skill listing, carving Skills out of a number that never contained it. Confirmed reporting bug; payload really shrinks; display lies. Re-open of #85439 (auto-closed stale 2026-09-13 despite reproduced + maintainer confirmation). Current reporter on 2.1.270; no changelog fix.";

export const RULED_OUT = Object.freeze([
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus — resume-stale-title; different plaque",
  "Derelict — session-kill-orphan; different hulk",
  "Vestry — mount-refcount-race; different sacristy",
  "Mondegreen — substring-scan; different lyric ear",
  "Afterimage/#92596 — Windows text paint latency (CRT phosphor)",
  "Phosphene — layer-tree-walk; vision flash",
  "Scotoma — /goal lived only in command-args; vision gap",
  "Scrim — runtime DLP redaction; different product",
  "Aphonia/#92409 — missing SendMessage; ENT roster",
  "Sourdine/#93531 — mid-narration mute; concert mute",
  "Anarthria/#93782 — dictation paste drop; laryngology",
]);
export const EXPECTED = Object.freeze([
  "The Skills row should be counted on top of System tools, not subtracted from it",
  "System tools should show the real size of the tool definitions",
  "The total should go down when you hide skills",
  "Hiding skills with disable-model-invocation / disableBundledSkills should move the chalk total, not just slide tokens between cups",
  "/context should not carve a skill listing out of a tools number that never contained it",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "baseline-a",
    label: "A baseline",
    count: "Skills 3.9k / tools 18k / total 27.1k",
    note: "49 skills; System prompt 3.4k; custom agents 408; memory 1.4k; messages 8",
  },
  {
    id: "disable-invocation-b",
    label: "B disable-model-invocation",
    count: "Skills 2.8k / tools 19.1k / total 27.1k",
    note: "disable-model-invocation on 28 commands; Skills 3.9k→2.8k; tools 18k→19.1k",
  },
  {
    id: "disable-bundled-c",
    label: "C disableBundledSkills",
    count: "Skills 800 / tools 21.1k / total 27.1k",
    note: "B + disableBundledSkills: true; Skills 800 (7); tools 21.1k",
  },
  {
    id: "frozen-total",
    label: "frozen total",
    count: "27.1k all three",
    note: "A: 3.4 + 18.0 + 0.408 + 1.4 + 3.9 + 0.008 = 27.116k — same for B and C",
  },
  {
    id: "row-trade",
    label: "row trade",
    count: "1:1 cups",
    note: "Skills down by the same amount System tools go up",
  },
  {
    id: "carved-listing",
    label: "carved listing",
    count: "tools − skill listing",
    note: "Skill listing is a separate note; /context carves it from a tools row that never held it",
  },
]);

export const CUP_SHAPES = Object.freeze([
  {
    id: "baseline-a",
    lost: "Skills 3.9k / System tools 18k / total frozen 27.1k",
    control: "Skills additive on top of tools; total is a true sum",
    story: "the carny sets three cups on the walnut board",
  },
  {
    id: "disable-invocation-b",
    lost: "Skills 2.8k; tools rise to 19.1k; total still 27.1k",
    control: "hiding 28 commands drops the tally",
    story: "one cup sheds the pea; another swallows it",
  },
  {
    id: "disable-bundled-c",
    lost: "Skills 800; tools 21.1k; total still 27.1k",
    control: "bundled skills off drops the tally again",
    story: "the third shuffle still leaves the chalk total still",
  },
  {
    id: "frozen-total",
    lost: "Total stuck at 27.1k across A/B/C",
    control: "the chalk total moves when skills are trimmed",
    story: "the tally board never rubs out 27.1k",
  },
  {
    id: "row-trade",
    lost: "Skills↓ System tools↑ 1:1",
    control: "System tools stay the real tool-definition size",
    story: "the pea slides from the Skills cup into the tools cup",
  },
  {
    id: "skill-row-carve",
    lost: "/context carves Skills from a tools number that never contained the listing",
    control: "Skills row additive; listing never subtracted from tools",
    story: "the carny lifts a cup that never held the pea",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "additive-board",
    survey:
      "canvas tent; walnut board; three cups still; chalk total a true sum",
    kind: "additive",
    note: "idle: additive — the hold/good path",
  },
  {
    id: "row-trade",
    survey:
      "hiding skills drops the Skills cup and fills the tools cup by the same pea",
    kind: "thimblerig",
    note: "seeded: thimblerig trades cups 1:1",
  },
  {
    id: "skill-row-carve",
    survey:
      "/context carves Skills from tools that never held the listing; total frozen",
    kind: "thimblerig",
    note: "path: skill-row-carve names the carve",
  },
  {
    id: "frozen-total",
    survey:
      "A/B/C totals all 27.1k while Skills 3.9k→2.8k→800 and tools 18k→19.1k→21.1k",
    kind: "thimblerig",
    note: "seeded: chalk total never moves",
  },
  {
    id: "thimblerig",
    survey:
      "the booth is thimblerig — cups trade the pea; the tally is a lie",
    kind: "thimblerig",
    note: "seeded: thimblerig — Score thimblerig or admit additive.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "skill-row-carve",
  "thimblerig",
  "frozen-total",
  "row-trade",
  "carved-listing",
  "baseline-a",
  "disable-invocation-b",
  "disable-bundled-c",
  "reporting-lie",
  "payload-shrinks",
]);

export const COUSINS = Object.freeze([
  {
    issue: 85439,
    title: "original closed-stale report (same /context Skills↔tools trade)",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — same bug, auto-closed stale 2026-09-13 despite reproduced + maintainer confirmation. Do not rebuild. Do not conflate as a second defect.",
  },
  {
    issue: 92255,
    title: "MCP schemas still consuming after disable",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — MCP schema consumption after disable, not the #94174 /context skill-row-carve. Do not rebuild. Do not conflate.",
  },
  {
    issue: 92877,
    title: "/context dollar cost feature",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /context dollar cost feature, not the #94174 skill-row-carve. Do not rebuild. Do not conflate.",
  },
  {
    issue: 92881,
    title: "/context min-token threshold feature",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /context min-token threshold feature, not the #94174 skill-row-carve. Do not rebuild. Do not conflate.",
  },
  {
    issue: 87281,
    title: "background job missing skills listing reminder",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — background job missing skills listing reminder, not the #94174 /context carve. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
]);

export const SAMPLE_KIND_IDLE = "account-true";
export const SAMPLE_KIND_SEEDED = "skill-row-carve";
export const SAMPLE_HOLDING_IDLE = "true-sum";
export const SAMPLE_HOLDING_SEEDED = "frozen";

export const SAMPLE_ADDITIVE_PROOF = Object.freeze({
  additive: true,
  thimblerig: false,
  skillRowCarve: false,
  frozenTotal: false,
  rowTrade: false,
  carvedListing: false,
  baselineA: false,
  disableInvocationB: false,
  disableBundledC: false,
  reportingLie: false,
  payloadShrinks: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_THIMBLERIG_PROOF = Object.freeze({
  additive: false,
  thimblerig: true,
  skillRowCarve: true,
  frozenTotal: true,
  rowTrade: true,
  carvedListing: true,
  baselineA: true,
  disableInvocationB: true,
  disableBundledC: true,
  reportingLie: true,
  payloadShrinks: true,
  kind: SAMPLE_KIND_SEEDED,
  shapes: CUP_SHAPES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds additive: Skills row on top; chalk total a true sum; cups still" },
  { t: "hide", line: "disable-model-invocation / disableBundledSkills hide skills" },
  { t: "trade", line: "Skills↓ System tools↑ 1:1; total frozen at 27.1k" },
  { t: "path", line: "skill-row-carve — /context carves Skills from a tools row that never contained the listing" },
  { t: "score", line: "when the cups trade the pea and the tally stays 27.1k the booth is thimblerig — Score thimblerig or admit additive." },
]);

const FORCE_FLAGS = [
  "skillRowCarve",
  "frozenTotal",
  "rowTrade",
  "carvedListing",
  "baselineA",
  "disableInvocationB",
  "disableBundledC",
  "reportingLie",
  "payloadShrinks",
];

/**
 * Board map: additive chalk tally vs thimblerig cups.
 * Idle/additive: Skills on top; total moves when you trim.
 * Seeded/thimblerig: cups trade the pea 1:1; total frozen.
 */
export function mapBoard(input = {}) {
  const thimblerig = isThimblerigInput(input);
  const additive = input.additive === true && !thimblerig;
  return {
    stamp: thimblerig ? "skill-row-carve" : "additive-board",
    holdingLane: thimblerig ? "frozen" : "true-sum",
    kindLane: thimblerig ? "skill-row-carve" : "account-true",
    bindLane: thimblerig ? "row-trade" : "skills-additive",
    ribbon: thimblerig ? "thimblerig" : "additive",
    additive,
  };
}

export function inspectTent(input = {}) {
  const rigged = isThimblerigInput(input);
  if (input.additive === true && !rigged) {
    return {
      stamp: "tent-canvas",
      rigged: false,
      note: "canvas tent stays honest — the house holds additive",
    };
  }
  return {
    stamp: rigged ? "tent-rigged" : "tent-idle",
    rigged,
    note: rigged
      ? "canvas tent is still up; the walnut board is the thimblerig"
      : "",
  };
}

export function inspectCups(input = {}) {
  const traded = isThimblerigInput(input);
  if (input.additive === true && !traded) {
    return {
      stamp: "cups-still",
      traded: false,
      edge: "true-sum",
    };
  }
  return {
    stamp: traded ? "cups-traded" : "cups-idle",
    traded,
    edge: traded ? "row-trade" : "true-sum",
    note: traded
      ? "Skills cup sheds the pea; System tools cup swallows it 1:1"
      : "",
  };
}

export function inspectPea(input = {}) {
  const carved =
    input.carvedListing === true ||
    input.thimblerig === true ||
    isThimblerigInput(input);
  if (input.additive === true && !carved) {
    return {
      stamp: "pea-additive",
      carved: false,
    };
  }
  return {
    stamp: carved ? "pea-carved" : "pea-idle",
    carved,
    note: carved
      ? "the pea (skill listing) was never under the tools cup — /context carves it anyway"
      : "",
  };
}

export function inspectTally(input = {}) {
  const frozen =
    input.frozenTotal === true ||
    input.thimblerig === true ||
    isThimblerigInput(input);
  if (input.additive === true && !frozen) {
    return {
      stamp: "tally-moves",
      frozen: false,
    };
  }
  return {
    stamp: frozen ? "tally-frozen" : "tally-idle",
    frozen,
    note: frozen
      ? "chalk total stuck at 27.1k across A/B/C"
      : "",
  };
}

export function inspectBoard(input = {}) {
  const lie =
    input.reportingLie === true ||
    input.thimblerig === true ||
    isThimblerigInput(input);
  if (input.additive === true && !lie) {
    return {
      stamp: "board-honest-total",
      lie: false,
    };
  }
  return {
    stamp: lie ? "board-lie" : "board-idle",
    lie,
    note: lie
      ? "payload shrinks; chalk board lies — System tools under-reported by the listing size"
      : "",
  };
}

function shapeOpen(input, id) {
  const map = {
    "baseline-a": input.baselineA,
    "disable-invocation-b": input.disableInvocationB,
    "disable-bundled-c": input.disableBundledC,
    "frozen-total": input.frozenTotal,
    "row-trade": input.rowTrade,
    "skill-row-carve": input.skillRowCarve,
  };
  return (
    map[id] === true ||
    input.skillRowCarve === true ||
    input.thimblerig === true
  );
}

function isThimblerigInput(input = {}) {
  return (
    input.thimblerig === true ||
    input.skillRowCarve === true ||
    input.frozenTotal === true ||
    input.rowTrade === true ||
    input.carvedListing === true ||
    input.baselineA === true ||
    input.disableInvocationB === true ||
    input.disableBundledC === true ||
    input.reportingLie === true ||
    input.payloadShrinks === true
  );
}

export function readBooth(input = {}) {
  const thimblerig = isThimblerigInput(input);
  const additive = input.additive === true && !thimblerig;
  return {
    mark: thimblerig ? "thimblerig" : "additive",
    additive,
    thimblerig,
    skillRowCarve: input.skillRowCarve === true || thimblerig,
    frozenTotal: input.frozenTotal === true,
    rowTrade: input.rowTrade === true,
    carvedListing: input.carvedListing === true,
    baselineA: input.baselineA === true,
    disableInvocationB: input.disableInvocationB === true,
    disableBundledC: input.disableBundledC === true,
    reportingLie: input.reportingLie === true,
    payloadShrinks: input.payloadShrinks === true,
    scope: mapBoard(input),
    tent: inspectTent(input),
    cups: inspectCups(input),
    pea: inspectPea(input),
    tally: inspectTally(input),
    board: inspectBoard(input),
    shapes: CUP_SHAPES.filter((row) => shapeOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const THIMBLERIG_WALK = Object.freeze([
  {
    t: "idle",
    event: "tally-additive",
    additive: true,
    thimblerig: false,
    cue: "additive",
    note: "idle HOLD: Skills row additive; chalk total a true sum; cups still — the hold/good path",
  },
  {
    t: "hide",
    event: "skills-hidden",
    thimblerig: true,
    skillRowCarve: true,
    cue: "thimblerig",
    note: "disable-model-invocation / disableBundledSkills hide skills",
  },
  {
    t: "trade",
    event: "row-trade",
    thimblerig: true,
    rowTrade: true,
    frozenTotal: true,
    cue: "thimblerig",
    note: "Skills↓ System tools↑ 1:1; total frozen at 27.1k",
  },
  {
    t: "path",
    event: "skill-row-carve",
    thimblerig: true,
    skillRowCarve: true,
    carvedListing: true,
    reportingLie: true,
    payloadShrinks: true,
    cue: "thimblerig",
    note: "skill-row-carve — /context carves Skills from a tools row that never contained the listing",
  },
  {
    t: "score",
    event: "thimblerig",
    thimblerig: true,
    skillRowCarve: true,
    frozenTotal: true,
    rowTrade: true,
    carvedListing: true,
    baselineA: true,
    disableInvocationB: true,
    disableBundledC: true,
    reportingLie: true,
    payloadShrinks: true,
    cue: "thimblerig",
    note: "thimblerig — when the cups trade the pea and the tally stays 27.1k the booth is thimblerig",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "tally-additive",
    additive: true,
    thimblerig: false,
    cue: "additive",
    note: "positive control: Skills additive; System tools un-carved; total moves when you trim — the board is additive",
  },
  {
    t: "admit",
    event: "tally-additive",
    additive: true,
    cue: "additive",
    note: "positive control: the board admits additive",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    additive: true,
    thimblerig: false,
    skillRowCarve: false,
    cue: "additive",
  };
}

export function seedAdditive() {
  return { ...emptyTicket() };
}

export function seedThimblerig() {
  return {
    seed: SEEDED_WORD,
    additive: false,
    thimblerig: true,
    skillRowCarve: true,
    frozenTotal: true,
    rowTrade: true,
    carvedListing: true,
    baselineA: true,
    disableInvocationB: true,
    disableBundledC: true,
    reportingLie: true,
    payloadShrinks: true,
    cue: "thimblerig",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_THIMBLERIG_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    thimblerig: true,
    skillRowCarve: true,
    rowTrade: true,
    cue: "thimblerig",
  };
}

export function seedSkillRowCarve() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    thimblerig: true,
    skillRowCarve: true,
    event: "skill-row-carve",
    cue: "thimblerig",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedHonestTotal() {
  return {
    seed: "honest-total",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedSettled() {
  return {
    seed: "settled",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedTrueSum() {
  return {
    seed: "true-sum",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedSkillsAdditive() {
  return {
    seed: "skills-additive",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedAccountTrue() {
  return {
    seed: "account-true",
    preferSeed: true,
    additive: true,
    cue: "additive",
  };
}

export function seedFrozenTotal() {
  return {
    seed: "frozen-total",
    preferSeed: true,
    frozenTotal: true,
    cue: "thimblerig",
  };
}

export function seedRowTrade() {
  return {
    seed: "row-trade",
    preferSeed: true,
    rowTrade: true,
    cue: "thimblerig",
  };
}

export function seedCarvedListing() {
  return {
    seed: "carved-listing",
    preferSeed: true,
    carvedListing: true,
    cue: "thimblerig",
  };
}

export function seedBaselineA() {
  return {
    seed: "baseline-a",
    preferSeed: true,
    baselineA: true,
    cue: "thimblerig",
  };
}

export function seedDisableInvocationB() {
  return {
    seed: "disable-invocation-b",
    preferSeed: true,
    disableInvocationB: true,
    cue: "thimblerig",
  };
}

export function seedDisableBundledC() {
  return {
    seed: "disable-bundled-c",
    preferSeed: true,
    disableBundledC: true,
    cue: "thimblerig",
  };
}

export function seedReportingLie() {
  return {
    seed: "reporting-lie",
    preferSeed: true,
    reportingLie: true,
    cue: "thimblerig",
  };
}

export function seedPayloadShrinks() {
  return {
    seed: "payload-shrinks",
    preferSeed: true,
    payloadShrinks: true,
    cue: "thimblerig",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      additive: false,
      thimblerig: false,
      skillRowCarve: false,
      frozenTotal: false,
      rowTrade: false,
      carvedListing: false,
      baselineA: false,
      disableInvocationB: false,
      disableBundledC: false,
      reportingLie: false,
      payloadShrinks: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    additive: raw.additive === true,
    thimblerig: raw.thimblerig === true || raw.event === "thimblerig",
    skillRowCarve:
      raw.skillRowCarve === true || raw.event === "skill-row-carve",
    frozenTotal: raw.frozenTotal === true || raw.event === "frozen-total",
    rowTrade: raw.rowTrade === true || raw.event === "row-trade",
    carvedListing:
      raw.carvedListing === true || raw.event === "carved-listing",
    baselineA: raw.baselineA === true || raw.event === "baseline-a",
    disableInvocationB:
      raw.disableInvocationB === true ||
      raw.event === "disable-invocation-b",
    disableBundledC:
      raw.disableBundledC === true || raw.event === "disable-bundled-c",
    reportingLie:
      raw.reportingLie === true || raw.event === "reporting-lie",
    payloadShrinks:
      raw.payloadShrinks === true || raw.event === "payload-shrinks",
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
      (ticket.additive != null ||
        ticket.thimblerig != null ||
        ticket.skillRowCarve != null ||
        ticket.frozenTotal != null ||
        ticket.rowTrade != null ||
        ticket.carvedListing != null ||
        ticket.baselineA != null ||
        ticket.disableInvocationB != null ||
        ticket.disableBundledC != null ||
        ticket.reportingLie != null ||
        ticket.payloadShrinks != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isAdditive(row) {
  if (row.thimblerig && row.cue !== "additive") return false;
  if (row.cue === "thimblerig" || row.cue === "skill-row-carve") {
    return false;
  }
  if (
    row.skillRowCarve &&
    row.rowTrade &&
    row.cue !== "additive" &&
    row.additive !== true
  ) {
    return false;
  }
  if (
    row.additive === true &&
    row.thimblerig !== true &&
    row.cue !== "thimblerig"
  ) {
    return true;
  }
  if (
    row.cue === "additive" &&
    row.thimblerig !== true &&
    row.skillRowCarve !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSkillRowCarve(row) {
  return (
    row.event === "skill-row-carve" &&
    !isAdditive(row) &&
    (row.skillRowCarve === true ||
      row.rowTrade === true ||
      row.thimblerig === true)
  );
}

function isThimblerigRow(row) {
  if (isAdditive(row)) return false;
  if (isSkillRowCarve(row) && row.cue !== "thimblerig") return false;
  if (row.cue === "thimblerig") return true;
  if (row.thimblerig === true) return true;
  if (row.skillRowCarve === true && row.rowTrade === true) {
    return true;
  }
  if (
    row.skillRowCarve === true ||
    row.frozenTotal === true ||
    row.rowTrade === true ||
    row.carvedListing === true ||
    row.baselineA === true ||
    row.disableInvocationB === true ||
    row.disableBundledC === true ||
    row.reportingLie === true ||
    row.payloadShrinks === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one thimblerig pass against the board.
 * additive: Skills on top; total moves when you trim.
 * thimblerig: cups trade the pea 1:1; total frozen.
 * skill-row-carve: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSkillRowCarve(row) ||
    (row.skillRowCarve &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "skill-row-carve";
  } else if (isThimblerigRow(row)) {
    verdict = "thimblerig";
  } else if (isAdditive(row)) {
    verdict = "additive";
  } else if (
    row.skillRowCarve ||
    row.frozenTotal ||
    row.rowTrade ||
    row.carvedListing ||
    row.baselineA ||
    row.disableInvocationB ||
    row.disableBundledC ||
    row.reportingLie ||
    row.payloadShrinks
  ) {
    verdict = "thimblerig";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const tent = inspectTent(row);
  const cups = inspectCups(row);
  const pea = inspectPea(row);
  const tally = inspectTally(row);
  const board = inspectBoard(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    additive: verdict === "additive" || verdict === "hold",
    thimblerig: verdict === "thimblerig" || verdict === SEEDED_WORD,
    skillRowCarve:
      row.skillRowCarve === true ||
      verdict === "skill-row-carve" ||
      verdict === PATH_WORD,
    frozenTotal: row.frozenTotal,
    rowTrade: row.rowTrade,
    carvedListing: row.carvedListing,
    baselineA: row.baselineA,
    disableInvocationB: row.disableInvocationB,
    disableBundledC: row.disableBundledC,
    reportingLie: row.reportingLie,
    payloadShrinks: row.payloadShrinks,
    cue: hold
      ? "additive"
      : row.skillRowCarve || verdict === "skill-row-carve"
        ? "skill-row-carve"
        : "thimblerig",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit additive" : "score thimblerig",
    tentInspect: tent,
    cupsInspect: cups,
    peaInspect: pea,
    tallyInspect: tally,
    boardInspect: board,
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
      : THIMBLERIG_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "thimblerig");
  const path = scored.filter((row) => row.verdict === "skill-row-carve");
  const additive = scored.filter((row) => row.verdict === "additive");
  const headline =
    scored.find((row) => row.event === "thimblerig") ||
    scored.find((row) => row.event === "skill-row-carve") ||
    scored.find((row) => row.event === "row-trade") ||
    charged[charged.length - 1];
  let verdict = "additive";
  if (charged.length) verdict = "thimblerig";
  else if (path.length && !additive.length) {
    verdict = "skill-row-carve";
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
    thimblerigCount: charged.length,
    pathCount: path.length,
    additiveCount: additive.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit additive" : "score thimblerig",
    note: headline
      ? "Hiding skills drops Skills and raises System tools 1:1; total frozen at 27.1k. Cousins cite-only: #85439 #92255 #92877 #92881 #87281 — do not rebuild, do not conflate."
      : "published thimblerig walk scored against additive vs thimblerig",
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
    seeded !== "additive" &&
    seeded !== "thimblerig" &&
    seeded !== "skill-row-carve" &&
    ticket.additive == null &&
    ticket.thimblerig == null &&
    ticket.skillRowCarve == null &&
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
    additive: scored.additive ?? false,
    thimblerig: scored.thimblerig ?? false,
    skillRowCarve: scored.skillRowCarve ?? false,
    frozenTotal: scored.frozenTotal ?? false,
    rowTrade: scored.rowTrade ?? false,
    carvedListing: scored.carvedListing ?? false,
    baselineA: scored.baselineA ?? false,
    disableInvocationB: scored.disableInvocationB ?? false,
    disableBundledC: scored.disableBundledC ?? false,
    reportingLie: scored.reportingLie ?? false,
    payloadShrinks: scored.payloadShrinks ?? false,
  };
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
    result.rowTrade || result.thimblerig
      ? "kind=skill-row-carve"
      : "kind=account-true",
    result.frozenTotal || result.thimblerig ? "ref=frozen" : "ref=true-sum",
    result.skillRowCarve || result.verdict === "skill-row-carve"
      ? "path=skill-row-carve"
      : "path=additive",
    result.cue === "additive"
      ? "cue=additive"
      : result.cue === "skill-row-carve"
        ? "cue=skill-row-carve"
        : "cue=thimblerig",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    additive: result.additive,
    thimblerig: result.thimblerig,
    skillRowCarve: result.skillRowCarve,
    frozenTotal: result.frozenTotal,
    rowTrade: result.rowTrade,
    carvedListing: result.carvedListing,
    baselineA: result.baselineA,
    disableInvocationB: result.disableInvocationB,
    disableBundledC: result.disableBundledC,
    reportingLie: result.reportingLie,
    payloadShrinks: result.payloadShrinks,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    tent: inspectTent({
      additive: result.additive,
      thimblerig: result.thimblerig,
      skillRowCarve: result.skillRowCarve,
    }),
    cups: inspectCups({
      additive: result.additive,
      thimblerig: result.thimblerig,
      skillRowCarve: result.skillRowCarve,
    }),
    pea: inspectPea({
      additive: result.additive,
      thimblerig: result.thimblerig,
      carvedListing: result.carvedListing,
    }),
    tally: inspectTally({
      additive: result.additive,
      thimblerig: result.thimblerig,
      frozenTotal: result.frozenTotal,
    }),
    board: inspectBoard({
      additive: result.additive,
      thimblerig: result.thimblerig,
      reportingLie: result.reportingLie,
    }),
    scope: mapBoard({
      additive: result.additive,
      thimblerig: result.thimblerig,
      skillRowCarve: result.skillRowCarve,
      frozenTotal: result.frozenTotal,
      rowTrade: result.rowTrade,
      carvedListing: result.carvedListing,
      baselineA: result.baselineA,
      disableInvocationB: result.disableInvocationB,
      disableBundledC: result.disableBundledC,
      reportingLie: result.reportingLie,
      payloadShrinks: result.payloadShrinks,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      thimblerig: result.thimblerig === true || result.verdict === "thimblerig",
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
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      shapes: CUP_SHAPES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: /context System-tools = tools−skillListing even though listing was never in tools; make Skills additive. Invite verify against #94174 / #85439 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
