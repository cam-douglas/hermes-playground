/**
 * Deadletter — postal dead-letter / undeliverable-mail bench.
 *
 * On Windows interactive CLI, after a worktree context transition
 * (session start / EnterWorktree / ExitWorktree), the first Bash or
 * PowerShell tool call can complete successfully
 * (`tool_dispatch_end outcome=ok`, command side-effects real) yet
 * never persist a matching `tool_result`. Transcript ends at assistant
 * `tool_use`. No next model turn. Process stays busy with no shell
 * child. Removing PostToolUse/PostToolUseFailure hooks delivers;
 * restoring them loses again; `async: true` on PostToolUse avoids the
 * blocking path. Print/SDK (`claude -p`) succeeds. Not Bash-specific.
 * Proxy not causal. Original pre-spawn hang diagnosis was incorrect.
 *
 * Encoded from anthropics/claude-code#90049 issue body + reporter
 * comments only. Hypothesis (NON-BINDING): interactive PostToolUse
 * stream orchestration after worktree transitions fails to
 * close/consume so completed tool_results never reach the interactive
 * consumer; print/SDK and async:true bypass. Invite verify against
 * issue text only — do not invent unread source. Do NOT implement a
 * fix in anthropics/claude-code. No network. No exploits. No live
 * Claude. No secrets. No payloads. Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "receipted",
  "lost",
  "filed",
  "dispatch-ok-no-persist",
  "posttooluse-orchestration",
  "worktree-transition",
  "print-sdk-ok",
  "async-hook-mitigation",
  "bash-and-powershell",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["receipted", "filed"]);

export const ALARM = new Set([
  "lost",
  "dispatch-ok-no-persist",
  "posttooluse-orchestration",
  "worktree-transition",
  "print-sdk-ok",
  "async-hook-mitigation",
  "bash-and-powershell",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "receipted";
export const SEEDED_WORD = "lost";
export const ADMIT_WORD = "filed";

export const DISPATCH_OK = {
  tool: "PowerShell",
  toolUseId: "toolu_01J7bPw5ZW4YSjTkJRCwtZDM",
  start: "2026-09-07T19:38:42.198Z",
  end: "2026-09-07T19:38:45.356Z",
  outcome: "ok",
  durationMs: 3158,
  permissionDecisionMs: 1174
};

export const HOOKS_AB = {
  without:
    "EnterWorktree result persisted → first post-transition PowerShell completed → tool_result persisted → next model turn completed",
  with: "tool_dispatch_end outcome=ok then no tool_result; no child powershell/pwsh/sonar hook remains",
  duplicatesNotRequired: true,
  asyncTrue:
    "async:true PostToolUse completes and persists tool_result; async_hook_33956 registered as PostToolUse:PowerShell"
};

export const FLOW = [
  "await tool.call",
  "tool_dispatch_end outcome=ok",
  "async PostToolUse iteration",
  "construct/push tool_result"
];

export const MEASURED = {
  issue: 90049,
  title:
    "Interactive CLI loses completed shell results after worktree transitions with PostToolUse hooks on Windows",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:bash"],
  filed: "2026-08-27T09:59:22Z",
  updatedDiagnosis: "2026-09-07/08",
  reporter: "simon-bauer-sonarsource",
  versions: "2.1.247 → 2.1.263",
  os: "Windows 11 Pro 10.0.26100",
  surface:
    "after worktree transition the first Bash or PowerShell tool call can complete with tool_dispatch_end outcome=ok yet never persist a matching tool_result",
  expected:
    "completed shell tool_results stay receipted into the interactive transcript after session start / EnterWorktree / ExitWorktree",
  actual:
    "transcript ends at assistant tool_use; no next model turn; process stays busy with no shell child",
  dispatch: DISPATCH_OK,
  commandCompleted:
    "git worktree created; timestamps inside the dispatch interval",
  shells: ["Bash", "PowerShell"],
  transitions: ["session start", "EnterWorktree", "ExitWorktree"],
  proxy:
    "reproduces with and without local proxy; SSE tool_use sequence complete at proxy (not drop/truncate)",
  hooks: HOOKS_AB,
  flow: FLOW,
  printSdk: "cc_entrypoint=cli hangs; cc_entrypoint=sdk-cli claude -p succeeds",
  originalDiagnosisIncorrect: true,
  hypothesis:
    "NON-BINDING: interactive PostToolUse stream orchestration after worktree transitions fails to close/consume so completed tool_results never reach the interactive consumer; print/SDK and async:true bypass. Invite verify against issue text only."
};

export const TRAY_LEDGER = [
  {
    id: "dispatch",
    role: "dispatch-ok stamp / command completed",
    tally: "tool_dispatch_end outcome=ok durationMs recorded",
    note: "command side-effects real (git worktree created); timestamps inside the interval"
  },
  {
    id: "tray",
    role: "undeliverable tray / missing tool_result",
    tally: "transcript ends at assistant tool_use",
    note: "no matching tool_result persisted; no next model turn; process busy; no shell child"
  },
  {
    id: "hooks",
    role: "PostToolUse pigeonhole / blocking iterator",
    tally: "without hooks → delivers; restored hooks → loses; async:true persists",
    note: "duplicate hooks not required; print/SDK succeeds with the same hooks"
  }
];

export const REPRO_TABLE = [
  { step: "transition", mark: "EnterWorktree", note: "first call after session start / enter / exit" },
  { step: "dispatch", mark: "outcome=ok", note: "tool_dispatch_end; command completed" },
  { step: "hooks", mark: "PostToolUse", note: "blocking iterator after worktree transition" },
  { step: "persist", mark: "no tool_result", note: "transcript ends at tool_use" }
];

export const COUSINS = [
  {
    id: 84154,
    state: "closed",
    title: "Bash tool intermittently takes minutes to return despite command finishing in <10ms",
    note: "cite-only — closed/stale; same early symptom class; not the #90049 PostToolUse localization"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "dryjoint",
    issue: 92809,
    note: "Dryjoint/#92809 already shipped — VS Code chat anchors never call open_file. Do not touch."
  },
  {
    slug: "dinkus",
    issue: 92798,
    note: "Dinkus/#92798 already shipped — plugin-settings sed frontmatter. Do not touch."
  },
  {
    slug: "homonym",
    issue: 92787,
    note: "Homonym/#92787 already shipped — Desktop UUID connector mounts. Do not touch."
  },
  {
    slug: "rushlight",
    issue: 92784,
    note: "Rushlight/#92784 already shipped — session-scoped TCC AppData. Do not touch."
  },
  {
    slug: "clepsydra",
    issue: 92776,
    note: "Clepsydra/#92776 already shipped — OTel mid-session meter. Do not touch."
  },
  {
    slug: "letoff",
    issue: 92771,
    note: "Letoff/#92771 already shipped — libuv Shift+Enter flatten. Do not touch."
  },
  {
    slug: "ptybind",
    issue: 92757,
    note: "Ptybind/#92757 already shipped — ConPTY editor keys. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  },
  {
    slug: "caisson",
    issue: 91405,
    note: "Caisson/#91405 already shipped. Do not touch."
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped. Do not touch."
  }
];

export const BACKUPS = [
  { id: 88418, note: "path-spelling split in .claude.json — README only; do not auto-pick" },
  { id: 89395, note: "/diff git without useCwd — README only; do not auto-pick" },
  { id: 87289, note: "hook timeout while stdin blocked — README only; do not auto-pick" },
  { id: 87777, note: "RC auto-enable first turn only — README only; do not auto-pick" },
  { id: 92788, note: "AskUserQuestion free-text discard / alt Quill — README only; do not auto-pick" },
  { id: 92794, note: "classic mouse dead Ptyxis — README only; do not auto-pick" }
];

const CHIP_REASONS = {
  receipted:
    "HOLD: pigeonhole is receipted — completed shell tool_results stay receipted into the interactive transcript after worktree transitions. Score lost or admit filed",
  lost:
    "ALARM: PostToolUse orchestration loses the result after tool_dispatch_end outcome=ok while print/SDK still delivers. Score lost or admit filed",
  filed:
    "letter already filed — hypothetical: interactive consumer closes/consumes the PostToolUse stream after a worktree transition so the completed tool_result is filed. Admit word is filed",
  "dispatch-ok-no-persist":
    "dispatch-ok-no-persist — tool_dispatch_start → tool_dispatch_end outcome=ok durationMs recorded; command completed (git worktree created); no matching tool_result persisted; transcript ends at tool_use",
  "posttooluse-orchestration":
    "posttooluse-orchestration — after await tool.call → tool_dispatch_end ok → async PostToolUse iteration → construct/push tool_result; interactive consumer fails to close/consume the stream after a worktree transition",
  "worktree-transition":
    "worktree-transition — first Bash or PowerShell call after session start / EnterWorktree / ExitWorktree; repeat of the same command often fine",
  "print-sdk-ok":
    "print-sdk-ok — cc_entrypoint=cli interactive hangs; cc_entrypoint=sdk-cli claude -p succeeds with the same hooks",
  "async-hook-mitigation":
    "async-hook-mitigation — async:true PostToolUse completes and persists tool_result; 17 ms later async_hook_33956 registered as PostToolUse:PowerShell",
  "bash-and-powershell":
    "bash-and-powershell — not Bash-specific; native PowerShell tool also loses the completed result after dispatch-ok; original pre-spawn hang diagnosis was incorrect",
  cousins:
    "cite-only neighbourhood — #84154 CLOSED/stale Bash intermittently minutes to return despite <10ms command; same early symptom class. Primary stays #90049",
  "has-clear-repro":
    "has-clear-repro — #90049 is labeled has repro: first Bash or PowerShell after a worktree transition; dispatch-ok; no tool_result; filed 2026-08-27T09:59:22Z; labels bug, has repro, platform:windows, area:bash"
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

/**
 * Educational: did the published dispatch log end outcome=ok?
 * Reconstructs the reporter's Stall lines, not a live Claude call.
 */
