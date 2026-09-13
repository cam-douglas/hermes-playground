#!/usr/bin/env node
/**
 * Phosphene — ophthalmology / entoptic / visual-field clinic booth.
 *
 * Educational diagnostic model for a published Claude Code Desktop defect:
 * while a response streams, WindowServer re-walks a ~50-level CoreAnimation
 * layer tree at 120 Hz (~47% CPU; idle same window 3-6%). The compositor
 * does expensive vsync work the user did not ask for beyond streaming tokens.
 *
 *   node phosphene.mjs data/phosphene.json
 *   echo '{"seed":"phosphene"}' | node phosphene.mjs
 *
 * Idle word is quiescent (HOLD: cooled / steady-frame / idle-ws / no-rewalk).
 * Seeded word is phosphene (#94003 — the WindowServer CA layer-tree thrash).
 * Path word is layer-tree-walk.
 * Product score word is phosphene (Score phosphene or admit quiescent.).
 *
 * Encoded from anthropics/claude-code#94003 issue text only.
 * Hypothesis (NON-BINDING): deep Electron/CA nesting causes prepare_layer0
 * thrash each vsync during streaming invalidation. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 *
 * NOT Afterimage (CRT phosphor residual). NOT Scotoma/#93744 (Humphrey
 * command-args blind). NOT Followspot, Thrash, Scrim, Relict, Pentimento.
 * NOT Parablepsis/#93954 (latin1-edit-wipe). NOT Demesne/#93989
 * (home-bind-overreach). NOT Oriel/#93809 (plan-no-reflow).
 * Cousin cite-only: #93811 (Windows desktop CPU spikes). Do not conflate.
 * Phosphene is specifically WindowServer CA layer-tree thrash while a
 * response streams on Claude Desktop macOS.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "quiescent",
  "phosphene",
  "layer-tree-walk",
  "hold",
  "cooled",
  "steady-frame",
  "idle-ws",
  "no-rewalk",
  "ca-prepare",
  "prepare-layer0",
  "windowserver-47",
  "layer-depth-50",
  "refresh-120",
  "streaming-cpu",
  "idle-cpu",
  "liquid-xdr",
  "m3-pro",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "quiescent";
export const PATH_WORD = "layer-tree-walk";
export const SEEDED_WORD = "phosphene";
export const PRODUCT_WORD = "phosphene";
export const HOLD = Object.freeze(["quiescent", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "quiescent",
  "cooled",
  "steady-frame",
  "idle-ws",
  "no-rewalk",
]);
export const RECOVER = Object.freeze(["quiescent", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "phosphene"),
);

export const FEATURED_ISSUE = 94003;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94003";
export const TITLE =
  "Claude Code Desktop WindowServer ~47% CPU while a response streams (deep CoreAnimation layer tree re-walked at 120 Hz)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "performance",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "layer-tree-walk";
export const HOST = "Claude Desktop";
export const CHECKED_ON =
  "Claude desktop 1.52386.3; macOS 26.6.2; MacBook Pro M3 Pro; Liquid Retina XDR 1512x982 @ 3024x1964; 120 Hz";
export const BUILD = "1.52386.3";
export const SELECTED_MODEL = "unspecified";
export const OS = "macos 26.6.2";
export const PHRASE = "Score phosphene or admit quiescent.";
export const DISTRIBUTION =
  "Claude desktop 1.52386.3 on macOS 26.6.2, MacBook Pro M3 Pro, Liquid Retina XDR 1512x982 @ 3024x1964, 120 Hz. While a response streams, WindowServer sits at ~47% of one core. Idle in the same window: 3-6%. WindowServer main thread re-walks the Claude CA layer tree ~50 levels deep each refresh via ca_prepare_begin_window_update / prepare_layer0 recursion. A 2-minute trace: streaming 41-51%; idle 3-6%; tracks reply start/stop; one window accounts for the cost.";

export const RULED_OUT = Object.freeze([
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe, not WindowServer CA thrash",
  "Demesne/#93989 home-bind-overreach — bwrap /home bind, not compositor vsync",
  "Cartouche/#93772 section-poster — wrong diagram type, not layer-tree walk",
  "Attaint/#93821 session-attainder — cyber-safeguard stain, not WindowServer CPU",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout, not 120 Hz CA re-walk",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not compositor cost",
  "Trismus/#93823 UNUserNotification XPC lockjaw — freeze, not streaming CPU",
  "Foundling/#93889 subagent-bash-outlive — child-agent lifecycle, not CA tree",
  "Crasis/#93960 store-slug-collide — memory drawer, not WindowServer",
  "Tessera/#93929 version-path-tcc — privacy-pane rows, not layer-tree walk",
  "Mojibake/#93848 fffd-spall — encoding, not compositor vsync",
  "Afterimage — CRT phosphor residual, not entoptic WindowServer flash",
  "Thrash — different catalog thrash booth, not CA prepare_layer0",
  "Scotoma/#93744 command-args-blind — Humphrey Stop evaluator, not WindowServer",
  "Followspot — lighting follow, not 50-level CA recursion",
  "Scrim / Relict / Pentimento — different visual metaphors, not entoptic clinic",
]);
export const EXPECTED = Object.freeze([
  "WindowServer should stay near idle (3-6%) while a response streams, not jump to ~47% of one core",
  "The compositor should not re-walk a ~50-level CoreAnimation tree at 120 Hz on every refresh",
  "ca_prepare_begin_window_update / prepare_layer0 should not recurse the full Claude layer tree each vsync",
  "Streaming-token invalidation should not force a deep CA re-walk the user did not ask for",
  "One window should not account for the entire WindowServer cost once the reply starts",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "windowserver-47",
    label: "windowserver 47",
    count: "~47% one core",
    note: "streaming: WindowServer ~47% of one core; idle same window 3-6%",
  },
  {
    id: "layer-depth-50",
    label: "layer depth 50",
    count: "~50 levels",
    note: "WindowServer main thread re-walks the Claude CA layer tree ~50 levels deep",
  },
  {
    id: "refresh-120",
    label: "refresh 120",
    count: "120 Hz",
    note: "each refresh re-walks the tree via ca_prepare_begin_window_update / prepare_layer0",
  },
  {
    id: "streaming-cpu",
    label: "streaming cpu",
    count: "41-51%",
    note: "2-minute trace: streaming 41-51%; tracks reply start/stop",
  },
  {
    id: "idle-cpu",
    label: "idle cpu",
    count: "3-6%",
    note: "idle same window: 3-6%; one window accounts for the cost",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "quiescent-field",
    survey:
      "visual field cooled; WindowServer idle 3-6%; no CA re-walk beyond a steady frame",
    kind: "quiescent",
    note: "idle: quiescent — the hold/good path",
  },
  {
    id: "ca-prepare",
    survey:
      "ca_prepare_begin_window_update starts a window update each vsync while tokens stream",
    kind: "phosphene",
    note: "seeded: ca-prepare of the compositor",
  },
  {
    id: "prepare-layer0",
    survey:
      "prepare_layer0 recursion re-walks the Claude CA layer tree ~50 levels deep",
    kind: "phosphene",
    note: "seeded: prepare-layer0 of the nested tree",
  },
  {
    id: "layer-tree-walk",
    survey:
      "entoptic flash: compositor does 120 Hz vsync work the user did not ask for beyond streaming tokens",
    kind: "phosphene",
    note: "path: layer-tree-walk names the WindowServer CA re-walk",
  },
  {
    id: "phosphene",
    survey:
      "the field is phosphene — WindowServer ~47% one core; idle 3-6%; one window accounts for cost",
    kind: "phosphene",
    note: "seeded: phosphene — Score phosphene or admit quiescent.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "layer-tree-walk",
  "phosphene",
  "ca-prepare",
  "prepare-layer0",
  "windowserver-47",
  "refresh-120",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93811,
    title: "Windows desktop CPU spikes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Windows desktop CPU spikes. Different OS compositor path. Do not conflate with macOS WindowServer CA layer-tree thrash.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93996, title: "backup #93996", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "afterimage",
  "thrash",
  "scotoma",
  "followspot",
  "scrim",
  "relict",
  "pentimento",
]);

export const SAMPLE_KIND_IDLE = "steady-frame";
export const SAMPLE_KIND_SEEDED = "layer-tree-walk";
export const SAMPLE_HOLDING_IDLE = "cooled";
export const SAMPLE_HOLDING_SEEDED = "flashing";

export const SAMPLE_QUIESCENT_PROOF = Object.freeze({
  quiescent: true,
  phosphene: false,
  layerTreeWalk: false,
  caPrepare: false,
  prepareLayer0: false,
  windowserver47: false,
  layerDepth50: false,
  refresh120: false,
  streamingCpu: false,
  idleCpu: true,
  liquidXdr: false,
  m3Pro: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_PHOSPHENE_PROOF = Object.freeze({
  quiescent: false,
  phosphene: true,
  layerTreeWalk: true,
  caPrepare: true,
  prepareLayer0: true,
  windowserver47: true,
  layerDepth50: true,
  refresh120: true,
  streamingCpu: true,
  idleCpu: false,
  liquidXdr: true,
  m3Pro: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds quiescent: WindowServer 3-6%; cooled field; no CA re-walk" },
  { t: "ca-prepare", line: "ca_prepare_begin_window_update starts a window update each vsync while tokens stream" },
  { t: "prepare-layer0", line: "prepare_layer0 recursion re-walks the Claude CA layer tree ~50 levels deep" },
  { t: "path", line: "layer-tree-walk — compositor does 120 Hz vsync work the user did not ask for" },
  { t: "score", line: "when WindowServer re-walks the tree the booth is phosphene — Score phosphene or admit quiescent." },
]);

/**
 * Perimetry map: cooled field vs phosphene flash.
 * Idle/quiescent: WindowServer 3-6%; no CA re-walk.
 * Seeded/phosphene: 120 Hz prepare_layer0 re-walk; ~47% CPU.
 */
