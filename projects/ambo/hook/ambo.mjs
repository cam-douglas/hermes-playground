/**
 * Ambo — raised reading desk / pulpit
 * overlooking a nave for a real
 * Claude Code defect: a
 * PermissionRequest hook matching
 * ExitPlanMode returns a valid
 * systemMessage. Claude Code
 * accepts it, validates it, and
 * logs success — then the
 * "Ready to code?" approval card
 * never shows it. TUI and VS Code
 * both stay blank. Hook side
 * effects run. Only display is
 * missing. Docs say systemMessage
 * displays for all hooks.
 *
 * The pulpit spoke; the nave never
 * heard. Score the card or admit
 * unheard.
 *
 * Primary #90685: OPEN, filed
 * 2026-08-30. Title:
 * PermissionRequest hook
 * systemMessage is accepted and
 * logged as success but never
 * rendered at the ExitPlanMode
 * approval prompt. Reproduced on
 * 2.1.119 and still on 2.1.251.
 *
 * Related but DISTINCT (cite as
 * contrast, not as this product —
 * those are per-surface drops
 * where terminal sometimes works):
 *   #80693 PreToolUse ask
 *     decisions don't render
 *     permissionDecisionReason /
 *     systemMessage
 *   #78266 UserPromptSubmit
 *     systemMessage dropped in
 *     Desktop / VS Code
 *   #86168 Stop-hook systemMessage
 *     not in VS Code (works in
 *     terminal)
 *   #80882 SessionStart
 *     systemMessage not in VS Code
 *     side panel (works in CLI)
 *   #76736 VS Code SessionStart
 *     systemMessage / statusMessage
 *     / additionalContext never
 *     reach the user
 *   openai/codex#17745 Codex
 *     ignores approval rejection
 *     messages
 *   openai/codex#35906 MCP form
 *     elicitation newlines collapse
 *     in approval UI
 *   openai/codex#33020
 *     PermissionDecision hook
 *     observability proposal
 *
 * This product is the inverse:
 * PermissionRequest at the
 * plan-approval prompt renders on
 * NO surface, terminal included.
 *
 * Verdicts: unheard |
 *           logged-success |
 *           plan-card |
 *           silent-surface |
 *           tui-blank |
 *           vscode-blank |
 *           decision-free |
 *           terminal-sequence-ok |
 *           docs-all-hooks |
 *           deferred-path
 * Idle word is unheard (honest
 * control: systemMessage actually
 * rendered on the approval card).
 * NEVER use unheard for a failure.
 *
 * Slack chip + Linear ticket on
 * logged-success / plan-card /
 * silent-surface / tui-blank /
 * vscode-blank / decision-free /
 * terminal-sequence-ok /
 * docs-all-hooks / deferred-path
 * when this bug (not a labeled
 * contrast). GitHub ambo-ledger of
 * scored intakes on every score.
 *
 * Priority when multiple match:
 *   unique nearby contrast seeds
 *     keep their labels
 *   > logged-success (#90685 triad:
 *     PermissionRequest +
 *     ExitPlanMode + systemMessage
 *     validated + not rendered)
 *   > silent-surface
 *   > plan-card
 *   > tui-blank
 *   > vscode-blank
 *   > decision-free
 *   > terminal-sequence-ok
 *   > docs-all-hooks
 *   > deferred-path
 *   > unheard
 *
 * Why this is not a clone:
 * NOT Slype — sandbox pwsh 126 vs
 *     System32 powershell.
 * NOT Tally — exit birth-count
 *     false-loss.
 * NOT Pale — silent-absent hooks
 *     when project root ≠ repo
 *     root.
 * NOT Chatelaine — nested MCP
 *     OAuth.
 * NOT Waif — orphan process tree.
 * NOT Berth — shared spawn tree.
 * NOT Carrel — launch.json session
 *     cwd.
 * NOT Cotter — machine-shop
 *     cotter-pin tray.
 * Different UI: raised stone ambo,
 * lectern slope, open book, nave
 * pews fading below, ExitPlanMode
 * approval-card overlay. Cinzel +
 * Libre Baskerville + Fira Code.
 * Different idle: unheard.
 */

