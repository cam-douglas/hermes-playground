/**
 * Pleat — tailor's pressing board / accordion-pleat desk for
 * Claude Code Desktop collapsing assistant text written *between*
 * tool calls under the "Ran N commands" fold. Users only reliably
 * see the final text block of a turn. Mid-turn substantive answers
 * (numbered steps, requested explanations) are silently hidden with
 * no hint that collapsed prose exists. The model believes it
 * answered; the user sees tool-call chrome and a fragment.
 * A rendered fold is not a hold. Score the cloth or admit flat.
 *
 * Primary #90425: Desktop app collapses assistant text written
 * between tool calls; substantive answers silently hidden under
 * 'Ran N commands'. Two repros: numbered list appears to start at
 * 4; requested explanation collapsed entirely.
 *
 * Verdicts: flat | pleated | buried | folded | swallowed | midturn
 *           | chrome | fragment | ghosted | aired
 * Idle word is flat (pleat pressed open; prose visible).
 * NEVER use the product name pleat as the idle/state word.
 * NEVER use empty.
 * NEVER reuse fit, spoilt, laid, unlinked, tight, banked, roosted,
 * stocked, seated, heard, clear, paired, kernel, latched, upheld,
 * sterling, home, valid, dry, sealed (as idle), quiet, seised.
 * Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule,
 * Livery, Nixie, Crypt, Fold, Accordion, Bellows as the product
 * name. Product name is Pleat only.
 *
 * Slack pleat alarm on pleated / buried / swallowed / ghosted.
 * Linear ticket on buried / ghosted.
 * GitHub pleat-ledger of cloth events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Aside (wing desk / preamble side-channel). Aside is preamble
 * vs answer channel; Pleat is mid-turn prose swallowed by the
 * tool fold.
 * NOT Coda (splice desk / last text block). Coda concatenates every
 * block vs last-block illusion; Pleat is UI fold hiding
 * between-tool prose that already exists.
 * NOT Chad (hanging-chad AskUserQuestion phantom selection).
 * NOT Blot (darkroom / unreadable image kills later turns).
 * NOT Scant / Kist / Wraith / Gasket / Damper / Cote / Larder /
 * Tappet / Chute / Tain / Husk / Snib / Veto / Assay / Wicket /
 * Sigil / Stencil / Suture / Reed / Fathom / Hasp / Parity /
 * Reveille / Quench / Scrim / Knock.
 * Different problem: desktop fold hides mid-turn answers.
 * Different UI: tailor pressing board / accordion pleats / chalk
 * lines / fabric grain — NOT timber yard, NOT ballot, NOT coffin,
 * NOT steam flange.
 * Different idle: flat.
 */

