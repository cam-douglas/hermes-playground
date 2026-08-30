/**
 * Fetch — an Irish/English folklore
 * looking-glass parlor / scrying
 * pane for a real Claude Code
 * defect: the prompt-suggestion
 * feature (forked agent,
 * source=prompt_suggestion,
 * promptSuggestionEnabled default
 * on) renders a model-generated
 * suggested user reply as ghost
 * text on the ❯ input line. In
 * headless/automated setups that
 * scrape the terminal with
 * `tmux capture-pane -p` (or
 * similar), styling is stripped
 * so ghost text is byte-identical
 * to real typed input. A watchdog
 * that resubmits "stuck" input
 * turns suggestions into real
 * user messages — over ~2 days
 * one report saw 220+ fabricated
 * user messages, including fake
 * approvals ("Yes, go ahead")
 * that caused real edits, self-
 * modification of the watchdog,
 * incorrect memory writes, and
 * runaway self-conversation
 * loops.
 *
 * A fetch on the glass is not a
 * keyed reply. Score the pane or
 * admit muted.
 *
 * Primary #90755: OPEN, filed
 * 2026-08-30. Title: Prompt
 * suggestions render as ghost
 * text indistinguishable from
 * typed input in scraped/headless
 * terminals — enabled fabricated
 * "user messages" incl. fake
 * approvals. Labels: bug,
 * platform:macos, area:tui,
 * area:security. Claude Code
 * 2.1.246–2.1.251, macOS Apple
 * Silicon, headless inside tmux
 * with --channels plugin:telegram
 * and --permission-mode auto.
 * Telegram bridge injects via
 * tmux send-keys; watchdog
 * rescues stuck input by scraping
 * tmux capture-pane -p.
 *
 * Related (cite, not primary):
 *   #78177 Remote Control:
 *     message arrives in TUI
 *     composer but is never
 *     submitted — tmux/headless.
 *   #86896 Spurious mid-run
 *     interrupt from terminal
 *     report sequences in
 *     unattended tmux.
 *   #77155 --channels fails when
 *     plugin loaded via
 *     --plugin-dir.
 *   #77569 Display text / ANSI
 *     leaks into persisted flags
 *     (display-vs-semantic).
 *
 * Why this is not a clone:
 * Different problem: TUI ghost-
 * text / headless scrape /
 * fabricated user authorship.
 * NOT packaging, NOT AV, NOT
 * hooks rewrite, NOT OAuth, NOT
 * DLP pattern redact, NOT
 * permission stall.
 * NOT Livery (#90748 TCC path-
 *     churn desktop bundled
 *     binary).
 * NOT Pinfold (#90706 Defender
 *     FileFix CmdLine EPERM).
 * NOT Palimpsest (#90725
 *     PreToolUse updatedInput
 *     sibling drop).
 * NOT Escutcheon (Linux /run/user
 *     tmpfs / keyring).
 * NOT Chatelaine (nested
 *     mcpOAuth).
 * NOT Fob (keychain litter).
 * NOT Visa (OAuth destination).
 * NOT Sigil (hollow thinking
 *     seal).
 * NOT Hasp (file lease).
 * NOT Knock (permission grant
 *     stall).
 * NOT Slype (sandbox pwsh 126).
 * NOT Scrim (runtime DLP redact
 *     tool_result).
 * NOT Chute (typed secret
 *     handoff).
 * NOT Ambo (pulpit / unread
 *     card).
 * NOT Byline (ghost byline
 *     authorship elsewhere —
 *     credited authorship on a
 *     rack, not TUI ghost
 *     suggestions).
 * Different UI: looking-glass
 * parlor / scrying pane /
 * silvered fetch window. Cold
 * moonlight silver, slate,
 * pewter, fog glass. Not
 * mahogany wine wardrobe, not
 * village pound, not scriptorium,
 * not locksmith plate, not
 * collation desk, not pressing
 * board, not pulpit.
 * Different idle: muted.
 *
 * Verdicts: muted | ghosted |
 *           scraped | fabricated |
 *           fake-approve |
 *           self-loop | unmarked |
 *           default-on |
 *           channel-blind |
 *           byte-identical |
 *           watchdog-fed |
 *           suggestion-source
 * Idle word is muted (honest
 * control: promptSuggestionEnabled
 * off / suggestions suppressed
 * for --channels / non-interactive
 * / no recent local keystrokes;
 * or a machine-readable marker so
 * scrapers filter suggestion
 * text. Input line is keyed-only).
 * NEVER use muted for a failure.
 */

