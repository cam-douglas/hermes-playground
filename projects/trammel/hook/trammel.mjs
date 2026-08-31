#!/usr/bin/env node
/**
 * Trammel — drafting-office Archimedean trammel / split-sash classifier.
 * A hunting trammel is not a hold. Score the grooves or admit traced.
 *
 *   echo '{"twoVisiblePanels":true,"windowRegainedFocus":true}' | node trammel.mjs
 *   node trammel.mjs ticket.json
 *
 * Idle word is traced (only the active pane restores the composer;
 * the ellipse is true). Seeded state is hunting / #90936.
 * NEVER idle as "trammel", "hunting", "oscillating", "stolen",
 * "ping-pong", "focus", "flicker", "split", "loop", "soundpost",
 * "coupled", "fallen", "struck", "torn", "seated".
 *
 * Primary #90936: two Claude webview panels visible in split editor
 * groups. Each iframe registers a window-level focus listener that
 * restores its composer, guarded only by document.activeElement.
 * activeElement is per-document, so the unfocused panel's body
 * passes the guard. visibility_changed carries only isVisible.
 * WebviewPanel.visible is true for the active tab of each group.
 * panel.active is tracked in the extension but not sent.
 * setTimeout(..., 0) keeps the two cycles offset. Window regain
 * starts a mutual steal loop; caret flickers; typing is impossible.
 *
 * Contrast / workaround: same editor group → only one visible →
 * no loop. NOT Soundpost #90926, Flong #90916, Bulla #90891,
 * Trompe #90881, Davy #90886, Moviola #90716, Census #90927,
 * Callboard #90858. Same-class cite (not primary): #71809,
 * #79770, #89975, #32726, #74808.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "hunting",
  "traced",
  "split",
  "visible-not-active",
  "per-document",
  "body-guard",
  "timeout-offset",
  "steal-loop",
  "iframe-focus",
  "no-isActive",
  "dual-visible",
  "flicker",
]);
export const IDLE_WORD = "traced";
export const SEEDED_WORD = "hunting";
export const HOLD_VERDICTS = Object.freeze(["traced"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "traced"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90936;
export const PRIMARY_ISSUES = Object.freeze([90936]);
export const SAME_CLASS = Object.freeze([71809, 79770, 89975, 32726, 74808]);
export const CONTRAST_NOTE = "same editor group → only one visible → no loop";
export const NOT_PRODUCTS = Object.freeze([
  "soundpost",
  "flong",
  "bulla",
  "trompe",
  "davy",
  "moviola",
  "census",
  "callboard",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90936";
export const TITLE =
  "[BUG] VS Code extension: focus ping-pongs between two visible Claude panels when the window regains focus (refs #71809, #79770)";
export const REPORTER = "HwangYoonSeong";
export const FILED_AT = "2026-08-31T08:44:35Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:ide",
  "platform:vscode",
]);
export const EXTENSION = "anthropic.claude-code";
export const EXTENSION_VERSION = "2.1.251";
export const VSCODE = "1.134.0";
export const OS_NAME = "macOS arm64";
export const HUB_LINE =
  "18:50 trammel: a hunting trammel is not a hold. Score the grooves or admit traced.";
export const MARK = "18:50 / hermes catalog #92 / #90936";
export const PHRASE = "a hunting trammel is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "trammel",
  "hunting",
  "oscillating",
  "stolen",
  "ping-pong",
  "focus",
  "flicker",
  "split",
  "loop",
  "soundpost",
  "coupled",
  "fallen",
  "struck",
  "torn",
  "seated",
]);

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    twoVisiblePanels: null,
    windowRegainedFocus: null,
    perDocumentActiveElement: null,
    visibilityIsVisibleOnly: null,
    panelActiveOmitted: null,
    timeoutOffset: null,
    sameEditorGroup: null,
    inputFlicker: null,
    typingImpossible: null,
    activePanelRestoresOnly: null,
    isActiveSent: null,
    bodyGuard: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedTraced();
}

export function seedTraced() {
  return {
    seed: IDLE_WORD,
    issue: null,
    twoVisiblePanels: true,
    windowRegainedFocus: true,
    perDocumentActiveElement: true,
    visibilityIsVisibleOnly: false,
    panelActiveOmitted: false,
    timeoutOffset: false,
    sameEditorGroup: false,
    inputFlicker: false,
    typingImpossible: false,
    activePanelRestoresOnly: true,
    isActiveSent: true,
    bodyGuard: false,
    outputText:
      "only the active panel restores composer; isActive travels with visibility_changed; ellipse is true",
  };
}

export function seedHunting() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    extension: EXTENSION,
    extensionVersion: EXTENSION_VERSION,
    vscode: VSCODE,
    os: OS_NAME,
    twoVisiblePanels: true,
    windowRegainedFocus: true,
    perDocumentActiveElement: true,
    visibilityIsVisibleOnly: true,
    panelActiveOmitted: true,
    timeoutOffset: true,
    sameEditorGroup: false,
    inputFlicker: true,
    typingImpossible: true,
    activePanelRestoresOnly: false,
    isActiveSent: false,
    bodyGuard: true,
    sameClass: [...SAME_CLASS],
    outputText:
      "two visible Claude webviews in split editor groups; window regains OS focus; each iframe window-level focus listener restores composer; guard is document.activeElement === body; per-document activeElement; visibility_changed carries only isVisible; panel.active tracked but not sent; setTimeout(..., 0) offsets the two cycles; caret flickers; typing is impossible",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.trammel && typeof src.trammel === "object" && src.trammel) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    twoVisiblePanels: firstBool(
      nested.twoVisiblePanels,
      nested.two_visible_panels,
      nested.dualVisible,
      src.twoVisiblePanels,
    ),
    windowRegainedFocus: firstBool(
      nested.windowRegainedFocus,
      nested.window_regained_focus,
      src.windowRegainedFocus,
    ),
    perDocumentActiveElement: firstBool(
      nested.perDocumentActiveElement,
      nested.per_document_active_element,
      src.perDocumentActiveElement,
    ),
    visibilityIsVisibleOnly: firstBool(
      nested.visibilityIsVisibleOnly,
      nested.visibility_is_visible_only,
      src.visibilityIsVisibleOnly,
    ),
    panelActiveOmitted: firstBool(
      nested.panelActiveOmitted,
      nested.panel_active_omitted,
      src.panelActiveOmitted,
    ),
    timeoutOffset: firstBool(
      nested.timeoutOffset,
      nested.timeout_offset,
      src.timeoutOffset,
    ),
    sameEditorGroup: firstBool(
      nested.sameEditorGroup,
      nested.same_editor_group,
      src.sameEditorGroup,
    ),
    inputFlicker: firstBool(
      nested.inputFlicker,
      nested.input_flicker,
      src.inputFlicker,
    ),
    typingImpossible: firstBool(
      nested.typingImpossible,
      nested.typing_impossible,
      src.typingImpossible,
    ),
    activePanelRestoresOnly: firstBool(
      nested.activePanelRestoresOnly,
      nested.active_panel_restores_only,
      src.activePanelRestoresOnly,
    ),
    isActiveSent: firstBool(
      nested.isActiveSent,
      nested.is_active_sent,
      src.isActiveSent,
    ),
    bodyGuard: firstBool(nested.bodyGuard, nested.body_guard, src.bodyGuard),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const missingCore =
    input.twoVisiblePanels == null &&
    input.windowRegainedFocus == null &&
    input.activePanelRestoresOnly == null;
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && missingCore) {
    return { ...seedHunting(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && missingCore) {
    return { ...seedHunting(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && missingCore) {
    return { ...seedTraced(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const twoVisible =
    row.twoVisiblePanels === true ||
    /two visible|two (Claude )?(webview )?panels|split editor groups/i.test(text);
  const sameGroup =
    row.sameEditorGroup === true ||
    /same editor group|only one (tab|panel) .*visible/i.test(text);
  const windowFocus =
    row.windowRegainedFocus === true ||
    /window regains|regains? (OS )?focus|Cmd\+Tab|Alt\+Tab/i.test(text);
  const perDoc =
    row.perDocumentActiveElement === true ||
    /per-document|own document|activeElement is per-document/i.test(text);
  const visOnly =
    row.visibilityIsVisibleOnly === true ||
    /visibility_changed carries only isVisible|isVisible only|only `?isVisible`?/i.test(
      text,
    );
  const noActive =
    row.panelActiveOmitted === true ||
    row.isActiveSent === false ||
    /panel\.active is already tracked|not sent to the webview|no isActive|carries only isVisible/i.test(
      text,
    );
  const timeout =
    row.timeoutOffset === true ||
    /setTimeout\(\s*\.\.\.\s*,\s*0\s*\)|setTimeout.*,\s*0|cycles offset/i.test(text);
  const flicker =
    row.inputFlicker === true ||
    /caret .*flicker|input box visibly flickers|flicker/i.test(text);
  const typingDead =
    row.typingImpossible === true ||
    /typing is (impossible|disrupted)/i.test(text);
  const activeOnly =
    row.activePanelRestoresOnly === true ||
    /only the active panel (should )?restore/i.test(text);
  const iframe =
    perDoc ||
    /own iframe|each (Claude )?panel is its own iframe/i.test(text);
  const bodyGuard =
    row.bodyGuard === true ||
    /activeElement === document\.body|guard is document\.activeElement|unfocused panel's activeElement is `?body`?/i.test(
      text,
    ) ||
    (perDoc && !activeOnly);
  const split = (twoVisible && !sameGroup) || /split editor/i.test(text);
  const dualVisible =
    twoVisible ||
    /WebviewPanel\.visible === true|active tab of each group/i.test(text);
  const visNotActive = dualVisible && noActive && !activeOnly;
  const stealLoop =
    twoVisible &&
    windowFocus &&
    perDoc &&
    !sameGroup &&
    !activeOnly;
  const hunting =
    twoVisible &&
    windowFocus &&
    perDoc &&
    visOnly &&
    noActive &&
    timeout &&
    !sameGroup &&
    !activeOnly;
  const contrastGroup = sameGroup && !twoVisible;
  const traced = activeOnly && !hunting;
  return {
    twoVisible,
    sameGroup,
    windowFocus,
    perDoc,
    visOnly,
    noActive,
    timeout,
    flicker,
    typingDead,
    activeOnly,
    iframe,
    bodyGuard,
    split,
    dualVisible,
    visNotActive,
    stealLoop,
    hunting,
    traced,
    contrastGroup,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.hunting) chips.push("hunting");
  if (flags.traced) chips.push("traced");
  if (flags.split && !flags.traced) chips.push("split");
  if (flags.visNotActive && !flags.traced) chips.push("visible-not-active");
  if (flags.perDoc && !flags.traced) chips.push("per-document");
  if (flags.bodyGuard && !flags.traced) chips.push("body-guard");
  if (flags.timeout && !flags.traced) chips.push("timeout-offset");
  if (flags.stealLoop && !flags.traced) chips.push("steal-loop");
  if (flags.iframe && !flags.traced) chips.push("iframe-focus");
  if (flags.noActive && !flags.traced) chips.push("no-isActive");
  if (flags.dualVisible && !flags.traced) chips.push("dual-visible");
  if ((flags.flicker || flags.typingDead) && !flags.traced) chips.push("flicker");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "traced") {
    reasons.push(
      "only the active panel restores composer; the ellipse is true",
    );
    reasons.push("hold: this is a traced groove, not a hunting trammel");
  }
  if (flags.twoVisible) {
    reasons.push(
      "two Claude webview panels are visible at once in split editor groups",
    );
  }
  if (flags.windowFocus) {
    reasons.push(
      "VS Code window lost and then regained OS focus (Cmd+Tab / Alt+Tab)",
    );
  }
  if (flags.perDoc || flags.iframe) {
    reasons.push(
      "each webview is its own iframe with its own document; document.activeElement is per-document",
    );
  }
  if (flags.bodyGuard) {
    reasons.push(
      "window-level focus listener restores composer when !activeElement || activeElement === body",
    );
  }
  if (flags.visOnly) {
    reasons.push(
      "visibility_changed carries only isVisible; WebviewPanel.visible is true for the active tab of each group",
    );
  }
  if (flags.noActive) {
    reasons.push(
      "panel.active is tracked in onDidChangeViewState but is not sent to the webview",
    );
  }
  if (flags.timeout) {
    reasons.push(
      "setTimeout(..., 0) keeps the two panels' focus cycles offset, sustaining the loop",
    );
  }
  if (flags.flicker || flags.typingDead) {
    reasons.push(
      "input box flickers between the two composers; typing is impossible until a click breaks it",
    );
  }
  if (flags.sameGroup) {
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.hunting) {
    reasons.push(
      "isVisible ≠ isActive: both visible panels believe they should own focus",
    );
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags, chips) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.traced) return "traced";
  if (named === SEEDED_WORD || flags.hunting) return "hunting";
  if (VERDICTS.includes(named) && chips.includes(named) && named !== IDLE_WORD) {
    return named;
  }
  if (flags.hunting) return "hunting";
  if (flags.traced) return "traced";
  if (flags.stealLoop) return "steal-loop";
  if (flags.flicker || flags.typingDead) return "flicker";
  if (flags.timeout) return "timeout-offset";
  if (flags.bodyGuard) return "body-guard";
  if (flags.visNotActive) return "visible-not-active";
  if (flags.noActive) return "no-isActive";
  if (flags.dualVisible) return "dual-visible";
  if (flags.perDoc) return "per-document";
  if (flags.iframe) return "iframe-focus";
  if (flags.split) return "split";
  return "traced";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "traced";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    traced: verdict === "traced" || flags.traced,
    hunting: verdict === "hunting" || flags.hunting,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      split: flags.twoVisible
        ? "two visible Claude webviews in split editor groups"
        : "not two visible panels",
      sash: flags.windowFocus
        ? "window regained OS focus"
        : "window has not regained focus",
      groove: flags.activeOnly
        ? "only the active panel restores composer (traced)"
        : flags.sameGroup
          ? CONTRAST_NOTE
          : "isVisible without isActive; per-document body-guard",
      note: flags.hunting
        ? "A hunting trammel is not a hold. Two visible iframes, window regain, per-document activeElement, visibility isVisible-only, setTimeout 0 offset."
        : "Traced: only the active pane holds the caret and the ellipse is true.",
    },
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 90936 || name === "90936") {
    return analyze(seedHunting());
  }
  if (name === IDLE_WORD || name === "traced") {
    return analyze(seedTraced());
  }
  return analyze(seedTraced());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.hunting
        ? `hunting trammel #${FEATURED_ISSUE}: two visible Claude webviews, window regain, per-document body-guard, isVisible-only, setTimeout 0 offset loop.`
        : `traced trammel. Idle word ${IDLE_WORD}. Only the active panel restores composer.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
