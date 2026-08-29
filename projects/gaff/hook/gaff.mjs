/**
 * Gaff — vaudeville gaff desk for a
 * real Claude Code failure: a
 * backgrounded Bash command that the
 * harness KILLS (timeout, SIGKILL of
 * the process group, or turn-boundary
 * reap) is then reported to the model
 * as a successful completion: status
 * completed, exit code 0. There is no
 * way to distinguish "the command
 * finished" from "the harness killed
 * it partway through." Captured
 * output simply stops mid-stream.
 * Because the model is told exit 0 /
 * completed, it reports success to
 * the user. Remaining work is
 * silently lost.
 *
 * A billed full house is not a hold.
 * Score the crook or admit yanked.
 *
 * Primary #90616: open, filed
 * 2026-08-29, labels bug / has repro /
 * platform:macos / area:bash. Title:
 * Backgrounded Bash command killed by
 * its timeout reports "completed
 * (exit code 0)". Production: loop
 * over 40 batch jobs (~5 min each,
 * timeout 600000) killed after 4
 * iterations; notification said
 * completed exit 0; 36 units of paid
 * API work never ran; only clue was
 * a missing final TOTAL line. Repro:
 * for i in $(seq 1 10); do echo
 * "iter $i"; sleep 90; done; echo
 * "DONE" with run_in_background true
 * and timeout 120000 — observed
 * completed/exit 0, ~1 iteration, no
 * DONE. Expected: timed_out/killed,
 * non-zero exit (128+signal),
 * truncation marker.
 *
 * Same class:
 *   #87055 — background Bash process
 *            group SIGKILLed mid-run
 *            when spawning a
 *            daemonizing CLI; still
 *            reported completed
 *            (exit code 0); traps
 *            never fire.
 *   #88754 — run_in_background
 *            killed at turn
 *            boundary; reported
 *            status does not match
 *            the process.
 *
 * Nearby kill (no false-complete
 * claim — Sounder-adjacent silence,
 * not Gaff's lying receipt):
 *   #84625 — silent mid-run kill
 *            with no notification.
 *   #90490 — Remote Control
 *            background killed
 *            ~5-7 min.
 *
 * Cross-ecosystem false success:
 *   openai/codex#19309 — CLI exits 0
 *            after printing a plan
 *            and performing none of
 *            the work. Different
 *            mechanism, same lie
 *            (exit 0 is not a hold).
 *
 * Verdicts: yanked | billed |
 *           truncated | midloop |
 *           sigkilled | group-reaped |
 *           turn-killed | empty-ok |
 *           hours-lost
 * Idle word is yanked (the crook was
 * seen; the kill was reported as a
 * kill; playbill is not stamped
 * COMPLETE). Honest-complete (no
 * kill and DONE present) is also
 * yanked — the house finished, so
 * there is nothing to yank.
 * NEVER use gaff / empty / silent /
 * mute / idle / dead as idle.
 * NEVER reuse posted, bunged,
 * belayed, rove, keyed, housed,
 * beamed, snug, hung, appointed,
 * cinched, gauged, stamped, overrun,
 * pratique, wound, bound, stilled,
 * stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight,
 * banked, roosted, stocked, seated,
 * heard, clear, paired, kernel,
 * latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised,
 * rung, moored, stowed, caught.
 *
 * Slack alarm on billed / truncated /
 * empty-ok / hours-lost / sigkilled.
 * Linear ticket on billed /
 * hours-lost.
 * GitHub gaff-ledger of scored
 * playbills on every score.
 *
 * Priority when multiple match:
 *   billed > hours-lost > sigkilled >
 *   empty-ok > group-reaped >
 *   turn-killed > yanked-hold >
 *   midloop > truncated > yanked
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90616 billed pentad
 * (timeout/harness-kill + completed
 * + exit 0). billed is the primary
 * lie.
 *
 * yanked is true ONLY when the
 * receipt is honest: timed_out or
 * killed with a nonzero exit, OR
 * there was no kill and DONE/TOTAL
 * is present (honest complete), OR
 * the desk is idle. A billed full
 * house is never yanked.
 *
 * Why this is not a clone:
 * NOT Spile — hook stdin wedge /
 *     timeout NOT enforced. Gaff is
 *     the opposite pole: timeout/kill
 *     DOES fire, then the receipt
 *     LIES.
 * NOT Sounder — background waiter
 *     completes cleanly but the
 *     wakeup never arrives. Gaff:
 *     the notification DOES arrive,
 *     and it is a lie.
 * NOT Sear — set -e structurally
 *     inert in eval/non-final &&.
 *     Gaff is not about errexit.
 * NOT Leat — sleep-block unbounded
 *     until-loop.
 * NOT Quench — a spend-kill fuse.
 *     Gaff is a diagnostic desk for
 *     a false-success receipt, not a
 *     kill switch.
 * NOT Knock / Reveille — permission
 *     grants / heartbeats.
 * Different problem: HARNESS KILLS A
 * BACKGROUNDED BASH COMMAND, THEN
 * REPORTS COMPLETED EXIT 0.
 * Different UI: vaudeville /
 * music-hall stage — red velvet
 * house curtain, gold proscenium,
 * footlights, brass shepherd's crook
 * from stage left. Playbill vs the
 * actual acts.
 * Different idle: yanked.
 */

