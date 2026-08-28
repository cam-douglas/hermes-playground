/**
 * Kist — undertaker's kist / coffin-chest desk for Claude Code
 * Remote Control sessions that are archived on process teardown
 * and never unarchived. A routine desktop auto-update silently
 * removes every open Remote Control session from the mobile
 * default list, permanently.
 *
 * Auto-update / ShipIt / app quit kills every running Code
 * session process. Each session archives its Remote Control
 * (cloud) session during teardown. Sessions vanish from the
 * mobile / claude.ai/code default list and appear only under
 * Archived. Desktop app log records NO archive request (archive
 * is issued by the session process itself). Archiving propagates
 * desktop→cloud. Unarchiving NEVER propagates. LocalSessions.unarchive
 * happens locally with no follow-on CCR request. Reopening locally
 * makes the session active and reattaches the original bridge
 * session id, yet the cloud session stays archived indefinitely.
 * Workaround: unarchive from mobile/web only. Sessions on a
 * separate machine running `claude remote-control` in server
 * mode are unaffected. Suggested fix: teardown caused by an
 * app-initiated restart should take the existing skip-archive path.
 *
 * Verdicts: laid | kisted | risen | hollow | stuck
 *           | lost | sealed | recalled | split | veiled
 * Idle word is laid (lid shut, nothing scored).
 * NEVER use the product name kist as the idle/state word.
 * NEVER use empty.
 * NEVER reuse Wraith unlinked, Gasket tight, Damper banked,
 * Cote roosted, Larder stocked, Tappet seated, Aside heard,
 * Chute clear, Tain paired, Husk kernel, Snib latched,
 * Veto upheld, Assay sterling, Wicket home, Sigil valid,
 * Stencil dry, Suture sealed, Reveille quiet, Livery seised.
 * Do not ship Livery. Do not rename to Livery, Crypt, Morgue,
 * Pall, Cenotaph, Lych, or Wraith.
 *
 * Slack kist alarm when a live RC session is kisted / hollow /
 * stuck / lost / sealed.
 * Linear session-lost ticket on kisted / lost / sealed.
 * GitHub kist-ledger of archive/unarchive asymmetry on every
 * scored probe.
 *
 * Why this is not a clone:
 * NOT Wraith (live-image unlink / afterimage). Same auto-update
 * trigger, different harm: Wraith is the on-disk binary deleted
 * under a live session so TCC/spawns die while grants stay ON.
 * Kist is the cloud session being archived and never unarchived
 * so it vanishes from mobile.
 * NOT Damper (Remote Control auto-enable without consent).
 * Damper is a settings toggle that is not a hold. Kist is
 * archive-on-teardown + one-way archive propagation.
 * NOT Snib (Trusted Devices fail-open).
 * NOT Cote / Nixie (resume hub identity split / placeholder
 * leadSessionId).
 * NOT Reveille (living muster / heartbeats across compaction).
 * NOT Gasket (sandbox allowlist silent discard).
 * NOT leftover woodworking / millimetre-slider clones.
 * A kist is a metaphor for a coffin-chest diagnostic desk,
 * not a leftover-instrument.
 * Different problem: teardown-archive that never unarchives.
 * Different UI: undertaker's / joiner's kist workshop. Warm
 * linen, brass fittings, oak/ash chest, paper labels, hinged
 * lid, ledger book. Light or dusk.
 * Different idle word: laid.
 */

export const VERDICTS = Object.freeze([
  "laid",
  "kisted",
  "risen",
  "hollow",
  "stuck",
  "lost",
  "sealed",
  "recalled",
  "split",
  "veiled",
]);
export const IDLE_WORD = "laid";
export const SLACK_VERDICTS = Object.freeze([
  "kisted",
  "hollow",
  "stuck",
  "lost",
  "sealed",
]);
export const LINEAR_VERDICTS = Object.freeze(["kisted", "lost", "sealed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "kist",
  "empty",
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
  "livery",
  "wraith",
  "gasket",
  "damper",
  "cote",
  "nixie",
  "crypt",
  "morgue",
  "pall",
  "cenotaph",
  "lych",
]);

