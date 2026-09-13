#!/usr/bin/env node
/**
 * Sneck — Northern cottage / workshop door / brass sneck-latch /
 * slate threshold / wool draft / iron latch plate / rain on the stoop.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * In 2.1.268 the VS Code extension replaced the current-file chip's
 * Hide toggle with an X. The changelog presents this as an improvement.
 * It removed the only working opt-out from IDE context auto-attach.
 * There is now no supported way — setting, command, keybinding, or
 * environment variable — to stop the active editor file and selection
 * from being injected into every prompt.
 *
 * From shipped webview/index.js in 2.1.270 (quoted in the issue):
 * the X calls dismissSelection(), which stores dismissedSelection, and
 * applySelectionUpdate() then suppresses re-attachment only while that
 * same file remains active. Dismissal is scoped per file, not per
 * session or conversation. Switch tabs and the chip returns. Switch
 * back and it returns again. A reference file kept open must be
 * dismissed every time focus returns. The Hide toggle held its state.
 * That is the regression. The indicator also moved from the status
 * line into the composer.
 *
 *   node sneck.mjs data/sneck.json
 *   echo '{"seed":"sneck"}' | node sneck.mjs
 *
 * Idle word is cleared (HOLD: undone / open-latch / stayed-off / withheld).
 * Seeded word is sneck (#94052 — the chip-dismiss-ephemeral path).
 * Path word is chip-dismiss-ephemeral.
 * Product score word is sneck (Score sneck or admit cleared.).
 *
 * Encoded from anthropics/claude-code#94052 issue text only.
 * Hypothesis (NON-BINDING): X/dismissSelection stores dismissedSelection
 * and applySelectionUpdate only suppresses re-attachment while the same
 * file remains active; dismissal is per-file not per-session, so a tab
 * switch clears the suppression and the chip re-latches. Invite verify
 * against #94052 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Drawbridge/#94049 (RC bridge auto-update drop).
 * NOT Chirograph/#94045 (worktree branch rename stale).
 * NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008.
 * NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954.
 * NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821.
 * NOT Oriel/#93809. NOT Fibula. NOT Cockade. NOT Hasp. NOT Snib
 * (medieval night-latch already shipped). NOT Bulla. NOT Livery.
 * NOT Mondegreen. NOT Diplopia. NOT Fulcrum. NOT Followspot.
 * Cousins cite-only: #82492 (no visible chip / confirmation),
 * #93667 (keep IDE selection in footer), #40869 / #24726 (opt-in
 * auto-attach settings proposals), #92516 (diff selection dismiss),
 * #20886 / #26577 (discoverability of removal).
 * Sneck is specifically: Hide toggle replaced by X; dismiss is
 * per-file and ephemeral across tab focus; no setting governs
 * context auto-attach.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "cleared",
  "sneck",
  "chip-dismiss-ephemeral",
  "hold",
  "undone",
  "open-latch",
  "stayed-off",
  "withheld",
  "hide-toggle",
  "dismiss-selection",
  "dismissed-selection",
  "apply-selection-update",
  "per-file-scope",
  "tab-return",
  "composer-chip",
  "no-setting",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "cleared";
export const PATH_WORD = "chip-dismiss-ephemeral";
export const SEEDED_WORD = "sneck";
export const PRODUCT_WORD = "sneck";
export const HOLD = Object.freeze(["cleared", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "cleared",
  "undone",
  "open-latch",
  "stayed-off",
  "withheld",
]);
export const RECOVER = Object.freeze(["cleared", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "spanned",
  "drawbridge",
  "rc-bridge-update-drop",
  "open-span",
  "linked",
  "moored",
  "joined",
  "matched",
  "chirograph",
  "worktree-rename-stale",
  "bipartite",
  "moiety",
  "indenture",
  "current",
  "inscribed",
  "titulus",
  "resume-stale-title",
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
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
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
  "derelict",
  "session-kill-orphan",
  "mount-refcount-race",
  "quota-spawn-cascade",
  "layer-tree-walk",
  "latin1-edit-wipe",
  "home-bind-overreach",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "sneck"),
);

export const FEATURED_ISSUE = 94052;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94052";
export const TITLE =
  "[BUG] VS Code 2.1.268: current-file chip Hide toggle replaced by X - context auto-attach opt-out no longer persists";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:ide",
  "platform:vscode",
]);
export const PLATFORM = "windows";
export const SURFACE = "chip-dismiss-ephemeral";
export const HOST = "Claude Code VS Code extension current-file chip";
export const CHECKED_ON =
  "Claude Code for VS Code 2.1.268–2.1.270; reproduced on 2.1.270; last working 2.1.267; Windows";
export const BUILD = "2.1.270";
export const SELECTED_MODEL = "unspecified";
export const OS = "windows";
export const PHRASE = "Score sneck or admit cleared.";
export const DISTRIBUTION =
  "In 2.1.268 the VS Code extension replaced the current-file chip's Hide toggle with an X. The changelog presents this as an improvement. It removed the only working opt-out from IDE context auto-attach. There is now no supported way — setting, command, keybinding, or environment variable — to stop the active editor file and selection from being injected into every prompt. From shipped webview/index.js in 2.1.270: the X calls dismissSelection(), which stores dismissedSelection, and applySelectionUpdate() then suppresses re-attachment only while that same file remains active. Dismissal is scoped per file, not per session or conversation. Switch tabs and the chip returns. Switch back and it returns again. A reference file kept open must be dismissed every time focus returns. The Hide toggle held its state. That is the regression. The same release also moved the indicator from the status line into the composer. Repro: open a.md and b.ts; chip shows a.md; click X; switch to b.ts (chip shows b.ts); switch back to a.md → chip returns despite dismiss. On 2.1.267 the Hide toggle in that step stayed off. Expected: dismiss persists until the user reverses it, as Hide did; better a setting like claudeCode.autoAttachActiveFile default true. Extension contributes 17 settings and 28 commands in 2.1.270; none governs context attachment. CHANGELOG 2.1.268: Changed the current-file chip in the message box: an X now removes it, replacing the Hide toggle.";

export const RULED_OUT = Object.freeze([
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span after auto-update, not chip dismiss",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed after git branch -m",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title cache",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive session stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Cartouche/#93772 section-poster — wrong diagram type",
  "Attaint/#93821 session-attainder — cyber-safeguard stain",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout",
  "Snib — medieval night-latch already shipped; different paradigm",
  "Hasp / Fibula / Cockade / Bulla / Livery — different latch/pin/hat paradigms",
  "Diplopia/#93012 room-label conflation — title-adjacent, not chip dismiss",
  "Fulcrum/#92377 auto-title overwrites --name — title-adjacent, not chip dismiss",
  "Followspot — different booth, not current-file chip persistence",
  "Mondegreen/#93193 worktree Bash false-block on substring git — different surface",
]);
export const EXPECTED = Object.freeze([
  "Dismissing the current-file chip should persist until the user reverses it, as the Hide toggle did",
  "Better: a setting claudeCode.autoAttachActiveFile (or autoAttachContext / shareIdeSelection), default true, honored per workspace",
  "An X and a persistent opt-out are orthogonal — keep the X and restore persistence",
  "There must be a supported way — setting, command, keybinding, or environment variable — to stop the active editor file and selection from being injected into every prompt",
  "A reference file kept open must not have to be dismissed every time focus returns",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "hide-toggle",
    label: "Hide toggle",
    count: "2.1.267 stayed off",
    note: "The Hide toggle held its state. That is the regression the X introduced.",
  },
  {
    id: "dismiss-selection",
    label: "dismissSelection()",
    count: "X in 2.1.270",
    note: "From shipped webview/index.js: the X calls dismissSelection() and stores dismissedSelection",
  },
  {
    id: "apply-selection-update",
    label: "applySelectionUpdate()",
    count: "same file only",
    note: "suppresses re-attachment only while that same file remains active",
  },
  {
    id: "tab-return",
    label: "tab return",
    count: "a.md → b.ts → a.md",
    note: "Switch tabs → chip returns. Switch back → returns again.",
  },
  {
    id: "no-setting",
    label: "no setting",
    count: "17 settings / 28 commands",
    note: "None governs context attachment. No command, keybinding, or env opt-out.",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "cleared-latch",
    survey:
      "sneck stays undone; Hide toggle held; active file is withheld from every prompt until the user reverses it",
    kind: "cleared",
    note: "idle: cleared — the hold/good path",
  },
  {
    id: "dismiss-selection",
    survey:
      "X calls dismissSelection(); dismissedSelection is stored for the current leaf only",
    kind: "sneck",
    note: "seeded: dismiss-selection of the current leaf",
  },
  {
    id: "chip-dismiss-ephemeral",
    survey:
      "applySelectionUpdate suppresses re-attachment only while that same file remains active; a tab switch snaps the sneck shut",
    kind: "sneck",
    note: "path: chip-dismiss-ephemeral names the spring sneck",
  },
  {
    id: "tab-return",
    survey:
      "open a.md + b.ts; click X on a.md; switch to b.ts; switch back to a.md — chip returns despite dismiss",
    kind: "sneck",
    note: "seeded: tab-return of the published repro",
  },
  {
    id: "sneck",
    survey:
      "the booth is sneck — spring latch; chip re-latches onto every prompt; no setting holds the leaf open",
    kind: "sneck",
    note: "seeded: sneck — Score sneck or admit cleared.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "chip-dismiss-ephemeral",
  "sneck",
  "dismiss-selection",
  "dismissed-selection",
  "apply-selection-update",
  "per-file-scope",
  "tab-return",
  "composer-chip",
  "no-setting",
  "hide-toggle",
]);

export const COUSINS = Object.freeze([
  {
    issue: 82492,
    title: "no visible chip / confirmation",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — no visible chip / confirmation. Different defect. Do not conflate with Hide→X persistence.",
  },
  {
    issue: 93667,
    title: "keep IDE selection in footer",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — keep IDE selection in footer. Placement ask, not ephemeral dismiss after tab return.",
  },
  {
    issue: 40869,
    title: "opt-in auto-attach settings proposal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — opt-in auto-attach settings proposal. Adjacent ask, not this Hide→X regression.",
  },
  {
    issue: 24726,
    title: "opt-in auto-attach settings proposal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — opt-in auto-attach settings proposal. Adjacent ask, not this Hide→X regression.",
  },
  {
    issue: 92516,
    title: "diff selection dismiss",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — diff selection dismiss. Different selection surface, not current-file chip persistence.",
  },
  {
    issue: 20886,
    title: "discoverability of removal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — discoverability of removal (mentioned in issue). Wanted a way to remove the attachment, not an ephemeral X.",
  },
  {
    issue: 26577,
    title: "discoverability of removal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — discoverability of removal (mentioned in issue). Token-cost complaint, not this per-file dismiss snap-back.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94041, title: "backup #94041", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94040, title: "backup #94040", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export const SAMPLE_KIND_IDLE = "open-latch";
export const SAMPLE_KIND_SEEDED = "chip-dismiss-ephemeral";
export const SAMPLE_HOLDING_IDLE = "stayed-off";
export const SAMPLE_HOLDING_SEEDED = "spring";

export const SAMPLE_CLEARED_PROOF = Object.freeze({
  cleared: true,
  sneck: false,
  chipDismissEphemeral: false,
  hideToggle: false,
  dismissSelection: false,
  dismissedSelection: false,
  applySelectionUpdate: false,
  perFileScope: false,
  tabReturn: false,
  composerChip: false,
  noSetting: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SNECK_PROOF = Object.freeze({
  cleared: false,
  sneck: true,
  chipDismissEphemeral: true,
  hideToggle: true,
  dismissSelection: true,
  dismissedSelection: true,
  applySelectionUpdate: true,
  perFileScope: true,
  tabReturn: true,
  composerChip: true,
  noSetting: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds cleared: sneck stays undone; Hide toggle held; active file withheld from every prompt" },
  { t: "dismiss-selection", line: "X calls dismissSelection(); dismissedSelection is stored for the current leaf only" },
  { t: "tab-return", line: "switch a.md → b.ts → a.md; chip returns despite dismiss" },
  { t: "path", line: "chip-dismiss-ephemeral — applySelectionUpdate only while the same file stays active" },
  { t: "score", line: "when the spring sneck snaps shut the booth is sneck — Score sneck or admit cleared." },
]);

/**
 * Stoop map: cleared open-latch vs spring sneck.
 * Idle/cleared: Hide held; leaf stays undone until reversed.
 * Seeded/sneck: X dismiss is per-file and snaps shut on tab return.
 */
