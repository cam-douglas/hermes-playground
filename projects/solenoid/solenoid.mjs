#!/usr/bin/env node
/**
 * Solenoid — industrial switchgear / solenoid-coil atelier booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop Settings toggle "Enable Remote Control for all sessions"
 * flips visually but does nothing — new local sessions still lack RC
 * by default. Only a direct edit of ~/.claude/settings.json with
 * remoteControlAtStartup: true + remoteControlEnabled: true works.
 * Even then, RC does NOT arm at session warm/focus/PTY start — only
 * after the first sendMessage (~28s later in the published log).
 * Mobile: Windows asleep sessions show "disconnected"; Mac idle
 * (RC not yet active) sessions are absent until first message, then
 * appear "connected".
 *
 *   node solenoid.mjs data/inert.json
 *   echo '{"seed":"inert"}' | node solenoid.mjs
 *
 * Idle word is engaged (HOLD: RC bridge arms at session warm/focus,
 * before any message).
 * Seeded word is inert (#93754 — toggle/settings present but coil
 * does not pull until first message).
 * Path word is warm-before-message.
 * Product score word is solenoid (Score solenoid or admit engaged.).
 *
 * Encoded from anthropics/claude-code#93754 issue text only.
 * Hypothesis (NON-BINDING): Settings UI writes a different key than
 * remoteControlAtStartup, and WarmLifecycle never calls the RC enable
 * path that sendMessage does. Verify against #93754 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "engaged",
  "inert",
  "solenoid",
  "warm-before-message",
  "hold",
  "armed",
  "coil-pulled",
  "bridge-ready",
  "warm-armed",
  "toggle-fidelity",
  "first-message-arm",
  "mac-absent",
  "win-disconnected",
  "settings-json",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "engaged";
export const PATH_WORD = "warm-before-message";
export const SEEDED_WORD = "inert";
export const PRODUCT_WORD = "solenoid";
export const HOLD = Object.freeze(["engaged", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "engaged",
  "armed",
  "coil-pulled",
  "bridge-ready",
  "warm-armed",
]);
export const RECOVER = Object.freeze(["engaged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "inert" && name !== "solenoid"),
);

export const FEATURED_ISSUE = 93754;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93754";
export const TITLE =
  'Desktop app (macOS): "Enable remote control by default" Settings toggle flips but has no effect, and remoteControlAtStartup only takes effect on first message, not session open';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "Desktop macOS 15.7.7 (24G720)";
export const GOOD_VERSION =
  "RC bridge arms at WarmLifecycle / setFocusedSession / startShellPty — before any sendMessage";
export const SURFACE = "desktop-settings-rc";
export const HOST = "macos-desktop";
export const INSTALL_PATH = "~/.claude/settings.json";
export const COMMAND =
  "flip Enable Remote Control for all sessions; open a local session; watch WarmLifecycle with no RC until first sendMessage";
export const PHRASE = "Score solenoid or admit engaged.";
export const DISTRIBUTION =
  "Claude Desktop, macOS 15.7.7 (24G720), Code tab, interactive (non-headless) local session. Settings panel has an \"Enable Remote Control for all sessions\" switch; flipping it on produces no change — new local sessions still do not get Remote Control by default. The only way to actually enable it was editing ~/.claude/settings.json directly with remoteControlAtStartup: true and remoteControlEnabled: true. Even with those keys set, opening/warming a local session does not trigger auto-connect — it only activates once the first message is sent. Published main.log: 21:21:22 WarmLifecycle:preview Warming up session; 21:21:22 CCD LocalSessions.setFocusedSession; 21:21:22 LocalSessions.startShellPty — no Remote Control activity — then 21:21:50 LocalSessions.sendMessage; Enabling remote control; bridge_state ready then connected. No manual toggle in the ~28s gap. Comparison via Claude iOS: Windows PC asleep sessions still appear as \"disconnected\"; Mac idle (RC not yet active) sessions do not appear at all until a message is sent, then appear as \"connected\" with no disconnected placeholder.";
export const RULED_OUT = Object.freeze([
  "Missing settings.json keys — direct edit of remoteControlAtStartup + remoteControlEnabled does enable RC after first message",
  "A missing Settings toggle — the switch exists and flips visually",
  "Total Remote Control failure — after first sendMessage the bridge goes ready then connected",
]);
export const EXPECTED = Object.freeze([
  "Flipping Enable Remote Control for all sessions in Settings should have the same effect as setting remoteControlAtStartup / remoteControlEnabled in settings.json",
  "A session should register for Remote Control at start rather than waiting for the first message",
  "Dormant/inactive sessions should be represented consistently across platforms on the mobile client (either both show a disconnected placeholder, or neither does)",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "coil-plunger", label: "solenoid coil", count: "atelier", note: "industrial switchgear coil/plunger — not limestone, newsprint, or copy-desk" },
  { id: "toggle-rail", label: "Settings vs json", count: "fidelity", note: "toggle flips visually; only ~/.claude/settings.json keys actually arm" },
  { id: "warm-gap", label: "warm→message gap", count: "~28s", note: "WarmLifecycle + setFocusedSession + startShellPty with no RC until sendMessage" },
  { id: "mobile-chips", label: "mobile chips", count: "Mac-absent / Win-disconnected", note: "Mac idle sessions absent; Windows asleep sessions show disconnected" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "engaged-gate",
    survey: "RC bridge arms at session warm/focus, before any message",
    kind: "engaged",
    note: "idle: the coil pulls at warm — the hold/good path",
  },
  {
    id: "toggle-fidelity",
    survey: "Settings toggle flips visually; new local sessions still lack RC by default",
    kind: "inert",
    note: "seeded: switchgear looks thrown; coil does not pull from the toggle",
  },
  {
    id: "first-message-arm",
    survey: "Even with settings.json keys set, RC enables only after the first sendMessage",
    kind: "inert",
    note: "seeded: WarmLifecycle / focus / PTY with no RC; ~28s later sendMessage then Enabling remote control",
  },
  {
    id: "mobile-gap",
    survey: "Windows asleep shows disconnected; Mac idle (RC not yet active) is absent until first message then connected",
    kind: "inert",
    note: "seeded: same unarmed coil, two mobile representations",
  },
  {
    id: "warm-before-message",
    survey: "arm-at-warm vs arm-at-first-message — WarmLifecycle never calls the RC enable path sendMessage does",
    kind: "inert",
    note: "path: warm-before-message names the gap between PTY start and first message",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "warm-before-message",
  "inert",
  "toggle-fidelity",
  "first-message-arm",
  "mac-absent",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84502,
    title: "same setting failing to connect at session start, for headless Code-tab subprocesses on Windows",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — timing evidence (delay until first message) may generalize; do not re-ship",
  },
  {
    issue: 48949,
    title: "desktop app not honoring remoteControlAtStartup",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — same broken-toggle theme; do not re-ship",
  },
  {
    issue: 90768,
    title: "related UI/setting-fidelity gap for the same toggle",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Settings toggle fidelity; do not re-ship",
  },
  {
    issue: 84994,
    title: "local sessions unreachable from mobile unless the desktop app keeps them running",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — cross-platform visibility gap; do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
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

export const SAMPLE_ENGAGED_ATELIER = Object.freeze({
  coilPulled: true,
  plungerIn: true,
  rcAtWarm: true,
  toggleWritesKeys: true,
  firstMessageRequired: false,
  version: GOOD_VERSION,
});

export const SAMPLE_INERT_ATELIER = Object.freeze({
  coilPulled: false,
  plungerIn: false,
  coilLooksEnergized: true,
  rcAtWarm: false,
  toggleWritesKeys: false,
  firstMessageRequired: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_TOGGLE_DEAD = Object.freeze({
  toggleVisible: true,
  toggleFlips: true,
  newSessionsGetRc: false,
  writesRemoteControlAtStartup: false,
});

export const SAMPLE_TOGGLE_LIVE = Object.freeze({
  toggleVisible: true,
  toggleFlips: true,
  newSessionsGetRc: true,
  writesRemoteControlAtStartup: true,
});

export const SAMPLE_WARM_GAP = Object.freeze({
  warmLifecycle: true,
  setFocusedSession: true,
  startShellPty: true,
  rcAtWarm: false,
  gapSeconds: 28,
  firstMessageThenRc: true,
});

export const SAMPLE_WARM_ARMED = Object.freeze({
  warmLifecycle: true,
  setFocusedSession: true,
  startShellPty: true,
  rcAtWarm: true,
  gapSeconds: 0,
  firstMessageThenRc: false,
});

export const SAMPLE_SETTINGS_JSON = Object.freeze({
  remoteControlAtStartup: true,
  remoteControlEnabled: true,
  path: "~/.claude/settings.json",
  directEditWorks: true,
  toggleEquivalent: false,
});

export const SAMPLE_ENGAGED_KEYS = Object.freeze({
  remoteControlAtStartup: true,
  remoteControlEnabled: true,
  path: "~/.claude/settings.json",
  directEditWorks: true,
  toggleEquivalent: true,
});

export const SAMPLE_MOBILE_GAP = Object.freeze({
  macAbsentUntilMessage: true,
  winDisconnectedWhileAsleep: true,
  macThenConnected: true,
  consistentPlaceholder: false,
});

export const SAMPLE_MOBILE_CONSISTENT = Object.freeze({
  macAbsentUntilMessage: false,
  winDisconnectedWhileAsleep: true,
  macThenConnected: false,
  consistentPlaceholder: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds engaged: RC bridge arms at session warm/focus, before any message" },
  { t: "toggle-fidelity", line: "Settings toggle Enable Remote Control for all sessions flips visually; new local sessions still lack RC" },
  { t: "settings-json", line: "direct ~/.claude/settings.json edit with remoteControlAtStartup + remoteControlEnabled is the only write that sticks" },
  { t: "first-message-arm", line: "WarmLifecycle + setFocusedSession + startShellPty with no RC; ~28s later sendMessage then Enabling remote control" },
  { t: "path", line: "warm-before-message — arm-at-warm vs arm-at-first-message; WarmLifecycle never calls the RC enable path sendMessage does" },
  { t: "score", line: "when the coil looks energized but the plunger stays out until first message the booth is solenoid — Score solenoid or admit engaged." },
]);

export function inspectToggleFidelity(input = {}) {
  const toggle =
    input.toggle && typeof input.toggle === "object"
      ? input.toggle
      : input.engaged === true && input.inert !== true
        ? SAMPLE_TOGGLE_LIVE
        : SAMPLE_TOGGLE_DEAD;
  const forced =
    input.toggleFidelity === true ||
    input.event === "toggle-fidelity" ||
    input.event === "inert" ||
    input.event === "solenoid" ||
    input.inert === true;
  const dead = forced ? true : toggle.newSessionsGetRc !== true && input.engaged !== true;
  return {
    toggleFlips: true,
    newSessionsGetRc: !dead,
    writesRemoteControlAtStartup: !dead,
    stamp: dead ? "toggle-fidelity" : "toggle-live",
    note: dead
      ? "Settings toggle flips visually; new local sessions still lack RC by default"
      : "Settings toggle writes remoteControlAtStartup / remoteControlEnabled; new sessions get RC",
  };
}

export function inspectWarmGap(input = {}) {
  const gap =
    input.gap && typeof input.gap === "object"
      ? input.gap
      : input.engaged === true && input.inert !== true
        ? SAMPLE_WARM_ARMED
        : SAMPLE_WARM_GAP;
  const forced =
    input.firstMessageArm === true ||
    input.event === "first-message-arm" ||
    input.event === "inert" ||
    input.event === "solenoid" ||
    input.inert === true;
  const late = forced ? true : gap.rcAtWarm !== true && input.engaged !== true;
  return {
    warmLifecycle: true,
    setFocusedSession: true,
    startShellPty: true,
    rcAtWarm: !late,
    gapSeconds: late ? gap.gapSeconds || 28 : 0,
    stamp: late ? "first-message-arm" : "warm-armed",
    note: late
      ? "WarmLifecycle + focus + PTY with no RC; first sendMessage then Enabling remote control"
      : "RC arms at WarmLifecycle / setFocusedSession / startShellPty — before any message",
  };
}

export function inspectSettingsJson(input = {}) {
  const keys =
    input.keys && typeof input.keys === "object"
      ? input.keys
      : input.engaged === true && input.inert !== true
        ? SAMPLE_ENGAGED_KEYS
        : SAMPLE_SETTINGS_JSON;
  const forced =
    input.settingsJson === true ||
    input.event === "settings-json" ||
    input.event === "inert" ||
    input.event === "solenoid";
  const fileOnly = forced ? true : keys.toggleEquivalent !== true && input.engaged !== true;
  return {
    remoteControlAtStartup: true,
    remoteControlEnabled: true,
    path: "~/.claude/settings.json",
    directEditWorks: true,
    toggleEquivalent: !fileOnly,
    stamp: fileOnly ? "settings-json" : "toggle-equivalent",
    note: fileOnly
      ? "direct settings.json edit works; Settings toggle is not equivalent"
      : "Settings toggle and settings.json write the same keys",
  };
}

export function inspectMobileGap(input = {}) {
  const mobile =
    input.mobile && typeof input.mobile === "object"
      ? input.mobile
      : input.engaged === true && input.inert !== true
        ? SAMPLE_MOBILE_CONSISTENT
        : SAMPLE_MOBILE_GAP;
  const forced =
    input.macAbsent === true ||
    input.event === "mac-absent" ||
    input.event === "win-disconnected" ||
    input.event === "inert" ||
    input.event === "solenoid";
  const split = forced ? true : mobile.consistentPlaceholder !== true && input.engaged !== true;
  return {
    macAbsentUntilMessage: split,
    winDisconnectedWhileAsleep: true,
    consistentPlaceholder: !split,
    stamp: split ? "mac-absent" : "mobile-consistent",
    note: split
      ? "Mac idle sessions absent until first message then connected; Windows asleep shows disconnected"
      : "dormant sessions represented consistently across platforms on mobile",
  };
}

export function readBooth(input = {}) {
  const toggle = inspectToggleFidelity(input);
  const warm = inspectWarmGap(input);
  const keys = inspectSettingsJson(input);
  const mobile = inspectMobileGap(input);
  const inert =
    input.engaged !== true &&
    ((toggle.newSessionsGetRc === false && warm.rcAtWarm === false) ||
      input.inert === true);
  const engaged =
    input.engaged === true && inert !== true && warm.rcAtWarm === true;
  const path =
    (input.event === "warm-before-message" || input.warmBeforeMessage === true) &&
    (warm.rcAtWarm === false || input.inert === true);
  return {
    toggle,
    warm,
    keys,
    mobile,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    inert: inert && !engaged && !path,
    engaged: engaged || (!inert && !path && input.inert !== true && input.warmBeforeMessage !== true && warm.rcAtWarm !== false),
    warmBeforeMessage: path && !engaged,
    mark:
      path && !engaged
        ? "warm-before-message"
        : inert && !engaged
          ? "inert"
          : "engaged",
  };
}

/**
 * Published solenoid walk from #93754 only. Facts from the issue text.
 * An engaged booth arms RC at session warm/focus, before any message.
 * An inert booth leaves the coil looking energized while the plunger
 * stays out until first sendMessage.
 * A warm-before-message booth names that path.
 */
