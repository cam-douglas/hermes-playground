/**
 * Thrash working-set / paging-storm scorer.
 * First prompt of every new Claude Code process
 * freezes the TUI ~40–60s: event-loop stall
 * ~40808ms, ~100% CPU, RSS ~2.5–3.5 GB.
 * Reproduces with --safe-mode, Haiku, one-file
 * git repo. CPU≈wall so synchronous main-thread
 * work, not I/O. Stall detector's
 * [likely sleep/wake] tag is misleading.
 *
 * Encoded from #88257 issue facts only.
 * Skills-attachment / first-byte hypothesis
 * is NON-BINDING. Verify nothing.
 */
export const CHIPS = [
  "thrashing",
  "responsive",
  "event-loop-stall",
  "rss-balloon",
  "cpu-bound-gap",
  "safe-mode-still-stalls",
  "sleep-wake-mislabelled",
  "cousins"
];

export const HOLD = new Set(["responsive"]);

export const ALARM = new Set([
  "thrashing",
  "event-loop-stall",
  "rss-balloon",
  "cpu-bound-gap",
  "safe-mode-still-stalls",
  "sleep-wake-mislabelled",
  "cousins"
]);

export function seedThrashing() {
  return {
    seed: "thrashing",
    issue: 88257,
    thrashing: true,
    responsive: false,
    stallMs: 40808,
    firstByteMs: 40832,
    rssMB: 2646,
    heapMB: 896,
    cpuMs: 40899,
    skillsAttachment: 12,
    safeMode: true
  };
}

export function seedResponsive() {
  return {
    seed: "responsive",
    issue: 88257,
    thrashing: false,
    responsive: true,
    stallMs: 0,
    firstByteMs: 2000,
    rssMB: null
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #89772 Bash-tool event-loop CPU spin, #91633 FileIndex large cwd, #88072 Desktop auto-updater, #92325 Desktop stalls discarded as sleep, #91941 Linux Desktop event-loop compound crash; primary stays #88257"
    );
    return {
      verdict: "cousins",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["cousins", "thrashing"]
    };
  }

  if (seed === "sleep-wake-mislabelled" || (t.sleepWakeMislabelled === true && seed === "sleep-wake-mislabelled")) {
    reasons.push(
      "stall detector tags [likely sleep/wake] but cpu=40899ms ≈ wall 40808ms; the tag is misleading — this is synchronous main-thread work, not a sleep"
    );
    return {
      verdict: "sleep-wake-mislabelled",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["sleep-wake-mislabelled", "thrashing", "cpu-bound-gap"]
    };
  }

  if (seed === "safe-mode-still-stalls" || (t.safeMode === true && seed === "safe-mode-still-stalls")) {
    reasons.push(
      "--safe-mode still stalls: [claudeai-mcp] Disabled in safe mode, Haiku, one-file git repo, no user MCP; first prompt still freezes ~40–60s"
    );
    return {
      verdict: "safe-mode-still-stalls",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["safe-mode-still-stalls", "thrashing"]
    };
  }

  if (seed === "cpu-bound-gap" || (t.cpuBoundGap === true && seed === "cpu-bound-gap")) {
    reasons.push(
      "silence between Sending 12 skills via attachment (initial) and API first byte after 40832ms; cpu=40899ms ≈ wall so CPU-bound, not I/O wait"
    );
    return {
      verdict: "cpu-bound-gap",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["cpu-bound-gap", "thrashing", "event-loop-stall"]
    };
  }

  if (seed === "rss-balloon" || (t.rssBalloon === true && seed === "rss-balloon")) {
    reasons.push(
      "RSS balloons to ~2.5–3.5 GB on first prompt (debug rss=2646MB heap=896MB ext=270MB); host has 62 GB so this is not memory pressure"
    );
    return {
      verdict: "rss-balloon",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["rss-balloon", "thrashing"]
    };
  }

  if (seed === "event-loop-stall" || (t.eventLoopStall === true && seed === "event-loop-stall")) {
    reasons.push(
      "event-loop-stall blocked for 40808ms (expected 200ms, actual 41008ms). Total stalls: 1, cumulative: 40808ms. TUI frozen; Ctrl+C often ignored until the stall ends"
    );
    return {
      verdict: "event-loop-stall",
      reasons,
      thrashing: true,
      responsive: false,
      chips: ["event-loop-stall", "thrashing"]
    };
  }

  if (seed === "responsive" || (t.responsive === true && t.thrashing !== true)) {
    reasons.push(
      "first prompt streams within a couple of seconds; terminal stays alive — the expected hold path from #88257"
    );
    return {
      verdict: "responsive",
      reasons,
      thrashing: false,
      responsive: true,
      chips: ["responsive"]
    };
  }

  if (
    t.thrashing === true ||
    seed === "thrashing" ||
    (typeof t.stallMs === "number" && t.stallMs >= 40000) ||
    (typeof t.rssMB === "number" && t.rssMB >= 2500)
  ) {
    reasons.push(
      "first prompt of every new process freezes the TUI ~40–60s: event-loop stall ~40808ms, ~100% CPU, RSS ~2.5–3.5 GB; every new process pays again"
    );
    const chips = ["thrashing"];
    if (t.eventLoopStall === true || (typeof t.stallMs === "number" && t.stallMs >= 40000)) {
      chips.push("event-loop-stall");
    }
    if (t.rssBalloon === true || (typeof t.rssMB === "number" && t.rssMB >= 2500)) {
      chips.push("rss-balloon");
    }
    if (t.cpuBoundGap === true || t.cpuApproxWall === true) {
      chips.push("cpu-bound-gap");
    }
    if (t.safeMode === true) chips.push("safe-mode-still-stalls");
    if (t.sleepWakeMislabelled === true) chips.push("sleep-wake-mislabelled");
    return { verdict: "thrashing", reasons, thrashing: true, responsive: false, chips };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, thrashing: false, responsive: true, chips: [seed] };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, thrashing: true, responsive: false, chips: [seed] };
  }

  reasons.push("empty probe; idle working set is thrashing");
  return { verdict: "thrashing", reasons, thrashing: true, responsive: false, chips: ["thrashing"] };
}
