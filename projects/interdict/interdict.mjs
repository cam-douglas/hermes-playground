#!/usr/bin/env node
/**
 * Interdict — ecclesiastical interdict / papal-bull / diocese-seal booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * When `claude-in-chrome` is loaded, its MCP `instructions` include a
 * generic Action-categories safety framework (Prohibited / Explicit
 * permission required / Regular). Language is NOT scoped to browser
 * actions (e.g. "Permanently deleting data…" with no browser qualifier).
 * The model then refuses a plain `rm` over SSH on the user's own server
 * even after repeated explicit authorization, because the instruction
 * says prohibitions stay prohibited when the user asks/authorizes. The
 * same session with Chrome toggled off runs the command normally.
 *
 *   node interdict.mjs data/interdicted.json
 *   echo '{"seed":"interdicted"}' | node interdict.mjs
 *
 * Idle word is scoped (HOLD: prohibitions stay limited to
 * browser/chrome tools — the chapel that issued the bull).
 * Seeded word is interdicted (#93798 chrome-prohibit bleed).
 * Path word is chrome-prohibit-bleed.
 * Product score word is interdict (Score interdict or admit scoped.).
 *
 * Encoded from anthropics/claude-code#93798 issue text only.
 * Hypothesis (NON-BINDING): MCP server `instructions` are injected
 * session-wide without tool-namespace scoping, so generic Prohibited
 * language outranks user authorization for Bash/SSH. Verify against
 * #93798 text only. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "scoped",
  "interdicted",
  "interdict",
  "chrome-prohibit-bleed",
  "hold",
  "parish",
  "diocese",
  "bleed",
  "mcp-instructions",
  "bash-ssh-refuse",
  "explicit-auth-ignored",
  "chrome-on-vs-off",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "scoped";
export const PATH_WORD = "chrome-prohibit-bleed";
export const SEEDED_WORD = "interdicted";
export const PRODUCT_WORD = "interdict";
export const HOLD = Object.freeze(["scoped", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "scoped",
  "parish-only",
  "chapel-bound",
  "browser-only",
]);
export const RECOVER = Object.freeze(["scoped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "interdicted" && name !== "interdict"),
);

export const FEATURED_ISSUE = 93798;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93798";
export const TITLE =
  '[BUG] claude-in-chrome MCP server\'s generic "Prohibited actions" instructions govern unrelated Bash/SSH behavior for the rest of the session';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:mcp",
  "area:chrome",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "Claude Sonnet 5";
export const GOOD_VERSION =
  "chrome toggled off (same session shape runs the command normally)";
export const SURFACE =
  "Claude Code via Conductor (Mac app); claude-in-chrome enabled via Conductor's \"Use Claude Code with Chrome\" toggle (default-on)";
export const HOST = "Conductor Mac app";
export const INSTALL_PATH = "Conductor / claude-in-chrome (default-on)";
export const COMMAND = "rm over SSH";
export const PHRASE = "Score interdict or admit scoped.";
export const DISTRIBUTION =
  "When the claude-in-chrome MCP server is loaded (enabled by default via Conductor, which wraps Claude Code), its instructions block includes a generic Action-categories safety framework (Prohibited / Explicit permission required / Regular actions). The language is general, not scoped to browser actions specifically. Example: \"Permanently deleting data (emptying trash, hard-deleting files, emails, or messages)\" is listed under Prohibited, with no qualifier limiting it to browser-initiated deletions. In the session, this caused the model to refuse a plain rm command over SSH to delete media files on the reporter's own home server, an action with nothing to do with the claude-in-chrome tool. It kept refusing even after explicit authorization, more than once, because the instruction text states the prohibition stays prohibited when the user explicitly asks for them or says they authorize it. Repro: (1) start a Claude Code / Conductor session with Use Claude Code with Chrome enabled (2) ask Claude to run a destructive Bash command (e.g. rm on a file you explicitly name and authorize) (3) Claude cites the claude-in-chrome MCP server's Prohibited actions list and refuses, even with explicit repeated authorization (4) repeat the same request in an otherwise identical session with Chrome integration disabled (/chrome toggle off, or never enabled) (5) Claude runs the command normally, citing only project-level instructions (CLAUDE.md), which contain no such blanket prohibition. Related, not duplicate: #83702 (same unconditional MCP instructions injection; that issue is token-cost, this one is behavior/jurisdiction). Environment: Claude Code via Conductor (Mac app); Model: Claude Sonnet 5; claude-in-chrome default-on.";
export const RULED_OUT = Object.freeze([
  "token-cost / context floor of unconditional MCP instructions (#83702) — same injection, different complaint",
  "silent truncation of MCP instructions with multiple servers (#43474)",
  "built-in server instructions exceeding the documented 2KB cap (#76372)",
]);
export const EXPECTED = Object.freeze([
  "claude-in-chrome safety instructions should be explicitly scoped to browser-initiated actions only, so they do not alter Bash, filesystem, or SSH",
  "if session-wide policy is intentional, it should be documented and surfaced (e.g. in /chrome or a settings screen), not silently inherited",
  "explicit repeated authorization of an unrelated rm over SSH should not stay prohibited because a browser tool listed generic deletions",
]);

export const BULL_STRIPS = Object.freeze([
  { id: "vellum", label: "papal vellum", count: "bull-set", note: "illuminated papal-bull sheet — not a radio chassis or typewriter platen" },
  { id: "parish", label: "parish chapel", count: "issuing", note: "claude-in-chrome issued the bull from its own chapel" },
  { id: "diocese", label: "diocese territory", count: "interdict", note: "generic Prohibited language covers Bash/SSH across the session" },
  { id: "seal", label: "wax seal", count: "pressed", note: "prohibitions stay prohibited even after the user authorizes" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "scoped-gate",
    survey: "watch prohibitions stay limited to browser/chrome tools",
    kind: "scoped",
    note: "idle: chapel-bound; the bull does not cover Bash/SSH — the hold/good path",
  },
  {
    id: "mcp-instructions",
    survey: "load claude-in-chrome; read the Action-categories safety framework",
    kind: "interdicted",
    note: "seeded: generic Prohibited / Explicit permission required / Regular — no browser qualifier",
  },
  {
    id: "bash-ssh-refuse",
    survey: "ask for a plain rm over SSH on the user's own server",
    kind: "interdicted",
    note: "seeded: model cites the chrome MCP Prohibited list and refuses",
  },
  {
    id: "explicit-auth-ignored",
    survey: "authorize the rm explicitly, more than once",
    kind: "interdicted",
    note: "seeded: prohibition stays prohibited when the user asks or authorizes",
  },
  {
    id: "chrome-on-vs-off",
    survey: "repeat the same request with Chrome toggled off",
    kind: "interdicted",
    note: "seeded: command runs normally, citing only CLAUDE.md — no blanket ban",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "chrome-prohibit-bleed",
  "interdicted",
  "parish",
  "diocese",
  "bleed",
  "mcp-instructions",
  "bash-ssh-refuse",
  "explicit-auth-ignored",
  "chrome-on-vs-off",
]);

export const COUSINS = Object.freeze([
  {
    issue: 83702,
    title: "Defer MCP server instructions on demand (token-cost side)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #83702 token-cost / context floor of unconditional MCP instructions injection. Distinct: this booth encodes the behavior/jurisdiction side (generic Prohibited language governing Bash/SSH). Do not rebuild",
  },
  {
    issue: 43474,
    title: "MCP server instructions silently truncated with multiple servers",
    state: "CLOSED",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #43474 silent truncation of MCP instructions. Distinct: #93798 is a session-wide jurisdiction bleed, not a mid-sentence cut. Do not rebuild",
  },
  {
    issue: 76372,
    title: "Built-in server instructions exceed the documented 2KB cap",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #76372 built-in instructions over the 2KB cap. Distinct: #93798 is unscoped Prohibited language over Bash/SSH, not a size-cap complaint. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93786, title: "backup #93786", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93778, title: "backup #93778", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93800, title: "backup #93800", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93795, title: "backup #93795", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "aphonia",
  "muzzle",
  "deadair",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "lazaret",
  "oubliette",
  "ephemera",
  "followspot",
  "mondegreen",
  "parergon",
  "guillotine",
  "flashpan",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "eidolon",
  "calends",
  "weir",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
  "bulla",
]);

export const SAMPLE_SCOPED_BULL = Object.freeze({
  chromeOn: false,
  scoped: true,
  bleed: false,
  refuse: false,
  version: GOOD_VERSION,
});

export const SAMPLE_INTERDICTED_BULL = Object.freeze({
  chromeOn: true,
  scoped: false,
  bleed: true,
  refuse: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_PARISH = Object.freeze({
  chapel: "claude-in-chrome",
  scopedToBrowser: false,
  issuedBull: true,
});

export const SAMPLE_SCOPED_PARISH = Object.freeze({
  chapel: "claude-in-chrome",
  scopedToBrowser: true,
  issuedBull: true,
});

export const SAMPLE_DIOCESE = Object.freeze({
  territory: "session",
  bashSshCovered: true,
  sessionWide: true,
});

export const SAMPLE_SCOPED_DIOCESE = Object.freeze({
  territory: "chapel",
  bashSshCovered: false,
  sessionWide: false,
});

export const SAMPLE_BLEED = Object.freeze({
  genericProhibit: true,
  noBrowserQualifier: true,
  permanentlyDeletingData: true,
});

export const SAMPLE_SCOPED_BLEED = Object.freeze({
  genericProhibit: false,
  noBrowserQualifier: false,
  permanentlyDeletingData: false,
});

export const SAMPLE_MCP = Object.freeze({
  instructionsInjected: true,
  actionCategories: true,
  prohibited: true,
});

export const SAMPLE_SCOPED_MCP = Object.freeze({
  instructionsInjected: false,
  actionCategories: false,
  prohibited: false,
});

export const SAMPLE_REFUSE = Object.freeze({
  rmOverSsh: true,
  refused: true,
  ownServer: true,
});

export const SAMPLE_SCOPED_REFUSE = Object.freeze({
  rmOverSsh: false,
  refused: false,
  ownServer: false,
});

export const SAMPLE_AUTH = Object.freeze({
  explicitAuth: true,
  ignored: true,
  staysProhibited: true,
});

export const SAMPLE_SCOPED_AUTH = Object.freeze({
  explicitAuth: false,
  ignored: false,
  staysProhibited: false,
});

export const SAMPLE_CHROME = Object.freeze({
  chromeOn: true,
  chromeOffRuns: true,
  toggleOff: "/chrome",
});

export const SAMPLE_SCOPED_CHROME = Object.freeze({
  chromeOn: false,
  chromeOffRuns: false,
  toggleOff: "/chrome",
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "bull holds scoped: prohibitions stay limited to browser/chrome tools" },
  { t: "parish", line: "claude-in-chrome chapel issues a generic Action-categories bull" },
  { t: "mcp-instructions", line: "Prohibited / Explicit permission required / Regular — no browser qualifier" },
  { t: "bash-ssh-refuse", line: "plain rm over SSH on the user's own server is refused" },
  { t: "explicit-auth-ignored", line: "repeated explicit authorization still stays prohibited" },
  { t: "chrome-on-vs-off", line: "Chrome toggled off: the same command runs, citing only CLAUDE.md" },
  { t: "path", line: "chrome-prohibit-bleed — chapel language covers the diocese" },
  { t: "score", line: "when the bull covers Bash/SSH the booth is interdict — Score interdict or admit scoped." },
]);

export function inspectParish(input = {}) {
  const chapel =
    input.parish && typeof input.parish === "object"
      ? input.parish
      : SAMPLE_PARISH;
  const forced =
    input.parishBleed === true ||
    input.event === "parish" ||
    input.event === "interdicted" ||
    input.event === "interdict" ||
    input.interdicted === true;
  const issuing = forced ? true : chapel.issuedBull === true;
  return {
    chapel: "claude-in-chrome",
    scopedToBrowser: !forced && chapel.scopedToBrowser === true,
    issuedBull: issuing,
    stamp: forced || chapel.scopedToBrowser !== true ? "parish-bleed" : "parish-hold",
    note: forced || chapel.scopedToBrowser !== true
      ? "claude-in-chrome issued a generic bull; the chapel did not keep the ban at home"
      : "prohibitions stay limited to the chapel that issued them",
  };
}

export function inspectDiocese(input = {}) {
  const see =
    input.diocese && typeof input.diocese === "object"
      ? input.diocese
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_DIOCESE
        : SAMPLE_DIOCESE;
  const forced =
    input.dioceseWide === true ||
    input.event === "diocese" ||
    input.event === "interdicted" ||
    input.event === "interdict" ||
    input.event === "chrome-prohibit-bleed" ||
    input.chromeProhibitBleed === true;
  const covered = forced ? true : see.bashSshCovered === true && input.scoped !== true;
  return {
    territory: covered ? "session" : "chapel",
    bashSshCovered: covered,
    sessionWide: covered,
    stamp: covered ? "diocese-interdict" : "chapel-bound",
    note: covered
      ? "generic Prohibited language covers Bash/SSH across the whole session"
      : "the bull stays inside the chapel; Bash/SSH are not under interdict",
  };
}

export function inspectBleed(input = {}) {
  const seep =
    input.bleed && typeof input.bleed === "object"
      ? input.bleed
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_BLEED
        : SAMPLE_BLEED;
  const forced =
    input.bleedOn === true ||
    input.event === "bleed" ||
    input.event === "interdicted" ||
    input.event === "interdict";
  const open = forced ? true : seep.genericProhibit === true && input.scoped !== true;
  return {
    genericProhibit: open,
    noBrowserQualifier: open,
    permanentlyDeletingData: open,
    stamp: open ? "bleed" : "contained",
    note: open
      ? "Permanently deleting data… listed under Prohibited with no browser qualifier"
      : "prohibitions stay qualified to browser-initiated actions",
  };
}

export function inspectMcpInstructions(input = {}) {
  const block =
    input.mcp && typeof input.mcp === "object"
      ? input.mcp
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_MCP
        : SAMPLE_MCP;
  const forced =
    input.mcpInstructions === true ||
    input.event === "mcp-instructions" ||
    input.event === "interdicted" ||
    input.event === "interdict";
  const injected = forced ? true : block.instructionsInjected === true && input.scoped !== true;
  return {
    instructionsInjected: injected,
    actionCategories: injected,
    prohibited: injected,
    stamp: injected ? "mcp-instructions" : "no-injection",
    note: injected
      ? "Action-categories safety framework injected from claude-in-chrome instructions"
      : "no session-wide Action-categories bull on this pass",
  };
}

export function inspectBashSshRefuse(input = {}) {
  const refuse =
    input.refuse && typeof input.refuse === "object"
      ? input.refuse
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_REFUSE
        : SAMPLE_REFUSE;
  const forced =
    input.bashSshRefuse === true ||
    input.event === "bash-ssh-refuse" ||
    input.event === "interdicted" ||
    input.event === "interdict";
  const denied = forced ? true : refuse.refused === true && input.scoped !== true;
  return {
    rmOverSsh: denied,
    refused: denied,
    ownServer: denied,
    stamp: denied ? "bash-ssh-refuse" : "bash-ssh-run",
    note: denied
      ? "plain rm over SSH on the user's own server is refused"
      : "Bash/SSH is not under the chapel's bull",
  };
}

export function inspectExplicitAuth(input = {}) {
  const grant =
    input.auth && typeof input.auth === "object"
      ? input.auth
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_AUTH
        : SAMPLE_AUTH;
  const forced =
    input.explicitAuthIgnored === true ||
    input.event === "explicit-auth-ignored" ||
    input.event === "interdicted" ||
    input.event === "interdict";
  const ignored = forced ? true : grant.ignored === true && input.scoped !== true;
  return {
    explicitAuth: ignored,
    ignored,
    staysProhibited: ignored,
    stamp: ignored ? "explicit-auth-ignored" : "auth-honored",
    note: ignored
      ? "prohibition stays prohibited when the user explicitly asks or authorizes"
      : "explicit authorization is honored; the bull does not outrank the user",
  };
}

export function inspectChromeToggle(input = {}) {
  const hatch =
    input.chrome && typeof input.chrome === "object"
      ? input.chrome
      : input.scoped === true && input.interdicted !== true
        ? SAMPLE_SCOPED_CHROME
        : SAMPLE_CHROME;
  const forced =
    input.chromeOnVsOff === true ||
    input.event === "chrome-on-vs-off" ||
    input.event === "interdicted" ||
    input.event === "interdict";
  const contrast = forced ? true : hatch.chromeOffRuns === true && input.scoped !== true;
  return {
    chromeOn: contrast,
    chromeOffRuns: contrast,
    toggleOff: "/chrome",
    stamp: contrast ? "chrome-on-vs-off" : "chrome-idle",
    note: contrast
      ? "Chrome on: refuse. Chrome off: the same rm runs, citing only CLAUDE.md"
      : "no chrome-on-vs-off contrast on this pass",
  };
}

export function readBooth(input = {}) {
  const parish = inspectParish(input);
  const diocese = inspectDiocese(input);
  const bleed = inspectBleed(input);
  const mcp = inspectMcpInstructions(input);
  const refuse = inspectBashSshRefuse(input);
  const auth = inspectExplicitAuth(input);
  const chrome = inspectChromeToggle(input);
  const interdicted =
    input.scoped !== true &&
    ((refuse.refused && auth.ignored && bleed.genericProhibit) ||
      input.interdicted === true);
  const scoped =
    input.scoped === true && interdicted !== true && refuse.refused !== true;
  const path =
    (input.event === "chrome-prohibit-bleed" || input.chromeProhibitBleed === true) &&
    (bleed.genericProhibit || input.interdicted === true);
  return {
    parish,
    diocese,
    bleed,
    mcp,
    refuse,
    auth,
    chrome,
    strips: BULL_STRIPS,
    stations: BOOTH_STATIONS,
    interdicted: interdicted && !scoped && !path,
    scoped: scoped || (!interdicted && !path && input.interdicted !== true && input.chromeProhibitBleed !== true && refuse.refused !== true),
    chromeProhibitBleed: path && !scoped,
    mark:
      path && !scoped
        ? "chrome-prohibit-bleed"
        : interdicted && !scoped
          ? "interdicted"
          : "scoped",
  };
}

/**
 * Published interdict walk from #93798 only. Facts from the issue text.
 * A scoped booth keeps prohibitions inside the chapel.
 * An interdicted booth lets the chapel's bull cover Bash/SSH.
 * A chrome-prohibit-bleed booth names the diocese-wide path.
 */
