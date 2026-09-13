#!/usr/bin/env node
/**
 * Feoffee — medieval feoffment / livery-of-seisin / chancery chamber booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A `.claude/launch.json` named dev-server
 * (`preview_start({name: "..."})`) fails when its working directory
 * is under `~/Documents/...`, even though the desktop app
 * (`com.anthropic.claudefordesktop`) holds Full Disk Access confirmed
 * via the TCC database
 * (`kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2`).
 * Failure: `getcwd: cannot access parent directories: Operation not
 * permitted` at shell-init; then python can't open the script
 * (Errno 1 Operation not permitted). Unified log: System Policy (TCC)
 * deny against spawned bash/python3 child PIDs — not Seatbelt /
 * App-Sandbox. Contrast: Bash-tool-spawned processes under a different
 * bundle id `com.anthropic.claude-code` can read/write/execute the
 * SAME directory at the same time.
 *
 *   node feoffee.mjs data/unseised.json
 *   echo '{"seed":"unseised"}' | node feoffee.mjs
 *
 * Idle word is vested (HOLD: FDA vested through the child spawn
 * chain; preview_start children can getcwd under Documents; TCC
 * grants reach bash/python children).
 * Seeded word is unseised (#93863 — preview_start children hit
 * getcwd EPERM / System Policy deny despite parent FDA).
 * Path word is preview-eperm.
 * Product score word is feoffee (Score feoffee or admit vested.).
 *
 * Encoded from anthropics/claude-code#93863 issue text only.
 * Hypothesis (NON-BINDING): child processes on the preview_start
 * named-config path do not inherit / are not granted the desktop
 * app's Full Disk Access. Do NOT claim root cause from Claude Code
 * source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "vested",
  "unseised",
  "feoffee",
  "preview-eperm",
  "hold",
  "letters-patent",
  "demesne-open",
  "rival-bundle-ok",
  "getcwd-eperm",
  "tcc-deny",
  "named-launch",
  "documents-demesne",
  "bash-python-child",
  "desktop-fda",
  "rival-bundle",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "vested";
export const PATH_WORD = "preview-eperm";
export const SEEDED_WORD = "unseised";
export const PRODUCT_WORD = "feoffee";
export const HOLD = Object.freeze(["vested", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "vested",
  "letters-patent",
  "demesne-open",
  "rival-bundle-ok",
]);
export const RECOVER = Object.freeze(["vested", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
  "airlock",
  "equalized",
  "blown",
  "socat-race",
  "scotoma",
  "legible",
  "scotomized",
  "command-args-blind",
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "inherited",
  "unreaped-ampersand",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
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
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
  "warm",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "unseised" && name !== "feoffee"),
);

export const FEATURED_ISSUE = 93863;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93863";
export const TITLE =
  "preview_start named launch.json server fails with getcwd EPERM despite confirmed Full Disk Access";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const DESKTOP_VERSION = "1.52386.3";
export const CLAUDE_VERSION = "Claude for Desktop 1.52386.3";
export const GOOD_VERSION =
  "FDA vested through the child spawn chain; preview_start children can getcwd under Documents; TCC grants reach bash/python children";
export const SURFACE = "preview_start-named-launch";
export const HOST = "Darwin 25.6.0";
export const DESKTOP_BUNDLE = "com.anthropic.claudefordesktop";
export const RIVAL_BUNDLE = "com.anthropic.claude-code";
export const TCC_SERVICE = "kTCCServiceSystemPolicyAllFiles";
export const TCC_ROW =
  "kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2";
export const AUTH_VALUE = 2;
export const DEMESNE_PATH = "~/Documents/...";
export const LAUNCH_FILE = ".claude/launch.json";
export const COMMAND = 'preview_start({name: "..."})';
export const GETCWD_ERROR =
  "getcwd: cannot access parent directories: Operation not permitted";
export const PYTHON_ERROR = "[Errno 1] Operation not permitted";
export const DENIAL_KIND = "System Policy";
export const PHRASE = "Score feoffee or admit vested.";
export const DISTRIBUTION =
  "A .claude/launch.json named dev-server (preview_start({name: \"...\"})) fails whenever its working directory is under ~/Documents/..., even though the desktop app (com.anthropic.claudefordesktop) has been confirmed via the system TCC database to hold Full Disk Access (kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2, auth_value 2 = granted), verified AFTER a full quit+relaunch. Failure at shell-init: getcwd: cannot access parent directories: Operation not permitted; then python3: can't open file '<script>.py': [Errno 1] Operation not permitted. Ruled out: directory/file permissions (ls -la / stat normal); iCloud/FileProvider (df/mount, plain local APFS); stale/missing target directory (fails at shell-init even against a cd target that doesn't exist); missing Full Disk Access on the desktop app itself. Unified log (log show deny) shows System Policy (TCC) against the spawned bash/python3 child PIDs — not a Seatbelt/App-Sandbox Sandbox: denial, not a plain Unix EACCES. A completely separate mechanism — Bash-tool-spawned processes under a different Anthropic bundle id, com.anthropic.claude-code — can read/write/execute in the exact same directory with no issue at the same time. Environment: macOS Darwin 25.6.0; Claude for Desktop 1.52386.3. Workaround (published, not implemented here): start the dev server via a Bash tool call, then preview_start({url: \"http://localhost:<port>\"}) instead of the name: config. Cousin #93766 (Canard OneDrive cwd mislabel) is cite-only — spawn ENOENT + wrong linker message, not TCC getcwd EPERM on Documents.";
export const RULED_OUT = Object.freeze([
  "Directory/file permissions on the target path: normal, verified via ls -la/stat",
  "iCloud/FileProvider-backed path: confirmed via df/mount, plain local APFS volume",
  "Stale/missing target directory: reproduced identically even against a cd target that doesn't exist (fails at shell-init before the cd even runs)",
  "Missing Full Disk Access on the desktop app itself: confirmed via TCC.db kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2 after quit+relaunch",
  "Seatbelt/App-Sandbox Sandbox: denial — unified log is System Policy (TCC) against spawned bash/python3 child PIDs, not Sandbox:",
  "Plain Unix EACCES — the denial is TCC System Policy, not a Unix permission bit",
]);
export const EXPECTED = Object.freeze([
  "preview_start({name: \"...\"}) children can getcwd under ~/Documents/... when the desktop app holds Full Disk Access",
  "TCC grants on com.anthropic.claudefordesktop reach spawned bash/python3 children on the named-config path",
  "System Policy does not deny getcwd against preview_start child PIDs while the lord bundle is vested",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "letters-patent", label: "letters patent", count: "FDA=2", note: "kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2 — lord holds Full Disk Access" },
  { id: "getcwd-eperm", label: "getcwd EPERM", count: "shell-init", note: "getcwd: cannot access parent directories: Operation not permitted at shell-init" },
  { id: "tcc-deny", label: "TCC deny", count: "System Policy", note: "unified log deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox" },
  { id: "rival-bundle", label: "rival bundle", count: "ok", note: "com.anthropic.claude-code Bash-tool children read/write/execute the SAME directory at the same time" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "vested-gate",
    survey: "FDA vested through the child spawn chain; preview_start children can getcwd under Documents",
    kind: "vested",
    note: "idle: the chancery keeps letters patent vested through mesne tenants — the hold/good path",
  },
  {
    id: "getcwd-eperm",
    survey: "shell-init: getcwd: cannot access parent directories: Operation not permitted; python3 Errno 1",
    kind: "unseised",
    note: "seeded: mesne tenants barred from the Documents demesne at getcwd",
  },
  {
    id: "tcc-deny",
    survey: "unified log System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox",
    kind: "unseised",
    note: "seeded: the plea roll names TCC, not sandbox",
  },
  {
    id: "rival-bundle",
    survey: "Bash-tool-spawned processes under com.anthropic.claude-code walk the SAME directory freely",
    kind: "unseised",
    note: "seeded: rival bundle is not barred; only preview_start named-config children are",
  },
  {
    id: "preview-eperm",
    survey: "preview_start({name}) named launch.json under ~/Documents hits getcwd EPERM despite parent FDA",
    kind: "unseised",
    note: "path: preview-eperm names the named-config spawn vs rival-bundle walk",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "preview-eperm",
  "unseised",
  "getcwd-eperm",
  "tcc-deny",
  "documents-demesne",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93766,
    title: "[BUG] VS Code extension fails to spawn claude binary when workspace folder is under a OneDrive-synced path (misleading musl/glibc error on Windows)",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Canard OneDrive cwd mislabel: spawn ENOENT + wrong linker message, not TCC getcwd EPERM on Documents — do not treat as the product, do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93848, title: "backup #93848", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93929, title: "backup #93929", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93915, title: "backup #93915", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "apograph",
  "airlock",
  "scotoma",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "schism",
  "gleaner",
  "waif",
  "ashpan",
  "snatch",
  "disseisin",
  "rescript",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "rasure",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
  "flashpan",
  "guillotine",
  "parergon",
  "followspot",
  "calends",
  "alidade",
  "diopter",
  "sluice",
]);

export const SAMPLE_VESTED_CHARTER = Object.freeze({
  parentFda: true,
  childrenGetcwd: true,
  tccDeny: false,
  namedLaunch: true,
  documentsPath: true,
  rivalWalks: true,
  version: GOOD_VERSION,
});

export const SAMPLE_UNSEISED_CHARTER = Object.freeze({
  parentFda: true,
  childrenGetcwd: false,
  tccDeny: true,
  namedLaunch: true,
  documentsPath: true,
  rivalWalks: true,
  version: DESKTOP_VERSION,
});

export const SAMPLE_GETCWD = Object.freeze({
  eperm: true,
  at: "shell-init",
  message: GETCWD_ERROR,
  pythonErrno: 1,
  pythonError: PYTHON_ERROR,
});

export const SAMPLE_VESTED_GETCWD = Object.freeze({
  eperm: false,
  at: "shell-init",
  message: "getcwd ok under Documents",
  pythonErrno: 0,
  pythonError: "",
});

export const SAMPLE_TCC_DENY = Object.freeze({
  kind: DENIAL_KIND,
  service: TCC_SERVICE,
  parentAuth: AUTH_VALUE,
  parentBundle: DESKTOP_BUNDLE,
  childPids: ["bash", "python3"],
  seatbelt: false,
  sandbox: false,
});

export const SAMPLE_VESTED_TCC = Object.freeze({
  kind: "granted",
  service: TCC_SERVICE,
  parentAuth: AUTH_VALUE,
  parentBundle: DESKTOP_BUNDLE,
  childPids: ["bash", "python3"],
  seatbelt: false,
  sandbox: false,
  childrenGranted: true,
});

export const SAMPLE_NAMED_LAUNCH = Object.freeze({
  file: LAUNCH_FILE,
  name: "dashboard",
  command: COMMAND,
  runtimeExecutable: "bash",
  runtimeArgs: ['-c', 'cd "~/Documents/..." && exec python3 <script>.py'],
  port: 8752,
});

export const SAMPLE_DOCUMENTS = Object.freeze({
  path: DEMESNE_PATH,
  icloud: false,
  fileProvider: false,
  apfsLocal: true,
  permissionsNormal: true,
  missingDirStillFails: true,
});

export const SAMPLE_RIVAL_BUNDLE = Object.freeze({
  bundle: RIVAL_BUNDLE,
  walks: true,
  sameDirectory: true,
  sameTime: true,
  surface: "bash-tool",
});

export const SAMPLE_LETTERS_PATENT = Object.freeze({
  row: TCC_ROW,
  authValue: AUTH_VALUE,
  granted: true,
  afterRelaunch: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds vested: FDA vested through the child spawn chain; preview_start children can getcwd under Documents" },
  { t: "getcwd-eperm", line: "shell-init getcwd: cannot access parent directories: Operation not permitted; python3 Errno 1" },
  { t: "tcc-deny", line: "unified log System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox" },
  { t: "rival-bundle", line: "com.anthropic.claude-code Bash-tool children walk the SAME ~/Documents path freely" },
  { t: "path", line: "preview-eperm — named launch.json preview_start children barred despite parent FDA" },
  { t: "score", line: "when mesne tenants cannot getcwd under Documents the booth is feoffee — Score feoffee or admit vested." },
]);

/**
 * Demesne map: lord FDA vs mesne preview_start children vs rival bundle.
 * Idle/vested: Documents open to children; letters patent reach mesne.
 * Seeded/unseised: Documents barred at getcwd; TCC deny on child PIDs.
 */
