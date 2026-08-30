#!/usr/bin/env node
/**
 * Limpet — tide-pool pry-desk scorer.
 * A session marked done that still
 * clamps the rock is not a hold.
 * Pry the shell or admit shed.
 *
 *   echo '{"stopReason":"end_turn","sessionDone":true,"processResident":true}' | node limpet.mjs
 *   node limpet.mjs ticket.json
 *
 * Idle word is shed.
 * Seeded state is clamped / #89275.
 *
 * Primary #89275: scheduled-task session
 * completes; OS process never exits.
 * 41 leaked pairs / 82 procs / 3.08 GB
 * RSS / load 82 on a 16 GB Mac.
 *
 * CLAMPED if end_turn / session done
 * AND process still resident.
 * SHED if the pool is clear.
 * REAPED if a reaper already pried
 * the shells off the rock.
 *
 * NOT Almanac (one-shot Loop ghost).
 * NOT Kindling (WarmLifecycle identity).
 * NOT Reveille (heartbeat muster).
 * NOT Fusee (early cron dispatch).
 * NOT Sprag (MCP attach at boot).
 * NOT Reed (four MCP contacts).
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "shed",
  "clamped",
  "paired",
  "stacked",
  "bloated",
  "idle-after-end",
  "end-turn-held",
  "resume-stuck",
  "mcp-child",
  "reaped",
  "windows-resume",
  "macos-pair",
]);
export const IDLE_WORD = "shed";
export const ALARM_VERDICTS = Object.freeze([
  "clamped",
  "paired",
  "stacked",
  "bloated",
  "idle-after-end",
  "end-turn-held",
  "resume-stuck",
  "mcp-child",
  "windows-resume",
  "macos-pair",
]);
export const HOLD_VERDICTS = Object.freeze(["shed", "reaped"]);
export const CHIPS = Object.freeze([
  "clamped",
  "paired",
  "stacked",
  "bloated",
  "idle-after-end",
  "end-turn-held",
  "resume-stuck",
  "mcp-child",
  "reaped",
  "windows-resume",
  "macos-pair",
]);
export const FEATURED_ISSUE = 89275;
export const PRIMARY_ISSUES = Object.freeze([89275, 88918, 68626]);
export const CORROBORATORS = Object.freeze([89881, 88982, 72308, 74633, 89499, 71424, 89639]);
export const PAIRS = 41;
export const PROCESSES = 82;
export const RSS_GB = 3.08;
export const LOAD = 82;
export const HOURS = 10;
export const CRON = "*/15 * * * *";
export const VERSION = "2.1.237";
export const DESKTOP = "1.34493.1";
export const FILED_AT = "2026-08-24T16:48:02Z";
export const PLATFORM = "macos";
export const REAPER_FINGERPRINT = "--disallowedTools AskUserQuestion";

const END_TURN_RE = /end[_-]?turn/i;
const DONE_RE = /done|idle|finished|success/i;

export function emptyTicket() {
  return seedClamped();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.limpet && typeof src.limpet === "object" && src.limpet) ||
    (src.leak && typeof src.leak === "object" && src.leak) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  const session = nested.session && typeof nested.session === "object" ? nested.session : {};
  const process = nested.process && typeof nested.process === "object" ? nested.process : {};
  const parent = nested.parent && typeof nested.parent === "object" ? nested.parent : {};
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    stopReason: firstText(
      nested.stopReason,
      nested.stop_reason,
      session.stopReason,
      session.stop_reason,
    ),
    sessionDone: firstBool(nested.sessionDone, nested.uiDone, session.done, session.sessionDone),
    uiDone: firstBool(nested.uiDone, session.uiDone),
    isRunning: firstBool(nested.isRunning, session.isRunning),
    processResident: firstBool(
      nested.processResident,
      nested.resident,
      process.resident,
      process.alive,
    ),
    resident: firstBool(nested.resident, process.resident),
    pair: firstBool(nested.pair, nested.paired, process.pair, parent.alive),
    parentResident: firstBool(nested.parentResident, parent.resident, parent.alive),
    pairCount: firstNum(nested.pairCount, nested.pairs, process.pairs),
    processCount: firstNum(nested.processCount, process.count, nested.procs),
    rssGb: firstNum(nested.rssGb, nested.rssGB, process.rssGb, nested.rss),
    rssGrowth: firstBool(nested.rssGrowth, process.rssGrowth),
    load: firstNum(nested.load, process.load),
    cronCadence: firstText(nested.cronCadence, nested.cron, session.cron),
    hours: firstNum(nested.hours, nested.elapsedHours),
    resume: firstBool(nested.resume, nested.resumeFlag, process.resume),
    resumeFlag: firstBool(nested.resumeFlag, process.resumeFlag),
    argv: firstText(nested.argv, process.argv, nested.commandLine),
    mcpChildren: firstNum(nested.mcpChildren, process.mcpChildren, nested.mcp),
    reaped: firstBool(nested.reaped, process.reaped),
    platform: firstText(nested.platform, process.platform) || "",
    version: firstText(nested.version, process.version),
    desktop: firstText(nested.desktop, nested.app),
    reaperFingerprint: firstText(nested.reaperFingerprint, process.reaperFingerprint),
    session,
    process,
    parent,
  };
}

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