export const INTERDICT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-scoped",
    scoped: true,
    interdicted: false,
    cue: "scoped",
    note: "idle HOLD: prohibitions stay limited to browser/chrome tools — the hold/good path",
  },
  {
    t: "mcp-instructions",
    event: "mcp-instructions",
    interdicted: true,
    mcpInstructions: true,
    cue: "interdicted",
    note: "generic Action-categories — no browser qualifier",
  },
  {
    t: "bash-ssh-refuse",
    event: "bash-ssh-refuse",
    interdicted: true,
    bashSshRefuse: true,
    cue: "interdicted",
    note: "plain rm over SSH on the user's own server is refused",
  },
  {
    t: "explicit-auth-ignored",
    event: "explicit-auth-ignored",
    interdicted: true,
    explicitAuthIgnored: true,
    cue: "interdicted",
    note: "repeated explicit authorization still stays prohibited",
  },
  {
    t: "chrome-on-vs-off",
    event: "chrome-on-vs-off",
    interdicted: true,
    chromeOnVsOff: true,
    cue: "interdicted",
    note: "Chrome off: the same command runs, citing only CLAUDE.md",
  },
  {
    t: "path",
    event: "chrome-prohibit-bleed",
    interdicted: true,
    chromeProhibitBleed: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    cue: "interdicted",
    note: "chrome-prohibit-bleed — chapel language covers the diocese",
  },
  {
    t: "score",
    event: "interdict",
    interdicted: true,
    chromeProhibitBleed: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    mcpInstructions: true,
    chromeOnVsOff: true,
    bleedOn: true,
    cue: "interdicted",
    note: "interdict — when the bull covers Bash/SSH the booth never stays scoped",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-scoped",
    scoped: true,
    interdicted: false,
    cue: "scoped",
    note: "positive control: prohibitions stay limited to browser/chrome tools",
  },
  {
    t: "announce",
    event: "cue-scoped",
    scoped: true,
    cue: "scoped",
    note: "positive control: chapel-bound — Bash/SSH not under the bull",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    scoped: true,
    interdicted: false,
    chromeProhibitBleed: false,
    cue: "scoped",
  };
}

