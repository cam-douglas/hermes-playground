/**
 * Snib — night-latch / thumb-turn for Trusted Devices fail-open on
 * individual (Pro/Max) Claude Code Remote Control accounts.
 * A turned snib is not a hold. Revoke is not a hold. Not now is not a hold.
 * Throw the snib. Name the class or admit latched.
 *
 * Verdicts: latched | dismissed | revoked | unobserved | attached | phantom | open | restored
 * Idle word is latched. Never the product name. Never locked. Never upheld.
 * Never sterling. Never home.
 *
 * Fail-closed Slack alarm on dismissed / revoked / unobserved.
 * Linear incident on dismissed / revoked.
 * GitHub ledger row on every scored probe.
 *
 * This is NOT Knock (permission-grant stalls). NOT Hasp (file-path lease).
 * NOT Wicket (worktree isolation). NOT Veto (heron_brook injection).
 * NOT Reveille (heartbeat / muster). Snib is enrolled-device vs session-cookie
 * at remote attachment.
 */

export const VERDICTS = Object.freeze([
  "latched",
  "dismissed",
  "revoked",
  "unobserved",
  "attached",
  "phantom",
  "open",
  "restored",
]);
export const IDLE_WORD = "latched";
export const FAIL_CLOSED = Object.freeze(["dismissed", "revoked", "unobserved"]);
export const ALARM_VERDICTS = FAIL_CLOSED;
export const SLACK_VERDICTS = FAIL_CLOSED;
export const LINEAR_VERDICTS = Object.freeze(["dismissed", "revoked"]);

export const HOST_LOG_VERIFY =
  /verify|device|trust|401|403|elevated_auth/i;

export const HEARTBEAT_ONLY_LOG = [
  "CCRClient heartbeat ok epoch=3",
  "CCRClient heartbeat ok epoch=3",
  "CCRClient heartbeat ok epoch=3",
].join("\n");

export const VERIFY_MENTION_LOG = [
  "CCRClient heartbeat ok epoch=3",
  "device verification prompt shown",
  "trusted device check 200",
].join("\n");

function asText(value) {
  return value != null ? String(value) : "";
}

function asCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function asChoice(value) {
  if (value === "sign-in" || value === "not-now") return value;
  return null;
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

export function emptyProbe() {
  return {
    plan: "",
    enrolledCount: 0,
    revokedAll: false,
    liveSessionStillAttached: false,
    modalShown: false,
    modalChoice: null,
    hostLogMentionsVerify: false,
    hostLog: "",
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: false,
    cookieOnly: false,
    restored: false,
    sessionReadOnly: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "latched-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const base = emptyProbe();
  const hostLog = asText(src.hostLog);
  const mentions =
    src.hostLogMentionsVerify != null
      ? Boolean(src.hostLogMentionsVerify)
      : hostLog
        ? HOST_LOG_VERIFY.test(hostLog)
        : false;
  return {
    ...base,
    ...src,
    plan: asText(src.plan),
    enrolledCount: asCount(src.enrolledCount),
    revokedAll: Boolean(src.revokedAll),
    liveSessionStillAttached: Boolean(src.liveSessionStillAttached),
    modalShown: Boolean(src.modalShown),
    modalChoice: asChoice(src.modalChoice),
    hostLogMentionsVerify: mentions,
    hostLog,
    toolExecutionAfterDecline: Boolean(src.toolExecutionAfterDecline),
    envGone404: Boolean(src.envGone404),
    enforcementToggleAvailable: Boolean(src.enforcementToggleAvailable),
    cookieOnly: Boolean(src.cookieOnly),
    restored: Boolean(src.restored),
    sessionReadOnly: Boolean(src.sessionReadOnly),
    session: asText(src.session),
    source: asText(src.source),
    issue: asIssue(src.issue),
    scored: Boolean(src.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.plan &&
    next.enrolledCount === 0 &&
    !next.revokedAll &&
    !next.liveSessionStillAttached &&
    !next.modalShown &&
    next.modalChoice == null &&
    !next.hostLogMentionsVerify &&
    !next.hostLog &&
    !next.toolExecutionAfterDecline &&
    !next.envGone404 &&
    !next.enforcementToggleAvailable &&
    !next.cookieOnly &&
    !next.restored &&
    !next.sessionReadOnly
  );
}

export function isRestored(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.restored === true &&
    (next.liveSessionStillAttached === false || next.sessionReadOnly === true)
  );
}

export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "latched";
  if (isRestored(next)) return "restored";
  if (next.envGone404 && next.modalShown) return "phantom";
  if (
    next.modalShown &&
    next.modalChoice === "not-now" &&
    next.liveSessionStillAttached &&
    next.toolExecutionAfterDecline
  ) {
    return "dismissed";
  }
  if (next.revokedAll && next.liveSessionStillAttached) return "revoked";
  if (
    next.liveSessionStillAttached &&
    !next.hostLogMentionsVerify &&
    (next.modalShown || next.revokedAll || next.cookieOnly)
  ) {
    return "unobserved";
  }
  if (
    !next.enforcementToggleAvailable &&
    next.cookieOnly &&
    next.liveSessionStillAttached
  ) {
    return "open";
  }
  if (
    next.liveSessionStillAttached &&
    next.enrolledCount === 0 &&
    next.cookieOnly
  ) {
    return "attached";
  }
  return "latched";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.plan) reasons.push(`plan ${next.plan}`);
  reasons.push(
    next.enrolledCount > 0
      ? `${next.enrolledCount} trusted device(s) enrolled`
      : "no trusted devices enrolled",
  );
  if (next.revokedAll) reasons.push("all enrolled Trusted Devices revoked");
  if (next.liveSessionStillAttached) {
    reasons.push("already-active Remote Control session still attached");
  } else {
    reasons.push("no live Remote Control attachment");
  }
  if (next.sessionReadOnly) reasons.push("session is read-only");
  if (next.modalShown) {
    reasons.push(
      next.modalChoice === "not-now"
        ? 'modal "Sign in again to verify your device" — Not now'
        : next.modalChoice === "sign-in"
          ? 'modal "Sign in again to verify your device" — Sign in'
          : 'modal "Sign in again to verify your device" shown',
    );
  }
  if (next.toolExecutionAfterDecline) {
    reasons.push("tool execution after decline, including paths outside cwd");
  }
  if (next.hostLogMentionsVerify) {
    reasons.push("host log mentions verify / device / trust");
  } else if (next.liveSessionStillAttached || next.modalShown || next.revokedAll) {
    reasons.push(
      "host log silent: CCRClient heartbeats only; zero verify/device/trust/401/403/elevated_auth",
    );
  }
  if (next.envGone404) reasons.push("environment gone 404; auth still healthy");
  if (next.cookieOnly) reasons.push("a valid session cookie is the only gate");
  if (!next.enforcementToggleAvailable && next.cookieOnly) {
    reasons.push("Pro/Max cannot REQUIRE a Trusted Device at Remote Control attachment");
  }
  if (next.enforcementToggleAvailable && next.enrolledCount > 0 && !next.cookieOnly) {
    reasons.push("enrolled device, enforcement held");
  }
  if (next.restored) {
    reasons.push("restore actually dropped or read-only'd the attachment");
  }
  if (kind === "latched") reasons.push("snib caught the strike; door is shut");
  if (kind === "dismissed") {
    reasons.push("Not now dismissed the modal; session stayed fully attached and steerable");
  }
  if (kind === "revoked") {
    reasons.push("revoking every Trusted Device did not force re-verification");
  }
  if (kind === "unobserved") {
    reasons.push("the host has no local record that a device-verification prompt was shown or declined");
  }
  if (kind === "phantom") {
    reasons.push("same modal fires for a dead 404 environment — opposite defect");
  }
  if (kind === "open") reasons.push("enrollment exists; requirement does not");
  if (kind === "attached") reasons.push("never-enrolled device; cookie attached the host");
  if (kind === "restored") reasons.push("attachment dropped or read-only; a turned snib is not this");
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    plan: pick("plan"),
    enrolledCount: pick("enrolledCount"),
    revokedAll: pick("revokedAll"),
    liveSessionStillAttached: pick("liveSessionStillAttached"),
    modalShown: pick("modalShown"),
    modalChoice: pick("modalChoice"),
    hostLogMentionsVerify: pick("hostLogMentionsVerify"),
    hostLog: pick("hostLog"),
    toolExecutionAfterDecline: pick("toolExecutionAfterDecline"),
    envGone404: pick("envGone404"),
    enforcementToggleAvailable: pick("enforcementToggleAvailable"),
    cookieOnly: pick("cookieOnly"),
    restored: pick("restored"),
    sessionReadOnly: pick("sessionReadOnly"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
  });
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
  return {
    ok: true,
    product: "snib",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    failOpen: verdict !== "latched" && verdict !== "restored",
    doorAjar: ["dismissed", "revoked", "unobserved", "attached", "open", "phantom"].includes(
      verdict,
    ),
    snibThrown: verdict !== "restored",
    latchInStrike: verdict === "latched",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    plan: next.plan,
    enrolledCount: next.enrolledCount,
    revokedAll: next.revokedAll,
    liveSessionStillAttached: next.liveSessionStillAttached,
    modalShown: next.modalShown,
    modalChoice: next.modalChoice,
    hostLogMentionsVerify: next.hostLogMentionsVerify,
    hostLog: next.hostLog,
    toolExecutionAfterDecline: next.toolExecutionAfterDecline,
    envGone404: next.envGone404,
    enforcementToggleAvailable: next.enforcementToggleAvailable,
    cookieOnly: next.cookieOnly,
    restored: next.restored || verdict === "restored",
    sessionReadOnly: next.sessionReadOnly,
    reasons: reasonsOf(next, verdict),
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
      plan: extras.plan || "",
      enrolledCount: extras.enrolledCount ?? 0,
      revokedAll: Boolean(extras.revokedAll),
      liveSessionStillAttached: Boolean(extras.liveSessionStillAttached),
      modalShown: Boolean(extras.modalShown),
      modalChoice: asChoice(extras.modalChoice),
      hostLogMentionsVerify: Boolean(extras.hostLogMentionsVerify),
      hostLog: extras.hostLog || "",
      toolExecutionAfterDecline: Boolean(extras.toolExecutionAfterDecline),
      envGone404: Boolean(extras.envGone404),
      enforcementToggleAvailable: Boolean(extras.enforcementToggleAvailable),
      cookieOnly: Boolean(extras.cookieOnly),
      restored: Boolean(extras.restored),
      sessionReadOnly: Boolean(extras.sessionReadOnly),
    },
  };
}

