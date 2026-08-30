/**
 * Slype — cathedral covered passage
 * from cloister to precinct for a
 * real Claude Code defect: the
 * sandboxed session allow-lists
 * System32 powershell.exe (Windows
 * PowerShell 5.1) and denies
 * pwsh.exe from Program Files
 * (PowerShell 7) with Permission
 * denied / exit 126. The PowerShell
 * tool is dead. Bash exec of the
 * same pwsh.exe also returns 126,
 * even with dangerouslyDisableSandbox
 * true. Legacy powershell.exe in
 * System32 runs in the same session.
 * pwsh runs outside the sandbox on
 * the same machine.
 *
 * A garrison on the roster is not a
 * visiting friar. Score the passage
 * or admit passed.
 *
 * Primary #90676: OPEN, filed
 * 2026-08-30. Title: PowerShell tool:
 * pwsh.exe fails with Permission
 * denied (exit 126) inside sandboxed
 * session, while powershell.exe
 * works fine.
 *
 * Related but DISTINCT (cite as
 * contrast, not as this product):
 *   #90077 opposite pole: hooks
 *     spawn pwsh with no
 *     powershell.exe fallback
 *   #89884 opposite pole: chat
 *     Run button always uses
 *     powershell.exe 5.1
 *   #85475 nearby: hook targeting
 *     Windows App Execution Alias
 *   #78596 nearby: desktop terminal
 *     hardcodes powershell.exe
 *   #77470 nearby: clipboard helper
 *     should prefer pwsh.exe
 *   #86551 nearby but different:
 *     statusline pwsh never exits
 *   openai/codex#38222 restricted
 *     token cannot enumerate under
 *     the user profile
 *   openai/codex#35871 MSIX/Store
 *     pwsh CreateProcessAsUserW
 *     error 5 — label msix-store
 *   openai/codex#37592 sandbox
 *     inconsistently fails to start
 *     PowerShell with error 5
 *
 * Verdicts: passed | 126 |
 *           system32-ok |
 *           programfiles-denied |
 *           sandbox | pwsh-dead |
 *           powershell-ok |
 *           path-blocked |
 *           allowlist-miss |
 *           msix-store
 * Idle word is passed (honest
 * control: pwsh.exe is actually
 * executable in the session).
 * NEVER use passed for a failure.
 *
 * Slack chip + Linear ticket on
 * 126 / programfiles-denied /
 * sandbox / pwsh-dead /
 * path-blocked / allowlist-miss /
 * system32-ok / powershell-ok.
 * GitHub slype-ledger of scored
 * intakes on every score.
 *
 * Priority when multiple match:
 *   unique nearby without the
 *   #90676 triad
 *     (pwshExit 126 + powershellExit
 *     0 + sandbox + outsideOk +
 *     Program Files pwsh + System32
 *     powershell)
 *   keep their own seeds
 *   > 126 (triad)
 *   > programfiles-denied
 *   > sandbox
 *   > pwsh-dead
 *   > path-blocked
 *   > allowlist-miss
 *   > system32-ok
 *   > powershell-ok
 *   > msix-store
 *   > passed
 *
 * Why this is not a clone:
 * NOT Calque — Spanish del false
 *     alias.
 * NOT Sear — Bash set -e inert.
 * NOT Clew — sandbox deny-list
 *     E2BIG.
 * NOT Grille — bypass-permissions
 *     Bash-steered edits.
 * NOT Waif — orphan process tree.
 * NOT Pale — silent-absent hooks.
 * NOT Chatelaine — nested MCP
 *     OAuth.
 * NOT Tally — exit birth-count
 *     false-loss.
 * NOT Cotter — machine-shop
 *     cotter-pin tray.
 * Different UI: cathedral slype,
 * Purbeck-stone undercroft passage,
 * brass house-roster plate, two
 * doors cloister vs precinct.
 * Different idle: passed.
 */

