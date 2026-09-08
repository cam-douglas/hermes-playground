/**
 * Homonym — lexicographer / registrar twin-nameplate desk.
 *
 * The named ledger (`claude_ai_Gmail`) should stay matched across
 * entrypoints. In Desktop local sessions (Code tab, entrypoint
 * claude-desktop) claude.ai connectors mount under their connection
 * UUID instead, so documented `mcp__claude_ai_<name>__*` ask/deny
 * rules silently miss. Score orphaned or admit keyed.
 *
 * Encoded from anthropics/claude-code#92787 issue facts only.
 * Hypothesis (NON-BINDING): Desktop local sessions resolve claude.ai
 * connectors by connection UUID while CLI uses display-name server
 * ids, so documented `mcp__claude_ai_*` permission rules never bind
 * in Desktop — silent miss, not a permissions-engine failure. Invite
 * verify against issue text only — do not invent unread source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "matched",
  "orphaned",
  "keyed",
  "cli-named-mount",
  "desktop-uuid-mount",
  "ask-rule-silent-miss",
  "no-startup-warning",
  "uuid-undocumented",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["matched", "keyed"]);

export const ALARM = new Set([
  "orphaned",
  "cli-named-mount",
  "desktop-uuid-mount",
  "ask-rule-silent-miss",
  "no-startup-warning",
  "uuid-undocumented",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "matched";
export const SEEDED_WORD = "orphaned";
export const ADMIT_WORD = "keyed";

export const MEASURED = {
  issue: 92787,
  title:
    "claude.ai connectors mount under connection UUIDs in Desktop local sessions, so `mcp__claude_ai_<name>__*` permission rules never match there (re-raising #77598, closed as stale)",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:macos",
    "area:mcp",
    "area:permissions",
    "area:desktop"
  ],
  filed: "2026-09-08T05:58:51Z",
  reporter: "honzapav",
  cli: "2.1.263",
  desktop: "1.46388.4",
  observedDesktopSessions: ["2.1.219", "2.1.260"],
  os: "macOS 26.5.2",
  surface:
    "Desktop local sessions (Code tab, entrypoint claude-desktop) mount claude.ai connectors under connection UUID; CLI mounts the same connectors as claude_ai_<display name>",
  expected:
    "Mount connectors under the same server name in every entrypoint (claude_ai_<name>), or resolve mcp__claude_ai_<name>__* rules against the UUID-mounted server as an alias; failing that, document the UUID form and emit a startup warning",
  actual:
    "Every permissions.ask or permissions.deny rule written as mcp__claude_ai_<name>__<tool> is silently ineffective in Desktop — no warning; rule looks valid; tool call goes through without a prompt",
  examples: [
    {
      connector: "Gmail",
      cli: "mcp__claude_ai_Gmail__send_message",
      desktop: "mcp__00f86eb0-3a3c-4c27-acda-6f24a36b05d7__send_message",
      uuid: "00f86eb0-3a3c-4c27-acda-6f24a36b05d7"
    },
    {
      connector: "Google Calendar",
      cli: "mcp__claude_ai_Google_Calendar__create_event",
      desktop: "mcp__4378a0e9-5968-4b33-9b01-6761445ef5f1__create_event",
      uuid: "4378a0e9-5968-4b33-9b01-6761445ef5f1"
    },
    {
      connector: "Asana",
      cli: "mcp__claude_ai_Asana__add_comment",
      desktop: "mcp__67cd082d-c902-4339-b9ff-cfe96708ca78__add_comment",
      uuid: "67cd082d-c902-4339-b9ff-cfe96708ca78"
    }
  ],
  evidence: [
    { date: "2026-08-04", entrypoint: "claude-desktop", version: "2.1.219", uuidNamed: 522, claudeAiNamed: 0 },
    { date: "2026-08-04", entrypoint: "claude-desktop", version: "2.1.219", uuidNamed: 522, claudeAiNamed: 0 },
    { date: "2026-09-04", entrypoint: "claude-desktop", version: "2.1.260", uuidNamed: 1602, claudeAiNamed: 0 },
    { date: "2026-09-04", entrypoint: "claude-desktop", version: "2.1.260", uuidNamed: 1068, claudeAiNamed: 0 },
    { date: "2026-09-04", entrypoint: "claude-desktop", version: "2.1.260", uuidNamed: 1602, claudeAiNamed: 0 },
    { date: "2026-09-08", entrypoint: "cli", version: "2.1.263", uuidNamed: 0, claudeAiNamed: 605 },
    { date: "2026-09-08", entrypoint: "cli", version: "2.1.263", uuidNamed: 0, claudeAiNamed: 640 }
  ],
  uuidStableAcrossUpgrade: {
    connector: "Gmail",
    uuid: "00f86eb0-3a3c-4c27-acda-6f24a36b05d7",
    from: "2.1.219",
    to: "2.1.260",
    dates: ["2026-08-04", "2026-09-04"]
  },
  rotationCousin: 82532,
  noStartupWarning:
    "the \"rule matches no tool\" check is skipped for names containing `_` or `*`",
  uuidNotShownIn: ["/mcp", "claude mcp list", "Desktop connector settings"],
  uuidRecoverableFrom: ["~/.claude/projects/*.jsonl", "Desktop main.log"],
  orgControls: {
    ask: "do not reach Desktop local/SSH",
    blocked: "does reach Desktop; also removes the tool from claude.ai chat"
  },
  documentedForm: "mcp__claude_ai_<server>__<tool>",
  undocumentedForm: "UUID server segment used by Desktop",
  mainLogExample: "mcp__661701d8-b3ee-4ee0-82b5-715f14e7aa31__get_account",
  hypothesis:
    "NON-BINDING: Desktop local sessions resolve claude.ai connectors by connection UUID while CLI uses display-name server ids, so documented mcp__claude_ai_* permission rules never bind in Desktop — silent miss, not a permissions-engine failure. Invite verify against issue text only."
};

export const NAMEPLATE_LEDGER = [
  {
    id: "named",
    role: "brass nameplate / claude_ai_<display name>",
    tally: "CLI mounts Gmail as mcp__claude_ai_Gmail__send_message",
    note: "documented form; the named ledger the registrar should keep matched"
  },
  {
    id: "ghost",
    role: "UUID ghost plate / connection guidon",
    tally: "Desktop mounts Gmail as mcp__00f86eb0-3a3c-4c27-acda-6f24a36b05d7__send_message",
    note: "undocumented; not shown in /mcp; orphans named ask/deny rules"
  },
  {
    id: "keyed",
    role: "keyed alias / admit",
    tally: "same server name in every entrypoint, or named rules resolve against the UUID mount",
    note: "hypothetical: the twin plates stay keyed so the named ledger binds in Desktop"
  }
];

export const EVIDENCE_TABLE = MEASURED.evidence;

export const COUSINS = [
  {
    id: 77598,
    state: "closed",
    title:
      "claude.ai connector MCP server names differ by entrypoint: `claude_ai_` in CLI vs connection UUID in desktop — breaks subagent `tools:` and permission rules",
    note: "cite-only — CLOSED stale (same class); not primary"
  },
  {
    id: 82532,
    state: "open",
    title:
      "Connector per-tool permissions still reset — root cause is server identity rotation, not just app upgrades (re-raising #56954)",
    note: "cite-only — OPEN (identity rotation); not primary"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "clepsydra",
    issue: 92776,
    note: "Clepsydra/#92776 already shipped — OTel token.usage mid-session arrest. Do not touch."
  },
  {
    slug: "letoff",
    issue: 92771,
    note: "Letoff/#92771 already shipped — libuv Shift+Enter flatten. Do not touch."
  },
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
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped — MCP resources {}. Do not touch."
  }
];

const CHIP_REASONS = {
  matched:
    "HOLD: desk is matched — named ledger (claude_ai_<name>) stays matched across entrypoints. Score orphaned or admit keyed",
  orphaned:
    "ALARM: Desktop orphans the rule under a UUID guidon; named mcp__claude_ai_<name>__<tool> ask/deny rules silently miss. Score orphaned or admit keyed",
  keyed:
    "desk already keyed — same server name in every entrypoint, or named rules resolve against the UUID-mounted server as an alias. Seeded admit word is keyed",
  "cli-named-mount":
    "cli-named-mount — CLI sessions of the same account mount connectors as claude_ai_<display name>; Gmail mcp__claude_ai_Gmail__send_message; transcript 2026-09-08 entrypoint=cli version=2.1.263 uuid-named tools=0 claude_ai-named 605 / 640",
  "desktop-uuid-mount":
    "desktop-uuid-mount — Desktop local sessions (Code tab, entrypoint claude-desktop) mount under connection UUID; Gmail mcp__00f86eb0-3a3c-4c27-acda-6f24a36b05d7__send_message; uuid-named tools 522–1602 with claude_ai-named 0",
  "ask-rule-silent-miss":
    "ask-rule-silent-miss — permissions.ask or permissions.deny written as mcp__claude_ai_<name>__<tool> is silently ineffective in Desktop; ask mcp__claude_ai_Gmail__send_message prompts in CLI and sends without a prompt in Desktop",
  "no-startup-warning":
    "no-startup-warning — nothing warns; the rule looks valid in settings.json; the \"rule matches no tool\" check is skipped for names containing `_` or `*`",
  "uuid-undocumented":
    "uuid-undocumented — docs (permissions#mcp) document only the named form; UUID form is undocumented and not shown in /mcp, claude mcp list, or Desktop connector settings",
  cousins:
    "cite-only neighbourhood — #77598 CLOSED stale (same class), #82532 OPEN (identity rotation). Primary stays #92787",
  "has-clear-repro":
    "has-clear-repro — #92787 is labeled has repro: CLI 2.1.263, Desktop 1.46388.4 / observed 2.1.219 and 2.1.260; macOS 26.5.2; filed 2026-09-08T05:58:51Z; labels bug, has repro, platform:macos, area:mcp, area:permissions, area:desktop"
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

export function matchedSignal(text = "") {
  return /idle desk is matched|pin idle matched|named ledger stays matched|matched across entrypoints/i.test(
    String(text || "")
  );
}

export function orphanedSignal(text = "") {
  return /orphans the rule|UUID guidon|silently miss|silently ineffective|uuid-named tools/i.test(
    String(text || "")
  );
}

export function keyedSignal(text = "") {
  return /already keyed|same server name in every entrypoint|named rules resolve against the UUID/i.test(
    String(text || "")
  );
}

export function cliNamedMountSignal(text = "") {
  return /cli-named-mount|claude_ai_Gmail|entrypoint=cli|claude_ai-named 605/i.test(
    String(text || "")
  );
}

export function desktopUuidMountSignal(text = "") {
  return /desktop-uuid-mount|00f86eb0-3a3c-4c27-acda-6f24a36b05d7|entrypoint claude-desktop|uuid-named tools 522/i.test(
    String(text || "")
  );
}

export function askRuleSilentMissSignal(text = "") {
  return /ask-rule-silent-miss|silently ineffective|sends without a prompt|permissions\.ask/i.test(
    String(text || "")
  );
}

export function noStartupWarningSignal(text = "") {
  return /no-startup-warning|rule matches no tool|looks valid in settings\.json/i.test(
    String(text || "")
  );
}

export function uuidUndocumentedSignal(text = "") {
  return /uuid-undocumented|permissions#mcp|not shown in \/mcp|undocumented/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    matched: matchedSignal(blob),
    orphaned: orphanedSignal(blob),
    keyed: keyedSignal(blob),
    cliNamedMount: cliNamedMountSignal(blob),
    desktopUuidMount: desktopUuidMountSignal(blob),
    askRuleSilentMiss: askRuleSilentMissSignal(blob),
    noStartupWarning: noStartupWarningSignal(blob),
    uuidUndocumented: uuidUndocumentedSignal(blob)
  };
}

export function deskWasOrphaned(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.orphaned) || boolish(t.uuidGuidon) || boolish(t.silentMiss)) {
    return true;
  }
  return orphanedSignal(extractText(t));
}

export function namedLedgerMatched(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.deskKeyed) || (boolish(t.keyed) && !boolish(t.orphaned))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const orphanedHit =
    boolish(t.orphaned) || (deskWasOrphaned(t) && !boolish(t.keyed) && !boolish(t.matched));
  const keyedClean = boolish(t.keyed) || namedLedgerMatched(t);
  const matchedHit = boolish(t.matched) || (hits.matched && !orphanedHit && !keyedClean);
  return {
    orphanedHit,
    keyedClean,
    matchedHit,
    cliNamedMount: boolish(t.cliNamedMount) || hits.cliNamedMount,
    desktopUuidMount: boolish(t.desktopUuidMount) || hits.desktopUuidMount,
    askRuleSilentMiss: boolish(t.askRuleSilentMiss) || hits.askRuleSilentMiss,
    noStartupWarning: boolish(t.noStartupWarning) || hits.noStartupWarning,
    uuidUndocumented: boolish(t.uuidUndocumented) || hits.uuidUndocumented,
    deskKeyed: namedLedgerMatched(t),
    uuidGuidon: orphanedHit,
    namedMatched: keyedClean && !orphanedHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const orphaned = boolish(t.orphaned) || (print.orphanedHit && !boolish(t.keyed) && !boolish(t.matched));
  const keyed = boolish(t.keyed) || (print.keyedClean && !boolish(t.orphaned));
  const matched = boolish(t.matched) || (print.matchedHit && !orphaned && !keyed);
  return {
    matched,
    orphaned,
    keyed,
    cliNamedMount: boolish(t.cliNamedMount) || print.cliNamedMount,
    desktopUuidMount: boolish(t.desktopUuidMount) || print.desktopUuidMount,
    askRuleSilentMiss: boolish(t.askRuleSilentMiss) || print.askRuleSilentMiss,
    noStartupWarning: boolish(t.noStartupWarning) || print.noStartupWarning,
    uuidUndocumented: boolish(t.uuidUndocumented) || print.uuidUndocumented,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    cli: t.cli || MEASURED.cli,
    desktop: t.desktop || MEASURED.desktop
  };
}

export function seedMatched() {
  return {
    seed: "matched",
    issue: 92787,
    matched: true,
    orphaned: false,
    keyed: false,
    outputText:
      "matched; idle desk — named ledger stays matched across entrypoints"
  };
}

export function seedOrphaned() {
  return {
    seed: "orphaned",
    issue: 92787,
    matched: false,
    orphaned: true,
    keyed: false,
    uuidGuidon: true,
    silentMiss: true,
    cliNamedMount: true,
    desktopUuidMount: true,
    askRuleSilentMiss: true,
    noStartupWarning: true,
    uuidUndocumented: true,
    hasClearRepro: true,
    outputText:
      "orphaned; Desktop orphans the rule under a UUID guidon — named ask/deny rules silently miss",
    cli: MEASURED.cli,
    desktop: MEASURED.desktop
  };
}

export function seedKeyed() {
  return {
    seed: "keyed",
    issue: 92787,
    matched: false,
    orphaned: false,
    keyed: true,
    deskKeyed: true,
    aliasBound: true,
    cli: MEASURED.cli,
    desktop: MEASURED.desktop
  };
}

export function seeds() {
  return {
    matched: seedMatched(),
    orphaned: seedOrphaned(),
    keyed: seedKeyed(),
    "cli-named-mount": { seed: "cli-named-mount", issue: 92787, cliNamedMount: true },
    "desktop-uuid-mount": { seed: "desktop-uuid-mount", issue: 92787, desktopUuidMount: true },
    "ask-rule-silent-miss": { seed: "ask-rule-silent-miss", issue: 92787, askRuleSilentMiss: true },
    "no-startup-warning": { seed: "no-startup-warning", issue: 92787, noStartupWarning: true },
    "uuid-undocumented": { seed: "uuid-undocumented", issue: 92787, uuidUndocumented: true },
    cousins: { seed: "cousins", issue: 92787, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92787,
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
  "cli-named-mount",
  "desktop-uuid-mount",
  "ask-rule-silent-miss",
  "no-startup-warning",
  "uuid-undocumented",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "cli-named-mount": (t, c) => boolish(t.cliNamedMount) || c.cliNamedMount,
  "desktop-uuid-mount": (t, c) => boolish(t.desktopUuidMount) || c.desktopUuidMount,
  "ask-rule-silent-miss": (t, c) => boolish(t.askRuleSilentMiss) || c.askRuleSilentMiss,
  "no-startup-warning": (t, c) => boolish(t.noStartupWarning) || c.noStartupWarning,
  "uuid-undocumented": (t, c) => boolish(t.uuidUndocumented) || c.uuidUndocumented,
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
      matched: false,
      orphaned: true,
      keyed: false,
      chips: ["cousins", "orphaned"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      matched: false,
      orphaned: true,
      keyed: false,
      chips: [seed, "orphaned"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "orphaned" &&
      seed !== "keyed" &&
      seed !== "matched"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        matched: false,
        orphaned: true,
        keyed: false,
        chips: [name, "orphaned"],
        folio
      };
    }
  }

  if (
    seed === "keyed" ||
    (t.keyed === true && t.orphaned !== true && seed !== "orphaned") ||
    (folio.keyed && !folio.orphaned && seed !== "orphaned")
  ) {
    reasons.push(CHIP_REASONS.keyed);
    return {
      verdict: "keyed",
      reasons,
      matched: false,
      orphaned: false,
      keyed: true,
      chips: ["keyed"],
      folio
    };
  }

  if (t.orphaned === true || seed === "orphaned" || (folio.orphaned && !folio.keyed && !folio.matched)) {
    reasons.push(CHIP_REASONS.orphaned);
    const chips = ["orphaned"];
    if (t.cliNamedMount === true || folio.cliNamedMount) chips.push("cli-named-mount");
    if (t.desktopUuidMount === true || folio.desktopUuidMount) chips.push("desktop-uuid-mount");
    if (t.askRuleSilentMiss === true || folio.askRuleSilentMiss) chips.push("ask-rule-silent-miss");
    if (t.noStartupWarning === true || folio.noStartupWarning) chips.push("no-startup-warning");
    if (t.uuidUndocumented === true || folio.uuidUndocumented) chips.push("uuid-undocumented");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "orphaned",
      reasons,
      matched: false,
      orphaned: true,
      keyed: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "matched" || t.matched === true || folio.matched) {
    reasons.push(CHIP_REASONS.matched);
    return {
      verdict: "matched",
      reasons,
      matched: true,
      orphaned: false,
      keyed: false,
      chips: ["matched"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      matched: false,
      orphaned: true,
      keyed: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle desk is matched — HOLD: named ledger stays matched across entrypoints"
  );
  return {
    verdict: "matched",
    reasons,
    matched: true,
    orphaned: false,
    keyed: false,
    chips: ["matched"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedMatched();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedMatched();
  }
  return seedMatched();
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
    product: "homonym",
    issue: 92787,
    mark: "16:50 / hermes catalog #222 / #92787",
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
