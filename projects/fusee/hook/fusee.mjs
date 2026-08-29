/**
 * Fusee — clockmaker's fusee / conical-pulley desk for Claude Code
 * scheduled tasks that dispatch ahead of their configured fire time.
 * A written cron / fireAt is not a hold. Score the dial or admit wound.
 *
 * A fusee is the conical pulley that equalizes mainspring force so a
 * clock does not race. When the scheduler fires early (95 days,
 * 27 days, 3h40m in the primary report), the spring has raced —
 * the fusee desk catches it.
 *
 * Primary #90485: Scheduled tasks dispatch ahead of their configured
 * fire time (3 confirmed instances). Filed 2026-08-29, open.
 * ~95 days early (DST fleet rewrite would have applied months early),
 * ~3h40m early (verification task before the slot), ~27 days early
 * (trial-cancellation evaluation). Tasks use create_scheduled_task /
 * list_scheduled_tasks / update_scheduled_task; both recurring
 * cronExpression (5-field local) and one-off fireAt (ISO 8601 with
 * offset). Authors now hand-write wall-clock guards into every task
 * prompt (41+) because nothing in the scheduler prevents early
 * dispatch.
 *
 * Corroboration (cite as shape, not a new primary):
 *   #77657 — lastRunAt/nextRunAt inconsistent with actual execution.
 *   #89942 — Scheduled task never records lastRunAt despite normal
 *            recurring cron.
 *   #89936 — lastRunAt never updates while nextRunAt keeps advancing
 *            (silently never executes).
 *   #89811 — Scheduled tasks report success but silently perform
 *            zero work.
 *   #85565 — Desktop update wiped scheduledTasks: [] with zero
 *            notification.
 *
 * Verdicts: wound | early | sprung | raced | ahead | jumped
 *           | premature | voided | held | true
 * Idle word is wound (spring regulated; fire time honored).
 * NEVER use fusee / clock / early / empty / schedule as idle.
 * NEVER reuse bound, stilled, drained, flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home, valid, dry,
 * sealed, quiet, seised, stabled.
 *
 * Slack fusee alarm on early / sprung / raced / ahead / jumped /
 * premature / voided. Linear ticket on early / sprung / raced /
 * ahead / premature. GitHub fusee-ledger of dial events on every
 * scored probe.
 *
 * Why this is not a clone:
 * NOT Iota (path-key identity / type-case).
 * NOT Leat (sleep-block unbounded until-loop).
 * NOT Shunt (nested SendMessage misroute).
 * NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket /
 * Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk /
 * Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot /
 * Coda / Reed / Fathom / Hasp / Parity / Reveille / Quench / Scrim /
 * Knock.
 * Different problem: scheduler fires before configured fireAt/cron
 * slot; no early-dispatch guard in the platform.
 * Different UI: clockmaker's fusee / conical pulley / escapement /
 * dial / mainspring / arbor / winding key. Brass, enamel dial,
 * lamp oil, oak case. NOT typesetter case. NOT millrace. NOT
 * railway. NOT basement. NOT tailor. NOT timber. NOT ballot. NOT
 * coffin. NOT steam. NOT dove-cote. NOT chimney.
 * Different idle: wound.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Escapement, Pallet, Gnomon, Tocsin,
 * Clepsydra, Mainspring, Arbor, Barrel, Crown, Stem, Dial, Strike,
 * Chime, Horology, Chronometer, Premature, Ahead, Jump, Race,
 * Early, Sprung, Clock, Watch, Timer, Cron, Schedule, Alarm, Bell,
 * or Fuse. Product name is Fusee only.
 */

