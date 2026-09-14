#!/usr/bin/env node
/**
 * Cancellans — binder / print shop / cancelled-leaf atelier / folio press.
 * In bibliography, a *cancellans* is the replacement leaf bound in for a
 * cancelled leaf (*cancellandum*). Metaphor: the resume fork should be a
 * faithful replacement folio of the parent's opening tools page — instead
 * the binder drops a line from that first folio and only later pastes a
 * deferred delta, fracturing the prompt-cache prefix.
 * Binder cloth indigo / cancelled-stamp vermilion / folio cream / ink /
 * cache amber / thread teal. NOT a theater tapestry (Arras). NOT a
 * wax-seal atelier (Frangible). NOT a hotel door-plate (Nameplate).
 * NOT a lacquer nesting doll (Matryoshka). NOT a night blotter
 * (Dragnet). NOT an enrollment desk (Matricula). NOT a type-foundry
 * (Allograph). NOT a neurology writing-desk (Agraphia). NOT a
 * gauntlet/lictor/lychgate/ouster/proscription booth. NOT Knock /
 * Oubliette / Eidolon / Quietus / Aphonia / Sourdine / Wraith /
 * Mirage / Afterimage / Scrim / Cachet / Veto / Frisket / Scant.
 *
 * Educational diagnostic model for a published Claude Code resume/fork
 * initial-tools drop: a resumed session (`--resume <uuid>`, which
 * forks) does not reproduce the parent's tools array when the parent
 * had a server-gated tool (here EndConversation) in its tools array
 * from its first request. The fork's first request goes out without
 * that tool and only later receives it as a deferred_tools_delta
 * attachment. The prefix therefore differs early, and the fork's
 * first request misses the prompt cache for the whole conversation
 * even though the cache is well within TTL. Tools/system prompt that
 * arrived after the parent's first request restore correctly; only a
 * tool present in the parent's initial tools array is lost.
 * Version noted: Claude Code 2.1.270, Windows 11, claude --bg,
 * --safe-mode --tools "Bash,PowerShell,Read,Grep,Glob" (no ToolSearch
 * / cannot defer), --model claude-opus-5, ephemeral_1h cache writes.
 *
 * Encoded from anthropics/claude-code#94400 issue text only.
 * Hypothesis (NON-BINDING — issue text): the resume fork does not
 * reproduce a server-gated tool that was in the parent's initial
 * tools array; the first fork request omits it and only later gets
 * deferred_tools_delta, so the prompt-cache prefix misses despite
 * TTL. Invite verify against issue text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement
 * a Claude Code fix. No network. No exploits. No live Claude.
 *
 *   node cancellans.mjs data/cancellans.json
 *   echo '{"seed":"cancellans"}' | node cancellans.mjs
 *
 * Idle word is intact (HOLD: parent's initial tools array fully
 * restored on resume; prefix hot).
 * HOLD aliases: bound, mirrored, folio-match, prefix-hot,
 * tools-restored.
 * Seeded word is cancellans (#94400 path).
 * Path word is deferred-delta.
 * Product score word is cancellans (Score cancellans or admit intact.).
 *
 * NOT Arras/#94348. NOT Frangible/#94362. NOT Nameplate/#94349.
 * NOT Matryoshka/#94350. NOT Dragnet/#94064. NOT Matricula/#93987.
 * NOT Allograph/#94256. NOT Agraphia/#94251. NOT Gauntlet/#94029.
 * NOT Lictor/#94053. NOT Lychgate/#94059. NOT Ouster/#94221.
 * NOT Proscription/#94202. NOT Frisket. NOT Scant. NOT Knock.
 * Do NOT pick #94336.
 * Cite-only related (do NOT rebuild / do NOT conflate):
 * #92033 (mid-conversation deferred_tools_delta invalidates cache),
 * #91151 (resume cache collapses to system+tools floor),
 * #92524 (Diopter — scratchpad UUID lens defocuses cache),
 * #83913 (hook additionalContext rewrite).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "intact",
  "cancellans",
  "deferred-delta",
  "hold",
  "bound",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
  "cache-miss",
  "initial-drop",
  "endconversation",
  "fork-resume",
  "ttl-alive",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "intact";
export const PATH_WORD = "deferred-delta";
export const SEEDED_WORD = "cancellans";
export const PRODUCT_WORD = "cancellans";
export const HOLD = Object.freeze(["intact", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "bound",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
]);
export const RECOVER = Object.freeze(["intact", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "cleared",
  "armed",
  "sealed",
  "latched",
  "guarded",
  "affixed",
  "unpacked",
  "draped",
  "hung",
  "screened",
  "scoped",
  "enrolled",
  "executable",
  "bit-set",
  "+x",
  "engraved",
  "plated",
  "labeled",
  "titled",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "admitted",
  "rostered",
  "listed",
  "scanned",
  "freshened",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "mirage",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "arras",
  "phantom-prompt",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94400;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94400";
export const TITLE =
  "[BUG] Resumed session drops a tool from the parent's initial tools array (EndConversation), so its first request misses the prompt cache";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:core",
]);
export const PLATFORM = "windows";
export const SURFACE = "deferred-delta";
export const HOST = "Claude Code 2.1.270; Windows 11; claude --bg";
export const CHECKED_ON =
  "Published report: --resume <uuid> fork drops a server-gated tool (EndConversation) that was in the parent's initial tools array; fork first request omits it and later receives deferred_tools_delta; prompt-cache prefix misses despite ephemeral_1h TTL; post-first-request tools restore OK";
export const BUILD = "Claude Code 2.1.270; Windows 11";
export const SELECTED_MODEL =
  "claude-opus-5 — resume/fork initial-tools vs prompt-cache prefix defect, not a model defect";
export const OS =
  "Windows 11; platform:windows / area:core; claude --bg; --safe-mode --tools Bash,PowerShell,Read,Grep,Glob";
export const PHRASE = "Score cancellans or admit intact.";
export const DISTRIBUTION =
  "A resumed session (--resume <session-uuid>, which forks) does not reproduce the parent's tools array when the parent had a server-gated tool, here EndConversation, in its tools array from its first request. The fork's first request goes out without that tool and receives it a few seconds later as a deferred_tools_delta attachment. The prefix therefore differs early, and the fork's first request misses the prompt cache for the whole conversation, although the cache is well within its TTL. Tools and system prompt that arrived after the parent's first request are restored correctly on resume. Only a tool present in the parent's initial tools array is lost. Env: Claude Code 2.1.270, Windows 11, claude --bg; --safe-mode --tools \"Bash,PowerShell,Read,Grep,Glob\" so no ToolSearch and the tool cannot be deferred; --model claude-opus-5; --max-turns 40; --dangerously-skip-permissions; all cache writes are 1h (ephemeral_1h_input_tokens), so expiry is ruled out. Evidence: parent first request cache_read 8,926 / cache_creation 7,776; parent last 27,957 / 1,118; fork first 2m11s later 7,462 / 20,562; a cold session without the tool first request 7,462 / 7,701. The fork's first read equals the static prefix of a session without the tool. 3 s into the fork its transcript has an attachment of type deferred_tools_delta with addedNames: [\"EndConversation\"]. A second parent and fork pair, where the parent never had the tool, resumed 26 s later with a full hit (read 31,790, creation 698) — forking itself does not break the cache. --disallowedTools EndConversation does not keep the tool out of the request. Expected: on resume, the fork's first request should carry the same tools array as the parent's last request, as recorded in the parent's prompt_snapshot, so the prefix matches and the cache is read. Impact: about 20K tokens written instead of read on the first request of each affected resume; roughly 1 in 5 resumes for sessions started with a restricted tool list. One test resume on 2.1.271, with the tool enabled in the parent, got a full hit — a single sample, so it may be fixed or it may be the race.";

export const END_CONVERSATION = "EndConversation";
export const DEFERRED_DELTA_TYPE = "deferred_tools_delta";
export const TOOLS_FLAG = "Bash,PowerShell,Read,Grep,Glob";
export const PARENT_TOOLS = Object.freeze([
  "Bash",
  "PowerShell",
  "Read",
  "Grep",
  "Glob",
  "EndConversation",
]);
export const FORK_FIRST_TOOLS = Object.freeze([
  "Bash",
  "PowerShell",
  "Read",
  "Grep",
  "Glob",
]);
export const PARENT_FIRST_READ = 8926;
export const PARENT_FIRST_CREATE = 7776;
export const PARENT_LAST_READ = 27957;
export const PARENT_LAST_CREATE = 1118;
export const FORK_FIRST_READ = 7462;
export const FORK_FIRST_CREATE = 20562;
export const COLD_WITHOUT_TOOL_READ = 7462;
export const COLD_WITHOUT_TOOL_CREATE = 7701;
export const CONTROL_HIT_READ = 31790;
export const CONTROL_HIT_CREATE = 698;
export const BUILD_VERSION = "2.1.270";
export const CACHE_TTL = "ephemeral_1h";
export const SAFE_MODE_TOOLS = TOOLS_FLAG;
export const ADDED_NAMES = Object.freeze(["EndConversation"]);

export const FOLIO_NAMES = Object.freeze([
  {
    id: "parent-folio",
    lost: "Parent folio — EndConversation bound on the opening tools page",
    control: "The replacement folio would mirror that first signature",
    story: "the binder cloth holds when the first line is restored",
  },
  {
    id: "fork-folio",
    lost: "Fork folio — --resume fork's first request omits the initial tool",
    control: "The fork's first request would carry the parent's tools array",
    story: "the cancellandum line is missing from the replacement leaf",
  },
  {
    id: "paste-slip",
    lost: "Paste-slip — deferred_tools_delta arrives seconds later with EndConversation",
    control: "The tool would be on the first request, not pasted after the prefix",
    story: "the atelier pastes a late slip instead of binding the line",
  },
  {
    id: "cache-lamp",
    lost: "Cache lamp — prefix differs early; fork first request misses despite TTL",
    control: "A matching prefix would keep ephemeral_1h hot",
    story: "the amber lamp goes cold while the 1h wick is still alive",
  },
  {
    id: "initial-drop",
    lost: "Initial-drop — only a tool present in the parent's initial tools array is lost",
    control: "Post-first-request tools already restore; the opening array must too",
    story: "later signatures sew correctly; the first folio does not",
  },
  {
    id: "prompt-snapshot",
    lost: "Prompt-snapshot — expected: fork first request matches parent's last tools array",
    control: "prompt_snapshot would be the cancellans of the opening page",
    story: "the press should reprint the last recorded signature",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "parent-folio",
    survey: "parent first request carries EndConversation in the tools array",
    kind: "intact",
    note: "idle/control: parent's opening folio fully restored — the hold/good path",
  },
  {
    id: "fork-folio",
    survey: "--resume fork first request omits EndConversation",
    kind: "cancellans",
    note: "seeded: replacement leaf drops a line from the first folio",
  },
  {
    id: "paste-slip",
    survey: "deferred_tools_delta attachment with addedNames EndConversation",
    kind: "cancellans",
    note: "seeded: late paste instead of a bound line",
  },
  {
    id: "cache-lamp",
    survey: "fork first read 7,462 equals a cold session without the tool; create 20,562",
    kind: "cancellans",
    note: "seeded: prefix miss despite ephemeral_1h",
  },
  {
    id: "initial-drop",
    survey: "post-first-request tools restore; only the initial-array tool is lost",
    kind: "cancellans",
    note: "seeded: later signatures sew; opening line does not",
  },
  {
    id: "prompt-snapshot",
    survey: "deferred-delta — expected prompt_snapshot match is missing",
    kind: "cancellans",
    note: "path: deferred-delta names the late paste that fractures the prefix",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "cache-miss",
    label: "cache miss",
    count: "7,462 / 20,562",
    note: "Fork first request misses the prompt cache for the whole conversation",
  },
  {
    id: "initial-drop",
    label: "initial drop",
    count: "opening array",
    note: "Only a tool present in the parent's initial tools array is lost",
  },
  {
    id: "endconversation",
    label: "EndConversation",
    count: "server-gated",
    note: "Server-gated tool was in the parent's first-request tools array",
  },
  {
    id: "fork-resume",
    label: "fork resume",
    count: "--resume uuid",
    note: "Resume forks; forking itself does not break the cache when the tool was never in the array",
  },
  {
    id: "ttl-alive",
    label: "TTL alive",
    count: "ephemeral_1h",
    note: "All cache writes are 1h; expiry is ruled out",
  },
  {
    id: "deferred-delta",
    label: "deferred-delta",
    count: "addedNames",
    note: "Path: 3 s into the fork, deferred_tools_delta pastes EndConversation",
  },
]);

export const RULED_OUT = Object.freeze([
  "Arras/#94348 phantom-prompt — theater tapestry / Desktop Auto approval card; DIFFERENT",
  "Frangible/#94362 chmod-failopen — wax-seal atelier / PreToolUse +x fail-open; DIFFERENT",
  "Nameplate/#94349 header-rename — brass hotel door-plate / VS Code title snap-back; DIFFERENT",
  "Matryoshka/#94350 subst-nest — lacquer nesting-doll / Bash $(...) walker; DIFFERENT",
  "Dragnet/#94064 root-find — night blotter / full-disk find; DIFFERENT",
  "Matricula/#93987 reload-blind — enrollment desk; desktop /reload-skills (no changes); DIFFERENT",
  "Allograph/#94256 win-posix-mismatch — Windows punch vs POSIX matrix; type-foundry; DIFFERENT",
  "Agraphia/#94251 pre-tool-omit — JSONL drops pre-tool text; medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Knock — fail-loud stalled grants; DIFFERENT",
  "Oubliette — different catalog paradigm; NOT this booth",
  "Eidolon — different catalog paradigm; NOT this booth",
  "Quietus — different catalog paradigm; NOT this booth",
  "Aphonia — different catalog paradigm; NOT this booth",
  "Sourdine — different catalog paradigm; NOT this booth",
  "Wraith — different catalog paradigm; NOT this booth",
  "Mirage — different catalog paradigm; NOT this booth",
  "Afterimage — different catalog paradigm; NOT this booth",
  "Scrim — different catalog paradigm; NOT this booth",
  "Cachet — different catalog paradigm; NOT this booth",
  "Veto — different catalog paradigm; NOT this booth",
  "Frisket — different catalog paradigm; NOT this booth",
  "Scant — different catalog paradigm; NOT this booth",
  "#92033 — mid-conversation deferred_tools_delta invalidates cache — cite-only cousin, DIFFERENT trigger",
  "#91151 — resume cache collapses to system+tools floor — cite-only cousin, DIFFERENT (size+gap)",
  "#92524 — Diopter scratchpad UUID lens defocuses cache — cite-only cousin, DIFFERENT surface",
  "#83913 — hook additionalContext rewrite — cite-only cousin, DIFFERENT (hook context)",
  "#94336 — do NOT pick; not this booth",
]);

export const EXPECTED = Object.freeze([
  "On resume, the fork's first request should carry the same tools array as the parent's last request, as recorded in the parent's prompt_snapshot",
  "A server-gated tool present in the parent's initial tools array must be reproduced on the fork's first request — not pasted later as deferred_tools_delta",
  "The prefix should match so the prompt cache is read while ephemeral_1h is still within TTL",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "deferred-delta",
  "cancellans",
  "cache-miss",
  "initial-drop",
  "endconversation",
  "fork-resume",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92033,
    title: "mid-conversation deferred_tools_delta invalidates cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same attachment name mid-conversation, not a resume fork dropping a parent's initial tools-array tool. Do not rebuild. Do not conflate.",
  },
  {
    issue: 91151,
    title: "resume cache collapses to system+tools floor",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — resume cache floor after size+idle gap. Do not rebuild. Do not conflate. Different from an initial EndConversation drop.",
  },
  {
    issue: 92524,
    title: "Diopter — scratchpad UUID lens defocuses cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — prior catalog note on system+tools prefix cache. Do not rebuild. Do not conflate. Different surface from initial tools-array honesty.",
  },
  {
    issue: 83913,
    title: "hook additionalContext rewrite",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — PreToolUse/PostToolUse additionalContext rewrite. Do not rebuild. Do not conflate. Different from a tools-array line dropped on fork.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "Remote Control slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "mirage",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "folio-match";
export const SAMPLE_KIND_SEEDED = "deferred-delta";
export const SAMPLE_HOLDING_IDLE = "prefix-hot";
export const SAMPLE_HOLDING_SEEDED = "initial-drop";

export const SAMPLE_INTACT_PROOF = Object.freeze({
  intact: true,
  cancellans: false,
  deferredDelta: false,
  cacheMiss: false,
  initialDrop: false,
  endConversation: false,
  forkResume: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_CANCELLANS_PROOF = Object.freeze({
  intact: false,
  cancellans: true,
  deferredDelta: true,
  cacheMiss: true,
  initialDrop: true,
  endConversation: true,
  forkResume: true,
  ttlAlive: true,
  kind: SAMPLE_KIND_SEEDED,
  names: FOLIO_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds intact: parent's initial tools array fully restored; prefix hot" },
  { t: "drop", line: "--resume fork first request omits EndConversation from the opening tools array" },
  { t: "paste", line: "3 s later deferred_tools_delta attachment with addedNames EndConversation" },
  { t: "path", line: "deferred-delta — prefix differs early; cache miss despite ephemeral_1h; post-first-request tools restore OK" },
  { t: "score", line: "when the binder drops a line from the first folio the booth is cancellans — Score cancellans or admit intact." },
]);

const FORCE_FLAGS = [
  "cacheMiss",
  "initialDrop",
  "endConversation",
  "deferredDelta",
  "forkResume",
  "toolOmitted",
];

const ISSUE_CUE_RE =
  /94400|deferred.?tools.?delta|EndConversation|prompt.?cache|--resume|initial tools array|ephemeral_1h|cache_read_input_tokens|addedNames/i;

/**
 * Educational tools-array compare. Not a Claude Code patch.
 * Encodes only the published #94400 shapes.
 * intact=true is the HOLD / tools-restored path.
 */
