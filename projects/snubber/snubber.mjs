#!/usr/bin/env node
/**
 * Snubber — hydraulic / pneumatic pulse-damper booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * a sandboxed Bash command SIGKILLed while it has a network
 * connection open leaks the accepted socket inside Claude Code.
 * The event loop then writes to that dead socket forever, gets
 * EPIPE every time, and never closes it or backs off. One leaked
 * fd costs a full core for the life of the process. The reporter
 * had four sessions doing this at once.
 *
 *   node snubber.mjs data/spinning.json
 *   echo '{"seed":"spinning"}' | node snubber.mjs
 *
 * Idle word is damped (HOLD: peer closes clean; mux listener
 * only; no EPIPE spin).
 * Seeded word is spinning (#93398: kill -9 mid-stream → leaked
 * accepted fd → EPIPE busy-spin).
 * Path word is mux.
 * Product score word is snubber (score snubber or admit damped).
 *
 * Encoded from anthropics/claude-code#93398 issue body only.
 * Hypothesis (NON-BINDING): SOCKS mux relay fails to tear down
 * accepted peer fd on abrupt client death, so the main-thread
 * write loop busy-spins on EPIPE. Verify against #93398 text
 * only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "damped",
  "spinning",
  "snubber",
  "mux",
  "hold",
  "listener-only",
  "leaked-fd",
  "epipe",
  "kill-9",
  "socks5",
  "srt-mux",
  "kevent64",
  "sendto",
  "int32-max",
  "four-sessions",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "damped";
export const PATH_WORD = "mux";
export const SEEDED_WORD = "spinning";
export const PRODUCT_WORD = "snubber";
export const HOLD = Object.freeze(["damped", "hold"]);
export const RECOVER = Object.freeze(["damped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "fosse",
  "fossed",
  "mounted",
  "plan9",
  "hibernacle",
  "warm",
  "paged-out",
  "majflt",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
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
  "freehold",
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
  "ephemera",
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
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
  "precedence",
  "carrier",
  "moored",
  "primed",
  "raised",
  "preserved",
  "banked",
  "flashed",
  "fallen",
  "scaffold",
  "wedged",
  "bridge-loss",
  "mismatched-header",
  "header-mismatch",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "spinning" && name !== "snubber"),
);

export const FEATURED_ISSUE = 93398;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93398";
export const TITLE =
  "Killed sandboxed command leaks its SOCKS socket; main thread then spins on EPIPE at 100%+ CPU";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "perf:cpu",
  "area:sandbox",
]);
export const AUTHOR = "STRML";
export const FILED = "2026-09-10T16:32:30Z";
export const VERSION_FIRST = "2.1.226";
export const VERSION_STILL = "2.1.267";
export const FIRST_REPORT = "2026-08-11";
export const OS = "macOS 26.6.1";
export const BUILD = "25G76";
export const ARCH = "arm64";
export const SUPERSEDES = 85666;
export const MUX_SOCK = "srt-mux-<pid>-<n>.sock";
export const MUX_EXAMPLE = "srt-mux-37591-0.sock";
export const IDLE_FDS = 1;
export const LEAKED_FDS = 6;
export const CPU_BEFORE = "6%";
export const CPU_AFTER = "128%";
export const SYSCALLS = "3.2 million per second";
export const EPIPE_ERRNO = 32;
export const SAMPLE_KEVENT = "56%";
export const SAMPLE_SENDTO = "20%";
export const SAMPLE_ULOCK = "17%";
export const INT32_MAX = 2147483647;
export const STUCK_HOURS = 7;
export const FS_USAGE_FAILS = 4000;
export const ROUND_ROBIN_FDS = 6;
export const ATTEMPTS_EACH = 667;
export const WINDOW_MS = 7.055;
export const LSOF_CMD = "lsof -nP -p <claude pid> | grep srt-mux";
export const REPRO_CMD =
  "for i in 1 2 3 4 5; do ( <limit-rate fetch to allowlisted host> & p=$!; sleep 1.5; kill -9 $p ); done";
export const REPRO_HOST = "https://models.dev/api.json";
export const REPRO_LIMIT_RATE = 200;
export const REPRO_TIMEOUT = 60;
export const CLEAN_PARALLEL = 8;
export const CLEAN_SERIAL = 10;
export const PHRASE =
  "when a sandboxed command is SIGKILLed mid-stream and the mux relay leaves the accepted peer fd open so the write loop busy-spins on EPIPE, score snubber or admit damped.";

export const ACCUMULATOR_STATIONS = Object.freeze([
  {
    id: "listener-only",
    survey: "read the mux listener",
    kind: "listener",
    note: "healthy session holds one fd — the srt-mux listener",
  },
  {
    id: "pulse-canister",
    survey: "charge the snubber canister",
    kind: "damper",
    note: "peer close should snub the shock; clean exits keep fd count at 1",
  },
  {
    id: "kill-cock",
    survey: "open the kill-9 cock mid-stream",
    kind: "kill",
    note: "kill -9 while a limit-rate connection is still open",
  },
  {
    id: "epipe-gauge",
    survey: "watch the EPIPE gauge thrash",
    kind: "spin",
    note: "sendto returns [ 32 ] EPIPE; kqueue still reports writable",
  },
]);

export const FD_TABLE = Object.freeze([
  { pid: 37591, fds: 7, cpu: "135%" },
  { pid: 36403, fds: 5, cpu: "127%" },
  { pid: 14989, fds: 2, cpu: "142%" },
  { pid: 56907, fds: 1, cpu: "6.5%" },
  { pid: 8276, fds: 1, cpu: "10.8%" },
  { pid: 63270, fds: 1, cpu: "2.9%" },
]);

export const SAMPLE_FRAMES = Object.freeze([
  { samples: 2225, share: "56%", frame: "kevent64" },
  { samples: 781, share: "20%", frame: "__sendto" },
  { samples: 683, share: "17%", frame: "__ulock_wake" },
  { samples: 300, share: "7%", frame: "everything else, including all JS" },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "listener-only",
  "leaked-fd",
  "epipe",
  "kill-9",
  "socks5",
  "srt-mux",
  "kevent64",
  "sendto",
]);

export const COUSINS = Object.freeze([
  {
    issue: 85666,
    title:
      "stale-closed after 30 days despite has repro; superseded by #93398",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — stale bot marked not planned; do not rebuild as this product",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93368,
    title: "Docker ~/.docker symlinks refuse plugin eval",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93392,
    title: "rm-on-variable-path under bypassPermissions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93382,
    title: "worktreeDepSeed freeze",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93385,
    title: "Cowork auto-repair vhdx",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93356,
    title: "hooks fail on Windows username with space",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93345,
    title: "RC worktrees deleted before archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "fosse",
  "hibernacle",
  "scapegoat",
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
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
  "ephemera",
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
  "flashpan",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
  "damper",
  "snub",
  "ferrule",
]);

/**
 * Read the mux listener — healthy session holds one fd.
 */
