/**
 * Leat — mill leat / sluice-gate / millrace desk for Claude Code
 * Bash-tool guidance that steers agents from a bounded `sleep N`
 * into an unbounded `until`-loop, which then becomes an unkillable
 * background task lasting days and blocking app restart.
 *
 * A blocked sleep is not a hold. Score the race or admit stilled.
 *
 * Primary #90475: Blocked `sleep` recommends unbounded until-loop
 * → unkillable background task. Filed 2026-08-28, has repro, open.
 *
 * Chain (product's own instructions):
 * 1. Agent writes bounded wait (`sleep N`) → Bash tool blocks it.
 * 2. Block message recommends: `until <check>; do sleep 2; done`
 *    — unbounded by construction; example has no iteration cap
 *    or deadline.
 * 3. Agent writes the unbounded loop.
 * 4. Condition never becomes true.
 * 5. Foreground timeout fires → promoted to background (bound
 *    discarded; see #88702).
 * 6. Loop still running five days later; desktop app refuses
 *    restart with "there's a running task here"; killed only
 *    via TaskStop.
 *
 * Verdicts: stilled | racing | unbounded | promoted | lingering
 *           | flooded | spun | capped | live | shut
 * Idle word is stilled (gate closed; race not spinning; no
 * unbounded wait live). NEVER use leat / millrace / sluice /
 * empty as idle. NEVER reuse drained, flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard,
 * clear, paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised, stabled.
 *
 * Slack leat alarm on racing / unbounded / promoted / lingering
 * / flooded / live. Linear ticket on racing / unbounded /
 * promoted / lingering. GitHub leat-ledger of race events on
 * every scored probe.
 *
 * Why this is not a clone:
 * NOT Shunt (railway yard / nested SendMessage misroute to root).
 * NOT Sump (basement catch-pit / literal dev/null/ LFS hook litter).
 * NOT Quench (fuse / hard kill spend ledger) — Quench kills spend;
 * Leat scores the guidance that *creates* immortal waits.
 * NOT Knock (permission grant stall).
 * NOT Pleat / Scant / Chad / Kist / Wraith / Gasket / Damper /
 * Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Snib /
 * Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda /
 * Reed / Fathom / Hasp / Parity / Reveille / Scrim.
 * Different problem: sleep-block → unbounded until guidance →
 * background promotion → multi-day zombie wait.
 * Different UI: mill leat / open sluice gate / millrace water /
 * mill wheel / wet stone channel / moss / brass gate wheel.
 * Different idle: stilled.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Millrace, Flume, Sluice, Culvert,
 * Weir, Noria, Capstan, Flywheel, Eddy, Gyre, Quern, Lade,
 * Tread, Spindle, Rotor, Whorl, Gimbal, Ratchet, Escapement,
 * Verge, Fusee, Pallet, Points, Frog, Wye, Siding, Drain, Null,
 * Sink, Gutter, Pit, Ash, Ashcan, Bung, Void, Limbo, Oubliette,
 * Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery,
 * Nixie, Crypt, Fold, Accordion, Bellows.
 * Product name is Leat only.
 */

