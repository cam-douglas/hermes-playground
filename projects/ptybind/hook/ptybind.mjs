/**
 * Ptybind — ConPTY bind-plate / phosphor mux atelier.
 *
 * On Windows, when Claude Code runs inside a ConPTY-based terminal
 * multiplexer (psmux, wtmux; same class as WezTerm in #73301), Ctrl+G
 * opens the external terminal editor and it renders correctly, but no
 * keystroke reaches it (i, Esc, Ctrl+C all dead). Session often must
 * be killed. A 13-line Node script that only puts stdin in raw mode,
 * waits for one key, leaves raw mode and spawns an editor with
 * stdio: 'inherit' fails the same way with no Claude Code involved.
 * Non-deterministic. GUI editors (gvim -f) work.
 *
 * Encoded from anthropics/claude-code#92757 issue facts only.
 * Hypothesis (NON-BINDING): a pending ReadConsoleInput on Windows
 * ConPTY is not cancelled by setRawMode(false)/pause before spawn,
 * so the parent keeps winning the input race. The reporter inferred
 * this and did not verify the mechanism directly. Invite verify
 * against issue text only — do not invent source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "piped",
  "swallowed",
  "unbound",
  "editor-renders",
  "keys-dead",
  "parent-consuming",
  "conpty-mux",
  "gui-workaround",
  "node-repro",
  "control-matrix",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["piped", "unbound"]);

export const ALARM = new Set([
  "swallowed",
  "editor-renders",
  "keys-dead",
  "parent-consuming",
  "conpty-mux",
  "gui-workaround",
  "node-repro",
  "control-matrix",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "piped";
export const SEEDED_WORD = "swallowed";
export const ADMIT_WORD = "unbound";

export const MEASURED = {
  issue: 92757,
  title:
    "[BUG] Ctrl+G external editor receives no keyboard input inside ConPTY-based terminal multiplexers on Windows (refiling #73301)",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:tui"],
  filed: "2026-09-08T01:32:11Z",
  reporter: "tanaeakihiko",
  claude: "Claude Code 2.1.263",
  os: "Windows 11 Pro, 10.0.26200.9168",
  terminal: "Windows Terminal + Git Bash (MINGW64), inside psmux / wtmux",
  node: "v24.19.0",
  vim: "9.2 (Windows build) and the MSYS2 build shipped with Git for Windows",
  psmux: "3.3.8 (66cf613 2026-08-18)",
  wtmux: "https://github.com/fukuyori/wtmux",
  access: "Claude Code Max subscription",
  surface:
    "Ctrl+G external editor renders correctly but receives no keystrokes inside ConPTY multiplexers on Windows",
  editorRenders: true,
  keysDead: ["i", "Esc", "Ctrl+C"],
  sessionMustBeKilled: true,
  killHow: "stop-process",
  nonDeterministic: true,
  parentConsuming: true,
  nodeRepro: true,
  stdioInherit: true,
  guiWorkaround: "gvim -f",
  muxes: ["psmux", "wtmux"],
  weztermClass: 73301,
  expected: "The external editor should receive keyboard input, as it does in every other environment tested",
  actual:
    "The editor draws correctly and simply never receives a keystroke. The terminal window itself survives; only input is lost.",
  impact:
    "Session often must be killed with stop-process; sometimes a keystroke intended for the editor later appears in Claude's own prompt",
  hypothesis:
    "A pending ReadConsoleInput cannot reliably be cancelled; inferred from swallowed keys and intermittency; not verified directly"
};

export const BIND_LEDGER = [
  {
    id: "parent",
    role: "parent pane / raw-mode stdin",
    tally: "setRawMode(true) then pause",
    note: "parent holds stdin in raw mode, then setRawMode(false) + pause before spawn"
  },
  {
    id: "child",
    role: "child editor / renders, keys dead",
    tally: "i · Esc · Ctrl+C dead",
    note: "editor draws correctly; no keystroke reaches it; parent may still consume input"
  },
  {
    id: "unbound",
    role: "unbind / admit",
    tally: "parent stdin torn down",
    note: "hypothetical: parent stdin fully torn down before spawn so the editor gets keys"
  }
];

export const CONTROL_MATRIX = [
  { parent: "vim alone", environment: "Windows Terminal, direct", editorGetsInput: true },
  { parent: "vim alone", environment: "psmux pane", editorGetsInput: true },
  { parent: "git commit spawning the same vim.exe", environment: "psmux pane", editorGetsInput: true },
  { parent: "less (a raw-mode TUI), v to open the same vim.exe", environment: "psmux pane", editorGetsInput: true },
  { parent: "Claude Code", environment: "Windows Terminal, direct", editorGetsInput: true },
  { parent: "Claude Code", environment: "real tmux on WSL", editorGetsInput: true },
  { parent: "Claude Code", environment: "psmux / wtmux pane", editorGetsInput: false },
  { parent: "repro.js", environment: "psmux pane", editorGetsInput: false }
];

export const COUSINS = [
  {
    id: 73301,
    state: "closed",
    title: "[BUG] Neovim launched via Claude external editor (Ctrl+G) does not receive keyboard input in WezTerm",
    note: "cite-only — closed stale; identical symptom under WezTerm; #92757 supersedes it"
  },
  {
    id: 84264,
    state: "open",
    title: "[BUG] Ctrl+G external editor kills the Windows Terminal window when $EDITOR is a terminal app (nvim)",
    note: "cite-only — different failure: the Windows Terminal window is destroyed outright"
  },
  {
    id: 58664,
    state: "closed",
    title: "Ctrl-G external editor spawn regression introduced between 2.1.132 and 2.1.138 (Windows + Cygwin/MSYS2)",
    note: "cite-only — hang / spinner instead of launching vim"
  },
  {
    id: 88775,
    state: "open",
    title: "[BUG] Ctrl+G editor is spawned from the bg-spare daemon without a controlling terminal - emacs cannot launch (exit 1)",
    note: "cite-only — bg-spare daemon has no controlling tty for emacs; different surface"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "dunnage",
    issue: 92746,
    note: "Dunnage/#92746 already shipped — RemoteTrigger list cursor ignore. Do not touch."
  },
  {
    slug: "setoff",
    issue: 92750,
    note: "Setoff/#92750 already shipped — subagent MEMORY.md + skill_listing set-off. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  },
  {
    slug: "imprimatur",
    issue: 92740,
    note: "Imprimatur/#92740 already shipped — Skip Artifact first-publish. Do not touch."
  },
  {
    slug: "byname",
    issue: 92738,
    note: "Byname/#92738 already shipped. Do not touch."
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped. Do not touch."
  },
  {
    slug: "quietus",
    issue: 92716,
    note: "Quietus/#92716 already shipped. Do not touch."
  },
  {
    slug: "cribble",
    issue: 92684,
    note: "Cribble/#92684 already shipped. Do not touch."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675 already shipped. Do not touch."
  },
  {
    slug: "gangway",
    issue: 92662,
    note: "Gangway/#92662 already shipped. Do not touch."
  },
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624 already shipped. Do not touch."
  },
  {
    slug: "snatch",
    issue: 92583,
    note: "Snatch/#92583 already shipped. Do not touch."
  }
];

const CHIP_REASONS = {
  piped:
    "HOLD: plate is piped — editor receives keys / input correctly handed to child. Score swallowed or admit unbound",
  swallowed:
    "ALARM: keys swallowed; Ctrl+G external editor renders correctly but no keystroke reaches it inside ConPTY multiplexers on Windows (i, Esc, Ctrl+C all dead). Score swallowed or admit unbound",
  unbound:
    "plate already unbound — parent stdin fully torn down before spawn so the editor gets keys. Seeded admit word is unbound",
  "editor-renders":
    "editor-renders — the external terminal editor opens and draws correctly; the pane survives; only input is lost",
  "keys-dead":
    "keys-dead — i, Esc and Ctrl+C are all dead in the opened editor; none of them do anything",
  "parent-consuming":
    "parent-consuming — during one failure, an i keystroke intended for the editor was later delivered into Claude Code's own prompt as a submitted message; the parent was still consuming input meant for the child",
  "conpty-mux":
    "conpty-mux — failure is the intersection of Claude Code / raw-mode Node with a ConPTY multiplexer pane (psmux, wtmux); same class as WezTerm in #73301",
  "gui-workaround":
    "gui-workaround — set EDITOR to a GUI editor (gvim -f), which never touches the terminal's input path and works in every environment above",
  "node-repro":
    "node-repro — a 13-line Node script that only puts stdin in raw mode, waits for one key, leaves raw mode and spawns an editor with stdio: inherit fails exactly the same way with no Claude Code involved",
  "control-matrix":
    "control-matrix — vim alone, git commit, less+v, Claude Code direct, and Claude Code on real tmux/WSL all hand keys; Claude Code and repro.js inside psmux/wtmux do not",
  cousins:
    "cite-only neighbourhood — #73301 CLOSED stale (WezTerm same symptom), #84264 OPEN (Ctrl+G kills the Windows Terminal window), #58664 CLOSED (hang instead of launch), #88775 OPEN (bg-spare daemon no controlling tty for emacs). Primary stays #92757",
  "has-clear-repro":
    "has-clear-repro — #92757 is labeled has repro: Claude Code 2.1.263 on Windows 11 Pro 10.0.26200.9168, Windows Terminal + Git Bash (MINGW64) inside psmux / wtmux; filed 2026-09-08T01:32:11Z; labels bug, has repro, platform:windows, area:tui"
};

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function pipedSignal(text = "") {
  return /idle plate is piped|pin idle piped|editor receives keys|input correctly handed to child/i.test(
    String(text || "")
  );
}

export function swallowedSignal(text = "") {
  return /keys swallowed|no keystroke reaches|receiving no keystrokes|parent still consuming input/i.test(
    String(text || "")
  );
}

export function unboundSignal(text = "") {
  return /already unbound|plate unbound|parent stdin fully torn down|editor gets keys/i.test(
    String(text || "")
  );
}

export function editorRendersSignal(text = "") {
  const blob = String(text || "");
  if (/already unbound|editor gets keys/i.test(blob) && !/renders correctly/i.test(blob)) {
    return false;
  }
  return /editor-renders|renders correctly|draws correctly|editor draws/i.test(blob);
}

export function keysDeadSignal(text = "") {
  return /keys-dead|i, Esc|Esc and Ctrl\+C|all dead/i.test(String(text || ""));
}

export function parentConsumingSignal(text = "") {
  return /parent-consuming|parent was still consuming|later delivered into Claude|own prompt as a submitted/i.test(
    String(text || "")
  );
}

export function conptyMuxSignal(text = "") {
  return /conpty-mux|psmux|wtmux|ConPTY multiplexer|ConPTY-based/i.test(String(text || ""));
}

export function guiWorkaroundSignal(text = "") {
  return /gui-workaround|gvim -f|GUI editor/i.test(String(text || ""));
}

export function nodeReproSignal(text = "") {
  return /node-repro|13-line Node|repro\.js|stdio: ['"]inherit['"]/i.test(String(text || ""));
}

export function controlMatrixSignal(text = "") {
  return /control-matrix|control matrix|real tmux on WSL|less \(a raw-mode TUI\)/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    piped: pipedSignal(blob),
    swallowed: swallowedSignal(blob),
    unbound: unboundSignal(blob),
    editorRenders: editorRendersSignal(blob),
    keysDead: keysDeadSignal(blob),
    parentConsuming: parentConsumingSignal(blob),
    conptyMux: conptyMuxSignal(blob),
    guiWorkaround: guiWorkaroundSignal(blob),
    nodeRepro: nodeReproSignal(blob),
    controlMatrix: controlMatrixSignal(blob)
  };
}

export function keysWereDead(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.keysDead) || boolish(t.noKeystrokes) || boolish(t.inputDead)) {
    return true;
  }
  return keysDeadSignal(extractText(t));
}

export function parentStillConsuming(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.parentConsuming) || boolish(t.parentStillConsuming) || boolish(t.parentWinsRace)) {
    return true;
  }
  return parentConsumingSignal(extractText(t));
}

export function plateUnbound(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.plateUnbound) || (boolish(t.unbound) && !boolish(t.swallowed))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const keysDead = keysWereDead(t) || hits.keysDead;
  const parentConsuming = parentStillConsuming(t) || hits.parentConsuming;
  const editorRenders = boolish(t.editorRenders) || t.editorRenders === true || hits.editorRenders;
  const conptyMux = boolish(t.conptyMux) || hits.conptyMux;
  const guiWorkaround = boolish(t.guiWorkaround) || hits.guiWorkaround;
  const nodeRepro = boolish(t.nodeRepro) || hits.nodeRepro;
  const controlMatrix = boolish(t.controlMatrix) || hits.controlMatrix;
  const unboundClean = boolish(t.unbound) || plateUnbound(t);
  const swallowedHit =
    boolish(t.swallowed) ||
    (keysDead && editorRenders && !boolish(t.unbound) && !boolish(t.piped));
  const pipedHit = boolish(t.piped) || (hits.piped && !swallowedHit && !unboundClean);
  return {
    keysDead,
    parentConsuming,
    editorRenders,
    conptyMux,
    guiWorkaround,
    nodeRepro,
    controlMatrix,
    unboundClean,
    swallowedHit,
    pipedHit,
    plateUnbound: plateUnbound(t),
    inputSwallowed: keysDead && editorRenders,
    inputPiped: unboundClean && !keysDead,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const swallowed = boolish(t.swallowed) || (print.swallowedHit && !boolish(t.unbound) && !boolish(t.piped));
  const unbound = boolish(t.unbound) || (print.unboundClean && !boolish(t.swallowed));
  const piped = boolish(t.piped) || (print.pipedHit && !swallowed && !unbound);
  return {
    piped,
    swallowed,
    unbound,
    editorRenders: boolish(t.editorRenders) || print.editorRenders,
    keysDead: boolish(t.keysDead) || print.keysDead,
    parentConsuming: boolish(t.parentConsuming) || print.parentConsuming,
    conptyMux: boolish(t.conptyMux) || print.conptyMux,
    guiWorkaround: boolish(t.guiWorkaround) || print.guiWorkaround,
    nodeRepro: boolish(t.nodeRepro) || print.nodeRepro,
    controlMatrix: boolish(t.controlMatrix) || print.controlMatrix,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    claude: t.claude || MEASURED.claude,
    os: t.os || MEASURED.os
  };
}

export function seedPiped() {
  return {
    seed: "piped",
    issue: 92757,
    piped: true,
    swallowed: false,
    unbound: false,
    keysDead: false,
    parentConsuming: false,
    outputText:
      "piped; idle plate — editor receives keys / input correctly handed to child"
  };
}

export function seedSwallowed() {
  return {
    seed: "swallowed",
    issue: 92757,
    piped: false,
    swallowed: true,
    unbound: false,
    keysDead: true,
    noKeystrokes: true,
    inputDead: true,
    editorRenders: true,
    parentConsuming: true,
    parentStillConsuming: true,
    conptyMux: true,
    nodeRepro: true,
    guiWorkaround: true,
    controlMatrix: true,
    hasClearRepro: true,
    outputText:
      "swallowed; keys swallowed — no keystroke reaches the editor; parent still consuming input",
    claude: MEASURED.claude
  };
}

export function seedUnbound() {
  return {
    seed: "unbound",
    issue: 92757,
    piped: false,
    swallowed: false,
    unbound: true,
    plateUnbound: true,
    parentStdinTornDown: true,
    editorGetsKeys: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    piped: seedPiped(),
    swallowed: seedSwallowed(),
    unbound: seedUnbound(),
    "editor-renders": {
      seed: "editor-renders",
      issue: 92757,
      editorRenders: true
    },
    "keys-dead": {
      seed: "keys-dead",
      issue: 92757,
      keysDead: true,
      noKeystrokes: true
    },
    "parent-consuming": {
      seed: "parent-consuming",
      issue: 92757,
      parentConsuming: true,
      parentStillConsuming: true
    },
    "conpty-mux": {
      seed: "conpty-mux",
      issue: 92757,
      conptyMux: true
    },
    "gui-workaround": {
      seed: "gui-workaround",
      issue: 92757,
      guiWorkaround: true
    },
    "node-repro": {
      seed: "node-repro",
      issue: 92757,
      nodeRepro: true
    },
    "control-matrix": {
      seed: "control-matrix",
      issue: 92757,
      controlMatrix: true
    },
    cousins: {
      seed: "cousins",
      issue: 92757,
      cousins: true,
      cousinsCiteOnly: COUSINS
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92757,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

const SPECIFIC_SEEDS = [
  "cousins",
  "editor-renders",
  "keys-dead",
  "parent-consuming",
  "conpty-mux",
  "gui-workaround",
  "node-repro",
  "control-matrix",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "editor-renders": (t, c) => boolish(t.editorRenders) || c.editorRenders,
  "keys-dead": (t, c) => boolish(t.keysDead) || c.keysDead,
  "parent-consuming": (t, c) => boolish(t.parentConsuming) || c.parentConsuming,
  "conpty-mux": (t, c) => boolish(t.conptyMux) || c.conptyMux,
  "gui-workaround": (t, c) => boolish(t.guiWorkaround) || c.guiWorkaround,
  "node-repro": (t, c) => boolish(t.nodeRepro) || c.nodeRepro,
  "control-matrix": (t, c) => boolish(t.controlMatrix) || c.controlMatrix,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const folio = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      piped: false,
      swallowed: true,
      unbound: false,
      chips: ["cousins", "swallowed"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      piped: false,
      swallowed: true,
      unbound: false,
      chips: [seed, "swallowed"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "swallowed" &&
      seed !== "unbound" &&
      seed !== "piped"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        piped: false,
        swallowed: true,
        unbound: false,
        chips: [name, "swallowed"],
        folio
      };
    }
  }

  if (
    seed === "unbound" ||
    (t.unbound === true && t.swallowed !== true && seed !== "swallowed") ||
    (folio.unbound && !folio.swallowed && seed !== "swallowed")
  ) {
    reasons.push(CHIP_REASONS.unbound);
    return {
      verdict: "unbound",
      reasons,
      piped: false,
      swallowed: false,
      unbound: true,
      chips: ["unbound"],
      folio
    };
  }

  if (t.swallowed === true || seed === "swallowed" || (folio.swallowed && !folio.unbound && !folio.piped)) {
    reasons.push(CHIP_REASONS.swallowed);
    const chips = ["swallowed"];
    if (t.editorRenders === true || folio.editorRenders) chips.push("editor-renders");
    if (t.keysDead === true || folio.keysDead) chips.push("keys-dead");
    if (t.parentConsuming === true || folio.parentConsuming) chips.push("parent-consuming");
    if (t.conptyMux === true || folio.conptyMux) chips.push("conpty-mux");
    if (t.guiWorkaround === true || folio.guiWorkaround) chips.push("gui-workaround");
    if (t.nodeRepro === true || folio.nodeRepro) chips.push("node-repro");
    if (t.controlMatrix === true || folio.controlMatrix) chips.push("control-matrix");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "swallowed",
      reasons,
      piped: false,
      swallowed: true,
      unbound: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "piped" || t.piped === true || folio.piped) {
    reasons.push(CHIP_REASONS.piped);
    return {
      verdict: "piped",
      reasons,
      piped: true,
      swallowed: false,
      unbound: false,
      chips: ["piped"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      piped: false,
      swallowed: true,
      unbound: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle plate is piped — HOLD: editor receives keys / input correctly handed to child"
  );
  return {
    verdict: "piped",
    reasons,
    piped: true,
    swallowed: false,
    unbound: false,
    chips: ["piped"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedPiped();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedPiped();
  }
  return seedPiped();
}

export async function main(argv = process.argv.slice(2)) {
  const { readFileSync } = await import("node:fs");
  const { stdin } = await import("node:process");
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stdin.on("error", reject);
    });
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "ptybind",
    issue: 92757,
    mark: "12:50 / hermes catalog #218 / #92757",
    alarm: ALARM.has(result.verdict),
    hold: HOLD.has(result.verdict),
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
