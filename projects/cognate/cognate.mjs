#!/usr/bin/env node
/**
 * Cognate — comparative philology / manuscript cognate-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * plugin MCP config should keep ${PLUGIN_ROOT} expanded (spec-standard
 * alias expands like ${CLAUDE_PLUGIN_ROOT}; args/env/cwd resolve to the
 * install path; session starts connected). Instead the host only matches
 * the Claude-prefixed dialect, leaves the standard cognate literal, and
 * the MCP child gets ${PLUGIN_ROOT}/dist/index.js verbatim →
 * MODULE_NOT_FOUND / CONNECTION_CLOSED.
 *
 *   node cognate.mjs data/cognate.json
 *   echo '{"seed":"cognate"}' | node cognate.mjs
 *
 * Idle word is expanded (HOLD: spec + Claude aliases both expand).
 * Seeded word is cognate (#93250: spec-standard ${PLUGIN_ROOT} left literal).
 * Path word is literal (unexpanded placeholder string on the wire).
 *
 * Encoded from anthropics/claude-code#93250 issue body only.
 * Hypothesis (NON-BINDING): the placeholder expander allowlists only
 * CLAUDE_* forms, so spec-standard ${PLUGIN_ROOT} never matches and is
 * forwarded literal. Verify against #93250 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT implement
 * a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "expanded",
  "cognate",
  "literal",
  "hold",
  "spec-alias",
  "claude-dialect",
  "allowlist",
  "unexpanded",
  "module-not-found",
  "connection-closed",
  "no-hint",
  "relative-workaround",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "expanded";
export const PATH_WORD = "literal";
export const SEEDED_WORD = "cognate";
export const HOLD = Object.freeze(["expanded", "hold"]);
export const RECOVER = Object.freeze(["expanded", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "laid",
  "lemures",
  "remanent",
  "released",
  "escheat",
  "stale",
  "freehold",
  "mortmain",
  "phantom",
  "trunked",
  "strowger",
  "exchanged",
  "tokenized",
  "mondegreen",
  "parsed",
  "locked",
  "scratched",
  "derby",
  "unmasked",
  "vizard",
  "precedence",
  "carrier",
  "moored",
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "vernier",
  "slider",
  "sterling",
  "lodged",
  "bypassed",
  "diplopic",
  "freewheeling",
  "doubled",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
  "culled",
  "quietus",
  "palimpsest",
  "recension",
  "ephemera",
  "mirage",
  "calque",
  "sigil",
  "caret",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "cognate"),
);

export const FEATURED_ISSUE = 93250;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93250";
export const TITLE =
  "Plugin MCP servers: ${PLUGIN_ROOT} placeholder not expanded (Agent Plugins spec non-conformance)";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "area:mcp", "area:plugins"]);
export const AUTHOR = "joshyim";
export const FILED = "2026-09-10T03:06:22Z";
export const CLAUDE_VERSION = "2.1.260";
export const SPEC = "Agent Plugins spec v1.1.0 §9.1/§9.2";
export const SPEC_VARS = Object.freeze(["PLUGIN_ROOT", "PLUGIN_DATA"]);
export const CLAUDE_VARS = Object.freeze([
  "CLAUDE_PLUGIN_ROOT",
  "CLAUDE_PLUGIN_DATA",
  "CLAUDE_PROJECT_DIR",
]);
export const ALLOWLIST =
  "^\\$\\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\\}$";
export const LITERAL_ARG = "${PLUGIN_ROOT}/dist/index.js";
export const WORKAROUND_ARG = "./dist/index.js";
export const ERROR_MODULE = "MODULE_NOT_FOUND";
export const ERROR_CLOSED = "CONNECTION_CLOSED";
export const PHRASE =
  "when the host leaves the spec-standard ${PLUGIN_ROOT} cognate literal instead of expanded, score cognate or admit expanded.";

export const DESK_STATIONS = Object.freeze([
  {
    id: "folio",
    rite: "spec lemma",
    kind: "expand",
    note: "Agent Plugins spec v1.1.0 §9.1/§9.2 — expand ${PLUGIN_ROOT} / ${PLUGIN_DATA} in args, env, cwd",
  },
  {
    id: "gloss",
    rite: "ochre gloss",
    kind: "mark",
    note: "mark the unexpanded cognate so ${PLUGIN_ROOT}/dist/index.js is not passed literal to node",
  },
  {
    id: "lamp",
    rite: "Claude dialect",
    kind: "alias",
    note: "CLAUDE_PLUGIN_ROOT / CLAUDE_PLUGIN_DATA should be aliases of the spec forms, not the only match",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "${PLUGIN_ROOT}",
  "${PLUGIN_DATA}",
  "${CLAUDE_PLUGIN_ROOT}",
  "${CLAUDE_PLUGIN_DATA}",
  "mcp.json",
  "args",
  "env",
  "cwd",
  "MODULE_NOT_FOUND",
  "CONNECTION_CLOSED",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93057,
    title:
      "CLAUDE_PLUGIN_ROOT unset in agent Bash env / wrong source-dir in hooks for string-source marketplace plugins",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — prefixed var missing or wrong, not unexpanded spec alias; do not rebuild",
  },
  {
    issue: 79889,
    title: "Hookify CLAUDE_PLUGIN_ROOT import issues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Hookify import shape; do not rebuild",
  },
  {
    issue: 78963,
    title: "Hookify CLAUDE_PLUGIN_ROOT import issues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Hookify import shape; do not rebuild",
  },
  {
    issue: 13452,
    title: "Hookify CLAUDE_PLUGIN_ROOT import issues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Hookify import shape; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93219,
    title: "Vernier — effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary; cite in data only",
  },
  {
    issue: 93207,
    title: "iOS plan approval setMode auto",
    state: "OPEN",
    citeOnly: true,
    why: "iOS plan approval setMode auto — backup, not primary; cite in data only",
  },
  {
    issue: 93239,
    title: "Enter interrupts instead of queueing",
    state: "OPEN",
    citeOnly: true,
    why: "Enter interrupts instead of queueing — backup, not primary; cite in data only",
  },
  {
    issue: 93259,
    title: "archive_session pin refusal message collapse",
    state: "OPEN",
    citeOnly: true,
    why: "archive_session pin refusal message collapse — backup, not primary; cite in data only",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops bypass flags",
    state: "OPEN",
    citeOnly: true,
    why: "agents auto-update relaunch drops bypass flags — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "ephemera",
  "palimpsest",
  "recension",
  "quietus",
  "calque",
  "sigil",
  "caret",
  "vernier",
]);

/**
 * Conceptual lemma expansion — spec + Claude aliases both resolve
 * to the plugin install path instead of leaving the cognate literal.
 */
