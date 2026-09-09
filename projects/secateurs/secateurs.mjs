#!/usr/bin/env node
/**
 * Secateurs — garden bypass-shears / pruning booth.
 *
 * Educational diagnostic model for a published Read-tool defect:
 * Read of large instruction/rule files (CLAUDE.md companions,
 * .claude/rules, --append-system-prompt targets) should return the
 * whole file or make truncation unmistakable (structured
 * "showing lines X–Y of Z; use offset/limit"). Instead large files
 * can return silent partial content so guardrails in the unread tail
 * are shed while the agent proceeds as if the file were whole.
 * Documented 2,000-line default is not enforced (evidence: a
 * 65,800-character / 1,400-line file reads full with no offset/limit).
 *
 *   node secateurs.mjs data/sheared.json
 *   echo '{"seed":"sheared"}' | node secateurs.mjs
 *
 * Idle word is unshorn (HOLD: whole file, or showing lines X–Y of Z;
 * documented threshold honored or documented honestly; operator would
 * notice a missing tail).
 * Seeded word is sheared (#92979: silent partial; unread tail shed;
 * guardrail loss; no operator notice; 2000-line default not enforced).
 * Path word is secateured.
 *
 * Encoded from anthropics/claude-code#92979 issue body only.
 * Hypothesis (NON-BINDING): Read path lacks a fail-loud
 * truncation/EOF contract for instruction-class files, so partial
 * returns look complete. Invite verify against #92979 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unshorn",
  "sheared",
  "silent-partial",
  "unread-tail",
  "guardrail-loss",
  "no-operator-notice",
  "documented-2000-not-enforced",
  "full-read-1400",
  "lines-x-y-of-z",
  "offset-limit",
  "has-repro",
  "hold",
  "secateured",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "unshorn";
export const PATH_WORD = "secateured";
export const SEEDED_WORD = "sheared";
export const HOLD = Object.freeze(["unshorn", "hold"]);
export const RECOVER = Object.freeze(["lines-x-y-of-z", "offset-limit"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "unshorn" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "sheared",
  "unretracted",
  "emended",
  "palinoded",
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
  FORBIDDEN_IDLE.filter((name) => name !== "sheared"),
);

export const FEATURED_ISSUE = 92979;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92979";
export const TITLE =
  "Read tool silently returns partial content for large instruction/rule files; documented 2,000-line default not enforced";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "area:tools"]);
export const REPORTER = "UNIVAC-Colonel-Panic";
export const FILED_AT = "2026-09-09T02:55:37Z";
export const DOCUMENTED_LINE_DEFAULT = 2000;
export const EVIDENCE_CHARS = 65800;
export const EVIDENCE_LINES = 1400;
export const MARKER_EXAMPLE = "showing lines 1–2000 of 4800; use offset/limit";

export const COUSINS = Object.freeze([
  {
    issue: 6910,
    title: "Read does not limit itself to 2000 lines by default",
    state: "CLOSED",
    citeOnly: true,
    why: "token-cap error on huge files vs documented 2000-line default; auto-closed stale without a fix — cite only; do not clone",
  },
  {
    issue: 28783,
    title: "Read truncation causes agents to silently lose guardrails from instruction files",
    state: "CLOSED",
    citeOnly: true,
    why: "silent guardrail loss from Read truncation; auto-closed stale without a fix — cite only; do not clone",
  },
  {
    issue: 22699,
    title: "Size-aware file reading feature ask",
    state: "CLOSED",
    citeOnly: true,
    why: "size-aware file reading feature ask; closed — cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "rushlight",
  "clepsydra",
  "ephemera",
  "oubliette",
]);

/**
 * Published Read-snip walk from #92979 only. Facts from the issue body.
 */
export const SNIP_WALK = Object.freeze([
  {
    t: "evidence",
    event: "full-read-1400",
    wholeFile: true,
    documentedDefaultEnforced: false,
    offsetLimitUsed: false,
    lineCount: EVIDENCE_LINES,
    lineDefault: DOCUMENTED_LINE_DEFAULT,
    charCount: EVIDENCE_CHARS,
    silentPartial: false,
    unreadTail: false,
    guardrailLost: false,
    operatorNoticed: false,
    truncationMarked: false,
  },
  {
    t: "snip",
    event: "silent-partial",
    wholeFile: false,
    documentedDefaultEnforced: false,
    offsetLimitUsed: false,
    silentPartial: true,
    unreadTail: false,
    guardrailLost: false,
    operatorNoticed: false,
    truncationMarked: false,
    partialReturn: true,
    treatsAsWhole: false,
  },
  {
    t: "tail",
    event: "unread-tail",
    wholeFile: false,
    documentedDefaultEnforced: false,
    silentPartial: true,
    unreadTail: true,
    treatsAsWhole: true,
    guardrailLost: false,
    operatorNoticed: false,
    truncationMarked: false,
    partialReturn: true,
  },
  {
    t: "guard",
    event: "guardrail-loss",
    wholeFile: false,
    documentedDefaultEnforced: false,
    silentPartial: true,
    unreadTail: true,
    treatsAsWhole: true,
    guardrailLost: true,
    operatorNoticed: false,
    truncationMarked: false,
    partialReturn: true,
  },
  {
    t: "notice",
    event: "no-operator-notice",
    wholeFile: false,
    documentedDefaultEnforced: false,
    silentPartial: true,
    unreadTail: true,
    treatsAsWhole: true,
    guardrailLost: true,
    operatorNoticed: false,
    truncationMarked: false,
    partialReturn: true,
  },
]);

