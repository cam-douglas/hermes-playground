#!/usr/bin/env node
/**
 * Demesne — medieval demesne / manor-charter / manorial-roll booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * the Bash tool's bwrap sandbox binds the entire `/home` directory
 * instead of scoping the mount to `$HOME` (`/home/<user>`). Bind does
 * not change ownership; `/home` is typically root:root 755. Writes that
 * land on bare `/home/...` (e.g. `/home/.mcp.json`) fail with
 * `bwrap: Can't create file at /home/.mcp.json: Permission denied`
 * even when `$HOME` is correctly `/home/<user>` in the invoking environ.
 *
 *   node demesne.mjs data/demesne.json
 *   echo '{"seed":"demesne"}' | node demesne.mjs
 *
 * Idle word is demesned (HOLD: properly scoped to $HOME).
 * Seeded word is demesne (#93989 — the overbound /home failure).
 * Path word is home-bind-overreach.
 * Product score word is demesne (Score demesne or admit demesned.).
 *
 * Encoded from anthropics/claude-code#93989 issue text only.
 * Hypothesis (NON-BINDING): mount setup uses `--bind /home /home`
 * instead of `--bind $HOME $HOME`. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix. No network.
 * No exploits. No live Claude. No secrets.
 *
 * NOT Airlock/#93862 (socat listener race before first network call).
 * NOT Feoffee/#93863 (preview_start getcwd EPERM / FDA inheritance).
 * NOT Tessera/#93776-family (version-path TCC).
 * NOT Cartouche/#93772, Attaint/#93821, Oriel/#93809, Anarthria/#93782,
 * Trismus/#93823, Foundling/#93889, Crasis, Mojibake/#93848,
 * Scissel/#93915, Apograph/#93859, Scotoma.
 * Cousin cite-only: #91122 (read-only ~/.claude bind — RO mount of
 * config dir, not overbroad /home parent). Do not conflate.
 * Demesne is specifically home-bind overreach: bwrap binds entire
 * `/home` instead of `$HOME`.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "demesned",
  "demesne",
  "home-bind-overreach",
  "hold",
  "home-scoped",
  "private-holding",
  "bind-home",
  "user-home",
  "whole-home-bind",
  "bare-home-write",
  "mcp-denied",
  "root-owned-commons",
  "env-scrub",
  "safe-mode",
  "overbound-manor",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "demesned";
export const PATH_WORD = "home-bind-overreach";
export const SEEDED_WORD = "demesne";
export const PRODUCT_WORD = "demesne";
export const HOLD = Object.freeze(["demesned", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "demesned",
  "home-scoped",
  "private-holding",
  "bind-home",
  "user-home",
]);
export const RECOVER = Object.freeze(["demesned", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "diagrammed",
  "cartouche",
  "section-poster",
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
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
  "deeded",
  "homesteaded",
  "unscoped-home",
  "untainted",
  "attainted",
  "attainder",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "demesne"),
);

export const FEATURED_ISSUE = 93989;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93989";
export const TITLE =
  "bwrap sandbox for the Bash tool binds the entire /home directory, causing Permission denied on writes outside the invoking user's own home (e.g. /home/.mcp.json)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:linux",
  "area:sandbox",
]);
export const PLATFORM = "linux";
export const SURFACE = "home-bind-overreach";
export const HOST = "Claude Code CLI";
export const CHECKED_ON =
  "Claude Code CLI v2.1.224, native install, Linux (Debian/Ubuntu-based)";
export const BUILD = "2.1.224";
export const SELECTED_MODEL = "unspecified";
export const OS = "linux";
export const PHRASE = "Score demesne or admit demesned.";
export const DISTRIBUTION =
  "When the Bash tool's bwrap sandbox is active, mount setup binds the entire /home directory rather than scoping to the invoking user's $HOME. Bind does not change ownership; /home is typically root:root 755. Any path that lands on bare /home/... (e.g. /home/.mcp.json) fails with bwrap: Can't create file at /home/.mcp.json: Permission denied even when $HOME is correctly /home/<user> in the invoking environ (verified via /proc/<pid>/environ). Observed under CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 and --safe-mode. strace of the process tree showed --bind /home /home — the whole directory, not --bind $HOME $HOME. Suggested fix in the issue text only: scope the home-related bind to $HOME.";

export const RULED_OUT = Object.freeze([
  "Airlock/#93862 sandbox socat race — readiness before first network call, not a /home bind",
  "Feoffee/#93863 preview_start getcwd EPERM / FDA inheritance — seisin miss, not home-bind overreach",
  "Tessera/#93776-family version-path TCC — privacy-pane rows, not a /home bind",
  "Cartouche/#93772 wrong-diagram-type section-poster — temple name-oval, not a manor bind",
  "Attaint/#93821 session-attainder cyber-safeguard — court-roll stain, not a /home bind",
  "Oriel/#93809 plan-window no-reflow — Gothic bay, not a manor commons",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not a home bind",
  "Trismus/#93823 UNUserNotification XPC lockjaw — macOS Desktop freeze, not bwrap /home",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a bind mount",
  "Crasis/#93960 non-injective store slug — memory drawer collision, not /home",
  "Mojibake/#93848 Windows CLAUDE.md U+FFFD — encoding spall, not a bind",
  "Scissel/#93915 Windows Bash argv truncation — mint scrap, not Linux bwrap",
  "Apograph/#93859 Desktop reopen-fork — transcript copy, not a sandbox bind",
  "Scotoma/#93744 command-args-blind — Stop evaluator, not a /home parent bind",
  "Homestead/#92932 unscoped $HOME rg hang — macOS TCC file-index, not bwrap --bind /home",
]);
export const EXPECTED = Object.freeze([
  "Scope the sandbox's home-related bind mount to the actual $HOME (e.g. --bind $HOME $HOME)",
  "Do not bind the entire /home parent directory wholesale",
  "Writes that resolve under the invoking user's home should succeed when $HOME is correct",
  "A path that lands on bare /home/.mcp.json should not be reachable via an overbroad /home bind",
  "Bind must not expose the root-owned /home commons as a writable manor",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "whole-home-bind",
    label: "whole /home bind",
    count: "--bind /home /home",
    note: "bwrap mount setup binds the entire /home directory instead of $HOME",
  },
  {
    id: "bare-home-write",
    label: "bare /home write",
    count: "/home/.mcp.json",
    note: "path resolution lands on bare /home/... outside the user's own home",
  },
  {
    id: "mcp-denied",
    label: "mcp denied",
    count: "Permission denied",
    note: "bwrap: Can't create file at /home/.mcp.json: Permission denied",
  },
  {
    id: "env-scrub",
    label: "env scrub",
    count: "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1",
    note: "observed under subprocess env scrub",
  },
  {
    id: "safe-mode",
    label: "safe mode",
    count: "--safe-mode",
    note: "observed with --safe-mode and Bash tool allowed",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "demesned-holding",
    survey:
      "private demesne scoped to $HOME; manor charter binds only the lord's own land",
    kind: "demesned",
    note: "idle: demesned — the hold/good path",
  },
  {
    id: "whole-home-bind",
    survey:
      "bwrap --bind /home /home overbinds the whole manor instead of $HOME",
    kind: "demesne",
    note: "seeded: whole-home-bind of the commons",
  },
  {
    id: "bare-home-write",
    survey:
      "write lands on /home/.mcp.json; /home is root:root 755; Permission denied",
    kind: "demesne",
    note: "seeded: bare-home-write on the commons",
  },
  {
    id: "home-bind-overreach",
    survey:
      "charter strap slams across the whole /home manor; private holding is lost in the commons",
    kind: "demesne",
    note: "path: home-bind-overreach names the overbound /home vs a demesned holding",
  },
  {
    id: "demesne",
    survey:
      "the manor is demesne — /home bound wholesale; $HOME correct yet /home/.mcp.json denied",
    kind: "demesne",
    note: "seeded: demesne — Score demesne or admit demesned.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "home-bind-overreach",
  "demesne",
  "whole-home-bind",
  "bare-home-write",
  "mcp-denied",
  "env-scrub",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91122,
    title: "read-only ~/.claude bind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — RO mount of config dir, not overbroad /home parent. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "attainder",
  "homestead",
]);

export const SAMPLE_KIND_IDLE = "home-scoped";
export const SAMPLE_KIND_SEEDED = "home-bind-overreach";
export const SAMPLE_HOLDING_IDLE = "private";
export const SAMPLE_HOLDING_SEEDED = "overbound";

export const SAMPLE_DEMESNED_PROOF = Object.freeze({
  demesned: true,
  demesne: false,
  homeBindOverreach: false,
  wholeHomeBind: false,
  bareHomeWrite: false,
  mcpDenied: false,
  rootOwnedCommons: false,
  envScrub: false,
  safeMode: false,
  overboundManor: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DEMESNE_PROOF = Object.freeze({
  demesned: false,
  demesne: true,
  homeBindOverreach: true,
  wholeHomeBind: true,
  bareHomeWrite: true,
  mcpDenied: true,
  rootOwnedCommons: true,
  envScrub: true,
  safeMode: true,
  overboundManor: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds demesned: bind scoped to $HOME; private holding stays the lord's own land" },
  { t: "whole-home-bind", line: "bwrap --bind /home /home overbinds the whole manor instead of $HOME" },
  { t: "bare-home-write", line: "write lands on /home/.mcp.json; Permission denied even though $HOME is /home/<user>" },
  { t: "path", line: "home-bind-overreach — charter strap slams across /home; private demesne is lost in the commons" },
  { t: "score", line: "when the sandbox binds the whole manor the booth is demesne — Score demesne or admit demesned." },
]);

/**
 * Scope map: private $HOME holding vs overbound /home manor.
 * Idle/demesned: bind scoped to $HOME.
 * Seeded/demesne: --bind /home /home overreaches the commons.
 */