export function expandLemma(input = {}) {
  const expanded = input.expanded === true || input.unexpanded !== true;
  return {
    spec: expanded ? "/plugins/my-plugin" : "${PLUGIN_ROOT}",
    claude: expanded ? "/plugins/my-plugin" : "${CLAUDE_PLUGIN_ROOT}",
    rite: expanded ? "expanded" : "cognate",
    args: expanded
      ? "/plugins/my-plugin/dist/index.js"
      : "${PLUGIN_ROOT}/dist/index.js",
  };
}

/**
 * Conceptual ochre gloss — mark the unexpanded spec cognate so
 * node never receives ${PLUGIN_ROOT}/dist/index.js verbatim.
 */
export function markGloss(input = {}) {
  const cognate =
    input.unexpanded === true ||
    (input.specPlaceholder === true && input.allowlistClaudeOnly === true);
  return {
    glossed: cognate,
    lamp: cognate ? "cognate" : "expanded",
    moduleNotFound: cognate && input.moduleNotFound !== false,
    connectionClosed: cognate && input.connectionClosed !== false,
  };
}

export function readDesk(input = {}) {
  const lemma = expandLemma(input);
  const gloss = markGloss(input);
  const literalCognate = gloss.lamp === "cognate";
  return {
    lemma,
    gloss,
    stations: DESK_STATIONS,
    literalCognate,
    cue: literalCognate ? "cognate" : "expanded",
  };
}

/**
 * Published cognate walk from #93250 only. Facts from the issue body.
 * An expanded desk expands spec + Claude aliases. A cognate desk leaves
 * the spec-standard ${PLUGIN_ROOT} literal on the wire.
 */