export function dispatchEndedOk(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.dispatchOk) || boolish(t.dispatchOkNoPersist)) return true;
  const dispatch = t.dispatch && typeof t.dispatch === "object" ? t.dispatch : {};
  if (String(dispatch.outcome || "") === "ok") return true;
  return /tool_dispatch_end outcome=ok|outcome=ok durationMs/i.test(extractText(t));
}

/**
 * Educational: was a matching tool_result persisted after tool_use?
 * Diagnostic only — does not talk to a live transcript.
 */
export function toolResultPersisted(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.toolResultPersisted) || boolish(t.receipted) || boolish(t.filed)) {
    return !boolish(t.lost) && !boolish(t.dispatchOkNoPersist);
  }
  if (boolish(t.noToolResult) || boolish(t.dispatchOkNoPersist) || boolish(t.lost)) {
    return false;
  }
  return /tool_result persisted|next model turn completed/i.test(extractText(t));
}

/**
 * Educational: are PostToolUse hooks on the blocking iterator path?
 */
export function hooksBlocking(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.hooksRemoved) || boolish(t.async) || boolish(t.asyncHookMitigation)) {
    return false;
  }
  return boolish(t.postToolUseOrchestration) || boolish(t.hooksRestored) ||
    /PostToolUse orchestration|blocking iterator|hooks restored/i.test(extractText(t));
}

