/**
 * Shunt — night railway shunting yard / signal-box / lever-frame
 * desk for Claude Code nested-subagent SendMessage follow-up
 * replies that are delivered to the root session instead of
 * the requesting parent. First child answer is reliable to
 * the parent. The follow-up is misrouted to root. Return path
 * is also closed: the child sees `from="general-purpose"`
 * (agent type, not an address) and an explicit reply fails
 * with `No agent named 'general-purpose' is reachable`.
 *
 * A first delivery is not a hold. Score the road or admit
 * stabled.
 *
 * Primary #90463: Reply to SendMessage from a nested subagent
 * is delivered to the root session instead of the requesting
 * parent. Filed 2026-08-28, re-verified 2026-08-29 on 2.1.251.
 * 4/4 follow-up misroutes; first delivery 18/18 to parent.
 * Child `from="general-purpose"` does not resolve.
 *
 * Hypothesis (from the issue text, not a claim): recipient
 * helper resolves the parent only while the parent is running,
 * or completed and still holds keepalive `agent:<taskId>`;
 * that keepalive is cleared after the first notification, so
 * a parked parent falls back to root.
 *
 * Verdicts: stabled | misrouted | orphaned | rootbound
 *           | typecast | stalled | tandem | dropped
 *           | crosstalk | sidetracked
 * Idle word is stabled (wagons in the right road; no
 * misroute). NEVER use shunt / shunted / empty as idle.
 * NEVER reuse drained, flat, fit, spoilt, laid, unlinked,
 * tight, banked, roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home, valid,
 * dry, sealed, quiet, seised.
 *
 * Slack shunt alarm on misrouted / orphaned / rootbound /
 * typecast. Linear ticket on misrouted / orphaned / rootbound.
 * GitHub shunt-ledger of road events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Cote (dove-cote / --resume team-hub identity split).
 * NOT Tappet (valve train / silent hook injection).
 * NOT Reveille (duplicate dispatch).
 * NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket /
 * Damper / Larder / Aside / Chute / Tain / Husk / Snib /
 * Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot /
 * Coda / Reed / Fathom / Hasp / Parity / Quench / Scrim /
 * Knock.
 * Different problem: nested SendMessage follow-up misroute
 * to root + unresolvable from=type.
 * Different UI: night railway shunting yard / signal box /
 * lever frame / oil lamps / points / wagons / wet rails.
 * Different idle: stabled.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Points, Frog, Wye, Siding,
 * Slip, Catch, Wagon, Yard, Signal, Lever, Relay, Deadletter,
 * Crosstalk, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc,
 * Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows,
 * Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice,
 * Culvert, Weir, Bung, Void, Limbo, Oubliette.
 * Product name is Shunt only.
 */

