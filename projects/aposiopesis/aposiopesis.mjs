#!/usr/bin/env node
/**
 * Aposiopesis — manuscript speech-break booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On 2.1.268 the configured statusLine command is NEVER spawned when
 * the session cwd is inside a git repository (clone or worktree).
 * The status area stays empty — no error, no stale text, nothing in
 * --debug. The same binary / settings / script with cwd=$HOME (not a
 * git repo) runs and renders. A concurrent 2.1.267 session inside a
 * git repo still invokes continuously. Regression from 2.1.267.
 *
 *   node aposiopesis.mjs data/furled.json
 *   echo '{"seed":"furled"}' | node aposiopesis.mjs
 *
 * Idle word is raised (HOLD: statusLine spawned and rendered).
 * Seeded word is furled (#93588 blank mute in git cwd).
 * Path word is git-cwd-mute.
 * Product score word is aposiopesis (Score aposiopesis or admit raised.).
 *
 * Encoded from anthropics/claude-code#93588 issue text only.
 * Hypothesis (NON-BINDING): something about git-cwd detection or
 * project-level settings/hooks presence skips statusLine spawn in
 * 2.1.268. Verify against #93588 text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement
 * a fix. No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "hold",
  "spawned",
  "rendered",
  "zero-spawns",
  "home-renders",
  "worktree-blank",
  "clone-blank",
  "no-debug-line",
  "not-trust",
  "script-ok-by-hand",
  "fullscreen-insufficient",
  "concurrent-267",
  "settings-hooks-confound",
  "git-cwd",
  "never-spawned",
  "blank-rail",
  "no-error",
  "no-stale-text",
  "regression-268",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "raised";
export const PATH_WORD = "git-cwd-mute";
export const SEEDED_WORD = "furled";
export const PRODUCT_WORD = "aposiopesis";
export const HOLD = Object.freeze(["raised", "hold"]);
export const RECOVER = Object.freeze(["raised", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "aphonia",
  "deadair",
  "lacuna",
  "carrier",
  "squelch",
  "rostered",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "furled" && name !== "aposiopesis",
  ),
);

export const FEATURED_ISSUE = 93588;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93588";
export const TITLE =
  "[BUG] 2.1.268: statusLine command is never invoked when cwd is a git repo (works in a non-git cwd) — regression from 2.1.267";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "regression",
  "area:statusline",
]);
export const CLAUDE_CODE_VERSION = "2.1.268";
export const PRIOR_VERSION = "2.1.267";
export const OS = "macOS (Darwin 25.5.0)";
export const CLIENT = "iTerm2 3.6.11";
export const TERM = "xterm-256color";
export const INSTALLER = "native installer";
export const BINARY_PATH = "~/.local/share/claude/versions/2.1.268";
export const SETTINGS_PATH = "~/.claude/settings.json";
export const STATUSLINE_SCRIPT = "$HOME/.claude/statusline.sh";
export const STATUSLINE_TYPE = "command";
export const STATUSLINE_COMMAND = 'bash "$HOME/.claude/statusline.sh"';
export const TUI = "fullscreen";
export const LAUNCH = "claude --dangerously-skip-permissions";
export const SPAWN_LOG = "/tmp/statusline-sessions.log";
export const SPAWN_MEASURE =
  "logging at top of script after input=$(cat)";
export const PHRASE = "Score aposiopesis or admit raised.";
export const DISTRIBUTION =
  "Claude Code 2.1.268 native installer (~/.local/share/claude/versions/2.1.268) — macOS Darwin 25.5.0, iTerm2 3.6.11, TERM=xterm-256color. statusLine type command. tui fullscreen.";
export const SESSION_KIND =
  "Four concurrent sessions, same user settings, same script, same machine: A 2.1.268 $HOME (not git) renders; B 2.1.268 git clone never spawned; C 2.1.268 git worktree never spawned; D 2.1.267 git repo invokes continuously";

export const SPEECH_STATIONS = Object.freeze([
  {
    id: "line",
    survey: "read the unfinished line (statusLine command should keep speaking)",
    kind: "line",
    note: "seeded: the line cuts on an em-dash — command never spawned in a git cwd",
  },
  {
    id: "rail",
    survey: "look at the status rail (should render the script output)",
    kind: "rail",
    note: "seeded: rail stays empty — no error, no stale text, blank air",
  },
  {
    id: "seal",
    survey: "press the git-root seal (clone or worktree under a .git)",
    kind: "seal",
    note: "seeded: broken cwds are a normal git clone and a git worktree of that clone",
  },
  {
    id: "ledger",
    survey: "open the silence ledger (spawn log after input=$(cat))",
    kind: "ledger",
    note: "seeded: B and C stayed at zero spawns over minutes of tool calls / assistant messages / shift+tab",
  },
  {
    id: "debug",
    survey: "scan the debug strip (claude --debug should name statusline)",
    kind: "debug",
    note: "seeded: NO statusline-related line at all — not even the workspace-trust skip message",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "git-cwd-mute",
  "furled",
  "zero-spawns",
  "blank-rail",
  "no-debug-line",
  "worktree-blank",
  "not-trust",
  "regression-268",
]);

export const COUSINS = Object.freeze([
  {
    issue: 50679,
    title:
      "Custom statusLine command not invoked during task execution; activity indicator overwrites statusline",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — mid-task overwrite / activity indicator, not git-cwd never-spawn. Do not rebuild",
  },
  {
    issue: 18475,
    title: "cite-only cousin — do not rebuild",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 82885,
    title: "cite-only cousin — do not rebuild",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 58167,
    title: "cite-only cousin — do not rebuild",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93576, title: "allowUnixSockets /tmp symlink EPERM", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93553, title: "self-uploaded plugin install frozen", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93595, title: "Plugin HTTP MCP ${VAR} header empty", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93589, title: "Cowork egress additional domains ignored", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93556, title: "cloud scheduled task stalls at first turn", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93546, title: "forged background-task completion notifications", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93530, title: "Esc kills unrelated background subagent", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93570, title: "single-task shutdown kills all", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "disseisin",
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
  "aphonia",
  "deadair",
  "lacuna",
]);

export const SAMPLE_SESSIONS = Object.freeze([
  {
    id: "A",
    version: "2.1.268",
    cwd: "$HOME",
    git: false,
    spawned: true,
    rendered: true,
    note: "not a git repo — command runs and renders",
  },
  {
    id: "B",
    version: "2.1.268",
    cwd: "a normal git clone",
    git: true,
    spawned: false,
    rendered: false,
    note: "none — zero spawns",
  },
  {
    id: "C",
    version: "2.1.268",
    cwd: "a git worktree of that clone",
    git: true,
    worktree: true,
    spawned: false,
    rendered: false,
    note: "none — zero spawns",
  },
  {
    id: "D",
    version: "2.1.267",
    cwd: "a git repo",
    git: true,
    spawned: true,
    rendered: true,
    continuous: true,
    note: "yes, continuously — prior binary still speaks",
  },
]);

export const SAMPLE_LEDGER = Object.freeze([
  { session: "A", version: "2.1.268", cwd: "$HOME", spawns: "yes", renders: true },
  { session: "B", version: "2.1.268", cwd: "git clone", spawns: 0, renders: false },
  { session: "C", version: "2.1.268", cwd: "git worktree", spawns: 0, renders: false },
  { session: "D", version: "2.1.267", cwd: "git repo", spawns: "continuous", renders: true },
]);

export const SAMPLE_LINE = Object.freeze({
  text: "the status standard kept speaking —",
  cut: true,
  spoken: false,
});

export const SAMPLE_RAISED_LINE = Object.freeze({
  text: "the status standard kept speaking …",
  cut: false,
  spoken: true,
});

export const SAMPLE_RAIL = Object.freeze({
  empty: true,
  error: false,
  staleText: false,
});

export const SAMPLE_RAISED_RAIL = Object.freeze({
  empty: false,
  error: false,
  staleText: false,
  text: "statusLine rendered from $HOME/.claude/statusline.sh",
});

export const SAMPLE_SEAL = Object.freeze({
  git: true,
  kind: "clone-or-worktree",
  projectSettings: true,
  hooks: true,
});

export const SAMPLE_DEBUG = Object.freeze({
  statuslineLine: false,
  workspaceTrustSkip: false,
  note: "NO statusline-related line at all — not even workspace-trust skip",
});

export const SAMPLE_TRUST = Object.freeze({
  workingHasTrustDialogAccepted: false,
  brokenTrueOrMissing: true,
  discriminator: false,
});

export const SAMPLE_LOG = Object.freeze([
  { t: "A", line: "2.1.268 cwd=$HOME — not a git repo — command runs and renders" },
  { t: "B", line: "2.1.268 normal git clone — statusLine NEVER spawned; rail empty" },
  { t: "C", line: "2.1.268 git worktree — statusLine NEVER spawned; rail empty" },
  { t: "D", line: "2.1.267 git repo — still invokes continuously" },
  { t: "measure", line: "input=$(cat) then log to /tmp/statusline-sessions.log; B and C stayed at zero over minutes" },
  { t: "debug", line: "claude --debug: no statusline-related line; not even workspace-trust skip" },
  { t: "trust", line: "working cwd hasTrustDialogAccepted false; broken ones true or missing" },
  { t: "hand", line: "script run by hand in affected cwd with captured stdin JSON exits 0 ~0.3s" },
  { t: "tui", line: "session A also tui fullscreen and worked — fullscreen insufficient" },
  { t: "confound", line: "broken cwds are git repos AND carry project-level .claude/settings.json with hooks" },
]);

export function inspectLine(input = {}) {
  const line =
    input.line && typeof input.line === "object"
      ? input.line
      : input.raised === true && input.furled !== true
        ? SAMPLE_RAISED_LINE
        : SAMPLE_LINE;
  const forcedCut =
    input.furled === true ||
    input.neverSpawned === true ||
    input.event === "never-spawned" ||
    input.event === "furled" ||
    input.gitCwdMute === true;
  const spoken = forcedCut ? false : line.spoken === true || input.spawned === true;
  const cut = forcedCut || line.cut === true || !spoken;
  return {
    spoken,
    cut,
    text: spoken ? SAMPLE_RAISED_LINE.text : SAMPLE_LINE.text,
    stamp: cut && !spoken ? "cut" : "speaking",
    note: spoken
      ? "unfinished line continues — statusLine spawned and the speech holds"
      : "unfinished line cut on an em-dash — statusLine never spawned",
  };
}

export function inspectRail(input = {}) {
  const rail =
    input.rail && typeof input.rail === "object"
      ? input.rail
      : input.raised === true && input.furled !== true
        ? SAMPLE_RAISED_RAIL
        : SAMPLE_RAIL;
  const forcedBlank =
    input.blankRail === true ||
    input.event === "blank-rail" ||
    input.furled === true ||
    input.neverSpawned === true ||
    (input.gitCwd === true && input.spawned !== true && input.raised !== true);
  const empty = forcedBlank ? true : rail.empty === true;
  const error = rail.error === true;
  const stale = rail.staleText === true;
  return {
    empty,
    error,
    staleText: stale,
    stamp: empty && !error && !stale ? "blank" : empty ? "broken" : "rendered",
    note: empty && !error && !stale
      ? "status rail blank — no error, no stale text, just empty air"
      : empty
        ? "status rail empty with an error or leftover text"
        : "status rail rendered — script output visible",
  };
}

export function inspectSeal(input = {}) {
  const seal =
    input.seal && typeof input.seal === "object" ? input.seal : SAMPLE_SEAL;
  const git =
    input.gitCwd === true ||
    input.event === "git-cwd" ||
    input.event === "clone-blank" ||
    input.event === "worktree-blank" ||
    input.worktreeBlank === true ||
    input.cloneBlank === true ||
    (input.furled === true && input.raised !== true) ||
    seal.git === true;
  const worktree =
    input.worktreeBlank === true ||
    input.event === "worktree-blank" ||
    seal.worktree === true;
  return {
    git,
    worktree,
    stamp: git ? "sealed" : "unsealed",
    note: git
      ? worktree
        ? "git-root seal — cwd is a git worktree of the clone"
        : "git-root seal — cwd is a normal git clone or worktree"
      : "no git-root seal — cwd is $HOME, not a git repo",
  };
}

export function inspectLedger(input = {}) {
  const rows = Array.isArray(input.ledger)
    ? input.ledger
    : Array.isArray(input.sessions)
      ? input.sessions
      : SAMPLE_LEDGER;
  const forcedZero =
    input.zeroSpawns === true ||
    input.event === "zero-spawns" ||
    input.neverSpawned === true ||
    (input.furled === true && input.raised !== true);
  const b = rows.find((row) => row.session === "B");
  const c = rows.find((row) => row.session === "C");
  const a = rows.find((row) => row.session === "A");
  const d = rows.find((row) => row.session === "D");
  const sampleSilent = rows === SAMPLE_LEDGER && input.raised === true && input.furled !== true;
  const bZero =
    !sampleSilent &&
    (forcedZero || b == null || b.spawns === 0 || b.spawns === "none");
  const cZero =
    !sampleSilent &&
    (forcedZero || c == null || c.spawns === 0 || c.spawns === "none");
  return {
    aRenders: a ? a.renders !== false : input.homeRenders === true,
    bZero,
    cZero,
    dContinuous: d ? d.spawns === "continuous" || d.renders === true : input.concurrent267 === true,
    rows,
    stamp: bZero && cZero ? "silent" : "speaking",
    note:
      bZero && cZero
        ? "silence ledger — B and C stayed at zero spawns over minutes of tool calls / assistant messages / shift+tab"
        : "silence ledger speaking — git-cwd sessions still record spawns",
  };
}

export function inspectDebug(input = {}) {
  const debug =
    input.debug && typeof input.debug === "object"
      ? input.debug
      : SAMPLE_DEBUG;
  const forcedNone =
    input.noDebugLine === true ||
    input.event === "no-debug-line" ||
    input.furled === true;
  const none = forcedNone || debug.statuslineLine === false;
  const trustSkip = debug.workspaceTrustSkip === true;
  return {
    none,
    trustSkip,
    stamp: none && !trustSkip ? "absent" : trustSkip ? "trust-skip" : "present",
    note: none && !trustSkip
      ? "debug strip empty — no statusline-related line; not even workspace-trust skip"
      : none
        ? "debug names a workspace-trust skip"
        : "debug names a statusline line",
  };
}

export function readBooth(input = {}) {
  const line = inspectLine(input);
  const rail = inspectRail(input);
  const seal = inspectSeal(input);
  const ledger = inspectLedger(input);
  const debug = inspectDebug(input);
  const furled =
    input.raised !== true &&
    ((!line.spoken && rail.empty) ||
      ledger.bZero ||
      input.furled === true);
  const raised =
    input.raised === true &&
    furled !== true &&
    line.spoken &&
    !rail.empty;
  const path =
    seal.git &&
    (input.event === "git-cwd-mute" || input.gitCwdMute === true);
  return {
    line,
    rail,
    seal,
    ledger,
    debug,
    stations: SPEECH_STATIONS,
    furled: furled && !raised && !path,
    raised:
      raised ||
      (line.spoken &&
        !rail.empty &&
        input.furled !== true &&
        input.gitCwdMute !== true),
    gitCwdMute: path && !raised,
    mark:
      path && !raised
        ? "git-cwd-mute"
        : furled && !raised
          ? "furled"
          : "raised",
  };
}

/**
 * Published aposiopesis walk from #93588 only. Facts from the issue text.
 * A raised booth keeps statusLine spawned and rendered (cwd=$HOME).
 * A furled booth never spawns the command in a git cwd.
 * A git-cwd-mute booth names the git-root silence as the cut.
 */
