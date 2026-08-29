/**
 * Fob — hotel front-desk key rack / locksmith fob board for a real
 * Claude Code failure class: macOS Keychain credential proliferation
 * and store split-brain. A grant mints a new
 * `Claude Code-credentials-<hash>` item instead of reusing the live
 * one. CLI and desktop compute different hashes from scope-set /
 * client identity. Stale items are never garbage-collected.
 * Keychain-only rotation vs file-only `/login` splits the refresh-
 * token family and forces re-auth.
 *
 * A new login is not a hold. Score the rack or admit hung.
 *
 * Primary #90527: 110 Keychain items in 5 weeks; new hash-suffixed
 * item per login; CLI vs desktop never share; forced re-auth.
 *
 * Same-class corroborator #84275: 75 daily items, 1,156 duplicated
 * OAuth/MCP tokens, never cleaned.
 *
 * Shape (cite as shape, not a new primary):
 *   #78020 — Keychain-only rotation vs .credentials.json-only /login
 *            (split-brain revokes the token family).
 *   #89801 — /login success never persists (Keychain timeout skips
 *            file fallback).
 *   #79407 — locked keychain, login reports success, still logged out.
 *   #83345 — corrupted Keychain login loop.
 * Cross-ecosystem:
 *   openai/codex#33540 — direct-keyring regression coverage for
 *            concurrent MCP OAuth refreshes.
 *   openai/codex#38691 — detached app-server OAuth Keychain access
 *            failure.
 *   openai/codex#24204 — CLI cannot reach macOS Keychain after update.
 *
 * Verdicts: hung | minted | hoard | split | false-cut | scope-key
 * Idle word is hung (one live service name, Keychain and
 * ~/.claude/.credentials.json agree on the same token generation,
 * no stale Claude Code-credentials-* litter, CLI and desktop share
 * the key). NEVER use fob / empty / keychain / login as idle.
 * NEVER reuse appointed, cinched, gauged, stamped, overrun,
 * pratique, wound, bound, stilled, stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight, banked, roosted, stocked, seated,
 * heard, clear, paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised.
 *
 * Slack alarm on minted / hoard / split / false-cut / scope-key.
 * Linear ticket on minted / hoard / split.
 * GitHub fob-ledger of scored racks on every score.
 *
 * Why this is not a clone:
 * NOT Visa (MCP OAuth missing RFC 8707 resource).
 * NOT Snib (permission night-latch).
 * NOT Chute (typed secret handoff).
 * NOT Wraith (live-image unlink).
 * NOT Iota (Windows path-key identity / case collision).
 * NOT Ordo (headless plugin slash-command unknown + exit 0).
 * NOT Cinch (partial folder mounts).
 * NOT Ullage (silent context drop / prefix-freeze).
 * Different problem: KEYCHAIN CREDENTIAL LITTER — did a login reuse
 * the live item, or mint another hash-suffixed fob? A login success
 * string is not a hold.
 * Different UI: hotel key-rack / brass fob board. Dark oak, stamped
 * brass, numbered hooks, hanging tags that multiply.
 * Different idle: hung.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 */

