#!/usr/bin/env node
/**
 * Cathead — ship’s bow cathead / anchor-timber / PTY-slot booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * macOS teammate spawn fails with `fork failed: Device not configured`
 * (ENXIO) because TmuxBackend does `split-window … -- cat` (placeholder
 * occupies one PTY) then `respawn-pane -k` which closes the placeholder
 * master and immediately forkpty’s the replacement. On xnu, opening
 * /dev/ptmx is two non-atomic steps (ptmx_clone picks minor;
 * ptmx_get_ioctl grows by PTMX_GROW_VECTOR=16 only if pis_free==0).
 * When system-wide PTY usage is exactly vector_size−1, the placeholder
 * fills the last slot, clone picks pis_total, the freed placeholder
 * slot makes pis_free==1 so grow is skipped → minor out of range →
 * ENXIO. Vector never shrinks; every retry fails identically. Root
 * cause writeup for recurring #77211.
 *
 *   node cathead.mjs data/raced.json
 *   echo '{"seed":"raced"}' | node cathead.mjs
 *
 * Idle word is seated (HOLD: cathead timber holds the new pane; no
 * placeholder-cat + respawn-pane -k race; forkpty opens a live PTY).
 * Seeded word is raced (#93624 — cat placeholder frees mid-open at a
 * 16-slot boundary; grow skipped; ENXIO).
 * Path word is ptmx-race.
 * Product score word is cathead (Score cathead or admit seated.).
 *
 * Encoded from anthropics/claude-code#93624 issue text only.
 * Hypothesis (NON-BINDING): if TmuxBackend avoided cat+respawn-pane -k
 * (direct split-window command, or wait-for-placeholder-exit before
 * respawn, or ENXIO-triggered forced vector grow on a fresh pane), the
 * race would not fire. Verify against #93624 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT implement
 * a fix. No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "seated",
  "raced",
  "cathead",
  "ptmx-race",
  "hold",
  "enxio",
  "placeholder-cat",
  "respawn-kill",
  "slot-boundary",
  "grow-skipped",
  "pis-total",
  "vector-16",
  "forkpty-race",
  "wait-exit-ok",
  "pregrow-workaround",
  "in-process-mode",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "seated";
export const PATH_WORD = "ptmx-race";
export const SEEDED_WORD = "raced";
export const PRODUCT_WORD = "cathead";
export const HOLD = Object.freeze(["seated", "hold"]);
export const RECOVER = Object.freeze(["seated", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "raced" && name !== "cathead",
  ),
);

export const FEATURED_ISSUE = 93624;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93624";
export const TITLE =
  '[Bug] macOS: teammate spawn "fork failed: Device not configured" — xnu ptmx slot-vector race triggered by cat placeholder + respawn-pane -k (root cause for #77211)';
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug"]);
export const PTMX_GROW_VECTOR = 16;
export const KERNEL_MINOR = 96;
export const KERNEL_LOG =
  "ptmx_get_ioctl failed because minor number 96 was out of range";
export const DARWIN = "25.5.0";
export const ARCH = "arm64";
export const TMUX_VERSION = "3.6a";
export const CLAUDE_VERSION = "2.1.268";
export const TEAMMATE_MODE = "tmux";
export const SPLIT_CMD = "split-window -d … -- cat";
export const RESPAWN_CMD = "respawn-pane -k -t pane -- teammate cmd";
export const SPAWN_FAILURES = "6/6";
export const PREGROW_COUNT = 512;
export const IN_PROCESS_MODE = 'teammateMode: "in-process"';
export const XXX_COMMENT = "XXX We fall off the end here";
export const PHRASE = "Score cathead or admit seated.";
export const DISTRIBUTION =
  "Darwin 25.5.0 arm64, tmux 3.6a, Claude Code 2.1.268, teammateMode: tmux. TmuxBackend split-window -d … -- cat occupies one PTY, then respawn-pane -k closes the placeholder master and immediately forkpty’s the replacement. On xnu, /dev/ptmx open is two non-atomic steps (ptmx_clone picks minor; ptmx_get_ioctl grows by PTMX_GROW_VECTOR=16 only if pis_free==0). At vector_size−1 the placeholder fills the last slot; clone picks pis_total; freed placeholder makes pis_free==1 so grow is skipped; minor out of range → ENXIO. Vector never shrinks; every retry fails identically.";
export const SESSION_KIND =
  "macOS teammate spawn. 6/6 spawn failures with kernel log ptmx_get_ioctl failed because minor number 96 was out of range. Deterministic repro at boundary−1. Plain forkpty→close→openpty fails; close→wait for child exit→openpty succeeds. ±1 PTY succeeds. Second respawn-pane on a failed pane can crash tmux 3.6a.";

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "timber",
    survey: "seat the oak cathead (bow timber should hold the new pane)",
    kind: "timber",
    note: "seeded: the cathead drops the new pane when the placeholder frees mid-open",
  },
  {
    id: "gauge",
    survey: "read the PTY slot-vector gauge (marks in multiples of 16)",
    kind: "gauge",
    note: "seeded: usage sits at vector_size−1; placeholder fills the last slot",
  },
  {
    id: "coil",
    survey: "trace the placeholder cat line coiled on the timber",
    kind: "coil",
    note: "seeded: split-window -d … -- cat occupies one PTY before respawn",
  },
  {
    id: "lever",
    survey: "watch the respawn lever (-k) kill the placeholder master",
    kind: "lever",
    note: "seeded: respawn-pane -k closes the cat master then forkpty’s immediately",
  },
  {
    id: "kernel",
    survey: "read the kernel log strip (ptmx_get_ioctl … out of range)",
    kind: "kernel",
    note: "seeded: minor 96 out of range; grow skipped because pis_free==1",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "ptmx-race",
  "raced",
  "placeholder-cat",
  "respawn-kill",
  "slot-boundary",
  "grow-skipped",
  "enxio",
  "forkpty-race",
]);

export const COUSINS = Object.freeze([
  {
    issue: 77211,
    title: "cite-only cousin — closed stale, same teammate spawn ENXIO symptom",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed stale, same Device not configured / teammate spawn symptom. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93615,
    title: "scheduled WebSearch hangs",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93570,
    title: "single-task shutdown kills all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93589,
    title: "Cowork egress additional domains ignored",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash ~8175 truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93622,
    title: "channel messages merge lose prompt cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "anachronism",
  "nullarbor",
  "petard",
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
  "palimpsest",
  "scarph",
  "cringle",
  "plimsoll",
  "oubliette",
  "ephemera",
  "commutator",
  "mondegreen",
  "seizing",
  "hangfire",
  "flashpan",
  "frizzen",
]);

export const SAMPLE_GAUGE = Object.freeze({
  vector: PTMX_GROW_VECTOR,
  usage: 15,
  boundary: true,
  grown: false,
});

export const SAMPLE_SEATED_GAUGE = Object.freeze({
  vector: PTMX_GROW_VECTOR,
  usage: 14,
  boundary: false,
  grown: true,
});

export const SAMPLE_PLACEHOLDER = Object.freeze({
  cat: true,
  coiled: true,
  occupying: true,
});

export const SAMPLE_SEATED_PLACEHOLDER = Object.freeze({
  cat: false,
  coiled: false,
  occupying: false,
});

export const SAMPLE_RESPAWN = Object.freeze({
  kill: true,
  waited: false,
  forkptyImmediate: true,
});

export const SAMPLE_SEATED_RESPAWN = Object.freeze({
  kill: false,
  waited: true,
  forkptyImmediate: false,
});

export const SAMPLE_KERNEL = Object.freeze({
  enxio: true,
  minor: KERNEL_MINOR,
  line: KERNEL_LOG,
  growSkipped: true,
});

export const SAMPLE_SEATED_KERNEL = Object.freeze({
  enxio: false,
  minor: null,
  line: "ptmx_get_ioctl accepted; pane seated",
  growSkipped: false,
});

export const SAMPLE_TIMBER = Object.freeze({
  seated: false,
  dropped: true,
  halfCatted: true,
});

export const SAMPLE_SEATED_TIMBER = Object.freeze({
  seated: true,
  dropped: false,
  halfCatted: false,
});

export const SAMPLE_LOG = Object.freeze([
  { t: "idle", line: "cathead timber holds the new pane; no placeholder-cat + respawn-pane -k race; forkpty opens a live PTY" },
  { t: "split", line: "TmuxBackend split-window -d … -- cat — placeholder occupies one PTY" },
  { t: "remain", line: "set-option -p remain-on-exit failed" },
  { t: "respawn", line: "respawn-pane -k closes the placeholder master and immediately forkpty’s the replacement" },
  { t: "clone", line: "ptmx_clone picks minor; system-wide PTY usage is exactly vector_size−1" },
  { t: "free", line: "freed placeholder slot makes pis_free==1 so grow is skipped" },
  { t: "ioctl", line: "ptmx_get_ioctl failed because minor number 96 was out of range" },
  { t: "enxio", line: "fork failed: Device not configured (ENXIO)" },
  { t: "retry", line: "vector never shrinks; every retry fails identically; 6/6 spawn failures" },
  { t: "repro", line: "deterministic at boundary−1; plain forkpty→close→openpty fails; close→wait for child exit→openpty succeeds; ±1 PTY succeeds" },
  { t: "crash", line: "second respawn-pane on a failed pane can crash tmux 3.6a" },
  { t: "score", line: "when the cat placeholder frees mid-open at a 16-slot boundary, the cathead drops the new pane with ENXIO — Score cathead or admit seated." },
]);

export function inspectTimber(input = {}) {
  const timber =
    input.timber && typeof input.timber === "object"
      ? input.timber
      : input.seated === true && input.raced !== true
        ? SAMPLE_SEATED_TIMBER
        : SAMPLE_TIMBER;
  const forcedDrop =
    input.raced === true ||
    input.enxio === true ||
    input.event === "raced" ||
    input.event === "cathead" ||
    input.event === "enxio" ||
    input.ptmxRace === true;
  const seated = forcedDrop
    ? false
    : timber.seated === true ||
      input.seated === true ||
      input.waitExit === true;
  return {
    seated,
    dropped: !seated,
    halfCatted: !seated,
    stamp: seated ? "seated" : "dropped",
    note: seated
      ? "oak cathead holds the new pane — forkpty opened a live PTY"
      : "cathead drops the new pane — placeholder freed mid-open at a 16-slot boundary",
  };
}

export function inspectGauge(input = {}) {
  const gauge =
    input.gauge && typeof input.gauge === "object"
      ? input.gauge
      : input.seated === true && input.raced !== true
        ? SAMPLE_SEATED_GAUGE
        : SAMPLE_GAUGE;
  const forcedBoundary =
    input.slotBoundary === true ||
    input.event === "slot-boundary" ||
    input.growSkipped === true ||
    (input.raced === true && input.seated !== true);
  const boundary = forcedBoundary ? true : gauge.boundary === true;
  return {
    vector: gauge.vector || PTMX_GROW_VECTOR,
    usage: boundary ? 15 : gauge.usage ?? 14,
    boundary,
    grown: !boundary && (gauge.grown === true || input.seated === true),
    stamp: boundary ? "boundary" : "slack",
    note: boundary
      ? "slot-vector gauge at vector_size−1 — placeholder fills the last of 16"
      : "slot-vector gauge has slack — grow can still fire or usage is off-boundary",
  };
}

export function inspectPlaceholder(input = {}) {
  const coil =
    input.placeholder && typeof input.placeholder === "object"
      ? input.placeholder
      : input.seated === true && input.raced !== true
        ? SAMPLE_SEATED_PLACEHOLDER
        : SAMPLE_PLACEHOLDER;
  const forcedCat =
    input.placeholderCat === true ||
    input.event === "placeholder-cat" ||
    (input.raced === true && input.seated !== true);
  const cat = forcedCat ? true : coil.cat === true;
  return {
    cat,
    coiled: cat || coil.coiled === true,
    occupying: cat,
    stamp: cat ? "cat" : "clear",
    note: cat
      ? "placeholder cat line coiled on the timber — split-window occupies one PTY"
      : "no placeholder cat — teammate command sits directly in the split",
  };
}

export function inspectRespawn(input = {}) {
  const lever =
    input.respawn && typeof input.respawn === "object"
      ? input.respawn
      : input.seated === true && input.raced !== true
        ? SAMPLE_SEATED_RESPAWN
        : SAMPLE_RESPAWN;
  const forcedKill =
    input.respawnKill === true ||
    input.event === "respawn-kill" ||
    input.forkptyRace === true ||
    (input.raced === true && input.seated !== true);
  const kill = forcedKill ? true : lever.kill === true;
  const waited =
    !kill &&
    (lever.waited === true || input.waitExit === true || input.seated === true);
  return {
    kill,
    waited,
    forkptyImmediate: kill,
    stamp: kill ? "kill" : "hold",
    note: kill
      ? "respawn-pane -k closes the placeholder master then forkpty’s immediately"
      : "respawn waits for the placeholder pid to exit — or no respawn at all",
  };
}

export function inspectKernel(input = {}) {
  const kernel =
    input.kernel && typeof input.kernel === "object"
      ? input.kernel
      : input.seated === true && input.raced !== true
        ? SAMPLE_SEATED_KERNEL
        : SAMPLE_KERNEL;
  const forcedEnxio =
    input.enxio === true ||
    input.event === "enxio" ||
    input.growSkipped === true ||
    (input.raced === true && input.seated !== true);
  const enxio = forcedEnxio ? true : kernel.enxio === true;
  return {
    enxio,
    minor: enxio ? KERNEL_MINOR : null,
    line: enxio ? KERNEL_LOG : "ptmx_get_ioctl accepted; pane seated",
    growSkipped: enxio || kernel.growSkipped === true,
    stamp: enxio ? "enxio" : "quiet",
    note: enxio
      ? "ptmx_get_ioctl failed because minor number 96 was out of range"
      : "kernel log quiet — ioctl accepted the minor; pane seated",
  };
}

export function readBooth(input = {}) {
  const timber = inspectTimber(input);
  const gauge = inspectGauge(input);
  const placeholder = inspectPlaceholder(input);
  const respawn = inspectRespawn(input);
  const kernel = inspectKernel(input);
  const raced =
    input.seated !== true &&
    ((timber.dropped && kernel.enxio) ||
      (placeholder.cat && respawn.kill) ||
      input.raced === true);
  const seated =
    input.seated === true &&
    raced !== true &&
    timber.seated;
  const path =
    (placeholder.cat && respawn.kill && gauge.boundary) &&
    (input.event === "ptmx-race" || input.ptmxRace === true);
  return {
    timber,
    gauge,
    placeholder,
    respawn,
    kernel,
    stations: BOOTH_STATIONS,
    raced: raced && !seated && !path,
    seated:
      seated ||
      (timber.seated &&
        !kernel.enxio &&
        input.raced !== true &&
        input.ptmxRace !== true),
    ptmxRace: path && !seated,
    mark:
      path && !seated
        ? "ptmx-race"
        : raced && !seated
          ? "raced"
          : "seated",
  };
}

/**
 * Published cathead walk from #93624 only. Facts from the issue text.
 * A seated booth holds the new pane without the cat+respawn race.
 * A raced booth frees the placeholder mid-open at a 16-slot boundary.
 * A ptmx-race booth names the clone/get_ioctl race as the path.
 */
