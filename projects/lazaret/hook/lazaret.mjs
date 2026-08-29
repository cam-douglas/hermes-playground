/**
 * Lazaret — lazaretto / yellow-jack / pratique desk for Claude Code
 * per-Read malware system-reminders that refuse legitimate files.
 * A written reminder is not a hold. Score the desk or admit pratique.
 *
 * A lazaret is the quarantine station for arriving ships. The yellow
 * jack is not a hold. A per-Read malware system-reminder that fires
 * on legitimate code is a false cordon. In an unattended cloud
 * coding-agent seat there is no human to grant pratique, and a hard
 * wall-clock budget turns the refusal into total loss of the run.
 *
 * Primary #90326: Malware Read-reminder still causes refusals
 * (2026-08-28) — and in unattended cloud agent seats the refusal is
 * unrecoverable. Filed 2026-08-28, open. Per-Read malware
 * system-reminder still causes refusals on legitimate code four
 * months after earlier issues were closed. Reproduced on a GitHub
 * Agent HQ cloud coding-agent seat. The agent read a legitimate
 * TypeScript company-intelligence module, correctly described it as
 * not malware, then refused to improve it "per the system reminder"
 * and asked a human to confirm. Nobody was in the session.
 * COPILOT_AGENT_TIMEOUT_MIN: 15. No files written. No commits. Seat
 * timed out waiting for a confirmation no human could send.
 *
 * Corroboration (cite as shape, not a new primary):
 *   #52272 — Read tool's malware-safety reminder causes subagents
 *            to refuse legitimate code augmentation.
 *   #49363 — Regression: malware reminder on every Read still
 *            causes subagent refusals in v2.1.111 (fix from #47027
 *            / v2.1.92 did not hold).
 *   #47027 — Malware check prompts causing rapid quota exhaustion
 *            and code analysis refusals.
 *   #49484 — Read tool results have a "considered malware"
 *            system-reminder appended, causing model to refuse
 *            legitimate edits.
 *   #50760 — Read tool results contain an injected system-reminder
 *            about "malware".
 *
 * Verdicts: pratique | refused | lost | stranded | cordoned
 *           | yellow | false | timed | held | passed
 * Idle word is pratique (a ship's health clearance after quarantine).
 * NEVER use lazaret / quarantine / empty / malware / reminder as idle.
 * NEVER reuse bound, stilled, drained, flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home, valid, dry,
 * sealed, quiet, seised, stabled, wound.
 *
 * Slack lazaret alarm on refused / lost / stranded / cordoned /
 * yellow / false / timed. Linear ticket on refused / lost /
 * stranded / false. GitHub lazaret-ledger of bill events on every
 * scored probe.
 *
 * Why this is not a clone:
 * NOT Fusee (clockmaker fusee / early schedule dispatch).
 * NOT Iota (typesetter type-case / path-key identity).
 * NOT Leat (mill leat / sleep-block unbounded until-loop).
 * NOT Shunt (night railway / nested SendMessage misroute).
 * NOT Knock (fail-loud relay for stalled permission grants).
 * NOT Scrim (runtime DLP redacting tool_result).
 * NOT Veto (CLAUDE.md overlay).
 * NOT Sigil (hollow thinking signature).
 * NOT Wicket (isolation pin / worktree).
 * NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket /
 * Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk /
 * Snib / Assay / Stencil / Suture / Blot / Coda / Reed / Fathom /
 * Hasp / Parity / Reveille / Quench.
 * Different problem: safety-reminder false positive on legitimate
 * files bricks unattended cloud-agent seats; no human to confirm;
 * hard timeout is total loss.
 * Different UI: lazaretto / quarantine island / yellow jack /
 * pratique desk / bill of health / inspection lantern / stone
 * hospital on a spit of rock / salt air. Sea-stone, ochre yellow
 * jack, tarred rope, salt-white lime, verdigris lamp, tide.
 * NOT brass enamel clock. NOT typesetter case. NOT millrace.
 * NOT railway. NOT basement. NOT tailor. NOT timber. NOT ballot.
 * NOT coffin. NOT steam. NOT dove-cote. NOT chimney. NOT
 * permission-knock door. NOT DLP scrim.
 * Different idle: pratique.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Quarantine, Cordon, Lazaretto,
 * Plague, Yellow, Flag, Pratique (as a product name), Pest,
 * Hospital, Infirmary, Isolation, Lockdown, Malware, Reminder,
 * Refuse, Safety, Yellowjack, Jack, Quebec, Bill, Health, Scrim,
 * Knock, or Veto. Product name is Lazaret only.
 */