export function mapScope(input = {}) {
  const demesne =
    input.demesne === true ||
    input.homeBindOverreach === true ||
    input.wholeHomeBind === true ||
    input.bareHomeWrite === true ||
    input.mcpDenied === true ||
    input.rootOwnedCommons === true ||
    input.envScrub === true ||
    input.safeMode === true ||
    input.overboundManor === true;
  const demesned = input.demesned === true && !demesne;
  return {
    stamp: demesne ? "home-bind-overreach" : "demesned-holding",
    holdingLane: demesne ? "overbound" : "private",
    kindLane: demesne ? "home-bind-overreach" : "home-scoped",
    bindLane: demesne ? "whole-home" : "user-home",
    ribbon: demesne ? "demesne" : "demesned",
    demesned,
  };
}

export function inspectHolding(input = {}) {
  const overbound =
    input.demesne === true ||
    input.homeBindOverreach === true ||
    input.wholeHomeBind === true;
  if (input.demesned === true && !overbound) {
    return {
      stamp: "holding-private",
      overbound: false,
    };
  }
  return {
    stamp: overbound ? "holding-overbound" : "holding-idle",
    overbound,
    note: overbound
      ? "charter strap slams across the whole /home manor"
      : "",
  };
}

export function inspectBind(input = {}) {
  const hit =
    input.homeBindOverreach === true ||
    input.wholeHomeBind === true ||
    input.overboundManor === true ||
    input.demesne === true;
  if (input.demesned === true && !hit) {
    return {
      stamp: "bind-home",
      target: "$HOME",
    };
  }
  return {
    stamp: hit ? "whole-home-bind" : "bind-idle",
    target: hit ? "/home" : "$HOME",
    note: hit
      ? "bwrap --bind /home /home instead of --bind $HOME $HOME"
      : "",
  };
}

