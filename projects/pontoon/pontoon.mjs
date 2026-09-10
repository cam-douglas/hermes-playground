#!/usr/bin/env node
/**
 * Pontoon — harbor pontoon / floating-bridge pier booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * when Claude Desktop restarts (stealth update / quit), every live
 * Claude Code session and its Remote Control bridge is destroyed and
 * nothing re-establishes them. Navigation history returns so the
 * desktop sidebar looks intact; the phone's session list is empty.
 * No notice on either device. Sessions remain eligible
 * (remoteControlAutoEligible: true, no remoteControlUserToggled) but
 * maybeAutoEnableRemoteControl only runs from first_turn / cold_resume
 * / warm_send — no trigger at session load. Updater deferral uses
 * hasActiveClaudeWork() (turn running); an idle phone-bridged session
 * is not "working", so restart proceeds and bridges die.
 * Liveness = compute, not attached remote client.
 *
 *   node pontoon.mjs data/pontoon.json
 *   echo '{"seed":"washed"}' | node pontoon.mjs
 *
 * Idle word is afloat (HOLD: bridges afloat; RC attached; phone can reach).
 * Seeded word is washed (#93288: stealth relaunch / onQuitCleanup stops
 * sessions; bridges gone; sidebar still looks intact).
 * Path word is bridge-loss (the pier stays; the floating span is gone).
 * Product score word is pontoon (score pontoon or admit afloat).
 *
 * Encoded from anthropics/claude-code#93288 issue body only.
 * Hypothesis (NON-BINDING): maybeAutoEnableRemoteControl never runs at
 * session load, and updater deferral treats only a running turn as
 * work, so an idle phone-bridged session is washed on stealth relaunch.
 * Verify against #93288 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "afloat",
  "washed",
  "pontoon",
  "bridge-loss",
  "hold",
  "sidebar-lie",
  "phone-empty",
  "eligible-but-dark",
  "no-load-trigger",
  "compute-only-liveness",
  "stealth-relaunch",
  "on-quit-stop-all",
  "nav-restore",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "afloat";
export const PATH_WORD = "bridge-loss";
export const SEEDED_WORD = "washed";
export const PRODUCT_WORD = "pontoon";
export const HOLD = Object.freeze(["afloat", "hold"]);
export const RECOVER = Object.freeze(["afloat", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "reaped",
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
  "revenant",
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
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "vernier",
  "slider",
  "wedged",
  "concordant",
  "mismatched",
  "concordat",
  "header-mismatch",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "washed" && name !== "pontoon"),
);

export const FEATURED_ISSUE = 93288;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93288";
export const TITLE =
  "Desktop restart destroys every Remote Control session bridge with no recovery and no notice";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const AUTHOR = "joshwillett";
export const FILED = "2026-09-10T07:25:00Z";
export const CLAUDE_VERSION = "2.1.260";
export const DESKTOP_VERSION = "1.49585.0";
export const PREV_DESKTOP = "1.46388.4";
export const OS = "macOS 15.6, arm64 (Mac mini, always on)";
export const SESSIONS_STOPPED = 10;
export const NAV_ENTRIES = 50;
export const NAV_ACTIVE = 49;
export const ELIGIBLE_FLAG = "remoteControlAutoEligible";
export const USER_TOGGLE_FLAG = "remoteControlUserToggled";
export const AUTO_ENABLE = "maybeAutoEnableRemoteControl";
export const LIVENESS_FN = "hasActiveClaudeWork";
export const QUIT_CLEANUP = "onQuitCleanup: local-session-stop-all";
export const TRIGGERS = Object.freeze([
  "first_turn",
  "cold_resume",
  "warm_send",
]);
export const PHRASE =
  "when Desktop restart washes every Remote Control bridge while the sidebar still looks intact, score pontoon or admit afloat.";

export const PIER_STATIONS = Object.freeze([
  {
    id: "pier",
    rite: "read the timber pier",
    kind: "sidebar",
    note: "desktop sidebar still lists every conversation after nav-restore",
  },
  {
    id: "pontoon",
    rite: "sound the floating span",
    kind: "bridge",
    note: "Remote Control bridges die on stealth relaunch / onQuitCleanup",
  },
  {
    id: "lantern",
    rite: "check the phone lantern",
    kind: "phone",
    note: "phone session list is empty; no notice on either device",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "Running onQuitCleanup: local-session-stop-all",
  "Stopping 10 active session(s) on quit",
  "[stealth-relaunch] Loaded navigation history (50 entries, active=49)",
  "[update-restart] Detected nav-restore marker, launching normally",
  "remoteControlAutoEligible: true",
  "maybeAutoEnableRemoteControl",
  "first_turn / cold_resume / warm_send",
  "hasActiveClaudeWork()",
  "bridge_state: connected",
  "phone session list empty",
]);

export const COUSINS = Object.freeze([
  {
    issue: 73565,
    title:
      "remote control bridge restart rotates environment id / auto_disabled_env_not_found",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — different defect (standalone claude rc env-id rotate); do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
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
    issue: 93257,
    title: "agents auto-update relaunch drops flags",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93239,
    title: "Enter-interrupts",
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
  "drift-radar",
  "reorder-radar",
]);

/**
 * Sound the floating span — RC attached and phone can reach, or washed.
 */