export function linesMarker(start = 1, end = 2000, total = 4800) {
  return `showing lines ${start}–${end} of ${total}; use offset/limit`;
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    wholeFile: true,
    truncationMarked: true,
    silentPartial: false,
    unreadTail: false,
    guardrailLost: false,
    operatorNoticed: true,
    documentedDefaultEnforced: true,
    treatsAsWhole: false,
    partialReturn: false,
    offsetLimitUsed: false,
    lineCount: EVIDENCE_LINES,
    lineDefault: DOCUMENTED_LINE_DEFAULT,
    charCount: EVIDENCE_CHARS,
    marker: linesMarker(),
  };
}

export function seedUnshorn() {
  return { ...emptyTicket() };
}

export function seedSheared() {
  return {
    seed: SEEDED_WORD,
    wholeFile: false,
    truncationMarked: false,
    silentPartial: true,
    unreadTail: true,
    guardrailLost: true,
    operatorNoticed: false,
    documentedDefaultEnforced: false,
    treatsAsWhole: true,
    partialReturn: true,
    offsetLimitUsed: false,
    fullRead1400: true,
    lineCount: EVIDENCE_LINES,
    lineDefault: DOCUMENTED_LINE_DEFAULT,
    charCount: EVIDENCE_CHARS,
    issue: FEATURED_ISSUE,
  };
}

export function seedSecateured() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    secateured: true,
    silentPartial: true,
    unreadTail: true,
    guardrailLost: true,
    operatorNoticed: false,
    truncationMarked: false,
    documentedDefaultEnforced: false,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      wholeFile: false,
      truncationMarked: false,
      silentPartial: false,
      unreadTail: false,
      guardrailLost: false,
      operatorNoticed: false,
      documentedDefaultEnforced: false,
      treatsAsWhole: false,
      partialReturn: false,
      offsetLimitUsed: false,
      fullRead1400: false,
      secateured: false,
      lineCount: null,
      lineDefault: DOCUMENTED_LINE_DEFAULT,
      charCount: null,
      marker: null,
    };
  }
  const silentPartial =
    raw.silentPartial === true ||
    (raw.partialReturn === true && raw.truncationMarked !== true);
  return {
    wholeFile: raw.wholeFile === true,
    truncationMarked:
      raw.truncationMarked === true || raw.structuredMarker === true,
    silentPartial,
    unreadTail: raw.unreadTail === true || raw.unreadPortion === true,
    guardrailLost:
      raw.guardrailLost === true || raw.guardrailLoss === true,
    operatorNoticed:
      raw.operatorNoticed === true || raw.operatorNotice === true,
    documentedDefaultEnforced: raw.documentedDefaultEnforced === true,
    treatsAsWhole:
      raw.treatsAsWhole === true || raw.partialAsWhole === true,
    partialReturn: raw.partialReturn === true || silentPartial,
    offsetLimitUsed: raw.offsetLimitUsed === true,
    fullRead1400:
      raw.fullRead1400 === true ||
      (Number(raw.lineCount) === EVIDENCE_LINES &&
        Number(raw.charCount) === EVIDENCE_CHARS &&
        raw.wholeFile === true &&
        raw.offsetLimitUsed !== true),
    secateured: raw.secateured === true,
    lineCount: raw.lineCount != null ? Number(raw.lineCount) : null,
    lineDefault:
      raw.lineDefault != null
        ? Number(raw.lineDefault)
        : DOCUMENTED_LINE_DEFAULT,
    charCount: raw.charCount != null ? Number(raw.charCount) : null,
    marker: raw.marker || raw.structuredMarkerText || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.wholeFile != null ||
        ticket.truncationMarked != null ||
        ticket.silentPartial != null ||
        ticket.unreadTail != null ||
        ticket.guardrailLost != null ||
        ticket.operatorNoticed != null ||
        ticket.documentedDefaultEnforced != null ||
        ticket.treatsAsWhole != null ||
        ticket.partialReturn != null ||
        ticket.secateured != null ||
        ticket.fullRead1400 != null ||
        ticket.event),
  );
}

