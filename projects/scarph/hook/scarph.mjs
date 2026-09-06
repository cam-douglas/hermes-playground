/**
 * Scarph shipwright scarph-joint / faying-face scorer.
 * The -c bevel should carry the full Bash timber through
 * the joint. On Windows the node → bash.exe argv hand-off
 * shears the plank between 8,181 and 8,190 characters and
 * halves every doubled backslash (MS-CRT vs MSYS2).
 *
 * Encoded from #92543 issue facts only.
 * Hypothesis (NON-BINDING): CreateProcess/libuv argv
 * quoting on Windows applies MS-CRT escaping incompatible
 * with MSYS2 bash -c parsing, and an undocumented ~8K
 * practical ceiling shears before ENAMETOOLONG. Verify
 * nothing in closed source; encode issue facts only.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 */

export const CHIPS = [
  "sheared",
  "fayed",
  "argv-ceiling",
  "backslash-halved",
  "silent-cut",
  "stdin-bypass",
  "cousins"
];

export const HOLD = new Set(["fayed"]);

export const ALARM = new Set([
  "sheared",
  "argv-ceiling",
  "backslash-halved",
  "silent-cut",
  "stdin-bypass",
  "cousins"
]);

export const MEASURED = {
  cutWindowLow: 8181,
  cutWindowHigh: 8190,
  okLengths: [8100, 8180],
  failFrom: 8190,
  enametoolong: 32767,
  censusCommands: 7815,
  censusSessions: 37,
  truncationUnder8k: 0,
  failAt9kPlus: 25,
  failAt9kPlusOf: 29,
  userCeilingChars: 7000,
  userCeilingLines: 100,
  versions: ["2.1.263"],
  node: "v24.19.0",
  gitForWindows: "2.55.0",
  bash: "MSYS2 bash 5.3.15",
  os: "Windows 11 Enterprise",
  error: "unexpected EOF while looking for matching '",
  heredocError: "here-document delimited by end-of-file",
  pythonHalving: "SyntaxError: unterminated string literal"
};

export const COUSINS = [
  {
    id: 85856,
    note: "Windows/Git Bash: Bash tool silently halves backslashes (MSVCRT vs MSYS2 command-line encoding mismatch)"
  },
  {
    id: 89392,
    note: "Bash tool silently strips backslashes on Windows/Git Bash"
  },
  {
    id: 88311,
    note: "long-lived sessions: inlined shell snapshot exceeds command-line length and is sheared"
  },
  {
    id: 88561,
    note: "Bash tool silently collapses \\\\ to \\ in command text, corrupting regex and paths"
  },
  {
    id: 90421,
    note: "shell snapshot silently sheared at ~7.2KB on Windows Desktop — every Bash call fails with unexpected EOF"
  }
];

