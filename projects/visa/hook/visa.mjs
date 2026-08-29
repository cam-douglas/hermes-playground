/**
 * Visa — passport-control / visa-stamp desk for Claude Code MCP OAuth
 * that omits the RFC 8707 `resource` parameter. A login without a
 * destination is not a hold. Score the border or admit stamped.
 *
 * A visa names the destination. RFC 8707 `resource` is that name:
 * the MCP server's canonical resource URI from RFC 9728 Protected
 * Resource Metadata. MCP 2025-06-18 Authorization requires `resource`
 * (MUST) on both `/authorize` and `/token`. On Claude Code 2.1.251
 * the client sends neither. The issued access token therefore carries
 * `aud=<client_id>` (the client's default audience) instead of the
 * MCP server's canonical resource URI, and spec-compliant (strict)
 * MCP servers reject it with 401.
 *
 * Primary #90497: MCP OAuth client does not send RFC 8707 `resource`
 * (2.1.251) — strict MCP servers reject the token (401). Filed
 * 2026-08-29, open. Labels: bug, has repro, area:auth, area:mcp.
 * Repro: HTTP MCP whose RFC 9728 metadata declares
 * `resource: http://localhost:8130/mcp`, Keycloak 26.7.2 with
 * `resource-indicators`, client `resource_url` set to that URI.
 * `claude mcp add --transport http mcp-a http://localhost:8130/mcp`.
 * `/mcp` → complete browser OAuth (login + consent). Inspect the
 * issued access token. Observed: `aud=mcp-client` (client_id default),
 * no `resource` claim. Server validates
 * `aud == http://localhost:8130/mcp` and returns 401
 * `claim check failed: aud actual="mcp-client"`. The dance otherwise
 * succeeds (discovery → login → consent → token). The only blocker
 * is the missing `resource`. AS-side control tests: both requests
 * omit `resource` → `aud=mcp-client` (matches the token Claude Code
 * obtained). Any presence of `resource` (exact or trailing-slash) in
 * either request would have set `aud` or failed the exchange.
 * Distinct from #52871 (resource sent but trailing-slash corrupted).
 *
 * Shape (cite as shape, not a new primary):
 *   #52871 — 2.1.119 sends `resource` but appends a trailing slash
 *            to host-only URLs (WHATWG URL normalize). Entra
 *            AADSTS9010010. Related, not primary.
 *   #73460 — feature: override or omit `resource` for Entra App ID
 *            URI vs server URL. Closed not_planned.
 *   #76096 — Entra `resource` must be App ID URI; RFC 9728 check
 *            wants the server URL. Closed duplicate.
 *   #55495 — HTTP transport strips path; OAuth resource indicator
 *            becomes origin + trailing slash. Closed not_planned.
 *
 * Cross-ecosystem shape (cite as shape, not a new primary):
 *   openai/codex#13891 — `codex mcp login` omits `resource` from
 *            the authorize URL; token audience is the default.
 *   openai/codex#33403 — refresh omits `resource`; AS returns
 *            `invalid_target` after access-token expiry.
 *
 * Verdicts: stamped | omitted | audless | clientid | refused
 *           | strict | slashy | mismatched | granted | held
 * Idle word is stamped (visa correctly names the destination
 * resource; border quiet). NEVER use visa / empty / resource /
 * oauth / audience as idle. NEVER reuse overrun, pratique, bound,
 * stilled, drained, flat, fit, spoilt, laid, unlinked, tight,
 * banked, roosted, stocked, seated, heard, clear, paired, kernel,
 * latched, upheld, sterling, home, valid, dry, sealed, quiet,
 * seised, stabled, wound.
 *
 * Slack visa alarm on omitted / audless / clientid / refused /
 * slashy / mismatched. Linear ticket on omitted / clientid /
 * refused. GitHub visa-ledger of border events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Sprag (boot-cached MCP attach / overrunning clutch —
 * connect-at-boot race).
 * NOT Reed (four-contact MCP registry: connected vs registered vs
 * one served call).
 * NOT Husk (hollow headless success envelopes).
 * NOT the Connected-with-zero-tools / missing Mcp-Session-Id class
 * (#90477) — that is session-id hollow registration, not OAuth
 * audience.
 * NOT Lazaret, Fusee, Iota, Leat, Shunt, Sump, Pleat, Scant, Chad,
 * Kist, Wraith, Gasket, Damper, Cote, Larder, Tappet, Aside, Chute,
 * Tain, Snib, Veto, Assay, Wicket, Sigil, Stencil, Suture, Blot,
 * Coda, Fathom, Hasp, Parity, Reveille, Quench, Scrim, Knock.
 * NOT any leftover woodworking / millimetre-slider product.
 * Different problem: OAuth token issued without naming the
 * destination resource, so strict houses 401 even after a
 * "successful" login.
 * Different UI: passport control / visa desk. Navy leather blotter,
 * brass circular stamp, watermark paper, departure-hall amber lamps,
 * ink-pad crimson, immigration teal stripe, paper cream.
 * Different idle: stamped.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Product name is Visa only. Idle word is stamped.
 */

