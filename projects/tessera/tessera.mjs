#!/usr/bin/env node
/**
 * Tessera — mosaic / tesserae / privacy-pane atelier booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * The native macOS installer runs each Claude Code release from a
 * version-named path (`~/.local/share/claude/versions/<version>`).
 * macOS TCC attributes grants to the executable PATH, so every
 * release registers a new client. System Settings then accumulates
 * one permission row per release (bare version number labels) in
 * App Management and Files & Folders. The updater deletes old
 * binaries but leaves TCC rows; users cannot remove them
 * one-by-one (`tccutil` cannot target a path; panes have no remove
 * control). Signing identity is already stable
 * (`com.anthropic.claude-code`, team Q6L2SF6YDW) — only the path
 * changes. The stable ClaudeCode.app bundle is frozen (Jul 14
 * inode); the live binary still sits at the versioned path.
 *
 *   node tessera.mjs data/tessellated.json
 *   echo '{"seed":"tessellated"}' | node tessera.mjs
 *
 * Idle word is unitary (HOLD: run from stable Claude.app bundle /
 * version-independent path; one TCC identity survives updates).
 * Seeded word is tessellated (#93929 — version-named binary path
 * → new TCC permission row every release).
 * Path word is version-path-tcc.
 * Product score word is tessera (Score tessera or admit unitary.).
 *
 * Encoded from anthropics/claude-code#93929 issue text only.
 * Hypothesis (NON-BINDING): macOS TCC keys grants to the
 * executable path rather than the stable signing identity, so a
 * version-named binary path registers a new client every release.
 * Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix. No network. No exploits. No live
 * Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "hold",
  "bundled",
  "stable-path",
  "one-row",
  "identity-kept",
  "stale-tcc-row",
  "bare-version-label",
  "bundle-frozen",
  "live-versioned",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "unitary";
export const PATH_WORD = "version-path-tcc";
export const SEEDED_WORD = "tessellated";
export const PRODUCT_WORD = "tessera";
export const HOLD = Object.freeze(["unitary", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "unitary",
  "bundled",
  "stable-path",
  "one-row",
  "identity-kept",
]);
export const RECOVER = Object.freeze(["unitary", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
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
  "onedrive-cwd",
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
  FORBIDDEN_IDLE.filter((name) => name !== "tessellated" && name !== "tessera"),
);

export const FEATURED_ISSUE = 93929;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93929";
export const TITLE =
  "[BUG] macOS permission rows accumulate one per release: version-named binary path defeats stable signing identity (refiling stale-closed #76615)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:packaging",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.263";
export const GOOD_VERSION =
  "run from stable Claude.app bundle / version-independent path; one TCC identity survives updates";
export const SURFACE = "native-macos-installer";
export const HOST = "macOS 27.0 (26A428)";
export const CHECKED_ON = "2026-09-12";
export const BUILD = "native macOS installer";
export const VERSION_DIR = "~/.local/share/claude/versions/<version>";
export const LIVE_PATH = "~/.local/share/claude/versions/2.1.263";
export const BUNDLE_PATH =
  "~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude";
export const BUNDLE_INODE = 319832836;
export const BUNDLE_LINKS = 1;
export const BUNDLE_MTIME = "2026-07-14 23:48";
export const LIVE_INODE = 336626048;
export const LIVE_LINKS = 1;
export const LIVE_MTIME = "2026-09-07 10:13";
export const SIGNING_ID = "com.anthropic.claude-code";
export const TEAM_ID = "Q6L2SF6YDW";
export const TCC_PANES = Object.freeze(["App Management", "Files & Folders"]);
export const ROW_LABEL = "bare version number";
export const TCCUTIL = "tccutil cannot target a path";
export const PANE_REMOVE = "panes have no remove control";
export const UPDATER = "updater deletes old binaries but leaves TCC rows";
export const PRIOR_REPORTS = Object.freeze([76615, 38722]);
export const VERSION_SCREE = Object.freeze([
  "2.1.195",
  "2.1.201",
  "2.1.218",
  "2.1.234",
  "2.1.247",
  "2.1.258",
  "2.1.263",
]);
export const PHRASE = "Score tessera or admit unitary.";
export const DISTRIBUTION =
  "The native installer runs each release from a version-named path (~/.local/share/claude/versions/<version>). macOS TCC attributes grants to the executable path, so every release registers a new client. System Settings then collects one permission row per release, labeled with a bare version number, in App Management and in Files & Folders. The updater deletes old binaries but leaves their rows behind, and users can't remove those rows one at a time: tccutil can't target a path, and the panes have no remove control. The signing identity is already stable (com.anthropic.claude-code, Q6L2SF6YDW). Only the path changes. Checked 2026-09-12 on Claude Code 2.1.263, macOS 27.0 (26A428): bundle ~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude inode=319832836 links=1 mtime=2026-07-14 23:48; live ~/.local/share/claude/versions/2.1.263 inode=336626048 links=1 mtime=2026-09-07 10:13. The stable ClaudeCode.app bundle is still frozen at Jul 14, with no hardlink to the live binary. Refiling of stale-closed #76615 (itself a follow-up to #38722). Cousins cite-only: #76080 (permission prompt shows version string as app name); #93747 (Desktop Documents EPERM / fragmented duplicate claude identities).";
export const RULED_OUT = Object.freeze([
  "An unstable signing identity — signing identity is already stable (com.anthropic.claude-code, team Q6L2SF6YDW); only the path changes",
  "A missing ClaudeCode.app bundle — the bundle exists at ~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude but is frozen at Jul 14 (inode 319832836) with no hardlink to the live binary",
  "A user-removable leftover — tccutil cannot target a path; App Management and Files & Folders panes have no remove control; updater deletes old binaries but leaves TCC rows",
]);
export const EXPECTED = Object.freeze([
  "One persistent \"Claude Code\" entry per permission service that survives updates",
  "Attribute grants to the existing ClaudeCode.app bundle and refresh it on every update, or run from a version-independent path",
  "No accumulating bare-version TCC rows after each release",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "version-path-tcc",
    label: "version path",
    count: "versions/<version>",
    note: "native installer runs each release from ~/.local/share/claude/versions/<version>",
  },
  {
    id: "bundle-frozen",
    label: "bundle frozen",
    count: "inode 319832836",
    note: "ClaudeCode.app Jul 14 23:48; no hardlink to live 2.1.263",
  },
  {
    id: "signing-stable",
    label: "signing identity",
    count: "Q6L2SF6YDW",
    note: "com.anthropic.claude-code is already stable; only the path changes",
  },
  {
    id: "no-remove",
    label: "stuck tiles",
    count: "tccutil",
    note: "tccutil cannot target a path; panes have no remove control",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "unitary-pane",
    survey:
      "run from stable Claude.app bundle / version-independent path; one TCC identity survives updates",
    kind: "unitary",
    note: "idle: one limestone tessera stays on the privacy pane — the hold/good path",
  },
  {
    id: "bundled",
    survey:
      "ClaudeCode.app bundle would be the live binary and the TCC client",
    kind: "unitary",
    note: "idle/hold: one-row identity-kept on a version-independent path",
  },
  {
    id: "version-path-tcc",
    survey:
      "live binary at ~/.local/share/claude/versions/2.1.263; each release is a new path",
    kind: "tessellated",
    note: "path: version-path-tcc names the version-named binary vs stable-path bundle",
  },
  {
    id: "stale-tcc-row",
    survey:
      "updater deletes old binaries but leaves TCC rows labeled with bare version numbers",
    kind: "tessellated",
    note: "seeded: App Management and Files & Folders collect one tile per release",
  },
  {
    id: "tessellated",
    survey:
      "version-named binary path → new TCC permission row every release",
    kind: "tessellated",
    note: "seeded: scree of version-number tiles that cannot be pried off",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "version-path-tcc",
  "tessellated",
  "stale-tcc-row",
  "bundle-frozen",
  "bare-version-label",
]);

export const COUSINS = Object.freeze([
  {
    issue: 76080,
    title: "permission prompt shows version string as app name",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — #93929 names this as the permission prompt and Settings row showing the version string as the app name — do not rebuild as a separate booth",
  },
  {
    issue: 93747,
    title:
      "Desktop Documents EPERM / fragmented duplicate claude identities",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — #93929 names this as the desktop app unable to read Documents because grants are split across several duplicate claude identities in Files & Folders — do not rebuild as a separate booth",
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
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "mojibake",
  "scissel",
  "feoffee",
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

export const SAMPLE_UNITARY_PROOF = Object.freeze({
  bundled: true,
  versionPathTcc: false,
  staleTccRow: false,
  identityKept: true,
  oneRow: true,
  version: GOOD_VERSION,
});

export const SAMPLE_TESSELLATED_PROOF = Object.freeze({
  bundled: false,
  versionPathTcc: true,
  staleTccRow: true,
  identityKept: false,
  oneRow: false,
  version: CLAUDE_VERSION,
});

export const SAMPLE_BUNDLE = Object.freeze({
  path: BUNDLE_PATH,
  inode: BUNDLE_INODE,
  links: BUNDLE_LINKS,
  mtime: BUNDLE_MTIME,
  frozen: true,
  hardlink: false,
});

export const SAMPLE_LIVE = Object.freeze({
  path: LIVE_PATH,
  inode: LIVE_INODE,
  links: LIVE_LINKS,
  mtime: LIVE_MTIME,
  version: CLAUDE_VERSION,
});

export const SAMPLE_PATH = Object.freeze({
  versionDir: VERSION_DIR,
  livePath: LIVE_PATH,
  signingId: SIGNING_ID,
  teamId: TEAM_ID,
  panes: [...TCC_PANES],
  rowLabel: ROW_LABEL,
});

export const SAMPLE_TCC = Object.freeze({
  updater: UPDATER,
  tccutil: TCCUTIL,
  paneRemove: PANE_REMOVE,
  panes: [...TCC_PANES],
  rowLabel: ROW_LABEL,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds unitary: run from stable Claude.app bundle / version-independent path; one TCC identity survives updates" },
  { t: "version-path-tcc", line: "live binary at ~/.local/share/claude/versions/2.1.263; bundle frozen Jul 14 inode 319832836 with no hardlink" },
  { t: "stale-tcc-row", line: "updater deletes old binaries; App Management and Files & Folders keep bare-version tiles; tccutil cannot target a path" },
  { t: "path", line: "version-path-tcc — each release drops a new tessera; signing identity com.anthropic.claude-code / Q6L2SF6YDW stays stable" },
  { t: "score", line: "when the pane sheds a scree of version tiles the booth is tessera — Score tessera or admit unitary." },
]);

/**
 * Privacy-pane map: one unitary tessera vs version-number scree.
 * Idle/unitary: one tile; identity kept.
 * Seeded/tessellated: version-named path drops a new stuck tile.
 */
