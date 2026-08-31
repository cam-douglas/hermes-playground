#!/usr/bin/env node
/**
 * Smutch — binder's smutch-bench classifier.
 * A home-folder Icon\r on every crate is not a hold.
 * Score the smutches or admit plain.
 *
 *   echo '{"iconR":true,"resourceFork":true}' | node smutch.mjs
 *   node smutch.mjs ticket.json
 *
 * Idle word is plain (folder unmarked; no Icon\r; FinderInfo clean).
 * Seeded state is smutched / #90993.
 * NEVER idle as "smutch", "smutched", "icon", "stamp", "provenance",
 * "crawl", "bitting", "seated", "bound", "hallmarked", "pointed",
 * "collapsed", "spoiled", "banked", "misstruck", "hunting", "traced".
 *
 * Primary #90993: macOS desktop app stamps custom folder icons
 * (0-byte Icon\r files) on thousands of folders — breaks git
 * fetch and Python venvs. Since Claude Desktop update ~2026-08-27
 * (app 1.40609.0, engine 2.1.247), a background process continuously
 * stamps a custom folder icon across working directories of
 * registered sessions. Creates classic Icon\r: 0-byte data fork,
 * com.apple.FinderInfo (32 bytes) + com.apple.ResourceFork
 * (163,057 bytes, identical everywhere, icns at offset 260).
 * Sets kHasCustomIcon (0x04 at byte 8). Stamped image is always
 * the stock macOS home-folder icon. Scale: ~20,000 Icon\r files
 * in 3 days (2026-08-28 15:44 → 2026-08-31 09:35). Attribution:
 * every affected folder shares Claude Desktop's
 * com.apple.provenance key; geography only trees where Claude
 * sessions work; timing coincides with LocalSessions refresh /
 * getPrChecks in main.log. Impact: fatal: bad object refs/Icon;
 * 3,689 files in venvs; PDF nightly fail with no FontName found
 * ... /fonts//standard/Icon.
 *
 * Same-class (cite, not primary): #90996 (duplicate of same bug).
 * Earlier isolated bursts (2026-05-11, 2026-07-27) — history only.
 *
 * NOT Bitting (#90970 MCP mint exclusivity). NOT Puncheon (#90962
 * BOM-less .ps1). NOT Gnomon (#90954 shared mtime). NOT Spoil
 * (#90943 GIT_INDEX_FILE). NOT Bulla (#90891 MSIX). NOT Carcase
 * (#90867 stealth relaunch). NOT Hydra (#90856 marketplace re-clone).
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "smutched",
  "plain",
  "icon-r",
  "zero-byte",
  "resource-fork",
  "finderinfo",
  "khas-custom-icon",
  "home-icon",
  "provenance-key",
  "git-refs-poison",
  "venv-poison",
  "local-sessions-crawl",
  "icns-identical",
  "continuous-crawl",
]);
export const IDLE_WORD = "plain";
export const SEEDED_WORD = "smutched";
export const HOLD_VERDICTS = Object.freeze(["plain"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => name !== "plain"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90993;
export const PRIMARY_ISSUES = Object.freeze([90993]);
export const SAME_CLASS = Object.freeze([90996]);
export const HISTORY_BURSTS = Object.freeze(["2026-05-11", "2026-07-27"]);
export const NOT_PRODUCTS = Object.freeze([
  "bitting",
  "puncheon",
  "gnomon",
  "spoil",
  "bulla",
  "carcase",
  "hydra",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90993";
export const TITLE =
  "[BUG] macOS desktop app stamps custom folder icons (0-byte Icon\\r files) on thousands of folders — breaks git fetch and Python venvs";
export const REPORTER = "gme1204";
export const FILED_AT = "2026-08-31T13:40:42Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:desktop",
]);
export const APP_VERSION = "1.40609.0";
export const ENGINE = "2.1.247";
export const UPDATE_DAY = "2026-08-27";
export const ICON_NAME = "Icon\\r";
export const DATA_FORK_BYTES = 0;
export const FINDERINFO_BYTES = 32;
export const RESOURCE_FORK_BYTES = 163057;
export const ICNS_OFFSET = 260;
export const KHAS_CUSTOM_ICON = 0x04;
export const KHAS_BYTE = 8;
export const STAMP_COUNT = 20000;
export const STAMP_START = "2026-08-28 15:44";
export const STAMP_END = "2026-08-31 09:35";
export const PROVENANCE_KEY = "01 02 00 52 3B A0 18 62 9D 1B 4C";
export const GIT_ERROR = "fatal: bad object refs/Icon";
export const VENV_FILES = 3689;
export const PDF_ERROR = "no FontName found ... /fonts//standard/Icon";
export const LOCAL_SESSIONS = "LocalSessions";
export const GET_PR_CHECKS = "getPrChecks";
export const HUB_LINE =
  "23:50 smutch: a home-folder Icon\\r on every crate is not a hold. Score the smutches or admit plain.";
export const MARK = "23:50 / hermes catalog #97 / #90993";
export const PHRASE =
  "a home-folder Icon\\r on every crate is not a hold";
export const HYPOTHESIS_NOTE =
  "A smutch is a dirty mark or stain. The desktop crawls and smutches every folder it touches with the same home-folder Icon\\r. An unmarked folder is not a hold until you score the smutches or admit plain.";
export const CONTRAST_NOTE =
  "This is DESKTOP BACKGROUND CRAWL + Icon\\r RESOURCE-FORK STAMP + HOME-FOLDER ICNS + PROVENANCE ATTRIBUTION + GIT REFS/VENV POISON. NOT Bitting MCP mint exclusivity. NOT Puncheon BOM-less .ps1. NOT Gnomon shared mtime.";
export const FORBIDDEN_IDLE = Object.freeze([
  "smutch",
  "smutched",
  "icon",
  "stamp",
  "provenance",
  "crawl",
  "bitting",
  "seated",
  "bound",
  "hallmarked",
  "pointed",
  "collapsed",
  "spoiled",
  "banked",
  "misstruck",
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
    iconR: null,
    zeroByte: null,
    resourceFork: null,
    finderInfo: null,
    kHasCustomIcon: null,
    homeIcon: null,
    provenanceKey: null,
    gitRefsPoison: null,
    venvPoison: null,
    localSessionsCrawl: null,
    icnsIdentical: null,
    continuousCrawl: null,
    plainHold: null,
    stampCount: null,
    resourceForkBytes: null,
    venvFiles: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedPlain();
}

export function seedPlain() {
  return {
    seed: IDLE_WORD,
    issue: null,
    iconR: false,
    zeroByte: false,
    resourceFork: false,
    finderInfo: false,
    kHasCustomIcon: false,
    homeIcon: false,
    provenanceKey: false,
    gitRefsPoison: false,
    venvPoison: false,
    localSessionsCrawl: false,
    icnsIdentical: false,
    continuousCrawl: false,
    plainHold: true,
    stampCount: 0,
    resourceForkBytes: 0,
    venvFiles: 0,
    outputText: "folder unmarked; crate clean; no custom icon; plain",
  };
}

export function seedSmutched() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    iconR: true,
    zeroByte: true,
    resourceFork: true,
    finderInfo: true,
    kHasCustomIcon: true,
    homeIcon: true,
    provenanceKey: true,
    gitRefsPoison: true,
    venvPoison: true,
    localSessionsCrawl: true,
    icnsIdentical: true,
    continuousCrawl: true,
    plainHold: false,
    stampCount: STAMP_COUNT,
    resourceForkBytes: RESOURCE_FORK_BYTES,
    venvFiles: VENV_FILES,
    appVersion: APP_VERSION,
    engine: ENGINE,
    updateDay: UPDATE_DAY,
    provenance: PROVENANCE_KEY,
    gitError: GIT_ERROR,
    pdfError: PDF_ERROR,
    sameClass: [...SAME_CLASS],
    historyBursts: [...HISTORY_BURSTS],
    outputText:
      "macOS desktop app stamps custom folder icons (0-byte Icon\\r files) on thousands of folders; 0-byte data fork; com.apple.FinderInfo 32 bytes + com.apple.ResourceFork 163057 bytes identical everywhere, icns at offset 260; kHasCustomIcon 0x04 at byte 8; stock macOS home-folder icon (blue folder + person silhouette); NSHomeDirectory written back via setIcon:forFile:options:; ~20,000 Icon\\r files in 3 days 2026-08-28 15:44 → 2026-08-31 09:35; crawling day and night including .git/objects/*, .git/refs/, Python .venv trees, .app bundles in ~/Downloads; com.apple.provenance key 01 02 00 52 3B A0 18 62 9D 1B 4C; timing coincides with LocalSessions refresh / getPrChecks in main.log; fatal: bad object refs/Icon; 3689 files in venvs; no FontName found ... /fonts//standard/Icon; continuous-crawl",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.smutch && typeof src.smutch === "object" && src.smutch) ||
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
    iconR: firstBool(nested.iconR, nested.icon_r, nested.iconr, src.iconR),
    zeroByte: firstBool(nested.zeroByte, nested.zero_byte, src.zeroByte),
    resourceFork: firstBool(
      nested.resourceFork,
      nested.resource_fork,
      src.resourceFork,
    ),
    finderInfo: firstBool(
      nested.finderInfo,
      nested.finder_info,
      src.finderInfo,
    ),
    kHasCustomIcon: firstBool(
      nested.kHasCustomIcon,
      nested.khasCustomIcon,
      nested.k_has_custom_icon,
      src.kHasCustomIcon,
    ),
    homeIcon: firstBool(nested.homeIcon, nested.home_icon, src.homeIcon),
    provenanceKey: firstBool(
      nested.provenanceKey,
      nested.provenance_key,
      src.provenanceKey,
    ),
    gitRefsPoison: firstBool(
      nested.gitRefsPoison,
      nested.git_refs_poison,
      src.gitRefsPoison,
    ),
    venvPoison: firstBool(nested.venvPoison, nested.venv_poison, src.venvPoison),
    localSessionsCrawl: firstBool(
      nested.localSessionsCrawl,
      nested.local_sessions_crawl,
      src.localSessionsCrawl,
    ),
    icnsIdentical: firstBool(
      nested.icnsIdentical,
      nested.icns_identical,
      src.icnsIdentical,
    ),
    continuousCrawl: firstBool(
      nested.continuousCrawl,
      nested.continuous_crawl,
      src.continuousCrawl,
    ),
    plainHold: firstBool(nested.plainHold, nested.plain_hold, src.plainHold),
    stampCount: firstNum(nested.stampCount, nested.stamp_count, src.stampCount),
    resourceForkBytes: firstNum(
      nested.resourceForkBytes,
      nested.resource_fork_bytes,
      src.resourceForkBytes,
    ),
    venvFiles: firstNum(nested.venvFiles, nested.venv_files, src.venvFiles),
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

function missingCore(input) {
  return (
    input.iconR == null &&
    input.resourceFork == null &&
    input.homeIcon == null &&
    input.provenanceKey == null &&
    input.plainHold == null &&
    input.gitRefsPoison == null
  );
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
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedSmutched(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedSmutched(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedPlain(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title].filter(Boolean).join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) && named !== IDLE_WORD && named !== SEEDED_WORD;
  const iconR =
    row.iconR === true ||
    /Icon\\r|icon-r|custom folder icon|0-byte Icon/i.test(text);
  const zeroByte =
    row.zeroByte === true ||
    /0-byte data fork|zero-byte|zero byte data/i.test(text);
  const resourceFork =
    row.resourceFork === true ||
    /163,?057|resource-fork|ResourceFork/i.test(text);
  const finderInfo =
    row.finderInfo === true ||
    /com\.apple\.FinderInfo|finderinfo:|32 bytes/i.test(text);
  const kHas =
    row.kHasCustomIcon === true ||
    /kHasCustomIcon|0x04 at byte 8|khas-custom-icon/i.test(text);
  const homeIcon =
    row.homeIcon === true ||
    /home-folder icon|home-icon|NSHomeDirectory|person silhouette/i.test(text);
  const provenance =
    row.provenanceKey === true ||
    /provenance-key|com\.apple\.provenance|01 02 00 52/i.test(text);
  const gitPoison =
    row.gitRefsPoison === true ||
    /git-refs-poison|fatal: bad object refs\/Icon/i.test(text);
  const venv =
    row.venvPoison === true ||
    /venv-poison|3,?689|Python \.venv/i.test(text);
  const crawl =
    row.localSessionsCrawl === true ||
    /local-sessions-crawl|LocalSessions|getPrChecks/i.test(text);
  const icns =
    row.icnsIdentical === true ||
    /icns-identical|icns at offset 260|identical everywhere/i.test(text);
  const continuous =
    row.continuousCrawl === true ||
    /continuous-crawl|20,?000 Icon|crawling day and night/i.test(text);
  const plainHold =
    row.plainHold === true ||
    (/folder unmarked|FinderInfo clean|no Icon\\r/i.test(text) && !namedAlarm);
  const plain =
    !namedAlarm &&
    plainHold &&
    !iconR &&
    !resourceFork &&
    !gitPoison;
  const smutched =
    !namedAlarm &&
    iconR &&
    zeroByte &&
    resourceFork &&
    homeIcon &&
    provenance &&
    !plain;
  return {
    iconR,
    zeroByte,
    resourceFork,
    finderInfo,
    kHas,
    homeIcon,
    provenance,
    gitPoison,
    venv,
    crawl,
    icns,
    continuous,
    plainHold,
    plain,
    smutched,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.smutched) chips.push("smutched");
  if (flags.plain) chips.push("plain");
  if (flags.iconR && !flags.plain) chips.push("icon-r");
  if (flags.zeroByte && !flags.plain) chips.push("zero-byte");
  if (flags.resourceFork && !flags.plain) chips.push("resource-fork");
  if (flags.finderInfo && !flags.plain) chips.push("finderinfo");
  if (flags.kHas && !flags.plain) chips.push("khas-custom-icon");
  if (flags.homeIcon && !flags.plain) chips.push("home-icon");
  if (flags.provenance && !flags.plain) chips.push("provenance-key");
  if (flags.gitPoison && !flags.plain) chips.push("git-refs-poison");
  if (flags.venv && !flags.plain) chips.push("venv-poison");
  if (flags.crawl && !flags.plain) chips.push("local-sessions-crawl");
  if (flags.icns && !flags.plain) chips.push("icns-identical");
  if (flags.continuous && !flags.plain) chips.push("continuous-crawl");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "plain") {
    reasons.push("folder unmarked; no Icon\\r; FinderInfo clean");
    reasons.push("hold: this is a plain crate, not a smutched folder");
  }
  if (flags.iconR) {
    reasons.push(
      "classic Icon\\r stamped in each folder of registered session trees",
    );
  }
  if (flags.zeroByte) {
    reasons.push("0-byte data fork on every Icon\\r");
  }
  if (flags.resourceFork) {
    reasons.push(
      "com.apple.ResourceFork is 163,057 bytes, identical everywhere",
    );
  }
  if (flags.finderInfo) {
    reasons.push("com.apple.FinderInfo is 32 bytes");
  }
  if (flags.kHas) {
    reasons.push("kHasCustomIcon (0x04 at byte 8) set on the folder FinderInfo");
  }
  if (flags.homeIcon) {
    reasons.push(
      "stamped image is always the stock macOS home-folder icon (blue folder + person silhouette)",
    );
  }
  if (flags.provenance) {
    reasons.push(
      "every affected folder shares Claude Desktop's com.apple.provenance key 01 02 00 52 3B A0 18 62 9D 1B 4C",
    );
  }
  if (flags.gitPoison) {
    reasons.push("fatal: bad object refs/Icon breaks git fetch/worktree");
  }
  if (flags.venv) {
    reasons.push("3,689 files in Python .venv trees");
  }
  if (flags.crawl) {
    reasons.push(
      "timing coincides to the second with LocalSessions refresh / getPrChecks in main.log",
    );
  }
  if (flags.icns) {
    reasons.push("icns at offset 260, identical on every stamp");
  }
  if (flags.continuous) {
    reasons.push(
      "~20,000 Icon\\r files in 3 days (2026-08-28 15:44 → 2026-08-31 09:35), crawling day and night",
    );
  }
  if (flags.smutched) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  if (verdict !== "plain" && (flags.gitPoison || flags.venv)) {
    reasons.push(CONTRAST_NOTE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && flags.plain) return "plain";
  if (named === SEEDED_WORD) return "smutched";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.smutched) return "smutched";
  if (flags.continuous) return "continuous-crawl";
  if (flags.icns) return "icns-identical";
  if (flags.crawl) return "local-sessions-crawl";
  if (flags.venv) return "venv-poison";
  if (flags.gitPoison) return "git-refs-poison";
  if (flags.provenance) return "provenance-key";
  if (flags.homeIcon) return "home-icon";
  if (flags.kHas) return "khas-custom-icon";
  if (flags.finderInfo) return "finderinfo";
  if (flags.resourceFork) return "resource-fork";
  if (flags.zeroByte) return "zero-byte";
  if (flags.iconR) return "icon-r";
  if (flags.plain) return "plain";
  return "plain";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags);
  const hold = verdict === "plain";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    plain: verdict === "plain" || flags.plain,
    smutched: verdict === "smutched" || flags.smutched,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      blotter: flags.smutched
        ? "every crate on the bench carries the same home-folder stain"
        : "blotter is clean; folders stay unmarked",
      specimen: flags.resourceFork
        ? "0-byte data fork + 163,057-byte ResourceFork, icns at offset 260"
        : "no Icon\\r specimen on the blotter",
      poison: flags.gitPoison
        ? "fatal: bad object refs/Icon"
        : flags.venv
          ? "3,689 files in Python .venv trees"
          : "git refs and venvs stay unmarked",
      crawl: flags.continuous
        ? "~20,000 Icon\\r files, 2026-08-28 15:44 → 2026-08-31 09:35"
        : "no continuous crawl",
      note: flags.smutched
        ? "A home-folder Icon\\r on every crate is not a hold. Score the smutches or admit plain."
        : "Plain: folder unmarked; no Icon\\r; FinderInfo clean.",
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
  if (name === SEEDED_WORD || name === 90993 || name === "90993") {
    return analyze(seedSmutched());
  }
  if (name === IDLE_WORD || name === "plain") {
    return analyze(seedPlain());
  }
  return analyze(seedPlain());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.smutched
        ? `smutched bench #${FEATURED_ISSUE}: ${ICON_NAME} 0-byte data fork + ${RESOURCE_FORK_BYTES}-byte ResourceFork; provenance ${PROVENANCE_KEY}; ${GIT_ERROR}; ${VENV_FILES} venv files. ${HYPOTHESIS_NOTE}`
        : `plain bench. Idle word ${IDLE_WORD}. Folder unmarked; no Icon\\r; FinderInfo clean.`,
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