export const SOLENOID_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-engaged",
    engaged: true,
    inert: false,
    cue: "engaged",
    note: "idle HOLD: RC bridge arms at session warm/focus, before any message — the hold/good path",
  },
  {
    t: "toggle-fidelity",
    event: "toggle-fidelity",
    inert: true,
    toggleFidelity: true,
    cue: "inert",
    note: "Settings toggle flips visually; new local sessions still lack RC by default",
  },
  {
    t: "settings-json",
    event: "settings-json",
    inert: true,
    settingsJson: true,
    cue: "inert",
    note: "direct ~/.claude/settings.json edit with remoteControlAtStartup + remoteControlEnabled is the only write that sticks",
  },
  {
    t: "first-message-arm",
    event: "first-message-arm",
    inert: true,
    firstMessageArm: true,
    cue: "inert",
    note: "WarmLifecycle + focus + PTY with no RC; ~28s later sendMessage then Enabling remote control",
  },
  {
    t: "path",
    event: "warm-before-message",
    inert: true,
    warmBeforeMessage: true,
    firstMessageArm: true,
    cue: "inert",
    note: "warm-before-message — arm-at-warm vs arm-at-first-message",
  },
  {
    t: "score",
    event: "solenoid",
    inert: true,
    warmBeforeMessage: true,
    toggleFidelity: true,
    firstMessageArm: true,
    settingsJson: true,
    cue: "inert",
    note: "solenoid — when the coil looks energized but the plunger stays out until first message the booth never stays engaged",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-engaged",
    engaged: true,
    inert: false,
    cue: "engaged",
    note: "positive control: RC arms at warm/focus; plunger in",
  },
  {
    t: "announce",
    event: "cue-engaged",
    engaged: true,
    cue: "engaged",
    note: "positive control: the coil stays engaged",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    engaged: true,
    inert: false,
    warmBeforeMessage: false,
    cue: "engaged",
  };
}

