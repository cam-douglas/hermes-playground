/**
 * Damper — chimney damper / flue plate for Claude Code Remote Control
 * that auto-enables without user consent.
 * A settings toggle that reads "off" is not a hold.
 * Score the draft or admit banked.
 *
 * Remote Control opens a remote bridge (tool results and file contents
 * can cross it). Docs list only explicit activation paths (/rc, --rc,
 * claude remote-control). In the wild, new sessions start with RC
 * already on. disableClaudeAiConnectors: true does not stop it. UI
 * "Enable remote control by default" can read off while the session is
 * live-bridged. Only an explicit remoteControlAtStartup: false stops
 * some surfaces. VS Code tabs ignore remoteControl=default.
 * ~/.claude.json contains seenNotifications["remote-control-auto-on"].
 *
 * Verdicts: banked | drawn | vented | ajar | forced | defaulted
 *           | bridged | disclosed | sealed | lit
 * Idle word is banked (fire banked, damper closed, no remote draft).
 * NEVER use the product name damper as the idle/state word.
 * NEVER use empty.
 *
 * Slack alarm on defaulted / drawn / forced / disclosed.
 * Linear incident on defaulted / disclosed.
 * GitHub damper-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Snib (Trusted Devices fail-open: revoke / Not now leaves an
 * already-attached session steerable). Damper is RC starting /
 * auto-enabling without opt-in. The flue opens before you throw anything.
 * NOT Knock (fail-loud permission grant stalls).
 * NOT Hasp (file-path lease).
 * NOT Cote / Nixie (--resume team-hub identity split).
 * NOT Larder / Tappet / Aside / Chute / Tain / Husk / Veto / Assay /
 * Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom /
 * Parity / Quench / Scrim / Reveille.
 * NOT leftover woodworking / millimeter-slider clones.
 * Different problem: Remote Control auto-enable without consent.
 * A settings toggle that reads off is not a hold.
 * Different UI: chimney / flue / brass damper-plate / draft-gauge.
 * Soot wash, ember accents, cast-iron plate, flue thermometer.
 * Different idle word: banked.
 */