export function mapDemesne(input = {}) {
  const vested = input.vested === true && input.unseised !== true;
  const barred = !vested && (input.getcwdEperm === true || input.unseised === true || input.documentsDemesne === true);
  return {
    path: DEMESNE_PATH,
    lordLane: "letters-patent",
    mesneLane: barred ? "barred" : "open",
    rivalLane: "walks",
    seal: barred ? "unseised" : "vested",
    stamp: barred ? "preview-eperm" : "demesne-open",
    note: barred
      ? "Documents demesne barred to preview_start bash→python children despite lord FDA"
      : "Documents demesne open; TCC grants reach bash/python children",
  };
}

export function inspectGetcwd(input = {}) {
  const cwd =
    input.getcwd && typeof input.getcwd === "object"
      ? input.getcwd
      : input.vested === true && input.unseised !== true
        ? SAMPLE_VESTED_GETCWD
        : SAMPLE_GETCWD;
  const forced =
    input.getcwdEperm === true ||
    input.event === "getcwd-eperm" ||
    input.event === "unseised" ||
    input.event === "feoffee" ||
    input.unseised === true;
  const eperm = forced ? true : cwd.eperm === true && input.vested !== true;
  return {
    eperm,
    at: "shell-init",
    message: eperm ? GETCWD_ERROR : "getcwd ok under Documents",
    pythonErrno: eperm ? 1 : 0,
    stamp: eperm ? "getcwd-eperm" : "getcwd-ok",
    note: eperm
      ? "getcwd: cannot access parent directories: Operation not permitted; python3 Errno 1"
      : "preview_start children can getcwd under Documents",
  };
}

