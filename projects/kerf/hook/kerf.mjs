/**
 * Kerf joiner's / sawyer's kerf-gauge scorer.
 * The Remove-Item guard should bind only to the argument
 * actually passed to Remove-Item. On Windows it instead
 * scans the whole command for the verb plus anything
 * path-shaped, rives the path at the first space (even
 * inside quotes), and treats the leading fragment as a
 * protected drive root — blocking TEMP cleanup because
 * a spaced path is mentioned elsewhere.
 *
 * Encoded from #92539 issue facts only.
 * Hypothesis (NON-BINDING): the Remove-Item guard
 * tokenizes command text on whitespace without respecting
 * quotes and pairs the Remove-Item verb with any
 * path-shaped substring, never consulting the actual AST
 * argument to Remove-Item. Verify nothing in closed
 * source; encode issue facts only.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 */

export const CHIPS = [
  "riven",
  "argbound",
  "baseline-pass",
  "nospace-pass",
  "program-files-block",
  "user-dir-block",
  "reversed-order-block",
  "cousins"
];

export const HOLD = new Set(["argbound"]);

export const ALARM = new Set([
  "riven",
  "baseline-pass",
  "nospace-pass",
  "program-files-block",
  "user-dir-block",
  "reversed-order-block",
  "cousins"
]);

export const MEASURED = {
  issue: 92539,
  title: "Windows: Remove-Item guard blocks any command containing a path with a space",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:sandbox"],
  updated: "2026-09-06T19:25:55Z",
  filed: "2026-09-06T19:24:56Z",
  reporter: "tonibunaiasu",
  os: "Windows 11 Pro 10.0.22631",
  powershell: "7.6.5",
  model: "Opus 4.5",
  client: "Claude Code desktop (Code tab)",
  message: "This path is protected from removal.",
  errorProgram: `Remove-Item on system path '"C:\\Program' is blocked. This path is protected from removal.`,
  errorUserDir: `Remove-Item on system path '"C:\\AI' is blocked. This path is protected from removal.`,
  fragmentProgram: `'"C:\\Program'`,
  fragmentUserDir: `'"C:\\AI'`,
  deleteTarget: "$env:TEMP\\probe.txt",
  nospaceMention: "C:\\Python314\\python.exe",
  spacedProgram: "C:\\Program Files\\Git\\bin\\bash.exe",
  spacedUserDir: "C:\\AI Projects\\README.md",
  bundledHint: "claude.exe under claude_agent_sdk/_bundled/",
  impact: "any project folder with a space makes every cleanup unrunnable"
};

export const REPROS = {
  baseline: [
    "$t = \"$env:TEMP\\probe.txt\"",
    "\"x\" | Set-Content $t",
    "Remove-Item $t -ErrorAction SilentlyContinue"
  ].join("\n"),
  nospace: [
    "$t = \"$env:TEMP\\probe.txt\"",
    "\"x\" | Set-Content $t",
    "Remove-Item $t -ErrorAction SilentlyContinue",
    "$other = \"C:\\Python314\\python.exe\""
  ].join("\n"),
  programFiles: [
    "$t = \"$env:TEMP\\probe.txt\"",
    "\"x\" | Set-Content $t",
    "Remove-Item $t -ErrorAction SilentlyContinue",
    "& \"C:\\Program Files\\Git\\bin\\bash.exe\" -c \"echo hello\""
  ].join("\n"),
  userDir: [
    "$t = \"$env:TEMP\\probe.txt\"",
    "\"x\" | Set-Content $t",
    "Remove-Item $t -ErrorAction SilentlyContinue",
    "$other = \"C:\\AI Projects\\README.md\""
  ].join("\n"),
  reversed: [
    "$other = \"C:\\AI Projects\\README.md\"",
    "$t = \"$env:TEMP\\probe.txt\"",
    "\"x\" | Set-Content $t",
    "Remove-Item $t -ErrorAction SilentlyContinue"
  ].join("\n")
};