function num(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const argvLength = num(t.argvLength ?? t.argv_length ?? t.cArgLength ?? t.length);
  const cutLow = num(t.cutWindowLow ?? t.cut_low) ?? MEASURED.cutWindowLow;
  const cutHigh = num(t.cutWindowHigh ?? t.cut_high) ?? MEASURED.cutWindowHigh;
  const enametoolong = num(t.enametoolong ?? t.enameTooLong) ?? MEASURED.enametoolong;
  const startSeen =
    t.startSeen === true ||
    t.start === true ||
    String(t.stdout || "").includes("START");
  const endSeen =
    t.endSeen === true ||
    t.end === true ||
    String(t.stdout || "").includes("END");
  const unexpectedEof =
    t.unexpectedEof === true ||
    String(t.error || t.stderr || "").includes("unexpected EOF");
  const heredocEof =
    t.heredocEof === true ||
    String(t.error || t.stderr || "").includes("delimited by end-of-file");
  const halved =
    t.halved === true ||
    t.backslashHalved === true ||
    t.backslash_halved === true ||
    String(t.halving || "") === "A\\B" ||
    String(t.arrived || "").includes("A\\B");
  const viaStdin =
    t.viaStdin === true ||
    t.stdin === true ||
    t.tempFile === true ||
    t.bashDashS === true ||
    String(t.transport || "").includes("stdin") ||
    String(t.transport || "").includes("temp");
  const viaDashC =
    t.viaDashC === true ||
    t.dashC === true ||
    String(t.transport || t.kind || "").includes("-c");
  const inWindow =
    argvLength != null && argvLength >= cutLow && argvLength <= cutHigh;
  const overWindow = argvLength != null && argvLength >= MEASURED.failFrom;
  const underOk =
    argvLength != null && MEASURED.okLengths.includes(argvLength);
  const belowEnametoolong =
    argvLength != null && argvLength < enametoolong;
  const windows =
    t.windows === true ||
    String(t.platform || t.os || "").toLowerCase().includes("win");

  return {
    argvLength,
    cutLow,
    cutHigh,
    enametoolong,
    startSeen,
    endSeen,
    unexpectedEof,
    heredocEof,
    halved,
    viaStdin,
    viaDashC,
    inWindow,
    overWindow,
    underOk,
    belowEnametoolong,
    windows,
    error: t.error || (unexpectedEof ? MEASURED.error : ""),
    version: t.version || "2.1.263",
    platform: t.platform || "windows"
  };
}

export function seedSheared() {
  return {
    seed: "sheared",
    issue: 92543,
    sheared: true,
    fayed: false,
    viaDashC: true,
    windows: true,
    argvLength: 8190,
    startSeen: true,
    endSeen: false,
    unexpectedEof: true,
    halved: true,
    error: MEASURED.error,
    version: "2.1.263",
    node: "v24.19.0",
    gitForWindows: "2.55.0",
    bash: "MSYS2 bash 5.3.15",
    platform: "windows",
    os: "Windows 11 Enterprise"
  };
}

