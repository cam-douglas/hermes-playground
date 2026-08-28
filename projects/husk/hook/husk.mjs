/**
 * Husk — threshing desk / grain floor for hollow headless success envelopes.
 * A husk is not a hold. Score the envelope. Name the class or admit kernel.
 *
 * Claude Code (and Agent SDK / Actions) reports subtype:"success",
 * is_error:false, exit 0, empty result, and num_turns:0 when the model
 * never ran. Score that envelope. Do not treat exit 0 as a hold.
 *
 * Verdicts: kernel | husked | aborted | denied | nested | contended | zeroed | ghosted
 * Idle word is kernel. Never the product name. When hollow: husked.
 *
 * NOT Knock (fail-loud stalled permission grants).
 * NOT Coda (silent last-text-block loss after the model DID run).
 * NOT Assay (tool-arg corruption on a real call).
 * NOT Suture (stream tear mid-turn).
 * NOT Reed (MCP register/contact matrix).
 * NOT Snib / Veto / Wicket / Sigil / Stencil / Blot / Fathom / Hasp /
 * Parity / Reveille / Quench / Scrim.
 */

export const VERDICTS = Object.freeze([
  "kernel",
  "husked",
  "aborted",
  "denied",
  "nested",
  "contended",
  "zeroed",
  "ghosted",
]);

export const IDLE_WORD = "kernel";

export const FAIL_CLOSED = Object.freeze([
  "husked",
  "aborted",
  "denied",
  "nested",
  "contended",
  "zeroed",
  "ghosted",
]);

export const ALARM_VERDICTS = FAIL_CLOSED;

const LOCAL_STDERR = /<local-command-stderr>/i;
const PERMISSION_DENIAL_TEXT =
  /permission check failed|requires approval|permission denial(?!s)|shell command permission/i;
const PREAMBLE_BOOM =
  /probe stderr boom|stderr boom|failing preamble|preamble.*fail|!\s*`[^`]*`[\s\S]{0,80}(exit\s+[1-9]|non-zero)/i;
const NESTED_P = /nested\s+`?claude\s+-p|claude\s+-p[\s\S]{0,40}parent|save-session\.sh/i;
const PARENT_SESSION = /parent (interactive )?session|while any parent|parent process is alive/i;
const SINGLE_FLIGHT = /single-flight|global (single[- ]flight )?lock|process-lifetime\s*\/\s*global/i;
const CLAUDECODE_HINT = /\bCLAUDECODE\b|claude.?code context/i;
const GHA_HINT = /github.?actions|\bGHA\b|ACTIONS_|max oauth|oauth path/i;

function asText(value) {
  return value == null ? "" : String(value);
}

function asCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

export function emptyEnvelope() {
  return {
    type: "",
    subtype: "",
    is_error: null,
    num_turns: null,
    result: undefined,
    duration_api_ms: null,
    duration_ms: null,
    usage: null,
    permission_denials: undefined,
    errors: undefined,
    session_id: "",
    uuid: "",
  };
}

export function emptyContext() {
  return {
    claudecode: false,
    nested: false,
    parentSession: false,
    lock: false,
    gha: false,
    oauth: false,
    streamed: false,
    verbose: false,
    source: "",
    issue: null,
    session: "",
  };
}

export function cloneValue(raw) {
  if (raw == null || typeof raw !== "object") return raw;
  try {
    return JSON.parse(JSON.stringify(raw));
  } catch {
    return raw;
  }
}

function flattenText(value, into = []) {
  if (value == null) return into;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    into.push(String(value));
    return into;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenText(item, into);
    return into;
  }
  if (typeof value === "object") {
    if (value.text != null) flattenText(value.text, into);
    if (value.content != null) flattenText(value.content, into);
    if (value.message != null) flattenText(value.message, into);
    if (value.result != null && typeof value.result === "string") flattenText(value.result, into);
    if (value.error != null) flattenText(value.error, into);
    if (value.stderr != null) flattenText(value.stderr, into);
  }
  return into;
}

