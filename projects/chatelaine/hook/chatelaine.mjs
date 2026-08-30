/**
 * Chatelaine — Victorian / Edwardian
 * housekeeper's waist-chain for a
 * real Claude Code defect: HTTP MCP
 * OAuth grants (mcpOAuth) are stored
 * *inside the same macOS Keychain
 * item* as the Anthropic account
 * credential (claudeAiOauth). Logout
 * or account switch therefore
 * discards every HTTP MCP grant,
 * even when those grants have
 * nothing to do with which Anthropic
 * account is signed in and even when
 * their refresh tokens are still
 * valid.
 *
 * A nested ring is not a hold.
 * Score the chain or admit girt.
 *
 * Primary #90647: OPEN, filed
 * 2026-08-29. Title: Claude account
 * logout/switch discards all MCP
 * OAuth grants (mcpOAuth is stored
 * inside the account credential).
 *
 * Same-class nearby (scoreable,
 * not the primary):
 *   #88487 desktop update wipes
 *     claudeAiOauth from
 *     .credentials.json
 *   #87405 tokenless credential stub
 *     blocks Keychain refresh
 *   #84331 Keychain blob blanked
 *     (claudeAiOauth + mcpOAuth)
 *   #84274 MCP OAuth access token
 *     never persisted; reverts
 *     unauthenticated after restart
 *   #84614 stale DCR replayed forever
 *   #89671 valid token silently
 *     corrupted by status check
 *
 * Related, different (label, do
 * not treat as this bug):
 *   #90527 Fob — hash-suffixed
 *     Keychain litter. Fob = leftover
 *     keys multiplying on the rack.
 *     Chatelaine = keys nested
 *     *inside* the wearer's identity.
 *   #90497 Visa — MCP OAuth missing
 *     RFC 8707 resource indicator.
 *
 * Cross-ecosystem nearby, not
 * identical:
 *   openai/codex#27165 expired MCP
 *     bearer from Keychain, no refresh
 *   openai/codex#38198 failed MCP
 *     OAuth refresh permanently
 *     disables connector
 *   openai/codex#28201 Windows MCP
 *     OAuth keyring ignored on restart
 *
 * Verdicts: girt | nested | cut |
 *           switched | spilled |
 *           unexpired | rebound |
 *           tokenless | blanked |
 *           wiped
 * Idle word is girt (the chatelaine
 * is girt at the waist; MCP grants
 * live on their own ring,
 * independent of the Anthropic
 * identity).
 * NEVER use girt for a failure.
 * NEVER use sheltered / alongside /
 * seated / credited / level /
 * verbatim / fronted / locked /
 * yanked / caught / stowed / posted /
 * bunged / belayed / rove / keyed /
 * housed / beamed / snug / hung /
 * appointed / cinched / gauged /
 * stamped / overrun / pratique /
 * wound / bound / stilled / stabled /
 * drained / flat / fit / spoilt /
 * laid / unlinked / tight / banked /
 * roosted / stocked / heard / clear /
 * paired / kernel / latched / upheld /
 * sterling / home / valid / dry /
 * quiet / seised / rung / moored /
 * claimed / worn / nested / cut /
 * switched / spilled as the idle
 * word.
 *
 * Slack chip + Linear ticket on
 * cut / spilled / switched / nested /
 * rebound / unexpired / tokenless /
 * blanked / wiped. GitHub
 * chatelaine-ledger of scored
 * intakes on every score.
 *
 * Priority when multiple match:
 *   unique nearby without the
 *   #90647 triad
 *     (tokenless > blanked > wiped)
 *   > cut (triad: nested store +
 *     identity event + still-valid
 *     grants discarded)
 *   > spilled
 *   > switched
 *   > rebound
 *   > unexpired
 *   > nested
 *   > girt
 *
 * Unique nearby flags win their
 * own seeds because those seeds do
 * not carry the #90647 triad
 * (nested store + identity event +
 * still-valid grants discarded).
 *
 * girt is true ONLY when the
 * verdict is girt (idle, or honest
 * control: mcpOAuth in its own
 * store, logout leaves MCP grants,
 * grants remain usable). Seeded
 * 90647 numbers must produce cut
 * / girt=false. A nested ring is
 * never girt.
 *
 * Why this is not a clone:
 * NOT Fob — hotel key-rack for
 *     *litter*: login mints another
 *     Claude Code-credentials-<8hex>
 *     instead of updating the live
 *     item. #90527 / #84275.
 *     Opposite direction.
 * NOT Visa — MCP OAuth missing
 *     RFC 8707 resource. #90497.
 * NOT Chute — sanctioned secret
 *     handoff / AskUserSecret.
 * NOT Snib — Trusted Devices
 *     fail-open.
 * NOT Reed — MCP registry
 *     connected-vs-registered.
 * NOT Sprag — boot-cached MCP
 *     failure.
 * NOT leftover woodworking /
 *     millimetre-slider clones.
 * Different problem: identity
 * logout burns still-valid MCP
 * grants because storage is nested.
 * Different UI: housekeeper's
 * chatelaine / waist-chain / brass
 * keys / jet beads / linen apron /
 * oxidized brass plate.
 * Different idle: girt.
 */