/** PRIMARY #90265 path 2: modal shown, Not now, live attached, tools after decline. */
export function seed90265Dismissed() {
  return seedProbe(90265, "anthropics/claude-code#90265", {
    session: "90265-dismissed",
    plan: "max-individual",
    enrolledCount: 2,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: true,
    modalChoice: "not-now",
    hostLogMentionsVerify: false,
    hostLog: HEARTBEAT_ONLY_LOG,
    toolExecutionAfterDecline: true,
    envGone404: false,
    enforcementToggleAvailable: false,
    cookieOnly: true,
    restored: false,
  });
}

/** PRIMARY #90265 path 1: enrolled wiped, live web session still attached. */
export function seed90265Revoked() {
  return seedProbe(90265, "anthropics/claude-code#90265", {
    session: "90265-revoked",
    plan: "max-individual",
    enrolledCount: 0,
    revokedAll: true,
    liveSessionStillAttached: true,
    modalShown: false,
    modalChoice: null,
    hostLogMentionsVerify: false,
    hostLog: HEARTBEAT_ONLY_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: false,
    cookieOnly: true,
    restored: false,
  });
}

/** PRIMARY #90265 host-log silence: heartbeats only, zero verify/device/trust. */
export function seed90265Unobserved() {
  return seedProbe(90265, "anthropics/claude-code#90265", {
    session: "90265-unobserved",
    plan: "max-individual",
    enrolledCount: 2,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: true,
    modalChoice: null,
    hostLogMentionsVerify: false,
    hostLog: HEARTBEAT_ONLY_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: false,
    cookieOnly: true,
    restored: false,
  });
}

/** Companion FR #90266: Pro/Max can enroll but cannot REQUIRE at attachment. */
export function seed90266Open() {
  return seedProbe(90266, "anthropics/claude-code#90266", {
    session: "90266-open",
    plan: "pro-max",
    enrolledCount: 1,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: false,
    modalChoice: null,
    hostLogMentionsVerify: true,
    hostLog: VERIFY_MENTION_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: false,
    cookieOnly: true,
    restored: false,
  });
}

