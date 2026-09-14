#!/usr/bin/env node
/**
 * Lictor — Roman lictor / fasces / magistrate-procession / wax-tablet
 * ledger / iron-rod bundle / curule-chair approach / torch-lit forum
 * aisle booth.
 *
 * Educational diagnostic model for a published Claude Code hook-surface
 * defect: changing the session model from the Claude desktop app
 * Code-tab model picker does NOT dispatch PreModelSwitch or
 * PostModelSwitch hooks. CLI /model in a TUI session DOES dispatch
 * both, same hook config, same machine. Desktop binary contains the
 * dispatch symbols and the UI string `Running PreModelSwitch hooks…`,
 * but the picker changes the model without entering that code path.
 * Other hooks (SessionStart, UserPromptSubmit, PreToolUse,
 * SubagentStart, Stop) fire normally in the same desktop sessions.
 * Impact: PreModelSwitch can block switches (cost/policy/audit);
 * desktop picker silently bypasses — no error, no log row.
 *
 * Encoded from anthropics/claude-code#94053 issue text only.
 * Hypothesis (NON-BINDING): the desktop Code-tab model picker applies
 * the session model without entering the hook-dispatch path that CLI
 * /model uses, even though the desktop binary contains the symbols
 * and the `Running PreModelSwitch hooks…` string. Invite verify
 * against issue text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a fix. No network. No
 * exploits. No live Claude.
 *
 *   node lictor.mjs data/lictor.json
 *   echo '{"seed":"lictor"}' | node lictor.mjs
 *
 * Idle word is attested (HOLD: hooks fired in order; Pre then Post
 * rows written; policy gate held).
 * HOLD aliases: heralded, preceded, dispatched, logged, bound.
 * Seeded word is lictor (#94053 — the picker-bypass path).
 * Path word is picker-bypass.
 * Product score word is lictor (Score lictor or admit attested.).
 *
 * NOT Proscription/#94202. NOT Rescript/#93742. NOT Changeling/#93757.
 * NOT Lychgate/#94059. NOT Ouster/#94221. NOT Thimblerig. NOT
 * Fetchling. NOT Souffleur. NOT Epitome. NOT Diabolica. NOT
 * Sallyport. NOT Palilalia. NOT Sepulchre. NOT Sneck. NOT Drawbridge.
 * NOT Interdict. NOT Veto. NOT Wicket. NOT Postern. NOT Airlock.
 * NOT Ratchet. NOT Greenroom.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * CLI /model is the working control (same hooks, same machine).
 * #93742 — Rescript: /model save-as-default wipes settings.json.
 * #93757 — Changeling: remote reconnect reinjects default model.
 * #90817 — model-conditional plugins/hooks (enhancement; different).
 * #93919 — export model id / PostModelSwitch sidecar (enhancement).
 * #91767 — hook payloads missing model field (enhancement).
 * Lictor is specifically desktop picker bypasses Pre/PostModelSwitch
 * while CLI /model dispatches both.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "attested",
  "lictor",
  "picker-bypass",
  "hold",
  "heralded",
  "preceded",
  "dispatched",
  "logged",
  "bound",
  "pre-model-switch",
  "post-model-switch",
  "desktop-picker",
  "cli-model",
  "zero-rows",
  "silent-bypass",
  "policy-gate",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "attested";
export const PATH_WORD = "picker-bypass";
export const SEEDED_WORD = "lictor";
export const PRODUCT_WORD = "lictor";
export const HOLD = Object.freeze(["attested", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "heralded",
  "preceded",
  "dispatched",
  "logged",
  "bound",
]);
export const RECOVER = Object.freeze(["attested", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "reaped",
  "tenanted",
  "barred",
  "additive",
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
  "vested",
  "plenary",
  "equalized",
  "legible",
  "calibrated",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "sighted",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "interdict",
  "veto",
  "wicket",
  "postern",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "interdict",
  "veto",
  "wicket",
  "postern",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
]);

export const FEATURED_ISSUE = 94053;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94053";
export const TITLE =
  "Desktop app model picker does not dispatch PreModelSwitch/PostModelSwitch hooks (CLI /model does)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:hooks",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "picker-bypass";
export const HOST =
  "macOS Darwin 25.4.0 arm64; Desktop Claude.app 1.52386.3; desktop-bundled Claude Code 2.1.266; CLI 2.1.258";
export const CHECKED_ON =
  "Desktop Claude.app 1.52386.3; desktop-bundled Claude Code 2.1.266; CLI 2.1.258; hooks in ~/.claude/settings.json empty matcher; builds above 2.1.251 minimum for these events.";
export const BUILD =
  "Desktop Claude.app 1.52386.3 / bundled Claude Code 2.1.266 / CLI 2.1.258 (macOS Darwin 25.4.0 arm64)";
export const SELECTED_MODEL = "claude-sonnet-5 → claude-haiku-4-5-20251001";
export const OS = "macOS Darwin 25.4.0 arm64";
export const PHRASE = "Score lictor or admit attested.";
export const DISTRIBUTION =
  "Changing the session model from the Claude desktop app Code-tab model picker does NOT dispatch PreModelSwitch or PostModelSwitch hooks. CLI /model in a TUI session DOES dispatch both, same hook config, same machine. Desktop binary contains the dispatch symbols and the UI string `Running PreModelSwitch hooks…`, but the picker changes the model without entering that code path. Other hooks (SessionStart, UserPromptSubmit, PreToolUse, SubagentStart, Stop) fire normally in the same desktop sessions. During the second picker switch alone, 66 rows were written across nine concurrent sessions — only the two model-switch events are missing. Two separate desktop picker changes produced zero rows for either event. CLI positive control: TUI shows `Running PreModelSwitch hooks… (Esc to cancel)` then both hooks write Pre then Post rows in the same second (from=claude-sonnet-5 to=claude-haiku-4-5-20251001). Impact: PreModelSwitch can block switches (cost/policy/audit); desktop picker silently bypasses — no error, no log row. Env: macOS Darwin 25.4.0 arm64; Desktop Claude.app 1.52386.3; desktop-bundled Claude Code 2.1.266; CLI 2.1.258; hooks in ~/.claude/settings.json empty matcher; builds above 2.1.251 minimum for these events.";

export const RULED_OUT = Object.freeze([
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused; DIFFERENT",
  "Rescript/#93742 — /model save-as-default wipes ~/.claude/settings.json hooks; DIFFERENT",
  "Changeling/#93757 — remote reconnect reinjects the global default model; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running after exit; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Thimblerig — skill-row-carve; different carnival tally",
  "Fetchling — skill-dollar-swap; different coin-ledger",
  "Souffleur — app-switch-echo-loss; different prompt-corner",
  "Epitome — summarized-thinking-force; different scriptorium",
  "Diabolica — cannot-show-not-git; different parchment-court",
  "Sallyport — reminder-secret-bypass; different fortress gate",
  "Palilalia — goal-stop-refire; different phonograph groove",
  "Sepulchre — bash-nul-poison; different vault",
  "Sneck — chip-dismiss-ephemeral; different cottage latch",
  "Drawbridge — rc-bridge-update-drop; different span",
  "Interdict — different papal ban product",
  "Veto — different override product",
  "Wicket — different small-gate product",
  "Postern — different side-door product",
  "Airlock — different pressure-lock product",
  "Ratchet — different one-way gear product",
  "Greenroom — different waiting-room product",
]);
export const EXPECTED = Object.freeze([
  "Both surfaces dispatch PreModelSwitch before the switch is applied and PostModelSwitch after",
  "Hooks documentation: PreModelSwitch fires before Claude Code applies a model switch that you or a client requested",
  "CLI /model already writes Pre then Post rows in order in the same second",
  "Desktop Code-tab model picker must enter the same dispatch path (symbols and `Running PreModelSwitch hooks…` already exist in the desktop binary)",
  "PreModelSwitch must be able to block a switch (cost/policy/audit) on the desktop picker, not only on CLI /model",
  "A silent bypass with zero rows and no error is not an attested procession",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "pre-model-switch",
    label: "fasces raised",
    count: "PreModelSwitch before apply",
    note: "Lictor must raise the fasces before the magistrate sits",
  },
  {
    id: "post-model-switch",
    label: "fasces lowered",
    count: "PostModelSwitch after apply",
    note: "Lictor attests the seat after the switch is applied",
  },
  {
    id: "desktop-picker",
    label: "curule taken",
    count: "Code-tab picker, zero hook rows",
    note: "Desktop picker changes the model without entering the dispatch path",
  },
  {
    id: "zero-rows",
    label: "blank tablet",
    count: "n=2 picker changes, zero rows",
    note: "Neither Pre nor Post ever appeared from a desktop session",
  },
  {
    id: "silent-bypass",
    label: "no horn",
    count: "no error, no log row",
    note: "Policy gate never runs; nothing in any log indicates the control did not apply",
  },
  {
    id: "picker-bypass",
    label: "aisle walked past",
    count: "picker-bypass under the fasces",
    note: "Magistrate sits without the lictor; CLI path still attested",
  },
]);

export const PROCESSION_NAMES = Object.freeze([
  {
    id: "pre-model-switch",
    lost: "Desktop picker never fires PreModelSwitch before the switch is applied",
    control: "Lictor raises the fasces — PreModelSwitch writes its row first",
    story: "the rods stay bound; the herald never precedes",
  },
  {
    id: "post-model-switch",
    lost: "Desktop picker never fires PostModelSwitch after the switch is applied",
    control: "Lictor attests the seat — PostModelSwitch writes its row second",
    story: "the tablet stays blank after the chair is taken",
  },
  {
    id: "desktop-picker",
    lost: "Code-tab model picker changes the session model without the dispatch path",
    control: "Picker must enter the same path CLI /model already walks",
    story: "the magistrate sits from a side door, not the aisle",
  },
  {
    id: "zero-rows",
    lost: "Two hand picker changes produced zero rows for either event",
    control: "Pre then Post rows written in the same second, as the CLI does",
    story: "the wax tablet shows no Pre and no Post from the desk",
  },
  {
    id: "silent-bypass",
    lost: "No error and nothing in any log; policy never had a chance to block",
    control: "A blocked PreModelSwitch must be able to hold the chair",
    story: "the iron rods never close; the procession is not attested",
  },
  {
    id: "picker-bypass",
    lost: "Desktop picker silently bypasses Pre/PostModelSwitch; CLI /model still dispatches both",
    control: "Hooks fire in order on every surface that can change the model",
    story: "lictor — the chair is taken; the fasces were never raised",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "fasces-bundle",
    survey:
      "iron-rod bundle bound with brass; axe in the fasces; Pre then Post",
    kind: "attested",
    note: "idle: attested — the hold/good path",
  },
  {
    id: "wax-tablet",
    survey:
      "wax-tablet ledger; CLI writes Pre then Post; desktop writes zero rows",
    kind: "lictor",
    note: "seeded: blank tablet from the desk",
  },
  {
    id: "curule-chair",
    survey:
      "curule chair taken by the Code-tab picker without the lictor",
    kind: "lictor",
    note: "seeded: magistrate sits without the herald",
  },
  {
    id: "forum-aisle",
    survey:
      "torch-lit forum aisle; CLI walks the aisle; picker uses a side door",
    kind: "lictor",
    note: "seeded: aisle skipped",
  },
  {
    id: "iron-rods",
    survey:
      "policy gate — PreModelSwitch can block cost/policy/audit; picker silent",
    kind: "lictor",
    note: "seeded: rods never close",
  },
  {
    id: "procession-path",
    survey:
      "picker-bypass — desktop picker skips dispatch; CLI /model still attested",
    kind: "lictor",
    note: "path: picker-bypass names the skipped aisle",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "picker-bypass",
  "lictor",
  "pre-model-switch",
  "post-model-switch",
  "desktop-picker",
  "cli-model",
  "zero-rows",
  "silent-bypass",
  "policy-gate",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93742,
    title:
      "Rescript — /model save-as-default scrapes ~/.claude/settings.json so hooks vanish",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Rescript/#93742 is a settings wipe on /model save. Related model-switch surface, different defect (charter scraped, not picker skipping hook dispatch). Do not rebuild. Do not conflate.",
  },
  {
    issue: 93757,
    title:
      "Changeling — remote reconnect re-injects the global default model",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Changeling/#93757 is a remote reconnect that reinjects the default model. Related model-identity surface, different defect (heir swapped, not Pre/Post skipped). Do not rebuild. Do not conflate.",
  },
  {
    issue: 90817,
    title:
      "[FEATURE] Model-conditional configuration: enable plugins/hooks/skills per model",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #90817 asks for model-conditional plugins/hooks. Mentions PreModelSwitch/PostModelSwitch as existing but unable to toggle plugins. Enhancement, not the desktop picker dispatch gap. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93919,
    title:
      "[FEATURE] Export the resolved model id as an environment variable next to CLAUDE_EFFORT",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #93919 wants CLAUDE_CODE_MODEL on Bash/hook env; notes a PostModelSwitch sidecar does not cover sub-agents. Enhancement, not picker-bypass. Do not rebuild. Do not conflate.",
  },
  {
    issue: 91767,
    title:
      "[FEATURE] Add model, stop_reason, token usage and tool timing to hook payloads",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #91767 wants model on hook payloads. Related hook-surface, different ask (payload richness, not desktop picker skipping dispatch). Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151 Shift+PageUp/PageDown Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064 desktop full-disk find TCC prompts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94174, title: "backup #94174 /context skill-row-carve (already catalogued as Thimblerig)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "interdict",
  "veto",
  "wicket",
  "postern",
  "airlock",
  "ratchet",
  "greenroom",
  "rescript",
  "changeling",
]);

export const SAMPLE_KIND_IDLE = "heralded";
export const SAMPLE_KIND_SEEDED = "picker-bypass";
export const SAMPLE_HOLDING_IDLE = "dispatched";
export const SAMPLE_HOLDING_SEEDED = "desktop-picker";

export const SAMPLE_ATTESTED_PROOF = Object.freeze({
  attested: true,
  lictor: false,
  pickerBypass: false,
  preModelSwitch: false,
  postModelSwitch: false,
  desktopPicker: false,
  cliModel: false,
  zeroRows: false,
  silentBypass: false,
  policyGate: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_LICTOR_PROOF = Object.freeze({
  attested: false,
  lictor: true,
  pickerBypass: true,
  preModelSwitch: true,
  postModelSwitch: true,
  desktopPicker: true,
  cliModel: true,
  zeroRows: true,
  silentBypass: true,
  policyGate: true,
  kind: SAMPLE_KIND_SEEDED,
  names: PROCESSION_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds attested: hooks fired in order; Pre then Post rows written; policy gate held" },
  { t: "cli", line: "CLI /model dispatches both; TUI shows Running PreModelSwitch hooks…" },
  { t: "picker", line: "desktop Code-tab picker changes the model; zero rows for either event" },
  { t: "path", line: "picker-bypass — symbols present; dispatch path never entered" },
  { t: "score", line: "when the chair is taken and the tablet stays blank the booth is lictor — Score lictor or admit attested." },
]);

const FORCE_FLAGS = [
  "pickerBypass",
  "preModelSwitch",
  "postModelSwitch",
  "desktopPicker",
  "zeroRows",
  "silentBypass",
  "policyGate",
];

/**
 * Forum map: attested aisle vs lictor picker-bypass.
 * Idle/attested: hooks fired in order; Pre then Post; policy gate held.
 * Seeded/lictor: desktop picker changes the model without dispatch.
 */
