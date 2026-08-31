#!/usr/bin/env node
/**
 * Parison — glasshouse / glory-hole gather classifier.
 * A parison hung in the glory hole after the boys have already
 * blown the piece is not a hold. Score the gather or admit marvered.
 *
 *   echo '{"activeTasks":34,"resultCount":0}' | node parison.mjs
 *   node parison.mjs ticket.json
 *
 * Idle word is marvered (parent received results, stream live,
 * cost reported, ledger settled).
 * Seeded state is hung / #91037 (occurrence 3 fingerprint:
 * 34 active, 0 results, 256+ files, silent 900s, SDK 0.3.251).
 * NEVER idle as hung, parison, glory, noria, dry, stilled,
 * unpinned, cocked, rinsed, scrubbed, vacant, reserved, shed,
 * clamped, sealed, torn, cauterized.
 *
 * Primary #91037: parent-side result reconciliation failure for
 * parallel Task subagents on Fable-5 xhigh in the Agent SDK —
 * children finish (files on disk), parent ledger never advances,
 * event stream goes silent, cost never reported.
 *
 * Hypothesis only (NON-BINDING): treat this as a parent-side
 * result-reconciliation wedge on Fable-5 xhigh parallel Task
 * fan-out in the Agent SDK. Do not claim a root cause in Claude
 * Code or SDK source you have not seen. Verify against the issue
 * text and discard if wrong.
 *
 * NOT Suture (#46987 SSE tear). NOT Limpet (#89275 process leak).
 * NOT Reveille. NOT Hydra. NOT Almanac. NOT Cockade (#91033).
 * NOT Lye (#91020). NOT Advowson (#91005). NOT Pawl. NOT Tappet.
 * NOT Leat (#90475). NOT #47936 (inverse). NOT #59962 (cousin).
 * NOT mill-race water UI. Do not ship Noria / Culvert / Weir /
 * Flume / Millrace.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "hung",
  "silent-stream",
  "unreconciled",
  "ledger-full",
  "zero-results",
  "files-written",
  "cost-unreported",
  "fable-xhigh",
  "sdk-wedge",
  "awaiting-post",
  "marvered",
  "transferred",
  "opus-holds",
]);
export const IDLE_WORD = "marvered";
export const SEEDED_WORD = "hung";
export const HOLD_VERDICTS = Object.freeze([
  "marvered",
  "transferred",
  "opus-holds",
]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91037;
export const PRIMARY_ISSUES = Object.freeze([91037]);
export const SAME_CLASS = Object.freeze([47936, 59962, 37521, 61547, 28482]);
export const COUSINS = Object.freeze([47936, 59962, 37521, 61547, 28482]);
export const NOT_PRODUCTS = Object.freeze([
  "suture",
  "limpet",
  "reveille",
  "hydra",
  "almanac",
  "cockade",
  "lye",
  "advowson",
  "pawl",
  "tappet",
  "leat",
  "noria",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91037";
export const TITLE =
  "[BUG] claude-fable-5 (xhigh): parent session permanently wedges — parallel subagent results never reconcile, event stream goes silent (repro 3x, 0.3.197 & 0.3.251)";
export const FILED_AT = "2026-08-31T17:08:37Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:agents",
  "area:agent-sdk",
]);
export const REPORTER = "fjnoyp";
export const SDK_BAD_A = "0.3.197";
export const SDK_BAD_B = "0.3.251";
export const SDK_SEEDED = "0.3.251";
export const MODEL_FABLE = "claude-fable-5";
export const MODEL_OPUS = "claude-opus-5";
export const EFFORT = "xhigh";
export const RUNTIME = "Bun 1.3.x";
export const PLATFORM = "linux";
export const MEMORY_LIMIT_MIB = 1024;
export const MEMORY_PEAK_MIB = 358;
export const MEMORY_PEAK_PCT = 35;
export const ACTIVE_TASKS_OCC3 = 34;
export const RESULT_COUNT_OCC3 = 0;
export const FILES_WRITTEN_OCC3 = 256;
export const SILENCE_SECONDS_OCC3 = 900;
export const WATCHDOG_OCC3 =
  "stalled: no container activity for 900s with autonomous work unsettled; active_tasks=34 awaiting_post_task_result=true results=0";
export const HUB_LINE =
  "03:50 parison: a hung gather that never reaches the punty is not a hold. Score the gather or admit marvered.";
export const MARK = "03:50 / hermes catalog #101 / #91037";
export const PHRASE =
  "A parison hung in the glory hole after the boys have already blown the piece is not a hold. Score the gather or admit marvered.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as a parent-side result-reconciliation wedge on Fable-5 xhigh parallel Task fan-out in the Agent SDK. Children finish (files on disk); the parent ledger never advances; the event stream goes silent; cost is never reported. Do not claim a root cause in Claude Code or SDK source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is PARENT-SIDE RESULT RECONCILIATION FAILURE FOR PARALLEL TASK SUBAGENTS ON FABLE-5 XHIGH IN THE AGENT SDK — children finish (files on disk), parent ledger never advances, event stream goes silent, cost never reported. NOT Suture (#46987) SSE/stream tear. NOT Limpet (#89275) process still resident after end_turn. NOT Reveille heartbeats. NOT Hydra settings cut. NOT Almanac one-shot Loop ghost. NOT Cockade (#91033) ultracode arm. NOT Lye (#91020) CLAUDE_CONFIG_DIR scrub. NOT Advowson (#91005) Workflow name silent built-in. NOT Pawl sticky stop. NOT Tappet hook spawn. NOT Leat (#90475) unbounded until-loops. NOT #47936 inverse (subagents stop early but reported completed). NOT #59962 leftover in_progress. NOT mill-race water UI. Do not ship Noria / Culvert / Weir / Flume / Millrace.";
export const FORBIDDEN_IDLE = Object.freeze([
  "hung",
  "parison",
  "glory",
  "noria",
  "dry",
  "stilled",
  "unpinned",
  "cocked",
  "rinsed",
  "scrubbed",
  "vacant",
  "reserved",
  "shed",
  "clamped",
  "sealed",
  "torn",
  "cauterized",
]);
export const BANNED_NAMES = Object.freeze([
  "Noria",
  "Culvert",
  "Weir",
  "Flume",
  "Millrace",
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
    activeTasks: null,
    resultCount: null,
    awaitingPostTaskResult: null,
    filesWritten: null,
    eventStream: "",
    silenceSeconds: null,
    containerHealthy: null,
    costReported: null,
    terminalResult: null,
    sdkVersion: "",
    model: "",
    effort: "",
    ledgerSettled: null,
    parentReconciled: null,
    resultsMatchFiles: null,
    opusHolds: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedMarvered();
}

export function seedMarvered() {
  return {
    seed: IDLE_WORD,
    issue: null,
    activeTasks: 0,
    resultCount: 256,
    awaitingPostTaskResult: false,
    filesWritten: 256,
    eventStream: "live",
    silenceSeconds: 0,
    containerHealthy: true,
    costReported: true,
    terminalResult: true,
    sdkVersion: SDK_SEEDED,
    model: MODEL_FABLE,
    effort: EFFORT,
    ledgerSettled: true,
    parentReconciled: true,
    resultsMatchFiles: true,
    opusHolds: false,
    outputText:
      "marvered gather; parent received results; stream live; cost reported; ledger settled; resultCount matches files-written; idle word marvered",
  };
}

export function seedHung() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    activeTasks: ACTIVE_TASKS_OCC3,
    resultCount: RESULT_COUNT_OCC3,
    awaitingPostTaskResult: true,
    filesWritten: FILES_WRITTEN_OCC3,
    eventStream: "silent",
    silenceSeconds: SILENCE_SECONDS_OCC3,
    containerHealthy: true,
    costReported: false,
    terminalResult: false,
    sdkVersion: SDK_SEEDED,
    model: MODEL_FABLE,
    effort: EFFORT,
    runtime: RUNTIME,
    platform: PLATFORM,
    memoryLimitMiB: MEMORY_LIMIT_MIB,
    memoryPeakMiB: MEMORY_PEAK_MIB,
    memoryPeakPct: MEMORY_PEAK_PCT,
    occurrence: 3,
    watchdog: WATCHDOG_OCC3,
    ledgerSettled: false,
    parentReconciled: false,
    resultsMatchFiles: false,
    opusHolds: true,
    sameClass: [...SAME_CLASS],
    outputText:
      "occurrence 3 SDK 0.3.251 silent at ~13 min; 34 tasks active, 0 results — while subagents had produced 256+ files; watchdog: stalled: no container activity for 900s with autonomous work unsettled; active_tasks=34 awaiting_post_task_result=true results=0; parent ledger activeTaskIds stays full, resultCount = 0, awaiting_post_task_result = true; SDK event stream stops entirely — no assistant messages, no task events, no activity pings — container stays healthy; no terminal result so total_cost_usd is never reported; claude-fable-5 xhigh; Agent SDK 0.3.251; same harness/prompt/tools complete on claude-opus-5; hung; silent-stream; unreconciled; ledger-full; zero-results; files-written; cost-unreported; fable-xhigh; sdk-wedge; awaiting-post",
  };
}

export function seedTransferred() {
  return {
    seed: "transferred",
    activeTasks: 0,
    resultCount: 256,
    awaitingPostTaskResult: false,
    filesWritten: 256,
    eventStream: "live",
    silenceSeconds: 0,
    containerHealthy: true,
    costReported: true,
    terminalResult: true,
    sdkVersion: SDK_SEEDED,
    model: MODEL_FABLE,
    effort: EFFORT,
    ledgerSettled: true,
    parentReconciled: true,
    resultsMatchFiles: true,
    opusHolds: false,
    outputText:
      "transferred; parison taken onto the punty; parent has results matching files; resultCount matches files-written; ledger settled; stream live; cost reported",
  };
}

export function seedOpusHolds() {
  return {
    seed: "opus-holds",
    activeTasks: 0,
    resultCount: 256,
    awaitingPostTaskResult: false,
    filesWritten: 256,
    eventStream: "live",
    silenceSeconds: 0,
    containerHealthy: true,
    costReported: true,
    terminalResult: true,
    sdkVersion: SDK_SEEDED,
    model: MODEL_OPUS,
    effort: EFFORT,
    ledgerSettled: true,
    parentReconciled: true,
    resultsMatchFiles: true,
    opusHolds: true,
    outputText:
      "opus-holds; same harness/prompt/tools complete on claude-opus-5; 0.3.217 concurrency/nesting caps DID fix opus-5 on the same task (82-subagent OOM → disciplined single-subagent hour); contrast chip, not the idle word",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.parison && typeof src.parison === "object" && src.parison) ||
    (src.gather && typeof src.gather === "object" && src.gather) ||
    (src.ledger && typeof src.ledger === "object" && src.ledger) ||
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
    activeTasks: firstNum(
      nested.activeTasks,
      nested.active_tasks,
      nested.activeTaskIds,
      src.activeTasks,
    ),
    resultCount: firstNum(
      nested.resultCount,
      nested.result_count,
      nested.results,
      src.resultCount,
    ),
    awaitingPostTaskResult: firstBool(
      nested.awaitingPostTaskResult,
      nested.awaiting_post_task_result,
      src.awaitingPostTaskResult,
    ),
    filesWritten: firstNum(
      nested.filesWritten,
      nested.files_written,
      nested.files,
      src.filesWritten,
    ),
    eventStream: firstText(
      nested.eventStream,
      nested.event_stream,
      nested.stream,
      src.eventStream,
    ),
    silenceSeconds: firstNum(
      nested.silenceSeconds,
      nested.silence_seconds,
      src.silenceSeconds,
    ),
    containerHealthy: firstBool(
      nested.containerHealthy,
      nested.container_healthy,
      src.containerHealthy,
    ),
    costReported: firstBool(
      nested.costReported,
      nested.cost_reported,
      src.costReported,
    ),
    terminalResult: firstBool(
      nested.terminalResult,
      nested.terminal_result,
      src.terminalResult,
    ),
    sdkVersion: firstText(
      nested.sdkVersion,
      nested.sdk_version,
      nested.sdk,
      src.sdkVersion,
    ),
    model: firstText(nested.model, src.model),
    effort: firstText(nested.effort, src.effort),
    runtime: firstText(nested.runtime, src.runtime),
    platform: firstText(nested.platform, src.platform),
    ledgerSettled: firstBool(
      nested.ledgerSettled,
      nested.ledger_settled,
      src.ledgerSettled,
    ),
    parentReconciled: firstBool(
      nested.parentReconciled,
      nested.parent_reconciled,
      src.parentReconciled,
    ),
    resultsMatchFiles: firstBool(
      nested.resultsMatchFiles,
      nested.results_match_files,
      src.resultsMatchFiles,
    ),
    opusHolds: firstBool(nested.opusHolds, nested.opus_holds, src.opusHolds),
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
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  return (
    input.activeTasks == null &&
    input.resultCount == null &&
    input.awaitingPostTaskResult == null &&
    input.filesWritten == null &&
    input.eventStream == null &&
    input.ledgerSettled == null &&
    input.costReported == null
  );
}

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
    return { ...seedHung(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedHung(), ...cloned, ...raw };
  }
  if (cloned.seed === "transferred" && coreMissing) {
    return { ...seedTransferred(), ...cloned, ...raw };
  }
  if (cloned.seed === "opus-holds" && coreMissing) {
    return { ...seedOpusHolds(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedMarvered(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.watchdog,
    ticket.sdkVersion,
    ticket.model,
    ticket.eventStream,
  ]
    .filter(Boolean)
    .join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) &&
    named !== IDLE_WORD &&
    named !== SEEDED_WORD &&
    !HOLD_VERDICTS.includes(named);
  const namedHold =
    named === IDLE_WORD || named === "transferred" || named === "opus-holds";
  const activeTasks =
    row.activeTasks != null ? row.activeTasks : /active_tasks=34|34 tasks active|activeTaskIds stays full/i.test(text) ? ACTIVE_TASKS_OCC3 : null;
  const resultCount =
    row.resultCount != null
      ? row.resultCount
      : /resultCount = 0|results=0|0 results/i.test(text)
        ? 0
        : null;
  const ledgerFull =
    (activeTasks != null && activeTasks > 0) ||
    /activeTaskIds stays full|ledger-full|34 tasks active|active_tasks=34/i.test(
      text,
    );
  const zeroResults =
    resultCount === 0 ||
    /resultCount = 0|results=0|zero-results|0 results/i.test(text);
  const awaitingPost =
    row.awaitingPostTaskResult === true ||
    /awaiting_post_task_result=true|awaiting-post|awaiting_post_task_result true/i.test(
      text,
    );
  const filesWrittenCount =
    row.filesWritten != null
      ? row.filesWritten
      : /256\+ files|256\+ files of research|files-written/i.test(text)
        ? FILES_WRITTEN_OCC3
        : null;
  const filesExist =
    (filesWrittenCount != null && filesWrittenCount >= 256) ||
    /256\+ files|files exist|files-written|produced 256/i.test(text);
  const silentStream =
    row.eventStream === "silent" ||
    /event stream (stops|goes silent)|silent-stream|SDK event stream stops|no container activity for 900s/i.test(
      text,
    );
  const streamLive =
    row.eventStream === "live" ||
    (/stream live/i.test(text) && !silentStream);
  const containerHealthy =
    row.containerHealthy === true ||
    /container stays healthy|container healthy/i.test(text);
  const costUnreported =
    row.costReported === false ||
    row.terminalResult === false ||
    /total_cost_usd is never reported|cost-unreported|no terminal result/i.test(
      text,
    );
  const costReported =
    row.costReported === true ||
    (row.terminalResult === true && !costUnreported) ||
    (/cost reported/i.test(text) && !costUnreported);
  const fableXhigh =
    /claude-fable-5|fable-5|fable-xhigh/i.test(`${row.model} ${row.effort} ${text}`) &&
    /xhigh/i.test(`${row.effort} ${text}`);
  const sdkWedge =
    /0\.3\.197|0\.3\.251|sdk-wedge/i.test(`${row.sdkVersion} ${text}`) &&
    (silentStream || ledgerFull || /wedge/i.test(text));
  const unreconciled =
    row.parentReconciled === false ||
    /never reconcile|unreconciled|parent ledger never advances|results are never reconciled/i.test(
      text,
    );
  const ledgerSettled =
    row.ledgerSettled === true ||
    (/ledger settled/i.test(text) && !ledgerFull);
  const resultsMatchFiles =
    row.resultsMatchFiles === true ||
    (row.resultCount != null &&
      row.filesWritten != null &&
      row.resultCount > 0 &&
      row.resultCount === row.filesWritten) ||
    /results matching files|resultCount matches files-written/i.test(text);
  const transferred =
    !namedAlarm &&
    named !== IDLE_WORD &&
    (named === "transferred" || /transferred|taken onto the punty/i.test(text)) &&
    resultsMatchFiles &&
    !zeroResults;
  const opusHolds =
    row.opusHolds === true ||
    row.model === MODEL_OPUS ||
    /opus-holds|complete on claude-opus-5|same harness.*opus-5/i.test(text);
  const hung =
    !namedHold &&
    !namedAlarm &&
    ledgerFull &&
    zeroResults &&
    awaitingPost &&
    filesExist &&
    silentStream &&
    !ledgerSettled;
  const marvered =
    !namedAlarm &&
    !hung &&
    (namedHold ||
      row.ledgerSettled === true ||
      /marvered gather|parent received results/i.test(text)) &&
    streamLive &&
    costReported &&
    !zeroResults &&
    !ledgerFull;
  return {
    ledgerFull,
    zeroResults,
    awaitingPost,
    filesExist,
    silentStream,
    streamLive,
    containerHealthy,
    costUnreported,
    costReported,
    fableXhigh,
    sdkWedge,
    unreconciled,
    ledgerSettled,
    resultsMatchFiles,
    transferred,
    opusHolds,
    hung,
    marvered,
    namedAlarm,
    namedHold,
    activeTasks,
    resultCount,
    filesWrittenCount,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.hung) chips.push("hung");
  if (flags.marvered) chips.push("marvered");
  if (flags.transferred && !flags.hung) chips.push("transferred");
  if (flags.silentStream && !flags.marvered) chips.push("silent-stream");
  if (flags.unreconciled && !flags.marvered) chips.push("unreconciled");
  if (flags.ledgerFull && !flags.marvered) chips.push("ledger-full");
  if (flags.zeroResults && !flags.marvered) chips.push("zero-results");
  if (flags.filesExist && flags.zeroResults && !flags.marvered) {
    chips.push("files-written");
  }
  if (flags.costUnreported && !flags.marvered) chips.push("cost-unreported");
  if (flags.fableXhigh && flags.hung) chips.push("fable-xhigh");
  if (flags.sdkWedge && !flags.marvered) chips.push("sdk-wedge");
  if (flags.awaitingPost && !flags.marvered) chips.push("awaiting-post");
  if (flags.opusHolds && !flags.marvered) chips.push("opus-holds");
  if (flags.opusHolds && flags.marvered && ticket.seed === "opus-holds") {
    chips.push("opus-holds");
  }
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "marvered") {
    reasons.push(
      "marvered gather; parent received results; stream live; cost reported; ledger settled",
    );
    reasons.push("hold: the parison reached the punty");
  }
  if (verdict === "transferred") {
    reasons.push(
      "transferred; parison taken onto the punty; parent has results matching files",
    );
    reasons.push("hold: resultCount matches files-written");
  }
  if (verdict === "opus-holds") {
    reasons.push(
      "same harness/prompt/tools complete on claude-opus-5 (contrast chip, not the idle word)",
    );
    reasons.push(
      "0.3.217 concurrency/nesting caps DID fix opus-5 on the same task (82-subagent OOM → disciplined single-subagent hour)",
    );
  }
  if (flags.hung || flags.ledgerFull) {
    reasons.push(
      `parent ledger: activeTaskIds stays full (${flags.activeTasks ?? ACTIVE_TASKS_OCC3}), resultCount = ${flags.resultCount ?? RESULT_COUNT_OCC3}, awaiting_post_task_result = true`,
    );
  }
  if (flags.filesExist && flags.zeroResults) {
    reasons.push(
      "subagents completed real work (256+ files of research output written) but results are never reconciled back to the parent",
    );
  }
  if (flags.silentStream) {
    reasons.push(
      "SDK event stream stops entirely — no assistant messages, no task events, no activity pings — container stays healthy",
    );
  }
  if (flags.costUnreported) {
    reasons.push(
      "no terminal result is emitted, so total_cost_usd is never reported (burned tokens unaccounted)",
    );
  }
  if (flags.fableXhigh && flags.hung) {
    reasons.push(
      "failure is specific to Fable-5 xhigh parallel orchestration; Agent SDK 0.3.197 and 0.3.251",
    );
  }
  if (flags.hung) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "marvered" && verdict !== "transferred" && flags.unreconciled) {
    reasons.push(
      "A parison hung in the glory hole after the boys have already blown the piece is not a hold. Score the gather or admit marvered.",
    );
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.marvered) return "marvered";
  if (named === SEEDED_WORD) return "hung";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.hung) return "hung";
  if (flags.transferred) return "transferred";
  if (flags.opusHolds && flags.marvered) return "opus-holds";
  if (flags.marvered) return "marvered";
  if (flags.silentStream && flags.zeroResults && flags.ledgerFull) return "hung";
  return "marvered";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    hung: verdict === "hung" || flags.hung,
    marvered: verdict === "marvered" || flags.marvered,
    transferred: verdict === "transferred" || flags.transferred,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      glory: flags.hung
        ? "a parison hangs in the glory hole"
        : flags.marvered || flags.transferred
          ? "the glory hole is empty; the gather left the heat"
          : "no hung gather in the hole",
      ledger: flags.ledgerFull && flags.zeroResults
        ? `active tasks ${flags.activeTasks ?? ACTIVE_TASKS_OCC3} · resultCount ${flags.resultCount ?? 0} · files-written ${flags.filesWrittenCount ?? FILES_WRITTEN_OCC3}`
        : flags.marvered || flags.transferred
          ? "ledger settled; resultCount matches files-written"
          : "ledger quiet",
      stream: flags.silentStream
        ? "event stream silent; container healthy"
        : "event stream live",
      cost: flags.costUnreported && !flags.marvered
        ? "no terminal result ⇒ total_cost_usd unreported"
        : "cost reported",
      note: flags.hung
        ? PHRASE
        : flags.transferred
          ? "Transferred: parison taken onto the punty. Hold."
          : "Marvered: parent received results, stream live, cost reported, ledger settled.",
    },
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
  if (name === SEEDED_WORD || name === 91037 || name === "91037") {
    return analyze(seedHung());
  }
  if (name === "transferred") {
    return analyze(seedTransferred());
  }
  if (name === "opus-holds" || name === MODEL_OPUS) {
    return analyze(seedOpusHolds());
  }
  if (name === IDLE_WORD || name === "marvered") {
    return analyze(seedMarvered());
  }
  return analyze(seedMarvered());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "hung" || (result.hung && result.alarm)
          ? `hung parison #${FEATURED_ISSUE}: occurrence 3 fingerprint — 34 active, 0 results, 256+ files, silent 900s, SDK ${SDK_SEEDED}. ${HYPOTHESIS_NOTE}`
          : result.verdict === "transferred"
            ? "transferred gather. Parison taken onto the punty; parent has results matching files. Hold."
            : result.verdict === "opus-holds"
              ? "opus-holds. Same harness completes on claude-opus-5. Contrast chip, not the idle word."
              : `marvered gather. Idle word ${IDLE_WORD}. Parent received results; stream live; cost reported; ledger settled.`,
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
