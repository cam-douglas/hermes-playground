/**
 * Binnacle — ship's brass compass house / night chart table
 * for a real Claude Code failure class: the interactive TUI
 * still probes magnetic north (api.anthropic.com) after a
 * gyro heading (ANTHROPIC_BASE_URL) is already named. In a
 * deny-by-default sandbox the only legal route is the named
 * gateway. claude -p on the same config works. Interactive
 * TUI refuses to start unless it can reach api.anthropic.com
 * directly (GET /api/oauth/profile, GET /api/hello,
 * POST /api/event_logging/v2/batch). /api/hello is sent to
 * both; the other two are not. Same check is advisory in -p
 * and fatal in TUI. With a proxy env set, the error names
 * the proxy, never the configured base URL.
 *
 * Primary #90551: open, has repro, filed 2026-08-29,
 * area:tui/networking, Claude Code 2.1.251.
 *
 * Same-class / nearby (cite, not new primaries):
 *   #89211 — custom BASE_URL still assumed Anthropic-native
 *   #88345 — settings env ignored; desktop injects origin
 *            with path stripped
 *   #89972 — gateway /v1/models silently replaces Workflow
 *            agent() model ids
 *   #89973 — feedback UX still offers send while channel
 *            is client-disabled
 *   #88536 — custom-BASE_URL empty text blocks persisted
 *            then 400 on first-party replay
 *
 * Cross-ecosystem (nearby origin-split / unnamed custom
 * base, not a new primary):
 *   openai/codex#36597 — custom openai_base_url intercepts
 *            native traffic (inverse polarity)
 *   openai/codex#40435 — connection-refused does not name
 *            unreachable custom base URL
 *
 * Verdicts: housed | swung | refused | printed | split
 *           | fatal | demanded | blind | boxed | stripped
 * Idle word is housed (named gyro heading; TUI starts via
 * that origin; no magnetic knock required for startup).
 * NEVER use binnacle / empty / silent / magnetic / gyro /
 * origin as idle. NEVER reuse beamed, snug, hung, appointed,
 * cinched, gauged, stamped, overrun, pratique, wound, bound,
 * stilled, stabled, drained, flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard,
 * clear, paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised, rung.
 *
 * Slack alarm on swung / refused / fatal / split / blind /
 * boxed / demanded / stripped.
 * Linear ticket on refused / swung.
 * GitHub binnacle-ledger of scored headings on every score.
 *
 * Priority when multiple match:
 *   refused > swung > fatal > split > blind > boxed
 *   > demanded > stripped > printed > housed
 *
 * Why this is not a clone:
 * NOT Visa — MCP OAuth missing resource.
 * NOT Husk — hollow headless SUCCESS (inverse: here
 *     headless works, interactive dies).
 * NOT Sprag / Reed — MCP lifecycle.
 * NOT Gasket — sandbox allowlist discard (sandbox is the
 *     scene; the defect is the check consulting a host it
 *     was configured not to use).
 * NOT Tain — Chrome pairing.
 * NOT Tocsin / Reveille / Leat / Fusee — wake / schedule /
 *     sleep poles.
 * NOT leftover woodworking / millimetre-slider.
 * Do NOT ship alternate names Tocsin, Larum, Clapper, Gland,
 * Pigeonhole, Compass, Gyro, Magnet. Product name is
 * Binnacle only.
 * Different problem: NAMED GYRO HEADING → TUI STILL KNOCKS
 * MAGNETIC NORTH → FATAL IN INTERACTIVE, ADVISORY IN -p →
 * ERROR NAMES THE PROXY, NEVER THE BASE URL.
 * Different UI: ship's brass binnacle / night chart table.
 * Two compass cards under a lamp: MAG vs GYRO. The lamp
 * should burn over GYRO; it still burns over MAG.
 * Different idle: housed.
 */