export function mapStoop(input = {}) {
  const sneck = isSneckInput(input);
  const cleared = input.cleared === true && !sneck;
  return {
    stamp: sneck ? "chip-dismiss-ephemeral" : "cleared-latch",
    holdingLane: sneck ? "spring" : "stayed-off",
    kindLane: sneck ? "chip-dismiss-ephemeral" : "open-latch",
    bindLane: sneck ? "per-file-scope" : "withheld",
    ribbon: sneck ? "sneck" : "cleared",
    cleared,
  };
}

export function inspectLatch(input = {}) {
  const sprung = isSneckInput(input);
  if (input.cleared === true && !sprung) {
    return {
      stamp: "latch-undone",
      sprung: false,
    };
  }
  return {
    stamp: sprung ? "latch-sprung" : "latch-idle",
    sprung,
    note: sprung
      ? "the brass sneck is a spring latch — it lifts for the current leaf, then snaps shut when you pass another door"
      : "",
  };
}

export function inspectDismiss(input = {}) {
  const ephemeral =
    input.dismissSelection === true ||
    input.dismissedSelection === true ||
    input.applySelectionUpdate === true ||
    input.sneck === true;
  if (input.cleared === true && !ephemeral) {
    return {
      stamp: "dismiss-held",
      ephemeral: false,
    };
  }
  return {
    stamp: ephemeral ? "dismiss-selection" : "dismiss-idle",
    ephemeral,
    note: ephemeral
      ? "X calls dismissSelection(); dismissedSelection stored; applySelectionUpdate only while that same file remains active"
      : "",
  };
}

