#!/usr/bin/env node
/**
 * Davy — miner's safety-lamp / lamp-station scorer.
 * A false canary is not a hold. Score the gauze or admit lit.
 *
 *   echo '{"autoDisabled":true,"fullscreenWorks":true,"strikes":4}' | node davy.mjs
 *   node davy.mjs ticket.json
 *
 * Idle word is lit.
 * Seeded state is snuffed / #90886.
 * NEVER idle as "davy", "lamp", "canary", "flame", "pit", "gauze",
 * "strike", "fullscreen", "tui".
 *
 * Primary #90886: working fullscreen auto-disabled by a false
 * boot-canary. PID-keyed pending map in the single shared
 * ~/.claude.json banks strikes from a concurrent-session burst
 * (strikes 4 vs sticky threshold 2). The gauze lamp is the canary;
 * the flame is the renderer.
 *
 * LIT if tui=fullscreen, renderer actually fullscreen, strikes 0
 * or honestly earned, no orphaned pending, no auto-disable.
 * SNUFFED if working fullscreen auto-disabled by false boot-canary.
 *
 * NOT Moviola #90716, Carcase #90867, Callboard #90858, Leaven #90782,
 * Hydra #90856, Limpet #89275, Scion #90815, Almanac #90804,
 * Deadband #90789, Carrel #90661, Binnacle #90551, Fetch #90755,
 * Kindling #90798. Same-class cite (not primary): #88977, #78439,
 * #85461, #73719, #90733. Nearby TUI only (do not ship): #88372,
 * #84940, #76022, #85573, #82886, #85712, #78693. Backups (do not
 * ship): Cartouche/Chimera #90881, Gyre #90800. Reject #90889
 * (Limpet clone).
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "lit",
  "snuffed",
  "struck",
  "orphaned",
  "reused",
  "withdrawn",
  "ratcheted",
  "burst",
  "lost-update",
  "classic",
  "pid-keyed",
  "env-on",
]);
export const IDLE_WORD = "lit";
export const SEED_ALIASES = Object.freeze({
  90886: "snuffed",
});
export const HOLD_VERDICTS = Object.freeze(["lit"]);
export const ALARM_VERDICTS = Object.freeze([
  "snuffed",
  "struck",
  "orphaned",
  "reused",
  "withdrawn",
  "ratcheted",
  "burst",
  "lost-update",
  "classic",
  "pid-keyed",
  "env-on",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90886;
export const PRIMARY_ISSUES = Object.freeze([90886]);
export const SAME_CLASS = Object.freeze([
  85583, 90789, 90661, 88977, 78439, 85461, 73719, 90733,
]);
export const NEARBY_BOUNDARY = Object.freeze([
  88372, 84940, 76022, 85573, 82886, 85712, 78693, 90881, 90800,
]);
export const CODEX_SAME = Object.freeze([24224, 37226, 39642, 40109]);
export const CLI = "2.1.251";
export const CANARY_SINCE = "2.1.236";
export const PLATFORM = "macos";
export const DARWIN = "25.6.0";
export const ARCH = "arm64";
export const FILED_AT = "2026-08-31T03:26:28Z";
export const REPORTER = "evertjr";
export const TITLE =
  "Fullscreen renderer auto-disables itself on machines running many concurrent sessions (false boot-canary strikes)";
export const ISSUE_URL = "https://github.com/anthropics/claude-code/issues/90886";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:tui",
]);
export const STRIKES_BANKED = 4;
export const STRIKE_THRESHOLD = 2;
export const CONCURRENT_REPRO = 15;
export const CONCURRENT_MIN = 10;
export const CONCURRENT_MAX = 20;
export const SETTLE_SECONDS = 10;
export const AUTO_DISABLED_AT = 1788146545484;
export const PHRASE = "A false canary is not a hold. Score the gauze or admit lit.";
export const MARK = "13:50 / hermes catalog #87 / #90886";

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
  return seedSnuffed();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.davy && typeof src.davy === "object" && src.davy) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.lamp && typeof src.lamp === "object" && src.lamp) ||
    src;
  const pending = nested.fullscreenBootPending || src.fullscreenBootPending || nested.pending;
  const auto =
    nested.fullscreenAutoDisabled || src.fullscreenAutoDisabled || nested.auto || {};
  return {
    issue: firstNum(nested.issue, src.issue, nested.seed, src.seed) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    concurrentSessions: firstNum(
      nested.concurrentSessions,
      nested.concurrent_sessions,
      nested.sessions,
      src.concurrentSessions,
    ),
    strikes: firstNum(
      nested.strikes,
      auto.strikes,
      nested.fullscreenBootStrikes,
      nested.fullscreen_boot_strikes,
      src.strikes,
    ),
    strikeThreshold: firstNum(
      nested.strikeThreshold,
      nested.strike_threshold,
      nested.stickyThreshold,
      src.strikeThreshold,
    ) ?? STRIKE_THRESHOLD,
    autoDisabled: firstBool(
      nested.autoDisabled,
      nested.auto_disabled,
      nested.fullscreenAutoDisabled === true ? true : undefined,
      src.autoDisabled,
    ),
    pendingOrphans: firstNum(
      nested.pendingOrphans,
      nested.pending_orphans,
      nested.orphanedPending,
      src.pendingOrphans,
    ),
    pendingPids: firstArr(nested.pendingPids, nested.pending_pids, src.pendingPids),
    pidReuseStrike: firstBool(
      nested.pidReuseStrike,
      nested.pid_reuse_strike,
      nested.ownPidStrike,
      src.pidReuseStrike,
    ),
    ownPid: firstNum(nested.ownPid, nested.own_pid, src.ownPid),
    startedAtChecked: firstBool(
      nested.startedAtChecked,
      nested.started_at_checked,
      src.startedAtChecked,
    ),
    withdrawnPreserve: firstBool(
      nested.withdrawnPreserve,
      nested.withdrawn_preserve,
      nested.withdrawn,
      src.withdrawnPreserve,
    ),
    lostUpdate: firstBool(nested.lostUpdate, nested.lost_update, src.lostUpdate),
    fullscreenWorks: firstBool(
      nested.fullscreenWorks,
      nested.fullscreen_works,
      nested.rendererWorks,
      src.fullscreenWorks,
    ),
    tuiSetting: firstText(nested.tuiSetting, nested.tui_setting, nested.tui, src.tuiSetting),
    envNoFlicker: firstBool(
      nested.envNoFlicker,
      nested.env_no_flicker,
      nested.envOn,
      src.envNoFlicker,
    ),
    classicFallback: firstBool(
      nested.classicFallback,
      nested.classic_fallback,
      src.classicFallback,
    ),
    renderer: firstText(nested.renderer, src.renderer),
    version: firstText(nested.version, auto.version, src.version) || "",
    cli: firstText(nested.cli, src.cli) || "",
    platform: firstText(nested.platform, src.platform) || "",
    terminateRatherThanQuit: firstBool(
      nested.terminateRatherThanQuit,
      nested.terminate_rather_than_quit,
      nested.ratchetOnly,
      src.terminateRatherThanQuit,
    ),
    pidKeyed: firstBool(nested.pidKeyed, nested.pid_keyed, src.pidKeyed),
    settleSeconds: firstNum(nested.settleSeconds, nested.settle_seconds, src.settleSeconds),
    autoDisabledAt: firstNum(
      nested.autoDisabledAt,
      nested.auto_disabled_at,
      auto.at,
      src.autoDisabledAt,
    ),
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text, src.outputText),
    pending: pending && typeof pending === "object" && !Array.isArray(pending) ? pending : null,
  };
}

function orphanCount(row) {
  if (row.pendingOrphans != null) return Number(row.pendingOrphans) || 0;
  if (row.pendingPids.length) return row.pendingPids.length;
  if (row.pending && typeof row.pending === "object") return Object.keys(row.pending).length;
  return 0;
}

export function isLitHold(ticket) {
  const row = cloneTicket(ticket);
  const tui = String(row.tuiSetting || "fullscreen").toLowerCase();
  const fullscreenTui = tui === "fullscreen";
  const rendererOk =
    row.fullscreenWorks !== false &&
    row.classicFallback !== true &&
    String(row.renderer || "fullscreen").toLowerCase() !== "classic";
  const noDisable = row.autoDisabled !== true;
  const threshold = row.strikeThreshold ?? STRIKE_THRESHOLD;
  const strikes = row.strikes ?? 0;
  const strikesOk = strikes === 0 || (strikes < threshold && !row.lostUpdate && !row.pidReuseStrike);
  const noOrphans = orphanCount(row) === 0;
  const noEnv = row.envNoFlicker !== true;
  return fullscreenTui && rendererOk && noDisable && strikesOk && noOrphans && noEnv;
}

export function isSnuffedSignature(ticket) {
  const row = cloneTicket(ticket);
  const threshold = row.strikeThreshold ?? STRIKE_THRESHOLD;
  const strikes = row.strikes ?? 0;
  return row.autoDisabled === true && row.fullscreenWorks === true && strikes >= threshold;
}

export function isEnvOn(ticket) {
  return cloneTicket(ticket).envNoFlicker === true;
}

export function analyze(input) {
  const row = cloneTicket(input);
  const text = row.outputText || "";
  const threshold = row.strikeThreshold ?? STRIKE_THRESHOLD;
  const strikes = row.strikes ?? 0;
  const orphans = orphanCount(row);
  const envOn = isEnvOn(row);
  const snuffed = isSnuffedSignature(row);
  const struck = strikes >= threshold || (strikes === STRIKES_BANKED && threshold === STRIKE_THRESHOLD);
  const orphaned =
    orphans > 0 ||
    (/leftover fullscreenBootPending/i.test(text) && !/\bno orphan/i.test(text));
  const reused =
    row.pidReuseStrike === true ||
    (row.ownPid != null &&
      (row.pendingPids.includes(row.ownPid) || (row.pending && String(row.ownPid) in row.pending)) &&
      row.startedAtChecked !== true);
  const withdrawn = row.withdrawnPreserve === true || /withdrawn/i.test(text);
  const ratcheted =
    row.terminateRatherThanQuit === true || /ratchet|terminate rather than quit/i.test(text);
  const sessions = row.concurrentSessions ?? 0;
  const burst =
    (sessions >= CONCURRENT_MIN && sessions <= CONCURRENT_MAX) ||
    /burst|10–20|10-20 concurrent/i.test(text);
  const lost = row.lostUpdate === true || /lost[- ]update|read-modify-write|RMW/i.test(text);
  const classic =
    row.classicFallback === true ||
    String(row.renderer || "").toLowerCase() === "classic" ||
    /classic renderer/i.test(text);
  const pidKeyed =
    row.pidKeyed === true ||
    (row.pending && typeof row.pending === "object") ||
    /pid-keyed|keyed by PID/i.test(text);
  const lit = isLitHold(row);
  return {
    row,
    lit,
    snuffed,
    struck,
    orphaned,
    reused,
    withdrawn,
    ratcheted,
    burst,
    lostUpdate: lost,
    classic,
    pidKeyed,
    envOn,
    featured: row.issue === FEATURED_ISSUE && snuffed,
    chips: collectChips({
      lit,
      snuffed,
      struck,
      orphaned,
      reused,
      withdrawn,
      ratcheted,
      burst,
      lostUpdate: lost,
      classic,
      pidKeyed,
      envOn,
    }),
  };
}

function collectChips(flags) {
  const chips = [];
  if (flags.lit) chips.push("lit");
  if (flags.snuffed) chips.push("snuffed");
  if (flags.struck) chips.push("struck");
  if (flags.orphaned) chips.push("orphaned");
  if (flags.reused) chips.push("reused");
  if (flags.withdrawn) chips.push("withdrawn");
  if (flags.ratcheted) chips.push("ratcheted");
  if (flags.burst) chips.push("burst");
  if (flags.lostUpdate) chips.push("lost-update");
  if (flags.classic) chips.push("classic");
  if (flags.pidKeyed) chips.push("pid-keyed");
  if (flags.envOn) chips.push("env-on");
  return [...new Set(chips)];
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const aliasFromIssue = SEED_ALIASES[facts.row.issue];
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.envOn && !ALARM_VERDICTS.includes(seed) && seed !== "lit") return "env-on";
  if (facts.lit && !ALARM_VERDICTS.includes(seed)) return "lit";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.envOn) return "env-on";
  if (aliasFromIssue === "snuffed" && facts.snuffed) return "snuffed";
  if (facts.featured || facts.snuffed) return "snuffed";
  if (facts.reused) return "reused";
  if (facts.orphaned) return "orphaned";
  if (facts.withdrawn) return "withdrawn";
  if (facts.ratcheted) return "ratcheted";
  if (facts.lostUpdate) return "lost-update";
  if (facts.burst) return "burst";
  if (facts.classic) return "classic";
  if (facts.pidKeyed) return "pid-keyed";
  if (facts.struck) return "struck";
  if (facts.lit) return "lit";
  return "lit";
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
    lit: verdict === "lit" || facts.lit,
    snuffed: verdict === "snuffed" || facts.snuffed,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      concurrentSessions: facts.row.concurrentSessions,
      strikes: facts.row.strikes,
      strikeThreshold: facts.row.strikeThreshold,
      autoDisabled: facts.row.autoDisabled,
      pendingOrphans: orphanCount(facts.row),
      pidReuseStrike: facts.row.pidReuseStrike,
      withdrawnPreserve: facts.row.withdrawnPreserve,
      lostUpdate: facts.row.lostUpdate,
      fullscreenWorks: facts.row.fullscreenWorks,
      tuiSetting: facts.row.tuiSetting,
      envNoFlicker: facts.row.envNoFlicker,
      classicFallback: facts.row.classicFallback,
      version: facts.row.version,
      snuffed: facts.snuffed,
      struck: facts.struck,
      orphaned: facts.orphaned,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "lit") {
    return "● Lit · tui=fullscreen, renderer actually fullscreen, strikes 0 or honest, no orphaned pending, no auto-disable · hold";
  }
  if (kind === "struck") {
    return "● Struck · fullscreenAutoDisabled.strikes banked (4 vs sticky threshold 2) · alarm";
  }
  if (kind === "orphaned") {
    return "● Orphaned · leftover fullscreenBootPending entries for PIDs that are gone · alarm";
  }
  if (kind === "reused") {
    return "● Reused · pid === ownPid counted as a strike without startedAt vs process start · alarm";
  }
  if (kind === "withdrawn") {
    return "● Withdrawn · signal-driven exit settles withdrawn, removes own PID, preserves strike counter · alarm";
  }
  if (kind === "ratcheted") {
    return "● Ratcheted · machines that terminate rather than quit; counter only goes up · alarm";
  }
  if (kind === "burst") {
    return "● Burst · 10–20 concurrent sessions launched together; lost read-modify-write · alarm";
  }
  if (kind === "lost-update") {
    return "● Lost-update · concurrent RMW against one ~/.claude.json · alarm";
  }
  if (kind === "classic") {
    return "● Classic · fell back to classic renderer despite fullscreen working · alarm";
  }
  if (kind === "pid-keyed") {
    return "● Pid-keyed · pending map keyed by PID in the single shared ~/.claude.json · alarm";
  }
  if (kind === "env-on") {
    return "● Env-on · CLAUDE_CODE_NO_FLICKER=1 / env_on path excluded from canary · workaround";
  }
  return "● Snuffed · working fullscreen auto-disabled by false boot-canary · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "lit") {
    reasons.push("tui=fullscreen; renderer actually fullscreen; strikes 0 or honestly earned; no orphaned pending; no auto-disable");
    reasons.push("hold: this is a lit gauze, not a false canary");
  }
  if (!HOLD_VERDICTS.includes(kind) && kind !== "env-on") {
    reasons.push(
      "#90886 Fullscreen renderer auto-disables itself on machines running many concurrent sessions (false boot-canary strikes)",
    );
  }
  if (kind === "env-on") {
    reasons.push("CLAUDE_CODE_NO_FLICKER=1 → entry path env_on, excluded from the set that arms the canary");
    reasons.push("nothing is written and nothing can be orphaned; fullscreen stays on");
  }
  if (facts.row.autoDisabled === true && facts.row.fullscreenWorks === true) {
    reasons.push("working fullscreen auto-disabled; the renderer itself was not failing");
  }
  if ((facts.row.strikes ?? 0) >= STRIKE_THRESHOLD) {
    reasons.push(
      `fullscreenAutoDisabled.strikes ${facts.row.strikes} vs sticky threshold ${facts.row.strikeThreshold ?? STRIKE_THRESHOLD}`,
    );
  }
  if (facts.row.strikes === STRIKES_BANKED) {
    reasons.push(
      "landing on 4 means several strikes were banked from a single scan (orphaned fullscreenBootPending), not four failed launches",
    );
  }
  if (orphanCount(facts.row) > 0) {
    reasons.push("leftover fullscreenBootPending entries for PIDs that are gone");
  }
  if (facts.row.pidReuseStrike === true) {
    reasons.push("pid === ownPid counted as a strike without startedAt vs process start");
  }
  if (facts.row.withdrawnPreserve === true) {
    reasons.push("signal-driven exit settles withdrawn: removes own PID, preserves strike counter");
  }
  if (facts.row.terminateRatherThanQuit === true) {
    reasons.push("machines that terminate rather than quit interactively only ratchet the counter up");
  }
  if ((facts.row.concurrentSessions ?? 0) >= CONCURRENT_MIN) {
    reasons.push(
      `${facts.row.concurrentSessions} concurrent sessions (repro ~${CONCURRENT_REPRO}; user runs ${CONCURRENT_MIN}–${CONCURRENT_MAX}) burst-launched and torn down together`,
    );
  }
  if (facts.row.lostUpdate === true) {
    reasons.push("burst start+settle = read-modify-write races against one ~/.claude.json; lost updates leave dead-PID entries");
  }
  if (facts.row.classicFallback === true) {
    reasons.push("fell back to classic renderer despite fullscreen working");
  }
  if (facts.row.pidKeyed === true || facts.row.pending) {
    reasons.push("pending map keyed by PID in the single shared ~/.claude.json");
  }
  if (facts.row.settleSeconds === SETTLE_SECONDS) {
    reasons.push(`every concurrent session adds an entry at startup and removes it ~${SETTLE_SECONDS}s later`);
  }
  if (facts.row.version === CLI || facts.row.cli === CLI) {
    reasons.push(`Claude Code ${CLI} native install; canary landed in ${CANARY_SINCE}`);
  }
  return reasons;
}

function defaultPending() {
  return {
    18421: { startedAt: 1788146530000 },
    18488: { startedAt: 1788146530400 },
    18550: { startedAt: 1788146530800 },
  };
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    concurrentSessions: CONCURRENT_REPRO,
    strikes: STRIKES_BANKED,
    strikeThreshold: STRIKE_THRESHOLD,
    autoDisabled: true,
    pendingOrphans: 3,
    pendingPids: [18421, 18488, 18550],
    pidReuseStrike: false,
    ownPid: 19002,
    startedAtChecked: false,
    withdrawnPreserve: false,
    lostUpdate: true,
    fullscreenWorks: true,
    tuiSetting: "fullscreen",
    envNoFlicker: false,
    classicFallback: true,
    renderer: "classic",
    version: CLI,
    cli: CLI,
    platform: PLATFORM,
    terminateRatherThanQuit: true,
    pidKeyed: true,
    settleSeconds: SETTLE_SECONDS,
    autoDisabledAt: AUTO_DISABLED_AT,
    pending: defaultPending(),
    outputText:
      "Claude Code's fullscreen renderer has repeatedly failed to start on this machine, so it has been turned off here. fullscreenAutoDisabled strikes 4 vs threshold 2. Fullscreen itself works.",
  };
}

export function seedSnuffed() {
  return {
    ...baseSeed("snuffed"),
  };
}

export function seedLit() {
  return {
    ...baseSeed("lit"),
    concurrentSessions: 1,
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    pidReuseStrike: false,
    withdrawnPreserve: false,
    lostUpdate: false,
    fullscreenWorks: true,
    tuiSetting: "fullscreen",
    envNoFlicker: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pidKeyed: false,
    autoDisabledAt: null,
    pending: null,
    outputText: "tui=fullscreen; renderer actually fullscreen; strikes 0; no orphaned pending; no auto-disable",
  };
}

export function seedStruck() {
  return {
    ...baseSeed("struck"),
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pending: null,
    outputText: "fullscreenAutoDisabled.strikes banked at 4 vs sticky threshold 2",
  };
}

export function seedOrphaned() {
  return {
    ...baseSeed("orphaned"),
    strikes: 0,
    autoDisabled: false,
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    outputText: "leftover fullscreenBootPending entries for PIDs that are gone",
  };
}

export function seedReused() {
  return {
    ...baseSeed("reused"),
    strikes: 1,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [19002],
    pidReuseStrike: true,
    ownPid: 19002,
    startedAtChecked: false,
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pending: { 19002: { startedAt: null } },
    outputText: "pid === ownPid counted as a strike without startedAt vs process start",
  };
}

export function seedWithdrawn() {
  return {
    ...baseSeed("withdrawn"),
    strikes: 2,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    withdrawnPreserve: true,
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pending: null,
    outputText: "signal-driven exit settles withdrawn, removes own PID, preserves strike counter",
  };
}

export function seedRatcheted() {
  return {
    ...baseSeed("ratcheted"),
    strikes: 3,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: true,
    pending: null,
    outputText: "on machines that terminate rather than quit, counter only goes up",
  };
}

export function seedBurst() {
  return {
    ...baseSeed("burst"),
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pending: null,
    outputText: "10–20 concurrent sessions launched together; lost read-modify-write",
  };
}

export function seedLostUpdate() {
  return {
    ...baseSeed("lost-update"),
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: true,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pending: null,
    outputText: "concurrent RMW against one ~/.claude.json",
  };
}

export function seedClassic() {
  return {
    ...baseSeed("classic"),
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    classicFallback: true,
    renderer: "classic",
    terminateRatherThanQuit: false,
    pending: null,
    outputText: "fell back to classic renderer despite fullscreen working",
  };
}

export function seedPidKeyed() {
  return {
    ...baseSeed("pid-keyed"),
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pidKeyed: true,
    pending: { 18421: { startedAt: 1788146530000 } },
    outputText: "pending map keyed by PID in the single shared ~/.claude.json",
  };
}

export function seedEnvOn() {
  return {
    ...baseSeed("env-on"),
    concurrentSessions: CONCURRENT_REPRO,
    strikes: 0,
    autoDisabled: false,
    pendingOrphans: 0,
    pendingPids: [],
    lostUpdate: false,
    fullscreenWorks: true,
    tuiSetting: "fullscreen",
    envNoFlicker: true,
    classicFallback: false,
    renderer: "fullscreen",
    terminateRatherThanQuit: false,
    pidKeyed: false,
    pending: null,
    outputText: "CLAUDE_CODE_NO_FLICKER=1 → entry path env_on, excluded from the set that arms the canary",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    lit: seedLit,
    snuffed: seedSnuffed,
    struck: seedStruck,
    orphaned: seedOrphaned,
    reused: seedReused,
    withdrawn: seedWithdrawn,
    ratcheted: seedRatcheted,
    burst: seedBurst,
    "lost-update": seedLostUpdate,
    classic: seedClassic,
    "pid-keyed": seedPidKeyed,
    "env-on": seedEnvOn,
    90886: seedSnuffed,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedSnuffed());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.davy?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket = payload.ticket || payload.davy || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export function parseClaudeJson(text) {
  const raw = String(text || "").trim();
  if (!raw) return { ticket: seedSnuffed(), pending: {}, auto: null };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ticket: seedSnuffed(), pending: {}, auto: null, error: "unparsed" };
  }
  const auto =
    parsed.fullscreenAutoDisabled ||
    parsed.fullscreen_auto_disabled ||
    null;
  const pending =
    parsed.fullscreenBootPending ||
    parsed.fullscreen_boot_pending ||
    parsed.pending ||
    {};
  const pids = Object.keys(pending || {});
  const strikes = firstNum(auto && auto.strikes, parsed.fullscreenBootStrikes, parsed.strikes);
  const ticket = {
    strikes,
    strikeThreshold: STRIKE_THRESHOLD,
    autoDisabled: Boolean(auto) || (strikes != null && strikes >= STRIKE_THRESHOLD),
    pendingOrphans: pids.length,
    pendingPids: pids.map((pid) => Number(pid)).filter(Number.isFinite),
    pending,
    pidKeyed: pids.length > 0 || parsed.pidKeyed === true,
    version: firstText(auto && auto.version, parsed.version),
    autoDisabledAt: firstNum(auto && auto.at),
    lostUpdate: pids.length > 0,
    fullscreenWorks: parsed.fullscreenWorks !== false,
    tuiSetting: firstText(parsed.tui, parsed.tuiSetting) || "fullscreen",
    classicFallback: Boolean(auto) || (strikes != null && strikes >= STRIKE_THRESHOLD),
    envNoFlicker: parsed.envNoFlicker === true || parsed.CLAUDE_CODE_NO_FLICKER === "1",
    outputText: `parsed ~/.claude.json canary: strikes=${strikes} pending=${pids.length}`,
  };
  return { ticket, pending, auto, pids };
}

export function simulateBurst(count = CONCURRENT_REPRO) {
  const n = Math.max(CONCURRENT_MIN, Math.min(CONCURRENT_MAX, Number(count) || CONCURRENT_REPRO));
  const writers = [];
  const pending = {};
  for (let i = 0; i < n; i += 1) {
    const pid = 18000 + i * 17;
    writers.push({ pid, write: i, keep: i % 5 !== 0 });
    if (i % 5 !== 0) pending[pid] = { startedAt: AUTO_DISABLED_AT - 12000 + i * 40 };
  }
  const lost = Object.keys(pending).length < n;
  return {
    sessions: n,
    pending,
    leftover: Object.keys(pending).length,
    lostUpdate: lost,
    ticket: {
      concurrentSessions: n,
      pendingOrphans: Object.keys(pending).length,
      pendingPids: Object.keys(pending).map(Number),
      pending,
      lostUpdate: lost,
      pidKeyed: true,
      settleSeconds: SETTLE_SECONDS,
      fullscreenWorks: true,
      tuiSetting: "fullscreen",
      outputText: `burst ${n}: lost read-modify-write left ${Object.keys(pending).length} PID entries`,
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
        ? "Davy snuffed. A false canary is not a hold. #90886 working fullscreen auto-disabled by false boot-canary; PID-keyed pending map in ~/.claude.json banked strikes from a concurrent-session burst. Score the gauze or admit lit."
        : "Davy lit. tui=fullscreen; renderer actually fullscreen; strikes 0 or honest; no orphaned pending; no auto-disable.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedSnuffed();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.davy || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedSnuffed();
  }
  return seedSnuffed();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedSnuffed());
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
