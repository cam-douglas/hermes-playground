#!/usr/bin/env node
/**
 * Replevin — legal replevin / writ-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * ExitPlanMode should keep prePlanMode restored (session returns to the
 * prior mode). Instead iOS approval sends setMode auto regardless of the
 * recorded prePlanMode, and the rejection path falls back to hardcoded
 * default — not prePlanMode. A bypassPermissions session therefore lands
 * in auto (no kill switch) or default/manual (with disableAutoMode).
 *
 *   node replevin.mjs data/replevin.json
 *   echo '{"seed":"replevin"}' | node replevin.mjs
 *
 * Idle word is restored (HOLD: ExitPlanMode restores prePlanMode).
 * Seeded word is replevin (#93207: iOS forces setMode auto; rejection defaults).
 * Path word is defaulted (fallback 'default', not prePlanMode).
 *
 * Encoded from anthropics/claude-code#93207 issue body only.
 * Hypothesis (NON-BINDING): iOS approval hardcodes setMode auto and the
 * bridge rejection fallback is hardcoded default instead of prePlanMode.
 * Verify against #93207 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix in
 * anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "restored",
  "replevin",
  "defaulted",
  "hold",
  "preplan",
  "setmode-auto",
  "bridge-override",
  "reject-fallback",
  "bypass-displaced",
  "ios-surface",
  "android-correct",
  "cli-correct",
  "disable-automode",
  "no-indicator",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "restored";
export const PATH_WORD = "defaulted";
export const SEEDED_WORD = "replevin";
export const HOLD = Object.freeze(["restored", "hold"]);
export const RECOVER = Object.freeze(["restored", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "expanded",
  "cognate",
  "literal",
  "laid",
  "lemures",
  "remanent",
  "released",
  "escheat",
  "stale",
  "freehold",
  "mortmain",
  "phantom",
  "trunked",
  "strowger",
  "exchanged",
  "tokenized",
  "mondegreen",
  "parsed",
  "locked",
  "scratched",
  "derby",
  "unmasked",
  "vizard",
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
  "sterling",
  "lodged",
  "bypassed",
  "diplopic",
  "freewheeling",
  "doubled",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
  "culled",
  "quietus",
  "palimpsest",
  "recension",
  "ephemera",
  "mirage",
  "calque",
  "sigil",
  "caret",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "replevin"),
);

export const FEATURED_ISSUE = 93207;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93207";
export const TITLE =
  "Approving a plan from the iOS app sends setMode 'auto', discarding the session's prePlanMode; the rejection path then falls back to 'default'";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "platform:ios", "area:permissions"]);
export const AUTHOR = "miridius";
export const FILED = "2026-09-09T22:02:05Z";
export const CLAUDE_VERSION = "2.1.267";
export const OS = "macOS 15 (Darwin 25.6.0)";
export const DEFAULT_MODE = "bypassPermissions";
export const DISABLE_AUTO_SETTING = "disable";
export const BUTTON_LABEL = "Exit and auto mode";
export const PRE_PLAN_MODE = "bypassPermissions";
export const SET_MODE = "auto";
export const FALLBACK_MODE = "default";
export const PREPARE_CONTEXT = "prepareContextForPlanMode";
export const EXIT_TOOL = "ExitPlanModeV2Tool";
export const DEBUG_REJECT =
  "bridge setMode 'auto' rejected (Cannot set permission mode to auto: auto mode disabled by settings); falling back to 'default'";
export const PHRASE =
  "when iOS plan approval displaces prePlanMode with setMode auto (and rejection falls back to default), score replevin or admit restored.";

export const CHAMBER_STATIONS = Object.freeze([
  {
    id: "writ",
    rite: "restore the writ",
    kind: "restore",
    note: "ExitPlanMode should restore prePlanMode=bypassPermissions; session returns to the prior mode",
  },
  {
    id: "bond",
    rite: "seal the bond",
    kind: "seal",
    note: "iOS Approve labelled Exit and auto mode must not send setMode auto over the recorded prePlanMode",
  },
  {
    id: "benches",
    rite: "compare surfaces",
    kind: "contrast",
    note: "CLI TUI and Android approve with no bridge setMode and land in bypassPermissions; iOS does not",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "prepareContextForPlanMode",
  "prePlanMode=bypassPermissions",
  "Exit and auto mode",
  "setMode auto",
  "disableAutoMode",
  "falling back to 'default'",
  "bypassPermissions",
  "ExitPlanMode",
  "iOS",
  "Android",
]);

export const COUSINS = Object.freeze([
  {
    issue: 79990,
    title:
      "mobile/web mode dropdown can knock a session out of bypassPermissions with no way back",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — manual dropdown tap, not plan approval; do not rebuild",
  },
  {
    issue: 80812,
    title: "Remote Control offers Auto on a host with disableAutoMode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — app mode handling does not consult the host gate; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93219,
    title: "Vernier — effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary; cite in data only",
  },
  {
    issue: 93239,
    title: "Enter interrupts instead of queueing",
    state: "OPEN",
    citeOnly: true,
    why: "Enter interrupts instead of queueing — backup, not primary; cite in data only",
  },
  {
    issue: 93259,
    title: "archive_session pin refusal message collapse",
    state: "OPEN",
    citeOnly: true,
    why: "archive_session pin refusal message collapse — backup, not primary; cite in data only",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops bypass flags",
    state: "OPEN",
    citeOnly: true,
    why: "agents auto-update relaunch drops bypass flags — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
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
  "palimpsest",
  "recension",
  "quietus",
  "calque",
  "sigil",
  "caret",
  "vernier",
]);

/**
 * Conceptual writ restore — ExitPlanMode returns the session to
 * prePlanMode instead of landing in auto or default.
 */
