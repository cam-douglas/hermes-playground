#!/usr/bin/env node
/**
 * Simulacrum — Baudrillard / hyperreality museum booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude in Chrome (extension 1.0.92) via mcp__claude-in-chrome__*
 * on Windows 11 / Edge. With no browser process running,
 * list_connected_browsers still reports a connected local browser
 * (isLocal: true, advancing connectedAt). navigate returns
 * "Navigated to <url>" with a real tab id and does nothing — no tab,
 * no window, no error. Opening a real browser leaves the registration
 * byte-identical; switch_browser says "No other browsers available"
 * while the dead registration is still served. Not the stale-name
 * cache in #78096 — there is no browser behind it. No in-band way to
 * tell real success from false; get_page_text then hangs ~45s on
 * document_idle, producing a confident wrong diagnosis ("site is
 * slow"). Manual reconnect works once; silent failure returned ~90m
 * later (extension dir rewritten — correlation only).
 *
 *   node simulacrum.mjs data/hollow.json
 *   echo '{"seed":"hollow"}' | node simulacrum.mjs
 *
 * Idle word is tethered (HOLD: real extension reachable; navigate
 * actually drives a live window).
 * Seeded word is hollow (#93751 — success string + tab id with no
 * browser process).
 * Path word is phantom-navigate.
 * Product score word is simulacrum (Score simulacrum or admit tethered.).
 *
 * Encoded from anthropics/claude-code#93751 issue text only.
 * Hypothesis (NON-BINDING): the MCP host keeps serving a dead
 * registration after the browser process is gone, so list/navigate
 * return connected + success with nothing behind the glass. The ~90m
 * recurrence correlated with an extension-directory rewrite — offered
 * as correlation, not proven cause. Verify against #93751 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "tethered",
  "hollow",
  "simulacrum",
  "phantom-navigate",
  "hold",
  "reachable",
  "live-window",
  "process-present",
  "no-browser-process",
  "list-connected-lie",
  "navigate-false-success",
  "tab-id-hollow",
  "switch-browser-disagree",
  "document-idle-hang",
  "reconnect-not-durable",
  "not-78096",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "tethered";
export const PATH_WORD = "phantom-navigate";
export const SEEDED_WORD = "hollow";
export const PRODUCT_WORD = "simulacrum";
export const HOLD = Object.freeze(["tethered", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "tethered",
  "reachable",
  "live-window",
  "process-present",
]);
export const RECOVER = Object.freeze(["tethered", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "unreaped-ampersand",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
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
  "scapegoat",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "hollow" && name !== "simulacrum"),
);

export const FEATURED_ISSUE = 93751;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93751";
export const TITLE =
  "Claude in Chrome: list_connected_browsers reports a live local browser with no browser running, and navigate returns success while doing nothing";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:windows",
  "area:chrome",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "Claude in Chrome 1.0.92 / Claude Code desktop 2.1.260";
export const GOOD_VERSION =
  "list reports only a reachable extension; navigate fails loudly when no browser process is running";
export const SURFACE = "claude-in-chrome-mcp";
export const HOST = "windows-edge";
export const INSTALL_PATH = "mcp__claude-in-chrome__*";
export const COMMAND =
  "close every browser; confirm no msedge/chrome process; list_connected_browsers; navigate; open a real browser; switch_browser";
export const PHRASE = "Score simulacrum or admit tethered.";
export const DISTRIBUTION =
  "Claude in Chrome extension 1.0.92 (1.0.91 also present on disk), driven from Claude Code via mcp__claude-in-chrome__*. Windows 11, Microsoft Edge (stable), single install, single profile, one extension. Claude Code desktop 2.1.260. With no browser process running, list_connected_browsers returns one entry, isLocal: true, connectedAt 1789165039624 advancing. navigate returns \"Navigated to <url>\" plus tabId 410375950; no tab, no window, no error. After launching the browser with no other action the list entry is byte-identical (same connectedAt). switch_browser returns \"No other browsers available to switch to.\" Reconnecting the extension from its toolbar button refreshes connectedAt and one navigate then works. get_page_text on the returned tab id hung ~45s on document_idle, twice. ~90 minutes later the same silent failure returned across two independent sessions; the extension directory on disk had been rewritten in the interval — correlation only, not proven cause. This is not the stale-name/caching problem in #78096 — the entry is not merely mislabelled; there is no browser behind it.";
export const RULED_OUT = Object.freeze([
  "The stale-name / per-session cache in #78096 — that issue mislabels a living browser; here there is no browser process behind the registration",
  "A missing list entry — list_connected_browsers does return a connected local browser",
  "An in-band tab-state disagreement as a success detector — the second tab-state block is pre-call by documented design and disagrees on real successes too",
]);
export const EXPECTED = Object.freeze([
  "list_connected_browsers should not report a browser that has no running process, or should carry a field distinguishing registered from currently reachable",
  "navigate and other page-acting tools should fail loudly when the target extension is not reachable, rather than returning a success string and a tab id",
  "switch_browser returning no browsers available and list_connected_browsers returning one should not be able to disagree",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "wax-mannequin", label: "hollow CRT", count: "gallery", note: "wax-museum mannequin / CRT that reports Navigated with nothing behind the glass" },
  { id: "list-rail", label: "list vs switch", count: "disagree", note: "list serves a dead local registration; switch_browser says no other browsers available" },
  { id: "nav-stamp", label: "Navigated stamp", count: "tab-id", note: "success string + real tab id; no tab, no window, no error" },
  { id: "idle-hang", label: "document_idle", count: "~45s", note: "get_page_text hangs; confident wrong diagnosis that the site is slow" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "tethered-gate",
    survey: "real extension reachable; navigate actually drives a live window",
    kind: "tethered",
    note: "idle: the glass has a process behind it — the hold/good path",
  },
  {
    id: "list-connected-lie",
    survey: "no browser process; list_connected_browsers still reports isLocal: true with advancing connectedAt",
    kind: "hollow",
    note: "seeded: the vitrine labels a mannequin as connected",
  },
  {
    id: "navigate-false-success",
    survey: "navigate returns Navigated to <url> with a real tab id and does nothing",
    kind: "hollow",
    note: "seeded: phosphor stamp of success; process meter still zero",
  },
  {
    id: "switch-browser-disagree",
    survey: "opening a real browser leaves the registration byte-identical; switch_browser says no other browsers available",
    kind: "hollow",
    note: "seeded: list and switch answer the same question differently",
  },
  {
    id: "phantom-navigate",
    survey: "success string + tab id with no browser process — no in-band way to tell real success from false",
    kind: "hollow",
    note: "path: phantom-navigate names the hollow success the page tools then hang on",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "phantom-navigate",
  "hollow",
  "list-connected-lie",
  "navigate-false-success",
  "tab-id-hollow",
]);

export const COUSINS = Object.freeze([
  {
    issue: 78096,
    title: "Claude in Chrome (v1.0.80): list_connected_browsers is stale/cached, isLocal misreports host, and name↔deviceId can't be joined",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — stale-name / cache on a living browser; different problem: here there is no browser behind the registration — do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — already shipped as Solenoid — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
]);

export const SAMPLE_TETHERED_GALLERY = Object.freeze({
  processRunning: true,
  extensionReachable: true,
  navigateDrivesWindow: true,
  listMatchesReachable: true,
  version: GOOD_VERSION,
});

export const SAMPLE_HOLLOW_GALLERY = Object.freeze({
  processRunning: false,
  extensionReachable: false,
  listReportsConnected: true,
  isLocal: true,
  connectedAtAdvances: true,
  navigateSuccessString: true,
  tabId: 410375950,
  windowOpened: false,
  version: CLAUDE_VERSION,
});

export const SAMPLE_LIST_LIE = Object.freeze({
  processRunning: false,
  listCount: 1,
  isLocal: true,
  name: "Browser 1",
  osPlatform: "Windows",
  connectedAt: 1789165039624,
  deviceIdPrefix: "9c9",
  byteIdenticalAfterLaunch: true,
});

export const SAMPLE_LIST_LIVE = Object.freeze({
  processRunning: true,
  listCount: 1,
  isLocal: true,
  name: "Browser 1",
  osPlatform: "Windows",
  reachable: true,
  byteIdenticalAfterLaunch: false,
});

export const SAMPLE_NAVIGATE_HOLLOW = Object.freeze({
  successString: true,
  reply: "Navigated to https://news.ycombinator.com/item?id=…",
  tabId: 410375950,
  tabOpened: false,
  windowOpened: false,
  error: false,
});

export const SAMPLE_NAVIGATE_LIVE = Object.freeze({
  successString: true,
  reply: "Navigated to https://news.ycombinator.com/item?id=…",
  tabId: 410375950,
  tabOpened: true,
  windowOpened: true,
  error: false,
});

export const SAMPLE_SWITCH_DISAGREE = Object.freeze({
  listCount: 1,
  switchReply: "No other browsers available to switch to.",
  liveExtensionConnected: false,
  deadRegistrationServed: true,
  agree: false,
});

export const SAMPLE_SWITCH_AGREE = Object.freeze({
  listCount: 1,
  switchReply: "switched",
  liveExtensionConnected: true,
  deadRegistrationServed: false,
  agree: true,
});

export const SAMPLE_PAGE_HANG = Object.freeze({
  getPageText: true,
  documentIdleHang: true,
  hangSeconds: 45,
  hangCount: 2,
  wrongDiagnosis: "site is slow",
});

export const SAMPLE_PAGE_OK = Object.freeze({
  getPageText: true,
  documentIdleHang: false,
  hangSeconds: 0,
  hangCount: 0,
  wrongDiagnosis: null,
});

export const SAMPLE_RECONNECT_FRAGILE = Object.freeze({
  toolbarReconnectWorksOnce: true,
  silentFailureReturnedMinutes: 90,
  twoSessions: true,
  extensionDirRewritten: true,
  correlationOnly: true,
});

export const SAMPLE_RECONNECT_DURABLE = Object.freeze({
  toolbarReconnectWorksOnce: true,
  silentFailureReturnedMinutes: 0,
  twoSessions: false,
  extensionDirRewritten: false,
  correlationOnly: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds tethered: real extension reachable; navigate actually drives a live window" },
  { t: "no-browser-process", line: "Get-Process shows no msedge/chrome; list_connected_browsers still reports isLocal: true with advancing connectedAt" },
  { t: "navigate-false-success", line: "navigate returns Navigated to <url> plus tabId 410375950; no tab, no window, no error" },
  { t: "switch-browser-disagree", line: "opening a real browser leaves the registration byte-identical; switch_browser says No other browsers available" },
  { t: "path", line: "phantom-navigate — success string + tab id with no browser process; get_page_text hangs ~45s on document_idle" },
  { t: "score", line: "when the CRT stamps Navigated and the process meter reads zero the booth is simulacrum — Score simulacrum or admit tethered." },
]);

export function inspectListConnected(input = {}) {
  const list =
    input.list && typeof input.list === "object"
      ? input.list
      : input.tethered === true && input.hollow !== true
        ? SAMPLE_LIST_LIVE
        : SAMPLE_LIST_LIE;
  const forced =
    input.listConnectedLie === true ||
    input.noBrowserProcess === true ||
    input.event === "list-connected-lie" ||
    input.event === "no-browser-process" ||
    input.event === "hollow" ||
    input.event === "simulacrum" ||
    input.hollow === true;
  const lie = forced ? true : list.processRunning !== true && input.tethered !== true;
  return {
    processRunning: !lie,
    listCount: 1,
    isLocal: true,
    connectedAt: list.connectedAt || 1789165039624,
    stamp: lie ? "list-connected-lie" : "list-live",
    note: lie
      ? "no browser process; list_connected_browsers still reports isLocal: true with advancing connectedAt"
      : "list reports a reachable local extension that matches a live process",
  };
}

export function inspectNavigate(input = {}) {
  const nav =
    input.navigate && typeof input.navigate === "object"
      ? input.navigate
      : input.tethered === true && input.hollow !== true
        ? SAMPLE_NAVIGATE_LIVE
        : SAMPLE_NAVIGATE_HOLLOW;
  const forced =
    input.navigateFalseSuccess === true ||
    input.tabIdHollow === true ||
    input.event === "navigate-false-success" ||
    input.event === "tab-id-hollow" ||
    input.event === "hollow" ||
    input.event === "simulacrum" ||
    input.hollow === true;
  const hollowNav = forced ? true : nav.windowOpened !== true && input.tethered !== true;
  return {
    successString: true,
    tabId: nav.tabId || 410375950,
    windowOpened: !hollowNav,
    stamp: hollowNav ? "navigate-false-success" : "navigate-live",
    note: hollowNav
      ? "Navigated to <url> plus a real tab id; no tab, no window, no error"
      : "navigate drives a live window; tab and process agree",
  };
}

export function inspectSwitchBrowser(input = {}) {
  const sw =
    input.switchBrowser && typeof input.switchBrowser === "object"
      ? input.switchBrowser
      : input.tethered === true && input.hollow !== true
        ? SAMPLE_SWITCH_AGREE
        : SAMPLE_SWITCH_DISAGREE;
  const forced =
    input.switchBrowserDisagree === true ||
    input.event === "switch-browser-disagree" ||
    input.event === "hollow" ||
    input.event === "simulacrum";
  const disagree = forced ? true : sw.agree !== true && input.tethered !== true;
  return {
    listCount: 1,
    switchReply: disagree
      ? "No other browsers available to switch to."
      : sw.switchReply || "switched",
    agree: !disagree,
    stamp: disagree ? "switch-browser-disagree" : "switch-agree",
    note: disagree
      ? "list returns one connected local browser; switch_browser says no other browsers available"
      : "list and switch_browser agree on the reachable extension",
  };
}

export function inspectPageHang(input = {}) {
  const page =
    input.page && typeof input.page === "object"
      ? input.page
      : input.tethered === true && input.hollow !== true
        ? SAMPLE_PAGE_OK
        : SAMPLE_PAGE_HANG;
  const forced =
    input.documentIdleHang === true ||
    input.event === "document-idle-hang" ||
    input.event === "hollow" ||
    input.event === "simulacrum";
  const hung = forced ? true : page.documentIdleHang === true && input.tethered !== true;
  return {
    documentIdleHang: hung,
    hangSeconds: hung ? page.hangSeconds || 45 : 0,
    stamp: hung ? "document-idle-hang" : "page-ok",
    note: hung
      ? "get_page_text hangs ~45s on document_idle; natural reading is the site is slow"
      : "page tools return or fail without a document_idle hang on a dead registration",
  };
}

export function inspectReconnect(input = {}) {
  const rec =
    input.reconnect && typeof input.reconnect === "object"
      ? input.reconnect
      : input.tethered === true && input.hollow !== true
        ? SAMPLE_RECONNECT_DURABLE
        : SAMPLE_RECONNECT_FRAGILE;
  const forced =
    input.reconnectNotDurable === true ||
    input.event === "reconnect-not-durable" ||
    input.event === "hollow" ||
    input.event === "simulacrum";
  const fragile = forced ? true : rec.silentFailureReturnedMinutes > 0 && input.tethered !== true;
  return {
    toolbarReconnectWorksOnce: true,
    silentFailureReturnedMinutes: fragile ? rec.silentFailureReturnedMinutes || 90 : 0,
    extensionDirRewritten: fragile,
    correlationOnly: fragile,
    stamp: fragile ? "reconnect-not-durable" : "reconnect-durable",
    note: fragile
      ? "manual reconnect works once; silent failure returned ~90m later (extension dir rewritten — correlation only)"
      : "reconnect stays durable; registration tracks a live process",
  };
}

export function readBooth(input = {}) {
  const list = inspectListConnected(input);
  const nav = inspectNavigate(input);
  const sw = inspectSwitchBrowser(input);
  const page = inspectPageHang(input);
  const rec = inspectReconnect(input);
  const hollow =
    input.tethered !== true &&
    ((list.processRunning === false && nav.windowOpened === false) ||
      input.hollow === true);
  const tethered =
    input.tethered === true && hollow !== true && list.processRunning === true;
  const path =
    (input.event === "phantom-navigate" || input.phantomNavigate === true) &&
    (nav.windowOpened === false || input.hollow === true);
  return {
    list,
    nav,
    sw,
    page,
    rec,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    hollow: hollow && !tethered && !path,
    tethered: tethered || (!hollow && !path && input.hollow !== true && input.phantomNavigate !== true && list.processRunning !== false),
    phantomNavigate: path && !tethered,
    mark:
      path && !tethered
        ? "phantom-navigate"
        : hollow && !tethered
          ? "hollow"
          : "tethered",
  };
}

/**
 * Published simulacrum walk from #93751 only. Facts from the issue text.
 * A tethered booth has a reachable extension; navigate drives a live window.
 * A hollow booth stamps Navigated with a tab id while no browser process runs.
 * A phantom-navigate booth names that path.
 */