export function inspectPier(input = {}) {
  const rcAttached = input.rcAttached === true;
  const phoneEmpty = input.phoneEmpty === true;
  const bridgesGone =
    input.bridgesGone === true ||
    input.washed === true ||
    (input.stealthRelaunch === true && input.onQuitStopAll === true);
  const afloat =
    rcAttached &&
    phoneEmpty !== true &&
    bridgesGone !== true &&
    input.washed !== true;
  return {
    rcAttached,
    phoneEmpty,
    bridgesGone,
    afloat,
    stamp: afloat ? "afloat" : "washed",
    washed: !afloat && (bridgesGone || phoneEmpty || input.washed === true),
  };
}

/**
 * Read the tide marks — stealth relaunch + stop-all washes the span.
 */
export function readTide(input = {}) {
  const pier = inspectPier(input);
  const washed =
    pier.washed === true ||
    input.stealthRelaunch === true ||
    input.onQuitStopAll === true ||
    input.sessionsStopped === SESSIONS_STOPPED;
  return {
    washed,
    stamp: washed ? "washed" : "afloat",
    sessionsStopped: input.sessionsStopped ?? (washed ? SESSIONS_STOPPED : 0),
    stealthRelaunch: input.stealthRelaunch === true,
    onQuitStopAll: input.onQuitStopAll === true,
  };
}

/**
 * Read the pier face: sidebar still lists conversations vs phone empty.
 */
export function readSidebar(input = {}) {
  const pier = inspectPier(input);
  const lie =
    (input.sidebarIntact === true || input.navRestore === true) &&
    (pier.phoneEmpty === true || pier.bridgesGone === true);
  return {
    sidebarIntact: input.sidebarIntact !== false,
    phoneEmpty: pier.phoneEmpty,
    lie,
    cue: lie || pier.washed ? "washed" : "afloat",
  };
}

export function readPier(input = {}) {
  const span = inspectPier(input);
  const tide = readTide(input);
  const sidebar = readSidebar(input);
  const washed = span.washed === true || tide.washed === true;
  return {
    span,
    tide,
    sidebar,
    stations: PIER_STATIONS,
    washed,
    cue: washed ? "washed" : "afloat",
  };
}

/**
 * Published pontoon walk from #93288 only. Facts from the issue body.
 * An afloat pier keeps RC bridges up so the phone can reach.
 * A washed pier loses every bridge on stealth relaunch while the
 * sidebar still looks intact.
 */
