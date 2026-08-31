#!/usr/bin/env node
/**
 * Moviola — 1924 film-editing machine scorer.
 * A recut print is not a hold. Score the splice or admit latched.
 *
 *   echo '{"cacheRead":26314,"prefixMutated":true}' | node moviola.mjs
 *   node moviola.mjs ticket.json
 *
 * Idle word is latched.
 * Seeded state is recut / #90716.
 * NEVER idle as "moviola", "film", "trim", "cache", "image", "prefix".
 *
 * Primary #90716: Image eviction in long sessions mutates the
 * conversation prefix, forcing a full context re-cache on every
 * subsequent image read. The trim bin is the conversation prefix.
 * Pulling an early image-frame silently recuts the print.
 *
 * LATCHED if the prefix is byte-stable, cache_read still amortizing
 * (~658k class), cache_creation per image ~3.4k, no eviction splice.
 * RECUT if earliest images dropped, prefix mutated, full re-cache.
 *
 * NOT Carcase #90867, Callboard #90858, Leaven #90782, Hydra #90856,
 * Limpet #89275, Scion #90815, Almanac #90804, Voucher #90807,
 * Kindling #90798, Palimpsest #90725, Fetch #90755, Cenotaph #90771.
 * Nearby only (do not ship): Weir #90802, Cartouche #90881, #72226, #61091.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "latched",
  "recut",
  "mutated",
  "evicted",
  "recached",
  "burned",
  "collapsed",
  "silent",
  "one-in-one-out",
  "prefix-rewritten",
]);
export const IDLE_WORD = "latched";
export const SEED_ALIASES = Object.freeze({
  90716: "recut",
});
export const HOLD_VERDICTS = Object.freeze(["latched"]);
export const ALARM_VERDICTS = Object.freeze([
  "recut",
  "mutated",
  "evicted",
  "recached",
  "burned",
  "collapsed",
  "silent",
  "one-in-one-out",
  "prefix-rewritten",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90716;
export const PRIMARY_ISSUES = Object.freeze([90716]);
export const SAME_CLASS = Object.freeze([86075, 89418, 90363, 90675, 35925]);
export const NEARBY_BOUNDARY = Object.freeze([72226, 61091, 90881, 90802]);
export const CODEX_SAME = 35925;
export const CLI = "2.1.220";
export const PLATFORM = "windows";
export const FILED_AT = "2026-08-30T09:40:19Z";
export const REPORTER = "Bewelge";
export const TITLE =
  "[BUG] Image eviction in long sessions mutates the conversation prefix, forcing a full context re-cache on every subsequent image read";
export const ISSUE_URL = "https://github.com/anthropics/claude-code/issues/90716";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cost",
  "area:core",
]);
export const CACHE_READ_BEFORE = 658681;
export const CACHE_CREATION_BEFORE = 3439;
export const CACHE_READ_FLOOR = 26314;
export const CACHE_READ_FLOOR_ALT = 26317;
export const CACHE_CREATION_AFTER = 590100;
export const IMAGE_TOKEN_WEIGHT = 3361;
export const IMAGE_TOKEN_WEIGHT_ALT = 3439;
export const PAGE_IMAGE_THRESHOLD = 40;
export const COLLAPSE_AT = Object.freeze([41, 45, 49]);
export const SAFE_SESSION_IMAGES = 24;
export const SAFE_SESSION_CONTEXT = 688000;
export const FULL_PAGE_COLLAPSED = 20;
export const CROP_SAFE = 3;
export const PROMPT_TOTAL_DROP_A = 53482;
export const PROMPT_TOTAL_DROP_B = 54274;
export const PROMPT_TOTAL_DROP = 54000;
export const ONE_IN_ONE_OUT_MIN = 113;
export const ONE_IN_ONE_OUT_MAX = 149;
export const BURN_BEFORE = 12100000;
export const BURN_AFTER = 68500000;
export const BURN_MULTIPLIER = 5.7;
export const ALLOWANCE_MINUTES = 31;
export const CONTEXT_REWRITE_MIN = 600000;
export const CONTEXT_REWRITE_MAX = 740000;
export const IMAGE_WIDTH = 1323;
export const IMAGE_HEIGHT = 1871;
export const PHRASE = "a recut print is not a hold. Score the splice or admit latched.";
export const MARK = "12:50 / hermes catalog #86 / #90716";

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

function firstArr(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

export function emptyTicket() {
  return seedRecut();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.moviola && typeof src.moviola === "object" && src.moviola) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.reel && typeof src.reel === "object" && src.reel) ||
    src;
  return {
    issue: firstNum(nested.issue, src.issue, nested.seed, src.seed) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    imageCount: firstNum(
      nested.imageCount,
      nested.images,
      nested.pageImages,
      nested.page_images,
      src.imageCount,
      src.images,
      src.pageImages,
    ),
    cropImages: firstNum(nested.cropImages, nested.crop_images, nested.crops, src.cropImages),
    fullPagePngs: firstNum(
      nested.fullPagePngs,
      nested.full_page_pngs,
      nested.fullPages,
      src.fullPagePngs,
    ),
    prefixMutated: firstBool(
      nested.prefixMutated,
      nested.prefix_mutated,
      nested.prefixRewritten,
      src.prefixMutated,
    ),
    earliestDropped: firstBool(
      nested.earliestDropped,
      nested.earliest_dropped,
      nested.imagesDropped,
      src.earliestDropped,
    ),
    evictedCount: firstNum(
      nested.evictedCount,
      nested.evicted_count,
      nested.droppedCount,
      src.evictedCount,
    ),
    cacheRead: firstNum(
      nested.cacheRead,
      nested.cache_read,
      nested.cache_read_input_tokens,
      src.cacheRead,
      src.cache_read,
    ),
    cacheCreation: firstNum(
      nested.cacheCreation,
      nested.cache_creation,
      nested.cache_creation_input_tokens,
      src.cacheCreation,
      src.cache_creation,
    ),
    cacheReadFloor: firstNum(
      nested.cacheReadFloor,
      nested.cache_read_floor,
      src.cacheReadFloor,
    ),
    promptTotalDelta: firstNum(
      nested.promptTotalDelta,
      nested.prompt_total_delta,
      nested.promptDelta,
      src.promptTotalDelta,
    ),
    burnRate: firstNum(nested.burnRate, nested.burn_rate, nested.burnMultiplier, src.burnRate),
    tokensPerHour: firstNum(
      nested.tokensPerHour,
      nested.tokens_per_hour,
      nested.burnTokensPerHour,
      src.tokensPerHour,
    ),
    allowanceMinutes: firstNum(
      nested.allowanceMinutes,
      nested.allowance_minutes,
      nested.minutesToAllowance,
      src.allowanceMinutes,
    ),
    contextManagement: nested.contextManagement !== undefined
      ? nested.contextManagement
      : nested.context_management !== undefined
        ? nested.context_management
        : src.contextManagement !== undefined
          ? src.contextManagement
          : undefined,
    warning: firstText(nested.warning, nested.warn, src.warning),
    error: firstText(nested.error, nested.err, src.error),
    oneInOneOut: firstBool(
      nested.oneInOneOut,
      nested.one_in_one_out,
      nested.oneInOneOutAfterCollapse,
      src.oneInOneOut,
    ),
    spliceAt: firstNum(
      nested.spliceAt,
      nested.splice_at,
      nested.collapseAtImage,
      nested.collapse_at_image,
      src.spliceAt,
    ),
    prefixStable: firstBool(nested.prefixStable, nested.prefix_stable, src.prefixStable),
    breakpointsInvalidated: firstBool(
      nested.breakpointsInvalidated,
      nested.breakpoints_invalidated,
      nested.cacheBreakpointsInvalidated,
      src.breakpointsInvalidated,
    ),
    trimBin: firstArr(nested.trimBin, nested.trim_bin, nested.evictedFrames, src.trimBin),
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text, src.outputText),
    version: firstText(nested.version, src.version) || "",
    cli: firstText(nested.cli, src.cli) || "",
    platform: firstText(nested.platform, src.platform) || "",
  };
}

export function nearFloor(value, floor = CACHE_READ_FLOOR, slack = 40) {
  if (value == null) return false;
  const n = Number(value);
  if (!Number.isFinite(n)) return false;
  return Math.abs(n - floor) <= slack || Math.abs(n - CACHE_READ_FLOOR_ALT) <= slack;
}

export function isHighCacheRead(value) {
  if (value == null) return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 500000;
}

export function isPerImageCreation(value) {
  if (value == null) return false;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n <= 12000;
}

export function isFullRewrite(value) {
  if (value == null) return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 500000;
}

export function isOneInOneOutDelta(value) {
  if (value == null) return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= ONE_IN_ONE_OUT_MIN && n <= ONE_IN_ONE_OUT_MAX;
}

export function isLatchedHold(ticket) {
  const row = cloneTicket(ticket);
  const images = row.imageCount ?? 0;
  const evicted = row.evictedCount ?? 0;
  const binEmpty = !row.trimBin.length;
  const stable =
    row.prefixMutated !== true &&
    row.prefixStable !== false &&
    row.earliestDropped !== true &&
    evicted === 0 &&
    binEmpty;
  const cacheHealthy =
    (row.cacheRead == null || isHighCacheRead(row.cacheRead)) &&
    (row.cacheCreation == null || isPerImageCreation(row.cacheCreation));
  const underThreshold = images === 0 || images < PAGE_IMAGE_THRESHOLD;
  const noBurn =
    (row.burnRate == null || row.burnRate < 2) &&
    (row.tokensPerHour == null || row.tokensPerHour < BURN_AFTER * 0.4);
  return stable && cacheHealthy && underThreshold && noBurn && row.breakpointsInvalidated !== true;
}

export function isRecutSignature(ticket) {
  const row = cloneTicket(ticket);
  const images = row.imageCount ?? 0;
  const collapsed = nearFloor(row.cacheRead, row.cacheReadFloor ?? CACHE_READ_FLOOR);
  const rewritten = isFullRewrite(row.cacheCreation);
  const crossed = images >= PAGE_IMAGE_THRESHOLD;
  const mutated = row.prefixMutated === true;
  const spliced = COLLAPSE_AT.includes(Number(row.spliceAt));
  return collapsed || rewritten || (crossed && mutated) || (crossed && row.earliestDropped === true) || spliced;
}

export function analyze(input) {
  const row = cloneTicket(input);
  const text = row.outputText || "";
  const images = row.imageCount ?? 0;
  const evicted = row.evictedCount ?? (row.earliestDropped === true ? Math.max(1, images - PAGE_IMAGE_THRESHOLD + 1) : 0);
  const collapsed = nearFloor(row.cacheRead, row.cacheReadFloor ?? CACHE_READ_FLOOR);
  const rewritten = isFullRewrite(row.cacheCreation);
  const crossed = images >= PAGE_IMAGE_THRESHOLD;
  const mutated = row.prefixMutated === true || /prefix mutated|prefix-rewritten|conversation prefix/i.test(text);
  const dropped = row.earliestDropped === true || evicted > 0 || row.trimBin.length > 0;
  const burned =
    Number(row.burnRate) >= BURN_MULTIPLIER ||
    Number(row.tokensPerHour) >= BURN_AFTER ||
    Number(row.allowanceMinutes) === ALLOWANCE_MINUTES;
  const silent =
    row.contextManagement === null &&
    !row.warning &&
    !row.error;
  const oneOut =
    row.oneInOneOut === true ||
    isOneInOneOutDelta(row.promptTotalDelta);
  const prefixRewritten =
    row.breakpointsInvalidated === true ||
    (mutated && collapsed);
  const latched = isLatchedHold(row);
  const recut = isRecutSignature(row);
  return {
    row,
    latched,
    recut,
    mutated,
    evicted: dropped,
    recached: rewritten,
    burned,
    collapsed,
    silent,
    oneInOneOut: oneOut,
    prefixRewritten,
    featured: row.issue === FEATURED_ISSUE && recut,
    chips: collectChips({
      latched,
      recut,
      mutated,
      evicted: dropped,
      recached: rewritten,
      burned,
      collapsed,
      silent,
      oneInOneOut: oneOut,
      prefixRewritten,
    }),
  };
}

function collectChips(flags) {
  const chips = [];
  if (flags.latched) chips.push("latched");
  if (flags.recut) chips.push("recut");
  if (flags.mutated) chips.push("mutated");
  if (flags.evicted) chips.push("evicted");
  if (flags.recached) chips.push("recached");
  if (flags.burned) chips.push("burned");
  if (flags.collapsed) chips.push("collapsed");
  if (flags.silent) chips.push("silent");
  if (flags.oneInOneOut) chips.push("one-in-one-out");
  if (flags.prefixRewritten) chips.push("prefix-rewritten");
  return [...new Set(chips)];
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const aliasFromIssue = SEED_ALIASES[facts.row.issue];
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.latched && !ALARM_VERDICTS.includes(seed)) return "latched";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (aliasFromIssue === "recut" && facts.recut) return "recut";
  if (facts.featured || facts.recut) return "recut";
  if (facts.oneInOneOut) return "one-in-one-out";
  if (facts.burned) return "burned";
  if (facts.collapsed) return "collapsed";
  if (facts.recached) return "recached";
  if (facts.prefixRewritten) return "prefix-rewritten";
  if (facts.silent && facts.mutated) return "silent";
  if (facts.evicted) return "evicted";
  if (facts.mutated) return "mutated";
  if (facts.latched) return "latched";
  return "latched";
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
    latched: verdict === "latched" || facts.latched,
    recut: verdict === "recut" || facts.recut,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      imageCount: facts.row.imageCount,
      cropImages: facts.row.cropImages,
      fullPagePngs: facts.row.fullPagePngs,
      prefixMutated: facts.row.prefixMutated,
      earliestDropped: facts.row.earliestDropped,
      evictedCount: facts.row.evictedCount,
      cacheRead: facts.row.cacheRead,
      cacheCreation: facts.row.cacheCreation,
      promptTotalDelta: facts.row.promptTotalDelta,
      burnRate: facts.row.burnRate,
      tokensPerHour: facts.row.tokensPerHour,
      contextManagement: facts.row.contextManagement,
      spliceAt: facts.row.spliceAt,
      recut: facts.recut,
      collapsed: facts.collapsed,
      burned: facts.burned,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "latched") {
    return "● Latched · prefix byte-stable, cache_read still amortizing, no eviction splice · hold";
  }
  if (kind === "mutated") {
    return "● Mutated · conversation prefix rewritten; burn numbers not yet on the counter · alarm";
  }
  if (kind === "evicted") {
    return "● Evicted · earliest image-frames in the trim bin · alarm";
  }
  if (kind === "recached") {
    return "● Recached · 600–740k context rewritten as cache-creation · alarm";
  }
  if (kind === "burned") {
    return "● Burned · 5.7× burn; 5-hour allowance gone in 31 minutes · alarm";
  }
  if (kind === "collapsed") {
    return "● Collapsed · cache_read at the system+tools floor (~26314) · alarm";
  }
  if (kind === "silent") {
    return "● Silent · no error, no warning, context_management null · alarm";
  }
  if (kind === "one-in-one-out") {
    return "● One-in-one-out · promptTotal +113–149 after collapse · alarm";
  }
  if (kind === "prefix-rewritten") {
    return "● Prefix-rewritten · cache breakpoints after system/tools invalidated · alarm";
  }
  return "● Recut · earliest images dropped, prefix mutated, full re-cache · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "latched") {
    reasons.push("prefix byte-stable; cache_read still amortizing at the ~658k class");
    reasons.push("hold: this is a latched print, not a recut splice");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90716 Image eviction in long sessions mutates the conversation prefix, forcing a full context re-cache on every subsequent image read",
    );
  }
  if (facts.row.prefixMutated === true) {
    reasons.push("prefix mutated: earliest page images dropped from the conversation sent to the API");
  }
  if (nearFloor(facts.row.cacheRead, facts.row.cacheReadFloor ?? CACHE_READ_FLOOR)) {
    reasons.push(
      `cache_read collapsed to session-constant ${facts.row.cacheRead} (system+tools floor ~${CACHE_READ_FLOOR})`,
    );
  }
  if (isHighCacheRead(facts.row.cacheRead) && isPerImageCreation(facts.row.cacheCreation)) {
    reasons.push(
      `before: image ~${CACHE_CREATION_BEFORE} cache_creation with ~${CACHE_READ_BEFORE} cache_read`,
    );
  }
  if (isFullRewrite(facts.row.cacheCreation)) {
    reasons.push(
      `cache_creation jumped to ${facts.row.cacheCreation} and stays there; 600–740k tokens rewritten as cache-creation`,
    );
  }
  if ((facts.row.imageCount ?? 0) >= PAGE_IMAGE_THRESHOLD) {
    reasons.push(
      `threshold ~${PAGE_IMAGE_THRESHOLD} page-sized images; this reel is at ${facts.row.imageCount} (first collapse at #41, #45, #49)`,
    );
  }
  if (facts.row.earliestDropped === true || (facts.row.evictedCount ?? 0) > 0) {
    reasons.push(
      `earliest images dropped; trim bin holds ${facts.row.evictedCount ?? (facts.row.trimBin.length || "frames")}`,
    );
  }
  if (facts.row.fullPagePngs === FULL_PAGE_COLLAPSED) {
    reasons.push(`${FULL_PAGE_COLLAPSED}/20 full-page PNGs (~3.3k tokens) collapsed; ${facts.row.cropImages ?? CROP_SAFE}/3 crops did not`);
  }
  if (isOneInOneOutDelta(facts.row.promptTotalDelta) || facts.row.oneInOneOut === true) {
    reasons.push(
      `after collapse: one-in-one-out (+${facts.row.promptTotalDelta ?? "113–149"} tokens/turn)`,
    );
  }
  if (facts.row.contextManagement === null && !facts.row.warning && !facts.row.error) {
    reasons.push("no error, no warning, context_management null → client-side");
  }
  if (Number(facts.row.burnRate) >= BURN_MULTIPLIER || Number(facts.row.tokensPerHour) >= BURN_AFTER) {
    reasons.push(
      `same work: 12.1M/hour before vs 68.5M/hour after = ${BURN_MULTIPLIER}×; 5-hour allowance burned in ${ALLOWANCE_MINUTES} minutes`,
    );
  }
  if (Number(facts.row.allowanceMinutes) === ALLOWANCE_MINUTES) {
    reasons.push(`5-hour allowance burned in ${ALLOWANCE_MINUTES} minutes`);
  }
  if (facts.row.breakpointsInvalidated === true) {
    reasons.push("every cache breakpoint after the system/tools block is invalidated");
  }
  if (Number(facts.row.promptTotalDelta) < 0 && Math.abs(facts.row.promptTotalDelta) >= 50000) {
    reasons.push(
      `promptTotal dropped ~54k at first collapse (~16 page images × ${IMAGE_TOKEN_WEIGHT} tokens)`,
    );
  }
  return reasons;
}

function defaultBin() {
  return [
    { filename: "p001.png", tokens: IMAGE_TOKEN_WEIGHT, evictionTurn: 41 },
    { filename: "p002.png", tokens: IMAGE_TOKEN_WEIGHT, evictionTurn: 41 },
    { filename: "p003.png", tokens: IMAGE_TOKEN_WEIGHT, evictionTurn: 41 },
    { filename: "p016.png", tokens: IMAGE_TOKEN_WEIGHT, evictionTurn: 41 },
  ];
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    imageCount: 41,
    cropImages: 0,
    fullPagePngs: 20,
    prefixMutated: true,
    earliestDropped: true,
    evictedCount: 16,
    cacheRead: CACHE_READ_FLOOR,
    cacheCreation: CACHE_CREATION_AFTER,
    cacheReadFloor: CACHE_READ_FLOOR,
    promptTotalDelta: -PROMPT_TOTAL_DROP_A,
    burnRate: BURN_MULTIPLIER,
    tokensPerHour: BURN_AFTER,
    allowanceMinutes: ALLOWANCE_MINUTES,
    contextManagement: null,
    warning: "",
    error: "",
    oneInOneOut: false,
    spliceAt: 41,
    prefixStable: false,
    breakpointsInvalidated: true,
    trimBin: defaultBin(),
    outputText:
      "cache_read=26314 cache_creation=590100 prefix mutated; earliest images dropped; no error, no warning, context_management null",
    version: CLI,
    cli: CLI,
    platform: PLATFORM,
  };
}

export function seedRecut() {
  return {
    ...baseSeed("recut"),
  };
}

export function seedLatched() {
  return {
    ...baseSeed("latched"),
    imageCount: SAFE_SESSION_IMAGES,
    cropImages: 3,
    fullPagePngs: 0,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    promptTotalDelta: 3361,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    contextManagement: null,
    oneInOneOut: false,
    spliceAt: null,
    prefixStable: true,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "prefix byte-stable; cache_read 658681 still amortizing; 24-image session at 688k never triggered",
  };
}

export function seedMutated() {
  return {
    ...baseSeed("mutated"),
    imageCount: 22,
    fullPagePngs: 0,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    promptTotalDelta: -8000,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    oneInOneOut: false,
    spliceAt: null,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "prefix mutated but burn numbers not yet on the counter",
  };
}

export function seedEvicted() {
  return {
    ...baseSeed("evicted"),
    imageCount: 16,
    fullPagePngs: 0,
    prefixMutated: false,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    promptTotalDelta: -PROMPT_TOTAL_DROP_A,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    oneInOneOut: false,
    spliceAt: null,
    breakpointsInvalidated: false,
    outputText: "earliest image-frames pulled into the trim bin; print not yet recut",
  };
}

export function seedRecached() {
  return {
    ...baseSeed("recached"),
    imageCount: 30,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    spliceAt: null,
    oneInOneOut: false,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    trimBin: [],
    outputText: "full context rewritten as cache-creation (600–740k tokens)",
  };
}

export function seedBurned() {
  return {
    ...baseSeed("burned"),
    imageCount: 19,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    spliceAt: null,
    oneInOneOut: false,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "5.7× burn; 5-hour allowance gone in 31 minutes (12.1M/hour → 68.5M/hour)",
  };
}

export function seedCollapsed() {
  return {
    ...baseSeed("collapsed"),
    imageCount: 30,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheCreation: CACHE_CREATION_BEFORE,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    spliceAt: null,
    oneInOneOut: false,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "cache_read at the system+tools floor (~26314); reprint lamp lit",
  };
}

export function seedSilent() {
  return {
    ...baseSeed("silent"),
    imageCount: 22,
    prefixMutated: true,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    spliceAt: null,
    oneInOneOut: false,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "no error, no warning, context_management null → client-side",
  };
}

export function seedOneInOneOut() {
  return {
    ...baseSeed("one-in-one-out"),
    imageCount: 30,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    promptTotalDelta: 113,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    spliceAt: null,
    oneInOneOut: true,
    breakpointsInvalidated: false,
    trimBin: [],
    outputText: "after collapse: one-in-one-out (+113–149 tokens/turn)",
  };
}

export function seedPrefixRewritten() {
  return {
    ...baseSeed("prefix-rewritten"),
    imageCount: 22,
    prefixMutated: false,
    earliestDropped: false,
    evictedCount: 0,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    burnRate: 1,
    tokensPerHour: BURN_BEFORE,
    allowanceMinutes: null,
    spliceAt: null,
    oneInOneOut: false,
    breakpointsInvalidated: true,
    trimBin: [],
    outputText: "cache breakpoints after system/tools invalidated",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    latched: seedLatched,
    recut: seedRecut,
    mutated: seedMutated,
    evicted: seedEvicted,
    recached: seedRecached,
    burned: seedBurned,
    collapsed: seedCollapsed,
    silent: seedSilent,
    "one-in-one-out": seedOneInOneOut,
    "prefix-rewritten": seedPrefixRewritten,
    90716: seedRecut,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedRecut());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.moviola?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket = payload.ticket || payload.moviola || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export function parseUsageJsonl(text) {
  const turns = [];
  for (const line of String(text || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const row = JSON.parse(trimmed);
      const usage = (row.message && row.message.usage) || row.usage || row;
      const cacheRead = firstNum(
        usage.cache_read_input_tokens,
        usage.cacheRead,
        usage.cache_read,
      );
      const cacheCreation = firstNum(
        usage.cache_creation_input_tokens,
        usage.cacheCreation,
        usage.cache_creation,
      );
      const input = firstNum(usage.input_tokens, usage.inputTokens, usage.input);
      if (cacheRead == null && cacheCreation == null) continue;
      const promptTotal = (input || 0) + (cacheRead || 0) + (cacheCreation || 0);
      turns.push({ cacheRead, cacheCreation, input, promptTotal });
    } catch {
      // skip non-JSON lines
    }
  }
  const collapsed = turns.some((turn) => nearFloor(turn.cacheRead));
  const last = turns[turns.length - 1] || {};
  const first = turns[0] || {};
  const promptTotalDelta =
    turns.length >= 2 ? last.promptTotal - turns[turns.length - 2].promptTotal : null;
  return {
    turns,
    collapsed,
    ticket: {
      cacheRead: last.cacheRead ?? null,
      cacheCreation: last.cacheCreation ?? null,
      prefixMutated: collapsed,
      earliestDropped: collapsed,
      promptTotalDelta,
      cacheReadBefore: first.cacheRead ?? null,
      cacheCreationBefore: first.cacheCreation ?? null,
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
        ? "Moviola recut. A recut print is not a hold. #90716 image eviction mutated the conversation prefix; every later impression is a full reprint at cache-creation rates. Score the splice or admit latched."
        : "Moviola latched. Prefix byte-stable; cache_read still amortizing; no eviction splice.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedRecut();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.moviola || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedRecut();
  }
  return seedRecut();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedRecut());
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