export function seedEngaged() {
  return { ...emptyTicket() };
}

export function seedInert() {
  return {
    seed: SEEDED_WORD,
    engaged: false,
    inert: true,
    warmBeforeMessage: true,
    toggleFidelity: true,
    firstMessageArm: true,
    settingsJson: true,
    macAbsent: true,
    engagedSurface: false,
    cue: "inert",
    issue: FEATURED_ISSUE,
    toggle: SAMPLE_TOGGLE_DEAD,
    gap: SAMPLE_WARM_GAP,
    keys: SAMPLE_SETTINGS_JSON,
    mobile: SAMPLE_MOBILE_GAP,
  };
}

export function seedSolenoid() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    inert: true,
    warmBeforeMessage: true,
    toggleFidelity: true,
    firstMessageArm: true,
    settingsJson: true,
    cue: "inert",
  };
}

export function seedWarmBeforeMessage() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    inert: true,
    warmBeforeMessage: true,
    firstMessageArm: true,
    event: "warm-before-message",
    cue: "inert",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    engaged: true,
    cue: "engaged",
  };
}

export function seedToggleFidelity() {
  return {
    seed: "toggle-fidelity",
    preferSeed: true,
    toggleFidelity: true,
    cue: "inert",
  };
}

export function seedFirstMessageArm() {
  return {
    seed: "first-message-arm",
    preferSeed: true,
    firstMessageArm: true,
    cue: "inert",
  };
}

