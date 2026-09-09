#!/usr/bin/env node
/**
 * Palinode — scriptorium retract / palinode booth.
 *
 * Educational diagnostic model for a published auto-memory overflow:
 * MEMORY.md should keep newest corrections emended (overflow sheds
 * oldest / top). Instead overflow truncates from the bottom, so
 * newest supersessions are shed unretracted while the superseded
 * claim stays loaded and authoritative.
 *
 *   node palinode.mjs data/unretracted.json
 *   echo '{"seed":"unretracted"}' | node palinode.mjs
 *
 * Idle word is emended (HOLD: truncate from the top / validate on
 * write / newest corrections retained; budget visible; frontmatter
 * well-formed).
 * Seeded word is unretracted (#92998: append succeeds past cap;
 * bottom truncation discards newest supersessions).
 * Path word is palinoded.
 *
 * Encoded from anthropics/claude-code#92998 issue body only.
 * Hypothesis (NON-BINDING): load/truncate path treats MEMORY.md as
 * a bottom-capped append log without write-time budget checks, so
 * newest lines are the first discarded. Invite verify against
 * #92998 text only. Do NOT claim a root cause in Claude Code source
 * you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "emended",
  "unretracted",
  "bottom-truncate",
  "newest-discarded",
  "supersession-lost",
  "write-reports-success",
  "later-session-warning",
  "byte-cap-25k",
  "line-cap-200",
  "age-prune-zero",
  "frontmatter-lost",
  "truncate-from-top",
  "budget-surface",
  "has-repro",
  "hold",
  "palinoded",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
]);

export const IDLE_WORD = "emended";
export const PATH_WORD = "palinoded";
export const SEEDED_WORD = "unretracted";
export const HOLD = Object.freeze(["emended", "hold"]);
export const RECOVER = Object.freeze(["truncate-from-top", "budget-surface"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "emended" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "unretracted",
  "ephemeral",
  "passable",
  "admitted",
  "deeded",
  "collated",
  "stereotyped",
  "voided",
  "rebound",
  "fouled",
  "cold",
  "banked",
  "parked",
  "confirmed",
  "loosed",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
  "ferruled",
  "interlocked",
  "shibbolethed",
  "homesteaded",
  "epitaphed",
  "miraged",
  "clung",
  "escheated",
  "rewritten",
  "intact",
  "laden",
  "shed",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "unretracted"),
);

export const FEATURED_ISSUE = 92998;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92998";
export const TITLE =
  "Auto-memory: MEMORY.md overflow silently discards the NEWEST entries, so corrections are lost while the text they correct stays loaded";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "area:core", "memory"]);
export const REPORTER = "No-Smoke";
export const FILED_AT = "2026-09-09T04:47:31Z";
export const LINE_CAP = 200;
export const BYTE_CAP = 25000;
export const SILO_MEMORIES = 199;
export const SILO_LINES = 201;
export const AGE_CURRENT_MONTH = 96;
export const AGE_PREVIOUS_MONTH = 91;
export const AGE_OLDER_THAN_5_WEEKS = 12;
export const AGE_PRUNE_ELIGIBLE = 0;
export const AGE_PRUNE_FLOOR_DAYS = 30;
export const BUDGET_EXAMPLE = "MEMORY.md: 195/200 lines, 22.4k/25k bytes";
export const LADDER = Object.freeze([
  Object.freeze({ hookChars: 200, memories: 82, lines: 87, bytes: 22744 }),
  Object.freeze({ hookChars: 110, memories: 108, lines: 113, bytes: 22974 }),
  Object.freeze({ hookChars: 90, memories: 118, lines: 123, bytes: 22841 }),
  Object.freeze({ hookChars: 60, memories: 139, lines: 144, bytes: 22863 }),
  Object.freeze({ hookChars: 30, memories: 170, lines: 175, bytes: 22938 }),
  Object.freeze({ hookChars: 18, memories: 185, lines: 190, bytes: 22753 }),
  Object.freeze({ hookChars: 0, memories: 185, lines: 190, bytes: 18514 }),
]);

export const COUSINS = Object.freeze([
  {
    issue: 25006,
    title: "docs/feature 200-line hard limit",
    state: "CLOSED",
    citeOnly: true,
    why: "docs gap from #25006 is fixed (200-line load documented); silent write-path failure is not — cite only; do not clone",
  },
  {
    issue: 33143,
    title: "remove arbitrary 200-line limit",
    state: "CLOSED",
    citeOnly: true,
    why: "closed by inactivity; cite only; do not clone",
  },
  {
    issue: 38452,
    title: "increase MEMORY.md line limit",
    state: "CLOSED",
    citeOnly: true,
    why: "closed by inactivity; cite only; do not clone",
  },
  {
    issue: 39811,
    title: "entries silently dropped past 200 lines, no write warning",
    state: "CLOSED",
    citeOnly: true,
    why: "closed by inactivity; cite only; do not clone",
  },
  {
    issue: 57574,
    title: "silently truncated at ~25KB; recent rules lost",
    state: "CLOSED",
    citeOnly: true,
    why: "closed by inactivity; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "oxbow",
  "recension",
  "setoff",
  "palimpsest",
  "ephemera",
  "lethe",
  "codicil",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "epitaph",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
]);

/**
 * Published retract walk from #92998 only. Facts from the issue body.
 */
