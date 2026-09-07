/**
 * Bitts — dockside mooring bitts / twin iron posts / oak wharf.
 *
 * A worktree pool slot under `.claude/worktrees/<name>` (from
 * `Agent(isolation: "worktree")`) should stay belayed to its live
 * session. Instead the harness appears to recycle/reset the physical
 * directory for a different task while the original session is still
 * active — ~5,900 tracked files vanish mid-session as unstaged
 * deletions, host reapers logged `keep:active` and never touched it,
 * and `git reflog` in that directory shows ≥3 unrelated branches in
 * one day including `reset: moving to origin/main` then detached HEAD
 * on an unrelated commit.
 *
 * Encoded from anthropics/claude-code#92573 issue facts only.
 * Hypothesis (NON-BINDING): harness worktree pool may reassign
 * physical `.claude/worktrees/<name>` slots for new
 * Agent(isolation:worktree) dispatches without checking whether a
 * live session still holds that directory; host-side keep:active
 * guards cannot see that recycle. Do not claim a root cause in
 * Claude Code source you have not seen.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 */

export const VERDICTS = [
  "razed",
  "belayed",
  "slot-recycle",
  "reflog-churn",
  "keep-active",
  "mass-deletions",
  "cousins",
  "hold",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["belayed", "hold"]);

