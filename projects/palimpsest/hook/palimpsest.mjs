/**
 * Palimpsest — a scriptorium /
 * parchment scraper's desk for a
 * real Claude Code defect: PreToolUse
 * hookSpecificOutput.updatedInput is
 * applied as a whole replacement of
 * the tool input, not a merge/patch.
 * A hook that naturally rewrites only
 * `command` silently drops every
 * sibling field the model passed
 * (timeout, run_in_background,
 * description). The transcript still
 * shows the model's timeout: 600000,
 * but the command is SIGTERMed at
 * the 120s default (Command timed
 * out after 2m 0s, exit 143) with
 * no indication the timeout was lost.
 *
 * A scraped page is not a holding.
 * Score the undertext or admit
 * underwrit.
 *
 * Primary #90725: OPEN, filed
 * 2026-08-30. Title: PreToolUse
 * updatedInput replaces the whole
 * tool input — sibling fields
 * (timeout, run_in_background)
 * silently dropped. Labels: bug,
 * has repro, platform:windows,
 * area:bash, area:hooks. Claude
 * Code 2.1.251 Windows Git Bash.
 * Binary string noted: "updatedInput
 * is missing or empty, falling back
 * to original tool input" (when
 * present, used whole).
 *
 * Same-class / nearby (cite, not
 * other products):
 *   #90726 auto-background
 *     eligibility evaluated
 *     post-rewrite; hook-rewritten
 *     long commands killed at 2m
 *     instead of backgrounded.
 *   #77851 PostToolUse cannot
 *     recover original tool_input
 *     after PreToolUse updatedInput
 *     rewrite.
 *   #83353 multi-hook updatedInput
 *     race by completion order.
 *   #79321 updatedInput silently
 *     ignored for Bash (distinct
 *     pole: ignored vs whole-replace).
 *
 * Cross-ecosystem:
 *   openai/codex#35713 PreToolUse
 *     updatedInput resolution
 *     depends on handler completion
 *     timing.
 *   openai/codex#33986 Bash
 *     PreToolUse tool_input drops
 *     honored per-call workdir.
 *
 * Why this is not a clone:
 * NOT Spile — hook stdin wedge /
 *     unenforced timeout (#90585).
 * NOT Tappet — silent hook
 *     injection (#90296).
 * NOT Ambo — PermissionRequest
 *     systemMessage never rendered
 *     on ExitPlanMode (#90685).
 * NOT Quoin — quoted-heredoc
 *     unescape inside Bash (#90630).
 * NOT Gaff — timeout-kill reported
 *     completed exit 0 (#90616).
 * NOT Escutcheon — Linux /run/user
 *     tmpfs D-Bus mask (#90717).
 * NOT Lacuna — task store scrape
 *     (#90709).
 * Different problem: whole-input
 * replacement of updatedInput drops
 * siblings. Different UI: scriptorium
 * parchment desk, scraped folio,
 * iron gall ink, undertext ghost,
 * rewrite stylus, timeout candle
 * clock. Different idle: underwrit.
 *
 * Verdicts: underwrit | scraped |
 *           sibling-lost |
 *           timeout-killed |
 *           bg-dropped |
 *           partial-write |
 *           transcript-lies |
 *           post-rewrite-cliff |
 *           merged-keeps
 * Idle word is underwrit (honest
 * control: hook returns merged /
 * full tool_input, siblings
 * preserved, timeout honored).
 * NEVER use underwrit for a failure.
 */

export const VERDICTS = Object.freeze([
  "underwrit",
  "scraped",
  "sibling-lost",
  "timeout-killed",
  "bg-dropped",
  "partial-write",
  "transcript-lies",
  "post-rewrite-cliff",
  "merged-keeps",
]);
export const IDLE_WORD = "underwrit";
export const ALARM_VERDICTS = Object.freeze([
  "scraped",
  "sibling-lost",
  "timeout-killed",
  "bg-dropped",
  "partial-write",
  "transcript-lies",
  "post-rewrite-cliff",
]);
export const FEATURED_ISSUE = 90725;
export const SAME_CLASS_90726 = 90726;
export const RELATED_77851 = 77851;
export const RELATED_83353 = 83353;
export const RELATED_79321 = 79321;
export const CODEX_35713 = 35713;
export const CODEX_33986 = 33986;
export const RELATED_SPILE = 90585;
export const RELATED_TAPPET = 90296;
export const RELATED_AMBO = 90685;
export const RELATED_QUOIN = 90630;
export const RELATED_GAFF = 90616;
export const RELATED_ESCUTCHEON = 90717;
export const RELATED_LACUNA = 90709;

