#!/usr/bin/env node
/**
 * Derelict — maritime abandoned-hulk / derelict-ship / salvage-yard booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * When a session is stopped / crashed / cleared / closed while a
 * long-running Bash-tool subprocess is in flight (tsc --noEmit,
 * vitest run), that subprocess is NOT terminated. It reparents to
 * PID 1 and keeps running unsupervised for hours. Session list
 * shows isRunning:false while the orphan still burns CPU/RAM.
 *
 *   node derelict.mjs data/derelict.json
 *   echo '{"seed":"derelict"}' | node derelict.mjs
 *
 * Idle word is berthed (HOLD: moored / reaped / shepherded / process-group).
 * Seeded word is derelict (#93996 — the session-kill orphan).
 * Path word is session-kill-orphan.
 * Product score word is derelict (Score derelict or admit berthed.).
 *
 * Encoded from anthropics/claude-code#93996 issue text only.
 * Hypothesis (NON-BINDING): session teardown does not kill the
 * Bash-tool process tree (no process-group + signal on teardown),
 * so in-flight tsc/vitest reparent to PID 1 and run unsupervised.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Gleaner/#93794 (unreaped background `&` jobs inside a *live*
 * Bash tool call — `yes` pegging cores). Cite-only cousin.
 * NOT Foundling/#93889 (subagent finished; `run_in_background` Bash
 * left with no owner while parent graph still exists). Cite-only cousin.
 * NOT Vestry/#94008 (mount-refcount-race). NOT Surfeit/#94012
 * (quota-spawn-cascade). NOT Phosphene/#94003 (layer-tree-walk).
 * NOT Demesne/#93989 (home-bind-overreach). NOT Ashpan/#93780.
 * NOT Waif, Jetsam, Relict, or any prior booth.
 * Derelict is specifically: SESSION TEARDOWN DOES NOT KILL
 * BASH-TOOL CHILDREN — orphan to PID 1 after stop/crash/clear;
 * tsc/vitest run hours unsupervised.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "berthed",
  "derelict",
  "session-kill-orphan",
  "hold",
  "moored",
  "reaped",
  "shepherded",
  "process-group",
  "ppid-one",
  "tsc-orphan",
  "vitest-orphan",
  "swap-hot",
  "is-running-false",
  "teardown-signal",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "berthed";
export const PATH_WORD = "session-kill-orphan";
export const SEEDED_WORD = "derelict";
export const PRODUCT_WORD = "derelict";
export const HOLD = Object.freeze(["berthed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "berthed",
  "moored",
  "reaped",
  "shepherded",
  "process-group",
]);
export const RECOVER = Object.freeze(["berthed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "pegged",
  "vestry",
  "mount-refcount-race",
  "tempered",
  "surfeit",
  "quota-spawn-cascade",
  "solvent",
  "frugal",
  "circuit-held",
  "no-spawn",
  "quiescent",
  "phosphene",
  "layer-tree-walk",
  "diplomatic",
  "parablepsis",
  "latin1-edit-wipe",
  "demesned",
  "demesne",
  "home-bind-overreach",
  "diagrammed",
  "cartouche",
  "section-poster",
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "latin1-edit-wipe",
  "home-bind-overreach",
  "latent",
  "afterimage",
  "legible",
  "scotomized",
  "scotoma",
  "command-args-blind",
  "followspot",
  "thrash",
  "scrim",
  "relict",
  "pentimento",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "gleaner",
  "gleaned",
  "unreaped",
  "unreaped-ampersand",
  "vested",
  "plenary",
  "swept",
  "live",
  "ashpan",
  "waif",
  "jetsam",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "derelict"),
);

export const FEATURED_ISSUE = 93996;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93996";
export const TITLE =
  "Orphaned Bash-tool subprocesses (tsc/vitest) outlive a terminated session and run unsupervised for hours";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:bash",
]);
export const PLATFORM = "macos";
export const SURFACE = "session-kill-orphan";
export const HOST = "Claude Code Bash tool";
export const CHECKED_ON =
  "macos; session stop/crash/clear/close; tsc 5h32m / 472+ CPU-minutes; earlier-day swap 23.2/24.5 GB; isRunning:false while orphan burns";
export const BUILD = "unspecified";
export const SELECTED_MODEL = "unspecified";
export const OS = "macos";
export const PHRASE = "Score derelict or admit berthed.";
export const DISTRIBUTION =
  "When a Claude Code session is stopped, crashed, cleared, or closed while a long-running Bash-tool subprocess is in flight (e.g. tsc --noEmit, vitest run), that subprocess is NOT terminated. It reparents to PID 1 and keeps running unsupervised for hours. Observed: tsc 5h32m / 472+ CPU-minutes; earlier day swap 23.2/24.5 GB. Session list shows isRunning:false while the orphan still burns CPU/RAM. Expected: session process death should kill the full Bash-tool process tree (process group + signal on teardown). Actual: survives, PPID=1, unsupervised. OPEN, has-repro, platform:macos, area:bash.";

export const RULED_OUT = Object.freeze([
  "Gleaner/#93794 unreaped-ampersand — unreaped background `&` jobs inside a *live* Bash tool call (`yes` pegging cores); different lifecycle",
  "Foundling/#93889 subagent-bash-outlive — subagent finished; run_in_background Bash left with no owner while parent graph still exists",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder cleanup, not session-kill orphans",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit, not Bash-tool teardown",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash, not PID-1 orphans",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`; different bwrap defect",
  "Ashpan/#93780 orphan-jsonl — delete_session burns the ledger; not session-kill Bash children",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe, not process teardown",
  "Cartouche/#93772 section-poster — wrong diagram type, not session-kill",
  "Attaint/#93821 session-attainder — cyber-safeguard stain, not Bash orphans",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout, not process-group teardown",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not session-kill",
  "Trismus/#93823 UNUserNotification XPC lockjaw — freeze, not tsc/vitest derelict",
  "Crasis/#93960 store-slug-collide — memory drawer, not Bash teardown",
  "Tessera/#93929 version-path-tcc — privacy-pane rows, not session-kill",
  "Mojibake/#93848 fffd-spall — encoding, not process lifecycle",
  "Waif / Jetsam / Relict — different catalog defects",
  "Afterimage — CRT phosphor residual, not abandoned hulk",
  "Thrash — different catalog thrash booth, not session-kill-orphan",
]);
export const EXPECTED = Object.freeze([
  "Session process death should kill the full Bash-tool process tree",
  "Teardown must send a signal to the process group, not leave children berthed to PID 1",
  "A stopped / crashed / cleared / closed session must not leave tsc --noEmit or vitest run unsupervised",
  "isRunning:false in the session list must mean the cargo is dark — no CPU-minutes after the pier empties",
  "Hours-long tsc (5h32m / 472+ CPU-minutes) and swap-hot leftovers must not survive after the session is gone",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "ppid-one",
    label: "ppid one",
    count: "PPID=1",
    note: "Bash-tool child reparents to PID 1 after session death; no living owner",
  },
  {
    id: "tsc-orphan",
    label: "tsc orphan",
    count: "5h32m / 472+ CPU-min",
    note: "tsc --noEmit in flight at session stop; survives and burns unsupervised",
  },
  {
    id: "vitest-orphan",
    label: "vitest orphan",
    count: "vitest run",
    note: "vitest run in flight at session stop; same derelict hold as tsc",
  },
  {
    id: "is-running-false",
    label: "isRunning false",
    count: "isRunning:false",
    note: "session list reports stopped while the orphan still burns CPU/RAM",
  },
  {
    id: "teardown-signal",
    label: "teardown signal",
    count: "no group signal",
    note: "session death does not signal the Bash-tool process group",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "berthed-pier",
    survey:
      "pier still berthed; process-group shepherded; session death kills the Bash-tool tree",
    kind: "berthed",
    note: "idle: berthed — the hold/good path",
  },
  {
    id: "ppid-one",
    survey:
      "session stop/crash/clear reparents the in-flight Bash child to PID 1",
    kind: "derelict",
    note: "seeded: ppid-one of the abandoned hulk",
  },
  {
    id: "session-kill-orphan",
    survey:
      "session process death does not kill the full Bash-tool process tree — tsc/vitest keep steaming",
    kind: "derelict",
    note: "path: session-kill-orphan names the unsupervised hulk",
  },
  {
    id: "teardown-signal",
    survey:
      "no process-group + signal on teardown; cargo stays lit after the pier empties",
    kind: "derelict",
    note: "seeded: teardown-signal missing from the lantern rail",
  },
  {
    id: "derelict",
    survey:
      "the hulk is derelict — PPID=1; tsc 5h32m / 472+ CPU-min; vitest run; swap-hot; isRunning:false",
    kind: "derelict",
    note: "seeded: derelict — Score derelict or admit berthed.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "session-kill-orphan",
  "derelict",
  "ppid-one",
  "tsc-orphan",
  "vitest-orphan",
  "is-running-false",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93794,
    title:
      "Background `&` jobs in a Bash tool call are orphaned, not reaped: 39 `yes` processes pegged ~7 cores for 8h42m",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Gleaner / unreaped `&` inside a *live* Bash tool call. Different lifecycle. Do not conflate with session-teardown orphans.",
  },
  {
    issue: 93889,
    title:
      "Subagents' background Bash tasks outlive the subagent; orphaned polling loops run for an hour with no way for the parent to stop them",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Foundling / subagent-bash-outlive. Parent graph still exists; different owner gap. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925 webview blackout", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967 OAuth 403 Windows", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957 stuck after interrupt", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "gleaner",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "afterimage",
  "thrash",
  "ashpan",
  "waif",
  "jetsam",
  "relict",
]);

export const SAMPLE_KIND_IDLE = "moored";
export const SAMPLE_KIND_SEEDED = "session-kill-orphan";
export const SAMPLE_HOLDING_IDLE = "shepherded";
export const SAMPLE_HOLDING_SEEDED = "adrift";

export const SAMPLE_BERTHED_PROOF = Object.freeze({
  berthed: true,
  derelict: false,
  sessionKillOrphan: false,
  ppidOne: false,
  tscOrphan: false,
  vitestOrphan: false,
  swapHot: false,
  isRunningFalse: false,
  teardownSignal: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DERELICT_PROOF = Object.freeze({
  berthed: false,
  derelict: true,
  sessionKillOrphan: true,
  ppidOne: true,
  tscOrphan: true,
  vitestOrphan: true,
  swapHot: true,
  isRunningFalse: true,
  teardownSignal: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds berthed: process-group shepherded; session death kills the Bash-tool tree" },
  { t: "ppid-one", line: "session stop/crash/clear reparents the in-flight Bash child to PID 1" },
  { t: "tsc-orphan", line: "tsc --noEmit still steaming 5h32m / 472+ CPU-minutes after the pier empties" },
  { t: "path", line: "session-kill-orphan — no process-group signal; cargo stays lit unsupervised" },
  { t: "score", line: "when session teardown leaves a PID-1 hulk the booth is derelict — Score derelict or admit berthed." },
]);

/**
 * Pier map: berthed hulk vs abandoned derelict.
 * Idle/berthed: process-group shepherded; session death kills the tree.
 * Seeded/derelict: teardown leaves tsc/vitest smoking in the hold at PID 1.
 */
