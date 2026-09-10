#!/usr/bin/env node
/**
 * Concordat — diplomatic chancery / treaty-desk / protocol-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * after negotiating MCP protocol 2026-07-28 (SEP-2575 via server/discover),
 * Desktop and CLI keep sending HTTP header Mcp-Protocol-Version: 2025-11-25
 * while JSON-RPC params._meta["io.modelcontextprotocol/protocolVersion"]
 * = "2026-07-28". Spec-compliant stateless servers reject with JSON-RPC
 * -32020 HEADER_MISMATCH / HTTP 400; the connector relays -32603.
 * UI shows Connected; every tool call fails.
 *
 *   node concordat.mjs data/concordat.json
 *   echo '{"seed":"mismatched"}' | node concordat.mjs
 *
 * Idle word is concordant (HOLD: header and body versions agree).
 * Seeded word is mismatched (#93290: header 2025-11-25 vs meta 2026-07-28).
 * Path word is header-mismatch (discord of the two instruments).
 * Product score word is concordat (score concordat or admit concordant).
 *
 * Encoded from anthropics/claude-code#93290 issue body only.
 * Hypothesis (NON-BINDING): Desktop/CLI keep a stale header default after
 * SEP-2575 discover, so the header never forms a concord with _meta.
 * Verify against #93290 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "concordant",
  "mismatched",
  "concordat",
  "header-mismatch",
  "discord",
  "hold",
  "legacy",
  "discover",
  "header-stale",
  "body-new",
  "connected-lie",
  "relay-32603",
  "stateless-reject",
  "sep-2575",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "concordant";
export const PATH_WORD = "header-mismatch";
export const SEEDED_WORD = "mismatched";
export const PRODUCT_WORD = "concordat";
export const HOLD = Object.freeze(["concordant", "hold", "legacy"]);
export const RECOVER = Object.freeze(["concordant", "hold", "legacy"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "reaped",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
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
  "wedged",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "mismatched" && name !== "concordat"),
);

export const FEATURED_ISSUE = 93290;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93290";
export const TITLE =
  "Claude Desktop / Claude Code CLI send Mcp-Protocol-Version: 2025-11-25 with _meta protocolVersion 2026-07-28 via claude.ai connectors — spec-compliant stateless servers reject every call (-32020 header mismatch)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:mcp",
]);
export const AUTHOR = "StephaneBernard";
export const FILED = "2026-09-10T07:30:40Z";
export const CLAUDE_VERSION = "2.1.267";
export const DESKTOP_VERSION = "1.49585.0";
export const OS = "macOS (failing clients), Linux devcontainer (working client)";
export const HEADER_VERSION = "2025-11-25";
export const META_VERSION = "2026-07-28";
export const NEGOTIATED = "2026-07-28";
export const REJECT_CODE = -32020;
export const RELAY_CODE = -32603;
export const HTTP_STATUS = 400;
export const META_KEY = "io.modelcontextprotocol/protocolVersion";
export const HEADER_NAME = "Mcp-Protocol-Version";
export const SDK = "github.com/modelcontextprotocol/go-sdk v1.7.0";
export const SDK_OPTION = "StreamableHTTPOptions{Stateless:true}";
export const PHRASE =
  "when Desktop or CLI send a 2025-11-25 header with a 2026-07-28 _meta after SEP-2575 discover, score concordat or admit concordant.";

export const DESK_STATIONS = Object.freeze([
  {
    id: "header",
    rite: "read the header instrument",
    kind: "header",
    note: "Mcp-Protocol-Version must match the negotiated / _meta protocolVersion",
  },
  {
    id: "body",
    rite: "read the body instrument",
    kind: "body",
    note: "params._meta io.modelcontextprotocol/protocolVersion after SEP-2575 discover",
  },
  {
    id: "seal",
    rite: "press the concord seal",
    kind: "seal",
    note: "stateless servers reject HEADER_MISMATCH -32020 when the two instruments disagree",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "Mcp-Protocol-Version: 2025-11-25",
  "io.modelcontextprotocol/protocolVersion",
  "2026-07-28",
  "SEP-2575",
  "server/discover",
  "-32020",
  "HEADER_MISMATCH",
  "-32603",
  "StreamableHTTPOptions{Stateless:true}",
  "Connected",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92835,
    title:
      "related header-vs-negotiated-version; drifted toward VS Code tools-loading",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — related header-vs-negotiated-version; drifted toward VS Code tools-loading; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: "go-sdk#1162",
    title: "Go SDK client header taken from default/context while body carries negotiated version",
    state: "OPEN",
    citeOnly: true,
    why: "Client-side mirror on the Go SDK — cite only; not a Claude Code booth",
  },
  {
    issue: "go-sdk#1164",
    title: "Go SDK client-side fix of the same header/body asymmetry",
    state: "OPEN",
    citeOnly: true,
    why: "Client-side mirror on the Go SDK — cite only; not a Claude Code booth",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "flashpan",
  "clepsydra",
  "derby",
  "vizard",
  "vernier",
  "seizing",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Compare the two treaty instruments — HTTP header vs JSON-RPC _meta.
 * A concord forms only when both versions agree, or the legacy path
 * sends no _meta at all.
 */
