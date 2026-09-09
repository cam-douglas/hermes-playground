#!/usr/bin/env node
/**
 * Epitaph — stonecutter / memorial masonry bench.
 *
 * Educational diagnostic model for a published agent-notification
 * defect: when a subagent starts a background Bash
 * (run_in_background: true) and ends its turn to wait, the parent
 * immediately receives a <task-notification> with status=completed
 * and a summary saying the agent "finished". The agent has not
 * finished — it is re-invoked when the background task completes.
 *
 *   node epitaph.mjs data/epitaphed.json
 *   echo '{"seed":"epitaphed"}' | node epitaph.mjs
 *
 * Idle word is parked (HOLD: a parked agent is distinguishable from
 * a finished one; live-children count can be non-zero; status is
 * not completed; parking utterance is not framed as a result).
 * Path word is epitaphed (status=completed + "finished" while the
 * agent is parked with a live background child).
 * Seeded late-true-complete word is inscribed (second notification
 * after the real finish, higher usage counters).
 *
 * Encoded from anthropics/claude-code#92952 issue body only.
 * Hypothesis (NON-BINDING): the "no live background children" check
 * does not account the agent's own background Bash child toward the
 * agent, so parking looks like completion. The issue marks this
 * inferred, not established. Invite verify against #92952 text only.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop automation.
 * No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "parked",
  "epitaphed",
  "inscribed",
  "live-child",
  "false-finished",
  "parking-result",
  "note-contradicts",
  "usage-rise",
  "task-stop",
  "contending-rebuild",
  "status-check",
  "filler-calls",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "parked";
export const PATH_WORD = "epitaphed";
export const SEEDED_WORD = "inscribed";
export const HOLD = Object.freeze(["parked"]);
export const RECOVER = Object.freeze(["inscribed"]);
export const ALARM = Object.freeze(VERDICTS.filter((name) => name !== "parked"));
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "collated",
  "stereotyped",
  "emended",
  "confirmed",
  "miraged",
  "loosed",
  "banked",
  "intact",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
  "fouled",
  "voided",
  "rewritten",
]);
export const FORBIDDEN_SEED = Object.freeze([...FORBIDDEN_IDLE]);

export const FEATURED_ISSUE = 92952;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92952";
export const TITLE =
  "[BUG] Agent task notification reports status=completed for an agent still waiting on its own background task";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "area:agents"]);
export const VERSION = "2.1.260";
export const OS_NAME = "Windows 11";
export const SURFACE = "Claude Code desktop app, no terminal";
export const BASH_TOOL = "Git Bash";
export const PLATFORM = "Anthropic API";
export const MODEL = "Opus";
export const REPORTER = "ivo-doko";
export const FILED_AT = "2026-09-08T23:55:59Z";
export const SLEEP_SECONDS = 150;
export const FIRST_TOKENS = 99124;
export const FIRST_TOOL_USES = 12;
export const FIRST_DURATION_MS = 357035;
export const SECOND_TOKENS = 104094;
export const SECOND_TOOL_USES = 16;
export const REINVOKE_FIRST_S = 109;
export const REINVOKE_SECOND_S = 46;
export const FILLER_CALLS = 7;
export const FILLER_SECONDS = 35;
export const TASKSTOP_AFTER_S = 2;
export const NOTE_TEXT =
  "A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.";
export const PARK_RESULT =
  "I'll stop polling now and wait for the background build's completion notification before proceeding.";
export const HONEST_RESULT = "none — agent has not produced a final report";
export const HONEST_NOTE =
  "1 background task still running; you will be notified again";
export const TASKOUTPUT_NOTE =
  "TaskOutput(task_id=…, block=false, timeout=30000) retrieves output from a running or completed task; block=false gives a non-blocking check of current status. block and timeout are listed in required despite carrying defaults, so TaskOutput(task_id=…) alone is malformed. The local_agent bullet redirects to the Agent tool result and says Do NOT Read the .output file.";

export const FILLER_EXAMPLES = Object.freeze([
  'echo "waiting…"',
  'echo "idle"',
  "jcmd -l",
  'echo "standing by…"',
  'echo "no further polling…"',
]);

export const COUSINS = Object.freeze([
  {
    issue: 88001,
    title: "notification lost; coordinator messages the agent mid-run",
    citeOnly: true,
    why: "wake-lost cousin — inverse of false completed-while-parked",
  },
  {
    issue: 91503,
    title: "queued completion has no idle-wake consumer; subagent hangs",
    citeOnly: true,
    why: "no idle-wake consumer / hang — inverse; agent here was re-invoked",
  },
  {
    issue: 76594,
    title: "wake enqueued then removed undelivered; never resumed",
    citeOnly: true,
    why: "wake removed — inverse of a wake that arrived with a false status",
  },
  {
    issue: 92095,
    title: "Oubliette — void against a cold parent",
    citeOnly: true,
    why: "Oubliette already shipped; cold-parent drain, not false completed",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "recension",
  "mirage",
  "remora",
  "oubliette",
  "ephemera",
  "hangfire",
  "deadletter",
  "ukase",
  "mailslot",
  "scabbard",
  "cenotaph",
  "homestead",
  "quill",
  "colophon",
  "sallyport",
  "procrustes",
  "cadastre",
  "rubric",
]);

/**
 * Published clocks from #92952 only. The sleep-150 repro and the
 * 109s / 46s unprompted re-invokes are both in the issue body; they
 * are not claimed to be the same run.
 */