export function inspectTab(input = {}) {
  const returned =
    input.tabReturn === true ||
    input.perFileScope === true ||
    input.chipDismissEphemeral === true ||
    input.sneck === true;
  if (input.cleared === true && !returned) {
    return {
      stamp: "tab-held",
      returned: false,
    };
  }
  return {
    stamp: returned ? "tab-return" : "tab-idle",
    returned,
    note: returned
      ? "open a.md + b.ts; click X; switch to b.ts; switch back to a.md — chip returns despite dismiss"
      : "",
  };
}

export function inspectSetting(input = {}) {
  const missing =
    input.noSetting === true ||
    input.composerChip === true ||
    input.sneck === true;
  if (input.cleared === true && !missing) {
    return {
      stamp: "setting-present",
      missing: false,
    };
  }
  return {
    stamp: missing ? "no-setting" : "setting-idle",
    missing,
    note: missing
      ? "17 settings and 28 commands in 2.1.270; none governs context attachment; indicator moved into the composer"
      : "",
  };
}

export function inspectHide(input = {}) {
  const replaced =
    input.hideToggle === true ||
    input.sneck === true;
  if (input.cleared === true && !replaced) {
    return {
      stamp: "hide-held",
      replaced: false,
    };
  }
  return {
    stamp: replaced ? "hide-toggle" : "hide-idle",
    replaced,
    note: replaced
      ? "2.1.268 replaced Hide with X; changelog presents as improvement; Hide held its state"
      : "",
  };
}