export const PONTOON_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-afloat",
    afloat: true,
    rcAttached: true,
    phoneEmpty: false,
    eligible: true,
    userToggled: false,
    washed: false,
    bridgesGone: false,
    cue: "afloat",
    note: "idle HOLD: bridges afloat; RC attached; phone can reach",
  },
  {
    t: "relaunch",
    event: "stealth-relaunch",
    stealthRelaunch: true,
    desktopVersion: DESKTOP_VERSION,
    prevDesktop: PREV_DESKTOP,
    cue: "washed",
    note: "stealth update / quit / managed-config relaunch proceeds",
  },
  {
    t: "quit",
    event: "on-quit-stop-all",
    onQuitStopAll: true,
    sessionsStopped: SESSIONS_STOPPED,
    stealthRelaunch: true,
    cue: "washed",
    note: "onQuitCleanup: local-session-stop-all — Stopping 10 active session(s) on quit",
  },
  {
    t: "nav",
    event: "nav-restore",
    navRestore: true,
    navEntries: NAV_ENTRIES,
    navActive: NAV_ACTIVE,
    sidebarIntact: true,
    cue: "washed",
    note: "nav-restore marker; navigation history 50 entries, active=49, dropped=0",
  },
  {
    t: "sidebar",
    event: "sidebar-lie",
    sidebarIntact: true,
    navRestore: true,
    bridgesGone: true,
    cue: "washed",
    note: "desktop sidebar still shows every conversation and looks intact",
  },
  {
    t: "phone",
    event: "phone-empty",
    phoneEmpty: true,
    sidebarIntact: true,
    bridgesGone: true,
    cue: "washed",
    note: "phone session list is empty; no notice on either device",
  },
  {
    t: "eligible",
    event: "eligible-but-dark",
    eligible: true,
    userToggled: false,
    bridgesGone: true,
    phoneEmpty: true,
    cue: "washed",
    note: "remoteControlAutoEligible: true; no remoteControlUserToggled; policy would pass",
  },
  {
    t: "load",
    event: "no-load-trigger",
    loadTrigger: false,
    triggers: TRIGGERS,
    bridgesGone: true,
    cue: "washed",
    note: "maybeAutoEnableRemoteControl only from first_turn / cold_resume / warm_send",
  },
  {
    t: "liveness",
    event: "compute-only-liveness",
    turnRunning: false,
    rcAttached: true,
    computeOnly: true,
    cue: "washed",
    note: "hasActiveClaudeWork() tests whether a turn is running; idle phone-bridged session is not working",
  },
  {
    t: "cut",
    event: "washed",
    afloat: false,
    washed: true,
    stealthRelaunch: true,
    onQuitStopAll: true,
    sessionsStopped: SESSIONS_STOPPED,
    navRestore: true,
    sidebarIntact: true,
    phoneEmpty: true,
    eligible: true,
    userToggled: false,
    loadTrigger: false,
    turnRunning: false,
    bridgesGone: true,
    cue: "washed",
    note: "stealth relaunch / onQuitCleanup stops sessions; bridges gone; sidebar still looks intact",
  },
  {
    t: "path",
    event: "bridge-loss",
    bridgesGone: true,
    washed: true,
    cue: "washed",
    note: "bridge-loss — the timber pier stays; the floating span is gone",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    afloat: true,
    rcAttached: true,
    phoneEmpty: false,
    eligible: true,
    userToggled: false,
    washed: false,
    bridgesGone: false,
    stealthRelaunch: false,
    onQuitStopAll: false,
    sidebarIntact: true,
    navRestore: false,
    loadTrigger: true,
    turnRunning: false,
    cue: "afloat",
  };
}

export function seedAfloat() {
  return { ...emptyTicket() };
}

