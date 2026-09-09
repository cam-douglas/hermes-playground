#!/usr/bin/env node
/**
 * Guillotine — scaffold / guillotine booth.
 *
 * Educational diagnostic model for a published permission-dialog defect:
 * a background-mode / Cowork / Desktop permission card should keep the
 * blade RAISED (Accept + Deny both available so the operator can grant
 * messages / computer_request_access / similar). Instead the blade has
 * FALLEN — the dialog shows only a Deny button (Windows comment:
 * computer_request_access card with an unchecked checkbox that cannot
 * be clicked, and only Deny — no Accept). Auto-allow and prior
 * approvals do not help. The hang that follows is waiting on an
 * approval that cannot be given.
 *
 *   node guillotine.mjs data/fallen.json
 *   echo '{"seed":"fallen"}' | node guillotine.mjs
 *
 * Idle word is raised (HOLD: Accept + Deny both available).
 * Seeded word is fallen (#92974: Deny-only; no Accept).
 * Path word is scaffold (the permission scaffold whose blade has fallen).
 *
 * Encoded from anthropics/claude-code#92974 issue body and one
 * Windows comment only. Hypothesis (NON-BINDING): background-mode
 * permission UI may render a Deny-only card when the grant path for
 * messages/computer_request_access is missing an Accept action / dead
 * checkbox, leaving the session blocked; verify against #92974 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "raised",
  "fallen",
  "scaffold",
  "hold",
  "deny-only",
  "accept-missing",
  "checkbox-dead",
  "mac-messages-perm",
  "win-computer-request",
  "auto-allow-ignored",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "raised";
export const PATH_WORD = "scaffold";
export const SEEDED_WORD = "fallen";
export const HOLD = Object.freeze(["raised", "hold"]);
export const RECOVER = Object.freeze(["raised", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "raised" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "lodged",
  "bypassed",
  "cutaway",
  "sterling",
  "debased",
  "rubbed",
  "primed",
  "flashed",
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
  "collated",
  "stereotyped",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "fallen"),
);

export const FEATURED_ISSUE = 92974;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92974";
export const TITLE =
  "[BUG] background-mode permission dialog shows only a Deny button, no way to Accept";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:agents",
  "area:permissions",
]);
export const REPORTER = "hommeboy";
export const FILED_AT = "2026-09-09T02:33:12Z";
export const PRODUCT = "Claude Code 2.1.247, macOS";
export const VERSION = "2.1.247";
export const PLATFORM = "macos";
export const MODEL = "Sonnet (default)";
export const REGRESSION = true;
export const AUTO_ALLOW_ALREADY_SET = true;
export const PRIOR_APPROVALS_ALREADY_SET = true;
export const HANG_HOURS = 3;
export const WINDOWS_COMMENTER = "dnhonjo-design";
export const WINDOWS_COMMENT_AT = "2026-09-09T07:36:33Z";
export const WINDOWS_SURFACE = "computer_request_access";
export const MAC_SURFACE = "messages";
export const PHRASE =
  "a permission scaffold that offers only Deny is not raised — the blade has already fallen. Score fallen or admit raised.";

export const COUSINS = Object.freeze([
  {
    issue: 93048,
    title:
      "mouse cursor invisible inside folder access permission dialog (Desktop Windows)",
    state: "OPEN",
    citeOnly: true,
    why: "related permission-dialog UI, different defect — cite only; do not clone",
  },
  {
    issue: 76718,
    title:
      "compound-command permission prompting makes multi-session orchestration unusable",
    state: "CLOSED",
    citeOnly: true,
    why: "permission-prompt class — Guillotine is Deny-only / missing Accept; cite only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "greenroom",
  "quill",
  "colophon",
  "sallyport",
  "homestead",
  "shibboleth",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "hangfire",
  "detent",
  "oubliette",
  "ephemera",
  "assay",
]);

/**
 * Published guillotine walk from #92974 only. Facts from the issue body
 * and the Windows Cowork comment. A raised blade offers Accept + Deny.
 * A fallen blade offers only Deny.
 */
