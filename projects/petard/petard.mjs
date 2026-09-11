#!/usr/bin/env node
/**
 * Petard — siege petard / powder-charge booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * The Bash tool runs every command as /bin/bash -c "… eval '<the
 * command text>' …" so the full command text lives in the argv of a
 * live process for the call. On Linux, pkill -f / pgrep -f match
 * against that argv. procps-ng / BusyBox exclude only the pgrep/pkill
 * process itself, NOT the parent wrapper. pkill -f kills the tool's
 * own shell → Exit 144 / is_error true; nothing after the pkill runs.
 * pgrep -f returns the wrapper's PID (changes every call → phantom
 * PIDs). Fix 2.1.214 only refuses when the pattern matches $CLAUDE_PID
 * (CLI process); it does NOT check wrapper $$. pgrep is not wrapped.
 *
 *   node petard.mjs data/hoisted.json
 *   echo '{"seed":"hoisted"}' | node petard.mjs
 *
 * Idle word is standing (HOLD: wrapper shell still alive; command
 * completes; `still alive` prints).
 * Seeded word is hoisted (#93607 — hoist with one's own petard:
 * pkill -f kills the Bash-tool wrapper because the pattern sits in
 * that wrapper's argv).
 * Path word is wrapper-argv.
 * Product score word is petard (Score petard or admit standing.).
 *
 * Encoded from anthropics/claude-code#93607 issue text only.
 * Hypothesis (NON-BINDING): command text should leave argv
 * (env/stdin/tempfile) or pkill/pgrep guards must cover wrapper $$.
 * Verify against #93607 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "hold",
  "still-alive",
  "still-alive-missing",
  "exit-144",
  "is-error",
  "phantom-pid",
  "changing-pid",
  "cli-guard-only",
  "wrapper-unchecked",
  "pgrep-unwrapped",
  "argv-leak",
  "eval-in-argv",
  "linux-procps",
  "busybox-match",
  "macos-ancestors-ok",
  "bracket-partial",
  "same-call-dies",
  "from-file-ok",
  "headless-repeat",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "standing";
export const PATH_WORD = "wrapper-argv";
export const SEEDED_WORD = "hoisted";
export const PRODUCT_WORD = "petard";
export const HOLD = Object.freeze(["standing", "hold"]);
export const RECOVER = Object.freeze(["standing", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "hoisted" && name !== "petard",
  ),
);

export const FEATURED_ISSUE = 93607;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93607";
export const TITLE =
  "[BUG] Bash tool (Linux): pkill -f / pgrep -f match the tool's own bash -c … eval wrapper (exit 144, phantom PIDs); 2.1.214 guard covers only the CLI process";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:bash",
]);
export const GUARD_VERSION = "2.1.214";
export const CLAUDE_CODE_VERSION = "2.1.214";
export const OS = "Linux";
export const TOOL = "Bash";
export const WRAPPER =
  "/bin/bash -c \"… eval '<the command text>' …\"";
export const PATTERN = "sleep 3979";
export const START_CMD =
  "nohup sleep 3979 >/dev/null 2>&1 & echo started";
export const PKILL_CMD = 'pkill -f "sleep 3979"; echo still alive';
export const PGREP_CMD = 'pgrep -af "sleep 3979"';
export const EXIT_CODE = 144;
export const STILL_ALIVE = "still alive";
export const BRACKET_IDIOM = "[3]979";
export const PHRASE = "Score petard or admit standing.";
export const DISTRIBUTION =
  "Claude Code Bash tool on Linux — every command is /bin/bash -c \"… eval '<the command text>' …\" so the full command text lives in the argv of a live process for the call. procps-ng / BusyBox pkill -f / pgrep -f match that argv. 2.1.214 guard covers only $CLAUDE_PID.";
export const SESSION_KIND =
  "Separate Bash tool calls on Linux: (1) nohup sleep 3979 >/dev/null 2>&1 & echo started (2) pkill -f \"sleep 3979\"; echo still alive → Exit 144, never prints still alive (3) pgrep -af \"sleep 3979\" → returns wrapper shell even with no sleep alive. Standalone docker repro across debian/ubuntu/fedora/amazonlinux/arch/alpine all kill wrapper; macOS does not.";

export const TRENCH_STATIONS = Object.freeze([
  {
    id: "fuse",
    survey: "light the fuse rail (command should complete; still alive should print)",
    kind: "fuse",
    note: "seeded: fuse blows back — pkill -f matches the wrapper argv and the sapper is hoisted",
  },
  {
    id: "ledger",
    survey: "open the powder ledger (exit 144 / is_error / still-alive missing)",
    kind: "ledger",
    note: "seeded: Exit 144 / is_error true; nothing after the pkill runs; still alive never prints",
  },
  {
    id: "argv",
    survey: "read the argv mirror (full command text lives in the wrapper argv)",
    kind: "argv",
    note: "seeded: /bin/bash -c … eval '<the command text>' keeps the pattern in a live process argv",
  },
  {
    id: "wrapper",
    survey: "watch the wrapper shell silhouette (should stay standing after pkill -f)",
    kind: "wrapper",
    note: "seeded: procps-ng / BusyBox exclude only pgrep/pkill itself, NOT the parent wrapper",
  },
  {
    id: "trench",
    survey: "walk the sapper trench (Linux kills the wrapper; macOS ancestors OK)",
    kind: "trench",
    note: "seeded: debian/ubuntu/fedora/amazonlinux/arch/alpine kill wrapper; macOS BSD excludes ancestors",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "wrapper-argv",
  "hoisted",
  "exit-144",
  "still-alive-missing",
  "phantom-pid",
  "cli-guard-only",
  "argv-leak",
  "same-call-dies",
]);

export const COUSINS = Object.freeze([
  {
    issue: 62297,
    title: "cite-only cousin — exit 144 meaning",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — exit 144 meaning, not the pkill-f wrapper-argv hoist. Do not rebuild",
  },
  {
    issue: 72153,
    title: "cite-only cousin — pkill over-matching other processes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — pkill over-matching other processes, different from wrapper self-match. Do not rebuild",
  },
  {
    issue: 90070,
    title: "cite-only cousin — pkill over-matching other processes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — pkill over-matching other processes, different from wrapper self-match. Do not rebuild",
  },
  {
    issue: 89496,
    title: "cite-only cousin — same wrapper from grep side",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same wrapper from grep side. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93595,
    title: "plugin HTTP MCP ${VAR} header expands empty → 401; alt Nullarbor",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93585,
    title: "cloud session stale local branch after pre-warm; alt Anachronism",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93570,
    title: "single-task shutdown terminates all; alt Overkill",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "mondegreen",
  "seizing",
  "hangfire",
  "flashpan",
  "frizzen",
]);

export const SAMPLE_CALLS = Object.freeze([
  {
    id: "1",
    cmd: START_CMD,
    result: "started",
    wrapperAlive: true,
    note: "start sleep 3979 in a separate Bash tool call",
  },
  {
    id: "2",
    cmd: PKILL_CMD,
    result: "Exit 144",
    isError: true,
    stillAlivePrinted: false,
    wrapperKilled: true,
    note: "pkill -f matches wrapper argv; still alive never prints",
  },
  {
    id: "3",
    cmd: PGREP_CMD,
    result: "wrapper PID",
    phantomPid: true,
    changingPid: true,
    note: "pgrep -af returns the wrapper shell even with no sleep alive",
  },
]);

export const SAMPLE_LEDGER = Object.freeze([
  { call: "1", cmd: "start sleep", exit: 0, stillAlive: true, wrapper: "standing" },
  { call: "2", cmd: "pkill -f", exit: 144, stillAlive: false, wrapper: "hoisted" },
  { call: "3", cmd: "pgrep -af", exit: 0, stillAlive: false, wrapper: "phantom" },
]);

export const SAMPLE_STANDING_LEDGER = Object.freeze([
  { call: "1", cmd: "start sleep", exit: 0, stillAlive: true, wrapper: "standing" },
  { call: "2", cmd: "pkill -f", exit: 0, stillAlive: true, wrapper: "standing" },
  { call: "3", cmd: "pgrep -af", exit: 1, stillAlive: true, wrapper: "standing" },
]);

export const SAMPLE_FUSE = Object.freeze({
  lit: true,
  blown: true,
  stillAlivePrinted: false,
});

export const SAMPLE_STANDING_FUSE = Object.freeze({
  lit: true,
  blown: false,
  stillAlivePrinted: true,
});

export const SAMPLE_ARGV = Object.freeze({
  leaked: true,
  evalInArgv: true,
  pattern: PATTERN,
  wrapper: WRAPPER,
});

export const SAMPLE_STANDING_ARGV = Object.freeze({
  leaked: false,
  evalInArgv: false,
  pattern: PATTERN,
  wrapper: "command text not in live argv",
});

export const SAMPLE_WRAPPER = Object.freeze({
  alive: false,
  killed: true,
  excludedSelfOnly: true,
  ancestorsExcluded: false,
});

export const SAMPLE_STANDING_WRAPPER = Object.freeze({
  alive: true,
  killed: false,
  excludedSelfOnly: false,
  ancestorsExcluded: true,
});

export const SAMPLE_GUARD = Object.freeze({
  version: GUARD_VERSION,
  coversClaudePid: true,
  coversWrapperPid: false,
  pgrepWrapped: false,
});

export const SAMPLE_DISTROS = Object.freeze([
  "debian",
  "ubuntu",
  "fedora",
  "amazonlinux",
  "arch",
  "alpine",
]);

export const SAMPLE_LOG = Object.freeze([
  { t: "idle", line: "wrapper shell still alive; command completes; still alive prints" },
  { t: "start", line: "nohup sleep 3979 >/dev/null 2>&1 & echo started" },
  { t: "pkill", line: 'pkill -f "sleep 3979"; echo still alive' },
  { t: "blast", line: "wrapper killed — Exit 144 / is_error true; still alive never prints" },
  { t: "pgrep", line: "pgrep -af returns wrapper shell even with no sleep alive" },
  { t: "phantom", line: "wrapper PID changes every call → phantom PIDs" },
  { t: "guard", line: "2.1.214 refuses only when pattern matches $CLAUDE_PID; wrapper $$ unchecked" },
  { t: "macos", line: "macOS BSD pgrep/pkill exclude calling process AND ancestors" },
  { t: "bracket", line: "bracket idiom [3]979 only helps when target started in an earlier call" },
  { t: "same", line: "same-call start+kill still dies" },
  { t: "argv", line: "full command text lives in /bin/bash -c … eval argv" },
  { t: "score", line: "hoist with one's own petard — Score petard or admit standing." },
]);

export function inspectFuse(input = {}) {
  const fuse =
    input.fuse && typeof input.fuse === "object"
      ? input.fuse
      : input.standing === true && input.hoisted !== true
        ? SAMPLE_STANDING_FUSE
        : SAMPLE_FUSE;
  const forcedBlow =
    input.hoisted === true ||
    input.wrapperKilled === true ||
    input.exit144 === true ||
    input.event === "wrapper-killed" ||
    input.event === "exit-144" ||
    input.event === "hoisted" ||
    input.wrapperArgv === true;
  const stillAlivePrinted = forcedBlow
    ? false
    : fuse.stillAlivePrinted === true ||
      input.stillAlive === true ||
      input.stillAlivePrinted === true;
  const blown = forcedBlow || fuse.blown === true || !stillAlivePrinted;
  return {
    lit: fuse.lit !== false,
    blown,
    stillAlivePrinted,
    stamp: blown && !stillAlivePrinted ? "blown" : "standing",
    note: stillAlivePrinted
      ? "fuse rail standing — command completes; still alive prints"
      : "fuse rail blown — pkill -f matches wrapper argv; still alive never prints",
  };
}

export function inspectArgv(input = {}) {
  const argv =
    input.argv && typeof input.argv === "object"
      ? input.argv
      : input.standing === true && input.hoisted !== true
        ? SAMPLE_STANDING_ARGV
        : SAMPLE_ARGV;
  const forcedLeak =
    input.argvLeak === true ||
    input.evalInArgv === true ||
    input.event === "argv-leak" ||
    input.event === "eval-in-argv" ||
    input.hoisted === true ||
    input.wrapperArgv === true ||
    (input.linuxProcps === true && input.standing !== true);
  const leaked = forcedLeak ? true : argv.leaked === true;
  return {
    leaked,
    evalInArgv: forcedLeak || argv.evalInArgv === true,
    pattern: argv.pattern || PATTERN,
    stamp: leaked ? "mirrored" : "clean",
    note: leaked
      ? "argv mirror — full command text lives in /bin/bash -c … eval argv"
      : "argv mirror clean — command text not sitting in a live wrapper argv",
  };
}

export function inspectWrapper(input = {}) {
  const wrapper =
    input.wrapper && typeof input.wrapper === "object"
      ? input.wrapper
      : input.standing === true && input.hoisted !== true
        ? SAMPLE_STANDING_WRAPPER
        : SAMPLE_WRAPPER;
  const forcedKill =
    input.wrapperKilled === true ||
    input.event === "wrapper-killed" ||
    input.event === "exit-144" ||
    input.exit144 === true ||
    (input.hoisted === true && input.standing !== true) ||
    wrapper.killed === true;
  const alive = forcedKill ? false : wrapper.alive === true || input.wrapperAlive === true;
  return {
    alive,
    killed: !alive,
    excludedSelfOnly: wrapper.excludedSelfOnly === true || input.linuxProcps === true,
    stamp: alive ? "standing" : "blown-back",
    note: alive
      ? "wrapper silhouette standing — pkill -f did not match the parent shell"
      : "wrapper silhouette blown back on the sapper — procps/BusyBox exclude only pkill itself",
  };
}

export function inspectLedger(input = {}) {
  const rows = Array.isArray(input.ledger)
    ? input.ledger
    : Array.isArray(input.calls)
      ? input.calls
      : SAMPLE_LEDGER;
  const forcedBlast =
    input.exit144 === true ||
    input.event === "exit-144" ||
    input.stillAliveMissing === true ||
    (input.hoisted === true && input.standing !== true);
  const two = rows.find((row) => row.call === "2");
  const sampleCalm =
    rows === SAMPLE_LEDGER && input.standing === true && input.hoisted !== true;
  const exit144 =
    !sampleCalm &&
    (forcedBlast || two == null || two.exit === 144 || two.stillAlive === false);
  return {
    exit144,
    stillAliveMissing: exit144,
    isError: exit144,
    rows,
    stamp: exit144 ? "blast" : "standing",
    note: exit144
      ? "powder ledger — Exit 144 / is_error true; still alive never prints"
      : "powder ledger standing — pkill completes; still alive prints",
  };
}

export function inspectGuard(input = {}) {
  const guard =
    input.guard && typeof input.guard === "object"
      ? input.guard
      : SAMPLE_GUARD;
  const forcedOnly =
    input.cliGuardOnly === true ||
    input.event === "cli-guard-only" ||
    input.wrapperUnchecked === true ||
    input.hoisted === true;
  const coversWrapper = forcedOnly ? false : guard.coversWrapperPid === true;
  const coversCli = guard.coversClaudePid !== false;
  return {
    coversClaudePid: coversCli,
    coversWrapperPid: coversWrapper,
    pgrepWrapped: guard.pgrepWrapped === true,
    stamp: coversWrapper ? "covered" : "cli-only",
    note: coversWrapper
      ? "guard covers wrapper $$ as well as $CLAUDE_PID"
      : "2.1.214 guard covers only $CLAUDE_PID; wrapper $$ unchecked; pgrep unwrapped",
  };
}

export function readBooth(input = {}) {
  const fuse = inspectFuse(input);
  const argv = inspectArgv(input);
  const wrapper = inspectWrapper(input);
  const ledger = inspectLedger(input);
  const guard = inspectGuard(input);
  const hoisted =
    input.standing !== true &&
    ((fuse.blown && !fuse.stillAlivePrinted) ||
      ledger.exit144 ||
      input.hoisted === true);
  const standing =
    input.standing === true &&
    hoisted !== true &&
    fuse.stillAlivePrinted &&
    !ledger.exit144;
  const path =
    argv.leaked &&
    (input.event === "wrapper-argv" || input.wrapperArgv === true);
  return {
    fuse,
    argv,
    wrapper,
    ledger,
    guard,
    stations: TRENCH_STATIONS,
    hoisted: hoisted && !standing && !path,
    standing:
      standing ||
      (fuse.stillAlivePrinted &&
        !ledger.exit144 &&
        input.hoisted !== true &&
        input.wrapperArgv !== true),
    wrapperArgv: path && !standing,
    mark:
      path && !standing
        ? "wrapper-argv"
        : hoisted && !standing
          ? "hoisted"
          : "standing",
  };
}

/**
 * Published petard walk from #93607 only. Facts from the issue text.
 * A standing booth keeps the wrapper alive and prints still alive.
 * A hoisted booth kills the wrapper via pkill -f matching argv.
 * A wrapper-argv booth names the leaked command text as the charge.
 */