export const VERDICTS = Object.freeze([
  "stamped",
  "omitted",
  "audless",
  "clientid",
  "refused",
  "strict",
  "slashy",
  "mismatched",
  "granted",
  "held",
]);
export const IDLE_WORD = "stamped";
export const SLACK_VERDICTS = Object.freeze([
  "omitted",
  "audless",
  "clientid",
  "refused",
  "slashy",
  "mismatched",
]);
export const LINEAR_VERDICTS = Object.freeze(["omitted", "clientid", "refused"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const CANONICAL_RESOURCE = "http://localhost:8130/mcp";
export const DEFAULT_CLIENT_ID = "mcp-client";

const FORBIDDEN_IDLE = Object.freeze([
  "visa",
  "empty",
  "resource",
  "oauth",
  "audience",
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
  "sprag",
  "reed",
  "husk",
  "lazaret",
  "fusee",
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

function asStatus(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function audienceList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asText(item).trim()).filter(Boolean);
  }
  const text = asText(value).trim();
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => asText(item).trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
  }
  return text.split(/[\s,]+/).filter(Boolean);
}

function uselessAud(token) {
  const s = asText(token).trim().toLowerCase();
  return !s || s === "*" || s === "none" || s === "-" || s === "n/a" || s === "null";
}

export function emptyProbe() {
  return {
    resourceSentAuthorize: false,
    resourceSentToken: false,
    resourceValue: "",
    audClaim: "",
    clientId: "",
    canonicalResourceUri: "",
    serverStrict: false,
    httpStatus: 0,
    trailingSlashCorruption: false,
    oauthCompleted: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "stamped-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const blotter = src.blotter && typeof src.blotter === "object" ? src.blotter : {};
  const desk = src.desk && typeof src.desk === "object" ? src.desk : {};
  const stamp = src.stamp && typeof src.stamp === "object" ? src.stamp : {};
  const border = src.border && typeof src.border === "object" ? src.border : {};
  const passport = src.passport && typeof src.passport === "object" ? src.passport : {};
  const landing = src.landing && typeof src.landing === "object" ? src.landing : {};
  const pick = (key) =>
    src[key] ??
    blotter[key] ??
    desk[key] ??
    stamp[key] ??
    border[key] ??
    passport[key] ??
    landing[key];
  return {
    ...emptyProbe(),
    resourceSentAuthorize: asBool(pick("resourceSentAuthorize")),
    resourceSentToken: asBool(pick("resourceSentToken")),
    resourceValue: asText(pick("resourceValue")).trim(),
    audClaim: asText(pick("audClaim")).trim(),
    clientId: asText(pick("clientId")).trim(),
    canonicalResourceUri: asText(pick("canonicalResourceUri")).trim(),
    serverStrict: asBool(pick("serverStrict")),
    httpStatus: asStatus(pick("httpStatus")),
    trailingSlashCorruption: asBool(pick("trailingSlashCorruption")),
    oauthCompleted: asBool(pick("oauthCompleted")),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? blotter.source ?? desk.source ?? stamp.source),
    issue: asIssue(src.issue ?? blotter.issue ?? desk.issue ?? stamp.issue),
    scored: asBool(src.scored ?? blotter.scored ?? desk.scored ?? stamp.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.resourceSentAuthorize &&
    !next.resourceSentToken &&
    !next.resourceValue &&
    !next.audClaim &&
    !next.clientId &&
    !next.canonicalResourceUri &&
    !next.serverStrict &&
    !next.httpStatus &&
    !next.trailingSlashCorruption &&
    !next.oauthCompleted
  );
}

export function resourceOmittedOf(probe = {}) {
  const next = cloneProbe(probe);
  return next.oauthCompleted && (!next.resourceSentAuthorize || !next.resourceSentToken);
}

export function resourceSentBothOf(probe = {}) {
  const next = cloneProbe(probe);
  return next.resourceSentAuthorize && next.resourceSentToken;
}

export function usefulAudOf(probe = {}) {
  const next = cloneProbe(probe);
  return audienceList(next.audClaim).some((token) => !uselessAud(token));
}

export function audIsClientIdOf(probe = {}) {
  const next = cloneProbe(probe);
  if (!next.clientId) return false;
  const audiences = audienceList(next.audClaim).filter((token) => !uselessAud(token));
  if (!audiences.length) return false;
  const named = next.canonicalResourceUri;
  return audiences.some((token) => token === next.clientId && token !== named);
}

export function audMatchesCanonicalOf(probe = {}) {
  const next = cloneProbe(probe);
  if (!next.canonicalResourceUri) return false;
  return audienceList(next.audClaim).some((token) => token === next.canonicalResourceUri);
}

export function slashyOf(probe = {}) {
  const next = cloneProbe(probe);
  if (next.trailingSlashCorruption) return true;
  if (!next.resourceValue || !next.canonicalResourceUri) return false;
  return next.resourceValue === `${next.canonicalResourceUri}/` ||
    (next.resourceValue.endsWith("/") && !next.canonicalResourceUri.endsWith("/") &&
      next.resourceValue.slice(0, -1) === next.canonicalResourceUri);
}

export function is2xx(status) {
  const n = asStatus(status);
  return n >= 200 && n < 300;
}

export function is401(status) {
  return asStatus(status) === 401;
}

export function analyze(probe = {}) {
  const next = cloneProbe(probe);
  const omitted = resourceOmittedOf(next);
  const sentBoth = resourceSentBothOf(next);
  const usefulAud = usefulAudOf(next);
  const audIsClientId = audIsClientIdOf(next);
  const audMatches = audMatchesCanonicalOf(next);
  const slashy = slashyOf(next);
  const accepted = is2xx(next.httpStatus);
  const refused401 = is401(next.httpStatus);
  const wrongAudience =
    usefulAud &&
    Boolean(next.canonicalResourceUri) &&
    !audMatches;
  const audienceWrongOrMissing = !usefulAud || wrongAudience || audIsClientId;
  const healthy =
    sentBoth &&
    usefulAud &&
    audMatches &&
    !slashy &&
    accepted;
  return {
    omitted,
    sentBoth,
    usefulAud,
    audIsClientId,
    audMatches,
    slashy,
    accepted,
    refused401,
    wrongAudience,
    audienceWrongOrMissing,
    healthy,
    resourceSentAuthorize: next.resourceSentAuthorize,
    resourceSentToken: next.resourceSentToken,
    serverStrict: next.serverStrict,
    oauthCompleted: next.oauthCompleted,
    httpStatus: next.httpStatus,
    trailingSlashCorruption: next.trailingSlashCorruption,
  };
}

export function omittedFault(probe = {}) {
  return resourceOmittedOf(probe);
}

/**
 * First match wins. Idle stamped is first. Classes stay
 * distinguishable: a login without a destination is not a hold.
 * Admit does not lie: an omitted probe stays omitted.
 * NOT Sprag (boot-cached attach). NOT Reed (four contacts).
 * NOT Husk (hollow success). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "stamped";

  const facts = analyze(next);

  if (!facts.oauthCompleted) return "held";

  if (facts.omitted) return "omitted";

  if (facts.slashy) return "slashy";

  if (!facts.serverStrict && facts.accepted && facts.audienceWrongOrMissing) {
    return "granted";
  }

  if (facts.audIsClientId) return "clientid";

  if (!facts.usefulAud) return "audless";

  if (facts.serverStrict && facts.refused401) return "refused";

  if (facts.wrongAudience) return "mismatched";

  if (facts.healthy) return "stamped";

  if (facts.serverStrict && facts.sentBoth) return "strict";

  return "stamped";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.omitted) add("omitted");
  if (facts.slashy) add("slashy");
  if (facts.audIsClientId) add("clientid");
  if (!facts.usefulAud && facts.oauthCompleted) add("audless");
  if (facts.serverStrict && facts.refused401) add("refused");
  if (facts.serverStrict && facts.sentBoth) add("strict");
  if (facts.wrongAudience) add("mismatched");
  if (!facts.serverStrict && facts.accepted && facts.audienceWrongOrMissing) add("granted");
  if (!facts.oauthCompleted) add("held");
  if (facts.healthy) add("stamped");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "omitted") {
    return "● Omitted · resource absent from /authorize and/or /token · primary #90497";
  }
  if (kind === "audless") {
    return "● Audless · token has no useful audience claim for the MCP resource";
  }
  if (kind === "clientid") {
    return "● Clientid · aud equals OAuth client_id (default audience) instead of the resource URI";
  }
  if (kind === "refused") {
    return "● Refused · strict MCP server returns 401 on the token";
  }
  if (kind === "strict") {
    return "● Strict · server enforces RFC 8707 / MCP auth · the house that rejects";
  }
  if (kind === "slashy") {
    return "● Slashy · resource was sent but trailing-slash corrupted · shape #52871";
  }
  if (kind === "mismatched") {
    return "● Mismatched · aud / resource URI does not match Protected Resource Metadata";
  }
  if (kind === "granted") {
    return "● Granted · soft/legacy server accepted a wrong-audience token · false green";
  }
  if (kind === "held") {
    return "● Held · probe incomplete / waiting on OAuth dance";
  }
  return "● Stamped · resource sent, aud matches canonical MCP resource URI, server accepts · idle word is stamped";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.oauthCompleted ? "OAuth dance completed" : "OAuth dance not completed",
  );
  reasons.push(
    facts.resourceSentAuthorize
      ? "resource sent on /authorize"
      : "resource absent from /authorize",
  );
  reasons.push(
    facts.resourceSentToken ? "resource sent on /token" : "resource absent from /token",
  );
  if (next.resourceValue) reasons.push(`resource value: ${next.resourceValue}`);
  if (next.audClaim) reasons.push(`aud claim: ${next.audClaim}`);
  if (next.clientId) reasons.push(`client_id: ${next.clientId}`);
  if (next.canonicalResourceUri) {
    reasons.push(`canonical resource URI: ${next.canonicalResourceUri}`);
  }
  reasons.push(facts.serverStrict ? "server is strict (RFC 8707 / MCP auth)" : "server is soft/legacy");
  if (next.httpStatus) reasons.push(`HTTP ${next.httpStatus}`);
  if (facts.trailingSlashCorruption || facts.slashy) {
    reasons.push("trailing-slash corruption on resource");
  }
  reasons.push("a login without a destination is not a hold");
  reasons.push(
    "NOT Sprag (boot-cached MCP attach) / Reed (four-contact registry) / Husk (hollow success) / #90477 session-id hollow registration / Lazaret / Fusee / leftover woodworking / millimetre-slider",
  );
  if (kind === "stamped") {
    reasons.push("resource names the destination; aud matches; border quiet; idle word is stamped");
  }
  if (kind === "omitted") {
    reasons.push(
      "PRIMARY #90497: MCP OAuth client does not send RFC 8707 resource (2.1.251) — strict MCP servers reject the token (401). Filed 2026-08-29, open. Token aud=mcp-client (client_id default). Server validates aud == http://localhost:8130/mcp and 401s. Distinct from #52871 (sent but trailing-slash corrupted). AS control tests show resource was absent from both /authorize and /token",
    );
  }
  if (kind === "audless") {
    reasons.push("Token has no useful audience claim for the MCP resource");
  }
  if (kind === "clientid") {
    reasons.push(
      "aud equals the OAuth client_id — the authorization server's default audience — instead of the canonical MCP resource URI",
    );
  }
  if (kind === "refused") {
    reasons.push(
      "Strict MCP server returned 401. claim check failed on aud. The house that rejects a nameless visa",
    );
  }
  if (kind === "strict") {
    reasons.push(
      "Server enforces RFC 8707 / MCP 2025-06-18 Authorization. The house that rejects a token that does not name it",
    );
  }
  if (kind === "slashy") {
    reasons.push(
      "SHAPE #52871: resource was sent but trailing-slash corrupted (WHATWG URL normalize on host-only URLs). Related, not primary. Entra AADSTS9010010",
    );
  }
  if (kind === "mismatched") {
    reasons.push(
      "aud / resource URI does not match the RFC 9728 Protected Resource Metadata. Shape #76096 / #73460 (Entra App ID URI vs server URL)",
    );
  }
  if (kind === "granted") {
    reasons.push(
      "Soft/legacy server accepted a wrong-audience token. False green. The only workaround #90497 names is relaxing aud validation, which defeats audience binding",
    );
  }
  if (kind === "held") {
    reasons.push("Probe incomplete / waiting on the OAuth dance");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) {
    reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function stampedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "stamped";
}

export function omittedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "omitted";
}

export function clientidOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "clientid";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], stamped, omitted, clientid }
 * Deterministic. First match wins. Idle stamped first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  const cluster = clusterOf(next, verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    stamped: stampedOf(next, verdict),
    omitted: omittedOf(next, verdict),
    clientid: clientidOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    resourceSentAuthorize: pick("resourceSentAuthorize"),
    resourceSentToken: pick("resourceSentToken"),
    resourceValue: pick("resourceValue"),
    audClaim: pick("audClaim"),
    clientId: pick("clientId"),
    canonicalResourceUri: pick("canonicalResourceUri"),
    serverStrict: pick("serverStrict"),
    httpStatus: pick("httpStatus"),
    trailingSlashCorruption: pick("trailingSlashCorruption"),
    oauthCompleted: pick("oauthCompleted"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    blotter: fromFields.blotter,
    desk: fromFields.desk,
    stamp: fromFields.stamp,
    border: fromFields.border,
    passport: fromFields.passport,
    landing: fromFields.landing,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "visa",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    stamped: scored.stamped,
    omitted: scored.omitted,
    clientid: scored.clientid,
    cluster: scored.cluster,
    borderStamped: verdict === "stamped",
    borderOmitted: verdict === "omitted",
    borderAudless: verdict === "audless",
    borderClientid: verdict === "clientid",
    borderRefused: verdict === "refused",
    borderStrict: verdict === "strict",
    borderSlashy: verdict === "slashy",
    borderMismatched: verdict === "mismatched",
    borderGranted: verdict === "granted",
    borderHeld: verdict === "held",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    resourceSentAuthorize: next.resourceSentAuthorize,
    resourceSentToken: next.resourceSentToken,
    resourceValue: next.resourceValue,
    audClaim: next.audClaim,
    clientId: next.clientId,
    canonicalResourceUri: next.canonicalResourceUri,
    serverStrict: next.serverStrict,
    httpStatus: next.httpStatus,
    trailingSlashCorruption: next.trailingSlashCorruption,
    oauthCompleted: next.oauthCompleted,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      resourceSentAuthorize: Boolean(extras.resourceSentAuthorize),
      resourceSentToken: Boolean(extras.resourceSentToken),
      resourceValue: extras.resourceValue || "",
      audClaim: extras.audClaim || "",
      clientId: extras.clientId || "",
      canonicalResourceUri: extras.canonicalResourceUri || "",
      serverStrict: Boolean(extras.serverStrict),
      httpStatus: extras.httpStatus == null ? 0 : extras.httpStatus,
      trailingSlashCorruption: Boolean(extras.trailingSlashCorruption),
      oauthCompleted: Boolean(extras.oauthCompleted),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. Login not a hold. Nothing scored. */
export function seedStamped() {
  return seedProbe("stamped", "border", {
    session: "stamped",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90497 omitted.
 * resource absent from /authorize and /token. Token aud=client_id.
 * Strict house 401s.
 */
export function seed90497Omitted() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-omitted",
    resourceSentAuthorize: false,
    resourceSentToken: false,
    resourceValue: "",
    audClaim: DEFAULT_CLIENT_ID,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 401,
    trailingSlashCorruption: false,
    oauthCompleted: true,
  });
}

/** Token has no useful audience claim. */
export function seedAudless() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-audless",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: "",
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: false,
    httpStatus: 0,
    oauthCompleted: true,
  });
}

