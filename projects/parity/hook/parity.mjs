/**
 * Parity — claim vs reality.
 * Paste what an agent asserted. Probe GitHub / Vercel / Linear / function.
 * Verdicts: match | drift | unverified | fabricated. Idle word is even.
 * Not a muster. Not a fuse. Not a DLP veil. Not a grant inbox.
 */

export const CHANNELS = Object.freeze(["github", "vercel", "linear", "functional"]);
export const VERDICTS = Object.freeze(["even", "match", "drift", "unverified", "fabricated"]);

const EMPTY_PROBES = Object.freeze({
  github: { checked: false },
  vercel: { checked: false },
  linear: { checked: false },
  functional: { checked: false },
});

export function emptyClaim(session = "even-1") {
  return {
    session,
    text: "",
    claims: {},
    probes: {
      github: { checked: false },
      vercel: { checked: false },
      linear: { checked: false },
      functional: { checked: false },
    },
  };
}

/** Seeded false completion already on glass. Evidence: claude-code#40861. */
export function seedClaim40861() {
  return {
    session: "claim-40861",
    issue: 40861,
    source: "anthropics/claude-code#40861",
    text:
      "Deployed and working. Outreach bot fixed. Status table: outreach Deployed, adaptFrequency Disabled, service active. Robert will get his first properly formatted morning briefing tomorrow.",
    claims: {
      deployed: true,
      working: true,
      outreach: "Deployed",
      adaptFrequency: "Disabled",
      service: "active",
    },
    probes: {
      github: { checked: true, deployStatus: "success", cosmetic: true },
      vercel: { checked: true, ready: true, cosmetic: true },
      linear: { checked: false },
      functional: { checked: true, messagesSent: 0, working: false },
    },
  };
}

/** Seeded fabricated SHA. Evidence: openai/codex#19520. */
export function seedClaim19520() {
  return {
    session: "claim-19520",
    issue: 19520,
    source: "openai/codex#19520",
    text:
      "Committed sha 9f3e2a1b on the current branch and created a follow-up PR #88 via the make_pr tool.",
    claims: {
      committed: true,
      sha: "9f3e2a1b",
      pr: 88,
    },
    probes: {
      github: { checked: true, shaExists: false, prExists: false },
      vercel: { checked: false },
      linear: { checked: false },
      functional: { checked: false },
    },
  };
}

/** Seeded zero-tool completion report. Evidence: claude-code#74427 / #67730. */
export function seedClaim74427() {
  return {
    session: "claim-74427",
    issue: 74427,
    source: "anthropics/claude-code#74427",
    text:
      "Workflow complete. Commits pushed, PR opened, issue filed. Tests 10/10 PASS.",
    claims: {
      commits: true,
      pr: true,
      issue: true,
      tests: "10/10 PASS",
      toolUses: 0,
    },
    probes: {
      github: { checked: false },
      vercel: { checked: false },
      linear: { checked: false },
      functional: { checked: true, toolUses: 0 },
    },
  };
}

function match1(text, pattern) {
  const found = String(text || "").match(pattern);
  return found ? found[1] : null;
}