export const VERDICTS = Object.freeze([
  "wound",
  "early",
  "sprung",
  "raced",
  "ahead",
  "jumped",
  "premature",
  "voided",
  "held",
  "true",
]);
export const IDLE_WORD = "wound";
export const SLACK_VERDICTS = Object.freeze([
  "early",
  "sprung",
  "raced",
  "ahead",
  "jumped",
  "premature",
  "voided",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "early",
  "sprung",
  "raced",
  "ahead",
  "premature",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const MS_DAY = 86_400_000;
export const MS_HOUR = 3_600_000;
export const MS_MINUTE = 60_000;
export const EARLY_95_DAYS_MS = 95 * MS_DAY;
export const EARLY_27_DAYS_MS = 27 * MS_DAY;
export const EARLY_3H40M_MS = 3 * MS_HOUR + 40 * MS_MINUTE;
export const DST_CONFIGURED_AT = "2026-11-01T02:00:00.000+11:00";
export const DST_DISPATCHED_AT = "2026-07-29T02:00:00.000+10:00";

const FORBIDDEN_IDLE = Object.freeze([
  "fusee",
  "clock",
  "early",
  "empty",
  "schedule",
  "bound",
  "stilled",
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
  "stabled",
  "escapement",
  "pallet",
  "gnomon",
  "tocsin",
  "clepsydra",
  "mainspring",
  "arbor",
  "barrel",
  "crown",
  "stem",
  "dial",
  "strike",
  "chime",
  "horology",
  "chronometer",
  "premature",
  "ahead",
  "jump",
  "race",
  "sprung",
  "watch",
  "timer",
  "cron",
  "alarm",
  "bell",
  "fuse",
  "iota",
  "leat",
  "shunt",
  "sump",
  "pleat",
  "scant",
  "chad",
  "kist",
  "wraith",
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

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asKind(value) {
  const text = asText(value).trim();
  if (text === "cron" || text === "fireAt") return text;
  return "";
}

export function parseTime(value) {
  const text = asText(value).trim();
  if (!text) return NaN;
  const t = Date.parse(text);
  return Number.isFinite(t) ? t : NaN;
}

export function earlyMsOf(probe = {}) {
  if (probe.earlyByMs != null && probe.earlyByMs !== "") {
    const n = Number(probe.earlyByMs);
    if (Number.isFinite(n)) return n;
  }
  const configured = parseTime(probe.configuredAt || probe.fireAt);
  const dispatched = parseTime(probe.dispatchedAt);
  if (Number.isFinite(configured) && Number.isFinite(dispatched)) {
    return configured - dispatched;
  }
  return 0;
}

export function kindOf(probe = {}) {
  const explicit = asKind(probe.kind);
  if (explicit) return explicit;
  if (asText(probe.cronExpression)) return "cron";
  if (asText(probe.fireAt)) return "fireAt";
  return "";
}

export function isPrematureTask(probe = {}) {
  const text = [probe.session, probe.source, probe.cronExpression, probe.observed].join(" ");
  return /evaluation|trial-cancellation|decision task/i.test(text);
}

export function timestampsHeld(probe = {}) {
  const last = asText(probe.lastRunAt);
  const next = asText(probe.nextRunAt);
  const dispatched = asText(probe.dispatchedAt);
  const lastMismatch = Boolean(last && dispatched && last !== dispatched);
  const neverRecords = !last && Boolean(next) && (Boolean(dispatched) || asBool(probe.reportedSuccess));
  const nextAdvances = Boolean(next) && !last && asBool(probe.reportedSuccess);
  return lastMismatch || neverRecords || nextAdvances;
}

export function emptyProbe() {
  return {
    configuredAt: "",
    dispatchedAt: "",
    kind: "",
    cronExpression: "",
    fireAt: "",
    earlyByMs: 0,
    guardCaught: false,
    lastRunAt: "",
    nextRunAt: "",
    reportedSuccess: false,
    workDone: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "wound-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const dial = src.dial && typeof src.dial === "object" ? src.dial : {};
  const fusee = src.fusee && typeof src.fusee === "object" ? src.fusee : {};
  const cone = src.cone && typeof src.cone === "object" ? src.cone : {};
  const arbor = src.arbor && typeof src.arbor === "object" ? src.arbor : {};
  const escapement = src.escapement && typeof src.escapement === "object" ? src.escapement : {};
  const mainspring = src.mainspring && typeof src.mainspring === "object" ? src.mainspring : {};
  const pick = (key) =>
    src[key] ??
    dial[key] ??
    fusee[key] ??
    cone[key] ??
    arbor[key] ??
    escapement[key] ??
    mainspring[key];
  const next = {
    ...emptyProbe(),
    configuredAt: asText(pick("configuredAt")),
    dispatchedAt: asText(pick("dispatchedAt")),
    kind: asKind(pick("kind")),
    cronExpression: asText(pick("cronExpression")),
    fireAt: asText(pick("fireAt")),
    earlyByMs: asNumber(pick("earlyByMs"), 0),
    guardCaught: asBool(pick("guardCaught")),
    lastRunAt: asText(pick("lastRunAt")),
    nextRunAt: asText(pick("nextRunAt")),
    reportedSuccess: asBool(pick("reportedSuccess")),
    workDone: asBool(pick("workDone")),
    observed: asBool(src.observed ?? dial.observed ?? fusee.observed ?? cone.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? dial.source ?? fusee.source ?? cone.source),
    issue: asIssue(src.issue ?? dial.issue ?? fusee.issue ?? cone.issue),
    scored: asBool(src.scored ?? dial.scored ?? fusee.scored ?? cone.scored),
  };
  if (!next.earlyByMs) {
    next.earlyByMs = earlyMsOf({
      ...next,
      earlyByMs: pick("earlyByMs"),
    });
  }
  if (!next.kind) next.kind = kindOf(next);
  return next;
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.configuredAt &&
    !next.dispatchedAt &&
    !next.kind &&
    !next.cronExpression &&
    !next.fireAt &&
    next.earlyByMs <= 0 &&
    !next.guardCaught &&
    !next.lastRunAt &&
    !next.nextRunAt &&
    !next.reportedSuccess &&
    !next.workDone &&
    !next.observed
  );
}

export function analyze(probe = {}) {
  const next = cloneProbe(probe);
  const earlyByMs = earlyMsOf(next);
  const kind = kindOf(next);
  const isEarly = earlyByMs > 0;
  const isDaysPlus = earlyByMs >= MS_DAY;
  const is95Day = earlyByMs >= 90 * MS_DAY;
  const isFireAt = kind === "fireAt" || Boolean(next.fireAt);
  const isCron = kind === "cron" || Boolean(next.cronExpression);
  const premature = isPrematureTask(next);
  const held = timestampsHeld(next);
  const configuredMs = parseTime(next.configuredAt || next.fireAt);
  const dispatchedMs = parseTime(next.dispatchedAt);
  const timesMatch =
    Boolean(next.configuredAt || next.fireAt) &&
    Boolean(next.dispatchedAt) &&
    earlyByMs <= 0 &&
    (!Number.isFinite(configuredMs) ||
      !Number.isFinite(dispatchedMs) ||
      configuredMs === dispatchedMs ||
      earlyByMs === 0);
  return {
    earlyByMs,
    kind,
    isEarly,
    isDaysPlus,
    is95Day,
    isFireAt,
    isCron,
    premature,
    held,
    timesMatch,
    guardCaught: next.guardCaught,
  };
}

export function earlyFault(probe = {}) {
  const facts = analyze(probe);
  return facts.is95Day && facts.isCron;
}

/**
 * First match wins. Idle wound is first. Classes stay
 * distinguishable: a written cron is not a hold. This is
 * scheduler fire-time — configured slot vs actual dispatch.
 * NOT Iota (path-key identity). NOT Leat (until-loop).
 * NOT Shunt (nested SendMessage). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "wound";

  const facts = analyze(next);

  if (facts.guardCaught) return "voided";

  if (facts.held && !facts.isEarly) return "held";

  if (facts.premature && facts.isEarly) return "premature";

  if (facts.is95Day) return "early";

  if (facts.isDaysPlus) return "raced";

  if (facts.isFireAt && facts.isEarly) return "ahead";

  if (facts.isCron && facts.isEarly) return "jumped";

  if (facts.isEarly) return "sprung";

  if (facts.timesMatch) return "true";

  return "wound";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.guardCaught) add("voided");
  if (facts.held) add("held");
  if (facts.premature && facts.isEarly) add("premature");
  if (facts.is95Day) add("early");
  if (facts.isDaysPlus) add("raced");
  if (facts.isFireAt && facts.isEarly) add("ahead");
  if (facts.isCron && facts.isEarly) add("jumped");
  if (facts.isEarly) add("sprung");
  if (facts.timesMatch) add("true");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "early") {
    return "● Early · dispatched ~95 days before the DST fleet rewrite slot · primary #90485";
  }
  if (kind === "sprung") {
    return "● Sprung · spring released before the dial says so";
  }
  if (kind === "raced") {
    return "● Raced · dispatch raced ahead of the configured slot by a large margin (days+)";
  }
  if (kind === "ahead") {
    return "● Ahead · fireAt one-off ran early";
  }
  if (kind === "jumped") {
    return "● Jumped · cron slot jumped early";
  }
  if (kind === "premature") {
    return "● Premature · evaluation/decision task ran before its window";
  }
  if (kind === "voided") {
    return "● Voided · early dispatch caught only by a hand-written wall-clock guard";
  }
  if (kind === "held") {
    return "● Held · nextRunAt/lastRunAt inconsistent with actual execution";
  }
  if (kind === "true") {
    return "● True · configured time matches actual dispatch wall clock";
  }
  return "● Wound · spring regulated · fire time honored · idle word is wound";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.earlyByMs > 0
      ? `dispatched ${facts.earlyByMs}ms before the configured slot`
      : "no early-by margin scored",
  );
  if (facts.kind) reasons.push(`kind ${facts.kind}`);
  if (next.cronExpression) reasons.push(`cronExpression ${next.cronExpression}`);
  if (next.fireAt) reasons.push(`fireAt ${next.fireAt}`);
  if (next.configuredAt) reasons.push(`configuredAt ${next.configuredAt}`);
  if (next.dispatchedAt) reasons.push(`dispatchedAt ${next.dispatchedAt}`);
  if (facts.guardCaught) {
    reasons.push("hand-written wall-clock guard in the task prompt caught the early fire");
  }
  if (facts.held) {
    reasons.push("lastRunAt/nextRunAt inconsistent with actual execution (shape #77657)");
  }
  if (!next.lastRunAt && next.nextRunAt) {
    reasons.push("lastRunAt never recorded while nextRunAt keeps advancing (shape #89942 / #89936)");
  }
  if (next.reportedSuccess && !next.workDone) {
    reasons.push("reported success but silently performed zero work (shape #89811)");
  }
  if (facts.premature) {
    reasons.push("evaluation/decision/trial-cancellation task scored before its window");
  }
  if (facts.is95Day) {
    reasons.push("~95-day early margin; DST fleet rewrite would have applied months early");
  }
  if (facts.isDaysPlus && !facts.is95Day) {
    reasons.push("days+ early margin; the spring raced ahead of the configured slot");
  }
  if (facts.isFireAt && facts.isEarly) {
    reasons.push("one-off fireAt ran before the ISO slot");
  }
  if (facts.isCron && facts.isEarly) {
    reasons.push("recurring 5-field cron slot jumped early");
  }
  if (next.observed) {
    reasons.push("Dial sounded: configured slot vs actual dispatch wall clock");
  }
  reasons.push("a written cron / fireAt is not a hold");
  reasons.push(
    "NOT Iota (path-key identity / type-case) / Leat (until-loop) / Shunt (nested SendMessage) / leftover woodworking / millimetre-slider",
  );
  if (kind === "wound") {
    reasons.push("spring regulated, fire time honored, or desk idle; idle word is wound");
  }
  if (kind === "early") {
    reasons.push(
      "PRIMARY #90485: Scheduled tasks dispatch ahead of their configured fire time. Filed 2026-08-29, open. Three confirmed early dispatches. ~95 days early: DST fleet rewrite would have applied months early. Tasks use create_scheduled_task / list_scheduled_tasks / update_scheduled_task. Authors now hand-write wall-clock guards into every task prompt (41+) because nothing in the scheduler prevents early dispatch",
    );
  }
  if (kind === "sprung") {
    reasons.push("Spring released before the enamel dial says so. The fusee did not equalize the pull");
  }
  if (kind === "raced") {
    reasons.push("Dispatch raced ahead of the configured slot by a large margin (days+)");
  }
  if (kind === "ahead") {
    reasons.push("PRIMARY #90485 one-off: fireAt (ISO 8601 with offset) ran ~3h40m early (verification task before the slot)");
  }
  if (kind === "jumped") {
    reasons.push("Recurring cronExpression (5-field local) jumped the slot");
  }
  if (kind === "premature") {
    reasons.push("PRIMARY #90485 evaluation: trial-cancellation evaluation ran ~27 days early");
  }
  if (kind === "voided") {
    reasons.push(
      "PRIMARY #90485: early dispatch caught only by a hand-written wall-clock guard in the prompt. The platform has no hold",
    );
  }
  if (kind === "held") {
    reasons.push(
      "Shape #77657 / #89942 / #89936: lastRunAt/nextRunAt inconsistent with actual execution. lastRunAt never records or never updates while nextRunAt keeps advancing",
    );
  }
  if (kind === "true") {
    reasons.push("configured time matches actual dispatch wall clock");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) {
    reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function woundOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "wound";
}

export function earlyOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "early";
}

export function sprungOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "sprung";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], wound, early, sprung }
 * Deterministic. First match wins. Idle wound first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  const cluster = clusterOf(next, verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    wound: woundOf(next, verdict),
    early: earlyOf(next, verdict),
    sprung: sprungOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    configuredAt: pick("configuredAt"),
    dispatchedAt: pick("dispatchedAt"),
    kind: pick("kind"),
    cronExpression: pick("cronExpression"),
    fireAt: pick("fireAt"),
    earlyByMs: pick("earlyByMs"),
    guardCaught: pick("guardCaught"),
    lastRunAt: pick("lastRunAt"),
    nextRunAt: pick("nextRunAt"),
    reportedSuccess: pick("reportedSuccess"),
    workDone: pick("workDone"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    dial: fromFields.dial,
    fusee: fromFields.fusee,
    cone: fromFields.cone,
    arbor: fromFields.arbor,
    escapement: fromFields.escapement,
    mainspring: fromFields.mainspring,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "fusee",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    wound: scored.wound,
    early: scored.early,
    sprung: scored.sprung,
    cluster: scored.cluster,
    dialWound: verdict === "wound",
    dialEarly: verdict === "early",
    dialSprung: verdict === "sprung",
    dialRaced: verdict === "raced",
    dialAhead: verdict === "ahead",
    dialJumped: verdict === "jumped",
    dialPremature: verdict === "premature",
    dialVoided: verdict === "voided",
    dialHeld: verdict === "held",
    dialTrue: verdict === "true",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    configuredAt: next.configuredAt,
    dispatchedAt: next.dispatchedAt,
    kind: next.kind,
    cronExpression: next.cronExpression,
    fireAt: next.fireAt,
    earlyByMs: next.earlyByMs,
    guardCaught: next.guardCaught,
    lastRunAt: next.lastRunAt,
    nextRunAt: next.nextRunAt,
    reportedSuccess: next.reportedSuccess,
    workDone: next.workDone,
    observed: next.observed,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
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
      configuredAt: extras.configuredAt || "",
      dispatchedAt: extras.dispatchedAt || "",
      kind: extras.kind || "",
      cronExpression: extras.cronExpression || "",
      fireAt: extras.fireAt || "",
      earlyByMs: extras.earlyByMs != null ? Number(extras.earlyByMs) : 0,
      guardCaught: Boolean(extras.guardCaught),
      lastRunAt: extras.lastRunAt || "",
      nextRunAt: extras.nextRunAt || "",
      reportedSuccess: Boolean(extras.reportedSuccess),
      workDone: Boolean(extras.workDone),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. Spring regulated. Nothing scored. */
export function seedWound() {
  return seedProbe("wound", "dial", {
    session: "wound",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90485 early.
 * ~95-day DST fleet rewrite would have applied months early.
 */
export function seed90485Early() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-early",
    configuredAt: DST_CONFIGURED_AT,
    dispatchedAt: DST_DISPATCHED_AT,
    kind: "cron",
    cronExpression: "0 2 1 11 *",
    earlyByMs: EARLY_95_DAYS_MS,
    lastRunAt: DST_DISPATCHED_AT,
    nextRunAt: "2027-11-01T02:00:00.000+11:00",
    reportedSuccess: true,
    workDone: true,
  });
}

/** Spring released before the dial says so. Generic early, no kind. */
export function seedSprung() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-sprung",
    configuredAt: "2026-08-29T12:00:00.000+10:00",
    dispatchedAt: "2026-08-29T11:40:00.000+10:00",
    earlyByMs: 20 * MS_MINUTE,
  });
}

/** Dispatch raced ahead of the configured slot by a large margin (days+). */
export function seedRaced() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-raced",
    configuredAt: "2026-09-25T09:00:00.000+10:00",
    dispatchedAt: "2026-08-29T09:00:00.000+10:00",
    kind: "cron",
    cronExpression: "0 9 25 9 *",
    earlyByMs: EARLY_27_DAYS_MS,
    reportedSuccess: true,
    workDone: true,
  });
}

