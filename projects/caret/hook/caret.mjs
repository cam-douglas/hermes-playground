#!/usr/bin/env node
/**
 * Caret — proof-desk / typesetter-caret argv classifier.
 * A caret that doubles the carets before the password reaches
 * the server is not a faithful handoff — it is a reparse already
 * mangled. Score the argv or admit the wrapper already careted.
 *
 *   echo '{"configuredPassword":"P@ss^&w0rd","receivedPassword":"P@ss&w0rd"}' | node caret.mjs
 *   node caret.mjs ticket.json
 *
 * Idle word is verbatim (HOLD: configured args reach the MCP
 * server unchanged). Seeded state is mangled / #91526 (cmd.exe
 * /d /s /c around npx reparses metacharacters in password args).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Fake demo passwords only (P@ss^&w0rd). Score fixture strings
 * for whether the argv is verbatim or already careted.
 *
 * Primary #91526: Windows Claude Code CLI corrupts stdio MCP
 * password arguments when launching npx through cmd.exe.
 * Reporter Maomaoxion. Filed 2026-09-02T14:33:51Z. OPEN.
 * Labels: bug, has-repro, platform:windows, area:mcp.
 *
 * Hypothesis only (NON-BINDING): Windows stdio MCP launch path
 * serializes the args array into shell text for cmd.exe /d /s /c
 * around the npx.cmd shim; cmd.exe then reparses ^ & | < > %
 * before the MCP server sees argv. Codex CLI does not add this
 * wrapper. Discard if issue evidence disagrees. Do not claim
 * Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "verbatim",
  "mangled",
  "careted",
  "reparsed",
  "cmd-wrapper",
  "npx-shim",
  "metachar",
  "password-split",
  "extra-caret",
  "node-bypass",
  "hold",
]);
export const IDLE_WORD = "verbatim";
export const SEEDED_WORD = "mangled";
export const HOLD_VERDICTS = Object.freeze(["verbatim", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91526;
export const PRIMARY_ISSUES = Object.freeze([91526]);
export const COUSINS = Object.freeze([58510, 91581, 90495]);
export const COUSIN_ISSUE = 58510;
export const BACKUPS = Object.freeze([
  { name: "Hawser", issue: 91578 },
  { name: "Frisket", issue: 91574 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91526";
export const TITLE =
  "[BUG] Windows: Claude Code CLI corrupts stdio MCP password arguments when launching npx through cmd.exe";
export const FILED_AT = "2026-09-02T14:33:51Z";
export const UPDATED_AT = "2026-09-02T15:04:35Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:mcp",
]);
export const REPORTER = "Maomaoxion";
export const PLATFORM = "Windows 11 (native, not WSL)";
export const AREA = "area:mcp";
export const EVIDENCE = "cmd.exe-npx-stdio-mcp-password-reparse";
export const MCP_SERVER = "universal-db-mcp";
export const TRANSPORT = "stdio";
export const COMMAND_NPX = "npx";
export const COMMAND_NODE = "node";
export const WRAPPER = "cmd.exe /d /s /c";
export const DEMO_PASSWORD = "P@ss^&w0rd";
export const RECEIVED_CONSUMED = "P@ss&w0rd";
export const RECEIVED_EXTRA = "P@ss^^&w0rd";
export const RECEIVED_SPLIT = "P@ss^";
export const METACHARS = Object.freeze(["^", "&", "|", "<", ">", "%"]);
export const CHILD_CMDLINE =
  'cmd.exe /d /s /c "npx ^"universal-db-mcp^" ... ^"--password^" ^"P@ss^^&w0rd^" ..."';
export const HUB_LINE =
  "07:50 caret: a caret that doubles the carets before the password reaches the server is not a faithful handoff — it is a reparse already mangled. Score the argv or admit the wrapper already careted.";
export const MARK = "07:50 / hermes catalog #130 / #91526";
export const PHRASE =
  "Score the argv or admit the wrapper already careted.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: Windows stdio MCP launch path serializes the args array into shell text for cmd.exe /d /s /c around the npx.cmd shim; cmd.exe then reparses ^ & | < > % before the MCP server sees argv. Codex CLI does not add this wrapper. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is WINDOWS STDIO MCP PASSWORD ARGUMENTS CORRUPTED WHEN CLAUDE CODE LAUNCHES NPX THROUGH CMD.EXE /D /S /C; AREA:MCP; PLATFORM:WINDOWS. On native Windows, MCP config with command \"npx\" is launched through cmd.exe. Args containing cmd metacharacters (^ & | < > %) are reparsed before they reach the MCP server. Demo password P@ss^&w0rd (FAKE) does not survive. Observed child cmdline: cmd.exe /d /s /c \"npx ^\"universal-db-mcp^\" ... ^\"--password^\" ^\"P@ss^^&w0rd^\" ...\". Extra caret escaping can sometimes compensate for one parse layer but is inconsistent. Codex CLI does not add this wrapper. Workaround: command \"node\" with an absolute path to the MCP entry bypasses the npx.cmd/cmd.exe shim. MCP server universal-db-mcp; transport stdio; Windows 11 native not WSL. Reporter Maomaoxion. Filed 2026-09-02. OPEN, bug, has-repro, platform:windows, area:mcp.";
export const FORBIDDEN_IDLE = Object.freeze([
  "moored",
  "aloft",
  "resolved",
  "literal",
  "sealed",
  "blanked",
  "attested",
  "usurped",
  "swaged",
  "torn",
  "homed",
  "crossed",
  "armed",
  "unheard",
]);
export const BANNED_NAMES = Object.freeze([
  "Buoy",
  "Solecism",
  "Coffer",
  "Codicil",
  "Crimp",
  "Jackfield",
  "Tocsin",
  "Bolter",
  "Deadeye",
  "Reglet",
  "Reliquary",
  "Annunciator",
  "Caisson",
  "Spindle",
  "Knell",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Petrona",
  "Sora",
  "Fira Code",
  "Fira",
  "Source Serif 4",
  "Work Sans",
  "Inconsolata",
  "Spectral",
  "Karla",
  "IBM Plex Mono",
  "Cormorant Garamond",
  "Cormorant",
  "Figtree",
  "Azeret Mono",
  "Azeret",
  "Newsreader",
  "Manrope",
  "JetBrains Mono",
  "JetBrains",
  "Brygada 1918",
  "Brygada",
  "Atkinson Hyperlegible",
  "Atkinson",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
]);
export const NOT_PRODUCTS = Object.freeze([
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
]);

function firstText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return null;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    title: "",
    url: "",
    source: "",
    isolation: "",
    cousin: "",
    persistArgv: null,
    verbatim: null,
    mangled: null,
    configuredPassword: "",
    receivedPassword: "",
    wrapper: "",
    cmdWrapped: null,
    reparsed: null,
    careted: null,
    npxShim: null,
    metachar: null,
    passwordSplit: null,
    extraCaret: null,
    nodeBypass: null,
    command: "",
    childCmdline: "",
    mcpServer: "",
    transport: "",
    metachars: "",
    platform: "",
    area: "",
    evidence: "",
    reporter: "",
    outputText: "",
  };
}

export function seedVerbatim() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistArgv: true,
    verbatim: true,
    mangled: false,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: DEMO_PASSWORD,
    wrapper: "",
    cmdWrapped: false,
    reparsed: false,
    careted: false,
    npxShim: false,
    metachar: false,
    passwordSplit: false,
    extraCaret: false,
    nodeBypass: false,
    command: COMMAND_NODE,
    mcpServer: MCP_SERVER,
    transport: TRANSPORT,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "verbatim; configured args reach the MCP server unchanged; idle word verbatim",
  };
}

export function seedMangled() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistArgv: false,
    verbatim: false,
    mangled: true,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: RECEIVED_CONSUMED,
    wrapper: WRAPPER,
    cmdWrapped: true,
    reparsed: true,
    careted: true,
    npxShim: true,
    metachar: true,
    passwordSplit: false,
    extraCaret: true,
    nodeBypass: true,
    command: COMMAND_NPX,
    childCmdline: CHILD_CMDLINE,
    mcpServer: MCP_SERVER,
    transport: TRANSPORT,
    metachars: METACHARS.join(" "),
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    reporter: REPORTER,
    outputText:
      "mangled; #91526; cmd.exe /d /s /c around npx; FAKE password P@ss^&w0rd reparsed before universal-db-mcp; Maomaoxion; Windows 11 native; area:mcp",
  };
}

export function seedCareted() {
  return {
    ...blankTicket(),
    seed: "careted",
    source: "atelier",
    careted: true,
    cmdWrapped: true,
    mangled: true,
    persistArgv: false,
    wrapper: WRAPPER,
    outputText:
      "careted; wrapper already doubled the carets; cmd.exe /d /s /c serialized ^\"P@ss^^&w0rd^\"",
  };
}

export function seedReparsed() {
  return {
    ...blankTicket(),
    seed: "reparsed",
    source: "atelier",
    reparsed: true,
    cmdWrapped: true,
    mangled: true,
    persistArgv: false,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: RECEIVED_CONSUMED,
    outputText:
      "reparsed; cmd.exe consumed the caret escape; configured P@ss^&w0rd arrived as P@ss&w0rd",
  };
}

export function seedCmdWrapper() {
  return {
    ...blankTicket(),
    seed: "cmd-wrapper",
    source: "atelier",
    cmdWrapped: true,
    wrapper: WRAPPER,
    command: COMMAND_NPX,
    mangled: true,
    persistArgv: false,
    childCmdline: CHILD_CMDLINE,
    outputText:
      "cmd-wrapper; Claude Code launches npx through cmd.exe /d /s /c; Codex CLI does not add this wrapper",
  };
}

export function seedNpxShim() {
  return {
    ...blankTicket(),
    seed: "npx-shim",
    source: "atelier",
    npxShim: true,
    command: COMMAND_NPX,
    cmdWrapped: true,
    mangled: true,
    persistArgv: false,
    outputText:
      "npx-shim; npx.cmd batch shim forces the cmd.exe hop; bare npx is not node.exe",
  };
}

export function seedMetachar() {
  return {
    ...blankTicket(),
    seed: "metachar",
    source: "atelier",
    metachar: true,
    metachars: METACHARS.join(" "),
    configuredPassword: DEMO_PASSWORD,
    mangled: true,
    persistArgv: false,
    outputText:
      "metachar; cmd.exe metacharacters ^ & | < > % in MCP args are reparsed, not passed literally",
  };
}

export function seedPasswordSplit() {
  return {
    ...blankTicket(),
    seed: "password-split",
    source: "atelier",
    passwordSplit: true,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: RECEIVED_SPLIT,
    metachar: true,
    mangled: true,
    persistArgv: false,
    outputText:
      "password-split; unescaped & splits the FAKE password at a cmd.exe operator; received P@ss^",
  };
}

export function seedExtraCaret() {
  return {
    ...blankTicket(),
    seed: "extra-caret",
    source: "atelier",
    extraCaret: true,
    careted: true,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: RECEIVED_EXTRA,
    mangled: true,
    persistArgv: false,
    outputText:
      "extra-caret; an extra ^ remains after one parse layer; received P@ss^^&w0rd; layer count is unpredictable",
  };
}

export function seedNodeBypass() {
  return {
    ...blankTicket(),
    seed: "node-bypass",
    source: "atelier",
    nodeBypass: true,
    command: COMMAND_NODE,
    cmdWrapped: false,
    npxShim: false,
    mangled: true,
    persistArgv: false,
    outputText:
      "node-bypass; workaround: command node with an absolute path to universal-db-mcp/dist/index.js bypasses the npx.cmd/cmd.exe shim",
  };
}

export function seedHold() {
  return {
    ...seedVerbatim(),
    seed: "hold",
    outputText:
      "hold; configured args reach the MCP server unchanged; the galley holds; idle word verbatim",
  };
}

export function seedCousin() {
  return {
    ...seedVerbatim(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #58510 Windows npx spawn ENOENT — cite only, not the #91526 cmd.exe password reparse",
  };
}

export function emptyTicket() {
  return seedVerbatim();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistArgv: firstBool(nested.persistArgv, src.persistArgv),
    verbatim: firstBool(nested.verbatim, src.verbatim),
    mangled: firstBool(nested.mangled, src.mangled),
    configuredPassword: firstText(
      nested.configuredPassword,
      src.configuredPassword,
    ),
    receivedPassword: firstText(
      nested.receivedPassword,
      src.receivedPassword,
    ),
    wrapper: firstText(nested.wrapper, src.wrapper),
    cmdWrapped: firstBool(nested.cmdWrapped, src.cmdWrapped),
    reparsed: firstBool(nested.reparsed, src.reparsed),
    careted: firstBool(nested.careted, src.careted),
    npxShim: firstBool(nested.npxShim, src.npxShim),
    metachar: firstBool(nested.metachar, src.metachar),
    passwordSplit: firstBool(nested.passwordSplit, src.passwordSplit),
    extraCaret: firstBool(nested.extraCaret, src.extraCaret),
    nodeBypass: firstBool(nested.nodeBypass, src.nodeBypass),
    command: firstText(nested.command, src.command),
    childCmdline: firstText(nested.childCmdline, src.childCmdline),
    mcpServer: firstText(nested.mcpServer, src.mcpServer),
    transport: firstText(nested.transport, src.transport),
    metachars: firstText(nested.metachars, src.metachars),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    reporter: firstText(nested.reporter, src.reporter),
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
  const row = input && typeof input === "object" ? input : {};
  return (
    row.persistArgv == null &&
    row.verbatim == null &&
    row.mangled == null &&
    row.cmdWrapped == null &&
    row.reparsed == null &&
    row.careted == null &&
    !row.configuredPassword &&
    !row.receivedPassword
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedVerbatim,
  [SEEDED_WORD]: seedMangled,
  careted: seedCareted,
  reparsed: seedReparsed,
  "cmd-wrapper": seedCmdWrapper,
  "npx-shim": seedNpxShim,
  metachar: seedMetachar,
  "password-split": seedPasswordSplit,
  "extra-caret": seedExtraCaret,
  "node-bypass": seedNodeBypass,
  hold: seedHold,
  cousin: seedCousin,
  58510: seedCousin,
  91581: seedCousin,
  90495: seedCousin,
};

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
    return { ...seedMangled(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.cousin,
    ticket.seed,
    ticket.reporter,
    ticket.wrapper,
    ticket.childCmdline,
    ticket.configuredPassword,
    ticket.receivedPassword,
    ticket.command,
    ticket.platform,
    ticket.area,
    ticket.evidence,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function passwordsDiverge(row) {
  if (!row.configuredPassword || !row.receivedPassword) return false;
  return row.configuredPassword !== row.receivedPassword;
}

export function isVerbatim(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.persistArgv === true &&
    row.mangled !== true &&
    !passwordsDiverge(row) &&
    row.cmdWrapped !== true
  ) {
    return true;
  }
  return false;
}

export function isMangled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.mangled === true ||
    passwordsDiverge(row) ||
    row.careted === true ||
    (row.persistArgv === false && row.cmdWrapped === true) ||
    (row.reparsed === true && row.verbatim === false)
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#58510|#91581|#90495/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const mangledNow = !cousinOnly && isMangled(row);
  const verbatimNow = !mangledNow && isVerbatim(row);
  const careted =
    row.careted === true ||
    named === "careted" ||
    /careted|already careted|doubled the carets|P@ss\^\^&w0rd/i.test(text);
  const reparsed =
    row.reparsed === true ||
    named === "reparsed" ||
    passwordsDiverge(row) ||
    /reparsed|consumed the caret|arrived as P@ss&w0rd/i.test(text);
  const cmdWrapper =
    row.cmdWrapped === true ||
    named === "cmd-wrapper" ||
    /cmd-wrapper|cmd\.exe \/d \/s \/c/i.test(text);
  const npxShim =
    row.npxShim === true ||
    named === "npx-shim" ||
    /npx-shim|npx\.cmd/i.test(text);
  const metachar =
    row.metachar === true ||
    named === "metachar" ||
    /metachar|metacharacters \^ & \||\^ & \| < > %/i.test(text);
  const passwordSplit =
    row.passwordSplit === true ||
    named === "password-split" ||
    row.receivedPassword === RECEIVED_SPLIT ||
    /password-split|splits the FAKE password|received P@ss\^$/im.test(text);
  const extraCaret =
    row.extraCaret === true ||
    named === "extra-caret" ||
    row.receivedPassword === RECEIVED_EXTRA ||
    /extra-caret|extra \^ remains|received P@ss\^\^&w0rd/i.test(text);
  const nodeBypass =
    row.nodeBypass === true ||
    named === "node-bypass" ||
    /node-bypass|command node with an absolute path/i.test(text);
  const mangled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (mangledNow || named === SEEDED_WORD || /mangled|#91526/i.test(text));
  const verbatim =
    named === IDLE_WORD ||
    named === "hold" ||
    (verbatimNow && !mangled);
  return {
    named,
    cousinOnly,
    mangledNow,
    verbatimNow,
    careted,
    reparsed,
    cmdWrapper,
    npxShim,
    metachar,
    passwordSplit,
    extraCaret,
    nodeBypass,
    mangled,
    verbatim,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.verbatim && !flags.mangled) chips.push("verbatim");
  if (flags.mangled) chips.push("mangled");
  if (flags.careted && flags.mangled) chips.push("careted");
  if (flags.reparsed && flags.mangled) chips.push("reparsed");
  if (flags.cmdWrapper && flags.mangled) chips.push("cmd-wrapper");
  if (flags.npxShim && flags.mangled) chips.push("npx-shim");
  if (flags.metachar && flags.mangled) chips.push("metachar");
  if (flags.passwordSplit && flags.mangled) chips.push("password-split");
  if (flags.extraCaret && flags.mangled) chips.push("extra-caret");
  if (flags.nodeBypass && flags.mangled) chips.push("node-bypass");
  if ((flags.verbatim || flags.named === "hold") && !flags.mangled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "verbatim") {
    reasons.push(
      "verbatim; configured args reach the MCP server unchanged",
    );
    reasons.push("hold: the galley is a faithful handoff; idle word verbatim");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; configured args reach the MCP server unchanged; the galley holds",
    );
  }
  if (verdict === "mangled" || flags.mangled) {
    reasons.push(
      "mangled; #91526; cmd.exe /d /s /c around npx; FAKE password P@ss^&w0rd reparsed",
    );
  }
  if (flags.careted || verdict === "careted") {
    reasons.push(
      "careted; wrapper already doubled the carets; cmd.exe /d /s /c serialized ^\"P@ss^^&w0rd^\"",
    );
  }
  if (flags.reparsed || verdict === "reparsed") {
    reasons.push(
      "reparsed; cmd.exe consumed the caret escape; configured P@ss^&w0rd arrived as P@ss&w0rd",
    );
  }
  if (flags.cmdWrapper || verdict === "cmd-wrapper") {
    reasons.push(
      "cmd-wrapper; Claude Code launches npx through cmd.exe /d /s /c; Codex CLI does not add this wrapper",
    );
  }
  if (flags.npxShim || verdict === "npx-shim") {
    reasons.push(
      "npx-shim; npx.cmd batch shim forces the cmd.exe hop; bare npx is not node.exe",
    );
  }
  if (flags.metachar || verdict === "metachar") {
    reasons.push(
      "metachar; cmd.exe metacharacters ^ & | < > % in MCP args are reparsed, not passed literally",
    );
  }
  if (flags.passwordSplit || verdict === "password-split") {
    reasons.push(
      "password-split; unescaped & splits the FAKE password at a cmd.exe operator; received P@ss^",
    );
  }
  if (flags.extraCaret || verdict === "extra-caret") {
    reasons.push(
      "extra-caret; an extra ^ remains after one parse layer; received P@ss^^&w0rd; layer count is unpredictable",
    );
  }
  if (flags.nodeBypass || verdict === "node-bypass") {
    reasons.push(
      "node-bypass; workaround: command node with an absolute path to universal-db-mcp/dist/index.js bypasses the npx.cmd/cmd.exe shim",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Caret; cite-only #58510 Windows npx spawn ENOENT / #91581 CLAUDE_CODE_SHELL_PREFIX MCP spawn / #90495 exec-form hook args dropped through bash.exe — primary stays #91526",
    );
  }
  if (verdict === "mangled" || flags.mangled) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (!HOLD_VERDICTS.includes(verdict)) {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.verbatim || !flags.mangled)) return "verbatim";
  if (named === "hold" && !flags.mangled) return "hold";
  if (named === SEEDED_WORD) return "mangled";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "verbatim";
  if (flags.mangled) return "mangled";
  if (flags.verbatim) return "verbatim";
  return "verbatim";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "mangled" || flags.mangled) {
    return {
      case: "mangled — cmd.exe reparse already careted the password",
      configured: ticket.configuredPassword || DEMO_PASSWORD,
      received: ticket.receivedPassword || RECEIVED_CONSUMED,
      wrapper: WRAPPER,
      survival: 0,
      mark: "caret mangled; admit the wrapper already careted",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — configured args reach the server unchanged",
      configured: ticket.configuredPassword || DEMO_PASSWORD,
      received: ticket.receivedPassword || DEMO_PASSWORD,
      wrapper: "none",
      survival: 100,
      mark: "caret hold; the galley holds",
      note: "Hold: the galley holds.",
    };
  }
  return {
    case: "verbatim — configured args reach the MCP server unchanged",
    configured: ticket.configuredPassword || DEMO_PASSWORD,
    received: ticket.receivedPassword || DEMO_PASSWORD,
    wrapper: "none",
    survival: 100,
    mark: "caret verbatim; idle word verbatim",
    note: "Verbatim: the galley holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const mangled = verdict === "mangled" || flags.mangled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    verbatim: verdict === "verbatim" || (flags.verbatim && !mangled),
    mangled,
    careted: flags.careted && mangled,
    reparsed: flags.reparsed && mangled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: deskOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91526 || name === "91526") {
    return analyze(seedMangled());
  }
  if (name === "careted") return analyze(seedCareted());
  if (name === "reparsed") return analyze(seedReparsed());
  if (name === "cmd-wrapper") return analyze(seedCmdWrapper());
  if (name === "npx-shim") return analyze(seedNpxShim());
  if (name === "metachar") return analyze(seedMetachar());
  if (name === "password-split") return analyze(seedPasswordSplit());
  if (name === "extra-caret") return analyze(seedExtraCaret());
  if (name === "node-bypass") return analyze(seedNodeBypass());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "verbatim" || name === "open") {
    return analyze(seedVerbatim());
  }
  if (
    name === 58510 ||
    name === "58510" ||
    name === 91581 ||
    name === "91581" ||
    name === 90495 ||
    name === "90495" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedVerbatim());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "mangled" || (result.mangled && result.alarm)
          ? `mangled caret #${FEATURED_ISSUE}: Windows Claude Code CLI corrupts stdio MCP password arguments when launching npx through cmd.exe. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. configured args reach the MCP server unchanged. Score the argv."
            : `verbatim caret. Idle word ${IDLE_WORD}. configured args reach the MCP server unchanged.`,
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

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
