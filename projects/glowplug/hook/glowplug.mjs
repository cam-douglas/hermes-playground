/**
 * Glowplug diesel glow-plug preheat-bay scorer.
 * Before the engine can fire, the glow plug
 * silently soaks heat with no telemetry.
 * Claude Code on Windows sits in two unlogged
 * warm-up voids before [skills] idle and
 * [ScheduledTasks] scheduler start.
 *
 * Encoded from #85050 issue facts only.
 * Network/proxy/VPN / config-hydration
 * hypothesis is NON-BINDING. Verify nothing.
 */
export const CHIPS = [
  "preheating",
  "lit",
  "gap-skills-idle",
  "gap-scheduler",
  "skills-removed-persists",
  "nonessential-traffic-noop",
  "cert-store-bundled-noop",
  "empty-config-fast",
  "cousins"
];

export const HOLD = new Set(["lit"]);

export const CONTROL = new Set(["empty-config-fast"]);

export const ALARM = new Set([
  "preheating",
  "gap-skills-idle",
  "gap-scheduler",
  "skills-removed-persists",
  "nonessential-traffic-noop",
  "cert-store-bundled-noop",
  "cousins"
]);

export function seedPreheating() {
  return {
    seed: "preheating",
    issue: 85050,
    preheating: true,
    lit: false,
    gapSkillsIdleSec: 59.7,
    gapSchedulerSec: 38.4,
    wallSec: 128,
    version: "2.1.224",
    platform: "win32"
  };
}

export function seedLit() {
  return {
    seed: "lit",
    issue: 85050,
    preheating: false,
    lit: true,
    emptyConfig: true,
    wallSec: 6,
    version: "2.1.224",
    platform: "win32"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #84478 macOS 45s+ silent startup in system CA trust-store lookup (same shape; CLAUDE_CODE_CERT_STORE=bundled workaround does NOT help on this Windows issue), #83988 Desktop window appears ~1s then blank up to 117s with no progress indication; primary stays #85050"
    );
    return {
      verdict: "cousins",
      reasons,
      preheating: true,
      lit: false,
      chips: ["cousins", "preheating"]
    };
  }

  if (seed === "empty-config-fast" || (t.emptyConfig === true && seed === "empty-config-fast")) {
    reasons.push(
      "fresh empty CLAUDE_CONFIG_DIR + empty cwd: 6s for claude -p --model haiku --strict-mcp-config \"Reply OK\". Empty config bypasses the silent phases. Control, not the idle preheat"
    );
    return {
      verdict: "empty-config-fast",
      reasons,
      preheating: false,
      lit: true,
      chips: ["empty-config-fast", "lit"]
    };
  }

  if (
    seed === "lit" ||
    (t.lit === true && t.preheating !== true && (t.emptyConfig === true || t.wallSec === 6))
  ) {
    reasons.push(
      "glow plug already lit: empty-config path is 6s; no silent soak before [skills] idle / [ScheduledTasks] scheduler start"
    );
    return {
      verdict: "lit",
      reasons,
      preheating: false,
      lit: true,
      chips: ["lit"]
    };
  }

  if (
    seed === "gap-skills-idle" ||
    (typeof t.gapSkillsIdleSec === "number" && t.gapSkillsIdleSec >= 57 && seed === "gap-skills-idle")
  ) {
    reasons.push(
      "~57–60s silent (this run 59.7s) between Org fast mode: enabled and [skills] idle — switching poll interval to 30000ms; nothing written to --debug while it runs"
    );
    return {
      verdict: "gap-skills-idle",
      reasons,
      preheating: true,
      lit: false,
      chips: ["gap-skills-idle", "preheating"]
    };
  }

  if (
    seed === "gap-scheduler" ||
    (typeof t.gapSchedulerSec === "number" && t.gapSchedulerSec >= 17 && seed === "gap-scheduler")
  ) {
    reasons.push(
      "~17–38s silent (this run 38.4s) after [skills] idle until [ScheduledTasks] scheduler start() — enabled=false, hasTasks=false; rest of startup then completes in ~1s"
    );
    return {
      verdict: "gap-scheduler",
      reasons,
      preheating: true,
      lit: false,
      chips: ["gap-scheduler", "preheating"]
    };
  }

  if (
    seed === "skills-removed-persists" ||
    (t.skillsRemoved === true && seed === "skills-removed-persists")
  ) {
    reasons.push(
      "~/.claude/skills renamed away: 85.5s. First gap is not only skill scanning. Two-gap structure (~57–60s + ~17–38s) persists with skills removed. --disable-slash-commands: 85.1s"
    );
    return {
      verdict: "skills-removed-persists",
      reasons,
      preheating: true,
      lit: false,
      chips: ["skills-removed-persists", "preheating"]
    };
  }

  if (
    seed === "nonessential-traffic-noop" ||
    (t.nonessentialTraffic === true && seed === "nonessential-traffic-noop")
  ) {
    reasons.push(
      "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1: 127.9s (no effect). Issue asks: if network/proxy then aggressive timeouts / opt-out — this flag did not help"
    );
    return {
      verdict: "nonessential-traffic-noop",
      reasons,
      preheating: true,
      lit: false,
      chips: ["nonessential-traffic-noop", "preheating"]
    };
  }

  if (
    seed === "cert-store-bundled-noop" ||
    (t.certStoreBundled === true && seed === "cert-store-bundled-noop")
  ) {
    reasons.push(
      "CLAUDE_CODE_CERT_STORE=bundled (#84478 workaround): 115.3s (no effect). Same-shape macOS CA-trust cousin does not explain this Windows soak"
    );
    return {
      verdict: "cert-store-bundled-noop",
      reasons,
      preheating: true,
      lit: false,
      chips: ["cert-store-bundled-noop", "preheating"]
    };
  }

  if (
    t.preheating === true ||
    seed === "preheating" ||
    t.silentGaps === true ||
    (typeof t.gapSkillsIdleSec === "number" && t.gapSkillsIdleSec >= 57) ||
    (typeof t.gapSchedulerSec === "number" && t.gapSchedulerSec >= 17)
  ) {
    reasons.push(
      "Windows every claude start (interactive, -p, --resume) spends ~75s in two completely silent startup phases — nothing written to --debug while they run. Full config 128–136s; empty config 6s"
    );
    const chips = ["preheating"];
    if (typeof t.gapSkillsIdleSec === "number" && t.gapSkillsIdleSec >= 57) chips.push("gap-skills-idle");
    if (typeof t.gapSchedulerSec === "number" && t.gapSchedulerSec >= 17) chips.push("gap-scheduler");
    if (t.skillsRemoved === true) chips.push("skills-removed-persists");
    if (t.nonessentialTraffic === true) chips.push("nonessential-traffic-noop");
    if (t.certStoreBundled === true) chips.push("cert-store-bundled-noop");
    return { verdict: "preheating", reasons, preheating: true, lit: false, chips };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, preheating: false, lit: true, chips: [seed] };
  }

  if (CONTROL.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, preheating: false, lit: true, chips: [seed] };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, preheating: true, lit: false, chips: [seed] };
  }

  reasons.push("empty probe; idle glow plug is preheating");
  return { verdict: "preheating", reasons, preheating: true, lit: false, chips: ["preheating"] };
}
