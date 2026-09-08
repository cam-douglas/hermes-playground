/**
 * Setoff — letterpress set-off bench (ink from one sheet transferring
 * onto the facing sheet).
 *
 * Sub-agents receive the auto-memory index (MEMORY.md as `instructions`
 * attachment) and a full `skill_listing` attachment on the first request,
 * contrary to docs that say main-conversation auto memory is NOT loaded
 * into subagents (except forks) and subagents do NOT receive a
 * pre-populated skills listing. Measured: built-in general-purpose
 * 45,907 cold tokens; custom agent no tools: 33,244; custom 8-tool
 * allowlist still 27,832 — the residual ~24k is memory index + skill
 * listing + CLAUDE.md. Custom agent defs replace system prompt and
 * tools allowlist trims schemas, but memory+skills+CLAUDE.md arrive
 * unchanged.
 *
 * Encoded from anthropics/claude-code#92750 issue facts only.
 * Hypothesis (NON-BINDING): attachment pipeline for subagents may reuse
 * parent session bootstrap and forget to strip auto-memory +
 * skill_listing except for forks. Invite verify against issue text only
 * — do not invent source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "lean",
  "laden",
  "shed",
  "memory-attached",
  "skill-listing",
  "custom-agent-unchanged",
  "allowlist-residual",
  "token-table",
  "docs-vs-measured",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["lean", "shed"]);

export const ALARM = new Set([
  "laden",
  "memory-attached",
  "skill-listing",
  "custom-agent-unchanged",
  "allowlist-residual",
  "token-table",
  "docs-vs-measured",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "lean";
export const SEEDED_WORD = "laden";
export const ADMIT_WORD = "shed";

export const MEASURED = {
  issue: 92750,
  title:
    "Sub-agents receive the auto-memory index and skill listing, contrary to the docs — custom agent definitions included",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:agents"],
  filed: "2026-09-07T23:38:05Z",
  reporter: "alanna",
  claude: "Claude Code 2.1.263 (also 2.1.261 / 2.1.258)",
  os: "macOS 15",
  plan: "Claude Max",
  models: ["claude-fable-5-1", "claude-opus-5"],
  surface: "subagent first request carries MEMORY.md + skill_listing attachments contrary to docs",
  docsExpected: [
    "The main conversation's auto memory isn't loaded into subagents; the exception is a fork.",
    "Subagents don't receive a pre-populated listing [of skills and MCP tools]."
  ],
  actual:
    "first request attachments include full project MEMORY.md (~19,850 chars) as instructions AND skill_listing (~24–26k chars, ~49 skills)",
  memoryChars: 19850,
  skillListingChars: "24–26k",
  skillCount: 49,
  attachments: ["instructions", "skill_listing"],
  affects: ["general-purpose", "custom .claude/agents/*.md"],
  tokens: {
    generalPurpose: 45907,
    customNoTools: 33244,
    customAllowlist8: 27832,
    residualApprox: 24000
  },
  residualNote:
    "the residual ~24k is memory index + skill listing + CLAUDE.md (+ ~3k of tool names/session context)",
  customAgentNote:
    "A custom definition does replace the Claude Code system prompt as documented, and a tools: allowlist does trim the schemas — but memory index, skill listing and CLAUDE.md files arrive unchanged",
  repro:
    "create probe agent, dispatch Agent(subagent_type=\"probe\", prompt=\"Reply with exactly the single word DONE...\"), inspect ~/.claude/projects/<project>/<session-id>/subagents/agent-*.jsonl",
  expected:
    "main-conversation auto memory is NOT loaded into subagents (except forks); subagents do NOT receive a pre-populated skills listing",
  impact:
    "SUBAGENT FIRST REQUESTS CARRY MEMORY.MD + SKILL_LISTING ATTACHMENTS CONTRARY TO DOCS (EVEN WITH CUSTOM AGENTS AND TOOL ALLOWLISTS)"
};

export const TOKEN_TABLE = [
  { agent: "built-in general-purpose", tokens: 45907, note: "cold cache" },
  { agent: "custom definition, no tools:", tokens: 33244, note: "system prompt replaced" },
  { agent: "custom definition, 8-tool allowlist", tokens: 27832, note: "schemas trimmed; residual ~24k" }
];

export const SHEETS = [
  {
    id: "lean",
    role: "clean tympan / idle sheet",
    ink: "none",
    note: "dampened, no offset — memory index and skill listing stay off the first request"
  },
  {
    id: "laden",
    role: "facing sheet / set-off",
    ink: "oxidized halo",
    note: "MEMORY.md as instructions + skill_listing transferred onto the first request"
  },
  {
    id: "shed",
    role: "stripped proof / admit",
    ink: "halo wiped",
    note: "hypothetical strip of auto-memory + skill_listing; tympan returns lean"
  }
];

export const COUSINS = [];

export const NOT_THIS_BUG = [
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
  }
];

const CHIP_REASONS = {
  lean:
    "HOLD: idle tympan is lean — no MEMORY.md instructions attachment and no skill_listing on the first request. Score laden or admit shed",
  laden:
    "ALARM: facing sheet laden; first request carries MEMORY.md (~19,850 chars) as instructions AND skill_listing (~24–26k chars, ~49 skills), contrary to docs. Custom agents and tool allowlists still transfer the pair. Score laden or admit shed",
  shed:
    "tympan already shed — hypothetical strip of auto-memory + skill_listing; residual halo wiped. Seeded admit word is shed",
  "memory-attached":
    "memory-attached — first-request attachments include full project MEMORY.md (~19,850 chars) as an instructions attachment, alongside CLAUDE.md files (which are documented as loading)",
  "skill-listing":
    "skill-listing — first-request attachments include a skill_listing with one description line per skill (~24–26k chars, ~49 skills). Docs say subagents do not receive a pre-populated listing",
  "custom-agent-unchanged":
    "custom-agent-unchanged — custom .claude/agents/*.md replace the system prompt as documented, but memory index, skill listing and CLAUDE.md files arrive unchanged",
  "allowlist-residual":
    "allowlist-residual — custom 8-tool allowlist still 27,832 cold tokens; the residual ~24k is memory index + skill listing + CLAUDE.md. Allowlist trims schemas only",
  "token-table":
    "token-table — built-in general-purpose 45,907; custom no tools 33,244; custom 8-tool allowlist 27,832 (cold cache). Residual ~24k is memory + skills + CLAUDE.md",
  "docs-vs-measured":
    "docs-vs-measured — docs: main-conversation auto memory is NOT loaded into subagents (except forks) and subagents do NOT receive a pre-populated skills listing. Measured: both arrive on the first request",
  cousins:
    "cite-only neighbourhood empty — no verified related OPEN issues about subagent context claimed as cousins. Prefer none. Primary stays #92750",
  "has-clear-repro":
    "has-clear-repro — #92750 is labeled has repro: Claude Code 2.1.263 (also 2.1.261 / 2.1.258), macOS 15, Claude Max, models claude-fable-5-1 and claude-opus-5; filed 2026-09-07T23:38:05Z; labels bug, has repro, platform:macos, area:agents"
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

export function leanSignal(text = "") {
  return /idle tympan is lean|pin idle lean|neither memory|no memory\.md|no skill_listing/i.test(
    String(text || "")
  );
}

export function ladenSignal(text = "") {
  return /facing sheet laden|memory\.md.*skill_listing|skill_listing.*memory|laden; first request/i.test(
    String(text || "")
  );
}

export function shedSignal(text = "") {
  return /already shed|tympan shed|hypothetical strip|halo wiped/i.test(String(text || ""));
}

export function memoryAttachedSignal(text = "") {
  const blob = String(text || "");
  if (/no memory\.md|neither memory/i.test(blob)) return false;
  return /memory-attached|memory\.md.*instructions|instructions attachment/i.test(blob);
}

export function skillListingSignal(text = "") {
  const blob = String(text || "");
  if (/no skill_listing|neither memory|no pre-populated listing/i.test(blob)) return false;
  return /skill-listing|skill_listing|pre-populated listing/i.test(blob);
}

export function customAgentUnchangedSignal(text = "") {
  return /custom-agent-unchanged|custom agent|arrive unchanged|\.claude\/agents/i.test(
    String(text || "")
  );
}

export function allowlistResidualSignal(text = "") {
  return /allowlist-residual|8-tool allowlist|27,?832|residual ~24k/i.test(String(text || ""));
}

export function tokenTableSignal(text = "") {
  return /token-table|45,?907|33,?244|27,?832/i.test(String(text || ""));
}

export function docsVsMeasuredSignal(text = "") {
  return /docs-vs-measured|contrary to (the )?docs|docs say/i.test(String(text || ""));
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    lean: leanSignal(blob),
    laden: ladenSignal(blob),
    shed: shedSignal(blob),
    memoryAttached: memoryAttachedSignal(blob),
    skillListing: skillListingSignal(blob),
    customAgentUnchanged: customAgentUnchangedSignal(blob),
    allowlistResidual: allowlistResidualSignal(blob),
    tokenTable: tokenTableSignal(blob),
    docsVsMeasured: docsVsMeasuredSignal(blob)
  };
}

function attachmentNames(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const raw = t.attachments || t.attachmentNames || t.firstRequestAttachments || [];
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return String(item.type || item.name || "");
      return "";
    });
  }
  return [];
}

export function hasMemoryInstructions(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.memoryAttached) || boolish(t.memoryInstructions) || boolish(t.hasMemoryMd)) {
    return true;
  }
  const names = attachmentNames(t);
  if (names.some((name) => /instructions/i.test(name)) && (boolish(t.memoryMd) || t.memoryChars || t.memoryPath)) {
    return true;
  }
  if (names.some((name) => /instructions/i.test(name)) && /memory\.md/i.test(extractText(t))) {
    return true;
  }
  return memoryAttachedSignal(extractText(t));
}

export function hasSkillListing(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.skillListing) || boolish(t.hasSkillListing) || boolish(t.skillListingAttached)) {
    return true;
  }
  const names = attachmentNames(t);
  if (names.some((name) => /skill_listing|skill-listing/i.test(name))) return true;
  return skillListingSignal(extractText(t));
}

export function tympanShed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.tympanShed) || (boolish(t.shed) && !boolish(t.laden))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const memoryAttached = hasMemoryInstructions(t) || hits.memoryAttached;
  const skillListing = hasSkillListing(t) || hits.skillListing;
  const customAgentUnchanged =
    boolish(t.customAgentUnchanged) || t.customAgentMemoryUnchanged === true || hits.customAgentUnchanged;
  const allowlistResidual =
    boolish(t.allowlistResidual) || t.allowlistStillLaden === true || hits.allowlistResidual;
  const tokenTable = boolish(t.tokenTable) || hits.tokenTable;
  const docsVsMeasured = boolish(t.docsVsMeasured) || hits.docsVsMeasured;
  const shedClean = boolish(t.shed) || tympanShed(t);
  const ladenHit =
    boolish(t.laden) ||
    (memoryAttached && skillListing && !boolish(t.shed) && !boolish(t.lean));
  const leanHit = boolish(t.lean) || (hits.lean && !ladenHit && !shedClean);
  return {
    memoryAttached,
    skillListing,
    customAgentUnchanged,
    allowlistResidual,
    tokenTable,
    docsVsMeasured,
    shedClean,
    ladenHit,
    leanHit,
    tympanShed: tympanShed(t),
    bothAttachments: memoryAttached && skillListing,
    neitherAttachment: !memoryAttached && !skillListing,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const laden = boolish(t.laden) || (print.ladenHit && !boolish(t.shed) && !boolish(t.lean));
  const shed = boolish(t.shed) || (print.shedClean && !boolish(t.laden));
  const lean = boolish(t.lean) || (print.leanHit && !laden && !shed);
  return {
    lean,
    laden,
    shed,
    memoryAttached: boolish(t.memoryAttached) || print.memoryAttached,
    skillListing: boolish(t.skillListing) || print.skillListing,
    customAgentUnchanged: boolish(t.customAgentUnchanged) || print.customAgentUnchanged,
    allowlistResidual: boolish(t.allowlistResidual) || print.allowlistResidual,
    tokenTable: boolish(t.tokenTable) || print.tokenTable,
    docsVsMeasured: boolish(t.docsVsMeasured) || print.docsVsMeasured,
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

export function seedLean() {
  return {
    seed: "lean",
    issue: 92750,
    lean: true,
    laden: false,
    shed: false,
    memoryAttached: false,
    skillListing: false,
    attachments: [],
    outputText:
      "lean; idle tympan — no MEMORY.md instructions attachment and no skill_listing on the first request"
  };
}

export function seedLaden() {
  return {
    seed: "laden",
    issue: 92750,
    lean: false,
    laden: true,
    shed: false,
    memoryAttached: true,
    skillListing: true,
    customAgentUnchanged: true,
    allowlistResidual: true,
    tokenTable: true,
    docsVsMeasured: true,
    hasClearRepro: true,
    hasMemoryMd: true,
    hasSkillListing: true,
    memoryMd: true,
    memoryChars: MEASURED.memoryChars,
    skillCount: MEASURED.skillCount,
    attachments: ["instructions", "skill_listing"],
    tokens: MEASURED.tokens,
    outputText:
      "laden; first request carries MEMORY.md as instructions AND skill_listing, contrary to docs",
    claude: MEASURED.claude
  };
}

export function seedShed() {
  return {
    seed: "shed",
    issue: 92750,
    lean: false,
    laden: false,
    shed: true,
    tympanShed: true,
    memoryStripped: true,
    skillListingStripped: true,
    attachments: [],
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    lean: seedLean(),
    laden: seedLaden(),
    shed: seedShed(),
    "memory-attached": {
      seed: "memory-attached",
      issue: 92750,
      memoryAttached: true,
      hasMemoryMd: true,
      memoryChars: MEASURED.memoryChars
    },
    "skill-listing": {
      seed: "skill-listing",
      issue: 92750,
      skillListing: true,
      hasSkillListing: true,
      skillCount: MEASURED.skillCount
    },
    "custom-agent-unchanged": {
      seed: "custom-agent-unchanged",
      issue: 92750,
      customAgentUnchanged: true,
      customAgentMemoryUnchanged: true
    },
    "allowlist-residual": {
      seed: "allowlist-residual",
      issue: 92750,
      allowlistResidual: true,
      allowlistStillLaden: true
    },
    "token-table": {
      seed: "token-table",
      issue: 92750,
      tokenTable: true
    },
    "docs-vs-measured": {
      seed: "docs-vs-measured",
      issue: 92750,
      docsVsMeasured: true
    },
    cousins: {
      seed: "cousins",
      issue: 92750,
      cousins: true,
      cousinsCiteOnly: []
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92750,
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
  "memory-attached",
  "skill-listing",
  "custom-agent-unchanged",
  "allowlist-residual",
  "token-table",
  "docs-vs-measured",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "memory-attached": (t, c) => boolish(t.memoryAttached) || c.memoryAttached,
  "skill-listing": (t, c) => boolish(t.skillListing) || c.skillListing,
  "custom-agent-unchanged": (t, c) => boolish(t.customAgentUnchanged) || c.customAgentUnchanged,
  "allowlist-residual": (t, c) => boolish(t.allowlistResidual) || c.allowlistResidual,
  "token-table": (t, c) => boolish(t.tokenTable) || c.tokenTable,
  "docs-vs-measured": (t, c) => boolish(t.docsVsMeasured) || c.docsVsMeasured,
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
      lean: false,
      laden: true,
      shed: false,
      chips: ["cousins", "laden"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      lean: false,
      laden: true,
      shed: false,
      chips: [seed, "laden"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "laden" &&
      seed !== "shed" &&
      seed !== "lean"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        lean: false,
        laden: true,
        shed: false,
        chips: [name, "laden"],
        folio
      };
    }
  }

  if (
    seed === "shed" ||
    (t.shed === true && t.laden !== true && seed !== "laden") ||
    (folio.shed && !folio.laden && seed !== "laden")
  ) {
    reasons.push(CHIP_REASONS.shed);
    return {
      verdict: "shed",
      reasons,
      lean: false,
      laden: false,
      shed: true,
      chips: ["shed"],
      folio
    };
  }

  if (t.laden === true || seed === "laden" || (folio.laden && !folio.shed && !folio.lean)) {
    reasons.push(CHIP_REASONS.laden);
    const chips = ["laden"];
    if (t.memoryAttached === true || folio.memoryAttached) chips.push("memory-attached");
    if (t.skillListing === true || folio.skillListing) chips.push("skill-listing");
    if (t.customAgentUnchanged === true || folio.customAgentUnchanged) {
      chips.push("custom-agent-unchanged");
    }
    if (t.allowlistResidual === true || folio.allowlistResidual) chips.push("allowlist-residual");
    if (t.tokenTable === true || folio.tokenTable) chips.push("token-table");
    if (t.docsVsMeasured === true || folio.docsVsMeasured) chips.push("docs-vs-measured");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "laden",
      reasons,
      lean: false,
      laden: true,
      shed: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "lean" || t.lean === true || folio.lean) {
    reasons.push(CHIP_REASONS.lean);
    return {
      verdict: "lean",
      reasons,
      lean: true,
      laden: false,
      shed: false,
      chips: ["lean"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      lean: false,
      laden: true,
      shed: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle tympan is lean — HOLD: no MEMORY.md instructions attachment and no skill_listing on the first request"
  );
  return {
    verdict: "lean",
    reasons,
    lean: true,
    laden: false,
    shed: false,
    chips: ["lean"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedLean();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedLean();
  }
  return seedLean();
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
    product: "setoff",
    issue: 92750,
    mark: "10:50 / hermes catalog #216 / #92750",
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