export function compareInstruments(input = {}) {
  const header = input.headerVersion || input.header || null;
  const meta = input.metaVersion || input.meta || null;
  const hasMeta = meta != null && meta !== "";
  const agree = hasMeta ? header === meta : !input.toolsFail;
  return {
    header,
    meta,
    hasMeta,
    agree,
    stamp: agree ? "concordant" : "mismatched",
    discord: hasMeta && header !== meta,
  };
}

/**
 * Press the chancery seal — stateless servers reject a discord.
 */
export function stampSeal(input = {}) {
  const compared = compareInstruments(input);
  const cracked =
    compared.discord === true ||
    input.code === REJECT_CODE ||
    input.headerMismatch === true;
  return {
    cracked,
    stamp: cracked ? "mismatched" : "concordant",
    code: cracked ? REJECT_CODE : 0,
    relay: cracked ? RELAY_CODE : 0,
    http: cracked ? HTTP_STATUS : 200,
  };
}

/**
 * Read the diplomatic pouch: Connected UI vs tools that actually fire.
 */
export function readPouch(input = {}) {
  const compared = compareInstruments(input);
  const lie = input.connected === true && (input.toolsFail === true || compared.discord);
  return {
    connected: input.connected !== false,
    toolsFail: compared.discord || input.toolsFail === true,
    lie,
    cue: lie || compared.discord ? "mismatched" : "concordant",
  };
}

export function readChancery(input = {}) {
  const instruments = compareInstruments(input);
  const seal = stampSeal(input);
  const pouch = readPouch(input);
  const discord = instruments.discord === true;
  return {
    instruments,
    seal,
    pouch,
    stations: DESK_STATIONS,
    discord,
    cue: discord ? "mismatched" : "concordant",
  };
}

/**
 * Published concordat walk from #93290 only. Facts from the issue body.
 * A concordant desk keeps header and _meta on the same protocol.
 * A mismatched desk negotiates 2026-07-28 then ships a stale header.
 */