export function inspectWrite(input = {}) {
  const denied =
    input.bareHomeWrite === true ||
    input.mcpDenied === true ||
    input.demesne === true;
  if (input.demesned === true && !denied) {
    return {
      stamp: "write-home",
      denied: false,
    };
  }
  return {
    stamp: denied ? "mcp-denied" : "write-idle",
    denied,
    note: denied
      ? "bwrap: Can't create file at /home/.mcp.json: Permission denied"
      : "",
  };
}

export function inspectCommons(input = {}) {
  const commons =
    input.rootOwnedCommons === true ||
    input.wholeHomeBind === true ||
    input.demesne === true;
  if (input.demesned === true && !commons) {
    return {
      stamp: "commons-unbound",
      rootOwned: false,
    };
  }
  return {
    stamp: commons ? "root-owned-commons" : "commons-idle",
    rootOwned: commons,
    note: commons
      ? "/home is typically root:root 755; bind does not change ownership"
      : "",
  };
}

export function inspectTrigger(input = {}) {
  const triggered =
    input.envScrub === true ||
    input.safeMode === true ||
    input.demesne === true;
  if (input.demesned === true && !triggered) {
    return {
      stamp: "trigger-idle",
      scrub: false,
    };
  }
  return {
    stamp: triggered ? "env-scrub" : "trigger-idle",
    scrub: triggered,
    note: triggered
      ? "observed under CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 and --safe-mode"
      : "",
  };
}

