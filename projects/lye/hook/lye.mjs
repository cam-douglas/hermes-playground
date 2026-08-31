#!/usr/bin/env node
/**
 * Lye — fuller's lye vat / scouring-desk classifier.
 * A scrub that strips the relocated address from every child
 * while the parent still writes there is not a hold.
 * Score the vat or admit rinsed.
 *
 *   echo '{"childHasConfigDir":false,"parentWritesRelocated":true}' | node lye.mjs
 *   node lye.mjs ticket.json
 *
 * Idle word is rinsed (scrub on, CLAUDE_CONFIG_DIR still reaches
 * children — 2.1.250 pass-through).
 * Seeded state is scrubbed / #91020.
 * NEVER idle as "scrubbed", "stripped", "lye", "advowson",
 * "reserved", "vacant", "smutch", "plain", "seated", "bound",
 * "hallmarked", "pointed", "collapsed", "spoiled", "banked",
 * "misstruck", "hunting", "traced".
 *
 * Primary #91020: 2.1.251 regression —
 * CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 strips CLAUDE_CONFIG_DIR
 * from hooks and Bash subprocesses. Parent still writes its
 * own state into the relocated CLAUDE_CONFIG_DIR. 2.1.250
 * passes the variable through with scrub enabled. Repro
 * /tmp/scrubprobe SessionStart hook + Bash tool. Nothing
 * printed about the removal; --debug log silent. Fresh empty
 * config directory can exit "Not logged in" after the hook.
 *
 * Same-class (cite, not primary): Pale #90683 silent-absent,
 * Pawl #90784 sticky stop, Ambo #90685 systemMessage non-render,
 * Chatelaine #90647 mcpOAuth nested Keychain, Advowson #91005
 * Workflow name silent built-in. Different problems.
 *
 * NOT Smutch (#90993 Icon\r crawl). NOT Bitting (#90970 MCP mint).
 * NOT Puncheon (#90962 BOM-less .ps1). NOT #91026 virtual-drive
 * folder picker. NOT #91028 MSIX identity sandbox RPC. NOT
 * #91017 stale Desktop session index.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "scrubbed",
  "stripped",
  "relocated-parent",
  "default-home",
  "hook-blind",
  "bash-blind",
  "silent-drop",
  "regression-251",
  "scrub-flag",
  "config-dir-lie",
  "dual-home",
  "unlogged",
  "pass-through-250",
  "not-logged-in",
  "rinsed",
]);
export const IDLE_WORD = "rinsed";
export const SEEDED_WORD = "scrubbed";
export const HOLD_VERDICTS = Object.freeze(["rinsed", "pass-through-250"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91020;
export const PRIMARY_ISSUES = Object.freeze([91020]);
export const SAME_CLASS = Object.freeze([90683, 90784, 90685, 90647, 91005]);
export const NOT_PRODUCTS = Object.freeze([
  "advowson",
  "smutch",
  "bitting",
  "puncheon",
  "pale",
  "pawl",
  "ambo",
  "chatelaine",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91020";
export const TITLE =
  "2.1.251 regression: CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 strips CLAUDE_CONFIG_DIR from hooks and Bash subprocesses";
export const FILED_AT = "2026-08-31T15:46:51Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:security",
  "area:bash",
  "area:hooks",
  "regression",
]);
export const CLI_BAD = "2.1.251";
export const CLI_GOOD = "2.1.250";
export const PLATFORM = "windows";
export const SCRUB_FLAG = "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1";
export const CONFIG_DIR = "CLAUDE_CONFIG_DIR";
export const REPRO_PATH = "/tmp/scrubprobe";
export const PARENT_LISTING = Object.freeze([
  ".claude.json",
  "projects/",
  "sessions/",
]);
export const HUB_LINE =
  "01:50 lye: a scrub that strips the relocated address from every child is not a hold. Score the vat or admit rinsed.";
export const MARK = "01:50 / hermes catalog #99 / #91020";
export const PHRASE =
  "A scrub that strips the relocated address from every child while the parent still writes there is not a hold. Score the vat or admit rinsed.";
export const HYPOTHESIS_NOTE =
  "Treat this as an env-scrub regression in subprocess spawn paths: CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 on 2.1.251 strips CLAUDE_CONFIG_DIR from hooks and Bash while the parent still writes the relocated vat. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is ENV-SCRUB REGRESSION + RELOCATED CLAUDE_CONFIG_DIR STRIPPED FROM CHILDREN + PARENT STILL WRITES THE VAT. NOT Advowson Workflow name silent built-in. NOT Pale silent-absent hooks. NOT Pawl sticky stop. NOT Ambo systemMessage non-render. NOT Chatelaine mcpOAuth Keychain. NOT Smutch Icon\\r. NOT Bitting MCP mint. NOT Puncheon BOM-less .ps1.";
export const FORBIDDEN_IDLE = Object.freeze([
  "scrubbed",
  "stripped",
  "lye",
  "advowson",
  "reserved",
  "vacant",
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
    cliVersion: "",
    scrubEnabled: null,
    parentConfigDir: "",
    parentWritesRelocated: null,
    childHasConfigDir: null,
    hookGrepCount: null,
    bashGrepCount: null,
    relocatedListingIntact: null,
    silentDrop: null,
    debugSilent: null,
    notLoggedIn: null,
    rinseHold: null,
    outputText: "",
  };
}

export function emptyTicket() {
  return seedRinsed();
}

export function seedRinsed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    cliVersion: CLI_GOOD,
    scrubEnabled: true,
    parentConfigDir: REPRO_PATH,
    parentWritesRelocated: true,
    childHasConfigDir: true,
    hookGrepCount: 1,
    bashGrepCount: 1,
    relocatedListingIntact: true,
    silentDrop: false,
    debugSilent: false,
    notLoggedIn: false,
    rinseHold: true,
    outputText:
      "rinsed vat; CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 on 2.1.250; CLAUDE_CONFIG_DIR still reaches SessionStart hook and Bash children; grep '^CLAUDE_CONFIG_DIR=' is 1; env | grep -c CLAUDE_CONFIG_DIR prints 1; pass-through-250; rinsed",
  };
}

export function seedScrubbed() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    cliVersion: CLI_BAD,
    platform: PLATFORM,
    scrubEnabled: true,
    parentConfigDir: REPRO_PATH,
    parentWritesRelocated: true,
    childHasConfigDir: false,
    hookGrepCount: 0,
    bashGrepCount: 0,
    relocatedListingIntact: true,
    silentDrop: true,
    debugSilent: true,
    notLoggedIn: false,
    rinseHold: false,
    reproPath: REPRO_PATH,
    parentListing: [...PARENT_LISTING],
    sameClass: [...SAME_CLASS],
    outputText:
      "2.1.251 regression: CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 strips CLAUDE_CONFIG_DIR from hooks and Bash subprocesses; parent still writes relocated /tmp/scrubprobe (.claude.json, projects/, sessions/); SessionStart hook grep '^CLAUDE_CONFIG_DIR=' is 0; Bash tool env | grep -c CLAUDE_CONFIG_DIR prints 0; children resolve ~/.claude; nothing printed about the removal; --debug log contains no message; dual-home; config-dir-lie; silent-drop; unlogged; hook-blind; bash-blind; scrubbed",
  };
}

export function seedPassThrough() {
  return {
    seed: "pass-through-250",
    cliVersion: CLI_GOOD,
    scrubEnabled: true,
    parentConfigDir: REPRO_PATH,
    parentWritesRelocated: true,
    childHasConfigDir: true,
    hookGrepCount: 1,
    bashGrepCount: 1,
    relocatedListingIntact: true,
    silentDrop: false,
    debugSilent: false,
    notLoggedIn: false,
    rinseHold: true,
    outputText:
      "2.1.250 passes CLAUDE_CONFIG_DIR through with CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1; hook grep 1; Bash grep 1; pass-through-250; rinsed",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.lye && typeof src.lye === "object" && src.lye) ||
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
    cliVersion: firstText(
      nested.cliVersion,
      nested.cli_version,
      nested.version,
      src.cliVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    scrubEnabled: firstBool(
      nested.scrubEnabled,
      nested.scrub_enabled,
      src.scrubEnabled,
    ),
    parentConfigDir: firstText(
      nested.parentConfigDir,
      nested.parent_config_dir,
      nested.relocatedDir,
      src.parentConfigDir,
    ),
    parentWritesRelocated: firstBool(
      nested.parentWritesRelocated,
      nested.parent_writes_relocated,
      src.parentWritesRelocated,
    ),
    childHasConfigDir: firstBool(
      nested.childHasConfigDir,
      nested.child_has_config_dir,
      src.childHasConfigDir,
    ),
    hookGrepCount: firstNum(
      nested.hookGrepCount,
      nested.hook_grep_count,
      src.hookGrepCount,
    ),
    bashGrepCount: firstNum(
      nested.bashGrepCount,
      nested.bash_grep_count,
      src.bashGrepCount,
    ),
    relocatedListingIntact: firstBool(
      nested.relocatedListingIntact,
      nested.relocated_listing_intact,
      src.relocatedListingIntact,
    ),
    silentDrop: firstBool(nested.silentDrop, nested.silent_drop, src.silentDrop),
    debugSilent: firstBool(
      nested.debugSilent,
      nested.debug_silent,
      src.debugSilent,
    ),
    notLoggedIn: firstBool(
      nested.notLoggedIn,
      nested.not_logged_in,
      src.notLoggedIn,
    ),
    rinseHold: firstBool(nested.rinseHold, nested.rinse_hold, src.rinseHold),
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
    input.childHasConfigDir == null &&
    input.parentWritesRelocated == null &&
    input.hookGrepCount == null &&
    input.bashGrepCount == null &&
    input.rinseHold == null &&
    input.scrubEnabled == null
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
    return { ...seedScrubbed(), ...cloned, ...raw };
  }
  if (cloned.seed === SEEDED_WORD && coreMissing) {
    return { ...seedScrubbed(), ...cloned, ...raw };
  }
  if (cloned.seed === "pass-through-250" && coreMissing) {
    return { ...seedPassThrough(), ...cloned, ...raw };
  }
  if (cloned.seed === IDLE_WORD && coreMissing) {
    return { ...seedRinsed(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.cliVersion,
    ticket.parentConfigDir,
  ]
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
  const namedHold = named === IDLE_WORD || named === "pass-through-250";
  const scrubEnabled =
    row.scrubEnabled === true ||
    /CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1|scrubEnabled|scrub on|scrub-flag/i.test(
      text,
    );
  const parentWritesRelocated =
    row.parentWritesRelocated === true ||
    /parent still writes|relocated-parent|relocated CLAUDE_CONFIG_DIR|ls of relocated|\.claude\.json, projects\/, sessions/i.test(
      text,
    );
  const childHasConfigDir =
    row.childHasConfigDir === true ||
    ((/still reaches|pass-through|grep.*is 1|prints 1/i.test(text) &&
      !/prints 0|grep.*is 0|strips CLAUDE_CONFIG_DIR|children lost/i.test(
        text,
      )));
  const childLost =
    row.childHasConfigDir === false ||
    row.hookGrepCount === 0 ||
    row.bashGrepCount === 0 ||
    /strips CLAUDE_CONFIG_DIR|children lost|grep.*is 0|prints 0|hook-blind|bash-blind/i.test(
      text,
    );
  const hookBlind =
    row.hookGrepCount === 0 ||
    /hook grep.*0|SessionStart hook grep.*0|hook-blind/i.test(text);
  const bashBlind =
    row.bashGrepCount === 0 ||
    /Bash tool.*0|grep -c CLAUDE_CONFIG_DIR prints 0|bash-blind/i.test(text);
  const silentDrop =
    row.silentDrop === true ||
    row.debugSilent === true ||
    /nothing printed|no message|--debug log contains no message|silent-drop|unlogged/i.test(
      text,
    );
  const debugSilent =
    row.debugSilent === true ||
    /--debug log contains no message|unlogged|debugSilent/i.test(text);
  const regression251 =
    row.cliVersion === CLI_BAD ||
    /2\.1\.251|regression-251/i.test(text);
  const passThrough250 =
    row.cliVersion === CLI_GOOD ||
    /2\.1\.250|pass-through-250/i.test(text);
  const notLoggedIn =
    row.notLoggedIn === true ||
    /Not logged in|not-logged-in/i.test(text);
  const rinseHold =
    row.rinseHold === true ||
    (/rinsed vat|still reaches|pass-through-250/i.test(text) && !namedAlarm && !childLost);
  const stripped = childLost && !childHasConfigDir;
  const dualHome = parentWritesRelocated && childLost;
  const defaultHome =
    childLost &&
    (/~\.?\/?\.claude|default-home|children resolve/i.test(text) || dualHome);
  const configDirLie = dualHome;
  const rinsed =
    !namedAlarm &&
    rinseHold &&
    !childLost &&
    (childHasConfigDir || row.hookGrepCount === 1 || row.bashGrepCount === 1);
  const scrubbed =
    !namedAlarm &&
    !namedHold &&
    childLost &&
    parentWritesRelocated &&
    !rinsed;
  const passThrough =
    !namedAlarm &&
    passThrough250 &&
    scrubEnabled &&
    !childLost &&
    (childHasConfigDir || rinseHold);
  return {
    scrubEnabled,
    parentWritesRelocated,
    childHasConfigDir: childHasConfigDir && !childLost,
    childLost,
    hookBlind,
    bashBlind,
    silentDrop,
    debugSilent,
    regression251,
    passThrough250,
    notLoggedIn,
    rinseHold,
    stripped,
    dualHome,
    defaultHome,
    configDirLie,
    rinsed,
    scrubbed,
    passThrough,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.scrubbed) chips.push("scrubbed");
  if (flags.rinsed) chips.push("rinsed");
  if (flags.passThrough) chips.push("pass-through-250");
  if (flags.stripped && !flags.rinsed) chips.push("stripped");
  if (flags.parentWritesRelocated && flags.childLost && !flags.rinsed) {
    chips.push("relocated-parent");
  }
  if (flags.defaultHome && !flags.rinsed) chips.push("default-home");
  if (flags.hookBlind && !flags.rinsed) chips.push("hook-blind");
  if (flags.bashBlind && !flags.rinsed) chips.push("bash-blind");
  if (flags.silentDrop && flags.childLost && !flags.rinsed) {
    chips.push("silent-drop");
  }
  if (flags.regression251 && flags.childLost && !flags.rinsed) {
    chips.push("regression-251");
  }
  if (flags.scrubEnabled && flags.childLost && !flags.rinsed) {
    chips.push("scrub-flag");
  }
  if (flags.configDirLie && !flags.rinsed) chips.push("config-dir-lie");
  if (flags.dualHome && !flags.rinsed) chips.push("dual-home");
  if (flags.debugSilent && flags.childLost && !flags.rinsed) {
    chips.push("unlogged");
  }
  if (flags.notLoggedIn && !flags.rinsed) chips.push("not-logged-in");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "rinsed") {
    reasons.push(
      "rinsed vat; CLAUDE_CONFIG_DIR still reaches children under scrub",
    );
    reasons.push("hold: this is an honest 2.1.250 pass-through, not a strip");
  }
  if (verdict === "pass-through-250") {
    reasons.push(
      "2.1.250 passes CLAUDE_CONFIG_DIR through with CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1",
    );
    reasons.push("hold: hook grep 1 and Bash grep 1");
  }
  if (flags.childLost) {
    reasons.push(
      "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 on 2.1.251 strips CLAUDE_CONFIG_DIR from subprocesses Claude Code spawns",
    );
  }
  if (flags.hookBlind) {
    reasons.push(
      `SessionStart hook at ${REPRO_PATH}: grep '^CLAUDE_CONFIG_DIR=' is 0`,
    );
  }
  if (flags.bashBlind) {
    reasons.push("Bash tool: env | grep -c CLAUDE_CONFIG_DIR prints 0");
  }
  if (flags.parentWritesRelocated && flags.childLost) {
    reasons.push(
      `parent still writes relocated ${ticket.parentConfigDir || REPRO_PATH} (${PARENT_LISTING.join(", ")}) while children resolve ~/.claude`,
    );
  }
  if (flags.silentDrop) {
    reasons.push(
      "nothing printed about the removal; --debug log contains no message about it either",
    );
  }
  if (flags.notLoggedIn) {
    reasons.push(
      'fresh empty config directory can exit "Not logged in" after the hook has run',
    );
  }
  if (flags.scrubbed) {
    reasons.push(HYPOTHESIS_NOTE);
  }
  if (verdict !== "rinsed" && flags.childLost) {
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
  if (named === IDLE_WORD && flags.rinsed) return "rinsed";
  if (named === SEEDED_WORD) return "scrubbed";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.scrubbed) return "scrubbed";
  if (flags.passThrough) return "pass-through-250";
  if (flags.rinsed) return "rinsed";
  if (flags.notLoggedIn) return "not-logged-in";
  if (flags.hookBlind && flags.bashBlind && flags.childLost) return "scrubbed";
  if (flags.childLost) return "stripped";
  return "rinsed";
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
    rinsed: verdict === "rinsed" || flags.rinsed,
    scrubbed: verdict === "scrubbed" || flags.scrubbed,
    passThrough: verdict === "pass-through-250" || flags.passThrough,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      vat: flags.scrubbed
        ? "the parent still writes the relocated vat"
        : flags.passThrough || flags.rinsed
          ? "the vat and every hank share the relocated address"
          : "the vat hangs rinsed; no strip",
      hank: flags.childLost
        ? "hooks and Bash lost CLAUDE_CONFIG_DIR"
        : "CLAUDE_CONFIG_DIR still reaches every child",
      scrub: flags.scrubEnabled
        ? "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 is on"
        : "scrub flag is off",
      home: flags.dualHome
        ? "dual-home: parent relocated, children ~/.claude"
        : flags.rinsed || flags.passThrough
          ? "one home: relocated address reaches children"
          : "no dual-home lie",
      note: flags.scrubbed
        ? "A scrub that strips the relocated address from every child while the parent still writes there is not a hold. Score the vat or admit rinsed."
        : flags.passThrough
          ? "Pass-through: 2.1.250 kept CLAUDE_CONFIG_DIR on the children. Hold."
          : "Rinsed: scrub on, address still reaches children.",
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
  if (name === SEEDED_WORD || name === 91020 || name === "91020") {
    return analyze(seedScrubbed());
  }
  if (name === "pass-through-250" || name === CLI_GOOD) {
    return analyze(seedPassThrough());
  }
  if (name === IDLE_WORD || name === "rinsed") {
    return analyze(seedRinsed());
  }
  return analyze(seedRinsed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.verdict === "scrubbed" || (result.scrubbed && result.alarm)
        ? `scrubbed vat #${FEATURED_ISSUE}: ${SCRUB_FLAG} on ${CLI_BAD} strips ${CONFIG_DIR} from hooks and Bash; parent still writes ${REPRO_PATH}. ${HYPOTHESIS_NOTE}`
        : result.verdict === "pass-through-250"
          ? `pass-through vat. ${CLI_GOOD} kept ${CONFIG_DIR} on children under scrub. Hold.`
          : `rinsed vat. Idle word ${IDLE_WORD}. Scrub on; ${CONFIG_DIR} still reaches children.`,
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