export const VERDICTS = Object.freeze([
  "muted",
  "ghosted",
  "scraped",
  "fabricated",
  "fake-approve",
  "self-loop",
  "unmarked",
  "default-on",
  "channel-blind",
  "byte-identical",
  "watchdog-fed",
  "suggestion-source",
]);
export const IDLE_WORD = "muted";
export const ALARM_VERDICTS = Object.freeze([
  "ghosted",
  "scraped",
  "fabricated",
  "fake-approve",
  "self-loop",
  "unmarked",
  "default-on",
  "channel-blind",
  "byte-identical",
  "watchdog-fed",
  "suggestion-source",
]);
export const FEATURED_ISSUE = 90755;
export const RELATED_78177 = 78177;
export const RELATED_86896 = 86896;
export const RELATED_77155 = 77155;
export const RELATED_77569 = 77569;
export const RELATED_LIVERY = 90748;
export const RELATED_PINFOLD = 90706;
export const RELATED_PALIMPSEST = 90725;
export const RELATED_ESCUTCHEON = 90717;
export const RELATED_BYLINE = 90663;

export const DEMO_SUGGESTION = "Yes, go ahead";
export const DEMO_APPROVAL = "Yes, go ahead";
export const DEMO_PROMPT = "❯";
export const DEMO_CAPTURE = "❯ Yes, go ahead";
export const DEMO_MARKED_CAPTURE = "❯ ░ Yes, go ahead";
export const DEMO_SOURCE = "prompt_suggestion";
export const DEMO_CHANNELS = "plugin:telegram";
export const DEMO_WATCHDOG = "tmux capture-pane -p";
export const DEMO_VERSION = "2.1.251";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "fetch-parlor";
export const DEMO_FABRICATED_COUNT = 220;