export const DEFAULT_TIMEOUT_MS = 120000;
export const MODEL_TIMEOUT_MS = 600000;
export const SIGTERM_EXIT = 143;
export const FALLBACK_NOTE =
  "updatedInput is missing or empty, falling back to original tool input";
export const TIMEOUT_LINE = "Command timed out after 2m 0s";
export const DEMO_COMMAND = "sleep 600";
export const DEMO_REWRITTEN = "sleep 600 && echo scraped";
export const DEMO_MERGED = "sleep 600 && echo underwrit";
export const DEMO_PIPESTATUS = 'sleep 600 | tee /tmp/folio.log; exit "${PIPESTATUS[0]}"';
export const DEMO_DESCRIPTION = "long parchment scrape";
export const DEMO_VERSION = "2.1.251";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "palimpsest-folio";
export const SIBLING_KEYS = Object.freeze(["timeout", "run_in_background", "description"]);

const FORBIDDEN_IDLE = Object.freeze([
  "palimpsest",
  "escutcheon",
  "plated",
  "lacuna",
  "collated",
  "ambo",
  "unheard",
  "passed",
  "squared",
  "bound",
  "girt",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "heard",
  "clear",
  "paired",
  "empty",
  "mute",
  "idle",
  "silent",
  "spile",
  "tappet",
  "quoin",
  "gaff",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableNumber(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {
      /* not JSON */
    }
  }
  return {};
}

function keysOf(value) {
  return Object.keys(asObject(value));
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    originalInput: {},
    updatedInput: {},
    observedTimeoutMs: null,
    exitCode: null,
    autoBackgrounded: null,
    transcriptShowsTimeout: null,
    canAutoBackgroundPostRewrite: null,
    hookAuthoredKeys: [],
    fallbackNote: "",
    version: "",
    nearby: "",
    nearbyScraped: false,
    nearbySiblingLost: false,
    nearbyTimeoutKilled: false,
    nearbyBgDropped: false,
    nearbyPartialWrite: false,
    nearbyTranscriptLies: false,
    nearbyPostRewriteCliff: false,
    nearbyMergedKeeps: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.palimpsest && typeof src.palimpsest === "object") return src.palimpsest;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.folio && typeof src.folio === "object") return src.folio;
  return src;
}

