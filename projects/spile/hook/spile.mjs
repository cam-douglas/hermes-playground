/**
 * Spile — cooper's bung / wooden tap
 * for Claude Code hook stdin that stays
 * open without EOF, while the declared
 * per-hook timeout is not enforced
 * parent-side. The hook's unbounded stdin
 * read then blocks for as long as the
 * pipe stays open (measured hours).
 *
 * A cooper's spile is the wooden tap in
 * a barrel. Leave it out and the barrel
 * drains for hours. Reseat it (EOF +
 * enforced timeout) and the wedge stops.
 * An open spile is not a hold. Score the
 * tap or admit bunged.
 *
 * Primary #90585: open, has repro, filed
 * 2026-08-29, Linux x86_64, Claude Code
 * 2.1.246 (wedged process; client later
 * 2.1.251). Twice in one day:
 *   1. Turn ended while two Bash
 *      run_in_background tasks still
 *      running; completion notifications
 *      never delivered; session froze
 *      showing a hook statusMessage in
 *      the spinner. First freeze ~8h
 *      until interrupt.
 *   2. Same day, second freeze ~1.5h
 *      until process restart. After
 *      interrupt/restart, pending
 *      notifications arrived immediately.
 * Hook scripts used unbounded stdin
 * reads (`dd bs=1048577 count=1` /
 * `payload=$(cat)`). Probe:
 *   time sh hook.sh < <(sleep 6)
 *     → 6.003s (pipe open, no EOF)
 *   echo payload | time sh hook.sh
 *     → 0.052s (EOF, instant)
 * Declared `"timeout": 5` on the wedged
 * hook was NOT enforced (8h >> 5s).
 * Mitigation that works: wrap stdin
 * read in `timeout 2 dd …` (verified
 * 2.043s against a 30s-open pipe).
 *
 * Same-class (cite, do not invent):
 *   #87289 — declared hook timeout does
 *            not apply while hook blocked
 *            reading stdin (~300s, holds
 *            the tool call)
 *   #85250 — declared hook timeout not
 *            enforced parent-side; wedged
 *            hook freezes session
 *            permanently
 *   #78756 — Windows: client never closes
 *            hook stdin pipe; hooks hang
 *            forever (2.1.208+)
 *
 * Nearby shape only (different pole):
 *   #48009 — Windows UserPromptSubmit
 *            hooks receive empty stdin
 *   #38162 — macOS async hooks empty
 *            stdin
 *
 * Cross-ecosystem:
 *   openai/codex#27550 — hook stdin write
 *            happens outside the per-hook
 *            timeout; a hook that ignores
 *            stdin can hang the turn
 *            forever
 *
 * Verdicts: bunged | open-pipe | no-eof
 *           | timeout-ignored | wedge
 *           | hours-held | script-alive
 *           | parent-blind | self-timeout
 *           | unretracted
 * Idle word is bunged (spile seated;
 * payload delivered with EOF; declared
 * timeout armed and enforceable).
 * NEVER use spile / empty / silent /
 * mute / idle / dead as idle. NEVER
 * reuse belayed, rove, keyed, housed,
 * beamed, snug, hung, appointed,
 * cinched, gauged, stamped, overrun,
 * pratique, wound, bound, stilled,
 * stabled, drained, flat, fit, spoilt,
 * laid, unlinked, tight, banked,
 * roosted, stocked, seated, heard,
 * clear, paired, kernel, latched,
 * upheld, sterling, home, valid, dry,
 * sealed, quiet, seised, rung, moored.
 * Do NOT ship Bung, Deadman, Petcock,
 * Flume, Sluice, Lanyard, Dashpot,
 * Watchdog as the product name. Product
 * name is Spile only.
 *
 * Slack alarm on wedge / hours-held /
 * timeout-ignored / open-pipe / no-eof /
 * script-alive / parent-blind /
 * unretracted.
 * Linear ticket on wedge / hours-held /
 * timeout-ignored / open-pipe.
 * GitHub spile-ledger of scored taps on
 * every score.
 *
 * Priority when multiple match:
 *   wedge > hours-held > timeout-ignored
 *   > open-pipe > no-eof > script-alive
 *   > parent-blind > unretracted >
 *   self-timeout > bunged
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the wedge pentad (hours-scale
 * open pipe, no EOF, declared timeout
 * ignored, statusMessage stuck,
 * notifications held).
 *
 * bunged is true ONLY when the pipe is
 * closed with EOF, the declared timeout
 * would be enforceable / was honored,
 * the hook is not wedging, and the
 * verdict is not a failure class.
 *
 * Why this is not a clone:
 * NOT Sounder — missed background Bash
 *     completion notification (wakeup
 *     dropped). Spile is the hook stdin
 *     pipe kept open without EOF +
 *     unenforced declared timeout.
 * NOT Tappet — silent hook injection /
 *     valve-train spawn. Spile is stdin
 *     EOF / timeout enforcement on an
 *     already-declared hook.
 * NOT Quench — circuit breaker.
 * NOT Leat — sleep blocked unbounded
 *     until.
 * NOT Ullage — silent context drop /
 *     prefix-frozen cache thrash;
 *     cooper gauging desk. Spile is
 *     cooper bung/tap for an open stdin
 *     pipe — different tool.
 * NOT Bollard / Clew / Binnacle / Pirn
 *     / Cotter / Fob / Ordo / Cinch /
 *     Visa / Sprag / Lazaret /
 *     leftovers / millimetre-slider.
 * Different problem: HOOK STDIN PIPE
 * OPEN (NO EOF) + DECLARED TIMEOUT NOT
 * ENFORCED PARENT-SIDE → SESSION WEDGE
 * FOR HOURS.
 * Different UI: brewery/cellar bung-
 * mallet station. Oak barrel head,
 * brass spile, wooden bung, mallet,
 * drip tray, timeout fuse lamp.
 * Different idle: bunged.
 */