export function textOf(value) {
  return flattenText(value).join("\n");
}

export function parseJsonish(raw) {
  if (raw == null) return null;
  if (typeof raw === "object") return raw;
  const text = String(raw).trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function parseNdjson(raw) {
  const text = asText(raw).trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const events = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parsed = parseJsonish(trimmed);
    if (parsed) events.push(parsed);
    else events.push({ type: "text", text: trimmed });
  }
  return events;
}

export function normalizeStream(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === "string" ? parseJsonish(item) || { type: "text", text: item } : item))
      .filter((item) => item && typeof item === "object");
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    const asJson = parseJsonish(trimmed);
    if (Array.isArray(asJson)) return normalizeStream(asJson);
    if (asJson && typeof asJson === "object" && !trimmed.includes("\n")) return [asJson];
    return parseNdjson(trimmed);
  }
  if (typeof raw === "object") return [raw];
  return [];
}

function looksLikeResult(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  if (obj.type === "result") return true;
  if (obj.subtype === "success" || obj.subtype === "error_during_execution") return true;
  if ("num_turns" in obj && ("result" in obj || "is_error" in obj || "subtype" in obj)) return true;
  return false;
}

export function extractResult(events = []) {
  const list = Array.isArray(events) ? events : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (looksLikeResult(list[i])) return list[i];
  }
  return null;
}

export function usageOf(raw) {
  const usage = raw && typeof raw === "object" ? raw : null;
  if (!usage) {
    return { present: false, total: 0, allZero: false, input: 0, output: 0 };
  }
  const input = asCount(usage.input_tokens ?? usage.inputTokens);
  const output = asCount(usage.output_tokens ?? usage.outputTokens);
  const cacheCreate = asCount(usage.cache_creation_input_tokens ?? usage.cacheCreationInputTokens);
  const cacheRead = asCount(usage.cache_read_input_tokens ?? usage.cacheReadInputTokens);
  const present = [
    "input_tokens",
    "output_tokens",
    "inputTokens",
    "outputTokens",
    "cache_creation_input_tokens",
    "cache_read_input_tokens",
  ].some((key) => key in usage);
  const total = input + output + cacheCreate + cacheRead;
  return { present, total, allZero: present && total === 0, input, output };
}

export function isEmptyResult(result) {
  if (result == null) return true;
  if (result === "") return true;
  if (typeof result === "string" && result.trim() === "") return true;
  if (Array.isArray(result) && result.length === 0) return true;
  return false;
}

export function isSuccessShaped(envelope = {}) {
  if (envelope.subtype === "success") return true;
  if (envelope.is_error === false) return true;
  return false;
}

export function isHollow(envelope = {}) {
  const turns = envelope.num_turns;
  return isSuccessShaped(envelope) && asCount(turns) === 0 && turns != null && isEmptyResult(envelope.result);
}

function readContext(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : {};
  const base = emptyContext();
  return {
    ...base,
    claudecode: Boolean(src.claudecode ?? src.CLAUDECODE),
    nested: Boolean(src.nested ?? src.nestedP),
    parentSession: Boolean(src.parentSession ?? src.parent_session ?? src.parent),
    lock: Boolean(src.lock ?? src.singleFlight ?? src.contended),
    gha: Boolean(src.gha ?? src.githubActions ?? src.actions),
    oauth: Boolean(src.oauth ?? src.maxOauth),
    streamed: Boolean(src.streamed ?? src.verbose),
    verbose: Boolean(src.verbose),
    source: asText(src.source),
    issue: asIssue(src.issue),
    session: asText(src.session),
  };
}