export function mapForum(input = {}) {
  const lictor = isLictorInput(input);
  const attested = input.attested === true && !lictor;
  return {
    stamp: lictor ? "picker-bypass" : "attested-aisle",
    holdingLane: lictor ? "desktop-picker" : "dispatched",
    kindLane: lictor ? "picker-bypass" : "heralded",
    bindLane: lictor ? "zero-rows" : "logged",
    ribbon: lictor ? "lictor" : "attested",
    attested,
  };
}

export function inspectFasces(input = {}) {
  const bypassed = isLictorInput(input);
  if (input.attested === true && !bypassed) {
    return {
      stamp: "fasces-raised",
      bypassed: false,
      note: "iron rods bound; Pre then Post attested",
    };
  }
  return {
    stamp: bypassed ? "fasces-unraised" : "fasces-idle",
    bypassed,
    note: bypassed
      ? "fasces never raised — PreModelSwitch did not precede the chair"
      : "",
  };
}

export function inspectLedger(input = {}) {
  const blank =
    input.zeroRows === true ||
    input.lictor === true ||
    isLictorInput(input);
  if (input.attested === true && !blank) {
    return {
      stamp: "tablet-attested",
      blank: false,
    };
  }
  return {
    stamp: blank ? "tablet-blank" : "tablet-idle",
    blank,
    note: blank
      ? "wax tablet shows zero Pre/Post rows from the desktop picker"
      : "",
  };
}

