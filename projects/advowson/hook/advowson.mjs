#!/usr/bin/env node
/**
 * Advowson — diocesan registry / patronage-desk classifier.
 * A reserved living that silent-collates the built-in is not a hold.
 * Score the presentation or admit vacant.
 *
 *   echo '{"localExists":true,"resolvedBuiltin":true}' | node advowson.mjs
 *   node advowson.mjs ticket.json
 *
 * Idle word is vacant (no name collision; no silent override).
 * Seeded state is reserved / #91005.
 * NEVER idle as "reserved", "collated", "advowson", "built-in",
 * "silent", "presentation", "smutch", "plain", "seated", "bound",
 * "hallmarked", "pointed", "collapsed", "spoiled", "banked",
 * "misstruck", "hunting", "traced".
 *
 * Primary #91005: Workflow({name}) silently resolves to the built-in
 * workflow even when a same-named local ~/.claude/workflows/<name>.js
 * exists — no error, no warning. Tool description says name resolves
 * to "a predefined workflow (built-in or from .claude/workflows/)".
 * In practice the built-in always wins. Explicit
 * Workflow({scriptPath}) correctly runs the local file. Marker in
 * local meta.description never appears in tool Summary. Persisted
 * run script keeps the original built-in schema. Skills that hardcode
 * Invoke: Workflow({ name: "x" }) inherit the trap.
 *
 * Same-class (cite, not primary): #79019 / #75086 StructuredOutput
 * corruption in the Scope phase — the reason a local deep-research
 * override was written.
 *
 * NOT Smutch (#90993 Icon\r crawl). NOT Bitting (#90970 MCP mint).
 * NOT Puncheon (#90962 BOM-less .ps1). NOT Gnomon (#90954 mtime).
 * NOT Spoil (#90943 GIT_INDEX_FILE). NOT Bulla (#90891 MSIX).
 * NOT Carcase (#90867 stealth relaunch). NOT Hydra (#90856 clone).
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "reserved",
  "vacant",
  "presented",
  "collated",
  "built-in-wins",
  "local-ignored",
  "scriptPath-ok",
  "marker-missing",
  "summary-echo",
  "skill-hardcode",
  "name-vs-path",
  "no-warning",
  "deep-research-override",
  "silent-collation",
]);
export const IDLE_WORD = "vacant";
export const SEEDED_WORD = "reserved";
export const HOLD_VERDICTS = Object.freeze([
  "vacant",
  "presented",
  "scriptPath-ok",
]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91005;
export const PRIMARY_ISSUES = Object.freeze([91005]);
export const SAME_CLASS = Object.freeze([79019, 75086]);
export const NOT_PRODUCTS = Object.freeze([
  "smutch",
  "bitting",
  "puncheon",
  "gnomon",
  "spoil",
  "bulla",
  "carcase",
  "hydra",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91005";
export const TITLE =
  "Workflow({name}) silently resolves to the built-in workflow even when a same-named local .claude/workflows/<name>.js exists — no error, no indication";
export const REPORTER = "Habriel";
export const FILED_AT = "2026-08-31T14:59:44Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:linux",
  "area:tools",
]);
export const CLI_VERSION = "2.1.215";
export const PLATFORM = "linux";
export const WORKFLOW_NAME = "deep-research";
export const LOCAL_PATH = "~/.claude/workflows/deep-research.js";
export const META_NAME = "deep-research";
export const PERSISTED_SCRIPT = "workflows/scripts/deep-research-.js";
export const TOOL_DESCRIPTION =
  "a predefined workflow (built-in or from .claude/workflows/)";
export const INVOKE_FORM = 'Invoke: Workflow({ name: "deep-research" })';
export const HUB_LINE =
  "00:50 advowson: a reserved living that silent-collates the built-in is not a hold. Score the presentation or admit vacant.";
export const MARK = "00:50 / hermes catalog #98 / #91005";
export const PHRASE =
  "a reserved living that silent-collates the built-in is not a hold";
export const HYPOTHESIS_NOTE =
  "An advowson is the right of presentation to a living. The crown reserved the name; the patron's local letters sit at the side door. Workflow({name}) silent-collates the built-in incumbent. A reserved living is not a hold until you score the presentation or admit vacant.";
export const CONTRAST_NOTE =
  "This is WORKFLOW NAME RESOLUTION + SILENT BUILT-IN COLLATION + LOCAL ~/.claude/workflows OVERRIDE IGNORED + scriptPath SIDE DOOR. NOT Smutch Icon\\r crawl. NOT Bitting MCP mint exclusivity. NOT Puncheon BOM-less .ps1. NOT Gnomon shared mtime.";
export const FORBIDDEN_IDLE = Object.freeze([
  "reserved",
  "collated",
  "advowson",
  "built-in",
  "silent",
  "presentation",
  "smutch",
  "plain",
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
    name: "",
    localPath: "",
    localExists: null,
    builtinExists: null,
    invokedByName: null,
    invokedByScriptPath: null,
    resolvedBuiltin: null,
    resolvedLocal: null,
    markerInLocal: null,
    markerInSummary: null,
    persistedBuiltinSchema: null,
    noWarning: null,
    skillHardcode: null,
    vacantHold: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedVacant();
}

export function seedVacant() {
  return {
    seed: IDLE_WORD,
    issue: null,
    name: "",
    localPath: "",
    localExists: false,
    builtinExists: false,
    invokedByName: false,
    invokedByScriptPath: false,
    resolvedBuiltin: false,
    resolvedLocal: false,
    markerInLocal: false,
    markerInSummary: false,
    persistedBuiltinSchema: false,
    noWarning: false,
    skillHardcode: false,
    vacantHold: true,
    outputText:
      "living vacant; no local letters of presentation; no built-in incumbent; no silent override; vacant",
  };
}

export function seedReserved() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    name: WORKFLOW_NAME,
    localPath: LOCAL_PATH,
    localExists: true,
    builtinExists: true,
    invokedByName: true,
    invokedByScriptPath: false,
    resolvedBuiltin: true,
    resolvedLocal: false,
    markerInLocal: true,
    markerInSummary: false,
    persistedBuiltinSchema: true,
    noWarning: true,
    skillHardcode: true,
    vacantHold: false,
    cliVersion: CLI_VERSION,
    platform: PLATFORM,
    metaName: META_NAME,
    persistedScript: PERSISTED_SCRIPT,
    toolDescription: TOOL_DESCRIPTION,
    invokeForm: INVOKE_FORM,
    sameClass: [...SAME_CLASS],
    outputText:
      "Workflow({name: \"deep-research\"}) silently resolves to the built-in workflow even when ~/.claude/workflows/deep-research.js exists; tool description says a predefined workflow (built-in or from .claude/workflows/); built-in always wins; local ignored; no error, no warning; unique marker in local meta.description never appears in tool Summary; persisted run script workflows/scripts/deep-research-.js keeps the original built-in schema; Workflow({scriptPath}) correctly runs the local file; skills that hardcode Invoke: Workflow({ name: \"deep-research\" }) inherit the trap; silent-collation; reserved living",
  };
}

export function seedPresented() {
  return {
    seed: "presented",
    issue: FEATURED_ISSUE,
    name: WORKFLOW_NAME,
    localPath: LOCAL_PATH,
    localExists: true,
    builtinExists: true,
    invokedByName: false,
    invokedByScriptPath: true,
    resolvedBuiltin: false,
    resolvedLocal: true,
    markerInLocal: true,
    markerInSummary: true,
    persistedBuiltinSchema: false,
    noWarning: false,
    skillHardcode: false,
    vacantHold: false,
    outputText:
      "Workflow({scriptPath: \"~/.claude/workflows/deep-research.js\"}) presented the local letters; marker in meta.description appears in Summary; local override used; scriptPath-ok; presented",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.advowson && typeof src.advowson === "object" && src.advowson) ||
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
    name: firstText(nested.name, nested.workflow, src.name),
    localPath: firstText(
      nested.localPath,
      nested.local_path,
      nested.scriptPath,
      src.localPath,
    ),
    localExists: firstBool(
      nested.localExists,
      nested.local_exists,
      src.localExists,
    ),
    builtinExists: firstBool(
      nested.builtinExists,
      nested.builtin_exists,
      src.builtinExists,
    ),
    invokedByName: firstBool(
      nested.invokedByName,
      nested.invoked_by_name,
      src.invokedByName,
    ),
    invokedByScriptPath: firstBool(
      nested.invokedByScriptPath,
      nested.invoked_by_script_path,
      src.invokedByScriptPath,
    ),
    resolvedBuiltin: firstBool(
      nested.resolvedBuiltin,
      nested.resolved_builtin,
      src.resolvedBuiltin,
    ),
    resolvedLocal: firstBool(
      nested.resolvedLocal,
      nested.resolved_local,
      src.resolvedLocal,
    ),
    markerInLocal: firstBool(
      nested.markerInLocal,
      nested.marker_in_local,
      src.markerInLocal,
    ),
    markerInSummary: firstBool(
      nested.markerInSummary,
      nested.marker_in_summary,
      src.markerInSummary,
    ),
    persistedBuiltinSchema: firstBool(
      nested.persistedBuiltinSchema,
      nested.persisted_builtin_schema,
      src.persistedBuiltinSchema,
    ),
    noWarning: firstBool(nested.noWarning, nested.no_warning, src.noWarning),
    skillHardcode: firstBool(
      nested.skillHardcode,
      nested.skill_hardcode,
      src.skillHardcode,
    ),
    vacantHold: firstBool(
      nested.vacantHold,
      nested.vacant_hold,
      src.vacantHold,
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

function missingCore(input) {
  return (
    input.localExists == null &&
    input.resolvedBuiltin == null &&
    input.resolvedLocal == null &&
    input.invokedByName == null &&
    input.invokedByScriptPath == null &&
    input.vacantHold == null
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
    return { ...seedReserved(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedReserved(), ...cloned, ...raw };
  }
  if (cloned.seed === "presented" && coreMissing) {
    return { ...seedPresented(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedVacant(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.name, ticket.localPath]
    .filter(Boolean)
    .join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const namedAlarm =
    VERDICTS.includes(named) &&
    named !== IDLE_WORD &&
    named !== SEEDED_WORD &&
    !HOLD_VERDICTS.includes(named);
  const namedHold =
    named === "presented" || named === "scriptPath-ok" || named === IDLE_WORD;
  const localExists =
    row.localExists === true ||
    /localExists|local letters|~\.?\/?\.claude\/workflows|same-named local/i.test(
      text,
    );
  const builtinExists =
    row.builtinExists === true ||
    /builtinExists|built-in incumbent|built-in workflow|crown reserved/i.test(
      text,
    );
  const invokedByName =
    row.invokedByName === true ||
    /Workflow\(\s*\{\s*name|invokedByName|called by name/i.test(text);
  const invokedByScriptPath =
    row.invokedByScriptPath === true ||
    /Workflow\(\s*\{\s*scriptPath|invokedByScriptPath|side door/i.test(text);
  const resolvedBuiltin =
    row.resolvedBuiltin === true ||
    /resolvedBuiltin|always runs the built-in|built-in always wins|silent-collat/i.test(
      text,
    );
  const resolvedLocal =
    row.resolvedLocal === true ||
    /resolvedLocal|correctly ran the (fixed|local)|local override used|presented the local/i.test(
      text,
    );
  const markerInLocal =
    row.markerInLocal === true ||
    /markerInLocal|unique marker|marker in local meta\.description/i.test(text);
  const markerInSummary =
    row.markerInSummary === true ||
    (/markerInSummary|marker.*Summary|marker did show/i.test(text) &&
      !/never (showed|appears)|marker-missing/i.test(text));
  const persistedBuiltinSchema =
    row.persistedBuiltinSchema === true ||
    /persistedBuiltinSchema|original \(unfixed\) schema|original built-in schema|workflows\/scripts\/deep-research/i.test(
      text,
    );
  const noWarning =
    row.noWarning === true ||
    /no-warning|no error, no warning|no indication|silently ignores|silently discard/i.test(
      text,
    );
  const skillHardcode =
    row.skillHardcode === true ||
    /skill-hardcode|Invoke:\s*Workflow\(\s*\{\s*name|hardcode.*Workflow/i.test(
      text,
    );
  const vacantHold =
    row.vacantHold === true ||
    (/living vacant|no silent override|no name collision|no local letters/i.test(
      text,
    ) &&
      !namedAlarm);
  const conflict = localExists && builtinExists;
  const nameHitBuiltin =
    (invokedByName && resolvedBuiltin && !resolvedLocal) ||
    (conflict && resolvedBuiltin && !resolvedLocal && !invokedByScriptPath);
  const scriptPathUsedLocal = invokedByScriptPath && resolvedLocal;
  const vacant =
    !namedAlarm &&
    vacantHold &&
    !nameHitBuiltin &&
    !scriptPathUsedLocal &&
    !resolvedBuiltin;
  const presented =
    !namedAlarm &&
    (namedHold || scriptPathUsedLocal) &&
    scriptPathUsedLocal &&
    !nameHitBuiltin;
  const reserved =
    !namedAlarm &&
    !namedHold &&
    nameHitBuiltin &&
    conflict &&
    !vacant &&
    !presented;
  return {
    localExists,
    builtinExists,
    invokedByName,
    invokedByScriptPath,
    resolvedBuiltin,
    resolvedLocal,
    markerInLocal,
    markerInSummary,
    persistedBuiltinSchema,
    noWarning,
    skillHardcode,
    vacantHold,
    conflict,
    nameHitBuiltin,
    scriptPathUsedLocal,
    vacant,
    presented,
    reserved,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.reserved) chips.push("reserved");
  if (flags.vacant) chips.push("vacant");
  if (flags.presented) chips.push("presented");
  if (flags.reserved || (flags.nameHitBuiltin && flags.noWarning)) {
    chips.push("collated");
  }
  if (flags.nameHitBuiltin && !flags.vacant) chips.push("built-in-wins");
  if (flags.localExists && flags.resolvedBuiltin && !flags.resolvedLocal) {
    chips.push("local-ignored");
  }
  if (flags.scriptPathUsedLocal) chips.push("scriptPath-ok");
  if (flags.markerInLocal && !flags.markerInSummary && !flags.vacant) {
    chips.push("marker-missing");
  }
  if (
    flags.invokedByName &&
    flags.resolvedBuiltin &&
    !flags.markerInSummary &&
    !flags.vacant
  ) {
    chips.push("summary-echo");
  }
  if (flags.skillHardcode && !flags.vacant) chips.push("skill-hardcode");
  if (
    flags.nameHitBuiltin &&
    flags.localExists &&
    !flags.vacant
  ) {
    chips.push("name-vs-path");
  }
  if (flags.noWarning && flags.nameHitBuiltin && !flags.vacant) {
    chips.push("no-warning");
  }
  if (
    (flags.reserved || flags.nameHitBuiltin) &&
    /deep-research/i.test(textOf(cloneTicket(ticket))) &&
    !flags.vacant
  ) {
    chips.push("deep-research-override");
  }
  if (flags.reserved || (flags.nameHitBuiltin && flags.noWarning && !flags.vacant)) {
    chips.push("silent-collation");
  }
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "vacant") {
    reasons.push("living vacant; no local letters; no built-in incumbent");
    reasons.push("hold: this is an honest vacant living, not a reserved collation");
  }
  if (verdict === "presented" || verdict === "scriptPath-ok") {
    reasons.push(
      "scriptPath side door presented the local ~/.claude/workflows file",
    );
    reasons.push("hold: the local letters reached the bishop by the side door");
  }
  if (flags.nameHitBuiltin) {
    reasons.push(
      "Workflow({name}) resolved to the built-in incumbent, not the local file",
    );
  }
  if (flags.localExists && flags.resolvedBuiltin && !flags.resolvedLocal) {
    reasons.push(
      `local ${LOCAL_PATH} exists and is independently loadable, but name resolution ignores it`,
    );
  }
  if (flags.markerInLocal && !flags.markerInSummary) {
    reasons.push(
      "unique marker in local meta.description never appears in the tool Summary",
    );
  }
  if (flags.persistedBuiltinSchema) {
    reasons.push(
      `persisted run script ${PERSISTED_SCRIPT} keeps the original built-in schema`,
    );
  }
  if (flags.noWarning && flags.nameHitBuiltin) {
    reasons.push("no error, no warning, no indication the local file was skipped");
  }
  if (flags.skillHardcode) {
    reasons.push(
      `skills that hardcode ${INVOKE_FORM} inherit the trap; local overrides are unreachable through the normal skill path`,
    );
  }
  if (flags.scriptPathUsedLocal) {
    reasons.push(
      "Workflow({scriptPath}) correctly ran the local file — same marker technique, this time the marker showed",
    );
  }
  if (flags.reserved) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  if (verdict !== "vacant" && flags.nameHitBuiltin) {
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
  if (named === IDLE_WORD && flags.vacant) return "vacant";
  if (named === SEEDED_WORD) return "reserved";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.reserved) return "reserved";
  if (flags.presented) return "presented";
  if (flags.scriptPathUsedLocal) return "scriptPath-ok";
  if (flags.skillHardcode && flags.nameHitBuiltin) return "skill-hardcode";
  if (flags.markerInLocal && !flags.markerInSummary) return "marker-missing";
  if (flags.persistedBuiltinSchema) return "silent-collation";
  if (flags.noWarning && flags.nameHitBuiltin) return "no-warning";
  if (flags.nameHitBuiltin) return "built-in-wins";
  if (flags.vacant) return "vacant";
  return "vacant";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    vacant: verdict === "vacant" || flags.vacant,
    reserved: verdict === "reserved" || flags.reserved,
    presented: verdict === "presented" || flags.presented,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      living: flags.reserved
        ? "the living is reserved to the built-in incumbent"
        : flags.presented
          ? "the side door presented the patron's local letters"
          : "the living hangs vacant; no silent override",
      presentation: flags.localExists
        ? `local letters at ${ticket.localPath || LOCAL_PATH}`
        : "no local letters of presentation on the desk",
      collation: flags.nameHitBuiltin
        ? "Workflow({name}) silent-collates the built-in"
        : flags.scriptPathUsedLocal
          ? "scriptPath collated the local file"
          : "no collation; vacant",
      warning: flags.noWarning && flags.nameHitBuiltin
        ? "no error, no warning, no indication"
        : "honest vacant or an admitted presentation",
      note: flags.reserved
        ? "A reserved living that silent-collates the built-in is not a hold. Score the presentation or admit vacant."
        : flags.presented
          ? "Presented: scriptPath used the local file. Hold."
          : "Vacant: no name collision; no silent override.",
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
  if (name === SEEDED_WORD || name === 91005 || name === "91005") {
    return analyze(seedReserved());
  }
  if (name === "presented" || name === "scriptPath-ok") {
    return analyze(seedPresented());
  }
  if (name === IDLE_WORD || name === "vacant") {
    return analyze(seedVacant());
  }
  return analyze(seedVacant());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.reserved
        ? `reserved bench #${FEATURED_ISSUE}: Workflow({name: "${WORKFLOW_NAME}"}) silent-collates the built-in; local ${LOCAL_PATH} ignored; marker missing from Summary; ${PERSISTED_SCRIPT} keeps built-in schema. ${HYPOTHESIS_NOTE}`
        : result.presented || result.verdict === "scriptPath-ok"
          ? `presented bench. scriptPath used ${LOCAL_PATH}. Marker reached Summary. Hold.`
          : `vacant bench. Idle word ${IDLE_WORD}. No name collision; no silent override.`,
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
