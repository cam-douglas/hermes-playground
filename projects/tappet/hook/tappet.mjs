/**
 * Tappet — valve-train scorer for silent hook injection.
 * A fired hook is not a seated injection. Score the spawn or admit seated.
 *
 * UserPromptSubmit (and sibling hook events) are the user's primary
 * steering channel. Two silent failure modes:
 *   (A) mid-turn / queued messages never spawn the hook process
 *   (B) the hook runs and returns additionalContext, but it never
 *       reaches the model transcript
 * Zero hook-execution telemetry, so users cannot self-diagnose.
 *
 * Verdicts: seated | missed | slipped | folded | mute | oversize
 *           | misfiled | inert | blind | wave
 * Idle word is seated (injection landed in the transcript; valve seated).
 * NEVER use the product name tappet as the idle/state word.
 * NEVER reuse idle words from other products: heard, clear, paired,
 * kernel, latched, upheld, sterling, home, valid, dry, intact, sealed,
 * even, swept, filed, planed, stopped, taken, shaved, cleared, sprung,
 * flush, wiped, clean.
 *
 * Slack alarm on missed / slipped / folded / mute / oversize / misfiled /
 * inert / wave. Linear ticket on missed / slipped / inert.
 * GitHub tappet-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Fathom (standing rules dropped after compaction / windowing).
 * NOT Reed (MCP connected vs registered / tool-registry death).
 * NOT Coda (silently dropped assistant TEXT in the main turn).
 * NOT Aside (/btw side-channel silent truncation).
 * NOT Suture (SSE stream tear).
 * NOT Knock (permission-grant stall).
 * NOT Husk (hollow headless SUCCESS envelopes from tools).
 * NOT Chute (sanctioned secret handoff inbound).
 * NOT Scrim (outbound DLP).
 * NOT Tain, Snib, Veto, Assay, Wicket, Sigil, Stencil, Blot, Hasp,
 * Parity, Reveille, Quench.
 * Different problem: hook-injection path — process spawn vs
 * additionalContext seating vs telemetry vs UI render.
 * Different UI: valve-train / engine-bay desk. Oil black, brass tappet,
 * cam-lobe steel, inspection-lamp amber, oil-film green.
 * Different idle word: seated.
 */

