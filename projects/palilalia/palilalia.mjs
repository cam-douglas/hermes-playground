#!/usr/bin/env node
/**
 * Palilalia — speech-pathology clinic / phonograph groove that won't lift /
 * wax-cylinder amber / clinic cream / charcoal slate / repeating-stylus coral /
 * quiet teal.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A session-scoped /goal Stop hook can re-fire indefinitely with unchanged
 * or stale text, even after the assistant provides verifiable evidence the
 * condition is met, or after the session enters a deliberate hold. Only the
 * built-in repeated-block safety valve ends the loop ("A hook blocked the
 * turn from ending 9 consecutive times"), and the pattern resumes on a later
 * turn.
 *
 * Observed in four sessions / two triggers:
 * 1. Deliberate hold while waiting on scheduled context compaction — live
 *    /goal re-fired ≥9 consecutive times with same holding text until
 *    safety valve.
 * 2. Ordinary autonomous work — /goal re-fired ≥21 consecutive times quoting
 *    a stale multi-part goal; two in-transcript corrections citing concrete
 *    evidence of completion did not change the re-fired text.
 *
 * Expected: evaluator recognizes live transcript evidence condition is met,
 * OR supported way to acknowledge intentional hold (e.g. in-flight
 * compaction) without unbounded re-fire.
 *
 *   node palilalia.mjs data/palilalia.json
 *   echo '{"seed":"palilalia"}' | node palilalia.mjs
 *
 * Idle word is silenced (HOLD: acknowledged / stood-down / met / once).
 * Seeded word is palilalia (#94041 — the goal-stop-refire path).
 * Path word is goal-stop-refire.
 * Product score word is palilalia (Score palilalia or admit silenced.).
 *
 * Encoded from anthropics/claude-code#94041 issue text only.
 * Hypothesis (NON-BINDING): prompt-type Stop hook evaluator does not
 * re-read live transcript state when judging condition; no supported
 * hold-acknowledge signal. Invite verify against #94041 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Sepulchre/#94055 (bash-nul-poison).
 * NOT Sneck/#94052 (chip dismiss ephemeral).
 * NOT Drawbridge/#94049 (RC bridge auto-update drop).
 * NOT Chirograph/#94045 (worktree branch rename stale).
 * NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008.
 * NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954.
 * NOT Demesne/#93989. NOT Cartouche/#93772. NOT Nullarbor/#93595.
 * NOT Sigil. NOT Tocsin. NOT Carillon. NOT Knell. NOT Larum.
 * NOT Palinode. NOT Anarthria/#93782 (dictation-paste-drop).
 * Cousins cite-only: #82546 (/goal at compact boundary never starts
 * its turn), #83266 (/goal Stop hook skipped while background task
 * live, never re-evaluated), #78121 (Stop hook re-fires despite
 * stop_hook_active: true), #91601 (Stop-hook goal-condition re-fires
 * identically forever ignoring stand-down), #92242 (/goal Stop hook
 * re-fires after user accepts blocked outcome), #93744 (/goal
 * evaluator cannot see instruction via /goal, loops until
 * unachievable).
 * Palilalia is specifically: native /goal Stop hook re-fires
 * indefinitely with unchanged/stale text; no hold-acknowledge;
 * only the repeated-block safety valve ends the loop.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "silenced",
  "palilalia",
  "goal-stop-refire",
  "hold",
  "acknowledged",
  "stood-down",
  "met",
  "once",
  "hold-compaction",
  "stale-goal",
  "nine-consecutive",
  "twenty-one-consecutive",
  "safety-valve",
  "evidence-ignored",
  "no-acknowledge",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "silenced";
export const PATH_WORD = "goal-stop-refire";
export const SEEDED_WORD = "palilalia";
export const PRODUCT_WORD = "palilalia";
export const HOLD = Object.freeze(["silenced", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "silenced",
  "acknowledged",
  "stood-down",
  "met",
  "once",
]);
export const RECOVER = Object.freeze(["silenced", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "tempered",
  "quiescent",
  "diplomatic",
  "demesned",
  "diagrammed",
  "unattainted",
  "reflowed",
  "articulate",
  "limber",
  "filiated",
  "injective",
  "unitary",
  "verbatim",
  "plenary",
  "vested",
  "singular",
  "equalized",
  "legible",
  "calibrated",
  "tethered",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "sprung",
  "unpinned",
  "latched",
  "sealed",
  "liveried",
  "stamped",
  "emptied",
  "warm",
  "mounted",
  "traced",
  "damped",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "honest",
  "fossed",
  "scapegoated",
  "accreted",
  "mismatched",
  "inherited",
  "washed",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "nullarbor",
  "sigil",
  "bash-nul-poison",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "quota-spawn-cascade",
  "layer-tree-walk",
  "latin1-edit-wipe",
  "home-bind-overreach",
  "unsealed",
  "breathing",
  "open-vault",
  "intact",
  "undone",
  "open-latch",
  "stayed-off",
  "withheld",
  "open-span",
  "linked",
  "moored",
  "joined",
  "bipartite",
  "moiety",
  "indenture",
  "current",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "fibula",
  "cockade",
  "hasp",
  "snib",
  "bulla",
  "livery",
  "mondegreen",
  "diplopia",
  "fulcrum",
  "followspot",
  "tocsin",
  "carillon",
  "knell",
  "larum",
  "palinode",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "palilalia"),
);

export const FEATURED_ISSUE = 94041;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94041";
export const TITLE =
  "Native /goal Stop hook re-fires indefinitely with no way to acknowledge a hold";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:linux",
  "area:hooks",
]);
export const PLATFORM = "linux";
export const SURFACE = "goal-stop-refire";
export const HOST = "Claude Code CLI native /goal Stop hook";
export const CHECKED_ON =
  "Claude Code CLI ≥2.1.258 through 2.1.26x; Linux (Fedora 44) + other Linux; tmux-hosted; fresh and resumed-after-compaction; subscription and API key; independent of model";
export const BUILD = "≥2.1.258 through 2.1.26x";
export const SELECTED_MODEL = "independent of model";
export const OS = "linux";
export const PHRASE = "Score palilalia or admit silenced.";
export const DISTRIBUTION =
  "A session-scoped /goal Stop hook can re-fire indefinitely with unchanged or stale text, even after the assistant provides verifiable evidence the condition is met, or after the session enters a deliberate hold. Only the built-in repeated-block safety valve ends the loop (\"A hook blocked the turn from ending 9 consecutive times\"), and the pattern resumes on a later turn. Observed in four sessions / two triggers: (1) Deliberate hold while waiting on scheduled context compaction — live /goal re-fired ≥9 consecutive times with same holding text until safety valve. (2) Ordinary autonomous work — /goal re-fired ≥21 consecutive times quoting a stale multi-part goal; two in-transcript corrections citing concrete evidence of completion did not change the re-fired text. Expected: evaluator recognizes live transcript evidence condition is met, OR supported way to acknowledge intentional hold (e.g. in-flight compaction) without unbounded re-fire. Env: Claude Code CLI ≥2.1.258 through 2.1.26x; Linux (Fedora 44) + other Linux; tmux-hosted; fresh and resumed-after-compaction; subscription and API key. Independent of model. Local Stop hooks ruled out (each exits cleanly). No crash — only signal is identical re-fire then safety valve.";

export const RULED_OUT = Object.freeze([
  "Sepulchre/#94055 bash-nul-poison — NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss, not Stop-hook re-fire",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span after auto-update",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed after git branch -m",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title cache",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive session stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Cartouche/#93772 section-poster — wrong diagram type",
  "Nullarbor/#93595 empty-expand path — different defect",
  "Sigil — hollow thinking seal; different paradigm",
  "Anarthria/#93782 dictation-paste-drop — ENT / voice-clinic paste drop, not Stop-hook re-fire",
  "Tocsin / Carillon / Knell / Larum / Palinode — different paradigms",
]);
export const EXPECTED = Object.freeze([
  "Evaluator recognizes live transcript evidence the condition is met",
  "Or a supported way to acknowledge an intentional hold (e.g. in-flight compaction) without unbounded re-fire",
  "A hold while waiting on scheduled context compaction must not re-fire ≥9 consecutive times with the same holding text",
  "In-transcript corrections citing concrete evidence of completion must change the re-fired text",
  "The repeated-block safety valve must not be the only way the loop ends; the pattern must not resume on a later turn",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "nine-consecutive",
    label: "nine consecutive",
    count: "≥9 consecutive",
    note: "Deliberate hold while waiting on scheduled context compaction — live /goal re-fired ≥9 consecutive times with same holding text until safety valve",
  },
  {
    id: "twenty-one-consecutive",
    label: "twenty-one consecutive",
    count: "≥21 consecutive",
    note: "Ordinary autonomous work — /goal re-fired ≥21 consecutive times quoting a stale multi-part goal",
  },
  {
    id: "safety-valve",
    label: "safety valve",
    count: "9 consecutive times",
    note: "A hook blocked the turn from ending 9 consecutive times — only the built-in repeated-block safety valve ends the loop",
  },
  {
    id: "evidence-ignored",
    label: "evidence ignored",
    count: "two corrections",
    note: "Two in-transcript corrections citing concrete evidence of completion did not change the re-fired text",
  },
  {
    id: "no-acknowledge",
    label: "no acknowledge",
    count: "no hold signal",
    note: "No supported way to acknowledge an intentional hold (e.g. in-flight compaction) without unbounded re-fire",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "silenced-groove",
    survey:
      "groove stays silenced; stylus lifts; /goal does not re-fire; hold is acknowledged",
    kind: "silenced",
    note: "idle: silenced — the hold/good path",
  },
  {
    id: "hold-compaction",
    survey:
      "deliberate hold while waiting on scheduled context compaction; live /goal re-fires ≥9 consecutive times with same holding text",
    kind: "palilalia",
    note: "seeded: hold-compaction of the published repro",
  },
  {
    id: "goal-stop-refire",
    survey:
      "native /goal Stop hook re-fires indefinitely with unchanged or stale text; only the safety valve ends the loop",
    kind: "palilalia",
    note: "path: goal-stop-refire names the stuck groove",
  },
  {
    id: "stale-goal",
    survey:
      "ordinary autonomous work — /goal re-fires ≥21 consecutive times quoting a stale multi-part goal; two corrections ignored",
    kind: "palilalia",
    note: "seeded: stale-goal of the 21-consecutive walk",
  },
  {
    id: "palilalia",
    survey:
      "the booth is palilalia — the stylus will not lift; the same /goal text repeats until the safety valve",
    kind: "palilalia",
    note: "seeded: palilalia — Score palilalia or admit silenced.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "goal-stop-refire",
  "palilalia",
  "hold-compaction",
  "stale-goal",
  "nine-consecutive",
  "twenty-one-consecutive",
  "safety-valve",
  "evidence-ignored",
  "no-acknowledge",
]);

export const COUSINS = Object.freeze([
  {
    issue: 82546,
    title: "/goal at compact boundary never starts its turn",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /goal at compact boundary never starts its turn. Different defect. Do not conflate with unbounded Stop-hook re-fire after a hold.",
  },
  {
    issue: 83266,
    title: "/goal Stop hook skipped while background task live, never re-evaluated",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /goal Stop hook skipped while background task live, never re-evaluated. Opposite skip, not unbounded re-fire.",
  },
  {
    issue: 78121,
    title: "Stop hook re-fires despite stop_hook_active: true",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — Stop hook re-fires despite stop_hook_active: true. Closed cousin. Different signal. Do not conflate.",
  },
  {
    issue: 91601,
    title: "Stop-hook goal-condition re-fires identically forever ignoring stand-down",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — Stop-hook goal-condition re-fires identically forever ignoring stand-down. Closed cousin. Adjacent stand-down shape; not this native /goal hold-acknowledge gap.",
  },
  {
    issue: 92242,
    title: "/goal Stop hook re-fires after user accepts blocked outcome",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /goal Stop hook re-fires after user accepts blocked outcome. Different acceptance path. Do not conflate.",
  },
  {
    issue: 93744,
    title: "/goal evaluator cannot see instruction via /goal, loops until unachievable",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — /goal evaluator cannot see instruction via /goal, loops until unachievable. Visibility gap, not hold-acknowledge / stale-text re-fire.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94040, title: "backup #94040", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "nullarbor",
  "sigil",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "tocsin",
  "carillon",
  "knell",
  "larum",
  "palinode",
]);

export const SAMPLE_KIND_IDLE = "lifted-stylus";
export const SAMPLE_KIND_SEEDED = "goal-stop-refire";
export const SAMPLE_HOLDING_IDLE = "once";
export const SAMPLE_HOLDING_SEEDED = "stuck-groove";

export const SAMPLE_SILENCED_PROOF = Object.freeze({
  silenced: true,
  palilalia: false,
  goalStopRefire: false,
  holdCompaction: false,
  staleGoal: false,
  nineConsecutive: false,
  twentyOneConsecutive: false,
  safetyValve: false,
  evidenceIgnored: false,
  noAcknowledge: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_PALILALIA_PROOF = Object.freeze({
  silenced: false,
  palilalia: true,
  goalStopRefire: true,
  holdCompaction: true,
  staleGoal: true,
  nineConsecutive: true,
  twentyOneConsecutive: true,
  safetyValve: true,
  evidenceIgnored: true,
  noAcknowledge: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds silenced: stylus lifts; /goal does not re-fire; hold is acknowledged" },
  { t: "hold-compaction", line: "deliberate hold while waiting on scheduled context compaction; live /goal re-fires ≥9 consecutive times with same holding text" },
  { t: "stale-goal", line: "ordinary autonomous work — /goal re-fires ≥21 consecutive times quoting a stale multi-part goal; two corrections ignored" },
  { t: "path", line: "goal-stop-refire — native /goal Stop hook re-fires indefinitely; only the safety valve ends the loop" },
  { t: "score", line: "when the stylus will not lift the booth is palilalia — Score palilalia or admit silenced." },
]);

/**
 * Groove map: silenced lifted-stylus vs stuck palilalia.
 * Idle/silenced: stylus lifts; /goal does not re-fire; hold acknowledged.
 * Seeded/palilalia: stylus stays in the groove; same /goal text repeats.
 */