/** fireAt one-off ran ~3h40m early (verification task before the slot). */
export function seedAhead() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-ahead",
    configuredAt: "2026-08-29T12:00:00.000+10:00",
    dispatchedAt: "2026-08-29T08:20:00.000+10:00",
    kind: "fireAt",
    fireAt: "2026-08-29T12:00:00.000+10:00",
    earlyByMs: EARLY_3H40M_MS,
    reportedSuccess: true,
    workDone: true,
  });
}

/** Cron slot jumped early (hours, not days). */
export function seedJumped() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-jumped",
    configuredAt: "2026-08-29T14:00:00.000+10:00",
    dispatchedAt: "2026-08-29T12:00:00.000+10:00",
    kind: "cron",
    cronExpression: "0 14 * * *",
    earlyByMs: 2 * MS_HOUR,
    reportedSuccess: true,
    workDone: true,
  });
}

/** Trial-cancellation evaluation ran ~27 days before its window. */
export function seedPremature() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-premature-evaluation",
    configuredAt: "2026-09-25T09:00:00.000+10:00",
    dispatchedAt: "2026-08-29T09:00:00.000+10:00",
    kind: "cron",
    cronExpression: "0 9 25 9 *",
    earlyByMs: EARLY_27_DAYS_MS,
    reportedSuccess: true,
    workDone: true,
    source: "anthropics/claude-code#90485 trial-cancellation evaluation",
  });
}

