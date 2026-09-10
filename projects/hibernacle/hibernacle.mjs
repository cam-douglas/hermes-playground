#!/usr/bin/env node
/**
 * Hibernacle — winter hibernacle / animal wintering-den booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On Windows, after Claude Code is idle ~2+ minutes, Windows trims the
 * process working set even with abundant free RAM (e.g. 12.5 GB free).
 * First Enter after idle blocks the Node event loop ~5s with
 * majflt≈41105 / cpu≈77ms (event-loop-stall WARN). TUI does not
 * repaint so the keystroke looks dropped; user presses Enter again;
 * both newlines deliver when the block clears → duplicate message
 * submission.
 *
 *   node hibernacle.mjs data/hibernacle.json
 *   echo '{"seed":"paged-out"}' | node hibernacle.mjs
 *
 * Idle word is warm (HOLD: working set stays resident while idle;
 * first Enter after idle paints immediately; no majflt storm).
 * Seeded word is paged-out (#93372: idle trim → majflt storm →
 * stall → duplicate Enter).
 * Path word is majflt.
 * Product score word is hibernacle (score hibernacle or admit warm).
 *
 * Encoded from anthropics/claude-code#93372 issue body only.
 * Hypothesis (NON-BINDING): first-Enter submit path walks a large
 * structure with a scattered access pattern after Windows idle
 * working-set trim, so the event loop takes tens of thousands of
 * major page faults before the TUI can repaint.
 * Verify against #93372 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "warm",
  "paged-out",
  "hibernacle",
  "majflt",
  "hold",
  "working-set-trim",
  "event-loop-stall",
  "tui-frozen",
  "duplicate-enter",
  "abundant-ram",
  "scattered-faults",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "warm";
export const PATH_WORD = "majflt";
export const SEEDED_WORD = "paged-out";
export const PRODUCT_WORD = "hibernacle";
export const HOLD = Object.freeze(["warm", "hold"]);
export const RECOVER = Object.freeze(["warm", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "paged-out" && name !== "hibernacle"),
);

export const FEATURED_ISSUE = 93372;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93372";
export const TITLE =
  "[BUG] Windows: ~5s event-loop stall on first Enter after idle — working-set trim causes 41k major page faults (duplicate message submission)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tui",
]);
export const AUTHOR = "ramgalv";
export const FILED = "2026-09-10T15:04:30Z";
export const CLAUDE_CODE_VERSION = "2.1.261.355";
export const REPRO_RANGE = "2.1.260 through 2.1.266";
export const OS = "Windows 11 (10.0.26200)";
export const RAM_GB = 32;
export const FREE_RAM_GB = 12.5;
export const COMMIT_PCT = 62;
export const IDLE_SECONDS = 145;
export const STALL_MS = 4940;
export const CPU_MS = 77;
export const MAJFLT = 41105;
export const RSS_DURING_STALL_MB = 664;
export const HEAP_MB = 151;
export const EXT_MB = 63;
export const WS_BEFORE_MB = 504;
export const WS_AFTER_MB = 946;
export const PRIVATE_BEFORE_MB = 834;
export const PRIVATE_AFTER_MB = 858;
export const SEQUENTIAL_FAULT_MB = 442;
export const SEQUENTIAL_FAULT_MS = 441;
export const SCATTER_RATIO = 10;
export const TOUCH_TIMER_S = 90;
export const TOUCH_COST_MS = 60;
export const CLOCK_JUMP_MS = 0;
export const SIGCONT = false;
export const BLOCKED_WRITE = false;
export const PHRASE =
  "when Windows trims an idle working set and the first Enter after idle storms majflt so the TUI looks dropped and a second Enter double-submits, score hibernacle or admit warm.";

export const DEN_STATIONS = Object.freeze([
  {
    id: "den",
    rite: "keep the winter den warm",
    kind: "working-set",
    note: "working set should stay resident while idle — Windows must not page the process out for being quiet",
  },
  {
    id: "frost",
    rite: "read the frost linen",
    kind: "stall",
    note: "event-loop-stall WARN: blocked 4940ms, cpu=77ms, majflt=41105 — I/O bound, not GC",
  },
  {
    id: "ember",
    rite: "watch the ember stall meter",
    kind: "enter",
    note: "first Enter after idle looks dropped because the TUI cannot repaint during the majflt storm",
  },
  {
    id: "moss",
    rite: "count the moss-stone faults",
    kind: "duplicate",
    note: "second Enter is buffered; both newlines deliver when the block clears",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "working-set-trim",
  "event-loop-stall",
  "tui-frozen",
  "duplicate-enter",
  "abundant-ram",
  "scattered-faults",
]);

export const STALL_FIELDS = Object.freeze([
  {
    field: "majflt",
    value: MAJFLT,
    rulesOut: "this is the mechanism — pages fetched from disk",
  },
  {
    field: "cpu",
    value: CPU_MS,
    rulesOut: "not CPU-bound work, not GC (1.6% of wall)",
  },
  {
    field: "clock jump",
    value: CLOCK_JUMP_MS,
    rulesOut: "machine did not sleep or hibernate",
  },
  {
    field: "sigcont",
    value: SIGCONT,
    rulesOut: "not OS process suspension",
  },
  {
    field: "blocked_write",
    value: BLOCKED_WRITE,
    rulesOut: "not the renderer, not ConPTY backpressure",
  },
]);

export const COUSINS = Object.freeze([
  {
    issue: 88375,
    title: "Desktop Windows freeze 5–30s while the machine is idle",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Electron shell freeze, not CLI working-set trim / majflt",
  },
  {
    issue: 92005,
    title: "Desktop unresponsive after idle/sleep, stale lockfile",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 87987,
    title: "Subagent stream stall on transient network failure",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — network watchdog, not majflt",
  },
  {
    issue: 75571,
    title: "VS Code extension hang while native process idles in kevent64",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — macOS IDE IPC, not Windows working-set trim",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93348,
    title: "Scapegoat — ungranted host executeScript hang",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — already shipped; not this paradigm",
  },
  {
    issue: 93345,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93279,
    title: "HTTP MCP ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93219,
    title: "Vernier millimeter-slider leftover — do not ship",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover woodworking; forbidden as primary",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "vernier",
  "scion",
]);

const MS_PER_SCATTERED_FAULT = STALL_MS / MAJFLT;

/**
 * Simulate an event-loop stall from published majflt / cpu fields.
 * Scattered major faults cost ~STALL_MS / MAJFLT each (≈0.12 ms).
 * Sequential external fault-in of the same committed private regions
 * is ~10× faster (442 MB in 441 ms) — access pattern, not volume.
 */