export const VERDICTS = Object.freeze([
  "bunged",
  "open-pipe",
  "no-eof",
  "timeout-ignored",
  "wedge",
  "hours-held",
  "script-alive",
  "parent-blind",
  "self-timeout",
  "unretracted",
]);
export const IDLE_WORD = "bunged";
export const SLACK_VERDICTS = Object.freeze([
  "wedge",
  "hours-held",
  "timeout-ignored",
  "open-pipe",
  "no-eof",
  "script-alive",
  "parent-blind",
  "unretracted",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "wedge",
  "hours-held",
  "timeout-ignored",
  "open-pipe",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90585;
export const DEMO_WEDGE_SEC = 28800;
export const DEMO_HOURS_SECOND_SEC = 5400;
export const DEMO_DECLARED_TIMEOUT_SEC = 5;
export const DEMO_PROBE_SEC = 6.003;
export const DEMO_EOF_SEC = 0.052;
export const DEMO_SELF_TIMEOUT_SEC = 2.043;
export const DEMO_OPEN_PIPE_SHORT_SEC = 3;
export const DEMO_TIMEOUT_IGNORED_SEC = 300;
export const HOURS_HELD_MIN = 5400;

const FORBIDDEN_IDLE = Object.freeze([
  "spile",
  "bung",
  "deadman",
  "petcock",
  "flume",
  "sluice",
  "lanyard",
  "dashpot",
  "watchdog",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "moored",
  "bollard",
  "clew",
  "sounder",
  "binnacle",
  "pirn",
  "cotter",
  "fob",
  "ordo",
  "cinch",
  "ullage",
  "visa",
  "sprag",
  "lazaret",
  "fusee",
  "iota",
  "tappet",
  "quench",
  "leat",
  "reveille",
  "cote",
  "hasp",
  "wicket",
  "parity",
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

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function emptySpile() {
  return {
    session: "",
    issue: null,
    source: "",
    pipeOpen: false,
    eofDelivered: false,
    declaredTimeoutSec: 0,
    observedBlockSec: 0,
    hookStillAlive: false,
    parentEnforcedTimeout: true,
    statusMessageStuck: false,
    notificationsHeld: false,
    selfTimeoutWrapped: false,
    scored: false,
  };
}

export function emptyAction(session = "bunged-1") {
  return {
    action: "score",
    session,
    spile: emptySpile(),
  };
}

export function cloneSpile(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptySpile();
  const nested =
    (src.spile && typeof src.spile === "object" && src.spile) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.tap && typeof src.tap === "object" && src.tap) ||
    src;
  const parentRaw = nested.parentEnforcedTimeout ?? src.parentEnforcedTimeout;
  return {
    ...emptySpile(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    pipeOpen: asBool(nested.pipeOpen ?? src.pipeOpen, false) === true,
    eofDelivered: asBool(nested.eofDelivered ?? src.eofDelivered, false) === true,
    declaredTimeoutSec: asNumber(nested.declaredTimeoutSec ?? src.declaredTimeoutSec, 0),
    observedBlockSec: asNumber(nested.observedBlockSec ?? src.observedBlockSec, 0),
    hookStillAlive: asBool(nested.hookStillAlive ?? src.hookStillAlive, false) === true,
    parentEnforcedTimeout: parentRaw == null ? true : asBool(parentRaw, true) === true,
    statusMessageStuck: asBool(nested.statusMessageStuck ?? src.statusMessageStuck, false) === true,
    notificationsHeld: asBool(nested.notificationsHeld ?? src.notificationsHeld, false) === true,
    selfTimeoutWrapped: asBool(nested.selfTimeoutWrapped ?? src.selfTimeoutWrapped, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(spile = {}) {
  const next = cloneSpile(spile);
  const observed = next.observedBlockSec;
  const declared = next.declaredTimeoutSec;
  const hoursScale = observed >= HOURS_HELD_MIN;
  const timeoutExceeded =
    declared > 0 && observed > declared && next.parentEnforcedTimeout !== true;
  const wedgeShape =
    next.pipeOpen === true &&
    next.eofDelivered !== true &&
    hoursScale &&
    timeoutExceeded &&
    (next.statusMessageStuck === true || next.notificationsHeld === true);
  const hoursHeldShape = hoursScale && wedgeShape !== true;
  const timeoutIgnoredShape =
    timeoutExceeded &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true;
  const openPipeShape =
    next.pipeOpen === true &&
    next.eofDelivered !== true &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true;
  const noEofShape =
    next.eofDelivered !== true &&
    observed > 0 &&
    next.pipeOpen !== true &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true &&
    openPipeShape !== true;
  const scriptAliveShape =
    next.hookStillAlive === true &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true &&
    openPipeShape !== true &&
    noEofShape !== true;
  const parentBlindShape =
    next.parentEnforcedTimeout !== true &&
    declared > 0 &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true &&
    openPipeShape !== true &&
    noEofShape !== true &&
    scriptAliveShape !== true;
  const unretractedShape =
    (next.statusMessageStuck === true || next.notificationsHeld === true) &&
    next.selfTimeoutWrapped !== true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true &&
    openPipeShape !== true &&
    noEofShape !== true &&
    scriptAliveShape !== true &&
    parentBlindShape !== true;
  const selfTimeoutShape =
    next.selfTimeoutWrapped === true &&
    wedgeShape !== true &&
    hoursHeldShape !== true &&
    timeoutIgnoredShape !== true &&
    openPipeShape !== true &&
    noEofShape !== true &&
    scriptAliveShape !== true &&
    parentBlindShape !== true &&
    unretractedShape !== true;
  const pipeClosedWithEof = next.eofDelivered === true && next.pipeOpen !== true;
  const timeoutHonored =
    next.parentEnforcedTimeout === true || (pipeClosedWithEof && !timeoutExceeded);
  const notWedging =
    wedgeShape !== true && next.hookStillAlive !== true && hoursScale !== true;
  const bungedHold = pipeClosedWithEof && timeoutHonored && notWedging;
  return {
    pipeOpen: next.pipeOpen,
    eofDelivered: next.eofDelivered,
    declaredTimeoutSec: declared,
    observedBlockSec: observed,
    hookStillAlive: next.hookStillAlive,
    parentEnforcedTimeout: next.parentEnforcedTimeout,
    statusMessageStuck: next.statusMessageStuck,
    notificationsHeld: next.notificationsHeld,
    selfTimeoutWrapped: next.selfTimeoutWrapped,
    hoursScale,
    timeoutExceeded,
    wedgeShape,
    hoursHeldShape,
    timeoutIgnoredShape,
    openPipeShape,
    noEofShape,
    scriptAliveShape,
    parentBlindShape,
    unretractedShape,
    selfTimeoutShape,
    pipeClosedWithEof,
    timeoutHonored,
    notWedging,
    bungedHold,
  };
}

export function isIdle(spile = {}) {
  const next = cloneSpile(spile);
  return (
    next.pipeOpen !== true &&
    next.eofDelivered !== true &&
    next.declaredTimeoutSec <= 0 &&
    next.observedBlockSec <= 0 &&
    next.hookStillAlive !== true &&
    next.parentEnforcedTimeout === true &&
    next.statusMessageStuck !== true &&
    next.notificationsHeld !== true &&
    next.selfTimeoutWrapped !== true
  );
}

/**
 * First match wins by documented priority:
 * wedge > hours-held > timeout-ignored >
 * open-pipe > no-eof > script-alive >
 * parent-blind > unretracted >
 * self-timeout > bunged.
 * Idle bunged is first. Seeded #90585
 * numbers must produce wedge, never
 * bunged. An open spile is not a hold.
 */
export function classify(spile = {}) {
  const next = cloneSpile(spile);
  if (isIdle(next)) return "bunged";
  const facts = analyze(next);

  if (facts.wedgeShape) return "wedge";
  if (facts.hoursHeldShape) return "hours-held";
  if (facts.timeoutIgnoredShape) return "timeout-ignored";
  if (facts.openPipeShape) return "open-pipe";
  if (facts.noEofShape) return "no-eof";
  if (facts.scriptAliveShape) return "script-alive";
  if (facts.parentBlindShape) return "parent-blind";
  if (facts.unretractedShape) return "unretracted";
  if (facts.selfTimeoutShape) return "self-timeout";
  if (facts.bungedHold) return "bunged";
  return "bunged";
}

export function feedOf(spile = {}, verdict = "") {
  const kind = verdict || classify(spile);
  if (kind === "wedge") {
    return "● Wedge · pipe open no EOF for hours · declared timeout 5s ignored · session frozen on hook statusMessage · notifications held until interrupt · primary #90585";
  }
  if (kind === "hours-held") {
    return "● Hours-held · ~8h first freeze / ~1.5h second · pipe stayed open without EOF";
  }
  if (kind === "timeout-ignored") {
    return "● Timeout-ignored · settings.json declares timeout 5 · hook lives >> 5s · parent did not kill";
  }
  if (kind === "open-pipe") {
    return "● Open-pipe · stdin pipe kept open · no EOF yet · short duration";
  }
  if (kind === "no-eof") {
    return "● No-eof · measured probe blocks exactly as long as the pipe stays open · 6.003s against sleep 6";
  }
  if (kind === "script-alive") {
    return "● Script-alive · hook process not terminated by parent";
  }
  if (kind === "parent-blind") {
    return "● Parent-blind · parent does not enforce timeout while blocked on stdin";
  }
  if (kind === "unretracted") {
    return "● Unretracted · statusMessage of hook stuck in spinner · notifications queued behind the wedge";
  }
  if (kind === "self-timeout") {
    return "● Self-timeout · script wraps stdin read in timeout 2 · ends hang class · verified 2.043s against a 30s-open pipe · control / proof path";
  }
  return "● Bunged · spile seated · payload delivered with EOF · declared timeout armed and enforceable · idle word is bunged";
}

export function reasonsOf(spile = {}, verdict = "") {
  const next = cloneSpile(spile);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.pipeOpen || facts.observedBlockSec || facts.declaredTimeoutSec || facts.eofDelivered
      ? `tap pipe ${facts.pipeOpen ? "open" : "closed"} · eof ${facts.eofDelivered ? "yes" : "no"} · declared ${facts.declaredTimeoutSec}s · observed ${facts.observedBlockSec}s · hook alive ${facts.hookStillAlive ? "yes" : "no"} · parent enforced ${facts.parentEnforcedTimeout ? "yes" : "no"}`
      : "spile seated · bung in the hole · payload delivered with EOF · idle word is bunged",
  );
  if (facts.wedgeShape) {
    reasons.push(
      "pipe open no EOF for hours · declared timeout ignored · session frozen on hook statusMessage · background tasks finished but notifications held until interrupt · the #90585 damage",
    );
  }
  if (facts.hoursScale) {
    reasons.push(
      `observed block ${facts.observedBlockSec}s (≥1.5h) · first freeze ~8h · second freeze ~1.5h · 8h >> declared 5s`,
    );
  }
  if (facts.timeoutExceeded) {
    reasons.push(
      `declared timeout ${facts.declaredTimeoutSec}s · observed ${facts.observedBlockSec}s · parent did not enforce · matches #87289 (~300s while blocked on stdin) and #85250 (parent-side timeout not enforced)`,
    );
  }
  if (facts.pipeOpen && !facts.eofDelivered) {
    reasons.push(
      "stdin pipe kept open without EOF · unbounded read (`dd bs=1048577 count=1` / `payload=$(cat)`) blocks for as long as the pipe stays open",
    );
  }
  if (facts.noEofShape) {
    reasons.push(
      "probe: time sh hook.sh < <(sleep 6) → 6.003s · with EOF → 0.052s · the hang equals the open-pipe interval",
    );
  }
  if (facts.hookStillAlive) {
    reasons.push("hook process still alive · parent did not terminate the script");
  }
  if (facts.parentEnforcedTimeout === false && facts.declaredTimeoutSec > 0) {
    reasons.push(
      "parent-blind while blocked on stdin · declared timeout is not a parent-side kill",
    );
  }
  if (facts.statusMessageStuck || facts.notificationsHeld) {
    reasons.push(
      "statusMessage of the hook stuck in the spinner · completion notifications queued behind the wedge · after interrupt/restart they arrived immediately",
    );
  }
  if (facts.selfTimeoutWrapped) {
    reasons.push(
      "self-timeout wrap (`timeout 2 dd …`) ended the hang class · verified 2.043s against a 30s-open pipe · parent still failed; the script reseated its own bung",
    );
  }
  reasons.push("an open spile is not a hold");
  reasons.push(
    "NOT Sounder (missed background Bash wakeup) / Tappet (silent hook injection) / Quench (circuit breaker) / Leat (sleep blocked unbounded until) / Ullage (silent context drop / cooper gauging desk) / Bollard / Clew / Binnacle / Pirn / Cotter / Fob / Ordo / Cinch / Visa / Sprag / Lazaret / leftover woodworking / millimetre-slider.",
  );
  if (kind === "bunged") {
    reasons.push(
      "spile seated; payload delivered with EOF; declared timeout armed and enforceable; idle word is bunged",
    );
  }
  if (kind === "wedge") {
    reasons.push(
      "PRIMARY #90585: pipe open no EOF for hours; declared timeout 5s ignored; session frozen on hook statusMessage; notifications held until interrupt. The wedge case is wedge, never bunged.",
    );
  }
  if (kind === "hours-held") {
    reasons.push("~8h first freeze / ~1.5h second.");
  }
  if (kind === "timeout-ignored") {
    reasons.push("settings.json declares timeout 5 but the hook lives >> 5s.");
  }
  if (kind === "open-pipe") {
    reasons.push("stdin pipe kept open, no EOF yet, short duration.");
  }
  if (kind === "no-eof") {
    reasons.push("measured probe: blocks exactly as long as the pipe stays open.");
  }
  if (kind === "script-alive") {
    reasons.push("hook process not terminated by parent.");
  }
  if (kind === "parent-blind") {
    reasons.push("parent does not enforce timeout while blocked on stdin.");
  }
  if (kind === "unretracted") {
    reasons.push("statusMessage stuck in spinner; notifications queued behind the wedge.");
  }
  if (kind === "self-timeout") {
    reasons.push(
      "script wraps stdin read in timeout 2; ends hang class even when the parent fails (control / proof path).",
    );
  }
  return reasons;
}

export function verdictOf(spile = {}) {
  return classify(spile);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function bungedOf(spile = {}, verdict = "") {
  const kind = verdict || classify(spile);
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (kind === "self-timeout") return false;
  const facts = analyze(spile);
  if (isIdle(spile)) return true;
  return facts.bungedHold === true;
}

export function wedgeOf(spile = {}, verdict = "") {
  return (verdict || classify(spile)) === "wedge";
}

export function summaryOf(spile = {}) {
  const next = cloneSpile(spile);
  const facts = analyze(next);
  return {
    pipeOpen: facts.pipeOpen,
    eofDelivered: facts.eofDelivered,
    declaredTimeoutSec: facts.declaredTimeoutSec,
    observedBlockSec: facts.observedBlockSec,
    hookStillAlive: facts.hookStillAlive,
    parentEnforcedTimeout: facts.parentEnforcedTimeout,
    statusMessageStuck: facts.statusMessageStuck,
    notificationsHeld: facts.notificationsHeld,
    selfTimeoutWrapped: facts.selfTimeoutWrapped,
  };
}

export function score(spile = {}) {
  const next = cloneSpile(spile);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    bunged: bungedOf(next, verdict),
    wedge: wedgeOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    pipeOpen: facts.pipeOpen,
    eofDelivered: facts.eofDelivered,
    declaredTimeoutSec: facts.declaredTimeoutSec,
    observedBlockSec: facts.observedBlockSec,
    hookStillAlive: facts.hookStillAlive,
    parentEnforcedTimeout: facts.parentEnforcedTimeout,
    statusMessageStuck: facts.statusMessageStuck,
    notificationsHeld: facts.notificationsHeld,
    selfTimeoutWrapped: facts.selfTimeoutWrapped,
    summary: summaryOf(next),
    spile: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const spileSrc =
    src.spile ||
    src.probe ||
    src.payload ||
    src.tap ||
    payload.spile ||
    payload.probe ||
    payload.tap;
  const spile = cloneSpile(
    spileSrc && typeof spileSrc === "object" ? { ...spileSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !spile.session) spile.session = src.session;
  if (typeof payload.session === "string" && !spile.session) spile.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? spile.session ?? ""),
    spile,
    issue: src.issue ?? payload.issue ?? spile.issue ?? null,
    source: src.source ?? payload.source ?? spile.source ?? "",
  };
}

function spileResult(verdict, spile, action, extras = {}) {
  const next = cloneSpile(spile);
  const scored = score(next);
  return {
    ok: true,
    product: "spile",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    bunged: scored.bunged,
    wedge: scored.wedge,
    spileBunged: verdict === "bunged",
    spileOpenPipe: verdict === "open-pipe",
    spileNoEof: verdict === "no-eof",
    spileTimeoutIgnored: verdict === "timeout-ignored",
    spileWedge: verdict === "wedge",
    spileHoursHeld: verdict === "hours-held",
    spileScriptAlive: verdict === "script-alive",
    spileParentBlind: verdict === "parent-blind",
    spileSelfTimeout: verdict === "self-timeout",
    spileUnretracted: verdict === "unretracted",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    pipeOpen: scored.pipeOpen,
    eofDelivered: scored.eofDelivered,
    declaredTimeoutSec: scored.declaredTimeoutSec,
    observedBlockSec: scored.observedBlockSec,
    hookStillAlive: scored.hookStillAlive,
    parentEnforcedTimeout: scored.parentEnforcedTimeout,
    statusMessageStuck: scored.statusMessageStuck,
    notificationsHeld: scored.notificationsHeld,
    selfTimeoutWrapped: scored.selfTimeoutWrapped,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    spile: next,
    ...extras,
  };
}

function seedSpile(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    spile: {
      ...emptySpile(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      pipeOpen: Boolean(extras.pipeOpen),
      eofDelivered: Boolean(extras.eofDelivered),
      declaredTimeoutSec: asNumber(extras.declaredTimeoutSec, 0),
      observedBlockSec: asNumber(extras.observedBlockSec, 0),
      hookStillAlive: Boolean(extras.hookStillAlive),
      parentEnforcedTimeout:
        extras.parentEnforcedTimeout == null ? true : Boolean(extras.parentEnforcedTimeout),
      statusMessageStuck: Boolean(extras.statusMessageStuck),
      notificationsHeld: Boolean(extras.notificationsHeld),
      selfTimeoutWrapped: Boolean(extras.selfTimeoutWrapped),
    },
  };
}

/** Idle reset. Spile seated. Payload delivered. Timeout armed. */
export function seedBunged() {
  return seedSpile("bunged", "cellar", {
    session: "bunged",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedBunged();
}

/**
 * Control / proof: payload delivered with
 * EOF, instant return (0.052s). Classifies
 * as bunged; bunged true.
 */
export function seedControl() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-control",
    issue: null,
    pipeOpen: false,
    eofDelivered: true,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    observedBlockSec: DEMO_EOF_SEC,
    hookStillAlive: false,
    parentEnforcedTimeout: true,
  });
}

/**
 * #90585 wedge: pipe open no EOF for
 * hours, declared timeout 5s ignored,
 * session frozen on hook statusMessage,
 * notifications held until interrupt.
 * An open spile is not a hold. The
 * wedge case is wedge, never bunged.
 */
export function seedWedge() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-wedge",
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    observedBlockSec: DEMO_WEDGE_SEC,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: true,
    notificationsHeld: true,
  });
}

export function seed90585() {
  return seedWedge();
}

/** Stdin pipe kept open, no EOF yet, short duration. */
export function seedOpenPipe() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-open-pipe",
    pipeOpen: true,
    eofDelivered: false,
    observedBlockSec: DEMO_OPEN_PIPE_SHORT_SEC,
  });
}

