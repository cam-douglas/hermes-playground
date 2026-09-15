#!/usr/bin/env node
/**
 * Somnus — night nursery / moon-watch / sleep-clinic booth.
 * A somnus is Roman sleep / the god of sleep.
 * Metaphor: a Cowork cloud schedule should keep its cadence when
 * the bound Mac sleeps through one fire. Instead one lid-closed
 * miss permanently snuffs the trigger with device_absent and never
 * wakes it. Night nursery / moon-watch desk / absent-device ledger.
 * Indigo / linen / moon-silver / violet / teal.
 * NOT Cresset keep-awake GNOME inhibitor. NOT Dictabelt voice.
 * NOT Lemure ghost scheduled tasks. NOT Cancellans binder.
 * NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka.
 *
 * Educational diagnostic model for a published Claude Desktop
 * Cowork cloud-schedule failure: a cloud trigger created with
 * requires_local_device: true is set enabled=false with
 * suspension_reason=device_absent the first time it fires while
 * the bound Mac is asleep. Suspension happens at dispatch before
 * any session starts, so the task's own "is the device reachable?"
 * guard never runs. It does not resume when the device reconnects,
 * and no notification is sent. next_run_at freezes. The task
 * silently stops firing after a single missed occurrence.
 * Manual update_trigger(enabled: true) works until the next miss.
 * Local Desktop scheduled tasks skip a sleep miss and catch up
 * on wake. Cloud+device-bound is worse (permanent silent disable).
 *
 * Encoded from anthropics/claude-code#94415 issue text only.
 * Hypothesis (NON-BINDING — issue text): dispatch-time
 * device_absent path disables the trigger instead of skipping
 * the occurrence; no reconnect re-enable and no suspension
 * notification. Invite verify against #94415 text only. Do NOT
 * claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node somnus.mjs data/somnus.json
 *   echo '{"seed":"somnus"}' | node somnus.mjs
 *
 * Idle word is cadence (HOLD: the recurring cloud trigger stays
 * enabled across a sleep miss).
 * HOLD aliases: armed, bound, listed, scheduled, muster-ok.
 * Seeded word is somnus (#94415 path).
 * Path word is device-absent.
 * Product score word is somnus (Score somnus or admit cadence.).
 *
 * NOT #94420 (Cresset — keep-awake GNOME hold never released).
 * NOT #94392 (headless -p exits with Tasks still running).
 * NOT #94410 (Lemure — leftover ScheduledTasks dispatcher ticks).
 * Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "cadence",
  "somnus",
  "device-absent",
  "armed",
  "bound",
  "listed",
  "scheduled",
  "muster-ok",
  "sleep-miss",
  "no-resume",
  "no-notify",
  "frozen-next",
  "lid-closed",
  "update-trigger",
  "requires-device",
  "cloud-bound",
  "catch-up",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "cadence";
export const PATH_WORD = "device-absent";
export const SEEDED_WORD = "somnus";
export const PRODUCT_WORD = "somnus";
export const HOLD = Object.freeze(["cadence"]);
export const HOLD_ALIASES = Object.freeze([
  "armed",
  "bound",
  "listed",
  "scheduled",
  "muster-ok",
]);
export const RECOVER = Object.freeze(["cadence"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "released",
  "verbatim",
  "quiet",
  "intact",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
  "cleared",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "cresset",
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
  "removable",
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
  "hold-leak",
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
  "cresset",
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
  "hold-leak",
  "segment-drop",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94415;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94415";
export const TITLE =
  "[BUG] Cowork cloud scheduled task bound to a computer is permanently disabled (suspension_reason=device_absent) after one firing while the computer is asleep, and never auto-resumes";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:cowork",
]);
export const PLATFORM = "macos";
export const SURFACE = "device-absent";
export const HOST =
  "Claude Desktop (Cowork) macOS 1.49585.0 Apple Silicon; Claude Code 2.1.268";
export const CHECKED_ON =
  "Published report: cloud trigger with requires_local_device:true set enabled=false / suspension_reason=device_absent on first fire while bound Mac asleep; no resume on reconnect; no notification";
export const BUILD =
  "Claude Desktop (Cowork) 1.49585.0; Claude Code 2.1.268";
export const SELECTED_MODEL =
  "cowork cloud schedule device_absent permanent-disable after one sleep miss — not a model defect";
export const OS =
  "macOS Apple Silicon; platform:macos / area:cowork";
export const PHRASE = "Score somnus or admit cadence.";
export const DISTRIBUTION =
  "A Cowork cloud scheduled task created with requires_local_device: true is set to enabled=false with suspension_reason=device_absent the first time it fires while the bound Mac is asleep. Suspension happens at dispatch, before any session starts, so the task's own \"is the device reachable?\" guard never runs. It does not resume when the device reconnects, and no notification is sent. The task silently stops firing for good after a single missed occurrence. Reporter lost three days of output. Manual update_trigger(enabled: true) works until the next miss. Env: Claude Desktop (Cowork) macOS 1.49585.0 Apple Silicon; task via Remote MCP create_trigger (created_via: meta_mcp); cron 45 0-4,13-23 * * * hourly at :45, 06:45–21:45 America/Los_Angeles. Task ids trig_01CkjM7FPtbe9R8BtVMjYvks and earlier trig_01CVWpA4WXHQo5ZQbRtM7aqY failed identically. Timeline: Sep 10 08:45 first fire, laptop closed → device_absent; ~19:45 replacement also disabled, next_run_at freezes; Sep 11–13 no firings though device reachable for hours each day; Sep 13 00:04 manually re-enabled; overnight Sep 13→14 suspended again. Published list_triggers: enabled false, suspension_reason device_absent, ended_reason empty, next_run_at 2026-09-11T03:45:00Z frozen, updated_at 2026-09-11T02:45:47Z, folders_state FOLDERS_STATE_PRESENT. Docs say scheduled tasks \"run on their cadence even when your computer is asleep\" — observed behavior contradicts. Local Desktop scheduled tasks skip a sleep miss and catch up on wake; cloud+device-bound is worse (permanent silent disable). Expected: the missed occurrence is skipped and the recurring schedule is preserved, so the next hourly trigger runs once the computer is back.";

export const DESKTOP_BUILD = "1.49585.0";
export const CODE_BUILD = "2.1.268";
export const CREATED_VIA = "meta_mcp";
export const REQUIRES_LOCAL_DEVICE = true;
export const CRON = "45 0-4,13-23 * * *";
export const CRON_ZONE = "America/Los_Angeles";
export const TASK_ID = "trig_01CkjM7FPtbe9R8BtVMjYvks";
export const PRIOR_TASK_ID = "trig_01CVWpA4WXHQo5ZQbRtM7aqY";
export const SUSPENSION_REASON = "device_absent";
export const FROZEN_NEXT_RUN = "2026-09-11T03:45:00Z";
export const FROZEN_UPDATED_AT = "2026-09-11T02:45:47Z";
export const DAYS_LOST = 3;
export const FOLDERS_STATE = "FOLDERS_STATE_PRESENT";

/**
 * Synthetic example-data — reconstructs published trigger shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_CADENCE = Object.freeze({
  enabled: true,
  suspension_reason: null,
  next_run_at: "advances",
  note: "missed occurrence skipped; schedule preserved",
  synthetic: true,
});
export const SYNTHETIC_SLEEP_MISS = Object.freeze({
  when: "Sep 10, 08:45 PT",
  event: "First task fires, laptop closed → device_absent, disabled",
  enabled: false,
  suspension_reason: "device_absent",
  synthetic: true,
});
export const SYNTHETIC_FROZEN = Object.freeze({
  id: TASK_ID,
  enabled: false,
  suspension_reason: "device_absent",
  ended_reason: "",
  next_run_at: FROZEN_NEXT_RUN,
  updated_at: FROZEN_UPDATED_AT,
  derived_state: { folders_state: FOLDERS_STATE },
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "moon-watch",
    lost: "Moon-watch — hourly :45 cadence should survive one sleep miss",
    control: "Local Desktop skips a sleep miss and catch-up on wake",
    story: "the moon keeps time; the cloud latch does not",
  },
  {
    id: "nursery-desk",
    lost: "Nursery desk — cloud trigger bound to one Mac and one folder",
    control: "requires_local_device:true should not snuff the series",
    story: "the crib is still there; the watch was cancelled",
  },
  {
    id: "absent-chip",
    lost: "Absent chip — dispatch writes device_absent before any session",
    control: "the task's own reachable-guard never gets to run",
    story: "the chip stamps the trigger dead at the door",
  },
  {
    id: "cadence-dial",
    lost: "Cadence dial — next_run_at freezes at the missed slot",
    control: "next_run_at should advance to the next hourly :45",
    story: "the dial stops at 03:45Z and never turns again",
  },
  {
    id: "sleep-ledger",
    lost: "Sleep ledger — three days of silence; no notify; no resume",
    control: "a suspension should lift when the device reconnects",
    story: "nothing in the run history names the missed hours",
  },
  {
    id: "lid-closed",
    lost: "Lid closed — first fire while asleep permanently disables",
    control: "update_trigger(enabled: true) works until the next miss",
    story: "one nap at fire-time ends the series",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "moon-watch",
    survey: "ordinary cadence: missed occurrence skipped; schedule stays enabled",
    kind: "cadence",
    note: "idle/control: cloud trigger keeps firing after a sleep miss",
  },
  {
    id: "nursery-desk",
    survey: "cloud + requires_local_device:true bound to one Mac",
    kind: "somnus",
    note: "seeded: nursery desk still present; trigger cancelled",
  },
  {
    id: "absent-chip",
    survey: "dispatch writes device_absent before any session starts",
    kind: "somnus",
    note: "seeded: reachable-guard never runs",
  },
  {
    id: "cadence-dial",
    survey: "next_run_at frozen at 2026-09-11T03:45:00Z",
    kind: "somnus",
    note: "seeded: dial does not advance",
  },
  {
    id: "sleep-ledger",
    survey: "Sep 11–13 no firings; device reachable; no notification",
    kind: "somnus",
    note: "seeded: three days of silent disable",
  },
  {
    id: "lid-closed",
    survey: "device-absent — first lid-closed fire permanently disables",
    kind: "somnus",
    note: "path: device-absent names the latch with no release",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "sleep-miss",
    label: "sleep-miss",
    count: "08:45 PT",
    note: "First fire while laptop closed writes device_absent",
  },
  {
    id: "no-resume",
    label: "no-resume",
    count: "3 days",
    note: "Device reachable for hours each day; never auto-resumes",
  },
  {
    id: "no-notify",
    label: "no-notify",
    count: "silent",
    note: "No push, no run-history row, nothing in the session list",
  },
  {
    id: "frozen-next",
    label: "frozen-next",
    count: "03:45Z",
    note: "next_run_at stays frozen at the missed time",
  },
  {
    id: "lid-closed",
    label: "lid-closed",
    count: "first miss",
    note: "One sleep at fire-time ends the hourly series",
  },
  {
    id: "update-trigger",
    label: "update-trigger",
    count: "manual",
    note: "update_trigger(enabled: true) works until the next miss",
  },
]);

export const RULED_OUT = Object.freeze([
  "#94420 — Desktop keep-awake GNOME suspend inhibitor never released after re-adopt or stall — keep-awake hold, not schedule suspension_reason; DIFFERENT",
  "#94392 — headless -p exits with Tasks still running — CLI process exit vs cloud trigger disable; DIFFERENT",
  "#94410 — Desktop ghost scheduled tasks fire every minute but are absent from UI — leftover dispatcher ticks, not a live cloud trigger killed by device_absent; DIFFERENT",
  "#92268 — agent-created Cowork tasks and device binding — cite only: Require this computer cannot be enabled on an existing task; DIFFERENT",
  "Cresset/#94420 — keep-awake hold never released; DIFFERENT",
  "Dictabelt/#94406 — desktop voice-dictation segment-drop; DIFFERENT",
  "Lemure/#94410 — leftover ScheduledTasks dispatcher ticks; DIFFERENT",
  "Cancellans/#94400 — deferred-delta binder folio; DIFFERENT",
  "Arras/#94348 — phantom-prompt theater tapestry; DIFFERENT",
  "Frangible/#94362 — chmod-failopen wax-seal; DIFFERENT",
  "Nameplate/#94349 — header-rename brass plate; DIFFERENT",
  "Matryoshka/#94350 — subst-nest nesting-doll; DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "The missed occurrence is skipped and the recurring schedule is preserved",
  "The next hourly trigger runs normally once the computer is back",
  "enabled stays true and next_run_at advances to the next slot",
  "If intent is to avoid dispatching to a gone-for-good device: bounded backoff with automatic resumption on reconnect, plus a notification when suspended",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "device-absent",
  "somnus",
  "sleep-miss",
  "no-resume",
  "frozen-next",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94420,
    title: "Desktop (Linux): Keep computer awake hold never released after re-adopt or stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — keep-awake hold, not schedule suspension_reason. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94392,
    title: "headless -p exits with Tasks still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — CLI process exit vs cloud trigger disable. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94410,
    title: "Desktop: ghost scheduled tasks fire every minute but are absent from UI",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover dispatcher ticks, not a live cloud trigger killed by device_absent. Do not rebuild. Do not conflate.",
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
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 92268, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "cresset",
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

export const SAMPLE_KIND_IDLE = "moon-watch";
export const SAMPLE_KIND_SEEDED = "device-absent";
export const SAMPLE_HOLDING_IDLE = "muster-ok";
export const SAMPLE_HOLDING_SEEDED = "absent-chip";

export const SAMPLE_CADENCE_PROOF = Object.freeze({
  cadence: true,
  somnus: false,
  deviceAbsent: false,
  sleepMiss: false,
  noResume: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SOMNUS_PROOF = Object.freeze({
  cadence: false,
  somnus: true,
  deviceAbsent: true,
  sleepMiss: true,
  noResume: true,
  noNotify: true,
  frozenNext: true,
  lidClosed: true,
  updateTrigger: true,
  requiresDevice: true,
  cloudBound: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  cadenceCase: { ...SYNTHETIC_CADENCE },
  miss: { ...SYNTHETIC_SLEEP_MISS },
  frozen: { ...SYNTHETIC_FROZEN },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds cadence: recurring cloud trigger stays enabled across a sleep miss" },
  { t: "sleep-miss", line: "first fire while laptop closed; dispatch writes device_absent before any session" },
  { t: "no-resume", line: "device reconnects; trigger stays enabled=false; no notification" },
  { t: "path", line: "device-absent — next_run_at frozen; three days of silence; manual update_trigger until next miss" },
  { t: "score", line: "when one sleep permanently snuffs the schedule the booth is somnus — Score somnus or admit cadence." },
]);

const FORCE_FLAGS = [
  "deviceAbsent",
  "sleepMiss",
  "noResume",
  "noNotify",
  "frozenNext",
  "lidClosed",
];

const ISSUE_CUE_RE =
  /94415|device_absent|requires_local_device|update_trigger|trig_01CkjM7|1\.49585\.0|2\.1\.268|next_run_at/i;

/**
 * Educational dispatch evaluation. Not a Claude Code patch.
 * Encodes only the published #94415 shapes.
 * cadence=true is the HOLD / skip-and-continue path.
 *
 * Cadence/HOLD when: a sleep miss is skipped and the recurring
 * cloud trigger stays enabled.
 * Somnus / device-absent when: dispatch disables the trigger
 * with device_absent and never resumes.
 */