export function mapPerimetry(input = {}) {
  const phosphene =
    input.phosphene === true ||
    input.layerTreeWalk === true ||
    input.caPrepare === true ||
    input.prepareLayer0 === true ||
    input.windowserver47 === true ||
    input.layerDepth50 === true ||
    input.refresh120 === true ||
    input.streamingCpu === true ||
    input.liquidXdr === true ||
    input.m3Pro === true;
  const quiescent = input.quiescent === true && !phosphene;
  return {
    stamp: phosphene ? "layer-tree-walk" : "quiescent-field",
    holdingLane: phosphene ? "flashing" : "cooled",
    kindLane: phosphene ? "layer-tree-walk" : "steady-frame",
    bindLane: phosphene ? "prepare-layer0" : "no-rewalk",
    ribbon: phosphene ? "phosphene" : "quiescent",
    quiescent,
  };
}

export function inspectField(input = {}) {
  const flashing =
    input.phosphene === true ||
    input.layerTreeWalk === true ||
    input.windowserver47 === true;
  if (input.quiescent === true && !flashing) {
    return {
      stamp: "field-cooled",
      flashing: false,
    };
  }
  return {
    stamp: flashing ? "field-flashing" : "field-idle",
    flashing,
    note: flashing
      ? "entoptic flash: compositor vsync work with no external light beyond streaming tokens"
      : "",
  };
}

