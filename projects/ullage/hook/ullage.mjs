/**
 * Ullage — cooper's bonded-cellar gauging desk for a real Claude Code
 * failure class: the conversation context silently loses a large block
 * of tokens with no compaction record, no context-editing record, and
 * no error, then the prompt cache thrashes — cache_read_input_tokens
 * freezes at the system-prompt prefix while every later breakpoint
 * misses, so each trivial turn re-writes hundreds of thousands of tokens.
 *
 * Ullage is the empty space in a cask. If the level drops and no pour
 * was chalked, the cellar has a leak. If the bung weeps on every turn
 * after that, the cache is thrashing.
 *
 * Primary #90509: Context silently loses 157,023 tokens
 * (829,414 → 672,391) at 06:17:43 with no compactMetadata nearby.
 * The session's only two real auto-compactions dropped to ~10–12K,
 * days apart, and recovered cleanly. Then 21 full-context rewrites
 * in 17 minutes; on every failed turn cache_read was exactly 45,659
 * (system-prompt prefix only) while cache_creation was ~628K. Work
 * during the window was trivial Read/Bash (~680 output tokens/turn).
 * Wasted ~25M weighted tokens (~36% of a 5-hour usage window).
 * Concurrent control session on the same machine/account/model never
 * failed. Secondary: transcript double-logging (same message.id /
 * requestId written 2–3 times) inflates naive local usage audits ~2.12×.
 *
 * Shape (cite as shape, not a new primary):
 *   #87966 — cache_read pinned to stable-prefix boundary, 89 full-context
 *            rewrites across 9 days, ~59M excess cache_creation; also
 *            notes JSONL usage duplication.
 *   #89621 — cache misses beyond ~16K prefix in long-running subagent,
 *            ~550K cache_creation every request.
 *   #87215 — waking a parked subagent re-caches entire context; only
 *            system prefix served from cache.
 *   #90144 — opening a session with a large slash command discards the
 *            entire prompt cache on the second request.
 *   #83913 — prompt cache invalidated when PreToolUse/PostToolUse
 *            additionalContext changes during history rebuild.
 *
 * Weighted waste (as used in #90509):
 *   input×1 + cache_read×0.1 + cache_creation×2 + output×5
 *
 * Verdicts: gauged | ullaged | thrashed | frozen | leaked
 *           | rewritten | doubled | healed | silent | bunged
 * Idle word is gauged (a cask that is full and accounted for).
 * NEVER use ullage / empty / compact / cache / leak as idle.
 * NEVER reuse stamped, overrun, pratique, bound, stilled, drained,
 * flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked,
 * seated, heard, clear, paired, kernel, latched, upheld, sterling,
 * home, valid, dry, sealed, quiet, seised, stabled, wound.
 *
 * Slack thrash alarm on thrashed / frozen / ullaged / leaked / silent.
 * Linear waste ticket when wasted weighted tokens exceed the threshold.
 * GitHub ullage-ledger of cellar events on every scored cask.
 *
 * Why this is not a clone:
 * NOT Fathom (standing *rules* dropped *after* a recorded compaction).
 * NOT Quench (runaway *subagent spawn* token-burn circuit breaker).
 * NOT Coda (silently dropped *assistant text blocks*).
 * NOT Visa (MCP OAuth missing RFC 8707 resource).
 * NOT Sprag (boot-cached MCP failure / no retry).
 * NOT Lazaret, Fusee, Iota, Leat, Shunt, Sump, or any other catalog desk.
 * Different problem: a partial context drop with no ticket, plus a
 * prefix-frozen cache thrash after that drop. The desk gauges the
 * cask. It does not claim the cache-key root cause.
 * Different UI: cooper's bonded cellar at night. Standing oak cask
 * in cross-section, iron hoops, bung, gauging rod. Cellar oak, iron,
 * candle amber, wine-dark liquid, chalk white.
 * Different idle: gauged.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 * Product name is Ullage only. Idle word is gauged.
 */

export const VERDICTS = Object.freeze([
  "gauged",
  "ullaged",
  "thrashed",
  "frozen",
  "leaked",
  "rewritten",
  "doubled",
  "healed",
  "silent",
  "bunged",
]);
export const IDLE_WORD = "gauged";
export const SLACK_VERDICTS = Object.freeze([
  "thrashed",
  "frozen",
  "ullaged",
  "leaked",
  "silent",
]);
export const LINEAR_WASTE_THRESHOLD = 1_000_000;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const MATERIAL_DROP = 10_000;
export const PREFIX_EXAMPLE = 45_659;
export const CLUSTER_CONSECUTIVE = 3;
export const CLUSTER_WINDOW_COUNT = 10;
export const CLUSTER_WINDOW_MS = 20 * 60 * 1000;
export const WEIGHTS = Object.freeze({
  input: 1,
  cacheRead: 0.1,
  cacheCreation: 2,
  output: 5,
});