export function seedSettingsJson() {
  return {
    seed: "settings-json",
    preferSeed: true,
    settingsJson: true,
    cue: "inert",
  };
}

export function seedArmed() {
  return {
    seed: "armed",
    preferSeed: true,
    engaged: true,
    cue: "engaged",
  };
}

export function seedCoilPulled() {
  return {
    seed: "coil-pulled",
    preferSeed: true,
    engaged: true,
    cue: "engaged",
  };
}

export function seedBridgeReady() {
  return {
    seed: "bridge-ready",
    preferSeed: true,
    engaged: true,
    cue: "engaged",
  };
}

export function seedWarmArmed() {
  return {
    seed: "warm-armed",
    preferSeed: true,
    engaged: true,
    cue: "engaged",
  };
}

export function seedMacAbsent() {
  return {
    seed: "mac-absent",
    preferSeed: true,
    macAbsent: true,
    cue: "inert",
  };
}

export function seedWinDisconnected() {
  return {
    seed: "win-disconnected",
    preferSeed: true,
    winDisconnected: true,
    cue: "inert",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      engaged: false,
      inert: false,
      warmBeforeMessage: false,
      toggleFidelity: false,
      firstMessageArm: false,
      settingsJson: false,
      macAbsent: false,
      winDisconnected: false,
      engagedSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    engaged: raw.engaged === true,
    inert:
      raw.inert === true ||
      raw.event === "inert" ||
      raw.event === "solenoid",
    warmBeforeMessage:
      raw.warmBeforeMessage === true || raw.event === "warm-before-message",
    toggleFidelity: raw.toggleFidelity === true || raw.event === "toggle-fidelity",
    firstMessageArm: raw.firstMessageArm === true || raw.event === "first-message-arm",
    settingsJson: raw.settingsJson === true || raw.event === "settings-json",
    macAbsent: raw.macAbsent === true || raw.event === "mac-absent",
    winDisconnected: raw.winDisconnected === true || raw.event === "win-disconnected",
    engagedSurface: raw.engagedSurface === true || raw.event === "armed",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    toggle: raw.toggle,
    gap: raw.gap,
    keys: raw.keys,
    mobile: raw.mobile,
    atelier: raw.atelier,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.engaged != null ||
        ticket.inert != null ||
        ticket.warmBeforeMessage != null ||
        ticket.toggleFidelity != null ||
        ticket.firstMessageArm != null ||
        ticket.settingsJson != null ||
        ticket.macAbsent != null ||
        ticket.winDisconnected != null ||
        ticket.engagedSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.toggle ||
        ticket.gap ||
        ticket.keys ||
        ticket.mobile),
  );
}

