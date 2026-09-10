#!/usr/bin/env node
/**
 * Scapegoat — desert / ritual scapegoat-altar booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * claude-in-chrome: an UNGRANTED host makes executeScript-based tools
 * hang their full timeout and blame the page, instead of denying.
 * Messages like "Page still loading (executeScript waited 45000ms for
 * document_idle)" and "Script injection timed out after 5000ms — the
 * page is busy or mid-navigation" are FALSE: readyState complete,
 * visibilityState visible, connection healthy; javascript_tool answers
 * instantly on the same tab in the same browser_batch. computer click
 * on an ungranted domain returns immediate named
 * "Permission denied for this action on this domain".
 *
 *   node scapegoat.mjs data/scapegoat.json
 *   echo '{"seed":"scapegoated"}' | node scapegoat.mjs
 *
 * Idle word is honest (HOLD: check host grant BEFORE waiting for
 * document_idle; return the same immediate named permission denial
 * computer click already returns; name the host; point at site-access
 * UI; never assert page-loading when injection was never established).
 * Seeded word is scapegoated (#93348: ungranted host → executeScript
 * hangs → blame page).
 * Path word is ungranted.
 * Product score word is scapegoat (score scapegoat or admit honest).
 *
 * Encoded from anthropics/claude-code#93348 issue body only.
 * Hypothesis (NON-BINDING): executeScript path does not consult host
 * grant before waiting for document_idle, unlike computer click.
 * Verify against #93348 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "honest",
  "scapegoated",
  "scapegoat",
  "ungranted",
  "hold",
  "execute-script",
  "document-idle",
  "page-blame",
  "grant-check",
  "named-deny",
  "javascript-ok",
  "batch-budget",
  "hmac-grant-loss",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "honest";
export const PATH_WORD = "ungranted";
export const SEEDED_WORD = "scapegoated";
export const PRODUCT_WORD = "scapegoat";
export const HOLD = Object.freeze(["honest", "hold"]);
export const RECOVER = Object.freeze(["honest", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
  "precedence",
  "carrier",
  "moored",
  "primed",
  "raised",
  "preserved",
  "banked",
  "voided",
  "flashed",
  "fallen",
  "scaffold",
  "wedged",
  "bridge-loss",
  "mismatched-header",
  "header-mismatch",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scapegoated" && name !== "scapegoat"),
);

export const FEATURED_ISSUE = 93348;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93348";
export const TITLE =
  "claude-in-chrome: an UNGRANTED host makes executeScript-based tools hang their full timeout and blame the page, instead of denying";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:browser-extension",
  "area:chrome",
]);
export const AUTHOR = "frankacano-dev";
export const FILED = "2026-09-10T12:54:24Z";
export const CLAUDE_CODE_VERSION = "2.1.267";
export const EXTENSION_VERSION = "1.0.91";
export const CHROME_VERSION = "152.0.7977.83";
export const OS = "macOS 26.6.2 (Apple Silicon)";
export const GRANTED_HOST = "www.google.com";
export const UNGRANTED_HOST = "example.com";
export const TEXT_TIMEOUT_MS = 45000;
export const SCREENSHOT_TIMEOUT_MS = 5000;
export const READY_STATE = "complete";
export const VISIBILITY_STATE = "visible";
export const PAGE_TEXT_ERROR =
  "Failed to extract page text: Page still loading (executeScript waited 45000ms for document_idle)";
export const SCREENSHOT_ERROR =
  "Error capturing screenshot: Script injection timed out after 5000ms — the page is busy or mid-navigation";
export const NAMED_DENY =
  "Permission denied for this action on this domain";
export const JS_NAMED_DENY =
  "Permission denied for JavaScript execution on this domain";
export const BATCH_ERROR = "browser_batch did not respond in time";
export const HMAC_NOTE =
  "Chrome resets runtime_granted_permissions whenever HMAC over extensions.settings fails to verify — a hard kill of Chrome can cause it";
export const PHRASE =
  "when an ungranted host makes executeScript hang its full timeout and blame the page instead of denying, score scapegoat or admit honest.";

export const ALTAR_STATIONS = Object.freeze([
  {
    id: "altar",
    rite: "stand at the ash altar",
    kind: "grant",
    note: "check host grant BEFORE waiting for document_idle",
  },
  {
    id: "bell",
    rite: "ring the goat-bell",
    kind: "injection",
    note: "javascript_tool answers instantly; executeScript hangs the full timeout",
  },
  {
    id: "linen",
    rite: "read the bone linen",
    kind: "blame",
    note: "page is readyState complete and visibilityState visible — the loading claim is false",
  },
  {
    id: "grant-table",
    rite: "open the grant-table",
    kind: "deny",
    note: "computer click already returns an immediate named Permission denied for this domain",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "execute-script",
  "document-idle",
  "page-blame",
  "grant-check",
  "named-deny",
  "javascript-ok",
  "batch-budget",
  "hmac-grant-loss",
]);

export const REPRO_TABLE = Object.freeze([
  {
    host: GRANTED_HOST,
    granted: true,
    javascriptTool: "works",
    getPageText: "works",
    screenshot: "works",
  },
  {
    host: UNGRANTED_HOST,
    granted: false,
    javascriptTool: "works",
    getPageText: "45000ms timeout",
    screenshot: "5000ms timeout",
  },
]);

export const INJECTION_PATHS = Object.freeze([
  {
    id: "immediate-eval",
    tools: ["javascript_tool", "navigate", "chrome.tabs reads"],
    onUngranted: "succeeds",
    verdict: "javascript-ok",
  },
  {
    id: "execute-script-idle",
    tools: ["get_page_text", "read_page", "find", "computer screenshot"],
    onUngranted: "hangs to timeout",
    verdict: "execute-script",
  },
  {
    id: "up-front-permission",
    tools: ["computer click"],
    onUngranted: "denies immediately, by name",
    verdict: "named-deny",
  },
]);

export const COUSINS = Object.freeze([
  {
    issue: 92370,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 50842,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 66074,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 71813,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 74696,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 85999,
    title: "related chrome / browser-extension prior art",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93345,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93279,
    title: "HTTP MCP ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93270,
    title: "Workflow kill leaks agents blocking archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93269,
    title: "archive_session live-work names four causes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93265,
    title: "ShipIt non-ASCII env double-encode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93280,
    title: "dame-moji registry",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops flags",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93219,
    title: "Vernier millimeter-slider leftover — do not ship",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover woodworking; forbidden as primary",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "flashpan",
  "clepsydra",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "ephemera",
  "oubliette",
  "buoy",
  "bollard",
  "bitts",
  "hawser",
  "vernier",
  "scion",
  "commutator",
  "heddle",
  "guillotine",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Read the grant-table — host granted, or left ungranted.
 */