export function simulateStall(input = {}) {
  const held =
    (input.workingSetHeld === true || input.warm === true) &&
    input.pagedOut !== true &&
    input.workingSetTrim !== true;
  const majflt = Number(
    input.majflt ?? (held ? 0 : input.majfltStorm === true ? MAJFLT : 0),
  );
  const cpuMs = Number(input.cpuMs ?? (held || majflt === 0 ? 0 : CPU_MS));
  const sequential = input.sequentialFaultIn === true;
  let stallMs = 0;
  if (!held && majflt > 0) {
    stallMs = sequential
      ? Math.round(majflt * MS_PER_SCATTERED_FAULT / SCATTER_RATIO)
      : Math.round(majflt * MS_PER_SCATTERED_FAULT);
  }
  if (input.stallMs != null && Number.isFinite(Number(input.stallMs))) {
    stallMs = Number(input.stallMs);
  }
  const cpuBound = stallMs > 0 && cpuMs > stallMs * 0.5;
  const eventLoopBlocked = stallMs >= 500 && !cpuBound && !held;
  return {
    stallMs,
    majflt: held ? 0 : majflt,
    cpuMs: held ? 0 : cpuMs,
    sequential,
    cpuBound,
    eventLoopBlocked,
    scatterRatio: sequential ? SCATTER_RATIO : 1,
    stamp: eventLoopBlocked ? "paged-out" : "warm",
  };
}

/**
 * Read whether the winter den kept RSS resident.
 */