export const CONCORDAT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-concordant",
    concordant: true,
    headerVersion: META_VERSION,
    metaVersion: META_VERSION,
    negotiated: META_VERSION,
    headerMismatch: false,
    toolsFail: false,
    connected: true,
    cue: "concordant",
    note: "idle HOLD: header and body versions agree; the concord forms; tools fire",
  },
  {
    t: "discover",
    event: "discover",
    negotiated: META_VERSION,
    sep2575: true,
    cue: "mismatched",
    note: "SEP-2575 via server/discover negotiates 2026-07-28",
  },
  {
    t: "header",
    event: "header-stale",
    headerVersion: HEADER_VERSION,
    negotiated: META_VERSION,
    cue: "mismatched",
    note: "Desktop / CLI keep sending Mcp-Protocol-Version: 2025-11-25",
  },
  {
    t: "body",
    event: "body-new",
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    cue: "mismatched",
    note: "params._meta io.modelcontextprotocol/protocolVersion = 2026-07-28",
  },
  {
    t: "seal",
    event: "stateless-reject",
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    stateless: true,
    code: REJECT_CODE,
    cue: "mismatched",
    note: "Go MCP SDK StreamableHTTPOptions{Stateless:true} rejects -32020 HEADER_MISMATCH / HTTP 400",
  },
  {
    t: "relay",
    event: "relay-32603",
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    code: REJECT_CODE,
    relayCode: RELAY_CODE,
    cue: "mismatched",
    note: "claude.ai connector relays the reject as JSON-RPC -32603",
  },
  {
    t: "ui",
    event: "connected-lie",
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    connected: true,
    toolsFail: true,
    cue: "mismatched",
    note: "connector UI shows Connected but every tool call fails",
  },
  {
    t: "cut",
    event: "mismatched",
    concordant: false,
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    negotiated: META_VERSION,
    headerMismatch: true,
    stateless: true,
    connected: true,
    toolsFail: true,
    code: REJECT_CODE,
    relayCode: RELAY_CODE,
    cue: "mismatched",
    note: "header 2025-11-25 vs _meta 2026-07-28; score mismatched / concordat",
  },
  {
    t: "path",
    event: "header-mismatch",
    headerMismatch: true,
    cue: "mismatched",
    note: "header-mismatch — the two instruments never form a concord",
  },
  {
    t: "contrast",
    event: "legacy",
    client: "vscode",
    headerVersion: HEADER_VERSION,
    metaVersion: null,
    toolsFail: false,
    connected: true,
    cue: "concordant",
    note: "VS Code extension stays on legacy initialize 2025-11-25 with no _meta — tools work",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    concordant: true,
    headerVersion: META_VERSION,
    metaVersion: META_VERSION,
    negotiated: META_VERSION,
    headerMismatch: false,
    toolsFail: false,
    connected: true,
    stateless: true,
    cue: "concordant",
  };
}

export function seedConcordant() {
  return { ...emptyTicket() };
}

export function seedMismatched() {
  return {
    seed: SEEDED_WORD,
    concordant: false,
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    negotiated: META_VERSION,
    headerMismatch: true,
    stateless: true,
    connected: true,
    toolsFail: true,
    code: REJECT_CODE,
    relayCode: RELAY_CODE,
    client: "desktop",
    cue: "mismatched",
    issue: FEATURED_ISSUE,
  };
}

export function seedConcordat() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    headerVersion: HEADER_VERSION,
    metaVersion: META_VERSION,
    headerMismatch: true,
    toolsFail: true,
    connected: true,
    code: REJECT_CODE,
    cue: "mismatched",
  };
}

export function seedHeaderMismatch() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    headerMismatch: true,
    cue: "mismatched",
  };
}

export function seedDiscord() {
  return {
    seed: "discord",
    preferSeed: true,
    headerMismatch: true,
    cue: "mismatched",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    concordant: true,
    cue: "concordant",
  };
}

export function seedLegacy() {
  return {
    seed: "legacy",
    preferSeed: true,
    client: "vscode",
    headerVersion: HEADER_VERSION,
    metaVersion: null,
    toolsFail: false,
    connected: true,
    cue: "concordant",
  };
}

export function seedDiscover() {
  return {
    seed: "discover",
    preferSeed: true,
    sep2575: true,
    negotiated: META_VERSION,
    cue: "mismatched",
  };
}

export function seedHeaderStale() {
  return {
    seed: "header-stale",
    preferSeed: true,
    headerVersion: HEADER_VERSION,
    cue: "mismatched",
  };
}

export function seedBodyNew() {
  return {
    seed: "body-new",
    preferSeed: true,
    metaVersion: META_VERSION,
    cue: "mismatched",
  };
}

export function seedConnectedLie() {
  return {
    seed: "connected-lie",
    preferSeed: true,
    connected: true,
    toolsFail: true,
    cue: "mismatched",
  };
}

export function seedRelay() {
  return {
    seed: "relay-32603",
    preferSeed: true,
    relayCode: RELAY_CODE,
    cue: "mismatched",
  };
}

export function seedStatelessReject() {
  return {
    seed: "stateless-reject",
    preferSeed: true,
    stateless: true,
    code: REJECT_CODE,
    cue: "mismatched",
  };
}

