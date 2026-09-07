/**
 * Quietus — registrar's quietus / death-knell ledger bench.
 *
 * A quietus that should ring SubagentStop when a background subagent is
 * killed via TaskStop or /exit → "Exit and stop tasks", pairing every
 * SubagentStart. Instead the kill path clears the agent from
 * background_tasks and never rings SubagentStop (no debug-file line
 * either). Normal completion still fires SubagentStop with
 * last_assistant_message.
 *
 * Encoded from anthropics/claude-code#92716 issue facts only.
 * Hypothesis (NON-BINDING): kill paths remove the agent from the task
 * registry without invoking the SubagentStop hook dispatcher that
 * normal completion uses. Verify against issue text only; do not
 * claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * No instructions to bypass hooks/sandbox. Educational diagnostic
 * scorer only.
 */

export const VERDICTS = [
  "unrung",
  "quieted",
  "start-without-stop",
  "taskstop-silent",
  "exit-stop-silent",
  "control-completion-tolls",
  "debug-file-missing",
  "registry-cleared",
  "pairing-drift",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["quieted"]);

export const ALARM = new Set([
  "unrung",
  "start-without-stop",
  "taskstop-silent",
  "exit-stop-silent",
  "control-completion-tolls",
  "debug-file-missing",
  "registry-cleared",
  "pairing-drift",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "unrung";
export const SEEDED_WORD = "quieted";

export const MEASURED = {
  issue: 92716,
  title:
    "SubagentStop does not fire when a background subagent is killed via TaskStop or by \"Exit and stop tasks\"",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:hooks", "area:agents"],
  filed: "2026-09-07T18:55:26Z",
  updated: "2026-09-07T18:56:30Z",
  reporter: "pszypowicz",
  comments: 0,
  os: "macOS 26.6",
  platform: "macos",
  terminalInteractive: "tmux",
  terminalHeadless: "zsh",
  surface: "Claude Code SubagentStop hook on TaskStop / Exit-and-stop kill",
  claudeCodeLive: "2.1.261",
  model: "Haiku 4.5",
  modelId: "claude-haiku-4-5-20251001",
  parentAndSubagentSameModel: true,
  reproducedHeadless: true,
  reproducedInteractive: true,
  taskstopAgentId: "a7e17cab67db81d3b",
  controlAgentId: "a407d56a2f914aea2",
  exitStopAgentId: "aeb8c19d42bf9982c",
  agentType: "general-purpose",
  taskstopSubagentStop: false,
  exitStopSubagentStop: false,
  controlSubagentStop: true,
  controlLastAssistantMessage: "done",
  debugFileHasKillSubagentStop: false,
  registryClearedAfterTaskStop: true,
  backgroundTasksAfterTaskStop: [],
  pairingDrifts: true,
  backgroundTasksNotSubstitute: true,
  expected:
    "Every SubagentStart is followed by exactly one SubagentStop, regardless of how the subagent ends. A kill through TaskStop or session exit should fire the hook, with last_assistant_message empty if there is none.",
  actual:
    "TaskStop and Exit-and-stop clear the agent from the task registry and never fire SubagentStop; --debug-file has no SubagentStop line for the killed agent; normal completion still fires SubagentStop with last_assistant_message",
  impact:
    "hooks pairing SubagentStart/SubagentStop drift after every kill; background_tasks on Stop is not a substitute for the per-agent stop event"
};

export const HOOK_LOG = [
  {
    t: "+0",
    ev: "SubagentStart",
    agent_id: "a7e17cab67db81d3b",
    agent_type: "general-purpose",
    path: "taskstop",
    note: "TaskStop path starts"
  },
  {
    t: "+18",
    ev: "Stop",
    agent_id: null,
    bg: [],
    path: "taskstop",
    note: "main turn after TaskStop, agent already gone"
  },
  {
    t: "+21",
    ev: "Stop",
    agent_id: null,
    bg: [],
    path: "taskstop",
    note: "woken turn after the was-stopped notification; no SubagentStop"
  },
  {
    t: "+147",
    ev: "SubagentStart",
    agent_id: "a407d56a2f914aea2",
    agent_type: "general-purpose",
    path: "control",
    note: "control completion starts"
  },
  {
    t: "+148",
    ev: "Stop",
    agent_id: null,
    bg: [{ id: "a407d56a2f914aea2", type: "subagent", status: "running" }],
    path: "control",
    note: "control still listed while running"
  },
  {
    t: "+240",
    ev: "SubagentStop",
    agent_id: "a407d56a2f914aea2",
    agent_type: "general-purpose",
    last: "done",
    path: "control",
    note: "control: normal completion fires the hook"
  },
  {
    t: "+243",
    ev: "Stop",
    agent_id: null,
    bg: [],
    path: "control",
    note: "control registry empty after the toll"
  },
  {
    t: "+267",
    ev: "SubagentStart",
    agent_id: "aeb8c19d42bf9982c",
    agent_type: "general-purpose",
    path: "exit-stop",
    note: "Exit-and-stop path starts"
  },
  {
    t: "+268",
    ev: "Stop",
    agent_id: null,
    bg: [{ id: "aeb8c19d42bf9982c", type: "subagent", status: "running" }],
    path: "exit-stop",
    note: "/exit → Exit and stop tasks; session ends; no SubagentStop"
  }
];

export const KILL_PATHS = [
  {
    id: "taskstop",
    role: "TaskStop kill",
    hail: "SubagentStart a7e17cab67db81d3b · next Stop bg:[] · no SubagentStop",
    rings: false
  },
  {
    id: "exit-stop",
    role: "/exit → Exit and stop tasks",
    hail: "SubagentStart aeb8c19d42bf9982c · session ends · no SubagentStop",
    rings: false
  },
  {
    id: "control",
    role: "normal background completion",
    hail: "SubagentStop a407d56a2f914aea2 last:done — control still tolls",
    rings: true
  }
];

export const COUSINS = [
  {
    id: 78463,
    state: "open",
    note: "Cite-only cousin. Missing SubagentStop when subagents die during an API-error burst. Same class, burst trigger — not the deterministic TaskStop / Exit-and-stop kill. Primary stays #92716."
  },
  {
    id: 44971,
    state: "closed",
    note: "Cite-only cousin. Closed completed. Same class for team agents shut down via the shutdown protocol. Different surface (team shutdown, not TaskStop / Exit-and-stop). Primary stays #92716."
  },
  {
    id: 82249,
    state: "open",
    note: "Cite-only cousin. DIFFERENT: on 2.1.261 SubagentStop DOES fire for normal background completion, as the control run in #92716 shows. Not the kill-path miss. Primary stays #92716."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "cribble",
    issue: 92684,
    note: "Cribble/#92684: mid-path denyWrite porous sieve. Different defect."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675: plugin-native PreToolUse interactive slip. Different defect."
  },
  {
    slug: "gangway",
    issue: 92662,
    note: "Gangway/#92662: Chrome never-redial. Different defect."
  },
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624: named-spawn foreign session id. Different defect."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: cold-parent child-completion void. Different defect."
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: background-task notification never starts a turn. Different defect."
  },
  { slug: "deadman", issue: 92593, note: "Deadman/#92593: timeout leftover. Different paradigm." },
  { slug: "watchdog", note: "Watchdog: prior catalog paradigm. Different defect." },
  { slug: "knell", note: "Knell: prior catalog paradigm. Different defect." },
  { slug: "tocsin", note: "Tocsin: prior catalog paradigm. Different defect." },
  { slug: "aphonia", note: "Aphonia: prior catalog paradigm. Different defect." }
];

const CHIP_REASONS = {
  unrung:
    "ALARM: quietus unrung; TaskStop and Exit-and-stop clear the registry and never ring SubagentStop. Score unrung or admit quieted",
  quieted:
    "quietus already quieted — every kill path rings SubagentStop, pairing every SubagentStart. Seeded word is quieted",
  "start-without-stop":
    "start-without-stop — SubagentStart a7e17cab67db81d3b and aeb8c19d42bf9982c never receive a matching SubagentStop. Pairing should be 1:1",
  "taskstop-silent":
    "taskstop-silent — after TaskStop, next Stop shows bg:[]; agent a7e17cab67db81d3b is gone; no SubagentStop (checked again 75 s later). Two headless claude -p runs matched",
  "exit-stop-silent":
    "exit-stop-silent — /exit → Exit and stop tasks ends the session with no SubagentStop for aeb8c19d42bf9982c",
  "control-completion-tolls":
    "control-completion-tolls — normal background completion still fires SubagentStop for a407d56a2f914aea2 with last_assistant_message done. The hook is registered and working",
  "debug-file-missing":
    "debug-file-missing — --debug-file has no SubagentStop line for the killed agent. Nothing about the missing hook appears in the debug log",
  "registry-cleared":
    "registry-cleared — the killed agent is removed from the task registry; next main-thread Stop payload lists background_tasks as []. Only the hook is missing",
  "pairing-drift":
    "pairing-drift — hooks pairing SubagentStart with SubagentStop drift after every kill. background_tasks on Stop is a parent-session workaround, not a per-agent stop event",
  cousins:
    "cite-only #78463 (API-error burst missing SubagentStop); #44971 (team-agent shutdown protocol); #82249 (DIFFERENT: on 2.1.261 control completion still tolls). Do not auto-pick as thesis. Not Cribble/#92684. Not Springe/#92675. Not Gangway/#92662. Not Waybill/#92624. Not Oubliette/#92095. Not Larum/#92563. Not Deadman / Watchdog / Knell / Tocsin / Aphonia. Primary stays #92716",
  "has-clear-repro":
    "has-clear-repro — #92716 is labeled has repro: Claude Code 2.1.261; macOS 26.6; Haiku 4.5 parent and subagent; reproduced in claude -p headless and interactive REPL; published hook log + overlay settings"
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

export function unrungSignal(text = "") {
  return /unrung|never rings|hook silent|no SubagentStop|stays unrung/i.test(String(text || ""));
}

export function quietedSignal(text = "") {
  return /quieted|every kill path rings|quietus already quieted|knell settled/i.test(
    String(text || "")
  );
}

export function startWithoutStopSignal(text = "") {
  return /start-without-stop|SubagentStart without|pairing should be 1:1|without a matching SubagentStop/i.test(
    String(text || "")
  );
}

export function taskstopSilentSignal(text = "") {
  return /taskstop-silent|TaskStop|a7e17cab67db81d3b/i.test(String(text || ""));
}

export function exitStopSilentSignal(text = "") {
  return /exit-stop-silent|Exit and stop tasks|aeb8c19d42bf9982c/i.test(String(text || ""));
}

export function controlTollsSignal(text = "") {
  return /control-completion-tolls|last_assistant_message|a407d56a2f914aea2|last:"done"|last:done/i.test(
    String(text || "")
  );
}

export function debugFileMissingSignal(text = "") {
  return /debug-file-missing|--debug-file|no SubagentStop line/i.test(String(text || ""));
}

export function registryClearedSignal(text = "") {
  return /registry-cleared|bg:\[\]|background_tasks as \[\]|agent gone from registry/i.test(
    String(text || "")
  );
}

export function pairingDriftSignal(text = "") {
  return /pairing-drift|pairing SubagentStart|drifts after every kill/i.test(String(text || ""));
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    unrung: unrungSignal(blob),
    quieted: quietedSignal(blob),
    startWithoutStop: startWithoutStopSignal(blob),
    taskstopSilent: taskstopSilentSignal(blob),
    exitStopSilent: exitStopSilentSignal(blob),
    controlTolls: controlTollsSignal(blob),
    debugFileMissing: debugFileMissingSignal(blob),
    registryCleared: registryClearedSignal(blob),
    pairingDrift: pairingDriftSignal(blob)
  };
}

export function quietusQuieted(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.quietusQuieted) || (boolish(t.quieted) && !boolish(t.unrung))) {
    return boolish(t.quietusQuieted) || (boolish(t.quieted) && !boolish(t.unrung));
  }
  return false;
}