const FORBIDDEN_IDLE = Object.freeze([
  "fetch",
  "livery",
  "liveried",
  "pinfold",
  "penned",
  "palimpsest",
  "underwrit",
  "escutcheon",
  "plated",
  "lacuna",
  "collated",
  "ambo",
  "unheard",
  "slype",
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
  "flat",
  "pleat",
  "fob",
  "chatelaine",
  "visa",
  "sigil",
  "hasp",
  "knock",
  "scrim",
  "chute",
  "byline",
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

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    promptSuggestionEnabled: null,
    suggestionSource: "",
    ghostText: "",
    capturePaneText: "",
    composerMarked: null,
    channelsActive: null,
    recentKeystrokes: null,
    submittedAsUser: null,
    approvalText: "",
    watchdogFed: null,
    selfLoop: null,
    fabricatedCount: null,
    headless: null,
    permissionMode: "",
    version: "",
    nearby: "",
    nearbyGhosted: false,
    nearbyScraped: false,
    nearbyFabricated: false,
    nearbyFakeApprove: false,
    nearbySelfLoop: false,
    nearbyUnmarked: false,
    nearbyDefaultOn: false,
    nearbyChannelBlind: false,
    nearbyByteIdentical: false,
    nearbyWatchdogFed: false,
    nearbySuggestionSource: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.fetch && typeof src.fetch === "object") return src.fetch;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.pane && typeof src.pane === "object") return src.pane;
  if (src.glass && typeof src.glass === "object") return src.glass;
  return src;
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
    promptSuggestionEnabled: asNullableBool(
      nested.promptSuggestionEnabled ?? src.promptSuggestionEnabled,
    ),
    suggestionSource: asText(nested.suggestionSource || src.suggestionSource || src.agentSource || ""),
    ghostText: asText(nested.ghostText || src.ghostText || src.suggestedReply || ""),
    capturePaneText: asText(nested.capturePaneText || src.capturePaneText || src.paneText || ""),
    composerMarked: asNullableBool(nested.composerMarked ?? src.composerMarked),
    channelsActive: asNullableBool(nested.channelsActive ?? src.channelsActive),
    recentKeystrokes: asNullableBool(nested.recentKeystrokes ?? src.recentKeystrokes),
    submittedAsUser: asNullableBool(nested.submittedAsUser ?? src.submittedAsUser),
    approvalText: asText(nested.approvalText || src.approvalText || ""),
    watchdogFed: asNullableBool(nested.watchdogFed ?? src.watchdogFed),
    selfLoop: asNullableBool(nested.selfLoop ?? src.selfLoop),
    fabricatedCount: asNullableNumber(nested.fabricatedCount ?? src.fabricatedCount),
    headless: asNullableBool(nested.headless ?? src.headless),
    permissionMode: asText(nested.permissionMode || src.permissionMode || ""),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyGhosted: asBool(nested.nearbyGhosted ?? src.nearbyGhosted, false),
    nearbyScraped: asBool(nested.nearbyScraped ?? src.nearbyScraped, false),
    nearbyFabricated: asBool(nested.nearbyFabricated ?? src.nearbyFabricated, false),
    nearbyFakeApprove: asBool(nested.nearbyFakeApprove ?? src.nearbyFakeApprove, false),
    nearbySelfLoop: asBool(nested.nearbySelfLoop ?? src.nearbySelfLoop, false),
    nearbyUnmarked: asBool(nested.nearbyUnmarked ?? src.nearbyUnmarked, false),
    nearbyDefaultOn: asBool(nested.nearbyDefaultOn ?? src.nearbyDefaultOn, false),
    nearbyChannelBlind: asBool(nested.nearbyChannelBlind ?? src.nearbyChannelBlind, false),
    nearbyByteIdentical: asBool(nested.nearbyByteIdentical ?? src.nearbyByteIdentical, false),
    nearbyWatchdogFed: asBool(nested.nearbyWatchdogFed ?? src.nearbyWatchdogFed, false),
    nearbySuggestionSource: asBool(nested.nearbySuggestionSource ?? src.nearbySuggestionSource, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

const SUGGESTION_SOURCE_RE = /prompt_suggestion/i;
const APPROVAL_RE = /yes,?\s+go ahead|go ahead and edit|lgtm|do it|approved/i;
const MARKER_RE = /\[suggestion\]|░|‹suggest›|ghost-mark|composerMarked/i;
const CAPTURE_RE = /capture-pane|capturePane|tmux\s+capture/i;
const CHANNEL_RE = /--channels|plugin:telegram|channelsActive/i;

export function looksSuggestionSource(source) {
  return SUGGESTION_SOURCE_RE.test(asText(source));
}

export function looksApproval(text) {
  return APPROVAL_RE.test(asText(text));
}

export function looksMarked(row = {}) {
  if (row.composerMarked === true) return true;
  const blob = `${asText(row.capturePaneText)} ${asText(row.ghostText)}`;
  return MARKER_RE.test(blob);
}

export function looksGhostOnPrompt(row = {}) {
  const ghost = asText(row.ghostText);
  const pane = asText(row.capturePaneText);
  if (ghost) return true;
  return /❯/.test(pane) && pane.replace(/❯\s*/, "").trim().length > 0;
}

export function looksByteIdentical(row = {}) {
  const ghost = asText(row.ghostText).trim();
  const pane = asText(row.capturePaneText);
  if (!ghost || !pane) {
    return /byte-identical|styling is stripped|indistinguishable/i.test(
      `${asText(row.source)} ${pane}`,
    );
  }
  const stripped = pane.replace(/❯\s*/, "").trim();
  return stripped === ghost || pane.includes(ghost);
}

export function looksScraped(row = {}) {
  const pane = asText(row.capturePaneText).replace(/❯\s*/g, "").trim();
  if (pane) return true;
  return CAPTURE_RE.test(asText(row.source));
}

export function looksDefaultOn(row = {}) {
  return row.promptSuggestionEnabled === true || row.promptSuggestionEnabled == null
    ? row.promptSuggestionEnabled === true ||
        /default-?on|promptSuggestionEnabled/i.test(asText(row.source))
    : false;
}

export function looksChannelBlind(row = {}) {
  if (row.channelsActive === true && row.promptSuggestionEnabled !== false) return true;
  if (row.headless === true && row.promptSuggestionEnabled !== false && looksGhostOnPrompt(row)) {
    return true;
  }
  return CHANNEL_RE.test(`${asText(row.source)} ${asText(row.permissionMode)}`) &&
    row.promptSuggestionEnabled !== false;
}

export function looksWatchdogFed(row = {}) {
  if (row.watchdogFed === true) return true;
  return /watchdog|stuck (human )?input|resubmit/i.test(asText(row.source));
}

export function looksFabricated(row = {}) {
  if (row.submittedAsUser === true) return true;
  if (row.fabricatedCount != null && row.fabricatedCount > 0) return true;
  return /fabricated user|submitted as (a )?real user/i.test(asText(row.source));
}

export function looksFakeApprove(row = {}) {
  const text = `${asText(row.approvalText)} ${asText(row.ghostText)} ${asText(row.capturePaneText)}`;
  return looksApproval(text) && (row.submittedAsUser === true || /acted on|fake approv/i.test(asText(row.source)));
}

export function looksSelfLoop(row = {}) {
  if (row.selfLoop === true) return true;
  return /self-?loop|self-conversation|fresh suggestion/i.test(asText(row.source));
}

export function isOffFetch(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "livery" ||
    nearby === "90748" ||
    nearby === "pinfold" ||
    nearby === "90706" ||
    nearby === "palimpsest" ||
    nearby === "90725" ||
    nearby === "escutcheon" ||
    nearby === "90717" ||
    nearby === "chatelaine" ||
    nearby === "fob" ||
    nearby === "visa" ||
    nearby === "sigil" ||
    nearby === "hasp" ||
    nearby === "knock" ||
    nearby === "slype" ||
    nearby === "scrim" ||
    nearby === "chute" ||
    nearby === "ambo" ||
    nearby === "byline"
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyGhosted ||
      row.nearbyScraped ||
      row.nearbyFabricated ||
      row.nearbyFakeApprove ||
      row.nearbySelfLoop ||
      row.nearbyUnmarked ||
      row.nearbyDefaultOn ||
      row.nearbyChannelBlind ||
      row.nearbyByteIdentical ||
      row.nearbyWatchdogFed ||
      row.nearbySuggestionSource ||
      isOffFetch(row),
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.promptSuggestionEnabled != null ||
    probe.suggestionSource ||
    probe.ghostText ||
    probe.capturePaneText ||
    probe.composerMarked != null ||
    probe.channelsActive != null ||
    probe.recentKeystrokes != null ||
    probe.submittedAsUser != null ||
    probe.approvalText ||
    probe.watchdogFed != null ||
    probe.selfLoop != null ||
    probe.fabricatedCount != null ||
    probe.headless != null ||
    probe.permissionMode ||
    probe.version ||
    uniqueNearbyOf(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const suggestionSource = looksSuggestionSource(row.suggestionSource || row.source);
  const ghostOnPrompt = looksGhostOnPrompt(row);
  const marked = looksMarked(row);
  const unmarked = Boolean(ghostOnPrompt && !marked);
  const scraped = looksScraped(row);
  const byteIdentical = looksByteIdentical(row);
  const defaultOn = row.promptSuggestionEnabled === true || looksDefaultOn(row);
  const channelBlind = looksChannelBlind(row);
  const watchdogFed = looksWatchdogFed(row);
  const fabricated = looksFabricated(row);
  const fakeApprove = looksFakeApprove(row);
  const selfLoop = looksSelfLoop(row);
  const suggestionsOff = row.promptSuggestionEnabled === false;
  const keyedOnly = Boolean(
    suggestionsOff || (marked && !fabricated && row.submittedAsUser !== true),
  );
  const ghostedTriad = Boolean(
    ghostOnPrompt &&
      unmarked &&
      (suggestionSource || defaultOn || row.promptSuggestionEnabled !== false) &&
      (scraped || byteIdentical || watchdogFed || fabricated) &&
      !uniqueNearby,
  );
  const honest = Boolean(
    (suggestionsOff || marked) &&
      !fabricated &&
      row.submittedAsUser !== true &&
      !watchdogFed &&
      !selfLoop &&
      !uniqueNearby,
  );

  let eventClass = "idle";
  if (uniqueNearby && !ghostedTriad) {
    if (row.nearbySuggestionSource) eventClass = "suggestion-source";
    else if (row.nearbyWatchdogFed) eventClass = "watchdog-fed";
    else if (row.nearbyByteIdentical) eventClass = "byte-identical";
    else if (row.nearbyChannelBlind) eventClass = "channel-blind";
    else if (row.nearbyDefaultOn) eventClass = "default-on";
    else if (row.nearbyUnmarked) eventClass = "unmarked";
    else if (row.nearbySelfLoop) eventClass = "self-loop";
    else if (row.nearbyFakeApprove) eventClass = "fake-approve";
    else if (row.nearbyFabricated) eventClass = "fabricated";
    else if (row.nearbyScraped) eventClass = "scraped";
    else if (row.nearbyGhosted) eventClass = "ghosted";
    else if (isOffFetch(row)) eventClass = "ghosted";
  } else if (ghostedTriad) eventClass = "ghosted";
  else if (honest) eventClass = "muted";
  else if (fakeApprove) eventClass = "fake-approve";
  else if (selfLoop) eventClass = "self-loop";
  else if (fabricated) eventClass = "fabricated";
  else if (watchdogFed) eventClass = "watchdog-fed";
  else if (byteIdentical && scraped) eventClass = "byte-identical";
  else if (scraped) eventClass = "scraped";
  else if (unmarked) eventClass = "unmarked";
  else if (channelBlind) eventClass = "channel-blind";
  else if (defaultOn && !honest) eventClass = "default-on";
  else if (suggestionSource && !honest) eventClass = "suggestion-source";
  else if (honest || isIdle(row)) eventClass = "muted";
  else eventClass = "muted";

  return {
    uniqueNearby,
    suggestionSource,
    ghostOnPrompt,
    marked,
    unmarked,
    scraped,
    byteIdentical,
    defaultOn,
    channelBlind,
    watchdogFed,
    fabricated,
    fakeApprove,
    selfLoop,
    suggestionsOff,
    keyedOnly,
    ghostedTriad,
    honest,
    offFetch: isOffFetch(row),
    eventClass,
    ghostText: row.ghostText,
    capturePaneText: row.capturePaneText,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "muted";
  const facts = analyze(row);
  if (!facts.ghostedTriad) {
    if (row.nearbySuggestionSource) return "suggestion-source";
    if (row.nearbyWatchdogFed) return "watchdog-fed";
    if (row.nearbyByteIdentical) return "byte-identical";
    if (row.nearbyChannelBlind) return "channel-blind";
    if (row.nearbyDefaultOn) return "default-on";
    if (row.nearbyUnmarked) return "unmarked";
    if (row.nearbySelfLoop) return "self-loop";
    if (row.nearbyFakeApprove) return "fake-approve";
    if (row.nearbyFabricated) return "fabricated";
    if (row.nearbyScraped) return "scraped";
    if (row.nearbyGhosted) return "ghosted";
    if (facts.offFetch) return "ghosted";
  }
  if (facts.ghostedTriad) return "ghosted";
  if (facts.honest) return "muted";
  if (facts.fakeApprove) return "fake-approve";
  if (facts.selfLoop) return "self-loop";
  if (facts.fabricated) return "fabricated";
  if (facts.watchdogFed) return "watchdog-fed";
  if (facts.byteIdentical && facts.scraped) return "byte-identical";
  if (facts.scraped) return "scraped";
  if (facts.unmarked) return "unmarked";
  if (facts.channelBlind) return "channel-blind";
  if (facts.defaultOn && !facts.honest) return "default-on";
  if (facts.suggestionSource && !facts.honest) return "suggestion-source";
  if (facts.honest) return "muted";
  return "muted";
}

export function feedOf(kind) {
  if (kind === "ghosted") {
    return "● Ghosted · suggestion rendered as ghost text on the ❯ input line · primary #90755";
  }
  if (kind === "scraped") {
    return "● Scraped · capture-pane / pane scrape sees byte-identical suggestion text";
  }
  if (kind === "fabricated") {
    return "● Fabricated · suggestion submitted as a real user message · 220+ in one report";
  }
  if (kind === "fake-approve") {
    return '● Fake-approve · fabricated approval like "Yes, go ahead" was acted on';
  }
  if (kind === "self-loop") {
    return "● Self-loop · each reply generates a fresh suggestion which is resubmitted";
  }
  if (kind === "unmarked") {
    return "● Unmarked · no machine-readable marker / glyph / prefix on the suggestion line";
  }
  if (kind === "default-on") {
    return "● Default-on · promptSuggestionEnabled is default on";
  }
  if (kind === "channel-blind") {
    return "● Channel-blind · suggestions still on under --channels / headless";
  }
  if (kind === "byte-identical") {
    return "● Byte-identical · styled ghost equals typed bytes after scrape";
  }
  if (kind === "watchdog-fed") {
    return "● Watchdog-fed · automation treats the suggestion as stuck human input";
  }
  if (kind === "suggestion-source") {
    return "● Suggestion-source · debug source=prompt_suggestion";
  }
  return "● Muted · suggestions off or marked · input line is keyed-only · idle word is muted";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "ghosted" || facts.ghostedTriad) {
    reasons.push(
      "#90755 prompt suggestions render as ghost text indistinguishable from typed input in scraped/headless terminals",
    );
  }
  if (facts.ghostOnPrompt) {
    reasons.push(`ghost on ❯: ${row.ghostText || DEMO_SUGGESTION}`);
  }
  if (facts.suggestionSource) {
    reasons.push(`debug source=${row.suggestionSource || DEMO_SOURCE}`);
  }
  if (facts.scraped) {
    reasons.push(`pane scrape: ${row.capturePaneText || DEMO_CAPTURE}`);
  }
  if (facts.byteIdentical) reasons.push("styled ghost == typed bytes after scrape");
  if (facts.unmarked) reasons.push("no machine-readable marker / glyph / prefix on the suggestion line");
  if (facts.marked) reasons.push("composer marked — scrapers can filter suggestion text");
  if (facts.defaultOn || row.promptSuggestionEnabled === true) {
    reasons.push("promptSuggestionEnabled default on");
  }
  if (facts.channelBlind) {
    reasons.push(`channels / headless still suggesting (${row.permissionMode || DEMO_CHANNELS})`);
  }
  if (facts.watchdogFed) reasons.push(`watchdog fed from ${DEMO_WATCHDOG}`);
  if (facts.fabricated) {
    reasons.push(
      `submitted as a real user message${row.fabricatedCount ? ` · ${row.fabricatedCount}+ fabricated` : ""}`,
    );
  }
  if (facts.fakeApprove) {
    reasons.push(`fake approval acted on: ${row.approvalText || row.ghostText || DEMO_APPROVAL}`);
  }
  if (facts.selfLoop) reasons.push("each reply generates a fresh suggestion which is resubmitted");
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offFetch) {
    reasons.push(
      "labeled contrast, not this defect: Livery #90748 / Pinfold #90706 / Palimpsest #90725 / Escutcheon / Chatelaine / Fob / Visa / Sigil / Hasp / Knock / Slype / Scrim / Chute / Ambo / Byline",
    );
  }
  if (kind === "muted") {
    reasons.push(
      "suggestions off or marked; input line is keyed-only; idle word is muted",
    );
  }
  return reasons;
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offFetch;
  const alarm = ALARM_VERDICTS.includes(kind) && !off;
  return {
    product: "fetch",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    muted: kind === "muted",
    ghosted: kind === "ghosted",
    scraped: kind === "scraped",
    fabricated: kind === "fabricated",
    "fake-approve": kind === "fake-approve",
    "self-loop": kind === "self-loop",
    unmarked: kind === "unmarked",
    "default-on": kind === "default-on",
    "channel-blind": kind === "channel-blind",
    "byte-identical": kind === "byte-identical",
    "watchdog-fed": kind === "watchdog-fed",
    "suggestion-source": kind === "suggestion-source",
    alarm,
    thisBug: kind !== "muted" && !off,
    offFetch: off,
    eventClass: facts.eventClass,
    facts: {
      ghostedTriad: facts.ghostedTriad,
      honest: facts.honest,
      suggestionSource: facts.suggestionSource,
      ghostOnPrompt: facts.ghostOnPrompt,
      marked: facts.marked,
      unmarked: facts.unmarked,
      scraped: facts.scraped,
      byteIdentical: facts.byteIdentical,
      defaultOn: facts.defaultOn,
      channelBlind: facts.channelBlind,
      watchdogFed: facts.watchdogFed,
      fabricated: facts.fabricated,
      fakeApprove: facts.fakeApprove,
      selfLoop: facts.selfLoop,
      suggestionsOff: facts.suggestionsOff,
      keyedOnly: facts.keyedOnly,
      offFetch: facts.offFetch,
      ghostText: facts.ghostText,
      capturePaneText: facts.capturePaneText,
      version: facts.version,
      promptSuggestionEnabled: probe.promptSuggestionEnabled,
      composerMarked: probe.composerMarked,
      channelsActive: probe.channelsActive,
      recentKeystrokes: probe.recentKeystrokes,
      submittedAsUser: probe.submittedAsUser,
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

export function mutedOf(probe = {}) {
  return classify(probe) === "muted";
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    fetch: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedMuted() {
  return baseSeed("muted-hold", FEATURED_ISSUE, {
    source:
      "honest control: promptSuggestionEnabled off; suggestion line marked; input keyed-only",
    promptSuggestionEnabled: false,
    suggestionSource: "",
    ghostText: "",
    capturePaneText: "❯",
    composerMarked: true,
    channelsActive: true,
    recentKeystrokes: false,
    submittedAsUser: false,
    watchdogFed: false,
    selfLoop: false,
    headless: true,
    permissionMode: DEMO_CHANNELS,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedMuted();
}

export function seedReset() {
  return { action: "bail", fetch: emptyProbe() };
}

export function seedGhosted() {
  return baseSeed("90755-ghosted", FEATURED_ISSUE, {
    source:
      "primary #90755 ghost text on ❯; capture-pane sees byte-identical suggestion; source=prompt_suggestion",
    promptSuggestionEnabled: true,
    suggestionSource: DEMO_SOURCE,
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    composerMarked: false,
    channelsActive: true,
    recentKeystrokes: false,
    submittedAsUser: true,
    approvalText: DEMO_APPROVAL,
    watchdogFed: true,
    selfLoop: true,
    fabricatedCount: DEMO_FABRICATED_COUNT,
    headless: true,
    permissionMode: "auto",
    version: DEMO_VERSION,
  });
}

export function seed90755() {
  return seedGhosted();
}

export function seedFabricated() {
  return baseSeed("90755-fabricated", FEATURED_ISSUE, {
    source: "suggestion submitted as a real user message",
    promptSuggestionEnabled: true,
    suggestionSource: DEMO_SOURCE,
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    submittedAsUser: true,
    fabricatedCount: DEMO_FABRICATED_COUNT,
    nearbyFabricated: true,
    version: DEMO_VERSION,
  });
}

export function seedScraped() {
  return baseSeed("90755-scraped", FEATURED_ISSUE, {
    source: "tmux capture-pane -p sees the suggestion on the ❯ line",
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    nearbyScraped: true,
    version: DEMO_VERSION,
  });
}

export function seedFakeApprove() {
  return baseSeed("90755-fake-approve", FEATURED_ISSUE, {
    source: 'fabricated approval "Yes, go ahead" was acted on',
    ghostText: DEMO_APPROVAL,
    approvalText: DEMO_APPROVAL,
    submittedAsUser: true,
    nearbyFakeApprove: true,
    version: DEMO_VERSION,
  });
}

export function seedSelfLoop() {
  return baseSeed("90755-self-loop", FEATURED_ISSUE, {
    source: "each reply generates a fresh suggestion which is resubmitted — self-conversation loop",
    ghostText: DEMO_SUGGESTION,
    selfLoop: true,
    submittedAsUser: true,
    nearbySelfLoop: true,
    version: DEMO_VERSION,
  });
}

export function seedUnmarked() {
  return baseSeed("90755-unmarked", FEATURED_ISSUE, {
    source: "no machine-readable marker / glyph / prefix on the suggestion line",
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    composerMarked: false,
    nearbyUnmarked: true,
    version: DEMO_VERSION,
  });
}

export function seedDefaultOn() {
  return baseSeed("90755-default-on", FEATURED_ISSUE, {
    source: "promptSuggestionEnabled is default on",
    promptSuggestionEnabled: true,
    nearbyDefaultOn: true,
    version: DEMO_VERSION,
  });
}

export function seedChannelBlind() {
  return baseSeed("90755-channel-blind", FEATURED_ISSUE, {
    source: "suggestions still on under --channels plugin:telegram / headless",
    promptSuggestionEnabled: true,
    channelsActive: true,
    headless: true,
    permissionMode: DEMO_CHANNELS,
    nearbyChannelBlind: true,
    version: DEMO_VERSION,
  });
}

export function seedByteIdentical() {
  return baseSeed("90755-byte-identical", FEATURED_ISSUE, {
    source: "styled ghost is byte-identical to typed input after scrape; styling is stripped",
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    nearbyByteIdentical: true,
    version: DEMO_VERSION,
  });
}

export function seedWatchdogFed() {
  return baseSeed("90755-watchdog-fed", FEATURED_ISSUE, {
    source: "watchdog rescues stuck input by scraping tmux capture-pane -p and resubmits",
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    watchdogFed: true,
    nearbyWatchdogFed: true,
    version: DEMO_VERSION,
  });
}

export function seedSuggestionSource() {
  return baseSeed("90755-suggestion-source", FEATURED_ISSUE, {
    source: "debug source=prompt_suggestion",
    suggestionSource: DEMO_SOURCE,
    nearbySuggestionSource: true,
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  muted: seedMuted,
  control: seedMuted,
  healthy: seedMuted,
  hold: seedMuted,
  ghosted: seedGhosted,
  90755: seedGhosted,
  "90755": seedGhosted,
  fabricated: seedFabricated,
  scraped: seedScraped,
  "fake-approve": seedFakeApprove,
  fakeapprove: seedFakeApprove,
  "self-loop": seedSelfLoop,
  selfloop: seedSelfLoop,
  unmarked: seedUnmarked,
  "default-on": seedDefaultOn,
  defaulton: seedDefaultOn,
  "channel-blind": seedChannelBlind,
  channelblind: seedChannelBlind,
  "byte-identical": seedByteIdentical,
  byteidentical: seedByteIdentical,
  "watchdog-fed": seedWatchdogFed,
  watchdogfed: seedWatchdogFed,
  "suggestion-source": seedSuggestionSource,
  suggestionsource: seedSuggestionSource,
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
    return { action: payload, fetch: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const fetch = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || fetch.session),
    issue: asIssue(src.issue ?? fetch.issue),
    source: asText(src.source || fetch.source),
    fetch,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.fetch);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("muted", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedMuted().fetch;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (
    verb === "restore" ||
    verb === "incident" ||
    verb === "90755" ||
    verb === "ghosted" ||
    verb === "fabricated"
  ) {
    probe = seedGhosted().fetch;
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
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return cloneProbe({ ...raw, scored: true });
  }
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
  if (SUGGESTION_SOURCE_RE.test(text)) probe.suggestionSource = DEMO_SOURCE;
  if (/promptSuggestionEnabled/i.test(text)) {
    probe.promptSuggestionEnabled = !/promptSuggestionEnabled["\s:=]+(?:false|off)/i.test(text);
  }
  if (APPROVAL_RE.test(text)) {
    probe.ghostText = DEMO_SUGGESTION;
    probe.approvalText = DEMO_APPROVAL;
  } else if (/ghost text|suggested (user )?reply|on the ❯|on the > /i.test(text)) {
    probe.ghostText = DEMO_SUGGESTION;
  }
  if (CAPTURE_RE.test(text) || /❯/.test(text)) {
    probe.capturePaneText = /░|\[suggestion\]/.test(text) ? DEMO_MARKED_CAPTURE : DEMO_CAPTURE;
  }
  if (MARKER_RE.test(text)) probe.composerMarked = true;
  else if (probe.ghostText || probe.capturePaneText) probe.composerMarked = false;
  if (CHANNEL_RE.test(text) || /headless/i.test(text)) {
    probe.channelsActive = true;
    probe.headless = true;
    probe.permissionMode = DEMO_CHANNELS;
  }
  if (/no recent (local )?keystroke/i.test(text)) probe.recentKeystrokes = false;
  if (/submitted as|fabricated user|220\+/i.test(text)) {
    probe.submittedAsUser = true;
    probe.fabricatedCount = DEMO_FABRICATED_COUNT;
  }
  if (/watchdog/i.test(text)) probe.watchdogFed = true;
  if (/self-?loop|self-conversation|fresh suggestion/i.test(text)) probe.selfLoop = true;
  if (/2\.1\.24[6-9]|2\.1\.25[01]/.test(text)) probe.version = DEMO_VERSION;
  probe.scored = true;
  return cloneProbe(probe);
}

export function parseFetchJson(raw) {
  if (raw && typeof raw === "object") {
    return cloneProbe({ ...raw, scored: true });
  }
  return parseTranscript(raw);
}

export function emptyAction(verb = "idle") {
  return { action: verb, fetch: emptyProbe() };
}
