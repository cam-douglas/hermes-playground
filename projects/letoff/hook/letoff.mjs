/**
 * Letoff — piano let-off / action-rail gauge.
 *
 * On Windows, Shift+Enter is indistinguishable from Enter inside
 * Claude Code, so a keybindings.json shift+enter → chat:newline
 * binding never fires. The Windows console INPUT_RECORD carries
 * Shift correctly (.NET ReadKey shows mods=Shift). libuv's
 * console-event-to-VT translation forwards only the character and
 * discards dwControlKeyState, so Shift+Enter arrives as 0d — the
 * same as bare Enter. The split follows the runtime, not the
 * terminal: Codex and Grok CLI work in the same ConPTY session;
 * Claude Code (Bun/libuv) and Antigravity (Node/libuv) do not.
 *
 * Encoded from anthropics/claude-code#92771 issue facts only.
 * Hypothesis (NON-BINDING): libuv uv_tty raw reader translates
 * VK_RETURN to \r without consulting dwControlKeyState;
 * ENABLE_VIRTUAL_TERMINAL_INPUT would bypass. Invite verify
 * against issue text only — do not invent unread source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "chorded",
  "flattened",
  "meshed",
  "runtime-split",
  "console-intact",
  "libuv-collision",
  "kitty-allowlist",
  "kitty-parsed-unused",
  "ctrl-enter-workaround",
  "control-matrix",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["chorded", "meshed"]);

export const ALARM = new Set([
  "flattened",
  "runtime-split",
  "console-intact",
  "libuv-collision",
  "kitty-allowlist",
  "kitty-parsed-unused",
  "ctrl-enter-workaround",
  "control-matrix",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "chorded";
export const SEEDED_WORD = "flattened";
export const ADMIT_WORD = "meshed";

export const MEASURED = {
  issue: 92771,
  title:
    "Windows: Shift+Enter indistinguishable from Enter (modifiers dropped by libuv console-to-VT translation)",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:tui", "keybindings"],
  filed: "2026-09-08T03:49:28Z",
  reporter: "GOUKI9999",
  claude: "Claude Code 2.1.263 (native binary, Bun v1.4.1)",
  os: "Windows 11 Pro 10.0.26200",
  terminal: "Netcatty (Electron + xterm.js, local shell over ConPTY), full kitty keyboard protocol support",
  term: "xterm-256color",
  shell: "PowerShell",
  surface:
    "Shift+Enter is indistinguishable from Enter; shift+enter → chat:newline never fires; Shift+Enter submits the message",
  expected: "shift+enter bound to chat:newline inserts a newline",
  actual: "Shift+Enter submits the message; the binding never fires",
  consoleReadKey: {
    enter: { key: "Enter", mods: "0", char: 13 },
    shiftEnter: { key: "Enter", mods: "Shift", char: 13 },
    altEnter: { key: "Enter", mods: "Alt", char: 13 },
    ctrlEnter: { key: "Enter", mods: "Control", char: 10 }
  },
  libuvRaw: {
    enter: "0d",
    shiftEnter: "0d",
    altEnter: "0d",
    ctrlEnter: "0a"
  },
  runtimeSplit: [
    { cli: "Codex", runtime: "Rust (crossterm)", shiftEnter: "works" },
    { cli: "Grok CLI", runtime: "Rust/Go", shiftEnter: "works" },
    { cli: "Claude Code", runtime: "Bun / libuv", shiftEnter: "broken" },
    { cli: "Antigravity CLI (agy)", runtime: "Node / libuv", shiftEnter: "broken" }
  ],
  kittyQuery: "ESC[?0u",
  kittyQueryBytes: "1b 5b 3f 30 75",
  kittyAfterEnable: "Shift+Enter still 0d",
  kittyAllowlist: [
    "iTerm.app",
    "kitty",
    "WezTerm",
    "ghostty",
    "tmux",
    "windows-terminal",
    "WarpTerminal"
  ],
  kittyTermFallback: "xterm-256color",
  kittyWindowIdStillFails: true,
  kittyParsedUnused: true,
  workaround: "Ctrl+Enter emits 0a and is distinguishable from Enter 0d",
  suggestedFixes: [
    "ENABLE_VIRTUAL_TERMINAL_INPUT (0x0200) on stdin console mode",
    "ReadConsoleInputW directly and handle modifiers, as crossterm does",
    "Enable kitty protocol from the runtime query, not the hardcoded allowlist"
  ],
  hypothesis:
    "libuv uv_tty raw reader translates VK_RETURN to \\r without consulting dwControlKeyState; ENABLE_VIRTUAL_TERMINAL_INPUT would bypass. Encoded from the issue body only."
};

export const ACTION_RAIL = [
  {
    id: "console",
    role: "ivory / console INPUT_RECORD",
    tally: "mods=Shift · char=13",
    note: ".NET ReadKey shows Shift on Shift+Enter; ConPTY and the terminal are both fine"
  },
  {
    id: "libuv",
    role: "ebony / libuv console-to-VT",
    tally: "Shift+Enter → 0d (collision)",
    note: "uv_tty raw reader forwards only the character; dwControlKeyState is discarded"
  },
  {
    id: "meshed",
    role: "let-off / admit",
    tally: "modifier path retained",
    note: "hypothetical: ENABLE_VIRTUAL_TERMINAL_INPUT or ReadConsoleInputW so Shift stays on the hammer"
  }
];

export const CONTROL_MATRIX = [
  { key: "Enter", consoleMods: "0", consoleChar: 13, delivered: "0d", distinguishable: true },
  { key: "Shift+Enter", consoleMods: "Shift", consoleChar: 13, delivered: "0d", distinguishable: false },
  { key: "Alt+Enter", consoleMods: "Alt", consoleChar: 13, delivered: "0d", distinguishable: false },
  { key: "Ctrl+Enter", consoleMods: "Control", consoleChar: 10, delivered: "0a", distinguishable: true }
];

export const COUSINS = [
  {
    id: 87888,
    state: "open",
    title:
      "keybindings: ctrl+enter / shift+enter never reach the keybinding matcher on Windows Terminal; ctrl+j rebind ignored",
    note: "cite-only — Windows Terminal matcher miss; neighbourhood of Shift+Enter, not the libuv console-to-VT drop"
  },
  {
    id: 92021,
    state: "open",
    title:
      "[BUG] Shifted keys lost in WezTerm since 2.1.247: Kitty \"report alternate keys\" flag is requested but the shifted-key field is never parsed",
    note: "cite-only — kitty shifted-key field never parsed; different surface from libuv translation"
  },
  {
    id: "node-libuv-tty",
    state: "generic",
    title: "node/libuv uv_tty Windows console-to-VT translation discards dwControlKeyState",
    note: "cite-only — generic runtime class named by the issue; not a separate catalog thesis"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "ptybind",
    issue: 92757,
    note: "Ptybind/#92757 already shipped — Ctrl+G ConPTY mux editor keys. Do not touch."
  },
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
    note: "Imprimatur/#92740 already shipped. Do not touch."
  },
  {
    slug: "byname",
    issue: 92738,
    note: "Byname/#92738 already shipped. Do not touch."
  }
];

const CHIP_REASONS = {
  chorded:
    "HOLD: rail is chorded — Shift retained through the key event so chat:newline would fire. Score flattened or admit meshed",
  flattened:
    "ALARM: Shift flattened; libuv console-to-VT drops dwControlKeyState so Shift+Enter arrives as 0d, colliding with Enter. Score flattened or admit meshed",
  meshed:
    "rail already meshed — modifier path retained through VT / ReadConsoleInput handled so Shift stays on the hammer. Seeded admit word is meshed",
  "runtime-split":
    "runtime-split — same ConPTY session: Codex (Rust/crossterm) works; Grok CLI works; Claude Code Bun/libuv broken; Antigravity Node/libuv broken. The split follows the runtime, not the terminal",
  "console-intact":
    "console-intact — .NET ReadKey shows Enter mods=0 char=13; Shift+Enter mods=Shift char=13; Alt+Enter mods=Alt char=13; Ctrl+Enter mods=Control char=10. INPUT_RECORD carries Shift, Alt and Control correctly",
  "libuv-collision":
    "libuv-collision — process.stdin raw mode: Enter→0d, Shift+Enter→0d (collision), Alt+Enter→0d, Ctrl+Enter→0a. Ctrl is distinguishable only because the console assigns char 10",
  "kitty-allowlist":
    "kitty-allowlist — enablement is a hardcoded allowlist of terminal names; TERM fallback means xterm-256color never enables; KITTY_WINDOW_ID=1 still fails Shift+Enter",
  "kitty-parsed-unused":
    "kitty-parsed-unused — kittyKeyboard parser exists (type kittyKeyboard, flags) but the result is never consumed; capability query replies ESC[?0u through ConPTY/libuv, yet after CSI > 1 u Shift+Enter is still 0d",
  "ctrl-enter-workaround":
    "ctrl-enter-workaround — Ctrl+Enter emits 0a and is distinguishable from Enter 0d, so it works on Windows today without any keyboard protocol",
  "control-matrix":
    "control-matrix — console keeps modifiers; libuv collapses Shift/Alt+Enter to 0d; only Ctrl+Enter is distinguishable; Rust CLIs in the same session keep Shift",
  cousins:
    "cite-only neighbourhood — #87888 OPEN (Windows Terminal matcher miss), #92021 OPEN (WezTerm kitty shifted-key field never parsed), generic node/libuv uv_tty console-to-VT. Primary stays #92771",
  "has-clear-repro":
    "has-clear-repro — #92771 is labeled has repro: Claude Code 2.1.263 (Bun v1.4.1) on Windows 11 Pro 10.0.26200, Netcatty over ConPTY, TERM=xterm-256color, PowerShell; filed 2026-09-08T03:49:28Z; labels bug, has repro, platform:windows, area:tui, keybindings"
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

export function chordedSignal(text = "") {
  return /idle rail is chorded|pin idle chorded|Shift retained|chat:newline would fire/i.test(
    String(text || "")
  );
}

export function flattenedSignal(text = "") {
  return /Shift flattened|flattened to bare Enter|0d \(collision\)|indistinguishable from Enter|dwControlKeyState/i.test(
    String(text || "")
  );
}

export function meshedSignal(text = "") {
  return /already meshed|modifier path retained|ReadConsoleInput handled|ENABLE_VIRTUAL_TERMINAL_INPUT/i.test(
    String(text || "")
  );
}

export function runtimeSplitSignal(text = "") {
  return /runtime-split|Codex|Antigravity|split follows the runtime/i.test(String(text || ""));
}

export function consoleIntactSignal(text = "") {
  return /console-intact|\.NET ReadKey|mods=Shift|INPUT_RECORD/i.test(String(text || ""));
}

export function libuvCollisionSignal(text = "") {
  return /libuv-collision|process\.stdin raw|Shift\+Enter → 0d|uv_tty/i.test(String(text || ""));
}

export function kittyAllowlistSignal(text = "") {
  return /kitty-allowlist|hardcoded allowlist|xterm-256color never enables|KITTY_WINDOW_ID/i.test(
    String(text || "")
  );
}

export function kittyParsedUnusedSignal(text = "") {
  return /kitty-parsed-unused|kittyKeyboard|never consumed|ESC\[\?0u/i.test(String(text || ""));
}

export function ctrlEnterWorkaroundSignal(text = "") {
  return /ctrl-enter-workaround|Ctrl\+Enter emits 0a|works on Windows today/i.test(
    String(text || "")
  );
}

export function controlMatrixSignal(text = "") {
  return /control-matrix|console keeps modifiers|Rust CLIs in the same session/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    chorded: chordedSignal(blob),
    flattened: flattenedSignal(blob),
    meshed: meshedSignal(blob),
    runtimeSplit: runtimeSplitSignal(blob),
    consoleIntact: consoleIntactSignal(blob),
    libuvCollision: libuvCollisionSignal(blob),
    kittyAllowlist: kittyAllowlistSignal(blob),
    kittyParsedUnused: kittyParsedUnusedSignal(blob),
    ctrlEnterWorkaround: ctrlEnterWorkaroundSignal(blob),
    controlMatrix: controlMatrixSignal(blob)
  };
}

export function shiftWasFlattened(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.flattened) || boolish(t.shiftFlattened) || boolish(t.collision)) {
    return true;
  }
  return flattenedSignal(extractText(t));
}

export function consoleStillIntact(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.consoleIntact) || boolish(t.inputRecordOk)) {
    return true;
  }
  return consoleIntactSignal(extractText(t));
}

export function railMeshed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.railMeshed) || (boolish(t.meshed) && !boolish(t.flattened))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const flattenedHit =
    boolish(t.flattened) ||
    (shiftWasFlattened(t) && !boolish(t.meshed) && !boolish(t.chorded));
  const meshedClean = boolish(t.meshed) || railMeshed(t);
  const chordedHit = boolish(t.chorded) || (hits.chorded && !flattenedHit && !meshedClean);
  return {
    flattenedHit,
    meshedClean,
    chordedHit,
    runtimeSplit: boolish(t.runtimeSplit) || hits.runtimeSplit,
    consoleIntact: boolish(t.consoleIntact) || hits.consoleIntact,
    libuvCollision: boolish(t.libuvCollision) || hits.libuvCollision,
    kittyAllowlist: boolish(t.kittyAllowlist) || hits.kittyAllowlist,
    kittyParsedUnused: boolish(t.kittyParsedUnused) || hits.kittyParsedUnused,
    ctrlEnterWorkaround: boolish(t.ctrlEnterWorkaround) || hits.ctrlEnterWorkaround,
    controlMatrix: boolish(t.controlMatrix) || hits.controlMatrix,
    railMeshed: railMeshed(t),
    shiftFlattened: flattenedHit,
    shiftChorded: meshedClean && !flattenedHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const flattened = boolish(t.flattened) || (print.flattenedHit && !boolish(t.meshed) && !boolish(t.chorded));
  const meshed = boolish(t.meshed) || (print.meshedClean && !boolish(t.flattened));
  const chorded = boolish(t.chorded) || (print.chordedHit && !flattened && !meshed);
  return {
    chorded,
    flattened,
    meshed,
    runtimeSplit: boolish(t.runtimeSplit) || print.runtimeSplit,
    consoleIntact: boolish(t.consoleIntact) || print.consoleIntact,
    libuvCollision: boolish(t.libuvCollision) || print.libuvCollision,
    kittyAllowlist: boolish(t.kittyAllowlist) || print.kittyAllowlist,
    kittyParsedUnused: boolish(t.kittyParsedUnused) || print.kittyParsedUnused,
    ctrlEnterWorkaround: boolish(t.ctrlEnterWorkaround) || print.ctrlEnterWorkaround,
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

export function seedChorded() {
  return {
    seed: "chorded",
    issue: 92771,
    chorded: true,
    flattened: false,
    meshed: false,
    outputText:
      "chorded; idle rail — Shift retained through the key event so chat:newline would fire"
  };
}

export function seedFlattened() {
  return {
    seed: "flattened",
    issue: 92771,
    chorded: false,
    flattened: true,
    meshed: false,
    shiftFlattened: true,
    collision: true,
    runtimeSplit: true,
    consoleIntact: true,
    libuvCollision: true,
    kittyAllowlist: true,
    kittyParsedUnused: true,
    ctrlEnterWorkaround: true,
    controlMatrix: true,
    hasClearRepro: true,
    outputText:
      "flattened; Shift flattened — Shift+Enter arrives as 0d (collision); dwControlKeyState discarded",
    claude: MEASURED.claude
  };
}

export function seedMeshed() {
  return {
    seed: "meshed",
    issue: 92771,
    chorded: false,
    flattened: false,
    meshed: true,
    railMeshed: true,
    modifierPathRetained: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    chorded: seedChorded(),
    flattened: seedFlattened(),
    meshed: seedMeshed(),
    "runtime-split": { seed: "runtime-split", issue: 92771, runtimeSplit: true },
    "console-intact": { seed: "console-intact", issue: 92771, consoleIntact: true },
    "libuv-collision": { seed: "libuv-collision", issue: 92771, libuvCollision: true },
    "kitty-allowlist": { seed: "kitty-allowlist", issue: 92771, kittyAllowlist: true },
    "kitty-parsed-unused": { seed: "kitty-parsed-unused", issue: 92771, kittyParsedUnused: true },
    "ctrl-enter-workaround": {
      seed: "ctrl-enter-workaround",
      issue: 92771,
      ctrlEnterWorkaround: true
    },
    "control-matrix": { seed: "control-matrix", issue: 92771, controlMatrix: true },
    cousins: { seed: "cousins", issue: 92771, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92771,
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
  "runtime-split",
  "console-intact",
  "libuv-collision",
  "kitty-allowlist",
  "kitty-parsed-unused",
  "ctrl-enter-workaround",
  "control-matrix",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "runtime-split": (t, c) => boolish(t.runtimeSplit) || c.runtimeSplit,
  "console-intact": (t, c) => boolish(t.consoleIntact) || c.consoleIntact,
  "libuv-collision": (t, c) => boolish(t.libuvCollision) || c.libuvCollision,
  "kitty-allowlist": (t, c) => boolish(t.kittyAllowlist) || c.kittyAllowlist,
  "kitty-parsed-unused": (t, c) => boolish(t.kittyParsedUnused) || c.kittyParsedUnused,
  "ctrl-enter-workaround": (t, c) => boolish(t.ctrlEnterWorkaround) || c.ctrlEnterWorkaround,
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
      chorded: false,
      flattened: true,
      meshed: false,
      chips: ["cousins", "flattened"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      chorded: false,
      flattened: true,
      meshed: false,
      chips: [seed, "flattened"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "flattened" &&
      seed !== "meshed" &&
      seed !== "chorded"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        chorded: false,
        flattened: true,
        meshed: false,
        chips: [name, "flattened"],
        folio
      };
    }
  }

  if (
    seed === "meshed" ||
    (t.meshed === true && t.flattened !== true && seed !== "flattened") ||
    (folio.meshed && !folio.flattened && seed !== "flattened")
  ) {
    reasons.push(CHIP_REASONS.meshed);
    return {
      verdict: "meshed",
      reasons,
      chorded: false,
      flattened: false,
      meshed: true,
      chips: ["meshed"],
      folio
    };
  }

  if (t.flattened === true || seed === "flattened" || (folio.flattened && !folio.meshed && !folio.chorded)) {
    reasons.push(CHIP_REASONS.flattened);
    const chips = ["flattened"];
    if (t.runtimeSplit === true || folio.runtimeSplit) chips.push("runtime-split");
    if (t.consoleIntact === true || folio.consoleIntact) chips.push("console-intact");
    if (t.libuvCollision === true || folio.libuvCollision) chips.push("libuv-collision");
    if (t.kittyAllowlist === true || folio.kittyAllowlist) chips.push("kitty-allowlist");
    if (t.kittyParsedUnused === true || folio.kittyParsedUnused) chips.push("kitty-parsed-unused");
    if (t.ctrlEnterWorkaround === true || folio.ctrlEnterWorkaround) chips.push("ctrl-enter-workaround");
    if (t.controlMatrix === true || folio.controlMatrix) chips.push("control-matrix");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "flattened",
      reasons,
      chorded: false,
      flattened: true,
      meshed: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "chorded" || t.chorded === true || folio.chorded) {
    reasons.push(CHIP_REASONS.chorded);
    return {
      verdict: "chorded",
      reasons,
      chorded: true,
      flattened: false,
      meshed: false,
      chips: ["chorded"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      chorded: false,
      flattened: true,
      meshed: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle rail is chorded — HOLD: Shift retained through the key event so chat:newline would fire"
  );
  return {
    verdict: "chorded",
    reasons,
    chorded: true,
    flattened: false,
    meshed: false,
    chips: ["chorded"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedChorded();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedChorded();
  }
  return seedChorded();
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
    product: "letoff",
    issue: 92771,
    mark: "13:50 / hermes catalog #219 / #92771",
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