export function pathRings(pathId) {
  const row = KILL_PATHS.find((cell) => cell.id === pathId);
  if (!row) return null;
  return row.rings;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const startWithoutStop =
    boolish(t.startWithoutStop) || t.taskstopSubagentStop === false || hits.startWithoutStop;
  const taskstopSilent =
    boolish(t.taskstopSilent) || t.taskstopSubagentStop === false || hits.taskstopSilent;
  const exitStopSilent =
    boolish(t.exitStopSilent) || t.exitStopSubagentStop === false || hits.exitStopSilent;
  const controlTolls =
    boolish(t.controlTolls) || t.controlSubagentStop === true || hits.controlTolls;
  const debugFileMissing =
    boolish(t.debugFileMissing) || t.debugFileHasKillSubagentStop === false || hits.debugFileMissing;
  const registryCleared =
    boolish(t.registryCleared) || t.registryClearedAfterTaskStop === true || hits.registryCleared;
  const pairingDrift = boolish(t.pairingDrift) || t.pairingDrifts === true || hits.pairingDrift;
  const quietedClean = boolish(t.quieted) || quietusQuieted(t);
  const unrungHit = boolish(t.unrung) || (taskstopSilent && !boolish(t.quieted));
  return {
    startWithoutStop,
    taskstopSilent,
    exitStopSilent,
    controlTolls,
    debugFileMissing,
    registryCleared,
    pairingDrift,
    quietedClean,
    unrungHit,
    knellSettled: quietusQuieted(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const unrung = boolish(t.unrung) || (print.unrungHit && !boolish(t.quieted));
  const quieted = boolish(t.quieted) || (print.quietedClean && !boolish(t.unrung));
  return {
    unrung,
    quieted,
    startWithoutStop: boolish(t.startWithoutStop) || print.startWithoutStop,
    taskstopSilent: boolish(t.taskstopSilent) || print.taskstopSilent,
    exitStopSilent: boolish(t.exitStopSilent) || print.exitStopSilent,
    controlTolls: boolish(t.controlTolls) || print.controlTolls,
    debugFileMissing: boolish(t.debugFileMissing) || print.debugFileMissing,
    registryCleared: boolish(t.registryCleared) || print.registryCleared,
    pairingDrift: boolish(t.pairingDrift) || print.pairingDrift,
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

export function seedUnrung() {
  return {
    seed: "unrung",
    issue: 92716,
    unrung: true,
    quieted: false,
    startWithoutStop: true,
    taskstopSilent: true,
    exitStopSilent: true,
    controlTolls: true,
    debugFileMissing: true,
    registryCleared: true,
    pairingDrift: true,
    taskstopSubagentStop: false,
    exitStopSubagentStop: false,
    controlSubagentStop: true,
    controlLastAssistantMessage: "done",
    debugFileHasKillSubagentStop: false,
    registryClearedAfterTaskStop: true,
    pairingDrifts: true,
    outputText:
      "unrung; TaskStop and Exit-and-stop clear the registry and never ring SubagentStop while normal completion still tolls",
    reporter: MEASURED.reporter
  };
}

export function seedQuieted() {
  return {
    seed: "quieted",
    issue: 92716,
    unrung: false,
    quieted: true,
    quietusQuieted: true,
    taskstopSubagentStop: true,
    exitStopSubagentStop: true,
    controlSubagentStop: true,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    unrung: seedUnrung(),
    quieted: seedQuieted(),
    "start-without-stop": {
      seed: "start-without-stop",
      issue: 92716,
      startWithoutStop: true,
      taskstopSubagentStop: false
    },
    "taskstop-silent": {
      seed: "taskstop-silent",
      issue: 92716,
      taskstopSilent: true,
      taskstopSubagentStop: false
    },
    "exit-stop-silent": {
      seed: "exit-stop-silent",
      issue: 92716,
      exitStopSilent: true,
      exitStopSubagentStop: false
    },
    "control-completion-tolls": {
      seed: "control-completion-tolls",
      issue: 92716,
      controlTolls: true,
      controlSubagentStop: true,
      controlLastAssistantMessage: "done"
    },
    "debug-file-missing": {
      seed: "debug-file-missing",
      issue: 92716,
      debugFileMissing: true,
      debugFileHasKillSubagentStop: false
    },
    "registry-cleared": {
      seed: "registry-cleared",
      issue: 92716,
      registryCleared: true,
      registryClearedAfterTaskStop: true
    },
    "pairing-drift": {
      seed: "pairing-drift",
      issue: 92716,
      pairingDrift: true,
      pairingDrifts: true
    },
    cousins: {
      seed: "cousins",
      issue: 92716,
      cousins: true,
      cousinsCiteOnly: [78463, 44971, 82249]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92716,
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
  "start-without-stop",
  "taskstop-silent",
  "exit-stop-silent",
  "control-completion-tolls",
  "debug-file-missing",
  "registry-cleared",
  "pairing-drift",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "start-without-stop": (t, c) => boolish(t.startWithoutStop) || c.startWithoutStop,
  "taskstop-silent": (t, c) => boolish(t.taskstopSilent) || c.taskstopSilent,
  "exit-stop-silent": (t, c) => boolish(t.exitStopSilent) || c.exitStopSilent,
  "control-completion-tolls": (t, c) => boolish(t.controlTolls) || c.controlTolls,
  "debug-file-missing": (t, c) => boolish(t.debugFileMissing) || c.debugFileMissing,
  "registry-cleared": (t, c) => boolish(t.registryCleared) || c.registryCleared,
  "pairing-drift": (t, c) => boolish(t.pairingDrift) || c.pairingDrift,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const quietus = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      unrung: true,
      quieted: false,
      chips: ["cousins", "unrung"],
      quietus
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      unrung: true,
      quieted: false,
      chips: [seed, "unrung"],
      quietus
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, quietus) && seed !== "unrung" && seed !== "quieted") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        unrung: true,
        quieted: false,
        chips: [name, "unrung"],
        quietus
      };
    }
  }

  if (
    seed === "quieted" ||
    (t.quieted === true && t.unrung !== true && seed !== "unrung") ||
    (quietus.quieted && !quietus.unrung && seed !== "unrung")
  ) {
    reasons.push(CHIP_REASONS.quieted);
    return {
      verdict: "quieted",
      reasons,
      unrung: false,
      quieted: true,
      chips: ["quieted"],
      quietus
    };
  }

  if (t.unrung === true || seed === "unrung" || (quietus.unrung && !quietus.quieted)) {
    reasons.push(CHIP_REASONS.unrung);
    const chips = ["unrung"];
    if (t.startWithoutStop === true || quietus.startWithoutStop) chips.push("start-without-stop");
    if (t.taskstopSilent === true || quietus.taskstopSilent) chips.push("taskstop-silent");
    if (t.exitStopSilent === true || quietus.exitStopSilent) chips.push("exit-stop-silent");
    if (t.controlTolls === true || quietus.controlTolls) chips.push("control-completion-tolls");
    if (t.debugFileMissing === true || quietus.debugFileMissing) chips.push("debug-file-missing");
    if (t.registryCleared === true || quietus.registryCleared) chips.push("registry-cleared");
    if (t.pairingDrift === true || quietus.pairingDrift) chips.push("pairing-drift");
    return {
      verdict: "unrung",
      reasons,
      unrung: true,
      quieted: false,
      chips: [...new Set(chips)],
      quietus
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, unrung: false, quieted: true, chips: [seed], quietus };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      unrung: true,
      quieted: false,
      chips: [seed],
      quietus
    };
  }

  reasons.push(
    "empty probe; idle quietus is unrung — ALARM: TaskStop and Exit-and-stop never ring SubagentStop"
  );
  return {
    verdict: "unrung",
    reasons,
    unrung: true,
    quieted: false,
    chips: ["unrung"],
    quietus
  };
}
