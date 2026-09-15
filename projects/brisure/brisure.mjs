#!/usr/bin/env node
/**
 * Brisure — herald's college / armorial roll / cadency desk /
 * lacquered shield rack / parchment roll-call booth.
 * A *brisure* is a heraldic mark of cadency (difference) for a
 * cadet / younger branch of a coat of arms. The parent session is
 * on the main roll (Remote Control mobile list). The fork is a
 * cadet branch that never receives its brisure enrollment into
 * the bridge roll — silently omitted while every other signal
 * looks fine (recent activity, pinned, host online).
 * Gules / argent parchment / sable ink / or / azure.
 * NOT Diptych wax-tablet. NOT Vizard masque-ball. NOT Treacle
 * kettle. NOT Somnus sleep clinic. NOT Cresset fire-basket.
 * NOT Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Forksink storm-drain.
 * NOT Diplopia subdirectory rooms.
 *
 * Educational diagnostic model for a published Claude Remote
 * Control defect: a session created by forking an existing
 * session is never registered with the Remote Control bridge,
 * so it never appears in the mobile Code tab — no error, no UI
 * hint; simply absent. remoteControlAutoEligible is only
 * assigned on a session's first turn (finishInitialEnqueue with
 * first_turn). A fork adopts an existing transcript so it takes
 * the cold_resume path and the flag is never set for the whole
 * life of the session. Policy remoteControlPolicyCovers requires
 * remoteControlAutoEligible and no scheduledTaskId. Nothing
 * references forkedFromSessionId, so fork exclusion looks
 * incidental. Neighbouring resume-like paths DO re-arm: /clear
 * uses ??= true; prewarm claim sets true then first_turn.
 *
 * Encoded from anthropics/claude-code#94396 issue text only.
 * Hypothesis (NON-BINDING — issue text): a fork takes
 * cold_resume so remoteControlAutoEligible is never armed, and
 * the policy therefore never offers the cadet to the bridge.
 * Invite verify against #94396 text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT
 * implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node brisure.mjs data/brisure.json
 *   echo '{"seed":"brisure"}' | node brisure.mjs
 *
 * Idle word is enrolled (HOLD: parent on the main roll).
 * HOLD aliases: lineal, registered, parent, rollcall.
 * Seeded word is brisure (#94396 path).
 * Path word is fork-resume.
 * Product score word is brisure (Score brisure or admit enrolled.).
 *
 * NOT Cancellans/#94400 (resume-fork dropping tools-array /
 * deferred_tools_delta). Same family of "fork" words but
 * DIFFERENT defect. NOT Forksink. NOT Diptych/#94397.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "enrolled",
  "brisure",
  "fork-resume",
  "lineal",
  "registered",
  "parent",
  "rollcall",
  "cadet",
  "omitted",
  "cold-resume",
  "first-turn",
  "auto-eligible",
  "user-requested",
  "scheduled",
  "bridge-absent",
  "mobile-absent",
  "94396",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "enrolled";
export const PATH_WORD = "fork-resume";
export const SEEDED_WORD = "brisure";
export const PRODUCT_WORD = "brisure";
export const HOLD = Object.freeze(["enrolled"]);
export const HOLD_ALIASES = Object.freeze([
  "lineal",
  "registered",
  "parent",
  "rollcall",
]);
export const RECOVER = Object.freeze(["enrolled"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "single",
  "pledged",
  "brisk",
  "cadence",
  "released",
  "verbatim",
  "quiet",
  "intact",
  "cleared",
  "once",
  "solo",
  "folio",
  "simplex",
  "held",
  "chosen",
  "masked-true",
  "snap",
  "ready",
  "instant",
  "bash-fast",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "armed",
  "bound",
  "listed",
  "scheduled-ok",
  "muster-ok",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "forksink",
  "diplopia",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "forksink",
  "diplopia",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "escutcheon",
  "fetchling",
  "eidolon",
  "hectograph",
  "stereotype",
]);

export const FEATURED_ISSUE = 94396;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94396";
export const TITLE =
  "[BUG] Forked sessions never become Remote Control eligible, so they never appear in the mobile Code tab";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const PLATFORM = "macos";
export const SURFACE = "fork-resume";
export const HOST =
  "Claude desktop app 1.52386.6 on macOS 26.6.2 (Darwin 25.6, Apple Silicon), Claude Code CLI 2.1.266; Claude mobile app, same account, Code tab";
export const CHECKED_ON =
  "Published report: a forked session is never registered with the Remote Control bridge and never appears in the mobile Code tab; no error, no UI hint; simply absent";
export const BUILD =
  "Claude desktop 1.52386.6; Claude Code CLI 2.1.266; Claude mobile Code tab";
export const SELECTED_MODEL =
  "Forked session never becomes Remote Control eligible — not a model defect";
export const OS =
  "macOS 26.6.2 Apple Silicon host + Claude mobile Code tab; platform:macos / area:core";
export const PHRASE = "Score brisure or admit enrolled.";
export const DISTRIBUTION =
  "A session created by forking an existing session is never registered with the Remote Control bridge, so it never appears in the Code tab of the mobile app — no matter how recently it ran, whether it is pinned, or whether its host machine is online. There is no error and no UI hint anywhere; the session is simply absent from the list. Every visible signal points the other way: a session that had run seconds earlier, on an online laptop, pinned, with filters cleared, was missing, while a session whose device was offline was listed. Why (per issue): remoteControlAutoEligible is only ever assigned on a session's first turn (finishInitialEnqueue with first_turn); a fork adopts an existing transcript so it takes the resume path (cold_resume) and the flag is never set for the whole life of the session. remoteControlPolicyCovers requires remoteControlAutoEligible and no scheduledTaskId. Nothing references forkedFromSessionId, so the exclusion of forks looks incidental. Neighbouring resume-like paths DO re-arm: /clear uses ??= true; prewarm claim sets true then first_turn. Data across 25 sessions since 2026-09-01: ordinary 18 eligible+visible; scheduled task 2 eligible but no bridge (expected); forked 5 absent eligible + absent bridge + never visible. Expected: a fork is an ordinary local session and should be offered to the Remote Control bridge on the same terms. Workaround: enabling Remote Control manually works (remoteControlUserRequested) but needs an active query first. Env: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile Code tab.";

export const DESKTOP_BUILD = "1.52386.6";
export const CODE_BUILD = "2.1.266";
export const HOST_OS = "macOS 26.6.2 Apple Silicon";
export const MOBILE_SURFACE = "Claude mobile Code tab";
export const ORDINARY_COUNT = 18;
export const SCHEDULED_COUNT = 2;
export const FORKED_COUNT = 5;
export const SESSION_TOTAL = 25;

/**
 * Synthetic example-data — reconstructs published session-census shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_ENROLLED = Object.freeze({
  kind: "ordinary",
  remoteControlAutoEligible: true,
  bridgeSessionIds: true,
  visibleOnMobile: true,
  note: "parent on the main roll — enrolled",
  synthetic: true,
});
export const SYNTHETIC_SCHEDULED = Object.freeze({
  kind: "scheduled",
  remoteControlAutoEligible: true,
  scheduledTaskId: true,
  bridgeSessionIds: false,
  visibleOnMobile: false,
  note: "eligible but no bridge — expected, !scheduledTaskId",
  synthetic: true,
});
export const SYNTHETIC_FORK = Object.freeze({
  kind: "forked",
  forkedFromSessionId: true,
  remoteControlAutoEligible: false,
  bridgeSessionIds: false,
  visibleOnMobile: false,
  path: "cold_resume",
  note: "cadet never receives its brisure — absent eligible, absent bridge, never visible",
  synthetic: true,
});
export const SESSION_CENSUS = Object.freeze({
  ordinary: ORDINARY_COUNT,
  scheduled: SCHEDULED_COUNT,
  forked: FORKED_COUNT,
  total: SESSION_TOTAL,
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "parent-shield",
    lost: "Parent shield — lineal session on the main armorial roll",
    control: "The parent stays enrolled and visible on the mobile Code tab",
    story: "the college hangs the parent's escutcheon on the lacquered rack",
  },
  {
    id: "cadet-vacancy",
    lost: "Cadet vacancy — fork never receives its brisure mark of cadency",
    control: "A fork would be offered to the bridge on the same terms",
    story: "the younger branch is silently omitted from the roll-call",
  },
  {
    id: "first-turn-path",
    lost: "First-turn path — remoteControlAutoEligible is only assigned on first_turn",
    control: "first_turn would arm eligibility for any new local session",
    story: "the herald stamps eligible only when the roll is opened cold",
  },
  {
    id: "cold-resume-path",
    lost: "Cold-resume path — a fork adopts a transcript and never arms the flag",
    control: "cold_resume would re-arm the way /clear and prewarm already do",
    story: "the cadet walks the resume aisle and leaves without a brisure",
  },
  {
    id: "bridge-gap",
    lost: "Bridge gap — policy requires autoEligible and no scheduledTaskId",
    control: "Nothing references forkedFromSessionId, so exclusion looks incidental",
    story: "the policy gate never names the cadet, so the bridge never sees it",
  },
  {
    id: "mobile-roll",
    lost: "Mobile roll — parent present, fork absent; no error, no UI hint",
    control: "The Code tab would list the fork after recent activity",
    story: "the parchment roll-call leaves a missing entry while an offline host is listed",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "parent-shield",
    survey: "ordinary enrolled: parent on the main roll; first_turn armed eligible",
    kind: "enrolled",
    note: "idle/control: lineal session visible on mobile",
  },
  {
    id: "cadet-vacancy",
    survey: "fork created from an existing session; forkedFromSessionId set",
    kind: "brisure",
    note: "seeded: cadet branch never receives its brisure",
  },
  {
    id: "first-turn-path",
    survey: "finishInitialEnqueue assigns remoteControlAutoEligible only on first_turn",
    kind: "brisure",
    note: "seeded: neighbouring /clear and prewarm DO re-arm",
  },
  {
    id: "cold-resume-path",
    survey: "fork adopts a transcript so it takes cold_resume; flag never set",
    kind: "brisure",
    note: "seeded: the flag is never set for the whole life of the session",
  },
  {
    id: "bridge-gap",
    survey: "remoteControlPolicyCovers requires autoEligible and no scheduledTaskId",
    kind: "brisure",
    note: "seeded: nothing references forkedFromSessionId",
  },
  {
    id: "mobile-roll",
    survey: "fork-resume — parent listed, fork absent; no error, no UI hint",
    kind: "brisure",
    note: "path: fork-resume names the cold_resume aisle that never arms eligibility",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "cadet",
    label: "cadet",
    count: "younger branch",
    note: "Fork is a cadet of the parent session",
  },
  {
    id: "omitted",
    label: "omitted",
    count: "silent",
    note: "No error and no UI hint; simply absent from the list",
  },
  {
    id: "cold-resume",
    label: "cold-resume",
    count: "path",
    note: "Fork adopts an existing transcript and takes cold_resume",
  },
  {
    id: "first-turn",
    label: "first-turn",
    count: "arming",
    note: "remoteControlAutoEligible is only assigned on first_turn",
  },
  {
    id: "bridge-absent",
    label: "bridge-absent",
    count: "5 forks",
    note: "Forked sessions: absent eligible + absent bridge + never visible",
  },
  {
    id: "mobile-absent",
    label: "mobile-absent",
    count: "Code tab",
    note: "Parent present on the mobile roll; fork never is",
  },
]);

export const RULED_OUT = Object.freeze([
  "Cancellans/#94400 — resume-fork drops a server-gated tool from the parent's initial tools array; deferred_tools_delta / prompt-cache miss — DIFFERENT defect; same family of fork words only",
  "Forksink/#93458 — municipal storm-drain / source-fork — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo double render — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — ghost orphan ScheduledTasks — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
  "Diplopia — subdirectory rooms — DIFFERENT product",
  "Escutcheon — empty plate / keyhole — DIFFERENT catalog paradigm; do not remask",
  "Damper — remote-control-auto-on chimney — DIFFERENT",
  "Matricula/#93987 — /reload-skills enrollment desk — DIFFERENT (idle enrolled reused here by brief only)",
]);

export const EXPECTED = Object.freeze([
  "A fork is an ordinary local session, on the same machine, under the same account",
  "It should be offered to the Remote Control bridge on the same terms as any other session",
  "A cadet branch should receive its brisure enrollment into the mobile Code tab",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Re-arm eligibility on the fork path exactly as /clear and prewarm-claim already do (remoteControlAutoEligible ??= true), rather than binding it to isFirstTurn only",
  "Failing that, mark such sessions in the desktop UI as not remotely reachable, instead of silently omitting them from the mobile list",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "fork-resume",
  "brisure",
  "cadet",
  "omitted",
  "cold-resume",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94400,
    title: "Resumed session drops a tool from the parent's initial tools array (EndConversation)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Cancellans/#94400 is resume-fork tools-array / deferred_tools_delta. Same family of fork words, DIFFERENT defect. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94397,
    title: "Remote Control (mobile): every assistant reply is rendered twice",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Diptych/#94397 brief-echo. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93458,
    title: "Forksink source-fork",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Forksink municipal storm-drain / source-fork. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "forksink",
  "diplopia",
  "escutcheon",
  "matricula",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "fetchling",
  "eidolon",
  "hectograph",
  "stereotype",
  "damper",
]);

export const SAMPLE_KIND_IDLE = "parent-shield";
export const SAMPLE_KIND_SEEDED = "fork-resume";
export const SAMPLE_HOLDING_IDLE = "rollcall";
export const SAMPLE_HOLDING_SEEDED = "cadet-vacancy";

export const SAMPLE_ENROLLED_PROOF = Object.freeze({
  enrolled: true,
  brisure: false,
  forkResume: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_BRISURE_PROOF = Object.freeze({
  enrolled: false,
  brisure: true,
  forkResume: true,
  cadetOmitted: true,
  autoEligibleAbsent: true,
  bridgeAbsent: true,
  mobileAbsent: true,
  coldResume: true,
  forkedFrom: true,
  silentOmit: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  parent: { ...SYNTHETIC_ENROLLED },
  fork: { ...SYNTHETIC_FORK },
  census: { ...SESSION_CENSUS },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds enrolled: parent on the main roll; first_turn armed eligible" },
  { t: "fork-resume", line: "fork adopts a transcript; cold_resume never arms remoteControlAutoEligible" },
  { t: "path", line: "fork-resume — cadet omitted from the bridge roll; parent present, fork absent" },
  { t: "score", line: "when the cadet never receives its brisure the booth is brisure — Score brisure or admit enrolled." },
]);

const FORCE_FLAGS = [
  "forkResume",
  "cadetOmitted",
  "autoEligibleAbsent",
  "bridgeAbsent",
  "mobileAbsent",
  "coldResume",
  "forkedFrom",
  "silentOmit",
];

const ISSUE_CUE_RE =
  /94396|remoteControlAutoEligible|cold_resume|forkedFromSessionId|Remote Control|first_turn|bridgeSessionIds/i;

/**
 * Educational eligibility arming. Not a Claude Code patch.
 * Encodes only the published #94396 shapes.
 *
 * first_turn: arms remoteControlAutoEligible.
 * cold_resume: never arms (fork path).
 * clear / prewarm: neighbouring paths that DO re-arm.
 */
