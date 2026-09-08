#!/usr/bin/env node
/**
 * Recension — scriptorium / textual-criticism collation desk.
 *
 * Educational timing/hash/witness model for a published auto-compact
 * defect: after auto-compaction, CLAUDE.md / MEMORY.md re-injected
 * into context is the last-user-prompt snapshot, not the on-disk
 * file. Disk is consulted only at the next user prompt.
 *
 *   node recension.mjs data/stereotyped.json
 *   echo '{"seed":"stereotyped"}' | node recension.mjs
 *
 * Idle word is collated (HOLD: at auto-compact, instruction files
 * re-read from disk and injected; matches the exemplar).
 * Path word is stereotyped (auto-compact reprints the last-prompt
 * witness; disk ignored until the next user prompt).
 * Seeded late-correct word is emended (changed:true reason:compaction
 * refresh at the next user prompt — correct but late).
 *
 * Encoded from anthropics/claude-code#92949 issue body only.
 * Hypothesis (NON-BINDING): auto-compact writes the instructions
 * attachment from an in-memory last-prompt snapshot; disk re-read
 * is deferred to the next user prompt. Invite verify against
 * #92949 text only. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop hooks.
 * No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "collated",
  "stereotyped",
  "emended",
  "compact-boundary",
  "last-prompt-witness",
  "disk-exemplar",
  "late-refresh",
  "user-level",
  "auto-memory",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "collated";
export const PATH_WORD = "stereotyped";
export const SEEDED_WORD = "emended";
export const HOLD = Object.freeze(["collated"]);
export const RECOVER = Object.freeze(["emended", "late-refresh"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "collated"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "confirmed",
  "loosed",
  "banked",
  "intact",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
]);
export const FORBIDDEN_SEED = Object.freeze([
  "miraged",
  "clung",
  "rewritten",
  "fouled",
  "relisted",
  "regranted",
  "misbound",
  "escheated",
]);

export const FEATURED_ISSUE = 92949;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92949";
export const TITLE =
  "[BUG] Auto-compaction re-injects the CLAUDE.md/MEMORY.md copy from the last user prompt, not the on-disk file; disk re-read only happens at the next prompt";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:core",
  "memory",
]);
export const VERSION_FROM = "2.1.260";
export const VERSION_TO = "2.1.261";
export const OS_NAME = "macOS (Darwin 25.4)";
export const SURFACE = "desktop Code tab";
export const MODEL = "claude-fable-5-1";
export const REPORTER = "openaidachenguo000-ship-it";
export const FILED_AT = "2026-09-08T23:04:10Z";
export const AUTO_COMPACT_WINDOW = 300000;
export const AUTO_COMPACT_COUNT = 5;
export const USER_LEVEL_STALE_CHARS = 3060;
export const USER_LEVEL_DISK_CHARS = 2610;
export const HEADLINE_LAG_MINUTES = 40;
export const HEADLINE_EDITS_BEHIND = 2;
export const DOCS_CLAIM = "Re-injected from disk";
export const REFRESH_REMINDER =
  "Instruction files were re-read after the conversation was compacted; these differ from their earlier copies";

export const COUSINS = Object.freeze([
  {
    issue: 91243,
    title: "Docs: whether /compact reloads user-level ~/.claude/CLAUDE.md",
    citeOnly: true,
    why: "docs question about which files /compact reloads — different surface",
  },
  {
    issue: 88886,
    title:
      "Subagents receive CLAUDE.md/memory snapshot from parent session start, not spawn",
    citeOnly: true,
    why: "subagent spawn snapshot — not mid-turn auto-compact of the parent",
  },
  {
    issue: 87937,
    title: "Auto-compact summarization prompt leaks as fabricated user override",
    citeOnly: true,
    why: "summarization prompt leak — not last-prompt witness reuse",
  },
  {
    issue: 88023,
    title: "Project custom agents unavailable to Agent tool after /compact",
    citeOnly: true,
    why: "custom agents missing after /compact — not instruction-file content",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "palimpsest",
  "ephemera",
  "setoff",
  "veto",
  "fathom",
  "hangfire",
  "graft",
  "ullage",
  "diopter",
  "oubliette",
]);

/**
 * Published session table (UTC, same day). Versions A–F of project
 * CLAUDE.md. Facts from #92949 only — no invented file bodies.
 */