export function mapGroove(input = {}) {
  const palilalia = isPalilaliaInput(input);
  const silenced = input.silenced === true && !palilalia;
  return {
    stamp: palilalia ? "goal-stop-refire" : "silenced-groove",
    holdingLane: palilalia ? "stuck-groove" : "once",
    kindLane: palilalia ? "goal-stop-refire" : "lifted-stylus",
    bindLane: palilalia ? "no-acknowledge" : "acknowledged",
    ribbon: palilalia ? "palilalia" : "silenced",
    silenced,
  };
}

export function inspectGroove(input = {}) {
  const stuck = isPalilaliaInput(input);
  if (input.silenced === true && !stuck) {
    return {
      stamp: "stylus-lifted",
      stuck: false,
    };
  }
  return {
    stamp: stuck ? "stylus-stuck" : "groove-idle",
    stuck,
    note: stuck
      ? "the phonograph groove will not lift — native /goal Stop hook re-fires the same text until the safety valve"
      : "",
  };
}

export function inspectRefire(input = {}) {
  const repeating =
    input.nineConsecutive === true ||
    input.twentyOneConsecutive === true ||
    input.goalStopRefire === true ||
    input.palilalia === true;
  if (input.silenced === true && !repeating) {
    return {
      stamp: "refire-absent",
      repeating: false,
    };
  }
  return {
    stamp: repeating ? "goal-stop-refire" : "refire-idle",
    repeating,
    note: repeating
      ? "live /goal re-fired ≥9 consecutive times (hold) or ≥21 consecutive times (stale multi-part goal)"
      : "",
  };
}