/**
 * Measured probe: blocks exactly as long
 * as the pipe stays open (6.003s).
 * Unique flags: completed probe, no EOF
 * during the hang, pipe no longer open.
 */
export function seedNoEof() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-no-eof",
    pipeOpen: false,
    eofDelivered: false,
    observedBlockSec: DEMO_PROBE_SEC,
  });
}

/**
 * settings.json declares timeout 5 but
 * the hook lives >> 5s (~300s, #87289).
 * Unique flags: timeout exceeded without
 * hours-scale or the wedge pentad.
 */
export function seedTimeoutIgnored() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#87289", {
    session: "90585-timeout-ignored",
    issue: 87289,
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    observedBlockSec: DEMO_TIMEOUT_IGNORED_SEC,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
  });
}

/**
 * ~8h first freeze / ~1.5h second.
 * Unique flags: hours-scale without the
 * session-freeze extras (status stuck +
 * notifications held).
 */
export function seedHoursHeld() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-hours-held",
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    observedBlockSec: DEMO_WEDGE_SEC,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: false,
    notificationsHeld: false,
  });
}

/** Hook process not terminated by parent. */
export function seedScriptAlive() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-script-alive",
    hookStillAlive: true,
  });
}

/**
 * Parent does not enforce timeout while
 * blocked on stdin. Unique flags:
 * declared timeout set, parent blind,
 * observed still inside the window.
 */
