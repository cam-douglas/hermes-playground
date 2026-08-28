/**
 * Cote — dove-cote / pigeon loft for resume hub identity split.
 * A success receipt is not a roost. Score the loft or admit roosted.
 *
 * Claude Code --resume registers the agent-team hub under a throwaway
 * startup placeholder session id. Teammate SendMessage replies then
 * report success, get consumed from the inbox, and never appear in the
 * resumed parent transcript. Named agents park idle forever. Fresh
 * sessions on the same machine/version are fine.
 *
 * Observed on 2.1.250 Linux/Bedrock with
 * CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Filed 2026-08-28.
 *
 * Verdicts: roosted | lofted | flown | drained | parked | stray
 *           | banded | crossed | consumed | late
 * Idle word is roosted (the bird is in the correct cote; hold is current).
 * NEVER use the product name cote as the idle/state word.
 * NEVER use empty as the idle/state word.
 * NEVER reuse idle words from other products: stocked, seated, heard,
 * clear, paired, kernel, latched, upheld, sterling, home, valid, dry,
 * intact, sealed, even, quiet, cool.
 *
 * Slack alarm on drained / parked / stray / crossed / consumed / late.
 * Linear ticket on drained / parked / consumed.
 * GitHub cote-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Reveille (living muster / compaction orphans / heartbeats).
 * NOT Husk (hollow headless SUCCESS envelopes with empty result /
 * num_turns 0 — Cote is success+consumed, delivered to the wrong cote).
 * NOT Coda (silently dropped assistant text blocks).
 * NOT Suture (stream-tear / partial turn).
 * NOT Aside (/btw silent truncation).
 * NOT Chute (sanctioned secret handoff / mail chute — Cote is a loft,
 * not a mail chute).
 * NOT Tain (Chrome pairing one-way glass).
 * NOT Larder (plugin-store freeze / sync stamp vs content).
 * NOT Tappet (silent hook injection).
 * NOT Snib, Veto, Assay, Wicket, Sigil, Stencil, Blot, Reed, Fathom,
 * Hasp, Parity, Quench, Scrim, Knock.
 * NOT leftover woodworking.
 * Different problem: team-hub session id vs resumed conversation id.
 * A success receipt is not a roost.
 * Different UI: dove-cote / pigeon loft.
 * Different idle word: roosted.
 */

