/**
 * Tain — pairing ledger for Claude-in-Chrome identity split.
 * A silvered tain is not a hold. Compare extension claim to session list.
 * Name the class or admit paired.
 *
 * Verdicts: paired | silvered | ghost | strayed | claimed | nameless | stale | split | dark
 * Idle word is paired. Never the product name. Never kernel. Never latched.
 * Never open (Reed). Never husked.
 *
 * Slack silvered/strayed alarm. Linear stray-browser ticket on strayed.
 * GitHub pairing-ledger issue on every scored probe.
 *
 * This is NOT Reed (MCP tool-registry contacts). Tain is the Chrome pairing
 * channel itself: native host + list_connected_browsers + isLocal + profile name.
 * NOT Husk (hollow headless success). NOT Snib (Trusted Devices fail-open).
 * NOT Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Fathom /
 * Hasp / Parity / Reveille / Quench / Scrim / Knock.
 */

export const VERDICTS = Object.freeze([
  "paired",
  "silvered",
  "ghost",
  "strayed",
  "claimed",
  "nameless",
  "stale",
  "split",
  "dark",
]);
export const IDLE_WORD = "paired";
export const SLACK_VERDICTS = Object.freeze(["silvered", "strayed"]);
export const LINEAR_VERDICTS = Object.freeze(["strayed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

/** The Chrome extension id both Claude.app and Claude Code native-host manifests claim (#90257). */
export const CLAIMED_EXTENSION_ID = "com.anthropic.claude_in_chrome";

export const GENERIC_BROWSER = /^browser\s+\d+$/i;

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  return Boolean(value);
}

function asHosts(value) {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    source: asText(row?.source),
    path: asText(row?.path),
    extensionId: asText(row?.extensionId),
  }));
}

function asBrowsers(value) {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    name: asText(row?.name),
    deviceId: asText(row?.deviceId),
    isLocal: Boolean(row?.isLocal),
    machineId: asText(row?.machineId),
    connectedAt: asText(row?.connectedAt),
    assignedName: asText(row?.assignedName),
  }));
}

function asMcp(value) {
  if (value === true || value === false) return value;
  return null;
}

export function emptyProbe() {
  return {
    extensionInstalled: false,
    extensionEnabled: false,
    extensionSignedIn: false,
    liveRendersSession: false,
    sessionId: "",
    nativeHostPath: "",
    claimedExtensionId: "",
    browsers: [],
    mcpConnected: null,
    mcpMessage: "",
    tabsContext: "",
    nativeHosts: [],
    thisMachine: "",
    boundMachine: "",
    assignedName: "",
    connectedAtFrozen: false,
    renameAppears: true,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "paired-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested =
    src.extension && typeof src.extension === "object" ? src.extension : {};
  const sessionObj = src.session && typeof src.session === "object" ? src.session : {};
  const browsers = asBrowsers(src.browsers ?? sessionObj.browsers ?? sessionObj.list);
  return {
    ...emptyProbe(),
    extensionInstalled: asBool(src.extensionInstalled ?? nested.installed),
    extensionEnabled: asBool(src.extensionEnabled ?? nested.enabled),
    extensionSignedIn: asBool(src.extensionSignedIn ?? nested.signedIn),
    liveRendersSession: asBool(src.liveRendersSession ?? nested.liveRendersSession),
    sessionId: asText(src.sessionId ?? nested.sessionId),
    nativeHostPath: asText(src.nativeHostPath ?? nested.nativeHostPath),
    claimedExtensionId: asText(src.claimedExtensionId ?? nested.claimedExtensionId),
    browsers,
    mcpConnected: asMcp(src.mcpConnected ?? sessionObj.mcpConnected),
    mcpMessage: asText(src.mcpMessage ?? sessionObj.mcpMessage),
    tabsContext: asText(src.tabsContext ?? sessionObj.tabsContext),
    nativeHosts: asHosts(src.nativeHosts),
    thisMachine: asText(src.thisMachine),
    boundMachine: asText(src.boundMachine),
    assignedName: asText(src.assignedName),
    connectedAtFrozen: asBool(src.connectedAtFrozen),
    renameAppears: src.renameAppears == null ? true : Boolean(src.renameAppears),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source),
    issue: asIssue(src.issue),
    scored: asBool(src.scored),
  };
}