export function inspectHold(input = {}) {
  const unacked =
    input.holdCompaction === true ||
    input.noAcknowledge === true ||
    input.palilalia === true;
  if (input.silenced === true && !unacked) {
    return {
      stamp: "hold-acknowledged",
      unacked: false,
    };
  }
  return {
    stamp: unacked ? "no-acknowledge" : "hold-idle",
    unacked,
    note: unacked
      ? "no supported way to acknowledge an intentional hold (e.g. in-flight compaction) without unbounded re-fire"
      : "",
  };
}

export function inspectEvidence(input = {}) {
  const ignored =
    input.evidenceIgnored === true ||
    input.staleGoal === true ||
    input.palilalia === true;
  if (input.silenced === true && !ignored) {
    return {
      stamp: "evidence-read",
      ignored: false,
    };
  }
  return {
    stamp: ignored ? "evidence-ignored" : "evidence-idle",
    ignored,
    note: ignored
      ? "two in-transcript corrections citing concrete evidence of completion did not change the re-fired text"
      : "",
  };
}

export function inspectValve(input = {}) {
  const tripped =
    input.safetyValve === true ||
    input.nineConsecutive === true ||
    input.palilalia === true;
  if (input.silenced === true && !tripped) {
    return {
      stamp: "valve-quiet",
      tripped: false,
    };
  }
  return {
    stamp: tripped ? "safety-valve" : "valve-idle",
    tripped,
    note: tripped
      ? "A hook blocked the turn from ending 9 consecutive times — only the repeated-block safety valve ends the loop; the pattern resumes later"
      : "",
  };
}