export const VERDICTS = Object.freeze([
  "yanked",
  "billed",
  "truncated",
  "midloop",
  "sigkilled",
  "group-reaped",
  "turn-killed",
  "empty-ok",
  "hours-lost",
]);
export const IDLE_WORD = "yanked";
export const SLACK_VERDICTS = Object.freeze([
  "billed",
  "truncated",
  "empty-ok",
  "hours-lost",
  "sigkilled",
]);
export const LINEAR_VERDICTS = Object.freeze(["billed", "hours-lost"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90616;
export const SIGKILL_ISSUE = 87055;
export const TURN_KILL_ISSUE = 88754;
export const SILENT_KILL_ISSUE = 84625;
export const RC_KILL_ISSUE = 90490;
export const CODEX_FALSE_OK_ISSUE = 19309;

export const DEMO_NOTIFICATION_90616 = [
  "Notification received by the model:",
  "",
  ' bqe403itt completed Background command "Run pipeline across 8 unscanned metros, 5 categories, 60 places each" completed (exit code 0)',
  'Tail of the captured output file (note: no final "TOTAL" line the script prints on normal completion, and only 4 of 40 iterations present):',
  "",
  "accountant 32801: found=60 qualified=48 [output ends here mid-run]",
].join("\n");

export const DEMO_NOTIFICATION_XML = [
  "<task-notification>",
  "  <task_id>bqe403itt</task_id>",
  "  <status>completed</status>",
  "  <exit_code>0</exit_code>",
  '  <summary>Background command "Run pipeline across 8 unscanned metros, 5 categories, 60 places each" completed (exit code 0)</summary>',
  "  <timeout_ms>600000</timeout_ms>",
  "</task-notification>",
].join("\n");

export const DEMO_REPRO =
  'for i in $(seq 1 10); do echo "iter $i"; sleep 90; done; echo "DONE"';
export const DEMO_OUTPUT_TAIL =
  "accountant 32801: found=60 qualified=48 [output ends here mid-run]";
export const DEMO_REPRO_TAIL = "iter 1";

const FORBIDDEN_IDLE = Object.freeze([
  "gaff",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
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
  "stowed",
  "caught",
  "sear",
  "cubby",
  "grille",
  "spile",
  "sounder",
  "leat",
  "quench",
  "knock",
  "reveille",
  "bollard",
  "clew",
  "crook",
  "hook",
  "cane",
  "usher",
  "curtain",
  "wings",
  "bill",
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

function asNumber(value, fallback = null) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function emptyGaff() {
  return {
    session: "",
    issue: null,
    source: "",
    notification: "",
    outputTail: "",
    wrapperTrace: "",
    reportedStatus: "",
    exitCode: null,
    timeoutMs: null,
    timeoutKilled: false,
    harnessKill: false,
    outputTruncated: false,
    midloopPrefix: false,
    seenIterations: null,
    expectedIterations: null,
    trapsNeverFired: false,
    afterMarkerMissing: false,
    processGroupReaped: false,
    turnBoundary: false,
    statusMismatch: false,
    emptyOutput: false,
    remainingUnits: null,
    userToldSuccess: false,
    donePresent: false,
    scored: false,
  };
}

export function emptyAction(session = "yanked-1") {
  return {
    action: "score",
    session,
    gaff: emptyGaff(),
  };
}

export function cloneGaff(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyGaff();
  const nested =
    (src.gaff && typeof src.gaff === "object" && src.gaff) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.playbill && typeof src.playbill === "object" && src.playbill) ||
    src;
  return {
    ...emptyGaff(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    notification: asText(nested.notification ?? src.notification),
    outputTail: asText(nested.outputTail ?? src.outputTail ?? src.output),
    wrapperTrace: asText(nested.wrapperTrace ?? src.wrapperTrace ?? src.trace),
    reportedStatus: asText(nested.reportedStatus ?? src.reportedStatus).toLowerCase(),
    exitCode: asNumber(nested.exitCode ?? src.exitCode, null),
    timeoutMs: asNumber(nested.timeoutMs ?? src.timeoutMs, null),
    timeoutKilled: asBool(nested.timeoutKilled ?? src.timeoutKilled, false) === true,
    harnessKill: asBool(nested.harnessKill ?? src.harnessKill, false) === true,
    outputTruncated:
      asBool(nested.outputTruncated ?? src.outputTruncated, false) === true,
    midloopPrefix: asBool(nested.midloopPrefix ?? src.midloopPrefix, false) === true,
    seenIterations: asNumber(nested.seenIterations ?? src.seenIterations, null),
    expectedIterations: asNumber(
      nested.expectedIterations ?? src.expectedIterations,
      null,
    ),
    trapsNeverFired:
      asBool(nested.trapsNeverFired ?? src.trapsNeverFired, false) === true,
    afterMarkerMissing:
      asBool(nested.afterMarkerMissing ?? src.afterMarkerMissing, false) === true,
    processGroupReaped:
      asBool(nested.processGroupReaped ?? src.processGroupReaped, false) === true,
    turnBoundary: asBool(nested.turnBoundary ?? src.turnBoundary, false) === true,
    statusMismatch: asBool(nested.statusMismatch ?? src.statusMismatch, false) === true,
    emptyOutput: asBool(nested.emptyOutput ?? src.emptyOutput, false) === true,
    remainingUnits: asNumber(nested.remainingUnits ?? src.remainingUnits, null),
    userToldSuccess:
      asBool(nested.userToldSuccess ?? src.userToldSuccess, false) === true,
    donePresent: asBool(nested.donePresent ?? src.donePresent, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

function completedZero(next) {
  const status = String(next.reportedStatus || "").toLowerCase();
  return status === "completed" && next.exitCode === 0;
}

function honestKill(next) {
  const status = String(next.reportedStatus || "").toLowerCase();
  const killStatus = status === "timed_out" || status === "killed";
  return killStatus && next.exitCode != null && next.exitCode !== 0;
}

function honestComplete(next) {
  return (
    completedZero(next) &&
    next.donePresent === true &&
    next.timeoutKilled !== true &&
    next.harnessKill !== true &&
    next.trapsNeverFired !== true &&
    next.turnBoundary !== true &&
    next.processGroupReaped !== true &&
    next.outputTruncated !== true &&
    next.midloopPrefix !== true &&
    next.emptyOutput !== true &&
    next.statusMismatch !== true
  );
}

export function analyze(gaff = {}) {
  const next = cloneGaff(gaff);
  const billedShape = next.timeoutKilled === true && completedZero(next);
  const hoursLostShape =
    billedShape !== true &&
    next.userToldSuccess === true &&
    next.remainingUnits != null &&
    next.remainingUnits > 0;
  const sigkilledShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    next.trapsNeverFired === true;
  const emptyOkShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    sigkilledShape !== true &&
    next.emptyOutput === true &&
    completedZero(next) &&
    next.trapsNeverFired !== true;
  const groupReapedShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    sigkilledShape !== true &&
    emptyOkShape !== true &&
    (next.processGroupReaped === true || next.afterMarkerMissing === true);
  const turnKilledShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    sigkilledShape !== true &&
    emptyOkShape !== true &&
    groupReapedShape !== true &&
    next.turnBoundary === true &&
    next.statusMismatch === true;
  const yankedHold = honestKill(next) || honestComplete(next);
  const midloopShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    sigkilledShape !== true &&
    emptyOkShape !== true &&
    groupReapedShape !== true &&
    turnKilledShape !== true &&
    yankedHold !== true &&
    next.midloopPrefix === true;
  const truncatedShape =
    billedShape !== true &&
    hoursLostShape !== true &&
    sigkilledShape !== true &&
    emptyOkShape !== true &&
    groupReapedShape !== true &&
    turnKilledShape !== true &&
    yankedHold !== true &&
    midloopShape !== true &&
    next.outputTruncated === true;
  return {
    reportedStatus: next.reportedStatus,
    exitCode: next.exitCode,
    timeoutMs: next.timeoutMs,
    timeoutKilled: next.timeoutKilled,
    harnessKill: next.harnessKill,
    outputTruncated: next.outputTruncated,
    midloopPrefix: next.midloopPrefix,
    seenIterations: next.seenIterations,
    expectedIterations: next.expectedIterations,
    trapsNeverFired: next.trapsNeverFired,
    afterMarkerMissing: next.afterMarkerMissing,
    processGroupReaped: next.processGroupReaped,
    turnBoundary: next.turnBoundary,
    statusMismatch: next.statusMismatch,
    emptyOutput: next.emptyOutput,
    remainingUnits: next.remainingUnits,
    userToldSuccess: next.userToldSuccess,
    donePresent: next.donePresent,
    billedShape,
    hoursLostShape,
    emptyOkShape,
    sigkilledShape,
    groupReapedShape,
    turnKilledShape,
    midloopShape,
    truncatedShape,
    yankedHold,
    honestKill: honestKill(next),
    honestComplete: honestComplete(next),
    completedZero: completedZero(next),
  };
}

export function isIdle(gaff = {}) {
  const next = cloneGaff(gaff);
  return (
    next.timeoutKilled !== true &&
    next.harnessKill !== true &&
    next.outputTruncated !== true &&
    next.midloopPrefix !== true &&
    next.trapsNeverFired !== true &&
    next.afterMarkerMissing !== true &&
    next.processGroupReaped !== true &&
    next.turnBoundary !== true &&
    next.statusMismatch !== true &&
    next.emptyOutput !== true &&
    next.userToldSuccess !== true &&
    next.donePresent !== true &&
    !next.reportedStatus &&
    next.exitCode == null
  );
}

/**
 * First match wins by documented priority:
 * billed > hours-lost > sigkilled >
 * empty-ok > group-reaped >
 * turn-killed > yanked-hold >
 * midloop > truncated > yanked.
 * Idle yanked is first. Seeded #90616
 * numbers must produce billed, never
 * yanked. Prefer billed when a
 * timeout/harness-kill is reported
 * as completed exit 0. A billed
 * full house is not a hold.
 */
export function classify(gaff = {}) {
  const next = cloneGaff(gaff);
  if (isIdle(next)) return "yanked";
  const facts = analyze(next);

  if (facts.billedShape) return "billed";
  if (facts.hoursLostShape) return "hours-lost";
  if (facts.sigkilledShape) return "sigkilled";
  if (facts.emptyOkShape) return "empty-ok";
  if (facts.groupReapedShape) return "group-reaped";
  if (facts.turnKilledShape) return "turn-killed";
  if (facts.yankedHold) return "yanked";
  if (facts.midloopShape) return "midloop";
  if (facts.truncatedShape) return "truncated";
  return "yanked";
}

export function feedOf(gaff = {}, verdict = "") {
  const kind = verdict || classify(gaff);
  if (kind === "billed") {
    return "● Billed · completed (exit code 0) after a timeout/harness-kill · playbill stamped FULL SHOW · primary #90616";
  }
  if (kind === "hours-lost") {
    return "● Hours-lost · model told the user success · remaining units never ran · 36 of 40 unpaid · #90616 production";
  }
  if (kind === "empty-ok") {
    return "● Empty-ok · 0-byte output + completed exit 0 · the house is dark and the playbill still says COMPLETE";
  }
  if (kind === "sigkilled") {
    return "● Sigkilled · uncatchable SIGKILL · traps never fire · process group reaped · still completed exit 0 · #87055";
  }
  if (kind === "group-reaped") {
    return "● Group-reaped · whole process group reaped · after-marker missing · the crook took the company";
  }
  if (kind === "turn-killed") {
    return "● Turn-killed · killed at turn boundary · reported status does not match the process · #88754";
  }
  if (kind === "midloop") {
    return "● Midloop · only a prefix of N iterations then completed · no DONE · the act stopped on the fourth verse";
  }
  if (kind === "truncated") {
    return "● Truncated · output stops mid-stream · no DONE/TOTAL · captured file simply ends";
  }
  return "● Yanked · crook was seen · kill reported as a kill, or the house finished and DONE is present · playbill is not stamped COMPLETE · idle word is yanked";
}

export function reasonsOf(gaff = {}, verdict = "") {
  const next = cloneGaff(gaff);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.completedZero || facts.timeoutKilled || facts.honestKill
      ? `status ${facts.reportedStatus || "unset"} · exit ${facts.exitCode == null ? "unset" : facts.exitCode} · timeout-kill ${facts.timeoutKilled ? "yes" : "no"} · DONE ${facts.donePresent ? "yes" : "no"}`
      : "crook was seen · kill reported as a kill · playbill is not stamped COMPLETE · idle word is yanked",
  );
  if (facts.billedShape) {
    reasons.push(
      "timeout/harness-kill fired, then the receipt said completed (exit code 0) · the #90616 lie · a billed full house is not a hold",
    );
  }
  if (facts.timeoutKilled || facts.timeoutMs) {
    reasons.push(
      `timeout ${facts.timeoutMs != null ? `${facts.timeoutMs}ms` : "declared"} · harness kill of a still-running background command`,
    );
  }
  if (facts.outputTruncated) {
    reasons.push("captured output stops mid-stream · no DONE/TOTAL line · truncation marker absent");
  }
  if (facts.midloopPrefix) {
    reasons.push(
      `only ${facts.seenIterations != null ? facts.seenIterations : "a prefix"} of ${facts.expectedIterations != null ? facts.expectedIterations : "N"} iterations then completed`,
    );
  }
  if (facts.trapsNeverFired) {
    reasons.push("uncatchable SIGKILL · trap handlers for TERM/HUP/INT/PIPE never fire · #87055");
  }
  if (facts.processGroupReaped || facts.afterMarkerMissing) {
    reasons.push("whole process group reaped · after-marker (echo after / [exited with code N]) missing");
  }
  if (facts.turnBoundary || facts.statusMismatch) {
    reasons.push(
      "killed at turn boundary · reported status does not match the process · #88754 Windows/MSYS2",
    );
  }
  if (facts.emptyOutput) {
    reasons.push("0-byte captured output + completed exit 0 · the model reads an empty successful file");
  }
  if (facts.userToldSuccess || (facts.remainingUnits != null && facts.remainingUnits > 0)) {
    reasons.push(
      `model told the user success · ${facts.remainingUnits != null ? facts.remainingUnits : "remaining"} units of paid work never ran`,
    );
  }
  if (facts.honestKill) {
    reasons.push(
      "honest kill: timed_out/killed with nonzero exit (128+signal) · the crook was billed as a crook",
    );
  }
  if (facts.honestComplete) {
    reasons.push("honest complete: no kill and DONE/TOTAL present · the house finished · nothing to yank");
  }
  reasons.push("a billed full house is not a hold");
  reasons.push(
    "NOT Spile (timeout NOT enforced) / Sounder (wakeup never arrives) / Sear (inert set -e) / Leat (sleep-block until-loop) / Quench (spend-kill fuse) / Knock / Reveille (grants / heartbeats) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "yanked") {
    reasons.push(
      "crook was seen; kill reported as a kill, or DONE is present with no kill; playbill is not stamped COMPLETE; idle word is yanked",
    );
  }
  if (kind === "billed") {
    reasons.push(
      "PRIMARY #90616: backgrounded Bash killed by its timeout reports completed (exit code 0). The billed case is billed, never yanked.",
    );
  }
  if (kind === "hours-lost") {
    reasons.push("model told the user success. Remaining units never ran.");
  }
  if (kind === "empty-ok") {
    reasons.push("0-byte output + completed exit 0.");
  }
  if (kind === "sigkilled") {
    reasons.push("uncatchable SIGKILL. Traps never fire. #87055.");
  }
  if (kind === "group-reaped") {
    reasons.push("whole process group reaped. After-marker missing.");
  }
  if (kind === "turn-killed") {
    reasons.push("killed at turn boundary. Status mismatches process. #88754.");
  }
  if (kind === "midloop") {
    reasons.push("only a prefix of N iterations then completed.");
  }
  if (kind === "truncated") {
    reasons.push("output stops mid-stream. No DONE/TOTAL.");
  }
  return reasons;
}

export function verdictOf(gaff = {}) {
  return classify(gaff);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function yankedOf(gaff = {}, verdict = "") {
  const kind = verdict || classify(gaff);
  if (kind !== "yanked") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  const facts = analyze(gaff);
  if (isIdle(gaff)) return true;
  return facts.yankedHold === true;
}

export function billedOf(gaff = {}, verdict = "") {
  return (verdict || classify(gaff)) === "billed";
}

export function summaryOf(gaff = {}) {
  const next = cloneGaff(gaff);
  const facts = analyze(next);
  return {
    reportedStatus: facts.reportedStatus,
    exitCode: facts.exitCode,
    timeoutMs: facts.timeoutMs,
    timeoutKilled: facts.timeoutKilled,
    harnessKill: facts.harnessKill,
    outputTruncated: facts.outputTruncated,
    midloopPrefix: facts.midloopPrefix,
    trapsNeverFired: facts.trapsNeverFired,
    afterMarkerMissing: facts.afterMarkerMissing,
    processGroupReaped: facts.processGroupReaped,
    turnBoundary: facts.turnBoundary,
    statusMismatch: facts.statusMismatch,
    emptyOutput: facts.emptyOutput,
    remainingUnits: facts.remainingUnits,
    userToldSuccess: facts.userToldSuccess,
    donePresent: facts.donePresent,
    honestKill: facts.honestKill,
    honestComplete: facts.honestComplete,
  };
}

export function score(gaff = {}) {
  const next = cloneGaff(gaff);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    yanked: yankedOf(next, verdict),
    billed: billedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    reportedStatus: facts.reportedStatus,
    exitCode: facts.exitCode,
    timeoutMs: facts.timeoutMs,
    timeoutKilled: facts.timeoutKilled,
    harnessKill: facts.harnessKill,
    outputTruncated: facts.outputTruncated,
    midloopPrefix: facts.midloopPrefix,
    seenIterations: facts.seenIterations,
    expectedIterations: facts.expectedIterations,
    trapsNeverFired: facts.trapsNeverFired,
    afterMarkerMissing: facts.afterMarkerMissing,
    processGroupReaped: facts.processGroupReaped,
    turnBoundary: facts.turnBoundary,
    statusMismatch: facts.statusMismatch,
    emptyOutput: facts.emptyOutput,
    remainingUnits: facts.remainingUnits,
    userToldSuccess: facts.userToldSuccess,
    donePresent: facts.donePresent,
    honestKill: facts.honestKill,
    honestComplete: facts.honestComplete,
    summary: summaryOf(next),
    gaff: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const gaffSrc =
    src.gaff ||
    src.probe ||
    src.payload ||
    src.playbill ||
    payload.gaff ||
    payload.probe ||
    payload.playbill;
  const gaff = cloneGaff(
    gaffSrc && typeof gaffSrc === "object" ? { ...gaffSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !gaff.session) gaff.session = src.session;
  if (typeof payload.session === "string" && !gaff.session) gaff.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? gaff.session ?? ""),
    gaff,
    issue: src.issue ?? payload.issue ?? gaff.issue ?? null,
    source: src.source ?? payload.source ?? gaff.source ?? "",
  };
}

function gaffResult(verdict, gaff, action, extras = {}) {
  const next = cloneGaff(gaff);
  const scored = score(next);
  return {
    ok: true,
    product: "gaff",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    yanked: scored.yanked,
    billed: scored.billed,
    gaffYanked: verdict === "yanked",
    gaffBilled: verdict === "billed",
    gaffTruncated: verdict === "truncated",
    gaffMidloop: verdict === "midloop",
    gaffSigkilled: verdict === "sigkilled",
    gaffGroupReaped: verdict === "group-reaped",
    gaffTurnKilled: verdict === "turn-killed",
    gaffEmptyOk: verdict === "empty-ok",
    gaffHoursLost: verdict === "hours-lost",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    reportedStatus: scored.reportedStatus,
    exitCode: scored.exitCode,
    timeoutMs: scored.timeoutMs,
    timeoutKilled: scored.timeoutKilled,
    harnessKill: scored.harnessKill,
    outputTruncated: scored.outputTruncated,
    midloopPrefix: scored.midloopPrefix,
    seenIterations: scored.seenIterations,
    expectedIterations: scored.expectedIterations,
    trapsNeverFired: scored.trapsNeverFired,
    afterMarkerMissing: scored.afterMarkerMissing,
    processGroupReaped: scored.processGroupReaped,
    turnBoundary: scored.turnBoundary,
    statusMismatch: scored.statusMismatch,
    emptyOutput: scored.emptyOutput,
    remainingUnits: scored.remainingUnits,
    userToldSuccess: scored.userToldSuccess,
    donePresent: scored.donePresent,
    honestKill: scored.honestKill,
    honestComplete: scored.honestComplete,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    gaff: next,
    ...extras,
  };
}

function seedGaff(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    gaff: {
      ...emptyGaff(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      notification: extras.notification || "",
      outputTail: extras.outputTail || "",
      wrapperTrace: extras.wrapperTrace || "",
      reportedStatus: extras.reportedStatus || "",
      exitCode: extras.exitCode != null ? extras.exitCode : null,
      timeoutMs: extras.timeoutMs != null ? extras.timeoutMs : null,
      timeoutKilled: Boolean(extras.timeoutKilled),
      harnessKill: Boolean(extras.harnessKill),
      outputTruncated: Boolean(extras.outputTruncated),
      midloopPrefix: Boolean(extras.midloopPrefix),
      seenIterations: extras.seenIterations != null ? extras.seenIterations : null,
      expectedIterations:
        extras.expectedIterations != null ? extras.expectedIterations : null,
      trapsNeverFired: Boolean(extras.trapsNeverFired),
      afterMarkerMissing: Boolean(extras.afterMarkerMissing),
      processGroupReaped: Boolean(extras.processGroupReaped),
      turnBoundary: Boolean(extras.turnBoundary),
      statusMismatch: Boolean(extras.statusMismatch),
      emptyOutput: Boolean(extras.emptyOutput),
      remainingUnits: extras.remainingUnits != null ? extras.remainingUnits : null,
      userToldSuccess: Boolean(extras.userToldSuccess),
      donePresent: Boolean(extras.donePresent),
    },
  };
}

/** Idle reset. Crook seen. Playbill not COMPLETE. */
export function seedYanked() {
  return seedGaff("yanked", "music-hall", {
    session: "yanked",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedYanked();
}

/**
 * Control / proof: harness kill
 * reported as timed_out with
 * nonzero exit (128+SIGKILL).
 * Classifies as yanked; yanked true.
 */
export function seedControl() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-control",
    issue: null,
    reportedStatus: "timed_out",
    exitCode: 137,
    timeoutMs: 120000,
    timeoutKilled: true,
    harnessKill: true,
    outputTruncated: true,
    donePresent: false,
    notification:
      "<status>timed_out</status> Background command killed after 120 seconds (exit code 137)",
    outputTail: "iter 1\n[output truncated — harness timed_out]",
  });
}

/**
 * Honest complete: no kill, DONE
 * present, completed exit 0 is
 * actually true. Also yanked.
 */
export function seedHonestComplete() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-done",
    issue: null,
    reportedStatus: "completed",
    exitCode: 0,
    donePresent: true,
    outputTail: "iter 1\niter 2\nDONE\nTOTAL 10",
  });
}

/**
 * #90616 billed: timeout kill of a
 * still-running background command
 * reported completed exit 0. Output
 * mid-stream, 4 of 40, no TOTAL.
 * Never yanked.
 */
export function seedBilled() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-billed",
    reportedStatus: "completed",
    exitCode: 0,
    timeoutMs: 600000,
    timeoutKilled: true,
    harnessKill: true,
    outputTruncated: true,
    midloopPrefix: true,
    seenIterations: 4,
    expectedIterations: 40,
    remainingUnits: 36,
    userToldSuccess: true,
    donePresent: false,
    notification: DEMO_NOTIFICATION_90616,
    outputTail: DEMO_OUTPUT_TAIL,
  });
}

