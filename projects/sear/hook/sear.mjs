/**
 * Sear — gunsmith's sear desk for a
 * real Claude Code failure: the Bash
 * tool makes `set -e` structurally
 * inert. User commands run inside
 * eval '...' that is a non-final
 * member of a && list in the tool
 * wrapper, so POSIX/bash suppress
 * errexit for the whole script (and
 * subshells). A defensive
 * `set -e; false; echo survived`
 * prints `survived` and the tool
 * call can still exit 0 if the last
 * line succeeds — the failure is
 * invisible to the model.
 *
 * Real incident in the primary
 * issue: copy-then-cleanup (`set -e`,
 * several `cp`, then `rm -rf`
 * sources) had `cp` fail; `set -e`
 * did not stop; `rm -rf` deleted the
 * sources; tool still exited 0.
 *
 * Wrapper shape from the issue
 * (`ps -o args`):
 *   bash -c "source <snapshot>.sh
 *   2>/dev/null || true &&
 *   shopt -u extglob ... &&
 *   eval '<user command>' < /dev/null
 *   && pwd -P >| /tmp/claude-<n>-cwd"
 *
 * Workarounds that work but are
 * undiscoverable: `bash -ec '...'`
 * (fresh bash, own errexit context)
 * or `&&`-chaining lines.
 *
 * A fallen sear is not a hold. Score
 * the bench or admit caught.
 *
 * Primary #90611: open, filed
 * 2026-08-29, labels bug / has repro /
 * area:bash. Title: Bash tool: `set -e`
 * is structurally inert -- command
 * runs as `eval` in a non-final `&&`
 * list member, so errexit is
 * suppressed for the whole script.
 *
 * Same-class / nearby bash area
 * (corroboration of shell-wrapper
 * harm, not the same bug):
 *   #90118 — Messages sent during a
 *            Bash tool call are
 *            silently destroyed when
 *            the call returns
 *            is_error: true (adjacent:
 *            Bash result channel
 *            lies/drops).
 *   #62297 — Intentional kill of
 *            backgrounded Bash
 *            reported as failed exit
 *            144 (opposite pole:
 *            status misreported).
 *
 * Cross-ecosystem (shell status /
 * wrapper lies):
 *   openai/codex#34866 — "Script
 *            completed" reported
 *            while nested shell
 *            session still running.
 *   openai/codex#41534 — nested-quote
 *            corruption in pwsh
 *            -Command exec_command.
 *
 * Verdicts: caught | inert |
 *           survived | nonfinal |
 *           phantom-ok | continued |
 *           wiped | chained |
 *           freshbash | suppressed
 * Idle word is caught (sear engaged
 * — errexit would abort; wrapper
 * does not suppress).
 * NEVER use sear / empty / silent /
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
 * rung, moored, stowed.
 * Do NOT ship Trap, Fuse, Fusee,
 * Pawl, Detent, Trip, Catch,
 * Escapement, Trigger, Hammer,
 * Striker, Hairpin, Bail, Dog,
 * Chock, Latch, Keeper, Deadman,
 * Failsafe, Errexit, Stopcock,
 * Governor, Ratchet, Tripwire,
 * Snubber, Sear-block as the product
 * name. Product name is Sear only.
 *
 * Slack alarm on inert / survived /
 * nonfinal / phantom-ok / continued /
 * wiped / suppressed.
 * Linear ticket on wiped /
 * phantom-ok / inert.
 * GitHub sear-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   inert > wiped > survived >
 *   phantom-ok > continued >
 *   nonfinal > suppressed >
 *   chained > freshbash > caught
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90611 inert pentad
 * (set -e present, eval in non-final
 * &&, false then echo survived, tool
 * exit 0 despite mid-fail, continued
 * past fail, wipe after failed cp,
 * subshell also survived).
 *
 * caught is true ONLY when set -e
 * would actually abort (fresh bash
 * -ec / final-member context) AND
 * the verdict is caught (not a
 * failure class).
 *
 * Why this is not a clone:
 * NOT Spile — hook stdin wedge /
 *     unenforced timeout (EOF pipe,
 *     timeout not enforced). Sear is
 *     wrapper &&/eval making errexit
 *     inert.
 * NOT Grille — bypass-permissions
 *     Bash-steered sed/heredoc edits
 *     bypassing Edit/Write hooks.
 *     Sear is fail-fast set -e
 *     suppressed, not edit path.
 * NOT Scant — Windows shell-snapshot
 *     PATH truncation at ~7.2KB.
 * NOT Sounder — background Bash
 *     completion notification never
 *     re-invokes session.
 * NOT Leat — sleep-block unbounded
 *     until-loop.
 * NOT Clew — sandbox deny-list
 *     E2BIG / ARG_MAX.
 * NOT Cubby — wrong-ancestor
 *     auto-memory cache.
 * NOT Bollard — RC environment
 *     orphan after supervisor gap.
 * Different problem: BASH TOOL
 * WRAPPER RUNS USER COMMAND AS EVAL
 * IN A NON-FINAL && LIST MEMBER →
 * SET -E IS STRUCTURALLY INERT.
 * Different UI: gunsmith's sear
 * desk — blued steel, walnut stock,
 * brass pins, oil-lamp amber,
 * charcoal. Sear notch (caught vs
 * fallen hammer), wrapper && chain
 * lamp, eval-nonfinal badge,
 * survived-echo stamp, wipe-after-
 * failed-cp incident card.
 * Different idle: caught.
 */