function isSneckInput(input = {}) {
  return (
    input.sneck === true ||
    input.chipDismissEphemeral === true ||
    input.hideToggle === true ||
    input.dismissSelection === true ||
    input.dismissedSelection === true ||
    input.applySelectionUpdate === true ||
    input.perFileScope === true ||
    input.tabReturn === true ||
    input.composerChip === true ||
    input.noSetting === true
  );
}

export function readBooth(input = {}) {
  const sneck = isSneckInput(input);
  const cleared = input.cleared === true && !sneck;
  return {
    mark: sneck ? "sneck" : cleared || !sneck ? "cleared" : "sneck",
    cleared,
    sneck,
    chipDismissEphemeral: input.chipDismissEphemeral === true || sneck,
    hideToggle: input.hideToggle === true,
    dismissSelection: input.dismissSelection === true,
    dismissedSelection: input.dismissedSelection === true,
    applySelectionUpdate: input.applySelectionUpdate === true,
    perFileScope: input.perFileScope === true,
    tabReturn: input.tabReturn === true,
    composerChip: input.composerChip === true,
    noSetting: input.noSetting === true,
    scope: mapStoop(input),
    latch: inspectLatch(input),
    dismiss: inspectDismiss(input),
    tab: inspectTab(input),
    setting: inspectSetting(input),
    hide: inspectHide(input),
    log: input.log || [],
  };
}

