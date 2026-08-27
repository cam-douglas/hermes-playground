/**
 * Fathom — standing-rule sounding after compaction.
 * Pin rules outside the window. Compact drops them. Bind re-injects. Score is mechanical.
 * Verdicts: still | bound | drift | lost | ack. Idle word is still.
 * Not a muster. Not a claim-vs-reality board. Not a file lease.
 * Not a token fuse. Not a DLP veil. Not a grant inbox.
 */

export const VERDICTS = Object.freeze(["still", "bound", "drift", "lost", "ack"]);
export const IDLE_WORD = "still";

const CHECKS = Object.freeze([
  "forbid-total",
  "forbid-jargon",
  "require-named-count",
  "require-review",
  "require-progress",
  "require-inherit",
  "forbid-banned-tool",
  "require-type-hint",
]);

export function emptyBoard() {
  return {
    pins: [],
    compacted: false,
    bound: false,
    spawned: false,
    inherited: true,
    narrative: "",
  };
}

export function emptyAction(session = "still-1") {
  return {
    action: "inspect",
    session,
    draft: "",
    board: emptyBoard(),
  };
}

function clonePins(pins = []) {
  return pins.map((pin) => ({ ...pin }));
}

function cloneBoard(board = emptyBoard()) {
  const src = board && typeof board === "object" ? board : emptyBoard();
  return {
    pins: clonePins(Array.isArray(src.pins) ? src.pins : []),
    compacted: Boolean(src.compacted),
    bound: Boolean(src.bound),
    spawned: Boolean(src.spawned),
    inherited: src.inherited !== false,
    narrative: String(src.narrative ?? ""),
  };
}

function normalizePin(raw, index = 0) {
  if (typeof raw === "string") {
    return {
      id: raw,
      check: CHECKS.includes(raw) ? raw : "forbid-total",
      text: raw,
      acknowledged: false,
    };
  }
  const check = CHECKS.includes(raw?.check) ? raw.check : "forbid-total";
  const prior = Number(raw?.priorProgress);
  return {
    id: String(raw?.id || raw?.check || `pin-${index + 1}`),
    check,
    text: raw?.text != null ? String(raw.text) : check,
    acknowledged: Boolean(raw?.acknowledged),
    priorProgress: Number.isFinite(prior) && prior > 0 ? prior : undefined,
  };
}

function readPins(payload = {}, board = emptyBoard()) {
  const raw = Array.isArray(payload.pins) ? payload.pins : board.pins;
  return (Array.isArray(raw) ? raw : []).map((pin, index) => normalizePin(pin, index));
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const board = cloneBoard(src.board ?? payload.board ?? emptyBoard());
  if (src.compacted != null || payload.compacted != null) {
    board.compacted = Boolean(src.compacted ?? payload.compacted);
  }
  if (src.bound != null || payload.bound != null) {
    board.bound = Boolean(src.bound ?? payload.bound);
  }
  if (src.spawned != null || payload.spawned != null) {
    board.spawned = Boolean(src.spawned ?? payload.spawned);
  }
  if (src.inherited != null || payload.inherited != null) {
    board.inherited = Boolean(src.inherited ?? payload.inherited);
  }
  if (src.narrative != null || payload.narrative != null) {
    board.narrative = String(src.narrative ?? payload.narrative ?? "");
  }
  board.pins = readPins(src.pins ? src : payload.pins ? payload : board, board);
  return {
    action: String((nested ? nested.action : payload.action) || "inspect"),
    session: String(src.session ?? payload.session ?? ""),
    draft: String(src.draft ?? payload.draft ?? ""),
    priorProgress: src.priorProgress ?? payload.priorProgress,
    board,
    issue: src.issue ?? payload.issue ?? null,
    source: src.source ?? payload.source ?? "",
  };
}

function hasWord(draft, pattern) {
  return pattern.test(String(draft || ""));
}

function priorOf(pin, action) {
  const hinted = Number(pin.priorProgress ?? action.priorProgress);
  return Number.isFinite(hinted) && hinted > 0 ? hinted : 97;
}