function extensionPresent(probe) {
  return (
    probe.extensionInstalled ||
    probe.extensionEnabled ||
    probe.extensionSignedIn ||
    probe.liveRendersSession
  );
}

function sessionHeard(probe) {
  return probe.browsers.length > 0 || probe.mcpConnected === true;
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.extensionInstalled &&
    !next.extensionEnabled &&
    !next.extensionSignedIn &&
    !next.liveRendersSession &&
    !next.sessionId &&
    !next.nativeHostPath &&
    !next.claimedExtensionId &&
    next.browsers.length === 0 &&
    next.mcpConnected == null &&
    !next.mcpMessage &&
    !next.tabsContext &&
    next.nativeHosts.length === 0 &&
    !next.thisMachine &&
    !next.boundMachine &&
    !next.assignedName &&
    !next.connectedAtFrozen &&
    next.renameAppears === true
  );
}

export function hasNativeHostClash(probe = {}) {
  const next = cloneProbe(probe);
  const ids = next.nativeHosts.map((row) => row.extensionId).filter(Boolean);
  if (ids.length < 2) return false;
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) return true;
    seen.add(id);
  }
  return false;
}

export function isGenericName(name) {
  return GENERIC_BROWSER.test(String(name || "").trim());
}

export function hasNamelessListing(probe = {}) {
  const next = cloneProbe(probe);
  if (next.browsers.length === 0) return false;
  const listed = next.browsers.map((row) => row.name || row.assignedName);
  const allGeneric = listed.every((name) => isGenericName(name));
  if (!allGeneric) return false;
  return Boolean(next.assignedName) || listed.length >= 2 || listed.some((name) => isGenericName(name));
}

export function hasClaimedRemote(probe = {}) {
  const next = cloneProbe(probe);
  if (!next.thisMachine) return false;
  return next.browsers.some(
    (row) => row.isLocal === true && row.machineId && row.machineId !== next.thisMachine,
  );
}

export function hasStrayBind(probe = {}) {
  const next = cloneProbe(probe);
  return Boolean(next.boundMachine && next.thisMachine && next.boundMachine !== next.thisMachine);
}

export function bothSidesNameSameDevice(probe = {}) {
  const next = cloneProbe(probe);
  if (!next.liveRendersSession || next.browsers.length === 0) return false;
  if (next.mcpConnected === false) return false;
  const claimed = next.sessionId || next.assignedName;
  return next.browsers.some((row) => {
    const listed = row.deviceId || row.name || row.assignedName;
    if (!listed) return false;
    if (next.sessionId && (row.deviceId === next.sessionId || row.name === next.sessionId)) {
      return true;
    }
    if (next.assignedName && (row.name === next.assignedName || row.assignedName === next.assignedName)) {
      return true;
    }
    if (claimed && listed === claimed) return true;
    if (row.isLocal && next.thisMachine && row.machineId === next.thisMachine) {
      return Boolean(next.assignedName && row.name === next.assignedName);
    }
    return false;
  });
}

