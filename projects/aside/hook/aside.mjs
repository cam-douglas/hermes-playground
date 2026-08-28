/**
 * Aside — theatrical side-channel / wing desk for Claude Code /btw
 * silent truncation. A preamble is not an answer. Score the side
 * channel or admit heard.
 *
 * Verdicts: heard | preamble | muted | poisoned | toolish | inherited
 *           | ghost | sticky | noticed | forked
 * Idle word is heard. Never the product name. Never clear. Never paired.
 * Never kernel. Never latched. Never intact. Never sealed.
 *
 * Slack preamble/muted/poisoned/toolish/inherited/ghost/sticky/forked alarm.
 * Linear ticket on preamble / poisoned.
 * GitHub aside-ledger issue on every scored probe.
 *
 * This is NOT Coda (silent dropped assistant text in the MAIN turn).
 * NOT Suture (stream-tear / partial MAIN turn).
 * NOT Chute (secret handoff inbound). NOT Scrim (outbound DLP).
 * NOT Knock, Quench, Hasp, Parity, Reveille, Reed, Fathom, Blot,
 * Stencil, Sigil, Wicket, Assay, Veto, Snib, Husk, Tain.
 * Different problem: side-channel /btw tool-forbidden inheritance +
 * notice-gated-on-empty-text + sticky poison + ghost transcript.
 */

