/**
 * Chad — hanging-chad / ballot booth desk for Claude Code
 * AskUserQuestion returning an option the user never selected,
 * then the assistant acting on that forged consent (e.g.
 * `docker compose up --build -d` against a standing instruction).
 * A reported selected option is not a hold. Score the ballot
 * or admit spoilt.
 *
 * Primary #90407: AskUserQuestion reported
 * "You run it (Recommended)" the user never chose; assistant
 * started Docker containers. Hypotheses: Enter meant for the
 * text prompt submitted the highlighted Recommended option;
 * race between question UI and mid-turn message input;
 * question UI auto-resolving when the user sends a message
 * instead of answering. Expected: pending question should
 * resolve as unanswered/dismissed, not as the highlighted
 * option; a mid-turn user message should take precedence.
 *
 * Verdicts: spoilt | punched | blank | carried | miscast
 *           | phantom | rubbered | forced | defaulted | clear
 * Idle word is spoilt (spoilt ballot, nothing scored).
 * NEVER use the product name chad as the idle/state word.
 * NEVER use empty.
 * NEVER reuse Kist laid, Wraith unlinked, Gasket tight,
 * Damper banked, Cote roosted, Larder stocked, Tappet seated,
 * Aside heard, Chute clear (as idle), Tain paired, Husk kernel,
 * Snib latched, Veto upheld, Assay sterling, Wicket home,
 * Sigil valid, Stencil dry, Suture sealed, Reveille quiet,
 * Livery seised. Do not ship Livery, Nixie, Crypt, Booth-as-
 * rename-of-Chad, Ballot, Teller, or Placet.
 *
 * Slack chad alarm on punched / carried / miscast / phantom / forced.
 * Linear false-consent ticket on punched / carried / phantom.
 * GitHub chad-ledger of ballot events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Knock (fail-loud permission-grant stall). Knock is
 * stalled grants; Chad is a false affirmative on a question tool.
 * NOT Damper (Remote Control auto-enable without consent).
 * Damper is a settings toggle; Chad is AskUserQuestion phantom
 * selection + acted-upon side effects.
 * NOT Parity (claim vs reality probes of GitHub/Vercel/Linear).
 * Parity checks agent assertions against external truth; Chad
 * scores ballot provenance (reported selection vs user intent
 * / dismissal).
 * NOT Snib / Veto / Assay / Gasket / Wraith / Kist / Cote /
 * Larder / Tappet / Aside / Chute / Tain / Husk / Wicket /
 * Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom /
 * Hasp / Reveille / Quench / Scrim.
 * NOT leftover woodworking / millimetre-slider clones.
 * A chad is a ballot-punch metaphor for a diagnostic desk,
 * not a leftover instrument.
 * Different problem: phantom AskUserQuestion selection
 * treated as consent.
 * Different UI: polling-station / hanging-chad ballot booth.
 * Paper ballots, punch cards, hanging chads, ink stamp,
 * canvas bag, election night ledger. Fluorescent or dusk
 * civic hall light.
 * Different idle word: spoilt.
 */