function isUnshorn(row) {
  if (row.secateured) return false;
  if (row.silentPartial) return false;
  if (row.unreadTail && row.treatsAsWhole) return false;
  if (row.guardrailLost && !row.operatorNoticed) return false;
  const marked = row.truncationMarked === true;
  const whole = row.wholeFile === true && !row.silentPartial;
  const contractHonored = row.documentedDefaultEnforced === true || marked;
  return (whole || marked) && contractHonored && !row.unreadTail;
}

function isSheared(row) {
  if (row.wholeFile && row.truncationMarked && !row.silentPartial && !row.unreadTail) {
    return false;
  }
  if (row.silentPartial) return true;
  if (row.unreadTail && (row.treatsAsWhole || row.guardrailLost)) return true;
  if (row.partialReturn && !row.truncationMarked) return true;
  if (!row.documentedDefaultEnforced && !row.truncationMarked && row.fullRead1400) {
    return true;
  }
  return (
    row.guardrailLost &&
    !row.operatorNoticed &&
    (row.silentPartial || row.partialReturn || row.unreadTail)
  );
}

function isSecateured(row) {
  return row.secateured === true && !isUnshorn(row);
}

/**
 * Score one pruning seating against the Read-snip booth.
 * unshorn: whole file, or showing lines X–Y of Z; documented threshold honored.
 * sheared: silent tip-cut; unread tail believed whole; guardrails shed.
 * secateured: named path — a secateurs snip without an audible mark.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isSecateured(row)) {
    verdict = "secateured";
  } else if (isSheared(row)) {
    verdict = "sheared";
  } else if (isUnshorn(row)) {
    verdict = "unshorn";
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
    unshorn: verdict === "unshorn",
    sheared: verdict === "sheared" || verdict === SEEDED_WORD,
    secateured: verdict === "secateured" || verdict === PATH_WORD,
    wholeFile: row.wholeFile,
    truncationMarked: row.truncationMarked,
    silentPartial: row.silentPartial,
    unreadTail: row.unreadTail,
    guardrailLost: row.guardrailLost,
    operatorNoticed: row.operatorNoticed,
    documentedDefaultEnforced: row.documentedDefaultEnforced,
    treatsAsWhole: row.treatsAsWhole,
    partialReturn: row.partialReturn,
    offsetLimitUsed: row.offsetLimitUsed,
    fullRead1400: row.fullRead1400,
    lineCount: row.lineCount,
    lineDefault: row.lineDefault,
    charCount: row.charCount,
    marker: row.marker,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unshorn" : "score sheared",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : SNIP_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const sheared = scored.filter((row) => row.verdict === "sheared");
  const secateured = scored.filter((row) => row.verdict === "secateured");
  const unshorn = scored.filter((row) => row.verdict === "unshorn");
  const headline =
    scored.find((row) => row.event === "guardrail-loss") ||
    scored.find((row) => row.event === "unread-tail") ||
    scored.find((row) => row.event === "no-operator-notice") ||
    scored.find((row) => row.event === "silent-partial") ||
    sheared[sheared.length - 1];
  let verdict = "unshorn";
  if (sheared.length) verdict = "sheared";
  else if (secateured.length && !unshorn.length) verdict = "secateured";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    shearedCount: sheared.length,
    secateuredCount: secateured.length,
    unshornCount: unshorn.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unshorn" : "score sheared",
    note: headline
      ? "Read of large instruction/rule files can return a silent partial; unread tail believed whole; documented 2,000-line default not enforced"
      : "published Read-snip walk scored against unshorn vs sheared",
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
    seeded !== "unshorn" &&
    seeded !== "sheared" &&
    seeded !== "secateured" &&
    ticket.wholeFile == null &&
    ticket.silentPartial == null &&
    ticket.unreadTail == null &&
    ticket.guardrailLost == null &&
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
    markerExample: MARKER_EXAMPLE,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.silentPartial ? "snip=silent" : "snip=marked",
    result.unreadTail ? "tail=unread" : "tail=whole",
    result.guardrailLost ? "guard=lost" : "guard=kept",
    result.operatorNoticed ? "notice=loud" : "notice=none",
    result.documentedDefaultEnforced ? "cap=enforced" : "cap=unenforced",
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
      documentedLineDefault: DOCUMENTED_LINE_DEFAULT,
      evidenceChars: EVIDENCE_CHARS,
      evidenceLines: EVIDENCE_LINES,
      markerExample: MARKER_EXAMPLE,
      cousins: COUSINS.map((row) => row.issue),
      asks: [
        "unmistakable structured truncation marker (showing lines X–Y of Z; use offset/limit)",
        "enforce the documented 2,000-line default, or document the actual threshold",
        "optional setting to raise the inline-read ceiling",
      ],
      hypothesis:
        "Read path lacks a fail-loud truncation/EOF contract for instruction-class files, so partial returns look complete",
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