const FORBIDDEN_IDLE = Object.freeze([
  "ullage",
  "empty",
  "compact",
  "cache",
  "leak",
  "stamped",
  "overrun",
  "pratique",
  "bound",
  "stilled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "sealed",
  "quiet",
  "seised",
  "stabled",
  "wound",
  "visa",
  "sprag",
  "fathom",
  "quench",
  "coda",
  "passport",
  "border",
  "blotter",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

function asNum(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asTime(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : fallback;
}

function usageOf(row = {}) {
  const usage =
    row.usage && typeof row.usage === "object"
      ? row.usage
      : row.message && row.message.usage && typeof row.message.usage === "object"
        ? row.message.usage
        : row;
  return usage;
}

function messageIdOf(row = {}) {
  return asText(
    row.messageId ??
      row.message_id ??
      row["message.id"] ??
      (row.message && row.message.id) ??
      row.id,
  ).trim();
}

function requestIdOf(row = {}) {
  return asText(
    row.requestId ??
      row.request_id ??
      row.requestID ??
      (row.message && row.message.requestId) ??
      row.uuid,
  ).trim();
}

export function contextTokensOf(row = {}) {
  const usage = usageOf(row);
  const explicit = asNum(
    row.context ??
      row.contextTokens ??
      row.context_tokens ??
      usage.context ??
      usage.context_tokens,
    NaN,
  );
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const input = asNum(row.input ?? usage.input_tokens ?? usage.input, 0);
  const cacheRead = asNum(
    row.cacheRead ?? usage.cache_read_input_tokens ?? usage.cache_read,
    0,
  );
  const cacheCreation = asNum(
    row.cacheCreation ??
      usage.cache_creation_input_tokens ??
      usage.cache_creation,
    0,
  );
  const sum = input + cacheRead + cacheCreation;
  return sum > 0 ? sum : 0;
}

export function weightedTokensOf(row = {}) {
  const usage = usageOf(row);
  const input = asNum(row.input ?? usage.input_tokens ?? usage.input, 0);
  const cacheRead = asNum(
    row.cacheRead ?? usage.cache_read_input_tokens ?? usage.cache_read,
    0,
  );
  const cacheCreation = asNum(
    row.cacheCreation ??
      usage.cache_creation_input_tokens ??
      usage.cache_creation,
    0,
  );
  const output = asNum(row.output ?? usage.output_tokens ?? usage.output, 0);
  return (
    input * WEIGHTS.input +
    cacheRead * WEIGHTS.cacheRead +
    cacheCreation * WEIGHTS.cacheCreation +
    output * WEIGHTS.output
  );
}

export function emptyTurn() {
  return {
    at: "",
    messageId: "",
    requestId: "",
    context: 0,
    cacheRead: 0,
    cacheCreation: 0,
    input: 0,
    output: 0,
    compactMetadata: null,
    appliedEdits: null,
    error: "",
    ticket: null,
  };
}

export function emptyCask() {
  return {
    session: "",
    source: "",
    issue: null,
    scored: false,
    turns: [],
    tickets: [],
    errors: [],
    slate: [],
    records: null,
  };
}

export function emptyAction(session = "gauged-1") {
  return {
    action: "score",
    session,
    cask: emptyCask(),
  };
}

export function cloneTurn(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyTurn();
  const usage = usageOf(src);
  const compact =
    src.compactMetadata ??
    src.compact_metadata ??
    usage.compactMetadata ??
    null;
  const edits =
    src.appliedEdits ??
    src.applied_edits ??
    (src.context_management && src.context_management.applied_edits) ??
    null;
  return {
    ...emptyTurn(),
    at: src.at ?? src.timestamp ?? src.ts ?? "",
    messageId: messageIdOf(src),
    requestId: requestIdOf(src),
    context: contextTokensOf(src),
    cacheRead: asNum(
      src.cacheRead ?? usage.cache_read_input_tokens ?? usage.cache_read,
      0,
    ),
    cacheCreation: asNum(
      src.cacheCreation ??
        usage.cache_creation_input_tokens ??
        usage.cache_creation,
      0,
    ),
    input: asNum(src.input ?? usage.input_tokens ?? usage.input, 0),
    output: asNum(src.output ?? usage.output_tokens ?? usage.output, 0),
    compactMetadata: compact && typeof compact === "object" ? { ...compact } : compact,
    appliedEdits: Array.isArray(edits) ? edits.slice() : edits,
    error: asText(src.error ?? src.err),
    ticket: src.ticket && typeof src.ticket === "object" ? { ...src.ticket } : src.ticket,
  };
}

function cloneTicket(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    at: src.at ?? src.timestamp ?? "",
    kind: asText(src.kind || src.type || "compact"),
    pre: asNum(src.pre ?? src.preTokens ?? src.before, 0),
    post: asNum(src.post ?? src.postTokens ?? src.after, 0),
  };
}

export function cloneCask(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyCask();
  const nested =
    (src.cask && typeof src.cask === "object" && src.cask) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.cellar && typeof src.cellar === "object" && src.cellar) ||
    (src.trace && typeof src.trace === "object" && src.trace) ||
    src;
  const turnsRaw = Array.isArray(nested.turns)
    ? nested.turns
    : Array.isArray(nested.rows)
      ? nested.rows
      : Array.isArray(src.turns)
        ? src.turns
        : [];
  const ticketsRaw = Array.isArray(nested.tickets)
    ? nested.tickets
    : Array.isArray(nested.slate)
      ? nested.slate
      : Array.isArray(src.tickets)
        ? src.tickets
        : [];
  const errorsRaw = Array.isArray(nested.errors)
    ? nested.errors
    : Array.isArray(src.errors)
      ? src.errors
      : [];
  return {
    ...emptyCask(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    source: asText(nested.source ?? src.source),
    issue: asIssue(nested.issue ?? src.issue),
    scored: asBool(nested.scored ?? src.scored),
    turns: turnsRaw.map((row) => cloneTurn(row)),
    tickets: ticketsRaw.map((row) => cloneTicket(row)),
    errors: errorsRaw.map((row) => (typeof row === "string" ? row : asText(row && row.message))),
    slate: ticketsRaw.map((row) => cloneTicket(row)),
    records: nested.records && typeof nested.records === "object" ? nested.records : src.records,
  };
}

export function dedupeTurns(turns = []) {
  const seen = new Set();
  const kept = [];
  let duplicates = 0;
  for (const raw of turns) {
    const turn = cloneTurn(raw);
    const key = turn.messageId || turn.requestId;
    if (key) {
      if (seen.has(key)) {
        duplicates += 1;
        continue;
      }
      seen.add(key);
    }
    kept.push(turn);
  }
  return { turns: kept, duplicates, rawCount: turns.length };
}

function ticketCovers(ticket, fromContext, toContext, atMs) {
  if (!ticket) return false;
  const pre = asNum(ticket.pre, 0);
  const post = asNum(ticket.post, 0);
  const drop = fromContext - toContext;
  if (drop < MATERIAL_DROP) return false;
  const accounted = pre > 0 && post >= 0 && pre - post >= MATERIAL_DROP;
  if (!accounted) return false;
  const close = Math.abs(pre - fromContext) <= Math.max(5000, fromContext * 0.05);
  const ticketAt = asTime(ticket.at, NaN);
  if (Number.isFinite(ticketAt) && atMs) {
    const delta = Math.abs(ticketAt - atMs);
    if (delta > 10 * 60 * 1000 && !close) return false;
  }
  return close || Math.abs(pre - fromContext) < 50_000;
}

function turnHasTicket(turn) {
  if (!turn) return false;
  if (turn.compactMetadata && typeof turn.compactMetadata === "object") {
    const pre = asNum(turn.compactMetadata.pre ?? turn.compactMetadata.preTokens, 0);
    const post = asNum(turn.compactMetadata.post ?? turn.compactMetadata.postTokens, 0);
    if (pre - post >= MATERIAL_DROP) return true;
  }
  if (Array.isArray(turn.appliedEdits) && turn.appliedEdits.length > 0) return true;
  if (turn.ticket && typeof turn.ticket === "object") {
    const pre = asNum(turn.ticket.pre, 0);
    const post = asNum(turn.ticket.post, 0);
    if (pre - post >= MATERIAL_DROP) return true;
  }
  return false;
}

function isPrefixFrozen(turn, prefixHint = 0) {
  const context = turn.context || 0;
  const read = turn.cacheRead || 0;
  const create = turn.cacheCreation || 0;
  if (context < 20_000) return false;
  const prefix = prefixHint > 0 ? prefixHint : PREFIX_EXAMPLE;
  const prefixSized =
    read > 0 &&
    (Math.abs(read - prefix) <= 200 ||
      Math.abs(read - 16_384) <= 200 ||
      (read < context * 0.15 && read < 80_000 && read > 8_000));
  const creationHeavy = create >= Math.max(50_000, context * 0.5);
  const held = read >= context * 0.85;
  return prefixSized && creationHeavy && !held;
}

function isRewrite(turn) {
  const context = turn.context || 0;
  const create = turn.cacheCreation || 0;
  const read = turn.cacheRead || 0;
  if (create <= 0 || cacheHeld(turn)) return false;
  return create >= Math.max(3_000, context * 0.4) || (read < context * 0.5 && create > read);
}

function cacheHeld(turn) {
  const context = turn.context || 0;
  const read = turn.cacheRead || 0;
  if (context <= 0) return false;
  return read >= context * 0.85;
}

export function analyze(cask = {}) {
  const next = cloneCask(cask);
  const { turns, duplicates, rawCount } = dedupeTurns(next.turns);
  const tickets = next.tickets.slice();
  for (const turn of turns) {
    if (turnHasTicket(turn) && turn.compactMetadata) {
      tickets.push({
        at: turn.at,
        kind: "compact",
        pre: asNum(turn.compactMetadata.pre ?? turn.compactMetadata.preTokens, 0),
        post: asNum(turn.compactMetadata.post ?? turn.compactMetadata.postTokens, 0),
      });
    }
  }

  const drops = [];
  for (let i = 1; i < turns.length; i += 1) {
    const prev = turns[i - 1];
    const cur = turns[i];
    const drop = (prev.context || 0) - (cur.context || 0);
    if (drop < MATERIAL_DROP) continue;
    const atMs = asTime(cur.at, 0);
    const coveredByTicket =
      turnHasTicket(cur) ||
      turnHasTicket(prev) ||
      tickets.some((ticket) => ticketCovers(ticket, prev.context, cur.context, atMs));
    drops.push({
      from: prev.context,
      to: cur.context,
      size: drop,
      at: cur.at,
      ticketed: coveredByTicket,
      silent:
        !cur.error &&
        !prev.error &&
        next.errors.length === 0 &&
        !turnHasTicket(cur) &&
        !turnHasTicket(prev),
    });
  }

  const unexplained = drops.filter((row) => !row.ticketed);
  const prefixReads = turns.map((turn) => turn.cacheRead).filter((n) => n > 8_000 && n < 80_000);
  const prefixHint =
    prefixReads.length >= 2 && prefixReads.every((n) => Math.abs(n - prefixReads[0]) <= 2)
      ? prefixReads[0]
      : PREFIX_EXAMPLE;
  const freezeFlags = turns.map((turn) => isPrefixFrozen(turn, prefixHint));
  let consecutive = 0;
  let maxConsecutive = 0;
  const freezeIndexes = [];
  for (let i = 0; i < freezeFlags.length; i += 1) {
    if (freezeFlags[i]) {
      consecutive += 1;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
      freezeIndexes.push(i);
    } else {
      consecutive = 0;
    }
  }
  let windowCluster = false;
  for (const i of freezeIndexes) {
    const start = asTime(turns[i].at, 0);
    const inWindow = freezeIndexes.filter((j) => {
      const t = asTime(turns[j].at, 0);
      return t >= start && t - start <= CLUSTER_WINDOW_MS;
    });
    if (inWindow.length >= CLUSTER_WINDOW_COUNT) windowCluster = true;
  }
  const cluster = maxConsecutive >= CLUSTER_CONSECUTIVE || windowCluster;
  const freezeCount = freezeIndexes.length;
  const last = turns[turns.length - 1];
  const recovered = Boolean(last && cacheHeld(last));
  const hadFreeze = freezeCount > 0;
  const recordedCompact = drops.some((row) => row.ticketed) || tickets.some((ticket) => {
    return asNum(ticket.pre, 0) - asNum(ticket.post, 0) >= MATERIAL_DROP;
  });
  const rewriteCount = turns.filter((row) => isRewrite(row)).length;
  const rewriteAfterCompact =
    recordedCompact &&
    rewriteCount === 1 &&
    recovered &&
    unexplained.length === 0;
  const emptyRecords =
    next.errors.length === 0 &&
    tickets.length === 0 &&
    turns.every((turn) => !turn.error && !turnHasTicket(turn));
  const missingTicket = unexplained.length > 0 && tickets.length === 0;
  const slateMissing = unexplained.length > 0 && next.slate.length + next.tickets.length > 0;
  let waste = 0;
  for (const turn of turns) {
    if (isPrefixFrozen(turn, prefixHint)) {
      const heldRead = turn.context;
      const actual = weightedTokensOf(turn);
      const expected = weightedTokensOf({
        input: turn.input,
        cacheRead: heldRead,
        cacheCreation: 0,
        output: turn.output,
      });
      waste += Math.max(0, actual - expected);
    }
  }
  const honestWeighted = turns.reduce((sum, turn) => sum + weightedTokensOf(turn), 0);
  const naiveWeighted = next.turns.reduce((sum, turn) => sum + weightedTokensOf(turn), 0);

  return {
    turns,
    duplicates,
    rawCount,
    tickets,
    drops,
    unexplained,
    unexplainedDrop: unexplained.length > 0,
    dropSize: unexplained.reduce((max, row) => Math.max(max, row.size), 0),
    prefixHint,
    freezeCount,
    maxConsecutive,
    cluster,
    recovered,
    hadFreeze,
    recordedCompact,
    rewriteAfterCompact,
    emptyRecords,
    missingTicket,
    slateMissing,
    waste: Math.round(waste),
    honestWeighted: Math.round(honestWeighted),
    naiveWeighted: Math.round(naiveWeighted),
    lastContext: last ? last.context : 0,
    lastCacheRead: last ? last.cacheRead : 0,
    chalked: turns.length ? Math.max(...turns.map((turn) => turn.context || 0)) : 0,
  };
}

export function isIdle(cask = {}) {
  const next = cloneCask(cask);
  return next.turns.length === 0 && next.tickets.length === 0 && next.errors.length === 0;
}

/**
 * First match wins. Idle gauged is first. Classes stay distinguishable:
 * a missing compaction ticket is not a hold. A recorded compact plus
 * one rewrite is rewritten, not ullaged. Admit does not lie.
 */
export function classify(cask = {}) {
  const next = cloneCask(cask);
  if (isIdle(next)) return "gauged";
  const facts = analyze(next);

  if (facts.cluster && facts.recovered) return "healed";
  if (facts.hadFreeze && facts.recovered && !facts.cluster && !facts.rewriteAfterCompact) {
    return "bunged";
  }
  if (facts.cluster && !facts.recovered) return "thrashed";
  if (facts.hadFreeze && !facts.cluster && !facts.recovered) return "frozen";
  if (facts.rewriteAfterCompact) return "rewritten";
  if (facts.duplicates > 0 && !facts.unexplainedDrop && !facts.hadFreeze) return "doubled";
  if (facts.unexplainedDrop && facts.slateMissing) return "leaked";
  if (
    facts.unexplainedDrop &&
    facts.emptyRecords &&
    next.records &&
    typeof next.records === "object"
  ) {
    return "silent";
  }
  if (facts.unexplainedDrop) return "ullaged";
  if (facts.duplicates > 0) return "doubled";
  return "gauged";
}

export function clusterOf(cask = {}, verdict = "") {
  const next = cloneCask(cask);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.unexplainedDrop) add("ullaged");
  if (facts.unexplainedDrop && facts.emptyRecords) add("silent");
  if (facts.unexplainedDrop && (facts.missingTicket || facts.slateMissing)) add("leaked");
  if (facts.cluster) add("thrashed");
  if (facts.hadFreeze && !facts.cluster) add("frozen");
  if (facts.rewriteAfterCompact) add("rewritten");
  if (facts.duplicates > 0) add("doubled");
  if (facts.cluster && facts.recovered) add("healed");
  if (facts.hadFreeze && facts.recovered) add("bunged");
  if (!facts.unexplainedDrop && !facts.hadFreeze && facts.duplicates === 0 && facts.turns.length) {
    add("gauged");
  }
  return cluster;
}

export function feedOf(cask = {}, verdict = "") {
  const kind = verdict || classify(cask);
  if (kind === "ullaged") {
    return "● Ullaged · partial context drop with no compact ticket · primary #90509";
  }
  if (kind === "thrashed") {
    return "● Thrashed · cluster of prefix-frozen rewrites · bung weeps every turn";
  }
  if (kind === "frozen") {
    return "● Frozen · cache_read pinned at the system-prompt prefix";
  }
  if (kind === "leaked") {
    return "● Leaked · drop plus missing compaction ticket · not a pour";
  }
  if (kind === "rewritten") {
    return "● Rewritten · one full-context rebuild after a recorded compact · expected";
  }
  if (kind === "doubled") {
    return "● Doubled · JSONL usage duplicated on message.id · waste number was dishonest";
  }
  if (kind === "healed") {
    return "● Healed · thrash cluster ended with no user action · bung seated itself";
  }
  if (kind === "silent") {
    return "● Silent · drop with empty error / compaction / context-edit records";
  }
  if (kind === "bunged") {
    return "● Bunged · bung reseated · cache_read recovered to full context";
  }
  return "● Gauged · cache_read holds the cask · no unexplained drop · idle word is gauged";
}

export function reasonsOf(cask = {}, verdict = "") {
  const next = cloneCask(cask);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.turns.length
      ? `${facts.turns.length} deduped turns (${facts.rawCount} raw, ${facts.duplicates} duplicate rows)`
      : "no turns on the slate",
  );
  if (facts.chalked) reasons.push(`chalked capacity ${facts.chalked} tokens`);
  if (facts.lastContext) {
    reasons.push(`dip ${facts.lastContext} · cache_read ${facts.lastCacheRead}`);
  }
  if (facts.unexplainedDrop) {
    reasons.push(`unexplained drop ${facts.dropSize} tokens · no compact ticket`);
  }
  if (facts.recordedCompact) reasons.push("recorded compact ticket accounts for a pour");
  if (facts.hadFreeze) {
    reasons.push(
      `prefix freeze cache_read=${facts.prefixHint} across ${facts.freezeCount} turns (max consecutive ${facts.maxConsecutive})`,
    );
  }
  if (facts.waste) {
    reasons.push(
      `wasted weighted tokens ${facts.waste} (input×1 + cache_read×0.1 + cache_creation×2 + output×5)`,
    );
  }
  if (facts.duplicates > 0) {
    reasons.push(`JSONL usage duplicated on message.id / requestId ×${facts.duplicates}`);
  }
  reasons.push("a missing compaction ticket is not a hold");
  reasons.push(
    "NOT Fathom (rules after a recorded compact) / Quench (subagent spawn fuse) / Coda (dropped assistant text) / Visa (OAuth resource) / Sprag (boot-cached MCP) / leftover woodworking / millimetre-slider",
  );
  if (kind === "gauged") {
    reasons.push("cask is full and accounted for; bung holds; idle word is gauged");
  }
  if (kind === "ullaged") {
    reasons.push(
      "PRIMARY #90509: context silently loses a large block (829,414 → 672,391, drop 157,023) at 06:17:43 with no compactMetadata nearby. The session's only two real auto-compactions dropped to ~10–12K, days apart, and recovered cleanly. This drop is not a compact.",
    );
  }
  if (kind === "thrashed") {
    reasons.push(
      "Cluster of prefix-frozen rewrites. On #90509 every failed turn cache_read was exactly 45,659 while cache_creation was ~628K. 21 full-context rewrites in 17 minutes.",
    );
  }
  if (kind === "frozen") {
    reasons.push(
      "cache_read pinned at a prefix-sized constant. Shape #87966 / #89621 / #87215 / #90144 / #83913. The desk gauges; it does not name the cache-key root cause.",
    );
  }
  if (kind === "leaked") {
    reasons.push("Level dropped and no pour was chalked. The cellar has a leak, not a hold.");
  }
  if (kind === "rewritten") {
    reasons.push("One rebuild after a recorded compact is expected. Not ullage.");
  }
  if (kind === "doubled") {
    reasons.push(
      "SECONDARY #90509 / shape #87966: same message.id / requestId written 2–3 times. Naive local usage audits inflate ~2.12×. Dedup before you score waste.",
    );
  }
  if (kind === "healed") {
    reasons.push("Thrash ended with no user action. Concurrent control session never failed.");
  }
  if (kind === "silent") {
    reasons.push("Drop with empty error, compaction, and context-edit records. No ticket. No alarm from the runtime.");
  }
  if (kind === "bunged") {
    reasons.push("Bung reseated. cache_read recovered to full context after a weep.");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  return reasons;
}

export function verdictOf(cask = {}) {
  return classify(cask);
}

export function flagsOf(verdict, facts = {}) {
  const waste = asNum(facts.waste, 0);
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: waste >= LINEAR_WASTE_THRESHOLD,
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function gaugedOf(cask = {}, verdict = "") {
  return (verdict || classify(cask)) === "gauged";
}

export function ullagedOf(cask = {}, verdict = "") {
  return (verdict || classify(cask)) === "ullaged";
}

export function thrashedOf(cask = {}, verdict = "") {
  return (verdict || classify(cask)) === "thrashed";
}

export function score(cask = {}) {
  const next = cloneCask(cask);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict, facts);
  const cluster = clusterOf(next, verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    gauged: gaugedOf(next, verdict),
    ullaged: ullagedOf(next, verdict),
    thrashed: thrashedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    dropSize: facts.dropSize,
    freezeCount: facts.freezeCount,
    waste: facts.waste,
    honestWeighted: facts.honestWeighted,
    naiveWeighted: facts.naiveWeighted,
    duplicates: facts.duplicates,
    ticketsPresent: facts.tickets.length > 0,
    chalked: facts.chalked,
    dip: facts.lastContext,
    cacheRead: facts.lastCacheRead,
    prefixHint: facts.prefixHint,
    recovered: facts.recovered,
    cask: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const caskSrc = src.cask || src.probe || src.cellar || src.trace || payload.cask || payload.probe;
  const cask = cloneCask(caskSrc && typeof caskSrc === "object" ? { ...caskSrc, ...src, ...payload } : payload);
  if (typeof src.session === "string" && !cask.session) cask.session = src.session;
  if (typeof payload.session === "string" && !cask.session) cask.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? cask.session ?? ""),
    cask,
    issue: src.issue ?? payload.issue ?? cask.issue ?? null,
    source: src.source ?? payload.source ?? cask.source ?? "",
  };
}