export function seedScoped() {
  return { ...emptyTicket() };
}

export function seedInterdicted() {
  return {
    seed: SEEDED_WORD,
    scoped: false,
    interdicted: true,
    chromeProhibitBleed: true,
    parishBleed: true,
    dioceseWide: true,
    bleedOn: true,
    mcpInstructions: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    chromeOnVsOff: true,
    cue: "interdicted",
    issue: FEATURED_ISSUE,
    parish: SAMPLE_PARISH,
    diocese: SAMPLE_DIOCESE,
    bleed: SAMPLE_BLEED,
    mcp: SAMPLE_MCP,
    refuse: SAMPLE_REFUSE,
    auth: SAMPLE_AUTH,
    chrome: SAMPLE_CHROME,
  };
}

export function seedInterdict() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    interdicted: true,
    chromeProhibitBleed: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    mcpInstructions: true,
    chromeOnVsOff: true,
    bleedOn: true,
    cue: "interdicted",
  };
}

export function seedChromeProhibitBleed() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    interdicted: true,
    chromeProhibitBleed: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    event: "chrome-prohibit-bleed",
    cue: "interdicted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    scoped: true,
    cue: "scoped",
  };
}

export function seedParish() {
  return {
    seed: "parish",
    preferSeed: true,
    parishBleed: true,
    cue: "interdicted",
  };
}