export function mapPier(input = {}) {
  const derelict =
    input.derelict === true ||
    input.sessionKillOrphan === true ||
    input.ppidOne === true ||
    input.tscOrphan === true ||
    input.vitestOrphan === true ||
    input.swapHot === true ||
    input.isRunningFalse === true ||
    input.teardownSignal === true;
  const berthed = input.berthed === true && !derelict;
  return {
    stamp: derelict ? "session-kill-orphan" : "berthed-pier",
    holdingLane: derelict ? "adrift" : "shepherded",
    kindLane: derelict ? "session-kill-orphan" : "moored",
    bindLane: derelict ? "ppid-one" : "process-group",
    ribbon: derelict ? "derelict" : "berthed",
    berthed,
  };
}

export function inspectHull(input = {}) {
  const adrift =
    input.derelict === true ||
    input.sessionKillOrphan === true ||
    input.teardownSignal === true;
  if (input.berthed === true && !adrift) {
    return {
      stamp: "hull-berthed",
      adrift: false,
    };
  }
  return {
    stamp: adrift ? "hull-adrift" : "hull-idle",
    adrift,
    note: adrift
      ? "session death leaves the Bash-tool tree steaming — no process-group signal on teardown"
      : "",
  };
}

export function inspectPpid(input = {}) {
  const hit =
    input.ppidOne === true ||
    input.derelict === true;
  if (input.berthed === true && !hit) {
    return {
      stamp: "ppid-shepherded",
      orphan: false,
    };
  }
  return {
    stamp: hit ? "ppid-one" : "ppid-idle",
    orphan: hit,
    note: hit
      ? "in-flight Bash-tool child reparents to PID 1 after session stop/crash/clear"
      : "",
  };
}

