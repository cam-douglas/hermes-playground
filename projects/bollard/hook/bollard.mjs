/**
 * Bollard — dock bollard / wet pier plate
 * for Claude Code remote-control environment
 * retention. A long-lived `claude rc` supervisor
 * (often under systemd Restart=always) can exit
 * for transient reasons. Measured:
 *   supervisor gap 1–3 s (clean restart)
 *     → environment preserved
 *   supervisor gap ~10–11 s (crash → Restart=always)
 *     → server GC → new environment ID; every
 *       previously attached session permanently
 *       unresumable (mobile shows "environment
 *       deleted"; transcripts readable but not
 *       resumable).
 *
 * A dock bollard holds the ship (environment)
 * while the hawser is briefly slack. When the
 * bollard is gone, every painter is orphaned.
 * A slack hawser is not a hold. Score the
 * bollard or admit belayed.
 *
 * Primary #90581: open, has repro, filed
 * 2026-08-29, Linux, Claude Code 2.1.232 at
 * both incidents (native binary, linux-x64);
 * reporter later on 2.1.251. Two incidents in
 * the same primary:
 *   1. Poll-time 401: OAuth access token expired
 *      on poll → supervisor shut down ALL 10
 *      active sessions and exited. systemd
 *      restarted ~14 s later with the same
 *      on-disk credentials and attached fine —
 *      credentials were refreshable; the running
 *      process held a stale token with no reload
 *      path; blast radius was total.
 *   2. Memory thrash declared "offline":
 *      supervisor alive and logging continuously
 *      (3,558 journal lines in two hours) but at
 *      24.2 GiB RSS + 2.4 GiB swap; server said
 *      the machine was offline, cleaned up the
 *      environment, lost 14 sessions. Related to
 *      unbounded child unreaping (#78778, #85639).
 *
 * Same-class (cite, do not invent):
 *   #87213 — resume replays a dead RC binding
 *   #33041 — RC disconnects frequently
 *   #78597 — remote credentials fetch failed
 *            in a long-lived session
 *   #78607 — RC connection failures
 *   #90577 — Connected status flickers
 *   #78778 — RC doesn't reap finished --print
 *            children → memory leak
 *   #85639 — headless supervisor never reaps
 *            children → OOM
 *
 * Cross-ecosystem:
 *   openai/codex#35217 — Remote SSH reconnect
 *            orphans app-server processes
 *   openai/codex#39863 — Remote Codex disconnects
 *   openai/codex#36189 — Remote SSH reconnect loop
 *
 * Verdicts: belayed | gap-short | gap-fatal
 *           | poll-401 | orphaned | sessions-dead
 *           | cred-stale | mem-thrash | offline-lie
 *           | reattach-denied
 * Idle word is belayed (made fast to the
 * bollard; environment retained).
 * NEVER use bollard / empty / silent / mute /
 * idle / dead as idle. NEVER reuse rove, keyed,
 * housed, beamed, snug, hung, appointed,
 * cinched, gauged, stamped, overrun, pratique,
 * wound, bound, stilled, stabled, drained, flat,
 * fit, spoilt, laid, unlinked, tight, banked,
 * roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling,
 * home, valid, dry, sealed, quiet, seised,
 * rung, moored.
 * Do NOT ship Hawser / Hawse / Painter / Kedge /
 * Warp / Berth as the product name. Product
 * name is Bollard only.
 *
 * Slack alarm on orphaned / gap-fatal /
 * sessions-dead / poll-401 / offline-lie /
 * mem-thrash / cred-stale / reattach-denied.
 * Linear ticket on orphaned / gap-fatal /
 * sessions-dead / poll-401.
 * GitHub bollard-ledger of scored piers on
 * every score.
 *
 * Priority when multiple match:
 *   orphaned > gap-fatal > sessions-dead >
 *   poll-401 > offline-lie > mem-thrash >
 *   cred-stale > reattach-denied > gap-short >
 *   belayed
 * Unique nearby flags win their own seeds
 * because those seeds do not carry the
 * orphaned pentad (env deleted / new env id /
 * sessions unresumable). poll-401 seed carries
 * the 401 + same-creds-worked path, not the
 * GC'd environment. gap-fatal seed is a ≥10 s
 * gap without env deletion. sessions-dead seed
 * is N sessions shut down without poll-401.
 *
 * belayed is true ONLY when the environment is
 * retained and sessions are resumable and the
 * verdict is not a failure class.
 *
 * Why this is not a clone:
 * NOT Clew — ARG_MAX / deny-list E2BIG; Bollard
 *     is remote-control environment GC after a
 *     supervisor gap.
 * NOT Sounder — missed background Bash wakeup
 *     notification; Bollard is environment
 *     retention across supervisor absence.
 * NOT Reveille — living muster across
 *     compaction; Bollard is RC environment ID
 *     survival across process restart.
 * NOT Cote — --resume team-hub id vs
 *     conversation id; Bollard is server-side
 *     environment GC vs grace period.
 * NOT Binnacle — TUI origin split /
 *     ANTHROPIC_BASE_URL.
 * NOT Hasp / Wicket / Parity.
 * NOT leftover woodworking / millimetre-slider.
 * Different problem: SUPERVISOR GAP ≥~10 s →
 * SERVER GC → NEW ENVIRONMENT ID → EVERY PRIOR
 * SESSION PERMANENTLY UNRESUMABLE.
 * Different UI: wet pier / bollard plate / quay
 * lamp. Cast iron bollard, hawser eyes, tide
 * marks. NOT sail loft, NOT telegraph desk,
 * NOT brass binnacle, NOT weaver's pirn, NOT
 * hotel key-rack.
 * Different idle: belayed.
 */