function isEngaged(row) {
  if (row.inert && row.cue !== "engaged") return false;
  if (
    row.cue === "inert" ||
    row.cue === "solenoid" ||
    row.cue === "warm-before-message"
  ) {
    return false;
  }
  if (
    row.warmBeforeMessage &&
    row.firstMessageArm &&
    row.cue !== "engaged" &&
    row.engaged !== true
  ) {
    return false;
  }
  if (
    row.warmBeforeMessage &&
    row.toggleFidelity &&
    row.cue !== "engaged" &&
    row.engaged !== true
  ) {
    return false;
  }
  if (row.engaged === true && row.inert !== true && row.cue !== "inert") {
    return true;
  }
  if (
    row.cue === "engaged" &&
    row.inert !== true &&
    row.warmBeforeMessage !== true &&
    row.toggleFidelity !== true &&
    row.firstMessageArm !== true
  ) {
    return true;
  }
  return false;
}

function isWarmBeforeMessagePath(row) {
  return (
    row.event === "warm-before-message" &&
    !isEngaged(row) &&
    (row.warmBeforeMessage === true ||
      row.firstMessageArm === true ||
      row.toggleFidelity === true)
  );
}

function isInert(row) {
  if (isEngaged(row)) return false;
  if (isWarmBeforeMessagePath(row) && row.cue !== "inert") return false;
  if (row.cue === "inert" || row.cue === "solenoid") return true;
  if (row.inert === true) return true;
  if (
    row.warmBeforeMessage === true &&
    row.firstMessageArm === true &&
    row.toggleFidelity === true
  ) {
    return true;
  }
  if (row.warmBeforeMessage === true && row.firstMessageArm === true) {
    return true;
  }
  if (
    row.toggleFidelity === true ||
    row.firstMessageArm === true ||
    row.settingsJson === true ||
    (row.warmBeforeMessage === true && row.toggleFidelity === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one solenoid pass against the switchgear atelier.
 * engaged: RC bridge arms at session warm/focus, before any message.
 * inert / solenoid: toggle/settings present but coil does not pull until first message.
 * warm-before-message: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isWarmBeforeMessagePath(row) ||
    (row.warmBeforeMessage && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "warm-before-message";
  } else if (isInert(row)) {
    verdict = "solenoid";
  } else if (isEngaged(row)) {
    verdict = "engaged";
  } else if (
    row.warmBeforeMessage ||
    row.toggleFidelity ||
    row.firstMessageArm ||
    (row.settingsJson && !row.engaged)
  ) {
    verdict = "solenoid";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const toggle = inspectToggleFidelity(row);
  const warm = inspectWarmGap(row);
  const keys = inspectSettingsJson(row);
  const mobile = inspectMobileGap(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    engaged: verdict === "engaged" || verdict === "hold",
    inert:
      verdict === "inert" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    warmBeforeMessage:
      row.warmBeforeMessage === true ||
      verdict === "warm-before-message" ||
      verdict === PATH_WORD,
    toggleFidelity: row.toggleFidelity,
    firstMessageArm: row.firstMessageArm,
    settingsJson: row.settingsJson,
    macAbsent: row.macAbsent,
    winDisconnected: row.winDisconnected,
    engagedSurface: row.engagedSurface,
    cue: hold
      ? "engaged"
      : row.warmBeforeMessage || verdict === "warm-before-message"
        ? "warm-before-message"
        : "inert",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit engaged" : "score solenoid",
    toggleInspect: toggle,
    warmInspect: warm,
    keysInspect: keys,
    mobileInspect: mobile,
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
      : SOLENOID_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "solenoid" || row.verdict === "inert",
  );
  const path = scored.filter((row) => row.verdict === "warm-before-message");
  const engaged = scored.filter((row) => row.verdict === "engaged");
  const headline =
    scored.find((row) => row.event === "inert") ||
    scored.find((row) => row.event === "warm-before-message") ||
    scored.find((row) => row.event === "toggle-fidelity") ||
    dead[dead.length - 1];
  let verdict = "engaged";
  if (dead.length) verdict = "solenoid";
  else if (path.length && !engaged.length) verdict = "warm-before-message";
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
    inertCount: dead.length,
    pathCount: path.length,
    engagedCount: engaged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit engaged" : "score solenoid",
    note: headline
      ? "Settings toggle flips but does nothing; even settings.json keys wait for first sendMessage (~28s). Cousins #84502 #48949 #90768 #84994 are cite-only."
      : "published solenoid walk scored against engaged vs inert",
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
    seeded !== "engaged" &&
    seeded !== "inert" &&
    seeded !== "warm-before-message" &&
    seeded !== "solenoid" &&
    ticket.engaged == null &&
    ticket.inert == null &&
    ticket.warmBeforeMessage == null &&
    ticket.toggleFidelity == null &&
    ticket.firstMessageArm == null &&
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
    engaged: scored.engaged ?? false,
    inert: scored.inert ?? false,
    warmBeforeMessage: scored.warmBeforeMessage ?? false,
    toggleFidelity: scored.toggleFidelity ?? false,
    firstMessageArm: scored.firstMessageArm ?? false,
    settingsJson: scored.settingsJson ?? false,
    macAbsent: scored.macAbsent ?? false,
    winDisconnected: scored.winDisconnected ?? false,
    engagedSurface: scored.engagedSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.toggleFidelity || result.inert ? "toggle=dead" : "toggle=live",
    result.firstMessageArm || result.inert ? "arm=first-message" : "arm=warm",
    result.settingsJson || result.inert ? "keys=file-only" : "keys=toggle-eq",
    result.warmBeforeMessage || result.verdict === "warm-before-message"
      ? "path=warm-before-message"
      : "path=engaged",
    result.cue === "engaged"
      ? "cue=engaged"
      : result.cue === "warm-before-message"
        ? "cue=warm-before-message"
        : "cue=inert",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    engaged: result.engaged,
    inert: result.inert,
    warmBeforeMessage: result.warmBeforeMessage,
    toggleFidelity: result.toggleFidelity,
    firstMessageArm: result.firstMessageArm,
    settingsJson: result.settingsJson,
    macAbsent: result.macAbsent,
    winDisconnected: result.winDisconnected,
    engagedSurface: result.engagedSurface,
    toggle: input && input.toggle,
    gap: input && input.gap,
    keys: input && input.keys,
    mobile: input && input.mobile,
    atelier: input && input.atelier,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    toggle: inspectToggleFidelity({
      engaged: result.engaged,
      inert: result.inert,
      toggleFidelity: result.toggleFidelity,
      toggle: input && input.toggle,
    }),
    warm: inspectWarmGap({
      engaged: result.engaged,
      inert: result.inert,
      firstMessageArm: result.firstMessageArm,
      gap: input && input.gap,
    }),
    keys: inspectSettingsJson({
      engaged: result.engaged,
      inert: result.inert,
      settingsJson: result.settingsJson,
      keys: input && input.keys,
    }),
    mobile: inspectMobileGap({
      engaged: result.engaged,
      inert: result.inert,
      macAbsent: result.macAbsent,
      mobile: input && input.mobile,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      inert:
        result.inert === true ||
        result.verdict === "inert" ||
        result.verdict === "solenoid",
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
        "NON-BINDING: Settings UI writes a different key than remoteControlAtStartup, and WarmLifecycle never calls the RC enable path that sendMessage does. Invite verify against #93754 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