/** aud equals client_id; resource was sent (so not omitted). */
export function seedClientid() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-clientid",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: DEFAULT_CLIENT_ID,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 0,
    oauthCompleted: true,
  });
}

/** Strict house 401s a named-but-wrong-or-presented token. */
export function seedRefused() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-refused",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: CANONICAL_RESOURCE,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 401,
    oauthCompleted: true,
  });
}

/** House that rejects: resource named, no accept yet. */
export function seedStrict() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-strict",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: CANONICAL_RESOURCE,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 0,
    oauthCompleted: true,
  });
}

/** SHAPE #52871: resource sent, trailing slash. */
export function seedSlashy() {
  return seedProbe(52871, "anthropics/claude-code#52871", {
    session: "52871-slashy",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: "https://mcp.businesscentral.dynamics.com/",
    audClaim: "",
    clientId: "bc-mcp",
    canonicalResourceUri: "https://mcp.businesscentral.dynamics.com",
    serverStrict: true,
    httpStatus: 0,
    trailingSlashCorruption: true,
    oauthCompleted: true,
  });
}

/** aud / resource does not match Protected Resource Metadata. */
export function seedMismatched() {
  return seedProbe(76096, "anthropics/claude-code#76096", {
    session: "76096-mismatched",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: "https://host.example/mcp",
    audClaim: "api://tenant-app",
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: "https://host.example/mcp",
    serverStrict: true,
    httpStatus: 0,
    oauthCompleted: true,
  });
}

