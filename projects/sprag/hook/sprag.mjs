/**
 * Sprag — overrunning-clutch bench for Claude Code boot-cached MCP
 * attach failure. A failed attach at boot is a sprag that locked on
 * the first refuse; later success cannot reverse it until the whole
 * process is rebuilt. Score the race or admit overrun.
 *
 * A sprag is the one-way element in an overrunning clutch: it locks
 * against reverse rotation and freewheels the other way. Claude Code
 * resolves MCP servers once at process startup and caches a failed
 * connection for the lifetime of the process. If a local / desktop-
 * bundled MCP server is not running yet when `claude` starts, that
 * server is marked failed and is never retried — not on the next
 * tools/call, not on /clear, and /mcp reconnect fails outright.
 * The only recovery is fully quitting and restarting the process.
 *
 * Primary #90494: MCP server that starts after Claude Code is never
 * connected — no retry, and /mcp reconnect fails with "No token
 * data found". Filed 2026-08-29, open. Claude Code 2.1.248, macOS.
 * Repro 1: start claude while the local HTTP/stdio MCP server is
 * down → ConnectionRefused, 3 attempts at startup, then nothing;
 * start the server; curl succeeds; same process still shows failed;
 * /clear still failed; full quit+relaunch connects instantly.
 * Repro 2: config migrated HTTP+bearer → stdio while process
 * running; /mcp reconnect fails "No token data found" (boot-pinned
 * transport + current credentials).
 *
 * Shape (cite as shape, not a new primary):
 *   #84778 — a failed MCP server attach at startup is terminal for
 *            the session — no retry, even for transient network
 *            errors. Healthy initialize 0.42–0.94s; unreachable
 *            proxy errors in ~0.2s; 12-hour probe 213/720 failures
 *            in contiguous blocks; a 7s recovery that was previously
 *            fatal attaches after an 8.2s wrapper wait.
 *   #81042 — MCP server down at session start is unrecoverable for
 *            the session even after account-level reconnect succeeds
 *            (claude mcp list shows ✔ Connected; running session
 *            still has no tools; nested headless claude -p was the
 *            workaround).
 *   #85766 — claude mcp add during a running session doesn't appear
 *            in /mcp until a new session starts.
 *   #83044 — /mcp reconnect rebuilds transport but not broker state;
 *            /mcp shows Connected throughout a wedge.
 *
 * Verdicts: overrun | locked | mixed | late | refused | cached
 *           | stale | spun | held | live
 * Idle word is overrun (the freewheeling / overrun state of a
 * sprag clutch). NEVER use sprag / clutch / empty / failed / mcp /
 * retry as idle. NEVER reuse pratique, bound, stilled, drained,
 * flat, fit, spoilt, laid, unlinked, tight, banked, roosted,
 * stocked, seated, heard, clear, paired, kernel, latched, upheld,
 * sterling, home, valid, dry, sealed, quiet, seised, stabled,
 * wound.
 *
 * Slack sprag alarm on locked / mixed / late / refused / cached /
 * stale. Linear ticket on locked / mixed. GitHub sprag-ledger of
 * race events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Reed (four-contact cabinet for a server that reports
 * Connected — connected vs registered vs one served call).
 * NOT Larder (plugin-store freeze).
 * NOT Tappet (silent hook injection / valve train).
 * NOT Fusee (early schedule dispatch / clockmaker).
 * NOT Iota (path-key identity).
 * NOT Lazaret (malware-reminder refusal).
 * NOT Leat (millrace). NOT Shunt (railway).
 * Different problem: first failed attach locks the race for the
 * whole process, even after the server is up. Desktop-app-bundled
 * MCP servers look permanently broken whenever the user's terminal
 * was opened first.
 * Different UI: gearbox / overrunning-clutch bench. Steel sprags
 * between inner and outer races, ATF oil-amber, carbon, blued
 * steel, workshop grey, drain plug, race lamp.
 * Different idle: overrun.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Clutch, Overrun, Ratchet, Pawl,
 * Detent, Freewheel, Race, Inner, Outer, Sprag (as idle), Reed,
 * Larder, Tappet, Fusee, Quarantine. Product name is Sprag only.
 */