export function inspectTcc(input = {}) {
  const tcc =
    input.tcc && typeof input.tcc === "object"
      ? input.tcc
      : input.vested === true && input.unseised !== true
        ? SAMPLE_VESTED_TCC
        : SAMPLE_TCC_DENY;
  const forced =
    input.tccDeny === true ||
    input.event === "tcc-deny" ||
    input.event === "unseised" ||
    input.event === "feoffee" ||
    input.unseised === true;
  const deny = forced ? true : tcc.kind === DENIAL_KIND && input.vested !== true;
  return {
    kind: deny ? DENIAL_KIND : "granted",
    service: TCC_SERVICE,
    parentAuth: AUTH_VALUE,
    parentBundle: DESKTOP_BUNDLE,
    seatbelt: false,
    sandbox: false,
    stamp: deny ? "tcc-deny" : "letters-patent",
    note: deny
      ? "System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox"
      : "TCC grants reach bash/python children; letters patent vested",
  };
}

export function inspectNamedLaunch(input = {}) {
  const launch =
    input.launch && typeof input.launch === "object"
      ? input.launch
      : SAMPLE_NAMED_LAUNCH;
  const forced =
    input.namedLaunch === true ||
    input.event === "named-launch" ||
    input.event === "unseised" ||
    input.event === "feoffee" ||
    input.unseised === true;
  const named = forced || launch.command === COMMAND || input.vested === true;
  return {
    file: LAUNCH_FILE,
    command: COMMAND,
    named: true,
    stamp: named ? "named-launch" : "url-preview",
    note: "preview_start({name: \"...\"}) named .claude/launch.json path",
  };
}