export const PETARD_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-standing",
    standing: true,
    hoisted: false,
    wrapperAlive: true,
    stillAlive: true,
    cue: "standing",
    note: "idle HOLD: wrapper shell still alive; command completes; still alive prints",
  },
  {
    t: "start",
    event: "start-sleep",
    hoisted: true,
    startSleep: true,
    cue: "hoisted",
    note: "nohup sleep 3979 >/dev/null 2>&1 & echo started",
  },
  {
    t: "pkill",
    event: "pkill-f",
    hoisted: true,
    pkillF: true,
    cue: "hoisted",
    note: 'pkill -f "sleep 3979"; echo still alive',
  },
  {
    t: "blast",
    event: "wrapper-killed",
    hoisted: true,
    wrapperKilled: true,
    cue: "hoisted",
    note: "wrapper shell killed because the pattern sits in that wrapper's argv",
  },
  {
    t: "exit",
    event: "exit-144",
    hoisted: true,
    exit144: true,
    isError: true,
    cue: "hoisted",
    note: "Exit 144 / is_error true; nothing after the pkill runs",
  },
  {
    t: "alive",
    event: "still-alive-missing",
    hoisted: true,
    stillAliveMissing: true,
    cue: "hoisted",
    note: "still alive never prints",
  },
  {
    t: "pgrep",
    event: "pgrep-wrapper",
    hoisted: true,
    pgrepWrapper: true,
    pgrepUnwrapped: true,
    cue: "hoisted",
    note: "pgrep -af returns the wrapper shell even with no sleep alive",
  },
  {
    t: "phantom",
    event: "phantom-pid",
    hoisted: true,
    phantomPid: true,
    changingPid: true,
    cue: "hoisted",
    note: "wrapper PID changes every call → phantom PIDs",
  },
  {
    t: "guard",
    event: "cli-guard-only",
    hoisted: true,
    cliGuardOnly: true,
    wrapperUnchecked: true,
    cue: "hoisted",
    note: "2.1.214 refuses only when the pattern matches $CLAUDE_PID; wrapper $$ unchecked",
  },
  {
    t: "macos",
    event: "macos-ancestors-ok",
    hoisted: true,
    macosAncestorsOk: true,
    cue: "hoisted",
    note: "macOS BSD pgrep/pkill exclude calling process AND ancestors — same command kills only the target",
  },
  {
    t: "bracket",
    event: "bracket-partial",
    hoisted: true,
    bracketPartial: true,
    cue: "hoisted",
    note: "bracket idiom [3]979 only helps when target started in an earlier call",
  },
  {
    t: "same",
    event: "same-call-dies",
    hoisted: true,
    sameCallDies: true,
    cue: "hoisted",
    note: "same-call start+kill still dies",
  },
  {
    t: "path",
    event: "wrapper-argv",
    hoisted: true,
    wrapperArgv: true,
    argvLeak: true,
    evalInArgv: true,
    cue: "hoisted",
    note: "wrapper-argv — the full command text lives in the live wrapper argv",
  },
  {
    t: "score",
    event: "petard",
    hoisted: true,
    wrapperKilled: true,
    exit144: true,
    stillAliveMissing: true,
    argvLeak: true,
    cue: "hoisted",
    note: "petard — hoist with one's own petard; pkill -f blows the sapper",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "still-alive",
    standing: true,
    stillAlive: true,
    cue: "standing",
    note: "positive control: command completes; still alive prints",
  },
  {
    t: "wrapper",
    event: "cue-standing",
    standing: true,
    wrapperAlive: true,
    cue: "standing",
    note: "positive control: wrapper shell still alive",
  },
  {
    t: "macos",
    event: "macos-ancestors-ok",
    standing: true,
    macosAncestorsOk: true,
    cue: "standing",
    note: "positive control: macOS ancestors excluded — target only",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    standing: true,
    hoisted: false,
    wrapperAlive: true,
    stillAlive: true,
    cue: "standing",
  };
}