export function inspectLayer(input = {}) {
  const hit =
    input.layerTreeWalk === true ||
    input.prepareLayer0 === true ||
    input.layerDepth50 === true ||
    input.phosphene === true;
  if (input.quiescent === true && !hit) {
    return {
      stamp: "layer-steady",
      depth: 0,
    };
  }
  return {
    stamp: hit ? "prepare-layer0" : "layer-idle",
    depth: hit ? 50 : 0,
    note: hit
      ? "WindowServer main thread re-walks the Claude CA layer tree ~50 levels deep"
      : "",
  };
}

export function inspectRefresh(input = {}) {
  const hot =
    input.refresh120 === true ||
    input.caPrepare === true ||
    input.phosphene === true;
  if (input.quiescent === true && !hot) {
    return {
      stamp: "refresh-steady",
      hertz: 0,
    };
  }
  return {
    stamp: hot ? "refresh-120" : "refresh-idle",
    hertz: hot ? 120 : 0,
    note: hot
      ? "each refresh via ca_prepare_begin_window_update / prepare_layer0 at 120 Hz"
      : "",
  };
}

export function inspectCpu(input = {}) {
  const spiked =
    input.windowserver47 === true ||
    input.streamingCpu === true ||
    input.phosphene === true;
  if (input.quiescent === true && !spiked) {
    return {
      stamp: "cpu-idle",
      percent: "3-6",
    };
  }
  return {
    stamp: spiked ? "windowserver-47" : "cpu-idle",
    percent: spiked ? "47" : "3-6",
    note: spiked
      ? "streaming WindowServer ~47% one core; 2-minute trace 41-51%"
      : "",
  };
}

