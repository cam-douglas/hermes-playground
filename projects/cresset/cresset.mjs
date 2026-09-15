#!/usr/bin/env node
/**
 * Cresset — iron fire-basket / night-wall / GNOME-suspend booth.
 * A cresset is an iron basket kept burning aloft on walls and ships.
 * Metaphor: Desktop "Keep computer awake while Claude works" is a
 * night cresset. It should snuff when no Code turn is active so
 * GNOME idle suspend can fire. After a re-adopted or stalled Code
 * session the basket stays lit — a hold-leak — and night suspend
 * is blocked for hours.
 * Ember / iron / ash / night / spark-gold / cooling-blue.
 * Night wall / iron basket / GNOME suspend dial / hold ledger.
 * NOT Dictabelt voice-dictation booth. NOT Lemure household shrine.
 * NOT Cancellans binder. NOT Arras tapestry. NOT Frangible /
 * Nameplate / Matryoshka / Dragnet.
 *
 * Educational diagnostic model for a published Claude Desktop
 * Linux keep-awake failure: with keep-awake enabled, Desktop takes
 * a keep-awake hold per Code turn and normally releases when the
 * session goes idle. On Linux the hold is a GNOME session-manager
 * inhibitor (app id /usr/bin/claude-desktop, flags 4 = suspend).
 * After re-adopt or stall the Code-session claim is never released,
 * so GNOME idle suspend stays blocked. Remote-tools-device claims
 * inside the same hold still take and release normally.
 *
 * Encoded from anthropics/claude-code#94420 issue text only.
 * Hypothesis (NON-BINDING — issue text): re-adopt and stall paths
 * take a Code-session keep-awake claim but miss the idle-release /
 * stop path that ordinary turns use; remote-tools-device claims
 * continue cycling inside the same hold. Invite verify against
 * issue text only. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a Claude Code fix. No network.
 * No exploits. No live Claude.
 *
 *   node cresset.mjs data/cresset.json
 *   echo '{"seed":"cresset"}' | node cresset.mjs
 *
 * Idle word is released (HOLD: keep-awake / GNOME suspend inhibitor
 * drops when no Code turn is active).
 * HOLD aliases: slack, yielding, extinguished, idle-ok, suspend-ready.
 * Seeded word is cresset (#94420 path).
 * Path word is hold-leak.
 * Product score word is cresset (Score cresset or admit released.).
 *
 * NOT #94415 (Cowork scheduled task permanently disabled after
 * device asleep — schedule suspension_reason, not keep-awake hold).
 * NOT #94392 (headless -p exits with Tasks still running — CLI
 * process exit vs desktop inhibitor).
 * NOT #93924 (Remote Control makes local session slower — RC perf).
 * Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "released",
  "cresset",
  "hold-leak",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
  "re-adopt",
  "stalled",
  "armed-grace",
  "inhibitor",
  "gnome-suspend",
  "code-session-claim",
  "remote-tools-ok",
  "battery-false",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "released";
export const PATH_WORD = "hold-leak";
export const SEEDED_WORD = "cresset";
export const PRODUCT_WORD = "cresset";
export const HOLD = Object.freeze(["released"]);
export const HOLD_ALIASES = Object.freeze([
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
]);
export const RECOVER = Object.freeze(["released"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "verbatim",
  "quiet",
  "intact",
  "cleared",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
  "rostered",
  "lararium",
  "stilled",
  "listed",
  "removable",
  "bound",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "bit-set",
  "+x",
  "engraved",
  "plated",
  "labeled",
  "titled",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
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
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "orphan-tick",
  "deferred-delta",
  "segment-drop",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94420;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94420";
export const TITLE =
  'Desktop (Linux): "Keep computer awake while Claude works" hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:desktop",
]);
export const PLATFORM = "linux";
export const SURFACE = "hold-leak";
export const HOST =
  "Claude Code 2.1.270; Claude Desktop 1.52386.6 (claude-desktop .deb); Pop!_OS 22.04; GNOME Shell 42.9; X11";
export const CHECKED_ON =
  "Published report: keep-awake hold taken per Code turn; ordinary idle release; after re-adopt or stall the GNOME suspend inhibitor stays; remote-tools-device claims still cycle";
export const BUILD =
  "Claude Code 2.1.270; Claude Desktop 1.52386.6; claude-desktop .deb";
export const SELECTED_MODEL =
  "desktop keep-awake GNOME suspend inhibitor hold-leak after re-adopt or stall — not a model defect";
export const OS =
  "Pop!_OS 22.04; GNOME Shell 42.9; X11; platform:linux / area:desktop";
export const PHRASE = "Score cresset or admit released.";
export const DISTRIBUTION =
  "With Keep computer awake while Claude works enabled, Desktop takes a keep-awake hold per Code turn and normally releases when the session goes idle (logs: hold taken / hold released with idle reason). On Linux the hold is a GNOME session-manager inhibitor (app id /usr/bin/claude-desktop, flags 4 = suspend). Case 1 (reproduced on demand): quit mid-turn on a remote SSH Code session, relaunch; re-adopt takes a hold at 10:59:05; the re-adopted turn completes at 10:59:31; the only other Code turn ends at 11:00:12; from 11:00:12 to 11:07:04 no Code turn is running, yet the hold is never released and the GNOME inhibitor stays. Ordinary holds in the same session released after 118 s and 174 s. Earlier unattended: the same re-adoption hold lasted 4h38m, 3h24m of it after the session had finished, and ended with reason armed_grace rather than idle. Case 2 (observed): a hold started at 23:42:14; at 01:56:20 the app logged the session no longer counted (stalled), but hold id=25 was never stopped — no code session hold released and no stopped line. Meanwhile remote-tools-device claims inside the same hold kept being taken and released normally, so only the Code-session claim is keeping the hold alive. GNOME was set to suspend after 15 minutes idle; last user input 01:25; from 01:56 nothing should have blocked suspend, but GNOME never suspended. The machine only suspended at 02:15 through a separate root cron job that does not honour GNOME session inhibitors. Expected: the Code-session claim should be released as soon as no Code session is mid-turn — when a re-adopted session's turn completes, the same way an ordinary turn's hold is released; when a session is dropped as stalled, the hold should be re-evaluated and released if nothing else claims it.";

export const DESKTOP_BUILD = "1.52386.6";
export const CODE_BUILD = "2.1.270";
export const APP_ID = "/usr/bin/claude-desktop";
export const INHIBITOR_FLAGS = 4;
export const GNOME_IDLE_MIN = 15;
export const ORDINARY_RELEASE_MS = Object.freeze([118291, 173828]);
export const UNATTENDED_HOLD = "4h38m";
export const UNATTENDED_AFTER_FINISH = "3h24m";
export const ARMED_GRACE_REASON = "armed_grace";
export const BATTERY = false;
export const DISTRO = "Pop!_OS 22.04";
export const GNOME_SHELL = "42.9";
export const SESSION_TYPE = "X11";

/**
 * Synthetic example-data — reconstructs published log shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_ORDINARY = Object.freeze({
  taken: "10:54:50 [keep-awake] code session hold taken (turn, battery=false)",
  released: "10:57:44 [keep-awake] code session hold released (idle, held 173828ms)",
  synthetic: true,
});
export const SYNTHETIC_READOPT = Object.freeze({
  quit: "quit mid-turn on a remote SSH Code session",
  relaunch: "10:59:04 [SSH] Background re-adoption: re-adopting session <session-A>'s running Claude Code (mid-turn at quit)",
  taken: "10:59:05 [keep-awake] code session hold taken (turn, battery=false)",
  turnDone: "10:59:31 [Stop hook] Query completed for session <session-A>",
  quietFrom: "11:00:12",
  quietTo: "11:07:04",
  released: null,
  synthetic: true,
});
export const SYNTHETIC_STALLED = Object.freeze({
  taken: "23:42:14 [keep-awake] started (id=25, first claim=code_turn)",
  stalled: "01:56:20 [keep-awake] session <session-B> no longer counted (stalled)",
  remoteToolsHeld: "01:52:43 [remote-tools-device] keep-awake held (pss=0)",
  remoteToolsReleased: "01:57:43 [remote-tools-device] keep-awake released (quiet, held 300001ms)",
  released: null,
  synthetic: true,
});

export const BASKET_NAMES = Object.freeze([
  {
    id: "night-wall",
    lost: "Night wall — GNOME idle suspend should fire after 15m",
    control: "Ordinary Code-turn holds released after 118 s and 174 s",
    story: "the wall stays warm because the basket never snuffs",
  },
  {
    id: "iron-basket",
    lost: "Iron basket — keep-awake cresset taken per Code turn",
    control: "A finished turn should drop the Code-session claim",
    story: "the basket is still alight after the watch ends",
  },
  {
    id: "ember-snuff",
    lost: "Ember snuff — idle release never arrives after re-adopt",
    control: "Ordinary path logs hold released with idle reason",
    story: "the ember should go out; instead it burns through the night",
  },
  {
    id: "gnome-dial",
    lost: "GNOME dial — inhibitor flags 4 = suspend, app id claude-desktop",
    control: "With no Code turn, the dial should reach suspend-ready",
    story: "the 15m idle mark is passed and the machine never sleeps",
  },
  {
    id: "hold-ledger",
    lost: "Hold ledger — Code-session claim stays; remote-tools-device cycles",
    control: "Remote-tools claims take and release inside the same hold",
    story: "only the Code-session line keeps the inhibitor alive",
  },
  {
    id: "armed-grace",
    lost: "armed-grace — 4h38m hold, 3h24m after finished, not idle",
    control: "Release reason should be idle, not armed_grace",
    story: "the earlier unattended watch ended on armed_grace",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "night-wall",
    survey: "ordinary idle: keep-awake hold released when no Code turn is active",
    kind: "released",
    note: "idle/control: GNOME suspend inhibitor drops; night can sleep",
  },
  {
    id: "iron-basket",
    survey: "keep-awake cresset taken per Code turn (battery=false)",
    kind: "cresset",
    note: "seeded: iron basket taken and left hanging",
  },
  {
    id: "ember-snuff",
    survey: "re-adopt takes a hold; turn completes; no released / stopped line",
    kind: "cresset",
    note: "seeded: ember stays after the re-adopted turn ends",
  },
  {
    id: "gnome-dial",
    survey: "GNOME inhibitor app id /usr/bin/claude-desktop flags 4",
    kind: "cresset",
    note: "seeded: 15m idle suspend never fires",
  },
  {
    id: "hold-ledger",
    survey: "stalled session dropped from count; Code-session claim remains",
    kind: "cresset",
    note: "seeded: remote-tools-device still cycles; only Code-session leaks",
  },
  {
    id: "armed-grace",
    survey: "hold-leak — 4h38m / 3h24m after finished ended armed_grace not idle",
    kind: "cresset",
    note: "path: hold-leak names the stuck inhibitor",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "re-adopt",
    label: "re-adopt",
    count: "10:59:05 take",
    note: "Re-adopted mid-turn session takes a hold that never releases",
  },
  {
    id: "stalled",
    label: "stalled",
    count: "id=25",
    note: "Session no longer counted (stalled) but hold never stopped",
  },
  {
    id: "armed-grace",
    label: "armed-grace",
    count: "4h38m",
    note: "Earlier unattended hold ended armed_grace, not idle",
  },
  {
    id: "inhibitor",
    label: "inhibitor",
    count: "flags 4",
    note: "GNOME session-manager inhibitor app id /usr/bin/claude-desktop",
  },
  {
    id: "gnome-suspend",
    label: "gnome-suspend",
    count: "15m idle",
    note: "GNOME set to suspend after 15 minutes; suspend blocked for hours",
  },
  {
    id: "code-session-claim",
    label: "code-session-claim",
    count: "only this",
    note: "Remote-tools-device claims cycle; only Code-session keeps the hold",
  },
]);

export const RULED_OUT = Object.freeze([
  "#94415 — Cowork scheduled task permanently disabled after device asleep — schedule suspension_reason, not keep-awake hold; DIFFERENT",
  "#94392 — headless -p exits with Tasks still running — CLI process exit vs desktop inhibitor; DIFFERENT",
  "#93924 — Remote Control makes local session slower — RC perf, not a stuck GNOME inhibitor; DIFFERENT",
  "#45769 — macOS Electron NoIdleSleepAssertion held from launch until quit — closed as not planned; predates per-turn keep-awake claims; DIFFERENT",
  "#92010 — Remote Control hold not restored after relaunch — opposite polarity (missing restore vs never released); DIFFERENT",
  "Dictabelt/#94406 — desktop voice-dictation segment-drop; DIFFERENT",
  "Lemure/#94410 — leftover ScheduledTasks dispatcher ticks; DIFFERENT",
  "Cancellans/#94400 — deferred-delta binder folio; DIFFERENT",
  "Arras/#94348 — phantom-prompt theater tapestry; DIFFERENT",
  "Frangible/#94362 — chmod-failopen wax-seal; DIFFERENT",
  "Nameplate/#94349 — header-rename brass plate; DIFFERENT",
  "Matryoshka/#94350 — subst-nest nesting-doll; DIFFERENT",
  "Dragnet/#94064 — root-find night blotter; DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "The Code-session claim should be released as soon as no Code session is mid-turn",
  "When a re-adopted session's turn completes, the same way an ordinary turn's hold is released",
  "When a session is dropped from the count as stalled, the hold should be re-evaluated and released if nothing else claims it",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "hold-leak",
  "cresset",
  "re-adopt",
  "stalled",
  "inhibitor",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94415,
    title: "Cowork scheduled task permanently disabled after device asleep",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — schedule suspension_reason, not keep-awake hold. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94392,
    title: "headless -p exits with Tasks still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — CLI process exit vs desktop inhibitor. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93924,
    title: "Remote Control makes local session slower",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — RC perf, not a stuck GNOME inhibitor. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94344, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94398, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94397, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94396, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94415, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
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
  "wraith",
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

export const SAMPLE_KIND_IDLE = "night-wall";
export const SAMPLE_KIND_SEEDED = "hold-leak";
export const SAMPLE_HOLDING_IDLE = "suspend-ready";
export const SAMPLE_HOLDING_SEEDED = "inhibitor";

export const SAMPLE_RELEASED_PROOF = Object.freeze({
  released: true,
  cresset: false,
  holdLeak: false,
  reAdopt: false,
  stalled: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_CRESSET_PROOF = Object.freeze({
  released: false,
  cresset: true,
  holdLeak: true,
  reAdopt: true,
  stalled: true,
  armedGrace: true,
  inhibitor: true,
  gnomeSuspend: true,
  codeSessionClaim: true,
  remoteToolsOk: true,
  batteryFalse: true,
  kind: SAMPLE_KIND_SEEDED,
  names: BASKET_NAMES.map((row) => row.id),
  ordinary: { ...SYNTHETIC_ORDINARY },
  readopt: { ...SYNTHETIC_READOPT },
  stalledCase: { ...SYNTHETIC_STALLED },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds released: keep-awake / GNOME suspend inhibitor drops when no Code turn is active" },
  { t: "re-adopt", line: "quit mid-turn on remote SSH; relaunch re-adopts and takes a hold; turn completes; no released line" },
  { t: "stalled", line: "session dropped as stalled; remote-tools-device claims still cycle; Code-session claim keeps hold" },
  { t: "path", line: "hold-leak — GNOME inhibitor flags 4 stays; 15m idle suspend blocked; earlier 4h38m ended armed_grace" },
  { t: "score", line: "when the night basket stays lit the booth is cresset — Score cresset or admit released." },
]);

const FORCE_FLAGS = [
  "holdLeak",
  "reAdopt",
  "stalled",
  "armedGrace",
  "inhibitor",
  "gnomeSuspend",
  "codeSessionClaim",
];

const ISSUE_CUE_RE =
  /94420|keep-awake|claude-desktop|armed_grace|re-adopt|stalled|GNOME|inhibitor|battery=false|1\.52386\.6|2\.1\.270/i;

/**
 * Educational hold evaluation. Not a Claude Code patch.
 * Encodes only the published #94420 shapes.
 * released=true is the HOLD / suspend-ready path.
 *
 * Released/HOLD when: no Code turn is active and the GNOME
 * suspend inhibitor drops (ordinary idle release).
 * Cresset / hold-leak when: re-adopt or stall leaves the
 * Code-session claim hanging while remote-tools still cycle.
 */