export const SIMULACRUM_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-tethered",
    tethered: true,
    hollow: false,
    cue: "tethered",
    note: "idle HOLD: real extension reachable; navigate actually drives a live window — the hold/good path",
  },
  {
    t: "no-browser-process",
    event: "no-browser-process",
    hollow: true,
    noBrowserProcess: true,
    listConnectedLie: true,
    cue: "hollow",
    note: "Get-Process shows no msedge/chrome; list still reports isLocal: true",
  },
  {
    t: "navigate-false-success",
    event: "navigate-false-success",
    hollow: true,
    navigateFalseSuccess: true,
    tabIdHollow: true,
    cue: "hollow",
    note: "Navigated to <url> plus tabId 410375950; no tab, no window, no error",
  },
  {
    t: "switch-browser-disagree",
    event: "switch-browser-disagree",
    hollow: true,
    switchBrowserDisagree: true,
    cue: "hollow",
    note: "registration byte-identical after launch; switch_browser says no other browsers available",
  },
  {
    t: "path",
    event: "phantom-navigate",
    hollow: true,
    phantomNavigate: true,
    navigateFalseSuccess: true,
    cue: "hollow",
    note: "phantom-navigate — success string + tab id with no browser process",
  },
  {
    t: "score",
    event: "simulacrum",
    hollow: true,
    phantomNavigate: true,
    noBrowserProcess: true,
    listConnectedLie: true,
    navigateFalseSuccess: true,
    tabIdHollow: true,
    cue: "hollow",
    note: "simulacrum — when the CRT stamps Navigated and the process meter reads zero the booth never stays tethered",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-tethered",
    tethered: true,
    hollow: false,
    cue: "tethered",
    note: "positive control: extension reachable; navigate drives a live window",
  },
  {
    t: "announce",
    event: "cue-tethered",
    tethered: true,
    cue: "tethered",
    note: "positive control: the glass stays tethered",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    tethered: true,
    hollow: false,
    phantomNavigate: false,
    cue: "tethered",
  };
}