export function inspectCargo(input = {}) {
  const smoking =
    input.tscOrphan === true ||
    input.vitestOrphan === true ||
    input.derelict === true;
  if (input.berthed === true && !smoking) {
    return {
      stamp: "cargo-dark",
      smoking: false,
    };
  }
  return {
    stamp: smoking ? "cargo-smoking" : "cargo-idle",
    smoking,
    note: smoking
      ? "tsc --noEmit 5h32m / 472+ CPU-minutes; vitest run still in the hold after the pier empties"
      : "",
  };
}

export function inspectSwap(input = {}) {
  const hot =
    input.swapHot === true ||
    input.derelict === true;
  if (input.berthed === true && !hot) {
    return {
      stamp: "swap-cool",
      hot: false,
    };
  }
  return {
    stamp: hot ? "swap-hot" : "swap-idle",
    hot,
    note: hot
      ? "earlier-day swap 23.2/24.5 GB while the unsupervised hulk burned RAM"
      : "",
  };
}

export function inspectTeardown(input = {}) {
  const missed =
    input.teardownSignal === true ||
    input.isRunningFalse === true ||
    input.derelict === true;
  if (input.berthed === true && !missed) {
    return {
      stamp: "teardown-signaled",
      missed: false,
    };
  }
  return {
    stamp: missed ? "teardown-signal" : "teardown-idle",
    missed,
    note: missed
      ? "isRunning:false while the orphan burns; no process-group + signal on session death"
      : "",
  };
}