export const GUILLOTINE_WALK = Object.freeze([
  {
    t: "idle",
    event: "blade-raised",
    acceptAvailable: true,
    denyAvailable: true,
    checkboxClickable: true,
    autoAllowHonored: true,
    hangWaiting: false,
    note: "idle HOLD: Accept + Deny both available so the operator can grant",
  },
  {
    t: "mac",
    event: "mac-messages-perm",
    platform: "macos",
    permissionKind: "messages",
    acceptAvailable: false,
    denyAvailable: true,
    backgroundMode: true,
    scheduledTask: true,
    note: "scheduled group-chat message; Messages permission card is Deny-only",
  },
  {
    t: "deny",
    event: "deny-only",
    acceptAvailable: false,
    denyAvailable: true,
    acceptMissing: true,
    note: "card shows Deny (⌘.) and no Accept / Allow / Grant",
  },
  {
    t: "auto",
    event: "auto-allow-ignored",
    acceptAvailable: false,
    denyAvailable: true,
    autoAllowSet: true,
    priorApprovalsSet: true,
    autoAllowHonored: false,
    note: "auto-allow and prior approvals already set; still Deny-only",
  },
  {
    t: "win",
    event: "win-computer-request",
    platform: "windows",
    permissionKind: "computer_request_access",
    acceptAvailable: false,
    denyAvailable: true,
    cowork: true,
    desktop: true,
    note: "Windows Claude Desktop Cowork computer_request_access — Deny only",
  },
  {
    t: "box",
    event: "checkbox-dead",
    platform: "windows",
    permissionKind: "computer_request_access",
    acceptAvailable: false,
    denyAvailable: true,
    checkboxPresent: true,
    checkboxChecked: false,
    checkboxClickable: false,
    note: "app listed; unchecked checkbox cannot be clicked; only Deny",
  },
  {
    t: "hang",
    event: "hang-waiting",
    acceptAvailable: false,
    denyAvailable: true,
    hangWaiting: true,
    hangHours: HANG_HOURS,
    note: "session hangs hours waiting on an approval that cannot be given",
  },
  {
    t: "path",
    event: "scaffold",
    scaffold: true,
    acceptAvailable: false,
    denyAvailable: true,
    note: "a permission scaffold that offers only Deny is not raised",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    acceptAvailable: true,
    denyAvailable: true,
    checkboxClickable: true,
    checkboxPresent: false,
    checkboxChecked: false,
    autoAllowSet: true,
    priorApprovalsSet: true,
    autoAllowHonored: true,
    hangWaiting: false,
    hangHours: 0,
    platform: "macos",
    permissionKind: MAC_SURFACE,
    backgroundMode: true,
    blade: "raised",
  };
}

export function seedRaised() {
  return { ...emptyTicket() };
}

export function seedFallen() {
  return {
    seed: SEEDED_WORD,
    acceptAvailable: false,
    denyAvailable: true,
    acceptMissing: true,
    checkboxPresent: false,
    checkboxClickable: false,
    autoAllowSet: true,
    priorApprovalsSet: true,
    autoAllowHonored: false,
    hangWaiting: true,
    hangHours: HANG_HOURS,
    platform: "macos",
    permissionKind: MAC_SURFACE,
    backgroundMode: true,
    scheduledTask: true,
    blade: "fallen",
    issue: FEATURED_ISSUE,
    version: VERSION,
  };
}

export function seedScaffold() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scaffold: true,
    acceptAvailable: false,
    denyAvailable: true,
    acceptMissing: true,
    blade: "fallen",
  };
}

export function seedDenyOnly() {
  return {
    seed: "deny-only",
    acceptAvailable: false,
    denyAvailable: true,
    acceptMissing: true,
    blade: "fallen",
    platform: "macos",
    permissionKind: MAC_SURFACE,
  };
}

