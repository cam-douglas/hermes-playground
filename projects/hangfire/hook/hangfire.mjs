/**
 * Hangfire delayed-primer chronograph scorer.
 * A queued /compact typed mid-turn should fire
 * as a slash command at the turn boundary
 * (compact_boundary + command stub).
 * On 2.1.257 it sometimes hangs through the
 * turn, then fires as a plain prompt
 * (promptSource:"queued") — prose "summary",
 * no compaction.
 *
 * Encoded from #92478 issue facts only.
 * Long-args / queued-parse hypothesis
 * is NON-BINDING. Verify nothing.
 */
export const CHIPS = [
  "hangfired",
  "executed",
  "promptSource-queued",
  "plain-prompt-path",
  "missing-compact-boundary",
  "long-args-suggestive",
  "idle-prompt-ok",
  "cousins"
];

export const HOLD = new Set(["executed"]);

export const ALARM = new Set([
  "hangfired",
  "promptSource-queued",
  "plain-prompt-path",
  "missing-compact-boundary",
  "long-args-suggestive",
  "cousins"
]);

export function seedHangfired() {
  return {
    seed: "hangfired",
    issue: 92478,
    hangfired: true,
    executed: false,
    queued: true,
    promptSource: "queued",
    nextAttachment: "total_tokens_reminder",
    compactBoundary: false,
    version: "2.1.257",
    argChars: 840
  };
}

export function seedExecuted() {
  return {
    seed: "executed",
    issue: 92478,
    hangfired: false,
    executed: true,
    compactBoundary: true,
    commandStub: true,
    nextAttachment: "file-history-snapshot",
    promptSource: null,
    version: "2.1.257"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #85697 queued /compact silently dropped (drop vs demotion), #76875 input during /compact cancels compaction, #92434 auto-compact previous-turn token count on resume overflow, #92424 stall watchdog kills agents during auto-compaction, #90711 Remote Control busy indicator never clears after /compact; primary stays #92478"
    );
    return {
      verdict: "cousins",
      reasons,
      hangfired: true,
      executed: false,
      chips: ["cousins", "hangfired"]
    };
  }

  if (seed === "idle-prompt-ok" || (t.idlePrompt === true && seed === "idle-prompt-ok")) {
    reasons.push(
      "typed at an idle prompt → executed every time: 6/6 on 2.1.257 (and 5/5 on 2.1.222; 6/6 on 2.1.202). The hangfire is a queued mid-turn demotion, not an idle-prompt miss"
    );
    return {
      verdict: "idle-prompt-ok",
      reasons,
      hangfired: false,
      executed: true,
      chips: ["idle-prompt-ok", "executed"]
    };
  }

  if (
    seed === "executed" ||
    (t.executed === true && t.hangfired !== true && (t.compactBoundary === true || t.commandStub === true))
  ) {
    reasons.push(
      "queued /compact executed as the slash command: no promptSource on the user row; next attachment is file-history-snapshot, then compact_boundary + command stub"
    );
    return {
      verdict: "executed",
      reasons,
      hangfired: false,
      executed: true,
      chips: ["executed"]
    };
  }

  if (seed === "promptSource-queued" || (t.promptSource === "queued" && seed === "promptSource-queued")) {
    reasons.push(
      "failing user row carries promptSource:\"queued\"; executed echoes never carry promptSource (29/29 on 2.1.257, 30/30 on 2.1.222)"
    );
    return {
      verdict: "promptSource-queued",
      reasons,
      hangfired: true,
      executed: false,
      chips: ["promptSource-queued", "hangfired"]
    };
  }

  if (
    seed === "plain-prompt-path" ||
    (t.nextAttachment === "total_tokens_reminder" && seed === "plain-prompt-path")
  ) {
    reasons.push(
      "fail path next attachment is total_tokens_reminder — the input took the plain prompt path, not the command path; model writes a prose \"summary\"; no compaction"
    );
    return {
      verdict: "plain-prompt-path",
      reasons,
      hangfired: true,
      executed: false,
      chips: ["plain-prompt-path", "hangfired"]
    };
  }

  if (
    seed === "missing-compact-boundary" ||
    (t.compactBoundary === false && t.queued === true && seed === "missing-compact-boundary")
  ) {
    reasons.push(
      "no compact_boundary, no command stub; executed path is file-history-snapshot then compact_boundary + command stub. The primer delayed, then the round fired as prose"
    );
    return {
      verdict: "missing-compact-boundary",
      reasons,
      hangfired: true,
      executed: false,
      chips: ["missing-compact-boundary", "hangfired"]
    };
  }

  if (
    seed === "long-args-suggestive" ||
    (typeof t.argChars === "number" && t.argChars >= 840 && seed === "long-args-suggestive")
  ) {
    reasons.push(
      "all 7 failures had /compact text ≥ 840 chars; 27 of 29 executed queued cases ≤ 787 (one executed at 1606) — length suggestive, not a hard rule"
    );
    return {
      verdict: "long-args-suggestive",
      reasons,
      hangfired: true,
      executed: false,
      chips: ["long-args-suggestive", "hangfired"]
    };
  }

  if (
    t.hangfired === true ||
    seed === "hangfired" ||
    t.demoted === true ||
    t.promptSource === "queued" ||
    t.nextAttachment === "total_tokens_reminder"
  ) {
    reasons.push(
      "queued /compact mid-turn dispatched at the turn boundary as a plain user prompt instead of executing as the slash command; 7 of 36 queued cases on 2.1.257 (0/30 on 2.1.222). Primer hung; round fired late/wrong"
    );
    const chips = ["hangfired"];
    if (t.promptSource === "queued") chips.push("promptSource-queued");
    if (t.nextAttachment === "total_tokens_reminder") chips.push("plain-prompt-path");
    if (t.compactBoundary === false) chips.push("missing-compact-boundary");
    if (typeof t.argChars === "number" && t.argChars >= 840) chips.push("long-args-suggestive");
    return { verdict: "hangfired", reasons, hangfired: true, executed: false, chips };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, hangfired: false, executed: true, chips: [seed] };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, hangfired: true, executed: false, chips: [seed] };
  }

  reasons.push("empty probe; idle primer is hangfired");
  return { verdict: "hangfired", reasons, hangfired: true, executed: false, chips: ["hangfired"] };
}
