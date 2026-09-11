#!/usr/bin/env node
/**
 * Disseisin — court-of-novel-disseisin / freehold manor-roll booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A Cowork session's home inside the VM under /sessions/<rcw-…>
 * does not survive a VM restart. When the home goes, the connected
 * folder goes with it. The UI still presents the folder as connected
 * while every tool call fails; recovery logs:
 *
 *   [process] user rcw-01toqkmz1tbremcwdforbzyz should exist but doesn't,
 *   attempting recovery from home directory
 *   [process] recovery failed for user rcw-01toqkmz1tbremcwdforbzyz
 *   (home directory /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist)
 *
 * Pair appears ~30× across 14 days aligned with VM starts. Host
 * disk-low ruled out. Cousins (closed without named fix): #24483,
 * #24190, #24549. Expected: home survives restart, OR app admits
 * session is gone and offers a clean reconnect — not a ghost
 * "connected" folder.
 *
 *   node disseisin.mjs data/disseised.json
 *   echo '{"seed":"disseised"}' | node disseisin.mjs
 *
 * Idle word is seised (HOLD: home intact after restart).
 * Seeded word is disseised (#93574 fault).
 * Path word is home-evaporated.
 * Product score word is disseisin (Score disseisin or admit seised.).
 *
 * Encoded from anthropics/claude-code#93574 issue text only.
 * Hypothesis (NON-BINDING): recovery looks for /sessions/<rcw-…>
 * after VM restart and fails when the VM filesystem was ephemeral;
 * UI keeps the folder binding anyway. Verify against #93574 text
 * only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "hold",
  "home-intact",
  "sessions-void",
  "recovery-failed",
  "ghost-connected",
  "tool-calls-fail",
  "vm-restart",
  "pair-thirty",
  "fourteen-days",
  "disk-low-ruled-out",
  "rcw-user",
  "coworkd-log",
  "folder-lost",
  "admit-gone",
  "clean-reconnect",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "seised";
export const PATH_WORD = "home-evaporated";
export const SEEDED_WORD = "disseised";
export const PRODUCT_WORD = "disseisin";
export const HOLD = Object.freeze(["seised", "hold"]);
export const RECOVER = Object.freeze(["seised", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "compline",
  "lingering",
  "unrung",
  "closed",
  "cipherlock",
  "sealed",
  "blanked",
  "concurrent-write",
  "attainder",
  "untainted",
  "attainted",
  "retire-parked",
  "sourdine",
  "voiced",
  "muted",
  "mid-narration",
  "forksink",
  "lodged",
  "dropped",
  "source-fork",
  "foxfire",
  "kindled",
  "painted",
  "never-turns",
  "pentimento",
  "flushed",
  "lagged",
  "one-behind",
  "vinculum",
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "cachet",
  "imprimatur",
  "ukase",
  "understudy",
  "fetch",
  "hit",
  "flattened",
  "string-carrier",
  "steady",
  "strobing",
  "off-label",
  "strobe",
  "matched",
  "skewed",
  "headers-hash",
  "counterfoil",
  "traced",
  "pathless",
  "image-cache",
  "lucida",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "mismatched",
  "issuer",
  "paraph",
  "sterling",
  "debased",
  "hallmark",
  "remanent",
  "collimated",
  "diopter",
  "hysteresis",
  "banked",
  "ephemera",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "slipped",
  "sprung",
  "springe",
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
  "oubliette",
  "voided",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "culled",
  "intact",
  "procrustes",
  "drained",
  "gated",
  "sump",
  "spillway",
  "quietus",
  "rubric",
  "recension",
  "priory",
  "waived",
  "refused",
  "imprinted",
  "ukased",
  "miscast",
  "ghosted",
  "scraped",
  "fabricated",
  "homestead",
  "relict",
  "mirage",
  "wraith",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "disseised" && name !== "disseisin",
  ),
);

export const FEATURED_ISSUE = 93574;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93574";
export const TITLE =
  "[BUG] Cowork loses a session's home directory on VM restart, and the connected folder goes with it";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:cowork",
]);
export const CLAUDE_CODE_VERSION = "2.1.260";
export const OS = "macOS 26 (Darwin 24.6.0)";
export const CLIENT = "Cowork";
export const SDK_BINARY = "2.1.260";
export const DESKTOP_BUILD = "Claude desktop with SDK binary 2.1.260";
export const LOG_PATH = "~/Library/Logs/Claude/coworkd.log";
export const RCW_USER = "rcw-01toqkmz1tbremcwdforbzyz";
export const HOME_PATH = "/sessions/rcw-01toqkmz1tbremcwdforbzyz";
export const SESSIONS_PREFIX = "/sessions/";
export const RCW_PATTERN = /^rcw-[a-z0-9]+$/;
export const RECOVERY_ATTEMPT =
  "[process] user rcw-01toqkmz1tbremcwdforbzyz should exist but doesn't, attempting recovery from home directory";
export const RECOVERY_FAILED =
  "[process] recovery failed for user rcw-01toqkmz1tbremcwdforbzyz (home directory /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist)";
export const PAIR_COUNT = 30;
export const SPAN_DAYS = 14;
export const SPAN_START = "2026-04-27";
export const SPAN_END = "2026-09-10";
export const DISK_LOW_DAY = "2026-09-10";
export const SUPPORT_MAILS = 7;
export const SUPPORT_SINCE = "2026-09-06";
export const PHRASE = "Score disseisin or admit seised.";
export const DISTRIBUTION =
  "Claude desktop with SDK binary 2.1.260 — Cowork surface, macOS 26 (Darwin 24.6.0). coworkd.log on the host. Not the CLI binary.";
export const SESSION_KIND =
  "Cowork session whose VM home under /sessions/<rcw-…> evaporates on VM restart; UI keeps the folder binding as connected";

export const MANOR_STATIONS = Object.freeze([
  {
    id: "tenement",
    survey: "read the freehold tenement (session home under /sessions/<rcw-…>)",
    kind: "tenement",
    note: "seeded: tenement evaporated — /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist",
  },
  {
    id: "roll",
    survey: "call the manor roll (user should still be listed after restart)",
    kind: "roll",
    note: "seeded: roll still names rcw-01toqkmz1tbremcwdforbzyz though the home is gone",
  },
  {
    id: "writ",
    survey: "issue the writ of novel disseisin (VM restart as the disseisor)",
    kind: "writ",
    note: "seeded: pair of recovery lines aligns with VM starts, ~30× across 14 days",
  },
  {
    id: "ghost",
    survey: "inspect the ghost deed (folder still presented as connected)",
    kind: "ghost",
    note: "seeded: UI shows the folder connected while every tool call fails",
  },
  {
    id: "docket",
    survey: "read the clerk docket (coworkd.log recovery pair)",
    kind: "docket",
    note: "seeded: recovery attempted from home directory, then failed — home does not exist",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "home-evaporated",
  "disseised",
  "sessions-void",
  "recovery-failed",
  "ghost-connected",
  "tool-calls-fail",
  "vm-restart",
  "pair-thirty",
]);

export const COUSINS = Object.freeze([
  {
    issue: 24483,
    title: "cite-only cousin — closed without a named fix",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — same fault family; closed without a named fix. Do not rebuild",
  },
  {
    issue: 24190,
    title: "cite-only cousin — closed without a named fix",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — same fault family; two of the three cousins closed as duplicates. Do not rebuild",
  },
  {
    issue: 24549,
    title: "cite-only cousin — closed without a named fix",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — same fault family; one closed for inactivity. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93576, title: "allowUnixSockets /tmp symlink EPERM", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93553, title: "self-uploaded plugin install frozen", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93546, title: "forged background-task completion notifications", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93530, title: "Esc kills unrelated background subagent", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93556, title: "cloud scheduled task stalls at first turn", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93570, title: "single-task shutdown kills all", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93588, title: "statusLine never in git cwd", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "scapegoat",
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "oubliette",
  "ephemera",
  "homestead",
  "relict",
  "mirage",
  "wraith",
  "imprimatur",
  "ukase",
  "understudy",
  "fetch",
  "quietus",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
]);

export const SAMPLE_TENEMENT = Object.freeze({
  user: RCW_USER,
  path: HOME_PATH,
  exists: false,
  prefix: SESSIONS_PREFIX,
});

export const SAMPLE_SEISED_TENEMENT = Object.freeze({
  user: RCW_USER,
  path: HOME_PATH,
  exists: true,
  prefix: SESSIONS_PREFIX,
});

export const SAMPLE_ROLL = Object.freeze({
  user: RCW_USER,
  listed: true,
  seisinClaimed: true,
});

export const SAMPLE_WRIT = Object.freeze({
  kind: "novel-disseisin",
  disseisor: "vm-restart",
  aligned: true,
  pairCount: PAIR_COUNT,
  spanDays: SPAN_DAYS,
  spanStart: SPAN_START,
  spanEnd: SPAN_END,
});

export const SAMPLE_GHOST = Object.freeze({
  folderConnected: true,
  toolCallsFail: true,
  askedToAddAgain: true,
});

export const SAMPLE_DOCKET = Object.freeze([
  { t: "restart", line: RECOVERY_ATTEMPT },
  { t: "fail", line: RECOVERY_FAILED },
]);

export const SAMPLE_LOG = Object.freeze([
  { t: "connect", line: "Cowork session started with a folder connected" },
  { t: "restart", line: "Quit the desktop app, or let the VM restart" },
  { t: "reopen", line: RECOVERY_ATTEMPT },
  { t: "void", line: RECOVERY_FAILED },
  { t: "ghost", line: "UI still presents the folder as connected" },
  { t: "tools", line: "every tool call fails; app asks to add the folder again mid-task" },
]);

function isRcwUser(value) {
  return typeof value === "string" && RCW_PATTERN.test(value);
}

function isSessionsHome(value) {
  return typeof value === "string" && value.startsWith(SESSIONS_PREFIX);
}

export function inspectTenement(input = {}) {
  const tenement =
    input.tenement && typeof input.tenement === "object"
      ? input.tenement
      : input.seised === true && input.disseised !== true
        ? SAMPLE_SEISED_TENEMENT
        : SAMPLE_TENEMENT;
  const forcedVoid =
    input.sessionsVoid === true ||
    input.event === "sessions-void" ||
    input.homeEvaporated === true ||
    input.event === "home-evaporated" ||
    (input.disseised === true && input.seised !== true);
  const exists = forcedVoid ? false : tenement.exists !== false;
  const voided = !exists;
  return {
    exists,
    voided,
    path: tenement.path || HOME_PATH,
    user: tenement.user || RCW_USER,
    stamp: voided ? "void" : "intact",
    note: voided
      ? "tenement evaporated — /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist"
      : "tenement intact — session home survived the VM restart",
  };
}

export function inspectRoll(input = {}) {
  const roll =
    input.roll && typeof input.roll === "object" ? input.roll : SAMPLE_ROLL;
  const listed = roll.listed !== false;
  const claimed =
    roll.seisinClaimed === true ||
    input.ghostConnected === true ||
    input.disseised === true;
  return {
    listed,
    claimed: listed && claimed,
    user: roll.user || RCW_USER,
    stamp: listed ? "enrolled" : "struck",
    note: listed
      ? "manor roll still names the rcw user — seisin claimed after the home is gone"
      : "manor roll struck — user no longer enrolled",
  };
}

export function inspectWrit(input = {}) {
  const restart =
    input.vmRestart === true ||
    input.event === "vm-restart" ||
    input.pairThirty === true ||
    (input.disseised === true && input.seised !== true);
  return {
    issued: restart,
    disseisor: restart ? "vm-restart" : "none",
    pairCount: input.pairCount || PAIR_COUNT,
    spanDays: input.spanDays || SPAN_DAYS,
    stamp: restart ? "novel-disseisin" : "quiet",
    note: restart
      ? "writ of novel disseisin — VM restart aligned with the recovery pair"
      : "no writ — manor quiet; no VM restart on the roll",
  };
}

export function inspectGhost(input = {}) {
  const connected =
    input.ghostConnected === true ||
    input.event === "ghost-connected" ||
    input.event === "folder-lost" ||
    (input.disseised === true &&
      input.seised !== true &&
      input.admitGone !== true);
  const toolsFail =
    input.toolCallsFail === true ||
    input.event === "tool-calls-fail" ||
    connected;
  return {
    connected,
    toolsFail,
    stamp: connected ? "ghost" : "honest",
    note: connected
      ? "ghost deed — folder still presented as connected while every tool call fails"
      : "honest deed — folder binding matches a living home, or the session is admitted gone",
  };
}

export function inspectDocket(input = {}) {
  const events = Array.isArray(input.log)
    ? input.log
    : Array.isArray(input.docket)
      ? input.docket
      : input.seised === true && input.disseised !== true
        ? []
        : SAMPLE_DOCKET;
  const attempt = events.some((row) =>
    /should exist but doesn't, attempting recovery/i.test(row.line || row.text || ""),
  );
  const failed = events.some((row) =>
    /recovery failed/i.test(row.line || row.text || "") &&
    /does not exist/i.test(row.line || row.text || ""),
  );
  const forced =
    input.recoveryFailed === true ||
    input.event === "recovery-failed" ||
    input.event === "coworkd-log";
  const pair = forced || (attempt && failed);
  return {
    attempt: attempt || forced,
    failed: failed || forced,
    pair,
    events,
    stamp: pair ? "failed" : "quiet",
    note: pair
      ? "clerk docket — recovery attempted from home directory, then failed; home does not exist"
      : "clerk docket quiet — no recovery-failed pair on coworkd.log",
  };
}

export function readManor(input = {}) {
  const tenement = inspectTenement(input);
  const roll = inspectRoll(input);
  const writ = inspectWrit(input);
  const ghost = inspectGhost(input);
  const docket = inspectDocket(input);
  const disseised =
    tenement.voided ||
    docket.pair ||
    ghost.connected ||
    input.disseised === true;
  const seised =
    input.seised === true &&
    disseised !== true &&
    tenement.exists &&
    !ghost.connected;
  const path =
    tenement.voided &&
    (input.event === "home-evaporated" || input.homeEvaporated === true);
  return {
    tenement,
    roll,
    writ,
    ghost,
    docket,
    stations: MANOR_STATIONS,
    disseised: disseised && !seised && !path,
    seised:
      seised ||
      (tenement.exists &&
        !ghost.connected &&
        input.disseised !== true &&
        input.homeEvaporated !== true),
    homeEvaporated: path && !seised,
    mark:
      path && !seised
        ? "home-evaporated"
        : disseised && !seised
          ? "disseised"
          : "seised",
  };
}

/**
 * Published disseisin walk from #93574 only. Facts from the issue text.
 * A seised booth keeps the VM home after restart.
 * A disseised booth loses /sessions/<rcw-…> and ghosts the folder.
 * A home-evaporated booth names the evaporated tenement as the cut.
 */