export function readBooth(input = {}) {
  const demesne =
    input.demesne === true ||
    input.homeBindOverreach === true ||
    input.wholeHomeBind === true ||
    input.bareHomeWrite === true ||
    input.mcpDenied === true ||
    input.rootOwnedCommons === true ||
    input.envScrub === true ||
    input.safeMode === true ||
    input.overboundManor === true;
  const demesned = input.demesned === true && !demesne;
  return {
    mark: demesne ? "demesne" : demesned || !demesne ? "demesned" : "demesne",
    demesned,
    demesne,
    homeBindOverreach: input.homeBindOverreach === true || demesne,
    wholeHomeBind: input.wholeHomeBind === true,
    bareHomeWrite: input.bareHomeWrite === true,
    mcpDenied: input.mcpDenied === true,
    rootOwnedCommons: input.rootOwnedCommons === true,
    envScrub: input.envScrub === true,
    safeMode: input.safeMode === true,
    overboundManor: input.overboundManor === true,
    scope: mapScope(input),
    holding: inspectHolding(input),
    bind: inspectBind(input),
    write: inspectWrite(input),
    commons: inspectCommons(input),
    trigger: inspectTrigger(input),
    log: input.log || [],
  };
}

export const DEMESNE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-demesned",
    demesned: true,
    demesne: false,
    cue: "demesned",
    note: "idle HOLD: bind scoped to $HOME — the hold/good path",
  },
  {
    t: "whole-home-bind",
    event: "whole-home-bind",
    demesne: true,
    wholeHomeBind: true,
    cue: "demesne",
    note: "bwrap --bind /home /home overbinds the whole manor",
  },
  {
    t: "bare-home-write",
    event: "bare-home-write",
    demesne: true,
    bareHomeWrite: true,
    mcpDenied: true,
    cue: "demesne",
    note: "write lands on /home/.mcp.json; Permission denied",
  },
  {
    t: "path",
    event: "home-bind-overreach",
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    envScrub: true,
    cue: "demesne",
    note: "home-bind-overreach — charter strap slams across /home",
  },
  {
    t: "score",
    event: "demesne",
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    bareHomeWrite: true,
    mcpDenied: true,
    rootOwnedCommons: true,
    envScrub: true,
    safeMode: true,
    overboundManor: true,
    cue: "demesne",
    note: "demesne — when the sandbox binds the whole manor the booth is demesne",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-demesned",
    demesned: true,
    demesne: false,
    cue: "demesned",
    note: "positive control: bind scoped to $HOME",
  },
  {
    t: "announce",
    event: "cue-demesned",
    demesned: true,
    cue: "demesned",
    note: "positive control: the holding stays demesned",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    demesned: true,
    demesne: false,
    homeBindOverreach: false,
    cue: "demesned",
  };
}

