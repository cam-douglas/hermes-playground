/**
 * Veto — palimpsest / court overlay for the Opus-5-only heron_brook
 * system-prompt injection that silently vetoes user-configured Agent
 * delegation. A standing CLAUDE.md is not a hold. An ack is not a hold.
 * The vendor edict sits as a translucent overlay on the user's own rule.
 * Lift the overlay. Name the class or admit upheld.
 *
 * Verdicts: upheld | shadowed | vetoed | misattributed | ghost | deadlock | silent | restored
 * Idle word is upheld. Never the product name. Never Fathom's "still".
 * Never Assay's "sterling".
 *
 * Fail-closed on vetoed / misattributed / deadlock.
 * Slack alarm on vetoed / misattributed / deadlock.
 * Linear silent-override incident on vetoed / misattributed.
 * GitHub ledger row on every scored probe.
 *
 * This is NOT Fathom (compaction drops standing rules). Veto is injection:
 * a server-gated section is concatenated into the system prompt with no
 * author label and outranks user CLAUDE.md.
 */

export const VERDICTS = Object.freeze([
  "upheld",
  "shadowed",
  "vetoed",
  "misattributed",
  "ghost",
  "deadlock",
  "silent",
  "restored",
]);
export const IDLE_WORD = "upheld";
export const FAIL_CLOSED = Object.freeze(["vetoed", "misattributed", "deadlock"]);
export const ALARM_VERDICTS = FAIL_CLOSED;
export const SLACK_VERDICTS = FAIL_CLOSED;
export const LINEAR_VERDICTS = Object.freeze(["vetoed", "misattributed"]);

export const AGENT_CLAMP =
  /Do not call the AgentTool unless the user requested it/i;
export const WORKFLOW_CLAMP =
  /Do not use workflows or deep-research unless the user requested it/i;
export const SECTION_NAME =
  /tengu_heron_brook|heron_brook|claude_code_canal_plateau_experiment|opus_5_prompt_bundle/i;
export const GHOST_TOOL = /AgentTool/;
export const SURFACE_TOOL = /\bAgent\b/;
export const OPUS5 =
  /opus[-_]?5|claude-opus-5|opus_5_prompt_bundle/i;
export const MANDATE =
  /subagents?\s+liberally|critic\s+subagent|dispatch\s+(?:a\s+)?(?:critic\s+)?subagent|use\s+(?:the\s+)?Agent\s+tool|spawn\s+(?:a\s+)?(?:critic\s+)?(?:sub)?agent|delegate\s+(?:to\s+)?(?:a\s+)?(?:sub)?agent|mandated\s+(?:validation\s+)?subagent|always\s+(?:use|call|dispatch|spawn).{0,40}(?:Agent|subagent)/i;
export const ATTRIBUTION =
  /per your instructions|your standing instruction|your CLAUDE\.md|in your CLAUDE\.md|your project instructions|your own (?:standing )?rule/i;
export const CLAUDE_BLAME =
  /your CLAUDE\.md|in your CLAUDE\.md|your project instructions/i;
export const STANDING_REQUEST =
  /(?:the\s+)?user(?:\s+has)?\s+(?:explicitly\s+)?requested.{0,80}(?:Agent(?:Tool)?|subagent|workflow|deep-research)|unless the user requested it/.source;

const STANDING_REQUEST_RE = new RegExp(
  "(?:the\\s+)?user(?:\\s+has)?\\s+(?:explicitly\\s+)?requested.{0,120}(?:Agent(?:Tool)?|subagent|workflow|deep-research)",
  "i",
);

