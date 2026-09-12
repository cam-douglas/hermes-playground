#!/usr/bin/env node
/**
 * Canard — press-room / newspaper-canard / duck-press booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * The VS Code extension fails to spawn the `claude` binary when the
 * workspace folder lives under a OneDrive-synced path (common:
 * OneDrive-redirected Desktop on Windows). The log shows a real OS
 * error `spawn ...\claude.exe ENOENT` even though the exe exists and
 * runs standalone; then a misleading musl/glibc dynamic-linker
 * mismatch message (a Linux-only concept) on Windows. The same binary
 * config works from a non-OneDrive folder (e.g. C:\Projects\test).
 * Only workspace/cwd location differs.
 *
 *   node canard.mjs data/canarded.json
 *   echo '{"seed":"canarded"}' | node canard.mjs
 *
 * Idle word is candid (HOLD: surface ENOENT / cwd honestly; no Linux
 * linker tale).
 * Seeded word is canarded (#93766 misdiagnosed as musl/glibc while
 * spawn ENOENT under OneDrive cwd).
 * Path word is onedrive-cwd-mislabel.
 * Product score word is canard (Score canard or admit candid.).
 *
 * Encoded from anthropics/claude-code#93766 issue text only.
 * Hypothesis (NON-BINDING): spawn fails because OneDrive-backed
 * cwd/reparse interacts badly with the extension's spawn, and a
 * Linux linker heuristic mislabels the ENOENT — not because the
 * binary is musl/glibc incompatible on Windows. Verify against
 * #93766 text only. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "candid",
  "canarded",
  "canard",
  "onedrive-cwd-mislabel",
  "hold",
  "honest-spawn",
  "plain-enoent",
  "windows-honest",
  "spawn-enoent",
  "musl-mislabel",
  "onedrive-cwd",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "candid";
export const PATH_WORD = "onedrive-cwd-mislabel";
export const SEEDED_WORD = "canarded";
export const PRODUCT_WORD = "canard";
export const HOLD = Object.freeze(["candid", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "candid",
  "honest-spawn",
  "plain-enoent",
  "windows-honest",
]);
export const RECOVER = Object.freeze(["candid", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "stetted",
  "rewound",
  "stet",
  "mic-resume-wipe",
  "sighted",
  "blindsided",
  "blindside",
  "compare-ref-unreachable",
  "scoped",
  "interdicted",
  "interdict",
  "chrome-prohibit-bleed",
  "duplex",
  "simplexed",
  "simplex",
  "mobile-uplink-silent",
  "keyed",
  "deadkeyed",
  "deadkey",
  "esc-csi-dead",
  "gleaned",
  "orphaned",
  "gleaner",
  "unreaped-ampersand",
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "blank",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "canarded" && name !== "canard"),
);

export const FEATURED_ISSUE = 93766;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93766";
export const TITLE =
  "[BUG] VS Code extension fails to spawn `claude` binary when workspace folder is under a OneDrive-synced path (misleading \"musl/glibc\" error on Windows)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:ide",
  "platform:vscode",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.269";
export const GOOD_VERSION =
  "spawn succeeds from a non-OneDrive cwd (e.g. C:\\Projects\\test); failures surface as ENOENT / EACCES, not a musl/glibc linker tale";
export const SURFACE = "vscode-extension";
export const HOST = "windows";
export const INSTALL_PATH =
  "%USERPROFILE%\\.local\\bin\\claude.exe and the extension bundled native-binary";
export const COMMAND =
  "open a VS Code workspace under an OneDrive-synced path → open the Claude Code panel / send a prompt";
export const PHRASE = "Score canard or admit candid.";
export const DISTRIBUTION =
  "Claude Code VS Code extension anthropic.claude-code-2.1.269-win32-x64 on Windows 10/11. When the open workspace folder lives inside a OneDrive-synced directory (here an OneDrive-redirected Desktop — a common default on new Windows setups), the extension fails to spawn the claude process. The error message is misleading: it describes a musl-vs-glibc dynamic linker mismatch, which is a Linux-only concept and does not apply on Windows at all. The underlying OS error (visible earlier in the same log) is actually ENOENT on the executable path — even though the executable file demonstrably exists and runs fine standalone (claude --version). Opening the exact same binary configuration in a plain, non-OneDrive folder (e.g. C:\\Projects\\test) works without any changes. Only the location of the workspace folder (and therefore the cwd passed to the spawn call) differs. The same failure occurred both with the extension's own bundled binary (...\\extensions\\anthropic.claude-code-2.1.269-win32-x64\\resources\\native-binary\\claude.exe) and after pointing claudeCode.claudeProcessWrapper at a separately installed, independently-verified-working standalone CLI at C:\\Users\\<user>\\.local\\bin\\claude.exe. Files were fully downloaded/hydrated locally, not cloud-only placeholders. Antivirus/Defender, corrupted download, stale extension state, and wrapper misconfiguration were already ruled out.";
export const RULED_OUT = Object.freeze([
  "Antivirus/Windows Defender — no blocks or quarantine events found",
  "Corrupted download — standalone binary verified with matching file size and successful --version when run directly from a terminal",
  "Stale extension state — confirmed after full extension reinstall, VS Code restart, and full OS reboot",
  "claudeProcessWrapper misconfiguration — JSON setting and target path were correct",
  "Cloud-only OneDrive placeholders — files fully downloaded/hydrated locally",
]);
export const EXPECTED = Object.freeze([
  "Claude launches normally from a OneDrive-synced workspace the same way it does from C:\\Projects\\test",
  "when a spawn fails, surface the actual underlying OS error (e.g. ENOENT, EACCES) rather than a generic musl/glibc message inapplicable on Windows",
  "detect and warn when the workspace cwd sits inside a cloud-sync-managed folder (OneDrive, Dropbox, etc.)",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "ticker", label: "wire ticker", count: "press-room", note: "newspaper-canard desk — not galley, turf, vellum, radio, or platen" },
  { id: "enoent-stamp", label: "ENOENT stamp", count: "honest", note: "real OS error: spawn ...\\claude.exe ENOENT" },
  { id: "false-headline", label: "musl/glibc headline", count: "canard", note: "Linux-only linker tale printed on Windows" },
  { id: "cloud-strip", label: "OneDrive cwd strip", count: "redirected-desktop", note: "cwd under OneDrive-synced path; binary works standalone" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "candid-gate",
    survey: "surface spawn ENOENT / cwd honestly; no Linux linker tale on Windows",
    kind: "candid",
    note: "idle: the press-room stays candid — the hold/good path",
  },
  {
    id: "spawn-enoent",
    survey: "claude auth status spawn failed: Error: spawn C:\\Users\\<user>\\.local\\bin\\claude.exe ENOENT",
    kind: "canarded",
    note: "seeded: real OS ENOENT even though the exe exists and runs standalone",
  },
  {
    id: "musl-mislabel",
    survey: "error claims musl-linked binary on a glibc Linux host; /lib/ld-musl-* missing",
    kind: "canarded",
    note: "seeded: Linux-only dynamic-linker mismatch printed on Windows",
  },
  {
    id: "onedrive-cwd",
    survey: "cwd: c:\\Users\\<user>\\OneDrive\\Desktop\\<project> — same binary works from C:\\Projects\\test",
    kind: "canarded",
    note: "seeded: only workspace/cwd location differs between failing and working cases",
  },
  {
    id: "onedrive-cwd-mislabel",
    survey: "OneDrive cwd + spawn ENOENT + musl/glibc false headline on Windows",
    kind: "canarded",
    note: "path: the canard is the mislabel after the honest ENOENT",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "onedrive-cwd-mislabel",
  "canarded",
  "spawn-enoent",
  "musl-mislabel",
  "onedrive-cwd",
]);

export const COUSINS = Object.freeze([]);

export const BACKUPS = Object.freeze([
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "stet",
  "blindside",
  "interdict",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
  "cachet",
  "ukase",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
]);

export const SAMPLE_CANDID_DESK = Object.freeze({
  spawnOk: true,
  honestSurface: true,
  muslMislabel: false,
  onedriveCwd: false,
  version: GOOD_VERSION,
});

export const SAMPLE_CANARDED_DESK = Object.freeze({
  spawnOk: false,
  honestSurface: false,
  muslMislabel: true,
  onedriveCwd: true,
  spawnEnoent: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_SPAWN = Object.freeze({
  enoent: true,
  exeExists: true,
  standaloneWorks: true,
  path: "C:\\Users\\<user>\\.local\\bin\\claude.exe",
});

export const SAMPLE_CANDID_SPAWN = Object.freeze({
  enoent: false,
  exeExists: true,
  standaloneWorks: true,
  launched: true,
});

export const SAMPLE_MUSL = Object.freeze({
  muslHeadline: true,
  host: "windows",
  inapplicable: true,
  linkerTale: "musl-linked binary on a glibc Linux host; /lib/ld-musl-* missing",
});

export const SAMPLE_CANDID_LABEL = Object.freeze({
  muslHeadline: false,
  host: "windows",
  inapplicable: false,
  surfacesOsError: true,
});

export const SAMPLE_ONEDRIVE = Object.freeze({
  cwd: "c:\\Users\\<user>\\OneDrive\\Desktop\\<project>",
  cloudSync: true,
  hydrated: true,
  worksFromPlainFolder: true,
  plainFolder: "C:\\Projects\\test",
});

export const SAMPLE_CANDID_CWD = Object.freeze({
  cwd: "C:\\Projects\\test",
  cloudSync: false,
  hydrated: true,
  worksFromPlainFolder: true,
});

export const SAMPLE_HONEST = Object.freeze({
  surfacesEnoent: true,
  noMuslTale: true,
  cwdWarned: true,
});

export const SAMPLE_CANARDED_SURFACE = Object.freeze({
  surfacesEnoent: false,
  noMuslTale: false,
  cwdWarned: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds candid: surface ENOENT / cwd honestly; no Linux linker tale" },
  { t: "spawn-enoent", line: "spawn C:\\Users\\<user>\\.local\\bin\\claude.exe ENOENT — exe exists and runs standalone" },
  { t: "musl-mislabel", line: "false headline: musl/glibc dynamic-linker mismatch printed on Windows" },
  { t: "onedrive-cwd", line: "cwd under OneDrive Desktop; same binary works from C:\\Projects\\test" },
  { t: "path", line: "onedrive-cwd-mislabel — OneDrive cwd + ENOENT then a fabricated linker story" },
  { t: "score", line: "when Windows prints the musl/glibc canard after spawn ENOENT the booth is canard — Score canard or admit candid." },
]);

export function inspectSpawnEnoent(input = {}) {
  const spawn =
    input.spawn && typeof input.spawn === "object"
      ? input.spawn
      : input.candid === true && input.canarded !== true
        ? SAMPLE_CANDID_SPAWN
        : SAMPLE_SPAWN;
  const forced =
    input.spawnEnoent === true ||
    input.event === "spawn-enoent" ||
    input.event === "canarded" ||
    input.event === "canard" ||
    input.canarded === true;
  const enoent = forced ? true : spawn.enoent === true && input.candid !== true;
  return {
    enoent,
    exeExists: true,
    standaloneWorks: true,
    stamp: enoent ? "spawn-enoent" : "spawn-ok",
    note: enoent
      ? "spawn ...\\claude.exe ENOENT even though the exe exists and runs standalone"
      : "claude launches; spawn does not report ENOENT for a present binary",
  };
}

export function inspectMuslMislabel(input = {}) {
  const label =
    input.musl && typeof input.musl === "object"
      ? input.musl
      : input.candid === true && input.canarded !== true
        ? SAMPLE_CANDID_LABEL
        : SAMPLE_MUSL;
  const forced =
    input.muslMislabel === true ||
    input.event === "musl-mislabel" ||
    input.event === "canarded" ||
    input.event === "canard";
  const mislabel = forced ? true : label.muslHeadline === true && input.candid !== true;
  return {
    muslHeadline: mislabel,
    host: "windows",
    inapplicable: mislabel,
    stamp: mislabel ? "musl-mislabel" : "windows-honest",
    note: mislabel
      ? "musl/glibc dynamic-linker mismatch printed on Windows — a Linux-only concept"
      : "no Linux linker tale; Windows errors stay Windows errors",
  };
}

export function inspectOnedriveCwd(input = {}) {
  const cwd =
    input.cwd && typeof input.cwd === "object"
      ? input.cwd
      : input.candid === true && input.canarded !== true
        ? SAMPLE_CANDID_CWD
        : SAMPLE_ONEDRIVE;
  const forced =
    input.onedriveCwd === true ||
    input.event === "onedrive-cwd" ||
    input.event === "onedrive-cwd-mislabel" ||
    input.event === "canarded" ||
    input.event === "canard";
  const cloud = forced ? true : cwd.cloudSync === true && input.candid !== true;
  return {
    cloudSync: cloud,
    hydrated: true,
    worksFromPlainFolder: true,
    stamp: cloud ? "onedrive-cwd" : "plain-cwd",
    note: cloud
      ? "cwd under OneDrive-synced path (redirected Desktop); same binary works from C:\\Projects\\test"
      : "cwd is a plain folder; spawn is not gated on a cloud-sync reparse",
  };
}

export function inspectHonestSurface(input = {}) {
  const surface =
    input.surface && typeof input.surface === "object"
      ? input.surface
      : input.candid === true && input.canarded !== true
        ? SAMPLE_HONEST
        : SAMPLE_CANARDED_SURFACE;
  const forced =
    input.honestSurface === true ||
    input.event === "honest-spawn" ||
    input.event === "plain-enoent" ||
    input.event === "windows-honest";
  const honest =
    forced ||
    (input.candid === true && input.canarded !== true) ||
    surface.surfacesEnoent === true;
  const live = honest && input.canarded !== true && input.canard !== true;
  return {
    surfacesEnoent: live,
    noMuslTale: live,
    cwdWarned: live,
    stamp: live ? "honest-spawn" : "canard-headline",
    note: live
      ? "ENOENT / cwd surfaced honestly; no musl/glibc tale on Windows"
      : "false musl/glibc headline covers the real spawn ENOENT",
  };
}

export function readBooth(input = {}) {
  const spawn = inspectSpawnEnoent(input);
  const musl = inspectMuslMislabel(input);
  const cwd = inspectOnedriveCwd(input);
  const honest = inspectHonestSurface(input);
  const canarded =
    input.candid !== true &&
    ((spawn.enoent && musl.muslHeadline && cwd.cloudSync) ||
      input.canarded === true);
  const candid =
    input.candid === true && canarded !== true && spawn.enoent !== true;
  const path =
    (input.event === "onedrive-cwd-mislabel" || input.onedriveCwdMislabel === true) &&
    (spawn.enoent || input.canarded === true);
  return {
    spawn,
    musl,
    cwd,
    honest,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    canarded: canarded && !candid && !path,
    candid: candid || (!canarded && !path && input.canarded !== true && input.onedriveCwdMislabel !== true && spawn.enoent !== true),
    onedriveCwdMislabel: path && !candid,
    mark:
      path && !candid
        ? "onedrive-cwd-mislabel"
        : canarded && !candid
          ? "canarded"
          : "candid",
  };
}

/**
 * Published canard walk from #93766 only. Facts from the issue text.
 * A candid booth surfaces ENOENT / cwd honestly with no Linux linker tale.
 * A canarded booth prints musl/glibc on Windows after spawn ENOENT under OneDrive cwd.
 * An onedrive-cwd-mislabel booth names that path.
 */