export const VERDICTS = Object.freeze([
  "caught",
  "inert",
  "survived",
  "nonfinal",
  "phantom-ok",
  "continued",
  "wiped",
  "chained",
  "freshbash",
  "suppressed",
]);
export const IDLE_WORD = "caught";
export const SLACK_VERDICTS = Object.freeze([
  "inert",
  "survived",
  "nonfinal",
  "phantom-ok",
  "continued",
  "wiped",
  "suppressed",
]);
export const LINEAR_VERDICTS = Object.freeze(["wiped", "phantom-ok", "inert"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90611;
export const CHANNEL_LIE_ISSUE = 90118;
export const EXIT_144_ISSUE = 62297;
export const CODEX_STILL_RUNNING_ISSUE = 34866;
export const CODEX_PWSH_QUOTE_ISSUE = 41534;
export const DEMO_WRAPPER =
  "bash -c \"source <snapshot>.sh 2>/dev/null || true && shopt -u extglob ... && eval '<user command>' < /dev/null && pwd -P >| /tmp/claude-<n>-cwd\"";
export const DEMO_REPRO = "set -e; false; echo survived";
export const DEMO_INCIDENT = "set -e; cp a dest/; cp b dest/; rm -rf a b";
export const DEMO_CONTROL_WRAPPER =
  "bash -ec 'set -e; false; echo survived'";
export const DEMO_FINAL_MEMBER =
  "eval '<user command>'; rc=$?; pwd -P >| /tmp/claude-<n>-cwd; exit $rc";

const FORBIDDEN_IDLE = Object.freeze([
  "sear",
  "trap",
  "fuse",
  "fusee",
  "pawl",
  "detent",
  "trip",
  "catch",
  "escapement",
  "trigger",
  "hammer",
  "striker",
  "hairpin",
  "bail",
  "dog",
  "chock",
  "latch",
  "keeper",
  "deadman",
  "failsafe",
  "errexit",
  "stopcock",
  "governor",
  "ratchet",
  "tripwire",
  "snubber",
  "sear-block",
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
  "cubby",
  "grille",
  "spile",
  "bollard",
  "clew",
  "scant",
  "sounder",
  "leat",
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

export function emptySear() {
  return {
    session: "",
    issue: null,
    source: "",
    setEPresent: false,
    wrapperEvalNonFinalAnd: false,
    falseThenEchoSurvived: false,
    toolExitZeroDespiteMidFail: false,
    continuedPastFail: false,
    wipeAfterFailedCopy: false,
    chainedWorkaround: false,
    freshBashEc: false,
    subshellAlsoSurvived: false,
    scored: false,
  };
}

export function emptyAction(session = "caught-1") {
  return {
    action: "score",
    session,
    sear: emptySear(),
  };
}

export function cloneSear(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptySear();
  const nested =
    (src.sear && typeof src.sear === "object" && src.sear) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.bench && typeof src.bench === "object" && src.bench) ||
    src;
  return {
    ...emptySear(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    setEPresent: asBool(nested.setEPresent ?? src.setEPresent, false) === true,
    wrapperEvalNonFinalAnd:
      asBool(nested.wrapperEvalNonFinalAnd ?? src.wrapperEvalNonFinalAnd, false) === true,
    falseThenEchoSurvived:
      asBool(nested.falseThenEchoSurvived ?? src.falseThenEchoSurvived, false) === true,
    toolExitZeroDespiteMidFail:
      asBool(nested.toolExitZeroDespiteMidFail ?? src.toolExitZeroDespiteMidFail, false) ===
      true,
    continuedPastFail:
      asBool(nested.continuedPastFail ?? src.continuedPastFail, false) === true,
    wipeAfterFailedCopy:
      asBool(nested.wipeAfterFailedCopy ?? src.wipeAfterFailedCopy, false) === true,
    chainedWorkaround:
      asBool(nested.chainedWorkaround ?? src.chainedWorkaround, false) === true,
    freshBashEc: asBool(nested.freshBashEc ?? src.freshBashEc, false) === true,
    subshellAlsoSurvived:
      asBool(nested.subshellAlsoSurvived ?? src.subshellAlsoSurvived, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(sear = {}) {
  const next = cloneSear(sear);
  const inertShape = next.setEPresent === true && next.wrapperEvalNonFinalAnd === true;
  const wipedShape = inertShape !== true && next.wipeAfterFailedCopy === true;
  const survivedShape =
    inertShape !== true && wipedShape !== true && next.falseThenEchoSurvived === true;
  const phantomOkShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    next.toolExitZeroDespiteMidFail === true;
  const continuedShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    phantomOkShape !== true &&
    next.continuedPastFail === true;
  const nonfinalShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    phantomOkShape !== true &&
    continuedShape !== true &&
    next.wrapperEvalNonFinalAnd === true;
  const suppressedShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    phantomOkShape !== true &&
    continuedShape !== true &&
    nonfinalShape !== true &&
    next.setEPresent === true &&
    next.subshellAlsoSurvived === true;
  const chainedShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    phantomOkShape !== true &&
    continuedShape !== true &&
    nonfinalShape !== true &&
    suppressedShape !== true &&
    next.chainedWorkaround === true;
  const freshbashShape =
    inertShape !== true &&
    wipedShape !== true &&
    survivedShape !== true &&
    phantomOkShape !== true &&
    continuedShape !== true &&
    nonfinalShape !== true &&
    suppressedShape !== true &&
    chainedShape !== true &&
    next.freshBashEc === true &&
    next.setEPresent !== true;
  const caughtHold =
    next.setEPresent === true &&
    next.wrapperEvalNonFinalAnd !== true &&
    next.falseThenEchoSurvived !== true &&
    next.toolExitZeroDespiteMidFail !== true &&
    next.continuedPastFail !== true &&
    next.wipeAfterFailedCopy !== true &&
    next.chainedWorkaround !== true &&
    next.subshellAlsoSurvived !== true;
  return {
    setEPresent: next.setEPresent,
    wrapperEvalNonFinalAnd: next.wrapperEvalNonFinalAnd,
    falseThenEchoSurvived: next.falseThenEchoSurvived,
    toolExitZeroDespiteMidFail: next.toolExitZeroDespiteMidFail,
    continuedPastFail: next.continuedPastFail,
    wipeAfterFailedCopy: next.wipeAfterFailedCopy,
    chainedWorkaround: next.chainedWorkaround,
    freshBashEc: next.freshBashEc,
    subshellAlsoSurvived: next.subshellAlsoSurvived,
    inertShape,
    wipedShape,
    survivedShape,
    phantomOkShape,
    continuedShape,
    nonfinalShape,
    suppressedShape,
    chainedShape,
    freshbashShape,
    caughtHold,
  };
}

export function isIdle(sear = {}) {
  const next = cloneSear(sear);
  return (
    next.setEPresent !== true &&
    next.wrapperEvalNonFinalAnd !== true &&
    next.falseThenEchoSurvived !== true &&
    next.toolExitZeroDespiteMidFail !== true &&
    next.continuedPastFail !== true &&
    next.wipeAfterFailedCopy !== true &&
    next.chainedWorkaround !== true &&
    next.freshBashEc !== true &&
    next.subshellAlsoSurvived !== true
  );
}

/**
 * First match wins by documented priority:
 * inert > wiped > survived >
 * phantom-ok > continued >
 * nonfinal > suppressed >
 * chained > freshbash > caught.
 * Idle caught is first. Seeded #90611
 * numbers must produce inert (or
 * survived / nonfinal / phantom-ok),
 * never caught. Prefer inert when
 * set -e is present and eval is a
 * non-final && member. A fallen sear
 * is not a hold.
 */
export function classify(sear = {}) {
  const next = cloneSear(sear);
  if (isIdle(next)) return "caught";
  const facts = analyze(next);

  if (facts.inertShape) return "inert";
  if (facts.wipedShape) return "wiped";
  if (facts.survivedShape) return "survived";
  if (facts.phantomOkShape) return "phantom-ok";
  if (facts.continuedShape) return "continued";
  if (facts.nonfinalShape) return "nonfinal";
  if (facts.suppressedShape) return "suppressed";
  if (facts.chainedShape) return "chained";
  if (facts.freshbashShape) return "freshbash";
  if (facts.caughtHold) return "caught";
  return "caught";
}

export function feedOf(sear = {}, verdict = "") {
  const kind = verdict || classify(sear);
  if (kind === "inert") {
    return "● Inert · set -e present but structurally suppressed · eval is a non-final && list member · primary #90611";
  }
  if (kind === "survived") {
    return "● Survived · execution continued past a failing line · echo survived after false · #90611 repro";
  }
  if (kind === "nonfinal") {
    return "● Nonfinal · user command eval is a non-final && member · wrapper still runs pwd -P after eval";
  }
  if (kind === "phantom-ok") {
    return "● Phantom-ok · tool/report exit 0 despite mid-script failure · last line succeeded · failure invisible to the model";
  }
  if (kind === "continued") {
    return "● Continued · script ran lines after a failed command · set -e did not abort";
  }
  if (kind === "wiped") {
    return "● Wiped · destructive cleanup ran after earlier fail · cp failed then rm -rf sources · #90611 incident";
  }
  if (kind === "chained") {
    return "● Chained · &&-chain workaround in use · not true errexit · undiscoverable unless the model already knows";
  }
  if (kind === "freshbash") {
    return "● Freshbash · bash -ec workaround applied · recovery class · own errexit context · caught may still be false";
  }
  if (kind === "suppressed") {
    return "● Suppressed · POSIX/bash documented errexit suppression in &&/|| list context · including subshells";
  }
  return "● Caught · sear engaged · set -e would abort · fresh bash -ec or final-member context · wrapper does not suppress · idle word is caught";
}

export function reasonsOf(sear = {}, verdict = "") {
  const next = cloneSear(sear);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.setEPresent ||
      facts.wrapperEvalNonFinalAnd ||
      facts.falseThenEchoSurvived ||
      facts.toolExitZeroDespiteMidFail ||
      facts.wipeAfterFailedCopy
      ? `set -e ${facts.setEPresent ? "yes" : "no"} · eval-nonfinal ${facts.wrapperEvalNonFinalAnd ? "yes" : "no"} · survived-echo ${facts.falseThenEchoSurvived ? "yes" : "no"} · phantom-ok ${facts.toolExitZeroDespiteMidFail ? "yes" : "no"} · wipe ${facts.wipeAfterFailedCopy ? "yes" : "no"}`
      : "sear engaged · set -e would abort · wrapper does not suppress · idle word is caught",
  );
  if (facts.inertShape) {
    reasons.push(
      "set -e present but structurally suppressed · eval is a non-final && list member · POSIX/bash suppress errexit for the whole script · the #90611 harm",
    );
  }
  if (facts.wrapperEvalNonFinalAnd) {
    reasons.push(
      "wrapper shape: source snapshot || true && shopt ... && eval '<user command>' < /dev/null && pwd -P >| cwd · eval is not the final && member",
    );
  }
  if (facts.falseThenEchoSurvived) {
    reasons.push("defensive set -e; false; echo survived printed survived · expected abort after false");
  }
  if (facts.toolExitZeroDespiteMidFail) {
    reasons.push("tool call exited 0 because the last line succeeded · failure invisible to the model");
  }
  if (facts.continuedPastFail) {
    reasons.push("script ran lines after a failed command · set -e did not stop");
  }
  if (facts.wipeAfterFailedCopy) {
    reasons.push(
      "copy-then-cleanup: cp failed; set -e did not stop; rm -rf deleted the sources · #90611 incident",
    );
  }
  if (facts.subshellAlsoSurvived) {
    reasons.push(
      "(set -e; false; echo survived) also prints survived · errexit suppressed in subshells too · POSIX &&/|| list context",
    );
  }
  if (facts.chainedWorkaround) {
    reasons.push("&&-chain workaround in use · not true errexit · undiscoverable");
  }
  if (facts.freshBashEc) {
    reasons.push("bash -ec workaround applied · fresh bash, own errexit context · recovery class");
  }
  if (facts.caughtHold) {
    reasons.push(
      "set -e would actually abort · fresh bash -ec or wrapper restructured so user command is the final list member",
    );
  }
  reasons.push("a fallen sear is not a hold");
  reasons.push(
    "NOT Spile (hook stdin wedge / unenforced timeout) / Grille (Bash-steered edits) / Scant (Windows PATH truncation) / Sounder (background waiter never re-invokes) / Leat (sleep-block until-loop) / Clew (deny-list E2BIG) / Cubby (wrong-ancestor auto-memory) / Bollard (RC env orphan) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "caught") {
    reasons.push(
      "sear engaged; set -e would abort; wrapper does not suppress; idle word is caught",
    );
  }
  if (kind === "inert") {
    reasons.push(
      "PRIMARY #90611: command runs as eval in a non-final && list member, so errexit is suppressed for the whole script. The inert case is inert, never caught.",
    );
  }
  if (kind === "survived") {
    reasons.push("execution continued past a failing line. echo survived after false.");
  }
  if (kind === "nonfinal") {
    reasons.push("user command eval is a non-final && member.");
  }
  if (kind === "phantom-ok") {
    reasons.push("tool/report exit 0 despite mid-script failure.");
  }
  if (kind === "continued") {
    reasons.push("script ran lines after a failed command.");
  }
  if (kind === "wiped") {
    reasons.push("destructive cleanup ran after earlier fail. cp-fail then rm -rf class.");
  }
  if (kind === "chained") {
    reasons.push("&&-chain workaround in use. Not true errexit.");
  }
  if (kind === "freshbash") {
    reasons.push("bash -ec workaround applied. Recovery class; caught may still be false.");
  }
  if (kind === "suppressed") {
    reasons.push("POSIX/bash documented errexit suppression in &&/|| list context.");
  }
  return reasons;
}

export function verdictOf(sear = {}) {
  return classify(sear);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function caughtOf(sear = {}, verdict = "") {
  const kind = verdict || classify(sear);
  if (kind !== "caught") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  const facts = analyze(sear);
  if (isIdle(sear)) return true;
  return facts.caughtHold === true;
}

export function inertOf(sear = {}, verdict = "") {
  return (verdict || classify(sear)) === "inert";
}

export function summaryOf(sear = {}) {
  const next = cloneSear(sear);
  const facts = analyze(next);
  return {
    setEPresent: facts.setEPresent,
    wrapperEvalNonFinalAnd: facts.wrapperEvalNonFinalAnd,
    falseThenEchoSurvived: facts.falseThenEchoSurvived,
    toolExitZeroDespiteMidFail: facts.toolExitZeroDespiteMidFail,
    continuedPastFail: facts.continuedPastFail,
    wipeAfterFailedCopy: facts.wipeAfterFailedCopy,
    chainedWorkaround: facts.chainedWorkaround,
    freshBashEc: facts.freshBashEc,
    subshellAlsoSurvived: facts.subshellAlsoSurvived,
  };
}

export function score(sear = {}) {
  const next = cloneSear(sear);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    caught: caughtOf(next, verdict),
    inert: inertOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    setEPresent: facts.setEPresent,
    wrapperEvalNonFinalAnd: facts.wrapperEvalNonFinalAnd,
    falseThenEchoSurvived: facts.falseThenEchoSurvived,
    toolExitZeroDespiteMidFail: facts.toolExitZeroDespiteMidFail,
    continuedPastFail: facts.continuedPastFail,
    wipeAfterFailedCopy: facts.wipeAfterFailedCopy,
    chainedWorkaround: facts.chainedWorkaround,
    freshBashEc: facts.freshBashEc,
    subshellAlsoSurvived: facts.subshellAlsoSurvived,
    summary: summaryOf(next),
    sear: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const searSrc =
    src.sear ||
    src.probe ||
    src.payload ||
    src.bench ||
    payload.sear ||
    payload.probe ||
    payload.bench;
  const sear = cloneSear(
    searSrc && typeof searSrc === "object" ? { ...searSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !sear.session) sear.session = src.session;
  if (typeof payload.session === "string" && !sear.session) sear.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? sear.session ?? ""),
    sear,
    issue: src.issue ?? payload.issue ?? sear.issue ?? null,
    source: src.source ?? payload.source ?? sear.source ?? "",
  };
}

function searResult(verdict, sear, action, extras = {}) {
  const next = cloneSear(sear);
  const scored = score(next);
  return {
    ok: true,
    product: "sear",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    caught: scored.caught,
    inert: scored.inert,
    searCaught: verdict === "caught",
    searInert: verdict === "inert",
    searSurvived: verdict === "survived",
    searNonfinal: verdict === "nonfinal",
    searPhantomOk: verdict === "phantom-ok",
    searContinued: verdict === "continued",
    searWiped: verdict === "wiped",
    searChained: verdict === "chained",
    searFreshbash: verdict === "freshbash",
    searSuppressed: verdict === "suppressed",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    setEPresent: scored.setEPresent,
    wrapperEvalNonFinalAnd: scored.wrapperEvalNonFinalAnd,
    falseThenEchoSurvived: scored.falseThenEchoSurvived,
    toolExitZeroDespiteMidFail: scored.toolExitZeroDespiteMidFail,
    continuedPastFail: scored.continuedPastFail,
    wipeAfterFailedCopy: scored.wipeAfterFailedCopy,
    chainedWorkaround: scored.chainedWorkaround,
    freshBashEc: scored.freshBashEc,
    subshellAlsoSurvived: scored.subshellAlsoSurvived,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    sear: next,
    ...extras,
  };
}

function seedSear(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    sear: {
      ...emptySear(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      setEPresent: Boolean(extras.setEPresent),
      wrapperEvalNonFinalAnd: Boolean(extras.wrapperEvalNonFinalAnd),
      falseThenEchoSurvived: Boolean(extras.falseThenEchoSurvived),
      toolExitZeroDespiteMidFail: Boolean(extras.toolExitZeroDespiteMidFail),
      continuedPastFail: Boolean(extras.continuedPastFail),
      wipeAfterFailedCopy: Boolean(extras.wipeAfterFailedCopy),
      chainedWorkaround: Boolean(extras.chainedWorkaround),
      freshBashEc: Boolean(extras.freshBashEc),
      subshellAlsoSurvived: Boolean(extras.subshellAlsoSurvived),
    },
  };
}

/** Idle reset. Sear engaged. set -e would abort. */
export function seedCaught() {
  return seedSear("caught", "gunsmith", {
    session: "caught",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedCaught();
}

/**
 * Control / proof: fresh bash -ec or
 * wrapper restructured so the user
 * command is the final list member.
 * set -e would fire. Classifies as
 * caught; caught true.
 */
export function seedControl() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-control",
    issue: null,
    setEPresent: true,
    wrapperEvalNonFinalAnd: false,
    falseThenEchoSurvived: false,
    toolExitZeroDespiteMidFail: false,
    continuedPastFail: false,
    wipeAfterFailedCopy: false,
    chainedWorkaround: false,
    freshBashEc: true,
    subshellAlsoSurvived: false,
  });
}

/**
 * #90611 inert: set -e present, eval
 * in non-final &&, false then echo
 * survived, tool exit 0, continued
 * past fail, wipe after failed cp,
 * subshell also survived. A fallen
 * sear is not a hold. Prefer inert
 * when set -e is present and eval is
 * a non-final && member. Never caught.
 */
export function seedInert() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-inert",
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
    toolExitZeroDespiteMidFail: true,
    continuedPastFail: true,
    wipeAfterFailedCopy: true,
    subshellAlsoSurvived: true,
  });
}

export function seed90611() {
  return seedInert();
}

/**
 * Execution continued past a failing
 * line. Unique flags: survived-echo
 * without the inert pair.
 */
export function seedSurvived() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-survived",
    falseThenEchoSurvived: true,
  });
}

