#!/usr/bin/env node
/**
 * Gleaner — agricultural gleaner's field / leftover-harvest booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Background `&` jobs inside a Bash tool call are not reaped when that
 * call ends. They are reparented to PID 1 and keep spinning after the
 * tool call, the subagent, and the session.
 *
 *   node gleaner.mjs data/orphaned.json
 *   echo '{"seed":"orphaned"}' | node gleaner.mjs
 *
 * Idle word is gleaned (HOLD: process-group reaped when Bash call ends;
 * no orphan PPID-1 spinners; tracked or dead — the good path).
 * Seeded word is orphaned (#93794 unreaped `&` jobs reparented to PID 1).
 * Path word is unreaped-ampersand.
 * Product score word is gleaner (Score gleaner or admit gleaned.).
 *
 * Encoded from anthropics/claude-code#93794 issue text only.
 * Hypothesis (NON-BINDING): Bash tool does not put the call in its own
 * process group / does not kill leftover children on shell exit, so `&`
 * jobs reparent to PID 1. Verify against #93794 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "gleaned",
  "orphaned",
  "gleaner",
  "unreaped-ampersand",
  "hold",
  "ppid-one",
  "process-group",
  "nice-five",
  "task-output-fd",
  "sigkill-escalate",
  "eight-hour-spin",
  "yes-wall",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "gleaned";
export const PATH_WORD = "unreaped-ampersand";
export const SEEDED_WORD = "orphaned";
export const PRODUCT_WORD = "gleaner";
export const HOLD = Object.freeze(["gleaned", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "gleaned",
  "reaped",
  "contained",
  "process-group",
]);
export const RECOVER = Object.freeze(["gleaned", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
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
  "blank",
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
  "seated",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "orphaned" && name !== "gleaner"),
);

export const FEATURED_ISSUE = 93794;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93794";
export const TITLE =
  "Background `&` jobs in a Bash tool call are orphaned, not reaped: 39 `yes` processes pegged ~7 cores for 8h42m";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.267";
export const SURFACE =
  "Claude Code 2.1.267, macOS Darwin 25.5.0 arm64 14 cores, zsh via Bash tool";
export const YES_SPAWNED = 60;
export const YES_ALIVE = 39;
export const CORES_CONSUMED = 7;
export const CORE_TOTAL = 14;
export const CPU_EACH = 25;
export const ELAPSED = "8h42m";
export const NICE = 5;
export const PGID_A = 40734;
export const PGID_B = 42141;
export const PGID_A_COUNT = 2;
export const PGID_B_COUNT = 37;
export const PPID = 1;
export const WORKTREE_CWD = ".claude/worktrees/agent-<id>";
export const TASK_OUTPUT_FD =
  "…/<session-id>/tasks/<task-id>.output";
export const REPRO = `for i in $(seq 1 5); do yes > /dev/null & done\nsleep 1\necho done`;
export const PHRASE = "Score gleaner or admit gleaned.";
export const DISTRIBUTION =
  "Background processes started with `&` inside a Bash tool call are not reaped when that call ends. They are reparented to PID 1 and keep running after the tool call, after the subagent, and after the session. A subagent spawned 60 `yes > /dev/null` processes as a synthetic CPU-load generator to reproduce a timing-dependent test flake. 39 of them were still spinning 8 hours 42 minutes later, each averaging ~25% CPU — roughly 7 of 14 cores consumed continuously, with no indication anywhere in the Claude Code UI. Discovery: pgrep -x yes → 39; every PPID 1; two process groups (2 in pgid 40734, 37 in pgid 42141); lsof cwd under `.claude/worktrees/agent-<id>`, fd2 at `…/<session-id>/tasks/<task-id>.output` (Bash tool output file), nice 5. Survivors needed kill -9 after SIGTERM failed. Root cause narrative in the issue: (1) the agent never killed its own background jobs; (2) the harness did not clean them — shell exit reparented children to PID 1; nothing later reaped them. (2) is the Claude Code bug. Worse than cosmetic: no visibility in transcript /tasks / background surfaces; outlives session; compounds; not rate-limited enough. Repro (single Bash tool call): for i in $(seq 1 5); do yes > /dev/null & done; sleep 1; echo done. After return: pgrep -x yes → 5; PPID 1. Suggested fixes (scoring narrative only): process group per Bash call + kill group on complete; reap at session teardown; surface stray children in tool result; warn model; escalate TERM→KILL. Env: Claude Code 2.1.267, macOS Darwin 25.5.0 arm64 14 cores, zsh via Bash tool; leak 8h42m; 60 spawned / 39 alive.";
export const RULED_OUT = Object.freeze([
  "Session-end unreaped auto-backgrounded Bash orphans (#92583)",
  "Windows background Bash tool processes orphaned across sessions (#77593)",
]);
export const EXPECTED = Object.freeze([
  "Run each Bash tool call in its own process group and kill that group when the call completes (setsid / setpgid, then kill(-pgid, SIGTERM) followed by SIGKILL after a grace period)",
  "Reap at session teardown as a backstop — on session end, kill any process group created by that session's Bash calls that is still alive",
  "Surface stray children in the tool result if a Bash call leaves live children behind",
  "Warn the model when a command contains a backgrounding loop without a trap/kill",
  "Escalate TERM→KILL — survivors needed SIGKILL",
]);

export const FIELD_STRIPS = Object.freeze([
  { id: "stubble", label: "stubble field", count: "leftover", note: "reapers left; gleaners should take the `&` children" },
  { id: "basket", label: "gleaner's basket", count: "reaped", note: "process-group containment — idle gleaned path" },
  { id: "wall", label: "yes wall", count: "39", note: "39 `yes` still spinning in the stubble" },
  { id: "meter", label: "8h42m", count: "elapsed", note: "leak outlived tool call, subagent, and session" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "containment-gate",
    survey: "watch the setsid / process-group gate reap `&` children when the Bash call ends",
    kind: "gleaned",
    note: "idle: process-group reaped; no orphan PPID-1 spinners; tracked or dead",
  },
  {
    id: "yes-wall",
    survey: "count the Activity Monitor wall of yes processes",
    kind: "orphaned",
    note: "seeded: 60 spawned; 39 still spinning 8h42m later; ~25% CPU each ≈ 7 of 14 cores",
  },
  {
    id: "ppid-one",
    survey: "badge every survivor PPID 1",
    kind: "orphaned",
    note: "seeded: spawning shell gone; children reparented rather than killed",
  },
  {
    id: "task-output-fd",
    survey: "read fd2 at the Bash tool output file",
    kind: "orphaned",
    note: "seeded: fd 2 → …/<session-id>/tasks/<task-id>.output; cwd under .claude/worktrees/agent-<id>; nice 5",
  },
  {
    id: "sigkill-escalate",
    survey: "escalate SIGTERM-fail → SIGKILL",
    kind: "orphaned",
    note: "seeded: all 39 survived kill -TERM plus a 2 second wait; needed kill -9",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "unreaped-ampersand",
  "orphaned",
  "ppid-one",
  "process-group",
  "nice-five",
  "task-output-fd",
  "sigkill-escalate",
  "eight-hour-spin",
  "yes-wall",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92583,
    title: "session-end unreaped auto-backgrounded Bash orphans",
    state: "OPEN",
    citeOnly: true,
    product: "snatch",
    why: "Cite-only cousin — #92583 session-end unreaped auto-backgrounded Bash orphans (Snatch). Different mechanism: here the leak is at Bash-call end, not session teardown; plain shell `&` jobs reparent to PID 1 when the tool call returns. Do not rebuild",
  },
  {
    issue: 77593,
    title: "Windows: background Bash tool processes orphaned across sessions",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #77593 Windows background Bash tool processes orphaned across sessions. Different platform and surface: this booth encodes the published macOS `#` 93794 `&` / PPID-1 leak. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93788, title: "ESC-sequence keys dead in composer 2.1.269", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93801, title: "Remote Control mobile send silently fails", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93798, title: "chrome MCP Prohibited actions govern Bash/SSH", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93786, title: "subagent worktree diffs invisible", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93778, title: "dictation after manual edit discards edit", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93800, title: "Clear slash not clearing session name", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93795, title: "VS Code 60s subprocess init", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "eidolon",
  "followspot",
  "calends",
  "weir",
  "rescript",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
  "reliquary",
  "cenotaph",
  "wraith",
  "afterimage",
  "midden",
  "oubliette",
  "quench",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "scrim",
  "knock",
  "palimpsest",
  "ephemera",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
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
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
  "snatch",
  "revenant",
  "remora",
  "epitaph",
  "lagan",
  "hawser",
  "waif",
  "stubble",
]);

export const SAMPLE_GLEANED_FIELD = Object.freeze({
  contained: true,
  processGroup: true,
  reaped: true,
  orphans: 0,
  ppidOne: false,
});

export const SAMPLE_ORPHANED_FIELD = Object.freeze({
  contained: false,
  processGroup: false,
  reaped: false,
  orphans: YES_ALIVE,
  ppidOne: true,
});

export const SAMPLE_PPID = Object.freeze({
  ppid: PPID,
  allPpidOne: true,
  spawningShellGone: true,
});

export const SAMPLE_GLEANED_PPID = Object.freeze({
  ppid: null,
  allPpidOne: false,
  spawningShellGone: false,
});

export const SAMPLE_GROUPS = Object.freeze({
  groups: [PGID_A, PGID_B],
  counts: { [PGID_A]: PGID_A_COUNT, [PGID_B]: PGID_B_COUNT },
  total: YES_ALIVE,
});

export const SAMPLE_GLEANED_GROUPS = Object.freeze({
  groups: [],
  counts: {},
  total: 0,
});

export const SAMPLE_FD = Object.freeze({
  cwd: WORKTREE_CWD,
  fd2: TASK_OUTPUT_FD,
  nice: NICE,
  stdin: "/dev/null",
  stdout: "/dev/null",
});

export const SAMPLE_GLEANED_FD = Object.freeze({
  cwd: null,
  fd2: null,
  nice: null,
  stdin: null,
  stdout: null,
});

export const SAMPLE_SIGNAL = Object.freeze({
  termFailed: true,
  neededKillNine: true,
  escalate: true,
});

export const SAMPLE_GLEANED_SIGNAL = Object.freeze({
  termFailed: false,
  neededKillNine: false,
  escalate: false,
});

export const SAMPLE_ELAPSED = Object.freeze({
  elapsed: ELAPSED,
  spawned: YES_SPAWNED,
  alive: YES_ALIVE,
  cores: CORES_CONSUMED,
  cpuEach: CPU_EACH,
});

export const SAMPLE_GLEANED_ELAPSED = Object.freeze({
  elapsed: "0m",
  spawned: 0,
  alive: 0,
  cores: 0,
  cpuEach: 0,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "field holds: process-group reaped when Bash call ends; no orphan PPID-1 spinners; tracked or dead" },
  { t: "yes-wall", line: "subagent spawned 60 yes > /dev/null as synthetic CPU-load; Activity Monitor wall" },
  { t: "ppid-one", line: "pgrep -x yes → 39; every PPID 1 — spawning shell gone; children reparented" },
  { t: "process-group", line: "two process groups: 2 in pgid 40734, 37 in pgid 42141" },
  { t: "nice-five", line: "survivors ran at nice 5 — the niceness the Bash tool applies" },
  { t: "task-output-fd", line: "fd 2 → …/<session-id>/tasks/<task-id>.output; cwd under .claude/worktrees/agent-<id>" },
  { t: "eight-hour-spin", line: "39 still spinning 8h42m later; ~25% CPU each ≈ 7 of 14 cores" },
  { t: "sigkill-escalate", line: "all 39 survived SIGTERM plus 2s; needed kill -9" },
  { t: "path", line: "unreaped-ampersand — Bash call ended; `&` jobs left in the stubble" },
  { t: "score", line: "when leftover `&` jobs spin on PPID 1 the booth is gleaner — Score gleaner or admit gleaned." },
]);

export function inspectContainment(input = {}) {
  const field =
    input.field && typeof input.field === "object"
      ? input.field
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_FIELD
        : SAMPLE_ORPHANED_FIELD;
  const forcedOrphan =
    input.orphaned === true ||
    input.event === "orphaned" ||
    input.event === "gleaner" ||
    input.event === "unreaped-ampersand" ||
    input.event === "ppid-one";
  const contained = forcedOrphan ? false : field.contained === true;
  const orphans = forcedOrphan ? YES_ALIVE : field.orphans || 0;
  return {
    contained,
    processGroup: contained,
    reaped: contained,
    orphans,
    ppidOne: !contained,
    stamp: contained ? "setsid-gate" : "unreaped-stubble",
    note: contained
      ? "process-group reaped when Bash call ends; no orphan PPID-1 spinners"
      : "harness did not clean `&` jobs — shell exit reparented children to PID 1",
  };
}

export function inspectPpid(input = {}) {
  const ppid =
    input.ppidInspect && typeof input.ppidInspect === "object"
      ? input.ppidInspect
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_PPID
        : SAMPLE_PPID;
  const forced =
    input.ppidOne === true ||
    input.event === "ppid-one" ||
    input.event === "orphaned" ||
    input.event === "gleaner" ||
    input.event === "unreaped-ampersand";
  const allPpidOne = forced
    ? true
    : ppid.allPpidOne === true && input.gleaned !== true;
  return {
    ppid: allPpidOne ? PPID : null,
    allPpidOne,
    spawningShellGone: allPpidOne,
    stamp: allPpidOne ? "ppid-1" : "reaped",
    note: allPpidOne
      ? "every survivor PPID 1 — spawning shell long gone; children reparented rather than killed"
      : "no PPID-1 leftover — children died with the Bash call",
  };
}

export function inspectYesWall(input = {}) {
  const elapsed =
    input.elapsed && typeof input.elapsed === "object"
      ? input.elapsed
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_ELAPSED
        : SAMPLE_ELAPSED;
  const forced =
    input.yesWall === true ||
    input.event === "yes-wall" ||
    input.event === "eight-hour-spin" ||
    input.event === "orphaned" ||
    input.event === "gleaner";
  const alive = forced ? YES_ALIVE : elapsed.alive || 0;
  return {
    spawned: alive ? YES_SPAWNED : 0,
    alive,
    cores: alive ? CORES_CONSUMED : 0,
    cpuEach: alive ? CPU_EACH : 0,
    stamp: alive ? "yes-wall" : "empty-field",
    note: alive
      ? "39 yes still spinning; ~25% CPU each ≈ 7 of 14 cores; no UI indication"
      : "no leftover yes processes — harvest took the `&` children",
  };
}

export function inspectFd(input = {}) {
  const fd =
    input.fd && typeof input.fd === "object"
      ? input.fd
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_FD
        : SAMPLE_FD;
  const forced =
    input.taskOutputFd === true ||
    input.event === "task-output-fd" ||
    input.event === "nice-five" ||
    input.event === "orphaned" ||
    input.event === "gleaner";
  const open = forced ? true : Boolean(fd.fd2) && input.gleaned !== true;
  return {
    cwd: open ? WORKTREE_CWD : null,
    fd2: open ? TASK_OUTPUT_FD : null,
    nice: open ? NICE : null,
    stamp: open ? "task-output-fd" : "no-fd",
    note: open
      ? "fd 2 at …/<session-id>/tasks/<task-id>.output; cwd under .claude/worktrees/agent-<id>; nice 5"
      : "no leftover Bash-tool output fd — children did not outlive the call",
  };
}

export function inspectSignal(input = {}) {
  const signal =
    input.signal && typeof input.signal === "object"
      ? input.signal
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_SIGNAL
        : SAMPLE_SIGNAL;
  const forced =
    input.sigkillEscalate === true ||
    input.event === "sigkill-escalate" ||
    input.event === "orphaned" ||
    input.event === "gleaner";
  const termFailed = forced ? true : signal.termFailed === true;
  return {
    termFailed,
    neededKillNine: termFailed,
    escalate: termFailed,
    stamp: termFailed ? "term-fail-kill" : "clean-reap",
    note: termFailed
      ? "all 39 survived kill -TERM plus a 2 second wait; needed kill -9"
      : "process-group kill on complete; no SIGTERM-resistant leftover",
  };
}

export function inspectGroups(input = {}) {
  const groups =
    input.groups && typeof input.groups === "object"
      ? input.groups
      : input.gleaned === true && input.orphaned !== true
        ? SAMPLE_GLEANED_GROUPS
        : SAMPLE_GROUPS;
  const forced =
    input.processGroupLeak === true ||
    input.event === "process-group" ||
    input.event === "orphaned" ||
    input.event === "gleaner" ||
    input.event === "unreaped-ampersand";
  const leaked = forced ? true : (groups.total || 0) > 0 && input.gleaned !== true;
  return {
    groups: leaked ? [PGID_A, PGID_B] : [],
    counts: leaked ? { [PGID_A]: PGID_A_COUNT, [PGID_B]: PGID_B_COUNT } : {},
    total: leaked ? YES_ALIVE : 0,
    stamp: leaked ? "pgid-40734-42141" : "group-reaped",
    note: leaked
      ? "two process groups: 2 in pgid 40734, 37 in pgid 42141"
      : "Bash call process group killed on complete — setsid containment held",
  };
}

export function readBooth(input = {}) {
  const containment = inspectContainment(input);
  const ppid = inspectPpid(input);
  const wall = inspectYesWall(input);
  const fd = inspectFd(input);
  const signal = inspectSignal(input);
  const groups = inspectGroups(input);
  const orphaned =
    input.gleaned !== true &&
    ((containment.orphans > 0 && ppid.allPpidOne) ||
      (wall.alive > 0 && fd.fd2) ||
      input.orphaned === true);
  const gleaned =
    input.gleaned === true && orphaned !== true && containment.reaped === true;
  const path =
    (input.event === "unreaped-ampersand" || input.unreapedAmpersand === true) &&
    (ppid.allPpidOne || containment.orphans > 0 || input.orphaned === true);
  return {
    containment,
    ppid,
    wall,
    fd,
    signal,
    groups,
    strips: FIELD_STRIPS,
    stations: BOOTH_STATIONS,
    orphaned: orphaned && !gleaned && !path,
    gleaned: gleaned || (!orphaned && !path && input.orphaned !== true && input.unreapedAmpersand !== true && containment.reaped),
    unreapedAmpersand: path && !gleaned,
    mark:
      path && !gleaned
        ? "unreaped-ampersand"
        : orphaned && !gleaned
          ? "orphaned"
          : "gleaned",
  };
}

/**
 * Published gleaner walk from #93794 only. Facts from the issue text.
 * A gleaned booth reaps the Bash call's process group.
 * An orphaned booth leaves `&` jobs spinning on PPID 1.
 * An unreaped-ampersand booth names the leftover-harvest path.
 */