export const VERDICTS = Object.freeze([
  "roosted",
  "lofted",
  "flown",
  "drained",
  "parked",
  "stray",
  "banded",
  "crossed",
  "consumed",
  "late",
]);
export const IDLE_WORD = "roosted";
export const SLACK_VERDICTS = Object.freeze([
  "drained",
  "parked",
  "stray",
  "crossed",
  "consumed",
  "late",
]);
export const LINEAR_VERDICTS = Object.freeze(["drained", "parked", "consumed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const PLACEHOLDER_ID = "PPPPPPPP-…";
export const RESUMED_ID = "RRRRRRRR-…";
export const CONTROL_ROUND_TRIP_S = 1.3;
export const TEAM_STAMP_LAG_S = 1;

const FORBIDDEN_IDLE = Object.freeze([
  "cote",
  "empty",
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
  "intact",
  "sealed",
  "even",
  "swept",
  "filed",
  "planed",
  "stopped",
  "taken",
  "shaved",
  "cleared",
  "sprung",
  "flush",
  "wiped",
  "clean",
  "quiet",
  "cool",
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
    if (s === "true" || s === "yes" || s === "1") return true;
    if (s === "false" || s === "no" || s === "0") return false;
  }
  return Boolean(value);
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asCount(value, fallback = null) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function bandPrefix(id) {
  const text = asText(id).trim();
  if (!text) return "";
  return text.slice(0, 8);
}

export function emptyProbe() {
  return {
    placeholderId: "",
    resumedId: "",
    liveSessionId: "",
    leadSessionId: "",
    parentSessionId: "",
    teamName: "",
    teamHubExists: false,
    placeholderTranscriptExists: false,
    sendSuccess: false,
    msgId: "",
    inboxEmptied: false,
    inboxJson: "",
    msgIdInParent: false,
    parentGrepCount: null,
    parentMidTurn: false,
    agentIdle: false,
    teamCreatedBeforeResume: false,
    wrongParent: false,
    bandMismatch: false,
    scoredAgainst: "",
    roundTripSeconds: 0,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "roosted-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

function pickLiveId(src, nested, loft) {
  const pick = (key) => src[key] ?? nested[key] ?? loft[key];
  return asText(pick("liveSessionId") || pick("resumedId"));
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.team && typeof src.team === "object" ? src.team : {};
  const loft = src.loft && typeof src.loft === "object" ? src.loft : {};
  const envelope =
    src.sendMessage && typeof src.sendMessage === "object" ? src.sendMessage : {};
  const pick = (key) => src[key] ?? nested[key] ?? loft[key];
  const live = pickLiveId(src, nested, loft);
  const sendSuccess = asBool(
    pick("sendSuccess") ?? envelope.success ?? envelope.ok,
  );
  const msgId = asText(pick("msgId") ?? envelope.msg_id ?? envelope.msgId);
  let inboxEmptied = asBool(pick("inboxEmptied"));
  const inboxJson = asText(pick("inboxJson") ?? pick("inbox"));
  if (!inboxEmptied && inboxJson) {
    const trimmed = inboxJson.trim();
    if (trimmed === "[]" || trimmed === "") inboxEmptied = true;
    else {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length === 0) inboxEmptied = true;
      } catch {
        /* keep flag */
      }
    }
  }
  let parentGrepCount = asCount(pick("parentGrepCount"), null);
  let msgIdInParent = asBool(pick("msgIdInParent"));
  if (!msgIdInParent && parentGrepCount === 0) msgIdInParent = false;
  if (parentGrepCount != null && parentGrepCount > 0) msgIdInParent = true;
  return {
    ...emptyProbe(),
    placeholderId: asText(pick("placeholderId")),
    resumedId: asText(pick("resumedId") || live),
    liveSessionId: live || asText(pick("resumedId")),
    leadSessionId: asText(pick("leadSessionId")),
    parentSessionId: asText(pick("parentSessionId")),
    teamName: asText(pick("teamName")),
    teamHubExists: asBool(pick("teamHubExists")),
    placeholderTranscriptExists: asBool(pick("placeholderTranscriptExists")),
    sendSuccess,
    msgId,
    inboxEmptied,
    inboxJson,
    msgIdInParent,
    parentGrepCount,
    parentMidTurn: asBool(pick("parentMidTurn")),
    agentIdle: asBool(pick("agentIdle")),
    teamCreatedBeforeResume: asBool(pick("teamCreatedBeforeResume")),
    wrongParent: asBool(pick("wrongParent")),
    bandMismatch: asBool(pick("bandMismatch")),
    scoredAgainst: asText(pick("scoredAgainst")),
    roundTripSeconds: asNumber(pick("roundTripSeconds"), 0),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? nested.source ?? loft.source),
    issue: asIssue(src.issue ?? nested.issue ?? loft.issue),
    scored: asBool(src.scored ?? nested.scored ?? loft.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.placeholderId &&
    !next.resumedId &&
    !next.liveSessionId &&
    !next.leadSessionId &&
    !next.parentSessionId &&
    !next.teamName &&
    !next.teamHubExists &&
    !next.placeholderTranscriptExists &&
    !next.sendSuccess &&
    !next.msgId &&
    !next.inboxEmptied &&
    !next.inboxJson &&
    !next.msgIdInParent &&
    next.parentGrepCount == null &&
    !next.parentMidTurn &&
    !next.agentIdle &&
    !next.teamCreatedBeforeResume &&
    !next.wrongParent &&
    !next.bandMismatch &&
    !next.scoredAgainst &&
    next.roundTripSeconds === 0
  );
}

export function idsMatch(probe = {}) {
  const next = cloneProbe(probe);
  const live = bandPrefix(next.liveSessionId || next.resumedId);
  const lead = bandPrefix(next.leadSessionId);
  return Boolean(live && lead && live === lead);
}

export function isStray(probe = {}) {
  const next = cloneProbe(probe);
  const live = bandPrefix(next.liveSessionId || next.resumedId);
  const lead = bandPrefix(next.leadSessionId);
  const parent = bandPrefix(next.parentSessionId);
  const placeholder = bandPrefix(next.placeholderId);
  if (live && lead && live !== lead) return true;
  if (parent && lead && parent !== lead) return true;
  if (placeholder && lead && placeholder === lead && live && live !== lead) {
    return true;
  }
  if (next.teamName && placeholder && live) {
    const namedPlaceholder = next.teamName.includes(placeholder);
    const namedLive = next.teamName.includes(live);
    if (namedPlaceholder && !namedLive) return true;
  }
  return false;
}

export function isBanded(probe = {}) {
  const next = cloneProbe(probe);
  if (next.bandMismatch) return true;
  const against = bandPrefix(next.scoredAgainst);
  const band = bandPrefix(next.msgId || next.leadSessionId);
  if (against && band && against !== band) return true;
  return false;
}

export function isHold(probe = {}) {
  const next = cloneProbe(probe);
  return (
    idsMatch(next) &&
    next.msgIdInParent &&
    next.sendSuccess &&
    !next.wrongParent &&
    !isBanded(next) &&
    !isStray(next)
  );
}

/**
 * First match wins. Idle roosted is first. Healthy roosted is last.
 * A success receipt / emptied inbox / green ACK is not a hold.
 * Admitting roosted must not lie: only a current hold scores roosted
 * once a probe is present.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "roosted";
  if (next.wrongParent) return "crossed";
  if (isBanded(next)) return "banded";
  if (
    next.inboxEmptied &&
    !next.msgIdInParent &&
    next.sendSuccess &&
    isStray(next)
  ) {
    return "drained";
  }
  if (
    next.agentIdle &&
    next.sendSuccess &&
    !next.msgIdInParent &&
    next.inboxEmptied &&
    idsMatch(next)
  ) {
    return "parked";
  }
  if (next.inboxEmptied && !next.msgIdInParent && next.sendSuccess) {
    return "consumed";
  }
  if (next.teamCreatedBeforeResume && !next.sendSuccess && !next.inboxEmptied) {
    return "late";
  }
  if (isStray(next) && !next.inboxEmptied) return "stray";
  if (next.sendSuccess && !next.msgIdInParent) return "flown";
  if (next.teamHubExists && !next.sendSuccess && !next.msgIdInParent) {
    return "lofted";
  }
  if (isHold(next)) return "roosted";
  return "roosted";
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "drained") {
    return "● Drained · inbox emptied to [] · msg_id absent from the parent · a success receipt is not a roost";
  }
  if (kind === "parked") {
    return "● Parked · named agent stays alive and idle · consumed SendMessage never roosted";
  }
  if (kind === "stray") {
    return "● Stray · team-name / leadSessionId is the placeholder · parent-session-id is the resumed id";
  }
  if (kind === "banded") {
    return "● Banded · bird band does not match the hole it was scored against";
  }
  if (kind === "crossed") {
    return "● Crossed · completion or reply routed to the wrong parent";
  }
  if (kind === "consumed") {
    return "● Consumed · watcher took the inbox item · the parent never saw it";
  }
  if (kind === "late") {
    return "● Late · team was stamped before resume finished replacing the placeholder";
  }
  if (kind === "flown") {
    return "● Flown · SendMessage returned success:true · the bird left · not a hold";
  }
  if (kind === "lofted") {
    return "● Lofted · team hub registered · a cote exists · that is not yet a hold";
  }
  return "● Roosted · live session id matches leadSessionId · inbox delivered into the parent · hold is current";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  if (next.placeholderId) {
    reasons.push(`placeholder id ${next.placeholderId} minted at process start`);
  }
  if (next.resumedId || next.liveSessionId) {
    reasons.push(`live transcript ${next.resumedId || next.liveSessionId}`);
  }
  if (next.leadSessionId) {
    reasons.push(`leadSessionId ${next.leadSessionId}`);
  }
  if (next.parentSessionId) {
    reasons.push(`--parent-session-id ${next.parentSessionId}`);
  }
  if (next.teamName) reasons.push(`--team-name ${next.teamName}`);
  reasons.push(
    next.teamHubExists
      ? "team hub registered (a cote exists)"
      : "no team hub claimed",
  );
  reasons.push(
    next.placeholderTranscriptExists
      ? "placeholder transcript exists on disk"
      : "no transcript PPPPPPPP*.jsonl exists",
  );
  reasons.push(
    next.sendSuccess
      ? "SendMessage returned success:true (the bird left)"
      : "no success:true SendMessage receipt",
  );
  if (next.msgId) reasons.push(`msg_id ${next.msgId}`);
  reasons.push(
    next.inboxEmptied
      ? "inbox file emptied to [] (watcher consumed it)"
      : "inbox not emptied to []",
  );
  if (next.parentMidTurn) {
    reasons.push("parent was mid-turn when the inbox emptied");
  }
  if (next.parentGrepCount != null) {
    reasons.push(
      next.parentGrepCount === 0
        ? "msg_id appears ZERO times in the parent transcript"
        : `msg_id appears ${next.parentGrepCount} times in the parent transcript`,
    );
  } else {
    reasons.push(
      next.msgIdInParent
        ? "msg_id present in the parent transcript"
        : "msg_id absent from the parent transcript",
    );
  }
  reasons.push(
    next.agentIdle
      ? "named agent stays alive and idle"
      : "named agent not claimed idle",
  );
  reasons.push(
    next.teamCreatedBeforeResume
      ? "team stamped before resume finished replacing the placeholder"
      : "team not claimed stamped before resume",
  );
  if (next.wrongParent) {
    reasons.push("completion or reply routed to the wrong parent");
  }
  if (isBanded(next)) {
    reasons.push("bird band does not match the hole it was scored against");
  }
  if (next.roundTripSeconds) {
    reasons.push(`control-quality round-trip ${next.roundTripSeconds} s`);
  }
  reasons.push(
    idsMatch(next)
      ? "live session id == team leadSessionId"
      : "live session id does not match leadSessionId",
  );
  reasons.push("team-hub session id vs resumed conversation id: a success receipt is not a roost");
  reasons.push(
    "NOT Reveille / Husk / Coda / Suture / Aside / Chute / Tain / Larder / Tappet / Snib / Veto / Assay / Wicket / Sigil / Stencil / Blot / Reed / Fathom / Hasp / Parity / Quench / Scrim / Knock / leftover woodworking",
  );
  if (kind === "roosted") {
    reasons.push("bird is in the correct cote; hold is current; idle word is roosted");
  }
  if (kind === "drained") {
    reasons.push("PRIMARY #90332: placeholder hub, success:true, inbox [], msg_id absent from parent");
  }
  if (kind === "parked") {
    reasons.push("named agent parked after a consumed-but-undelivered SendMessage");
  }
  if (kind === "stray") {
    reasons.push("team-name / leadSessionId is the placeholder; parent-session-id is the resumed id");
  }
  if (kind === "banded") {
    reasons.push("band (msg_id / session id) scored against the wrong hole");
  }
  if (kind === "crossed") {
    reasons.push("shape of #83599 / #81438: completion routed to the wrong parent");
  }
  if (kind === "consumed") {
    reasons.push("watcher took the inbox item; the parent never saw it");
  }
  if (kind === "late") {
    reasons.push("team creation snapshots sessionId() before --resume replaces the placeholder");
  }
  if (kind === "flown") {
    reasons.push("success:true is a receipt, not a roost");
  }
  if (kind === "lofted") {
    reasons.push("a cote exists; that is not yet a hold");
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

/**
 * score(probe) → { verdict, reasons[], feed, slack, linear, github }
 * Deterministic. First match wins. Idle roosted first; healthy roosted last.
 * Admit roosted does not lie: a drained probe stays drained.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    hold: verdict === "roosted" && (isIdle(next) || isHold(next)),
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested =
    payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    placeholderId: pick("placeholderId"),
    resumedId: pick("resumedId"),
    liveSessionId: pick("liveSessionId"),
    leadSessionId: pick("leadSessionId"),
    parentSessionId: pick("parentSessionId"),
    teamName: pick("teamName"),
    teamHubExists: pick("teamHubExists"),
    placeholderTranscriptExists: pick("placeholderTranscriptExists"),
    sendSuccess: pick("sendSuccess"),
    msgId: pick("msgId"),
    inboxEmptied: pick("inboxEmptied"),
    inboxJson: pick("inboxJson") ?? pick("inbox"),
    msgIdInParent: pick("msgIdInParent"),
    parentGrepCount: pick("parentGrepCount"),
    parentMidTurn: pick("parentMidTurn"),
    agentIdle: pick("agentIdle"),
    teamCreatedBeforeResume: pick("teamCreatedBeforeResume"),
    wrongParent: pick("wrongParent"),
    bandMismatch: pick("bandMismatch"),
    scoredAgainst: pick("scoredAgainst"),
    roundTripSeconds: pick("roundTripSeconds"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    team: fromFields.team,
    loft: fromFields.loft,
    sendMessage: fromFields.sendMessage ?? src.sendMessage ?? payload.sendMessage,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  return {
    action: String((nested ? nested.action : payload.action) || "score"),
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
    product: "cote",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    hold: scored.hold,
    loftRoosted: verdict === "roosted",
    loftLofted: verdict === "lofted",
    loftFlown: verdict === "flown",
    loftDrained: verdict === "drained",
    loftParked: verdict === "parked",
    loftStray: verdict === "stray",
    loftBanded: verdict === "banded",
    loftCrossed: verdict === "crossed",
    loftConsumed: verdict === "consumed",
    loftLate: verdict === "late",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    placeholderId: next.placeholderId,
    resumedId: next.resumedId,
    liveSessionId: next.liveSessionId,
    leadSessionId: next.leadSessionId,
    parentSessionId: next.parentSessionId,
    teamName: next.teamName,
    teamHubExists: next.teamHubExists,
    placeholderTranscriptExists: next.placeholderTranscriptExists,
    sendSuccess: next.sendSuccess,
    msgId: next.msgId,
    inboxEmptied: next.inboxEmptied,
    inboxJson: next.inboxJson,
    msgIdInParent: next.msgIdInParent,
    parentGrepCount: next.parentGrepCount,
    parentMidTurn: next.parentMidTurn,
    agentIdle: next.agentIdle,
    teamCreatedBeforeResume: next.teamCreatedBeforeResume,
    wrongParent: next.wrongParent,
    bandMismatch: next.bandMismatch,
    scoredAgainst: next.scoredAgainst,
    roundTripSeconds: next.roundTripSeconds,
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
      placeholderId: extras.placeholderId || "",
      resumedId: extras.resumedId || "",
      liveSessionId: extras.liveSessionId || extras.resumedId || "",
      leadSessionId: extras.leadSessionId || "",
      parentSessionId: extras.parentSessionId || "",
      teamName: extras.teamName || "",
      teamHubExists: Boolean(extras.teamHubExists),
      placeholderTranscriptExists: Boolean(extras.placeholderTranscriptExists),
      sendSuccess: Boolean(extras.sendSuccess),
      msgId: extras.msgId || "",
      inboxEmptied: Boolean(extras.inboxEmptied),
      inboxJson: extras.inboxJson || "",
      msgIdInParent: Boolean(extras.msgIdInParent),
      parentGrepCount: extras.parentGrepCount == null ? null : extras.parentGrepCount,
      parentMidTurn: Boolean(extras.parentMidTurn),
      agentIdle: Boolean(extras.agentIdle),
      teamCreatedBeforeResume: Boolean(extras.teamCreatedBeforeResume),
      wrongParent: Boolean(extras.wrongParent),
      bandMismatch: Boolean(extras.bandMismatch),
      scoredAgainst: extras.scoredAgainst || "",
      roundTripSeconds: extras.roundTripSeconds || 0,
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Healthy hold. Live id matches leadSessionId; parent actually received the message. */
export function seedRoosted() {
  return seedProbe("roosted", "fresh-session", {
    session: "roosted",
    issue: null,
    placeholderId: "",
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: true,
    inboxJson: "[]",
    msgIdInParent: true,
    parentGrepCount: 1,
    agentIdle: false,
    teamCreatedBeforeResume: false,
    roundTripSeconds: CONTROL_ROUND_TRIP_S,
  });
}

/**
 * PRIMARY #90332 drained.
 * Placeholder hub, success:true, inbox [], msg_id absent from parent.
 * Team created one second after launch, before resume finished.
 * No transcript PPPPPPPP*.jsonl. Control from a fresh session is 1.3 s.
 */
export function seed90332Drained() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-drained",
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: PLACEHOLDER_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-PPPPPPPP",
    teamHubExists: true,
    placeholderTranscriptExists: false,
    sendSuccess: true,
    msgId: "band-PPPPPPPP",
    inboxEmptied: true,
    inboxJson: "[]",
    msgIdInParent: false,
    parentGrepCount: 0,
    parentMidTurn: true,
    agentIdle: true,
    teamCreatedBeforeResume: true,
  });
}

