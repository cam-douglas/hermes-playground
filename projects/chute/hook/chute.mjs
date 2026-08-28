/**
 * Chute — mail chute / dead-drop for sanctioned secret handoff.
 * A typed secret is not a handoff. Masked intake or admit clear.
 *
 * Verdicts: clear | typed | masked | burned | echoed | retained | brokered | vaulted | leaked | gap
 * Idle word is clear. Never the product name. Never paired. Never kernel.
 * Never latched. Never husked. Blot also says clear (image tray); this is
 * the inbound secret channel, not a darkroom.
 *
 * Slack typed/burned/echoed/retained/leaked/gap alarm.
 * Linear ticket on burned / echoed.
 * GitHub chute-ledger issue on every scored probe.
 *
 * This is NOT Scrim (PostToolUse outbound I/O DLP / redaction after secrets
 * already exist in tool traffic). Chute is the INBOUND channel: prevent the
 * write into the transcript in the first place.
 * NOT Knock / Quench / Hasp / Parity / Tain / Husk / Snib / Veto / Assay /
 * Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Reveille.
 */

export const VERDICTS = Object.freeze([
  "clear",
  "typed",
  "masked",
  "burned",
  "echoed",
  "retained",
  "brokered",
  "vaulted",
  "leaked",
  "gap",
]);
export const IDLE_WORD = "clear";
export const SLACK_VERDICTS = Object.freeze([
  "typed",
  "burned",
  "echoed",
  "retained",
  "leaked",
  "gap",
]);
export const LINEAR_VERDICTS = Object.freeze(["burned", "echoed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

/** Demo fingerprint only. Never a live secret. */
export const DEMO_FINGERPRINT = "a3f1c8e2";
export const DEMO_SECRET_NAME = "GITHUB_TOKEN";
export const DEMO_SECRET_LENGTH = 40;

const CHANNELS = new Set([
  "",
  "none",
  "prompt",
  "askUserSecret",
  "chute",
  "envInject",
  "vault",
  "file",
]);

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

function asLength(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function asChannel(value) {
  const next = asText(value).trim();
  return CHANNELS.has(next) ? next : asText(value).trim();
}

export function emptyProbe() {
  return {
    channel: "",
    askUserSecretAvailable: false,
    onlyPromptBox: false,
    gap: false,
    secretInPrompt: false,
    secretInTranscript: false,
    secretInHistory: false,
    secretInPasteCache: false,
    secretInModelContext: false,
    modelPrintedSecret: false,
    wouldReachBugRetention: false,
    agentCanUse: false,
    agentCanRead: false,
    fileReadIntoTranscript: false,
    liveCredentialInTranscript: false,
    sessionMemory: false,
    secretName: "",
    secretLength: 0,
    fingerprint: "",
    feed: "",
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "clear-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.secret && typeof src.secret === "object" ? src.secret : {};
  return {
    ...emptyProbe(),
    channel: asChannel(src.channel ?? nested.channel),
    askUserSecretAvailable: asBool(src.askUserSecretAvailable ?? nested.askUserSecretAvailable),
    onlyPromptBox: asBool(src.onlyPromptBox ?? nested.onlyPromptBox),
    gap: asBool(src.gap ?? nested.gap),
    secretInPrompt: asBool(src.secretInPrompt ?? nested.inPrompt),
    secretInTranscript: asBool(src.secretInTranscript ?? nested.inTranscript),
    secretInHistory: asBool(src.secretInHistory ?? nested.inHistory),
    secretInPasteCache: asBool(src.secretInPasteCache ?? nested.inPasteCache),
    secretInModelContext: asBool(src.secretInModelContext ?? nested.inModelContext),
    modelPrintedSecret: asBool(src.modelPrintedSecret ?? nested.printed),
    wouldReachBugRetention: asBool(src.wouldReachBugRetention ?? nested.wouldReachBugRetention),
    agentCanUse: asBool(src.agentCanUse ?? nested.canUse),
    agentCanRead: asBool(src.agentCanRead ?? nested.canRead),
    fileReadIntoTranscript: asBool(src.fileReadIntoTranscript ?? nested.fileRead),
    liveCredentialInTranscript: asBool(
      src.liveCredentialInTranscript ?? nested.liveCredential,
    ),
    sessionMemory: asBool(src.sessionMemory ?? nested.sessionMemory),
    secretName: asText(src.secretName ?? nested.name),
    secretLength: asLength(src.secretLength ?? nested.length),
    fingerprint: asText(src.fingerprint ?? nested.fingerprint),
    feed: asText(src.feed ?? nested.feed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source),
    issue: asIssue(src.issue),
    scored: asBool(src.scored),
  };
}

function leakyWrite(probe) {
  return (
    probe.secretInPrompt ||
    probe.secretInTranscript ||
    probe.secretInHistory ||
    probe.secretInPasteCache ||
    probe.secretInModelContext ||
    probe.liveCredentialInTranscript ||
    probe.fileReadIntoTranscript ||
    probe.modelPrintedSecret
  );
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.channel &&
    !next.askUserSecretAvailable &&
    !next.onlyPromptBox &&
    !next.gap &&
    !next.secretInPrompt &&
    !next.secretInTranscript &&
    !next.secretInHistory &&
    !next.secretInPasteCache &&
    !next.secretInModelContext &&
    !next.modelPrintedSecret &&
    !next.wouldReachBugRetention &&
    !next.agentCanUse &&
    !next.agentCanRead &&
    !next.fileReadIntoTranscript &&
    !next.liveCredentialInTranscript &&
    !next.sessionMemory &&
    !next.secretName &&
    !next.secretLength &&
    !next.fingerprint &&
    !next.feed
  );
}

export function isBurned(probe = {}) {
  const next = cloneProbe(probe);
  if (next.liveCredentialInTranscript) return true;
  return (
    next.secretInTranscript && (next.secretInHistory || next.secretInPasteCache)
  );
}

export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "clear";
  if (next.modelPrintedSecret) return "echoed";
  if (isBurned(next)) return "burned";
  if (next.fileReadIntoTranscript) return "leaked";
  if (next.wouldReachBugRetention) return "retained";
  if (next.secretInPrompt || next.channel === "prompt") return "typed";
  if (next.channel === "vault") return "vaulted";
  if (next.channel === "envInject" || (next.agentCanUse && !next.agentCanRead && !leakyWrite(next))) {
    return "brokered";
  }
  if (
    next.channel === "askUserSecret" ||
    next.channel === "chute" ||
    (next.sessionMemory && !leakyWrite(next))
  ) {
    return "masked";
  }
  if (
    next.gap ||
    next.onlyPromptBox ||
    next.channel === "none" ||
    !next.askUserSecretAvailable
  ) {
    return "gap";
  }
  return "clear";
}

export function feedOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  if (next.feed) return next.feed;
  const name = next.secretName || DEMO_SECRET_NAME;
  const length = next.secretLength || DEMO_SECRET_LENGTH;
  const fp = next.fingerprint || DEMO_FINGERPRINT;
  if (kind === "masked") {
    return `● Secret received · ${name} · ${length} chars · fp ${fp} · session memory`;
  }
  if (kind === "brokered") {
    return `● Brokered · ${name} · ${length} chars · fp ${fp} · env inject · USE never READ`;
  }
  if (kind === "vaulted") {
    return `● Vaulted · ${name} · ${length} chars · fp ${fp} · OS keychain / provider vault`;
  }
  if (kind === "typed") {
    return `● Typed into prompt · ${name} · ${length} chars · fp ${fp} · value is the transcript`;
  }
  if (kind === "burned") {
    return `● Burned · live credential shape · fp ${fp} · transcript / history / paste-cache`;
  }
  if (kind === "echoed") {
    return `● Echoed · model printed · never-print violated · fp ${fp}`;
  }
  if (kind === "retained") {
    return `● Retained · would reach /bug · five-year feedback store · fp ${fp}`;
  }
  if (kind === "leaked") {
    return `● Leaked · .env / credential file read into transcript · fp ${fp}`;
  }
  if (kind === "gap") {
    return "● Gap · no AskUserSecret tool · only the prompt box exists";
  }
  return "● Clear · chute empty · no secret on the transcript path";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  if (next.channel) reasons.push(`channel ${next.channel}`);
  else reasons.push("channel unset");
  reasons.push(
    next.askUserSecretAvailable
      ? "AskUserSecret available"
      : "AskUserSecret missing",
  );
  if (next.onlyPromptBox) reasons.push("only the prompt box exists");
  if (next.secretName) reasons.push(`name ${next.secretName}`);
  if (next.secretLength) reasons.push(`${next.secretLength} chars`);
  if (next.fingerprint) reasons.push(`fp ${next.fingerprint}`);
  if (next.sessionMemory) reasons.push("session memory only");
  if (next.secretInPrompt) reasons.push("secret pasted into the chat prompt");
  if (next.secretInTranscript) reasons.push("secret present in transcript");
  if (next.secretInHistory) reasons.push("secret present in history");
  if (next.secretInPasteCache) reasons.push("secret present in paste-cache");
  if (next.secretInModelContext) reasons.push("secret entered model context");
  if (next.liveCredentialInTranscript) {
    reasons.push("live credential already written into transcript");
  }
  if (next.fileReadIntoTranscript) {
    reasons.push(".env / credential file read straight into transcript");
  }
  if (next.modelPrintedSecret) reasons.push("model printed the secret");
  if (next.wouldReachBugRetention) {
    reasons.push("would reach /bug or feedback five-year retention");
  }
  if (next.agentCanUse) reasons.push("agent can USE via env inject");
  if (next.agentCanRead) reasons.push("agent can READ the value");
  else if (next.agentCanUse) reasons.push("agent cannot READ the value");
  if (kind === "clear") reasons.push("no secret on the leaky prompt path; sanctioned channel used or none needed");
  if (kind === "typed") reasons.push("a typed secret is not a handoff");
  if (kind === "masked") reasons.push("AskUserSecret / Chute panel used; value never entered transcript");
  if (kind === "burned") reasons.push("live credential already written into transcript/history/paste-cache");
  if (kind === "echoed") reasons.push("model violated never-print-secrets");
  if (kind === "retained") reasons.push("would reach /bug or feedback five-year retention");
  if (kind === "brokered") reasons.push("agent can USE via env inject, never READ");
  if (kind === "vaulted") reasons.push("OS keychain / provider vault path (alternative, not the core primitive)");
  if (kind === "leaked") reasons.push(".env / credential file read straight into transcript");
  if (kind === "gap") reasons.push("no sanctioned channel available (the systemic missing input)");
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
    channel: pick("channel"),
    askUserSecretAvailable: pick("askUserSecretAvailable"),
    onlyPromptBox: pick("onlyPromptBox"),
    gap: pick("gap"),
    secretInPrompt: pick("secretInPrompt"),
    secretInTranscript: pick("secretInTranscript"),
    secretInHistory: pick("secretInHistory"),
    secretInPasteCache: pick("secretInPasteCache"),
    secretInModelContext: pick("secretInModelContext"),
    modelPrintedSecret: pick("modelPrintedSecret"),
    wouldReachBugRetention: pick("wouldReachBugRetention"),
    agentCanUse: pick("agentCanUse"),
    agentCanRead: pick("agentCanRead"),
    fileReadIntoTranscript: pick("fileReadIntoTranscript"),
    liveCredentialInTranscript: pick("liveCredentialInTranscript"),
    sessionMemory: pick("sessionMemory"),
    secretName: pick("secretName"),
    secretLength: pick("secretLength"),
    fingerprint: pick("fingerprint"),
    feed: pick("feed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    secret: fromFields.secret,
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
    product: "chute",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    slack: SLACK_VERDICTS.includes(verdict),
    chuteEmpty: verdict === "clear",
    chuteMasked: verdict === "masked",
    chuteGap: verdict === "gap",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    channel: next.channel,
    askUserSecretAvailable: next.askUserSecretAvailable,
    onlyPromptBox: next.onlyPromptBox,
    gap: next.gap,
    secretInPrompt: next.secretInPrompt,
    secretInTranscript: next.secretInTranscript,
    secretInHistory: next.secretInHistory,
    secretInPasteCache: next.secretInPasteCache,
    secretInModelContext: next.secretInModelContext,
    modelPrintedSecret: next.modelPrintedSecret,
    wouldReachBugRetention: next.wouldReachBugRetention,
    agentCanUse: next.agentCanUse,
    agentCanRead: next.agentCanRead,
    fileReadIntoTranscript: next.fileReadIntoTranscript,
    liveCredentialInTranscript: next.liveCredentialInTranscript,
    sessionMemory: next.sessionMemory,
    secretName: next.secretName,
    secretLength: next.secretLength,
    fingerprint: next.fingerprint,
    feed: feedOf(next, verdict),
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
      channel: extras.channel || "",
      askUserSecretAvailable: Boolean(extras.askUserSecretAvailable),
      onlyPromptBox: Boolean(extras.onlyPromptBox),
      gap: Boolean(extras.gap),
      secretInPrompt: Boolean(extras.secretInPrompt),
      secretInTranscript: Boolean(extras.secretInTranscript),
      secretInHistory: Boolean(extras.secretInHistory),
      secretInPasteCache: Boolean(extras.secretInPasteCache),
      secretInModelContext: Boolean(extras.secretInModelContext),
      modelPrintedSecret: Boolean(extras.modelPrintedSecret),
      wouldReachBugRetention: Boolean(extras.wouldReachBugRetention),
      agentCanUse: Boolean(extras.agentCanUse),
      agentCanRead: Boolean(extras.agentCanRead),
      fileReadIntoTranscript: Boolean(extras.fileReadIntoTranscript),
      liveCredentialInTranscript: Boolean(extras.liveCredentialInTranscript),
      sessionMemory: Boolean(extras.sessionMemory),
      secretName: extras.secretName || "",
      secretLength: extras.secretLength || 0,
      fingerprint: extras.fingerprint || "",
      feed: extras.feed || "",
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** PRIMARY #90301: no AskUserSecret tool; only the prompt box exists. */
export function seed90301Gap() {
  return seedProbe(90301, "anthropics/claude-code#90301", {
    session: "90301-gap",
    channel: "none",
    askUserSecretAvailable: false,
    onlyPromptBox: true,
    gap: true,
  });
}

/** AskUserSecret / Chute panel used; value never entered transcript. */
export function seedMasked() {
  return seedProbe("masked", "askUserSecret", {
    session: "masked",
    issue: null,
    channel: "askUserSecret",
    askUserSecretAvailable: true,
    sessionMemory: true,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
    feed: `● Secret received · ${DEMO_SECRET_NAME} · ${DEMO_SECRET_LENGTH} chars · fp ${DEMO_FINGERPRINT} · session memory`,
  });
}

/** PRIMARY #71654: live PAT + Forgejo token burned into transcripts. */
export function seed71654Burned() {
  return seedProbe(71654, "anthropics/claude-code#71654", {
    session: "71654-burned",
    channel: "prompt",
    onlyPromptBox: true,
    secretInPrompt: true,
    secretInTranscript: true,
    secretInHistory: true,
    secretInPasteCache: true,
    secretInModelContext: true,
    liveCredentialInTranscript: true,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** PRIMARY #82796: model printed the secret despite never-print rule. */
export function seed82796Echoed() {
  return seedProbe(82796, "anthropics/claude-code#82796", {
    session: "82796-echoed",
    channel: "prompt",
    secretInTranscript: true,
    secretInModelContext: true,
    modelPrintedSecret: true,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** User pasted into the chat prompt — the failure mode. */
export function seedTyped() {
  return seedProbe("typed", "prompt", {
    session: "typed",
    issue: null,
    channel: "prompt",
    onlyPromptBox: true,
    secretInPrompt: true,
    secretInTranscript: false,
    secretInModelContext: true,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** #77084 lockbox / broker injection — USE never READ. */
export function seed77084Brokered() {
  return seedProbe(77084, "anthropics/claude-code#77084", {
    session: "77084-brokered",
    channel: "envInject",
    askUserSecretAvailable: true,
    sessionMemory: true,
    agentCanUse: true,
    agentCanRead: false,
    secretInModelContext: false,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** Chute empty / transcript clean. */
export function seedClear() {
  return {
    action: "score",
    session: "clear",
    issue: null,
    source: "clear",
    probe: emptyProbe(),
  };
}

/** Would reach /bug or feedback five-year retention. */
export function seedRetained() {
  return seedProbe(78344, "anthropics/claude-code#78344", {
    session: "78344-retained",
    channel: "prompt",
    secretInPrompt: true,
    secretInTranscript: true,
    wouldReachBugRetention: true,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** OS keychain / provider vault path (alternative, not the core primitive). */
export function seedVaulted() {
  return seedProbe("vaulted", "vault", {
    session: "vaulted",
    issue: null,
    channel: "vault",
    askUserSecretAvailable: true,
    sessionMemory: true,
    agentCanUse: true,
    agentCanRead: false,
    secretName: DEMO_SECRET_NAME,
    secretLength: DEMO_SECRET_LENGTH,
    fingerprint: DEMO_FINGERPRINT,
  });
}

/** #44868 / #58043 / #59094: .env → transcript. */
export function seed44868Leaked() {
  return seedProbe(44868, "anthropics/claude-code#44868", {
    session: "44868-leaked",
    channel: "file",
    fileReadIntoTranscript: true,
    secretInTranscript: true,
    secretInModelContext: true,
    secretName: ".env",
    secretLength: 12,
    fingerprint: DEMO_FINGERPRINT,
  });
}

const SEEDS = {
  clear: seedClear,
  typed: seedTyped,
  masked: seedMasked,
  burned: seed71654Burned,
  71654: seed71654Burned,
  "71654-burned": seed71654Burned,
  echoed: seed82796Echoed,
  82796: seed82796Echoed,
  "82796-echoed": seed82796Echoed,
  retained: seedRetained,
  78344: seedRetained,
  "78344-retained": seedRetained,
  brokered: seed77084Brokered,
  77084: seed77084Brokered,
  "77084-brokered": seed77084Brokered,
  vaulted: seedVaulted,
  leaked: seed44868Leaked,
  44868: seed44868Leaked,
  58043: seed44868Leaked,
  59094: seed44868Leaked,
  "44868-leaked": seed44868Leaked,
  gap: seed90301Gap,
  90301: seed90301Gap,
  "90301-gap": seed90301Gap,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function applyDrop(probe) {
  return {
    ...probe,
    channel: "askUserSecret",
    askUserSecretAvailable: true,
    onlyPromptBox: false,
    gap: false,
    sessionMemory: true,
    secretInPrompt: false,
    secretInTranscript: false,
    secretInHistory: false,
    secretInPasteCache: false,
    secretInModelContext: false,
    modelPrintedSecret: false,
    liveCredentialInTranscript: false,
    fileReadIntoTranscript: false,
    wouldReachBugRetention: false,
    agentCanUse: false,
    agentCanRead: false,
    secretName: probe.secretName || DEMO_SECRET_NAME,
    secretLength: probe.secretLength || DEMO_SECRET_LENGTH,
    fingerprint: probe.fingerprint || DEMO_FINGERPRINT,
    feed: "",
    scored: true,
  };
}

function applyInject(probe) {
  return {
    ...probe,
    channel: "envInject",
    askUserSecretAvailable: true,
    sessionMemory: true,
    agentCanUse: true,
    agentCanRead: false,
    secretInPrompt: false,
    secretInTranscript: false,
    secretInHistory: false,
    secretInPasteCache: false,
    secretInModelContext: false,
    modelPrintedSecret: false,
    liveCredentialInTranscript: false,
    fileReadIntoTranscript: false,
    wouldReachBugRetention: false,
    secretName: probe.secretName || DEMO_SECRET_NAME,
    secretLength: probe.secretLength || DEMO_SECRET_LENGTH,
    fingerprint: probe.fingerprint || DEMO_FINGERPRINT,
    feed: "",
    scored: true,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear") {
    return pack("clear", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "drop") {
    probe = applyDrop(probe);
    return pack(classify(probe), probe, { ...action, action: "drop" });
  }

  if (verb === "inject") {
    probe = applyInject(probe);
    return pack(classify(probe), probe, { ...action, action: "inject" });
  }

  if (verb === "admit") {
    probe = { ...probe, scored: true };
    const verdict = classify(probe);
    return pack(verdict, probe, { ...action, action: "admit" });
  }

  if (verb === "receive" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
