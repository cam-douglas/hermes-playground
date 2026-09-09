#!/usr/bin/env node
/**
 * Hallmark — silversmith hallmark / assay booth.
 *
 * Educational diagnostic model for a published resume defect:
 * --resume should restore the exact model the session started with,
 * including the [1m] purity mark, a 1,000,000 context window, and
 * the context-1m-2025-08-07 anthropic-beta header — regardless of
 * ANTHROPIC_BASE_URL host and regardless of the settings default.
 * Instead, when BASE_URL is a non-first-party host and the session
 * model differs from settings.json `model`, resume rubs the hallmark
 * off: bare claude-fable-5-1, contextWindow 200000, beta header gone.
 *
 *   node hallmark.mjs data/debased.json
 *   echo '{"seed":"debased"}' | node hallmark.mjs
 *
 * Idle word is sterling (HOLD: resume restores exact modelId with
 * [1m], contextWindow 1000000, anthropic-beta carries
 * context-1m-2025-08-07, regardless of host and settings default).
 * Seeded word is debased (#93021: resume restores bare model
 * without [1m], contextWindow 200000, beta header missing, when
 * BASE_URL is non-first-party and settings model differs).
 * Path word is rubbed.
 *
 * Encoded from anthropics/claude-code#93021 issue body only.
 * Hypothesis (NON-BINDING): resume may fall back to the API-echoed
 * bare model id / settings default when the host is non-first-party
 * instead of restoring the transcript's modelId with [1m] and the
 * beta header; verify against #93021 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sterling",
  "debased",
  "bare-model-id",
  "missing-1m-suffix",
  "context-window-200k",
  "beta-header-missing",
  "non-first-party-base-url",
  "settings-model-mismatch",
  "transcript-modelId-ignored",
  "api-echoed-bare-id",
  "proxy-masked-on-first-party",
  "matching-settings-keeps-1m",
  "has-repro",
  "hold",
  "rubbed",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "sterling";
export const PATH_WORD = "rubbed";
export const SEEDED_WORD = "debased";
export const HOLD = Object.freeze(["sterling", "hold"]);
export const RECOVER = Object.freeze(["sterling", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "sterling" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "primed",
  "flashed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "debased"),
);

export const FEATURED_ISSUE = 93021;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93021";
export const TITLE =
  "[BUG] --resume loses [1m] context window on non-first-party ANTHROPIC_BASE_URL when session model differs from default";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:providers",
]);
export const REPORTER = "DimitarKrastev";
export const FILED_AT = "2026-09-09T07:47:27Z";
export const PRODUCT =
  "Claude Code 2.1.266, macOS, Terminal.app";
export const AUTH =
  "Anthropic OAuth (claude.ai subscription), not an API key";
export const DARWIN = "25.4.0";
export const MACOS = "26";
export const SESSION_IDS_REPRODUCED = 3;
export const REPRO_RATE = "100%";

export const MODEL_FRESH = "claude-fable-5-1[1m]";
export const MODEL_BARE = "claude-fable-5-1";
export const CONTEXT_WINDOW_1M = 1000000;
export const CONTEXT_WINDOW_200K = 200000;
export const BETA_HEADER = "context-1m-2025-08-07";
export const PROXY_BASE_URL = "http://127.0.0.1:8798";
export const FIRST_PARTY_HOST = "api.anthropic.com";
export const SETTINGS_MISMATCH_MODEL = "opus[1m]";
export const ATTACHMENT_TYPE = "model";

export const COUSINS = Object.freeze([
  {
    issue: 64771,
    title: "Resumed sessions ignore [1m] context spec again",
    state: "CLOSED",
    citeOnly: true,
    why: "same [1m]-lost-on-resume class — cite only; do not clone",
  },
  {
    issue: 60548,
    title: "Resumed sessions ignore [1m], fall back to 200k",
    state: "CLOSED",
    citeOnly: true,
    why: "same 200k fallback on resume — cite only; do not clone",
  },
  {
    issue: 80272,
    title: 'Statusline missing "1M context" on resume',
    state: "CLOSED",
    citeOnly: true,
    why: "statusline label only — Hallmark is the window and beta header; cite only",
  },
  {
    issue: 67806,
    title: "desktop-app resume disarms 1M-context sessions",
    state: "CLOSED",
    citeOnly: true,
    why: "desktop-app resume class — Hallmark is CLI --resume + non-first-party BASE_URL; cite only",
  },
  {
    issue: 81142,
    title: "Auto mode classifier sends [1m] without 1M beta header",
    state: "OPEN",
    citeOnly: true,
    why: "classifier sends [1m] without beta — Hallmark is resume rubbing [1m] off; cite only",
  },
  {
    issue: 88345,
    title: "Third-party gateway: 1M silently capped at 200k",
    state: "OPEN",
    citeOnly: true,
    why: "gateway cap class — Hallmark is resume losing [1m] when host is non-first-party; cite only",
  },
  {
    issue: 81068,
    title: "Bedrock Opus budgeted 200K",
    state: "OPEN",
    citeOnly: true,
    why: "Bedrock budget class — Hallmark is ANTHROPIC_BASE_URL proxy + settings mismatch; cite only",
  },
  {
    issue: 90325,
    title: "Desktop picker drops 1M-context label",
    state: "OPEN",
    citeOnly: true,
    why: "picker label — Hallmark is --resume modelId + window + beta header; cite only",
  },
  {
    issue: 90324,
    title: "Desktop picker drops 1M-context label",
    state: "OPEN",
    citeOnly: true,
    why: "picker label pair with #90325 — cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "hangfire",
  "detent",
  "oubliette",
  "ephemera",
  "assay",
]);

/**
 * Published hallmark walk from #93021 only. Facts from the issue body.
 * Fresh strike is sterling; resume through a non-first-party gate
 * rubs the [1m] purity mark off.
 */