export function seedStanding() {
  return { ...emptyTicket() };
}

export function seedHoisted() {
  return {
    seed: SEEDED_WORD,
    standing: false,
    hoisted: true,
    startSleep: true,
    pkillF: true,
    wrapperKilled: true,
    exit144: true,
    isError: true,
    stillAliveMissing: true,
    pgrepWrapper: true,
    phantomPid: true,
    changingPid: true,
    cliGuardOnly: true,
    wrapperUnchecked: true,
    pgrepUnwrapped: true,
    argvLeak: true,
    evalInArgv: true,
    linuxProcps: true,
    busyboxMatch: true,
    macosAncestorsOk: true,
    bracketPartial: true,
    sameCallDies: true,
    wrapperArgv: true,
    cue: "hoisted",
    issue: FEATURED_ISSUE,
    ledger: SAMPLE_LEDGER,
    fuse: SAMPLE_FUSE,
    argv: SAMPLE_ARGV,
    wrapper: SAMPLE_WRAPPER,
    guard: SAMPLE_GUARD,
  };
}

export function seedPetard() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    hoisted: true,
    wrapperKilled: true,
    exit144: true,
    stillAliveMissing: true,
    argvLeak: true,
    cue: "hoisted",
  };
}

export function seedWrapperArgv() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    hoisted: true,
    wrapperArgv: true,
    argvLeak: true,
    evalInArgv: true,
    event: "wrapper-argv",
    cue: "hoisted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    standing: true,
    cue: "standing",
  };
}