export function inspectGrant(input = {}) {
  const host = String(input.host || input.ungrantedHost || input.grantedHost || "");
  const granted =
    input.granted === true ||
    (host === GRANTED_HOST && input.ungranted !== true);
  const ungranted =
    input.ungranted === true ||
    host === UNGRANTED_HOST;
  const grantChecked =
    input.grantCheck === true &&
    input.executeScriptHang !== true &&
    input.pageBlame !== true;
  return {
    host: host || (ungranted ? UNGRANTED_HOST : granted ? GRANTED_HOST : ""),
    granted: granted && !ungranted,
    ungranted: ungranted && !granted,
    grantChecked,
    stamp: ungranted && !grantChecked ? "scapegoated" : "honest",
  };
}

/**
 * Read the three injection paths on the same tab.
 */
export function inspectInjection(input = {}) {
  const javascriptOk =
    input.javascriptOk === true || input.javascriptTool === true;
  const executeScriptHang =
    input.executeScriptHang === true ||
    input.executeScript === true ||
    input.documentIdleWait === true ||
    Number(input.textTimeoutMs) === TEXT_TIMEOUT_MS ||
    Number(input.screenshotTimeoutMs) === SCREENSHOT_TIMEOUT_MS;
  const namedDeny =
    input.namedDeny === true ||
    input.computerClickDeny === true;
  return {
    javascriptOk,
    executeScriptHang: executeScriptHang && !namedDeny,
    namedDeny,
    stamp: namedDeny && !executeScriptHang
      ? "honest"
      : executeScriptHang
        ? "scapegoated"
        : "honest",
  };
}