export const DISSEISIN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-seised",
    seised: true,
    disseised: false,
    homeIntact: true,
    cue: "seised",
    note: "idle HOLD: session home intact after restart — seisin holds",
  },
  {
    t: "connect",
    event: "folder-connected",
    seised: true,
    folderConnected: true,
    cue: "seised",
    note: "Start a Cowork session with a folder connected",
  },
  {
    t: "restart",
    event: "vm-restart",
    disseised: true,
    vmRestart: true,
    cue: "disseised",
    note: "Quit the desktop app, or let the VM restart",
  },
  {
    t: "void",
    event: "sessions-void",
    disseised: true,
    sessionsVoid: true,
    cue: "disseised",
    note: "home directory /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist",
  },
  {
    t: "recover",
    event: "recovery-failed",
    disseised: true,
    recoveryFailed: true,
    cue: "disseised",
    note: "user should exist but doesn't; recovery from home directory fails",
  },
  {
    t: "ghost",
    event: "ghost-connected",
    disseised: true,
    ghostConnected: true,
    cue: "disseised",
    note: "UI still presents the folder as connected",
  },
  {
    t: "tools",
    event: "tool-calls-fail",
    disseised: true,
    toolCallsFail: true,
    cue: "disseised",
    note: "every tool call fails; app asks to add the folder again mid-task",
  },
  {
    t: "pair",
    event: "pair-thirty",
    disseised: true,
    pairThirty: true,
    cue: "disseised",
    note: "pair appears 30 times across 14 days between 27 April and 10 September 2026",
  },
  {
    t: "disk",
    event: "disk-low-ruled-out",
    disseised: true,
    diskLowRuledOut: true,
    cue: "disseised",
    note: "host disk was low on 10 September and was cleared, so that is ruled out",
  },
  {
    t: "path",
    event: "home-evaporated",
    disseised: true,
    homeEvaporated: true,
    sessionsVoid: true,
    cue: "disseised",
    note: "home-evaporated — the tenement under /sessions/<rcw-…> did not survive the restart",
  },
  {
    t: "score",
    event: "disseisin",
    disseised: true,
    sessionsVoid: true,
    recoveryFailed: true,
    ghostConnected: true,
    toolCallsFail: true,
    cue: "disseised",
    note: "disseisin — wrongful dispossession of the session domicile; ghost seisin remains",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "intact",
    event: "home-intact",
    seised: true,
    homeIntact: true,
    cue: "seised",
    note: "positive control: a session's home under /sessions/ survives a VM restart",
  },
  {
    t: "admit",
    event: "admit-gone",
    seised: true,
    admitGone: true,
    cue: "seised",
    note: "positive control: the app says the session is gone rather than ghosting the folder",
  },
  {
    t: "reconnect",
    event: "clean-reconnect",
    seised: true,
    cleanReconnect: true,
    cue: "seised",
    note: "positive control: offer to start a new session with the same folder",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    seised: true,
    disseised: false,
    homeIntact: true,
    cue: "seised",
  };
}