export function inspectMuxListener(input = {}) {
  const fds = Number(input.fds ?? input.muxFds ?? input.listenerFds ?? 0);
  const listenerOnly =
    input.listenerOnly === true ||
    fds === IDLE_FDS ||
    input.idleFds === true;
  const healthy =
    listenerOnly &&
    input.peerGone !== true &&
    input.epipe !== true &&
    input.kill9 !== true;
  return {
    fds: fds || (listenerOnly ? IDLE_FDS : 0),
    listenerOnly: listenerOnly || healthy,
    stamp: healthy || listenerOnly ? "listener-only" : "leaked-fd",
  };
}

/**
 * Sound leaked accepted peers after abrupt client death.
 */
export function inspectLeakedPeer(input = {}) {
  const fds = Number(input.fds ?? input.muxFds ?? 0);
  const leaked =
    input.leakedFd === true ||
    input.peerGone === true ||
    input.kill9 === true ||
    fds > IDLE_FDS ||
    fds === LEAKED_FDS;
  const kill9 =
    input.kill9 === true ||
    input.sigkill === true ||
    input.midStream === true;
  return {
    leaked: leaked && input.peerClosed !== true,
    kill9: kill9 && leaked,
    fds: fds || (leaked ? LEAKED_FDS : IDLE_FDS),
    stamp: leaked && input.peerClosed !== true ? "spinning" : "damped",
  };
}

