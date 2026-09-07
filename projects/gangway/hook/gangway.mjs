/**
 * Gangway — pier gangway / boarding brow / ship-to-shore steel ramp bench.
 *
 * A brow that should remoor the Claude-in-Chrome bridge after Chrome
 * relaunches but instead stays severed: the session client never
 * re-dials the new native-host unix socket while the host is healthy,
 * and the restored MCP tab group cannot be re-adopted.
 *
 * Encoded from anthropics/claude-code#92662 issue facts only.
 * Hypothesis (NON-BINDING): in-process bridge client may cache a
 * dead socket and skip directory re-scan on later tool calls;
 * reconnect UI may reset extension side only; session→tab-group
 * map may be memory-only. Invite verify; do not claim source lines.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "severed",
  "remoored",
  "never-redial",
  "healthy-socket-ignored",
  "reconnect-noop",
  "tab-group-orphan",
  "session-mapping-lost",
  "createIfEmpty-new-tab-only",
  "chrome-relaunch-not-sleep",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["remoored"]);

export const ALARM = new Set([
  "severed",
  "never-redial",
  "healthy-socket-ignored",
  "reconnect-noop",
  "tab-group-orphan",
  "session-mapping-lost",
  "createIfEmpty-new-tab-only",
  "chrome-relaunch-not-sleep",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "severed";
export const SEEDED_WORD = "remoored";

export const MEASURED = {
  issue: 92662,
  title:
    "Claude in Chrome: after Chrome relaunches (update), session client never re-dials the new bridge socket and the restored tab group cannot be re-adopted",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:macos",
    "area:browser-extension",
    "area:chrome"
  ],
  filed: "2026-09-07T12:52:49Z",
  updated: "2026-09-07T12:53:59Z",
  reporter: "PromotezCitizen",
  comments: 0,
  os: "macOS Darwin 25.4.0 Apple Silicon",
  surface: "Claude in Chrome / native-host unix socket / MCP tab group",
  claudeCode: "2.1.260",
  chrome: "152.0.7977.83",
  chromeFrom: "152.0.7977.76",
  extension: "1.0.91",
  extensionId: "fcoeoabgfenejglbffodgkkbkcdhcgfn",
  nativeHost: "claude --chrome-native-host",
  nativeHostPid: 30308,
  socketDir: "/tmp/claude-mcp-browser-bridge-<user>/",
  socket: "/tmp/claude-mcp-browser-bridge-<user>/<pid>.sock",
  socketExample: "/tmp/claude-mcp-browser-bridge-<user>/30308.sock",
  trigger: "Chrome relaunch (update/manual/crash), not sleep/wake",
  notSleepWake: true,
  reconnectAttempts: 100,
  retryMessage: "Will retry on next tool call",
  toolError: "Browser extension is not connected",
  tabReject: "not in Claude's tab group for this session",
  tabGroupName: "Claude",
  tabId: 1277550962,
  chromeGroupId: 279849679,
  isMcp: true,
  sessionStarted: "2026-09-03 08:48",
  chromeInstalled: "2026-09-04 14:10",
  chromeRelaunched: "2026-09-06 17:56:11",
  hostSpawned: "2026-09-06 17:56:12",
  sleepAfterBreak: "2026-09-06 18:04",
  pageUnderTest: "localhost:3000",
  expected:
    "after Chrome relaunch, next tool call re-dials the new socket and the restored MCP tab group is re-adopted",
  actual:
    "session client never re-dials the healthy native-host socket; restored tab group cannot be re-adopted",
  impact:
    "every mcp__claude-in-chrome__* tool stays disconnected; createIfEmpty / tabs_create_mcp opens a NEW tab and abandons the page under test"
};

export const COUSINS = [
  {
    id: 88558,
    state: "open",
    note: "Cite-only cousin. Stuck not connected. DIFFERENT: trigger unknown there. Primary stays #92662."
  },
  {
    id: 86793,
    state: "open",
    note: "Cite-only cousin. Stuck not connected. DIFFERENT: trigger unknown there. Primary stays #92662."
  },
  {
    id: 61117,
    state: "closed",
    note: "Cite-only cousin. Closed. CLI never dials healthy socket. DIFFERENT filing, same socket-level family. Primary stays #92662."
  },
  {
    id: 73903,
    state: "closed",
    note: "Cite-only cousin. Closed. CLI never dials healthy socket. DIFFERENT filing, same socket-level family. Primary stays #92662."
  },
  {
    id: 87774,
    state: "open",
    note: "Cite-only cousin. Session→tab-group mapping lost / orphan tabs. DIFFERENT filing; this product covers Chrome-relaunch never-redial + restored-group orphan. Primary stays #92662."
  },
  {
    id: 89335,
    state: "open",
    note: "Cite-only cousin. Session→tab-group mapping lost / orphan tabs. DIFFERENT filing. Primary stays #92662."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624: named-spawn foreign session id. Different defect."
  },
  {
    slug: "snatch",
    issue: 92583,
    note: "Snatch/#92583: session-end never reaps auto-backgrounded Bash orphans. Different defect."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop overbroad SendMessage ban. Different defect."
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
    note: "Chock/#92582: settings-layer merge miss. Different defect."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout leftover. Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: ENOENT fake notice. Different defect."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: Dispatch void. Different defect."
  }
];

export const BROWS = [
  {
    id: "shore",
    role: "shore / CLI session client",
    hail: "in-process bridge · never re-dials",
    remoored: false
  },
  {
    id: "brow",
    role: "brow / unix socket",
    hail: "healthy host answers execute_tool on the new .sock",
    remoored: false
  },
  {
    id: "ship",
    role: "ship / restored Claude tab group",
    hail: "isMcp true · session map lost · orphan",
    remoored: false
  }
];

const CHIP_REASONS = {
  severed:
    "ALARM: gangway severed; session client never re-dials the new native-host socket while the host is healthy; restored MCP tab group cannot be re-adopted. Score severed or admit remoored",
  remoored:
    "gangway already remoored — session client re-dials the new native-host socket and the restored MCP tab group is re-adopted. Seeded word is remoored",
  "never-redial":
    "never-redial — after Chrome relaunches, the long-running CLI session's in-process bridge client NEVER re-dials the new native-host unix socket; every mcp__claude-in-chrome__* tool returns Browser extension is not connected for the rest of the session; client gives up after 100 attempts with Will retry on next tool call but subsequent calls do not re-dial",
  "healthy-socket-ignored":
    "healthy-socket-ignored — native host is healthy and answers the SAME execute_tool when sent to its socket directly; socket /tmp/claude-mcp-browser-bridge-<user>/<pid>.sock; host claude --chrome-native-host",
  "reconnect-noop":
    "reconnect-noop — /chrome > Reconnect extension and Select browser do NOT recover it; reconnect UI does not remoor the session client",
  "tab-group-orphan":
    "tab-group-orphan — Chrome restores the Claude tab group; extension Local Extension Settings still record it with isMcp: true, but every tool call on that tab is rejected (not in Claude's tab group for this session)",
  "session-mapping-lost":
    "session-mapping-lost — session→group mapping lives only in memory and is lost on Chrome restart; restored group cannot be re-adopted",
  "createIfEmpty-new-tab-only":
    "createIfEmpty-new-tab-only — only recovery (createIfEmpty / tabs_create_mcp) opens a NEW tab and abandons the page under test",
  "chrome-relaunch-not-sleep":
    "chrome-relaunch-not-sleep — trigger is Chrome relaunch (update/manual/crash), not sleep/wake; Chrome 152.0.7977.83 from .76; Claude Code 2.1.260 native macOS; extension 1.0.91",
  cousins:
    "cite-only #88558 #86793 stuck not connected; #61117 #73903 closed CLI never dials healthy socket; #87774 #89335 session→tab-group mapping lost / orphan tabs. Not Waybill/#92624. Not Snatch/#92583. Not Speakpipe/#92646. Not Afterimage/#92596. Not Limber/#92590. Not Chock/#92582. Not Deadman/#92593. Not Eidolon/#92601. Not Oubliette/#92095. Primary stays #92662",
  "has-clear-repro":
    "has-clear-repro — #92662 is labeled has repro: Claude Code 2.1.260 native macOS; Chrome 152.0.7977.83; extension 1.0.91; after Chrome relaunch the session client never re-dials the healthy socket and the restored MCP tab group cannot be re-adopted"
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

export function severedSignal(text = "") {
  return /severed|never re-dial|not connected|gangway/i.test(String(text || ""));
}

export function remooredSignal(text = "") {
  return /remoored|re-dial the new|re-adopt/i.test(String(text || ""));
}

export function neverRedialSignal(text = "") {
  return /never-redial|never re-dial|100 attempts|Will retry on next tool call/i.test(
    String(text || "")
  );
}

export function healthySocketSignal(text = "") {
  return /healthy-socket|healthy socket|execute_tool|chrome-native-host|\.sock/i.test(
    String(text || "")
  );
}

export function reconnectNoopSignal(text = "") {
  return /reconnect-noop|Reconnect extension|Select browser/i.test(String(text || ""));
}

export function tabGroupOrphanSignal(text = "") {
  return /tab-group-orphan|isMcp|not in Claude's tab group/i.test(String(text || ""));
}

export function sessionMappingSignal(text = "") {
  return /session-mapping-lost|session→group|session-to-group|lives only in memory/i.test(
    String(text || "")
  );
}

export function createIfEmptySignal(text = "") {
  return /createIfEmpty-new-tab|createIfEmpty|tabs_create_mcp|NEW tab/i.test(
    String(text || "")
  );
}

export function chromeRelaunchSignal(text = "") {
  return /chrome-relaunch-not-sleep|Chrome relaunch|not sleep\/wake|152\.0\.7977/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    severed: severedSignal(blob),
    remoored: remooredSignal(blob),
    neverRedial: neverRedialSignal(blob),
    healthySocket: healthySocketSignal(blob),
    reconnectNoop: reconnectNoopSignal(blob),
    tabGroupOrphan: tabGroupOrphanSignal(blob),
    sessionMapping: sessionMappingSignal(blob),
    createIfEmpty: createIfEmptySignal(blob),
    chromeRelaunch: chromeRelaunchSignal(blob)
  };
}

export function gangwayRemoored(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.gangwayRemoored) || (boolish(t.remoored) && !boolish(t.severed))) {
    return boolish(t.gangwayRemoored) || (boolish(t.remoored) && !boolish(t.severed));
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const neverRedial =
    boolish(t.neverRedial) ||
    t.reconnectAttempts === MEASURED.reconnectAttempts ||
    hits.neverRedial;
  const healthySocket =
    boolish(t.healthySocketIgnored) ||
    boolish(t.healthySocket) ||
    t.nativeHost === MEASURED.nativeHost ||
    hits.healthySocket;
  const reconnectNoop = boolish(t.reconnectNoop) || hits.reconnectNoop;
  const tabGroupOrphan =
    boolish(t.tabGroupOrphan) ||
    t.isMcp === true ||
    t.tabId === MEASURED.tabId ||
    hits.tabGroupOrphan;
  const sessionMapping = boolish(t.sessionMappingLost) || hits.sessionMapping;
  const createIfEmpty =
    boolish(t.createIfEmptyNewTabOnly) ||
    boolish(t.createIfEmpty) ||
    hits.createIfEmpty;
  const chromeRelaunch =
    boolish(t.chromeRelaunchNotSleep) ||
    boolish(t.notSleepWake) ||
    t.trigger === MEASURED.trigger ||
    hits.chromeRelaunch;
  const remooredClean = boolish(t.remoored) || gangwayRemoored(t);
  const severedHit = boolish(t.severed) || (neverRedial && !boolish(t.remoored));
  return {
    neverRedial,
    healthySocket,
    reconnectNoop,
    tabGroupOrphan,
    sessionMapping,
    createIfEmpty,
    chromeRelaunch,
    remooredClean,
    severedHit,
    browRemoored: gangwayRemoored(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const severed = boolish(t.severed) || (print.severedHit && !boolish(t.remoored));
  const remoored = boolish(t.remoored) || (print.remooredClean && !boolish(t.severed));
  return {
    severed,
    remoored,
    neverRedial: boolish(t.neverRedial) || print.neverRedial,
    healthySocketIgnored: boolish(t.healthySocketIgnored) || print.healthySocket,
    reconnectNoop: boolish(t.reconnectNoop) || print.reconnectNoop,
    tabGroupOrphan: boolish(t.tabGroupOrphan) || print.tabGroupOrphan,
    sessionMappingLost: boolish(t.sessionMappingLost) || print.sessionMapping,
    createIfEmptyNewTabOnly: boolish(t.createIfEmptyNewTabOnly) || print.createIfEmpty,
    chromeRelaunchNotSleep: boolish(t.chromeRelaunchNotSleep) || print.chromeRelaunch,
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

export function seedSevered() {
  return {
    seed: "severed",
    issue: 92662,
    severed: true,
    remoored: false,
    neverRedial: true,
    healthySocketIgnored: true,
    reconnectNoop: true,
    tabGroupOrphan: true,
    sessionMappingLost: true,
    createIfEmptyNewTabOnly: true,
    chromeRelaunchNotSleep: true,
    notSleepWake: true,
    reconnectAttempts: MEASURED.reconnectAttempts,
    nativeHost: MEASURED.nativeHost,
    socket: MEASURED.socket,
    tabId: MEASURED.tabId,
    isMcp: true,
    outputText:
      "severed; never-redial; healthy-socket-ignored; Browser extension is not connected; restored tab group orphan",
    reporter: MEASURED.reporter
  };
}

export function seedRemoored() {
  return {
    seed: "remoored",
    issue: 92662,
    severed: false,
    remoored: true,
    gangwayRemoored: true,
    neverRedial: false,
    healthySocketIgnored: false,
    tabGroupOrphan: false,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    severed: seedSevered(),
    remoored: seedRemoored(),
    "never-redial": {
      seed: "never-redial",
      issue: 92662,
      neverRedial: true,
      reconnectAttempts: MEASURED.reconnectAttempts
    },
    "healthy-socket-ignored": {
      seed: "healthy-socket-ignored",
      issue: 92662,
      healthySocketIgnored: true,
      nativeHost: MEASURED.nativeHost
    },
    "reconnect-noop": {
      seed: "reconnect-noop",
      issue: 92662,
      reconnectNoop: true
    },
    "tab-group-orphan": {
      seed: "tab-group-orphan",
      issue: 92662,
      tabGroupOrphan: true,
      isMcp: true,
      tabId: MEASURED.tabId
    },
    "session-mapping-lost": {
      seed: "session-mapping-lost",
      issue: 92662,
      sessionMappingLost: true
    },
    "createIfEmpty-new-tab-only": {
      seed: "createIfEmpty-new-tab-only",
      issue: 92662,
      createIfEmptyNewTabOnly: true
    },
    "chrome-relaunch-not-sleep": {
      seed: "chrome-relaunch-not-sleep",
      issue: 92662,
      chromeRelaunchNotSleep: true,
      notSleepWake: true
    },
    cousins: {
      seed: "cousins",
      issue: 92662,
      cousins: true,
      cousinsCiteOnly: [88558, 86793, 61117, 73903, 87774, 89335]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92662,
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
  "never-redial",
  "healthy-socket-ignored",
  "reconnect-noop",
  "tab-group-orphan",
  "session-mapping-lost",
  "createIfEmpty-new-tab-only",
  "chrome-relaunch-not-sleep",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "never-redial": (t, c) => boolish(t.neverRedial) || c.neverRedial,
  "healthy-socket-ignored": (t, c) =>
    boolish(t.healthySocketIgnored) || c.healthySocketIgnored,
  "reconnect-noop": (t, c) => boolish(t.reconnectNoop) || c.reconnectNoop,
  "tab-group-orphan": (t, c) => boolish(t.tabGroupOrphan) || c.tabGroupOrphan,
  "session-mapping-lost": (t, c) =>
    boolish(t.sessionMappingLost) || c.sessionMappingLost,
  "createIfEmpty-new-tab-only": (t, c) =>
    boolish(t.createIfEmptyNewTabOnly) || c.createIfEmptyNewTabOnly,
  "chrome-relaunch-not-sleep": (t, c) =>
    boolish(t.chromeRelaunchNotSleep) || c.chromeRelaunchNotSleep,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const gangway = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      severed: true,
      remoored: false,
      chips: ["cousins", "severed"],
      gangway
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      severed: true,
      remoored: false,
      chips: [seed, "severed"],
      gangway
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, gangway) && seed !== "severed" && seed !== "remoored") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        severed: true,
        remoored: false,
        chips: [name, "severed"],
        gangway
      };
    }
  }

  if (
    seed === "remoored" ||
    (t.remoored === true && t.severed !== true && seed !== "severed") ||
    (gangway.remoored && !gangway.severed && seed !== "severed")
  ) {
    reasons.push(CHIP_REASONS.remoored);
    return {
      verdict: "remoored",
      reasons,
      severed: false,
      remoored: true,
      chips: ["remoored"],
      gangway
    };
  }

  if (t.severed === true || seed === "severed" || (gangway.severed && !gangway.remoored)) {
    reasons.push(CHIP_REASONS.severed);
    const chips = ["severed"];
    if (t.neverRedial === true || gangway.neverRedial) chips.push("never-redial");
    if (t.healthySocketIgnored === true || gangway.healthySocketIgnored) {
      chips.push("healthy-socket-ignored");
    }
    if (t.reconnectNoop === true || gangway.reconnectNoop) chips.push("reconnect-noop");
    if (t.tabGroupOrphan === true || gangway.tabGroupOrphan) chips.push("tab-group-orphan");
    if (t.sessionMappingLost === true || gangway.sessionMappingLost) {
      chips.push("session-mapping-lost");
    }
    if (t.createIfEmptyNewTabOnly === true || gangway.createIfEmptyNewTabOnly) {
      chips.push("createIfEmpty-new-tab-only");
    }
    if (t.chromeRelaunchNotSleep === true || gangway.chromeRelaunchNotSleep) {
      chips.push("chrome-relaunch-not-sleep");
    }
    return {
      verdict: "severed",
      reasons,
      severed: true,
      remoored: false,
      chips: [...new Set(chips)],
      gangway
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, severed: false, remoored: true, chips: [seed], gangway };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      severed: true,
      remoored: false,
      chips: [seed],
      gangway
    };
  }

  reasons.push(
    "empty probe; idle gangway is severed — ALARM: session client never re-dials the healthy native-host socket; restored tab group cannot be re-adopted"
  );
  return {
    verdict: "severed",
    reasons,
    severed: true,
    remoored: false,
    chips: ["severed"],
    gangway
  };
}
