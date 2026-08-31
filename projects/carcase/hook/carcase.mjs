#!/usr/bin/env node
/**
 * Carcase — cabinetmaker's carcase / joinery bench scorer.
 * A gutted carcase is not a hold. Score the drawers or admit fitted.
 *
 *   echo '{"stealthRelaunch":true,"processesRestarted":false}' | node carcase.mjs
 *   node carcase.mjs ticket.json
 *
 * Idle word is fitted.
 * Seeded state is gutted / #90867.
 * NEVER idle as "carcase" / "cabinet" / "drawer" / "update" / "window".
 *
 * Primary #90867: Desktop update restart kills running
 * Claude Code sessions. The stealth relaunch restores
 * the window and navigation history, but not the CLI
 * child processes that onQuitCleanup: local-session-stop-all
 * killed. Cards look healthy. Send fails computer_unreachable.
 *
 * FITTED if the restored carcase still has drawers in
 * (processesRestarted true / sessions actually resume).
 * GUTTED if stealth relaunch restored chrome, processes gone.
 *
 * NOT Kindling (#90798 WarmLifecycle mints unused).
 * NOT Scion (#90815 empty graft at fork).
 * NOT Cenotaph (#90771 vacant monument).
 * NOT Limpet (processes linger — opposite).
 * NOT Callboard / Leaven / Hydra / Manikin.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "fitted",
  "gutted",
  "hollow",
  "stealth-killed",
  "chrome-only",
  "unconsented",
  "emptied",
  "dummy",
  "occupied",
  "restored-nav",
]);
export const IDLE_WORD = "fitted";
export const SEED_ALIASES = Object.freeze({
  90867: "gutted",
});
export const HOLD_VERDICTS = Object.freeze(["fitted", "occupied"]);
export const ALARM_VERDICTS = Object.freeze([
  "gutted",
  "hollow",
  "stealth-killed",
  "chrome-only",
  "unconsented",
  "emptied",
  "dummy",
  "restored-nav",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90867;
export const PRIMARY_ISSUES = Object.freeze([90867]);
export const SAME_CLASS = Object.freeze([90874, 40969]);
export const NEARBY_BOUNDARY = Object.freeze([
  90868, 90869, 90870, 90871, 90872, 90873, 86556, 90864, 77871, 41039,
]);
export const UMBRELLA = 90172;
export const VERSION = "1.37937.3";
export const CLI = "2.1.246";
export const PLATFORM = "windows";
export const OS = "Windows 11 Pro 10.0.26200 x64";
export const FILED_AT = "2026-08-31T01:47:30Z";
export const TITLE =
  "Desktop update restart kills running Claude Code sessions: the stealth relaunch restores the window but not the sessions";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:desktop",
]);
export const NAV_ENTRIES = 50;
export const SESSIONS_KILLED = 9;
export const QUIT_LOG =
  "2026-08-26 20:03:54 [info] beforeQuit: handler fired, going down";
export const STOP_ALL_LOG =
  "2026-08-26 20:03:54 [info] Running onQuitCleanup: local-session-stop-all";
export const PTY_LOG =
  "2026-08-26 20:03:55 [warn] [pty-host] worker exited (0) with 9 live PTY(s); refork on demand";
export const START_LOG = "2026-08-26 20:04:36 [info] Starting app { appVersion: '1.37937.3' }";
export const NAV_MARKER_LOG =
  "2026-08-26 20:04:36 [info] [update-restart] Detected nav-restore marker, launching normally";
export const STEALTH_LOG =
  "2026-08-26 20:04:36 [info] [stealth-relaunch] Restoring navigation (50 entries, active=49, dropped=0)";
export const BANNER =
  "Can't reach your computer / It may be asleep or offline. Remote Control host unreachable (computer_unreachable)";
export const SECOND_USER =
  "It's showing “Can't reach your computer” error while it's ALREADY RUNNING IN my computer.";
export const CODEX_DRAIN =
  "openai/codex#40969 auto-update force-kills active turns after a 60s drain budget, and cannot be disabled";

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

export function emptyTicket() {
  return seedGutted();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.carcase && typeof src.carcase === "object" && src.carcase) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.hide && typeof src.hide === "object" && src.hide) ||
    src;
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    stealthRelaunch: firstBool(
      nested.stealthRelaunch,
      nested.stealth_relaunch,
      nested.stealth,
    ),
    navRestored: firstBool(nested.navRestored, nested.nav_restored, nested.navRestore),
    navEntryCount: firstNum(nested.navEntryCount, nested.nav_entry_count, nested.navEntries),
    sessionsKilled: firstNum(nested.sessionsKilled, nested.sessions_killed, nested.killed),
    processesRestarted: firstBool(
      nested.processesRestarted,
      nested.processes_restarted,
      nested.sessionsResume,
      nested.sessionsResumed,
    ),
    cardsHealthy: firstBool(nested.cardsHealthy, nested.cards_healthy, nested.cardsLookLive),
    bannerUnreachable: firstBool(
      nested.bannerUnreachable,
      nested.banner_unreachable,
      nested.computerUnreachable,
    ),
    machineAwake: firstBool(nested.machineAwake, nested.machine_awake, nested.hostAwake),
    transcriptPresent: firstBool(
      nested.transcriptPresent,
      nested.transcript_present,
      nested.hasTranscript,
    ),
    beforeFirstTurn: firstBool(
      nested.beforeFirstTurn,
      nested.before_first_turn,
      nested.noFirstTurn,
    ),
    userConsented: firstBool(nested.userConsented, nested.user_consented, nested.consent),
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text),
    version: firstText(nested.version, src.version) || "",
    cli: firstText(nested.cli, src.cli) || "",
    platform: firstText(nested.platform, src.platform) || "",
    os: firstText(nested.os, src.os) || "",
  };
}

export function looksStealthKill(text) {
  const raw = String(text || "");
  return /stealth-relaunch|local-session-stop-all|update-restart/i.test(raw);
}

export function looksUnreachable(text) {
  const raw = String(text || "");
  return /computer_unreachable|Can't reach your computer|host unreachable/i.test(raw);
}

export function looksProcessGone(text) {
  const raw = String(text || "");
  return /local-session-stop-all|pty-host|worker exited.*live PTY/i.test(raw);
}

export function isFittedHold(ticket) {
  const row = cloneTicket(ticket);
  return row.processesRestarted === true;
}

export function isGuttedSignature(ticket) {
  const row = cloneTicket(ticket);
  return (
    row.stealthRelaunch === true &&
    row.cardsHealthy === true &&
    row.processesRestarted === false
  );
}

export function analyze(input) {
  const row = cloneTicket(input);
  const text = row.outputText || "";
  const processesGone = row.processesRestarted === false;
  const processesLive = row.processesRestarted === true;
  const stealth = row.stealthRelaunch === true || looksStealthKill(text);
  const cardsOk = row.cardsHealthy === true;
  const navOk = row.navRestored === true;
  const navCount = row.navEntryCount;
  const killed = row.sessionsKilled;
  const fitted = processesLive;
  const occupied = processesLive;
  const gutted = stealth && cardsOk && processesGone;
  const hollow = (navOk || stealth || cardsOk) && processesGone;
  const stealthKilled = stealth && processesGone;
  const chromeOnly =
    processesGone &&
    (navOk || (Number(navCount) >= NAV_ENTRIES) || /50 entries/i.test(text));
  const unconsented = row.userConsented === false && stealth;
  const emptied = Number(killed) >= SESSIONS_KILLED;
  const dummy =
    (row.bannerUnreachable === true || looksUnreachable(text)) &&
    (row.machineAwake === true || cardsOk);
  const restoredNav = navOk && processesGone;
  return {
    row,
    fitted,
    occupied,
    gutted,
    hollow,
    stealthKilled,
    chromeOnly,
    unconsented,
    emptied,
    dummy,
    restoredNav,
    processesGone,
    featured: row.issue === FEATURED_ISSUE && isGuttedSignature(row),
    chips: collectChips({
      fitted,
      occupied,
      gutted,
      hollow,
      stealthKilled,
      chromeOnly,
      unconsented,
      emptied,
      dummy,
      restoredNav,
    }),
  };
}

function collectChips(flags) {
  const chips = [];
  if (flags.fitted) chips.push("fitted");
  if (flags.gutted) chips.push("gutted");
  if (flags.hollow) chips.push("hollow");
  if (flags.stealthKilled) chips.push("stealth-killed");
  if (flags.chromeOnly) chips.push("chrome-only");
  if (flags.unconsented) chips.push("unconsented");
  if (flags.emptied) chips.push("emptied");
  if (flags.dummy) chips.push("dummy");
  if (flags.occupied) chips.push("occupied");
  if (flags.restoredNav) chips.push("restored-nav");
  return [...new Set(chips)];
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (seed === "occupied" && facts.occupied) return "occupied";
  if (facts.fitted && !ALARM_VERDICTS.includes(seed)) return "fitted";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.featured) return "gutted";
  if (facts.gutted) return "gutted";
  if (facts.unconsented && seed === "unconsented") return "unconsented";
  if (facts.emptied && seed === "emptied") return "emptied";
  if (facts.dummy && seed === "dummy") return "dummy";
  if (facts.chromeOnly && seed === "chrome-only") return "chrome-only";
  if (facts.restoredNav && seed === "restored-nav") return "restored-nav";
  if (facts.stealthKilled) return "stealth-killed";
  if (facts.hollow) return "hollow";
  if (facts.fitted) return "fitted";
  return "gutted";
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
    inhabited: false,
    fitted: verdict === "fitted" || facts.fitted,
    occupied: verdict === "occupied" || facts.occupied,
    gutted: verdict === "gutted" || facts.gutted,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      stealthRelaunch: facts.row.stealthRelaunch,
      navRestored: facts.row.navRestored,
      navEntryCount: facts.row.navEntryCount,
      sessionsKilled: facts.row.sessionsKilled,
      processesRestarted: facts.row.processesRestarted,
      cardsHealthy: facts.row.cardsHealthy,
      bannerUnreachable: facts.row.bannerUnreachable,
      machineAwake: facts.row.machineAwake,
      transcriptPresent: facts.row.transcriptPresent,
      beforeFirstTurn: facts.row.beforeFirstTurn,
      userConsented: facts.row.userConsented,
      gutted: facts.gutted,
      hollow: facts.hollow,
      dummy: facts.dummy,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "fitted") {
    return "● Fitted · drawers in, CLI children still running, sessions actually resume · hold";
  }
  if (kind === "occupied") {
    return "● Occupied · tally of live local processes behind the cards · hold";
  }
  if (kind === "hollow") {
    return "● Hollow · box present, interiors empty · alarm";
  }
  if (kind === "stealth-killed") {
    return "● Stealth-killed · [stealth-relaunch] / local-session-stop-all killed live PTYs · alarm";
  }
  if (kind === "chrome-only") {
    return "● Chrome-only · window + 50 nav entries restored, zero sessions restarted · alarm";
  }
  if (kind === "unconsented") {
    return "● Unconsented · restart without user action (#90870 nearby) · alarm";
  }
  if (kind === "emptied") {
    return "● Emptied · nine sessions killed in one second · alarm";
  }
  if (kind === "dummy") {
    return "● Dummy · cards look healthy, send fails computer_unreachable · alarm";
  }
  if (kind === "restored-nav") {
    return "● Restored-nav · nav-restore marker, 50 entries, 0 sessions · alarm";
  }
  return "● Gutted · stealth relaunch restored chrome, processes gone · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "fitted" || kind === "occupied") {
    reasons.push("drawers in: CLI children still running / sessions actually resume");
    reasons.push("hold: this is a fitted carcase, not a gutted box");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90867 Desktop update restart kills running Claude Code sessions: the stealth relaunch restores the window but not the sessions",
    );
  }
  if (facts.row.stealthRelaunch === true) {
    reasons.push("[stealth-relaunch] restored navigation; quit logged beforeQuit then local-session-stop-all");
  }
  if (facts.row.navRestored === true) {
    reasons.push(
      `[update-restart] Detected nav-restore marker; [stealth-relaunch] Restoring navigation (${facts.row.navEntryCount ?? NAV_ENTRIES} entries)`,
    );
  }
  if (facts.row.processesRestarted === false) {
    reasons.push("CLI child processes were not restarted; PTY worker exited with live PTYs");
  }
  if (facts.row.processesRestarted === true) {
    reasons.push("processesRestarted: CLI children still live behind the cards");
  }
  if (facts.row.cardsHealthy === true && facts.row.processesRestarted === false) {
    reasons.push("sidebar session cards survive on the server and look present and healthy");
  }
  if (Number(facts.row.sessionsKilled) >= SESSIONS_KILLED) {
    reasons.push(
      `one restart killed ${facts.row.sessionsKilled} running sessions (20:03:54 beforeQuit → 20:03:55 nine PTYs exited)`,
    );
  }
  if (facts.row.bannerUnreachable === true) {
    reasons.push(BANNER);
  }
  if (facts.row.machineAwake === true && facts.row.bannerUnreachable === true) {
    reasons.push(SECOND_USER);
  }
  if (facts.row.userConsented === false) {
    reasons.push("#90870 nearby: the restart fires without user action, even with a staged unactioned banner");
  }
  if (facts.row.beforeFirstTurn === true && facts.row.transcriptPresent === false) {
    reasons.push("when the kill lands before a session's first turn, no transcript is ever written");
  }
  if (facts.dummy) {
    reasons.push("#90874 same-class: local-only sessions auto-registered with cloud Remote Control; disableRemoteControl is all-or-nothing");
  }
  return reasons;
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    stealthRelaunch: true,
    navRestored: true,
    navEntryCount: NAV_ENTRIES,
    sessionsKilled: SESSIONS_KILLED,
    processesRestarted: false,
    cardsHealthy: true,
    bannerUnreachable: true,
    machineAwake: true,
    transcriptPresent: true,
    beforeFirstTurn: false,
    userConsented: false,
    outputText: `${QUIT_LOG}\n${STOP_ALL_LOG}\n${PTY_LOG}\n${NAV_MARKER_LOG}\n${STEALTH_LOG}\n${BANNER}`,
    version: VERSION,
    cli: CLI,
    platform: PLATFORM,
    os: OS,
  };
}

export function seedGutted() {
  return {
    ...baseSeed("gutted"),
    outputText: `${QUIT_LOG}\n${STOP_ALL_LOG}\n${PTY_LOG}\n${START_LOG}\n${NAV_MARKER_LOG}\n${STEALTH_LOG}\n${BANNER}`,
  };
}

export function seedFitted() {
  return {
    ...baseSeed("fitted"),
    sessionsKilled: 0,
    processesRestarted: true,
    bannerUnreachable: false,
    userConsented: true,
    outputText: "restored window still has living CLI children; sessions actually resume",
  };
}

export function seedHollow() {
  return {
    ...baseSeed("hollow"),
    outputText: "box present after stealth relaunch; interiors empty; drawers gone from the carcase",
  };
}

export function seedStealthKilled() {
  return {
    ...baseSeed("stealth-killed"),
    outputText: `${STOP_ALL_LOG}\n${PTY_LOG}\n${STEALTH_LOG}`,
  };
}

export function seedChromeOnly() {
  return {
    ...baseSeed("chrome-only"),
    outputText: `${NAV_MARKER_LOG}\n${STEALTH_LOG} — window + 50 nav entries restored, zero sessions restarted`,
  };
}

export function seedUnconsented() {
  return {
    ...baseSeed("unconsented"),
    userConsented: false,
    outputText:
      "restart fires without user action, even with an update banner staged and unactioned (#90870)",
  };
}

export function seedEmptied() {
  return {
    ...baseSeed("emptied"),
    sessionsKilled: 9,
    outputText: `${PTY_LOG} — nine sessions killed at 20:03:55; relaunch 41 seconds later restored 50 navigation entries and zero sessions`,
  };
}

export function seedDummy() {
  return {
    ...baseSeed("dummy"),
    outputText: `${BANNER} — ${SECOND_USER}`,
  };
}

export function seedOccupied() {
  return {
    ...baseSeed("occupied"),
    sessionsKilled: 0,
    processesRestarted: true,
    bannerUnreachable: false,
    userConsented: true,
    outputText: "tally of live local processes behind the cards; drawers occupied",
  };
}

export function seedRestoredNav() {
  return {
    ...baseSeed("restored-nav"),
    outputText: `${NAV_MARKER_LOG}\n[stealth-relaunch] Loaded navigation history (50 entries, active=49)`,
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    fitted: seedFitted,
    gutted: seedGutted,
    hollow: seedHollow,
    "stealth-killed": seedStealthKilled,
    "chrome-only": seedChromeOnly,
    unconsented: seedUnconsented,
    emptied: seedEmptied,
    dummy: seedDummy,
    occupied: seedOccupied,
    "restored-nav": seedRestoredNav,
    90867: seedGutted,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedGutted());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.carcase?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket = payload.ticket || payload.carcase || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = result.alarm;
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? "Carcase gutted. A gutted carcase is not a hold. #90867 stealth relaunch restored the window and cards; CLI children were killed. Score the drawers or admit fitted."
        : "Carcase fitted. Drawers in: CLI children still running, sessions actually resume.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedGutted();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.carcase || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedGutted();
  }
  return seedGutted();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedGutted());
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