export const GLEANER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-gleaned",
    gleaned: true,
    orphaned: false,
    cue: "gleaned",
    note: "idle HOLD: process-group reaped when Bash call ends; no orphan PPID-1 spinners — the hold/good path",
  },
  {
    t: "yes-wall",
    event: "yes-wall",
    orphaned: true,
    yesWall: true,
    cue: "orphaned",
    note: "subagent spawned 60 yes > /dev/null as synthetic CPU-load; 39 still spinning",
  },
  {
    t: "ppid-one",
    event: "ppid-one",
    orphaned: true,
    ppidOne: true,
    cue: "orphaned",
    note: "pgrep -x yes → 39; every PPID 1 — spawning shell gone",
  },
  {
    t: "process-group",
    event: "process-group",
    orphaned: true,
    processGroupLeak: true,
    cue: "orphaned",
    note: "two process groups: 2 in pgid 40734, 37 in pgid 42141",
  },
  {
    t: "nice-five",
    event: "nice-five",
    orphaned: true,
    niceFive: true,
    cue: "orphaned",
    note: "survivors ran at nice 5 — the niceness the Bash tool applies",
  },
  {
    t: "task-output-fd",
    event: "task-output-fd",
    orphaned: true,
    taskOutputFd: true,
    cue: "orphaned",
    note: "fd 2 → …/<session-id>/tasks/<task-id>.output; cwd under .claude/worktrees/agent-<id>",
  },
  {
    t: "eight-hour-spin",
    event: "eight-hour-spin",
    orphaned: true,
    eightHourSpin: true,
    cue: "orphaned",
    note: "39 still spinning 8h42m later; ~25% CPU each ≈ 7 of 14 cores",
  },
  {
    t: "sigkill-escalate",
    event: "sigkill-escalate",
    orphaned: true,
    sigkillEscalate: true,
    cue: "orphaned",
    note: "all 39 survived SIGTERM plus 2s; needed kill -9",
  },
  {
    t: "path",
    event: "unreaped-ampersand",
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    cue: "orphaned",
    note: "unreaped-ampersand — Bash call ended; `&` jobs left in the stubble",
  },
  {
    t: "score",
    event: "gleaner",
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    processGroupLeak: true,
    niceFive: true,
    taskOutputFd: true,
    eightHourSpin: true,
    sigkillEscalate: true,
    cue: "orphaned",
    note: "gleaner — when leftover `&` jobs spin on PPID 1 the booth never stays gleaned",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-gleaned",
    gleaned: true,
    orphaned: false,
    cue: "gleaned",
    note: "positive control: process group per Bash call; kill group on complete",
  },
  {
    t: "announce",
    event: "cue-gleaned",
    gleaned: true,
    cue: "gleaned",
    note: "positive control: setsid containment — no PPID-1 leftover",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    gleaned: true,
    orphaned: false,
    unreapedAmpersand: false,
    cue: "gleaned",
  };
}