export function seedSeised() {
  return { ...emptyTicket() };
}

export function seedDisseised() {
  return {
    seed: SEEDED_WORD,
    seised: false,
    disseised: true,
    sessionsVoid: true,
    recoveryFailed: true,
    ghostConnected: true,
    toolCallsFail: true,
    vmRestart: true,
    homeEvaporated: true,
    pairThirty: true,
    diskLowRuledOut: true,
    cue: "disseised",
    issue: FEATURED_ISSUE,
    tenement: SAMPLE_TENEMENT,
    ghost: SAMPLE_GHOST,
    docket: SAMPLE_DOCKET,
  };
}

export function seedDisseisin() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    disseised: true,
    sessionsVoid: true,
    recoveryFailed: true,
    ghostConnected: true,
    toolCallsFail: true,
    cue: "disseised",
  };
}

export function seedHomeEvaporated() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    disseised: true,
    homeEvaporated: true,
    sessionsVoid: true,
    event: "home-evaporated",
    cue: "disseised",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    seised: true,
    cue: "seised",
  };
}

export function seedHomeIntact() {
  return {
    seed: "home-intact",
    preferSeed: true,
    homeIntact: true,
    cue: "seised",
  };
}

export function seedSessionsVoid() {
  return {
    seed: "sessions-void",
    preferSeed: true,
    sessionsVoid: true,
    cue: "disseised",
  };
}