export function mapPane(input = {}) {
  const tessellated =
    input.tessellated === true ||
    input.versionPathTcc === true ||
    input.staleTccRow === true ||
    input.bareVersionLabel === true;
  const unitary = input.unitary === true && !tessellated;
  return {
    stamp: tessellated ? "version-path-tcc" : "unitary-pane",
    tileLane: tessellated ? "scree" : "unitary",
    paneLane: tessellated ? "bare-version" : "claude-code",
    groutLane: tessellated ? "stuck" : "one-row",
    seal: tessellated ? "tessellated" : "unitary",
    unitary,
  };
}

export function inspectPath(input = {}) {
  const path = input.path || {};
  const hit =
    input.versionPathTcc === true ||
    input.tessellated === true ||
    input.liveVersioned === true ||
    path.livePath === LIVE_PATH;
  if (input.unitary === true && !hit) {
    return {
      stamp: "stable-path",
      livePath: BUNDLE_PATH,
      versionDir: null,
      versioned: false,
    };
  }
  if (hit) {
    return {
      stamp: "version-path-tcc",
      livePath: path.livePath || LIVE_PATH,
      versionDir: VERSION_DIR,
      versioned: true,
      version: CLAUDE_VERSION,
    };
  }
  return {
    stamp: "path-idle",
    livePath: BUNDLE_PATH,
    versioned: false,
  };
}