export const RETRACT_WALK = Object.freeze([
  {
    t: "append",
    event: "append-past-cap",
    truncateFrom: "bottom",
    appendSuccess: true,
    writeWarned: false,
    lineCount: SILO_LINES,
    lineCap: LINE_CAP,
    newestDiscarded: false,
    supersessionLost: false,
    supersededLoaded: true,
  },
  {
    t: "truncate",
    event: "bottom-truncate",
    truncateFrom: "bottom",
    appendSuccess: true,
    writeWarned: false,
    lineCount: SILO_LINES,
    lineCap: LINE_CAP,
    newestDiscarded: true,
    supersessionLost: false,
    supersededLoaded: true,
  },
  {
    t: "discard",
    event: "newest-discarded",
    truncateFrom: "bottom",
    appendSuccess: true,
    writeWarned: false,
    newestDiscarded: true,
    newestRetained: false,
    supersessionLost: true,
    supersededLoaded: true,
  },
  {
    t: "supersede",
    event: "supersession-lost",
    truncateFrom: "bottom",
    appendSuccess: true,
    writeWarned: false,
    newestDiscarded: true,
    newestRetained: false,
    supersessionLost: true,
    supersededLoaded: true,
    laterSessionWarning: false,
  },
  {
    t: "later",
    event: "later-session-warning",
    truncateFrom: "bottom",
    appendSuccess: true,
    writeWarned: false,
    newestDiscarded: true,
    newestRetained: false,
    supersessionLost: true,
    supersededLoaded: true,
    laterSessionWarning: true,
    agePruneEligible: AGE_PRUNE_ELIGIBLE,
  },
]);

export function budgetLine(
  lines = "195/200",
  bytes = "22.4k/25k",
) {
  return `MEMORY.md: ${lines} lines, ${bytes} bytes`;
}

export function byteCapBindsFirst(ladder = LADDER) {
  return ladder
    .filter((row) => row.hookChars > 0)
    .every((row) => row.lines < LINE_CAP && row.bytes >= 22700);
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    truncateFrom: "top",
    newestRetained: true,
    newestDiscarded: false,
    supersessionLost: false,
    supersededLoaded: false,
    appendSuccess: true,
    writeWarned: true,
    writeReportsSuccess: false,
    laterSessionWarning: false,
    budgetSurfaced: true,
    frontmatterPresent: true,
    frontmatterLost: false,
    lineCount: LINE_CAP,
    lineCap: LINE_CAP,
    byteCount: 22000,
    byteCap: BYTE_CAP,
    agePruneEligible: AGE_PRUNE_ELIGIBLE,
    byteCapBindsFirst: true,
  };
}

export function seedEmended() {
  return { ...emptyTicket() };
}

export function seedUnretracted() {
  return {
    seed: SEEDED_WORD,
    truncateFrom: "bottom",
    newestRetained: false,
    newestDiscarded: true,
    supersessionLost: true,
    supersededLoaded: true,
    appendSuccess: true,
    writeWarned: false,
    writeReportsSuccess: true,
    laterSessionWarning: true,
    budgetSurfaced: false,
    frontmatterPresent: true,
    frontmatterLost: false,
    lineCount: SILO_LINES,
    lineCap: LINE_CAP,
    byteCount: BYTE_CAP,
    byteCap: BYTE_CAP,
    memories: SILO_MEMORIES,
    agePruneEligible: AGE_PRUNE_ELIGIBLE,
    byteCapBindsFirst: true,
    issue: FEATURED_ISSUE,
  };
}

