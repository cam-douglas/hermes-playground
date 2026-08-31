#!/usr/bin/env node
/**
 * Gnomon — observatory / sundial-terrace classifier.
 * A shared mtime is not a hold. Score the gnomon or admit pointed.
 *
 *   echo '{"sharedMtime":true,"timestampFreeTail":true}' | node gnomon.mjs
 *   node gnomon.mjs ticket.json
 *
 * Idle word is pointed (mtime tracks last timestamped event;
 * true shadow). Seeded state is collapsed / #90954.
 * NEVER idle as "gnomon", "collapsed", "mtime", "transcript",
 * "bulk", "cast", "eclipsed", "spoiled", "banked", "rewrite",
 * "shared", "trammel", "hunting", "traced".
 *
 * Primary #90954: closed session transcripts under
 * ~/.claude/projects/<project>/ are observed with a shared
 * identical mtime (114 files at one second) while content's
 * last timestamped event can be days/weeks earlier. Appended
 * records are timestamp-free metadata types (last-prompt, mode).
 * The bulk-append trigger is a labeled observation, not a
 * proven cause. Observable facts: (1) many long-closed
 * transcripts were appended to in one bulk operation, (2) the
 * appended records are timestamp-free metadata types, (3) mtime
 * moved and content did not.
 *
 * Contrast: preserve mtime on closed transcripts OR require
 * timestamp on appended records.
 * Same-class cite (mtime date-signal family, different
 * symptoms): #87900 VS Code startup indexing rewrites session
 * mtimes; #81803 session history times scramble after extension
 * update; #72746 Agent View last-changed reflects file mtime;
 * #68929 session list sorts by mtime, AI-title backfill clobbers.
 * NOT Spoil, Trammel, Soundpost, Flong, Bulla, Trompe, Davy,
 * Moviola, Clepsydra, Palimpsest, Almanac, Datum, Tally,
 * Cenotaph.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "collapsed",
  "pointed",
  "bulk-mtime",
  "shared-second",
  "closed-transcript",
  "date-signal",
  "untimed-tail",
  "last-prompt",
  "silent-wrong",
  "retention-lie",
  "cluster-114",
  "mtime-vs-content",
  "archive-clock",
  "no-timestamp",
]);
export const IDLE_WORD = "pointed";
export const SEEDED_WORD = "collapsed";
export const HOLD_VERDICTS = Object.freeze(["pointed"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "pointed"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90954;
export const PRIMARY_ISSUES = Object.freeze([90954]);
export const SAME_CLASS = Object.freeze([87900, 81803, 72746, 68929]);
export const CONTRAST_NOTE =
  "preserve mtime on closed transcripts OR require timestamp on appended records";
export const NOT_PRODUCTS = Object.freeze([
  "spoil",
  "trammel",
  "soundpost",
  "flong",
  "bulla",
  "trompe",
  "davy",
  "moviola",
  "clepsydra",
  "palimpsest",
  "almanac",
  "datum",
  "tally",
  "cenotaph",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90954";
export const TITLE =
  "[BUG] Closed session transcripts are bulk-rewritten with a shared mtime, destroying file-date signal (114 files at one identical second)";
export const REPORTER = "somarakis";
export const FILED_AT = "2026-08-31T10:32:53Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const CCD = "2.1.247";
export const LATEST_PUBLISHED = "2.1.251";
export const OS_NAME = "macOS Darwin 25.5.0 Apple Silicon";
export const ENTRYPOINT = "claude-desktop";
export const SESSION_FILES = 1206;
export const DISTINCT_MTIMES = 1090;
export const CLUSTER_COUNT = 114;
export const CLUSTER_EPOCH = 1787422837;
export const CLUSTER_LOCAL = "2026-08-22T21:20:37";
export const MEDIAN_SKEW_DAYS = 17;
export const MIN_SKEW_DAYS = 3;
export const MAX_SKEW_DAYS = 47;
export const OVER_SEVEN_DAYS = 93;
export const TAIL_COUNTS = Object.freeze({
  "last-prompt": 76,
  mode: 21,
  attachment: 10,
  "queue-operation": 4,
  user: 2,
  assistant: 1,
});
export const EXAMPLES = Object.freeze([
  Object.freeze({
    lastEvent: "2026-07-22T14:00:18Z",
    tail: "last-prompt",
    mtime: CLUSTER_LOCAL,
  }),
  Object.freeze({
    lastEvent: "2026-08-04T10:19:24Z",
    tail: "last-prompt",
    mtime: CLUSTER_LOCAL,
  }),
]);
export const HYPOTHESIS_NOTE =
  "The bulk-append-of-timestamp-free-metadata trigger is a labeled observation, not a proven cause.";
export const HUB_LINE =
  "20:50 gnomon: a shared mtime is not a hold. Score the gnomon or admit pointed.";
export const MARK = "20:50 / hermes catalog #94 / #90954";
export const PHRASE = "a shared mtime is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "gnomon",
  "collapsed",
  "mtime",
  "transcript",
  "bulk",
  "cast",
  "eclipsed",
  "spoiled",
  "banked",
  "rewrite",
  "shared",
  "trammel",
  "hunting",
  "traced",
]);

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

function blankTicket() {
  return {
    seed: "",
    issue: null,
    sharedMtime: null,
    clusterCount: null,
    timestampFreeTail: null,
    lastPromptTail: null,
    modeTail: null,
    closedTranscript: null,
    dateSkew: null,
    silentWrong: null,
    retentionTrap: null,
    lsLtLie: null,
    mtimePreserved: null,
    timestampRequired: null,
    lastEventDaysAgo: null,
    healthyDating: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedPointed();
}

export function seedPointed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    sharedMtime: false,
    clusterCount: 0,
    timestampFreeTail: false,
    lastPromptTail: false,
    modeTail: false,
    closedTranscript: false,
    dateSkew: false,
    silentWrong: false,
    retentionTrap: false,
    lsLtLie: false,
    mtimePreserved: true,
    timestampRequired: false,
    lastEventDaysAgo: 0,
    healthyDating: true,
    outputText:
      "mtime tracks last timestamped event; true shadow; healthy dating",
  };
}

export function seedCollapsed() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    ccd: CCD,
    latestPublished: LATEST_PUBLISHED,
    os: OS_NAME,
    entrypoint: ENTRYPOINT,
    sessionFiles: SESSION_FILES,
    distinctMtimes: DISTINCT_MTIMES,
    clusterCount: CLUSTER_COUNT,
    clusterEpoch: CLUSTER_EPOCH,
    clusterLocal: CLUSTER_LOCAL,
    medianSkewDays: MEDIAN_SKEW_DAYS,
    minSkewDays: MIN_SKEW_DAYS,
    maxSkewDays: MAX_SKEW_DAYS,
    overSevenDays: OVER_SEVEN_DAYS,
    tailCounts: { ...TAIL_COUNTS },
    examples: EXAMPLES.map((row) => ({ ...row })),
    hypothesis: HYPOTHESIS_NOTE,
    sharedMtime: true,
    timestampFreeTail: true,
    lastPromptTail: true,
    modeTail: true,
    closedTranscript: true,
    dateSkew: true,
    silentWrong: true,
    retentionTrap: true,
    lsLtLie: true,
    mtimePreserved: false,
    timestampRequired: false,
    lastEventDaysAgo: MEDIAN_SKEW_DAYS,
    healthyDating: false,
    sameClass: [...SAME_CLASS],
    outputText:
      "114 files share mtime epoch 1787422837 (2026-08-22T21:20:37 local) out of 1,206 session .jsonl; last-prompt and mode carry no timestamp field; median mtime-minus-last-event 17 days; closed transcripts were appended to in one bulk operation; ls -lt reports a burst on a day when no work happened; retention keyed on mtime preserves stale sessions; silent-wrong-output; nothing errors",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.gnomon && typeof src.gnomon === "object" && src.gnomon) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    sharedMtime: firstBool(
      nested.sharedMtime,
      nested.shared_mtime,
      nested.sharedSecond,
      src.sharedMtime,
    ),
    clusterCount: firstNum(
      nested.clusterCount,
      nested.cluster_count,
      src.clusterCount,
    ),
    timestampFreeTail: firstBool(
      nested.timestampFreeTail,
      nested.timestamp_free_tail,
      nested.timestampFree,
      nested.noTimestamp,
      nested.untimedTail,
      src.timestampFreeTail,
    ),
    lastPromptTail: firstBool(
      nested.lastPromptTail,
      nested.last_prompt_tail,
      src.lastPromptTail,
    ),
    modeTail: firstBool(nested.modeTail, nested.mode_tail, src.modeTail),
    closedTranscript: firstBool(
      nested.closedTranscript,
      nested.closed_transcript,
      src.closedTranscript,
    ),
    dateSkew: firstBool(
      nested.dateSkew,
      nested.date_skew,
      nested.dateSignal,
      nested.mtimeVsContent,
      src.dateSkew,
    ),
    silentWrong: firstBool(
      nested.silentWrong,
      nested.silent_wrong,
      src.silentWrong,
    ),
    retentionTrap: firstBool(
      nested.retentionTrap,
      nested.retention_trap,
      nested.retentionLie,
      src.retentionTrap,
    ),
    lsLtLie: firstBool(
      nested.lsLtLie,
      nested.ls_lt_lie,
      nested.archiveClock,
      src.lsLtLie,
    ),
    mtimePreserved: firstBool(
      nested.mtimePreserved,
      nested.mtime_preserved,
      src.mtimePreserved,
    ),
    timestampRequired: firstBool(
      nested.timestampRequired,
      nested.timestamp_required,
      src.timestampRequired,
    ),
    lastEventDaysAgo: firstNum(
      nested.lastEventDaysAgo,
      nested.last_event_days_ago,
      src.lastEventDaysAgo,
    ),
    healthyDating: firstBool(
      nested.healthyDating,
      nested.healthy_dating,
      src.healthyDating,
    ),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const missingCore =
    input.sharedMtime == null &&
    input.timestampFreeTail == null &&
    input.healthyDating == null &&
    input.mtimePreserved == null;
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && missingCore) {
    return { ...seedCollapsed(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && missingCore) {
    return { ...seedCollapsed(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && missingCore) {
    return { ...seedPointed(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const sharedSecond =
    row.sharedMtime === true ||
    /114 files|identical (filesystem )?mtime|share (one |a )?(identical )?mtime|same single second|shared identical mtime|shared-second/i.test(
      text,
    );
  const cluster114 =
    (row.clusterCount != null && row.clusterCount >= CLUSTER_COUNT) ||
    /114 files|cluster-114|cluster of 114/i.test(text);
  const noTimestamp =
    row.timestampFreeTail === true ||
    /no `?timestamp`? field|no-timestamp|carry (NO|no) timestamp/i.test(text);
  const lastPrompt =
    row.lastPromptTail === true || /last-prompt/i.test(text);
  const modeTail = row.modeTail === true || /mode ×21|mode records|tail.*\bmode\b/i.test(text);
  const untimedTail =
    noTimestamp ||
    modeTail ||
    /untimed-tail|untimed (last-prompt|mode|tail)/i.test(text);
  const closed =
    row.closedTranscript === true ||
    /already-closed|closed (session )?transcripts?/i.test(text);
  const dateSignal =
    row.dateSkew === true ||
    (row.lastEventDaysAgo != null && row.lastEventDaysAgo >= MIN_SKEW_DAYS) ||
    /median 17 days|mtime minus|mtime-minus-last-event|days after their last real event|date-signal/i.test(
      text,
    );
  const mtimeVsContent =
    dateSignal ||
    /mtime-vs-content|mtime vs (last event|content)|content's last (real |timestamped )?event/i.test(
      text,
    );
  const silentWrong =
    row.silentWrong === true ||
    /silent-wrong|nothing errors|wrong answer looks/i.test(text);
  const retentionLie =
    row.retentionTrap === true ||
    /retention policy|age out recent|preserve stale sessions|retention-lie/i.test(
      text,
    );
  const archiveClock =
    row.lsLtLie === true ||
    /ls -lt|burst of 114 sessions|archive-clock/i.test(text);
  const mtimePreserved =
    row.mtimePreserved === true ||
    /preserve(s|d)? (its )?mtime|writes to an already-closed transcript preserve/i.test(
      text,
    );
  const timestampRequired =
    row.timestampRequired === true ||
    /appended record carries a `?timestamp`?|timestamp-required|require timestamp/i.test(
      text,
    );
  const healthyDating =
    row.healthyDating === true ||
    /mtime tracks last timestamped event|true shadow|healthy dating/i.test(text);
  const bulkMtime =
    (sharedSecond && closed) ||
    /bulk (operation|rewrite|append|mtime)|appended to in one bulk/i.test(text);
  const collapsed =
    sharedSecond &&
    untimedTail &&
    closed &&
    dateSignal &&
    !mtimePreserved &&
    !timestampRequired &&
    !healthyDating;
  const pointed =
    (healthyDating || mtimePreserved || timestampRequired) &&
    !sharedSecond &&
    !dateSignal &&
    !collapsed;
  return {
    sharedSecond,
    cluster114,
    noTimestamp,
    lastPrompt,
    modeTail,
    untimedTail,
    closed,
    dateSignal,
    mtimeVsContent,
    silentWrong,
    retentionLie,
    archiveClock,
    mtimePreserved,
    timestampRequired,
    healthyDating,
    bulkMtime,
    collapsed,
    pointed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.collapsed) chips.push("collapsed");
  if (flags.pointed) chips.push("pointed");
  if (flags.bulkMtime && !flags.pointed) chips.push("bulk-mtime");
  if (flags.sharedSecond && !flags.pointed) chips.push("shared-second");
  if (flags.closed && !flags.pointed) chips.push("closed-transcript");
  if (flags.dateSignal && !flags.pointed) chips.push("date-signal");
  if (flags.untimedTail && !flags.pointed) chips.push("untimed-tail");
  if (flags.lastPrompt && !flags.pointed) chips.push("last-prompt");
  if (flags.silentWrong && !flags.pointed) chips.push("silent-wrong");
  if (flags.retentionLie && !flags.pointed) chips.push("retention-lie");
  if (flags.cluster114 && !flags.pointed) chips.push("cluster-114");
  if (flags.mtimeVsContent && !flags.pointed) chips.push("mtime-vs-content");
  if (flags.archiveClock && !flags.pointed) chips.push("archive-clock");
  if (flags.noTimestamp && !flags.pointed) chips.push("no-timestamp");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "pointed") {
    reasons.push(
      "mtime tracks last timestamped event; true shadow; healthy dating",
    );
    reasons.push("hold: this is a pointed shadow, not a collapsed dial");
  }
  if (flags.sharedSecond) {
    reasons.push(
      "114 files share one identical filesystem mtime — epoch 1787422837 (2026-08-22T21:20:37 local)",
    );
  }
  if (flags.bulkMtime) {
    reasons.push(
      "many long-closed transcripts were appended to in one bulk operation (observation, not a proven trigger)",
    );
  }
  if (flags.noTimestamp || flags.untimedTail) {
    reasons.push(
      "last-prompt and mode records carry no timestamp field — the write leaves no trace in content",
    );
  }
  if (flags.lastPrompt) {
    reasons.push("tail record type last-prompt ×76 of the 114-file cluster");
  }
  if (flags.closed) {
    reasons.push("writes land on already-closed session transcripts");
  }
  if (flags.dateSignal || flags.mtimeVsContent) {
    reasons.push(
      "mtime minus last timestamped record: min 3 days, median 17 days, max 47 days; 93 of 114 more than 7 days after last real event",
    );
  }
  if (flags.silentWrong) {
    reasons.push(
      "silent-wrong-output: nothing errors, and the wrong answer looks exactly like the right one",
    );
  }
  if (flags.retentionLie) {
    reasons.push(
      "a retention policy keyed on mtime will preserve stale sessions and can age out recent ones",
    );
  }
  if (flags.archiveClock) {
    reasons.push(
      "ls -lt reports a burst of 114 sessions on a day when no work happened, and hides the days work actually did happen",
    );
  }
  if (flags.cluster114) {
    reasons.push("largest cluster is 114 files at one identical second");
  }
  if (flags.mtimePreserved || flags.timestampRequired) {
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.collapsed) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags, chips) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.pointed) return "pointed";
  if (named === SEEDED_WORD || flags.collapsed) return "collapsed";
  if (VERDICTS.includes(named) && chips.includes(named) && named !== IDLE_WORD) {
    return named;
  }
  if (flags.collapsed) return "collapsed";
  if (flags.pointed) return "pointed";
  if (flags.archiveClock) return "archive-clock";
  if (flags.retentionLie) return "retention-lie";
  if (flags.silentWrong) return "silent-wrong";
  if (flags.mtimeVsContent) return "mtime-vs-content";
  if (flags.dateSignal) return "date-signal";
  if (flags.lastPrompt) return "last-prompt";
  if (flags.noTimestamp) return "no-timestamp";
  if (flags.untimedTail) return "untimed-tail";
  if (flags.bulkMtime) return "bulk-mtime";
  if (flags.cluster114) return "cluster-114";
  if (flags.sharedSecond) return "shared-second";
  if (flags.closed) return "closed-transcript";
  return "pointed";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "pointed";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    pointed: verdict === "pointed" || flags.pointed,
    collapsed: verdict === "collapsed" || flags.collapsed,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      dial: flags.sharedSecond
        ? "114 files share one identical mtime — one false noon"
        : "mtimes spread across the days work occurred",
      shadow: flags.dateSignal
        ? "mtime minus last timestamped event: median 17 days"
        : flags.healthyDating || flags.mtimePreserved
          ? "true shadow tracks last timestamped event"
          : "dating not yet scored",
      meridian: flags.noTimestamp || flags.untimedTail
        ? "appended last-prompt / mode carry no timestamp"
        : flags.timestampRequired
          ? "appended records carry a timestamp"
          : "content dating is intact",
      note: flags.collapsed
        ? "A shared mtime is not a hold. Score the gnomon or admit pointed. Bulk-append of timestamp-free metadata is a labeled observation, not a proven trigger."
        : flags.mtimePreserved || flags.timestampRequired
          ? CONTRAST_NOTE
          : "Pointed: mtime tracks last timestamped event; the shadow is true.",
    },
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 90954 || name === "90954") {
    return analyze(seedCollapsed());
  }
  if (name === IDLE_WORD || name === "pointed") {
    return analyze(seedPointed());
  }
  return analyze(seedPointed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.collapsed
        ? `collapsed gnomon #${FEATURED_ISSUE}: 114 closed transcripts share mtime 1787422837; last-prompt and mode carry no timestamp; median skew 17 days. ${HYPOTHESIS_NOTE}`
        : `pointed sundial. Idle word ${IDLE_WORD}. mtime tracks last timestamped event; the shadow is true.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