function asKeyList(value) {
  if (Array.isArray(value)) return value.map((k) => String(k));
  if (typeof value === "string" && value.trim()) {
    return value.split(/[,\s]+/).filter(Boolean);
  }
  return [];
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    originalInput: asObject(nested.originalInput ?? src.originalInput ?? src.tool_input),
    updatedInput: asObject(nested.updatedInput ?? src.updatedInput),
    observedTimeoutMs: asNullableNumber(nested.observedTimeoutMs ?? src.observedTimeoutMs),
    exitCode: asNullableNumber(nested.exitCode ?? src.exitCode),
    autoBackgrounded: asNullableBool(nested.autoBackgrounded ?? src.autoBackgrounded),
    transcriptShowsTimeout: asNullableBool(
      nested.transcriptShowsTimeout ?? src.transcriptShowsTimeout,
    ),
    canAutoBackgroundPostRewrite: asNullableBool(
      nested.canAutoBackgroundPostRewrite ?? src.canAutoBackgroundPostRewrite,
    ),
    hookAuthoredKeys: asKeyList(nested.hookAuthoredKeys ?? src.hookAuthoredKeys),
    fallbackNote: asText(nested.fallbackNote || src.fallbackNote || ""),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyScraped: asBool(nested.nearbyScraped ?? src.nearbyScraped, false),
    nearbySiblingLost: asBool(nested.nearbySiblingLost ?? src.nearbySiblingLost, false),
    nearbyTimeoutKilled: asBool(nested.nearbyTimeoutKilled ?? src.nearbyTimeoutKilled, false),
    nearbyBgDropped: asBool(nested.nearbyBgDropped ?? src.nearbyBgDropped, false),
    nearbyPartialWrite: asBool(nested.nearbyPartialWrite ?? src.nearbyPartialWrite, false),
    nearbyTranscriptLies: asBool(nested.nearbyTranscriptLies ?? src.nearbyTranscriptLies, false),
    nearbyPostRewriteCliff: asBool(
      nested.nearbyPostRewriteCliff ?? src.nearbyPostRewriteCliff,
      false,
    ),
    nearbyMergedKeeps: asBool(nested.nearbyMergedKeeps ?? src.nearbyMergedKeeps, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function siblingsOf(input) {
  const obj = asObject(input);
  const timeout = obj.timeout ?? obj.Timeout ?? null;
  const bg = obj.run_in_background ?? obj.runInBackground ?? null;
  return {
    command: obj.command == null ? null : asText(obj.command),
    timeout: asNullableNumber(timeout),
    run_in_background: asNullableBool(bg),
    description: obj.description == null ? null : asText(obj.description),
  };
}

export function isCommandOnly(updated) {
  const keys = keysOf(updated).filter((k) => k !== "");
  return keys.length > 0 && keys.every((k) => k === "command");
}

export function siblingsLost(original, updated) {
  const orig = siblingsOf(original);
  const next = siblingsOf(updated);
  const lost = [];
  if (orig.timeout != null && next.timeout == null) lost.push("timeout");
  if (orig.run_in_background != null && next.run_in_background == null) {
    lost.push("run_in_background");
  }
  if (orig.description != null && next.description == null) lost.push("description");
  return lost;
}

export function looksPipeStatusRewrite(command) {
  return /exit\s+["']?\$\{?PIPESTATUS/i.test(asText(command));
}

export function isDefaultTimeout(ms) {
  return asNullableNumber(ms) === DEFAULT_TIMEOUT_MS;
}

export function isOffPalimpsest(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "spile" ||
    nearby === "90585" ||
    nearby === "tappet" ||
    nearby === "90296" ||
    nearby === "ambo" ||
    nearby === "90685" ||
    nearby === "quoin" ||
    nearby === "90630" ||
    nearby === "gaff" ||
    nearby === "90616" ||
    nearby === "escutcheon" ||
    nearby === "90717" ||
    nearby === "lacuna" ||
    nearby === "90709"
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyScraped ||
      row.nearbySiblingLost ||
      row.nearbyTimeoutKilled ||
      row.nearbyBgDropped ||
      row.nearbyPartialWrite ||
      row.nearbyTranscriptLies ||
      row.nearbyPostRewriteCliff ||
      row.nearbyMergedKeeps ||
      isOffPalimpsest(row),
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  const origKeys = keysOf(probe.originalInput);
  const updKeys = keysOf(probe.updatedInput);
  return !(
    origKeys.length ||
    updKeys.length ||
    probe.observedTimeoutMs != null ||
    probe.exitCode != null ||
    probe.autoBackgrounded != null ||
    probe.transcriptShowsTimeout != null ||
    probe.canAutoBackgroundPostRewrite != null ||
    probe.hookAuthoredKeys.length ||
    probe.fallbackNote ||
    probe.version ||
    uniqueNearbyOf(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const original = siblingsOf(row.originalInput);
  const updated = siblingsOf(row.updatedInput);
  const lost = siblingsLost(row.originalInput, row.updatedInput);
  const commandOnly = isCommandOnly(row.updatedInput);
  const authored =
    row.hookAuthoredKeys.length > 0
      ? row.hookAuthoredKeys
      : keysOf(row.updatedInput);
  const partialWrite = Boolean(
    authored.length > 0 && authored.every((k) => k === "command"),
  );
  const timeoutKilled = Boolean(
    row.exitCode === SIGTERM_EXIT && isDefaultTimeout(row.observedTimeoutMs),
  );
  const modelTimeout = original.timeout;
  const transcriptLies = Boolean(
    row.transcriptShowsTimeout === true &&
      isDefaultTimeout(row.observedTimeoutMs) &&
      modelTimeout != null &&
      modelTimeout !== DEFAULT_TIMEOUT_MS,
  );
  const bgDropped = Boolean(
    original.run_in_background === true &&
      updated.run_in_background == null &&
      row.autoBackgrounded !== true,
  );
  const pipeStatus = looksPipeStatusRewrite(updated.command || original.command);
  const postRewriteCliff = Boolean(
    pipeStatus &&
      row.canAutoBackgroundPostRewrite === false &&
      timeoutKilled &&
      row.autoBackgrounded !== true,
  );
  const siblingsPreserved = Boolean(
    (original.timeout == null || updated.timeout === original.timeout) &&
      (original.run_in_background == null ||
        updated.run_in_background === original.run_in_background) &&
      (original.description == null || updated.description === original.description) &&
      updated.command != null &&
      !commandOnly,
  );
  const timeoutHonored = Boolean(
    (modelTimeout != null && row.observedTimeoutMs === modelTimeout) ||
      (row.autoBackgrounded === true && original.run_in_background === true) ||
      (row.exitCode === 0 &&
        row.observedTimeoutMs != null &&
        !isDefaultTimeout(row.observedTimeoutMs)),
  );
  const mergedKeeps = Boolean(siblingsPreserved && timeoutHonored);
  const scrapedTriad = Boolean(
    commandOnly &&
      lost.length >= 1 &&
      (timeoutKilled || transcriptLies) &&
      !uniqueNearby,
  );
  const honest = Boolean(
    siblingsPreserved &&
      timeoutHonored &&
      !timeoutKilled &&
      !transcriptLies &&
      !bgDropped &&
      !postRewriteCliff &&
      !uniqueNearby,
  );

  let eventClass = "idle";
  if (uniqueNearby && !scrapedTriad) {
    if (row.nearbyPostRewriteCliff) eventClass = "post-rewrite-cliff";
    else if (row.nearbyTranscriptLies) eventClass = "transcript-lies";
    else if (row.nearbyTimeoutKilled) eventClass = "timeout-killed";
    else if (row.nearbyBgDropped) eventClass = "bg-dropped";
    else if (row.nearbySiblingLost) eventClass = "sibling-lost";
    else if (row.nearbyPartialWrite) eventClass = "partial-write";
    else if (row.nearbyScraped) eventClass = "scraped";
    else if (row.nearbyMergedKeeps) eventClass = "merged-keeps";
    else if (isOffPalimpsest(row)) eventClass = "scraped";
  } else if (scrapedTriad) eventClass = "scraped";
  else if (postRewriteCliff) eventClass = "post-rewrite-cliff";
  else if (transcriptLies) eventClass = "transcript-lies";
  else if (timeoutKilled) eventClass = "timeout-killed";
  else if (bgDropped) eventClass = "bg-dropped";
  else if (lost.length > 0) eventClass = "sibling-lost";
  else if (partialWrite) eventClass = "partial-write";
  else if (mergedKeeps) eventClass = "merged-keeps";
  else if (honest || isIdle(row)) eventClass = "underwrit";
  else eventClass = "underwrit";

  return {
    uniqueNearby,
    original,
    updated,
    lost,
    commandOnly,
    authored,
    partialWrite,
    timeoutKilled,
    transcriptLies,
    bgDropped,
    pipeStatus,
    postRewriteCliff,
    siblingsPreserved,
    timeoutHonored,
    mergedKeeps,
    scrapedTriad,
    honest,
    offPalimpsest: isOffPalimpsest(row),
    eventClass,
    modelTimeout,
    observedTimeoutMs: row.observedTimeoutMs,
    exitCode: row.exitCode,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "underwrit";
  const facts = analyze(row);
  if (!facts.scrapedTriad) {
    if (row.nearbyPostRewriteCliff) return "post-rewrite-cliff";
    if (row.nearbyTranscriptLies) return "transcript-lies";
    if (row.nearbyTimeoutKilled) return "timeout-killed";
    if (row.nearbyBgDropped) return "bg-dropped";
    if (row.nearbySiblingLost) return "sibling-lost";
    if (row.nearbyPartialWrite) return "partial-write";
    if (row.nearbyScraped) return "scraped";
    if (row.nearbyMergedKeeps) return "merged-keeps";
    if (facts.offPalimpsest) return "scraped";
  }
  if (facts.scrapedTriad) return "scraped";
  if (facts.postRewriteCliff) return "post-rewrite-cliff";
  if (facts.transcriptLies) return "transcript-lies";
  if (facts.timeoutKilled) return "timeout-killed";
  if (facts.bgDropped) return "bg-dropped";
  if (facts.lost.length > 0) return "sibling-lost";
  if (facts.partialWrite) return "partial-write";
  if (facts.mergedKeeps && !facts.honest) return "merged-keeps";
  if (facts.honest) return "underwrit";
  return "underwrit";
}

export function feedOf(kind) {
  if (kind === "scraped") {
    return "● Scraped · command-only updatedInput replaced the whole tool input · siblings gone · primary #90725";
  }
  if (kind === "sibling-lost") {
    return "● Sibling-lost · timeout / run_in_background / description absent after the rewrite";
  }
  if (kind === "timeout-killed") {
    return "● Timeout-killed · SIGTERM at the 2m default · exit 143 · the model's timeout still sits in the transcript";
  }
  if (kind === "bg-dropped") {
    return "● Bg-dropped · run_in_background silently lost on the whole-replace";
  }
  if (kind === "partial-write") {
    return "● Partial-write · the hook authored only {command} · the runtime treated it as the whole input";
  }
  if (kind === "transcript-lies") {
    return "● Transcript-lies · assistant tool_use still shows timeout · runtime used the 120s default";
  }
  if (kind === "post-rewrite-cliff") {
    return '● Post-rewrite-cliff · canAutoBackground scored the rewritten shape · ; exit "${PIPESTATUS[0]}" stripped eligibility · killed at 2m · #90726';
  }
  if (kind === "merged-keeps") {
    return "● Merged-keeps · hook copied full tool_input and overrode only command · timeout honored · contrast that proves merge would fix";
  }
  return "● Underwrit · full merge or full copy+override command only · timeout and run_in_background preserved · idle word is underwrit";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "scraped" || facts.scrapedTriad) {
    reasons.push(
      "#90725 PreToolUse updatedInput replaces the whole tool input; sibling fields silently dropped",
    );
  }
  if (facts.commandOnly) {
    reasons.push("updatedInput is command-only — whole replace, not a merge");
  }
  if (facts.lost.length) {
    reasons.push(`siblings lost after rewrite: ${facts.lost.join(", ")}`);
  }
  if (facts.original.timeout != null) {
    reasons.push(`model timeout ${facts.original.timeout}ms`);
  }
  if (facts.timeoutKilled) {
    reasons.push(`${TIMEOUT_LINE}, exit ${SIGTERM_EXIT}`);
  }
  if (facts.transcriptLies) {
    reasons.push("transcript still shows the model's timeout while runtime used 120000ms");
  }
  if (facts.bgDropped) {
    reasons.push("run_in_background was true on the model input and absent after rewrite");
  }
  if (facts.partialWrite) {
    reasons.push("hook authored only {command}");
  }
  if (facts.pipeStatus) {
    reasons.push(`PIPESTATUS rewrite: ${facts.updated.command || DEMO_PIPESTATUS}`);
  }
  if (facts.postRewriteCliff) {
    reasons.push(
      "#90726 canAutoBackground evaluated on post-rewrite shape; eligibility stripped",
    );
  }
  if (facts.siblingsPreserved) {
    reasons.push("updatedInput kept timeout + run_in_background + description");
  }
  if (facts.timeoutHonored) {
    reasons.push("observed timeout matches the model (or auto-backgrounded as intended)");
  }
  if (row.fallbackNote || /falling back to original tool input/i.test(row.fallbackNote)) {
    reasons.push(FALLBACK_NOTE);
  }
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offPalimpsest) {
    reasons.push(
      "labeled contrast, not this defect: Spile #90585 / Tappet #90296 / Ambo #90685 / Quoin #90630 / Gaff #90616 / Escutcheon #90717 / Lacuna #90709",
    );
  }
  if (kind === "underwrit") {
    reasons.push(
      "full merge or full copy+override command only; siblings preserved; idle word is underwrit",
    );
  }
  if (kind === "merged-keeps") {
    reasons.push("contrast seed: merge-over-original honors timeout — the fix that #90725 needs");
  }
  return reasons;
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offPalimpsest;
  const alarm = ALARM_VERDICTS.includes(kind) && !off;
  return {
    product: "palimpsest",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    underwrit: kind === "underwrit",
    scraped: kind === "scraped",
    "sibling-lost": kind === "sibling-lost",
    "timeout-killed": kind === "timeout-killed",
    "bg-dropped": kind === "bg-dropped",
    "partial-write": kind === "partial-write",
    "transcript-lies": kind === "transcript-lies",
    "post-rewrite-cliff": kind === "post-rewrite-cliff",
    "merged-keeps": kind === "merged-keeps",
    alarm,
    thisBug: kind !== "underwrit" && kind !== "merged-keeps" && !off,
    offPalimpsest: off,
    eventClass: facts.eventClass,
    facts: {
      original: facts.original,
      updated: facts.updated,
      lost: facts.lost,
      commandOnly: facts.commandOnly,
      partialWrite: facts.partialWrite,
      timeoutKilled: facts.timeoutKilled,
      transcriptLies: facts.transcriptLies,
      bgDropped: facts.bgDropped,
      pipeStatus: facts.pipeStatus,
      postRewriteCliff: facts.postRewriteCliff,
      siblingsPreserved: facts.siblingsPreserved,
      timeoutHonored: facts.timeoutHonored,
      mergedKeeps: facts.mergedKeeps,
      scrapedTriad: facts.scrapedTriad,
      honest: facts.honest,
      offPalimpsest: facts.offPalimpsest,
      modelTimeout: facts.modelTimeout,
      observedTimeoutMs: facts.observedTimeoutMs,
      exitCode: facts.exitCode,
      autoBackgrounded: probe.autoBackgrounded,
      transcriptShowsTimeout: probe.transcriptShowsTimeout,
      version: facts.version,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_MARK,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  return boardResult(classify(row), row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function underwritOf(probe = {}) {
  return classify(probe) === "underwrit";
}

function modelInput(extra = {}) {
  return {
    command: DEMO_COMMAND,
    timeout: MODEL_TIMEOUT_MS,
    run_in_background: false,
    description: DEMO_DESCRIPTION,
    ...extra,
  };
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    palimpsest: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedUnderwrit() {
  return baseSeed("underwrit-hold", FEATURED_ISSUE, {
    source:
      "honest control: hook returned merged/full tool_input, siblings preserved, timeout honored",
    originalInput: modelInput(),
    updatedInput: modelInput({ command: DEMO_MERGED }),
    observedTimeoutMs: MODEL_TIMEOUT_MS,
    exitCode: 0,
    autoBackgrounded: false,
    transcriptShowsTimeout: true,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedUnderwrit();
}

export function seedReset() {
  return { action: "bail", palimpsest: emptyProbe() };
}

export function seedScraped() {
  return baseSeed("90725-scraped", FEATURED_ISSUE, {
    source:
      "primary #90725 command-only updatedInput whole-replaced the tool input; siblings gone; killed at 2m",
    originalInput: modelInput(),
    updatedInput: { command: DEMO_REWRITTEN },
    observedTimeoutMs: DEFAULT_TIMEOUT_MS,
    exitCode: SIGTERM_EXIT,
    autoBackgrounded: false,
    transcriptShowsTimeout: true,
    hookAuthoredKeys: ["command"],
    fallbackNote: FALLBACK_NOTE,
    version: DEMO_VERSION,
  });
}

export function seed90725() {
  return seedScraped();
}

export function seedSiblingLost() {
  return baseSeed("90725-sibling-lost", FEATURED_ISSUE, {
    source: "timeout / run_in_background / description absent after rewrite",
    originalInput: modelInput(),
    updatedInput: { command: DEMO_REWRITTEN },
    nearbySiblingLost: true,
    version: DEMO_VERSION,
  });
}

export function seedTimeoutKilled() {
  return baseSeed("90725-timeout-killed", FEATURED_ISSUE, {
    source: "dies at 2m default exit 143 despite model timeout in transcript",
    originalInput: modelInput(),
    updatedInput: { command: DEMO_REWRITTEN },
    observedTimeoutMs: DEFAULT_TIMEOUT_MS,
    exitCode: SIGTERM_EXIT,
    autoBackgrounded: false,
    transcriptShowsTimeout: true,
    nearbyTimeoutKilled: true,
    version: DEMO_VERSION,
  });
}

export function seedBgDropped() {
  return baseSeed("90725-bg-dropped", FEATURED_ISSUE, {
    source: "run_in_background silently lost",
    originalInput: modelInput({ run_in_background: true }),
    updatedInput: { command: DEMO_REWRITTEN },
    observedTimeoutMs: DEFAULT_TIMEOUT_MS,
    exitCode: SIGTERM_EXIT,
    autoBackgrounded: false,
    nearbyBgDropped: true,
    version: DEMO_VERSION,
  });
}

export function seedPartialWrite() {
  return baseSeed("90725-partial-write", FEATURED_ISSUE, {
    source: "hook authored only {command}",
    originalInput: modelInput(),
    updatedInput: { command: DEMO_REWRITTEN },
    hookAuthoredKeys: ["command"],
    nearbyPartialWrite: true,
    version: DEMO_VERSION,
  });
}

export function seedTranscriptLies() {
  return baseSeed("90725-transcript-lies", FEATURED_ISSUE, {
    source: "assistant tool_use still shows timeout while runtime used the default",
    originalInput: modelInput(),
    updatedInput: { command: DEMO_REWRITTEN },
    observedTimeoutMs: DEFAULT_TIMEOUT_MS,
    exitCode: SIGTERM_EXIT,
    transcriptShowsTimeout: true,
    nearbyTranscriptLies: true,
    version: DEMO_VERSION,
  });
}

export function seedPostRewriteCliff() {
  return baseSeed("90726-post-rewrite-cliff", SAME_CLASS_90726, {
    source:
      'same-class #90726: canAutoBackground evaluated on post-rewrite shape; ; exit "${PIPESTATUS[0]}" stripped eligibility',
    originalInput: modelInput({ command: "sleep 600 | tee /tmp/folio.log" }),
    updatedInput: { command: DEMO_PIPESTATUS },
    observedTimeoutMs: DEFAULT_TIMEOUT_MS,
    exitCode: SIGTERM_EXIT,
    autoBackgrounded: false,
    canAutoBackgroundPostRewrite: false,
    nearbyPostRewriteCliff: true,
    version: DEMO_VERSION,
  });
}

export function seedMergedKeeps() {
  return baseSeed("90725-merged-keeps", FEATURED_ISSUE, {
    source:
      "contrast: hook copied full tool_input and overrode only command → timeout honored",
    originalInput: modelInput(),
    updatedInput: modelInput({ command: DEMO_MERGED }),
    observedTimeoutMs: MODEL_TIMEOUT_MS,
    exitCode: 0,
    autoBackgrounded: false,
    transcriptShowsTimeout: true,
    nearbyMergedKeeps: true,
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  underwrit: seedUnderwrit,
  control: seedUnderwrit,
  healthy: seedUnderwrit,
  hold: seedUnderwrit,
  scraped: seedScraped,
  90725: seedScraped,
  "90725": seedScraped,
  "sibling-lost": seedSiblingLost,
  siblinglost: seedSiblingLost,
  "timeout-killed": seedTimeoutKilled,
  timeoutkilled: seedTimeoutKilled,
  "bg-dropped": seedBgDropped,
  bgdropped: seedBgDropped,
  "partial-write": seedPartialWrite,
  partialwrite: seedPartialWrite,
  "transcript-lies": seedTranscriptLies,
  transcriptlies: seedTranscriptLies,
  "post-rewrite-cliff": seedPostRewriteCliff,
  postrewritecliff: seedPostRewriteCliff,
  90726: seedPostRewriteCliff,
  "90726": seedPostRewriteCliff,
  "merged-keeps": seedMergedKeeps,
  mergedkeeps: seedMergedKeeps,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, palimpsest: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const palimpsest = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || palimpsest.session),
    issue: asIssue(src.issue ?? palimpsest.issue),
    source: asText(src.source || palimpsest.source),
    palimpsest,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.palimpsest);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("underwrit", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedUnderwrit().palimpsest;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90725" || verb === "scraped") {
    probe = seedScraped().palimpsest;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "file") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "stamp" || verb === "file" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text.trim()) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return cloneProbe({ ...parsed, scored: true });
    }
  } catch {
    /* transcript, not JSON */
  }
  const probe = emptyProbe();
  const timeoutMatch = text.match(/timeout["'\s:=]+(\d+)/i);
  const modelTimeout = timeoutMatch ? Number(timeoutMatch[1]) : null;
  const commandMatch = text.match(/command["'\s:=]+["']([^"']+)["']/i);
  const updatedMatch = text.match(/updatedInput["'\s:=]+(\{[^}]+\})/i);
  let updated = {};
  if (updatedMatch) {
    try {
      updated = JSON.parse(updatedMatch[1].replace(/'/g, '"'));
    } catch {
      updated = {};
    }
  }
  const rewritten = /echo scraped|rewritten command|command-only/i.test(text)
    ? DEMO_REWRITTEN
    : commandMatch
      ? commandMatch[1]
      : "";
  if (/PIPESTATUS/i.test(text)) {
    probe.originalInput = modelInput({ command: "sleep 600 | tee /tmp/folio.log" });
    probe.updatedInput = { command: DEMO_PIPESTATUS };
    probe.canAutoBackgroundPostRewrite = false;
    probe.nearbyPostRewriteCliff = true;
  } else if (keysOf(updated).length) {
    probe.updatedInput = updated;
    probe.originalInput = modelInput({
      timeout: modelTimeout || MODEL_TIMEOUT_MS,
      command: DEMO_COMMAND,
    });
  } else if (rewritten || /updatedInput|whole replace|sibling/i.test(text)) {
    probe.originalInput = modelInput({
      timeout: modelTimeout || MODEL_TIMEOUT_MS,
    });
    probe.updatedInput = { command: rewritten || DEMO_REWRITTEN };
  }
  if (/timed out after 2m|exit 143|SIGTERM/i.test(text)) {
    probe.observedTimeoutMs = DEFAULT_TIMEOUT_MS;
    probe.exitCode = SIGTERM_EXIT;
    probe.autoBackgrounded = false;
  }
  if (/timeout:\s*600000|timeout["'\s:=]+600000/i.test(text)) {
    probe.transcriptShowsTimeout = true;
    if (!probe.originalInput.timeout) {
      probe.originalInput = {
        ...modelInput(),
        ...probe.originalInput,
        timeout: MODEL_TIMEOUT_MS,
      };
    }
  }
  if (/run_in_background/i.test(text) && /lost|dropped|absent/i.test(text)) {
    probe.originalInput = {
      ...modelInput({ run_in_background: true }),
      ...probe.originalInput,
      run_in_background: true,
    };
    if (!keysOf(probe.updatedInput).length) probe.updatedInput = { command: DEMO_REWRITTEN };
    probe.autoBackgrounded = false;
    probe.nearbyBgDropped = true;
  }
  if (/falling back to original tool input/i.test(text)) {
    probe.fallbackNote = FALLBACK_NOTE;
  }
  if (/merged|copy\+override|siblings preserved/i.test(text) && !probe.exitCode) {
    probe.originalInput = modelInput();
    probe.updatedInput = modelInput({ command: DEMO_MERGED });
    probe.observedTimeoutMs = MODEL_TIMEOUT_MS;
    probe.exitCode = 0;
    probe.transcriptShowsTimeout = true;
  }
  probe.scored = true;
  return cloneProbe(probe);
}

export function parsePalimpsestJson(raw) {
  if (raw && typeof raw === "object") {
    return cloneProbe({ ...raw, scored: true });
  }
  return parseTranscript(raw);
}

export function emptyAction(verb = "idle") {
  return { action: verb, palimpsest: emptyProbe() };
}