export function seed90616() {
  return seedBilled();
}

/** 0-byte output + completed exit 0. */
export function seedEmptyOk() {
  return seedGaff(SIGKILL_ISSUE, "anthropics/claude-code#87055", {
    session: "87055-empty-ok",
    issue: SIGKILL_ISSUE,
    reportedStatus: "completed",
    exitCode: 0,
    emptyOutput: true,
    outputTail: "",
  });
}

/**
 * #87055 sigkilled: uncatchable
 * SIGKILL; traps never fire; still
 * completed exit 0. Unique flags:
 * traps never fire without the
 * billed timeout pentad.
 */
export function seedSigkilled() {
  return seedGaff(SIGKILL_ISSUE, "anthropics/claude-code#87055", {
    session: "87055-sigkilled",
    issue: SIGKILL_ISSUE,
    reportedStatus: "completed",
    exitCode: 0,
    trapsNeverFired: true,
    processGroupReaped: true,
    afterMarkerMissing: true,
    wrapperTrace: "SIGKILL of process group; trap TERM/HUP/INT/PIPE never fired",
  });
}

/** Whole process group reaped; after-marker missing. */
export function seedGroupReaped() {
  return seedGaff(SIGKILL_ISSUE, "anthropics/claude-code#87055", {
    session: "87055-group-reaped",
    issue: SIGKILL_ISSUE,
    processGroupReaped: true,
    afterMarkerMissing: true,
    wrapperTrace: "echo after never printed; [exited with code N] trailer missing",
  });
}