export const COGNATE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-expanded",
    expanded: true,
    specPlaceholder: false,
    claudeAlias: true,
    allowlistClaudeOnly: false,
    unexpanded: false,
    argsLiteral: false,
    envLiteral: false,
    cwdLiteral: false,
    moduleNotFound: false,
    connectionClosed: false,
    noHint: false,
    cue: "expanded",
    note: "idle HOLD: spec + Claude aliases both expand; args/env/cwd resolve to the install path",
  },
  {
    t: "spec",
    event: "spec-alias",
    specPlaceholder: true,
    cue: "cognate",
    note: "plugin mcp.json uses spec-standard ${PLUGIN_ROOT} / ${PLUGIN_DATA} in args, env, cwd",
  },
  {
    t: "dialect",
    event: "claude-dialect",
    claudeAlias: true,
    allowlistClaudeOnly: true,
    cue: "cognate",
    note: "host only expands ${CLAUDE_PLUGIN_ROOT} and related CLAUDE_-prefixed variants",
  },
  {
    t: "allow",
    event: "allowlist",
    allowlistClaudeOnly: true,
    cue: "cognate",
    note: "binary allowlist regex observed: ^\\$\\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\\}$",
  },
  {
    t: "gloss",
    event: "unexpanded",
    unexpanded: true,
    specPlaceholder: true,
    cue: "cognate",
    note: "spec-standard ${PLUGIN_ROOT} is passed literally — the cognate is not expanded",
  },
  {
    t: "wire",
    event: "literal-args",
    argsLiteral: true,
    cwdLiteral: true,
    unexpanded: true,
    cue: "cognate",
    note: "node receives ${PLUGIN_ROOT}/dist/index.js verbatim; cwd is ${PLUGIN_ROOT}",
  },
  {
    t: "module",
    event: "module-not-found",
    moduleNotFound: true,
    argsLiteral: true,
    cue: "cognate",
    note: "MODULE_NOT_FOUND — child cannot resolve the literal placeholder path",
  },
  {
    t: "closed",
    event: "connection-closed",
    connectionClosed: true,
    moduleNotFound: true,
    cue: "cognate",
    note: "CONNECTION_CLOSED at session startup",
  },
  {
    t: "hint",
    event: "no-hint",
    noHint: true,
    connectionClosed: true,
    cue: "cognate",
    note: "error gives no hint that placeholders failed to expand",
  },
  {
    t: "cut",
    event: "cognate",
    expanded: false,
    specPlaceholder: true,
    claudeAlias: true,
    allowlistClaudeOnly: true,
    unexpanded: true,
    argsLiteral: true,
    envLiteral: true,
    cwdLiteral: true,
    moduleNotFound: true,
    connectionClosed: true,
    noHint: true,
    cue: "cognate",
    note: "spec cognate left literal; score cognate",
  },
  {
    t: "path",
    event: "literal",
    literal: true,
    cue: "cognate",
    note: "literal — unexpanded placeholder string on the wire",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    expanded: true,
    specPlaceholder: false,
    claudeAlias: true,
    allowlistClaudeOnly: false,
    unexpanded: false,
    argsLiteral: false,
    envLiteral: false,
    cwdLiteral: false,
    moduleNotFound: false,
    connectionClosed: false,
    noHint: false,
    cue: "expanded",
  };
}

export function seedExpanded() {
  return { ...emptyTicket() };
}

export function seedCognate() {
  return {
    seed: SEEDED_WORD,
    expanded: false,
    specPlaceholder: true,
    claudeAlias: true,
    allowlistClaudeOnly: true,
    unexpanded: true,
    argsLiteral: true,
    envLiteral: true,
    cwdLiteral: true,
    moduleNotFound: true,
    connectionClosed: true,
    noHint: true,
    cue: "cognate",
    issue: FEATURED_ISSUE,
  };
}

export function seedLiteral() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    literal: true,
    cue: "cognate",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    expanded: true,
    cue: "expanded",
  };
}

export function seedSpecAlias() {
  return {
    seed: "spec-alias",
    preferSeed: true,
    specPlaceholder: true,
    cue: "cognate",
  };
}

export function seedClaudeDialect() {
  return {
    seed: "claude-dialect",
    preferSeed: true,
    claudeAlias: true,
    allowlistClaudeOnly: true,
    cue: "cognate",
  };
}

export function seedAllowlist() {
  return {
    seed: "allowlist",
    preferSeed: true,
    allowlistClaudeOnly: true,
    cue: "cognate",
  };
}

export function seedUnexpanded() {
  return {
    seed: "unexpanded",
    preferSeed: true,
    unexpanded: true,
    specPlaceholder: true,
    cue: "cognate",
  };
}

export function seedModuleNotFound() {
  return {
    seed: "module-not-found",
    preferSeed: true,
    moduleNotFound: true,
    argsLiteral: true,
    cue: "cognate",
  };
}