export function inspectDocuments(input = {}) {
  const demesne =
    input.demesne && typeof input.demesne === "object"
      ? input.demesne
      : SAMPLE_DOCUMENTS;
  const forced =
    input.documentsDemesne === true ||
    input.event === "documents-demesne" ||
    input.event === "unseised" ||
    input.event === "feoffee" ||
    input.unseised === true;
  const under = forced ? true : demesne.path === DEMESNE_PATH && input.vested !== true;
  return {
    path: DEMESNE_PATH,
    icloud: false,
    fileProvider: false,
    apfsLocal: true,
    permissionsNormal: true,
    stamp: under ? "documents-demesne" : "demesne-open",
    note: under
      ? "working directory under ~/Documents/...; iCloud/FileProvider ruled out"
      : "Documents demesne open to mesne tenants",
  };
}

export function inspectRivalBundle(input = {}) {
  const rival =
    input.rival && typeof input.rival === "object"
      ? input.rival
      : SAMPLE_RIVAL_BUNDLE;
  const walks = rival.walks !== false;
  return {
    bundle: RIVAL_BUNDLE,
    walks,
    sameDirectory: true,
    sameTime: true,
    stamp: walks ? "rival-bundle-ok" : "rival-barred",
    note: "Bash-tool-spawned processes under com.anthropic.claude-code can read/write/execute the SAME directory at the same time",
  };
}