export function seedDiocese() {
  return {
    seed: "diocese",
    preferSeed: true,
    dioceseWide: true,
    cue: "interdicted",
  };
}

export function seedBleed() {
  return {
    seed: "bleed",
    preferSeed: true,
    bleedOn: true,
    cue: "interdicted",
  };
}

export function seedMcpInstructions() {
  return {
    seed: "mcp-instructions",
    preferSeed: true,
    mcpInstructions: true,
    cue: "interdicted",
  };
}

export function seedBashSshRefuse() {
  return {
    seed: "bash-ssh-refuse",
    preferSeed: true,
    bashSshRefuse: true,
    cue: "interdicted",
  };
}

export function seedExplicitAuthIgnored() {
  return {
    seed: "explicit-auth-ignored",
    preferSeed: true,
    explicitAuthIgnored: true,
    cue: "interdicted",
  };
}

export function seedChromeOnVsOff() {
  return {
    seed: "chrome-on-vs-off",
    preferSeed: true,
    chromeOnVsOff: true,
    cue: "interdicted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      scoped: false,
      interdicted: false,
      chromeProhibitBleed: false,
      parishBleed: false,
      dioceseWide: false,
      bleedOn: false,
      mcpInstructions: false,
      bashSshRefuse: false,
      explicitAuthIgnored: false,
      chromeOnVsOff: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    scoped: raw.scoped === true,
    interdicted:
      raw.interdicted === true ||
      raw.event === "interdicted" ||
      raw.event === "interdict",
    chromeProhibitBleed:
      raw.chromeProhibitBleed === true || raw.event === "chrome-prohibit-bleed",
    parishBleed: raw.parishBleed === true || raw.event === "parish",
    dioceseWide: raw.dioceseWide === true || raw.event === "diocese",
    bleedOn: raw.bleedOn === true || raw.event === "bleed",
    mcpInstructions: raw.mcpInstructions === true || raw.event === "mcp-instructions",
    bashSshRefuse: raw.bashSshRefuse === true || raw.event === "bash-ssh-refuse",
    explicitAuthIgnored:
      raw.explicitAuthIgnored === true || raw.event === "explicit-auth-ignored",
    chromeOnVsOff: raw.chromeOnVsOff === true || raw.event === "chrome-on-vs-off",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    parish: raw.parish,
    diocese: raw.diocese,
    bleed: raw.bleed,
    mcp: raw.mcp,
    refuse: raw.refuse,
    auth: raw.auth,
    chrome: raw.chrome,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.scoped != null ||
        ticket.interdicted != null ||
        ticket.chromeProhibitBleed != null ||
        ticket.bashSshRefuse != null ||
        ticket.explicitAuthIgnored != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.refuse ||
        ticket.auth ||
        ticket.mcp),
  );
}