export function seedDemesned() {
  return { ...emptyTicket() };
}

export function seedDemesne() {
  return {
    seed: SEEDED_WORD,
    demesned: false,
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    bareHomeWrite: true,
    mcpDenied: true,
    rootOwnedCommons: true,
    envScrub: true,
    safeMode: true,
    overboundManor: true,
    cue: "demesne",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DEMESNE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    cue: "demesne",
  };
}

export function seedHomeBindOverreach() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    event: "home-bind-overreach",
    cue: "demesne",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    demesned: true,
    cue: "demesned",
  };
}

export function seedWholeHomeBind() {
  return {
    seed: "whole-home-bind",
    preferSeed: true,
    wholeHomeBind: true,
    cue: "demesne",
  };
}

export function seedBareHomeWrite() {
  return {
    seed: "bare-home-write",
    preferSeed: true,
    bareHomeWrite: true,
    cue: "demesne",
  };
}

export function seedMcpDenied() {
  return {
    seed: "mcp-denied",
    preferSeed: true,
    mcpDenied: true,
    cue: "demesne",
  };
}

export function seedRootOwnedCommons() {
  return {
    seed: "root-owned-commons",
    preferSeed: true,
    rootOwnedCommons: true,
    cue: "demesne",
  };
}

export function seedEnvScrub() {
  return {
    seed: "env-scrub",
    preferSeed: true,
    envScrub: true,
    cue: "demesne",
  };
}

export function seedSafeMode() {
  return {
    seed: "safe-mode",
    preferSeed: true,
    safeMode: true,
    cue: "demesne",
  };
}

export function seedOverboundManor() {
  return {
    seed: "overbound-manor",
    preferSeed: true,
    overboundManor: true,
    cue: "demesne",
  };
}

export function seedHomeScoped() {
  return {
    seed: "home-scoped",
    preferSeed: true,
    demesned: true,
    cue: "demesned",
  };
}

export function seedPrivateHolding() {
  return {
    seed: "private-holding",
    preferSeed: true,
    demesned: true,
    cue: "demesned",
  };
}

export function seedBindHome() {
  return {
    seed: "bind-home",
    preferSeed: true,
    demesned: true,
    cue: "demesned",
  };
}