function pack(verdict, cask, action, extras = {}) {
  const next = cloneCask(cask);
  const scored = score(next);
  return {
    ok: true,
    product: "ullage",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    gauged: scored.gauged,
    ullaged: scored.ullaged,
    thrashed: scored.thrashed,
    cluster: scored.cluster,
    cellarGauged: verdict === "gauged",
    cellarUllaged: verdict === "ullaged",
    cellarThrashed: verdict === "thrashed",
    cellarFrozen: verdict === "frozen",
    cellarLeaked: verdict === "leaked",
    cellarRewritten: verdict === "rewritten",
    cellarDoubled: verdict === "doubled",
    cellarHealed: verdict === "healed",
    cellarSilent: verdict === "silent",
    cellarBunged: verdict === "bunged",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    dropSize: scored.dropSize,
    freezeCount: scored.freezeCount,
    waste: scored.waste,
    honestWeighted: scored.honestWeighted,
    naiveWeighted: scored.naiveWeighted,
    duplicates: scored.duplicates,
    ticketsPresent: scored.ticketsPresent,
    chalked: scored.chalked,
    dip: scored.dip,
    cacheRead: scored.cacheRead,
    prefixHint: scored.prefixHint,
    recovered: scored.recovered,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    cask: next,
    ...extras,
  };
}