export function seedWinComputerRequest() {
  return {
    seed: "win-computer-request",
    platform: "windows",
    permissionKind: WINDOWS_SURFACE,
    acceptAvailable: false,
    denyAvailable: true,
    checkboxPresent: true,
    checkboxChecked: false,
    checkboxClickable: false,
    cowork: true,
    desktop: true,
    blade: "fallen",
    commenter: WINDOWS_COMMENTER,
    commentAt: WINDOWS_COMMENT_AT,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      acceptAvailable: false,
      denyAvailable: false,
      acceptMissing: false,
      checkboxPresent: false,
      checkboxChecked: false,
      checkboxClickable: false,
      autoAllowSet: false,
      priorApprovalsSet: false,
      autoAllowHonored: false,
      hangWaiting: false,
      hangHours: 0,
      platform: null,
      permissionKind: null,
      backgroundMode: false,
      scheduledTask: false,
      cowork: false,
      desktop: false,
      scaffold: false,
      blade: null,
      event: null,
      t: null,
    };
  }
  const acceptAvailable =
    raw.acceptAvailable === true || raw.acceptVisible === true;
  const denyAvailable = raw.denyAvailable === true || raw.denyVisible === true;
  const acceptMissing =
    raw.acceptMissing === true ||
    raw.acceptAvailable === false ||
    raw.acceptVisible === false;
  return {
    acceptAvailable,
    denyAvailable,
    acceptMissing: acceptMissing && !acceptAvailable,
    checkboxPresent:
      raw.checkboxPresent === true || raw.checkboxDead === true,
    checkboxChecked: raw.checkboxChecked === true,
    checkboxClickable: raw.checkboxClickable === true,
    autoAllowSet:
      raw.autoAllowSet === true || raw.autoAllow === true,
    priorApprovalsSet: raw.priorApprovalsSet === true,
    autoAllowHonored: raw.autoAllowHonored === true,
    hangWaiting: raw.hangWaiting === true,
    hangHours: Number(raw.hangHours || 0),
    platform: raw.platform || null,
    permissionKind: raw.permissionKind || raw.surface || null,
    backgroundMode: raw.backgroundMode === true,
    scheduledTask: raw.scheduledTask === true,
    cowork: raw.cowork === true,
    desktop: raw.desktop === true,
    scaffold: raw.scaffold === true,
    blade: raw.blade || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.acceptAvailable != null ||
        ticket.acceptVisible != null ||
        ticket.denyAvailable != null ||
        ticket.acceptMissing != null ||
        ticket.checkboxClickable != null ||
        ticket.checkboxPresent != null ||
        ticket.autoAllowSet != null ||
        ticket.hangWaiting != null ||
        ticket.scaffold != null ||
        ticket.blade != null ||
        ticket.permissionKind != null ||
        ticket.event),
  );
}

function isRaised(row) {
  if (row.scaffold) return false;
  if (row.blade === "fallen") return false;
  if (row.acceptMissing && !row.acceptAvailable) return false;
  return row.acceptAvailable === true && row.denyAvailable === true;
}

function isFallen(row) {
  if (row.scaffold && !row.acceptAvailable) return false;
  if (row.blade === "fallen") return true;
  if (row.acceptAvailable === false && row.denyAvailable === true) return true;
  if (row.acceptMissing && row.denyAvailable) return true;
  return false;
}

function isScaffold(row) {
  return row.scaffold === true && !isRaised(row);
}

function isCheckboxDead(row) {
  return (
    row.checkboxPresent &&
    row.checkboxChecked === false &&
    row.checkboxClickable === false &&
    !row.acceptAvailable
  );
}