export const APOSIOPESIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-raised",
    raised: true,
    furled: false,
    spawned: true,
    rendered: true,
    cue: "raised",
    note: "idle HOLD: cwd=$HOME, not a git repo — statusLine spawned and rendered",
  },
  {
    t: "clone",
    event: "git-cwd",
    furled: true,
    gitCwd: true,
    cue: "furled",
    note: "session B: 2.1.268 inside a normal git clone",
  },
  {
    t: "mute",
    event: "never-spawned",
    furled: true,
    neverSpawned: true,
    cue: "furled",
    note: "statusLine command is NEVER spawned; no error; no stale text",
  },
  {
    t: "rail",
    event: "blank-rail",
    furled: true,
    blankRail: true,
    cue: "furled",
    note: "status area stays empty — blank air",
  },
  {
    t: "ledger",
    event: "zero-spawns",
    furled: true,
    zeroSpawns: true,
    cue: "furled",
    note: "B and C stayed at zero spawns over minutes of tool calls / assistant messages / shift+tab",
  },
  {
    t: "debug",
    event: "no-debug-line",
    furled: true,
    noDebugLine: true,
    cue: "furled",
    note: "claude --debug: NO statusline-related line at all",
  },
  {
    t: "worktree",
    event: "worktree-blank",
    furled: true,
    worktreeBlank: true,
    cue: "furled",
    note: "session C: a git worktree of that clone — also none",
  },
  {
    t: "trust",
    event: "not-trust",
    furled: true,
    notTrust: true,
    cue: "furled",
    note: "workspace trust is NOT the discriminator (working cwd hasTrustDialogAccepted false)",
  },
  {
    t: "hand",
    event: "script-ok-by-hand",
    furled: true,
    scriptOkByHand: true,
    cue: "furled",
    note: "script itself fine when run by hand in affected cwd with captured stdin JSON",
  },
  {
    t: "tui",
    event: "fullscreen-insufficient",
    furled: true,
    fullscreenInsufficient: true,
    cue: "furled",
    note: "working session A also ran tui fullscreen — fullscreen alone is insufficient",
  },
  {
    t: "prior",
    event: "concurrent-267",
    furled: true,
    concurrent267: true,
    cue: "furled",
    note: "session D: 2.1.267 inside a git repo still invokes continuously",
  },
  {
    t: "confound",
    event: "settings-hooks-confound",
    furled: true,
    settingsHooksConfound: true,
    cue: "furled",
    note: "broken cwds are git repos AND carry project-level .claude/settings.json with hooks",
  },
  {
    t: "path",
    event: "git-cwd-mute",
    furled: true,
    gitCwdMute: true,
    gitCwd: true,
    neverSpawned: true,
    cue: "furled",
    note: "git-cwd-mute — the status standard falls silent only inside a git repo",
  },
  {
    t: "score",
    event: "aposiopesis",
    furled: true,
    neverSpawned: true,
    blankRail: true,
    zeroSpawns: true,
    gitCwd: true,
    cue: "furled",
    note: "aposiopesis — rhetorical sudden silence mid-speech; blank air, no error, no debug line",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "home",
    event: "home-renders",
    raised: true,
    homeRenders: true,
    cue: "raised",
    note: "positive control: same binary/settings/script with cwd=$HOME runs and renders",
  },
  {
    t: "spawn",
    event: "spawned",
    raised: true,
    spawned: true,
    cue: "raised",
    note: "positive control: statusLine command is invoked",
  },
  {
    t: "render",
    event: "rendered",
    raised: true,
    rendered: true,
    cue: "raised",
    note: "positive control: status area shows the script output",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    raised: true,
    furled: false,
    spawned: true,
    rendered: true,
    cue: "raised",
  };
}

