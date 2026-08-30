/**
 * Pinfold — an English village
 * livestock pound / dry-stone fold
 * for a real Claude Code defect:
 * the PowerShell tool's harness-
 * composed inline command
 * `pwsh -NoProfile -NonInteractive
 * -ExecutionPolicy Bypass -Command
 * <utf8 preamble>; <body>;
 * <epilogue>` matches Defender's
 * Trojan:Win32/FileFix.BBA!MTB
 * behavioral signature on the
 * CmdLine resource (not a file).
 * Spawn is blocked. The model and
 * user only see
 * `EPERM: operation not permitted,
 * uv_spawn '...pwsh.exe'`. No
 * stderr. No AV hint. Short
 * commands and the identical
 * logic materialized as a .ps1
 * invoked by path run clean.
 *
 * A penned spawn is not a hold.
 * Score the fold or admit penned.
 *
 * Primary #90706: OPEN, filed
 * 2026-08-30. Title: Windows
 * Defender FileFix signature
 * blocks the PowerShell tool's
 * composed inline commands;
 * surfaces only as bare
 * 'EPERM uv_spawn pwsh.exe'.
 * Labels: bug, platform:windows,
 * area:bash. Claude Code desktop,
 * Windows 11 Pro, pwsh 7.6.5
 * (WindowsApps alias), Defender
 * real-time protection default.
 *
 * Same-class (cite, not other
 * products):
 *   #65627 AV "PowerShell 脚本
 *     执行检测" intercepts Node
 *     uv_spawn; all Shell EPERM.
 *     Same surface (AV→EPERM),
 *     broader (all commands).
 *   openai/codex#15423 tool-
 *     generated PowerShell blocked
 *     as Trojan:Win32/ClickFix.SA!A
 *     (ClickFix family).
 *   openai/codex#31419 Defender
 *     flags unsigned command line
 *     as Trojan:Win32/ClickFix.DE!MTB;
 *     CmdLine resource; 1116/1117.
 *   openai/codex#26218 Defender
 *     Severe from pwsh reflection
 *     (Trojan:Win32/Steanoz.Z!MTB);
 *     `pwsh.exe -Command` + inline.
 *
 * Nearby, not this:
 *   #90676 Slype — sandbox 126 on
 *     Program Files pwsh.exe.
 *
 * Why this is not a clone:
 * NOT Slype — sandbox path policy
 *     vs AV cmdline signature.
 *     Slype exit 126; Pinfold
 *     spawn never starts (EPERM).
 * NOT Escutcheon — Linux sandbox
 *     empty tmpfs over /run/user
 *     hides D-Bus/libsecret.
 * NOT Gasket — sandbox.network
 *     .strictAllowlist discarded.
 * NOT Calque — PowerShell safety
 *     guard treating Spanish "del"
 *     as Remove-Item alias.
 * NOT Palimpsest — PreToolUse
 *     updatedInput whole-replace
 *     dropping timeout.
 * NOT Fob / Chatelaine —
 *     Keychain litter / nested
 *     MCP OAuth. Not AV.
 * Different problem: harness-
 * composed long -Command matches
 * FileFix paste-attack shape;
 * spawn blocked; surfaces as
 * bare EPERM.
 * Different UI: outdoor village
 * pinfold at dusk. Different
 * idle: penned.
 *
 * Verdicts: penned | flagged |
 *           eperm-bare |
 *           cmdline-shape |
 *           filefix | toast-only |
 *           billed-retry |
 *           script-clears |
 *           events-1116 |
 *           undiagnosed
 * Idle word is penned (honest
 * control: short command line,
 * or identical logic as .ps1
 * invoked by path; spawn ok;
 * no FileFix). NEVER use penned
 * for a failure.
 */