export function seedTethered() {
  return { ...emptyTicket() };
}

export function seedHollow() {
  return {
    seed: SEEDED_WORD,
    tethered: false,
    hollow: true,
    phantomNavigate: true,
    noBrowserProcess: true,
    listConnectedLie: true,
    navigateFalseSuccess: true,
    tabIdHollow: true,
    switchBrowserDisagree: true,
    documentIdleHang: true,
    reconnectNotDurable: true,
    not78096: true,
    tetheredSurface: false,
    cue: "hollow",
    issue: FEATURED_ISSUE,
    list: SAMPLE_LIST_LIE,
    navigate: SAMPLE_NAVIGATE_HOLLOW,
    switchBrowser: SAMPLE_SWITCH_DISAGREE,
    page: SAMPLE_PAGE_HANG,
    reconnect: SAMPLE_RECONNECT_FRAGILE,
  };
}

export function seedSimulacrum() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    hollow: true,
    phantomNavigate: true,
    noBrowserProcess: true,
    listConnectedLie: true,
    navigateFalseSuccess: true,
    tabIdHollow: true,
    cue: "hollow",
  };
}

export function seedPhantomNavigate() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    hollow: true,
    phantomNavigate: true,
    navigateFalseSuccess: true,
    event: "phantom-navigate",
    cue: "hollow",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    tethered: true,
    cue: "tethered",
  };
}

