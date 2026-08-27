/**
 * Reveille muster — living roster of in-flight agent handles.
 * Heartbeats and artifact claims survive compaction.
 * Duplicate dispatch is HELD. Missed heartbeats are ORPHAN / MISSING.
 * Not a spend fuse. Not a DLP veil. Not a grant inbox.
 */

export const HEARTBEAT_TTL_MS = 90_000;
export const ACTIONS = Object.freeze(["snapshot", "heartbeat", "compact", "dispatch", "clear"]);
export const DECISIONS = Object.freeze(["clear", "hold", "orphan"]);
export const STATES = Object.freeze(["quiet", "mustering", "missing", "held"]);

/** Seeded collision after compaction lost the roll. Evidence: claude-code#90036. */
export function seedCollision(now = Date.now()) {
  const at = Number(now) || Date.now();
  return {
    session: "compact-90036",
    compactionCount: 0,
    ttlMs: HEARTBEAT_TTL_MS,
    now: at,
    roster: [
      {
        id: "implementer",
        role: "implementer",
        artifact: "src/auth/session.ts",
        status: "live",
        lastHeartbeat: at,
        claimed: true,
      },
      {
        id: "tester",
        role: "tester",
        artifact: "tests/auth/session.test.ts",
        status: "live",
        lastHeartbeat: at,
        claimed: true,
      },
      {
        id: "docs",
        role: "docs",
        artifact: "docs/session.md",
        status: "orphaned",
        lastHeartbeat: at - HEARTBEAT_TTL_MS - 1_000,
        claimed: true,
      },
    ],
  };
}

export function emptyRoster(session = "quiet-1", now = Date.now()) {
  return {
    session,
    compactionCount: 0,
    ttlMs: HEARTBEAT_TTL_MS,
    now: Number(now) || Date.now(),
    roster: [],
  };
}

export function normalizeAgent(raw = {}, now = Date.now()) {
  const lastHeartbeat = Number(raw.lastHeartbeat);
  return {
    id: String(raw.id || raw.role || "agent"),
    role: String(raw.role || raw.id || "agent"),
    artifact: String(raw.artifact || ""),
    status: raw.status === "orphaned" || raw.status === "missing" || raw.status === "live"
      ? raw.status
      : "live",
    lastHeartbeat: Number.isFinite(lastHeartbeat) ? lastHeartbeat : now,
    claimed: raw.claimed !== false,
  };
}

export function normalizeRoster(raw = [], now = Date.now()) {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => normalizeAgent(row, now));
}

export function refreshStatuses(roster = [], now = Date.now(), ttlMs = HEARTBEAT_TTL_MS) {
  const at = Number(now) || Date.now();
  const ttl = Number(ttlMs) > 0 ? Number(ttlMs) : HEARTBEAT_TTL_MS;
  return normalizeRoster(roster, at).map((agent) => {
    const stale = at - agent.lastHeartbeat > ttl;
    if (stale) return { ...agent, status: "orphaned" };
    return { ...agent, status: "live" };
  });
}

export function findCollision(roster = [], dispatch = {}) {
  const artifact = String(dispatch.artifact || "");
  if (!artifact) return null;
  const incomingId = dispatch.id ? String(dispatch.id) : "";
  return (
    roster.find((agent) => {
      if (agent.artifact !== artifact) return false;
      if (!agent.claimed) return false;
      if (incomingId && agent.id === incomingId) return false;
      return true;
    }) || null
  );
}

/**
 * Idle / empty word is "quiet". Never the product name.
 * Live claims on the board is "mustering".
 * Missed heartbeats are "missing". Duplicate dispatch is "held".
 */
export function musterState(snapshot = {}) {
  if (snapshot.held || snapshot.collision) return "held";
  const roster = Array.isArray(snapshot.roster) ? snapshot.roster : [];
  if (!roster.length) return "quiet";
  if (roster.some((agent) => agent.status === "orphaned" || agent.status === "missing")) {
    return "missing";
  }
  if (roster.some((agent) => agent.status === "live")) return "mustering";
  return "quiet";
}

function readSnapshot(input = {}, now) {
  const src = input.snapshot && typeof input.snapshot === "object" ? input.snapshot : input;
  return {
    session: String(input.session || src.session || "session"),
    compactionCount: Number(input.compactionCount ?? src.compactionCount ?? 0) || 0,
    ttlMs: Number(input.ttlMs ?? src.ttlMs ?? HEARTBEAT_TTL_MS) || HEARTBEAT_TTL_MS,
    now,
    roster: normalizeRoster(input.roster || src.roster, now),
    held: Boolean(input.held || src.held),
    collision: input.collision || src.collision || null,
  };
}

export function decide(input = {}) {
  const action = ACTIONS.includes(input.action) ? input.action : "snapshot";
  const now = Number(input.now ?? input.snapshot?.now) || Date.now();
  const snapshot = readSnapshot(input, now);

  if (action === "clear") {
    snapshot.roster = [];
    snapshot.held = false;
    snapshot.collision = null;
    snapshot.compactionCount = 0;
  }

  if (action === "compact") {
    snapshot.compactionCount += 1;
    // Compaction MUST NOT wipe the roster. Claims and heartbeats stay.
  }

  if (action === "heartbeat") {
    const target = String(input.heartbeat?.id || input.id || "");
    snapshot.roster = snapshot.roster.map((agent) =>
      agent.id === target
        ? { ...agent, lastHeartbeat: now, status: "live" }
        : agent,
    );
  }

  if (action === "dispatch") {
    const dispatch = input.dispatch || {
      id: input.id,
      role: input.role,
      artifact: input.artifact,
    };
    const incoming = normalizeAgent(
      {
        id: dispatch.id || dispatch.role || `dispatch-${snapshot.roster.length + 1}`,
        role: dispatch.role || dispatch.id || "agent",
        artifact: dispatch.artifact,
        lastHeartbeat: now,
        claimed: true,
        status: "live",
      },
      now,
    );
    const existing = findCollision(snapshot.roster, incoming);
    if (existing) {
      snapshot.held = true;
      snapshot.collision = { incoming, existing };
    } else {
      snapshot.held = false;
      snapshot.collision = null;
      snapshot.roster.push(incoming);
    }
  }

  snapshot.roster = refreshStatuses(snapshot.roster, now, snapshot.ttlMs);
  snapshot.now = now;

  const orphans = snapshot.roster.filter(
    (agent) => agent.status === "orphaned" || agent.status === "missing",
  );
  let decision = "clear";
  if (snapshot.held) decision = "hold";
  else if (orphans.length) decision = "orphan";

  const state = snapshot.held ? "held" : musterState(snapshot);

  return {
    ok: true,
    product: "reveille",
    decision,
    state,
    action,
    snapshot,
    orphans,
    idleWord: state === "quiet" ? "quiet" : state,
  };
}