/**
 * #88754 turn-killed: killed at
 * turn boundary; status mismatches
 * the process.
 */
export function seedTurnKilled() {
  return seedGaff(TURN_KILL_ISSUE, "anthropics/claude-code#88754", {
    session: "88754-turn-killed",
    issue: TURN_KILL_ISSUE,
    reportedStatus: "completed",
    exitCode: 0,
    turnBoundary: true,
    statusMismatch: true,
    wrapperTrace: "MSYS2 MINGW64 run_in_background killed at turn boundary",
  });
}

/** Only a prefix of N iterations then completed. */
export function seedMidloop() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-midloop",
    midloopPrefix: true,
    seenIterations: 1,
    expectedIterations: 10,
    outputTail: "iter 1",
    notification: DEMO_REPRO,
  });
}

/** Output stops mid-stream, no DONE/TOTAL. */
export function seedTruncated() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-truncated",
    outputTruncated: true,
    donePresent: false,
    outputTail: DEMO_OUTPUT_TAIL,
  });
}

/**
 * Remaining units never ran; model
 * told the user success. Unique
 * flags: remaining + told-success
 * without the billed timeout pentad.
 */
export function seedHoursLost() {
  return seedGaff(FEATURED_ISSUE, "anthropics/claude-code#90616", {
    session: "90616-hours-lost",
    reportedStatus: "completed",
    exitCode: 0,
    remainingUnits: 36,
    userToldSuccess: true,
    expectedIterations: 40,
    seenIterations: 4,
  });
}