export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "paired";
  if (!extensionPresent(next) && !sessionHeard(next)) return "dark";
  if (next.liveRendersSession && next.browsers.length === 0) return "silvered";
  if (
    next.extensionInstalled &&
    next.extensionEnabled &&
    next.extensionSignedIn &&
    next.mcpConnected === false
  ) {
    return "ghost";
  }
  if (hasNativeHostClash(next)) return "split";
  if (hasStrayBind(next)) return "strayed";
  if (hasClaimedRemote(next)) return "claimed";
  if (hasNamelessListing(next)) return "nameless";
  if (next.connectedAtFrozen || (next.assignedName && next.renameAppears === false)) {
    return "stale";
  }
  if (bothSidesNameSameDevice(next)) return "paired";
  return "paired";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.sessionId) reasons.push(`session ${next.sessionId}`);
  if (next.extensionInstalled || next.extensionEnabled || next.extensionSignedIn) {
    reasons.push(
      [
        next.extensionInstalled ? "installed" : "not installed",
        next.extensionEnabled ? "enabled" : "disabled",
        next.extensionSignedIn ? "signed in" : "signed out",
      ].join(" · "),
    );
  } else {
    reasons.push("extension claim empty");
  }
  if (next.liveRendersSession) {
    reasons.push("extension live-renders this session");
  }
  if (next.nativeHostPath) reasons.push(`native-host ${next.nativeHostPath}`);
  if (next.claimedExtensionId) reasons.push(`claimed extension id ${next.claimedExtensionId}`);
  reasons.push(
    next.browsers.length === 0
      ? "list_connected_browsers []"
      : `list_connected_browsers ${next.browsers.length} device(s)`,
  );
  if (next.mcpConnected === false) {
    reasons.push(next.mcpMessage || "MCP tools say not connected");
  } else if (next.mcpConnected === true) {
    reasons.push("tabs_context_mcp connected");
  }
  if (next.tabsContext) reasons.push(`tabs_context ${next.tabsContext}`);
  if (next.nativeHosts.length) {
    reasons.push(
      next.nativeHosts
        .map((row) => `${row.source || "host"} → ${row.extensionId || "?"}`)
        .join(" · "),
    );
  }
  if (hasNativeHostClash(next)) {
    reasons.push("two native-host manifests claim the same Chrome extension id");
  }
  if (next.thisMachine) reasons.push(`this machine ${next.thisMachine}`);
  if (next.boundMachine) reasons.push(`actions bind to ${next.boundMachine}`);
  if (hasClaimedRemote(next)) {
    reasons.push("isLocal:true for a device that is not this machine");
  }
  if (next.assignedName) reasons.push(`assigned name ${next.assignedName}`);
  const listed = next.browsers.map((row) => row.name).filter(Boolean);
  if (listed.length) reasons.push(`listed names ${listed.join(", ")}`);
  if (next.connectedAtFrozen) reasons.push("connectedAt never moves");
  if (next.assignedName && next.renameAppears === false) {
    reasons.push("rename does not appear in list_connected_browsers");
  }
  if (kind === "paired") reasons.push("both sides name the same live device; glass is clear both ways");
  if (kind === "silvered") reasons.push("a silvered tain is not a hold");
  if (kind === "ghost") reasons.push("extension present; the agent channel is not connected");
  if (kind === "strayed") reasons.push("Cowork bound Chrome actions to a browser on another machine");
  if (kind === "claimed") reasons.push("isLocal claimed a remote box as this machine");
  if (kind === "nameless") reasons.push("user-assigned name lost or never persisted; picker is Browser 1/2");
  if (kind === "stale") reasons.push("list cached; connectedAt frozen; rename does not surface");
  if (kind === "split") reasons.push("Claude.app and Claude Code both claim the same extension id");
  if (kind === "dark") reasons.push("neither side connected");
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    extensionInstalled: pick("extensionInstalled"),
    extensionEnabled: pick("extensionEnabled"),
    extensionSignedIn: pick("extensionSignedIn"),
    liveRendersSession: pick("liveRendersSession"),
    sessionId: pick("sessionId"),
    nativeHostPath: pick("nativeHostPath"),
    claimedExtensionId: pick("claimedExtensionId"),
    browsers: pick("browsers"),
    mcpConnected: pick("mcpConnected"),
    mcpMessage: pick("mcpMessage"),
    tabsContext: pick("tabsContext"),
    nativeHosts: pick("nativeHosts"),
    thisMachine: pick("thisMachine"),
    boundMachine: pick("boundMachine"),
    assignedName: pick("assignedName"),
    connectedAtFrozen: pick("connectedAtFrozen"),
    renameAppears: pick("renameAppears"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    extension: fromFields.extension,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) probe.session = payload.session;
  return {
    action: String((nested ? nested.action : payload.action) || "score"),
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  return {
    ok: true,
    product: "tain",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    slack: SLACK_VERDICTS.includes(verdict),
    oneWay: verdict === "silvered" || verdict === "ghost",
    tainSilvered: verdict === "silvered",
    tainLifted: verdict === "paired",
    glassDark: verdict === "dark",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    extensionInstalled: next.extensionInstalled,
    extensionEnabled: next.extensionEnabled,
    extensionSignedIn: next.extensionSignedIn,
    liveRendersSession: next.liveRendersSession,
    sessionId: next.sessionId,
    nativeHostPath: next.nativeHostPath,
    claimedExtensionId: next.claimedExtensionId,
    browsers: next.browsers,
    mcpConnected: next.mcpConnected,
    mcpMessage: next.mcpMessage,
    tabsContext: next.tabsContext,
    nativeHosts: next.nativeHosts,
    thisMachine: next.thisMachine,
    boundMachine: next.boundMachine,
    assignedName: next.assignedName,
    connectedAtFrozen: next.connectedAtFrozen,
    renameAppears: next.renameAppears,
    reasons: reasonsOf(next, verdict),
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      extensionInstalled: Boolean(extras.extensionInstalled),
      extensionEnabled: Boolean(extras.extensionEnabled),
      extensionSignedIn: Boolean(extras.extensionSignedIn),
      liveRendersSession: Boolean(extras.liveRendersSession),
      sessionId: extras.sessionId || "",
      nativeHostPath: extras.nativeHostPath || "",
      claimedExtensionId: extras.claimedExtensionId || "",
      browsers: asBrowsers(extras.browsers),
      mcpConnected: asMcp(extras.mcpConnected),
      mcpMessage: extras.mcpMessage || "",
      tabsContext: extras.tabsContext || "",
      nativeHosts: asHosts(extras.nativeHosts),
      thisMachine: extras.thisMachine || "",
      boundMachine: extras.boundMachine || "",
      assignedName: extras.assignedName || "",
      connectedAtFrozen: Boolean(extras.connectedAtFrozen),
      renameAppears: extras.renameAppears == null ? true : Boolean(extras.renameAppears),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

const DESK = "desk-sydney";
const STUDIO = "Studio";
const HOST_DESKTOP =
  "~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.anthropic.claude_desktop.json";
const HOST_CODE =
  "~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.anthropic.claude_code.json";

/** Healthy both-ways. Extension claim and agent list name the same live device. */
export function seedPaired() {
  return seedProbe("paired", "paired", {
    session: "paired",
    issue: null,
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_studio",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: STUDIO,
        deviceId: "dev_studio",
        isLocal: true,
        machineId: DESK,
        connectedAt: "2026-08-28T07:50:00Z",
        assignedName: STUDIO,
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: STUDIO,
    connectedAtFrozen: false,
    renameAppears: true,
  });
}

/** PRIMARY #90257 one-way: extension live-renders this session; list is []. */
export function seed90257Silvered() {
  return seedProbe(90257, "anthropics/claude-code#90257", {
    session: "90257-silvered",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "sess_90257",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [],
    mcpConnected: null,
    mcpMessage: "",
    tabsContext: "",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: STUDIO,
  });
}

/** PRIMARY #83518: extension installed, enabled, signed in; MCP tools say not connected. */
export function seed83518Ghost() {
  return seedProbe(83518, "anthropics/claude-code#83518", {
    session: "83518-ghost",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: false,
    sessionId: "",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [],
    mcpConnected: false,
    mcpMessage: "not connected",
    tabsContext: "tabs_context_mcp not connected",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: "",
    assignedName: "",
  });
}

/** PRIMARY #86937: Cowork binds Chrome actions to a browser on another machine. */
export function seed86937Strayed() {
  return seedProbe(86937, "anthropics/claude-code#86937", {
    session: "86937-strayed",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_studio",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: STUDIO,
        deviceId: "dev_studio",
        isLocal: false,
        machineId: "cowork-cloud",
        connectedAt: "2026-08-28T06:10:00Z",
        assignedName: STUDIO,
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: "cowork-cloud",
    assignedName: STUDIO,
  });
}

/** PRIMARY #74667: isLocal:true for a browser on a different physical machine. */
export function seed74667Claimed() {
  return seedProbe(74667, "anthropics/claude-code#74667", {
    session: "74667-claimed",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_remote",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: "Laptop Berlin",
        deviceId: "dev_remote",
        isLocal: true,
        machineId: "laptop-berlin",
        connectedAt: "2026-08-28T05:40:00Z",
        assignedName: "Laptop Berlin",
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: "Laptop Berlin",
  });
}

/** #74902 / #90153: generic Browser 1/2; assigned name lost. */
export function seed74902Nameless() {
  return seedProbe(74902, "anthropics/claude-code#74902", {
    session: "74902-nameless",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_a",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: "Browser 1",
        deviceId: "dev_a",
        isLocal: true,
        machineId: DESK,
        connectedAt: "2026-08-28T04:20:00Z",
        assignedName: "",
      },
      {
        name: "Browser 2",
        deviceId: "dev_b",
        isLocal: true,
        machineId: DESK,
        connectedAt: "2026-08-28T04:21:00Z",
        assignedName: "",
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: STUDIO,
    renameAppears: false,
  });
}

/** #78096 / #89302: list cached; connectedAt never moves; rename does not appear. */
export function seed78096Stale() {
  return seedProbe(78096, "anthropics/claude-code#78096", {
    session: "78096-stale",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_studio",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: STUDIO,
        deviceId: "dev_studio",
        isLocal: true,
        machineId: DESK,
        connectedAt: "2026-08-20T11:00:00Z",
        assignedName: STUDIO,
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: "Studio East",
    connectedAtFrozen: true,
    renameAppears: false,
  });
}

/** #90257 native-host clash: two manifests claim the same Chrome extension id. */
export function seed90257Split() {
  return seedProbe(90257, "anthropics/claude-code#90257", {
    session: "90257-split",
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_studio",
    nativeHostPath: HOST_DESKTOP,
    claimedExtensionId: CLAIMED_EXTENSION_ID,
    browsers: [
      {
        name: STUDIO,
        deviceId: "dev_studio",
        isLocal: true,
        machineId: DESK,
        connectedAt: "2026-08-28T07:10:00Z",
        assignedName: STUDIO,
      },
    ],
    mcpConnected: true,
    mcpMessage: "connected",
    tabsContext: "tabs_context_mcp",
    nativeHosts: [
      { source: "Claude.app", path: HOST_DESKTOP, extensionId: CLAIMED_EXTENSION_ID },
      { source: "Claude Code", path: HOST_CODE, extensionId: CLAIMED_EXTENSION_ID },
    ],
    thisMachine: DESK,
    boundMachine: DESK,
    assignedName: STUDIO,
  });
}

/** Neither side connected. */
export function seedDark() {
  return seedProbe("dark", "dark", {
    session: "dark",
    issue: null,
    extensionInstalled: false,
    extensionEnabled: false,
    extensionSignedIn: false,
    liveRendersSession: false,
    browsers: [],
    mcpConnected: false,
    mcpMessage: "not connected",
    thisMachine: DESK,
    scored: true,
  });
}

const SEEDS = {
  paired: seedPaired,
  silvered: seed90257Silvered,
  90257: seed90257Silvered,
  "90257-silvered": seed90257Silvered,
  ghost: seed83518Ghost,
  83518: seed83518Ghost,
  "83518-ghost": seed83518Ghost,
  strayed: seed86937Strayed,
  86937: seed86937Strayed,
  "86937-strayed": seed86937Strayed,
  claimed: seed74667Claimed,
  74667: seed74667Claimed,
  "74667-claimed": seed74667Claimed,
  nameless: seed74902Nameless,
  74902: seed74902Nameless,
  90153: seed74902Nameless,
  "74902-nameless": seed74902Nameless,
  stale: seed78096Stale,
  78096: seed78096Stale,
  89302: seed78096Stale,
  "78096-stale": seed78096Stale,
  split: seed90257Split,
  "90257-split": seed90257Split,
  dark: seedDark,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear") {
    return pack("paired", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "admit") {
    probe = { ...probe, scored: true };
    const verdict = classify(probe);
    return pack(verdict, probe, { ...action, action: "admit" });
  }

  if (verb === "lift" || verb === "face" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