/** Early dispatch caught only by a hand-written wall-clock guard. */
export function seedVoided() {
  return seedProbe(90485, "anthropics/claude-code#90485", {
    session: "90485-voided",
    configuredAt: "2026-08-29T18:00:00.000+10:00",
    dispatchedAt: "2026-08-29T16:00:00.000+10:00",
    kind: "cron",
    cronExpression: "0 18 * * *",
    earlyByMs: 2 * MS_HOUR,
    guardCaught: true,
    reportedSuccess: false,
    workDone: false,
  });
}

/** lastRunAt/nextRunAt inconsistent with actual (shape #77657). */
export function seedHeld() {
  return seedProbe(77657, "anthropics/claude-code#77657", {
    session: "77657-held",
    configuredAt: "2026-08-29T10:00:00.000+10:00",
    dispatchedAt: "2026-08-29T10:00:00.000+10:00",
    kind: "cron",
    cronExpression: "0 10 * * *",
    earlyByMs: 0,
    lastRunAt: "",
    nextRunAt: "2026-08-30T10:00:00.000+10:00",
    reportedSuccess: true,
    workDone: false,
  });
}

/** Configured time matches actual dispatch wall clock. */
export function seedTrue() {
  return seedProbe("true", "dial", {
    session: "true",
    issue: null,
    configuredAt: "2026-08-29T10:50:00.000+10:00",
    dispatchedAt: "2026-08-29T10:50:00.000+10:00",
    kind: "cron",
    cronExpression: "50 10 * * *",
    earlyByMs: 0,
    lastRunAt: "2026-08-29T10:50:00.000+10:00",
    nextRunAt: "2026-08-30T10:50:00.000+10:00",
    reportedSuccess: true,
    workDone: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const iso = text.match(/\d{4}-\d{2}-\d{2}T[^\s"'`]+/g) || [];
  const configured =
    /configured(?:At)?[:\s]+(\S+)/i.exec(text)?.[1] ||
    /fireAt[:\s]+(\S+)/i.exec(text)?.[1] ||
    iso[0] ||
    "";
  const dispatched =
    /dispatched(?:At)?[:\s]+(\S+)/i.exec(text)?.[1] ||
    iso[1] ||
    "";
  const cron = /cron(?:Expression)?[:\s]+([0-9*,/\- ]+)/i.exec(text);
  const fire = /fireAt[:\s]+(\S+)/i.exec(text);
  const days = /~?\s*(\d+)\s*days?\s+early/i.exec(text);
  const hours = /~?\s*(\d+)h(?:(\d+)m)?\s+early|(\d+)\s*hours?\s+early/i.exec(text);
  let earlyByMs = 0;
  if (days) earlyByMs = Number(days[1]) * MS_DAY;
  else if (hours) {
    earlyByMs = Number(hours[1] || hours[3] || 0) * MS_HOUR;
    if (hours[2]) earlyByMs += Number(hours[2]) * MS_MINUTE;
  }
  const kind = /fireAt/i.test(text) && !/cron/i.test(text) ? "fireAt" : /cron/i.test(text) ? "cron" : "";
  return {
    configuredAt: configured.replace(/[.,;]+$/, ""),
    dispatchedAt: dispatched.replace(/[.,;]+$/, ""),
    kind,
    cronExpression: cron ? cron[1].trim() : "",
    fireAt: fire ? fire[1].replace(/[.,;]+$/, "") : "",
    earlyByMs,
    guardCaught: /wall-clock guard|hand-written guard|guard caught/i.test(text),
    lastRunAt: /lastRunAt[:\s]+(\S+)/i.exec(text)?.[1] || "",
    nextRunAt: /nextRunAt[:\s]+(\S+)/i.exec(text)?.[1] || "",
    reportedSuccess: /report(?:ed)? success/i.test(text),
    workDone: /work done|performed work/i.test(text) && !/zero work/i.test(text),
    observed: /dial sounded|observed/i.test(text),
    session: /evaluation|trial-cancellation/i.test(text) ? "paste-evaluation" : "paste",
    source: /#90485/.test(text) ? "anthropics/claude-code#90485" : "paste",
    issue: /#90485/.test(text) ? 90485 : /#77657/.test(text) ? 77657 : null,
    scored: true,
  };
}

const SEEDS = {
  wound: seedWound,
  early: seed90485Early,
  90485: seed90485Early,
  "90485-early": seed90485Early,
  sprung: seedSprung,
  "90485-sprung": seedSprung,
  raced: seedRaced,
  "90485-raced": seedRaced,
  ahead: seedAhead,
  "90485-ahead": seedAhead,
  jumped: seedJumped,
  "90485-jumped": seedJumped,
  premature: seedPremature,
  "90485-premature": seedPremature,
  voided: seedVoided,
  "90485-voided": seedVoided,
  held: seedHeld,
  77657: seedHeld,
  "77657-held": seedHeld,
  true: seedTrue,
};

function earlyStrike(session) {
  return {
    ...emptyProbe(),
    configuredAt: DST_CONFIGURED_AT,
    dispatchedAt: DST_DISPATCHED_AT,
    kind: "cron",
    cronExpression: "0 2 1 11 *",
    earlyByMs: EARLY_95_DAYS_MS,
    lastRunAt: DST_DISPATCHED_AT,
    nextRunAt: "2027-11-01T02:00:00.000+11:00",
    reportedSuccess: true,
    workDone: true,
    session: session || "early",
    source: "dial",
    issue: 90485,
    scored: true,
  };
}

function woundHold(session) {
  return {
    ...emptyProbe(),
    session: session || "wound",
    source: "hold",
    scored: true,
  };
}

function trueHold(session) {
  return {
    ...emptyProbe(),
    configuredAt: "2026-08-29T10:50:00.000+10:00",
    dispatchedAt: "2026-08-29T10:50:00.000+10:00",
    kind: "cron",
    cronExpression: "50 10 * * *",
    earlyByMs: 0,
    lastRunAt: "2026-08-29T10:50:00.000+10:00",
    nextRunAt: "2026-08-30T10:50:00.000+10:00",
    reportedSuccess: true,
    workDone: true,
    session: session || "true",
    source: "proof",
    scored: true,
  };
}

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

  if (verb === "bail" || verb === "wound" || verb === "still") {
    return pack("wound", emptyProbe(), { ...action, action: verb === "still" ? "bail" : verb });
  }

  if (verb === "true" || verb === "proof" || verb === "honor") {
    probe = trueHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: verb === "proof" || verb === "honor" ? "true" : verb });
  }

  if (verb === "dial" || verb === "wind" || verb === "key") {
    probe = earlyStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "dial" });
  }

  if (verb === "wound-out" || verb === "close-dial" || verb === "rest") {
    probe = woundHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bail" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "throw") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "throw" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