export const CANARD_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-candid",
    candid: true,
    canarded: false,
    cue: "candid",
    note: "idle HOLD: surface ENOENT / cwd honestly; no Linux linker tale — the hold/good path",
  },
  {
    t: "spawn-enoent",
    event: "spawn-enoent",
    canarded: true,
    spawnEnoent: true,
    cue: "canarded",
    note: "spawn ...\\claude.exe ENOENT — exe exists and runs standalone",
  },
  {
    t: "musl-mislabel",
    event: "musl-mislabel",
    canarded: true,
    muslMislabel: true,
    cue: "canarded",
    note: "false headline: musl/glibc on Windows",
  },
  {
    t: "onedrive-cwd",
    event: "onedrive-cwd",
    canarded: true,
    onedriveCwd: true,
    cue: "canarded",
    note: "cwd under OneDrive Desktop; same binary works from C:\\Projects\\test",
  },
  {
    t: "path",
    event: "onedrive-cwd-mislabel",
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    cue: "canarded",
    note: "onedrive-cwd-mislabel — OneDrive cwd + ENOENT then a fabricated linker story",
  },
  {
    t: "score",
    event: "canard",
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    onedriveCwd: true,
    cue: "canarded",
    note: "canard — when Windows prints the musl/glibc tale after spawn ENOENT the booth never stays candid",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-candid",
    candid: true,
    canarded: false,
    cue: "candid",
    note: "positive control: spawn honest; no musl tale",
  },
  {
    t: "announce",
    event: "cue-candid",
    candid: true,
    cue: "candid",
    note: "positive control: the wire stays candid",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    candid: true,
    canarded: false,
    onedriveCwdMislabel: false,
    cue: "candid",
  };
}