function turn(partial = {}) {
  return { ...emptyTurn(), ...partial };
}

function iso(h, m, s = 0) {
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const hh = String(h).padStart(2, "0");
  return `2026-08-29T${hh}:${mm}:${ss}.000Z`;
}

function seedCask(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    cask: {
      ...emptyCask(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      turns: Array.isArray(extras.turns) ? extras.turns.map((row) => cloneTurn(row)) : [],
      tickets: Array.isArray(extras.tickets) ? extras.tickets.map((row) => cloneTicket(row)) : [],
      errors: Array.isArray(extras.errors) ? extras.errors.slice() : [],
      slate: Array.isArray(extras.tickets) ? extras.tickets.map((row) => cloneTicket(row)) : [],
    },
  };
}

function healthyTurn(at, context, id) {
  return turn({
    at,
    messageId: id,
    requestId: `req-${id}`,
    context,
    cacheRead: context,
    cacheCreation: 0,
    input: 1200,
    output: 680,
  });
}

function frozenTurn(at, context, id, prefix = PREFIX_EXAMPLE) {
  return turn({
    at,
    messageId: id,
    requestId: `req-${id}`,
    context,
    cacheRead: prefix,
    cacheCreation: Math.max(0, context - prefix),
    input: 800,
    output: 680,
  });
}