export function seedStillAlive() {
  return { seed: "still-alive", preferSeed: true, stillAlive: true, cue: "standing" };
}

export function seedExit144() {
  return { seed: "exit-144", preferSeed: true, exit144: true, cue: "hoisted" };
}

export function seedIsError() {
  return { seed: "is-error", preferSeed: true, isError: true, cue: "hoisted" };
}

export function seedPhantomPid() {
  return { seed: "phantom-pid", preferSeed: true, phantomPid: true, cue: "hoisted" };
}

export function seedChangingPid() {
  return { seed: "changing-pid", preferSeed: true, changingPid: true, cue: "hoisted" };
}

export function seedCliGuardOnly() {
  return { seed: "cli-guard-only", preferSeed: true, cliGuardOnly: true, cue: "hoisted" };
}

export function seedWrapperUnchecked() {
  return { seed: "wrapper-unchecked", preferSeed: true, wrapperUnchecked: true, cue: "hoisted" };
}

export function seedPgrepUnwrapped() {
  return { seed: "pgrep-unwrapped", preferSeed: true, pgrepUnwrapped: true, cue: "hoisted" };
}

export function seedArgvLeak() {
  return { seed: "argv-leak", preferSeed: true, argvLeak: true, cue: "hoisted" };
}

export function seedEvalInArgv() {
  return { seed: "eval-in-argv", preferSeed: true, evalInArgv: true, cue: "hoisted" };
}

