#!/usr/bin/env node
/**
 * Trompe — trompe-l'œil gallery / painted-false-clear scorer.
 * A painted clear is not a hold. Score the pane or admit intact.
 *
 *   echo '{"quotedTag":true,"chipPainted":true,"canaryRecalled":true}' | node trompe.mjs
 *   node trompe.mjs ticket.json
 *
 * Idle word is intact.
 * Seeded state is phantom / #90881.
 * NEVER idle as "trompe", "gallery", "gilt", "clear", "chip",
 * "banner", "pane", "desktop", "scrollback".
 *
 * Primary #90881: desktop command-chip renderer uses
 * .includes('<command-name>/clear</command-name>') (and sibling tags)
 * on message content. Quoting the tag as ordinary text paints a real
 * /clear chip + "(no output)" + "Context cleared" banner and collapses
 * scrollback, while the session JSONL and model context stay intact.
 *
 * INTACT if no painted chip, no false banner, scrollback visible,
 * JSONL continuous, canary still in context.
 * PHANTOM if a quoted tag painted a destructive clear that never ran.
 *
 * NOT Ambo #90685, Carcase #90867, Callboard #90858, Chad #90407,
 * Husk, Davy #90886. Same-class cite (not primary): #53715, #88367.
 * Cross: openai/codex#41758, openai/codex#41748.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "intact",
  "phantom",
  "cleared",
  "collapsed",
  "substring",
  "chip-lied",
  "scrollback-hid",
  "canary-kept",
  "quoted-tag",
  "false-banner",
  "render-only",
  "no-truncate",
  "envelope-miss",
]);
export const IDLE_WORD = "intact";
export const SEED_ALIASES = Object.freeze({
  90881: "phantom",
});
export const HOLD_VERDICTS = Object.freeze(["intact"]);
export const ALARM_VERDICTS = Object.freeze([
  "phantom",
  "cleared",
  "collapsed",
  "substring",
  "chip-lied",
  "scrollback-hid",
  "canary-kept",
  "quoted-tag",
  "false-banner",
  "render-only",
  "no-truncate",
  "envelope-miss",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90881;
export const PRIMARY_ISSUES = Object.freeze([90881]);
export const SAME_CLASS = Object.freeze([53715, 88367]);
export const CODEX_SAME = Object.freeze([41758, 41748]);
export const NOT_PRODUCTS = Object.freeze([
  "ambo",
  "carcase",
  "callboard",
  "chad",
  "husk",
  "davy",
]);
export const CLI = "2.1.251";
export const CLI_SINCE = "2.1.183";
export const DESKTOP = "1.40609.0";
export const DESKTOP_SINCE = "1.14271.0";
export const PLATFORM = "macos";
export const DARWIN = "24G419";
export const OS_VERSION = "15.7.3";
export const FILED_AT = "2026-08-31T02:51:00Z";
export const REPORTER = "dnorth123";
export const TITLE =
  "Desktop app: command-chip renderer matches the command-name tag anywhere in message content, faking a /clear and hiding scrollback (no actual clear)";
export const ISSUE_URL = "https://github.com/anthropics/claude-code/issues/90881";
export const LABELS = Object.freeze(["bug", "platform:macos", "area:ui", "area:desktop"]);
export const CANARY_TOKEN = "CANARY-TROMPE-88";
export const ISSUE_CANARY = "PATINA-7731-OBSIDIAN";
export const CLEAR_TAG = "<command-name>/clear</command-name>";
export const SIBLING_TAGS = Object.freeze([
  "<command-name>/clear</command-name>",
  "<command-message>/clear</command-message>",
  "<command-args></command-args>",
]);
export const PHRASE = "A painted clear is not a hold. Score the pane or admit intact.";
export const MARK = "14:50 / hermes catalog #88 / #90881";

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

export function contentHasClearTag(text) {
  const n = String(text || "");
  return (
    n.includes("<command-name>/clear</command-name>") ||
    n.includes("<command-message>/clear</command-message>") ||
    n.includes("<command-name>/clear")
  );
}

export function emptyTicket() {
  return seedPhantom();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.trompe && typeof src.trompe === "object" && src.trompe) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.pane && typeof src.pane === "object" && src.pane) ||
    src;
  const content = firstText(
    nested.content,
    nested.messageContent,
    nested.message_content,
    nested.text,
    src.content,
  );
  return {
    issue: firstNum(nested.issue, src.issue, nested.seed, src.seed) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    quotedTag: firstBool(nested.quotedTag, nested.quoted_tag, src.quotedTag),
    leadingSlash: firstBool(nested.leadingSlash, nested.leading_slash, src.leadingSlash),
    hasEnvelope: firstBool(
      nested.hasEnvelope,
      nested.has_envelope,
      nested.envelope,
      src.hasEnvelope,
    ),
    authorRole: firstText(nested.authorRole, nested.author_role, nested.role, src.authorRole),
    content,
    contentIncludesTag: firstBool(
      nested.contentIncludesTag,
      nested.content_includes_tag,
      src.contentIncludesTag,
    ),
    chipPainted: firstBool(nested.chipPainted, nested.chip_painted, nested.chip, src.chipPainted),
    noOutputShown: firstBool(
      nested.noOutputShown,
      nested.no_output_shown,
      nested.noOutput,
      src.noOutputShown,
    ),
    bannerShown: firstBool(
      nested.bannerShown,
      nested.banner_shown,
      nested.banner,
      nested.contextCleared,
      src.bannerShown,
    ),
    scrollbackCollapsed: firstBool(
      nested.scrollbackCollapsed,
      nested.scrollback_collapsed,
      nested.collapsed,
      src.scrollbackCollapsed,
    ),
    jsonlContinuous: firstBool(
      nested.jsonlContinuous,
      nested.jsonl_continuous,
      src.jsonlContinuous,
    ),
    jsonlTruncated: firstBool(
      nested.jsonlTruncated,
      nested.jsonl_truncated,
      src.jsonlTruncated,
    ),
    canaryToken: firstText(nested.canaryToken, nested.canary_token, nested.canary, src.canaryToken),
    canaryRecalled: firstBool(
      nested.canaryRecalled,
      nested.canary_recalled,
      src.canaryRecalled,
    ),
    canaryAnswer: firstText(nested.canaryAnswer, nested.canary_answer, src.canaryAnswer),
    actualClear: firstBool(nested.actualClear, nested.actual_clear, src.actualClear),
    substringMatch: firstBool(
      nested.substringMatch,
      nested.substring_match,
      src.substringMatch,
    ),
    renderOnly: firstBool(nested.renderOnly, nested.render_only, src.renderOnly),
    recordCountBefore: firstNum(
      nested.recordCountBefore,
      nested.record_count_before,
      src.recordCountBefore,
    ),
    recordCountAfter: firstNum(
      nested.recordCountAfter,
      nested.record_count_after,
      src.recordCountAfter,
    ),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      nested.desktop,
      src.desktopVersion,
    ),
    version: firstText(nested.version, src.version) || "",
    cli: firstText(nested.cli, src.cli) || "",
    platform: firstText(nested.platform, src.platform) || "",
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text, src.outputText),
  };
}

export function isIntactHold(ticket) {
  const row = cloneTicket(ticket);
  const noPaint = row.chipPainted !== true && row.bannerShown !== true && row.noOutputShown !== true;
  const scrollVisible = row.scrollbackCollapsed !== true;
  const ledgerOk = row.jsonlTruncated !== true && row.actualClear !== true;
  const quotedHonest = row.quotedTag === true && noPaint;
  const neverQuoted = row.quotedTag !== true && noPaint && scrollVisible;
  return (quotedHonest || neverQuoted) && ledgerOk && row.leadingSlash !== true;
}

export function isPhantomSignature(ticket) {
  const row = cloneTicket(ticket);
  const quoted = row.quotedTag === true || contentHasClearTag(row.content) || row.substringMatch === true;
  const notCommand = row.leadingSlash !== true && row.hasEnvelope !== true;
  const painted = row.chipPainted === true && (row.bannerShown === true || row.noOutputShown === true);
  const hid = row.scrollbackCollapsed === true;
  const kept =
    row.actualClear !== true &&
    (row.jsonlContinuous === true || row.jsonlTruncated === false) &&
    (row.canaryRecalled === true || Boolean(row.canaryAnswer));
  return quoted && notCommand && painted && hid && kept;
}

export function analyze(input) {
  const row = cloneTicket(input);
  const text = `${row.outputText || ""} ${row.content || ""}`;
  const tagInContent = contentHasClearTag(row.content) || contentHasClearTag(text);
  const quoted =
    row.quotedTag === true ||
    tagInContent ||
    /quoted?[- ]tag|literal text|echo it back verbatim/i.test(text);
  const substring =
    row.substringMatch === true ||
    row.contentIncludesTag === true ||
    tagInContent ||
    /\.includes\(|substring/i.test(text);
  const chipLied = row.chipPainted === true || /\/clear chip|chip[- ]lied|paints a real/i.test(text);
  const banner = row.bannerShown === true || /context cleared|false[- ]banner/i.test(text);
  const noOutput = row.noOutputShown === true || /\(no output\)/i.test(text);
  const collapsed =
    row.scrollbackCollapsed === true || /scrollback (collapsed|hid)|collapsed out of view/i.test(text);
  const canaryKept =
    row.canaryRecalled === true ||
    Boolean(row.canaryAnswer) ||
    /canary (stored|recalled|kept|still)/i.test(text);
  const renderOnly =
    row.renderOnly === true ||
    (row.actualClear !== true && (chipLied || banner)) ||
    /render[- ]only|front-end render artifact/i.test(text);
  const noTruncate =
    row.jsonlContinuous === true ||
    row.jsonlTruncated === false ||
    (row.recordCountBefore != null &&
      row.recordCountAfter != null &&
      row.recordCountAfter >= row.recordCountBefore) ||
    /jsonl (is )?(complete|continuous)|no truncation/i.test(text);
  const envelopeMiss =
    (quoted && row.leadingSlash !== true && row.hasEnvelope !== true) ||
    /envelope[- ]miss|no check for a leading-slash|author role/i.test(text);
  const cleared = banner || (row.actualClear === true);
  const phantom = isPhantomSignature(row);
  const intact = isIntactHold(row);
  return {
    row,
    intact,
    phantom,
    cleared,
    collapsed,
    substring,
    chipLied,
    scrollbackHid: collapsed,
    canaryKept,
    quotedTag: quoted,
    falseBanner: banner && row.actualClear !== true,
    renderOnly,
    noTruncate,
    envelopeMiss,
    noOutput,
    featured: row.issue === FEATURED_ISSUE && phantom,
    chips: collectChips({
      intact,
      phantom,
      cleared,
      collapsed,
      substring,
      chipLied,
      scrollbackHid: collapsed,
      canaryKept,
      quotedTag: quoted,
      falseBanner: banner && row.actualClear !== true,
      renderOnly,
      noTruncate,
      envelopeMiss,
    }),
  };
}

function collectChips(flags) {
  const chips = [];
  if (flags.intact) chips.push("intact");
  if (flags.phantom) chips.push("phantom");
  if (flags.cleared) chips.push("cleared");
  if (flags.collapsed) chips.push("collapsed");
  if (flags.substring) chips.push("substring");
  if (flags.chipLied) chips.push("chip-lied");
  if (flags.scrollbackHid) chips.push("scrollback-hid");
  if (flags.canaryKept) chips.push("canary-kept");
  if (flags.quotedTag) chips.push("quoted-tag");
  if (flags.falseBanner) chips.push("false-banner");
  if (flags.renderOnly) chips.push("render-only");
  if (flags.noTruncate) chips.push("no-truncate");
  if (flags.envelopeMiss) chips.push("envelope-miss");
  return [...new Set(chips)];
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const aliasFromIssue = SEED_ALIASES[facts.row.issue];
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.intact && !ALARM_VERDICTS.includes(seed)) return "intact";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (aliasFromIssue === "phantom" && facts.phantom) return "phantom";
  if (facts.featured || facts.phantom) return "phantom";
  if (facts.chipLied && facts.quotedTag) return "chip-lied";
  if (facts.falseBanner) return "false-banner";
  if (facts.collapsed) return "scrollback-hid";
  if (facts.substring) return "substring";
  if (facts.envelopeMiss) return "envelope-miss";
  if (facts.renderOnly) return "render-only";
  if (facts.noTruncate && facts.canaryKept) return "canary-kept";
  if (facts.quotedTag) return "quoted-tag";
  if (facts.cleared) return "cleared";
  if (facts.intact) return "intact";
  return "intact";
}

export function chipsOf(input) {
  return analyze(input).chips;
}

export function score(input) {
  const facts = analyze(input);
  const verdict = classify(input);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    state: verdict,
    intact: verdict === "intact" || facts.intact,
    phantom: verdict === "phantom" || facts.phantom,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      quotedTag: facts.quotedTag,
      leadingSlash: facts.row.leadingSlash,
      hasEnvelope: facts.row.hasEnvelope,
      chipPainted: facts.row.chipPainted,
      bannerShown: facts.row.bannerShown,
      scrollbackCollapsed: facts.row.scrollbackCollapsed,
      jsonlContinuous: facts.row.jsonlContinuous,
      canaryRecalled: facts.row.canaryRecalled,
      actualClear: facts.row.actualClear,
      substringMatch: facts.substring,
      renderOnly: facts.renderOnly,
      canaryToken: facts.row.canaryToken || CANARY_TOKEN,
      phantom: facts.phantom,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "intact") {
    return "● Intact · no painted chip, scrollback visible, JSONL continuous, canary in context · hold";
  }
  if (kind === "cleared") {
    return "● Cleared · UI claims context cleared · alarm";
  }
  if (kind === "collapsed") {
    return "● Collapsed · prior scrollback visually hidden · alarm";
  }
  if (kind === "substring") {
    return "● Substring · .includes('<command-name>/clear</command-name>') on message content · alarm";
  }
  if (kind === "chip-lied") {
    return "● Chip-lied · painted a real /clear chip for quoted text · alarm";
  }
  if (kind === "scrollback-hid") {
    return "● Scrollback-hid · prior turns collapsed out of view · alarm";
  }
  if (kind === "canary-kept") {
    return "● Canary-kept · planted canary still recalled after the painted clear · alarm";
  }
  if (kind === "quoted-tag") {
    return "● Quoted-tag · tag quoted as documentation, not a command · alarm";
  }
  if (kind === "false-banner") {
    return "● False-banner · Context cleared banner with no actual clear · alarm";
  }
  if (kind === "render-only") {
    return "● Render-only · front-end render artifact; no JSONL change · alarm";
  }
  if (kind === "no-truncate") {
    return "● No-truncate · session JSONL continuous; record count untruncated · alarm";
  }
  if (kind === "envelope-miss") {
    return "● Envelope-miss · no leading-slash / command envelope / author-role gate · alarm";
  }
  return "● Phantom · quoted tag painted a /clear chip + (no output) + Context cleared; JSONL and canary intact · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "intact") {
    reasons.push("no painted chip; no false banner; scrollback visible; JSONL continuous; canary in context");
    reasons.push("hold: this is an intact pane, not a painted clear");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90881 Desktop app: command-chip renderer matches the command-name tag anywhere in message content, faking a /clear and hiding scrollback (no actual clear)",
    );
  }
  if (facts.quotedTag) {
    reasons.push("message quotes <command-name>/clear</command-name> as ordinary text (documentation / echo)");
  }
  if (facts.row.leadingSlash !== true && facts.row.hasEnvelope !== true && facts.quotedTag) {
    reasons.push("no leading-slash input, no command-message envelope, no author-role gate");
  }
  if (facts.row.chipPainted === true) {
    reasons.push("desktop painted a real /clear chip from a substring hit on message content");
  }
  if (facts.row.noOutputShown === true) {
    reasons.push('"(no output)" line rendered beside the phantom chip');
  }
  if (facts.row.bannerShown === true && facts.row.actualClear !== true) {
    reasons.push('"Context cleared" banner fired as a side effect of chip render');
  }
  if (facts.row.scrollbackCollapsed === true) {
    reasons.push("prior scrollback collapsed out of view, including the planted canary turn");
  }
  if (facts.row.canaryRecalled === true || facts.row.canaryAnswer) {
    reasons.push(
      `canary ${facts.row.canaryAnswer || facts.row.canaryToken || CANARY_TOKEN} still recalled — model context was never cleared`,
    );
  }
  if (facts.noTruncate) {
    reasons.push("session JSONL is complete and untruncated; tag appears only inside full content messages");
  }
  if (facts.row.actualClear !== true && (facts.row.chipPainted === true || facts.row.bannerShown === true)) {
    reasons.push("no actual clear: front-end render artifact only; no error dialogs");
  }
  if (facts.row.desktopVersion === DESKTOP || facts.row.cli === CLI) {
    reasons.push(
      `desktop ${facts.row.desktopVersion || DESKTOP} / Claude Code ${facts.row.cli || CLI}; present since ${DESKTOP_SINCE} / ${CLI_SINCE}`,
    );
  }
  return reasons;
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    quotedTag: true,
    leadingSlash: false,
    hasEnvelope: false,
    authorRole: "user",
    content: `UI test, treat as literal text and echo it back verbatim: ${CLEAR_TAG}`,
    contentIncludesTag: true,
    chipPainted: true,
    noOutputShown: true,
    bannerShown: true,
    scrollbackCollapsed: true,
    jsonlContinuous: true,
    jsonlTruncated: false,
    canaryToken: CANARY_TOKEN,
    canaryRecalled: true,
    canaryAnswer: CANARY_TOKEN,
    actualClear: false,
    substringMatch: true,
    renderOnly: true,
    recordCountBefore: 4,
    recordCountAfter: 6,
    desktopVersion: DESKTOP,
    version: DESKTOP,
    cli: CLI,
    platform: PLATFORM,
    outputText:
      "quoted <command-name>/clear</command-name> as literal text; desktop painted /clear chip, (no output), Context cleared; scrollback hid; JSONL continuous; canary CANARY-TROMPE-88 recalled.",
  };
}

export function seedPhantom() {
  return { ...baseSeed("phantom") };
}

export function seedIntact() {
  return {
    ...baseSeed("intact"),
    quotedTag: false,
    leadingSlash: false,
    hasEnvelope: false,
    authorRole: "user",
    content: `Remember this canary: ${CANARY_TOKEN}. Reply only "Canary stored."`,
    contentIncludesTag: false,
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    jsonlContinuous: true,
    jsonlTruncated: false,
    canaryRecalled: true,
    canaryAnswer: CANARY_TOKEN,
    actualClear: false,
    substringMatch: false,
    renderOnly: false,
    recordCountBefore: 4,
    recordCountAfter: 4,
    outputText: "session scrollback visible; JSONL continuous; canary in context; no painted clear",
  };
}

export function seedCleared() {
  return {
    ...baseSeed("cleared"),
    chipPainted: false,
    noOutputShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "UI claims context cleared",
  };
}

export function seedCollapsed() {
  return {
    ...baseSeed("collapsed"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "prior scrollback visually hidden",
  };
}

export function seedSubstring() {
  return {
    ...baseSeed("substring"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: ".includes('<command-name>/clear</command-name>') on message content",
  };
}

export function seedChipLied() {
  return {
    ...baseSeed("chip-lied"),
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "painted a real /clear chip for quoted text",
  };
}

export function seedScrollbackHid() {
  return {
    ...baseSeed("scrollback-hid"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "prior turns collapsed out of view",
  };
}

export function seedCanaryKept() {
  return {
    ...baseSeed("canary-kept"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    outputText: "planted canary still recalled after the painted clear",
  };
}

export function seedQuotedTag() {
  return {
    ...baseSeed("quoted-tag"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "tag quoted as documentation, not a command",
  };
}

export function seedFalseBanner() {
  return {
    ...baseSeed("false-banner"),
    chipPainted: false,
    noOutputShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "Context cleared banner with no actual clear",
  };
}

export function seedRenderOnly() {
  return {
    ...baseSeed("render-only"),
    chipPainted: true,
    bannerShown: true,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "front-end render artifact; no JSONL change",
  };
}

export function seedNoTruncate() {
  return {
    ...baseSeed("no-truncate"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "session JSONL continuous; record count untruncated",
  };
}

export function seedEnvelopeMiss() {
  return {
    ...baseSeed("envelope-miss"),
    chipPainted: false,
    noOutputShown: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    canaryRecalled: false,
    canaryAnswer: "",
    outputText: "no check for a leading-slash input, a command-message envelope, or an author role",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    intact: seedIntact,
    phantom: seedPhantom,
    cleared: seedCleared,
    collapsed: seedCollapsed,
    substring: seedSubstring,
    "chip-lied": seedChipLied,
    "scrollback-hid": seedScrollbackHid,
    "canary-kept": seedCanaryKept,
    "quoted-tag": seedQuotedTag,
    "false-banner": seedFalseBanner,
    "render-only": seedRenderOnly,
    "no-truncate": seedNoTruncate,
    "envelope-miss": seedEnvelopeMiss,
    90881: seedPhantom,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedPhantom());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.trompe?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket = payload.ticket || payload.trompe || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export function parseJsonl(text) {
  const raw = String(text || "").trim();
  if (!raw) return { ticket: seedPhantom(), records: [], continuous: true };
  const lines = raw.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const records = [];
  for (const line of lines) {
    try {
      records.push(JSON.parse(line));
    } catch {
      records.push({ raw: line, unparsed: true });
    }
  }
  const contents = records.map((row) => {
    if (typeof row.content === "string") return row.content;
    if (row.message && typeof row.message.content === "string") return row.message.content;
    return JSON.stringify(row);
  });
  const hasTag = contents.some((content) => contentHasClearTag(content));
  const canary = contents.find((content) => content.includes(CANARY_TOKEN) || content.includes(ISSUE_CANARY));
  const ticket = {
    quotedTag: hasTag,
    contentIncludesTag: hasTag,
    substringMatch: hasTag,
    jsonlContinuous: true,
    jsonlTruncated: false,
    recordCountBefore: records.length,
    recordCountAfter: records.length,
    canaryToken: canary ? (canary.includes(CANARY_TOKEN) ? CANARY_TOKEN : ISSUE_CANARY) : CANARY_TOKEN,
    canaryRecalled: Boolean(canary),
    actualClear: false,
    renderOnly: hasTag,
    outputText: `parsed session JSONL: ${records.length} records, tag=${hasTag}, canary=${Boolean(canary)}`,
  };
  return { ticket, records, continuous: true, hasTag, canary: Boolean(canary) };
}

export function simulateQuotedClear(content) {
  const text = String(content || `echo verbatim: ${CLEAR_TAG}`);
  const hit = contentHasClearTag(text);
  const leading = /^\s*\//.test(text) && !contentHasClearTag(text);
  return {
    content: text,
    substringHit: hit,
    paintsChip: hit,
    genuineCommand: leading && !hit,
    ticket: {
      quotedTag: hit,
      leadingSlash: leading,
      hasEnvelope: false,
      content: text,
      contentIncludesTag: hit,
      chipPainted: hit,
      noOutputShown: hit,
      bannerShown: hit,
      scrollbackCollapsed: hit,
      jsonlContinuous: true,
      jsonlTruncated: false,
      canaryToken: CANARY_TOKEN,
      canaryRecalled: true,
      canaryAnswer: CANARY_TOKEN,
      actualClear: false,
      substringMatch: hit,
      renderOnly: hit,
      outputText: hit
        ? "substring hit painted /clear chip on quoted tag"
        : "no command-name tag; pane stays intact",
    },
  };
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = result.alarm;
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? "Trompe phantom. A painted clear is not a hold. #90881 desktop command-chip renderer matches <command-name>/clear</command-name> anywhere in message content, faking a /clear and hiding scrollback. JSONL and canary stay intact. Score the pane or admit intact."
        : "Trompe intact. No painted chip; scrollback visible; JSONL continuous; canary in context.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedPhantom();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.trompe || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedPhantom();
  }
  return seedPhantom();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedPhantom());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
