/**
 * Catachresis lexicographer-stamp-desk scorer.
 * A rubber stamp should name the challenge
 * on the slip. Claude Code instead stamps
 * EXPIRED over a live token's 403
 * insufficient_scope response.
 *
 * Encoded from #92518 issue facts only.
 * No network. No exploits. No real tokens.
 * Verify nothing. Do not invent source-code claims.
 */

export const CHIPS = [
  "mislabeled",
  "scoped",
  "no-401",
  "no-refresh",
  "token-still-valid",
  "insufficient-scope-challenge",
  "events-write-missing",
  "reauth-widened-scopes",
  "cousins"
];

export const HOLD = new Set(["scoped"]);

export const ALARM = new Set([
  "mislabeled",
  "no-401",
  "no-refresh",
  "token-still-valid",
  "insufficient-scope-challenge",
  "events-write-missing",
  "reauth-widened-scopes",
  "cousins"
]);

const DEFAULT_CHALLENGE =
  'Bearer error="insufficient_scope", scope="events:write", resource_metadata="https://example.com/.well-known/oauth-protected-resource/api/mcp"';

const EXPIRED_LINE = 'MCP server "..." requires re-authorization (token expired)';

export function parseWwwAuthenticate(header) {
  const text = String(header || "").trim();
  if (!text) return { scheme: "", error: "", scope: "", resource_metadata: "", raw: "" };
  const schemeMatch = text.match(/^([A-Za-z]+)\s+/);
  const scheme = schemeMatch ? schemeMatch[1] : "";
  const fields = {};
  const re = /([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(text))) {
    fields[m[1]] = m[2];
  }
  return {
    scheme,
    error: fields.error || "",
    scope: fields.scope || "",
    resource_metadata: fields.resource_metadata || "",
    raw: text
  };
}

export function classifyChallenge(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const header = t.wwwAuthenticate || t.challenge || DEFAULT_CHALLENGE;
  const parsed = parseWwwAuthenticate(header);
  const status = Number(t.status || t.httpStatus || 0);
  const clientMessage = String(t.clientMessage || t.shown || "");
  const saysExpired = /token expired/i.test(clientMessage);
  const insufficient = parsed.error === "insufficient_scope" || t.challengeError === "insufficient_scope";
  const invalidToken = parsed.error === "invalid_token" || t.challengeError === "invalid_token";
  return {
    parsed,
    status: status || (insufficient ? 403 : invalidToken ? 401 : 0),
    insufficient,
    invalidToken,
    saysExpired,
    missingScope: parsed.scope || t.challengeScope || t.missingScope || "",
    shouldNameScope: insufficient && !saysExpired
  };
}

export function seedMislabeled() {
  return {
    seed: "mislabeled",
    issue: 92518,
    mislabeled: true,
    scoped: false,
    status: 403,
    http401: false,
    refreshAttempted: false,
    tokenRemainingMin: 55,
    tokenTtlSec: 3600,
    issuedMinBeforeFailure: 5,
    challengeError: "insufficient_scope",
    challengeScope: "events:write",
    wwwAuthenticate: DEFAULT_CHALLENGE,
    jsonrpc: {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32600, message: "Insufficient scope: events:write required" }
    },
    clientMessage: EXPIRED_LINE,
    readToolsOk: ["events_list", "events_get"],
    writeTool: "events_delete",
    grantScopes: ["events:read"],
    version: "2.1.258",
    spec: "2026-07-28",
    sdk: "TypeScript SDK v2"
  };
}

