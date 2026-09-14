#!/usr/bin/env node
/**
 * Arras — theater / tapestry / curtain aisle / gallery wing booth.
 * An *arras* is a heavy tapestry hung as a screen (Polonius
 * behind the arras). The approval card is hung behind the
 * curtain — the user never sees it — then the next message
 * stabs through and the pending call dies as cancelled.
 * Deep stage velvet / tapestry gold / linen / curtain crimson /
 * footlight cyan. NOT a wax-seal atelier (Frangible). NOT a
 * hotel door-plate (Nameplate). NOT a lacquer nesting doll
 * (Matryoshka). NOT a night blotter (Dragnet). NOT an
 * enrollment desk (Matricula). NOT a type-foundry (Allograph).
 * NOT a neurology writing-desk (Agraphia). NOT a
 * gauntlet/lictor/lychgate/ouster/proscription booth. NOT
 * Knock / Oubliette / Eidolon / Quietus / Aphonia / Sourdine /
 * Wraith / Mirage / Afterimage / Scrim / Cachet / Veto /
 * Frisket / Scant.
 *
 * Educational diagnostic model for a published Claude Desktop
 * Code-tab Auto-mode phantom prompt: some classifier-escalated
 * tool calls never render a user-approval card — no card, no
 * notification. The call sits "running." The next chat message
 * kills the pending call as toolDenialKind: "cancelled" with a
 * fake user-refusal string. Distinct from a classifier deny
 * (bracketed reason like [Self-Modification]). Mid-session
 * Bypass Permissions toggle can write config and show Bypass
 * selected while the CLI rejects because the session was not
 * launched with --dangerously-skip-permissions.
 * Version noted: CLI/core 2.1.270; Desktop app 1.52386.6;
 * macOS Darwin 25.6.0.
 *
 * Encoded from anthropics/claude-code#94348 issue text only.
 * Hypothesis (NON-BINDING — issue text): classifier-escalated
 * Desktop Auto-mode calls sometimes never emit/render the
 * approval card; the next user message cancels the hung call
 * as toolDenialKind cancelled with a fake user-refusal string;
 * a mid-session Bypass toggle can write config while the CLI
 * rejects the mode change. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix.
 * No network. No exploits. No live Claude.
 *
 *   node arras.mjs data/arras.json
 *   echo '{"seed":"arras"}' | node arras.mjs
 *
 * Idle word is cleared (HOLD: approval card surfaced / path
 * clear).
 * HOLD aliases: draped-open, card-shown, prompt-visible,
 * aisle-clear, curtain-raised.
 * Seeded word is arras (#94348 path).
 * Path word is phantom-prompt.
 * Product score word is arras (Score arras or admit cleared.).
 *
 * NOT Frangible/#94362. NOT Nameplate/#94349. NOT
 * Matryoshka/#94350. NOT Dragnet/#94064. NOT Matricula/#93987.
 * NOT Allograph/#94256. NOT Agraphia/#94251. NOT Gauntlet/#94029.
 * NOT Lictor/#94053. NOT Lychgate/#94059. NOT Ouster/#94221.
 * NOT Proscription/#94202. NOT Frisket. NOT Scant. NOT Knock.
 * Do NOT pick #94336.
 * Cite-only related (do NOT rebuild / do NOT conflate):
 * #92053 (cancelled on backgrounding/channel loss),
 * #85588 (Auto silent classifier deny),
 * #92817 / #86478 (bypass mode not respected).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "cleared",
  "arras",
  "phantom-prompt",
  "hold",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "cancelled",
  "bypass-lie",
  "card-hidden",
  "classifier-deny",
  "next-message",
  "running-hang",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "cleared";
export const PATH_WORD = "phantom-prompt";
export const SEEDED_WORD = "arras";
export const PRODUCT_WORD = "arras";
export const HOLD = Object.freeze(["cleared", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
]);
export const RECOVER = Object.freeze(["cleared", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "armed",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "bit-set",
  "+x",
  "affixed",
  "engraved",
  "hung",
  "plated",
  "labeled",
  "titled",
  "unpacked",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "scoped",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "enrolled",
  "admitted",
  "rostered",
  "listed",
  "scanned",
  "freshened",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
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
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "mirage",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
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
  "eidolon",
  "quietus",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94348;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94348";
export const TITLE =
  "[BUG] Desktop Code tab (Auto mode): permission prompt never renders — call hangs then is silently killed as \"cancelled\" on the next message";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:permissions",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "phantom-prompt";
export const HOST = "CLI/core 2.1.270; Desktop app 1.52386.6";
export const CHECKED_ON =
  "Published report: Desktop Code tab Auto permission mode; classifier-escalated tool call never renders an approval card; next chat message kills the pending call as toolDenialKind cancelled with a fake user-refusal string; mid-session Bypass Permissions toggle writes config and shows Bypass selected while CLI rejects";
export const BUILD = "CLI/core 2.1.270; Desktop app 1.52386.6";
export const SELECTED_MODEL =
  "n/a — Desktop Auto permission-prompt render / cancelled-without-card defect, not a model defect";
export const OS =
  "macOS Darwin 25.6.0; platform:macos / area:permissions / area:desktop";
export const PHRASE = "Score arras or admit cleared.";
export const DISTRIBUTION =
  "In Claude Desktop Code tab, Auto permission mode: some tool calls that need classifier escalation to a user-approval prompt never render that prompt anywhere in the UI — no card, no notification. Call sits \"running.\" When the user sends the next chat message, the pending call is killed and reported as: The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed. Transcript: toolDenialKind: \"cancelled\" with that refusal string — NOT a real user decision; the user never saw an approval card. Distinct from classifier deny (which carries a bracketed reason like [Self-Modification]). Worse: non-deterministic per call — a grep matching existing allow rule Bash(grep:*) was silently escalated and killed even though near-identical greps succeeded earlier in the same session. Mid-session Bypass Permissions toggle UI lies: UI shows Bypass selected after writing config, but CLI rejects: Failed to set permission mode ... Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions. User believes unblocked; escalated calls still hit the invisible-prompt failure.";

export const USER_REFUSAL =
  "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed.";
export const TOOL_DENIAL_KIND = "cancelled";
export const BYPASS_ERROR =
  "Failed to set permission mode ... Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions";
export const ALLOW_RULE = "Bash(grep:*)";
export const CLASSIFIER_DENY_SAMPLE = "[Self-Modification]";
export const BUILD_VERSION = "2.1.270";
export const DESKTOP_BUILD = "1.52386.6";
export const HONEST_INCOMPLETE = "did not complete";

export const CURTAIN_NAMES = Object.freeze([
  {
    id: "curtain-aisle",
    lost: "Curtain aisle — approval card hung behind the arras; house never sees it",
    control: "The aisle would stay cleared with the curtain raised",
    story: "the gallery wing holds when the card is shown",
  },
  {
    id: "phantom-card",
    lost: "Phantom card — classifier-escalated call never renders a prompt; no card, no notification",
    control: "Every escalated call would surface a visible approval card",
    story: "the linen card stays draped behind the tapestry",
  },
  {
    id: "next-dagger",
    lost: "Next-message dagger — the next chat stabs the hung call as cancelled",
    control: "A hung call would stay visible until the user decides",
    story: "the rapier goes through the arras and the pending call dies",
  },
  {
    id: "bypass-footlight",
    lost: "Bypass footlight — toggle shows Bypass on after writing config; CLI rejects the mode",
    control: "If bypassPermissions fails server-side the UI must not show the mode as active",
    story: "the footlight glows while the prompter still refuses the cue",
  },
  {
    id: "cancelled-as-refusal",
    lost: "Cancelled-as-refusal — toolDenialKind cancelled carries a fake user-refusal string",
    control: "A killed-by-race call must report did not complete, not a user refusal",
    story: "the playbill reads STOP as if the house chose it",
  },
  {
    id: "allow-rule-grep",
    lost: "Allow-rule grep — Bash(grep:*) matching an existing allow rule was silently escalated and killed",
    control: "A matching allow rule would not escalate to an invisible prompt",
    story: "near-identical greps succeeded earlier in the same session",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "curtain-aisle",
    survey: "curtain raised; approval card surfaced; aisle clear",
    kind: "cleared",
    note: "idle/control: approval card visible — the hold/good path",
  },
  {
    id: "phantom-card",
    survey: "classifier-escalated call never renders a prompt; no card, no notification",
    kind: "arras",
    note: "seeded: card hung behind the arras",
  },
  {
    id: "next-dagger",
    survey: "next chat message kills the hung call as cancelled",
    kind: "arras",
    note: "seeded: dagger through the tapestry",
  },
  {
    id: "bypass-footlight",
    survey: "Bypass toggle shows on after writing config; CLI rejects bypassPermissions",
    kind: "arras",
    note: "seeded: UI lie; session was not launched with --dangerously-skip-permissions",
  },
  {
    id: "cancelled-as-refusal",
    survey: "toolDenialKind cancelled with a fake user-refusal string",
    kind: "arras",
    note: "seeded: not a real user decision; user never saw a card",
  },
  {
    id: "allow-rule-grep",
    survey: "phantom-prompt — Bash(grep:*) silently escalated and killed",
    kind: "arras",
    note: "path: phantom-prompt names the invisible-card hang",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "card-hidden",
    label: "card hidden",
    count: "no prompt",
    note: "Classifier-escalated call never renders an approval card",
  },
  {
    id: "cancelled",
    label: "cancelled",
    count: "toolDenialKind",
    note: "Next message kills the hung call as cancelled — not a user decision",
  },
  {
    id: "bypass-lie",
    label: "bypass lie",
    count: "UI on / CLI reject",
    note: "Bypass toggle shows selected; CLI rejects because session was not launched with --dangerously-skip-permissions",
  },
  {
    id: "running-hang",
    label: "running hang",
    count: "sits running",
    note: "Call sits running with no card and no notification",
  },
  {
    id: "classifier-deny",
    label: "classifier deny",
    count: "[Self-Modification]",
    note: "Distinct: classifier deny carries a bracketed reason — not this path",
  },
  {
    id: "phantom-prompt",
    label: "phantom-prompt",
    count: "invisible card",
    note: "Path: escalated call hangs behind the arras until the next message stabs it",
  },
]);

export const RULED_OUT = Object.freeze([
  "Frangible/#94362 chmod-failopen — wax-seal atelier / PreToolUse +x fail-open; DIFFERENT",
  "Nameplate/#94349 header-rename — brass hotel door-plate / VS Code title snap-back; DIFFERENT",
  "Matryoshka/#94350 subst-nest — lacquer nesting-doll / Bash $(...) walker; DIFFERENT",
  "Dragnet/#94064 root-find — night blotter / full-disk find; DIFFERENT",
  "Matricula/#93987 reload-blind — enrollment desk; desktop /reload-skills (no changes); DIFFERENT",
  "Allograph/#94256 win-posix-mismatch — Windows punch vs POSIX matrix; type-foundry; DIFFERENT",
  "Agraphia/#94251 pre-tool-omit — JSONL drops pre-tool text; medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Knock — fail-loud stalled grants; DIFFERENT",
  "Oubliette — different catalog paradigm; NOT this booth",
  "Eidolon — different catalog paradigm; NOT this booth",
  "Quietus — different catalog paradigm; NOT this booth",
  "Aphonia — different catalog paradigm; NOT this booth",
  "Sourdine — different catalog paradigm; NOT this booth",
  "Wraith — different catalog paradigm; NOT this booth",
  "Mirage — different catalog paradigm; NOT this booth",
  "Afterimage — different catalog paradigm; NOT this booth",
  "Scrim — different catalog paradigm; NOT this booth",
  "Cachet — different catalog paradigm; NOT this booth",
  "Veto — different catalog paradigm; NOT this booth",
  "Frisket — different catalog paradigm; NOT this booth",
  "Scant — different catalog paradigm; NOT this booth",
  "#92053 — cancelled on backgrounding/channel loss — cite-only cousin, DIFFERENT trigger",
  "#85588 — Auto silent classifier deny — cite-only cousin, DIFFERENT (bracketed reason)",
  "#92817 — bypass mode not respected — cite-only cousin, DIFFERENT surface",
  "#86478 — bypass mode not respected — cite-only cousin, DIFFERENT surface",
  "#94336 — do NOT pick; not this booth",
]);

export const EXPECTED = Object.freeze([
  "Every classifier-escalated tool call must render a visible approval prompt — no silent hangs",
  "If mode switch to bypassPermissions fails server-side, UI must not show mode as active — surface the error",
  "Killed-by-race tool call must never be reported as user refusal; use honest did not complete (same class as #92053)",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "phantom-prompt",
  "arras",
  "cancelled",
  "bypass-lie",
  "card-hidden",
  "running-hang",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92053,
    title: "cancelled on backgrounding/channel loss",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — cancelled-without-honest-incomplete on backgrounding/channel loss. Do not rebuild. Do not conflate. Different trigger from a never-rendered Desktop Auto approval card.",
  },
  {
    issue: 85588,
    title: "Auto silent classifier deny",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Auto silent classifier deny (bracketed reason). Do not rebuild. Do not conflate. Distinct from toolDenialKind cancelled with a fake user-refusal string.",
  },
  {
    issue: 92817,
    title: "bypass mode not respected",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — bypass mode not respected. Do not rebuild. Do not conflate. Different from a mid-session Bypass toggle UI that lies while CLI rejects.",
  },
  {
    issue: 86478,
    title: "bypass mode not respected",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — bypass mode not respected. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "Remote Control slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "mirage",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "card-shown";
export const SAMPLE_KIND_SEEDED = "phantom-prompt";
export const SAMPLE_HOLDING_IDLE = "curtain-raised";
export const SAMPLE_HOLDING_SEEDED = "card-hidden";

export const SAMPLE_CLEARED_PROOF = Object.freeze({
  cleared: true,
  arras: false,
  phantomPrompt: false,
  cardHidden: false,
  cancelled: false,
  bypassLie: false,
  runningHang: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_ARRAS_PROOF = Object.freeze({
  cleared: false,
  arras: true,
  phantomPrompt: true,
  cardHidden: true,
  cancelled: true,
  bypassLie: true,
  runningHang: true,
  nextMessage: true,
  kind: SAMPLE_KIND_SEEDED,
  names: CURTAIN_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds cleared: approval card surfaced; curtain raised; aisle clear" },
  { t: "hang", line: "classifier-escalated call never renders a prompt; no card, no notification; sits running" },
  { t: "dagger", line: "next chat message kills the hung call as toolDenialKind cancelled with a fake user-refusal" },
  { t: "path", line: "phantom-prompt — card hung behind the arras; Bypass toggle lies; grep allow-rule silently escalated" },
  { t: "score", line: "when the approval card hangs behind the arras the booth is arras — Score arras or admit cleared." },
]);

const FORCE_FLAGS = [
  "cardHidden",
  "cancelled",
  "bypassLie",
  "phantomPrompt",
  "nextMessage",
  "runningHang",
  "toolDenialCancelled",
];

const ISSUE_CUE_RE =
  /94348|phantom.?prompt|toolDenialKind|cancelled|bypassPermissions|dangerously-skip-permissions|approval (card|prompt)|Auto mode|classifier escalation|doesn'?t want to take this action/i;

/**
 * Educational approval-card compare. Not a Claude Code patch.
 * Encodes only the published #94348 shapes.
 * cleared=true is the HOLD / card-shown path.
 */
