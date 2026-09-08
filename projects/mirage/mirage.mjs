#!/usr/bin/env node
/**
 * Mirage — desert observatory / heat-haze scoring bench.
 *
 * Educational timing/log model for a published Desktop scheduler
 * defect: renderer ack without a session, then ~12 min later
 * "Cleared stale pending dispatch", with lastRunAt stamped anyway.
 *
 *   node mirage.mjs data/miraged.json
 *   echo '{"seed":"miraged"}' | node mirage.mjs
 *
 * Idle word is confirmed (HOLD: Spawning → Dispatch acknowledged →
 * Confirmed task run within ~1s).
 * Seeded word is miraged (ack, no session, stale clear, lastRunAt lie).
 *
 * Encoded from anthropics/claude-code#92920 issue body only.
 * Hypothesis (NON-BINDING): renderer ack without session start leaves
 * a pending dispatch that times out ~12m and falsely stamps lastRunAt.
 * Invite verify against #92920 text only. Do NOT implement a fix in
 * anthropics/claude-code. No network. No exploits. No live Claude.
 * No Desktop hooks. No payloads.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "confirmed",
  "miraged",
  "late-confirm",
  "stale-clear",
  "lastrun-lie",
  "overnight-loss",
  "cousins",
  "before-after",
  "jitter-delay",
  "global-limit",
  "fixtures",
]);

export const IDLE_WORD = "confirmed";
export const SEEDED_WORD = "miraged";
export const HOLD = Object.freeze(["confirmed"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "confirmed"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "loosed",
  "intact",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
]);
export const FORBIDDEN_SEED = Object.freeze([
  "clung",
  "relisted",
  "regranted",
  "misbound",
  "fouled",
  "escheated",
]);

export const FEATURED_ISSUE = 92920;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92920";
export const TITLE =
  "[BUG] Scheduled task dispatch acknowledged by renderer but no session starts; 'Cleared stale pending dispatch' after 12 min, lastRunAt stamped anyway (3 of 18 tasks lost overnight)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
  "area:routines",
]);
export const VERSION_DESKTOP = "1.46388.4";
export const VERSION_CODE = "2.1.260";
export const OS_NAME = "macOS 26.x (Darwin 25.6.0)";
export const REPORTER = "geokao";
export const FILED_AT = "2026-09-08T19:03:31Z";
export const LOG_DAY = "2026-09-08";
export const CONFIRM_WINDOW_MS = 2000;
export const STALE_TYPICAL_MS = 12 * 60 * 1000;
export const OVERNIGHT_DISPATCHES = 18;
export const OVERNIGHT_CONFIRMED = 14;
export const OVERNIGHT_LOST = 3;
export const OVERNIGHT_LATE = 1;
export const HEALTHY_TRIPLE =
  "Spawning new session → Dispatch acknowledged by renderer → Confirmed task run";

export const COUSINS = Object.freeze([
  {
    issue: 74432,
    title:
      "Scheduled task silently skipped after wake from standby: dispatch cleared but lastRunAt still set",
    state: "closed",
    citeOnly: true,
    why: "wake-from-standby skip; do not clone the closed issue",
  },
  {
    issue: 73927,
    title:
      "Desktop app scheduled tasks: missed-run catch-up dispatch silently dropped during app startup (no retry); lastRunAt stamped at dispatch; no 529 retry mid-run",
    state: "closed",
    citeOnly: true,
    why: "startup catch-up drop; do not clone the closed issue",
  },
  {
    issue: 76304,
    title:
      "[BUG] Missed scheduled-task catch-up at app launch silently goes stale and never executes; lastRunAt updated anyway",
    state: "closed",
    citeOnly: true,
    why: "launch catch-up stale; do not clone the closed issue",
  },
  {
    issue: 77596,
    title:
      "Forced re-login loop (elevated_auth / device_key_missing) — device key not persisting; scheduled task silently skipped",
    state: "closed",
    citeOnly: true,
    why: "auth-loop skip; do not clone the closed issue",
  },
  {
    issue: 60144,
    title:
      "[scheduler] scheduled-task discarded on wake from macOS maintenance sleep — no catch-up / replay",
    state: "closed",
    citeOnly: true,
    why: "maintenance-sleep discard; do not clone the closed issue",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "oubliette",
  "remora",
  "ukase",
  "deadletter",
  "callboard",
  "annunciator",
  "reveille",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
]);

export const KIND_RES = Object.freeze({
  spawn: /Spawning new session/i,
  ack: /Dispatch acknowledged by renderer/i,
  stale: /Cleared stale pending dispatch/i,
  confirm: /Confirmed task run/i,
  session: /Starting local session/i,
  lastrun: /lastRunAt/i,
  jitter: /Delaying dispatch/i,
  limit: /Skipping dispatch.*global_limit/i,
});

export function classifyEvent(message) {
  const text = String(message || "");
  for (const [kind, re] of Object.entries(KIND_RES)) {
    if (re.test(text)) return kind;
  }
  return "other";
}

export function parseClock(value, day = LOG_DAY) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return Number(text);
  if (/T/.test(text) || /Z$/.test(text) || /[+-]\d\d:\d\d$/.test(text)) {
    const ms = Date.parse(text);
    return Number.isFinite(ms) ? ms : null;
  }
  const match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

export function normalizeEvent(raw) {
  if (!raw) return { kind: "other", t: null, message: "", task: "" };
  if (typeof raw === "string") {
    return {
      kind: classifyEvent(raw),
      t: null,
      message: raw,
      task: "",
      level: "info",
    };
  }
  const message = raw.message || raw.msg || raw.line || "";
  return {
    kind: raw.kind || classifyEvent(message),
    t: parseClock(raw.t ?? raw.time ?? raw.at ?? raw.ts),
    message,
    task: raw.task || raw.name || "",
    level: raw.level || "info",
    lastRunAt: raw.lastRunAt || null,
    logger: raw.logger || "CCDScheduledTasks",
  };
}

function firstOf(events, kind) {
  return events.find((event) => event.kind === kind) || null;
}

function hasKind(events, kind) {
  return events.some((event) => event.kind === kind);
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    events: [
      {
        t: "00:00:00",
        level: "info",
        logger: "CCDScheduledTasks",
        message: "Spawning new session for scheduled task idle-watch",
        task: "idle-watch",
      },
      {
        t: "00:00:00",
        level: "info",
        logger: "CCDScheduledTasks",
        message: "Dispatch acknowledged by renderer: idle-watch",
        task: "idle-watch",
      },
      {
        t: "00:00:01",
        level: "info",
        logger: "CCDScheduledTasks",
        message: "Confirmed task run for: idle-watch",
        task: "idle-watch",
      },
    ],
  };
}

export function seedConfirmed() {
  return {
    seed: "confirmed",
    events: emptyTicket().events,
  };
}

export function seedMiraged() {
  return {
    seed: "miraged",
    events: [
      {
        t: "03:12:59",
        level: "info",
        logger: "CCDScheduledTasks",
        message:
          "Spawning new session for scheduled task voc-weekly-incremental",
        task: "voc-weekly-incremental",
      },
      {
        t: "03:12:59",
        level: "info",
        logger: "CCDScheduledTasks",
        message:
          "Dispatch acknowledged by renderer: voc-weekly-incremental",
        task: "voc-weekly-incremental",
      },
      {
        t: "03:21:00",
        level: "warn",
        logger: "CCDScheduledTasks",
        message:
          "Cleared stale pending dispatch for: voc-weekly-incremental",
        task: "voc-weekly-incremental",
      },
    ],
    lastRunAt: "2026-09-08T09:21:00Z",
    sessionStarted: false,
  };
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

/**
 * Score one CCDScheduledTasks-shaped dispatch timeline.
 * Confirmed: spawn + ack + confirm within ~1s, no stale-before-confirm.
 * Miraged: spawn + ack + stale clear, no session / no confirm before stale.
 */