function isPalilaliaInput(input = {}) {
  return (
    input.palilalia === true ||
    input.goalStopRefire === true ||
    input.holdCompaction === true ||
    input.staleGoal === true ||
    input.nineConsecutive === true ||
    input.twentyOneConsecutive === true ||
    input.safetyValve === true ||
    input.evidenceIgnored === true ||
    input.noAcknowledge === true
  );
}

export function readBooth(input = {}) {
  const palilalia = isPalilaliaInput(input);
  const silenced = input.silenced === true && !palilalia;
  return {
    mark: palilalia ? "palilalia" : silenced || !palilalia ? "silenced" : "palilalia",
    silenced,
    palilalia,
    goalStopRefire: input.goalStopRefire === true || palilalia,
    holdCompaction: input.holdCompaction === true,
    staleGoal: input.staleGoal === true,
    nineConsecutive: input.nineConsecutive === true,
    twentyOneConsecutive: input.twentyOneConsecutive === true,
    safetyValve: input.safetyValve === true,
    evidenceIgnored: input.evidenceIgnored === true,
    noAcknowledge: input.noAcknowledge === true,
    scope: mapGroove(input),
    groove: inspectGroove(input),
    refire: inspectRefire(input),
    holdInspect: inspectHold(input),
    evidence: inspectEvidence(input),
    valve: inspectValve(input),
    log: input.log || [],
  };
}

