/**
 * Bourdon-tube pressure-bay scorer.
 * A Bourdon tube should hold when the
 * system is idle. The Cowork/Code Apple
 * Virtualization VM instead accumulates
 * host-side file descriptors while idle
 * until kern.maxfiles ruptures the host.
 *
 * Encoded from #92510 issue facts only.
 * virtiofs / shared-folder host-handle
 * hypothesis is NON-BINDING. Verify nothing.
 */
export const CHIPS = [
  "saturating",
  "vented",
  "host-fd-409600",
  "guest-clean-512",
  "idle-12h-after-prompt",
  "virtiofs-suspect",
  "cmdq-releases",
  "cli-no-vm-clean",
  "cousins"
];

export const HOLD = new Set(["vented"]);

export const CONTROL = new Set(["cli-no-vm-clean"]);

export const ALARM = new Set([
  "saturating",
  "host-fd-409600",
  "guest-clean-512",
  "idle-12h-after-prompt",
  "virtiofs-suspect",
  "cousins"
]);

export function seedSaturating() {
  return {
    seed: "saturating",
    issue: 92510,
    saturating: true,
    vented: false,
    hostFd: 409600,
    guestFd: 512,
    idleHoursAfterPrompt: 12,
    version: "Claude Desktop (Cowork/Code VM)",
    platform: "macos"
  };
}

export function seedVented() {
  return {
    seed: "vented",
    issue: 92510,
    saturating: false,
    vented: true,
    cmdq: true,
    hostFd: 0,
    version: "Claude Desktop (Cowork/Code VM)",
    platform: "macos"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #79920 background-session daemon fd storm → ENFILE → launchd SIGBUS → kernel panic, #92069 Desktop over SSH / launchd 256 fd limit, #29573 long-session file-limit filesystem bug, older virtiofs/Cowork reports #26087 #47829 #26646 #65239 #47644 (guest panics / disk-write limits — different); primary stays #92510"
    );
    return {
      verdict: "cousins",
      reasons,
      saturating: true,
      vented: false,
      chips: ["cousins", "saturating"]
    };
  }

  if (seed === "cli-no-vm-clean" || (t.cliNoVm === true && seed === "cli-no-vm-clean")) {
    reasons.push(
      "Claude Code run from Terminal (no VM) does not exhibit this. Control, not the idle saturating path. Primary stays the Cowork/Code Apple Virtualization VM"
    );
    return {
      verdict: "cli-no-vm-clean",
      reasons,
      saturating: false,
      vented: true,
      chips: ["cli-no-vm-clean", "vented"]
    };
  }

  if (
    seed === "vented" ||
    (t.vented === true && t.saturating !== true && (t.cmdq === true || t.hostFd === 0))
  ) {
    reasons.push(
      "Bourdon already vented: Cmd+Q Claude Desktop releases the host descriptors immediately. Seeded word is vented"
    );
    return {
      verdict: "vented",
      reasons,
      saturating: false,
      vented: true,
      chips: ["vented"]
    };
  }

  if (
    seed === "cmdq-releases" ||
    (t.cmdq === true && seed === "cmdq-releases")
  ) {
    reasons.push(
      "Workaround from the issue: Cmd+Q Claude Desktop; kill the VM PID (Claude relaunches it on next use); connect a smaller subfolder. Quitting Desktop releases descriptors immediately"
    );
    return {
      verdict: "cmdq-releases",
      reasons,
      saturating: false,
      vented: true,
      chips: ["cmdq-releases", "vented"]
    };
  }

  if (
    seed === "host-fd-409600" ||
    (typeof t.hostFd === "number" && t.hostFd >= 409600 && seed === "host-fd-409600")
  ) {
    reasons.push(
      "Pressure snapshot (host, macOS): Claude-owned Apple Virtualization VM ~409,600 open file descriptors (~71% of kern.maxfiles, ~130x next-largest process). Codex/Node ~106,000 fds in an earlier snapshot (secondary)"
    );
    return {
      verdict: "host-fd-409600",
      reasons,
      saturating: true,
      vented: false,
      chips: ["host-fd-409600", "saturating"]
    };
  }

  if (
    seed === "guest-clean-512" ||
    (typeof t.guestFd === "number" && t.guestFd <= 512 && seed === "guest-clean-512")
  ) {
    reasons.push(
      "Guest side is clean: /proc/sys/fs/file-nr reports ~512 open files and ~5 processes shortly after boot (uptime 2 min; top process holds 4 fds). Leak is in the host-side VM process"
    );
    return {
      verdict: "guest-clean-512",
      reasons,
      saturating: true,
      vented: false,
      chips: ["guest-clean-512", "saturating"]
    };
  }

  if (
    seed === "idle-12h-after-prompt" ||
    (typeof t.idleHoursAfterPrompt === "number" && t.idleHoursAfterPrompt >= 12 && seed === "idle-12h-after-prompt")
  ) {
    reasons.push(
      "Count keeps growing with no prompt running; one occurrence hit 12 hours after the last prompt. An idle VM should not grow its fd usage"
    );
    return {
      verdict: "idle-12h-after-prompt",
      reasons,
      saturating: true,
      vented: false,
      chips: ["idle-12h-after-prompt", "saturating"]
    };
  }

  if (
    seed === "virtiofs-suspect" ||
    (t.virtiofsSuspect === true && seed === "virtiofs-suspect")
  ) {
    reasons.push(
      "Most likely the virtiofs / shared-folder layer not releasing host handles for files the guest has touched. Hypothesis only (NON-BINDING). Connected folder /development (~300k files). Do not invent source-code claims"
    );
    return {
      verdict: "virtiofs-suspect",
      reasons,
      saturating: true,
      vented: false,
      chips: ["virtiofs-suspect", "saturating"]
    };
  }

  if (
    t.saturating === true ||
    seed === "saturating" ||
    t.hostFdClimb === true ||
    (typeof t.hostFd === "number" && t.hostFd >= 409600)
  ) {
    reasons.push(
      "On macOS Apple Silicon the Apple Virtualization VM that Cowork/Code launches accumulates host-side open file descriptors continuously — including while completely idle. Snapshot ~409,600 fds (~71% of kern.maxfiles). When the system-wide limit is exhausted, macOS panics and reboots (1–5x/day if not caught)"
    );
    const chips = ["saturating"];
    if (typeof t.hostFd === "number" && t.hostFd >= 409600) chips.push("host-fd-409600");
    if (typeof t.guestFd === "number" && t.guestFd <= 512) chips.push("guest-clean-512");
    if (typeof t.idleHoursAfterPrompt === "number" && t.idleHoursAfterPrompt >= 12) {
      chips.push("idle-12h-after-prompt");
    }
    if (t.virtiofsSuspect === true) chips.push("virtiofs-suspect");
    return { verdict: "saturating", reasons, saturating: true, vented: false, chips };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, saturating: false, vented: true, chips: [seed] };
  }

  if (CONTROL.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, saturating: false, vented: true, chips: [seed] };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, saturating: true, vented: false, chips: [seed] };
  }

  reasons.push("empty probe; idle Bourdon tube is saturating");
  return { verdict: "saturating", reasons, saturating: true, vented: false, chips: ["saturating"] };
}