export function seedPalinoded() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    truncateFrom: "bottom",
    newestDiscarded: true,
    supersessionLost: true,
    supersededLoaded: true,
    appendSuccess: true,
    writeWarned: false,
    palinoded: true,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      truncateFrom: null,
      newestRetained: false,
      newestDiscarded: false,
      supersessionLost: false,
      supersededLoaded: false,
      appendSuccess: false,
      writeWarned: false,
      writeReportsSuccess: false,
      laterSessionWarning: false,
      budgetSurfaced: false,
      frontmatterPresent: false,
      frontmatterLost: false,
      lineCount: null,
      lineCap: LINE_CAP,
      byteCount: null,
      byteCap: BYTE_CAP,
      memories: null,
      agePruneEligible: null,
      byteCapBindsFirst: false,
      palinoded: false,
    };
  }
  const truncateFrom =
    raw.truncateFrom ||
    (raw.bottomTruncate === true
      ? "bottom"
      : raw.topTruncate === true || raw.truncateFromTop === true
        ? "top"
        : null);
  return {
    truncateFrom,
    newestRetained: raw.newestRetained === true,
    newestDiscarded:
      raw.newestDiscarded === true || raw.newestLost === true,
    supersessionLost:
      raw.supersessionLost === true || raw.correctionLost === true,
    supersededLoaded:
      raw.supersededLoaded === true || raw.olderAuthoritative === true,
    appendSuccess:
      raw.appendSuccess === true || raw.writeReportsSuccess === true,
    writeWarned: raw.writeWarned === true || raw.validateOnWrite === true,
    writeReportsSuccess:
      raw.writeReportsSuccess === true ||
      (raw.appendSuccess === true && raw.writeWarned !== true),
    laterSessionWarning: raw.laterSessionWarning === true,
    budgetSurfaced: raw.budgetSurfaced === true,
    frontmatterPresent: raw.frontmatterPresent === true,
    frontmatterLost:
      raw.frontmatterLost === true || raw.frontmatterPresent === false,
    lineCount: raw.lineCount != null ? Number(raw.lineCount) : null,
    lineCap: raw.lineCap != null ? Number(raw.lineCap) : LINE_CAP,
    byteCount: raw.byteCount != null ? Number(raw.byteCount) : null,
    byteCap: raw.byteCap != null ? Number(raw.byteCap) : BYTE_CAP,
    memories: raw.memories != null ? Number(raw.memories) : null,
    agePruneEligible:
      raw.agePruneEligible != null ? Number(raw.agePruneEligible) : null,
    byteCapBindsFirst: raw.byteCapBindsFirst === true,
    palinoded: raw.palinoded === true,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.truncateFrom != null ||
        ticket.bottomTruncate != null ||
        ticket.topTruncate != null ||
        ticket.newestRetained != null ||
        ticket.newestDiscarded != null ||
        ticket.supersessionLost != null ||
        ticket.supersededLoaded != null ||
        ticket.appendSuccess != null ||
        ticket.writeWarned != null ||
        ticket.writeReportsSuccess != null ||
        ticket.laterSessionWarning != null ||
        ticket.budgetSurfaced != null ||
        ticket.frontmatterLost != null ||
        ticket.frontmatterPresent != null ||
        ticket.lineCount != null ||
        ticket.palinoded != null ||
        ticket.event),
  );
}

function isEmended(row) {
  if (row.palinoded) return false;
  if (row.truncateFrom === "bottom" && row.newestDiscarded) return false;
  if (row.supersessionLost && row.supersededLoaded) return false;
  return (
    (row.truncateFrom === "top" || row.newestRetained) &&
    row.newestRetained &&
    !row.newestDiscarded &&
    !row.supersessionLost
  );
}

function isUnretracted(row) {
  if (row.newestRetained && row.truncateFrom === "top") return false;
  if (
    row.truncateFrom === "bottom" &&
    (row.appendSuccess || row.writeReportsSuccess) &&
    !row.newestRetained
  ) {
    return true;
  }
  return (
    (row.newestDiscarded || row.supersessionLost) &&
    row.supersededLoaded &&
    (row.appendSuccess || row.writeReportsSuccess)
  );
}

