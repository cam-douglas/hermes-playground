#!/usr/bin/env node
/**
 * Ferrule — metalwork / plumbing / cable-clamp sizing booth.
 *
 * Educational diagnostic model for a published Desktop MCP OAuth
 * callback bind: Claude Desktop hardcodes TCP 53280. If a Hyper-V
 * winnat/hns excluded range contains 53280, the OS refuses the bind
 * with EACCES and the browser consent window never opens. CLI on the
 * same machine requests OS-assigned port 0 and succeeds.
 *
 *   node ferrule.mjs data/ferruled.json
 *   echo '{"seed":"ferruled"}' | node ferrule.mjs
 *
 * Idle word is ephemeral (HOLD: OS-assigned port 0 / CLI-parity
 * listening).
 * Path word is ferruled (hardcoded 53280 refused by excluded range
 * → EACCES → no consent).
 * Seeded recover word is rebound (bind port 0; build redirect from
 * assigned port; retry/fallback).
 *
 * Encoded from anthropics/claude-code#92968 issue body only.
 * Hypothesis (NON-BINDING): Desktop binds fixed 53280; winnat/hns
 * exclusion covering 53280 yields EACCES; CLI port 0 avoids
 * collision. Invite verify against #92968 text only.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop automation.
 * No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "ephemeral",
  "ferruled",
  "rebound",
  "hardcoded-53280",
  "excluded-range",
  "eacces-bind",
  "no-consent",
  "no-fallback",
  "no-retry",
  "cli-port-0",
  "cli-parity",
  "winnat-hns",
  "dynamic-range",
  "workaround-range",
  "eacces-not-eaddrinuse",
  "redirect-from-assigned",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "ephemeral";
export const PATH_WORD = "ferruled";
export const SEEDED_WORD = "rebound";
export const HOLD = Object.freeze(["ephemeral"]);
export const RECOVER = Object.freeze(["rebound"]);
export const ALARM = Object.freeze(VERDICTS.filter((name) => name !== "ephemeral"));
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "passable",
  "admitted",
  "deeded",
  "parked",
  "collated",
  "confirmed",
  "loosed",
  "enrolled",
  "as-penned",
  "rove",
  "vaulted",
  "cleared",
  "fused",
  "bound",
  "corked",
  "detached",
  "countersigned",
  "staked",
  "inscribed",
  "emended",
  "miraged",
  "rehitched",
  "regranted",
  "misbound",
  "fouled",
  "voided",
  "dry",
  "bonded",
  "shibbolethed",
  "homesteaded",
  "epitaphed",
  "stereotyped",
  "clung",
  "escheated",
  "banked",
  "intact",
  "rewritten",
  "interlocked",
]);
export const FORBIDDEN_SEED = Object.freeze([...FORBIDDEN_IDLE]);

export const FEATURED_ISSUE = 92968;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92968";
export const TITLE =
  "[BUG] Claude Desktop MCP OAuth callback listener uses a hardcoded port 53280";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:windows",
  "area:auth",
  "area:mcp",
  "area:desktop",
]);
export const DESKTOP_VERSION = "1.49585.0";
export const VERSION_HASH = "41ad1d";
export const OS_NAME = "Windows";
export const REPORTER = "elliotsegler";
export const FILED_AT = "2026-09-09T01:51:55Z";
export const HARDCODED_PORT = 53280;
export const OS_ASSIGNED_PORT = 0;
export const BIND_HOST = "127.0.0.1";
export const EXCLUDED_START = 53249;
export const EXCLUDED_END = 53348;
export const DYNAMIC_START = 53000;
export const DYNAMIC_COUNT = 1000;
export const WORKAROUND_START = 54000;
export const WORKAROUND_COUNT = 11536;
export const ERROR_TEXT = "listen EACCES: permission denied 127.0.0.1:53280";
export const ERROR_CODE = "EACCES";
export const NOT_ERROR = "EADDRINUSE";
export const CLI_REDIRECT_EXAMPLE = "http://localhost:44350/callback";
export const TRANSPORT = "Streamable HTTP";
export const PLATFORM_SERVICES = Object.freeze([
  "Hyper-V",
  "WSL2",
  "Docker Desktop",
  "Virtual Machine Platform",
]);
export const RESERVATION_SERVICES = Object.freeze(["winnat", "hns"]);

export const COUSINS = Object.freeze([
  {
    issue: 84795,
    title: "same hardcoded A53280 / 53280 problem",
    state: "CLOSED",
    citeOnly: true,
    why: "CLOSED not planned / stale — same hardcoded 53280 listener; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "mailslot",
  "shibboleth",
  "interlock",
  "speakpipe",
  "homestead",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "ukase",
  "scabbard",
]);

/**
 * Published clamp walk from #92968 only. Facts from the issue body.
 */