/**
 * Read the EPIPE write-loop gauge.
 */
export function inspectEpipeSpin(input = {}) {
  const epipe =
    input.epipe === true ||
    input.epipeSpin === true ||
    Number(input.errno) === EPIPE_ERRNO ||
    Boolean(input.sendto && String(input.sendto).includes("EPIPE"));
  const spin =
    epipe ||
    input.keventSpin === true ||
    input.busySpin === true ||
    input.cpuPeg === true;
  return {
    epipe: epipe && input.peerClosed !== true,
    spin: spin && input.peerClosed !== true,
    errno: epipe ? EPIPE_ERRNO : 0,
    stamp: spin && input.peerClosed !== true ? "spinning" : "damped",
  };
}

export function readSnubber(input = {}) {
  const listener = inspectMuxListener(input);
  const leak = inspectLeakedPeer(input);
  const gauge = inspectEpipeSpin(input);
  const spinning =
    leak.stamp === "spinning" ||
    gauge.stamp === "spinning" ||
    input.spinning === true;
  const damped =
    input.damped === true &&
    spinning !== true &&
    leak.stamp === "damped";
  return {
    listener,
    leak,
    gauge,
    stations: ACCUMULATOR_STATIONS,
    spinning: spinning && !damped,
    damped:
      damped ||
      (leak.stamp === "damped" && !spinning && input.spinning !== true),
    mark: spinning && !damped ? "spinning" : "damped",
  };
}

/**
 * Published snubber walk from #93398 only. Facts from the issue body.
 * A damped canister keeps the mux listener only and peers close
 * clean. A spinning canister leaves the accepted peer fd open
 * after kill -9 mid-stream so the write loop busy-spins on EPIPE.
 */
export const SNUBBER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-damped",
    damped: true,
    listenerOnly: true,
    fds: IDLE_FDS,
    peerClosed: true,
    spinning: false,
    epipe: false,
    cue: "damped",
    note: "idle HOLD: peer closes clean; mux listener only; no EPIPE spin",
  },
  {
    t: "clean",
    event: "clean-exits",
    damped: true,
    listenerOnly: true,
    fds: IDLE_FDS,
    peerClosed: true,
    cleanParallel: CLEAN_PARALLEL,
    cleanSerial: CLEAN_SERIAL,
    cue: "damped",
    note: "8 parallel and 10 serial sandbox fetches — fd count never moved off 1",
  },
  {
    t: "sandbox",
    event: "sandbox-on",
    damped: true,
    sandboxOn: true,
    allowlisted: true,
    cue: "damped",
    note: "Bash tool with sandbox on, against an allowlisted host",
  },
  {
    t: "rate",
    event: "limit-rate",
    damped: true,
    limitRate: REPRO_LIMIT_RATE,
    timeout: REPRO_TIMEOUT,
    cue: "damped",
    note: "spawn a limit-rate fetch so the connection stays open long enough to kill",
  },
  {
    t: "kill",
    event: "kill-9",
    spinning: true,
    kill9: true,
    sigkill: true,
    midStream: true,
    cue: "spinning",
    note: "kill -9 the child while the connection is still open — die without closing",
  },
  {
    t: "lsof",
    event: "leaked-fd",
    spinning: true,
    leakedFd: true,
    peerGone: true,
    fds: LEAKED_FDS,
    cue: "spinning",
    note: "lsof on srt-mux: before 1 listener; after 6 — one leaked fd per killed child",
  },
  {
    t: "cpu",
    event: "cpu-jump",
    spinning: true,
    cpuPeg: true,
    cpuBefore: CPU_BEFORE,
    cpuAfter: CPU_AFTER,
    cue: "spinning",
    note: "CPU jumped ~6% → 128% the moment the fds leaked and stayed there",
  },
  {
    t: "sys",
    event: "sysbsd",
    spinning: true,
    sysbsd: true,
    syscalls: SYSCALLS,
    cue: "spinning",
    note: "BSD syscalls climbing at 3.2 million per second",
  },
  {
    t: "gauge",
    event: "epipe-spin",
    spinning: true,
    epipe: true,
    epipeSpin: true,
    errno: EPIPE_ERRNO,
    sendto: "EPIPE",
    cue: "spinning",
    note: "sendto F=* [ 32 ] EPIPE; six fds round-robin; never closes or backs off",
  },
  {
    t: "kqueue",
    event: "kevent64-spin",
    spinning: true,
    keventSpin: true,
    cue: "spinning",
    note: "kevent64 returns immediately instead of sleeping — a spin, not an idle wait",
  },
  {
    t: "hours",
    event: "int32-max",
    spinning: true,
    int32Max: true,
    stuckHours: STUCK_HOURS,
    cue: "spinning",
    note: "after seven hours CSW and SYSBSD saturated at INT32_MAX",
  },
  {
    t: "stack",
    event: "four-sessions",
    spinning: true,
    fourSessions: true,
    cue: "spinning",
    note: "four sessions doing this at once — one leaked fd pegs a core each",
  },
  {
    t: "cut",
    event: "spinning",
    damped: false,
    spinning: true,
    kill9: true,
    leakedFd: true,
    peerGone: true,
    epipe: true,
    fds: LEAKED_FDS,
    cue: "spinning",
    note: "#93398: kill -9 mid-stream → leaked accepted fd → EPIPE busy-spin",
  },
  {
    t: "path",
    event: "mux",
    spinning: true,
    mux: true,
    socks5: true,
    cue: "spinning",
    note: "mux — srt-mux unix SOCKS5 proxy path; accepted peer left open",
  },
  {
    t: "score",
    event: "snubber",
    spinning: true,
    mux: true,
    cue: "spinning",
    note: "snubber — score the canister that never snubbed the dead peer",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    damped: true,
    listenerOnly: true,
    fds: IDLE_FDS,
    peerClosed: true,
    spinning: false,
    epipe: false,
    cue: "damped",
  };
}

