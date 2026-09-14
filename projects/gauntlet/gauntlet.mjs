#!/usr/bin/env node
/**
 * Gauntlet — medieval tournament gauntlet / iron glove / riveted
 * cuff / tilting-yard / mail sleeve / bare-hand vs armored fist /
 * PRIMARY paste as open-hand offering.
 *
 * Educational diagnostic model for a published Claude Code TUI
 * defect: attached background sessions (`claude attach <id>`) enable
 * xterm mouse reporting unconditionally (ESC[?1000h/1002h/1003h/1006h),
 * ignoring CLAUDE_CODE_DISABLE_MOUSE and
 * CLAUDE_CODE_DISABLE_MOUSE_CLICKS. A directly-launched `claude` in
 * the same terminal, same shell, same version honors
 * CLAUDE_CODE_DISABLE_MOUSE=1 (zero enables). Practical effect on
 * Linux: middle-click PRIMARY-selection paste is swallowed while
 * attached; Shift+middle-click is the only workaround. Same root
 * cause named when #73443 closed (2026-08-17) — either that fix
 * regressed or never covered `claude attach`. Docs carve out tui /
 * CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached sessions but
 * state no such exception for mouse opt-outs. Version 2.1.270.
 * Terminal modes ARE restored on exit (not a stale-state bug).
 * Not #73320 (different mechanism).
 *
 * Encoded from anthropics/claude-code#94029 issue text only.
 * Hypothesis (NON-BINDING): the attach entry point enables mouse
 * reporting without consulting the documented mouse opt-outs; the
 * direct-launch path honors them. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits. No
 * live Claude.
 *
 *   node gauntlet.mjs data/gauntlet.json
 *   echo '{"seed":"gauntlet"}' | node gauntlet.mjs
 *
 * Idle word is ungloved (HOLD: bare-handed / opted-out / native-select
 * / paste-open / released).
 * HOLD aliases: barehanded, opted, native, released, openhand.
 * Seeded word is gauntlet (#94029 — the attach-mouse path).
 * Path word is attach-mouse.
 * Product score word is gauntlet (Score gauntlet or admit ungloved.).
 *
 * NOT Lictor. NOT Lychgate/#94059. NOT Ouster/#94221.
 * NOT Proscription/#94202. NOT Thimblerig/#94174. NOT Fetchling/#94065.
 * NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040.
 * NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #73443 — closed; footer nav re-enabled mouse; related mouse
 *   opt-out history. Same stated root cause.
 * #73320 — open; DO_NOT_TRACK silently disables mouse clicks;
 *   different mechanism. Direct-launch with DISABLE_MOUSE=1 is
 *   the working control.
 * Gauntlet is specifically attach ignoring DISABLE_MOUSE /
 * DISABLE_MOUSE_CLICKS (Run E / Run G emitted; Run D not emitted).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "ungloved",
  "gauntlet",
  "attach-mouse",
  "hold",
  "barehanded",
  "opted",
  "native",
  "released",
  "openhand",
  "direct-honor",
  "attach-ignore",
  "mouse-1000",
  "mouse-1002",
  "mouse-1003",
  "mouse-1006",
  "primary-paste",
  "disable-mouse",
  "disable-clicks",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "ungloved";
export const PATH_WORD = "attach-mouse";
export const SEEDED_WORD = "gauntlet";
export const PRODUCT_WORD = "gauntlet";
export const HOLD = Object.freeze(["ungloved", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "barehanded",
  "opted",
  "native",
  "released",
  "openhand",
]);
export const RECOVER = Object.freeze(["ungloved", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "vested",
  "plenary",
  "equalized",
  "legible",
  "calibrated",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "sighted",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "picker-bypass",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "picker-bypass",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
]);

export const FEATURED_ISSUE = 94029;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94029";
export const TITLE =
  "claude attach ignores CLAUDE_CODE_DISABLE_MOUSE and CLAUDE_CODE_DISABLE_MOUSE_CLICKS — mouse capture always on in attached background sessions";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tui",
  "regression",
  "area:agent-view",
]);
export const PLATFORM = "linux";
export const SURFACE = "attach-mouse";
export const HOST =
  "Claude Code 2.1.270 Linux; attach vs direct; CLAUDE_CODE_DISABLE_MOUSE";
export const CHECKED_ON =
  "Claude Code 2.1.270, Ubuntu/Debian Linux, same terminal/shell/version.";
export const BUILD = "Claude Code 2.1.270 (Linux)";
export const SELECTED_MODEL = "Not sure / Multiple models";
export const OS = "Ubuntu/Debian Linux";
export const PHRASE = "Score gauntlet or admit ungloved.";
export const DISTRIBUTION =
  "Attached background sessions (`claude attach <id>`) enable xterm mouse reporting unconditionally (ESC[?1000h/1002h/1003h/1006h), ignoring both documented opt-outs. A directly-launched `claude` in the same terminal/shell/version honors CLAUDE_CODE_DISABLE_MOUSE=1 correctly (zero enables). Practical effect on Linux: middle-click PRIMARY-selection paste is swallowed while attached; Shift+middle-click is the only workaround. Same root cause named when #73443 closed (2026-08-17) — either that fix regressed or never covered `claude attach`. Docs carve out tui/CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached sessions but state NO such exception for mouse opt-outs. Version 2.1.270. Terminal modes ARE restored on exit (not a stale-state bug). Not #73320 (different). Evidence table: Run D (direct + DISABLE_MOUSE) = correct not emitted; Run E (attach + DISABLE_MOUSE) = BUG emitted; Run G (attach + DISABLE_MOUSE_CLICKS) = BUG emitted. Run C (direct, no env) and Run F (attach, no env) emit capture-on as expected.";

export const RULED_OUT = Object.freeze([
  "Lictor — different fasces-aisle paradigm; do not rebuild",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden / false-guilt",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre — bash-nul-poison; different vault",
  "#73320 — DO_NOT_TRACK silently disables mouse clicks; different mechanism; cite-only cousin",
  "#91142 — attach enables no mouse modes on Windows; inverse symptom, same code path; not this booth",
  "Stale terminal modes — modes ARE restored on exit; middle-click paste works again immediately",
]);
export const EXPECTED = Object.freeze([
  "CLAUDE_CODE_DISABLE_MOUSE=1 should suppress mouse capture in attached sessions as it does in directly-launched ones",
  "Docs: set CLAUDE_CODE_DISABLE_MOUSE=1 to opt out of mouse capture so the terminal handles selection natively",
  "Docs carve out tui and CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached background sessions — no such exception for mouse opt-outs",
  "CLAUDE_CODE_DISABLE_MOUSE_CLICKS=1 should also be honored on attach",
  "Direct-launch with DISABLE_MOUSE=1 is the working control (Run D: not emitted)",
  "Whatever lands should enable mouse reporting on attach AND honor both opt-outs",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "direct-honor",
    label: "direct honor",
    count: "Run D not emitted",
    note: "Direct-launch claude + DISABLE_MOUSE=1: zero mouse enables — correct",
  },
  {
    id: "attach-ignore",
    label: "attach ignore",
    count: "Run E / Run G emitted",
    note: "claude attach + DISABLE_MOUSE or DISABLE_MOUSE_CLICKS still emits all four modes",
  },
  {
    id: "mouse-1000",
    label: "ESC[?1000h",
    count: "xterm mouse tracking",
    note: "Attached session enables DEC private mode 1000",
  },
  {
    id: "mouse-1002",
    label: "ESC[?1002h",
    count: "button-event tracking",
    note: "Attached session enables DEC private mode 1002",
  },
  {
    id: "mouse-1003",
    label: "ESC[?1003h",
    count: "any-event tracking",
    note: "Attached session enables DEC private mode 1003",
  },
  {
    id: "mouse-1006",
    label: "ESC[?1006h",
    count: "SGR mouse",
    note: "Attached session enables DEC private mode 1006",
  },
]);

export const LISTS_NAMES = Object.freeze([
  {
    id: "direct-honor",
    lost: "Direct-launch honors DISABLE_MOUSE=1 (Run D: not emitted)",
    control: "Bare hands on the lists — terminal handles selection natively",
    story: "the tilter steps onto the yard ungloved as ordered",
  },
  {
    id: "attach-ignore",
    lost: "Attach ignores DISABLE_MOUSE=1 and DISABLE_MOUSE_CLICKS=1 (Run E / Run G: emitted)",
    control: "Attach consults the same opt-outs as direct launch",
    story: "the marshal forces the iron glove on after attach",
  },
  {
    id: "mouse-1000",
    lost: "ESC[?1000h emitted on attach",
    control: "No 1000h when DISABLE_MOUSE=1",
    story: "the first rivet is driven into the cuff",
  },
  {
    id: "mouse-1002",
    lost: "ESC[?1002h emitted on attach",
    control: "No 1002h when DISABLE_MOUSE=1",
    story: "the second rivet closes the wrist",
  },
  {
    id: "mouse-1003",
    lost: "ESC[?1003h emitted on attach",
    control: "No 1003h when DISABLE_MOUSE=1",
    story: "the third rivet locks the mail sleeve",
  },
  {
    id: "attach-mouse",
    lost: "Attach path forces mouse capture; PRIMARY paste swallowed",
    control: "DISABLE_MOUSE=1 on attach leaves the hand open",
    story: "gauntlet — the attach path gloves the fist even when the user ordered bare hands",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "tilting-yard",
    survey:
      "tournament lists; sand; barriers; the tilter may ride ungloved when ordered",
    kind: "ungloved",
    note: "idle: ungloved — the hold/good path",
  },
  {
    id: "iron-glove",
    survey:
      "iron gauntlet forced on; attach ignores the opt-out; armored fist",
    kind: "gauntlet",
    note: "seeded: iron glove on after attach",
  },
  {
    id: "riveted-cuff",
    survey:
      "riveted cuff — Run E and Run G still emit all four mouse modes",
    kind: "gauntlet",
    note: "seeded: cuff riveted despite DISABLE_MOUSE / DISABLE_MOUSE_CLICKS",
  },
  {
    id: "mail-sleeve",
    survey:
      "mail sleeve of 1000h / 1002h / 1003h / 1006h — capture always on",
    kind: "gauntlet",
    note: "seeded: four DEC private modes enabled on attach",
  },
  {
    id: "open-hand",
    survey:
      "PRIMARY paste as open-hand offering — middle-click swallowed while attached",
    kind: "gauntlet",
    note: "seeded: open-hand paste refused; Shift+middle-click only workaround",
  },
  {
    id: "attach-path",
    survey:
      "attach-mouse — attach entry point gloves the fist; direct launch honors bare hands",
    kind: "gauntlet",
    note: "path: attach-mouse names the ignored opt-out",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "attach-mouse",
  "gauntlet",
  "attach-ignore",
  "mouse-1000",
  "mouse-1002",
  "mouse-1003",
  "mouse-1006",
  "primary-paste",
  "disable-mouse",
  "disable-clicks",
]);

export const COUSINS = Object.freeze([
  {
    issue: 73443,
    title:
      "footer nav re-enabled mouse; background/attached sessions ignored CLAUDE_CODE_DISABLE_MOUSE / CLAUDE_CODE_DISABLE_MOUSE_CLICKS",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — closed 2026-08-17. Same stated root cause (attached sessions ignored mouse opt-outs). Related mouse opt-out history. Either that fix regressed or never covered claude attach. Do not rebuild. Do not conflate.",
  },
  {
    issue: 73320,
    title:
      "DO_NOT_TRACK silently disables mouse clicks",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — DO_NOT_TRACK silently disables mouse clicks. Different mechanism. Direct-launch with DISABLE_MOUSE=1 is the working control. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151 Shift+PageUp/PageDown Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064 desktop full-disk find TCC prompts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94251, title: "backup #94251", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94256, title: "backup #94256", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
]);

export const SAMPLE_KIND_IDLE = "barehanded";
export const SAMPLE_KIND_SEEDED = "attach-mouse";
export const SAMPLE_HOLDING_IDLE = "released";
export const SAMPLE_HOLDING_SEEDED = "attach-ignore";

export const SAMPLE_UNGLOVED_PROOF = Object.freeze({
  ungloved: true,
  gauntlet: false,
  attachMouse: false,
  attachIgnore: false,
  mouse1000: false,
  mouse1002: false,
  mouse1003: false,
  mouse1006: false,
  primaryPaste: false,
  disableMouse: false,
  disableClicks: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_GAUNTLET_PROOF = Object.freeze({
  ungloved: false,
  gauntlet: true,
  attachMouse: true,
  attachIgnore: true,
  mouse1000: true,
  mouse1002: true,
  mouse1003: true,
  mouse1006: true,
  primaryPaste: true,
  disableMouse: true,
  disableClicks: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LISTS_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds ungloved: DISABLE_MOUSE=1 honored on direct launch; zero enables; paste-open" },
  { t: "attach", line: "claude attach <id> with DISABLE_MOUSE=1 still enables mouse reporting" },
  { t: "modes", line: "ESC[?1000h/1002h/1003h/1006h emitted — Run E BUG; Run G BUG" },
  { t: "path", line: "attach-mouse — PRIMARY paste swallowed; Shift+middle-click only workaround" },
  { t: "score", line: "when attach gloves the fist after the user ordered bare hands the booth is gauntlet — Score gauntlet or admit ungloved." },
]);

const FORCE_FLAGS = [
  "attachMouse",
  "attachIgnore",
  "mouse1000",
  "mouse1002",
  "mouse1003",
  "mouse1006",
  "primaryPaste",
  "disableMouse",
  "disableClicks",
];

/**
 * Lists map: ungloved yard vs forced gauntlet.
 * Idle/ungloved: DISABLE_MOUSE honored; zero enables; paste-open.
 * Seeded/gauntlet: attach ignores opt-outs; mouse capture forced on.
 */