export function asyncHookBypasses(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.async) || boolish(t.asyncHookMitigation) || boolish(t.asyncTrue)) {
    return true;
  }
  return /async:true|async_hook_33956|async PostToolUse/i.test(extractText(t));
}

export function printSdkDelivers(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.printSdkOk) || boolish(t.printSdk)) return true;
  return /claude -p|sdk-cli|print\/SDK/i.test(extractText(t));
}

export function bothShellsHit(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.bashAndPowershell) || (Array.isArray(t.shells) && t.shells.length >= 2)) {
    return true;
  }
  return /Bash AND|native PowerShell|not Bash-specific/i.test(extractText(t));
}

export function receiptedSignal(text = "") {
  return /idle pigeonhole is receipted|pin idle receipted|completed shell tool_results stay receipted|tool_results stay receipted/i.test(
    String(text || "")
  );
}

export function lostSignal(text = "") {
  return /PostToolUse orchestration loses|loses the result after tool_dispatch_end|transcript ends at (assistant )?tool_use|no matching tool_result/i.test(
    String(text || "")
  );
}

export function filedSignal(text = "") {
  return /already filed|closes\/consumes the PostToolUse stream|completed tool_result is filed/i.test(
    String(text || "")
  );
}

export function dispatchOkNoPersistSignal(text = "") {
  return /dispatch-ok-no-persist|tool_dispatch_end outcome=ok|no matching tool_result persisted/i.test(
    String(text || "")
  );
}

export function postToolUseOrchestrationSignal(text = "") {
  return /posttooluse-orchestration|await tool\.call|async PostToolUse iteration|construct\/push tool_result/i.test(
    String(text || "")
  );
}

export function worktreeTransitionSignal(text = "") {
  return /worktree-transition|EnterWorktree|ExitWorktree|session start/i.test(
    String(text || "")
  );
}

export function printSdkOkSignal(text = "") {
  return /print-sdk-ok|cc_entrypoint=cli|claude -p: succeeds|print\/SDK path succeeds/i.test(
    String(text || "")
  );
}

export function asyncHookMitigationSignal(text = "") {
  return /async-hook-mitigation|async:true PostToolUse|async_hook_33956/i.test(
    String(text || "")
  );
}