export function hasEndTurn(ticket) {
  const row = cloneTicket(ticket);
  return END_TURN_RE.test(row.stopReason || "");
}

export function sessionIsDone(ticket) {
  const row = cloneTicket(ticket);
  if (row.sessionDone === true || row.uiDone === true) return true;
  if (row.isRunning === false) return true;
  if (hasEndTurn(row)) return true;
  if (DONE_RE.test(row.session?.state || "") && row.isRunning !== true) return true;
  return false;
}

export function processIsResident(ticket) {
  const row = cloneTicket(ticket);
  if (row.reaped === true) return false;
  if (row.processResident === true || row.resident === true) return true;
  if (row.parentResident === true) return true;
  if (row.pairCount != null && row.pairCount > 0 && row.processResident !== false) return true;
  if (row.processCount != null && row.processCount > 0 && row.processResident !== false) {
    return true;
  }
  return false;
}

export function hasPair(ticket) {
  const row = cloneTicket(ticket);
  return row.pair === true || row.parentResident === true || (row.pairCount != null && row.pairCount > 0);
}

export function hasResume(ticket) {
  const row = cloneTicket(ticket);
  if (row.resume === true || row.resumeFlag === true) return true;
  return /--resume/i.test(row.argv || "");
}

export function analyze(input) {
  const row = cloneTicket(input);
  const ended = sessionIsDone(row);
  const resident = processIsResident(row);
  const pair = hasPair(row);
  const resume = hasResume(row);
  const endTurn = hasEndTurn(row);
  const stacked = (row.pairCount != null && row.pairCount >= 10) || (row.processCount != null && row.processCount >= 20);
  const bloated =
    row.rssGrowth === true ||
    (row.rssGb != null && row.rssGb >= 1) ||
    (row.load != null && row.load >= 20);
  const mcp = row.mcpChildren != null && row.mcpChildren > 0;
  const windows = /win/i.test(row.platform);
  const macos = /mac/i.test(row.platform);
  const featured =
    row.issue === FEATURED_ISSUE &&
    (row.pairCount === PAIRS || row.processCount === PROCESSES || row.load === LOAD);
  const chips = [];
  if (ended && resident) chips.push("clamped", "idle-after-end");
  if (endTurn && resident) chips.push("end-turn-held");
  if (pair && resident) chips.push("paired");
  if (stacked && resident) chips.push("stacked");
  if (bloated && resident) chips.push("bloated");
  if (resume && resident) chips.push("resume-stuck");
  if (mcp && (resident || ended)) chips.push("mcp-child");
  if (row.reaped === true && !resident) chips.push("reaped");
  if (windows && resume && resident) chips.push("windows-resume");
  if (macos && pair && resident) chips.push("macos-pair");
  return {
    row,
    ended,
    resident,
    pair,
    resume,
    endTurn,
    stacked,
    bloated,
    mcp,
    windows,
    macos,
    featured,
    leak: ended && resident,
    chips: [...new Set(chips)],
  };
}

