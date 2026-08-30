#!/usr/bin/env node
/**
 * Cenotaph memorial hook. A vacant
 * monument is not a pair. Score the
 * stone or admit stood.
 *
 *   echo '{"diskUseCount":119,"diskResultCount":119,"diskDangling":0,"assembledHasServerToolUse":false,"assembledHasAdvisorResult":true,"assembledResultAtMessageIndex":3,"awaySummaryBetweenOkAnd400":true,"subsequentTurn400":true,"coldResumeRecovers":true,"specimens":4}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: disk pair counts +
 * assembled server_tool_use /
 * advisor_tool_result + away /
 * teammate / 400 flags → stood vs
 * widowed (or a named nearby class).
 *
 * Different problem: assembled-
 * history widow after away/return
 * (or teammate injection) — disk
 * pair intact, condensed request
 * drops use and keeps result →
 * permanent 400 until cold resume.
 *
 * NOT Sigil / Suture / Coda / Husk
 * / Palimpsest / Waif / Fetch /
 * Livery / Pinfold / Assay / Blot.
 * Idle word is stood.
 * NEVER use stood for a failure.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "stood",
  "widowed",
  "bricked",
  "away-summary",
  "teammate-injected",
  "on-disk-ok",
  "recovered",
  "vacant",
  "advisor-kept",
  "use-dropped",
  "pair-split",
  "disabled-clears",
]);
export const IDLE_WORD = "stood";
export const ALARM_VERDICTS = Object.freeze([
  "widowed",
  "bricked",
  "vacant",
  "use-dropped",
  "pair-split",
  "away-summary",
  "teammate-injected",
]);
export const LINEAR_VERDICTS = Object.freeze(["widowed", "bricked", "vacant"]);
export const FEATURED_ISSUE = 90771;
export const CONTRAST_50527 = 50527;
export const CONTRAST_63375 = 63375;
export const CONTRAST_65938 = 65938;
export const CONTRAST_86198 = 86198;
export const CONTRAST_63553 = 63553;
export const DEMO_DISK_USE = 119;
export const DEMO_DISK_RESULT = 119;
export const DEMO_DISK_DANGLING = 0;
export const DEMO_ASSEMBLED_INDEX = 3;
export const DEMO_SPECIMENS = 4;
export const DEMO_VERSION = "2.1.251";
export const DEMO_DAY = "2026-08-30";
export const DEMO_SESSIONS = Object.freeze([
  "2026-07-20",
  "2026-08-05",
  "2026-08-29",
  "2026-08-30",
]);

const FORBIDDEN_IDLE = Object.freeze([
  "cenotaph",
  "muted",
  "liveried",
  "penned",
  "underwrit",
  "plated",
  "collated",
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
  "flat",
  "kernel",
  "valid",
  "sealed",
  "dry",
  "intact",
  "open",
  "still",
  "loose",
  "even",
  "quiet",
  "cool",
  "latched",
  "upheld",
  "sterling",
  "home",
  "fetch",
  "livery",
  "pinfold",
  "palimpsest",
  "sigil",
  "suture",
  "coda",
  "husk",
  "waif",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(v) {
  return v == null ? "" : String(v);
}
function asNBool(v) {
  if (v === true || v === false) return v;
  return null;
}
function asNNum(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    diskUseCount: null,
    diskResultCount: null,
    diskDangling: null,
    assembledHasServerToolUse: null,
    assembledHasAdvisorResult: null,
    assembledResultAtMessageIndex: null,
    assembledPairCoLocated: null,
    awaySummaryBetweenOkAnd400: null,
    teammateInjection: null,
    compactionRecord: null,
    subsequentTurn400: null,
    coldResumeRecovers: null,
    advisorDisabled: null,
    specimens: null,
    version: "",
    nearby: "",
    nearbyWidowed: false,
    nearbyBricked: false,
    nearbyAwaySummary: false,
    nearbyTeammateInjected: false,
    nearbyOnDiskOk: false,
    nearbyRecovered: false,
    nearbyVacant: false,
    nearbyAdvisorKept: false,
    nearbyUseDropped: false,
    nearbyPairSplit: false,
    nearbyDisabledClears: false,
  };
}

export function cloneProbe(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.cenotaph && typeof src.cenotaph === "object" && src.cenotaph) ||
    (src.stone && typeof src.stone === "object" && src.stone) ||
    src;
  return {
    ...emptyProbe(),
    ...nested,
    diskUseCount: asNNum(nested.diskUseCount),
    diskResultCount: asNNum(nested.diskResultCount),
    diskDangling: asNNum(nested.diskDangling),
    assembledHasServerToolUse: asNBool(nested.assembledHasServerToolUse),
    assembledHasAdvisorResult: asNBool(nested.assembledHasAdvisorResult),
    assembledResultAtMessageIndex: asNNum(nested.assembledResultAtMessageIndex),
    assembledPairCoLocated: asNBool(nested.assembledPairCoLocated),
    awaySummaryBetweenOkAnd400: asNBool(nested.awaySummaryBetweenOkAnd400),
    teammateInjection: asNBool(nested.teammateInjection),
    compactionRecord: asNBool(nested.compactionRecord),
    subsequentTurn400: asNBool(nested.subsequentTurn400),
    coldResumeRecovers: asNBool(nested.coldResumeRecovers),
    advisorDisabled: asNBool(nested.advisorDisabled),
    specimens: asNNum(nested.specimens),
    version: asText(nested.version || ""),
    nearby: asText(nested.nearby || ""),
    nearbyWidowed: Boolean(nested.nearbyWidowed),
    nearbyBricked: Boolean(nested.nearbyBricked),
    nearbyAwaySummary: Boolean(nested.nearbyAwaySummary),
    nearbyTeammateInjected: Boolean(nested.nearbyTeammateInjected),
    nearbyOnDiskOk: Boolean(nested.nearbyOnDiskOk),
    nearbyRecovered: Boolean(nested.nearbyRecovered),
    nearbyVacant: Boolean(nested.nearbyVacant),
    nearbyAdvisorKept: Boolean(nested.nearbyAdvisorKept),
    nearbyUseDropped: Boolean(nested.nearbyUseDropped),
    nearbyPairSplit: Boolean(nested.nearbyPairSplit),
    nearbyDisabledClears: Boolean(nested.nearbyDisabledClears),
  };
}

export function uniqueNearby(row) {
  return Boolean(
    row.nearbyWidowed ||
      row.nearbyBricked ||
      row.nearbyAwaySummary ||
      row.nearbyTeammateInjected ||
      row.nearbyOnDiskOk ||
      row.nearbyRecovered ||
      row.nearbyVacant ||
      row.nearbyAdvisorKept ||
      row.nearbyUseDropped ||
      row.nearbyPairSplit ||
      row.nearbyDisabledClears,
  );
}

export function isIdle(input) {
  const row = cloneProbe(input);
  return !(
    row.diskUseCount != null ||
    row.diskResultCount != null ||
    row.diskDangling != null ||
    row.assembledHasServerToolUse != null ||
    row.assembledHasAdvisorResult != null ||
    row.assembledResultAtMessageIndex != null ||
    row.assembledPairCoLocated != null ||
    row.awaySummaryBetweenOkAnd400 != null ||
    row.teammateInjection != null ||
    row.compactionRecord != null ||
    row.subsequentTurn400 != null ||
    row.coldResumeRecovers != null ||
    row.advisorDisabled != null ||
    row.specimens != null ||
    row.version ||
    row.session ||
    row.source ||
    uniqueNearby(row)
  );
}

export function analyze(input) {
  const row = cloneProbe(input);
  const diskOk =
    row.diskUseCount != null &&
    row.diskResultCount != null &&
    row.diskUseCount === row.diskResultCount &&
    (row.diskDangling == null || row.diskDangling === 0);
  const useDropped = row.assembledHasServerToolUse === false;
  const advisorKept = row.assembledHasAdvisorResult === true;
  const vacant =
    advisorKept &&
    useDropped &&
    row.assembledResultAtMessageIndex === DEMO_ASSEMBLED_INDEX;
  const pairSplit =
    row.assembledPairCoLocated === false ||
    (advisorKept && row.assembledHasServerToolUse === true && row.assembledPairCoLocated === false);
  const awaySummary = row.awaySummaryBetweenOkAnd400 === true && row.compactionRecord !== true;
  const teammate = row.teammateInjection === true;
  const bricked = row.subsequentTurn400 === true;
  const recovered = row.coldResumeRecovers === true;
  const disabled = row.advisorDisabled === true;
  const widowedTriad = Boolean(diskOk && advisorKept && useDropped && !uniqueNearby(row) && !disabled);
  const honest = Boolean(
    row.assembledHasServerToolUse === true &&
      row.assembledHasAdvisorResult === true &&
      row.assembledPairCoLocated !== false &&
      row.subsequentTurn400 !== true &&
      !uniqueNearby(row) &&
      !disabled,
  );
  return {
    row,
    diskOk,
    useDropped,
    advisorKept,
    vacant,
    pairSplit,
    awaySummary,
    teammate,
    bricked,
    recovered,
    disabled,
    widowedTriad,
    honest,
  };
}

export function classify(input) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "stood";
  if (!analyze(row).widowedTriad) {
    if (row.nearbyDisabledClears) return "disabled-clears";
    if (row.nearbyPairSplit) return "pair-split";
    if (row.nearbyUseDropped) return "use-dropped";
    if (row.nearbyAdvisorKept) return "advisor-kept";
    if (row.nearbyVacant) return "vacant";
    if (row.nearbyRecovered) return "recovered";
    if (row.nearbyOnDiskOk) return "on-disk-ok";
    if (row.nearbyTeammateInjected) return "teammate-injected";
    if (row.nearbyAwaySummary) return "away-summary";
    if (row.nearbyBricked) return "bricked";
    if (row.nearbyWidowed) return "widowed";
  }
  const f = analyze(row);
  if (f.widowedTriad) return "widowed";
  if (f.honest) return "stood";
  if (f.disabled && !f.widowedTriad) return "disabled-clears";
  if (f.pairSplit && f.advisorKept && row.assembledHasServerToolUse === true) return "pair-split";
  if (f.vacant) return "vacant";
  if (f.useDropped && f.advisorKept) return "use-dropped";
  if (f.awaySummary && f.bricked) return "away-summary";
  if (f.teammate && f.bricked) return "teammate-injected";
  if (f.bricked) return "bricked";
  if (f.advisorKept && f.useDropped) return "advisor-kept";
  if (f.diskOk && f.useDropped) return "on-disk-ok";
  if (f.recovered && f.useDropped) return "recovered";
  if (f.honest) return "stood";
  return "stood";
}

export function feedOf(kind) {
  if (kind === "widowed") {
    return "● Widowed · assembled condensed history kept advisor_tool_result and dropped server_tool_use · primary #90771";
  }
  if (kind === "bricked") {
    return "● Bricked · every subsequent turn 400s · session unusable from the UI";
  }
  if (kind === "away-summary") {
    return "● Away-summary · away_summary (+ stop_hook_summary / turn_duration) sits between last OK turn and first 400; no compaction record";
  }
  if (kind === "teammate-injected") {
    return "● Teammate-injected · teammate-message injection re-assembly path";
  }
  if (kind === "on-disk-ok") {
    return "● On-disk-ok · JSONL on disk consistent (use/result counts match; dangling 0); orphan exists only in assembled request";
  }
  if (kind === "recovered") {
    return "● Recovered · cold `claude --resume` recovers the session";
  }
  if (kind === "vacant") {
    return "● Vacant · result sits at condensed message index 3 with no preceding server_tool_use";
  }
  if (kind === "advisor-kept") {
    return "● Advisor-kept · advisor_tool_result survived condensation";
  }
  if (kind === "use-dropped") {
    return "● Use-dropped · server_tool_use missing from assembled prefix";
  }
  if (kind === "pair-split") {
    return "● Pair-split · the two blocks are not co-located in one assistant content array";
  }
  if (kind === "disabled-clears") {
    return "● Disabled-clears · disabling the advisor tool removes the class";
  }
  return "● Stood · honest pair in assembled request · server_tool_use and advisor_tool_result co-located · idle word is stood";
}

export function reasonsOf(input, kind) {
  const f = analyze(input);
  const reasons = [`verdict ${kind}`];
  if (kind === "widowed" || f.widowedTriad) {
    reasons.push(
      "#90771 orphaned advisor_tool_result after away/return re-assembly bricks the session with a 400",
    );
  }
  if (f.diskOk) {
    reasons.push(
      `on-disk pair intact: ${f.row.diskUseCount ?? DEMO_DISK_USE} tool_use / ${f.row.diskResultCount ?? DEMO_DISK_RESULT} tool_result / dangling ${f.row.diskDangling ?? DEMO_DISK_DANGLING}`,
    );
  }
  if (f.advisorKept) reasons.push("advisor_tool_result survived condensation");
  if (f.useDropped) reasons.push("server_tool_use missing from assembled prefix");
  if (f.vacant) {
    reasons.push(
      `vacant monument at assembled message index ${f.row.assembledResultAtMessageIndex ?? DEMO_ASSEMBLED_INDEX}`,
    );
  }
  if (f.awaySummary) {
    reasons.push("away_summary (+ stop_hook_summary / turn_duration) between last OK turn and first 400; no compaction");
  }
  if (f.teammate) reasons.push("teammate-message injection re-assembly path");
  if (f.bricked) reasons.push("every subsequent turn 400s — session bricked");
  if (f.recovered) reasons.push("cold claude --resume recovers the session");
  if (f.pairSplit) reasons.push("server_tool_use and advisor_tool_result not co-located in one assistant content array");
  if (f.disabled) reasons.push("disabling the advisor tool removes the class");
  if (f.row.specimens != null) reasons.push(`${f.row.specimens} specimens`);
  if (kind === "stood") {
    reasons.push(
      "assembled request keeps server_tool_use and advisor_tool_result co-located; condensed prefix never carries a result without its use; idle word is stood",
    );
  }
  return reasons;
}

export function verdictOf(input) {
  return classify(input);
}

export function stoodOf(input) {
  return classify(input) === "stood";
}

export function score(probe) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  const f = analyze(row);
  return {
    verdict: kind,
    state: kind,
    stood: kind === "stood",
    alarm: ALARM_VERDICTS.includes(kind),
    linear: LINEAR_VERDICTS.includes(kind),
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    facts: {
      widowedTriad: f.widowedTriad,
      honest: f.honest,
      diskOk: f.diskOk,
      useDropped: f.useDropped,
      advisorKept: f.advisorKept,
      vacant: f.vacant,
      bricked: f.bricked,
      awaySummary: f.awaySummary,
      teammate: f.teammate,
      recovered: f.recovered,
      pairSplit: f.pairSplit,
      disabled: f.disabled,
    },
    reasons: reasonsOf(row, kind),
    feed: feedOf(kind),
    probe: row,
  };
}

export function emptyAction(action = "idle") {
  return { action, cenotaph: emptyProbe() };
}

export function seed90771() {
  return seedWidowed();
}

export function seedWidowed() {
  return {
    action: "score",
    session: "90771-widowed",
    issue: FEATURED_ISSUE,
    source:
      "primary #90771 assembled condensed history kept advisor_tool_result and dropped server_tool_use; disk pair intact",
    diskUseCount: DEMO_DISK_USE,
    diskResultCount: DEMO_DISK_RESULT,
    diskDangling: DEMO_DISK_DANGLING,
    assembledHasServerToolUse: false,
    assembledHasAdvisorResult: true,
    assembledResultAtMessageIndex: DEMO_ASSEMBLED_INDEX,
    assembledPairCoLocated: false,
    awaySummaryBetweenOkAnd400: true,
    teammateInjection: false,
    compactionRecord: false,
    subsequentTurn400: true,
    coldResumeRecovers: true,
    advisorDisabled: false,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
  };
}

export function seedStood() {
  return {
    action: "score",
    session: "stood-hold",
    issue: FEATURED_ISSUE,
    source:
      "honest control: assembled request keeps server_tool_use and advisor_tool_result co-located in one assistant message",
    diskUseCount: DEMO_DISK_USE,
    diskResultCount: DEMO_DISK_RESULT,
    diskDangling: DEMO_DISK_DANGLING,
    assembledHasServerToolUse: true,
    assembledHasAdvisorResult: true,
    assembledResultAtMessageIndex: 4,
    assembledPairCoLocated: true,
    awaySummaryBetweenOkAnd400: false,
    teammateInjection: false,
    compactionRecord: false,
    subsequentTurn400: false,
    coldResumeRecovers: false,
    advisorDisabled: false,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
  };
}

export function seedControl() {
  return seedStood();
}

export function seedReset() {
  return emptyAction("reset");
}

export function seedBricked() {
  return {
    session: "90771-bricked",
    issue: FEATURED_ISSUE,
    subsequentTurn400: true,
    nearbyBricked: true,
    version: DEMO_VERSION,
  };
}

export function seedAwaySummary() {
  return {
    session: "90771-away-summary",
    issue: FEATURED_ISSUE,
    awaySummaryBetweenOkAnd400: true,
    compactionRecord: false,
    nearbyAwaySummary: true,
    version: DEMO_VERSION,
  };
}

export function seedTeammateInjected() {
  return {
    session: "90771-teammate-injected",
    issue: FEATURED_ISSUE,
    teammateInjection: true,
    nearbyTeammateInjected: true,
    version: DEMO_VERSION,
  };
}

export function seedOnDiskOk() {
  return {
    session: "90771-on-disk-ok",
    issue: FEATURED_ISSUE,
    diskUseCount: DEMO_DISK_USE,
    diskResultCount: DEMO_DISK_RESULT,
    diskDangling: DEMO_DISK_DANGLING,
    nearbyOnDiskOk: true,
    version: DEMO_VERSION,
  };
}

export function seedRecovered() {
  return {
    session: "90771-recovered",
    issue: FEATURED_ISSUE,
    coldResumeRecovers: true,
    nearbyRecovered: true,
    version: DEMO_VERSION,
  };
}

export function seedVacant() {
  return {
    session: "90771-vacant",
    issue: FEATURED_ISSUE,
    assembledHasAdvisorResult: true,
    assembledHasServerToolUse: false,
    assembledResultAtMessageIndex: DEMO_ASSEMBLED_INDEX,
    nearbyVacant: true,
    version: DEMO_VERSION,
  };
}

export function seedAdvisorKept() {
  return {
    session: "90771-advisor-kept",
    issue: FEATURED_ISSUE,
    assembledHasAdvisorResult: true,
    nearbyAdvisorKept: true,
    version: DEMO_VERSION,
  };
}

export function seedUseDropped() {
  return {
    session: "90771-use-dropped",
    issue: FEATURED_ISSUE,
    assembledHasServerToolUse: false,
    assembledHasAdvisorResult: true,
    nearbyUseDropped: true,
    version: DEMO_VERSION,
  };
}

export function seedPairSplit() {
  return {
    session: "90771-pair-split",
    issue: FEATURED_ISSUE,
    assembledHasServerToolUse: true,
    assembledHasAdvisorResult: true,
    assembledPairCoLocated: false,
    nearbyPairSplit: true,
    version: DEMO_VERSION,
  };
}

export function seedDisabledClears() {
  return {
    session: "90771-disabled-clears",
    issue: FEATURED_ISSUE,
    advisorDisabled: true,
    nearbyDisabledClears: true,
    version: DEMO_VERSION,
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "90771" || key === "widowed" || key === "ghosted") return decide(seedWidowed());
  if (key === "control" || key === "stood" || key === "muted" || key === "honest") {
    return decide(seedStood());
  }
  if (key === "bricked") return decide(seedBricked());
  if (key === "away-summary") return decide(seedAwaySummary());
  if (key === "teammate-injected") return decide(seedTeammateInjected());
  if (key === "on-disk-ok") return decide(seedOnDiskOk());
  if (key === "recovered") return decide(seedRecovered());
  if (key === "vacant") return decide(seedVacant());
  if (key === "advisor-kept") return decide(seedAdvisorKept());
  if (key === "use-dropped") return decide(seedUseDropped());
  if (key === "pair-split") return decide(seedPairSplit());
  if (key === "disabled-clears") return decide(seedDisabledClears());
  return decide(emptyAction("idle"));
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return cloneProbe(parsed);
    }
  } catch {
    /* transcript prose */
  }
  const lower = text.toLowerCase();
  const probe = emptyProbe();
  const useMatch = text.match(/(\d+)\s+tool_use/i);
  const resultMatch = text.match(/(\d+)\s+tool_result/i);
  const danglingMatch = text.match(/(\d+)\s+dangling/i);
  const indexMatch = text.match(/message(?:s)?(?:\s+index)?[.\s]*(\d+)/i);
  const specMatch = text.match(/(\d+)\s+specimens?/i);
  if (useMatch) probe.diskUseCount = Number(useMatch[1]);
  if (resultMatch) probe.diskResultCount = Number(resultMatch[1]);
  if (danglingMatch) probe.diskDangling = Number(danglingMatch[1]);
  if (indexMatch) probe.assembledResultAtMessageIndex = Number(indexMatch[1]);
  if (specMatch) probe.specimens = Number(specMatch[1]);
  if (/advisor_tool_result/.test(lower)) probe.assembledHasAdvisorResult = true;
  if (/server_tool_use/.test(lower) && /drop|missing|widow|orphan|without/.test(lower)) {
    probe.assembledHasServerToolUse = false;
  } else if (/server_tool_use/.test(lower) && /keep|co-located|pair/.test(lower)) {
    probe.assembledHasServerToolUse = true;
  }
  if (/away_summary|away\/return|away-summary/.test(lower)) {
    probe.awaySummaryBetweenOkAnd400 = true;
  }
  if (/no compaction|without compaction|compaction record/.test(lower) && /no |without /.test(lower)) {
    probe.compactionRecord = false;
  }
  if (/teammate/.test(lower)) probe.teammateInjection = true;
  if (/400|brick/.test(lower)) probe.subsequentTurn400 = true;
  if (/--resume|cold resume/.test(lower)) probe.coldResumeRecovers = true;
  if (/advisor.*disabl|disabl.*advisor/.test(lower)) probe.advisorDisabled = true;
  if (/2\.1\.251/.test(text)) probe.version = DEMO_VERSION;
  if (/#?90771/.test(text)) probe.issue = FEATURED_ISSUE;
  return probe;
}