export function bashAndPowershellSignal(text = "") {
  return /bash-and-powershell|not Bash-specific|native PowerShell|Bash AND/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    receipted: receiptedSignal(blob),
    lost: lostSignal(blob),
    filed: filedSignal(blob),
    dispatchOkNoPersist: dispatchOkNoPersistSignal(blob),
    postToolUseOrchestration: postToolUseOrchestrationSignal(blob),
    worktreeTransition: worktreeTransitionSignal(blob),
    printSdkOk: printSdkOkSignal(blob),
    asyncHookMitigation: asyncHookMitigationSignal(blob),
    bashAndPowershell: bashAndPowershellSignal(blob)
  };
}

export function letterWasLost(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.lost) || boolish(t.letterLost) || boolish(t.dispatchOkNoPersist)) {
    return true;
  }
  return lostSignal(extractText(t));
}

export function letterFiled(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.letterFiled) || (boolish(t.filed) && !boolish(t.lost))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const lostHit =
    boolish(t.lost) || (letterWasLost(t) && !boolish(t.filed) && !boolish(t.receipted));
  const filedClean = boolish(t.filed) || letterFiled(t);
  const receiptedHit = boolish(t.receipted) || (hits.receipted && !lostHit && !filedClean);
  return {
    lostHit,
    filedClean,
    receiptedHit,
    dispatchOkNoPersist: boolish(t.dispatchOkNoPersist) || hits.dispatchOkNoPersist,
    postToolUseOrchestration:
      boolish(t.postToolUseOrchestration) || hits.postToolUseOrchestration,
    worktreeTransition: boolish(t.worktreeTransition) || hits.worktreeTransition,
    printSdkOk: boolish(t.printSdkOk) || hits.printSdkOk,
    asyncHookMitigation: boolish(t.asyncHookMitigation) || hits.asyncHookMitigation,
    bashAndPowershell: boolish(t.bashAndPowershell) || hits.bashAndPowershell,
    letterFiled: letterFiled(t),
    letterLost: lostHit,
    letterReceipted: filedClean && !lostHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const lost = boolish(t.lost) || (print.lostHit && !boolish(t.filed) && !boolish(t.receipted));
  const filed = boolish(t.filed) || (print.filedClean && !boolish(t.lost));
  const receipted = boolish(t.receipted) || (print.receiptedHit && !lost && !filed);
  return {
    receipted,
    lost,
    filed,
    dispatchOkNoPersist: boolish(t.dispatchOkNoPersist) || print.dispatchOkNoPersist,
    postToolUseOrchestration:
      boolish(t.postToolUseOrchestration) || print.postToolUseOrchestration,
    worktreeTransition: boolish(t.worktreeTransition) || print.worktreeTransition,
    printSdkOk: boolish(t.printSdkOk) || print.printSdkOk,
    asyncHookMitigation: boolish(t.asyncHookMitigation) || print.asyncHookMitigation,
    bashAndPowershell: boolish(t.bashAndPowershell) || print.bashAndPowershell,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    versions: t.versions || MEASURED.versions,
    dispatch: t.dispatch || MEASURED.dispatch
  };
}

export function seedReceipted() {
  return {
    seed: "receipted",
    issue: 90049,
    receipted: true,
    lost: false,
    filed: false,
    outputText:
      "receipted; idle pigeonhole — completed shell tool_results stay receipted into the interactive transcript after worktree transitions"
  };
}

export function seedLost() {
  return {
    seed: "lost",
    issue: 90049,
    receipted: false,
    lost: true,
    filed: false,
    letterLost: true,
    dispatchOkNoPersist: true,
    postToolUseOrchestration: true,
    worktreeTransition: true,
    printSdkOk: true,
    asyncHookMitigation: true,
    bashAndPowershell: true,
    hasClearRepro: true,
    outputText:
      "lost; PostToolUse orchestration loses the result after tool_dispatch_end outcome=ok; transcript ends at tool_use; no matching tool_result",
    versions: MEASURED.versions,
    dispatch: MEASURED.dispatch
  };
}

export function seedFiled() {
  return {
    seed: "filed",
    issue: 90049,
    receipted: false,
    lost: false,
    filed: true,
    letterFiled: true,
    versions: MEASURED.versions
  };
}