export const VERDICTS = Object.freeze([
  "stilled",
  "racing",
  "unbounded",
  "promoted",
  "lingering",
  "flooded",
  "spun",
  "capped",
  "live",
  "shut",
]);
export const IDLE_WORD = "stilled";
export const SLACK_VERDICTS = Object.freeze([
  "racing",
  "unbounded",
  "promoted",
  "lingering",
  "flooded",
  "live",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "racing",
  "unbounded",
  "promoted",
  "lingering",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "leat",
  "millrace",
  "sluice",
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
  "stabled",
  "flume",
  "culvert",
  "weir",
  "noria",
  "capstan",
  "flywheel",
  "eddy",
  "gyre",
  "quern",
  "lade",
  "tread",
  "spindle",
  "rotor",
  "whorl",
  "gimbal",
  "ratchet",
  "escapement",
  "verge",
  "fusee",
  "pallet",
  "points",
  "frog",
  "wye",
  "siding",
  "drain",
  "null",
  "sink",
  "gutter",
  "pit",
  "ash",
  "ashcan",
  "bung",
  "void",
  "limbo",
  "oubliette",
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
  "shunt",
  "sump",
  "quench",
  "knock",
  "pleat",
  "scant",
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

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function emptyProbe() {
  return {
    sleepBlocked: false,
    recommendedUntil: false,
    hasIterationCap: false,
    hasDeadline: false,
    foregroundTimeoutMs: 0,
    promotedToBackground: false,
    backgroundStillLive: false,
    daysAlive: 0,
    restartBlocked: false,
    taskCount: 0,
    ppidOne: false,
    outputUnlinked: false,
    wroteUntilLoop: false,
    spunCpu: false,
    taskStopped: false,
    outputMtimeLive: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "stilled-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const race = src.race && typeof src.race === "object" ? src.race : {};
  const gate = src.gate && typeof src.gate === "object" ? src.gate : {};
  const channel = src.channel && typeof src.channel === "object" ? src.channel : {};
  const wheel = src.wheel && typeof src.wheel === "object" ? src.wheel : {};
  const pick = (key) => src[key] ?? race[key] ?? gate[key] ?? channel[key] ?? wheel[key];
  return {
    ...emptyProbe(),
    sleepBlocked: asBool(pick("sleepBlocked")),
    recommendedUntil: asBool(pick("recommendedUntil")),
    hasIterationCap: asBool(pick("hasIterationCap")),
    hasDeadline: asBool(pick("hasDeadline")),
    foregroundTimeoutMs: asNumber(pick("foregroundTimeoutMs"), 0),
    promotedToBackground: asBool(pick("promotedToBackground")),
    backgroundStillLive: asBool(pick("backgroundStillLive")),
    daysAlive: asNumber(pick("daysAlive"), 0),
    restartBlocked: asBool(pick("restartBlocked")),
    taskCount: asNumber(pick("taskCount"), 0),
    ppidOne: asBool(pick("ppidOne")),
    outputUnlinked: asBool(pick("outputUnlinked")),
    wroteUntilLoop: asBool(pick("wroteUntilLoop")),
    spunCpu: asBool(pick("spunCpu")),
    taskStopped: asBool(pick("taskStopped")),
    outputMtimeLive: asBool(pick("outputMtimeLive")),
    observed: asBool(src.observed ?? race.observed ?? gate.observed ?? channel.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? race.source ?? gate.source ?? channel.source),
    issue: asIssue(src.issue ?? race.issue ?? gate.issue ?? channel.issue),
    scored: asBool(src.scored ?? race.scored ?? gate.scored ?? channel.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.sleepBlocked &&
    !next.recommendedUntil &&
    !next.hasIterationCap &&
    !next.hasDeadline &&
    next.foregroundTimeoutMs <= 0 &&
    !next.promotedToBackground &&
    !next.backgroundStillLive &&
    next.daysAlive <= 0 &&
    !next.restartBlocked &&
    next.taskCount <= 0 &&
    !next.ppidOne &&
    !next.outputUnlinked &&
    !next.wroteUntilLoop &&
    !next.spunCpu &&
    !next.taskStopped &&
    !next.outputMtimeLive &&
    !next.observed
  );
}

export function guidanceFault(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.sleepBlocked &&
    next.recommendedUntil &&
    !next.hasIterationCap &&
    !next.hasDeadline
  );
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const sleepBlocked =
    /sleep\s+\d+/i.test(text) &&
    /blocked|block message|bash tool blocks/i.test(text);
  const recommendedUntil =
    /until\s+<check>|until\s+\S+;\s*do\s+sleep|recommended?:?\s*until/i.test(text);
  const wroteUntilLoop =
    /until\s+.+\s*;\s*do\s+sleep/i.test(text) &&
    /agent writes|wrote the unbounded|followed the guidance/i.test(text);
  const hasIterationCap =
    /for\s+\w+\s+in\s+\$\(seq|iteration cap|max[_-]?iter|break after/i.test(text);
  const hasDeadline = /timeout\s+\d+|deadline|timeout wrapper/i.test(text);
  const promotedToBackground =
    /promoted to background|run_in_background|foreground timeout/i.test(text);
  const backgroundStillLive =
    /still running|still live|five days later|background loop still/i.test(text);
  const daysMatch = text.match(/(\d+)\s+days?\s+(later|alive|old)/i);
  const daysAlive = daysMatch ? Number(daysMatch[1]) : /five days later/i.test(text) ? 5 : 0;
  const restartBlocked =
    /refuses restart|running task here|restart blocked/i.test(text);
  const taskStopped = /TaskStop|manual kill closed/i.test(text);
  const ppidOne = /PPID\s*1|orphaned at PID 1|ppid.?1/i.test(text);
  const outputUnlinked = /\.output unlinked|output unlinked/i.test(text);
  const outputMtimeLive = /\.output mtime|still writing/i.test(text);
  const spunCpu = /CPU spinning|spinning shells/i.test(text);
  const taskCountMatch = text.match(/(\d+)\s+(until-loops?|racing shells|spinning shells)/i);
  const taskCount = taskCountMatch
    ? Number(taskCountMatch[1])
    : /three until/i.test(text)
      ? 3
      : wroteUntilLoop || backgroundStillLive
        ? 1
        : 0;
  return {
    sleepBlocked: sleepBlocked || (/sleep\s+\d+/i.test(text) && recommendedUntil),
    recommendedUntil,
    hasIterationCap,
    hasDeadline,
    foregroundTimeoutMs: /timeout\s+(\d+)/i.test(text)
      ? Number(text.match(/timeout\s+(\d+)/i)[1])
      : 0,
    promotedToBackground,
    backgroundStillLive,
    daysAlive,
    restartBlocked,
    taskCount,
    ppidOne,
    outputUnlinked,
    wroteUntilLoop: wroteUntilLoop || (recommendedUntil && /until\s+.+\s*;\s*do\s+sleep/i.test(text)),
    spunCpu,
    taskStopped,
    outputMtimeLive,
  };
}

/**
 * First match wins. Idle stilled is first. Classes stay
 * distinguishable: a blocked sleep is not a hold. This is
 * sleep-block → unbounded until guidance → background
 * promotion → multi-day zombie wait.
 * NOT Shunt (nested SendMessage). NOT Sump (dev/null litter).
 * NOT Quench (spend kill). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "stilled";

  if (next.taskStopped && !next.backgroundStillLive) return "shut";

  if (next.taskCount >= 3 && next.backgroundStillLive) return "flooded";

  if (next.ppidOne || next.spunCpu) return "spun";

  const fault = guidanceFault(next);
  const loopWritten = next.wroteUntilLoop || next.backgroundStillLive || next.promotedToBackground;

  if (fault && loopWritten) return "racing";

  if (fault) return "unbounded";

  if (next.promotedToBackground && next.backgroundStillLive) return "promoted";

  if (next.restartBlocked || next.outputMtimeLive) return "live";

  if (next.daysAlive >= 1 && next.backgroundStillLive) return "lingering";

  if ((next.hasIterationCap || next.hasDeadline) && !next.backgroundStillLive) {
    return "capped";
  }

  if (next.taskStopped) return "shut";

  return "stilled";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  const fault = guidanceFault(next);
  const loopWritten = next.wroteUntilLoop || next.backgroundStillLive || next.promotedToBackground;
  if (fault && loopWritten) add("racing");
  if (fault) add("unbounded");
  if (next.promotedToBackground && next.backgroundStillLive) add("promoted");
  if (next.daysAlive >= 1 && next.backgroundStillLive) add("lingering");
  if (next.taskCount >= 3 && next.backgroundStillLive) add("flooded");
  if (next.ppidOne || next.spunCpu) add("spun");
  if ((next.hasIterationCap || next.hasDeadline) && !next.backgroundStillLive) add("capped");
  if (next.restartBlocked || next.outputMtimeLive) add("live");
  if (next.taskStopped && !next.backgroundStillLive) add("shut");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "racing") {
    return "● Racing · unbounded until/while wait with sleep inside · no iteration cap · guidance followed";
  }
  if (kind === "unbounded") {
    return "● Unbounded · block message recommended the open until-loop · no cap · no deadline";
  }
  if (kind === "promoted") {
    return "● Promoted · foreground timeout moved the loop to background · bound discarded";
  }
  if (kind === "lingering") {
    return "● Lingering · background loop still live across a session boundary / days later";
  }
  if (kind === "flooded") {
    return "● Flooded · multiple racing shells still alive on the race";
  }
  if (kind === "spun") {
    return "● Spun · CPU spinning on an in-shell sleep loop · orphaned at PPID 1";
  }
  if (kind === "capped") {
    return "● Capped · healthy for-loop / timeout form · wait is bounded";
  }
  if (kind === "live") {
    return "● Live · .output mtime still writing · restart blocked";
  }
  if (kind === "shut") {
    return "● Shut · TaskStop / manual kill closed the race";
  }
  return "● Stilled · gate closed · race not spinning · no unbounded wait live · idle word is stilled";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.sleepBlocked
      ? "bounded sleep N was blocked by the Bash tool"
      : "sleep was not scored as blocked",
  );
  reasons.push(
    next.recommendedUntil
      ? "block message recommended until <check>; do sleep 2; done"
      : "block message did not recommend an open until-loop",
  );
  reasons.push(
    next.hasIterationCap
      ? "wait has an iteration cap (for/seq + break)"
      : "wait has no iteration cap",
  );
  reasons.push(
    next.hasDeadline
      ? "wait has a deadline / timeout wrapper"
      : "wait has no deadline",
  );
  reasons.push(
    next.wroteUntilLoop
      ? "agent wrote the unbounded until/while loop"
      : "unbounded loop was not scored as written",
  );
  reasons.push(
    next.promotedToBackground
      ? "foreground timeout promoted the loop to background (bound discarded; see #88702)"
      : "loop was not scored as promoted to background",
  );
  reasons.push(
    next.backgroundStillLive
      ? "background loop is still live"
      : "no live background loop scored",
  );
  reasons.push(
    next.daysAlive >= 1
      ? `loop alive ${next.daysAlive} day(s) across a session boundary`
      : "loop has not crossed a day / session boundary",
  );
  reasons.push(
    next.restartBlocked
      ? "desktop app refuses restart: there's a running task here"
      : "restart was not scored as blocked",
  );
  if (next.taskCount >= 1) {
    reasons.push(`task count ${next.taskCount}`);
  }
  if (next.ppidOne) {
    reasons.push("process orphaned at PPID 1 (shape #89625)");
  }
  if (next.outputUnlinked) {
    reasons.push(".output unlinked while the process is still live (shape #89625)");
  }
  if (next.spunCpu) {
    reasons.push("CPU spinning on an in-shell sleep loop");
  }
  if (next.outputMtimeLive) {
    reasons.push(".output mtime shows the task is still writing");
  }
  if (next.taskStopped) {
    reasons.push("TaskStop / manual kill closed the race");
  }
  if (next.observed) {
    reasons.push("Race sounded: sleep-block, until guidance, promotion, days alive");
  }
  reasons.push("a blocked sleep is not a hold");
  reasons.push(
    "NOT Shunt (nested SendMessage) / Sump (dev/null litter) / Quench (spend kill) / Knock / leftover woodworking / millimetre-slider",
  );
  if (kind === "stilled") {
    reasons.push("gate closed or desk idle; idle word is stilled");
  }
  if (kind === "racing") {
    reasons.push(
      "PRIMARY #90475: Blocked sleep recommends unbounded until-loop → unkillable background task. Filed 2026-08-28, has repro, open. Agent followed the guidance; the until-loop has no iteration cap",
    );
  }
  if (kind === "unbounded") {
    reasons.push(
      "PRIMARY #90475 guidance fault: the block message recommended `until <check>; do sleep 2; done` with no iteration cap or deadline",
    );
  }
  if (kind === "promoted") {
    reasons.push(
      "Shape #88702: run_in_background ignores timeout; foreground timeout moved the loop to background and discarded the bound",
    );
  }
  if (kind === "lingering") {
    reasons.push(
      "PRIMARY #90475 step 6 / shape #88702: never-exiting background task still live days later; no notification",
    );
  }
  if (kind === "flooded") {
    reasons.push("multiple racing until-loops still alive on the race");
  }
  if (kind === "spun") {
    reasons.push(
      "Shape #89625: macOS background Bash tasks orphaned at PID 1; spinning shells; .output unlinked while processes live",
    );
  }
  if (kind === "capped") {
    reasons.push("healthy capped for-loop / timeout form; the wait is bounded");
  }
  if (kind === "live") {
    reasons.push(
      "PRIMARY #90475: .output mtime still writing and/or desktop refuses restart with a running task",
    );
  }
  if (kind === "shut") {
    reasons.push("TaskStop / manual kill closed the race; the gate is shut");
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

export function stilledOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "stilled";
}

export function racingOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "racing";
}

export function unboundedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "unbounded";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], stilled, racing, unbounded }
 * Deterministic. First match wins. Idle stilled first.
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
    stilled: stilledOf(next, verdict),
    racing: racingOf(next, verdict),
    unbounded: unboundedOf(next, verdict),
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
    sleepBlocked: pick("sleepBlocked"),
    recommendedUntil: pick("recommendedUntil"),
    hasIterationCap: pick("hasIterationCap"),
    hasDeadline: pick("hasDeadline"),
    foregroundTimeoutMs: pick("foregroundTimeoutMs"),
    promotedToBackground: pick("promotedToBackground"),
    backgroundStillLive: pick("backgroundStillLive"),
    daysAlive: pick("daysAlive"),
    restartBlocked: pick("restartBlocked"),
    taskCount: pick("taskCount"),
    ppidOne: pick("ppidOne"),
    outputUnlinked: pick("outputUnlinked"),
    wroteUntilLoop: pick("wroteUntilLoop"),
    spunCpu: pick("spunCpu"),
    taskStopped: pick("taskStopped"),
    outputMtimeLive: pick("outputMtimeLive"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    race: fromFields.race,
    gate: fromFields.gate,
    channel: fromFields.channel,
    wheel: fromFields.wheel,
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
    product: "leat",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    stilled: scored.stilled,
    racing: scored.racing,
    unbounded: scored.unbounded,
    cluster: scored.cluster,
    raceStilled: verdict === "stilled",
    raceRacing: verdict === "racing",
    raceUnbounded: verdict === "unbounded",
    racePromoted: verdict === "promoted",
    raceLingering: verdict === "lingering",
    raceFlooded: verdict === "flooded",
    raceSpun: verdict === "spun",
    raceCapped: verdict === "capped",
    raceLive: verdict === "live",
    raceShut: verdict === "shut",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    sleepBlocked: next.sleepBlocked,
    recommendedUntil: next.recommendedUntil,
    hasIterationCap: next.hasIterationCap,
    hasDeadline: next.hasDeadline,
    foregroundTimeoutMs: next.foregroundTimeoutMs,
    promotedToBackground: next.promotedToBackground,
    backgroundStillLive: next.backgroundStillLive,
    daysAlive: next.daysAlive,
    restartBlocked: next.restartBlocked,
    taskCount: next.taskCount,
    ppidOne: next.ppidOne,
    outputUnlinked: next.outputUnlinked,
    wroteUntilLoop: next.wroteUntilLoop,
    spunCpu: next.spunCpu,
    taskStopped: next.taskStopped,
    outputMtimeLive: next.outputMtimeLive,
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
      sleepBlocked: Boolean(extras.sleepBlocked),
      recommendedUntil: Boolean(extras.recommendedUntil),
      hasIterationCap: Boolean(extras.hasIterationCap),
      hasDeadline: Boolean(extras.hasDeadline),
      foregroundTimeoutMs: extras.foregroundTimeoutMs != null ? Number(extras.foregroundTimeoutMs) : 0,
      promotedToBackground: Boolean(extras.promotedToBackground),
      backgroundStillLive: Boolean(extras.backgroundStillLive),
      daysAlive: extras.daysAlive != null ? Number(extras.daysAlive) : 0,
      restartBlocked: Boolean(extras.restartBlocked),
      taskCount: extras.taskCount != null ? Number(extras.taskCount) : 0,
      ppidOne: Boolean(extras.ppidOne),
      outputUnlinked: Boolean(extras.outputUnlinked),
      wroteUntilLoop: Boolean(extras.wroteUntilLoop),
      spunCpu: Boolean(extras.spunCpu),
      taskStopped: Boolean(extras.taskStopped),
      outputMtimeLive: Boolean(extras.outputMtimeLive),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. Gate closed. Nothing scored. */
export function seedStilled() {
  return seedProbe("stilled", "race", {
    session: "stilled",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90475 racing.
 * Sleep blocked. Block message recommended until-loop.
 * No iteration cap. No deadline. Agent wrote the loop.
 * Promoted to background. Still live five days later.
 * Restart blocked.
 */
export function seed90475Racing() {
  return seedProbe(90475, "anthropics/claude-code#90475", {
    session: "90475-racing",
    sleepBlocked: true,
    recommendedUntil: true,
    hasIterationCap: false,
    hasDeadline: false,
    foregroundTimeoutMs: 600000,
    promotedToBackground: true,
    backgroundStillLive: true,
    daysAlive: 5,
    restartBlocked: true,
    taskCount: 1,
    wroteUntilLoop: true,
    outputMtimeLive: true,
  });
}

/** Guidance fault only: block message recommended the open until-loop. */
export function seedUnbounded() {
  return seedProbe(90475, "anthropics/claude-code#90475", {
    session: "90475-unbounded",
    sleepBlocked: true,
    recommendedUntil: true,
    hasIterationCap: false,
    hasDeadline: false,
  });
}

/** Promoted: foreground timeout moved the loop to background. */
export function seedPromoted() {
  return seedProbe(88702, "anthropics/claude-code#88702", {
    session: "88702-promoted",
    promotedToBackground: true,
    backgroundStillLive: true,
    foregroundTimeoutMs: 600000,
  });
}

/** Lingering: background loop still live across a session / days later. */
export function seedLingering() {
  return seedProbe(88702, "anthropics/claude-code#88702", {
    session: "88702-lingering",
    backgroundStillLive: true,
    daysAlive: 5,
  });
}

/** Flooded: three until-loops still alive. */
export function seedFlooded() {
  return seedProbe(90475, "anthropics/claude-code#90475", {
    session: "90475-flooded",
    taskCount: 3,
    backgroundStillLive: true,
  });
}

/** Spun: CPU spinning; orphaned at PPID 1. */
export function seedSpun() {
  return seedProbe(89625, "anthropics/claude-code#89625", {
    session: "89625-spun",
    ppidOne: true,
    spunCpu: true,
    outputUnlinked: true,
  });
}

/** Capped: healthy for-loop / timeout form. */
export function seedCapped() {
  return seedProbe("capped", "race", {
    session: "capped",
    issue: null,
    hasIterationCap: true,
    hasDeadline: true,
    sleepBlocked: true,
  });
}

/** Live: .output mtime still writing; restart blocked. */
export function seedLive() {
  return seedProbe(90475, "anthropics/claude-code#90475", {
    session: "90475-live",
    restartBlocked: true,
    outputMtimeLive: true,
  });
}

/** Shut: TaskStop / manual kill closed the race. */
export function seedShut() {
  return seedProbe(90475, "anthropics/claude-code#90475", {
    session: "90475-shut",
    taskStopped: true,
    backgroundStillLive: false,
  });
}

const SEEDS = {
  stilled: seedStilled,
  racing: seed90475Racing,
  90475: seed90475Racing,
  "90475-racing": seed90475Racing,
  unbounded: seedUnbounded,
  "90475-unbounded": seedUnbounded,
  promoted: seedPromoted,
  88702: seedPromoted,
  "88702-promoted": seedPromoted,
  lingering: seedLingering,
  "88702-lingering": seedLingering,
  flooded: seedFlooded,
  "90475-flooded": seedFlooded,
  spun: seedSpun,
  89625: seedSpun,
  "89625-spun": seedSpun,
  capped: seedCapped,
  live: seedLive,
  "90475-live": seedLive,
  shut: seedShut,
  "90475-shut": seedShut,
};

function racingStrike(session) {
  return {
    ...emptyProbe(),
    sleepBlocked: true,
    recommendedUntil: true,
    hasIterationCap: false,
    hasDeadline: false,
    foregroundTimeoutMs: 600000,
    promotedToBackground: true,
    backgroundStillLive: true,
    daysAlive: 5,
    restartBlocked: true,
    taskCount: 1,
    wroteUntilLoop: true,
    outputMtimeLive: true,
    session: session || "racing",
    source: "race",
    issue: 90475,
    scored: true,
  };
}

function stilledHold(session) {
  return {
    ...emptyProbe(),
    session: session || "stilled",
    source: "hold",
    scored: true,
  };
}

function shutHold(session) {
  return {
    ...emptyProbe(),
    taskStopped: true,
    session: session || "shut",
    source: "taskstop",
    issue: 90475,
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

  if (verb === "bail" || verb === "stilled" || verb === "still") {
    return pack("stilled", emptyProbe(), { ...action, action: verb === "still" ? "bail" : verb });
  }

  if (verb === "shut" || verb === "taskstop" || verb === "kill") {
    probe = shutHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: verb === "taskstop" || verb === "kill" ? "shut" : verb });
  }

  if (verb === "race" || verb === "channel" || verb === "gate") {
    probe = racingStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "race" });
  }

  if (verb === "still-out" || verb === "close-gate" || verb === "dry-out") {
    probe = stilledHold(action.session || probe.session);
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
