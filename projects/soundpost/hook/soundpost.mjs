#!/usr/bin/env node
/**
 * Soundpost — luthier cutaway soundbox classifier.
 * A fallen post is not a hold. Score the plates or admit coupled.
 *
 *   echo '{"cliLspCount":1,"toolSearchLsp":false}' | node soundpost.mjs
 *   node soundpost.mjs ticket.json
 *
 * Idle word is coupled (Desktop spawns + exposes LSP; post couples
 * belly↔back). Seeded state is fallen / #90926.
 * NEVER idle as "soundpost", "seated", "mute", "silent", "empty",
 * "fallen", "sounder", "reed", "lsp", "plugin".
 *
 * Primary #90926: Desktop never registers plugin LSP servers,
 * though the bundled CLI resolves them. claude plugin details
 * csharp-lsp@claude-plugins-official reports LSP servers (1)
 * csharp-ls. Desktop ToolSearch select:WebFetch,LSP,ListSkills
 * → WebFetch✔ ListSkills✔ LSP✘. No csharp-ls process after
 * opening a .cs file. Zero LSP log lines. Plugin load is green:
 * Passing 10 plugin(s) to SDK; reload_plugins 10 plugins,
 * 99 commands, 0 plugin error(s). csharp-ls 0.27.0 over stdio
 * answers workspace/symbol, documentSymbol, hover, references.
 * Synthesized plugin.json drops lspServers on marketplace
 * refresh (keeps four keys) — related, not this bug's root:
 * CLI still resolves from the marketplace entry; Desktop never
 * consumes that resolution.
 *
 * NOT Reed, Sounder #90555, Damper, Callboard #90858, Larder,
 * Census #90927, Flong, Bulla, Trompe, Davy, Scion, Wicket.
 * Same-class cite (not primary): #78604, #84857, #90114,
 * #15148, #86936. Contrast (opposite of zero attempt):
 * #75237 spawn-then-disconnect, #78099 server did start.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "fallen",
  "coupled",
  "mute",
  "advertised",
  "cli-resolved",
  "desktop-deaf",
  "zero-log",
  "toolsearch-miss",
  "no-process",
  "synthesis-drop",
  "plates-uncoupled",
  "healthy-lie",
]);
export const IDLE_WORD = "coupled";
export const SEEDED_WORD = "fallen";
export const HOLD_VERDICTS = Object.freeze(["coupled"]);
export const ALARM_VERDICTS = Object.freeze([
  "fallen",
  "mute",
  "advertised",
  "cli-resolved",
  "desktop-deaf",
  "zero-log",
  "toolsearch-miss",
  "no-process",
  "synthesis-drop",
  "plates-uncoupled",
  "healthy-lie",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90926;
export const PRIMARY_ISSUES = Object.freeze([90926]);
export const SAME_CLASS = Object.freeze([78604, 84857, 90114, 15148, 86936]);
export const CONTRAST_ISSUES = Object.freeze([75237, 78099]);
export const NOT_PRODUCTS = Object.freeze([
  "reed",
  "sounder",
  "damper",
  "callboard",
  "larder",
  "census",
  "flong",
  "bulla",
  "trompe",
  "davy",
  "scion",
  "wicket",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90926";
export const TITLE =
  "Desktop app never registers plugin LSP servers, though the bundled CLI resolves them (csharp-lsp, 1.40609.0 / CCD 2.1.247, Windows)";
export const REPORTER = "volkovprojects";
export const FILED_AT = "2026-08-31T07:46:31Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:lsp",
  "area:plugins",
  "area:desktop",
]);
export const DESKTOP = "1.40609.0";
export const CCD = "2.1.247";
export const NODE = "24.18.1";
export const OS_NAME = "Windows 10 Pro 19045";
export const PLUGIN = "csharp-lsp@claude-plugins-official";
export const PLUGIN_VERSION = "1.0.0";
export const CSHARP_LS = "0.27.0";
export const CSHARP_LS_PATH =
  "C:\\Users\\admin\\.dotnet\\tools\\csharp-ls.exe";
export const LOC = 80000;
export const SOLUTION = "ESS.slnx";
export const CLI_LSP_COUNT = 1;
export const SDK_PLUGIN_COUNT = 10;
export const COMMAND_COUNT = 99;
export const PLUGIN_ERRORS = 0;
export const OFFICIAL_LSP_COUNT = 12;
export const SYNTHESIS_KEPT = Object.freeze([
  "name",
  "description",
  "version",
  "author",
]);
export const SYNTHESIS_DROPPED = Object.freeze([
  "category",
  "strict",
  "lspServers",
]);
export const TOOLSEARCH = Object.freeze({
  WebFetch: true,
  LSP: false,
  ListSkills: true,
});
export const CHILDREN = Object.freeze([
  { processId: 16904, name: "conhost.exe" },
  { processId: 35820, name: "pwsh.exe" },
]);
export const STDIO = Object.freeze({
  workspaceSymbol: 3,
  documentSymbol: 9,
  references: 12,
});
export const HUB_LINE =
  "17:50 soundpost: a fallen post is not a hold. Score the plates or admit coupled.";
export const MARK = "17:50 / hermes catalog #91 / #90926";
export const PHRASE = "a fallen post is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "soundpost",
  "seated",
  "mute",
  "silent",
  "empty",
  "fallen",
  "sounder",
  "reed",
  "lsp",
  "plugin",
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

export function emptyTicket() {
  return seedCoupled();
}

export function seedCoupled() {
  return {
    seed: IDLE_WORD,
    issue: null,
    cliLspCount: CLI_LSP_COUNT,
    toolSearchLsp: true,
    processAlive: true,
    lspLogLines: 1,
    pluginErrors: 0,
    sdkPluginCount: SDK_PLUGIN_COUNT,
    synthesisDropped: false,
    desktopVersion: DESKTOP,
    ccd: CCD,
    plugin: PLUGIN,
    outputText:
      "Desktop exposes LSP; csharp-ls process alive; plates coupled belly to back",
  };
}

export function seedFallen() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    cliLspCount: CLI_LSP_COUNT,
    toolSearchLsp: false,
    processAlive: false,
    lspLogLines: 0,
    pluginErrors: PLUGIN_ERRORS,
    sdkPluginCount: SDK_PLUGIN_COUNT,
    synthesisDropped: true,
    desktopVersion: DESKTOP,
    ccd: CCD,
    node: NODE,
    os: OS_NAME,
    plugin: PLUGIN,
    pluginVersion: PLUGIN_VERSION,
    csharpLs: CSHARP_LS,
    csharpLsPath: CSHARP_LS_PATH,
    loc: LOC,
    solution: SOLUTION,
    commandCount: COMMAND_COUNT,
    officialLspCount: OFFICIAL_LSP_COUNT,
    synthesisKept: [...SYNTHESIS_KEPT],
    synthesisDroppedKeys: [...SYNTHESIS_DROPPED],
    toolSearch: { ...TOOLSEARCH },
    children: CHILDREN.map((row) => ({ ...row })),
    stdio: { ...STDIO },
    outputText:
      "CLI plugin details LSP servers (1) csharp-ls; Desktop ToolSearch WebFetch✔ ListSkills✔ LSP✘; Get-Process csharp-ls empty; zero LSP log lines; Passing 10 plugin(s) to SDK; reload_plugins 10 plugins, 99 commands, 0 plugin error(s)",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.soundpost && typeof src.soundpost === "object" && src.soundpost) ||
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
    cliLspCount: firstNum(
      nested.cliLspCount,
      nested.cli_lsp_count,
      nested.lspServers,
      src.cliLspCount,
    ),
    toolSearchLsp: firstBool(
      nested.toolSearchLsp,
      nested.tool_search_lsp,
      nested.lspTool,
      src.toolSearchLsp,
    ),
    processAlive: firstBool(
      nested.processAlive,
      nested.process_alive,
      nested.csharpLsAlive,
      src.processAlive,
    ),
    lspLogLines: firstNum(
      nested.lspLogLines,
      nested.lsp_log_lines,
      src.lspLogLines,
    ),
    pluginErrors: firstNum(
      nested.pluginErrors,
      nested.plugin_errors,
      src.pluginErrors,
    ),
    sdkPluginCount: firstNum(
      nested.sdkPluginCount,
      nested.sdk_plugin_count,
      src.sdkPluginCount,
    ),
    synthesisDropped: firstBool(
      nested.synthesisDropped,
      nested.synthesis_dropped,
      src.synthesisDropped,
    ),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop,
      src.desktopVersion,
    ),
    ccd: firstText(nested.ccd, nested.cli, src.ccd),
    plugin: firstText(nested.plugin, src.plugin),
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
  if (
    (cloned.issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) &&
    input.cliLspCount == null &&
    input.toolSearchLsp == null
  ) {
    return { ...seedFallen(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && input.cliLspCount == null && input.toolSearchLsp == null) {
    return { ...seedFallen(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && input.cliLspCount == null && input.toolSearchLsp == null) {
    return { ...seedCoupled(), ...cloned, ...raw };
  }
  return { ...emptyTicket(), ...cloned, ...raw };
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = row.outputText || "";
  const cliCount = row.cliLspCount ?? 0;
  const cliResolved =
    cliCount >= 1 ||
    /LSP servers\s*\(\s*1\s*\)|plugin details.*csharp-ls/i.test(text);
  const toolMiss =
    row.toolSearchLsp === false ||
    /LSP\s*✘|LSP\s*\(no match\)|ToolSearch.*LSP/i.test(text);
  const toolHit = row.toolSearchLsp === true;
  const noProc =
    row.processAlive === false ||
    /Get-Process csharp-ls|no csharp-ls process|process empty/i.test(text);
  const procAlive = row.processAlive === true;
  const logLines = row.lspLogLines;
  const zeroLog =
    logLines === 0 ||
    /zero LSP log|no matches|not a single LSP-related line/i.test(text);
  const hasLog = logLines > 0;
  const errors = row.pluginErrors;
  const pluginGreen =
    errors === 0 ||
    /0 plugin error/i.test(text);
  const synthDrop =
    row.synthesisDropped === true ||
    /Synthesized plugin\.json|drops lspServers|keeps four keys/i.test(text);
  const advertised = cliResolved || /12 official|\*-lsp/i.test(text);
  const desktopDeaf = toolMiss && !toolHit;
  const healthyLie = pluginGreen && cliResolved && (toolMiss || noProc || zeroLog);
  const platesUncoupled = cliResolved && (toolMiss || noProc) && !procAlive;
  const mute = advertised && pluginGreen && (toolMiss || noProc);
  const coupled =
    cliResolved && toolHit && procAlive && hasLog && pluginGreen && !toolMiss && !noProc;
  const fallen =
    cliResolved && toolMiss && noProc && zeroLog && pluginGreen && !toolHit && !procAlive;
  return {
    cliResolved,
    toolMiss,
    toolHit,
    noProc,
    procAlive,
    zeroLog,
    hasLog,
    pluginGreen,
    synthDrop,
    advertised,
    desktopDeaf,
    healthyLie,
    platesUncoupled,
    mute,
    coupled,
    fallen,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.fallen) chips.push("fallen");
  if (flags.coupled) chips.push("coupled");
  if (flags.mute && !flags.coupled) chips.push("mute");
  if (flags.advertised) chips.push("advertised");
  if (flags.cliResolved) chips.push("cli-resolved");
  if (flags.desktopDeaf && !flags.coupled) chips.push("desktop-deaf");
  if (flags.zeroLog && !flags.coupled) chips.push("zero-log");
  if (flags.toolMiss && !flags.coupled) chips.push("toolsearch-miss");
  if (flags.noProc && !flags.coupled) chips.push("no-process");
  if (flags.synthDrop) chips.push("synthesis-drop");
  if (flags.platesUncoupled && !flags.coupled) chips.push("plates-uncoupled");
  if (flags.healthyLie && !flags.coupled) chips.push("healthy-lie");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "coupled") {
    reasons.push("Desktop exposes LSP and csharp-ls is alive; soundpost couples belly to back");
    reasons.push("hold: this is a coupled box, not a fallen post");
  }
  if (flags.cliResolved) {
    reasons.push(
      `CLI plugin details ${PLUGIN} reports LSP servers (${ticket.cliLspCount ?? CLI_LSP_COUNT}) csharp-ls`,
    );
  }
  if (flags.toolMiss) {
    reasons.push(
      "Desktop ToolSearch select:WebFetch,LSP,ListSkills → WebFetch✔ ListSkills✔ LSP✘ (no match)",
    );
  }
  if (flags.noProc) {
    reasons.push(
      "Get-Process csharp-ls empty; Claude children are only conhost.exe and pwsh.exe",
    );
  }
  if (flags.zeroLog) {
    reasons.push(
      "grep of %LOCALAPPDATA%\\Claude\\logs for lsp server|LSP servers loaded|lspServers|language server = no matches",
    );
  }
  if (flags.pluginGreen) {
    reasons.push(
      `Passing ${ticket.sdkPluginCount ?? SDK_PLUGIN_COUNT} plugin(s) to SDK; reload_plugins ${ticket.sdkPluginCount ?? SDK_PLUGIN_COUNT} plugins, ${COMMAND_COUNT} commands, 0 plugin error(s)`,
    );
  }
  if (flags.synthDrop) {
    reasons.push(
      "Synthesized plugin.json keeps four keys and drops category, strict, lspServers — related, not this root: CLI still resolves from the marketplace entry",
    );
  }
  if (flags.fallen) {
    reasons.push(
      "csharp-ls 0.27.0 over stdio answers workspace/symbol, documentSymbol, hover, references; binary/PATH/project are not the obstacle",
    );
    reasons.push(
      `All ${OFFICIAL_LSP_COUNT} official *-lsp plugins advertise code intelligence that never engages on Desktop with no error`,
    );
  }
  return reasons;
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  let verdict = "coupled";
  if (seed === IDLE_WORD && flags.coupled) {
    verdict = "coupled";
  } else if (seed === SEEDED_WORD || (flags.fallen && (!seed || seed === "fallen"))) {
    verdict = "fallen";
  } else if (VERDICTS.includes(seed) && chips.includes(seed) && seed !== IDLE_WORD) {
    verdict = seed;
  } else if (flags.fallen) {
    verdict = "fallen";
  } else if (flags.coupled) {
    verdict = "coupled";
  } else if (flags.mute) {
    verdict = "mute";
  } else if (flags.platesUncoupled) {
    verdict = "plates-uncoupled";
  } else if (flags.desktopDeaf) {
    verdict = "desktop-deaf";
  } else if (flags.toolMiss) {
    verdict = "toolsearch-miss";
  } else if (flags.noProc) {
    verdict = "no-process";
  } else if (flags.zeroLog) {
    verdict = "zero-log";
  } else if (flags.synthDrop) {
    verdict = "synthesis-drop";
  } else if (flags.healthyLie) {
    verdict = "healthy-lie";
  } else if (flags.cliResolved && !flags.toolHit) {
    verdict = "cli-resolved";
  }
  const hold = verdict === "coupled";
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    coupled: verdict === "coupled" || flags.coupled,
    fallen: verdict === "fallen" || flags.fallen,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      belly: flags.cliResolved
        ? `CLI plugin details: LSP servers (${ticket.cliLspCount ?? CLI_LSP_COUNT}) csharp-ls`
        : "CLI has not resolved an LSP server",
      back: flags.toolHit
        ? "Desktop ToolSearch exposes LSP"
        : "Desktop ToolSearch WebFetch✔ ListSkills✔ LSP✘",
      post: flags.coupled ? "coupled" : "fallen",
      note: flags.fallen
        ? "CLI resolves the server from the marketplace entry. Desktop never consumes that resolution — no spawn attempt, zero log lines, plugin green."
        : "Soundpost couples spruce belly (CLI) to maple back (Desktop). LSP is exposed and the process is alive.",
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
  if (name === SEEDED_WORD || name === 90926 || name === "90926") {
    return analyze(seedFallen());
  }
  if (name === IDLE_WORD || name === "coupled") {
    return analyze(seedCoupled());
  }
  return analyze(seedCoupled());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.fallen
        ? `fallen soundpost #${FEATURED_ISSUE}: CLI-resolved LSP, Desktop ToolSearch miss, no process, zero log lines, plugin green.`
        : `coupled soundpost. Idle word ${IDLE_WORD}. Plates couple; LSP exposed.`,
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