/**
 * Read whether the timeout message blames the page.
 */
export function inspectBlame(input = {}) {
  const readyComplete =
    input.readyState === READY_STATE || input.readyComplete === true;
  const visible =
    input.visibilityState === VISIBILITY_STATE || input.visible === true;
  const pageBlame =
    input.pageBlame === true ||
    (input.pageStillLoading === true && readyComplete) ||
    Boolean(input.pageTextError && String(input.pageTextError).includes("still loading"));
  const connectionHealthy = input.connectionHealthy !== false;
  return {
    readyComplete,
    visible,
    pageBlame: pageBlame && readyComplete,
    connectionHealthy,
    stamp: pageBlame && readyComplete ? "scapegoated" : "honest",
  };
}

export function readAltar(input = {}) {
  const grant = inspectGrant(input);
  const injection = inspectInjection(input);
  const blame = inspectBlame(input);
  const scapegoated =
    grant.stamp === "scapegoated" ||
    injection.stamp === "scapegoated" ||
    blame.stamp === "scapegoated" ||
    input.scapegoated === true;
  const honest =
    input.honest === true &&
    scapegoated !== true &&
    grant.stamp === "honest";
  return {
    grant,
    injection,
    blame,
    stations: ALTAR_STATIONS,
    scapegoated: scapegoated && !honest,
    honest: honest || (grant.stamp === "honest" && !scapegoated && input.scapegoated !== true),
    cue: scapegoated && !honest ? "scapegoated" : "honest",
  };
}

/**
 * Published scapegoat walk from #93348 only. Facts from the issue body.
 * An honest altar checks host grant before document_idle and returns
 * the same immediate named denial computer click already returns.
 * A scapegoated altar hangs executeScript then blames a complete page.
 */