export function inspectWorkingSet(input = {}) {
  const freeRamGb = Number(input.freeRamGb ?? FREE_RAM_GB);
  const abundantRam = freeRamGb >= 8 || input.abundantRam === true;
  const held =
    input.workingSetHeld === true &&
    input.workingSetTrim !== true &&
    input.pagedOut !== true;
  const trimmed =
    input.workingSetTrim === true ||
    input.pagedOut === true ||
    (Number(input.majflt) >= MAJFLT && !held);
  const wsBefore = Number(input.wsBeforeMb ?? (trimmed ? WS_BEFORE_MB : WS_AFTER_MB));
  const wsAfter = Number(input.wsAfterMb ?? WS_AFTER_MB);
  const privateBytes = Number(input.privateMb ?? PRIVATE_BEFORE_MB);
  const faultIn = trimmed && wsAfter > wsBefore && privateBytes >= PRIVATE_BEFORE_MB;
  return {
    freeRamGb,
    abundantRam,
    workingSetHeld: held && !trimmed,
    workingSetTrim: trimmed && !held,
    wsBeforeMb: wsBefore,
    wsAfterMb: wsAfter,
    privateMb: privateBytes,
    faultIn,
    stamp: trimmed && !held ? "paged-out" : "warm",
  };
}

/**
 * Read the first-Enter / second-Enter path after idle.
 */
export function inspectEnter(input = {}) {
  const stall = simulateStall(input);
  const idleSeconds = Number(input.idleSeconds ?? 0);
  const idleLong = idleSeconds >= 120 || input.idleLong === true;
  const tuiFrozen =
    stall.eventLoopBlocked &&
    input.tuiRepaint !== true &&
    (input.tuiFrozen === true || stall.eventLoopBlocked);
  const secondEnter =
    input.secondEnter === true || input.duplicateEnter === true;
  const duplicate = tuiFrozen && secondEnter;
  return {
    idleSeconds,
    idleLong,
    tuiFrozen,
    secondEnter,
    duplicate,
    stall,
    stamp: duplicate || stall.stamp === "paged-out" ? "paged-out" : "warm",
  };
}

export function readDen(input = {}) {
  const workingSet = inspectWorkingSet(input);
  const enter = inspectEnter(input);
  const pagedOut =
    workingSet.stamp === "paged-out" ||
    enter.stamp === "paged-out" ||
    input.pagedOut === true;
  const warm =
    input.warm === true &&
    pagedOut !== true &&
    workingSet.stamp === "warm";
  return {
    workingSet,
    enter,
    stations: DEN_STATIONS,
    pagedOut: pagedOut && !warm,
    warm: warm || (workingSet.stamp === "warm" && !pagedOut && input.pagedOut !== true),
    cue: pagedOut && !warm ? "paged-out" : "warm",
  };
}