export function seedRaised() {
  return { ...emptyTicket() };
}

export function seedFurled() {
  return {
    seed: SEEDED_WORD,
    raised: false,
    furled: true,
    neverSpawned: true,
    blankRail: true,
    zeroSpawns: true,
    gitCwd: true,
    worktreeBlank: true,
    noDebugLine: true,
    notTrust: true,
    scriptOkByHand: true,
    fullscreenInsufficient: true,
    concurrent267: true,
    settingsHooksConfound: true,
    gitCwdMute: true,
    cue: "furled",
    issue: FEATURED_ISSUE,
    ledger: SAMPLE_LEDGER,
    rail: SAMPLE_RAIL,
    seal: SAMPLE_SEAL,
    debug: SAMPLE_DEBUG,
  };
}

export function seedAposiopesis() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    furled: true,
    neverSpawned: true,
    blankRail: true,
    zeroSpawns: true,
    gitCwd: true,
    cue: "furled",
  };
}

export function seedGitCwdMute() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    furled: true,
    gitCwdMute: true,
    gitCwd: true,
    neverSpawned: true,
    event: "git-cwd-mute",
    cue: "furled",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    raised: true,
    cue: "raised",
  };
}

export function seedSpawned() {
  return { seed: "spawned", preferSeed: true, spawned: true, cue: "raised" };
}