export const HALLMARK_WALK = Object.freeze([
  {
    t: "gate",
    event: "non-first-party-base-url",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
    freshContextWindow: CONTEXT_WINDOW_1M,
    baseUrl: PROXY_BASE_URL,
  },
  {
    t: "settings",
    event: "settings-model-mismatch",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    settingsModel: SETTINGS_MISMATCH_MODEL,
    sessionModel: MODEL_FRESH,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  },
  {
    t: "transcript",
    event: "transcript-modelId-ignored",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    freshModelId: MODEL_FRESH,
    restoredModelId: MODEL_BARE,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  },
  {
    t: "bare",
    event: "bare-model-id",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    restoredModelId: MODEL_BARE,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  },
  {
    t: "suffix",
    event: "missing-1m-suffix",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    restoredModelId: MODEL_BARE,
    freshModelIdHas1m: true,
  },
  {
    t: "echo",
    event: "api-echoed-bare-id",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    restoredModelId: MODEL_BARE,
    freshModelIdHas1m: true,
  },
  {
    t: "window",
    event: "context-window-200k",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  },
  {
    t: "beta",
    event: "beta-header-missing",
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    modelIdRestored: MODEL_FRESH,
    modelIdHas1mSuffix: true,
    contextWindow: CONTEXT_WINDOW_1M,
    betaHeaderHasContext1m: true,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: true,
    apiEchoedBareIdUsed: false,
    freshModelIdHas1m: true,
    freshContextWindow: CONTEXT_WINDOW_1M,
    freshModelId: MODEL_FRESH,
    restoredModelId: MODEL_FRESH,
  };
}

export function seedSterling() {
  return { ...emptyTicket() };
}

export function seedDebased() {
  return {
    seed: SEEDED_WORD,
    modelIdRestored: MODEL_BARE,
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
    freshContextWindow: CONTEXT_WINDOW_1M,
    freshModelId: MODEL_FRESH,
    restoredModelId: MODEL_BARE,
    baseUrl: PROXY_BASE_URL,
    settingsModel: SETTINGS_MISMATCH_MODEL,
    issue: FEATURED_ISSUE,
  };
}

export function seedRubbed() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    rubbed: true,
    modelIdHas1mSuffix: false,
    contextWindow: CONTEXT_WINDOW_200K,
    betaHeaderHasContext1m: false,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: false,
    apiEchoedBareIdUsed: true,
    freshModelIdHas1m: true,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      modelIdHas1mSuffix: false,
      contextWindow: null,
      betaHeaderHasContext1m: false,
      firstPartyHost: false,
      settingsModelMatches: false,
      transcriptModelIdHonored: false,
      apiEchoedBareIdUsed: false,
      freshModelIdHas1m: false,
      freshContextWindow: null,
      rubbed: false,
      restoredModelId: null,
      freshModelId: null,
      baseUrl: null,
      settingsModel: null,
      sessionModel: null,
    };
  }
  const restored =
    raw.restoredModelId || raw.modelIdRestored || raw.modelId || null;
  const fresh = raw.freshModelId || raw.startedModelId || null;
  const modelIdHas1mSuffix =
    raw.modelIdHas1mSuffix === true ||
    (typeof restored === "string" && restored.includes("[1m]"));
  const contextWindow =
    raw.contextWindow != null ? Number(raw.contextWindow) : null;
  const betaHeaderHasContext1m =
    raw.betaHeaderHasContext1m === true ||
    raw.betaHeader === BETA_HEADER ||
    raw.anthropicBeta === BETA_HEADER;
  const firstPartyHost =
    raw.firstPartyHost === true ||
    raw.baseUrl === FIRST_PARTY_HOST ||
    raw.host === FIRST_PARTY_HOST;
  const settingsModelMatches = raw.settingsModelMatches === true;
  const transcriptModelIdHonored =
    raw.transcriptModelIdHonored === true ||
    (modelIdHas1mSuffix &&
      (fresh == null ||
        restored === fresh ||
        (typeof fresh === "string" &&
          typeof restored === "string" &&
          fresh === restored)));
  return {
    modelIdHas1mSuffix,
    contextWindow,
    betaHeaderHasContext1m,
    firstPartyHost,
    settingsModelMatches,
    transcriptModelIdHonored:
      raw.transcriptModelIdHonored === false
        ? false
        : transcriptModelIdHonored,
    apiEchoedBareIdUsed:
      raw.apiEchoedBareIdUsed === true ||
      raw.apiEchoedBareId === true,
    freshModelIdHas1m:
      raw.freshModelIdHas1m === true ||
      (typeof fresh === "string" && fresh.includes("[1m]")),
    freshContextWindow:
      raw.freshContextWindow != null
        ? Number(raw.freshContextWindow)
        : null,
    rubbed: raw.rubbed === true,
    restoredModelId: restored,
    freshModelId: fresh,
    baseUrl: raw.baseUrl || raw.host || null,
    settingsModel: raw.settingsModel || null,
    sessionModel: raw.sessionModel || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.modelIdHas1mSuffix != null ||
        ticket.contextWindow != null ||
        ticket.betaHeaderHasContext1m != null ||
        ticket.firstPartyHost != null ||
        ticket.settingsModelMatches != null ||
        ticket.transcriptModelIdHonored != null ||
        ticket.apiEchoedBareIdUsed != null ||
        ticket.rubbed != null ||
        ticket.restoredModelId != null ||
        ticket.modelIdRestored != null ||
        ticket.event),
  );
}