export const TIMELINE = Object.freeze([
  {
    t: "20:42",
    event: "session-start",
    injected: "A",
    disk: "A",
    lastPrompt: null,
    changed: null,
    reason: null,
  },
  {
    t: "20:55",
    event: "auto-compact",
    injected: "A",
    disk: "A",
    lastPrompt: "A",
    changed: null,
    reason: null,
  },
  {
    t: "21:11",
    event: "auto-compact",
    injected: "A",
    disk: "B",
    lastPrompt: "A",
    changed: null,
    reason: null,
    diskEdited: "21:03",
  },
  {
    t: "21:29",
    event: "auto-compact",
    injected: "A",
    disk: "B",
    lastPrompt: "A",
    changed: null,
    reason: null,
  },
  {
    t: "21:37",
    event: "user-prompt",
    injected: "C",
    disk: "C",
    lastPrompt: "A",
    changed: true,
    reason: "compaction",
  },
  {
    t: "21:55",
    event: "auto-compact",
    injected: "C",
    disk: "D",
    lastPrompt: "C",
    changed: null,
    reason: null,
    diskEdited: "21:44",
  },
  {
    t: "22:00",
    event: "user-prompt",
    injected: "D",
    disk: "D",
    lastPrompt: "C",
    changed: true,
    reason: "compaction",
  },
  {
    t: "22:49",
    event: "auto-compact",
    injected: "D",
    disk: "F",
    lastPrompt: "D",
    changed: null,
    reason: null,
    diskEdited: Object.freeze(["22:09", "22:46"]),
    lagMinutes: HEADLINE_LAG_MINUTES,
    editsBehind: HEADLINE_EDITS_BEHIND,
  },
  {
    t: "22:52",
    event: "user-prompt",
    injected: "F",
    disk: "F",
    lastPrompt: "D",
    changed: true,
    reason: "compaction",
  },
]);

export const USER_LEVEL_ROWS = Object.freeze([
  {
    file: "~/.claude/CLAUDE.md",
    t: "21:55",
    event: "auto-compact",
    injectedFrom: "21:37",
    chars: USER_LEVEL_STALE_CHARS,
    diskEdited: Object.freeze(["21:45", "21:53"]),
  },
  {
    file: "~/.claude/CLAUDE.md",
    t: "22:00",
    event: "user-prompt",
    changed: true,
    reason: "compaction",
    chars: USER_LEVEL_DISK_CHARS,
  },
]);

export function witnessHash(version) {
  const text = `project-CLAUDE.md:${String(version ?? "")}`;
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function parseClock(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return Number(text);
  const match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

export function editsBehind(injected, disk) {
  const order = "ABCDEF";
  const a = order.indexOf(String(injected || ""));
  const b = order.indexOf(String(disk || ""));
  if (a < 0 || b < 0) return 0;
  return Math.max(0, b - a);
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    event: "auto-compact",
    t: "22:49",
    injected: "F",
    disk: "F",
    lastPrompt: "D",
    changed: null,
    reason: null,
    fromDisk: true,
  };
}

export function seedCollated() {
  return { ...emptyTicket() };
}

export function seedStereotyped() {
  return {
    seed: PATH_WORD,
    event: "auto-compact",
    t: "22:49",
    injected: "D",
    disk: "F",
    lastPrompt: "D",
    changed: null,
    reason: null,
    fromDisk: false,
    lagMinutes: HEADLINE_LAG_MINUTES,
    editsBehind: HEADLINE_EDITS_BEHIND,
    attachment: "instructions",
  };
}

export function seedEmended() {
  return {
    seed: SEEDED_WORD,
    event: "user-prompt",
    t: "22:52",
    injected: "F",
    disk: "F",
    lastPrompt: "D",
    changed: true,
    reason: "compaction",
    fromDisk: true,
  };
}

export function normalizeRow(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      event: "auto-compact",
      injected: null,
      disk: null,
      lastPrompt: null,
      changed: null,
      reason: null,
    };
  }
  return {
    t: raw.t || raw.time || null,
    event: raw.event || raw.kind || "auto-compact",
    injected: raw.injected ?? raw.injectedVersion ?? null,
    disk: raw.disk ?? raw.diskVersion ?? raw.exemplar ?? null,
    lastPrompt: raw.lastPrompt ?? raw.witness ?? raw.snapshot ?? null,
    changed: raw.changed === true ? true : raw.changed == null ? null : raw.changed,
    reason: raw.reason || null,
    fromDisk: raw.fromDisk === true,
    attachment: raw.attachment || "instructions",
    lagMinutes: raw.lagMinutes ?? null,
    editsBehind: raw.editsBehind ?? null,
    file: raw.file || "project CLAUDE.md",
    chars: raw.chars ?? null,
  };
}

/**
 * Score one compact / prompt witness against the disk exemplar.
 * collated: auto-compact injected === disk (docs-true re-read).
 * stereotyped: auto-compact reprints last-prompt witness; disk differs.
 * emended: next user prompt writes changed:true reason:compaction from disk.
 */