export function seedDamped() {
  return { ...emptyTicket() };
}

export function seedSpinning() {
  return {
    seed: SEEDED_WORD,
    damped: false,
    spinning: true,
    kill9: true,
    sigkill: true,
    midStream: true,
    leakedFd: true,
    peerGone: true,
    epipe: true,
    epipeSpin: true,
    errno: EPIPE_ERRNO,
    sendto: "EPIPE",
    fds: LEAKED_FDS,
    muxFds: LEAKED_FDS,
    cpuPeg: true,
    keventSpin: true,
    cue: "spinning",
    issue: FEATURED_ISSUE,
  };
}

export function seedSnubber() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    spinning: true,
    mux: true,
    cue: "spinning",
  };
}

export function seedMux() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    spinning: true,
    mux: true,
    socks5: true,
    cue: "spinning",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    damped: true,
    cue: "damped",
  };
}

export function seedListenerOnly() {
  return {
    seed: "listener-only",
    preferSeed: true,
    listenerOnly: true,
    cue: "damped",
  };
}

export function seedLeakedFd() {
  return {
    seed: "leaked-fd",
    preferSeed: true,
    leakedFd: true,
    cue: "spinning",
  };
}

export function seedEpipe() {
  return {
    seed: "epipe",
    preferSeed: true,
    epipe: true,
    cue: "spinning",
  };
}

export function seedKill9() {
  return {
    seed: "kill-9",
    preferSeed: true,
    kill9: true,
    cue: "spinning",
  };
}

export function seedSocks5() {
  return {
    seed: "socks5",
    preferSeed: true,
    socks5: true,
    cue: "spinning",
  };
}

export function seedSrtMux() {
  return {
    seed: "srt-mux",
    preferSeed: true,
    mux: true,
    cue: "spinning",
  };
}

export function seedKevent64() {
  return {
    seed: "kevent64",
    preferSeed: true,
    keventSpin: true,
    cue: "spinning",
  };
}

export function seedSendto() {
  return {
    seed: "sendto",
    preferSeed: true,
    epipe: true,
    sendto: "EPIPE",
    cue: "spinning",
  };
}

export function seedInt32Max() {
  return {
    seed: "int32-max",
    preferSeed: true,
    int32Max: true,
    cue: "spinning",
  };
}