export const SNECK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-cleared",
    cleared: true,
    sneck: false,
    cue: "cleared",
    note: "idle HOLD: sneck stays undone; Hide toggle held; active file withheld from every prompt — the hold/good path",
  },
  {
    t: "dismiss-selection",
    event: "dismiss-selection",
    sneck: true,
    dismissSelection: true,
    dismissedSelection: true,
    cue: "sneck",
    note: "X calls dismissSelection(); dismissedSelection is stored for the current leaf only",
  },
  {
    t: "tab-return",
    event: "tab-return",
    sneck: true,
    perFileScope: true,
    tabReturn: true,
    cue: "sneck",
    note: "switch a.md → b.ts → a.md; chip returns despite dismiss",
  },
  {
    t: "path",
    event: "chip-dismiss-ephemeral",
    sneck: true,
    chipDismissEphemeral: true,
    applySelectionUpdate: true,
    cue: "sneck",
    note: "chip-dismiss-ephemeral — applySelectionUpdate only while the same file stays active",
  },
  {
    t: "score",
    event: "sneck",
    sneck: true,
    chipDismissEphemeral: true,
    hideToggle: true,
    dismissSelection: true,
    dismissedSelection: true,
    applySelectionUpdate: true,
    perFileScope: true,
    tabReturn: true,
    composerChip: true,
    noSetting: true,
    cue: "sneck",
    note: "sneck — when the spring latch snaps shut the booth is sneck",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-cleared",
    cleared: true,
    sneck: false,
    cue: "cleared",
    note: "positive control: Hide held; leaf stays undone until reversed",
  },
  {
    t: "announce",
    event: "cue-cleared",
    cleared: true,
    cue: "cleared",
    note: "positive control: the sneck stays cleared",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    cleared: true,
    sneck: false,
    chipDismissEphemeral: false,
    cue: "cleared",
  };
}

export function seedCleared() {
  return { ...emptyTicket() };
}

export function seedSneck() {
  return {
    seed: SEEDED_WORD,
    cleared: false,
    sneck: true,
    chipDismissEphemeral: true,
    hideToggle: true,
    dismissSelection: true,
    dismissedSelection: true,
    applySelectionUpdate: true,
    perFileScope: true,
    tabReturn: true,
    composerChip: true,
    noSetting: true,
    cue: "sneck",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SNECK_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    sneck: true,
    chipDismissEphemeral: true,
    dismissSelection: true,
    cue: "sneck",
  };
}

export function seedChipDismissEphemeral() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    sneck: true,
    chipDismissEphemeral: true,
    applySelectionUpdate: true,
    event: "chip-dismiss-ephemeral",
    cue: "sneck",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    cleared: true,
    cue: "cleared",
  };
}

export function seedUndone() {
  return {
    seed: "undone",
    preferSeed: true,
    cleared: true,
    cue: "cleared",
  };
}

