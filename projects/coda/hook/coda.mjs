/**
 * Coda — splice desk for silently dropped assistant / subagent text.
 * The work was generated. The parent received a fragment, or nothing. The loss looks like success.
 * A last text block is not a hold. max_tokens is not a truncation marker.
 * Swallowed mid-turn text cannot be spliced from the JSONL — it was never persisted.
 * Verdicts: intact | snip | split | void | swallow | raw. Idle word is intact.
 * Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock.
 */

export const VERDICTS = Object.freeze(["intact", "snip", "split", "void", "swallow", "raw"]);
export const IDLE_WORD = "intact";
export const ALARM_VERDICTS = Object.freeze(["snip", "split", "void", "swallow", "raw"]);

export function emptyGalley() {
  return {
    session: "",
    delivered: "",
    whole: "",
    claimed: "",
    persisted: true,
    rawJsonl: false,
    recovered: false,
    blocks: [],
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "intact-1") {
  return {
    action: "mark",
    session,
    galley: emptyGalley(),
  };
}

function cloneBlock(raw = {}) {
  return {
    type: String(raw.type || "text"),
    text: raw.text != null ? String(raw.text) : "",
    name: raw.name != null ? String(raw.name) : "",
    stopReason: raw.stopReason != null ? String(raw.stopReason) : "",
  };
}

function cloneGalley(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyGalley();
  const base = emptyGalley();
  const blocks = Array.isArray(src.blocks) ? src.blocks.map(cloneBlock) : [];
  const delivered = src.delivered != null ? String(src.delivered) : "";
  const whole = src.whole != null && String(src.whole) !== "" ? String(src.whole) : "";
  return {
    ...base,
    ...src,
    session: src.session != null ? String(src.session) : "",
    delivered,
    whole,
    claimed: src.claimed != null ? String(src.claimed) : "",
    persisted: src.persisted !== false,
    rawJsonl: Boolean(src.rawJsonl),
    recovered: Boolean(src.recovered),
    blocks,
    source: src.source != null ? String(src.source) : "",
    issue: src.issue ?? null,
  };
}

function withWhole(galley) {
  if (galley.whole) return galley;
  const fromBlocks = textOf(galley.blocks);
  return fromBlocks ? { ...galley, whole: fromBlocks } : galley;
}

export function textOf(blocks = []) {
  return (Array.isArray(blocks) ? blocks : [])
    .filter((block) => block && block.type === "text")
    .map((block) => (block.text != null ? String(block.text) : ""))
    .join("");
}

export function lastText(blocks = []) {
  const texts = (Array.isArray(blocks) ? blocks : [])
    .filter((block) => block && block.type === "text")
    .map((block) => (block.text != null ? String(block.text) : ""))
    .filter((text) => text !== "");
  return texts.length ? texts[texts.length - 1] : "";
}

export function looksLikeJsonl(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed.startsWith("{") && /"type"\s*:\s*"(assistant|user|system|tool_use)"/.test(trimmed);
}

export function verdictOf(galley = {}) {
  const g = withWhole(cloneGalley(galley));
  const delivered = g.delivered;
  const whole = g.whole;
  const blocks = g.blocks;

  if (g.rawJsonl || looksLikeJsonl(delivered)) return "raw";
  if (g.persisted === false) return "swallow";
  if (g.recovered && delivered && whole && delivered === whole) return "intact";

  const last = blocks[blocks.length - 1];
  if (last && last.type === "tool_use" && delivered === "") return "void";

  const hitMaxTokens = blocks.some((block) => block.stopReason === "max_tokens");
  if (hitMaxTokens && delivered && whole && delivered !== whole && delivered === lastText(blocks)) {
    return "split";
  }

  if (whole && delivered !== whole) return "snip";
  if (!delivered && whole) return "snip";
  return "intact";
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const galleySrc = src.galley && typeof src.galley === "object" ? src.galley : payload.galley;
  const fromFields = galleySrc && typeof galleySrc === "object" ? galleySrc : src;
  const galley = cloneGalley({
    session: fromFields.session ?? src.session ?? payload.session,
    delivered: fromFields.delivered ?? src.delivered ?? payload.delivered,
    whole: fromFields.whole ?? src.whole ?? payload.whole,
    claimed: fromFields.claimed ?? src.claimed ?? payload.claimed,
    persisted: fromFields.persisted ?? src.persisted ?? payload.persisted,
    rawJsonl: fromFields.rawJsonl ?? src.rawJsonl ?? payload.rawJsonl,
    recovered: fromFields.recovered ?? src.recovered ?? payload.recovered,
    blocks: fromFields.blocks ?? src.blocks ?? payload.blocks,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "mark"),
    session: String(src.session ?? payload.session ?? galley.session ?? ""),
    galley,
    issue: src.issue ?? payload.issue ?? galley.issue ?? null,
    source: src.source ?? payload.source ?? galley.source ?? "",
  };
}

function ratio(delivered, whole) {
  const deliveredChars = delivered.length;
  const wholeChars = whole.length;
  if (wholeChars === 0) return deliveredChars === 0 ? 1 : 0;
  return Number((deliveredChars / wholeChars).toFixed(4));
}

function pack(verdict, galley, action) {
  const next = withWhole(cloneGalley(galley));
  const delivered = next.delivered;
  const whole = next.whole;
  const deliveredChars = delivered.length;
  const wholeChars = whole.length;
  return {
    ok: true,
    product: "coda",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    delivered,
    whole,
    claimed: next.claimed,
    persisted: next.persisted,
    rawJsonl: next.rawJsonl,
    recovered: next.recovered,
    completeness: ratio(delivered, whole),
    lost: Math.max(0, wholeChars - deliveredChars),
    deliveredChars,
    wholeChars,
    blocks: next.blocks,
    galley: next,
  };
}

function numberedLines(from, to) {
  const lines = [];
  for (let n = from; n <= to; n += 1) lines.push(String(n));
  return lines.join("\n");
}

function serialLines(from, to, skip) {
  const lines = [];
  for (let n = from; n <= to; n += 1) {
    if (n === skip) continue;
    lines.push(`S-${String(n).padStart(4, "0")}`);
  }
  return lines.join("\n");
}

function seedGalley(issue, source, extras = {}) {
  const blocks = Array.isArray(extras.blocks) ? extras.blocks.map(cloneBlock) : [];
  const delivered = extras.delivered != null ? String(extras.delivered) : "";
  const whole = extras.whole != null ? String(extras.whole) : textOf(blocks);
  const session = extras.session || `galley-${issue}`;
  return {
    action: extras.action || "mark",
    session,
    issue,
    source,
    galley: {
      session,
      delivered,
      whole,
      claimed: extras.claimed != null ? String(extras.claimed) : "",
      persisted: extras.persisted !== false,
      rawJsonl: Boolean(extras.rawJsonl),
      recovered: Boolean(extras.recovered),
      blocks,
      source,
      issue,
    },
  };
}

/** max_tokens split; only the last assistant message reached the parent. claude-code#81838. */
export function seed81838() {
  const first = `${numberedLines(1, 953)}\n`;
  const last = numberedLines(954, 1200);
  return seedGalley(81838, "anthropics/claude-code#81838", {
    delivered: last,
    blocks: [
      { type: "text", text: first, stopReason: "max_tokens" },
      { type: "text", text: last, stopReason: "end_turn" },
    ],
  });
}

/** last text before tool_use delivered; earlier "## Verdict" block dropped. claude-code#58109. */
export function seed58109() {
  const last = "Let me also examine that...";
  return seedGalley(58109, "anthropics/claude-code#58109", {
    delivered: last,
    blocks: [
      { type: "text", text: "## Verdict\nThe branch is safe to merge, with two caveats." },
      { type: "text", text: last },
      { type: "tool_use", name: "TaskUpdate" },
    ],
  });
}

/** terminal tool_use; all text lost. claude-code#20190. */
export function seed20190() {
  return seedGalley(20190, "anthropics/claude-code#20190", {
    delivered: "",
    blocks: [
      { type: "text", text: "---RESULT---\nSteerTrue header and the structured findings.\n---END---" },
      { type: "tool_use", name: "TaskUpdate" },
    ],
  });
}

/** mid-turn text never persisted; cannot splice from JSONL. claude-code#74260. */
export function seed74260() {
  return seedGalley(74260, "anthropics/claude-code#74260", {
    delivered: "",
    claimed: "Did you review the list printed above?",
    persisted: false,
    blocks: [
      { type: "thinking", text: "compose the list" },
      { type: "thinking", text: "ask if they saw it" },
      { type: "tool_use", name: "AskUserQuestion" },
    ],
  });
}

/** TaskOutput returned JSONL instead of the summary. claude-code#17591. */
export function seed17591() {
  return seedGalley(17591, "anthropics/claude-code#17591", {
    delivered:
      '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Bash"}]}}\n{"type":"user","message":{"content":[{"type":"tool_result"}]}}',
    rawJsonl: true,
    blocks: [
      { type: "text", text: "--- RESULT ---\nThe findings are in the summary, not the transcript." },
    ],
  });
}

/** middle line missing from a numbered list. openai/codex#24849. */
export function seed24849() {
  const whole = serialLines(1, 400);
  const delivered = serialLines(1, 400, 391);
  return seedGalley(24849, "openai/codex#24849", {
    delivered,
    whole,
    blocks: [{ type: "text", text: whole }],
  });
}

const SEEDS = {
  81838: seed81838,
  58109: seed58109,
  20190: seed20190,
  74260: seed74260,
  17591: seed17591,
  24849: seed24849,
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
  let galley = withWhole(cloneGalley(action.galley));

  if (action.action === "clear") {
    return pack("intact", emptyGalley(), { ...action, action: "clear" });
  }

  if (action.action === "splice") {
    if (galley.persisted === false) {
      galley = { ...galley, recovered: false };
    } else if ((galley.rawJsonl || looksLikeJsonl(galley.delivered)) && galley.whole) {
      galley = { ...galley, delivered: galley.whole, rawJsonl: false, recovered: true };
    } else if (galley.whole) {
      galley = { ...galley, delivered: galley.whole, recovered: true };
    } else {
      galley = { ...galley, recovered: false };
    }
  }

  return pack(verdictOf(galley), galley, action);
}