export function restoreWrit(input = {}) {
  const restored = input.restored === true || input.setModeAuto !== true;
  return {
    mode: restored
      ? "bypassPermissions"
      : input.disableAutoMode === true
        ? "default"
        : "auto",
    rite: restored ? "restored" : "replevin",
    prePlanMode: "bypassPermissions",
  };
}

/**
 * Conceptual bond seal — mark iOS setMode auto so the writ is not
 * displaced by a hardcoded auto request or a default fallback.
 */
export function sealBond(input = {}) {
  const displaced =
    input.setModeAuto === true ||
    (input.iosApprove === true && input.rejectFallback === true);
  return {
    sealed: displaced,
    stamp: displaced ? "replevin" : "restored",
    fallbackDefault: displaced && input.disableAutoMode !== false,
    bypassDisplaced: displaced && input.bypassDisplaced !== false,
  };
}

/**
 * Contrast the three approval surfaces from the issue table.
 */
export function compareSurfaces(input = {}) {
  const iosDisplaced =
    input.iosApprove === true ||
    input.setModeAuto === true ||
    input.cue === "replevin";
  return {
    cli: "bypassPermissions",
    android: "bypassPermissions",
    ios: iosDisplaced
      ? input.disableAutoMode === false
        ? "auto"
        : "default"
      : "bypassPermissions",
    cliCorrect: true,
    androidCorrect: true,
    iosCorrect: !iosDisplaced,
  };
}

export function readChamber(input = {}) {
  const writ = restoreWrit(input);
  const bond = sealBond(input);
  const benches = compareSurfaces(input);
  const displaced = bond.stamp === "replevin";
  return {
    writ,
    bond,
    benches,
    stations: CHAMBER_STATIONS,
    displaced,
    cue: displaced ? "replevin" : "restored",
  };
}

/**
 * Published replevin walk from #93207 only. Facts from the issue body.
 * A restored chamber returns to prePlanMode. A replevin chamber lets
 * iOS setMode auto displace that writ, then defaults on rejection.
 */
