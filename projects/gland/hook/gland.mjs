/**
 * Gland — stuffing-box packing gland / shaft-seal bench.
 *
 * When CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 and a function-hooks
 * plugin registers any tool.call hook on Bash, a subagent spawned
 * with Agent(isolation: "worktree") has every Bash call refused,
 * including pwd and true. The isolation collar strips. Read/Edit
 * and MCP keep working. The hook can be a pure passthrough next(e).
 *
 * Encoded from anthropics/claude-code#92533 issue facts only.
 * Hypothesis (NON-BINDING): registering a Bash tool.call function
 * hook drops the worktree isolation context before the command
 * runs, so the cwd guard refuses rather than let Bash execute in
 * the parent session directory. Verify nothing in closed source;
 * encode issue facts only.
 * No network. No exploits. No live Claude.
 */

export const CHIPS = [
  "stripped",
  "packed",
  "context-lost",
  "parent-switched",
  "passthrough-ok",
  "cousins"
];

export const HOLD = new Set(["packed", "passthrough-ok"]);

export const ALARM = new Set([
  "stripped",
  "context-lost",
  "parent-switched",
  "cousins"
]);

export const IDLE_WORD = "stripped";
export const SEEDED_WORD = "packed";

export const MEASURED = {
  issue: 92533,
  title:
    "Any function-hook tool.call on Bash breaks Agent isolation: \"worktree\" — every Bash call refused with \"isolation context for this agent was lost\"",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:macos",
    "area:bash",
    "area:hooks",
    "area:agents"
  ],
  filed: "2026-09-06T18:56:14Z",
  updated: "2026-09-06T18:57:22Z",
  reporter: "navidemad",
  version: "2.1.263",
  platform: "macos",
  os: "macOS (Darwin 25.6.0), Apple Silicon",
  shell: "zsh 5.9 (Bash tool), fish as login shell",
  model: "Fable 5.1 (claude-fable-5-1); also default in claude -p",
  functionHooksEnv: "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1",
  isolation: "worktree",
  hookShape: "on(\"tool.call\", { tool: \"Bash\" }, async ($, e, next) => next(e))",
  refusedCommands: ["pwd", "true"],
  retriesObserved: 6,
  telemetry: ["tengu_agent_worktree_cwd_escape_blocked", "context_lost"],
  readEditMcpStillWork: true,
  error:
    "The working-directory isolation context for this agent was lost, so this command would run in the parent session's directory instead of this agent's worktree (...). Refusing to run it.",
  expected:
    "A passthrough function hook on Bash should not change where the command runs; the subagent's worktree cwd override should survive the hook chain (next(e)), and pwd should print <repo>/.claude/worktrees/agent-xxx.",
  bisection: [
    {
      config: "Project plugin with Bash hooks active",
      result: "refused"
    },
    {
      config: "Same, CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=0",
      result: "OK"
    },
    {
      config: "Fresh repo + plugin with only a session.start hook",
      result: "OK, prints the worktree path"
    },
    {
      config: "Fresh repo + plugin with only a Bash tool.call passthrough",
      result: "refused"
    }
  ],
  parentSideEffect:
    "If the blocked subagent calls EnterWorktree(path: <its worktree>) to recover, the parent session gets switched into that worktree (parent git commands then refused outside that directory until ExitWorktree).",
  workaround:
    "Create worktrees by hand (git worktree add … origin/main) and spawn agents without isolation, prefixing each command with cd <worktree> &&.",
  regression: "Unknown",
  lastWorkingVersion: "Unknown"
};