export function seedLinuxProcps() {
  return { seed: "linux-procps", preferSeed: true, linuxProcps: true, cue: "hoisted" };
}

export function seedBusyboxMatch() {
  return { seed: "busybox-match", preferSeed: true, busyboxMatch: true, cue: "hoisted" };
}

export function seedMacosAncestorsOk() {
  return { seed: "macos-ancestors-ok", preferSeed: true, macosAncestorsOk: true, cue: "hoisted" };
}

export function seedBracketPartial() {
  return { seed: "bracket-partial", preferSeed: true, bracketPartial: true, cue: "hoisted" };
}

export function seedSameCallDies() {
  return { seed: "same-call-dies", preferSeed: true, sameCallDies: true, cue: "hoisted" };
}

export function seedFromFileOk() {
  return { seed: "from-file-ok", preferSeed: true, fromFileOk: true, cue: "hoisted" };
}

export function seedHeadlessRepeat() {
  return { seed: "headless-repeat", preferSeed: true, headlessRepeat: true, cue: "hoisted" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      standing: false,
      hoisted: false,
      wrapperArgv: false,
      wrapperAlive: false,
      stillAlive: false,
      startSleep: false,
      pkillF: false,
      wrapperKilled: false,
      exit144: false,
      isError: false,
      stillAliveMissing: false,
      pgrepWrapper: false,
      phantomPid: false,
      changingPid: false,
      cliGuardOnly: false,
      wrapperUnchecked: false,
      pgrepUnwrapped: false,
      argvLeak: false,
      evalInArgv: false,
      linuxProcps: false,
      busyboxMatch: false,
      macosAncestorsOk: false,
      bracketPartial: false,
      sameCallDies: false,
      fromFileOk: false,
      headlessRepeat: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    standing: raw.standing === true,
    hoisted:
      raw.hoisted === true ||
      raw.event === "hoisted" ||
      raw.event === "petard",
    wrapperArgv: raw.wrapperArgv === true || raw.event === "wrapper-argv",
    wrapperAlive: raw.wrapperAlive === true,
    stillAlive: raw.stillAlive === true || raw.event === "still-alive",
    startSleep: raw.startSleep === true || raw.event === "start-sleep",
    pkillF: raw.pkillF === true || raw.event === "pkill-f",
    wrapperKilled: raw.wrapperKilled === true || raw.event === "wrapper-killed",
    exit144: raw.exit144 === true || raw.event === "exit-144",
    isError: raw.isError === true || raw.event === "is-error",
    stillAliveMissing:
      raw.stillAliveMissing === true || raw.event === "still-alive-missing",
    pgrepWrapper: raw.pgrepWrapper === true || raw.event === "pgrep-wrapper",
    phantomPid: raw.phantomPid === true || raw.event === "phantom-pid",
    changingPid: raw.changingPid === true || raw.event === "changing-pid",
    cliGuardOnly: raw.cliGuardOnly === true || raw.event === "cli-guard-only",
    wrapperUnchecked:
      raw.wrapperUnchecked === true || raw.event === "wrapper-unchecked",
    pgrepUnwrapped: raw.pgrepUnwrapped === true || raw.event === "pgrep-unwrapped",
    argvLeak: raw.argvLeak === true || raw.event === "argv-leak",
    evalInArgv: raw.evalInArgv === true || raw.event === "eval-in-argv",
    linuxProcps: raw.linuxProcps === true || raw.event === "linux-procps",
    busyboxMatch: raw.busyboxMatch === true || raw.event === "busybox-match",
    macosAncestorsOk:
      raw.macosAncestorsOk === true || raw.event === "macos-ancestors-ok",
    bracketPartial: raw.bracketPartial === true || raw.event === "bracket-partial",
    sameCallDies: raw.sameCallDies === true || raw.event === "same-call-dies",
    fromFileOk: raw.fromFileOk === true || raw.event === "from-file-ok",
    headlessRepeat: raw.headlessRepeat === true || raw.event === "headless-repeat",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    fuse: raw.fuse,
    argv: raw.argv,
    wrapper: raw.wrapper,
    ledger: raw.ledger || raw.calls,
    guard: raw.guard,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.standing != null ||
        ticket.hoisted != null ||
        ticket.wrapperArgv != null ||
        ticket.wrapperAlive != null ||
        ticket.stillAlive != null ||
        ticket.wrapperKilled != null ||
        ticket.exit144 != null ||
        ticket.stillAliveMissing != null ||
        ticket.argvLeak != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.ledger ||
        ticket.fuse ||
        ticket.argv),
  );
}