export function seedRendered() {
  return { seed: "rendered", preferSeed: true, rendered: true, cue: "raised" };
}

export function seedZeroSpawns() {
  return { seed: "zero-spawns", preferSeed: true, zeroSpawns: true, cue: "furled" };
}

export function seedHomeRenders() {
  return { seed: "home-renders", preferSeed: true, homeRenders: true, cue: "raised" };
}

export function seedWorktreeBlank() {
  return { seed: "worktree-blank", preferSeed: true, worktreeBlank: true, cue: "furled" };
}

export function seedCloneBlank() {
  return { seed: "clone-blank", preferSeed: true, cloneBlank: true, cue: "furled" };
}

export function seedNoDebugLine() {
  return { seed: "no-debug-line", preferSeed: true, noDebugLine: true, cue: "furled" };
}

export function seedNotTrust() {
  return { seed: "not-trust", preferSeed: true, notTrust: true, cue: "furled" };
}

export function seedScriptOkByHand() {
  return { seed: "script-ok-by-hand", preferSeed: true, scriptOkByHand: true, cue: "furled" };
}

export function seedFullscreenInsufficient() {
  return { seed: "fullscreen-insufficient", preferSeed: true, fullscreenInsufficient: true, cue: "furled" };
}

export function seedConcurrent267() {
  return { seed: "concurrent-267", preferSeed: true, concurrent267: true, cue: "furled" };
}