export function inspectLettersPatent(input = {}) {
  const patent =
    input.patent && typeof input.patent === "object"
      ? input.patent
      : SAMPLE_LETTERS_PATENT;
  const granted = patent.granted !== false && patent.authValue === AUTH_VALUE;
  return {
    row: TCC_ROW,
    authValue: AUTH_VALUE,
    granted,
    afterRelaunch: true,
    stamp: granted ? "desktop-fda" : "fda-missing",
    note: "desktop app holds Full Disk Access confirmed via TCC DB after quit+relaunch",
  };
}

export function readBooth(input = {}) {
  const getcwd = inspectGetcwd(input);
  const tcc = inspectTcc(input);
  const launch = inspectNamedLaunch(input);
  const documents = inspectDocuments(input);
  const rival = inspectRivalBundle(input);
  const patent = inspectLettersPatent(input);
  const unseised =
    input.vested !== true &&
    ((getcwd.eperm === true && tcc.kind === DENIAL_KIND) ||
      input.unseised === true);
  const vested =
    input.vested === true && unseised !== true && getcwd.eperm !== true;
  const path =
    (input.event === "preview-eperm" || input.previewEperm === true) &&
    (getcwd.eperm === true || input.unseised === true);
  return {
    getcwd,
    tcc,
    launch,
    documents,
    rival,
    patent,
    demesne: mapDemesne(input),
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    unseised: unseised && !vested && !path,
    vested:
      vested ||
      (!unseised &&
        !path &&
        input.unseised !== true &&
        input.previewEperm !== true &&
        getcwd.eperm !== true),
    previewEperm: path && !vested,
    mark:
      path && !vested
        ? "preview-eperm"
        : unseised && !vested
          ? "unseised"
          : "vested",
  };
}

/**
 * Published feoffee walk from #93863 only. Facts from the issue text.
 * A vested booth grants FDA through children (getcwd under Documents).
 * An unseised booth bars preview_start children with getcwd EPERM / TCC deny.
 * A preview-eperm booth names that path.
 */
export const FEOFFEE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-vested",
    vested: true,
    unseised: false,
    cue: "vested",
    note: "idle HOLD: FDA vested through the child spawn chain; preview_start children can getcwd under Documents — the hold/good path",
  },
  {
    t: "getcwd-eperm",
    event: "getcwd-eperm",
    unseised: true,
    getcwdEperm: true,
    cue: "unseised",
    note: "shell-init getcwd: cannot access parent directories: Operation not permitted; python3 Errno 1",
  },
  {
    t: "tcc-deny",
    event: "tcc-deny",
    unseised: true,
    tccDeny: true,
    cue: "unseised",
    note: "System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox",
  },
  {
    t: "rival-bundle",
    event: "rival-bundle",
    unseised: true,
    rivalBundle: true,
    cue: "unseised",
    note: "com.anthropic.claude-code Bash-tool children walk the SAME directory freely",
  },
  {
    t: "path",
    event: "preview-eperm",
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    cue: "unseised",
    note: "preview-eperm — named launch.json preview_start children barred despite parent FDA",
  },
  {
    t: "score",
    event: "feoffee",
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    documentsDemesne: true,
    namedLaunch: true,
    cue: "unseised",
    note: "feoffee — when mesne tenants cannot getcwd under Documents the booth is feoffee",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-vested",
    vested: true,
    unseised: false,
    cue: "vested",
    note: "positive control: FDA vested through children; getcwd under Documents",
  },
  {
    t: "announce",
    event: "cue-vested",
    vested: true,
    cue: "vested",
    note: "positive control: the demesne stays vested",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    vested: true,
    unseised: false,
    previewEperm: false,
    cue: "vested",
  };
}