export const PALILALIA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-silenced",
    silenced: true,
    palilalia: false,
    cue: "silenced",
    note: "idle HOLD: stylus lifts; /goal does not re-fire; hold is acknowledged — the hold/good path",
  },
  {
    t: "hold-compaction",
    event: "hold-compaction",
    palilalia: true,
    holdCompaction: true,
    nineConsecutive: true,
    cue: "palilalia",
    note: "deliberate hold while waiting on scheduled context compaction; live /goal re-fires ≥9 consecutive times with same holding text",
  },
  {
    t: "stale-goal",
    event: "stale-goal",
    palilalia: true,
    staleGoal: true,
    twentyOneConsecutive: true,
    evidenceIgnored: true,
    cue: "palilalia",
    note: "ordinary autonomous work — /goal re-fires ≥21 consecutive times quoting a stale multi-part goal; two corrections ignored",
  },
  {
    t: "path",
    event: "goal-stop-refire",
    palilalia: true,
    goalStopRefire: true,
    safetyValve: true,
    noAcknowledge: true,
    cue: "palilalia",
    note: "goal-stop-refire — native /goal Stop hook re-fires indefinitely; only the safety valve ends the loop",
  },
  {
    t: "score",
    event: "palilalia",
    palilalia: true,
    goalStopRefire: true,
    holdCompaction: true,
    staleGoal: true,
    nineConsecutive: true,
    twentyOneConsecutive: true,
    safetyValve: true,
    evidenceIgnored: true,
    noAcknowledge: true,
    cue: "palilalia",
    note: "palilalia — when the stylus will not lift the booth is palilalia",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-silenced",
    silenced: true,
    palilalia: false,
    cue: "silenced",
    note: "positive control: stylus lifts; /goal does not re-fire",
  },
  {
    t: "announce",
    event: "cue-silenced",
    silenced: true,
    cue: "silenced",
    note: "positive control: the groove stays silenced",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    silenced: true,
    palilalia: false,
    goalStopRefire: false,
    cue: "silenced",
  };
}