export function seedGleaned() {
  return { ...emptyTicket() };
}

export function seedOrphaned() {
  return {
    seed: SEEDED_WORD,
    gleaned: false,
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    processGroupLeak: true,
    niceFive: true,
    taskOutputFd: true,
    eightHourSpin: true,
    sigkillEscalate: true,
    cue: "orphaned",
    issue: FEATURED_ISSUE,
    field: SAMPLE_ORPHANED_FIELD,
    ppidInspect: SAMPLE_PPID,
    elapsed: SAMPLE_ELAPSED,
    fd: SAMPLE_FD,
    signal: SAMPLE_SIGNAL,
    groups: SAMPLE_GROUPS,
  };
}

export function seedGleaner() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    processGroupLeak: true,
    niceFive: true,
    taskOutputFd: true,
    eightHourSpin: true,
    sigkillEscalate: true,
    cue: "orphaned",
  };
}

export function seedUnreapedAmpersand() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    event: "unreaped-ampersand",
    cue: "orphaned",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    gleaned: true,
    cue: "gleaned",
  };
}

export function seedPpidOne() {
  return {
    seed: "ppid-one",
    preferSeed: true,
    ppidOne: true,
    cue: "orphaned",
  };
}

export function seedProcessGroup() {
  return {
    seed: "process-group",
    preferSeed: true,
    processGroupLeak: true,
    cue: "orphaned",
  };
}

