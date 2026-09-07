/**
 * Seizing — sailmaker's / bosun's seizing bench.
 *
 * An EDR adds a transient second hard link to every newly created
 * file on the boot volume (nlink 1→2→1, same inode/dev/size/owner/
 * mode/content). Claude Code's Bash output-file identity check
 * treats that as a replaced file, then SIGTERM→SIGKILL (~5s) with
 * exit 137 and "output file was replaced or could no longer be
 * verified".
 *
 * Encoded from anthropics/claude-code#92586 issue facts only.
 * Hypothesis (NON-BINDING): the identity check may be using nlink
 * or a fingerprint that breaks when an EDR adds a transient hard
 * link. Verify nothing in closed source; encode issue facts only.
 * No network. No exploits. No live Claude.
 */

export const CHIPS = [
  "culled",
  "sole",
  "nlink-spike",
  "sigkill-5s",
  "ramdisk-ok",
  "cousins"
];

export const HOLD = new Set(["sole", "ramdisk-ok"]);

export const ALARM = new Set([
  "culled",
  "nlink-spike",
  "sigkill-5s",
  "cousins"
]);

export const IDLE_WORD = "culled";
export const SEEDED_WORD = "sole";

export const MEASURED = {
  issue: 92586,
  title:
    "Bash tool kills every command after ~5s (\"output file was replaced or could no longer be verified\") when an EDR transiently hard-links new files",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:macos",
    "area:bash",
    "area:sandbox"
  ],
  filed: "2026-09-07T02:57:31Z",
  updated: "2026-09-07T03:33:08Z",
  reporter: "jskoo-dp",
  version: "2.1.263",
  alsoReproduced: "2.1.260",
  identityCheckSince: "2.1.251",
  platform: "macos",
  os: "macOS 26.3 (Darwin 25.3.0), Apple Silicon",
  edr: "Genian Insights EDR (system extension)",
  exitCode: 137,
  sigtermAt: "+5s",
  nlinkSequence: [1, 2, 1],
  nlinkWindowSeconds: [1, 8],
  unchanged: ["inode", "dev", "size", "owner", "mode", "content"],
  pollCommand: "stat -f %l",
  pollLocations: ["/tmp", "$HOME", "~/.claude", "0700 dir"],
  error:
    "Command killed: its output file was replaced or could no longer be verified",
  outputUnavailable:
    "bash output unavailable: output file /private/tmp/claude-501/<project>/<session>/tasks/<id>.output could not be read (unknown). This usually means another Claude Code process in the same project deleted it during startup cleanup.",
  identityCheckNote:
    "output-file identity check introduced in 2.1.251 (\"a sandboxed command cannot redirect or replace them\")",
  expected:
    "A transient extra hard link with unchanged dev/inode is not a replaced file. Compare device and inode (and possibly owner/mode), or retry before killing. The error blaming another Claude Code process startup cleanup is misleading.",
  repro:
    "claude -p \"run: echo hi && sleep 7 && echo alive\" --allowedTools 'Bash(echo:*)'",
  bisection: [
    {
      config: "default tmp dir (boot volume)",
      result: "killed, 137"
    },
    {
      config: "CLAUDE_CODE_TMPDIR=~/cctmp (boot volume, 0700)",
      result: "killed, 137"
    },
    {
      config: "CLAUDE_CODE_TMPDIR=/Volumes/<apfs-ramdisk>/t",
      result: "works"
    },
    {
      config: "CLAUDE_CODE_TMPDIR=/Volumes/<apfs-sparseimage>/t",
      result: "works"
    }
  ],
  workaround:
    "Point CLAUDE_CODE_TMPDIR at a directory on a separately mounted volume (settings.json env works).",
  shortCommand:
    "pwd also fails: command runs and the output file contains the correct output, but the read-back is reported as failed. Read tool reads the same file fine. No other Claude Code process is active.",
  sandboxedOrNot:
    "Every Bash tool call, foreground or background, sandboxed or with dangerouslyDisableSandbox."
};