export function seedNoBrowserProcess() {
  return {
    seed: "no-browser-process",
    preferSeed: true,
    noBrowserProcess: true,
    cue: "hollow",
  };
}

export function seedListConnectedLie() {
  return {
    seed: "list-connected-lie",
    preferSeed: true,
    listConnectedLie: true,
    cue: "hollow",
  };
}

export function seedNavigateFalseSuccess() {
  return {
    seed: "navigate-false-success",
    preferSeed: true,
    navigateFalseSuccess: true,
    cue: "hollow",
  };
}

export function seedTabIdHollow() {
  return {
    seed: "tab-id-hollow",
    preferSeed: true,
    tabIdHollow: true,
    cue: "hollow",
  };
}

export function seedSwitchBrowserDisagree() {
  return {
    seed: "switch-browser-disagree",
    preferSeed: true,
    switchBrowserDisagree: true,
    cue: "hollow",
  };
}

export function seedDocumentIdleHang() {
  return {
    seed: "document-idle-hang",
    preferSeed: true,
    documentIdleHang: true,
    cue: "hollow",
  };
}

export function seedReconnectNotDurable() {
  return {
    seed: "reconnect-not-durable",
    preferSeed: true,
    reconnectNotDurable: true,
    cue: "hollow",
  };
}

export function seedNot78096() {
  return {
    seed: "not-78096",
    preferSeed: true,
    not78096: true,
    cue: "hollow",
  };
}

