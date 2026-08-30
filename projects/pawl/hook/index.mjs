#!/usr/bin/env node
/**
 * Pawl — machine-shop ratchet scorer.
 * A tooth that caught the wrong stroke
 * is not a hold. Score the ratchet or
 * admit engaged.
 *
 *   echo '{"doubledTitleRequest":true,"titleRequestCount":2,"hookScriptRan":true,"logSaidAdditionalContext":true,"hookSpecificOutputInTranscript":false,"userPromptSubmitCount":0}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Idle word is engaged.
 * NEVER use engaged for a failure.
 *
 * Primary #90784: UserPromptSubmit
 * hooks permanently stop firing for a
 * session, correlated with a duplicate
 * generate_session_title request.
 *
 * NOT Pale (hooks never load — project
 * root ≠ repo root). NOT Ambo (card
 * never rendered). NOT Cotter (poison
 * fireAt). NOT Fetch (ghost suggestion
 * text). NOT Cenotaph (orphaned
 * advisor_tool_result).
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "engaged",
  "doubled-title",
  "first-turn-race",
  "sticky-delivered",
  "context-orphaned",
  "other-hooks-fine",
  "transcript-blank",
  "log-said-sent",
  "no-user-error",
  "session-lifetime",
  "attachment-different",
  "pale-not-this",
]);
export const IDLE_WORD = "engaged";
export const ALARM_VERDICTS = Object.freeze([
  "doubled-title",
  "first-turn-race",
  "sticky-delivered",
  "context-orphaned",
  "transcript-blank",
  "session-lifetime",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "doubled-title",
  "first-turn-race",
  "sticky-delivered",
]);
export const FEATURED_ISSUE = 90784;
export const CONTRAST_85669 = 85669;
export const CONTRAST_55951 = 55951;
export const CONTRAST_86413 = 86413;
export const CONTRAST_PALE = 90683;
export const DEMO_SPECIMENS = 4;
export const DEMO_VERSION = "2.1.247";
export const DEMO_ENTRYPOINT = "claude-vscode";
export const DEMO_PRETOOL = 999;
export const DEMO_STOP = 17;
export const DEMO_UPS = 0;
export const DEMO_TITLE_COUNT = 2;

const FORBIDDEN_IDLE = Object.freeze([
  "pawl",
  "stood",
  "muted",
  "liveried",
  "penned",
  "underwrit",
  "plated",
  "collated",
  "unheard",
  "passed",
  "squared",
  "bound",
  "girt",
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
  "empty",
  "mute",
  "idle",
  "silent",
  "flat",
  "kernel",
  "valid",
  "sealed",
  "dry",
  "intact",
  "open",
  "still",
  "loose",
  "even",
  "quiet",
  "cool",
  "latched",
  "upheld",
  "sterling",
  "home",
  "cenotaph",
  "fetch",
  "livery",
  "pinfold",
  "palimpsest",
  "pale",
  "ambo",
  "cotter",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(v) {
  return v == null ? "" : String(v);
}
function asNBool(v) {
  if (v === true || v === false) return v;
  return null;
}
function asNNum(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    doubledTitleRequest: null,
    titleRequestCount: null,
    userPromptSubmitFired: null,
    userPromptSubmitCount: null,
    hookScriptRan: null,
    logSaidAdditionalContext: null,
    hookSpecificOutputInTranscript: null,
    otherHooksFine: null,
    preToolUseCount: null,
    stopCount: null,
    sessionStartOk: null,
    noUserError: null,
    stickyForSession: null,
    firstTurnRace: null,
    stickyDelivered: null,
    nearbyAttachmentSkip: false,
    nearbyPaleRoot: false,
    nearbySidebarTitle: false,
    nearbySystemMessageLeak: false,
    specimens: null,
    version: "",
    entrypoint: "",
    nearby: "",
    nearbyDoubledTitle: false,
    nearbyFirstTurnRace: false,
    nearbyStickyDelivered: false,
    nearbyContextOrphaned: false,
    nearbyOtherHooksFine: false,
    nearbyTranscriptBlank: false,
    nearbyLogSaidSent: false,
    nearbyNoUserError: false,
    nearbySessionLifetime: false,
    nearbyAttachmentDifferent: false,
    nearbyPaleNotThis: false,
  };
}

export function cloneProbe(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.pawl && typeof src.pawl === "object" && src.pawl) ||
    (src.ratchet && typeof src.ratchet === "object" && src.ratchet) ||
    src;
  return {
    ...emptyProbe(),
    ...nested,
    doubledTitleRequest: asNBool(nested.doubledTitleRequest),
    titleRequestCount: asNNum(nested.titleRequestCount),
    userPromptSubmitFired: asNBool(nested.userPromptSubmitFired),
    userPromptSubmitCount: asNNum(nested.userPromptSubmitCount),
    hookScriptRan: asNBool(nested.hookScriptRan),
    logSaidAdditionalContext: asNBool(nested.logSaidAdditionalContext),
    hookSpecificOutputInTranscript: asNBool(nested.hookSpecificOutputInTranscript),
    otherHooksFine: asNBool(nested.otherHooksFine),
    preToolUseCount: asNNum(nested.preToolUseCount),
    stopCount: asNNum(nested.stopCount),
    sessionStartOk: asNBool(nested.sessionStartOk),
    noUserError: asNBool(nested.noUserError),
    stickyForSession: asNBool(nested.stickyForSession),
    firstTurnRace: asNBool(nested.firstTurnRace),
    stickyDelivered: asNBool(nested.stickyDelivered),
    nearbyAttachmentSkip: Boolean(nested.nearbyAttachmentSkip),
    nearbyPaleRoot: Boolean(nested.nearbyPaleRoot),
    nearbySidebarTitle: Boolean(nested.nearbySidebarTitle),
    nearbySystemMessageLeak: Boolean(nested.nearbySystemMessageLeak),
    specimens: asNNum(nested.specimens),
    version: asText(nested.version || ""),
    entrypoint: asText(nested.entrypoint || ""),
    nearby: asText(nested.nearby || ""),
    nearbyDoubledTitle: Boolean(nested.nearbyDoubledTitle),
    nearbyFirstTurnRace: Boolean(nested.nearbyFirstTurnRace),
    nearbyStickyDelivered: Boolean(nested.nearbyStickyDelivered),
    nearbyContextOrphaned: Boolean(nested.nearbyContextOrphaned),
    nearbyOtherHooksFine: Boolean(nested.nearbyOtherHooksFine),
    nearbyTranscriptBlank: Boolean(nested.nearbyTranscriptBlank),
    nearbyLogSaidSent: Boolean(nested.nearbyLogSaidSent),
    nearbyNoUserError: Boolean(nested.nearbyNoUserError),
    nearbySessionLifetime: Boolean(nested.nearbySessionLifetime),
    nearbyAttachmentDifferent: Boolean(nested.nearbyAttachmentDifferent),
    nearbyPaleNotThis: Boolean(nested.nearbyPaleNotThis),
  };
}

export function uniqueNearby(row) {
  return Boolean(
    row.nearbyDoubledTitle ||
      row.nearbyFirstTurnRace ||
      row.nearbyStickyDelivered ||
      row.nearbyContextOrphaned ||
      row.nearbyOtherHooksFine ||
      row.nearbyTranscriptBlank ||
      row.nearbyLogSaidSent ||
      row.nearbyNoUserError ||
      row.nearbySessionLifetime ||
      row.nearbyAttachmentDifferent ||
      row.nearbyPaleNotThis ||
      row.nearbyAttachmentSkip ||
      row.nearbyPaleRoot,
  );
}

export function isIdle(input) {
  const row = cloneProbe(input);
  return !(
    row.doubledTitleRequest != null ||
    row.titleRequestCount != null ||
    row.userPromptSubmitFired != null ||
    row.userPromptSubmitCount != null ||
    row.hookScriptRan != null ||
    row.logSaidAdditionalContext != null ||
    row.hookSpecificOutputInTranscript != null ||
    row.otherHooksFine != null ||
    row.preToolUseCount != null ||
    row.stopCount != null ||
    row.sessionStartOk != null ||
    row.noUserError != null ||
    row.stickyForSession != null ||
    row.firstTurnRace != null ||
    row.stickyDelivered != null ||
    row.specimens != null ||
    row.version ||
    row.session ||
    row.source ||
    row.entrypoint ||
    uniqueNearby(row)
  );
}

export function analyze(input) {
  const row = cloneProbe(input);
  const doubled = row.doubledTitleRequest === true || (row.titleRequestCount != null && row.titleRequestCount >= 2);
  const upsDead = row.userPromptSubmitFired === false || row.userPromptSubmitCount === 0;
  const scriptRan = row.hookScriptRan === true;
  const logSent = row.logSaidAdditionalContext === true;
  const transcriptBlank = row.hookSpecificOutputInTranscript === false;
  const othersOk = row.otherHooksFine === true ||
    (row.preToolUseCount != null && row.preToolUseCount > 0) ||
    (row.stopCount != null && row.stopCount > 0);
  const race = row.firstTurnRace === true;
  const sticky = row.stickyDelivered === true || row.stickyForSession === true;
  const pale = row.nearbyPaleRoot === true || row.nearbyPaleNotThis === true;
  const attachment = row.nearbyAttachmentSkip === true || row.nearbyAttachmentDifferent === true;
  const primaryTriad = Boolean(
    doubled &&
      scriptRan &&
      logSent &&
      transcriptBlank &&
      upsDead &&
      !uniqueNearby(row) &&
      !pale &&
      !attachment,
  );
  const honest = Boolean(
    row.userPromptSubmitFired === true &&
      row.hookSpecificOutputInTranscript === true &&
      row.doubledTitleRequest !== true &&
      (row.titleRequestCount == null || row.titleRequestCount <= 1) &&
      !uniqueNearby(row) &&
      !pale &&
      !attachment,
  );
  return {
    row,
    doubled,
    upsDead,
    scriptRan,
    logSent,
    transcriptBlank,
    othersOk,
    race,
    sticky,
    pale,
    attachment,
    primaryTriad,
    honest,
  };
}

export function classify(input) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "engaged";
  if (!analyze(row).primaryTriad) {
    if (row.nearbyPaleNotThis || row.nearbyPaleRoot) return "pale-not-this";
    if (row.nearbyAttachmentDifferent || row.nearbyAttachmentSkip) return "attachment-different";
    if (row.nearbySessionLifetime) return "session-lifetime";
    if (row.nearbyNoUserError) return "no-user-error";
    if (row.nearbyLogSaidSent) return "log-said-sent";
    if (row.nearbyTranscriptBlank) return "transcript-blank";
    if (row.nearbyOtherHooksFine) return "other-hooks-fine";
    if (row.nearbyContextOrphaned) return "context-orphaned";
    if (row.nearbyStickyDelivered) return "sticky-delivered";
    if (row.nearbyFirstTurnRace) return "first-turn-race";
    if (row.nearbyDoubledTitle) return "doubled-title";
  }
  const f = analyze(row);
  if (f.primaryTriad) return "doubled-title";
  if (f.honest) return "engaged";
  if (f.pale) return "pale-not-this";
  if (f.attachment) return "attachment-different";
  if (f.race && f.doubled) return "first-turn-race";
  if (row.stickyDelivered === true) return "sticky-delivered";
  if (f.scriptRan && f.transcriptBlank && f.logSent) return "context-orphaned";
  if (f.othersOk && f.upsDead && !f.doubled) return "other-hooks-fine";
  if (f.transcriptBlank && f.scriptRan && !f.logSent) return "transcript-blank";
  if (f.logSent && f.transcriptBlank) return "log-said-sent";
  if (row.noUserError === true && f.upsDead) return "no-user-error";
  if (row.stickyForSession === true && f.upsDead) return "session-lifetime";
  if (f.doubled && f.upsDead) return "doubled-title";
  return "engaged";
}

export function feedOf(kind) {
  if (kind === "doubled-title") {
    return "● Doubled-title · two generate_session_title requests within ~100ms · primary #90784";
  }
  if (kind === "first-turn-race") {
    return "● First-turn-race · title generation races the first real turn for hook-context attachment";
  }
  if (kind === "sticky-delivered") {
    return "● Sticky-delivered · session marked already-delivered; later turns never retry UserPromptSubmit";
  }
  if (kind === "context-orphaned") {
    return "● Context-orphaned · additionalContext generated and logged, never reaches the model";
  }
  if (kind === "other-hooks-fine") {
    return "● Other-hooks-fine · SessionStart / PreToolUse / PostToolUse / Stop keep working";
  }
  if (kind === "transcript-blank") {
    return "● Transcript-blank · hookSpecificOutput never appears in the session transcript";
  }
  if (kind === "log-said-sent") {
    return "● Log-said-sent · extension host log says the script provided additionalContext";
  }
  if (kind === "no-user-error") {
    return "● No-user-error · Claude Code UI shows no error, warning, or miss";
  }
  if (kind === "session-lifetime") {
    return "● Session-lifetime · UserPromptSubmit stays dead for the whole session";
  }
  if (kind === "attachment-different") {
    return "● Attachment-different · nearby #85669 skips UserPromptSubmit on attachment, not a doubled title";
  }
  if (kind === "pale-not-this") {
    return "● Pale-not-this · Pale #90683 is hooks never loading because project root ≠ repo root";
  }
  return "● Engaged · honest ratchet · UserPromptSubmit fires and hookSpecificOutput lands in the transcript · idle word is engaged";
}

export function reasonsOf(input, kind) {
  const f = analyze(input);
  const reasons = [`verdict ${kind}`];
  if (kind === "doubled-title" || f.primaryTriad) {
    reasons.push(
      "#90784 UserPromptSubmit hooks permanently stop firing, correlated with a duplicate generate_session_title request",
    );
  }
  if (f.doubled) {
    reasons.push(
      `doubled generate_session_title: ${f.row.titleRequestCount ?? DEMO_TITLE_COUNT} requests within ~100ms`,
    );
  }
  if (f.upsDead) {
    reasons.push(
      `UserPromptSubmit count ${f.row.userPromptSubmitCount ?? DEMO_UPS} across the session lifetime`,
    );
  }
  if (f.scriptRan) reasons.push("hook scripts still run");
  if (f.logSent) reasons.push('extension host log: "provided additionalContext"');
  if (f.transcriptBlank) reasons.push("hookSpecificOutput never appears in the session transcript");
  if (f.othersOk) {
    reasons.push(
      `other hooks fine: PreToolUse ${f.row.preToolUseCount ?? DEMO_PRETOOL} / Stop ${f.row.stopCount ?? DEMO_STOP}`,
    );
  }
  if (f.race) reasons.push("first-turn race for hook-context attachment");
  if (f.sticky) reasons.push("sticky already-delivered state for the session lifetime");
  if (f.row.noUserError) reasons.push("no user-visible error or warning");
  if (f.pale) reasons.push("Pale #90683 contrast: hooks never load because project root ≠ repo root — not this tooth");
  if (f.attachment) reasons.push("nearby #85669 UserPromptSubmit skipped on attachment — not a doubled title");
  if (f.row.specimens != null) reasons.push(`${f.row.specimens} specimens`);
  if (kind === "engaged") {
    reasons.push(
      "UserPromptSubmit fires; hookSpecificOutput lands in the transcript; a single generate_session_title; idle word is engaged",
    );
  }
  return reasons;
}

export function verdictOf(input) {
  return classify(input);
}

export function engagedOf(input) {
  return classify(input) === "engaged";
}

export function score(probe) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  const f = analyze(row);
  return {
    verdict: kind,
    state: kind,
    engaged: kind === "engaged",
    alarm: ALARM_VERDICTS.includes(kind),
    linear: LINEAR_VERDICTS.includes(kind),
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    facts: {
      primaryTriad: f.primaryTriad,
      honest: f.honest,
      doubled: f.doubled,
      upsDead: f.upsDead,
      scriptRan: f.scriptRan,
      logSent: f.logSent,
      transcriptBlank: f.transcriptBlank,
      othersOk: f.othersOk,
      race: f.race,
      sticky: f.sticky,
      pale: f.pale,
      attachment: f.attachment,
    },
    reasons: reasonsOf(row, kind),
    feed: feedOf(kind),
    probe: row,
  };
}

export function emptyAction(action = "idle") {
  return { action, pawl: emptyProbe() };
}

export function seed90784() {
  return seedDoubledTitle();
}

export function seedDoubledTitle() {
  return {
    action: "score",
    session: "90784-doubled-title",
    issue: FEATURED_ISSUE,
    source:
      "primary #90784 duplicate generate_session_title; hook script ran and logged additionalContext; hookSpecificOutput absent from transcript; UserPromptSubmit dead for the session",
    doubledTitleRequest: true,
    titleRequestCount: DEMO_TITLE_COUNT,
    userPromptSubmitFired: false,
    userPromptSubmitCount: DEMO_UPS,
    hookScriptRan: true,
    logSaidAdditionalContext: true,
    hookSpecificOutputInTranscript: false,
    otherHooksFine: true,
    preToolUseCount: DEMO_PRETOOL,
    stopCount: DEMO_STOP,
    sessionStartOk: true,
    noUserError: true,
    stickyForSession: true,
    firstTurnRace: true,
    stickyDelivered: true,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedEngaged() {
  return {
    action: "score",
    session: "engaged-hold",
    issue: FEATURED_ISSUE,
    source:
      "honest control: single generate_session_title; UserPromptSubmit fires; hookSpecificOutput lands in the transcript",
    doubledTitleRequest: false,
    titleRequestCount: 1,
    userPromptSubmitFired: true,
    userPromptSubmitCount: 4,
    hookScriptRan: true,
    logSaidAdditionalContext: true,
    hookSpecificOutputInTranscript: true,
    otherHooksFine: true,
    preToolUseCount: 12,
    stopCount: 3,
    sessionStartOk: true,
    noUserError: true,
    stickyForSession: false,
    firstTurnRace: false,
    stickyDelivered: false,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedControl() {
  return seedEngaged();
}

export function seedReset() {
  return emptyAction("reset");
}

function nearbySeed(name, flag) {
  return {
    session: `90784-${name}`,
    issue: FEATURED_ISSUE,
    [flag]: true,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedFirstTurnRace() {
  return { ...nearbySeed("first-turn-race", "nearbyFirstTurnRace"), firstTurnRace: true };
}
export function seedStickyDelivered() {
  return { ...nearbySeed("sticky-delivered", "nearbyStickyDelivered"), stickyDelivered: true };
}
export function seedContextOrphaned() {
  return {
    ...nearbySeed("context-orphaned", "nearbyContextOrphaned"),
    hookScriptRan: true,
    logSaidAdditionalContext: true,
    hookSpecificOutputInTranscript: false,
  };
}
export function seedOtherHooksFine() {
  return {
    ...nearbySeed("other-hooks-fine", "nearbyOtherHooksFine"),
    otherHooksFine: true,
    preToolUseCount: DEMO_PRETOOL,
    stopCount: DEMO_STOP,
  };
}
export function seedTranscriptBlank() {
  return {
    ...nearbySeed("transcript-blank", "nearbyTranscriptBlank"),
    hookSpecificOutputInTranscript: false,
    hookScriptRan: true,
  };
}
export function seedLogSaidSent() {
  return {
    ...nearbySeed("log-said-sent", "nearbyLogSaidSent"),
    logSaidAdditionalContext: true,
  };
}
export function seedNoUserError() {
  return { ...nearbySeed("no-user-error", "nearbyNoUserError"), noUserError: true };
}
export function seedSessionLifetime() {
  return {
    ...nearbySeed("session-lifetime", "nearbySessionLifetime"),
    stickyForSession: true,
    userPromptSubmitCount: 0,
  };
}
export function seedAttachmentDifferent() {
  return {
    session: "85669-attachment",
    issue: CONTRAST_85669,
    nearbyAttachmentSkip: true,
    nearbyAttachmentDifferent: true,
    version: DEMO_VERSION,
  };
}
export function seedPaleNotThis() {
  return {
    session: "90683-pale",
    issue: CONTRAST_PALE,
    nearbyPaleRoot: true,
    nearbyPaleNotThis: true,
    version: DEMO_VERSION,
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "90784" || key === "doubled-title" || key === "doubled") return decide(seedDoubledTitle());
  if (key === "control" || key === "engaged" || key === "honest") return decide(seedEngaged());
  if (key === "first-turn-race") return decide(seedFirstTurnRace());
  if (key === "sticky-delivered") return decide(seedStickyDelivered());
  if (key === "context-orphaned") return decide(seedContextOrphaned());
  if (key === "other-hooks-fine") return decide(seedOtherHooksFine());
  if (key === "transcript-blank") return decide(seedTranscriptBlank());
  if (key === "log-said-sent") return decide(seedLogSaidSent());
  if (key === "no-user-error") return decide(seedNoUserError());
  if (key === "session-lifetime") return decide(seedSessionLifetime());
  if (key === "attachment-different" || key === "85669") return decide(seedAttachmentDifferent());
  if (key === "pale-not-this" || key === "pale" || key === "90683") return decide(seedPaleNotThis());
  return decide(emptyAction("idle"));
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return cloneProbe(parsed);
    }
  } catch {
    /* transcript prose / jsonl */
  }
  const probe = emptyProbe();
  const lower = text.toLowerCase();
  const titleHits = [...text.matchAll(/source=generate_session_title/g)].length;
  if (titleHits >= 2 || /doubled|duplicate.*generate_session_title|two generate_session_title/.test(lower)) {
    probe.doubledTitleRequest = true;
    probe.titleRequestCount = Math.max(titleHits, 2);
  } else if (titleHits === 1) {
    probe.doubledTitleRequest = false;
    probe.titleRequestCount = 1;
  }
  const upsMatch = text.match(/UserPromptSubmit[^0-9]*(\d+)/i);
  if (upsMatch) probe.userPromptSubmitCount = Number(upsMatch[1]);
  if (/zero userpromptsubmit|userpromptsubmit.*(stop|dead|never|zero|0\b)/i.test(text)) {
    probe.userPromptSubmitFired = false;
    if (probe.userPromptSubmitCount == null) probe.userPromptSubmitCount = 0;
  }
  if (/provided additionalcontext/i.test(text)) {
    probe.logSaidAdditionalContext = true;
    probe.hookScriptRan = true;
  }
  if (/hookspecificoutput/.test(lower) && /never|absent|blank|missing|∅|null/.test(lower)) {
    probe.hookSpecificOutputInTranscript = false;
  }
  if (/pretooluse|posttooluse|sessionstart|stop hooks/.test(lower)) probe.otherHooksFine = true;
  const preMatch = text.match(/(\d+)\s+PreToolUse/i);
  const stopMatch = text.match(/(\d+)\s+Stop/i);
  if (preMatch) probe.preToolUseCount = Number(preMatch[1]);
  if (stopMatch) probe.stopCount = Number(stopMatch[1]);
  if (/no (user[- ]?)?(error|warning)/i.test(text)) probe.noUserError = true;
  if (/session lifetime|sticky|already.?delivered/i.test(text)) probe.stickyForSession = true;
  if (/first[- ]turn|race/.test(lower)) probe.firstTurnRace = true;
  if (/#?85669|attachment/.test(lower)) probe.nearbyAttachmentSkip = true;
  if (/#?90683|pale|project root/.test(lower)) probe.nearbyPaleRoot = true;
  if (/2\.1\.247/.test(text)) probe.version = DEMO_VERSION;
  if (/#?90784/.test(text)) probe.issue = FEATURED_ISSUE;
  if (/claude-vscode|vscode/.test(lower)) probe.entrypoint = DEMO_ENTRYPOINT;
  return probe;
}

export function decide(payload = {}) {
  const action = asText(payload.action || payload.pawl?.action || "").toLowerCase();
  if (action === "restore" || action === "90784") return score(seedDoubledTitle());
  if (action === "reset" || action === "bail" || action === "idle") return score(emptyProbe());
  if (action === "control" || action === "engaged") return score(seedEngaged());
  const probe =
    payload.probe ||
    payload.pawl ||
    payload.ratchet ||
    (payload.cenotaph || payload.fetch ? emptyProbe() : payload);
  return score(probe);
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "doubled-title") {
    return "Pawl doubled-title. Two generate_session_title requests; UserPromptSubmit dead for the session. #90784.";
  }
  if (result.verdict === "first-turn-race") {
    return "Pawl first-turn-race. Title generation raced the first real turn for hook-context attachment.";
  }
  if (result.verdict === "sticky-delivered") {
    return "Pawl sticky-delivered. Session marked already-delivered; later turns never retry UserPromptSubmit.";
  }
  if (result.verdict === "context-orphaned") {
    return "Pawl context-orphaned. additionalContext logged but never reached the model.";
  }
  if (result.verdict === "transcript-blank") {
    return "Pawl transcript-blank. hookSpecificOutput never appears in the session transcript.";
  }
  if (result.verdict === "session-lifetime") {
    return "Pawl session-lifetime. UserPromptSubmit stays dead for the whole session.";
  }
  return "Pawl refuse. A tooth that caught the wrong stroke is not a hold.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: deny
        ? denyMessage(result)
        : "Pawl engaged. UserPromptSubmit fires; hookSpecificOutput lands in the transcript. Idle word is engaged.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedDoubledTitle();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.pawl || parsed.probe || parsed.ratchet
        ? parsed
        : { action: "score", pawl: cloneProbe(parsed) };
    }
  } catch {
    return { action: "score", pawl: parseTranscript(text) };
  }
  return { action: "score", pawl: parseTranscript(text) };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedDoubledTitle());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