export const VERDICTS = Object.freeze([
  "seated",
  "missed",
  "slipped",
  "folded",
  "mute",
  "oversize",
  "misfiled",
  "inert",
  "blind",
  "wave",
]);
export const IDLE_WORD = "seated";
export const SLACK_VERDICTS = Object.freeze([
  "missed",
  "slipped",
  "folded",
  "mute",
  "oversize",
  "misfiled",
  "inert",
  "wave",
]);
export const LINEAR_VERDICTS = Object.freeze(["missed", "slipped", "inert"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const OVERSIZE_BYTES = 10000;
export const WAVE_MINUTES = 20;

const FORBIDDEN_IDLE = Object.freeze([
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
  "tappet",
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
  return Boolean(value);
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asFile(value) {
  if (value === true) return true;
  if (typeof value === "string" && value.trim()) return value.trim();
  return false;
}

export function emptyProbe() {
  return {
    event: "",
    midTurn: false,
    hookSpawned: false,
    sideEffectFile: false,
    additionalContextReturned: false,
    additionalContextInTranscript: false,
    turnStarted: false,
    hookTelemetryPresent: false,
    outputBytes: 0,
    dropped: false,
    originHumanRedelivery: false,
    loggedSucceeded: false,
    systemMessageReturned: false,
    systemMessageRendered: false,
    lossWindowMinutes: 0,
    recovered: false,
    hookAttempted: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "seated-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.hook && typeof src.hook === "object" ? src.hook : {};
  const valve = src.valve && typeof src.valve === "object" ? src.valve : {};
  const pick = (key) => src[key] ?? nested[key] ?? valve[key];
  return {
    ...emptyProbe(),
    event: asText(pick("event")),
    midTurn: asBool(pick("midTurn")),
    hookSpawned: asBool(pick("hookSpawned")),
    sideEffectFile: asFile(pick("sideEffectFile")),
    additionalContextReturned: asBool(pick("additionalContextReturned")),
    additionalContextInTranscript: asBool(pick("additionalContextInTranscript")),
    turnStarted: asBool(pick("turnStarted")),
    hookTelemetryPresent: asBool(pick("hookTelemetryPresent")),
    outputBytes: asNumber(pick("outputBytes"), 0),
    dropped: asBool(pick("dropped")),
    originHumanRedelivery: asBool(pick("originHumanRedelivery")),
    loggedSucceeded: asBool(pick("loggedSucceeded")),
    systemMessageReturned: asBool(pick("systemMessageReturned")),
    systemMessageRendered: asBool(pick("systemMessageRendered")),
    lossWindowMinutes: asNumber(pick("lossWindowMinutes"), 0),
    recovered: asBool(pick("recovered")),
    hookAttempted: asBool(pick("hookAttempted")),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? nested.source),
    issue: asIssue(src.issue ?? nested.issue),
    scored: asBool(src.scored ?? nested.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.event &&
    !next.midTurn &&
    !next.hookSpawned &&
    !next.sideEffectFile &&
    !next.additionalContextReturned &&
    !next.additionalContextInTranscript &&
    !next.turnStarted &&
    !next.hookTelemetryPresent &&
    next.outputBytes === 0 &&
    !next.dropped &&
    !next.originHumanRedelivery &&
    !next.loggedSucceeded &&
    !next.systemMessageReturned &&
    !next.systemMessageRendered &&
    next.lossWindowMinutes === 0 &&
    !next.recovered &&
    !next.hookAttempted
  );
}

export function hookWasAttempted(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.scored ||
    next.hookAttempted ||
    Boolean(next.event) ||
    next.hookSpawned ||
    next.additionalContextReturned ||
    Boolean(next.sideEffectFile) ||
    next.loggedSucceeded ||
    next.systemMessageReturned ||
    next.midTurn
  );
}

export function isOversize(probe = {}) {
  const next = cloneProbe(probe);
  return next.outputBytes > OVERSIZE_BYTES && next.dropped;
}

/**
 * First match wins. Idle seated is first. Healthy seated is last.
 * Mode A (missed) and mode B (slipped) stay distinguishable from
 * corroborating classes (folded / mute / oversize / misfiled / inert /
 * blind / wave).
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "seated";
  if (next.originHumanRedelivery) return "misfiled";
  if (isOversize(next)) return "oversize";
  if (next.loggedSucceeded && !next.additionalContextInTranscript) return "inert";
  if (next.systemMessageReturned && !next.systemMessageRendered) return "blind";
  if (next.lossWindowMinutes >= WAVE_MINUTES && next.recovered) return "wave";
  if (next.midTurn && !next.hookSpawned) return "missed";
  if (!next.turnStarted && next.midTurn) return "folded";
  if (
    next.hookSpawned &&
    next.additionalContextReturned &&
    !next.additionalContextInTranscript
  ) {
    return "slipped";
  }
  if (!next.hookTelemetryPresent && hookWasAttempted(next)) return "mute";
  if (next.hookSpawned && next.additionalContextInTranscript) return "seated";
  return "seated";
}

export function feedOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  if (kind === "missed") {
    return "● Missed · mode A · mid-turn send · hook process never spawned · no side-effect file";
  }
  if (kind === "slipped") {
    return "● Slipped · mode B · hook ran · additionalContext missing from the raw transcript";
  }
  if (kind === "folded") {
    return "● Folded · message merged into the still-running previous turn · no turn.started";
  }
  if (kind === "mute") {
    return "● Mute · client log has zero hook-execution telemetry";
  }
  if (kind === "oversize") {
    return "● Oversize · hook output over 10K silently dropped from context · zero signal";
  }
  if (kind === "misfiled") {
    return "● Misfiled · SessionStart additionalContext redelivered later as origin:human";
  }
  if (kind === "inert") {
    return "● Inert · hook logged as succeeded · never injected into model context";
  }
  if (kind === "blind") {
    return "● Blind · systemMessage returned · never rendered in Desktop / VS Code UI";
  }
  if (kind === "wave") {
    return "● Wave · contiguous multi-message loss window that then self-recovers";
  }
  return "● Seated · hook spawned · additionalContext present in the model transcript";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(next.event ? `event ${next.event}` : "event unset");
  reasons.push(next.midTurn ? "mid-turn / queued send" : "not a mid-turn send");
  reasons.push(next.hookSpawned ? "hook process spawned" : "hook process never spawned");
  if (next.sideEffectFile) {
    reasons.push(
      typeof next.sideEffectFile === "string"
        ? `side-effect file ${next.sideEffectFile}`
        : "side-effect file exists",
    );
  } else {
    reasons.push("no side-effect file");
  }
  reasons.push(
    next.additionalContextReturned
      ? "additionalContext returned by the hook"
      : "additionalContext not returned",
  );
  reasons.push(
    next.additionalContextInTranscript
      ? "additionalContext present in the model transcript"
      : "additionalContext missing from the model transcript",
  );
  reasons.push(next.turnStarted ? "turn.started fired" : "no turn.started");
  reasons.push(
    next.hookTelemetryPresent
      ? "hook-execution telemetry present (fired/timeout/failed/blocked)"
      : "zero hook-execution telemetry",
  );
  if (next.outputBytes) reasons.push(`output ${next.outputBytes} bytes`);
  if (next.dropped) reasons.push("output silently dropped from context");
  if (next.originHumanRedelivery) {
    reasons.push("SessionStart additionalContext redelivered as origin:human queued prompt");
  }
  if (next.loggedSucceeded) reasons.push("hook logged as succeeded");
  if (next.systemMessageReturned) reasons.push("systemMessage returned");
  if (next.systemMessageReturned && !next.systemMessageRendered) {
    reasons.push("systemMessage never rendered in Desktop / VS Code");
  }
  if (next.lossWindowMinutes) {
    reasons.push(`loss window ${next.lossWindowMinutes} min`);
  }
  if (next.recovered) reasons.push("window self-recovered");
  if (kind === "seated") {
    reasons.push("injection landed in the transcript; valve seated");
  }
  if (kind === "missed") {
    reasons.push("mode A: mid-turn submissions never fire the hook (#90296 / #31114)");
  }
  if (kind === "slipped") {
    reasons.push("mode B: hook ran but additionalContext never reaches the context (#90296)");
  }
  if (kind === "folded") {
    reasons.push("message merged into the still-running previous turn");
  }
  if (kind === "mute") {
    reasons.push("users cannot self-diagnose; the client log is silent");
  }
  if (kind === "oversize") {
    reasons.push("hook output over 10K silently dropped from context (#84021)");
  }
  if (kind === "misfiled") {
    reasons.push("later redelivered as a mislabeled origin:human queued prompt (#75378)");
  }
  if (kind === "inert") {
    reasons.push("logged succeeded but never injected into model context (#88086)");
  }
  if (kind === "blind") {
    reasons.push("systemMessage does not render in Desktop / VS Code (#78266)");
  }
  if (kind === "wave") {
    reasons.push("contiguous multi-message loss window (~30 min) that then self-recovers");
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
 * Deterministic. First match wins. Idle seated first; healthy seated last.
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
    event: pick("event"),
    midTurn: pick("midTurn"),
    hookSpawned: pick("hookSpawned"),
    sideEffectFile: pick("sideEffectFile"),
    additionalContextReturned: pick("additionalContextReturned"),
    additionalContextInTranscript: pick("additionalContextInTranscript"),
    turnStarted: pick("turnStarted"),
    hookTelemetryPresent: pick("hookTelemetryPresent"),
    outputBytes: pick("outputBytes"),
    dropped: pick("dropped"),
    originHumanRedelivery: pick("originHumanRedelivery"),
    loggedSucceeded: pick("loggedSucceeded"),
    systemMessageReturned: pick("systemMessageReturned"),
    systemMessageRendered: pick("systemMessageRendered"),
    lossWindowMinutes: pick("lossWindowMinutes"),
    recovered: pick("recovered"),
    hookAttempted: pick("hookAttempted"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    hook: fromFields.hook,
    valve: fromFields.valve,
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
    product: "tappet",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    valveSeated: verdict === "seated",
    valveMissed: verdict === "missed",
    valveSlipped: verdict === "slipped",
    modeA: verdict === "missed",
    modeB: verdict === "slipped",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    event: next.event,
    midTurn: next.midTurn,
    hookSpawned: next.hookSpawned,
    sideEffectFile: next.sideEffectFile,
    additionalContextReturned: next.additionalContextReturned,
    additionalContextInTranscript: next.additionalContextInTranscript,
    turnStarted: next.turnStarted,
    hookTelemetryPresent: next.hookTelemetryPresent,
    outputBytes: next.outputBytes,
    dropped: next.dropped,
    originHumanRedelivery: next.originHumanRedelivery,
    loggedSucceeded: next.loggedSucceeded,
    systemMessageReturned: next.systemMessageReturned,
    systemMessageRendered: next.systemMessageRendered,
    lossWindowMinutes: next.lossWindowMinutes,
    recovered: next.recovered,
    hookAttempted: next.hookAttempted,
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
      event: extras.event || "",
      midTurn: Boolean(extras.midTurn),
      hookSpawned: Boolean(extras.hookSpawned),
      sideEffectFile: extras.sideEffectFile ?? false,
      additionalContextReturned: Boolean(extras.additionalContextReturned),
      additionalContextInTranscript: Boolean(extras.additionalContextInTranscript),
      turnStarted: Boolean(extras.turnStarted),
      hookTelemetryPresent: Boolean(extras.hookTelemetryPresent),
      outputBytes: extras.outputBytes || 0,
      dropped: Boolean(extras.dropped),
      originHumanRedelivery: Boolean(extras.originHumanRedelivery),
      loggedSucceeded: Boolean(extras.loggedSucceeded),
      systemMessageReturned: Boolean(extras.systemMessageReturned),
      systemMessageRendered: Boolean(extras.systemMessageRendered),
      lossWindowMinutes: extras.lossWindowMinutes || 0,
      recovered: Boolean(extras.recovered),
      hookAttempted: Boolean(extras.hookAttempted),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Healthy strike. Hook spawned AND additionalContext seated in the transcript. */
export function seedSeated() {
  return seedProbe("seated", "UserPromptSubmit", {
    session: "seated",
    issue: null,
    event: "UserPromptSubmit",
    hookSpawned: true,
    sideEffectFile: "/tmp/tappet-side-effect",
    additionalContextReturned: true,
    additionalContextInTranscript: true,
    turnStarted: true,
    hookTelemetryPresent: true,
    outputBytes: 240,
  });
}

/** PRIMARY #90296 mode A: mid-turn send, hook process never spawned. */
export function seed90296Missed() {
  return seedProbe(90296, "anthropics/claude-code#90296", {
    session: "90296-missed",
    event: "UserPromptSubmit",
    midTurn: true,
    hookSpawned: false,
    sideEffectFile: false,
    additionalContextReturned: false,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** #31114 corroboration: UserPromptSubmit hooks not fired mid-turn. */
export function seed31114Missed() {
  return seedProbe(31114, "anthropics/claude-code#31114", {
    session: "31114-missed",
    event: "UserPromptSubmit",
    midTurn: true,
    hookSpawned: false,
    sideEffectFile: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** #40647 corroboration: UserPromptSubmit type:command sometimes skipped. */
export function seed40647Missed() {
  return seedProbe(40647, "anthropics/claude-code#40647", {
    session: "40647-missed",
    event: "UserPromptSubmit",
    midTurn: true,
    hookSpawned: false,
    sideEffectFile: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** PRIMARY #90296 mode B: hook ran, additionalContext missing from transcript. */
export function seed90296Slipped() {
  return seedProbe(90296, "anthropics/claude-code#90296", {
    session: "90296-slipped",
    event: "UserPromptSubmit",
    hookSpawned: true,
    sideEffectFile: "/tmp/tappet-90296",
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** #19643: UserPromptSubmit systemMessage not injected into context. */
export function seed19643Slipped() {
  return seedProbe(19643, "anthropics/claude-code#19643", {
    session: "19643-slipped",
    event: "UserPromptSubmit",
    hookSpawned: true,
    sideEffectFile: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
    systemMessageReturned: true,
    systemMessageRendered: true,
  });
}

/** #85917: SubagentStop additionalContext continues the turn but never reaches. */
export function seed85917Slipped() {
  return seedProbe(85917, "anthropics/claude-code#85917", {
    session: "85917-slipped",
    event: "SubagentStop",
    hookSpawned: true,
    sideEffectFile: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** #79616: PostToolUse hook additionalContext not reaching Claude in VSCode. */
export function seed79616Slipped() {
  return seedProbe(79616, "anthropics/claude-code#79616", {
    session: "79616-slipped",
    event: "PostToolUse",
    hookSpawned: true,
    sideEffectFile: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
  });
}

/** Folded: queued message merged into the still-running previous turn. */
export function seedFolded() {
  return seedProbe("folded", "UserPromptSubmit", {
    session: "folded",
    issue: null,
    event: "UserPromptSubmit",
    midTurn: true,
    hookSpawned: true,
    turnStarted: false,
    hookTelemetryPresent: true,
  });
}

/** Mute: hook attempted, client log has zero fired/timeout/failed/blocked. */
export function seedMute() {
  return seedProbe("mute", "UserPromptSubmit", {
    session: "mute",
    issue: null,
    event: "UserPromptSubmit",
    hookAttempted: true,
    hookTelemetryPresent: false,
    hookSpawned: false,
    midTurn: false,
    turnStarted: true,
  });
}

/** #84021: hook output over 10K silently dropped from context. */
export function seed84021Oversize() {
  return seedProbe(84021, "anthropics/claude-code#84021", {
    session: "84021-oversize",
    event: "UserPromptSubmit",
    hookSpawned: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
    outputBytes: 14000,
    dropped: true,
  });
}

/** #75378: SessionStart additionalContext redelivered as origin:human. */
export function seed75378Misfiled() {
  return seedProbe(75378, "anthropics/claude-code#75378", {
    session: "75378-misfiled",
    event: "SessionStart",
    hookSpawned: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
    originHumanRedelivery: true,
  });
}

/** #88086: SessionStart plugin hook logged succeeded but never injected. */
export function seed88086Inert() {
  return seedProbe(88086, "anthropics/claude-code#88086", {
    session: "88086-inert",
    event: "SessionStart",
    hookSpawned: true,
    additionalContextReturned: true,
    additionalContextInTranscript: false,
    turnStarted: true,
    hookTelemetryPresent: true,
    loggedSucceeded: true,
  });
}

/** #78266: UserPromptSubmit systemMessage does not render in Desktop / VS Code. */
export function seed78266Blind() {
  return seedProbe(78266, "anthropics/claude-code#78266", {
    session: "78266-blind",
    event: "UserPromptSubmit",
    hookSpawned: true,
    additionalContextReturned: true,
    additionalContextInTranscript: true,
    turnStarted: true,
    hookTelemetryPresent: true,
    systemMessageReturned: true,
    systemMessageRendered: false,
  });
}

/** Wave: contiguous ~30 min multi-message loss that then self-recovers. */
export function seedWave() {
  return seedProbe("wave", "UserPromptSubmit", {
    session: "wave",
    issue: null,
    event: "UserPromptSubmit",
    hookSpawned: true,
    additionalContextReturned: true,
    additionalContextInTranscript: true,
    turnStarted: true,
    hookTelemetryPresent: true,
    lossWindowMinutes: 30,
    recovered: true,
  });
}

const SEEDS = {
  seated: seedSeated,
  missed: seed90296Missed,
  90296: seed90296Missed,
  "90296-missed": seed90296Missed,
  31114: seed31114Missed,
  "31114-missed": seed31114Missed,
  40647: seed40647Missed,
  "40647-missed": seed40647Missed,
  slipped: seed90296Slipped,
  "90296-slipped": seed90296Slipped,
  19643: seed19643Slipped,
  "19643-slipped": seed19643Slipped,
  85917: seed85917Slipped,
  "85917-slipped": seed85917Slipped,
  79616: seed79616Slipped,
  "79616-slipped": seed79616Slipped,
  folded: seedFolded,
  mute: seedMute,
  oversize: seed84021Oversize,
  84021: seed84021Oversize,
  "84021-oversize": seed84021Oversize,
  misfiled: seed75378Misfiled,
  75378: seed75378Misfiled,
  "75378-misfiled": seed75378Misfiled,
  inert: seed88086Inert,
  88086: seed88086Inert,
  "88086-inert": seed88086Inert,
  blind: seed78266Blind,
  78266: seed78266Blind,
  "78266-blind": seed78266Blind,
  wave: seedWave,
};

function healthyStrike(session) {
  return {
    ...emptyProbe(),
    event: "UserPromptSubmit",
    hookSpawned: true,
    sideEffectFile: true,
    additionalContextReturned: true,
    additionalContextInTranscript: true,
    turnStarted: true,
    hookTelemetryPresent: true,
    outputBytes: 240,
    session: session || "seated",
    source: "strike",
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

  if (verb === "clear") {
    return pack("seated", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "strike") {
    if (isIdle(probe) || (!probe.midTurn && !probe.hookSpawned && !probe.loggedSucceeded)) {
      probe = healthyStrike(action.session || probe.session);
    } else {
      probe = { ...probe, scored: true, event: probe.event || "UserPromptSubmit" };
    }
    return pack(classify(probe), probe, { ...action, action: "strike" });
  }

  if (verb === "admit" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