export function classify(input) {
  const facts = analyze(input);
  const seed = String(facts.row.seed || "").toLowerCase();
  if (facts.row.reaped === true && !facts.resident) return "reaped";
  if (!facts.resident) return "shed";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.featured) return "clamped";
  if (facts.windows && facts.resume && facts.leak) return "windows-resume";
  if (facts.mcp && facts.leak) return "mcp-child";
  if (facts.macos && facts.pair && facts.leak && !facts.stacked) return "macos-pair";
  if (facts.resume && facts.leak) return "resume-stuck";
  if (facts.bloated && facts.leak && facts.stacked) return "bloated";
  if (facts.stacked && facts.leak) return "stacked";
  if (facts.pair && facts.leak && !facts.featured) return "paired";
  if (facts.endTurn && facts.resident) return "end-turn-held";
  if (facts.ended && facts.resident) return "idle-after-end";
  if (facts.leak) return "clamped";
  return "shed";
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
    shed: verdict === "shed",
    clamped: !hold,
    paired: verdict === "paired" || facts.pair,
    stacked: verdict === "stacked" || facts.stacked,
    bloated: verdict === "bloated" || facts.bloated,
    reaped: verdict === "reaped",
    hold,
    alarm: !hold,
    fresh: hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      ended: facts.ended,
      resident: facts.resident,
      pair: facts.pair,
      resume: facts.resume,
      endTurn: facts.endTurn,
      stacked: facts.stacked,
      bloated: facts.bloated,
      mcp: facts.mcp,
      leak: facts.leak,
      pairCount: facts.row.pairCount,
      processCount: facts.row.processCount,
      rssGb: facts.row.rssGb,
      load: facts.row.load,
      platform: facts.row.platform,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "shed") {
    return "● Shed · pool clear; no clamped shells · hold";
  }
  if (kind === "reaped") {
    return "● Reaped · a reaper already pried the workers off the rock · hold";
  }
  if (kind === "windows-resume") {
    return "● Windows-resume · headless claude.exe --resume still resident after the turn · leak";
  }
  if (kind === "macos-pair") {
    return "● macOS-pair · disclaimer parent + claude child still clamped after end_turn · leak";
  }
  if (kind === "mcp-child") {
    return "● MCP-child · stdio children survived the scheduled end · leak";
  }
  if (kind === "resume-stuck") {
    return "● Resume-stuck · --resume worker finished work and never exited · leak";
  }
  if (kind === "bloated") {
    return "● Bloated · RSS / load grew after a finished turn · leak";
  }
  if (kind === "stacked") {
    return "● Stacked · cron re-fired; shells accumulated on the rock · leak";
  }
  if (kind === "paired") {
    return "● Paired · parent + worker pair still resident after session done · leak";
  }
  if (kind === "end-turn-held") {
    return "● End-turn-held · stop_reason end_turn, process still resident · leak";
  }
  if (kind === "idle-after-end") {
    return "● Idle-after-end · UI marked the session done; OS process stayed · leak";
  }
  return "● Clamped · end_turn / session done + process still resident · leak";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "shed") {
    reasons.push("pool clear; no resident worker after the turn");
  }
  if (kind === "reaped") {
    reasons.push("reaper fingerprint already cleared the rock");
  }
  if (facts.leak || !HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#89275 scheduled-task session completed successfully but the OS process never exits",
    );
  }
  if (facts.endTurn) reasons.push("stop_reason: end_turn");
  if (facts.ended) reasons.push("session marked done / idle in the UI");
  if (facts.resident) reasons.push("headless claude / claude.exe worker still resident");
  if (facts.pair) reasons.push("parent pair still alive (disclaimer + claude)");
  if (facts.row.pairCount != null) {
    reasons.push(`${facts.row.pairCount} leaked pairs`);
  }
  if (facts.row.processCount != null) {
    reasons.push(`${facts.row.processCount} processes`);
  }
  if (facts.row.rssGb != null) reasons.push(`${facts.row.rssGb} GB RSS`);
  if (facts.row.load != null) reasons.push(`load ${facts.row.load}`);
  if (facts.row.cronCadence) reasons.push(`cron ${facts.row.cronCadence}`);
  if (facts.resume) reasons.push("--resume worker never exited");
  if (facts.mcp) reasons.push(`${facts.row.mcpChildren} MCP children survived the end`);
  if (facts.windows) reasons.push("windows-resume path");
  if (facts.macos && facts.pair) reasons.push("macos-pair path");
  return reasons;
}

export function seedClamped() {
  return {
    seed: "clamped",
    issue: FEATURED_ISSUE,
    stopReason: "end_turn",
    sessionDone: true,
    uiDone: true,
    isRunning: false,
    processResident: true,
    pair: true,
    parentResident: true,
    pairCount: PAIRS,
    processCount: PROCESSES,
    rssGb: RSS_GB,
    rssGrowth: true,
    load: LOAD,
    cronCadence: CRON,
    hours: HOURS,
    resume: false,
    mcpChildren: 0,
    reaped: false,
    platform: PLATFORM,
    version: VERSION,
    desktop: DESKTOP,
    reaperFingerprint: REAPER_FINGERPRINT,
    session: {
      state: "done (success)",
      isRunning: false,
      stopReason: "end_turn",
    },
    process: {
      comm: "claude",
      resident: true,
      pairs: PAIRS,
      count: PROCESSES,
      rssGb: RSS_GB,
      load: LOAD,
    },
    parent: {
      comm: "disclaimer",
      alive: true,
      resident: true,
    },
  };
}