function isScoped(row) {
  if (row.interdicted && row.cue !== "scoped") return false;
  if (
    row.cue === "interdicted" ||
    row.cue === "interdict" ||
    row.cue === "chrome-prohibit-bleed"
  ) {
    return false;
  }
  if (
    row.chromeProhibitBleed &&
    row.bashSshRefuse &&
    row.cue !== "scoped" &&
    row.scoped !== true
  ) {
    return false;
  }
  if (
    row.chromeProhibitBleed &&
    row.explicitAuthIgnored &&
    row.cue !== "scoped" &&
    row.scoped !== true
  ) {
    return false;
  }
  if (row.scoped === true && row.interdicted !== true && row.cue !== "interdicted") {
    return true;
  }
  if (
    row.cue === "scoped" &&
    row.interdicted !== true &&
    row.chromeProhibitBleed !== true &&
    row.bashSshRefuse !== true &&
    row.explicitAuthIgnored !== true
  ) {
    return true;
  }
  return false;
}

function isChromeProhibitBleedPath(row) {
  return (
    row.event === "chrome-prohibit-bleed" &&
    !isScoped(row) &&
    (row.chromeProhibitBleed === true ||
      row.bashSshRefuse === true ||
      row.explicitAuthIgnored === true)
  );
}

function isInterdicted(row) {
  if (isScoped(row)) return false;
  if (isChromeProhibitBleedPath(row) && row.cue !== "interdicted") return false;
  if (row.cue === "interdicted" || row.cue === "interdict") return true;
  if (row.interdicted === true) return true;
  if (
    row.chromeProhibitBleed === true &&
    row.bashSshRefuse === true &&
    row.explicitAuthIgnored === true
  ) {
    return true;
  }
  if (row.chromeProhibitBleed === true && row.bashSshRefuse === true) {
    return true;
  }
  if (
    row.bashSshRefuse === true ||
    row.explicitAuthIgnored === true ||
    row.mcpInstructions === true ||
    row.chromeOnVsOff === true ||
    row.bleedOn === true ||
    (row.chromeProhibitBleed === true && row.explicitAuthIgnored === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one interdict pass against the papal bull.
 * scoped: prohibitions stay limited to browser/chrome tools.
 * interdicted / interdict: chapel language covers Bash/SSH.
 * chrome-prohibit-bleed: generic Prohibited text becomes diocese-wide.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isChromeProhibitBleedPath(row) ||
    (row.chromeProhibitBleed && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "chrome-prohibit-bleed";
  } else if (isInterdicted(row)) {
    verdict = "interdict";
  } else if (isScoped(row)) {
    verdict = "scoped";
  } else if (
    row.chromeProhibitBleed ||
    row.bashSshRefuse ||
    row.explicitAuthIgnored ||
    (row.chromeOnVsOff && !row.scoped)
  ) {
    verdict = "interdict";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const parish = inspectParish(row);
  const diocese = inspectDiocese(row);
  const bleed = inspectBleed(row);
  const mcp = inspectMcpInstructions(row);
  const refuse = inspectBashSshRefuse(row);
  const auth = inspectExplicitAuth(row);
  const chrome = inspectChromeToggle(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    scoped: verdict === "scoped" || verdict === "hold",
    interdicted:
      verdict === "interdicted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    chromeProhibitBleed:
      row.chromeProhibitBleed === true ||
      verdict === "chrome-prohibit-bleed" ||
      verdict === PATH_WORD,
    parishBleed: row.parishBleed,
    dioceseWide: row.dioceseWide,
    bleedOn: row.bleedOn,
    mcpInstructions: row.mcpInstructions,
    bashSshRefuse: row.bashSshRefuse,
    explicitAuthIgnored: row.explicitAuthIgnored,
    chromeOnVsOff: row.chromeOnVsOff,
    cue: hold
      ? "scoped"
      : row.chromeProhibitBleed || verdict === "chrome-prohibit-bleed"
        ? "chrome-prohibit-bleed"
        : "interdicted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit scoped" : "score interdict",
    parishInspect: parish,
    dioceseInspect: diocese,
    bleedInspect: bleed,
    mcpInspect: mcp,
    refuseInspect: refuse,
    authInspect: auth,
    chromeInspect: chrome,
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
      : INTERDICT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "interdict" || row.verdict === "interdicted",
  );
  const path = scored.filter((row) => row.verdict === "chrome-prohibit-bleed");
  const scoped = scored.filter((row) => row.verdict === "scoped");
  const headline =
    scored.find((row) => row.event === "interdicted") ||
    scored.find((row) => row.event === "chrome-prohibit-bleed") ||
    scored.find((row) => row.event === "bash-ssh-refuse") ||
    dead[dead.length - 1];
  let verdict = "scoped";
  if (dead.length) verdict = "interdict";
  else if (path.length && !scoped.length) verdict = "chrome-prohibit-bleed";
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
    interdictedCount: dead.length,
    pathCount: path.length,
    scopedCount: scoped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit scoped" : "score interdict",
    note: headline
      ? "Chrome MCP Prohibited language covers Bash/SSH on Sonnet 5; Chrome off runs the command; cousins are token-cost / truncation, not this jurisdiction bleed."
      : "published interdict walk scored against scoped vs interdicted",
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
    seeded !== "scoped" &&
    seeded !== "interdicted" &&
    seeded !== "chrome-prohibit-bleed" &&
    seeded !== "interdict" &&
    ticket.scoped == null &&
    ticket.interdicted == null &&
    ticket.chromeProhibitBleed == null &&
    ticket.bashSshRefuse == null &&
    ticket.explicitAuthIgnored == null &&
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
    scoped: scored.scoped ?? false,
    interdicted: scored.interdicted ?? false,
    chromeProhibitBleed: scored.chromeProhibitBleed ?? false,
    parishBleed: scored.parishBleed ?? false,
    dioceseWide: scored.dioceseWide ?? false,
    bleedOn: scored.bleedOn ?? false,
    mcpInstructions: scored.mcpInstructions ?? false,
    bashSshRefuse: scored.bashSshRefuse ?? false,
    explicitAuthIgnored: scored.explicitAuthIgnored ?? false,
    chromeOnVsOff: scored.chromeOnVsOff ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.scoped && !result.interdicted ? "parish=chapel" : "parish=chapel",
    result.chromeProhibitBleed || result.interdicted ? "diocese=bleed" : "diocese=scoped",
    result.mcpInstructions || result.interdicted ? "mcp=injected" : "mcp=idle",
    result.explicitAuthIgnored || result.interdicted ? "auth=ignored" : "auth=honored",
    result.chromeProhibitBleed || result.verdict === "chrome-prohibit-bleed"
      ? "path=chrome-prohibit-bleed"
      : "path=scoped",
    result.cue === "scoped"
      ? "cue=scoped"
      : result.cue === "chrome-prohibit-bleed"
        ? "cue=chrome-prohibit-bleed"
        : "cue=interdicted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    scoped: result.scoped,
    interdicted: result.interdicted,
    chromeProhibitBleed: result.chromeProhibitBleed,
    bashSshRefuse: result.bashSshRefuse,
    explicitAuthIgnored: result.explicitAuthIgnored,
    mcpInstructions: result.mcpInstructions,
    chromeOnVsOff: result.chromeOnVsOff,
    bleedOn: result.bleedOn,
    parish: input && input.parish,
    diocese: input && input.diocese,
    bleed: input && input.bleed,
    mcp: input && input.mcp,
    refuse: input && input.refuse,
    auth: input && input.auth,
    chrome: input && input.chrome,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    parish: inspectParish({
      scoped: result.scoped,
      interdicted: result.interdicted,
      parishBleed: result.parishBleed,
      parish: input && input.parish,
    }),
    diocese: inspectDiocese({
      scoped: result.scoped,
      interdicted: result.interdicted,
      dioceseWide: result.dioceseWide,
      diocese: input && input.diocese,
    }),
    bleed: inspectBleed({
      scoped: result.scoped,
      interdicted: result.interdicted,
      bleedOn: result.bleedOn,
      bleed: input && input.bleed,
    }),
    mcp: inspectMcpInstructions({
      scoped: result.scoped,
      interdicted: result.interdicted,
      mcpInstructions: result.mcpInstructions,
      mcp: input && input.mcp,
    }),
    refuse: inspectBashSshRefuse({
      scoped: result.scoped,
      interdicted: result.interdicted,
      bashSshRefuse: result.bashSshRefuse,
      refuse: input && input.refuse,
    }),
    auth: inspectExplicitAuth({
      scoped: result.scoped,
      interdicted: result.interdicted,
      explicitAuthIgnored: result.explicitAuthIgnored,
      auth: input && input.auth,
    }),
    chrome: inspectChromeToggle({
      scoped: result.scoped,
      interdicted: result.interdicted,
      chromeOnVsOff: result.chromeOnVsOff,
      chrome: input && input.chrome,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      interdicted:
        result.interdicted === true ||
        result.verdict === "interdicted" ||
        result.verdict === "interdict",
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
      strips: BULL_STRIPS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: MCP server `instructions` are injected session-wide without tool-namespace scoping, so generic Prohibited language outranks user authorization for Bash/SSH. Invite verify against #93798 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
