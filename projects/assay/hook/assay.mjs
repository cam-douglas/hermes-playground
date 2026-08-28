/**
 * Assay — furnace / cupel for silent tool-argument corruption.
 * A parsed call is not a hold. Heat the envelope. Weigh delivered
 * arguments against the declared schema and the raw markup. Name the
 * impurity or admit intact.
 *
 * Verdicts: intact | ghost | absorb | mix | prefix | silent | retry | mangled
 * Idle word is intact. Never the product name.
 *
 * Fail-closed on ghost / absorb / mangled.
 * Not Coda (assistant text loss). Not Suture (SSE tear). Not Sigil
 * (thinking signature). Not Reed (MCP registry). Not Wicket (worktree).
 */

export const VERDICTS = Object.freeze([
  "intact",
  "ghost",
  "absorb",
  "mix",
  "prefix",
  "silent",
  "retry",
  "mangled",
]);
export const IDLE_WORD = "intact";
export const ALARM_VERDICTS = Object.freeze([
  "ghost",
  "absorb",
  "mix",
  "prefix",
  "silent",
  "retry",
  "mangled",
]);
export const LINEAR_VERDICTS = Object.freeze(["ghost", "absorb"]);

const BOUNDARY_OPEN = /<parameter\s+name\s*=/i;
const BOUNDARY_NAME = /<parameter\s+name\s*=\s*["']([^"']+)["']/gi;
const XML_TOOL_TAG = /<\/?(?:function_calls|invoke|parameter|tool_use|antml:invoke|antml:parameter)\b/i;
const JSON_KEY = /["'][A-Za-z_][A-Za-z0-9_]*["']\s*:/;
const BARE_KV = /\b[A-Za-z_][A-Za-z0-9_]*\s*:\s*["[{]/;
const ANTML = /\bantml:/i;
const BARE_INVOKE = /<(?:invoke|parameter)\b/i;
const COURT = /(?:^|\s)court(?=\s|<|$)/i;
const UNICODE_ESCAPE = /\\u[0-9A-Fa-f]{4}/;

export function emptyCharge() {
  return {
    session: "",
    tool: "",
    schema: { required: [], optional: [] },
    raw: "",
    delivered: null,
    parseOk: null,
    retryFailed: false,
    retryRaw: "",
    contaminates: false,
    argumentsKind: "",
    strayToken: "",
    droppedNamespace: false,
    history: [],
    fired: false,
    weighed: false,
    admitted: false,
    refused: false,
    held: false,
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "intact-1") {
  return {
    action: "weigh",
    session,
    charge: emptyCharge(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asSchema(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const required = Array.isArray(src.required) ? src.required.map(String) : [];
  const optional = Array.isArray(src.optional) ? src.optional.map(String) : [];
  return { required, optional };
}

export function cloneValue(raw) {
  if (raw == null || typeof raw !== "object") return raw;
  return JSON.parse(JSON.stringify(raw));
}

export function cloneCharge(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyCharge();
  const base = emptyCharge();
  return {
    ...base,
    ...src,
    session: asText(src.session),
    tool: asText(src.tool),
    schema: asSchema(src.schema),
    raw: asText(src.raw),
    delivered: cloneValue(src.delivered),
    parseOk: src.parseOk == null ? null : Boolean(src.parseOk),
    retryFailed: Boolean(src.retryFailed),
    retryRaw: asText(src.retryRaw),
    contaminates: Boolean(src.contaminates),
    argumentsKind: asText(src.argumentsKind),
    strayToken: asText(src.strayToken),
    droppedNamespace: Boolean(src.droppedNamespace),
    history: Array.isArray(src.history) ? src.history.map(asText) : [],
    fired: Boolean(src.fired),
    weighed: Boolean(src.weighed),
    admitted: Boolean(src.admitted),
    refused: Boolean(src.refused),
    held: Boolean(src.held),
    source: asText(src.source),
    issue: src.issue ?? null,
  };
}

export function declaredFields(schema = {}) {
  const next = asSchema(schema);
  return [...next.required, ...next.optional];
}

export function deliveredObject(delivered) {
  if (delivered && typeof delivered === "object" && !Array.isArray(delivered)) return delivered;
  return null;
}

export function stringValues(delivered) {
  const obj = deliveredObject(delivered);
  if (!obj) return [];
  return Object.entries(obj)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => [key, value]);
}

export function missingRequired(schema, delivered) {
  const obj = deliveredObject(delivered);
  return asSchema(schema).required.filter((key) => {
    if (!obj) return true;
    return !Object.prototype.hasOwnProperty.call(obj, key) || obj[key] === undefined;
  });
}

export function emptyRequired(schema, delivered) {
  const obj = deliveredObject(delivered);
  if (!obj) return asSchema(schema).required.slice();
  return asSchema(schema).required.filter((key) => obj[key] === "");
}

export function residueNames(delivered) {
  const names = [];
  for (const [, value] of stringValues(delivered)) {
    BOUNDARY_NAME.lastIndex = 0;
    let match = BOUNDARY_NAME.exec(value);
    while (match) {
      names.push(match[1]);
      match = BOUNDARY_NAME.exec(value);
    }
  }
  return names;
}

export function hasBoundaryGhost(delivered) {
  return stringValues(delivered).some(([, value]) => BOUNDARY_OPEN.test(value));
}

export function isJsonXmlMix(raw = "") {
  const text = asText(raw);
  if (!text) return false;
  const hasJson = JSON_KEY.test(text) || BARE_KV.test(text);
  const hasXml = XML_TOOL_TAG.test(text);
  return hasJson && hasXml;
}

export function looksTruncatedJson(raw = "") {
  const text = asText(raw).trim();
  if (!text.startsWith("{") && !text.startsWith("[")) return false;
  try {
    JSON.parse(text);
    return false;
  } catch {
    const opens = (text.match(/"/g) || []).length;
    return !text.endsWith("}") && !text.endsWith("]") || opens % 2 === 1;
  }
}

export function isIdle(charge = {}) {
  const next = cloneCharge(charge);
  return (
    !next.tool &&
    !next.raw &&
    next.delivered == null &&
    next.parseOk == null &&
    !next.retryFailed &&
    !next.contaminates &&
    !next.argumentsKind &&
    !next.strayToken &&
    !next.droppedNamespace &&
    next.schema.required.length === 0 &&
    next.schema.optional.length === 0
  );
}

export function isGhost(charge = {}) {
  const next = cloneCharge(charge);
  if (next.parseOk !== true) return false;
  if (!hasBoundaryGhost(next.delivered)) return false;
  return missingRequired(next.schema, next.delivered).length === 0;
}

export function isAbsorb(charge = {}) {
  const next = cloneCharge(charge);
  const vanished = declaredFields(next.schema).filter((key) => {
    const obj = deliveredObject(next.delivered);
    if (!obj) return true;
    return !Object.prototype.hasOwnProperty.call(obj, key) || obj[key] === undefined;
  });
  const residue = residueNames(next.delivered);
  if (!vanished.length || !residue.length) return false;
  return residue.some((name) => vanished.includes(name));
}

export function isMix(charge = {}) {
  const next = cloneCharge(charge);
  return isJsonXmlMix(next.raw);
}

export function isPrefix(charge = {}) {
  const next = cloneCharge(charge);
  const raw = next.raw;
  if (next.droppedNamespace || next.strayToken) return true;
  if (COURT.test(raw) && (BARE_INVOKE.test(raw) || XML_TOOL_TAG.test(raw))) return true;
  if (BARE_INVOKE.test(raw) && !ANTML.test(raw) && next.parseOk === false) return true;
  return false;
}

export function isSilent(charge = {}) {
  const next = cloneCharge(charge);
  if (next.parseOk !== true) return false;
  if (isGhost(next) || isAbsorb(next) || isMix(next)) return false;
  return emptyRequired(next.schema, next.delivered).length > 0;
}

export function isRetry(charge = {}) {
  const next = cloneCharge(charge);
  return next.parseOk === false && next.retryFailed === true;
}

export function isMangled(charge = {}) {
  const next = cloneCharge(charge);
  if (next.parseOk === false) return true;
  if (["string", "truncated", "unparseable"].includes(next.argumentsKind)) return true;
  if (typeof next.delivered === "string") return true;
  if (looksTruncatedJson(next.raw) && next.parseOk !== true) return true;
  return false;
}

export function classify(charge = {}) {
  const next = cloneCharge(charge);
  if (isIdle(next)) return "intact";
  if (isAbsorb(next)) return "absorb";
  if (isGhost(next)) return "ghost";
  if (isMix(next)) return "mix";
  if (isPrefix(next)) return "prefix";
  if (isSilent(next)) return "silent";
  if (isRetry(next)) return "retry";
  if (isMangled(next)) return "mangled";
  return "intact";
}

export function impurityOf(charge = {}, verdict = "") {
  const next = cloneCharge(charge);
  const kind = verdict || classify(next);
  if (kind === "ghost") return "boundary tag injected into a parsed string";
  if (kind === "absorb") return "declared field vanished; residue in a host field";
  if (kind === "mix") return "legacy XML tool-use mixed into JSON";
  if (kind === "prefix") return "stray token or dropped antml: namespace";
  if (kind === "silent") return "empty-string required argument dropped";
  if (kind === "retry") return "unparseable; retry also failed";
  if (kind === "mangled") {
    if (next.contaminates) return "malformed leftover contaminates later history";
    if (next.argumentsKind === "string") return "arguments arrived as a JSON string";
    if (UNICODE_ESCAPE.test(next.raw)) return "unicode-escaped arguments failed JSON parse";
    if (next.argumentsKind === "truncated" || looksTruncatedJson(next.raw)) {
      return "truncated function_call.arguments JSON";
    }
    return "unparseable tool-call envelope";
  }
  return "";
}

export function verdictOf(charge = {}) {
  return classify(charge);
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const chargeSrc = src.charge && typeof src.charge === "object" ? src.charge : payload.charge;
  const fromFields = chargeSrc && typeof chargeSrc === "object" ? chargeSrc : src;
  const charge = cloneCharge({
    session: fromFields.session ?? src.session ?? payload.session,
    tool: fromFields.tool ?? src.tool ?? payload.tool,
    schema: fromFields.schema ?? src.schema ?? payload.schema,
    raw: fromFields.raw ?? src.raw ?? payload.raw,
    delivered: fromFields.delivered ?? src.delivered ?? payload.delivered,
    parseOk: fromFields.parseOk ?? src.parseOk ?? payload.parseOk,
    retryFailed: fromFields.retryFailed ?? src.retryFailed ?? payload.retryFailed,
    retryRaw: fromFields.retryRaw ?? src.retryRaw ?? payload.retryRaw,
    contaminates: fromFields.contaminates ?? src.contaminates ?? payload.contaminates,
    argumentsKind: fromFields.argumentsKind ?? src.argumentsKind ?? payload.argumentsKind,
    strayToken: fromFields.strayToken ?? src.strayToken ?? payload.strayToken,
    droppedNamespace: fromFields.droppedNamespace ?? src.droppedNamespace ?? payload.droppedNamespace,
    history: fromFields.history ?? src.history ?? payload.history,
    fired: fromFields.fired ?? src.fired ?? payload.fired,
    weighed: fromFields.weighed ?? src.weighed ?? payload.weighed,
    admitted: fromFields.admitted ?? src.admitted ?? payload.admitted,
    refused: fromFields.refused ?? src.refused ?? payload.refused,
    held: fromFields.held ?? src.held ?? payload.held,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "weigh"),
    session: String(src.session ?? payload.session ?? charge.session ?? ""),
    charge,
    issue: src.issue ?? payload.issue ?? charge.issue ?? null,
    source: src.source ?? payload.source ?? charge.source ?? "",
  };
}

function pack(verdict, charge, action, extras = {}) {
  const next = cloneCharge(charge);
  const missing = missingRequired(next.schema, next.delivered);
  const empty = emptyRequired(next.schema, next.delivered);
  const residue = residueNames(next.delivered);
  return {
    ok: true,
    product: "assay",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    tool: next.tool,
    schema: next.schema,
    raw: next.raw,
    delivered: next.delivered,
    parseOk: next.parseOk,
    retryFailed: next.retryFailed,
    contaminates: next.contaminates,
    argumentsKind: next.argumentsKind,
    strayToken: next.strayToken,
    droppedNamespace: next.droppedNamespace,
    history: next.history,
    fired: Boolean(next.fired),
    weighed: Boolean(next.weighed),
    admitted: Boolean(next.admitted),
    refused: Boolean(next.refused),
    held: Boolean(next.held),
    missing,
    empty,
    residue,
    impurity: impurityOf(next, verdict),
    charge: next,
    ...extras,
  };
}

function seedCharge(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "weigh",
    session,
    issue: issueId,
    source,
    charge: {
      ...emptyCharge(),
      session,
      source,
      issue: issueId,
      tool: extras.tool || "",
      schema: asSchema(extras.schema),
      raw: extras.raw || "",
      delivered: extras.delivered !== undefined ? extras.delivered : null,
      parseOk: extras.parseOk == null ? null : Boolean(extras.parseOk),
      retryFailed: Boolean(extras.retryFailed),
      retryRaw: extras.retryRaw || "",
      contaminates: Boolean(extras.contaminates),
      argumentsKind: extras.argumentsKind || "",
      strayToken: extras.strayToken || "",
      droppedNamespace: Boolean(extras.droppedNamespace),
      history: Array.isArray(extras.history) ? extras.history : [],
    },
  };
}

/** Parse ok; a string holds an adjacent parameter's boundary tag. anthropics/claude-code#84405. */
export function seed84405() {
  return seedCharge(84405, "anthropics/claude-code#84405", {
    tool: "memory_write",
    schema: {
      required: ["title", "body", "tags", "source", "confidence"],
      optional: [],
    },
    raw: [
      "<function_calls>",
      '<invoke name="memory_write">',
      '<parameter name="title">session note</parameter>',
      '<parameter name="body">Persist the turn outcome.',
      '<parameter name="tags">',
      "</parameter>",
      '<parameter name="tags">["mcp","memory"]</parameter>',
      '<parameter name="source">user</parameter>',
      '<parameter name="confidence">high</parameter>',
      "</invoke>",
      "</function_calls>",
    ].join("\n"),
    delivered: {
      title: "session note",
      body: 'Persist the turn outcome.\n<parameter name="tags">',
      tags: ["mcp", "memory"],
      source: "user",
      confidence: "high",
    },
    parseOk: true,
    argumentsKind: "object",
  });
}

/** Mangled close absorbs later blocks; a declared field vanishes. anthropics/claude-code#84362. */
export function seed84362() {
  return seedCharge(84362, "anthropics/claude-code#84362", {
    tool: "memory_write",
    schema: {
      required: ["title", "body"],
      optional: ["tags", "source"],
    },
    raw: [
      '<invoke name="memory_write">',
      '<parameter name="title">note</parameter>',
      '<parameter name="body">Long prose field about the turn.',
      "</parametr>",
      '<parameter name="tags">alpha,beta</parameter>',
      '<parameter name="source">user</parameter>',
      "</invoke>",
    ].join("\n"),
    delivered: {
      title: "note",
      body: [
        "Long prose field about the turn.",
        '<parameter name="tags">alpha,beta</parameter>',
        '<parameter name="source">user</parameter>',
      ].join("\n"),
    },
    parseOk: true,
    argumentsKind: "object",
  });
}

/** Unparseable; retry also failed. anthropics/claude-code#64774. */
export function seed64774() {
  return seedCharge(64774, "anthropics/claude-code#64774", {
    tool: "Edit",
    schema: { required: ["file_path", "old_string", "new_string"] },
    raw: "The model's tool call could not be parsed (retry also failed).",
    retryRaw: "The model's tool call could not be parsed (retry also failed).",
    delivered: null,
    parseOk: false,
    retryFailed: true,
    argumentsKind: "unparseable",
  });
}

/** XML tool-use mixed into a JSON tool call. anthropics/claude-code#49747. */
export function seed49747() {
  return seedCharge(49747, "anthropics/claude-code#49747", {
    tool: "log_outcome",
    schema: {
      required: [
        "user_intent",
        "ai_reasoning",
        "summary_of_changes",
        "files_modified",
        "status",
      ],
      optional: ["tags", "model_name"],
    },
    raw: [
      "log_outcome({",
      '  "user_intent": "ship the furnace",',
      '  "ai_reasoning": "score the envelope",',
      '  "summary_of_changes": "Weighed delivered arguments against schema.</parameter>",',
      '  <parameter name="files_modified">["projects/assay/index.html"]</parameter>',
      '  "status": "completed"',
      "})",
    ].join("\n"),
    delivered: {
      user_intent: "ship the furnace",
      ai_reasoning: "score the envelope",
      summary_of_changes: "Weighed delivered arguments against schema.</parameter>",
      status: "completed",
    },
    parseOk: false,
    argumentsKind: "unparseable",
  });
}

/** Stray "court" token + dropped antml: namespace. #63879 / #70544. */
export function seed63879() {
  return seedCharge(63879, "anthropics/claude-code#63879", {
    session: "63879",
    tool: "Edit",
    schema: { required: ["file_path", "old_string", "new_string"] },
    raw: 'court<invoke name="Edit"><parameter name="file_path">src/app.ts</parameter></invoke>',
    delivered: null,
    parseOk: false,
    strayToken: "court",
    droppedNamespace: true,
    argumentsKind: "unparseable",
  });
}

export function seed70544() {
  return seedCharge(70544, "anthropics/claude-code#70544", {
    session: "70544",
    tool: "Write",
    schema: { required: ["file_path", "content"] },
    raw: '<invoke name="Write"><parameter name="file_path">メモ.md</parameter></invoke>',
    delivered: null,
    parseOk: false,
    droppedNamespace: true,
    argumentsKind: "unparseable",
  });
}

/** Long unicode-escaped arguments fail JSON parse. anthropics/claude-code#69522. */
export function seed69522() {
  return seedCharge(69522, "anthropics/claude-code#69522", {
    tool: "AskUserQuestion",
    schema: { required: ["questions"] },
    raw: '{"questions":[{"question":"\\uC548\\uB155\\uD558\\uC138\\uC694, \\uC774 \\uC7A5\\uBB38\\uC758 \\uB2E8\\uC5B4\\uB97C \\uC120\\uD0DD\\uD574 \\uC8FC\\uC138\\uC694',
    delivered: null,
    parseOk: false,
    argumentsKind: "unparseable",
  });
}

/** Malformed leftover contaminates later history. anthropics/claude-code#70657. */
export function seed70657() {
  return seedCharge(70657, "anthropics/claude-code#70657", {
    tool: "Write",
    schema: { required: ["file_path", "content"] },
    raw: "call Write LayoutEditor.tsx with the new panel markup",
    delivered: null,
    parseOk: false,
    contaminates: true,
    argumentsKind: "unparseable",
    history: [
      "Your tool call was malformed and could not be parsed. Please retry.",
      "Jensen said the alignment researchers already reviewed this.",
      "I need to call Write again after the retry.",
    ],
  });
}

/** Truncated function_call.arguments JSON. openai/codex#19765. */
export function seed19765() {
  return seedCharge(19765, "openai/codex#19765", {
    tool: "shell",
    schema: { required: ["cmd"] },
    raw: '{"cmd":"echo hello',
    delivered: null,
    parseOk: false,
    argumentsKind: "truncated",
  });
}

/** arguments sent as a JSON string, not an object. openai/codex#31517. */
export function seed31517() {
  return seedCharge(31517, "openai/codex#31517", {
    tool: "tool_search",
    schema: { required: ["query"], optional: ["limit"] },
    raw: '{"type":"tool_search_call","arguments":"{\\"query\\":\\"chrome devtools network\\",\\"limit\\":10}"}',
    delivered: '{"query":"chrome devtools network","limit":10}',
    parseOk: false,
    argumentsKind: "string",
  });
}

/** Empty-string required arg; parse still succeeds. No extra issue number. */
export function seedSilent() {
  return seedCharge("silent", "silent", {
    session: "silent",
    issue: null,
    tool: "memory_write",
    schema: { required: ["title", "body"] },
    raw: '<invoke name="memory_write"><parameter name="title">ok</parameter><parameter name="body"></parameter></invoke>',
    delivered: { title: "ok", body: "" },
    parseOk: true,
    argumentsKind: "object",
  });
}

/** Clean envelope. Weighs intact. */
export function seedIntact() {
  return seedCharge("intact", "intact", {
    session: "intact",
    issue: null,
    tool: "memory_write",
    schema: {
      required: ["title", "body", "tags"],
      optional: ["source"],
    },
    raw: [
      "<function_calls>",
      '<antml:invoke name="memory_write">',
      '<antml:parameter name="title">session note</antml:parameter>',
      '<antml:parameter name="body">Persist the turn outcome.</antml:parameter>',
      '<antml:parameter name="tags">["mcp","memory"]</antml:parameter>',
      '<antml:parameter name="source">user</antml:parameter>',
      "</antml:invoke>",
      "</function_calls>",
    ].join("\n"),
    delivered: {
      title: "session note",
      body: "Persist the turn outcome.",
      tags: ["mcp", "memory"],
      source: "user",
    },
    parseOk: true,
    argumentsKind: "object",
  });
}

const SEEDS = {
  84405: seed84405,
  84362: seed84362,
  64774: seed64774,
  49747: seed49747,
  63879: seed63879,
  70544: seed70544,
  69522: seed69522,
  70657: seed70657,
  19765: seed19765,
  31517: seed31517,
  silent: seedSilent,
  intact: seedIntact,
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
  let charge = cloneCharge(action.charge);

  if (action.action === "clear") {
    return pack("intact", emptyCharge(), { ...action, action: "clear" });
  }

  if (action.action === "refuse") {
    charge = { ...charge, refused: true, admitted: false, held: false, weighed: true };
    return pack(classify(charge), charge, action);
  }

  if (action.action === "hold") {
    charge = { ...charge, held: true, weighed: true };
    return pack(classify(charge), charge, action);
  }

  if (action.action === "admit") {
    const verdict = classify(charge);
    charge = {
      ...charge,
      admitted: verdict === "intact",
      refused: verdict !== "intact",
      held: false,
      weighed: true,
    };
    return pack(verdict, charge, action);
  }

  if (action.action === "fire") {
    charge = { ...charge, fired: true, weighed: true };
    return pack(classify(charge), charge, action);
  }

  charge = { ...charge, weighed: true };
  return pack(classify(charge), charge, action);
}