function isStanding(row) {
  if (row.hoisted && row.cue !== "standing") return false;
  if (
    row.cue === "hoisted" ||
    row.cue === "petard" ||
    row.cue === "wrapper-argv"
  ) {
    return false;
  }
  if (
    row.wrapperKilled &&
    row.exit144 &&
    row.cue !== "standing" &&
    row.standing !== true
  ) {
    return false;
  }
  if (
    row.wrapperArgv &&
    row.argvLeak &&
    row.cue !== "standing" &&
    row.standing !== true
  ) {
    return false;
  }
  if (row.standing === true && row.hoisted !== true && row.cue !== "hoisted") {
    return true;
  }
  if (
    row.cue === "standing" &&
    row.hoisted !== true &&
    row.wrapperKilled !== true &&
    row.wrapperArgv !== true
  ) {
    return true;
  }
  if (
    (row.wrapperAlive === true || row.stillAlive === true) &&
    row.hoisted !== true &&
    row.wrapperKilled !== true &&
    row.exit144 !== true &&
    row.wrapperArgv !== true
  ) {
    return true;
  }
  return false;
}

function isWrapperArgvPath(row) {
  return (
    row.event === "wrapper-argv" &&
    !isStanding(row) &&
    (row.wrapperArgv === true || row.argvLeak === true || row.evalInArgv === true)
  );
}

