/**
 * Sounder — telegraph sounder's night desk
 * for a real Claude Code liveness failure: a background
 * Bash waiter with run_in_background:true completes
 * cleanly, but its completion notification never
 * re-invokes the session. The session sits idle until
 * a human types. Silence is the bug.
 *
 * Primary #90555: open, has repro, filed 2026-08-29,
 * area:core / area:bash, Claude Code 2.1.251.
 * Waiter IDs br1ghbwl6 and bzuzeorji both exited after
 * the log line appeared; no wake from ~23:30 to 05:55
 * (6h25m).
 *
 * Same-class / nearby (cite, not new primaries):
 *   #90534 — opposite pole: resume auto-fires armed
 *            background shells before any input
 *   #87689 — subagent run_in_background completion
 *            notification never delivered if the agent
 *            ends its turn
 *   #89505 — background-task completion notifications
 *            silently lost for async subagents
 *   #88423 — in-process subagents never re-invoked when
 *            their own run_in_background Bash/Monitor
 *            completes
 *   #85534 — completion notification enqueued but never
 *            delivered
 *   #77300 — agent-team Monitor/background-task
 *            notifications never wake an idle teammate
 *   #85129 — -p headless silently kills run_in_background
 *            at turn end; no notification loop
 *   #76174 — run_in_background task-notification routed
 *            to wrong session/project (nearby shape)
 *
 * Cross-ecosystem (nearby completed-background never
 * resumes, not a new primary):
 *   openai/codex#15723 — background subprocesses /
 *            subagents do not wake the calling agent
 *            on completion
 *
 * #88702 (timeout ignored / never-exiting background
 * task) is Leat-adjacent — cite only as NOT this.
 *
 * Verdicts: keyed | muted | stalled | orphaned | relayed
 *           | deaf | armed | dropped | stranded | cut
 * Idle word is keyed (circuit closed; notification path
 * live; session will wake without a human).
 * NEVER use sounder / empty / silent / mute / idle / dead
 * as idle. NEVER reuse housed, beamed, snug, hung,
 * appointed, cinched, gauged, stamped, overrun, pratique,
 * wound, bound, stilled, stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight, banked, roosted, stocked,
 * seated, heard, clear, paired, kernel, latched, upheld,
 * sterling, home, valid, dry, sealed, quiet, seised, rung.
 *
 * Slack alarm on muted / stalled / orphaned / deaf /
 * dropped / stranded / cut / armed.
 * Linear ticket on muted / stalled.
 * GitHub sounder-ledger of scored circuits on every score.
 *
 * Priority when multiple match:
 *   muted > stalled > orphaned > dropped > stranded
 *   > cut > armed > deaf > relayed > keyed
 * Unique nearby flags (dropped / stranded / cut / armed)
 * still win their own seeds because those seeds do not
 * carry the muted triple. Deaf needs a present session
 * that never heard a click — not a live keyed circuit.
 *
 * Why this is not a clone:
 * NOT Leat — sleep-block unbounded until-loop that never
 *     exits. Inverse: here the waiter DID exit.
 * NOT Fusee — early schedule dispatch.
 * NOT Cotter — poison fireAt registry (whole file rejected).
 * NOT Reveille — living muster / heartbeats across
 *     compaction.
 * NOT Shunt — nested SendMessage misroute.
 * NOT Husk — hollow headless SUCCESS envelope.
 * NOT Binnacle — TUI origin split.
 * NOT Pirn — instruction-shaped idle_notification
 *     truncation.
 * NOT leftover woodworking / millimetre-slider.
 * Do NOT ship alternate names Tocsin, Larum, Clapper,
 * Squelch, Vigil, Rouse, Cradle, Gong, Tantara, Relay,
 * Bell. Product name is Sounder only.
 * Different problem: WAITER EXITS CLEANLY → COMPLETION
 * NOTIFICATION NEVER RE-INVOKES → SESSION IDLES UNTIL
 * HUMAN INPUT. Liveness failure, not correctness.
 * Different UI: telegraph office night desk. Oak table,
 * brass sounder, straight key, ink tape, line lamp.
 * Different idle: keyed.
 */

