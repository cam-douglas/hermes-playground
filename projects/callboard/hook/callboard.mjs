#!/usr/bin/env node
/**
 * Callboard — theater call-board / stage-door desk scorer.
 * A cast skill that never makes the new-chat callboard is not a hold.
 * Score the board or admit rostered.
 *
 *   echo '{"preSessionMatch":false,"cachePresent":true}' | node callboard.mjs
 *   node callboard.mjs ticket.json
 *
 * Idle word is rostered.
 * Seeded state is blank / #90858.
 * NEVER idle as "callboard" / "board" / "cast" / "skill".
 *
 * Primary #90858: claude.ai-managed skills
 * (anthropic-skills:*) are missing from
 * new-chat slash-command autocomplete
 * until the first message is sent
 * (regression ~Aug 2026).
 *
 * ROSTERED if cloud/plugin skills appear
 * in new-chat autocomplete before any
 * message.
 * BLANK if new-chat autocomplete lists
 * nothing for them until after the first
 * message starts the session.
 *
 * NOT Ordo (#90515 headless -p).
 * NOT Kindling (#90798 WarmLifecycle).
 * NOT Leaven (#90782 bootstrap echo).
 * NOT Livery / Fetch / Sprag / Reed /
 * Larder / Scion / Hydra / Limpet.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "rostered",
  "blank",
  "deferred",
  "cache-present",
  "local-ok",
  "post-start",
  "duplicate-workaround",
  "namespaced",
  "scan-regress",
  "menu-blind",
]);
export const IDLE_WORD = "rostered";
export const SEED_ALIASES = Object.freeze({
  90858: "blank",
});
export const ALARM_VERDICTS = Object.freeze([
  "blank",
  "deferred",
  "cache-present",
  "local-ok",
  "post-start",
  "duplicate-workaround",
  "namespaced",
  "scan-regress",
  "menu-blind",
]);
export const HOLD_VERDICTS = Object.freeze(["rostered"]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90858;
export const PRIMARY_ISSUES = Object.freeze([90858]);
export const SAME_CLASS = Object.freeze([]);
export const NEARBY_BOUNDARY = Object.freeze([82732]);
export const VERSION = "1.40609.0";
export const CLI = "2.1.169";
export const PLATFORM = "macos";
export const OS = "Darwin 24.6.0";
export const FILED_AT = "2026-08-30T23:41:14Z";
export const TITLE =
  "[BUG] claude.ai skills (anthropic-skills:*) missing from new-chat slash-command autocomplete until first message (regression ~Aug 2026)";
export const LABELS = Object.freeze([
  "has repro",
  "platform:macos",
  "regression",
  "area:skills",
  "area:plugins",
]);
export const NAMESPACED_PREFIX = "anthropic-skills:";
export const CACHE_PATH =
  "~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/<uuid>/<uuid>/skills/";
export const LOCAL_SKILLS_PATH = "~/.claude/skills";
export const SCAN_NOTE =
  "2.1.169 changelog mentions slash-command/skill scan regression introduced in 2.1.161 (fixed for claude -p on Windows); timing roughly matches; unconfirmed connection.";
export const WORKAROUND_NOTE =
  "duplicate skill into ~/.claude/skills → then TWO autocomplete entries (bare + anthropic-skills: prefixed) because namespaced skills do not dedupe against local ones.";

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
  return seedBlank();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.callboard && typeof src.callboard === "object" && src.callboard) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.autocomplete && typeof src.autocomplete === "object" && src.autocomplete) ||
    src;
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    preSessionMatch: firstBool(
      nested.preSessionMatch,
      nested.pre_session_match,
      nested.newChatMatch,
    ),
    postFirstMessageMatch: firstBool(
      nested.postFirstMessageMatch,
      nested.post_first_message_match,
      nested.afterStartMatch,
    ),
    cachePresent: firstBool(nested.cachePresent, nested.cache_present, nested.cache),
    manifestFresh: firstBool(nested.manifestFresh, nested.manifest_fresh, nested.lastUpdatedFresh),
    localSkillsVisible: firstBool(
      nested.localSkillsVisible,
      nested.local_skills_visible,
      nested.localOk,
    ),
    skillCallable: firstBool(nested.skillCallable, nested.skill_callable, nested.skillLoads),
    listSkillsShows: firstBool(nested.listSkillsShows, nested.list_skills_shows, nested.listSkills),
    duplicateEntries: firstBool(
      nested.duplicateEntries,
      nested.duplicate_entries,
      nested.twoEntries,
    ),
    namespacedPrefix: firstText(nested.namespacedPrefix, nested.namespaced_prefix, nested.prefix) || null,
    outputText: firstText(nested.outputText, nested.output, nested.result, nested.text),
    version: firstText(nested.version, src.version) || "",
    cli: firstText(nested.cli, src.cli) || "",
    platform: firstText(nested.platform, src.platform) || "",
    os: firstText(nested.os, src.os) || "",
  };
}

export function looksScanRegress(text) {
  const raw = String(text || "");
  return /2\.1\.161/.test(raw) && /scan regression/i.test(raw);
}

export function looksNamespaced(prefix, text) {
  const p = String(prefix || "");
  const raw = String(text || "");
  return /^anthropic-skills:?$/i.test(p) || /anthropic-skills:/i.test(raw);
}

export function isRosteredHold(ticket) {
  const row = cloneTicket(ticket);
  return row.preSessionMatch === true && row.duplicateEntries !== true;
}

export function isBlankSignature(ticket) {
  const row = cloneTicket(ticket);
  return (
    row.preSessionMatch === false &&
    row.skillCallable !== false &&
    row.listSkillsShows !== false
  );
}

export function analyze(input) {
  const row = cloneTicket(input);
  const blank = row.preSessionMatch === false;
  const deferred = blank && row.postFirstMessageMatch === true;
  const cachePresentAlarm = row.cachePresent === true && blank;
  const localOk = row.localSkillsVisible === true && blank;
  const postStart = row.postFirstMessageMatch === true && blank;
  const duplicateWorkaround = row.duplicateEntries === true;
  const namespaced = looksNamespaced(row.namespacedPrefix, row.outputText);
  const scanRegress = looksScanRegress(row.outputText);
  const menuBlind = row.cachePresent === true && blank;
  const skillWorks = row.skillCallable === true || row.listSkillsShows === true;
  const rostered = isRosteredHold(row);
  const chips = [];
  if (rostered) chips.push("rostered");
  if (blank) chips.push("blank");
  if (deferred) chips.push("deferred", "post-start");
  if (cachePresentAlarm) chips.push("cache-present");
  if (localOk) chips.push("local-ok");
  if (postStart) chips.push("post-start");
  if (duplicateWorkaround) chips.push("duplicate-workaround");
  if (namespaced) chips.push("namespaced");
  if (scanRegress) chips.push("scan-regress");
  if (menuBlind) chips.push("menu-blind");
  if (row.manifestFresh === true && cachePresentAlarm) chips.push("cache-present");
  return {
    row,
    blank,
    deferred,
    cachePresentAlarm,
    localOk,
    postStart,
    duplicateWorkaround,
    namespaced,
    scanRegress,
    menuBlind,
    skillWorks,
    rostered,
    featured: row.issue === FEATURED_ISSUE && isBlankSignature(row),
    chips: [...new Set(chips)],
  };
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.rostered && !ALARM_VERDICTS.includes(seed)) return "rostered";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.duplicateWorkaround) return "duplicate-workaround";
  if (facts.scanRegress) return "scan-regress";
  if (facts.featured) return "blank";
  if (facts.menuBlind && seed === "menu-blind") return "menu-blind";
  if (facts.cachePresentAlarm && facts.row.manifestFresh === true && seed === "cache-present") {
    return "cache-present";
  }
  if (facts.localOk && seed === "local-ok") return "local-ok";
  if (facts.postStart && seed === "post-start") return "post-start";
  if (facts.deferred) return "deferred";
  if (facts.namespaced && blankish(facts)) return "namespaced";
  if (facts.blank) return "blank";
  return "rostered";
}

function blankish(facts) {
  return facts.blank === true;
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
    rostered: verdict === "rostered" || facts.rostered,
    blank: verdict === "blank" || facts.blank,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      preSessionMatch: facts.row.preSessionMatch,
      postFirstMessageMatch: facts.row.postFirstMessageMatch,
      cachePresent: facts.row.cachePresent,
      manifestFresh: facts.row.manifestFresh,
      localSkillsVisible: facts.row.localSkillsVisible,
      skillCallable: facts.row.skillCallable,
      listSkillsShows: facts.row.listSkillsShows,
      duplicateEntries: facts.row.duplicateEntries,
      namespacedPrefix: facts.row.namespacedPrefix,
      blank: facts.blank,
      deferred: facts.deferred,
      menuBlind: facts.menuBlind,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "rostered") {
    return "● Rostered · cloud/plugin skills appear in new-chat autocomplete before any message · hold";
  }
  if (kind === "deferred") {
    return "● Deferred · menu does not read the plugin pipeline until after the first message · alarm";
  }
  if (kind === "cache-present") {
    return "● Cache-present · skills-plugin cache and fresh manifest on disk while the menu shows nothing · alarm";
  }
  if (kind === "local-ok") {
    return "● Local-ok · ~/.claude/skills appear in new-chat autocomplete immediately; only the plugin pipeline is deferred · alarm";
  }
  if (kind === "post-start") {
    return "● Post-start · after the first message starts the session the namespaced skills appear · alarm";
  }
  if (kind === "duplicate-workaround") {
    return "● Duplicate-workaround · local copy yields TWO autocomplete entries (bare + anthropic-skills:) · alarm";
  }
  if (kind === "namespaced") {
    return "● Namespaced · claude.ai skills inject as plugin-namespaced anthropic-skills:<name> · alarm";
  }
  if (kind === "scan-regress") {
    return "● Scan-regress · 2.1.169 changelog notes a slash-command/skill scan regression from 2.1.161; unconfirmed · alarm";
  }
  if (kind === "menu-blind") {
    return "● Menu-blind · cache is present; the new-chat menu does not read it pre-session · alarm";
  }
  return "● Blank · new-chat slash autocomplete lists nothing for anthropic-skills:* until the first message · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "rostered") {
    reasons.push("cloud/plugin skills appear in new-chat autocomplete before any message");
    reasons.push("hold: this is a rostered board, not a blank new-chat callboard");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90858 claude.ai skills (anthropic-skills:*) missing from new-chat slash-command autocomplete until first message",
    );
  }
  if (facts.row.preSessionMatch === false) {
    reasons.push("pre-session autocomplete does not list the namespaced skill");
  }
  if (facts.row.preSessionMatch === true) {
    reasons.push("pre-session autocomplete lists the namespaced skill");
  }
  if (facts.row.postFirstMessageMatch === true) {
    reasons.push("after the first message starts the session, autocomplete lists the skill");
  }
  if (facts.row.cachePresent === true) {
    reasons.push(`cache present at ${CACHE_PATH}`);
  }
  if (facts.row.manifestFresh === true) {
    reasons.push("sibling manifest.json lastUpdated refreshes at session start");
  }
  if (facts.row.localSkillsVisible === true) {
    reasons.push("local skills in ~/.claude/skills still appear in new-chat autocomplete immediately");
  }
  if (facts.row.skillCallable === true) {
    reasons.push("Skill(anthropic-skills:<name>) loads fine in the fresh session");
  }
  if (facts.row.listSkillsShows === true) {
    reasons.push("ListSkills shows the skill enabled");
  }
  if (facts.row.duplicateEntries === true) {
    reasons.push(WORKAROUND_NOTE);
  }
  if (facts.namespaced) {
    reasons.push("skills inject as plugin-namespaced anthropic-skills:<name>");
  }
  if (facts.scanRegress) {
    reasons.push(SCAN_NOTE);
  }
  return reasons;
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    preSessionMatch: false,
    postFirstMessageMatch: true,
    cachePresent: true,
    manifestFresh: true,
    localSkillsVisible: true,
    skillCallable: true,
    listSkillsShows: true,
    duplicateEntries: false,
    namespacedPrefix: NAMESPACED_PREFIX,
    outputText:
      "new-chat slash autocomplete lists nothing for anthropic-skills:* until first message; Skill() and ListSkills still work",
    version: VERSION,
    cli: CLI,
    platform: PLATFORM,
    os: OS,
  };
}

export function seedBlank() {
  return {
    ...baseSeed("blank"),
    outputText:
      "new-chat slash autocomplete lists nothing for anthropic-skills:* until first message; Skill() and ListSkills still work",
  };
}

export function seedRostered() {
  return {
    ...baseSeed("rostered"),
    preSessionMatch: true,
    postFirstMessageMatch: true,
    outputText: "cloud/plugin skills appear in new-chat autocomplete before any message",
  };
}

export function seedDeferred() {
  return {
    ...baseSeed("deferred"),
    outputText:
      "menu does not read the plugin pipeline until after the first message starts the session",
  };
}

export function seedCachePresent() {
  return {
    ...baseSeed("cache-present"),
    outputText:
      "cache exists on disk at skills-plugin/<uuid>/<uuid>/skills/ with sibling manifest.json whose lastUpdated refreshes at session start — data present while menu shows nothing",
  };
}

export function seedLocalOk() {
  return {
    ...baseSeed("local-ok"),
    outputText:
      "local skills in ~/.claude/skills still appear in new-chat autocomplete immediately — menu works; only claude.ai/plugin pipeline is deferred",
  };
}

export function seedPostStart() {
  return {
    ...baseSeed("post-start"),
    outputText:
      "after the first message starts the session, namespaced skills appear in slash autocomplete",
  };
}

export function seedDuplicateWorkaround() {
  return {
    ...baseSeed("duplicate-workaround"),
    preSessionMatch: true,
    duplicateEntries: true,
    outputText:
      "duplicate skill into ~/.claude/skills → then TWO autocomplete entries (bare + anthropic-skills: prefixed) because namespaced skills do not dedupe against local ones",
  };
}

export function seedNamespaced() {
  return {
    ...baseSeed("namespaced"),
    outputText:
      "skills enabled on claude.ai (Settings > Capabilities > Skills) inject into desktop code-mode as plugin-namespaced anthropic-skills:<name>",
  };
}

export function seedScanRegress() {
  return {
    ...baseSeed("scan-regress"),
    outputText: SCAN_NOTE,
  };
}

export function seedMenuBlind() {
  return {
    ...baseSeed("menu-blind"),
    outputText:
      "cache present on disk; new-chat slash menu does not read the plugin pipeline pre-session",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    rostered: seedRostered,
    blank: seedBlank,
    deferred: seedDeferred,
    "cache-present": seedCachePresent,
    "local-ok": seedLocalOk,
    "post-start": seedPostStart,
    "duplicate-workaround": seedDuplicateWorkaround,
    namespaced: seedNamespaced,
    "scan-regress": seedScanRegress,
    "menu-blind": seedMenuBlind,
    90858: seedBlank,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedBlank());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.callboard?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket =
    payload.ticket || payload.callboard || payload.probe || payload.autocomplete || payload;
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
        ? "Callboard blank. A cast skill that never makes the new-chat callboard is not a hold. #90858 pre-session autocomplete misses anthropic-skills:* while Skill() still works. Score the board or admit rostered."
        : "Callboard rostered. Cloud/plugin skills appear in new-chat autocomplete before any message.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBlank();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.callboard || parsed.probe || parsed.autocomplete
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedBlank();
  }
  return seedBlank();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedBlank());
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