export function readBooth(input = {}) {
  const derelict =
    input.derelict === true ||
    input.sessionKillOrphan === true ||
    input.ppidOne === true ||
    input.tscOrphan === true ||
    input.vitestOrphan === true ||
    input.swapHot === true ||
    input.isRunningFalse === true ||
    input.teardownSignal === true;
  const berthed = input.berthed === true && !derelict;
  return {
    mark: derelict ? "derelict" : berthed || !derelict ? "berthed" : "derelict",
    berthed,
    derelict,
    sessionKillOrphan: input.sessionKillOrphan === true || derelict,
    ppidOne: input.ppidOne === true,
    tscOrphan: input.tscOrphan === true,
    vitestOrphan: input.vitestOrphan === true,
    swapHot: input.swapHot === true,
    isRunningFalse: input.isRunningFalse === true,
    teardownSignal: input.teardownSignal === true,
    scope: mapPier(input),
    hull: inspectHull(input),
    ppid: inspectPpid(input),
    cargo: inspectCargo(input),
    swap: inspectSwap(input),
    teardown: inspectTeardown(input),
    log: input.log || [],
  };
}

export const DERELICT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-berthed",
    berthed: true,
    derelict: false,
    cue: "berthed",
    note: "idle HOLD: process-group shepherded; session death kills the Bash-tool tree — the hold/good path",
  },
  {
    t: "ppid-one",
    event: "ppid-one",
    derelict: true,
    ppidOne: true,
    cue: "derelict",
    note: "session stop/crash/clear reparents the in-flight Bash child to PID 1",
  },
  {
    t: "tsc-orphan",
    event: "tsc-orphan",
    derelict: true,
    tscOrphan: true,
    vitestOrphan: true,
    cue: "derelict",
    note: "tsc --noEmit still steaming 5h32m / 472+ CPU-minutes; vitest run in the hold",
  },
  {
    t: "path",
    event: "session-kill-orphan",
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    tscOrphan: true,
    cue: "derelict",
    note: "session-kill-orphan — no process-group signal; cargo stays lit unsupervised",
  },
  {
    t: "score",
    event: "derelict",
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    tscOrphan: true,
    vitestOrphan: true,
    swapHot: true,
    isRunningFalse: true,
    teardownSignal: true,
    cue: "derelict",
    note: "derelict — when session teardown leaves a PID-1 hulk the booth is derelict",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-berthed",
    berthed: true,
    derelict: false,
    cue: "berthed",
    note: "positive control: process-group shepherded; session death kills the Bash-tool tree",
  },
  {
    t: "announce",
    event: "cue-berthed",
    berthed: true,
    cue: "berthed",
    note: "positive control: the hulk stays berthed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    berthed: true,
    derelict: false,
    sessionKillOrphan: false,
    cue: "berthed",
  };
}