export const TIMELINE = Object.freeze([
  {
    t: "spawn",
    event: "spawn",
    prompt:
      "Run `sleep 150` as a background Bash task (run_in_background: true). Then tell me its task id and stop; report the result once it finishes.",
  },
  {
    t: "filler",
    event: "filler-calls",
    fillerCalls: FILLER_CALLS,
    fillerSeconds: FILLER_SECONDS,
    examples: FILLER_EXAMPLES,
  },
  {
    t: "park",
    event: "park",
    status: "parked",
    liveBackgroundChildren: 1,
    backgroundRunning: true,
    sleepStillRunning: true,
    result: PARK_RESULT,
  },
  {
    t: "seconds",
    event: "false-complete",
    status: "completed",
    summary: 'Agent "…" finished',
    note: NOTE_TEXT,
    result: PARK_RESULT,
    liveBackgroundChildren: 1,
    backgroundRunning: true,
    sleepStillRunning: true,
    tokens: FIRST_TOKENS,
    toolUses: FIRST_TOOL_USES,
    durationMs: FIRST_DURATION_MS,
    notificationIndex: 1,
  },
  {
    t: "+109s",
    event: "reinvoke",
    unprompted: true,
    seconds: REINVOKE_FIRST_S,
  },
  {
    t: "+46s",
    event: "reinvoke",
    unprompted: true,
    seconds: REINVOKE_SECOND_S,
  },
  {
    t: "second",
    event: "true-complete",
    status: "completed",
    liveBackgroundChildren: 0,
    backgroundRunning: false,
    sleepStillRunning: false,
    tokens: SECOND_TOKENS,
    toolUses: SECOND_TOOL_USES,
    notificationIndex: 2,
    priorTokens: FIRST_TOKENS,
    priorToolUses: FIRST_TOOL_USES,
  },
  {
    t: "+2s",
    event: "task-stop",
    taskStop: true,
    secondsAfterReportedSuccess: TASKSTOP_AFTER_S,
    contendingRebuild: true,
  },
]);

export function usageRise(firstTokens, secondTokens, firstTools, secondTools) {
  const tokens = Number(secondTokens) - Number(firstTokens);
  const tools = Number(secondTools) - Number(firstTools);
  return {
    tokens: Number.isFinite(tokens) ? tokens : 0,
    tools: Number.isFinite(tools) ? tools : 0,
    rose: tokens > 0 || tools > 0,
  };
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    status: "parked",
    summary: "1 background task still running; you will be notified again",
    note: HONEST_NOTE,
    result: HONEST_RESULT,
    liveBackgroundChildren: 1,
    backgroundRunning: true,
    sleepStillRunning: true,
    tokens: FIRST_TOKENS,
    toolUses: FIRST_TOOL_USES,
    durationMs: FIRST_DURATION_MS,
    notificationIndex: 1,
  };
}

export function seedParked() {
  return { ...emptyTicket() };
}