export function seedSettingsHooksConfound() {
  return { seed: "settings-hooks-confound", preferSeed: true, settingsHooksConfound: true, cue: "furled" };
}

export function seedGitCwd() {
  return { seed: "git-cwd", preferSeed: true, gitCwd: true, cue: "furled" };
}

export function seedNeverSpawned() {
  return { seed: "never-spawned", preferSeed: true, neverSpawned: true, cue: "furled" };
}

export function seedBlankRail() {
  return { seed: "blank-rail", preferSeed: true, blankRail: true, cue: "furled" };
}

export function seedNoError() {
  return { seed: "no-error", preferSeed: true, noError: true, cue: "furled" };
}

export function seedNoStaleText() {
  return { seed: "no-stale-text", preferSeed: true, noStaleText: true, cue: "furled" };
}

export function seedRegression268() {
  return { seed: "regression-268", preferSeed: true, regression268: true, cue: "furled" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      raised: false,
      furled: false,
      gitCwdMute: false,
      spawned: false,
      rendered: false,
      zeroSpawns: false,
      homeRenders: false,
      worktreeBlank: false,
      cloneBlank: false,
      noDebugLine: false,
      notTrust: false,
      scriptOkByHand: false,
      fullscreenInsufficient: false,
      concurrent267: false,
      settingsHooksConfound: false,
      gitCwd: false,
      neverSpawned: false,
      blankRail: false,
      noError: false,
      noStaleText: false,
      regression268: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    raised: raw.raised === true,
    furled:
      raw.furled === true ||
      raw.event === "furled" ||
      raw.event === "aposiopesis",
    gitCwdMute: raw.gitCwdMute === true || raw.event === "git-cwd-mute",
    spawned: raw.spawned === true || raw.event === "spawned",
    rendered: raw.rendered === true || raw.event === "rendered",
    zeroSpawns: raw.zeroSpawns === true || raw.event === "zero-spawns",
    homeRenders: raw.homeRenders === true || raw.event === "home-renders",
    worktreeBlank: raw.worktreeBlank === true || raw.event === "worktree-blank",
    cloneBlank: raw.cloneBlank === true || raw.event === "clone-blank",
    noDebugLine: raw.noDebugLine === true || raw.event === "no-debug-line",
    notTrust: raw.notTrust === true || raw.event === "not-trust",
    scriptOkByHand: raw.scriptOkByHand === true || raw.event === "script-ok-by-hand",
    fullscreenInsufficient:
      raw.fullscreenInsufficient === true || raw.event === "fullscreen-insufficient",
    concurrent267: raw.concurrent267 === true || raw.event === "concurrent-267",
    settingsHooksConfound:
      raw.settingsHooksConfound === true || raw.event === "settings-hooks-confound",
    gitCwd: raw.gitCwd === true || raw.event === "git-cwd",
    neverSpawned: raw.neverSpawned === true || raw.event === "never-spawned",
    blankRail: raw.blankRail === true || raw.event === "blank-rail",
    noError: raw.noError === true || raw.event === "no-error",
    noStaleText: raw.noStaleText === true || raw.event === "no-stale-text",
    regression268: raw.regression268 === true || raw.event === "regression-268",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    line: raw.line,
    rail: raw.rail,
    seal: raw.seal,
    ledger: raw.ledger || raw.sessions,
    debug: raw.debug,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.raised != null ||
        ticket.furled != null ||
        ticket.gitCwdMute != null ||
        ticket.spawned != null ||
        ticket.rendered != null ||
        ticket.zeroSpawns != null ||
        ticket.gitCwd != null ||
        ticket.neverSpawned != null ||
        ticket.blankRail != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.ledger ||
        ticket.rail ||
        ticket.seal),
  );
}