export const CLAMP_WALK = Object.freeze([
  {
    t: "bind",
    event: "desktop-bind-53280",
    client: "desktop",
    bindPort: HARDCODED_PORT,
    hardcoded: true,
    osAssigned: false,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    listening: false,
    consentOpened: false,
    fallback: false,
    retry: false,
    bindError: ERROR_CODE,
    eacces: true,
  },
  {
    t: "range",
    event: "excluded-covers",
    client: "desktop",
    bindPort: HARDCODED_PORT,
    hardcoded: true,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    excludedCovers: true,
    listening: false,
    consentOpened: false,
    bindError: ERROR_CODE,
    eacces: true,
  },
  {
    t: "eacces",
    event: "eacces-bind",
    client: "desktop",
    bindPort: HARDCODED_PORT,
    hardcoded: true,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    bindError: ERROR_CODE,
    eacces: true,
    listening: false,
    consentOpened: false,
    noFallback: true,
    noRetry: true,
  },
  {
    t: "consent",
    event: "no-consent",
    client: "desktop",
    bindPort: HARDCODED_PORT,
    hardcoded: true,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    bindError: ERROR_CODE,
    eacces: true,
    listening: false,
    consentOpened: false,
    setupStopped: true,
  },
  {
    t: "cli",
    event: "cli-port-0",
    client: "cli",
    bindPort: OS_ASSIGNED_PORT,
    hardcoded: false,
    osAssigned: true,
    listening: true,
    consentOpened: true,
    cliParity: true,
    redirectUri: CLI_REDIRECT_EXAMPLE,
  },
]);

export function errorBlock(text = ERROR_TEXT) {
  return text;
}

export function eaccesLine(host = BIND_HOST, port = HARDCODED_PORT) {
  return `listen EACCES: permission denied ${host}:${port}`;
}

export function portInExcludedRange(
  port = HARDCODED_PORT,
  start = EXCLUDED_START,
  end = EXCLUDED_END,
) {
  const n = Number(port);
  return Number.isFinite(n) && n >= Number(start) && n <= Number(end);
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    bindPort: OS_ASSIGNED_PORT,
    osAssigned: true,
    hardcoded: false,
    listening: true,
    consentOpened: true,
    bindError: null,
    eacces: false,
    cliParity: true,
    retry: false,
    fallback: false,
    rebound: false,
    redirectFromAssigned: false,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    client: "cli",
  };
}

export function seedEphemeral() {
  return { ...emptyTicket() };
}

export function seedFerruled() {
  return {
    seed: PATH_WORD,
    bindPort: HARDCODED_PORT,
    hardcoded: true,
    osAssigned: false,
    listening: false,
    consentOpened: false,
    bindError: ERROR_CODE,
    eacces: true,
    noFallback: true,
    noRetry: true,
    excludedStart: EXCLUDED_START,
    excludedEnd: EXCLUDED_END,
    excludedCovers: true,
    dynamicStart: DYNAMIC_START,
    dynamicCount: DYNAMIC_COUNT,
    client: "desktop",
    setupStopped: true,
    error: ERROR_TEXT,
    desktopVersion: DESKTOP_VERSION,
  };
}