export function readPayload(input) {
  if (input == null || input === "") {
    return { envelope: emptyEnvelope(), stream: [], context: emptyContext(), rawText: "" };
  }

  let value = input;
  let rawText = "";
  if (typeof input === "string") {
    rawText = input;
    const parsed = parseJsonish(input);
    if (parsed) value = parsed;
    else {
      const events = parseNdjson(input);
      value = { stream: events, envelope: extractResult(events) || emptyEnvelope() };
    }
  }

  if (Array.isArray(value)) {
    const stream = normalizeStream(value);
    return {
      envelope: extractResult(stream) || emptyEnvelope(),
      stream,
      context: emptyContext(),
      rawText,
    };
  }

  if (!value || typeof value !== "object") {
    return { envelope: emptyEnvelope(), stream: [], context: emptyContext(), rawText };
  }

  const stream = normalizeStream(value.stream ?? value.lines ?? value.events ?? value.ndjson);
  const context = readContext(value.context || value);
  const envelopeSource =
    value.envelope ||
    value.resultEnvelope ||
    (looksLikeResult(value) ? value : extractResult(stream));

  return {
    envelope: envelopeSource && typeof envelopeSource === "object" ? envelopeSource : emptyEnvelope(),
    stream,
    context,
    rawText: rawText || asText(value.rawText),
  };
}

export function collectSignals(input) {
  const { envelope, stream, context, rawText } = readPayload(input);
  const usage = usageOf(envelope.usage);
  const streamText = textOf(stream);
  const envelopeText = textOf({
    result: envelope.result,
    errors: envelope.errors,
    message: envelope.message,
    stderr: envelope.stderr,
  });
  const blob = [streamText, envelopeText, context.source, asText(context.issue)].join("\n");

  const streamTypes = stream.map((event) => asText(event.type || event.subtype));
  const hasUserEvent = stream.some((event) => {
    const type = asText(event.type);
    return type === "user" || event.role === "user";
  });
  const hasAssistant = stream.some((event) => {
    const type = asText(event.type);
    return type === "assistant" || event.role === "assistant";
  });

  const denials = envelope.permission_denials;
  const denialsPresent = Array.isArray(denials);
  const emptyPermissionDenials = denialsPresent && denials.length === 0;

  const localCommandStderr = LOCAL_STDERR.test(blob);
  const permissionDenialText = PERMISSION_DENIAL_TEXT.test(blob);
  const preambleBoom = PREAMBLE_BOOM.test(blob);
  const nestedP = context.nested || NESTED_P.test(blob);
  const parentSession = context.parentSession || PARENT_SESSION.test(blob);
  const singleFlight = context.lock || SINGLE_FLIGHT.test(blob);
  const claudeCodeContext = context.claudecode || CLAUDECODE_HINT.test(blob);
  const gha = context.gha || context.oauth || GHA_HINT.test(blob);

  const numTurns = envelope.num_turns == null ? null : asCount(envelope.num_turns);
  const durationApiMs = envelope.duration_api_ms == null ? null : asCount(envelope.duration_api_ms);
  const hollow = isHollow(envelope);
  const successShaped = isSuccessShaped(envelope);

  return {
    subtype: asText(envelope.subtype),
    type: asText(envelope.type),
    subtypeSuccess: envelope.subtype === "success",
    isError: envelope.is_error,
    isErrorFalse: envelope.is_error === false,
    successShaped,
    numTurns,
    numTurnsZero: numTurns === 0,
    numTurnsGe1: numTurns != null && numTurns >= 1,
    emptyResult: isEmptyResult(envelope.result),
    result: envelope.result,
    durationApiMs,
    durationApiZero: durationApiMs === 0,
    durationApiPositive: durationApiMs != null && durationApiMs > 0,
    usage,
    zeroUsage: usage.allZero,
    realUsage: usage.present && usage.total > 0,
    permissionDenials: denialsPresent ? cloneValue(denials) : undefined,
    emptyPermissionDenials,
    typedDenialsMissing: !denialsPresent,
    localCommandStderr,
    permissionDenialText,
    preambleBoom,
    nestedP,
    parentSession,
    singleFlight,
    claudeCodeContext,
    gha,
    streamCount: stream.length,
    streamTypes,
    hasUserEvent,
    hasAssistant,
    streamProvided: stream.length > 0 || context.streamed || context.verbose,
    hollow,
    issue: asIssue(envelope.issue ?? context.issue),
    session: asText(envelope.session_id || envelope.session || context.session),
    source: context.source,
    envelope,
    stream,
    context,
  };
}

