#!/usr/bin/env node
/**
 * Freshet — river-stage / staff-gauge / flood-crest /
 * floodplain booth.
 * A *freshet* is a sudden flood-surge: snowmelt or storm
 * lifts the river over the staff gauge until the floodplain
 * drowns what was still findable above the waterline.
 * Desktop Remote Control re-sends initialize every 60s;
 * each burst appends system/init + system/status until the
 * newest 2,000-event window is all control noise and the
 * UI plaques "No messages yet" while conversation still
 * sits under the flood. NOT Kintsugi urushi/gold pottery.
 * NOT Cenotaph marble empty-tomb. NOT Stratum geology cores.
 * NOT Tmesis parchment. NOT Vedette cavalry lantern. NOT
 * Orloj Prague clock. NOT Brisure herald college. NOT
 * Diptych wax-tablet. NOT Vizard masque. NOT Treacle kettle.
 * NOT Somnus sleep clinic. NOT Cresset fire-basket. NOT
 * Dictabelt wax-belt. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Stereotype foundry. NOT
 * Cachet wax-seal.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: Desktop app re-sends initialize (+ get_workspace_diff)
 * to an on-screen Remote Control session every 60s. Each
 * initialize makes the CLI append fresh system/init +
 * system/status (~14 events/min, ~800+/hr) with nothing
 * typed. The transcript loader pages the newest 2,000
 * events then stops. If those 2,000 are all control/system
 * noise, the UI shows "No messages yet" even though
 * user/assistant events exist older on disk and server.
 * Browser tabs do NOT poll; only desktop.
 *
 * Encoded from anthropics/claude-code#94430 issue text only.
 * Hypothesis (NON-BINDING — issue text): either stop timer
 * re-initialize, or do not append system/init+status on
 * control re-init, or keep paging until conversation events
 * / exclude control noise from the window. Invite verify
 * against #94430 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a
 * Claude Code fix. No network. No exploits. No live Claude.
 *
 *   node freshet.mjs data/freshet.json
 *   echo '{"seed":"freshet"}' | node freshet.mjs
 *
 * Idle word is buoyed (HOLD: conversation still findable /
 * messages above the waterline).
 * HOLD aliases: surfaced, charted, sounding.
 * Seeded word is freshet (#94430 path).
 * Path word is init-flood.
 * Product score word is freshet (Score freshet or admit buoyed.).
 *
 * NOT #94451 (known_marketplaces heal-abort). NOT #94452
 * (directory marketplace dead installLocation). NOT #94396
 * (fork-resume never Remote Control eligible). NOT #94397
 * (Remote Control mobile brief-echo).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "buoyed",
  "freshet",
  "init-flood",
  "surfaced",
  "charted",
  "sounding",
  "initialize-cadence",
  "window-drown",
  "no-messages-yet",
  "desktop-poll",
  "browser-quiet",
  "system-init",
  "load-earlier",
  "94430",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "buoyed";
export const PATH_WORD = "init-flood";
export const SEEDED_WORD = "freshet";
export const PRODUCT_WORD = "freshet";
export const HOLD = Object.freeze(["buoyed"]);
export const HOLD_ALIASES = Object.freeze(["surfaced", "charted", "sounding"]);
export const RECOVER = Object.freeze(["buoyed"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "mended",
  "homed",
  "shared",
  "contiguous",
  "stationed",
  "lasting",
  "enrolled",
  "cleared",
  "repointed",
  "relocated",
  "settled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
  "stood",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "frangible",
  "nameplate",
  "matryoshka",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
]);

export const FEATURED_ISSUE = 94430;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94430";
export const TITLE =
  "[BUG] Desktop app re-sends initialize + get_workspace_diff to an on-screen Remote Control session every 60 s; the system/init+status flood pushes the conversation past the 2,000-event window the transcript loader reads, so the session opens as \"No messages yet\"";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "regression",
  "area:desktop",
  "area:agent-view",
]);
export const PLATFORM = "windows";
export const SURFACE = "init-flood";
export const HOST =
  "Claude Code CLI 2.1.272 hosting --bg --remote-control; desktop app 1.52386.6 (bundles 2.1.270); Windows 11 Pro 26200; Opus 5";
export const CHECKED_ON =
  "Published report: desktop re-sends initialize + get_workspace_diff every 60s to an on-screen Remote Control session; CLI appends system/init + system/status (~14 events/min, ~800+/hr); transcript loader pages newest 2,000 events then stops; if those 2,000 are control/system noise the UI plaques No messages yet; browser tabs do not poll";
export const BUILD = "Claude Code 2.1.272 / desktop 1.52386.6";
export const SELECTED_MODEL = "Opus 5 — failure is a desktop poll + loader window, not a model defect";
export const OS = "Windows 11 Pro 26200 (CLI host and desktop app)";
export const PHRASE = "Score freshet or admit buoyed.";
export const DISTRIBUTION =
  "Claude Code CLI 2.1.272 hosting claude --bg --remote-control; desktop app 1.52386.6 bundles 2.1.270. Desktop re-sends initialize (bursts of 2–3) plus get_workspace_diff every 60s while the session is on screen. CLI answers each initialize with control_response and emits fresh system/init + system/status into the session event log (~14 events/min, ~800+/hr) with nothing typed. Transcript loader GET /events?limit=500&sort_order=desc follows cursor for four pages (2,000 events) then stops. If those 2,000 are control_request/control_response/system init/system status noise, the view plaques No messages yet plus Load earlier messages (500 more per click). Browser tabs (Chrome 151, claude.ai/code) do not poll. Regression: desktop 1.44121.4 ≤20 init/hr; 1.46388.1 → 120/hr; 1.52386.6 → 180/hr. One published session: 9,081 events, 205 user/assistant, last conversation sequence_num 3654, 5,427 noise events after; 1,869 initialize, 627 get_workspace_diff; conversation appears after 8 Load earlier clicks. ~2.5 hours on screen drowns the 2,000-event window.";

export const CODE_BUILD = "2.1.272";
export const DESKTOP_141 = "1.44121.4";
export const DESKTOP_146 = "1.46388.1";
export const DESKTOP_152 = "1.52386.6";
export const INIT_INTERVAL_SEC = 60;
export const WINDOW_SIZE = 2000;
export const PAGE_SIZE = 500;
export const PAGE_CAP = 4;
export const EVENTS_PER_MIN = 14;
export const EVENTS_PER_HOUR = 800;
export const DROWN_HOURS = 2.5;
export const SESSION_EVENTS = 9081;
export const CONVERSATION_EVENTS = 205;
export const NOISE_AFTER = 5427;
export const INIT_COUNT = 1869;
export const DIFF_COUNT = 627;
export const LOAD_CLICKS = 8;
export const PLAQUE_LINE = "No messages yet";
export const LOAD_EARLIER_LINE = "Load earlier messages";
export const INIT_LINE = "Inbound control_request subtype=initialize";
export const DIFF_LINE = "Inbound control_request subtype=get_workspace_diff";
export const RATE_141 = 20;
export const RATE_146 = 120;
export const RATE_152 = 180;

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_BUOYED = Object.freeze({
  kind: "buoyed",
  conversationAboveWaterline: true,
  windowHasUserAssistant: true,
  plaque: false,
  note: "messages still findable above the waterline",
  synthetic: true,
});
export const SYNTHETIC_FRESHET = Object.freeze({
  kind: "freshet",
  conversationAboveWaterline: false,
  windowHasUserAssistant: false,
  plaque: true,
  note: "initialize flood drowned the 2,000-event window; plaque No messages yet",
  synthetic: true,
});
export const SYNTHETIC_INIT_FLOOD = Object.freeze({
  kind: "init-flood",
  rows: [
    { lane: "desktop poll", block: "initialize ×3 + get_workspace_diff / 60s", live: false, note: "only desktop; browser quiet" },
    { lane: "CLI append", block: "system/init + system/status", live: false, note: "~14 events/min, ~800+/hr" },
    { lane: "event spool", block: "5,427 noise after last conversation", live: false, note: "1,869 initialize; 627 get_workspace_diff" },
    { lane: "window viewport", block: "newest 2,000 then stop", live: false, note: "four pages of 500" },
    { lane: "plaque", block: PLAQUE_LINE, live: false, note: "conversation exists older on disk and server" },
    { lane: "load earlier", block: "8 clicks × 500", live: true, note: "conversation surfaces after the 8th click" },
  ],
  note: "six-row evidence: staff gauge overtopped; init-flood; plaque lies empty",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "desktop poll",
    role: "gauge",
    content: "initialize bursts of 2–3 plus get_workspace_diff every 60s while on screen",
    live: false,
    drowned: true,
  },
  {
    lane: "CLI append",
    role: "crest",
    content: "fresh system/init + system/status per initialize; ~14 events/min",
    live: false,
    drowned: true,
  },
  {
    lane: "event spool",
    role: "spool",
    content: "5,427 control/system events after last user/assistant (sequence_num 3654)",
    live: false,
    drowned: true,
  },
  {
    lane: "window viewport",
    role: "window",
    content: "GET events?limit=500&sort_order=desc; four pages; 2,000 then stop",
    live: false,
    drowned: true,
    windowed: true,
  },
  {
    lane: "plaque",
    role: "lie",
    content: "No messages yet — 205 conversation events still on disk and server",
    live: false,
    drowned: true,
  },
  {
    lane: "load earlier",
    role: "sounding",
    content: "each click loads 500 more; conversation appears after 8 clicks",
    live: true,
    drowned: false,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "staff-gauge",
    lost: "Staff gauge — desktop re-sends initialize every 60s while the session is merely looked at",
    control: "A buoyed gauge would not timer-reinitialize an on-screen Remote Control session",
    story: "the river stage climbs with nothing typed",
  },
  {
    id: "crest-mark",
    lost: "Crest mark — each initialize appends system/init + system/status into the persistent log",
    control: "a control re-init would not write a fresh flood mark",
    story: "the high-water scratch is cut every minute",
  },
  {
    id: "event-spool",
    lost: "Event spool — ~14 events/min, ~800+/hr; 1,869 initialize and 627 get_workspace_diff in one session",
    control: "the spool would stay quiet unless a turn ran",
    story: "the reel pays out floodwater while the operator only watches",
  },
  {
    id: "window-viewport",
    lost: "Window viewport — newest 2,000 events then stop; four pages of 500",
    control: "the viewport would keep paging until conversation events, or exclude control noise",
    story: "the 2,000-tick window fills with foam and never looks underneath",
  },
  {
    id: "no-messages-plaque",
    lost: "No-messages plaque — UI says No messages yet while 205 user/assistant events sit under the flood",
    control: "the plaque would not declare empty while older pages exist",
    story: "the floodplain sign lies; the channel still holds the talk",
  },
  {
    id: "load-earlier",
    lost: "Load earlier — eight clicks of 500 to surface the conversation",
    control: "the first open would already be above the waterline",
    story: "sounding the bed by hand is the only way back",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "gauge",
    survey: "buoyed HOLD: conversation still findable / messages above the waterline",
    kind: "buoyed",
    note: "idle/control: the staff gauge still shows talk above stage",
  },
  {
    id: "crest-mark",
    survey: "desktop 1.52386.6 sends initialize ×3 + get_workspace_diff every 60s; 1.44121.4 was ≤20/hr",
    kind: "freshet",
    note: "seeded: flood-crest from the timer",
  },
  {
    id: "event-spool",
    survey: "CLI appends system/init + system/status; ~14 events/min, ~800+/hr; nothing typed",
    kind: "freshet",
    note: "seeded: the spool is the surge",
  },
  {
    id: "window-viewport",
    survey: "transcript loader pages newest 2,000 events (4×500) then stops",
    kind: "freshet",
    note: "seeded: the 2,000-tick window drowns",
  },
  {
    id: "no-messages-plaque",
    survey: "No messages yet even though user/assistant events exist older on disk and server",
    kind: "freshet",
    note: "seeded: the plaque lies empty",
  },
  {
    id: "load-earlier",
    survey: "init-flood — Load earlier messages, 8 clicks × 500 to surface the conversation; browser tabs do not poll",
    kind: "freshet",
    note: "path: init-flood names the surge that drowned the window",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "initialize-cadence",
    label: "initialize-cadence",
    count: "60s",
    note: "desktop re-sends initialize + get_workspace_diff every 60s while on screen",
  },
  {
    id: "window-drown",
    label: "window-drown",
    count: "2000",
    note: "newest 2,000 events then stop; four pages of 500",
  },
  {
    id: "no-messages-yet",
    label: "no-messages-yet",
    count: "plaque",
    note: "UI plaques No messages yet while conversation sits under the flood",
  },
  {
    id: "desktop-poll",
    label: "desktop-poll",
    count: "desktop",
    note: "only the desktop app polls; browser tabs stay quiet",
  },
  {
    id: "init-flood",
    label: "init-flood",
    count: "surge",
    note: "system/init+status flood pushes past the 2,000-event window",
  },
  {
    id: "load-earlier",
    label: "load-earlier",
    count: "8×500",
    note: "each click loads 500 more; conversation after the 8th click",
  },
]);

export const RULED_OUT = Object.freeze([
  " #94451 — known_marketplaces.json never repaired once invalid / heal-abort — DIFFERENT; cite only",
  " #94452 — directory marketplace dead installLocation ENOENT while source.path lives — DIFFERENT; cite only",
  " #94396 — fork-resume never becomes Remote Control eligible — DIFFERENT; cite only",
  " #94397 — Remote Control mobile brief-echo — DIFFERENT; cite only",
  " #93490 — resume flattens array+cache_control — DIFFERENT; cite only",
  "Kintsugi/#94451 — gold never sets; writer re-reads the corrupt vessel — DIFFERENT",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit / false success — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — orphan scheduled-task ticks — DIFFERENT",
  "Cancellans/#94400 — deferred-delta / tools-array drop — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
  "Cachet/#93490 — resume flattens array+cache_control — DIFFERENT",
  "Stereotype — plugin freshness / version-only stamp — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "The desktop app should not re-initialize a session on a timer",
  "If a permission/model/command refresh is needed, it should not append system/init + system/status to the persistent event log",
  "The transcript loader should keep paging until it finds conversation events, or exclude control/system chatter from the 2,000-event window",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Stop timer re-initialize of an on-screen Remote Control session, or do not append system/init+status on control re-init",
  "Keep paging until user/assistant events, or do not count control/system noise toward the 2,000-event window",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "init-flood",
  "freshet",
  "initialize-cadence",
  "window-drown",
  "no-messages-yet",
  "desktop-poll",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94396,
    title: "fork-resume never becomes Remote Control eligible",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94396 / Brisure is a fork that never appears in the mobile Code tab. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94397,
    title: "Remote Control mobile brief-echo",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94397 / Diptych is a mobile brief-echo. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94451,
    title: "known_marketplaces.json never repaired once invalid",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94451 / Kintsugi is a heal-abort on marketplace rewrite. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94452,
    title: "directory marketplace dead installLocation ENOENT while source.path lives",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #94452 / Cenotaph is a dead installLocation never rewritten. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93490,
    title: "resume flattens array+cache_control",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #93490 / Cachet is a resume flatten. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94496, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94499, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94522, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94520, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94509, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94507, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94547, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94546, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94530, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94516, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
]);

export const SAMPLE_KIND_IDLE = "staff-gauge";
export const SAMPLE_KIND_SEEDED = "init-flood";
export const SAMPLE_HOLDING_IDLE = "floodplain";
export const SAMPLE_HOLDING_SEEDED = "crest-mark";

export const SAMPLE_BUOYED_PROOF = Object.freeze({
  buoyed: true,
  freshet: false,
  initFlood: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_FRESHET_PROOF = Object.freeze({
  buoyed: false,
  freshet: true,
  initFlood: true,
  initializeCadence: true,
  windowDrown: true,
  noMessagesYet: true,
  desktopPoll: true,
  systemInit: true,
  loadEarlier: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  buoyedWatch: { ...SYNTHETIC_BUOYED },
  freshetWatch: { ...SYNTHETIC_FRESHET },
  initFloodShape: { ...SYNTHETIC_INIT_FLOOD },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds buoyed: conversation still findable / messages above the waterline" },
  { t: "init-flood", line: "desktop re-sends initialize every 60s; system/init+status flood the log" },
  { t: "path", line: "init-flood — 2,000-event window is all control noise; plaque No messages yet" },
  { t: "score", line: "when the window drowns the booth is freshet — Score freshet or admit buoyed." },
]);

const FORCE_FLAGS = [
  "initFlood",
  "initializeCadence",
  "windowDrown",
  "noMessagesYet",
  "desktopPoll",
  "systemInit",
  "loadEarlier",
];

const ISSUE_CUE_RE =
  /94430|initialize|get_workspace_diff|system\/init|system\/status|No messages yet|Load earlier|2,000|2000-event|Remote Control|control_request/i;

/**
 * Educational initialize-cadence observer. Not a Claude Code patch.
 * Encodes only the published #94430 shapes.
 *
 * Browser tabs stay quiet. Desktop polls every 60s.
 */