export const VERDICTS = Object.freeze([
  "overrun",
  "locked",
  "mixed",
  "late",
  "refused",
  "cached",
  "stale",
  "spun",
  "held",
  "live",
]);
export const IDLE_WORD = "overrun";
export const SLACK_VERDICTS = Object.freeze([
  "locked",
  "mixed",
  "late",
  "refused",
  "cached",
  "stale",
]);
export const LINEAR_VERDICTS = Object.freeze(["locked", "mixed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const BOOT_ATTEMPTS = 3;

const FORBIDDEN_IDLE = Object.freeze([
  "sprag",
  "clutch",
  "empty",
  "failed",
  "mcp",
  "retry",
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
  "ratchet",
  "pawl",
  "detent",
  "freewheel",
  "race",
  "inner",
  "outer",
  "reed",
  "larder",
  "tappet",
  "fusee",
  "quarantine",
  "lazaret",
  "iota",
  "leat",
  "shunt",
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

function asTransport(value) {
  const text = asText(value).trim().toLowerCase();
  if (text === "http" || text === "stdio" || text === "sse") return text;
  return text;
}

export function emptyProbe() {
  return {
    serverRunningAtBoot: false,
    serverRunningNow: false,
    attachFailed: false,
    retried: false,
    reconnectAttempted: false,
    reconnectError: "",
    transportPinnedAtBoot: "",
    transportNow: "",
    credentialsNow: "",
    tokenDataFound: false,
    processRestarted: false,
    toolsAvailable: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "overrun-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const race = src.race && typeof src.race === "object" ? src.race : {};
  const clutch = src.clutch && typeof src.clutch === "object" ? src.clutch : {};
  const sprag = src.sprag && typeof src.sprag === "object" ? src.sprag : {};
  const bench = src.bench && typeof src.bench === "object" ? src.bench : {};
  const inner = src.inner && typeof src.inner === "object" ? src.inner : {};
  const outer = src.outer && typeof src.outer === "object" ? src.outer : {};
  const pick = (key) =>
    src[key] ??
    race[key] ??
    clutch[key] ??
    sprag[key] ??
    bench[key] ??
    inner[key] ??
    outer[key];
  return {
    ...emptyProbe(),
    serverRunningAtBoot: asBool(pick("serverRunningAtBoot")),
    serverRunningNow: asBool(pick("serverRunningNow")),
    attachFailed: asBool(pick("attachFailed")),
    retried: asBool(pick("retried")),
    reconnectAttempted: asBool(pick("reconnectAttempted")),
    reconnectError: asText(pick("reconnectError")),
    transportPinnedAtBoot: asTransport(pick("transportPinnedAtBoot")),
    transportNow: asTransport(pick("transportNow")),
    credentialsNow: asText(pick("credentialsNow")),
    tokenDataFound: asBool(pick("tokenDataFound")),
    processRestarted: asBool(pick("processRestarted")),
    toolsAvailable: asBool(pick("toolsAvailable")),
    observed: asBool(src.observed ?? race.observed ?? clutch.observed ?? sprag.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? race.source ?? clutch.source ?? sprag.source),
    issue: asIssue(src.issue ?? race.issue ?? clutch.issue ?? sprag.issue),
    scored: asBool(src.scored ?? race.scored ?? clutch.scored ?? sprag.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.serverRunningAtBoot &&
    !next.serverRunningNow &&
    !next.attachFailed &&
    !next.retried &&
    !next.reconnectAttempted &&
    !next.reconnectError &&
    !next.transportPinnedAtBoot &&
    !next.transportNow &&
    !next.credentialsNow &&
    !next.tokenDataFound &&
    !next.processRestarted &&
    !next.toolsAvailable &&
    !next.observed
  );
}

export function tokenMismatchOf(probe = {}) {
  const next = cloneProbe(probe);
  const err = asText(next.reconnectError);
  return /no token data found/i.test(err) || (next.reconnectAttempted && !next.tokenDataFound && /token/i.test(err));
}

export function lockedRaceOf(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.attachFailed &&
    next.serverRunningNow &&
    !next.processRestarted &&
    !next.toolsAvailable &&
    !next.retried
  );
}

export function analyze(probe = {}) {
  const next = cloneProbe(probe);
  const lockedRace = lockedRaceOf(next);
  const tokenMismatch = tokenMismatchOf(next);
  const mixedReconnect =
    next.reconnectAttempted &&
    (tokenMismatch || (!next.tokenDataFound && /no token data found/i.test(next.reconnectError)));
  const lateStart = !next.serverRunningAtBoot && next.serverRunningNow && !next.processRestarted;
  const bootRefused =
    next.attachFailed &&
    !next.serverRunningAtBoot &&
    !next.serverRunningNow &&
    !next.processRestarted &&
    !next.observed;
  const cacheHeld =
    next.attachFailed && !next.retried && !next.processRestarted && !next.toolsAvailable && next.observed;
  const transportPinned =
    next.reconnectAttempted && Boolean(next.transportPinnedAtBoot);
  const transportStale =
    transportPinned &&
    (next.transportNow !== next.transportPinnedAtBoot || next.transportNow === next.transportPinnedAtBoot);
  const spunRestart = next.processRestarted && next.toolsAvailable;
  const liveAttach = next.serverRunningAtBoot && !next.attachFailed && next.toolsAvailable;
  const connectionRefused = /connectionrefused|econnrefused/i.test(next.reconnectError);
  return {
    lockedRace,
    tokenMismatch,
    mixedReconnect,
    lateStart,
    bootRefused,
    cacheHeld,
    transportPinned,
    transportStale,
    spunRestart,
    liveAttach,
    connectionRefused,
    attachFailed: next.attachFailed,
    serverRunningAtBoot: next.serverRunningAtBoot,
    serverRunningNow: next.serverRunningNow,
    retried: next.retried,
    reconnectAttempted: next.reconnectAttempted,
    processRestarted: next.processRestarted,
    toolsAvailable: next.toolsAvailable,
    observed: next.observed,
  };
}

export function lockedFault(probe = {}) {
  return lockedRaceOf(probe);
}

/**
 * First match wins. Idle overrun is first. Classes stay
 * distinguishable: a failed attach at boot is a sprag that locked
 * on the first refuse. Later success cannot reverse it until the
 * whole process is rebuilt.
 * NOT Reed (connected vs registered vs one served call).
 * NOT Lazaret (malware-reminder refusal). NOT Fusee (early schedule).
 * NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "overrun";

  const facts = analyze(next);

  if (facts.lockedRace) return "locked";

  if (facts.mixedReconnect) return "mixed";

  if (facts.lateStart) return "late";

  if (facts.bootRefused) return "refused";

  if (facts.cacheHeld) return "cached";

  if (facts.transportPinned) return "stale";

  if (facts.spunRestart) return "spun";

  if (facts.liveAttach) return "live";

  if (facts.attachFailed || facts.reconnectAttempted || facts.observed || facts.processRestarted) {
    return "held";
  }

  return "overrun";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.lockedRace) add("locked");
  if (facts.mixedReconnect) add("mixed");
  if (facts.lateStart) add("late");
  if (facts.connectionRefused || facts.bootRefused) add("refused");
  if (facts.cacheHeld || (facts.attachFailed && !facts.retried && !facts.processRestarted)) {
    add("cached");
  }
  if (facts.transportPinned) add("stale");
  if (facts.spunRestart) add("spun");
  if (facts.liveAttach) add("live");
  if (kind !== "held" && facts.attachFailed && facts.processRestarted && !facts.toolsAvailable) {
    add("held");
  }
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "locked") {
    return "● Locked · first attach failed; server later reachable; still failed for process lifetime · primary #90494";
  }
  if (kind === "mixed") {
    return "● Mixed · reconnect used boot-pinned transport + current credentials → No token data found";
  }
  if (kind === "late") {
    return "● Late · server started after the claude process";
  }
  if (kind === "refused") {
    return "● Refused · ConnectionRefused at boot · 3 attempts, then nothing";
  }
  if (kind === "cached") {
    return "● Cached · failed connection cached for process lifetime";
  }
  if (kind === "stale") {
    return "● Stale · reconnect used boot-pinned transport";
  }
  if (kind === "spun") {
    return "● Spun · recovered only by full process restart";
  }
  if (kind === "held") {
    return "● Held · classification uncertain";
  }
  if (kind === "live") {
    return "● Live · server was up at boot, connected, tools available";
  }
  return "● Overrun · attach not a hold · nothing scored · idle word is overrun";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.serverRunningAtBoot
      ? "server was running at boot"
      : "server was not running at boot",
  );
  reasons.push(
    facts.serverRunningNow ? "server is reachable now" : "server is not reachable now",
  );
  reasons.push(facts.attachFailed ? "first attach failed" : "first attach did not fail");
  reasons.push(facts.retried ? "a retry was attempted" : "no retry after the first refuse");
  if (facts.reconnectAttempted) {
    reasons.push(
      next.reconnectError
        ? `reconnect attempted: ${next.reconnectError}`
        : "reconnect attempted",
    );
  }
  if (next.transportPinnedAtBoot) {
    reasons.push(`transport pinned at boot: ${next.transportPinnedAtBoot}`);
  }
  if (next.transportNow) reasons.push(`transport now: ${next.transportNow}`);
  if (next.credentialsNow) reasons.push(`credentials now: ${next.credentialsNow}`);
  reasons.push(next.tokenDataFound ? "token data found" : "no token data found");
  reasons.push(
    facts.processRestarted ? "process was fully restarted" : "same process lifetime",
  );
  reasons.push(facts.toolsAvailable ? "tools are available" : "tools are unavailable");
  if (next.observed) {
    reasons.push("Race sounded: boot refuse vs later reachable vs process lifetime");
  }
  reasons.push("a failed attach at boot is not a hold");
  reasons.push(
    "NOT Reed (connected vs registered vs one served call) / Lazaret (malware-reminder refusal) / Fusee (early schedule) / Larder (plugin-store freeze) / Tappet (silent hook injection) / leftover woodworking / millimetre-slider",
  );
  if (kind === "overrun") {
    reasons.push("attach not a hold, or race idle; idle word is overrun");
  }
  if (kind === "locked") {
    reasons.push(
      'PRIMARY #90494 repro 1: MCP server that starts after Claude Code is never connected — no retry, and /mcp reconnect fails with "No token data found". Filed 2026-08-29, open. Claude Code 2.1.248, macOS. Start claude while the local HTTP/stdio MCP server is down → ConnectionRefused, 3 attempts at startup, then nothing; start the server; curl succeeds; same process still shows failed; /clear still failed; full quit+relaunch connects instantly',
    );
  }
  if (kind === "mixed") {
    reasons.push(
      "PRIMARY #90494 repro 2: config migrated HTTP+bearer → stdio while process running; /mcp reconnect fails \"No token data found\" (boot-pinned transport + current credentials)",
    );
  }
  if (kind === "late") {
    reasons.push(
      "Server started after the claude process. Desktop-app-bundled MCP servers look permanently broken whenever the user's terminal was opened first",
    );
  }
  if (kind === "refused") {
    reasons.push(
      "ConnectionRefused at boot. 3 attempts at startup, then nothing. Shape #84778: a failed MCP server attach at startup is terminal for the session",
    );
  }
  if (kind === "cached") {
    reasons.push(
      "Failed connection cached for the lifetime of the process. Not retried on the next tools/call, not on /clear. Shape #81042: session still has no tools after account-level reconnect succeeds",
    );
  }
  if (kind === "stale") {
    reasons.push(
      "Reconnect used the transport pinned at boot. Shape #83044: /mcp reconnect rebuilds transport but not broker state",
    );
  }
  if (kind === "spun") {
    reasons.push(
      "Recovered only by fully quitting and restarting the claude process. Vendors document \"fully restart Claude Code (quitting the conversation is not enough)\" as a support FAQ",
    );
  }
  if (kind === "held") {
    reasons.push("Classification uncertain on this race");
  }
  if (kind === "live") {
    reasons.push("server was up at boot; connected; tools available; the clutch freewheeled");
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

export function overrunOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "overrun";
}

export function lockedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "locked";
}

export function mixedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "mixed";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], overrun, locked, mixed }
 * Deterministic. First match wins. Idle overrun first.
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
    overrun: overrunOf(next, verdict),
    locked: lockedOf(next, verdict),
    mixed: mixedOf(next, verdict),
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
    serverRunningAtBoot: pick("serverRunningAtBoot"),
    serverRunningNow: pick("serverRunningNow"),
    attachFailed: pick("attachFailed"),
    retried: pick("retried"),
    reconnectAttempted: pick("reconnectAttempted"),
    reconnectError: pick("reconnectError"),
    transportPinnedAtBoot: pick("transportPinnedAtBoot"),
    transportNow: pick("transportNow"),
    credentialsNow: pick("credentialsNow"),
    tokenDataFound: pick("tokenDataFound"),
    processRestarted: pick("processRestarted"),
    toolsAvailable: pick("toolsAvailable"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    race: fromFields.race,
    clutch: fromFields.clutch,
    sprag: fromFields.sprag,
    bench: fromFields.bench,
    inner: fromFields.inner,
    outer: fromFields.outer,
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
    product: "sprag",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    overrun: scored.overrun,
    locked: scored.locked,
    mixed: scored.mixed,
    cluster: scored.cluster,
    raceOverrun: verdict === "overrun",
    raceLocked: verdict === "locked",
    raceMixed: verdict === "mixed",
    raceLate: verdict === "late",
    raceRefused: verdict === "refused",
    raceCached: verdict === "cached",
    raceStale: verdict === "stale",
    raceSpun: verdict === "spun",
    raceHeld: verdict === "held",
    raceLive: verdict === "live",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    serverRunningAtBoot: next.serverRunningAtBoot,
    serverRunningNow: next.serverRunningNow,
    attachFailed: next.attachFailed,
    retried: next.retried,
    reconnectAttempted: next.reconnectAttempted,
    reconnectError: next.reconnectError,
    transportPinnedAtBoot: next.transportPinnedAtBoot,
    transportNow: next.transportNow,
    credentialsNow: next.credentialsNow,
    tokenDataFound: next.tokenDataFound,
    processRestarted: next.processRestarted,
    toolsAvailable: next.toolsAvailable,
    observed: next.observed,
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
      serverRunningAtBoot: Boolean(extras.serverRunningAtBoot),
      serverRunningNow: Boolean(extras.serverRunningNow),
      attachFailed: Boolean(extras.attachFailed),
      retried: Boolean(extras.retried),
      reconnectAttempted: Boolean(extras.reconnectAttempted),
      reconnectError: extras.reconnectError || "",
      transportPinnedAtBoot: extras.transportPinnedAtBoot || "",
      transportNow: extras.transportNow || "",
      credentialsNow: extras.credentialsNow || "",
      tokenDataFound: Boolean(extras.tokenDataFound),
      processRestarted: Boolean(extras.processRestarted),
      toolsAvailable: Boolean(extras.toolsAvailable),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. Attach not a hold. Nothing scored. */
export function seedOverrun() {
  return seedProbe("overrun", "race", {
    session: "overrun",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90494 locked.
 * First attach failed; server later reachable; still failed for
 * process lifetime.
 */
export function seed90494Locked() {
  return seedProbe(90494, "anthropics/claude-code#90494", {
    session: "90494-locked",
    serverRunningAtBoot: false,
    serverRunningNow: true,
    attachFailed: true,
    retried: false,
    reconnectAttempted: false,
    reconnectError: "ConnectionRefused",
    processRestarted: false,
    toolsAvailable: false,
  });
}

/** Reconnect used boot-pinned transport + current credentials. */
export function seedMixed() {
  return seedProbe(90494, "anthropics/claude-code#90494", {
    session: "90494-mixed",
    serverRunningAtBoot: false,
    serverRunningNow: true,
    attachFailed: true,
    retried: true,
    reconnectAttempted: true,
    reconnectError: "No token data found",
    transportPinnedAtBoot: "http",
    transportNow: "stdio",
    credentialsNow: "stdio",
    tokenDataFound: false,
    processRestarted: false,
    toolsAvailable: false,
  });
}

/** Server started after the claude process. */
export function seedLate() {
  return seedProbe(84778, "anthropics/claude-code#84778", {
    session: "84778-late",
    serverRunningAtBoot: false,
    serverRunningNow: true,
    attachFailed: false,
    processRestarted: false,
    toolsAvailable: false,
  });
}

/** ConnectionRefused at boot. Server still down. */
export function seedRefused() {
  return seedProbe(90494, "anthropics/claude-code#90494", {
    session: "90494-refused",
    serverRunningAtBoot: false,
    serverRunningNow: false,
    attachFailed: true,
    retried: false,
    reconnectError: "ConnectionRefused",
    processRestarted: false,
    toolsAvailable: false,
    observed: false,
  });
}

/** Failed connection cached; later check still failed. */
export function seedCached() {
  return seedProbe(81042, "anthropics/claude-code#81042", {
    session: "81042-cached",
    serverRunningAtBoot: false,
    serverRunningNow: false,
    attachFailed: true,
    retried: false,
    processRestarted: false,
    toolsAvailable: false,
    observed: true,
  });
}

/** Reconnect used boot-pinned transport. */
export function seedStale() {
  return seedProbe(83044, "anthropics/claude-code#83044", {
    session: "83044-stale",
    serverRunningAtBoot: true,
    serverRunningNow: true,
    attachFailed: true,
    retried: true,
    reconnectAttempted: true,
    reconnectError: "",
    transportPinnedAtBoot: "http",
    transportNow: "http",
    credentialsNow: "bearer",
    tokenDataFound: true,
    processRestarted: false,
    toolsAvailable: false,
  });
}

/** Recovered only by full process restart. */
export function seedSpun() {
  return seedProbe(90494, "anthropics/claude-code#90494", {
    session: "90494-spun",
    serverRunningAtBoot: false,
    serverRunningNow: true,
    attachFailed: true,
    processRestarted: true,
    toolsAvailable: true,
  });
}

/** Classification uncertain. */
export function seedHeld() {
  return seedProbe(85766, "anthropics/claude-code#85766", {
    session: "85766-held",
    serverRunningAtBoot: false,
    serverRunningNow: false,
    attachFailed: true,
    processRestarted: true,
    toolsAvailable: false,
    observed: false,
  });
}

/** Server was up at boot, connected, tools available. */
export function seedLive() {
  return seedProbe("live", "race", {
    session: "live",
    issue: null,
    serverRunningAtBoot: true,
    serverRunningNow: true,
    attachFailed: false,
    toolsAvailable: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const tokenErr = /no token data found/i.test(text);
  const refused = /connectionrefused|econnrefused/i.test(text);
  const restarted = /quit|relaunch|fully restart|process restart/i.test(text);
  const reconnect = /\/mcp reconnect|reconnect/i.test(text);
  const late = /starts after|started after|not running yet|terminal was opened first/i.test(text);
  const httpToStdio = /http\+bearer|http.*stdio|migrated/i.test(text);
  return {
    serverRunningAtBoot: /up at boot|running at boot|server was up/i.test(text) && !late,
    serverRunningNow:
      /curl succeeds|server (is )?reachable|server (is )?up now|start the server/i.test(text) ||
      (/connected instantly/i.test(text) && restarted),
    attachFailed: refused || /marked failed|still (shows )?failed|never connected/i.test(text),
    retried: /retried|lazy retry/i.test(text) && !/no retry|never retried/i.test(text),
    reconnectAttempted: reconnect,
    reconnectError: tokenErr ? "No token data found" : refused ? "ConnectionRefused" : "",
    transportPinnedAtBoot: httpToStdio || /http/i.test(text) ? "http" : "",
    transportNow: httpToStdio || /stdio/i.test(text) ? "stdio" : /http/i.test(text) ? "http" : "",
    credentialsNow: httpToStdio ? "stdio" : "",
    tokenDataFound: tokenErr ? false : /token data found/i.test(text),
    processRestarted: restarted,
    toolsAvailable:
      /tools (are )?available|connects instantly|connected instantly/i.test(text) &&
      !/still has no tools|tools are unavailable/i.test(text),
    observed: /\/clear|tools\/call|observed|race sounded/i.test(text),
    session: /#90494|90494/.test(text) ? "paste-locked" : "paste",
    source: /#90494/.test(text) ? "anthropics/claude-code#90494" : "paste",
    issue: /#90494/.test(text) ? 90494 : /#84778/.test(text) ? 84778 : null,
    scored: true,
  };
}

const SEEDS = {
  overrun: seedOverrun,
  locked: seed90494Locked,
  90494: seed90494Locked,
  "90494-locked": seed90494Locked,
  mixed: seedMixed,
  "90494-mixed": seedMixed,
  late: seedLate,
  84778: seedLate,
  "84778-late": seedLate,
  refused: seedRefused,
  "90494-refused": seedRefused,
  cached: seedCached,
  81042: seedCached,
  "81042-cached": seedCached,
  stale: seedStale,
  83044: seedStale,
  "83044-stale": seedStale,
  spun: seedSpun,
  "90494-spun": seedSpun,
  held: seedHeld,
  85766: seedHeld,
  "85766-held": seedHeld,
  live: seedLive,
};

function lockedStrike(session) {
  return {
    ...emptyProbe(),
    serverRunningAtBoot: false,
    serverRunningNow: true,
    attachFailed: true,
    retried: false,
    reconnectAttempted: false,
    reconnectError: "ConnectionRefused",
    processRestarted: false,
    toolsAvailable: false,
    session: session || "locked",
    source: "race",
    issue: 90494,
    scored: true,
  };
}

function overrunHold(session) {
  return {
    ...emptyProbe(),
    session: session || "overrun",
    source: "hold",
    scored: true,
  };
}

function liveHold(session) {
  return {
    ...emptyProbe(),
    serverRunningAtBoot: true,
    serverRunningNow: true,
    attachFailed: false,
    toolsAvailable: true,
    session: session || "live",
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

  if (verb === "bail" || verb === "overrun" || verb === "still") {
    return pack("overrun", emptyProbe(), { ...action, action: verb === "still" ? "bail" : verb });
  }

  if (verb === "live" || verb === "proof" || verb === "freewheel") {
    probe = liveHold(action.session || probe.session);
    return pack(classify(probe), probe, {
      ...action,
      action: verb === "proof" || verb === "freewheel" ? "live" : verb,
    });
  }

  if (verb === "race" || verb === "clutch" || verb === "lock") {
    probe = lockedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "race" });
  }

  if (verb === "overrun-out" || verb === "close-race" || verb === "rest") {
    probe = overrunHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bail" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "throw") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "throw" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