function reason(text, extra = {}) {
  return extra && Object.keys(extra).length ? { text, ...extra } : text;
}

export function classify(signals = {}) {
  if (signals.numTurnsGe1 && (signals.realUsage || signals.durationApiPositive || !signals.emptyResult)) {
    return "kernel";
  }
  if (signals.numTurnsGe1 && !signals.emptyResult) return "kernel";

  const hollow = Boolean(signals.hollow || (signals.successShaped && signals.numTurnsZero && signals.emptyResult));

  if (hollow && (signals.localCommandStderr || signals.permissionDenialText) && (signals.emptyPermissionDenials || signals.typedDenialsMissing)) {
    return "denied";
  }
  if (hollow && signals.preambleBoom) return "aborted";
  if (hollow && (signals.nestedP || (signals.claudeCodeContext && (signals.parentSession || signals.singleFlight)))) {
    return "nested";
  }
  if (hollow && (signals.singleFlight || (signals.parentSession && !signals.nestedP))) {
    return "contended";
  }
  if (hollow && signals.gha && signals.zeroUsage && (signals.durationApiZero || signals.durationApiMs == null)) {
    return "zeroed";
  }
  if (hollow && signals.streamProvided && !signals.hasUserEvent && !signals.hasAssistant && !signals.localCommandStderr && !signals.preambleBoom && !signals.gha) {
    return "ghosted";
  }
  if (hollow) return "husked";
  return "kernel";
}

export function reasonsOf(verdict, signals = {}) {
  const reasons = [];
  if (verdict === "kernel") {
    if (signals.numTurnsGe1) reasons.push("num_turns >= 1 — a real turn ran (seed present).");
    if (!signals.emptyResult) reasons.push("result is non-empty.");
    if (signals.realUsage) reasons.push(`usage is live (${signals.usage?.total || 0} tokens).`);
    if (signals.durationApiPositive) reasons.push(`duration_api_ms=${signals.durationApiMs}.`);
    if (!reasons.length) reasons.push("Admit kernel. No hollow success envelope to thresh.");
    return reasons;
  }

  if (signals.successShaped) {
    reasons.push(
      `success-shaped envelope: subtype=${signals.subtype || "—"} is_error=${signals.isError}`,
    );
  }
  if (signals.numTurnsZero) reasons.push("num_turns=0 — the model never ran.");
  if (signals.emptyResult) reasons.push("result is empty or missing.");
  if (signals.durationApiZero) reasons.push("duration_api_ms=0 — no API call.");
  if (signals.zeroUsage) reasons.push("usage is all zeros.");
  if (signals.emptyPermissionDenials) reasons.push("typed permission_denials=[] is empty.");

  if (verdict === "denied") {
    if (signals.localCommandStderr) {
      reasons.push("untyped <local-command-stderr> in a synthetic user message.");
    }
    if (signals.permissionDenialText) {
      reasons.push("permission-denial prose in the side-channel, not in typed permission_denials.");
    }
    reasons.push("SDKResultSuccess with no typed denial — the only signal is the untyped channel.");
  }
  if (verdict === "aborted") {
    reasons.push("failing !-preamble / probe stderr boom aborted pre-turn.");
    reasons.push("only visible with stream-json --verbose as a user event.");
  }
  if (verdict === "nested") {
    reasons.push("nested claude -p while a parent interactive session is alive.");
    if (signals.claudeCodeContext) reasons.push("CLAUDECODE / parent-session context implied.");
    if (signals.singleFlight) reasons.push("global single-flight lock — hooks cannot get a turn.");
  }
  if (verdict === "contended") {
    reasons.push("process-lifetime / global single-flight lock contended the headless call.");
    if (signals.parentSession) reasons.push("a parent session is still alive.");
  }
  if (verdict === "ghosted") {
    reasons.push("stream-json has no user event and no assistant — the abort left no typed trace.");
  }
  if (verdict === "zeroed") {
    reasons.push("GHA / Max OAuth corroboration of the same hollow success+num_turns:0 shape.");
  }
  if (verdict === "husked") {
    reasons.push("hollow headless success. A husk is not a hold.");
  }
  return reasons;
}

