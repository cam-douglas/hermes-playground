#!/usr/bin/env node
/**
 * Remora — hull-clinging remora / process-tree sounding bench.
 *
 * Models parent-exit vs child-hold timing for a published Windows
 * PostToolUse stall. Educational diagnostic only — not an attack.
 *
 *   node remora.mjs ../data/92934.json
 *   echo '{"seed":"clung","childHolds":true}' | node remora.mjs
 *
 * Idle word is loosed (HOLD: tool_result delivered when the
 * configured hook process exits; no descendant grip).
 * #92934 path is clung (parent hook exited 0; persistent redirected
 * child still delays result ~90s).
 * Seeded recovery is rehitched (async:true / process-tree detach).
 *
 * Encoded from anthropics/claude-code#92934 issue body only.
 * Hypothesis (NON-BINDING): Job Objects / process-group wait may
 * keep the sync PostToolUse path open on a redirected descendant
 * after the configured hook already exited 0. Invite verify against
 * #92934 text only — the issue does not establish the internal
 * mechanism. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "loosed",
  "clung",
  "rehitched",
  "parent-exited",
  "child-holds",
  "redirected-stdio",
  "sync-stall",
  "async-bypass",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "loosed";
export const SEEDED_WORD = "clung";
export const RECOVERY_WORD = "rehitched";
export const HOLD = Object.freeze(["loosed"]);
export const RECOVER = Object.freeze(["rehitched", "async-bypass"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "loosed"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "intact",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
]);
export const FORBIDDEN_SEED = Object.freeze([
  "relisted",
  "regranted",
  "misbound",
  "fouled",
  "escheated",
]);

export const FEATURED_ISSUE = 92934;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92934";
export const TITLE =
  "Windows: synchronous PostToolUse delays tool results until a persistent child exits";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:hooks",
]);
export const VERSION = "2.1.263";
export const OS_NAME = "Windows 11 Pro 10.0.26100";
export const SURFACE = "Interactive CLI";
export const REPORTER = "simon-bauer-sonarsource";
export const FILED_AT = "2026-09-08T20:56:20Z";
export const TOOL_USE_ID = "call_JDUVNrA2A9kA9qxZ48LWiZz9";
export const TOOL_DISPATCH_MS = 925;
export const POST_TOOL_USE_WAIT_MS = 91931;
export const CHILD_SLEEP_MS = 90000;
export const HOOK_TIMEOUT_S = 120;
export const SLOW_HOOK_LOG =
  "Slow PostToolUse hooks: 91931ms for PowerShell (1 hooks)";
export const HARMLESS_TOOL = "Get-Date -Format o";
export const COUSINS = Object.freeze([
  {
    issue: 90049,
    product: "Deadletter",
    citeOnly: true,
    why: "does not require EnterWorktree; bounded wait rather than worktree-transition result-loss",
  },
]);
export const NOT_PRODUCTS = Object.freeze([
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "dryjoint",
  "dinkus",
  "homonym",
  "rushlight",
  "clepsydra",
  "letoff",
  "springe",
]);

export const PUBLISHED = Object.freeze({
  tool: "PowerShell",
  matcher: "PowerShell",
  hook: "C:\\temp\\hook.ps1",
  child: "C:\\temp\\child.ps1",
  childScript: "Start-Sleep -Seconds 90",
  redirects: Object.freeze({
    stdin: "C:\\temp\\in.txt",
    stdout: "C:\\temp\\out.txt",
    stderr: "C:\\temp\\err.txt",
  }),
  stall: Object.freeze({
    tool_dispatch_end: `tool=PowerShell toolUseId=${TOOL_USE_ID} outcome=ok durationMs=${TOOL_DISPATCH_MS}`,
    slowHook: SLOW_HOOK_LOG,
  }),
});

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    loosed: true,
    clung: false,
    rehitched: false,
    parentExited: true,
    childHolds: false,
    redirectedStdio: false,
    syncStall: false,
    asyncBypass: false,
    parentExitMs: 0,
    childHoldMs: 0,
    toolDispatchMs: TOOL_DISPATCH_MS,
    postToolUseWaitMs: 0,
  };
}

export function seedLoosed() {
  return { ...emptyTicket() };
}

export function seedClung() {
  return {
    seed: SEEDED_WORD,
    loosed: false,
    clung: true,
    rehitched: false,
    parentExited: true,
    childHolds: true,
    redirectedStdio: true,
    syncStall: true,
    asyncBypass: false,
    parentExitMs: 0,
    childHoldMs: CHILD_SLEEP_MS,
    toolDispatchMs: TOOL_DISPATCH_MS,
    postToolUseWaitMs: POST_TOOL_USE_WAIT_MS,
    toolUseId: TOOL_USE_ID,
  };
}

export function seedRehitched() {
  return {
    seed: RECOVERY_WORD,
    loosed: true,
    clung: false,
    rehitched: true,
    parentExited: true,
    childHolds: true,
    redirectedStdio: true,
    syncStall: false,
    asyncBypass: true,
    async: true,
    parentExitMs: 0,
    childHoldMs: CHILD_SLEEP_MS,
    toolDispatchMs: TOOL_DISPATCH_MS,
    postToolUseWaitMs: 0,
  };
}

export function normalize(input) {
  if (input == null || input === "") return emptyTicket();
  if (typeof input === "string") {
    const text = input.trim();
    if (!text) return emptyTicket();
    try {
      return normalize(JSON.parse(text));
    } catch {
      const lower = text.toLowerCase();
      if (VERDICTS.includes(lower)) return { seed: lower };
      return emptyTicket();
    }
  }
  if (typeof input !== "object") return emptyTicket();
  return { ...input };
}

export function modelTiming(probe) {
  const ticket = normalize(probe);
  const asyncBypass =
    ticket.async === true ||
    ticket.asyncBypass === true ||
    ticket.rehitched === true ||
    ticket.seed === "rehitched" ||
    ticket.seed === "async-bypass";
  const childHolds =
    ticket.childHolds === true ||
    Number(ticket.childHoldMs) > 0 ||
    Number(ticket.postToolUseWaitMs) > 1000;
  const parentExited = ticket.parentExited !== false;
  return {
    parentExited,
    childHolds,
    asyncBypass,
    parentExitMs: Number(ticket.parentExitMs) || 0,
    childHoldMs: Number(ticket.childHoldMs) || (childHolds ? CHILD_SLEEP_MS : 0),
    toolDispatchMs: Number(ticket.toolDispatchMs) || TOOL_DISPATCH_MS,
    postToolUseWaitMs: asyncBypass
      ? 0
      : Number(ticket.postToolUseWaitMs) ||
        (childHolds ? POST_TOOL_USE_WAIT_MS : 0),
  };
}

export function decideSeed(ticket) {
  const seed = typeof ticket.seed === "string" ? ticket.seed : "";
  if (VERDICTS.includes(seed)) return seed;
  return "";
}

export function classify(input) {
  const ticket = normalize(input);
  const seeded = decideSeed(ticket);
  if (seeded) return seeded;
  const timing = modelTiming(ticket);
  if (timing.asyncBypass) return RECOVERY_WORD;
  if (ticket.clung === true || (timing.parentExited && timing.childHolds)) {
    return SEEDED_WORD;
  }
  if (ticket.loosed === true || (!timing.childHolds && timing.parentExited)) {
    return IDLE_WORD;
  }
  return IDLE_WORD;
}

export function decide(input) {
  return classify(input);
}

export function chipsOf(verdict) {
  const timing = modelTiming({ seed: verdict });
  const chips = [verdict];
  if (verdict === IDLE_WORD) return [IDLE_WORD];
  if (verdict === "clung" || verdict === "92934") {
    return [
      "clung",
      "parent-exited",
      "child-holds",
      "redirected-stdio",
      "sync-stall",
    ];
  }
  if (verdict === "rehitched" || verdict === "async-bypass") {
    return ["rehitched", "async-bypass", "parent-exited"];
  }
  if (verdict === "cousins") return ["cousins", "clung"];
  if (verdict === "before-after") {
    return ["before-after", "clung", "rehitched"];
  }
  if (verdict === "fixtures") return ["fixtures", ...VERDICTS];
  if (timing.asyncBypass) chips.push("rehitched", "async-bypass");
  if (timing.parentExited && verdict !== IDLE_WORD) chips.push("parent-exited");
  if (timing.childHolds && verdict !== IDLE_WORD) chips.push("child-holds");
  return [...new Set(chips)];
}

export function analyze(input) {
  const ticket = normalize(input);
  const verdict = classify(ticket);
  const timing = modelTiming({ ...ticket, seed: verdict });
  const hold = HOLD.includes(verdict);
  const recover = RECOVER.includes(verdict);
  const alarm = !hold;
  return {
    verdict,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    recoveryWord: RECOVERY_WORD,
    hold,
    recover,
    alarm,
    loosed: verdict === IDLE_WORD || timing.asyncBypass,
    clung: verdict === SEEDED_WORD || (timing.childHolds && !timing.asyncBypass && !hold),
    rehitched: recover,
    parentExited: timing.parentExited,
    childHolds: timing.childHolds,
    redirectedStdio: ticket.redirectedStdio === true || verdict === "redirected-stdio",
    syncStall: ticket.syncStall === true || verdict === "sync-stall",
    asyncBypass: timing.asyncBypass,
    timing,
    chips: chipsOf(verdict),
    issue: FEATURED_ISSUE,
    title: TITLE,
    slowHookLog: timing.postToolUseWaitMs > 0 ? SLOW_HOOK_LOG : "",
    cousins: COUSINS,
    not: NOT_PRODUCTS,
  };
}

export function score(input) {
  return analyze(input);
}

export function scoreFields(input) {
  const result = analyze(input);
  return {
    verdict: result.verdict,
    hold: result.hold,
    alarm: result.alarm,
    recover: result.recover,
    parentExited: result.parentExited,
    childHolds: result.childHolds,
    asyncBypass: result.asyncBypass,
    postToolUseWaitMs: result.timing.postToolUseWaitMs,
    toolDispatchMs: result.timing.toolDispatchMs,
  };
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.parentExited ? "parent-exited" : "parent-open",
    result.childHolds ? "child-holds" : "child-gone",
    result.asyncBypass ? "async-bypass" : "sync-wait",
    `wait=${result.timing.postToolUseWaitMs}`,
  ].join("|");
}

export function signals(input) {
  const result = analyze(input);
  return {
    parentExited: result.parentExited,
    childHolds: result.childHolds,
    redirectedStdio: result.redirectedStdio,
    syncStall: result.syncStall,
    asyncBypass: result.asyncBypass,
    waitMs: result.timing.postToolUseWaitMs,
  };
}

/**
 * Educational timing story. Does not sleep 90s. Does not spawn
 * PowerShell. Reconstructs the published parent-exit vs child-hold
 * numbers as a sounding ledger.
 */