export const VERDICTS = Object.freeze([
  "spoilt",
  "punched",
  "blank",
  "carried",
  "miscast",
  "phantom",
  "rubbered",
  "forced",
  "defaulted",
  "clear",
]);
export const IDLE_WORD = "spoilt";
export const SLACK_VERDICTS = Object.freeze([
  "punched",
  "carried",
  "miscast",
  "phantom",
  "forced",
]);
export const LINEAR_VERDICTS = Object.freeze(["punched", "carried", "phantom"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "chad",
  "empty",
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
  "livery",
  "kist",
  "wraith",
  "gasket",
  "damper",
  "cote",
  "nixie",
  "knock",
  "parity",
  "crypt",
  "booth",
  "ballot",
  "teller",
  "placet",
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

function hasReportedOption(probe) {
  return asText(probe.reportedOption).trim() !== "";
}

export function emptyProbe() {
  return {
    reportedOption: "",
    userDeniesSelection: false,
    userNeverChose: false,
    recommendedWasHighlighted: false,
    enterWhileTyping: false,
    focusClickSelected: false,
    midTurnMessageAutoResolved: false,
    assistantActedOnResult: false,
    sideEffectLanded: false,
    resultIndistinguishableFromHuman: false,
    questionDismissedUnanswered: false,
    deliberateSelectionVerified: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "spoilt-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const ballot = src.ballot && typeof src.ballot === "object" ? src.ballot : {};
  const booth = src.booth && typeof src.booth === "object" ? src.booth : {};
  const punch = src.punch && typeof src.punch === "object" ? src.punch : {};
  const ledger = src.ledger && typeof src.ledger === "object" ? src.ledger : {};
  const pick = (key) => src[key] ?? ballot[key] ?? booth[key] ?? punch[key] ?? ledger[key];
  return {
    ...emptyProbe(),
    reportedOption: asText(pick("reportedOption")),
    userDeniesSelection: asBool(pick("userDeniesSelection")),
    userNeverChose: asBool(pick("userNeverChose")),
    recommendedWasHighlighted: asBool(pick("recommendedWasHighlighted")),
    enterWhileTyping: asBool(pick("enterWhileTyping")),
    focusClickSelected: asBool(pick("focusClickSelected")),
    midTurnMessageAutoResolved: asBool(pick("midTurnMessageAutoResolved")),
    assistantActedOnResult: asBool(pick("assistantActedOnResult")),
    sideEffectLanded: asBool(pick("sideEffectLanded")),
    resultIndistinguishableFromHuman: asBool(pick("resultIndistinguishableFromHuman")),
    questionDismissedUnanswered: asBool(pick("questionDismissedUnanswered")),
    deliberateSelectionVerified: asBool(pick("deliberateSelectionVerified")),
    observed: asBool(src.observed ?? ballot.observed ?? booth.observed ?? punch.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? ballot.source ?? booth.source ?? punch.source),
    issue: asIssue(src.issue ?? ballot.issue ?? booth.issue ?? punch.issue),
    scored: asBool(src.scored ?? ballot.scored ?? booth.scored ?? punch.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !hasReportedOption(next) &&
    !next.userDeniesSelection &&
    !next.userNeverChose &&
    !next.recommendedWasHighlighted &&
    !next.enterWhileTyping &&
    !next.focusClickSelected &&
    !next.midTurnMessageAutoResolved &&
    !next.assistantActedOnResult &&
    !next.sideEffectLanded &&
    !next.resultIndistinguishableFromHuman &&
    !next.questionDismissedUnanswered &&
    !next.deliberateSelectionVerified &&
    !next.observed
  );
}

function isPhantomPunch(next) {
  return hasReportedOption(next) && (next.userDeniesSelection || next.userNeverChose);
}

/**
 * First match wins. Idle spoilt is first. Classes stay distinguishable:
 * a reported selection is not a hold. This is phantom AskUserQuestion
 * selection treated as consent.
 * NOT Knock (stalled grant). NOT Damper (RC auto-enable).
 * NOT Parity (claim vs reality). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "spoilt";
  if (isPhantomPunch(next)) return "punched";
  if (next.questionDismissedUnanswered) return "blank";
  if (next.deliberateSelectionVerified) return "clear";
  if (next.assistantActedOnResult || next.sideEffectLanded) return "carried";
  if (next.enterWhileTyping || next.focusClickSelected) return "miscast";
  if (next.resultIndistinguishableFromHuman) return "phantom";
  if (next.recommendedWasHighlighted && hasReportedOption(next) && !next.deliberateSelectionVerified) {
    return "rubbered";
  }
  if (next.midTurnMessageAutoResolved) return "forced";
  if (hasReportedOption(next) && !next.deliberateSelectionVerified) return "defaulted";
  return "spoilt";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (next.assistantActedOnResult || next.sideEffectLanded) add("carried");
  if (next.enterWhileTyping || next.focusClickSelected) add("miscast");
  if (next.resultIndistinguishableFromHuman) add("phantom");
  if (next.midTurnMessageAutoResolved) add("forced");
  if (next.recommendedWasHighlighted && !next.deliberateSelectionVerified) add("defaulted");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "punched") {
    return "● Punched · tool reported a selected option the user denies / never chose · hanging chad";
  }
  if (kind === "blank") {
    return "● Blank · question unresolved / dismissed / unanswered · mid-turn message took precedence";
  }
  if (kind === "carried") {
    return "● Carried · assistant acted on the reported option · side effect landed";
  }
  if (kind === "miscast") {
    return "● Miscast · Enter or focus-click submitted the highlighted Recommended option";
  }
  if (kind === "phantom") {
    return "● Phantom · result looks like a genuine human answer · provenance is missing";
  }
  if (kind === "rubbered") {
    return "● Rubbered · rubber-stamp Recommended default submitted without a deliberate pick";
  }
  if (kind === "forced") {
    return "● Forced · mid-turn message caused auto-resolve to the highlighted option";
  }
  if (kind === "defaulted") {
    return "● Defaulted · first / Recommended option submitted by accident of UI default";
  }
  if (kind === "clear") {
    return "● Clear · verified deliberate selection with distinguishable human provenance";
  }
  return "● Spoilt · spoilt ballot · nothing scored · idle word is spoilt";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    hasReportedOption(next)
      ? `reported option ${asText(next.reportedOption).trim()}`
      : "no option reported on this ballot",
  );
  reasons.push(
    next.userDeniesSelection || next.userNeverChose
      ? "user denies the selection / never chose the reported option"
      : "user did not deny a reported selection",
  );
  reasons.push(
    next.recommendedWasHighlighted
      ? "Recommended option was highlighted"
      : "Recommended was not the highlighted option",
  );
  reasons.push(
    next.enterWhileTyping
      ? "Enter while typing submitted the highlighted option"
      : "Enter-while-typing was not scored",
  );
  reasons.push(
    next.focusClickSelected
      ? "focus click selected an option"
      : "focus click did not select an option",
  );
  reasons.push(
    next.midTurnMessageAutoResolved
      ? "mid-turn message auto-resolved the question to the highlighted option"
      : "mid-turn message did not auto-resolve the question",
  );
  reasons.push(
    next.assistantActedOnResult || next.sideEffectLanded
      ? "assistant acted on the reported option; side effect landed"
      : "assistant did not act on a reported option",
  );
  if (next.resultIndistinguishableFromHuman) {
    reasons.push("result is indistinguishable from a genuine human response");
  }
  if (next.questionDismissedUnanswered) {
    reasons.push("question dismissed unanswered (healthy path when the user typed instead of picking)");
  }
  if (next.deliberateSelectionVerified) {
    reasons.push("deliberate selection verified with distinguishable human provenance");
  }
  if (next.observed) {
    reasons.push("Precinct checked the ballot: reported option, denial, provenance, side effect");
  }
  reasons.push("a reported selection is not a hold");
  reasons.push(
    "NOT Knock (stalled grant) / Damper (RC auto-enable) / Parity (claim vs reality) / Kist / Wraith / Gasket / leftover woodworking / millimetre-slider",
  );
  if (kind === "spoilt") {
    reasons.push("spoilt ballot or desk idle; idle word is spoilt");
  }
  if (kind === "punched") {
    reasons.push(
      "PRIMARY #90407: AskUserQuestion reported You run it (Recommended) the user never chose; assistant started Docker containers (docker compose up --build -d)",
    );
  }
  if (kind === "blank") {
    reasons.push("pending question resolved as unanswered/dismissed; mid-turn user message took precedence");
  }
  if (kind === "carried") {
    reasons.push("assistant acted on the reported option; side effect landed (docker/containers)");
  }
  if (kind === "miscast") {
    reasons.push("PRIMARY contrast #76616: Enter or focus-click submitted the highlighted Recommended option");
  }
  if (kind === "phantom") {
    reasons.push("PRIMARY contrast #88790: AskUserQuestion tool result cannot be distinguished from a genuine human response");
  }
  if (kind === "rubbered") {
    reasons.push("rubber-stamp Recommended default submitted without a deliberate pick");
  }
  if (kind === "forced") {
    reasons.push("mid-turn message caused the question UI to auto-resolve to the highlighted option");
  }
  if (kind === "defaulted") {
    reasons.push("first/Recommended option submitted by accident of UI default");
  }
  if (kind === "clear") {
    reasons.push("verified deliberate selection with distinguishable human provenance; healthy hold");
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

export function spoiltOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "spoilt";
}

export function punchedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "punched";
}

export function carriedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "carried";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], spoilt, punched, carried }
 * Deterministic. First match wins. Idle spoilt first.
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
    spoilt: spoiltOf(next, verdict),
    punched: punchedOf(next, verdict),
    carried: carriedOf(next, verdict),
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
    reportedOption: pick("reportedOption"),
    userDeniesSelection: pick("userDeniesSelection"),
    userNeverChose: pick("userNeverChose"),
    recommendedWasHighlighted: pick("recommendedWasHighlighted"),
    enterWhileTyping: pick("enterWhileTyping"),
    focusClickSelected: pick("focusClickSelected"),
    midTurnMessageAutoResolved: pick("midTurnMessageAutoResolved"),
    assistantActedOnResult: pick("assistantActedOnResult"),
    sideEffectLanded: pick("sideEffectLanded"),
    resultIndistinguishableFromHuman: pick("resultIndistinguishableFromHuman"),
    questionDismissedUnanswered: pick("questionDismissedUnanswered"),
    deliberateSelectionVerified: pick("deliberateSelectionVerified"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    ballot: fromFields.ballot,
    booth: fromFields.booth,
    punch: fromFields.punch,
    ledger: fromFields.ledger,
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
    product: "chad",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    spoilt: scored.spoilt,
    punched: scored.punched,
    carried: scored.carried,
    cluster: scored.cluster,
    ballotSpoilt: verdict === "spoilt",
    ballotPunched: verdict === "punched",
    ballotBlank: verdict === "blank",
    ballotCarried: verdict === "carried",
    ballotMiscast: verdict === "miscast",
    ballotPhantom: verdict === "phantom",
    ballotRubbered: verdict === "rubbered",
    ballotForced: verdict === "forced",
    ballotDefaulted: verdict === "defaulted",
    ballotClear: verdict === "clear",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    reportedOption: next.reportedOption,
    userDeniesSelection: next.userDeniesSelection,
    userNeverChose: next.userNeverChose,
    recommendedWasHighlighted: next.recommendedWasHighlighted,
    enterWhileTyping: next.enterWhileTyping,
    focusClickSelected: next.focusClickSelected,
    midTurnMessageAutoResolved: next.midTurnMessageAutoResolved,
    assistantActedOnResult: next.assistantActedOnResult,
    sideEffectLanded: next.sideEffectLanded,
    resultIndistinguishableFromHuman: next.resultIndistinguishableFromHuman,
    questionDismissedUnanswered: next.questionDismissedUnanswered,
    deliberateSelectionVerified: next.deliberateSelectionVerified,
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
      reportedOption: extras.reportedOption || "",
      userDeniesSelection: Boolean(extras.userDeniesSelection),
      userNeverChose: Boolean(extras.userNeverChose),
      recommendedWasHighlighted: Boolean(extras.recommendedWasHighlighted),
      enterWhileTyping: Boolean(extras.enterWhileTyping),
      focusClickSelected: Boolean(extras.focusClickSelected),
      midTurnMessageAutoResolved: Boolean(extras.midTurnMessageAutoResolved),
      assistantActedOnResult: Boolean(extras.assistantActedOnResult),
      sideEffectLanded: Boolean(extras.sideEffectLanded),
      resultIndistinguishableFromHuman: Boolean(extras.resultIndistinguishableFromHuman),
      questionDismissedUnanswered: Boolean(extras.questionDismissedUnanswered),
      deliberateSelectionVerified: Boolean(extras.deliberateSelectionVerified),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / shut. Spoilt ballot. Nothing scored. */
export function seedSpoilt() {
  return seedProbe("spoilt", "booth", {
    session: "spoilt",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90407 punched.
 * AskUserQuestion reported You run it (Recommended). User never
 * chose. Docker compose ran. Cluster: carried, miscast, phantom,
 * forced, defaulted.
 */
export function seed90407Punched() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-punched",
    reportedOption: "You run it (Recommended)",
    userDeniesSelection: true,
    userNeverChose: true,
    recommendedWasHighlighted: true,
    enterWhileTyping: true,
    midTurnMessageAutoResolved: true,
    assistantActedOnResult: true,
    sideEffectLanded: true,
    resultIndistinguishableFromHuman: true,
  });
}

/** Blank: question unresolved / dismissed / unanswered. */
export function seedBlank() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-blank",
    questionDismissedUnanswered: true,
  });
}

/** Carried: assistant acted; side effect landed. No denial. */
export function seedCarried() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-carried",
    reportedOption: "You run it (Recommended)",
    assistantActedOnResult: true,
    sideEffectLanded: true,
  });
}