export function inspectChair(input = {}) {
  const taken = isLictorInput(input);
  if (input.attested === true && !taken) {
    return {
      stamp: "chair-attested",
      taken: false,
      edge: "dispatched",
    };
  }
  return {
    stamp: taken ? "chair-taken" : "chair-idle",
    taken,
    edge: taken ? "desktop-picker" : "dispatched",
    note: taken
      ? "curule chair taken by the Code-tab picker; lictor never preceded"
      : "",
  };
}

export function inspectAisle(input = {}) {
  const skipped =
    input.desktopPicker === true ||
    input.lictor === true ||
    isLictorInput(input);
  if (input.attested === true && !skipped) {
    return {
      stamp: "aisle-walked",
      skipped: false,
    };
  }
  return {
    stamp: skipped ? "aisle-skipped" : "aisle-idle",
    skipped,
    note: skipped
      ? "torch-lit aisle skipped — picker used a side door"
      : "",
  };
}

export function inspectRods(input = {}) {
  const open =
    input.silentBypass === true ||
    input.policyGate === true ||
    input.zeroRows === true ||
    (input.lictor === true && input.silentBypass !== false);
  if (input.attested === true && !open) {
    return {
      stamp: "rods-held",
      open: false,
    };
  }
  if (input.silentBypass === true || input.policyGate === true || input.zeroRows === true) {
    return {
      stamp: "rods-open",
      open: true,
      note: "policy gate never ran — silent bypass, no error, no log row",
    };
  }
  return {
    stamp: open && isLictorInput(input) ? "rods-listed" : "rods-idle",
    open: false,
    note: "",
  };
}