export const SCAPEGOAT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-honest",
    honest: true,
    grantCheck: true,
    namedDeny: true,
    hostNamed: true,
    siteAccessUi: true,
    pageBlame: false,
    scapegoated: false,
    ungranted: false,
    cue: "honest",
    note: "idle HOLD: check host grant BEFORE waiting for document_idle; return the same immediate named permission denial computer click already returns; name the host; point at site-access UI; never assert page-loading when injection was never established",
  },
  {
    t: "tabs",
    event: "tabs-context",
    tabsContext: true,
    createIfEmpty: true,
    cue: "scapegoated",
    note: "tabs_context_mcp { createIfEmpty: true }",
  },
  {
    t: "nav",
    event: "navigate-ungranted",
    ungranted: true,
    host: UNGRANTED_HOST,
    granted: false,
    cue: "scapegoated",
    note: "navigate to the ungranted host example.com",
  },
  {
    t: "js",
    event: "javascript-ok",
    javascriptOk: true,
    javascriptTool: true,
    readyComplete: true,
    readyState: READY_STATE,
    visibilityState: VISIBILITY_STATE,
    visible: true,
    cue: "scapegoated",
    note: "javascript_tool succeeds; returns real document.title, readyState complete, visibilityState visible",
  },
  {
    t: "inject",
    event: "execute-script",
    executeScript: true,
    executeScriptHang: true,
    textTimeoutMs: TEXT_TIMEOUT_MS,
    cue: "scapegoated",
    note: "get_page_text on the same tab hangs 45000ms for document_idle",
  },
  {
    t: "idle-wait",
    event: "document-idle",
    documentIdleWait: true,
    executeScriptHang: true,
    cue: "scapegoated",
    note: "executeScript waited 45000ms for document_idle",
  },
  {
    t: "blame",
    event: "page-blame",
    pageBlame: true,
    pageStillLoading: true,
    readyComplete: true,
    readyState: READY_STATE,
    pageTextError: PAGE_TEXT_ERROR,
    cue: "scapegoated",
    note: "Failed to extract page text: Page still loading — every clause is false",
  },
  {
    t: "shot",
    event: "screenshot-timeout",
    screenshotTimeout: true,
    screenshotTimeoutMs: SCREENSHOT_TIMEOUT_MS,
    screenshotError: SCREENSHOT_ERROR,
    executeScriptHang: true,
    cue: "scapegoated",
    note: "Error capturing screenshot: Script injection timed out after 5000ms — the page is busy or mid-navigation",
  },
  {
    t: "granted",
    event: "navigate-granted",
    granted: true,
    host: GRANTED_HOST,
    javascriptOk: true,
    getPageTextOk: true,
    screenshotOk: true,
    cue: "scapegoated",
    note: "navigate the same tab to granted www.google.com — get_page_text and screenshot succeed immediately",
  },
  {
    t: "back",
    event: "navigate-back",
    ungranted: true,
    host: UNGRANTED_HOST,
    granted: false,
    executeScriptHang: true,
    cue: "scapegoated",
    note: "navigate back to the ungranted host — fails again immediately; permission fault not transient",
  },
  {
    t: "click",
    event: "named-deny",
    namedDeny: true,
    computerClickDeny: true,
    ungranted: true,
    cue: "scapegoated",
    note: "computer click on an ungranted domain returns Permission denied for this action on this domain — immediate and explicit",
  },
  {
    t: "batch",
    event: "batch-budget",
    batchBudget: true,
    batchError: BATCH_ERROR,
    textTimeoutMs: TEXT_TIMEOUT_MS,
    cue: "scapegoated",
    note: "inside browser_batch a 45s hang blows the response budget; remaining actions discarded",
  },
  {
    t: "hmac",
    event: "hmac-grant-loss",
    hmacGrantLoss: true,
    ungranted: true,
    cue: "scapegoated",
    note: "Chrome can reset runtime_granted_permissions when HMAC over extensions.settings fails (hard kill)",
  },
  {
    t: "cut",
    event: "scapegoated",
    honest: false,
    scapegoated: true,
    ungranted: true,
    executeScriptHang: true,
    documentIdleWait: true,
    pageBlame: true,
    javascriptOk: true,
    readyComplete: true,
    visible: true,
    connectionHealthy: true,
    textTimeoutMs: TEXT_TIMEOUT_MS,
    screenshotTimeoutMs: SCREENSHOT_TIMEOUT_MS,
    cue: "scapegoated",
    note: "ungranted host → executeScript hangs → blame page",
  },
  {
    t: "path",
    event: "ungranted",
    scapegoated: true,
    ungranted: true,
    executeScriptHang: true,
    cue: "scapegoated",
    note: "ungranted — host grant path through executeScript at document_idle",
  },
  {
    t: "score",
    event: "scapegoat",
    scapegoated: true,
    ungranted: true,
    cue: "scapegoated",
    note: "scapegoat — score the altar that hung executeScript and blamed a complete page",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    honest: true,
    grantCheck: true,
    namedDeny: true,
    hostNamed: true,
    siteAccessUi: true,
    pageBlame: false,
    scapegoated: false,
    ungranted: false,
    executeScriptHang: false,
    cue: "honest",
  };
}

export function seedHonest() {
  return { ...emptyTicket() };
}