export const CATHEAD_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-seated",
    seated: true,
    raced: false,
    waitExit: true,
    cue: "seated",
    note: "idle HOLD: cathead timber holds the new pane; no placeholder-cat + respawn-pane -k race; forkpty opens a live PTY",
  },
  {
    t: "split",
    event: "placeholder-cat",
    raced: true,
    placeholderCat: true,
    cue: "raced",
    note: "TmuxBackend split-window -d … -- cat — placeholder occupies one PTY",
  },
  {
    t: "remain",
    event: "placeholder-cat",
    raced: true,
    placeholderCat: true,
    cue: "raced",
    note: "set-option -p remain-on-exit failed",
  },
  {
    t: "respawn",
    event: "respawn-kill",
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    cue: "raced",
    note: "respawn-pane -k closes the placeholder master and immediately forkpty’s the replacement",
  },
  {
    t: "clone",
    event: "pis-total",
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    pisTotal: true,
    slotBoundary: true,
    cue: "raced",
    note: "ptmx_clone picks minor; system-wide PTY usage is exactly vector_size−1",
  },
  {
    t: "free",
    event: "grow-skipped",
    raced: true,
    growSkipped: true,
    slotBoundary: true,
    cue: "raced",
    note: "freed placeholder slot makes pis_free==1 so grow is skipped",
  },
  {
    t: "ioctl",
    event: "enxio",
    raced: true,
    enxio: true,
    growSkipped: true,
    cue: "raced",
    note: "ptmx_get_ioctl failed because minor number 96 was out of range",
  },
  {
    t: "enxio",
    event: "enxio",
    raced: true,
    enxio: true,
    forkptyRace: true,
    cue: "raced",
    note: "fork failed: Device not configured (ENXIO)",
  },
  {
    t: "retry",
    event: "vector-16",
    raced: true,
    vector16: true,
    enxio: true,
    cue: "raced",
    note: "vector never shrinks; every retry fails identically; 6/6 spawn failures",
  },
  {
    t: "repro",
    event: "forkpty-race",
    raced: true,
    forkptyRace: true,
    slotBoundary: true,
    cue: "raced",
    note: "deterministic at boundary−1; plain forkpty→close→openpty fails; close→wait for child exit→openpty succeeds",
  },
  {
    t: "expect",
    event: "wait-exit-ok",
    seated: true,
    waitExit: true,
    cue: "seated",
    note: "expected: spawn teammate directly in split-window, or kill placeholder and wait for pid before respawn",
  },
  {
    t: "path",
    event: "ptmx-race",
    raced: true,
    ptmxRace: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    cue: "raced",
    note: "ptmx-race — clone picks pis_total; freed placeholder skips grow",
  },
  {
    t: "score",
    event: "cathead",
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    enxio: true,
    ptmxRace: true,
    cue: "raced",
    note: "cathead — when the cat placeholder frees mid-open at a 16-slot boundary, the cathead drops the new pane with ENXIO",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "wait-exit-ok",
    seated: true,
    waitExit: true,
    cue: "seated",
    note: "positive control: kill placeholder and wait for pid before respawn",
  },
  {
    t: "direct",
    event: "cue-seated",
    seated: true,
    cue: "seated",
    note: "positive control: spawn teammate directly in split-window (no cat/respawn)",
  },
  {
    t: "pregrow",
    event: "pregrow-workaround",
    seated: true,
    pregrow: true,
    cue: "seated",
    note: "positive control: pre-grow vector once per boot (~512 ptmx open/close)",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    seated: true,
    raced: false,
    waitExit: true,
    cue: "seated",
  };
}