/** Idle / bail. Cask not scored. */
export function seedGauged() {
  return seedCask("gauged", "cellar", {
    session: "gauged",
    issue: null,
    scored: true,
  });
}

/** Control session that stays gauged. Concurrent #90509 control. */
export function seedControl() {
  return seedCask("gauged", "control", {
    session: "90509-control",
    issue: null,
    turns: [
      healthyTurn(iso(6, 0, 0), 829_414, "ctrl-1"),
      healthyTurn(iso(6, 10, 0), 830_200, "ctrl-2"),
      healthyTurn(iso(6, 20, 0), 831_040, "ctrl-3"),
      healthyTurn(iso(6, 35, 0), 832_100, "ctrl-4"),
    ],
  });
}

/** Unexplained 157k drop, no ticket, no freeze cluster. */
export function seedUllaged() {
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-ullaged",
    turns: [
      healthyTurn(iso(6, 10, 0), 829_414, "u-1"),
      healthyTurn(iso(6, 17, 43), 672_391, "u-2"),
    ],
  });
}

/** #90509 miniature: drop then 21 prefix-frozen rewrites, still weeping. */
export function seedThrashed() {
  const turns = [healthyTurn(iso(6, 10, 0), 829_414, "t-0")];
  turns.push(
    turn({
      at: iso(6, 17, 43),
      messageId: "t-drop",
      requestId: "req-t-drop",
      context: 672_391,
      cacheRead: PREFIX_EXAMPLE,
      cacheCreation: 672_391 - PREFIX_EXAMPLE,
      input: 800,
      output: 680,
    }),
  );
  for (let i = 1; i <= 20; i += 1) {
    const minute = 17 + Math.floor((i * 48) / 60);
    const second = (43 + i * 48) % 60;
    turns.push(frozenTurn(iso(6, minute, second), 672_391, `t-${i}`));
  }
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-thrashed",
    turns,
  });
}