function isSterling(row) {
  if (row.rubbed) return false;
  const markHolds = row.modelIdHas1mSuffix === true;
  const windowHolds = row.contextWindow === CONTEXT_WINDOW_1M;
  const betaHolds = row.betaHeaderHasContext1m === true;
  const honored = row.transcriptModelIdHonored === true;
  return markHolds && windowHolds && betaHolds && honored;
}

function isDebased(row) {
  if (
    row.modelIdHas1mSuffix &&
    row.contextWindow === CONTEXT_WINDOW_1M &&
    row.betaHeaderHasContext1m &&
    row.transcriptModelIdHonored
  ) {
    return false;
  }
  const lostMark =
    row.modelIdHas1mSuffix === false && row.freshModelIdHas1m === true;
  const window200k = row.contextWindow === CONTEXT_WINDOW_200K;
  const betaMissing = row.betaHeaderHasContext1m === false;
  const nonFirstParty = row.firstPartyHost === false;
  const mismatch = row.settingsModelMatches === false;
  const ignored = row.transcriptModelIdHonored === false;
  if (lostMark && window200k && betaMissing) return true;
  if (nonFirstParty && mismatch && !row.modelIdHas1mSuffix && window200k) {
    return true;
  }
  if (ignored && !row.modelIdHas1mSuffix && betaMissing) return true;
  if (row.apiEchoedBareIdUsed && window200k && !row.modelIdHas1mSuffix) {
    return true;
  }
  return false;
}

function isRubbed(row) {
  return row.rubbed === true && !isSterling(row);
}