export function mapLists(input = {}) {
  const gauntlet = isGauntletInput(input);
  const ungloved = input.ungloved === true && !gauntlet;
  return {
    stamp: gauntlet ? "attach-mouse" : "ungloved-yard",
    holdingLane: gauntlet ? "attach-ignore" : "released",
    kindLane: gauntlet ? "attach-mouse" : "barehanded",
    bindLane: gauntlet ? "mouse-1000" : "opted",
    ribbon: gauntlet ? "gauntlet" : "ungloved",
    ungloved,
  };
}

export function inspectYard(input = {}) {
  const gloved = isGauntletInput(input);
  if (input.ungloved === true && !gloved) {
    return {
      stamp: "yard-ungloved",
      gloved: false,
      note: "tilting-yard admits bare hands; the opt-out was honored",
    };
  }
  return {
    stamp: gloved ? "yard-gloved" : "yard-idle",
    gloved,
    note: gloved
      ? "tilting-yard forces the iron glove on after attach"
      : "",
  };
}

export function inspectGlove(input = {}) {
  const iron =
    input.gauntlet === true ||
    input.attachIgnore === true ||
    isGauntletInput(input);
  if (input.ungloved === true && !iron) {
    return {
      stamp: "glove-off",
      iron: false,
    };
  }
  return {
    stamp: iron ? "glove-on" : "glove-idle",
    iron,
    note: iron
      ? "iron gauntlet forced on — attach ignored the ordered bare hands"
      : "",
  };
}