export function seedNiceFive() {
  return {
    seed: "nice-five",
    preferSeed: true,
    niceFive: true,
    cue: "orphaned",
  };
}

export function seedTaskOutputFd() {
  return {
    seed: "task-output-fd",
    preferSeed: true,
    taskOutputFd: true,
    cue: "orphaned",
  };
}

export function seedSigkillEscalate() {
  return {
    seed: "sigkill-escalate",
    preferSeed: true,
    sigkillEscalate: true,
    cue: "orphaned",
  };
}

export function seedEightHourSpin() {
  return {
    seed: "eight-hour-spin",
    preferSeed: true,
    eightHourSpin: true,
    cue: "orphaned",
  };
}

export function seedYesWall() {
  return {
    seed: "yes-wall",
    preferSeed: true,
    yesWall: true,
    cue: "orphaned",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      gleaned: false,
      orphaned: false,
      unreapedAmpersand: false,
      ppidOne: false,
      yesWall: false,
      processGroupLeak: false,
      niceFive: false,
      taskOutputFd: false,
      eightHourSpin: false,
      sigkillEscalate: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    gleaned: raw.gleaned === true,
    orphaned:
      raw.orphaned === true ||
      raw.event === "orphaned" ||
      raw.event === "gleaner",
    unreapedAmpersand:
      raw.unreapedAmpersand === true || raw.event === "unreaped-ampersand",
    ppidOne: raw.ppidOne === true || raw.event === "ppid-one",
    yesWall: raw.yesWall === true || raw.event === "yes-wall",
    processGroupLeak:
      raw.processGroupLeak === true || raw.event === "process-group",
    niceFive: raw.niceFive === true || raw.event === "nice-five",
    taskOutputFd: raw.taskOutputFd === true || raw.event === "task-output-fd",
    eightHourSpin:
      raw.eightHourSpin === true || raw.event === "eight-hour-spin",
    sigkillEscalate:
      raw.sigkillEscalate === true || raw.event === "sigkill-escalate",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    field: raw.field,
    ppidInspect: raw.ppidInspect,
    elapsed: raw.elapsed,
    fd: raw.fd,
    signal: raw.signal,
    groups: raw.groups,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.gleaned != null ||
        ticket.orphaned != null ||
        ticket.unreapedAmpersand != null ||
        ticket.ppidOne != null ||
        ticket.yesWall != null ||
        ticket.taskOutputFd != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.field ||
        ticket.ppidInspect ||
        ticket.fd),
  );
}