export function armEligibility({
  path = "first_turn",
  already = false,
} = {}) {
  if (path === "first_turn" || path === "prewarm") {
    return { autoEligible: true, path, phrase: "admit enrolled" };
  }
  if (path === "clear") {
    return { autoEligible: already || true, path, phrase: "admit enrolled" };
  }
  return { autoEligible: false, path: "cold_resume", phrase: "score brisure" };
}

export function policyCovers({
  autoEligible = false,
  scheduledTaskId = false,
  userRequested = false,
} = {}) {
  if (userRequested === true) return true;
  return autoEligible === true && scheduledTaskId !== true;
}

/**
 * Educational cadet enrollment. Not a Claude Code patch.
 * enrolled=true is the HOLD / parent-on-the-roll path.
 */
export function enrollCadet({
  enrolled = false,
  forked = false,
  firstTurn = false,
} = {}) {
  if (enrolled === true && !forked) {
    return {
      enrolled: true,
      visible: true,
      autoEligible: true,
      phrase: "admit enrolled",
      synthetic: true,
    };
  }
  const omitted = forked === true && firstTurn !== true;
  return {
    enrolled: false,
    visible: !omitted,
    autoEligible: firstTurn === true,
    phrase: omitted ? "score brisure" : "admit enrolled",
    synthetic: true,
  };
}