export function seedRecoveryFailed() {
  return {
    seed: "recovery-failed",
    preferSeed: true,
    recoveryFailed: true,
    cue: "disseised",
  };
}

export function seedGhostConnected() {
  return {
    seed: "ghost-connected",
    preferSeed: true,
    ghostConnected: true,
    cue: "disseised",
  };
}

export function seedToolCallsFail() {
  return {
    seed: "tool-calls-fail",
    preferSeed: true,
    toolCallsFail: true,
    cue: "disseised",
  };
}

export function seedVmRestart() {
  return {
    seed: "vm-restart",
    preferSeed: true,
    vmRestart: true,
    cue: "disseised",
  };
}

export function seedPairThirty() {
  return {
    seed: "pair-thirty",
    preferSeed: true,
    pairThirty: true,
    cue: "disseised",
  };
}

export function seedFourteenDays() {
  return {
    seed: "fourteen-days",
    preferSeed: true,
    fourteenDays: true,
    cue: "disseised",
  };
}

export function seedDiskLowRuledOut() {
  return {
    seed: "disk-low-ruled-out",
    preferSeed: true,
    diskLowRuledOut: true,
    cue: "disseised",
  };
}

export function seedRcwUser() {
  return {
    seed: "rcw-user",
    preferSeed: true,
    rcwUser: true,
    cue: "disseised",
  };
}