function xmlTag(text, name) {
  const match = text.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1].trim() : "";
}

function parseExit(text) {
  const tagged = xmlTag(text, "exit_code") || xmlTag(text, "exit-code");
  if (tagged !== "") {
    const n = Number(tagged);
    if (Number.isFinite(n)) return n;
  }
  const phrase = text.match(/exit code\s+(-?\d+)/i) || text.match(/exit(?:ed)?\s+(-?\d+)/i);
  if (phrase) return Number(phrase[1]);
  return null;
}

function parseStatus(text) {
  const tagged = xmlTag(text, "status").toLowerCase();
  if (tagged) return tagged;
  if (/\btimed[_ ]?out\b/i.test(text)) return "timed_out";
  if (/\bstatus:\s*killed\b/i.test(text) || /\bkilled\b/i.test(text) && /turn boundary/i.test(text)) {
    return /completed \(exit code 0\)/i.test(text) ? "completed" : "killed";
  }
  if (/completed \(exit code 0\)/i.test(text) || /status:\s*completed/i.test(text)) {
    return "completed";
  }
  return "";
}

function parseIterations(text) {
  const ofMatch = text.match(/(\d+)\s+of\s+(\d+)/i);
  if (ofMatch) {
    return { seen: Number(ofMatch[1]), expected: Number(ofMatch[2]) };
  }
  const iters = [...text.matchAll(/iter(?:ation)?\s+(\d+)/gi)].map((row) => Number(row[1]));
  if (iters.length) {
    const expected = /seq\s+1\s+(\d+)/i.test(text)
      ? Number(text.match(/seq\s+1\s+(\d+)/i)[1])
      : null;
    return { seen: Math.max(...iters), expected };
  }
  return { seen: null, expected: null };
}