export function seedCandid() {
  return { ...emptyTicket() };
}

export function seedCanarded() {
  return {
    seed: SEEDED_WORD,
    candid: false,
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    onedriveCwd: true,
    honestSurface: false,
    cue: "canarded",
    issue: FEATURED_ISSUE,
    spawn: SAMPLE_SPAWN,
    musl: SAMPLE_MUSL,
    cwd: SAMPLE_ONEDRIVE,
    surface: SAMPLE_CANARDED_SURFACE,
  };
}

export function seedCanard() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    onedriveCwd: true,
    cue: "canarded",
  };
}

export function seedOnedriveCwdMislabel() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    canarded: true,
    onedriveCwdMislabel: true,
    spawnEnoent: true,
    muslMislabel: true,
    event: "onedrive-cwd-mislabel",
    cue: "canarded",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    candid: true,
    cue: "candid",
  };
}

export function seedSpawnEnoent() {
  return {
    seed: "spawn-enoent",
    preferSeed: true,
    spawnEnoent: true,
    cue: "canarded",
  };
}

export function seedMuslMislabel() {
  return {
    seed: "musl-mislabel",
    preferSeed: true,
    muslMislabel: true,
    cue: "canarded",
  };
}

export function seedOnedriveCwd() {
  return {
    seed: "onedrive-cwd",
    preferSeed: true,
    onedriveCwd: true,
    cue: "canarded",
  };
}