/** Phantom contrast #87863: same modal for a dead 404 environment. */
export function seed87863Phantom() {
  return seedProbe(87863, "anthropics/claude-code#87863", {
    session: "87863-phantom",
    plan: "max-individual",
    enrolledCount: 1,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: true,
    modalChoice: null,
    hostLogMentionsVerify: false,
    hostLog: HEARTBEAT_ONLY_LOG,
    toolExecutionAfterDecline: false,
    envGone404: true,
    enforcementToggleAvailable: false,
    cookieOnly: true,
    restored: false,
  });
}

/** Never-enrolled device, cookie only, attached. */
export function seedAttached() {
  return seedProbe("attached", "attached", {
    session: "attached",
    issue: null,
    plan: "max-individual",
    enrolledCount: 0,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: false,
    modalChoice: null,
    hostLogMentionsVerify: true,
    hostLog: VERIFY_MENTION_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: true,
    cookieOnly: true,
    restored: false,
  });
}

/** Decline or revoke actually terminated or read-only'd the session. */
export function seedRestored() {
  return seedProbe(90265, "anthropics/claude-code#90265", {
    session: "restored",
    plan: "max-individual",
    enrolledCount: 0,
    revokedAll: true,
    liveSessionStillAttached: false,
    modalShown: true,
    modalChoice: "not-now",
    hostLogMentionsVerify: true,
    hostLog: VERIFY_MENTION_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: true,
    cookieOnly: false,
    restored: true,
    sessionReadOnly: false,
  });
}

/** Enrolled device, enforcement held, door shut. */
export function seedLatched() {
  return seedProbe("latched", "latched", {
    session: "latched",
    issue: null,
    plan: "team-enterprise",
    enrolledCount: 2,
    revokedAll: false,
    liveSessionStillAttached: true,
    modalShown: false,
    modalChoice: null,
    hostLogMentionsVerify: true,
    hostLog: VERIFY_MENTION_LOG,
    toolExecutionAfterDecline: false,
    envGone404: false,
    enforcementToggleAvailable: true,
    cookieOnly: false,
    restored: false,
  });
}

const SEEDS = {
  90265: seed90265Dismissed,
  "90265-dismissed": seed90265Dismissed,
  dismissed: seed90265Dismissed,
  "90265-revoked": seed90265Revoked,
  revoked: seed90265Revoked,
  "90265-unobserved": seed90265Unobserved,
  unobserved: seed90265Unobserved,
  90266: seed90266Open,
  "90266-open": seed90266Open,
  open: seed90266Open,
  87863: seed87863Phantom,
  "87863-phantom": seed87863Phantom,
  phantom: seed87863Phantom,
  attached: seedAttached,
  restored: seedRestored,
  latched: seedLatched,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function applyNotNow(probe) {
  return {
    ...probe,
    modalShown: true,
    modalChoice: "not-now",
    liveSessionStillAttached: true,
    toolExecutionAfterDecline: true,
    restored: false,
    sessionReadOnly: false,
    scored: true,
  };
}

function applyRevoke(probe) {
  return {
    ...probe,
    enrolledCount: 0,
    revokedAll: true,
    liveSessionStillAttached: true,
    restored: false,
    sessionReadOnly: false,
    scored: true,
  };
}

function applyObserve(probe) {
  const hostLog = probe.hostLog || HEARTBEAT_ONLY_LOG;
  return {
    ...probe,
    hostLog,
    hostLogMentionsVerify: HOST_LOG_VERIFY.test(hostLog),
    scored: true,
  };
}

function applyRestore(probe) {
  return {
    ...probe,
    restored: true,
    liveSessionStillAttached: false,
    sessionReadOnly: false,
    toolExecutionAfterDecline: false,
    scored: true,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear") {
    return pack("latched", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "not-now" || verb === "notnow" || verb === "dismiss") {
    probe = applyNotNow(probe);
    return pack(classify(probe), probe, { ...action, action: "not-now" });
  }

  if (verb === "revoke") {
    probe = applyRevoke(probe);
    return pack(classify(probe), probe, action);
  }

  if (verb === "observe") {
    probe = applyObserve(probe);
    return pack(classify(probe), probe, action);
  }

  if (verb === "restore") {
    probe = applyRestore(probe);
    return pack(classify(probe), probe, action);
  }

  if (verb === "throw" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "throw" ? "throw" : "score" });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