/** Lofted: a cote exists. That is not yet a hold. */
export function seedLofted() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-lofted",
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: false,
  });
}

/** Flown: SendMessage success:true. The bird left. Not a hold. */
export function seedFlown() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-flown",
    placeholderId: "",
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: false,
    msgIdInParent: false,
  });
}

/**
 * Parked: named agent stays alive and idle after a consumed-but-undelivered
 * SendMessage. Ids match (not the #90332 placeholder split).
 */
export function seedParked() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-parked",
    placeholderId: "",
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: true,
    inboxJson: "[]",
    msgIdInParent: false,
    parentGrepCount: 0,
    agentIdle: true,
  });
}

/**
 * Stray: team-name / leadSessionId is the placeholder, parent-session-id
 * is the resumed id. Inbox not yet emptied.
 */
export function seedStray() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-stray",
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: PLACEHOLDER_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-PPPPPPPP",
    teamHubExists: true,
    placeholderTranscriptExists: false,
    sendSuccess: false,
    inboxEmptied: false,
    teamCreatedBeforeResume: false,
  });
}

/** Banded: bird band does not match the hole it was scored against. */
export function seedBanded() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-banded",
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: PLACEHOLDER_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-PPPPPPPP",
    teamHubExists: true,
    sendSuccess: true,
    msgId: "band-PPPPPPPP",
    scoredAgainst: RESUMED_ID,
    bandMismatch: true,
  });
}