const TEARDOWN_CAUSES = Object.freeze([
  "auto-update",
  "app quit",
  "user archive",
  "idle",
  "token-refresh",
  "server-mode",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

export function teardownCauses() {
  return TEARDOWN_CAUSES.slice();
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

function asCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function asCause(value) {
  const raw = asText(value).trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, " ");
  if (raw === "app-quit" || raw === "quit") return "app quit";
  if (raw === "autoupdate" || raw === "auto update" || raw === "shipit") return "auto-update";
  if (raw === "user-archive" || raw === "userarchive") return "user archive";
  if (raw === "tokenrefresh" || raw === "token refresh") return "token-refresh";
  if (raw === "servermode" || raw === "server mode") return "server-mode";
  if (TEARDOWN_CAUSES.includes(raw)) return raw;
  return raw;
}

export function emptyProbe() {
  return {
    teardownCause: "",
    ccrArchiveRequested: false,
    ccrUnarchiveRequested: false,
    localUnarchiveRan: false,
    reopenedLocally: false,
    onMobileDefaultList: false,
    vanishedFromDefault: false,
    archivedFilterOnly: false,
    userArchiveAction: false,
    cloudStillArchived: false,
    localSessionActive: false,
    reattachedBridgeId: false,
    archiveStateDiffersPerClient: false,
    noDesktopRestore: false,
    serverMode: false,
    ccrArchiveCount: 0,
    ccrUnarchiveCount: 0,
    localUnarchiveCount: 0,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "laid-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const lid = src.lid && typeof src.lid === "object" ? src.lid : {};
  const funeral = src.funeral && typeof src.funeral === "object" ? src.funeral : {};
  const ledger = src.ledger && typeof src.ledger === "object" ? src.ledger : {};
  const chest = src.chest && typeof src.chest === "object" ? src.chest : {};
  const pick = (key) => src[key] ?? lid[key] ?? funeral[key] ?? ledger[key] ?? chest[key];
  const cause = asCause(pick("teardownCause"));
  const ccrArchiveCount = asCount(pick("ccrArchiveCount"));
  const ccrUnarchiveCount = asCount(pick("ccrUnarchiveCount"));
  const localUnarchiveCount = asCount(pick("localUnarchiveCount"));
  return {
    ...emptyProbe(),
    teardownCause: cause,
    ccrArchiveRequested: asBool(pick("ccrArchiveRequested")) || ccrArchiveCount > 0,
    ccrUnarchiveRequested: asBool(pick("ccrUnarchiveRequested")) || ccrUnarchiveCount > 0,
    localUnarchiveRan: asBool(pick("localUnarchiveRan")) || localUnarchiveCount > 0,
    reopenedLocally: asBool(pick("reopenedLocally")),
    onMobileDefaultList: asBool(pick("onMobileDefaultList")),
    vanishedFromDefault: asBool(pick("vanishedFromDefault")),
    archivedFilterOnly: asBool(pick("archivedFilterOnly")),
    userArchiveAction: asBool(pick("userArchiveAction")) || cause === "user archive",
    cloudStillArchived: asBool(pick("cloudStillArchived")),
    localSessionActive: asBool(pick("localSessionActive")),
    reattachedBridgeId: asBool(pick("reattachedBridgeId")),
    archiveStateDiffersPerClient: asBool(pick("archiveStateDiffersPerClient")),
    noDesktopRestore: asBool(pick("noDesktopRestore")),
    serverMode: asBool(pick("serverMode")) || cause === "server-mode",
    ccrArchiveCount,
    ccrUnarchiveCount,
    localUnarchiveCount,
    observed: asBool(src.observed ?? lid.observed ?? funeral.observed ?? ledger.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? lid.source ?? funeral.source ?? ledger.source),
    issue: asIssue(src.issue ?? lid.issue ?? funeral.issue ?? ledger.issue),
    scored: asBool(src.scored ?? lid.scored ?? funeral.scored ?? ledger.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.teardownCause &&
    !next.ccrArchiveRequested &&
    !next.ccrUnarchiveRequested &&
    !next.localUnarchiveRan &&
    !next.reopenedLocally &&
    !next.onMobileDefaultList &&
    !next.vanishedFromDefault &&
    !next.archivedFilterOnly &&
    !next.userArchiveAction &&
    !next.cloudStillArchived &&
    !next.localSessionActive &&
    !next.reattachedBridgeId &&
    !next.archiveStateDiffersPerClient &&
    !next.noDesktopRestore &&
    !next.serverMode &&
    !next.observed
  );
}

function isTeardownArchive(next) {
  const cause = next.teardownCause;
  if (next.serverMode || cause === "server-mode") return false;
  if (next.userArchiveAction || cause === "user archive") return false;
  if (cause === "idle" || cause === "token-refresh") return false;
  return (
    (cause === "auto-update" || cause === "app quit") &&
    next.ccrArchiveRequested
  );
}

/**
 * First match wins. Idle laid is first. Classes stay distinguishable:
 * a session still on the default list is not a hold. This is
 * teardown-archive that never unarchives.
 * NOT Wraith (live-image unlink). NOT Damper (RC auto-enable).
 * NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "laid";
  if (
    next.ccrUnarchiveRequested &&
    next.onMobileDefaultList &&
    !next.cloudStillArchived
  ) {
    return "risen";
  }
  if (next.archiveStateDiffersPerClient) return "split";
  if (isTeardownArchive(next)) return "kisted";
  if (next.localSessionActive && next.reattachedBridgeId && next.cloudStillArchived) {
    return "hollow";
  }
  if (next.localUnarchiveRan && !next.ccrUnarchiveRequested) return "stuck";
  if (next.vanishedFromDefault) return "lost";
  if (next.noDesktopRestore && next.cloudStillArchived) return "sealed";
  if (next.reopenedLocally && next.reattachedBridgeId) return "recalled";
  if (next.archivedFilterOnly) return "veiled";
  return "laid";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (next.localSessionActive && next.reattachedBridgeId && next.cloudStillArchived) {
    add("hollow");
  }
  if (next.localUnarchiveRan && !next.ccrUnarchiveRequested) add("stuck");
  if (next.vanishedFromDefault) add("lost");
  if (next.archivedFilterOnly) add("veiled");
  if (
    next.noDesktopRestore ||
    (next.cloudStillArchived &&
      !next.ccrUnarchiveRequested &&
      (next.reopenedLocally || next.localUnarchiveRan))
  ) {
    add("sealed");
  }
  if (next.reopenedLocally && next.reattachedBridgeId) add("recalled");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "kisted") {
    return "● Kisted · archived on teardown with no user archive action · cloud session is in the chest";
  }
  if (kind === "risen") {
    return "● Risen · CCR unarchive reached cloud · session is back on the default list";
  }
  if (kind === "hollow") {
    return "● Hollow · local session active and reattached · cloud still archived · cenotaph";
  }
  if (kind === "stuck") {
    return "● Stuck · LocalSessions.unarchive ran locally · zero CCR unarchive to cloud";
  }
  if (kind === "lost") {
    return "● Lost · gone from the mobile default list · only under Archived";
  }
  if (kind === "sealed") {
    return "● Sealed · no desktop-side action restores the cloud session";
  }
  if (kind === "recalled") {
    return "● Recalled · reopened locally · reattached to the original bridge session id";
  }
  if (kind === "split") {
    return "● Split · archive state differs per client · see #65838";
  }
  if (kind === "veiled") {
    return "● Veiled · listed only under the Archived filter";
  }
  return "● Laid · lid shut · nothing scored · idle word is laid";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.teardownCause
      ? `teardown cause ${next.teardownCause}`
      : "no teardown cause scored",
  );
  reasons.push(
    next.ccrArchiveRequested
      ? `CCR archive requested${next.ccrArchiveCount ? ` (${next.ccrArchiveCount})` : ""}`
      : "no CCR archive request on this probe",
  );
  reasons.push(
    next.ccrUnarchiveRequested
      ? `CCR unarchive requested${next.ccrUnarchiveCount ? ` (${next.ccrUnarchiveCount})` : ""}`
      : "zero CCR unarchive to cloud",
  );
  reasons.push(
    next.localUnarchiveRan
      ? `local unarchive ran${next.localUnarchiveCount ? ` (${next.localUnarchiveCount})` : ""} with no follow-on CCR`
      : "local unarchive did not run",
  );
  reasons.push(
    next.reopenedLocally
      ? "session reopened locally"
      : "session was not reopened locally",
  );
  reasons.push(
    next.onMobileDefaultList
      ? "still on the mobile default list"
      : "not on the mobile default list",
  );
  if (next.vanishedFromDefault) {
    reasons.push("vanished from the mobile / claude.ai/code default list");
  }
  if (next.archivedFilterOnly) {
    reasons.push("appears only under the Archived filter");
  }
  if (next.localSessionActive) {
    reasons.push("local session is active");
  }
  if (next.reattachedBridgeId) {
    reasons.push("reattached the original bridge session id");
  }
  if (next.cloudStillArchived) {
    reasons.push("cloud session stays archived indefinitely");
  }
  if (next.noDesktopRestore) {
    reasons.push("no desktop-side action restores the cloud session");
  }
  if (next.serverMode) {
    reasons.push("server-mode remote-control on a separate machine is unaffected");
  }
  if (next.observed) {
    reasons.push("Ledger checked the funeral: archive count, unarchive count, lid");
  }
  reasons.push("a session still on the default list is not a hold");
  reasons.push(
    "NOT Wraith (live-image unlink / afterimage) / Damper (RC auto-enable) / Snib / Cote / Nixie / Reveille / Gasket / leftover woodworking / millimetre-slider",
  );
  if (kind === "laid") {
    reasons.push("lid shut or desk idle; idle word is laid");
  }
  if (kind === "kisted") {
    reasons.push(
      "PRIMARY #90387: auto-update / ShipIt / app quit kills every running Code session; each archives its Remote Control session during teardown; 278 CCR archives, 0 CCR unarchives, 3 local unarchives with no follow-on CCR",
    );
  }
  if (kind === "risen") {
    reasons.push("CCR unarchive reached cloud; session is back on the default list");
  }
  if (kind === "hollow") {
    reasons.push("local session active + reattached, cloud still archived (cenotaph)");
  }
  if (kind === "stuck") {
    reasons.push("LocalSessions.unarchive happens locally with no follow-on CCR request");
  }
  if (kind === "lost") {
    reasons.push("sessions vanish from the mobile default list and appear only under Archived");
  }
  if (kind === "sealed") {
    reasons.push("workaround: unarchive from mobile/web only; desktop cannot restore");
  }
  if (kind === "recalled") {
    reasons.push("reopening locally makes the session active and reattaches the original bridge id");
  }
  if (kind === "split") {
    reasons.push("PRIMARY contrast #65838: archive state is per-client and does not propagate iOS↔macOS");
  }
  if (kind === "veiled") {
    reasons.push("listed only under the Archived filter; default list is empty of this session");
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

export function laidOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "laid";
}

export function kistedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "kisted";
}

export function hollowOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "hollow";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], laid, kisted, hollow }
 * Deterministic. First match wins. Idle laid first.
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
    laid: laidOf(next, verdict),
    kisted: kistedOf(next, verdict),
    hollow: hollowOf(next, verdict),
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
  const nested =
    payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    teardownCause: pick("teardownCause"),
    ccrArchiveRequested: pick("ccrArchiveRequested"),
    ccrUnarchiveRequested: pick("ccrUnarchiveRequested"),
    localUnarchiveRan: pick("localUnarchiveRan"),
    reopenedLocally: pick("reopenedLocally"),
    onMobileDefaultList: pick("onMobileDefaultList"),
    vanishedFromDefault: pick("vanishedFromDefault"),
    archivedFilterOnly: pick("archivedFilterOnly"),
    userArchiveAction: pick("userArchiveAction"),
    cloudStillArchived: pick("cloudStillArchived"),
    localSessionActive: pick("localSessionActive"),
    reattachedBridgeId: pick("reattachedBridgeId"),
    archiveStateDiffersPerClient: pick("archiveStateDiffersPerClient"),
    noDesktopRestore: pick("noDesktopRestore"),
    serverMode: pick("serverMode"),
    ccrArchiveCount: pick("ccrArchiveCount"),
    ccrUnarchiveCount: pick("ccrUnarchiveCount"),
    localUnarchiveCount: pick("localUnarchiveCount"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    lid: fromFields.lid,
    funeral: fromFields.funeral,
    ledger: fromFields.ledger,
    chest: fromFields.chest,
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
    product: "kist",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    laid: scored.laid,
    kisted: scored.kisted,
    hollow: scored.hollow,
    cluster: scored.cluster,
    lidLaid: verdict === "laid",
    lidKisted: verdict === "kisted",
    lidRisen: verdict === "risen",
    lidHollow: verdict === "hollow",
    lidStuck: verdict === "stuck",
    lidLost: verdict === "lost",
    lidSealed: verdict === "sealed",
    lidRecalled: verdict === "recalled",
    lidSplit: verdict === "split",
    lidVeiled: verdict === "veiled",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    teardownCause: next.teardownCause,
    ccrArchiveRequested: next.ccrArchiveRequested,
    ccrUnarchiveRequested: next.ccrUnarchiveRequested,
    localUnarchiveRan: next.localUnarchiveRan,
    reopenedLocally: next.reopenedLocally,
    onMobileDefaultList: next.onMobileDefaultList,
    vanishedFromDefault: next.vanishedFromDefault,
    archivedFilterOnly: next.archivedFilterOnly,
    userArchiveAction: next.userArchiveAction,
    cloudStillArchived: next.cloudStillArchived,
    localSessionActive: next.localSessionActive,
    reattachedBridgeId: next.reattachedBridgeId,
    archiveStateDiffersPerClient: next.archiveStateDiffersPerClient,
    noDesktopRestore: next.noDesktopRestore,
    serverMode: next.serverMode,
    ccrArchiveCount: next.ccrArchiveCount,
    ccrUnarchiveCount: next.ccrUnarchiveCount,
    localUnarchiveCount: next.localUnarchiveCount,
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
      teardownCause: extras.teardownCause || "",
      ccrArchiveRequested: Boolean(extras.ccrArchiveRequested),
      ccrUnarchiveRequested: Boolean(extras.ccrUnarchiveRequested),
      localUnarchiveRan: Boolean(extras.localUnarchiveRan),
      reopenedLocally: Boolean(extras.reopenedLocally),
      onMobileDefaultList: Boolean(extras.onMobileDefaultList),
      vanishedFromDefault: Boolean(extras.vanishedFromDefault),
      archivedFilterOnly: Boolean(extras.archivedFilterOnly),
      userArchiveAction: Boolean(extras.userArchiveAction),
      cloudStillArchived: Boolean(extras.cloudStillArchived),
      localSessionActive: Boolean(extras.localSessionActive),
      reattachedBridgeId: Boolean(extras.reattachedBridgeId),
      archiveStateDiffersPerClient: Boolean(extras.archiveStateDiffersPerClient),
      noDesktopRestore: Boolean(extras.noDesktopRestore),
      serverMode: Boolean(extras.serverMode),
      ccrArchiveCount: asCount(extras.ccrArchiveCount),
      ccrUnarchiveCount: asCount(extras.ccrUnarchiveCount),
      localUnarchiveCount: asCount(extras.localUnarchiveCount),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / clear. Lid shut. Nothing scored. */
export function seedLaid() {
  return seedProbe("laid", "lid", {
    session: "laid",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90387 kisted.
 * Auto-update teardown. 278 CCR archives, 0 CCR unarchives,
 * 3 local unarchives with no follow-on CCR. Session reopened
 * locally (recalled) but cloud stays archived
 * (hollow + stuck + lost + veiled + sealed).
 */
export function seed90387Kisted() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-kisted",
    teardownCause: "auto-update",
    ccrArchiveRequested: true,
    ccrUnarchiveRequested: false,
    localUnarchiveRan: true,
    reopenedLocally: true,
    onMobileDefaultList: false,
    vanishedFromDefault: true,
    archivedFilterOnly: true,
    userArchiveAction: false,
    cloudStillArchived: true,
    localSessionActive: true,
    reattachedBridgeId: true,
    noDesktopRestore: true,
    ccrArchiveCount: 278,
    ccrUnarchiveCount: 0,
    localUnarchiveCount: 3,
  });
}

/** Risen: CCR unarchive reached cloud; back on the default list. */
export function seedRisen() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-risen",
    ccrUnarchiveRequested: true,
    onMobileDefaultList: true,
    cloudStillArchived: false,
    ccrUnarchiveCount: 1,
  });
}

/** Hollow: local active + reattached, cloud still archived. No teardown archive. */
export function seedHollow() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-hollow",
    localSessionActive: true,
    reattachedBridgeId: true,
    cloudStillArchived: true,
  });
}