export function observeInitCadence({
  desktop = true,
  intervalSec = INIT_INTERVAL_SEC,
  burst = 3,
  buoyed = false,
} = {}) {
  if (buoyed === true || desktop === false) {
    return {
      desktop: desktop === true,
      intervalSec: desktop === false ? 0 : intervalSec,
      burst: desktop === false ? 0 : burst,
      polling: false,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  return {
    desktop: true,
    intervalSec,
    burst,
    polling: true,
    phrase: "score freshet",
    note: "desktop re-sends initialize every 60s while the session is on screen",
    synthetic: true,
  };
}

/**
 * Educational 2,000-event window. Not a Claude Code patch.
 * HOLD: keep paging until conversation, or exclude control noise.
 */
export function pageTranscriptWindow({
  newest = WINDOW_SIZE,
  pageSize = PAGE_SIZE,
  pages = PAGE_CAP,
  keepPaging = false,
  excludeNoise = false,
  buoyed = false,
} = {}) {
  if (buoyed === true || keepPaging === true || excludeNoise === true) {
    return {
      newest,
      pageSize,
      pages,
      stopped: false,
      phrase: "admit buoyed",
      note: "window still finds conversation above the waterline",
      synthetic: true,
    };
  }
  const drowned = newest >= WINDOW_SIZE && pages <= PAGE_CAP;
  return {
    newest,
    pageSize,
    pages,
    stopped: drowned,
    phrase: drowned ? "score freshet" : "admit buoyed",
    note: drowned
      ? "newest 2,000 events then stop; if they are noise the plaque lies empty"
      : "window still open",
    synthetic: true,
  };
}

/**
 * Educational conversation-drown observer. Not a Claude Code patch.
 * Published: 5,427 noise events after last conversation; 2,000-event window.
 */
export function drownConversation({
  noiseAfter = NOISE_AFTER,
  windowSize = WINDOW_SIZE,
  buoyed = false,
} = {}) {
  if (buoyed === true) {
    return {
      noiseAfter: 0,
      windowSize,
      drowned: false,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  const drowned = noiseAfter >= windowSize;
  return {
    noiseAfter,
    windowSize,
    drowned,
    phrase: drowned ? "score freshet" : "admit buoyed",
    note: drowned
      ? "control/system noise fills the newest 2,000; conversation sits under the flood"
      : "conversation still inside the window",
    synthetic: true,
  };
}

/**
 * Educational desktop-vs-browser poll. Not a Claude Code patch.
 * Published: browser tabs do not poll; only desktop.
 */
export function inspectDesktopPoll({
  desktop = true,
  browserQuiet = true,
  buoyed = false,
} = {}) {
  if (buoyed === true) {
    return {
      desktop: false,
      browserQuiet: true,
      polling: false,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  const polling = desktop === true && browserQuiet === true;
  return {
    desktop: desktop === true,
    browserQuiet: browserQuiet === true,
    polling,
    phrase: polling ? "score freshet" : "admit buoyed",
    note: polling
      ? "only the desktop app polls; a plain browser tab stays quiet"
      : "no desktop timer",
    synthetic: true,
  };
}

/**
 * Educational initialize-rate regression. Not a Claude Code patch.
 * Published: 1.44121.4 ≤20/hr; 1.46388.1 → 120/hr; 1.52386.6 → 180/hr.
 */
export function inspectInitRate({
  build = DESKTOP_152,
  perHour = RATE_152,
  buoyed = false,
} = {}) {
  if (buoyed === true) {
    return {
      build: DESKTOP_141,
      perHour: RATE_141,
      regression: false,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  const regression = perHour > RATE_141;
  return {
    build,
    perHour,
    regression,
    phrase: regression ? "score freshet" : "admit buoyed",
    note: regression
      ? "desktop 1.44121.4 ≤20 init/hr; 1.46388.1 → 120/hr; 1.52386.6 → 180/hr"
      : "cadence still at or under the 1.441 waterline",
    synthetic: true,
  };
}

/**
 * Educational No messages yet plaque. Not a Claude Code patch.
 * Published: plaque while 205 conversation events still exist.
 */
export function inspectNoMessagesPlaque({
  plaque = true,
  conversationOnDisk = true,
  buoyed = false,
} = {}) {
  if (buoyed === true) {
    return {
      plaque: false,
      conversationOnDisk: true,
      lie: false,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  const lie = plaque === true && conversationOnDisk === true;
  return {
    plaque: plaque === true,
    conversationOnDisk: conversationOnDisk === true,
    lie,
    phrase: lie ? "score freshet" : "admit buoyed",
    note: lie
      ? "No messages yet while user/assistant events exist older on disk and server"
      : "plaque matches the bed",
    synthetic: true,
  };
}

/**
 * Educational Load earlier sounding. Not a Claude Code patch.
 * Published: 8 clicks × 500 to surface the conversation.
 */
export function loadEarlierPages({
  clicks = LOAD_CLICKS,
  pageSize = PAGE_SIZE,
  buoyed = false,
} = {}) {
  if (buoyed === true) {
    return {
      clicks: 0,
      pageSize,
      surfaced: true,
      phrase: "admit buoyed",
      synthetic: true,
    };
  }
  const needed = clicks >= LOAD_CLICKS;
  return {
    clicks,
    pageSize,
    surfaced: needed,
    phrase: needed ? "score freshet" : "admit buoyed",
    note: needed
      ? "eight clicks of 500 to surface the conversation under the flood"
      : "conversation already in the first window",
    synthetic: true,
  };
}

export function scoreInitFlood(input = {}) {
  const buoyedHold = input.buoyed === true && input.freshet !== true;
  const cadence = observeInitCadence({
    desktop: !buoyedHold,
    buoyed: buoyedHold,
  });
  const freshet =
    !buoyedHold &&
    (input.freshet === true ||
      input.initFlood === true ||
      input.initializeCadence === true ||
      input.windowDrown === true ||
      input.noMessagesYet === true ||
      input.desktopPoll === true ||
      input.systemInit === true ||
      cadence.polling === true);
  return {
    buoyed: !freshet,
    freshet,
    initFlood: freshet,
    cadence,
    phrase: freshet ? "score freshet" : "admit buoyed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94430") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapFreshet(input = {}) {
  const freshet = isFreshetInput(input);
  const buoyed = input.buoyed === true && !freshet;
  return {
    stamp: freshet ? "init-flood" : "floodplain",
    holdingLane: freshet ? "crest-mark" : "floodplain",
    kindLane: freshet ? "init-flood" : "staff-gauge",
    bindLane: freshet ? "window-drown" : "sounding",
    ribbon: freshet ? "freshet" : "buoyed",
    buoyed,
  };
}

export function inspectInitializeCadence(input = {}) {
  const flagged =
    input.initializeCadence === true ||
    input.freshet === true ||
    isFreshetInput(input);
  if (input.buoyed === true && !flagged) {
    return { stamp: "surfaced", flagged: false, note: "no timer re-initialize; talk stays above stage" };
  }
  return {
    stamp: flagged ? "initialize-cadence" : "gauge-idle",
    flagged,
    note: flagged
      ? "initialize-cadence — desktop re-sends initialize every 60s"
      : "",
  };
}

export function inspectWindowDrown(input = {}) {
  const missed =
    input.windowDrown === true ||
    input.freshet === true ||
    input.initFlood === true ||
    isFreshetInput(input);
  if (input.buoyed === true && !missed) {
    return { stamp: "sounding", missed: false };
  }
  return {
    stamp: missed ? "window-drown" : "window-idle",
    missed,
    note: missed
      ? "window-drown — newest 2,000 events then stop; four pages of 500"
      : "",
  };
}

export function inspectNoMessagesYet(input = {}) {
  const flagged =
    input.noMessagesYet === true ||
    input.freshet === true ||
    isFreshetInput(input);
  if (input.buoyed === true && !flagged) {
    return { stamp: "charted", flagged: false };
  }
  return {
    stamp: flagged ? "no-messages-yet" : "plaque-idle",
    flagged,
    note: flagged
      ? "no-messages-yet — plaque while conversation sits under the flood"
      : "",
  };
}

export function inspectDesktopOnly(input = {}) {
  const flagged =
    input.desktopPoll === true ||
    input.freshet === true ||
    isFreshetInput(input);
  if (input.buoyed === true && !flagged) {
    return { stamp: "staff-gauge", flagged: false };
  }
  return {
    stamp: flagged ? "desktop-poll" : "browser-idle",
    flagged,
    note: flagged
      ? "desktop-poll — only the desktop app polls; browser tabs stay quiet"
      : "",
  };
}

export function inspectSystemInit(input = {}) {
  const flagged =
    input.systemInit === true ||
    input.loadEarlier === true ||
    input.freshet === true ||
    isFreshetInput(input);
  if (input.buoyed === true && !flagged) {
    return { stamp: "surfaced", flagged: false };
  }
  return {
    stamp: flagged ? "system-init" : "spool-idle",
    flagged,
    note: flagged
      ? "system-init — CLI appends system/init + system/status on each control re-init"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "staff-gauge": input.freshet || input.initFlood,
    "crest-mark": input.freshet || input.initFlood || input.initializeCadence,
    "event-spool": input.systemInit || input.freshet,
    "window-viewport": input.windowDrown || input.freshet,
    "no-messages-plaque": input.noMessagesYet || input.freshet,
    "load-earlier": input.loadEarlier || input.desktopPoll || input.freshet,
  };
  return (
    map[id] === true ||
    input.initFlood === true ||
    input.freshet === true
  );
}

function isFreshetInput(input = {}) {
  return (
    input.freshet === true ||
    input.initFlood === true ||
    input.initializeCadence === true ||
    input.windowDrown === true ||
    input.noMessagesYet === true ||
    input.desktopPoll === true ||
    input.systemInit === true ||
    input.loadEarlier === true
  );
}

export function readBooth(input = {}) {
  const freshet = isFreshetInput(input);
  const buoyed = input.buoyed === true && !freshet;
  return {
    mark: freshet ? "freshet" : "buoyed",
    buoyed,
    freshet,
    initFlood: input.initFlood === true || freshet,
    initializeCadence: input.initializeCadence === true,
    windowDrown: input.windowDrown === true,
    noMessagesYet: input.noMessagesYet === true,
    desktopPoll: input.desktopPoll === true,
    systemInit: input.systemInit === true,
    loadEarlier: input.loadEarlier === true,
    post: mapFreshet(input),
    cadence: inspectInitializeCadence(input),
    window: inspectWindowDrown(input),
    plaque: inspectNoMessagesYet(input),
    desktop: inspectDesktopOnly(input),
    spool: inspectSystemInit(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const FRESHET_WALK = Object.freeze([
  {
    t: "idle",
    event: "floodplain",
    buoyed: true,
    freshet: false,
    cue: "buoyed",
    note: "idle HOLD: conversation still findable / messages above the waterline",
  },
  {
    t: "init-flood",
    event: "init-flood",
    freshet: true,
    initFlood: true,
    initializeCadence: true,
    desktopPoll: true,
    cue: "freshet",
    note: "desktop re-sends initialize every 60s; system/init+status flood the log",
  },
  {
    t: "path",
    event: "init-flood",
    freshet: true,
    initFlood: true,
    initializeCadence: true,
    windowDrown: true,
    noMessagesYet: true,
    desktopPoll: true,
    systemInit: true,
    loadEarlier: true,
    cue: "freshet",
    note: "init-flood — 2,000-event window is all control noise; plaque No messages yet",
  },
  {
    t: "score",
    event: "freshet",
    freshet: true,
    initFlood: true,
    initializeCadence: true,
    windowDrown: true,
    noMessagesYet: true,
    desktopPoll: true,
    systemInit: true,
    loadEarlier: true,
    cue: "freshet",
    note: "freshet — the flood-crest drowned the window; conversation sits under the floodplain",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "floodplain",
    buoyed: true,
    freshet: false,
    cue: "buoyed",
    note: "positive control: conversation still findable above the waterline",
  },
  {
    t: "admit",
    event: "floodplain",
    buoyed: true,
    cue: "buoyed",
    note: "positive control: the gauge admits buoyed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    buoyed: true,
    freshet: false,
    initFlood: false,
    cue: "buoyed",
  };
}

export function seedBuoyed() {
  return { ...emptyTicket() };
}

export function seedFreshet() {
  return {
    seed: SEEDED_WORD,
    buoyed: false,
    freshet: true,
    initFlood: true,
    initializeCadence: true,
    windowDrown: true,
    noMessagesYet: true,
    desktopPoll: true,
    systemInit: true,
    loadEarlier: true,
    cue: "freshet",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_FRESHET_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    freshet: true,
    initFlood: true,
    cue: "freshet",
  };
}

export function seedInitFlood() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    freshet: true,
    initFlood: true,
    event: "init-flood",
    cue: "freshet",
  };
}

export function seedSurfaced() {
  return { seed: "surfaced", preferSeed: true, buoyed: true, cue: "buoyed" };
}

export function seedCharted() {
  return { seed: "charted", preferSeed: true, buoyed: true, cue: "buoyed" };
}

export function seedSounding() {
  return { seed: "sounding", preferSeed: true, buoyed: true, cue: "buoyed" };
}

export function seedInitializeCadence() {
  return {
    seed: "initialize-cadence",
    preferSeed: true,
    initializeCadence: true,
    cue: "freshet",
  };
}

export function seedWindowDrown() {
  return {
    seed: "window-drown",
    preferSeed: true,
    windowDrown: true,
    cue: "freshet",
  };
}

export function seedNoMessagesYet() {
  return {
    seed: "no-messages-yet",
    preferSeed: true,
    noMessagesYet: true,
    cue: "freshet",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      buoyed: false,
      freshet: false,
      initFlood: false,
      initializeCadence: false,
      windowDrown: false,
      noMessagesYet: false,
      desktopPoll: false,
      systemInit: false,
      loadEarlier: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    buoyed: raw.buoyed === true,
    freshet: raw.freshet === true || raw.event === "freshet",
    initFlood: raw.initFlood === true || raw.event === "init-flood",
    initializeCadence: raw.initializeCadence === true || raw.event === "initialize-cadence",
    windowDrown: raw.windowDrown === true || raw.event === "window-drown",
    noMessagesYet: raw.noMessagesYet === true || raw.event === "no-messages-yet",
    desktopPoll: raw.desktopPoll === true || raw.event === "desktop-poll",
    systemInit: raw.systemInit === true || raw.event === "system-init",
    loadEarlier: raw.loadEarlier === true || raw.event === "load-earlier",
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
      (ticket.buoyed != null ||
        ticket.freshet != null ||
        ticket.initFlood != null ||
        ticket.initializeCadence != null ||
        ticket.windowDrown != null ||
        ticket.noMessagesYet != null ||
        ticket.desktopPoll != null ||
        ticket.systemInit != null ||
        ticket.loadEarlier != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isBuoyed(row) {
  if (row.freshet && row.cue !== "buoyed") return false;
  if (row.cue === "freshet" || row.cue === "init-flood") return false;
  if (
    row.initFlood &&
    row.desktopPoll &&
    row.cue !== "buoyed" &&
    row.buoyed !== true
  ) {
    return false;
  }
  if (
    row.buoyed === true &&
    row.freshet !== true &&
    row.cue !== "freshet"
  ) {
    return true;
  }
  if (
    row.cue === "buoyed" &&
    row.freshet !== true &&
    row.initFlood !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isInitFlood(row) {
  return (
    row.event === "init-flood" &&
    !isBuoyed(row) &&
    (row.initFlood === true ||
      row.desktopPoll === true ||
      row.freshet === true)
  );
}

function isFreshetRow(row) {
  if (isBuoyed(row)) return false;
  if (isInitFlood(row) && row.cue !== "freshet") return false;
  if (row.cue === "freshet") return true;
  if (row.freshet === true) return true;
  if (row.initFlood === true && row.desktopPoll === true) return true;
  if (
    row.initFlood === true ||
    row.initializeCadence === true ||
    row.windowDrown === true ||
    row.noMessagesYet === true ||
    row.desktopPoll === true ||
    row.systemInit === true ||
    row.loadEarlier === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one freshet pass against the staff gauge.
 * buoyed: conversation still findable / messages above the waterline.
 * freshet: initialize flood drowned the 2,000-event window.
 * init-flood: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isInitFlood(row) ||
    (row.initFlood && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "init-flood";
  } else if (isFreshetRow(row)) {
    verdict = "freshet";
  } else if (isBuoyed(row)) {
    verdict = "buoyed";
  } else if (
    row.initFlood ||
    row.initializeCadence ||
    row.windowDrown ||
    row.noMessagesYet ||
    row.desktopPoll ||
    row.systemInit ||
    row.loadEarlier
  ) {
    verdict = "freshet";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "freshet";
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
    buoyed: verdict === "buoyed",
    freshet: verdict === "freshet" || verdict === SEEDED_WORD,
    initFlood:
      row.initFlood === true ||
      verdict === "init-flood" ||
      verdict === PATH_WORD,
    initializeCadence: row.initializeCadence,
    windowDrown: row.windowDrown,
    noMessagesYet: row.noMessagesYet,
    desktopPoll: row.desktopPoll,
    systemInit: row.systemInit,
    loadEarlier: row.loadEarlier,
    cue: hold
      ? "buoyed"
      : row.initFlood || verdict === "init-flood"
        ? "init-flood"
        : "freshet",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit buoyed" : "score freshet",
    cadenceInspect: inspectInitializeCadence(row),
    windowInspect: inspectWindowDrown(row),
    plaqueInspect: inspectNoMessagesYet(row),
    desktopInspect: inspectDesktopOnly(row),
    spoolInspect: inspectSystemInit(row),
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
      : FRESHET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "freshet");
  const path = scored.filter((row) => row.verdict === "init-flood");
  const buoyed = scored.filter((row) => row.verdict === "buoyed");
  const headline =
    scored.find((row) => row.event === "freshet") ||
    scored.find((row) => row.event === "init-flood") ||
    scored.find((row) => row.event === "window-drown") ||
    charged[charged.length - 1];
  let verdict = "buoyed";
  if (charged.length) verdict = "freshet";
  else if (path.length && !buoyed.length) {
    verdict = "init-flood";
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
    freshetCount: charged.length,
    pathCount: path.length,
    buoyedCount: buoyed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit buoyed" : "score freshet",
    note: headline
      ? "Desktop app re-sends initialize + get_workspace_diff to an on-screen Remote Control session every 60 s; the system/init+status flood pushes the conversation past the 2,000-event window the transcript loader reads, so the session opens as No messages yet. Cite-only cousins #94396 #94397 #94451 #94452 #93490."
      : "published freshet walk scored against buoyed vs freshet",
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
    seeded !== "buoyed" &&
    seeded !== "freshet" &&
    seeded !== "init-flood" &&
    ticket.buoyed == null &&
    ticket.freshet == null &&
    ticket.initFlood == null &&
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
    buoyed: scored.buoyed ?? false,
    freshet: scored.freshet ?? false,
    initFlood: scored.initFlood ?? false,
    initializeCadence: scored.initializeCadence ?? false,
    windowDrown: scored.windowDrown ?? false,
    noMessagesYet: scored.noMessagesYet ?? false,
    desktopPoll: scored.desktopPoll ?? false,
    systemInit: scored.systemInit ?? false,
    loadEarlier: scored.loadEarlier ?? false,
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
    result.initFlood || result.freshet
      ? "kind=init-flood"
      : "kind=staff-gauge",
    result.desktopPoll || result.freshet
      ? "ref=initialize-cadence"
      : "ref=floodplain",
    result.initFlood || result.verdict === "init-flood"
      ? "path=init-flood"
      : "path=buoyed",
    result.cue === "buoyed"
      ? "cue=buoyed"
      : result.cue === "init-flood"
        ? "cue=init-flood"
        : "cue=freshet",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    buoyed: result.buoyed,
    freshet: result.freshet,
    initFlood: result.initFlood,
    initializeCadence: result.initializeCadence,
    windowDrown: result.windowDrown,
    noMessagesYet: result.noMessagesYet,
    desktopPoll: result.desktopPoll,
    systemInit: result.systemInit,
    loadEarlier: result.loadEarlier,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cadence: inspectInitializeCadence({
      buoyed: result.buoyed,
      freshet: result.freshet,
      initializeCadence: result.initializeCadence,
    }),
    window: inspectWindowDrown({
      buoyed: result.buoyed,
      freshet: result.freshet,
      windowDrown: result.windowDrown,
    }),
    plaque: inspectNoMessagesYet({
      buoyed: result.buoyed,
      freshet: result.freshet,
      noMessagesYet: result.noMessagesYet,
    }),
    desktop: inspectDesktopOnly({
      buoyed: result.buoyed,
      freshet: result.freshet,
      desktopPoll: result.desktopPoll,
    }),
    spool: inspectSystemInit({
      buoyed: result.buoyed,
      freshet: result.freshet,
      systemInit: result.systemInit,
    }),
    post: mapFreshet({
      buoyed: result.buoyed,
      freshet: result.freshet,
      initFlood: result.initFlood,
      desktopPoll: result.desktopPoll,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      freshet: result.freshet === true || result.verdict === "freshet",
    })),
    leakPath: scoreInitFlood({
      buoyed: result.buoyed === true && !result.freshet,
      freshet: result.freshet,
      initFlood: result.initFlood,
      initializeCadence: result.initializeCadence,
      desktopPoll: result.desktopPoll,
      windowDrown: result.windowDrown,
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
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): either stop timer re-initialize, or do not append system/init+status on control re-init, or keep paging until conversation events / exclude control noise from the window. Invite verify against #94430 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