export function inspectTcc(input = {}) {
  const tcc = input.tcc || {};
  const stale =
    input.staleTccRow === true ||
    input.tessellated === true ||
    input.bareVersionLabel === true ||
    tcc.rowLabel === ROW_LABEL;
  if (input.unitary === true && input.staleTccRow !== true) {
    return {
      stamp: "one-row",
      stale: false,
      removable: true,
    };
  }
  return {
    stamp: stale ? "stale-tcc-row" : "tcc-idle",
    stale,
    removable: !stale,
    tccutil: TCCUTIL,
    paneRemove: PANE_REMOVE,
    panes: [...TCC_PANES],
  };
}

export function inspectBundle(input = {}) {
  const bundle = input.bundle || {};
  const kept =
    input.unitary === true ||
    input.bundled === true ||
    bundle.frozen === false;
  const frozen =
    input.tessellated === true ||
    input.bundleFrozen === true ||
    input.versionPathTcc === true ||
    bundle.frozen === true;
  if (kept && !frozen) {
    return {
      stamp: "bundled",
      path: BUNDLE_PATH,
      frozen: false,
      hardlink: true,
    };
  }
  return {
    stamp: frozen ? "bundle-frozen" : "bundle-idle",
    path: BUNDLE_PATH,
    inode: BUNDLE_INODE,
    mtime: BUNDLE_MTIME,
    frozen: !!frozen,
    hardlink: false,
  };
}