export function seedEpitaphed() {
  return {
    seed: PATH_WORD,
    status: "completed",
    summary: 'Agent "…" finished',
    note: NOTE_TEXT,
    result: PARK_RESULT,
    liveBackgroundChildren: 1,
    backgroundRunning: true,
    sleepStillRunning: true,
    tokens: FIRST_TOKENS,
    toolUses: FIRST_TOOL_USES,
    durationMs: FIRST_DURATION_MS,
    notificationIndex: 1,
  };
}

export function seedInscribed() {
  return {
    seed: SEEDED_WORD,
    status: "completed",
    summary: 'Agent "…" finished',
    note: NOTE_TEXT,
    result: "background Bash completed; agent reported",
    liveBackgroundChildren: 0,
    backgroundRunning: false,
    sleepStillRunning: false,
    tokens: SECOND_TOKENS,
    toolUses: SECOND_TOOL_USES,
    notificationIndex: 2,
    priorTokens: FIRST_TOKENS,
    priorToolUses: FIRST_TOOL_USES,
  };
}

export function normalizeEnvelope(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      status: null,
      summary: null,
      note: null,
      result: null,
      liveBackgroundChildren: 0,
      backgroundRunning: false,
      sleepStillRunning: false,
      tokens: null,
      toolUses: null,
      durationMs: null,
      notificationIndex: null,
    };
  }
  const live =
    raw.liveBackgroundChildren != null
      ? Number(raw.liveBackgroundChildren)
      : raw.backgroundRunning === true || raw.sleepStillRunning === true
        ? 1
        : 0;
  return {
    status: raw.status || null,
    summary: raw.summary || null,
    note: raw.note || null,
    result: raw.result || raw.utterance || null,
    liveBackgroundChildren: Number.isFinite(live) ? live : 0,
    backgroundRunning: raw.backgroundRunning === true || live > 0,
    sleepStillRunning: raw.sleepStillRunning === true,
    tokens: raw.tokens ?? raw.subagent_tokens ?? null,
    toolUses: raw.toolUses ?? raw.tool_uses ?? null,
    durationMs: raw.durationMs ?? raw.duration_ms ?? null,
    notificationIndex: raw.notificationIndex ?? raw.notification ?? null,
    priorTokens: raw.priorTokens ?? null,
    priorToolUses: raw.priorToolUses ?? null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    fillerCalls: raw.fillerCalls ?? null,
    taskStop: raw.taskStop === true,
    unprompted: raw.unprompted === true,
    seconds: raw.seconds ?? null,
  };
}

function isParkingUtterance(result) {
  const text = String(result || "");
  return /stop polling|wait for the background|I'll stop/i.test(text);
}

function finishedWord(summary) {
  return /finished/i.test(String(summary || ""));
}

function noteDeniesLiveChildren(note) {
  return /no live background children/i.test(String(note || ""));
}

function hasEnvelopeFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.status != null ||
        ticket.result != null ||
        ticket.summary != null ||
        ticket.liveBackgroundChildren != null ||
        ticket.backgroundRunning != null ||
        ticket.sleepStillRunning != null ||
        ticket.event),
  );
}

/**
 * Score one task-notification envelope against the living child.
 * parked: honest parked / waiting / idle while a background child is live.
 * epitaphed: status=completed (and usually "finished") while a child is live.
 * inscribed: second completed after the real finish; usage counters rose.
 */