export function evaluateHold({
  released = false,
  codeTurnActive = false,
  reAdopt = false,
  stalled = false,
  inhibitorPresent = false,
  remoteToolsCycling = false,
  releaseReason = "idle",
} = {}) {
  if (released === true && !reAdopt && !stalled && !inhibitorPresent) {
    return {
      leaked: false,
      inhibitorPresent: false,
      releaseReason: "idle",
      phrase: "admit released",
      synthetic: true,
    };
  }
  const leaked =
    (reAdopt === true || stalled === true || inhibitorPresent === true) &&
    codeTurnActive !== true;
  return {
    leaked,
    inhibitorPresent: leaked || inhibitorPresent,
    reAdopt,
    stalled,
    remoteToolsCycling,
    releaseReason: leaked ? releaseReason || "none" : "idle",
    phrase: leaked ? "score cresset" : "admit released",
    synthetic: true,
  };
}

export function scoreHoldLeak(input = {}) {
  const releasedHold = input.released === true && input.cresset !== true;
  const hold = evaluateHold({
    released: releasedHold,
    codeTurnActive: input.codeTurnActive === true,
    reAdopt: input.reAdopt === true,
    stalled: input.stalled === true,
    inhibitorPresent: input.inhibitor === true || input.holdLeak === true,
    remoteToolsCycling: input.remoteToolsOk === true,
    releaseReason: input.armedGrace === true ? ARMED_GRACE_REASON : "idle",
  });
  const cresset =
    !releasedHold &&
    (hold.leaked === true ||
      input.cresset === true ||
      input.holdLeak === true ||
      input.reAdopt === true ||
      input.stalled === true);
  return {
    released: !cresset,
    cresset,
    holdLeak: cresset,
    hold,
    phrase: cresset ? "score cresset" : "admit released",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94420") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapCresset(input = {}) {
  const cresset = isCressetInput(input);
  const released = input.released === true && !cresset;
  return {
    stamp: cresset ? "hold-leak" : "suspend-ready",
    holdingLane: cresset ? "inhibitor" : "suspend-ready",
    kindLane: cresset ? "hold-leak" : "night-wall",
    bindLane: cresset ? "code-session-claim" : "extinguished",
    ribbon: cresset ? "cresset" : "released",
    released,
  };
}

export function inspectReAdopt(input = {}) {
  const leak =
    input.reAdopt === true ||
    input.cresset === true ||
    input.holdLeak === true ||
    isCressetInput(input);
  if (input.released === true && !leak) {
    return { stamp: "ordinary-idle", leak: false, note: "ordinary turn released with idle reason" };
  }
  return {
    stamp: leak ? "re-adopt" : "readopt-idle",
    leak,
    note: leak
      ? "re-adopt — hold taken on relaunch; turn completes; no released line"
      : "",
  };
}

export function inspectStalled(input = {}) {
  const leak =
    input.stalled === true ||
    input.cresset === true ||
    input.holdLeak === true ||
    isCressetInput(input);
  if (input.released === true && !leak) {
    return { stamp: "count-honest", leak: false };
  }
  return {
    stamp: leak ? "stalled" : "stall-idle",
    leak,
    note: leak
      ? "stalled — session no longer counted; Code-session claim stays"
      : "",
  };
}

export function inspectInhibitor(input = {}) {
  const present =
    input.inhibitor === true ||
    input.cresset === true ||
    input.holdLeak === true ||
    isCressetInput(input);
  if (input.released === true && !present) {
    return { stamp: "inhibitor-dropped", present: false };
  }
  return {
    stamp: present ? "inhibitor" : "inhibitor-idle",
    present,
    note: present
      ? "inhibitor — GNOME flags 4 / app id /usr/bin/claude-desktop"
      : "",
  };
}

export function inspectRemoteTools(input = {}) {
  const cycling =
    input.remoteToolsOk === true ||
    input.cresset === true ||
    isCressetInput(input);
  if (input.released === true && !cycling) {
    return { stamp: "tools-idle", cycling: false };
  }
  return {
    stamp: cycling ? "remote-tools-ok" : "tools-idle",
    cycling,
    note: cycling
      ? "remote-tools-ok — device claims take/release inside the same hold"
      : "",
  };
}

export function inspectArmedGrace(input = {}) {
  const grace =
    input.armedGrace === true ||
    input.cresset === true ||
    isCressetInput(input);
  if (input.released === true && !grace) {
    return { stamp: "idle-reason", grace: false };
  }
  return {
    stamp: grace ? "armed-grace" : "grace-idle",
    grace,
    note: grace
      ? "armed-grace — 4h38m hold ended armed_grace, not idle"
      : "",
  };
}

function basketOpen(input, id) {
  const map = {
    "night-wall": input.cresset || input.holdLeak,
    "iron-basket": input.cresset || input.codeSessionClaim,
    "ember-snuff": input.reAdopt || input.cresset,
    "gnome-dial": input.inhibitor || input.gnomeSuspend,
    "hold-ledger": input.stalled || input.remoteToolsOk,
    "armed-grace": input.armedGrace || input.holdLeak,
  };
  return (
    map[id] === true ||
    input.holdLeak === true ||
    input.cresset === true
  );
}

function isCressetInput(input = {}) {
  return (
    input.cresset === true ||
    input.holdLeak === true ||
    input.reAdopt === true ||
    input.stalled === true ||
    input.armedGrace === true ||
    input.inhibitor === true ||
    input.gnomeSuspend === true ||
    input.codeSessionClaim === true
  );
}

export function readBooth(input = {}) {
  const cresset = isCressetInput(input);
  const released = input.released === true && !cresset;
  return {
    mark: cresset ? "cresset" : "released",
    released,
    cresset,
    holdLeak: input.holdLeak === true || cresset,
    reAdopt: input.reAdopt === true,
    stalled: input.stalled === true,
    armedGrace: input.armedGrace === true,
    inhibitor: input.inhibitor === true,
    gnomeSuspend: input.gnomeSuspend === true,
    codeSessionClaim: input.codeSessionClaim === true,
    remoteToolsOk: input.remoteToolsOk === true,
    batteryFalse: input.batteryFalse === true,
    basket: mapCresset(input),
    readopt: inspectReAdopt(input),
    stall: inspectStalled(input),
    gnome: inspectInhibitor(input),
    tools: inspectRemoteTools(input),
    grace: inspectArmedGrace(input),
    names: BASKET_NAMES.filter((row) => basketOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const CRESSET_WALK = Object.freeze([
  {
    t: "idle",
    event: "suspend-ready",
    released: true,
    cresset: false,
    cue: "released",
    note: "idle HOLD: keep-awake / GNOME suspend inhibitor drops when no Code turn is active",
  },
  {
    t: "re-adopt",
    event: "hold-leak",
    cresset: true,
    holdLeak: true,
    reAdopt: true,
    cue: "cresset",
    note: "quit mid-turn on remote SSH; relaunch re-adopts and takes a hold; turn completes; no released line",
  },
  {
    t: "stalled",
    event: "stalled",
    cresset: true,
    stalled: true,
    remoteToolsOk: true,
    cue: "cresset",
    note: "session dropped as stalled; remote-tools-device claims still cycle; Code-session claim keeps hold",
  },
  {
    t: "path",
    event: "hold-leak",
    cresset: true,
    holdLeak: true,
    reAdopt: true,
    stalled: true,
    armedGrace: true,
    inhibitor: true,
    gnomeSuspend: true,
    codeSessionClaim: true,
    remoteToolsOk: true,
    batteryFalse: true,
    cue: "cresset",
    note: "hold-leak — GNOME inhibitor flags 4 stays; 15m idle suspend blocked; earlier 4h38m ended armed_grace",
  },
  {
    t: "score",
    event: "cresset",
    cresset: true,
    holdLeak: true,
    reAdopt: true,
    stalled: true,
    armedGrace: true,
    inhibitor: true,
    gnomeSuspend: true,
    codeSessionClaim: true,
    remoteToolsOk: true,
    batteryFalse: true,
    cue: "cresset",
    note: "cresset — the night basket stays lit after work ends",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "suspend-ready",
    released: true,
    cresset: false,
    cue: "released",
    note: "positive control: ordinary idle release; inhibitor dropped",
  },
  {
    t: "admit",
    event: "suspend-ready",
    released: true,
    cue: "released",
    note: "positive control: the booth admits released",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    released: true,
    cresset: false,
    holdLeak: false,
    cue: "released",
  };
}

export function seedReleased() {
  return { ...emptyTicket() };
}

export function seedCresset() {
  return {
    seed: SEEDED_WORD,
    released: false,
    cresset: true,
    holdLeak: true,
    reAdopt: true,
    stalled: true,
    armedGrace: true,
    inhibitor: true,
    gnomeSuspend: true,
    codeSessionClaim: true,
    remoteToolsOk: true,
    batteryFalse: true,
    cue: "cresset",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_CRESSET_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    cresset: true,
    holdLeak: true,
    cue: "cresset",
  };
}

export function seedHoldLeak() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    cresset: true,
    holdLeak: true,
    event: "hold-leak",
    cue: "cresset",
  };
}

export function seedSlack() {
  return { seed: "slack", preferSeed: true, released: true, cue: "released" };
}

export function seedYielding() {
  return { seed: "yielding", preferSeed: true, released: true, cue: "released" };
}

export function seedExtinguished() {
  return { seed: "extinguished", preferSeed: true, released: true, cue: "released" };
}

export function seedIdleOk() {
  return { seed: "idle-ok", preferSeed: true, released: true, cue: "released" };
}

export function seedSuspendReady() {
  return { seed: "suspend-ready", preferSeed: true, released: true, cue: "released" };
}

export function seedReAdopt() {
  return {
    seed: "re-adopt",
    preferSeed: true,
    reAdopt: true,
    cue: "cresset",
  };
}

export function seedStalled() {
  return {
    seed: "stalled",
    preferSeed: true,
    stalled: true,
    cue: "cresset",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      released: false,
      cresset: false,
      holdLeak: false,
      reAdopt: false,
      stalled: false,
      armedGrace: false,
      inhibitor: false,
      gnomeSuspend: false,
      codeSessionClaim: false,
      remoteToolsOk: false,
      batteryFalse: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    released: raw.released === true,
    cresset: raw.cresset === true || raw.event === "cresset",
    holdLeak:
      raw.holdLeak === true || raw.event === "hold-leak",
    reAdopt:
      raw.reAdopt === true || raw.event === "re-adopt",
    stalled:
      raw.stalled === true || raw.event === "stalled",
    armedGrace:
      raw.armedGrace === true || raw.event === "armed-grace",
    inhibitor:
      raw.inhibitor === true || raw.event === "inhibitor",
    gnomeSuspend:
      raw.gnomeSuspend === true || raw.event === "gnome-suspend",
    codeSessionClaim:
      raw.codeSessionClaim === true || raw.event === "code-session-claim",
    remoteToolsOk:
      raw.remoteToolsOk === true || raw.event === "remote-tools-ok",
    batteryFalse:
      raw.batteryFalse === true || raw.event === "battery-false",
    codeTurnActive: raw.codeTurnActive,
    releaseReason: raw.releaseReason,
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
      (ticket.released != null ||
        ticket.cresset != null ||
        ticket.holdLeak != null ||
        ticket.reAdopt != null ||
        ticket.stalled != null ||
        ticket.armedGrace != null ||
        ticket.inhibitor != null ||
        ticket.gnomeSuspend != null ||
        ticket.codeSessionClaim != null ||
        ticket.remoteToolsOk != null ||
        ticket.batteryFalse != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isReleased(row) {
  if (row.cresset && row.cue !== "released") return false;
  if (row.cue === "cresset" || row.cue === "hold-leak") return false;
  if (
    row.holdLeak &&
    row.reAdopt &&
    row.cue !== "released" &&
    row.released !== true
  ) {
    return false;
  }
  if (
    row.released === true &&
    row.cresset !== true &&
    row.cue !== "cresset"
  ) {
    return true;
  }
  if (
    row.cue === "released" &&
    row.cresset !== true &&
    row.holdLeak !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isHoldLeak(row) {
  return (
    row.event === "hold-leak" &&
    !isReleased(row) &&
    (row.holdLeak === true ||
      row.reAdopt === true ||
      row.cresset === true)
  );
}

function isCressetRow(row) {
  if (isReleased(row)) return false;
  if (isHoldLeak(row) && row.cue !== "cresset") return false;
  if (row.cue === "cresset") return true;
  if (row.cresset === true) return true;
  if (row.holdLeak === true && row.reAdopt === true) return true;
  if (
    row.holdLeak === true ||
    row.reAdopt === true ||
    row.stalled === true ||
    row.armedGrace === true ||
    row.inhibitor === true ||
    row.gnomeSuspend === true ||
    row.codeSessionClaim === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cresset pass against the night basket.
 * released: keep-awake / GNOME suspend inhibitor drops when no Code turn is active.
 * cresset: re-adopt or stall leaves the Code-session claim hanging.
 * hold-leak: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHoldLeak(row) ||
    (row.holdLeak && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "hold-leak";
  } else if (isCressetRow(row)) {
    verdict = "cresset";
  } else if (isReleased(row)) {
    verdict = "released";
  } else if (
    row.holdLeak ||
    row.reAdopt ||
    row.stalled ||
    row.armedGrace ||
    row.inhibitor ||
    row.gnomeSuspend ||
    row.codeSessionClaim
  ) {
    verdict = "cresset";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "cresset";
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
    released: verdict === "released",
    cresset: verdict === "cresset" || verdict === SEEDED_WORD,
    holdLeak:
      row.holdLeak === true ||
      verdict === "hold-leak" ||
      verdict === PATH_WORD,
    reAdopt: row.reAdopt,
    stalled: row.stalled,
    armedGrace: row.armedGrace,
    inhibitor: row.inhibitor,
    gnomeSuspend: row.gnomeSuspend,
    codeSessionClaim: row.codeSessionClaim,
    remoteToolsOk: row.remoteToolsOk,
    batteryFalse: row.batteryFalse,
    cue: hold
      ? "released"
      : row.holdLeak || verdict === "hold-leak"
        ? "hold-leak"
        : "cresset",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit released" : "score cresset",
    readoptInspect: inspectReAdopt(row),
    stallInspect: inspectStalled(row),
    inhibitorInspect: inspectInhibitor(row),
    toolsInspect: inspectRemoteTools(row),
    graceInspect: inspectArmedGrace(row),
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
      : CRESSET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "cresset");
  const path = scored.filter((row) => row.verdict === "hold-leak");
  const released = scored.filter((row) => row.verdict === "released");
  const headline =
    scored.find((row) => row.event === "cresset") ||
    scored.find((row) => row.event === "hold-leak") ||
    scored.find((row) => row.event === "stalled") ||
    charged[charged.length - 1];
  let verdict = "released";
  if (charged.length) verdict = "cresset";
  else if (path.length && !released.length) {
    verdict = "hold-leak";
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
    cressetCount: charged.length,
    pathCount: path.length,
    releasedCount: released.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit released" : "score cresset",
    note: headline
      ? "Desktop (Linux): Keep computer awake while Claude works hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours. GNOME inhibitor app id /usr/bin/claude-desktop flags 4=suspend. Remote-tools-device claims still cycle. Cite-only cousins #94415 #94392 #93924."
      : "published cresset walk scored against released vs cresset",
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
    seeded !== "released" &&
    seeded !== "cresset" &&
    seeded !== "hold-leak" &&
    ticket.released == null &&
    ticket.cresset == null &&
    ticket.holdLeak == null &&
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
    released: scored.released ?? false,
    cresset: scored.cresset ?? false,
    holdLeak: scored.holdLeak ?? false,
    reAdopt: scored.reAdopt ?? false,
    stalled: scored.stalled ?? false,
    armedGrace: scored.armedGrace ?? false,
    inhibitor: scored.inhibitor ?? false,
    gnomeSuspend: scored.gnomeSuspend ?? false,
    codeSessionClaim: scored.codeSessionClaim ?? false,
    remoteToolsOk: scored.remoteToolsOk ?? false,
    batteryFalse: scored.batteryFalse ?? false,
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
    result.holdLeak || result.cresset
      ? "kind=hold-leak"
      : "kind=night-wall",
    result.reAdopt || result.cresset
      ? "ref=re-adopt"
      : "ref=suspend-ready",
    result.holdLeak || result.verdict === "hold-leak"
      ? "path=hold-leak"
      : "path=released",
    result.cue === "released"
      ? "cue=released"
      : result.cue === "hold-leak"
        ? "cue=hold-leak"
        : "cue=cresset",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    released: result.released,
    cresset: result.cresset,
    holdLeak: result.holdLeak,
    reAdopt: result.reAdopt,
    stalled: result.stalled,
    armedGrace: result.armedGrace,
    inhibitor: result.inhibitor,
    gnomeSuspend: result.gnomeSuspend,
    codeSessionClaim: result.codeSessionClaim,
    remoteToolsOk: result.remoteToolsOk,
    batteryFalse: result.batteryFalse,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    readopt: inspectReAdopt({
      released: result.released,
      cresset: result.cresset,
      reAdopt: result.reAdopt,
    }),
    stall: inspectStalled({
      released: result.released,
      cresset: result.cresset,
      stalled: result.stalled,
    }),
    gnome: inspectInhibitor({
      released: result.released,
      cresset: result.cresset,
      inhibitor: result.inhibitor,
    }),
    tools: inspectRemoteTools({
      released: result.released,
      cresset: result.cresset,
      remoteToolsOk: result.remoteToolsOk,
    }),
    grace: inspectArmedGrace({
      released: result.released,
      cresset: result.cresset,
      armedGrace: result.armedGrace,
    }),
    basket: mapCresset({
      released: result.released,
      cresset: result.cresset,
      holdLeak: result.holdLeak,
      reAdopt: result.reAdopt,
      stalled: result.stalled,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      cresset: result.cresset === true || result.verdict === "cresset",
    })),
    leakPath: scoreHoldLeak({
      released: result.released === true && !result.cresset,
      cresset: result.cresset,
      holdLeak: result.holdLeak,
      reAdopt: result.reAdopt,
      stalled: result.stalled,
      inhibitor: result.inhibitor,
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
      names: BASKET_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): re-adopt and stall paths take a Code-session keep-awake claim but miss the idle-release / stop path that ordinary turns use; remote-tools-device claims continue cycling inside the same hold. Invite verify against #94420 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