export function seedFourSessions() {
  return {
    seed: "four-sessions",
    preferSeed: true,
    fourSessions: true,
    cue: "spinning",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      damped: false,
      spinning: false,
      mux: false,
      listenerOnly: false,
      leakedFd: false,
      peerGone: false,
      peerClosed: false,
      kill9: false,
      sigkill: false,
      midStream: false,
      epipe: false,
      epipeSpin: false,
      keventSpin: false,
      busySpin: false,
      cpuPeg: false,
      socks5: false,
      int32Max: false,
      fourSessions: false,
      sandboxOn: false,
      allowlisted: false,
      fds: null,
      muxFds: null,
      errno: null,
      sendto: null,
      cpuBefore: null,
      cpuAfter: null,
      syscalls: null,
      limitRate: null,
      timeout: null,
      cleanParallel: null,
      cleanSerial: null,
      stuckHours: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    damped: raw.damped === true,
    spinning: raw.spinning === true,
    mux: raw.mux === true,
    listenerOnly: raw.listenerOnly === true,
    leakedFd: raw.leakedFd === true,
    peerGone: raw.peerGone === true,
    peerClosed: raw.peerClosed === true,
    kill9: raw.kill9 === true,
    sigkill: raw.sigkill === true,
    midStream: raw.midStream === true,
    epipe: raw.epipe === true,
    epipeSpin: raw.epipeSpin === true,
    keventSpin: raw.keventSpin === true,
    busySpin: raw.busySpin === true,
    cpuPeg: raw.cpuPeg === true,
    socks5: raw.socks5 === true,
    int32Max: raw.int32Max === true,
    fourSessions: raw.fourSessions === true,
    sandboxOn: raw.sandboxOn === true,
    allowlisted: raw.allowlisted === true,
    fds: raw.fds == null ? null : Number(raw.fds),
    muxFds: raw.muxFds == null ? null : Number(raw.muxFds),
    errno: raw.errno == null ? null : Number(raw.errno),
    sendto: raw.sendto == null ? null : raw.sendto,
    cpuBefore: raw.cpuBefore == null ? null : raw.cpuBefore,
    cpuAfter: raw.cpuAfter == null ? null : raw.cpuAfter,
    syscalls: raw.syscalls == null ? null : raw.syscalls,
    limitRate: raw.limitRate == null ? null : Number(raw.limitRate),
    timeout: raw.timeout == null ? null : Number(raw.timeout),
    cleanParallel:
      raw.cleanParallel == null ? null : Number(raw.cleanParallel),
    cleanSerial: raw.cleanSerial == null ? null : Number(raw.cleanSerial),
    stuckHours: raw.stuckHours == null ? null : Number(raw.stuckHours),
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.damped != null ||
        ticket.spinning != null ||
        ticket.mux != null ||
        ticket.listenerOnly != null ||
        ticket.leakedFd != null ||
        ticket.epipe != null ||
        ticket.kill9 != null ||
        ticket.peerGone != null ||
        ticket.keventSpin != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isDamped(row) {
  if (row.spinning && row.cue !== "damped") return false;
  if (
    row.cue === "spinning" ||
    row.cue === "snubber" ||
    row.cue === "mux"
  ) {
    return false;
  }
  if (row.epipe && row.cue !== "damped") return false;
  if (row.leakedFd && row.cue !== "damped") return false;
  if (row.kill9 && row.cue !== "damped") return false;
  if (
    row.damped === true &&
    row.spinning !== true &&
    row.cue !== "spinning"
  ) {
    return true;
  }
  if (
    row.cue === "damped" &&
    row.spinning !== true &&
    row.epipe !== true &&
    row.leakedFd !== true
  ) {
    return true;
  }
  if (
    row.listenerOnly === true &&
    row.peerClosed === true &&
    row.spinning !== true &&
    row.epipe !== true &&
    row.leakedFd !== true
  ) {
    return true;
  }
  return false;
}

function isSpinning(row) {
  if (isDamped(row)) return false;
  if (row.cue === "spinning" || row.cue === "snubber") return true;
  if (row.spinning === true) return true;
  if (
    row.epipe === true ||
    row.leakedFd === true ||
    row.fds === LEAKED_FDS ||
    row.kill9 === true
  ) {
    return true;
  }
  if (
    row.peerGone &&
    (row.keventSpin || row.cpuPeg) &&
    row.peerClosed !== true
  ) {
    return true;
  }
  return false;
}

function isMuxPath(row) {
  return (
    row.event === "mux" &&
    !isDamped(row) &&
    (row.spinning === true || row.mux === true || row.socks5 === true)
  );
}

/**
 * Score one accumulator pass against the snubber booth.
 * damped: peer closes clean; mux listener only; no EPIPE spin.
 * spinning: kill -9 mid-stream; leaked accepted fd; EPIPE busy-spin.
 * mux: named path — srt-mux unix SOCKS5 proxy.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMuxPath(row) ||
    (row.mux && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mux";
  } else if (isSpinning(row)) {
    verdict = "spinning";
  } else if (isDamped(row)) {
    verdict = "damped";
  } else if (
    row.epipe ||
    row.leakedFd ||
    row.kill9 ||
    row.keventSpin ||
    row.cpuPeg ||
    row.peerGone
  ) {
    verdict = "spinning";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const listener = inspectMuxListener(row);
  const leak = inspectLeakedPeer(row);
  const gauge = inspectEpipeSpin(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    damped: verdict === "damped" || verdict === "hold",
    spinning:
      verdict === "spinning" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    mux:
      row.mux === true ||
      verdict === "mux" ||
      verdict === PATH_WORD,
    listenerOnly: row.listenerOnly,
    leakedFd: row.leakedFd,
    peerGone: row.peerGone,
    peerClosed: row.peerClosed,
    kill9: row.kill9,
    sigkill: row.sigkill,
    midStream: row.midStream,
    epipe: row.epipe,
    epipeSpin: row.epipeSpin,
    keventSpin: row.keventSpin,
    busySpin: row.busySpin,
    cpuPeg: row.cpuPeg,
    socks5: row.socks5,
    int32Max: row.int32Max,
    fourSessions: row.fourSessions,
    sandboxOn: row.sandboxOn,
    allowlisted: row.allowlisted,
    fds: row.fds,
    muxFds: row.muxFds,
    errno: row.errno,
    sendto: row.sendto,
    cpuBefore: row.cpuBefore,
    cpuAfter: row.cpuAfter,
    syscalls: row.syscalls,
    limitRate: row.limitRate,
    timeout: row.timeout,
    cleanParallel: row.cleanParallel,
    cleanSerial: row.cleanSerial,
    stuckHours: row.stuckHours,
    cue: hold ? "damped" : "spinning",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit damped" : "score snubber",
    listener,
    leak,
    gauge,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : SNUBBER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const spinning = scored.filter((row) => row.verdict === "spinning");
  const path = scored.filter((row) => row.verdict === "mux");
  const damped = scored.filter((row) => row.verdict === "damped");
  const headline =
    scored.find((row) => row.event === "spinning") ||
    scored.find((row) => row.event === "epipe-spin") ||
    scored.find((row) => row.event === "mux") ||
    spinning[spinning.length - 1];
  let verdict = "damped";
  if (spinning.length) verdict = "spinning";
  else if (path.length && !damped.length) verdict = "mux";
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
    spinningCount: spinning.length,
    pathCount: path.length,
    dampedCount: damped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit damped" : "score snubber",
    note: headline
      ? "Claude Code 2.1.226 then 2.1.267; macOS 26.6.1 arm64; kill -9 mid-stream leaks srt-mux accepted fd; write loop EPIPE busy-spin."
      : "published snubber walk scored against damped vs spinning",
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
    seeded !== "damped" &&
    seeded !== "spinning" &&
    seeded !== "mux" &&
    seeded !== "snubber" &&
    ticket.damped == null &&
    ticket.spinning == null &&
    ticket.mux == null &&
    ticket.epipe == null &&
    ticket.leakedFd == null &&
    ticket.kill9 == null &&
    ticket.listenerOnly == null &&
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
    damped: scored.damped ?? false,
    spinning: scored.spinning ?? false,
    mux: scored.mux ?? false,
    listenerOnly: scored.listenerOnly ?? false,
    leakedFd: scored.leakedFd ?? false,
    epipe: scored.epipe ?? false,
    kill9: scored.kill9 ?? false,
    peerGone: scored.peerGone ?? false,
    keventSpin: scored.keventSpin ?? false,
    cpuPeg: scored.cpuPeg ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.listenerOnly || result.fds === IDLE_FDS
      ? "mux=listener"
      : "mux=leaked",
    result.leakedFd || result.fds === LEAKED_FDS ? "fd=leaked" : "fd=one",
    result.epipe ? "write=epipe" : "write=quiet",
    result.kill9 ? "peer=kill-9" : "peer=closed",
    result.cue === "damped" ? "cue=damped" : "cue=spinning",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const desk = readSnubber({
    damped: result.damped,
    spinning: result.spinning,
    listenerOnly: result.listenerOnly,
    fds: result.fds,
    muxFds: result.muxFds,
    leakedFd: result.leakedFd,
    peerGone: result.peerGone,
    peerClosed: result.peerClosed,
    kill9: result.kill9,
    sigkill: result.sigkill,
    midStream: result.midStream,
    epipe: result.epipe,
    epipeSpin: result.epipeSpin,
    errno: result.errno,
    sendto: result.sendto,
    keventSpin: result.keventSpin,
    cpuPeg: result.cpuPeg,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    desk,
    listener: inspectMuxListener({
      fds: result.fds,
      listenerOnly: result.listenerOnly,
      idleFds: result.damped,
    }),
    leak: inspectLeakedPeer({
      fds: result.fds,
      leakedFd: result.leakedFd,
      peerGone: result.peerGone,
      kill9: result.kill9,
      sigkill: result.sigkill,
      midStream: result.midStream,
      peerClosed: result.peerClosed,
    }),
    gauge: inspectEpipeSpin({
      epipe: result.epipe,
      epipeSpin: result.epipeSpin,
      errno: result.errno,
      sendto: result.sendto,
      keventSpin: result.keventSpin,
      cpuPeg: result.cpuPeg,
      peerClosed: result.peerClosed,
    }),
    stations: ACCUMULATOR_STATIONS.map((row) => ({
      ...row,
      spinning: result.spinning === true || result.verdict === "spinning",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      versionFirst: VERSION_FIRST,
      versionStill: VERSION_STILL,
      firstReport: FIRST_REPORT,
      os: OS,
      build: BUILD,
      arch: ARCH,
      supersedes: SUPERSEDES,
      muxSock: MUX_SOCK,
      muxExample: MUX_EXAMPLE,
      idleFds: IDLE_FDS,
      leakedFds: LEAKED_FDS,
      cpuBefore: CPU_BEFORE,
      cpuAfter: CPU_AFTER,
      syscalls: SYSCALLS,
      epipeErrno: EPIPE_ERRNO,
      sampleKevent: SAMPLE_KEVENT,
      sampleSendto: SAMPLE_SENDTO,
      sampleUlock: SAMPLE_ULOCK,
      int32Max: INT32_MAX,
      stuckHours: STUCK_HOURS,
      fsUsageFails: FS_USAGE_FAILS,
      roundRobinFds: ROUND_ROBIN_FDS,
      attemptsEach: ATTEMPTS_EACH,
      windowMs: WINDOW_MS,
      lsofCmd: LSOF_CMD,
      reproCmd: REPRO_CMD,
      reproHost: REPRO_HOST,
      reproLimitRate: REPRO_LIMIT_RATE,
      reproTimeout: REPRO_TIMEOUT,
      cleanParallel: CLEAN_PARALLEL,
      cleanSerial: CLEAN_SERIAL,
      fdTable: FD_TABLE,
      sampleFrames: SAMPLE_FRAMES,
      stations: ACCUMULATOR_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "sendto returning EPIPE should close the fd and drop it from the event loop",
        "if there is a reason to retry at all, it needs a backoff and a give-up",
      ],
      hypothesis:
        "NON-BINDING: SOCKS mux relay fails to tear down accepted peer fd on abrupt client death, so the main-thread write loop busy-spins on EPIPE. Verify against #93398 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
