/**
 * Plimsoll dry-dock load-line / draught-board scorer.
 * Auto-compact should re-chalk the draught against
 * the request as it will actually be sent. Resume
 * re-injects CLAUDE.md + .claude/rules/*.md; the
 * check appears to trust the previous turn's mark,
 * so the hull sails overladen and the API returns
 * 400 `prompt is too long` instead of compacting.
 *
 * Encoded from #92434 issue facts only.
 * Hypothesis (NON-BINDING): auto-compact consults
 * previous-turn reported tokens and misses harness
 * reinjection on resume. Verify nothing.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 */

export const CHIPS = [
  "overladen",
  "trimmed",
  "stale-previous-count",
  "reinject-jump",
  "no-reactive-compact",
  "manual-compact-ok",
  "cousins"
];

export const HOLD = new Set(["trimmed"]);

export const ALARM = new Set([
  "overladen",
  "stale-previous-count",
  "reinject-jump",
  "no-reactive-compact",
  "manual-compact-ok",
  "cousins"
]);

export const MEASURED = {
  previousTurnTokensApprox: 646000,
  resumeTokens: 1043785,
  windowMax: 1000000,
  jumpApprox: 398000,
  instructionShare: "largest share but not all; roughly a third of the jump in the clearest case",
  window200kThresholdApprox: 167000,
  ruleCount: 40,
  ruleLines: 500,
  versions: ["2.1.261", "2.1.257"],
  untested: "2.1.263",
  error: "prompt is too long: 1043785 tokens > 1000000 maximum"
};

export const COUSINS = [
  {
    id: 91709,
    note: "same symptom after --resume but the error string ends auto-compact is off"
  },
  {
    id: 85489,
    note: "same re-injection with the opposite outcome — compaction firing repeatedly rather than not at all"
  }
];

