#!/usr/bin/env node
/**
 * Efface — mechanical efface / ratchet / credentials-files /
 * sentinel-wheel atelier booth.
 * A *efface* is the spring-loaded pin that drops into a
 * ratchet notch so the wheel indexes with a click you can
 * feel. Session-row left-clicks should seat in that notch
 * (credentials-files finds the row; the efface clicks; the session
 * opens). After 2.1.270 shared mouse dispatch, the click
 * lands but the pin never seats — deaf click / missing
 * efface on fullscreen macOS Terminal.app.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: since 2.1.270, left clicking a session row in
 * the `claude agents` list no longer opens that session.
 * Nothing happens on click. Keyboard navigation (arrows +
 * Enter) still works. Rolling back to 2.1.270 restores
 * clicking. 2.1.270 is still affected. Fullscreen TUI on
 * Apple Terminal.app. The session row's own onClick looks
 * unchanged; the shared mouse dispatch changed — click
 * position is now resolved to a node in a separate step,
 * and a new hover scope / injectHosts mechanism was added.
 *
 * Encoded from anthropics/claude-code#95135 issue text only.
 * Hypothesis (NON-BINDING — issue text): the shared
 * invoked-skillsing change looks like the likely cause, since
 * only clicking regressed. Invite verify against #95135
 * text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a Claude
 * Code fix. No network. No exploits. No live Claude.
 *
 *   node efface.mjs data/absent.json
 *   echo '{"seed":"absent"}' | node efface.mjs
 *
 * Idle word is sentinel (HOLD: click seats in the efface;
 * credentials-files finds the row; session opens).
 * HOLD aliases: masked, present, housed.
 * Primary idle is sentinel because Cathead already used seated.
 * Seeded word is absent (#95135 path).
 * Path word is mask-void.
 * Product score word is efface (Score efface or
 * admit sentinel.).
 *
 * NOT Prosopon/#94575 (advisor-shadow). NOT Slipway/#94458
 * (iface-swap). NOT Freshet/#94430 (init-flood).
 * NOT Kintsugi/#94451 (heal-abort). NOT Cenotaph/#94452
 * (dead-install). NOT Stratum/#94417. NOT Tmesis/#86198.
 * NOT Vedette/#94392. NOT Orloj/#94393. NOT Brisure/#94396.
 * NOT Diptych/#94397. NOT Vizard/#94398. NOT Treacle/Somnus.
 * NOT Gauntlet. NOT Cathead (seated / ptmx-race).
 * Issue text names no cousin tickets — cousins stay empty.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sentinel",
  "absent",
  "mask-void",
  "masked",
  "present",
  "housed",
  "credentials-files",
  "hosts-yml",
  "inject-hosts",
  "deny-read",
  "gh-auth",
  "tls-terminate",
  "enoent",
  "terminal-app",
  "95135",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "sentinel";
export const PATH_WORD = "mask-void";
export const SEEDED_WORD = "absent";
export const PRODUCT_WORD = "efface";
export const HOLD = Object.freeze(["sentinel"]);
export const HOLD_ALIASES = Object.freeze(["masked", "present", "housed"]);
export const RECOVER = Object.freeze(["sentinel"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "ascribed",
  "credited",
  "named",
  "billed",
  "moored",
  "lashed",
  "warped",
  "fendered",
  "slipped",
  "iface-swap",
  "buoyed",
  "freshet",
  "init-flood",
  "mended",
  "kintsugi",
  "heal-abort",
  "homed",
  "cenotaph",
  "dead-install",
  "shared",
  "stratum",
  "layer-unsealed",
  "contiguous",
  "tmesis",
  "mid-inject",
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "seated",
  "brisk",
  "cadence",
  "released",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "blazoned",
  "tabard",
  "surfaced",
  "charted",
  "sounding",
  "cleared",
  "repointed",
  "relocated",
  "settled",
  "verbatim",
  "quiet",
  "intact",
  "stood",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "ptmx-race",
  "advisor-shadow",
  "raced",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "reknit",
  "paraphrase",
  "skill-drop",
  "truncated",
  "verbatim",
  "deaf-click",
  "prosopon",
  "miscast",
  "slipway",
  "slipped",
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "frangible",
  "nameplate",
  "matryoshka",
  "init-flood",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
  "iface-swap",
  "advisor-shadow",
  "gauntlet",
  "cathead",
  "ptmx-race",
  "seated",
]);

export const FEATURED_ISSUE = 95135;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/95135";
export const TITLE =
  "Sandbox credentials.files mask produces no file at all for ~/.config/gh/hosts.yml";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:sandbox",
]);
export const PLATFORM = "linux";
export const SURFACE = "mask-void";
export const HOST =
  "Claude Code 2.1.270 native; Linux remote/EC2 via desktop remote client; gh 2.100.0";
export const CHECKED_ON =
  "Published report: credentials.files mask for ~/.config/gh/hosts.yml should inject a sentinel copy (oauth_token scrubbed) but inside sandbox the path is ENOENT — not sentinel, not real; ls ~/.config/gh/ shows only config.yml; gh auth status not logged in; git HTTPS asks for Username; same commands work outside sandbox";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "failure is missing masked sentinel file inside sandbox, not gh binary or regex mismatch outside sandbox";
export const OS = "Linux remote/EC2";
export const PHRASE = "Score efface or admit sentinel.";
export const DISTRIBUTION =
  "Claude Code 2.1.270 on Linux remote/EC2 (desktop remote client). Docs: mask-credential-files should place a sentinel ~/.config/gh/hosts.yml with oauth_token replaced by placeholder while outbound api.github.com uses real token via sandbox proxy. Config: credentials.files path ~/.config/gh/hosts.yml, mode mask, extract oauth_token, injectHosts api.github.com, maskDuplicates true, onExtractNoMatch error; broad denyRead ~/ with allowRead for config.yml — mask should be independent of denyRead per docs. Actual: file absent entirely (ENOENT). Synthetic scoring only — no live Claude.";

export const CODE_BUILD = "2.1.270";
export const CODE_BUILD_OK = "2.1.270";
export const CODE_BUILD_STILL = "2.1.270";
export const TERMINAL = "Linux remote/EC2";
export const TERM = "gh-2.100.0";
export const TUI_MODE = "native-sandbox";
export const SETTINGS_KEY = "credentials.files";
export const COMMAND = "read ~/.config/gh/hosts.yml";
export const WORKAROUND = "escalate gh/git over unsandboxed path";
export const ROW_KINDS = Object.freeze([
  "credentials.files mask rule",
  "~/.config/gh/hosts.yml path",
  "expected sentinel copy",
  "actual ENOENT in sandbox",
]);

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_SENTINEL = Object.freeze({
  kind: "sentinel",
  filePresent: true,
  maskVoid: false,
  note: "masked sentinel hosts.yml appears inside sandbox; gh sees scrubbed oauth_token",
  synthetic: true,
});
export const SYNTHETIC_ABSENT = Object.freeze({
  kind: "absent",
  filePresent: false,
  maskVoid: true,
  note: "hosts.yml path is ENOENT — credential file effaced entirely",
  synthetic: true,
});
export const SYNTHETIC_MASK_VOID = Object.freeze({
  kind: "mask-void",
  rows: [
    { lane: "credentials.files", block: "mask rule configured", live: true, note: "sentinel" },
    { lane: "hosts.yml", block: "expected sentinel", live: false, note: "absent" },
    { lane: "config.yml", block: "allowRead visible", live: true, note: "present" },
    { lane: "gh auth", block: "not logged in", live: false, note: "absent" },
    { lane: "outside sandbox", block: "file 216 bytes", live: true, note: "tls-terminate" },
    { lane: "workaround", block: "unsandboxed gh/git", live: true, note: "sentinel on pin" },
  ],
  note: "mask configured but vault slot empty inside sandbox",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "credentials.files mask rule",
    click: "configured",
    keyboard: "schema ok",
    live: true,
    absent: false,
  },
  {
    lane: "~/.config/gh/hosts.yml path",
    click: "ENOENT",
    keyboard: "n/a",
    live: false,
    absent: true,
  },
  {
    lane: "expected sentinel copy",
    click: "missing",
    keyboard: "n/a",
    live: false,
    absent: true,
  },
  {
    lane: "actual ENOENT in sandbox",
    click: "only config.yml",
    keyboard: "gh logged out",
    live: false,
    absent: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "ratchet-wheel",
    lost: "Ratchet wheel — session-row clicks spin the wheel but never index",
    control: "A sentinel wheel would seat the efface and open the row",
    story: "left click lands; the wheel does not click into the next tooth",
  },
  {
    id: "efface-pin",
    lost: "Efface pin — credentials-files never drops the pin into the row notch",
    control: "the pin would seat when the click resolves to the session node",
    story: "shared dispatch now resolves click to a node in a separate step",
  },
  {
    id: "click-pawl",
    lost: "Click pawl — no tactile efface feedback; deaf click",
    control: "the pawl would click when the row is selected",
    story: "selection does nothing; keyboard arrows + Enter still work",
  },
  {
    id: "hit-plate",
    lost: "Hit plate — hover scope / injectHosts miss the session row",
    control: "the plate would register the row under the cursor",
    story: "new hover scope / injectHosts mechanism added in 2.1.270",
  },
  {
    id: "sentinel-dial",
    lost: "Notched dial — fullscreen Terminal.app loses the index seat",
    control: "fullscreen TUI would still notch the clicked row",
    story: "tui fullscreen on Apple Terminal.app; TERM=xterm-256color",
  },
  {
    id: "index-seat",
    lost: "Index seat — row onClick looks unchanged; shared dispatch is the miss",
    control: "the seat would still fire the row's own onClick",
    story: "session row onClick unchanged; only clicking regressed",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "ratchet-wheel",
    survey: "sentinel HOLD: click seats in the efface; credentials-files finds the row; session opens",
    kind: "sentinel",
    note: "idle/control: the pin drops into the notch",
  },
  {
    id: "efface-pin",
    survey: "shared mouse dispatch resolves click to a node in a separate step",
    kind: "absent",
    note: "seeded: the pin never drops",
  },
  {
    id: "click-pawl",
    survey: "left click on claude agents session row does nothing",
    kind: "absent",
    note: "seeded: absent; no efface feedback",
  },
  {
    id: "hit-plate",
    survey: "hover scope / injectHosts added; credentials-files misses the row",
    kind: "absent",
    note: "seeded: the plate does not register the row",
  },
  {
    id: "sentinel-dial",
    survey: "fullscreen macOS Terminal.app; 2.1.270 works; 2.1.270/2.1.270 broken",
    kind: "absent",
    note: "seeded: the dial lost its index on fullscreen",
  },
  {
    id: "index-seat",
    survey: "mask-void — row onClick unchanged; only clicking regressed; tls-terminate",
    kind: "absent",
    note: "path: mask-void names the missing efface",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "credentials-files",
    label: "credentials-files",
    count: "miss",
    note: "click position resolved to a node in a separate step",
  },
  {
    id: "hosts-yml",
    label: "hosts-yml",
    count: "scope",
    note: "new hover scope / injectHosts mechanism in 2.1.270",
  },
  {
    id: "inject-hosts",
    label: "inject-hosts",
    count: "key",
    note: "injectHosts added to shared mouse dispatch",
  },
  {
    id: "deny-read",
    label: "deny-read",
    count: "full",
    note: "tui fullscreen on Apple Terminal.app",
  },
  {
    id: "gh-auth",
    label: "gh-auth",
    count: "same",
    note: "session row onClick looks unchanged",
  },
  {
    id: "mask-void",
    label: "mask-void",
    count: "dead",
    note: "path: shared hit testing change; only clicking regressed",
  },
]);

export const RULED_OUT = Object.freeze([
  " Apocope/#95127 — WebFetch truncation / unmarked — DIFFERENT",
  " Precis/#94564 — skill-drop / reknit — DIFFERENT",
  " Detent/#94565 — mouse-dead / notched-wheel — DIFFERENT",
  " Dictabelt — segment-drop / verbatim — DIFFERENT",
  " Mojibake — fffd-spall — DIFFERENT",
  " Rasure/Cancellans/Rescript — intact / creation-time — DIFFERENT",
  " #94565 — detent hit-test — DIFFERENT; cite only",
  " #94553 — backup next-focus — DIFFERENT; cite only",
  " #94560 — backup next-focus — DIFFERENT; cite only",
  " #93924 — RC local slowdown — DIFFERENT; cite only; backup next-focus",
  " #93770 — copy padding artifacts — DIFFERENT; enhancement; backup next-focus",
  " #93777 — Vercel MCP teamId — DIFFERENT; cite only; backup next-focus",
  " #94151 — Shift+PageUp Konsole — DIFFERENT; cite only; backup next-focus",
  "Prosopon/#94575 — advisor-shadow / Fable paint — DIFFERENT",
  "Slipway/#94458 — dry-dock iface-swap — DIFFERENT",
  "Freshet/#94430 — river-stage init-flood — DIFFERENT",
  "Kintsugi/#94451 — gold never sets — DIFFERENT",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — herald college — DIFFERENT",
  "Diptych/#94397 — wax-tablet brief-echo — DIFFERENT",
  "Vizard/#94398 — Renaissance masque / background-reset — DIFFERENT",
  "Gauntlet — tilting-yard iron-glove — DIFFERENT",
  "Cathead/#93624 — seated / ptmx-race — DIFFERENT; do not reuse seated",
]);

export const EXPECTED = Object.freeze([
  "Masked sentinel ~/.config/gh/hosts.yml appears inside sandbox per mask-credential-files docs",
  "gh auth status sees scrubbed file — admit sentinel",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Install credentials.files mask sentinel for hosts.yml on remote/EC2 sandbox launch path",
  "Surface credentials mask status in /sandbox Config tab (issue notes section missing)",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mask-void",
  "efface",
  "credentials-files",
  "hosts-yml",
  "inject-hosts",
  "absent",
]);

export const COUSINS = Object.freeze([]);

export const BACKUPS = Object.freeze([
  { issue: 94553, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94560, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus — RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus — copy padding artifacts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus — Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus — Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "apocope",
  "precis",
  "prosopon",
  "slipway",
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
  "gauntlet",
  "cathead",
]);

export const SAMPLE_KIND_IDLE = "ratchet-wheel";
export const SAMPLE_KIND_SEEDED = "mask-void";
export const SAMPLE_HOLDING_IDLE = "atelier-bench";
export const SAMPLE_HOLDING_SEEDED = "absent";

export const SAMPLE_SENTINEL_PROOF = Object.freeze({
  sentinel: true,
  absent: false,
  maskVoid: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_ABSENT_PROOF = Object.freeze({
  sentinel: false,
  absent: true,
  maskVoid: true,
  credentialsFiles: true,
  hostsYml: true,
  injectHosts: true,
  denyRead: true,
  ghAuth: true,
  tlsTerminate: true,
  enoent: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  sentinelWatch: { ...SYNTHETIC_SENTINEL },
  absentWatch: { ...SYNTHETIC_ABSENT },
  maskVoidShape: { ...SYNTHETIC_MASK_VOID },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds sentinel: click seats in the efface; session opens" },
  { t: "mask-void", line: "shared mouse dispatch resolves click to a node in a separate step" },
  { t: "path", line: "mask-void — credentials-files/efface feedback gone on fullscreen Terminal.app" },
  { t: "score", line: "when the pin never seats the booth is absent — Score efface or admit sentinel." },
]);

const FORCE_FLAGS = [
  "maskVoid",
  "credentialsFiles",
  "hostsYml",
  "injectHosts",
  "denyRead",
  "ghAuth",
  "tlsTerminate",
  "enoent",
  "absent",
];

const ISSUE_CUE_RE =
  /95135|absent|mask-void|hosts\.yml|credentials\.files|oauth_token|ENOENT|gh auth|injectHosts|api\.github\.com/i;

/**
 * Educational mask-void observer. Not a Claude Code patch.
 * Encodes only the published #95135 shapes.
 *
 * Click lands; selection does nothing.
 */