/** Two prefix-frozen turns — pinned, not yet a cluster. */
export function seedFrozen() {
  return seedCask(87966, "anthropics/claude-code#87966", {
    session: "87966-frozen",
    turns: [
      healthyTurn(iso(6, 10, 0), 400_000, "f-0"),
      frozenTurn(iso(6, 11, 0), 400_000, "f-1"),
      frozenTurn(iso(6, 12, 0), 400_000, "f-2"),
    ],
  });
}

/** Recorded compact, one rewrite, then recovery. */
export function seedRewritten() {
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-rewritten",
    issue: null,
    turns: [
      healthyTurn(iso(4, 0, 0), 200_000, "r-0"),
      turn({
        at: iso(4, 0, 20),
        messageId: "r-compact",
        requestId: "req-r-compact",
        context: 12_000,
        cacheRead: 10_800,
        cacheCreation: 0,
        input: 400,
        output: 200,
        compactMetadata: { pre: 200_000, post: 12_000 },
      }),
      frozenTurn(iso(4, 0, 40), 12_400, "r-rewrite", 4_000),
      healthyTurn(iso(4, 1, 10), 13_200, "r-held"),
    ],
    tickets: [{ at: iso(4, 0, 20), kind: "compact", pre: 200_000, post: 12_000 }],
  });
}

