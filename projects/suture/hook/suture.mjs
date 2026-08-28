/**
 * Suture — surgical suture tray for torn SSE / streaming turns.
 * A partial turn is not a hold. Last complete tool boundary is the only safe suture point.
 * Detect tears (idle timeout / mid-response close / stall with no message_stop).
 * Snapshot events up to the last complete tool_use↔tool_result pair.
 * Verdicts: sealed | torn | stalled | partial | resumed | discarded. Idle word is sealed.
 * Not Blot. Not Coda. Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock.
 */

export const VERDICTS = Object.freeze(["sealed", "torn", "stalled", "partial", "resumed", "discarded"]);
export const IDLE_WORD = "sealed";
export const ALARM_VERDICTS = Object.freeze(["torn", "stalled", "partial"]);
export const TEAR_KINDS = Object.freeze(["idle_timeout", "stall", "mid_close", "ultraplan"]);

export function emptyTray() {
  return {
    session: "",
    events: [],
    tear: null,
    connection: "",
    messageStop: false,
    recovered: false,
    discarded: false,
    held: false,
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "sealed-1") {
  return {
    action: "mark",
    session,
    tray: emptyTray(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

export function cloneEvent(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    type: asText(src.type),
    kind: asText(src.kind),
    id: asText(src.id),
    name: asText(src.name),
    text: asText(src.text),
    complete: src.complete !== false,
    at: Number(src.at) || 0,
  };
}

export function cloneTear(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    kind: asText(raw.kind),
    message: asText(raw.message),
    at: Number(raw.at) || 0,
  };
}

export function cloneTray(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyTray();
  const base = emptyTray();
  return {
    ...base,
    ...src,
    session: asText(src.session),
    events: Array.isArray(src.events) ? src.events.map(cloneEvent) : [],
    tear: cloneTear(src.tear),
    connection: asText(src.connection),
    messageStop: Boolean(src.messageStop),
    recovered: Boolean(src.recovered),
    discarded: Boolean(src.discarded),
    held: Boolean(src.held),
    source: asText(src.source),
    issue: src.issue ?? null,
  };
}

export function hasMessageStop(events = []) {
  return (Array.isArray(events) ? events : []).some((event) => event && event.type === "message_stop");
}

export function lastCompleteToolBoundary(events = []) {
  let last = -1;
  (Array.isArray(events) ? events : []).forEach((event, index) => {
    if (event && event.type === "tool_result" && event.complete !== false) last = index;
  });
  return last;
}

export function hasIncompleteTool(events = []) {
  const uses = new Set();
  const results = new Set();
  for (const event of Array.isArray(events) ? events : []) {
    if (!event) continue;
    if (event.type === "content_block_start" && event.kind === "tool_use" && event.id) {
      uses.add(event.id);
    }
    if (event.type === "tool_result" && event.complete === false) return true;
    if (event.type === "tool_result" && event.complete !== false && event.id) {
      results.add(event.id);
    }
  }
  for (const id of uses) {
    if (!results.has(id)) return true;
  }
  return false;
}

export function snapshotToCheckpoint(events = []) {
  const index = lastCompleteToolBoundary(events);
  return index >= 0 ? events.slice(0, index + 1).map(cloneEvent) : [];
}

export function verdictOf(tray = {}) {
  const next = cloneTray(tray);
  if (next.discarded) return "discarded";
  if (next.recovered) return "resumed";
  if (!next.events.length && !next.tear) return "sealed";

  const kind = next.tear && next.tear.kind ? next.tear.kind : "";
  if (kind === "idle_timeout" || kind === "ultraplan") return "partial";
  if (kind === "stall") return "stalled";
  if (kind === "mid_close") return "torn";

  if (hasIncompleteTool(next.events)) return "partial";
  const stopped = next.messageStop || hasMessageStop(next.events);
  if (!stopped && next.connection === "open") return "stalled";
  if (!stopped) return "torn";
  return "sealed";
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const traySrc = src.tray && typeof src.tray === "object" ? src.tray : payload.tray;
  const fromFields = traySrc && typeof traySrc === "object" ? traySrc : src;
  const tray = cloneTray({
    session: fromFields.session ?? src.session ?? payload.session,
    events: fromFields.events ?? src.events ?? payload.events,
    tear: fromFields.tear ?? src.tear ?? payload.tear,
    connection: fromFields.connection ?? src.connection ?? payload.connection,
    messageStop: fromFields.messageStop ?? src.messageStop ?? payload.messageStop,
    recovered: fromFields.recovered ?? src.recovered ?? payload.recovered,
    discarded: fromFields.discarded ?? src.discarded ?? payload.discarded,
    held: fromFields.held ?? src.held ?? payload.held,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "mark"),
    session: String(src.session ?? payload.session ?? tray.session ?? ""),
    tray,
    issue: src.issue ?? payload.issue ?? tray.issue ?? null,
    source: src.source ?? payload.source ?? tray.source ?? "",
  };
}

function pack(verdict, tray, action, extras = {}) {
  const next = cloneTray(tray);
  const recovered = extras.recovered != null ? Boolean(extras.recovered) : Boolean(next.recovered);
  const discarded = extras.discarded != null ? Boolean(extras.discarded) : Boolean(next.discarded);
  const held = extras.held != null ? Boolean(extras.held) : Boolean(next.held);
  const events = next.events;
  const checkpoint = lastCompleteToolBoundary(events);
  const incompleteTool = hasIncompleteTool(events);
  const messageStop = next.messageStop || hasMessageStop(events);
  return {
    ok: true,
    product: "suture",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    events,
    tear: next.tear,
    connection: next.connection,
    messageStop,
    recovered,
    discarded,
    held,
    checkpoint,
    incompleteTool,
    tray: { ...next, recovered, discarded, held },
  };
}

function seedTray(issue, source, extras = {}) {
  const events = Array.isArray(extras.events) ? extras.events.map(cloneEvent) : [];
  const session = extras.session != null ? String(extras.session) : String(issue);
  return {
    action: extras.action || "mark",
    session,
    issue,
    source,
    tray: {
      session,
      events,
      tear: cloneTear(extras.tear),
      connection: extras.connection != null ? String(extras.connection) : "",
      messageStop: Boolean(extras.messageStop),
      recovered: Boolean(extras.recovered),
      discarded: Boolean(extras.discarded),
      held: Boolean(extras.held),
      source,
      issue,
    },
  };
}

/** Stream idle timeout after tool_use started; partial text + incomplete tool_result. claude-code#46987. */
export function seed46987() {
  return seedTray(46987, "anthropics/claude-code#46987", {
    session: "46987",
    connection: "closed",
    messageStop: false,
    tear: {
      kind: "idle_timeout",
      message: "API Error: Stream idle timeout - partial response received",
      at: 10,
    },
    events: [
      { type: "message_start", at: 0 },
      { type: "content_block_start", kind: "text", id: "t1", at: 1 },
      { type: "content_block_delta", id: "t1", text: "Inspecting the stream handler.", at: 2 },
      { type: "content_block_stop", id: "t1", at: 3 },
      { type: "content_block_start", kind: "tool_use", id: "tu1", name: "Read", at: 4 },
      { type: "content_block_stop", id: "tu1", at: 5 },
      { type: "tool_result", id: "tu1", complete: true, text: "handler.ts", at: 6 },
      { type: "content_block_start", kind: "text", id: "t2", at: 7 },
      { type: "content_block_delta", id: "t2", text: "Partial: wiring the idle timeout now", at: 8 },
      { type: "content_block_start", kind: "tool_use", id: "tu2", name: "Edit", at: 9 },
      { type: "content_block_delta", id: "tu2", text: "{ path: src/stream.ts", at: 10 },
    ],
  });
}

/** SSE stream stalls without message_stop; connection still open. claude-code#54434. */
export function seed54434() {
  return seedTray(54434, "anthropics/claude-code#54434", {
    connection: "open",
    messageStop: false,
    tear: {
      kind: "stall",
      message: "SSE stream stalls without message_stop",
      at: 8,
    },
    events: [
      { type: "message_start", at: 0 },
      { type: "content_block_start", kind: "text", id: "t1", at: 1 },
      { type: "content_block_delta", id: "t1", text: "Streaming a long plan.", at: 2 },
      { type: "content_block_stop", id: "t1", at: 3 },
      { type: "content_block_start", kind: "tool_use", id: "tu1", name: "Read", at: 4 },
      { type: "content_block_stop", id: "tu1", at: 5 },
      { type: "tool_result", id: "tu1", complete: true, text: "plan.md", at: 6 },
      { type: "content_block_start", kind: "text", id: "t2", at: 7 },
      { type: "content_block_delta", id: "t2", text: "Continuing the plan", at: 8 },
    ],
  });
}

/** Connection closed mid-response after content blocks streamed. claude-code#70217. */
export function seed70217() {
  return seedTray(70217, "anthropics/claude-code#70217", {
    connection: "closed",
    messageStop: false,
    tear: {
      kind: "mid_close",
      message: "API Error: Connection closed mid-response. The response above may be incomplete.",
      at: 5,
    },
    events: [
      { type: "message_start", at: 0 },
      { type: "content_block_start", kind: "text", id: "t1", at: 1 },
      { type: "content_block_delta", id: "t1", text: "The handler should drain the socket.", at: 2 },
      { type: "content_block_stop", id: "t1", at: 3 },
      { type: "content_block_start", kind: "text", id: "t2", at: 4 },
      { type: "content_block_delta", id: "t2", text: "then close", at: 5 },
    ],
  });
}

/** Ultraplan refine timeout; approval UI never appears. claude-code#47252. */
export function seed47252() {
  return seedTray(47252, "anthropics/claude-code#47252", {
    connection: "closed",
    messageStop: false,
    tear: {
      kind: "ultraplan",
      message: "API Error: Stream idle timeout - partial response received",
      at: 5,
    },
    events: [
      { type: "message_start", at: 0 },
      { type: "content_block_start", kind: "text", id: "t1", at: 1 },
      { type: "content_block_delta", id: "t1", text: "Refining the ultraplan.", at: 2 },
      { type: "content_block_stop", id: "t1", at: 3 },
      { type: "content_block_start", kind: "tool_use", id: "tu1", name: "AskUserQuestion", at: 4 },
      { type: "content_block_stop", id: "tu1", at: 5 },
    ],
  });
}

/** SSE hangs indefinitely; no client-side timeout. claude-code#33949. */
export function seed33949() {
  return seedTray(33949, "anthropics/claude-code#33949", {
    connection: "open",
    messageStop: false,
    tear: {
      kind: "stall",
      message: "SSE hangs indefinitely; no client-side timeout; ESC cannot fully cancel",
      at: 2,
    },
    events: [
      { type: "message_start", at: 0 },
      { type: "content_block_start", kind: "text", id: "t1", at: 1 },
      { type: "content_block_delta", id: "t1", text: "Working", at: 2 },
    ],
  });
}

const SEEDS = {
  46987: seed46987,
  54434: seed54434,
  70217: seed70217,
  47252: seed47252,
  33949: seed33949,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let tray = cloneTray(action.tray);

  if (action.action === "clear") {
    return pack("sealed", emptyTray(), { ...action, action: "clear" });
  }

  if (action.action === "discard") {
    tray = {
      ...emptyTray(),
      session: tray.session,
      source: tray.source,
      issue: tray.issue,
      discarded: true,
      recovered: false,
      held: false,
    };
    return pack("discarded", tray, action, { discarded: true, recovered: false, held: false });
  }

  if (action.action === "suture") {
    tray = {
      ...tray,
      events: snapshotToCheckpoint(tray.events),
      recovered: true,
      discarded: false,
      held: false,
      messageStop: true,
    };
    return pack(verdictOf(tray), tray, action, { recovered: true, discarded: false, held: false });
  }

  if (action.action === "hold") {
    tray = { ...tray, held: true };
    return pack(verdictOf(tray), tray, action, { held: true });
  }

  return pack(verdictOf(tray), tray, action);
}