export function emptyProbe() {
  return {
    model: "",
    systemPromptText: "",
    claudeMdText: "",
    skillText: "",
    observedAgentDispatches: 0,
    modelAttribution: "",
    parentWriteBlocked: false,
    additionalContext: "",
    capability: "",
    operatorSignaled: null,
    conflictResolved: false,
    overlayLifted: false,
    restored: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "upheld-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const base = emptyProbe();
  return {
    ...base,
    ...src,
    model: asText(src.model),
    systemPromptText: asText(src.systemPromptText),
    claudeMdText: asText(src.claudeMdText),
    skillText: asText(src.skillText),
    observedAgentDispatches: asCount(src.observedAgentDispatches),
    modelAttribution: asText(src.modelAttribution),
    parentWriteBlocked: Boolean(src.parentWriteBlocked),
    additionalContext: asText(src.additionalContext),
    capability: asText(src.capability),
    operatorSignaled: src.operatorSignaled == null ? null : Boolean(src.operatorSignaled),
    conflictResolved: Boolean(src.conflictResolved),
    overlayLifted: Boolean(src.overlayLifted),
    restored: Boolean(src.restored),
    session: asText(src.session),
    source: asText(src.source),
    issue: src.issue ?? null,
    scored: Boolean(src.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.model &&
    !next.systemPromptText &&
    !next.claudeMdText &&
    !next.skillText &&
    next.observedAgentDispatches === 0 &&
    !next.modelAttribution &&
    !next.parentWriteBlocked &&
    !next.additionalContext &&
    !next.capability &&
    !next.restored
  );
}

export function overlayPresent(probe = {}) {
  const next = cloneProbe(probe);
  const hay = `${next.systemPromptText}\n${next.capability}`;
  return (
    AGENT_CLAMP.test(hay) ||
    WORKFLOW_CLAMP.test(hay) ||
    SECTION_NAME.test(hay)
  );
}

export function namesGhostTool(probe = {}) {
  const next = cloneProbe(probe);
  return GHOST_TOOL.test(next.systemPromptText);
}

export function isOpus5Family(probe = {}) {
  const next = cloneProbe(probe);
  return (
    OPUS5.test(next.model) ||
    OPUS5.test(next.capability) ||
    /opus_5_prompt_bundle/i.test(next.systemPromptText)
  );
}

export function hasMandate(probe = {}) {
  const next = cloneProbe(probe);
  const hay = `${next.claudeMdText}\n${next.skillText}`;
  return MANDATE.test(hay);
}

export function userPolicyVisible(probe = {}) {
  const next = cloneProbe(probe);
  if (hasMandate(next)) return true;
  return Boolean(next.claudeMdText.trim() || next.skillText.trim());
}

export function hasMisattribution(probe = {}) {
  const next = cloneProbe(probe);
  if (!ATTRIBUTION.test(next.modelAttribution)) return false;
  const userText = `${next.claudeMdText}\n${next.skillText}`;
  const vendorLineInUser =
    AGENT_CLAMP.test(userText) || WORKFLOW_CLAMP.test(userText);
  return !vendorLineInUser;
}

export function blamesClaudeMd(probe = {}) {
  const next = cloneProbe(probe);
  return CLAUDE_BLAME.test(next.modelAttribution) && hasMisattribution(next);
}

export function hasStandingRequest(probe = {}) {
  const next = cloneProbe(probe);
  const hay = `${next.additionalContext}\n${next.systemPromptText}`;
  return STANDING_REQUEST_RE.test(hay) || Boolean(next.restored && next.additionalContext);
}

export function conditionSatisfied(probe = {}) {
  const next = cloneProbe(probe);
  if (!hasStandingRequest(next)) return false;
  return next.observedAgentDispatches > 0 || next.restored === true || next.conflictResolved === true
    ? true
    : STANDING_REQUEST_RE.test(next.additionalContext);
}

export function isRestored(probe = {}) {
  const next = cloneProbe(probe);
  return hasStandingRequest(next) && conditionSatisfied(next);
}

export function isDeadlock(probe = {}) {
  const next = cloneProbe(probe);
  return (
    overlayPresent(next) &&
    hasMandate(next) &&
    next.parentWriteBlocked === true &&
    next.observedAgentDispatches === 0 &&
    !isRestored(next)
  );
}

export function isVetoed(probe = {}) {
  const next = cloneProbe(probe);
  if (!overlayPresent(next) || !hasMandate(next)) return false;
  if (next.observedAgentDispatches > 0) return false;
  if (isRestored(next)) return false;
  if (!isOpus5Family(next)) return false;
  return true;
}

export function isMisattributed(probe = {}) {
  const next = cloneProbe(probe);
  if (!overlayPresent(next)) return false;
  return hasMisattribution(next);
}

export function isGhost(probe = {}) {
  const next = cloneProbe(probe);
  return namesGhostTool(next);
}

export function isSilent(probe = {}) {
  const next = cloneProbe(probe);
  if (!overlayPresent(next) || !hasMandate(next)) return false;
  if (next.observedAgentDispatches > 0) return false;
  if (isRestored(next)) return false;
  const signaled =
    next.operatorSignaled === true || Boolean(next.modelAttribution.trim());
  if (signaled) return false;
  if (isOpus5Family(next)) return false;
  return next.operatorSignaled === false || next.conflictResolved === true || !isOpus5Family(next);
}

export function isShadowed(probe = {}) {
  const next = cloneProbe(probe);
  return overlayPresent(next) && userPolicyVisible(next);
}

export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "upheld";
  if (isRestored(next)) return "restored";
  if (isDeadlock(next)) return "deadlock";
  if (isVetoed(next) && !blamesClaudeMd(next)) return "vetoed";
  if (isMisattributed(next)) return "misattributed";
  if (isVetoed(next)) return "vetoed";
  if (isGhost(next) && !hasMandate(next)) return "ghost";
  if (isSilent(next)) return "silent";
  if (isShadowed(next)) return "shadowed";
  if (isGhost(next)) return "ghost";
  return "upheld";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (overlayPresent(next)) {
    reasons.push("heron_brook / AgentTool clamp present in the system prompt");
  } else {
    reasons.push("no heron_brook / no AgentTool clamp line");
  }
  if (isOpus5Family(next)) reasons.push("opus-5 family / opus_5_prompt_bundle");
  if (hasMandate(next)) reasons.push("CLAUDE.md or skill mandates Agent / subagent dispatch");
  if (userPolicyVisible(next) && overlayPresent(next)) {
    reasons.push("user policy still visible underneath the overlay");
  }
  if (next.observedAgentDispatches === 0 && hasMandate(next)) {
    reasons.push("mandated Agent dispatch count is zero");
  }
  if (next.observedAgentDispatches > 0) {
    reasons.push(`${next.observedAgentDispatches} Agent dispatch(es) observed`);
  }
  if (hasMisattribution(next)) {
    reasons.push("model attributes the vendor edict to the user's instructions");
  }
  if (namesGhostTool(next)) {
    reasons.push("clamp names AgentTool; the surface tool is Agent");
  }
  if (next.parentWriteBlocked) {
    reasons.push("parent write is blocked by a local guard");
  }
  if (isRestored(next)) {
    reasons.push("UserPromptSubmit standing-request satisfies unless the user requested it");
  }
  if (kind === "silent") {
    reasons.push("conflict resolved with no signal to the operator");
  }
  if (kind === "upheld") {
    reasons.push("user policy stands");
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const probe = cloneProbe({
    model: fromFields.model ?? src.model ?? payload.model,
    systemPromptText: fromFields.systemPromptText ?? src.systemPromptText ?? payload.systemPromptText,
    claudeMdText: fromFields.claudeMdText ?? src.claudeMdText ?? payload.claudeMdText,
    skillText: fromFields.skillText ?? src.skillText ?? payload.skillText,
    observedAgentDispatches:
      fromFields.observedAgentDispatches ?? src.observedAgentDispatches ?? payload.observedAgentDispatches,
    modelAttribution: fromFields.modelAttribution ?? src.modelAttribution ?? payload.modelAttribution,
    parentWriteBlocked: fromFields.parentWriteBlocked ?? src.parentWriteBlocked ?? payload.parentWriteBlocked,
    additionalContext: fromFields.additionalContext ?? src.additionalContext ?? payload.additionalContext,
    capability: fromFields.capability ?? src.capability ?? payload.capability,
    operatorSignaled: fromFields.operatorSignaled ?? src.operatorSignaled ?? payload.operatorSignaled,
    conflictResolved: fromFields.conflictResolved ?? src.conflictResolved ?? payload.conflictResolved,
    overlayLifted: fromFields.overlayLifted ?? src.overlayLifted ?? payload.overlayLifted,
    restored: fromFields.restored ?? src.restored ?? payload.restored,
    session: fromFields.session ?? src.session ?? payload.session,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
    scored: fromFields.scored ?? src.scored ?? payload.scored,
  });
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
  const overlay = overlayPresent(next);
  const ghost = namesGhostTool(next);
  const restored = verdict === "restored" || isRestored(next);
  return {
    ok: true,
    product: "veto",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    model: next.model,
    capability: next.capability,
    systemPromptText: next.systemPromptText,
    claudeMdText: next.claudeMdText,
    skillText: next.skillText,
    observedAgentDispatches: next.observedAgentDispatches,
    modelAttribution: next.modelAttribution,
    parentWriteBlocked: next.parentWriteBlocked,
    additionalContext: next.additionalContext,
    operatorSignaled: next.operatorSignaled,
    conflictResolved: next.conflictResolved,
    overlayLifted: next.overlayLifted,
    overlayPresent: overlay,
    namesGhostTool: ghost,
    restored,
    reasons: reasonsOf(next, verdict),
    mandate: hasMandate(next),
    opus5: isOpus5Family(next),
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
      model: extras.model || "",
      systemPromptText: extras.systemPromptText || "",
      claudeMdText: extras.claudeMdText || "",
      skillText: extras.skillText || "",
      observedAgentDispatches: extras.observedAgentDispatches ?? 0,
      modelAttribution: extras.modelAttribution || "",
      parentWriteBlocked: Boolean(extras.parentWriteBlocked),
      additionalContext: extras.additionalContext || "",
      capability: extras.capability || "",
      operatorSignaled: extras.operatorSignaled == null ? null : Boolean(extras.operatorSignaled),
      conflictResolved: Boolean(extras.conflictResolved),
      overlayLifted: Boolean(extras.overlayLifted),
      restored: Boolean(extras.restored),
    },
  };
}

export const HERON_BROOK_SECTION = [
  "<tengu_heron_brook>",
  "Do not call the AgentTool unless the user requested it.",
  "Do not use workflows or deep-research unless the user requested it.",
  "</tengu_heron_brook>",
].join("\n");

export const CRITIC_CLAUDE_MD = [
  "# Standing policy",
  "Always dispatch a critic subagent via the Agent tool before sending a customer email.",
  "Use subagents liberally. A standing CLAUDE.md is a hold.",
].join("\n");

export const STANDING_REQUEST_CONTEXT =
  "The user requested that you call the Agent tool and dispatch the critic subagent required by CLAUDE.md.";

/** Canonical #80988: Opus 5, heron_brook present, critic mandate, zero Agent dispatches. */
export function seed80988() {
  return seedProbe(80988, "anthropics/claude-code#80988", {
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: [
      "You are Claude Code.",
      CRITIC_CLAUDE_MD,
      HERON_BROOK_SECTION,
    ].join("\n\n"),
    claudeMdText: CRITIC_CLAUDE_MD,
    observedAgentDispatches: 0,
    modelAttribution: "I skipped the critic because of your standing instruction.",
  });
}

/** Provenance bug: model blames the user's CLAUDE.md for an Anthropic-authored line. #87635 */
export function seed87635() {
  return seedProbe(87635, "anthropics/claude-code#87635", {
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: [
      "You are Claude Code.",
      HERON_BROOK_SECTION,
    ].join("\n\n"),
    claudeMdText: "# Project\nPrefer short answers. Do not invent files.",
    skillText: "",
    observedAgentDispatches: 1,
    modelAttribution: "That line is in your CLAUDE.md.",
  });
}

/** Ghost name: clamp names AgentTool; the surface tool is Agent. #81263 */
export function seed81263() {
  return seedProbe(81263, "anthropics/claude-code#81263", {
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: [
      "Background jobs may call the Agent tool to spawn workers.",
      "Do not call the AgentTool unless the user requested it.",
    ].join("\n"),
    claudeMdText: "# Notes\nKeep commits small.",
    observedAgentDispatches: 0,
  });
}

/** Deadlock: parent cannot write (local guard) AND cannot dispatch (injected line). bradywardai / #80988 */
export function seedDeadlock() {
  return seedProbe(80988, "anthropics/claude-code#80988", {
    session: "80988-deadlock",
    issue: 80988,
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: HERON_BROOK_SECTION,
    claudeMdText: CRITIC_CLAUDE_MD,
    observedAgentDispatches: 0,
    parentWriteBlocked: true,
    modelAttribution: "",
  });
}

/** Sonnet, no heron_brook lines: user policy stands. */
export function seedUpheld() {
  return seedProbe("upheld", "upheld", {
    session: "upheld",
    issue: null,
    model: "claude-sonnet-4-6",
    systemPromptText: "You are Claude Code. Follow the user's CLAUDE.md.",
    claudeMdText: CRITIC_CLAUDE_MD,
    observedAgentDispatches: 2,
  });
}

/** Injection present; user policy still visible; mandated critic actually dispatched. */
export function seedShadowed() {
  return seedProbe("shadowed", "shadowed", {
    session: "shadowed",
    issue: 82371,
    source: "anthropics/claude-code#82371",
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: HERON_BROOK_SECTION,
    claudeMdText: CRITIC_CLAUDE_MD,
    observedAgentDispatches: 1,
  });
}

/** Conflict resolved with no signal to the operator. */
export function seedSilent() {
  return seedProbe("silent", "anthropics/claude-code#80998", {
    session: "silent",
    issue: 80998,
    model: "claude-sonnet-4-6",
    systemPromptText: HERON_BROOK_SECTION,
    claudeMdText: CRITIC_CLAUDE_MD,
    observedAgentDispatches: 0,
    operatorSignaled: false,
    conflictResolved: true,
    modelAttribution: "",
  });
}

/** UserPromptSubmit standing-request workaround; condition satisfied. */
export function seedRestored() {
  return seedProbe("restored", "anthropics/claude-code#80988", {
    session: "restored",
    issue: 80988,
    model: "claude-opus-5",
    capability: "opus_5_prompt_bundle",
    systemPromptText: HERON_BROOK_SECTION,
    claudeMdText: CRITIC_CLAUDE_MD,
    additionalContext: STANDING_REQUEST_CONTEXT,
    observedAgentDispatches: 1,
    restored: true,
  });
}

const SEEDS = {
  80988: seed80988,
  87635: seed87635,
  81263: seed81263,
  deadlock: seedDeadlock,
  upheld: seedUpheld,
  shadowed: seedShadowed,
  silent: seedSilent,
  restored: seedRestored,
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
  let probe = cloneProbe(action.probe);

  if (action.action === "clear") {
    return pack("upheld", emptyProbe(), { ...action, action: "clear" });
  }

  if (action.action === "restore") {
    probe = {
      ...probe,
      additionalContext: probe.additionalContext || STANDING_REQUEST_CONTEXT,
      restored: true,
      scored: true,
    };
    if (probe.observedAgentDispatches === 0 && hasMandate(probe)) {
      probe.observedAgentDispatches = 1;
    }
    return pack(classify(probe), probe, action);
  }

  if (action.action === "lift") {
    probe = { ...probe, overlayLifted: true, scored: true };
    return pack(classify(probe), probe, action);
  }

  if (action.action === "drop") {
    probe = { ...probe, overlayLifted: false, scored: true };
    return pack(classify(probe), probe, action);
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