/** #76616 miscast: focus-click submitted the highlighted option. */
export function seed76616Miscast() {
  return seedProbe(76616, "anthropics/claude-code#76616", {
    session: "76616-miscast",
    reportedOption: "You run it (Recommended)",
    recommendedWasHighlighted: true,
    focusClickSelected: true,
    enterWhileTyping: true,
  });
}

/** #88790 phantom: result indistinguishable from a genuine human answer. */
export function seed88790Phantom() {
  return seedProbe(88790, "anthropics/claude-code#88790", {
    session: "88790-phantom",
    reportedOption: "You run it (Recommended)",
    resultIndistinguishableFromHuman: true,
  });
}

/** Rubbered: Recommended default rubber-stamped without a deliberate pick. */
export function seedRubbered() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-rubbered",
    reportedOption: "You run it (Recommended)",
    recommendedWasHighlighted: true,
  });
}

/** Forced: mid-turn message auto-resolved to the highlighted option. */
export function seedForced() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-forced",
    midTurnMessageAutoResolved: true,
  });
}

/** Defaulted: first/Recommended option submitted by accident of UI default. */
export function seedDefaulted() {
  return seedProbe(90407, "anthropics/claude-code#90407", {
    session: "90407-defaulted",
    reportedOption: "You run it (Recommended)",
  });
}