function isHoisted(row) {
  if (isStanding(row)) return false;
  if (isWrapperArgvPath(row) && row.cue !== "hoisted") return false;
  if (row.cue === "hoisted" || row.cue === "petard") return true;
  if (row.hoisted === true) return true;
  if (
    row.wrapperKilled === true &&
    row.exit144 === true &&
    row.stillAliveMissing === true
  ) {
    return true;
  }
  if (row.pkillF === true && row.wrapperKilled === true) {
    return true;
  }
  if (
    row.exit144 === true ||
    row.stillAliveMissing === true ||
    row.phantomPid === true ||
    (row.argvLeak === true && row.linuxProcps === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one powder-charge pass against the petard booth.
 * standing: wrapper still alive; still alive prints.
 * hoisted: pkill -f kills the wrapper; exit 144; still alive missing.
 * wrapper-argv: the leaked command text in wrapper argv is the charge.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isWrapperArgvPath(row) ||
    (row.wrapperArgv && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "wrapper-argv";
  } else if (isHoisted(row)) {
    verdict = "hoisted";
  } else if (isStanding(row)) {
    verdict = "standing";
  } else if (
    row.wrapperKilled ||
    row.exit144 ||
    row.stillAliveMissing ||
    (row.argvLeak && !row.stillAlive)
  ) {
    verdict = "hoisted";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const fuse = inspectFuse(row);
  const argv = inspectArgv(row);
  const wrapper = inspectWrapper(row);
  const ledger = inspectLedger(row);
  const guard = inspectGuard(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    standing: verdict === "standing" || verdict === "hold",
    hoisted:
      verdict === "hoisted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    wrapperArgv:
      row.wrapperArgv === true ||
      verdict === "wrapper-argv" ||
      verdict === PATH_WORD,
    wrapperAlive: row.wrapperAlive,
    stillAlive: row.stillAlive,
    startSleep: row.startSleep,
    pkillF: row.pkillF,
    wrapperKilled: row.wrapperKilled,
    exit144: row.exit144,
    isError: row.isError,
    stillAliveMissing: row.stillAliveMissing,
    pgrepWrapper: row.pgrepWrapper,
    phantomPid: row.phantomPid,
    changingPid: row.changingPid,
    cliGuardOnly: row.cliGuardOnly,
    wrapperUnchecked: row.wrapperUnchecked,
    pgrepUnwrapped: row.pgrepUnwrapped,
    argvLeak: row.argvLeak,
    evalInArgv: row.evalInArgv,
    linuxProcps: row.linuxProcps,
    busyboxMatch: row.busyboxMatch,
    macosAncestorsOk: row.macosAncestorsOk,
    bracketPartial: row.bracketPartial,
    sameCallDies: row.sameCallDies,
    fromFileOk: row.fromFileOk,
    headlessRepeat: row.headlessRepeat,
    cue: hold
      ? "standing"
      : row.wrapperArgv || verdict === "wrapper-argv"
        ? "wrapper-argv"
        : "hoisted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit standing" : "score petard",
    fuseInspect: fuse,
    argvInspect: argv,
    wrapperInspect: wrapper,
    ledgerInspect: ledger,
    guardInspect: guard,
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
      : PETARD_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const hoisted = scored.filter((row) => row.verdict === "hoisted");
  const path = scored.filter((row) => row.verdict === "wrapper-argv");
  const standing = scored.filter((row) => row.verdict === "standing");
  const headline =
    scored.find((row) => row.event === "hoisted") ||
    scored.find((row) => row.event === "wrapper-argv") ||
    scored.find((row) => row.event === "exit-144") ||
    hoisted[hoisted.length - 1];
  let verdict = "standing";
  if (hoisted.length) verdict = "hoisted";
  else if (path.length && !standing.length) verdict = "wrapper-argv";
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
    hoistedCount: hoisted.length,
    pathCount: path.length,
    standingCount: standing.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit standing" : "score petard",
    note: headline
      ? "Claude Code Bash tool on Linux; pkill -f matches wrapper argv; Exit 144; still alive never prints; pgrep returns wrapper; 2.1.214 CLI-only guard; macOS ancestors OK."
      : "published petard walk scored against standing vs hoisted",
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
    seeded !== "standing" &&
    seeded !== "hoisted" &&
    seeded !== "wrapper-argv" &&
    seeded !== "petard" &&
    ticket.standing == null &&
    ticket.hoisted == null &&
    ticket.wrapperKilled == null &&
    ticket.wrapperArgv == null &&
    ticket.exit144 == null &&
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
    standing: scored.standing ?? false,
    hoisted: scored.hoisted ?? false,
    wrapperArgv: scored.wrapperArgv ?? false,
    wrapperAlive: scored.wrapperAlive ?? false,
    stillAlive: scored.stillAlive ?? false,
    wrapperKilled: scored.wrapperKilled ?? false,
    exit144: scored.exit144 ?? false,
    isError: scored.isError ?? false,
    stillAliveMissing: scored.stillAliveMissing ?? false,
    phantomPid: scored.phantomPid ?? false,
    cliGuardOnly: scored.cliGuardOnly ?? false,
    argvLeak: scored.argvLeak ?? false,
    evalInArgv: scored.evalInArgv ?? false,
    linuxProcps: scored.linuxProcps ?? false,
    sameCallDies: scored.sameCallDies ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.stillAlive || result.standing ? "fuse=standing" : "fuse=blown",
    result.argvLeak || result.hoisted ? "argv=leaked" : "argv=clean",
    result.wrapperKilled || result.hoisted ? "wrapper=blown-back" : "wrapper=standing",
    result.exit144 || result.hoisted ? "ledger=blast" : "ledger=standing",
    result.cliGuardOnly || result.hoisted ? "guard=cli-only" : "guard=covered",
    result.wrapperArgv || result.verdict === "wrapper-argv"
      ? "path=wrapper-argv"
      : "path=standing",
    result.cue === "standing"
      ? "cue=standing"
      : result.cue === "wrapper-argv"
        ? "cue=wrapper-argv"
        : "cue=hoisted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    standing: result.standing,
    hoisted: result.hoisted,
    wrapperArgv: result.wrapperArgv,
    wrapperAlive: result.wrapperAlive,
    stillAlive: result.stillAlive,
    wrapperKilled: result.wrapperKilled,
    exit144: result.exit144,
    stillAliveMissing: result.stillAliveMissing,
    argvLeak: result.argvLeak,
    evalInArgv: result.evalInArgv,
    linuxProcps: result.linuxProcps,
    cliGuardOnly: result.cliGuardOnly,
    fuse: input && input.fuse,
    argv: input && input.argv,
    wrapper: input && input.wrapper,
    ledger: input && input.ledger,
    guard: input && input.guard,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    fuse: inspectFuse({
      standing: result.standing,
      hoisted: result.hoisted,
      wrapperKilled: result.wrapperKilled,
      stillAlive: result.stillAlive,
      exit144: result.exit144,
      wrapperArgv: result.wrapperArgv,
      fuse: input && input.fuse,
    }),
    argv: inspectArgv({
      standing: result.standing,
      hoisted: result.hoisted,
      argvLeak: result.argvLeak,
      evalInArgv: result.evalInArgv,
      wrapperArgv: result.wrapperArgv,
      linuxProcps: result.linuxProcps,
      argv: input && input.argv,
    }),
    wrapper: inspectWrapper({
      standing: result.standing,
      wrapperKilled: result.wrapperKilled,
      exit144: result.exit144,
      hoisted: result.hoisted,
      linuxProcps: result.linuxProcps,
      wrapperAlive: result.wrapperAlive,
      wrapper: input && input.wrapper,
    }),
    ledger: inspectLedger({
      exit144: result.exit144,
      stillAliveMissing: result.stillAliveMissing,
      hoisted: result.hoisted,
      standing: result.standing,
      ledger: input && input.ledger,
    }),
    guard: inspectGuard({
      cliGuardOnly: result.cliGuardOnly,
      wrapperUnchecked: result.wrapperUnchecked,
      hoisted: result.hoisted,
      guard: input && input.guard,
    }),
    stations: TRENCH_STATIONS.map((row) => ({
      ...row,
      hoisted: result.hoisted === true || result.verdict === "hoisted",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      guardVersion: GUARD_VERSION,
      os: OS,
      tool: TOOL,
      wrapper: WRAPPER,
      pattern: PATTERN,
      startCmd: START_CMD,
      pkillCmd: PKILL_CMD,
      pgrepCmd: PGREP_CMD,
      exitCode: EXIT_CODE,
      stillAlive: STILL_ALIVE,
      bracketIdiom: BRACKET_IDIOM,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      calls: SAMPLE_CALLS,
      distros: SAMPLE_DISTROS,
      stations: TRENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "pkill -f / pgrep -f should not match the Bash-tool wrapper argv; still alive should print; wrapper $$ should be guarded like $CLAUDE_PID",
      ],
      hypothesis:
        "NON-BINDING: command text should leave argv (env/stdin/tempfile) or pkill/pgrep guards must cover wrapper $$. Verify against #93607 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