export function inspectTrace(input = {}) {
  const tracked =
    input.streamingCpu === true ||
    input.idleCpu === true ||
    input.phosphene === true;
  if (input.quiescent === true && input.phosphene !== true) {
    return {
      stamp: "trace-idle",
      tracks: false,
    };
  }
  return {
    stamp: tracked ? "trace-reply" : "trace-idle",
    tracks: tracked && input.phosphene === true,
    note: tracked && input.phosphene === true
      ? "2-minute trace tracks reply start/stop; one window accounts for the cost"
      : "",
  };
}

export function readBooth(input = {}) {
  const phosphene =
    input.phosphene === true ||
    input.layerTreeWalk === true ||
    input.caPrepare === true ||
    input.prepareLayer0 === true ||
    input.windowserver47 === true ||
    input.layerDepth50 === true ||
    input.refresh120 === true ||
    input.streamingCpu === true ||
    input.liquidXdr === true ||
    input.m3Pro === true;
  const quiescent = input.quiescent === true && !phosphene;
  return {
    mark: phosphene ? "phosphene" : quiescent || !phosphene ? "quiescent" : "phosphene",
    quiescent,
    phosphene,
    layerTreeWalk: input.layerTreeWalk === true || phosphene,
    caPrepare: input.caPrepare === true,
    prepareLayer0: input.prepareLayer0 === true,
    windowserver47: input.windowserver47 === true,
    layerDepth50: input.layerDepth50 === true,
    refresh120: input.refresh120 === true,
    streamingCpu: input.streamingCpu === true,
    idleCpu: input.idleCpu === true,
    liquidXdr: input.liquidXdr === true,
    m3Pro: input.m3Pro === true,
    scope: mapPerimetry(input),
    field: inspectField(input),
    layer: inspectLayer(input),
    refresh: inspectRefresh(input),
    cpu: inspectCpu(input),
    trace: inspectTrace(input),
    log: input.log || [],
  };
}

export const PHOSPHENE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-quiescent",
    quiescent: true,
    phosphene: false,
    cue: "quiescent",
    note: "idle HOLD: WindowServer 3-6%; cooled field — the hold/good path",
  },
  {
    t: "ca-prepare",
    event: "ca-prepare",
    phosphene: true,
    caPrepare: true,
    cue: "phosphene",
    note: "ca_prepare_begin_window_update starts a window update each vsync",
  },
  {
    t: "prepare-layer0",
    event: "prepare-layer0",
    phosphene: true,
    prepareLayer0: true,
    layerDepth50: true,
    cue: "phosphene",
    note: "prepare_layer0 recursion re-walks the Claude CA layer tree ~50 levels deep",
  },
  {
    t: "path",
    event: "layer-tree-walk",
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    refresh120: true,
    cue: "phosphene",
    note: "layer-tree-walk — compositor does 120 Hz vsync work the user did not ask for",
  },
  {
    t: "score",
    event: "phosphene",
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    prepareLayer0: true,
    windowserver47: true,
    layerDepth50: true,
    refresh120: true,
    streamingCpu: true,
    liquidXdr: true,
    m3Pro: true,
    cue: "phosphene",
    note: "phosphene — when WindowServer re-walks the tree the booth is phosphene",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-quiescent",
    quiescent: true,
    phosphene: false,
    cue: "quiescent",
    note: "positive control: WindowServer idle 3-6%; no CA re-walk",
  },
  {
    t: "announce",
    event: "cue-quiescent",
    quiescent: true,
    cue: "quiescent",
    note: "positive control: the field stays quiescent",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    quiescent: true,
    phosphene: false,
    layerTreeWalk: false,
    cue: "quiescent",
  };
}

export function seedQuiescent() {
  return { ...emptyTicket() };
}