export const VERDICTS = Object.freeze([
  "belayed",
  "gap-short",
  "gap-fatal",
  "poll-401",
  "orphaned",
  "sessions-dead",
  "cred-stale",
  "mem-thrash",
  "offline-lie",
  "reattach-denied",
]);
export const IDLE_WORD = "belayed";
export const SLACK_VERDICTS = Object.freeze([
  "orphaned",
  "gap-fatal",
  "sessions-dead",
  "poll-401",
  "offline-lie",
  "mem-thrash",
  "cred-stale",
  "reattach-denied",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "orphaned",
  "gap-fatal",
  "sessions-dead",
  "poll-401",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90581;
export const DEMO_GAP_FATAL_SEC = 10.5;
export const DEMO_GAP_SHORT_SEC = 2;
export const DEMO_SESSIONS_UNRESUMABLE = 14;
export const DEMO_SESSIONS_SHUT_DOWN = 10;
export const DEMO_RSS_GIB = 24.2;
export const DEMO_SWAP_GIB = 2.4;
export const GAP_SHORT_MAX = 3;
export const GAP_FATAL_MIN = 10;
export const MEM_THRASH_RSS_GIB = 20;

const FORBIDDEN_IDLE = Object.freeze([
  "bollard",
  "hawser",
  "hawse",
  "painter",
  "kedge",
  "warp",
  "berth",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "moored",
  "clew",
  "sounder",
  "binnacle",
  "pirn",
  "cotter",
  "fob",
  "ordo",
  "cinch",
  "ullage",
  "visa",
  "sprag",
  "lazaret",
  "fusee",
  "iota",
  "reveille",
  "cote",
  "hasp",
  "wicket",
  "parity",
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

function asCount(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function emptyBollard() {
  return {
    session: "",
    issue: null,
    source: "",
    supervisorGapSec: 0,
    envPreserved: false,
    envDeleted: false,
    newEnvId: false,
    sessionsShutDown: 0,
    sessionsUnresumable: 0,
    poll401: false,
    credsWorkedAfterRestart: false,
    rssGiB: 0,
    swapGiB: 0,
    stillLogging: false,
    serverSaidOffline: false,
    reattachAllowed: true,
    scored: false,
  };
}

export function emptyAction(session = "belayed-1") {
  return {
    action: "score",
    session,
    bollard: emptyBollard(),
  };
}

export function cloneBollard(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyBollard();
  const nested =
    (src.bollard && typeof src.bollard === "object" && src.bollard) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.pier && typeof src.pier === "object" && src.pier) ||
    src;
  const reattachRaw = nested.reattachAllowed ?? src.reattachAllowed;
  return {
    ...emptyBollard(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    supervisorGapSec: asNumber(nested.supervisorGapSec ?? src.supervisorGapSec, 0),
    envPreserved: asBool(nested.envPreserved ?? src.envPreserved, false) === true,
    envDeleted: asBool(nested.envDeleted ?? src.envDeleted, false) === true,
    newEnvId: asBool(nested.newEnvId ?? src.newEnvId, false) === true,
    sessionsShutDown: asCount(nested.sessionsShutDown ?? src.sessionsShutDown),
    sessionsUnresumable: asCount(nested.sessionsUnresumable ?? src.sessionsUnresumable),
    poll401: asBool(nested.poll401 ?? src.poll401, false) === true,
    credsWorkedAfterRestart:
      asBool(nested.credsWorkedAfterRestart ?? src.credsWorkedAfterRestart, false) === true,
    rssGiB: asNumber(nested.rssGiB ?? src.rssGiB, 0),
    swapGiB: asNumber(nested.swapGiB ?? src.swapGiB, 0),
    stillLogging: asBool(nested.stillLogging ?? src.stillLogging, false) === true,
    serverSaidOffline: asBool(nested.serverSaidOffline ?? src.serverSaidOffline, false) === true,
    reattachAllowed: reattachRaw == null ? true : asBool(reattachRaw, true) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(bollard = {}) {
  const next = cloneBollard(bollard);
  const gap = next.supervisorGapSec;
  const orphanedShape =
    next.envDeleted === true || next.newEnvId === true || next.sessionsUnresumable > 0;
  const gapFatalShape =
    gap >= GAP_FATAL_MIN &&
    orphanedShape !== true &&
    next.poll401 !== true;
  const sessionsDeadShape =
    next.sessionsShutDown > 0 &&
    next.poll401 !== true &&
    orphanedShape !== true &&
    gapFatalShape !== true;
  const poll401Shape = next.poll401 === true && orphanedShape !== true;
  const offlineLieShape =
    next.serverSaidOffline === true &&
    next.stillLogging === true &&
    orphanedShape !== true;
  const memThrashShape =
    (next.rssGiB >= MEM_THRASH_RSS_GIB || (next.rssGiB >= 16 && next.swapGiB >= 2)) &&
    orphanedShape !== true &&
    next.serverSaidOffline !== true;
  const credStaleShape =
    next.credsWorkedAfterRestart === true &&
    next.poll401 !== true &&
    orphanedShape !== true;
  const reattachDeniedShape =
    next.reattachAllowed === false &&
    orphanedShape !== true &&
    next.poll401 !== true;
  const gapShortShape =
    gap > 0 &&
    gap <= GAP_SHORT_MAX &&
    next.envPreserved === true &&
    orphanedShape !== true &&
    next.envDeleted !== true &&
    next.poll401 !== true;
  const envRetained =
    next.envDeleted !== true &&
    next.newEnvId !== true &&
    next.sessionsUnresumable <= 0;
  const sessionsResumable = next.sessionsUnresumable <= 0 && next.envDeleted !== true;
  const belayedHold = envRetained && sessionsResumable;
  return {
    supervisorGapSec: gap,
    envPreserved: next.envPreserved,
    envDeleted: next.envDeleted,
    newEnvId: next.newEnvId,
    sessionsShutDown: next.sessionsShutDown,
    sessionsUnresumable: next.sessionsUnresumable,
    poll401: next.poll401,
    credsWorkedAfterRestart: next.credsWorkedAfterRestart,
    rssGiB: next.rssGiB,
    swapGiB: next.swapGiB,
    stillLogging: next.stillLogging,
    serverSaidOffline: next.serverSaidOffline,
    reattachAllowed: next.reattachAllowed,
    orphanedShape,
    gapFatalShape,
    sessionsDeadShape,
    poll401Shape,
    offlineLieShape,
    memThrashShape,
    credStaleShape,
    reattachDeniedShape,
    gapShortShape,
    envRetained,
    sessionsResumable,
    belayedHold,
  };
}

export function isIdle(bollard = {}) {
  const next = cloneBollard(bollard);
  return (
    next.supervisorGapSec <= 0 &&
    next.envPreserved !== true &&
    next.envDeleted !== true &&
    next.newEnvId !== true &&
    next.sessionsShutDown <= 0 &&
    next.sessionsUnresumable <= 0 &&
    next.poll401 !== true &&
    next.credsWorkedAfterRestart !== true &&
    next.rssGiB <= 0 &&
    next.swapGiB <= 0 &&
    next.stillLogging !== true &&
    next.serverSaidOffline !== true &&
    next.reattachAllowed === true
  );
}

/**
 * First match wins by documented priority:
 * orphaned > gap-fatal > sessions-dead > poll-401
 * > offline-lie > mem-thrash > cred-stale >
 * reattach-denied > gap-short > belayed.
 * Idle belayed is first. Seeded #90581 numbers
 * must produce orphaned, never belayed. A slack
 * hawser is not a hold.
 */
export function classify(bollard = {}) {
  const next = cloneBollard(bollard);
  if (isIdle(next)) return "belayed";
  const facts = analyze(next);

  if (facts.orphanedShape) return "orphaned";
  if (facts.gapFatalShape) return "gap-fatal";
  if (facts.sessionsDeadShape) return "sessions-dead";
  if (facts.poll401Shape) return "poll-401";
  if (facts.offlineLieShape) return "offline-lie";
  if (facts.memThrashShape) return "mem-thrash";
  if (facts.credStaleShape) return "cred-stale";
  if (facts.reattachDeniedShape) return "reattach-denied";
  if (facts.gapShortShape) return "gap-short";
  if (facts.belayedHold) return "belayed";
  return "belayed";
}

export function feedOf(bollard = {}, verdict = "") {
  const kind = verdict || classify(bollard);
  if (kind === "orphaned") {
    return "● Orphaned · ~10–11s gap after crash · environment cleaned up · new environment ID · 14 sessions unresumable · mobile environment deleted · primary #90581";
  }
  if (kind === "gap-fatal") {
    return "● Gap-fatal · supervisor absence ≥~10s · server GC'd the environment";
  }
  if (kind === "sessions-dead") {
    return "● Sessions-dead · shutting down N active sessions on supervisor exit";
  }
  if (kind === "poll-401") {
    return "● Poll-401 · Authentication failed 401 on poll · supervisor tore down all sessions · same on-disk credentials worked after restart";
  }
  if (kind === "offline-lie") {
    return "● Offline-lie · server said machine was offline · supervisor alive and journaling continuously";
  }
  if (kind === "mem-thrash") {
    return "● Mem-thrash · 24.2 GiB RSS + 2.4 GiB swap · still logging · missed poll deadlines";
  }
  if (kind === "cred-stale") {
    return "● Cred-stale · running process held an expired token · on-disk credentials were fine";
  }
  if (kind === "reattach-denied") {
    return "● Reattach-denied · restart told to start a fresh environment · cannot re-attach by environment ID";
  }
  if (kind === "gap-short") {
    return "● Gap-short · measured supervisor absence 1–3s · environment preserved · control / proof path · not the failure";
  }
  return "● Belayed · made fast to the bollard · environment retained · sessions resumable · idle word is belayed";
}

export function reasonsOf(bollard = {}, verdict = "") {
  const next = cloneBollard(bollard);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.supervisorGapSec || facts.envDeleted || facts.poll401 || facts.rssGiB
      ? `pier gap ${facts.supervisorGapSec}s · env preserved ${facts.envPreserved ? "yes" : "no"} · env deleted ${facts.envDeleted ? "yes" : "no"} · new env id ${facts.newEnvId ? "yes" : "no"} · shut down ${facts.sessionsShutDown} · unresumable ${facts.sessionsUnresumable} · poll401 ${facts.poll401 ? "yes" : "no"} · rss ${facts.rssGiB} GiB`
      : "hawser taut · bollard standing · environment retained · idle word is belayed",
  );
  if (facts.orphanedShape) {
    reasons.push(
      "environment deleted / new environment ID · prior sessions unresumable · mobile shows environment deleted · transcripts readable but not resumable · the #90581 damage",
    );
  }
  if (facts.supervisorGapSec >= GAP_FATAL_MIN) {
    reasons.push(
      `supervisor absence ${facts.supervisorGapSec}s ≥ ~10s · server GC window · clean 1–3s restarts preserve the environment (~40 observed over 9 days)`,
    );
  }
  if (facts.supervisorGapSec > 0 && facts.supervisorGapSec <= GAP_SHORT_MAX && facts.envPreserved) {
    reasons.push(
      `supervisor absence ${facts.supervisorGapSec}s (1–3s clean restart) · environment preserved · control / proof path`,
    );
  }
  if (facts.poll401) {
    reasons.push(
      "Poll: Authentication failed (401): OAuth access token has expired · supervisor shut down all active sessions and exited · systemd restarted with the same on-disk credentials and attached · credentials were refreshable; the running process held a stale token with no reload path · blast radius was total",
    );
  }
  if (facts.sessionsShutDown > 0) {
    reasons.push(`Shutting down ${facts.sessionsShutDown} active session(s) on supervisor exit`);
  }
  if (facts.sessionsUnresumable > 0) {
    reasons.push(
      `${facts.sessionsUnresumable} sessions unresumable · every previously attached session permanently orphaned`,
    );
  }
  if (facts.credsWorkedAfterRestart) {
    reasons.push(
      "restart with the same on-disk credentials succeeded · no human re-authentication · the running process held a stale token",
    );
  }
  if (facts.rssGiB >= MEM_THRASH_RSS_GIB || (facts.rssGiB >= 16 && facts.swapGiB >= 2)) {
    reasons.push(
      `${facts.rssGiB} GiB RSS + ${facts.swapGiB} GiB swap · process still logging but missing poll deadlines · related to unbounded child unreaping #78778 #85639`,
    );
  }
  if (facts.serverSaidOffline && facts.stillLogging) {
    reasons.push(
      "server said the machine was offline while the supervisor was alive and journaling continuously · 14 sessions ended while this machine was offline",
    );
  }
  if (facts.reattachAllowed === false) {
    reasons.push(
      "Run claude remote-control to start a fresh environment · cannot re-attach by environment ID",
    );
  }
  reasons.push("a slack hawser is not a hold");
  reasons.push(
    "NOT Clew (ARG_MAX / deny-list E2BIG) / Sounder (missed background Bash wakeup) / Reveille (living muster across compaction) / Cote (--resume team-hub id vs conversation id) / Binnacle (TUI origin split / ANTHROPIC_BASE_URL) / Hasp / Wicket / Parity / leftover woodworking / millimetre-slider.",
  );
  if (kind === "belayed") {
    reasons.push(
      "made fast to the bollard; environment retained; sessions resumable; idle word is belayed",
    );
  }
  if (kind === "orphaned") {
    reasons.push(
      "PRIMARY #90581: ~10–11s gap after crash → Restart=always → server GC → new environment ID. 14 sessions unresumable. Mobile: environment deleted. The orphaned case is orphaned, never belayed.",
    );
  }
  if (kind === "gap-fatal") {
    reasons.push("supervisor absence ≥~10s; server GC'd the environment.");
  }
  if (kind === "sessions-dead") {
    reasons.push("N active sessions shut down on supervisor exit.");
  }
  if (kind === "poll-401") {
    reasons.push(
      "401 on poll tore down every session; same credentials worked after restart. Incident A of #90581.",
    );
  }
  if (kind === "offline-lie") {
    reasons.push(
      "server said machine offline while supervisor was alive and journaling. Incident B of #90581.",
    );
  }
  if (kind === "mem-thrash") {
    reasons.push("huge RSS/swap; process still logging but missing poll deadlines.");
  }
  if (kind === "cred-stale") {
    reasons.push("running process held an expired token; on-disk credentials were fine.");
  }
  if (kind === "reattach-denied") {
    reasons.push("restart told to start a fresh environment; cannot re-attach by environment ID.");
  }
  if (kind === "gap-short") {
    reasons.push(
      "measured supervisor absence 1–3s; environment preserved (control / proof path, not the failure).",
    );
  }
  return reasons;
}

export function verdictOf(bollard = {}) {
  return classify(bollard);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function belayedOf(bollard = {}, verdict = "") {
  const kind = verdict || classify(bollard);
  if (SLACK_VERDICTS.includes(kind)) return false;
  const facts = analyze(bollard);
  return facts.envRetained && facts.sessionsResumable;
}

export function orphanedOf(bollard = {}, verdict = "") {
  return (verdict || classify(bollard)) === "orphaned";
}

export function summaryOf(bollard = {}) {
  const next = cloneBollard(bollard);
  const facts = analyze(next);
  return {
    supervisorGapSec: facts.supervisorGapSec,
    envPreserved: facts.envPreserved,
    envDeleted: facts.envDeleted,
    newEnvId: facts.newEnvId,
    sessionsShutDown: facts.sessionsShutDown,
    sessionsUnresumable: facts.sessionsUnresumable,
    poll401: facts.poll401,
    credsWorkedAfterRestart: facts.credsWorkedAfterRestart,
    rssGiB: facts.rssGiB,
    swapGiB: facts.swapGiB,
    stillLogging: facts.stillLogging,
    serverSaidOffline: facts.serverSaidOffline,
    reattachAllowed: facts.reattachAllowed,
  };
}

export function score(bollard = {}) {
  const next = cloneBollard(bollard);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    belayed: belayedOf(next, verdict),
    orphaned: orphanedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    supervisorGapSec: facts.supervisorGapSec,
    envPreserved: facts.envPreserved,
    envDeleted: facts.envDeleted,
    newEnvId: facts.newEnvId,
    sessionsShutDown: facts.sessionsShutDown,
    sessionsUnresumable: facts.sessionsUnresumable,
    poll401: facts.poll401,
    credsWorkedAfterRestart: facts.credsWorkedAfterRestart,
    rssGiB: facts.rssGiB,
    swapGiB: facts.swapGiB,
    stillLogging: facts.stillLogging,
    serverSaidOffline: facts.serverSaidOffline,
    reattachAllowed: facts.reattachAllowed,
    summary: summaryOf(next),
    bollard: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const bollardSrc =
    src.bollard ||
    src.probe ||
    src.payload ||
    src.pier ||
    payload.bollard ||
    payload.probe ||
    payload.pier;
  const bollard = cloneBollard(
    bollardSrc && typeof bollardSrc === "object" ? { ...bollardSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !bollard.session) bollard.session = src.session;
  if (typeof payload.session === "string" && !bollard.session) bollard.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? bollard.session ?? ""),
    bollard,
    issue: src.issue ?? payload.issue ?? bollard.issue ?? null,
    source: src.source ?? payload.source ?? bollard.source ?? "",
  };
}

function bollardResult(verdict, bollard, action, extras = {}) {
  const next = cloneBollard(bollard);
  const scored = score(next);
  return {
    ok: true,
    product: "bollard",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    belayed: scored.belayed,
    orphaned: scored.orphaned,
    bollardBelayed: verdict === "belayed",
    bollardGapShort: verdict === "gap-short",
    bollardGapFatal: verdict === "gap-fatal",
    bollardPoll401: verdict === "poll-401",
    bollardOrphaned: verdict === "orphaned",
    bollardSessionsDead: verdict === "sessions-dead",
    bollardCredStale: verdict === "cred-stale",
    bollardMemThrash: verdict === "mem-thrash",
    bollardOfflineLie: verdict === "offline-lie",
    bollardReattachDenied: verdict === "reattach-denied",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    supervisorGapSec: scored.supervisorGapSec,
    envPreserved: scored.envPreserved,
    envDeleted: scored.envDeleted,
    newEnvId: scored.newEnvId,
    sessionsShutDown: scored.sessionsShutDown,
    sessionsUnresumable: scored.sessionsUnresumable,
    poll401: scored.poll401,
    credsWorkedAfterRestart: scored.credsWorkedAfterRestart,
    rssGiB: scored.rssGiB,
    swapGiB: scored.swapGiB,
    stillLogging: scored.stillLogging,
    serverSaidOffline: scored.serverSaidOffline,
    reattachAllowed: scored.reattachAllowed,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    bollard: next,
    ...extras,
  };
}

function seedBollard(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    bollard: {
      ...emptyBollard(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      supervisorGapSec: asNumber(extras.supervisorGapSec, 0),
      envPreserved: Boolean(extras.envPreserved),
      envDeleted: Boolean(extras.envDeleted),
      newEnvId: Boolean(extras.newEnvId),
      sessionsShutDown: asCount(extras.sessionsShutDown),
      sessionsUnresumable: asCount(extras.sessionsUnresumable),
      poll401: Boolean(extras.poll401),
      credsWorkedAfterRestart: Boolean(extras.credsWorkedAfterRestart),
      rssGiB: asNumber(extras.rssGiB, 0),
      swapGiB: asNumber(extras.swapGiB, 0),
      stillLogging: Boolean(extras.stillLogging),
      serverSaidOffline: Boolean(extras.serverSaidOffline),
      reattachAllowed: extras.reattachAllowed == null ? true : Boolean(extras.reattachAllowed),
    },
  };
}

/** Idle reset. Hawser taut. Bollard standing. Environment retained. */
export function seedBelayed() {
  return seedBollard("belayed", "pier", {
    session: "belayed",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedBelayed();
}

/**
 * Control / proof: 1–3s clean restart, environment
 * preserved. Classifies as gap-short; belayed true.
 */
export function seedGapShort() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-gap-short",
    issue: null,
    supervisorGapSec: DEMO_GAP_SHORT_SEC,
    envPreserved: true,
    envDeleted: false,
    newEnvId: false,
    reattachAllowed: true,
  });
}

export function seedControl() {
  return seedGapShort();
}

/**
 * #90581 orphaned: ~10–11s gap after crash,
 * environment cleaned up, new environment ID,
 * 14 sessions unresumable, mobile "environment
 * deleted". A slack hawser is not a hold. The
 * orphaned case is orphaned, never belayed.
 */
export function seedOrphaned() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-orphaned",
    supervisorGapSec: DEMO_GAP_FATAL_SEC,
    envPreserved: false,
    envDeleted: true,
    newEnvId: true,
    sessionsUnresumable: DEMO_SESSIONS_UNRESUMABLE,
    reattachAllowed: false,
  });
}

export function seed90581() {
  return seedOrphaned();
}

/**
 * Incident A: 401 on poll, 10 sessions shut down,
 * restart with the same on-disk credentials
 * succeeds. Unique flags: poll401 +
 * credsWorkedAfterRestart. Does not carry the
 * orphaned pentad.
 */
export function seedPoll401() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-poll-401",
    supervisorGapSec: 14,
    envPreserved: false,
    envDeleted: false,
    newEnvId: false,
    sessionsShutDown: DEMO_SESSIONS_SHUT_DOWN,
    poll401: true,
    credsWorkedAfterRestart: true,
  });
}