export const VERDICTS = Object.freeze([
  "heard",
  "preamble",
  "muted",
  "poisoned",
  "toolish",
  "inherited",
  "ghost",
  "sticky",
  "noticed",
  "forked",
]);
export const IDLE_WORD = "heard";
export const SLACK_VERDICTS = Object.freeze([
  "preamble",
  "muted",
  "poisoned",
  "toolish",
  "inherited",
  "ghost",
  "sticky",
  "forked",
]);
export const LINEAR_VERDICTS = Object.freeze(["preamble", "poisoned"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

/** Demo copy only. The classic #90314 preamble. */
export const DEMO_PREAMBLE = "Let me check that file.";
export const DEMO_QUESTION =
  "what does the authentication middleware in this repo do?";
export const DEMO_NOTICE =
  "(The model tried to call a tool instead of answering directly. Try rephrasing or ask in the main conversation.)";
export const DEMO_ANSWER =
  "Auth middleware verifies the session cookie and attaches req.user.";

const CHANNELS = new Set(["", "btw", "main", "fork"]);

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

function asChannel(value) {
  const next = asText(value).trim();
  return CHANNELS.has(next) ? next : asText(value).trim();
}

export function emptyProbe() {
  return {
    channel: "",
    question: "",
    preambleText: "",
    answerText: "",
    hasText: false,
    zeroText: false,
    fullAnswer: false,
    silentEnd: false,
    toolsForbidden: false,
    inheritedToolFirst: false,
    toolAttempted: false,
    toolName: "",
    noticeShown: false,
    noticeSuppressed: false,
    priorTruncation: false,
    laterBtwFails: false,
    sessionSticky: false,
    inTranscript: false,
    skipTranscript: false,
    ghost: false,
    forkResubmits: false,
    btwHistoryAppended: false,
    maxTurns: 0,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "heard-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.side && typeof src.side === "object" ? src.side : {};
  return {
    ...emptyProbe(),
    channel: asChannel(src.channel ?? nested.channel),
    question: asText(src.question ?? nested.question),
    preambleText: asText(src.preambleText ?? nested.preamble),
    answerText: asText(src.answerText ?? nested.answer),
    hasText: asBool(src.hasText ?? nested.hasText),
    zeroText: asBool(src.zeroText ?? nested.zeroText),
    fullAnswer: asBool(src.fullAnswer ?? nested.fullAnswer),
    silentEnd: asBool(src.silentEnd ?? nested.silentEnd),
    toolsForbidden: asBool(src.toolsForbidden ?? nested.toolsForbidden),
    inheritedToolFirst: asBool(
      src.inheritedToolFirst ?? nested.inheritedToolFirst,
    ),
    toolAttempted: asBool(src.toolAttempted ?? nested.toolAttempted),
    toolName: asText(src.toolName ?? nested.toolName),
    noticeShown: asBool(src.noticeShown ?? nested.noticeShown),
    noticeSuppressed: asBool(src.noticeSuppressed ?? nested.noticeSuppressed),
    priorTruncation: asBool(src.priorTruncation ?? nested.priorTruncation),
    laterBtwFails: asBool(src.laterBtwFails ?? nested.laterBtwFails),
    sessionSticky: asBool(src.sessionSticky ?? nested.sessionSticky),
    inTranscript: asBool(src.inTranscript ?? nested.inTranscript),
    skipTranscript: asBool(src.skipTranscript ?? nested.skipTranscript),
    ghost: asBool(src.ghost ?? nested.ghost),
    forkResubmits: asBool(src.forkResubmits ?? nested.forkResubmits),
    btwHistoryAppended: asBool(
      src.btwHistoryAppended ?? nested.btwHistoryAppended,
    ),
    maxTurns: Number.isFinite(Number(src.maxTurns ?? nested.maxTurns))
      ? Number(src.maxTurns ?? nested.maxTurns)
      : 0,
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source),
    issue: asIssue(src.issue),
    scored: asBool(src.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.channel &&
    !next.question &&
    !next.preambleText &&
    !next.answerText &&
    !next.hasText &&
    !next.zeroText &&
    !next.fullAnswer &&
    !next.silentEnd &&
    !next.toolsForbidden &&
    !next.inheritedToolFirst &&
    !next.toolAttempted &&
    !next.toolName &&
    !next.noticeShown &&
    !next.noticeSuppressed &&
    !next.priorTruncation &&
    !next.laterBtwFails &&
    !next.sessionSticky &&
    !next.inTranscript &&
    !next.skipTranscript &&
    !next.ghost &&
    !next.forkResubmits &&
    !next.btwHistoryAppended &&
    !next.maxTurns
  );
}

export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "heard";
  if (next.forkResubmits) return "forked";
  if (next.laterBtwFails && next.priorTruncation) return "poisoned";
  if (next.sessionSticky) return "sticky";
  if (next.preambleText && next.silentEnd) return "preamble";
  if (next.noticeSuppressed && next.hasText && !next.zeroText) return "muted";
  if (next.noticeShown && next.zeroText) return "noticed";
  if (next.ghost) return "ghost";
  if (next.toolAttempted) return "toolish";
  if (next.inheritedToolFirst) return "inherited";
  if (next.fullAnswer && !next.toolAttempted) return "heard";
  return "heard";
}

export function feedOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  if (kind === "preamble") {
    const line = next.preambleText || DEMO_PREAMBLE;
    return `● Preamble · ${line} · then silent end · no notice`;
  }
  if (kind === "muted") {
    return "● Muted · any text suppressed the tool-notice";
  }
  if (kind === "poisoned") {
    return "● Poisoned · prior truncation in btwHistory · later /btw also fails";
  }
  if (kind === "toolish") {
    const tool = next.toolName || "a tool";
    return `● Toolish · model attempted ${tool} in the side channel`;
  }
  if (kind === "inherited") {
    return "● Inherited · tool-first CLAUDE.md / SessionStart infected the wing";
  }
  if (kind === "ghost") {
    return "● Ghost · skipTranscript · no /btw artifact";
  }
  if (kind === "sticky") {
    return "● Sticky · session-wide all-or-nothing";
  }
  if (kind === "noticed") {
    return "● Noticed · zero-text path showed the tool-notice";
  }
  if (kind === "forked") {
    return "● Forked · /btw → f re-submits the original";
  }
  return "● Heard · side answer landed · wing quiet";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  if (next.channel) reasons.push(`channel ${next.channel}`);
  else reasons.push("channel unset");
  reasons.push(
    next.toolsForbidden
      ? "/btw forbids tools"
      : "tools not forbidden on this channel",
  );
  if (next.inheritedToolFirst) {
    reasons.push("tool-first CLAUDE.md / SessionStart inherited by the side agent");
  }
  if (next.question) reasons.push(`question ${next.question}`);
  if (next.preambleText) reasons.push(`preamble ${next.preambleText}`);
  if (next.answerText) reasons.push("full side answer present");
  if (next.hasText) reasons.push("response has text");
  if (next.zeroText) reasons.push("response has zero text");
  if (next.silentEnd) reasons.push("exchange ended with no answer");
  if (next.toolAttempted) {
    reasons.push(
      next.toolName
        ? `model attempted ${next.toolName}`
        : "model attempted a tool in the side channel",
    );
  }
  if (next.noticeShown) reasons.push("tool-notice shown");
  if (next.noticeSuppressed) {
    reasons.push("tool-notice suppressed because any text existed");
  }
  if (next.priorTruncation) reasons.push("prior /btw was truncated");
  if (next.laterBtwFails) reasons.push("later /btw also fails");
  if (next.sessionSticky) reasons.push("session-wide all-or-nothing latch");
  if (next.skipTranscript) reasons.push("skipTranscript: true");
  if (!next.inTranscript && next.channel === "btw") {
    reasons.push("no transcript artifact for the /btw exchange");
  }
  if (next.ghost) reasons.push("ghost: users cannot self-diagnose");
  if (next.forkResubmits) reasons.push("fork on completed /btw re-submits original");
  if (next.btwHistoryAppended) {
    reasons.push("truncated exchange appended to btwHistory");
  }
  if (next.maxTurns === 1) reasons.push("maxTurns: 1 — no turn after a denied tool");
  if (kind === "heard") {
    reasons.push("real side answer landed; wing quiet");
  }
  if (kind === "preamble") {
    reasons.push("a preamble is not an answer (THE BUG from #90314)");
  }
  if (kind === "muted") {
    reasons.push("notice is gated on empty text; any preamble suppresses it");
  }
  if (kind === "poisoned") {
    reasons.push("truncated turns poison subsequent /btw in that session");
  }
  if (kind === "toolish") {
    reasons.push("side channel forbids tools; the model called one anyway");
  }
  if (kind === "inherited") {
    reasons.push("tool-first context infected the wing before ANY response");
  }
  if (kind === "ghost") {
    reasons.push("/btw exchanges are never written to the session transcript");
  }
  if (kind === "sticky") {
    reasons.push("affected sessions fail every /btw; clean sessions succeed every /btw");
  }
  if (kind === "noticed") {
    reasons.push("zero-text path correctly showed the tool-notice (good path)");
  }
  if (kind === "forked") {
    reasons.push("fork on completed /btw re-submits original (#86108)");
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function readAction(payload = {}) {
  const nested =
    payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    channel: pick("channel"),
    question: pick("question"),
    preambleText: pick("preambleText"),
    answerText: pick("answerText"),
    hasText: pick("hasText"),
    zeroText: pick("zeroText"),
    fullAnswer: pick("fullAnswer"),
    silentEnd: pick("silentEnd"),
    toolsForbidden: pick("toolsForbidden"),
    inheritedToolFirst: pick("inheritedToolFirst"),
    toolAttempted: pick("toolAttempted"),
    toolName: pick("toolName"),
    noticeShown: pick("noticeShown"),
    noticeSuppressed: pick("noticeSuppressed"),
    priorTruncation: pick("priorTruncation"),
    laterBtwFails: pick("laterBtwFails"),
    sessionSticky: pick("sessionSticky"),
    inTranscript: pick("inTranscript"),
    skipTranscript: pick("skipTranscript"),
    ghost: pick("ghost"),
    forkResubmits: pick("forkResubmits"),
    btwHistoryAppended: pick("btwHistoryAppended"),
    maxTurns: pick("maxTurns"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    side: fromFields.side,
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
  return {
    ok: true,
    product: "aside",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    slack: SLACK_VERDICTS.includes(verdict),
    wingQuiet: verdict === "heard",
    wingPreamble: verdict === "preamble",
    wingGhost: verdict === "ghost",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    channel: next.channel,
    question: next.question,
    preambleText: next.preambleText,
    answerText: next.answerText,
    hasText: next.hasText,
    zeroText: next.zeroText,
    fullAnswer: next.fullAnswer,
    silentEnd: next.silentEnd,
    toolsForbidden: next.toolsForbidden,
    inheritedToolFirst: next.inheritedToolFirst,
    toolAttempted: next.toolAttempted,
    toolName: next.toolName,
    noticeShown: next.noticeShown,
    noticeSuppressed: next.noticeSuppressed,
    priorTruncation: next.priorTruncation,
    laterBtwFails: next.laterBtwFails,
    sessionSticky: next.sessionSticky,
    inTranscript: next.inTranscript,
    skipTranscript: next.skipTranscript,
    ghost: next.ghost,
    forkResubmits: next.forkResubmits,
    btwHistoryAppended: next.btwHistoryAppended,
    maxTurns: next.maxTurns,
    feed: feedOf(next, verdict),
    reasons: reasonsOf(next, verdict),
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
      channel: extras.channel || "",
      question: extras.question || "",
      preambleText: extras.preambleText || "",
      answerText: extras.answerText || "",
      hasText: Boolean(extras.hasText),
      zeroText: Boolean(extras.zeroText),
      fullAnswer: Boolean(extras.fullAnswer),
      silentEnd: Boolean(extras.silentEnd),
      toolsForbidden: Boolean(extras.toolsForbidden),
      inheritedToolFirst: Boolean(extras.inheritedToolFirst),
      toolAttempted: Boolean(extras.toolAttempted),
      toolName: extras.toolName || "",
      noticeShown: Boolean(extras.noticeShown),
      noticeSuppressed: Boolean(extras.noticeSuppressed),
      priorTruncation: Boolean(extras.priorTruncation),
      laterBtwFails: Boolean(extras.laterBtwFails),
      sessionSticky: Boolean(extras.sessionSticky),
      inTranscript: Boolean(extras.inTranscript),
      skipTranscript: Boolean(extras.skipTranscript),
      ghost: Boolean(extras.ghost),
      forkResubmits: Boolean(extras.forkResubmits),
      btwHistoryAppended: Boolean(extras.btwHistoryAppended),
      maxTurns: extras.maxTurns || 0,
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** PRIMARY #90314: short preamble then silent end. THE BUG. */
export function seed90314Preamble() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-preamble",
    channel: "btw",
    question: DEMO_QUESTION,
    preambleText: DEMO_PREAMBLE,
    hasText: true,
    silentEnd: true,
    toolsForbidden: true,
    inheritedToolFirst: true,
    toolAttempted: true,
    toolName: "Read",
    noticeSuppressed: true,
    skipTranscript: true,
    btwHistoryAppended: true,
    maxTurns: 1,
  });
}

/** Healthy full side answer; no tool attempt. */
export function seedHeard() {
  return seedProbe("heard", "btw", {
    session: "heard",
    issue: null,
    channel: "btw",
    question: DEMO_QUESTION,
    answerText: DEMO_ANSWER,
    hasText: true,
    fullAnswer: true,
    toolsForbidden: true,
  });
}

/** Notice suppressed because any text existed. */
export function seedMuted() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-muted",
    channel: "btw",
    question: DEMO_QUESTION,
    hasText: true,
    toolsForbidden: true,
    toolAttempted: true,
    toolName: "Read",
    noticeSuppressed: true,
    skipTranscript: true,
    maxTurns: 1,
  });
}