export function seedUserHome() {
  return {
    seed: "user-home",
    preferSeed: true,
    demesned: true,
    cue: "demesned",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      demesned: false,
      demesne: false,
      homeBindOverreach: false,
      wholeHomeBind: false,
      bareHomeWrite: false,
      mcpDenied: false,
      rootOwnedCommons: false,
      envScrub: false,
      safeMode: false,
      overboundManor: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    demesned: raw.demesned === true,
    demesne: raw.demesne === true || raw.event === "demesne",
    homeBindOverreach:
      raw.homeBindOverreach === true || raw.event === "home-bind-overreach",
    wholeHomeBind:
      raw.wholeHomeBind === true || raw.event === "whole-home-bind",
    bareHomeWrite:
      raw.bareHomeWrite === true || raw.event === "bare-home-write",
    mcpDenied:
      raw.mcpDenied === true || raw.event === "mcp-denied",
    rootOwnedCommons:
      raw.rootOwnedCommons === true || raw.event === "root-owned-commons",
    envScrub:
      raw.envScrub === true || raw.event === "env-scrub",
    safeMode:
      raw.safeMode === true || raw.event === "safe-mode",
    overboundManor:
      raw.overboundManor === true || raw.event === "overbound-manor",
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
      (ticket.demesned != null ||
        ticket.demesne != null ||
        ticket.homeBindOverreach != null ||
        ticket.wholeHomeBind != null ||
        ticket.bareHomeWrite != null ||
        ticket.mcpDenied != null ||
        ticket.rootOwnedCommons != null ||
        ticket.envScrub != null ||
        ticket.safeMode != null ||
        ticket.overboundManor != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isDemesned(row) {
  if (row.demesne && row.cue !== "demesned") return false;
  if (row.cue === "demesne" || row.cue === "home-bind-overreach") {
    return false;
  }
  if (
    row.homeBindOverreach &&
    row.wholeHomeBind &&
    row.cue !== "demesned" &&
    row.demesned !== true
  ) {
    return false;
  }
  if (row.demesned === true && row.demesne !== true && row.cue !== "demesne") {
    return true;
  }
  if (
    row.cue === "demesned" &&
    row.demesne !== true &&
    row.homeBindOverreach !== true &&
    row.wholeHomeBind !== true &&
    row.bareHomeWrite !== true &&
    row.mcpDenied !== true &&
    row.rootOwnedCommons !== true &&
    row.envScrub !== true &&
    row.safeMode !== true &&
    row.overboundManor !== true
  ) {
    return true;
  }
  return false;
}

function isHomeBindOverreach(row) {
  return (
    row.event === "home-bind-overreach" &&
    !isDemesned(row) &&
    (row.homeBindOverreach === true ||
      row.wholeHomeBind === true ||
      row.envScrub === true)
  );
}

function isDemesneRow(row) {
  if (isDemesned(row)) return false;
  if (isHomeBindOverreach(row) && row.cue !== "demesne") return false;
  if (row.cue === "demesne") return true;
  if (row.demesne === true) return true;
  if (row.homeBindOverreach === true && row.wholeHomeBind === true) {
    return true;
  }
  if (
    row.homeBindOverreach === true ||
    row.wholeHomeBind === true ||
    row.bareHomeWrite === true ||
    row.mcpDenied === true ||
    row.rootOwnedCommons === true ||
    row.envScrub === true ||
    row.safeMode === true ||
    row.overboundManor === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one demesne pass against the manor charter.
 * demesned: bind scoped to $HOME.
 * demesne: overbound /home failure.
 * home-bind-overreach: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHomeBindOverreach(row) ||
    (row.homeBindOverreach && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "home-bind-overreach";
  } else if (isDemesneRow(row)) {
    verdict = "demesne";
  } else if (isDemesned(row)) {
    verdict = "demesned";
  } else if (
    row.homeBindOverreach ||
    row.wholeHomeBind ||
    row.bareHomeWrite ||
    row.mcpDenied ||
    row.rootOwnedCommons ||
    row.envScrub ||
    row.safeMode ||
    row.overboundManor
  ) {
    verdict = "demesne";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const holding = inspectHolding(row);
  const bind = inspectBind(row);
  const write = inspectWrite(row);
  const commons = inspectCommons(row);
  const trigger = inspectTrigger(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    demesned: verdict === "demesned" || verdict === "hold",
    demesne: verdict === "demesne" || verdict === SEEDED_WORD,
    homeBindOverreach:
      row.homeBindOverreach === true ||
      verdict === "home-bind-overreach" ||
      verdict === PATH_WORD,
    wholeHomeBind: row.wholeHomeBind,
    bareHomeWrite: row.bareHomeWrite,
    mcpDenied: row.mcpDenied,
    rootOwnedCommons: row.rootOwnedCommons,
    envScrub: row.envScrub,
    safeMode: row.safeMode,
    overboundManor: row.overboundManor,
    cue: hold
      ? "demesned"
      : row.homeBindOverreach || verdict === "home-bind-overreach"
        ? "home-bind-overreach"
        : "demesne",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit demesned" : "score demesne",
    holdingInspect: holding,
    bindInspect: bind,
    writeInspect: write,
    commonsInspect: commons,
    triggerInspect: trigger,
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
      : DEMESNE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "demesne");
  const path = scored.filter((row) => row.verdict === "home-bind-overreach");
  const demesned = scored.filter((row) => row.verdict === "demesned");
  const headline =
    scored.find((row) => row.event === "demesne") ||
    scored.find((row) => row.event === "home-bind-overreach") ||
    scored.find((row) => row.event === "whole-home-bind") ||
    dead[dead.length - 1];
  let verdict = "demesned";
  if (dead.length) verdict = "demesne";
  else if (path.length && !demesned.length) verdict = "home-bind-overreach";
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
    demesneCount: dead.length,
    pathCount: path.length,
    demesnedCount: demesned.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit demesned" : "score demesne",
    note: headline
      ? "bwrap Bash sandbox binds entire /home instead of $HOME, so bare /home/.mcp.json writes Permission denied. Cousin cite-only: #91122 RO ~/.claude bind — different mount."
      : "published demesne walk scored against demesned vs demesne",
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
    seeded !== "demesned" &&
    seeded !== "demesne" &&
    seeded !== "home-bind-overreach" &&
    ticket.demesned == null &&
    ticket.demesne == null &&
    ticket.homeBindOverreach == null &&
    ticket.wholeHomeBind == null &&
    ticket.bareHomeWrite == null &&
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
    demesned: scored.demesned ?? false,
    demesne: scored.demesne ?? false,
    homeBindOverreach: scored.homeBindOverreach ?? false,
    wholeHomeBind: scored.wholeHomeBind ?? false,
    bareHomeWrite: scored.bareHomeWrite ?? false,
    mcpDenied: scored.mcpDenied ?? false,
    rootOwnedCommons: scored.rootOwnedCommons ?? false,
    envScrub: scored.envScrub ?? false,
    safeMode: scored.safeMode ?? false,
    overboundManor: scored.overboundManor ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.wholeHomeBind || result.demesne ? "kind=home-bind-overreach" : "kind=home-scoped",
    result.bareHomeWrite || result.demesne ? "write=denied" : "write=home",
    result.homeBindOverreach || result.verdict === "home-bind-overreach"
      ? "path=home-bind-overreach"
      : "path=demesned",
    result.cue === "demesned"
      ? "cue=demesned"
      : result.cue === "home-bind-overreach"
        ? "cue=home-bind-overreach"
        : "cue=demesne",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    demesned: result.demesned,
    demesne: result.demesne,
    homeBindOverreach: result.homeBindOverreach,
    wholeHomeBind: result.wholeHomeBind,
    bareHomeWrite: result.bareHomeWrite,
    mcpDenied: result.mcpDenied,
    rootOwnedCommons: result.rootOwnedCommons,
    envScrub: result.envScrub,
    safeMode: result.safeMode,
    overboundManor: result.overboundManor,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    holding: inspectHolding({
      demesned: result.demesned,
      demesne: result.demesne,
      homeBindOverreach: result.homeBindOverreach,
      wholeHomeBind: result.wholeHomeBind,
    }),
    bind: inspectBind({
      demesned: result.demesned,
      demesne: result.demesne,
      homeBindOverreach: result.homeBindOverreach,
      wholeHomeBind: result.wholeHomeBind,
      overboundManor: result.overboundManor,
    }),
    write: inspectWrite({
      demesned: result.demesned,
      demesne: result.demesne,
      bareHomeWrite: result.bareHomeWrite,
      mcpDenied: result.mcpDenied,
    }),
    commons: inspectCommons({
      demesned: result.demesned,
      demesne: result.demesne,
      rootOwnedCommons: result.rootOwnedCommons,
      wholeHomeBind: result.wholeHomeBind,
    }),
    trigger: inspectTrigger({
      demesned: result.demesned,
      demesne: result.demesne,
      envScrub: result.envScrub,
      safeMode: result.safeMode,
    }),
    scope: mapScope({
      demesned: result.demesned,
      demesne: result.demesne,
      homeBindOverreach: result.homeBindOverreach,
      wholeHomeBind: result.wholeHomeBind,
      bareHomeWrite: result.bareHomeWrite,
      mcpDenied: result.mcpDenied,
      rootOwnedCommons: result.rootOwnedCommons,
      envScrub: result.envScrub,
      safeMode: result.safeMode,
      overboundManor: result.overboundManor,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      demesne:
        result.demesne === true ||
        result.verdict === "demesne",
    })),
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: mount setup uses --bind /home /home instead of --bind $HOME $HOME. Invite verify against #93989 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