export function seedSeated() {
  return { ...emptyTicket() };
}

export function seedRaced() {
  return {
    seed: SEEDED_WORD,
    seated: false,
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    pisTotal: true,
    vector16: true,
    forkptyRace: true,
    enxio: true,
    ptmxRace: true,
    cue: "raced",
    issue: FEATURED_ISSUE,
    timber: SAMPLE_TIMBER,
    gauge: SAMPLE_GAUGE,
    placeholder: SAMPLE_PLACEHOLDER,
    respawn: SAMPLE_RESPAWN,
    kernel: SAMPLE_KERNEL,
  };
}

export function seedCathead() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    enxio: true,
    ptmxRace: true,
    cue: "raced",
  };
}

export function seedPtmxRace() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    raced: true,
    ptmxRace: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    event: "ptmx-race",
    cue: "raced",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    seated: true,
    cue: "seated",
  };
}

export function seedEnxio() {
  return { seed: "enxio", preferSeed: true, enxio: true, cue: "raced" };
}

export function seedPlaceholderCat() {
  return { seed: "placeholder-cat", preferSeed: true, placeholderCat: true, cue: "raced" };
}

export function seedRespawnKill() {
  return { seed: "respawn-kill", preferSeed: true, respawnKill: true, cue: "raced" };
}