/** Prior truncation sticks; later /btw also fails. */
export function seedPoisoned() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-poisoned",
    channel: "btw",
    question: DEMO_QUESTION,
    preambleText: DEMO_PREAMBLE,
    hasText: true,
    silentEnd: true,
    toolsForbidden: true,
    inheritedToolFirst: true,
    toolAttempted: true,
    noticeSuppressed: true,
    priorTruncation: true,
    laterBtwFails: true,
    skipTranscript: true,
    btwHistoryAppended: true,
    maxTurns: 1,
  });
}

/** Model attempted a tool in the side channel. */
export function seedToolish() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-toolish",
    channel: "btw",
    question: DEMO_QUESTION,
    toolsForbidden: true,
    toolAttempted: true,
    toolName: "Read",
    skipTranscript: true,
    maxTurns: 1,
  });
}

/** Tool-first CLAUDE.md / SessionStart infected the side agent. */
export function seedInherited() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-inherited",
    channel: "btw",
    question: DEMO_QUESTION,
    toolsForbidden: true,
    inheritedToolFirst: true,
    skipTranscript: true,
  });
}

/** No transcript artifact for the /btw exchange. */
export function seedGhost() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-ghost",
    channel: "btw",
    question: DEMO_QUESTION,
    toolsForbidden: true,
    skipTranscript: true,
    ghost: true,
  });
}