export function decide(payload = {}) {
  const action = asText(payload.action || payload.cenotaph?.action || "").toLowerCase();
  if (action === "restore" || action === "90771") return score(seedWidowed());
  if (action === "reset" || action === "bail" || action === "idle") return score(emptyProbe());
  if (action === "control" || action === "stood") return score(seedStood());
  const probe =
    payload.probe ||
    payload.cenotaph ||
    payload.stone ||
    (payload.fetch ? emptyProbe() : payload);
  return score(probe);
}

export function analyzeSeed(name) {
  return analyze(decideSeed(name).probe);
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "widowed") {
    return "Cenotaph widowed. Assembled condensed history kept advisor_tool_result and dropped server_tool_use. #90771.";
  }
  if (result.verdict === "bricked") {
    return "Cenotaph bricked. Every subsequent turn 400s. Session unusable from the UI.";
  }
  if (result.verdict === "away-summary") {
    return "Cenotaph away-summary. away_summary sits between last OK turn and first 400; no compaction record.";
  }
  if (result.verdict === "teammate-injected") {
    return "Cenotaph teammate-injected. Teammate-message injection re-assembly path.";
  }
  if (result.verdict === "vacant") {
    return "Cenotaph vacant. Result sits at condensed message index 3 with no preceding server_tool_use.";
  }
  if (result.verdict === "use-dropped") {
    return "Cenotaph use-dropped. server_tool_use missing from assembled prefix.";
  }
  if (result.verdict === "pair-split") {
    return "Cenotaph pair-split. The two blocks are not co-located in one assistant content array.";
  }
  return "Cenotaph refuse. A vacant monument is not a pair.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PermissionRequest",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Cenotaph stood. Assembled request keeps server_tool_use and advisor_tool_result co-located. Idle word is stood.",
        interrupt: deny,
      },
    },
    ...result,
  };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedWidowed());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedWidowed();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.cenotaph || parsed.probe || parsed.stone
        ? parsed
        : { action: "score", cenotaph: parseTranscript(parsed) };
    }
  } catch {
    return { action: "score", cenotaph: parseTranscript(text) };
  }
  return { action: "score", cenotaph: parseTranscript(text) };
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
