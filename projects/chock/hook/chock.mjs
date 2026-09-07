/**
 * Chock — timber wheel-chock / dry-dock chock yard.
 *
 * A wheel-chock that MUST seat project/local additionalDirectories
 * into the read fence when blockReadsOutsideWorkingDirectories is on.
 * Only the user-settings chocks seat — project/local wedges stay on
 * the deck even though the muster board lists them.
 *
 * Encoded from anthropics/claude-code#92582 issue facts only.
 * Hypothesis (NON-BINDING): fence builder may merge user-settings
 * additionalDirectories into the allowlist but skip project/local
 * layers when constructing the blockReadsOutsideWorkingDirectories
 * check and the sandbox allowWithinDeny list, even though a separate
 * path already surfaces all four dirs in the environment header.
 * Verify against issue text only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only — does not call Read/Grep/Glob.
 */

export const VERDICTS = [
  "barred",
  "admitted",
  "user-only-fence",
  "header-lists-all",
  "project-ignored",
  "local-ignored",
  "sandbox-allowWithinDeny",
  "add-dir-works",
  "unattended-blocked",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["admitted"]);

export const ALARM = new Set([
  "barred",
  "user-only-fence",
  "header-lists-all",
  "project-ignored",
  "local-ignored",
  "sandbox-allowWithinDeny",
  "add-dir-works",
  "unattended-blocked",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "barred";
export const SEEDED_WORD = "admitted";

export const MEASURED = {
  issue: 92582,
  title:
    "permissions.blockReadsOutsideWorkingDirectories ignores additionalDirectories from project and local settings",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:permissions"],
  filed: "2026-09-07T02:11:02Z",
  updated: "2026-09-07T02:12:03Z",
  reporter: "ryu1fcgm",
  comments: 0,
  os: "macOS 25.6",
  app: "Claude Code 2.1.263 (CLI and Claude desktop app 1.46388.4)",
  cliVersion: "2.1.263",
  desktopVersion: "1.46388.4",
  userSettingsPath: "~/.claude/settings.json",
  blockReadsOutsideWorkingDirectories: true,
  userAdditionalDirectories: ["A", "B"],
  projectSettingsPath: ".claude/settings.json",
  projectAdditionalDirectories: ["C", "D"],
  projectTrusted: true,
  hasTrustDialogAccepted: true,
  trustReacceptedAfterReset: true,
  localSettingsPath: ".claude/settings.local.json",
  localAdditionalDirectories: ["C", "D"],
  localUntracked: true,
  headerLists: ["A", "B", "C", "D"],
  fenceAllows: ["cwd", "A", "B"],
  fenceRefuses: ["C", "D"],
  refusedTools: ["Read", "Grep", "Glob"],
  refuseMessage:
    "is outside <cwd>, A, B; the permissions.blockReadsOutsideWorkingDirectories setting blocks reads outside the working directories. Ask the user to add the directory with /add-dir, or to remove that setting.",
  sandboxAllowWithinDeny: ["cwd", "A", "B"],
  sandboxCatUnderC: "Operation not permitted",
  addDirWorks: true,
  addDirTarget: "C",
  freshSessionsSame: true,
  trackedOrUntrackedSame: true,
  expected:
    "Project/local additionalDirectories apply once trust is accepted; files there readable without prompts; read fence should include them.",
  actual:
    "Header lists A, B, C, D; Read/Grep/Glob and sandbox allowWithinDeny only admit cwd, A, B; /add-dir C works in the same session.",
  impact:
    "Unattended scheduled sessions cannot use project-declared additional directories at all while the read fence is on, since /add-dir needs an interactive session."
};

export const COUSINS = [
  {
    id: 91848,
    state: "open",
    note: "Cite-only cousin. Read() deny rule arms unwhitelistable cd+relative-read prompt in bypassPermissions. Different surface. Primary stays #92582. Do not rename this product."
  },
  {
    id: 83031,
    state: "open",
    note: "Cite-only cousin. additionalDirectories acts as a single slot — only last array entry honored. Different: slot collapse vs layer ignore. Primary stays #92582."
  },
  {
    id: 92615,
    state: "open",
    note: "Cite-only cousin. No single syntax for allowlist-only reads (enhancement/different). Primary stays #92582."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "fairlead",
    note: "Fairlead: URI-scheme file:// vs vscode-remote:// path drop. Fairlead already uses chock-rail metaphorically; this product is the permissions settings-layer merge miss, not URI routing."
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
  }
];

export const SETTINGS_LAYERS = [
  { id: "user", path: "~/.claude/settings.json", dirs: ["A", "B"], seatsFence: true },
  { id: "project", path: ".claude/settings.json", dirs: ["C", "D"], seatsFence: false },
  { id: "local", path: ".claude/settings.local.json", dirs: ["C", "D"], seatsFence: false }
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

export function userOnlyFenceSignal(text = "") {
  return /only cwd, A, B|user-only-fence|user-settings chocks|only user-settings/i.test(
    String(text || "")
  );
}

export function headerListsAllSignal(text = "") {
  return /header lists A, B, C, D|muster board|additional working directories/i.test(
    String(text || "")
  );
}

export function projectIgnoredSignal(text = "") {
  return /project\/local|project-ignored|project \.claude\/settings\.json|project wedges/i.test(
    String(text || "")
  );
}

export function localIgnoredSignal(text = "") {
  return /settings\.local\.json|local-ignored|local file untracked|local wedges/i.test(
    String(text || "")
  );
}

export function sandboxAllowWithinDenySignal(text = "") {
  return /allowWithinDeny|Operation not permitted|sandbox/i.test(String(text || ""));
}

export function addDirWorksSignal(text = "") {
  return /\/add-dir|add-dir C|addDirWorks/i.test(String(text || ""));
}

export function unattendedBlockedSignal(text = "") {
  return /unattended|scheduled sessions|\/add-dir needs an interactive/i.test(
    String(text || "")
  );
}

export function fenceAdmitsProjectLocal(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.fenceIncludesProject) || boolish(t.fenceIncludesLocal)) return true;
  if (boolish(t.admitted) && !boolish(t.barred)) return true;
  const fence = Array.isArray(t.fenceAllows) ? t.fenceAllows : [];
  return fence.includes("C") && fence.includes("D");
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const userOnly =
    boolish(t.userOnlyFence) ||
    boolish(t.userSettingsOnly) ||
    userOnlyFenceSignal(blob);
  const headerAll =
    boolish(t.headerListsAll) ||
    (Array.isArray(t.headerLists) && t.headerLists.includes("C") && t.headerLists.includes("D")) ||
    headerListsAllSignal(blob);
  const projectSkip =
    boolish(t.projectIgnored) ||
    projectIgnoredSignal(blob);
  const localSkip =
    boolish(t.localIgnored) ||
    localIgnoredSignal(blob);
  const sandbox =
    boolish(t.sandboxAllowWithinDeny) ||
    boolish(t.sandboxUserOnly) ||
    sandboxAllowWithinDenySignal(blob);
  const addDir =
    boolish(t.addDirWorks) ||
    addDirWorksSignal(blob);
  const unattended =
    boolish(t.unattendedBlocked) ||
    unattendedBlockedSignal(blob);
  const admittedClean =
    boolish(t.admitted) ||
    boolish(t.fenceIncludesProject) ||
    fenceAdmitsProjectLocal(t);
  const barredHit =
    boolish(t.barred) ||
    (userOnly && headerAll && !boolish(t.admitted));
  return {
    userOnly,
    headerAll,
    projectSkip,
    localSkip,
    sandbox,
    addDir,
    unattended,
    admittedClean,
    barredHit,
    fenceMerged: fenceAdmitsProjectLocal(t)
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const barred =
    boolish(t.barred) ||
    (print.barredHit && !boolish(t.admitted));
  const admitted =
    boolish(t.admitted) ||
    (print.admittedClean && !boolish(t.barred));
  return {
    barred,
    admitted,
    userOnlyFence: boolish(t.userOnlyFence) || print.userOnly,
    headerListsAll: boolish(t.headerListsAll) || print.headerAll,
    projectIgnored: boolish(t.projectIgnored) || print.projectSkip,
    localIgnored: boolish(t.localIgnored) || print.localSkip,
    sandboxAllowWithinDeny: boolish(t.sandboxAllowWithinDeny) || print.sandbox,
    addDirWorks: boolish(t.addDirWorks) || print.addDir,
    unattendedBlocked: boolish(t.unattendedBlocked) || print.unattended,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    fenceAllows: t.fenceAllows || MEASURED.fenceAllows,
    headerLists: t.headerLists || MEASURED.headerLists
  };
}

export function seedBarred() {
  return {
    seed: "barred",
    issue: 92582,
    barred: true,
    admitted: false,
    userOnlyFence: true,
    headerListsAll: true,
    projectIgnored: true,
    localIgnored: true,
    sandboxAllowWithinDeny: true,
    addDirWorks: true,
    unattendedBlocked: true,
    headerLists: [...MEASURED.headerLists],
    fenceAllows: [...MEASURED.fenceAllows],
    reporter: MEASURED.reporter
  };
}

export function seedAdmitted() {
  return {
    seed: "admitted",
    issue: 92582,
    barred: false,
    admitted: true,
    fenceIncludesProject: true,
    fenceIncludesLocal: true,
    userOnlyFence: false,
    projectIgnored: false,
    localIgnored: false,
    headerLists: ["A", "B", "C", "D"],
    fenceAllows: ["cwd", "A", "B", "C", "D"],
    sandboxAllowWithinDenyList: ["cwd", "A", "B", "C", "D"],
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    barred: seedBarred(),
    admitted: seedAdmitted(),
    "user-only-fence": {
      seed: "user-only-fence",
      issue: 92582,
      userOnlyFence: true,
      fenceAllows: [...MEASURED.fenceAllows]
    },
    "header-lists-all": {
      seed: "header-lists-all",
      issue: 92582,
      headerListsAll: true,
      headerLists: [...MEASURED.headerLists]
    },
    "project-ignored": {
      seed: "project-ignored",
      issue: 92582,
      projectIgnored: true,
      projectAdditionalDirectories: [...MEASURED.projectAdditionalDirectories]
    },
    "local-ignored": {
      seed: "local-ignored",
      issue: 92582,
      localIgnored: true,
      localSettingsPath: MEASURED.localSettingsPath
    },
    "sandbox-allowWithinDeny": {
      seed: "sandbox-allowWithinDeny",
      issue: 92582,
      sandboxAllowWithinDeny: true,
      sandboxCatUnderC: MEASURED.sandboxCatUnderC
    },
    "add-dir-works": {
      seed: "add-dir-works",
      issue: 92582,
      addDirWorks: true,
      addDirTarget: MEASURED.addDirTarget
    },
    "unattended-blocked": {
      seed: "unattended-blocked",
      issue: 92582,
      unattendedBlocked: true,
      impact: MEASURED.impact
    },
    cousins: {
      seed: "cousins",
      issue: 92582,
      cousins: true,
      cousinsCiteOnly: [91848, 83031, 92615]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92582,
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
  const chock = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #91848 Read() deny rule arms unwhitelistable cd+relative-read prompt in bypassPermissions (different surface); #83031 additionalDirectories acts as a single slot — only last array entry honored (slot collapse vs layer ignore); #92615 no single syntax for allowlist-only reads (enhancement/different). Not Fairlead URI-scheme file:// vs vscode-remote://. Not Deadman/#92593 timeout background + TaskStop shell-only + MSYS wipe. Not Eidolon/#92601 ENOENT fake notice. Not Touchstone/#92599 extension-gated 401. Not Bitts/#92573 worktree pool raze. Not Seizing/#92586 EDR nlink. Not Gland / Larum paradigms. Primary stays #92582"
    );
    return {
      verdict: "cousins",
      reasons,
      barred: true,
      admitted: false,
      chips: ["cousins", "barred"],
      chock
    };
  }

  if (seed === "user-only-fence" || (t.userOnlyFence === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "user-only-fence — Read/Grep/Glob refuse files under C and D; only cwd, A, B are listed as allowed; blockReadsOutsideWorkingDirectories blocks reads outside the working directories"
    );
    return {
      verdict: "user-only-fence",
      reasons,
      barred: true,
      admitted: false,
      chips: ["user-only-fence", "barred"],
      chock
    };
  }

  if (seed === "header-lists-all" || (t.headerListsAll === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "header-lists-all — the session environment header lists A, B, C and D as additional working directories, so the settings are being read, but the read fence still refuses C and D"
    );
    return {
      verdict: "header-lists-all",
      reasons,
      barred: true,
      admitted: false,
      chips: ["header-lists-all", "barred"],
      chock
    };
  }

  if (seed === "project-ignored" || (t.projectIgnored === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "project-ignored — trusted project .claude/settings.json additionalDirectories [C, D] (absolute paths; hasTrustDialogAccepted true; trust re-accepted after reset) do not seat into the read fence"
    );
    return {
      verdict: "project-ignored",
      reasons,
      barred: true,
      admitted: false,
      chips: ["project-ignored", "barred"],
      chock
    };
  }

  if (seed === "local-ignored" || (t.localIgnored === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "local-ignored — untracked .claude/settings.local.json with the same [C, D] is also ignored by the read fence; same result whether the project file is tracked or the local file is untracked"
    );
    return {
      verdict: "local-ignored",
      reasons,
      barred: true,
      admitted: false,
      chips: ["local-ignored", "barred"],
      chock
    };
  }

  if (
    seed === "sandbox-allowWithinDeny" ||
    (t.sandboxAllowWithinDeny === true && seed !== "barred" && seed !== "admitted")
  ) {
    reasons.push(
      "sandbox-allowWithinDeny — Bash sandbox read allow-list (allowWithinDeny) also contains only cwd, A, B so cat under C fails Operation not permitted"
    );
    return {
      verdict: "sandbox-allowWithinDeny",
      reasons,
      barred: true,
      admitted: false,
      chips: ["sandbox-allowWithinDeny", "barred"],
      chock
    };
  }

  if (seed === "add-dir-works" || (t.addDirWorks === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "add-dir-works — /add-dir C in the same session works; the interactive escape seats the wedge the project/local settings already declared"
    );
    return {
      verdict: "add-dir-works",
      reasons,
      barred: true,
      admitted: false,
      chips: ["add-dir-works", "barred"],
      chock
    };
  }

  if (
    seed === "unattended-blocked" ||
    (t.unattendedBlocked === true && seed !== "barred" && seed !== "admitted")
  ) {
    reasons.push(
      "unattended-blocked — unattended scheduled sessions cannot use project-declared additional directories at all while the read fence is on, since /add-dir needs an interactive session"
    );
    return {
      verdict: "unattended-blocked",
      reasons,
      barred: true,
      admitted: false,
      chips: ["unattended-blocked", "barred"],
      chock
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "barred" && seed !== "admitted")) {
    reasons.push(
      "has-clear-repro — #92582 is labeled has repro: user [A, B] + project/local [C, D] + trust accepted; header lists all four; Read/Grep/Glob and sandbox refuse C/D; /add-dir C works"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      barred: true,
      admitted: false,
      chips: ["has-clear-repro", "barred"],
      chock
    };
  }

  if (
    seed === "admitted" ||
    (t.admitted === true && t.barred !== true && seed !== "barred") ||
    (chock.admitted && !chock.barred && seed !== "barred")
  ) {
    reasons.push(
      "chock already admitted — project + local additionalDirectories merge into the read fence and sandbox allowlist once trust is accepted. Seeded word is admitted"
    );
    return {
      verdict: "admitted",
      reasons,
      barred: false,
      admitted: true,
      chips: ["admitted"],
      chock
    };
  }

  if (t.barred === true || seed === "barred" || (chock.barred && !chock.admitted)) {
    reasons.push(
      "A wheel-chock that should seat project/local additionalDirectories into the read fence under blockReadsOutsideWorkingDirectories but only user-settings dirs seat — header lists C/D yet Read and sandbox still refuse — is not admitted. Score barred or admit admitted"
    );
    const chips = ["barred"];
    if (t.userOnlyFence === true || chock.userOnlyFence) chips.push("user-only-fence");
    if (t.headerListsAll === true || chock.headerListsAll) chips.push("header-lists-all");
    if (t.projectIgnored === true || chock.projectIgnored) chips.push("project-ignored");
    if (t.localIgnored === true || chock.localIgnored) chips.push("local-ignored");
    if (t.sandboxAllowWithinDeny === true || chock.sandboxAllowWithinDeny) {
      chips.push("sandbox-allowWithinDeny");
    }
    if (t.addDirWorks === true || chock.addDirWorks) chips.push("add-dir-works");
    if (t.unattendedBlocked === true || chock.unattendedBlocked) chips.push("unattended-blocked");
    return {
      verdict: "barred",
      reasons,
      barred: true,
      admitted: false,
      chips: [...new Set(chips)],
      chock
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, barred: false, admitted: true, chips: [seed], chock };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      barred: true,
      admitted: false,
      chips: [seed],
      chock
    };
  }

  reasons.push(
    "empty probe; idle chock yard is barred — project/local dirs listed in header but refused by Read/Grep/Glob + sandbox allowWithinDeny"
  );
  return {
    verdict: "barred",
    reasons,
    barred: true,
    admitted: false,
    chips: ["barred"],
    chock
  };
}
