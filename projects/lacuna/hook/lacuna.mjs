/**
 * Lacuna — collation desk / manuscript
 * lacuna bench for a real Claude
 * Code defect: the session task
 * store at ~/.claude/tasks/<id>/
 * is silently scraped mid-session.
 * Every <n>.json is unlinked,
 * .highwatermark is written with
 * the last id issued, TaskList
 * then reports "No tasks found"
 * (indistinguishable from a
 * session that never created a
 * task), and TaskCreate allocates
 * from .highwatermark + 1 so new
 * ids resume PAST the vanished
 * ones. Across 473 session dirs,
 * 7 show this truncated shape;
 * in every one the lowest
 * surviving id equals
 * .highwatermark + 1. Intact
 * sessions have 1.json and NO
 * .highwatermark at all — the
 * counter file is the fingerprint
 * of the wipe. No error is
 * emitted.
 *
 * A watermark is not a gathering.
 * Score the desk or admit
 * collated.
 *
 * Primary #90709: OPEN, filed
 * 2026-08-30. Title: [TaskList]
 * Task store silently cleared
 * mid-session; new ids resume
 * past the gap. Labels: bug /
 * has-repro / platform:macos /
 * area:core. Version 2.1.245 at
 * loss; CLI now 2.1.251.
 *
 * Same-class corroboration (cite,
 * not this product's exact bug):
 *   #88346 has-repro / data-loss:
 *     task JSON deleted with no
 *     Task tool call, ~5.1s after
 *     a teammate completes the
 *     highest-numbered task;
 *     .highwatermark rewritten to
 *     that id. Likely the delayed
 *     timer wipe that 90709
 *     forensics later.
 *
 * Nearby, different (label as
 * contrast — enumeration lie,
 * files still there):
 *   #84284 TaskList "No tasks
 *     found" after /compact while
 *     background tasks still
 *     addressable by ID.
 *
 * Related cluster, not this
 * silent mid-session scrape:
 *   #78147 #76844 #80871 #76493
 *     task-list restore / resume /
 *     completed-delete.
 *
 * Cross-ecosystem:
 *   openai/codex#32697 desktop
 *     task disappeared after app
 *     update; local JSONL still
 *     exists (index gone,
 *     transcript remains).
 *   openai/codex#40674 active
 *     chats disappear without a
 *     delete action.
 *   openai/codex#35784 long-
 *     running task disappeared
 *     after usage exhaustion.
 *
 * Verdicts: collated | scraped |
 *           gapped | watermarked |
 *           resumed-past |
 *           vanished | intact |
 *           counterfeit-empty |
 *           skipped | delayed-wipe
 * Idle word is collated (honest
 * control: store complete,
 * TaskList truthful, no orphan
 * .highwatermark).
 * NEVER use collated for a
 * failure.
 * intact is a labeled control
 * (1.json present, no
 * .highwatermark) — not the idle
 * admit. Idle admit is collated.
 *
 * Slack chip + Linear ticket on
 * scraped / gapped / watermarked /
 * resumed-past / vanished /
 * counterfeit-empty / skipped /
 * delayed-wipe when this bug
 * (not a labeled contrast).
 * GitHub lacuna-ledger of scored
 * intakes on every score.
 *
 * Priority when multiple match:
 *   unique nearby contrast seeds
 *     keep their labels
 *   > scraped (#90709 triad:
 *     files unlinked +
 *     .highwatermark written +
 *     TaskList "No tasks found")
 *   > gapped
 *   > watermarked
 *   > resumed-past
 *   > vanished
 *   > counterfeit-empty
 *   > skipped
 *   > delayed-wipe
 *   > intact
 *   > collated
 *
 * Why this is not a clone:
 * NOT Ambo — unheard
 *     PermissionRequest
 *     systemMessage on
 *     ExitPlanMode card.
 * NOT Slype — sandbox pwsh 126
 *     vs System32 powershell.
 * NOT Tally — /exit CLAUDE_BASE
 *     birth-count false-loss.
 * NOT Pale — silent-absent hooks
 *     when session root ≠ repo
 *     root.
 * NOT Chatelaine — mcpOAuth
 *     nested in Anthropic
 *     Keychain.
 * NOT Byline — phantom hook
 *     agent_id.
 * NOT Cubby — wrong-ancestor
 *     auto-memory.
 * NOT Ullage — silent context
 *     drop.
 * NOT Veto — AgentTool veto /
 *     palimpsest overlay. Do NOT
 *     name this Palimpsest.
 * NOT Husk — hollow headless
 *     success envelopes.
 * NOT Quoin — printer's quoin.
 * Different UI: scriptorium
 * collation table, stacked vellum
 * quires, ghost rectangles,
 * brass type-high watermark
 * rule. EB Garamond + Source
 * Serif 4 + IBM Plex Mono.
 * Different idle: collated.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const VERDICTS = Object.freeze([
  "collated",
  "scraped",
  "gapped",
  "watermarked",
  "resumed-past",
  "vanished",
  "intact",
  "counterfeit-empty",
  "skipped",
  "delayed-wipe",
]);
export const IDLE_WORD = "collated";
export const SLACK_VERDICTS = Object.freeze([
  "scraped",
  "gapped",
  "watermarked",
  "resumed-past",
  "vanished",
  "counterfeit-empty",
  "skipped",
  "delayed-wipe",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90709;
export const SAME_CLASS_88346 = 88346;
export const CONTRAST_84284 = 84284;
export const CLUSTER_78147 = 78147;
export const CLUSTER_76844 = 76844;
export const CLUSTER_80871 = 80871;
export const CLUSTER_76493 = 76493;
export const CODEX_INDEX = 32697;
export const CODEX_CHATS = 40674;
export const CODEX_USAGE = 35784;
export const RELATED_AMBO = 90685;
export const RELATED_SLYPE = 90676;
export const RELATED_TALLY = 90692;
export const RELATED_PALE = 90683;
export const RELATED_CHATELAINE = 90647;
export const RELATED_BYLINE = 90662;
export const RELATED_CUBBY = 90604;

export const DEMO_HWM = 22;
export const DEMO_SURVIVING = Object.freeze([23, 24, 25, 26, 27, 28, 29, 30, 31]);
export const DEMO_TASKLIST_EMPTY = "No tasks found";
export const DEMO_NEXT_ID = 23;
export const DEMO_VERSION = "2.1.245";
export const DEMO_CLI_NOW = "2.1.251";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "lacuna-desk";
export const DEMO_STORE = "~/.claude/tasks/<session-id>/";
export const DEMO_WIPE_AT = "2026-08-30T01:46:44Z";
export const DEMO_LIST_AT = "2026-08-30T07:58:34Z";
export const DEMO_COMPLETE_AT = "2026-08-30T01:46:39Z";
export const DEMO_SESSIONS_SAMPLED = 473;
export const DEMO_TRUNCATED = 7;
export const DEMO_DELAY_MS = 5100;

const FORBIDDEN_IDLE = Object.freeze([
  "lacuna",
  "palimpsest",
  "quoin",
  "ambo",
  "pulpit",
  "lectern",
  "nave",
  "slype",
  "tally",
  "pale",
  "chatelaine",
  "byline",
  "cubby",
  "ullage",
  "veto",
  "husk",
  "waif",
  "berth",
  "carrel",
  "empty",
  "silent",
  "mute",
  "idle",
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
  "stowed",
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
  "nested",
  "cut",
  "switched",
  "spilled",
  "true",
  "home",
  "gripped",
  "swung",
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

function asIdList(value) {
  if (Array.isArray(value)) {
    return value
      .map((row) => Number(row))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,\s]+/)
      .map((row) => Number(row))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  }
  return [];
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    files: [],
    highwatermark: null,
    taskList: "",
    nextCreateId: null,
    deleteEvent: null,
    wipeDelayMs: null,
    teammateCompletedHighest: null,
    addressableById: null,
    compactAfterWipe: null,
    storePath: "",
    version: "",
    nearby: "",
    nearbyScraped: false,
    nearbyGapped: false,
    nearbyWatermarked: false,
    nearbyResumedPast: false,
    nearbyVanished: false,
    nearbyIntact: false,
    nearbyCounterfeitEmpty: false,
    nearbySkipped: false,
    nearbyDelayedWipe: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.lacuna && typeof src.lacuna === "object") return src.lacuna;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.store && typeof src.store === "object") return src.store;
  if (src.desk && typeof src.desk === "object") return src.desk;
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
    files: asIdList(nested.files ?? src.files ?? base.files),
    highwatermark: asNullableNumber(nested.highwatermark ?? src.highwatermark),
    taskList: asText(nested.taskList || src.taskList || ""),
    nextCreateId: asNullableNumber(nested.nextCreateId ?? src.nextCreateId),
    deleteEvent: asNullableBool(nested.deleteEvent ?? src.deleteEvent),
    wipeDelayMs: asNullableNumber(nested.wipeDelayMs ?? src.wipeDelayMs),
    teammateCompletedHighest: asNullableBool(
      nested.teammateCompletedHighest ?? src.teammateCompletedHighest,
    ),
    addressableById: asNullableBool(nested.addressableById ?? src.addressableById),
    compactAfterWipe: asNullableBool(nested.compactAfterWipe ?? src.compactAfterWipe),
    storePath: asText(nested.storePath || src.storePath || ""),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyScraped: asBool(nested.nearbyScraped ?? src.nearbyScraped, false),
    nearbyGapped: asBool(nested.nearbyGapped ?? src.nearbyGapped, false),
    nearbyWatermarked: asBool(nested.nearbyWatermarked ?? src.nearbyWatermarked, false),
    nearbyResumedPast: asBool(nested.nearbyResumedPast ?? src.nearbyResumedPast, false),
    nearbyVanished: asBool(nested.nearbyVanished ?? src.nearbyVanished, false),
    nearbyIntact: asBool(nested.nearbyIntact ?? src.nearbyIntact, false),
    nearbyCounterfeitEmpty: asBool(
      nested.nearbyCounterfeitEmpty ?? src.nearbyCounterfeitEmpty,
      false,
    ),
    nearbySkipped: asBool(nested.nearbySkipped ?? src.nearbySkipped, false),
    nearbyDelayedWipe: asBool(nested.nearbyDelayedWipe ?? src.nearbyDelayedWipe, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function fingerprintDir(dirPath) {
  const path = asText(dirPath);
  if (!path || !existsSync(path)) {
    return {
      files: [],
      highwatermark: null,
      hasLock: false,
      hasOne: false,
      lowestSurviving: null,
      highestSurviving: null,
      storePath: path,
    };
  }
  const names = readdirSync(path);
  const files = names
    .filter((name) => /^\d+\.json$/.test(name))
    .map((name) => Number(name.replace(/\.json$/, "")))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  let highwatermark = null;
  const hwmPath = join(path, ".highwatermark");
  if (existsSync(hwmPath)) {
    const raw = readFileSync(hwmPath, "utf8").trim();
    const n = Number(raw);
    highwatermark = Number.isFinite(n) ? n : null;
  }
  return {
    files,
    highwatermark,
    hasLock: names.includes(".lock"),
    hasOne: files.includes(1),
    lowestSurviving: files.length ? files[0] : null,
    highestSurviving: files.length ? files[files.length - 1] : null,
    storePath: path,
  };
}

export function probeFromDir(dirPath, extra = {}) {
  const print = fingerprintDir(dirPath);
  return cloneProbe({
    ...extra,
    files: print.files,
    highwatermark: print.highwatermark,
    storePath: print.storePath,
    nextCreateId:
      extra.nextCreateId != null
        ? extra.nextCreateId
        : print.highwatermark != null
          ? print.highwatermark + 1
          : print.highestSurviving != null
            ? print.highestSurviving + 1
            : null,
  });
}

function taskListEmpty(text) {
  return /no tasks found/i.test(asText(text));
}

function taskListTruthful(text) {
  const raw = asText(text).trim();
  return Boolean(raw) && !taskListEmpty(raw);
}

function consecutiveFromOne(files) {
  return files.length > 0 && files[0] === 1 && files.every((id, i) => id === i + 1);
}

function hasIdGap(files) {
  if (files.length < 2) return false;
  return files.some((id, i) => i > 0 && id !== files[i - 1] + 1);
}

export function isOffLacuna(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "84284" ||
    nearby === "compact" ||
    nearby === "78147" ||
    nearby === "76844" ||
    nearby === "80871" ||
    nearby === "76493" ||
    nearby === "32697" ||
    nearby === "40674" ||
    nearby === "35784" ||
    nearby === "codex" ||
    nearby === "ambo" ||
    nearby === "90685" ||
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "tally" ||
    nearby === "90692" ||
    nearby === "pale" ||
    nearby === "90683" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "byline" ||
    nearby === "90662" ||
    nearby === "cubby" ||
    nearby === "90604" ||
    nearby === "ullage" ||
    nearby === "veto" ||
    nearby === "husk" ||
    nearby === "quoin"
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.files.length ||
    probe.highwatermark != null ||
    probe.taskList ||
    probe.nextCreateId != null ||
    probe.deleteEvent != null ||
    probe.wipeDelayMs != null ||
    probe.teammateCompletedHighest != null ||
    probe.addressableById != null ||
    probe.compactAfterWipe != null ||
    probe.storePath ||
    probe.version ||
    probe.nearbyScraped ||
    probe.nearbyGapped ||
    probe.nearbyWatermarked ||
    probe.nearbyResumedPast ||
    probe.nearbyVanished ||
    probe.nearbyIntact ||
    probe.nearbyCounterfeitEmpty ||
    probe.nearbySkipped ||
    probe.nearbyDelayedWipe ||
    isOffLacuna(probe)
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyScraped ||
      row.nearbyGapped ||
      row.nearbyWatermarked ||
      row.nearbyResumedPast ||
      row.nearbyVanished ||
      row.nearbyIntact ||
      row.nearbyCounterfeitEmpty ||
      row.nearbySkipped ||
      row.nearbyDelayedWipe ||
      isOffLacuna(row),
  );
}

function contrastLabel(row) {
  const nearby = asText(row.nearby).toLowerCase();
  if (nearby === "84284" || nearby === "compact") return "counterfeit-empty";
  if (nearby === "32697" || nearby === "40674" || nearby === "35784" || nearby === "codex") {
    return "vanished";
  }
  if (
    nearby === "78147" ||
    nearby === "76844" ||
    nearby === "80871" ||
    nearby === "76493"
  ) {
    return "skipped";
  }
  return "vanished";
}

function delayedWipeShape(row) {
  if (row.wipeDelayMs == null) return false;
  return row.wipeDelayMs >= 4800 && row.wipeDelayMs <= 5400;
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const emptyFiles = row.files.length === 0;
  const hasHwm = row.highwatermark != null;
  const listEmpty = taskListEmpty(row.taskList);
  const triad = Boolean(
    emptyFiles && hasHwm && listEmpty && row.deleteEvent !== true && !uniqueNearby,
  );
  const lowest = row.files.length ? row.files[0] : null;
  const gappedShape = Boolean(
    hasHwm && row.files.length > 0 && lowest === row.highwatermark + 1,
  );
  const resumedShape = Boolean(
    hasHwm &&
      row.nextCreateId != null &&
      row.nextCreateId === row.highwatermark + 1 &&
      (emptyFiles || lowest >= row.nextCreateId),
  );
  const skippedShape = hasIdGap(row.files) || (hasHwm && lowest != null && lowest > row.highwatermark + 1);
  const vanishedShape = Boolean(
    row.deleteEvent === false &&
      (emptyFiles || (hasHwm && lowest != null && lowest > 1)),
  );
  const honest = Boolean(
    consecutiveFromOne(row.files) &&
      !hasHwm &&
      taskListTruthful(row.taskList) &&
      row.deleteEvent !== true &&
      !uniqueNearby,
  );
  const intactShape = Boolean(row.files.includes(1) && !hasHwm);

  let eventClass = "idle";
  if (uniqueNearby && !triad) {
    if (row.nearbyScraped) eventClass = "scraped";
    else if (row.nearbyGapped) eventClass = "gapped";
    else if (row.nearbyWatermarked) eventClass = "watermarked";
    else if (row.nearbyResumedPast) eventClass = "resumed-past";
    else if (row.nearbyVanished) eventClass = "vanished";
    else if (row.nearbyCounterfeitEmpty) eventClass = "counterfeit-empty";
    else if (row.nearbySkipped) eventClass = "skipped";
    else if (row.nearbyDelayedWipe) eventClass = "delayed-wipe";
    else if (row.nearbyIntact) eventClass = "intact";
    else if (isOffLacuna(row)) eventClass = contrastLabel(row);
  } else if (triad) eventClass = "scraped";
  else if (gappedShape) eventClass = "gapped";
  else if (hasHwm && emptyFiles && !listEmpty) eventClass = "watermarked";
  else if (resumedShape) eventClass = "resumed-past";
  else if (vanishedShape && emptyFiles) eventClass = "vanished";
  else if (listEmpty && row.addressableById === true) eventClass = "counterfeit-empty";
  else if (listEmpty && hasHwm) eventClass = "counterfeit-empty";
  else if (skippedShape) eventClass = "skipped";
  else if (delayedWipeShape(row) && row.teammateCompletedHighest === true) {
    eventClass = "delayed-wipe";
  } else if (intactShape && !honest) eventClass = "intact";
  else if (honest || isIdle(row)) eventClass = "collated";
  else eventClass = "collated";

  return {
    uniqueNearby,
    triad,
    emptyFiles,
    hasHwm,
    listEmpty,
    gappedShape,
    resumedShape,
    skippedShape,
    vanishedShape,
    honest,
    intactShape,
    lowestSurviving: lowest,
    highestSurviving: row.files.length ? row.files[row.files.length - 1] : null,
    offLacuna: isOffLacuna(row),
    eventClass,
    files: row.files,
    highwatermark: row.highwatermark,
    taskList: row.taskList,
    nextCreateId: row.nextCreateId,
    deleteEvent: row.deleteEvent,
    wipeDelayMs: row.wipeDelayMs,
    teammateCompletedHighest: row.teammateCompletedHighest,
    addressableById: row.addressableById,
    storePath: row.storePath,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "collated";
  const facts = analyze(row);
  if (!facts.triad) {
    if (row.nearbyScraped) return "scraped";
    if (row.nearbyGapped) return "gapped";
    if (row.nearbyWatermarked) return "watermarked";
    if (row.nearbyResumedPast) return "resumed-past";
    if (row.nearbyVanished) return "vanished";
    if (row.nearbyCounterfeitEmpty) return "counterfeit-empty";
    if (row.nearbySkipped) return "skipped";
    if (row.nearbyDelayedWipe) return "delayed-wipe";
    if (row.nearbyIntact) return "intact";
    if (facts.offLacuna) return contrastLabel(row);
  }
  if (facts.triad) return "scraped";
  if (facts.gappedShape) return "gapped";
  if (facts.hasHwm && facts.emptyFiles && !facts.listEmpty) return "watermarked";
  if (facts.resumedShape) return "resumed-past";
  if (facts.vanishedShape && facts.emptyFiles) return "vanished";
  if (facts.listEmpty && row.addressableById === true) return "counterfeit-empty";
  if (facts.listEmpty && facts.hasHwm) return "counterfeit-empty";
  if (facts.skippedShape) return "skipped";
  if (delayedWipeShape(row) && row.teammateCompletedHighest === true) return "delayed-wipe";
  if (facts.intactShape && !facts.honest) return "intact";
  if (facts.honest) return "collated";
  return "collated";
}

export function feedOf(kind) {
  if (kind === "scraped") {
    return "● Scraped · every <id>.json unlinked · .highwatermark written · TaskList \"No tasks found\" · primary #90709";
  }
  if (kind === "gapped") {
    return "● Gapped · surviving ids start at highwatermark+1 · 7/7 truncated dirs match · the catchword points past the lacuna";
  }
  if (kind === "watermarked") {
    return "● Watermarked · .highwatermark present · intact sessions lack the counter file · fingerprint of the wipe";
  }
  if (kind === "resumed-past") {
    return "● Resumed-past · TaskCreate allocates from .highwatermark + 1 · new ids resume after the vanished range";
  }
  if (kind === "vanished") {
    return "● Vanished · prior phases gone with no delete event · no error is emitted";
  }
  if (kind === "counterfeit-empty") {
    return "● Counterfeit-empty · TaskList \"No tasks found\" after a wipe · indistinguishable from never-created";
  }
  if (kind === "skipped") {
    return "● Skipped · ids jump the lacuna · the gathering is no longer consecutive";
  }
  if (kind === "delayed-wipe") {
    return "● Delayed-wipe · ~5.1s after a teammate completes the highest id · #88346 corroboration, not this product's exact trigger";
  }
  if (kind === "intact") {
    return "● Intact · 1.json present · no .highwatermark · labeled control, not the idle admit";
  }
  return "● Collated · store complete · TaskList truthful · no orphan .highwatermark · idle word is collated";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "scraped" || facts.triad) {
    reasons.push(
      "#90709 Task store silently cleared mid-session; new ids resume past the gap",
    );
  }
  if (row.files.length) reasons.push(`surviving ids ${row.files.join(",")}`);
  else reasons.push("no <id>.json leaves on the desk");
  if (facts.hasHwm) reasons.push(`.highwatermark ${row.highwatermark}`);
  else reasons.push("no .highwatermark (intact sessions lack the counter)");
  if (row.taskList) reasons.push(`TaskList ${row.taskList}`);
  if (row.nextCreateId != null) reasons.push(`TaskCreate would issue ${row.nextCreateId}`);
  if (facts.gappedShape) {
    reasons.push(
      `lowest surviving ${facts.lowestSurviving} equals highwatermark+1`,
    );
  }
  if (row.deleteEvent === false) reasons.push("no delete event in the transcript");
  if (row.deleteEvent === true) reasons.push("explicit delete event present");
  if (row.wipeDelayMs != null) reasons.push(`wipe delay ${row.wipeDelayMs}ms`);
  if (row.teammateCompletedHighest === true) {
    reasons.push("teammate completed the highest-numbered task");
  }
  if (row.addressableById === true) {
    reasons.push("tasks still addressable by ID (enumeration lie)");
  }
  if (row.storePath) reasons.push(`store ${row.storePath}`);
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offLacuna) {
    reasons.push(
      "labeled contrast, not this defect: #84284 compact enumeration lie (files still there) or Codex index-loss (#32697 #40674 #35784). Also not Ambo / Slype / Tally / Pale / Chatelaine / Byline / Cubby / Ullage / Veto / Husk / Quoin",
    );
  }
  if (kind === "collated") {
    reasons.push(
      "store complete and TaskList truthful, or the idle desk; idle word is collated",
    );
  }
  if (kind === "intact") {
    reasons.push("1.json present and no .highwatermark — labeled control, not the idle admit");
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "scraped") {
    return `Lacuna scraped · ${facts.storePath || DEMO_STORE} · hwm ${facts.highwatermark ?? DEMO_HWM} · TaskList empty · #90709`;
  }
  if (kind === "gapped") {
    return `Lacuna gapped · lowest ${facts.lowestSurviving ?? "?"} = highwatermark+1`;
  }
  if (kind === "watermarked") {
    return `Lacuna watermarked · .highwatermark ${facts.highwatermark ?? "?"} · wipe fingerprint`;
  }
  if (kind === "resumed-past") {
    return `Lacuna resumed-past · TaskCreate issues ${facts.nextCreateId ?? "hwm+1"}`;
  }
  if (kind === "vanished") {
    return "Lacuna vanished · prior phases gone · no delete event";
  }
  if (kind === "counterfeit-empty") {
    return "Lacuna counterfeit-empty · TaskList No tasks found · looks like never-created";
  }
  if (kind === "skipped") {
    return "Lacuna skipped · ids jump the lacuna";
  }
  if (kind === "delayed-wipe") {
    return `Lacuna delayed-wipe · ${facts.wipeDelayMs ?? DEMO_DELAY_MS}ms after teammate highest · #88346`;
  }
  return "";
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offLacuna;
  const alarm = SLACK_VERDICTS.includes(kind) && !off;
  return {
    product: "lacuna",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    collated: kind === "collated",
    scraped: kind === "scraped",
    gapped: kind === "gapped",
    watermarked: kind === "watermarked",
    "resumed-past": kind === "resumed-past",
    vanished: kind === "vanished",
    intact: kind === "intact",
    "counterfeit-empty": kind === "counterfeit-empty",
    skipped: kind === "skipped",
    "delayed-wipe": kind === "delayed-wipe",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "collated" && kind !== "intact" && !off,
    offLacuna: off,
    slackCopy: slackCopy(kind, facts),
    facts: {
      files: facts.files,
      highwatermark: facts.highwatermark,
      taskList: facts.taskList,
      nextCreateId: facts.nextCreateId,
      deleteEvent: facts.deleteEvent,
      wipeDelayMs: facts.wipeDelayMs,
      teammateCompletedHighest: facts.teammateCompletedHighest,
      addressableById: facts.addressableById,
      storePath: facts.storePath,
      version: facts.version,
      triad: facts.triad,
      offLacuna: facts.offLacuna,
      emptyFiles: facts.emptyFiles,
      hasHwm: facts.hasHwm,
      listEmpty: facts.listEmpty,
      gappedShape: facts.gappedShape,
      resumedShape: facts.resumedShape,
      skippedShape: facts.skippedShape,
      vanishedShape: facts.vanishedShape,
      honest: facts.honest,
      intactShape: facts.intactShape,
      lowestSurviving: facts.lowestSurviving,
      highestSurviving: facts.highestSurviving,
      nearbyScraped: probe.nearbyScraped,
      nearbyGapped: probe.nearbyGapped,
      nearbyWatermarked: probe.nearbyWatermarked,
      nearbyResumedPast: probe.nearbyResumedPast,
      nearbyVanished: probe.nearbyVanished,
      nearbyIntact: probe.nearbyIntact,
      nearbyCounterfeitEmpty: probe.nearbyCounterfeitEmpty,
      nearbySkipped: probe.nearbySkipped,
      nearbyDelayedWipe: probe.nearbyDelayedWipe,
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
  const kind = classify(row);
  return boardResult(kind, row, { action: "score" });
}

export function scoreDir(dirPath, extra = {}) {
  return score(probeFromDir(dirPath, extra));
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function collatedOf(probe = {}) {
  return classify(probe) === "collated";
}

export function flagsOf(probe = {}) {
  return analyze(probe);
}

export function reasonsList(probe = {}) {
  return reasonsOf(probe, classify(probe));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    lacuna: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedCollated() {
  return baseSeed("collated-hold", FEATURED_ISSUE, {
    source: "honest control: store complete, TaskList truthful, no orphan .highwatermark",
    files: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    highwatermark: null,
    taskList: "1..10 present",
    nextCreateId: 11,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedCollated();
}

export function seedReset() {
  return { action: "bail", lacuna: emptyProbe() };
}

export function seedScraped() {
  return baseSeed("90709-scraped", FEATURED_ISSUE, {
    source:
      "primary #90709 files unlinked, .highwatermark written, TaskList No tasks found",
    files: [],
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: DEMO_NEXT_ID,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
  });
}

export function seed90709() {
  return seedScraped();
}

export function seedGapped() {
  return baseSeed("90709-gapped", FEATURED_ISSUE, {
    source: "surviving ids start at highwatermark+1; 7/7 truncated dirs match",
    files: DEMO_SURVIVING.slice(),
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: 32,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyGapped: true,
  });
}

export function seedWatermarked() {
  return baseSeed("90709-watermarked", FEATURED_ISSUE, {
    source: ".highwatermark present; intact sessions lack the counter file",
    files: [],
    highwatermark: DEMO_HWM,
    taskList: "",
    nextCreateId: DEMO_NEXT_ID,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyWatermarked: true,
  });
}

export function seedResumedPast() {
  return baseSeed("90709-resumed-past", FEATURED_ISSUE, {
    source: "TaskCreate allocates from .highwatermark + 1",
    files: [],
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: DEMO_NEXT_ID,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyResumedPast: true,
  });
}

export function seedVanished() {
  return baseSeed("90709-vanished", FEATURED_ISSUE, {
    source: "prior phases gone with no delete event",
    files: [],
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: DEMO_NEXT_ID,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyVanished: true,
  });
}

export function seedIntact() {
  return baseSeed("90709-intact", FEATURED_ISSUE, {
    source: "labeled control: 1.json present, no .highwatermark",
    files: [1, 2, 3],
    highwatermark: null,
    taskList: "",
    nextCreateId: 4,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyIntact: true,
  });
}

export function seedCounterfeitEmpty() {
  return baseSeed("90709-counterfeit-empty", FEATURED_ISSUE, {
    source: "TaskList No tasks found after a wipe; looks like never-created",
    files: [],
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: DEMO_NEXT_ID,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbyCounterfeitEmpty: true,
  });
}

export function seedSkipped() {
  return baseSeed("90709-skipped", FEATURED_ISSUE, {
    source: "ids jump the lacuna",
    files: [23, 24, 31],
    highwatermark: DEMO_HWM,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: 32,
    deleteEvent: false,
    storePath: DEMO_STORE,
    version: DEMO_VERSION,
    nearbySkipped: true,
  });
}

export function seedDelayedWipe() {
  return baseSeed("88346-delayed-wipe", SAME_CLASS_88346, {
    source: "~5.1s after teammate completes highest id; #88346 corroboration",
    files: [],
    highwatermark: 12,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: 13,
    deleteEvent: false,
    wipeDelayMs: DEMO_DELAY_MS,
    teammateCompletedHighest: true,
    storePath: DEMO_STORE,
    version: "2.1.237",
    nearbyDelayedWipe: true,
  });
}

export function seedContrast84284() {
  return baseSeed("contrast-84284", CONTRAST_84284, {
    source: "NOT this: #84284 TaskList empty after /compact; files still addressable by ID",
    nearby: "84284",
    files: [1, 2, 3],
    highwatermark: null,
    taskList: DEMO_TASKLIST_EMPTY,
    nextCreateId: 4,
    deleteEvent: false,
    addressableById: true,
    compactAfterWipe: true,
    storePath: DEMO_STORE,
    version: "2.1.222",
  });
}

export function seedCodex32697() {
  return baseSeed("contrast-32697", CODEX_INDEX, {
    source: "NOT this: openai/codex#32697 index gone, transcript remains",
    nearby: "32697",
    files: [],
    highwatermark: null,
    taskList: DEMO_TASKLIST_EMPTY,
    deleteEvent: false,
    storePath: "codex-index",
    version: "",
  });
}

const SEEDS = {
  collated: seedCollated,
  control: seedCollated,
  healthy: seedCollated,
  hold: seedCollated,
  scraped: seedScraped,
  90709: seedScraped,
  "90709": seedScraped,
  gapped: seedGapped,
  watermarked: seedWatermarked,
  "resumed-past": seedResumedPast,
  resumedpast: seedResumedPast,
  vanished: seedVanished,
  intact: seedIntact,
  "counterfeit-empty": seedCounterfeitEmpty,
  counterfeitempty: seedCounterfeitEmpty,
  skipped: seedSkipped,
  "delayed-wipe": seedDelayedWipe,
  delayedwipe: seedDelayedWipe,
  88346: seedDelayedWipe,
  "88346": seedDelayedWipe,
  84284: seedContrast84284,
  "84284": seedContrast84284,
  contrast: seedContrast84284,
  32697: seedCodex32697,
  "32697": seedCodex32697,
  codex: seedCodex32697,
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
    return { action: payload, lacuna: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const lacuna = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || lacuna.session),
    issue: asIssue(src.issue ?? lacuna.issue),
    source: asText(src.source || lacuna.source),
    lacuna,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.lacuna);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("collated", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedCollated().lacuna;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90709" || verb === "scraped") {
    probe = seedScraped().lacuna;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-lacuna") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseLacunaJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.lacuna ||
      raw.probe ||
      raw.store ||
      raw.desk ||
      raw.files != null ||
      raw.highwatermark != null ||
      raw.taskList ||
      raw.nextCreateId != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parseLacunaJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, lacuna: emptyProbe() };
}
