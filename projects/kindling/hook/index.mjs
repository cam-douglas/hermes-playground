#!/usr/bin/env node
/**
 * Kindling — hearth / firebox / kindling-rack scorer.
 * A preview spark that never takes is not
 * a hold. Score the rack or
 * admit cued.
 *
 *   echo '{"warmLifecyclePreview":true,"startShellPty":true,"neverUsed":true,"remappedToPreexisting":true,"focusSwitch":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Idle word is cued.
 * NEVER use cued for a failure.
 *
 * Primary #90798: Desktop every session
 * switch spawns a throwaway Claude Code
 * session. WarmLifecycle:preview warm
 * fires SessionStart, writes per-session
 * dirs, increments session.count, and is
 * discarded without ever receiving a
 * message. Resume maps local_* to a
 * pre-existing CLI uuid.
 *
 * NOT Deadband (#90789 settings echo).
 * NOT Pawl (#90784 UserPromptSubmit stop).
 * NOT Cenotaph (#90771 advisor widow).
 * NOT Fetch (#90755 ghost suggestions).
 * NOT Livery (#90748 TCC path churn).
 * NOT Fob (#90527 Keychain litter).
 * NOT Lacuna (#90709 Task store wipe).
 * NOT Fusee (#90485 early schedule).
 * NOT Damper (#90341 Remote Control).
 * NOT Reveille / Husk / Wraith.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "cued",
  "warmed",
  "discarded",
  "session-start",
  "littered",
  "inflated",
  "remapped",
  "switch-focus",
  "hook-ash",
  "otel-skew",
]);
export const IDLE_WORD = "cued";
export const ALARM_VERDICTS = Object.freeze([
  "discarded",
  "littered",
  "inflated",
  "otel-skew",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "discarded",
  "inflated",
  "littered",
]);
export const FEATURED_ISSUE = 90798;
export const CONTRAST_76268 = 76268;
export const CONTRAST_85104 = 85104;
export const CONTRAST_82023 = 82023;
export const CONTRAST_73512 = 73512;
export const CONTRAST_DEADBAND = 90789;
export const CONTRAST_PAWL = 90784;
export const BUSY_DAY_SWITCHES = 137;
export const BUSY_DAY_PTY = 137;
export const BUSY_DAY_ON_DISK = 116;
export const BUSY_DAY_MAPPED = 4;
export const BUSY_DAY_UNUSED = 113;
export const WEEK_UNUSED = 950;
export const WEEK_CONVERSATION = 57;
export const WASTE_PCT = 94;
export const DEMO_VERSION = "2.1.247";
export const DEMO_DESKTOP = "1.40609.0";
export const DEMO_ENTRYPOINT = "claude-desktop";

const FORBIDDEN_IDLE = Object.freeze([
  "kindling",
  "fresh",
  "engaged",
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
  "deadband",
  "pawl",
  "cenotaph",
  "fetch",
  "livery",
  "fob",
  "lacuna",
  "fusee",
  "damper",
  "reveille",
  "husk",
  "wraith",
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
    warmLifecyclePreview: null,
    warmingUp: null,
    startShellPty: null,
    cliSpawned: null,
    throwawaySpawn: null,
    focusSwitch: null,
    setFocusedSession: null,
    focusSwitches: null,
    startShellPtyCount: null,
    cliSessionsOnDisk: null,
    mappedCount: null,
    unusedCount: null,
    neverUsed: null,
    messageReceived: null,
    mappedToConversation: null,
    remappedToPreexisting: null,
    sessionStartFired: null,
    sessionEnvCreated: null,
    projectDirCreated: null,
    pruned: null,
    sessionCountIncremented: null,
    tokensFlat: null,
    costFlat: null,
    activeTimeFlat: null,
    hookStdoutCaptured: null,
    warmReusesExisting: null,
    warmDeferredUntilAttach: null,
    attachedToWarm: null,
    unusedWeek: null,
    conversationWeek: null,
    version: "",
    entrypoint: "",
    nearby: "",
    nearbyWarmed: false,
    nearbyDiscarded: false,
    nearbySessionStart: false,
    nearbyLittered: false,
    nearbyInflated: false,
    nearbyRemapped: false,
    nearbySwitchFocus: false,
    nearbyHookAsh: false,
    nearbyOtelSkew: false,
    nearbyProcessTree: false,
    nearbyDeadband: false,
  };
}

export function cloneProbe(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.kindling && typeof src.kindling === "object" && src.kindling) ||
    (src.hearth && typeof src.hearth === "object" && src.hearth) ||
    src;
  return {
    ...emptyProbe(),
    ...nested,
    warmLifecyclePreview: asNBool(nested.warmLifecyclePreview),
    warmingUp: asNBool(nested.warmingUp),
    startShellPty: asNBool(nested.startShellPty),
    cliSpawned: asNBool(nested.cliSpawned),
    throwawaySpawn: asNBool(nested.throwawaySpawn),
    focusSwitch: asNBool(nested.focusSwitch),
    setFocusedSession: asNBool(nested.setFocusedSession),
    focusSwitches: asNNum(nested.focusSwitches),
    startShellPtyCount: asNNum(nested.startShellPtyCount),
    cliSessionsOnDisk: asNNum(nested.cliSessionsOnDisk),
    mappedCount: asNNum(nested.mappedCount),
    unusedCount: asNNum(nested.unusedCount),
    neverUsed: asNBool(nested.neverUsed),
    messageReceived: asNBool(nested.messageReceived),
    mappedToConversation: asNBool(nested.mappedToConversation),
    remappedToPreexisting: asNBool(nested.remappedToPreexisting),
    sessionStartFired: asNBool(nested.sessionStartFired),
    sessionEnvCreated: asNBool(nested.sessionEnvCreated),
    projectDirCreated: asNBool(nested.projectDirCreated),
    pruned: asNBool(nested.pruned),
    sessionCountIncremented: asNBool(nested.sessionCountIncremented),
    tokensFlat: asNBool(nested.tokensFlat),
    costFlat: asNBool(nested.costFlat),
    activeTimeFlat: asNBool(nested.activeTimeFlat),
    hookStdoutCaptured: asNBool(nested.hookStdoutCaptured),
    warmReusesExisting: asNBool(nested.warmReusesExisting),
    warmDeferredUntilAttach: asNBool(nested.warmDeferredUntilAttach),
    attachedToWarm: asNBool(nested.attachedToWarm),
    unusedWeek: asNNum(nested.unusedWeek),
    conversationWeek: asNNum(nested.conversationWeek),
    version: asText(nested.version || ""),
    entrypoint: asText(nested.entrypoint || ""),
    nearby: asText(nested.nearby || ""),
    nearbyWarmed: Boolean(nested.nearbyWarmed),
    nearbyDiscarded: Boolean(nested.nearbyDiscarded),
    nearbySessionStart: Boolean(nested.nearbySessionStart),
    nearbyLittered: Boolean(nested.nearbyLittered),
    nearbyInflated: Boolean(nested.nearbyInflated),
    nearbyRemapped: Boolean(nested.nearbyRemapped),
    nearbySwitchFocus: Boolean(nested.nearbySwitchFocus),
    nearbyHookAsh: Boolean(nested.nearbyHookAsh),
    nearbyOtelSkew: Boolean(nested.nearbyOtelSkew),
    nearbyProcessTree: Boolean(nested.nearbyProcessTree),
    nearbyDeadband: Boolean(nested.nearbyDeadband),
  };
}

export function uniqueNearby(row) {
  return Boolean(
    row.nearbyWarmed ||
      row.nearbyDiscarded ||
      row.nearbySessionStart ||
      row.nearbyLittered ||
      row.nearbyInflated ||
      row.nearbyRemapped ||
      row.nearbySwitchFocus ||
      row.nearbyHookAsh ||
      row.nearbyOtelSkew ||
      row.nearbyProcessTree ||
      row.nearbyDeadband,
  );
}

export function isIdle(input) {
  const row = cloneProbe(input);
  return !(
    row.warmLifecyclePreview != null ||
    row.warmingUp != null ||
    row.startShellPty != null ||
    row.cliSpawned != null ||
    row.throwawaySpawn != null ||
    row.focusSwitch != null ||
    row.setFocusedSession != null ||
    row.focusSwitches != null ||
    row.startShellPtyCount != null ||
    row.cliSessionsOnDisk != null ||
    row.mappedCount != null ||
    row.unusedCount != null ||
    row.neverUsed != null ||
    row.messageReceived != null ||
    row.mappedToConversation != null ||
    row.remappedToPreexisting != null ||
    row.sessionStartFired != null ||
    row.sessionEnvCreated != null ||
    row.projectDirCreated != null ||
    row.pruned != null ||
    row.sessionCountIncremented != null ||
    row.tokensFlat != null ||
    row.costFlat != null ||
    row.activeTimeFlat != null ||
    row.hookStdoutCaptured != null ||
    row.warmReusesExisting != null ||
    row.warmDeferredUntilAttach != null ||
    row.attachedToWarm != null ||
    row.unusedWeek != null ||
    row.conversationWeek != null ||
    row.version ||
    row.session ||
    row.source ||
    row.entrypoint ||
    uniqueNearby(row)
  );
}

export function analyze(input) {
  const row = cloneProbe(input);
  const warmPreview = row.warmLifecyclePreview === true || row.warmingUp === true;
  const spawned = row.cliSpawned === true || row.startShellPty === true || row.throwawaySpawn === true;
  const unused =
    row.neverUsed === true ||
    row.messageReceived === false ||
    row.mappedToConversation === false ||
    (row.unusedCount != null && row.unusedCount > 0 && (row.mappedCount == null || row.mappedCount < row.unusedCount));
  const remapped = row.remappedToPreexisting === true;
  const focusDriver = row.focusSwitch === true || row.setFocusedSession === true || (row.focusSwitches != null && row.focusSwitches > 0);
  const sessionStart = row.sessionStartFired === true;
  const litter = row.sessionEnvCreated === true || row.projectDirCreated === true;
  const unpruned = row.pruned === false;
  const inflated = row.sessionCountIncremented === true;
  const otelSkew =
    inflated &&
    (row.tokensFlat === true || row.costFlat === true || row.activeTimeFlat === true);
  const hookAsh = row.hookStdoutCaptured === true && unused;
  const reuse = row.warmReusesExisting === true || row.warmDeferredUntilAttach === true || row.attachedToWarm === true;
  const primaryTriad = Boolean(
    warmPreview &&
      spawned &&
      unused &&
      remapped &&
      focusDriver &&
      !uniqueNearby(row) &&
      !reuse,
  );
  const honest = Boolean(
    reuse &&
      row.throwawaySpawn !== true &&
      row.neverUsed !== true &&
      row.sessionCountIncremented !== true &&
      !primaryTriad,
  );
  return {
    row,
    warmPreview,
    spawned,
    unused,
    remapped,
    focusDriver,
    sessionStart,
    litter,
    unpruned,
    inflated,
    otelSkew,
    hookAsh,
    reuse,
    primaryTriad,
    honest,
  };
}

export function classify(input) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "cued";
  if (!analyze(row).primaryTriad) {
    if (row.nearbyDeadband) return "discarded";
    if (row.nearbyProcessTree) return "warmed";
    if (row.nearbyOtelSkew) return "otel-skew";
    if (row.nearbyHookAsh) return "hook-ash";
    if (row.nearbySwitchFocus) return "switch-focus";
    if (row.nearbyRemapped) return "remapped";
    if (row.nearbyInflated) return "inflated";
    if (row.nearbyLittered) return "littered";
    if (row.nearbySessionStart) return "session-start";
    if (row.nearbyDiscarded) return "discarded";
    if (row.nearbyWarmed) return "warmed";
  }
  const f = analyze(row);
  if (f.primaryTriad) return "discarded";
  if (f.honest) return "cued";
  if (f.otelSkew && f.unused && !f.reuse) return "otel-skew";
  if (f.inflated && f.unused && !f.reuse) return "inflated";
  if (f.hookAsh && !f.reuse) return "hook-ash";
  if (f.litter && f.unpruned && f.unused && !f.reuse) return "littered";
  if (f.remapped && f.unused && !f.reuse) return "remapped";
  if (f.sessionStart && f.unused && !f.reuse) return "session-start";
  if (f.focusDriver && f.warmPreview && !f.reuse) return "switch-focus";
  if (f.warmPreview && f.spawned && !f.reuse) return "warmed";
  if (f.unused && f.spawned && !f.reuse) return "discarded";
  if (f.honest || f.reuse) return "cued";
  return "cued";
}

export function feedOf(kind) {
  if (kind === "warmed") {
    return "● Warmed · WarmLifecycle:preview / Warming up session fired on a focus switch";
  }
  if (kind === "discarded") {
    return "● Discarded · spawned CLI session never receives a message / never mapped to a conversation · primary #90798";
  }
  if (kind === "session-start") {
    return "● Session-start · SessionStart fires on the throwaway spawn";
  }
  if (kind === "littered") {
    return "● Littered · ~/.claude/session-env/<uuid>/ and ~/.claude/projects/<project>/<uuid>/ created and never pruned";
  }
  if (kind === "inflated") {
    return "● Inflated · claude_code.session.count incremented for unused sessions";
  }
  if (kind === "remapped") {
    return "● Remapped · resume maps local_* to a pre-existing CLI uuid, not the warm spawn";
  }
  if (kind === "switch-focus") {
    return "● Switch-focus · setFocusedSession / focus switch is the driver, not message volume";
  }
  if (kind === "hook-ash") {
    return "● Hook-ash · SessionStart hook stdout written into discarded uuid tool-results";
  }
  if (kind === "otel-skew") {
    return "● Otel-skew · session.count climbs while tokens / cost / active_time stay flat";
  }
  return "● Cued · honest hearth · warm attaches or reuses the pre-existing CLI session; no discarded spawn · idle word is cued";
}

export function reasonsOf(input, kind) {
  const f = analyze(input);
  const reasons = [`verdict ${kind}`];
  if (kind === "discarded" || f.primaryTriad) {
    reasons.push(
      "#90798 Desktop: every session switch spawns a throwaway Claude Code session — WarmLifecycle preview warm is discarded without a message",
    );
  }
  if (f.warmPreview) reasons.push("WarmLifecycle:preview Warming up session fired");
  if (f.focusDriver) {
    reasons.push(
      `focus switch is the driver (${f.row.focusSwitches ?? BUSY_DAY_SWITCHES} switches → ${f.row.startShellPtyCount ?? BUSY_DAY_PTY} startShellPty)`,
    );
  }
  if (f.spawned) reasons.push("startShellPty spawned a fresh CLI session identity");
  if (f.unused) {
    reasons.push(
      `${f.row.unusedCount ?? BUSY_DAY_UNUSED} unused vs ${f.row.mappedCount ?? BUSY_DAY_MAPPED} mapped on the busy day; never received a message`,
    );
  }
  if (f.remapped) reasons.push("resume mapped local_* to a pre-existing CLI uuid, not the warm spawn");
  if (f.sessionStart) reasons.push("SessionStart fired on the throwaway");
  if (f.litter) reasons.push("~/.claude/session-env/<uuid>/ and ~/.claude/projects/<project>/<uuid>/ created");
  if (f.unpruned) reasons.push("nothing prunes these dirs; cleanupPeriodDays targets transcripts; these have none");
  if (f.inflated) reasons.push("claude_code.session.count incremented for the unused spawn");
  if (f.otelSkew) reasons.push("session.count climbs while tokens / cost / active_time stay flat");
  if (f.hookAsh) reasons.push("SessionStart hook stdout captured into discarded uuid tool-results");
  if (f.row.unusedWeek != null) {
    reasons.push(
      `~4 weeks: ${f.row.unusedWeek} unused vs ${f.row.conversationWeek ?? WEEK_CONVERSATION} conversation (${WASTE_PCT}% waste)`,
    );
  }
  if (kind === "cued") {
    reasons.push(
      "warm attaches or reuses the pre-existing CLI session, or warm is deferred until attach; idle word is cued",
    );
  }
  return reasons;
}

export function verdictOf(input) {
  return classify(input);
}

export function cuedOf(input) {
  return classify(input) === "cued";
}

export function freshOf(input) {
  return cuedOf(input);
}

export function score(probe) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  const f = analyze(row);
  const isCued = kind === "cued";
  return {
    verdict: kind,
    state: kind,
    cued: isCued,
    fresh: isCued,
    alarm: ALARM_VERDICTS.includes(kind),
    linear: LINEAR_VERDICTS.includes(kind),
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    facts: {
      primaryTriad: f.primaryTriad,
      honest: f.honest,
      warmPreview: f.warmPreview,
      spawned: f.spawned,
      unused: f.unused,
      remapped: f.remapped,
      focusDriver: f.focusDriver,
      sessionStart: f.sessionStart,
      litter: f.litter,
      unpruned: f.unpruned,
      inflated: f.inflated,
      otelSkew: f.otelSkew,
      hookAsh: f.hookAsh,
      reuse: f.reuse,
    },
    reasons: reasonsOf(row, kind),
    feed: feedOf(kind),
    probe: row,
  };
}

export function emptyAction(action = "idle") {
  return { action, kindling: emptyProbe() };
}

export function seed90798() {
  return seedDiscarded();
}

export function seedDiscarded() {
  return {
    action: "score",
    session: "90798-throwaway-warm",
    issue: FEATURED_ISSUE,
    source:
      "primary #90798: 137 focus switches → 137 startShellPty → 116 CLI sessions on disk → 4 mapped → 113 never used; resume remaps local_* to a pre-existing CLI uuid",
    warmLifecyclePreview: true,
    warmingUp: true,
    startShellPty: true,
    cliSpawned: true,
    throwawaySpawn: true,
    focusSwitch: true,
    setFocusedSession: true,
    focusSwitches: BUSY_DAY_SWITCHES,
    startShellPtyCount: BUSY_DAY_PTY,
    cliSessionsOnDisk: BUSY_DAY_ON_DISK,
    mappedCount: BUSY_DAY_MAPPED,
    unusedCount: BUSY_DAY_UNUSED,
    neverUsed: true,
    messageReceived: false,
    mappedToConversation: false,
    remappedToPreexisting: true,
    sessionStartFired: true,
    sessionEnvCreated: true,
    projectDirCreated: true,
    pruned: false,
    sessionCountIncremented: true,
    tokensFlat: true,
    costFlat: true,
    activeTimeFlat: true,
    hookStdoutCaptured: true,
    warmReusesExisting: false,
    warmDeferredUntilAttach: false,
    attachedToWarm: false,
    unusedWeek: WEEK_UNUSED,
    conversationWeek: WEEK_CONVERSATION,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedCued() {
  return {
    action: "score",
    session: "cued-reuse",
    issue: FEATURED_ISSUE,
    source:
      "honest control: WarmLifecycle attaches or reuses the pre-existing CLI session; no throwaway spawn; session.count not incremented for a discarded identity",
    warmLifecyclePreview: true,
    warmingUp: true,
    startShellPty: false,
    cliSpawned: false,
    throwawaySpawn: false,
    focusSwitch: true,
    setFocusedSession: true,
    neverUsed: false,
    messageReceived: true,
    mappedToConversation: true,
    remappedToPreexisting: false,
    sessionStartFired: false,
    sessionEnvCreated: false,
    projectDirCreated: false,
    pruned: true,
    sessionCountIncremented: false,
    tokensFlat: false,
    costFlat: false,
    activeTimeFlat: false,
    hookStdoutCaptured: false,
    warmReusesExisting: true,
    warmDeferredUntilAttach: false,
    attachedToWarm: true,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedDeferred() {
  return {
    action: "score",
    session: "cued-deferred",
    issue: FEATURED_ISSUE,
    source:
      "honest control: warm deferred until attach; no CLI session identity minted on preview",
    warmLifecyclePreview: true,
    warmingUp: true,
    startShellPty: false,
    cliSpawned: false,
    throwawaySpawn: false,
    focusSwitch: true,
    neverUsed: false,
    messageReceived: true,
    mappedToConversation: true,
    remappedToPreexisting: false,
    sessionCountIncremented: false,
    warmReusesExisting: false,
    warmDeferredUntilAttach: true,
    attachedToWarm: false,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedControl() {
  return seedCued();
}

export function seedReset() {
  return emptyAction("reset");
}

function nearbySeed(name, flag, extra = {}) {
  return {
    session: `90798-${name}`,
    issue: FEATURED_ISSUE,
    [flag]: true,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
    ...extra,
  };
}

export function seedWarmed() {
  return nearbySeed("warmed", "nearbyWarmed", {
    warmLifecyclePreview: true,
    warmingUp: true,
  });
}
export function seedSessionStart() {
  return nearbySeed("session-start", "nearbySessionStart", { sessionStartFired: true });
}
export function seedLittered() {
  return nearbySeed("littered", "nearbyLittered", {
    sessionEnvCreated: true,
    projectDirCreated: true,
    pruned: false,
  });
}
export function seedInflated() {
  return nearbySeed("inflated", "nearbyInflated", { sessionCountIncremented: true });
}
export function seedRemapped() {
  return nearbySeed("remapped", "nearbyRemapped", { remappedToPreexisting: true });
}
export function seedSwitchFocus() {
  return nearbySeed("switch-focus", "nearbySwitchFocus", {
    focusSwitch: true,
    setFocusedSession: true,
    focusSwitches: BUSY_DAY_SWITCHES,
  });
}
export function seedHookAsh() {
  return nearbySeed("hook-ash", "nearbyHookAsh", { hookStdoutCaptured: true });
}
export function seedOtelSkew() {
  return nearbySeed("otel-skew", "nearbyOtelSkew", {
    sessionCountIncremented: true,
    tokensFlat: true,
    costFlat: true,
    activeTimeFlat: true,
  });
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "90798" || key === "discarded" || key === "throwaway" || key === "warm") {
    return decide(seedDiscarded());
  }
  if (key === "control" || key === "cued" || key === "honest" || key === "reuse") {
    return decide(seedCued());
  }
  if (key === "deferred") return decide(seedDeferred());
  if (key === "warmed") return decide(seedWarmed());
  if (key === "session-start" || key === "sessionstart") return decide(seedSessionStart());
  if (key === "littered") return decide(seedLittered());
  if (key === "inflated") return decide(seedInflated());
  if (key === "remapped") return decide(seedRemapped());
  if (key === "switch-focus" || key === "switchfocus") return decide(seedSwitchFocus());
  if (key === "hook-ash" || key === "hookash") return decide(seedHookAsh());
  if (key === "otel-skew" || key === "otelskew") return decide(seedOtelSkew());
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
  if (/warmlifecycle|warming up|warmlifecycle:preview/.test(lower)) {
    probe.warmLifecyclePreview = true;
    probe.warmingUp = true;
  }
  if (/startshellpty|startshell/.test(lower)) {
    probe.startShellPty = true;
    probe.cliSpawned = true;
    probe.throwawaySpawn = true;
  }
  if (/setfocusedsession|focus switch|switching to a \*\*different\*\*|switching to a different/.test(lower)) {
    probe.focusSwitch = true;
    probe.setFocusedSession = true;
  }
  if (/never used|neverused|113 never|950 unused|throwaway/.test(lower)) {
    probe.neverUsed = true;
    probe.messageReceived = false;
    probe.mappedToConversation = false;
  }
  if (/mapping internal session|pre-existing|remap/.test(lower)) {
    probe.remappedToPreexisting = true;
  }
  if (/sessionstart|session start/.test(lower)) probe.sessionStartFired = true;
  if (/session-env|projects\/|litter/.test(lower)) {
    probe.sessionEnvCreated = true;
    probe.projectDirCreated = true;
    probe.pruned = false;
  }
  if (/session\.count|inflat/.test(lower)) probe.sessionCountIncremented = true;
  if (/tokens\/cost|tokens, cost|active_time|otel/.test(lower)) {
    probe.tokensFlat = true;
    probe.costFlat = true;
    probe.activeTimeFlat = true;
  }
  if (/hook stdout|hook--stdout|tool-results/.test(lower)) probe.hookStdoutCaptured = true;
  if (/137/.test(text)) {
    probe.focusSwitches = BUSY_DAY_SWITCHES;
    probe.startShellPtyCount = BUSY_DAY_PTY;
  }
  if (/116/.test(text)) probe.cliSessionsOnDisk = BUSY_DAY_ON_DISK;
  if (/\b4\b.*mapped|only \*\*4\*\*|only 4/.test(lower) || /mapped to a conversation/.test(lower)) {
    probe.mappedCount = BUSY_DAY_MAPPED;
  }
  if (/113/.test(text)) probe.unusedCount = BUSY_DAY_UNUSED;
  if (/950/.test(text)) probe.unusedWeek = WEEK_UNUSED;
  if (/57/.test(text)) probe.conversationWeek = WEEK_CONVERSATION;
  if (/2\.1\.247/.test(text)) probe.version = DEMO_VERSION;
  if (/1\.40609/.test(text)) probe.entrypoint = DEMO_ENTRYPOINT;
  if (/#?90798/.test(text)) probe.issue = FEATURED_ISSUE;
  if (/claude-desktop|desktop app/.test(lower)) probe.entrypoint = DEMO_ENTRYPOINT;
  return probe;
}

export function decide(payload = {}) {
  const action = asText(payload.action || payload.kindling?.action || "").toLowerCase();
  if (action === "restore" || action === "90798") return score(seedDiscarded());
  if (action === "reset" || action === "bail" || action === "idle") return score(emptyProbe());
  if (action === "control" || action === "cued") return score(seedCued());
  if (action === "deferred") return score(seedDeferred());
  const probe =
    payload.probe ||
    payload.kindling ||
    payload.hearth ||
    (payload.deadband || payload.pawl || payload.cenotaph || payload.fetch ? emptyProbe() : payload);
  return score(probe);
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "discarded") {
    return "Kindling discarded. WarmLifecycle preview spawned a CLI session that never received a message. #90798.";
  }
  if (result.verdict === "littered") {
    return "Kindling littered. session-env and projects uuid dirs created and never pruned.";
  }
  if (result.verdict === "inflated") {
    return "Kindling inflated. claude_code.session.count incremented for unused sessions.";
  }
  if (result.verdict === "otel-skew") {
    return "Kindling otel-skew. session.count climbs while tokens, cost, and active_time stay flat.";
  }
  return "Kindling refuse. A preview spark that never takes is not a hold.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "SessionStart",
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: deny
        ? denyMessage(result)
        : "Kindling cued. Warm attaches or reuses the pre-existing CLI session. Idle word is cued.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedDiscarded();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.kindling || parsed.probe || parsed.hearth
        ? parsed
        : { action: "score", kindling: cloneProbe(parsed) };
    }
  } catch {
    return { action: "score", kindling: parseTranscript(text) };
  }
  return { action: "score", kindling: parseTranscript(text) };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedDiscarded());
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