export function seedSilenced() {
  return { ...emptyTicket() };
}

export function seedPalilalia() {
  return {
    seed: SEEDED_WORD,
    silenced: false,
    palilalia: true,
    goalStopRefire: true,
    holdCompaction: true,
    staleGoal: true,
    nineConsecutive: true,
    twentyOneConsecutive: true,
    safetyValve: true,
    evidenceIgnored: true,
    noAcknowledge: true,
    cue: "palilalia",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_PALILALIA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    palilalia: true,
    goalStopRefire: true,
    nineConsecutive: true,
    cue: "palilalia",
  };
}

export function seedGoalStopRefire() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    palilalia: true,
    goalStopRefire: true,
    safetyValve: true,
    event: "goal-stop-refire",
    cue: "palilalia",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    silenced: true,
    cue: "silenced",
  };
}

export function seedAcknowledged() {
  return {
    seed: "acknowledged",
    preferSeed: true,
    silenced: true,
    cue: "silenced",
  };
}

export function seedStoodDown() {
  return {
    seed: "stood-down",
    preferSeed: true,
    silenced: true,
    cue: "silenced",
  };
}

export function seedMet() {
  return {
    seed: "met",
    preferSeed: true,
    silenced: true,
    cue: "silenced",
  };
}

export function seedOnce() {
  return {
    seed: "once",
    preferSeed: true,
    silenced: true,
    cue: "silenced",
  };
}

export function seedHoldCompaction() {
  return {
    seed: "hold-compaction",
    preferSeed: true,
    holdCompaction: true,
    cue: "palilalia",
  };
}

export function seedStaleGoal() {
  return {
    seed: "stale-goal",
    preferSeed: true,
    staleGoal: true,
    cue: "palilalia",
  };
}

export function seedNineConsecutive() {
  return {
    seed: "nine-consecutive",
    preferSeed: true,
    nineConsecutive: true,
    cue: "palilalia",
  };
}

export function seedTwentyOneConsecutive() {
  return {
    seed: "twenty-one-consecutive",
    preferSeed: true,
    twentyOneConsecutive: true,
    cue: "palilalia",
  };
}

export function seedSafetyValve() {
  return {
    seed: "safety-valve",
    preferSeed: true,
    safetyValve: true,
    cue: "palilalia",
  };
}

export function seedEvidenceIgnored() {
  return {
    seed: "evidence-ignored",
    preferSeed: true,
    evidenceIgnored: true,
    cue: "palilalia",
  };
}