/**
 * 24.2 GiB RSS + 2.4 GiB swap, still logging.
 * Unique flags: huge RSS/swap without
 * serverSaidOffline (that is offline-lie) and
 * without the orphaned pentad.
 */
export function seedMemThrash() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-mem-thrash",
    rssGiB: DEMO_RSS_GIB,
    swapGiB: DEMO_SWAP_GIB,
    stillLogging: true,
    serverSaidOffline: false,
  });
}

/**
 * Server said "machine was offline" while the
 * journal was continuous. Unique flags:
 * serverSaidOffline + stillLogging without the
 * orphaned pentad.
 */
export function seedOfflineLie() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-offline-lie",
    stillLogging: true,
    serverSaidOffline: true,
  });
}

/** Supervisor absence ≥10s without env deletion. */
export function seedGapFatal() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-gap-fatal",
    supervisorGapSec: 11,
    envPreserved: false,
    envDeleted: false,
    newEnvId: false,
  });
}

/** Shutting down N active sessions, no poll-401. */
export function seedSessionsDead() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-sessions-dead",
    sessionsShutDown: DEMO_SESSIONS_SHUT_DOWN,
    poll401: false,
  });
}

/**
 * Token expired in-process; disk creds fine.
 * Unique flags: credsWorkedAfterRestart without
 * poll401.
 */