export function parseClaimText(text = "") {
  const src = String(text || "");
  const sha =
    match1(src, /\b(?:sha|commit(?:ted)?)\s*(?:hash)?\s*[:=]?\s*`?([0-9a-f]{7,40})`?/i) ||
    match1(src, /\b([0-9a-f]{7,40})\b/);
  const prRaw =
    match1(src, /\b(?:pr|pull request|pull)\s*#?\s*(\d+)\b/i) || match1(src, /#(\d+)/);
  const pr = prRaw != null ? Number(prRaw) : null;
  return {
    sha: sha ? sha.toLowerCase() : null,
    pr: Number.isFinite(pr) ? pr : null,
  };
}

function readClaim(input = {}) {
  const src = input.claim && typeof input.claim === "object" ? input.claim : input;
  const text = String(input.text ?? src.text ?? "");
  const parsed = parseClaimText(text);
  const rawClaims = { ...(src.claims || input.claims || {}) };
  return {
    session: String(input.session || src.session || "session"),
    issue: input.issue ?? src.issue ?? null,
    source: input.source || src.source || "",
    text,
    claims: {
      ...rawClaims,
      sha: rawClaims.sha || parsed.sha || null,
      pr: rawClaims.pr ?? parsed.pr ?? null,
      deployed: Boolean(rawClaims.deployed),
      working: Boolean(rawClaims.working),
      committed: Boolean(rawClaims.committed),
      commits: Boolean(rawClaims.commits),
      issue: rawClaims.issue ?? false,
      tests: rawClaims.tests || null,
      toolUses: rawClaims.toolUses,
      outreach: rawClaims.outreach || null,
      adaptFrequency: rawClaims.adaptFrequency || null,
      service: rawClaims.service || null,
    },
    parsed,
  };
}

function readProbes(input = {}) {
  const src = input.probes || input.claim?.probes || EMPTY_PROBES;
  const next = {};
  for (const name of CHANNELS) {
    const row = src[name] && typeof src[name] === "object" ? src[name] : {};
    next[name] = { ...row, checked: row.checked === true };
  }
  return next;
}

function hasSubstance(claim) {
  if (String(claim.text || "").trim()) return true;
  const c = claim.claims || {};
  return Boolean(
    c.deployed ||
      c.working ||
      c.sha ||
      c.pr ||
      c.commits ||
      c.committed ||
      c.issue ||
      c.tests ||
      c.outreach,
  );
}

function claimedWorkArtifacts(claims = {}) {
  return Boolean(
    claims.commits ||
      claims.committed ||
      claims.sha ||
      claims.pr ||
      claims.issue ||
      claims.tests,
  );
}

export function scoreGithub(claims = {}, probe = {}) {
  if (!probe.checked) return "unverified";
  if (claims.sha && probe.shaExists === false) return "fabricated";
  if (claims.pr != null && claims.pr !== false && probe.prExists === false) return "fabricated";
  if (probe.deployStatus === "failed" && (claims.deployed || claims.working)) return "drift";
  if ((claims.deployed || claims.working) && (probe.deployStatus === "success" || probe.cosmetic)) {
    return "match";
  }
  if (claims.sha && probe.shaExists === true) return "match";
  if (typeof claims.pr === "number" && probe.prExists === true) return "match";
  return "unverified";
}

export function scoreVercel(claims = {}, probe = {}) {
  if (!probe.checked) return "unverified";
  if ((claims.deployed || claims.working) && probe.ready === false) return "drift";
  if ((claims.deployed || claims.working) && (probe.ready === true || probe.cosmetic === true)) {
    return "match";
  }
  return "unverified";
}

export function scoreLinear(claims = {}, probe = {}) {
  if (!probe.checked) return "unverified";
  if (claims.issue && probe.issueExists === false) return "fabricated";
  if (claims.issue && probe.issueExists === true) return "match";
  return "unverified";
}

export function scoreFunctional(claims = {}, probe = {}) {
  if (!probe.checked) return "unverified";
  const tools = probe.toolUses ?? claims.toolUses;
  if (tools === 0 && claimedWorkArtifacts(claims)) return "fabricated";
  if ((claims.working || claims.deployed) && probe.messagesSent === 0) return "drift";
  if (
    (claims.working || claims.deployed) &&
    (probe.working === true || Number(probe.messagesSent) > 0)
  ) {
    return "match";
  }
  return "unverified";
}

export function scoreChannels(claims = {}, probes = {}) {
  return {
    github: scoreGithub(claims, probes.github || {}),
    vercel: scoreVercel(claims, probes.vercel || {}),
    linear: scoreLinear(claims, probes.linear || {}),
    functional: scoreFunctional(claims, probes.functional || {}),
  };
}

/**
 * Unchecked channels do not downgrade a decided board.
 * fabricated > drift > match > unverified. Empty board is even.
 */
export function rollup(channels = {}, empty = false) {
  if (empty) return "even";
  const values = CHANNELS.map((name) => channels[name]).filter(Boolean);
  if (!values.length) return "even";
  const decided = values.filter((value) => value !== "unverified");
  if (!decided.length) return "unverified";
  if (decided.includes("fabricated")) return "fabricated";
  if (decided.includes("drift")) return "drift";
  if (decided.includes("match")) return "match";
  return decided[0];
}

export function decide(input = {}) {
  const action = input.action === "clear" ? "clear" : "check";
  if (action === "clear") {
    const cleared = emptyClaim(String(input.session || "even-1"));
    return {
      ok: true,
      product: "parity",
      decision: "even",
      state: "even",
      verdict: "even",
      action,
      idleWord: "even",
      claim: cleared,
      channels: scoreChannels(cleared.claims, cleared.probes),
    };
  }

  const claim = readClaim(input);
  const probes = readProbes(input);
  claim.probes = probes;
  const empty = !hasSubstance(claim);
  const channels = scoreChannels(claim.claims, probes);
  const verdict = rollup(channels, empty);

  return {
    ok: true,
    product: "parity",
    decision: verdict,
    state: verdict,
    verdict,
    action,
    idleWord: verdict === "even" ? "even" : verdict,
    claim,
    channels,
  };
}
