#!/usr/bin/env node
/**
 * Scion — orchard grafting-bench scorer.
 * A healthy graft with no rings is not
 * a hold. Score the cambium or
 * admit hollow.
 *
 *   echo '{"lastSequenceNum":0,"forkedFromSessionId":null,"kind":"interactive"}' | node index.mjs
 *   node index.mjs ticket.json
 *
 * Idle word is hollow.
 * Seeded state is hollow / empty-fork.
 *
 * Primary #90815: VS Code extension, forking
 * a session WHILE Remote Control is on
 * produces a child with EMPTY history.
 * The child registers as a fresh bridged
 * session, not a fork.
 *
 * HOLLOW if lastSequenceNum===0 AND
 * missing forkedFromSessionId AND
 * banner healthy / kind interactive.
 * LINED/TAKEN if byte-count matches parent
 * and forkedFromSessionId present.
 *
 * NOT Kindling (WarmLifecycle throwaway).
 * NOT Bollard (RC env orphan).
 * NOT Cote (resume hub).
 * NOT Ullage (silent context drop).
 * NOT Voucher (nested subagent fabrication).
 * NOT Almanac (one-shot Loop ghost).
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze(["hollow", "lined", "taken"]);
export const IDLE_WORD = "hollow";
export const ALARM_VERDICTS = Object.freeze(["hollow"]);
export const HOLD_VERDICTS = Object.freeze(["lined", "taken"]);
export const CHIPS = Object.freeze([
  "empty-fork",
  "bridge-won",
  "unlineaged",
  "lastSequenceNum-0",
  "no-forkedFrom",
  "silent-drop",
  "vscode-rc",
  "race",
  "healthy-banner",
  "seedless",
]);
export const FEATURED_ISSUE = 90815;
export const PARENT_BYTES = 9363037;
export const PARENT_RECORDS = 3942;
export const CHILD_BYTES = 40676;
export const CHILD_RECORDS = 38;
export const LAST_SEQUENCE_NUM = 0;
export const STARTED_AT = 1788117446827;
export const PARENT_OFFSET_MS = 2000;
export const HEALTHY_BANNER =
  "Remote Control is active · Continue here, on your phone, or at claude.ai/code";
export const EXTENSION = "2.1.251";
export const FILED_AT = "2026-08-30T19:34:40Z";

const HEALTHY_BANNER_RE =
  /Remote Control is active\s*·\s*Continue here, on your phone, or at claude\.ai\/code/i;

export function emptyTicket() {
  return seedHollow();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.scion && typeof src.scion === "object" && src.scion) ||
    (src.graft && typeof src.graft === "object" && src.graft) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  const parent = nested.parent && typeof nested.parent === "object" ? nested.parent : {};
  const child = nested.child && typeof nested.child === "object" ? nested.child : nested;
  const lastSequenceNum = firstNum(
    nested.lastSequenceNum,
    child.lastSequenceNum,
    nested.childLastSequenceNum,
  );
  const forkedFromSessionId = firstText(
    nested.forkedFromSessionId,
    child.forkedFromSessionId,
    nested.forkParentSessionId,
    child.forkParentSessionId,
  );
  const kind = firstText(nested.kind, child.kind) || "";
  const banner = firstText(nested.banner, child.banner, nested.healthyBanner);
  const bytes = firstNum(nested.bytes, child.bytes, nested.childBytes);
  const records = firstNum(nested.records, child.records, nested.childRecords);
  const parentBytes = firstNum(nested.parentBytes, parent.bytes) ?? PARENT_BYTES;
  const parentRecords = firstNum(nested.parentRecords, parent.records) ?? PARENT_RECORDS;
  const bridged = firstBool(nested.bridged, child.bridged, nested.bridgeWon);
  const silent = firstBool(nested.silent, child.silent);
  const entrypoint = firstText(nested.entrypoint, child.entrypoint);
  const parentOffsetMs = firstNum(nested.parentOffsetMs, child.parentOffsetMs, nested.offsetMs);
  const seed = firstText(nested.seed, src.seed);
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed,
    lastSequenceNum,
    forkedFromSessionId,
    kind,
    banner,
    bannerHealthy: firstBool(nested.bannerHealthy, child.bannerHealthy),
    bytes,
    records,
    parentBytes,
    parentRecords,
    bridged,
    silent,
    entrypoint,
    parentOffsetMs,
    startedAt: firstNum(nested.startedAt, child.startedAt),
    type: firstText(nested.type, child.type),
    bridgeSessionId: firstText(nested.bridgeSessionId, child.bridgeSessionId),
    parentUuid: nested.parentUuid === undefined ? child.parentUuid : nested.parentUuid,
    sessionId: firstText(nested.sessionId, child.sessionId),
    parentSessionId: firstText(nested.parentSessionId, parent.sessionId),
    version: firstText(nested.version, child.version),
    uuidSwap: firstBool(nested.uuidSwap, child.uuidSwap),
    parent,
    child,
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

export function bannerIsHealthy(ticket) {
  const row = cloneTicket(ticket);
  if (row.bannerHealthy === true) return true;
  return HEALTHY_BANNER_RE.test(row.banner || "");
}

export function missingForkedFrom(ticket) {
  const row = cloneTicket(ticket);
  return !row.forkedFromSessionId;
}

export function analyze(input) {
  const row = cloneTicket(input);
  const seqZero = row.lastSequenceNum === LAST_SEQUENCE_NUM;
  const noFork = missingForkedFrom(row);
  const healthy = bannerIsHealthy(row);
  const interactive = row.kind === "interactive";
  const bytesMatch =
    row.bytes != null &&
    row.parentBytes != null &&
    row.bytes === row.parentBytes &&
    (row.records == null || row.parentRecords == null || row.records === row.parentRecords);
  const hollow = seqZero && noFork && (healthy || interactive);
  const linedTaken = Boolean(row.forkedFromSessionId) && bytesMatch;
  const chips = [];
  if (hollow) chips.push("empty-fork");
  if ((row.bridged === true || row.bridgeSessionId || row.type === "bridge-session") && hollow) {
    chips.push("bridge-won");
  }
  if (noFork) chips.push("unlineaged");
  if (seqZero) chips.push("lastSequenceNum-0");
  if (noFork) chips.push("no-forkedFrom");
  if (hollow && row.silent !== false) chips.push("silent-drop");
  if (/claude-vscode|vscode/i.test(row.entrypoint) || row.version === EXTENSION) {
    chips.push("vscode-rc");
  }
  if (row.parentOffsetMs === PARENT_OFFSET_MS || (hollow && linedTaken === false && seqZero)) {
    chips.push("race");
  }
  if (healthy) chips.push("healthy-banner");
  if (seqZero || (row.records != null && row.parentRecords != null && row.records < row.parentRecords)) {
    chips.push("seedless");
  }
  return {
    row,
    seqZero,
    noFork,
    healthy,
    interactive,
    bytesMatch,
    hollow,
    linedTaken,
    chips: [...new Set(chips)],
  };
}

export function classify(input) {
  const facts = analyze(input);
  if (facts.linedTaken) {
    if (facts.row.seed === "lined") return "lined";
    return "taken";
  }
  return "hollow";
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
    hollow: verdict === "hollow",
    lined: verdict === "lined",
    taken: hold,
    hold,
    alarm: verdict === "hollow",
    fresh: hold,
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      lastSequenceNum: facts.row.lastSequenceNum,
      forkedFromSessionId: facts.row.forkedFromSessionId || null,
      seqZero: facts.seqZero,
      noFork: facts.noFork,
      healthy: facts.healthy,
      interactive: facts.interactive,
      bytesMatch: facts.bytesMatch,
      hollow: facts.hollow,
      linedTaken: facts.linedTaken,
      parentBytes: facts.row.parentBytes,
      childBytes: facts.row.bytes,
      parentRecords: facts.row.parentRecords,
      childRecords: facts.row.records,
      parentOffsetMs: facts.row.parentOffsetMs,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "lined") {
    return "● Lined · child byte-count matches parent and forkedFromSessionId is present · hold";
  }
  if (kind === "taken") {
    return "● Taken · unbridged or UUID-swap graft kept the rings · hold";
  }
  return "● Hollow · lastSequenceNum 0, no forkedFromSessionId, healthy banner / kind interactive · empty-fork";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "hollow" || facts.hollow) {
    reasons.push(
      "#90815 VS Code fork while Remote Control is on produced a child with empty history — registered as a fresh bridged session, not a fork",
    );
  }
  if (facts.seqZero) reasons.push("transcript opens as bridge-session with lastSequenceNum: 0");
  if (facts.noFork) reasons.push("Desktop session record has no forkedFromSessionId");
  if (facts.interactive) reasons.push("kind: interactive");
  if (facts.healthy) reasons.push(`healthy banner: ${HEALTHY_BANNER}`);
  if (facts.row.silent !== false && kind === "hollow") reasons.push("silent (no error)");
  if (facts.row.parentOffsetMs === PARENT_OFFSET_MS) {
    reasons.push("parent quiesced 2s before child startedAt");
  }
  if (facts.row.bytes != null && facts.row.records != null && kind === "hollow") {
    reasons.push(`hollow scion ${facts.row.records} recs / ${facts.row.bytes} bytes`);
  }
  if (facts.linedTaken) {
    reasons.push(
      `parent rings ${facts.row.parentRecords} / ${facts.row.parentBytes} match child ${facts.row.records} / ${facts.row.bytes}`,
    );
    reasons.push(`forkedFromSessionId present: ${facts.row.forkedFromSessionId}`);
  }
  return reasons;
}

export function seedHollow() {
  return {
    seed: "hollow",
    issue: FEATURED_ISSUE,
    parent: {
      sessionId: "cfde1c9b",
      bytes: PARENT_BYTES,
      records: PARENT_RECORDS,
      lastWrite: "12:17:24",
      bridged: true,
    },
    child: {
      sessionId: "319b94c3",
      type: "bridge-session",
      lastSequenceNum: LAST_SEQUENCE_NUM,
      bytes: CHILD_BYTES,
      records: CHILD_RECORDS,
      kind: "interactive",
      forkedFromSessionId: null,
      bridgeSessionId: "cse_01RsY",
      startedAt: STARTED_AT,
      parentOffsetMs: PARENT_OFFSET_MS,
      banner: HEALTHY_BANNER,
      parentUuid: null,
      entrypoint: "claude-vscode",
      silent: true,
      version: EXTENSION,
      bridged: true,
    },
    lastSequenceNum: LAST_SEQUENCE_NUM,
    forkedFromSessionId: null,
    kind: "interactive",
    banner: HEALTHY_BANNER,
    bytes: CHILD_BYTES,
    records: CHILD_RECORDS,
    parentBytes: PARENT_BYTES,
    parentRecords: PARENT_RECORDS,
    bridged: true,
    silent: true,
    entrypoint: "claude-vscode",
    parentOffsetMs: PARENT_OFFSET_MS,
    startedAt: STARTED_AT,
    type: "bridge-session",
    version: EXTENSION,
  };
}

export function seedLined() {
  return {
    seed: "lined",
    issue: FEATURED_ISSUE,
    parent: {
      sessionId: "cfde1c9b",
      bytes: PARENT_BYTES,
      records: PARENT_RECORDS,
      lastWrite: "12:17:24",
      bridged: false,
    },
    child: {
      sessionId: "1ef5d896",
      lastSequenceNum: PARENT_RECORDS,
      bytes: PARENT_BYTES,
      records: PARENT_RECORDS,
      kind: "interactive",
      forkedFromSessionId: "cfde1c9b",
      startedAt: STARTED_AT,
      parentOffsetMs: PARENT_OFFSET_MS,
      banner: "",
      entrypoint: "claude-vscode",
      silent: false,
      version: EXTENSION,
      bridged: false,
      uuidSwap: false,
    },
    lastSequenceNum: PARENT_RECORDS,
    forkedFromSessionId: "cfde1c9b",
    kind: "interactive",
    bytes: PARENT_BYTES,
    records: PARENT_RECORDS,
    parentBytes: PARENT_BYTES,
    parentRecords: PARENT_RECORDS,
    bridged: false,
    entrypoint: "claude-vscode",
  };
}

export function seedUnbridged() {
  return {
    seed: "unbridged-success",
    issue: FEATURED_ISSUE,
    parent: {
      sessionId: "cfde1c9b",
      bytes: PARENT_BYTES,
      records: PARENT_RECORDS,
      lastWrite: "12:17:24",
      bridged: false,
    },
    child: {
      sessionId: "1ef5d896",
      lastSequenceNum: PARENT_RECORDS,
      bytes: PARENT_BYTES,
      records: PARENT_RECORDS,
      kind: "interactive",
      forkedFromSessionId: "cfde1c9b",
      startedAt: STARTED_AT,
      parentOffsetMs: PARENT_OFFSET_MS,
      banner: "",
      entrypoint: "claude-vscode",
      silent: false,
      version: EXTENSION,
      bridged: false,
      uuidSwap: true,
    },
    lastSequenceNum: PARENT_RECORDS,
    forkedFromSessionId: "cfde1c9b",
    kind: "interactive",
    bytes: PARENT_BYTES,
    records: PARENT_RECORDS,
    parentBytes: PARENT_BYTES,
    parentRecords: PARENT_RECORDS,
    bridged: false,
    uuidSwap: true,
    entrypoint: "claude-vscode",
  };
}

export function seedTaken() {
  return seedUnbridged();
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "lined" || key === "line") return score(seedLined());
  if (
    key === "taken" ||
    key === "unbridged" ||
    key === "unbridged-success" ||
    key === "hold"
  ) {
    return score(seedUnbridged());
  }
  return score(seedHollow());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.scion?.action || "").toLowerCase();
  if (action === "lined" || action === "line") return score(seedLined());
  if (action === "taken" || action === "unbridged" || action === "hold") {
    return score(seedUnbridged());
  }
  if (action === "restore" || action === "90815" || action === "hollow" || action === "idle") {
    return score(seedHollow());
  }
  const ticket =
    payload.ticket ||
    payload.scion ||
    payload.graft ||
    payload.probe ||
    payload;
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
        ? "Scion hollow. A healthy graft with no rings is not a hold. #90815 empty bridged fork."
        : "Scion taken. Rings match the parent and forkedFromSessionId is present.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedHollow();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.scion || parsed.graft || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedHollow();
  }
  return seedHollow();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedHollow());
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