export const HIBERNACLE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-warm",
    warm: true,
    workingSetHeld: true,
    workingSetTrim: false,
    pagedOut: false,
    majflt: 0,
    tuiFrozen: false,
    secondEnter: false,
    cue: "warm",
    note: "idle HOLD: working set stays resident while idle; first Enter after idle paints immediately; no majflt storm",
  },
  {
    t: "wait",
    event: "idle-2m25s",
    idleLong: true,
    idleSeconds: IDLE_SECONDS,
    cue: "paged-out",
    note: "session idle 2m25s while other processes are active",
  },
  {
    t: "trim",
    event: "working-set-trim",
    workingSetTrim: true,
    abundantRam: true,
    freeRamGb: FREE_RAM_GB,
    wsBeforeMb: WS_BEFORE_MB,
    privateMb: PRIVATE_BEFORE_MB,
    cue: "paged-out",
    note: "Windows trims the idle working set with 12.5 GB RAM free — idle, not pressure",
  },
  {
    t: "enter",
    event: "first-enter",
    firstEnter: true,
    workingSetTrim: true,
    cue: "paged-out",
    note: "user presses Enter at 19:56:10.8 local; last log is Hooks: checkForNewResponses returning 0",
  },
  {
    t: "stall",
    event: "event-loop-stall",
    eventLoopStall: true,
    stallMs: STALL_MS,
    cpuMs: CPU_MS,
    workingSetTrim: true,
    cue: "paged-out",
    note: "[event-loop-stall] blocked for 4940ms monotonic; cpu=77ms; clock jump 0ms; sigcont=false; blocked_write=false",
  },
  {
    t: "faults",
    event: "majflt-41105",
    majflt: MAJFLT,
    majfltStorm: true,
    workingSetTrim: true,
    cue: "paged-out",
    note: "majflt=41105 — pages fetched from disk; working set climbs 504 MB → 946 MB while private stays ~834–858 MB",
  },
  {
    t: "tui",
    event: "tui-frozen",
    tuiFrozen: true,
    workingSetTrim: true,
    majflt: MAJFLT,
    cue: "paged-out",
    note: "TUI does not repaint; the prompt is stamped immediately but hooks and paint are late",
  },
  {
    t: "again",
    event: "second-enter",
    secondEnter: true,
    tuiFrozen: true,
    workingSetTrim: true,
    majflt: MAJFLT,
    cue: "paged-out",
    note: "keystroke looks dropped; user presses Enter again",
  },
  {
    t: "both",
    event: "both-newlines",
    bothNewlines: true,
    secondEnter: true,
    tuiFrozen: true,
    workingSetTrim: true,
    majflt: MAJFLT,
    cue: "paged-out",
    note: "both newlines deliver when the block clears",
  },
  {
    t: "dup",
    event: "duplicate-submit",
    duplicateEnter: true,
    secondEnter: true,
    tuiFrozen: true,
    workingSetTrim: true,
    majflt: MAJFLT,
    cue: "paged-out",
    note: "duplicate message submission — the most damaging symptom",
  },
  {
    t: "cut",
    event: "paged-out",
    warm: false,
    pagedOut: true,
    workingSetTrim: true,
    majfltStorm: true,
    majflt: MAJFLT,
    stallMs: STALL_MS,
    cpuMs: CPU_MS,
    tuiFrozen: true,
    secondEnter: true,
    duplicateEnter: true,
    abundantRam: true,
    cue: "paged-out",
    note: "idle trim → majflt storm → stall → duplicate Enter",
  },
  {
    t: "path",
    event: "majflt",
    pagedOut: true,
    majflt: MAJFLT,
    workingSetTrim: true,
    cue: "paged-out",
    note: "majflt — major page-fault path through first Enter after idle",
  },
  {
    t: "score",
    event: "hibernacle",
    pagedOut: true,
    majflt: MAJFLT,
    workingSetTrim: true,
    cue: "paged-out",
    note: "hibernacle — score the den that went cold and double-submitted",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    warm: true,
    workingSetHeld: true,
    workingSetTrim: false,
    pagedOut: false,
    majflt: 0,
    tuiFrozen: false,
    secondEnter: false,
    cue: "warm",
  };
}

export function seedWarm() {
  return { ...emptyTicket() };
}

export function seedPagedOut() {
  return {
    seed: SEEDED_WORD,
    warm: false,
    pagedOut: true,
    workingSetHeld: false,
    workingSetTrim: true,
    majfltStorm: true,
    majflt: MAJFLT,
    stallMs: STALL_MS,
    cpuMs: CPU_MS,
    idleSeconds: IDLE_SECONDS,
    idleLong: true,
    tuiFrozen: true,
    secondEnter: true,
    duplicateEnter: true,
    bothNewlines: true,
    abundantRam: true,
    freeRamGb: FREE_RAM_GB,
    wsBeforeMb: WS_BEFORE_MB,
    wsAfterMb: WS_AFTER_MB,
    privateMb: PRIVATE_BEFORE_MB,
    eventLoopStall: true,
    cue: "paged-out",
    issue: FEATURED_ISSUE,
  };
}

export function seedHibernacle() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    pagedOut: true,
    majflt: MAJFLT,
    cue: "paged-out",
  };
}

export function seedMajflt() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    pagedOut: true,
    majflt: MAJFLT,
    workingSetTrim: true,
    cue: "paged-out",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    warm: true,
    cue: "warm",
  };
}

export function seedWorkingSetTrim() {
  return {
    seed: "working-set-trim",
    preferSeed: true,
    workingSetTrim: true,
    cue: "paged-out",
  };
}

export function seedEventLoopStall() {
  return {
    seed: "event-loop-stall",
    preferSeed: true,
    eventLoopStall: true,
    cue: "paged-out",
  };
}

export function seedTuiFrozen() {
  return {
    seed: "tui-frozen",
    preferSeed: true,
    tuiFrozen: true,
    cue: "paged-out",
  };
}