export function seedSlotBoundary() {
  return { seed: "slot-boundary", preferSeed: true, slotBoundary: true, cue: "raced" };
}

export function seedGrowSkipped() {
  return { seed: "grow-skipped", preferSeed: true, growSkipped: true, cue: "raced" };
}

export function seedPisTotal() {
  return { seed: "pis-total", preferSeed: true, pisTotal: true, cue: "raced" };
}

export function seedVector16() {
  return { seed: "vector-16", preferSeed: true, vector16: true, cue: "raced" };
}

export function seedForkptyRace() {
  return { seed: "forkpty-race", preferSeed: true, forkptyRace: true, cue: "raced" };
}

export function seedWaitExitOk() {
  return { seed: "wait-exit-ok", preferSeed: true, waitExit: true, cue: "seated" };
}

export function seedPregrowWorkaround() {
  return { seed: "pregrow-workaround", preferSeed: true, pregrow: true, cue: "seated" };
}

export function seedInProcessMode() {
  return { seed: "in-process-mode", preferSeed: true, inProcess: true, cue: "seated" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      seated: false,
      raced: false,
      ptmxRace: false,
      placeholderCat: false,
      respawnKill: false,
      slotBoundary: false,
      growSkipped: false,
      pisTotal: false,
      vector16: false,
      forkptyRace: false,
      waitExit: false,
      pregrow: false,
      inProcess: false,
      enxio: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    seated: raw.seated === true,
    raced:
      raw.raced === true ||
      raw.event === "raced" ||
      raw.event === "cathead",
    ptmxRace: raw.ptmxRace === true || raw.event === "ptmx-race",
    placeholderCat: raw.placeholderCat === true || raw.event === "placeholder-cat",
    respawnKill: raw.respawnKill === true || raw.event === "respawn-kill",
    slotBoundary: raw.slotBoundary === true || raw.event === "slot-boundary",
    growSkipped: raw.growSkipped === true || raw.event === "grow-skipped",
    pisTotal: raw.pisTotal === true || raw.event === "pis-total",
    vector16: raw.vector16 === true || raw.event === "vector-16",
    forkptyRace: raw.forkptyRace === true || raw.event === "forkpty-race",
    waitExit: raw.waitExit === true || raw.event === "wait-exit-ok",
    pregrow: raw.pregrow === true || raw.event === "pregrow-workaround",
    inProcess: raw.inProcess === true || raw.event === "in-process-mode",
    enxio: raw.enxio === true || raw.event === "enxio",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    timber: raw.timber,
    gauge: raw.gauge,
    placeholder: raw.placeholder,
    respawn: raw.respawn,
    kernel: raw.kernel,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.seated != null ||
        ticket.raced != null ||
        ticket.ptmxRace != null ||
        ticket.placeholderCat != null ||
        ticket.respawnKill != null ||
        ticket.enxio != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.timber ||
        ticket.gauge ||
        ticket.placeholder ||
        ticket.kernel),
  );
}