export function seedScapegoated() {
  return {
    seed: SEEDED_WORD,
    honest: false,
    scapegoated: true,
    ungranted: true,
    host: UNGRANTED_HOST,
    granted: false,
    executeScript: true,
    executeScriptHang: true,
    documentIdleWait: true,
    pageBlame: true,
    pageStillLoading: true,
    javascriptOk: true,
    javascriptTool: true,
    readyComplete: true,
    readyState: READY_STATE,
    visibilityState: VISIBILITY_STATE,
    visible: true,
    connectionHealthy: true,
    textTimeoutMs: TEXT_TIMEOUT_MS,
    screenshotTimeoutMs: SCREENSHOT_TIMEOUT_MS,
    screenshotTimeout: true,
    pageTextError: PAGE_TEXT_ERROR,
    screenshotError: SCREENSHOT_ERROR,
    namedDeny: false,
    grantCheck: false,
    batchBudget: true,
    hmacGrantLoss: true,
    cue: "scapegoated",
    issue: FEATURED_ISSUE,
  };
}

export function seedScapegoat() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    scapegoated: true,
    ungranted: true,
    cue: "scapegoated",
  };
}

export function seedUngranted() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scapegoated: true,
    ungranted: true,
    executeScriptHang: true,
    cue: "scapegoated",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    honest: true,
    cue: "honest",
  };
}

export function seedExecuteScript() {
  return {
    seed: "execute-script",
    preferSeed: true,
    executeScript: true,
    cue: "scapegoated",
  };
}

export function seedDocumentIdle() {
  return {
    seed: "document-idle",
    preferSeed: true,
    documentIdleWait: true,
    cue: "scapegoated",
  };
}

export function seedPageBlame() {
  return {
    seed: "page-blame",
    preferSeed: true,
    pageBlame: true,
    cue: "scapegoated",
  };
}

export function seedGrantCheck() {
  return {
    seed: "grant-check",
    preferSeed: true,
    grantCheck: true,
    cue: "honest",
  };
}

export function seedNamedDeny() {
  return {
    seed: "named-deny",
    preferSeed: true,
    namedDeny: true,
    cue: "scapegoated",
  };
}

export function seedJavascriptOk() {
  return {
    seed: "javascript-ok",
    preferSeed: true,
    javascriptOk: true,
    cue: "scapegoated",
  };
}

export function seedBatchBudget() {
  return {
    seed: "batch-budget",
    preferSeed: true,
    batchBudget: true,
    cue: "scapegoated",
  };
}

