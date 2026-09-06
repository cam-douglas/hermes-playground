/**
 * Hysteresis magnetic remanence scorer.
 * Turning the effort dial should leave the
 * prompt-cache remanent (docs + Fable).
 * On Sonnet the curve droops (partial rewrite);
 * on Opus the loop snaps open (full rewrite).
 *
 * Encoded from #92444 issue facts only.
 * Cache-key hypothesis is NON-BINDING.
 */
export const CHIPS = [
  "remanent",
  "rewritten",
  "sonnet-partial",
  "opus-full",
  "fable-preserved",
  "docs-mismatch",
  "dialog-false-alarm",
  "mid-session-switch",
  "cousins"
];

export const HOLD = new Set(["remanent", "fable-preserved"]);

export const ALARM = new Set([
  "rewritten",
  "sonnet-partial",
  "opus-full",
  "docs-mismatch",
  "dialog-false-alarm",
  "mid-session-switch",
  "cousins"
]);

export function seedRewritten() {
  return {
    seed: "rewritten",
    issue: 92444,
    rewritten: true,
    remanent: false,
    sonnetPartial: true,
    opusFull: true,
    docsMismatch: true,
    dialogFalseAlarm: true,
    midSessionSwitch: true,
    command: "/effort",
    docsClaim: "effort is not part of the cache key... changing it mid-session has no effect on the cache"
  };
}

export function seedRemanent() {
  return {
    seed: "remanent",
    issue: 92444,
    remanent: true,
    rewritten: false,
    cachePreserved: true,
    command: "/effort"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "fable-preserved" || (t.fablePreserved === true && seed === "fable-preserved")) {
    reasons.push("Fable 5.1 all switches preserve cache (~66.8K read, ~0.13-0.22K write)");
    return {
      verdict: "fable-preserved",
      reasons,
      remanent: true,
      rewritten: false,
      chips: ["fable-preserved", "remanent"]
    };
  }

  if (seed === "remanent" || (t.remanent === true && t.rewritten !== true && t.cachePreserved === true)) {
    reasons.push("prompt-cache remanent after mid-session /effort; docs + idle fence");
    return { verdict: "remanent", reasons, remanent: true, rewritten: false, chips: ["remanent"] };
  }

  if (seed === "cousins" || Array.isArray(t.cousinsCiteOnly)) {
    reasons.push("cite-only #61984 #63962; primary stays #92444");
    return { verdict: "cousins", reasons, remanent: false, rewritten: true, chips: ["cousins", "rewritten"] };
  }

  if (seed === "dialog-false-alarm" || t.dialogFalseAlarm === true && seed === "dialog-false-alarm") {
    reasons.push("in-app confirmation warns of cache miss unconditionally; false alarm on Fable");
    return {
      verdict: "dialog-false-alarm",
      reasons,
      remanent: false,
      rewritten: true,
      chips: ["dialog-false-alarm", "rewritten"]
    };
  }

  if (seed === "docs-mismatch" || (t.docsMismatch === true && seed === "docs-mismatch")) {
    reasons.push("docs say effort is not part of the cache key; empirically false on Sonnet 5 and Opus 5");
    return {
      verdict: "docs-mismatch",
      reasons,
      remanent: false,
      rewritten: true,
      chips: ["docs-mismatch", "rewritten"]
    };
  }

  if (seed === "mid-session-switch" || (t.midSessionSwitch === true && seed === "mid-session-switch")) {
    reasons.push("mid-session /effort change; control high→high holds; switches invalidate on Sonnet/Opus");
    return {
      verdict: "mid-session-switch",
      reasons,
      remanent: false,
      rewritten: true,
      chips: ["mid-session-switch", "rewritten"]
    };
  }

  if (seed === "opus-full" || (t.opusFull === true && seed === "opus-full")) {
    reasons.push("Opus 5 switch read=0 / write≈ctx; full prefix rewrite");
    return { verdict: "opus-full", reasons, remanent: false, rewritten: true, chips: ["opus-full", "rewritten"] };
  }

  if (seed === "sonnet-partial" || (t.sonnetPartial === true && seed === "sonnet-partial")) {
    reasons.push("Sonnet 5 high→low read 51.3K / write 26.5K; low→medium read 45.4K / write 32.5K");
    return {
      verdict: "sonnet-partial",
      reasons,
      remanent: false,
      rewritten: true,
      chips: ["sonnet-partial", "rewritten"]
    };
  }

  if (
    t.rewritten === true ||
    seed === "rewritten" ||
    (typeof t.opusRead === "number" && t.opusRead === 0)
  ) {
    reasons.push("mid-session /effort invalidated the prompt cache on Sonnet 5 / Opus 5");
    const chips = ["rewritten"];
    if (t.sonnetPartial === true) chips.push("sonnet-partial");
    if (t.opusFull === true) chips.push("opus-full");
    if (t.docsMismatch === true) chips.push("docs-mismatch");
    if (t.dialogFalseAlarm === true) chips.push("dialog-false-alarm");
    if (t.midSessionSwitch === true) chips.push("mid-session-switch");
    return { verdict: "rewritten", reasons, remanent: false, rewritten: true, chips };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, remanent: false, rewritten: true, chips: [seed] };
  }

  reasons.push("empty probe; idle cache is remanent");
  return { verdict: "remanent", reasons, remanent: true, rewritten: false, chips: ["remanent"] };
}
