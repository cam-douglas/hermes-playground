#!/usr/bin/env node
/**
 * Leaven — bakery proofing-bench scorer.
 * A first turn of foreign starter is not a bake.
 * Score the crocks or admit unleavened.
 *
 *   echo '{"toolUses":0,"durationSeconds":12,"instructionShaped":true}' | node leaven.mjs
 *   node leaven.mjs ticket.json
 *
 * Idle word is unleavened.
 * Seeded state is leavened / #90782.
 * NEVER idle as "leaven".
 *
 * Primary #90782: during heavy parallel
 * Agent/Task Explore launches
 * (run_in_background: true), ~5/20
 * subagents return in 2–12s with 0 tool
 * calls, outputting foreign instruction
 * blocks instead of doing the task.
 *
 * UNLEAVENED if tools used, duration in
 * the healthy band (90–220s), result is
 * task-shaped, no MCP/plugin/harness
 * debris fingerprints.
 * LEAVENED if 0 tools + seconds-long +
 * instruction-shaped / foreign debris.
 *
 * NOT Voucher (end-of-run nested fan-out).
 * NOT Pirn / Veto / Hydra / Limpet / Scion.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "unleavened",
  "leavened",
  "contaminated",
  "foreign-echo",
  "zero-tool",
  "system-debris",
  "mcp-echo",
  "skill-echo",
  "blank-abort",
  "relaunched-clean",
]);
export const IDLE_WORD = "unleavened";
export const SEED_ALIASES = Object.freeze({
  "spanish-skill": "skill-echo",
  "notion-mcp": "mcp-echo",
});
export const ALARM_VERDICTS = Object.freeze([
  "leavened",
  "contaminated",
  "foreign-echo",
  "zero-tool",
  "system-debris",
  "mcp-echo",
  "skill-echo",
  "blank-abort",
  "relaunched-clean",
]);
export const HOLD_VERDICTS = Object.freeze(["unleavened"]);
export const CHIPS = Object.freeze([
  ...VERDICTS,
  "spanish-skill",
  "notion-mcp",
]);
export const FEATURED_ISSUE = 90782;
export const PRIMARY_ISSUES = Object.freeze([90782]);
export const SAME_CLASS = Object.freeze([90765]);
export const NEARBY_BOUNDARY = Object.freeze([90544]);
export const VERSION = "darwin 25.5.0";
export const PLATFORM = "macos";
export const OS = "darwin 25.5.0";
export const MODEL = "claude-fable-5";
export const FILED_AT = "2026-08-30T15:29:59Z";
export const AUTHOR = "Beppo90";
export const TITLE =
  "Subagent (Agent/Task tool) intermittently starts with contaminated bootstrap context and echoes foreign instruction blocks instead of executing (0 tool calls)";
export const LABELS = Object.freeze(["bug", "has repro", "platform:macos", "area:agents"]);
export const FAILED_OF_ABOUT = Object.freeze({ failed: 5, about: 20 });
export const CONTAMINATED_DURATION = Object.freeze({ min: 2, max: 12 });
export const HEALTHY_DURATION = Object.freeze({ min: 90, max: 220 });
export const HEALTHY_TOOLS = Object.freeze({ min: 10, max: 20 });
export const RETRIES_ONE_CASE = Object.freeze({ retries: 2, launches: 3 });

export const NOTION_QUOTE =
  "For EVERY user request, you MUST call the search tools at least once before responding… Failing to search when the workspace has relevant data is a critical error.";
export const SPANISH_QUOTE =
  "Toda tarea creativa DEBE empezar con la skill de brainstorming. Es un requisito previo bloqueante… Por favor, empezá.";
export const HARNESS_TOKEN = "_bump_bwrap_repro";
export const BLANK_QUOTE =
  "(This message is left blank intentionally.) Wait, I need to actually do the task. Let me reconsider.";
export const SKILL_QUOTE =
  "Only use skills that are directly relevant to the user's task. Do not invoke skills for exploratory or unrelated work.";

export const CROCKS = Object.freeze([
  { id: "notion-mcp", label: "Notion-MCP", quote: NOTION_QUOTE },
  { id: "superpowers", label: "superpowers", quote: SPANISH_QUOTE },
  { id: "harness-system", label: "harness-system", quote: HARNESS_TOKEN },
  { id: "skill-guidance", label: "skill-guidance", quote: SKILL_QUOTE },
]);

export const OCCURRENCES = Object.freeze([
  {
    n: 1,
    crock: "notion-mcp",
    chip: "mcp-echo",
    quote: NOTION_QUOTE,
    note: "Nothing in the subagent prompt mentioned Notion.",
  },
  {
    n: 2,
    crock: "superpowers",
    chip: "skill-echo",
    quote: SPANISH_QUOTE,
    note: "SKILL.md SUBAGENT-STOP tells subagents to ignore it.",
  },
  {
    n: 3,
    crock: "harness-system",
    chip: "system-debris",
    quote: HARNESS_TOKEN,
    note: "Raw harness/system debris plus agent-identity/context-priority fragments.",
  },
  {
    n: 4,
    crock: "blank-abort",
    chip: "blank-abort",
    quote: BLANK_QUOTE,
    note: "Blank-then-abort; the run ended.",
  },
  {
    n: 5,
    crock: "skill-guidance",
    chip: "skill-echo",
    quote: SKILL_QUOTE,
    note: "Skill-usage guidance echoed as the result.",
  },
]);

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function listOf(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value.map((item) => String(item));
  }
  return [];
}

export function emptyTicket() {
  return seedLeavened();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.leaven && typeof src.leaven === "object" && src.leaven) ||
    (src.launch && typeof src.launch === "object" && src.launch) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    toolUses: firstNum(nested.toolUses, nested.tools, nested.tool_uses),
    durationSeconds: firstNum(
      nested.durationSeconds,
      nested.duration,
      nested.seconds,
      nested.duration_s,
    ),
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text),
    instructionShaped: firstBool(
      nested.instructionShaped,
      nested.instruction_shaped,
      nested.shaped,
    ),
    debrisFingerprints: listOf(
      nested.debrisFingerprints,
      nested.fingerprints,
      nested.debris,
    ),
    relaunchSucceeded: firstBool(
      nested.relaunchSucceeded,
      nested.relaunch,
      nested.retrySucceeded,
    ),
    siblingClean: firstBool(nested.siblingClean, nested.siblingsClean, nested.sibling),
    mcpMentionedInPrompt: firstBool(
      nested.mcpMentionedInPrompt,
      nested.notionInPrompt,
      nested.mcpInPrompt,
    ),
    retries: firstNum(nested.retries, nested.retryCount),
    launches: firstNum(nested.launches, nested.launchCount),
    version: firstText(nested.version, src.version) || "",
    platform: firstText(nested.platform, src.platform) || "",
    os: firstText(nested.os, src.os) || "",
    model: firstText(nested.model, src.model) || "",
    subagentType: firstText(nested.subagentType, nested.subagent_type) || "Explore",
    runInBackground: firstBool(nested.runInBackground, nested.run_in_background),
  };
}

export function detectDebris(text) {
  const raw = String(text || "");
  const found = [];
  if (/for every user request/i.test(raw) && /search tools/i.test(raw)) {
    found.push("notion-mcp", "mcp-echo");
  }
  if (/toda tarea creativa/i.test(raw) && /brainstorming/i.test(raw)) {
    found.push("spanish-skill", "skill-echo");
  }
  if (raw.includes(HARNESS_TOKEN) || /agent-identity|context-priority|_bump_bwrap/i.test(raw)) {
    found.push("system-debris", HARNESS_TOKEN);
  }
  if (/left blank intentionally/i.test(raw) && /reconsider/i.test(raw)) {
    found.push("blank-abort");
  }
  if (/only use skills that are directly relevant/i.test(raw)) {
    found.push("skill-echo", "skill-guidance");
  }
  return [...new Set(found)];
}

export function looksInstructionShaped(text) {
  const raw = String(text || "");
  if (!raw.trim()) return false;
  if (detectDebris(raw).length) return true;
  return /you MUST|requisito previo|do not invoke skills|left blank intentionally/i.test(raw);
}

export function looksTaskShaped(text) {
  const raw = String(text || "");
  if (!raw.trim()) return false;
  if (looksInstructionShaped(raw)) return false;
  return /explored|found|files?|directory|search(ed)? the tree|notes from explore/i.test(raw);
}

export function isUnleavenedBake(ticket) {
  const row = cloneTicket(ticket);
  const tools = row.toolUses;
  const seconds = row.durationSeconds;
  const debris = [
    ...row.debrisFingerprints,
    ...detectDebris(row.outputText),
  ].filter((name) => name !== "relaunched-clean");
  const shaped =
    row.instructionShaped === true || looksInstructionShaped(row.outputText);
  const toolsUsed = tools != null && tools > 0;
  const healthyBand =
    seconds != null &&
    seconds >= HEALTHY_DURATION.min &&
    seconds <= HEALTHY_DURATION.max;
  return (
    toolsUsed &&
    healthyBand &&
    shaped !== true &&
    debris.length === 0
  );
}

export function isLeavenedSignature(ticket) {
  const row = cloneTicket(ticket);
  const tools = row.toolUses;
  const seconds = row.durationSeconds;
  const debris = [...row.debrisFingerprints, ...detectDebris(row.outputText)];
  const shaped =
    row.instructionShaped === true || looksInstructionShaped(row.outputText);
  const zeroTool = tools === 0;
  const secondsLong = seconds != null && seconds <= CONTAMINATED_DURATION.max;
  return zeroTool && secondsLong && (shaped || debris.length > 0);
}

export function analyze(input) {
  const row = cloneTicket(input);
  const detected = detectDebris(row.outputText);
  const debris = [...new Set([...row.debrisFingerprints, ...detected])];
  const shaped =
    row.instructionShaped === true || looksInstructionShaped(row.outputText);
  const zeroTool = row.toolUses === 0;
  const secondsLong =
    row.durationSeconds != null && row.durationSeconds <= CONTAMINATED_DURATION.max;
  const healthyBand =
    row.durationSeconds != null &&
    row.durationSeconds >= HEALTHY_DURATION.min &&
    row.durationSeconds <= HEALTHY_DURATION.max;
  const unleavened = isUnleavenedBake(row);
  const leavenedPattern = isLeavenedSignature(row);
  const mcpEcho =
    debris.includes("notion-mcp") ||
    debris.includes("mcp-echo") ||
    (/notion/i.test(row.outputText) && /search tools/i.test(row.outputText));
  const skillEcho =
    debris.includes("skill-echo") ||
    debris.includes("spanish-skill") ||
    debris.includes("skill-guidance");
  const systemDebris =
    debris.includes("system-debris") ||
    debris.includes(HARNESS_TOKEN) ||
    String(row.outputText || "").includes(HARNESS_TOKEN);
  const blankAbort = debris.includes("blank-abort");
  const chips = [];
  if (unleavened) chips.push("unleavened");
  if (leavenedPattern) chips.push("leavened", "contaminated", "foreign-echo");
  if (zeroTool) chips.push("zero-tool");
  if (systemDebris) chips.push("system-debris");
  if (mcpEcho && row.mcpMentionedInPrompt !== true) chips.push("mcp-echo", "notion-mcp");
  if (skillEcho) chips.push("skill-echo");
  if (debris.includes("spanish-skill") || /toda tarea creativa/i.test(row.outputText)) {
    chips.push("spanish-skill");
  }
  if (blankAbort) chips.push("blank-abort");
  if (row.relaunchSucceeded === true && leavenedPattern) chips.push("relaunched-clean");
  return {
    row,
    debris,
    shaped,
    zeroTool,
    secondsLong,
    healthyBand,
    unleavened,
    leavenedPattern,
    mcpEcho,
    skillEcho,
    systemDebris,
    blankAbort,
    featured: row.issue === FEATURED_ISSUE && leavenedPattern,
    chips: [...new Set(chips)],
  };
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.unleavened && seed !== "relaunched-clean") return "unleavened";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.blankAbort) return "blank-abort";
  if (facts.systemDebris) return "system-debris";
  if (facts.mcpEcho && facts.row.mcpMentionedInPrompt !== true) return "mcp-echo";
  if (facts.skillEcho) return "skill-echo";
  if (facts.row.relaunchSucceeded === true && facts.leavenedPattern) return "relaunched-clean";
  if (facts.featured) return "leavened";
  if (facts.leavenedPattern) return "leavened";
  if (facts.zeroTool && facts.secondsLong) return "zero-tool";
  if (facts.shaped) return "foreign-echo";
  if (facts.debris.length) return "contaminated";
  return "unleavened";
}

export function chipsOf(input) {
  return analyze(input).chips;
}

export function score(input) {
  const facts = analyze(input);
  const verdict = classify(input);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    state: verdict,
    unleavened: verdict === "unleavened" || facts.unleavened,
    leavened: verdict === "leavened" || facts.leavenedPattern,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      toolUses: facts.row.toolUses,
      durationSeconds: facts.row.durationSeconds,
      instructionShaped: facts.shaped,
      debrisFingerprints: facts.debris,
      relaunchSucceeded: facts.row.relaunchSucceeded,
      siblingClean: facts.row.siblingClean,
      mcpMentionedInPrompt: facts.row.mcpMentionedInPrompt,
      zeroTool: facts.zeroTool,
      secondsLong: facts.secondsLong,
      healthyBand: facts.healthyBand,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "unleavened") {
    return "● Unleavened · tools used, healthy band, task-shaped, no debris · hold";
  }
  if (kind === "contaminated") {
    return "● Contaminated · bootstrap context assembled the wrong starter · alarm";
  }
  if (kind === "foreign-echo") {
    return "● Foreign-echo · first visible turn is instruction-shaped, not the task · alarm";
  }
  if (kind === "zero-tool") {
    return "● Zero-tool · 0 tool uses in a seconds-long Explore launch · alarm";
  }
  if (kind === "system-debris") {
    return "● System-debris · harness token _bump_bwrap_repro in the visible turn · alarm";
  }
  if (kind === "mcp-echo") {
    return "● MCP-echo · Notion-MCP search-tool edict with Notion never in the prompt · alarm";
  }
  if (kind === "skill-echo") {
    return "● Skill-echo · plugin skill rule or skill-usage guidance echoed as the result · alarm";
  }
  if (kind === "blank-abort") {
    return "● Blank-abort · left blank intentionally, then reconsider, then the run ended · alarm";
  }
  if (kind === "relaunched-clean") {
    return "● Relaunched-clean · discard the 0-tool loaf and the identical prompt bakes · alarm";
  }
  return "● Leavened · 0 tools + 2–12s + instruction-shaped foreign starter · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "unleavened") {
    reasons.push("tools used, duration in the healthy 90–220s band, task-shaped, no debris");
    reasons.push("hold: this is a bake, not a first turn of foreign starter");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90782 subagent intermittently starts with contaminated bootstrap context and echoes foreign instruction blocks (0 tool calls)",
    );
  }
  if (facts.zeroTool) reasons.push("0 tool uses reported for the run");
  if (facts.row.durationSeconds != null) {
    reasons.push(`${facts.row.durationSeconds}s duration (contaminated band 2–12s; healthy 90–220s)`);
  }
  if (facts.shaped) reasons.push("result is instruction-shaped text, not task output");
  if (facts.mcpEcho && facts.row.mcpMentionedInPrompt !== true) {
    reasons.push("Notion-MCP search-tool edict; nothing in the subagent prompt mentioned Notion");
  }
  if (facts.skillEcho) reasons.push("plugin skill or skill-usage guidance echoed");
  if (facts.systemDebris) reasons.push(`harness/system debris includes ${HARNESS_TOKEN}`);
  if (facts.blankAbort) reasons.push("blank-then-abort; the run ended");
  if (facts.row.siblingClean === true) {
    reasons.push("sibling subagents launched the same instant completed clean");
  }
  if (facts.row.relaunchSucceeded === true) {
    reasons.push("identical relaunch succeeded (workaround: discard → relaunch; 1–2 retries)");
  }
  if (facts.row.retries != null) {
    reasons.push(`${facts.row.retries} retries / ${facts.row.launches ?? facts.row.retries + 1} launches`);
  }
  return reasons;
}

export function seedLeavened() {
  return {
    seed: "leavened",
    issue: FEATURED_ISSUE,
    title: TITLE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["notion-mcp", "mcp-echo"],
    relaunchSucceeded: true,
    siblingClean: true,
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
    os: OS,
    model: MODEL,
    subagentType: "Explore",
    runInBackground: true,
  };
}

export function seedUnleavened() {
  return {
    seed: "unleavened",
    issue: FEATURED_ISSUE,
    toolUses: 10,
    durationSeconds: 90,
    outputText: "Explored the tree. Notes from Explore: files listed, no instruction blocks.",
    instructionShaped: false,
    debrisFingerprints: [],
    relaunchSucceeded: false,
    siblingClean: true,
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
    os: OS,
    model: MODEL,
    subagentType: "Explore",
    runInBackground: true,
  };
}

export function seedContaminated() {
  return {
    seed: "contaminated",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 2,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["contaminated"],
    mcpMentionedInPrompt: false,
    siblingClean: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedForeignEcho() {
  return {
    seed: "foreign-echo",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["foreign-echo"],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedZeroTool() {
  return {
    seed: "zero-tool",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 2,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["zero-tool"],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedSystemDebris() {
  return {
    seed: "system-debris",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: `Raw harness/system debris including internal token ${HARNESS_TOKEN} plus agent-identity/context-priority fragments.`,
    instructionShaped: true,
    debrisFingerprints: ["system-debris", HARNESS_TOKEN],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedMcpEcho() {
  return {
    seed: "mcp-echo",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["notion-mcp", "mcp-echo"],
    mcpMentionedInPrompt: false,
    siblingClean: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedSkillEcho() {
  return {
    seed: "skill-echo",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: SKILL_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["skill-echo", "skill-guidance"],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedBlankAbort() {
  return {
    seed: "blank-abort",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 2,
    outputText: BLANK_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["blank-abort"],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedRelaunchedClean() {
  return {
    seed: "relaunched-clean",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: NOTION_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["notion-mcp"],
    relaunchSucceeded: true,
    siblingClean: true,
    mcpMentionedInPrompt: false,
    retries: 2,
    launches: 3,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedSpanishSkill() {
  return {
    seed: "spanish-skill",
    issue: FEATURED_ISSUE,
    toolUses: 0,
    durationSeconds: 12,
    outputText: SPANISH_QUOTE,
    instructionShaped: true,
    debrisFingerprints: ["spanish-skill", "skill-echo"],
    mcpMentionedInPrompt: false,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedNotionMcp() {
  return seedMcpEcho();
}

export function seedCauterized() {
  return seedUnleavened();
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    unleavened: seedUnleavened,
    leavened: seedLeavened,
    contaminated: seedContaminated,
    "foreign-echo": seedForeignEcho,
    "zero-tool": seedZeroTool,
    "system-debris": seedSystemDebris,
    "mcp-echo": seedMcpEcho,
    "skill-echo": seedSkillEcho,
    "blank-abort": seedBlankAbort,
    "relaunched-clean": seedRelaunchedClean,
    "spanish-skill": seedSpanishSkill,
    "notion-mcp": seedMcpEcho,
    90782: seedLeavened,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedLeavened());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.leaven?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket =
    payload.ticket || payload.leaven || payload.launch || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = result.alarm;
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? "Leaven leavened. A first turn of foreign starter is not a bake. #90782 0-tool, 2–12s, instruction-shaped foreign echo. Discard and relaunch."
        : "Leaven unleavened. Tools used, healthy band, task-shaped, no debris.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedLeavened();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.leaven || parsed.launch || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedLeavened();
  }
  return seedLeavened();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedLeavened());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