export function seedHonestSpawn() {
  return {
    seed: "honest-spawn",
    preferSeed: true,
    candid: true,
    cue: "candid",
  };
}

export function seedPlainEnoent() {
  return {
    seed: "plain-enoent",
    preferSeed: true,
    candid: true,
    cue: "candid",
  };
}

export function seedWindowsHonest() {
  return {
    seed: "windows-honest",
    preferSeed: true,
    candid: true,
    cue: "candid",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      candid: false,
      canarded: false,
      onedriveCwdMislabel: false,
      spawnEnoent: false,
      muslMislabel: false,
      onedriveCwd: false,
      honestSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    candid: raw.candid === true,
    canarded:
      raw.canarded === true ||
      raw.event === "canarded" ||
      raw.event === "canard",
    onedriveCwdMislabel:
      raw.onedriveCwdMislabel === true || raw.event === "onedrive-cwd-mislabel",
    spawnEnoent: raw.spawnEnoent === true || raw.event === "spawn-enoent",
    muslMislabel: raw.muslMislabel === true || raw.event === "musl-mislabel",
    onedriveCwd: raw.onedriveCwd === true || raw.event === "onedrive-cwd",
    honestSurface: raw.honestSurface === true || raw.event === "honest-spawn",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    spawn: raw.spawn,
    musl: raw.musl,
    cwd: raw.cwd,
    surface: raw.surface,
    desk: raw.desk,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.candid != null ||
        ticket.canarded != null ||
        ticket.onedriveCwdMislabel != null ||
        ticket.spawnEnoent != null ||
        ticket.muslMislabel != null ||
        ticket.onedriveCwd != null ||
        ticket.honestSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.spawn ||
        ticket.musl ||
        ticket.cwd ||
        ticket.surface),
  );
}