function num(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function classifyDraught(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const previousTurnTokens = num(
    t.previousTurnTokens ?? t.previous_turn_tokens ?? t.previousCount
  );
  const resumeTokens = num(t.resumeTokens ?? t.resume_tokens ?? t.tokens);
  const windowMax = num(t.windowMax ?? t.window_max ?? t.maximum) ?? MEASURED.windowMax;
  const jump = num(t.jump ?? t.jumpTokens ?? t.reinjectJump);
  const autoCompactOff =
    t.autoCompactOff === true ||
    t.autoCompact === "off" ||
    String(t.error || "").includes("auto-compact is off");
  const promptTooLong =
    t.promptTooLong === true ||
    t.status === 400 ||
    String(t.error || "").includes("prompt is too long");
  const compactAttempted = t.compactAttempted === true || t.autoCompactRan === true;
  const manualCompactOk =
    t.manualCompactOk === true ||
    t.manualCompact === true ||
    t.slashCompact === "ok";
  const reinjected =
    t.reinjected === true ||
    t.reinject === true ||
    t.claudeMd === true ||
    t.rules === true;
  const pathlessRules =
    t.pathlessRules === true ||
    t.unconditionalRules === true ||
    num(t.ruleCount) === 40;
  const resume =
    t.resume === true ||
    String(t.request || t.scenario || t.kind || "").toLowerCase().includes("resume");

  return {
    previousTurnTokens,
    resumeTokens,
    windowMax,
    jump: jump ?? (resumeTokens != null && previousTurnTokens != null
      ? resumeTokens - previousTurnTokens
      : null),
    autoCompactOff,
    promptTooLong,
    compactAttempted,
    manualCompactOk,
    reinjected,
    pathlessRules,
    resume,
    error: t.error || (promptTooLong ? MEASURED.error : ""),
    version: t.version || "2.1.261",
    platform: t.platform || "macos"
  };
}

export function seedOverladen() {
  return {
    seed: "overladen",
    issue: 92434,
    overladen: true,
    trimmed: false,
    resume: true,
    reinjected: true,
    claudeMd: true,
    rules: true,
    pathlessRules: true,
    ruleCount: 40,
    previousTurnTokens: 646000,
    resumeTokens: 1043785,
    windowMax: 1000000,
    jump: 398000,
    promptTooLong: true,
    compactAttempted: false,
    manualCompactOk: true,
    status: 400,
    error: MEASURED.error,
    version: "2.1.261",
    alsoSeenOn: "2.1.257",
    untested: "2.1.263",
    platform: "macos",
    model: "Opus",
    window: "1M"
  };
}

export function seedTrimmed() {
  return {
    seed: "trimmed",
    issue: 92434,
    overladen: false,
    trimmed: true,
    resume: true,
    reinjected: true,
    evaluatedAgainstSent: true,
    previousTurnTokens: 646000,
    resumeTokens: 1043785,
    windowMax: 1000000,
    compactAttempted: true,
    promptTooLong: false,
    version: "2.1.261",
    platform: "macos"
  };
}

export function scoreFields(probe = {}) {
  return classifyDraught(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const draught = classifyDraught(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #91709 same symptom after --resume but the error string ends auto-compact is off (nothing there was expected to compact); #85489 same re-injection with the opposite outcome — compaction firing repeatedly rather than not at all. Both can end in a stuck session; what differs is the sequence. This product is stale auto-compact threshold on resume reinjection. Primary stays #92434"
    );
    return {
      verdict: "cousins",
      reasons,
      overladen: true,
      trimmed: false,
      chips: ["cousins", "overladen"],
      draught
    };
  }

  if (
    seed === "trimmed" ||
    (t.trimmed === true && t.overladen !== true && seed !== "manual-compact-ok")
  ) {
    reasons.push(
      "load line evaluated against the request as it will actually be sent. Any content the harness is going to add before dispatch is inside the number the check consults. Seeded word is trimmed"
    );
    return {
      verdict: "trimmed",
      reasons,
      overladen: false,
      trimmed: true,
      chips: ["trimmed"],
      draught
    };
  }

  if (seed === "manual-compact-ok" || t.manualCompactOk === true && seed === "manual-compact-ok") {
    reasons.push(
      "Manual /compact immediately afterwards succeeds and the session continues normally, so compaction was available. It just did not happen on its own"
    );
    return {
      verdict: "manual-compact-ok",
      reasons,
      overladen: true,
      trimmed: false,
      chips: ["manual-compact-ok", "overladen"],
      draught
    };
  }

  if (
    seed === "no-reactive-compact" ||
    t.noReactiveCompact === true ||
    (draught.promptTooLong && draught.compactAttempted === false && seed === "no-reactive-compact")
  ) {
    reasons.push(
      "Client sees headroom; API sees a request over the limit. The turn ends in a 400 `prompt is too long: 1043785 tokens > 1000000 maximum` rather than in a compaction. A prompt is too long on a request the harness itself inflated did not route into reactive compaction"
    );
    return {
      verdict: "no-reactive-compact",
      reasons,
      overladen: true,
      trimmed: false,
      chips: ["no-reactive-compact", "overladen"],
      draught
    };
  }

  if (
    seed === "reinject-jump" ||
    t.reinjectJump === true ||
    (draught.resumeTokens === 1043785 && seed === "reinject-jump")
  ) {
    reasons.push(
      "Previous turn reported roughly 646k tokens used; the resume added around 398k. Fail: prompt is too long: 1043785 tokens > 1000000 maximum. Instruction files are the largest single component of what gets re-added on resume, but not the only one — in the clearest case they account for roughly a third of the jump"
    );
    return {
      verdict: "reinject-jump",
      reasons,
      overladen: true,
      trimmed: false,
      chips: ["reinject-jump", "overladen"],
      draught
    };
  }

  if (
    seed === "stale-previous-count" ||
    t.stalePreviousCount === true ||
    (draught.previousTurnTokens === 646000 && t.stalePreviousCount !== false && seed === "stale-previous-count")
  ) {
    reasons.push(
      "The auto-compact decision appears to be made from the previous turn's reported token count, which cannot include what this turn is about to add. Resume re-reads and re-injects CLAUDE.md and .claude/rules/*.md into a turn that has not been measured yet"
    );
    return {
      verdict: "stale-previous-count",
      reasons,
      overladen: true,
      trimmed: false,
      chips: ["stale-previous-count", "overladen"],
      draught
    };
  }

  if (
    t.overladen === true ||
    seed === "overladen" ||
    (draught.resume && draught.promptTooLong && !draught.compactAttempted)
  ) {
    reasons.push(
      "Sailed on yesterday's chalk mark while a fresh hold of instructions was already aboard. Resume re-injects CLAUDE.md + pathless .claude/rules/*.md; auto-compact trusts the previous turn's mark (~646k) so the hull goes over the 1M window (1043785 > 1000000) with no compaction. Manual /compact then works"
    );
    const chips = ["overladen"];
    if (draught.previousTurnTokens === 646000 || t.stalePreviousCount === true) {
      chips.push("stale-previous-count");
    }
    if (draught.resumeTokens === 1043785 || draught.jump === 398000) {
      chips.push("reinject-jump");
    }
    if (draught.promptTooLong && draught.compactAttempted === false) {
      chips.push("no-reactive-compact");
    }
    if (draught.manualCompactOk) chips.push("manual-compact-ok");
    return {
      verdict: "overladen",
      reasons,
      overladen: true,
      trimmed: false,
      chips: [...new Set(chips)],
      draught
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, overladen: false, trimmed: true, chips: [seed], draught };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, overladen: true, trimmed: false, chips: [seed], draught };
  }

  reasons.push(
    "empty probe; idle dry-dock is overladen — sailed on yesterday's chalk mark while a fresh hold of instructions was already aboard"
  );
  return {
    verdict: "overladen",
    reasons,
    overladen: true,
    trimmed: false,
    chips: ["overladen"],
    draught
  };
}