export const ALARM = new Set([
  "razed",
  "slot-recycle",
  "reflog-churn",
  "keep-active",
  "mass-deletions",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "razed";
export const SEEDED_WORD = "belayed";

export const MEASURED = {
  issue: 92573,
  title:
    ".claude/worktrees/* pool: worktree slot appears reused/reset while a session is still active, causing mass file loss mid-session",
  state: "open",
  labels: ["bug", "has repro", "area:agents", "data-loss"],
  filed: "2026-09-07T00:57:35Z",
  updated: "2026-09-07T00:58:45Z",
  reporter: "capfininv",
  comments: 0,
  isolation: "worktree",
  isolationCall: 'Agent(isolation: "worktree")',
  poolPath: ".claude/worktrees/<name>",
  trackedFilesVanished: 5900,
  statusCommand: "git status --short",
  unstagedDeletions: [
    ".githooks/*",
    "most of tools/*",
    ".gemini/commands/*",
    ".cursor/rules/*"
  ],
  noDestructiveCommand: ["rm", "git clean", "git checkout"],
  reaperVerdict: "keep:active",
  reaperTouched: false,
  reflogUnrelatedBranchesMin: 3,
  reflogReset: "reset: moving to origin/main",
  detachedHead: true,
  detachedUnrelated: true,
  priorIncident: "2026-08-14",
  priorWorktree: "amazing-colden-f035e5",
  livenessGuardScope:
    "only protects the repo's own reaper — no visibility into harness recycling/reset of .claude/worktrees/* pool slots",
  expected:
    "A worktree pool slot under .claude/worktrees/<name> stays belayed to its live session. Host keep:active is honored. No mid-session recycle. Tree intact.",
  actual:
    "Physical directory appears reassigned/reset for a different task while the original session is still using it. ~5,900 tracked files vanish as unstaged deletions. Reflog cycles ≥3 unrelated branches in one day, including reset: moving to origin/main, ending detached HEAD on an unrelated commit."
};

export const COUSINS = [
  {
    id: 87349,
    state: "open",
    note: "Cite-only cousin. Pin-race: isolation guard validates against another session's worktree (newest-created / shared pin key) under concurrent worktree churn. Not pool-slot recycle of the physical directory. Primary stays #92573."
  },
  {
    id: 73900,
    state: "open",
    note: "Cite-only cousin. archive_session(\"self\") deletes the worktree then resumes onto it instead of terminating. Not mid-session pool reuse. Primary stays #92573."
  },
  {
    id: 92019,
    state: "open",
    note: "Cite-only cousin. Windows worktree create failure since 2.1.260: background full checkout forces checkout.workers=8. Not a live-slot recycle. Primary stays #92573."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "gland",
    issue: 92533,
    note: "Gland/#92533: any Bash tool.call function-hook strips Agent(isolation:\"worktree\") so every pwd is refused with context_lost — isolation collar, NOT pool directory recycle."
  },
  {
    slug: "seizing",
    issue: 92586,
    note: "Seizing/#92586: EDR transient hard-link nlink spike false-triggers Bash output-file identity check → SIGKILL ~5s exit 137. Different defect."
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification with no assistant turn. Different defect."
  },
  {
    slug: "cringle",
    issue: 92542,
    note: "Cringle/#92542: deny unwrap 8-item wrapper bypass. Different defect."
  },
  {
    slug: "kerf",
    issue: 92539,
    note: "Kerf/#92539: Remove-Item spaced-path false positive. Different defect."
  },
  {
    slug: "demurrage",
    issue: 92548,
    note: "Demurrage/#92548: daemon chat process leak. Different defect."
  },
  {
    slug: "scarph",
    issue: 92543,
    note: "Scarph/#92543: Windows Bash -c shear. Different defect."
  },
  {
    slug: "plimsoll",
    issue: 92434,
    note: "Plimsoll/#92434: auto-compact load-line. Different defect."
  },
  {
    slug: "diopter",
    issue: 92524,
    note: "Diopter/#92524: per-session scratchpad defocus. Different defect."
  },
  {
    slug: "decant",
    issue: 92515,
    note: "Decant/#92515: login-shell env skim. Different defect."
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

export function isolationWorktree(text = "") {
  return /Agent\(isolation:\s*"worktree"\)|isolation:\s*"worktree"|isolation['"]?\s*:\s*['"]worktree['"]/i.test(
    String(text || "")
  );
}

export function poolSlotPath(text = "") {
  return /\.claude\/worktrees/i.test(String(text || ""));
}

export function massDeletionSignal(text = "") {
  return /~?5,?900|5900|unstaged deletion|thousands of unstaged|\.githooks\/\*|\.gemini\/commands\/\*|\.cursor\/rules\/\*/i.test(
    String(text || "")
  );
}

export function keepActiveSignal(text = "") {
  return /keep:active|never touched/i.test(String(text || ""));
}

export function reflogChurnSignal(text = "") {
  return /reset:\s*moving to origin\/main|detached HEAD|unrelated branches|reflog/i.test(
    String(text || "")
  );
}

export function slotRecycleSignal(text = "") {
  return /reassigned|recycled|reused\/reset|pool slot|hot-bunk|physical directory was reassigned/i.test(
    String(text || "")
  );
}

export function priorIncidentSignal(text = "") {
  return /amazing-colden-f035e5|2026-08-14/i.test(String(text || ""));
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const isolation =
    t.isolation === "worktree" ||
    boolish(t.isolationWorktree) ||
    isolationWorktree(blob) ||
    isolationWorktree(t.isolationCall || "");
  const pool =
    boolish(t.poolSlot) ||
    poolSlotPath(t.poolPath || "") ||
    poolSlotPath(blob);
  const vanished =
    Number(t.trackedFilesVanished ?? t.vanished ?? t.deletions) >= 5900 ||
    boolish(t.massDeletions) ||
    massDeletionSignal(blob);
  const keepActive =
    boolish(t.keepActive) ||
    t.reaperVerdict === "keep:active" ||
    keepActiveSignal(blob);
  const reaperUntouched =
    t.reaperTouched === false ||
    boolish(t.reaperUntouched) ||
    /never touched/i.test(blob);
  const reflogChurn =
    boolish(t.reflogChurn) ||
    Number(t.reflogUnrelatedBranches ?? t.unrelatedBranches) >= 3 ||
    reflogChurnSignal(blob);
  const resetMain =
    boolish(t.resetToOriginMain) ||
    /reset:\s*moving to origin\/main/i.test(blob);
  const detached =
    boolish(t.detachedHead) ||
    /detached HEAD/i.test(blob);
  const recycled =
    boolish(t.slotRecycle) ||
    boolish(t.recycled) ||
    slotRecycleSignal(blob);
  const prior =
    boolish(t.priorIncident) ||
    t.priorWorktree === "amazing-colden-f035e5" ||
    priorIncidentSignal(blob);
  const intact =
    boolish(t.intact) ||
    boolish(t.belayed) ||
    boolish(t.treeIntact);
  const liveSession =
    t.sessionActive !== false &&
    !boolish(t.sessionEnded);
  return {
    isolation,
    pool,
    vanished,
    keepActive,
    reaperUntouched,
    reflogChurn,
    resetMain,
    detached,
    recycled,
    prior,
    intact,
    liveSession
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const razed =
    boolish(t.razed) ||
    (print.vanished && print.recycled && !boolish(t.belayed) && !boolish(t.intact));
  const belayed =
    boolish(t.belayed) ||
    (print.intact && !print.vanished && !boolish(t.razed));
  return {
    razed,
    belayed,
    slotRecycle: boolish(t.slotRecycle) || print.recycled,
    reflogChurn: boolish(t.reflogChurn) || print.reflogChurn,
    keepActive: boolish(t.keepActive) || print.keepActive,
    massDeletions: boolish(t.massDeletions) || print.vanished,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && t.labels.includes("has repro")),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    isolation: t.isolation || MEASURED.isolation
  };
}

export function seedRazed() {
  return {
    seed: "razed",
    issue: 92573,
    razed: true,
    belayed: false,
    slotRecycle: true,
    massDeletions: true,
    isolation: "worktree",
    isolationCall: MEASURED.isolationCall,
    poolPath: MEASURED.poolPath,
    trackedFilesVanished: 5900,
    reaperVerdict: "keep:active",
    reporter: MEASURED.reporter
  };
}

export function seedBelayed() {
  return {
    seed: "belayed",
    issue: 92573,
    razed: false,
    belayed: true,
    intact: true,
    treeIntact: true,
    slotRecycle: false,
    isolation: "worktree",
    isolationCall: MEASURED.isolationCall,
    poolPath: MEASURED.poolPath,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    razed: seedRazed(),
    belayed: seedBelayed(),
    "slot-recycle": {
      seed: "slot-recycle",
      issue: 92573,
      slotRecycle: true,
      razed: true
    },
    "reflog-churn": {
      seed: "reflog-churn",
      issue: 92573,
      reflogChurn: true,
      resetToOriginMain: true,
      detachedHead: true,
      unrelatedBranches: 3
    },
    "keep-active": {
      seed: "keep-active",
      issue: 92573,
      keepActive: true,
      reaperVerdict: "keep:active",
      reaperTouched: false
    },
    "mass-deletions": {
      seed: "mass-deletions",
      issue: 92573,
      massDeletions: true,
      trackedFilesVanished: 5900
    },
    cousins: {
      seed: "cousins",
      issue: 92573,
      cousins: true,
      cousinsCiteOnly: [87349, 73900, 92019]
    },
    hold: {
      seed: "hold",
      issue: 92573,
      belayed: true,
      intact: true
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92573,
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
  const bitts = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #87349 pin-race isolation guard validates against another session's worktree; #73900 archive_session(\"self\") deletes worktree then resumes onto it; #92019 Windows checkout.workers=8 worktree create failure. Not Gland/#92533 Bash-hook-strips-worktree-isolation. Not Seizing/#92586 EDR nlink SIGKILL. Not Larum/#92563. Not Cringle/#92542. Not Kerf/#92539. Not Demurrage/#92548. Not Scarph/#92543. Not Plimsoll/#92434. Not Diopter/#92524. Not Decant/#92515. Primary stays #92573"
    );
    return {
      verdict: "cousins",
      reasons,
      razed: true,
      belayed: false,
      chips: ["cousins", "razed"],
      bitts
    };
  }

  if (seed === "slot-recycle" || (t.slotRecycle === true && seed !== "razed" && seed !== "belayed" && seed !== "hold")) {
    reasons.push(
      "physical .claude/worktrees/<name> directory reassigned/reset for a different task while the original session was still using it — Agent(isolation: \"worktree\") pool slot recycle"
    );
    return {
      verdict: "slot-recycle",
      reasons,
      razed: true,
      belayed: false,
      chips: ["slot-recycle", "razed"],
      bitts
    };
  }

  if (seed === "reflog-churn" || (t.reflogChurn === true && seed !== "razed" && seed !== "belayed" && seed !== "hold")) {
    reasons.push(
      "git reflog for that worktree directory: slot cycling through at least three unrelated branches within one day, including reset: moving to origin/main, ending in detached HEAD on a commit unrelated to the reporting session"
    );
    return {
      verdict: "reflog-churn",
      reasons,
      razed: true,
      belayed: false,
      chips: ["reflog-churn", "razed"],
      bitts
    };
  }

  if (seed === "keep-active" || (t.keepActive === true && seed !== "razed" && seed !== "belayed" && seed !== "hold")) {
    reasons.push(
      "host repo-side reaper/cleanup tooling ruled out: two worktree-reaping tools classified the worktree as keep:active / never touched it (audit logs). Liveness guard only protects the repo's own reaper — no visibility into harness pool recycling"
    );
    return {
      verdict: "keep-active",
      reasons,
      razed: true,
      belayed: false,
      chips: ["keep-active", "razed"],
      bitts
    };
  }

  if (seed === "mass-deletions" || (t.massDeletions === true && seed !== "razed" && seed !== "belayed" && seed !== "hold")) {
    reasons.push(
      "~5,900 tracked files vanished mid-session; git status --short showed thousands of unstaged deletions (.githooks/*, most of tools/*, .gemini/commands/*, .cursor/rules/*). Session was actively editing; had run no destructive command (no rm, git clean, or git checkout)"
    );
    return {
      verdict: "mass-deletions",
      reasons,
      razed: true,
      belayed: false,
      chips: ["mass-deletions", "razed"],
      bitts
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "razed" && seed !== "belayed" && seed !== "hold")) {
    reasons.push(
      "has-clear-repro — #92573 labeled has repro + data-loss; Agent(isolation: \"worktree\") slot recycle with keep:active host reapers, reflog ≥3 branches, reset: moving to origin/main, detached unrelated HEAD, prior 2026-08-14 amazing-colden-f035e5"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      razed: true,
      belayed: false,
      chips: ["has-clear-repro", "razed"],
      bitts
    };
  }

  if (seed === "hold") {
    reasons.push(
      "hold — slot stays assigned to the live session; keep:active honored; no mid-session recycle; tree intact. A bitts that hot-bunks a live warp is not a hold; this probe admits the hold path"
    );
    return {
      verdict: "hold",
      reasons,
      razed: false,
      belayed: true,
      chips: ["hold", "belayed"],
      bitts
    };
  }

  if (
    seed === "belayed" ||
    (t.belayed === true && t.razed !== true && seed !== "razed") ||
    (bitts.belayed && !bitts.razed && seed !== "razed" && seed !== "slot-recycle")
  ) {
    reasons.push(
      "bitts already belayed — slot stays assigned to live session; keep:active honored; no mid-session recycle; tree intact. Seeded word is belayed"
    );
    return {
      verdict: "belayed",
      reasons,
      razed: false,
      belayed: true,
      chips: ["belayed"],
      bitts
    };
  }

  if (
    t.razed === true ||
    seed === "razed" ||
    (bitts.razed && !bitts.belayed)
  ) {
    reasons.push(
      "A bitts that hot-bunks a live warp is not a hold. Score razed or admit belayed. Pool slot recycled mid-session; ~5,900 tracked files vanish as unstaged deletions; host reapers keep:active and never touched it; reflog ≥3 unrelated branches including reset: moving to origin/main then detached unrelated HEAD"
    );
    const chips = ["razed"];
    if (t.slotRecycle === true || bitts.slotRecycle) chips.push("slot-recycle");
    if (t.massDeletions === true || bitts.massDeletions) chips.push("mass-deletions");
    if (t.keepActive === true || bitts.keepActive) chips.push("keep-active");
    if (t.reflogChurn === true || bitts.reflogChurn) chips.push("reflog-churn");
    return {
      verdict: "razed",
      reasons,
      razed: true,
      belayed: false,
      chips: [...new Set(chips)],
      bitts
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, razed: false, belayed: true, chips: [seed], bitts };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      razed: true,
      belayed: false,
      chips: [seed],
      bitts
    };
  }

  reasons.push(
    "empty probe; idle bitts bench is razed — a worktree pool slot under .claude/worktrees/<name> from Agent(isolation: \"worktree\") appears recycled/reset while a session is still active"
  );
  return {
    verdict: "razed",
    reasons,
    razed: true,
    belayed: false,
    chips: ["razed"],
    bitts
  };
}
