/**
 * Sigil — signature clinic / seal desk for thinking-block poison.
 * Extended-thinking sessions brick on resume: transcript keeps thinking /
 * redacted_thinking with empty text + retained signature (or empty unsigned
 * thinking). Replay returns 400 "cannot be modified" / "thinking.signature:
 * Field required" and every later turn fails forever.
 * Scan assistant content blocks. Classify poison. Strip or quarantine.
 * Verdicts: valid | hollow | unsigned | wedged | stripped | resume-safe.
 * Idle word is valid. Never the product name.
 * Not Stencil. Not Suture. Not Blot. Not Coda. Not Reed. Not Fathom.
 * Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock.
 * Not a leftover woodworking slider. Not compaction-vault transcript wipe (Ark).
 */

export const VERDICTS = Object.freeze([
  "valid",
  "hollow",
  "unsigned",
  "wedged",
  "stripped",
  "resume-safe",
]);
export const IDLE_WORD = "valid";
export const ALARM_VERDICTS = Object.freeze(["hollow", "unsigned", "wedged"]);
export const PLACEHOLDER =
  "[thinking stripped — hollow or unsigned block would brick resume]";
export const THINKING_TYPES = Object.freeze(["thinking", "redacted_thinking"]);
export const POISON_KINDS = Object.freeze(["hollow", "unsigned", "encrypted", "incompatible"]);

const WEDGE_PATTERNS = [
  /cannot be modified/i,
  /thinking\.signature:\s*Field required/i,
  /signature:\s*Field required/i,
  /Invalid signature/i,
  /invalid_encrypted_content/i,
];

/** Representative hollow signature length from anthropics/claude-code#63147 (0 / 620). */
export const HOLLOW_SIGNATURE_63147 = `sig_63147_hollow_${"E8vQm9lx".repeat(76)}`.slice(0, 620);