export function seedPhosphene() {
  return {
    seed: SEEDED_WORD,
    quiescent: false,
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    prepareLayer0: true,
    windowserver47: true,
    layerDepth50: true,
    refresh120: true,
    streamingCpu: true,
    idleCpu: false,
    liquidXdr: true,
    m3Pro: true,
    cue: "phosphene",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_PHOSPHENE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    cue: "phosphene",
  };
}

export function seedLayerTreeWalk() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    phosphene: true,
    layerTreeWalk: true,
    caPrepare: true,
    event: "layer-tree-walk",
    cue: "phosphene",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    quiescent: true,
    cue: "quiescent",
  };
}

export function seedCaPrepare() {
  return {
    seed: "ca-prepare",
    preferSeed: true,
    caPrepare: true,
    cue: "phosphene",
  };
}

export function seedPrepareLayer0() {
  return {
    seed: "prepare-layer0",
    preferSeed: true,
    prepareLayer0: true,
    cue: "phosphene",
  };
}

export function seedWindowserver47() {
  return {
    seed: "windowserver-47",
    preferSeed: true,
    windowserver47: true,
    cue: "phosphene",
  };
}

export function seedLayerDepth50() {
  return {
    seed: "layer-depth-50",
    preferSeed: true,
    layerDepth50: true,
    cue: "phosphene",
  };
}

export function seedRefresh120() {
  return {
    seed: "refresh-120",
    preferSeed: true,
    refresh120: true,
    cue: "phosphene",
  };
}

export function seedStreamingCpu() {
  return {
    seed: "streaming-cpu",
    preferSeed: true,
    streamingCpu: true,
    cue: "phosphene",
  };
}

export function seedIdleCpu() {
  return {
    seed: "idle-cpu",
    preferSeed: true,
    idleCpu: true,
    cue: "phosphene",
  };
}

export function seedLiquidXdr() {
  return {
    seed: "liquid-xdr",
    preferSeed: true,
    liquidXdr: true,
    cue: "phosphene",
  };
}

export function seedM3Pro() {
  return {
    seed: "m3-pro",
    preferSeed: true,
    m3Pro: true,
    cue: "phosphene",
  };
}

export function seedCooled() {
  return {
    seed: "cooled",
    preferSeed: true,
    quiescent: true,
    cue: "quiescent",
  };
}

export function seedSteadyFrame() {
  return {
    seed: "steady-frame",
    preferSeed: true,
    quiescent: true,
    cue: "quiescent",
  };
}

export function seedIdleWs() {
  return {
    seed: "idle-ws",
    preferSeed: true,
    quiescent: true,
    cue: "quiescent",
  };
}