export function seedCredStale() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-cred-stale",
    credsWorkedAfterRestart: true,
    poll401: false,
  });
}

/**
 * Restart told to start a fresh environment.
 * Cannot re-attach by environment ID.
 */
export function seedReattachDenied() {
  return seedBollard(FEATURED_ISSUE, "anthropics/claude-code#90581", {
    session: "90581-reattach-denied",
    reattachAllowed: false,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyBollard();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneBollard({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneBollard({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const orphaned =
    /environment deleted|new environment ID|14 sessions unresumable|#90581/i.test(text) &&
    /orphan|cleaned up|unresumable|10–11|10-11/i.test(text);
  const poll401 = /Authentication failed \(401\)|poll-401|OAuth access token has expired/i.test(text);
  const memThrash = /24\.2 GiB|24\.2G|mem-thrash|2\.4 GiB swap/i.test(text);
  const offlineLie =
    /machine was offline|offline-lie|journal continuous|3,558 journal/i.test(text);
  const gapFatal = /gap-fatal|supervisor absence ≥|gap ≥~?10|≥~10s|>=\s*10/i.test(text);
  const sessionsDead = /Shutting down \d+ active session|sessions-dead/i.test(text);
  const credStale = /cred-stale|stale token|on-disk credentials were fine/i.test(text);
  const reattachDenied =
    /start a fresh environment|reattach-denied|cannot re-attach/i.test(text);
  const gapShort =
    /1–3s|1-3s|gap-short|environment preserved|clean restart/i.test(text);
  const belayed = /admit belayed|made fast to the bollard|hawser taut/i.test(text);

  if (orphaned) {
    return {
      ...seedOrphaned().bollard,
      session: "paste-orphaned",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (poll401) {
    return {
      ...seedPoll401().bollard,
      session: "paste-poll-401",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (offlineLie) {
    return {
      ...seedOfflineLie().bollard,
      session: "paste-offline-lie",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (memThrash) {
    return {
      ...seedMemThrash().bollard,
      session: "paste-mem-thrash",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (gapFatal) {
    return {
      ...seedGapFatal().bollard,
      session: "paste-gap-fatal",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (sessionsDead) {
    return {
      ...seedSessionsDead().bollard,
      session: "paste-sessions-dead",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (credStale) {
    return {
      ...seedCredStale().bollard,
      session: "paste-cred-stale",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (reattachDenied) {
    return {
      ...seedReattachDenied().bollard,
      session: "paste-reattach-denied",
      source: "anthropics/claude-code#90581",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (gapShort) {
    return {
      ...seedGapShort().bollard,
      session: "paste-gap-short",
      source: "paste",
      scored: true,
    };
  }
  if (belayed) {
    return { ...seedBelayed().bollard, session: "paste-belayed", source: "paste", scored: true };
  }
  return { ...emptyBollard(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  belayed: seedBelayed,
  control: seedControl,
  "gap-short": seedGapShort,
  gapshort: seedGapShort,
  orphaned: seedOrphaned,
  90581: seed90581,
  "90581-orphaned": seedOrphaned,
  "poll-401": seedPoll401,
  poll401: seedPoll401,
  "mem-thrash": seedMemThrash,
  memthrash: seedMemThrash,
  "offline-lie": seedOfflineLie,
  offlinelie: seedOfflineLie,
  "gap-fatal": seedGapFatal,
  gapfatal: seedGapFatal,
  "sessions-dead": seedSessionsDead,
  sessionsdead: seedSessionsDead,
  "cred-stale": seedCredStale,
  credstale: seedCredStale,
  "reattach-denied": seedReattachDenied,
  reattachdenied: seedReattachDenied,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  pier: seedControl,
  plate: seedControl,
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
  let bollard = cloneBollard(action.bollard);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "belayed" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return bollardResult("belayed", emptyBollard(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "pier" || verb === "plate") {
    bollard = seedControl().bollard;
    return bollardResult(classify(bollard), bollard, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "orphaned" || verb === "incident" || verb === "90581") {
    bollard = seedOrphaned().bollard;
    return bollardResult(classify(bollard), bollard, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "belay" || verb === "make-fast") {
    bollard = { ...bollard, scored: true };
    return bollardResult(classify(bollard), bollard, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    bollard = { ...bollard, scored: true };
    return bollardResult(classify(bollard), bollard, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  bollard = { ...bollard, scored: true };
  return bollardResult(classify(bollard), bollard, action);
}