export const VERDICTS = Object.freeze([
  "unheard",
  "logged-success",
  "plan-card",
  "silent-surface",
  "tui-blank",
  "vscode-blank",
  "decision-free",
  "terminal-sequence-ok",
  "docs-all-hooks",
  "deferred-path",
]);
export const IDLE_WORD = "unheard";
export const SLACK_VERDICTS = Object.freeze([
  "logged-success",
  "plan-card",
  "silent-surface",
  "tui-blank",
  "vscode-blank",
  "decision-free",
  "terminal-sequence-ok",
  "docs-all-hooks",
  "deferred-path",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90685;
export const CONTRAST_80693 = 80693;
export const CONTRAST_78266 = 78266;
export const CONTRAST_86168 = 86168;
export const CONTRAST_80882 = 80882;
export const CONTRAST_76736 = 76736;
export const CODEX_REJECTION = 17745;
export const CODEX_NEWLINES = 35906;
export const CODEX_OBSERVABILITY = 33020;
export const BACKUP_OAUTH_A = 90688;
export const BACKUP_OAUTH_B = 90697;
export const BACKUP_MCP_AUTH = 90677;
export const RELATED_SLYPE = 90676;
export const RELATED_TALLY = 90692;
export const RELATED_PALE = 90683;
export const RELATED_CHATELAINE = 90647;
export const RELATED_WAIF = 90672;

export const DEMO_HOOK = "PermissionRequest";
export const DEMO_TOOL = "ExitPlanMode";
export const DEMO_MESSAGE = "HELLO FROM THE HOOK";
export const DEMO_PROMPT = "Ready to code?";
export const DEMO_VERSION = "2.1.251";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "ambo-pulpit";

const FORBIDDEN_IDLE = Object.freeze([
  "ambo",
  "pulpit",
  "lectern",
  "lecturn",
  "nave",
  "rostrum",
  "dais",
  "chancel",
  "altar",
  "slype",
  "tally",
  "pale",
  "chatelaine",
  "waif",
  "berth",
  "carrel",
  "byline",
  "cotter",
  "grille",
  "wicket",
  "yett",
  "postern",
  "narthex",
  "galilee",
  "undercroft",
  "empty",
  "silent",
  "mute",
  "idle",
  "passed",
  "squared",
  "bound",
  "girt",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "nested",
  "cut",
  "switched",
  "spilled",
  "true",
  "home",
  "gripped",
  "swung",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    hookEvent: "",
    tool: "",
    systemMessage: "",
    hookLogSuccess: null,
    parsedValidated: null,
    rendered: null,
    tuiRendered: null,
    vscodeRendered: null,
    permissionDecision: "",
    terminalSequence: null,
    docsClaimAllHooks: null,
    deferredPath: null,
    prompt: "",
    version: "",
    nearby: "",
    nearbyLoggedSuccess: false,
    nearbyPlanCard: false,
    nearbySilentSurface: false,
    nearbyTuiBlank: false,
    nearbyVscodeBlank: false,
    nearbyDecisionFree: false,
    nearbyTerminalSequenceOk: false,
    nearbyDocsAllHooks: false,
    nearbyDeferredPath: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.ambo && typeof src.ambo === "object") return src.ambo;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.intake && typeof src.intake === "object") return src.intake;
  if (src.card && typeof src.card === "object") return src.card;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    hookEvent: asText(nested.hookEvent || src.hookEvent || ""),
    tool: asText(nested.tool || src.tool || ""),
    systemMessage: asText(nested.systemMessage || src.systemMessage || ""),
    hookLogSuccess: asNullableBool(nested.hookLogSuccess ?? src.hookLogSuccess),
    parsedValidated: asNullableBool(nested.parsedValidated ?? src.parsedValidated),
    rendered: asNullableBool(nested.rendered ?? src.rendered),
    tuiRendered: asNullableBool(nested.tuiRendered ?? src.tuiRendered),
    vscodeRendered: asNullableBool(nested.vscodeRendered ?? src.vscodeRendered),
    permissionDecision: asText(nested.permissionDecision || src.permissionDecision || ""),
    terminalSequence: asNullableBool(nested.terminalSequence ?? src.terminalSequence),
    docsClaimAllHooks: asNullableBool(nested.docsClaimAllHooks ?? src.docsClaimAllHooks),
    deferredPath: asNullableBool(nested.deferredPath ?? src.deferredPath),
    prompt: asText(nested.prompt || src.prompt || ""),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyLoggedSuccess: asBool(nested.nearbyLoggedSuccess ?? src.nearbyLoggedSuccess, false),
    nearbyPlanCard: asBool(nested.nearbyPlanCard ?? src.nearbyPlanCard, false),
    nearbySilentSurface: asBool(nested.nearbySilentSurface ?? src.nearbySilentSurface, false),
    nearbyTuiBlank: asBool(nested.nearbyTuiBlank ?? src.nearbyTuiBlank, false),
    nearbyVscodeBlank: asBool(nested.nearbyVscodeBlank ?? src.nearbyVscodeBlank, false),
    nearbyDecisionFree: asBool(nested.nearbyDecisionFree ?? src.nearbyDecisionFree, false),
    nearbyTerminalSequenceOk: asBool(
      nested.nearbyTerminalSequenceOk ?? src.nearbyTerminalSequenceOk,
      false,
    ),
    nearbyDocsAllHooks: asBool(nested.nearbyDocsAllHooks ?? src.nearbyDocsAllHooks, false),
    nearbyDeferredPath: asBool(nested.nearbyDeferredPath ?? src.nearbyDeferredPath, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

function hookLooksPermissionRequest(event) {
  return /permissionrequest/i.test(asText(event));
}

function toolLooksExitPlanMode(tool) {
  return /exitplanmode/i.test(asText(tool));
}

function promptLooksReadyToCode(prompt) {
  return /ready to code/i.test(asText(prompt));
}

export function isOffAmbo(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "80693" ||
    nearby === "78266" ||
    nearby === "86168" ||
    nearby === "80882" ||
    nearby === "76736" ||
    nearby === "77163" ||
    nearby === "17745" ||
    nearby === "35906" ||
    nearby === "33020" ||
    nearby === "90688" ||
    nearby === "90697" ||
    nearby === "90677" ||
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "tally" ||
    nearby === "90692" ||
    nearby === "pale" ||
    nearby === "90683" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "waif" ||
    nearby === "90672" ||
    nearby === "berth" ||
    nearby === "carrel" ||
    nearby === "cotter" ||
    nearby === "codex" ||
    nearby === "pretooluse" ||
    nearby === "userpromptsubmit" ||
    nearby === "sessionstart" ||
    nearby === "stop"
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.hookEvent ||
    probe.tool ||
    probe.systemMessage ||
    probe.hookLogSuccess != null ||
    probe.parsedValidated != null ||
    probe.rendered != null ||
    probe.tuiRendered != null ||
    probe.vscodeRendered != null ||
    probe.permissionDecision ||
    probe.terminalSequence != null ||
    probe.docsClaimAllHooks != null ||
    probe.deferredPath != null ||
    probe.prompt ||
    probe.version ||
    probe.nearbyLoggedSuccess ||
    probe.nearbyPlanCard ||
    probe.nearbySilentSurface ||
    probe.nearbyTuiBlank ||
    probe.nearbyVscodeBlank ||
    probe.nearbyDecisionFree ||
    probe.nearbyTerminalSequenceOk ||
    probe.nearbyDocsAllHooks ||
    probe.nearbyDeferredPath ||
    isOffAmbo(probe)
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyLoggedSuccess ||
      row.nearbyPlanCard ||
      row.nearbySilentSurface ||
      row.nearbyTuiBlank ||
      row.nearbyVscodeBlank ||
      row.nearbyDecisionFree ||
      row.nearbyTerminalSequenceOk ||
      row.nearbyDocsAllHooks ||
      row.nearbyDeferredPath ||
      isOffAmbo(row),
  );
}

function contrastLabel(row) {
  const nearby = asText(row.nearby).toLowerCase();
  if (nearby === "80693" || nearby === "pretooluse") return "decision-free";
  if (
    nearby === "78266" ||
    nearby === "86168" ||
    nearby === "80882" ||
    nearby === "76736" ||
    nearby === "userpromptsubmit" ||
    nearby === "sessionstart" ||
    nearby === "stop"
  ) {
    return "vscode-blank";
  }
  if (nearby === "77163") return "tui-blank";
  if (
    nearby === "17745" ||
    nearby === "35906" ||
    nearby === "33020" ||
    nearby === "codex" ||
    nearby === "90688" ||
    nearby === "90697" ||
    nearby === "90677" ||
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "tally" ||
    nearby === "90692" ||
    nearby === "pale" ||
    nearby === "90683" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "waif" ||
    nearby === "90672" ||
    nearby === "berth" ||
    nearby === "carrel" ||
    nearby === "cotter"
  ) {
    return "deferred-path";
  }
  return "deferred-path";
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const permissionRequest = hookLooksPermissionRequest(row.hookEvent);
  const exitPlanMode = toolLooksExitPlanMode(row.tool);
  const readyToCode = promptLooksReadyToCode(row.prompt);
  const uniqueNearby = uniqueNearbyOf(row);
  const validated =
    row.hookLogSuccess === true && row.parsedValidated === true && Boolean(row.systemMessage);
  const triad = Boolean(
    permissionRequest && exitPlanMode && validated && row.rendered === false && !uniqueNearby,
  );
  const honestHold = Boolean(row.rendered === true && !uniqueNearby && !isOffAmbo(row));
  const bothBlank = row.tuiRendered === false && row.vscodeRendered === false;

  let eventClass = "idle";
  if (uniqueNearby && !triad) {
    if (row.nearbySilentSurface) eventClass = "silent-surface";
    else if (row.nearbyPlanCard) eventClass = "plan-card";
    else if (row.nearbyTuiBlank) eventClass = "tui-blank";
    else if (row.nearbyVscodeBlank) eventClass = "vscode-blank";
    else if (row.nearbyDecisionFree) eventClass = "decision-free";
    else if (row.nearbyTerminalSequenceOk) eventClass = "terminal-sequence-ok";
    else if (row.nearbyDocsAllHooks) eventClass = "docs-all-hooks";
    else if (row.nearbyDeferredPath) eventClass = "deferred-path";
    else if (row.nearbyLoggedSuccess) eventClass = "logged-success";
    else if (isOffAmbo(row)) eventClass = contrastLabel(row);
  } else if (triad) eventClass = "logged-success";
  else if (bothBlank && validated) eventClass = "silent-surface";
  else if (exitPlanMode && readyToCode && row.rendered === false) eventClass = "plan-card";
  else if (row.tuiRendered === false && row.vscodeRendered === true) eventClass = "tui-blank";
  else if (row.vscodeRendered === false && row.tuiRendered === true) eventClass = "vscode-blank";
  else if (row.systemMessage && !row.permissionDecision && row.rendered === false) {
    eventClass = "decision-free";
  } else if (row.terminalSequence === true && row.rendered === false) {
    eventClass = "terminal-sequence-ok";
  } else if (row.docsClaimAllHooks === true && row.rendered === false) {
    eventClass = "docs-all-hooks";
  } else if (row.deferredPath === true || (validated && row.rendered === false)) {
    eventClass = "deferred-path";
  } else if (honestHold || isIdle(row)) eventClass = "unheard";
  else eventClass = "unheard";

  return {
    permissionRequest,
    exitPlanMode,
    readyToCode,
    uniqueNearby,
    triad,
    honestHold,
    offAmbo: isOffAmbo(row),
    eventClass,
    validated,
    bothBlank,
    hookEvent: row.hookEvent,
    tool: row.tool,
    systemMessage: row.systemMessage,
    hookLogSuccess: row.hookLogSuccess,
    parsedValidated: row.parsedValidated,
    rendered: row.rendered,
    tuiRendered: row.tuiRendered,
    vscodeRendered: row.vscodeRendered,
    permissionDecision: row.permissionDecision,
    terminalSequence: row.terminalSequence,
    docsClaimAllHooks: row.docsClaimAllHooks,
    deferredPath: row.deferredPath,
    prompt: row.prompt,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "unheard";
  const facts = analyze(row);
  if (!facts.triad) {
    if (row.nearbySilentSurface) return "silent-surface";
    if (row.nearbyPlanCard) return "plan-card";
    if (row.nearbyTuiBlank) return "tui-blank";
    if (row.nearbyVscodeBlank) return "vscode-blank";
    if (row.nearbyDecisionFree) return "decision-free";
    if (row.nearbyTerminalSequenceOk) return "terminal-sequence-ok";
    if (row.nearbyDocsAllHooks) return "docs-all-hooks";
    if (row.nearbyDeferredPath) return "deferred-path";
    if (row.nearbyLoggedSuccess) return "logged-success";
    if (facts.offAmbo) return contrastLabel(row);
  }
  if (facts.triad) return "logged-success";
  if (facts.bothBlank && facts.validated) return "silent-surface";
  if (facts.exitPlanMode && facts.readyToCode && row.rendered === false) return "plan-card";
  if (row.tuiRendered === false && row.vscodeRendered === true) return "tui-blank";
  if (row.vscodeRendered === false && row.tuiRendered === true) return "vscode-blank";
  if (row.systemMessage && !row.permissionDecision && row.rendered === false) {
    return "decision-free";
  }
  if (row.terminalSequence === true && row.rendered === false) return "terminal-sequence-ok";
  if (row.docsClaimAllHooks === true && row.rendered === false) return "docs-all-hooks";
  if (row.deferredPath === true || (facts.validated && row.rendered === false)) {
    return "deferred-path";
  }
  if (row.rendered === true) return "unheard";
  return "unheard";
}

export function feedOf(kind) {
  if (kind === "logged-success") {
    return "● Logged-success · PermissionRequest systemMessage accepted, validated, and logged as success · ExitPlanMode Ready-to-code card stays blank · primary #90685";
  }
  if (kind === "plan-card") {
    return "● Plan-card · ExitPlanMode Ready-to-code approval card is the surface that never shows the pulpit";
  }
  if (kind === "silent-surface") {
    return "● Silent-surface · no surface (TUI and VS Code) renders the systemMessage · the inverse of per-surface drops";
  }
  if (kind === "tui-blank") {
    return "● Tui-blank · terminal TUI approval card stays blank · this product, not a VS Code-only drop";
  }
  if (kind === "vscode-blank") {
    return "● Vscode-blank · VS Code approval card stays blank · when this is #90685 both surfaces are blank";
  }
  if (kind === "decision-free") {
    return "● Decision-free · inform-only systemMessage with no allow/deny decision · native flow should pass through";
  }
  if (kind === "terminal-sequence-ok") {
    return "● Terminal-sequence-ok · OSC 9 / OSC 777 / BEL workaround reaches the user · plumbing intact, display path missing";
  }
  if (kind === "docs-all-hooks") {
    return "● Docs-all-hooks · in-product docs claim systemMessage displays for all hooks · the plan-approval prompt is the exception";
  }
  if (kind === "deferred-path") {
    return "● Deferred-path · hook result never reaches the renderer other hook events use · labeled contrast stays labeled";
  }
  return "● Unheard · systemMessage actually rendered on the approval card · idle word is unheard";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "logged-success" || facts.triad) {
    reasons.push(
      "#90685 PermissionRequest systemMessage is accepted and logged as success but never rendered at the ExitPlanMode approval prompt",
    );
  }
  if (row.hookEvent) reasons.push(`hook event ${row.hookEvent}`);
  if (row.tool) reasons.push(`tool ${row.tool}`);
  if (row.systemMessage) reasons.push(`systemMessage ${row.systemMessage}`);
  if (facts.hookLogSuccess === true) reasons.push("debug log writes success");
  if (facts.parsedValidated === true) {
    reasons.push("Successfully parsed and validated hook JSON output");
  }
  if (facts.rendered === false) {
    reasons.push("Ready-to-code approval card never shows the systemMessage");
  }
  if (facts.tuiRendered === false) reasons.push("terminal TUI stays blank");
  if (facts.vscodeRendered === false) reasons.push("VS Code extension stays blank");
  if (facts.bothBlank) reasons.push("no surface (TUI + VS Code) shows it");
  if (row.permissionDecision) reasons.push(`permissionDecision ${row.permissionDecision}`);
  if (!row.permissionDecision && row.systemMessage) {
    reasons.push("decision-free inform-only output; no allow/deny");
  }
  if (facts.terminalSequence === true) {
    reasons.push("terminalSequence OSC 9 / OSC 777 / BEL reaches the user");
  }
  if (facts.docsClaimAllHooks === true) {
    reasons.push("docs say systemMessage displays for all hooks");
  }
  if (facts.deferredPath === true) {
    reasons.push("result never reaches the renderer used by other hook events");
  }
  if (row.prompt) reasons.push(`prompt ${row.prompt}`);
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offAmbo) {
    reasons.push(
      "labeled contrast, not this defect: per-surface drops (#80693 #78266 #86168 #80882 #76736) or Codex nearby (#17745 #35906 #33020). Also not Slype / Tally / Pale / Chatelaine / Waif / Berth / Carrel / Cotter",
    );
  }
  if (kind === "unheard") {
    reasons.push(
      "systemMessage actually rendered on the approval card, or the idle board; idle word is unheard",
    );
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "logged-success") {
    return `Ambo logged-success · ${facts.hookEvent || "PermissionRequest"} · ${facts.tool || "ExitPlanMode"} · validated · card blank · #90685`;
  }
  if (kind === "plan-card") {
    return "Ambo plan-card · ExitPlanMode Ready-to-code card never shows the pulpit";
  }
  if (kind === "silent-surface") {
    return "Ambo silent-surface · TUI and VS Code both blank · inverse of per-surface drops";
  }
  if (kind === "tui-blank") {
    return "Ambo tui-blank · terminal approval card stays blank";
  }
  if (kind === "vscode-blank") {
    return "Ambo vscode-blank · VS Code approval card stays blank";
  }
  if (kind === "decision-free") {
    return "Ambo decision-free · inform-only systemMessage · no allow/deny";
  }
  if (kind === "terminal-sequence-ok") {
    return "Ambo terminal-sequence-ok · OSC/BEL reaches the user · display path missing";
  }
  if (kind === "docs-all-hooks") {
    return "Ambo docs-all-hooks · docs claim all hooks display systemMessage";
  }
  if (kind === "deferred-path") {
    return "Ambo deferred-path · result never reaches the other-events renderer";
  }
  return "";
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offAmbo;
  const alarm = SLACK_VERDICTS.includes(kind) && !off;
  return {
    product: "ambo",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    unheard: kind === "unheard",
    "logged-success": kind === "logged-success",
    "plan-card": kind === "plan-card",
    "silent-surface": kind === "silent-surface",
    "tui-blank": kind === "tui-blank",
    "vscode-blank": kind === "vscode-blank",
    "decision-free": kind === "decision-free",
    "terminal-sequence-ok": kind === "terminal-sequence-ok",
    "docs-all-hooks": kind === "docs-all-hooks",
    "deferred-path": kind === "deferred-path",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "unheard" && !off,
    offAmbo: off,
    slackCopy: slackCopy(kind, facts),
    facts: {
      hookEvent: facts.hookEvent,
      tool: facts.tool,
      systemMessage: facts.systemMessage,
      hookLogSuccess: facts.hookLogSuccess,
      parsedValidated: facts.parsedValidated,
      rendered: facts.rendered,
      tuiRendered: facts.tuiRendered,
      vscodeRendered: facts.vscodeRendered,
      permissionDecision: facts.permissionDecision,
      terminalSequence: facts.terminalSequence,
      docsClaimAllHooks: facts.docsClaimAllHooks,
      deferredPath: facts.deferredPath,
      prompt: facts.prompt,
      version: facts.version,
      triad: facts.triad,
      offAmbo: facts.offAmbo,
      validated: facts.validated,
      bothBlank: facts.bothBlank,
      permissionRequest: facts.permissionRequest,
      exitPlanMode: facts.exitPlanMode,
      nearbyLoggedSuccess: probe.nearbyLoggedSuccess,
      nearbyPlanCard: probe.nearbyPlanCard,
      nearbySilentSurface: probe.nearbySilentSurface,
      nearbyTuiBlank: probe.nearbyTuiBlank,
      nearbyVscodeBlank: probe.nearbyVscodeBlank,
      nearbyDecisionFree: probe.nearbyDecisionFree,
      nearbyTerminalSequenceOk: probe.nearbyTerminalSequenceOk,
      nearbyDocsAllHooks: probe.nearbyDocsAllHooks,
      nearbyDeferredPath: probe.nearbyDeferredPath,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_MARK,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  return boardResult(kind, row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function unheardOf(probe = {}) {
  return classify(probe) === "unheard";
}

export function flagsOf(probe = {}) {
  return analyze(probe);
}

export function reasonsList(probe = {}) {
  return reasonsOf(probe, classify(probe));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    ambo: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedUnheard() {
  return baseSeed("unheard-hold", FEATURED_ISSUE, {
    source: "honest control: systemMessage actually rendered on the approval card",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: true,
    tuiRendered: true,
    vscodeRendered: true,
    permissionDecision: "",
    terminalSequence: false,
    docsClaimAllHooks: true,
    deferredPath: false,
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedUnheard();
}

export function seedReset() {
  return { action: "bail", ambo: emptyProbe() };
}

export function seedLoggedSuccess() {
  return baseSeed("90685-logged-success", FEATURED_ISSUE, {
    source:
      "primary #90685 PermissionRequest systemMessage accepted and logged as success; ExitPlanMode card stays blank",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    terminalSequence: false,
    docsClaimAllHooks: true,
    deferredPath: false,
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
  });
}

export function seed90685() {
  return seedLoggedSuccess();
}

export function seedPlanCard() {
  return baseSeed("90685-plan-card", FEATURED_ISSUE, {
    source: "ExitPlanMode Ready-to-code approval card is the surface that never shows the pulpit",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyPlanCard: true,
  });
}

export function seedSilentSurface() {
  return baseSeed("90685-silent-surface", FEATURED_ISSUE, {
    source: "no surface (TUI and VS Code) renders the systemMessage",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbySilentSurface: true,
  });
}

export function seedTuiBlank() {
  return baseSeed("90685-tui-blank", FEATURED_ISSUE, {
    source: "terminal TUI approval card stays blank",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyTuiBlank: true,
  });
}

export function seedVscodeBlank() {
  return baseSeed("90685-vscode-blank", FEATURED_ISSUE, {
    source: "VS Code approval card stays blank",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyVscodeBlank: true,
  });
}

export function seedDecisionFree() {
  return baseSeed("90685-decision-free", FEATURED_ISSUE, {
    source: "inform-only systemMessage with no allow/deny decision",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyDecisionFree: true,
  });
}

export function seedTerminalSequenceOk() {
  return baseSeed("90685-terminal-sequence-ok", FEATURED_ISSUE, {
    source: "OSC 9 / OSC 777 / BEL workaround reaches the user; display path missing",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    terminalSequence: true,
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyTerminalSequenceOk: true,
  });
}

export function seedDocsAllHooks() {
  return baseSeed("90685-docs-all-hooks", FEATURED_ISSUE, {
    source: "docs claim systemMessage displays for all hooks; plan-approval prompt is the exception",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    docsClaimAllHooks: true,
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyDocsAllHooks: true,
  });
}

export function seedDeferredPath() {
  return baseSeed("90685-deferred-path", FEATURED_ISSUE, {
    source: "hook result never reaches the renderer other hook events use",
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: false,
    vscodeRendered: false,
    permissionDecision: "",
    deferredPath: true,
    prompt: DEMO_PROMPT,
    version: DEMO_VERSION,
    nearbyDeferredPath: true,
  });
}

export function seedContrast78266() {
  return baseSeed("contrast-78266", CONTRAST_78266, {
    source: "NOT this: #78266 UserPromptSubmit systemMessage dropped in Desktop/VS Code",
    nearby: "78266",
    hookEvent: "UserPromptSubmit",
    tool: "",
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
    tuiRendered: true,
    vscodeRendered: false,
    permissionDecision: "",
    prompt: "",
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  unheard: seedUnheard,
  control: seedUnheard,
  healthy: seedUnheard,
  hold: seedUnheard,
  "logged-success": seedLoggedSuccess,
  loggedsuccess: seedLoggedSuccess,
  90685: seedLoggedSuccess,
  "90685": seedLoggedSuccess,
  "plan-card": seedPlanCard,
  plancard: seedPlanCard,
  "silent-surface": seedSilentSurface,
  silentsurface: seedSilentSurface,
  "tui-blank": seedTuiBlank,
  tuiblank: seedTuiBlank,
  "vscode-blank": seedVscodeBlank,
  vscodeblank: seedVscodeBlank,
  "decision-free": seedDecisionFree,
  decisionfree: seedDecisionFree,
  "terminal-sequence-ok": seedTerminalSequenceOk,
  terminalsequenceok: seedTerminalSequenceOk,
  "docs-all-hooks": seedDocsAllHooks,
  docsallhooks: seedDocsAllHooks,
  "deferred-path": seedDeferredPath,
  deferredpath: seedDeferredPath,
  78266: seedContrast78266,
  "78266": seedContrast78266,
  contrast: seedContrast78266,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, ambo: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const ambo = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || ambo.session),
    issue: asIssue(src.issue ?? ambo.issue),
    source: asText(src.source || ambo.source),
    ambo,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.ambo);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("unheard", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedUnheard().ambo;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90685" || verb === "logged-success") {
    probe = seedLoggedSuccess().ambo;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-ambo") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseAmboJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.ambo ||
      raw.probe ||
      raw.intake ||
      raw.card ||
      raw.hookEvent ||
      raw.systemMessage ||
      raw.tool ||
      raw.rendered != null ||
      raw.hookLogSuccess != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parseAmboJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, ambo: emptyProbe() };
}
