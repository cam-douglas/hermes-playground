/**
 * Pirn — weaver's pirn / bobbin-winder / loom-side yarn-package desk
 * for a real Claude Code failure class: instruction-shaped pattern
 * truncation of subagent idle_notification reports, then the
 * harness's own "ask via SendMessage" advice that re-runs the
 * agent at full cost and truncates again.
 *
 * Primary #90544: subagent final report delivered as
 * idle_notification is truncated at ~2,500 chars whenever the
 * harness tags output as "instruction-shaped pattern"
 * (e.g. settings-json when the report mentions ~/.claude.json /
 * .mcp.json). Prefix: [harness: subagent output matched
 * instruction-shaped pattern(s): settings-json. ...]. Suffix:
 * [result truncated — ask the agent for the rest via SendMessage].
 * Parent SendMessage re-ask resumes the subagent on its full
 * transcript (full re-run). Resent report truncated again at the
 * same point. One ~1,500-word / 10-section report took three
 * Opus 5 runs (~3× cost). WSL2, Claude Code 2.1.251. Parent
 * Fable 5; subagent Opus 5. Sonnet 5 control was NOT truncated.
 *
 * Same-class / shape (not new primaries):
 *   #74113 — agents go idle WITHOUT delivering the report;
 *            re-ping recovers it. HERE the report IS delivered
 *            but the harness cuts it; re-ping does not recover
 *            the missing tail.
 *   #86471 — agents complete with empty/partial output. HERE
 *            the agent produced the full output; the delivery
 *            layer removed it.
 *   #77112 — claude -p stdout silently truncated at 65536 bytes
 *            (pipe buffer). Different layer (CLI stdout), same
 *            class of silent cut.
 *   #75298 — "Truncated event message received" on Bedrock
 *            streams. Different (stream event), cite as nearby
 *            shape only.
 *
 * Cross-ecosystem (real cost-multiplier / silent drop shape,
 * not a new primary):
 *   openai/codex#34468 — incorrect default parent behavior
 *            managing background agents → unnecessary
 *            rate-limit/token consumption.
 *   openai/codex#37822 — spawn_agent / followup_task payload
 *            never reaches sub-agent (encrypted_content dropped).
 *
 * Verdicts: beamed | cropped | thrice | tagged | looped | midcut
 * Idle word is beamed (full report wound onto the pirn without
 * cut; no instruction-shaped tag; single delivery; charCount
 * below cap; runs=1). NEVER use pirn / empty / truncat* / crop /
 * snip / cut as idle.
 * NEVER reuse snug, hung, appointed, cinched, gauged, stamped,
 * overrun, pratique, wound, bound, stilled, stabled, drained,
 * flat, fit, spoilt, laid, unlinked, tight, banked, roosted,
 * stocked, seated, heard, clear, paired, kernel, latched,
 * upheld, sterling, home, valid, dry, sealed, quiet, seised.
 *
 * Slack alarm on cropped / thrice / tagged / looped / midcut.
 * Linear ticket on cropped / thrice.
 * GitHub pirn-ledger of scored pirns on every score.
 *
 * Priority when multiple match:
 *   thrice > cropped > looped > midcut > tagged > beamed
 *
 * Why this is not a clone:
 * NOT Shunt (#90463) — nested SendMessage follow-up misrouted
 *     to root; return path closed. Pirn is delivery-layer
 *     truncation of a report that DID arrive on the parent,
 *     plus costly re-run loop. Same tool name, different
 *     failure class.
 * NOT Cote — resume hub identity split / success receipts
 *     that never roost.
 * NOT Husk — hollow SUCCESS envelopes with empty result.
 * NOT Coda — silently dropped assistant text blocks.
 * NOT Aside — /btw silent truncation.
 * NOT Suture — stream-tear / partial turn.
 * NOT Cotter — poison fireAt registry schema.
 * NOT Fob / Ordo / Cinch / Ullage / Visa / Sprag / Lazaret /
 *     Fusee / Quench / Reveille / Scrim / Knock / Pleat /
 *     Scant / Chad / Sump / Leat / Iota.
 * NOT leftover woodworking / millimetre-slider products.
 * Do NOT ship alternate names Crop, Snip, Quill, Nib, Trunc,
 * Catch, Kerf, Stump, Bobbin, Shuttle, Thrum, Selvedge, Ravel,
 * Clew. Product name is Pirn only.
 * Different problem: INSTRUCTION-SHAPED FALSE-POSITIVE → HARD
 * CAP ~2.5k ON SUBAGENT REPORT → "FIX" THAT RE-RUNS AT FULL
 * COST AND HITS THE SAME CAP.
 * Different UI: weaver's pirn-winder / loom bench — oak frame,
 * wound yarn packages, scissors that cut mid-pick, thrice-rewound
 * costly reels, a harness tag glowing on the pirn that mentioned
 * settings-json, lying green "agent idle / complete" lamps.
 * Different idle: beamed.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 */