function isGleaned(row) {
  if (row.orphaned && row.cue !== "gleaned") return false;
  if (
    row.cue === "orphaned" ||
    row.cue === "gleaner" ||
    row.cue === "unreaped-ampersand"
  ) {
    return false;
  }
  if (
    row.unreapedAmpersand &&
    row.ppidOne &&
    row.cue !== "gleaned" &&
    row.gleaned !== true
  ) {
    return false;
  }
  if (
    row.unreapedAmpersand &&
    row.yesWall &&
    row.cue !== "gleaned" &&
    row.gleaned !== true
  ) {
    return false;
  }
  if (row.gleaned === true && row.orphaned !== true && row.cue !== "orphaned") {
    return true;
  }
  if (
    row.cue === "gleaned" &&
    row.orphaned !== true &&
    row.unreapedAmpersand !== true &&
    row.ppidOne !== true &&
    row.yesWall !== true
  ) {
    return true;
  }
  return false;
}

function isUnreapedAmpersandPath(row) {
  return (
    row.event === "unreaped-ampersand" &&
    !isGleaned(row) &&
    (row.unreapedAmpersand === true ||
      row.ppidOne === true ||
      row.yesWall === true)
  );
}

function isOrphaned(row) {
  if (isGleaned(row)) return false;
  if (isUnreapedAmpersandPath(row) && row.cue !== "orphaned") return false;
  if (row.cue === "orphaned" || row.cue === "gleaner") return true;
  if (row.orphaned === true) return true;
  if (
    row.unreapedAmpersand === true &&
    row.ppidOne === true &&
    row.yesWall === true
  ) {
    return true;
  }
  if (row.unreapedAmpersand === true && row.ppidOne === true) {
    return true;
  }
  if (
    row.yesWall === true ||
    row.ppidOne === true ||
    row.taskOutputFd === true ||
    row.processGroupLeak === true ||
    row.niceFive === true ||
    row.eightHourSpin === true ||
    row.sigkillEscalate === true ||
    (row.unreapedAmpersand === true && row.yesWall === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one gleaner pass against the leftover-harvest field.
 * gleaned: process-group reaped when Bash call ends; no orphan PPID-1 spinners.
 * orphaned / gleaner: unreaped `&` jobs reparented to PID 1.
 * unreaped-ampersand: Bash call ended; `&` jobs left in the stubble.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isUnreapedAmpersandPath(row) ||
    (row.unreapedAmpersand && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "unreaped-ampersand";
  } else if (isOrphaned(row)) {
    verdict = "gleaner";
  } else if (isGleaned(row)) {
    verdict = "gleaned";
  } else if (
    row.unreapedAmpersand ||
    row.yesWall ||
    row.ppidOne ||
    (row.taskOutputFd && !row.gleaned)
  ) {
    verdict = "gleaner";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const containment = inspectContainment(row);
  const ppid = inspectPpid(row);
  const wall = inspectYesWall(row);
  const fd = inspectFd(row);
  const signal = inspectSignal(row);
  const groups = inspectGroups(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    gleaned: verdict === "gleaned" || verdict === "hold",
    orphaned:
      verdict === "orphaned" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    unreapedAmpersand:
      row.unreapedAmpersand === true ||
      verdict === "unreaped-ampersand" ||
      verdict === PATH_WORD,
    ppidOne: row.ppidOne,
    yesWall: row.yesWall,
    processGroupLeak: row.processGroupLeak,
    niceFive: row.niceFive,
    taskOutputFd: row.taskOutputFd,
    eightHourSpin: row.eightHourSpin,
    sigkillEscalate: row.sigkillEscalate,
    cue: hold
      ? "gleaned"
      : row.unreapedAmpersand || verdict === "unreaped-ampersand"
        ? "unreaped-ampersand"
        : "orphaned",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit gleaned" : "score gleaner",
    containmentInspect: containment,
    ppidInspect: ppid,
    wallInspect: wall,
    fdInspect: fd,
    signalInspect: signal,
    groupsInspect: groups,
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
      : GLEANER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "gleaner" || row.verdict === "orphaned",
  );
  const path = scored.filter((row) => row.verdict === "unreaped-ampersand");
  const gleaned = scored.filter((row) => row.verdict === "gleaned");
  const headline =
    scored.find((row) => row.event === "orphaned") ||
    scored.find((row) => row.event === "unreaped-ampersand") ||
    scored.find((row) => row.event === "yes-wall") ||
    dead[dead.length - 1];
  let verdict = "gleaned";
  if (dead.length) verdict = "gleaner";
  else if (path.length && !gleaned.length) verdict = "unreaped-ampersand";
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
    orphanedCount: dead.length,
    pathCount: path.length,
    gleanedCount: gleaned.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit gleaned" : "score gleaner",
    note: headline
      ? "39 yes on PPID 1; two process groups; fd2 at tasks/output; 8h42m; SIGTERM failed."
      : "published gleaner walk scored against gleaned vs orphaned",
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
    seeded !== "gleaned" &&
    seeded !== "orphaned" &&
    seeded !== "unreaped-ampersand" &&
    seeded !== "gleaner" &&
    ticket.gleaned == null &&
    ticket.orphaned == null &&
    ticket.unreapedAmpersand == null &&
    ticket.ppidOne == null &&
    ticket.yesWall == null &&
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
    gleaned: scored.gleaned ?? false,
    orphaned: scored.orphaned ?? false,
    unreapedAmpersand: scored.unreapedAmpersand ?? false,
    ppidOne: scored.ppidOne ?? false,
    yesWall: scored.yesWall ?? false,
    processGroupLeak: scored.processGroupLeak ?? false,
    niceFive: scored.niceFive ?? false,
    taskOutputFd: scored.taskOutputFd ?? false,
    eightHourSpin: scored.eightHourSpin ?? false,
    sigkillEscalate: scored.sigkillEscalate ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.gleaned && !result.orphaned ? "ppid=reaped" : "ppid=1",
    result.unreapedAmpersand || result.orphaned ? "jobs=orphaned" : "jobs=gleaned",
    result.yesWall || result.orphaned ? "yes=39" : "yes=0",
    result.taskOutputFd || result.orphaned
      ? "fd2=tasks/output"
      : "fd2=none",
    result.unreapedAmpersand || result.verdict === "unreaped-ampersand"
      ? "path=unreaped-ampersand"
      : "path=gleaned",
    result.cue === "gleaned"
      ? "cue=gleaned"
      : result.cue === "unreaped-ampersand"
        ? "cue=unreaped-ampersand"
        : "cue=orphaned",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    gleaned: result.gleaned,
    orphaned: result.orphaned,
    unreapedAmpersand: result.unreapedAmpersand,
    ppidOne: result.ppidOne,
    yesWall: result.yesWall,
    processGroupLeak: result.processGroupLeak,
    niceFive: result.niceFive,
    taskOutputFd: result.taskOutputFd,
    eightHourSpin: result.eightHourSpin,
    sigkillEscalate: result.sigkillEscalate,
    field: input && input.field,
    ppidInspect: input && input.ppidInspect,
    elapsed: input && input.elapsed,
    fd: input && input.fd,
    signal: input && input.signal,
    groups: input && input.groups,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    containment: inspectContainment({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      field: input && input.field,
    }),
    ppid: inspectPpid({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      unreapedAmpersand: result.unreapedAmpersand,
      ppidOne: result.ppidOne,
      ppidInspect: input && input.ppidInspect,
    }),
    wall: inspectYesWall({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      yesWall: result.yesWall,
      elapsed: input && input.elapsed,
    }),
    fd: inspectFd({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      taskOutputFd: result.taskOutputFd,
      fd: input && input.fd,
    }),
    signal: inspectSignal({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      sigkillEscalate: result.sigkillEscalate,
      signal: input && input.signal,
    }),
    groups: inspectGroups({
      gleaned: result.gleaned,
      orphaned: result.orphaned,
      processGroupLeak: result.processGroupLeak,
      groups: input && input.groups,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      orphaned:
        result.orphaned === true ||
        result.verdict === "orphaned" ||
        result.verdict === "gleaner",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      yesSpawned: YES_SPAWNED,
      yesAlive: YES_ALIVE,
      coresConsumed: CORES_CONSUMED,
      coreTotal: CORE_TOTAL,
      cpuEach: CPU_EACH,
      elapsed: ELAPSED,
      nice: NICE,
      pgidA: PGID_A,
      pgidB: PGID_B,
      ppid: PPID,
      worktreeCwd: WORKTREE_CWD,
      taskOutputFd: TASK_OUTPUT_FD,
      repro: REPRO,
      strips: FIELD_STRIPS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: Bash tool does not put the call in its own process group / does not kill leftover children on shell exit, so `&` jobs reparent to PID 1. Invite verify against #93794 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