export function seedCoworkdLog() {
  return {
    seed: "coworkd-log",
    preferSeed: true,
    coworkdLog: true,
    cue: "disseised",
  };
}

export function seedFolderLost() {
  return {
    seed: "folder-lost",
    preferSeed: true,
    folderLost: true,
    cue: "disseised",
  };
}

export function seedAdmitGone() {
  return {
    seed: "admit-gone",
    preferSeed: true,
    admitGone: true,
    cue: "seised",
  };
}

export function seedCleanReconnect() {
  return {
    seed: "clean-reconnect",
    preferSeed: true,
    cleanReconnect: true,
    cue: "seised",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      seised: false,
      disseised: false,
      homeEvaporated: false,
      homeIntact: false,
      sessionsVoid: false,
      recoveryFailed: false,
      ghostConnected: false,
      toolCallsFail: false,
      vmRestart: false,
      pairThirty: false,
      fourteenDays: false,
      diskLowRuledOut: false,
      rcwUser: false,
      coworkdLog: false,
      folderLost: false,
      admitGone: false,
      cleanReconnect: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    seised: raw.seised === true,
    disseised:
      raw.disseised === true ||
      raw.event === "disseised" ||
      raw.event === "disseisin",
    homeEvaporated:
      raw.homeEvaporated === true || raw.event === "home-evaporated",
    homeIntact: raw.homeIntact === true || raw.event === "home-intact",
    sessionsVoid: raw.sessionsVoid === true || raw.event === "sessions-void",
    recoveryFailed:
      raw.recoveryFailed === true || raw.event === "recovery-failed",
    ghostConnected:
      raw.ghostConnected === true || raw.event === "ghost-connected",
    toolCallsFail:
      raw.toolCallsFail === true || raw.event === "tool-calls-fail",
    vmRestart: raw.vmRestart === true || raw.event === "vm-restart",
    pairThirty: raw.pairThirty === true || raw.event === "pair-thirty",
    fourteenDays: raw.fourteenDays === true || raw.event === "fourteen-days",
    diskLowRuledOut:
      raw.diskLowRuledOut === true || raw.event === "disk-low-ruled-out",
    rcwUser: raw.rcwUser === true || raw.event === "rcw-user",
    coworkdLog: raw.coworkdLog === true || raw.event === "coworkd-log",
    folderLost: raw.folderLost === true || raw.event === "folder-lost",
    admitGone: raw.admitGone === true || raw.event === "admit-gone",
    cleanReconnect:
      raw.cleanReconnect === true || raw.event === "clean-reconnect",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    tenement: raw.tenement,
    roll: raw.roll,
    ghost: raw.ghost,
    docket: raw.docket || raw.log,
    log: raw.log || raw.docket,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.seised != null ||
        ticket.disseised != null ||
        ticket.homeEvaporated != null ||
        ticket.homeIntact != null ||
        ticket.sessionsVoid != null ||
        ticket.recoveryFailed != null ||
        ticket.ghostConnected != null ||
        ticket.toolCallsFail != null ||
        ticket.vmRestart != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.tenement ||
        ticket.ghost ||
        ticket.docket),
  );
}