function isSeated(row) {
  if (row.raced && row.cue !== "seated") return false;
  if (
    row.cue === "raced" ||
    row.cue === "cathead" ||
    row.cue === "ptmx-race"
  ) {
    return false;
  }
  if (
    row.placeholderCat &&
    row.respawnKill &&
    row.cue !== "seated" &&
    row.seated !== true
  ) {
    return false;
  }
  if (
    row.ptmxRace &&
    row.placeholderCat &&
    row.cue !== "seated" &&
    row.seated !== true
  ) {
    return false;
  }
  if (row.seated === true && row.raced !== true && row.cue !== "raced") {
    return true;
  }
  if (
    row.cue === "seated" &&
    row.raced !== true &&
    row.placeholderCat !== true &&
    row.ptmxRace !== true
  ) {
    return true;
  }
  if (
    (row.waitExit === true || row.pregrow === true || row.inProcess === true) &&
    row.raced !== true &&
    row.placeholderCat !== true &&
    row.respawnKill !== true &&
    row.ptmxRace !== true
  ) {
    return true;
  }
  return false;
}

function isPtmxRacePath(row) {
  return (
    row.event === "ptmx-race" &&
    !isSeated(row) &&
    (row.ptmxRace === true || row.placeholderCat === true || row.growSkipped === true)
  );
}