export const VERDICTS = Object.freeze([
  "passed",
  "126",
  "system32-ok",
  "programfiles-denied",
  "sandbox",
  "pwsh-dead",
  "powershell-ok",
  "path-blocked",
  "allowlist-miss",
  "msix-store",
]);
export const IDLE_WORD = "passed";
export const SLACK_VERDICTS = Object.freeze([
  "126",
  "programfiles-denied",
  "sandbox",
  "pwsh-dead",
  "path-blocked",
  "allowlist-miss",
  "system32-ok",
  "powershell-ok",
]);
export const LINEAR_VERDICTS = SLACK_VERDICTS;
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90676;
export const CONTRAST_90077 = 90077;
export const CONTRAST_89884 = 89884;
export const CONTRAST_85475 = 85475;
export const CONTRAST_78596 = 78596;
export const CONTRAST_77470 = 77470;
export const CONTRAST_86551 = 86551;
export const CODEX_RESTRICTED = 38222;
export const CODEX_MSIX = 35871;
export const CODEX_CREATEPROCESS = 37592;
export const RELATED_CALQUE = 90645;
export const RELATED_SEAR = 90611;
export const RELATED_CLEW = 90569;
export const RELATED_GRILLE = 90599;
export const RELATED_WAIF = 90672;
export const RELATED_PALE = 90683;
export const RELATED_CHATELAINE = 90647;
export const RELATED_TALLY = 90692;

export const DEMO_PWSH =
  "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
export const DEMO_POWERSHELL =
  "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
export const DEMO_STDERR = "Permission denied";
export const DEMO_OS = "Windows 11";
export const DEMO_TOOL = "PowerShell";
export const DEMO_DAY = "2026-08-30";
export const DEMO_VERSION = "slype-passage";

