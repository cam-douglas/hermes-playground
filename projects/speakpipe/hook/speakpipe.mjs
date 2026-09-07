/**
 * Speakpipe — brass speaking-tube / shipboard voicepipe bench.
 *
 * A pipe that should carry a continuation hail to a below-decks
 * crew (subagent) without going on deck to another ship
 * (cross-session). Desktop corks the whole pipe because
 * deck-to-ship hails are banned, so below-decks continuation
 * is corked too.
 *
 * Encoded from anthropics/claude-code#92646 issue facts only.
 * Hypothesis (NON-BINDING): Desktop may be banning the entire
 * SendMessage tool for cross-session reasons while Agent /
 * ListAgents still teach continuation via that same tool; a
 * narrower deny or surface-aware copy would uncork the
 * speakpipe. Verify against issue text only; do not claim
 * unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "corked",
  "relayed",
  "dual-purpose-tool",
  "overbroad-disallow",
  "pretooluse-auto-deny",
  "mcp-replacement-gap",
  "footer-still-advertises",
  "toolsearch-empty",
  "listagents-dead-instruction",
  "cli-flag-honoured",
  "desktop-app-ban",
  "timeline-zero-after-1.46388.4",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["relayed"]);

export const ALARM = new Set([
  "corked",
  "dual-purpose-tool",
  "overbroad-disallow",
  "pretooluse-auto-deny",
  "mcp-replacement-gap",
  "footer-still-advertises",
  "toolsearch-empty",
  "listagents-dead-instruction",
  "cli-flag-honoured",
  "desktop-app-ban",
  "timeline-zero-after-1.46388.4",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "corked";
export const SEEDED_WORD = "relayed";

export const MEASURED = {
  issue: 92646,
  title: "Claude Desktop blocks SendMessage entirely, which also removes subagent continuation",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:agents", "area:desktop"],
  filed: "2026-09-07T11:03:56Z",
  updated: "2026-09-07T11:05:00Z",
  reporter: "Had01",
  comments: 0,
  os: "Windows 11 Pro 26200",
  desktop: "1.46388.4",
  desktopInstall: "2026-09-05 20:11",
  desktopPackage: "Claude_1.46388.4.0_x64__pzs8sxrjxfjjc",
  bundledCli: "2.1.260",
  pathCli: "2.1.263",
  lastWorkingCli: "2.1.258",
  lastRealSendMessage: "2026-09-03",
  zeroFrom: "2026-09-06",
  disallowedTools: "SendMessage",
  preToolUseHook: "desktop_ccd_permission_auto_denied",
  preToolUseReason: "cli_native_send_message",
  mcpReplacement: "mcp__ccd_session_mgmt__send_message",
  toolSearchSelect: "SendMessage",
  toolSearchResult: "No matching deferred tools found",
  listAgentsPeerCount: 29,
  sendMessageCallsByVersion: {
    "2.1.246": { sessions: 9, calls: 7 },
    "2.1.247": { sessions: 3, calls: 9 },
    "2.1.255": { sessions: 1, calls: 7 },
    "2.1.258": { sessions: 4, calls: 84 },
    "2.1.260": { sessions: 7, calls: 0 },
    "2.1.263": { sessions: 2, calls: 0 }
  },
  cliHonoursFlag: true,
  sendMessagePresentWithoutFlag: true,
  sendMessageAbsentWithFlag: true,
  agentAdvertisesContinuation: true,
  listAgentsAdvertisesSendMessage: true,
  footerAdvertisesContinuation: true,
  mcpDoesNotCoverContinuation: true,
  dualPurpose: true,
  expected:
    "either SendMessage is available for subagent continuation, or the surface stops advertising it",
  actual:
    "Desktop launches CLI with --disallowedTools SendMessage and auto-denies via PreToolUse; ToolSearch is empty; Agent/ListAgents/footers still advertise continuation",
  impact:
    "Follow-up to a spawned subagent is gone; incomplete agents must be killed and respawned, paying their whole context again"
};

export const COUSINS = [
  {
    id: 89543,
    state: "open",
    note: "Cite-only cousin. SendMessage to a running background subagent never delivers — the tool exists and reports queued, but the hail never arrives. Different surface (delivery vs Desktop overbroad ban). Primary stays #92646. Do not auto-pick as primary."
  },
  {
    id: 92583,
    state: "open",
    note: "Cite-only cousin / backup. Timeout-backgrounded Bash orphans leak OS handles after session end. Different surface (timeout orphans vs SendMessage cork). Primary stays #92646."
  },
  {
    id: 92624,
    state: "open",
    note: "Cite-only cousin / backup. Named agent spawn resolves the team file under a foreign session id (0/21 match). Different surface (foreign session team file vs Desktop SendMessage ban). Primary stays #92646."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "afterimage",
    issue: 92596,
    note: "Afterimage/#92596: Windows text paint deferred until message_stop. Different defect."
  },
  {
    slug: "limber",
    issue: 92590,
    note: "Limber/#92590: unexpanded $TMPDIR write-allowlist token. Different defect."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories. Different defect."
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
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: Cowork Dispatch child-completion void against cold parent. Different defect."
  },
  {
    slug: "sounder",
    note: "Sounder: prior catalog paradigm. Different defect."
  },
  {
    slug: "callboard",
    note: "Callboard: prior catalog paradigm. Different defect."
  },
  {
    slug: "knock",
    note: "Knock: prior catalog paradigm. Different defect."
  },
  {
    slug: "annunciator",
    note: "Annunciator: prior catalog paradigm. Different defect."
  }
];

export const DECKS = [
  {
    id: "bridge",
    role: "bridge deck / parent session",
    hail: "continuation to: '<id>'",
    open: true
  },
  {
    id: "cork",
    role: "speakpipe cork / Desktop ban",
    hail: "--disallowedTools SendMessage + PreToolUse auto-deny",
    open: false
  },
  {
    id: "crew",
    role: "below-decks crew / spawned subagent",
    hail: "context intact; MCP replacement does not cover",
    open: false
  }
];

const CHIP_REASONS = {
  corked:
    "ALARM: pipe corked; subagent continuation unreachable. Desktop launches bundled CLI with --disallowedTools SendMessage and auto-denies via desktop_ccd_permission_auto_denied (reason cli_native_send_message). Score corked or admit relayed",
  relayed:
    "speakpipe already relayed — continuation hail can pass the tube to a below-decks subagent with its context intact. Seeded word is relayed",
  "dual-purpose-tool":
    "dual-purpose-tool — SendMessage does two unrelated jobs: cross-session reachability AND continuing a previously spawned subagent with its context intact. Blocking the whole tool removes the second job",
  "overbroad-disallow":
    "overbroad-disallow — Desktop applies --disallowedTools SendMessage to the entire tool, not only to deck-to-ship / cross-session targets",
  "pretooluse-auto-deny":
    "pretooluse-auto-deny — a second layer in app/resources/app.asar emits desktop_ccd_permission_auto_denied with reason cli_native_send_message even if the tool were reached",
  "mcp-replacement-gap":
    "mcp-replacement-gap — the deny message points to mcp__ccd_session_mgmt__send_message for messaging another session; that MCP replacement does not cover subagent continuation",
  "footer-still-advertises":
    "footer-still-advertises — every subagent result still ends with agentId: <id> (use SendMessage with to: '<id>', summary: '...' to continue this agent)",
  "toolsearch-empty":
    "toolsearch-empty — ToolSearch with select:SendMessage returns No matching deferred tools found",
  "listagents-dead-instruction":
    "listagents-dead-instruction — ListAgents stays available and lists 29 reachable peers, telling the model to send with SendMessage({to: ...}) — a tool that is not there. Agent description still says Use SendMessage with the agent's ID or name to continue a previously spawned agent with its context intact",
  "cli-flag-honoured":
    "cli-flag-honoured — bundled 2.1.258 and 2.1.260 both drop SendMessage when --disallowedTools SendMessage is set, and both keep it when the flag is absent. CLI on PATH 2.1.263 without the flag still has SendMessage. The CLI version is not the variable",
  "desktop-app-ban":
    "desktop-app-ban — Claude Desktop 1.46388.4 (Windows MSIX, installed 2026-09-05 20:11) is applying the overbroad ban. The CLI honours the flag; Desktop is the surface that sets it",
  "timeline-zero-after-1.46388.4":
    "timeline-zero-after-1.46388.4 — last real SendMessage calls through 2.1.258 (84 calls / 4 sessions). After Desktop 1.46388.4, sessions from 2026-09-06 onward have zero calls (2.1.260: 7/0; 2.1.263: 2/0) while footers keep advertising",
  cousins:
    "cite-only #89543 SendMessage to a running background subagent never delivers (different surface); #92583 timeout orphans (backup); #92624 foreign session team file (backup). Not Afterimage/#92596. Not Limber/#92590. Not Chock/#92582. Not Deadman/#92593. Not Eidolon/#92601. Not Oubliette/#92095. Not Sounder / Callboard / Knock / Annunciator. Primary stays #92646",
  "has-clear-repro":
    "has-clear-repro — #92646 is labeled has repro: Claude Desktop 1.46388.4 Windows 11 Pro; ToolSearch select:SendMessage empty; spawn Agent; footer advertises use SendMessage with to:; there is no way to act on that instruction"
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

export function corkedSignal(text = "") {
  return /corked|pipe corked|continuation unreachable|disallowedTools SendMessage/i.test(
    String(text || "")
  );
}

export function relayedSignal(text = "") {
  return /relayed|continuation hail can pass|uncork|narrow the block/i.test(
    String(text || "")
  );
}

export function dualPurposeSignal(text = "") {
  return /dual-purpose|two unrelated jobs|continuing a previously spawned/i.test(
    String(text || "")
  );
}

export function overbroadSignal(text = "") {
  return /overbroad|disallowedTools SendMessage|whole tool/i.test(String(text || ""));
}

export function preToolUseSignal(text = "") {
  return /desktop_ccd_permission_auto_denied|cli_native_send_message|PreToolUse/i.test(
    String(text || "")
  );
}

export function mcpGapSignal(text = "") {
  return /mcp__ccd_session_mgmt__send_message|replacement does not cover|mcp-replacement-gap/i.test(
    String(text || "")
  );
}

export function footerSignal(text = "") {
  return /use SendMessage with to:|footer-still-advertises|continue this agent/i.test(
    String(text || "")
  );
}

export function toolSearchSignal(text = "") {
  return /No matching deferred tools found|toolsearch-empty|select:SendMessage/i.test(
    String(text || "")
  );
}

export function listAgentsSignal(text = "") {
  return /ListAgents|29 reachable peers|listagents-dead-instruction/i.test(
    String(text || "")
  );
}

export function cliFlagSignal(text = "") {
  return /cli-flag-honoured|honours the flag|CLI version is not the variable/i.test(
    String(text || "")
  );
}

export function desktopBanSignal(text = "") {
  return /1\.46388\.4|desktop-app-ban|Desktop is applying/i.test(String(text || ""));
}

export function timelineSignal(text = "") {
  return /timeline-zero-after-1\.46388\.4|2026-09-06|zero calls|last real/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    corked: corkedSignal(blob),
    relayed: relayedSignal(blob),
    dualPurpose: dualPurposeSignal(blob),
    overbroad: overbroadSignal(blob),
    preToolUse: preToolUseSignal(blob),
    mcpGap: mcpGapSignal(blob),
    footer: footerSignal(blob),
    toolSearch: toolSearchSignal(blob),
    listAgents: listAgentsSignal(blob),
    cliFlag: cliFlagSignal(blob),
    desktopBan: desktopBanSignal(blob),
    timeline: timelineSignal(blob)
  };
}

export function continuationRelayed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.continuationRelayed) || boolish(t.relayed) && !boolish(t.corked)) {
    return boolish(t.continuationRelayed) || (boolish(t.relayed) && !boolish(t.corked));
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const dual =
    boolish(t.dualPurposeTool) ||
    boolish(t.dualPurpose) ||
    hits.dualPurpose;
  const overbroad =
    boolish(t.overbroadDisallow) ||
    boolish(t.disallowedToolsSendMessage) ||
    hits.overbroad;
  const pre =
    boolish(t.preToolUseAutoDeny) ||
    t.preToolUseHook === MEASURED.preToolUseHook ||
    hits.preToolUse;
  const mcp =
    boolish(t.mcpReplacementGap) ||
    boolish(t.mcpDoesNotCoverContinuation) ||
    hits.mcpGap;
  const footer =
    boolish(t.footerStillAdvertises) ||
    boolish(t.footerAdvertisesContinuation) ||
    hits.footer;
  const search =
    boolish(t.toolSearchEmpty) ||
    t.toolSearchResult === MEASURED.toolSearchResult ||
    hits.toolSearch;
  const list =
    boolish(t.listAgentsDeadInstruction) ||
    t.listAgentsPeerCount === 29 ||
    hits.listAgents;
  const cli =
    boolish(t.cliFlagHonoured) ||
    boolish(t.cliHonoursFlag) ||
    hits.cliFlag;
  const desktop =
    boolish(t.desktopAppBan) ||
    t.desktop === MEASURED.desktop ||
    hits.desktopBan;
  const timeline =
    boolish(t.timelineZeroAfter) ||
    boolish(t.zeroCallsAfterDesktop) ||
    hits.timeline;
  const relayedClean =
    boolish(t.relayed) ||
    continuationRelayed(t);
  const corkedHit =
    boolish(t.corked) ||
    (overbroad && !boolish(t.relayed));
  return {
    dual,
    overbroad,
    pre,
    mcp,
    footer,
    search,
    list,
    cli,
    desktop,
    timeline,
    relayedClean,
    corkedHit,
    continuationOpen: continuationRelayed(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const corked =
    boolish(t.corked) ||
    (print.corkedHit && !boolish(t.relayed));
  const relayed =
    boolish(t.relayed) ||
    (print.relayedClean && !boolish(t.corked));
  return {
    corked,
    relayed,
    dualPurposeTool: boolish(t.dualPurposeTool) || print.dual,
    overbroadDisallow: boolish(t.overbroadDisallow) || print.overbroad,
    preToolUseAutoDeny: boolish(t.preToolUseAutoDeny) || print.pre,
    mcpReplacementGap: boolish(t.mcpReplacementGap) || print.mcp,
    footerStillAdvertises: boolish(t.footerStillAdvertises) || print.footer,
    toolSearchEmpty: boolish(t.toolSearchEmpty) || print.search,
    listAgentsDeadInstruction: boolish(t.listAgentsDeadInstruction) || print.list,
    cliFlagHonoured: boolish(t.cliFlagHonoured) || print.cli,
    desktopAppBan: boolish(t.desktopAppBan) || print.desktop,
    timelineZeroAfter: boolish(t.timelineZeroAfter) || print.timeline,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    desktop: t.desktop || MEASURED.desktop,
    os: t.os || MEASURED.os
  };
}

export function seedCorked() {
  return {
    seed: "corked",
    issue: 92646,
    corked: true,
    relayed: false,
    dualPurposeTool: true,
    overbroadDisallow: true,
    preToolUseAutoDeny: true,
    mcpReplacementGap: true,
    footerStillAdvertises: true,
    toolSearchEmpty: true,
    listAgentsDeadInstruction: true,
    cliFlagHonoured: true,
    desktopAppBan: true,
    timelineZeroAfter: true,
    disallowedToolsSendMessage: true,
    toolSearchResult: MEASURED.toolSearchResult,
    listAgentsPeerCount: 29,
    reporter: MEASURED.reporter
  };
}

export function seedRelayed() {
  return {
    seed: "relayed",
    issue: 92646,
    corked: false,
    relayed: true,
    continuationRelayed: true,
    dualPurposeTool: true,
    overbroadDisallow: false,
    toolSearchEmpty: false,
    footerStillAdvertises: false,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    corked: seedCorked(),
    relayed: seedRelayed(),
    "dual-purpose-tool": {
      seed: "dual-purpose-tool",
      issue: 92646,
      dualPurposeTool: true
    },
    "overbroad-disallow": {
      seed: "overbroad-disallow",
      issue: 92646,
      overbroadDisallow: true,
      disallowedToolsSendMessage: true
    },
    "pretooluse-auto-deny": {
      seed: "pretooluse-auto-deny",
      issue: 92646,
      preToolUseAutoDeny: true,
      preToolUseHook: MEASURED.preToolUseHook
    },
    "mcp-replacement-gap": {
      seed: "mcp-replacement-gap",
      issue: 92646,
      mcpReplacementGap: true,
      mcpDoesNotCoverContinuation: true
    },
    "footer-still-advertises": {
      seed: "footer-still-advertises",
      issue: 92646,
      footerStillAdvertises: true,
      footerAdvertisesContinuation: true
    },
    "toolsearch-empty": {
      seed: "toolsearch-empty",
      issue: 92646,
      toolSearchEmpty: true,
      toolSearchResult: MEASURED.toolSearchResult
    },
    "listagents-dead-instruction": {
      seed: "listagents-dead-instruction",
      issue: 92646,
      listAgentsDeadInstruction: true,
      listAgentsPeerCount: 29
    },
    "cli-flag-honoured": {
      seed: "cli-flag-honoured",
      issue: 92646,
      cliFlagHonoured: true,
      cliHonoursFlag: true
    },
    "desktop-app-ban": {
      seed: "desktop-app-ban",
      issue: 92646,
      desktopAppBan: true,
      desktop: MEASURED.desktop
    },
    "timeline-zero-after-1.46388.4": {
      seed: "timeline-zero-after-1.46388.4",
      issue: 92646,
      timelineZeroAfter: true,
      zeroCallsAfterDesktop: true
    },
    cousins: {
      seed: "cousins",
      issue: 92646,
      cousins: true,
      cousinsCiteOnly: [89543, 92583, 92624]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92646,
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
  "dual-purpose-tool",
  "overbroad-disallow",
  "pretooluse-auto-deny",
  "mcp-replacement-gap",
  "footer-still-advertises",
  "toolsearch-empty",
  "listagents-dead-instruction",
  "cli-flag-honoured",
  "desktop-app-ban",
  "timeline-zero-after-1.46388.4",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "dual-purpose-tool": (t, c) => boolish(t.dualPurposeTool) || c.dualPurposeTool,
  "overbroad-disallow": (t, c) => boolish(t.overbroadDisallow) || c.overbroadDisallow,
  "pretooluse-auto-deny": (t, c) => boolish(t.preToolUseAutoDeny) || c.preToolUseAutoDeny,
  "mcp-replacement-gap": (t, c) => boolish(t.mcpReplacementGap) || c.mcpReplacementGap,
  "footer-still-advertises": (t, c) => boolish(t.footerStillAdvertises) || c.footerStillAdvertises,
  "toolsearch-empty": (t, c) => boolish(t.toolSearchEmpty) || c.toolSearchEmpty,
  "listagents-dead-instruction": (t, c) =>
    boolish(t.listAgentsDeadInstruction) || c.listAgentsDeadInstruction,
  "cli-flag-honoured": (t, c) => boolish(t.cliFlagHonoured) || c.cliFlagHonoured,
  "desktop-app-ban": (t, c) => boolish(t.desktopAppBan) || c.desktopAppBan,
  "timeline-zero-after-1.46388.4": (t, c) => boolish(t.timelineZeroAfter) || c.timelineZeroAfter,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const speakpipe = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      corked: true,
      relayed: false,
      chips: ["cousins", "corked"],
      speakpipe
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      corked: true,
      relayed: false,
      chips: [seed, "corked"],
      speakpipe
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, speakpipe) && seed !== "corked" && seed !== "relayed") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        corked: true,
        relayed: false,
        chips: [name, "corked"],
        speakpipe
      };
    }
  }

  if (
    seed === "relayed" ||
    (t.relayed === true && t.corked !== true && seed !== "corked") ||
    (speakpipe.relayed && !speakpipe.corked && seed !== "corked")
  ) {
    reasons.push(CHIP_REASONS.relayed);
    return {
      verdict: "relayed",
      reasons,
      corked: false,
      relayed: true,
      chips: ["relayed"],
      speakpipe
    };
  }

  if (t.corked === true || seed === "corked" || (speakpipe.corked && !speakpipe.relayed)) {
    reasons.push(CHIP_REASONS.corked);
    const chips = ["corked"];
    if (t.dualPurposeTool === true || speakpipe.dualPurposeTool) chips.push("dual-purpose-tool");
    if (t.overbroadDisallow === true || speakpipe.overbroadDisallow) chips.push("overbroad-disallow");
    if (t.preToolUseAutoDeny === true || speakpipe.preToolUseAutoDeny) {
      chips.push("pretooluse-auto-deny");
    }
    if (t.mcpReplacementGap === true || speakpipe.mcpReplacementGap) {
      chips.push("mcp-replacement-gap");
    }
    if (t.footerStillAdvertises === true || speakpipe.footerStillAdvertises) {
      chips.push("footer-still-advertises");
    }
    if (t.toolSearchEmpty === true || speakpipe.toolSearchEmpty) chips.push("toolsearch-empty");
    if (t.listAgentsDeadInstruction === true || speakpipe.listAgentsDeadInstruction) {
      chips.push("listagents-dead-instruction");
    }
    if (t.cliFlagHonoured === true || speakpipe.cliFlagHonoured) chips.push("cli-flag-honoured");
    if (t.desktopAppBan === true || speakpipe.desktopAppBan) chips.push("desktop-app-ban");
    if (t.timelineZeroAfter === true || speakpipe.timelineZeroAfter) {
      chips.push("timeline-zero-after-1.46388.4");
    }
    return {
      verdict: "corked",
      reasons,
      corked: true,
      relayed: false,
      chips: [...new Set(chips)],
      speakpipe
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, corked: false, relayed: true, chips: [seed], speakpipe };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      corked: true,
      relayed: false,
      chips: [seed],
      speakpipe
    };
  }

  reasons.push(
    "empty probe; idle speakpipe is corked — ALARM: pipe corked; subagent continuation unreachable"
  );
  return {
    verdict: "corked",
    reasons,
    corked: true,
    relayed: false,
    chips: ["corked"],
    speakpipe
  };
}