export function score(input) {
  const signals = collectSignals(input);
  const idle =
    !signals.successShaped &&
    signals.numTurns == null &&
    signals.emptyResult &&
    !signals.streamProvided &&
    !signals.preambleBoom &&
    !signals.localCommandStderr &&
    !signals.nestedP &&
    !signals.singleFlight &&
    !signals.gha;

  const verdict = idle ? "kernel" : classify(signals);
  const reasons = reasonsOf(verdict, signals);
  return {
    ok: true,
    product: "husk",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: FAIL_CLOSED.includes(verdict),
    failClosed: FAIL_CLOSED.includes(verdict),
    reasons,
    signals: {
      subtypeSuccess: signals.subtypeSuccess,
      isErrorFalse: signals.isErrorFalse,
      successShaped: signals.successShaped,
      numTurns: signals.numTurns,
      numTurnsZero: signals.numTurnsZero,
      numTurnsGe1: signals.numTurnsGe1,
      emptyResult: signals.emptyResult,
      durationApiMs: signals.durationApiMs,
      durationApiZero: signals.durationApiZero,
      durationApiPositive: signals.durationApiPositive,
      zeroUsage: signals.zeroUsage,
      realUsage: signals.realUsage,
      emptyPermissionDenials: signals.emptyPermissionDenials,
      localCommandStderr: signals.localCommandStderr,
      permissionDenialText: signals.permissionDenialText,
      preambleBoom: signals.preambleBoom,
      nestedP: signals.nestedP,
      parentSession: signals.parentSession,
      singleFlight: signals.singleFlight,
      claudeCodeContext: signals.claudeCodeContext,
      gha: signals.gha,
      streamCount: signals.streamCount,
      hasUserEvent: signals.hasUserEvent,
      hasAssistant: signals.hasAssistant,
      streamProvided: signals.streamProvided,
      hollow: signals.hollow,
      issue: signals.issue,
      session: signals.session,
      source: signals.source,
    },
    issue: signals.issue,
    session: signals.session,
    source: signals.source,
    envelope: signals.envelope,
    stream: signals.stream,
  };
}