export function restoreInitialTools({
  intact = false,
  parentInitial = PARENT_TOOLS,
  forkFirst = FORK_FIRST_TOOLS,
} = {}) {
  const restored =
    intact === true ||
    (Array.isArray(parentInitial) &&
      Array.isArray(forkFirst) &&
      parentInitial.length === forkFirst.length &&
      parentInitial.every((name, i) => name === forkFirst[i]));
  if (restored) {
    return {
      matched: true,
      missing: [],
      forkFirst: [...parentInitial],
      deferred: [],
      prefixHot: true,
      phrase: "admit intact",
    };
  }
  const missing = parentInitial.filter((name) => !forkFirst.includes(name));
  return {
    matched: false,
    missing,
    forkFirst: [...forkFirst],
    deferred: missing,
    prefixHot: false,
    phrase: "score cancellans",
  };
}

export function scoreCachePrefix(input = {}) {
  const intactHold = input.intact === true && input.cancellans !== true;
  const restore = restoreInitialTools({
    intact: intactHold,
    parentInitial: input.parentInitial || PARENT_TOOLS,
    forkFirst: intactHold
      ? input.parentInitial || PARENT_TOOLS
      : input.forkFirst || FORK_FIRST_TOOLS,
  });
  const cancellans =
    !intactHold &&
    (restore.matched === false ||
      input.cancellans === true ||
      input.deferredDelta === true ||
      input.cacheMiss === true ||
      input.initialDrop === true ||
      input.endConversation === true ||
      input.addedNames?.includes(END_CONVERSATION));
  return {
    intact: !cancellans,
    cancellans,
    deferredDelta: cancellans,
    cacheMiss: restore.prefixHot === false,
    initialDrop: restore.missing.includes(END_CONVERSATION),
    prefixHot: restore.prefixHot,
    missing: restore.missing,
    restore,
    phrase: cancellans ? "score cancellans" : "admit intact",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94400") return true;
  if (input.addedNames && input.addedNames.includes(END_CONVERSATION)) return true;
  if (input.deltaType === DEFERRED_DELTA_TYPE) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapCancellans(input = {}) {
  const cancellans = isCancellansInput(input);
  const intact = input.intact === true && !cancellans;
  return {
    stamp: cancellans ? "deferred-delta" : "prefix-hot",
    holdingLane: cancellans ? "initial-drop" : "prefix-hot",
    kindLane: cancellans ? "deferred-delta" : "folio-match",
    bindLane: cancellans ? "cache-miss" : "tools-restored",
    ribbon: cancellans ? "cancellans" : "intact",
    intact,
  };
}

export function inspectFolio(input = {}) {
  const dropped =
    input.deferredDelta === true ||
    input.cancellans === true ||
    input.initialDrop === true ||
    isCancellansInput(input);
  if (input.intact === true && !dropped) {
    return { stamp: "folio-bound", dropped: false, note: "parent folio mirrored; tools restored" };
  }
  return {
    stamp: dropped ? "parent-folio" : "folio-idle",
    dropped,
    note: dropped
      ? "parent folio — EndConversation bound on the opening page; fork drops it"
      : "",
  };
}

export function inspectFork(input = {}) {
  const omitted =
    input.initialDrop === true ||
    input.cancellans === true ||
    isCancellansInput(input);
  if (input.intact === true && !omitted) {
    return { stamp: "fork-mirrored", omitted: false };
  }
  return {
    stamp: omitted ? "fork-folio" : "fork-idle",
    omitted: omitted || input.intact === true,
    note: omitted
      ? "fork folio — --resume first request omits the initial tool"
      : "",
  };
}

export function inspectDelta(input = {}) {
  const pasted =
    input.deferredDelta === true ||
    input.cancellans === true ||
    isCancellansInput(input);
  if (input.intact === true && !pasted) {
    return { stamp: "slip-idle", pasted: false };
  }
  return {
    stamp: pasted ? "paste-slip" : "slip-idle",
    pasted: pasted || input.intact === true,
    note: pasted
      ? "paste-slip — deferred_tools_delta arrives later with EndConversation"
      : "",
  };
}

export function inspectCache(input = {}) {
  const missed =
    input.cacheMiss === true ||
    input.cancellans === true ||
    isCancellansInput(input);
  if (input.intact === true && !missed) {
    return { stamp: "lamp-hot", missed: false };
  }
  return {
    stamp: missed ? "cache-lamp" : "lamp-idle",
    missed,
    note: missed
      ? "cache lamp — prefix differs early; fork first request misses despite TTL"
      : "",
  };
}

export function inspectTtl(input = {}) {
  const alive =
    input.ttlAlive === true ||
    input.cancellans === true ||
    isCancellansInput(input);
  if (input.intact === true && !alive) {
    return { stamp: "ttl-quiet", alive: false };
  }
  return {
    stamp: alive ? "ttl-alive" : "ttl-idle",
    alive,
    note: alive
      ? "TTL alive — ephemeral_1h writes; expiry is ruled out"
      : "",
  };
}

export function inspectEndConversation(input = {}) {
  const gated =
    input.endConversation === true ||
    input.cancellans === true ||
    isCancellansInput(input);
  if (input.intact === true && !gated) {
    return { stamp: "tool-idle", gated: false };
  }
  return {
    stamp: gated ? "endconversation" : "tool-idle",
    gated,
    note: gated
      ? "EndConversation — server-gated tool was in the parent's first-request array"
      : "",
  };
}

function folioOpen(input, id) {
  const map = {
    "parent-folio": input.deferredDelta || input.cancellans,
    "fork-folio": input.initialDrop || input.forkResume,
    "paste-slip": input.deferredDelta,
    "cache-lamp": input.cacheMiss,
    "initial-drop": input.initialDrop || input.endConversation,
    "prompt-snapshot": input.deferredDelta || input.cancellans,
  };
  return (
    map[id] === true ||
    input.deferredDelta === true ||
    input.cancellans === true
  );
}

function isCancellansInput(input = {}) {
  return (
    input.cancellans === true ||
    input.deferredDelta === true ||
    input.cacheMiss === true ||
    input.initialDrop === true ||
    input.endConversation === true ||
    input.forkResume === true ||
    input.ttlAlive === true ||
    input.toolOmitted === true ||
    input.deltaType === DEFERRED_DELTA_TYPE ||
    (Array.isArray(input.addedNames) &&
      input.addedNames.includes(END_CONVERSATION))
  );
}

export function readBooth(input = {}) {
  const cancellans = isCancellansInput(input);
  const intact = input.intact === true && !cancellans;
  return {
    mark: cancellans ? "cancellans" : "intact",
    intact,
    cancellans,
    deferredDelta: input.deferredDelta === true || cancellans,
    cacheMiss: input.cacheMiss === true,
    initialDrop: input.initialDrop === true,
    endConversation: input.endConversation === true,
    forkResume: input.forkResume === true,
    ttlAlive: input.ttlAlive === true,
    toolOmitted: input.toolOmitted === true,
    folio: mapCancellans(input),
    parent: inspectFolio(input),
    fork: inspectFork(input),
    delta: inspectDelta(input),
    cache: inspectCache(input),
    ttl: inspectTtl(input),
    tool: inspectEndConversation(input),
    names: FOLIO_NAMES.filter((row) => folioOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const CANCELLANS_WALK = Object.freeze([
  {
    t: "idle",
    event: "prefix-hot",
    intact: true,
    cancellans: false,
    cue: "intact",
    note: "idle HOLD: parent's initial tools array fully restored; prefix hot",
  },
  {
    t: "drop",
    event: "deferred-delta",
    cancellans: true,
    deferredDelta: true,
    initialDrop: true,
    forkResume: true,
    cue: "cancellans",
    note: "--resume fork first request omits EndConversation from the opening tools array",
  },
  {
    t: "paste",
    event: "cache-miss",
    cancellans: true,
    cacheMiss: true,
    endConversation: true,
    deferredDelta: true,
    cue: "cancellans",
    note: "3 s later deferred_tools_delta attachment with addedNames EndConversation; prefix miss",
  },
  {
    t: "path",
    event: "deferred-delta",
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
    initialDrop: true,
    endConversation: true,
    forkResume: true,
    ttlAlive: true,
    toolOmitted: true,
    cue: "cancellans",
    note: "deferred-delta — prefix differs early; cache miss despite ephemeral_1h; post-first-request tools restore OK",
  },
  {
    t: "score",
    event: "cancellans",
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
    initialDrop: true,
    endConversation: true,
    forkResume: true,
    ttlAlive: true,
    toolOmitted: true,
    cue: "cancellans",
    note: "cancellans — the binder drops a line from the first folio and only later pastes a deferred delta",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "prefix-hot",
    intact: true,
    cancellans: false,
    cue: "intact",
    note: "positive control: parent's initial tools array restored; prefix hot",
  },
  {
    t: "admit",
    event: "prefix-hot",
    intact: true,
    cue: "intact",
    note: "positive control: the press admits intact",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    intact: true,
    cancellans: false,
    deferredDelta: false,
    cue: "intact",
  };
}

export function seedIntact() {
  return { ...emptyTicket() };
}

export function seedCancellans() {
  return {
    seed: SEEDED_WORD,
    intact: false,
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
    initialDrop: true,
    endConversation: true,
    forkResume: true,
    ttlAlive: true,
    toolOmitted: true,
    cue: "cancellans",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_CANCELLANS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    cancellans: true,
    deferredDelta: true,
    cue: "cancellans",
  };
}

export function seedDeferredDelta() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    cancellans: true,
    deferredDelta: true,
    event: "deferred-delta",
    cue: "cancellans",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    intact: true,
    cue: "intact",
  };
}

export function seedBound() {
  return { seed: "bound", preferSeed: true, intact: true, cue: "intact" };
}

export function seedMirrored() {
  return { seed: "mirrored", preferSeed: true, intact: true, cue: "intact" };
}

export function seedFolioMatch() {
  return { seed: "folio-match", preferSeed: true, intact: true, cue: "intact" };
}

export function seedPrefixHot() {
  return { seed: "prefix-hot", preferSeed: true, intact: true, cue: "intact" };
}

export function seedToolsRestored() {
  return { seed: "tools-restored", preferSeed: true, intact: true, cue: "intact" };
}

export function seedCacheMiss() {
  return {
    seed: "cache-miss",
    preferSeed: true,
    cacheMiss: true,
    cue: "cancellans",
  };
}

export function seedInitialDrop() {
  return {
    seed: "initial-drop",
    preferSeed: true,
    initialDrop: true,
    cue: "cancellans",
  };
}

export function seedEndConversation() {
  return {
    seed: "endconversation",
    preferSeed: true,
    endConversation: true,
    cue: "cancellans",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      intact: false,
      cancellans: false,
      deferredDelta: false,
      cacheMiss: false,
      initialDrop: false,
      endConversation: false,
      forkResume: false,
      ttlAlive: false,
      toolOmitted: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    intact: raw.intact === true,
    cancellans: raw.cancellans === true || raw.event === "cancellans",
    deferredDelta:
      raw.deferredDelta === true || raw.event === "deferred-delta",
    cacheMiss:
      raw.cacheMiss === true || raw.event === "cache-miss",
    initialDrop:
      raw.initialDrop === true || raw.event === "initial-drop",
    endConversation:
      raw.endConversation === true || raw.event === "endconversation",
    forkResume:
      raw.forkResume === true || raw.event === "fork-resume",
    ttlAlive:
      raw.ttlAlive === true || raw.event === "ttl-alive",
    toolOmitted:
      raw.toolOmitted === true || raw.event === "initial-drop",
    parentInitial: raw.parentInitial,
    forkFirst: raw.forkFirst,
    addedNames: raw.addedNames,
    deltaType: raw.deltaType,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.intact != null ||
        ticket.cancellans != null ||
        ticket.deferredDelta != null ||
        ticket.cacheMiss != null ||
        ticket.initialDrop != null ||
        ticket.endConversation != null ||
        ticket.forkResume != null ||
        ticket.ttlAlive != null ||
        ticket.toolOmitted != null ||
        ticket.deltaType != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isIntact(row) {
  if (row.cancellans && row.cue !== "intact") return false;
  if (row.cue === "cancellans" || row.cue === "deferred-delta") return false;
  if (
    row.deferredDelta &&
    row.cacheMiss &&
    row.cue !== "intact" &&
    row.intact !== true
  ) {
    return false;
  }
  if (
    row.intact === true &&
    row.cancellans !== true &&
    row.cue !== "cancellans"
  ) {
    return true;
  }
  if (
    row.cue === "intact" &&
    row.cancellans !== true &&
    row.deferredDelta !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isDeferredDelta(row) {
  return (
    row.event === "deferred-delta" &&
    !isIntact(row) &&
    (row.deferredDelta === true ||
      row.initialDrop === true ||
      row.cancellans === true)
  );
}

function isCancellansRow(row) {
  if (isIntact(row)) return false;
  if (isDeferredDelta(row) && row.cue !== "cancellans") return false;
  if (row.cue === "cancellans") return true;
  if (row.cancellans === true) return true;
  if (row.deferredDelta === true && row.cacheMiss === true) return true;
  if (
    row.deferredDelta === true ||
    row.cacheMiss === true ||
    row.initialDrop === true ||
    row.endConversation === true ||
    row.forkResume === true ||
    row.ttlAlive === true ||
    row.toolOmitted === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cancellans pass against the folio press.
 * intact: parent's initial tools array restored; prefix hot.
 * cancellans: binder drops a line from the first folio; late paste.
 * deferred-delta: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDeferredDelta(row) ||
    (row.deferredDelta && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "deferred-delta";
  } else if (isCancellansRow(row)) {
    verdict = "cancellans";
  } else if (isIntact(row)) {
    verdict = "intact";
  } else if (
    row.deferredDelta ||
    row.cacheMiss ||
    row.initialDrop ||
    row.endConversation ||
    row.forkResume ||
    row.ttlAlive ||
    row.toolOmitted
  ) {
    verdict = "cancellans";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "cancellans";
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
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    intact: verdict === "intact" || verdict === "hold",
    cancellans: verdict === "cancellans" || verdict === SEEDED_WORD,
    deferredDelta:
      row.deferredDelta === true ||
      verdict === "deferred-delta" ||
      verdict === PATH_WORD,
    cacheMiss: row.cacheMiss,
    initialDrop: row.initialDrop,
    endConversation: row.endConversation,
    forkResume: row.forkResume,
    ttlAlive: row.ttlAlive,
    toolOmitted: row.toolOmitted,
    cue: hold
      ? "intact"
      : row.deferredDelta || verdict === "deferred-delta"
        ? "deferred-delta"
        : "cancellans",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit intact" : "score cancellans",
    folioInspect: inspectFolio(row),
    forkInspect: inspectFork(row),
    deltaInspect: inspectDelta(row),
    cacheInspect: inspectCache(row),
    ttlInspect: inspectTtl(row),
    toolInspect: inspectEndConversation(row),
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : CANCELLANS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "cancellans");
  const path = scored.filter((row) => row.verdict === "deferred-delta");
  const intact = scored.filter((row) => row.verdict === "intact");
  const headline =
    scored.find((row) => row.event === "cancellans") ||
    scored.find((row) => row.event === "deferred-delta") ||
    scored.find((row) => row.event === "cache-miss") ||
    charged[charged.length - 1];
  let verdict = "intact";
  if (charged.length) verdict = "cancellans";
  else if (path.length && !intact.length) {
    verdict = "deferred-delta";
  }
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
    cancellansCount: charged.length,
    pathCount: path.length,
    intactCount: intact.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit intact" : "score cancellans",
    note: headline
      ? "Resume (--resume) fork drops a server-gated tool (EndConversation) that was in the parent's initial tools array; first fork request omits it and only later gets deferred_tools_delta — prompt-cache prefix misses despite TTL. Post-first-request tools restore OK. Cite-only cousins #92033 #91151 #92524 #83913."
      : "published cancellans walk scored against intact vs cancellans",
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
    seeded !== "intact" &&
    seeded !== "cancellans" &&
    seeded !== "deferred-delta" &&
    ticket.intact == null &&
    ticket.cancellans == null &&
    ticket.deferredDelta == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
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
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
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
    backups: BACKUPS.map((row) => row.issue),
    intact: scored.intact ?? false,
    cancellans: scored.cancellans ?? false,
    deferredDelta: scored.deferredDelta ?? false,
    cacheMiss: scored.cacheMiss ?? false,
    initialDrop: scored.initialDrop ?? false,
    endConversation: scored.endConversation ?? false,
    forkResume: scored.forkResume ?? false,
    ttlAlive: scored.ttlAlive ?? false,
    toolOmitted: scored.toolOmitted ?? false,
  };
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.cacheMiss || result.cancellans
      ? "kind=deferred-delta"
      : "kind=folio-match",
    result.initialDrop || result.cancellans
      ? "ref=cache-miss"
      : "ref=prefix-hot",
    result.deferredDelta || result.verdict === "deferred-delta"
      ? "path=deferred-delta"
      : "path=intact",
    result.cue === "intact"
      ? "cue=intact"
      : result.cue === "deferred-delta"
        ? "cue=deferred-delta"
        : "cue=cancellans",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    intact: result.intact,
    cancellans: result.cancellans,
    deferredDelta: result.deferredDelta,
    cacheMiss: result.cacheMiss,
    initialDrop: result.initialDrop,
    endConversation: result.endConversation,
    forkResume: result.forkResume,
    ttlAlive: result.ttlAlive,
    toolOmitted: result.toolOmitted,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    folio: inspectFolio({
      intact: result.intact,
      cancellans: result.cancellans,
    }),
    fork: inspectFork({
      intact: result.intact,
      cancellans: result.cancellans,
      initialDrop: result.initialDrop,
    }),
    delta: inspectDelta({
      intact: result.intact,
      cancellans: result.cancellans,
      deferredDelta: result.deferredDelta,
    }),
    cache: inspectCache({
      intact: result.intact,
      cancellans: result.cancellans,
      cacheMiss: result.cacheMiss,
    }),
    ttl: inspectTtl({
      intact: result.intact,
      cancellans: result.cancellans,
      ttlAlive: result.ttlAlive,
    }),
    tool: inspectEndConversation({
      intact: result.intact,
      cancellans: result.cancellans,
      endConversation: result.endConversation,
    }),
    press: mapCancellans({
      intact: result.intact,
      cancellans: result.cancellans,
      deferredDelta: result.deferredDelta,
      cacheMiss: result.cacheMiss,
      initialDrop: result.initialDrop,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      cancellans: result.cancellans === true || result.verdict === "cancellans",
    })),
    cachePath: scoreCachePrefix({
      intact: result.intact === true && !result.cancellans,
      cancellans: result.cancellans,
      deferredDelta: result.deferredDelta,
      cacheMiss: result.cacheMiss,
      initialDrop: result.initialDrop,
      endConversation: result.endConversation,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: FOLIO_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): the resume fork does not reproduce a server-gated tool that was in the parent's initial tools array; the first fork request omits it and only later gets deferred_tools_delta, so the prompt-cache prefix misses despite TTL. Invite verify against #94400 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