export function seedReachable() {
  return {
    seed: "reachable",
    preferSeed: true,
    tethered: true,
    cue: "tethered",
  };
}

export function seedLiveWindow() {
  return {
    seed: "live-window",
    preferSeed: true,
    tethered: true,
    cue: "tethered",
  };
}

export function seedProcessPresent() {
  return {
    seed: "process-present",
    preferSeed: true,
    tethered: true,
    cue: "tethered",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      tethered: false,
      hollow: false,
      phantomNavigate: false,
      noBrowserProcess: false,
      listConnectedLie: false,
      navigateFalseSuccess: false,
      tabIdHollow: false,
      switchBrowserDisagree: false,
      documentIdleHang: false,
      reconnectNotDurable: false,
      not78096: false,
      tetheredSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    tethered: raw.tethered === true,
    hollow:
      raw.hollow === true ||
      raw.event === "hollow" ||
      raw.event === "simulacrum",
    phantomNavigate:
      raw.phantomNavigate === true || raw.event === "phantom-navigate",
    noBrowserProcess: raw.noBrowserProcess === true || raw.event === "no-browser-process",
    listConnectedLie: raw.listConnectedLie === true || raw.event === "list-connected-lie",
    navigateFalseSuccess: raw.navigateFalseSuccess === true || raw.event === "navigate-false-success",
    tabIdHollow: raw.tabIdHollow === true || raw.event === "tab-id-hollow",
    switchBrowserDisagree: raw.switchBrowserDisagree === true || raw.event === "switch-browser-disagree",
    documentIdleHang: raw.documentIdleHang === true || raw.event === "document-idle-hang",
    reconnectNotDurable: raw.reconnectNotDurable === true || raw.event === "reconnect-not-durable",
    not78096: raw.not78096 === true || raw.event === "not-78096",
    tetheredSurface: raw.tetheredSurface === true || raw.event === "reachable",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    list: raw.list,
    navigate: raw.navigate,
    switchBrowser: raw.switchBrowser,
    page: raw.page,
    reconnect: raw.reconnect,
    gallery: raw.gallery,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.tethered != null ||
        ticket.hollow != null ||
        ticket.phantomNavigate != null ||
        ticket.noBrowserProcess != null ||
        ticket.listConnectedLie != null ||
        ticket.navigateFalseSuccess != null ||
        ticket.tabIdHollow != null ||
        ticket.switchBrowserDisagree != null ||
        ticket.documentIdleHang != null ||
        ticket.reconnectNotDurable != null ||
        ticket.not78096 != null ||
        ticket.tetheredSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.list ||
        ticket.navigate ||
        ticket.switchBrowser ||
        ticket.page ||
        ticket.reconnect),
  );
}

