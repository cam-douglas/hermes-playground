/**
 * Muzzle suppressor-bay scorer.
 * A seated suppressor sleeve should strip
 * skill_listing / agent_listing_delta under
 * --safe-mode and --disable-slash-commands.
 * On the live wire the log line is suppressed
 * but the payload still vents (leaking).
 * Only --bare excises both attachments —
 * and over-scopes by killing Agent-tool.
 *
 * Encoded from #92459 issue facts only.
 * Attachment-strip hypothesis is NON-BINDING.
 */
export const CHIPS = [
  "leaking",
  "excised",
  "safe-mode-leak",
  "disable-slash-leak",
  "bare-excised",
  "log-suppressed-only",
  "agent-tool-killed",
  "cousins"
];

export const HOLD = new Set(["excised", "bare-excised"]);

export const ALARM = new Set([
  "leaking",
  "safe-mode-leak",
  "disable-slash-leak",
  "log-suppressed-only",
  "cousins"
]);

export function seedLeaking() {
  return {
    seed: "leaking",
    issue: 92459,
    leaking: true,
    excised: false,
    skillListingPresent: true,
    agentListingPresent: true,
    logSuppressed: false,
    flags: ["--safe-mode", "--disable-slash-commands"],
    docsClaim: "both flags disable skills"
  };
}

export function seedExcised() {
  return {
    seed: "excised",
    issue: 92459,
    leaking: false,
    excised: true,
    attachmentsRemoved: true,
    flag: "--bare"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "agent-tool-killed" || t.agentToolKilled === true) {
    reasons.push(
      "--bare excises skill_listing and agent_listing_delta, then kills Agent-tool delegation (/plan, Explore, general-purpose subagents fail/no-op) — larger scope than --safe-mode's stated behavior"
    );
    return {
      verdict: "agent-tool-killed",
      reasons,
      leaking: false,
      excised: true,
      agentToolKilled: true,
      chips: ["agent-tool-killed", "bare-excised", "excised"],
      note: "special: bare side-effect — attachments excised, Agent-tool killed"
    };
  }

  if (seed === "cousins" || Array.isArray(t.cousinsCiteOnly)) {
    reasons.push("cite-only #60251 CLOSED/locked and #89327 live; primary stays #92459");
    return {
      verdict: "cousins",
      reasons,
      leaking: true,
      excised: false,
      chips: ["cousins", "leaking"]
    };
  }

  if (seed === "log-suppressed-only" || (t.logSuppressed === true && seed === "log-suppressed-only")) {
    reasons.push(
      "only the log line (Sending N skills via attachment) is suppressed under --disable-slash-commands; the underlying attachment is unaffected"
    );
    return {
      verdict: "log-suppressed-only",
      reasons,
      leaking: true,
      excised: false,
      chips: ["log-suppressed-only", "leaking"]
    };
  }

  if (seed === "disable-slash-leak" || (t.disableSlash === true && seed === "disable-slash-leak")) {
    reasons.push(
      "--disable-slash-commands is documented to disable skills; skill_listing and agent_listing_delta stay on the request (JSONL-verified; size unchanged)"
    );
    return {
      verdict: "disable-slash-leak",
      reasons,
      leaking: true,
      excised: false,
      chips: ["disable-slash-leak", "leaking"]
    };
  }

  if (seed === "safe-mode-leak" || (t.safeMode === true && seed === "safe-mode-leak")) {
    reasons.push(
      "--safe-mode help lists skills among customizations disabled; skill_listing stays fully present (content/size unchanged; input_tokens nearly identical to unflagged baseline)"
    );
    return {
      verdict: "safe-mode-leak",
      reasons,
      leaking: true,
      excised: false,
      chips: ["safe-mode-leak", "leaking"]
    };
  }

  if (seed === "bare-excised" || (t.bare === true && t.attachmentsRemoved === true && t.agentToolKilled !== true)) {
    reasons.push("--bare successfully removes both skill_listing and agent_listing_delta attachments");
    return {
      verdict: "bare-excised",
      reasons,
      leaking: false,
      excised: true,
      chips: ["bare-excised", "excised"]
    };
  }

  if (seed === "excised" || (t.excised === true && t.leaking !== true && t.attachmentsRemoved === true)) {
    reasons.push("attachments excised from the request; rare --bare path");
    return { verdict: "excised", reasons, leaking: false, excised: true, chips: ["excised"] };
  }

  if (
    t.leaking === true ||
    seed === "leaking" ||
    t.skillListingPresent === true ||
    t.agentListingPresent === true
  ) {
    reasons.push(
      "skill_listing / agent_listing_delta still on the wire under documented disable flags; sleeve looks seated, blast still vents"
    );
    const chips = ["leaking"];
    if (t.safeMode === true) chips.push("safe-mode-leak");
    if (t.disableSlash === true) chips.push("disable-slash-leak");
    if (t.logSuppressed === true) chips.push("log-suppressed-only");
    return { verdict: "leaking", reasons, leaking: true, excised: false, chips };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, leaking: false, excised: true, chips: [seed] };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, leaking: true, excised: false, chips: [seed] };
  }

  reasons.push("empty probe; idle wire is leaking");
  return { verdict: "leaking", reasons, leaking: true, excised: false, chips: ["leaking"] };
}