export function renderApproval({
  cleared = false,
  cardVisible = false,
  escalated = true,
} = {}) {
  const shown =
    cleared === true ||
    cardVisible === true;
  if (shown) {
    return {
      cardVisible: true,
      running: false,
      cancelled: false,
      denialKind: null,
      refusal: null,
      honest: true,
      escalated,
      phrase: "admit cleared",
    };
  }
  return {
    cardVisible: false,
    running: true,
    cancelled: true,
    denialKind: TOOL_DENIAL_KIND,
    refusal: USER_REFUSAL,
    honest: false,
    escalated,
    phrase: "score arras",
  };
}

export function switchBypass({
  uiOn = true,
  launchedWithDangerouslySkip = false,
} = {}) {
  if (launchedWithDangerouslySkip === true) {
    return {
      uiOn: true,
      cliAccepted: true,
      error: null,
      lie: false,
      shouldShow: true,
    };
  }
  return {
    uiOn,
    cliAccepted: false,
    error: BYPASS_ERROR,
    lie: uiOn === true,
    shouldShow: false,
  };
}

export function scorePhantomPrompt(input = {}) {
  const clearedHold = input.cleared === true && input.arras !== true;
  const cardVisible =
    input.cardVisible === true ||
    input.cardShown === true ||
    clearedHold;
  const render = renderApproval({
    cleared: clearedHold,
    cardVisible: clearedHold ? true : cardVisible,
    escalated: input.escalated !== false,
  });
  const arras =
    !clearedHold &&
    (render.cardVisible === false ||
      input.arras === true ||
      input.phantomPrompt === true ||
      input.cardHidden === true ||
      input.cancelled === true ||
      input.denialKind === TOOL_DENIAL_KIND ||
      input.refusal === USER_REFUSAL);
  return {
    cleared: !arras,
    arras,
    phantomPrompt: arras,
    cardHidden: render.cardVisible === false,
    cancelled: render.cancelled === true,
    runningHang: render.running === true,
    honest: render.honest,
    denialKind: render.denialKind,
    refusal: render.refusal,
    render,
    phrase: arras ? "score arras" : "admit cleared",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94348") return true;
  if (input.refusal === USER_REFUSAL) return true;
  if (input.denialKind === TOOL_DENIAL_KIND) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapArras(input = {}) {
  const arras = isArrasInput(input);
  const cleared = input.cleared === true && !arras;
  return {
    stamp: arras ? "phantom-prompt" : "curtain-raised",
    holdingLane: arras ? "card-hidden" : "curtain-raised",
    kindLane: arras ? "phantom-prompt" : "card-shown",
    bindLane: arras ? "cancelled" : "aisle-clear",
    ribbon: arras ? "arras" : "cleared",
    cleared,
  };
}

export function inspectAisle(input = {}) {
  const draped =
    input.phantomPrompt === true ||
    input.arras === true ||
    input.cardHidden === true ||
    isArrasInput(input);
  if (input.cleared === true && !draped) {
    return { stamp: "aisle-cleared", draped: false, note: "curtain aisle stays cleared; card shown" };
  }
  return {
    stamp: draped ? "curtain-aisle" : "aisle-idle",
    draped,
    note: draped
      ? "curtain aisle — approval card hung behind the arras"
      : "",
  };
}

export function inspectCard(input = {}) {
  const hidden =
    input.cardHidden === true ||
    input.arras === true ||
    isArrasInput(input);
  if (input.cleared === true && !hidden) {
    return { stamp: "card-shown", hidden: false };
  }
  return {
    stamp: hidden ? "phantom-card" : "card-idle",
    hidden: hidden || input.cleared === true,
    note: hidden
      ? "phantom card — classifier-escalated call never renders a prompt"
      : "",
  };
}

export function inspectDagger(input = {}) {
  const stabbed =
    input.cancelled === true ||
    input.nextMessage === true ||
    input.arras === true ||
    isArrasInput(input);
  if (input.cleared === true && !stabbed) {
    return { stamp: "dagger-idle", stabbed: false };
  }
  return {
    stamp: stabbed ? "next-dagger" : "dagger-idle",
    stabbed: stabbed || input.cleared === true,
    note: stabbed
      ? "next-message dagger — the next chat stabs the hung call as cancelled"
      : "",
  };
}

export function inspectBypass(input = {}) {
  const lied =
    input.bypassLie === true ||
    input.arras === true ||
    isArrasInput(input);
  if (input.cleared === true && !lied) {
    return { stamp: "footlight-quiet", lied: false };
  }
  return {
    stamp: lied ? "bypass-footlight" : "footlight-idle",
    lied,
    note: lied
      ? "bypass footlight — UI shows Bypass on; CLI rejects the mode"
      : "",
  };
}

export function inspectHang(input = {}) {
  const hanging =
    input.runningHang === true ||
    input.arras === true ||
    isArrasInput(input);
  if (input.cleared === true && !hanging) {
    return { stamp: "hang-idle", hanging: false };
  }
  return {
    stamp: hanging ? "running-hang" : "hang-idle",
    hanging,
    note: hanging
      ? "running hang — call sits running with no card"
      : "",
  };
}

export function inspectRefusal(input = {}) {
  const fake =
    input.cancelled === true ||
    input.toolDenialCancelled === true ||
    input.arras === true ||
    isArrasInput(input);
  if (input.cleared === true && !fake) {
    return { stamp: "refusal-idle", fake: false };
  }
  return {
    stamp: fake ? "cancelled-as-refusal" : "refusal-idle",
    fake,
    note: fake
      ? "cancelled-as-refusal — toolDenialKind cancelled with a fake user-refusal string"
      : "",
  };
}

function curtainOpen(input, id) {
  const map = {
    "curtain-aisle": input.phantomPrompt || input.arras,
    "phantom-card": input.cardHidden || input.phantomPrompt,
    "next-dagger": input.cancelled || input.nextMessage,
    "bypass-footlight": input.bypassLie,
    "cancelled-as-refusal": input.cancelled || input.toolDenialCancelled,
    "allow-rule-grep": input.phantomPrompt || input.arras,
  };
  return (
    map[id] === true ||
    input.phantomPrompt === true ||
    input.arras === true
  );
}

function isArrasInput(input = {}) {
  return (
    input.arras === true ||
    input.phantomPrompt === true ||
    input.cardHidden === true ||
    input.cancelled === true ||
    input.bypassLie === true ||
    input.runningHang === true ||
    input.nextMessage === true ||
    input.toolDenialCancelled === true ||
    input.denialKind === TOOL_DENIAL_KIND ||
    input.refusal === USER_REFUSAL
  );
}

export function readBooth(input = {}) {
  const arras = isArrasInput(input);
  const cleared = input.cleared === true && !arras;
  return {
    mark: arras ? "arras" : "cleared",
    cleared,
    arras,
    phantomPrompt: input.phantomPrompt === true || arras,
    cardHidden: input.cardHidden === true,
    cancelled: input.cancelled === true,
    bypassLie: input.bypassLie === true,
    runningHang: input.runningHang === true,
    nextMessage: input.nextMessage === true,
    toolDenialCancelled: input.toolDenialCancelled === true,
    curtain: mapArras(input),
    aisle: inspectAisle(input),
    card: inspectCard(input),
    dagger: inspectDagger(input),
    bypass: inspectBypass(input),
    hang: inspectHang(input),
    refusal: inspectRefusal(input),
    names: CURTAIN_NAMES.filter((row) => curtainOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const ARRAS_WALK = Object.freeze([
  {
    t: "idle",
    event: "curtain-raised",
    cleared: true,
    arras: false,
    cue: "cleared",
    note: "idle HOLD: approval card surfaced; curtain raised; aisle clear",
  },
  {
    t: "hang",
    event: "phantom-prompt",
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
    runningHang: true,
    cue: "arras",
    note: "classifier-escalated call never renders a prompt; no card, no notification; sits running",
  },
  {
    t: "dagger",
    event: "cancelled",
    arras: true,
    cancelled: true,
    nextMessage: true,
    phantomPrompt: true,
    cue: "arras",
    note: "next chat message kills the hung call as toolDenialKind cancelled with a fake user-refusal",
  },
  {
    t: "path",
    event: "phantom-prompt",
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
    cancelled: true,
    bypassLie: true,
    runningHang: true,
    nextMessage: true,
    toolDenialCancelled: true,
    cue: "arras",
    note: "phantom-prompt — card hung behind the arras; Bypass toggle lies; grep allow-rule silently escalated",
  },
  {
    t: "score",
    event: "arras",
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
    cancelled: true,
    bypassLie: true,
    runningHang: true,
    nextMessage: true,
    toolDenialCancelled: true,
    cue: "arras",
    note: "arras — the approval card hangs behind the tapestry so the next message stabs the hung call",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "curtain-raised",
    cleared: true,
    arras: false,
    cue: "cleared",
    note: "positive control: approval card surfaced; aisle clear",
  },
  {
    t: "admit",
    event: "curtain-raised",
    cleared: true,
    cue: "cleared",
    note: "positive control: the gallery admits cleared",
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
    arras: false,
    phantomPrompt: false,
    cue: "cleared",
  };
}

export function seedCleared() {
  return { ...emptyTicket() };
}

export function seedArras() {
  return {
    seed: SEEDED_WORD,
    cleared: false,
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
    cancelled: true,
    bypassLie: true,
    runningHang: true,
    nextMessage: true,
    toolDenialCancelled: true,
    cue: "arras",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ARRAS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    arras: true,
    phantomPrompt: true,
    cue: "arras",
  };
}

export function seedPhantomPrompt() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    arras: true,
    phantomPrompt: true,
    event: "phantom-prompt",
    cue: "arras",
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

export function seedDrapedOpen() {
  return { seed: "draped-open", preferSeed: true, cleared: true, cue: "cleared" };
}

export function seedCardShown() {
  return { seed: "card-shown", preferSeed: true, cleared: true, cue: "cleared" };
}

export function seedPromptVisible() {
  return { seed: "prompt-visible", preferSeed: true, cleared: true, cue: "cleared" };
}

export function seedAisleClear() {
  return { seed: "aisle-clear", preferSeed: true, cleared: true, cue: "cleared" };
}

export function seedCurtainRaised() {
  return { seed: "curtain-raised", preferSeed: true, cleared: true, cue: "cleared" };
}

export function seedCancelled() {
  return {
    seed: "cancelled",
    preferSeed: true,
    cancelled: true,
    cue: "arras",
  };
}

export function seedBypassLie() {
  return {
    seed: "bypass-lie",
    preferSeed: true,
    bypassLie: true,
    cue: "arras",
  };
}

export function seedCardHidden() {
  return {
    seed: "card-hidden",
    preferSeed: true,
    cardHidden: true,
    cue: "arras",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      cleared: false,
      arras: false,
      phantomPrompt: false,
      cardHidden: false,
      cancelled: false,
      bypassLie: false,
      runningHang: false,
      nextMessage: false,
      toolDenialCancelled: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    cleared: raw.cleared === true,
    arras: raw.arras === true || raw.event === "arras",
    phantomPrompt:
      raw.phantomPrompt === true || raw.event === "phantom-prompt",
    cardHidden:
      raw.cardHidden === true || raw.event === "card-hidden",
    cancelled:
      raw.cancelled === true || raw.event === "cancelled",
    bypassLie:
      raw.bypassLie === true || raw.event === "bypass-lie",
    runningHang:
      raw.runningHang === true || raw.event === "running-hang",
    nextMessage:
      raw.nextMessage === true || raw.event === "next-message",
    toolDenialCancelled:
      raw.toolDenialCancelled === true || raw.event === "cancelled-as-refusal",
    cardVisible: raw.cardVisible,
    cardShown: raw.cardShown,
    escalated: raw.escalated,
    denialKind: raw.denialKind,
    refusal: raw.refusal,
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
        ticket.arras != null ||
        ticket.phantomPrompt != null ||
        ticket.cardHidden != null ||
        ticket.cancelled != null ||
        ticket.bypassLie != null ||
        ticket.runningHang != null ||
        ticket.nextMessage != null ||
        ticket.toolDenialCancelled != null ||
        ticket.denialKind != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isCleared(row) {
  if (row.arras && row.cue !== "cleared") return false;
  if (row.cue === "arras" || row.cue === "phantom-prompt") return false;
  if (
    row.phantomPrompt &&
    row.cardHidden &&
    row.cue !== "cleared" &&
    row.cleared !== true
  ) {
    return false;
  }
  if (
    row.cleared === true &&
    row.arras !== true &&
    row.cue !== "arras"
  ) {
    return true;
  }
  if (
    row.cue === "cleared" &&
    row.arras !== true &&
    row.phantomPrompt !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isPhantomPrompt(row) {
  return (
    row.event === "phantom-prompt" &&
    !isCleared(row) &&
    (row.phantomPrompt === true ||
      row.cardHidden === true ||
      row.arras === true)
  );
}

function isArrasRow(row) {
  if (isCleared(row)) return false;
  if (isPhantomPrompt(row) && row.cue !== "arras") return false;
  if (row.cue === "arras") return true;
  if (row.arras === true) return true;
  if (row.phantomPrompt === true && row.cardHidden === true) return true;
  if (
    row.phantomPrompt === true ||
    row.cardHidden === true ||
    row.cancelled === true ||
    row.bypassLie === true ||
    row.runningHang === true ||
    row.nextMessage === true ||
    row.toolDenialCancelled === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one arras pass against the curtain aisle.
 * cleared: approval card surfaced; aisle clear.
 * arras: card hung behind the tapestry; next message cancels.
 * phantom-prompt: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPhantomPrompt(row) ||
    (row.phantomPrompt && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "phantom-prompt";
  } else if (isArrasRow(row)) {
    verdict = "arras";
  } else if (isCleared(row)) {
    verdict = "cleared";
  } else if (
    row.phantomPrompt ||
    row.cardHidden ||
    row.cancelled ||
    row.bypassLie ||
    row.runningHang ||
    row.nextMessage ||
    row.toolDenialCancelled
  ) {
    verdict = "arras";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "arras";
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
    cleared: verdict === "cleared" || verdict === "hold",
    arras: verdict === "arras" || verdict === SEEDED_WORD,
    phantomPrompt:
      row.phantomPrompt === true ||
      verdict === "phantom-prompt" ||
      verdict === PATH_WORD,
    cardHidden: row.cardHidden,
    cancelled: row.cancelled,
    bypassLie: row.bypassLie,
    runningHang: row.runningHang,
    nextMessage: row.nextMessage,
    toolDenialCancelled: row.toolDenialCancelled,
    cue: hold
      ? "cleared"
      : row.phantomPrompt || verdict === "phantom-prompt"
        ? "phantom-prompt"
        : "arras",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit cleared" : "score arras",
    aisleInspect: inspectAisle(row),
    cardInspect: inspectCard(row),
    daggerInspect: inspectDagger(row),
    bypassInspect: inspectBypass(row),
    hangInspect: inspectHang(row),
    refusalInspect: inspectRefusal(row),
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
      : ARRAS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "arras");
  const path = scored.filter((row) => row.verdict === "phantom-prompt");
  const cleared = scored.filter((row) => row.verdict === "cleared");
  const headline =
    scored.find((row) => row.event === "arras") ||
    scored.find((row) => row.event === "phantom-prompt") ||
    scored.find((row) => row.event === "cancelled") ||
    charged[charged.length - 1];
  let verdict = "cleared";
  if (charged.length) verdict = "arras";
  else if (path.length && !cleared.length) {
    verdict = "phantom-prompt";
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
    arrasCount: charged.length,
    pathCount: path.length,
    clearedCount: cleared.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit cleared" : "score arras",
    note: headline
      ? "Desktop Code tab Auto mode: classifier-escalated tool calls sometimes never render an approval card; the call sits running until the next chat message kills it as toolDenialKind cancelled with a fake user-refusal string. Mid-session Bypass Permissions toggle can write config and show Bypass selected while the CLI rejects because the session was not launched with --dangerously-skip-permissions. Cite-only cousins #92053 #85588 #92817 #86478."
      : "published arras walk scored against cleared vs arras",
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
    seeded !== "arras" &&
    seeded !== "phantom-prompt" &&
    ticket.cleared == null &&
    ticket.arras == null &&
    ticket.phantomPrompt == null &&
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
    arras: scored.arras ?? false,
    phantomPrompt: scored.phantomPrompt ?? false,
    cardHidden: scored.cardHidden ?? false,
    cancelled: scored.cancelled ?? false,
    bypassLie: scored.bypassLie ?? false,
    runningHang: scored.runningHang ?? false,
    nextMessage: scored.nextMessage ?? false,
    toolDenialCancelled: scored.toolDenialCancelled ?? false,
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
    result.cardHidden || result.arras
      ? "kind=phantom-prompt"
      : "kind=card-shown",
    result.cancelled || result.arras
      ? "ref=cancelled"
      : "ref=curtain-raised",
    result.phantomPrompt || result.verdict === "phantom-prompt"
      ? "path=phantom-prompt"
      : "path=cleared",
    result.cue === "cleared"
      ? "cue=cleared"
      : result.cue === "phantom-prompt"
        ? "cue=phantom-prompt"
        : "cue=arras",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    cleared: result.cleared,
    arras: result.arras,
    phantomPrompt: result.phantomPrompt,
    cardHidden: result.cardHidden,
    cancelled: result.cancelled,
    bypassLie: result.bypassLie,
    runningHang: result.runningHang,
    nextMessage: result.nextMessage,
    toolDenialCancelled: result.toolDenialCancelled,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    aisle: inspectAisle({
      cleared: result.cleared,
      arras: result.arras,
    }),
    card: inspectCard({
      cleared: result.cleared,
      arras: result.arras,
      cardHidden: result.cardHidden,
    }),
    dagger: inspectDagger({
      cleared: result.cleared,
      arras: result.arras,
      cancelled: result.cancelled,
      nextMessage: result.nextMessage,
    }),
    bypass: inspectBypass({
      cleared: result.cleared,
      arras: result.arras,
      bypassLie: result.bypassLie,
    }),
    hang: inspectHang({
      cleared: result.cleared,
      arras: result.arras,
      runningHang: result.runningHang,
    }),
    refusal: inspectRefusal({
      cleared: result.cleared,
      arras: result.arras,
      cancelled: result.cancelled,
      toolDenialCancelled: result.toolDenialCancelled,
    }),
    curtain: mapArras({
      cleared: result.cleared,
      arras: result.arras,
      phantomPrompt: result.phantomPrompt,
      cardHidden: result.cardHidden,
      cancelled: result.cancelled,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      arras: result.arras === true || result.verdict === "arras",
    })),
    phantomPath: scorePhantomPrompt({
      cleared: result.cleared === true && !result.arras,
      arras: result.arras,
      phantomPrompt: result.phantomPrompt,
      cardHidden: result.cardHidden,
      cancelled: result.cancelled,
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
      names: CURTAIN_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): classifier-escalated Desktop Auto-mode calls sometimes never emit/render the approval card; the next user message cancels the hung call as toolDenialKind cancelled with a fake user-refusal string; a mid-session Bypass toggle can write config while the CLI rejects the mode change. Invite verify against #94348 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