export const VERDICTS = Object.freeze([
  "hung",
  "minted",
  "hoard",
  "split",
  "false-cut",
  "scope-key",
]);
export const IDLE_WORD = "hung";
export const SLACK_VERDICTS = Object.freeze([
  "minted",
  "hoard",
  "split",
  "false-cut",
  "scope-key",
]);
export const LINEAR_VERDICTS = Object.freeze(["minted", "hoard", "split"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const HOARD_THRESHOLD = 20;
export const LIVE_SERVICE = "Claude Code-credentials";
export const FILE_STORE = "~/.claude/.credentials.json";
export const CLI_SCOPES = Object.freeze([
  "user:file_upload",
  "user:inference",
  "user:mcp_servers",
  "user:profile",
  "user:sessions:claude_code",
]);
export const DESKTOP_SCOPES = Object.freeze([
  "user:inference",
  "user:file_upload",
  "user:profile",
  "user:sessions:claude_code",
]);

const FORBIDDEN_IDLE = Object.freeze([
  "fob",
  "empty",
  "keychain",
  "login",
  "rack",
  "hook",
  "appointed",
  "ordo",
  "missal",
  "cinch",
  "cinched",
  "mount",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "bound",
  "stilled",
  "stabled",
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
  "ullage",
  "visa",
  "sprag",
  "fusee",
  "wicket",
  "larder",
  "hasp",
  "tappet",
  "reed",
  "assay",
  "snib",
  "chute",
  "wraith",
  "iota",
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

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

function asNum(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((row) => asText(row).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((row) => row.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeScopes(list) {
  return [...new Set(asList(list))].sort();
}

function scopesEqual(a, b) {
  const left = normalizeScopes(a);
  const right = normalizeScopes(b);
  if (left.length === 0 && right.length === 0) return true;
  if (left.length !== right.length) return false;
  return left.every((row, i) => row === right[i]);
}

export function itemHash(service) {
  const text = asText(service);
  const match = text.match(/Claude Code-credentials-([0-9a-f]{8})\b/i);
  return match ? match[1].toLowerCase() : "";
}

export function isHashedService(service) {
  return Boolean(itemHash(service));
}

export function maskSecrets(text) {
  return asText(text)
    .replace(/sk-ant-[a-z0-9_-]+/gi, "sk-ant-••••")
    .replace(/(["']?(?:accessToken|refreshToken|password|secret|token)["']?\s*[:=]\s*["'])[^"']+/gi, "$1••••")
    .replace(/\b[A-Za-z0-9+/_-]{48,}={0,2}\b/g, "••••");
}

export function emptyItem() {
  return {
    service: "",
    hash: "",
    cdat: "",
    mdat: "",
    acct: "",
    kind: "",
  };
}

export function emptyRack() {
  return {
    session: "",
    source: "",
    issue: null,
    scored: false,
    items: [],
    liveService: "",
    fileStore: FILE_STORE,
    fileMtime: "",
    keychainMdat: "",
    keychainCdat: "",
    fileGeneration: "",
    keychainGeneration: "",
    cliScopes: [],
    desktopScopes: [],
    storedScopes: [],
    minted: false,
    loginReportedSuccess: false,
    persisted: null,
    loginExpired: false,
    revoked401: false,
    historicalMcpOAuthCopies: 0,
    sharedCliDesktop: null,
  };
}

export function emptyAction(session = "hung-1") {
  return {
    action: "score",
    session,
    rack: emptyRack(),
  };
}

function cloneItem(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyItem();
  const service = asText(src.service || src.svce || src.name);
  return {
    ...emptyItem(),
    service,
    hash: asText(src.hash) || itemHash(service),
    cdat: asText(src.cdat || src.created || src.createdAt),
    mdat: asText(src.mdat || src.modified || src.modifiedAt),
    acct: asText(src.acct || src.account),
    kind: asText(src.kind || src.class),
  };
}

export function cloneRack(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyRack();
  const nested =
    (src.rack && typeof src.rack === "object" && src.rack) ||
    (src.board && typeof src.board === "object" && src.board) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.trace && typeof src.trace === "object" && src.trace) ||
    (src.dump && typeof src.dump === "object" && src.dump) ||
    src;
  const file =
    (nested.file && typeof nested.file === "object" && nested.file) ||
    (nested.fileStore && typeof nested.fileStore === "object" && nested.fileStore) ||
    {};
  const itemsRaw = Array.isArray(nested.items)
    ? nested.items
    : Array.isArray(nested.services)
      ? nested.services
      : [];
  const items = itemsRaw.map(cloneItem).filter((row) => row.service);
  return {
    ...emptyRack(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    source: asText(nested.source ?? src.source),
    issue: asIssue(nested.issue ?? src.issue),
    scored: asBool(nested.scored ?? src.scored, false),
    items,
    liveService: asText(nested.liveService ?? src.liveService ?? nested.live),
    fileStore: asText(nested.fileStore ?? file.path ?? src.fileStore) || FILE_STORE,
    fileMtime: asText(nested.fileMtime ?? file.mtime ?? src.fileMtime),
    keychainMdat: asText(nested.keychainMdat ?? src.keychainMdat ?? nested.mdat),
    keychainCdat: asText(nested.keychainCdat ?? src.keychainCdat ?? nested.cdat),
    fileGeneration: asText(nested.fileGeneration ?? file.generation ?? src.fileGeneration),
    keychainGeneration: asText(
      nested.keychainGeneration ?? src.keychainGeneration ?? nested.generation,
    ),
    cliScopes: normalizeScopes(nested.cliScopes ?? src.cliScopes ?? nested.cli),
    desktopScopes: normalizeScopes(nested.desktopScopes ?? src.desktopScopes ?? nested.desktop),
    storedScopes: normalizeScopes(nested.storedScopes ?? file.scopes ?? src.storedScopes),
    minted: asBool(nested.minted ?? src.minted, false) === true,
    loginReportedSuccess: asBool(nested.loginReportedSuccess ?? src.loginReportedSuccess, false) === true,
    persisted: asBool(nested.persisted ?? src.persisted, null),
    loginExpired: asBool(nested.loginExpired ?? src.loginExpired, false) === true,
    revoked401: asBool(nested.revoked401 ?? src.revoked401, false) === true,
    historicalMcpOAuthCopies: asNum(nested.historicalMcpOAuthCopies ?? src.historicalMcpOAuthCopies) || 0,
    sharedCliDesktop: asBool(nested.sharedCliDesktop ?? src.sharedCliDesktop, null),
  };
}

export function parseKeychainDump(text) {
  const seen = new Set();
  const items = [];
  const re = /Claude Code-credentials(?:-[0-9a-f]{8})?/gi;
  const raw = asText(text);
  let match;
  while ((match = re.exec(raw))) {
    const service = match[0].replace(/"$/, "");
    if (seen.has(service)) continue;
    seen.add(service);
    const around = raw.slice(Math.max(0, match.index - 240), match.index + 360);
    const cdat = (around.match(/cdat[^"]*"([0-9TZ]+)"/i) || [])[1] || "";
    const mdat = (around.match(/mdat[^"]*"([0-9TZ]+)"/i) || [])[1] || "";
    items.push({
      ...emptyItem(),
      service,
      hash: itemHash(service),
      cdat,
      mdat,
    });
  }
  return items;
}

export function parseScopes(text) {
  const raw = asText(text);
  const env = raw.match(/CLAUDE_CODE_OAUTH_SCOPES\s*[=:]\s*([^\n]+)/i);
  if (env) return normalizeScopes(env[1]);
  const json = raw.match(/"scopes"\s*:\s*\[([^\]]*)\]/i);
  if (json) {
    return normalizeScopes(
      json[1]
        .split(",")
        .map((row) => row.replace(/["'\s]/g, ""))
        .filter(Boolean),
    );
  }
  if (/user:(?:inference|profile|mcp_servers|file_upload|sessions:claude_code)/i.test(raw)) {
    return normalizeScopes(raw.match(/user:[a-z0-9:_]+/gi) || []);
  }
  return [];
}

function parseFileMtime(text) {
  const raw = asText(text);
  const iso = raw.match(
    /(?:file|credentials\.json|mtime)\s*[:=]?\s*([0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9:]{5,8}Z?)/i,
  );
  if (iso) return iso[1];
  const stat = raw.match(/\.credentials\.json[^\n]*?([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2})/);
  return stat ? stat[1] : "";
}

function parseGeneration(text, which) {
  const raw = asText(text);
  const re =
    which === "file"
      ? /file(?:Store)?(?:\s+generation)?\s*[:=]\s*([A-Za-z0-9._-]+)/i
      : /keychain(?:\s+generation)?\s*[:=]\s*([A-Za-z0-9._-]+)/i;
  const match = raw.match(re);
  return match ? match[1] : "";
}

export function analyze(rack = {}) {
  const next = cloneRack(rack);
  const items = next.items;
  const itemCount = items.length || asNum(rack.itemCount) || 0;
  const hashed = items.filter((row) => isHashedService(row.service));
  const liveName = next.liveService || (items.length === 1 ? items[0].service : "");
  const hashedLitter = hashed.filter((row) => row.service !== liveName);
  const latestMdat =
    next.keychainMdat ||
    items
      .map((row) => row.mdat)
      .filter(Boolean)
      .sort()
      .at(-1) ||
    "";
  const scopesDiverge =
    next.cliScopes.length > 0 &&
    next.desktopScopes.length > 0 &&
    !scopesEqual(next.cliScopes, next.desktopScopes);
  const mcpOnlyOnOne =
    (next.cliScopes.includes("user:mcp_servers") && !next.desktopScopes.includes("user:mcp_servers")) ||
    (next.desktopScopes.includes("user:mcp_servers") && !next.cliScopes.includes("user:mcp_servers"));
  const generationsAgree =
    Boolean(next.fileGeneration) &&
    Boolean(next.keychainGeneration) &&
    next.fileGeneration === next.keychainGeneration;
  const generationsDiverge =
    Boolean(next.fileGeneration) &&
    Boolean(next.keychainGeneration) &&
    next.fileGeneration !== next.keychainGeneration;
  const timesDiverge =
    Boolean(latestMdat) &&
    Boolean(next.fileMtime) &&
    latestMdat.replace(/[-:TZ]/g, "").slice(0, 12) !==
      next.fileMtime.replace(/[-:TZ ]/g, "").slice(0, 12);
  const storesSplit = generationsDiverge || timesDiverge || next.sharedCliDesktop === false && !scopesDiverge && itemCount <= 2 && !next.minted;
  const justMinted = next.minted || (hashedLitter.length > 0 && itemCount > 1 && itemCount < HOARD_THRESHOLD);
  const hoard =
    itemCount >= HOARD_THRESHOLD || next.historicalMcpOAuthCopies >= 100;
  const oneLive =
    itemCount === 1 &&
    !hashedLitter.length &&
    (generationsAgree || (!next.fileGeneration && !next.keychainGeneration)) &&
    !timesDiverge &&
    !scopesDiverge &&
    next.sharedCliDesktop !== false &&
    next.persisted !== false &&
    !next.loginExpired &&
    !next.revoked401;
  const loginExpiredChip = next.loginExpired || next.revoked401;
  return {
    itemCount: itemCount || items.length,
    hashedCount: hashed.length,
    hashedLitter: hashedLitter.length,
    liveService: liveName,
    latestMdat,
    fileMtime: next.fileMtime,
    scopesDiverge,
    mcpOnlyOnOne,
    generationsAgree,
    generationsDiverge,
    timesDiverge,
    storesSplit: Boolean(storesSplit && !justMinted),
    justMinted,
    hoard,
    oneLive,
    loginExpiredChip,
    cliScopes: next.cliScopes,
    desktopScopes: next.desktopScopes,
    storedScopes: next.storedScopes,
    historicalMcpOAuthCopies: next.historicalMcpOAuthCopies,
    loginReportedSuccess: next.loginReportedSuccess,
    persisted: next.persisted,
    minted: next.minted,
    sharedCliDesktop: next.sharedCliDesktop,
  };
}

export function isIdle(rack = {}) {
  const next = cloneRack(rack);
  return (
    next.items.length === 0 &&
    !next.liveService &&
    !next.fileMtime &&
    !next.keychainMdat &&
    !next.keychainCdat &&
    !next.fileGeneration &&
    !next.keychainGeneration &&
    next.cliScopes.length === 0 &&
    next.desktopScopes.length === 0 &&
    next.storedScopes.length === 0 &&
    !next.minted &&
    !next.loginReportedSuccess &&
    next.persisted == null &&
    !next.loginExpired &&
    !next.revoked401 &&
    next.historicalMcpOAuthCopies === 0 &&
    next.sharedCliDesktop == null
  );
}

/**
 * First match wins. Idle hung is first. Classes stay distinguishable:
 * a login success string is not a hold. Admit hung only when one live
 * service, stores agree, no stale litter, CLI and desktop share.
 */
export function classify(rack = {}) {
  const next = cloneRack(rack);
  if (isIdle(next)) return "hung";
  const facts = analyze(next);

  if (next.loginReportedSuccess && next.persisted === false) return "false-cut";
  if (next.minted || (facts.justMinted && !facts.scopesDiverge && facts.itemCount < HOARD_THRESHOLD)) {
    return "minted";
  }
  if (facts.scopesDiverge || facts.mcpOnlyOnOne || next.sharedCliDesktop === false && facts.itemCount <= 3 && !facts.hoard) {
    return "scope-key";
  }
  if (facts.hoard) return "hoard";
  if (facts.storesSplit || facts.generationsDiverge || facts.timesDiverge) return "split";
  if (facts.loginExpiredChip && !facts.oneLive) return "split";
  if (facts.oneLive || facts.generationsAgree) return "hung";
  return "hung";
}

export function feedOf(rack = {}, verdict = "") {
  const kind = verdict || classify(rack);
  if (kind === "minted") {
    return "● Minted · a new Claude Code-credentials-<8hex> was written instead of updating the live item · primary #90527";
  }
  if (kind === "hoard") {
    return "● Hoard · unbounded items, never GC'd · #84275 75/110 items, historical mcpOAuth copies";
  }
  if (kind === "split") {
    return "● Split · Keychain mdat/cdat advanced, .credentials.json mtime did not, or vice versa · #78020";
  }
  if (kind === "false-cut") {
    return "● False-cut · /login or TUI reports success but credentials never persisted · #89801 #79407";
  }
  if (kind === "scope-key") {
    return "● Scope-key · CLI vs desktop advertised scopes differ so CredentialKey hashes diverge · #90527";
  }
  return "● Hung · one live service, stores agree, no stale litter, CLI and desktop share · idle word is hung";
}

export function reasonsOf(rack = {}, verdict = "") {
  const next = cloneRack(rack);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.itemCount
      ? `rack ${facts.itemCount} item${facts.itemCount === 1 ? "" : "s"} · live ${facts.liveService || "—"}`
      : "one hung fob on the rack · idle word is hung",
  );
  if (facts.hashedLitter) {
    reasons.push(`${facts.hashedLitter} hash-suffixed Claude Code-credentials-* beside the live item`);
  }
  if (facts.justMinted || next.minted) {
    reasons.push("a new hash-suffixed item was written instead of updating the live fob");
  }
  if (facts.hoard) {
    reasons.push(
      `unbounded Keychain litter · ${facts.itemCount} items · ${facts.historicalMcpOAuthCopies || 0} historical mcpOAuth copies`,
    );
  }
  if (facts.timesDiverge || facts.generationsDiverge) {
    reasons.push(
      `store split · keychain mdat ${facts.latestMdat || "—"} · file mtime ${facts.fileMtime || "—"} · generations ${next.keychainGeneration || "—"} / ${next.fileGeneration || "—"}`,
    );
  }
  if (next.loginReportedSuccess && next.persisted === false) {
    reasons.push("/login or TUI reported success · credentials never persisted");
  }
  if (facts.scopesDiverge || facts.mcpOnlyOnOne) {
    reasons.push(
      `scope-key · CLI [${facts.cliScopes.join(" ")}] · desktop [${facts.desktopScopes.join(" ")}] · user:mcp_servers ${facts.mcpOnlyOnOne ? "only on one side" : "aligned"}`,
    );
  }
  if (facts.loginExpiredChip) {
    reasons.push("Login expired · Please run /login · this chip is a fail, not a hold");
  }
  if (next.revoked401) reasons.push("401 OAuth access token has been revoked · token family");
  reasons.push("a new login is not a hold");
  reasons.push(
    "NOT Visa (MCP OAuth missing resource) / Snib (night-latch) / Chute (secret handoff) / Wraith (live-image unlink) / Iota (path-key identity) / Ordo (headless plugin unknown) / Cinch (partial mounts) / Ullage (silent context drop) / leftover woodworking / millimetre-slider",
  );
  if (kind === "hung") {
    reasons.push("one live service, Keychain and file agree, no stale litter, CLI and desktop share; idle word is hung");
  }
  if (kind === "minted") {
    reasons.push(
      "PRIMARY #90527: a grant minted Claude Code-credentials-<8hex> instead of reusing the live item. CLI and desktop never share. Forced re-auth.",
    );
  }
  if (kind === "hoard") {
    reasons.push(
      "#84275: 75 daily items, 1,156 duplicated OAuth/MCP tokens, never garbage-collected. Historical mcpOAuth copies remain recoverable.",
    );
  }
  if (kind === "split") {
    reasons.push(
      "#78020: Keychain-only rotation vs .credentials.json-only /login. Split-brain later revokes the token family.",
    );
  }
  if (kind === "false-cut") {
    reasons.push("#89801 / #79407: /login or TUI reports success but credentials never persisted. Locked keychain skips file fallback.");
  }
  if (kind === "scope-key") {
    reasons.push(
      "#90527 contributing: CLI advertises user:mcp_servers; desktop CLAUDE_CODE_OAUTH_SCOPES omits it. CredentialKey hashes diverge.",
    );
  }
  return reasons;
}

export function verdictOf(rack = {}) {
  return classify(rack);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function hungOf(rack = {}, verdict = "") {
  return (verdict || classify(rack)) === "hung";
}

export function mintedOf(rack = {}, verdict = "") {
  return (verdict || classify(rack)) === "minted";
}

export function summaryOf(rack = {}) {
  const next = cloneRack(rack);
  const facts = analyze(next);
  return {
    itemCount: facts.itemCount,
    hashedCount: facts.hashedCount,
    liveService: facts.liveService || LIVE_SERVICE,
    keychainMdat: facts.latestMdat,
    fileMtime: facts.fileMtime,
    fileStore: next.fileStore,
    cliScopes: facts.cliScopes,
    desktopScopes: facts.desktopScopes,
    storedScopes: facts.storedScopes,
    historicalMcpOAuthCopies: facts.historicalMcpOAuthCopies,
    loginExpired: facts.loginExpiredChip,
    services: next.items.map((row) => row.service),
  };
}

export function score(rack = {}) {
  const next = cloneRack(rack);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    hung: hungOf(next, verdict),
    minted: mintedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    itemCount: facts.itemCount,
    hashedCount: facts.hashedCount,
    hashedLitter: facts.hashedLitter,
    liveService: facts.liveService,
    loginExpired: facts.loginExpiredChip,
    storesSplit: facts.storesSplit,
    scopesDiverge: facts.scopesDiverge,
    oneLive: facts.oneLive,
    summary: summaryOf(next),
    rack: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const rackSrc =
    src.rack || src.board || src.probe || src.dump || payload.rack || payload.board || payload.probe;
  const rack = cloneRack(
    rackSrc && typeof rackSrc === "object" ? { ...rackSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !rack.session) rack.session = src.session;
  if (typeof payload.session === "string" && !rack.session) rack.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? rack.session ?? ""),
    rack,
    issue: src.issue ?? payload.issue ?? rack.issue ?? null,
    source: src.source ?? payload.source ?? rack.source ?? "",
  };
}

function rackResult(verdict, rack, action, extras = {}) {
  const next = cloneRack(rack);
  const scored = score(next);
  return {
    ok: true,
    product: "fob",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    hung: scored.hung,
    minted: scored.minted,
    rackHung: verdict === "hung",
    rackMinted: verdict === "minted",
    rackHoard: verdict === "hoard",
    rackSplit: verdict === "split",
    rackFalseCut: verdict === "false-cut",
    rackScopeKey: verdict === "scope-key",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    itemCount: scored.itemCount,
    hashedCount: scored.hashedCount,
    hashedLitter: scored.hashedLitter,
    liveService: scored.liveService,
    loginExpired: scored.loginExpired,
    storesSplit: scored.storesSplit,
    scopesDiverge: scored.scopesDiverge,
    oneLive: scored.oneLive,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    rack: next,
    ...extras,
  };
}

function seedRack(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  const items = Array.isArray(extras.items) ? extras.items.map(cloneItem) : [];
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    rack: {
      ...emptyRack(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      items,
      liveService: asText(extras.liveService),
      fileStore: asText(extras.fileStore) || FILE_STORE,
      fileMtime: asText(extras.fileMtime),
      keychainMdat: asText(extras.keychainMdat),
      keychainCdat: asText(extras.keychainCdat),
      fileGeneration: asText(extras.fileGeneration),
      keychainGeneration: asText(extras.keychainGeneration),
      cliScopes: normalizeScopes(extras.cliScopes),
      desktopScopes: normalizeScopes(extras.desktopScopes),
      storedScopes: normalizeScopes(extras.storedScopes),
      minted: Boolean(extras.minted),
      loginReportedSuccess: Boolean(extras.loginReportedSuccess),
      persisted: extras.persisted !== undefined ? extras.persisted : null,
      loginExpired: Boolean(extras.loginExpired),
      revoked401: Boolean(extras.revoked401),
      historicalMcpOAuthCopies: extras.historicalMcpOAuthCopies || 0,
      sharedCliDesktop: extras.sharedCliDesktop !== undefined ? extras.sharedCliDesktop : null,
    },
  };
}

function hashedItem(hash, extras = {}) {
  return {
    service: `Claude Code-credentials-${hash}`,
    hash,
    cdat: extras.cdat || "",
    mdat: extras.mdat || extras.cdat || "",
    kind: "genp",
  };
}

/** Idle / bail. Rack not scored as a live grant. One hung fob. */
export function seedHung() {
  return seedRack("hung", "lobby", {
    session: "hung",
    issue: null,
    scored: true,
  });
}

/**
 * Control: one live unsuffixed item, file agrees, CLI and desktop share.
 */
export function seedControl() {
  return seedRack("hung", "lobby", {
    session: "90527-control",
    issue: null,
    items: [{ service: LIVE_SERVICE, hash: "", cdat: "20260828090000Z", mdat: "20260829080000Z", kind: "genp" }],
    liveService: LIVE_SERVICE,
    fileMtime: "2026-08-29T08:00:00Z",
    keychainMdat: "20260829080000Z",
    fileGeneration: "gen-7",
    keychainGeneration: "gen-7",
    cliScopes: CLI_SCOPES.slice(),
    desktopScopes: CLI_SCOPES.slice(),
    storedScopes: CLI_SCOPES.slice(),
    persisted: true,
    sharedCliDesktop: true,
  });
}

/**
 * #90527 minted: a new Claude Code-credentials-<8hex> was written
 * instead of updating the live item.
 */
export function seedMinted() {
  return seedRack(90527, "anthropics/claude-code#90527", {
    session: "90527-minted",
    items: [
      { service: LIVE_SERVICE, hash: "", cdat: "20260726090000Z", mdat: "20260828090000Z", kind: "genp" },
      hashedItem("1eb0243d", { cdat: "20260829073221Z", mdat: "20260829073221Z" }),
      hashedItem("525493ee", { cdat: "20260829073221Z", mdat: "20260829073221Z" }),
    ],
    liveService: LIVE_SERVICE,
    fileMtime: "2026-08-29T07:32:21Z",
    keychainMdat: "20260829073221Z",
    fileGeneration: "gen-7",
    keychainGeneration: "gen-8",
    cliScopes: CLI_SCOPES.slice(),
    desktopScopes: CLI_SCOPES.slice(),
    storedScopes: CLI_SCOPES.slice(),
    minted: true,
    persisted: true,
    sharedCliDesktop: false,
  });
}

/** #84275 hoard: unbounded items, never GC'd, historical mcpOAuth. */
export function seedHoard() {
  const items = [];
  const days = [
    "20260416", "20260417", "20260418", "20260419", "20260420",
    "20260501", "20260502", "20260503", "20260527", "20260601",
    "20260615", "20260701", "20260715", "20260801", "20260805",
  ];
  for (let i = 0; i < 75; i += 1) {
    const hex = (0x8dfec700 + i).toString(16).padStart(8, "0");
    const day = days[i % days.length];
    items.push(hashedItem(hex, { cdat: `${day}110700Z`, mdat: `${day}110700Z` }));
  }
  return seedRack(84275, "anthropics/claude-code#84275", {
    session: "84275-hoard",
    items,
    liveService: "Claude Code-credentials-8dfec7ce",
    fileMtime: "2026-08-05T11:07:00Z",
    keychainMdat: "20260805110700Z",
    historicalMcpOAuthCopies: 1156,
    persisted: true,
  });
}

/** #78020 split: Keychain mdat advanced, file mtime did not. */
export function seedSplit() {
  return seedRack(78020, "anthropics/claude-code#78020", {
    session: "78020-split",
    items: [{ service: LIVE_SERVICE, hash: "", cdat: "20260713123656Z", mdat: "20260713123656Z", kind: "genp" }],
    liveService: LIVE_SERVICE,
    fileMtime: "2026-07-13T04:40:00Z",
    keychainMdat: "20260713123656Z",
    keychainCdat: "20260713123656Z",
    fileGeneration: "gen-4",
    keychainGeneration: "gen-5",
    loginExpired: true,
    revoked401: true,
    persisted: true,
  });
}

/** #89801 / #79407 false-cut: login reports success, never persisted. */
export function seedFalseCut() {
  return seedRack(89801, "anthropics/claude-code#89801", {
    session: "89801-false-cut",
    items: [],
    liveService: "",
    loginReportedSuccess: true,
    persisted: false,
    loginExpired: true,
  });
}

/** #90527 contributing: CLI vs desktop scope sets diverge. */
export function seedScopeKey() {
  return seedRack(90527, "anthropics/claude-code#90527", {
    session: "90527-scope-key",
    items: [
      hashedItem("1eb0243d", { cdat: "20260829070000Z", mdat: "20260829070000Z" }),
      hashedItem("4bfd337c", { cdat: "20260829070100Z", mdat: "20260829070100Z" }),
    ],
    liveService: "Claude Code-credentials-1eb0243d",
    fileMtime: "2026-08-29T07:00:00Z",
    keychainMdat: "20260829070000Z",
    cliScopes: CLI_SCOPES.slice(),
    desktopScopes: DESKTOP_SCOPES.slice(),
    storedScopes: CLI_SCOPES.slice(),
    sharedCliDesktop: false,
    persisted: true,
  });
}

/** Full #90527 minted used as the restore-to-minted ticket. */
export function seed90527() {
  return seedMinted();
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyRack();
  const masked = maskSecrets(text);
  if (masked.startsWith("{") || masked.startsWith("[")) {
    try {
      const parsed = JSON.parse(masked);
      if (Array.isArray(parsed)) {
        return cloneRack({
          items: parsed.map((row) => (typeof row === "string" ? { service: row } : row)),
          scored: true,
        });
      }
      if (parsed && typeof parsed === "object") {
        return cloneRack({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to dump / prose */
    }
  }
  const items = parseKeychainDump(masked);
  const loginExpired = /Login expired\s*·\s*Please run \/login|Please run \/login/i.test(masked);
  const revoked401 = /401|token (has been )?revoked|OAuth access token has been revoked/i.test(masked);
  const loginOk = /login (succeeded|success|reported success)|\/login succeeded/i.test(masked);
  const neverPersisted = /never persist|did not persist|skips file fallback|still logged out|Keychain timeout/i.test(masked);
  const minted = /new (hash-suffixed )?item|minted|per login|instead of (updating|reusing)|Claude Code-credentials-[0-9a-f]{8}/i.test(masked) &&
    /new|mint|per login|instead of/i.test(masked);
  const hoard = /75 items|110 (Keychain )?items|1,?156|never (cleaned|GC|garbage)/i.test(masked);
  const split = /split-brain|mdat advanced|mtime (did not|unchanged)|Keychain-only|file-only \/login/i.test(masked);
  const scopeKey = /user:mcp_servers|CLAUDE_CODE_OAUTH_SCOPES|CredentialKey|scope-key|scopes differ/i.test(masked);
  const hung = /one live|stores agree|CLI and desktop share|admit hung/i.test(masked);

  if (loginOk && neverPersisted) {
    return { ...seedFalseCut().rack, session: "paste-false-cut", source: "paste", scored: true };
  }
  if (items.length >= HOARD_THRESHOLD || (hoard && items.length !== 2 && items.length !== 3)) {
    const base = seedHoard().rack;
    return {
      ...base,
      items: items.length >= HOARD_THRESHOLD ? items : base.items,
      session: "paste-hoard",
      source: "anthropics/claude-code#84275",
      issue: 84275,
      scored: true,
      historicalMcpOAuthCopies: /1,?156/.test(masked) ? 1156 : base.historicalMcpOAuthCopies,
    };
  }
  if (minted || (items.some((row) => row.hash) && items.length > 1 && items.length < HOARD_THRESHOLD && !scopeKey && !split)) {
    const base = seedMinted().rack;
    return {
      ...base,
      items: items.length ? items : base.items,
      session: "paste-minted",
      source: "anthropics/claude-code#90527",
      issue: 90527,
      scored: true,
      minted: true,
    };
  }
  if (scopeKey && !minted) {
    return {
      ...seedScopeKey().rack,
      items: items.length ? items : seedScopeKey().rack.items,
      cliScopes: parseScopes(masked).includes("user:mcp_servers") ? CLI_SCOPES.slice() : seedScopeKey().rack.cliScopes,
      desktopScopes: /no user:mcp_servers|omits user:mcp_servers/i.test(masked)
        ? DESKTOP_SCOPES.slice()
        : seedScopeKey().rack.desktopScopes,
      session: "paste-scope-key",
      source: "anthropics/claude-code#90527",
      issue: 90527,
      scored: true,
    };
  }
  if (split || (loginExpired && revoked401)) {
    const fileMtime = parseFileMtime(masked);
    return {
      ...seedSplit().rack,
      items: items.length ? items : seedSplit().rack.items,
      fileMtime: fileMtime || seedSplit().rack.fileMtime,
      keychainMdat: items.find((row) => row.mdat)?.mdat || seedSplit().rack.keychainMdat,
      loginExpired,
      revoked401,
      session: "paste-split",
      source: "anthropics/claude-code#78020",
      issue: 78020,
      scored: true,
    };
  }
  if (hung && items.length <= 1) {
    return { ...seedControl().rack, session: "paste-hung", source: "paste", scored: true };
  }
  if (items.length === 1 && !loginExpired) {
    const only = items[0];
    return cloneRack({
      items,
      liveService: only.service,
      keychainMdat: only.mdat,
      fileMtime: parseFileMtime(masked),
      fileGeneration: parseGeneration(masked, "file") || "gen-1",
      keychainGeneration: parseGeneration(masked, "keychain") || "gen-1",
      persisted: true,
      sharedCliDesktop: true,
      session: "paste-hung",
      source: "paste",
      scored: true,
    });
  }
  if (items.length) {
    return cloneRack({
      items,
      liveService: items[0].service,
      scored: true,
      session: "paste",
      source: "paste",
    });
  }
  return { ...emptyRack(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  hung: seedHung,
  control: seedControl,
  minted: seedMinted,
  90527: seed90527,
  "90527-minted": seedMinted,
  hoard: seedHoard,
  84275: seedHoard,
  split: seedSplit,
  78020: seedSplit,
  "false-cut": seedFalseCut,
  falsecut: seedFalseCut,
  89801: seedFalseCut,
  79407: seedFalseCut,
  "scope-key": seedScopeKey,
  scopekey: seedScopeKey,
  healthy: seedControl,
  lobby: seedControl,
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
  let rack = cloneRack(action.rack);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "hung" || verb === "still" || verb === "rest" || verb === "reset") {
    return rackResult("hung", emptyRack(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "lobby") {
    rack = seedControl().rack;
    return rackResult(classify(rack), rack, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "minted" || verb === "incident") {
    rack = seedMinted().rack;
    return rackResult(classify(rack), rack, { ...action, action: verb === "restore" ? "restore" : verb });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    rack = { ...rack, scored: true };
    return rackResult(classify(rack), rack, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "rack") {
    rack = { ...rack, scored: true };
    return rackResult(classify(rack), rack, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "rack" ? "score" : verb,
    });
  }

  rack = { ...rack, scored: true };
  return rackResult(classify(rack), rack, action);
}