function isSeised(row) {
  if (row.disseised && row.cue !== "seised") return false;
  if (
    row.cue === "disseised" ||
    row.cue === "disseisin" ||
    row.cue === "home-evaporated"
  ) {
    return false;
  }
  if (
    row.sessionsVoid &&
    row.ghostConnected &&
    row.cue !== "seised" &&
    row.seised !== true
  ) {
    return false;
  }
  if (
    row.homeEvaporated &&
    row.sessionsVoid &&
    row.cue !== "seised" &&
    row.seised !== true
  ) {
    return false;
  }
  if (
    row.seised === true &&
    row.disseised !== true &&
    row.cue !== "disseised"
  ) {
    return true;
  }
  if (
    row.cue === "seised" &&
    row.disseised !== true &&
    row.sessionsVoid !== true &&
    row.homeEvaporated !== true
  ) {
    return true;
  }
  if (
    (row.homeIntact === true ||
      row.admitGone === true ||
      row.cleanReconnect === true) &&
    row.disseised !== true &&
    row.sessionsVoid !== true &&
    row.ghostConnected !== true &&
    row.homeEvaporated !== true
  ) {
    return true;
  }
  return false;
}

function isHomeEvaporatedPath(row) {
  return (
    row.event === "home-evaporated" &&
    !isSeised(row) &&
    (row.homeEvaporated === true ||
      row.sessionsVoid === true ||
      row.recoveryFailed === true)
  );
}