function isRaced(row) {
  if (isSeated(row)) return false;
  if (isPtmxRacePath(row) && row.cue !== "raced") return false;
  if (row.cue === "raced" || row.cue === "cathead") return true;
  if (row.raced === true) return true;
  if (
    row.placeholderCat === true &&
    row.respawnKill === true &&
    row.enxio === true
  ) {
    return true;
  }
  if (row.placeholderCat === true && row.respawnKill === true) {
    return true;
  }
  if (
    row.placeholderCat === true ||
    row.respawnKill === true ||
    row.enxio === true ||
    (row.ptmxRace === true && row.growSkipped === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cathead pass against the PTY-slot booth.
 * seated: timber holds the new pane; no cat+respawn race.
 * raced / cathead: placeholder frees mid-open at a 16-slot boundary; ENXIO.
 * ptmx-race: clone picks pis_total; freed placeholder skips grow.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPtmxRacePath(row) ||
    (row.ptmxRace && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "ptmx-race";
  } else if (isRaced(row)) {
    verdict = "cathead";
  } else if (isSeated(row)) {
    verdict = "seated";
  } else if (
    row.placeholderCat ||
    row.respawnKill ||
    row.enxio ||
    (row.ptmxRace && !row.waitExit)
  ) {
    verdict = "cathead";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const timber = inspectTimber(row);
  const gauge = inspectGauge(row);
  const placeholder = inspectPlaceholder(row);
  const respawn = inspectRespawn(row);
  const kernel = inspectKernel(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    seated: verdict === "seated" || verdict === "hold",
    raced:
      verdict === "raced" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    ptmxRace:
      row.ptmxRace === true ||
      verdict === "ptmx-race" ||
      verdict === PATH_WORD,
    placeholderCat: row.placeholderCat,
    respawnKill: row.respawnKill,
    slotBoundary: row.slotBoundary,
    growSkipped: row.growSkipped,
    pisTotal: row.pisTotal,
    vector16: row.vector16,
    forkptyRace: row.forkptyRace,
    waitExit: row.waitExit,
    pregrow: row.pregrow,
    inProcess: row.inProcess,
    enxio: row.enxio,
    cue: hold
      ? "seated"
      : row.ptmxRace || verdict === "ptmx-race"
        ? "ptmx-race"
        : "raced",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit seated" : "score cathead",
    timberInspect: timber,
    gaugeInspect: gauge,
    placeholderInspect: placeholder,
    respawnInspect: respawn,
    kernelInspect: kernel,
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
      : CATHEAD_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const raced = scored.filter((row) => row.verdict === "cathead" || row.verdict === "raced");
  const path = scored.filter((row) => row.verdict === "ptmx-race");
  const seated = scored.filter((row) => row.verdict === "seated");
  const headline =
    scored.find((row) => row.event === "raced") ||
    scored.find((row) => row.event === "ptmx-race") ||
    scored.find((row) => row.event === "placeholder-cat") ||
    raced[raced.length - 1];
  let verdict = "seated";
  if (raced.length) verdict = "cathead";
  else if (path.length && !seated.length) verdict = "ptmx-race";
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
    racedCount: raced.length,
    pathCount: path.length,
    seatedCount: seated.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit seated" : "score cathead",
    note: headline
      ? "macOS teammate spawn; TmuxBackend split-window -- cat then respawn-pane -k; xnu ptmx clone/get_ioctl race at a 16-slot boundary; ENXIO."
      : "published cathead walk scored against seated vs raced",
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
    seeded !== "seated" &&
    seeded !== "raced" &&
    seeded !== "ptmx-race" &&
    seeded !== "cathead" &&
    ticket.seated == null &&
    ticket.raced == null &&
    ticket.placeholderCat == null &&
    ticket.ptmxRace == null &&
    ticket.respawnKill == null &&
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
    seated: scored.seated ?? false,
    raced: scored.raced ?? false,
    ptmxRace: scored.ptmxRace ?? false,
    placeholderCat: scored.placeholderCat ?? false,
    respawnKill: scored.respawnKill ?? false,
    slotBoundary: scored.slotBoundary ?? false,
    growSkipped: scored.growSkipped ?? false,
    pisTotal: scored.pisTotal ?? false,
    vector16: scored.vector16 ?? false,
    forkptyRace: scored.forkptyRace ?? false,
    waitExit: scored.waitExit ?? false,
    pregrow: scored.pregrow ?? false,
    inProcess: scored.inProcess ?? false,
    enxio: scored.enxio ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.seated && !result.raced ? "timber=seated" : "timber=dropped",
    result.slotBoundary || result.raced ? "gauge=boundary" : "gauge=slack",
    result.placeholderCat || result.raced ? "placeholder=cat" : "placeholder=clear",
    result.respawnKill || result.raced ? "respawn=kill" : "respawn=hold",
    result.enxio || result.raced ? "kernel=enxio" : "kernel=quiet",
    result.ptmxRace || result.verdict === "ptmx-race"
      ? "path=ptmx-race"
      : "path=seated",
    result.cue === "seated"
      ? "cue=seated"
      : result.cue === "ptmx-race"
        ? "cue=ptmx-race"
        : "cue=raced",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    seated: result.seated,
    raced: result.raced,
    ptmxRace: result.ptmxRace,
    placeholderCat: result.placeholderCat,
    respawnKill: result.respawnKill,
    slotBoundary: result.slotBoundary,
    growSkipped: result.growSkipped,
    enxio: result.enxio,
    forkptyRace: result.forkptyRace,
    waitExit: result.waitExit,
    timber: input && input.timber,
    gauge: input && input.gauge,
    placeholder: input && input.placeholder,
    respawn: input && input.respawn,
    kernel: input && input.kernel,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    timber: inspectTimber({
      seated: result.seated,
      raced: result.raced,
      enxio: result.enxio,
      waitExit: result.waitExit,
      ptmxRace: result.ptmxRace,
      timber: input && input.timber,
    }),
    gauge: inspectGauge({
      seated: result.seated,
      raced: result.raced,
      slotBoundary: result.slotBoundary,
      growSkipped: result.growSkipped,
      gauge: input && input.gauge,
    }),
    placeholder: inspectPlaceholder({
      seated: result.seated,
      raced: result.raced,
      placeholderCat: result.placeholderCat,
      placeholder: input && input.placeholder,
    }),
    respawn: inspectRespawn({
      seated: result.seated,
      raced: result.raced,
      respawnKill: result.respawnKill,
      forkptyRace: result.forkptyRace,
      waitExit: result.waitExit,
      respawn: input && input.respawn,
    }),
    kernel: inspectKernel({
      seated: result.seated,
      raced: result.raced,
      enxio: result.enxio,
      growSkipped: result.growSkipped,
      kernel: input && input.kernel,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      raced: result.raced === true || result.verdict === "raced" || result.verdict === "cathead",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      ptmxGrowVector: PTMX_GROW_VECTOR,
      kernelMinor: KERNEL_MINOR,
      kernelLog: KERNEL_LOG,
      darwin: DARWIN,
      arch: ARCH,
      tmuxVersion: TMUX_VERSION,
      claudeVersion: CLAUDE_VERSION,
      teammateMode: TEAMMATE_MODE,
      splitCmd: SPLIT_CMD,
      respawnCmd: RESPAWN_CMD,
      spawnFailures: SPAWN_FAILURES,
      pregrowCount: PREGROW_COUNT,
      inProcessMode: IN_PROCESS_MODE,
      xxxComment: XXX_COMMENT,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "spawn teammate directly in split-window (no cat/respawn); or kill placeholder and wait for pid before respawn; or detect ENXIO and force vector grow via open+close extra /dev/ptmx then retry on a fresh pane",
      ],
      hypothesis:
        "NON-BINDING: if TmuxBackend avoided cat+respawn-pane -k (direct split-window command, or wait-for-placeholder-exit before respawn, or ENXIO-triggered forced vector grow on a fresh pane), the race would not fire. Verify against #93624 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