export const VERDICTS = Object.freeze([
  "flat",
  "pleated",
  "buried",
  "folded",
  "swallowed",
  "midturn",
  "chrome",
  "fragment",
  "ghosted",
  "aired",
]);
export const IDLE_WORD = "flat";
export const SLACK_VERDICTS = Object.freeze([
  "pleated",
  "buried",
  "swallowed",
  "ghosted",
]);
export const LINEAR_VERDICTS = Object.freeze(["buried", "ghosted"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

/** Demo copy only. Primary #90425 numbered-list repro. */
export const DEMO_MIDTURN_PROSE = [
  "1. Open the settings panel",
  "2. Disable the experimental flag",
  "3. Restart the app",
  "4. Confirm the change persisted",
].join("\n");
export const DEMO_VISIBLE_FRAGMENT = "4. Confirm the change persisted";
export const DEMO_EXPLANATION =
  "The race happens because the tool fold collapses any assistant text written between tool_use blocks.";
export const DEMO_TRAILING_STATUS = "Done.";
export const DEMO_RAN_N = "Ran 3 commands";

const FORBIDDEN_IDLE = Object.freeze([
  "pleat",
  "empty",
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
  "chad",
  "scant",
  "aside",
  "coda",
  "blot",
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
  "knock",
  "kist",
  "wraith",
  "gasket",
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

function hasMidTurnProse(probe) {
  return asText(probe.midTurnProse).trim() !== "";
}

export function emptyProbe() {
  return {
    midTurnProse: "",
    foldCollapsed: false,
    requestedExplanation: false,
    explanationInTranscript: false,
    explanationHiddenInFold: false,
    toolChromeOnly: false,
    finalFragmentOnly: false,
    numberedListStartsMid: false,
    proseBetweenToolUse: false,
    ranNCommandsVisible: false,
    noHintOfHiddenProse: false,
    trailingStatusOnly: false,
    modelBelievesAnswered: false,
    userNeverSaw: false,
    foldExpanded: false,
    proseRecovered: false,
    midTurnProseVisible: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "flat-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const cloth = src.cloth && typeof src.cloth === "object" ? src.cloth : {};
  const board = src.board && typeof src.board === "object" ? src.board : {};
  const fold = src.fold && typeof src.fold === "object" ? src.fold : {};
  const ticket = src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const pick = (key) => src[key] ?? cloth[key] ?? board[key] ?? fold[key] ?? ticket[key];
  return {
    ...emptyProbe(),
    midTurnProse: asText(pick("midTurnProse")),
    foldCollapsed: asBool(pick("foldCollapsed")),
    requestedExplanation: asBool(pick("requestedExplanation")),
    explanationInTranscript: asBool(pick("explanationInTranscript")),
    explanationHiddenInFold: asBool(pick("explanationHiddenInFold")),
    toolChromeOnly: asBool(pick("toolChromeOnly")),
    finalFragmentOnly: asBool(pick("finalFragmentOnly")),
    numberedListStartsMid: asBool(pick("numberedListStartsMid")),
    proseBetweenToolUse: asBool(pick("proseBetweenToolUse")),
    ranNCommandsVisible: asBool(pick("ranNCommandsVisible")),
    noHintOfHiddenProse: asBool(pick("noHintOfHiddenProse")),
    trailingStatusOnly: asBool(pick("trailingStatusOnly")),
    modelBelievesAnswered: asBool(pick("modelBelievesAnswered")),
    userNeverSaw: asBool(pick("userNeverSaw")),
    foldExpanded: asBool(pick("foldExpanded")),
    proseRecovered: asBool(pick("proseRecovered")),
    midTurnProseVisible: asBool(pick("midTurnProseVisible")),
    observed: asBool(src.observed ?? cloth.observed ?? board.observed ?? fold.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? cloth.source ?? board.source ?? fold.source),
    issue: asIssue(src.issue ?? cloth.issue ?? board.issue ?? fold.issue),
    scored: asBool(src.scored ?? cloth.scored ?? board.scored ?? fold.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !hasMidTurnProse(next) &&
    !next.foldCollapsed &&
    !next.requestedExplanation &&
    !next.explanationInTranscript &&
    !next.explanationHiddenInFold &&
    !next.toolChromeOnly &&
    !next.finalFragmentOnly &&
    !next.numberedListStartsMid &&
    !next.proseBetweenToolUse &&
    !next.ranNCommandsVisible &&
    !next.noHintOfHiddenProse &&
    !next.trailingStatusOnly &&
    !next.modelBelievesAnswered &&
    !next.userNeverSaw &&
    !next.foldExpanded &&
    !next.proseRecovered &&
    !next.midTurnProseVisible &&
    !next.observed
  );
}

/**
 * First match wins. Idle flat is first. Aired (fold pressed open,
 * prose recovered) beats fault classes. Pleated — THE BUG — is
 * next so a primary #90425 cloth can carry a supporting cluster.
 * A rendered fold is not a hold. This is desktop mid-turn fold
 * collapse, not Aside preamble, not Coda last-block splice,
 * not Chad phantom selection.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "flat";
  if (next.foldExpanded && next.proseRecovered) return "aired";
  if (hasMidTurnProse(next) && next.foldCollapsed) return "pleated";
  if (
    next.requestedExplanation &&
    next.explanationInTranscript &&
    next.explanationHiddenInFold
  ) {
    return "buried";
  }
  if (next.numberedListStartsMid) return "swallowed";
  if (next.toolChromeOnly && next.finalFragmentOnly) return "folded";
  if (next.proseBetweenToolUse) return "midturn";
  if (next.ranNCommandsVisible && next.noHintOfHiddenProse) return "chrome";
  if (next.trailingStatusOnly) return "fragment";
  if (next.modelBelievesAnswered && next.userNeverSaw) return "ghosted";
  if (next.midTurnProseVisible) return "flat";
  return "flat";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (
    next.requestedExplanation &&
    next.explanationInTranscript &&
    next.explanationHiddenInFold
  ) {
    add("buried");
  }
  if (next.toolChromeOnly && next.finalFragmentOnly) add("folded");
  if (next.numberedListStartsMid) add("swallowed");
  if (next.proseBetweenToolUse) add("midturn");
  if (next.ranNCommandsVisible && next.noHintOfHiddenProse) add("chrome");
  if (next.trailingStatusOnly) add("fragment");
  if (next.modelBelievesAnswered && next.userNeverSaw) add("ghosted");
  if (next.foldExpanded && next.proseRecovered) add("aired");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "pleated") {
    return "● Pleated · assistant text between tool calls collapsed under Ran N commands";
  }
  if (kind === "buried") {
    return "● Buried · requested explanation exists in transcript but hidden in fold";
  }
  if (kind === "folded") {
    return "● Folded · turn shows tool chrome + final fragment only";
  }
  if (kind === "swallowed") {
    return "● Swallowed · numbered list appears to start mid-sequence · earlier items in fold";
  }
  if (kind === "midturn") {
    return "● Midturn · prose written between tool_use blocks · the dangerous zone";
  }
  if (kind === "chrome") {
    return "● Chrome · user sees Ran N commands with no hint of hidden prose";
  }
  if (kind === "fragment") {
    return "● Fragment · only trailing short status visible as the answer";
  }
  if (kind === "ghosted") {
    return "● Ghosted · model believes it answered · user never saw it";
  }
  if (kind === "aired") {
    return "● Aired · fold expanded · prose recovered to visible surface";
  }
  return "● Flat · pleat pressed open · prose visible · idle word is flat";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    hasMidTurnProse(next)
      ? "mid-turn prose present between tool calls"
      : "no mid-turn prose on this cloth",
  );
  reasons.push(
    next.foldCollapsed
      ? "fold collapsed under Ran N commands"
      : "fold is not collapsed",
  );
  reasons.push(
    next.requestedExplanation
      ? "user requested an explanation"
      : "no explanation was requested on this probe",
  );
  reasons.push(
    next.explanationInTranscript && next.explanationHiddenInFold
      ? "requested explanation exists in transcript but is hidden in the fold"
      : "explanation is not scored as hidden-in-fold",
  );
  reasons.push(
    next.toolChromeOnly && next.finalFragmentOnly
      ? "turn shows tool chrome and a final fragment only"
      : "cloth is not chrome-plus-fragment only",
  );
  reasons.push(
    next.numberedListStartsMid
      ? "numbered list appears to start mid-sequence (earlier items in fold)"
      : "numbered list is not scored as mid-sequence",
  );
  reasons.push(
    next.proseBetweenToolUse
      ? "prose written between tool_use blocks (the dangerous zone)"
      : "no between-tool_use prose flagged",
  );
  reasons.push(
    next.ranNCommandsVisible && next.noHintOfHiddenProse
      ? "user sees Ran N commands with no hint of hidden prose"
      : "Ran N chrome is not the scored surface",
  );
  reasons.push(
    next.trailingStatusOnly
      ? "only trailing short status visible as the answer"
      : "trailing status is not the only visible answer",
  );
  if (next.modelBelievesAnswered && next.userNeverSaw) {
    reasons.push("model believes it answered; user never saw it (silent both sides)");
  }
  if (next.foldExpanded && next.proseRecovered) {
    reasons.push("fold expanded; prose recovered to the visible surface");
  }
  if (next.midTurnProseVisible) {
    reasons.push("mid-turn prose visible outside any fold");
  }
  if (next.observed) {
    reasons.push("Shop checked the cloth: fold, chrome, fragment, mid-turn prose");
  }
  reasons.push("a rendered fold is not a hold");
  reasons.push(
    "NOT Aside (preamble side-channel) / Coda (last-block splice) / Chad (phantom selection) / Blot / leftover woodworking / millimetre-slider",
  );
  if (kind === "flat") {
    reasons.push("pleat pressed open or desk idle; idle word is flat");
  }
  if (kind === "pleated") {
    reasons.push(
      "PRIMARY #90425: Desktop app collapses assistant text written between tool calls; substantive answers silently hidden under Ran N commands",
    );
  }
  if (kind === "buried") {
    reasons.push(
      "PRIMARY #90425 repro: requested explanation exists in the transcript but is hidden entirely in the fold",
    );
  }
  if (kind === "folded") {
    reasons.push("turn surface is tool chrome plus a final fragment; the rest is in the fold");
  }
  if (kind === "swallowed") {
    reasons.push(
      "PRIMARY #90425 repro: numbered list appears to start at 4; earlier items collapsed under Ran N commands",
    );
  }
  if (kind === "midturn") {
    reasons.push("prose written between tool_use blocks is the dangerous zone");
  }
  if (kind === "chrome") {
    reasons.push("user sees Ran N commands with no hint that collapsed prose exists");
  }
  if (kind === "fragment") {
    reasons.push("only the trailing short status is visible as the answer");
  }
  if (kind === "ghosted") {
    reasons.push("model believes it answered; user never saw it; silent both sides");
  }
  if (kind === "aired") {
    reasons.push("fold expanded / prose recovered to the visible surface; healthy hold");
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

export function flatOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "flat";
}

export function pleatedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "pleated";
}

export function buriedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "buried";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], flat, pleated, buried }
 * Deterministic. First match wins. Idle flat first.
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
    flat: flatOf(next, verdict),
    pleated: pleatedOf(next, verdict),
    buried: buriedOf(next, verdict),
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
    midTurnProse: pick("midTurnProse"),
    foldCollapsed: pick("foldCollapsed"),
    requestedExplanation: pick("requestedExplanation"),
    explanationInTranscript: pick("explanationInTranscript"),
    explanationHiddenInFold: pick("explanationHiddenInFold"),
    toolChromeOnly: pick("toolChromeOnly"),
    finalFragmentOnly: pick("finalFragmentOnly"),
    numberedListStartsMid: pick("numberedListStartsMid"),
    proseBetweenToolUse: pick("proseBetweenToolUse"),
    ranNCommandsVisible: pick("ranNCommandsVisible"),
    noHintOfHiddenProse: pick("noHintOfHiddenProse"),
    trailingStatusOnly: pick("trailingStatusOnly"),
    modelBelievesAnswered: pick("modelBelievesAnswered"),
    userNeverSaw: pick("userNeverSaw"),
    foldExpanded: pick("foldExpanded"),
    proseRecovered: pick("proseRecovered"),
    midTurnProseVisible: pick("midTurnProseVisible"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    cloth: fromFields.cloth,
    board: fromFields.board,
    fold: fromFields.fold,
    ticket: fromFields.ticket,
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
    product: "pleat",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    flat: scored.flat,
    pleated: scored.pleated,
    buried: scored.buried,
    cluster: scored.cluster,
    clothFlat: verdict === "flat",
    clothPleated: verdict === "pleated",
    clothBuried: verdict === "buried",
    clothFolded: verdict === "folded",
    clothSwallowed: verdict === "swallowed",
    clothMidturn: verdict === "midturn",
    clothChrome: verdict === "chrome",
    clothFragment: verdict === "fragment",
    clothGhosted: verdict === "ghosted",
    clothAired: verdict === "aired",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    midTurnProse: next.midTurnProse,
    foldCollapsed: next.foldCollapsed,
    requestedExplanation: next.requestedExplanation,
    explanationInTranscript: next.explanationInTranscript,
    explanationHiddenInFold: next.explanationHiddenInFold,
    toolChromeOnly: next.toolChromeOnly,
    finalFragmentOnly: next.finalFragmentOnly,
    numberedListStartsMid: next.numberedListStartsMid,
    proseBetweenToolUse: next.proseBetweenToolUse,
    ranNCommandsVisible: next.ranNCommandsVisible,
    noHintOfHiddenProse: next.noHintOfHiddenProse,
    trailingStatusOnly: next.trailingStatusOnly,
    modelBelievesAnswered: next.modelBelievesAnswered,
    userNeverSaw: next.userNeverSaw,
    foldExpanded: next.foldExpanded,
    proseRecovered: next.proseRecovered,
    midTurnProseVisible: next.midTurnProseVisible,
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
      midTurnProse: extras.midTurnProse || "",
      foldCollapsed: Boolean(extras.foldCollapsed),
      requestedExplanation: Boolean(extras.requestedExplanation),
      explanationInTranscript: Boolean(extras.explanationInTranscript),
      explanationHiddenInFold: Boolean(extras.explanationHiddenInFold),
      toolChromeOnly: Boolean(extras.toolChromeOnly),
      finalFragmentOnly: Boolean(extras.finalFragmentOnly),
      numberedListStartsMid: Boolean(extras.numberedListStartsMid),
      proseBetweenToolUse: Boolean(extras.proseBetweenToolUse),
      ranNCommandsVisible: Boolean(extras.ranNCommandsVisible),
      noHintOfHiddenProse: Boolean(extras.noHintOfHiddenProse),
      trailingStatusOnly: Boolean(extras.trailingStatusOnly),
      modelBelievesAnswered: Boolean(extras.modelBelievesAnswered),
      userNeverSaw: Boolean(extras.userNeverSaw),
      foldExpanded: Boolean(extras.foldExpanded),
      proseRecovered: Boolean(extras.proseRecovered),
      midTurnProseVisible: Boolean(extras.midTurnProseVisible),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / shut. Pleat pressed open. Nothing scored. */
export function seedFlat() {
  return seedProbe("flat", "board", {
    session: "flat",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90425 pleated.
 * Assistant text between tool calls collapsed under Ran N
 * commands. Cluster: buried, folded, swallowed, midturn, chrome,
 * fragment, ghosted.
 */
export function seed90425Pleated() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-pleated",
    midTurnProse: DEMO_MIDTURN_PROSE,
    foldCollapsed: true,
    requestedExplanation: true,
    explanationInTranscript: true,
    explanationHiddenInFold: true,
    toolChromeOnly: true,
    finalFragmentOnly: true,
    numberedListStartsMid: true,
    proseBetweenToolUse: true,
    ranNCommandsVisible: true,
    noHintOfHiddenProse: true,
    trailingStatusOnly: true,
    modelBelievesAnswered: true,
    userNeverSaw: true,
  });
}

/** Buried: requested explanation exists in transcript, hidden in fold. */
export function seedBuried() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-buried",
    requestedExplanation: true,
    explanationInTranscript: true,
    explanationHiddenInFold: true,
    midTurnProse: DEMO_EXPLANATION,
  });
}

/** Folded: tool chrome + final fragment only. */
export function seedFolded() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-folded",
    toolChromeOnly: true,
    finalFragmentOnly: true,
  });
}