function isDisseised(row) {
  if (isSeised(row)) return false;
  if (isHomeEvaporatedPath(row) && row.cue !== "disseised") return false;
  if (row.cue === "disseised" || row.cue === "disseisin") return true;
  if (row.disseised === true) return true;
  if (
    row.sessionsVoid === true &&
    row.ghostConnected === true &&
    row.toolCallsFail === true
  ) {
    return true;
  }
  if (row.recoveryFailed === true && row.sessionsVoid === true) {
    return true;
  }
  if (
    row.ghostConnected === true ||
    row.toolCallsFail === true ||
    row.vmRestart === true ||
    (row.sessionsVoid === true && row.pairThirty === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one manor-court pass against the disseisin booth.
 * seised: home intact after restart.
 * disseised: /sessions/<rcw-…> gone; folder still shown connected.
 * home-evaporated: the evaporated tenement is the cut.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHomeEvaporatedPath(row) ||
    (row.homeEvaporated && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "home-evaporated";
  } else if (isDisseised(row)) {
    verdict = "disseised";
  } else if (isSeised(row)) {
    verdict = "seised";
  } else if (
    row.sessionsVoid ||
    row.recoveryFailed ||
    row.ghostConnected ||
    (row.vmRestart && !row.admitGone)
  ) {
    verdict = "disseised";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const tenement = inspectTenement(row);
  const roll = inspectRoll(row);
  const writ = inspectWrit(row);
  const ghost = inspectGhost(row);
  const docket = inspectDocket(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    seised: verdict === "seised" || verdict === "hold",
    disseised:
      verdict === "disseised" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    homeEvaporated:
      row.homeEvaporated === true ||
      verdict === "home-evaporated" ||
      verdict === PATH_WORD,
    homeIntact: row.homeIntact,
    sessionsVoid: row.sessionsVoid,
    recoveryFailed: row.recoveryFailed,
    ghostConnected: row.ghostConnected,
    toolCallsFail: row.toolCallsFail,
    vmRestart: row.vmRestart,
    pairThirty: row.pairThirty,
    fourteenDays: row.fourteenDays,
    diskLowRuledOut: row.diskLowRuledOut,
    rcwUser: row.rcwUser,
    coworkdLog: row.coworkdLog,
    folderLost: row.folderLost,
    admitGone: row.admitGone,
    cleanReconnect: row.cleanReconnect,
    cue: hold
      ? "seised"
      : row.homeEvaporated || verdict === "home-evaporated"
        ? "home-evaporated"
        : "disseised",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit seised" : "score disseisin",
    tenementInspect: tenement,
    rollInspect: roll,
    writInspect: writ,
    ghostInspect: ghost,
    docketInspect: docket,
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
      : DISSEISIN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const disseised = scored.filter((row) => row.verdict === "disseised");
  const path = scored.filter((row) => row.verdict === "home-evaporated");
  const seised = scored.filter((row) => row.verdict === "seised");
  const headline =
    scored.find((row) => row.event === "disseised") ||
    scored.find((row) => row.event === "home-evaporated") ||
    scored.find((row) => row.event === "sessions-void") ||
    disseised[disseised.length - 1];
  let verdict = "seised";
  if (disseised.length) verdict = "disseised";
  else if (path.length && !seised.length) verdict = "home-evaporated";
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
    disseisedCount: disseised.length,
    pathCount: path.length,
    seisedCount: seised.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit seised" : "score disseisin",
    note: headline
      ? "Claude desktop SDK 2.1.260 Cowork; /sessions/rcw-01toqkmz1tbremcwdforbzyz gone after VM restart; recovery failed; folder still shown connected; pair ~30× / 14 days."
      : "published disseisin walk scored against seised vs disseised",
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
    seeded !== "seised" &&
    seeded !== "disseised" &&
    seeded !== "home-evaporated" &&
    seeded !== "disseisin" &&
    ticket.seised == null &&
    ticket.disseised == null &&
    ticket.sessionsVoid == null &&
    ticket.homeEvaporated == null &&
    ticket.ghostConnected == null &&
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
    seised: scored.seised ?? false,
    disseised: scored.disseised ?? false,
    homeEvaporated: scored.homeEvaporated ?? false,
    homeIntact: scored.homeIntact ?? false,
    sessionsVoid: scored.sessionsVoid ?? false,
    recoveryFailed: scored.recoveryFailed ?? false,
    ghostConnected: scored.ghostConnected ?? false,
    toolCallsFail: scored.toolCallsFail ?? false,
    vmRestart: scored.vmRestart ?? false,
    pairThirty: scored.pairThirty ?? false,
    diskLowRuledOut: scored.diskLowRuledOut ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.sessionsVoid || result.disseised
      ? "tenement=void"
      : "tenement=intact",
    result.rcwUser || result.disseised || isRcwUser(RCW_USER)
      ? "roll=rcw"
      : "roll=blank",
    result.vmRestart || result.disseised
      ? "writ=restart"
      : "writ=quiet",
    result.ghostConnected || result.disseised
      ? "ghost=connected"
      : "ghost=honest",
    result.recoveryFailed || result.disseised
      ? "docket=failed"
      : "docket=quiet",
    result.homeEvaporated || result.verdict === "home-evaporated"
      ? "path=home-evaporated"
      : "path=seised",
    result.cue === "seised"
      ? "cue=seised"
      : result.cue === "home-evaporated"
        ? "cue=home-evaporated"
        : "cue=disseised",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const manor = readManor({
    seised: result.seised,
    disseised: result.disseised,
    homeEvaporated: result.homeEvaporated,
    homeIntact: result.homeIntact,
    sessionsVoid: result.sessionsVoid,
    recoveryFailed: result.recoveryFailed,
    ghostConnected: result.ghostConnected,
    toolCallsFail: result.toolCallsFail,
    vmRestart: result.vmRestart,
    tenement: input && input.tenement,
    roll: input && input.roll,
    ghost: input && input.ghost,
    docket: input && input.docket,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    manor,
    tenement: inspectTenement({
      seised: result.seised,
      disseised: result.disseised,
      sessionsVoid: result.sessionsVoid,
      homeEvaporated: result.homeEvaporated,
      tenement: input && input.tenement,
    }),
    roll: inspectRoll({
      seised: result.seised,
      disseised: result.disseised,
      ghostConnected: result.ghostConnected,
      roll: input && input.roll,
    }),
    writ: inspectWrit({
      seised: result.seised,
      disseised: result.disseised,
      vmRestart: result.vmRestart,
      pairThirty: result.pairThirty,
    }),
    ghost: inspectGhost({
      seised: result.seised,
      disseised: result.disseised,
      ghostConnected: result.ghostConnected,
      toolCallsFail: result.toolCallsFail,
      admitGone: result.admitGone,
    }),
    docket: inspectDocket({
      recoveryFailed: result.recoveryFailed,
      log: input && input.log,
      docket: input && input.docket,
    }),
    stations: MANOR_STATIONS.map((row) => ({
      ...row,
      disseised: result.disseised === true || result.verdict === "disseised",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      os: OS,
      client: CLIENT,
      sdkBinary: SDK_BINARY,
      desktopBuild: DESKTOP_BUILD,
      logPath: LOG_PATH,
      rcwUser: RCW_USER,
      homePath: HOME_PATH,
      sessionsPrefix: SESSIONS_PREFIX,
      rcwPattern: String(RCW_PATTERN),
      recoveryAttempt: RECOVERY_ATTEMPT,
      recoveryFailed: RECOVERY_FAILED,
      pairCount: PAIR_COUNT,
      spanDays: SPAN_DAYS,
      spanStart: SPAN_START,
      spanEnd: SPAN_END,
      diskLowDay: DISK_LOW_DAY,
      supportMails: SUPPORT_MAILS,
      supportSince: SUPPORT_SINCE,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: MANOR_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "A session's home under /sessions/ survives a VM restart",
        "OR the app says the session is gone and offers to start a new one with the same folder",
        "Not a ghost connected folder while every tool call fails",
      ],
      hypothesis:
        "NON-BINDING: recovery looks for /sessions/<rcw-…> after VM restart and fails when the VM filesystem was ephemeral; UI keeps the folder binding anyway. Verify against #93574 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