export function seedBerthed() {
  return { ...emptyTicket() };
}

export function seedDerelict() {
  return {
    seed: SEEDED_WORD,
    berthed: false,
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    tscOrphan: true,
    vitestOrphan: true,
    swapHot: true,
    isRunningFalse: true,
    teardownSignal: true,
    cue: "derelict",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DERELICT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    cue: "derelict",
  };
}

export function seedSessionKillOrphan() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    event: "session-kill-orphan",
    cue: "derelict",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    berthed: true,
    cue: "berthed",
  };
}

export function seedPpidOne() {
  return {
    seed: "ppid-one",
    preferSeed: true,
    ppidOne: true,
    cue: "derelict",
  };
}

export function seedTscOrphan() {
  return {
    seed: "tsc-orphan",
    preferSeed: true,
    tscOrphan: true,
    cue: "derelict",
  };
}

export function seedVitestOrphan() {
  return {
    seed: "vitest-orphan",
    preferSeed: true,
    vitestOrphan: true,
    cue: "derelict",
  };
}

export function seedSwapHot() {
  return {
    seed: "swap-hot",
    preferSeed: true,
    swapHot: true,
    cue: "derelict",
  };
}

export function seedIsRunningFalse() {
  return {
    seed: "is-running-false",
    preferSeed: true,
    isRunningFalse: true,
    cue: "derelict",
  };
}

export function seedTeardownSignal() {
  return {
    seed: "teardown-signal",
    preferSeed: true,
    teardownSignal: true,
    cue: "derelict",
  };
}

export function seedMoored() {
  return {
    seed: "moored",
    preferSeed: true,
    berthed: true,
    cue: "berthed",
  };
}

export function seedReaped() {
  return {
    seed: "reaped",
    preferSeed: true,
    berthed: true,
    cue: "berthed",
  };
}

export function seedShepherded() {
  return {
    seed: "shepherded",
    preferSeed: true,
    berthed: true,
    cue: "berthed",
  };
}