/**
 * User command eval is a non-final
 * && member. Unique flags: eval
 * non-final without set -e present.
 */
export function seedNonfinal() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-nonfinal",
    wrapperEvalNonFinalAnd: true,
  });
}

/** Tool/report exit 0 despite mid-script failure. */
export function seedPhantomOk() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-phantom-ok",
    toolExitZeroDespiteMidFail: true,
  });
}

/** Script ran lines after a failed command. */
export function seedContinued() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-continued",
    continuedPastFail: true,
  });
}

/**
 * Destructive cleanup after earlier
 * fail. Unique flags: wipe without
 * the inert pair.
 */
export function seedWiped() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-wiped",
    wipeAfterFailedCopy: true,
  });
}

/** &&-chain workaround in use. Not true errexit. */
export function seedChained() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-chained",
    chainedWorkaround: true,
  });
}

/**
 * bash -ec workaround applied.
 * Recovery class; caught false
 * because only the workaround is
 * noted, not a proven abort hold.
 */
export function seedFreshbash() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-freshbash",
    freshBashEc: true,
  });
}

/**
 * POSIX/bash documented errexit
 * suppression in &&/|| list context,
 * including subshells. Unique flags:
 * set -e + subshell survived without
 * the eval-nonfinal pair.
 */
export function seedSuppressed() {
  return seedSear(FEATURED_ISSUE, "anthropics/claude-code#90611", {
    session: "90611-suppressed",
    setEPresent: true,
    subshellAlsoSurvived: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptySear();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneSear({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneSear({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const inert =
    /set -e is structurally inert|#90611|eval in a non-final|non-final `?&&`? list/i.test(text) &&
    /set -e|errexit|eval/i.test(text);
  const wiped = /wiped|rm -rf|copy-then-cleanup|cp failed then/i.test(text);
  const survived = /echo survived|false; echo survived|survived after false/i.test(text);
  const phantom = /phantom-ok|exit 0 despite|tool still exited 0|last line succeeded/i.test(text);
  const continued = /continued past|ran lines after a failed/i.test(text);
  const nonfinal = /nonfinal|non-final &&|eval is not the final/i.test(text);
  const suppressed = /suppressed|POSIX|errexit suppression|&&\/\|\|/i.test(text);
  const chained = /chained|&&-chain workaround/i.test(text);
  const freshbash = /freshbash|bash -ec|fresh bash/i.test(text);
  const caught = /admit caught|sear engaged|set -e would abort|final-member/i.test(text);

  if (inert && /inert|structurally inert|#90611/i.test(text)) {
    return {
      ...seedInert().sear,
      session: "paste-inert",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (wiped && !/inert|#90611 pentad|structurally inert/i.test(text)) {
    return {
      ...seedWiped().sear,
      session: "paste-wiped",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (survived && !/inert|structurally inert/i.test(text)) {
    return {
      ...seedSurvived().sear,
      session: "paste-survived",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (phantom && !/inert|structurally inert/i.test(text)) {
    return {
      ...seedPhantomOk().sear,
      session: "paste-phantom-ok",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (continued && !/inert|structurally inert/i.test(text)) {
    return {
      ...seedContinued().sear,
      session: "paste-continued",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (nonfinal && !/inert|structurally inert|set -e present/i.test(text)) {
    return {
      ...seedNonfinal().sear,
      session: "paste-nonfinal",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (suppressed && !/inert|structurally inert/i.test(text)) {
    return {
      ...seedSuppressed().sear,
      session: "paste-suppressed",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (chained) {
    return {
      ...seedChained().sear,
      session: "paste-chained",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (freshbash && !/control|would abort|final-member/i.test(text)) {
    return {
      ...seedFreshbash().sear,
      session: "paste-freshbash",
      source: "anthropics/claude-code#90611",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (caught) {
    return { ...seedCaught().sear, session: "paste-caught", source: "paste", scored: true };
  }
  return { ...emptySear(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  caught: seedCaught,
  control: seedControl,
  inert: seedInert,
  90611: seed90611,
  "90611-inert": seedInert,
  survived: seedSurvived,
  nonfinal: seedNonfinal,
  "phantom-ok": seedPhantomOk,
  phantomok: seedPhantomOk,
  continued: seedContinued,
  wiped: seedWiped,
  chained: seedChained,
  freshbash: seedFreshbash,
  "fresh-bash": seedFreshbash,
  suppressed: seedSuppressed,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  gunsmith: seedControl,
  bench: seedControl,
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
  let sear = cloneSear(action.sear);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "caught" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return searResult("caught", emptySear(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "gunsmith" || verb === "bench") {
    sear = seedControl().sear;
    return searResult(classify(sear), sear, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "inert" || verb === "incident" || verb === "90611") {
    sear = seedInert().sear;
    return searResult(classify(sear), sear, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-bench") {
    sear = { ...sear, scored: true };
    return searResult(classify(sear), sear, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    sear = { ...sear, scored: true };
    return searResult(classify(sear), sear, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  sear = { ...sear, scored: true };
  return searResult(classify(sear), sear, action);
}