export function seedScoped() {
  return {
    seed: "scoped",
    issue: 92518,
    mislabeled: false,
    scoped: true,
    namesMissingScope: true,
    status: 403,
    challengeError: "insufficient_scope",
    challengeScope: "events:write",
    missingScope: "events:write",
    wwwAuthenticate: DEFAULT_CHALLENGE,
    clientMessage: "Insufficient scope: events:write required",
    version: "2.1.258"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];
  const classified = classifyChallenge(t);

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #19066 #28258 #44652 — all locked; closed without a lasting fix; #28258 marked resolved in the next release (2026-03); #44652 reported the same behavior six weeks later on 2.1.92; a commenter confirmed it on 2.1.121; still reproducing on 2.1.258. Primary stays #92518"
    );
    return {
      verdict: "cousins",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["cousins", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    seed === "scoped" ||
    (t.scoped === true && t.mislabeled !== true && (t.namesMissingScope === true || t.challengeError === "insufficient_scope"))
  ) {
    reasons.push(
      "Desk already scoped: the UI names the missing scope from the 403 WWW-Authenticate challenge (events:write) instead of stamping EXPIRED. Seeded word is scoped"
    );
    return {
      verdict: "scoped",
      reasons,
      mislabeled: false,
      scoped: true,
      chips: ["scoped"],
      challenge: classified.parsed
    };
  }

  if (seed === "no-401" || (t.http401 === false && seed === "no-401")) {
    reasons.push(
      "Server-side logs for the whole session confirm: no 401 was ever returned. Only two 403s. The client reported an expiry for a response that never claimed one"
    );
    return {
      verdict: "no-401",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["no-401", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (seed === "no-refresh" || (t.refreshAttempted === false && seed === "no-refresh")) {
    reasons.push(
      "No refresh was attempted. Zero POST /oauth/token with grant_type=refresh_token. The only token call was the authorization_code exchange after manual re-auth"
    );
    return {
      verdict: "no-refresh",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["no-refresh", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    seed === "token-still-valid" ||
    (typeof t.tokenRemainingMin === "number" && t.tokenRemainingMin >= 50 && seed === "token-still-valid")
  ) {
    reasons.push(
      "The token was not expired. It had ~55 minutes of its 1-hour lifetime remaining. Access-token TTL 3600s; token issued ~5 minutes before the failure"
    );
    return {
      verdict: "token-still-valid",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["token-still-valid", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    seed === "insufficient-scope-challenge" ||
    (t.challengeError === "insufficient_scope" && seed === "insufficient-scope-challenge")
  ) {
    reasons.push(
      '403 carries WWW-Authenticate: Bearer error="insufficient_scope", scope="events:write", resource_metadata="https://example.com/.well-known/oauth-protected-resource/api/mcp" and JSON-RPC Insufficient scope: events:write required'
    );
    return {
      verdict: "insufficient-scope-challenge",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["insufficient-scope-challenge", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    seed === "events-write-missing" ||
    seed === "scope-events-write" ||
    (t.challengeScope === "events:write" && seed === "events-write-missing")
  ) {
    reasons.push(
      "Read tools need events:read, write tools need events:write. The grant only carried events:read. events_list and events_get → 200; events_delete → 403"
    );
    return {
      verdict: "events-write-missing",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["events-write-missing", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    seed === "reauth-widened-scopes" ||
    seed === "reauth-widened" ||
    (t.reauthWidened === true && (seed === "reauth-widened-scopes" || seed === "reauth-widened"))
  ) {
    reasons.push(
      "Re-auth \"fixed\" it by widening scopes, not by refreshing. The second /authorize requested scope=events:read events:write; the first had not. The same delete then succeeded"
    );
    return {
      verdict: "reauth-widened-scopes",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: ["reauth-widened-scopes", "mislabeled"],
      challenge: classified.parsed
    };
  }

  if (
    t.mislabeled === true ||
    seed === "mislabeled" ||
    classified.saysExpired && classified.insufficient ||
    (t.status === 403 && /token expired/i.test(String(t.clientMessage || "")))
  ) {
    reasons.push(
      'Claude Code shows MCP server "..." requires re-authorization (token expired) for a 403 insufficient_scope challenge. The token was not expired. Distinguish invalid_token (401) from insufficient_scope (403) and name the missing scope'
    );
    const chips = ["mislabeled"];
    if (t.http401 === false || seed === "mislabeled") chips.push("no-401");
    if (t.refreshAttempted === false || seed === "mislabeled") chips.push("no-refresh");
    if (typeof t.tokenRemainingMin === "number" && t.tokenRemainingMin >= 50) chips.push("token-still-valid");
    if (t.challengeError === "insufficient_scope" || classified.insufficient) {
      chips.push("insufficient-scope-challenge");
    }
    if (t.challengeScope === "events:write" || classified.missingScope === "events:write") {
      chips.push("events-write-missing");
    }
    return {
      verdict: "mislabeled",
      reasons,
      mislabeled: true,
      scoped: false,
      chips: [...new Set(chips)],
      challenge: classified.parsed
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, mislabeled: false, scoped: true, chips: [seed], challenge: classified.parsed };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, mislabeled: true, scoped: false, chips: [seed], challenge: classified.parsed };
  }

  reasons.push("empty probe; idle stamp desk is mislabeled");
  return {
    verdict: "mislabeled",
    reasons,
    mislabeled: true,
    scoped: false,
    chips: ["mislabeled"],
    challenge: classified.parsed
  };
}