export function scoreDispatch(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const events = (ticket.events || []).map(normalizeEvent);
  const spawn = firstOf(events, "spawn");
  const ack = firstOf(events, "ack");
  const stale = firstOf(events, "stale");
  const confirm = firstOf(events, "confirm");
  const session = firstOf(events, "session");
  const lastrunEvent = firstOf(events, "lastrun");
  const lastRunAt = ticket.lastRunAt || (lastrunEvent && lastrunEvent.lastRunAt);
  const sessionStarted =
    ticket.sessionStarted === true || Boolean(session) || Boolean(confirm);
  const tSpawn = spawn && spawn.t;
  const tConfirm = confirm && confirm.t;
  const tStale = stale && stale.t;
  const spanMs =
    tSpawn != null && tConfirm != null ? tConfirm - tSpawn : null;
  const staleMs =
    tSpawn != null && tStale != null ? tStale - tSpawn : null;

  let verdict = IDLE_WORD;
  if (spawn && ack && confirm && (!stale || (tStale != null && tConfirm != null && tConfirm < tStale))) {
    if (spanMs == null || spanMs <= CONFIRM_WINDOW_MS) {
      verdict = "confirmed";
    } else {
      verdict = "late-confirm";
    }
  } else if (spawn && ack && stale && confirm && tStale != null && tConfirm != null && tConfirm > tStale) {
    verdict = "late-confirm";
  } else if (spawn && ack && stale && !confirm && !session) {
    verdict = "miraged";
  } else if (ack && stale && !sessionStarted) {
    verdict = "miraged";
  } else if (ticket.sessionStarted === false && ack && !confirm) {
    verdict = "miraged";
  } else if (hasKind(events, "limit") && !ack) {
    verdict = "global-limit";
  } else if (hasKind(events, "jitter") && !ack && !stale) {
    verdict = "jitter-delay";
  } else if (seeded) {
    verdict = seeded;
  }

  if (seeded && (!events.length || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const lastRunLie = Boolean(
    lastRunAt && verdict !== "confirmed" && !session && !(confirm && (!stale || tConfirm < tStale)),
  ) || Boolean(ticket.lastRunAt && verdict === "miraged");

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    confirmed: verdict === "confirmed",
    miraged: verdict === "miraged" || verdict === "overnight-loss" || verdict === "stale-clear" || verdict === "lastrun-lie",
    lastRunLie,
    sessionStarted,
    spanMs,
    staleMs,
    lastRunAt: lastRunAt || null,
    kinds: {
      spawn: Boolean(spawn),
      ack: Boolean(ack),
      stale: Boolean(stale),
      confirm: Boolean(confirm),
      session: Boolean(session),
    },
    phrase: hold
      ? "admit confirmed"
      : "score miraged",
  };
}

export function groupByTask(events) {
  const groups = new Map();
  for (const raw of events || []) {
    const event = normalizeEvent(raw);
    const key = event.task || "_";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  return [...groups.entries()].map(([name, rows]) => ({ name, events: rows }));
}

export function scoreNight(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const tasks = Array.isArray(ticket.tasks) && ticket.tasks.length
    ? ticket.tasks.map((task) => ({
        name: task.name || task.task || "",
        ...scoreDispatch(task.events ? task : { events: task.events || [], ...task }),
      }))
    : groupByTask(ticket.events).map((task) => ({
        name: task.name,
        ...scoreDispatch({ events: task.events }),
      }));
  const lost = tasks.filter((task) => task.verdict === "miraged");
  const confirmed = tasks.filter((task) => task.verdict === "confirmed");
  const late = tasks.filter((task) => task.verdict === "late-confirm");
  const total =
    ticket.dispatches ||
    ticket.total ||
    tasks.length ||
    OVERNIGHT_DISPATCHES;
  let verdict = "confirmed";
  if (lost.length) verdict = "overnight-loss";
  else if (late.length) verdict = "late-confirm";
  if (ticket.seed === "overnight-loss" || ticket.verdict === "overnight-loss") {
    verdict = "overnight-loss";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "confirmed",
    alarm: verdict !== "confirmed",
    lost: lost.length || ticket.lost || 0,
    confirmed: confirmed.length || ticket.confirmedCount || 0,
    late: late.length || ticket.late || 0,
    total,
    tasks,
    phrase: verdict === "confirmed" ? "admit confirmed" : "score miraged",
    note:
      `${lost.length || ticket.lost || OVERNIGHT_LOST} of ${total} tasks lost; ` +
      `${confirmed.length || ticket.confirmedCount || OVERNIGHT_CONFIRMED} healthy triples; ` +
      `${late.length || ticket.late || OVERNIGHT_LATE} late after stale clear`,
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && (!ticket.events || ticket.preferSeed !== false)) {
    if (
      seeded !== "confirmed" &&
      seeded !== "miraged" &&
      seeded !== "late-confirm"
    ) {
      return seeded;
    }
  }
  if (Array.isArray(ticket.tasks) && ticket.tasks.length > 1) {
    return scoreNight(ticket).verdict;
  }
  return scoreDispatch(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.tasks) && ticket.tasks.length > 1;
  const scored = multi ? scoreNight(ticket) : scoreDispatch(ticket);
  const verdict = seeded && ticket.preferSeed !== false && !ticket.events && !ticket.tasks
    ? seeded
    : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    healthyTriple: HEALTHY_TRIPLE,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.kinds && result.kinds.ack ? "ack" : "no-ack",
    result.kinds && result.kinds.stale ? "stale" : "no-stale",
    result.kinds && result.kinds.confirm ? "confirm" : "no-confirm",
    result.lastRunLie ? "lastrun-lie" : "lastrun-honest",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      desktop: VERSION_DESKTOP,
      code: VERSION_CODE,
      os: OS_NAME,
      overnight: {
        dispatches: OVERNIGHT_DISPATCHES,
        confirmed: OVERNIGHT_CONFIRMED,
        lost: OVERNIGHT_LOST,
        late: OVERNIGHT_LATE,
      },
      hypothesis:
        "renderer ack without session start leaves a pending dispatch that times out ~12m and falsely stamps lastRunAt",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    return { events: [{ message: trimmed }] };
  }
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