export function inspectCuff(input = {}) {
  const riveted = isGauntletInput(input);
  if (input.ungloved === true && !riveted) {
    return {
      stamp: "cuff-open",
      riveted: false,
      edge: "released",
    };
  }
  return {
    stamp: riveted ? "cuff-riveted" : "cuff-idle",
    riveted,
    edge: riveted ? "attach-ignore" : "released",
    note: riveted
      ? "riveted cuff — Run E and Run G still emit 1000h/1002h/1003h/1006h"
      : "",
  };
}

export function inspectMail(input = {}) {
  const sleeved =
    input.mouse1000 === true ||
    input.mouse1002 === true ||
    input.mouse1003 === true ||
    input.mouse1006 === true ||
    input.gauntlet === true ||
    isGauntletInput(input);
  if (input.ungloved === true && !sleeved) {
    return {
      stamp: "mail-off",
      sleeved: false,
    };
  }
  return {
    stamp: sleeved ? "mail-on" : "mail-idle",
    sleeved,
    note: sleeved
      ? "mail sleeve of four mouse modes — capture always on in attach"
      : "",
  };
}

export function inspectPaste(input = {}) {
  const swallowed =
    input.primaryPaste === true ||
    (input.gauntlet === true && input.primaryPaste !== false);
  if (input.ungloved === true && !swallowed) {
    return {
      stamp: "paste-open",
      swallowed: false,
    };
  }
  if (input.primaryPaste === true) {
    return {
      stamp: "paste-swallowed",
      swallowed: true,
      note: "PRIMARY paste as open-hand offering — middle-click swallowed while attached",
    };
  }
  return {
    stamp: swallowed && isGauntletInput(input) ? "paste-listed" : "paste-idle",
    swallowed: false,
    note: "",
  };
}