export function seedOpenLatch() {
  return {
    seed: "open-latch",
    preferSeed: true,
    cleared: true,
    cue: "cleared",
  };
}

export function seedStayedOff() {
  return {
    seed: "stayed-off",
    preferSeed: true,
    cleared: true,
    cue: "cleared",
  };
}

export function seedWithheld() {
  return {
    seed: "withheld",
    preferSeed: true,
    cleared: true,
    cue: "cleared",
  };
}

export function seedHideToggle() {
  return {
    seed: "hide-toggle",
    preferSeed: true,
    hideToggle: true,
    cue: "sneck",
  };
}

export function seedDismissSelection() {
  return {
    seed: "dismiss-selection",
    preferSeed: true,
    dismissSelection: true,
    cue: "sneck",
  };
}

export function seedDismissedSelection() {
  return {
    seed: "dismissed-selection",
    preferSeed: true,
    dismissedSelection: true,
    cue: "sneck",
  };
}

export function seedApplySelectionUpdate() {
  return {
    seed: "apply-selection-update",
    preferSeed: true,
    applySelectionUpdate: true,
    cue: "sneck",
  };
}

export function seedPerFileScope() {
  return {
    seed: "per-file-scope",
    preferSeed: true,
    perFileScope: true,
    cue: "sneck",
  };
}

export function seedTabReturn() {
  return {
    seed: "tab-return",
    preferSeed: true,
    tabReturn: true,
    cue: "sneck",
  };
}

export function seedComposerChip() {
  return {
    seed: "composer-chip",
    preferSeed: true,
    composerChip: true,
    cue: "sneck",
  };
}