export function seedVested() {
  return { ...emptyTicket() };
}

export function seedUnseised() {
  return {
    seed: SEEDED_WORD,
    vested: false,
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    namedLaunch: true,
    documentsDemesne: true,
    bashPythonChild: true,
    desktopFda: true,
    rivalBundle: true,
    cue: "unseised",
    issue: FEATURED_ISSUE,
    getcwd: SAMPLE_GETCWD,
    tcc: SAMPLE_TCC_DENY,
    launch: SAMPLE_NAMED_LAUNCH,
    demesne: SAMPLE_DOCUMENTS,
    rival: SAMPLE_RIVAL_BUNDLE,
    patent: SAMPLE_LETTERS_PATENT,
  };
}

export function seedFeoffee() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    cue: "unseised",
  };
}

export function seedPreviewEperm() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    event: "preview-eperm",
    cue: "unseised",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    vested: true,
    cue: "vested",
  };
}

export function seedGetcwdEperm() {
  return {
    seed: "getcwd-eperm",
    preferSeed: true,
    getcwdEperm: true,
    cue: "unseised",
  };
}

export function seedTccDeny() {
  return {
    seed: "tcc-deny",
    preferSeed: true,
    tccDeny: true,
    cue: "unseised",
  };
}

export function seedNamedLaunch() {
  return {
    seed: "named-launch",
    preferSeed: true,
    namedLaunch: true,
    cue: "unseised",
  };
}

export function seedDocumentsDemesne() {
  return {
    seed: "documents-demesne",
    preferSeed: true,
    documentsDemesne: true,
    cue: "unseised",
  };
}

export function seedLettersPatent() {
  return {
    seed: "letters-patent",
    preferSeed: true,
    vested: true,
    cue: "vested",
  };
}

export function seedDemesneOpen() {
  return {
    seed: "demesne-open",
    preferSeed: true,
    vested: true,
    cue: "vested",
  };
}

export function seedRivalBundleOk() {
  return {
    seed: "rival-bundle-ok",
    preferSeed: true,
    vested: true,
    cue: "vested",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      vested: false,
      unseised: false,
      previewEperm: false,
      getcwdEperm: false,
      tccDeny: false,
      namedLaunch: false,
      documentsDemesne: false,
      bashPythonChild: false,
      desktopFda: false,
      rivalBundle: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    vested: raw.vested === true,
    unseised:
      raw.unseised === true ||
      raw.event === "unseised" ||
      raw.event === "feoffee",
    previewEperm: raw.previewEperm === true || raw.event === "preview-eperm",
    getcwdEperm: raw.getcwdEperm === true || raw.event === "getcwd-eperm",
    tccDeny: raw.tccDeny === true || raw.event === "tcc-deny",
    namedLaunch: raw.namedLaunch === true || raw.event === "named-launch",
    documentsDemesne:
      raw.documentsDemesne === true || raw.event === "documents-demesne",
    bashPythonChild:
      raw.bashPythonChild === true || raw.event === "bash-python-child",
    desktopFda: raw.desktopFda === true || raw.event === "desktop-fda",
    rivalBundle: raw.rivalBundle === true || raw.event === "rival-bundle",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    getcwd: raw.getcwd,
    tcc: raw.tcc,
    launch: raw.launch,
    demesne: raw.demesne,
    rival: raw.rival,
    patent: raw.patent,
    charter: raw.charter,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.vested != null ||
        ticket.unseised != null ||
        ticket.previewEperm != null ||
        ticket.getcwdEperm != null ||
        ticket.tccDeny != null ||
        ticket.namedLaunch != null ||
        ticket.documentsDemesne != null ||
        ticket.bashPythonChild != null ||
        ticket.desktopFda != null ||
        ticket.rivalBundle != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.getcwd ||
        ticket.tcc ||
        ticket.launch ||
        ticket.demesne ||
        ticket.rival),
  );
}