export function seedParentBlind() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#85250", {
    session: "90585-parent-blind",
    issue: 85250,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    parentEnforcedTimeout: false,
    observedBlockSec: 0,
  });
}

/**
 * statusMessage of hook stuck in spinner;
 * notifications queued behind the wedge.
 */
export function seedUnretracted() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-unretracted",
    statusMessageStuck: true,
    notificationsHeld: true,
  });
}

/**
 * Mitigation: script wraps stdin read in
 * `timeout 2 …`. Ends the hang class
 * (control / proof that self-timeout
 * works even when the parent fails).
 * Verdict is self-timeout; bunged false
 * because the parent still did not honor
 * the declared timeout.
 */
export function seedSelfTimeout() {
  return seedSpile(FEATURED_ISSUE, "anthropics/claude-code#90585", {
    session: "90585-self-timeout",
    pipeOpen: false,
    eofDelivered: false,
    declaredTimeoutSec: DEMO_DECLARED_TIMEOUT_SEC,
    observedBlockSec: DEMO_SELF_TIMEOUT_SEC,
    hookStillAlive: false,
    parentEnforcedTimeout: false,
    selfTimeoutWrapped: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptySpile();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneSpile({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneSpile({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const wedge =
    /statusMessage|notifications held|8h|8 hours|#90585/i.test(text) &&
    /wedge|frozen|pipe open|no EOF|timeout 5/i.test(text);
  const hoursHeld = /hours-held|~8h|1\.5h|8 hours|1\.5 hours/i.test(text);
  const timeoutIgnored =
    /timeout-ignored|timeout 5 but|lives >> 5|303244ms|~300s/i.test(text);
  const openPipe = /open-pipe|pipe kept open|pipe open, no EOF yet/i.test(text);
  const noEof = /no-eof|6\.003|blocks exactly as long|< <\(sleep 6\)/i.test(text);
  const scriptAlive = /script-alive|hook process not terminated|hook still alive/i.test(text);
  const parentBlind = /parent-blind|parent does not enforce|parent-side/i.test(text);
  const unretracted =
    /unretracted|statusMessage stuck|notifications queued/i.test(text);
  const selfTimeout = /self-timeout|timeout 2 dd|2\.043/i.test(text);
  const bunged = /admit bunged|spile seated|payload delivered with EOF/i.test(text);

  if (wedge) {
    return {
      ...seedWedge().spile,
      session: "paste-wedge",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (hoursHeld && !/wedge/.test(text)) {
    return {
      ...seedHoursHeld().spile,
      session: "paste-hours-held",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (timeoutIgnored) {
    return {
      ...seedTimeoutIgnored().spile,
      session: "paste-timeout-ignored",
      source: "anthropics/claude-code#87289",
      issue: 87289,
      scored: true,
    };
  }
  if (openPipe) {
    return {
      ...seedOpenPipe().spile,
      session: "paste-open-pipe",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (noEof) {
    return {
      ...seedNoEof().spile,
      session: "paste-no-eof",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (scriptAlive) {
    return {
      ...seedScriptAlive().spile,
      session: "paste-script-alive",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (parentBlind) {
    return {
      ...seedParentBlind().spile,
      session: "paste-parent-blind",
      source: "anthropics/claude-code#85250",
      issue: 85250,
      scored: true,
    };
  }
  if (unretracted) {
    return {
      ...seedUnretracted().spile,
      session: "paste-unretracted",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (selfTimeout) {
    return {
      ...seedSelfTimeout().spile,
      session: "paste-self-timeout",
      source: "anthropics/claude-code#90585",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (bunged) {
    return { ...seedBunged().spile, session: "paste-bunged", source: "paste", scored: true };
  }
  return { ...emptySpile(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  bunged: seedBunged,
  control: seedControl,
  wedge: seedWedge,
  90585: seed90585,
  "90585-wedge": seedWedge,
  "open-pipe": seedOpenPipe,
  openpipe: seedOpenPipe,
  "no-eof": seedNoEof,
  noeof: seedNoEof,
  "timeout-ignored": seedTimeoutIgnored,
  timeoutignored: seedTimeoutIgnored,
  "hours-held": seedHoursHeld,
  hoursheld: seedHoursHeld,
  "script-alive": seedScriptAlive,
  scriptalive: seedScriptAlive,
  "parent-blind": seedParentBlind,
  parentblind: seedParentBlind,
  unretracted: seedUnretracted,
  "self-timeout": seedSelfTimeout,
  selftimeout: seedSelfTimeout,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  tap: seedControl,
  cellar: seedControl,
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
  let spile = cloneSpile(action.spile);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "bunged" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return spileResult("bunged", emptySpile(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "tap" || verb === "cellar") {
    spile = seedControl().spile;
    return spileResult(classify(spile), spile, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "wedge" || verb === "incident" || verb === "90585") {
    spile = seedWedge().spile;
    return spileResult(classify(spile), spile, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "seat" || verb === "reseat") {
    spile = { ...spile, scored: true };
    return spileResult(classify(spile), spile, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    spile = { ...spile, scored: true };
    return spileResult(classify(spile), spile, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  spile = { ...spile, scored: true };
  return spileResult(classify(spile), spile, action);
}