/**
 * Score one permission seating against the guillotine booth.
 * raised: Accept + Deny both available; blade held up.
 * fallen: Deny-only; no Accept; blade has already fallen.
 * scaffold: named path — the permission scaffold offers only Deny.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isScaffold(row)) {
    verdict = "scaffold";
  } else if (isFallen(row)) {
    verdict = "fallen";
  } else if (isRaised(row)) {
    verdict = "raised";
  } else if (row.denyAvailable && !row.acceptAvailable) {
    verdict = "fallen";
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
    raised: verdict === "raised",
    fallen: verdict === "fallen" || verdict === SEEDED_WORD,
    scaffold: verdict === "scaffold" || verdict === PATH_WORD,
    acceptAvailable: row.acceptAvailable,
    denyAvailable: row.denyAvailable,
    acceptMissing: row.acceptMissing,
    checkboxPresent: row.checkboxPresent,
    checkboxChecked: row.checkboxChecked,
    checkboxClickable: row.checkboxClickable,
    checkboxDead: isCheckboxDead(row),
    autoAllowSet: row.autoAllowSet,
    priorApprovalsSet: row.priorApprovalsSet,
    autoAllowHonored: row.autoAllowHonored,
    hangWaiting: row.hangWaiting,
    hangHours: row.hangHours,
    platform: row.platform,
    permissionKind: row.permissionKind,
    backgroundMode: row.backgroundMode,
    scheduledTask: row.scheduledTask,
    cowork: row.cowork,
    desktop: row.desktop,
    blade: hold ? "raised" : "fallen",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit raised" : "score fallen",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : GUILLOTINE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const fallen = scored.filter((row) => row.verdict === "fallen");
  const scaffold = scored.filter((row) => row.verdict === "scaffold");
  const raised = scored.filter((row) => row.verdict === "raised");
  const headline =
    scored.find((row) => row.event === "deny-only") ||
    scored.find((row) => row.event === "mac-messages-perm") ||
    scored.find((row) => row.event === "scaffold") ||
    fallen[fallen.length - 1];
  let verdict = "raised";
  if (fallen.length) verdict = "fallen";
  else if (scaffold.length && !raised.length) verdict = "scaffold";
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
    fallenCount: fallen.length,
    scaffoldCount: scaffold.length,
    raisedCount: raised.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit raised" : "score fallen",
    note: headline
      ? "background-mode permission dialog shows only a Deny button, no way to Accept; Windows computer_request_access has an unclickable unchecked checkbox and only Deny"
      : "published guillotine walk scored against raised vs fallen",
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
    seeded !== "raised" &&
    seeded !== "fallen" &&
    seeded !== "scaffold" &&
    ticket.acceptAvailable == null &&
    ticket.denyAvailable == null &&
    ticket.acceptMissing == null &&
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
    acceptAvailable: scored.acceptAvailable ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.acceptAvailable ? "accept=present" : "accept=missing",
    result.denyAvailable ? "deny=present" : "deny=missing",
    result.checkboxDead ? "checkbox=dead" : "checkbox=ok",
    result.blade === "raised" ? "blade=raised" : "blade=fallen",
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
      reporter: REPORTER,
      filedAt: FILED_AT,
      product: PRODUCT,
      version: VERSION,
      platform: PLATFORM,
      model: MODEL,
      regression: REGRESSION,
      autoAllowAlreadySet: AUTO_ALLOW_ALREADY_SET,
      priorApprovalsAlreadySet: PRIOR_APPROVALS_ALREADY_SET,
      hangHours: HANG_HOURS,
      windowsCommenter: WINDOWS_COMMENTER,
      windowsCommentAt: WINDOWS_COMMENT_AT,
      windowsSurface: WINDOWS_SURFACE,
      macSurface: MAC_SURFACE,
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "background-mode permission dialog keeps Accept + Deny both available",
        "operator can grant messages / computer_request_access",
        "checkbox on computer_request_access is clickable",
        "auto-allow and prior approvals are not the only grant path",
      ],
      hypothesis:
        "background-mode permission UI may render a Deny-only card when the grant path for messages/computer_request_access is missing an Accept action / dead checkbox, leaving the session blocked",
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
