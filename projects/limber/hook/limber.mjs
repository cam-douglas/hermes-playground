/**
 * Limber — limber-hole / limber-board bilge drain bench.
 *
 * Limber holes MUST drain bilge water to the pump well.
 * Here CLAUDE_CODE_TMPDIR points TMPDIR at a HOME scratch dir,
 * but the sandbox write allowlist keeps the literal token
 * "$TMPDIR" unexpanded, so mktemp and nested sockets hit
 * Read-only / EPERM — the limbers are silted. When the
 * allowlist expands/resolves the real temp root, they are drained.
 *
 * Encoded from anthropics/claude-code#92590 issue facts only.
 * Hypothesis (NON-BINDING): write-allowlist builder may insert
 * the literal token "$TMPDIR" without expanding it, so the path
 * CLAUDE_CODE_TMPDIR pointed at never matches the allowlist even
 * though the session sets TMPDIR to that directory. Expanding
 * $TMPDIR when building the write allowlist, or resolving the
 * sandbox temp root independently, would make the documented
 * contract true. Verify against issue text only; do not claim
 * unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "silted",
  "drained",
  "literal-token",
  "mktemp-readonly",
  "nested-socket-eperm",
  "guidance-says-writable",
  "failIfUnavailable-refuses",
  "settings-revert-blocked",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["drained"]);

export const ALARM = new Set([
  "silted",
  "literal-token",
  "mktemp-readonly",
  "nested-socket-eperm",
  "guidance-says-writable",
  "failIfUnavailable-refuses",
  "settings-revert-blocked",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "silted";
export const SEEDED_WORD = "drained";

export const MEASURED = {
  issue: 92590,
  title: "sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set",
  state: "open",
  labels: ["bug", "has repro", "platform:linux", "area:sandbox"],
  filed: "2026-09-07T03:57:45Z",
  updated: "2026-09-07T03:58:45Z",
  reporter: "CameronBrooks11",
  comments: 0,
  os: "Linux (Debian trixie)",
  app: "Claude Code 2.1.263",
  cliVersion: "2.1.263",
  bubblewrap: "0.12.0",
  sandboxEnabled: true,
  failIfUnavailable: true,
  claudeCodeTmpdir: "$HOME/.local/state/scratch",
  tmpdirUnderHome: true,
  tmpdirOutsideWorkspace: true,
  sessionSetsTmpdir: true,
  writesDenied: true,
  mktempFails: true,
  mktempError: "Read-only file system",
  mktempTemplate: "/home/<user>/.local/state/scratch/tmp.XXXXXX",
  echoTmpdirMatchesScratch: true,
  guidanceSays:
    "For temporary files, always use the $TMPDIR environment variable. TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode.",
  writeAllowlistIncludesLiteralTmpdir: true,
  writeAllowlistLiteralToken: "$TMPDIR",
  writeAllowlistAlsoHasExpandedAbsolutes: true,
  writeAllowlistExample: [
    "/dev/stdout",
    "/home/<user>/.npm/_logs",
    ".",
    "$TMPDIR"
  ],
  shellTestSuiteFails: true,
  tmpEmptyPathsCollapseToRoot: true,
  nestedSessionCannotStart: true,
  nestedSocketEperm: true,
  nestedSocketError:
    "Sandbox is required but failed to initialize: EPERM: operation not permitted, listen '/home/<user>/.local/state/scratch/srt-mux-6-1.sock'. Restart to retry.",
  failIfUnavailableRefusesUnsandboxed: true,
  failIfUnavailableCorrect: true,
  ghHttp401SameSession: true,
  ghNotChased: true,
  suggestedFixExpandToken: true,
  suggestedFixResolveTempRootIndependently: true,
  cannotRevertSettingsInsideSession: true,
  writingClaudeDenied: true,
  restartDoesNotHelp: true,
  revertFromOutsideShell: true,
  expected:
    "TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode.",
  actual:
    "Session sets $TMPDIR to CLAUDE_CODE_TMPDIR under HOME; write allowlist keeps literal token $TMPDIR; mktemp -d fails Read-only file system.",
  impact:
    "Shell test suites fail; nested claude cannot bind control socket (EPERM listen …/srt-mux-*.sock); settings cannot be reverted from inside the session."
};

export const COUSINS = [
  {
    id: 91643,
    state: "open",
    note: "Cite-only cousin. plugin eval sandbox denies every Bash write — /private/tmp denyWrite covers the /tmp/e-* sandbox root. Different surface (macOS plugin-eval /private/tmp deny vs Linux CLAUDE_CODE_TMPDIR literal $TMPDIR). Primary stays #92590. Do not rename this product."
  },
  {
    id: 91223,
    state: "open",
    note: "Cite-only cousin. Sockets directory is still first-come after 2.1.248, and a local account can squat both /tmp/cc-socks and the per-uid fallback. Different surface (socket-dir squat vs write-allowlist literal token). Primary stays #92590."
  },
  {
    id: 15637,
    state: "open",
    note: "Cite-only cousin. Hardcoded /tmp/claude paths break on Termux (Android). Different surface (hardcoded /tmp/claude vs unexpanded $TMPDIR token). Primary stays #92590."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories. Different defect (read fence settings-layer miss vs write-allowlist literal $TMPDIR)."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout background + TaskStop shell-only + MSYS wipe. Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: security-guidance ENOENT fake notice loop. Different defect."
  },
  {
    slug: "touchstone",
    issue: 92599,
    note: "Touchstone/#92599: extension-gated Write/Edit 401. Different defect."
  },
  {
    slug: "bitts",
    issue: 92573,
    note: "Bitts/#92573: worktree pool mid-session raze. Different defect."
  },
  {
    slug: "seizing",
    issue: 92586,
    note: "Seizing/#92586: EDR nlink Bash output-file kill. Different defect."
  },
  {
    slug: "gland",
    issue: 92533,
    note: "Gland/#92533: Bash tool.call hook strips worktree isolation. Different defect."
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification never starts a turn. Different defect."
  },
  {
    slug: "fairlead",
    note: "Fairlead: URI-scheme file:// vs vscode-remote:// path drop. Different defect."
  },
  {
    slug: "wraith",
    note: "Wraith: prior catalog paradigm. Different defect."
  }
];

export const LIMBER_CHANNELS = [
  { id: "scratch", path: "$HOME/.local/state/scratch", role: "CLAUDE_CODE_TMPDIR", drains: false },
  { id: "token", path: "$TMPDIR", role: "literal write-allowlist token", drains: false },
  { id: "well", path: "sandbox temp root", role: "pump well once expanded", drains: true }
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

export function literalTokenSignal(text = "") {
  return /literal token|unexpanded|"\$TMPDIR"|write allowlist keeps/i.test(
    String(text || "")
  );
}

export function mktempReadonlySignal(text = "") {
  return /mktemp|Read-only file system|tmp\.XXXXXX/i.test(String(text || ""));
}

export function nestedSocketEpermSignal(text = "") {
  return /EPERM|srt-mux|control socket|nested (claude|session)/i.test(
    String(text || "")
  );
}

export function guidanceSaysWritableSignal(text = "") {
  return /sandbox-writable|always use the \$TMPDIR|guidance/i.test(
    String(text || "")
  );
}

export function failIfUnavailableSignal(text = "") {
  return /failIfUnavailable|refuses to run|refuses unsandboxed/i.test(
    String(text || "")
  );
}

export function settingsRevertBlockedSignal(text = "") {
  return /~\/\.claude|cannot be reverted|outside (a )?shell|writing the updated settings/i.test(
    String(text || "")
  );
}

export function allowlistExpandsTmpdir(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.allowlistExpanded) || boolish(t.tempRootResolved)) return true;
  if (boolish(t.drained) && !boolish(t.silted)) return true;
  const allow = Array.isArray(t.writeAllowlist) ? t.writeAllowlist : [];
  return (
    allow.some((entry) => typeof entry === "string" && entry.includes("/.local/state/scratch")) &&
    !allow.includes("$TMPDIR")
  );
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const literal =
    boolish(t.literalToken) ||
    boolish(t.writeAllowlistIncludesLiteralTmpdir) ||
    literalTokenSignal(blob);
  const mktemp =
    boolish(t.mktempReadonly) ||
    boolish(t.mktempFails) ||
    mktempReadonlySignal(blob);
  const socket =
    boolish(t.nestedSocketEperm) ||
    boolish(t.nestedSessionCannotStart) ||
    nestedSocketEpermSignal(blob);
  const guidance =
    boolish(t.guidanceSaysWritable) ||
    guidanceSaysWritableSignal(blob);
  const refuse =
    boolish(t.failIfUnavailableRefuses) ||
    failIfUnavailableSignal(blob);
  const revert =
    boolish(t.settingsRevertBlocked) ||
    boolish(t.cannotRevertSettingsInsideSession) ||
    settingsRevertBlockedSignal(blob);
  const drainedClean =
    boolish(t.drained) ||
    boolish(t.allowlistExpanded) ||
    allowlistExpandsTmpdir(t);
  const siltedHit =
    boolish(t.silted) ||
    (literal && mktemp && !boolish(t.drained));
  return {
    literal,
    mktemp,
    socket,
    guidance,
    refuse,
    revert,
    drainedClean,
    siltedHit,
    expanded: allowlistExpandsTmpdir(t)
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const silted =
    boolish(t.silted) ||
    (print.siltedHit && !boolish(t.drained));
  const drained =
    boolish(t.drained) ||
    (print.drainedClean && !boolish(t.silted));
  return {
    silted,
    drained,
    literalToken: boolish(t.literalToken) || print.literal,
    mktempReadonly: boolish(t.mktempReadonly) || print.mktemp,
    nestedSocketEperm: boolish(t.nestedSocketEperm) || print.socket,
    guidanceSaysWritable: boolish(t.guidanceSaysWritable) || print.guidance,
    failIfUnavailableRefuses: boolish(t.failIfUnavailableRefuses) || print.refuse,
    settingsRevertBlocked: boolish(t.settingsRevertBlocked) || print.revert,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    claudeCodeTmpdir: t.claudeCodeTmpdir || MEASURED.claudeCodeTmpdir,
    writeAllowlistLiteralToken: t.writeAllowlistLiteralToken || MEASURED.writeAllowlistLiteralToken
  };
}

export function seedSilted() {
  return {
    seed: "silted",
    issue: 92590,
    silted: true,
    drained: false,
    literalToken: true,
    mktempReadonly: true,
    nestedSocketEperm: true,
    guidanceSaysWritable: true,
    failIfUnavailableRefuses: true,
    settingsRevertBlocked: true,
    writeAllowlistIncludesLiteralTmpdir: true,
    mktempFails: true,
    reporter: MEASURED.reporter
  };
}

export function seedDrained() {
  return {
    seed: "drained",
    issue: 92590,
    silted: false,
    drained: true,
    allowlistExpanded: true,
    tempRootResolved: true,
    literalToken: false,
    mktempFails: false,
    nestedSocketEperm: false,
    writeAllowlist: ["/dev/stdout", "/home/<user>/.local/state/scratch", "."],
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    silted: seedSilted(),
    drained: seedDrained(),
    "literal-token": {
      seed: "literal-token",
      issue: 92590,
      literalToken: true,
      writeAllowlistIncludesLiteralTmpdir: true,
      writeAllowlistLiteralToken: MEASURED.writeAllowlistLiteralToken
    },
    "mktemp-readonly": {
      seed: "mktemp-readonly",
      issue: 92590,
      mktempReadonly: true,
      mktempFails: true,
      mktempError: MEASURED.mktempError
    },
    "nested-socket-eperm": {
      seed: "nested-socket-eperm",
      issue: 92590,
      nestedSocketEperm: true,
      nestedSocketError: MEASURED.nestedSocketError
    },
    "guidance-says-writable": {
      seed: "guidance-says-writable",
      issue: 92590,
      guidanceSaysWritable: true,
      guidanceSays: MEASURED.guidanceSays
    },
    "failIfUnavailable-refuses": {
      seed: "failIfUnavailable-refuses",
      issue: 92590,
      failIfUnavailableRefuses: true,
      failIfUnavailable: true,
      failIfUnavailableCorrect: true
    },
    "settings-revert-blocked": {
      seed: "settings-revert-blocked",
      issue: 92590,
      settingsRevertBlocked: true,
      cannotRevertSettingsInsideSession: true,
      writingClaudeDenied: true
    },
    cousins: {
      seed: "cousins",
      issue: 92590,
      cousins: true,
      cousinsCiteOnly: [91643, 91223, 15637]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92590,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const limber = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #91643 plugin eval sandbox denies every Bash write /private/tmp (different surface); #91223 sockets directory squat (different surface); #15637 hardcoded /tmp/claude Termux (different surface). Not Chock/#92582 settings-layer merge miss. Not Deadman/#92593 timeout background + TaskStop shell-only + MSYS wipe. Not Eidolon/#92601 ENOENT fake notice. Not Touchstone/#92599 extension-gated 401. Not Bitts/#92573 worktree pool raze. Not Seizing/#92586 EDR nlink. Not Gland / Larum / Fairlead / Wraith paradigms. Primary stays #92590"
    );
    return {
      verdict: "cousins",
      reasons,
      silted: true,
      drained: false,
      chips: ["cousins", "silted"],
      limber
    };
  }

  if (seed === "literal-token" || (t.literalToken === true && seed !== "silted" && seed !== "drained")) {
    reasons.push(
      "literal-token — the sandbox's reported write allowlist contains the literal token \"$TMPDIR\" alongside fully expanded absolute paths, consistent with the variable never being expanded"
    );
    return {
      verdict: "literal-token",
      reasons,
      silted: true,
      drained: false,
      chips: ["literal-token", "silted"],
      limber
    };
  }

  if (seed === "mktemp-readonly" || (t.mktempReadonly === true && seed !== "silted" && seed !== "drained")) {
    reasons.push(
      "mktemp-readonly — mktemp -d fails with Read-only file system on '/home/<user>/.local/state/scratch/tmp.XXXXXX'; echo $TMPDIR inside the session prints that same directory"
    );
    return {
      verdict: "mktemp-readonly",
      reasons,
      silted: true,
      drained: false,
      chips: ["mktemp-readonly", "silted"],
      limber
    };
  }

  if (
    seed === "nested-socket-eperm" ||
    (t.nestedSocketEperm === true && seed !== "silted" && seed !== "drained")
  ) {
    reasons.push(
      "nested-socket-eperm — a child claude process cannot bind its control socket: EPERM: operation not permitted, listen '/home/<user>/.local/state/scratch/srt-mux-6-1.sock'"
    );
    return {
      verdict: "nested-socket-eperm",
      reasons,
      silted: true,
      drained: false,
      chips: ["nested-socket-eperm", "silted"],
      limber
    };
  }

  if (
    seed === "guidance-says-writable" ||
    (t.guidanceSaysWritable === true && seed !== "silted" && seed !== "drained")
  ) {
    reasons.push(
      "guidance-says-writable — sandbox guidance to the model says: For temporary files, always use the $TMPDIR environment variable. TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode"
    );
    return {
      verdict: "guidance-says-writable",
      reasons,
      silted: true,
      drained: false,
      chips: ["guidance-says-writable", "silted"],
      limber
    };
  }

  if (
    seed === "failIfUnavailable-refuses" ||
    (t.failIfUnavailableRefuses === true && seed !== "silted" && seed !== "drained")
  ) {
    reasons.push(
      "failIfUnavailable-refuses — with failIfUnavailable true it correctly refuses to run rather than continuing unsandboxed — that part works exactly as documented"
    );
    return {
      verdict: "failIfUnavailable-refuses",
      reasons,
      silted: true,
      drained: false,
      chips: ["failIfUnavailable-refuses", "silted"],
      limber
    };
  }

  if (
    seed === "settings-revert-blocked" ||
    (t.settingsRevertBlocked === true && seed !== "silted" && seed !== "drained")
  ) {
    reasons.push(
      "settings-revert-blocked — the setting cannot be reverted from inside a session, because writing the updated settings file requires writing under ~/.claude, which the sandbox denies; the revert has to be made from a shell outside Claude Code"
    );
    return {
      verdict: "settings-revert-blocked",
      reasons,
      silted: true,
      drained: false,
      chips: ["settings-revert-blocked", "silted"],
      limber
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "silted" && seed !== "drained")) {
    reasons.push(
      "has-clear-repro — #92590 is labeled has repro: export CLAUDE_CODE_TMPDIR=\"$HOME/.local/state/scratch\"; sandbox.enabled true; mktemp -d fails Read-only file system; write allowlist keeps literal $TMPDIR"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      silted: true,
      drained: false,
      chips: ["has-clear-repro", "silted"],
      limber
    };
  }

  if (
    seed === "drained" ||
    (t.drained === true && t.silted !== true && seed !== "silted") ||
    (limber.drained && !limber.silted && seed !== "silted")
  ) {
    reasons.push(
      "limber already drained — write allowlist expands $TMPDIR or the sandbox temp root is resolved independently, so mktemp and nested sockets can write. Seeded word is drained"
    );
    return {
      verdict: "drained",
      reasons,
      silted: false,
      drained: true,
      chips: ["drained"],
      limber
    };
  }

  if (t.silted === true || seed === "silted" || (limber.silted && !limber.drained)) {
    reasons.push(
      "A bilge limber-hole bench that should drain CLAUDE_CODE_TMPDIR into a writable sandbox $TMPDIR but instead silts the well because the write allowlist keeps the literal token $TMPDIR unexpanded — mktemp and nested sockets EPERM — is not drained. Score silted or admit drained"
    );
    const chips = ["silted"];
    if (t.literalToken === true || limber.literalToken) chips.push("literal-token");
    if (t.mktempReadonly === true || limber.mktempReadonly) chips.push("mktemp-readonly");
    if (t.nestedSocketEperm === true || limber.nestedSocketEperm) chips.push("nested-socket-eperm");
    if (t.guidanceSaysWritable === true || limber.guidanceSaysWritable) {
      chips.push("guidance-says-writable");
    }
    if (t.failIfUnavailableRefuses === true || limber.failIfUnavailableRefuses) {
      chips.push("failIfUnavailable-refuses");
    }
    if (t.settingsRevertBlocked === true || limber.settingsRevertBlocked) {
      chips.push("settings-revert-blocked");
    }
    return {
      verdict: "silted",
      reasons,
      silted: true,
      drained: false,
      chips: [...new Set(chips)],
      limber
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, silted: false, drained: true, chips: [seed], limber };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      silted: true,
      drained: false,
      chips: [seed],
      limber
    };
  }

  reasons.push(
    "empty probe; idle limber-board is silted — write allowlist keeps literal $TMPDIR; mktemp Read-only; nested socket EPERM"
  );
  return {
    verdict: "silted",
    reasons,
    silted: true,
    drained: false,
    chips: ["silted"],
    limber
  };
}