/** Stuck: local unarchive, zero CCR unarchive. */
export function seedStuck() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-stuck",
    localUnarchiveRan: true,
    localUnarchiveCount: 3,
    ccrUnarchiveRequested: false,
    ccrUnarchiveCount: 0,
  });
}

/** Lost: gone from mobile default list, only under Archived. */
export function seedLost() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-lost",
    vanishedFromDefault: true,
    archivedFilterOnly: true,
    onMobileDefaultList: false,
  });
}

/** Sealed: no desktop-side action restores the cloud session. */
export function seedSealed() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-sealed",
    noDesktopRestore: true,
    cloudStillArchived: true,
  });
}

/** Recalled: reopened locally, reattached to original bridge id. */
export function seedRecalled() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-recalled",
    reopenedLocally: true,
    reattachedBridgeId: true,
  });
}

/** #65838 split: archive state differs per client. */
export function seed65838Split() {
  return seedProbe(65838, "anthropics/claude-code#65838", {
    session: "65838-split",
    archiveStateDiffersPerClient: true,
  });
}

/** Veiled: listed only under the Archived filter. */
export function seedVeiled() {
  return seedProbe(90387, "anthropics/claude-code#90387", {
    session: "90387-veiled",
    archivedFilterOnly: true,
  });
}

const SEEDS = {
  laid: seedLaid,
  kisted: seed90387Kisted,
  90387: seed90387Kisted,
  "90387-kisted": seed90387Kisted,
  risen: seedRisen,
  "90387-risen": seedRisen,
  hollow: seedHollow,
  "90387-hollow": seedHollow,
  stuck: seedStuck,
  "90387-stuck": seedStuck,
  lost: seedLost,
  "90387-lost": seedLost,
  sealed: seedSealed,
  "90387-sealed": seedSealed,
  recalled: seedRecalled,
  "90387-recalled": seedRecalled,
  split: seed65838Split,
  65838: seed65838Split,
  "65838-split": seed65838Split,
  veiled: seedVeiled,
  "90387-veiled": seedVeiled,
};