function hollowSuccess(extra = {}) {
  return {
    type: "result",
    subtype: "success",
    is_error: false,
    num_turns: 0,
    result: "",
    duration_api_ms: 0,
    duration_ms: 48,
    usage: {
      input_tokens: 0,
      output_tokens: 0,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    permission_denials: [],
    errors: null,
    ...extra,
  };
}

/** #87159 — failing !-preamble silently aborts pre-turn. Confirmed 2.1.234. */
export function seed87159() {
  const envelope = hollowSuccess({
    session_id: "husk-87159",
    uuid: "87159-preamble",
  });
  return {
    issue: 87159,
    source: "anthropics/claude-code#87159",
    session: "87159",
    envelope,
    stream: [
      { type: "system", subtype: "init", cwd: "/probe" },
      {
        type: "user",
        message: {
          role: "user",
          content: [{ type: "text", text: "probe stderr boom" }],
        },
      },
      envelope,
    ],
    context: { issue: 87159, source: "anthropics/claude-code#87159", verbose: true },
  };
}

/** #80223 — denied skill-frontmatter shell substitution. Typed denials empty. */
export function seed80223() {
  const envelope = hollowSuccess({
    session_id: "husk-80223",
    uuid: "80223-denied",
  });
  return {
    issue: 80223,
    source: "anthropics/claude-code#80223",
    session: "80223",
    envelope,
    stream: [
      { type: "system", subtype: "init" },
      {
        type: "user",
        message: {
          role: "user",
          content: [
            {
              type: "text",
              text: '<local-command-stderr>Error: Shell command permission check failed for pattern "!`sh ./hello.sh`": This command requires approval</local-command-stderr>',
            },
          ],
        },
      },
      envelope,
    ],
    context: { issue: 80223, source: "anthropics/claude-code#80223", verbose: true },
  };
}

/** #2197 — nested claude -p while any parent interactive session is alive. */
export function seed2197() {
  const envelope = hollowSuccess({
    session_id: "husk-2197",
    uuid: "2197-nested",
  });
  return {
    issue: 2197,
    source: "anthropics/claude-plugins-official#2197",
    session: "2197",
    envelope,
    stream: [
      { type: "system", subtype: "init", model: "haiku" },
      {
        type: "text",
        text: "nested claude -p while parent interactive session is alive; CLAUDECODE set; global single-flight lock",
      },
      envelope,
    ],
    context: {
      issue: 2197,
      source: "anthropics/claude-plugins-official#2197",
      claudecode: true,
      nested: true,
      parentSession: true,
      lock: true,
    },
  };
}

export function seedKernel() {
  return {
    issue: null,
    source: "kernel",
    session: "kernel",
    envelope: {
      type: "result",
      subtype: "success",
      is_error: false,
      num_turns: 1,
      result: "The skill ran. Injected output quoted the failing preamble and continued.",
      duration_api_ms: 842,
      duration_ms: 1104,
      usage: {
        input_tokens: 312,
        output_tokens: 64,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 12,
      },
      permission_denials: [],
      errors: null,
      session_id: "husk-kernel",
    },
    stream: [
      { type: "system", subtype: "init" },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: "seed present" }] } },
    ],
    context: { source: "kernel" },
  };
}

export function seedHusked() {
  const envelope = hollowSuccess({ session_id: "husk-plain", uuid: "plain-husk" });
  return {
    issue: null,
    source: "husked",
    session: "husked",
    envelope,
    stream: [],
    context: { source: "husked" },
  };
}

export function seedZeroed() {
  const envelope = hollowSuccess({ session_id: "husk-gha", uuid: "gha-oauth" });
  return {
    issue: null,
    source: "gha-oauth",
    session: "zeroed",
    envelope,
    stream: [{ type: "text", text: "GHA / Max OAuth path; github-actions success+num_turns:0" }],
    context: { gha: true, oauth: true, source: "github-actions / Max OAuth" },
  };
}

export function seedGhosted() {
  const envelope = hollowSuccess({ session_id: "husk-ghost", uuid: "ghost" });
  return {
    issue: null,
    source: "ghosted",
    session: "ghosted",
    envelope,
    stream: [{ type: "system", subtype: "init" }, envelope],
    context: { streamed: true, verbose: false, source: "ghosted" },
  };
}

export function seedContended() {
  const envelope = hollowSuccess({ session_id: "husk-lock", uuid: "lock" });
  return {
    issue: null,
    source: "single-flight",
    session: "contended",
    envelope,
    stream: [
      { type: "system", subtype: "init" },
      { type: "text", text: "global single-flight lock held by another session" },
      envelope,
    ],
    context: { lock: true, parentSession: true, source: "single-flight" },
  };
}

const SEEDS = {
  87159: seed87159,
  80223: seed80223,
  2197: seed2197,
  kernel: seedKernel,
  husked: seedHusked,
  zeroed: seedZeroed,
  ghosted: seedGhosted,
  contended: seedContended,
};

export function seedOf(name) {
  const key = typeof name === "number" ? name : String(name || "").replace(/^#/, "");
  const fn = SEEDS[key];
  return fn ? fn() : seedHusked();
}

export { reason };
