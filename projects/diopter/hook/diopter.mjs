/**
 * Diopter optical trial-lens / refraction-bench scorer.
 * A collimated system+tools prefix should stay in
 * focus across sessions. Claude Code seats a
 * per-session scratchpad UUID lens inside the
 * system prompt — that one refractive element
 * throws the whole cached prefix out of focus.
 *
 * Encoded from #92524 issue facts only.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 * Verify nothing.
 */

export const CHIPS = [
  "defocused",
  "sharp",
  "uuid-diff",
  "cache-miss",
  "rewrite-16157",
  "normalized-hit",
  "cousins"
];

export const HOLD = new Set(["sharp"]);

export const ALARM = new Set([
  "defocused",
  "uuid-diff",
  "cache-miss",
  "rewrite-16157",
  "normalized-hit",
  "cousins"
]);

export const UUID_A = "fc9aab5b-da05-4cc7-bbe2-410a1c472151";
export const UUID_B = "88966ec9-2cb4-4872-bc6b-624b66257462";
export const SCRATCHPAD_TEMPLATE =
  "/private/tmp/claude-501/<project>/<SESSION-UUID>/scratchpad";

export const MEASURED = {
  cold: { wall: 104.3, inputTokens: 65303 },
  identical: { wall: 0.3, inputTokens: 5 },
  nextSession: { wall: 30.6, inputTokens: 16157 },
  normalised: { wall: 0.4, inputTokens: 5 },
  mcp: [131.7, 17.3, 8.3]
};

export const DIFF = {
  toolsChars: 223596,
  toolsCount: 137,
  messagesChars: 50534,
  systemChars: 7483
};