export const VERDICTS = Object.freeze([
  "penned",
  "flagged",
  "eperm-bare",
  "cmdline-shape",
  "filefix",
  "toast-only",
  "billed-retry",
  "script-clears",
  "events-1116",
  "undiagnosed",
]);
export const IDLE_WORD = "penned";
export const ALARM_VERDICTS = Object.freeze([
  "flagged",
  "eperm-bare",
  "cmdline-shape",
  "filefix",
  "toast-only",
  "billed-retry",
  "events-1116",
  "undiagnosed",
]);
export const FEATURED_ISSUE = 90706;
export const SAME_CLASS_65627 = 65627;
export const CODEX_15423 = 15423;
export const CODEX_31419 = 31419;
export const CODEX_26218 = 26218;
export const RELATED_SLYPE = 90676;
export const RELATED_ESCUTCHEON = 90717;
export const RELATED_PALIMPSEST = 90725;
export const RELATED_CALQUE = 90645;
export const RELATED_GASKET = 90355;

export const DEMO_COMPOSED =
  "pwsh -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command \"$p='C:\\\\Users\\\\user\\\\AppData\\\\Local\\\\Temp\\\\agent-patch.txt'; $b=[IO.File]::ReadAllBytes($p); $s=[Text.Encoding]::UTF8.GetString($b); $s=$s.Replace('old','new'); [IO.File]::WriteAllBytes($p,[Text.Encoding]::UTF8.GetBytes($s))\"";
export const DEMO_SHORT = 'pwsh -NoProfile -Command "Get-Date"';
export const DEMO_PS1 = "pwsh -File C:\\Users\\user\\AppData\\Local\\Temp\\agent-patch.ps1";
export const DEMO_EPERM =
  "EPERM: operation not permitted, uv_spawn 'C:\\Users\\user\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe'";
export const DEMO_THREAT = "Trojan:Win32/FileFix.BBA!MTB";
export const DEMO_RESOURCE = "CmdLine";
export const DEMO_PATH =
  "C:\\Users\\user\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe";
export const DEMO_VERSION = "pwsh 7.6.5";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "pinfold-yard";