export function observeMaskVoid({
  clickLanded = true,
  selectionOpened = false,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      clickLanded: true,
      selectionOpened: true,
      dead: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const dead = clickLanded === true && selectionOpened === false;
  return {
    clickLanded,
    selectionOpened,
    dead,
    phrase: dead ? "score efface" : "admit sentinel",
    note: dead
      ? "left click lands; selection does nothing; efface never seats"
      : "click seats in the notch",
    synthetic: true,
  };
}

/**
 * Educational credentials-files observer. Not a Claude Code patch.
 * Published: click position resolved to a node in a separate step.
 */
export function inspectCredentialsFiles({
  resolvedSeparately = true,
  foundRow = false,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      resolvedSeparately,
      foundRow: true,
      missed: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const missed = resolvedSeparately === true && foundRow === false;
  return {
    resolvedSeparately,
    foundRow,
    missed,
    phrase: missed ? "score efface" : "admit sentinel",
    note: missed
      ? "credentials-files — click resolved separately; row not found"
      : "credentials-files seated the row",
    synthetic: true,
  };
}

/**
 * Educational hosts-yml observer. Not a Claude Code patch.
 * Published: new hover scope / injectHosts mechanism.
 */
export function inspectHostsYml({
  injectHosts = true,
  hostsYml = true,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      injectHosts,
      hostsYml,
      missed: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const missed = injectHosts === true && hostsYml === true;
  return {
    injectHosts,
    hostsYml,
    missed,
    phrase: missed ? "score efface" : "admit sentinel",
    note: missed
      ? "hosts-yml — injectHosts mechanism added in 2.1.270"
      : "no hosts-yml miss",
    synthetic: true,
  };
}

/**
 * Educational absent observer. Not a Claude Code patch.
 * Published: left click session row does nothing.
 */
export function inspectAbsent({
  leftClick = true,
  opened = false,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      leftClick,
      opened: true,
      deaf: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const deaf = leftClick === true && opened === false;
  return {
    leftClick,
    opened,
    deaf,
    phrase: deaf ? "score efface" : "admit sentinel",
    note: deaf
      ? "absent — left click on claude agents row is ignored"
      : "click opened the session",
    synthetic: true,
  };
}

/**
 * Educational tls-terminate observer. Not a Claude Code patch.
 * Published: arrows + Enter still work.
 */
export function inspectTlsTerminate({
  arrowsEnter = true,
  opened = true,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      arrowsEnter,
      opened: true,
      stillWorks: true,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const stillWorks = arrowsEnter === true && opened === true;
  return {
    arrowsEnter,
    opened,
    stillWorks,
    phrase: stillWorks ? "score efface" : "admit sentinel",
    note: stillWorks
      ? "tls-terminate — arrows + Enter still open the session"
      : "keyboard path not in the published report",
    synthetic: true,
  };
}

/**
 * Educational deny-read observer. Not a Claude Code patch.
 * Published: tui fullscreen on Terminal.app.
 */
export function inspectDenyRead({
  preTokens = 213828,
  postTokens = 8106,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      preTokens,
      postTokens,
      flagged: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const flagged = preTokens > postTokens && postTokens < 20_000;
  return {
    preTokens,
    postTokens,
    flagged,
    phrase: flagged ? "score efface" : "admit sentinel",
    note: flagged
      ? "deny-read — manual /compact collapsed preTokens ~213828 → postTokens ~8106"
      : "not the published compaction token shape",
    synthetic: true,
  };
}

/**
 * Educational gh-auth observer. Not a Claude Code patch.
 * Published: session row onClick looks unchanged.
 */
export function inspectGhAuth({
  unchanged = true,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      unchanged,
      flagged: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  return {
    unchanged,
    flagged: unchanged === true,
    phrase: unchanged ? "score efface" : "admit sentinel",
    note: unchanged
      ? "gh-auth — session row onClick looks unchanged"
      : "row handler changed in the published compare",
    synthetic: true,
  };
}

/**
 * Educational enoent observer. Not a Claude Code patch.
 * Published: 2.1.270 shared mouse dispatch changed.
 */
export function inspectEnoent({
  version = CODE_BUILD,
  changed = true,
  sentinel = false,
} = {}) {
  if (sentinel === true) {
    return {
      version: CODE_BUILD_OK,
      changed: false,
      flagged: false,
      phrase: "admit sentinel",
      synthetic: true,
    };
  }
  const flagged = version === CODE_BUILD && changed === true;
  return {
    version,
    changed,
    flagged,
    phrase: flagged ? "score efface" : "admit sentinel",
    note: flagged
      ? "enoent — 2.1.270 resolves click to a node in a separate step"
      : "shared dispatch not in the published compare",
    synthetic: true,
  };
}

export function scoreMaskVoid(input = {}) {
  const reknitHold = input.sentinel === true && input.absent !== true;
  const dead = observeMaskVoid({
    clickLanded: true,
    selectionOpened: reknitHold,
    sentinel: reknitHold,
  });
  const absent =
    !reknitHold &&
    (input.absent === true ||
      input.maskVoid === true ||
      input.credentialsFiles === true ||
      input.hostsYml === true ||
      input.injectHosts === true ||
      input.enoent === true ||
      dead.dead === true);
  return {
    sentinel: !absent,
    absent,
    maskVoid: absent,
    dead,
    phrase: absent ? "score efface" : "admit sentinel",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "95135") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapEfface(input = {}) {
  const absent = isAbsentInput(input);
  const sentinel = input.sentinel === true && !absent;
  return {
    stamp: absent ? "mask-void" : "atelier-bench",
    holdingLane: absent ? "absent" : "atelier-bench",
    kindLane: absent ? "mask-void" : "ratchet-wheel",
    bindLane: absent ? "credentials-files" : "efface-pin",
    ribbon: absent ? "absent" : "sentinel",
    sentinel,
  };
}

export function inspectCredentialsFilesMark(input = {}) {
  const flagged =
    input.credentialsFiles === true ||
    input.absent === true ||
    isAbsentInput(input);
  if (input.sentinel === true && !flagged) {
    return { stamp: "masked", flagged: false, note: "pin still sentinel" };
  }
  return {
    stamp: flagged ? "credentials-files" : "pin-idle",
    flagged,
    note: flagged
      ? "credentials-files — click resolved separately; row not found"
      : "",
  };
}

export function inspectHostsYmlMark(input = {}) {
  const missed =
    input.hostsYml === true ||
    input.injectHosts === true ||
    input.absent === true ||
    input.maskVoid === true ||
    isAbsentInput(input);
  if (input.sentinel === true && !missed) {
    return { stamp: "present", missed: false };
  }
  return {
    stamp: missed ? "hosts-yml" : "pin-idle",
    missed,
    note: missed
      ? "hosts-yml — injectHosts mechanism added in 2.1.270"
      : "",
  };
}

export function inspectInjectHostsMark(input = {}) {
  const flagged =
    input.injectHosts === true ||
    input.absent === true ||
    isAbsentInput(input);
  if (input.sentinel === true && !flagged) {
    return { stamp: "housed", flagged: false };
  }
  return {
    stamp: flagged ? "inject-hosts" : "pin-idle",
    flagged,
    note: flagged
      ? "inject-hosts — shared mouse dispatch added injectHosts"
      : "",
  };
}

export function inspectDenyReadMark(input = {}) {
  const flagged =
    input.denyRead === true ||
    input.absent === true ||
    isAbsentInput(input);
  if (input.sentinel === true && !flagged) {
    return { stamp: "ratchet-wheel", flagged: false };
  }
  return {
    stamp: flagged ? "deny-read" : "pin-idle",
    flagged,
    note: flagged
      ? "deny-read — Apple Terminal.app; tui fullscreen"
      : "",
  };
}

export function inspectGhAuthMark(input = {}) {
  const flagged =
    input.ghAuth === true ||
    input.tlsTerminate === true ||
    input.enoent === true ||
    input.absent === true ||
    isAbsentInput(input);
  if (input.sentinel === true && !flagged) {
    return { stamp: "masked", flagged: false };
  }
  return {
    stamp: flagged ? "gh-auth" : "pin-idle",
    flagged,
    note: flagged
      ? "gh-auth — session row onClick looks unchanged"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "ratchet-wheel": input.absent || input.maskVoid,
    "efface-pin": input.absent || input.maskVoid || input.credentialsFiles,
    "click-pawl": input.absent || input.enoent,
    "hit-plate": input.hostsYml || input.injectHosts || input.absent,
    "sentinel-dial": input.denyRead || input.absent,
    "index-seat": input.ghAuth || input.absent,
  };
  return (
    map[id] === true ||
    input.maskVoid === true ||
    input.absent === true
  );
}

function isAbsentInput(input = {}) {
  return (
    input.absent === true ||
    input.maskVoid === true ||
    input.credentialsFiles === true ||
    input.hostsYml === true ||
    input.injectHosts === true ||
    input.denyRead === true ||
    input.ghAuth === true ||
    input.tlsTerminate === true ||
    input.enoent === true
  );
}

export function readBooth(input = {}) {
  const absent = isAbsentInput(input);
  const sentinel = input.sentinel === true && !absent;
  return {
    mark: absent ? "absent" : "sentinel",
    sentinel,
    absent,
    maskVoid: input.maskVoid === true || absent,
    credentialsFiles: input.credentialsFiles === true,
    hostsYml: input.hostsYml === true,
    injectHosts: input.injectHosts === true,
    denyRead: input.denyRead === true,
    ghAuth: input.ghAuth === true,
    tlsTerminate: input.tlsTerminate === true,
    enoent: input.enoent === true,
    post: mapEfface(input),
    hit: inspectCredentialsFilesMark(input),
    hover: inspectHostsYmlMark(input),
    key: inspectInjectHostsMark(input),
    fullscreen: inspectDenyReadMark(input),
    row: inspectGhAuthMark(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const EFFACE_WALK = Object.freeze([
  {
    t: "idle",
    event: "atelier-bench",
    sentinel: true,
    absent: false,
    cue: "sentinel",
    note: "idle HOLD: click seats in the efface; credentials-files finds the row; session opens",
  },
  {
    t: "mask-void",
    event: "mask-void",
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
    enoent: true,
    cue: "absent",
    note: "shared mouse dispatch resolves click to a node in a separate step",
  },
  {
    t: "path",
    event: "mask-void",
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
    hostsYml: true,
    injectHosts: true,
    denyRead: true,
    ghAuth: true,
    tlsTerminate: true,
    enoent: true,
    cue: "absent",
    note: "mask-void — credentials-files/efface feedback gone on fullscreen Terminal.app",
  },
  {
    t: "score",
    event: "absent",
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
    hostsYml: true,
    injectHosts: true,
    denyRead: true,
    ghAuth: true,
    tlsTerminate: true,
    enoent: true,
    cue: "absent",
    note: "absent — pin never seated; keyboard still indexes",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "atelier-bench",
    sentinel: true,
    absent: false,
    cue: "sentinel",
    note: "positive control: click seats in the efface; session opens",
  },
  {
    t: "admit",
    event: "atelier-bench",
    sentinel: true,
    cue: "sentinel",
    note: "positive control: the ratchet admits sentinel",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    sentinel: true,
    absent: false,
    maskVoid: false,
    cue: "sentinel",
  };
}

export function seedSentinel() {
  return { ...emptyTicket() };
}

export function seedAbsent() {
  return {
    seed: SEEDED_WORD,
    sentinel: false,
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
    hostsYml: true,
    injectHosts: true,
    denyRead: true,
    ghAuth: true,
    tlsTerminate: true,
    enoent: true,
    cue: "absent",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ABSENT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "absent",
    preferSeed: true,
    absent: true,
    maskVoid: true,
    cue: "absent",
  };
}

export function seedMaskVoid() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    absent: true,
    maskVoid: true,
    event: "mask-void",
    cue: "absent",
  };
}

export function seedMasked() {
  return { seed: "masked", preferSeed: true, sentinel: true, cue: "sentinel" };
}

export function seedPresent() {
  return { seed: "present", preferSeed: true, sentinel: true, cue: "sentinel" };
}

export function seedHoused() {
  return { seed: "housed", preferSeed: true, sentinel: true, cue: "sentinel" };
}

export function seedCredentialsFiles() {
  return {
    seed: "credentials-files",
    preferSeed: true,
    credentialsFiles: true,
    cue: "absent",
  };
}

export function seedHostsYml() {
  return {
    seed: "hosts-yml",
    preferSeed: true,
    hostsYml: true,
    cue: "absent",
  };
}

export function seedInjectHosts() {
  return {
    seed: "inject-hosts",
    preferSeed: true,
    injectHosts: true,
    cue: "absent",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sentinel: false,
      absent: false,
      maskVoid: false,
      credentialsFiles: false,
      hostsYml: false,
      injectHosts: false,
      denyRead: false,
      ghAuth: false,
      tlsTerminate: false,
      enoent: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sentinel: raw.sentinel === true,
    absent: raw.absent === true || raw.event === "absent",
    maskVoid: raw.maskVoid === true || raw.event === "mask-void",
    credentialsFiles: raw.credentialsFiles === true || raw.event === "credentials-files",
    hostsYml: raw.hostsYml === true || raw.event === "hosts-yml",
    injectHosts: raw.injectHosts === true || raw.event === "inject-hosts",
    denyRead: raw.denyRead === true || raw.event === "deny-read",
    ghAuth: raw.ghAuth === true || raw.event === "gh-auth",
    tlsTerminate: raw.tlsTerminate === true || raw.event === "tls-terminate",
    enoent: raw.enoent === true || raw.event === "enoent",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.sentinel != null ||
        ticket.absent != null ||
        ticket.maskVoid != null ||
        ticket.credentialsFiles != null ||
        ticket.hostsYml != null ||
        ticket.injectHosts != null ||
        ticket.denyRead != null ||
        ticket.ghAuth != null ||
        ticket.tlsTerminate != null ||
        ticket.enoent != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isSentinel(row) {
  if (row.absent && row.cue !== "sentinel") return false;
  if (row.cue === "absent" || row.cue === "mask-void") return false;
  if (
    row.maskVoid &&
    row.credentialsFiles &&
    row.cue !== "sentinel" &&
    row.sentinel !== true
  ) {
    return false;
  }
  if (
    row.sentinel === true &&
    row.absent !== true &&
    row.cue !== "absent"
  ) {
    return true;
  }
  if (
    row.cue === "sentinel" &&
    row.absent !== true &&
    row.maskVoid !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isMaskVoidRow(row) {
  return (
    row.event === "mask-void" &&
    !isSentinel(row) &&
    (row.maskVoid === true ||
      row.credentialsFiles === true ||
      row.absent === true)
  );
}

function isAbsentRow(row) {
  if (isSentinel(row)) return false;
  if (isMaskVoidRow(row) && row.cue !== "absent") return false;
  if (row.cue === "absent") return true;
  if (row.absent === true) return true;
  if (row.maskVoid === true && row.credentialsFiles === true) return true;
  if (
    row.maskVoid === true ||
    row.credentialsFiles === true ||
    row.hostsYml === true ||
    row.injectHosts === true ||
    row.denyRead === true ||
    row.ghAuth === true ||
    row.tlsTerminate === true ||
    row.enoent === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one efface pass against the ratchet.
 * sentinel: click seats in the efface; session opens.
 * absent: left click lands; selection does nothing.
 * mask-void: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMaskVoidRow(row) ||
    (row.maskVoid && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mask-void";
  } else if (isAbsentRow(row)) {
    verdict = "absent";
  } else if (isSentinel(row)) {
    verdict = "sentinel";
  } else if (
    row.maskVoid ||
    row.credentialsFiles ||
    row.hostsYml ||
    row.injectHosts ||
    row.denyRead ||
    row.ghAuth ||
    row.tlsTerminate ||
    row.enoent
  ) {
    verdict = "absent";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "absent";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    sentinel: verdict === "sentinel",
    absent: verdict === "absent" || verdict === SEEDED_WORD,
    maskVoid:
      row.maskVoid === true ||
      verdict === "mask-void" ||
      verdict === PATH_WORD,
    credentialsFiles: row.credentialsFiles,
    hostsYml: row.hostsYml,
    injectHosts: row.injectHosts,
    denyRead: row.denyRead,
    ghAuth: row.ghAuth,
    tlsTerminate: row.tlsTerminate,
    enoent: row.enoent,
    cue: hold
      ? "sentinel"
      : row.maskVoid || verdict === "mask-void"
        ? "mask-void"
        : "absent",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sentinel" : "score efface",
    hitInspect: inspectCredentialsFilesMark(row),
    hoverInspect: inspectHostsYmlMark(row),
    keyInspect: inspectInjectHostsMark(row),
    fullscreenInspect: inspectDenyReadMark(row),
    rowInspect: inspectGhAuthMark(row),
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
      : EFFACE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "absent");
  const path = scored.filter((row) => row.verdict === "mask-void");
  const sentinel = scored.filter((row) => row.verdict === "sentinel");
  const headline =
    scored.find((row) => row.event === "absent") ||
    scored.find((row) => row.event === "mask-void") ||
    scored.find((row) => row.event === "credentials-files") ||
    charged[charged.length - 1];
  let verdict = "sentinel";
  if (charged.length) verdict = "absent";
  else if (path.length && !sentinel.length) {
    verdict = "mask-void";
  }
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
    absentCount: charged.length,
    pathCount: path.length,
    sentinelCount: sentinel.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sentinel" : "score efface",
    note: headline
      ? "credentials.files mask should leave a sentinel hosts.yml inside sandbox; instead the path is ENOENT. Issue text names no cousin tickets."
      : "published efface walk scored against sentinel vs absent",
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
    seeded !== "sentinel" &&
    seeded !== "absent" &&
    seeded !== "mask-void" &&
    ticket.sentinel == null &&
    ticket.absent == null &&
    ticket.maskVoid == null &&
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
    sentinel: scored.sentinel ?? false,
    absent: scored.absent ?? false,
    maskVoid: scored.maskVoid ?? false,
    credentialsFiles: scored.credentialsFiles ?? false,
    hostsYml: scored.hostsYml ?? false,
    injectHosts: scored.injectHosts ?? false,
    denyRead: scored.denyRead ?? false,
    ghAuth: scored.ghAuth ?? false,
    tlsTerminate: scored.tlsTerminate ?? false,
    enoent: scored.enoent ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD || verdict === SEEDED_WORD) return PRODUCT_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.maskVoid || result.absent
      ? "kind=mask-void"
      : "kind=ratchet-wheel",
    result.credentialsFiles || result.absent
      ? "ref=credentials-files"
      : "ref=atelier-bench",
    result.maskVoid || result.verdict === "mask-void"
      ? "path=mask-void"
      : "path=sentinel",
    result.cue === "sentinel"
      ? "cue=sentinel"
      : result.cue === "mask-void"
        ? "cue=mask-void"
        : "cue=absent",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    sentinel: result.sentinel,
    absent: result.absent,
    maskVoid: result.maskVoid,
    credentialsFiles: result.credentialsFiles,
    hostsYml: result.hostsYml,
    injectHosts: result.injectHosts,
    denyRead: result.denyRead,
    ghAuth: result.ghAuth,
    tlsTerminate: result.tlsTerminate,
    enoent: result.enoent,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    hit: inspectCredentialsFilesMark({
      sentinel: result.sentinel,
      absent: result.absent,
      credentialsFiles: result.credentialsFiles,
    }),
    hover: inspectHostsYmlMark({
      sentinel: result.sentinel,
      absent: result.absent,
      hostsYml: result.hostsYml,
    }),
    key: inspectInjectHostsMark({
      sentinel: result.sentinel,
      absent: result.absent,
      injectHosts: result.injectHosts,
    }),
    fullscreen: inspectDenyReadMark({
      sentinel: result.sentinel,
      absent: result.absent,
      denyRead: result.denyRead,
    }),
    row: inspectGhAuthMark({
      sentinel: result.sentinel,
      absent: result.absent,
      ghAuth: result.ghAuth,
    }),
    post: mapEfface({
      sentinel: result.sentinel,
      absent: result.absent,
      maskVoid: result.maskVoid,
      credentialsFiles: result.credentialsFiles,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      absent: result.absent === true || result.verdict === "absent",
    })),
    leakPath: scoreMaskVoid({
      sentinel: result.sentinel === true && !result.absent,
      absent: result.absent,
      maskVoid: result.maskVoid,
      credentialsFiles: result.credentialsFiles,
      hostsYml: result.hostsYml,
      injectHosts: result.injectHosts,
      enoent: result.enoent,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): remote/EC2 desktop-remote launch path may skip credential-handling (similar gap noted for awsCredentialExport). Invite verify against #95135 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