export const VERDICTS = Object.freeze([
  "stabled",
  "misrouted",
  "orphaned",
  "rootbound",
  "typecast",
  "stalled",
  "tandem",
  "dropped",
  "crosstalk",
  "sidetracked",
]);
export const IDLE_WORD = "stabled";
export const SLACK_VERDICTS = Object.freeze([
  "misrouted",
  "orphaned",
  "rootbound",
  "typecast",
]);
export const LINEAR_VERDICTS = Object.freeze(["misrouted", "orphaned", "rootbound"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const TYPE_LABEL = "general-purpose";

const FORBIDDEN_IDLE = Object.freeze([
  "shunt",
  "shunted",
  "empty",
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
  "points",
  "frog",
  "wye",
  "siding",
  "slip",
  "catch",
  "wagon",
  "yard",
  "signal",
  "lever",
  "relay",
  "deadletter",
  "crosstalk",
  "kerf",
  "crop",
  "stump",
  "snip",
  "quill",
  "nib",
  "trunc",
  "ferrule",
  "livery",
  "nixie",
  "crypt",
  "fold",
  "accordion",
  "bellows",
  "drain",
  "null",
  "sink",
  "gutter",
  "pit",
  "ash",
  "ashcan",
  "sluice",
  "culvert",
  "weir",
  "bung",
  "void",
  "limbo",
  "oubliette",
  "sump",
  "pleat",
  "scant",
  "cote",
  "tappet",
  "reveille",
  "knock",
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

function asDepth(value) {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function isTypeLabel(value) {
  const text = asText(value).trim().toLowerCase();
  return text === TYPE_LABEL || text === "generalpurpose" || text === "general_purpose";
}

export function emptyProbe() {
  return {
    firstAnswerToParent: false,
    followUpToRoot: false,
    parentReceivedFollowUp: false,
    childProducedFollowUp: false,
    fromIsAgentType: false,
    fromResolves: false,
    parentParkedWaiting: false,
    keepaliveClearedAfterFirst: false,
    parentRunning: false,
    parentCompleted: false,
    parentHoldsKeepalive: false,
    replyAddressedByRequester: false,
    notificationQueuedToRoot: false,
    nestedDepth: 0,
    childFromLabel: "",
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "stabled-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const road = src.road && typeof src.road === "object" ? src.road : {};
  const frame = src.frame && typeof src.frame === "object" ? src.frame : {};
  const box = src.box && typeof src.box === "object" ? src.box : {};
  const yard = src.yard && typeof src.yard === "object" ? src.yard : {};
  const pick = (key) => src[key] ?? road[key] ?? frame[key] ?? box[key] ?? yard[key];
  const label = asText(pick("childFromLabel"));
  const fromIsAgentType = asBool(pick("fromIsAgentType")) || isTypeLabel(label);
  return {
    ...emptyProbe(),
    firstAnswerToParent: asBool(pick("firstAnswerToParent")),
    followUpToRoot: asBool(pick("followUpToRoot")),
    parentReceivedFollowUp: asBool(pick("parentReceivedFollowUp")),
    childProducedFollowUp: asBool(pick("childProducedFollowUp")),
    fromIsAgentType,
    fromResolves: asBool(pick("fromResolves")),
    parentParkedWaiting: asBool(pick("parentParkedWaiting")),
    keepaliveClearedAfterFirst: asBool(pick("keepaliveClearedAfterFirst")),
    parentRunning: asBool(pick("parentRunning")),
    parentCompleted: asBool(pick("parentCompleted")),
    parentHoldsKeepalive: asBool(pick("parentHoldsKeepalive")),
    replyAddressedByRequester: asBool(pick("replyAddressedByRequester")),
    notificationQueuedToRoot: asBool(pick("notificationQueuedToRoot")),
    nestedDepth: asDepth(pick("nestedDepth")),
    childFromLabel: label,
    observed: asBool(src.observed ?? road.observed ?? frame.observed ?? box.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? road.source ?? frame.source ?? box.source),
    issue: asIssue(src.issue ?? road.issue ?? frame.issue ?? box.issue),
    scored: asBool(src.scored ?? road.scored ?? frame.scored ?? box.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.firstAnswerToParent &&
    !next.followUpToRoot &&
    !next.parentReceivedFollowUp &&
    !next.childProducedFollowUp &&
    !next.fromIsAgentType &&
    !next.fromResolves &&
    !next.parentParkedWaiting &&
    !next.keepaliveClearedAfterFirst &&
    !next.parentRunning &&
    !next.parentCompleted &&
    !next.parentHoldsKeepalive &&
    !next.replyAddressedByRequester &&
    !next.notificationQueuedToRoot &&
    next.nestedDepth < 2 &&
    asText(next.childFromLabel).trim() === "" &&
    !next.observed
  );
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const firstAnswerToParent =
    /FIRST-ANSWER/i.test(text) && /delivered_to_agent|to the parent/i.test(text);
  const childProducedFollowUp = /SECOND-ANSWER/i.test(text);
  const followUpToRoot =
    childProducedFollowUp &&
    (/attachment:\s*queued_command/i.test(text) || /delivered (directly )?to the root/i.test(text));
  const notificationQueuedToRoot =
    /queued.*(root|main)|attachment:\s*queued_command/i.test(text);
  const parentParkedWaiting = /waiting for (its )?second|parked waiting|never received/i.test(text);
  const fromMatch = text.match(/from=["']([^"']+)["']/i);
  const childFromLabel = fromMatch ? fromMatch[1] : /general-purpose/i.test(text) ? TYPE_LABEL : "";
  const fromIsAgentType = isTypeLabel(childFromLabel);
  const fromResolves = !/No agent named ['"]?general-purpose['"]? is reachable/i.test(text) &&
    fromIsAgentType === false &&
    Boolean(childFromLabel);
  const nestedDepth = /spawnDepth["']?\s*[:=]\s*([0-9]+)/i.test(text)
    ? Number(text.match(/spawnDepth["']?\s*[:=]\s*([0-9]+)/i)[1])
    : /nested|depth[- ]?2|grandchild/i.test(text)
      ? 2
      : 0;
  const keepaliveClearedAfterFirst = /keepalive.*(cleared|clears)|agent:<taskId>.*cleared/i.test(text);
  const parentCompleted = /owning subagent already completed|parent.*(completed|already gone)/i.test(text);
  const parentRunning = /parent is ["']?running["']?/i.test(text);
  const parentHoldsKeepalive = /still holds keepalive/i.test(text);
  return {
    firstAnswerToParent: firstAnswerToParent || (/FIRST-ANSWER/i.test(text) && !followUpToRoot),
    followUpToRoot,
    parentReceivedFollowUp: /parent received.*(SECOND-ANSWER|follow-?up)/i.test(text),
    childProducedFollowUp,
    fromIsAgentType,
    fromResolves: Boolean(fromResolves),
    parentParkedWaiting,
    keepaliveClearedAfterFirst,
    parentRunning,
    parentCompleted,
    parentHoldsKeepalive,
    replyAddressedByRequester: /addressed by the requester/i.test(text),
    notificationQueuedToRoot,
    nestedDepth: nestedDepth || (childProducedFollowUp ? 2 : 0),
    childFromLabel,
  };
}

/**
 * First match wins. Idle stabled is first. Classes stay
 * distinguishable: a first delivery is not a hold. This is a
 * nested SendMessage follow-up misroute to root + unresolvable
 * from=type.
 * NOT Cote (resume hub split). NOT Tappet (hook injection).
 * NOT Reveille (duplicate dispatch). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "stabled";

  const nested = next.nestedDepth >= 2;
  const toRoot = next.followUpToRoot || next.notificationQueuedToRoot;

  if (
    next.firstAnswerToParent &&
    next.childProducedFollowUp &&
    toRoot &&
    !next.parentReceivedFollowUp &&
    next.parentParkedWaiting &&
    next.fromIsAgentType &&
    !next.fromResolves &&
    nested &&
    next.keepaliveClearedAfterFirst
  ) {
    return "misrouted";
  }
  if (
    next.childProducedFollowUp &&
    !next.parentReceivedFollowUp &&
    next.parentCompleted &&
    !next.parentHoldsKeepalive &&
    !toRoot
  ) {
    return "orphaned";
  }
  if (toRoot) return "rootbound";
  if (next.fromIsAgentType && !next.fromResolves) return "typecast";
  if (next.parentParkedWaiting) return "stalled";
  if (next.parentRunning && next.parentHoldsKeepalive && next.firstAnswerToParent) {
    return "tandem";
  }
  if (next.childProducedFollowUp && !next.parentReceivedFollowUp && !toRoot) {
    return "dropped";
  }
  if (next.replyAddressedByRequester) return "crosstalk";
  if (nested) return "sidetracked";
  return "stabled";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  const toRoot = next.followUpToRoot || next.notificationQueuedToRoot;
  if (
    next.childProducedFollowUp &&
    !next.parentReceivedFollowUp &&
    next.parentCompleted &&
    !next.parentHoldsKeepalive
  ) {
    add("orphaned");
  }
  if (toRoot) add("rootbound");
  if (next.fromIsAgentType && !next.fromResolves) add("typecast");
  if (next.parentParkedWaiting) add("stalled");
  if (next.parentRunning && next.parentHoldsKeepalive && next.firstAnswerToParent) {
    add("tandem");
  }
  if (next.childProducedFollowUp && !next.parentReceivedFollowUp) add("dropped");
  if (next.replyAddressedByRequester) add("crosstalk");
  if (next.nestedDepth >= 2) add("sidetracked");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "misrouted") {
    return "● Misrouted · first answer to parent · SECOND-ANSWER queued to root · parent parked";
  }
  if (kind === "orphaned") {
    return "● Orphaned · child produced a follow-up · parent already completed · no keepalive";
  }
  if (kind === "rootbound") {
    return "● Rootbound · follow-up or notification queued to the root session";
  }
  if (kind === "typecast") {
    return "● Typecast · from=general-purpose is an agent type · No agent named general-purpose is reachable";
  }
  if (kind === "stalled") {
    return "● Stalled · parent parked waiting · no second answer on this road";
  }
  if (kind === "tandem") {
    return "● Tandem · parent still running · keepalive held · first delivery is live";
  }
  if (kind === "dropped") {
    return "● Dropped · child produced a follow-up · neither parent nor root took the wagon";
  }
  if (kind === "crosstalk") {
    return "● Crosstalk · reply addressed by requester · roads crossed on the frame";
  }
  if (kind === "sidetracked") {
    return "● Sidetracked · nested depth ≥ 2 · wagon left the intended road";
  }
  return "● Stabled · wagons in the right road · no misroute · idle word is stabled";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.firstAnswerToParent
      ? "first child answer delivered to the requesting parent"
      : "first answer was not scored as delivered to the parent",
  );
  reasons.push(
    next.childProducedFollowUp
      ? "child produced a follow-up (SECOND-ANSWER)"
      : "child did not produce a follow-up",
  );
  reasons.push(
    next.followUpToRoot || next.notificationQueuedToRoot
      ? "follow-up / notification queued to the root session"
      : "follow-up was not queued to root",
  );
  reasons.push(
    next.parentReceivedFollowUp
      ? "parent received the follow-up"
      : "parent did not receive the follow-up",
  );
  reasons.push(
    next.fromIsAgentType
      ? `from is an agent type (${asText(next.childFromLabel).trim() || TYPE_LABEL}), not an address`
      : "from is not scored as an agent type",
  );
  reasons.push(
    next.fromResolves
      ? "from label resolves to a reachable agent"
      : "from label does not resolve (No agent named 'general-purpose' is reachable)",
  );
  reasons.push(
    next.parentParkedWaiting
      ? "parent parked waiting for the second reply"
      : "parent was not scored as parked waiting",
  );
  reasons.push(
    next.keepaliveClearedAfterFirst
      ? "keepalive agent:<taskId> cleared after the first notification"
      : "keepalive was not scored as cleared after first",
  );
  reasons.push(
    next.nestedDepth >= 2
      ? `nested depth ${next.nestedDepth} (grandchild / depth-2)`
      : `nested depth ${next.nestedDepth} (not a nested grandchild)`,
  );
  if (next.parentRunning) {
    reasons.push("parent is still running");
  }
  if (next.parentCompleted) {
    reasons.push("parent already completed");
  }
  if (next.parentHoldsKeepalive) {
    reasons.push("parent still holds keepalive agent:<taskId>");
  }
  if (next.replyAddressedByRequester) {
    reasons.push("reply addressed by the requester recorded on the message");
  }
  if (next.observed) {
    reasons.push("Road sounded: first delivery, follow-up route, from=type, keepalive");
  }
  reasons.push("a first delivery is not a hold");
  reasons.push(
    "NOT Cote (resume hub split) / Tappet (hook injection) / Reveille (duplicate dispatch) / Sump / leftover woodworking / millimetre-slider",
  );
  if (kind === "stabled") {
    reasons.push("wagons in the right road or desk idle; idle word is stabled");
  }
  if (kind === "misrouted") {
    reasons.push(
      "PRIMARY #90463: Reply to SendMessage from a nested subagent is delivered to the root session instead of the requesting parent. 4/4 follow-up misroutes; first delivery 18/18 to parent. Re-verified 2026-08-29 on 2.1.251",
    );
  }
  if (kind === "orphaned") {
    reasons.push(
      "Shape #75043 / #76681: nested completion or queued notification never reaches a completed parent; the child is orphaned off the road",
    );
  }
  if (kind === "rootbound") {
    reasons.push(
      "Shape #77950: SendMessage falls back to main / root; the wagon is bound to the root road",
    );
  }
  if (kind === "typecast") {
    reasons.push(
      "PRIMARY #90463 return path: child sees from=\"general-purpose\" (agent type, not an address). Explicit reply fails: No agent named 'general-purpose' is reachable. Shape #77950: SendMessage addressed to type label",
    );
  }
  if (kind === "stalled") {
    reasons.push(
      "Shape #77950: parent stalls waiting; a parked parent is not a hold",
    );
  }
  if (kind === "tandem") {
    reasons.push(
      "parent still running and still holds keepalive; first delivery is live on both roads",
    );
  }
  if (kind === "dropped") {
    reasons.push(
      "Shape #78338: background agents drop queued SendMessages and skip completion notifications",
    );
  }
  if (kind === "crosstalk") {
    reasons.push("reply addressed by requester; roads crossed on the lever frame");
  }
  if (kind === "sidetracked") {
    reasons.push("nested depth ≥ 2 without a scored misroute; wagon left the intended road");
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

export function stabledOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "stabled";
}

export function misroutedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "misrouted";
}

export function orphanedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "orphaned";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], stabled, misrouted, orphaned }
 * Deterministic. First match wins. Idle stabled first.
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
    stabled: stabledOf(next, verdict),
    misrouted: misroutedOf(next, verdict),
    orphaned: orphanedOf(next, verdict),
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
    firstAnswerToParent: pick("firstAnswerToParent"),
    followUpToRoot: pick("followUpToRoot"),
    parentReceivedFollowUp: pick("parentReceivedFollowUp"),
    childProducedFollowUp: pick("childProducedFollowUp"),
    fromIsAgentType: pick("fromIsAgentType"),
    fromResolves: pick("fromResolves"),
    parentParkedWaiting: pick("parentParkedWaiting"),
    keepaliveClearedAfterFirst: pick("keepaliveClearedAfterFirst"),
    parentRunning: pick("parentRunning"),
    parentCompleted: pick("parentCompleted"),
    parentHoldsKeepalive: pick("parentHoldsKeepalive"),
    replyAddressedByRequester: pick("replyAddressedByRequester"),
    notificationQueuedToRoot: pick("notificationQueuedToRoot"),
    nestedDepth: pick("nestedDepth"),
    childFromLabel: pick("childFromLabel"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    road: fromFields.road,
    frame: fromFields.frame,
    box: fromFields.box,
    yard: fromFields.yard,
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
    product: "shunt",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    stabled: scored.stabled,
    misrouted: scored.misrouted,
    orphaned: scored.orphaned,
    cluster: scored.cluster,
    roadStabled: verdict === "stabled",
    roadMisrouted: verdict === "misrouted",
    roadOrphaned: verdict === "orphaned",
    roadRootbound: verdict === "rootbound",
    roadTypecast: verdict === "typecast",
    roadStalled: verdict === "stalled",
    roadTandem: verdict === "tandem",
    roadDropped: verdict === "dropped",
    roadCrosstalk: verdict === "crosstalk",
    roadSidetracked: verdict === "sidetracked",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    firstAnswerToParent: next.firstAnswerToParent,
    followUpToRoot: next.followUpToRoot,
    parentReceivedFollowUp: next.parentReceivedFollowUp,
    childProducedFollowUp: next.childProducedFollowUp,
    fromIsAgentType: next.fromIsAgentType,
    fromResolves: next.fromResolves,
    parentParkedWaiting: next.parentParkedWaiting,
    keepaliveClearedAfterFirst: next.keepaliveClearedAfterFirst,
    parentRunning: next.parentRunning,
    parentCompleted: next.parentCompleted,
    parentHoldsKeepalive: next.parentHoldsKeepalive,
    replyAddressedByRequester: next.replyAddressedByRequester,
    notificationQueuedToRoot: next.notificationQueuedToRoot,
    nestedDepth: next.nestedDepth,
    childFromLabel: next.childFromLabel,
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
      firstAnswerToParent: Boolean(extras.firstAnswerToParent),
      followUpToRoot: Boolean(extras.followUpToRoot),
      parentReceivedFollowUp: Boolean(extras.parentReceivedFollowUp),
      childProducedFollowUp: Boolean(extras.childProducedFollowUp),
      fromIsAgentType: Boolean(extras.fromIsAgentType),
      fromResolves: Boolean(extras.fromResolves),
      parentParkedWaiting: Boolean(extras.parentParkedWaiting),
      keepaliveClearedAfterFirst: Boolean(extras.keepaliveClearedAfterFirst),
      parentRunning: Boolean(extras.parentRunning),
      parentCompleted: Boolean(extras.parentCompleted),
      parentHoldsKeepalive: Boolean(extras.parentHoldsKeepalive),
      replyAddressedByRequester: Boolean(extras.replyAddressedByRequester),
      notificationQueuedToRoot: Boolean(extras.notificationQueuedToRoot),
      nestedDepth: extras.nestedDepth != null ? Number(extras.nestedDepth) : 0,
      childFromLabel: extras.childFromLabel || "",
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / shut. Wagons in the right road. Nothing scored. */
export function seedStabled() {
  return seedProbe("stabled", "road", {
    session: "stabled",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90463 misrouted.
 * First answer to parent. Child produced SECOND-ANSWER.
 * Follow-up queued to root. Parent parked waiting.
 * from=general-purpose, fromResolves=false, nestedDepth>=2,
 * keepalive cleared after first.
 */
export function seed90463Misrouted() {
  return seedProbe(90463, "anthropics/claude-code#90463", {
    session: "90463-misrouted",
    firstAnswerToParent: true,
    followUpToRoot: true,
    parentReceivedFollowUp: false,
    childProducedFollowUp: true,
    fromIsAgentType: true,
    fromResolves: false,
    parentParkedWaiting: true,
    keepaliveClearedAfterFirst: true,
    parentRunning: false,
    parentCompleted: true,
    parentHoldsKeepalive: false,
    replyAddressedByRequester: false,
    notificationQueuedToRoot: true,
    nestedDepth: 2,
    childFromLabel: TYPE_LABEL,
  });
}

/** Orphaned: child produced follow-up; parent already completed; no keepalive; not queued to root. */
export function seedOrphaned() {
  return seedProbe(75043, "anthropics/claude-code#75043", {
    session: "75043-orphaned",
    childProducedFollowUp: true,
    parentReceivedFollowUp: false,
    parentCompleted: true,
    parentHoldsKeepalive: false,
  });
}

/** Rootbound: follow-up / notification queued to root without the full misroute. */
export function seedRootbound() {
  return seedProbe(77950, "anthropics/claude-code#77950", {
    session: "77950-rootbound",
    notificationQueuedToRoot: true,
  });
}

/** Typecast: from=general-purpose does not resolve. */
export function seedTypecast() {
  return seedProbe(90463, "anthropics/claude-code#90463", {
    session: "90463-typecast",
    fromIsAgentType: true,
    fromResolves: false,
    childFromLabel: TYPE_LABEL,
  });
}

/** Stalled: parent parked waiting. */
export function seedStalled() {
  return seedProbe(77950, "anthropics/claude-code#77950", {
    session: "77950-stalled",
    parentParkedWaiting: true,
  });
}

/** Tandem: parent still running and holds keepalive; first delivery live. */
export function seedTandem() {
  return seedProbe(90463, "anthropics/claude-code#90463", {
    session: "90463-tandem",
    parentRunning: true,
    parentHoldsKeepalive: true,
    firstAnswerToParent: true,
  });
}

/** Dropped: child produced a follow-up that neither parent nor root took. */
export function seedDropped() {
  return seedProbe(78338, "anthropics/claude-code#78338", {
    session: "78338-dropped",
    childProducedFollowUp: true,
    parentReceivedFollowUp: false,
  });
}

/** Crosstalk: reply addressed by requester; roads crossed. */
export function seedCrosstalk() {
  return seedProbe(90463, "anthropics/claude-code#90463", {
    session: "90463-crosstalk",
    replyAddressedByRequester: true,
  });
}

/** Sidetracked: nested depth ≥ 2 without a scored misroute. */
export function seedSidetracked() {
  return seedProbe(77950, "anthropics/claude-code#77950", {
    session: "77950-sidetracked",
    nestedDepth: 2,
  });
}

const SEEDS = {
  stabled: seedStabled,
  misrouted: seed90463Misrouted,
  90463: seed90463Misrouted,
  "90463-misrouted": seed90463Misrouted,
  orphaned: seedOrphaned,
  75043: seedOrphaned,
  "75043-orphaned": seedOrphaned,
  rootbound: seedRootbound,
  77950: seedRootbound,
  "77950-rootbound": seedRootbound,
  typecast: seedTypecast,
  "90463-typecast": seedTypecast,
  stalled: seedStalled,
  "77950-stalled": seedStalled,
  tandem: seedTandem,
  "90463-tandem": seedTandem,
  dropped: seedDropped,
  78338: seedDropped,
  "78338-dropped": seedDropped,
  crosstalk: seedCrosstalk,
  "90463-crosstalk": seedCrosstalk,
  sidetracked: seedSidetracked,
  "77950-sidetracked": seedSidetracked,
};

function misroutedStrike(session) {
  return {
    ...emptyProbe(),
    firstAnswerToParent: true,
    followUpToRoot: true,
    parentReceivedFollowUp: false,
    childProducedFollowUp: true,
    fromIsAgentType: true,
    fromResolves: false,
    parentParkedWaiting: true,
    keepaliveClearedAfterFirst: true,
    parentRunning: false,
    parentCompleted: true,
    parentHoldsKeepalive: false,
    replyAddressedByRequester: false,
    notificationQueuedToRoot: true,
    nestedDepth: 2,
    childFromLabel: TYPE_LABEL,
    session: session || "misrouted",
    source: "road",
    issue: 90463,
    scored: true,
  };
}

function stabledHold(session) {
  return {
    ...emptyProbe(),
    session: session || "stabled",
    source: "hold",
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

  if (verb === "shut" || verb === "bail" || verb === "stabled" || verb === "stable") {
    return pack("stabled", emptyProbe(), { ...action, action: verb === "stable" ? "bail" : verb });
  }

  if (verb === "road" || verb === "misroute" || verb === "points") {
    probe = misroutedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "road" });
  }

  if (verb === "pump-out" || verb === "dry-out" || verb === "stable-out") {
    probe = stabledHold(action.session || probe.session);
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