export function scoreForkResume(input = {}) {
  const enrolledHold = input.enrolled === true && input.brisure !== true;
  const cadet = enrollCadet({
    enrolled: enrolledHold,
    forked:
      input.forkedFrom === true ||
      input.forkResume === true ||
      input.brisure === true,
    firstTurn: enrolledHold,
  });
  const brisure =
    !enrolledHold &&
    (cadet.enrolled === false ||
      input.brisure === true ||
      input.forkResume === true ||
      input.coldResume === true ||
      input.cadetOmitted === true);
  return {
    enrolled: !brisure,
    brisure,
    forkResume: brisure,
    cadet,
    phrase: brisure ? "score brisure" : "admit enrolled",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94396") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapBrisure(input = {}) {
  const brisure = isBrisureInput(input);
  const enrolled = input.enrolled === true && !brisure;
  return {
    stamp: brisure ? "fork-resume" : "rollcall",
    holdingLane: brisure ? "cadet-vacancy" : "rollcall",
    kindLane: brisure ? "fork-resume" : "parent-shield",
    bindLane: brisure ? "bridge-gap" : "parent",
    ribbon: brisure ? "brisure" : "enrolled",
    enrolled,
  };
}

export function inspectCadet(input = {}) {
  const omitted =
    input.cadetOmitted === true ||
    input.brisure === true ||
    input.forkResume === true ||
    isBrisureInput(input);
  if (input.enrolled === true && !omitted) {
    return { stamp: "lineal", omitted: false, note: "parent shield on the rack" };
  }
  return {
    stamp: omitted ? "cadet" : "cadet-idle",
    omitted,
    note: omitted
      ? "cadet — younger branch never receives its brisure"
      : "",
  };
}

export function inspectOmitted(input = {}) {
  const silent =
    input.silentOmit === true ||
    input.brisure === true ||
    isBrisureInput(input);
  if (input.enrolled === true && !silent) {
    return { stamp: "named", silent: false };
  }
  return {
    stamp: silent ? "omitted" : "omit-idle",
    silent,
    note: silent
      ? "omitted — no error and no UI hint; simply absent from the list"
      : "",
  };
}

export function inspectColdResume(input = {}) {
  const cold =
    input.coldResume === true ||
    input.brisure === true ||
    input.forkResume === true ||
    isBrisureInput(input);
  if (input.enrolled === true && !cold) {
    return { stamp: "first-turn", cold: false };
  }
  return {
    stamp: cold ? "cold-resume" : "resume-idle",
    cold,
    note: cold
      ? "cold-resume — fork adopts a transcript; flag never set"
      : "",
  };
}

export function inspectBridge(input = {}) {
  const absent =
    input.bridgeAbsent === true ||
    input.brisure === true ||
    isBrisureInput(input);
  if (input.enrolled === true && !absent) {
    return { stamp: "bridge-present", absent: false };
  }
  return {
    stamp: absent ? "bridge-absent" : "bridge-idle",
    absent,
    note: absent
      ? "bridge-absent — forked sessions: absent eligible + absent bridge"
      : "",
  };
}

export function inspectMobile(input = {}) {
  const missing =
    input.mobileAbsent === true ||
    input.brisure === true ||
    isBrisureInput(input);
  if (input.enrolled === true && !missing) {
    return { stamp: "roll-present", missing: false };
  }
  return {
    stamp: missing ? "mobile-absent" : "roll-idle",
    missing,
    note: missing
      ? "mobile-absent — parent present on the Code tab; fork never is"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "parent-shield": input.brisure || input.forkResume,
    "cadet-vacancy": input.cadetOmitted || input.brisure,
    "first-turn-path": input.brisure || input.autoEligibleAbsent,
    "cold-resume-path": input.coldResume || input.forkResume || input.brisure,
    "bridge-gap": input.bridgeAbsent || input.brisure,
    "mobile-roll": input.mobileAbsent || input.forkResume,
  };
  return (
    map[id] === true ||
    input.forkResume === true ||
    input.brisure === true
  );
}

function isBrisureInput(input = {}) {
  return (
    input.brisure === true ||
    input.forkResume === true ||
    input.cadetOmitted === true ||
    input.autoEligibleAbsent === true ||
    input.bridgeAbsent === true ||
    input.mobileAbsent === true ||
    input.coldResume === true ||
    input.forkedFrom === true ||
    input.silentOmit === true
  );
}

export function readBooth(input = {}) {
  const brisure = isBrisureInput(input);
  const enrolled = input.enrolled === true && !brisure;
  return {
    mark: brisure ? "brisure" : "enrolled",
    enrolled,
    brisure,
    forkResume: input.forkResume === true || brisure,
    cadetOmitted: input.cadetOmitted === true,
    autoEligibleAbsent: input.autoEligibleAbsent === true,
    bridgeAbsent: input.bridgeAbsent === true,
    mobileAbsent: input.mobileAbsent === true,
    coldResume: input.coldResume === true,
    forkedFrom: input.forkedFrom === true,
    silentOmit: input.silentOmit === true,
    college: mapBrisure(input),
    cadet: inspectCadet(input),
    omitted: inspectOmitted(input),
    cold: inspectColdResume(input),
    bridge: inspectBridge(input),
    mobile: inspectMobile(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const BRISURE_WALK = Object.freeze([
  {
    t: "idle",
    event: "rollcall",
    enrolled: true,
    brisure: false,
    cue: "enrolled",
    note: "idle HOLD: parent on the main roll; first_turn armed eligible",
  },
  {
    t: "fork-resume",
    event: "fork-resume",
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
    coldResume: true,
    forkedFrom: true,
    cue: "brisure",
    note: "fork adopts a transcript; cold_resume never arms remoteControlAutoEligible",
  },
  {
    t: "path",
    event: "fork-resume",
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
    autoEligibleAbsent: true,
    bridgeAbsent: true,
    mobileAbsent: true,
    coldResume: true,
    forkedFrom: true,
    silentOmit: true,
    cue: "brisure",
    note: "fork-resume — cadet omitted from the bridge roll; parent present, fork absent",
  },
  {
    t: "score",
    event: "brisure",
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
    autoEligibleAbsent: true,
    bridgeAbsent: true,
    mobileAbsent: true,
    coldResume: true,
    forkedFrom: true,
    silentOmit: true,
    cue: "brisure",
    note: "brisure — the cadet never receives its mark of cadency on the mobile roll",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "rollcall",
    enrolled: true,
    brisure: false,
    cue: "enrolled",
    note: "positive control: parent on the main roll; first_turn armed eligible",
  },
  {
    t: "admit",
    event: "rollcall",
    enrolled: true,
    cue: "enrolled",
    note: "positive control: the college admits enrolled",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    enrolled: true,
    brisure: false,
    forkResume: false,
    cue: "enrolled",
  };
}

export function seedEnrolled() {
  return { ...emptyTicket() };
}

export function seedBrisure() {
  return {
    seed: SEEDED_WORD,
    enrolled: false,
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
    autoEligibleAbsent: true,
    bridgeAbsent: true,
    mobileAbsent: true,
    coldResume: true,
    forkedFrom: true,
    silentOmit: true,
    cue: "brisure",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_BRISURE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    brisure: true,
    forkResume: true,
    cue: "brisure",
  };
}

export function seedForkResume() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    brisure: true,
    forkResume: true,
    event: "fork-resume",
    cue: "brisure",
  };
}

export function seedLineal() {
  return { seed: "lineal", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedRegistered() {
  return { seed: "registered", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedParent() {
  return { seed: "parent", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedRollcall() {
  return { seed: "rollcall", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedCadet() {
  return {
    seed: "cadet",
    preferSeed: true,
    cadetOmitted: true,
    cue: "brisure",
  };
}

export function seedOmitted() {
  return {
    seed: "omitted",
    preferSeed: true,
    silentOmit: true,
    cue: "brisure",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      enrolled: false,
      brisure: false,
      forkResume: false,
      cadetOmitted: false,
      autoEligibleAbsent: false,
      bridgeAbsent: false,
      mobileAbsent: false,
      coldResume: false,
      forkedFrom: false,
      silentOmit: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    enrolled: raw.enrolled === true,
    brisure: raw.brisure === true || raw.event === "brisure",
    forkResume:
      raw.forkResume === true || raw.event === "fork-resume",
    cadetOmitted:
      raw.cadetOmitted === true || raw.event === "cadet",
    autoEligibleAbsent:
      raw.autoEligibleAbsent === true || raw.event === "auto-eligible",
    bridgeAbsent:
      raw.bridgeAbsent === true || raw.event === "bridge-absent",
    mobileAbsent:
      raw.mobileAbsent === true || raw.event === "mobile-absent",
    coldResume:
      raw.coldResume === true || raw.event === "cold-resume",
    forkedFrom:
      raw.forkedFrom === true || raw.event === "cadet",
    silentOmit:
      raw.silentOmit === true || raw.event === "omitted",
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
      (ticket.enrolled != null ||
        ticket.brisure != null ||
        ticket.forkResume != null ||
        ticket.cadetOmitted != null ||
        ticket.autoEligibleAbsent != null ||
        ticket.bridgeAbsent != null ||
        ticket.mobileAbsent != null ||
        ticket.coldResume != null ||
        ticket.forkedFrom != null ||
        ticket.silentOmit != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isEnrolled(row) {
  if (row.brisure && row.cue !== "enrolled") return false;
  if (row.cue === "brisure" || row.cue === "fork-resume") return false;
  if (
    row.forkResume &&
    row.cadetOmitted &&
    row.cue !== "enrolled" &&
    row.enrolled !== true
  ) {
    return false;
  }
  if (
    row.enrolled === true &&
    row.brisure !== true &&
    row.cue !== "brisure"
  ) {
    return true;
  }
  if (
    row.cue === "enrolled" &&
    row.brisure !== true &&
    row.forkResume !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isForkResume(row) {
  return (
    row.event === "fork-resume" &&
    !isEnrolled(row) &&
    (row.forkResume === true ||
      row.coldResume === true ||
      row.brisure === true)
  );
}

function isBrisureRow(row) {
  if (isEnrolled(row)) return false;
  if (isForkResume(row) && row.cue !== "brisure") return false;
  if (row.cue === "brisure") return true;
  if (row.brisure === true) return true;
  if (row.forkResume === true && row.cadetOmitted === true) return true;
  if (
    row.forkResume === true ||
    row.cadetOmitted === true ||
    row.autoEligibleAbsent === true ||
    row.bridgeAbsent === true ||
    row.mobileAbsent === true ||
    row.coldResume === true ||
    row.forkedFrom === true ||
    row.silentOmit === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one brisure pass against the herald's college.
 * enrolled: parent on the main roll; first_turn armed eligible.
 * brisure: cadet never receives its mark of cadency.
 * fork-resume: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isForkResume(row) ||
    (row.forkResume && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "fork-resume";
  } else if (isBrisureRow(row)) {
    verdict = "brisure";
  } else if (isEnrolled(row)) {
    verdict = "enrolled";
  } else if (
    row.forkResume ||
    row.cadetOmitted ||
    row.autoEligibleAbsent ||
    row.bridgeAbsent ||
    row.mobileAbsent ||
    row.coldResume ||
    row.forkedFrom ||
    row.silentOmit
  ) {
    verdict = "brisure";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "brisure";
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
    enrolled: verdict === "enrolled",
    brisure: verdict === "brisure" || verdict === SEEDED_WORD,
    forkResume:
      row.forkResume === true ||
      verdict === "fork-resume" ||
      verdict === PATH_WORD,
    cadetOmitted: row.cadetOmitted,
    autoEligibleAbsent: row.autoEligibleAbsent,
    bridgeAbsent: row.bridgeAbsent,
    mobileAbsent: row.mobileAbsent,
    coldResume: row.coldResume,
    forkedFrom: row.forkedFrom,
    silentOmit: row.silentOmit,
    cue: hold
      ? "enrolled"
      : row.forkResume || verdict === "fork-resume"
        ? "fork-resume"
        : "brisure",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit enrolled" : "score brisure",
    cadetInspect: inspectCadet(row),
    omittedInspect: inspectOmitted(row),
    coldInspect: inspectColdResume(row),
    bridgeInspect: inspectBridge(row),
    mobileInspect: inspectMobile(row),
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
      : BRISURE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "brisure");
  const path = scored.filter((row) => row.verdict === "fork-resume");
  const enrolled = scored.filter((row) => row.verdict === "enrolled");
  const headline =
    scored.find((row) => row.event === "brisure") ||
    scored.find((row) => row.event === "fork-resume") ||
    scored.find((row) => row.event === "cadet") ||
    charged[charged.length - 1];
  let verdict = "enrolled";
  if (charged.length) verdict = "brisure";
  else if (path.length && !enrolled.length) {
    verdict = "fork-resume";
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
    brisureCount: charged.length,
    pathCount: path.length,
    enrolledCount: enrolled.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit enrolled" : "score brisure",
    note: headline
      ? "Forked sessions never become Remote Control eligible, so they never appear in the mobile Code tab. Desktop 1.52386.6; CLI 2.1.266; macOS 26.6.2. Cite-only cousins #94400 #94397 #93458."
      : "published brisure walk scored against enrolled vs brisure",
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
    seeded !== "enrolled" &&
    seeded !== "brisure" &&
    seeded !== "fork-resume" &&
    ticket.enrolled == null &&
    ticket.brisure == null &&
    ticket.forkResume == null &&
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
    enrolled: scored.enrolled ?? false,
    brisure: scored.brisure ?? false,
    forkResume: scored.forkResume ?? false,
    cadetOmitted: scored.cadetOmitted ?? false,
    autoEligibleAbsent: scored.autoEligibleAbsent ?? false,
    bridgeAbsent: scored.bridgeAbsent ?? false,
    mobileAbsent: scored.mobileAbsent ?? false,
    coldResume: scored.coldResume ?? false,
    forkedFrom: scored.forkedFrom ?? false,
    silentOmit: scored.silentOmit ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
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
    result.forkResume || result.brisure
      ? "kind=fork-resume"
      : "kind=parent-shield",
    result.cadetOmitted || result.brisure
      ? "ref=cadet"
      : "ref=rollcall",
    result.forkResume || result.verdict === "fork-resume"
      ? "path=fork-resume"
      : "path=enrolled",
    result.cue === "enrolled"
      ? "cue=enrolled"
      : result.cue === "fork-resume"
        ? "cue=fork-resume"
        : "cue=brisure",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    enrolled: result.enrolled,
    brisure: result.brisure,
    forkResume: result.forkResume,
    cadetOmitted: result.cadetOmitted,
    autoEligibleAbsent: result.autoEligibleAbsent,
    bridgeAbsent: result.bridgeAbsent,
    mobileAbsent: result.mobileAbsent,
    coldResume: result.coldResume,
    forkedFrom: result.forkedFrom,
    silentOmit: result.silentOmit,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cadet: inspectCadet({
      enrolled: result.enrolled,
      brisure: result.brisure,
      cadetOmitted: result.cadetOmitted,
    }),
    omitted: inspectOmitted({
      enrolled: result.enrolled,
      brisure: result.brisure,
      silentOmit: result.silentOmit,
    }),
    cold: inspectColdResume({
      enrolled: result.enrolled,
      brisure: result.brisure,
      coldResume: result.coldResume,
    }),
    bridge: inspectBridge({
      enrolled: result.enrolled,
      brisure: result.brisure,
      bridgeAbsent: result.bridgeAbsent,
    }),
    mobile: inspectMobile({
      enrolled: result.enrolled,
      brisure: result.brisure,
      mobileAbsent: result.mobileAbsent,
    }),
    college: mapBrisure({
      enrolled: result.enrolled,
      brisure: result.brisure,
      forkResume: result.forkResume,
      cadetOmitted: result.cadetOmitted,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      brisure: result.brisure === true || result.verdict === "brisure",
    })),
    leakPath: scoreForkResume({
      enrolled: result.enrolled === true && !result.brisure,
      brisure: result.brisure,
      forkResume: result.forkResume,
      cadetOmitted: result.cadetOmitted,
      coldResume: result.coldResume,
      forkedFrom: result.forkedFrom,
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
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): a fork takes cold_resume so remoteControlAutoEligible is never armed, and the policy therefore never offers the cadet to the bridge. Invite verify against #94396 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
