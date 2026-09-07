/**
 * Springe — trapper's snare / springe-setter bench.
 *
 * A springe that should catch a PreToolUse deny but slips:
 * plugin-native hooks auto-discovered from hooks/hooks.json
 * are not enforced in interactive Claude Code sessions.
 * Exit-2 works only in print mode. JSON
 * hookSpecificOutput.permissionDecision:"deny" fails in BOTH
 * interactive and print mode. A settings.json-declared
 * PreToolUse hook using exit-2 DOES block interactively
 * (control).
 *
 * Encoded from anthropics/claude-code#92675 issue facts only.
 * Hypothesis (NON-BINDING): the interactive path may
 * load/execute plugin hooks without gating tool calls on
 * their result; JSON permissionDecision may never be consumed
 * for plugin-sourced PreToolUse results even when the process
 * runs correctly. Verify against issue text only; do not
 * claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "slipped",
  "sprung",
  "settings-exit2-blocks",
  "plugin-exit2-interactive-slip",
  "plugin-exit2-print-blocks",
  "plugin-json-deny-both-modes-slip",
  "matcher-general-not-bash-only",
  "hook-logic-correct-standalone",
  "cache-byte-identical",
  "three-axis-isolation",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["sprung"]);

export const ALARM = new Set([
  "slipped",
  "settings-exit2-blocks",
  "plugin-exit2-interactive-slip",
  "plugin-exit2-print-blocks",
  "plugin-json-deny-both-modes-slip",
  "matcher-general-not-bash-only",
  "hook-logic-correct-standalone",
  "cache-byte-identical",
  "three-axis-isolation",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "slipped";
export const SEEDED_WORD = "sprung";

export const MEASURED = {
  issue: 92675,
  title:
    "Plugin-native PreToolUse hooks (auto-discovered via hooks/hooks.json) are not enforced in interactive sessions — exit-2 works only in print mode, JSON permissionDecision:\"deny\" doesn't work in either mode",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:windows",
    "area:hooks",
    "area:plugins",
    "area:permissions"
  ],
  filed: "2026-09-07T14:23:15Z",
  updated: "2026-09-07T14:24:27Z",
  reporter: "BuildSmarterAI",
  comments: 0,
  os: "Windows 11 (10.0.26200)",
  shell: "Git Bash",
  surface: "Claude Code plugin-native PreToolUse hooks",
  claudeCodeLive: "2.1.263",
  plugin: "everything-claude-code",
  pluginId: "ecc@ecc",
  pluginVersion: "2.2.1",
  pluginRepo: "https://github.com/affaan-m/everything-claude-code",
  controlHook: "deploy-guard.js",
  controlProtocol: "exit-2",
  controlSource: "settings.json",
  controlBlockedInteractive: true,
  pluginExit2Hook: "block-no-verify.js",
  pluginExit2Matcher: "Bash",
  pluginExit2InteractiveBlocked: false,
  pluginExit2PrintBlocked: true,
  pluginEditWriteHook: "config-protection.js",
  pluginEditWriteMatcher: "Edit|Write",
  pluginEditWriteInteractiveBlocked: false,
  pluginJsonHook: "gateguard-fact-force.js",
  pluginJsonMatcher: "Bash",
  pluginJsonInteractiveBlocked: false,
  pluginJsonPrintBlocked: false,
  standaloneDenyJsonCorrect: true,
  dispatcherDenyJsonCorrect: true,
  bootstrapDenyJsonCorrect: true,
  cacheByteIdentical: true,
  matcherGeneralNotBashOnly: true,
  threeAxisIsolation: true,
  expected:
    "plugin-native PreToolUse decisions enforced identically to settings.json in both modes for exit-2 and JSON deny",
  actual:
    "plugin exit-2 slips interactively; plugin JSON deny slips in both modes; settings.json exit-2 blocks",
  impact:
    "plugin authors who follow the documented deny protocols are silently no-op'd in interactive sessions — the common way Claude Code is used"
};

export const MATRIX = [
  {
    id: "settings-exit2",
    source: "settings.json",
    protocol: "exit-2",
    interactive: "blocks",
    print: "blocks",
    slip: false,
    control: true,
    hook: "deploy-guard.js"
  },
  {
    id: "plugin-exit2",
    source: "plugin-native",
    protocol: "exit-2",
    interactive: "slips",
    print: "blocks",
    slip: true,
    control: false,
    hook: "block-no-verify.js"
  },
  {
    id: "plugin-json-deny",
    source: "plugin-native",
    protocol: "json-deny",
    interactive: "slips",
    print: "slips",
    slip: true,
    control: false,
    hook: "gateguard-fact-force.js"
  }
];

export const COUSINS = [
  {
    id: 10875,
    state: "closed",
    note: "Cite-only cousin. Closed. Plugin hook stdout not captured / skipped parse step that inline settings.json hooks go through (v2.0.31). Does not address interactive-vs-print or the exit-2 case. Primary stays #92675."
  },
  {
    id: 52822,
    state: "closed",
    note: "Cite-only cousin. Closed. JSON permissionDecision:\"allow\" not honored interactively (v2.1.119). Same JSON-protocol-not-honored shape but for allow, not deny; no print-vs-interactive × plugin-vs-settings isolation. Primary stays #92675."
  },
  {
    id: 31250,
    state: "closed",
    note: "Cite-only cousin. Closed/stale. PreToolUse hooks silently not firing. General shape match, no three-axis isolation. Primary stays #92675."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624: named spawn foreign session id. Different defect."
  },
  {
    slug: "snatch",
    issue: 92583,
    note: "Snatch/#92583: session-end never reaps auto-backgrounded Bash orphans. Different defect."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop overbroad SendMessage ban. Different defect."
  },
  {
    slug: "afterimage",
    issue: 92596,
    note: "Afterimage/#92596: Windows text paint deferred until message_stop. Different defect."
  },
  {
    slug: "limber",
    issue: 92590,
    note: "Limber/#92590: unexpanded $TMPDIR write-allowlist. Different defect."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: settings-layer merge miss. Different defect."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout promote + TaskStop leftover. Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: staged-hook ENOENT fake security-notice loop. Different defect."
  },
  { slug: "gangway", note: "Gangway: prior catalog paradigm. Different defect." },
  { slug: "oubliette", issue: 92095, note: "Oubliette/#92095: prior catalog paradigm. Different defect." },
  { slug: "sounder", note: "Sounder: prior catalog paradigm. Different defect." },
  { slug: "callboard", note: "Callboard: prior catalog paradigm. Different defect." },
  { slug: "knock", note: "Knock: prior catalog paradigm. Different defect." },
  { slug: "annunciator", note: "Annunciator: prior catalog paradigm. Different defect." }
];

export const SNARES = [
  {
    id: "peg",
    role: "settings.json peg / exit-2 control",
    hail: "deploy-guard.js · blocks interactive",
    taut: true
  },
  {
    id: "noose",
    role: "plugin-native noose / hooks.json",
    hail: "exit-2 slips interactive · JSON deny slips both",
    taut: false
  },
  {
    id: "trigger",
    role: "enforcement trigger / tool-call gate",
    hail: "standalone deny JSON correct · runtime does not act",
    taut: false
  }
];

const CHIP_REASONS = {
  slipped:
    "ALARM: springe slipped; plugin-native PreToolUse deny silently no-ops in interactive sessions. Score slipped or admit sprung",
  sprung:
    "springe already sprung — plugin-native PreToolUse deny is enforced in interactive and print mode for exit-2 and JSON permissionDecision. Seeded word is sprung",
  "settings-exit2-blocks":
    "settings-exit2-blocks — control: settings.json-declared deploy-guard.js using exit-2 blocked the interactive probe. Proves the harness works generally; isolates the miss to plugin-sourced hooks",
  "plugin-exit2-interactive-slip":
    "plugin-exit2-interactive-slip — plugin-native block-no-verify.js (hooks/hooks.json, Bash matcher, exit-2) did not block the interactive session; the probe ran to completion",
  "plugin-exit2-print-blocks":
    "plugin-exit2-print-blocks — same plugin-native exit-2 hook DOES block in print mode (claude -p) and surfaces the expected stderr. Isolates interactive-only miss for exit-2",
  "plugin-json-deny-both-modes-slip":
    "plugin-json-deny-both-modes-slip — plugin-native gateguard-fact-force.js emitting JSON hookSpecificOutput.permissionDecision:\"deny\" does not block interactive OR print; the documented JSON protocol is not consumed from a plugin-sourced hook",
  "matcher-general-not-bash-only":
    "matcher-general-not-bash-only — plugin-native config-protection.js (Edit|Write matcher, exit-2) did not block an interactive edit of a protected-config-shaped file. Confirms matcher-general, not Bash-only",
  "hook-logic-correct-standalone":
    "hook-logic-correct-standalone — raw hook module, dispatcher pipeline, and plugin-hook-bootstrap.js all emit well-formed deny JSON with exit 0 when run standalone. Runtime issue, not a plugin-code bug",
  "cache-byte-identical":
    "cache-byte-identical — cached plugin snapshot (~/.claude/plugins/cache/ecc/ecc/2.2.1/) is byte-identical to the source checkout. Not a staleness issue",
  "three-axis-isolation":
    "three-axis-isolation — hook source (plugin-native vs settings.json) × protocol (exit-2 vs JSON permissionDecision) × mode (interactive vs print) as three independent axes; source and protocol each independently cause the failure",
  cousins:
    "cite-only #10875 closed (plugin hook stdout not captured); #52822 closed (permissionDecision allow not honored interactively); #31250 closed/stale (PreToolUse silent fail). Do not auto-pick as thesis. Not Waybill/#92624. Not Snatch/#92583. Not Speakpipe/#92646. Not Afterimage/#92596. Not Limber/#92590. Not Chock/#92582. Not Deadman/#92593. Not Eidolon/#92601. Not Gangway. Not Oubliette/#92095. Not Bitts / Sounder / Callboard / Knock / Annunciator. Primary stays #92675",
  "has-clear-repro":
    "has-clear-repro — #92675 is labeled has repro: Claude Code 2.1.263; Windows 11; Git Bash; plugin ecc@ecc v2.2.1; three-axis source×protocol×mode matrix"
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

export function slippedSignal(text = "") {
  return /slipped|silently no-op|does not block|did not block|not enforced/i.test(
    String(text || "")
  );
}

export function sprungSignal(text = "") {
  return /sprung|deny correctly enforced|enforced identically|noose taut/i.test(
    String(text || "")
  );
}

export function settingsExit2Signal(text = "") {
  return /settings-exit2-blocks|deploy-guard|settings\.json-declared/i.test(
    String(text || "")
  );
}

export function pluginExit2InteractiveSignal(text = "") {
  return /plugin-exit2-interactive-slip|block-no-verify|interactive session.*not block/i.test(
    String(text || "")
  );
}

export function pluginExit2PrintSignal(text = "") {
  return /plugin-exit2-print-blocks|print mode.*block|claude -p.*block/i.test(
    String(text || "")
  );
}

export function pluginJsonDenySignal(text = "") {
  return /plugin-json-deny-both-modes-slip|permissionDecision:"deny"|gateguard-fact-force/i.test(
    String(text || "")
  );
}

export function matcherGeneralSignal(text = "") {
  return /matcher-general-not-bash-only|config-protection|Edit\|Write/i.test(
    String(text || "")
  );
}

export function standaloneLogicSignal(text = "") {
  return /hook-logic-correct-standalone|standalone|dispatcher pipeline|plugin-hook-bootstrap/i.test(
    String(text || "")
  );
}

export function cacheIdenticalSignal(text = "") {
  return /cache-byte-identical|byte-identical|plugins\/cache\/ecc/i.test(
    String(text || "")
  );
}

export function threeAxisSignal(text = "") {
  return /three-axis-isolation|source×protocol×mode|three independent axes/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    slipped: slippedSignal(blob),
    sprung: sprungSignal(blob),
    settingsExit2: settingsExit2Signal(blob),
    pluginExit2Interactive: pluginExit2InteractiveSignal(blob),
    pluginExit2Print: pluginExit2PrintSignal(blob),
    pluginJsonDeny: pluginJsonDenySignal(blob),
    matcherGeneral: matcherGeneralSignal(blob),
    standaloneLogic: standaloneLogicSignal(blob),
    cacheIdentical: cacheIdenticalSignal(blob),
    threeAxis: threeAxisSignal(blob)
  };
}

export function springeSprung(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.springeSprung) || (boolish(t.sprung) && !boolish(t.slipped))) {
    return boolish(t.springeSprung) || (boolish(t.sprung) && !boolish(t.slipped));
  }
  return false;
}

export function cellEnforced(source, protocol, mode) {
  const row = MATRIX.find(
    (cell) => cell.source === source && cell.protocol === protocol
  );
  if (!row) return null;
  if (mode === "interactive") return row.interactive === "blocks";
  if (mode === "print") return row.print === "blocks";
  return null;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const settingsExit2 =
    boolish(t.settingsExit2Blocks) ||
    t.controlBlockedInteractive === true ||
    hits.settingsExit2;
  const pluginExit2Interactive =
    boolish(t.pluginExit2InteractiveSlip) ||
    t.pluginExit2InteractiveBlocked === false ||
    hits.pluginExit2Interactive;
  const pluginExit2Print =
    boolish(t.pluginExit2PrintBlocks) ||
    t.pluginExit2PrintBlocked === true ||
    hits.pluginExit2Print;
  const pluginJsonDeny =
    boolish(t.pluginJsonDenyBothModesSlip) ||
    (t.pluginJsonInteractiveBlocked === false && t.pluginJsonPrintBlocked === false) ||
    hits.pluginJsonDeny;
  const matcherGeneral =
    boolish(t.matcherGeneralNotBashOnly) ||
    t.pluginEditWriteInteractiveBlocked === false ||
    hits.matcherGeneral;
  const standaloneLogic =
    boolish(t.hookLogicCorrectStandalone) ||
    boolish(t.standaloneDenyJsonCorrect) ||
    hits.standaloneLogic;
  const cacheIdentical =
    boolish(t.cacheByteIdentical) ||
    t.cacheByteIdentical === true ||
    hits.cacheIdentical;
  const threeAxis =
    boolish(t.threeAxisIsolation) ||
    t.threeAxisIsolation === true ||
    hits.threeAxis;
  const sprungClean = boolish(t.sprung) || springeSprung(t);
  const slippedHit = boolish(t.slipped) || (pluginExit2Interactive && !boolish(t.sprung));
  return {
    settingsExit2,
    pluginExit2Interactive,
    pluginExit2Print,
    pluginJsonDeny,
    matcherGeneral,
    standaloneLogic,
    cacheIdentical,
    threeAxis,
    sprungClean,
    slippedHit,
    nooseTaut: springeSprung(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const slipped = boolish(t.slipped) || (print.slippedHit && !boolish(t.sprung));
  const sprung = boolish(t.sprung) || (print.sprungClean && !boolish(t.slipped));
  return {
    slipped,
    sprung,
    settingsExit2Blocks: boolish(t.settingsExit2Blocks) || print.settingsExit2,
    pluginExit2InteractiveSlip:
      boolish(t.pluginExit2InteractiveSlip) || print.pluginExit2Interactive,
    pluginExit2PrintBlocks: boolish(t.pluginExit2PrintBlocks) || print.pluginExit2Print,
    pluginJsonDenyBothModesSlip:
      boolish(t.pluginJsonDenyBothModesSlip) || print.pluginJsonDeny,
    matcherGeneralNotBashOnly:
      boolish(t.matcherGeneralNotBashOnly) || print.matcherGeneral,
    hookLogicCorrectStandalone:
      boolish(t.hookLogicCorrectStandalone) || print.standaloneLogic,
    cacheByteIdentical: boolish(t.cacheByteIdentical) || print.cacheIdentical,
    threeAxisIsolation: boolish(t.threeAxisIsolation) || print.threeAxis,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    os: t.os || MEASURED.os
  };
}

export function seedSlipped() {
  return {
    seed: "slipped",
    issue: 92675,
    slipped: true,
    sprung: false,
    settingsExit2Blocks: true,
    pluginExit2InteractiveSlip: true,
    pluginExit2PrintBlocks: true,
    pluginJsonDenyBothModesSlip: true,
    matcherGeneralNotBashOnly: true,
    hookLogicCorrectStandalone: true,
    cacheByteIdentical: true,
    threeAxisIsolation: true,
    pluginExit2InteractiveBlocked: false,
    pluginExit2PrintBlocked: true,
    pluginJsonInteractiveBlocked: false,
    pluginJsonPrintBlocked: false,
    standaloneDenyJsonCorrect: true,
    outputText:
      "slipped; plugin-native PreToolUse deny silently no-ops interactively; JSON deny fails both modes",
    reporter: MEASURED.reporter
  };
}

export function seedSprung() {
  return {
    seed: "sprung",
    issue: 92675,
    slipped: false,
    sprung: true,
    springeSprung: true,
    pluginExit2InteractiveBlocked: true,
    pluginJsonInteractiveBlocked: true,
    pluginJsonPrintBlocked: true,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    slipped: seedSlipped(),
    sprung: seedSprung(),
    "settings-exit2-blocks": {
      seed: "settings-exit2-blocks",
      issue: 92675,
      settingsExit2Blocks: true,
      controlBlockedInteractive: true
    },
    "plugin-exit2-interactive-slip": {
      seed: "plugin-exit2-interactive-slip",
      issue: 92675,
      pluginExit2InteractiveSlip: true,
      pluginExit2InteractiveBlocked: false
    },
    "plugin-exit2-print-blocks": {
      seed: "plugin-exit2-print-blocks",
      issue: 92675,
      pluginExit2PrintBlocks: true,
      pluginExit2PrintBlocked: true
    },
    "plugin-json-deny-both-modes-slip": {
      seed: "plugin-json-deny-both-modes-slip",
      issue: 92675,
      pluginJsonDenyBothModesSlip: true,
      pluginJsonInteractiveBlocked: false,
      pluginJsonPrintBlocked: false
    },
    "matcher-general-not-bash-only": {
      seed: "matcher-general-not-bash-only",
      issue: 92675,
      matcherGeneralNotBashOnly: true,
      pluginEditWriteInteractiveBlocked: false
    },
    "hook-logic-correct-standalone": {
      seed: "hook-logic-correct-standalone",
      issue: 92675,
      hookLogicCorrectStandalone: true,
      standaloneDenyJsonCorrect: true
    },
    "cache-byte-identical": {
      seed: "cache-byte-identical",
      issue: 92675,
      cacheByteIdentical: true
    },
    "three-axis-isolation": {
      seed: "three-axis-isolation",
      issue: 92675,
      threeAxisIsolation: true
    },
    cousins: {
      seed: "cousins",
      issue: 92675,
      cousins: true,
      cousinsCiteOnly: [10875, 52822, 31250]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92675,
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
  "settings-exit2-blocks",
  "plugin-exit2-interactive-slip",
  "plugin-exit2-print-blocks",
  "plugin-json-deny-both-modes-slip",
  "matcher-general-not-bash-only",
  "hook-logic-correct-standalone",
  "cache-byte-identical",
  "three-axis-isolation",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "settings-exit2-blocks": (t, c) => boolish(t.settingsExit2Blocks) || c.settingsExit2Blocks,
  "plugin-exit2-interactive-slip": (t, c) =>
    boolish(t.pluginExit2InteractiveSlip) || c.pluginExit2InteractiveSlip,
  "plugin-exit2-print-blocks": (t, c) =>
    boolish(t.pluginExit2PrintBlocks) || c.pluginExit2PrintBlocks,
  "plugin-json-deny-both-modes-slip": (t, c) =>
    boolish(t.pluginJsonDenyBothModesSlip) || c.pluginJsonDenyBothModesSlip,
  "matcher-general-not-bash-only": (t, c) =>
    boolish(t.matcherGeneralNotBashOnly) || c.matcherGeneralNotBashOnly,
  "hook-logic-correct-standalone": (t, c) =>
    boolish(t.hookLogicCorrectStandalone) || c.hookLogicCorrectStandalone,
  "cache-byte-identical": (t, c) => boolish(t.cacheByteIdentical) || c.cacheByteIdentical,
  "three-axis-isolation": (t, c) => boolish(t.threeAxisIsolation) || c.threeAxisIsolation,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const springe = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      slipped: true,
      sprung: false,
      chips: ["cousins", "slipped"],
      springe
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      slipped: true,
      sprung: false,
      chips: [seed, "slipped"],
      springe
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, springe) && seed !== "slipped" && seed !== "sprung") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        slipped: true,
        sprung: false,
        chips: [name, "slipped"],
        springe
      };
    }
  }

  if (
    seed === "sprung" ||
    (t.sprung === true && t.slipped !== true && seed !== "slipped") ||
    (springe.sprung && !springe.slipped && seed !== "slipped")
  ) {
    reasons.push(CHIP_REASONS.sprung);
    return {
      verdict: "sprung",
      reasons,
      slipped: false,
      sprung: true,
      chips: ["sprung"],
      springe
    };
  }

  if (t.slipped === true || seed === "slipped" || (springe.slipped && !springe.sprung)) {
    reasons.push(CHIP_REASONS.slipped);
    const chips = ["slipped"];
    if (t.settingsExit2Blocks === true || springe.settingsExit2Blocks) {
      chips.push("settings-exit2-blocks");
    }
    if (t.pluginExit2InteractiveSlip === true || springe.pluginExit2InteractiveSlip) {
      chips.push("plugin-exit2-interactive-slip");
    }
    if (t.pluginExit2PrintBlocks === true || springe.pluginExit2PrintBlocks) {
      chips.push("plugin-exit2-print-blocks");
    }
    if (t.pluginJsonDenyBothModesSlip === true || springe.pluginJsonDenyBothModesSlip) {
      chips.push("plugin-json-deny-both-modes-slip");
    }
    if (t.matcherGeneralNotBashOnly === true || springe.matcherGeneralNotBashOnly) {
      chips.push("matcher-general-not-bash-only");
    }
    if (t.hookLogicCorrectStandalone === true || springe.hookLogicCorrectStandalone) {
      chips.push("hook-logic-correct-standalone");
    }
    if (t.cacheByteIdentical === true || springe.cacheByteIdentical) {
      chips.push("cache-byte-identical");
    }
    if (t.threeAxisIsolation === true || springe.threeAxisIsolation) {
      chips.push("three-axis-isolation");
    }
    return {
      verdict: "slipped",
      reasons,
      slipped: true,
      sprung: false,
      chips: [...new Set(chips)],
      springe
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, slipped: false, sprung: true, chips: [seed], springe };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      slipped: true,
      sprung: false,
      chips: [seed],
      springe
    };
  }

  reasons.push(
    "empty probe; idle springe is slipped — ALARM: plugin-native PreToolUse deny silently no-ops"
  );
  return {
    verdict: "slipped",
    reasons,
    slipped: true,
    sprung: false,
    chips: ["slipped"],
    springe
  };
}