export function scoreWitness(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeRow(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const injected = row.injected;
  const disk = row.disk;
  const lastPrompt = row.lastPrompt;
  const matchesDisk = injected != null && disk != null && injected === disk;
  const matchesWitness =
    injected != null && lastPrompt != null && injected === lastPrompt;
  const behind = editsBehind(injected, disk);
  const lagMinutes =
    row.lagMinutes != null
      ? Number(row.lagMinutes)
      : ticket.t === "22:49"
        ? HEADLINE_LAG_MINUTES
        : 0;

  let verdict = IDLE_WORD;
  if (
    row.event === "user-prompt" &&
    row.changed === true &&
    row.reason === "compaction" &&
    matchesDisk
  ) {
    verdict = "emended";
  } else if (
    (row.event === "auto-compact" || row.event === "session-start") &&
    matchesDisk &&
    (row.fromDisk || !matchesWitness || injected === disk)
  ) {
    if (row.fromDisk === true || matchesDisk) {
      verdict = "collated";
    }
  }

  if (row.event === "auto-compact" && matchesWitness && !matchesDisk) {
    verdict = "stereotyped";
  } else if (
    row.event === "auto-compact" &&
    injected != null &&
    disk != null &&
    injected !== disk
  ) {
    verdict = "stereotyped";
  } else if (
    ticket.fromDisk === true &&
    row.event === "auto-compact" &&
    matchesDisk
  ) {
    verdict = "collated";
  } else if (
    row.event === "session-start" &&
    matchesDisk
  ) {
    verdict = "collated";
  }

  if (seeded && (!hasWitnessFields(ticket) || ticket.preferSeed === true)) {
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
    collated: verdict === "collated",
    stereotyped: verdict === "stereotyped",
    emended: verdict === "emended" || verdict === "late-refresh",
    matchesDisk,
    matchesWitness,
    fromDisk: row.fromDisk || (verdict === "collated" && matchesDisk),
    injected,
    disk,
    lastPrompt,
    injectedHash: injected ? witnessHash(injected) : null,
    diskHash: disk ? witnessHash(disk) : null,
    witnessHash: lastPrompt ? witnessHash(lastPrompt) : null,
    editsBehind: behind || row.editsBehind || 0,
    lagMinutes,
    changed: row.changed,
    reason: row.reason,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit collated" : "score stereotyped",
  };
}

function hasWitnessFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.injected != null ||
        ticket.disk != null ||
        ticket.lastPrompt != null ||
        ticket.event),
  );
}

export function scoreTimeline(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.timeline)
      ? ticket.timeline
      : TIMELINE;
  const scored = rows.map((row) => ({
    ...normalizeRow(row),
    ...scoreWitness({ ...row, preferSeed: false }),
  }));
  const stereotyped = scored.filter((row) => row.verdict === "stereotyped");
  const emended = scored.filter((row) => row.verdict === "emended");
  const collated = scored.filter((row) => row.verdict === "collated");
  const headline = scored.find((row) => row.t === "22:49") || stereotyped[stereotyped.length - 1];
  let verdict = "collated";
  if (stereotyped.length) verdict = "stereotyped";
  else if (emended.length && !collated.length) verdict = "emended";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "collated",
    alarm: verdict !== "collated",
    stereotypedCount: stereotyped.length,
    emendedCount: emended.length,
    collatedCount: collated.length,
    headline,
    rows: scored,
    phrase: verdict === "collated" ? "admit collated" : "score stereotyped",
    note:
      headline && headline.t === "22:49"
        ? "22:49 auto-compact stereotyped D while disk was F — 40 minutes and two edits behind"
        : "published A–F table scored against last-prompt witness vs disk exemplar",
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
    seeded !== "collated" &&
    seeded !== "stereotyped" &&
    seeded !== "emended" &&
    !ticket.injected &&
    !ticket.rows
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.timeline)) {
    return scoreTimeline(ticket).verdict;
  }
  return scoreWitness(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.timeline);
  const scored = multi ? scoreTimeline(ticket) : scoreWitness(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasWitnessFields(ticket) && !multi
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
    docsClaim: DOCS_CLAIM,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.injected ? `inj=${result.injected}` : "inj=?",
    result.disk ? `disk=${result.disk}` : "disk=?",
    result.lastPrompt ? `wit=${result.lastPrompt}` : "wit=?",
    result.matchesDisk ? "exemplar-match" : "exemplar-drift",
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
      version: `${VERSION_FROM}→${VERSION_TO}`,
      os: OS_NAME,
      surface: SURFACE,
      model: MODEL,
      autoCompactWindow: AUTO_COMPACT_WINDOW,
      autoCompactions: AUTO_COMPACT_COUNT,
      userLevel: {
        staleChars: USER_LEVEL_STALE_CHARS,
        diskChars: USER_LEVEL_DISK_CHARS,
      },
      headline: {
        t: "22:49",
        injected: "D",
        disk: "F",
        lagMinutes: HEADLINE_LAG_MINUTES,
        editsBehind: HEADLINE_EDITS_BEHIND,
      },
      hypothesis:
        "auto-compact writes the instructions attachment from an in-memory last-prompt snapshot; disk re-read is deferred to the next user prompt",
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
