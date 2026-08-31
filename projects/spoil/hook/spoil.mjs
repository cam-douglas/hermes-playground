#!/usr/bin/env node
/**
 * Spoil — mining spoil-tip / assay-bank classifier.
 * A spoiled index is not a hold. Score the spoil or admit banked.
 *
 *   echo '{"privateIndex":true,"staleIndex":true}' | node spoil.mjs
 *   node spoil.mjs ticket.json
 *
 * Idle word is banked (index matches HEAD; spoil tip properly
 * banked; commit would not delete living paths). Seeded state
 * is spoiled / #90943.
 * NEVER idle as "spoil", "spoiled", "stale", "revert", "delete",
 * "index", "lag", "concurrent", "cotenant", "banked-as-seed",
 * "trammel", "hunting", "traced", "soundpost", "flong", "bulla",
 * "trompe", "davy", "moviola", "clepsydra", "dripping".
 *
 * Primary #90943: concurrent sessions in one working tree using
 * private GIT_INDEX_FILE. A stale private index commit silently
 * DELETES paths another session added and REVERTS paths another
 * session changed, with exit 0, no conflict, no prompt.
 * .git/index belongs to the repo, not the session. A commit's
 * tree is built from the index, never from a diff against HEAD.
 * Worktree is immune (own HEAD + own index).
 *
 * Contrast: linked worktree has own HEAD+index → immune.
 * Same-class cite (different mechanism): #86304 silent index
 * destruction via git stash/pop; #52051 closed not-planned
 * (working-tree collisions, not this data loss).
 * Cross-ecosystem: openai/codex#28972.
 * NOT Trammel, Soundpost, Flong, Bulla, Trompe, Davy, Moviola,
 * Berth, Carrel, Clepsydra.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "spoiled",
  "banked",
  "stale-index",
  "private-index",
  "cotenant",
  "delete-add",
  "revert-blob",
  "silent-ok",
  "no-conflict",
  "shared-head",
  "worktree-immune",
  "staged-deletion-exists",
]);
export const IDLE_WORD = "banked";
export const SEEDED_WORD = "spoiled";
export const HOLD_VERDICTS = Object.freeze(["banked"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "banked"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90943;
export const PRIMARY_ISSUES = Object.freeze([90943]);
export const SAME_CLASS = Object.freeze([86304, 52051]);
export const CROSS = Object.freeze(["openai/codex#28972"]);
export const CONTRAST_NOTE =
  "linked worktree has own HEAD+index → immune";
export const NOT_PRODUCTS = Object.freeze([
  "trammel",
  "soundpost",
  "flong",
  "bulla",
  "trompe",
  "davy",
  "moviola",
  "berth",
  "carrel",
  "clepsydra",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90943";
export const TITLE =
  "[BUG] Concurrent sessions in one working tree: a stale git index silently deletes and reverts another session's committed work";
export const REPORTER = "capraCoder";
export const FILED_AT = "2026-08-31T09:46:58Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
  "data-loss",
]);
export const CCD = "2.1.251";
export const OS_NAME = "Windows 11";
export const GIT = "2.54.0";
export const GIST =
  "https://gist.github.com/capraCoder/343fd4749b8b57b06e8a65d8163e0ec8";
export const INCIDENTS = 5;
export const SESSIONS = 11;
export const HUB_LINE =
  "19:50 spoil tip: a spoiled index is not a hold. Score the spoil or admit banked.";
export const MARK = "19:50 / hermes catalog #93 / #90943";
export const PHRASE = "a spoiled index is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "spoil",
  "spoiled",
  "stale",
  "revert",
  "delete",
  "index",
  "lag",
  "concurrent",
  "cotenant",
  "banked-as-seed",
  "trammel",
  "hunting",
  "traced",
  "soundpost",
  "flong",
  "bulla",
  "trompe",
  "davy",
  "moviola",
  "clepsydra",
  "dripping",
]);
export const DAMAGE = Object.freeze({
  title: "add b.txt",
  paths: Object.freeze(["D a.txt", "A b.txt", "M shared.txt"]),
  shared: "v1",
});

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
    privateIndex: null,
    staleIndex: null,
    cotenantSessions: null,
    sharedHead: null,
    otherAddedMissing: null,
    otherChangedStale: null,
    silentExit0: null,
    noConflict: null,
    worktree: null,
    stagedDeletionExists: null,
    genuineDeletion: null,
    indexMatchesHead: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedBanked();
}

export function seedBanked() {
  return {
    seed: IDLE_WORD,
    issue: null,
    privateIndex: false,
    staleIndex: false,
    cotenantSessions: false,
    sharedHead: false,
    otherAddedMissing: false,
    otherChangedStale: false,
    silentExit0: false,
    noConflict: false,
    worktree: false,
    stagedDeletionExists: false,
    genuineDeletion: false,
    indexMatchesHead: true,
    outputText:
      "index matches HEAD; spoil tip properly banked; commit would not delete living paths",
  };
}

export function seedSpoiled() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    ccd: CCD,
    os: OS_NAME,
    git: GIT,
    gist: GIST,
    incidents: INCIDENTS,
    sessions: SESSIONS,
    privateIndex: true,
    staleIndex: true,
    cotenantSessions: true,
    sharedHead: true,
    otherAddedMissing: true,
    otherChangedStale: true,
    silentExit0: true,
    noConflict: true,
    worktree: false,
    stagedDeletionExists: true,
    genuineDeletion: false,
    indexMatchesHead: false,
    sameClass: [...SAME_CLASS],
    cross: [...CROSS],
    damage: { ...DAMAGE, paths: [...DAMAGE.paths] },
    outputText:
      "one repo one branch two sessions; B seeds private GIT_INDEX_FILE and stages one file; A stages different paths and commits; B commits → A's adds arrive as deletions, A's mods revert; exit 0, no conflict, no prompt; D a.txt, A b.txt, M shared.txt (shared back to v1); shared index staging deletion of a file that exists on disk",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.spoil && typeof src.spoil === "object" && src.spoil) ||
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
    privateIndex: firstBool(
      nested.privateIndex,
      nested.private_index,
      nested.gitIndexFile,
      src.privateIndex,
    ),
    staleIndex: firstBool(
      nested.staleIndex,
      nested.stale_index,
      src.staleIndex,
    ),
    cotenantSessions: firstBool(
      nested.cotenantSessions,
      nested.cotenant_sessions,
      nested.cotenant,
      src.cotenantSessions,
    ),
    sharedHead: firstBool(
      nested.sharedHead,
      nested.shared_head,
      src.sharedHead,
    ),
    otherAddedMissing: firstBool(
      nested.otherAddedMissing,
      nested.other_added_missing,
      nested.deleteAdd,
      src.otherAddedMissing,
    ),
    otherChangedStale: firstBool(
      nested.otherChangedStale,
      nested.other_changed_stale,
      nested.revertBlob,
      src.otherChangedStale,
    ),
    silentExit0: firstBool(
      nested.silentExit0,
      nested.silent_exit0,
      nested.exit0,
      src.silentExit0,
    ),
    noConflict: firstBool(
      nested.noConflict,
      nested.no_conflict,
      src.noConflict,
    ),
    worktree: firstBool(
      nested.worktree,
      nested.linkedWorktree,
      nested.linked_worktree,
      src.worktree,
    ),
    stagedDeletionExists: firstBool(
      nested.stagedDeletionExists,
      nested.staged_deletion_exists,
      src.stagedDeletionExists,
    ),
    genuineDeletion: firstBool(
      nested.genuineDeletion,
      nested.genuine_deletion,
      src.genuineDeletion,
    ),
    indexMatchesHead: firstBool(
      nested.indexMatchesHead,
      nested.index_matches_head,
      src.indexMatchesHead,
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
    input.privateIndex == null &&
    input.staleIndex == null &&
    input.indexMatchesHead == null;
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && missingCore) {
    return { ...seedSpoiled(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && missingCore) {
    return { ...seedSpoiled(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && missingCore) {
    return { ...seedBanked(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const privateIndex =
    row.privateIndex === true ||
    /GIT_INDEX_FILE|private (git )?index/i.test(text);
  const staleIndex =
    row.staleIndex === true ||
    /stale (private )?index|index that predates|predates another session/i.test(
      text,
    );
  const cotenant =
    row.cotenantSessions === true ||
    /two (concurrent )?sessions|co-?tenan|11\+ interactive/i.test(text);
  const sharedHead =
    row.sharedHead === true ||
    /one repo,? one branch|same working tree|shared HEAD/i.test(text);
  const deleteAdd =
    row.otherAddedMissing === true ||
    /lacks a path|arrive as (a )?deletion|D\s+a\.txt|deletes it/i.test(text);
  const revertBlob =
    row.otherChangedStale === true ||
    /reverts? it|pre-commit blob|shared\.txt now = v1|shared back to v1/i.test(
      text,
    );
  const silentOk =
    row.silentExit0 === true ||
    /exit(?:s|ed)? 0|exit 0|prints nothing|no warning/i.test(text);
  const noConflict =
    row.noConflict === true ||
    /no conflict|no prompt/i.test(text);
  const worktree =
    row.worktree === true ||
    /linked worktree|own HEAD\+index|worktree is immune|own HEAD as well as its own index/i.test(
      text,
    );
  const stagedDeletionExists =
    row.stagedDeletionExists === true ||
    /staging (the )?deletion of a file that exists on disk|staged deletion whose file still exists/i.test(
      text,
    );
  const genuineDeletion =
    row.genuineDeletion === true ||
    /genuine deletion does not trip/i.test(text);
  const indexMatchesHead =
    row.indexMatchesHead === true ||
    /index matches HEAD|spoil tip properly banked|would not delete living paths/i.test(
      text,
    );
  const spoiled =
    privateIndex &&
    staleIndex &&
    cotenant &&
    sharedHead &&
    deleteAdd &&
    revertBlob &&
    silentOk &&
    noConflict &&
    !worktree &&
    !indexMatchesHead;
  const banked = indexMatchesHead && !staleIndex && !deleteAdd && !revertBlob && !spoiled;
  return {
    privateIndex,
    staleIndex,
    cotenant,
    sharedHead,
    deleteAdd,
    revertBlob,
    silentOk,
    noConflict,
    worktree,
    stagedDeletionExists,
    genuineDeletion,
    indexMatchesHead,
    spoiled,
    banked,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.spoiled) chips.push("spoiled");
  if (flags.banked) chips.push("banked");
  if (flags.staleIndex && !flags.banked) chips.push("stale-index");
  if (flags.privateIndex && !flags.banked) chips.push("private-index");
  if (flags.cotenant && !flags.banked) chips.push("cotenant");
  if (flags.deleteAdd && !flags.banked) chips.push("delete-add");
  if (flags.revertBlob && !flags.banked) chips.push("revert-blob");
  if (flags.silentOk && !flags.banked) chips.push("silent-ok");
  if (flags.noConflict && !flags.banked) chips.push("no-conflict");
  if (flags.sharedHead && !flags.banked) chips.push("shared-head");
  if (flags.worktree) chips.push("worktree-immune");
  if (flags.stagedDeletionExists && !flags.banked) {
    chips.push("staged-deletion-exists");
  }
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "banked") {
    reasons.push(
      "index matches HEAD; spoil tip properly banked; commit would not delete living paths",
    );
    reasons.push("hold: this is a banked tip, not a spoiled index");
  }
  if (flags.privateIndex) {
    reasons.push(
      "session set GIT_INDEX_FILE to a private index — trades visible collision for silent data loss",
    );
  }
  if (flags.staleIndex) {
    reasons.push(
      "stale private index relative to new HEAD: lacks a path the other session added; holds the pre-commit blob for a path the other changed",
    );
  }
  if (flags.cotenant) {
    reasons.push(
      "one repo, one branch, two concurrent sessions (or a session plus scheduled automation that commits)",
    );
  }
  if (flags.sharedHead) {
    reasons.push(
      ".git/index belongs to the repo, not the session; a commit's tree is built from the index, never from a diff against HEAD",
    );
  }
  if (flags.deleteAdd) {
    reasons.push(
      "stale index lacks a path the other session added → commit DELETES it (D a.txt)",
    );
  }
  if (flags.revertBlob) {
    reasons.push(
      "stale index holds the pre-commit blob → commit REVERTS shared.txt to v1; file stays present and plausible",
    );
  }
  if (flags.silentOk) {
    reasons.push(
      "operation succeeds, exits 0, and prints nothing — no error messages",
    );
  }
  if (flags.noConflict) {
    reasons.push(
      "no conflict, no prompt; victim git status shows ordinary modified + untracked",
    );
  }
  if (flags.stagedDeletionExists) {
    reasons.push(
      "section 5: B's commit leaves the shared index staging the deletion of a file that exists on disk",
    );
  }
  if (flags.genuineDeletion) {
    reasons.push(
      "section 6: genuine deletion does not trip the proposed guard",
    );
  }
  if (flags.worktree) {
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.spoiled) {
    reasons.push(
      "B's 'add b.txt' actually did D a.txt, A b.txt, M shared.txt (shared back to v1)",
    );
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags, chips) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.banked) return "banked";
  if (named === SEEDED_WORD || flags.spoiled) return "spoiled";
  if (VERDICTS.includes(named) && chips.includes(named) && named !== IDLE_WORD) {
    return named;
  }
  if (flags.spoiled) return "spoiled";
  if (flags.banked) return "banked";
  if (flags.worktree) return "worktree-immune";
  if (flags.stagedDeletionExists) return "staged-deletion-exists";
  if (flags.revertBlob) return "revert-blob";
  if (flags.deleteAdd) return "delete-add";
  if (flags.staleIndex) return "stale-index";
  if (flags.silentOk) return "silent-ok";
  if (flags.noConflict) return "no-conflict";
  if (flags.privateIndex) return "private-index";
  if (flags.cotenant) return "cotenant";
  if (flags.sharedHead) return "shared-head";
  return "banked";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags, chips);
  const hold = verdict === "banked";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    banked: verdict === "banked" || flags.banked,
    spoiled: verdict === "spoiled" || flags.spoiled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      tip: flags.sharedHead
        ? "one repo one branch; both sessions share HEAD"
        : "HEAD is not a shared cotenant tip",
      tray: flags.privateIndex
        ? "private GIT_INDEX_FILE assay tray"
        : "session uses the shared .git/index",
      bank: flags.worktree
        ? CONTRAST_NOTE
        : flags.indexMatchesHead
          ? "index matches HEAD; tip is banked"
          : "stale private index relative to new HEAD",
      note: flags.spoiled
        ? "A spoiled index is not a hold. Stale private GIT_INDEX_FILE deletes the other's adds and reverts the other's blobs, exit 0, no conflict."
        : flags.worktree
          ? CONTRAST_NOTE
          : "Banked: index matches HEAD; commit would not delete living paths.",
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
  if (name === SEEDED_WORD || name === 90943 || name === "90943") {
    return analyze(seedSpoiled());
  }
  if (name === IDLE_WORD || name === "banked") {
    return analyze(seedBanked());
  }
  return analyze(seedBanked());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.spoiled
        ? `spoiled index #${FEATURED_ISSUE}: stale private GIT_INDEX_FILE deletes the other's adds and reverts the other's blobs; exit 0, no conflict.`
        : `banked spoil tip. Idle word ${IDLE_WORD}. Index matches HEAD; commit would not delete living paths.`,
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