export function inspectPath(input = {}) {
  const gloved =
    input.attachMouse === true ||
    input.gauntlet === true ||
    isGauntletInput(input);
  if (input.ungloved === true && !gloved) {
    return {
      stamp: "path-ungloved",
      gloved: false,
    };
  }
  return {
    stamp: gloved ? "path-gloved" : "path-idle",
    gloved,
    note: gloved
      ? "attach-mouse — attach entry point gloves the fist; direct launch honors bare hands"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "direct-honor": input.directHonor,
    "attach-ignore": input.attachIgnore,
    "mouse-1000": input.mouse1000,
    "mouse-1002": input.mouse1002,
    "mouse-1003": input.mouse1003,
    "attach-mouse": input.attachMouse,
  };
  return (
    map[id] === true ||
    input.attachMouse === true ||
    input.gauntlet === true
  );
}

function isGauntletInput(input = {}) {
  return (
    input.gauntlet === true ||
    input.attachMouse === true ||
    input.attachIgnore === true ||
    input.mouse1000 === true ||
    input.mouse1002 === true ||
    input.mouse1003 === true ||
    input.mouse1006 === true ||
    input.primaryPaste === true ||
    input.disableMouse === true ||
    input.disableClicks === true
  );
}

export function readBooth(input = {}) {
  const gauntlet = isGauntletInput(input);
  const ungloved = input.ungloved === true && !gauntlet;
  return {
    mark: gauntlet ? "gauntlet" : "ungloved",
    ungloved,
    gauntlet,
    attachMouse: input.attachMouse === true || gauntlet,
    attachIgnore: input.attachIgnore === true,
    mouse1000: input.mouse1000 === true,
    mouse1002: input.mouse1002 === true,
    mouse1003: input.mouse1003 === true,
    mouse1006: input.mouse1006 === true,
    primaryPaste: input.primaryPaste === true,
    disableMouse: input.disableMouse === true,
    disableClicks: input.disableClicks === true,
    scope: mapLists(input),
    yard: inspectYard(input),
    glove: inspectGlove(input),
    cuff: inspectCuff(input),
    mail: inspectMail(input),
    paste: inspectPaste(input),
    path: inspectPath(input),
    names: LISTS_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const GAUNTLET_WALK = Object.freeze([
  {
    t: "idle",
    event: "lists-ungloved",
    ungloved: true,
    gauntlet: false,
    cue: "ungloved",
    note: "idle HOLD: DISABLE_MOUSE=1 honored on direct launch; zero enables — the hold/good path",
  },
  {
    t: "attach",
    event: "attach-ignore",
    gauntlet: true,
    attachIgnore: true,
    disableMouse: true,
    cue: "gauntlet",
    note: "claude attach <id> with DISABLE_MOUSE=1 still enables mouse reporting",
  },
  {
    t: "modes",
    event: "mouse-1000",
    gauntlet: true,
    attachIgnore: true,
    mouse1000: true,
    mouse1002: true,
    mouse1003: true,
    mouse1006: true,
    cue: "gauntlet",
    note: "ESC[?1000h/1002h/1003h/1006h emitted — Run E BUG; Run G BUG",
  },
  {
    t: "path",
    event: "attach-mouse",
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
    primaryPaste: true,
    cue: "gauntlet",
    note: "attach-mouse — PRIMARY paste swallowed; Shift+middle-click only workaround",
  },
  {
    t: "score",
    event: "gauntlet",
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
    mouse1000: true,
    mouse1002: true,
    mouse1003: true,
    mouse1006: true,
    primaryPaste: true,
    disableMouse: true,
    disableClicks: true,
    cue: "gauntlet",
    note: "gauntlet — attach gloves the fist after the user ordered bare hands",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "lists-ungloved",
    ungloved: true,
    gauntlet: false,
    cue: "ungloved",
    note: "positive control: DISABLE_MOUSE=1 honored; zero enables; the yard is ungloved",
  },
  {
    t: "admit",
    event: "lists-ungloved",
    ungloved: true,
    cue: "ungloved",
    note: "positive control: the lists admit ungloved",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    ungloved: true,
    gauntlet: false,
    attachMouse: false,
    cue: "ungloved",
  };
}

export function seedUngloved() {
  return { ...emptyTicket() };
}

export function seedGauntlet() {
  return {
    seed: SEEDED_WORD,
    ungloved: false,
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
    mouse1000: true,
    mouse1002: true,
    mouse1003: true,
    mouse1006: true,
    primaryPaste: true,
    disableMouse: true,
    disableClicks: true,
    cue: "gauntlet",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_GAUNTLET_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
    cue: "gauntlet",
  };
}

export function seedAttachMouse() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    gauntlet: true,
    attachMouse: true,
    event: "attach-mouse",
    cue: "gauntlet",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedBarehanded() {
  return {
    seed: "barehanded",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedOpted() {
  return {
    seed: "opted",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedNative() {
  return {
    seed: "native",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedReleased() {
  return {
    seed: "released",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedOpenhand() {
  return {
    seed: "openhand",
    preferSeed: true,
    ungloved: true,
    cue: "ungloved",
  };
}

export function seedDirectHonor() {
  return {
    seed: "direct-honor",
    preferSeed: true,
    cue: "gauntlet",
  };
}

export function seedAttachIgnore() {
  return {
    seed: "attach-ignore",
    preferSeed: true,
    attachIgnore: true,
    cue: "gauntlet",
  };
}

export function seedMouse1000() {
  return {
    seed: "mouse-1000",
    preferSeed: true,
    mouse1000: true,
    cue: "gauntlet",
  };
}

export function seedMouse1002() {
  return {
    seed: "mouse-1002",
    preferSeed: true,
    mouse1002: true,
    cue: "gauntlet",
  };
}

export function seedMouse1003() {
  return {
    seed: "mouse-1003",
    preferSeed: true,
    mouse1003: true,
    cue: "gauntlet",
  };
}

export function seedMouse1006() {
  return {
    seed: "mouse-1006",
    preferSeed: true,
    mouse1006: true,
    cue: "gauntlet",
  };
}

export function seedPrimaryPaste() {
  return {
    seed: "primary-paste",
    preferSeed: true,
    primaryPaste: true,
    cue: "gauntlet",
  };
}

export function seedDisableMouse() {
  return {
    seed: "disable-mouse",
    preferSeed: true,
    disableMouse: true,
    cue: "gauntlet",
  };
}

export function seedDisableClicks() {
  return {
    seed: "disable-clicks",
    preferSeed: true,
    disableClicks: true,
    cue: "gauntlet",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      ungloved: false,
      gauntlet: false,
      attachMouse: false,
      attachIgnore: false,
      mouse1000: false,
      mouse1002: false,
      mouse1003: false,
      mouse1006: false,
      primaryPaste: false,
      disableMouse: false,
      disableClicks: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    ungloved: raw.ungloved === true,
    gauntlet: raw.gauntlet === true || raw.event === "gauntlet",
    attachMouse:
      raw.attachMouse === true || raw.event === "attach-mouse",
    attachIgnore:
      raw.attachIgnore === true || raw.event === "attach-ignore",
    mouse1000: raw.mouse1000 === true || raw.event === "mouse-1000",
    mouse1002: raw.mouse1002 === true || raw.event === "mouse-1002",
    mouse1003: raw.mouse1003 === true || raw.event === "mouse-1003",
    mouse1006: raw.mouse1006 === true || raw.event === "mouse-1006",
    primaryPaste:
      raw.primaryPaste === true || raw.event === "primary-paste",
    disableMouse:
      raw.disableMouse === true || raw.event === "disable-mouse",
    disableClicks:
      raw.disableClicks === true || raw.event === "disable-clicks",
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
      (ticket.ungloved != null ||
        ticket.gauntlet != null ||
        ticket.attachMouse != null ||
        ticket.attachIgnore != null ||
        ticket.mouse1000 != null ||
        ticket.mouse1002 != null ||
        ticket.mouse1003 != null ||
        ticket.mouse1006 != null ||
        ticket.primaryPaste != null ||
        ticket.disableMouse != null ||
        ticket.disableClicks != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isUngloved(row) {
  if (row.gauntlet && row.cue !== "ungloved") return false;
  if (row.cue === "gauntlet" || row.cue === "attach-mouse") {
    return false;
  }
  if (
    row.attachMouse &&
    row.attachIgnore &&
    row.cue !== "ungloved" &&
    row.ungloved !== true
  ) {
    return false;
  }
  if (
    row.ungloved === true &&
    row.gauntlet !== true &&
    row.cue !== "gauntlet"
  ) {
    return true;
  }
  if (
    row.cue === "ungloved" &&
    row.gauntlet !== true &&
    row.attachMouse !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isAttachMouse(row) {
  return (
    row.event === "attach-mouse" &&
    !isUngloved(row) &&
    (row.attachMouse === true ||
      row.attachIgnore === true ||
      row.gauntlet === true)
  );
}

function isGauntletRow(row) {
  if (isUngloved(row)) return false;
  if (isAttachMouse(row) && row.cue !== "gauntlet") return false;
  if (row.cue === "gauntlet") return true;
  if (row.gauntlet === true) return true;
  if (row.attachMouse === true && row.attachIgnore === true) {
    return true;
  }
  if (
    row.attachMouse === true ||
    row.attachIgnore === true ||
    row.mouse1000 === true ||
    row.mouse1002 === true ||
    row.mouse1003 === true ||
    row.mouse1006 === true ||
    row.primaryPaste === true ||
    row.disableMouse === true ||
    row.disableClicks === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one gauntlet pass against the tilting-yard lists.
 * ungloved: DISABLE_MOUSE honored; zero enables; paste-open.
 * gauntlet: attach ignores opt-outs; mouse capture forced on.
 * attach-mouse: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isAttachMouse(row) ||
    (row.attachMouse &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "attach-mouse";
  } else if (isGauntletRow(row)) {
    verdict = "gauntlet";
  } else if (isUngloved(row)) {
    verdict = "ungloved";
  } else if (
    row.attachMouse ||
    row.attachIgnore ||
    row.mouse1000 ||
    row.mouse1002 ||
    row.mouse1003 ||
    row.mouse1006 ||
    row.primaryPaste ||
    row.disableMouse ||
    row.disableClicks
  ) {
    verdict = "gauntlet";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const yard = inspectYard(row);
  const glove = inspectGlove(row);
  const cuff = inspectCuff(row);
  const mail = inspectMail(row);
  const paste = inspectPaste(row);
  const path = inspectPath(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    ungloved: verdict === "ungloved" || verdict === "hold",
    gauntlet: verdict === "gauntlet" || verdict === SEEDED_WORD,
    attachMouse:
      row.attachMouse === true ||
      verdict === "attach-mouse" ||
      verdict === PATH_WORD,
    attachIgnore: row.attachIgnore,
    mouse1000: row.mouse1000,
    mouse1002: row.mouse1002,
    mouse1003: row.mouse1003,
    mouse1006: row.mouse1006,
    primaryPaste: row.primaryPaste,
    disableMouse: row.disableMouse,
    disableClicks: row.disableClicks,
    cue: hold
      ? "ungloved"
      : row.attachMouse || verdict === "attach-mouse"
        ? "attach-mouse"
        : "gauntlet",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit ungloved" : "score gauntlet",
    yardInspect: yard,
    gloveInspect: glove,
    cuffInspect: cuff,
    mailInspect: mail,
    pasteInspect: paste,
    pathInspect: path,
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
      : GAUNTLET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "gauntlet");
  const path = scored.filter((row) => row.verdict === "attach-mouse");
  const ungloved = scored.filter((row) => row.verdict === "ungloved");
  const headline =
    scored.find((row) => row.event === "gauntlet") ||
    scored.find((row) => row.event === "attach-mouse") ||
    scored.find((row) => row.event === "attach-ignore") ||
    charged[charged.length - 1];
  let verdict = "ungloved";
  if (charged.length) verdict = "gauntlet";
  else if (path.length && !ungloved.length) {
    verdict = "attach-mouse";
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
    gauntletCount: charged.length,
    pathCount: path.length,
    unglovedCount: ungloved.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit ungloved" : "score gauntlet",
    note: headline
      ? "Attach ignores DISABLE_MOUSE / DISABLE_MOUSE_CLICKS. Cousins cite-only: #73443 #73320 — do not rebuild, do not conflate."
      : "published gauntlet walk scored against ungloved vs gauntlet",
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
    seeded !== "ungloved" &&
    seeded !== "gauntlet" &&
    seeded !== "attach-mouse" &&
    ticket.ungloved == null &&
    ticket.gauntlet == null &&
    ticket.attachMouse == null &&
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
    ungloved: scored.ungloved ?? false,
    gauntlet: scored.gauntlet ?? false,
    attachMouse: scored.attachMouse ?? false,
    attachIgnore: scored.attachIgnore ?? false,
    mouse1000: scored.mouse1000 ?? false,
    mouse1002: scored.mouse1002 ?? false,
    mouse1003: scored.mouse1003 ?? false,
    mouse1006: scored.mouse1006 ?? false,
    primaryPaste: scored.primaryPaste ?? false,
    disableMouse: scored.disableMouse ?? false,
    disableClicks: scored.disableClicks ?? false,
  };
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.attachIgnore || result.gauntlet
      ? "kind=attach-mouse"
      : "kind=barehanded",
    result.mouse1000 || result.gauntlet ? "ref=attach-ignore" : "ref=released",
    result.attachMouse || result.verdict === "attach-mouse"
      ? "path=attach-mouse"
      : "path=ungloved",
    result.cue === "ungloved"
      ? "cue=ungloved"
      : result.cue === "attach-mouse"
        ? "cue=attach-mouse"
        : "cue=gauntlet",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    ungloved: result.ungloved,
    gauntlet: result.gauntlet,
    attachMouse: result.attachMouse,
    attachIgnore: result.attachIgnore,
    mouse1000: result.mouse1000,
    mouse1002: result.mouse1002,
    mouse1003: result.mouse1003,
    mouse1006: result.mouse1006,
    primaryPaste: result.primaryPaste,
    disableMouse: result.disableMouse,
    disableClicks: result.disableClicks,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    yard: inspectYard({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      attachMouse: result.attachMouse,
    }),
    glove: inspectGlove({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      attachMouse: result.attachMouse,
      attachIgnore: result.attachIgnore,
    }),
    cuff: inspectCuff({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      attachMouse: result.attachMouse,
    }),
    mail: inspectMail({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      mouse1000: result.mouse1000,
      mouse1002: result.mouse1002,
      mouse1003: result.mouse1003,
      mouse1006: result.mouse1006,
    }),
    paste: inspectPaste({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      primaryPaste: result.primaryPaste,
    }),
    path: inspectPath({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      attachMouse: result.attachMouse,
    }),
    scope: mapLists({
      ungloved: result.ungloved,
      gauntlet: result.gauntlet,
      attachMouse: result.attachMouse,
      attachIgnore: result.attachIgnore,
      mouse1000: result.mouse1000,
      mouse1002: result.mouse1002,
      mouse1003: result.mouse1003,
      mouse1006: result.mouse1006,
      primaryPaste: result.primaryPaste,
      disableMouse: result.disableMouse,
      disableClicks: result.disableClicks,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      gauntlet: result.gauntlet === true || result.verdict === "gauntlet",
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
      names: LISTS_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the attach entry point enables mouse reporting without consulting CLAUDE_CODE_DISABLE_MOUSE / CLAUDE_CODE_DISABLE_MOUSE_CLICKS; the direct-launch path honors them (Run D not emitted; Run E / Run G emitted). Either the #73443 fix regressed or never covered claude attach. Invite verify against #94029 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