export function seedNoSetting() {
  return {
    seed: "no-setting",
    preferSeed: true,
    noSetting: true,
    cue: "sneck",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      cleared: false,
      sneck: false,
      chipDismissEphemeral: false,
      hideToggle: false,
      dismissSelection: false,
      dismissedSelection: false,
      applySelectionUpdate: false,
      perFileScope: false,
      tabReturn: false,
      composerChip: false,
      noSetting: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    cleared: raw.cleared === true,
    sneck: raw.sneck === true || raw.event === "sneck",
    chipDismissEphemeral:
      raw.chipDismissEphemeral === true || raw.event === "chip-dismiss-ephemeral",
    hideToggle: raw.hideToggle === true || raw.event === "hide-toggle",
    dismissSelection:
      raw.dismissSelection === true || raw.event === "dismiss-selection",
    dismissedSelection:
      raw.dismissedSelection === true || raw.event === "dismissed-selection",
    applySelectionUpdate:
      raw.applySelectionUpdate === true || raw.event === "apply-selection-update",
    perFileScope: raw.perFileScope === true || raw.event === "per-file-scope",
    tabReturn: raw.tabReturn === true || raw.event === "tab-return",
    composerChip: raw.composerChip === true || raw.event === "composer-chip",
    noSetting: raw.noSetting === true || raw.event === "no-setting",
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
      (ticket.cleared != null ||
        ticket.sneck != null ||
        ticket.chipDismissEphemeral != null ||
        ticket.hideToggle != null ||
        ticket.dismissSelection != null ||
        ticket.dismissedSelection != null ||
        ticket.applySelectionUpdate != null ||
        ticket.perFileScope != null ||
        ticket.tabReturn != null ||
        ticket.composerChip != null ||
        ticket.noSetting != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isCleared(row) {
  if (row.sneck && row.cue !== "cleared") return false;
  if (row.cue === "sneck" || row.cue === "chip-dismiss-ephemeral") {
    return false;
  }
  if (
    row.chipDismissEphemeral &&
    row.tabReturn &&
    row.cue !== "cleared" &&
    row.cleared !== true
  ) {
    return false;
  }
  if (row.cleared === true && row.sneck !== true && row.cue !== "sneck") {
    return true;
  }
  if (
    row.cue === "cleared" &&
    row.sneck !== true &&
    row.chipDismissEphemeral !== true &&
    row.hideToggle !== true &&
    row.dismissSelection !== true &&
    row.dismissedSelection !== true &&
    row.applySelectionUpdate !== true &&
    row.perFileScope !== true &&
    row.tabReturn !== true &&
    row.composerChip !== true &&
    row.noSetting !== true
  ) {
    return true;
  }
  return false;
}

function isChipDismissEphemeral(row) {
  return (
    row.event === "chip-dismiss-ephemeral" &&
    !isCleared(row) &&
    (row.chipDismissEphemeral === true ||
      row.applySelectionUpdate === true ||
      row.perFileScope === true)
  );
}

function isSneckRow(row) {
  if (isCleared(row)) return false;
  if (isChipDismissEphemeral(row) && row.cue !== "sneck") return false;
  if (row.cue === "sneck") return true;
  if (row.sneck === true) return true;
  if (row.chipDismissEphemeral === true && row.tabReturn === true) {
    return true;
  }
  if (
    row.chipDismissEphemeral === true ||
    row.hideToggle === true ||
    row.dismissSelection === true ||
    row.dismissedSelection === true ||
    row.applySelectionUpdate === true ||
    row.perFileScope === true ||
    row.tabReturn === true ||
    row.composerChip === true ||
    row.noSetting === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one sneck pass against the cottage latch.
 * cleared: Hide held; leaf stays undone until reversed.
 * sneck: X dismiss is per-file; tab return snaps the latch shut.
 * chip-dismiss-ephemeral: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isChipDismissEphemeral(row) ||
    (row.chipDismissEphemeral && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "chip-dismiss-ephemeral";
  } else if (isSneckRow(row)) {
    verdict = "sneck";
  } else if (isCleared(row)) {
    verdict = "cleared";
  } else if (
    row.chipDismissEphemeral ||
    row.hideToggle ||
    row.dismissSelection ||
    row.dismissedSelection ||
    row.applySelectionUpdate ||
    row.perFileScope ||
    row.tabReturn ||
    row.composerChip ||
    row.noSetting
  ) {
    verdict = "sneck";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const latch = inspectLatch(row);
  const dismiss = inspectDismiss(row);
  const tab = inspectTab(row);
  const setting = inspectSetting(row);
  const hide = inspectHide(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    cleared: verdict === "cleared" || verdict === "hold",
    sneck: verdict === "sneck" || verdict === SEEDED_WORD,
    chipDismissEphemeral:
      row.chipDismissEphemeral === true ||
      verdict === "chip-dismiss-ephemeral" ||
      verdict === PATH_WORD,
    hideToggle: row.hideToggle,
    dismissSelection: row.dismissSelection,
    dismissedSelection: row.dismissedSelection,
    applySelectionUpdate: row.applySelectionUpdate,
    perFileScope: row.perFileScope,
    tabReturn: row.tabReturn,
    composerChip: row.composerChip,
    noSetting: row.noSetting,
    cue: hold
      ? "cleared"
      : row.chipDismissEphemeral || verdict === "chip-dismiss-ephemeral"
        ? "chip-dismiss-ephemeral"
        : "sneck",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit cleared" : "score sneck",
    latchInspect: latch,
    dismissInspect: dismiss,
    tabInspect: tab,
    settingInspect: setting,
    hideInspect: hide,
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
      : SNECK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "sneck");
  const path = scored.filter((row) => row.verdict === "chip-dismiss-ephemeral");
  const cleared = scored.filter((row) => row.verdict === "cleared");
  const headline =
    scored.find((row) => row.event === "sneck") ||
    scored.find((row) => row.event === "chip-dismiss-ephemeral") ||
    scored.find((row) => row.event === "tab-return") ||
    dead[dead.length - 1];
  let verdict = "cleared";
  if (dead.length) verdict = "sneck";
  else if (path.length && !cleared.length) verdict = "chip-dismiss-ephemeral";
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
    sneckCount: dead.length,
    pathCount: path.length,
    clearedCount: cleared.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit cleared" : "score sneck",
    note: headline
      ? "Hide toggle replaced by X; dismiss is per-file and ephemeral across tab focus; no setting governs context auto-attach. Cousins cite-only: #82492 #93667 #40869 #24726 #92516 #20886 #26577."
      : "published sneck walk scored against cleared vs sneck",
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
    seeded !== "cleared" &&
    seeded !== "sneck" &&
    seeded !== "chip-dismiss-ephemeral" &&
    ticket.cleared == null &&
    ticket.sneck == null &&
    ticket.chipDismissEphemeral == null &&
    ticket.tabReturn == null &&
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
    cleared: scored.cleared ?? false,
    sneck: scored.sneck ?? false,
    chipDismissEphemeral: scored.chipDismissEphemeral ?? false,
    hideToggle: scored.hideToggle ?? false,
    dismissSelection: scored.dismissSelection ?? false,
    dismissedSelection: scored.dismissedSelection ?? false,
    applySelectionUpdate: scored.applySelectionUpdate ?? false,
    perFileScope: scored.perFileScope ?? false,
    tabReturn: scored.tabReturn ?? false,
    composerChip: scored.composerChip ?? false,
    noSetting: scored.noSetting ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.tabReturn || result.sneck
      ? "kind=chip-dismiss-ephemeral"
      : "kind=open-latch",
    result.dismissSelection || result.sneck ? "ref=ephemeral" : "ref=held",
    result.chipDismissEphemeral || result.verdict === "chip-dismiss-ephemeral"
      ? "path=chip-dismiss-ephemeral"
      : "path=cleared",
    result.cue === "cleared"
      ? "cue=cleared"
      : result.cue === "chip-dismiss-ephemeral"
        ? "cue=chip-dismiss-ephemeral"
        : "cue=sneck",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    cleared: result.cleared,
    sneck: result.sneck,
    chipDismissEphemeral: result.chipDismissEphemeral,
    hideToggle: result.hideToggle,
    dismissSelection: result.dismissSelection,
    dismissedSelection: result.dismissedSelection,
    applySelectionUpdate: result.applySelectionUpdate,
    perFileScope: result.perFileScope,
    tabReturn: result.tabReturn,
    composerChip: result.composerChip,
    noSetting: result.noSetting,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    latch: inspectLatch({
      cleared: result.cleared,
      sneck: result.sneck,
      chipDismissEphemeral: result.chipDismissEphemeral,
    }),
    dismiss: inspectDismiss({
      cleared: result.cleared,
      sneck: result.sneck,
      dismissSelection: result.dismissSelection,
      dismissedSelection: result.dismissedSelection,
      applySelectionUpdate: result.applySelectionUpdate,
    }),
    tab: inspectTab({
      cleared: result.cleared,
      sneck: result.sneck,
      tabReturn: result.tabReturn,
      perFileScope: result.perFileScope,
      chipDismissEphemeral: result.chipDismissEphemeral,
    }),
    setting: inspectSetting({
      cleared: result.cleared,
      sneck: result.sneck,
      noSetting: result.noSetting,
      composerChip: result.composerChip,
    }),
    hide: inspectHide({
      cleared: result.cleared,
      sneck: result.sneck,
      hideToggle: result.hideToggle,
    }),
    scope: mapStoop({
      cleared: result.cleared,
      sneck: result.sneck,
      chipDismissEphemeral: result.chipDismissEphemeral,
      hideToggle: result.hideToggle,
      dismissSelection: result.dismissSelection,
      dismissedSelection: result.dismissedSelection,
      applySelectionUpdate: result.applySelectionUpdate,
      perFileScope: result.perFileScope,
      tabReturn: result.tabReturn,
      composerChip: result.composerChip,
      noSetting: result.noSetting,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      sneck: result.sneck === true || result.verdict === "sneck",
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
        "NON-BINDING: X/dismissSelection stores dismissedSelection and applySelectionUpdate only suppresses re-attachment while the same file remains active; dismissal is per-file not per-session, so a tab switch clears the suppression and the chip re-latches. Invite verify against #94052 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