/**
 * Score one assay seating against the hallmark booth.
 * sterling: resume restores modelId with [1m], 1M window, beta header.
 * debased: resume restores bare id, 200k window, beta missing.
 * rubbed: named path — the purity mark was rubbed off.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isRubbed(row)) {
    verdict = "rubbed";
  } else if (isDebased(row)) {
    verdict = "debased";
  } else if (isSterling(row)) {
    verdict = "sterling";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    sterling: verdict === "sterling",
    debased: verdict === "debased" || verdict === SEEDED_WORD,
    rubbed: verdict === "rubbed" || verdict === PATH_WORD,
    modelIdHas1mSuffix: row.modelIdHas1mSuffix,
    contextWindow: row.contextWindow,
    betaHeaderHasContext1m: row.betaHeaderHasContext1m,
    firstPartyHost: row.firstPartyHost,
    settingsModelMatches: row.settingsModelMatches,
    transcriptModelIdHonored: row.transcriptModelIdHonored,
    apiEchoedBareIdUsed: row.apiEchoedBareIdUsed,
    freshModelIdHas1m: row.freshModelIdHas1m,
    freshContextWindow: row.freshContextWindow,
    restoredModelId: row.restoredModelId,
    freshModelId: row.freshModelId,
    baseUrl: row.baseUrl,
    settingsModel: row.settingsModel,
    sessionModel: row.sessionModel,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sterling" : "score debased",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : HALLMARK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const debased = scored.filter((row) => row.verdict === "debased");
  const rubbed = scored.filter((row) => row.verdict === "rubbed");
  const sterling = scored.filter((row) => row.verdict === "sterling");
  const headline =
    scored.find((row) => row.event === "beta-header-missing") ||
    scored.find((row) => row.event === "context-window-200k") ||
    scored.find((row) => row.event === "missing-1m-suffix") ||
    scored.find((row) => row.event === "bare-model-id") ||
    scored.find((row) => row.event === "transcript-modelId-ignored") ||
    debased[debased.length - 1];
  let verdict = "sterling";
  if (debased.length) verdict = "debased";
  else if (rubbed.length && !sterling.length) verdict = "rubbed";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    debasedCount: debased.length,
    rubbedCount: rubbed.length,
    sterlingCount: sterling.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sterling" : "score debased",
    note: headline
      ? "resume restores bare model without [1m]; contextWindow 200000; beta header missing when BASE_URL is non-first-party and settings model differs"
      : "published hallmark walk scored against sterling vs debased",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "sterling" &&
    seeded !== "debased" &&
    seeded !== "rubbed" &&
    ticket.modelIdHas1mSuffix == null &&
    ticket.contextWindow == null &&
    ticket.betaHeaderHasContext1m == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    contextWindow: scored.contextWindow ?? CONTEXT_WINDOW_200K,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.modelIdHas1mSuffix ? "mark=[1m]" : "mark=bare",
    result.contextWindow === CONTEXT_WINDOW_1M
      ? "window=1000000"
      : result.contextWindow === CONTEXT_WINDOW_200K
        ? "window=200000"
        : "window=unknown",
    result.betaHeaderHasContext1m ? "beta=context-1m" : "beta=missing",
    result.firstPartyHost ? "host=first-party" : "host=non-first-party",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      reporter: REPORTER,
      filedAt: FILED_AT,
      product: PRODUCT,
      auth: AUTH,
      darwin: DARWIN,
      macos: MACOS,
      sessionIdsReproduced: SESSION_IDS_REPRODUCED,
      reproRate: REPRO_RATE,
      modelFresh: MODEL_FRESH,
      modelBare: MODEL_BARE,
      contextWindow1m: CONTEXT_WINDOW_1M,
      contextWindow200k: CONTEXT_WINDOW_200K,
      betaHeader: BETA_HEADER,
      proxyBaseUrl: PROXY_BASE_URL,
      firstPartyHost: FIRST_PARTY_HOST,
      settingsMismatchModel: SETTINGS_MISMATCH_MODEL,
      attachmentType: ATTACHMENT_TYPE,
      cousins: COUSINS.map((row) => row.issue),
      expected: [
        "restore the exact model the session was started with, including [1m]",
        "keep the 1,000,000 context window",
        "keep context-1m-2025-08-07 in the anthropic-beta header",
        "regardless of ANTHROPIC_BASE_URL host and settings default",
      ],
      hypothesis:
        "resume may fall back to the API-echoed bare model id / settings default when the host is non-first-party instead of restoring the transcript's modelId with [1m] and the beta header",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