export function seedSep2575() {
  return {
    seed: "sep-2575",
    preferSeed: true,
    sep2575: true,
    cue: "mismatched",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      concordant: false,
      headerVersion: null,
      metaVersion: null,
      negotiated: null,
      headerMismatch: false,
      toolsFail: false,
      connected: false,
      stateless: false,
      code: null,
      relayCode: null,
      client: null,
      sep2575: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    concordant: raw.concordant === true,
    headerVersion: raw.headerVersion || raw.header || null,
    metaVersion:
      raw.metaVersion === null
        ? null
        : raw.metaVersion || raw.meta || null,
    negotiated: raw.negotiated || null,
    headerMismatch: raw.headerMismatch === true,
    toolsFail: raw.toolsFail === true,
    connected: raw.connected === true,
    stateless: raw.stateless === true,
    code: raw.code == null ? null : raw.code,
    relayCode: raw.relayCode == null ? null : raw.relayCode,
    client: raw.client || null,
    sep2575: raw.sep2575 === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.concordant != null ||
        ticket.headerVersion != null ||
        ticket.header != null ||
        ticket.metaVersion != null ||
        ticket.meta != null ||
        ticket.headerMismatch != null ||
        ticket.toolsFail != null ||
        ticket.connected != null ||
        ticket.stateless != null ||
        ticket.code != null ||
        ticket.client != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function versionsDisagree(row) {
  return Boolean(
    row.headerVersion &&
      row.metaVersion &&
      row.headerVersion !== row.metaVersion,
  );
}

function isLegacyContrast(row) {
  if (row.client === "vscode" && row.toolsFail !== true) {
    if (!row.metaVersion || row.event === "legacy") return true;
  }
  return false;
}

function isConcordant(row) {
  if (row.headerMismatch && row.cue !== "concordant") return false;
  if (row.cue === "mismatched" || row.cue === "concordat") return false;
  if (versionsDisagree(row)) return false;
  if (isLegacyContrast(row)) return true;
  if (
    row.concordant === true &&
    row.headerMismatch !== true &&
    row.cue !== "mismatched"
  ) {
    return true;
  }
  if (
    row.cue === "concordant" &&
    row.headerMismatch !== true &&
    !versionsDisagree(row)
  ) {
    return true;
  }
  if (
    row.headerVersion &&
    row.metaVersion &&
    row.headerVersion === row.metaVersion &&
    row.toolsFail !== true
  ) {
    return true;
  }
  return false;
}

function isMismatched(row) {
  if (isLegacyContrast(row)) return false;
  if (row.cue === "mismatched" || row.cue === "concordat") return true;
  if (versionsDisagree(row)) return true;
  if (row.code === REJECT_CODE) return true;
  if (row.headerMismatch && row.toolsFail) return true;
  return false;
}

function isHeaderMismatchPath(row) {
  return row.headerMismatch === true && !isConcordant(row) && row.event === "header-mismatch";
}

/**
 * Score one chancery pass against the concordat booth.
 * concordant: header and body versions agree; tools fire.
 * mismatched: header 2025-11-25 vs _meta 2026-07-28; -32020.
 * header-mismatch: named path — the concord never forms.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isHeaderMismatchPath(row) || (row.headerMismatch && ticket.preferSeed && seeded === PATH_WORD)) {
    verdict = "header-mismatch";
  } else if (isMismatched(row)) {
    verdict = "mismatched";
  } else if (isConcordant(row)) {
    verdict = row.client === "vscode" && ticket.preferSeed !== true && row.event === "legacy"
      ? "legacy"
      : "concordant";
  } else if (
    row.headerMismatch ||
    row.toolsFail ||
    row.code === REJECT_CODE ||
    row.sep2575 ||
    versionsDisagree(row)
  ) {
    verdict = "mismatched";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const instruments = compareInstruments(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    concordant: verdict === "concordant" || verdict === "legacy" || verdict === "hold",
    mismatched: verdict === "mismatched" || verdict === SEEDED_WORD || verdict === PRODUCT_WORD,
    headerMismatch: verdict === "header-mismatch" || verdict === PATH_WORD || instruments.discord,
    discord: instruments.discord,
    headerVersion: row.headerVersion,
    metaVersion: row.metaVersion,
    negotiated: row.negotiated,
    toolsFail: row.toolsFail,
    connected: row.connected,
    stateless: row.stateless,
    code: row.code,
    relayCode: row.relayCode,
    client: row.client,
    sep2575: row.sep2575,
    cue: hold ? "concordant" : "mismatched",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit concordant" : "score concordat",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : CONCORDAT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const mismatched = scored.filter((row) => row.verdict === "mismatched");
  const path = scored.filter((row) => row.verdict === "header-mismatch");
  const concordant = scored.filter((row) => row.verdict === "concordant" || row.verdict === "legacy");
  const headline =
    scored.find((row) => row.event === "mismatched") ||
    scored.find((row) => row.event === "stateless-reject") ||
    scored.find((row) => row.event === "header-mismatch") ||
    mismatched[mismatched.length - 1];
  let verdict = "concordant";
  if (mismatched.length) verdict = "mismatched";
  else if (path.length && !concordant.length) verdict = "header-mismatch";
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
    mismatchedCount: mismatched.length,
    pathCount: path.length,
    concordantCount: concordant.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit concordant" : "score concordat",
    note: headline
      ? "Desktop/CLI send Mcp-Protocol-Version 2025-11-25 with _meta 2026-07-28; stateless servers reject -32020; connector shows Connected while every tool fails."
      : "published concordat walk scored against concordant vs mismatched",
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
    seeded !== "concordant" &&
    seeded !== "mismatched" &&
    seeded !== "header-mismatch" &&
    seeded !== "concordat" &&
    ticket.concordant == null &&
    ticket.headerVersion == null &&
    ticket.metaVersion == null &&
    ticket.headerMismatch == null &&
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
    concordant: scored.concordant ?? false,
    headerVersion: scored.headerVersion ?? null,
    metaVersion: scored.metaVersion ?? null,
    toolsFail: scored.toolsFail ?? false,
    connected: scored.connected ?? false,
    code: scored.code ?? null,
    client: scored.client ?? null,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.headerVersion ? `header=${result.headerVersion}` : "header=none",
    result.metaVersion ? `meta=${result.metaVersion}` : "meta=none",
    result.toolsFail ? "tools=fail" : "tools=ok",
    result.connected ? "ui=connected" : "ui=down",
    result.cue === "concordant" ? "cue=concordant" : "cue=mismatched",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const chancery = readChancery({
    headerVersion: result.headerVersion,
    metaVersion: result.metaVersion,
    toolsFail: result.toolsFail,
    connected: result.connected,
    code: result.code,
    headerMismatch: result.headerMismatch,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    chancery,
    instruments: compareInstruments({
      headerVersion: result.headerVersion,
      metaVersion: result.metaVersion,
      toolsFail: result.toolsFail,
    }),
    seal: stampSeal({
      headerVersion: result.headerVersion,
      metaVersion: result.metaVersion,
      code: result.code,
      headerMismatch: result.headerMismatch,
    }),
    pouch: readPouch({
      headerVersion: result.headerVersion,
      metaVersion: result.metaVersion,
      connected: result.connected,
      toolsFail: result.toolsFail,
    }),
    stations: DESK_STATIONS.map((row) => ({
      ...row,
      cracked: result.headerMismatch === true || result.verdict === "mismatched",
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
      desktopVersion: DESKTOP_VERSION,
      os: OS,
      headerName: HEADER_NAME,
      headerVersion: HEADER_VERSION,
      metaKey: META_KEY,
      metaVersion: META_VERSION,
      negotiated: NEGOTIATED,
      rejectCode: REJECT_CODE,
      relayCode: RELAY_CODE,
      httpStatus: HTTP_STATUS,
      sdk: SDK,
      sdkOption: SDK_OPTION,
      stations: DESK_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "after negotiating 2026-07-28, send Mcp-Protocol-Version: 2026-07-28 on every request that carries _meta.protocolVersion 2026-07-28",
        "alternatively stay entirely on the legacy 2025-11-25 handshake and send no _meta",
        "do not show Connected when every tool call is rejected -32020 / -32603",
      ],
      hypothesis:
        "NON-BINDING: Desktop/CLI keep a stale 2025-11-25 header default after SEP-2575 discover, so the header never forms a concord with _meta 2026-07-28",
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