/**
 * Parse a task-notification (XML or
 * the #90616 prose receipt) plus an
 * optional captured-output tail and
 * wrapper/trace. JSON objects are
 * preferred when the paste starts
 * with { — never let prose win over
 * a structured probe.
 */
export function parseTaskNotification(notification = "", outputTail = "", wrapperTrace = "") {
  const note = asText(notification);
  const tail = asText(outputTail);
  const trace = asText(wrapperTrace);
  const blob = [note, tail, trace].filter(Boolean).join("\n");
  if (!blob.trim()) return emptyGaff();

  if (note.trim().startsWith("{") || note.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(note);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return cloneGaff({
          ...parsed,
          outputTail: parsed.outputTail || tail,
          wrapperTrace: parsed.wrapperTrace || trace,
          scored: true,
        });
      }
    } catch {
      /* fall through */
    }
  }

  const status = parseStatus(blob);
  const exitCode = parseExit(blob);
  const timeoutMatch = blob.match(/timeout(?:_ms)?[:\s]+(\d+)/i);
  const timeoutMs = timeoutMatch ? Number(timeoutMatch[1]) : null;
  const iters = parseIterations(blob);
  const donePresent = /\bDONE\b|\bTOTAL\b/.test(tail || blob) && !/no final "TOTAL"|no DONE/i.test(blob);
  const outputTruncated =
    /output ends here|mid-run|mid-stream|truncated|no final "TOTAL"|no DONE/i.test(blob) ||
    (Boolean(tail) && !donePresent && /iter |qualified=/i.test(tail));
  const midloopPrefix =
    (iters.seen != null && iters.expected != null && iters.seen < iters.expected) ||
    /only ~?1 iteration|4 of 40/i.test(blob);
  const trapsNeverFired = /traps? never fire|uncatchable|SIGKILL/i.test(blob);
  const afterMarkerMissing = /after-marker missing|echo after.*lost|\[exited with code/i.test(blob)
    ? /missing|lost|never/i.test(blob)
    : /after-marker missing|echo after is lost/i.test(blob);
  const processGroupReaped = /process group|group reaped|SIGKILL.*group/i.test(blob);
  const turnBoundary = /turn boundary|turn-killed|#88754/i.test(blob);
  const statusMismatch = /status does not match|status mismatches|does not track the process/i.test(blob);
  const emptyOutput =
    /0-byte|0 bytes|empty output|output file: it is empty/i.test(blob) || tail === "";
  const remainingMatch = blob.match(/(\d+)\s+units/i);
  const remainingUnits =
    remainingMatch != null
      ? Number(remainingMatch[1])
      : iters.seen != null && iters.expected != null
        ? Math.max(0, iters.expected - iters.seen)
        : null;
  const userToldSuccess = /told (?:my )?user|reports? success|batch succeeded/i.test(blob);
  const timeoutKilled =
    /killed by its timeout|timeout expires|timeout 1?20000|timeout 600000|#90616|bqe403itt/i.test(
      blob,
    ) ||
    (timeoutMs != null && status === "completed" && exitCode === 0 && (outputTruncated || midloopPrefix));
  const harnessKill =
    timeoutKilled ||
    trapsNeverFired ||
    processGroupReaped ||
    turnBoundary ||
    /harness kills?|SIGKILL|timed_out/i.test(blob);

  if (/#90616|bqe403itt/i.test(blob) && status === "completed" && (exitCode === 0 || exitCode == null)) {
    return {
      ...seedBilled().gaff,
      session: "paste-billed",
      notification: note,
      outputTail: tail || DEMO_OUTPUT_TAIL,
      reportedStatus: "completed",
      exitCode: 0,
      scored: true,
    };
  }
  if (/#87055|traps? never fire|cursor-agent|daemonizing/i.test(blob) && !/#90616|bqe403itt/i.test(blob)) {
    return {
      ...seedSigkilled().gaff,
      session: "paste-sigkilled",
      notification: note,
      wrapperTrace: trace || blob,
      scored: true,
    };
  }
  if (/#88754|turn boundary/i.test(blob) && !/#90616|bqe403itt|#87055/i.test(blob)) {
    return {
      ...seedTurnKilled().gaff,
      session: "paste-turn-killed",
      notification: note,
      wrapperTrace: trace || blob,
      scored: true,
    };
  }

  return cloneGaff({
    session: "paste",
    source: "paste",
    notification: note,
    outputTail: tail,
    wrapperTrace: trace,
    reportedStatus: status,
    exitCode,
    timeoutMs,
    timeoutKilled,
    harnessKill,
    outputTruncated: outputTruncated && !donePresent,
    midloopPrefix,
    seenIterations: iters.seen,
    expectedIterations: iters.expected,
    trapsNeverFired,
    afterMarkerMissing,
    processGroupReaped,
    turnBoundary,
    statusMismatch: statusMismatch || (turnBoundary && status === "completed"),
    emptyOutput: emptyOutput && !tail,
    remainingUnits,
    userToldSuccess,
    donePresent,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyGaff();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneGaff({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneGaff({
          ...parsed,
          notification: parsed.notification || text,
          scored: true,
        });
      }
    } catch {
      /* fall through to prose */
    }
  }
  return parseTaskNotification(text, "", "");
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  yanked: seedYanked,
  control: seedControl,
  billed: seedBilled,
  90616: seed90616,
  "90616-billed": seedBilled,
  truncated: seedTruncated,
  midloop: seedMidloop,
  sigkilled: seedSigkilled,
  87055: seedSigkilled,
  "group-reaped": seedGroupReaped,
  groupreaped: seedGroupReaped,
  "turn-killed": seedTurnKilled,
  turnkilled: seedTurnKilled,
  88754: seedTurnKilled,
  "empty-ok": seedEmptyOk,
  emptyok: seedEmptyOk,
  "hours-lost": seedHoursLost,
  hourslost: seedHoursLost,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  house: seedControl,
  stage: seedControl,
  done: seedHonestComplete,
  "honest-complete": seedHonestComplete,
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
  let gaff = cloneGaff(action.gaff);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "yanked" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return gaffResult("yanked", emptyGaff(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "house" || verb === "stage") {
    gaff = seedControl().gaff;
    return gaffResult(classify(gaff), gaff, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "billed" || verb === "incident" || verb === "90616") {
    gaff = seedBilled().gaff;
    return gaffResult(classify(gaff), gaff, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-stage") {
    gaff = { ...gaff, scored: true };
    return gaffResult(classify(gaff), gaff, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    gaff = { ...gaff, scored: true };
    return gaffResult(classify(gaff), gaff, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  gaff = { ...gaff, scored: true };
  return gaffResult(classify(gaff), gaff, action);
}