export function seedRebound() {
  return {
    seed: SEEDED_WORD,
    bindPort: OS_ASSIGNED_PORT,
    osAssigned: true,
    hardcoded: false,
    listening: true,
    consentOpened: true,
    bindError: null,
    eacces: false,
    redirectFromAssigned: true,
    retry: true,
    fallback: true,
    rebound: true,
    cliParity: true,
    client: "desktop",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      bindPort: null,
      osAssigned: false,
      hardcoded: false,
      listening: false,
      consentOpened: false,
      bindError: null,
      eacces: false,
      noFallback: false,
      noRetry: false,
      retry: false,
      fallback: false,
      rebound: false,
      redirectFromAssigned: false,
      cliParity: false,
      excludedStart: EXCLUDED_START,
      excludedEnd: EXCLUDED_END,
      excludedCovers: false,
      dynamicStart: DYNAMIC_START,
      dynamicCount: DYNAMIC_COUNT,
      client: null,
      setupStopped: false,
      error: null,
    };
  }
  const error = raw.error || raw.errorText || raw.bindErrorText || null;
  const bindError =
    raw.bindError ||
    (typeof error === "string" && error.includes(ERROR_CODE) ? ERROR_CODE : null);
  const bindPort =
    raw.bindPort != null
      ? Number(raw.bindPort)
      : raw.port != null
        ? Number(raw.port)
        : raw.hardcoded === true
          ? HARDCODED_PORT
          : raw.osAssigned === true
            ? OS_ASSIGNED_PORT
            : null;
  const excludedStart =
    raw.excludedStart != null ? Number(raw.excludedStart) : EXCLUDED_START;
  const excludedEnd =
    raw.excludedEnd != null ? Number(raw.excludedEnd) : EXCLUDED_END;
  const excludedCovers =
    raw.excludedCovers === true ||
    (bindPort != null && portInExcludedRange(bindPort, excludedStart, excludedEnd));
  return {
    bindPort,
    osAssigned:
      raw.osAssigned === true || bindPort === OS_ASSIGNED_PORT,
    hardcoded:
      raw.hardcoded === true || bindPort === HARDCODED_PORT,
    listening: raw.listening === true,
    consentOpened:
      raw.consentOpened === true || raw.consent === true,
    bindError,
    eacces:
      raw.eacces === true ||
      bindError === ERROR_CODE ||
      (typeof error === "string" && error.includes(ERROR_CODE)),
    noFallback: raw.noFallback === true || raw.fallback === false,
    noRetry: raw.noRetry === true || raw.retry === false,
    retry: raw.retry === true,
    fallback: raw.fallback === true,
    rebound: raw.rebound === true,
    redirectFromAssigned:
      raw.redirectFromAssigned === true || raw.redirectFromPort === true,
    cliParity: raw.cliParity === true || raw.client === "cli",
    excludedStart,
    excludedEnd,
    excludedCovers,
    dynamicStart:
      raw.dynamicStart != null ? Number(raw.dynamicStart) : DYNAMIC_START,
    dynamicCount:
      raw.dynamicCount != null ? Number(raw.dynamicCount) : DYNAMIC_COUNT,
    client: raw.client || null,
    setupStopped: raw.setupStopped === true,
    error,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    desktopVersion: raw.desktopVersion || raw.desktop || null,
    redirectUri: raw.redirectUri || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.bindPort != null ||
        ticket.port != null ||
        ticket.hardcoded != null ||
        ticket.osAssigned != null ||
        ticket.listening != null ||
        ticket.consentOpened != null ||
        ticket.consent != null ||
        ticket.eacces != null ||
        ticket.bindError != null ||
        ticket.rebound != null ||
        ticket.retry != null ||
        ticket.fallback != null ||
        ticket.cliParity != null ||
        ticket.redirectFromAssigned != null ||
        ticket.excludedStart != null ||
        ticket.event),
  );
}

function isFerruled(row) {
  if (row.rebound || row.redirectFromAssigned) return false;
  if (row.client === "cli" && row.osAssigned) return false;
  if (row.bindPort === OS_ASSIGNED_PORT && row.listening) return false;
  const port = row.bindPort;
  const covered =
    row.excludedCovers ||
    (port != null &&
      portInExcludedRange(port, row.excludedStart, row.excludedEnd));
  return (
    (row.hardcoded || port === HARDCODED_PORT) &&
    port === HARDCODED_PORT &&
    covered &&
    row.eacces &&
    !row.consentOpened &&
    !row.listening
  );
}

function isRebound(row) {
  if (row.hardcoded && row.bindPort === HARDCODED_PORT) return false;
  if (row.rebound && (row.bindPort === OS_ASSIGNED_PORT || row.osAssigned)) {
    return true;
  }
  return (
    (row.bindPort === OS_ASSIGNED_PORT || row.osAssigned) &&
    row.redirectFromAssigned &&
    (row.retry || row.fallback || row.rebound) &&
    !row.hardcoded
  );
}

function isEphemeral(row) {
  if (isFerruled(row)) return false;
  if (isRebound(row)) return false;
  if (row.cliParity && row.osAssigned && row.listening && row.consentOpened) {
    return true;
  }
  return (
    (row.bindPort === OS_ASSIGNED_PORT || row.osAssigned) &&
    row.listening &&
    row.consentOpened &&
    !row.hardcoded
  );
}