export function seedDuplicateEnter() {
  return {
    seed: "duplicate-enter",
    preferSeed: true,
    duplicateEnter: true,
    cue: "paged-out",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      warm: false,
      pagedOut: false,
      workingSetHeld: false,
      workingSetTrim: false,
      majfltStorm: false,
      eventLoopStall: false,
      tuiFrozen: false,
      tuiRepaint: false,
      firstEnter: false,
      secondEnter: false,
      duplicateEnter: false,
      bothNewlines: false,
      idleLong: false,
      abundantRam: false,
      sequentialFaultIn: false,
      majflt: null,
      stallMs: null,
      cpuMs: null,
      idleSeconds: null,
      freeRamGb: null,
      wsBeforeMb: null,
      wsAfterMb: null,
      privateMb: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    warm: raw.warm === true,
    pagedOut: raw.pagedOut === true,
    workingSetHeld: raw.workingSetHeld === true,
    workingSetTrim: raw.workingSetTrim === true,
    majfltStorm: raw.majfltStorm === true,
    eventLoopStall: raw.eventLoopStall === true,
    tuiFrozen: raw.tuiFrozen === true,
    tuiRepaint: raw.tuiRepaint === true,
    firstEnter: raw.firstEnter === true,
    secondEnter: raw.secondEnter === true,
    duplicateEnter: raw.duplicateEnter === true,
    bothNewlines: raw.bothNewlines === true,
    idleLong: raw.idleLong === true,
    abundantRam: raw.abundantRam === true,
    sequentialFaultIn: raw.sequentialFaultIn === true,
    majflt: raw.majflt == null ? null : Number(raw.majflt),
    stallMs: raw.stallMs == null ? null : Number(raw.stallMs),
    cpuMs: raw.cpuMs == null ? null : Number(raw.cpuMs),
    idleSeconds: raw.idleSeconds == null ? null : Number(raw.idleSeconds),
    freeRamGb: raw.freeRamGb == null ? null : Number(raw.freeRamGb),
    wsBeforeMb: raw.wsBeforeMb == null ? null : Number(raw.wsBeforeMb),
    wsAfterMb: raw.wsAfterMb == null ? null : Number(raw.wsAfterMb),
    privateMb: raw.privateMb == null ? null : Number(raw.privateMb),
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.warm != null ||
        ticket.pagedOut != null ||
        ticket.workingSetHeld != null ||
        ticket.workingSetTrim != null ||
        ticket.majflt != null ||
        ticket.majfltStorm != null ||
        ticket.eventLoopStall != null ||
        ticket.tuiFrozen != null ||
        ticket.secondEnter != null ||
        ticket.duplicateEnter != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isWarm(row) {
  if (row.pagedOut && row.cue !== "warm") return false;
  if (
    row.cue === "paged-out" ||
    row.cue === "hibernacle" ||
    row.cue === "majflt"
  ) {
    return false;
  }
  if (row.workingSetTrim && row.cue !== "warm") return false;
  if (Number(row.majflt) >= MAJFLT && row.cue !== "warm") return false;
  if (
    row.warm === true &&
    row.pagedOut !== true &&
    row.cue !== "paged-out"
  ) {
    return true;
  }
  if (
    row.cue === "warm" &&
    row.pagedOut !== true &&
    row.workingSetTrim !== true &&
    !(Number(row.majflt) >= MAJFLT)
  ) {
    return true;
  }
  if (
    row.workingSetHeld === true &&
    row.pagedOut !== true &&
    row.workingSetTrim !== true &&
    !(Number(row.majflt) >= MAJFLT)
  ) {
    return true;
  }
  return false;
}

function isPagedOut(row) {
  if (isWarm(row)) return false;
  if (row.cue === "paged-out" || row.cue === "hibernacle") return true;
  if (row.pagedOut === true) return true;
  if (
    row.workingSetTrim === true ||
    row.majfltStorm === true ||
    Number(row.majflt) >= MAJFLT ||
    row.eventLoopStall === true
  ) {
    return true;
  }
  if (row.tuiFrozen && row.secondEnter) return true;
  return false;
}

function isMajfltPath(row) {
  return (
    row.event === "majflt" &&
    !isWarm(row) &&
    (row.pagedOut === true ||
      row.workingSetTrim === true ||
      Number(row.majflt) >= MAJFLT)
  );
}

/**
 * Score one den pass against the hibernacle booth.
 * warm: working set held; first Enter paints; no majflt storm.
 * paged-out: idle trim; majflt storm; stall; duplicate Enter.
 * majflt: named path — major page faults on first Enter after idle.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const stall = simulateStall({ ...row, warm: row.warm, pagedOut: row.pagedOut });
  const workingSet = inspectWorkingSet(row);
  const enter = inspectEnter(row);

  let verdict = IDLE_WORD;
  if (
    isMajfltPath(row) ||
    (row.pagedOut && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "majflt";
  } else if (isPagedOut(row)) {
    verdict = "paged-out";
  } else if (isWarm(row)) {
    verdict = "warm";
  } else if (
    row.workingSetTrim ||
    row.majfltStorm ||
    row.eventLoopStall ||
    row.tuiFrozen ||
    row.duplicateEnter ||
    Number(row.majflt) >= MAJFLT
  ) {
    verdict = "paged-out";
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
    warm: verdict === "warm" || verdict === "hold",
    pagedOut:
      verdict === "paged-out" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    majfltPath:
      verdict === "majflt" ||
      verdict === PATH_WORD ||
      row.event === "majflt",
    workingSetHeld: row.workingSetHeld,
    workingSetTrim: row.workingSetTrim,
    majfltStorm: row.majfltStorm,
    eventLoopStall: row.eventLoopStall,
    tuiFrozen: row.tuiFrozen,
    tuiRepaint: row.tuiRepaint,
    firstEnter: row.firstEnter,
    secondEnter: row.secondEnter,
    duplicateEnter: row.duplicateEnter,
    bothNewlines: row.bothNewlines,
    idleLong: row.idleLong,
    abundantRam: row.abundantRam,
    sequentialFaultIn: row.sequentialFaultIn,
    majflt: row.majflt,
    stallMs: row.stallMs ?? stall.stallMs,
    cpuMs: row.cpuMs,
    idleSeconds: row.idleSeconds,
    freeRamGb: row.freeRamGb,
    wsBeforeMb: row.wsBeforeMb,
    wsAfterMb: row.wsAfterMb,
    privateMb: row.privateMb,
    cue: hold ? "warm" : "paged-out",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit warm" : "score hibernacle",
    stall,
    workingSet,
    enter,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : HIBERNACLE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const pagedOut = scored.filter((row) => row.verdict === "paged-out");
  const path = scored.filter((row) => row.verdict === "majflt");
  const warm = scored.filter((row) => row.verdict === "warm");
  const headline =
    scored.find((row) => row.event === "paged-out") ||
    scored.find((row) => row.event === "majflt-41105") ||
    scored.find((row) => row.event === "majflt") ||
    pagedOut[pagedOut.length - 1];
  let verdict = "warm";
  if (pagedOut.length) verdict = "paged-out";
  else if (path.length && !warm.length) verdict = "majflt";
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
    pagedOutCount: pagedOut.length,
    pathCount: path.length,
    warmCount: warm.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit warm" : "score hibernacle",
    note: headline
      ? "Windows idle working-set trim; first Enter after idle storms majflt; TUI frozen; second Enter double-submits."
      : "published hibernacle walk scored against warm vs paged-out",
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
    seeded !== "warm" &&
    seeded !== "paged-out" &&
    seeded !== "majflt" &&
    seeded !== "hibernacle" &&
    ticket.warm == null &&
    ticket.pagedOut == null &&
    ticket.workingSetTrim == null &&
    ticket.majflt == null &&
    ticket.workingSetHeld == null &&
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
    warm: scored.warm ?? false,
    pagedOut: scored.pagedOut ?? false,
    workingSetTrim: scored.workingSetTrim ?? false,
    majfltStorm: scored.majfltStorm ?? false,
    eventLoopStall: scored.eventLoopStall ?? false,
    tuiFrozen: scored.tuiFrozen ?? false,
    secondEnter: scored.secondEnter ?? false,
    duplicateEnter: scored.duplicateEnter ?? false,
    abundantRam: scored.abundantRam ?? false,
    majflt: scored.majflt ?? null,
    stallMs: scored.stallMs ?? null,
    cpuMs: scored.cpuMs ?? null,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.workingSetTrim || result.pagedOut ? "ws=trimmed" : "ws=held",
    Number(result.majflt) >= MAJFLT ? "majflt=storm" : "majflt=quiet",
    result.tuiFrozen ? "tui=frozen" : "tui=paint",
    result.secondEnter || result.duplicateEnter ? "enter=dup" : "enter=once",
    result.cue === "warm" ? "cue=warm" : "cue=paged-out",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const den = readDen({
    warm: result.warm,
    pagedOut: result.pagedOut,
    workingSetHeld: result.workingSetHeld,
    workingSetTrim: result.workingSetTrim,
    majflt: result.majflt,
    majfltStorm: result.majfltStorm,
    stallMs: result.stallMs,
    cpuMs: result.cpuMs,
    tuiFrozen: result.tuiFrozen,
    secondEnter: result.secondEnter,
    duplicateEnter: result.duplicateEnter,
    idleSeconds: result.idleSeconds,
    idleLong: result.idleLong,
    abundantRam: result.abundantRam,
    freeRamGb: result.freeRamGb,
    wsBeforeMb: result.wsBeforeMb,
    wsAfterMb: result.wsAfterMb,
    privateMb: result.privateMb,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    den,
    stall: simulateStall({
      warm: result.warm,
      pagedOut: result.pagedOut,
      workingSetHeld: result.workingSetHeld,
      workingSetTrim: result.workingSetTrim,
      majflt: result.majflt,
      majfltStorm: result.majfltStorm,
      stallMs: result.stallMs,
      cpuMs: result.cpuMs,
      sequentialFaultIn: result.sequentialFaultIn,
    }),
    workingSet: inspectWorkingSet({
      workingSetHeld: result.workingSetHeld,
      workingSetTrim: result.workingSetTrim,
      pagedOut: result.pagedOut,
      abundantRam: result.abundantRam,
      freeRamGb: result.freeRamGb,
      majflt: result.majflt,
      wsBeforeMb: result.wsBeforeMb,
      wsAfterMb: result.wsAfterMb,
      privateMb: result.privateMb,
    }),
    enter: inspectEnter({
      warm: result.warm,
      pagedOut: result.pagedOut,
      workingSetTrim: result.workingSetTrim,
      majflt: result.majflt,
      stallMs: result.stallMs,
      cpuMs: result.cpuMs,
      tuiFrozen: result.tuiFrozen,
      secondEnter: result.secondEnter,
      duplicateEnter: result.duplicateEnter,
      idleSeconds: result.idleSeconds,
      idleLong: result.idleLong,
    }),
    stations: DEN_STATIONS.map((row) => ({
      ...row,
      pagedOut: result.pagedOut === true || result.verdict === "paged-out",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      reproRange: REPRO_RANGE,
      os: OS,
      ramGb: RAM_GB,
      freeRamGb: FREE_RAM_GB,
      commitPct: COMMIT_PCT,
      idleSeconds: IDLE_SECONDS,
      stallMs: STALL_MS,
      cpuMs: CPU_MS,
      majflt: MAJFLT,
      rssDuringStallMb: RSS_DURING_STALL_MB,
      heapMb: HEAP_MB,
      extMb: EXT_MB,
      wsBeforeMb: WS_BEFORE_MB,
      wsAfterMb: WS_AFTER_MB,
      privateBeforeMb: PRIVATE_BEFORE_MB,
      privateAfterMb: PRIVATE_AFTER_MB,
      sequentialFaultMb: SEQUENTIAL_FAULT_MB,
      sequentialFaultMs: SEQUENTIAL_FAULT_MS,
      scatterRatio: SCATTER_RATIO,
      touchTimerS: TOUCH_TIMER_S,
      touchCostMs: TOUCH_COST_MS,
      stallFields: STALL_FIELDS,
      stations: DEN_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "keep the working set resident while idle (touch committed private memory, or ask Windows not to trim an interactive TUI for being quiet) so first Enter after idle does not storm majflt",
        "failing that, surface a TUI hint when event-loop-stall exceeds a threshold so the user does not press Enter again",
      ],
      hypothesis:
        "NON-BINDING: first-Enter submit path walks a large structure with a scattered access pattern after Windows idle working-set trim, so the event loop takes tens of thousands of major page faults before the TUI can repaint. Verify against #93372 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