export function inspectSigning(input = {}) {
  const kept =
    input.unitary === true &&
    input.tessellated !== true &&
    input.versionPathTcc !== true;
  return {
    stamp: kept ? "identity-kept" : input.tessellated || input.versionPathTcc ? "path-changed" : "signing-idle",
    kept,
    signingId: SIGNING_ID,
    teamId: TEAM_ID,
  };
}

export function readBooth(input = {}) {
  const tessellated =
    input.tessellated === true ||
    input.versionPathTcc === true ||
    input.staleTccRow === true ||
    input.bareVersionLabel === true;
  const unitary = input.unitary === true && !tessellated;
  return {
    mark: tessellated ? "tessellated" : unitary || !tessellated ? "unitary" : "tessellated",
    unitary,
    tessellated,
    versionPathTcc: input.versionPathTcc === true || tessellated,
    staleTccRow: input.staleTccRow === true,
    bundled: input.bundled === true,
    pane: mapPane(input),
    path: inspectPath(input),
    tcc: inspectTcc(input),
    bundle: inspectBundle(input),
    signing: inspectSigning(input),
    log: input.log || [],
  };
}

export const TESSERA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-unitary",
    unitary: true,
    tessellated: false,
    cue: "unitary",
    note: "idle HOLD: run from stable Claude.app bundle / version-independent path; one TCC identity survives updates — the hold/good path",
  },
  {
    t: "version-path-tcc",
    event: "version-path-tcc",
    tessellated: true,
    versionPathTcc: true,
    cue: "tessellated",
    note: "live binary at ~/.local/share/claude/versions/2.1.263; bundle frozen Jul 14 inode 319832836 with no hardlink",
  },
  {
    t: "stale-tcc-row",
    event: "stale-tcc-row",
    tessellated: true,
    staleTccRow: true,
    cue: "tessellated",
    note: "updater deletes old binaries; App Management and Files & Folders keep bare-version tiles; tccutil cannot target a path",
  },
  {
    t: "path",
    event: "version-path-tcc",
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    cue: "tessellated",
    note: "version-path-tcc — each release drops a new tessera; signing identity stays stable",
  },
  {
    t: "score",
    event: "tessera",
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    bareVersionLabel: true,
    cue: "tessellated",
    note: "tessera — when the pane sheds a scree of version tiles the booth is tessera",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-unitary",
    unitary: true,
    tessellated: false,
    cue: "unitary",
    note: "positive control: run from stable Claude.app bundle; one TCC identity",
  },
  {
    t: "announce",
    event: "cue-unitary",
    unitary: true,
    cue: "unitary",
    note: "positive control: the pane stays unitary",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    unitary: true,
    tessellated: false,
    versionPathTcc: false,
    cue: "unitary",
  };
}