export function inspectProcession(input = {}) {
  const bypassed =
    input.pickerBypass === true ||
    input.lictor === true ||
    isLictorInput(input);
  if (input.attested === true && !bypassed) {
    return {
      stamp: "procession-attested",
      bypassed: false,
    };
  }
  return {
    stamp: bypassed ? "procession-bypassed" : "procession-idle",
    bypassed,
    note: bypassed
      ? "procession named picker-bypass — desktop picker never entered dispatch"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "pre-model-switch": input.preModelSwitch,
    "post-model-switch": input.postModelSwitch,
    "desktop-picker": input.desktopPicker,
    "zero-rows": input.zeroRows,
    "silent-bypass": input.silentBypass,
    "picker-bypass": input.pickerBypass,
  };
  return (
    map[id] === true ||
    input.pickerBypass === true ||
    input.lictor === true
  );
}

function isLictorInput(input = {}) {
  return (
    input.lictor === true ||
    input.pickerBypass === true ||
    input.preModelSwitch === true ||
    input.postModelSwitch === true ||
    input.desktopPicker === true ||
    input.zeroRows === true ||
    input.silentBypass === true ||
    input.policyGate === true
  );
}

export function readBooth(input = {}) {
  const lictor = isLictorInput(input);
  const attested = input.attested === true && !lictor;
  return {
    mark: lictor ? "lictor" : "attested",
    attested,
    lictor,
    pickerBypass: input.pickerBypass === true || lictor,
    preModelSwitch: input.preModelSwitch === true,
    postModelSwitch: input.postModelSwitch === true,
    desktopPicker: input.desktopPicker === true,
    cliModel: input.cliModel === true,
    zeroRows: input.zeroRows === true,
    silentBypass: input.silentBypass === true,
    policyGate: input.policyGate === true,
    scope: mapForum(input),
    fasces: inspectFasces(input),
    ledger: inspectLedger(input),
    chair: inspectChair(input),
    aisle: inspectAisle(input),
    rods: inspectRods(input),
    procession: inspectProcession(input),
    names: PROCESSION_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const LICTOR_WALK = Object.freeze([
  {
    t: "idle",
    event: "forum-attested",
    attested: true,
    lictor: false,
    cue: "attested",
    note: "idle HOLD: hooks fired in order; Pre then Post rows written; policy gate held — the hold/good path",
  },
  {
    t: "cli",
    event: "cli-model",
    lictor: true,
    cliModel: true,
    cue: "lictor",
    note: "CLI /model dispatches both; TUI shows Running PreModelSwitch hooks… then Pre then Post rows",
  },
  {
    t: "picker",
    event: "desktop-picker",
    lictor: true,
    desktopPicker: true,
    zeroRows: true,
    cue: "lictor",
    note: "desktop Code-tab picker changes the model; zero rows for either event",
  },
  {
    t: "path",
    event: "picker-bypass",
    lictor: true,
    pickerBypass: true,
    silentBypass: true,
    cue: "lictor",
    note: "picker-bypass — symbols present; dispatch path never entered; no error, no log row",
  },
  {
    t: "score",
    event: "lictor",
    lictor: true,
    pickerBypass: true,
    preModelSwitch: true,
    postModelSwitch: true,
    desktopPicker: true,
    cliModel: true,
    zeroRows: true,
    silentBypass: true,
    policyGate: true,
    cue: "lictor",
    note: "lictor — chair taken; tablet blank; fasces never raised; policy gate silent",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "forum-attested",
    attested: true,
    lictor: false,
    cue: "attested",
    note: "positive control: hooks fired in order; Pre then Post; policy gate held; the aisle is attested",
  },
  {
    t: "admit",
    event: "forum-attested",
    attested: true,
    cue: "attested",
    note: "positive control: the aisle admits attested",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    attested: true,
    lictor: false,
    pickerBypass: false,
    cue: "attested",
  };
}

export function seedAttested() {
  return { ...emptyTicket() };
}

export function seedLictor() {
  return {
    seed: SEEDED_WORD,
    attested: false,
    lictor: true,
    pickerBypass: true,
    preModelSwitch: true,
    postModelSwitch: true,
    desktopPicker: true,
    cliModel: true,
    zeroRows: true,
    silentBypass: true,
    policyGate: true,
    cue: "lictor",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_LICTOR_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lictor: true,
    pickerBypass: true,
    desktopPicker: true,
    cue: "lictor",
  };
}

export function seedPickerBypass() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lictor: true,
    pickerBypass: true,
    event: "picker-bypass",
    cue: "lictor",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedHeralded() {
  return {
    seed: "heralded",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedPreceded() {
  return {
    seed: "preceded",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedDispatched() {
  return {
    seed: "dispatched",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedLogged() {
  return {
    seed: "logged",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedBound() {
  return {
    seed: "bound",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedPreModelSwitch() {
  return {
    seed: "pre-model-switch",
    preferSeed: true,
    preModelSwitch: true,
    cue: "lictor",
  };
}

export function seedPostModelSwitch() {
  return {
    seed: "post-model-switch",
    preferSeed: true,
    postModelSwitch: true,
    cue: "lictor",
  };
}

export function seedDesktopPicker() {
  return {
    seed: "desktop-picker",
    preferSeed: true,
    desktopPicker: true,
    cue: "lictor",
  };
}

export function seedCliModel() {
  return {
    seed: "cli-model",
    preferSeed: true,
    cliModel: true,
    cue: "lictor",
  };
}

export function seedZeroRows() {
  return {
    seed: "zero-rows",
    preferSeed: true,
    zeroRows: true,
    cue: "lictor",
  };
}

export function seedSilentBypass() {
  return {
    seed: "silent-bypass",
    preferSeed: true,
    silentBypass: true,
    zeroRows: true,
    cue: "lictor",
  };
}

export function seedPolicyGate() {
  return {
    seed: "policy-gate",
    preferSeed: true,
    policyGate: true,
    cue: "lictor",
  };
}

export function seedClosed() {
  return {
    seed: "closed",
    preferSeed: true,
    cue: "attested",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      attested: false,
      lictor: false,
      pickerBypass: false,
      preModelSwitch: false,
      postModelSwitch: false,
      desktopPicker: false,
      cliModel: false,
      zeroRows: false,
      silentBypass: false,
      policyGate: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    attested: raw.attested === true,
    lictor: raw.lictor === true || raw.event === "lictor",
    pickerBypass:
      raw.pickerBypass === true || raw.event === "picker-bypass",
    preModelSwitch:
      raw.preModelSwitch === true ||
      raw.event === "pre-model-switch",
    postModelSwitch:
      raw.postModelSwitch === true ||
      raw.event === "post-model-switch",
    desktopPicker:
      raw.desktopPicker === true || raw.event === "desktop-picker",
    cliModel: raw.cliModel === true || raw.event === "cli-model",
    zeroRows: raw.zeroRows === true || raw.event === "zero-rows",
    silentBypass:
      raw.silentBypass === true || raw.event === "silent-bypass",
    policyGate: raw.policyGate === true || raw.event === "policy-gate",
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
      (ticket.attested != null ||
        ticket.lictor != null ||
        ticket.pickerBypass != null ||
        ticket.preModelSwitch != null ||
        ticket.postModelSwitch != null ||
        ticket.desktopPicker != null ||
        ticket.cliModel != null ||
        ticket.zeroRows != null ||
        ticket.silentBypass != null ||
        ticket.policyGate != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isAttested(row) {
  if (row.lictor && row.cue !== "attested") return false;
  if (row.cue === "lictor" || row.cue === "picker-bypass") {
    return false;
  }
  if (
    row.pickerBypass &&
    row.desktopPicker &&
    row.cue !== "attested" &&
    row.attested !== true
  ) {
    return false;
  }
  if (
    row.attested === true &&
    row.lictor !== true &&
    row.cue !== "lictor"
  ) {
    return true;
  }
  if (
    row.cue === "attested" &&
    row.lictor !== true &&
    row.pickerBypass !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isPickerBypass(row) {
  return (
    row.event === "picker-bypass" &&
    !isAttested(row) &&
    (row.pickerBypass === true ||
      row.desktopPicker === true ||
      row.lictor === true)
  );
}

function isLictorRow(row) {
  if (isAttested(row)) return false;
  if (isPickerBypass(row) && row.cue !== "lictor") return false;
  if (row.cue === "lictor") return true;
  if (row.lictor === true) return true;
  if (row.pickerBypass === true && row.desktopPicker === true) {
    return true;
  }
  if (
    row.pickerBypass === true ||
    row.preModelSwitch === true ||
    row.postModelSwitch === true ||
    row.desktopPicker === true ||
    row.zeroRows === true ||
    row.silentBypass === true ||
    row.policyGate === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one lictor pass against the wax tablet.
 * attested: hooks fired in order; Pre then Post; policy gate held.
 * lictor: desktop picker changes the model without dispatch.
 * picker-bypass: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPickerBypass(row) ||
    (row.pickerBypass &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "picker-bypass";
  } else if (isLictorRow(row)) {
    verdict = "lictor";
  } else if (isAttested(row)) {
    verdict = "attested";
  } else if (
    row.pickerBypass ||
    row.preModelSwitch ||
    row.postModelSwitch ||
    row.desktopPicker ||
    row.zeroRows ||
    row.silentBypass ||
    row.policyGate
  ) {
    verdict = "lictor";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const fasces = inspectFasces(row);
  const ledger = inspectLedger(row);
  const chair = inspectChair(row);
  const aisle = inspectAisle(row);
  const rods = inspectRods(row);
  const procession = inspectProcession(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    attested: verdict === "attested" || verdict === "hold",
    lictor: verdict === "lictor" || verdict === SEEDED_WORD,
    pickerBypass:
      row.pickerBypass === true ||
      verdict === "picker-bypass" ||
      verdict === PATH_WORD,
    preModelSwitch: row.preModelSwitch,
    postModelSwitch: row.postModelSwitch,
    desktopPicker: row.desktopPicker,
    cliModel: row.cliModel,
    zeroRows: row.zeroRows,
    silentBypass: row.silentBypass,
    policyGate: row.policyGate,
    cue: hold
      ? "attested"
      : row.pickerBypass || verdict === "picker-bypass"
        ? "picker-bypass"
        : "lictor",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit attested" : "score lictor",
    fascesInspect: fasces,
    ledgerInspect: ledger,
    chairInspect: chair,
    aisleInspect: aisle,
    rodsInspect: rods,
    processionInspect: procession,
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
      : LICTOR_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "lictor");
  const path = scored.filter((row) => row.verdict === "picker-bypass");
  const attested = scored.filter((row) => row.verdict === "attested");
  const headline =
    scored.find((row) => row.event === "lictor") ||
    scored.find((row) => row.event === "picker-bypass") ||
    scored.find((row) => row.event === "desktop-picker") ||
    charged[charged.length - 1];
  let verdict = "attested";
  if (charged.length) verdict = "lictor";
  else if (path.length && !attested.length) {
    verdict = "picker-bypass";
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
    lictorCount: charged.length,
    pathCount: path.length,
    attestedCount: attested.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit attested" : "score lictor",
    note: headline
      ? "Desktop picker bypasses Pre/PostModelSwitch. CLI /model still dispatches both. Cousins cite-only: #93742 #93757 #90817 #93919 #91767 — do not rebuild, do not conflate."
      : "published lictor walk scored against attested vs lictor",
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
    seeded !== "attested" &&
    seeded !== "lictor" &&
    seeded !== "picker-bypass" &&
    ticket.attested == null &&
    ticket.lictor == null &&
    ticket.pickerBypass == null &&
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
    attested: scored.attested ?? false,
    lictor: scored.lictor ?? false,
    pickerBypass: scored.pickerBypass ?? false,
    preModelSwitch: scored.preModelSwitch ?? false,
    postModelSwitch: scored.postModelSwitch ?? false,
    desktopPicker: scored.desktopPicker ?? false,
    cliModel: scored.cliModel ?? false,
    zeroRows: scored.zeroRows ?? false,
    silentBypass: scored.silentBypass ?? false,
    policyGate: scored.policyGate ?? false,
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
    result.desktopPicker || result.lictor
      ? "kind=picker-bypass"
      : "kind=heralded",
    result.zeroRows || result.lictor ? "ref=desktop-picker" : "ref=dispatched",
    result.pickerBypass || result.verdict === "picker-bypass"
      ? "path=picker-bypass"
      : "path=attested",
    result.cue === "attested"
      ? "cue=attested"
      : result.cue === "picker-bypass"
        ? "cue=picker-bypass"
        : "cue=lictor",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    attested: result.attested,
    lictor: result.lictor,
    pickerBypass: result.pickerBypass,
    preModelSwitch: result.preModelSwitch,
    postModelSwitch: result.postModelSwitch,
    desktopPicker: result.desktopPicker,
    cliModel: result.cliModel,
    zeroRows: result.zeroRows,
    silentBypass: result.silentBypass,
    policyGate: result.policyGate,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    fasces: inspectFasces({
      attested: result.attested,
      lictor: result.lictor,
      pickerBypass: result.pickerBypass,
    }),
    ledger: inspectLedger({
      attested: result.attested,
      lictor: result.lictor,
      pickerBypass: result.pickerBypass,
      zeroRows: result.zeroRows,
    }),
    chair: inspectChair({
      attested: result.attested,
      lictor: result.lictor,
      pickerBypass: result.pickerBypass,
    }),
    aisle: inspectAisle({
      attested: result.attested,
      lictor: result.lictor,
      desktopPicker: result.desktopPicker,
    }),
    rods: inspectRods({
      attested: result.attested,
      lictor: result.lictor,
      silentBypass: result.silentBypass,
      policyGate: result.policyGate,
      zeroRows: result.zeroRows,
    }),
    procession: inspectProcession({
      attested: result.attested,
      lictor: result.lictor,
      pickerBypass: result.pickerBypass,
    }),
    scope: mapForum({
      attested: result.attested,
      lictor: result.lictor,
      pickerBypass: result.pickerBypass,
      preModelSwitch: result.preModelSwitch,
      postModelSwitch: result.postModelSwitch,
      desktopPicker: result.desktopPicker,
      zeroRows: result.zeroRows,
      silentBypass: result.silentBypass,
      policyGate: result.policyGate,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      lictor: result.lictor === true || result.verdict === "lictor",
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
      names: PROCESSION_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the desktop Code-tab model picker applies the session model without entering the hook-dispatch path that CLI /model uses, even though the desktop binary contains the symbols and the `Running PreModelSwitch hooks…` string. Invite verify against #94053 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