/** Swallowed: numbered list appears to start mid-sequence. */
export function seedSwallowed() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-swallowed",
    numberedListStartsMid: true,
    midTurnProse: DEMO_VISIBLE_FRAGMENT,
  });
}

/** Midturn: prose written between tool_use blocks. */
export function seedMidturn() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-midturn",
    proseBetweenToolUse: true,
    midTurnProse: DEMO_EXPLANATION,
  });
}

/** Chrome: Ran N commands with no hint of hidden prose. */
export function seedChrome() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-chrome",
    ranNCommandsVisible: true,
    noHintOfHiddenProse: true,
  });
}

/** Fragment: only trailing short status visible as the answer. */
export function seedFragment() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-fragment",
    trailingStatusOnly: true,
    midTurnProse: DEMO_TRAILING_STATUS,
  });
}

/** Ghosted: model believes it answered; user never saw it. */
export function seedGhosted() {
  return seedProbe(90425, "anthropics/claude-code#90425", {
    session: "90425-ghosted",
    modelBelievesAnswered: true,
    userNeverSaw: true,
  });
}

/** Aired: fold expanded; prose recovered to visible surface. */
export function seedAired() {
  return seedProbe("aired", "board", {
    session: "aired",
    issue: null,
    foldExpanded: true,
    proseRecovered: true,
    midTurnProse: DEMO_MIDTURN_PROSE,
    midTurnProseVisible: true,
  });
}