export function seedUnitary() {
  return { ...emptyTicket() };
}

export function seedTessellated() {
  return {
    seed: SEEDED_WORD,
    unitary: false,
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    bareVersionLabel: true,
    liveVersioned: true,
    cue: "tessellated",
    issue: FEATURED_ISSUE,
    path: SAMPLE_PATH,
    tcc: SAMPLE_TCC,
    bundle: SAMPLE_BUNDLE,
    proof: SAMPLE_TESSELLATED_PROOF,
  };
}

export function seedTessera() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    cue: "tessellated",
  };
}

export function seedVersionPathTcc() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    event: "version-path-tcc",
    cue: "tessellated",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    unitary: true,
    cue: "unitary",
  };
}

export function seedStaleTccRow() {
  return {
    seed: "stale-tcc-row",
    preferSeed: true,
    staleTccRow: true,
    cue: "tessellated",
  };
}

export function seedBareVersionLabel() {
  return {
    seed: "bare-version-label",
    preferSeed: true,
    bareVersionLabel: true,
    cue: "tessellated",
  };
}

export function seedBundleFrozen() {
  return {
    seed: "bundle-frozen",
    preferSeed: true,
    bundleFrozen: true,
    cue: "tessellated",
  };
}

export function seedLiveVersioned() {
  return {
    seed: "live-versioned",
    preferSeed: true,
    liveVersioned: true,
    cue: "tessellated",
  };
}

export function seedBundled() {
  return {
    seed: "bundled",
    preferSeed: true,
    unitary: true,
    cue: "unitary",
  };
}

export function seedStablePath() {
  return {
    seed: "stable-path",
    preferSeed: true,
    unitary: true,
    cue: "unitary",
  };
}

export function seedOneRow() {
  return {
    seed: "one-row",
    preferSeed: true,
    unitary: true,
    cue: "unitary",
  };
}

export function seedIdentityKept() {
  return {
    seed: "identity-kept",
    preferSeed: true,
    unitary: true,
    cue: "unitary",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      unitary: false,
      tessellated: false,
      versionPathTcc: false,
      staleTccRow: false,
      bundled: false,
      bareVersionLabel: false,
      bundleFrozen: false,
      liveVersioned: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    unitary: raw.unitary === true,
    tessellated:
      raw.tessellated === true ||
      raw.event === "tessellated" ||
      raw.event === "tessera",
    versionPathTcc: raw.versionPathTcc === true || raw.event === "version-path-tcc",
    staleTccRow: raw.staleTccRow === true || raw.event === "stale-tcc-row",
    bundled: raw.bundled === true || raw.event === "bundled",
    bareVersionLabel:
      raw.bareVersionLabel === true || raw.event === "bare-version-label",
    bundleFrozen: raw.bundleFrozen === true || raw.event === "bundle-frozen",
    liveVersioned: raw.liveVersioned === true || raw.event === "live-versioned",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    path: raw.path,
    tcc: raw.tcc,
    bundle: raw.bundle,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.unitary != null ||
        ticket.tessellated != null ||
        ticket.versionPathTcc != null ||
        ticket.staleTccRow != null ||
        ticket.bundled != null ||
        ticket.bareVersionLabel != null ||
        ticket.bundleFrozen != null ||
        ticket.liveVersioned != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.path ||
        ticket.tcc ||
        ticket.bundle),
  );
}