/** Clear: verified deliberate selection with distinguishable human provenance. */
export function seedClear() {
  return seedProbe("clear", "ballot", {
    session: "clear",
    issue: null,
    reportedOption: "I'll handle it",
    deliberateSelectionVerified: true,
  });
}

const SEEDS = {
  spoilt: seedSpoilt,
  punched: seed90407Punched,
  90407: seed90407Punched,
  "90407-punched": seed90407Punched,
  blank: seedBlank,
  "90407-blank": seedBlank,
  carried: seedCarried,
  "90407-carried": seedCarried,
  miscast: seed76616Miscast,
  76616: seed76616Miscast,
  "76616-miscast": seed76616Miscast,
  phantom: seed88790Phantom,
  88790: seed88790Phantom,
  "88790-phantom": seed88790Phantom,
  rubbered: seedRubbered,
  "90407-rubbered": seedRubbered,
  forced: seedForced,
  "90407-forced": seedForced,
  defaulted: seedDefaulted,
  "90407-defaulted": seedDefaulted,
  clear: seedClear,
};

function punchedStrike(session) {
  return {
    ...emptyProbe(),
    reportedOption: "You run it (Recommended)",
    userDeniesSelection: true,
    userNeverChose: true,
    recommendedWasHighlighted: true,
    enterWhileTyping: true,
    midTurnMessageAutoResolved: true,
    assistantActedOnResult: true,
    sideEffectLanded: true,
    resultIndistinguishableFromHuman: true,
    session: session || "punched",
    source: "ballot",
    issue: 90407,
    scored: true,
  };
}

function clearStrike(session) {
  return {
    ...emptyProbe(),
    reportedOption: "I'll handle it",
    deliberateSelectionVerified: true,
    session: session || "clear",
    source: "hold",
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

  if (verb === "shut" || verb === "seat" || verb === "spoilt") {
    return pack("spoilt", emptyProbe(), { ...action, action: verb === "seat" ? "shut" : verb });
  }

  if (verb === "punch" || verb === "forge") {
    probe = punchedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "punch" });
  }

  if (verb === "clear") {
    probe = clearStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "clear" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