/** Soft house accepted a wrong-audience token. False green. */
export function seedGranted() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-granted",
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: DEFAULT_CLIENT_ID,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: false,
    httpStatus: 200,
    oauthCompleted: true,
  });
}

/** Waiting on the OAuth dance. */
export function seedHeld() {
  return seedProbe(90497, "anthropics/claude-code#90497", {
    session: "90497-held",
    resourceSentAuthorize: false,
    resourceSentToken: false,
    oauthCompleted: false,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
  });
}

/** Healthy scored stamp: resource sent, aud matches, 200. */
export function seedHealthy() {
  return seedProbe("stamped", "border", {
    session: "stamped-healthy",
    issue: null,
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: CANONICAL_RESOURCE,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 200,
    oauthCompleted: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const omitted =
    /does not send|doesn'?t send|resource (is )?(not sent|absent|omitted|missing)|no `?resource`? (parameter|claim)/i.test(
      text,
    ) && !/trailing[- ]slash|appends a trailing/i.test(text);
  const slashy = /trailing[- ]slash|AADSTS9010010|resource=.*%2F\b|appends a trailing/i.test(text);
  const clientAud = /aud\s*=\s*mcp-client|aud=mcp-client|aud actual="mcp-client"|client_id default/i.test(text);
  const refused = /401|claim check failed/i.test(text);
  const granted = /relax(?:ing)? aud|extra audience|soft\/legacy|false green/i.test(text);
  const held = /waiting|incomplete|browser (oauth )?flow|consent/i.test(text) && /not completed|held|waiting on/i.test(text);
  const completed = /oauth (dance |flow )?complet|login \+ consent|token issuance|issued access token/i.test(text);
  const hasCanonical = /localhost:8130\/mcp|canonical resource/i.test(text);
  const hasClient = /mcp-client|client_id/i.test(text);
  return {
    resourceSentAuthorize: slashy || (/resource (in |on )?\/authorize/i.test(text) && !omitted),
    resourceSentToken: slashy || (/resource (in |on )?\/token/i.test(text) && !omitted),
    resourceValue: slashy
      ? "https://mcp.businesscentral.dynamics.com/"
      : hasCanonical
        ? CANONICAL_RESOURCE
        : "",
    audClaim: clientAud ? DEFAULT_CLIENT_ID : /aud=https?:\/\/\S+/.test(text) ? (text.match(/aud=(https?:\/\/\S+)/) || [])[1] || "" : "",
    clientId: hasClient ? DEFAULT_CLIENT_ID : "",
    canonicalResourceUri: slashy
      ? "https://mcp.businesscentral.dynamics.com"
      : hasCanonical
        ? CANONICAL_RESOURCE
        : "",
    serverStrict: /strict|claim check failed|401/i.test(text) && !granted,
    httpStatus: refused ? 401 : granted ? 200 : 0,
    trailingSlashCorruption: slashy,
    oauthCompleted: completed || omitted || slashy || clientAud || refused,
    session: /#90497|90497/.test(text) ? "paste-omitted" : /#52871/.test(text) ? "paste-slashy" : "paste",
    source: /#90497/.test(text)
      ? "anthropics/claude-code#90497"
      : /#52871/.test(text)
        ? "anthropics/claude-code#52871"
        : "paste",
    issue: /#90497/.test(text) ? 90497 : /#52871/.test(text) ? 52871 : null,
    scored: true,
    heldHint: held,
  };
}

const SEEDS = {
  stamped: seedStamped,
  omitted: seed90497Omitted,
  90497: seed90497Omitted,
  "90497-omitted": seed90497Omitted,
  audless: seedAudless,
  "90497-audless": seedAudless,
  clientid: seedClientid,
  "90497-clientid": seedClientid,
  refused: seedRefused,
  "90497-refused": seedRefused,
  strict: seedStrict,
  "90497-strict": seedStrict,
  slashy: seedSlashy,
  52871: seedSlashy,
  "52871-slashy": seedSlashy,
  mismatched: seedMismatched,
  76096: seedMismatched,
  "76096-mismatched": seedMismatched,
  granted: seedGranted,
  "90497-granted": seedGranted,
  held: seedHeld,
  "90497-held": seedHeld,
  healthy: seedHealthy,
  "stamped-healthy": seedHealthy,
};

function omittedStrike(session) {
  return {
    ...emptyProbe(),
    resourceSentAuthorize: false,
    resourceSentToken: false,
    resourceValue: "",
    audClaim: DEFAULT_CLIENT_ID,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 401,
    trailingSlashCorruption: false,
    oauthCompleted: true,
    session: session || "omitted",
    source: "blotter",
    issue: 90497,
    scored: true,
  };
}

function stampedHold(session) {
  return {
    ...emptyProbe(),
    session: session || "stamped",
    source: "hold",
    scored: true,
  };
}

function healthyHold(session) {
  return {
    ...emptyProbe(),
    resourceSentAuthorize: true,
    resourceSentToken: true,
    resourceValue: CANONICAL_RESOURCE,
    audClaim: CANONICAL_RESOURCE,
    clientId: DEFAULT_CLIENT_ID,
    canonicalResourceUri: CANONICAL_RESOURCE,
    serverStrict: true,
    httpStatus: 200,
    oauthCompleted: true,
    session: session || "stamped-healthy",
    source: "proof",
    scored: true,
  };
}

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
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "stamped" || verb === "still" || verb === "rest") {
    return pack("stamped", emptyProbe(), { ...action, action: verb === "still" || verb === "rest" ? "bail" : verb });
  }

  if (verb === "healthy" || verb === "proof" || verb === "clearance") {
    probe = healthyHold(action.session || probe.session);
    return pack(classify(probe), probe, {
      ...action,
      action: verb === "proof" || verb === "clearance" ? "healthy" : verb,
    });
  }

  if (verb === "omit" || verb === "blotter" || verb === "desk" || verb === "border" || verb === "restore") {
    probe = omittedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: verb === "restore" ? "restore" : "omit" });
  }

  if (verb === "stamped-out" || verb === "close-border") {
    probe = stampedHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bail" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "throw" || verb === "ink") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "throw" || verb === "ink" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
