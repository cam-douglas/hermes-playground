/**
 * Deadman — locomotive deadman's switch / process-tree kill bench.
 *
 * A spring-loaded safety handle that MUST cut the whole drive train
 * when released. Here timeout / TaskStop "releases" the switch but
 * the child motor (rm.exe) keeps chewing the rail (drive root) after
 * MSYS turns a quoted backslash into C:\.
 *
 * Encoded from anthropics/claude-code#92593 issue facts only.
 * Hypothesis (NON-BINDING): harness may (1) auto-background timed-out
 * Bash instead of SIGKILL for destructive classes, (2) TaskStop only
 * terminate the shell PID not the Windows process tree, (3) lack Job
 * Objects around Bash children, (4) lack denylist for MSYS-mangled
 * drive-root deletes. Verify against issue text only; do not claim
 * unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational PreToolUse denylist fixture only — does not run rm.
 */

export const VERDICTS = [
  "runaway",
  "latched",
  "timeout-background",
  "taskstop-shell-only",
  "msys-backslash-root",
  "drive-wipe",
  "job-object-missing",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["latched"]);

export const ALARM = new Set([
  "runaway",
  "timeout-background",
  "taskstop-shell-only",
  "msys-backslash-root",
  "drive-wipe",
  "job-object-missing",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "runaway";
export const SEEDED_WORD = "latched";

export const MEASURED = {
  issue: 92593,
  title:
    "Runaway rm -rf: timeout auto-backgrounding kept a destructive command running, and TaskStop did not kill the child process (Windows)",
  state: "open",
  labels: ["bug", "platform:windows", "area:bash", "area:agents", "data-loss", "area:sandbox"],
  filed: "2026-09-07T04:34:56Z",
  updated: "2026-09-07T04:36:48Z",
  reporter: "janetyq",
  comments: 0,
  os: "Windows 11 Home (10.0.26200)",
  app: "Claude Code CLI",
  shells: "PowerShell primary + Git Bash tool",
  model: "claude-fable-5",
  spawn: "background subagent via Agent tool + Bash tool",
  intendedTarget: "stray directory literally named \\\\ inside the repo",
  quotedForm: "quoted-backslash (MSYS-mangled)",
  msysResolution: "bare backslash → root of the current drive",
  wipeRoot: "C:\\\\",
  wipeDurationMinutes: 7,
  childSurvivedMinutes: 5,
  bashTimeoutMinutes: 2,
  destroyed: "several top-level directories under C:\\\\dev",
  recovery: "same-day Volume Shadow Copy plus GitHub remotes",
  survivedAfter: "everything alphabetically after dev on C:\\\\",
  recycleBin: false,
  stderrSuppressed: true,
  timeoutPromotedToBackground: true,
  taskStopReportedSuccess: true,
  childSurvived: true,
  childProcess: "rm.exe",
  jobObjectMissing: true,
  denylistMissing: true,
  expected:
    "Timeout kills rather than backgrounds destructive cmds; TaskStop kills the full process tree (taskkill /T or Job Object); catastrophic delete targets denied.",
  actual:
    "Timeout auto-backgrounded the wipe; TaskStop killed the shell only; rm.exe chewed C:\\\\ for ~5 more minutes; quoted-backslash evaded permission-rule patterns."
};

export const COUSINS = [
  {
    id: 92583,
    state: "open",
    note: "Cite-only cousin. Timeout-background orphans after session end leaking handles. Different: #92583 is AFTER session end; #92593 is MID-INCIDENT timeout promote-to-background + TaskStop incomplete kill + MSYS root wipe. Primary stays #92593. Do not rename this product Snatch."
  },
  {
    id: 91642,
    state: "open",
    note: "Cite-only cousin. claude.exe orphans with Electron parent. Different orphan/parent surface. Primary stays #92593."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "bitts",
    issue: 92573,
    note: "Bitts/#92573: worktree pool mid-session raze. Different defect."
  },
  {
    slug: "seizing",
    issue: 92586,
    note: "Seizing/#92586: nlink Bash output-file kill. Different defect."
  },
  {
    slug: "hangfire",
    issue: 92478,
    note: "Hangfire: queued /compact demotion. Different defect."
  },
  {
    slug: "watchdog",
    note: "Watchdog paradigm (compaction-nap retry bite). Different defect."
  },
  {
    slug: "clobber",
    note: "Clobber paradigm (inode-swap editor autosave). Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: staged-hook ENOENT fake security-notice loop. Different defect."
  }
];

/**
 * Educational PreToolUse denylist fixture.
 * Does NOT execute deletes. Scores whether a probe's target would be
 * denied if a catastrophic-rm guard existed.
 */
export const CATASTROPHIC_TARGETS = [
  { id: "quoted-backslash", note: "quoted backslash — MSYS path translation → drive root" },
  { id: "posix-root", note: "POSIX root /" },
  { id: "drive-root", note: "Windows drive root C:\\\\" },
  { id: "home-tilde", note: "home ~" }
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

export function msysBackslashSignal(text = "") {
  return /quoted-backslash|MSYS|bare backslash|drive root|\\\\"|rm -rf/i.test(String(text || ""));
}

export function timeoutBackgroundSignal(text = "") {
  return /auto-background|backgrounded|promoted|2-minute|timeout/i.test(String(text || ""));
}

export function taskStopShellOnlySignal(text = "") {
  return /TaskStop|shell but not the child|rm\.exe|process tree|taskkill/i.test(String(text || ""));
}

export function driveWipeSignal(text = "") {
  return /C:\\\\dev|Volume Shadow Copy|alphabetically after|7 minutes/i.test(String(text || ""));
}

export function jobObjectSignal(text = "") {
  return /Job Object|job-object|taskkill \/T/i.test(String(text || ""));
}

export function wouldDenyCatastrophic(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.denyCatastrophic) || boolish(t.denylistHit)) return true;
  const blob = extractText(t);
  return /quoted-backslash|posix-root|drive-root|home-tilde|C:\\\\$|rm -rf \"\\\\\"/i.test(blob);
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const timeoutBg =
    boolish(t.timeoutBackground) ||
    boolish(t.timeoutPromotedToBackground) ||
    timeoutBackgroundSignal(blob);
  const shellOnly =
    boolish(t.taskStopShellOnly) ||
    boolish(t.childSurvived) ||
    taskStopShellOnlySignal(blob);
  const msys =
    boolish(t.msysBackslashRoot) ||
    boolish(t.msysMangle) ||
    msysBackslashSignal(blob);
  const wipe =
    boolish(t.driveWipe) ||
    driveWipeSignal(blob);
  const jobMissing =
    boolish(t.jobObjectMissing) ||
    (jobObjectSignal(blob) && /missing|lack|without/i.test(blob));
  const latchedClean =
    boolish(t.latched) ||
    boolish(t.treeKilled) ||
    boolish(t.timeoutKills);
  const runawayHit =
    boolish(t.runaway) ||
    (timeoutBg && shellOnly && !boolish(t.latched));
  return {
    timeoutBg,
    shellOnly,
    msys,
    wipe,
    jobMissing,
    latchedClean,
    runawayHit,
    denyHit: wouldDenyCatastrophic(t)
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const runaway =
    boolish(t.runaway) ||
    (print.runawayHit && !boolish(t.latched));
  const latched =
    boolish(t.latched) ||
    (print.latchedClean && !boolish(t.runaway));
  return {
    runaway,
    latched,
    timeoutBackground: boolish(t.timeoutBackground) || print.timeoutBg,
    taskStopShellOnly: boolish(t.taskStopShellOnly) || print.shellOnly,
    msysBackslashRoot: boolish(t.msysBackslashRoot) || print.msys,
    driveWipe: boolish(t.driveWipe) || print.wipe,
    jobObjectMissing: boolish(t.jobObjectMissing) || print.jobMissing,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    childProcess: t.childProcess || MEASURED.childProcess
  };
}

export function seedRunaway() {
  return {
    seed: "runaway",
    issue: 92593,
    runaway: true,
    latched: false,
    timeoutBackground: true,
    taskStopShellOnly: true,
    msysBackslashRoot: true,
    driveWipe: true,
    jobObjectMissing: true,
    timeoutPromotedToBackground: true,
    childSurvived: true,
    childProcess: MEASURED.childProcess,
    wipeRoot: MEASURED.wipeRoot,
    reporter: MEASURED.reporter
  };
}

export function seedLatched() {
  return {
    seed: "latched",
    issue: 92593,
    runaway: false,
    latched: true,
    timeoutKills: true,
    treeKilled: true,
    jobObject: true,
    denyCatastrophic: true,
    timeoutBackground: false,
    childSurvived: false,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    runaway: seedRunaway(),
    latched: seedLatched(),
    "timeout-background": {
      seed: "timeout-background",
      issue: 92593,
      timeoutBackground: true,
      bashTimeoutMinutes: MEASURED.bashTimeoutMinutes
    },
    "taskstop-shell-only": {
      seed: "taskstop-shell-only",
      issue: 92593,
      taskStopShellOnly: true,
      childSurvived: true,
      childProcess: MEASURED.childProcess,
      childSurvivedMinutes: MEASURED.childSurvivedMinutes
    },
    "msys-backslash-root": {
      seed: "msys-backslash-root",
      issue: 92593,
      msysBackslashRoot: true,
      msysResolution: MEASURED.msysResolution
    },
    "drive-wipe": {
      seed: "drive-wipe",
      issue: 92593,
      driveWipe: true,
      wipeDurationMinutes: MEASURED.wipeDurationMinutes,
      destroyed: MEASURED.destroyed
    },
    "job-object-missing": {
      seed: "job-object-missing",
      issue: 92593,
      jobObjectMissing: true
    },
    cousins: {
      seed: "cousins",
      issue: 92593,
      cousins: true,
      cousinsCiteOnly: [92583, 91642]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92593,
      hasClearRepro: true,
      labels: MEASURED.labels,
      narrativeHasClearRepro: true
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
  const deadman = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92583 timeout-background orphans after session end leaking handles (AFTER session end; Deadman is MID-INCIDENT); #91642 claude.exe orphans with Electron parent. Not Bitts/#92573 worktree pool raze. Not Seizing/#92586 nlink Bash output-file kill. Not Hangfire queued /compact. Not Watchdog / Clobber / Eidolon. Do not rename Snatch/Chock. Primary stays #92593"
    );
    return {
      verdict: "cousins",
      reasons,
      runaway: true,
      latched: false,
      chips: ["cousins", "runaway"],
      deadman
    };
  }

  if (seed === "timeout-background" || (t.timeoutBackground === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "timeout-background — compound command exceeded the ~2-minute Bash timeout and was AUTO-BACKGROUNDED instead of killed; destructive work continued unsupervised with no visible output"
    );
    return {
      verdict: "timeout-background",
      reasons,
      runaway: true,
      latched: false,
      chips: ["timeout-background", "runaway"],
      deadman
    };
  }

  if (seed === "taskstop-shell-only" || (t.taskStopShellOnly === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "taskstop-shell-only — TaskStop reported success but only killed the shell; underlying rm.exe child survived ~5 more minutes until manual PID kill. Windows needs Job Object / taskkill /T process-tree semantics"
    );
    return {
      verdict: "taskstop-shell-only",
      reasons,
      runaway: true,
      latched: false,
      chips: ["taskstop-shell-only", "runaway"],
      deadman
    };
  }

  if (seed === "msys-backslash-root" || (t.msysBackslashRoot === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "msys-backslash-root — Git Bash MSYS path translation resolved a quoted bare backslash to the root of the current drive; quoted-backslash form evades permission-rule patterns that look for rm -rf /*"
    );
    return {
      verdict: "msys-backslash-root",
      reasons,
      runaway: true,
      latched: false,
      chips: ["msys-backslash-root", "runaway"],
      deadman
    };
  }

  if (seed === "drive-wipe" || (t.driveWipe === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "drive-wipe — recursively deleted C:\\ contents in alphabetical order for ~7 minutes; several top-level directories under C:\\dev destroyed; recovered via same-day Volume Shadow Copy plus GitHub remotes; everything alphabetically after dev survived"
    );
    return {
      verdict: "drive-wipe",
      reasons,
      runaway: true,
      latched: false,
      chips: ["drive-wipe", "runaway"],
      deadman
    };
  }

  if (seed === "job-object-missing" || (t.jobObjectMissing === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "job-object-missing — stopping a task apparently terminates the shell without terminating its process tree; no Job Object around Bash children; TaskStop needs taskkill /T semantics"
    );
    return {
      verdict: "job-object-missing",
      reasons,
      runaway: true,
      latched: false,
      chips: ["job-object-missing", "runaway"],
      deadman
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "runaway" && seed !== "latched")) {
    reasons.push(
      "has-clear-repro — #92593 may lack a has-repro label but the filed narrative is a detailed incident (Git Bash quoted-backslash, MSYS drive-root wipe, 2-minute timeout promote, TaskStop shell-only, rm.exe ~5 min leftover). Treat as has-clear-repro from the filed narrative"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      runaway: true,
      latched: false,
      chips: ["has-clear-repro", "runaway"],
      deadman
    };
  }

  if (
    seed === "latched" ||
    (t.latched === true && t.runaway !== true && seed !== "runaway") ||
    (deadman.latched && !deadman.runaway && seed !== "runaway")
  ) {
    reasons.push(
      "deadman already latched — timeout kills rather than backgrounds destructive cmds; TaskStop kills the full process tree; catastrophic delete targets denied. Seeded word is latched"
    );
    return {
      verdict: "latched",
      reasons,
      runaway: false,
      latched: true,
      chips: ["latched"],
      deadman
    };
  }

  if (t.runaway === true || seed === "runaway" || (deadman.runaway && !deadman.latched)) {
    reasons.push(
      "A deadman's switch that should cut the whole Bash process tree on timeout/TaskStop but instead backgrounds the wipe and leaves rm.exe chewing the drive root after MSYS turns a quoted backslash into C:\\ is not latched. Score runaway or admit latched"
    );
    const chips = ["runaway"];
    if (t.timeoutBackground === true || deadman.timeoutBackground) chips.push("timeout-background");
    if (t.taskStopShellOnly === true || deadman.taskStopShellOnly) chips.push("taskstop-shell-only");
    if (t.msysBackslashRoot === true || deadman.msysBackslashRoot) chips.push("msys-backslash-root");
    if (t.driveWipe === true || deadman.driveWipe) chips.push("drive-wipe");
    if (t.jobObjectMissing === true || deadman.jobObjectMissing) chips.push("job-object-missing");
    return {
      verdict: "runaway",
      reasons,
      runaway: true,
      latched: false,
      chips: [...new Set(chips)],
      deadman
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, runaway: false, latched: true, chips: [seed], deadman };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      runaway: true,
      latched: false,
      chips: [seed],
      deadman
    };
  }

  reasons.push(
    "empty probe; idle deadman cab is runaway — timeout backgrounded destructive Bash; TaskStop left child alive; MSYS quoted-backslash → drive root"
  );
  return {
    verdict: "runaway",
    reasons,
    runaway: true,
    latched: false,
    chips: ["runaway"],
    deadman
  };
}