function isUnitary(row) {
  if (row.tessellated && row.cue !== "unitary") return false;
  if (
    row.cue === "tessellated" ||
    row.cue === "tessera" ||
    row.cue === "version-path-tcc"
  ) {
    return false;
  }
  if (
    row.versionPathTcc &&
    row.staleTccRow &&
    row.cue !== "unitary" &&
    row.unitary !== true
  ) {
    return false;
  }
  if (
    row.versionPathTcc &&
    row.bareVersionLabel &&
    row.cue !== "unitary" &&
    row.unitary !== true
  ) {
    return false;
  }
  if (row.unitary === true && row.tessellated !== true && row.cue !== "tessellated") {
    return true;
  }
  if (
    row.cue === "unitary" &&
    row.tessellated !== true &&
    row.versionPathTcc !== true &&
    row.staleTccRow !== true &&
    row.bareVersionLabel !== true
  ) {
    return true;
  }
  return false;
}

function isVersionPathTcc(row) {
  return (
    row.event === "version-path-tcc" &&
    !isUnitary(row) &&
    (row.versionPathTcc === true ||
      row.staleTccRow === true ||
      row.bareVersionLabel === true)
  );
}

function isTessellated(row) {
  if (isUnitary(row)) return false;
  if (isVersionPathTcc(row) && row.cue !== "tessellated") return false;
  if (row.cue === "tessellated" || row.cue === "tessera") return true;
  if (row.tessellated === true) return true;
  if (
    row.versionPathTcc === true &&
    row.staleTccRow === true &&
    row.bareVersionLabel === true
  ) {
    return true;
  }
  if (row.versionPathTcc === true && row.staleTccRow === true) {
    return true;
  }
  if (
    row.versionPathTcc === true ||
    row.staleTccRow === true ||
    row.bareVersionLabel === true ||
    (row.versionPathTcc === true && row.liveVersioned === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one tessera pass against the privacy pane.
 * unitary: one TCC identity on a version-independent path.
 * tessellated / tessera: version-named binary → new TCC row.
 * version-path-tcc: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isVersionPathTcc(row) ||
    (row.versionPathTcc && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "version-path-tcc";
  } else if (isTessellated(row)) {
    verdict = "tessera";
  } else if (isUnitary(row)) {
    verdict = "unitary";
  } else if (
    row.versionPathTcc ||
    row.staleTccRow ||
    row.bareVersionLabel ||
    (row.liveVersioned && !row.unitary)
  ) {
    verdict = "tessera";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const path = inspectPath(row);
  const tcc = inspectTcc(row);
  const bundle = inspectBundle(row);
  const signing = inspectSigning(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    unitary: verdict === "unitary" || verdict === "hold",
    tessellated:
      verdict === "tessellated" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    versionPathTcc:
      row.versionPathTcc === true ||
      verdict === "version-path-tcc" ||
      verdict === PATH_WORD,
    staleTccRow: row.staleTccRow,
    bundled: row.bundled,
    bareVersionLabel: row.bareVersionLabel,
    bundleFrozen: row.bundleFrozen,
    liveVersioned: row.liveVersioned,
    cue: hold
      ? "unitary"
      : row.versionPathTcc || verdict === "version-path-tcc"
        ? "version-path-tcc"
        : "tessellated",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unitary" : "score tessera",
    pathInspect: path,
    tccInspect: tcc,
    bundleInspect: bundle,
    signingInspect: signing,
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
      : TESSERA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "tessera" || row.verdict === "tessellated",
  );
  const path = scored.filter((row) => row.verdict === "version-path-tcc");
  const unitary = scored.filter((row) => row.verdict === "unitary");
  const headline =
    scored.find((row) => row.event === "tessellated") ||
    scored.find((row) => row.event === "version-path-tcc") ||
    scored.find((row) => row.event === "stale-tcc-row") ||
    dead[dead.length - 1];
  let verdict = "unitary";
  if (dead.length) verdict = "tessera";
  else if (path.length && !unitary.length) verdict = "version-path-tcc";
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
    tessellatedCount: dead.length,
    pathCount: path.length,
    unitaryCount: unitary.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unitary" : "score tessera",
    note: headline
      ? "version-named binary path → new TCC permission row every release; cousins #76080 and #93747 are cite-only."
      : "published tessera walk scored against unitary vs tessellated",
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
    seeded !== "unitary" &&
    seeded !== "tessellated" &&
    seeded !== "version-path-tcc" &&
    seeded !== "tessera" &&
    ticket.unitary == null &&
    ticket.tessellated == null &&
    ticket.versionPathTcc == null &&
    ticket.staleTccRow == null &&
    ticket.bareVersionLabel == null &&
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
    unitary: scored.unitary ?? false,
    tessellated: scored.tessellated ?? false,
    versionPathTcc: scored.versionPathTcc ?? false,
    staleTccRow: scored.staleTccRow ?? false,
    bundled: scored.bundled ?? false,
    bareVersionLabel: scored.bareVersionLabel ?? false,
    bundleFrozen: scored.bundleFrozen ?? false,
    liveVersioned: scored.liveVersioned ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.versionPathTcc || result.tessellated ? "path=versioned" : "path=bundled",
    result.staleTccRow || result.tessellated ? "tcc=stale" : "tcc=one-row",
    result.versionPathTcc || result.verdict === "version-path-tcc"
      ? "path=version-path-tcc"
      : "path=unitary",
    result.cue === "unitary"
      ? "cue=unitary"
      : result.cue === "version-path-tcc"
        ? "cue=version-path-tcc"
        : "cue=tessellated",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    unitary: result.unitary,
    tessellated: result.tessellated,
    versionPathTcc: result.versionPathTcc,
    staleTccRow: result.staleTccRow,
    bundled: result.bundled,
    bareVersionLabel: result.bareVersionLabel,
    bundleFrozen: result.bundleFrozen,
    liveVersioned: result.liveVersioned,
    path: input && input.path,
    tcc: input && input.tcc,
    bundle: input && input.bundle,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    path: inspectPath({
      unitary: result.unitary,
      tessellated: result.tessellated,
      versionPathTcc: result.versionPathTcc,
      liveVersioned: result.liveVersioned,
      path: input && input.path,
    }),
    tcc: inspectTcc({
      unitary: result.unitary,
      tessellated: result.tessellated,
      staleTccRow: result.staleTccRow,
      bareVersionLabel: result.bareVersionLabel,
      tcc: input && input.tcc,
    }),
    bundle: inspectBundle({
      unitary: result.unitary,
      tessellated: result.tessellated,
      versionPathTcc: result.versionPathTcc,
      bundled: result.bundled,
      bundleFrozen: result.bundleFrozen,
      bundle: input && input.bundle,
    }),
    signing: inspectSigning({
      unitary: result.unitary,
      tessellated: result.tessellated,
      versionPathTcc: result.versionPathTcc,
    }),
    pane: mapPane({
      unitary: result.unitary,
      tessellated: result.tessellated,
      versionPathTcc: result.versionPathTcc,
      staleTccRow: result.staleTccRow,
      bareVersionLabel: result.bareVersionLabel,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      tessellated:
        result.tessellated === true ||
        result.verdict === "tessellated" ||
        result.verdict === "tessera",
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
      checkedOn: CHECKED_ON,
      build: BUILD,
      versionDir: VERSION_DIR,
      livePath: LIVE_PATH,
      bundlePath: BUNDLE_PATH,
      bundleInode: BUNDLE_INODE,
      bundleMtime: BUNDLE_MTIME,
      liveInode: LIVE_INODE,
      liveMtime: LIVE_MTIME,
      signingId: SIGNING_ID,
      teamId: TEAM_ID,
      tccPanes: [...TCC_PANES],
      rowLabel: ROW_LABEL,
      tccutil: TCCUTIL,
      paneRemove: PANE_REMOVE,
      updater: UPDATER,
      priorReports: [...PRIOR_REPORTS],
      versionScree: [...VERSION_SCREE],
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
        "NON-BINDING: macOS TCC keys grants to the executable path rather than the stable signing identity, so a version-named binary path (~/.local/share/claude/versions/<version>) registers a new TCC client every release even though com.anthropic.claude-code / team Q6L2SF6YDW is already stable. The updater deletes old binaries but cannot retract their TCC rows; tccutil cannot target a path and the panes have no remove control. The frozen ClaudeCode.app bundle (Jul 14 inode 319832836) is not the live binary. Invite verify against #93929 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