export function seedProcessGroup() {
  return {
    seed: "process-group",
    preferSeed: true,
    berthed: true,
    cue: "berthed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      berthed: false,
      derelict: false,
      sessionKillOrphan: false,
      ppidOne: false,
      tscOrphan: false,
      vitestOrphan: false,
      swapHot: false,
      isRunningFalse: false,
      teardownSignal: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    berthed: raw.berthed === true,
    derelict: raw.derelict === true || raw.event === "derelict",
    sessionKillOrphan:
      raw.sessionKillOrphan === true || raw.event === "session-kill-orphan",
    ppidOne: raw.ppidOne === true || raw.event === "ppid-one",
    tscOrphan: raw.tscOrphan === true || raw.event === "tsc-orphan",
    vitestOrphan: raw.vitestOrphan === true || raw.event === "vitest-orphan",
    swapHot: raw.swapHot === true || raw.event === "swap-hot",
    isRunningFalse:
      raw.isRunningFalse === true || raw.event === "is-running-false",
    teardownSignal:
      raw.teardownSignal === true || raw.event === "teardown-signal",
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
      (ticket.berthed != null ||
        ticket.derelict != null ||
        ticket.sessionKillOrphan != null ||
        ticket.ppidOne != null ||
        ticket.tscOrphan != null ||
        ticket.vitestOrphan != null ||
        ticket.swapHot != null ||
        ticket.isRunningFalse != null ||
        ticket.teardownSignal != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isBerthed(row) {
  if (row.derelict && row.cue !== "berthed") return false;
  if (row.cue === "derelict" || row.cue === "session-kill-orphan") {
    return false;
  }
  if (
    row.sessionKillOrphan &&
    row.ppidOne &&
    row.cue !== "berthed" &&
    row.berthed !== true
  ) {
    return false;
  }
  if (row.berthed === true && row.derelict !== true && row.cue !== "derelict") {
    return true;
  }
  if (
    row.cue === "berthed" &&
    row.derelict !== true &&
    row.sessionKillOrphan !== true &&
    row.ppidOne !== true &&
    row.tscOrphan !== true &&
    row.vitestOrphan !== true &&
    row.swapHot !== true &&
    row.isRunningFalse !== true &&
    row.teardownSignal !== true
  ) {
    return true;
  }
  return false;
}

function isSessionKillOrphan(row) {
  return (
    row.event === "session-kill-orphan" &&
    !isBerthed(row) &&
    (row.sessionKillOrphan === true ||
      row.ppidOne === true ||
      row.tscOrphan === true)
  );
}

function isDerelictRow(row) {
  if (isBerthed(row)) return false;
  if (isSessionKillOrphan(row) && row.cue !== "derelict") return false;
  if (row.cue === "derelict") return true;
  if (row.derelict === true) return true;
  if (row.sessionKillOrphan === true && row.ppidOne === true) {
    return true;
  }
  if (
    row.sessionKillOrphan === true ||
    row.ppidOne === true ||
    row.tscOrphan === true ||
    row.vitestOrphan === true ||
    row.swapHot === true ||
    row.isRunningFalse === true ||
    row.teardownSignal === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one derelict pass against the salvage pier.
 * berthed: process-group shepherded; session death kills the Bash-tool tree.
 * derelict: teardown leaves tsc/vitest smoking in the hold at PID 1.
 * session-kill-orphan: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSessionKillOrphan(row) ||
    (row.sessionKillOrphan && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "session-kill-orphan";
  } else if (isDerelictRow(row)) {
    verdict = "derelict";
  } else if (isBerthed(row)) {
    verdict = "berthed";
  } else if (
    row.sessionKillOrphan ||
    row.ppidOne ||
    row.tscOrphan ||
    row.vitestOrphan ||
    row.swapHot ||
    row.isRunningFalse ||
    row.teardownSignal
  ) {
    verdict = "derelict";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const hull = inspectHull(row);
  const ppid = inspectPpid(row);
  const cargo = inspectCargo(row);
  const swap = inspectSwap(row);
  const teardown = inspectTeardown(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    berthed: verdict === "berthed" || verdict === "hold",
    derelict: verdict === "derelict" || verdict === SEEDED_WORD,
    sessionKillOrphan:
      row.sessionKillOrphan === true ||
      verdict === "session-kill-orphan" ||
      verdict === PATH_WORD,
    ppidOne: row.ppidOne,
    tscOrphan: row.tscOrphan,
    vitestOrphan: row.vitestOrphan,
    swapHot: row.swapHot,
    isRunningFalse: row.isRunningFalse,
    teardownSignal: row.teardownSignal,
    cue: hold
      ? "berthed"
      : row.sessionKillOrphan || verdict === "session-kill-orphan"
        ? "session-kill-orphan"
        : "derelict",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit berthed" : "score derelict",
    hullInspect: hull,
    ppidInspect: ppid,
    cargoInspect: cargo,
    swapInspect: swap,
    teardownInspect: teardown,
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
      : DERELICT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "derelict");
  const path = scored.filter((row) => row.verdict === "session-kill-orphan");
  const berthed = scored.filter((row) => row.verdict === "berthed");
  const headline =
    scored.find((row) => row.event === "derelict") ||
    scored.find((row) => row.event === "session-kill-orphan") ||
    scored.find((row) => row.event === "ppid-one") ||
    dead[dead.length - 1];
  let verdict = "berthed";
  if (dead.length) verdict = "derelict";
  else if (path.length && !berthed.length) verdict = "session-kill-orphan";
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
    derelictCount: dead.length,
    pathCount: path.length,
    berthedCount: berthed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit berthed" : "score derelict",
    note: headline
      ? "Session teardown does not kill Bash-tool children — orphan to PID 1 after stop/crash/clear; tsc/vitest run hours unsupervised. Cousins cite-only: #93794 #93889."
      : "published derelict walk scored against berthed vs derelict",
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
    seeded !== "berthed" &&
    seeded !== "derelict" &&
    seeded !== "session-kill-orphan" &&
    ticket.berthed == null &&
    ticket.derelict == null &&
    ticket.sessionKillOrphan == null &&
    ticket.ppidOne == null &&
    ticket.tscOrphan == null &&
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
    berthed: scored.berthed ?? false,
    derelict: scored.derelict ?? false,
    sessionKillOrphan: scored.sessionKillOrphan ?? false,
    ppidOne: scored.ppidOne ?? false,
    tscOrphan: scored.tscOrphan ?? false,
    vitestOrphan: scored.vitestOrphan ?? false,
    swapHot: scored.swapHot ?? false,
    isRunningFalse: scored.isRunningFalse ?? false,
    teardownSignal: scored.teardownSignal ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.ppidOne || result.derelict ? "kind=session-kill-orphan" : "kind=moored",
    result.tscOrphan || result.derelict ? "tsc=5h32m" : "tsc=none",
    result.sessionKillOrphan || result.verdict === "session-kill-orphan"
      ? "path=session-kill-orphan"
      : "path=berthed",
    result.cue === "berthed"
      ? "cue=berthed"
      : result.cue === "session-kill-orphan"
        ? "cue=session-kill-orphan"
        : "cue=derelict",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    berthed: result.berthed,
    derelict: result.derelict,
    sessionKillOrphan: result.sessionKillOrphan,
    ppidOne: result.ppidOne,
    tscOrphan: result.tscOrphan,
    vitestOrphan: result.vitestOrphan,
    swapHot: result.swapHot,
    isRunningFalse: result.isRunningFalse,
    teardownSignal: result.teardownSignal,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    hull: inspectHull({
      berthed: result.berthed,
      derelict: result.derelict,
      sessionKillOrphan: result.sessionKillOrphan,
      teardownSignal: result.teardownSignal,
    }),
    ppid: inspectPpid({
      berthed: result.berthed,
      derelict: result.derelict,
      ppidOne: result.ppidOne,
    }),
    cargo: inspectCargo({
      berthed: result.berthed,
      derelict: result.derelict,
      tscOrphan: result.tscOrphan,
      vitestOrphan: result.vitestOrphan,
    }),
    swap: inspectSwap({
      berthed: result.berthed,
      derelict: result.derelict,
      swapHot: result.swapHot,
    }),
    teardown: inspectTeardown({
      berthed: result.berthed,
      derelict: result.derelict,
      teardownSignal: result.teardownSignal,
      isRunningFalse: result.isRunningFalse,
    }),
    scope: mapPier({
      berthed: result.berthed,
      derelict: result.derelict,
      sessionKillOrphan: result.sessionKillOrphan,
      ppidOne: result.ppidOne,
      tscOrphan: result.tscOrphan,
      vitestOrphan: result.vitestOrphan,
      swapHot: result.swapHot,
      isRunningFalse: result.isRunningFalse,
      teardownSignal: result.teardownSignal,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      derelict:
        result.derelict === true ||
        result.verdict === "derelict",
    })),
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: session teardown does not kill the Bash-tool process tree (no process-group + signal on teardown), so in-flight tsc/vitest reparent to PID 1 and run unsupervised. Invite verify against #93996 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