export const VERDICTS = Object.freeze([
  "girt",
  "nested",
  "cut",
  "switched",
  "spilled",
  "unexpired",
  "rebound",
  "tokenless",
  "blanked",
  "wiped",
]);
export const IDLE_WORD = "girt";
export const SLACK_VERDICTS = Object.freeze([
  "cut",
  "spilled",
  "switched",
  "nested",
  "rebound",
  "unexpired",
  "tokenless",
  "blanked",
  "wiped",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90647;
export const NEARBY_88487 = 88487;
export const NEARBY_87405 = 87405;
export const NEARBY_84331 = 84331;
export const NEARBY_84274 = 84274;
export const NEARBY_84614 = 84614;
export const NEARBY_89671 = 89671;
export const RELATED_FOB = 90527;
export const RELATED_FOB_MINT = 84275;
export const RELATED_VISA = 90497;
export const CODEX_EXPIRED_BEARER = 27165;
export const CODEX_REFRESH_DISABLE = 38198;
export const CODEX_WIN_KEYRING = 28201;

export const DEMO_HTTP_SERVERS = 7;
export const DEMO_CLOUDFLARE = 6;
export const DEMO_MCP_AUTHS = 7;
export const DEMO_FIGMA_REMAINING_H = 2160;
export const DEMO_CF_TTL_H = 1;
export const DEMO_DAY = "2026-08-30";
export const DEMO_VERSION = "chatelaine-chain";
export const DEMO_LIVE_SERVICE = "Claude Code-credentials";
export const DEMO_PER_ACCOUNT_SERVICE = "Claude Code-credentials-aabbccdd";
export const DEMO_SEPARATE_SERVICE = "Claude Code-mcpOAuth";
export const DEMO_FILE_STORE = "~/.claude/.credentials.json";
export const REBOUND_MARK = 2;

const FORBIDDEN_IDLE = Object.freeze([
  "chatelaine",
  "empty",
  "silent",
  "mute",
  "idle",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
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
  "quiet",
  "seised",
  "rung",
  "moored",
  "claimed",
  "worn",
  "nested",
  "cut",
  "switched",
  "spilled",
  "fob",
  "visa",
  "chute",
  "snib",
  "reed",
  "sprag",
  "livery",
  "tabard",
  "scrip",
  "baldric",
  "purse",
  "sporran",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNum(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

export function maskSecret(value) {
  if (value == null || value === "") return "";
  return "••••";
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    mcpNestedInAccountItem: null,
    accountLogoutFired: null,
    accountSwitched: null,
    perAccountItemsLackMcpOAuth: null,
    httpMcpServerCount: 0,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: null,
    refreshTokensPresent: null,
    consecutiveMcpAuths: 0,
    tokenlessStub: false,
    blankedBlob: false,
    desktopWipe: false,
    separateMcpStore: null,
    fobLitter: false,
    hashSuffixedLitter: false,
    nearby: "",
    figmaRemainingH: 0,
    cloudflareTtlH: 0,
    liveService: "",
    perAccountService: "",
    fileStore: "",
    keychainItems: [],
    scored: false,
  };
}

function nestObject(src) {
  if (src.chatelaine && typeof src.chatelaine === "object") return src.chatelaine;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.intake && typeof src.intake === "object") return src.intake;
  if (src.chain && typeof src.chain === "object") return src.chain;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  const items = Array.isArray(nested.keychainItems)
    ? nested.keychainItems
    : Array.isArray(src.keychainItems)
      ? src.keychainItems
      : [];
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    mcpNestedInAccountItem: asNullableBool(
      nested.mcpNestedInAccountItem ?? src.mcpNestedInAccountItem,
    ),
    accountLogoutFired: asNullableBool(
      nested.accountLogoutFired ?? src.accountLogoutFired,
    ),
    accountSwitched: asNullableBool(nested.accountSwitched ?? src.accountSwitched),
    perAccountItemsLackMcpOAuth: asNullableBool(
      nested.perAccountItemsLackMcpOAuth ?? src.perAccountItemsLackMcpOAuth,
    ),
    httpMcpServerCount: asNum(
      nested.httpMcpServerCount ?? src.httpMcpServerCount,
      0,
    ),
    unauthenticatedAfterEvent: asNum(
      nested.unauthenticatedAfterEvent ?? src.unauthenticatedAfterEvent,
      0,
    ),
    grantsUnexpired: asNullableBool(nested.grantsUnexpired ?? src.grantsUnexpired),
    refreshTokensPresent: asNullableBool(
      nested.refreshTokensPresent ?? src.refreshTokensPresent,
    ),
    consecutiveMcpAuths: asNum(
      nested.consecutiveMcpAuths ?? src.consecutiveMcpAuths,
      0,
    ),
    tokenlessStub: asBool(nested.tokenlessStub ?? src.tokenlessStub, false),
    blankedBlob: asBool(nested.blankedBlob ?? src.blankedBlob, false),
    desktopWipe: asBool(nested.desktopWipe ?? src.desktopWipe, false),
    separateMcpStore: asNullableBool(nested.separateMcpStore ?? src.separateMcpStore),
    fobLitter: asBool(nested.fobLitter ?? src.fobLitter, false),
    hashSuffixedLitter: asBool(
      nested.hashSuffixedLitter ?? src.hashSuffixedLitter,
      false,
    ),
    nearby: asText(nested.nearby || src.nearby || ""),
    figmaRemainingH: asNum(nested.figmaRemainingH ?? src.figmaRemainingH, 0),
    cloudflareTtlH: asNum(nested.cloudflareTtlH ?? src.cloudflareTtlH, 0),
    liveService: asText(nested.liveService || src.liveService || ""),
    perAccountService: asText(nested.perAccountService || src.perAccountService || ""),
    fileStore: asText(nested.fileStore || src.fileStore || ""),
    keychainItems: items.map(maskKeychainItem),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function maskKeychainItem(item = {}) {
  const row = item && typeof item === "object" ? item : {};
  const keys = Array.isArray(row.keys) ? row.keys.map((k) => asText(k)) : [];
  const servers = Array.isArray(row.mcpServers)
    ? row.mcpServers.map((s) => asText(s))
    : [];
  return {
    service: asText(row.service),
    keys,
    mcpServers: servers,
    mcpOAuth: row.mcpOAuth == null ? null : Boolean(row.mcpOAuth),
    accessToken: maskSecret(row.accessToken),
    refreshToken: maskSecret(row.refreshToken),
  };
}

export function isFobLitter(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  if (nearby === "fob" || nearby === "90527" || nearby === "84275") return true;
  return Boolean(row.fobLitter || row.hashSuffixedLitter);
}

export function isOffChain(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "visa" ||
    nearby === "90497" ||
    nearby === "chute" ||
    nearby === "snib" ||
    nearby === "reed" ||
    nearby === "sprag"
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.mcpNestedInAccountItem != null ||
    probe.accountLogoutFired != null ||
    probe.accountSwitched != null ||
    probe.perAccountItemsLackMcpOAuth != null ||
    probe.httpMcpServerCount ||
    probe.unauthenticatedAfterEvent ||
    probe.grantsUnexpired != null ||
    probe.refreshTokensPresent != null ||
    probe.consecutiveMcpAuths ||
    probe.tokenlessStub ||
    probe.blankedBlob ||
    probe.desktopWipe ||
    probe.separateMcpStore != null ||
    isFobLitter(probe) ||
    isOffChain(probe) ||
    probe.figmaRemainingH ||
    probe.cloudflareTtlH ||
    probe.liveService ||
    probe.perAccountService ||
    probe.keychainItems.length
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const nested = row.mcpNestedInAccountItem === true;
  const logout = row.accountLogoutFired === true;
  const switched = row.accountSwitched === true;
  const identityEvent = logout || switched;
  const grantsUsable =
    row.grantsUnexpired === true || row.refreshTokensPresent === true;
  const lossSignal =
    row.unauthenticatedAfterEvent > 0 || row.consecutiveMcpAuths > 0;
  const stillValidDiscarded = Boolean(identityEvent && grantsUsable && (lossSignal || logout));
  const triad = Boolean(
    nested && identityEvent && stillValidDiscarded && row.separateMcpStore !== true,
  );
  const allSpilled = Boolean(
    identityEvent &&
      row.httpMcpServerCount > 0 &&
      row.unauthenticatedAfterEvent >= row.httpMcpServerCount,
  );
  const fobLitter = isFobLitter(row) && !nested && !logout;
  const separateHold = Boolean(
    row.separateMcpStore === true &&
      !nested &&
      grantsUsable &&
      row.unauthenticatedAfterEvent === 0,
  );
  const rebound = row.consecutiveMcpAuths >= REBOUND_MARK;
  const forcedReauth = row.consecutiveMcpAuths >= 1 || row.unauthenticatedAfterEvent > 0;

  let eventClass = "idle";
  if (row.tokenlessStub && !triad) eventClass = "tokenless";
  else if (row.blankedBlob && !triad) eventClass = "blanked";
  else if (row.desktopWipe && !triad) eventClass = "wiped";
  else if (triad) eventClass = "cut";
  else if (allSpilled) eventClass = "spilled";
  else if (switched && row.perAccountItemsLackMcpOAuth === true) eventClass = "switched";
  else if (rebound) eventClass = "rebound";
  else if (grantsUsable && forcedReauth) eventClass = "unexpired";
  else if (nested && !logout) eventClass = "nested";
  else if (separateHold || fobLitter) eventClass = "girt";
  else eventClass = "idle";

  return {
    nested,
    logout,
    switched,
    identityEvent,
    grantsUsable,
    stillValidDiscarded,
    triad,
    allSpilled,
    fobLitter,
    separateHold,
    rebound,
    forcedReauth,
    offChain: isOffChain(row),
    tokenless: row.tokenlessStub === true,
    blanked: row.blankedBlob === true,
    wiped: row.desktopWipe === true,
    eventClass,
    httpMcpServerCount: row.httpMcpServerCount,
    unauthenticatedAfterEvent: row.unauthenticatedAfterEvent,
    consecutiveMcpAuths: row.consecutiveMcpAuths,
    figmaRemainingH: row.figmaRemainingH,
    cloudflareTtlH: row.cloudflareTtlH,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "girt";
  const facts = analyze(row);
  if (!facts.triad) {
    if (facts.tokenless) return "tokenless";
    if (facts.blanked) return "blanked";
    if (facts.wiped) return "wiped";
  }
  if (facts.triad) return "cut";
  if (facts.allSpilled) return "spilled";
  if (facts.switched && row.perAccountItemsLackMcpOAuth === true) return "switched";
  if (facts.rebound) return "rebound";
  if (facts.grantsUsable && facts.forcedReauth) return "unexpired";
  if (facts.nested && !facts.logout) return "nested";
  return "girt";
}

export function feedOf(kind) {
  if (kind === "cut") {
    return "● Cut · logout discarded still-valid MCP grants nested inside the Anthropic credential · primary #90647";
  }
  if (kind === "nested") {
    return "● Nested · mcpOAuth lives inside the same Keychain item as claudeAiOauth · the #90647 layout, before logout";
  }
  if (kind === "switched") {
    return "● Switched · per-account Claude Code-credentials-<8hex> items have no mcpOAuth · a switch cannot reuse a valid grant";
  }
  if (kind === "spilled") {
    return "● Spilled · every configured HTTP MCP server came back unauthenticated after the identity event";
  }
  if (kind === "unexpired") {
    return "● Unexpired · measured access/refresh tokens were still valid at the moment of forced re-auth";
  }
  if (kind === "rebound") {
    return "● Rebound · operator had to run consecutive /mcp browser auths in one session";
  }
  if (kind === "tokenless") {
    return "● Tokenless · nearby #87405 · a tokenless credential stub blocks Keychain refresh";
  }
  if (kind === "blanked") {
    return "● Blanked · nearby #84331 · Keychain blob has accessToken/refreshToken blanked";
  }
  if (kind === "wiped") {
    return "● Wiped · nearby #88487 · desktop update wipes claudeAiOauth from .credentials.json";
  }
  return "● Girt · mcpOAuth lives on its own ring, independent of the Anthropic identity · hold is quiet · idle word is girt";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "cut" || facts.triad) {
    reasons.push(
      `#90647 nested store + identity event + still-valid grants discarded`,
    );
  }
  if (facts.nested) {
    reasons.push("mcpOAuth nested inside Claude Code-credentials with claudeAiOauth");
  }
  if (facts.logout) reasons.push("Anthropic account logout fired");
  if (facts.switched) reasons.push("Claude account switch fired");
  if (row.perAccountItemsLackMcpOAuth) {
    reasons.push("per-account Claude Code-credentials-<8hex> items hold claudeAiOauth only");
  }
  if (facts.grantsUsable) {
    reasons.push("refresh present or access still unexpired at the moment of forced re-auth");
  }
  if (facts.allSpilled || kind === "spilled") {
    reasons.push(
      `${facts.httpMcpServerCount} HTTP MCP server(s) all unauthenticated after the identity event`,
    );
  }
  if (facts.consecutiveMcpAuths) {
    reasons.push(`/mcp ×${facts.consecutiveMcpAuths} consecutive browser auths`);
  }
  if (facts.figmaRemainingH) {
    reasons.push(`Figma access ~${facts.figmaRemainingH}h remaining`);
  }
  if (facts.cloudflareTtlH) {
    reasons.push(`Cloudflare access TTL ~${facts.cloudflareTtlH}h with refresh present`);
  }
  if (facts.tokenless || kind === "tokenless") {
    reasons.push("nearby #87405 tokenless credential stub blocks Keychain refresh");
  }
  if (facts.blanked || kind === "blanked") {
    reasons.push("nearby #84331 Keychain blob blanked (claudeAiOauth + mcpOAuth)");
  }
  if (facts.wiped || kind === "wiped") {
    reasons.push("nearby #88487 desktop update wiped claudeAiOauth from .credentials.json");
  }
  if (facts.fobLitter) {
    reasons.push(
      "Fob-shaped litter: hash-suffixed extra items without nesting/logout burn — NOT this desk (#90527)",
    );
  }
  if (facts.offChain) {
    reasons.push("off-chain nearby: Visa / Chute / Snib / Reed / Sprag — labeled, not this chain");
  }
  if (kind === "girt") {
    reasons.push("separate mcpOAuth store; logout leaves MCP grants; idle word is girt");
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "cut") {
    return `Chatelaine cut · MCP grants left with the wearer · /mcp ×${facts.consecutiveMcpAuths || DEMO_MCP_AUTHS}`;
  }
  if (kind === "spilled") {
    return `Chatelaine spilled · ${facts.httpMcpServerCount || DEMO_HTTP_SERVERS} HTTP MCP servers all need /mcp again`;
  }
  if (kind === "switched") {
    return "Chatelaine switched · per-account items have no mcpOAuth · grant cannot follow the wearer";
  }
  if (kind === "nested") {
    return "Chatelaine nested · mcpOAuth lives inside the Anthropic credential";
  }
  if (kind === "rebound") {
    return `Chatelaine rebound · consecutive /mcp browser auths ×${facts.consecutiveMcpAuths || DEMO_MCP_AUTHS}`;
  }
  if (kind === "unexpired") {
    return "Chatelaine unexpired · grants were still valid when /mcp was forced";
  }
  if (kind === "tokenless") {
    return "Chatelaine tokenless · stub blocks Keychain refresh · MCP silent";
  }
  if (kind === "blanked") {
    return "Chatelaine blanked · Keychain blob wiped access/refresh";
  }
  if (kind === "wiped") {
    return "Chatelaine wiped · desktop update took claudeAiOauth — and nested MCP with it";
  }
  return "";
}

function chainResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const alarm = SLACK_VERDICTS.includes(kind);
  return {
    product: "chatelaine",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    girt: kind === "girt",
    nested: kind === "nested",
    cut: kind === "cut",
    switched: kind === "switched",
    spilled: kind === "spilled",
    unexpired: kind === "unexpired",
    rebound: kind === "rebound",
    tokenless: kind === "tokenless",
    blanked: kind === "blanked",
    wiped: kind === "wiped",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "girt",
    fobLitter: facts.fobLitter,
    slackCopy: slackCopy(kind, facts),
    facts: {
      mcpNestedInAccountItem: facts.nested,
      accountLogoutFired: facts.logout,
      accountSwitched: facts.switched,
      perAccountItemsLackMcpOAuth: probe.perAccountItemsLackMcpOAuth,
      httpMcpServerCount: facts.httpMcpServerCount,
      unauthenticatedAfterEvent: facts.unauthenticatedAfterEvent,
      grantsUnexpired: probe.grantsUnexpired,
      refreshTokensPresent: probe.refreshTokensPresent,
      consecutiveMcpAuths: facts.consecutiveMcpAuths,
      tokenlessStub: facts.tokenless,
      blankedBlob: facts.blanked,
      desktopWipe: facts.wiped,
      separateMcpStore: probe.separateMcpStore,
      triad: facts.triad,
      fobLitter: facts.fobLitter,
    },
    keychain: probe.keychainItems,
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  return chainResult(kind, row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function girtOf(probe = {}) {
  return classify(probe) === "girt";
}

export function flagsOf(probe = {}) {
  return analyze(probe);
}

export function reasonsList(probe = {}) {
  return reasonsOf(probe, classify(probe));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    chatelaine: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

function nestedDump() {
  return [
    {
      service: DEMO_LIVE_SERVICE,
      keys: ["claudeAiOauth", "mcpOAuth"],
      mcpServers: [
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "figma",
      ],
      mcpOAuth: true,
      accessToken: "redacted-access",
      refreshToken: "redacted-refresh",
    },
    {
      service: DEMO_PER_ACCOUNT_SERVICE,
      keys: ["claudeAiOauth"],
      mcpServers: [],
      mcpOAuth: null,
      accessToken: "redacted-access",
      refreshToken: "",
    },
  ];
}

function separateDump() {
  return [
    {
      service: DEMO_LIVE_SERVICE,
      keys: ["claudeAiOauth"],
      mcpServers: [],
      mcpOAuth: null,
      accessToken: "redacted-access",
      refreshToken: "redacted-refresh",
    },
    {
      service: DEMO_SEPARATE_SERVICE,
      keys: ["mcpOAuth"],
      mcpServers: [
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "cloudflare",
        "figma",
      ],
      mcpOAuth: true,
      accessToken: "redacted-access",
      refreshToken: "redacted-refresh",
    },
  ];
}

export function seedGirt() {
  return baseSeed("girt-hold", FEATURED_ISSUE, {
    source: "honest separate mcpOAuth store; logout leaves MCP grants",
    mcpNestedInAccountItem: false,
    accountLogoutFired: true,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: false,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 0,
    separateMcpStore: true,
    liveService: DEMO_LIVE_SERVICE,
    fileStore: DEMO_FILE_STORE,
    keychainItems: separateDump(),
    figmaRemainingH: DEMO_FIGMA_REMAINING_H,
    cloudflareTtlH: DEMO_CF_TTL_H,
  });
}

export function seedControl() {
  return seedGirt();
}

export function seedReset() {
  return { action: "bail", chatelaine: emptyProbe() };
}

export function seedCut() {
  return baseSeed("90647-cut", FEATURED_ISSUE, {
    source: "primary #90647 nested mcpOAuth discarded on logout",
    mcpNestedInAccountItem: true,
    accountLogoutFired: true,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: true,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: DEMO_HTTP_SERVERS,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: DEMO_MCP_AUTHS,
    separateMcpStore: false,
    liveService: DEMO_LIVE_SERVICE,
    perAccountService: DEMO_PER_ACCOUNT_SERVICE,
    fileStore: DEMO_FILE_STORE,
    keychainItems: nestedDump(),
    figmaRemainingH: DEMO_FIGMA_REMAINING_H,
    cloudflareTtlH: DEMO_CF_TTL_H,
  });
}

export function seed90647() {
  return seedCut();
}

export function seedNested() {
  return baseSeed("90647-nested", FEATURED_ISSUE, {
    source: "pre-logout #90647 layout: mcpOAuth inside the account item",
    mcpNestedInAccountItem: true,
    accountLogoutFired: false,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: true,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 0,
    separateMcpStore: false,
    liveService: DEMO_LIVE_SERVICE,
    perAccountService: DEMO_PER_ACCOUNT_SERVICE,
    fileStore: DEMO_FILE_STORE,
    keychainItems: nestedDump(),
  });
}

export function seedSwitched() {
  return baseSeed("90647-switched", FEATURED_ISSUE, {
    source: "per-account items lack mcpOAuth so a switch cannot reuse a grant",
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    accountSwitched: true,
    perAccountItemsLackMcpOAuth: true,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 0,
    separateMcpStore: false,
    liveService: DEMO_LIVE_SERVICE,
    perAccountService: DEMO_PER_ACCOUNT_SERVICE,
    fileStore: DEMO_FILE_STORE,
    keychainItems: [
      {
        service: DEMO_PER_ACCOUNT_SERVICE,
        keys: ["claudeAiOauth"],
        mcpServers: [],
        mcpOAuth: null,
        accessToken: "redacted-access",
        refreshToken: "redacted-refresh",
      },
    ],
  });
}

export function seedSpilled() {
  return baseSeed("90647-spilled", FEATURED_ISSUE, {
    source: "every HTTP MCP server unauthenticated after the identity event",
    mcpNestedInAccountItem: false,
    accountLogoutFired: true,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: false,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: DEMO_HTTP_SERVERS,
    grantsUnexpired: false,
    refreshTokensPresent: false,
    consecutiveMcpAuths: 0,
    separateMcpStore: false,
    liveService: DEMO_LIVE_SERVICE,
    fileStore: DEMO_FILE_STORE,
  });
}

export function seedUnexpired() {
  return baseSeed("90647-unexpired", FEATURED_ISSUE, {
    source: "Figma ~90d remaining and Cloudflare refresh present at forced re-auth",
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: false,
    httpMcpServerCount: 2,
    unauthenticatedAfterEvent: 2,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 1,
    separateMcpStore: false,
    figmaRemainingH: DEMO_FIGMA_REMAINING_H,
    cloudflareTtlH: DEMO_CF_TTL_H,
  });
}

export function seedRebound() {
  return baseSeed("90647-rebound", FEATURED_ISSUE, {
    source: "seven consecutive /mcp browser auths in one session",
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: false,
    httpMcpServerCount: DEMO_HTTP_SERVERS,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: false,
    refreshTokensPresent: false,
    consecutiveMcpAuths: DEMO_MCP_AUTHS,
    separateMcpStore: false,
  });
}

export function seedTokenless() {
  return baseSeed("87405-tokenless", NEARBY_87405, {
    source: "nearby #87405 tokenless credential stub blocks Keychain refresh",
    tokenlessStub: true,
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    separateMcpStore: false,
  });
}

export function seedBlanked() {
  return baseSeed("84331-blanked", NEARBY_84331, {
    source: "nearby #84331 Keychain blob blanked (claudeAiOauth + mcpOAuth)",
    blankedBlob: true,
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    separateMcpStore: false,
    liveService: DEMO_LIVE_SERVICE,
    keychainItems: [
      {
        service: DEMO_LIVE_SERVICE,
        keys: ["claudeAiOauth", "mcpOAuth"],
        mcpServers: ["cloudflare", "figma"],
        mcpOAuth: true,
        accessToken: "",
        refreshToken: "",
      },
    ],
  });
}

export function seedWiped() {
  return baseSeed("88487-wiped", NEARBY_88487, {
    source: "nearby #88487 desktop update wipes claudeAiOauth from .credentials.json",
    desktopWipe: true,
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    separateMcpStore: false,
    fileStore: DEMO_FILE_STORE,
  });
}

export function seedFobLitter() {
  return baseSeed("fob-litter", RELATED_FOB, {
    source: "NOT this: Fob hash-suffixed Keychain litter without nesting/logout burn",
    nearby: "fob",
    fobLitter: true,
    hashSuffixedLitter: true,
    mcpNestedInAccountItem: false,
    accountLogoutFired: false,
    accountSwitched: false,
    perAccountItemsLackMcpOAuth: false,
    httpMcpServerCount: 0,
    unauthenticatedAfterEvent: 0,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 0,
    separateMcpStore: true,
    liveService: DEMO_LIVE_SERVICE,
    perAccountService: "Claude Code-credentials-1eb0243d",
    fileStore: DEMO_FILE_STORE,
    keychainItems: [
      {
        service: DEMO_LIVE_SERVICE,
        keys: ["claudeAiOauth"],
        mcpServers: [],
        mcpOAuth: null,
        accessToken: "redacted-access",
        refreshToken: "redacted-refresh",
      },
      {
        service: "Claude Code-credentials-1eb0243d",
        keys: ["claudeAiOauth"],
        mcpServers: [],
        mcpOAuth: null,
        accessToken: "redacted-access",
        refreshToken: "redacted-refresh",
      },
    ],
  });
}

const SEEDS = {
  girt: seedGirt,
  control: seedGirt,
  healthy: seedGirt,
  hold: seedGirt,
  cut: seedCut,
  90647: seedCut,
  "90647": seedCut,
  nested: seedNested,
  switched: seedSwitched,
  spilled: seedSpilled,
  unexpired: seedUnexpired,
  rebound: seedRebound,
  tokenless: seedTokenless,
  87405: seedTokenless,
  "87405": seedTokenless,
  blanked: seedBlanked,
  84331: seedBlanked,
  "84331": seedBlanked,
  wiped: seedWiped,
  88487: seedWiped,
  "88487": seedWiped,
  fob: seedFobLitter,
  litter: seedFobLitter,
  90527: seedFobLitter,
  "90527": seedFobLitter,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, chatelaine: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const chatelaine = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || chatelaine.session),
    issue: asIssue(src.issue ?? chatelaine.issue),
    source: asText(src.source || chatelaine.source),
    chatelaine,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.chatelaine);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "girt" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return chainResult("girt", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedGirt().chatelaine;
    return chainResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "cut" || verb === "incident" || verb === "90647") {
    probe = seedCut().chatelaine;
    return chainResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-chatelaine") {
    probe = { ...probe, scored: true };
    return chainResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return chainResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return chainResult(classify(probe), probe, action);
}

export function parseChatelaineJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.chatelaine ||
      raw.probe ||
      raw.intake ||
      raw.chain ||
      raw.mcpNestedInAccountItem != null ||
      raw.accountLogoutFired != null ||
      raw.separateMcpStore != null ||
      raw.consecutiveMcpAuths != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parseChatelaineJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, chatelaine: emptyProbe() };
}
