/**
 * Snatch — deck snatch-block / openable pulley bench.
 *
 * A snatch-block whose hinged cheek should open to take a bight
 * without reeving the bitter end — then bring the line home when
 * the watch ends. Session-end never reaps auto-backgrounded Bash
 * children, so the line stays adrift with a dead parent for days.
 *
 * Encoded from anthropics/claude-code#92583 issue facts only
 * (body + Mycroft / tonydzi confirmation comment).
 * Hypothesis (NON-BINDING): session-end may lack PID tracking
 * for auto-backgrounded Bash children; tracking+reap (or a
 * wall-clock ceiling) would bring the line home. Verify against
 * issue text only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "adrift",
  "reaped",
  "unreaped-on-session-end",
  "timeout-to-background",
  "immortal-background-commands",
  "handle-pool-exhaustion",
  "nine-of-nine-orphans",
  "dead-parent-git-bash",
  "wall-clock-not-handle-ceiling",
  "find-orphans-11-days",
  "handle-pool-20gb",
  "mycroft-9-of-9",
  "immortal-tail-http",
  "wall-clock-ceiling",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["reaped"]);

export const ALARM = new Set([
  "adrift",
  "unreaped-on-session-end",
  "timeout-to-background",
  "immortal-background-commands",
  "handle-pool-exhaustion",
  "nine-of-nine-orphans",
  "dead-parent-git-bash",
  "wall-clock-not-handle-ceiling",
  "find-orphans-11-days",
  "handle-pool-20gb",
  "mycroft-9-of-9",
  "immortal-tail-http",
  "wall-clock-ceiling",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "adrift";
export const SEEDED_WORD = "reaped";

export const MEASURED = {
  issue: 92583,
  title:
    "Windows: Bash tool commands auto-backgrounded on timeout are never cleaned up when the session ends, allowing orphaned processes to leak OS handles/kernel pool for days",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:bash"],
  filed: "2026-09-07T02:11:29Z",
  updated: "2026-09-07T05:50:30Z",
  reporter: "cloud-hai-vo",
  comments: 1,
  confirmer: "tonydzi",
  confirmerVoice: "Mycroft",
  os: "Windows 11 Pro 10.0.26200",
  surface: "Claude Code CLI Bash tool (Git Bash / MSYS2)",
  documentedTimeoutBehavior: "moved to background rather than killed",
  windowsOrphanCleanup: false,
  findOrphans: 6,
  findPath: "C:\\Program Files\\Git\\usr\\bin\\find.exe",
  findCommands: [
    "find / -iname *lightsail*",
    "find / -ipath *pgvector* -iname *.dll",
    "find / -iname Swashbuckle.AspNetCore.SwaggerGen.dll"
  ],
  runningSince: "Aug 27–31",
  maxAgeDays: 11,
  parentShellsExited: true,
  reparsePointCycle: true,
  reparseExamples: ["OneDrive", "WSL mounts", "Docker data dirs", "AppData junctions"],
  systemHandleCount: 61252162,
  healthyBaselineMin: 50000,
  healthyBaselineMax: 500000,
  handlesPerFindMin: 10000000,
  handlesPerFindMax: 11000000,
  workingSetPerFindMb: 6,
  kernelPagedPoolGb: 20.8,
  memoryUtilPercent: 98,
  memoryCompressionGb: 5.8,
  handlesAfterKill: 247000,
  midInvestigationTimeoutS: 120,
  midInvestigationCommand: "Win32_Product WMI | tail",
  mycroftOrphans: 9,
  mycroftSample: 9,
  mycroftAgeMinH: 22.1,
  mycroftAgeMaxH: 54.0,
  mycroftHandlesMin: 129,
  mycroftHandlesMax: 165,
  mycroftHandlesTotal: 1267,
  mycroftProvenDescendants: [
    { pid: 33880, proc: "bash.exe", ageH: 54.0, handles: 146, note: "snapshot-bash wrapper" },
    { pid: 66352, proc: "bash.exe", ageH: 51.9, handles: 165, note: "session scratchpad d42be52e" },
    {
      pid: 54660,
      proc: "nohup.exe",
      ageH: 51.9,
      handles: 129,
      note: "nohup python -m http.server 41888"
    },
    { pid: 66532, proc: "tail.exe", ageH: 44.3, handles: 134, note: "tail -f in session scratchpad" }
  ],
  immortalCommands: ["tail -f", "grep --line-buffered", "python -m http.server"],
  handleCeilingMissesImmortals: true,
  wallClockCatchesClass: true,
  suggestedFixes: [
    "track PIDs per session and terminate on session end",
    "periodic reminder when backgrounded far past timeout",
    "hard ceiling (wall-clock or handle-count) force-kill"
  ],
  relatedLayerUp: 91642,
  expected: "session-end tracks and reaps auto-backgrounded Bash PIDs",
  actual:
    "timeout promotes to background; session end leaves Windows children orphaned with a dead parent",
  impact:
    "days-long find.exe orphans holding ~10–11M handles each / Mycroft 9/9 unreaped including immortal tail -f"
};

export const COUSINS = [
  {
    id: 91642,
    state: "open",
    note: "Cite-only cousin. Scheduled-task CLI process does not exit after unattended run (claude.exe layer; 132 live claude.exe with Electron parent, oldest 67h). Same missing cleanup guarantee one layer above. Primary stays #92583. Do not auto-pick as primary."
  },
  {
    id: 92593,
    state: "open",
    note: "Cite-only cousin. Deadman: timeout background + TaskStop incomplete kill + MSYS root wipe. DIFFERENT: mid-incident TaskStop/MSYS path, not session-end unreaped orphans. Primary stays #92583."
  },
  {
    id: 92586,
    state: "open",
    note: "Cite-only cousin. Seizing: nlink!=1 false-triggers Bash output-file identity kill (~5s). DIFFERENT surface. Primary stays #92583."
  }
];

export const BACKUPS_DO_NOT_AUTO_PICK = [
  {
    id: 92624,
    note: "Named agent foreign session id. Do not auto-pick."
  },
  {
    id: 92662,
    note: "Chrome relaunch bridge. Do not auto-pick."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop overbroad SendMessage ban corks continuation. Different defect."
  },
  {
    slug: "afterimage",
    issue: 92596,
    note: "Afterimage/#92596: Windows text paint deferred until message_stop. Different defect."
  },
  {
    slug: "limber",
    issue: 92590,
    note: "Limber/#92590: unexpanded $TMPDIR write-allowlist. Different defect."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: blockReadsOutsideWorkingDirectories ignores additionalDirectories. Different defect."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout promote + TaskStop shell-only + MSYS wipe leftover. Snatch is specifically session-end never reaps auto-backgrounded Bash orphans."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: security-guidance ENOENT staging loop. Different defect."
  },
  {
    slug: "seizing",
    issue: 92586,
    note: "Seizing/#92586: nlink false positive kill. Different defect."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: prior catalog paradigm. Different defect."
  },
  { slug: "bitts", note: "Bitts: prior catalog paradigm. Different defect." },
  { slug: "sounder", note: "Sounder: prior catalog paradigm. Different defect." },
  { slug: "callboard", note: "Callboard: prior catalog paradigm. Different defect." },
  { slug: "knock", note: "Knock: prior catalog paradigm. Different defect." },
  { slug: "annunciator", note: "Annunciator: prior catalog paradigm. Different defect." },
  { slug: "touchstone", note: "Touchstone: prior catalog paradigm. Different defect." }
];

export const BLOCKS = [
  {
    id: "yard",
    role: "rope yard / Bash tool line",
    hail: "timeout → background (documented)",
    open: true
  },
  {
    id: "cheek",
    role: "hinged cheek / session-end reap",
    hail: "never opens — PIDs stay adrift",
    open: false
  },
  {
    id: "sheave",
    role: "sheave / Windows process",
    hail: "dead parent · Git Bash / MSYS2 still spinning",
    open: false
  }
];

const CHIP_REASONS = {
  adrift:
    "ALARM: line adrift; auto-backgrounded Bash children unreaped on session end. Score adrift or admit reaped",
  reaped:
    "snatch-block already reaped — session-end tracks and reaps those PIDs so the line is brought home. Seeded word is reaped",
  "unreaped-on-session-end":
    "unreaped-on-session-end — if the session ends (window closed / session finished) before a background command is explicitly stopped, the Windows process is orphaned; Windows does not clean orphaned children on parent/session exit",
  "timeout-to-background":
    "timeout-to-background — documented Bash tool behavior: a command exceeding timeout is moved to background rather than killed. Mid-investigation a Win32_Product WMI | tail exceeded 120s and auto-moved to background",
  "immortal-background-commands":
    "immortal-background-commands — tail -f, grep --line-buffered, and python -m http.server are immortal-by-construction; backgrounding them on timeout guarantees a permanent process rather than risking one",
  "handle-pool-exhaustion":
    "handle-pool-exhaustion — system-wide OS handle count 61,252,162 (healthy baseline ~50k–500k); each of six find.exe held ~10–11 million handles; kernel Paged Pool ~20.8 GB; 98% memory util; Memory Compression 5.8 GB",
  "nine-of-nine-orphans":
    "nine-of-nine-orphans — Mycroft / tonydzi confirmation: orphaning 9 of 9, ages 22.1h to 54.0h; every Git-Bash toolchain process with a dead parent",
  "dead-parent-git-bash":
    "dead-parent-git-bash — parent shells already exited; proven Claude Bash descendants include bash.exe 54.0h (snapshot-bash wrapper), bash.exe 51.9h, nohup.exe 51.9h, tail.exe 44.3h",
  "wall-clock-not-handle-ceiling":
    "wall-clock-not-handle-ceiling — Mycroft's nine orphans held 129–165 handles each (1,267 total) vs reporter's 10–11M; a handle-count ceiling alone would miss theirs; wall-clock since backgrounding catches the class",
  "find-orphans-11-days":
    "find-orphans-11-days — six orphaned C:\\Program Files\\Git\\usr\\bin\\find.exe from find / walks (lightsail, pgvector, Swashbuckle) running continuously since Aug 27–31 (up to 11 days); find / can enter a reparse-point/junction cycle",
  "handle-pool-20gb":
    "handle-pool-20gb — Kernel Paged Pool ~20.8 GB; killing the six PIDs dropped handles to ~247,000 and the paged pool began draining",
  "mycroft-9-of-9":
    "mycroft-9-of-9 — Mycroft / tonydzi on 2026-09-07: 9 of 9 unreaped including immortal tail -f; handle explosion does not always follow",
  "immortal-tail-http":
    "immortal-tail-http — nohup python -m http.server 41888 (51.9h) and tail -f in session scratchpad (44.3h) orphan in age-matched pairs; worse than find / because they have no terminating condition",
  "wall-clock-ceiling":
    "wall-clock-ceiling — suggested fix: a hard ceiling (wall-clock or handle-count) that force-kills a backgrounded command; wall-clock is the one that catches the immortal class, not handle-count alone",
  cousins:
    "cite-only #91642 scheduled-task CLI / 132 live claude.exe (layer above); #92593 Deadman timeout+TaskStop+MSYS wipe (mid-incident, not session-end unreaped); #92586 Seizing nlink false-trigger. Backups do not auto-pick: #92624 foreign session id, #92662 Chrome relaunch. Not Speakpipe/#92646. Not Afterimage/#92596. Not Limber/#92590. Not Chock/#92582. Not Eidolon/#92601. Not Oubliette/#92095. Not Bitts / Sounder / Callboard / Knock / Annunciator. Primary stays #92583",
  "has-clear-repro":
    "has-clear-repro — #92583 is labeled has repro: Windows 11 Pro 10.0.26200; Bash tool timeout→background; session-end orphans; six find.exe up to 11 days; Mycroft 9/9 confirmation"
};

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

export function adriftSignal(text = "") {
  return /adrift|line adrift|unreaped|dead parent/i.test(String(text || ""));
}

export function reapedSignal(text = "") {
  return /reaped|bring the line home|tracks and reaps|session-end tracks/i.test(
    String(text || "")
  );
}

export function unreapedSignal(text = "") {
  return /unreaped-on-session-end|session ends|window closed|orphaned children/i.test(
    String(text || "")
  );
}

export function timeoutSignal(text = "") {
  return /timeout-to-background|moved to background|120s|Win32_Product/i.test(
    String(text || "")
  );
}

export function immortalSignal(text = "") {
  return /immortal-background-commands|immortal-by-construction|no terminating condition/i.test(
    String(text || "")
  );
}

export function handlePoolSignal(text = "") {
  return /handle-pool-exhaustion|61,252,162|10–11 million|10-11 million/i.test(
    String(text || "")
  );
}

export function nineOfNineSignal(text = "") {
  return /nine-of-nine-orphans|9 of 9|9\/9/i.test(String(text || ""));
}

export function deadParentSignal(text = "") {
  return /dead-parent-git-bash|dead parent|parent shells already exited|snapshot-bash/i.test(
    String(text || "")
  );
}

export function wallClockSignal(text = "") {
  return /wall-clock-not-handle-ceiling|129–165|129-165|1,267|handle-count ceiling/i.test(
    String(text || "")
  );
}

export function findOrphansSignal(text = "") {
  return /find-orphans-11-days|find\.exe|Aug 27|11 days|reparse-point/i.test(
    String(text || "")
  );
}

export function pagedPoolSignal(text = "") {
  return /handle-pool-20gb|20\.8 GB|247,000|paged pool/i.test(String(text || ""));
}

export function mycroftSignal(text = "") {
  return /mycroft-9-of-9|Mycroft|tonydzi/i.test(String(text || ""));
}

export function immortalTailSignal(text = "") {
  return /immortal-tail-http|tail -f|http\.server 41888|nohup python/i.test(
    String(text || "")
  );
}

export function wallClockCeilingSignal(text = "") {
  return /wall-clock-ceiling|hard ceiling|wall-clock or handle-count/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    adrift: adriftSignal(blob),
    reaped: reapedSignal(blob),
    unreaped: unreapedSignal(blob),
    timeout: timeoutSignal(blob),
    immortal: immortalSignal(blob),
    handlePool: handlePoolSignal(blob),
    nineOfNine: nineOfNineSignal(blob),
    deadParent: deadParentSignal(blob),
    wallClock: wallClockSignal(blob),
    findOrphans: findOrphansSignal(blob),
    pagedPool: pagedPoolSignal(blob),
    mycroft: mycroftSignal(blob),
    immortalTail: immortalTailSignal(blob),
    wallClockCeiling: wallClockCeilingSignal(blob)
  };
}

export function lineReaped(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.lineReaped) || (boolish(t.reaped) && !boolish(t.adrift))) {
    return boolish(t.lineReaped) || (boolish(t.reaped) && !boolish(t.adrift));
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const unreaped =
    boolish(t.unreapedOnSessionEnd) ||
    (Object.hasOwn(t, "windowsOrphanCleanup") && t.windowsOrphanCleanup === false) ||
    hits.unreaped;
  const timeout =
    boolish(t.timeoutToBackground) ||
    t.documentedTimeoutBehavior === MEASURED.documentedTimeoutBehavior ||
    hits.timeout;
  const immortal =
    boolish(t.immortalBackgroundCommands) ||
    hits.immortal;
  const handlePool =
    boolish(t.handlePoolExhaustion) ||
    t.systemHandleCount === MEASURED.systemHandleCount ||
    hits.handlePool;
  const nine =
    boolish(t.nineOfNineOrphans) ||
    t.mycroftOrphans === 9 ||
    hits.nineOfNine;
  const deadParent =
    boolish(t.deadParentGitBash) ||
    boolish(t.parentShellsExited) ||
    hits.deadParent;
  const wallClock =
    boolish(t.wallClockNotHandleCeiling) ||
    boolish(t.handleCeilingMissesImmortals) ||
    hits.wallClock;
  const findOrphans =
    boolish(t.findOrphans11Days) ||
    t.findOrphans === 6 ||
    hits.findOrphans;
  const pagedPool =
    boolish(t.handlePool20gb) ||
    t.kernelPagedPoolGb === 20.8 ||
    hits.pagedPool;
  const mycroft =
    boolish(t.mycroft9Of9) ||
    t.confirmer === MEASURED.confirmer ||
    hits.mycroft;
  const immortalTail =
    boolish(t.immortalTailHttp) ||
    hits.immortalTail;
  const ceiling =
    boolish(t.wallClockCeiling) ||
    hits.wallClockCeiling;
  const reapedClean = boolish(t.reaped) || lineReaped(t);
  const adriftHit = boolish(t.adrift) || (unreaped && !boolish(t.reaped));
  return {
    unreaped,
    timeout,
    immortal,
    handlePool,
    nine,
    deadParent,
    wallClock,
    findOrphans,
    pagedPool,
    mycroft,
    immortalTail,
    ceiling,
    reapedClean,
    adriftHit,
    lineHome: lineReaped(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const adrift = boolish(t.adrift) || (print.adriftHit && !boolish(t.reaped));
  const reaped = boolish(t.reaped) || (print.reapedClean && !boolish(t.adrift));
  return {
    adrift,
    reaped,
    unreapedOnSessionEnd: boolish(t.unreapedOnSessionEnd) || print.unreaped,
    timeoutToBackground: boolish(t.timeoutToBackground) || print.timeout,
    immortalBackgroundCommands: boolish(t.immortalBackgroundCommands) || print.immortal,
    handlePoolExhaustion: boolish(t.handlePoolExhaustion) || print.handlePool,
    nineOfNineOrphans: boolish(t.nineOfNineOrphans) || print.nine,
    deadParentGitBash: boolish(t.deadParentGitBash) || print.deadParent,
    wallClockNotHandleCeiling: boolish(t.wallClockNotHandleCeiling) || print.wallClock,
    findOrphans11Days: boolish(t.findOrphans11Days) || print.findOrphans,
    handlePool20gb: boolish(t.handlePool20gb) || print.pagedPool,
    mycroft9Of9: boolish(t.mycroft9Of9) || print.mycroft,
    immortalTailHttp: boolish(t.immortalTailHttp) || print.immortalTail,
    wallClockCeiling: boolish(t.wallClockCeiling) || print.ceiling,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    os: t.os || MEASURED.os
  };
}

export function seedAdrift() {
  return {
    seed: "adrift",
    issue: 92583,
    adrift: true,
    reaped: false,
    unreapedOnSessionEnd: true,
    timeoutToBackground: true,
    immortalBackgroundCommands: true,
    handlePoolExhaustion: true,
    nineOfNineOrphans: true,
    deadParentGitBash: true,
    wallClockNotHandleCeiling: true,
    findOrphans11Days: true,
    handlePool20gb: true,
    mycroft9Of9: true,
    immortalTailHttp: true,
    wallClockCeiling: true,
    parentShellsExited: true,
    findOrphans: 6,
    outputText:
      "adrift; unreaped-on-session-end; timeout-to-background; find.exe 11 days; session ends; window closed; orphaned children",
    systemHandleCount: MEASURED.systemHandleCount,
    kernelPagedPoolGb: 20.8,
    mycroftOrphans: 9,
    reporter: MEASURED.reporter
  };
}

export function seedReaped() {
  return {
    seed: "reaped",
    issue: 92583,
    adrift: false,
    reaped: true,
    lineReaped: true,
    unreapedOnSessionEnd: false,
    timeoutToBackground: true,
    findOrphans: 0,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    adrift: seedAdrift(),
    reaped: seedReaped(),
    "unreaped-on-session-end": {
      seed: "unreaped-on-session-end",
      issue: 92583,
      unreapedOnSessionEnd: true
    },
    "timeout-to-background": {
      seed: "timeout-to-background",
      issue: 92583,
      timeoutToBackground: true,
      documentedTimeoutBehavior: MEASURED.documentedTimeoutBehavior
    },
    "immortal-background-commands": {
      seed: "immortal-background-commands",
      issue: 92583,
      immortalBackgroundCommands: true
    },
    "handle-pool-exhaustion": {
      seed: "handle-pool-exhaustion",
      issue: 92583,
      handlePoolExhaustion: true,
      systemHandleCount: MEASURED.systemHandleCount
    },
    "nine-of-nine-orphans": {
      seed: "nine-of-nine-orphans",
      issue: 92583,
      nineOfNineOrphans: true,
      mycroftOrphans: 9
    },
    "dead-parent-git-bash": {
      seed: "dead-parent-git-bash",
      issue: 92583,
      deadParentGitBash: true,
      parentShellsExited: true
    },
    "wall-clock-not-handle-ceiling": {
      seed: "wall-clock-not-handle-ceiling",
      issue: 92583,
      wallClockNotHandleCeiling: true,
      handleCeilingMissesImmortals: true
    },
    "find-orphans-11-days": {
      seed: "find-orphans-11-days",
      issue: 92583,
      findOrphans11Days: true,
      findOrphans: 6
    },
    "handle-pool-20gb": {
      seed: "handle-pool-20gb",
      issue: 92583,
      handlePool20gb: true,
      kernelPagedPoolGb: 20.8
    },
    "mycroft-9-of-9": {
      seed: "mycroft-9-of-9",
      issue: 92583,
      mycroft9Of9: true,
      confirmer: MEASURED.confirmer
    },
    "immortal-tail-http": {
      seed: "immortal-tail-http",
      issue: 92583,
      immortalTailHttp: true
    },
    "wall-clock-ceiling": {
      seed: "wall-clock-ceiling",
      issue: 92583,
      wallClockCeiling: true
    },
    cousins: {
      seed: "cousins",
      issue: 92583,
      cousins: true,
      cousinsCiteOnly: [91642, 92593, 92586]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92583,
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

const SPECIFIC_SEEDS = [
  "cousins",
  "unreaped-on-session-end",
  "timeout-to-background",
  "immortal-background-commands",
  "handle-pool-exhaustion",
  "nine-of-nine-orphans",
  "dead-parent-git-bash",
  "wall-clock-not-handle-ceiling",
  "find-orphans-11-days",
  "handle-pool-20gb",
  "mycroft-9-of-9",
  "immortal-tail-http",
  "wall-clock-ceiling",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "unreaped-on-session-end": (t, c) => boolish(t.unreapedOnSessionEnd) || c.unreapedOnSessionEnd,
  "timeout-to-background": (t, c) => boolish(t.timeoutToBackground) || c.timeoutToBackground,
  "immortal-background-commands": (t, c) =>
    boolish(t.immortalBackgroundCommands) || c.immortalBackgroundCommands,
  "handle-pool-exhaustion": (t, c) => boolish(t.handlePoolExhaustion) || c.handlePoolExhaustion,
  "nine-of-nine-orphans": (t, c) => boolish(t.nineOfNineOrphans) || c.nineOfNineOrphans,
  "dead-parent-git-bash": (t, c) => boolish(t.deadParentGitBash) || c.deadParentGitBash,
  "wall-clock-not-handle-ceiling": (t, c) =>
    boolish(t.wallClockNotHandleCeiling) || c.wallClockNotHandleCeiling,
  "find-orphans-11-days": (t, c) => boolish(t.findOrphans11Days) || c.findOrphans11Days,
  "handle-pool-20gb": (t, c) => boolish(t.handlePool20gb) || c.handlePool20gb,
  "mycroft-9-of-9": (t, c) => boolish(t.mycroft9Of9) || c.mycroft9Of9,
  "immortal-tail-http": (t, c) => boolish(t.immortalTailHttp) || c.immortalTailHttp,
  "wall-clock-ceiling": (t, c) => boolish(t.wallClockCeiling) || c.wallClockCeiling,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const snatch = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      adrift: true,
      reaped: false,
      chips: ["cousins", "adrift"],
      snatch
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      adrift: true,
      reaped: false,
      chips: [seed, "adrift"],
      snatch
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, snatch) && seed !== "adrift" && seed !== "reaped") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        adrift: true,
        reaped: false,
        chips: [name, "adrift"],
        snatch
      };
    }
  }

  if (
    seed === "reaped" ||
    (t.reaped === true && t.adrift !== true && seed !== "adrift") ||
    (snatch.reaped && !snatch.adrift && seed !== "adrift")
  ) {
    reasons.push(CHIP_REASONS.reaped);
    return {
      verdict: "reaped",
      reasons,
      adrift: false,
      reaped: true,
      chips: ["reaped"],
      snatch
    };
  }

  if (t.adrift === true || seed === "adrift" || (snatch.adrift && !snatch.reaped)) {
    reasons.push(CHIP_REASONS.adrift);
    const chips = ["adrift"];
    if (t.unreapedOnSessionEnd === true || snatch.unreapedOnSessionEnd) {
      chips.push("unreaped-on-session-end");
    }
    if (t.timeoutToBackground === true || snatch.timeoutToBackground) {
      chips.push("timeout-to-background");
    }
    if (t.immortalBackgroundCommands === true || snatch.immortalBackgroundCommands) {
      chips.push("immortal-background-commands");
    }
    if (t.handlePoolExhaustion === true || snatch.handlePoolExhaustion) {
      chips.push("handle-pool-exhaustion");
    }
    if (t.nineOfNineOrphans === true || snatch.nineOfNineOrphans) {
      chips.push("nine-of-nine-orphans");
    }
    if (t.deadParentGitBash === true || snatch.deadParentGitBash) {
      chips.push("dead-parent-git-bash");
    }
    if (t.wallClockNotHandleCeiling === true || snatch.wallClockNotHandleCeiling) {
      chips.push("wall-clock-not-handle-ceiling");
    }
    if (t.findOrphans11Days === true || snatch.findOrphans11Days) {
      chips.push("find-orphans-11-days");
    }
    if (t.handlePool20gb === true || snatch.handlePool20gb) {
      chips.push("handle-pool-20gb");
    }
    if (t.mycroft9Of9 === true || snatch.mycroft9Of9) {
      chips.push("mycroft-9-of-9");
    }
    if (t.immortalTailHttp === true || snatch.immortalTailHttp) {
      chips.push("immortal-tail-http");
    }
    if (t.wallClockCeiling === true || snatch.wallClockCeiling) {
      chips.push("wall-clock-ceiling");
    }
    return {
      verdict: "adrift",
      reasons,
      adrift: true,
      reaped: false,
      chips: [...new Set(chips)],
      snatch
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, adrift: false, reaped: true, chips: [seed], snatch };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      adrift: true,
      reaped: false,
      chips: [seed],
      snatch
    };
  }

  reasons.push(
    "empty probe; idle snatch-block is adrift — ALARM: line adrift; auto-backgrounded Bash children unreaped on session end"
  );
  return {
    verdict: "adrift",
    reasons,
    adrift: true,
    reaped: false,
    chips: ["adrift"],
    snatch
  };
}
