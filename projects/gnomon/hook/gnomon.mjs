#!/usr/bin/env node
/**
 * Gnomon — observatory / sundial-terrace classifier.
 * A shared mtime is not a hold. Score the gnomon or admit cast.
 *
 *   echo '{"sharedMtime":true,"timestampFreeTail":true}' | node gnomon.mjs
 *   node gnomon.mjs ticket.json
 *
 * Idle word is cast (shadow cast matches last timestamped event;
 * healthy dating). Seeded state is eclipsed / #90954.
 * NEVER idle as "gnomon", "eclipsed", "mtime", "transcript",
 * "bulk", "rewrite", "shared", "spoiled", "banked", "trammel",
 * "hunting", "traced", "soundpost", "flong", "bulla".
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
 * Same-class cite (different mechanism, same family of
 * session-file integrity): #90932 display stitch; #90931
 * Desktop fork ENOTDIR on symlink project dir; #90955 version
 * signal skew (NOT mtime).
 * NOT Spoil, Trammel, Soundpost, Flong, Bulla, Trompe, Davy,
 * Moviola, Clepsydra, Palimpsest, Almanac, Datum, Tally,
 * Cenotaph.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "eclipsed",
  "cast",
  "shared-mtime",
  "bulk-rewrite",
  "timestamp-free",
  "last-prompt",
  "mode-tail",
  "closed-transcript",
  "date-skew",
  "silent-wrong",
  "retention-trap",
  "ls-lt-lie",
]);
export const IDLE_WORD = "cast";
export const SEEDED_WORD = "eclipsed";
export const HOLD_VERDICTS = Object.freeze(["cast"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "cast"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90954;
export const PRIMARY_ISSUES = Object.freeze([90954]);
export const SAME_CLASS = Object.freeze([90932, 90931, 90955]);
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
  "20:50 gnomon: a shared mtime is not a hold. Score the gnomon or admit cast.";
export const MARK = "20:50 / hermes catalog #94 / #90954";
export const PHRASE = "a shared mtime is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "gnomon",
  "eclipsed",
  "mtime",
  "transcript",
  "bulk",
  "rewrite",
  "shared",
  "spoiled",
  "banked",
  "trammel",
  "hunting",
  "traced",
  "soundpost",
  "flong",
  "bulla",
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
  return seedCast();
}

export function seedCast() {
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
      "mtime matches last timestamped event; shadow cast matches last event; healthy dating",
  };
}

export function seedEclipsed() {
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
    dateSkew: firstBool(nested.dateSkew, nested.date_skew, src.dateSkew),
    silentWrong: firstBool(
      nested.silentWrong,
      nested.silent_wrong,
      src.silentWrong,
    ),
    retentionTrap: firstBool(
      nested.retentionTrap,
      nested.retention_trap,
      src.retentionTrap,
    ),
    lsLtLie: firstBool(nested.lsLtLie, nested.ls_lt_lie, src.lsLtLie),
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
    return { ...seedEclipsed(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && missingCore) {
    return { ...seedEclipsed(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && missingCore) {
    return { ...seedCast(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const sharedMtime =
    row.sharedMtime === true ||
    /114 files|identical (filesystem )?mtime|share (one |a )?(identical )?mtime|same single second|shared identical mtime/i.test(
      text,
    );
  const cluster =
    (row.clusterCount != null && row.clusterCount >= CLUSTER_COUNT) ||
    /114 files/i.test(text);
  const timestampFree =
    row.timestampFreeTail === true ||
    /no `?timestamp`? field|timestamp-free|carry (NO|no) timestamp/i.test(text);
  const lastPrompt =
    row.lastPromptTail === true || /last-prompt/i.test(text);
  const modeTail = row.modeTail === true || /mode ×21|mode records|tail.*\bmode\b/i.test(text);
  const closed =
    row.closedTranscript === true ||
    /already-closed|closed (session )?transcripts?/i.test(text);
  const dateSkew =
    row.dateSkew === true ||
    (row.lastEventDaysAgo != null && row.lastEventDaysAgo >= MIN_SKEW_DAYS) ||
    /median 17 days|mtime minus|mtime-minus-last-event|days after their last real event/i.test(
      text,
    );
  const silentWrong =
    row.silentWrong === true ||
    /silent-wrong|nothing errors|wrong answer looks/i.test(text);
  const retentionTrap =
    row.retentionTrap === true ||
    /retention policy|age out recent|preserve stale sessions/i.test(text);
  const lsLtLie =
    row.lsLtLie === true ||
    /ls -lt|burst of 114 sessions/i.test(text);
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
    /mtime matches last timestamped event|shadow cast matches last event|healthy dating/i.test(
      text,
    );
  const bulkRewrite =
    (sharedMtime && closed) ||
    /bulk (operation|rewrite|append)|appended to in one bulk/i.test(text);
  const eclipsed =
    sharedMtime &&
    timestampFree &&
    closed &&
    dateSkew &&
    !mtimePreserved &&
    !timestampRequired &&
    !healthyDating;
  const cast =
    (healthyDating || mtimePreserved || timestampRequired) &&
    !sharedMtime &&
    !dateSkew &&
    !eclipsed;
  return {
    sharedMtime,
    cluster,
    timestampFree,
    lastPrompt,
    modeTail,
    closed,
    dateSkew,
    silentWrong,
    retentionTrap,
    lsLtLie,
    mtimePreserved,
    timestampRequired,
    healthyDating,
    bulkRewrite,
    eclipsed,
    cast,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.eclipsed) chips.push("eclipsed");
  if (flags.cast) chips.push("cast");
  if (flags.sharedMtime && !flags.cast) chips.push("shared-mtime");
  if (flags.bulkRewrite && !flags.cast) chips.push("bulk-rewrite");
  if (flags.timestampFree && !flags.cast) chips.push("timestamp-free");
  if (flags.lastPrompt && !flags.cast) chips.push("last-prompt");
  if (flags.modeTail && !flags.cast) chips.push("mode-tail");
  if (flags.closed && !flags.cast) chips.push("closed-transcript");
  if (flags.dateSkew && !flags.cast) chips.push("date-skew");
  if (flags.silentWrong && !flags.cast) chips.push("silent-wrong");
  if (flags.retentionTrap && !flags.cast) chips.push("retention-trap");
  if (flags.lsLtLie && !flags.cast) chips.push("ls-lt-lie");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "cast") {
    reasons.push(
      "mtime matches last timestamped event; shadow cast matches last event; healthy dating",
    );
    reasons.push("hold: this is a cast shadow, not an eclipsed dial");
  }
  if (flags.sharedMtime) {
    reasons.push(
      "114 files share one identical filesystem mtime — epoch 1787422837 (2026-08-22T21:20:37 local)",
    );
  }
  if (flags.bulkRewrite) {
    reasons.push(
      "many long-closed transcripts were appended to in one bulk operation (observation, not a proven trigger)",
    );
  }
  if (flags.timestampFree) {
    reasons.push(
      "last-prompt and mode records carry no timestamp field — the write leaves no trace in content",
    );
  }
  if (flags.lastPrompt) {
    reasons.push("tail record type last-prompt ×76 of the 114-file cluster");
  }
  if (flags.modeTail) {
    reasons.push("tail record type mode ×21 of the 114-file cluster");
  }
  if (flags.closed) {
    reasons.push("writes land on already-closed session transcripts");
  }
  if (flags.dateSkew) {
    reasons.push(
      "mtime minus last timestamped record: min 3 days, median 17 days, max 47 days; 93 of 114 more than 7 days after last real event",
    );
  }
  if (flags.silentWrong) {
    reasons.push(
      "silent-wrong-output: nothing errors, and the wrong answer looks exactly like the right one",
    );
  }
  if (flags.retentionTrap) {
    reasons.push(
      "a retention policy keyed on mtime will preserve stale sessions and can age out recent ones",
    );
  }
  if (flags.lsLtLie) {
    reasons.push(
      "ls -lt reports a burst of 114 sessions on a day when no work happened, and hides the days work actually did happen",
    );
  }
  if (flags.mtimePreserved || flags.timestampRequired) {
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.eclipsed) {
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
  if (named === IDLE_WORD && flags.cast) return "cast";
  if (named === SEEDED_WORD || flags.eclipsed) return "eclipsed";
  if (VERDICTS.includes(named) && chips.includes(named) && named !== IDLE_WORD) {
    return named;
  }
  if (flags.eclipsed) return "eclipsed";
  if (flags.cast) return "cast";
  if (flags.lsLtLie) return "ls-lt-lie";
  if (flags.retentionTrap) return "retention-trap";
  if (flags.silentWrong) return "silent-wrong";
  if (flags.dateSkew) return "date-skew";
  if (flags.lastPrompt) return "last-prompt";
  if (flags.modeTail) return "mode-tail";
  if (flags.timestampFree) return "timestamp-free";
  if (flags.bulkRewrite) return "bulk-rewrite";
  if (flags.sharedMtime) return "shared-mtime";
  if (flags.closed) return "closed-transcript";
  return "cast";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "cast";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    cast: verdict === "cast" || flags.cast,
    eclipsed: verdict === "eclipsed" || flags.eclipsed,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      dial: flags.sharedMtime
        ? "114 files share one identical mtime — the gnomon casts one false noon"
        : "mtimes spread across the days work occurred",
      shadow: flags.dateSkew
        ? "mtime minus last timestamped event: median 17 days"
        : flags.healthyDating || flags.mtimePreserved
          ? "shadow cast matches last timestamped event"
          : "dating not yet scored",
      meridian: flags.timestampFree
        ? "appended last-prompt / mode carry no timestamp"
        : flags.timestampRequired
          ? "appended records carry a timestamp"
          : "content dating is intact",
      note: flags.eclipsed
        ? "A shared mtime is not a hold. Score the gnomon or admit cast. Bulk-append of timestamp-free metadata is a labeled observation, not a proven trigger."
        : flags.mtimePreserved || flags.timestampRequired
          ? CONTRAST_NOTE
          : "Cast: mtime matches last timestamped event; the shadow is true.",
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
    return analyze(seedEclipsed());
  }
  if (name === IDLE_WORD || name === "cast") {
    return analyze(seedCast());
  }
  return analyze(seedCast());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.eclipsed
        ? `eclipsed gnomon #${FEATURED_ISSUE}: 114 closed transcripts share mtime 1787422837; last-prompt and mode carry no timestamp; median skew 17 days. ${HYPOTHESIS_NOTE}`
        : `cast gnomon. Idle word ${IDLE_WORD}. mtime matches last timestamped event; shadow is true.`,
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