export function scoreEnvelope(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeEnvelope(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const live = row.liveBackgroundChildren;
  const childLive = live > 0 || row.backgroundRunning || row.sleepStillRunning;
  const rise = usageRise(
    row.priorTokens ?? FIRST_TOKENS,
    row.tokens ?? FIRST_TOKENS,
    row.priorToolUses ?? FIRST_TOOL_USES,
    row.toolUses ?? FIRST_TOOL_USES,
  );
  const second =
    row.notificationIndex === 2 ||
    row.event === "true-complete" ||
    ticket.seed === "inscribed";
  const parking = isParkingUtterance(row.result);
  const finished = finishedWord(row.summary);
  const noteLie = noteDeniesLiveChildren(row.note) && childLive;

  let verdict = IDLE_WORD;
  if (
    (second || row.event === "true-complete") &&
    row.status === "completed" &&
    !childLive
  ) {
    verdict = "inscribed";
  } else if (row.status === "completed" && childLive) {
    verdict = "epitaphed";
  } else if (
    (row.status === "parked" ||
      row.status === "waiting" ||
      row.status === "idle") &&
    childLive
  ) {
    verdict = "parked";
  } else if (row.event === "false-complete" && childLive) {
    verdict = "epitaphed";
  } else if (row.event === "park" && childLive) {
    verdict = "parked";
  } else if (row.status === "completed" && !childLive && rise.rose && second) {
    verdict = "inscribed";
  }

  if (seeded && (!hasEnvelopeFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    parked: verdict === "parked",
    epitaphed: verdict === "epitaphed",
    inscribed: verdict === "inscribed",
    childLive,
    liveBackgroundChildren: live,
    status: row.status,
    summary: row.summary,
    result: row.result,
    note: row.note,
    parkingUtterance: parking,
    finishedWord: finished,
    noteContradicts: noteLie,
    tokens: row.tokens,
    toolUses: row.toolUses,
    durationMs: row.durationMs,
    notificationIndex: row.notificationIndex,
    usageRise: rise,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit parked" : "score epitaphed",
  };
}

export function scoreTimeline(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.timeline)
      ? ticket.timeline
      : TIMELINE;
  const scored = rows.map((row) => ({
    ...normalizeEnvelope(row),
    ...scoreEnvelope({ ...row, preferSeed: false }),
  }));
  const epitaphed = scored.filter((row) => row.verdict === "epitaphed");
  const inscribed = scored.filter((row) => row.verdict === "inscribed");
  const parked = scored.filter((row) => row.verdict === "parked");
  const headline =
    scored.find((row) => row.event === "false-complete") ||
    epitaphed[0];
  let verdict = "parked";
  if (epitaphed.length) verdict = "epitaphed";
  else if (inscribed.length && !parked.length) verdict = "inscribed";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "parked",
    alarm: verdict !== "parked",
    epitaphedCount: epitaphed.length,
    inscribedCount: inscribed.length,
    parkedCount: parked.length,
    headline,
    rows: scored,
    phrase: verdict === "parked" ? "admit parked" : "score epitaphed",
    note: headline
      ? "first <task-notification> carved status=completed while the background Bash child was still live"
      : "published park / false-complete / re-invoke / true-complete clocks scored against the living child",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "parked" &&
    seeded !== "epitaphed" &&
    seeded !== "inscribed" &&
    !ticket.status &&
    !ticket.rows
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.timeline)) {
    return scoreTimeline(ticket).verdict;
  }
  return scoreEnvelope(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.timeline);
  const scored = multi ? scoreTimeline(ticket) : scoreEnvelope(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasEnvelopeFields(ticket) && !multi
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
    noteText: NOTE_TEXT,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.status ? `status=${result.status}` : "status=?",
    result.childLive ? "child=live" : "child=none",
    result.tokens != null ? `tok=${result.tokens}` : "tok=?",
    result.finishedWord ? "finished" : "unfinished",
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
      version: VERSION,
      os: OS_NAME,
      surface: SURFACE,
      bash: BASH_TOOL,
      platform: PLATFORM,
      model: MODEL,
      envelope: {
        status: "completed",
        summary: 'Agent "…" finished',
        note: NOTE_TEXT,
        result: PARK_RESULT,
        tokens: FIRST_TOKENS,
        toolUses: FIRST_TOOL_USES,
        durationMs: FIRST_DURATION_MS,
      },
      usageRise: {
        tokens: `${FIRST_TOKENS}→${SECOND_TOKENS}`,
        tools: `${FIRST_TOOL_USES}→${SECOND_TOOL_USES}`,
      },
      reinvokes: [REINVOKE_FIRST_S, REINVOKE_SECOND_S],
      sleepSeconds: SLEEP_SECONDS,
      fillerCalls: FILLER_CALLS,
      fillerSeconds: FILLER_SECONDS,
      taskStopAfterS: TASKSTOP_AFTER_S,
      hypothesis:
        "the \"no live background children\" check does not account the agent's own background Bash child toward the agent, so parking looks like completion",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