export function seedNoRewalk() {
  return {
    seed: "no-rewalk",
    preferSeed: true,
    quiescent: true,
    cue: "quiescent",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      quiescent: false,
      phosphene: false,
      layerTreeWalk: false,
      caPrepare: false,
      prepareLayer0: false,
      windowserver47: false,
      layerDepth50: false,
      refresh120: false,
      streamingCpu: false,
      idleCpu: false,
      liquidXdr: false,
      m3Pro: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    quiescent: raw.quiescent === true,
    phosphene: raw.phosphene === true || raw.event === "phosphene",
    layerTreeWalk:
      raw.layerTreeWalk === true || raw.event === "layer-tree-walk",
    caPrepare: raw.caPrepare === true || raw.event === "ca-prepare",
    prepareLayer0:
      raw.prepareLayer0 === true || raw.event === "prepare-layer0",
    windowserver47:
      raw.windowserver47 === true || raw.event === "windowserver-47",
    layerDepth50:
      raw.layerDepth50 === true || raw.event === "layer-depth-50",
    refresh120: raw.refresh120 === true || raw.event === "refresh-120",
    streamingCpu:
      raw.streamingCpu === true || raw.event === "streaming-cpu",
    idleCpu: raw.idleCpu === true || raw.event === "idle-cpu",
    liquidXdr: raw.liquidXdr === true || raw.event === "liquid-xdr",
    m3Pro: raw.m3Pro === true || raw.event === "m3-pro",
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
      (ticket.quiescent != null ||
        ticket.phosphene != null ||
        ticket.layerTreeWalk != null ||
        ticket.caPrepare != null ||
        ticket.prepareLayer0 != null ||
        ticket.windowserver47 != null ||
        ticket.layerDepth50 != null ||
        ticket.refresh120 != null ||
        ticket.streamingCpu != null ||
        ticket.idleCpu != null ||
        ticket.liquidXdr != null ||
        ticket.m3Pro != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isQuiescent(row) {
  if (row.phosphene && row.cue !== "quiescent") return false;
  if (row.cue === "phosphene" || row.cue === "layer-tree-walk") {
    return false;
  }
  if (
    row.layerTreeWalk &&
    row.caPrepare &&
    row.cue !== "quiescent" &&
    row.quiescent !== true
  ) {
    return false;
  }
  if (row.quiescent === true && row.phosphene !== true && row.cue !== "phosphene") {
    return true;
  }
  if (
    row.cue === "quiescent" &&
    row.phosphene !== true &&
    row.layerTreeWalk !== true &&
    row.caPrepare !== true &&
    row.prepareLayer0 !== true &&
    row.windowserver47 !== true &&
    row.layerDepth50 !== true &&
    row.refresh120 !== true &&
    row.streamingCpu !== true &&
    row.liquidXdr !== true &&
    row.m3Pro !== true
  ) {
    return true;
  }
  return false;
}

function isLayerTreeWalk(row) {
  return (
    row.event === "layer-tree-walk" &&
    !isQuiescent(row) &&
    (row.layerTreeWalk === true ||
      row.caPrepare === true ||
      row.refresh120 === true)
  );
}

function isPhospheneRow(row) {
  if (isQuiescent(row)) return false;
  if (isLayerTreeWalk(row) && row.cue !== "phosphene") return false;
  if (row.cue === "phosphene") return true;
  if (row.phosphene === true) return true;
  if (row.layerTreeWalk === true && row.caPrepare === true) {
    return true;
  }
  if (
    row.layerTreeWalk === true ||
    row.caPrepare === true ||
    row.prepareLayer0 === true ||
    row.windowserver47 === true ||
    row.layerDepth50 === true ||
    row.refresh120 === true ||
    row.streamingCpu === true ||
    row.liquidXdr === true ||
    row.m3Pro === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one phosphene pass against the entoptic clinic.
 * quiescent: WindowServer idle 3-6%; no CA re-walk.
 * phosphene: WindowServer CA layer-tree thrash while streaming.
 * layer-tree-walk: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isLayerTreeWalk(row) ||
    (row.layerTreeWalk && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "layer-tree-walk";
  } else if (isPhospheneRow(row)) {
    verdict = "phosphene";
  } else if (isQuiescent(row)) {
    verdict = "quiescent";
  } else if (
    row.layerTreeWalk ||
    row.caPrepare ||
    row.prepareLayer0 ||
    row.windowserver47 ||
    row.layerDepth50 ||
    row.refresh120 ||
    row.streamingCpu ||
    row.liquidXdr ||
    row.m3Pro
  ) {
    verdict = "phosphene";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const field = inspectField(row);
  const layer = inspectLayer(row);
  const refresh = inspectRefresh(row);
  const cpu = inspectCpu(row);
  const trace = inspectTrace(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    quiescent: verdict === "quiescent" || verdict === "hold",
    phosphene: verdict === "phosphene" || verdict === SEEDED_WORD,
    layerTreeWalk:
      row.layerTreeWalk === true ||
      verdict === "layer-tree-walk" ||
      verdict === PATH_WORD,
    caPrepare: row.caPrepare,
    prepareLayer0: row.prepareLayer0,
    windowserver47: row.windowserver47,
    layerDepth50: row.layerDepth50,
    refresh120: row.refresh120,
    streamingCpu: row.streamingCpu,
    idleCpu: row.idleCpu,
    liquidXdr: row.liquidXdr,
    m3Pro: row.m3Pro,
    cue: hold
      ? "quiescent"
      : row.layerTreeWalk || verdict === "layer-tree-walk"
        ? "layer-tree-walk"
        : "phosphene",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit quiescent" : "score phosphene",
    fieldInspect: field,
    layerInspect: layer,
    refreshInspect: refresh,
    cpuInspect: cpu,
    traceInspect: trace,
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
      : PHOSPHENE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "phosphene");
  const path = scored.filter((row) => row.verdict === "layer-tree-walk");
  const quiescent = scored.filter((row) => row.verdict === "quiescent");
  const headline =
    scored.find((row) => row.event === "phosphene") ||
    scored.find((row) => row.event === "layer-tree-walk") ||
    scored.find((row) => row.event === "ca-prepare") ||
    dead[dead.length - 1];
  let verdict = "quiescent";
  if (dead.length) verdict = "phosphene";
  else if (path.length && !quiescent.length) verdict = "layer-tree-walk";
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
    phospheneCount: dead.length,
    pathCount: path.length,
    quiescentCount: quiescent.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit quiescent" : "score phosphene",
    note: headline
      ? "While a response streams, WindowServer re-walks a ~50-level CoreAnimation tree at 120 Hz (~47% CPU; idle 3-6%). Cousin cite-only: #93811 Windows desktop CPU spikes — different OS compositor."
      : "published phosphene walk scored against quiescent vs phosphene",
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
    seeded !== "quiescent" &&
    seeded !== "phosphene" &&
    seeded !== "layer-tree-walk" &&
    ticket.quiescent == null &&
    ticket.phosphene == null &&
    ticket.layerTreeWalk == null &&
    ticket.caPrepare == null &&
    ticket.prepareLayer0 == null &&
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
    quiescent: scored.quiescent ?? false,
    phosphene: scored.phosphene ?? false,
    layerTreeWalk: scored.layerTreeWalk ?? false,
    caPrepare: scored.caPrepare ?? false,
    prepareLayer0: scored.prepareLayer0 ?? false,
    windowserver47: scored.windowserver47 ?? false,
    layerDepth50: scored.layerDepth50 ?? false,
    refresh120: scored.refresh120 ?? false,
    streamingCpu: scored.streamingCpu ?? false,
    idleCpu: scored.idleCpu ?? false,
    liquidXdr: scored.liquidXdr ?? false,
    m3Pro: scored.m3Pro ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.caPrepare || result.phosphene ? "kind=layer-tree-walk" : "kind=steady-frame",
    result.windowserver47 || result.phosphene ? "cpu=47" : "cpu=idle",
    result.layerTreeWalk || result.verdict === "layer-tree-walk"
      ? "path=layer-tree-walk"
      : "path=quiescent",
    result.cue === "quiescent"
      ? "cue=quiescent"
      : result.cue === "layer-tree-walk"
        ? "cue=layer-tree-walk"
        : "cue=phosphene",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    quiescent: result.quiescent,
    phosphene: result.phosphene,
    layerTreeWalk: result.layerTreeWalk,
    caPrepare: result.caPrepare,
    prepareLayer0: result.prepareLayer0,
    windowserver47: result.windowserver47,
    layerDepth50: result.layerDepth50,
    refresh120: result.refresh120,
    streamingCpu: result.streamingCpu,
    idleCpu: result.idleCpu,
    liquidXdr: result.liquidXdr,
    m3Pro: result.m3Pro,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    field: inspectField({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      layerTreeWalk: result.layerTreeWalk,
      windowserver47: result.windowserver47,
    }),
    layer: inspectLayer({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      layerTreeWalk: result.layerTreeWalk,
      prepareLayer0: result.prepareLayer0,
      layerDepth50: result.layerDepth50,
    }),
    refresh: inspectRefresh({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      refresh120: result.refresh120,
      caPrepare: result.caPrepare,
    }),
    cpu: inspectCpu({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      windowserver47: result.windowserver47,
      streamingCpu: result.streamingCpu,
    }),
    trace: inspectTrace({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      streamingCpu: result.streamingCpu,
      idleCpu: result.idleCpu,
    }),
    scope: mapPerimetry({
      quiescent: result.quiescent,
      phosphene: result.phosphene,
      layerTreeWalk: result.layerTreeWalk,
      caPrepare: result.caPrepare,
      prepareLayer0: result.prepareLayer0,
      windowserver47: result.windowserver47,
      layerDepth50: result.layerDepth50,
      refresh120: result.refresh120,
      streamingCpu: result.streamingCpu,
      liquidXdr: result.liquidXdr,
      m3Pro: result.m3Pro,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      phosphene:
        result.phosphene === true ||
        result.verdict === "phosphene",
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
        "NON-BINDING: deep Electron/CA nesting causes prepare_layer0 thrash each vsync during streaming invalidation. Invite verify against #94003 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