export function soundHull(input) {
  const result = analyze(input);
  const { timing } = result;
  return {
    story: [
      {
        id: "tool",
        label: HARMLESS_TOOL,
        ms: timing.toolDispatchMs,
        state: "complete",
      },
      {
        id: "parent",
        label: "hook.ps1",
        ms: timing.parentExitMs,
        state: timing.parentExited ? "exited-0" : "running",
      },
      {
        id: "child",
        label: "child.ps1",
        ms: timing.childHoldMs,
        state: timing.childHolds ? "holds" : "absent",
      },
      {
        id: "result",
        label: "tool_result",
        ms: timing.postToolUseWaitMs,
        state: result.loosed || result.rehitched ? "loosed" : "held",
      },
    ],
    verdict: result.verdict,
    note:
      result.verdict === IDLE_WORD
        ? "result channel loosed at parent exit; no remora-child"
        : result.recover
          ? "async:true rehitched the tree; remora may still swim, hitch released"
          : "parent swam away; remora-child still grips the result channel",
  };
}

export function handle(input) {
  const result = analyze(input);
  const hull = soundHull(input);
  return {
    ...result,
    hull,
    fingerprint: fingerprint(input),
    signals: signals(input),
    published: PUBLISHED,
  };
}

export function seeds() {
  return {
    loosed: seedLoosed(),
    clung: seedClung(),
    rehitched: seedRehitched(),
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv.slice(2)) {
  let ticket;
  if (argv[0] && argv[0] !== "-") {
    ticket = JSON.parse(readFileSync(argv[0], "utf8"));
  } else if (!stdin.isTTY) {
    ticket = await readStdin();
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const invoked = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (invoked) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