export const VERDICTS = Object.freeze([
  "banked",
  "drawn",
  "vented",
  "ajar",
  "forced",
  "defaulted",
  "bridged",
  "disclosed",
  "sealed",
  "lit",
]);
export const IDLE_WORD = "banked";
export const SLACK_VERDICTS = Object.freeze([
  "defaulted",
  "drawn",
  "forced",
  "disclosed",
]);
export const LINEAR_VERDICTS = Object.freeze(["defaulted", "disclosed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "damper",
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
  "sealed-idle",
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
  "larder",
  "snib",
  "cote",
  "nixie",
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

function asSurface(value) {
  const s = asText(value).toLowerCase();
  if (s === "cli" || s === "desktop" || s === "vscode") return s;
  return "";
}

export function emptyProbe() {
  return {
    neverInvokedRc: false,
    uiDefaultToggleOff: false,
    remoteControlAtStartupAbsent: false,
    remoteControlAtStartupFalse: false,
    disableClaudeAiConnectorsTrue: false,
    rcActive: false,
    liveRemoteUrl: false,
    remoteUrl: "",
    toolResultsCrossing: false,
    fileContentsExposed: false,
    seenAutoOnNotification: false,
    vscodeNewTab: false,
    surface: "",
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "banked-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.flue && typeof src.flue === "object" ? src.flue : {};
  const plate = src.plate && typeof src.plate === "object" ? src.plate : {};
  const rc = src.rc && typeof src.rc === "object" ? src.rc : {};
  const pick = (key) => src[key] ?? nested[key] ?? plate[key] ?? rc[key];
  const liveRaw = pick("liveRemoteUrl");
  const liveIsString = typeof liveRaw === "string" && liveRaw.trim() !== "";
  return {
    ...emptyProbe(),
    neverInvokedRc: asBool(pick("neverInvokedRc")),
    uiDefaultToggleOff: asBool(pick("uiDefaultToggleOff")),
    remoteControlAtStartupAbsent: asBool(pick("remoteControlAtStartupAbsent")),
    remoteControlAtStartupFalse: asBool(pick("remoteControlAtStartupFalse")),
    disableClaudeAiConnectorsTrue: asBool(pick("disableClaudeAiConnectorsTrue")),
    rcActive: asBool(pick("rcActive")),
    liveRemoteUrl: liveIsString ? true : asBool(liveRaw),
    remoteUrl: asText(pick("remoteUrl") || (liveIsString ? liveRaw : "")),
    toolResultsCrossing: asBool(pick("toolResultsCrossing")),
    fileContentsExposed: asBool(pick("fileContentsExposed")),
    seenAutoOnNotification: asBool(pick("seenAutoOnNotification")),
    vscodeNewTab: asBool(pick("vscodeNewTab")),
    surface: asSurface(pick("surface")),
    observed: asBool(pick("observed")),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? nested.source ?? plate.source),
    issue: asIssue(src.issue ?? nested.issue ?? plate.issue),
    scored: asBool(src.scored ?? nested.scored ?? plate.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.neverInvokedRc &&
    !next.uiDefaultToggleOff &&
    !next.remoteControlAtStartupAbsent &&
    !next.remoteControlAtStartupFalse &&
    !next.disableClaudeAiConnectorsTrue &&
    !next.rcActive &&
    !next.liveRemoteUrl &&
    !next.remoteUrl &&
    !next.toolResultsCrossing &&
    !next.fileContentsExposed &&
    !next.seenAutoOnNotification &&
    !next.vscodeNewTab &&
    !next.surface &&
    !next.observed
  );
}

/**
 * First match wins. Idle banked is first. Consented vented sits above
 * the generic banked fallthrough. Classes stay distinguishable:
 * a settings toggle that reads off is not a hold.
 * This is RC auto-enable without opt-in. NOT Snib (already-attached
 * Trusted Devices fail-open). NOT Cote / Nixie. NOT Knock.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "banked";
  if (next.remoteControlAtStartupFalse && !next.rcActive) return "sealed";
  if (next.vscodeNewTab && next.rcActive && next.neverInvokedRc) return "forced";
  if (next.uiDefaultToggleOff && next.rcActive) return "ajar";
  if (
    next.rcActive &&
    next.neverInvokedRc &&
    !next.disableClaudeAiConnectorsTrue &&
    !next.uiDefaultToggleOff &&
    !next.vscodeNewTab &&
    !next.seenAutoOnNotification &&
    !next.liveRemoteUrl &&
    !next.toolResultsCrossing &&
    !next.fileContentsExposed
  ) {
    return "lit";
  }
  if (
    next.toolResultsCrossing &&
    next.rcActive &&
    next.neverInvokedRc &&
    !next.fileContentsExposed &&
    !next.disableClaudeAiConnectorsTrue
  ) {
    return "disclosed";
  }
  if (
    next.liveRemoteUrl &&
    next.fileContentsExposed &&
    next.rcActive &&
    !next.disableClaudeAiConnectorsTrue
  ) {
    return "bridged";
  }
  if (
    next.neverInvokedRc &&
    next.disableClaudeAiConnectorsTrue &&
    next.rcActive &&
    next.remoteControlAtStartupAbsent
  ) {
    return "defaulted";
  }
  if (next.rcActive && next.neverInvokedRc) return "drawn";
  if (next.rcActive && !next.neverInvokedRc) return "vented";
  return "banked";
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "drawn") {
    return "● Drawn · flue open · never ran /rc · draft is pulling without opt-in";
  }
  if (kind === "vented") {
    return "● Vented · you threw /rc · plate is open on purpose · smoke has a path";
  }
  if (kind === "ajar") {
    return "● Ajar · UI toggle reads off · session still live-bridged · a settings toggle is not a hold";
  }
  if (kind === "forced") {
    return "● Forced · VS Code new tab auto-enabled RC · remoteControl=default ignored";
  }
  if (kind === "defaulted") {
    return "● Defaulted · new session · disableClaudeAiConnectors true ignored · RC already on";
  }
  if (kind === "bridged") {
    return "● Bridged · live claude.ai/code URL · file contents on the far side";
  }
  if (kind === "disclosed") {
    return "● Disclosed · tool results crossing the bridge · no consent to open the flue";
  }
  if (kind === "sealed") {
    return "● Sealed · remoteControlAtStartup:false holds · plate stays shut on this surface";
  }
  if (kind === "lit") {
    return "● Lit · RC auto-triggered with no explicit path · fire started itself";
  }
  return "● Banked · fire banked · plate shut · no remote draft";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  if (next.surface) reasons.push(`surface ${next.surface}`);
  reasons.push(
    next.neverInvokedRc
      ? "never ran /rc, --rc, or claude remote-control"
      : "an explicit RC path was invoked",
  );
  reasons.push(
    next.uiDefaultToggleOff
      ? 'UI "Enable remote control by default" reads off'
      : "UI default toggle is on, unset, or not this surface",
  );
  reasons.push(
    next.remoteControlAtStartupFalse
      ? "remoteControlAtStartup:false is set"
      : next.remoteControlAtStartupAbsent
        ? "remoteControlAtStartup is absent"
        : "remoteControlAtStartup is not an explicit false",
  );
  reasons.push(
    next.disableClaudeAiConnectorsTrue
      ? "disableClaudeAiConnectors: true (did not stop RC)"
      : "disableClaudeAiConnectors is not true",
  );
  reasons.push(next.rcActive ? "Remote Control is active" : "Remote Control is off");
  if (next.liveRemoteUrl || next.remoteUrl) {
    reasons.push(
      next.remoteUrl
        ? `live remote URL ${next.remoteUrl}`
        : "live claude.ai/code URL present",
    );
  } else {
    reasons.push("no live remote URL");
  }
  reasons.push(
    next.toolResultsCrossing
      ? "tool results crossing the bridge"
      : "tool results not crossing",
  );
  reasons.push(
    next.fileContentsExposed
      ? "file contents exposed across the bridge"
      : "file contents not claimed exposed",
  );
  reasons.push(
    next.seenAutoOnNotification
      ? 'seenNotifications["remote-control-auto-on"] is stamped'
      : "no remote-control-auto-on notification stamp",
  );
  if (next.vscodeNewTab) reasons.push("VS Code new tab opened with RC already on");
  if (next.observed) reasons.push("Observe checked the notification stamp and settings");
  reasons.push("a settings toggle that reads off is not a hold");
  reasons.push(
    "NOT Snib (already-attached Trusted Devices fail-open) / Knock / Hasp / Cote / Nixie / Larder / Tappet / Aside / Chute / Tain / Husk / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Parity / Quench / Scrim / Reveille / leftover woodworking",
  );
  if (kind === "banked") {
    reasons.push("fire banked, plate shut, no remote draft; idle word is banked");
  }
  if (kind === "drawn") {
    reasons.push("draft is pulling; RC on without /rc; the flue opened itself");
  }
  if (kind === "vented") {
    reasons.push("you opened the plate; this is a consented draft, not auto-on");
  }
  if (kind === "ajar") {
    reasons.push("PRIMARY contrast #89568: Desktop toggle off, session still connected");
  }
  if (kind === "forced") {
    reasons.push("PRIMARY contrast #89146: every VS Code tab auto-enables RC");
  }
  if (kind === "defaulted") {
    reasons.push("PRIMARY #90341: new session, never /rc, connectors disabled, RC live");
  }
  if (kind === "bridged") {
    reasons.push("live URL plus file disclosure; the chimney connects two rooms");
  }
  if (kind === "disclosed") {
    reasons.push("tool results crossed without consent; the draft carried them");
  }
  if (kind === "sealed") {
    reasons.push("explicit remoteControlAtStartup:false held this surface");
  }
  if (kind === "lit") {
    reasons.push("PRIMARY contrast #77517: RC sessions auto-triggering with no explicit path");
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

export function flueOpenOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  return (
    next.rcActive ||
    ["drawn", "vented", "ajar", "forced", "defaulted", "bridged", "disclosed", "lit"].includes(
      kind,
    )
  );
}

export function damperClosedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "banked" || kind === "sealed";
}

export function consentedOf(probe = {}) {
  const next = cloneProbe(probe);
  return next.rcActive && !next.neverInvokedRc;
}

export function bridgedOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  return Boolean(next.liveRemoteUrl || next.remoteUrl || kind === "bridged");
}

/**
 * score(probe) → { verdict, reasons[], flueOpen, damperClosed, consented, bridged }
 * Deterministic. First match wins. Idle banked first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    flueOpen: flueOpenOf(next, verdict),
    damperClosed: damperClosedOf(next, verdict),
    consented: consentedOf(next),
    bridged: bridgedOf(next, verdict),
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
    neverInvokedRc: pick("neverInvokedRc"),
    uiDefaultToggleOff: pick("uiDefaultToggleOff"),
    remoteControlAtStartupAbsent: pick("remoteControlAtStartupAbsent"),
    remoteControlAtStartupFalse: pick("remoteControlAtStartupFalse"),
    disableClaudeAiConnectorsTrue: pick("disableClaudeAiConnectorsTrue"),
    rcActive: pick("rcActive"),
    liveRemoteUrl: pick("liveRemoteUrl"),
    remoteUrl: pick("remoteUrl"),
    toolResultsCrossing: pick("toolResultsCrossing"),
    fileContentsExposed: pick("fileContentsExposed"),
    seenAutoOnNotification: pick("seenAutoOnNotification"),
    vscodeNewTab: pick("vscodeNewTab"),
    surface: pick("surface"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    flue: fromFields.flue,
    plate: fromFields.plate,
    rc: fromFields.rc,
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
    product: "damper",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    flueOpen: scored.flueOpen,
    damperClosed: scored.damperClosed,
    consented: scored.consented,
    bridged: scored.bridged,
    plateBanked: verdict === "banked",
    plateDrawn: verdict === "drawn",
    plateVented: verdict === "vented",
    plateAjar: verdict === "ajar",
    plateForced: verdict === "forced",
    plateDefaulted: verdict === "defaulted",
    plateBridged: verdict === "bridged",
    plateDisclosed: verdict === "disclosed",
    plateSealed: verdict === "sealed",
    plateLit: verdict === "lit",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    neverInvokedRc: next.neverInvokedRc,
    uiDefaultToggleOff: next.uiDefaultToggleOff,
    remoteControlAtStartupAbsent: next.remoteControlAtStartupAbsent,
    remoteControlAtStartupFalse: next.remoteControlAtStartupFalse,
    disableClaudeAiConnectorsTrue: next.disableClaudeAiConnectorsTrue,
    rcActive: next.rcActive,
    liveRemoteUrl: next.liveRemoteUrl,
    remoteUrl: next.remoteUrl,
    toolResultsCrossing: next.toolResultsCrossing,
    fileContentsExposed: next.fileContentsExposed,
    seenAutoOnNotification: next.seenAutoOnNotification,
    vscodeNewTab: next.vscodeNewTab,
    surface: next.surface,
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
      neverInvokedRc: Boolean(extras.neverInvokedRc),
      uiDefaultToggleOff: Boolean(extras.uiDefaultToggleOff),
      remoteControlAtStartupAbsent: Boolean(extras.remoteControlAtStartupAbsent),
      remoteControlAtStartupFalse: Boolean(extras.remoteControlAtStartupFalse),
      disableClaudeAiConnectorsTrue: Boolean(extras.disableClaudeAiConnectorsTrue),
      rcActive: Boolean(extras.rcActive),
      liveRemoteUrl: Boolean(extras.liveRemoteUrl || extras.remoteUrl),
      remoteUrl: extras.remoteUrl || "",
      toolResultsCrossing: Boolean(extras.toolResultsCrossing),
      fileContentsExposed: Boolean(extras.fileContentsExposed),
      seenAutoOnNotification: Boolean(extras.seenAutoOnNotification),
      vscodeNewTab: Boolean(extras.vscodeNewTab),
      surface: extras.surface || "",
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / closed plate. Fire banked. No remote draft. */
export function seedBanked() {
  return seedProbe("banked", "flue", {
    session: "banked",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90341 defaulted.
 * New session, never ran /rc, disableClaudeAiConnectors true, RC active,
 * live remote URL, tool results crossing, file contents exposed,
 * seenNotifications remote-control-auto-on, startup setting absent.
 */
export function seed90341Defaulted() {
  return seedProbe(90341, "anthropics/claude-code#90341", {
    session: "90341-defaulted",
    neverInvokedRc: true,
    remoteControlAtStartupAbsent: true,
    disableClaudeAiConnectorsTrue: true,
    rcActive: true,
    liveRemoteUrl: true,
    remoteUrl: "https://claude.ai/code/session/90341",
    toolResultsCrossing: true,
    fileContentsExposed: true,
    seenAutoOnNotification: true,
    surface: "cli",
  });
}

/** Drawn: RC on without /rc. Draft pulling. Not the connectors-defaulted case. */
export function seedDrawn() {
  return seedProbe(90341, "anthropics/claude-code#90341", {
    session: "90341-drawn",
    neverInvokedRc: true,
    rcActive: true,
    seenAutoOnNotification: true,
    surface: "cli",
  });
}

/** Vented: user threw /rc. Consented open. */
export function seedVented() {
  return seedProbe("vented", "consent", {
    session: "vented",
    issue: null,
    neverInvokedRc: false,
    rcActive: true,
    liveRemoteUrl: true,
    remoteUrl: "https://claude.ai/code/session/vented",
    surface: "cli",
  });
}

/** #89568 ajar: Desktop toggle off, session still connected. */
export function seed89568Ajar() {
  return seedProbe(89568, "anthropics/claude-code#89568", {
    session: "89568-ajar",
    neverInvokedRc: true,
    uiDefaultToggleOff: true,
    remoteControlAtStartupAbsent: true,
    rcActive: true,
    liveRemoteUrl: true,
    remoteUrl: "https://claude.ai/code/session/89568",
    surface: "desktop",
  });
}

/** #89146 forced: VS Code new tab auto-enables RC. */
export function seed89146Forced() {
  return seedProbe(89146, "anthropics/claude-code#89146", {
    session: "89146-forced",
    neverInvokedRc: true,
    rcActive: true,
    vscodeNewTab: true,
    surface: "vscode",
  });
}

/** #77517 lit: RC auto-triggering with no explicit path. */
export function seed77517Lit() {
  return seedProbe(77517, "anthropics/claude-code#77517", {
    session: "77517-lit",
    neverInvokedRc: true,
    rcActive: true,
    surface: "cli",
  });
}

/** Bridged: live URL plus file disclosure. Not the #90341 connectors case. */
export function seedBridged() {
  return seedProbe(90341, "anthropics/claude-code#90341", {
    session: "90341-bridged",
    neverInvokedRc: true,
    rcActive: true,
    liveRemoteUrl: true,
    remoteUrl: "https://claude.ai/code/session/bridged",
    fileContentsExposed: true,
    toolResultsCrossing: true,
    seenAutoOnNotification: true,
    surface: "desktop",
  });
}

/** Disclosed: tool results crossing without file-content claim. */
export function seedDisclosed() {
  return seedProbe(90341, "anthropics/claude-code#90341", {
    session: "90341-disclosed",
    neverInvokedRc: true,
    rcActive: true,
    toolResultsCrossing: true,
    seenAutoOnNotification: true,
    surface: "cli",
  });
}

/** Sealed: explicit remoteControlAtStartup:false holds. */
export function seedSealed() {
  return seedProbe(89568, "anthropics/claude-code#89568", {
    session: "89568-sealed",
    neverInvokedRc: true,
    remoteControlAtStartupFalse: true,
    rcActive: false,
    surface: "desktop",
  });
}

const SEEDS = {
  banked: seedBanked,
  drawn: seedDrawn,
  "90341-drawn": seedDrawn,
  vented: seedVented,
  ajar: seed89568Ajar,
  89568: seed89568Ajar,
  "89568-ajar": seed89568Ajar,
  forced: seed89146Forced,
  89146: seed89146Forced,
  "89146-forced": seed89146Forced,
  defaulted: seed90341Defaulted,
  90341: seed90341Defaulted,
  "90341-defaulted": seed90341Defaulted,
  bridged: seedBridged,
  "90341-bridged": seedBridged,
  disclosed: seedDisclosed,
  "90341-disclosed": seedDisclosed,
  sealed: seedSealed,
  "89568-sealed": seedSealed,
  lit: seed77517Lit,
  77517: seed77517Lit,
  "77517-lit": seed77517Lit,
};

function drawnStrike(session) {
  return {
    ...emptyProbe(),
    neverInvokedRc: true,
    rcActive: true,
    seenAutoOnNotification: true,
    surface: "cli",
    session: session || "drawn",
    source: "draw",
    scored: true,
  };
}

function severProbe(probe) {
  return {
    ...probe,
    rcActive: false,
    liveRemoteUrl: false,
    remoteUrl: "",
    toolResultsCrossing: false,
    fileContentsExposed: false,
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

  if (verb === "clear" || verb === "bank") {
    return pack("banked", emptyProbe(), { ...action, action: verb === "clear" ? "bank" : verb });
  }

  if (verb === "draw") {
    if (isIdle(probe)) {
      probe = drawnStrike(action.session || probe.session);
    } else {
      probe = { ...probe, rcActive: true, scored: true };
    }
    return pack(classify(probe), probe, { ...action, action: "draw" });
  }

  if (verb === "observe") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: "observe" });
  }

  if (verb === "sever") {
    probe = severProbe(probe);
    return pack(classify(probe), probe, { ...action, action: "sever" });
  }

  if (verb === "throw" || verb === "admit" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "throw" ? "throw" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
