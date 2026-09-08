/**
 * Espagnolette — locksmith's espagnolette / casement-fastener bench.
 *
 * AskUserQuestion still draws the option caret and footer
 * ("Enter to select · Tab/Arrow keys to navigate · Esc to cancel")
 * after the terminal window loses focus and regains it (or after
 * sitting idle), but every key the question's own subtree owns is
 * dead (↑ ↓ Enter j/k 1–9 Esc). Tab / ← / → still work
 * (ancestor-owned). Multi-question prompts recover by Tabbing away
 * and back (remount restores autoFocus). Single-question prompts
 * have no escape except Ctrl+C.
 *
 * Encoded from anthropics/claude-code#92694 issue facts only.
 * Hypothesis (NON-BINDING, from issue analysis): option list looks
 * isDisabled (Select kills select:* and handleKeyDown together) AND
 * question renderer root Box (tabIndex:0, autoFocus:true) has lost
 * ink focus after blur/focus, while ancestor still handles
 * Tab/arrows. When remount restores focus, the folio is remounted.
 * Verify against issue text only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "attentive",
  "deaf",
  "remounted",
  "blur-deaf",
  "ancestor-live",
  "single-deadend",
  "remount-recovers",
  "isDisabled-signature",
  "focus-lost",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["attentive", "remounted"]);

export const ALARM = new Set([
  "deaf",
  "blur-deaf",
  "ancestor-live",
  "single-deadend",
  "remount-recovers",
  "isDisabled-signature",
  "focus-lost",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "attentive";
export const SEEDED_WORD = "deaf";

export const MEASURED = {
  issue: 92694,
  title:
    "AskUserQuestion becomes unresponsive to selection keys after window refocus; single-question prompts unanswerable",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "platform:macos", "area:tui"],
  filed: "2026-09-07T16:06:07Z",
  claude: "Claude Code 2.1.263 (also 2.1.260)",
  os: "macOS 15 / iTerm2 3.6.9 AND Windows — identical",
  settings: '"tui": "fullscreen"',
  surface: "AskUserQuestion selection keys dead after window refocus",
  footer:
    "Enter to select · Tab/Arrow keys to navigate · Esc to cancel",
  caretStillDrawn: true,
  footerStillDrawn: true,
  deadKeys: ["↑", "↓", "Enter", "j", "k", "1–9", "Esc"],
  liveKeys: ["Tab", "←", "→", "Ctrl+C"],
  trigger:
    "most of the time when the terminal window loses focus and regains it, or after the prompt has been sitting idle",
  doesNotHappen:
    "when the prompt appears while the window is already focused and it is interacted with immediately",
  multiRecovery:
    "Tab across to the Submit tab, then navigate back to the questions (remount restores autoFocus)",
  singleRecovery: "none; Ctrl+C is the only way out",
  notEscapeEncoding: true,
  notWheelScroll: true,
  notStuckChord: true,
  encodingNote:
    "structurally identical ESC[A/B dead while ESC[C/D live; Enter (bare \\r) dead while Tab (bare \\t) live",
  wheelNote:
    "scrolling the wheel over an open question does nothing at all",
  chordNote:
    "chord timeout is 1s and Ctrl+C (a Global action) still works",
  expected:
    "selection keys stay live after blur/refocus; single-question prompts remain answerable",
  actual:
    "caret and footer still paint; subtree-owned keys are dead; ancestor Tab/←/→ live; single-question unanswerable except Ctrl+C",
  impact:
    "ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS; SINGLE-QUESTION UNANSWERABLE; ANCESTOR TAB/ARROWS STILL LIVE"
};

export const KEY_MATRIX = [
  { key: "↑", result: "dead", owner: "question subtree" },
  { key: "↓", result: "dead", owner: "question subtree" },
  { key: "Enter", result: "dead", owner: "question subtree" },
  { key: "j", result: "dead", owner: "question subtree" },
  { key: "k", result: "dead", owner: "question subtree" },
  { key: "1–9", result: "dead", owner: "question subtree" },
  { key: "Esc", result: "dead", owner: "question subtree" },
  { key: "Tab", result: "live", owner: "ancestor" },
  { key: "←", result: "live", owner: "ancestor" },
  { key: "→", result: "live", owner: "ancestor" },
  { key: "Ctrl+C", result: "live", owner: "Global" }
];

export const QUESTION_PANES = [
  {
    id: "single",
    role: "single-question casement",
    recovery: "none",
    escape: "Ctrl+C only",
    note: "nothing to Tab to; prompt unanswerable"
  },
  {
    id: "multi",
    role: "multi-question casement",
    recovery: "Tab to Submit then back",
    escape: "remount restores autoFocus",
    note: "Tab / ← / → still switch questions"
  }
];

export const COUSINS = [
  {
    issue: 84489,
    note: "Cite-only cousin. AskUserQuestion options not selectable. Different trigger (not blur/refocus dead-key split). Primary stays #92694."
  },
  {
    issue: 86918,
    note: "Cite-only cousin. AskUserQuestion never times out while terminal focused. Different surface. Primary stays #92694."
  }
];

export const NOT_THIS_BUG = [
  {
    issue: 84489,
    note: "AskUserQuestion options not selectable — cite-only, not blur/refocus dead keys."
  },
  {
    issue: 86918,
    note: "AskUserQuestion never times out while terminal focused — cite-only."
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
  }
];

const CHIP_REASONS = {
  attentive:
    "HOLD: idle folio is attentive — AskUserQuestion selection keys stay live; caret and footer match a live prompt. Score deaf or admit remounted",
  deaf:
    "ALARM: folio deaf; AskUserQuestion still paints the option caret and footer after terminal blur/refocus but selection keys are dead (↑ ↓ Enter j/k 1–9 Esc). Tab/←/→ live. Single-question prompts unanswerable except Ctrl+C. Score deaf or admit remounted",
  remounted:
    "folio already remounted — remount restores autoFocus and resets chat-row isDisabled; selection keys live again. Seeded admit word is remounted",
  "blur-deaf":
    "blur-deaf — happens most of the time when the terminal window loses focus and regains it, or after the prompt has been sitting idle. Does not happen when the prompt appears while focused and is interacted with immediately",
  "ancestor-live":
    "ancestor-live — Tab / ← / → still work (ancestor-owned). Dead set is exactly the keys the question's own subtree owns. Structurally identical ESC[A/B dead while ESC[C/D live; Enter dead while Tab live",
  "single-deadend":
    "single-deadend — single-question prompts have no Submit tab to escape to; Ctrl+C is the only way out. Multi-question recovers by Tabbing away and back",
  "remount-recovers":
    "remount-recovers — Tab across to Submit then back remounts the renderer: restores autoFocus and resets the chat-row state in one go. Only recovery on multi-question",
  "isDisabled-signature":
    "isDisabled-signature — ↓, Enter, j/k and option numbers dying together is the signature of isDisabled on the Select: it switches off select:* and handleKeyDown together. From issue analysis",
  "focus-lost":
    "focus-lost — ↑ Enter Esc also dead, so the question renderer's own key handler is not firing; root Box (tabIndex:0, autoFocus:true) has lost ink focus while ancestor still handles Tab/arrows. From issue analysis",
  cousins:
    "cite-only NOT #84489 (AskUserQuestion options not selectable) / #86918 (AskUserQuestion never times out while terminal focused). Different paradigm: ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS; SINGLE-QUESTION UNANSWERABLE; ANCESTOR TAB/ARROWS STILL LIVE. Primary stays #92694",
  "has-clear-repro":
    "has-clear-repro — #92694 is labeled has repro: Claude Code 2.1.263 (also 2.1.260), macOS 15 / iTerm2 3.6.9 AND Windows — identical; settings tui fullscreen; filed 2026-09-07T16:06:07Z; labels bug, has repro, platform:windows, platform:macos, area:tui"
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

export function attentiveSignal(text = "") {
  return /idle folio is attentive|pin idle attentive|selection keys stay live|caret and footer match a live prompt/i.test(
    String(text || "")
  );
}

export function deafSignal(text = "") {
  return /folio deaf|selection keys are dead|unresponsive to selection/i.test(String(text || ""));
}

export function remountedSignal(text = "") {
  return /already remounted|folio remounted|remount restores autofocus/i.test(String(text || ""));
}

export function blurDeafSignal(text = "") {
  return /blur-deaf|loses focus and regains|sitting idle/i.test(String(text || ""));
}

export function ancestorLiveSignal(text = "") {
  return /ancestor-live|ancestor-owned|tab \/ ← \/ → still work|esc\[c\/d] live/i.test(
    String(text || "")
  );
}

export function singleDeadendSignal(text = "") {
  return /single-deadend|single-question|no escape except ctrl\+c|ctrl\+c is the only way out/i.test(
    String(text || "")
  );
}

export function remountRecoversSignal(text = "") {
  return /remount-recovers|tab across to submit|remount restores/i.test(String(text || ""));
}

export function isDisabledSignatureSignal(text = "") {
  return /isDisabled-signature|isdisabled on the select|select:\* and handleKeyDown/i.test(
    String(text || "")
  );
}

export function focusLostSignal(text = "") {
  return /focus-lost|lost ink focus|no active element|tabindex:0/i.test(String(text || ""));
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    attentive: attentiveSignal(blob),
    deaf: deafSignal(blob),
    remounted: remountedSignal(blob),
    blurDeaf: blurDeafSignal(blob),
    ancestorLive: ancestorLiveSignal(blob),
    singleDeadend: singleDeadendSignal(blob),
    remountRecovers: remountRecoversSignal(blob),
    isDisabledSignature: isDisabledSignatureSignal(blob),
    focusLost: focusLostSignal(blob)
  };
}

export function folioRemounted(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.folioRemounted) || (boolish(t.remounted) && !boolish(t.deaf))) {
    return true;
  }
  return false;
}

export function keyIsDead(keyLabel) {
  const row = KEY_MATRIX.find((cell) => cell.key === keyLabel);
  if (!row) return null;
  return row.result === "dead";
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const blurDeaf = boolish(t.blurDeaf) || t.triggerBlurRefocus === true || hits.blurDeaf;
  const ancestorLive = boolish(t.ancestorLive) || t.ancestorKeysLive === true || hits.ancestorLive;
  const singleDeadend =
    boolish(t.singleDeadend) || t.singleQuestionUnanswerable === true || hits.singleDeadend;
  const remountRecovers =
    boolish(t.remountRecovers) || t.multiTabRecover === true || hits.remountRecovers;
  const isDisabledSignature =
    boolish(t.isDisabledSignature) || t.selectLooksDisabled === true || hits.isDisabledSignature;
  const focusLost = boolish(t.focusLost) || t.inkFocusLost === true || hits.focusLost;
  const remountedClean = boolish(t.remounted) || folioRemounted(t);
  const deafHit =
    boolish(t.deaf) || (blurDeaf && !boolish(t.remounted) && !boolish(t.attentive));
  const attentiveHit = boolish(t.attentive) || (hits.attentive && !deafHit && !remountedClean);
  return {
    blurDeaf,
    ancestorLive,
    singleDeadend,
    remountRecovers,
    isDisabledSignature,
    focusLost,
    remountedClean,
    deafHit,
    attentiveHit,
    folioRemounted: folioRemounted(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const deaf = boolish(t.deaf) || (print.deafHit && !boolish(t.remounted) && !boolish(t.attentive));
  const remounted = boolish(t.remounted) || (print.remountedClean && !boolish(t.deaf));
  const attentive = boolish(t.attentive) || (print.attentiveHit && !deaf && !remounted);
  return {
    attentive,
    deaf,
    remounted,
    blurDeaf: boolish(t.blurDeaf) || print.blurDeaf,
    ancestorLive: boolish(t.ancestorLive) || print.ancestorLive,
    singleDeadend: boolish(t.singleDeadend) || print.singleDeadend,
    remountRecovers: boolish(t.remountRecovers) || print.remountRecovers,
    isDisabledSignature: boolish(t.isDisabledSignature) || print.isDisabledSignature,
    focusLost: boolish(t.focusLost) || print.focusLost,
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

export function seedAttentive() {
  return {
    seed: "attentive",
    issue: 92694,
    attentive: true,
    deaf: false,
    remounted: false,
    outputText:
      "attentive; idle folio — AskUserQuestion selection keys stay live; caret and footer match a live prompt"
  };
}

export function seedDeaf() {
  return {
    seed: "deaf",
    issue: 92694,
    attentive: false,
    deaf: true,
    remounted: false,
    blurDeaf: true,
    ancestorLive: true,
    singleDeadend: true,
    remountRecovers: true,
    isDisabledSignature: true,
    focusLost: true,
    hasClearRepro: true,
    triggerBlurRefocus: true,
    ancestorKeysLive: true,
    singleQuestionUnanswerable: true,
    multiTabRecover: true,
    selectLooksDisabled: true,
    inkFocusLost: true,
    footer: MEASURED.footer,
    outputText:
      "deaf; AskUserQuestion still paints the caret after blur/refocus but selection keys are dead; Tab/←/→ live",
    claude: MEASURED.claude
  };
}

export function seedRemounted() {
  return {
    seed: "remounted",
    issue: 92694,
    attentive: false,
    deaf: false,
    remounted: true,
    folioRemounted: true,
    remountRestoresAutoFocus: true,
    chatRowReset: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    attentive: seedAttentive(),
    deaf: seedDeaf(),
    remounted: seedRemounted(),
    "blur-deaf": {
      seed: "blur-deaf",
      issue: 92694,
      blurDeaf: true,
      triggerBlurRefocus: true
    },
    "ancestor-live": {
      seed: "ancestor-live",
      issue: 92694,
      ancestorLive: true,
      ancestorKeysLive: true
    },
    "single-deadend": {
      seed: "single-deadend",
      issue: 92694,
      singleDeadend: true,
      singleQuestionUnanswerable: true
    },
    "remount-recovers": {
      seed: "remount-recovers",
      issue: 92694,
      remountRecovers: true,
      multiTabRecover: true
    },
    "isDisabled-signature": {
      seed: "isDisabled-signature",
      issue: 92694,
      isDisabledSignature: true,
      selectLooksDisabled: true
    },
    "focus-lost": {
      seed: "focus-lost",
      issue: 92694,
      focusLost: true,
      inkFocusLost: true
    },
    cousins: {
      seed: "cousins",
      issue: 92694,
      cousins: true,
      cousinsCiteOnly: [84489, 86918]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92694,
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
  "blur-deaf",
  "ancestor-live",
  "single-deadend",
  "remount-recovers",
  "isDisabled-signature",
  "focus-lost",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "blur-deaf": (t, c) => boolish(t.blurDeaf) || c.blurDeaf,
  "ancestor-live": (t, c) => boolish(t.ancestorLive) || c.ancestorLive,
  "single-deadend": (t, c) => boolish(t.singleDeadend) || c.singleDeadend,
  "remount-recovers": (t, c) => boolish(t.remountRecovers) || c.remountRecovers,
  "isDisabled-signature": (t, c) => boolish(t.isDisabledSignature) || c.isDisabledSignature,
  "focus-lost": (t, c) => boolish(t.focusLost) || c.focusLost,
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
      attentive: false,
      deaf: true,
      remounted: false,
      chips: ["cousins", "deaf"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      attentive: false,
      deaf: true,
      remounted: false,
      chips: [seed, "deaf"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "deaf" &&
      seed !== "remounted" &&
      seed !== "attentive"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        attentive: false,
        deaf: true,
        remounted: false,
        chips: [name, "deaf"],
        folio
      };
    }
  }

  if (
    seed === "remounted" ||
    (t.remounted === true && t.deaf !== true && seed !== "deaf") ||
    (folio.remounted && !folio.deaf && seed !== "deaf")
  ) {
    reasons.push(CHIP_REASONS.remounted);
    return {
      verdict: "remounted",
      reasons,
      attentive: false,
      deaf: false,
      remounted: true,
      chips: ["remounted"],
      folio
    };
  }

  if (t.deaf === true || seed === "deaf" || (folio.deaf && !folio.remounted && !folio.attentive)) {
    reasons.push(CHIP_REASONS.deaf);
    const chips = ["deaf"];
    if (t.blurDeaf === true || folio.blurDeaf) chips.push("blur-deaf");
    if (t.ancestorLive === true || folio.ancestorLive) chips.push("ancestor-live");
    if (t.singleDeadend === true || folio.singleDeadend) chips.push("single-deadend");
    if (t.remountRecovers === true || folio.remountRecovers) chips.push("remount-recovers");
    if (t.isDisabledSignature === true || folio.isDisabledSignature) {
      chips.push("isDisabled-signature");
    }
    if (t.focusLost === true || folio.focusLost) chips.push("focus-lost");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "deaf",
      reasons,
      attentive: false,
      deaf: true,
      remounted: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "attentive" || t.attentive === true || folio.attentive) {
    reasons.push(CHIP_REASONS.attentive);
    return {
      verdict: "attentive",
      reasons,
      attentive: true,
      deaf: false,
      remounted: false,
      chips: ["attentive"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      attentive: false,
      deaf: true,
      remounted: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle folio is attentive — HOLD: AskUserQuestion selection keys stay live; caret and footer match a live prompt"
  );
  return {
    verdict: "attentive",
    reasons,
    attentive: true,
    deaf: false,
    remounted: false,
    chips: ["attentive"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedAttentive();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedAttentive();
  }
  return seedAttentive();
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
    product: "espagnolette",
    issue: 92694,
    mark: "09:50 / hermes catalog #215 / #92694",
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