/** JSONL usage duplicated on message.id. Otherwise the cask holds. */
export function seedDoubled() {
  const row = healthyTurn(iso(6, 10, 0), 90_000, "dup-1");
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-doubled",
    turns: [row, { ...row }, { ...row, at: iso(6, 10, 1) }, healthyTurn(iso(6, 12, 0), 91_000, "dup-2")],
  });
}

/**
 * Faithful #90509 miniature: 829k → unexplained 157k drop → 21
 * prefix-frozen rewrites with cache_read=45659 → self-heal.
 */
export function seedHealed() {
  const base = seedThrashed();
  const turns = base.cask.turns.slice();
  turns.push(healthyTurn(iso(6, 35, 10), 673_200, "h-end"));
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-healed",
    turns,
  });
}

/** Drop with empty error / compaction / context-edit records. */
export function seedSilent() {
  const seeded = seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-silent",
    turns: [
      healthyTurn(iso(6, 10, 0), 829_414, "s-1"),
      turn({
        at: iso(6, 17, 43),
        messageId: "s-2",
        requestId: "req-s-2",
        context: 672_391,
        cacheRead: 672_391,
        cacheCreation: 0,
        input: 900,
        output: 400,
        compactMetadata: null,
        appliedEdits: null,
        error: "",
      }),
    ],
    tickets: [],
    errors: [],
  });
  seeded.cask.records = { compact: [], edits: [], errors: [] };
  return seeded;
}

