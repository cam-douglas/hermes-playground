/**
 * Hardstand night-apron scorer.
 * Dispatch radio refuses a second landing
 * on the same non-git pad while the tower
 * still clears concurrent traffic.
 *
 * Encoded from #92452 issue facts only.
 * exclusiveCwd claims are cousin #91745
 * evidence, labeled hypothesis for #92452.
 */
export const CHIPS = [
  "cleared",
  "refused",
  "dispatch-only",
  "exclusive-cwd",
  "non-git-parent",
  "app-concurrent",
  "scheduled-ok",
  "bundle-258-regression",
  "worktree-workaround",
  "stale-block",
  "cousins"
];

export const HOLD = new Set(["cleared"]);

export const ALARM = new Set([
  "refused",
  "dispatch-only",
  "exclusive-cwd",
  "non-git-parent",
  "app-concurrent",
  "scheduled-ok",
  "bundle-258-regression",
  "worktree-workaround",
  "stale-block",
  "cousins"
]);

export function seedRefused() {
  return {
    seed: "refused",
    issue: 92452,
    refused: true,
    dispatchOnly: true,
    exclusiveCwd: true,
    nonGitParent: true,
    appConcurrent: true,
    scheduledOk: true,
    bundle258Regression: true,
    cwd: "~/Projects",
    tool: "mcp__dispatch__start_code_task",
    error:
      "[DispatchTools] start_code_task failed for ~/Projects: Another Claude Code session is already active in this directory."
  };
}

export function seedCleared() {
  return {
    seed: "cleared",
    issue: 92452,
    cleared: true,
    refused: false,
    dispatchAccepted: true,
    cwd: "~/Projects"
  };
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const reasons = [];

  if (HOLD.has(seed) || (t.cleared === true && t.refused !== true && t.dispatchAccepted === true)) {
    reasons.push("pad open for another Dispatch landing");
    return { verdict: "cleared", reasons, cleared: true, refused: false, chips: ["cleared"] };
  }

  if (seed === "cousins" || Array.isArray(t.cousinsCiteOnly)) {
    reasons.push("cite-only #91745 #92462; primary stays #92452");
    return { verdict: "cousins", reasons, cleared: false, refused: true, chips: ["cousins", "refused"] };
  }

  if (seed === "stale-block" || t.staleBlock === true) {
    reasons.push("cousin #92462 finished non-archived records still occupy the pad");
    return { verdict: "stale-block", reasons, cleared: false, refused: true, chips: ["stale-block", "refused"] };
  }

  if (seed === "worktree-workaround" || t.worktreeWorkaround === true) {
    reasons.push("individual git repo pad still accepts Dispatch; parent pad still refused");
    return {
      verdict: "worktree-workaround",
      reasons,
      cleared: false,
      refused: true,
      chips: ["worktree-workaround", "refused"]
    };
  }

  if (seed === "bundle-258-regression" || t.bundle258Regression === true && seed === "bundle-258-regression") {
    reasons.push("first refuse 19s after claude-code-vm/2.1.258; still fails on 2.1.260");
    return {
      verdict: "bundle-258-regression",
      reasons,
      cleared: false,
      refused: true,
      chips: ["bundle-258-regression", "refused"]
    };
  }

  if (seed === "scheduled-ok" || (t.scheduledOk === true && seed === "scheduled-ok")) {
    reasons.push("scheduled tasks still overlap daily on ~/Projects");
    return { verdict: "scheduled-ok", reasons, cleared: false, refused: true, chips: ["scheduled-ok", "refused"] };
  }

  if (seed === "app-concurrent" || (t.appConcurrent === true && seed === "app-concurrent")) {
    reasons.push("app opened two ~/Projects sessions 29s apart; both active");
    return { verdict: "app-concurrent", reasons, cleared: false, refused: true, chips: ["app-concurrent", "refused"] };
  }

  if (seed === "non-git-parent" || (t.nonGitParent === true && seed === "non-git-parent")) {
    reasons.push("plain parent folder containing many git repos");
    return { verdict: "non-git-parent", reasons, cleared: false, refused: true, chips: ["non-git-parent", "refused"] };
  }

  if (seed === "exclusive-cwd" || (t.exclusiveCwd === true && seed === "exclusive-cwd")) {
    reasons.push("cousin #91745 exclusiveCwd hardcoded true; hypothesis only for #92452");
    return { verdict: "exclusive-cwd", reasons, cleared: false, refused: true, chips: ["exclusive-cwd", "refused"] };
  }

  if (seed === "dispatch-only" || (t.dispatchOnly === true && seed === "dispatch-only")) {
    reasons.push("only mcp__dispatch__start_code_task is rejected");
    return { verdict: "dispatch-only", reasons, cleared: false, refused: true, chips: ["dispatch-only", "refused"] };
  }

  if (
    t.refused === true ||
    seed === "refused" ||
    (typeof t.error === "string" && /already active in this directory/i.test(t.error))
  ) {
    reasons.push("Dispatch start_code_task refused a second session on the same non-git pad");
    const chips = ["refused"];
    if (t.dispatchOnly === true) chips.push("dispatch-only");
    if (t.nonGitParent === true) chips.push("non-git-parent");
    if (t.appConcurrent === true) chips.push("app-concurrent");
    if (t.bundle258Regression === true) chips.push("bundle-258-regression");
    return { verdict: "refused", reasons, cleared: false, refused: true, chips };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, cleared: false, refused: true, chips: [seed] };
  }

  reasons.push("empty probe; idle pad is cleared");
  return { verdict: "cleared", reasons, cleared: true, refused: false, chips: ["cleared"] };
}