export const VERDICTS = Object.freeze([
  "housed",
  "swung",
  "refused",
  "printed",
  "split",
  "fatal",
  "demanded",
  "blind",
  "boxed",
  "stripped",
]);
export const IDLE_WORD = "housed";
export const SLACK_VERDICTS = Object.freeze([
  "swung",
  "refused",
  "fatal",
  "split",
  "blind",
  "boxed",
  "demanded",
  "stripped",
]);
export const LINEAR_VERDICTS = Object.freeze(["refused", "swung"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const PUBLIC_ORIGIN = "api.anthropic.com";
export const FEATURED_ISSUE = 90551;
export const DEMO_BASE_URL = "https://gateway.example/anthropic";

const FORBIDDEN_IDLE = Object.freeze([
  "binnacle",
  "empty",
  "silent",
  "magnetic",
  "gyro",
  "origin",
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
  "rung",
  "visa",
  "husk",
  "sprag",
  "reed",
  "gasket",
  "tain",
  "tocsin",
  "reveille",
  "leat",
  "fusee",
  "pirn",
  "cotter",
  "fob",
  "ordo",
  "cinch",
  "ullage",
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

export function namedBaseUrl(value) {
  const text = asText(value).trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text) || /base_url|gateway|proxy|anthropic/i.test(text)) {
    return text;
  }
  return text;
}

export function emptyBinnacle() {
  return {
    session: "",
    issue: null,
    source: "",
    baseUrl: "",
    publicOriginReachable: false,
    namedGatewayServesMessages: false,
    interactiveTuiStarts: false,
    headlessPrintWorks: false,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
    scored: false,
  };
}

export function emptyAction(session = "housed-1") {
  return {
    action: "score",
    session,
    binnacle: emptyBinnacle(),
  };
}

export function cloneBinnacle(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyBinnacle();
  const nested =
    (src.binnacle && typeof src.binnacle === "object" && src.binnacle) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.heading && typeof src.heading === "object" && src.heading) ||
    src;
  return {
    ...emptyBinnacle(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    baseUrl: namedBaseUrl(nested.baseUrl ?? nested.ANTHROPIC_BASE_URL ?? src.baseUrl),
    publicOriginReachable:
      asBool(nested.publicOriginReachable ?? src.publicOriginReachable, false) === true,
    namedGatewayServesMessages:
      asBool(nested.namedGatewayServesMessages ?? src.namedGatewayServesMessages, false) === true,
    interactiveTuiStarts:
      asBool(nested.interactiveTuiStarts ?? src.interactiveTuiStarts, false) === true,
    headlessPrintWorks:
      asBool(nested.headlessPrintWorks ?? src.headlessPrintWorks, false) === true,
    helloToBaseUrl: asBool(nested.helloToBaseUrl ?? src.helloToBaseUrl, false) === true,
    helloToPublic: asBool(nested.helloToPublic ?? src.helloToPublic, false) === true,
    oauthProfileToPublic:
      asBool(nested.oauthProfileToPublic ?? src.oauthProfileToPublic, false) === true,
    eventLoggingToPublic:
      asBool(nested.eventLoggingToPublic ?? src.eventLoggingToPublic, false) === true,
    checkFatalInTui: asBool(nested.checkFatalInTui ?? src.checkFatalInTui, false) === true,
    checkAdvisoryInPrint:
      asBool(nested.checkAdvisoryInPrint ?? src.checkAdvisoryInPrint, false) === true,
    errorNamesProxy: asBool(nested.errorNamesProxy ?? src.errorNamesProxy, false) === true,
    errorNamesBaseUrl: asBool(nested.errorNamesBaseUrl ?? src.errorNamesBaseUrl, false) === true,
    pathStripped: asBool(nested.pathStripped ?? src.pathStripped, false) === true,
    denyByDefaultSandbox:
      asBool(nested.denyByDefaultSandbox ?? src.denyByDefaultSandbox, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(binnacle = {}) {
  const next = cloneBinnacle(binnacle);
  const named = Boolean(next.baseUrl);
  const probesPublic =
    next.oauthProfileToPublic === true ||
    next.eventLoggingToPublic === true ||
    next.helloToPublic === true;
  const refusedShape = named && next.interactiveTuiStarts !== true;
  const swungShape = named && probesPublic && next.helloToBaseUrl !== true;
  const fatalShape = next.checkFatalInTui === true && next.checkAdvisoryInPrint === true;
  const splitShape =
    next.helloToBaseUrl === true &&
    (next.oauthProfileToPublic === true || next.eventLoggingToPublic === true);
  const blindShape = next.errorNamesProxy === true && next.errorNamesBaseUrl !== true;
  const boxedShape = next.denyByDefaultSandbox === true;
  const demandedShape =
    named &&
    next.namedGatewayServesMessages === true &&
    next.publicOriginReachable !== true &&
    next.helloToBaseUrl !== true;
  const strippedShape = next.pathStripped === true;
  const printedShape =
    named && next.headlessPrintWorks === true && next.helloToBaseUrl !== true;
  const housedHold =
    named &&
    next.interactiveTuiStarts === true &&
    next.headlessPrintWorks === true &&
    next.helloToBaseUrl === true &&
    next.oauthProfileToPublic !== true &&
    next.eventLoggingToPublic !== true &&
    next.helloToPublic !== true &&
    next.pathStripped !== true &&
    (next.errorNamesProxy !== true || next.errorNamesBaseUrl === true);
  return {
    named,
    baseUrl: next.baseUrl,
    probesPublic,
    refusedShape,
    swungShape,
    fatalShape,
    splitShape,
    blindShape,
    boxedShape,
    demandedShape,
    strippedShape,
    printedShape,
    housedHold,
    publicOriginReachable: next.publicOriginReachable,
    namedGatewayServesMessages: next.namedGatewayServesMessages,
    interactiveTuiStarts: next.interactiveTuiStarts,
    headlessPrintWorks: next.headlessPrintWorks,
    helloToBaseUrl: next.helloToBaseUrl,
    helloToPublic: next.helloToPublic,
    oauthProfileToPublic: next.oauthProfileToPublic,
    eventLoggingToPublic: next.eventLoggingToPublic,
    checkFatalInTui: next.checkFatalInTui,
    checkAdvisoryInPrint: next.checkAdvisoryInPrint,
    errorNamesProxy: next.errorNamesProxy,
    errorNamesBaseUrl: next.errorNamesBaseUrl,
    pathStripped: next.pathStripped,
    denyByDefaultSandbox: next.denyByDefaultSandbox,
  };
}

export function isIdle(binnacle = {}) {
  const next = cloneBinnacle(binnacle);
  return (
    !next.baseUrl &&
    next.publicOriginReachable !== true &&
    next.namedGatewayServesMessages !== true &&
    next.interactiveTuiStarts !== true &&
    next.headlessPrintWorks !== true &&
    next.helloToBaseUrl !== true &&
    next.helloToPublic !== true &&
    next.oauthProfileToPublic !== true &&
    next.eventLoggingToPublic !== true &&
    next.checkFatalInTui !== true &&
    next.checkAdvisoryInPrint !== true &&
    next.errorNamesProxy !== true &&
    next.errorNamesBaseUrl !== true &&
    next.pathStripped !== true &&
    next.denyByDefaultSandbox !== true
  );
}

/**
 * First match wins by documented priority:
 * refused > swung > fatal > split > blind > boxed
 * > demanded > stripped > printed > housed.
 * Idle housed is first. A named heading / working -p /
 * green "gateway serves /v1/messages" lamp must NOT force
 * housed when the TUI still refuses.
 */
export function classify(binnacle = {}) {
  const next = cloneBinnacle(binnacle);
  if (isIdle(next)) return "housed";
  const facts = analyze(next);

  if (facts.refusedShape) return "refused";
  if (facts.swungShape) return "swung";
  if (facts.fatalShape) return "fatal";
  if (facts.splitShape) return "split";
  if (facts.blindShape) return "blind";
  if (facts.boxedShape) return "boxed";
  if (facts.demandedShape) return "demanded";
  if (facts.strippedShape) return "stripped";
  if (facts.printedShape) return "printed";
  if (facts.housedHold) return "housed";
  return "housed";
}

export function feedOf(binnacle = {}, verdict = "") {
  const kind = verdict || classify(binnacle);
  if (kind === "refused") {
    return "● Refused · interactive TUI will not start · named gyro heading is not enough · primary #90551";
  }
  if (kind === "swung") {
    return "● Swung · TUI still probes api.anthropic.com despite named ANTHROPIC_BASE_URL";
  }
  if (kind === "fatal") {
    return "● Fatal · check is fatal in TUI and only advisory in claude -p";
  }
  if (kind === "split") {
    return "● Split · /api/hello honors BASE_URL · oauth/profile and event_logging still knock magnetic north";
  }
  if (kind === "blind") {
    return "● Blind · error names the proxy · never the configured base URL";
  }
  if (kind === "boxed") {
    return "● Boxed · deny-by-default sandbox · only legal route is the named gateway";
  }
  if (kind === "demanded") {
    return "● Demanded · startup requires a full trusted-TLS HTTP response from the public origin";
  }
  if (kind === "stripped") {
    return "● Stripped · injected gateway origin has the path component stripped · nearby #88345";
  }
  if (kind === "printed") {
    return "● Printed · claude -p on the same config works · headless already follows gyro";
  }
  return "● Housed · named gyro heading · TUI starts on that origin · no magnetic knock required · idle word is housed";
}

export function reasonsOf(binnacle = {}, verdict = "") {
  const next = cloneBinnacle(binnacle);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.named
      ? `binnacle gyro ${facts.baseUrl} · MAG ${PUBLIC_ORIGIN} · TUI ${facts.interactiveTuiStarts ? "starts" : "refuses"} · -p ${facts.headlessPrintWorks ? "works" : "unseen"}`
      : "one lamp on the gyro card · idle word is housed",
  );
  if (facts.named && !facts.interactiveTuiStarts) {
    reasons.push(
      "interactive TUI refuses to start · a named ANTHROPIC_BASE_URL is not a hold",
    );
  }
  if (facts.probesPublic) {
    reasons.push(
      `magnetic knock still leaves the house · helloToPublic=${facts.helloToPublic} · oauth/profile=${facts.oauthProfileToPublic} · event_logging=${facts.eventLoggingToPublic}`,
    );
  }
  if (facts.helloToBaseUrl && (facts.oauthProfileToPublic || facts.eventLoggingToPublic)) {
    reasons.push(
      "/api/hello honors the named heading · GET /api/oauth/profile and POST /api/event_logging/v2/batch do not",
    );
  }
  if (facts.headlessPrintWorks && !facts.interactiveTuiStarts) {
    reasons.push(
      "claude -p on the same config works · inverse of Husk (here headless lives, interactive dies)",
    );
  }
  if (facts.namedGatewayServesMessages && !facts.publicOriginReachable) {
    reasons.push(
      "named gateway already serves /v1/messages · public origin is unreachable · the check still consults magnetic north",
    );
  }
  if (facts.checkFatalInTui && facts.checkAdvisoryInPrint) {
    reasons.push("same check is fatal in TUI and only advisory in -p");
  }
  if (facts.errorNamesProxy && !facts.errorNamesBaseUrl) {
    reasons.push("error names the proxy · never the configured base URL · nearby codex#40435");
  }
  if (facts.denyByDefaultSandbox) {
    reasons.push(
      "deny-by-default sandbox · only legal route is the named gateway · this is not Gasket's discarded allowlist",
    );
  }
  if (facts.pathStripped) {
    reasons.push("injected gateway origin has the path component stripped · nearby #88345");
  }
  reasons.push("a named heading is not a hold");
  reasons.push(
    "NOT Visa (MCP OAuth missing resource) / Husk (hollow headless SUCCESS) / Sprag / Reed (MCP lifecycle) / Gasket (sandbox allowlist discard) / Tain (Chrome pairing) / Tocsin / Reveille / Leat / Fusee / leftover woodworking / millimetre-slider",
  );
  if (kind === "housed") {
    reasons.push(
      "named BASE_URL; TUI starts on that origin; no public-origin probe required; idle word is housed",
    );
  }
  if (kind === "refused") {
    reasons.push(
      "PRIMARY #90551: BASE_URL set and serving /v1/messages, claude -p works, TUI refuses because api.anthropic.com is unreachable.",
    );
  }
  if (kind === "swung") {
    reasons.push("TUI still probes api.anthropic.com despite named ANTHROPIC_BASE_URL.");
  }
  if (kind === "fatal") {
    reasons.push("check is fatal in TUI, only advisory in -p.");
  }
  if (kind === "split") {
    reasons.push("/api/hello honors BASE_URL; oauth/profile and event_logging do not.");
  }
  if (kind === "blind") {
    reasons.push("error names the proxy, never the configured base URL.");
  }
  if (kind === "boxed") {
    reasons.push("deny-by-default sandbox; only legal route is the named gateway.");
  }
  if (kind === "demanded") {
    reasons.push("startup requires a full trusted-TLS HTTP response from the public origin.");
  }
  if (kind === "stripped") {
    reasons.push("injected gateway origin has the path component stripped.");
  }
  if (kind === "printed") {
    reasons.push("claude -p on the same config works.");
  }
  return reasons;
}

export function verdictOf(binnacle = {}) {
  return classify(binnacle);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function housedOf(binnacle = {}, verdict = "") {
  return (verdict || classify(binnacle)) === "housed";
}

export function refusedOf(binnacle = {}, verdict = "") {
  return (verdict || classify(binnacle)) === "refused";
}

export function summaryOf(binnacle = {}) {
  const next = cloneBinnacle(binnacle);
  const facts = analyze(next);
  return {
    baseUrl: facts.baseUrl,
    publicOriginReachable: facts.publicOriginReachable,
    namedGatewayServesMessages: facts.namedGatewayServesMessages,
    interactiveTuiStarts: facts.interactiveTuiStarts,
    headlessPrintWorks: facts.headlessPrintWorks,
    helloToBaseUrl: facts.helloToBaseUrl,
    helloToPublic: facts.helloToPublic,
    oauthProfileToPublic: facts.oauthProfileToPublic,
    eventLoggingToPublic: facts.eventLoggingToPublic,
    checkFatalInTui: facts.checkFatalInTui,
    checkAdvisoryInPrint: facts.checkAdvisoryInPrint,
    errorNamesProxy: facts.errorNamesProxy,
    errorNamesBaseUrl: facts.errorNamesBaseUrl,
    pathStripped: facts.pathStripped,
    denyByDefaultSandbox: facts.denyByDefaultSandbox,
  };
}

export function score(binnacle = {}) {
  const next = cloneBinnacle(binnacle);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    housed: housedOf(next, verdict),
    refused: refusedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    baseUrl: facts.baseUrl,
    publicOriginReachable: facts.publicOriginReachable,
    namedGatewayServesMessages: facts.namedGatewayServesMessages,
    interactiveTuiStarts: facts.interactiveTuiStarts,
    headlessPrintWorks: facts.headlessPrintWorks,
    helloToBaseUrl: facts.helloToBaseUrl,
    helloToPublic: facts.helloToPublic,
    oauthProfileToPublic: facts.oauthProfileToPublic,
    eventLoggingToPublic: facts.eventLoggingToPublic,
    checkFatalInTui: facts.checkFatalInTui,
    checkAdvisoryInPrint: facts.checkAdvisoryInPrint,
    errorNamesProxy: facts.errorNamesProxy,
    errorNamesBaseUrl: facts.errorNamesBaseUrl,
    pathStripped: facts.pathStripped,
    denyByDefaultSandbox: facts.denyByDefaultSandbox,
    summary: summaryOf(next),
    binnacle: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const binnacleSrc =
    src.binnacle ||
    src.probe ||
    src.payload ||
    src.heading ||
    payload.binnacle ||
    payload.probe ||
    payload.heading;
  const binnacle = cloneBinnacle(
    binnacleSrc && typeof binnacleSrc === "object"
      ? { ...binnacleSrc, ...src, ...payload }
      : payload,
  );
  if (typeof src.session === "string" && !binnacle.session) binnacle.session = src.session;
  if (typeof payload.session === "string" && !binnacle.session) binnacle.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? binnacle.session ?? ""),
    binnacle,
    issue: src.issue ?? payload.issue ?? binnacle.issue ?? null,
    source: src.source ?? payload.source ?? binnacle.source ?? "",
  };
}

function binnacleResult(verdict, binnacle, action, extras = {}) {
  const next = cloneBinnacle(binnacle);
  const scored = score(next);
  return {
    ok: true,
    product: "binnacle",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    housed: scored.housed,
    refused: scored.refused,
    binnacleHoused: verdict === "housed",
    binnacleSwung: verdict === "swung",
    binnacleRefused: verdict === "refused",
    binnaclePrinted: verdict === "printed",
    binnacleSplit: verdict === "split",
    binnacleFatal: verdict === "fatal",
    binnacleDemanded: verdict === "demanded",
    binnacleBlind: verdict === "blind",
    binnacleBoxed: verdict === "boxed",
    binnacleStripped: verdict === "stripped",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    baseUrl: scored.baseUrl,
    publicOriginReachable: scored.publicOriginReachable,
    namedGatewayServesMessages: scored.namedGatewayServesMessages,
    interactiveTuiStarts: scored.interactiveTuiStarts,
    headlessPrintWorks: scored.headlessPrintWorks,
    helloToBaseUrl: scored.helloToBaseUrl,
    helloToPublic: scored.helloToPublic,
    oauthProfileToPublic: scored.oauthProfileToPublic,
    eventLoggingToPublic: scored.eventLoggingToPublic,
    checkFatalInTui: scored.checkFatalInTui,
    checkAdvisoryInPrint: scored.checkAdvisoryInPrint,
    errorNamesProxy: scored.errorNamesProxy,
    errorNamesBaseUrl: scored.errorNamesBaseUrl,
    pathStripped: scored.pathStripped,
    denyByDefaultSandbox: scored.denyByDefaultSandbox,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    binnacle: next,
    ...extras,
  };
}

function seedBinnacle(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    binnacle: {
      ...emptyBinnacle(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      baseUrl: extras.baseUrl != null ? extras.baseUrl : "",
      publicOriginReachable: Boolean(extras.publicOriginReachable),
      namedGatewayServesMessages: Boolean(extras.namedGatewayServesMessages),
      interactiveTuiStarts: Boolean(extras.interactiveTuiStarts),
      headlessPrintWorks: Boolean(extras.headlessPrintWorks),
      helloToBaseUrl: Boolean(extras.helloToBaseUrl),
      helloToPublic: Boolean(extras.helloToPublic),
      oauthProfileToPublic: Boolean(extras.oauthProfileToPublic),
      eventLoggingToPublic: Boolean(extras.eventLoggingToPublic),
      checkFatalInTui: Boolean(extras.checkFatalInTui),
      checkAdvisoryInPrint: Boolean(extras.checkAdvisoryInPrint),
      errorNamesProxy: Boolean(extras.errorNamesProxy),
      errorNamesBaseUrl: Boolean(extras.errorNamesBaseUrl),
      pathStripped: Boolean(extras.pathStripped),
      denyByDefaultSandbox: Boolean(extras.denyByDefaultSandbox),
    },
  };
}

/** Healthy housed heading. TUI starts on the named origin. */
export function seedHoused() {
  return seedBinnacle("housed", "chart", {
    session: "housed",
    issue: null,
    scored: true,
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: false,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: true,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Control: same as housed, session tagged as the healthy proof. */
export function seedControl() {
  return seedBinnacle("housed", "chart", {
    session: "90551-control",
    issue: null,
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: false,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: true,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/**
 * #90551 refused: BASE_URL set and serving /v1/messages,
 * -p works, TUI refuses because api.anthropic.com is
 * unreachable. Hello goes to both; oauth + event_logging
 * go public only. Check fatal in TUI, advisory in -p.
 * Error names the proxy. Sandbox is deny-by-default.
 */
export function seedRefused() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-refused",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: false,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: false,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: true,
    oauthProfileToPublic: true,
    eventLoggingToPublic: true,
    checkFatalInTui: true,
    checkAdvisoryInPrint: true,
    errorNamesProxy: true,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: true,
  });
}

export function seed90551() {
  return seedRefused();
}

/** TUI starts but still knocks magnetic north. Hello does not honor gyro. */
export function seedSwung() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-swung",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: true,
    oauthProfileToPublic: true,
    eventLoggingToPublic: true,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Check polarity only: fatal in TUI, advisory in -p. TUI started. */
export function seedFatal() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-fatal",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: true,
    checkAdvisoryInPrint: true,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Hello honors BASE_URL; oauth/profile still knocks public. */
export function seedSplit() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-split",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: false,
    oauthProfileToPublic: true,
    eventLoggingToPublic: true,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Error names the proxy, never the configured base URL. */
export function seedBlind() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-blind",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: true,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Deny-by-default sandbox; only legal route is the named gateway. */
export function seedBoxed() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-boxed",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: true,
  });
}

/** Public origin unreachable; gateway already serves messages; TUI started. */
export function seedDemanded() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-demanded",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: false,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Nearby #88345: injected gateway origin has the path stripped. */
export function seedStripped() {
  return seedBinnacle(88345, "anthropics/claude-code#88345", {
    session: "88345-stripped",
    baseUrl: "https://gateway.example",
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: true,
    denyByDefaultSandbox: false,
  });
}

/** Headless -p follows gyro; TUI also starts; hello does not yet prove housing. */
export function seedPrinted() {
  return seedBinnacle(FEATURED_ISSUE, "anthropics/claude-code#90551", {
    session: "90551-printed",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: true,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: false,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    checkFatalInTui: false,
    checkAdvisoryInPrint: false,
    errorNamesProxy: false,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: false,
  });
}

/** Idle reset. One lamp on the gyro card. Never an empty house. */
export function seedReset() {
  return seedBinnacle("housed", "chart", {
    session: "housed",
    issue: null,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyBinnacle();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneBinnacle({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneBinnacle({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const refused =
    /TUI refuses|interactive TUI will not start|will not start unless/i.test(text) &&
    /BASE_URL|api\.anthropic\.com|-p /i.test(text);
  const swung = /still probes api\.anthropic\.com|magnetic north|still knocks/i.test(text);
  const fatal = /fatal in TUI|advisory in -p|advisory in print/i.test(text);
  const split = /\/api\/hello honors|oauth\/profile and event_logging/i.test(text);
  const blind = /error names the proxy|never the configured base/i.test(text);
  const boxed = /deny-by-default sandbox|only legal route is the named gateway/i.test(text);
  const demanded = /trusted-TLS|full .* response from the public origin/i.test(text);
  const stripped = /path (component )?stripped|#88345/i.test(text);
  const printed = /claude -p on the same config works|headless already follows gyro/i.test(text);
  const housed = /admit housed|TUI starts on that origin|no magnetic knock/i.test(text);

  if (refused) {
    return {
      ...seedRefused().binnacle,
      session: "paste-refused",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (swung) {
    return {
      ...seedSwung().binnacle,
      session: "paste-swung",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (fatal) {
    return {
      ...seedFatal().binnacle,
      session: "paste-fatal",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (split) {
    return {
      ...seedSplit().binnacle,
      session: "paste-split",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (blind) {
    return {
      ...seedBlind().binnacle,
      session: "paste-blind",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (boxed) {
    return {
      ...seedBoxed().binnacle,
      session: "paste-boxed",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (demanded) {
    return {
      ...seedDemanded().binnacle,
      session: "paste-demanded",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (stripped) {
    return {
      ...seedStripped().binnacle,
      session: "paste-stripped",
      source: "anthropics/claude-code#88345",
      issue: 88345,
      scored: true,
    };
  }
  if (printed) {
    return {
      ...seedPrinted().binnacle,
      session: "paste-printed",
      source: "anthropics/claude-code#90551",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (housed) {
    return { ...seedControl().binnacle, session: "paste-housed", source: "paste", scored: true };
  }
  return { ...emptyBinnacle(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  housed: seedHoused,
  control: seedControl,
  refused: seedRefused,
  90551: seed90551,
  "90551-refused": seedRefused,
  swung: seedSwung,
  fatal: seedFatal,
  split: seedSplit,
  blind: seedBlind,
  boxed: seedBoxed,
  demanded: seedDemanded,
  stripped: seedStripped,
  printed: seedPrinted,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  chart: seedControl,
  bench: seedControl,
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
  let binnacle = cloneBinnacle(action.binnacle);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "housed" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return binnacleResult("housed", emptyBinnacle(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "bench" || verb === "chart") {
    binnacle = seedControl().binnacle;
    return binnacleResult(classify(binnacle), binnacle, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "refused" || verb === "incident" || verb === "90551") {
    binnacle = seedRefused().binnacle;
    return binnacleResult(classify(binnacle), binnacle, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound" || verb === "steer") {
    binnacle = { ...binnacle, scored: true };
    return binnacleResult(classify(binnacle), binnacle, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "house") {
    binnacle = { ...binnacle, scored: true };
    return binnacleResult(classify(binnacle), binnacle, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "house" ? "score" : verb,
    });
  }

  binnacle = { ...binnacle, scored: true };
  return binnacleResult(classify(binnacle), binnacle, action);
}