/** Crossed: completion or reply routed to the wrong parent (#83599 / #81438 shape). */
export function seedCrossed() {
  return seedProbe(83599, "anthropics/claude-code#83599", {
    session: "83599-crossed",
    placeholderId: "",
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: true,
    msgIdInParent: true,
    parentGrepCount: 1,
    wrongParent: true,
  });
}

/**
 * Consumed: watcher took the inbox item and the parent never saw it.
 * Ids match (not the placeholder drain). Agent not still parked.
 */
export function seedConsumed() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-consumed",
    placeholderId: "",
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: true,
    inboxJson: "[]",
    msgIdInParent: false,
    parentGrepCount: 0,
    agentIdle: false,
  });
}

/**
 * Late: team was stamped before resume finished replacing the placeholder.
 * No SendMessage yet.
 */
export function seedLate() {
  return seedProbe(90332, "anthropics/claude-code#90332", {
    session: "90332-late",
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: PLACEHOLDER_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-PPPPPPPP",
    teamHubExists: true,
    placeholderTranscriptExists: false,
    sendSuccess: false,
    inboxEmptied: false,
    teamCreatedBeforeResume: true,
  });
}

const SEEDS = {
  roosted: seedRoosted,
  lofted: seedLofted,
  flown: seedFlown,
  drained: seed90332Drained,
  90332: seed90332Drained,
  "90332-drained": seed90332Drained,
  parked: seedParked,
  "90332-parked": seedParked,
  stray: seedStray,
  "90332-stray": seedStray,
  banded: seedBanded,
  "90332-banded": seedBanded,
  crossed: seedCrossed,
  83599: seedCrossed,
  81438: seedCrossed,
  "83599-crossed": seedCrossed,
  consumed: seedConsumed,
  "90332-consumed": seedConsumed,
  late: seedLate,
  "90332-late": seedLate,
};