export const VERDICTS = Object.freeze([
  "beamed",
  "cropped",
  "thrice",
  "tagged",
  "looped",
  "midcut",
]);
export const IDLE_WORD = "beamed";
export const SLACK_VERDICTS = Object.freeze([
  "cropped",
  "thrice",
  "tagged",
  "looped",
  "midcut",
]);
export const LINEAR_VERDICTS = Object.freeze(["cropped", "thrice"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const CAP_CHARS = 2500;
export const HARNESS_TAG = "settings-json";
export const TRUNCATION_MARK =
  "[result truncated — ask the agent for the rest via SendMessage]";
export const HARNESS_PREFIX =
  "[harness: subagent output matched instruction-shaped pattern(s): settings-json.";

const FORBIDDEN_IDLE = Object.freeze([
  "pirn",
  "empty",
  "truncat",
  "truncate",
  "truncated",
  "truncation",
  "crop",
  "cropped",
  "snip",
  "cut",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "bound",
  "stilled",
  "stabled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "sealed",
  "quiet",
  "seised",
  "shunt",
  "cote",
  "husk",
  "coda",
  "aside",
  "suture",
  "cotter",
  "fob",
  "ordo",
  "cinch",
  "ullage",
  "visa",
  "sprag",
  "lazaret",
  "fusee",
  "quench",
  "reveille",
  "scrim",
  "knock",
  "pleat",
  "scant",
  "chad",
  "sump",
  "leat",
  "iota",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

function asNum(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function emptyPirn() {
  return {
    session: "",
    issue: null,
    source: "",
    harnessTag: "",
    instructionShaped: false,
    resultChars: 0,
    capChars: CAP_CHARS,
    truncated: false,
    truncationMarker: false,
    midSentence: false,
    runs: 0,
    reRun: false,
    fullReportProduced: false,
    deliveredToParent: false,
    sonnetControlOk: false,
    filePathWorkaround: false,
    agentIdleGreen: false,
    scored: false,
  };
}

export function emptyAction(session = "beamed-1") {
  return {
    action: "score",
    session,
    pirn: emptyPirn(),
  };
}

export function clonePirn(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyPirn();
  const nested =
    (src.pirn && typeof src.pirn === "object" && src.pirn) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.tray && typeof src.tray === "object" && src.tray) ||
    src;
  const runs = asNum(nested.runs ?? src.runs);
  const resultChars = asNum(nested.resultChars ?? nested.charCount ?? src.resultChars);
  const capChars = asNum(nested.capChars ?? src.capChars);
  return {
    ...emptyPirn(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    harnessTag: asText(nested.harnessTag ?? nested.tag ?? src.harnessTag),
    instructionShaped: asBool(nested.instructionShaped ?? src.instructionShaped, false) === true,
    resultChars: resultChars == null ? 0 : resultChars,
    capChars: capChars == null ? CAP_CHARS : capChars,
    truncated: asBool(nested.truncated ?? src.truncated, false) === true,
    truncationMarker: asBool(nested.truncationMarker ?? src.truncationMarker, false) === true,
    midSentence: asBool(nested.midSentence ?? src.midSentence, false) === true,
    runs: runs == null ? 0 : runs,
    reRun: asBool(nested.reRun ?? src.reRun, false) === true,
    fullReportProduced: asBool(nested.fullReportProduced ?? src.fullReportProduced, false) === true,
    deliveredToParent: asBool(nested.deliveredToParent ?? src.deliveredToParent, false) === true,
    sonnetControlOk: asBool(nested.sonnetControlOk ?? src.sonnetControlOk, false) === true,
    filePathWorkaround: asBool(nested.filePathWorkaround ?? src.filePathWorkaround, false) === true,
    agentIdleGreen: asBool(nested.agentIdleGreen ?? src.agentIdleGreen, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(pirn = {}) {
  const next = clonePirn(pirn);
  const tagged =
    next.instructionShaped === true || Boolean(String(next.harnessTag || "").trim());
  const atCap =
    next.capChars > 0 && next.resultChars > 0 && next.resultChars >= next.capChars;
  const truncatedDelivery = next.truncated === true || next.truncationMarker === true;
  const thriceShape = next.runs >= 3 && truncatedDelivery;
  const croppedShape =
    tagged && next.truncated === true && next.truncationMarker === true;
  const loopedShape = next.reRun === true && truncatedDelivery;
  const midcutShape = next.truncated === true && next.midSentence === true;
  const taggedShape = tagged;
  const beamedHold =
    !tagged &&
    next.truncated !== true &&
    next.truncationMarker !== true &&
    next.runs <= 1 &&
    next.reRun !== true &&
    next.deliveredToParent === true &&
    (next.fullReportProduced === true || next.filePathWorkaround === true);
  return {
    tagged,
    atCap,
    truncatedDelivery,
    thriceShape,
    croppedShape,
    loopedShape,
    midcutShape,
    taggedShape,
    beamedHold,
    charCount: next.resultChars,
    capChars: next.capChars,
    runs: next.runs,
    reRun: next.reRun,
    midSentence: next.midSentence,
    instructionShaped: next.instructionShaped,
    harnessTag: next.harnessTag,
    agentIdleGreen: next.agentIdleGreen,
    deliveredToParent: next.deliveredToParent,
    fullReportProduced: next.fullReportProduced,
    filePathWorkaround: next.filePathWorkaround,
    sonnetControlOk: next.sonnetControlOk,
  };
}

export function isIdle(pirn = {}) {
  const next = clonePirn(pirn);
  return (
    !next.harnessTag &&
    next.instructionShaped !== true &&
    next.resultChars === 0 &&
    next.truncated !== true &&
    next.truncationMarker !== true &&
    next.midSentence !== true &&
    next.runs === 0 &&
    next.reRun !== true &&
    next.fullReportProduced !== true &&
    next.deliveredToParent !== true &&
    next.sonnetControlOk !== true &&
    next.filePathWorkaround !== true &&
    next.agentIdleGreen !== true
  );
}

/**
 * First match wins by documented priority:
 * thrice > cropped > looped > midcut > tagged > beamed.
 * Idle beamed is first. Green idle/complete lamps must NOT
 * force beamed when the yarn is cropped or tagged.
 */
export function classify(pirn = {}) {
  const next = clonePirn(pirn);
  if (isIdle(next)) return "beamed";
  const facts = analyze(next);

  if (facts.thriceShape) return "thrice";
  if (facts.croppedShape) return "cropped";
  if (facts.loopedShape) return "looped";
  if (facts.midcutShape) return "midcut";
  if (facts.taggedShape) return "tagged";
  if (facts.beamedHold) return "beamed";
  return "beamed";
}

export function feedOf(pirn = {}, verdict = "") {
  const kind = verdict || classify(pirn);
  if (kind === "cropped") {
    return "● Cropped · harness tagged instruction-shaped (settings-json) · result truncated at ~2500 · ask via SendMessage · primary #90544";
  }
  if (kind === "thrice") {
    return "● Thrice · same truncated report recovered only after ≥3 full agent runs · each SendMessage re-ask re-ran and re-truncated · #90544";
  }
  if (kind === "tagged") {
    return "● Tagged · harness instruction-shaped prefix present (settings-json or similar) · length not yet the hold";
  }
  if (kind === "looped") {
    return "● Looped · SendMessage re-ask caused a full transcript resume / re-run after a truncated delivery";
  }
  if (kind === "midcut") {
    return "● Midcut · truncation cuts mid-sentence / mid-section · the pick is not a finished cloth";
  }
  return "● Beamed · full report wound onto the pirn without cut · no instruction-shaped tag · single delivery · idle word is beamed";
}

export function reasonsOf(pirn = {}, verdict = "") {
  const next = clonePirn(pirn);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.charCount
      ? `pirn ${facts.charCount} chars · cap ${facts.capChars} · runs ${facts.runs}`
      : "one beamed pirn on the bench · idle word is beamed",
  );
  if (facts.tagged) {
    reasons.push(
      `harness instruction-shaped tag · ${facts.harnessTag || "settings-json"} · mention of ~/.claude.json / .mcp.json is a finding, not an instruction`,
    );
  }
  if (facts.truncatedDelivery) {
    reasons.push(
      `delivery-layer cut · ${TRUNCATION_MARK} · the agent produced the full report; the harness removed the tail`,
    );
  }
  if (facts.atCap) {
    reasons.push(`hard cap ~${facts.capChars} chars · resultChars ${facts.charCount} sits on the wall`);
  }
  if (facts.midSentence) {
    reasons.push("cut mid-sentence / mid-section · the pick is not finished cloth");
  }
  if (facts.reRun || facts.runs >= 2) {
    reasons.push(
      `SendMessage re-ask resumed the subagent on its full transcript · runs=${facts.runs} · reRun=${facts.reRun}`,
    );
  }
  if (facts.agentIdleGreen && (facts.truncatedDelivery || facts.tagged)) {
    reasons.push(
      "lying green lamps · agent idle / complete stay green while the yarn is cropped",
    );
  }
  if (facts.deliveredToParent && facts.fullReportProduced && facts.truncatedDelivery) {
    reasons.push("report DID arrive on the parent · the delivery layer cut it · not a Shunt misroute");
  }
  if (facts.sonnetControlOk) {
    reasons.push("Sonnet 5 control was NOT truncated · cap sits on the flagged / idle_notification path");
  }
  if (facts.filePathWorkaround) {
    reasons.push("file-path workaround in use · write the report to disk and return only the path");
  }
  reasons.push("a first delivery is not a hold");
  reasons.push(
    "NOT Shunt (#90463 SendMessage misroute to root) / Cote (resume hub split) / Husk (hollow SUCCESS) / Coda (dropped text blocks) / Aside (/btw truncation) / Suture (stream-tear) / Cotter (poison fireAt) / Fob / Ordo / Cinch / Ullage / Visa / Sprag / Lazaret / Fusee / Quench / Reveille / Scrim / Knock / Pleat / Scant / Chad / Sump / Leat / Iota / leftover woodworking / millimetre-slider",
  );
  if (kind === "beamed") {
    reasons.push(
      "full report delivered once; no harness instruction-shaped tag; no truncation marker; runs===1; charCount under cap; idle word is beamed",
    );
  }
  if (kind === "cropped") {
    reasons.push(
      "PRIMARY #90544: idle_notification tagged settings-json and cut at ~2,500 chars. The suggested SendMessage re-ask re-runs at full cost and hits the same cap.",
    );
  }
  if (kind === "thrice") {
    reasons.push(
      "#90544: one ~1,500-word / 10-section report took three Opus 5 runs (~3× cost) because each re-ask re-truncated.",
    );
  }
  if (kind === "tagged") {
    reasons.push("harness instruction-shaped prefix present even if length is not yet measured.");
  }
  if (kind === "looped") {
    reasons.push("SendMessage re-ask caused a full transcript resume / re-run after a truncated delivery.");
  }
  if (kind === "midcut") {
    reasons.push("truncation cuts mid-sentence / mid-section.");
  }
  return reasons;
}

export function verdictOf(pirn = {}) {
  return classify(pirn);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function beamedOf(pirn = {}, verdict = "") {
  return (verdict || classify(pirn)) === "beamed";
}

export function croppedOf(pirn = {}, verdict = "") {
  return (verdict || classify(pirn)) === "cropped";
}

export function summaryOf(pirn = {}) {
  const next = clonePirn(pirn);
  const facts = analyze(next);
  return {
    charCount: facts.charCount,
    capChars: facts.capChars,
    runs: facts.runs,
    reRun: facts.reRun,
    truncated: next.truncated,
    truncationMarker: next.truncationMarker,
    instructionShaped: facts.instructionShaped,
    harnessTag: facts.harnessTag,
    midSentence: facts.midSentence,
    agentIdleGreen: facts.agentIdleGreen,
    deliveredToParent: facts.deliveredToParent,
    fullReportProduced: facts.fullReportProduced,
    filePathWorkaround: facts.filePathWorkaround,
    sonnetControlOk: facts.sonnetControlOk,
  };
}

export function score(pirn = {}) {
  const next = clonePirn(pirn);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    beamed: beamedOf(next, verdict),
    cropped: croppedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    charCount: facts.charCount,
    capChars: facts.capChars,
    runs: facts.runs,
    reRun: facts.reRun,
    truncated: next.truncated,
    truncationMarker: next.truncationMarker,
    instructionShaped: facts.instructionShaped,
    harnessTag: facts.harnessTag,
    midSentence: facts.midSentence,
    agentIdleGreen: facts.agentIdleGreen,
    deliveredToParent: facts.deliveredToParent,
    fullReportProduced: facts.fullReportProduced,
    summary: summaryOf(next),
    pirn: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const pirnSrc =
    src.pirn || src.probe || src.payload || src.tray || payload.pirn || payload.probe || payload.tray;
  const pirn = clonePirn(
    pirnSrc && typeof pirnSrc === "object" ? { ...pirnSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !pirn.session) pirn.session = src.session;
  if (typeof payload.session === "string" && !pirn.session) pirn.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? pirn.session ?? ""),
    pirn,
    issue: src.issue ?? payload.issue ?? pirn.issue ?? null,
    source: src.source ?? payload.source ?? pirn.source ?? "",
  };
}

function pirnResult(verdict, pirn, action, extras = {}) {
  const next = clonePirn(pirn);
  const scored = score(next);
  return {
    ok: true,
    product: "pirn",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    beamed: scored.beamed,
    cropped: scored.cropped,
    pirnBeamed: verdict === "beamed",
    pirnCropped: verdict === "cropped",
    pirnThrice: verdict === "thrice",
    pirnTagged: verdict === "tagged",
    pirnLooped: verdict === "looped",
    pirnMidcut: verdict === "midcut",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    charCount: scored.charCount,
    capChars: scored.capChars,
    runs: scored.runs,
    reRun: scored.reRun,
    truncated: scored.truncated,
    truncationMarker: scored.truncationMarker,
    instructionShaped: scored.instructionShaped,
    harnessTag: scored.harnessTag,
    midSentence: scored.midSentence,
    agentIdleGreen: scored.agentIdleGreen,
    deliveredToParent: scored.deliveredToParent,
    fullReportProduced: scored.fullReportProduced,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    pirn: next,
    ...extras,
  };
}

function seedPirn(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    pirn: {
      ...emptyPirn(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      harnessTag: asText(extras.harnessTag),
      instructionShaped: Boolean(extras.instructionShaped),
      resultChars: extras.resultChars != null ? extras.resultChars : 0,
      capChars: extras.capChars != null ? extras.capChars : CAP_CHARS,
      truncated: Boolean(extras.truncated),
      truncationMarker: Boolean(extras.truncationMarker),
      midSentence: Boolean(extras.midSentence),
      runs: extras.runs != null ? extras.runs : 0,
      reRun: Boolean(extras.reRun),
      fullReportProduced: extras.fullReportProduced !== undefined ? extras.fullReportProduced : false,
      deliveredToParent: extras.deliveredToParent !== undefined ? extras.deliveredToParent : false,
      sonnetControlOk: extras.sonnetControlOk !== undefined ? extras.sonnetControlOk : false,
      filePathWorkaround: Boolean(extras.filePathWorkaround),
      agentIdleGreen: extras.agentIdleGreen !== undefined ? extras.agentIdleGreen : false,
    },
  };
}

/** Idle / bail. Pirn not scored as a live delivery. One beamed pirn. */
export function seedBeamed() {
  return seedPirn("beamed", "bench", {
    session: "beamed",
    issue: null,
    scored: true,
    instructionShaped: false,
    resultChars: 1840,
    capChars: CAP_CHARS,
    truncated: false,
    truncationMarker: false,
    midSentence: false,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    filePathWorkaround: false,
    agentIdleGreen: true,
  });
}

/** Control: healthy full delivery, no tag, single run. */
export function seedControl() {
  return seedPirn("beamed", "bench", {
    session: "90544-control",
    issue: null,
    instructionShaped: false,
    harnessTag: "",
    resultChars: 1840,
    capChars: CAP_CHARS,
    truncated: false,
    truncationMarker: false,
    midSentence: false,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    filePathWorkaround: false,
    agentIdleGreen: true,
  });
}

/**
 * #90544 cropped: settings-json tag + 2500-char cut +
 * "ask via SendMessage" marker. First delivery. Green lamps lie.
 */
export function seedCropped() {
  return seedPirn(90544, "anthropics/claude-code#90544", {
    session: "90544-cropped",
    harnessTag: HARNESS_TAG,
    instructionShaped: true,
    resultChars: CAP_CHARS,
    capChars: CAP_CHARS,
    truncated: true,
    truncationMarker: true,
    midSentence: true,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    filePathWorkaround: false,
    agentIdleGreen: true,
  });
}

/** Full #90544 cropped used as the restore-to-cropped ticket. */
export function seed90544() {
  return seedCropped();
}

/** #90544 thrice: same cut recovered only after three Opus runs. */
export function seedThrice() {
  return seedPirn(90544, "anthropics/claude-code#90544", {
    session: "90544-thrice",
    harnessTag: HARNESS_TAG,
    instructionShaped: true,
    resultChars: CAP_CHARS,
    capChars: CAP_CHARS,
    truncated: true,
    truncationMarker: true,
    midSentence: true,
    runs: 3,
    reRun: true,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    filePathWorkaround: false,
    agentIdleGreen: true,
  });
}

/** Tag only — instruction-shaped prefix, length not yet the hold. */
export function seedTagged() {
  return seedPirn(90544, "anthropics/claude-code#90544", {
    session: "90544-tagged",
    harnessTag: HARNESS_TAG,
    instructionShaped: true,
    resultChars: 0,
    capChars: CAP_CHARS,
    truncated: false,
    truncationMarker: false,
    midSentence: false,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    agentIdleGreen: true,
  });
}

/** Looped: SendMessage re-ask re-ran after a truncated delivery. */
export function seedLooped() {
  return seedPirn(90544, "anthropics/claude-code#90544", {
    session: "90544-looped",
    harnessTag: "",
    instructionShaped: false,
    resultChars: 2100,
    capChars: CAP_CHARS,
    truncated: true,
    truncationMarker: true,
    midSentence: false,
    runs: 2,
    reRun: true,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    agentIdleGreen: true,
  });
}

/** Midcut: truncation cuts mid-sentence / mid-section. */
export function seedMidcut() {
  return seedPirn(90544, "anthropics/claude-code#90544", {
    session: "90544-midcut",
    harnessTag: "",
    instructionShaped: false,
    resultChars: 2488,
    capChars: CAP_CHARS,
    truncated: true,
    truncationMarker: true,
    midSentence: true,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    agentIdleGreen: true,
  });
}

/** Idle reset. One beamed pirn. Never an empty tray. */
export function seedReset() {
  return seedPirn("beamed", "bench", {
    session: "beamed",
    issue: null,
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyPirn();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return clonePirn({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return clonePirn({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const thrice =
    /three Opus|three (full )?runs|3×|3x cost|runs\s*[:=]\s*3|thrice/i.test(text) &&
    /truncat|SendMessage|re-?ask|re-?ran/i.test(text);
  const cropped =
    /instruction-shaped pattern|settings-json|idle_notification/i.test(text) &&
    /result truncated|ask the agent for the rest via SendMessage|~?2,?500/i.test(text);
  const looped = /SendMessage/.test(text) && /re-?ran|re-?run|full transcript resume/i.test(text);
  const midcut = /mid-sentence|mid-section|mid-pick/i.test(text) && /truncat/i.test(text);
  const tagged = /instruction-shaped|settings-json|harness:/i.test(text);
  const beamed = /full report wound|admit beamed|no instruction-shaped/i.test(text);

  if (thrice) {
    return { ...seedThrice().pirn, session: "paste-thrice", source: "anthropics/claude-code#90544", issue: 90544, scored: true };
  }
  if (cropped) {
    return { ...seedCropped().pirn, session: "paste-cropped", source: "anthropics/claude-code#90544", issue: 90544, scored: true };
  }
  if (looped) {
    return { ...seedLooped().pirn, session: "paste-looped", source: "anthropics/claude-code#90544", issue: 90544, scored: true };
  }
  if (midcut) {
    return { ...seedMidcut().pirn, session: "paste-midcut", source: "anthropics/claude-code#90544", issue: 90544, scored: true };
  }
  if (tagged) {
    return { ...seedTagged().pirn, session: "paste-tagged", source: "anthropics/claude-code#90544", issue: 90544, scored: true };
  }
  if (beamed) {
    return { ...seedControl().pirn, session: "paste-beamed", source: "paste", scored: true };
  }
  return { ...emptyPirn(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  beamed: seedBeamed,
  control: seedControl,
  cropped: seedCropped,
  90544: seed90544,
  "90544-cropped": seedCropped,
  thrice: seedThrice,
  tagged: seedTagged,
  looped: seedLooped,
  midcut: seedMidcut,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  bench: seedControl,
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
  let pirn = clonePirn(action.pirn);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "beamed" || verb === "still" || verb === "rest" || verb === "reset") {
    return pirnResult("beamed", emptyPirn(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "bench") {
    pirn = seedControl().pirn;
    return pirnResult(classify(pirn), pirn, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "cropped" || verb === "incident") {
    pirn = seedCropped().pirn;
    return pirnResult(classify(pirn), pirn, { ...action, action: verb === "restore" ? "restore" : verb });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    pirn = { ...pirn, scored: true };
    return pirnResult(classify(pirn), pirn, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "wind") {
    pirn = { ...pirn, scored: true };
    return pirnResult(classify(pirn), pirn, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "wind" ? "score" : verb,
    });
  }

  pirn = { ...pirn, scored: true };
  return pirnResult(classify(pirn), pirn, action);
}