export function emptyDesk() {
  return {
    session: "",
    content: [],
    messages: [],
    lines: [],
    errors: [],
    recovered: false,
    stripped: false,
    quarantined: false,
    held: false,
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "valid-1") {
  return {
    action: "mark",
    session,
    desk: emptyDesk(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

export function cloneValue(raw) {
  if (raw == null || typeof raw !== "object") return raw;
  return JSON.parse(JSON.stringify(raw));
}

export function cloneBlock(raw = {}) {
  if (!raw || typeof raw !== "object") return { type: "text", text: "" };
  return cloneValue(raw);
}

export function cloneDesk(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyDesk();
  const base = emptyDesk();
  return {
    ...base,
    ...src,
    session: asText(src.session),
    content: Array.isArray(src.content) ? src.content.map(cloneBlock) : [],
    messages: Array.isArray(src.messages) ? src.messages.map(cloneValue) : [],
    lines: Array.isArray(src.lines) ? src.lines.map((line) => asText(line)) : [],
    errors: Array.isArray(src.errors) ? src.errors.map((err) => asText(err)) : [],
    recovered: Boolean(src.recovered),
    stripped: Boolean(src.stripped),
    quarantined: Boolean(src.quarantined),
    held: Boolean(src.held),
    source: asText(src.source),
    issue: src.issue ?? null,
  };
}

export function isThinkingType(type) {
  return THINKING_TYPES.includes(String(type || ""));
}

export function isNearEmpty(value) {
  return asText(value).trim().length === 0;
}

export function thinkingText(block = {}) {
  if (!block || typeof block !== "object") return "";
  if (block.type === "thinking") return asText(block.thinking ?? block.text ?? "");
  if (block.type === "redacted_thinking") {
    return asText(block.data ?? block.thinking ?? block.text ?? "");
  }
  if (block.type === "reasoning") {
    if (block.encrypted_content != null) return asText(block.encrypted_content);
    if (typeof block.text === "string") return block.text;
    return "";
  }
  return "";
}

export function signatureOf(block = {}) {
  if (!block || typeof block !== "object") return "";
  if (block.signature == null) return "";
  return asText(block.signature);
}

export function isKeepType(block = {}) {
  const type = String(block?.type || "");
  return type === "text" || type === "tool_use" || type === "tool_result";
}

export function inspectBlock(block = {}, index = 0) {
  const type = asText(block?.type);
  const text = thinkingText(block);
  const signature = signatureOf(block);
  const emptyText = isNearEmpty(text);
  const hasSignature = signature.length > 0;
  let kind = "keep";

  if (type === "reasoning") {
    if (block.encrypted_content != null && asText(block.encrypted_content).length > 0) {
      kind = "encrypted";
    } else if (Array.isArray(block.content) && block.content.length > 0) {
      kind = "incompatible";
    } else {
      kind = "valid";
    }
  } else if (isThinkingType(type)) {
    if (emptyText && hasSignature) kind = "hollow";
    else if (!hasSignature) kind = "unsigned";
    else kind = "valid";
  }

  return {
    index,
    type,
    kind,
    textLen: text.length,
    signatureLen: signature.length,
    emptyText,
    hasSignature,
  };
}

export function inspectBlocks(content = []) {
  return (Array.isArray(content) ? content : []).map((block, index) => inspectBlock(block, index));
}

export function poisonOf(findings = []) {
  return (Array.isArray(findings) ? findings : []).filter((row) => POISON_KINDS.includes(row.kind));
}

export function contentOfMessage(message = {}) {
  if (!message || typeof message !== "object") return null;
  if (Array.isArray(message.content)) return message.content;
  if (message.message && Array.isArray(message.message.content)) return message.message.content;
  if (message.payload && Array.isArray(message.payload.content)) return message.payload.content;
  return null;
}

export function isAssistantMessage(message = {}) {
  if (!message || typeof message !== "object") return false;
  const role = message.role || message.message?.role || "";
  const type = message.type || message.payload?.type || "";
  return role === "assistant" || type === "assistant";
}

export function collectContent(desk = {}) {
  const next = cloneDesk(desk);
  if (next.content.length) return next.content;
  for (const message of next.messages) {
    if (!isAssistantMessage(message)) continue;
    const content = contentOfMessage(message);
    if (content && content.length) return content;
  }
  if (next.lines.length) {
    const repaired = parseTranscriptInput(next.lines);
    for (const row of repaired.rows) {
      if (!row.obj || !isAssistantMessage(row.obj)) continue;
      const content = contentOfMessage(row.obj);
      if (content && content.length) return content;
    }
  }
  return [];
}

export function looksWedged(errors = []) {
  return (Array.isArray(errors) ? errors : []).some((err) =>
    WEDGE_PATTERNS.some((pattern) => pattern.test(asText(err))),
  );
}

export function inspectDesk(desk = {}) {
  const next = cloneDesk(desk);
  const content = collectContent(next);
  const findings = inspectBlocks(content);
  const poison = poisonOf(findings);
  return { content, findings, poison };
}

export function stripPoisonDetailed(content = [], options = {}) {
  const source = Array.isArray(content) ? content : [];
  const dropThinking = Boolean(options.dropThinking);
  const kept = [];
  const dropped = [];
  source.forEach((block, index) => {
    const finding = inspectBlock(block, index);
    const wedgedThinking = dropThinking && (isThinkingType(finding.type) || finding.type === "reasoning");
    if (POISON_KINDS.includes(finding.kind) || wedgedThinking) {
      dropped.push(wedgedThinking && finding.kind === "valid" ? { ...finding, kind: "wedged" } : finding);
      return;
    }
    kept.push(cloneBlock(block));
  });
  const insertedPlaceholder = kept.length === 0 && dropped.length > 0;
  if (insertedPlaceholder) {
    kept.push({ type: "text", text: PLACEHOLDER });
  }
  return { content: kept, dropped, insertedPlaceholder };
}

export function stripPoison(content = [], options = {}) {
  return stripPoisonDetailed(content, options).content;
}

function parseLine(line, index) {
  const text = asText(line);
  if (!text.trim()) {
    return { index, text, obj: null, parseable: false };
  }
  try {
    return { index, text, obj: JSON.parse(text), parseable: true };
  } catch {
    return { index, text, obj: null, parseable: false };
  }
}

export function parseTranscriptInput(input) {
  if (typeof input === "string") {
    const rows = input
      .split(/\r?\n/)
      .map((line, index) => parseLine(line, index))
      .filter((row) => row.text.trim().length > 0);
    return { rows, kind: "jsonl" };
  }
  if (!Array.isArray(input)) return { rows: [], kind: "empty" };
  if (
    input.length &&
    typeof input[0] === "object" &&
    input[0] !== null &&
    !Array.isArray(input[0]) &&
    (input[0].role || input[0].type || input[0].message || input[0].content)
  ) {
    return {
      rows: input.map((obj, index) => ({
        index,
        text: JSON.stringify(obj),
        obj: cloneValue(obj),
        parseable: true,
      })),
      kind: "messages",
    };
  }
  return {
    rows: input.map((line, index) => parseLine(line, index)),
    kind: "lines",
  };
}

function writeContent(message, content) {
  const next = cloneValue(message);
  if (Array.isArray(next.content)) {
    next.content = content;
    return next;
  }
  if (next.message && Array.isArray(next.message.content)) {
    next.message.content = content;
    return next;
  }
  if (next.payload && Array.isArray(next.payload.content)) {
    next.payload.content = content;
    return next;
  }
  next.content = content;
  return next;
}

export function repairTranscript(input) {
  const parsed = parseTranscriptInput(input);
  const ledger = [];
  const messages = [];
  const lines = [];

  for (const row of parsed.rows) {
    if (!row.parseable || !row.obj) {
      lines.push(row.text);
      continue;
    }
    if (!isAssistantMessage(row.obj)) {
      messages.push(cloneValue(row.obj));
      lines.push(JSON.stringify(row.obj));
      continue;
    }
    const content = contentOfMessage(row.obj);
    if (!content) {
      messages.push(cloneValue(row.obj));
      lines.push(JSON.stringify(row.obj));
      continue;
    }
    const detailed = stripPoisonDetailed(content);
    const repaired = writeContent(row.obj, detailed.content);
    messages.push(repaired);
    lines.push(JSON.stringify(repaired));
    for (const drop of detailed.dropped) {
      ledger.push({
        line: row.index,
        index: drop.index,
        kind: drop.kind,
        type: drop.type,
        textLen: drop.textLen,
        signatureLen: drop.signatureLen,
      });
    }
    if (detailed.insertedPlaceholder) {
      ledger.push({
        line: row.index,
        index: -1,
        kind: "placeholder",
        type: "text",
        textLen: PLACEHOLDER.length,
        signatureLen: 0,
      });
    }
  }

  return {
    lines,
    messages,
    ledger,
    dropped: ledger.filter((row) => row.kind !== "placeholder").length,
    repaired: ledger.length > 0,
  };
}

function poisonKindOf(poison = []) {
  if (poison.some((row) => row.kind === "hollow" || row.kind === "encrypted")) return "hollow";
  if (poison.some((row) => row.kind === "unsigned" || row.kind === "incompatible")) return "unsigned";
  return "";
}

export function verdictOf(desk = {}) {
  const next = cloneDesk(desk);
  if (next.quarantined) return "resume-safe";
  if (next.stripped) return "stripped";
  if (looksWedged(next.errors)) return "wedged";
  const { findings, poison } = inspectDesk(next);
  void findings;
  const kind = poisonKindOf(poison);
  if (kind === "hollow") return "hollow";
  if (kind === "unsigned") return "unsigned";
  return "valid";
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const deskSrc = src.desk && typeof src.desk === "object" ? src.desk : payload.desk;
  const fromFields = deskSrc && typeof deskSrc === "object" ? deskSrc : src;
  const desk = cloneDesk({
    session: fromFields.session ?? src.session ?? payload.session,
    content: fromFields.content ?? src.content ?? payload.content,
    messages: fromFields.messages ?? src.messages ?? payload.messages,
    lines: fromFields.lines ?? src.lines ?? payload.lines,
    errors: fromFields.errors ?? src.errors ?? payload.errors,
    recovered: fromFields.recovered ?? src.recovered ?? payload.recovered,
    stripped: fromFields.stripped ?? src.stripped ?? payload.stripped,
    quarantined: fromFields.quarantined ?? src.quarantined ?? payload.quarantined,
    held: fromFields.held ?? src.held ?? payload.held,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "mark"),
    session: String(src.session ?? payload.session ?? desk.session ?? ""),
    desk,
    issue: src.issue ?? payload.issue ?? desk.issue ?? null,
    source: src.source ?? payload.source ?? desk.source ?? "",
  };
}

function applyStrip(desk, quarantined = false) {
  const inspected = inspectDesk(desk);
  const detailed = stripPoisonDetailed(inspected.content, {
    dropThinking: looksWedged(desk.errors),
  });
  return {
    desk: {
      ...desk,
      content: detailed.content,
      errors: [],
      recovered: true,
      stripped: !quarantined,
      quarantined,
      held: false,
    },
    detailed,
  };
}

function pack(verdict, desk, action, extras = {}) {
  const next = cloneDesk(desk);
  const inspected = inspectDesk(next);
  const poison = extras.poison || inspected.poison;
  const findings = extras.findings || inspected.findings;
  const content = extras.content || inspected.content;
  const dropped = extras.dropped || [];
  const replayPoison = poisonOf(inspectBlocks(content));
  const resumeSafe = replayPoison.length === 0 && (verdict === "resume-safe" || verdict === "stripped" || verdict === "valid");
  return {
    ok: true,
    product: "sigil",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    content,
    findings,
    poison,
    dropped,
    errors: next.errors,
    recovered: Boolean(next.recovered),
    stripped: Boolean(next.stripped),
    quarantined: Boolean(next.quarantined),
    held: Boolean(next.held),
    resumeSafe,
    placeholder: content.some((block) => block && block.type === "text" && block.text === PLACEHOLDER),
    desk: next,
  };
}

function seedDesk(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  return {
    action: extras.action || "mark",
    session,
    issue,
    source,
    desk: {
      session,
      content: Array.isArray(extras.content) ? extras.content.map(cloneBlock) : [],
      messages: Array.isArray(extras.messages) ? extras.messages.map(cloneValue) : [],
      lines: Array.isArray(extras.lines) ? extras.lines.map((line) => asText(line)) : [],
      errors: Array.isArray(extras.errors) ? extras.errors.map((err) => asText(err)) : [],
      recovered: Boolean(extras.recovered),
      stripped: Boolean(extras.stripped),
      quarantined: Boolean(extras.quarantined),
      held: Boolean(extras.held),
      source,
      issue,
    },
  };
}

/** Hollow thinking: empty text, retained signature. anthropics/claude-code#63147 (PRIMARY). */
export function seed63147() {
  return seedDesk(63147, "anthropics/claude-code#63147", {
    session: "63147",
    content: [
      { type: "thinking", thinking: "", signature: HOLLOW_SIGNATURE_63147 },
      { type: "text", text: "Inspecting the stream handler." },
      { type: "tool_use", id: "tu1", name: "Read", input: { path: "handler.ts" } },
    ],
  });
}

/** Interleaved thinking + subagents; unrecoverable 400. anthropics/claude-code#63463. */
export function seed63463() {
  return seedDesk(63463, "anthropics/claude-code#63463", {
    errors: [
      "API Error: 400 messages.7.content.4: `thinking` or `redacted_thinking` blocks in the latest assistant message cannot be modified. These blocks must remain as they were in the original response.",
    ],
    content: [
      { type: "thinking", thinking: "", signature: `${HOLLOW_SIGNATURE_63147}a` },
      { type: "thinking", thinking: "", signature: `${HOLLOW_SIGNATURE_63147}b` },
      { type: "text", text: "Spawning a background sub-agent." },
      { type: "tool_use", id: "tu-agent", name: "Task", input: { prompt: "resume from transcript" } },
    ],
  });
}

/** Signed thinking replayed modified; session permanently wedged. anthropics/claude-code#63335. */
export function seed63335() {
  return seedDesk(63335, "anthropics/claude-code#63335", {
    errors: [
      "API Error: 400 messages.19.content.21: `thinking` or `redacted_thinking` blocks in the latest assistant message cannot be modified. These blocks must remain as they were in the original response.",
    ],
    content: [
      { type: "thinking", thinking: "modified after original sign", signature: HOLLOW_SIGNATURE_63147 },
      { type: "text", text: "Background task completed." },
      { type: "tool_use", id: "tu-bg", name: "Bash", input: { command: "sleep 1", run_in_background: true } },
    ],
  });
}

/** Empty unsigned thinking; signature Field required. anthropics/claude-code#68768. */
export function seed68768() {
  return seedDesk(68768, "anthropics/claude-code#68768", {
    content: [
      { type: "thinking", thinking: "", signature: "" },
      { type: "text", text: "Running the permission-mode switch." },
      { type: "tool_use", id: "tu1", name: "Bash", input: { command: "echo mode" } },
    ],
  });
}

/** Invalid / modified thinking signature; long session 400 loop. anthropics/claude-code#10199. */
export function seed10199() {
  return seedDesk(10199, "anthropics/claude-code#10199", {
    errors: [
      'API Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"messages.71.content.8: `thinking` or `redacted_thinking` blocks in the latest assistant message cannot be modified. These blocks must remain as they were in the original response."}}',
    ],
    content: [
      { type: "thinking", thinking: "", signature: HOLLOW_SIGNATURE_63147 },
      { type: "text", text: "Continuing the long session." },
    ],
  });
}

/** Persisted encrypted reasoning bricks resume. openai/codex#25290 (cousin). */
export function seed25290() {
  return seedDesk(25290, "openai/codex#25290", {
    errors: [
      "invalid_encrypted_content: The encrypted content gAAA... could not be verified. Reason: Encrypted content could not be decrypted or parsed.",
    ],
    content: [
      { type: "reasoning", encrypted_content: "gAAA.invalid.encrypted.reasoning" },
      { type: "text", text: "Local messages still present." },
    ],
  });
}

/** Incompatible reasoning items in rollout JSONL. openai/codex#36551 (cousin). */
export function seed36551() {
  return seedDesk(36551, "openai/codex#36551", {
    content: [
      {
        type: "reasoning",
        content: [{ type: "reasoning_text", text: "provider-written reasoning" }],
      },
      { type: "text", text: "Official API rejects reasoning.content arrays." },
    ],
  });
}

const SEEDS = {
  63147: seed63147,
  63463: seed63463,
  63335: seed63335,
  68768: seed68768,
  10199: seed10199,
  25290: seed25290,
  36551: seed36551,
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
  let desk = cloneDesk(action.desk);

  if (action.action === "clear") {
    return pack("valid", emptyDesk(), { ...action, action: "clear" });
  }

  if (action.action === "strip") {
    const applied = applyStrip(desk, false);
    desk = applied.desk;
    return pack(verdictOf(desk), desk, action, {
      content: applied.detailed.content,
      dropped: applied.detailed.dropped,
      poison: applied.detailed.dropped,
      findings: inspectBlocks(applied.detailed.content),
    });
  }

  if (action.action === "quarantine") {
    const applied = applyStrip(desk, true);
    desk = applied.desk;
    return pack(verdictOf(desk), desk, action, {
      content: applied.detailed.content,
      dropped: applied.detailed.dropped,
      poison: applied.detailed.dropped,
      findings: inspectBlocks(applied.detailed.content),
    });
  }

  if (action.action === "hold") {
    desk = { ...desk, held: true };
    return pack(verdictOf(desk), desk, action);
  }

  return pack(verdictOf(desk), desk, action);
}