function isRaised(row) {
  if (row.furled && row.cue !== "raised") return false;
  if (
    row.cue === "furled" ||
    row.cue === "aposiopesis" ||
    row.cue === "git-cwd-mute"
  ) {
    return false;
  }
  if (
    row.neverSpawned &&
    row.blankRail &&
    row.cue !== "raised" &&
    row.raised !== true
  ) {
    return false;
  }
  if (
    row.gitCwdMute &&
    row.gitCwd &&
    row.cue !== "raised" &&
    row.raised !== true
  ) {
    return false;
  }
  if (row.raised === true && row.furled !== true && row.cue !== "furled") {
    return true;
  }
  if (
    row.cue === "raised" &&
    row.furled !== true &&
    row.neverSpawned !== true &&
    row.gitCwdMute !== true
  ) {
    return true;
  }
  if (
    (row.spawned === true ||
      row.rendered === true ||
      row.homeRenders === true) &&
    row.furled !== true &&
    row.neverSpawned !== true &&
    row.blankRail !== true &&
    row.gitCwdMute !== true
  ) {
    return true;
  }
  return false;
}

function isGitCwdMutePath(row) {
  return (
    row.event === "git-cwd-mute" &&
    !isRaised(row) &&
    (row.gitCwdMute === true || row.gitCwd === true || row.neverSpawned === true)
  );
}