function num(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function classifyLens(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const inputTokens = num(t.input_tokens ?? t.inputTokens ?? t.tokens);
  const wall = num(t.wall ?? t.wallSeconds ?? t.seconds);
  const request = String(t.request || t.scenario || t.kind || "").trim().toLowerCase();
  const toolsIdentical =
    t.toolsIdentical === true ||
    t.tools === "identical" ||
    t.tools === "byte-identical";
  const messagesIdentical =
    t.messagesIdentical === true ||
    t.messages === "identical" ||
    t.messages === "byte-identical";
  const systemDiffers =
    t.systemDiffers === true ||
    t.system === "uuid-diff" ||
    t.system === "differs";
  const uuidNormalized =
    t.uuidNormalized === true ||
    t.normalized === true ||
    t.normalised === true ||
    request === "normalised" ||
    request === "normalized";
  const rewrite =
    inputTokens === 16157 ||
    t.rewrite === 16157 ||
    t.rewrite16157 === true ||
    request === "rewrite-16157";
  const cacheHit = inputTokens === 5 || uuidNormalized;
  const cold = inputTokens === 65303 || request === "cold";
  const nextSession =
    request === "next-session" ||
    request === "next session" ||
    (rewrite && systemDiffers);

  return {
    inputTokens,
    wall,
    request,
    toolsChars: num(t.toolsChars) ?? DIFF.toolsChars,
    messagesChars: num(t.messagesChars) ?? DIFF.messagesChars,
    systemChars: num(t.systemChars) ?? DIFF.systemChars,
    toolsCount: num(t.toolsCount) ?? DIFF.toolsCount,
    toolsIdentical,
    messagesIdentical,
    systemDiffers,
    uuidNormalized,
    rewrite,
    cacheHit,
    cold,
    nextSession,
    uuidA: String(t.uuidA || UUID_A),
    uuidB: String(t.uuidB || UUID_B),
    pathTemplate: t.pathTemplate || SCRATCHPAD_TEMPLATE,
    userIdHarmless: t.userIdHarmless !== false
  };
}

export function seedDefocused() {
  return {
    seed: "defocused",
    issue: 92524,
    defocused: true,
    sharp: false,
    request: "next-session",
    wall: 30.6,
    input_tokens: 16157,
    toolsIdentical: true,
    messagesIdentical: true,
    systemDiffers: true,
    uuidNormalized: false,
    toolsChars: DIFF.toolsChars,
    messagesChars: DIFF.messagesChars,
    systemChars: DIFF.systemChars,
    toolsCount: DIFF.toolsCount,
    uuidA: UUID_A,
    uuidB: UUID_B,
    version: "Claude Code 2.1.260",
    platform: "macos",
    os: "macOS 26.5",
    chip: "M5 Max"
  };
}

export function seedSharp() {
  return {
    seed: "sharp",
    issue: 92524,
    defocused: false,
    sharp: true,
    request: "normalised",
    wall: 0.4,
    input_tokens: 5,
    toolsIdentical: true,
    messagesIdentical: true,
    systemDiffers: false,
    uuidNormalized: true,
    toolsChars: DIFF.toolsChars,
    messagesChars: DIFF.messagesChars,
    systemChars: DIFF.systemChars,
    version: "Claude Code 2.1.260",
    platform: "macos"
  };
}

export function scoreFields(probe = {}) {
  return classifyLens(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const lens = classifyLens(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #77306 forks forfeit conversation cache: session-id-bearing scratchpad path in system (cache-diagnosis: system_changed); #92033 mid-conversation tool/MCP list changes invalidate prefix within a session; #90953 feature request for a \"why did this cache miss\" diagnostic. Same cache class, different triggers. This product is the cross-session UUID lens in the cached system block. Primary stays #92524"
    );
    return {
      verdict: "cousins",
      reasons,
      defocused: true,
      sharp: false,
      chips: ["cousins", "defocused"],
      lens
    };
  }

  if (
    seed === "sharp" ||
    (t.sharp === true && t.defocused !== true && seed !== "normalized-hit")
  ) {
    reasons.push(
      "UUID normalised / scratchpad path moved out of the cached prefix — cache hit. Same request with the UUID normalised: 0.4 s / 5 input_tokens against a 65,303-token prompt on a warm M5 Max. Seeded word is sharp"
    );
    return {
      verdict: "sharp",
      reasons,
      defocused: false,
      sharp: true,
      chips: ["sharp"],
      lens
    };
  }

  if (
    seed === "normalized-hit" ||
    (lens.uuidNormalized && seed === "normalized-hit") ||
    (lens.cacheHit && lens.uuidNormalized && seed !== "sharp" && t.normalizedHit === true)
  ) {
    reasons.push(
      "Same request with the UUID normalised: 0.4 s wall / 5 input_tokens. Normalising that one UUID in a proxy turns a 30.6 s re-prefill into 0.4 s. End-to-end with MCP enabled, three consecutive real sessions went 131.7 s → 17.3 s → 8.3 s"
    );
    return {
      verdict: "normalized-hit",
      reasons,
      defocused: false,
      sharp: true,
      chips: ["normalized-hit", "sharp"],
      lens
    };
  }

  if (
    seed === "rewrite-16157" ||
    t.rewrite16157 === true ||
    (lens.rewrite && seed === "rewrite-16157")
  ) {
    reasons.push(
      "Next session — only the UUID differs: 30.6 s wall / 16,157 input_tokens. The volatile scratchpad UUID sits in system, ahead of the tool definitions (223,596 chars) and the conversation, so the cached prefix is rewritten"
    );
    return {
      verdict: "rewrite-16157",
      reasons,
      defocused: true,
      sharp: false,
      chips: ["rewrite-16157", "defocused"],
      lens
    };
  }

  if (seed === "cache-miss" || t.cacheMiss === true) {
    reasons.push(
      "Every new session in a project pays a full system+tools cache write instead of a read, for a value that has no bearing on the model's output. Measured locally (usage.input_tokens readable; cache controlled). Hosted side not measured — mechanism is not local-specific"
    );
    return {
      verdict: "cache-miss",
      reasons,
      defocused: true,
      sharp: false,
      chips: ["cache-miss", "defocused"],
      lens
    };
  }

  if (
    seed === "uuid-diff" ||
    t.uuidDiff === true ||
    (lens.toolsIdentical &&
      lens.messagesIdentical &&
      lens.systemDiffers &&
      seed === "uuid-diff")
  ) {
    reasons.push(
      "Diff of two consecutive claude -p \"hi\" request bodies in the same project: tools 223,596 chars (137 MCP tools) byte-identical; messages 50,534 chars byte-identical; system 7,483 chars differs at exactly one place — scratchpad path UUID. Same UUID also in metadata.user_id (not part of the prompt; harmless)"
    );
    return {
      verdict: "uuid-diff",
      reasons,
      defocused: true,
      sharp: false,
      chips: ["uuid-diff", "defocused"],
      lens
    };
  }

  if (
    t.defocused === true ||
    seed === "defocused" ||
    lens.nextSession ||
    (lens.toolsIdentical && lens.messagesIdentical && lens.systemDiffers && !lens.uuidNormalized)
  ) {
    reasons.push(
      "Per-session scratchpad UUID in the system prompt is the only cross-session prompt diff, invalidating the cached prefix on every new session. Path /private/tmp/claude-501/<project>/<SESSION-UUID>/scratchpad. Suggested rails (cheapest first): move the path out of the cached prefix; make it stable per project; place the volatile segment as late as possible so tools (223 KB) stay in the shared prefix"
    );
    const chips = ["defocused"];
    if (lens.systemDiffers || lens.toolsIdentical) chips.push("uuid-diff");
    if (lens.rewrite || lens.inputTokens === 16157) chips.push("rewrite-16157");
    if (lens.nextSession || t.cacheMiss === true || lens.inputTokens === 16157) {
      chips.push("cache-miss");
    }
    return {
      verdict: "defocused",
      reasons,
      defocused: true,
      sharp: false,
      chips: [...new Set(chips)],
      lens
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, defocused: false, sharp: true, chips: [seed], lens };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, defocused: true, sharp: false, chips: [seed], lens };
  }

  reasons.push(
    "empty probe; idle refraction bench is defocused — UUID lens in the system prompt throws the whole cached prefix out of focus on every new session"
  );
  return {
    verdict: "defocused",
    reasons,
    defocused: true,
    sharp: false,
    chips: ["defocused"],
    lens
  };
}