const SEEDS = {
  flat: seedFlat,
  pleated: seed90425Pleated,
  90425: seed90425Pleated,
  "90425-pleated": seed90425Pleated,
  buried: seedBuried,
  "90425-buried": seedBuried,
  folded: seedFolded,
  "90425-folded": seedFolded,
  swallowed: seedSwallowed,
  "90425-swallowed": seedSwallowed,
  midturn: seedMidturn,
  "90425-midturn": seedMidturn,
  chrome: seedChrome,
  "90425-chrome": seedChrome,
  fragment: seedFragment,
  "90425-fragment": seedFragment,
  ghosted: seedGhosted,
  "90425-ghosted": seedGhosted,
  aired: seedAired,
};

function pleatedStrike(session) {
  return {
    ...emptyProbe(),
    midTurnProse: DEMO_MIDTURN_PROSE,
    foldCollapsed: true,
    requestedExplanation: true,
    explanationInTranscript: true,
    explanationHiddenInFold: true,
    toolChromeOnly: true,
    finalFragmentOnly: true,
    numberedListStartsMid: true,
    proseBetweenToolUse: true,
    ranNCommandsVisible: true,
    noHintOfHiddenProse: true,
    trailingStatusOnly: true,
    modelBelievesAnswered: true,
    userNeverSaw: true,
    session: session || "pleated",
    source: "board",
    issue: 90425,
    scored: true,
  };
}

function airedStrike(session) {
  return {
    ...emptyProbe(),
    foldExpanded: true,
    proseRecovered: true,
    midTurnProse: DEMO_MIDTURN_PROSE,
    midTurnProseVisible: true,
    session: session || "aired",
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

  if (verb === "shut" || verb === "flatten" || verb === "flat") {
    return pack("flat", emptyProbe(), { ...action, action: verb === "flatten" ? "shut" : verb });
  }

  if (verb === "crease" || verb === "fold" || verb === "pinch") {
    probe = pleatedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "crease" });
  }

  if (verb === "air" || verb === "air-out" || verb === "unpleat") {
    probe = airedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "air" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "chalk") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" || verb === "chalk" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "iron" || verb === "admit" || verb === "score" || verb === "stamp") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "iron" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