function isTethered(row) {
  if (row.hollow && row.cue !== "tethered") return false;
  if (
    row.cue === "hollow" ||
    row.cue === "simulacrum" ||
    row.cue === "phantom-navigate"
  ) {
    return false;
  }
  if (
    row.phantomNavigate &&
    row.navigateFalseSuccess &&
    row.cue !== "tethered" &&
    row.tethered !== true
  ) {
    return false;
  }
  if (
    row.phantomNavigate &&
    row.noBrowserProcess &&
    row.cue !== "tethered" &&
    row.tethered !== true
  ) {
    return false;
  }
  if (row.tethered === true && row.hollow !== true && row.cue !== "hollow") {
    return true;
  }
  if (
    row.cue === "tethered" &&
    row.hollow !== true &&
    row.phantomNavigate !== true &&
    row.noBrowserProcess !== true &&
    row.navigateFalseSuccess !== true
  ) {
    return true;
  }
  return false;
}

function isPhantomNavigatePath(row) {
  return (
    row.event === "phantom-navigate" &&
    !isTethered(row) &&
    (row.phantomNavigate === true ||
      row.navigateFalseSuccess === true ||
      row.noBrowserProcess === true)
  );
}

function isHollow(row) {
  if (isTethered(row)) return false;
  if (isPhantomNavigatePath(row) && row.cue !== "hollow") return false;
  if (row.cue === "hollow" || row.cue === "simulacrum") return true;
  if (row.hollow === true) return true;
  if (
    row.phantomNavigate === true &&
    row.navigateFalseSuccess === true &&
    row.noBrowserProcess === true
  ) {
    return true;
  }
  if (row.phantomNavigate === true && row.navigateFalseSuccess === true) {
    return true;
  }
  if (
    row.noBrowserProcess === true ||
    row.listConnectedLie === true ||
    row.navigateFalseSuccess === true ||
    row.tabIdHollow === true ||
    (row.phantomNavigate === true && row.noBrowserProcess === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one simulacrum pass against the hyperreality museum.
 * tethered: real extension reachable; navigate actually drives a live window.
 * hollow / simulacrum: success string + tab id with no browser process.
 * phantom-navigate: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPhantomNavigatePath(row) ||
    (row.phantomNavigate && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "phantom-navigate";
  } else if (isHollow(row)) {
    verdict = "simulacrum";
  } else if (isTethered(row)) {
    verdict = "tethered";
  } else if (
    row.phantomNavigate ||
    row.noBrowserProcess ||
    row.navigateFalseSuccess ||
    (row.listConnectedLie && !row.tethered)
  ) {
    verdict = "simulacrum";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const list = inspectListConnected(row);
  const nav = inspectNavigate(row);
  const sw = inspectSwitchBrowser(row);
  const page = inspectPageHang(row);
  const rec = inspectReconnect(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    tethered: verdict === "tethered" || verdict === "hold",
    hollow:
      verdict === "hollow" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    phantomNavigate:
      row.phantomNavigate === true ||
      verdict === "phantom-navigate" ||
      verdict === PATH_WORD,
    noBrowserProcess: row.noBrowserProcess,
    listConnectedLie: row.listConnectedLie,
    navigateFalseSuccess: row.navigateFalseSuccess,
    tabIdHollow: row.tabIdHollow,
    switchBrowserDisagree: row.switchBrowserDisagree,
    documentIdleHang: row.documentIdleHang,
    reconnectNotDurable: row.reconnectNotDurable,
    not78096: row.not78096,
    tetheredSurface: row.tetheredSurface,
    cue: hold
      ? "tethered"
      : row.phantomNavigate || verdict === "phantom-navigate"
        ? "phantom-navigate"
        : "hollow",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit tethered" : "score simulacrum",
    listInspect: list,
    navInspect: nav,
    switchInspect: sw,
    pageInspect: page,
    reconnectInspect: rec,
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
      : SIMULACRUM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "simulacrum" || row.verdict === "hollow",
  );
  const path = scored.filter((row) => row.verdict === "phantom-navigate");
  const tethered = scored.filter((row) => row.verdict === "tethered");
  const headline =
    scored.find((row) => row.event === "hollow") ||
    scored.find((row) => row.event === "phantom-navigate") ||
    scored.find((row) => row.event === "navigate-false-success") ||
    dead[dead.length - 1];
  let verdict = "tethered";
  if (dead.length) verdict = "simulacrum";
  else if (path.length && !tethered.length) verdict = "phantom-navigate";
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
    hollowCount: dead.length,
    pathCount: path.length,
    tetheredCount: tethered.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit tethered" : "score simulacrum",
    note: headline
      ? "list reports a connected local browser with no process; navigate returns Navigated plus a tab id and does nothing. Cousin #78096 is cite-only (stale-name, different problem)."
      : "published simulacrum walk scored against tethered vs hollow",
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
    seeded !== "tethered" &&
    seeded !== "hollow" &&
    seeded !== "phantom-navigate" &&
    seeded !== "simulacrum" &&
    ticket.tethered == null &&
    ticket.hollow == null &&
    ticket.phantomNavigate == null &&
    ticket.noBrowserProcess == null &&
    ticket.navigateFalseSuccess == null &&
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
    tethered: scored.tethered ?? false,
    hollow: scored.hollow ?? false,
    phantomNavigate: scored.phantomNavigate ?? false,
    noBrowserProcess: scored.noBrowserProcess ?? false,
    listConnectedLie: scored.listConnectedLie ?? false,
    navigateFalseSuccess: scored.navigateFalseSuccess ?? false,
    tabIdHollow: scored.tabIdHollow ?? false,
    switchBrowserDisagree: scored.switchBrowserDisagree ?? false,
    documentIdleHang: scored.documentIdleHang ?? false,
    reconnectNotDurable: scored.reconnectNotDurable ?? false,
    not78096: scored.not78096 ?? false,
    tetheredSurface: scored.tetheredSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.noBrowserProcess || result.hollow ? "process=zero" : "process=live",
    result.navigateFalseSuccess || result.hollow ? "nav=hollow" : "nav=live",
    result.listConnectedLie || result.hollow ? "list=lie" : "list=live",
    result.phantomNavigate || result.verdict === "phantom-navigate"
      ? "path=phantom-navigate"
      : "path=tethered",
    result.cue === "tethered"
      ? "cue=tethered"
      : result.cue === "phantom-navigate"
        ? "cue=phantom-navigate"
        : "cue=hollow",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    tethered: result.tethered,
    hollow: result.hollow,
    phantomNavigate: result.phantomNavigate,
    noBrowserProcess: result.noBrowserProcess,
    listConnectedLie: result.listConnectedLie,
    navigateFalseSuccess: result.navigateFalseSuccess,
    tabIdHollow: result.tabIdHollow,
    switchBrowserDisagree: result.switchBrowserDisagree,
    documentIdleHang: result.documentIdleHang,
    reconnectNotDurable: result.reconnectNotDurable,
    not78096: result.not78096,
    tetheredSurface: result.tetheredSurface,
    list: input && input.list,
    navigate: input && input.navigate,
    switchBrowser: input && input.switchBrowser,
    page: input && input.page,
    reconnect: input && input.reconnect,
    gallery: input && input.gallery,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    list: inspectListConnected({
      tethered: result.tethered,
      hollow: result.hollow,
      listConnectedLie: result.listConnectedLie,
      noBrowserProcess: result.noBrowserProcess,
      list: input && input.list,
    }),
    navigate: inspectNavigate({
      tethered: result.tethered,
      hollow: result.hollow,
      navigateFalseSuccess: result.navigateFalseSuccess,
      navigate: input && input.navigate,
    }),
    switchBrowser: inspectSwitchBrowser({
      tethered: result.tethered,
      hollow: result.hollow,
      switchBrowserDisagree: result.switchBrowserDisagree,
      switchBrowser: input && input.switchBrowser,
    }),
    page: inspectPageHang({
      tethered: result.tethered,
      hollow: result.hollow,
      documentIdleHang: result.documentIdleHang,
      page: input && input.page,
    }),
    reconnect: inspectReconnect({
      tethered: result.tethered,
      hollow: result.hollow,
      reconnectNotDurable: result.reconnectNotDurable,
      reconnect: input && input.reconnect,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      hollow:
        result.hollow === true ||
        result.verdict === "hollow" ||
        result.verdict === "simulacrum",
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
        "NON-BINDING: the MCP host keeps serving a dead registration after the browser process is gone, so list/navigate return connected + success with nothing behind the glass. The ~90m recurrence correlated with an extension-directory rewrite — offered as correlation, not proven cause. Invite verify against #93751 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