function kistedStrike(session) {
  return {
    ...emptyProbe(),
    teardownCause: "auto-update",
    ccrArchiveRequested: true,
    ccrUnarchiveRequested: false,
    localUnarchiveRan: true,
    reopenedLocally: true,
    vanishedFromDefault: true,
    archivedFilterOnly: true,
    cloudStillArchived: true,
    localSessionActive: true,
    reattachedBridgeId: true,
    noDesktopRestore: true,
    ccrArchiveCount: 278,
    ccrUnarchiveCount: 0,
    localUnarchiveCount: 3,
    session: session || "kisted",
    source: "funeral",
    issue: 90387,
    scored: true,
  };
}

function risenStrike(session) {
  return {
    ...emptyProbe(),
    ccrUnarchiveRequested: true,
    onMobileDefaultList: true,
    cloudStillArchived: false,
    ccrUnarchiveCount: 1,
    session: session || "risen",
    source: "unarchive",
    scored: true,
  };
}

function recalledStrike(session) {
  return {
    ...emptyProbe(),
    reopenedLocally: true,
    reattachedBridgeId: true,
    session: session || "recalled",
    source: "reopen",
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

  if (verb === "clear" || verb === "seat" || verb === "shut") {
    return pack("laid", emptyProbe(), { ...action, action: verb === "clear" ? "shut" : verb });
  }

  if (verb === "kist" || verb === "archive") {
    probe = kistedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "kist" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "unarchive" || verb === "rise") {
    probe = risenStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "unarchive" });
  }

  if (verb === "reopen") {
    probe = recalledStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "reopen" });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "lift") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