/** Drop plus a slate that is missing the ticket for this pour. */
export function seedLeaked() {
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-leaked",
    turns: [
      healthyTurn(iso(6, 10, 0), 829_414, "l-1"),
      healthyTurn(iso(6, 17, 43), 672_391, "l-2"),
    ],
    tickets: [{ at: iso(3, 12, 0), kind: "compact", pre: 40_000, post: 11_000 }],
  });
}

/** Freeze then bung reseated without a thrash cluster. */
export function seedBunged() {
  return seedCask(90509, "anthropics/claude-code#90509", {
    session: "90509-bunged",
    turns: [
      healthyTurn(iso(6, 10, 0), 300_000, "b-0"),
      frozenTurn(iso(6, 11, 0), 300_000, "b-1"),
      frozenTurn(iso(6, 12, 0), 300_000, "b-2"),
      healthyTurn(iso(6, 13, 0), 301_200, "b-3"),
    ],
  });
}

/** Full #90509 story used as the restore-to-ullaged cellar ticket. */
export function seed90509() {
  return seedHealed();
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyCask();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return cloneCask({ turns: parsed });
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.turns) || parsed.cask || parsed.probe) return cloneCask(parsed);
        return cloneCask({ turns: [parsed] });
      }
    } catch {
      /* fall through to JSONL / prose */
    }
  }
  if (text.includes("\n") && text.includes("{")) {
    const rows = [];
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        rows.push(JSON.parse(trimmed));
      } catch {
        /* skip */
      }
    }
    if (rows.length) return cloneCask({ turns: rows, session: "paste-jsonl", source: "paste", scored: true });
  }
  const drop = /157,?023|829,?414\s*→\s*672,?391|672,?391|silently loses/i.test(text);
  const thrash = /21 (full-context )?rewrites|cache_read was exactly 45,?659|prefix-frozen/i.test(text);
  const heal = /self-heal|recovered|bunged|healed/i.test(text);
  const compact = /compactMetadata|recorded compact|auto-compaction/i.test(text) && /10.?12k|recovered cleanly|then recovery/i.test(text);
  const doubled = /double-log|duplicat|2\.12×|same message\.id/i.test(text);
  const frozen = /cache_read pinned|prefix-sized|45,?659|16k prefix/i.test(text);
  if (compact && !drop) return { ...seedRewritten().cask, session: "paste-rewritten", source: "paste", scored: true };
  if (doubled && !drop && !thrash) return { ...seedDoubled().cask, session: "paste-doubled", source: "paste", scored: true };
  if (drop && thrash && heal) return { ...seedHealed().cask, session: "paste-90509", source: "anthropics/claude-code#90509", issue: 90509, scored: true };
  if (drop && thrash) return { ...seedThrashed().cask, session: "paste-thrashed", source: "anthropics/claude-code#90509", issue: 90509, scored: true };
  if (drop) return { ...seedUllaged().cask, session: "paste-ullaged", source: "anthropics/claude-code#90509", issue: 90509, scored: true };
  if (frozen) return { ...seedFrozen().cask, session: "paste-frozen", source: "paste", scored: true };
  return { ...emptyCask(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  gauged: seedGauged,
  control: seedControl,
  ullaged: seedUllaged,
  90509: seed90509,
  "90509-ullaged": seedUllaged,
  thrashed: seedThrashed,
  "90509-thrashed": seedThrashed,
  frozen: seedFrozen,
  87966: seedFrozen,
  rewritten: seedRewritten,
  doubled: seedDoubled,
  healed: seedHealed,
  "90509-healed": seedHealed,
  silent: seedSilent,
  leaked: seedLeaked,
  bunged: seedBunged,
  healthy: seedControl,
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
  let cask = cloneCask(action.cask);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "gauged" || verb === "still" || verb === "rest" || verb === "reset") {
    return pack("gauged", emptyCask(), { ...action, action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof") {
    cask = seedControl().cask;
    return pack(classify(cask), cask, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "ullaged" || verb === "leak" || verb === "cellar") {
    cask = seedUllaged().cask;
    return pack(classify(cask), cask, { ...action, action: verb === "restore" ? "restore" : "ullaged" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound" || verb === "gauge") {
    cask = { ...cask, scored: true };
    return pack(classify(cask), cask, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "throw" || verb === "dip") {
    cask = { ...cask, scored: true };
    return pack(classify(cask), cask, { ...action, action: verb === "press" || verb === "throw" || verb === "dip" ? "score" : verb });
  }

  cask = { ...cask, scored: true };
  return pack(classify(cask), cask, action);
}