export const REPLEVIN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-restored",
    restored: true,
    prePlanRecorded: true,
    enteredPlan: false,
    iosApprove: false,
    setModeAuto: false,
    bridgeOverride: false,
    disableAutoMode: false,
    rejectFallback: false,
    fallbackDefault: false,
    bypassDisplaced: false,
    promptsEveryTool: false,
    noIndicator: false,
    cue: "restored",
    note: "idle HOLD: ExitPlanMode restores prePlanMode; session returns to the prior mode",
  },
  {
    t: "preplan",
    event: "preplan",
    prePlanRecorded: true,
    prePlanMode: "bypassPermissions",
    cue: "replevin",
    note: "prepareContextForPlanMode plain plan entry, prePlanMode=bypassPermissions",
  },
  {
    t: "plan",
    event: "enter-plan",
    enteredPlan: true,
    prePlanRecorded: true,
    cue: "replevin",
    note: "Applying permission update: Setting mode to plan",
  },
  {
    t: "ios",
    event: "ios-approve",
    iosApprove: true,
    buttonLabel: "Exit and auto mode",
    enteredPlan: true,
    cue: "replevin",
    note: "Approve the plan from the iOS app; primary button labelled Exit and auto mode",
  },
  {
    t: "setmode",
    event: "setmode-auto",
    setModeAuto: true,
    iosApprove: true,
    bridgeOverride: true,
    cue: "replevin",
    note: "iOS sends updatedPermissions [{type: setMode, mode: auto}] regardless of prePlanMode",
  },
  {
    t: "gate",
    event: "disable-automode",
    disableAutoMode: true,
    setModeAuto: true,
    cue: "replevin",
    note: "Cannot set permission mode to auto: auto mode disabled by settings",
  },
  {
    t: "reject",
    event: "reject-fallback",
    rejectFallback: true,
    fallbackDefault: true,
    disableAutoMode: true,
    setModeAuto: true,
    cue: "replevin",
    note: "bridge setMode auto rejected; falling back to default — not prePlanMode",
  },
  {
    t: "land",
    event: "bypass-displaced",
    bypassDisplaced: true,
    promptsEveryTool: true,
    fallbackDefault: true,
    cue: "replevin",
    note: "session leaves plan mode in default; prompts for every tool call",
  },
  {
    t: "cut",
    event: "replevin",
    restored: false,
    prePlanRecorded: true,
    enteredPlan: true,
    iosApprove: true,
    setModeAuto: true,
    bridgeOverride: true,
    disableAutoMode: true,
    rejectFallback: true,
    fallbackDefault: true,
    bypassDisplaced: true,
    promptsEveryTool: true,
    noIndicator: true,
    cue: "replevin",
    note: "iOS setMode auto displaced the writ; score replevin",
  },
  {
    t: "path",
    event: "defaulted",
    defaulted: true,
    cue: "replevin",
    note: "defaulted — rejection path lands on hardcoded default, not prePlanMode",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    restored: true,
    prePlanRecorded: true,
    enteredPlan: false,
    iosApprove: false,
    setModeAuto: false,
    bridgeOverride: false,
    disableAutoMode: false,
    rejectFallback: false,
    fallbackDefault: false,
    bypassDisplaced: false,
    promptsEveryTool: false,
    noIndicator: false,
    cue: "restored",
  };
}

export function seedRestored() {
  return { ...emptyTicket() };
}

export function seedReplevin() {
  return {
    seed: SEEDED_WORD,
    restored: false,
    prePlanRecorded: true,
    enteredPlan: true,
    iosApprove: true,
    setModeAuto: true,
    bridgeOverride: true,
    disableAutoMode: true,
    rejectFallback: true,
    fallbackDefault: true,
    bypassDisplaced: true,
    promptsEveryTool: true,
    noIndicator: true,
    cue: "replevin",
    issue: FEATURED_ISSUE,
  };
}

export function seedDefaulted() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    defaulted: true,
    cue: "replevin",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    restored: true,
    cue: "restored",
  };
}

export function seedPreplan() {
  return {
    seed: "preplan",
    preferSeed: true,
    prePlanRecorded: true,
    cue: "replevin",
  };
}

export function seedSetModeAuto() {
  return {
    seed: "setmode-auto",
    preferSeed: true,
    setModeAuto: true,
    iosApprove: true,
    cue: "replevin",
  };
}

export function seedBridgeOverride() {
  return {
    seed: "bridge-override",
    preferSeed: true,
    bridgeOverride: true,
    setModeAuto: true,
    cue: "replevin",
  };
}

export function seedRejectFallback() {
  return {
    seed: "reject-fallback",
    preferSeed: true,
    rejectFallback: true,
    fallbackDefault: true,
    cue: "replevin",
  };
}

export function seedBypassDisplaced() {
  return {
    seed: "bypass-displaced",
    preferSeed: true,
    bypassDisplaced: true,
    fallbackDefault: true,
    cue: "replevin",
  };
}

export function seedIosSurface() {
  return {
    seed: "ios-surface",
    preferSeed: true,
    iosApprove: true,
    cue: "replevin",
  };
}

export function seedAndroidCorrect() {
  return {
    seed: "android-correct",
    preferSeed: true,
    androidCorrect: true,
    cue: "restored",
  };
}

export function seedCliCorrect() {
  return {
    seed: "cli-correct",
    preferSeed: true,
    cliCorrect: true,
    cue: "restored",
  };
}

export function seedDisableAutomode() {
  return {
    seed: "disable-automode",
    preferSeed: true,
    disableAutoMode: true,
    setModeAuto: true,
    cue: "replevin",
  };
}

