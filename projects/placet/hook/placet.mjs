#!/usr/bin/env node
/**
 * Placet — congregation / assent-desk scoring-desk classifier.
 * A placet that stamps coding when the chamber only assented to
 * the plan is not assent — it is a fiat already enacted. Score
 * the chamber or admit implementation already started.
 *
 *   echo '{"buttonChoice":"Accept","startCodingLanguage":true}' | node placet.mjs
 *   node placet.mjs ticket.json
 *
 * Idle word is withheld (HOLD: plan assented; implementation NOT
 * authorised; no start-coding language; model told to wait).
 * Seeded state is enacted / #92040 (plain Accept still returns
 * start-coding + exited-plan-mode make-edits language).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the chamber withheld
 * implementation or already enacted a fiat.
 *
 * Primary #92040: ExitPlanMode: plain "Accept" tells the model
 * "You can now start coding", authorising implementation the
 * user declined. Reporter renelaerke. Filed 2026-09-04T09:55:26Z.
 * OPEN. Labels: bug, has repro, platform:macos, area:core,
 * area:permissions. Claude Desktop Code tab, claude-opus-5,
 * macOS Darwin 25.6.0, Apple Silicon. Session permission mode
 * Manual. Observed 2026-09-04. Bundle version not surfaced.
 *
 * Hypothesis only (NON-BINDING): ExitPlanMode tool-result
 * template may not branch on the two buttons, so the
 * non-implementing seal still emits start-coding + exited-plan
 * make-edits language. Discard if issue evidence disagrees.
 * Do not claim Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "withheld",
  "enacted",
  "accept-narrow",
  "accept-and-implement",
  "start-coding-language",
  "exited-plan-edits",
  "manual-mode",
  "scope-mismatch",
  "hold",
]);
export const IDLE_WORD = "withheld";
export const SEEDED_WORD = "enacted";
export const HOLD_VERDICTS = Object.freeze(["withheld", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92040;
export const PRIMARY_ISSUES = Object.freeze([92040]);
export const COUSINS = Object.freeze([74256, 90685]);
export const COUSIN_ISSUE = 74256;
export const BACKUPS = Object.freeze([92019, 92014]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92040";
export const TITLE =
  'ExitPlanMode: plain "Accept" tells the model "You can now start coding", authorising implementation the user declined';
export const FILED_AT = "2026-09-04T09:55:26Z";
export const UPDATED_AT = "2026-09-04T09:56:32Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:permissions",
]);
export const REPORTER = "renelaerke";
export const PLATFORM = "macOS Darwin 25.6.0";
export const ARCH = "Apple Silicon";
export const MODEL = "claude-opus-5";
export const HOST = "Claude Desktop Code tab";
export const PERMISSION_MODE = "Manual";
export const OBSERVED = "2026-09-04";
export const AREA = "area:permissions";
export const EVIDENCE = "exitplanmode-accept-authorises-implementation";
export const BUTTON_ACCEPT = "Accept";
export const BUTTON_IMPLEMENT = "Accept and start implementing";
export const START_CODING_PHRASE = "You can now start coding";
export const EXITED_PLAN_EDITS_PHRASE =
  "You can now make edits, run tools, and take actions";
export const APPROVED_PLAN_LEAD =
  "User has approved your plan. You can now start coding. Start with updating your todo list if applicable";
export const PLAN_SAVED_LINE =
  "Your plan has been saved to: ~/.claude/plans/<plan>.md";
export const EXITED_PLAN_HEADING = "## Exited Plan Mode";
export const EXITED_PLAN_BLOCK =
  "You have exited plan mode. You can now make edits, run tools, and take actions.";
export const POST_NUDGE_LEAD =
  "PostToolUse:ExitPlanMode hook additional context: After implementing the plan, follow";
export const INTERRUPT_STEPS =
  "session-metadata call and one read-only file read";
export const PLAN_FILE_COUNT = 6;
export const OPEN_DECISIONS = Object.freeze([
  "which priority to start",
  "the release vehicle",
]);
export const HUB_LINE =
  "20:50 placet: a placet that stamps coding when the chamber only assented to the plan is not assent — it is a fiat already enacted. Score the chamber or admit implementation already started.";
export const MARK = "20:50 / hermes catalog #134 / #92040";
export const PHRASE =
  "Score the chamber or admit implementation already started.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: ExitPlanMode tool-result template may not branch on Accept vs Accept and start implementing, so the narrow seal still emits start-coding + exited-plan make-edits language. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is EXITPLANMODE CONSENT-SCOPE MISMATCH (ACCEPT VS ACCEPT-AND-IMPLEMENT). Claude Desktop Code tab, claude-opus-5, macOS Darwin 25.6.0, Apple Silicon, permission mode Manual. Observed 2026-09-04. The dialog offers Accept and Accept and start implementing. Choosing the narrower Accept still delivers a tool result that says User has approved your plan. You can now start coding plus You have exited plan mode. You can now make edits, run tools, and take actions, then a PostToolUse verification nudge. Session permission mode Manual is not reflected. The plan left two decisions open (which priority to start, and the release vehicle). Reporter interrupted after a session-metadata call and one read-only file read; the plan called for edits across six source files. Reporter renelaerke. Filed 2026-09-04. OPEN, bug, has repro, platform:macos, area:core, area:permissions.";
export const HOLD_RESULT =
  "The user approved the plan and saved it. The user has NOT authorised implementation. Do not edit files or run state-changing tools; wait for explicit direction.";
export const FORBIDDEN_IDLE = Object.freeze([
  "masked",
  "bled",
  "sounded",
  "muted",
  "slipped",
  "fouled",
  "verbatim",
  "mangled",
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
  "Frisket",
  "Tangent",
  "Hawser",
  "Caret",
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
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Libre Baskerville",
  "Karla",
  "IBM Plex Mono",
  "Instrument Serif",
  "Albert Sans",
  "Spline Sans Mono",
  "Spline Sans",
  "Playfair Display",
  "Playfair",
  "DM Sans",
  "Fragment Mono",
  "Fragment",
  "Petrona",
  "Sora",
  "Fira Code",
  "Fraunces",
  "Outfit",
]);
export const NOT_PRODUCTS = Object.freeze([
  "frisket",
  "tangent",
  "hawser",
  "caret",
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
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "pintle",
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
    persistHold: null,
    withheld: null,
    enacted: null,
    buttonChoice: "",
    acceptNarrow: null,
    acceptAndImplement: null,
    planAssented: null,
    implementationAuthorised: null,
    startCodingLanguage: null,
    exitedPlanEdits: null,
    postToolUseNudge: null,
    permissionMode: "",
    platform: "",
    model: "",
    host: "",
    reporter: "",
    toolResultText: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedWithheld() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistHold: true,
    withheld: true,
    enacted: false,
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    acceptAndImplement: false,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: false,
    exitedPlanEdits: false,
    postToolUseNudge: false,
    permissionMode: PERMISSION_MODE,
    platform: PLATFORM,
    model: MODEL,
    host: HOST,
    area: AREA,
    evidence: EVIDENCE,
    toolResultText: HOLD_RESULT,
    outputText:
      "withheld; plan assented; implementation NOT authorised; no start-coding language; model told to wait; idle word withheld",
  };
}

export function seedEnacted() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistHold: false,
    withheld: false,
    enacted: true,
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    acceptAndImplement: false,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    postToolUseNudge: true,
    permissionMode: PERMISSION_MODE,
    platform: PLATFORM,
    model: MODEL,
    host: HOST,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    toolResultText: `${APPROVED_PLAN_LEAD}\n\n${PLAN_SAVED_LINE}\nYou can refer back to it if needed during implementation.\n\n## Approved Plan:\n<full plan text>\n\n${EXITED_PLAN_HEADING}\n\n${EXITED_PLAN_BLOCK}\nThe plan file is located at ~/.claude/plans/<plan>.md if you need to reference it.\n\n${POST_NUDGE_LEAD} <verification_workflow> to verify.`,
    outputText:
      "enacted; #92040; plain Accept still returns You can now start coding and You have exited plan mode. You can now make edits; PostToolUse verification nudge; Manual mode not reflected; renelaerke; claude-opus-5; macOS Darwin 25.6.0; Claude Desktop Code tab; area:permissions",
  };
}

export function seedAcceptNarrow() {
  return {
    ...blankTicket(),
    seed: "accept-narrow",
    source: "atelier",
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    acceptAndImplement: false,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    enacted: true,
    persistHold: false,
    outputText:
      "accept-narrow; user pressed Accept — not Accept and start implementing — and the tool result still authorised implementation",
  };
}

export function seedAcceptAndImplement() {
  return {
    ...blankTicket(),
    seed: "accept-and-implement",
    source: "atelier",
    buttonChoice: BUTTON_IMPLEMENT,
    acceptNarrow: false,
    acceptAndImplement: true,
    planAssented: true,
    implementationAuthorised: true,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    persistHold: false,
    outputText:
      "accept-and-implement; the broader seal Accept and start implementing was the chosen fiat; distinct from the narrow Accept defect",
  };
}

export function seedStartCodingLanguage() {
  return {
    ...blankTicket(),
    seed: "start-coding-language",
    source: "atelier",
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    startCodingLanguage: true,
    planAssented: true,
    implementationAuthorised: false,
    enacted: true,
    persistHold: false,
    toolResultText: APPROVED_PLAN_LEAD,
    outputText:
      "start-coding-language; ExitPlanMode tool result on plain Accept contains You can now start coding",
  };
}

export function seedExitedPlanEdits() {
  return {
    ...blankTicket(),
    seed: "exited-plan-edits",
    source: "atelier",
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    exitedPlanEdits: true,
    planAssented: true,
    implementationAuthorised: false,
    enacted: true,
    persistHold: false,
    toolResultText: EXITED_PLAN_BLOCK,
    outputText:
      "exited-plan-edits; appended Exited Plan Mode block says You can now make edits, run tools, and take actions",
  };
}

export function seedManualMode() {
  return {
    ...blankTicket(),
    seed: "manual-mode",
    source: "atelier",
    permissionMode: PERMISSION_MODE,
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    enacted: true,
    persistHold: false,
    outputText:
      "manual-mode; session permission mode was Manual; the result text is identical regardless and reads as blanket clearance",
  };
}

export function seedScopeMismatch() {
  return {
    ...blankTicket(),
    seed: "scope-mismatch",
    source: "atelier",
    buttonChoice: BUTTON_ACCEPT,
    acceptNarrow: true,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    enacted: true,
    persistHold: false,
    outputText:
      "scope-mismatch; consent granted for scope A (save the plan) and reported to the agent as scope A+B (start coding)",
  };
}

export function seedHold() {
  return {
    ...seedWithheld(),
    seed: "hold",
    outputText:
      "hold; plan assented; implementation NOT authorised; no start-coding language; the chamber holds; idle word withheld",
  };
}

export function seedCousin() {
  return {
    ...seedWithheld(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #74256 PermissionRequest allow for ExitPlanMode discarded so the chooser still blocks; #90685 PermissionRequest systemMessage never rendered at the ExitPlanMode prompt — cite only, not the #92040 Accept-vs-Accept-and-implement tool-result language",
  };
}

export function emptyTicket() {
  return seedWithheld();
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
    persistHold: firstBool(nested.persistHold, src.persistHold),
    withheld: firstBool(nested.withheld, src.withheld),
    enacted: firstBool(nested.enacted, src.enacted),
    buttonChoice: firstText(nested.buttonChoice, src.buttonChoice),
    acceptNarrow: firstBool(nested.acceptNarrow, src.acceptNarrow),
    acceptAndImplement: firstBool(
      nested.acceptAndImplement,
      src.acceptAndImplement,
    ),
    planAssented: firstBool(nested.planAssented, src.planAssented),
    implementationAuthorised: firstBool(
      nested.implementationAuthorised,
      src.implementationAuthorised,
    ),
    startCodingLanguage: firstBool(
      nested.startCodingLanguage,
      src.startCodingLanguage,
    ),
    exitedPlanEdits: firstBool(nested.exitedPlanEdits, src.exitedPlanEdits),
    postToolUseNudge: firstBool(nested.postToolUseNudge, src.postToolUseNudge),
    permissionMode: firstText(nested.permissionMode, src.permissionMode),
    platform: firstText(nested.platform, src.platform),
    model: firstText(nested.model, src.model),
    host: firstText(nested.host, src.host),
    reporter: firstText(nested.reporter, src.reporter),
    toolResultText: firstText(nested.toolResultText, src.toolResultText),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
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
    row.persistHold == null &&
    row.withheld == null &&
    row.enacted == null &&
    !row.buttonChoice &&
    row.acceptNarrow == null &&
    row.acceptAndImplement == null &&
    row.planAssented == null &&
    row.implementationAuthorised == null &&
    row.startCodingLanguage == null &&
    row.exitedPlanEdits == null &&
    row.postToolUseNudge == null &&
    !row.toolResultText
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedWithheld,
  [SEEDED_WORD]: seedEnacted,
  "accept-narrow": seedAcceptNarrow,
  "accept-and-implement": seedAcceptAndImplement,
  "start-coding-language": seedStartCodingLanguage,
  "exited-plan-edits": seedExitedPlanEdits,
  "manual-mode": seedManualMode,
  "scope-mismatch": seedScopeMismatch,
  hold: seedHold,
  cousin: seedCousin,
  74256: seedCousin,
  90685: seedCousin,
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
    return { ...seedEnacted(), ...cloned, ...raw };
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
    ticket.platform,
    ticket.model,
    ticket.host,
    ticket.buttonChoice,
    ticket.permissionMode,
    ticket.toolResultText,
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

function resultHasStartCoding(row) {
  if (row.startCodingLanguage === true) return true;
  const blob = `${row.toolResultText || ""}\n${row.outputText || ""}`;
  return /You can now start coding/i.test(blob);
}

function resultHasExitedEdits(row) {
  if (row.exitedPlanEdits === true) return true;
  const blob = `${row.toolResultText || ""}\n${row.outputText || ""}`;
  return /You can now make edits, run tools, and take actions/i.test(blob);
}

function choseNarrowAccept(row) {
  if (row.acceptNarrow === true) return true;
  if (row.acceptAndImplement === true) return false;
  const button = String(row.buttonChoice || "");
  if (!button) return false;
  if (/Accept and start implementing/i.test(button)) return false;
  return /^Accept$/i.test(button.trim());
}

function choseImplement(row) {
  if (row.acceptAndImplement === true) return true;
  return /Accept and start implementing/i.test(row.buttonChoice || "");
}

function holdPattern(row) {
  return (
    row.planAssented === true &&
    row.implementationAuthorised === false &&
    !resultHasStartCoding(row) &&
    !resultHasExitedEdits(row)
  );
}

function enactedPattern(row) {
  if (row.enacted === true) return true;
  const startOrExit = resultHasStartCoding(row) || resultHasExitedEdits(row);
  if (choseNarrowAccept(row) && startOrExit) return true;
  if (
    row.planAssented === true &&
    row.implementationAuthorised === false &&
    startOrExit
  ) {
    return true;
  }
  return false;
}

export function isWithheld(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.persistHold === true &&
    row.enacted !== true &&
    holdPattern(row)
  ) {
    return true;
  }
  if (holdPattern(row) && row.enacted !== true) return true;
  return false;
}

export function isEnacted(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (enactedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#74256|#90685/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const enactedNow = !cousinOnly && isEnacted(row);
  const withheldNow = !enactedNow && isWithheld(row);
  const acceptNarrow =
    choseNarrowAccept(row) ||
    named === "accept-narrow" ||
    /accept-narrow|plain Accept|narrower option/i.test(text);
  const acceptAndImplement =
    choseImplement(row) ||
    named === "accept-and-implement" ||
    /accept-and-implement|Accept and start implementing/i.test(text);
  const startCodingLanguage =
    resultHasStartCoding(row) ||
    named === "start-coding-language" ||
    /start-coding-language|You can now start coding/i.test(text);
  const exitedPlanEdits =
    resultHasExitedEdits(row) ||
    named === "exited-plan-edits" ||
    /exited-plan-edits|You can now make edits/i.test(text);
  const manualMode =
    named === "manual-mode" ||
    /Manual/i.test(row.permissionMode || "") ||
    /manual-mode|permission mode was Manual|Manual mode not reflected/i.test(text);
  const scopeMismatch =
    named === "scope-mismatch" ||
    (row.planAssented === true &&
      row.implementationAuthorised === false &&
      (startCodingLanguage || exitedPlanEdits)) ||
    /scope-mismatch|scope A\+B|consent granted for scope A/i.test(text);
  const enacted =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (enactedNow || named === SEEDED_WORD || /enacted|#92040/i.test(text));
  const withheld =
    HOLD_VERDICTS.includes(named) ||
    (withheldNow && !enacted);
  return {
    named,
    cousinOnly,
    enactedNow,
    withheldNow,
    acceptNarrow,
    acceptAndImplement,
    startCodingLanguage,
    exitedPlanEdits,
    manualMode,
    scopeMismatch,
    enacted,
    withheld,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.withheld && !flags.enacted) chips.push("withheld");
  if (flags.enacted) chips.push("enacted");
  if (flags.acceptNarrow && flags.enacted) chips.push("accept-narrow");
  if (flags.acceptAndImplement && flags.named === "accept-and-implement") {
    chips.push("accept-and-implement");
  }
  if (flags.startCodingLanguage && flags.enacted) {
    chips.push("start-coding-language");
  }
  if (flags.exitedPlanEdits && flags.enacted) chips.push("exited-plan-edits");
  if (flags.manualMode && flags.enacted) chips.push("manual-mode");
  if (flags.scopeMismatch && flags.enacted) chips.push("scope-mismatch");
  if ((flags.withheld || flags.named === "hold") && !flags.enacted) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "withheld") {
    reasons.push(
      "withheld; plan assented; implementation NOT authorised; no start-coding language; model told to wait",
    );
    reasons.push("hold: the chamber withheld implementation; idle word withheld");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; plan assented; implementation NOT authorised; no start-coding language; the chamber holds",
    );
  }
  if (verdict === "enacted" || flags.enacted) {
    reasons.push(
      "enacted; #92040; plain Accept still returns You can now start coding and You have exited plan mode. You can now make edits",
    );
  }
  if (verdict === "accept-narrow" || (flags.acceptNarrow && flags.enacted)) {
    reasons.push(
      "accept-narrow; user pressed Accept — not Accept and start implementing — and the tool result still authorised implementation",
    );
  }
  if (verdict === "accept-and-implement" || flags.named === "accept-and-implement") {
    reasons.push(
      "accept-and-implement; the broader seal Accept and start implementing was the chosen fiat",
    );
  }
  if (
    verdict === "start-coding-language" ||
    (flags.startCodingLanguage && flags.enacted)
  ) {
    reasons.push(
      "start-coding-language; ExitPlanMode tool result on plain Accept contains You can now start coding",
    );
  }
  if (
    verdict === "exited-plan-edits" ||
    (flags.exitedPlanEdits && flags.enacted)
  ) {
    reasons.push(
      "exited-plan-edits; appended Exited Plan Mode block says You can now make edits, run tools, and take actions",
    );
  }
  if (verdict === "manual-mode" || (flags.manualMode && flags.enacted)) {
    reasons.push(
      "manual-mode; session permission mode was Manual; the result text is identical regardless",
    );
  }
  if (verdict === "scope-mismatch" || (flags.scopeMismatch && flags.enacted)) {
    reasons.push(
      "scope-mismatch; consent granted for scope A (save the plan) and reported to the agent as scope A+B (start coding)",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Placet; cite-only #74256 (PermissionRequest allow for ExitPlanMode discarded; chooser still blocks), #90685 (PermissionRequest systemMessage never rendered at the ExitPlanMode prompt) — different surfaces from #92040 Accept-vs-Accept-and-implement tool-result language; primary stays #92040",
    );
  }
  if (verdict === "enacted" || flags.enacted) {
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
  if (named === IDLE_WORD && (flags.withheld || !flags.enacted)) return "withheld";
  if (named === "hold" && !flags.enacted) return "hold";
  if (named === SEEDED_WORD) return "enacted";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "withheld";
  if (flags.enacted) return "enacted";
  if (flags.withheld) return "withheld";
  return "withheld";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "enacted" || flags.enacted) {
    return {
      case: "enacted — plain Accept stamped start-coding + exited-plan edits",
      button: ticket.buttonChoice || BUTTON_ACCEPT,
      plan: "assented",
      implementation: "fiat reported",
      startCoding: resultHasStartCoding(ticket) ? "present" : "absent",
      exitedEdits: resultHasExitedEdits(ticket) ? "present" : "absent",
      mode: ticket.permissionMode || PERMISSION_MODE,
      mark: "placet enacted; admit implementation already started",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — plan assented; implementation NOT authorised",
      button: BUTTON_ACCEPT,
      plan: "assented",
      implementation: "withheld",
      startCoding: "absent",
      exitedEdits: "absent",
      mode: PERMISSION_MODE,
      mark: "placet hold; the chamber withholds implementation",
      note: "Hold: the chamber withholds.",
    };
  }
  return {
    case: "withheld — plan assented; implementation NOT authorised; no start-coding language",
    button: BUTTON_ACCEPT,
    plan: "assented",
    implementation: "withheld",
    startCoding: "absent",
    exitedEdits: "absent",
    mode: PERMISSION_MODE,
    mark: "placet withheld; idle word withheld",
    note: "Withheld: the chamber withholds implementation.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const enacted = verdict === "enacted" || flags.enacted;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    withheld: verdict === "withheld" || (flags.withheld && !enacted),
    enacted,
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
  if (name === SEEDED_WORD || name === 92040 || name === "92040") {
    return analyze(seedEnacted());
  }
  if (name === "accept-narrow") return analyze(seedAcceptNarrow());
  if (name === "accept-and-implement") return analyze(seedAcceptAndImplement());
  if (name === "start-coding-language") return analyze(seedStartCodingLanguage());
  if (name === "exited-plan-edits") return analyze(seedExitedPlanEdits());
  if (name === "manual-mode") return analyze(seedManualMode());
  if (name === "scope-mismatch") return analyze(seedScopeMismatch());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "withheld" || name === "open") {
    return analyze(seedWithheld());
  }
  if (
    name === 74256 ||
    name === "74256" ||
    name === 90685 ||
    name === "90685" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedWithheld());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "enacted" || (result.enacted && result.alarm)
          ? `enacted placet #${FEATURED_ISSUE}: plain Accept still returns start-coding + exited-plan make-edits language. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Plan assented; implementation NOT authorised. Score the chamber."
            : `withheld placet. Idle word ${IDLE_WORD}. Plan assented; implementation NOT authorised; no start-coding language.`,
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