export function seedConnectionClosed() {
  return {
    seed: "connection-closed",
    preferSeed: true,
    connectionClosed: true,
    moduleNotFound: true,
    cue: "cognate",
  };
}

export function seedNoHint() {
  return {
    seed: "no-hint",
    preferSeed: true,
    noHint: true,
    connectionClosed: true,
    cue: "cognate",
  };
}

export function seedRelativeWorkaround() {
  return {
    seed: "relative-workaround",
    preferSeed: true,
    relativeWorkaround: true,
    cue: "expanded",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      expanded: false,
      specPlaceholder: false,
      claudeAlias: false,
      allowlistClaudeOnly: false,
      unexpanded: false,
      argsLiteral: false,
      envLiteral: false,
      cwdLiteral: false,
      moduleNotFound: false,
      connectionClosed: false,
      noHint: false,
      relativeWorkaround: false,
      literal: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    expanded: raw.expanded === true,
    specPlaceholder: raw.specPlaceholder === true,
    claudeAlias: raw.claudeAlias === true,
    allowlistClaudeOnly: raw.allowlistClaudeOnly === true,
    unexpanded: raw.unexpanded === true,
    argsLiteral: raw.argsLiteral === true,
    envLiteral: raw.envLiteral === true,
    cwdLiteral: raw.cwdLiteral === true,
    moduleNotFound: raw.moduleNotFound === true,
    connectionClosed: raw.connectionClosed === true,
    noHint: raw.noHint === true,
    relativeWorkaround: raw.relativeWorkaround === true,
    literal: raw.literal === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.expanded != null ||
        ticket.specPlaceholder != null ||
        ticket.claudeAlias != null ||
        ticket.allowlistClaudeOnly != null ||
        ticket.unexpanded != null ||
        ticket.argsLiteral != null ||
        ticket.envLiteral != null ||
        ticket.cwdLiteral != null ||
        ticket.moduleNotFound != null ||
        ticket.connectionClosed != null ||
        ticket.noHint != null ||
        ticket.relativeWorkaround != null ||
        ticket.literal != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isExpanded(row) {
  if (row.literal) return false;
  if (row.cue === "cognate") return false;
  if (row.unexpanded && row.specPlaceholder) return false;
  if (row.moduleNotFound && row.connectionClosed) return false;
  if (
    row.expanded === true &&
    row.unexpanded !== true &&
    row.cue !== "cognate"
  ) {
    return true;
  }
  if (
    row.cue === "expanded" &&
    row.unexpanded !== true &&
    row.moduleNotFound !== true
  ) {
    return true;
  }
  return false;
}

function isCognate(row) {
  if (row.literal && row.cue !== "expanded") return false;
  if (row.cue === "cognate") return true;
  if (row.specPlaceholder && row.allowlistClaudeOnly && row.unexpanded) {
    return true;
  }
  if (row.argsLiteral && row.moduleNotFound) return true;
  if (row.moduleNotFound && row.connectionClosed) return true;
  if (row.unexpanded && row.noHint) return true;
  return false;
}

function isLiteralPath(row) {
  return row.literal === true && !isExpanded(row);
}

/**
 * Score one desk pass against the cognate booth.
 * expanded: spec + Claude aliases both expand; session starts connected.
 * cognate: spec-standard ${PLUGIN_ROOT} left literal; MODULE_NOT_FOUND / CONNECTION_CLOSED.
 * literal: named path — unexpanded placeholder string on the wire.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isLiteralPath(row)) {
    verdict = "literal";
  } else if (isCognate(row)) {
    verdict = "cognate";
  } else if (isExpanded(row)) {
    verdict = "expanded";
  } else if (
    row.specPlaceholder ||
    row.allowlistClaudeOnly ||
    row.unexpanded ||
    row.argsLiteral ||
    row.envLiteral ||
    row.cwdLiteral ||
    row.moduleNotFound ||
    row.connectionClosed ||
    row.noHint
  ) {
    verdict = "cognate";
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
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    expanded: verdict === "expanded",
    cognate: verdict === "cognate" || verdict === SEEDED_WORD,
    literal: verdict === "literal" || verdict === PATH_WORD,
    specPlaceholder: row.specPlaceholder,
    claudeAlias: row.claudeAlias,
    allowlistClaudeOnly: row.allowlistClaudeOnly,
    unexpanded: row.unexpanded,
    argsLiteral: row.argsLiteral,
    envLiteral: row.envLiteral,
    cwdLiteral: row.cwdLiteral,
    moduleNotFound: row.moduleNotFound,
    connectionClosed: row.connectionClosed,
    noHint: row.noHint,
    relativeWorkaround: row.relativeWorkaround,
    cue: hold ? "expanded" : "cognate",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit expanded" : "score cognate",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : COGNATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const cognate = scored.filter((row) => row.verdict === "cognate");
  const literal = scored.filter((row) => row.verdict === "literal");
  const expanded = scored.filter((row) => row.verdict === "expanded");
  const headline =
    scored.find((row) => row.event === "cognate") ||
    scored.find((row) => row.event === "unexpanded") ||
    scored.find((row) => row.event === "module-not-found") ||
    scored.find((row) => row.event === "literal") ||
    cognate[cognate.length - 1];
  let verdict = "expanded";
  if (cognate.length) verdict = "cognate";
  else if (literal.length && !expanded.length) verdict = "literal";
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
    cognateCount: cognate.length,
    literalCount: literal.length,
    expandedCount: expanded.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit expanded" : "score cognate",
    note: headline
      ? "spec-standard ${PLUGIN_ROOT} left literal; node gets ${PLUGIN_ROOT}/dist/index.js; MODULE_NOT_FOUND / CONNECTION_CLOSED."
      : "published cognate walk scored against expanded vs cognate",
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
    seeded !== "expanded" &&
    seeded !== "cognate" &&
    seeded !== "literal" &&
    ticket.expanded == null &&
    ticket.specPlaceholder == null &&
    ticket.unexpanded == null &&
    ticket.literal == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    expanded: scored.expanded ?? false,
    specPlaceholder: scored.specPlaceholder ?? false,
    claudeAlias: scored.claudeAlias ?? false,
    allowlistClaudeOnly: scored.allowlistClaudeOnly ?? false,
    unexpanded: scored.unexpanded ?? false,
    argsLiteral: scored.argsLiteral ?? false,
    envLiteral: scored.envLiteral ?? false,
    cwdLiteral: scored.cwdLiteral ?? false,
    moduleNotFound: scored.moduleNotFound ?? false,
    connectionClosed: scored.connectionClosed ?? false,
    noHint: scored.noHint ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.specPlaceholder ? "spec=yes" : "spec=no",
    result.allowlistClaudeOnly ? "allow=claude" : "allow=spec",
    result.unexpanded ? "expand=no" : "expand=yes",
    result.argsLiteral ? "args=literal" : "args=path",
    result.moduleNotFound ? "mod=missing" : "mod=ok",
    result.connectionClosed ? "conn=closed" : "conn=open",
    result.cue === "expanded" ? "cue=expanded" : "cue=cognate",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const desk = readDesk({
    expanded: result.expanded,
    unexpanded: result.unexpanded,
    specPlaceholder: result.specPlaceholder,
    allowlistClaudeOnly: result.allowlistClaudeOnly,
    moduleNotFound: result.moduleNotFound,
    connectionClosed: result.connectionClosed,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    desk,
    lemma: expandLemma({
      expanded: result.expanded,
      unexpanded: result.unexpanded,
    }),
    gloss: markGloss({
      unexpanded: result.unexpanded,
      specPlaceholder: result.specPlaceholder,
      allowlistClaudeOnly: result.allowlistClaudeOnly,
      moduleNotFound: result.moduleNotFound,
      connectionClosed: result.connectionClosed,
    }),
    stations: DESK_STATIONS.map((row) => ({
      ...row,
      literal: result.unexpanded === true || result.verdict === "cognate",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      spec: SPEC,
      specVars: [...SPEC_VARS],
      claudeVars: [...CLAUDE_VARS],
      allowlist: ALLOWLIST,
      literalArg: LITERAL_ARG,
      workaroundArg: WORKAROUND_ARG,
      errorModule: ERROR_MODULE,
      errorClosed: ERROR_CLOSED,
      stations: DESK_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "expand spec-standard ${PLUGIN_ROOT} / ${PLUGIN_DATA} in MCP server args, env, and cwd",
        "treat PLUGIN_ROOT / PLUGIN_DATA as aliases of CLAUDE_PLUGIN_ROOT / CLAUDE_PLUGIN_DATA",
        "hint when a placeholder is left literal so MODULE_NOT_FOUND is not the only signal",
      ],
      hypothesis:
        "NON-BINDING: the placeholder expander allowlists only CLAUDE_* forms, so spec-standard ${PLUGIN_ROOT} never matches and is forwarded literal",
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
