/**
 * Quench fuse — runtime token-burn circuit breaker.
 * Usage snapshot in → continue | kill. Not a grant inbox. Not a DLP veil.
 */

export const USD_PER_MTOK = 15;
export const WARNING_RATIO = 0.8;
export const RAISE_FACTOR = 1.4;
export const SOURCES = ["parent", "subagents", "hooks", "workflows"];

export const DEFAULT_THRESHOLD = Object.freeze({
  tokens: 5_000_000,
  usd: 75,
});

/** Seeded 82-agent fan-out already on the copper. Evidence: claude-code#83025. */
export function seedRunaway() {
  return {
    session: "fanout-83025",
    agents: 82,
    sources: {
      parent: 842_000,
      subagents: 2_614_000,
      hooks: 184_000,
      workflows: 544_000,
    },
    killed: false,
    raised: 0,
  };
}

export function emptySession(session = "cool-1") {
  return {
    session,
    agents: 0,
    sources: { parent: 0, subagents: 0, hooks: 0, workflows: 0 },
    killed: false,
    raised: 0,
  };
}

export function normalizeThreshold(raw) {
  const tokens = Number(raw?.tokens);
  const usd = Number(raw?.usd);
  return {
    tokens: Number.isFinite(tokens) && tokens > 0 ? tokens : DEFAULT_THRESHOLD.tokens,
    usd: Number.isFinite(usd) && usd > 0 ? usd : DEFAULT_THRESHOLD.usd,
  };
}

export function normalizeSources(raw = {}) {
  const sources = {};
  for (const key of SOURCES) {
    const value = Number(raw[key]);
    sources[key] = Number.isFinite(value) && value > 0 ? value : 0;
  }
  return sources;
}

export function totals(snapshot = {}) {
  const sources = normalizeSources(snapshot.sources);
  const fromSources = SOURCES.reduce((sum, key) => sum + sources[key], 0);
  const tokensHint = Number(snapshot.tokens);
  const tokens = Number.isFinite(tokensHint) && tokensHint > 0 ? tokensHint : fromSources;
  const usdHint = Number(snapshot.usd);
  const usd = Number.isFinite(usdHint) && usdHint >= 0 ? usdHint : (tokens / 1e6) * USD_PER_MTOK;
  return { tokens, usd, sources };
}

export function burnRatio(snapshot, threshold) {
  const t = totals(snapshot);
  const fuse = normalizeThreshold(threshold);
  return Math.max(t.tokens / fuse.tokens, t.usd / fuse.usd);
}

/**
 * Idle / empty word is "cool". Never the product name.
 * Live under the fuse is "armed". Near the wire is "warning". Cut is "tripped".
 */
export function fuseState(snapshot = {}, threshold = DEFAULT_THRESHOLD) {
  const t = totals(snapshot);
  if (snapshot.killed) return "tripped";
  if (t.tokens <= 0 && t.usd <= 0) return "cool";
  const ratio = burnRatio(snapshot, threshold);
  if (ratio >= 1) return "tripped";
  if (ratio >= WARNING_RATIO) return "warning";
  return "armed";
}

export function raiseThreshold(threshold = DEFAULT_THRESHOLD, factor = RAISE_FACTOR) {
  const fuse = normalizeThreshold(threshold);
  const scale = Number(factor);
  const mul = Number.isFinite(scale) && scale > 1 ? scale : RAISE_FACTOR;
  return {
    tokens: Math.round(fuse.tokens * mul),
    usd: Math.round(fuse.usd * mul * 100) / 100,
  };
}

export function tickSources(sources, pulse = {}) {
  const next = normalizeSources(sources);
  for (const key of SOURCES) {
    const add = Number(pulse[key]);
    if (Number.isFinite(add) && add > 0) next[key] += add;
  }
  return next;
}

export function decide(input = {}) {
  const action = input.action === "kill" || input.action === "raise" ? input.action : "snapshot";
  let threshold = normalizeThreshold(input.threshold);
  const snapshot = {
    session: String(input.session || input.snapshot?.session || "session"),
    agents: Number(input.agents || input.snapshot?.agents || 0) || 0,
    sources: normalizeSources(input.sources || input.snapshot?.sources),
    tokens: input.tokens ?? input.snapshot?.tokens,
    usd: input.usd ?? input.snapshot?.usd,
    killed: Boolean(input.killed || input.snapshot?.killed),
    raised: Number(input.raised || input.snapshot?.raised || 0) || 0,
  };

  if (action === "raise") {
    threshold = raiseThreshold(threshold);
    snapshot.raised += 1;
  }
  if (action === "kill") {
    snapshot.killed = true;
  }

  const burn = totals(snapshot);
  const ratio = burn.tokens <= 0 && burn.usd <= 0 ? 0 : burnRatio(snapshot, threshold);
  const state = fuseState(snapshot, threshold);
  const decision = state === "tripped" ? "kill" : "continue";

  return {
    ok: true,
    product: "quench",
    decision,
    state,
    action,
    ratio,
    snapshot: {
      session: snapshot.session,
      agents: snapshot.agents,
      sources: burn.sources,
      tokens: burn.tokens,
      usd: Number(burn.usd.toFixed(2)),
      killed: snapshot.killed || decision === "kill",
      raised: snapshot.raised,
    },
    threshold,
    idleWord: state === "cool" ? "cool" : state,
  };
}