export const VERDICTS = Object.freeze([
  "pratique",
  "refused",
  "lost",
  "stranded",
  "cordoned",
  "yellow",
  "false",
  "timed",
  "held",
  "passed",
]);
export const IDLE_WORD = "pratique";
export const SLACK_VERDICTS = Object.freeze([
  "refused",
  "lost",
  "stranded",
  "cordoned",
  "yellow",
  "false",
  "timed",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "refused",
  "lost",
  "stranded",
  "false",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const MS_MINUTE = 60_000;
export const BUDGET_15_MIN_MS = 15 * MS_MINUTE;
export const FILE_LEGITIMATE = "src/lib/company-intelligence.server.ts";

const FORBIDDEN_IDLE = Object.freeze([
  "lazaret",
  "quarantine",
  "empty",
  "malware",
  "reminder",
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
  "wound",
  "quarantine",
  "cordon",
  "lazaretto",
  "plague",
  "yellow",
  "flag",
  "pest",
  "hospital",
  "infirmary",
  "isolation",
  "lockdown",
  "refuse",
  "safety",
  "yellowjack",
  "jack",
  "quebec",
  "bill",
  "health",
  "scrim",
  "knock",
  "veto",
  "fusee",
  "iota",
  "leat",
  "shunt",
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

export function asFileKind(value) {
  const text = asText(value).trim().toLowerCase();
  if (text === "legitimate" || text === "unknown" || text === "malware") return text;
  return "";
}

export function emptyProbe() {
  return {
    reminderFired: false,
    fileKind: "",
    refused: false,
    humanPresent: false,
    confirmationRequested: false,
    confirmationReceived: false,
    budgetMs: 0,
    stalledMs: 0,
    timedOut: false,
    workDone: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "pratique-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const bill = src.bill && typeof src.bill === "object" ? src.bill : {};
  const lazaret = src.lazaret && typeof src.lazaret === "object" ? src.lazaret : {};
  const quay = src.quay && typeof src.quay === "object" ? src.quay : {};
  const lantern = src.lantern && typeof src.lantern === "object" ? src.lantern : {};
  const jack = src.jack && typeof src.jack === "object" ? src.jack : {};
  const desk = src.desk && typeof src.desk === "object" ? src.desk : {};
  const pick = (key) =>
    src[key] ??
    bill[key] ??
    lazaret[key] ??
    quay[key] ??
    lantern[key] ??
    jack[key] ??
    desk[key];
  return {
    ...emptyProbe(),
    reminderFired: asBool(pick("reminderFired")),
    fileKind: asFileKind(pick("fileKind")),
    refused: asBool(pick("refused")),
    humanPresent: asBool(pick("humanPresent")),
    confirmationRequested: asBool(pick("confirmationRequested")),
    confirmationReceived: asBool(pick("confirmationReceived")),
    budgetMs: asNumber(pick("budgetMs"), 0),
    stalledMs: asNumber(pick("stalledMs"), 0),
    timedOut: asBool(pick("timedOut")),
    workDone: asBool(pick("workDone")),
    observed: asBool(src.observed ?? bill.observed ?? lazaret.observed ?? quay.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? bill.source ?? lazaret.source ?? quay.source),
    issue: asIssue(src.issue ?? bill.issue ?? lazaret.issue ?? quay.issue),
    scored: asBool(src.scored ?? bill.scored ?? lazaret.scored ?? quay.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.reminderFired &&
    !next.fileKind &&
    !next.refused &&
    !next.humanPresent &&
    !next.confirmationRequested &&
    !next.confirmationReceived &&
    next.budgetMs <= 0 &&
    next.stalledMs <= 0 &&
    !next.timedOut &&
    !next.workDone &&
    !next.observed
  );
}

export function lostSeatOf(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.reminderFired &&
    next.fileKind === "legitimate" &&
    next.refused &&
    !next.humanPresent &&
    next.confirmationRequested &&
    !next.confirmationReceived &&
    next.timedOut &&
    !next.workDone
  );
}

export function analyze(probe = {}) {
  const next = cloneProbe(probe);
  const lostSeat = lostSeatOf(next);
  const refusedLegitimate = next.refused && next.fileKind === "legitimate";
  const unattended = !next.humanPresent && next.confirmationRequested;
  const yellowJack = next.reminderFired && next.fileKind === "legitimate";
  const falsePositive = next.reminderFired && next.fileKind === "legitimate" && !next.refused;
  const uncertain = next.reminderFired && next.fileKind === "unknown";
  const budgetDead = next.timedOut;
  const waiting =
    next.confirmationRequested && !next.confirmationReceived && !next.timedOut;
  const cleared = next.confirmationReceived && next.workDone;
  return {
    lostSeat,
    refusedLegitimate,
    unattended,
    yellowJack,
    falsePositive,
    uncertain,
    budgetDead,
    waiting,
    cleared,
    reminderFired: next.reminderFired,
    fileKind: next.fileKind,
    refused: next.refused,
    humanPresent: next.humanPresent,
    confirmationRequested: next.confirmationRequested,
    confirmationReceived: next.confirmationReceived,
    timedOut: next.timedOut,
    workDone: next.workDone,
  };
}

export function lostFault(probe = {}) {
  return lostSeatOf(probe);
}

/**
 * First match wins. Idle pratique is first. Classes stay
 * distinguishable: a written reminder is not a hold. This is
 * a false cordon on a legitimate file — unattended seat, no
 * human to grant pratique, hard timeout is total loss.
 * NOT Fusee (early schedule). NOT Iota (path-key identity).
 * NOT Leat (until-loop). NOT Knock (permission grant).
 * NOT Scrim (DLP redaction). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "pratique";

  const facts = analyze(next);

  if (facts.lostSeat) return "lost";

  if (facts.refusedLegitimate) return "refused";

  if (facts.unattended && facts.waiting) return "stranded";

  if (facts.budgetDead && next.confirmationRequested && !next.confirmationReceived) {
    return "timed";
  }

  if (facts.reminderFired && !next.workDone && facts.waiting) return "cordoned";

  if (facts.falsePositive && facts.humanPresent && !next.confirmationRequested) {
    return "false";
  }

  if (facts.yellowJack && !next.refused && !next.confirmationRequested) return "yellow";

  if (facts.uncertain) return "held";

  if (facts.cleared) return "passed";

  return "pratique";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.lostSeat) add("lost");
  if (facts.refusedLegitimate) add("refused");
  if (facts.unattended && !next.confirmationReceived) add("stranded");
  if (facts.budgetDead && next.confirmationRequested && !next.confirmationReceived) {
    add("timed");
  }
  if (facts.reminderFired && !next.workDone && next.confirmationRequested) add("cordoned");
  if (facts.falsePositive && facts.humanPresent && !next.confirmationRequested) {
    add("false");
  }
  if (facts.yellowJack) add("yellow");
  if (facts.uncertain) add("held");
  if (facts.cleared) add("passed");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "lost") {
    return "● Lost · unattended cloud seat refused a legitimate module, asked for confirm, 15-minute budget died, no files written · primary #90326";
  }
  if (kind === "refused") {
    return "● Refused · interactive subagent refused a legitimate module per the system reminder";
  }
  if (kind === "stranded") {
    return "● Stranded · confirmation asked, nobody in the session";
  }
  if (kind === "cordoned") {
    return "● Cordoned · reminder fired, work stopped, waiting";
  }
  if (kind === "yellow") {
    return "● Yellow · reminder fired on a legitimate file · yellow jack is not a hold";
  }
  if (kind === "false") {
    return "● False · classified false-positive · a written reminder is not a hold";
  }
  if (kind === "timed") {
    return "● Timed · budget exhausted waiting for confirm";
  }
  if (kind === "held") {
    return "● Held · reminder fired, classification uncertain";
  }
  if (kind === "passed") {
    return "● Passed · human confirmed, work proceeded";
  }
  return "● Pratique · reminder not a hold · nothing scored · idle word is pratique";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.reminderFired
      ? "per-Read malware system-reminder fired"
      : "no malware reminder scored",
  );
  if (facts.fileKind) reasons.push(`fileKind ${facts.fileKind}`);
  reasons.push(facts.refused ? "agent refused the file" : "agent did not refuse");
  reasons.push(
    facts.humanPresent ? "a human was in the session" : "nobody was in the session",
  );
  if (facts.confirmationRequested) {
    reasons.push(
      facts.confirmationReceived
        ? "confirmation requested and received"
        : "confirmation requested, not received",
    );
  }
  if (next.budgetMs) reasons.push(`budgetMs ${next.budgetMs}`);
  if (next.stalledMs) reasons.push(`stalledMs ${next.stalledMs}`);
  if (facts.timedOut) {
    reasons.push("wall-clock budget exhausted waiting for confirm");
  }
  reasons.push(facts.workDone ? "work was done" : "no files written, no work done");
  if (next.observed) {
    reasons.push("Bill sounded: reminder vs legitimate file vs unattended seat");
  }
  reasons.push("a written reminder is not a hold");
  reasons.push(
    "NOT Fusee (early schedule) / Iota (path-key identity) / Leat (until-loop) / Knock (permission grant) / Scrim (DLP redaction) / leftover woodworking / millimetre-slider",
  );
  if (kind === "pratique") {
    reasons.push("reminder not a hold, or desk idle; idle word is pratique");
  }
  if (kind === "lost") {
    reasons.push(
      "PRIMARY #90326: Malware Read-reminder still causes refusals (2026-08-28) — and in unattended cloud agent seats the refusal is unrecoverable. Filed 2026-08-28, open. The agent read a legitimate TypeScript company-intelligence module, correctly described it as not malware, then refused to improve it per the system reminder and asked a human to confirm. Nobody was in the session. COPILOT_AGENT_TIMEOUT_MIN: 15. No files written. No commits. Seat timed out waiting for a confirmation no human could send",
    );
  }
  if (kind === "refused") {
    reasons.push(
      "Shape #52272 / #49363: Read tool's malware-safety reminder causes subagents to refuse legitimate code augmentation. Interactive session: a human could confirm, but the work stopped",
    );
  }
  if (kind === "stranded") {
    reasons.push(
      "PRIMARY #90326 unattended: confirmation asked, nobody in the session. The yellow jack is not a hold, but there is no one to grant pratique",
    );
  }
  if (kind === "cordoned") {
    reasons.push(
      "Reminder fired, work stopped, waiting. A written reminder is not a hold. The cordon is still up",
    );
  }
  if (kind === "yellow") {
    reasons.push(
      "Shape #49484 / #50760: Read tool results have a considered-malware system-reminder appended on a legitimate file. The yellow jack is not a hold",
    );
  }
  if (kind === "false") {
    reasons.push(
      "Classified false-positive. The file is legitimate. The reminder fired anyway. A written reminder is not a hold",
    );
  }
  if (kind === "timed") {
    reasons.push(
      "PRIMARY #90326 budget: COPILOT_AGENT_TIMEOUT_MIN 15. Time spent stalled waiting for confirm is the whole run",
    );
  }
  if (kind === "held") {
    reasons.push("Reminder fired, file kind unknown, classification uncertain");
  }
  if (kind === "passed") {
    reasons.push("human confirmed; work proceeded; pratique granted after the score");
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

export function pratiqueOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "pratique";
}

export function refusedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "refused";
}

export function lostOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "lost";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], pratique, refused, lost }
 * Deterministic. First match wins. Idle pratique first.
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
    pratique: pratiqueOf(next, verdict),
    refused: refusedOf(next, verdict),
    lost: lostOf(next, verdict),
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
    reminderFired: pick("reminderFired"),
    fileKind: pick("fileKind"),
    refused: pick("refused"),
    humanPresent: pick("humanPresent"),
    confirmationRequested: pick("confirmationRequested"),
    confirmationReceived: pick("confirmationReceived"),
    budgetMs: pick("budgetMs"),
    stalledMs: pick("stalledMs"),
    timedOut: pick("timedOut"),
    workDone: pick("workDone"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    bill: fromFields.bill,
    lazaret: fromFields.lazaret,
    quay: fromFields.quay,
    lantern: fromFields.lantern,
    jack: fromFields.jack,
    desk: fromFields.desk,
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
    product: "lazaret",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    pratique: scored.pratique,
    refused: scored.refused,
    lost: scored.lost,
    cluster: scored.cluster,
    billPratique: verdict === "pratique",
    billRefused: verdict === "refused",
    billLost: verdict === "lost",
    billStranded: verdict === "stranded",
    billCordoned: verdict === "cordoned",
    billYellow: verdict === "yellow",
    billFalse: verdict === "false",
    billTimed: verdict === "timed",
    billHeld: verdict === "held",
    billPassed: verdict === "passed",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    reminderFired: next.reminderFired,
    fileKind: next.fileKind,
    humanPresent: next.humanPresent,
    confirmationRequested: next.confirmationRequested,
    confirmationReceived: next.confirmationReceived,
    budgetMs: next.budgetMs,
    stalledMs: next.stalledMs,
    timedOut: next.timedOut,
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
      reminderFired: Boolean(extras.reminderFired),
      fileKind: extras.fileKind || "",
      refused: Boolean(extras.refused),
      humanPresent: Boolean(extras.humanPresent),
      confirmationRequested: Boolean(extras.confirmationRequested),
      confirmationReceived: Boolean(extras.confirmationReceived),
      budgetMs: extras.budgetMs != null ? Number(extras.budgetMs) : 0,
      stalledMs: extras.stalledMs != null ? Number(extras.stalledMs) : 0,
      timedOut: Boolean(extras.timedOut),
      workDone: Boolean(extras.workDone),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. Reminder not a hold. Nothing scored. */
export function seedPratique() {
  return seedProbe("pratique", "bill", {
    session: "pratique",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90326 lost.
 * Unattended cloud seat refused a legitimate module, asked for
 * confirm, 15-minute budget died, no files written.
 */
export function seed90326Lost() {
  return seedProbe(90326, "anthropics/claude-code#90326", {
    session: "90326-lost",
    reminderFired: true,
    fileKind: "legitimate",
    refused: true,
    humanPresent: false,
    confirmationRequested: true,
    confirmationReceived: false,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: BUDGET_15_MIN_MS,
    timedOut: true,
    workDone: false,
  });
}

/** Interactive subagent refused a legitimate module. */
export function seedRefused() {
  return seedProbe(52272, "anthropics/claude-code#52272", {
    session: "52272-refused",
    reminderFired: true,
    fileKind: "legitimate",
    refused: true,
    humanPresent: true,
    confirmationRequested: false,
    timedOut: false,
    workDone: false,
  });
}

/** Confirmation asked, nobody in the session. */
export function seedStranded() {
  return seedProbe(90326, "anthropics/claude-code#90326", {
    session: "90326-stranded",
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: false,
    confirmationRequested: true,
    confirmationReceived: false,
    timedOut: false,
    workDone: false,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: 4 * MS_MINUTE,
  });
}

/** Reminder fired, work stopped, waiting. */
export function seedCordoned() {
  return seedProbe(49484, "anthropics/claude-code#49484", {
    session: "49484-cordoned",
    reminderFired: true,
    fileKind: "unknown",
    refused: false,
    humanPresent: true,
    confirmationRequested: true,
    confirmationReceived: false,
    timedOut: false,
    workDone: false,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: 2 * MS_MINUTE,
  });
}

/** Reminder fired on a legitimate file. Yellow jack is not a hold. */
export function seedYellow() {
  return seedProbe(50760, "anthropics/claude-code#50760", {
    session: "50760-yellow",
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: false,
    confirmationRequested: false,
    timedOut: false,
    workDone: false,
  });
}

/** Classified false-positive. */
export function seedFalse() {
  return seedProbe(49484, "anthropics/claude-code#49484", {
    session: "49484-false",
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: true,
    confirmationRequested: false,
    timedOut: false,
    workDone: false,
  });
}

/** Budget exhausted waiting for confirm. */
export function seedTimed() {
  return seedProbe(90326, "anthropics/claude-code#90326", {
    session: "90326-timed",
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: true,
    confirmationRequested: true,
    confirmationReceived: false,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: BUDGET_15_MIN_MS,
    timedOut: true,
    workDone: false,
  });
}

/** Reminder fired, classification uncertain. */
export function seedHeld() {
  return seedProbe(47027, "anthropics/claude-code#47027", {
    session: "47027-held",
    reminderFired: true,
    fileKind: "unknown",
    refused: false,
    humanPresent: false,
    confirmationRequested: false,
    timedOut: false,
    workDone: false,
  });
}

/** Human confirmed, work proceeded. */
export function seedPassed() {
  return seedProbe("passed", "bill", {
    session: "passed",
    issue: null,
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: true,
    confirmationRequested: true,
    confirmationReceived: true,
    timedOut: false,
    workDone: true,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: MS_MINUTE,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const timeout = /COPILOT_AGENT_TIMEOUT_MIN[:\s]+(\d+)|(\d+)[-\s]?minute budget|timeout[:\s]+(\d+)/i.exec(
    text,
  );
  const minutes = timeout ? Number(timeout[1] || timeout[2] || timeout[3] || 15) : 0;
  return {
    reminderFired:
      /system reminder|malware reminder|considered malware|per the system reminder/i.test(text),
    fileKind: /legitimate|company-intelligence|not malware/i.test(text)
      ? "legitimate"
      : /unknown|uncertain/i.test(text)
        ? "unknown"
        : /malware/i.test(text)
          ? "malware"
          : "",
    refused: /must refuse|refused to improve|I cannot proceed|I'll stop here/i.test(text),
    humanPresent: /human (was )?present|interactive session|operator confirm/i.test(text),
    confirmationRequested: /please confirm|asked (a human )?to confirm|confirm and I/i.test(text),
    confirmationReceived: /confirmed|confirmation received|pratique granted/i.test(text),
    budgetMs: minutes ? minutes * MS_MINUTE : /15/.test(text) ? BUDGET_15_MIN_MS : 0,
    stalledMs: /timed out|timeout/i.test(text) ? BUDGET_15_MIN_MS : 0,
    timedOut: /timed out|timeout waiting|budget (died|exhausted)/i.test(text),
    workDone:
      /work proceeded|files (were )?written|commits (were )?pushed/i.test(text) &&
      !/no files were written|no commits/i.test(text),
    observed: /bill sounded|observed/i.test(text),
    session: /unattended|cloud seat|Agent HQ/i.test(text) ? "paste-lost" : "paste",
    source: /#90326/.test(text) ? "anthropics/claude-code#90326" : "paste",
    issue: /#90326/.test(text) ? 90326 : /#52272/.test(text) ? 52272 : null,
    scored: true,
  };
}

const SEEDS = {
  pratique: seedPratique,
  lost: seed90326Lost,
  90326: seed90326Lost,
  "90326-lost": seed90326Lost,
  refused: seedRefused,
  52272: seedRefused,
  "52272-refused": seedRefused,
  stranded: seedStranded,
  "90326-stranded": seedStranded,
  cordoned: seedCordoned,
  49484: seedCordoned,
  "49484-cordoned": seedCordoned,
  yellow: seedYellow,
  50760: seedYellow,
  "50760-yellow": seedYellow,
  false: seedFalse,
  "49484-false": seedFalse,
  timed: seedTimed,
  "90326-timed": seedTimed,
  held: seedHeld,
  47027: seedHeld,
  "47027-held": seedHeld,
  passed: seedPassed,
};

function lostStrike(session) {
  return {
    ...emptyProbe(),
    reminderFired: true,
    fileKind: "legitimate",
    refused: true,
    humanPresent: false,
    confirmationRequested: true,
    confirmationReceived: false,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: BUDGET_15_MIN_MS,
    timedOut: true,
    workDone: false,
    session: session || "lost",
    source: "bill",
    issue: 90326,
    scored: true,
  };
}

function pratiqueHold(session) {
  return {
    ...emptyProbe(),
    session: session || "pratique",
    source: "hold",
    scored: true,
  };
}

function passedHold(session) {
  return {
    ...emptyProbe(),
    reminderFired: true,
    fileKind: "legitimate",
    refused: false,
    humanPresent: true,
    confirmationRequested: true,
    confirmationReceived: true,
    timedOut: false,
    workDone: true,
    budgetMs: BUDGET_15_MIN_MS,
    stalledMs: MS_MINUTE,
    session: session || "passed",
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

  if (verb === "bail" || verb === "pratique" || verb === "still") {
    return pack("pratique", emptyProbe(), { ...action, action: verb === "still" ? "bail" : verb });
  }

  if (verb === "passed" || verb === "proof" || verb === "grant") {
    probe = passedHold(action.session || probe.session);
    return pack(classify(probe), probe, {
      ...action,
      action: verb === "proof" || verb === "grant" ? "passed" : verb,
    });
  }

  if (verb === "bill" || verb === "lantern" || verb === "jack") {
    probe = lostStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bill" });
  }

  if (verb === "pratique-out" || verb === "close-bill" || verb === "rest") {
    probe = pratiqueHold(action.session || probe.session);
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