function isFurled(row) {
  if (isRaised(row)) return false;
  if (isGitCwdMutePath(row) && row.cue !== "furled") return false;
  if (row.cue === "furled" || row.cue === "aposiopesis") return true;
  if (row.furled === true) return true;
  if (
    row.neverSpawned === true &&
    row.blankRail === true &&
    row.zeroSpawns === true
  ) {
    return true;
  }
  if (row.gitCwd === true && row.neverSpawned === true) {
    return true;
  }
  if (
    row.zeroSpawns === true ||
    row.worktreeBlank === true ||
    row.cloneBlank === true ||
    (row.noDebugLine === true && row.gitCwd === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one speech-break pass against the aposiopesis booth.
 * raised: statusLine spawned and rendered (cwd=$HOME).
 * furled: never spawned in a git cwd; rail blank.
 * git-cwd-mute: the git-root silence is the cut.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isGitCwdMutePath(row) ||
    (row.gitCwdMute && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "git-cwd-mute";
  } else if (isFurled(row)) {
    verdict = "furled";
  } else if (isRaised(row)) {
    verdict = "raised";
  } else if (
    row.neverSpawned ||
    row.blankRail ||
    row.zeroSpawns ||
    (row.gitCwd && !row.homeRenders)
  ) {
    verdict = "furled";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const line = inspectLine(row);
  const rail = inspectRail(row);
  const seal = inspectSeal(row);
  const ledger = inspectLedger(row);
  const debug = inspectDebug(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    raised: verdict === "raised" || verdict === "hold",
    furled:
      verdict === "furled" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    gitCwdMute:
      row.gitCwdMute === true ||
      verdict === "git-cwd-mute" ||
      verdict === PATH_WORD,
    spawned: row.spawned,
    rendered: row.rendered,
    zeroSpawns: row.zeroSpawns,
    homeRenders: row.homeRenders,
    worktreeBlank: row.worktreeBlank,
    cloneBlank: row.cloneBlank,
    noDebugLine: row.noDebugLine,
    notTrust: row.notTrust,
    scriptOkByHand: row.scriptOkByHand,
    fullscreenInsufficient: row.fullscreenInsufficient,
    concurrent267: row.concurrent267,
    settingsHooksConfound: row.settingsHooksConfound,
    gitCwd: row.gitCwd,
    neverSpawned: row.neverSpawned,
    blankRail: row.blankRail,
    noError: row.noError,
    noStaleText: row.noStaleText,
    regression268: row.regression268,
    cue: hold
      ? "raised"
      : row.gitCwdMute || verdict === "git-cwd-mute"
        ? "git-cwd-mute"
        : "furled",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit raised" : "score aposiopesis",
    lineInspect: line,
    railInspect: rail,
    sealInspect: seal,
    ledgerInspect: ledger,
    debugInspect: debug,
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
      : APOSIOPESIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const furled = scored.filter((row) => row.verdict === "furled");
  const path = scored.filter((row) => row.verdict === "git-cwd-mute");
  const raised = scored.filter((row) => row.verdict === "raised");
  const headline =
    scored.find((row) => row.event === "furled") ||
    scored.find((row) => row.event === "git-cwd-mute") ||
    scored.find((row) => row.event === "never-spawned") ||
    furled[furled.length - 1];
  let verdict = "raised";
  if (furled.length) verdict = "furled";
  else if (path.length && !raised.length) verdict = "git-cwd-mute";
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
    furledCount: furled.length,
    pathCount: path.length,
    raisedCount: raised.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit raised" : "score aposiopesis",
    note: headline
      ? "Claude Code 2.1.268 native installer; statusLine never spawned in git clone or worktree; $HOME still renders; 2.1.267 concurrent still invokes; B/C zero spawns; no debug line."
      : "published aposiopesis walk scored against raised vs furled",
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
    seeded !== "raised" &&
    seeded !== "furled" &&
    seeded !== "git-cwd-mute" &&
    seeded !== "aposiopesis" &&
    ticket.raised == null &&
    ticket.furled == null &&
    ticket.neverSpawned == null &&
    ticket.gitCwdMute == null &&
    ticket.gitCwd == null &&
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
    raised: scored.raised ?? false,
    furled: scored.furled ?? false,
    gitCwdMute: scored.gitCwdMute ?? false,
    spawned: scored.spawned ?? false,
    rendered: scored.rendered ?? false,
    zeroSpawns: scored.zeroSpawns ?? false,
    homeRenders: scored.homeRenders ?? false,
    worktreeBlank: scored.worktreeBlank ?? false,
    noDebugLine: scored.noDebugLine ?? false,
    notTrust: scored.notTrust ?? false,
    gitCwd: scored.gitCwd ?? false,
    neverSpawned: scored.neverSpawned ?? false,
    blankRail: scored.blankRail ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.spawned || result.raised ? "line=speaking" : "line=cut",
    result.blankRail || result.furled ? "rail=blank" : "rail=rendered",
    result.gitCwd || result.furled ? "seal=git" : "seal=home",
    result.zeroSpawns || result.furled ? "ledger=silent" : "ledger=speaking",
    result.noDebugLine || result.furled ? "debug=absent" : "debug=present",
    result.gitCwdMute || result.verdict === "git-cwd-mute"
      ? "path=git-cwd-mute"
      : "path=raised",
    result.cue === "raised"
      ? "cue=raised"
      : result.cue === "git-cwd-mute"
        ? "cue=git-cwd-mute"
        : "cue=furled",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    raised: result.raised,
    furled: result.furled,
    gitCwdMute: result.gitCwdMute,
    spawned: result.spawned,
    rendered: result.rendered,
    zeroSpawns: result.zeroSpawns,
    homeRenders: result.homeRenders,
    worktreeBlank: result.worktreeBlank,
    gitCwd: result.gitCwd,
    neverSpawned: result.neverSpawned,
    blankRail: result.blankRail,
    noDebugLine: result.noDebugLine,
    concurrent267: result.concurrent267,
    line: input && input.line,
    rail: input && input.rail,
    seal: input && input.seal,
    ledger: input && input.ledger,
    debug: input && input.debug,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    line: inspectLine({
      raised: result.raised,
      furled: result.furled,
      neverSpawned: result.neverSpawned,
      spawned: result.spawned,
      gitCwdMute: result.gitCwdMute,
      line: input && input.line,
    }),
    rail: inspectRail({
      raised: result.raised,
      furled: result.furled,
      blankRail: result.blankRail,
      neverSpawned: result.neverSpawned,
      gitCwd: result.gitCwd,
      rail: input && input.rail,
    }),
    seal: inspectSeal({
      gitCwd: result.gitCwd,
      worktreeBlank: result.worktreeBlank,
      cloneBlank: result.cloneBlank,
      furled: result.furled,
      seal: input && input.seal,
    }),
    ledger: inspectLedger({
      zeroSpawns: result.zeroSpawns,
      neverSpawned: result.neverSpawned,
      furled: result.furled,
      homeRenders: result.homeRenders,
      concurrent267: result.concurrent267,
      ledger: input && input.ledger,
    }),
    debug: inspectDebug({
      noDebugLine: result.noDebugLine,
      furled: result.furled,
      debug: input && input.debug,
    }),
    stations: SPEECH_STATIONS.map((row) => ({
      ...row,
      furled: result.furled === true || result.verdict === "furled",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      priorVersion: PRIOR_VERSION,
      os: OS,
      client: CLIENT,
      term: TERM,
      installer: INSTALLER,
      binaryPath: BINARY_PATH,
      settingsPath: SETTINGS_PATH,
      statuslineScript: STATUSLINE_SCRIPT,
      statuslineType: STATUSLINE_TYPE,
      statuslineCommand: STATUSLINE_COMMAND,
      tui: TUI,
      launch: LAUNCH,
      spawnLog: SPAWN_LOG,
      spawnMeasure: SPAWN_MEASURE,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      sessions: SAMPLE_SESSIONS,
      stations: SPEECH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "The statusLine command is invoked regardless of whether cwd is inside a git repository",
      ],
      hypothesis:
        "NON-BINDING: something about git-cwd detection or project-level settings/hooks presence skips statusLine spawn in 2.1.268. Verify against #93588 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