export const COUSINS = [
  {
    id: 92590,
    state: "open",
    note: "Cite-only cousin. sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set. Linux bubblewrap; related TMPDIR surface, different failure. Primary stays #92586."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "scarph",
    issue: 92543,
    note: "Scarph/#92543: Windows Bash -c ~8181 truncate + backslash halving. Different defect."
  },
  {
    slug: "kerf",
    issue: 92539,
    note: "Kerf/#92539: Remove-Item spaced-path false positive. Different defect."
  },
  {
    slug: "cringle",
    issue: 92542,
    note: "Cringle/#92542: deny unwrap 8-item wrapper bypass. Different defect."
  },
  {
    slug: "gland",
    issue: 92533,
    note: "Gland/#92533: Bash function-hook strips worktree isolation. Different defect."
  },
  {
    slug: "demurrage",
    issue: 92548,
    note: "Demurrage/#92548: daemon chat process leak. Different defect."
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification with no assistant turn. Different defect."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: cold parent voids child-completion queue. Different paradigm."
  },
  {
    slug: "holdfast",
    issue: 92112,
    note: "Holdfast/#92112: mid-session --worktree cwd guard. Different paradigm."
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function replacedError(text = "") {
  return /output file was replaced or could no longer be verified|another Claude Code process in the same project deleted it during startup cleanup/i.test(
    String(text || "")
  );
}

export function nlinkSpiked(value) {
  if (Array.isArray(value) && value.some((n) => Number(n) > 1)) return true;
  if (typeof value === "number" && value > 1) return true;
  return false;
}

export function ramdiskVolume(text = "") {
  return /apfs-ramdisk|apfs-sparseimage|\/Volumes\/|sparse ?image|ram ?disk/i.test(
    String(text || "")
  );
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const nlink = t.nlink ?? t.nlinkSequence;
  const spike =
    boolish(t.nlinkSpike) ||
    nlinkSpiked(nlink) ||
    /nlink\s*=\s*2|nlink 1\s*→\s*2|1 → 2 → 1|1→2→1/i.test(blob);
  const killed137 =
    Number(t.exitCode ?? t.exit) === 137 ||
    (Array.isArray(t.bashCalls) && t.bashCalls.some((c) => Number(c.exit) === 137)) ||
    /exit(?: code)? 137|killed, 137/i.test(blob);
  const sigterm5s =
    boolish(t.sigkill5s) ||
    /\+5s|SIGTERM|SIGKILL/i.test(blob);
  const replaced = replacedError(blob) || boolish(t.replaced);
  const ramdisk =
    boolish(t.ramdiskOk) ||
    ramdiskVolume(t.tmpdir || "") ||
    ramdiskVolume(blob);
  const survived =
    boolish(t.survived) ||
    boolish(t.sole) ||
    (Array.isArray(t.bashCalls) && t.bashCalls.some((c) => Number(c.exit) === 0 && c.ran));
  const inodeUnchanged = t.inodeUnchanged !== false;
  const bootVolume =
    t.volume === "boot" ||
    boolish(t.bootVolume) ||
    /boot volume|default tmp|~\/cctmp/i.test(blob);
  return {
    spike,
    killed137,
    sigterm5s,
    replaced,
    ramdisk,
    survived,
    inodeUnchanged,
    bootVolume
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const culled =
    boolish(t.culled) ||
    (print.killed137 && print.spike && !boolish(t.sole));
  const sole =
    boolish(t.sole) ||
    (print.survived && !print.killed137 && !boolish(t.culled));
  const nlinkSpike = boolish(t.nlinkSpike) || print.spike;
  const sigkill5s = boolish(t.sigkill5s) || print.sigterm5s;
  const ramdiskOk =
    boolish(t.ramdiskOk) ||
    (print.ramdisk && print.survived && !print.killed137);
  return {
    culled,
    sole,
    nlinkSpike,
    sigkill5s,
    ramdiskOk,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    fingerprint: print,
    version: t.version || MEASURED.version,
    platform: t.platform || MEASURED.platform
  };
}

export function seedCulled() {
  return {
    seed: "culled",
    issue: 92586,
    culled: true,
    sole: false,
    nlinkSpike: true,
    exitCode: 137,
    platform: "macos",
    version: MEASURED.version
  };
}

export function seedSole() {
  return {
    seed: "sole",
    issue: 92586,
    culled: false,
    sole: true,
    nlinkSpike: false,
    survived: true,
    nlink: [1],
    platform: "macos",
    version: MEASURED.version
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const seizing = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92590 sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set (Linux bubblewrap; related TMPDIR surface, different failure). Not Scarph/#92543 Windows Bash -c shear. Not Kerf/#92539 Remove-Item spaced-path. Not Cringle/#92542 deny unwrap. Not Gland/#92533 Bash-hook-strips-worktree-isolation. Not Demurrage/#92548 daemon leak. Not Larum/#92563 written-notice-with-no-turn. Not Oubliette/#92095. Not Holdfast/#92112. Primary stays #92586"
    );
    return {
      verdict: "cousins",
      reasons,
      culled: true,
      sole: false,
      chips: ["cousins", "culled"],
      seizing
    };
  }

  if (seed === "sigkill-5s" || (t.sigkill5s === true && seed !== "culled" && seed !== "sole")) {
    reasons.push(
      "trap recorded SIGTERM at exactly +5s from the parent claude process; the loop kept writing after that until SIGKILL; exit 137. Error: Command killed: its output file was replaced or could no longer be verified"
    );
    return {
      verdict: "sigkill-5s",
      reasons,
      culled: true,
      sole: false,
      chips: ["sigkill-5s", "culled"],
      seizing
    };
  }

  if (seed === "nlink-spike" || (t.nlinkSpike === true && seed !== "culled" && seed !== "sole")) {
    reasons.push(
      "polling stat -f %l on new files in /tmp, $HOME, ~/.claude, a 0700 dir shows nlink 1→2→1 within ~8s. Inode, size, owner, mode, content never change. On a separately mounted APFS RAM disk or sparse image, nlink stays 1"
    );
    return {
      verdict: "nlink-spike",
      reasons,
      culled: true,
      sole: false,
      chips: ["nlink-spike", "culled"],
      seizing
    };
  }

  if (seed === "ramdisk-ok" || t.ramdiskOk === true) {
    reasons.push(
      "ramdisk-ok — CLAUDE_CODE_TMPDIR on APFS ramdisk or sparseimage: nlink stays 1 and the command survives. Default tmp and ~/cctmp on the boot volume are killed 137. Hold path"
    );
    return {
      verdict: "ramdisk-ok",
      reasons,
      culled: false,
      sole: true,
      chips: ["ramdisk-ok", "sole"],
      seizing
    };
  }

  if (
    seed === "sole" ||
    (t.sole === true && t.culled !== true && seed !== "culled") ||
    (seizing.sole && !seizing.culled && seed !== "culled" && seed !== "nlink-spike")
  ) {
    reasons.push(
      "seizing already sole — nlink=1 identity holds; a transient extra hard link with unchanged dev/inode is not a replaced file. Seeded word is sole"
    );
    return {
      verdict: "sole",
      reasons,
      culled: false,
      sole: true,
      chips: t.ramdiskOk === true || seed === "ramdisk-ok"
        ? ["sole", "ramdisk-ok"]
        : ["sole"],
      seizing
    };
  }

  if (
    t.culled === true ||
    seed === "culled" ||
    (seizing.culled && !seizing.sole)
  ) {
    reasons.push(
      "A seizing should keep the Bash output eye sole through an EDR's transient second hard link. The identity check treats nlink>1 on the same inode as a replaced file — every command dies ~5s after start, exit 137. Short commands like pwd run and the output file has correct content, but read-back is reported failed"
    );
    const chips = ["culled"];
    if (t.nlinkSpike === true || seizing.nlinkSpike) chips.push("nlink-spike");
    if (t.sigkill5s === true || seizing.sigkill5s) chips.push("sigkill-5s");
    return {
      verdict: "culled",
      reasons,
      culled: true,
      sole: false,
      chips: [...new Set(chips)],
      seizing
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, culled: false, sole: true, chips: [seed], seizing };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      culled: true,
      sole: false,
      chips: [seed],
      seizing
    };
  }

  reasons.push(
    "empty probe; idle seizing bench is culled — an EDR transient second hard link on the same inode is treated as a replaced output file, so every Bash command is killed at ~5s"
  );
  return {
    verdict: "culled",
    reasons,
    culled: true,
    sole: false,
    chips: ["culled"],
    seizing
  };
}