export function seedNoAcknowledge() {
  return {
    seed: "no-acknowledge",
    preferSeed: true,
    noAcknowledge: true,
    cue: "palilalia",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      silenced: false,
      palilalia: false,
      goalStopRefire: false,
      holdCompaction: false,
      staleGoal: false,
      nineConsecutive: false,
      twentyOneConsecutive: false,
      safetyValve: false,
      evidenceIgnored: false,
      noAcknowledge: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    silenced: raw.silenced === true,
    palilalia: raw.palilalia === true || raw.event === "palilalia",
    goalStopRefire:
      raw.goalStopRefire === true || raw.event === "goal-stop-refire",
    holdCompaction:
      raw.holdCompaction === true || raw.event === "hold-compaction",
    staleGoal: raw.staleGoal === true || raw.event === "stale-goal",
    nineConsecutive:
      raw.nineConsecutive === true || raw.event === "nine-consecutive",
    twentyOneConsecutive:
      raw.twentyOneConsecutive === true ||
      raw.event === "twenty-one-consecutive",
    safetyValve: raw.safetyValve === true || raw.event === "safety-valve",
    evidenceIgnored:
      raw.evidenceIgnored === true || raw.event === "evidence-ignored",
    noAcknowledge:
      raw.noAcknowledge === true || raw.event === "no-acknowledge",
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
      (ticket.silenced != null ||
        ticket.palilalia != null ||
        ticket.goalStopRefire != null ||
        ticket.holdCompaction != null ||
        ticket.staleGoal != null ||
        ticket.nineConsecutive != null ||
        ticket.twentyOneConsecutive != null ||
        ticket.safetyValve != null ||
        ticket.evidenceIgnored != null ||
        ticket.noAcknowledge != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isSilenced(row) {
  if (row.palilalia && row.cue !== "silenced") return false;
  if (row.cue === "palilalia" || row.cue === "goal-stop-refire") {
    return false;
  }
  if (
    row.goalStopRefire &&
    row.safetyValve &&
    row.cue !== "silenced" &&
    row.silenced !== true
  ) {
    return false;
  }
  if (row.silenced === true && row.palilalia !== true && row.cue !== "palilalia") {
    return true;
  }
  if (
    row.cue === "silenced" &&
    row.palilalia !== true &&
    row.goalStopRefire !== true &&
    row.holdCompaction !== true &&
    row.staleGoal !== true &&
    row.nineConsecutive !== true &&
    row.twentyOneConsecutive !== true &&
    row.safetyValve !== true &&
    row.evidenceIgnored !== true &&
    row.noAcknowledge !== true
  ) {
    return true;
  }
  return false;
}

function isGoalStopRefire(row) {
  return (
    row.event === "goal-stop-refire" &&
    !isSilenced(row) &&
    (row.goalStopRefire === true ||
      row.safetyValve === true ||
      row.noAcknowledge === true)
  );
}

function isPalilaliaRow(row) {
  if (isSilenced(row)) return false;
  if (isGoalStopRefire(row) && row.cue !== "palilalia") return false;
  if (row.cue === "palilalia") return true;
  if (row.palilalia === true) return true;
  if (row.goalStopRefire === true && row.safetyValve === true) {
    return true;
  }
  if (
    row.goalStopRefire === true ||
    row.holdCompaction === true ||
    row.staleGoal === true ||
    row.nineConsecutive === true ||
    row.twentyOneConsecutive === true ||
    row.safetyValve === true ||
    row.evidenceIgnored === true ||
    row.noAcknowledge === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one palilalia pass against the phonograph groove.
 * silenced: stylus lifts; /goal does not re-fire; hold acknowledged.
 * palilalia: stylus stays in the groove; same /goal text repeats.
 * goal-stop-refire: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isGoalStopRefire(row) ||
    (row.goalStopRefire && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "goal-stop-refire";
  } else if (isPalilaliaRow(row)) {
    verdict = "palilalia";
  } else if (isSilenced(row)) {
    verdict = "silenced";
  } else if (
    row.goalStopRefire ||
    row.holdCompaction ||
    row.staleGoal ||
    row.nineConsecutive ||
    row.twentyOneConsecutive ||
    row.safetyValve ||
    row.evidenceIgnored ||
    row.noAcknowledge
  ) {
    verdict = "palilalia";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const groove = inspectGroove(row);
  const refire = inspectRefire(row);
  const holdInspect = inspectHold(row);
  const evidence = inspectEvidence(row);
  const valve = inspectValve(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    silenced: verdict === "silenced" || verdict === "hold",
    palilalia: verdict === "palilalia" || verdict === SEEDED_WORD,
    goalStopRefire:
      row.goalStopRefire === true ||
      verdict === "goal-stop-refire" ||
      verdict === PATH_WORD,
    holdCompaction: row.holdCompaction,
    staleGoal: row.staleGoal,
    nineConsecutive: row.nineConsecutive,
    twentyOneConsecutive: row.twentyOneConsecutive,
    safetyValve: row.safetyValve,
    evidenceIgnored: row.evidenceIgnored,
    noAcknowledge: row.noAcknowledge,
    cue: hold
      ? "silenced"
      : row.goalStopRefire || verdict === "goal-stop-refire"
        ? "goal-stop-refire"
        : "palilalia",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit silenced" : "score palilalia",
    grooveInspect: groove,
    refireInspect: refire,
    holdInspect,
    evidenceInspect: evidence,
    valveInspect: valve,
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
      : PALILALIA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const stuck = scored.filter((row) => row.verdict === "palilalia");
  const path = scored.filter((row) => row.verdict === "goal-stop-refire");
  const silenced = scored.filter((row) => row.verdict === "silenced");
  const headline =
    scored.find((row) => row.event === "palilalia") ||
    scored.find((row) => row.event === "goal-stop-refire") ||
    scored.find((row) => row.event === "stale-goal") ||
    stuck[stuck.length - 1];
  let verdict = "silenced";
  if (stuck.length) verdict = "palilalia";
  else if (path.length && !silenced.length) verdict = "goal-stop-refire";
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
    palilaliaCount: stuck.length,
    pathCount: path.length,
    silencedCount: silenced.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit silenced" : "score palilalia",
    note: headline
      ? "Native /goal Stop hook re-fires indefinitely with unchanged/stale text; only the repeated-block safety valve ends the loop. Cousins cite-only: #82546 #83266 #78121 #91601 #92242 #93744."
      : "published palilalia walk scored against silenced vs palilalia",
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
    seeded !== "silenced" &&
    seeded !== "palilalia" &&
    seeded !== "goal-stop-refire" &&
    ticket.silenced == null &&
    ticket.palilalia == null &&
    ticket.goalStopRefire == null &&
    ticket.safetyValve == null &&
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
    silenced: scored.silenced ?? false,
    palilalia: scored.palilalia ?? false,
    goalStopRefire: scored.goalStopRefire ?? false,
    holdCompaction: scored.holdCompaction ?? false,
    staleGoal: scored.staleGoal ?? false,
    nineConsecutive: scored.nineConsecutive ?? false,
    twentyOneConsecutive: scored.twentyOneConsecutive ?? false,
    safetyValve: scored.safetyValve ?? false,
    evidenceIgnored: scored.evidenceIgnored ?? false,
    noAcknowledge: scored.noAcknowledge ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.safetyValve || result.palilalia
      ? "kind=goal-stop-refire"
      : "kind=lifted-stylus",
    result.nineConsecutive || result.palilalia ? "ref=nine" : "ref=once",
    result.goalStopRefire || result.verdict === "goal-stop-refire"
      ? "path=goal-stop-refire"
      : "path=silenced",
    result.cue === "silenced"
      ? "cue=silenced"
      : result.cue === "goal-stop-refire"
        ? "cue=goal-stop-refire"
        : "cue=palilalia",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    silenced: result.silenced,
    palilalia: result.palilalia,
    goalStopRefire: result.goalStopRefire,
    holdCompaction: result.holdCompaction,
    staleGoal: result.staleGoal,
    nineConsecutive: result.nineConsecutive,
    twentyOneConsecutive: result.twentyOneConsecutive,
    safetyValve: result.safetyValve,
    evidenceIgnored: result.evidenceIgnored,
    noAcknowledge: result.noAcknowledge,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    groove: inspectGroove({
      silenced: result.silenced,
      palilalia: result.palilalia,
      goalStopRefire: result.goalStopRefire,
    }),
    refire: inspectRefire({
      silenced: result.silenced,
      palilalia: result.palilalia,
      nineConsecutive: result.nineConsecutive,
      twentyOneConsecutive: result.twentyOneConsecutive,
      goalStopRefire: result.goalStopRefire,
    }),
    holdInspect: inspectHold({
      silenced: result.silenced,
      palilalia: result.palilalia,
      holdCompaction: result.holdCompaction,
      noAcknowledge: result.noAcknowledge,
    }),
    evidence: inspectEvidence({
      silenced: result.silenced,
      palilalia: result.palilalia,
      evidenceIgnored: result.evidenceIgnored,
      staleGoal: result.staleGoal,
    }),
    valve: inspectValve({
      silenced: result.silenced,
      palilalia: result.palilalia,
      safetyValve: result.safetyValve,
      nineConsecutive: result.nineConsecutive,
    }),
    scope: mapGroove({
      silenced: result.silenced,
      palilalia: result.palilalia,
      goalStopRefire: result.goalStopRefire,
      holdCompaction: result.holdCompaction,
      staleGoal: result.staleGoal,
      nineConsecutive: result.nineConsecutive,
      twentyOneConsecutive: result.twentyOneConsecutive,
      safetyValve: result.safetyValve,
      evidenceIgnored: result.evidenceIgnored,
      noAcknowledge: result.noAcknowledge,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      palilalia: result.palilalia === true || result.verdict === "palilalia",
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: prompt-type Stop hook evaluator does not re-read live transcript state when judging condition; no supported hold-acknowledge signal. Invite verify against #94041 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