export function seedNoIndicator() {
  return {
    seed: "no-indicator",
    preferSeed: true,
    noIndicator: true,
    iosApprove: true,
    cue: "replevin",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      restored: false,
      prePlanRecorded: false,
      enteredPlan: false,
      iosApprove: false,
      setModeAuto: false,
      bridgeOverride: false,
      disableAutoMode: false,
      rejectFallback: false,
      fallbackDefault: false,
      bypassDisplaced: false,
      promptsEveryTool: false,
      noIndicator: false,
      androidCorrect: false,
      cliCorrect: false,
      defaulted: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    restored: raw.restored === true,
    prePlanRecorded: raw.prePlanRecorded === true,
    enteredPlan: raw.enteredPlan === true,
    iosApprove: raw.iosApprove === true,
    setModeAuto: raw.setModeAuto === true,
    bridgeOverride: raw.bridgeOverride === true,
    disableAutoMode: raw.disableAutoMode === true,
    rejectFallback: raw.rejectFallback === true,
    fallbackDefault: raw.fallbackDefault === true,
    bypassDisplaced: raw.bypassDisplaced === true,
    promptsEveryTool: raw.promptsEveryTool === true,
    noIndicator: raw.noIndicator === true,
    androidCorrect: raw.androidCorrect === true,
    cliCorrect: raw.cliCorrect === true,
    defaulted: raw.defaulted === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.restored != null ||
        ticket.prePlanRecorded != null ||
        ticket.enteredPlan != null ||
        ticket.iosApprove != null ||
        ticket.setModeAuto != null ||
        ticket.bridgeOverride != null ||
        ticket.disableAutoMode != null ||
        ticket.rejectFallback != null ||
        ticket.fallbackDefault != null ||
        ticket.bypassDisplaced != null ||
        ticket.promptsEveryTool != null ||
        ticket.noIndicator != null ||
        ticket.androidCorrect != null ||
        ticket.cliCorrect != null ||
        ticket.defaulted != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isRestored(row) {
  if (row.defaulted) return false;
  if (row.cue === "replevin") return false;
  if (row.setModeAuto && row.rejectFallback) return false;
  if (row.iosApprove && row.bridgeOverride) return false;
  if (
    row.restored === true &&
    row.setModeAuto !== true &&
    row.cue !== "replevin"
  ) {
    return true;
  }
  if (
    row.cue === "restored" &&
    row.setModeAuto !== true &&
    row.rejectFallback !== true
  ) {
    return true;
  }
  return false;
}

function isReplevin(row) {
  if (row.defaulted && row.cue !== "restored") return false;
  if (row.cue === "replevin") return true;
  if (row.iosApprove && row.setModeAuto && row.rejectFallback) return true;
  if (row.bridgeOverride && row.bypassDisplaced) return true;
  if (row.setModeAuto && row.disableAutoMode && row.fallbackDefault) {
    return true;
  }
  return false;
}

function isDefaultedPath(row) {
  return row.defaulted === true && !isRestored(row);
}

/**
 * Score one chamber pass against the replevin booth.
 * restored: ExitPlanMode restores prePlanMode; session returns to prior mode.
 * replevin: iOS setMode auto displaces the writ; rejection falls back to default.
 * defaulted: named path — hardcoded default, not prePlanMode.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isDefaultedPath(row)) {
    verdict = "defaulted";
  } else if (isReplevin(row)) {
    verdict = "replevin";
  } else if (isRestored(row)) {
    verdict = "restored";
  } else if (
    row.iosApprove ||
    row.setModeAuto ||
    row.bridgeOverride ||
    row.disableAutoMode ||
    row.rejectFallback ||
    row.fallbackDefault ||
    row.bypassDisplaced ||
    row.promptsEveryTool ||
    row.noIndicator
  ) {
    verdict = "replevin";
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
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    restored: verdict === "restored",
    replevin: verdict === "replevin" || verdict === SEEDED_WORD,
    defaulted: verdict === "defaulted" || verdict === PATH_WORD,
    prePlanRecorded: row.prePlanRecorded,
    enteredPlan: row.enteredPlan,
    iosApprove: row.iosApprove,
    setModeAuto: row.setModeAuto,
    bridgeOverride: row.bridgeOverride,
    disableAutoMode: row.disableAutoMode,
    rejectFallback: row.rejectFallback,
    fallbackDefault: row.fallbackDefault,
    bypassDisplaced: row.bypassDisplaced,
    promptsEveryTool: row.promptsEveryTool,
    noIndicator: row.noIndicator,
    androidCorrect: row.androidCorrect,
    cliCorrect: row.cliCorrect,
    cue: hold ? "restored" : "replevin",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit restored" : "score replevin",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : REPLEVIN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const replevin = scored.filter((row) => row.verdict === "replevin");
  const defaulted = scored.filter((row) => row.verdict === "defaulted");
  const restored = scored.filter((row) => row.verdict === "restored");
  const headline =
    scored.find((row) => row.event === "replevin") ||
    scored.find((row) => row.event === "setmode-auto") ||
    scored.find((row) => row.event === "reject-fallback") ||
    scored.find((row) => row.event === "defaulted") ||
    replevin[replevin.length - 1];
  let verdict = "restored";
  if (replevin.length) verdict = "replevin";
  else if (defaulted.length && !restored.length) verdict = "defaulted";
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
    replevinCount: replevin.length,
    defaultedCount: defaulted.length,
    restoredCount: restored.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit restored" : "score replevin",
    note: headline
      ? "iOS ExitPlanMode approval sends setMode auto; disableAutoMode rejects; fallback default displaces bypassPermissions."
      : "published replevin walk scored against restored vs replevin",
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
    seeded !== "restored" &&
    seeded !== "replevin" &&
    seeded !== "defaulted" &&
    ticket.restored == null &&
    ticket.iosApprove == null &&
    ticket.setModeAuto == null &&
    ticket.defaulted == null &&
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
    restored: scored.restored ?? false,
    prePlanRecorded: scored.prePlanRecorded ?? false,
    enteredPlan: scored.enteredPlan ?? false,
    iosApprove: scored.iosApprove ?? false,
    setModeAuto: scored.setModeAuto ?? false,
    bridgeOverride: scored.bridgeOverride ?? false,
    disableAutoMode: scored.disableAutoMode ?? false,
    rejectFallback: scored.rejectFallback ?? false,
    fallbackDefault: scored.fallbackDefault ?? false,
    bypassDisplaced: scored.bypassDisplaced ?? false,
    promptsEveryTool: scored.promptsEveryTool ?? false,
    noIndicator: scored.noIndicator ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.prePlanRecorded ? "pre=bypass" : "pre=none",
    result.iosApprove ? "ios=yes" : "ios=no",
    result.setModeAuto ? "set=auto" : "set=none",
    result.rejectFallback ? "reject=default" : "reject=none",
    result.bypassDisplaced ? "bypass=displaced" : "bypass=held",
    result.cue === "restored" ? "cue=restored" : "cue=replevin",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const chamber = readChamber({
    restored: result.restored,
    setModeAuto: result.setModeAuto,
    iosApprove: result.iosApprove,
    rejectFallback: result.rejectFallback,
    disableAutoMode: result.disableAutoMode,
    bypassDisplaced: result.bypassDisplaced,
    cue: result.cue,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    chamber,
    writ: restoreWrit({
      restored: result.restored,
      setModeAuto: result.setModeAuto,
      disableAutoMode: result.disableAutoMode,
    }),
    bond: sealBond({
      setModeAuto: result.setModeAuto,
      iosApprove: result.iosApprove,
      rejectFallback: result.rejectFallback,
      disableAutoMode: result.disableAutoMode,
      bypassDisplaced: result.bypassDisplaced,
    }),
    benches: compareSurfaces({
      iosApprove: result.iosApprove,
      setModeAuto: result.setModeAuto,
      disableAutoMode: result.disableAutoMode,
      cue: result.cue,
    }),
    stations: CHAMBER_STATIONS.map((row) => ({
      ...row,
      displaced: result.setModeAuto === true || result.verdict === "replevin",
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
      os: OS,
      defaultMode: DEFAULT_MODE,
      disableAutoSetting: DISABLE_AUTO_SETTING,
      buttonLabel: BUTTON_LABEL,
      prePlanMode: PRE_PLAN_MODE,
      setMode: SET_MODE,
      fallbackMode: FALLBACK_MODE,
      prepareContext: PREPARE_CONTEXT,
      exitTool: EXIT_TOOL,
      debugReject: DEBUG_REJECT,
      stations: CHAMBER_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "restore the session's prePlanMode on ExitPlanMode, as the CLI already does unaided",
        "iOS sends no setMode on a plain approval, matching Android, or requests prePlanMode rather than hardcoded auto",
        "bridge rejection fallback should be prePlanMode rather than default",
      ],
      hypothesis:
        "NON-BINDING: iOS approval hardcodes setMode auto and bridge rejection fallback is hardcoded default instead of prePlanMode",
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