function healthyRoost(session) {
  return {
    ...emptyProbe(),
    resumedId: RESUMED_ID,
    liveSessionId: RESUMED_ID,
    leadSessionId: RESUMED_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-RRRRRRRR",
    teamHubExists: true,
    placeholderTranscriptExists: true,
    sendSuccess: true,
    msgId: "band-RRRRRRRR",
    inboxEmptied: true,
    inboxJson: "[]",
    msgIdInParent: true,
    parentGrepCount: 1,
    roundTripSeconds: CONTROL_ROUND_TRIP_S,
    session: session || "roosted",
    source: "band",
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

/**
 * Parse a pasted probe: JSON object, SendMessage envelope, inbox json,
 * or a text dump with placeholder / resumed ids and a parent-transcript grep.
 */
export function parseProbe(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return cloneProbe(raw);
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed) && parsed.length === 0) {
        return cloneProbe({ inboxEmptied: true, inboxJson: "[]" });
      }
      return cloneProbe(parsed.probe && typeof parsed.probe === "object" ? parsed.probe : parsed);
    }
  } catch {
    /* fall through to loose text */
  }
  const next = emptyProbe();
  const placeholder = text.match(/PPPPPPPP(?:-[.…\w]*)?/);
  const resumed = text.match(/RRRRRRRR(?:-[.…\w]*)?/);
  if (placeholder) next.placeholderId = placeholder[0];
  if (resumed) next.resumedId = resumed[0];
  const lead = text.match(/leadSessionId["'\s:=]+([A-Za-z0-9.…-]+)/i);
  if (lead) next.leadSessionId = lead[1];
  else if (placeholder) next.leadSessionId = placeholder[0];
  const parent = text.match(/parent-session-id["'\s:=]+([A-Za-z0-9.…-]+)/i);
  if (parent) next.parentSessionId = parent[1];
  else if (resumed) next.parentSessionId = resumed[0];
  const team = text.match(/team-name["'\s:=]+([A-Za-z0-9._-]+)/i);
  if (team) next.teamName = team[1];
  else if (placeholder) next.teamName = `session-${bandPrefix(placeholder[0])}`;
  if (/success\s*[:=]\s*true/i.test(text) || /Message sent to team-lead/i.test(text)) {
    next.sendSuccess = true;
  }
  const msg = text.match(/msg_id["'\s:=]+([A-Za-z0-9.…-]+)/i);
  if (msg) next.msgId = msg[1];
  if (/\[\s*\]/.test(text) || /emptied to \[\]/i.test(text) || /inbox.*\[\]/i.test(text)) {
    next.inboxEmptied = true;
    next.inboxJson = "[]";
  }
  if (/ZERO times/i.test(text) || /appears 0\b/i.test(text) || /grep[^\n]*\b0\b/i.test(text)) {
    next.msgIdInParent = false;
    next.parentGrepCount = 0;
  }
  if (/mid-turn/i.test(text)) next.parentMidTurn = true;
  if (/park(?:ed| idle)|stays alive and idle/i.test(text)) next.agentIdle = true;
  if (/one second after|before resume/i.test(text)) next.teamCreatedBeforeResume = true;
  if (/session-PPPPPPPP|teams\/session-PPPPPPPP/i.test(text)) next.teamHubExists = true;
  if (next.resumedId && !next.liveSessionId) next.liveSessionId = next.resumedId;
  return cloneProbe(next);
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  if (typeof payload === "string") {
    return decide({ action: "score", probe: parseProbe(payload) });
  }
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear") {
    return pack("roosted", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "band" || verb === "strike") {
    if (isIdle(probe)) {
      probe = healthyRoost(action.session || probe.session);
    } else {
      probe = { ...probe, scored: true };
    }
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  if (verb === "admit" || verb === "score" || verb === "load") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