export function seedWashed() {
  return {
    seed: SEEDED_WORD,
    afloat: false,
    washed: true,
    stealthRelaunch: true,
    onQuitStopAll: true,
    sessionsStopped: SESSIONS_STOPPED,
    navRestore: true,
    sidebarIntact: true,
    phoneEmpty: true,
    eligible: true,
    userToggled: false,
    loadTrigger: false,
    turnRunning: false,
    rcAttached: false,
    bridgesGone: true,
    computeOnly: true,
    cue: "washed",
    issue: FEATURED_ISSUE,
  };
}

export function seedPontoon() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    washed: true,
    bridgesGone: true,
    phoneEmpty: true,
    sidebarIntact: true,
    cue: "washed",
  };
}

export function seedBridgeLoss() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    bridgesGone: true,
    washed: true,
    cue: "washed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    afloat: true,
    cue: "afloat",
  };
}

export function seedSidebarLie() {
  return {
    seed: "sidebar-lie",
    preferSeed: true,
    sidebarIntact: true,
    bridgesGone: true,
    cue: "washed",
  };
}

export function seedPhoneEmpty() {
  return {
    seed: "phone-empty",
    preferSeed: true,
    phoneEmpty: true,
    cue: "washed",
  };
}

export function seedEligibleButDark() {
  return {
    seed: "eligible-but-dark",
    preferSeed: true,
    eligible: true,
    userToggled: false,
    bridgesGone: true,
    cue: "washed",
  };
}

export function seedNoLoadTrigger() {
  return {
    seed: "no-load-trigger",
    preferSeed: true,
    loadTrigger: false,
    cue: "washed",
  };
}

export function seedComputeOnly() {
  return {
    seed: "compute-only-liveness",
    preferSeed: true,
    turnRunning: false,
    computeOnly: true,
    cue: "washed",
  };
}

export function seedStealthRelaunch() {
  return {
    seed: "stealth-relaunch",
    preferSeed: true,
    stealthRelaunch: true,
    cue: "washed",
  };
}

export function seedOnQuitStopAll() {
  return {
    seed: "on-quit-stop-all",
    preferSeed: true,
    onQuitStopAll: true,
    sessionsStopped: SESSIONS_STOPPED,
    cue: "washed",
  };
}