export function evaluateDispatch({
  cadence = false,
  deviceAsleep = false,
  deviceAbsent = false,
  resumed = false,
  notified = false,
} = {}) {
  if (cadence === true && !deviceAbsent && !deviceAsleep) {
    return {
      disabled: false,
      deviceAbsent: false,
      resumed: true,
      notified: false,
      phrase: "admit cadence",
      synthetic: true,
    };
  }
  const disabled =
    (deviceAsleep === true || deviceAbsent === true) && resumed !== true;
  return {
    disabled,
    deviceAbsent: disabled || deviceAbsent,
    resumed: resumed === true && !disabled,
    notified: notified === true && !disabled,
    phrase: disabled ? "score somnus" : "admit cadence",
    synthetic: true,
  };
}

export function scoreDeviceAbsent(input = {}) {
  const cadenceHold = input.cadence === true && input.somnus !== true;
  const dispatch = evaluateDispatch({
    cadence: cadenceHold,
    deviceAsleep: input.sleepMiss === true || input.lidClosed === true,
    deviceAbsent: input.deviceAbsent === true || input.somnus === true,
    resumed: input.noResume !== true && cadenceHold,
    notified: input.noNotify !== true && cadenceHold,
  });
  const somnus =
    !cadenceHold &&
    (dispatch.disabled === true ||
      input.somnus === true ||
      input.deviceAbsent === true ||
      input.sleepMiss === true ||
      input.lidClosed === true);
  return {
    cadence: !somnus,
    somnus,
    deviceAbsent: somnus,
    dispatch,
    phrase: somnus ? "score somnus" : "admit cadence",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94415") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapSomnus(input = {}) {
  const somnus = isSomnusInput(input);
  const cadence = input.cadence === true && !somnus;
  return {
    stamp: somnus ? "device-absent" : "muster-ok",
    holdingLane: somnus ? "absent-chip" : "muster-ok",
    kindLane: somnus ? "device-absent" : "moon-watch",
    bindLane: somnus ? "lid-closed" : "scheduled",
    ribbon: somnus ? "somnus" : "cadence",
    cadence,
  };
}

export function inspectSleepMiss(input = {}) {
  const miss =
    input.sleepMiss === true ||
    input.somnus === true ||
    input.deviceAbsent === true ||
    isSomnusInput(input);
  if (input.cadence === true && !miss) {
    return { stamp: "skip-and-continue", miss: false, note: "sleep miss skipped; schedule preserved" };
  }
  return {
    stamp: miss ? "sleep-miss" : "miss-idle",
    miss,
    note: miss
      ? "sleep-miss — first fire while laptop closed writes device_absent"
      : "",
  };
}

export function inspectNoResume(input = {}) {
  const stuck =
    input.noResume === true ||
    input.somnus === true ||
    input.deviceAbsent === true ||
    isSomnusInput(input);
  if (input.cadence === true && !stuck) {
    return { stamp: "resumes", stuck: false };
  }
  return {
    stamp: stuck ? "no-resume" : "resume-idle",
    stuck,
    note: stuck
      ? "no-resume — device reconnects; trigger stays enabled=false"
      : "",
  };
}

export function inspectNoNotify(input = {}) {
  const silent =
    input.noNotify === true ||
    input.somnus === true ||
    input.deviceAbsent === true ||
    isSomnusInput(input);
  if (input.cadence === true && !silent) {
    return { stamp: "would-notify", silent: false };
  }
  return {
    stamp: silent ? "no-notify" : "notify-idle",
    silent,
    note: silent
      ? "no-notify — no push, no run-history row, nothing in the session list"
      : "",
  };
}

export function inspectFrozenNext(input = {}) {
  const frozen =
    input.frozenNext === true ||
    input.somnus === true ||
    input.deviceAbsent === true ||
    isSomnusInput(input);
  if (input.cadence === true && !frozen) {
    return { stamp: "next-advances", frozen: false };
  }
  return {
    stamp: frozen ? "frozen-next" : "next-idle",
    frozen,
    note: frozen
      ? "frozen-next — next_run_at stays at 2026-09-11T03:45:00Z"
      : "",
  };
}

export function inspectLidClosed(input = {}) {
  const closed =
    input.lidClosed === true ||
    input.somnus === true ||
    isSomnusInput(input);
  if (input.cadence === true && !closed) {
    return { stamp: "lid-open-or-skipped", closed: false };
  }
  return {
    stamp: closed ? "lid-closed" : "lid-idle",
    closed,
    note: closed
      ? "lid-closed — one nap at fire-time ends the series"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "moon-watch": input.somnus || input.deviceAbsent,
    "nursery-desk": input.somnus || input.requiresDevice || input.cloudBound,
    "absent-chip": input.deviceAbsent || input.somnus,
    "cadence-dial": input.frozenNext || input.deviceAbsent,
    "sleep-ledger": input.noResume || input.noNotify,
    "lid-closed": input.lidClosed || input.sleepMiss,
  };
  return (
    map[id] === true ||
    input.deviceAbsent === true ||
    input.somnus === true
  );
}

function isSomnusInput(input = {}) {
  return (
    input.somnus === true ||
    input.deviceAbsent === true ||
    input.sleepMiss === true ||
    input.noResume === true ||
    input.noNotify === true ||
    input.frozenNext === true ||
    input.lidClosed === true ||
    input.requiresDevice === true ||
    input.cloudBound === true
  );
}

export function readBooth(input = {}) {
  const somnus = isSomnusInput(input);
  const cadence = input.cadence === true && !somnus;
  return {
    mark: somnus ? "somnus" : "cadence",
    cadence,
    somnus,
    deviceAbsent: input.deviceAbsent === true || somnus,
    sleepMiss: input.sleepMiss === true,
    noResume: input.noResume === true,
    noNotify: input.noNotify === true,
    frozenNext: input.frozenNext === true,
    lidClosed: input.lidClosed === true,
    updateTrigger: input.updateTrigger === true,
    requiresDevice: input.requiresDevice === true,
    cloudBound: input.cloudBound === true,
    clinic: mapSomnus(input),
    miss: inspectSleepMiss(input),
    resume: inspectNoResume(input),
    notify: inspectNoNotify(input),
    frozen: inspectFrozenNext(input),
    lid: inspectLidClosed(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const SOMNUS_WALK = Object.freeze([
  {
    t: "idle",
    event: "muster-ok",
    cadence: true,
    somnus: false,
    cue: "cadence",
    note: "idle HOLD: recurring cloud trigger stays enabled across a sleep miss",
  },
  {
    t: "sleep-miss",
    event: "device-absent",
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
    cue: "somnus",
    note: "first fire while laptop closed; dispatch writes device_absent before any session",
  },
  {
    t: "no-resume",
    event: "no-resume",
    somnus: true,
    noResume: true,
    noNotify: true,
    cue: "somnus",
    note: "device reconnects; trigger stays enabled=false; no notification",
  },
  {
    t: "path",
    event: "device-absent",
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
    noResume: true,
    noNotify: true,
    frozenNext: true,
    lidClosed: true,
    updateTrigger: true,
    requiresDevice: true,
    cloudBound: true,
    cue: "somnus",
    note: "device-absent — next_run_at frozen; three days of silence; manual update_trigger until next miss",
  },
  {
    t: "score",
    event: "somnus",
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
    noResume: true,
    noNotify: true,
    frozenNext: true,
    lidClosed: true,
    updateTrigger: true,
    requiresDevice: true,
    cloudBound: true,
    cue: "somnus",
    note: "somnus — one sleep permanently snuffs the cloud schedule",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "muster-ok",
    cadence: true,
    somnus: false,
    cue: "cadence",
    note: "positive control: sleep miss skipped; schedule preserved",
  },
  {
    t: "admit",
    event: "muster-ok",
    cadence: true,
    cue: "cadence",
    note: "positive control: the booth admits cadence",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    cadence: true,
    somnus: false,
    deviceAbsent: false,
    cue: "cadence",
  };
}

export function seedCadence() {
  return { ...emptyTicket() };
}

export function seedSomnus() {
  return {
    seed: SEEDED_WORD,
    cadence: false,
    somnus: true,
    deviceAbsent: true,
    sleepMiss: true,
    noResume: true,
    noNotify: true,
    frozenNext: true,
    lidClosed: true,
    updateTrigger: true,
    requiresDevice: true,
    cloudBound: true,
    cue: "somnus",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SOMNUS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    somnus: true,
    deviceAbsent: true,
    cue: "somnus",
  };
}

export function seedDeviceAbsent() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    somnus: true,
    deviceAbsent: true,
    event: "device-absent",
    cue: "somnus",
  };
}

export function seedArmed() {
  return { seed: "armed", preferSeed: true, cadence: true, cue: "cadence" };
}

export function seedBound() {
  return { seed: "bound", preferSeed: true, cadence: true, cue: "cadence" };
}

export function seedListed() {
  return { seed: "listed", preferSeed: true, cadence: true, cue: "cadence" };
}

export function seedScheduled() {
  return { seed: "scheduled", preferSeed: true, cadence: true, cue: "cadence" };
}

export function seedMusterOk() {
  return { seed: "muster-ok", preferSeed: true, cadence: true, cue: "cadence" };
}

export function seedSleepMiss() {
  return {
    seed: "sleep-miss",
    preferSeed: true,
    sleepMiss: true,
    cue: "somnus",
  };
}

export function seedNoResume() {
  return {
    seed: "no-resume",
    preferSeed: true,
    noResume: true,
    cue: "somnus",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      cadence: false,
      somnus: false,
      deviceAbsent: false,
      sleepMiss: false,
      noResume: false,
      noNotify: false,
      frozenNext: false,
      lidClosed: false,
      updateTrigger: false,
      requiresDevice: false,
      cloudBound: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    cadence: raw.cadence === true,
    somnus: raw.somnus === true || raw.event === "somnus",
    deviceAbsent:
      raw.deviceAbsent === true || raw.event === "device-absent",
    sleepMiss:
      raw.sleepMiss === true || raw.event === "sleep-miss",
    noResume:
      raw.noResume === true || raw.event === "no-resume",
    noNotify:
      raw.noNotify === true || raw.event === "no-notify",
    frozenNext:
      raw.frozenNext === true || raw.event === "frozen-next",
    lidClosed:
      raw.lidClosed === true || raw.event === "lid-closed",
    updateTrigger:
      raw.updateTrigger === true || raw.event === "update-trigger",
    requiresDevice:
      raw.requiresDevice === true || raw.event === "requires-device",
    cloudBound:
      raw.cloudBound === true || raw.event === "cloud-bound",
    deviceAsleep: raw.deviceAsleep,
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
      (ticket.cadence != null ||
        ticket.somnus != null ||
        ticket.deviceAbsent != null ||
        ticket.sleepMiss != null ||
        ticket.noResume != null ||
        ticket.noNotify != null ||
        ticket.frozenNext != null ||
        ticket.lidClosed != null ||
        ticket.updateTrigger != null ||
        ticket.requiresDevice != null ||
        ticket.cloudBound != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isCadence(row) {
  if (row.somnus && row.cue !== "cadence") return false;
  if (row.cue === "somnus" || row.cue === "device-absent") return false;
  if (
    row.deviceAbsent &&
    row.sleepMiss &&
    row.cue !== "cadence" &&
    row.cadence !== true
  ) {
    return false;
  }
  if (
    row.cadence === true &&
    row.somnus !== true &&
    row.cue !== "somnus"
  ) {
    return true;
  }
  if (
    row.cue === "cadence" &&
    row.somnus !== true &&
    row.deviceAbsent !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isDeviceAbsent(row) {
  return (
    row.event === "device-absent" &&
    !isCadence(row) &&
    (row.deviceAbsent === true ||
      row.sleepMiss === true ||
      row.somnus === true)
  );
}

function isSomnusRow(row) {
  if (isCadence(row)) return false;
  if (isDeviceAbsent(row) && row.cue !== "somnus") return false;
  if (row.cue === "somnus") return true;
  if (row.somnus === true) return true;
  if (row.deviceAbsent === true && row.sleepMiss === true) return true;
  if (
    row.deviceAbsent === true ||
    row.sleepMiss === true ||
    row.noResume === true ||
    row.noNotify === true ||
    row.frozenNext === true ||
    row.lidClosed === true ||
    row.requiresDevice === true ||
    row.cloudBound === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one somnus pass against the moon-watch desk.
 * cadence: recurring cloud trigger stays enabled across a sleep miss.
 * somnus: dispatch permanently disables the trigger with device_absent.
 * device-absent: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDeviceAbsent(row) ||
    (row.deviceAbsent && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "device-absent";
  } else if (isSomnusRow(row)) {
    verdict = "somnus";
  } else if (isCadence(row)) {
    verdict = "cadence";
  } else if (
    row.deviceAbsent ||
    row.sleepMiss ||
    row.noResume ||
    row.noNotify ||
    row.frozenNext ||
    row.lidClosed ||
    row.requiresDevice ||
    row.cloudBound
  ) {
    verdict = "somnus";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "somnus";
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
    cadence: verdict === "cadence",
    somnus: verdict === "somnus" || verdict === SEEDED_WORD,
    deviceAbsent:
      row.deviceAbsent === true ||
      verdict === "device-absent" ||
      verdict === PATH_WORD,
    sleepMiss: row.sleepMiss,
    noResume: row.noResume,
    noNotify: row.noNotify,
    frozenNext: row.frozenNext,
    lidClosed: row.lidClosed,
    updateTrigger: row.updateTrigger,
    requiresDevice: row.requiresDevice,
    cloudBound: row.cloudBound,
    cue: hold
      ? "cadence"
      : row.deviceAbsent || verdict === "device-absent"
        ? "device-absent"
        : "somnus",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit cadence" : "score somnus",
    missInspect: inspectSleepMiss(row),
    resumeInspect: inspectNoResume(row),
    notifyInspect: inspectNoNotify(row),
    frozenInspect: inspectFrozenNext(row),
    lidInspect: inspectLidClosed(row),
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
      : SOMNUS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "somnus");
  const path = scored.filter((row) => row.verdict === "device-absent");
  const cadence = scored.filter((row) => row.verdict === "cadence");
  const headline =
    scored.find((row) => row.event === "somnus") ||
    scored.find((row) => row.event === "device-absent") ||
    scored.find((row) => row.event === "no-resume") ||
    charged[charged.length - 1];
  let verdict = "cadence";
  if (charged.length) verdict = "somnus";
  else if (path.length && !cadence.length) {
    verdict = "device-absent";
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
    somnusCount: charged.length,
    pathCount: path.length,
    cadenceCount: cadence.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit cadence" : "score somnus",
    note: headline
      ? "Cowork cloud scheduled task bound to a computer is permanently disabled (suspension_reason=device_absent) after one firing while the computer is asleep, and never auto-resumes. Desktop 1.49585.0; Claude Code 2.1.268; requires_local_device:true; cron hourly :45. Cite-only cousins #94420 #94392 #94410."
      : "published somnus walk scored against cadence vs somnus",
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
    seeded !== "cadence" &&
    seeded !== "somnus" &&
    seeded !== "device-absent" &&
    ticket.cadence == null &&
    ticket.somnus == null &&
    ticket.deviceAbsent == null &&
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
    cadence: scored.cadence ?? false,
    somnus: scored.somnus ?? false,
    deviceAbsent: scored.deviceAbsent ?? false,
    sleepMiss: scored.sleepMiss ?? false,
    noResume: scored.noResume ?? false,
    noNotify: scored.noNotify ?? false,
    frozenNext: scored.frozenNext ?? false,
    lidClosed: scored.lidClosed ?? false,
    updateTrigger: scored.updateTrigger ?? false,
    requiresDevice: scored.requiresDevice ?? false,
    cloudBound: scored.cloudBound ?? false,
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
    result.deviceAbsent || result.somnus
      ? "kind=device-absent"
      : "kind=moon-watch",
    result.sleepMiss || result.somnus
      ? "ref=sleep-miss"
      : "ref=muster-ok",
    result.deviceAbsent || result.verdict === "device-absent"
      ? "path=device-absent"
      : "path=cadence",
    result.cue === "cadence"
      ? "cue=cadence"
      : result.cue === "device-absent"
        ? "cue=device-absent"
        : "cue=somnus",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    cadence: result.cadence,
    somnus: result.somnus,
    deviceAbsent: result.deviceAbsent,
    sleepMiss: result.sleepMiss,
    noResume: result.noResume,
    noNotify: result.noNotify,
    frozenNext: result.frozenNext,
    lidClosed: result.lidClosed,
    updateTrigger: result.updateTrigger,
    requiresDevice: result.requiresDevice,
    cloudBound: result.cloudBound,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    miss: inspectSleepMiss({
      cadence: result.cadence,
      somnus: result.somnus,
      sleepMiss: result.sleepMiss,
    }),
    resume: inspectNoResume({
      cadence: result.cadence,
      somnus: result.somnus,
      noResume: result.noResume,
    }),
    notify: inspectNoNotify({
      cadence: result.cadence,
      somnus: result.somnus,
      noNotify: result.noNotify,
    }),
    frozen: inspectFrozenNext({
      cadence: result.cadence,
      somnus: result.somnus,
      frozenNext: result.frozenNext,
    }),
    lid: inspectLidClosed({
      cadence: result.cadence,
      somnus: result.somnus,
      lidClosed: result.lidClosed,
    }),
    clinic: mapSomnus({
      cadence: result.cadence,
      somnus: result.somnus,
      deviceAbsent: result.deviceAbsent,
      sleepMiss: result.sleepMiss,
      noResume: result.noResume,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      somnus: result.somnus === true || result.verdict === "somnus",
    })),
    leakPath: scoreDeviceAbsent({
      cadence: result.cadence === true && !result.somnus,
      somnus: result.somnus,
      deviceAbsent: result.deviceAbsent,
      sleepMiss: result.sleepMiss,
      lidClosed: result.lidClosed,
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
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): dispatch-time device_absent path disables the trigger instead of skipping the occurrence; no reconnect re-enable and no suspension notification. Invite verify against #94415 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