function isCandid(row) {
  if (row.canarded && row.cue !== "candid") return false;
  if (
    row.cue === "canarded" ||
    row.cue === "canard" ||
    row.cue === "onedrive-cwd-mislabel"
  ) {
    return false;
  }
  if (
    row.onedriveCwdMislabel &&
    row.spawnEnoent &&
    row.cue !== "candid" &&
    row.candid !== true
  ) {
    return false;
  }
  if (
    row.onedriveCwdMislabel &&
    row.muslMislabel &&
    row.cue !== "candid" &&
    row.candid !== true
  ) {
    return false;
  }
  if (row.candid === true && row.canarded !== true && row.cue !== "canarded") {
    return true;
  }
  if (
    row.cue === "candid" &&
    row.canarded !== true &&
    row.onedriveCwdMislabel !== true &&
    row.spawnEnoent !== true &&
    row.muslMislabel !== true
  ) {
    return true;
  }
  return false;
}

function isOnedriveCwdMislabelPath(row) {
  return (
    row.event === "onedrive-cwd-mislabel" &&
    !isCandid(row) &&
    (row.onedriveCwdMislabel === true ||
      row.spawnEnoent === true ||
      row.muslMislabel === true)
  );
}

function isCanarded(row) {
  if (isCandid(row)) return false;
  if (isOnedriveCwdMislabelPath(row) && row.cue !== "canarded") return false;
  if (row.cue === "canarded" || row.cue === "canard") return true;
  if (row.canarded === true) return true;
  if (
    row.onedriveCwdMislabel === true &&
    row.spawnEnoent === true &&
    row.muslMislabel === true
  ) {
    return true;
  }
  if (row.onedriveCwdMislabel === true && row.spawnEnoent === true) {
    return true;
  }
  if (
    row.spawnEnoent === true ||
    row.muslMislabel === true ||
    row.onedriveCwd === true ||
    (row.onedriveCwdMislabel === true && row.muslMislabel === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one canard pass against the press-room wire.
 * candid: surface ENOENT / cwd honestly; no Linux linker tale.
 * canarded / canard: musl/glibc printed on Windows after spawn ENOENT under OneDrive cwd.
 * onedrive-cwd-mislabel: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isOnedriveCwdMislabelPath(row) ||
    (row.onedriveCwdMislabel && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "onedrive-cwd-mislabel";
  } else if (isCanarded(row)) {
    verdict = "canard";
  } else if (isCandid(row)) {
    verdict = "candid";
  } else if (
    row.onedriveCwdMislabel ||
    row.spawnEnoent ||
    row.muslMislabel ||
    (row.onedriveCwd && !row.candid)
  ) {
    verdict = "canard";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const spawn = inspectSpawnEnoent(row);
  const musl = inspectMuslMislabel(row);
  const cwd = inspectOnedriveCwd(row);
  const honest = inspectHonestSurface(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    candid: verdict === "candid" || verdict === "hold",
    canarded:
      verdict === "canarded" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    onedriveCwdMislabel:
      row.onedriveCwdMislabel === true ||
      verdict === "onedrive-cwd-mislabel" ||
      verdict === PATH_WORD,
    spawnEnoent: row.spawnEnoent,
    muslMislabel: row.muslMislabel,
    onedriveCwd: row.onedriveCwd,
    honestSurface: row.honestSurface,
    cue: hold
      ? "candid"
      : row.onedriveCwdMislabel || verdict === "onedrive-cwd-mislabel"
        ? "onedrive-cwd-mislabel"
        : "canarded",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit candid" : "score canard",
    spawnInspect: spawn,
    muslInspect: musl,
    cwdInspect: cwd,
    honestInspect: honest,
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
      : CANARD_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "canard" || row.verdict === "canarded",
  );
  const path = scored.filter((row) => row.verdict === "onedrive-cwd-mislabel");
  const candid = scored.filter((row) => row.verdict === "candid");
  const headline =
    scored.find((row) => row.event === "canarded") ||
    scored.find((row) => row.event === "onedrive-cwd-mislabel") ||
    scored.find((row) => row.event === "spawn-enoent") ||
    dead[dead.length - 1];
  let verdict = "candid";
  if (dead.length) verdict = "canard";
  else if (path.length && !candid.length) verdict = "onedrive-cwd-mislabel";
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
    canardedCount: dead.length,
    pathCount: path.length,
    candidCount: candid.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit candid" : "score canard",
    note: headline
      ? "VS Code extension spawn ENOENT under OneDrive cwd is mislabeled as a musl/glibc linker mismatch on Windows; the same binary works from a plain folder. No numbered cousins were cited in #93766."
      : "published canard walk scored against candid vs canarded",
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
    seeded !== "candid" &&
    seeded !== "canarded" &&
    seeded !== "onedrive-cwd-mislabel" &&
    seeded !== "canard" &&
    ticket.candid == null &&
    ticket.canarded == null &&
    ticket.onedriveCwdMislabel == null &&
    ticket.spawnEnoent == null &&
    ticket.muslMislabel == null &&
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
    candid: scored.candid ?? false,
    canarded: scored.canarded ?? false,
    onedriveCwdMislabel: scored.onedriveCwdMislabel ?? false,
    spawnEnoent: scored.spawnEnoent ?? false,
    muslMislabel: scored.muslMislabel ?? false,
    onedriveCwd: scored.onedriveCwd ?? false,
    honestSurface: scored.honestSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.spawnEnoent || result.canarded ? "spawn=enoent" : "spawn=ok",
    result.muslMislabel || result.canarded ? "label=musl" : "label=honest",
    result.onedriveCwd || result.canarded ? "cwd=onedrive" : "cwd=plain",
    result.onedriveCwdMislabel || result.verdict === "onedrive-cwd-mislabel"
      ? "path=onedrive-cwd-mislabel"
      : "path=candid",
    result.cue === "candid"
      ? "cue=candid"
      : result.cue === "onedrive-cwd-mislabel"
        ? "cue=onedrive-cwd-mislabel"
        : "cue=canarded",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    candid: result.candid,
    canarded: result.canarded,
    onedriveCwdMislabel: result.onedriveCwdMislabel,
    spawnEnoent: result.spawnEnoent,
    muslMislabel: result.muslMislabel,
    onedriveCwd: result.onedriveCwd,
    honestSurface: result.honestSurface,
    spawn: input && input.spawn,
    musl: input && input.musl,
    cwd: input && input.cwd,
    surface: input && input.surface,
    desk: input && input.desk,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    spawn: inspectSpawnEnoent({
      candid: result.candid,
      canarded: result.canarded,
      spawnEnoent: result.spawnEnoent,
      spawn: input && input.spawn,
    }),
    musl: inspectMuslMislabel({
      candid: result.candid,
      canarded: result.canarded,
      muslMislabel: result.muslMislabel,
      musl: input && input.musl,
    }),
    cwd: inspectOnedriveCwd({
      candid: result.candid,
      canarded: result.canarded,
      onedriveCwd: result.onedriveCwd,
      cwd: input && input.cwd,
    }),
    honest: inspectHonestSurface({
      candid: result.candid,
      canarded: result.canarded,
      honestSurface: result.honestSurface,
      surface: input && input.surface,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      canarded:
        result.canarded === true ||
        result.verdict === "canarded" ||
        result.verdict === "canard",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: spawn fails because OneDrive-backed cwd/reparse interacts badly with the extension's spawn, and a Linux linker heuristic mislabels the ENOENT — not because the binary is musl/glibc incompatible on Windows. Invite verify against #93766 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