export function seedNavRestore() {
  return {
    seed: "nav-restore",
    preferSeed: true,
    navRestore: true,
    sidebarIntact: true,
    cue: "washed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      afloat: false,
      washed: false,
      rcAttached: false,
      phoneEmpty: false,
      eligible: false,
      userToggled: false,
      stealthRelaunch: false,
      onQuitStopAll: false,
      sessionsStopped: null,
      navRestore: false,
      sidebarIntact: false,
      loadTrigger: false,
      turnRunning: false,
      bridgesGone: false,
      computeOnly: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    afloat: raw.afloat === true,
    washed: raw.washed === true,
    rcAttached: raw.rcAttached === true,
    phoneEmpty: raw.phoneEmpty === true,
    eligible: raw.eligible === true,
    userToggled: raw.userToggled === true,
    stealthRelaunch: raw.stealthRelaunch === true,
    onQuitStopAll: raw.onQuitStopAll === true,
    sessionsStopped: raw.sessionsStopped == null ? null : raw.sessionsStopped,
    navRestore: raw.navRestore === true,
    sidebarIntact: raw.sidebarIntact === true,
    loadTrigger: raw.loadTrigger === true,
    turnRunning: raw.turnRunning === true,
    bridgesGone: raw.bridgesGone === true,
    computeOnly: raw.computeOnly === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.afloat != null ||
        ticket.washed != null ||
        ticket.rcAttached != null ||
        ticket.phoneEmpty != null ||
        ticket.eligible != null ||
        ticket.stealthRelaunch != null ||
        ticket.onQuitStopAll != null ||
        ticket.bridgesGone != null ||
        ticket.sidebarIntact != null ||
        ticket.navRestore != null ||
        ticket.loadTrigger != null ||
        ticket.computeOnly != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isAfloat(row) {
  if (row.washed && row.cue !== "afloat") return false;
  if (row.cue === "washed" || row.cue === "pontoon") return false;
  if (row.bridgesGone && row.cue !== "afloat") return false;
  if (row.phoneEmpty && row.cue !== "afloat" && row.event !== "cue-afloat") {
    return false;
  }
  if (
    row.afloat === true &&
    row.washed !== true &&
    row.cue !== "washed"
  ) {
    return true;
  }
  if (
    row.cue === "afloat" &&
    row.washed !== true &&
    row.bridgesGone !== true
  ) {
    return true;
  }
  if (
    row.rcAttached === true &&
    row.phoneEmpty !== true &&
    row.washed !== true &&
    row.stealthRelaunch !== true &&
    row.bridgesGone !== true
  ) {
    return true;
  }
  return false;
}

function isWashed(row) {
  if (isAfloat(row)) return false;
  if (row.cue === "washed" || row.cue === "pontoon") return true;
  if (row.washed === true) return true;
  if (row.bridgesGone === true && (row.stealthRelaunch || row.onQuitStopAll)) {
    return true;
  }
  if (row.phoneEmpty && row.sidebarIntact && row.eligible) return true;
  if (row.sessionsStopped === SESSIONS_STOPPED && row.onQuitStopAll) return true;
  return false;
}

function isBridgeLossPath(row) {
  return (
    row.event === "bridge-loss" &&
    !isAfloat(row) &&
    (row.bridgesGone === true || row.washed === true)
  );
}

/**
 * Score one pier pass against the pontoon booth.
 * afloat: RC attached; phone can reach; bridges stay up.
 * washed: stealth relaunch / onQuitCleanup; bridges gone; sidebar intact.
 * bridge-loss: named path — the floating span is gone.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBridgeLossPath(row) ||
    (row.bridgesGone && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "bridge-loss";
  } else if (isWashed(row)) {
    verdict = "washed";
  } else if (isAfloat(row)) {
    verdict = "afloat";
  } else if (
    row.washed ||
    row.bridgesGone ||
    row.phoneEmpty ||
    row.stealthRelaunch ||
    row.onQuitStopAll ||
    row.computeOnly
  ) {
    verdict = "washed";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const span = inspectPier(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    afloat: verdict === "afloat" || verdict === "hold",
    washed:
      verdict === "washed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    bridgeLoss:
      verdict === "bridge-loss" ||
      verdict === PATH_WORD ||
      span.bridgesGone,
    rcAttached: row.rcAttached,
    phoneEmpty: row.phoneEmpty,
    eligible: row.eligible,
    userToggled: row.userToggled,
    stealthRelaunch: row.stealthRelaunch,
    onQuitStopAll: row.onQuitStopAll,
    sessionsStopped: row.sessionsStopped,
    navRestore: row.navRestore,
    sidebarIntact: row.sidebarIntact,
    loadTrigger: row.loadTrigger,
    turnRunning: row.turnRunning,
    bridgesGone: row.bridgesGone,
    computeOnly: row.computeOnly,
    cue: hold ? "afloat" : "washed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit afloat" : "score pontoon",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : PONTOON_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const washed = scored.filter((row) => row.verdict === "washed");
  const path = scored.filter((row) => row.verdict === "bridge-loss");
  const afloat = scored.filter((row) => row.verdict === "afloat");
  const headline =
    scored.find((row) => row.event === "washed") ||
    scored.find((row) => row.event === "on-quit-stop-all") ||
    scored.find((row) => row.event === "bridge-loss") ||
    washed[washed.length - 1];
  let verdict = "afloat";
  if (washed.length) verdict = "washed";
  else if (path.length && !afloat.length) verdict = "bridge-loss";
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
    washedCount: washed.length,
    pathCount: path.length,
    afloatCount: afloat.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit afloat" : "score pontoon",
    note: headline
      ? "Desktop restart / onQuitCleanup stops every session; Remote Control bridges die; sidebar still looks intact; phone list is empty."
      : "published pontoon walk scored against afloat vs washed",
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
    seeded !== "afloat" &&
    seeded !== "washed" &&
    seeded !== "bridge-loss" &&
    seeded !== "pontoon" &&
    ticket.afloat == null &&
    ticket.washed == null &&
    ticket.bridgesGone == null &&
    ticket.phoneEmpty == null &&
    ticket.stealthRelaunch == null &&
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
    afloat: scored.afloat ?? false,
    washed: scored.washed ?? false,
    phoneEmpty: scored.phoneEmpty ?? false,
    sidebarIntact: scored.sidebarIntact ?? false,
    eligible: scored.eligible ?? false,
    stealthRelaunch: scored.stealthRelaunch ?? false,
    onQuitStopAll: scored.onQuitStopAll ?? false,
    sessionsStopped: scored.sessionsStopped ?? null,
    loadTrigger: scored.loadTrigger ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.phoneEmpty ? "phone=empty" : "phone=reach",
    result.sidebarIntact ? "sidebar=intact" : "sidebar=dark",
    result.eligible ? "eligible=true" : "eligible=false",
    result.stealthRelaunch ? "relaunch=stealth" : "relaunch=none",
    result.cue === "afloat" ? "cue=afloat" : "cue=washed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const pier = readPier({
    rcAttached: result.rcAttached,
    phoneEmpty: result.phoneEmpty,
    washed: result.washed,
    bridgesGone: result.bridgesGone,
    stealthRelaunch: result.stealthRelaunch,
    onQuitStopAll: result.onQuitStopAll,
    sessionsStopped: result.sessionsStopped,
    sidebarIntact: result.sidebarIntact,
    navRestore: result.navRestore,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    pier,
    span: inspectPier({
      rcAttached: result.rcAttached,
      phoneEmpty: result.phoneEmpty,
      washed: result.washed,
      bridgesGone: result.bridgesGone,
      stealthRelaunch: result.stealthRelaunch,
      onQuitStopAll: result.onQuitStopAll,
    }),
    tide: readTide({
      stealthRelaunch: result.stealthRelaunch,
      onQuitStopAll: result.onQuitStopAll,
      sessionsStopped: result.sessionsStopped,
      washed: result.washed,
      phoneEmpty: result.phoneEmpty,
      bridgesGone: result.bridgesGone,
    }),
    sidebar: readSidebar({
      sidebarIntact: result.sidebarIntact,
      navRestore: result.navRestore,
      phoneEmpty: result.phoneEmpty,
      bridgesGone: result.bridgesGone,
    }),
    stations: PIER_STATIONS.map((row) => ({
      ...row,
      washed: result.washed === true || result.verdict === "washed",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      desktopVersion: DESKTOP_VERSION,
      prevDesktop: PREV_DESKTOP,
      os: OS,
      sessionsStopped: SESSIONS_STOPPED,
      navEntries: NAV_ENTRIES,
      navActive: NAV_ACTIVE,
      eligibleFlag: ELIGIBLE_FLAG,
      userToggleFlag: USER_TOGGLE_FLAG,
      autoEnable: AUTO_ENABLE,
      livenessFn: LIVENESS_FN,
      quitCleanup: QUIT_CLEANUP,
      triggers: [...TRIGGERS],
      stations: PIER_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "re-bridge on startup for any session that had a bridge when the app quit",
        "failing that, make the loss visible on desktop or mark sessions disconnected on the phone",
        "count attached remote clients as active work in updater deferral",
      ],
      hypothesis:
        "NON-BINDING: maybeAutoEnableRemoteControl only runs from first_turn / cold_resume / warm_send — no trigger at session load; hasActiveClaudeWork() tests a running turn, so an idle phone-bridged session is not working and stealth relaunch washes every bridge",
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