export const COUSINS = [
  {
    id: 90645,
    note: "PowerShell safety guard: Spanish word del inside a quoted commit message treated as Remove-Item, then blocks on a quote-split path fragment — same guard neighbourhood, different trigger"
  },
  {
    id: 73524,
    note: "PowerShell tool: non-overridable Remove-Item on system path guard over-blocks legitimate commands (AST target mis-attribution) — same guard neighbourhood, different defect"
  },
  {
    id: 73882,
    note: "PowerShell safety guard false positive: here-string body text with paths like /requirements.txt blocked as 'Remove-Item on system path' — same guard neighbourhood, different trigger"
  },
  {
    id: 66549,
    note: "CLOSED historical: built-in command-safety analyzer false-positives on quoted Windows paths with spaces"
  },
  {
    id: 78513,
    note: "CLOSED historical: PowerShell guard blocks Remove-Item for any direct child of a drive root"
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

export function rivenFragments(command) {
  const text = String(command ?? "");
  const fragments = [];
  const re = /["']?[A-Za-z]:\\[^\r\n]*/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const raw = match[0];
    const spaceAt = raw.search(/\s/);
    const cleaved = spaceAt === -1 ? raw : raw.slice(0, spaceAt);
    fragments.push({
      raw,
      cleaved,
      hadSpace: spaceAt !== -1,
      quoteKept: cleaved.startsWith("\"") || cleaved.startsWith("'")
    });
  }
  return fragments;
}

export function removeItemArgs(command) {
  const text = String(command ?? "");
  const args = [];
  const re = /Remove-Item\s+("(?:[^"]*)"|'(?:[^']*)'|[^\s;]+)/gi;
  let match;
  while ((match = re.exec(text)) !== null) {
    args.push(match[1]);
  }
  return args;
}

export function rivenWouldBlock(command) {
  const text = String(command ?? "");
  if (!/Remove-Item/i.test(text)) return { blocked: false, fragment: "" };
  const hit = rivenFragments(text).find((f) => f.hadSpace);
  if (!hit) return { blocked: false, fragment: "" };
  return { blocked: true, fragment: hit.cleaved };
}

export function argboundWouldBlock(command, deleteTarget) {
  const args = removeItemArgs(command);
  const target = String(deleteTarget ?? args[0] ?? "");
  const tempish =
    /TEMP\\probe\.txt/i.test(target) ||
    /\$t\b/.test(target) ||
    /\$env:TEMP/i.test(target);
  return { blocked: !tempish && /[A-Za-z]:\\Windows|[A-Za-z]:\\Program Files$/i.test(target), target, args };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const command = String(t.command ?? t.text ?? t.cmd ?? "");
  const fragments = command ? rivenFragments(command) : [];
  const args = command ? removeItemArgs(command) : [];
  const rivenHit = command ? rivenWouldBlock(command) : { blocked: false, fragment: String(t.fragment || "") };
  const target = String(t.deleteTarget ?? t.removeItemArg ?? MEASURED.deleteTarget);
  const argHit = command ? argboundWouldBlock(command, target) : { blocked: false, target, args };
  const hasVerb =
    boolish(t.hasRemoveItem) ||
    /Remove-Item/i.test(command) ||
    args.length > 0;
  const spacedMention =
    boolish(t.spacedPath) ||
    fragments.some((f) => f.hadSpace) ||
    /Program Files|AI Projects|My Documents/i.test(command);
  const nospaceMention =
    boolish(t.nospacePath) ||
    /Python314/i.test(command);
  const reversed =
    boolish(t.reversed) ||
    boolish(t.reversedOrder);
  const windows =
    t.windows === true ||
    String(t.platform || t.os || "").toLowerCase().includes("win");
  const riven =
    boolish(t.riven) ||
    rivenHit.blocked ||
    boolish(t.blocked);
  const argbound =
    boolish(t.argbound) ||
    (boolish(t.hold) && !riven);

  return {
    command,
    fragments,
    args,
    hasVerb,
    spacedMention,
    nospaceMention,
    reversed,
    windows,
    riven,
    argbound,
    blockedFragment: rivenHit.fragment || t.fragment || "",
    deleteTarget: target,
    argboundBlocked: argHit.blocked,
    error: t.error || (rivenHit.blocked
      ? `Remove-Item on system path '${rivenHit.fragment}' is blocked. This path is protected from removal.`
      : ""),
    version: t.version || "",
    platform: t.platform || "windows",
    os: t.os || MEASURED.os
  };
}

export function seedRiven() {
  return {
    seed: "riven",
    issue: 92539,
    riven: true,
    argbound: false,
    blocked: true,
    spacedPath: true,
    command: REPROS.programFiles,
    deleteTarget: MEASURED.deleteTarget,
    fragment: "\"C:\\Program",
    error: MEASURED.errorProgram,
    windows: true,
    platform: "windows",
    os: MEASURED.os,
    powershell: MEASURED.powershell,
    model: MEASURED.model
  };
}

export function seedArgbound() {
  return {
    seed: "argbound",
    issue: 92539,
    riven: false,
    argbound: true,
    blocked: false,
    command: REPROS.programFiles,
    deleteTarget: MEASURED.deleteTarget,
    windows: true,
    platform: "windows",
    os: MEASURED.os
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const kerf = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #90645 Spanish del inside a quoted commit message treated as Remove-Item then quote-split path fragment; #73524 non-overridable Remove-Item on system path guard over-blocks via AST target mis-attribution; #73882 here-string body text with paths like /requirements.txt blocked as Remove-Item on system path; #66549 CLOSED historical quoted Windows paths with spaces; #78513 CLOSED historical Remove-Item of any direct child of a drive root. Same PowerShell Remove-Item / protected-from-removal neighbourhood, different defect. Primary stays #92539. #92543 is Windows Bash -c shear — not this groove. #92542 is deny unwrap wrapper bypass — not this groove"
    );
    return {
      verdict: "cousins",
      reasons,
      riven: true,
      argbound: false,
      chips: ["cousins", "riven"],
      kerf
    };
  }

  if (
    seed === "argbound" ||
    (t.argbound === true && t.riven !== true && seed !== "baseline-pass" && seed !== "nospace-pass")
  ) {
    reasons.push(
      "kerf bound to the real Remove-Item argument. Guard resolves only the argument(s) actually passed to Remove-Item against the protected list. TEMP throwaway is not a protected location, so a spaced mention elsewhere does not block cleanup. Seeded word is argbound"
    );
    return {
      verdict: "argbound",
      reasons,
      riven: false,
      argbound: true,
      chips: ["argbound"],
      kerf
    };
  }

  if (seed === "reversed-order-block" || t.reversedOrder === true || t.reversed === true) {
    reasons.push(
      "Reversed order — spaced path BEFORE Remove-Item — still BLOCKED. Not proximity or line based. Guard scans the whole command for the verb Remove-Item AND anything path-shaped; blocks on the pair. Deletion target never consulted"
    );
    return {
      verdict: "reversed-order-block",
      reasons,
      riven: true,
      argbound: false,
      chips: ["reversed-order-block", "riven"],
      kerf
    };
  }

  if (seed === "user-dir-block" || t.userDirBlock === true) {
    reasons.push(
      "Ordinary user directory with a space — BLOCKED: $other = \"C:\\AI Projects\\README.md\" → Remove-Item on system path '\"C:\\AI' is blocked. C:\\AI Projects is a user working dir, not a system path. Leading quote included; cleaved at the space"
    );
    return {
      verdict: "user-dir-block",
      reasons,
      riven: true,
      argbound: false,
      chips: ["user-dir-block", "riven"],
      kerf
    };
  }

  if (seed === "program-files-block" || t.programFilesBlock === true) {
    reasons.push(
      "Path with a space — BLOCKED: same TEMP cleanup + & \"C:\\Program Files\\Git\\bin\\bash.exe\" -c \"echo hello\" → Remove-Item on system path '\"C:\\Program' is blocked. This path is protected from removal. Leading quote included; cleaved at the space"
    );
    return {
      verdict: "program-files-block",
      reasons,
      riven: true,
      argbound: false,
      chips: ["program-files-block", "riven"],
      kerf
    };
  }

  if (seed === "nospace-pass" || t.nospacePass === true) {
    reasons.push(
      "Path without space mentioned — passes: same TEMP cleanup + $other = \"C:\\Python314\\python.exe\". No whitespace to cleave, so the riven scan does not invent a protected root. Control contrast only — the guard still scans the whole command"
    );
    return {
      verdict: "nospace-pass",
      reasons,
      riven: false,
      argbound: false,
      chips: ["nospace-pass"],
      kerf
    };
  }

  if (seed === "baseline-pass" || t.baselinePass === true) {
    reasons.push(
      "Baseline — passes: Set-Content + Remove-Item on $env:TEMP\\probe.txt. The deleted file is a throwaway in %TEMP%. Control contrast only — no spaced Windows path is mentioned"
    );
    return {
      verdict: "baseline-pass",
      reasons,
      riven: false,
      argbound: false,
      chips: ["baseline-pass"],
      kerf
    };
  }

  if (
    t.riven === true ||
    seed === "riven" ||
    (kerf.riven && !kerf.argbound)
  ) {
    reasons.push(
      "The kerf should bind Remove-Item protection to the real delete argument; instead the saw rives any spaced Windows path in the whole command. Program Files → \"C:\\Program. AI Projects → \"C:\\AI. TEMP cleanup is blocked. Error names a fragment, not a real path. Message string protected from removal is in bundled claude.exe under claude_agent_sdk/_bundled/ — product behaviour, not a user hook"
    );
    const chips = ["riven"];
    if (t.programFilesBlock === true || /Program Files/i.test(t.command || kerf.command)) {
      chips.push("program-files-block");
    }
    if (t.userDirBlock === true || /AI Projects/i.test(t.command || kerf.command)) {
      chips.push("user-dir-block");
    }
    if (t.reversed === true || t.reversedOrder === true) {
      chips.push("reversed-order-block");
    }
    return {
      verdict: "riven",
      reasons,
      riven: true,
      argbound: false,
      chips: [...new Set(chips)],
      kerf
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, riven: false, argbound: true, chips: [seed], kerf };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, riven: seed !== "baseline-pass" && seed !== "nospace-pass", argbound: false, chips: [seed], kerf };
  }

  reasons.push(
    "empty probe; idle kerf-gauge bench is riven — whole-command path scan cleaves at the first space and treats the leading fragment as a protected root while the actual delete target is TEMP"
  );
  return {
    verdict: "riven",
    reasons,
    riven: true,
    argbound: false,
    chips: ["riven"],
    kerf
  };
}