export function seedFayed() {
  return {
    seed: "fayed",
    issue: 92543,
    sheared: false,
    fayed: true,
    viaStdin: true,
    tempFile: true,
    viaDashC: false,
    windows: true,
    argvLength: 8190,
    startSeen: true,
    endSeen: true,
    unexpectedEof: false,
    halved: false,
    version: "2.1.263",
    platform: "windows"
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const joint = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #85856 MSVCRT vs MSYS2 backslash halving; #89392 silently strips backslashes on Windows/Git Bash; #88311 inlined snapshot exceeds command-line length; #88561 \\\\ collapses to \\ corrupting regex and paths; #90421 Desktop snapshot sheared at ~7.2KB with unexpected EOF. Same Windows node→bash.exe argv neighbourhood. Primary stays #92543. #92539 is a different Remove-Item spaced-path false-positive guard — not this joint"
    );
    return {
      verdict: "cousins",
      reasons,
      sheared: true,
      fayed: false,
      chips: ["cousins", "sheared"],
      joint
    };
  }

  if (
    seed === "fayed" ||
    (t.fayed === true && t.sheared !== true && seed !== "stdin-bypass")
  ) {
    reasons.push(
      "faying faces carry the full timber. Script handed via stdin or a temp file (bash <file> / bash -s) instead of as a -c argument, so the ~8181 bevel never shears the plank and doubled backslashes stay doubled. Seeded word is fayed"
    );
    return {
      verdict: "fayed",
      reasons,
      sheared: false,
      fayed: true,
      chips: ["fayed"],
      joint
    };
  }

  if (seed === "stdin-bypass" || t.stdinBypass === true) {
    reasons.push(
      "Suggested rail only, not claimed implemented: hand the script to bash via stdin or a temp file (bash <file> / bash -s) instead of as a -c argument — that removes both the length cap and the backslash re-interpretation. Failing that, refuse assembled -c over ~8,100 with a clear message"
    );
    return {
      verdict: "stdin-bypass",
      reasons,
      sheared: true,
      fayed: false,
      chips: ["stdin-bypass", "sheared"],
      joint
    };
  }

  if (
    seed === "silent-cut" ||
    t.silentCut === true ||
    (joint.startSeen && joint.endSeen === false && seed === "silent-cut")
  ) {
    reasons.push(
      "8100 and 8180 print START+END. 8190+ print only START — tail gone, sometimes no error. Bash may report unexpected EOF while looking for matching ' (or a here-document delimited by end-of-file). The ' rewrite makes the error line point at the last quote before the cut — a phantom quoting bug. Expected: command runs OR tool says too long. Today: silent shear + misleading quoting error"
    );
    return {
      verdict: "silent-cut",
      reasons,
      sheared: true,
      fayed: false,
      chips: ["silent-cut", "sheared"],
      joint
    };
  }

  if (
    seed === "backslash-halved" ||
    t.backslashHalved === true ||
    (joint.halved && seed === "backslash-halved")
  ) {
    reasons.push(
      "Every doubled backslash arrives halved: A\\\\B → A\\B, G\\\\\\\\H → G\\\\H, including inside quoted heredocs. Cause: libuv quotes by MS-CRT rules (backslash doubled only before \") while MSYS2 parses \\\\ inside double-quoted args as escape. Writing the same script to a file and running the file is byte-exact. Census also saw Python heredoc SyntaxError from the halving"
    );
    return {
      verdict: "backslash-halved",
      reasons,
      sheared: true,
      fayed: false,
      chips: ["backslash-halved", "sheared"],
      joint
    };
  }

  if (
    seed === "argv-ceiling" ||
    t.argvCeiling === true ||
    (joint.overWindow && seed === "argv-ceiling")
  ) {
    reasons.push(
      "The -c argument is cut off between 8,181 and 8,190 characters. libuv only refuses at 32,767 (ENAMETOOLONG), so ~7.5K–32K fails with no length diagnostic. Census: 7,815 Bash commands / 37 sessions — 0 shear failures under 8K expanded chars; 25 of 29 at 9K+. Through the Bash tool the user's command ceiling is lower (~7,000 chars / ~100 lines) because wrapper text + '\"'\"' expansion share the same ~8K budget"
    );
    return {
      verdict: "argv-ceiling",
      reasons,
      sheared: true,
      fayed: false,
      chips: ["argv-ceiling", "sheared"],
      joint
    };
  }

  if (
    t.sheared === true ||
    seed === "sheared" ||
    (joint.viaDashC && (joint.overWindow || joint.unexpectedEof || joint.halved))
  ) {
    reasons.push(
      "The scarph should carry the full timber length through the joint; here the -c bevel shears the plank mid-scarf between 8181–8190 chars and halves every doubled backslash like a mis-cut faying surface. Wrapper: source snapshot && export TEMP=... && eval '<command with each ' rewritten as '\"'\"'>' && pwd -P >| cwdfile. Repro needs no Claude Code: Node spawnSync of bash.exe -c"
    );
    const chips = ["sheared"];
    if (joint.overWindow || joint.inWindow || t.argvCeiling === true) {
      chips.push("argv-ceiling");
    }
    if (joint.halved || t.backslashHalved === true) {
      chips.push("backslash-halved");
    }
    if ((joint.startSeen && !joint.endSeen) || joint.unexpectedEof || t.silentCut === true) {
      chips.push("silent-cut");
    }
    return {
      verdict: "sheared",
      reasons,
      sheared: true,
      fayed: false,
      chips: [...new Set(chips)],
      joint
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, sheared: false, fayed: true, chips: [seed], joint };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, sheared: true, fayed: false, chips: [seed], joint };
  }

  reasons.push(
    "empty probe; idle scarph bench is sheared — the -c bevel cuts the plank mid-joint between 8181–8190 and halves every doubled backslash"
  );
  return {
    verdict: "sheared",
    reasons,
    sheared: true,
    fayed: false,
    chips: ["sheared"],
    joint
  };
}
