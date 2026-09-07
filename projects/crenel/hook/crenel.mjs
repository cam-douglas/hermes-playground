/**
 * Crenel — mason's battlement crenel / embrasure-notch bench.
 *
 * A crenel that should admit an MCP server advertising
 * capabilities.resources as the empty object {} (spec-legal = supported).
 * Instead the client walls the notch: ListMcpResourcesTool finds none,
 * ReadMcpResourceTool says the server does not support resources, while
 * tools/* from the same server still work. A stdio neighbour advertising
 * resources.listChanged:false is listed correctly. Wire curl list+read
 * return HTTP 200. Bundled SDK assertCapability treats {} as truthy —
 * something upstream decides the server has no resources.
 *
 * Encoded from anthropics/claude-code#92729 issue facts only.
 * Hypothesis (NON-BINDING): something upstream of SDK assertCapability
 * normalizes or gates on optional sub-keys (e.g. treating missing
 * listChanged as unsupported) rather than presence of the resources key.
 * Verify against issue text only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "bricked",
  "crenelled",
  "empty-object-capability",
  "list-no-resources",
  "read-unsupported",
  "tools-still-work",
  "stdio-listChanged-works",
  "wire-curl-ok",
  "assertCapability-truthy",
  "upstream-reject",
  "instructions-truncated-proof",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["crenelled"]);

export const ALARM = new Set([
  "bricked",
  "empty-object-capability",
  "list-no-resources",
  "read-unsupported",
  "tools-still-work",
  "stdio-listChanged-works",
  "wire-curl-ok",
  "assertCapability-truthy",
  "upstream-reject",
  "instructions-truncated-proof",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "bricked";
export const SEEDED_WORD = "crenelled";

export const MEASURED = {
  issue: 92729,
  title: "MCP: server advertising `resources` capability is treated as having none",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:mcp"],
  filed: "2026-09-07T20:19:27Z",
  updated: "2026-09-07T20:20:22Z",
  reporter: "juancastroG",
  comments: 0,
  os: "macOS 15",
  darwin: "25.4.0",
  platform: "macos",
  surface: "Claude Code desktop app Code tab MCP resources capability",
  serverRuntime: "Rust + rmcp 3.1.4",
  transport: "Streamable HTTP",
  stateless: true,
  legacySessionMode: false,
  jsonResponse: true,
  serverUrlPattern: "http://localhost:<port>/core/mcp",
  alsoViaMcpRemote: true,
  mcpRemoteVersion: "0.1.38",
  failingCapabilities: { resources: {}, tools: {} },
  workingStdioCapabilities: {
    resources: { listChanged: false },
    tools: { listChanged: false }
  },
  bothSpecLegal: true,
  emptyObjectMeansSupported: true,
  listMcpResourcesResult:
    "No resources found. MCP servers may still provide tools even if they have no resources.",
  readMcpResourceResult: 'Server "<name>" does not support resources',
  toolsFromSameServerWork: true,
  otherStdioServerResourcesListed: true,
  wireInitializeCapabilities: { resources: {}, tools: {} },
  wireResourcesListReturnsArray: true,
  wireResourcesListFields: ["uri", "name", "mimeType", "size"],
  wireResourcesReadReturnsDocument: true,
  wireTemplatesList: { resourceTemplates: [] },
  wireHttpStatus: 200,
  protocolVersionsTried: ["2024-11-05", "2025-06-18", "2025-11-25", "2026-07-28"],
  sameFailureViaMcpRemote: true,
  initializeParsed: true,
  instructionsTruncatedFrom: 2221,
  instructionsTruncatedTo: 2048,
  assertCapabilityTreatsEmptyObjectTruthy: true,
  assertCapabilityCheck:
    "if (!this._capabilities.resources) throw — {} is present (truthy)",
  assertCapabilityIsNotTheRejector: true,
  upstreamDecidesNoResources: true,
  expected:
    "server advertising capabilities.resources (including empty object) has resources listed and readable",
  actual:
    "MCP server that advertises resources capability in initialize is treated as having no resource support; ListMcpResourcesTool returns no resources; ReadMcpResourceTool says the server does not support resources; tools/* still work; stdio neighbour with listChanged:false is listed correctly; wire curl list+read 200",
  impact:
    "empty-object resources capability {} treated as absent / no support"
};

export const WIRE = [
  {
    id: "initialize",
    role: "initialize",
    hail: "capabilities {\"resources\":{},\"tools\":{}}",
    http: 200
  },
  {
    id: "list",
    role: "resources/list",
    hail: "resources array with uri / name / mimeType / size",
    http: 200
  },
  {
    id: "read",
    role: "resources/read",
    hail: "returns document",
    http: 200
  },
  {
    id: "templates",
    role: "resources/templates/list",
    hail: "{\"resourceTemplates\":[]}",
    http: 200
  }
];

export const CAPABILITY_COURSES = [
  {
    id: "fails",
    role: "Streamable HTTP (this server)",
    capabilities: { resources: {}, tools: {} },
    listed: false,
    note: "spec-legal empty object = supported, no optional sub-capabilities"
  },
  {
    id: "works",
    role: "stdio neighbour (same session)",
    capabilities: {
      resources: { listChanged: false },
      tools: { listChanged: false }
    },
    listed: true,
    note: "resource support works in general; listChanged:false control"
  }
];

export const COUSINS = [
  {
    id: 85230,
    state: "open",
    note: "Cite-only cousin. Background subagents lose ListMcpResourcesTool/ReadMcpResourceTool. Different surface (background subagent tool loss, not empty-object capability treated as absent). Primary stays #92729."
  },
  {
    id: 80300,
    state: "open",
    note: "Cite-only cousin. ReadMcpResourceTool intermittently not enabled after reconnect. Different surface (reconnect enablement, not empty-object capability). Primary stays #92729."
  },
  {
    id: 88128,
    state: "open",
    note: "Cite-only cousin. tools/list and resources/list rejected when optional ttlMs/cacheScope omitted. Different surface (optional request fields, not initialize capability {}). Primary stays #92729."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "quietus",
    issue: 92716,
    note: "Quietus/#92716: SubagentStop kill path. Different defect."
  },
  {
    slug: "cribble",
    issue: 92684,
    note: "Cribble/#92684: denyWrite mid-path wildcards. Different defect."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675: plugin PreToolUse interactive slip. Different defect."
  },
  {
    slug: "gangway",
    issue: 92662,
    note: "Gangway/#92662: Chrome relaunch bridge. Different defect."
  },
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624: named-agent foreign session. Different defect."
  },
  {
    slug: "catachresis",
    issue: 92518,
    note: "Catachresis/#92518: MCP insufficient_scope mislabeled expired — different MCP bug."
  }
];

const CHIP_REASONS = {
  bricked:
    "ALARM: crenel bricked; empty resources:{} capability is walled over / treated as absent. ListMcpResourcesTool finds none, ReadMcpResourceTool says unsupported. Score bricked or admit crenelled",
  crenelled:
    "crenel already crenelled — empty-object capability is acknowledged as support; List+Read work. Seeded word is crenelled",
  "empty-object-capability":
    "empty-object-capability — initialize advertises {\"resources\":{},\"tools\":{}}; both this and {\"resources\":{\"listChanged\":false},\"tools\":{\"listChanged\":false}} are spec-legal; resources:{} means supported, no optional sub-capabilities",
  "list-no-resources":
    "list-no-resources — ListMcpResourcesTool with that server name returns: No resources found. MCP servers may still provide tools even if they have no resources.",
  "read-unsupported":
    "read-unsupported — ReadMcpResourceTool against a valid URI returns: Server \"<name>\" does not support resources",
  "tools-still-work":
    "tools-still-work — tools/* from the same server works fine. The handshake and tool surface are alive; only resources are walled",
  "stdio-listChanged-works":
    "stdio-listChanged-works — another MCP server in the same session (stdio) DOES have its resources listed correctly — resource support works in general, just not for this server. Working shape: {\"resources\":{\"listChanged\":false},\"tools\":{\"listChanged\":false}}",
  "wire-curl-ok":
    "wire-curl-ok — curl initialize / resources/list / resources/read / resources/templates/list all HTTP 200; list returns uri/name/mimeType/size; read returns document; templates {\"resourceTemplates\":[]}. Identical capabilities across protocol 2024-11-05, 2025-06-18, 2025-11-25, 2026-07-28; same failure via mcp-remote 0.1.38",
  "assertCapability-truthy":
    "assertCapability-truthy — bundled MCP SDK assertCapability (`if (!this._capabilities.resources) throw`) treats {} as present (truthy); that check is NOT the one rejecting it",
  "upstream-reject":
    "upstream-reject — something upstream of SDK assertCapability decides the server has no resources. Hypothesis (NON-BINDING): optional sub-keys such as listChanged may be gated rather than presence of the resources key. Verify against issue text only; do not claim unread source",
  "instructions-truncated-proof":
    "instructions-truncated-proof — client parsed the initialize carrying resources:{}; MCP log shows Server instructions truncated from 2221 to 2048 chars — instructions length proves that handshake was parsed",
  cousins:
    "cite-only #85230 (background subagents lose ListMcpResourcesTool/ReadMcpResourceTool); #80300 (ReadMcpResourceTool intermittently not enabled after reconnect); #88128 (tools/list and resources/list rejected when optional ttlMs/cacheScope omitted). Do not auto-pick as thesis. Not Quietus/#92716. Not Cribble/#92684. Not Springe/#92675. Not Gangway/#92662. Not Waybill/#92624. Not Catachresis/#92518. Primary stays #92729",
  "has-clear-repro":
    "has-clear-repro — #92729 is labeled has repro: Claude Code desktop app Code tab; macOS 15 (Darwin 25.4.0); Rust + rmcp 3.1.4 Streamable HTTP; wire curl list+read 200; reporter juancastroG"
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

export function brickedSignal(text = "") {
  return /bricked|walled over|treated as absent|stays bricked/i.test(String(text || ""));
}

export function crenelledSignal(text = "") {
  return /crenelled|acknowledged as support|crenel already crenelled|notch admits/i.test(
    String(text || "")
  );
}

export function emptyObjectCapabilitySignal(text = "") {
  return /empty-object-capability|resources:\{\}|resources":\{\}|empty object/i.test(
    String(text || "")
  );
}

export function listNoResourcesSignal(text = "") {
  return /list-no-resources|No resources found|ListMcpResourcesTool/i.test(String(text || ""));
}

export function readUnsupportedSignal(text = "") {
  return /read-unsupported|does not support resources|ReadMcpResourceTool/i.test(
    String(text || "")
  );
}

export function toolsStillWorkSignal(text = "") {
  return /tools-still-work|tools\/\* from the same server|tools from the same server/i.test(
    String(text || "")
  );
}

export function stdioListChangedWorksSignal(text = "") {
  return /stdio-listChanged-works|listChanged:false|stdio neighbour|stdio neighbor/i.test(
    String(text || "")
  );
}

export function wireCurlOkSignal(text = "") {
  return /wire-curl-ok|curl initialize|HTTP 200|resourceTemplates/i.test(String(text || ""));
}

export function assertCapabilityTruthySignal(text = "") {
  return /assertCapability-truthy|assertCapability|truthy|_capabilities\.resources/i.test(
    String(text || "")
  );
}

export function upstreamRejectSignal(text = "") {
  return /upstream-reject|something upstream|upstream of SDK/i.test(String(text || ""));
}

export function instructionsTruncatedProofSignal(text = "") {
  return /instructions-truncated-proof|truncated from 2221|2048 chars/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    bricked: brickedSignal(blob),
    crenelled: crenelledSignal(blob),
    emptyObjectCapability: emptyObjectCapabilitySignal(blob),
    listNoResources: listNoResourcesSignal(blob),
    readUnsupported: readUnsupportedSignal(blob),
    toolsStillWork: toolsStillWorkSignal(blob),
    stdioListChangedWorks: stdioListChangedWorksSignal(blob),
    wireCurlOk: wireCurlOkSignal(blob),
    assertCapabilityTruthy: assertCapabilityTruthySignal(blob),
    upstreamReject: upstreamRejectSignal(blob),
    instructionsTruncatedProof: instructionsTruncatedProofSignal(blob)
  };
}

export function crenelCrenelled(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.crenelCrenelled) || (boolish(t.crenelled) && !boolish(t.bricked))) {
    return boolish(t.crenelCrenelled) || (boolish(t.crenelled) && !boolish(t.bricked));
  }
  return false;
}

export function courseAdmits(courseId) {
  const row = CAPABILITY_COURSES.find((cell) => cell.id === courseId);
  if (!row) return null;
  return row.listed;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const emptyObjectCapability =
    boolish(t.emptyObjectCapability) ||
    (t.failingCapabilities &&
      t.failingCapabilities.resources &&
      Object.keys(t.failingCapabilities.resources).length === 0) ||
    hits.emptyObjectCapability;
  const listNoResources =
    boolish(t.listNoResources) ||
    (typeof t.listMcpResourcesResult === "string" &&
      /No resources found/i.test(t.listMcpResourcesResult)) ||
    hits.listNoResources;
  const readUnsupported =
    boolish(t.readUnsupported) ||
    (typeof t.readMcpResourceResult === "string" &&
      /does not support resources/i.test(t.readMcpResourceResult)) ||
    hits.readUnsupported;
  const toolsStillWork =
    boolish(t.toolsStillWork) || t.toolsFromSameServerWork === true || hits.toolsStillWork;
  const stdioListChangedWorks =
    boolish(t.stdioListChangedWorks) ||
    t.otherStdioServerResourcesListed === true ||
    hits.stdioListChangedWorks;
  const wireCurlOk =
    boolish(t.wireCurlOk) || t.wireHttpStatus === 200 || hits.wireCurlOk;
  const assertCapabilityTruthy =
    boolish(t.assertCapabilityTruthy) ||
    t.assertCapabilityTreatsEmptyObjectTruthy === true ||
    hits.assertCapabilityTruthy;
  const upstreamReject =
    boolish(t.upstreamReject) ||
    t.upstreamDecidesNoResources === true ||
    hits.upstreamReject;
  const instructionsTruncatedProof =
    boolish(t.instructionsTruncatedProof) ||
    t.instructionsTruncatedFrom === 2221 ||
    hits.instructionsTruncatedProof;
  const crenelledClean = boolish(t.crenelled) || crenelCrenelled(t);
  const brickedHit = boolish(t.bricked) || (listNoResources && !boolish(t.crenelled));
  return {
    emptyObjectCapability,
    listNoResources,
    readUnsupported,
    toolsStillWork,
    stdioListChangedWorks,
    wireCurlOk,
    assertCapabilityTruthy,
    upstreamReject,
    instructionsTruncatedProof,
    crenelledClean,
    brickedHit,
    notchAdmits: crenelCrenelled(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const bricked = boolish(t.bricked) || (print.brickedHit && !boolish(t.crenelled));
  const crenelled = boolish(t.crenelled) || (print.crenelledClean && !boolish(t.bricked));
  return {
    bricked,
    crenelled,
    emptyObjectCapability: boolish(t.emptyObjectCapability) || print.emptyObjectCapability,
    listNoResources: boolish(t.listNoResources) || print.listNoResources,
    readUnsupported: boolish(t.readUnsupported) || print.readUnsupported,
    toolsStillWork: boolish(t.toolsStillWork) || print.toolsStillWork,
    stdioListChangedWorks: boolish(t.stdioListChangedWorks) || print.stdioListChangedWorks,
    wireCurlOk: boolish(t.wireCurlOk) || print.wireCurlOk,
    assertCapabilityTruthy: boolish(t.assertCapabilityTruthy) || print.assertCapabilityTruthy,
    upstreamReject: boolish(t.upstreamReject) || print.upstreamReject,
    instructionsTruncatedProof:
      boolish(t.instructionsTruncatedProof) || print.instructionsTruncatedProof,
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

export function seedBricked() {
  return {
    seed: "bricked",
    issue: 92729,
    bricked: true,
    crenelled: false,
    emptyObjectCapability: true,
    listNoResources: true,
    readUnsupported: true,
    toolsStillWork: true,
    stdioListChangedWorks: true,
    wireCurlOk: true,
    assertCapabilityTruthy: true,
    upstreamReject: true,
    instructionsTruncatedProof: true,
    toolsFromSameServerWork: true,
    otherStdioServerResourcesListed: true,
    wireHttpStatus: 200,
    assertCapabilityTreatsEmptyObjectTruthy: true,
    upstreamDecidesNoResources: true,
    instructionsTruncatedFrom: 2221,
    instructionsTruncatedTo: 2048,
    failingCapabilities: { resources: {}, tools: {} },
    listMcpResourcesResult:
      "No resources found. MCP servers may still provide tools even if they have no resources.",
    readMcpResourceResult: 'Server "<name>" does not support resources',
    outputText:
      "bricked; empty resources:{} capability is walled over / treated as absent while tools/* still work",
    reporter: MEASURED.reporter
  };
}

export function seedCrenelled() {
  return {
    seed: "crenelled",
    issue: 92729,
    bricked: false,
    crenelled: true,
    crenelCrenelled: true,
    emptyObjectAcknowledged: true,
    listWorks: true,
    readWorks: true,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    bricked: seedBricked(),
    crenelled: seedCrenelled(),
    "empty-object-capability": {
      seed: "empty-object-capability",
      issue: 92729,
      emptyObjectCapability: true,
      failingCapabilities: { resources: {}, tools: {} }
    },
    "list-no-resources": {
      seed: "list-no-resources",
      issue: 92729,
      listNoResources: true,
      listMcpResourcesResult:
        "No resources found. MCP servers may still provide tools even if they have no resources."
    },
    "read-unsupported": {
      seed: "read-unsupported",
      issue: 92729,
      readUnsupported: true,
      readMcpResourceResult: 'Server "<name>" does not support resources'
    },
    "tools-still-work": {
      seed: "tools-still-work",
      issue: 92729,
      toolsStillWork: true,
      toolsFromSameServerWork: true
    },
    "stdio-listChanged-works": {
      seed: "stdio-listChanged-works",
      issue: 92729,
      stdioListChangedWorks: true,
      otherStdioServerResourcesListed: true
    },
    "wire-curl-ok": {
      seed: "wire-curl-ok",
      issue: 92729,
      wireCurlOk: true,
      wireHttpStatus: 200
    },
    "assertCapability-truthy": {
      seed: "assertCapability-truthy",
      issue: 92729,
      assertCapabilityTruthy: true,
      assertCapabilityTreatsEmptyObjectTruthy: true
    },
    "upstream-reject": {
      seed: "upstream-reject",
      issue: 92729,
      upstreamReject: true,
      upstreamDecidesNoResources: true
    },
    "instructions-truncated-proof": {
      seed: "instructions-truncated-proof",
      issue: 92729,
      instructionsTruncatedProof: true,
      instructionsTruncatedFrom: 2221,
      instructionsTruncatedTo: 2048
    },
    cousins: {
      seed: "cousins",
      issue: 92729,
      cousins: true,
      cousinsCiteOnly: [85230, 80300, 88128]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92729,
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
  "empty-object-capability",
  "list-no-resources",
  "read-unsupported",
  "tools-still-work",
  "stdio-listChanged-works",
  "wire-curl-ok",
  "assertCapability-truthy",
  "upstream-reject",
  "instructions-truncated-proof",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "empty-object-capability": (t, c) => boolish(t.emptyObjectCapability) || c.emptyObjectCapability,
  "list-no-resources": (t, c) => boolish(t.listNoResources) || c.listNoResources,
  "read-unsupported": (t, c) => boolish(t.readUnsupported) || c.readUnsupported,
  "tools-still-work": (t, c) => boolish(t.toolsStillWork) || c.toolsStillWork,
  "stdio-listChanged-works": (t, c) => boolish(t.stdioListChangedWorks) || c.stdioListChangedWorks,
  "wire-curl-ok": (t, c) => boolish(t.wireCurlOk) || c.wireCurlOk,
  "assertCapability-truthy": (t, c) => boolish(t.assertCapabilityTruthy) || c.assertCapabilityTruthy,
  "upstream-reject": (t, c) => boolish(t.upstreamReject) || c.upstreamReject,
  "instructions-truncated-proof": (t, c) =>
    boolish(t.instructionsTruncatedProof) || c.instructionsTruncatedProof,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const crenel = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      bricked: true,
      crenelled: false,
      chips: ["cousins", "bricked"],
      crenel
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      bricked: true,
      crenelled: false,
      chips: [seed, "bricked"],
      crenel
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, crenel) && seed !== "bricked" && seed !== "crenelled") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        bricked: true,
        crenelled: false,
        chips: [name, "bricked"],
        crenel
      };
    }
  }

  if (
    seed === "crenelled" ||
    (t.crenelled === true && t.bricked !== true && seed !== "bricked") ||
    (crenel.crenelled && !crenel.bricked && seed !== "bricked")
  ) {
    reasons.push(CHIP_REASONS.crenelled);
    return {
      verdict: "crenelled",
      reasons,
      bricked: false,
      crenelled: true,
      chips: ["crenelled"],
      crenel
    };
  }

  if (t.bricked === true || seed === "bricked" || (crenel.bricked && !crenel.crenelled)) {
    reasons.push(CHIP_REASONS.bricked);
    const chips = ["bricked"];
    if (t.emptyObjectCapability === true || crenel.emptyObjectCapability) {
      chips.push("empty-object-capability");
    }
    if (t.listNoResources === true || crenel.listNoResources) chips.push("list-no-resources");
    if (t.readUnsupported === true || crenel.readUnsupported) chips.push("read-unsupported");
    if (t.toolsStillWork === true || crenel.toolsStillWork) chips.push("tools-still-work");
    if (t.stdioListChangedWorks === true || crenel.stdioListChangedWorks) {
      chips.push("stdio-listChanged-works");
    }
    if (t.wireCurlOk === true || crenel.wireCurlOk) chips.push("wire-curl-ok");
    if (t.assertCapabilityTruthy === true || crenel.assertCapabilityTruthy) {
      chips.push("assertCapability-truthy");
    }
    if (t.upstreamReject === true || crenel.upstreamReject) chips.push("upstream-reject");
    if (t.instructionsTruncatedProof === true || crenel.instructionsTruncatedProof) {
      chips.push("instructions-truncated-proof");
    }
    return {
      verdict: "bricked",
      reasons,
      bricked: true,
      crenelled: false,
      chips: [...new Set(chips)],
      crenel
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, bricked: false, crenelled: true, chips: [seed], crenel };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      bricked: true,
      crenelled: false,
      chips: [seed],
      crenel
    };
  }

  reasons.push(
    "empty probe; idle crenel is bricked — ALARM: empty resources:{} capability is walled over / treated as absent"
  );
  return {
    verdict: "bricked",
    reasons,
    bricked: true,
    crenelled: false,
    chips: ["bricked"],
    crenel
  };
}