export const VERDICTS = Object.freeze([
  "keyed",
  "muted",
  "stalled",
  "orphaned",
  "relayed",
  "deaf",
  "armed",
  "dropped",
  "stranded",
  "cut",
]);
export const IDLE_WORD = "keyed";
export const SLACK_VERDICTS = Object.freeze([
  "muted",
  "stalled",
  "orphaned",
  "deaf",
  "dropped",
  "stranded",
  "cut",
  "armed",
]);
export const LINEAR_VERDICTS = Object.freeze(["muted", "stalled"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90555;
export const DEMO_WAITER_IDS = Object.freeze(["br1ghbwl6", "bzuzeorji"]);
export const DEMO_IDLE_HOURS = 6.25;

const FORBIDDEN_IDLE = Object.freeze([
  "sounder",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "tocsin",
  "larum",
  "clapper",
  "squelch",
  "vigil",
  "rouse",
  "cradle",
  "gong",
  "tantara",
  "relay",
  "bell",
  "leat",
  "fusee",
  "cotter",
  "reveille",
  "shunt",
  "husk",
  "binnacle",
  "pirn",
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

function asHours(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function asWaiterIds(value) {
  if (Array.isArray(value)) {
    return value.map((row) => String(row).trim()).filter(Boolean);
  }
  const text = asText(value).trim();
  if (!text) return [];
  return text.split(/[\s,;|/]+/).map((row) => row.trim()).filter(Boolean);
}

export function emptySounder() {
  return {
    session: "",
    issue: null,
    source: "",
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: false,
    idleHours: 0,
    waiterIds: [],
    resumeAutofire: false,
    enqueuedNotDelivered: false,
    teammateIdle: false,
    headlessKilledAtTurnEnd: false,
    sessionPresent: false,
    circuitArmed: false,
    scored: false,
  };
}

export function emptyAction(session = "keyed-1") {
  return {
    action: "score",
    session,
    sounder: emptySounder(),
  };
}

export function cloneSounder(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptySounder();
  const nested =
    (src.sounder && typeof src.sounder === "object" && src.sounder) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.circuit && typeof src.circuit === "object" && src.circuit) ||
    src;
  return {
    ...emptySounder(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    waiterCompleted: asBool(nested.waiterCompleted ?? src.waiterCompleted, false) === true,
    notificationDelivered:
      asBool(nested.notificationDelivered ?? src.notificationDelivered, false) === true,
    sessionReinvoked:
      asBool(
        nested.sessionReinvoked ?? nested.notificationReinvoked ?? src.sessionReinvoked,
        false,
      ) === true,
    humanInputRequired:
      asBool(nested.humanInputRequired ?? src.humanInputRequired, false) === true,
    idleHours: asHours(nested.idleHours ?? src.idleHours),
    waiterIds: asWaiterIds(nested.waiterIds ?? nested.waiterId ?? src.waiterIds),
    resumeAutofire: asBool(nested.resumeAutofire ?? src.resumeAutofire, false) === true,
    enqueuedNotDelivered:
      asBool(nested.enqueuedNotDelivered ?? src.enqueuedNotDelivered, false) === true,
    teammateIdle: asBool(nested.teammateIdle ?? src.teammateIdle, false) === true,
    headlessKilledAtTurnEnd:
      asBool(nested.headlessKilledAtTurnEnd ?? src.headlessKilledAtTurnEnd, false) === true,
    sessionPresent: asBool(nested.sessionPresent ?? src.sessionPresent, false) === true,
    circuitArmed: asBool(nested.circuitArmed ?? src.circuitArmed, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(sounder = {}) {
  const next = cloneSounder(sounder);
  const ids = next.waiterIds;
  const mutedShape =
    next.waiterCompleted === true &&
    next.notificationDelivered !== true &&
    next.sessionReinvoked !== true;
  const stalledShape =
    next.waiterCompleted === true &&
    next.humanInputRequired === true &&
    next.idleHours > 0 &&
    next.sessionReinvoked !== true;
  const orphanedShape = ids.length > 0 && next.sessionReinvoked !== true;
  const deafShape =
    next.sessionPresent === true &&
    next.sessionReinvoked !== true &&
    next.circuitArmed !== true &&
    next.resumeAutofire !== true &&
    next.enqueuedNotDelivered !== true &&
    next.teammateIdle !== true &&
    next.headlessKilledAtTurnEnd !== true;
  const droppedShape = next.enqueuedNotDelivered === true;
  const strandedShape = next.teammateIdle === true;
  const cutShape = next.headlessKilledAtTurnEnd === true;
  const armedShape = next.resumeAutofire === true;
  const relayedShape = next.notificationDelivered === true && next.sessionReinvoked === true;
  const keyedHold =
    next.circuitArmed === true &&
    next.waiterCompleted !== true &&
    next.resumeAutofire !== true &&
    next.enqueuedNotDelivered !== true &&
    next.teammateIdle !== true &&
    next.headlessKilledAtTurnEnd !== true &&
    next.humanInputRequired !== true;
  return {
    waiterCompleted: next.waiterCompleted,
    notificationDelivered: next.notificationDelivered,
    sessionReinvoked: next.sessionReinvoked,
    humanInputRequired: next.humanInputRequired,
    idleHours: next.idleHours,
    waiterIds: ids,
    resumeAutofire: next.resumeAutofire,
    enqueuedNotDelivered: next.enqueuedNotDelivered,
    teammateIdle: next.teammateIdle,
    headlessKilledAtTurnEnd: next.headlessKilledAtTurnEnd,
    sessionPresent: next.sessionPresent,
    circuitArmed: next.circuitArmed,
    mutedShape,
    stalledShape,
    orphanedShape,
    deafShape,
    droppedShape,
    strandedShape,
    cutShape,
    armedShape,
    relayedShape,
    keyedHold,
  };
}

export function isIdle(sounder = {}) {
  const next = cloneSounder(sounder);
  return (
    next.waiterCompleted !== true &&
    next.notificationDelivered !== true &&
    next.sessionReinvoked !== true &&
    next.humanInputRequired !== true &&
    next.idleHours <= 0 &&
    next.waiterIds.length === 0 &&
    next.resumeAutofire !== true &&
    next.enqueuedNotDelivered !== true &&
    next.teammateIdle !== true &&
    next.headlessKilledAtTurnEnd !== true &&
    next.sessionPresent !== true &&
    next.circuitArmed !== true
  );
}

/**
 * First match wins by documented priority:
 * muted > stalled > orphaned > dropped > stranded
 * > cut > armed > deaf > relayed > keyed.
 * Idle keyed is first. A completed waiter / clean exit
 * must NOT force keyed when the session was never
 * re-invoked. The #90555 muted case is muted, never keyed.
 */
export function classify(sounder = {}) {
  const next = cloneSounder(sounder);
  if (isIdle(next)) return "keyed";
  const facts = analyze(next);

  if (facts.mutedShape) return "muted";
  if (facts.stalledShape) return "stalled";
  if (facts.orphanedShape) return "orphaned";
  if (facts.droppedShape) return "dropped";
  if (facts.strandedShape) return "stranded";
  if (facts.cutShape) return "cut";
  if (facts.armedShape) return "armed";
  if (facts.deafShape) return "deaf";
  if (facts.relayedShape) return "relayed";
  if (facts.keyedHold) return "keyed";
  return "keyed";
}

export function feedOf(sounder = {}, verdict = "") {
  const kind = verdict || classify(sounder);
  if (kind === "muted") {
    return "● Muted · waiter completed · notification never re-invoked the session · primary #90555";
  }
  if (kind === "stalled") {
    return "● Stalled · session sat idle for hours after waiter exit until human input";
  }
  if (kind === "orphaned") {
    return "● Orphaned · waiter IDs exist · no wake attached";
  }
  if (kind === "relayed") {
    return "● Relayed · notification delivered and session woke";
  }
  if (kind === "deaf") {
    return "● Deaf · session still present but never heard the click";
  }
  if (kind === "armed") {
    return "● Armed · resume auto-fires armed background work before any input · opposite pole #90534";
  }
  if (kind === "dropped") {
    return "● Dropped · notification enqueued but never delivered · nearby #85534 / #89505 / #87689";
  }
  if (kind === "stranded") {
    return "● Stranded · idle teammate never woken by Monitor/background-task notifications · nearby #77300";
  }
  if (kind === "cut") {
    return "● Cut · headless (-p) kills run_in_background at turn end · no notification loop · nearby #85129";
  }
  return "● Keyed · waiter armed · notification path live · session will wake without a human · idle word is keyed";
}

export function reasonsOf(sounder = {}, verdict = "") {
  const next = cloneSounder(sounder);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.waiterIds.length
      ? `sounder waiters ${facts.waiterIds.join(",")} · completed ${facts.waiterCompleted ? "yes" : "no"} · delivered ${facts.notificationDelivered ? "yes" : "no"} · reinvoked ${facts.sessionReinvoked ? "yes" : "no"} · idle ${facts.idleHours}h`
      : "line lamp on · key seated · tape quiet but ready · idle word is keyed",
  );
  if (facts.waiterCompleted && !facts.sessionReinvoked) {
    reasons.push(
      "waiter exited cleanly · a completed waiter is not a hold · the session was never re-invoked",
    );
  }
  if (facts.waiterCompleted && !facts.notificationDelivered) {
    reasons.push("completion notification never re-invoked the session · silence is the bug");
  }
  if (facts.humanInputRequired && facts.idleHours > 0) {
    reasons.push(
      `session sat idle ${facts.idleHours}h after waiter exit until a human typed · #90555 sat ~23:30 to 05:55`,
    );
  }
  if (facts.waiterIds.length && !facts.sessionReinvoked) {
    reasons.push(`waiter IDs ${facts.waiterIds.join(", ")} exist · no wake attached`);
  }
  if (facts.sessionPresent && !facts.sessionReinvoked) {
    reasons.push("session still present but never heard the click");
  }
  if (facts.enqueuedNotDelivered) {
    reasons.push("notification enqueued but never delivered · nearby #85534 / #89505 / #87689");
  }
  if (facts.teammateIdle) {
    reasons.push("idle teammate never woken by Monitor/background-task notifications · nearby #77300");
  }
  if (facts.headlessKilledAtTurnEnd) {
    reasons.push("headless (-p) kills run_in_background at turn end · no notification loop · nearby #85129");
  }
  if (facts.resumeAutofire) {
    reasons.push(
      "opposite pole #90534 · resume auto-fires armed background shells before any input",
    );
  }
  if (facts.notificationDelivered && facts.sessionReinvoked) {
    reasons.push("notification delivered and session woke · the circuit clicked");
  }
  reasons.push("a completed waiter is not a hold");
  reasons.push(
    "NOT Leat (until-loop that never exits — inverse: here the waiter DID exit) / Fusee (early schedule) / Cotter (poison fireAt) / Reveille (living muster) / Shunt (nested SendMessage) / Husk (hollow SUCCESS) / Binnacle (TUI origin split) / Pirn (instruction-shaped truncation) / leftover woodworking / millimetre-slider. NOT #88702 (never-exiting background task).",
  );
  if (kind === "keyed") {
    reasons.push(
      "waiter armed; notification path live; session will wake without a human; idle word is keyed",
    );
  }
  if (kind === "muted") {
    reasons.push(
      "PRIMARY #90555: background Bash waiter with run_in_background:true completed; notification never re-invoked; session idled until user input. Waiter IDs br1ghbwl6 and bzuzeorji. No error printed. The muted case is muted, never keyed.",
    );
  }
  if (kind === "stalled") {
    reasons.push("session sat idle for hours after waiter exit until human input.");
  }
  if (kind === "orphaned") {
    reasons.push("waiter IDs exist, no wake attached.");
  }
  if (kind === "relayed") {
    reasons.push("notification delivered and session woke.");
  }
  if (kind === "deaf") {
    reasons.push("session still present but never heard the click.");
  }
  if (kind === "armed") {
    reasons.push("resume auto-fires armed background work before any input.");
  }
  if (kind === "dropped") {
    reasons.push("notification enqueued but never delivered.");
  }
  if (kind === "stranded") {
    reasons.push("idle teammate never woken by Monitor/background-task notifications.");
  }
  if (kind === "cut") {
    reasons.push("headless (-p) kills run_in_background at turn end; no notification loop.");
  }
  return reasons;
}

export function verdictOf(sounder = {}) {
  return classify(sounder);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function keyedOf(sounder = {}, verdict = "") {
  return (verdict || classify(sounder)) === "keyed";
}

export function mutedOf(sounder = {}, verdict = "") {
  return (verdict || classify(sounder)) === "muted";
}

export function summaryOf(sounder = {}) {
  const next = cloneSounder(sounder);
  const facts = analyze(next);
  return {
    waiterCompleted: facts.waiterCompleted,
    notificationDelivered: facts.notificationDelivered,
    sessionReinvoked: facts.sessionReinvoked,
    humanInputRequired: facts.humanInputRequired,
    idleHours: facts.idleHours,
    waiterIds: facts.waiterIds,
    resumeAutofire: facts.resumeAutofire,
    enqueuedNotDelivered: facts.enqueuedNotDelivered,
    teammateIdle: facts.teammateIdle,
    headlessKilledAtTurnEnd: facts.headlessKilledAtTurnEnd,
    sessionPresent: facts.sessionPresent,
    circuitArmed: facts.circuitArmed,
  };
}

export function score(sounder = {}) {
  const next = cloneSounder(sounder);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    keyed: keyedOf(next, verdict),
    muted: mutedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    waiterCompleted: facts.waiterCompleted,
    notificationDelivered: facts.notificationDelivered,
    sessionReinvoked: facts.sessionReinvoked,
    humanInputRequired: facts.humanInputRequired,
    idleHours: facts.idleHours,
    waiterIds: facts.waiterIds,
    resumeAutofire: facts.resumeAutofire,
    enqueuedNotDelivered: facts.enqueuedNotDelivered,
    teammateIdle: facts.teammateIdle,
    headlessKilledAtTurnEnd: facts.headlessKilledAtTurnEnd,
    sessionPresent: facts.sessionPresent,
    circuitArmed: facts.circuitArmed,
    summary: summaryOf(next),
    sounder: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const sounderSrc =
    src.sounder ||
    src.probe ||
    src.payload ||
    src.circuit ||
    payload.sounder ||
    payload.probe ||
    payload.circuit;
  const sounder = cloneSounder(
    sounderSrc && typeof sounderSrc === "object"
      ? { ...sounderSrc, ...src, ...payload }
      : payload,
  );
  if (typeof src.session === "string" && !sounder.session) sounder.session = src.session;
  if (typeof payload.session === "string" && !sounder.session) sounder.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? sounder.session ?? ""),
    sounder,
    issue: src.issue ?? payload.issue ?? sounder.issue ?? null,
    source: src.source ?? payload.source ?? sounder.source ?? "",
  };
}

function sounderResult(verdict, sounder, action, extras = {}) {
  const next = cloneSounder(sounder);
  const scored = score(next);
  return {
    ok: true,
    product: "sounder",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    keyed: scored.keyed,
    muted: scored.muted,
    sounderKeyed: verdict === "keyed",
    sounderMuted: verdict === "muted",
    sounderStalled: verdict === "stalled",
    sounderOrphaned: verdict === "orphaned",
    sounderRelayed: verdict === "relayed",
    sounderDeaf: verdict === "deaf",
    sounderArmed: verdict === "armed",
    sounderDropped: verdict === "dropped",
    sounderStranded: verdict === "stranded",
    sounderCut: verdict === "cut",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    waiterCompleted: scored.waiterCompleted,
    notificationDelivered: scored.notificationDelivered,
    sessionReinvoked: scored.sessionReinvoked,
    humanInputRequired: scored.humanInputRequired,
    idleHours: scored.idleHours,
    waiterIds: scored.waiterIds,
    resumeAutofire: scored.resumeAutofire,
    enqueuedNotDelivered: scored.enqueuedNotDelivered,
    teammateIdle: scored.teammateIdle,
    headlessKilledAtTurnEnd: scored.headlessKilledAtTurnEnd,
    sessionPresent: scored.sessionPresent,
    circuitArmed: scored.circuitArmed,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    sounder: next,
    ...extras,
  };
}

function seedSounder(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    sounder: {
      ...emptySounder(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      waiterCompleted: Boolean(extras.waiterCompleted),
      notificationDelivered: Boolean(extras.notificationDelivered),
      sessionReinvoked: Boolean(extras.sessionReinvoked),
      humanInputRequired: Boolean(extras.humanInputRequired),
      idleHours: asHours(extras.idleHours),
      waiterIds: asWaiterIds(extras.waiterIds),
      resumeAutofire: Boolean(extras.resumeAutofire),
      enqueuedNotDelivered: Boolean(extras.enqueuedNotDelivered),
      teammateIdle: Boolean(extras.teammateIdle),
      headlessKilledAtTurnEnd: Boolean(extras.headlessKilledAtTurnEnd),
      sessionPresent: Boolean(extras.sessionPresent),
      circuitArmed: Boolean(extras.circuitArmed),
    },
  };
}

/** Healthy keyed circuit. Waiter armed; path live; session will wake. */
export function seedKeyed() {
  return seedSounder("keyed", "desk", {
    session: "keyed",
    issue: null,
    scored: true,
    circuitArmed: true,
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: false,
    sessionPresent: true,
  });
}

/** Control: same as keyed, session tagged as the healthy proof. */
export function seedControl() {
  return seedSounder("keyed", "desk", {
    session: "90555-control",
    issue: null,
    circuitArmed: true,
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: false,
    sessionPresent: true,
  });
}

/**
 * #90555 muted: waiter completed, notification never
 * re-invoked, session idled until human. Waiter IDs
 * br1ghbwl6 and bzuzeorji. Idle 6h25m. No error printed.
 * A clean exit must not force keyed.
 */
export function seedMuted() {
  return seedSounder(FEATURED_ISSUE, "anthropics/claude-code#90555", {
    session: "90555-muted",
    waiterCompleted: true,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: true,
    idleHours: DEMO_IDLE_HOURS,
    waiterIds: DEMO_WAITER_IDS.slice(),
    sessionPresent: true,
    circuitArmed: true,
  });
}

export function seed90555() {
  return seedMuted();
}

/** Session sat idle for hours after waiter exit until human. */
export function seedStalled() {
  return seedSounder(FEATURED_ISSUE, "anthropics/claude-code#90555", {
    session: "90555-stalled",
    waiterCompleted: true,
    notificationDelivered: true,
    sessionReinvoked: false,
    humanInputRequired: true,
    idleHours: DEMO_IDLE_HOURS,
    sessionPresent: true,
  });
}

/** Waiter IDs exist, no wake attached. */
export function seedOrphaned() {
  return seedSounder(FEATURED_ISSUE, "anthropics/claude-code#90555", {
    session: "90555-orphaned",
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    waiterIds: DEMO_WAITER_IDS.slice(),
    sessionPresent: true,
  });
}

/** Notification delivered and session woke. */
export function seedRelayed() {
  return seedSounder(FEATURED_ISSUE, "anthropics/claude-code#90555", {
    session: "90555-relayed",
    waiterCompleted: true,
    notificationDelivered: true,
    sessionReinvoked: true,
    sessionPresent: true,
    circuitArmed: true,
  });
}

/** Session still present but never heard the click. */
export function seedDeaf() {
  return seedSounder(FEATURED_ISSUE, "anthropics/claude-code#90555", {
    session: "90555-deaf",
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    sessionPresent: true,
  });
}

/** Opposite pole #90534: resume auto-fires armed work. */
export function seedArmed() {
  return seedSounder(90534, "anthropics/claude-code#90534", {
    session: "90534-armed",
    resumeAutofire: true,
    circuitArmed: true,
  });
}

/** Nearby #85534 / #89505 / #87689: enqueued, never delivered. */
export function seedDropped() {
  return seedSounder(85534, "anthropics/claude-code#85534", {
    session: "85534-dropped",
    enqueuedNotDelivered: true,
    sessionPresent: true,
  });
}

/** Nearby #77300: idle teammate never woken. */
export function seedStranded() {
  return seedSounder(77300, "anthropics/claude-code#77300", {
    session: "77300-stranded",
    teammateIdle: true,
    sessionPresent: true,
  });
}

/** Nearby #85129: -p kills run_in_background at turn end. */
export function seedCut() {
  return seedSounder(85129, "anthropics/claude-code#85129", {
    session: "85129-cut",
    headlessKilledAtTurnEnd: true,
    sessionPresent: true,
  });
}

/** Idle reset. Line lamp on. Key seated. Tape quiet but ready. */
export function seedReset() {
  return seedSounder("keyed", "desk", {
    session: "keyed",
    issue: null,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptySounder();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneSounder({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneSounder({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const muted =
    /waiter completed|notification never re-invok|never re-invoked|session idles until/i.test(
      text,
    ) && /#90555|run_in_background|background Bash waiter/i.test(text);
  const stalled = /sat idle for hours|until human input|6h25m|23:30 to 05:55/i.test(text);
  const orphaned = /waiter IDs exist|no wake attached|br1ghbwl6|bzuzeorji/i.test(text);
  const relayed = /notification delivered and session woke|session woke/i.test(text);
  const deaf = /never heard the click|session still present but never heard/i.test(text);
  const armed = /resume auto-fires|#90534|armed background/i.test(text);
  const dropped = /enqueued but never delivered|#85534|#89505|#87689/i.test(text);
  const stranded = /idle teammate never woken|#77300/i.test(text);
  const cut = /kills run_in_background at turn end|#85129|headless \(-p\)/i.test(text);
  const keyed = /admit keyed|notification path live|session will wake without a human/i.test(text);

  if (muted) {
    return {
      ...seedMuted().sounder,
      session: "paste-muted",
      source: "anthropics/claude-code#90555",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (stalled) {
    return {
      ...seedStalled().sounder,
      session: "paste-stalled",
      source: "anthropics/claude-code#90555",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (orphaned) {
    return {
      ...seedOrphaned().sounder,
      session: "paste-orphaned",
      source: "anthropics/claude-code#90555",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (relayed) {
    return {
      ...seedRelayed().sounder,
      session: "paste-relayed",
      source: "anthropics/claude-code#90555",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (deaf) {
    return {
      ...seedDeaf().sounder,
      session: "paste-deaf",
      source: "anthropics/claude-code#90555",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (armed) {
    return {
      ...seedArmed().sounder,
      session: "paste-armed",
      source: "anthropics/claude-code#90534",
      issue: 90534,
      scored: true,
    };
  }
  if (dropped) {
    return {
      ...seedDropped().sounder,
      session: "paste-dropped",
      source: "anthropics/claude-code#85534",
      issue: 85534,
      scored: true,
    };
  }
  if (stranded) {
    return {
      ...seedStranded().sounder,
      session: "paste-stranded",
      source: "anthropics/claude-code#77300",
      issue: 77300,
      scored: true,
    };
  }
  if (cut) {
    return {
      ...seedCut().sounder,
      session: "paste-cut",
      source: "anthropics/claude-code#85129",
      issue: 85129,
      scored: true,
    };
  }
  if (keyed) {
    return { ...seedControl().sounder, session: "paste-keyed", source: "paste", scored: true };
  }
  return { ...emptySounder(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  keyed: seedKeyed,
  control: seedControl,
  muted: seedMuted,
  90555: seed90555,
  "90555-muted": seedMuted,
  stalled: seedStalled,
  orphaned: seedOrphaned,
  relayed: seedRelayed,
  deaf: seedDeaf,
  armed: seedArmed,
  dropped: seedDropped,
  stranded: seedStranded,
  cut: seedCut,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  desk: seedControl,
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
  let sounder = cloneSounder(action.sounder);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "keyed" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return sounderResult("keyed", emptySounder(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "bench" || verb === "desk") {
    sounder = seedControl().sounder;
    return sounderResult(classify(sounder), sounder, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "muted" || verb === "incident" || verb === "90555") {
    sounder = seedMuted().sounder;
    return sounderResult(classify(sounder), sounder, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "click" || verb === "sound") {
    sounder = { ...sounder, scored: true };
    return sounderResult(classify(sounder), sounder, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "key") {
    sounder = { ...sounder, scored: true };
    return sounderResult(classify(sounder), sounder, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "key" ? "score" : verb,
    });
  }

  sounder = { ...sounder, scored: true };
  return sounderResult(classify(sounder), sounder, action);
}