export function seedHmacGrantLoss() {
  return {
    seed: "hmac-grant-loss",
    preferSeed: true,
    hmacGrantLoss: true,
    cue: "scapegoated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      honest: false,
      scapegoated: false,
      ungranted: false,
      granted: false,
      grantCheck: false,
      namedDeny: false,
      hostNamed: false,
      siteAccessUi: false,
      executeScript: false,
      executeScriptHang: false,
      documentIdleWait: false,
      pageBlame: false,
      pageStillLoading: false,
      javascriptOk: false,
      javascriptTool: false,
      readyComplete: false,
      visible: false,
      connectionHealthy: false,
      getPageTextOk: false,
      screenshotOk: false,
      screenshotTimeout: false,
      computerClickDeny: false,
      batchBudget: false,
      hmacGrantLoss: false,
      tabsContext: false,
      createIfEmpty: false,
      host: null,
      readyState: null,
      visibilityState: null,
      textTimeoutMs: null,
      screenshotTimeoutMs: null,
      pageTextError: null,
      screenshotError: null,
      batchError: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    honest: raw.honest === true,
    scapegoated: raw.scapegoated === true,
    ungranted: raw.ungranted === true,
    granted: raw.granted === true,
    grantCheck: raw.grantCheck === true,
    namedDeny: raw.namedDeny === true,
    hostNamed: raw.hostNamed === true,
    siteAccessUi: raw.siteAccessUi === true,
    executeScript: raw.executeScript === true,
    executeScriptHang: raw.executeScriptHang === true,
    documentIdleWait: raw.documentIdleWait === true,
    pageBlame: raw.pageBlame === true,
    pageStillLoading: raw.pageStillLoading === true,
    javascriptOk: raw.javascriptOk === true,
    javascriptTool: raw.javascriptTool === true,
    readyComplete: raw.readyComplete === true,
    visible: raw.visible === true,
    connectionHealthy: raw.connectionHealthy === true,
    getPageTextOk: raw.getPageTextOk === true,
    screenshotOk: raw.screenshotOk === true,
    screenshotTimeout: raw.screenshotTimeout === true,
    computerClickDeny: raw.computerClickDeny === true,
    batchBudget: raw.batchBudget === true,
    hmacGrantLoss: raw.hmacGrantLoss === true,
    tabsContext: raw.tabsContext === true,
    createIfEmpty: raw.createIfEmpty === true,
    host: raw.host == null ? null : raw.host,
    readyState: raw.readyState == null ? null : raw.readyState,
    visibilityState: raw.visibilityState == null ? null : raw.visibilityState,
    textTimeoutMs: raw.textTimeoutMs == null ? null : Number(raw.textTimeoutMs),
    screenshotTimeoutMs:
      raw.screenshotTimeoutMs == null ? null : Number(raw.screenshotTimeoutMs),
    pageTextError: raw.pageTextError == null ? null : raw.pageTextError,
    screenshotError: raw.screenshotError == null ? null : raw.screenshotError,
    batchError: raw.batchError == null ? null : raw.batchError,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.honest != null ||
        ticket.scapegoated != null ||
        ticket.ungranted != null ||
        ticket.granted != null ||
        ticket.grantCheck != null ||
        ticket.namedDeny != null ||
        ticket.executeScriptHang != null ||
        ticket.pageBlame != null ||
        ticket.javascriptOk != null ||
        ticket.documentIdleWait != null ||
        ticket.batchBudget != null ||
        ticket.hmacGrantLoss != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isHonest(row) {
  if (row.scapegoated && row.cue !== "honest") return false;
  if (
    row.cue === "scapegoated" ||
    row.cue === "scapegoat" ||
    row.cue === "ungranted"
  ) {
    return false;
  }
  if (row.executeScriptHang && row.cue !== "honest") return false;
  if (row.pageBlame && row.cue !== "honest") return false;
  if (
    row.honest === true &&
    row.scapegoated !== true &&
    row.cue !== "scapegoated"
  ) {
    return true;
  }
  if (
    row.cue === "honest" &&
    row.scapegoated !== true &&
    row.executeScriptHang !== true &&
    row.pageBlame !== true
  ) {
    return true;
  }
  if (
    row.grantCheck === true &&
    row.namedDeny === true &&
    row.hostNamed === true &&
    row.siteAccessUi === true &&
    row.scapegoated !== true &&
    row.executeScriptHang !== true &&
    row.pageBlame !== true
  ) {
    return true;
  }
  return false;
}

function isScapegoated(row) {
  if (isHonest(row)) return false;
  if (row.cue === "scapegoated" || row.cue === "scapegoat") return true;
  if (row.scapegoated === true) return true;
  if (
    row.executeScriptHang === true ||
    row.documentIdleWait === true ||
    row.pageBlame === true
  ) {
    return true;
  }
  if (row.ungranted && row.javascriptOk && row.textTimeoutMs === TEXT_TIMEOUT_MS) {
    return true;
  }
  return false;
}

function isUngrantedPath(row) {
  return (
    row.event === "ungranted" &&
    !isHonest(row) &&
    (row.scapegoated === true || row.ungranted === true || row.executeScriptHang === true)
  );
}

/**
 * Score one altar pass against the scapegoat booth.
 * honest: grant check before document_idle; named deny; host named; no page-blame.
 * scapegoated: ungranted host; executeScript hangs; page blamed while complete.
 * ungranted: named path — host grant through executeScript at document_idle.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isUngrantedPath(row) ||
    (row.ungranted && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "ungranted";
  } else if (isScapegoated(row)) {
    verdict = "scapegoated";
  } else if (isHonest(row)) {
    verdict = "honest";
  } else if (
    row.ungranted ||
    row.executeScriptHang ||
    row.documentIdleWait ||
    row.pageBlame ||
    row.batchBudget ||
    row.hmacGrantLoss ||
    row.screenshotTimeout
  ) {
    verdict = "scapegoated";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const grant = inspectGrant(row);
  const injection = inspectInjection(row);
  const blame = inspectBlame(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    honest: verdict === "honest" || verdict === "hold",
    scapegoated:
      verdict === "scapegoated" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    ungranted:
      row.ungranted === true ||
      verdict === "ungranted" ||
      verdict === PATH_WORD,
    granted: row.granted,
    grantCheck: row.grantCheck,
    namedDeny: row.namedDeny,
    hostNamed: row.hostNamed,
    siteAccessUi: row.siteAccessUi,
    executeScript: row.executeScript,
    executeScriptHang: row.executeScriptHang,
    documentIdleWait: row.documentIdleWait,
    pageBlame: row.pageBlame,
    pageStillLoading: row.pageStillLoading,
    javascriptOk: row.javascriptOk,
    javascriptTool: row.javascriptTool,
    readyComplete: row.readyComplete,
    visible: row.visible,
    connectionHealthy: row.connectionHealthy,
    getPageTextOk: row.getPageTextOk,
    screenshotOk: row.screenshotOk,
    screenshotTimeout: row.screenshotTimeout,
    computerClickDeny: row.computerClickDeny,
    batchBudget: row.batchBudget,
    hmacGrantLoss: row.hmacGrantLoss,
    tabsContext: row.tabsContext,
    createIfEmpty: row.createIfEmpty,
    host: row.host,
    readyState: row.readyState,
    visibilityState: row.visibilityState,
    textTimeoutMs: row.textTimeoutMs,
    screenshotTimeoutMs: row.screenshotTimeoutMs,
    pageTextError: row.pageTextError,
    screenshotError: row.screenshotError,
    batchError: row.batchError,
    cue: hold ? "honest" : "scapegoated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit honest" : "score scapegoat",
    grant,
    injection,
    blame,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : SCAPEGOAT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const scapegoated = scored.filter((row) => row.verdict === "scapegoated");
  const path = scored.filter((row) => row.verdict === "ungranted");
  const honest = scored.filter((row) => row.verdict === "honest");
  const headline =
    scored.find((row) => row.event === "scapegoated") ||
    scored.find((row) => row.event === "page-blame") ||
    scored.find((row) => row.event === "ungranted") ||
    scapegoated[scapegoated.length - 1];
  let verdict = "honest";
  if (scapegoated.length) verdict = "scapegoated";
  else if (path.length && !honest.length) verdict = "ungranted";
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
    scapegoatedCount: scapegoated.length,
    pathCount: path.length,
    honestCount: honest.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit honest" : "score scapegoat",
    note: headline
      ? "claude-in-chrome; ungranted host; executeScript hangs; page blamed while complete; javascript_tool still answers; computer click denies by name."
      : "published scapegoat walk scored against honest vs scapegoated",
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
    seeded !== "honest" &&
    seeded !== "scapegoated" &&
    seeded !== "ungranted" &&
    seeded !== "scapegoat" &&
    ticket.honest == null &&
    ticket.scapegoated == null &&
    ticket.ungranted == null &&
    ticket.executeScriptHang == null &&
    ticket.pageBlame == null &&
    ticket.grantCheck == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    honest: scored.honest ?? false,
    scapegoated: scored.scapegoated ?? false,
    ungranted: scored.ungranted ?? false,
    executeScriptHang: scored.executeScriptHang ?? false,
    documentIdleWait: scored.documentIdleWait ?? false,
    pageBlame: scored.pageBlame ?? false,
    javascriptOk: scored.javascriptOk ?? false,
    namedDeny: scored.namedDeny ?? false,
    grantCheck: scored.grantCheck ?? false,
    batchBudget: scored.batchBudget ?? false,
    hmacGrantLoss: scored.hmacGrantLoss ?? false,
    readyComplete: scored.readyComplete ?? false,
    visible: scored.visible ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.ungranted || result.host === UNGRANTED_HOST ? "host=ungranted" : "host=granted",
    result.executeScriptHang ? "inject=hang" : "inject=checked",
    result.pageBlame ? "blame=page" : "blame=named",
    result.javascriptOk ? "js=ok" : "js=unknown",
    result.cue === "honest" ? "cue=honest" : "cue=scapegoated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const altar = readAltar({
    honest: result.honest,
    scapegoated: result.scapegoated,
    ungranted: result.ungranted,
    granted: result.granted,
    grantCheck: result.grantCheck,
    namedDeny: result.namedDeny,
    executeScriptHang: result.executeScriptHang,
    documentIdleWait: result.documentIdleWait,
    pageBlame: result.pageBlame,
    javascriptOk: result.javascriptOk,
    javascriptTool: result.javascriptTool,
    readyComplete: result.readyComplete,
    visible: result.visible,
    connectionHealthy: result.connectionHealthy,
    host: result.host,
    textTimeoutMs: result.textTimeoutMs,
    screenshotTimeoutMs: result.screenshotTimeoutMs,
    pageTextError: result.pageTextError,
    computerClickDeny: result.computerClickDeny,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    altar,
    grant: inspectGrant({
      host: result.host,
      granted: result.granted,
      ungranted: result.ungranted,
      grantCheck: result.grantCheck,
      executeScriptHang: result.executeScriptHang,
      pageBlame: result.pageBlame,
    }),
    injection: inspectInjection({
      javascriptOk: result.javascriptOk,
      javascriptTool: result.javascriptTool,
      executeScriptHang: result.executeScriptHang,
      executeScript: result.executeScript,
      documentIdleWait: result.documentIdleWait,
      namedDeny: result.namedDeny,
      computerClickDeny: result.computerClickDeny,
      textTimeoutMs: result.textTimeoutMs,
      screenshotTimeoutMs: result.screenshotTimeoutMs,
    }),
    blame: inspectBlame({
      readyState: result.readyState,
      readyComplete: result.readyComplete,
      visibilityState: result.visibilityState,
      visible: result.visible,
      pageBlame: result.pageBlame,
      pageStillLoading: result.pageStillLoading,
      pageTextError: result.pageTextError,
      connectionHealthy: result.connectionHealthy,
    }),
    stations: ALTAR_STATIONS.map((row) => ({
      ...row,
      scapegoated: result.scapegoated === true || result.verdict === "scapegoated",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      extensionVersion: EXTENSION_VERSION,
      chromeVersion: CHROME_VERSION,
      os: OS,
      grantedHost: GRANTED_HOST,
      ungrantedHost: UNGRANTED_HOST,
      textTimeoutMs: TEXT_TIMEOUT_MS,
      screenshotTimeoutMs: SCREENSHOT_TIMEOUT_MS,
      readyState: READY_STATE,
      visibilityState: VISIBILITY_STATE,
      pageTextError: PAGE_TEXT_ERROR,
      screenshotError: SCREENSHOT_ERROR,
      namedDeny: NAMED_DENY,
      jsNamedDeny: JS_NAMED_DENY,
      batchError: BATCH_ERROR,
      hmacNote: HMAC_NOTE,
      reproTable: REPRO_TABLE,
      injectionPaths: INJECTION_PATHS,
      stations: ALTAR_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "get_page_text, read_page, find and computer screenshot should check the host grant before waiting for document_idle, and return the same immediate named error that computer click already returns — ideally naming the host and pointing at the extension's site-access UI",
        "failing that, the timeout message should not assert that the page is loading when the extension has not established that it can inject at all",
      ],
      hypothesis:
        "NON-BINDING: executeScript path does not consult host grant before waiting for document_idle, unlike computer click. Verify against #93348 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