/**
 * Score one clamp seating against the Desktop ferrule.
 * ephemeral: OS-assigned port 0 / CLI-parity listening; consent opens.
 * ferruled: hardcoded 53280 sits in an excluded range; EACCES; no consent.
 * rebound: bind port 0; build redirect from assigned port; retry/fallback.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isFerruled(row)) {
    verdict = "ferruled";
  } else if (isRebound(row)) {
    verdict = "rebound";
  } else if (isEphemeral(row)) {
    verdict = "ephemeral";
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
    ephemeral: verdict === "ephemeral",
    ferruled: verdict === "ferruled",
    rebound: verdict === "rebound" || verdict === SEEDED_WORD,
    bindPort: row.bindPort,
    osAssigned: row.osAssigned,
    hardcoded: row.hardcoded,
    listening: row.listening,
    consentOpened: row.consentOpened,
    bindError: row.bindError,
    eacces: row.eacces,
    noFallback: row.noFallback,
    noRetry: row.noRetry,
    retry: row.retry,
    fallback: row.fallback,
    redirectFromAssigned: row.redirectFromAssigned,
    cliParity: row.cliParity,
    excludedStart: row.excludedStart,
    excludedEnd: row.excludedEnd,
    excludedCovers: row.excludedCovers,
    dynamicStart: row.dynamicStart,
    dynamicCount: row.dynamicCount,
    client: row.client,
    setupStopped: row.setupStopped,
    error: row.error,
    event: row.event,
    t: row.t,
    desktopVersion: row.desktopVersion,
    redirectUri: row.redirectUri,
    phrase: hold ? "admit ephemeral" : "score ferruled",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : CLAMP_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const ferruled = scored.filter((row) => row.verdict === "ferruled");
  const rebound = scored.filter((row) => row.verdict === "rebound");
  const ephemeral = scored.filter((row) => row.verdict === "ephemeral");
  const headline =
    scored.find((row) => row.event === "no-consent") ||
    scored.find((row) => row.event === "eacces-bind") ||
    ferruled[ferruled.length - 1];
  let verdict = "ephemeral";
  if (ferruled.length) verdict = "ferruled";
  else if (rebound.length && !ephemeral.length) verdict = "rebound";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "ephemeral",
    alarm: verdict !== "ephemeral",
    ferruledCount: ferruled.length,
    reboundCount: rebound.length,
    ephemeralCount: ephemeral.length,
    headline,
    rows: scored,
    phrase: verdict === "ephemeral" ? "admit ephemeral" : "score ferruled",
    note: headline
      ? "Desktop ferrules the OAuth callback to 53280; excluded range refuses the bind with EACCES and consent never opens"
      : "published Desktop ferrule walk scored against ephemeral vs ferruled",
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
    seeded !== "ephemeral" &&
    seeded !== "ferruled" &&
    seeded !== "rebound" &&
    ticket.bindPort == null &&
    ticket.hardcoded == null &&
    ticket.listening == null &&
    ticket.consentOpened == null &&
    ticket.eacces == null &&
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
    errorBlock: errorBlock(),
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.bindPort === HARDCODED_PORT ? "port=53280" : "port=0",
    result.hardcoded ? "clamp=on" : "clamp=off",
    result.excludedCovers ? "range=hit" : "range=clear",
    result.eacces ? "bind=EACCES" : "bind=ok",
    result.consentOpened ? "consent=open" : "consent=shut",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      desktopVersion: DESKTOP_VERSION,
      versionHash: VERSION_HASH,
      os: OS_NAME,
      reporter: REPORTER,
      filedAt: FILED_AT,
      hardcodedPort: HARDCODED_PORT,
      osAssignedPort: OS_ASSIGNED_PORT,
      bindHost: BIND_HOST,
      excludedStart: EXCLUDED_START,
      excludedEnd: EXCLUDED_END,
      dynamicStart: DYNAMIC_START,
      dynamicCount: DYNAMIC_COUNT,
      workaroundStart: WORKAROUND_START,
      workaroundCount: WORKAROUND_COUNT,
      errorText: ERROR_TEXT,
      errorCode: ERROR_CODE,
      notError: NOT_ERROR,
      cliRedirectExample: CLI_REDIRECT_EXAMPLE,
      transport: TRANSPORT,
      platformServices: [...PLATFORM_SERVICES],
      reservationServices: [...RESERVATION_SERVICES],
      cousin: 84795,
      workaround:
        "change Windows dynamic port range then reboot (published reporter workaround)",
      hypothesis:
        "Desktop binds fixed 53280; winnat/hns exclusion covering 53280 yields EACCES; CLI port 0 avoids collision",
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