const FORBIDDEN_IDLE = Object.freeze([
  "pinfold",
  "palimpsest",
  "underwrit",
  "escutcheon",
  "plated",
  "lacuna",
  "collated",
  "ambo",
  "unheard",
  "slype",
  "passed",
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
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "heard",
  "clear",
  "paired",
  "empty",
  "mute",
  "idle",
  "silent",
  "calque",
  "gasket",
  "fob",
  "chatelaine",
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

function asEvents(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const n = Number(item);
        return Number.isFinite(n) ? n : String(item);
      })
      .filter((item) => item !== "");
  }
  if (typeof value === "number" && Number.isFinite(value)) return [value];
  const text = asText(value);
  if (!text) return [];
  return text
    .split(/[^\d]+/)
    .map((part) => Number(part))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    composedCommand: "",
    threatName: "",
    resourceType: "",
    spawnError: "",
    spawnPath: "",
    events: [],
    didThreatExecute: null,
    fileQuarantined: null,
    invokedAs: "",
    bodyKind: "",
    userSawToast: null,
    modelSawHint: null,
    spawnOk: null,
    retriesBilled: null,
    version: "",
    nearby: "",
    nearbyFlagged: false,
    nearbyEpermBare: false,
    nearbyCmdlineShape: false,
    nearbyFilefix: false,
    nearbyToastOnly: false,
    nearbyBilledRetry: false,
    nearbyScriptClears: false,
    nearbyEvents1116: false,
    nearbyUndiagnosed: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.pinfold && typeof src.pinfold === "object") return src.pinfold;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.fold && typeof src.fold === "object") return src.fold;
  if (src.yard && typeof src.yard === "object") return src.yard;
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
    composedCommand: asText(nested.composedCommand || src.composedCommand || ""),
    threatName: asText(nested.threatName || src.threatName || ""),
    resourceType: asText(nested.resourceType || src.resourceType || ""),
    spawnError: asText(nested.spawnError || src.spawnError || ""),
    spawnPath: asText(nested.spawnPath || src.spawnPath || ""),
    events: asEvents(nested.events ?? src.events ?? []),
    didThreatExecute: asNullableBool(nested.didThreatExecute ?? src.didThreatExecute),
    fileQuarantined: asNullableBool(nested.fileQuarantined ?? src.fileQuarantined),
    invokedAs: asText(nested.invokedAs || src.invokedAs || ""),
    bodyKind: asText(nested.bodyKind || src.bodyKind || ""),
    userSawToast: asNullableBool(nested.userSawToast ?? src.userSawToast),
    modelSawHint: asNullableBool(nested.modelSawHint ?? src.modelSawHint),
    spawnOk: asNullableBool(nested.spawnOk ?? src.spawnOk),
    retriesBilled: asNullableBool(nested.retriesBilled ?? src.retriesBilled),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyFlagged: asBool(nested.nearbyFlagged ?? src.nearbyFlagged, false),
    nearbyEpermBare: asBool(nested.nearbyEpermBare ?? src.nearbyEpermBare, false),
    nearbyCmdlineShape: asBool(nested.nearbyCmdlineShape ?? src.nearbyCmdlineShape, false),
    nearbyFilefix: asBool(nested.nearbyFilefix ?? src.nearbyFilefix, false),
    nearbyToastOnly: asBool(nested.nearbyToastOnly ?? src.nearbyToastOnly, false),
    nearbyBilledRetry: asBool(nested.nearbyBilledRetry ?? src.nearbyBilledRetry, false),
    nearbyScriptClears: asBool(nested.nearbyScriptClears ?? src.nearbyScriptClears, false),
    nearbyEvents1116: asBool(nested.nearbyEvents1116 ?? src.nearbyEvents1116, false),
    nearbyUndiagnosed: asBool(nested.nearbyUndiagnosed ?? src.nearbyUndiagnosed, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function looksBypassCommand(command) {
  const text = asText(command);
  return /ExecutionPolicy\s+Bypass/i.test(text) && /(?:^|[\s-])Command\b/i.test(text);
}

export function looksBytePatch(command, bodyKind = "") {
  const text = `${asText(command)} ${asText(bodyKind)}`;
  return /ReadAllBytes|WriteAllBytes|\[IO\.File\]|byte-read|byte-write|byte-patch|file-surgery/i.test(
    text,
  );
}

export function looksLongInline(command, bodyKind = "") {
  return looksBypassCommand(command) && looksBytePatch(command, bodyKind);
}

export function looksEperm(error) {
  const text = asText(error);
  return /EPERM/i.test(text) && /uv_spawn/i.test(text) && /pwsh/i.test(text);
}

export function looksFileFix(threat) {
  return /FileFix\.BBA!MTB/i.test(asText(threat));
}

export function looksCmdLine(resource) {
  return /CmdLine/i.test(asText(resource));
}

export function looksPs1Path(invokedAs, command) {
  const invoked = asText(invokedAs).toLowerCase();
  if (invoked === "ps1-path" || invoked === "ps1" || invoked.includes(".ps1")) return true;
  return /(?:^|[\s-])File\s+\S+\.ps1/i.test(asText(command));
}

export function looksShortCommand(command, invokedAs) {
  if (looksPs1Path(invokedAs, command)) return false;
  const text = asText(command);
  if (!text) return true;
  if (looksBypassCommand(text) || looksBytePatch(text)) return false;
  return text.length < 180 || /Get-Date|Write-Output|Get-ChildItem/i.test(text);
}

export function eventsHas1116(events) {
  return asEvents(events).some((n) => n === 1116 || n === 1117);
}

export function isOffPinfold(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "escutcheon" ||
    nearby === "90717" ||
    nearby === "palimpsest" ||
    nearby === "90725" ||
    nearby === "calque" ||
    nearby === "90645" ||
    nearby === "gasket" ||
    nearby === "90355" ||
    nearby === "fob" ||
    nearby === "chatelaine"
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyFlagged ||
      row.nearbyEpermBare ||
      row.nearbyCmdlineShape ||
      row.nearbyFilefix ||
      row.nearbyToastOnly ||
      row.nearbyBilledRetry ||
      row.nearbyScriptClears ||
      row.nearbyEvents1116 ||
      row.nearbyUndiagnosed ||
      isOffPinfold(row),
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.composedCommand ||
    probe.threatName ||
    probe.resourceType ||
    probe.spawnError ||
    probe.spawnPath ||
    probe.events.length ||
    probe.didThreatExecute != null ||
    probe.fileQuarantined != null ||
    probe.invokedAs ||
    probe.bodyKind ||
    probe.userSawToast != null ||
    probe.modelSawHint != null ||
    probe.spawnOk != null ||
    probe.retriesBilled != null ||
    probe.version ||
    uniqueNearbyOf(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const longInline = looksLongInline(row.composedCommand, row.bodyKind);
  const fileFix = looksFileFix(row.threatName);
  const cmdLine = looksCmdLine(row.resourceType);
  const eperm = looksEperm(row.spawnError);
  const has1116 = eventsHas1116(row.events);
  const ps1Path = looksPs1Path(row.invokedAs, row.composedCommand);
  const shortCommand = looksShortCommand(row.composedCommand, row.invokedAs);
  const spawnFailed = eperm || row.spawnOk === false;
  const spawnOk = row.spawnOk === true || (!spawnFailed && !eperm && (shortCommand || ps1Path));
  const noThreat = !row.threatName && !fileFix;
  const byteBody = looksBytePatch(row.composedCommand, row.bodyKind);
  const flaggedTriad = Boolean(
    longInline &&
      fileFix &&
      cmdLine &&
      eperm &&
      has1116 &&
      row.didThreatExecute === false &&
      !uniqueNearby,
  );
  const scriptClears = Boolean(
    ps1Path &&
      byteBody &&
      (row.spawnOk === true || (!eperm && row.spawnOk !== false)) &&
      noThreat &&
      !eperm,
  );
  const honest = Boolean(
    (shortCommand || (ps1Path && !byteBody)) &&
      noThreat &&
      !eperm &&
      (row.spawnOk === true || row.spawnOk == null) &&
      !uniqueNearby &&
      !fileFix,
  );
  const toastOnly = Boolean(row.userSawToast === true && row.modelSawHint === false);
  const billed = row.retriesBilled === true;
  const undiagnosed = Boolean(
    eperm && noThreat && row.modelSawHint === false && !fileFix && !has1116,
  );

  let eventClass = "idle";
  if (uniqueNearby && !flaggedTriad) {
    if (row.nearbyUndiagnosed) eventClass = "undiagnosed";
    else if (row.nearbyEvents1116) eventClass = "events-1116";
    else if (row.nearbyScriptClears) eventClass = "script-clears";
    else if (row.nearbyBilledRetry) eventClass = "billed-retry";
    else if (row.nearbyToastOnly) eventClass = "toast-only";
    else if (row.nearbyFilefix) eventClass = "filefix";
    else if (row.nearbyCmdlineShape) eventClass = "cmdline-shape";
    else if (row.nearbyEpermBare) eventClass = "eperm-bare";
    else if (row.nearbyFlagged) eventClass = "flagged";
    else if (isOffPinfold(row)) eventClass = "flagged";
  } else if (flaggedTriad) eventClass = "flagged";
  else if (scriptClears) eventClass = "script-clears";
  else if (billed && eperm) eventClass = "billed-retry";
  else if (toastOnly && eperm) eventClass = "toast-only";
  else if (undiagnosed) eventClass = "undiagnosed";
  else if (has1116 && row.didThreatExecute === false && row.fileQuarantined === false) {
    eventClass = "events-1116";
  } else if (fileFix) eventClass = "filefix";
  else if (eperm && !fileFix) eventClass = "eperm-bare";
  else if (longInline) eventClass = "cmdline-shape";
  else if (honest || isIdle(row)) eventClass = "penned";
  else eventClass = "penned";

  return {
    uniqueNearby,
    longInline,
    fileFix,
    cmdLine,
    eperm,
    has1116,
    ps1Path,
    shortCommand,
    spawnFailed,
    spawnOk,
    noThreat,
    byteBody,
    flaggedTriad,
    scriptClears,
    honest,
    toastOnly,
    billed,
    undiagnosed,
    offPinfold: isOffPinfold(row),
    eventClass,
    composedCommand: row.composedCommand,
    threatName: row.threatName,
    resourceType: row.resourceType,
    spawnError: row.spawnError,
    events: row.events,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "penned";
  const facts = analyze(row);
  if (!facts.flaggedTriad) {
    if (row.nearbyUndiagnosed) return "undiagnosed";
    if (row.nearbyEvents1116) return "events-1116";
    if (row.nearbyScriptClears) return "script-clears";
    if (row.nearbyBilledRetry) return "billed-retry";
    if (row.nearbyToastOnly) return "toast-only";
    if (row.nearbyFilefix) return "filefix";
    if (row.nearbyCmdlineShape) return "cmdline-shape";
    if (row.nearbyEpermBare) return "eperm-bare";
    if (row.nearbyFlagged) return "flagged";
    if (facts.offPinfold) return "flagged";
  }
  if (facts.flaggedTriad) return "flagged";
  if (facts.scriptClears) return "script-clears";
  if (facts.billed && facts.eperm) return "billed-retry";
  if (facts.toastOnly && facts.eperm) return "toast-only";
  if (facts.undiagnosed) return "undiagnosed";
  if (facts.has1116 && row.didThreatExecute === false && row.fileQuarantined === false) {
    return "events-1116";
  }
  if (facts.fileFix) return "filefix";
  if (facts.eperm && !facts.fileFix) return "eperm-bare";
  if (facts.longInline) return "cmdline-shape";
  if (facts.honest) return "penned";
  return "penned";
}

export function feedOf(kind) {
  if (kind === "flagged") {
    return "● Flagged · FileFix.BBA!MTB on the CmdLine resource · spawn never starts · primary #90706";
  }
  if (kind === "eperm-bare") {
    return "● Eperm-bare · only visible error is EPERM: operation not permitted, uv_spawn '...pwsh.exe'";
  }
  if (kind === "cmdline-shape") {
    return "● Cmdline-shape · long inline -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command + byte-patch body";
  }
  if (kind === "filefix") {
    return "● Filefix · threat name Trojan:Win32/FileFix.BBA!MTB · FileFix paste-attack family";
  }
  if (kind === "toast-only") {
    return "● Toast-only · user saw a Windows Security toast · the model saw nothing in-band";
  }
  if (kind === "billed-retry") {
    return "● Billed-retry · retries are guaranteed to fail and are billed · same CmdLine still matches";
  }
  if (kind === "script-clears") {
    return "● Script-clears · same logic in a .ps1 invoked by path runs clean · the cmdline shape is the trigger";
  }
  if (kind === "events-1116") {
    return "● Events-1116 · Defender operational log 1116/1117 · DidThreatExecute False · no file quarantined";
  }
  if (kind === "undiagnosed") {
    return "● Undiagnosed · no in-band hint this is AV vs sandbox vs a broken alias";
  }
  return "● Penned · short command line, or .ps1 by path · spawn ok · no FileFix · idle word is penned";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "flagged" || facts.flaggedTriad) {
    reasons.push(
      "#90706 Windows Defender FileFix signature blocks the PowerShell tool's composed inline commands; surfaces only as bare EPERM uv_spawn pwsh.exe",
    );
  }
  if (facts.longInline) {
    reasons.push(
      "composed command is -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command plus a byte-patch body",
    );
  }
  if (facts.fileFix) reasons.push(`threat ${row.threatName || DEMO_THREAT}`);
  if (facts.cmdLine) reasons.push("resource type CmdLine — the match is the command line, not a file");
  if (facts.eperm) reasons.push(row.spawnError || DEMO_EPERM);
  if (facts.has1116) reasons.push("Defender operational events 1116/1117");
  if (row.didThreatExecute === false) reasons.push("DidThreatExecute False");
  if (row.fileQuarantined === false) reasons.push("no file quarantined");
  if (facts.toastOnly) reasons.push("user saw a Windows Security toast; model saw no in-band hint");
  if (facts.billed) reasons.push("retries guaranteed to fail and are billed");
  if (facts.scriptClears || kind === "script-clears") {
    reasons.push("identical logic materialized as a .ps1 invoked by path runs immediately");
  }
  if (facts.ps1Path) reasons.push(`invoked as ${row.invokedAs || "ps1-path"}`);
  if (facts.shortCommand) reasons.push("short command line — no Bypass -Command byte-patch body");
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offPinfold) {
    reasons.push(
      "labeled contrast, not this defect: Slype #90676 / Escutcheon #90717 / Palimpsest #90725 / Calque #90645 / Gasket #90355 / Fob / Chatelaine",
    );
  }
  if (kind === "penned") {
    reasons.push(
      "short command line, or .ps1 invoked by path; spawn ok; no FileFix; idle word is penned",
    );
  }
  if (kind === "script-clears") {
    reasons.push("contrast seed: the body never appears in the AMSI-visible command line");
  }
  return reasons;
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offPinfold;
  const alarm = ALARM_VERDICTS.includes(kind) && !off;
  return {
    product: "pinfold",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    penned: kind === "penned",
    flagged: kind === "flagged",
    "eperm-bare": kind === "eperm-bare",
    "cmdline-shape": kind === "cmdline-shape",
    filefix: kind === "filefix",
    "toast-only": kind === "toast-only",
    "billed-retry": kind === "billed-retry",
    "script-clears": kind === "script-clears",
    "events-1116": kind === "events-1116",
    undiagnosed: kind === "undiagnosed",
    alarm,
    thisBug: kind !== "penned" && kind !== "script-clears" && !off,
    offPinfold: off,
    eventClass: facts.eventClass,
    facts: {
      composedCommand: facts.composedCommand,
      threatName: facts.threatName,
      resourceType: facts.resourceType,
      spawnError: facts.spawnError,
      events: facts.events,
      longInline: facts.longInline,
      fileFix: facts.fileFix,
      cmdLine: facts.cmdLine,
      eperm: facts.eperm,
      has1116: facts.has1116,
      ps1Path: facts.ps1Path,
      shortCommand: facts.shortCommand,
      spawnOk: facts.spawnOk,
      flaggedTriad: facts.flaggedTriad,
      scriptClears: facts.scriptClears,
      honest: facts.honest,
      toastOnly: facts.toastOnly,
      billed: facts.billed,
      undiagnosed: facts.undiagnosed,
      offPinfold: facts.offPinfold,
      didThreatExecute: probe.didThreatExecute,
      fileQuarantined: probe.fileQuarantined,
      invokedAs: probe.invokedAs,
      bodyKind: probe.bodyKind,
      userSawToast: probe.userSawToast,
      modelSawHint: probe.modelSawHint,
      version: facts.version,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_MARK,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  return boardResult(classify(row), row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function pennedOf(probe = {}) {
  return classify(probe) === "penned";
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    pinfold: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedPenned() {
  return baseSeed("penned-hold", FEATURED_ISSUE, {
    source: "honest control: short command line, spawn ok, no FileFix",
    composedCommand: DEMO_SHORT,
    invokedAs: "short",
    bodyKind: "short",
    spawnOk: true,
    threatName: "",
    resourceType: "",
    spawnError: "",
    events: [],
    userSawToast: false,
    modelSawHint: false,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedPenned();
}

export function seedReset() {
  return { action: "bail", pinfold: emptyProbe() };
}

export function seedFlagged() {
  return baseSeed("90706-flagged", FEATURED_ISSUE, {
    source:
      "primary #90706 long Bypass -Command + FileFix.BBA!MTB on CmdLine + EPERM uv_spawn + events 1116",
    composedCommand: DEMO_COMPOSED,
    threatName: DEMO_THREAT,
    resourceType: DEMO_RESOURCE,
    spawnError: DEMO_EPERM,
    spawnPath: DEMO_PATH,
    events: [1116, 1117],
    didThreatExecute: false,
    fileQuarantined: false,
    invokedAs: "inline-command",
    bodyKind: "byte-patch",
    userSawToast: true,
    modelSawHint: false,
    spawnOk: false,
    retriesBilled: true,
    version: DEMO_VERSION,
  });
}

export function seed90706() {
  return seedFlagged();
}

export function seedEpermBare() {
  return baseSeed("90706-eperm-bare", FEATURED_ISSUE, {
    source: "only visible error is EPERM uv_spawn pwsh.exe",
    composedCommand: DEMO_COMPOSED,
    spawnError: DEMO_EPERM,
    spawnPath: DEMO_PATH,
    spawnOk: false,
    modelSawHint: false,
    nearbyEpermBare: true,
    version: DEMO_VERSION,
  });
}

export function seedCmdlineShape() {
  return baseSeed("90706-cmdline-shape", FEATURED_ISSUE, {
    source: "long inline -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command + byte-patch",
    composedCommand: DEMO_COMPOSED,
    invokedAs: "inline-command",
    bodyKind: "byte-patch",
    nearbyCmdlineShape: true,
    version: DEMO_VERSION,
  });
}

export function seedFilefix() {
  return baseSeed("90706-filefix", FEATURED_ISSUE, {
    source: "threat name Trojan:Win32/FileFix.BBA!MTB",
    composedCommand: DEMO_COMPOSED,
    threatName: DEMO_THREAT,
    resourceType: DEMO_RESOURCE,
    nearbyFilefix: true,
    version: DEMO_VERSION,
  });
}

export function seedToastOnly() {
  return baseSeed("90706-toast-only", FEATURED_ISSUE, {
    source: "user saw Windows Security toast; model saw nothing in-band",
    composedCommand: DEMO_COMPOSED,
    spawnError: DEMO_EPERM,
    userSawToast: true,
    modelSawHint: false,
    spawnOk: false,
    nearbyToastOnly: true,
    version: DEMO_VERSION,
  });
}

export function seedBilledRetry() {
  return baseSeed("90706-billed-retry", FEATURED_ISSUE, {
    source: "retries guaranteed to fail and are billed",
    composedCommand: DEMO_COMPOSED,
    spawnError: DEMO_EPERM,
    spawnOk: false,
    retriesBilled: true,
    nearbyBilledRetry: true,
    version: DEMO_VERSION,
  });
}

export function seedScriptClears() {
  return baseSeed("90706-script-clears", FEATURED_ISSUE, {
    source:
      "same byte-patch logic materialized as a .ps1 invoked by path; spawn ok; no FileFix",
    composedCommand: DEMO_PS1,
    invokedAs: "ps1-path",
    bodyKind: "byte-patch",
    spawnOk: true,
    threatName: "",
    spawnError: "",
    events: [],
    userSawToast: false,
    modelSawHint: false,
    nearbyScriptClears: true,
    version: DEMO_VERSION,
  });
}

export function seedEvents1116() {
  return baseSeed("90706-events-1116", FEATURED_ISSUE, {
    source: "Defender operational log 1116/1117, DidThreatExecute False, no file quarantined",
    composedCommand: DEMO_COMPOSED,
    threatName: DEMO_THREAT,
    resourceType: DEMO_RESOURCE,
    events: [1116, 1117],
    didThreatExecute: false,
    fileQuarantined: false,
    nearbyEvents1116: true,
    version: DEMO_VERSION,
  });
}

export function seedUndiagnosed() {
  return baseSeed("90706-undiagnosed", FEATURED_ISSUE, {
    source: "no in-band hint this is AV vs sandbox vs a broken alias",
    composedCommand: DEMO_COMPOSED,
    spawnError: DEMO_EPERM,
    spawnOk: false,
    modelSawHint: false,
    userSawToast: false,
    nearbyUndiagnosed: true,
    version: DEMO_VERSION,
  });
}

export function seedContrastSlype() {
  return baseSeed("contrast-slype", RELATED_SLYPE, {
    source: "NOT this: #90676 sandbox 126 on Program Files pwsh.exe",
    nearby: "slype",
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  penned: seedPenned,
  control: seedPenned,
  healthy: seedPenned,
  hold: seedPenned,
  flagged: seedFlagged,
  90706: seedFlagged,
  "90706": seedFlagged,
  "eperm-bare": seedEpermBare,
  epermbare: seedEpermBare,
  "cmdline-shape": seedCmdlineShape,
  cmdlineshape: seedCmdlineShape,
  filefix: seedFilefix,
  "toast-only": seedToastOnly,
  toastonly: seedToastOnly,
  "billed-retry": seedBilledRetry,
  billedretry: seedBilledRetry,
  "script-clears": seedScriptClears,
  scriptclears: seedScriptClears,
  "events-1116": seedEvents1116,
  events1116: seedEvents1116,
  undiagnosed: seedUndiagnosed,
  slype: seedContrastSlype,
  90676: seedContrastSlype,
  "90676": seedContrastSlype,
  contrast: seedContrastSlype,
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
    return { action: payload, pinfold: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const pinfold = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || pinfold.session),
    issue: asIssue(src.issue ?? pinfold.issue),
    source: asText(src.source || pinfold.source),
    pinfold,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.pinfold);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("penned", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedPenned().pinfold;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90706" || verb === "flagged") {
    probe = seedFlagged().pinfold;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "file") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "stamp" || verb === "file" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseTranscript(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return cloneProbe({ ...raw, scored: true });
  }
  const text = asText(raw);
  if (!text.trim()) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return cloneProbe({ ...parsed, scored: true });
    }
  } catch {
    /* transcript, not JSON */
  }
  const probe = emptyProbe();
  if (looksBypassCommand(text) || looksBytePatch(text)) {
    probe.composedCommand = DEMO_COMPOSED;
    probe.invokedAs = "inline-command";
    probe.bodyKind = "byte-patch";
  } else if (/\.ps1/i.test(text) && /(?:^|[\s-])File\b|ps1-path|invoked by path/i.test(text)) {
    probe.composedCommand = DEMO_PS1;
    probe.invokedAs = "ps1-path";
    probe.bodyKind = "byte-patch";
    probe.spawnOk = true;
  } else if (/Get-Date|short command/i.test(text)) {
    probe.composedCommand = DEMO_SHORT;
    probe.invokedAs = "short";
    probe.bodyKind = "short";
    probe.spawnOk = true;
  }
  if (looksFileFix(text)) {
    probe.threatName = DEMO_THREAT;
    probe.resourceType = DEMO_RESOURCE;
  }
  if (/CmdLine/i.test(text)) probe.resourceType = DEMO_RESOURCE;
  if (looksEperm(text)) {
    probe.spawnError = DEMO_EPERM;
    probe.spawnPath = DEMO_PATH;
    probe.spawnOk = false;
  }
  if (/1116|1117/.test(text)) probe.events = [1116, 1117];
  if (/DidThreatExecute:\s*False|DidThreatExecute False/i.test(text)) {
    probe.didThreatExecute = false;
  }
  if (/no file quarantined|fileQuarantined:\s*False/i.test(text)) {
    probe.fileQuarantined = false;
  }
  if (/Windows Security toast|userSawToast/i.test(text)) probe.userSawToast = true;
  if (/model saw nothing|no in-band|modelSawHint:\s*false/i.test(text)) {
    probe.modelSawHint = false;
  }
  if (/retries? .*billed|billed-retry/i.test(text)) probe.retriesBilled = true;
  probe.scored = true;
  return cloneProbe(probe);
}

export function parsePinfoldJson(raw) {
  if (raw && typeof raw === "object") {
    return cloneProbe({ ...raw, scored: true });
  }
  return parseTranscript(raw);
}

export function emptyAction(verb = "idle") {
  return { action: verb, pinfold: emptyProbe() };
}
