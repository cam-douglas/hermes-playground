/**
 * Hasp — file lease / compare-and-swap.
 * Seize a path before Write. Last writer must not silently win.
 * Verdicts: loose | seized | yield | stale | clobber. Idle word is loose.
 * Not a muster. Not a claim-vs-reality probe. Not a fuse. Not DLP. Not a grant inbox.
 */

export const VERDICTS = Object.freeze(["loose", "seized", "yield", "stale", "clobber"]);
export const IDLE_WORD = "loose";
export const DEFAULT_TTL_MS = 15 * 60 * 1000;

export function emptyBoard() {
  return { leases: {} };
}

export function emptyAction(session = "loose-1") {
  return { action: "inspect", session, path: "" };
}

function nowOf(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}

function ttlOf(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : DEFAULT_TTL_MS;
}

function cloneBoard(board) {
  const leases = {};
  const raw = readLeases(board);
  for (const [path, lease] of Object.entries(raw)) {
    leases[path] = { ...lease };
  }
  return { leases };
}

function readLeases(board) {
  if (!board || typeof board !== "object") return {};
  if (board.leases && typeof board.leases === "object") return board.leases;
  if (typeof board.path === "string" && board.path && board.holder) {
    return { [board.path]: board };
  }
  const out = {};
  for (const [key, value] of Object.entries(board)) {
    if (key === "leases") continue;
    if (value && typeof value === "object" && value.holder) out[key] = { ...value, path: value.path || key };
  }
  return out;
}

function normalizeLease(raw, path, now) {
  if (!raw || typeof raw !== "object" || !raw.holder) return null;
  return {
    path: String(raw.path || path || ""),
    holder: String(raw.holder),
    hash: String(raw.hash ?? raw.currentHash ?? ""),
    seizedAt: typeof raw.seizedAt === "number" ? raw.seizedAt : now,
    ttlMs: ttlOf(raw.ttlMs),
  };
}

function getLease(board, path, now) {
  if (!path) return null;
  const leases = readLeases(board);
  return normalizeLease(leases[path], path, now);
}

function isExpired(lease, now) {
  if (!lease) return true;
  return now > lease.seizedAt + lease.ttlMs;
}

function isFree(lease, now) {
  return !lease || isExpired(lease, now);
}

function putLease(board, path, lease) {
  const next = cloneBoard(board);
  next.leases[path] = {
    path,
    holder: lease.holder,
    hash: lease.hash ?? "",
    seizedAt: lease.seizedAt,
    ttlMs: lease.ttlMs,
  };
  return next;
}

function dropLease(board, path) {
  const next = cloneBoard(board);
  delete next.leases[path];
  return next;
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  return {
    action: String((nested ? nested.action : payload.action) || "inspect"),
    session: String(src.session ?? payload.session ?? ""),
    path: String(src.path ?? payload.path ?? ""),
    expectedHash: src.expectedHash ?? payload.expectedHash,
    nextHash: src.nextHash ?? payload.nextHash,
    now: src.now ?? payload.now,
    ttlMs: src.ttlMs ?? payload.ttlMs,
    board: src.board ?? payload.board,
    issue: src.issue ?? payload.issue ?? null,
    source: src.source ?? payload.source ?? "",
  };
}

function pack(verdict, board, action, extras = {}) {
  const path = action.path || extras.path || "";
  const now = nowOf(action.now);
  const lease = extras.lease === undefined ? getLease(board, path, now) : extras.lease;
  const holder = extras.holder !== undefined ? extras.holder : lease?.holder ?? null;
  const currentHash = extras.currentHash !== undefined ? extras.currentHash : lease?.hash ?? null;
  return {
    ok: true,
    product: "hasp",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: verdict === "clobber",
    action: action.action,
    session: action.session || "",
    path,
    holder,
    currentHash,
    expectedHash: action.expectedHash ?? null,
    nextHash: action.nextHash ?? null,
    board,
    ttlMs: lease?.ttlMs ?? ttlOf(action.ttlMs),
    seizedAt: lease?.seizedAt ?? null,
    expired: lease ? isExpired(lease, now) : true,
    issue: action.issue ?? null,
    source: action.source || "",
  };
}

export function applyInspect(board = emptyBoard(), action = emptyAction()) {
  const now = nowOf(action.now);
  const path = action.path || "";
  if (!path) return pack("loose", cloneBoard(board), { ...action, path: "" }, { holder: null, currentHash: null, lease: null });
  const lease = getLease(board, path, now);
  if (isFree(lease, now)) {
    return pack("loose", cloneBoard(board), action, { holder: null, currentHash: lease?.hash ?? null, lease: null });
  }
  return pack("seized", cloneBoard(board), action, { lease });
}