function isVested(row) {
  if (row.unseised && row.cue !== "vested") return false;
  if (row.cue === "unseised" || row.cue === "feoffee" || row.cue === "preview-eperm") {
    return false;
  }
  if (
    row.previewEperm &&
    row.getcwdEperm &&
    row.cue !== "vested" &&
    row.vested !== true
  ) {
    return false;
  }
  if (
    row.previewEperm &&
    row.tccDeny &&
    row.cue !== "vested" &&
    row.vested !== true
  ) {
    return false;
  }
  if (row.vested === true && row.unseised !== true && row.cue !== "unseised") {
    return true;
  }
  if (
    row.cue === "vested" &&
    row.unseised !== true &&
    row.previewEperm !== true &&
    row.getcwdEperm !== true &&
    row.tccDeny !== true
  ) {
    return true;
  }
  return false;
}

function isPreviewEpermPath(row) {
  return (
    row.event === "preview-eperm" &&
    !isVested(row) &&
    (row.previewEperm === true ||
      row.getcwdEperm === true ||
      row.tccDeny === true)
  );
}

function isUnseised(row) {
  if (isVested(row)) return false;
  if (isPreviewEpermPath(row) && row.cue !== "unseised") return false;
  if (row.cue === "unseised" || row.cue === "feoffee") return true;
  if (row.unseised === true) return true;
  if (
    row.previewEperm === true &&
    row.getcwdEperm === true &&
    row.tccDeny === true
  ) {
    return true;
  }
  if (row.previewEperm === true && row.getcwdEperm === true) {
    return true;
  }
  if (
    row.getcwdEperm === true ||
    row.tccDeny === true ||
    row.documentsDemesne === true ||
    (row.previewEperm === true && row.tccDeny === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one feoffee pass against the chancery roll.
 * vested: FDA vested through children; getcwd under Documents.
 * unseised / feoffee: preview_start children hit getcwd EPERM / TCC deny.
 * preview-eperm: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPreviewEpermPath(row) ||
    (row.previewEperm && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "preview-eperm";
  } else if (isUnseised(row)) {
    verdict = "feoffee";
  } else if (isVested(row)) {
    verdict = "vested";
  } else if (
    row.previewEperm ||
    row.getcwdEperm ||
    row.tccDeny ||
    (row.documentsDemesne && !row.vested)
  ) {
    verdict = "feoffee";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const getcwd = inspectGetcwd(row);
  const tcc = inspectTcc(row);
  const launch = inspectNamedLaunch(row);
  const documents = inspectDocuments(row);
  const rival = inspectRivalBundle(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    vested: verdict === "vested" || verdict === "hold",
    unseised:
      verdict === "unseised" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    previewEperm:
      row.previewEperm === true ||
      verdict === "preview-eperm" ||
      verdict === PATH_WORD,
    getcwdEperm: row.getcwdEperm,
    tccDeny: row.tccDeny,
    namedLaunch: row.namedLaunch,
    documentsDemesne: row.documentsDemesne,
    bashPythonChild: row.bashPythonChild,
    desktopFda: row.desktopFda,
    rivalBundle: row.rivalBundle,
    cue: hold
      ? "vested"
      : row.previewEperm || verdict === "preview-eperm"
        ? "preview-eperm"
        : "unseised",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit vested" : "score feoffee",
    getcwdInspect: getcwd,
    tccInspect: tcc,
    launchInspect: launch,
    documentsInspect: documents,
    rivalInspect: rival,
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
      : FEOFFEE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "feoffee" || row.verdict === "unseised",
  );
  const path = scored.filter((row) => row.verdict === "preview-eperm");
  const vested = scored.filter((row) => row.verdict === "vested");
  const headline =
    scored.find((row) => row.event === "unseised") ||
    scored.find((row) => row.event === "preview-eperm") ||
    scored.find((row) => row.event === "getcwd-eperm") ||
    dead[dead.length - 1];
  let verdict = "vested";
  if (dead.length) verdict = "feoffee";
  else if (path.length && !vested.length) verdict = "preview-eperm";
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
    unseisedCount: dead.length,
    pathCount: path.length,
    vestedCount: vested.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit vested" : "score feoffee",
    note: headline
      ? "preview_start named launch.json children hit getcwd EPERM / System Policy deny under ~/Documents despite parent FDA; rival bundle com.anthropic.claude-code walks the same path. Cousin #93766 is cite-only."
      : "published feoffee walk scored against vested vs unseised",
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
    seeded !== "vested" &&
    seeded !== "unseised" &&
    seeded !== "preview-eperm" &&
    seeded !== "feoffee" &&
    ticket.vested == null &&
    ticket.unseised == null &&
    ticket.previewEperm == null &&
    ticket.getcwdEperm == null &&
    ticket.tccDeny == null &&
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
    vested: scored.vested ?? false,
    unseised: scored.unseised ?? false,
    previewEperm: scored.previewEperm ?? false,
    getcwdEperm: scored.getcwdEperm ?? false,
    tccDeny: scored.tccDeny ?? false,
    namedLaunch: scored.namedLaunch ?? false,
    documentsDemesne: scored.documentsDemesne ?? false,
    bashPythonChild: scored.bashPythonChild ?? false,
    desktopFda: scored.desktopFda ?? false,
    rivalBundle: scored.rivalBundle ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.getcwdEperm || result.unseised ? "getcwd=eperm" : "getcwd=ok",
    result.tccDeny || result.unseised ? "tcc=deny" : "tcc=grant",
    result.documentsDemesne || result.unseised ? "demesne=documents" : "demesne=open",
    result.previewEperm || result.verdict === "preview-eperm"
      ? "path=preview-eperm"
      : "path=vested",
    result.cue === "vested"
      ? "cue=vested"
      : result.cue === "preview-eperm"
        ? "cue=preview-eperm"
        : "cue=unseised",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    vested: result.vested,
    unseised: result.unseised,
    previewEperm: result.previewEperm,
    getcwdEperm: result.getcwdEperm,
    tccDeny: result.tccDeny,
    namedLaunch: result.namedLaunch,
    documentsDemesne: result.documentsDemesne,
    bashPythonChild: result.bashPythonChild,
    desktopFda: result.desktopFda,
    rivalBundle: result.rivalBundle,
    getcwd: input && input.getcwd,
    tcc: input && input.tcc,
    launch: input && input.launch,
    demesne: input && input.demesne,
    rival: input && input.rival,
    patent: input && input.patent,
    charter: input && input.charter,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    getcwd: inspectGetcwd({
      vested: result.vested,
      unseised: result.unseised,
      getcwdEperm: result.getcwdEperm,
      getcwd: input && input.getcwd,
    }),
    tcc: inspectTcc({
      vested: result.vested,
      unseised: result.unseised,
      tccDeny: result.tccDeny,
      tcc: input && input.tcc,
    }),
    launch: inspectNamedLaunch({
      vested: result.vested,
      unseised: result.unseised,
      namedLaunch: result.namedLaunch,
      launch: input && input.launch,
    }),
    documents: inspectDocuments({
      vested: result.vested,
      unseised: result.unseised,
      documentsDemesne: result.documentsDemesne,
      demesne: input && input.demesne,
    }),
    rival: inspectRivalBundle({
      vested: result.vested,
      unseised: result.unseised,
      rival: input && input.rival,
    }),
    demesne: mapDemesne({
      vested: result.vested,
      unseised: result.unseised,
      getcwdEperm: result.getcwdEperm,
      documentsDemesne: result.documentsDemesne,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      unseised:
        result.unseised === true ||
        result.verdict === "unseised" ||
        result.verdict === "feoffee",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      desktopVersion: DESKTOP_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      desktopBundle: DESKTOP_BUNDLE,
      rivalBundle: RIVAL_BUNDLE,
      tccRow: TCC_ROW,
      authValue: AUTH_VALUE,
      command: COMMAND,
      getcwdError: GETCWD_ERROR,
      pythonError: PYTHON_ERROR,
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
        "NON-BINDING: child processes on the preview_start named-config path do not inherit / are not granted the desktop app's Full Disk Access. Consistent with a broken responsible-process attribution somewhere in how those children are forked/exec'd — offered as the issue's own suspicion, not a source-root-cause claim. Invite verify against #93863 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