const FORBIDDEN_IDLE = Object.freeze([
  "slype",
  "undercroft",
  "narthex",
  "galilee",
  "postern",
  "yett",
  "collet",
  "chuck",
  "mandrel",
  "portcullis",
  "turnstile",
  "lodge",
  "porter",
  "barbican",
  "sallyport",
  "boom",
  "wicket",
  "pale",
  "grille",
  "cotter",
  "empty",
  "silent",
  "mute",
  "idle",
  "squared",
  "bound",
  "girt",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "nested",
  "cut",
  "switched",
  "spilled",
  "true",
  "home",
  "gripped",
  "swung",
  "tally",
  "chatelaine",
  "waif",
  "berth",
  "carrel",
  "calque",
  "sear",
  "clew",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNum(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableNum(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    pwshPath: "",
    powershellPath: "",
    pwshExit: null,
    powershellExit: null,
    pwshStderr: "",
    sandbox: null,
    outsideOk: null,
    dangerouslyDisableSandbox: null,
    tool: "",
    os: "",
    nearby: "",
    nearbySystem32Ok: false,
    nearbyProgramfilesDenied: false,
    nearbySandbox: false,
    nearbyPwshDead: false,
    nearbyPowershellOk: false,
    nearbyPathBlocked: false,
    nearbyAllowlistMiss: false,
    nearbyMsixStore: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.slype && typeof src.slype === "object") return src.slype;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.intake && typeof src.intake === "object") return src.intake;
  if (src.passage && typeof src.passage === "object") return src.passage;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    pwshPath: asText(nested.pwshPath || src.pwshPath || ""),
    powershellPath: asText(nested.powershellPath || src.powershellPath || ""),
    pwshExit: asNullableNum(nested.pwshExit ?? src.pwshExit),
    powershellExit: asNullableNum(nested.powershellExit ?? src.powershellExit),
    pwshStderr: asText(nested.pwshStderr || src.pwshStderr || ""),
    sandbox: asNullableBool(nested.sandbox ?? src.sandbox),
    outsideOk: asNullableBool(nested.outsideOk ?? src.outsideOk),
    dangerouslyDisableSandbox: asNullableBool(
      nested.dangerouslyDisableSandbox ?? src.dangerouslyDisableSandbox,
    ),
    tool: asText(nested.tool || src.tool || ""),
    os: asText(nested.os || src.os || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbySystem32Ok: asBool(nested.nearbySystem32Ok ?? src.nearbySystem32Ok, false),
    nearbyProgramfilesDenied: asBool(
      nested.nearbyProgramfilesDenied ?? src.nearbyProgramfilesDenied,
      false,
    ),
    nearbySandbox: asBool(nested.nearbySandbox ?? src.nearbySandbox, false),
    nearbyPwshDead: asBool(nested.nearbyPwshDead ?? src.nearbyPwshDead, false),
    nearbyPowershellOk: asBool(nested.nearbyPowershellOk ?? src.nearbyPowershellOk, false),
    nearbyPathBlocked: asBool(nested.nearbyPathBlocked ?? src.nearbyPathBlocked, false),
    nearbyAllowlistMiss: asBool(nested.nearbyAllowlistMiss ?? src.nearbyAllowlistMiss, false),
    nearbyMsixStore: asBool(nested.nearbyMsixStore ?? src.nearbyMsixStore, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

function pathLooksProgramFiles(path) {
  const text = asText(path).toLowerCase();
  return text.includes("program files") && text.includes("pwsh");
}

function pathLooksSystem32(path) {
  const text = asText(path).toLowerCase();
  return text.includes("system32") && text.includes("powershell");
}

function stderrLooksDenied(text) {
  return /permission denied/i.test(asText(text));
}

export function isOffSlype(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "35871" ||
    nearby === "msix-store" ||
    nearby === "msix" ||
    nearby === "37592" ||
    nearby === "38222" ||
    nearby === "90077" ||
    nearby === "89884" ||
    nearby === "85475" ||
    nearby === "78596" ||
    nearby === "77470" ||
    nearby === "86551" ||
    nearby === "calque" ||
    nearby === "90645" ||
    nearby === "sear" ||
    nearby === "90611" ||
    nearby === "clew" ||
    nearby === "90569" ||
    nearby === "grille" ||
    nearby === "90599" ||
    nearby === "waif" ||
    nearby === "90672" ||
    nearby === "pale" ||
    nearby === "90683" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "tally" ||
    nearby === "90692" ||
    nearby === "cotter" ||
    row.nearbyMsixStore === true
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.pwshPath ||
    probe.powershellPath ||
    probe.pwshExit != null ||
    probe.powershellExit != null ||
    probe.pwshStderr ||
    probe.sandbox != null ||
    probe.outsideOk != null ||
    probe.dangerouslyDisableSandbox != null ||
    probe.tool ||
    probe.os ||
    probe.nearbySystem32Ok ||
    probe.nearbyProgramfilesDenied ||
    probe.nearbySandbox ||
    probe.nearbyPwshDead ||
    probe.nearbyPowershellOk ||
    probe.nearbyPathBlocked ||
    probe.nearbyAllowlistMiss ||
    probe.nearbyMsixStore ||
    isOffSlype(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const programFilesPwsh = pathLooksProgramFiles(row.pwshPath);
  const system32Powershell = pathLooksSystem32(row.powershellPath);
  const uniqueNearby = Boolean(
    row.nearbySystem32Ok ||
      row.nearbyProgramfilesDenied ||
      row.nearbySandbox ||
      row.nearbyPwshDead ||
      row.nearbyPowershellOk ||
      row.nearbyPathBlocked ||
      row.nearbyAllowlistMiss ||
      row.nearbyMsixStore ||
      isOffSlype(row),
  );
  const triad = Boolean(
    row.pwshExit === 126 &&
      row.powershellExit === 0 &&
      row.sandbox === true &&
      row.outsideOk === true &&
      programFilesPwsh &&
      system32Powershell &&
      !uniqueNearby,
  );
  const honestHold = Boolean(
    row.pwshExit === 0 &&
      !uniqueNearby &&
      !isOffSlype(row) &&
      row.pwshExit !== 126,
  );

  let eventClass = "idle";
  if (isOffSlype(row) && !triad) eventClass = "msix-store";
  else if (row.nearbyProgramfilesDenied && !triad) eventClass = "programfiles-denied";
  else if (row.nearbySandbox && !triad) eventClass = "sandbox";
  else if (row.nearbyPwshDead && !triad) eventClass = "pwsh-dead";
  else if (row.nearbyPathBlocked && !triad) eventClass = "path-blocked";
  else if (row.nearbyAllowlistMiss && !triad) eventClass = "allowlist-miss";
  else if (row.nearbySystem32Ok && !triad) eventClass = "system32-ok";
  else if (row.nearbyPowershellOk && !triad) eventClass = "powershell-ok";
  else if (triad) eventClass = "126";
  else if (programFilesPwsh && row.pwshExit === 126) eventClass = "programfiles-denied";
  else if (row.sandbox === true && row.outsideOk === true && row.pwshExit === 126) {
    eventClass = "sandbox";
  } else if (/powershell/i.test(row.tool) && row.pwshExit === 126) eventClass = "pwsh-dead";
  else if (row.pwshExit === 126 && stderrLooksDenied(row.pwshStderr)) eventClass = "path-blocked";
  else if (row.pwshExit === 126) eventClass = "allowlist-miss";
  else if (system32Powershell && row.powershellExit === 0 && row.pwshExit !== 0) {
    eventClass = "system32-ok";
  } else if (row.powershellExit === 0 && row.pwshExit !== 0 && row.pwshExit != null) {
    eventClass = "powershell-ok";
  } else if (honestHold || isIdle(row)) eventClass = "passed";
  else eventClass = "passed";

  return {
    programFilesPwsh,
    system32Powershell,
    uniqueNearby,
    triad,
    honestHold,
    offSlype: isOffSlype(row),
    eventClass,
    pwshExit: row.pwshExit,
    powershellExit: row.powershellExit,
    sandbox: row.sandbox,
    outsideOk: row.outsideOk,
    dangerouslyDisableSandbox: row.dangerouslyDisableSandbox,
    pwshPath: row.pwshPath,
    powershellPath: row.powershellPath,
    pwshStderr: row.pwshStderr,
    tool: row.tool,
    os: row.os,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "passed";
  const facts = analyze(row);
  if (!facts.triad) {
    if (facts.offSlype) return "msix-store";
    if (row.nearbyProgramfilesDenied) return "programfiles-denied";
    if (row.nearbySandbox) return "sandbox";
    if (row.nearbyPwshDead) return "pwsh-dead";
    if (row.nearbyPathBlocked) return "path-blocked";
    if (row.nearbyAllowlistMiss) return "allowlist-miss";
    if (row.nearbySystem32Ok) return "system32-ok";
    if (row.nearbyPowershellOk) return "powershell-ok";
  }
  if (facts.triad) return "126";
  if (facts.programFilesPwsh && row.pwshExit === 126) return "programfiles-denied";
  if (row.sandbox === true && row.outsideOk === true && row.pwshExit === 126) return "sandbox";
  if (/powershell/i.test(row.tool) && row.pwshExit === 126) return "pwsh-dead";
  if (row.pwshExit === 126 && stderrLooksDenied(row.pwshStderr)) return "path-blocked";
  if (row.pwshExit === 126) return "allowlist-miss";
  if (facts.system32Powershell && row.powershellExit === 0 && row.pwshExit !== 0) {
    return "system32-ok";
  }
  if (row.powershellExit === 0 && row.pwshExit !== 0 && row.pwshExit != null) {
    return "powershell-ok";
  }
  if (row.pwshExit === 0) return "passed";
  return "passed";
}

export function feedOf(kind) {
  if (kind === "126") {
    return "● 126 · Program Files pwsh.exe exits 126 Permission denied inside the sandbox · System32 powershell.exe succeeds in the same session · primary #90676";
  }
  if (kind === "programfiles-denied") {
    return "● Programfiles-denied · visiting-friar door 126s · Program Files PowerShell 7 pwsh.exe is the denied path";
  }
  if (kind === "sandbox") {
    return "● Sandbox · the block is the Claude Code sandboxed session, not the OS install · pwsh runs in a normal terminal on the same machine";
  }
  if (kind === "pwsh-dead") {
    return "● Pwsh-dead · the PowerShell tool targets pwsh 7 and is dead because the sandbox 126s that binary";
  }
  if (kind === "path-blocked") {
    return "● Path-blocked · sandbox restricts subprocess execution to system-path binaries and does not allow-list pwsh.exe";
  }
  if (kind === "allowlist-miss") {
    return "● Allowlist-miss · pwsh is missing from the sandbox allow-list / system-path roster";
  }
  if (kind === "system32-ok") {
    return "● System32-ok · garrison door opens · System32 powershell.exe (5.1) runs; that is not proof pwsh is allowed";
  }
  if (kind === "powershell-ok") {
    return "● Powershell-ok · Bash plus powershell.exe works · contrast, not a hold";
  }
  if (kind === "msix-store") {
    return "● Msix-store · Codex #35871 CreateProcessAsUserW error 5 on MSIX/Store pwsh · labeled contrast, not this defect";
  }
  return "● Passed · pwsh.exe is actually executable in the session · idle word is passed";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "126" || facts.triad) {
    reasons.push(
      "#90676 pwsh.exe from Program Files exits 126 Permission denied inside the sandbox; powershell.exe from System32 succeeds in the same session",
    );
  }
  if (row.pwshPath) reasons.push(`pwsh path ${row.pwshPath}`);
  if (row.powershellPath) reasons.push(`powershell path ${row.powershellPath}`);
  if (row.pwshExit != null) reasons.push(`pwsh exit ${row.pwshExit}`);
  if (row.powershellExit != null) reasons.push(`powershell exit ${row.powershellExit}`);
  if (row.pwshStderr) reasons.push(`pwsh stderr ${row.pwshStderr}`);
  if (facts.sandbox === true) {
    reasons.push("block is the Claude Code sandboxed session, not the OS install");
  }
  if (facts.outsideOk === true) reasons.push("pwsh runs outside the sandbox on the same machine");
  if (facts.dangerouslyDisableSandbox === true) {
    reasons.push("dangerouslyDisableSandbox true still 126s pwsh.exe");
  }
  if (row.tool) reasons.push(`tool ${row.tool}`);
  if (row.os) reasons.push(`os ${row.os}`);
  if (kind === "system32-ok") {
    reasons.push("System32 powershell.exe (5.1) runs; that is not proof pwsh is allowed");
  }
  if (kind === "programfiles-denied") {
    reasons.push("Program Files PowerShell 7 pwsh.exe is the denied path");
  }
  if (kind === "pwsh-dead") {
    reasons.push("the PowerShell tool is dead because it targets pwsh 7");
  }
  if (kind === "powershell-ok") {
    reasons.push("Bash plus powershell.exe works; contrast, not a hold");
  }
  if (kind === "path-blocked") {
    reasons.push("sandbox restricts subprocesses to system-path binaries and does not allow-list pwsh.exe");
  }
  if (kind === "allowlist-miss") {
    reasons.push("pwsh is missing from the sandbox allow-list / system-path roster");
  }
  if (facts.offSlype || kind === "msix-store") {
    reasons.push(
      "msix-store nearby: openai/codex#35871 CreateProcessAsUserW error 5 on MSIX/Store pwsh — labeled, not this defect. Also not Calque / Sear / Clew / Grille / Waif / Pale / Chatelaine / Tally / Cotter",
    );
  }
  if (kind === "passed") {
    reasons.push(
      "pwsh.exe is actually executable in the session, or the idle board; idle word is passed",
    );
  }
  return reasons;
}

function slackCopy(kind, facts) {
  if (kind === "126") {
    return `Slype 126 · pwsh ${facts.pwshExit} · powershell ${facts.powershellExit} · sandbox session · #90676`;
  }
  if (kind === "programfiles-denied") {
    return "Slype programfiles-denied · visiting-friar door 126s · Program Files pwsh.exe";
  }
  if (kind === "sandbox") {
    return "Slype sandbox · session sandbox, not the OS · pwsh runs outside";
  }
  if (kind === "pwsh-dead") {
    return "Slype pwsh-dead · PowerShell tool targets pwsh 7 and is dead";
  }
  if (kind === "path-blocked") {
    return "Slype path-blocked · system-path allow-list · pwsh not on it";
  }
  if (kind === "allowlist-miss") {
    return "Slype allowlist-miss · pwsh missing from sandbox allow-list";
  }
  if (kind === "system32-ok") {
    return "Slype system32-ok · garrison door opens · not proof pwsh is allowed";
  }
  if (kind === "powershell-ok") {
    return "Slype powershell-ok · Bash plus powershell.exe works · contrast";
  }
  return "";
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const alarm = SLACK_VERDICTS.includes(kind);
  return {
    product: "slype",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    passed: kind === "passed",
    "126": kind === "126",
    "system32-ok": kind === "system32-ok",
    "programfiles-denied": kind === "programfiles-denied",
    sandbox: kind === "sandbox",
    "pwsh-dead": kind === "pwsh-dead",
    "powershell-ok": kind === "powershell-ok",
    "path-blocked": kind === "path-blocked",
    "allowlist-miss": kind === "allowlist-miss",
    "msix-store": kind === "msix-store",
    alarm,
    slack: alarm,
    linear: alarm,
    github: true,
    eventClass: facts.eventClass,
    thisBug: kind !== "passed" && kind !== "msix-store",
    offSlype: facts.offSlype,
    slackCopy: slackCopy(kind, facts),
    facts: {
      pwshPath: facts.pwshPath,
      powershellPath: facts.powershellPath,
      pwshExit: facts.pwshExit,
      powershellExit: facts.powershellExit,
      pwshStderr: facts.pwshStderr,
      sandbox: facts.sandbox,
      outsideOk: facts.outsideOk,
      dangerouslyDisableSandbox: facts.dangerouslyDisableSandbox,
      tool: facts.tool,
      os: facts.os,
      triad: facts.triad,
      offSlype: facts.offSlype,
      programFilesPwsh: facts.programFilesPwsh,
      system32Powershell: facts.system32Powershell,
      nearbySystem32Ok: probe.nearbySystem32Ok,
      nearbyProgramfilesDenied: probe.nearbyProgramfilesDenied,
      nearbySandbox: probe.nearbySandbox,
      nearbyPwshDead: probe.nearbyPwshDead,
      nearbyPowershellOk: probe.nearbyPowershellOk,
      nearbyPathBlocked: probe.nearbyPathBlocked,
      nearbyAllowlistMiss: probe.nearbyAllowlistMiss,
      nearbyMsixStore: probe.nearbyMsixStore,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  return boardResult(kind, row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function passedOf(probe = {}) {
  return classify(probe) === "passed";
}

export function flagsOf(probe = {}) {
  return analyze(probe);
}

export function reasonsList(probe = {}) {
  return reasonsOf(probe, classify(probe));
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    slype: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedPassed() {
  return baseSeed("passed-hold", FEATURED_ISSUE, {
    source: "honest control: pwsh.exe is actually executable in the session",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 0,
    powershellExit: 0,
    pwshStderr: "",
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: false,
    tool: DEMO_TOOL,
    os: DEMO_OS,
  });
}

export function seedControl() {
  return seedPassed();
}

export function seedReset() {
  return { action: "bail", slype: emptyProbe() };
}

export function seed126() {
  return baseSeed("90676-126", FEATURED_ISSUE, {
    source: "primary #90676 Program Files pwsh.exe exits 126 Permission denied; System32 powershell.exe succeeds",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
  });
}

export function seed90676() {
  return seed126();
}

export function seedSystem32Ok() {
  return baseSeed("90676-system32-ok", FEATURED_ISSUE, {
    source: "System32 powershell.exe (5.1) runs; that is not proof pwsh is allowed",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbySystem32Ok: true,
  });
}

export function seedProgramfilesDenied() {
  return baseSeed("90676-programfiles-denied", FEATURED_ISSUE, {
    source: "Program Files PowerShell 7 pwsh.exe is the denied path",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbyProgramfilesDenied: true,
  });
}

export function seedSandbox() {
  return baseSeed("90676-sandbox", FEATURED_ISSUE, {
    source: "the block is the Claude Code sandboxed session, not the OS install",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbySandbox: true,
  });
}

export function seedPwshDead() {
  return baseSeed("90676-pwsh-dead", FEATURED_ISSUE, {
    source: "the PowerShell tool targets pwsh 7 and is dead",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbyPwshDead: true,
  });
}

export function seedPowershellOk() {
  return baseSeed("90676-powershell-ok", FEATURED_ISSUE, {
    source: "Bash plus powershell.exe works; contrast, not a hold",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: "Bash",
    os: DEMO_OS,
    nearbyPowershellOk: true,
  });
}

export function seedPathBlocked() {
  return baseSeed("90676-path-blocked", FEATURED_ISSUE, {
    source: "sandbox restricts subprocesses to system-path binaries and does not allow-list pwsh.exe",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbyPathBlocked: true,
  });
}

export function seedAllowlistMiss() {
  return baseSeed("90676-allowlist-miss", FEATURED_ISSUE, {
    source: "pwsh is missing from the sandbox allow-list / system-path roster",
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 126,
    powershellExit: 0,
    pwshStderr: DEMO_STDERR,
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: true,
    tool: DEMO_TOOL,
    os: DEMO_OS,
    nearbyAllowlistMiss: true,
  });
}

export function seedMsixStore() {
  return baseSeed("msix-store-35871", CODEX_MSIX, {
    source: "NOT this: openai/codex#35871 CreateProcessAsUserW error 5 on MSIX/Store pwsh",
    nearby: "35871",
    nearbyMsixStore: true,
    pwshPath: "C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.0.0_x64__8wekyb3d8bbwe\\pwsh.exe",
    powershellPath: DEMO_POWERSHELL,
    pwshExit: 5,
    powershellExit: 0,
    pwshStderr: "CreateProcessAsUserW error 5",
    sandbox: true,
    outsideOk: true,
    dangerouslyDisableSandbox: false,
    tool: DEMO_TOOL,
    os: DEMO_OS,
  });
}

const SEEDS = {
  passed: seedPassed,
  control: seedPassed,
  healthy: seedPassed,
  hold: seedPassed,
  126: seed126,
  "126": seed126,
  90676: seed126,
  "90676": seed126,
  "system32-ok": seedSystem32Ok,
  system32ok: seedSystem32Ok,
  "programfiles-denied": seedProgramfilesDenied,
  programfilesdenied: seedProgramfilesDenied,
  sandbox: seedSandbox,
  "pwsh-dead": seedPwshDead,
  pwshdead: seedPwshDead,
  "powershell-ok": seedPowershellOk,
  powershellok: seedPowershellOk,
  "path-blocked": seedPathBlocked,
  pathblocked: seedPathBlocked,
  "allowlist-miss": seedAllowlistMiss,
  allowlistmiss: seedAllowlistMiss,
  "msix-store": seedMsixStore,
  msixstore: seedMsixStore,
  35871: seedMsixStore,
  "35871": seedMsixStore,
  msix: seedMsixStore,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, slype: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const slype = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || slype.session),
    issue: asIssue(src.issue ?? slype.issue),
    source: asText(src.source || slype.source),
    slype,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.slype);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return boardResult("passed", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedPassed().slype;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "126" || verb === "incident" || verb === "90676") {
    probe = seed126().slype;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-slype") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseSlypeJson(raw) {
  if (raw && typeof raw === "object") {
    if (
      raw.slype ||
      raw.probe ||
      raw.intake ||
      raw.passage ||
      raw.pwshPath ||
      raw.powershellPath ||
      raw.pwshExit != null ||
      raw.powershellExit != null
    ) {
      return cloneProbe({ ...raw, scored: true });
    }
  }
  const text = asText(raw).trim();
  if (!text) return emptyProbe();
  try {
    return parseSlypeJson(JSON.parse(text));
  } catch {
    return emptyProbe();
  }
}

export function emptyAction(verb = "idle") {
  return { action: verb, slype: emptyProbe() };
}