export function applySeize(board = emptyBoard(), action = emptyAction()) {
  const now = nowOf(action.now);
  const path = action.path || "";
  if (!path) return pack("loose", cloneBoard(board), action, { holder: null, currentHash: null, lease: null });
  const lease = getLease(board, path, now);
  if (!isFree(lease, now) && lease.holder !== action.session) {
    return pack("yield", cloneBoard(board), action, { lease });
  }
  const hash = action.nextHash ?? action.expectedHash ?? lease?.hash ?? "";
  const next = putLease(board, path, {
    holder: action.session,
    hash,
    seizedAt: now,
    ttlMs: ttlOf(action.ttlMs ?? lease?.ttlMs),
  });
  return pack("seized", next, action);
}

export function applyWrite(board = emptyBoard(), action = emptyAction()) {
  const now = nowOf(action.now);
  const path = action.path || "";
  if (!path) return pack("loose", cloneBoard(board), action, { holder: null, currentHash: null, lease: null });
  const lease = getLease(board, path, now);
  if (isFree(lease, now)) {
    const next = putLease(board, path, {
      holder: action.session,
      hash: action.nextHash ?? action.expectedHash ?? lease?.hash ?? "",
      seizedAt: now,
      ttlMs: ttlOf(action.ttlMs ?? lease?.ttlMs),
    });
    return pack("seized", next, action);
  }
  if (lease.holder !== action.session) {
    return pack("clobber", cloneBoard(board), action, { lease });
  }
  if (action.expectedHash != null && String(action.expectedHash) !== String(lease.hash)) {
    return pack("stale", cloneBoard(board), action, { lease });
  }
  const next = putLease(board, path, {
    ...lease,
    hash: action.nextHash ?? lease.hash,
  });
  return pack("seized", next, action);
}

export function applyRelease(board = emptyBoard(), action = emptyAction()) {
  const now = nowOf(action.now);
  const path = action.path || "";
  if (!path) return pack("loose", cloneBoard(board), action, { holder: null, currentHash: null, lease: null });
  const lease = getLease(board, path, now);
  if (isFree(lease, now)) {
    return pack("loose", dropLease(board, path), action, { holder: null, currentHash: null, lease: null });
  }
  if (lease.holder !== action.session) {
    return pack("yield", cloneBoard(board), action, { lease });
  }
  return pack("loose", dropLease(board, path), action, { holder: null, currentHash: null, lease: null });
}

function seedWrite({ issue, source, path, holder, hash, session, expectedHash, nextHash }) {
  return {
    action: "write",
    session,
    path,
    expectedHash,
    nextHash,
    issue,
    source,
    board: {
      path,
      holder,
      hash,
      currentHash: hash,
      seizedAt: Date.now(),
      ttlMs: DEFAULT_TTL_MS,
    },
  };
}

/** Two sessions share a worktree path and silently clobber uncommitted work. claude-code#90146. */
export function seed90146() {
  return seedWrite({
    issue: 90146,
    source: "anthropics/claude-code#90146",
    path: ".claude/worktrees/clever-jepsen-93ab22/src/wip.ts",
    holder: "session-a",
    hash: "a1c4e9",
    session: "session-b",
    nextHash: "b9f201",
  });
}

/** Two sessions share ~/.claude; Write silently overwrites memory and rule files. claude-code#85597. */
export function seed85597() {
  return seedWrite({
    issue: 85597,
    source: "anthropics/claude-code#85597",
    path: "~/.claude/rules/catchup.md",
    holder: "session-a",
    hash: "r1a770",
    session: "session-b",
    expectedHash: "r0dead",
    nextHash: "r2bbbb",
  });
}

/** Uncommitted changes silently overwritten when sessions share a worktree. openai/codex#38541. */
export function seed38541() {
  return seedWrite({
    issue: 38541,
    source: "openai/codex#38541",
    path: "apps/web/src/checkout.ts",
    holder: "session-a",
    hash: "c0d3x1",
    session: "session-b",
  });
}

/** Two CLI instances race cap_sid; last writer wins; workspaces become unwriteable. openai/codex#33741. */
export function seed33741() {
  return seedWrite({
    issue: 33741,
    source: "openai/codex#33741",
    path: "C:/Users/codex/.codex/cap_sid",
    holder: "cli-a",
    hash: "sid-aa",
    session: "cli-b",
    nextHash: "sid-bb",
  });
}

const SEEDS = {
  90146: seed90146,
  85597: seed85597,
  38541: seed38541,
  33741: seed33741,
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
  const board = action.board || payload.board || emptyBoard();

  if (action.action === "clear" || !String(action.path || "").trim()) {
    if (action.action === "clear") {
      return pack("loose", emptyBoard(), { ...action, path: "" }, { holder: null, currentHash: null, lease: null });
    }
    return applyInspect(board, { ...action, path: "" });
  }

  if (action.action === "seize") return applySeize(board, action);
  if (action.action === "write") return applyWrite(board, action);
  if (action.action === "release") return applyRelease(board, action);
  return applyInspect(board, action);
}