export const COUSINS = [
  {
    id: 92112,
    state: "open",
    note: "Cite-only cousin (Holdfast). Mid-session --worktree cwd guard permanently blocks Bash while MCP retains filesystem access. Different mechanism; different surface. Primary stays #92533."
  },
  {
    id: 89102,
    state: "open",
    note: "Cite-only. EnterWorktree while subagents run flips a session-wide isolation latch; even pwd refused for agents in their own worktrees. Primary stays #92533."
  },
  {
    id: 91932,
    state: "open",
    note: "Cite-only. After EnterWorktree, the Bash cwd pin does not follow. Primary stays #92533."
  },
  {
    id: 86340,
    state: "open",
    note: "Cite-only. Parser abort blocks Bash under worktree isolation (too complex). Primary stays #92533."
  },
  {
    id: 84704,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  },
  {
    id: 87953,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  },
  {
    id: 88950,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  },
  {
    id: 90432,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  },
  {
    id: 87643,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  },
  {
    id: 87959,
    state: "cite-only",
    note: "Cite-only isolation/worktree neighbourhood. Not primary."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "holdfast",
    issue: 92112,
    note: "Holdfast/#92112: mid-session --worktree cwd guard permanently blocks Bash while MCP retains filesystem access. Different mechanism; different surface. Cousin only."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: cold parent voids child-completion queue. Different paradigm."
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification written into history but no assistant turn. Different paradigm."
  },
  {
    slug: "pintle",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "wicket",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "fairlead",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "deadeye",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "frizzen",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "tappet",
    note: "Prior isolation/hook paradigm. Different defect."
  },
  {
    slug: "pinfold",
    note: "Prior isolation/hook paradigm. Different defect."
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

export function lostError(text = "") {
  return /isolation context for this agent was lost|tengu_agent_worktree_cwd_escape_blocked|context_lost|Refusing to run it/i.test(
    String(text || "")
  );
}

export function worktreePwd(text = "") {
  return /\.claude\/worktrees\/agent-/i.test(String(text || ""));
}

export function isBashToolCallHook(hook) {
  if (!hook || typeof hook !== "object") return false;
  const event = String(hook.event || hook.on || hook.kind || "");
  const tool = String(hook.tool || hook.matcher || "");
  return /tool\.call/i.test(event) && /^bash$/i.test(tool);
}

export function isSessionStartHook(hook) {
  if (!hook || typeof hook !== "object") return false;
  const event = String(hook.event || hook.on || hook.kind || "");
  return /session\.start/i.test(event);
}

export function parseHooks(probe = {}) {
  if (Array.isArray(probe.hooks)) return probe.hooks;
  if (Array.isArray(probe.plugin?.hooks)) return probe.plugin.hooks;
  return [];
}

export function parseBashCalls(probe = {}) {
  if (Array.isArray(probe.bashCalls)) return probe.bashCalls;
  if (Array.isArray(probe.calls)) return probe.calls;
  return [];
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hooks = parseHooks(t);
  const bashCalls = parseBashCalls(t);
  const blob = extractText(t);
  const bashToolCallHook =
    hooks.some(isBashToolCallHook) ||
    boolish(t.bashToolCallHook) ||
    /tool\.call.*Bash|Bash.*tool\.call|on\("tool\.call",\s*\{\s*tool:\s*"Bash"/i.test(blob);
  const sessionStartHook = hooks.some(isSessionStartHook) || boolish(t.sessionStartHook);
  const sessionStartOnly =
    boolish(t.sessionStartOnly) ||
    (sessionStartHook && !bashToolCallHook && (hooks.length === 0 || hooks.every((h) => isSessionStartHook(h) || !isBashToolCallHook(h))));
  const functionHooksOn =
    t.functionHooks === true ||
    t.functionHooks === "1" ||
    /CLAUDE_CODE_ENABLE_FUNCTION_HOOKS\s*=\s*1/.test(blob);
  const functionHooksOff =
    t.functionHooks === false ||
    t.functionHooks === "0" ||
    /CLAUDE_CODE_ENABLE_FUNCTION_HOOKS\s*=\s*0/.test(blob);
  const isolationWorktree =
    t.isolation === "worktree" ||
    /isolation:\s*"worktree"|Agent\(isolation:\s*"worktree"\)/i.test(blob);
  const refused =
    bashCalls.some((c) => boolish(c.refused) || lostError(asText(c))) ||
    boolish(t.refused) ||
    lostError(blob);
  const pwdPrintsWorktree =
    bashCalls.some((c) => worktreePwd(asText(c.output || c.result || c))) ||
    boolish(t.pwdPrintsWorktree) ||
    worktreePwd(blob);
  const parentSwitched =
    boolish(t.parentSwitched) ||
    /parent session gets switched|parent-switched|EnterWorktree\(path:\s*<its worktree>\)/i.test(blob);
  const readEditMcpOk = t.readEditMcpOk !== false;
  const retries = Number(t.retriesObserved ?? t.retries ?? 0) || 0;
  return {
    bashToolCallHook,
    sessionStartHook,
    sessionStartOnly,
    functionHooksOn,
    functionHooksOff,
    isolationWorktree,
    refused,
    pwdPrintsWorktree,
    parentSwitched,
    readEditMcpOk,
    retries,
    hookCount: hooks.length,
    bashCallCount: bashCalls.length
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const stripped =
    boolish(t.stripped) ||
    (print.refused && print.bashToolCallHook && !boolish(t.packed));
  const packed =
    boolish(t.packed) ||
    (print.pwdPrintsWorktree && !print.refused && !boolish(t.stripped));
  const contextLost =
    boolish(t.contextLost) ||
    print.refused;
  const parentSwitched = boolish(t.parentSwitched) || print.parentSwitched;
  const passthroughOk =
    boolish(t.passthroughOk) ||
    boolish(t.sessionStartOk) ||
    print.sessionStartOnly ||
    (print.functionHooksOff && print.pwdPrintsWorktree && !print.refused);
  return {
    stripped,
    packed,
    contextLost,
    parentSwitched,
    passthroughOk,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    fingerprint: print,
    version: t.version || MEASURED.version,
    platform: t.platform || MEASURED.platform,
    isolation: t.isolation || MEASURED.isolation
  };
}

export function seedStripped() {
  return {
    seed: "stripped",
    issue: 92533,
    stripped: true,
    packed: false,
    contextLost: true,
    bashToolCallHook: true,
    functionHooks: true,
    isolation: "worktree",
    platform: "macos",
    version: MEASURED.version
  };
}

export function seedPacked() {
  return {
    seed: "packed",
    issue: 92533,
    stripped: false,
    packed: true,
    contextLost: false,
    pwdPrintsWorktree: true,
    isolation: "worktree",
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
  const gland = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92112 Holdfast mid-session --worktree cwd guard blocks Bash while MCP retains filesystem access; #89102 EnterWorktree flips a session-wide isolation latch; #91932 Bash cwd pin does not follow after EnterWorktree; #86340 parser abort blocks Bash under worktree isolation; also #84704 #87953 #88950 #90432 #87643 #87959. Not Oubliette/#92095. Not Larum/#92563. Primary stays #92533"
    );
    return {
      verdict: "cousins",
      reasons,
      stripped: true,
      packed: false,
      chips: ["cousins", "stripped"],
      gland
    };
  }

  if (seed === "parent-switched" || t.parentSwitched === true) {
    reasons.push(
      "if the blocked subagent calls EnterWorktree(path: <its worktree>) to recover, the parent session gets switched into that worktree — parent git commands are then refused outside that directory until ExitWorktree"
    );
    return {
      verdict: "parent-switched",
      reasons,
      stripped: true,
      packed: false,
      chips: ["parent-switched", "stripped"],
      gland
    };
  }

  if (seed === "context-lost" || (t.contextLost === true && seed !== "stripped" && seed !== "packed")) {
    reasons.push(
      "The working-directory isolation context for this agent was lost, so this command would run in the parent session's directory instead of this agent's worktree. Refusing to run it. Retry never helps (6 retries observed). Telemetry: tengu_agent_worktree_cwd_escape_blocked / context_lost"
    );
    return {
      verdict: "context-lost",
      reasons,
      stripped: true,
      packed: false,
      chips: ["context-lost", "stripped"],
      gland
    };
  }

  if (
    seed === "passthrough-ok" ||
    seed === "session-start-ok" ||
    t.passthroughOk === true ||
    t.sessionStartOk === true
  ) {
    reasons.push(
      "passthrough-ok / session-start-ok — function hooks env off, or a fresh repo plugin with only a session.start hook: pwd prints the worktree path. Isolation collar stays seated. Hold path"
    );
    return {
      verdict: "passthrough-ok",
      reasons,
      stripped: false,
      packed: true,
      chips: ["passthrough-ok", "packed"],
      gland
    };
  }

  if (
    seed === "packed" ||
    (t.packed === true && t.stripped !== true && seed !== "stripped") ||
    (gland.packed && !gland.stripped && seed !== "stripped" && seed !== "context-lost")
  ) {
    reasons.push(
      "gland already packed — isolation survives the hook chain; pwd prints the worktree path. Seeded word is packed"
    );
    return {
      verdict: "packed",
      reasons,
      stripped: false,
      packed: true,
      chips: t.passthroughOk === true || seed === "passthrough-ok"
        ? ["packed", "passthrough-ok"]
        : ["packed"],
      gland
    };
  }

  if (
    t.stripped === true ||
    seed === "stripped" ||
    (gland.stripped && !gland.packed)
  ) {
    reasons.push(
      "A packing gland should keep the worktree isolation collar seated through a Bash tool.call passthrough. The mere registration of any function-hook on Bash strips the packing — every pwd and true is refused with context_lost. Read/Edit and MCP keep working. Retry never helps"
    );
    const chips = ["stripped"];
    if (t.contextLost === true || gland.contextLost) chips.push("context-lost");
    if (t.parentSwitched === true || gland.parentSwitched) chips.push("parent-switched");
    return {
      verdict: "stripped",
      reasons,
      stripped: true,
      packed: false,
      chips: [...new Set(chips)],
      gland
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, stripped: false, packed: true, chips: [seed], gland };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      stripped: true,
      packed: false,
      chips: [seed],
      gland
    };
  }

  reasons.push(
    "empty probe; idle packing gland is stripped — any Bash tool.call function-hook registration loses the worktree isolation context, so every pwd is refused"
  );
  return {
    verdict: "stripped",
    reasons,
    stripped: true,
    packed: false,
    chips: ["stripped"],
    gland
  };
}