/** Session-wide all-or-nothing failure mode. */
export function seedSticky() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-sticky",
    channel: "btw",
    question: DEMO_QUESTION,
    toolsForbidden: true,
    inheritedToolFirst: true,
    sessionSticky: true,
    skipTranscript: true,
  });
}

/** Zero-text path correctly showed the tool-notice (good path). */
export function seedNoticed() {
  return seedProbe(90314, "anthropics/claude-code#90314", {
    session: "90314-noticed",
    channel: "btw",
    question: DEMO_QUESTION,
    zeroText: true,
    toolsForbidden: true,
    toolAttempted: true,
    toolName: "Read",
    noticeShown: true,
    skipTranscript: true,
    maxTurns: 1,
  });
}

/** #86108: fork on completed /btw re-submits original. */
export function seed86108Forked() {
  return seedProbe(86108, "anthropics/claude-code#86108", {
    session: "86108-forked",
    channel: "fork",
    question: DEMO_QUESTION,
    answerText: DEMO_ANSWER,
    hasText: true,
    fullAnswer: true,
    toolsForbidden: true,
    forkResubmits: true,
  });
}

const SEEDS = {
  heard: seedHeard,
  preamble: seed90314Preamble,
  90314: seed90314Preamble,
  "90314-preamble": seed90314Preamble,
  muted: seedMuted,
  "90314-muted": seedMuted,
  poisoned: seedPoisoned,
  "90314-poisoned": seedPoisoned,
  toolish: seedToolish,
  "90314-toolish": seedToolish,
  inherited: seedInherited,
  "90314-inherited": seedInherited,
  ghost: seedGhost,
  "90314-ghost": seedGhost,
  sticky: seedSticky,
  "90314-sticky": seedSticky,
  noticed: seedNoticed,
  "90314-noticed": seedNoticed,
  forked: seed86108Forked,
  86108: seed86108Forked,
  "86108-forked": seed86108Forked,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function applyAsk(probe) {
  const question = probe.question || DEMO_QUESTION;
  const infected =
    probe.inheritedToolFirst || probe.sessionSticky || probe.priorTruncation;
  if (infected) {
    return {
      ...probe,
      channel: "btw",
      question,
      preambleText: DEMO_PREAMBLE,
      answerText: "",
      hasText: true,
      zeroText: false,
      fullAnswer: false,
      silentEnd: true,
      toolsForbidden: true,
      inheritedToolFirst: true,
      toolAttempted: true,
      toolName: probe.toolName || "Read",
      noticeShown: false,
      noticeSuppressed: true,
      skipTranscript: true,
      inTranscript: false,
      btwHistoryAppended: true,
      maxTurns: 1,
      scored: true,
    };
  }
  return {
    ...probe,
    channel: "btw",
    question,
    preambleText: "",
    answerText: DEMO_ANSWER,
    hasText: true,
    zeroText: false,
    fullAnswer: true,
    silentEnd: false,
    toolsForbidden: true,
    inheritedToolFirst: false,
    toolAttempted: false,
    toolName: "",
    noticeShown: false,
    noticeSuppressed: false,
    priorTruncation: false,
    laterBtwFails: false,
    sessionSticky: false,
    ghost: false,
    forkResubmits: false,
    btwHistoryAppended: false,
    skipTranscript: true,
    inTranscript: false,
    maxTurns: 1,
    scored: true,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear") {
    return pack("heard", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "ask") {
    probe = applyAsk(probe);
    return pack(classify(probe), probe, { ...action, action: "ask" });
  }

  if (verb === "admit") {
    probe = { ...probe, scored: true };
    const verdict = classify(probe);
    return pack(verdict, probe, { ...action, action: "admit" });
  }

  if (verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: "score" });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
