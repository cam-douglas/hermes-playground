#!/usr/bin/env node
/**
 * Knell — campanology death-knell / funeral-bell atelier classifier.
 * A knell that never tolls is not a hold.
 * Score the mute or admit mute.
 *
 *   echo '{"toolName":"Agent","spawnedSuccessfully":true,"childDead":true}' | node knell.mjs
 *   node knell.mjs ticket.json
 *
 * Idle word is tolled (HOLD: child death surfaced — stderr/exit
 * persisted; parent notified; ListAgents does not list dead as alive).
 * Seeded state is mute / #91298 (Spawned successfully; child dead;
 * no transcript/error/log; ListAgents ghost; SendMessage queued
 * forever; ps-only discovery).
 * NEVER idle as honored / discarded / arrested / skipped / indexed /
 * jumped / chocked / rolled / clasped / sprung / drained / hinged /
 * pealed / warded / pooled / cased / aired / sifted / stocked /
 * stationed / marvered / unpinned / rinsed / literal / choked.
 *
 * Primary #91298: Agent tool (custom types from .claude/agents/*.md)
 * returned "Spawned successfully", but the child process exited within
 * seconds-to-minutes, wrote no transcript, produced no output, sent no
 * failure signal, and left no log artifact. Parent discovered deaths
 * only by noticing absence of results and checking ps. 4 out of 4
 * times over ~5 hours; earlier same-type spawns in the same session
 * worked. Claude Code 2.1.246 Linux. Agents: beads-change-reviewer,
 * write-safety-reviewer (opus override). ListAgents still lists the
 * dead as teammates. SendMessage accepted ("Message sent to inbox")
 * but never drains. TaskStop + respawn → same outcome faster.
 * Reporter cciordas. Filed 2026-09-01T19:18:18Z. OPEN. Labels: bug,
 * has repro, platform:linux, area:agents.
 *
 * Hypothesis only (NON-BINDING): long-running compacted sessions may
 * leave Agent-tool spawn paths that report success while the child
 * never reaches first API turn, with no parent-side liveness channel.
 * Do not claim a root cause in Claude Code source you have not seen.
 * Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the knell is tolled or mute.
 *
 * NOT Tumbler #74256 (PermissionRequest ExitPlanMode allow discarded /
 * chooser blocks — cite as stay-off).
 * NOT Escapement #91371 (local scheduled mid-run isRunning stall →
 * Skipped).
 * NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab).
 * NOT Carillon #91250 (plugin SessionStart first-wins peal board —
 * campanology-adjacent craft language ONLY; UI must stay OFF oak
 * belfry / peal board / registers-three-strikes-one; Sheaf/#91250 is
 * a clone — do not ship).
 * NOT Scotch #91324 (SCM recovery Access denied).
 * NOT Pintle #91226 / Fibula #91306 / Virgule #91337 / Riddle #91327 /
 * Garner #91246 / Postern #91223 / Sluice #91265.
 * NOT Quire #91284 (transcript writer silent data-loss — this hour's
 * backup, not primary).
 * NOT #87203 (cloud ultrareview agents terminated — cite-only cousin).
 * NOT #71723 (Agent tool name→teammate protocol — cite-only).
 * NOT leftover woodworking / mm-slider / millrace / wagon-scotch /
 * cloak-pin / composing-stick / geneva-drive / maltese-cross /
 * escapement pallet-fork / locksmith pin-tumbler.
 * Product name stays Knell. Do not rename to Bell / Toll / Funeral /
 * Mute / Spawn / Tumbler / Escapement / Geneva / Scotch / Fibula /
 * Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sheaf /
 * Quire.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "tolled",
  "mute",
  "spawned-ok-dead",
  "no-transcript",
  "listagents-ghost",
  "sendmessage-queued",
  "no-failure-signal",
  "ps-only-discovery",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "tolled";
export const SEEDED_WORD = "mute";
export const HOLD_VERDICTS = Object.freeze(["tolled", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91298;
export const PRIMARY_ISSUES = Object.freeze([91298]);
export const COUSINS = Object.freeze([87203, 71723, 88849, 83366, 86129]);
export const COUSIN_ISSUE = 87203;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "fibula",
  "virgule",
  "riddle",
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "cockade",
  "lye",
  "sheaf",
  "quire",
  "woodworking",
  "mm-slider",
  "millrace",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "geneva-drive",
  "maltese-cross",
  "escapement pallet-fork",
  "locksmith pin-tumbler",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91298";
export const TITLE =
  "Subagents (Agent tool, custom types) die silently at startup: no transcript, no error, no log; parent never notified";
export const FILED_AT = "2026-09-01T19:18:18Z";
export const UPDATED_AT = "2026-09-01T19:19:36Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:agents",
]);
export const REPORTER = "cciordas";
export const TOOL_NAME = "Agent";
export const SPAWNED_OK = "Spawned successfully";
export const SEND_INBOX = "Message sent to inbox";
export const LIST_AGENTS = "ListAgents";
export const SEND_MESSAGE = "SendMessage";
export const TASK_STOP = "TaskStop";
export const AGENT_A = "beads-change-reviewer";
export const AGENT_B = "write-safety-reviewer";
export const MODEL_OVERRIDE = "opus";
export const AGENTS_DIR = ".claude/agents";
export const VERSION = "2.1.246";
export const PLATFORM = "Linux";
export const FOUR_OF_FOUR = "4 out of 4";
export const FIRST_ACTION = "first-action output file";
export const HUB_LINE =
  "14:50 knell: a knell that never tolls is not a hold. Score the mute or admit mute.";
export const MARK = "14:50 / hermes catalog #115 / #91298";
export const PHRASE =
  "a knell that never tolls is not a hold. Score the mute or admit mute.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: long-running compacted sessions may leave Agent-tool spawn paths that report success while the child never reaches first API turn, with no parent-side liveness channel. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is AGENT TOOL RETURNS \"SPAWNED SUCCESSFULLY\" FOR CUSTOM .claude/agents TYPES BUT THE CHILD DIES SILENTLY AT STARTUP — NO TRANSCRIPT, NO ERROR, NO LOG, NO FAILURE SIGNAL; LISTAGENTS STILL LISTS THE DEAD; SENDMESSAGE QUEUES FOREVER; PARENT DISCOVERS ONLY VIA ps; 4/4 ON 2.1.246 LINUX. Agent tool (custom types from .claude/agents/*.md) returned \"Spawned successfully\", but the child process exited within seconds-to-minutes, wrote no transcript, produced no output, sent no failure signal, and left no log artifact. Parent discovered deaths only by noticing absence of results and checking ps. 4 out of 4 times over ~5 hours; earlier same-type spawns in the same session worked. Claude Code 2.1.246, Linux; long-running interactive session (days old, compacted once, large context). Agents: beads-change-reviewer, write-safety-reviewer (opus override), named background subagents. Timeline: ~10:19 spawn → ListAgents teammates → ~4.5h silence → SendMessage accepted but never drains → ~14:51 ps shows no process; no transcripts under ~/.claude/projects/<project>/. TaskStop + respawn → same outcome faster; first-action output file never appeared. Ruled out: OOM (101 GiB free; no OOM-killer; load ~1.4/32-core); agent definitions; crash artifacts (no logs under ~/.claude, ~/.cache, ~/.local/share/claude; nothing journalctl --user; no cores). Expected: subagent runs OR orchestrator told it died (tool result, task notification, or log with child stderr). Actual: permanent silence; ListAgents lists dead; messages queue forever; dead indistinguishable from busy without ps. Asks: (1) persist stderr/exit when child dies before first API turn (2) surface death to parent (3) document log location. Reporter cciordas, 2026-09-01T19:18:18Z. NOT Tumbler #74256 (PermissionRequest ExitPlanMode allow discarded / chooser blocks — cite as stay-off). NOT Escapement #91371 (local scheduled mid-run isRunning stall → Skipped). NOT Geneva #91296 (settings.local.json bypassPermissions / Shift+Tab). NOT Carillon #91250 (plugin SessionStart first-wins — campanology-adjacent craft language ONLY; Sheaf/#91250 is a clone — do not ship). NOT Scotch #91324. NOT Pintle #91226 / Fibula #91306 / Virgule #91337 / Riddle #91327 / Garner #91246 / Postern #91223 / Sluice #91265. NOT Quire #91284 (backup). NOT #87203 / #71723 (cite-only). NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler. Product name stays Knell.";
export const FORBIDDEN_IDLE = Object.freeze([
  "honored",
  "discarded",
  "arrested",
  "skipped",
  "indexed",
  "jumped",
  "chocked",
  "rolled",
  "clasped",
  "sprung",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "pooled",
  "cased",
  "aired",
  "sifted",
  "stocked",
  "stationed",
  "marvered",
  "unpinned",
  "rinsed",
  "literal",
  "choked",
]);
export const BANNED_NAMES = Object.freeze([
  "Bell",
  "Toll",
  "Funeral",
  "Spawn",
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Postern",
  "Carillon",
  "Sheaf",
  "Quire",
]);
export const FORBIDDEN_UI = Object.freeze([
  "peal-board",
  "oak belfry",
  "registers three",
  "strikes one",
  "pin-tumbler",
  "keyway",
  "pallet-fork",
  "geneva-drive",
  "maltese-cross",
  "scotch-block",
  "pintle hinge",
  "postern door",
  "escape wheel",
  "balance spring",
  "chapter-ring",
  "oil stone",
  "wagon-scotch",
  "cloak-pin",
  "composing-stick",
  "millrace",
  "woodworking",
  "mm-slider",
  "postern-gate",
  "night bailey",
  "rudder pintle",
  "gudgeon",
  "timber scotch",
  "wagon wheel",
  "iron rail",
  "switchman's hut",
  "bow fibula",
  "catch-plate",
  "cloak fold",
  "type-case",
  "lead sorts",
  "vermilion virgule",
  "wire mesh",
  "ore grit",
  "grain loft",
  "airing hatch",
  "sluice-gate",
  "pool-gauge",
  "plane-table",
  "jeweler's loupe",
  "steel driving pin",
  "shear line",
  "strike plate",
  "pin stacks",
  "ward cuts",
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

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    toolName: "",
    spawnedSuccessfully: null,
    childDead: null,
    noTranscript: null,
    noOutput: null,
    noFailureSignal: null,
    noLog: null,
    listAgentsGhost: null,
    sendMessageQueued: null,
    psOnlyDiscovery: null,
    taskStopRespawn: null,
    customAgentType: null,
    hasClearRepro: null,
    deathSurfaced: null,
    stderrPersisted: null,
    parentNotified: null,
    transcriptWritten: null,
    firstTurnReached: null,
    listAgentsListsDead: null,
    sendMessageNeverDrains: null,
    version: "",
    platform: "",
    agentA: "",
    agentB: "",
    fourOfFour: "",
    reporter: "",
    cousin: "",
    outputText: "",
  };
}

export function seedTolled() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: false,
    noOutput: false,
    noFailureSignal: false,
    noLog: false,
    listAgentsGhost: false,
    sendMessageQueued: false,
    psOnlyDiscovery: false,
    taskStopRespawn: false,
    customAgentType: true,
    hasClearRepro: false,
    deathSurfaced: true,
    stderrPersisted: true,
    parentNotified: true,
    transcriptWritten: true,
    firstTurnReached: false,
    listAgentsListsDead: false,
    sendMessageNeverDrains: false,
    version: VERSION,
    platform: PLATFORM,
    agentA: "",
    agentB: "",
    fourOfFour: "",
    reporter: "",
    cousin: "",
    outputText:
      "tolled; child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive; idle word tolled",
  };
}

export function seedMute() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    noOutput: true,
    noFailureSignal: true,
    noLog: true,
    listAgentsGhost: true,
    sendMessageQueued: true,
    psOnlyDiscovery: true,
    taskStopRespawn: true,
    customAgentType: true,
    hasClearRepro: true,
    deathSurfaced: false,
    stderrPersisted: false,
    parentNotified: false,
    transcriptWritten: false,
    firstTurnReached: false,
    listAgentsListsDead: true,
    sendMessageNeverDrains: true,
    version: VERSION,
    platform: PLATFORM,
    agentA: AGENT_A,
    agentB: AGENT_B,
    fourOfFour: FOUR_OF_FOUR,
    cousin: "",
    outputText:
      "mute; #91298; Spawned successfully; child dead; no transcript; no error; no log; no failure signal; ListAgents ghost; SendMessage queued forever; Message sent to inbox; ps-only discovery; Agent tool; .claude/agents; beads-change-reviewer; write-safety-reviewer; 2.1.246; 4 out of 4; cciordas",
  };
}

export function seedSpawnedOkDead() {
  return {
    seed: "spawned-ok-dead",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    noOutput: true,
    noFailureSignal: true,
    noLog: true,
    deathSurfaced: false,
    parentNotified: false,
    hasClearRepro: true,
    customAgentType: true,
    outputText:
      "spawned-ok-dead; Agent tool returned Spawned successfully; child process exited within seconds-to-minutes",
  };
}

export function seedNoTranscript() {
  return {
    seed: "no-transcript",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    transcriptWritten: false,
    noOutput: true,
    noLog: true,
    deathSurfaced: false,
    hasClearRepro: true,
    outputText:
      "no-transcript; wrote no transcript; no transcripts under ~/.claude/projects/<project>/; first-action output file never appeared",
  };
}

export function seedListagentsGhost() {
  return {
    seed: "listagents-ghost",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    listAgentsGhost: true,
    listAgentsListsDead: true,
    deathSurfaced: false,
    parentNotified: false,
    hasClearRepro: true,
    outputText:
      "listagents-ghost; ListAgents still lists the dead as teammates; dead indistinguishable from busy without ps",
  };
}

export function seedSendmessageQueued() {
  return {
    seed: "sendmessage-queued",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    sendMessageQueued: true,
    sendMessageNeverDrains: true,
    deathSurfaced: false,
    hasClearRepro: true,
    outputText:
      "sendmessage-queued; SendMessage accepted (Message sent to inbox) but never drains; messages queue forever",
  };
}

export function seedNoFailureSignal() {
  return {
    seed: "no-failure-signal",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noFailureSignal: true,
    noLog: true,
    deathSurfaced: false,
    parentNotified: false,
    stderrPersisted: false,
    hasClearRepro: true,
    outputText:
      "no-failure-signal; sent no failure signal; left no log artifact; parent never notified",
  };
}

export function seedPsOnlyDiscovery() {
  return {
    seed: "ps-only-discovery",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    psOnlyDiscovery: true,
    deathSurfaced: false,
    parentNotified: false,
    listAgentsGhost: true,
    hasClearRepro: true,
    outputText:
      "ps-only-discovery; parent discovered deaths only by noticing absence of results and checking ps",
  };
}

export function seedHasClearRepro() {
  return {
    seed: "has-clear-repro",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    noFailureSignal: true,
    listAgentsGhost: true,
    sendMessageQueued: true,
    psOnlyDiscovery: true,
    customAgentType: true,
    hasClearRepro: true,
    deathSurfaced: false,
    reporter: REPORTER,
    version: VERSION,
    platform: PLATFORM,
    agentA: AGENT_A,
    agentB: AGENT_B,
    fourOfFour: FOUR_OF_FOUR,
    outputText:
      "has-clear-repro; cciordas filed #91298; 4 out of 4 on 2.1.246 Linux; beads-change-reviewer / write-safety-reviewer; Agent tool; .claude/agents; has repro",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    toolName: TOOL_NAME,
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: false,
    noOutput: false,
    noFailureSignal: false,
    noLog: false,
    listAgentsGhost: false,
    sendMessageQueued: false,
    psOnlyDiscovery: false,
    hasClearRepro: false,
    deathSurfaced: true,
    stderrPersisted: true,
    parentNotified: true,
    transcriptWritten: true,
    listAgentsListsDead: false,
    sendMessageNeverDrains: false,
    outputText:
      "hold; child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive; the knell is tolled",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "87203",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #87203 cloud ultrareview agents terminated — cite; not the #91298 Agent tool Spawned successfully mute death-knell",
  };
}

export function emptyTicket() {
  return seedTolled();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.knell && typeof src.knell === "object" && src.knell) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.bell && typeof src.bell === "object" && src.bell) ||
    (src.chamber && typeof src.chamber === "object" && src.chamber) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    source: firstText(nested.source, src.source),
    toolName: firstText(nested.toolName, nested.tool_name, src.toolName),
    spawnedSuccessfully: firstBool(
      nested.spawnedSuccessfully,
      nested.spawned_successfully,
      src.spawnedSuccessfully,
    ),
    childDead: firstBool(nested.childDead, nested.child_dead, nested.childDied, src.childDead),
    noTranscript: firstBool(
      nested.noTranscript,
      nested.no_transcript,
      src.noTranscript,
    ),
    noOutput: firstBool(nested.noOutput, nested.no_output, src.noOutput),
    noFailureSignal: firstBool(
      nested.noFailureSignal,
      nested.no_failure_signal,
      src.noFailureSignal,
    ),
    noLog: firstBool(nested.noLog, nested.no_log, src.noLog),
    listAgentsGhost: firstBool(
      nested.listAgentsGhost,
      nested.list_agents_ghost,
      src.listAgentsGhost,
    ),
    sendMessageQueued: firstBool(
      nested.sendMessageQueued,
      nested.send_message_queued,
      src.sendMessageQueued,
    ),
    psOnlyDiscovery: firstBool(
      nested.psOnlyDiscovery,
      nested.ps_only_discovery,
      src.psOnlyDiscovery,
    ),
    taskStopRespawn: firstBool(
      nested.taskStopRespawn,
      nested.task_stop_respawn,
      src.taskStopRespawn,
    ),
    customAgentType: firstBool(
      nested.customAgentType,
      nested.custom_agent_type,
      src.customAgentType,
    ),
    hasClearRepro: firstBool(
      nested.hasClearRepro,
      nested.has_clear_repro,
      src.hasClearRepro,
    ),
    deathSurfaced: firstBool(
      nested.deathSurfaced,
      nested.death_surfaced,
      src.deathSurfaced,
    ),
    stderrPersisted: firstBool(
      nested.stderrPersisted,
      nested.stderr_persisted,
      src.stderrPersisted,
    ),
    parentNotified: firstBool(
      nested.parentNotified,
      nested.parent_notified,
      src.parentNotified,
    ),
    transcriptWritten: firstBool(
      nested.transcriptWritten,
      nested.transcript_written,
      src.transcriptWritten,
    ),
    firstTurnReached: firstBool(
      nested.firstTurnReached,
      nested.first_turn_reached,
      src.firstTurnReached,
    ),
    listAgentsListsDead: firstBool(
      nested.listAgentsListsDead,
      nested.list_agents_lists_dead,
      src.listAgentsListsDead,
    ),
    sendMessageNeverDrains: firstBool(
      nested.sendMessageNeverDrains,
      nested.send_message_never_drains,
      src.sendMessageNeverDrains,
    ),
    version: firstText(nested.version, src.version),
    platform: firstText(nested.platform, src.platform),
    agentA: firstText(nested.agentA, nested.agent_a, src.agentA),
    agentB: firstText(nested.agentB, nested.agent_b, src.agentB),
    fourOfFour: firstText(nested.fourOfFour, nested.four_of_four, src.fourOfFour),
    cousin: firstText(nested.cousin, src.cousin),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (Array.isArray(value)) {
      if (value.length) out[key] = value;
      continue;
    }
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.spawnedSuccessfully == null &&
    row.childDead == null &&
    row.noTranscript == null &&
    row.noFailureSignal == null &&
    row.listAgentsGhost == null &&
    row.sendMessageQueued == null &&
    row.psOnlyDiscovery == null &&
    row.deathSurfaced == null &&
    row.parentNotified == null &&
    row.stderrPersisted == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedTolled,
  [SEEDED_WORD]: seedMute,
  "spawned-ok-dead": seedSpawnedOkDead,
  "no-transcript": seedNoTranscript,
  "listagents-ghost": seedListagentsGhost,
  "sendmessage-queued": seedSendmessageQueued,
  "no-failure-signal": seedNoFailureSignal,
  "ps-only-discovery": seedPsOnlyDiscovery,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  87203: seedCousin,
};

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedMute(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.cousin,
    ticket.seed,
    ticket.toolName,
    ticket.agentA,
    ticket.agentB,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isTolled(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.deathSurfaced === true &&
    row.stderrPersisted === true &&
    row.parentNotified === true &&
    row.listAgentsGhost !== true
  ) {
    return true;
  }
  return false;
}

export function isMute(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.spawnedSuccessfully === true &&
      row.childDead === true &&
      row.deathSurfaced !== true) ||
    row.noFailureSignal === true ||
    row.listAgentsGhost === true ||
    row.psOnlyDiscovery === true
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#87203|#71723|#88849|#83366|#86129/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const muteNow = !cousinOnly && isMute(row);
  const tolledNow = !muteNow && isTolled(row);
  const spawnedOkDead =
    row.spawnedSuccessfully === true ||
    named === "spawned-ok-dead" ||
    /spawned-ok-dead|Spawned successfully/i.test(text);
  const noTranscript =
    row.noTranscript === true ||
    named === "no-transcript" ||
    /no-transcript|no transcript|wrote no transcript/i.test(text);
  const listAgentsGhost =
    row.listAgentsGhost === true ||
    row.listAgentsListsDead === true ||
    named === "listagents-ghost" ||
    /listagents-ghost|ListAgents/i.test(text);
  const sendMessageQueued =
    row.sendMessageQueued === true ||
    row.sendMessageNeverDrains === true ||
    named === "sendmessage-queued" ||
    /sendmessage-queued|SendMessage|Message sent to inbox/i.test(text);
  const noFailureSignal =
    row.noFailureSignal === true ||
    named === "no-failure-signal" ||
    /no-failure-signal|no failure signal/i.test(text);
  const psOnlyDiscovery =
    row.psOnlyDiscovery === true ||
    named === "ps-only-discovery" ||
    /ps-only-discovery|checking ps|\bps\b/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|cciordas|2\.1\.246|beads-change-reviewer|4 out of 4/i.test(
      text,
    );
  const mute =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (muteNow || named === SEEDED_WORD || /mute|#91298/i.test(text));
  const tolled =
    named === IDLE_WORD || named === "hold" || (tolledNow && !mute);
  return {
    named,
    cousinOnly,
    muteNow,
    tolledNow,
    spawnedOkDead,
    noTranscript,
    listAgentsGhost,
    sendMessageQueued,
    noFailureSignal,
    psOnlyDiscovery,
    hasClearRepro,
    mute,
    tolled,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.tolled && !flags.mute) chips.push("tolled");
  if (flags.mute) chips.push("mute");
  if (flags.spawnedOkDead && flags.mute) chips.push("spawned-ok-dead");
  if (flags.noTranscript && flags.mute) chips.push("no-transcript");
  if (flags.listAgentsGhost && flags.mute) chips.push("listagents-ghost");
  if (flags.sendMessageQueued && flags.mute) chips.push("sendmessage-queued");
  if (flags.noFailureSignal && flags.mute) chips.push("no-failure-signal");
  if (flags.psOnlyDiscovery && flags.mute) chips.push("ps-only-discovery");
  if (flags.hasClearRepro && flags.mute) chips.push("has-clear-repro");
  if ((flags.tolled || flags.named === "hold") && !flags.mute) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "tolled") {
    reasons.push(
      "tolled; child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive",
    );
    reasons.push(
      "hold: the knell is tolled; score treats a surfaced child death as a hold",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive; the knell is tolled",
    );
  }
  if (verdict === "mute" || flags.mute) {
    reasons.push(
      "mute; #91298; Spawned successfully; child dead; no transcript; no error; no log; ListAgents ghost; SendMessage queued forever; ps-only discovery",
    );
  }
  if (flags.spawnedOkDead || verdict === "spawned-ok-dead") {
    reasons.push(
      `spawned-ok-dead; ${TOOL_NAME} tool returned ${SPAWNED_OK}; child process exited within seconds-to-minutes`,
    );
  }
  if (flags.noTranscript || verdict === "no-transcript") {
    reasons.push(
      "no-transcript; wrote no transcript; no transcripts under ~/.claude/projects/<project>/; first-action output file never appeared",
    );
  }
  if (flags.listAgentsGhost || verdict === "listagents-ghost") {
    reasons.push(
      `listagents-ghost; ${LIST_AGENTS} still lists the dead as teammates; dead indistinguishable from busy without ps`,
    );
  }
  if (flags.sendMessageQueued || verdict === "sendmessage-queued") {
    reasons.push(
      `sendmessage-queued; ${SEND_MESSAGE} accepted (${SEND_INBOX}) but never drains; messages queue forever`,
    );
  }
  if (flags.noFailureSignal || verdict === "no-failure-signal") {
    reasons.push(
      "no-failure-signal; sent no failure signal; left no log artifact; parent never notified",
    );
  }
  if (flags.psOnlyDiscovery || verdict === "ps-only-discovery") {
    reasons.push(
      "ps-only-discovery; parent discovered deaths only by noticing absence of results and checking ps",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; ${FOUR_OF_FOUR} on ${VERSION} ${PLATFORM}; ${AGENT_A} / ${AGENT_B}; ${TOOL_NAME} tool; ${AGENTS_DIR}`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Knell; cite-only #87203 cloud ultrareview / #71723 Agent tool name→teammate / #88849 / #83366 / #86129, not the Agent tool Spawned successfully mute death-knell",
    );
  }
  if (verdict === "mute" || flags.mute) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "tolled" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.tolled || !flags.mute)) return "tolled";
  if (named === "hold" && !flags.mute) return "hold";
  if (named === SEEDED_WORD) return "mute";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "tolled";
  if (flags.mute) return "mute";
  if (flags.tolled) return "tolled";
  return "tolled";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "mute" || flags.mute) {
    return {
      case: "mute — bronze knell hangs still; child died before first turn",
      rope: "untolled rope slack; Spawned successfully; no transcript",
      clapper: `${TOOL_NAME} ${SPAWNED_OK} · child dead · ${LIST_AGENTS} ghost`,
      chamber: "empty chamber; SendMessage queued; ps-only discovery",
      mark: "mourning ribbon; the knell never tolled",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "tolled — child death surfaced; stderr/exit persisted",
      rope: "rope drawn; parent notified; ListAgents does not list dead",
      clapper: "stderr/exit persisted · parent notified · first-turn death surfaced",
      chamber: "chamber records the death; the knell is tolled",
      mark: "mourning ribbon drawn; the knell is tolled",
      note: "Hold: the knell is tolled.",
    };
  }
  return {
    case: "tolled — child death surfaced; parent notified",
    rope: "rope drawn; no mute spawn",
    clapper: "stderr/exit persisted · ListAgents does not list dead as alive",
    chamber: "chamber records the death; atelier quiet",
    mark: "mourning ribbon drawn; idle word tolled",
    note: "Tolled: the knell holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const mute = verdict === "mute" || flags.mute;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    tolled: verdict === "tolled" || (flags.tolled && !mute),
    mute,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: chamberOf(flags, ticket, verdict),
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 91298 || name === "91298") {
    return analyze(seedMute());
  }
  if (name === "spawned-ok-dead") return analyze(seedSpawnedOkDead());
  if (name === "no-transcript") return analyze(seedNoTranscript());
  if (name === "listagents-ghost") return analyze(seedListagentsGhost());
  if (name === "sendmessage-queued") return analyze(seedSendmessageQueued());
  if (name === "no-failure-signal") return analyze(seedNoFailureSignal());
  if (name === "ps-only-discovery") return analyze(seedPsOnlyDiscovery());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "tolled" || name === "open") {
    return analyze(seedTolled());
  }
  if (name === 87203 || name === "87203" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedTolled());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "mute" || (result.mute && result.alarm)
          ? `mute knell #${FEATURED_ISSUE}: ${TOOL_NAME} ${SPAWNED_OK}; child dead; no transcript; ${LIST_AGENTS} ghost; ${SEND_MESSAGE} queued. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Child death surfaced. Score the mute."
            : `tolled knell. Idle word ${IDLE_WORD}. Child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