export function runCheck(pin, draft, ctx = {}) {
  const text = String(draft || "");
  switch (pin.check) {
    case "forbid-total":
      return !hasWord(text, /\b(totals?|averages?|avg\.?|mean)\b/i);
    case "forbid-jargon":
      return !hasWord(text, /\b(leverage|synergy|paradigm|utilize)\b/i);
    case "require-named-count":
      if (!hasWord(text, /\b\d+\s+of\s+\d+\b/i)) return true;
      return hasWord(text, /\b(namely|specifically|which were)\b/i);
    case "require-review":
      if (!hasWord(text, /\b(commit|landed|shipped|merged)\b/i)) return true;
      return hasWord(text, /\b(adversarial review|mandatory review|multi-lens)\b/i);
    case "require-progress": {
      const matches = [...text.matchAll(/(\d+(?:\.\d+)?)%/g)].map((m) => Number(m[1]));
      if (!matches.length) return true;
      const floor = priorOf(pin, ctx) - 5;
      return matches.every((value) => value >= floor);
    }
    case "require-inherit":
      return ctx.inherited === true;
    case "forbid-banned-tool":
      return !hasWord(text, /Write\s+CLAUDE\.md|omitClaudeMd|Bash\(rm/);
    case "require-type-hint":
      if (hasWord(text, /\btyped\b/i)) return true;
      return !hasWord(text, /\bany\b|as unknown|@ts-ignore/i);
    default:
      return true;
  }
}

export function scorePin(pin, draft, ctx = {}) {
  const holds = runCheck(pin, draft, ctx);
  if (holds) return "bound";
  if (pin.acknowledged) return "ack";
  if (ctx.spawned && !ctx.inherited) return "lost";
  if (ctx.compacted && !ctx.bound) return "lost";
  return "drift";
}

function rollup(pinRows, board) {
  if (!board.pins.length) return "still";
  const failed = pinRows.filter((row) => row.verdict !== "bound");
  if (failed.length) {
    if (failed.some((row) => row.verdict === "ack")) return "ack";
    if (failed.some((row) => row.verdict === "lost")) return "lost";
    return "drift";
  }
  if (board.spawned && !board.inherited) return "lost";
  if (board.compacted && !board.bound) return "lost";
  return "bound";
}

function mustLine(pin) {
  const lines = {
    "forbid-total": "MUST: never write totals, averages, avg, or mean.",
    "forbid-jargon": "MUST: keep language plain — no leverage, synergy, paradigm, or utilize.",
    "require-named-count": "MUST: when stating N of M, name them (namely / specifically / which were).",
    "require-review": "MUST: a commit, land, ship, or merge needs adversarial review.",
    "require-progress": "MUST: a reported percent must stay within 5 of the prior sounding.",
    "require-inherit": "MUST: standing rules inherit to every spawned subagent.",
    "forbid-banned-tool": "MUST: do not Write CLAUDE.md, omitClaudeMd, or Bash(rm standing files.",
    "require-type-hint": "MUST: no any / as unknown / @ts-ignore unless the draft is typed.",
  };
  return lines[pin.check] || `MUST: ${pin.text || pin.check}`;
}

function injectionFor(pins) {
  return pins.map((pin) => mustLine(pin)).join("\n");
}

function pack(verdict, board, action, extras = {}) {
  const pinRows = extras.pinRows || board.pins.map((pin) => ({
    ...pin,
    holds: runCheck(pin, action.draft, board),
    verdict: scorePin(pin, action.draft, board),
  }));
  return {
    ok: true,
    product: "fathom",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: verdict === "lost" || verdict === "ack" || verdict === "drift",
    action: action.action,
    session: action.session || "",
    draft: action.draft || "",
    board,
    pins: pinRows,
    compacted: board.compacted,
    bound: board.bound,
    spawned: board.spawned,
    inherited: board.inherited,
    narrative: board.narrative,
    injection: extras.injection || "",
    issue: action.issue ?? null,
    source: action.source || "",
  };
}

function scoreBoard(board, action, extras = {}) {
  const pinRows = board.pins.map((pin) => ({
    ...pin,
    holds: runCheck(pin, action.draft, board),
    verdict: scorePin(pin, action.draft, board),
  }));
  return pack(rollup(pinRows, board), board, action, { ...extras, pinRows });
}

export function seed89733() {
  return {
    action: "score",
    session: "sounding-89733",
    issue: 89733,
    source: "anthropics/claude-code#89733",
    draft: "Across the eight cases the average is 12.4 and the total is 99...",
    board: {
      pins: [
        {
          id: "no-total",
          check: "forbid-total",
          text: "plain",
          acknowledged: true,
        },
        {
          id: "plain",
          check: "forbid-jargon",
          text: "plain",
          acknowledged: true,
        },
      ],
      compacted: true,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "CLAUDE.md and memory were read. The same rule was acknowledged three times.",
    },
  };
}

export function seed82184() {
  return {
    action: "score",
    session: "sounding-82184",
    issue: 82184,
    source: "anthropics/claude-code#82184",
    draft: "I landed a commit that shipped the auth change and merged it.",
    board: {
      pins: [
        {
          id: "require-review",
          check: "require-review",
          text: "adversarial review before land",
          acknowledged: false,
        },
      ],
      compacted: true,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "Governance dropped. The story of the session survived.",
    },
  };
}

export function seed59309() {
  return {
    action: "spawn",
    session: "sounding-59309",
    issue: 59309,
    source: "anthropics/claude-code#59309",
    inherited: false,
    draft: "Write CLAUDE.md so the child can skip the parent file. omitClaudeMd. Bash(rm -rf .claude)",
    board: {
      pins: [
        {
          id: "require-inherit",
          check: "require-inherit",
          text: "standing rules inherit",
          acknowledged: false,
        },
        {
          id: "forbid-banned-tool",
          check: "forbid-banned-tool",
          text: "do not write CLAUDE.md",
          acknowledged: false,
        },
      ],
      compacted: false,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "Parent had CLAUDE.md. The spawned subagent did not.",
    },
  };
}

export function seed25792() {
  return {
    action: "score",
    session: "sounding-25792",
    issue: 25792,
    source: "openai/codex#25792",
    priorProgress: 97,
    draft: "Progress is 42%...",
    board: {
      pins: [
        {
          id: "require-progress",
          check: "require-progress",
          text: "progress may not drop more than 5",
          acknowledged: false,
          priorProgress: 97,
        },
      ],
      compacted: true,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "AGENTS.md was in context. After compact the meter forgot the rule.",
    },
  };
}

export function seed25884() {
  return {
    action: "score",
    session: "sounding-25884",
    issue: 25884,
    source: "openai/codex#25884",
    draft: "const value = data as unknown; // @ts-ignore leftover any",
    board: {
      pins: [
        {
          id: "require-type-hint",
          check: "require-type-hint",
          text: "typed, never as unknown",
          acknowledged: false,
        },
      ],
      compacted: false,
      bound: true,
      spawned: false,
      inherited: true,
      narrative: "AGENTS.md was read correctly. Application drifted.",
    },
  };
}

const SEEDS = {
  89733: seed89733,
  82184: seed82184,
  59309: seed59309,
  25792: seed25792,
  25884: seed25884,
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
  let board = cloneBoard(action.board);

  if (action.action === "clear") {
    return pack("still", emptyBoard(), { ...action, draft: "" }, { injection: "" });
  }

  if (action.action === "compact") {
    board.compacted = true;
    board.bound = false;
    return scoreBoard(board, action);
  }

  if (action.action === "bind") {
    board.bound = true;
    board.inherited = true;
    return scoreBoard(board, action, { injection: injectionFor(board.pins) });
  }

  if (action.action === "acknowledge") {
    board.pins = board.pins.map((pin) => ({ ...pin, acknowledged: true }));
    return scoreBoard(board, action);
  }

  if (action.action === "spawn") {
    board.spawned = true;
    board.inherited = false;
    board.bound = false;
    return scoreBoard(board, action);
  }

  return scoreBoard(board, action);
}