function isPalinoded(row) {
  return row.palinoded === true && !isEmended(row);
}

/**
 * Score one retract seating against the MEMORY.md palinode.
 * emended: truncate from the top; newest corrections retained.
 * unretracted: bottom truncation sheds newest supersessions.
 * palinoded: named path — a palinode that sheds the newest retraction.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isPalinoded(row)) {
    verdict = "palinoded";
  } else if (isUnretracted(row)) {
    verdict = "unretracted";
  } else if (isEmended(row)) {
    verdict = "emended";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    emended: verdict === "emended",
    unretracted: verdict === "unretracted" || verdict === SEEDED_WORD,
    palinoded: verdict === "palinoded" || verdict === PATH_WORD,
    truncateFrom: row.truncateFrom,
    newestRetained: row.newestRetained,
    newestDiscarded: row.newestDiscarded,
    supersessionLost: row.supersessionLost,
    supersededLoaded: row.supersededLoaded,
    appendSuccess: row.appendSuccess,
    writeWarned: row.writeWarned,
    writeReportsSuccess: row.writeReportsSuccess,
    laterSessionWarning: row.laterSessionWarning,
    budgetSurfaced: row.budgetSurfaced,
    frontmatterPresent: row.frontmatterPresent,
    frontmatterLost: row.frontmatterLost,
    lineCount: row.lineCount,
    lineCap: row.lineCap,
    byteCount: row.byteCount,
    byteCap: row.byteCap,
    memories: row.memories,
    agePruneEligible: row.agePruneEligible,
    byteCapBindsFirst: row.byteCapBindsFirst,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit emended" : "score unretracted",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : RETRACT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const unretracted = scored.filter((row) => row.verdict === "unretracted");
  const palinoded = scored.filter((row) => row.verdict === "palinoded");
  const emended = scored.filter((row) => row.verdict === "emended");
  const headline =
    scored.find((row) => row.event === "supersession-lost") ||
    scored.find((row) => row.event === "newest-discarded") ||
    scored.find((row) => row.event === "later-session-warning") ||
    unretracted[unretracted.length - 1];
  let verdict = "emended";
  if (unretracted.length) verdict = "unretracted";
  else if (palinoded.length && !emended.length) verdict = "palinoded";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    unretractedCount: unretracted.length,
    palinodedCount: palinoded.length,
    emendedCount: emended.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit emended" : "score unretracted",
    note: headline
      ? "MEMORY.md overflow truncates from the bottom; newest supersessions are shed unretracted while the superseded claim stays loaded"
      : "published MEMORY.md retract walk scored against emended vs unretracted",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "emended" &&
    seeded !== "unretracted" &&
    seeded !== "palinoded" &&
    ticket.truncateFrom == null &&
    ticket.newestDiscarded == null &&
    ticket.supersessionLost == null &&
    ticket.appendSuccess == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    budgetLine: budgetLine(),
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.truncateFrom === "bottom" ? "cut=bottom" : "cut=top",
    result.newestDiscarded ? "newest=shed" : "newest=kept",
    result.supersessionLost ? "retract=lost" : "retract=kept",
    result.appendSuccess && !result.writeWarned ? "write=ok-silent" : "write=checked",
    result.laterSessionWarning ? "warn=later" : "warn=now",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      reporter: REPORTER,
      filedAt: FILED_AT,
      lineCap: LINE_CAP,
      byteCap: BYTE_CAP,
      siloMemories: SILO_MEMORIES,
      siloLines: SILO_LINES,
      ageCurrentMonth: AGE_CURRENT_MONTH,
      agePreviousMonth: AGE_PREVIOUS_MONTH,
      ageOlderThan5Weeks: AGE_OLDER_THAN_5_WEEKS,
      agePruneEligible: AGE_PRUNE_ELIGIBLE,
      agePruneFloorDays: AGE_PRUNE_FLOOR_DAYS,
      budgetExample: BUDGET_EXAMPLE,
      ladder: LADDER.map((row) => ({ ...row })),
      cousins: COUSINS.map((row) => row.issue),
      asks: [
        "truncate from the top not the bottom",
        "validate/warn on write past cap",
        "surface budget after write",
        "well-formedness check on memory files",
      ],
      hypothesis:
        "load/truncate path treats MEMORY.md as a bottom-capped append log without write-time budget checks, so newest lines are the first discarded",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