export function seedShed() {
  return {
    seed: "shed",
    issue: FEATURED_ISSUE,
    stopReason: "end_turn",
    sessionDone: true,
    uiDone: true,
    isRunning: false,
    processResident: false,
    pair: false,
    parentResident: false,
    pairCount: 0,
    processCount: 0,
    rssGb: 0,
    load: 1,
    cronCadence: CRON,
    reaped: false,
    platform: PLATFORM,
    version: VERSION,
  };
}

export function seedReaped() {
  return {
    seed: "reaped",
    issue: 68626,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: false,
    pairCount: 0,
    processCount: 0,
    rssGb: 0,
    reaped: true,
    platform: "windows",
    argv: "claude.exe --resume --output-format stream-json --disallowedTools AskUserQuestion",
    reaperFingerprint: REAPER_FINGERPRINT,
  };
}

export function seedPaired() {
  return {
    seed: "paired",
    issue: 88918,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pair: true,
    parentResident: true,
    pairCount: 1,
    processCount: 2,
    rssGb: 0.22,
    platform: "macos",
    version: "2.1.237",
  };
}

export function seedStacked() {
  return {
    seed: "stacked",
    issue: 89275,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pair: true,
    pairCount: 41,
    processCount: 82,
    rssGb: 3.08,
    load: 82,
    cronCadence: CRON,
    platform: "macos",
  };
}

export function seedBloated() {
  return {
    seed: "bloated",
    issue: 88918,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pair: true,
    pairCount: 36,
    processCount: 72,
    rssGb: 16,
    rssGrowth: true,
    load: 40,
    cronCadence: "0 * * * *",
    platform: "macos",
  };
}

export function seedIdleAfterEnd() {
  return {
    seed: "idle-after-end",
    issue: 89275,
    sessionDone: true,
    uiDone: true,
    isRunning: false,
    processResident: true,
    pairCount: 2,
    processCount: 4,
    platform: "macos",
  };
}

export function seedEndTurnHeld() {
  return {
    seed: "end-turn-held",
    issue: 88918,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pairCount: 1,
    processCount: 2,
    platform: "macos",
  };
}

export function seedResumeStuck() {
  return {
    seed: "resume-stuck",
    issue: 68626,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    resume: true,
    argv: "claude --resume --output-format stream-json",
    pairCount: 8,
    processCount: 8,
    platform: "macos",
  };
}

export function seedMcpChild() {
  return {
    seed: "mcp-child",
    issue: 89499,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    mcpChildren: 54,
    pairCount: 1,
    platform: "windows",
  };
}

export function seedWindowsResume() {
  return {
    seed: "windows-resume",
    issue: 68626,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    resume: true,
    argv: "claude.exe --resume --output-format stream-json --disallowedTools AskUserQuestion",
    pairCount: 65,
    processCount: 65,
    rssGb: 5.8,
    platform: "windows",
    version: "2.1.170",
    reaperFingerprint: REAPER_FINGERPRINT,
  };
}

export function seedMacosPair() {
  return {
    seed: "macos-pair",
    issue: 88918,
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pair: true,
    parentResident: true,
    pairCount: 1,
    processCount: 2,
    rssGb: 0.22,
    platform: "macos",
    version: "2.1.237",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const seeds = {
    clamped: seedClamped,
    shed: seedShed,
    reaped: seedReaped,
    paired: seedPaired,
    stacked: seedStacked,
    bloated: seedBloated,
    "idle-after-end": seedIdleAfterEnd,
    "end-turn-held": seedEndTurnHeld,
    "resume-stuck": seedResumeStuck,
    "mcp-child": seedMcpChild,
    "windows-resume": seedWindowsResume,
    "macos-pair": seedMacosPair,
  };
  const fn = seeds[key];
  return score(fn ? fn() : seedClamped());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.limpet?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket =
    payload.ticket || payload.limpet || payload.leak || payload.probe || payload;
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
        ? "Limpet clamped. A session marked done that still clamps the rock is not a hold. #89275 OS process leak after end_turn."
        : result.verdict === "reaped"
          ? "Limpet reaped. The reaper already pried the workers off the rock."
          : "Limpet shed. Pool clear; no clamped shells.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedClamped();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.limpet || parsed.leak || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedClamped();
  }
  return seedClamped();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedClamped());
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