export function seeds() {
  return {
    receipted: seedReceipted(),
    lost: seedLost(),
    filed: seedFiled(),
    "dispatch-ok-no-persist": {
      seed: "dispatch-ok-no-persist",
      issue: 90049,
      dispatchOkNoPersist: true
    },
    "posttooluse-orchestration": {
      seed: "posttooluse-orchestration",
      issue: 90049,
      postToolUseOrchestration: true
    },
    "worktree-transition": {
      seed: "worktree-transition",
      issue: 90049,
      worktreeTransition: true
    },
    "print-sdk-ok": { seed: "print-sdk-ok", issue: 90049, printSdkOk: true },
    "async-hook-mitigation": {
      seed: "async-hook-mitigation",
      issue: 90049,
      asyncHookMitigation: true
    },
    "bash-and-powershell": {
      seed: "bash-and-powershell",
      issue: 90049,
      bashAndPowershell: true
    },
    cousins: { seed: "cousins", issue: 90049, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 90049,
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
  "dispatch-ok-no-persist",
  "posttooluse-orchestration",
  "worktree-transition",
  "print-sdk-ok",
  "async-hook-mitigation",
  "bash-and-powershell",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "dispatch-ok-no-persist": (t, c) => boolish(t.dispatchOkNoPersist) || c.dispatchOkNoPersist,
  "posttooluse-orchestration": (t, c) =>
    boolish(t.postToolUseOrchestration) || c.postToolUseOrchestration,
  "worktree-transition": (t, c) => boolish(t.worktreeTransition) || c.worktreeTransition,
  "print-sdk-ok": (t, c) => boolish(t.printSdkOk) || c.printSdkOk,
  "async-hook-mitigation": (t, c) => boolish(t.asyncHookMitigation) || c.asyncHookMitigation,
  "bash-and-powershell": (t, c) => boolish(t.bashAndPowershell) || c.bashAndPowershell,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const tray = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      receipted: false,
      lost: true,
      filed: false,
      chips: ["cousins", "lost"],
      tray
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      receipted: false,
      lost: true,
      filed: false,
      chips: [seed, "lost"],
      tray
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, tray) &&
      seed !== "lost" &&
      seed !== "filed" &&
      seed !== "receipted"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        receipted: false,
        lost: true,
        filed: false,
        chips: [name, "lost"],
        tray
      };
    }
  }

  if (
    seed === "filed" ||
    (t.filed === true && t.lost !== true && seed !== "lost") ||
    (tray.filed && !tray.lost && seed !== "lost")
  ) {
    reasons.push(CHIP_REASONS.filed);
    return {
      verdict: "filed",
      reasons,
      receipted: false,
      lost: false,
      filed: true,
      chips: ["filed"],
      tray
    };
  }

  if (t.lost === true || seed === "lost" || (tray.lost && !tray.filed && !tray.receipted)) {
    reasons.push(CHIP_REASONS.lost);
    const chips = ["lost"];
    if (t.dispatchOkNoPersist === true || tray.dispatchOkNoPersist) {
      chips.push("dispatch-ok-no-persist");
    }
    if (t.postToolUseOrchestration === true || tray.postToolUseOrchestration) {
      chips.push("posttooluse-orchestration");
    }
    if (t.worktreeTransition === true || tray.worktreeTransition) {
      chips.push("worktree-transition");
    }
    if (t.printSdkOk === true || tray.printSdkOk) chips.push("print-sdk-ok");
    if (t.asyncHookMitigation === true || tray.asyncHookMitigation) {
      chips.push("async-hook-mitigation");
    }
    if (t.bashAndPowershell === true || tray.bashAndPowershell) {
      chips.push("bash-and-powershell");
    }
    if (t.hasClearRepro === true || tray.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "lost",
      reasons,
      receipted: false,
      lost: true,
      filed: false,
      chips: [...new Set(chips)],
      tray
    };
  }

  if (HOLD.has(seed) || seed === "receipted" || t.receipted === true || tray.receipted) {
    reasons.push(CHIP_REASONS.receipted);
    return {
      verdict: "receipted",
      reasons,
      receipted: true,
      lost: false,
      filed: false,
      chips: ["receipted"],
      tray
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`alarm ${seed}`);
    return {
      verdict: seed,
      reasons,
      receipted: false,
      lost: true,
      filed: false,
      chips: [seed],
      tray
    };
  }

  reasons.push(
    "empty probe; idle pigeonhole is receipted — HOLD: completed shell tool_results stay receipted into the interactive transcript after worktree transitions"
  );
  return {
    verdict: "receipted",
    reasons,
    receipted: true,
    lost: false,
    filed: false,
    chips: ["receipted"],
    tray
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedReceipted();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedReceipted();
  }
  return seedReceipted();
}

export async function main(argv = process.argv.slice(2)) {
  const { readFileSync } = await import("node:fs");
  const { stdin } = await import("node:process");
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stdin.on("error", reject);
    });
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "deadletter",
    issue: 90049,
    mark: "19:50 / hermes catalog #225 / #90049",
    alarm: ALARM.has(result.verdict),
    hold: HOLD.has(result.verdict),
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
