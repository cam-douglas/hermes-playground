#!/usr/bin/env node
/**
 * Diplopia — ophthalmology diplopia / double-vision acuity booth.
 *
 * Educational diagnostic model for a published Remote Control defect:
 * an environment picker should keep subdirectory rooms DISTINCT from
 * the repo-root room (web and mobile both label so root vs subdirectory
 * are distinguishable). Instead the rooms are CONFLATED — web labels
 * solely from git_repo_url basename, so a subdirectory env and the
 * root env both render as identical "monorepo" + identical machine
 * subtitle, while mobile names by directory and stays distinguishable.
 *
 *   node diplopia.mjs data/conflated.json
 *   echo '{"seed":"conflated"}' | node diplopia.mjs
 *
 * Idle word is distinct (HOLD: web and mobile both label environments
 * so root vs subdirectory are distinguishable — e.g. prefer directory
 * basename or disambiguate with directory/branch when git_repo_url
 * collides on the same machine).
 * Seeded word is conflated (#93012: web labels solely from
 * git_repo_url basename → subdirectory env and root env both render
 * as identical "monorepo" + identical machine subtitle; both entries
 * live/healthy).
 * Path word is diplopic (an environment picker that paints two live
 * Remote Control rooms with the same name is not distinct — it is
 * conflated double vision).
 *
 * Encoded from anthropics/claude-code#93012 issue body only.
 * Hypothesis (NON-BINDING): web may derive the picker label from
 * git_repo_url basename while mobile uses directory basename, and the
 * bridge registration omits an explicit environment name — so
 * subdirectory environments collide on web. Verify against #93012
 * text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "distinct",
  "conflated",
  "diplopic",
  "hold",
  "web-from-git-repo-url",
  "mobile-from-directory",
  "subdirectory-collision",
  "no-name-field",
  "name-flag-session-only",
  "live-not-stale",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "distinct";
export const PATH_WORD = "diplopic";
export const SEEDED_WORD = "conflated";
export const HOLD = Object.freeze(["distinct", "hold"]);
export const RECOVER = Object.freeze(["distinct", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "distinct" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "held",
  "raised",
  "fallen",
  "scaffold",
  "lodged",
  "bypassed",
  "cutaway",
  "sterling",
  "debased",
  "rubbed",
  "primed",
  "flashed",
  "flashpanned",
  "greenroomed",
  "steered",
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
  FORBIDDEN_IDLE.filter((name) => name !== "conflated"),
);

export const FEATURED_ISSUE = 93012;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93012";
export const TITLE =
  "[BUG] Remote Control: web and mobile derive the environment label from different payload fields, producing indistinguishable duplicates for subdirectory environments";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:claude-code-web",
]);
export const REPORTER = "michaelcopeland";
export const FILED_AT = "2026-09-09T06:23:15Z";
export const PRODUCT = "Claude Code Remote Control";
export const VERSION = "2.1.266";
export const PLATFORM = "linux";
export const BRIDGE_PATH = "/v1/environments/bridge";
export const BRIDGE_METHOD = "POST";
export const WORKER_TYPE = "claude_code";
export const MAX_SESSIONS = 32;
export const WEB_SESSIONS = "3/32";
export const MOBILE_OR_PEER_SESSIONS = "1/32";
export const PHRASE =
  "an environment picker that paints two live Remote Control rooms with the same name is not distinct — it is conflated double vision. Score conflated or admit distinct.";

export const BRIDGE_FIELDS = Object.freeze([
  "machine_name",
  "machine_id",
  "directory",
  "branch",
  "git_repo_url",
  "max_sessions",
  "metadata.worker_type",
]);
export const BRIDGE_HAS_NAME = false;

export const COLLISION_TABLE = Object.freeze([
  {
    cwd: "projects/alpha",
    directoryBasename: "alpha",
    gitRepoUrlBasename: "alpha",
    webShows: "alpha",
    mobileShows: "alpha",
    agree: true,
  },
  {
    cwd: "projects/beta",
    directoryBasename: "beta",
    gitRepoUrlBasename: "beta",
    webShows: "beta",
    mobileShows: "beta",
    agree: true,
  },
  {
    cwd: "projects/monorepo",
    directoryBasename: "monorepo",
    gitRepoUrlBasename: "monorepo",
    webShows: "monorepo",
    mobileShows: "monorepo",
    agree: true,
  },
  {
    cwd: "projects/monorepo/subproject",
    directoryBasename: "subproject",
    gitRepoUrlBasename: "monorepo",
    webShows: "monorepo",
    mobileShows: "subproject",
    agree: false,
    webWrong: true,
    mobileOk: true,
  },
]);

export const COUSINS = Object.freeze([
  {
    issue: 77372,
    title: "stale environments cannot be deleted",
    state: "OPEN",
    citeOnly: true,
    why: "same visible symptom (indistinguishable picker entries) but a different cause — stale registration, not live subdirectory collision; cite only; do not clone",
  },
  {
    issue: 88939,
    title: "configurable peer-registration session name",
    state: "OPEN",
    citeOnly: true,
    why: "adjacent motivation, different subsystem (cross-session messaging, not the environment registration); cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "quill",
  "colophon",
  "sallyport",
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
  "afterimage",
  "diopter",
]);

/**
 * Published diplopia walk from #93012 only. Facts from the issue body.
 * A distinct picker labels root vs subdirectory so they stay
 * distinguishable. A conflated picker paints two live rooms as
 * "monorepo".
 */
export const DIPLOPIA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-distinct",
    webLabelFrom: "directory",
    mobileLabelFrom: "directory",
    webLabelsUnique: true,
    subdirectoryCollision: false,
    cue: "distinct",
    note: "idle HOLD: web and mobile both label environments so root vs subdirectory are distinguishable",
  },
  {
    t: "web",
    event: "web-from-git-repo-url",
    webLabelFrom: "git_repo_url",
    webLabel: "monorepo",
    gitRepoUrlBasename: "monorepo",
    cue: "conflated",
    note: "web labels the environment from git_repo_url basename",
  },
  {
    t: "mobile",
    event: "mobile-from-directory",
    mobileLabelFrom: "directory",
    mobileLabel: "subproject",
    directoryBasename: "subproject",
    cue: "conflated",
    note: "mobile labels the environment from directory basename",
  },
  {
    t: "collision",
    event: "subdirectory-collision",
    subdirectoryCollision: true,
    cwd: "projects/monorepo/subproject",
    directoryBasename: "subproject",
    gitRepoUrlBasename: "monorepo",
    webShows: "monorepo",
    mobileShows: "subproject",
    webLabelFrom: "git_repo_url",
    mobileLabelFrom: "directory",
    cue: "conflated",
    note: "projects/monorepo/subproject → web shows monorepo, mobile shows subproject",
  },
  {
    t: "bridge",
    event: "no-name-field",
    noNameField: true,
    bridgeHasName: false,
    cue: "conflated",
    note: "POST /v1/environments/bridge carries no name field at all",
  },
  {
    t: "name",
    event: "name-flag-session-only",
    nameFlagSessionOnly: true,
    nameSetsSessionTitle: true,
    nameSetsEnvironmentLabel: false,
    cue: "conflated",
    note: "--name sets the session title only, not the environment label",
  },
  {
    t: "live",
    event: "live-not-stale",
    liveNotStale: true,
    bothLiveHealthy: true,
    sessions: [WEB_SESSIONS, MOBILE_OR_PEER_SESSIONS],
    cue: "conflated",
    note: "both colliding entries live and healthy (3/32 and 1/32 sessions)",
  },
  {
    t: "path",
    event: "diplopic",
    diplopic: true,
    cue: "conflated",
    note: "an environment picker that paints two live rooms with the same name is not distinct",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    webLabelFrom: "directory",
    mobileLabelFrom: "directory",
    webLabelsUnique: true,
    subdirectoryCollision: false,
    noNameField: false,
    nameFlagSessionOnly: false,
    liveNotStale: false,
    bothLiveHealthy: false,
    diplopic: false,
    cue: "distinct",
  };
}

export function seedDistinct() {
  return { ...emptyTicket() };
}

export function seedConflated() {
  return {
    seed: SEEDED_WORD,
    webLabelFrom: "git_repo_url",
    mobileLabelFrom: "directory",
    webLabel: "monorepo",
    mobileLabel: "subproject",
    directoryBasename: "subproject",
    gitRepoUrlBasename: "monorepo",
    subdirectoryCollision: true,
    webShows: "monorepo",
    mobileShows: "subproject",
    noNameField: true,
    nameFlagSessionOnly: true,
    liveNotStale: true,
    bothLiveHealthy: true,
    sessions: [WEB_SESSIONS, MOBILE_OR_PEER_SESSIONS],
    cue: "conflated",
    issue: FEATURED_ISSUE,
    version: VERSION,
  };
}

export function seedDiplopic() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    diplopic: true,
    cue: "conflated",
  };
}

export function seedWebFromGitRepoUrl() {
  return {
    seed: "web-from-git-repo-url",
    webLabelFrom: "git_repo_url",
    webLabel: "monorepo",
    gitRepoUrlBasename: "monorepo",
    cue: "conflated",
  };
}

export function seedMobileFromDirectory() {
  return {
    seed: "mobile-from-directory",
    mobileLabelFrom: "directory",
    mobileLabel: "subproject",
    directoryBasename: "subproject",
    cue: "conflated",
  };
}

export function basenameFromGitRepoUrl(url) {
  const text = String(url || "").trim().replace(/\/+$/, "");
  if (!text) return "";
  const parts = text.split("/");
  return parts[parts.length - 1] || "";
}

export function basenameFromDirectory(dir) {
  const text = String(dir || "").trim().replace(/\/+$/, "");
  if (!text) return "";
  const parts = text.split("/");
  return parts[parts.length - 1] || "";
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      webLabelFrom: null,
      mobileLabelFrom: null,
      webLabel: null,
      mobileLabel: null,
      directoryBasename: null,
      gitRepoUrlBasename: null,
      subdirectoryCollision: false,
      webShows: null,
      mobileShows: null,
      webLabelsUnique: false,
      noNameField: false,
      bridgeHasName: false,
      nameFlagSessionOnly: false,
      nameSetsSessionTitle: false,
      nameSetsEnvironmentLabel: false,
      liveNotStale: false,
      bothLiveHealthy: false,
      diplopic: false,
      cue: null,
      event: null,
      t: null,
      cwd: null,
      sessions: null,
    };
  }
  const gitRepoUrlBasename =
    raw.gitRepoUrlBasename ||
    (raw.git_repo_url ? basenameFromGitRepoUrl(raw.git_repo_url) : null);
  const directoryBasename =
    raw.directoryBasename ||
    (raw.directory ? basenameFromDirectory(raw.directory) : null);
  return {
    webLabelFrom: raw.webLabelFrom || raw.webFrom || null,
    mobileLabelFrom: raw.mobileLabelFrom || raw.mobileFrom || null,
    webLabel: raw.webLabel || raw.webShows || null,
    mobileLabel: raw.mobileLabel || raw.mobileShows || null,
    directoryBasename,
    gitRepoUrlBasename,
    subdirectoryCollision:
      raw.subdirectoryCollision === true || raw.collision === true,
    webShows: raw.webShows || raw.webLabel || null,
    mobileShows: raw.mobileShows || raw.mobileLabel || null,
    webLabelsUnique: raw.webLabelsUnique === true,
    noNameField: raw.noNameField === true || raw.bridgeHasName === false,
    bridgeHasName: raw.bridgeHasName === true,
    nameFlagSessionOnly:
      raw.nameFlagSessionOnly === true ||
      (raw.nameSetsSessionTitle === true &&
        raw.nameSetsEnvironmentLabel === false),
    nameSetsSessionTitle: raw.nameSetsSessionTitle === true,
    nameSetsEnvironmentLabel: raw.nameSetsEnvironmentLabel === true,
    liveNotStale: raw.liveNotStale === true || raw.bothLiveHealthy === true,
    bothLiveHealthy: raw.bothLiveHealthy === true,
    diplopic: raw.diplopic === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    cwd: raw.cwd || raw.directory || null,
    sessions: Array.isArray(raw.sessions) ? raw.sessions : null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.webLabelFrom != null ||
        ticket.mobileLabelFrom != null ||
        ticket.subdirectoryCollision != null ||
        ticket.noNameField != null ||
        ticket.nameFlagSessionOnly != null ||
        ticket.liveNotStale != null ||
        ticket.bothLiveHealthy != null ||
        ticket.diplopic != null ||
        ticket.cue != null ||
        ticket.webLabel != null ||
        ticket.mobileLabel != null ||
        ticket.event),
  );
}

function isDistinct(row) {
  if (row.diplopic) return false;
  if (row.cue === "conflated") return false;
  if (row.subdirectoryCollision && row.webLabelFrom === "git_repo_url") {
    return false;
  }
  if (
    row.webLabelFrom === "directory" &&
    row.mobileLabelFrom === "directory" &&
    !row.subdirectoryCollision
  ) {
    return true;
  }
  if (row.webLabelsUnique === true && !row.subdirectoryCollision) {
    return true;
  }
  if (row.cue === "distinct" && row.subdirectoryCollision !== true) {
    return true;
  }
  return false;
}

function isConflated(row) {
  if (row.diplopic && row.cue !== "distinct") return false;
  if (row.cue === "conflated") return true;
  if (
    row.webLabelFrom === "git_repo_url" &&
    row.subdirectoryCollision &&
    (row.webShows === row.gitRepoUrlBasename || row.webLabel === "monorepo")
  ) {
    return true;
  }
  if (
    row.webLabelFrom === "git_repo_url" &&
    row.mobileLabelFrom === "directory" &&
    row.webLabel &&
    row.mobileLabel &&
    row.webLabel !== row.mobileLabel
  ) {
    return true;
  }
  if (row.noNameField && row.subdirectoryCollision) return true;
  if (row.liveNotStale && row.subdirectoryCollision) return true;
  return false;
}

function isDiplopic(row) {
  return row.diplopic === true && !isDistinct(row);
}

/**
 * Score one Remote Control seating against the diplopia booth.
 * distinct: web and mobile label so root vs subdirectory stay distinguishable.
 * conflated: web labels from git_repo_url; subdirectory env collides as "monorepo".
 * diplopic: named path — two live rooms painted with the same name.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isDiplopic(row)) {
    verdict = "diplopic";
  } else if (isConflated(row)) {
    verdict = "conflated";
  } else if (isDistinct(row)) {
    verdict = "distinct";
  } else if (
    row.webLabelFrom === "git_repo_url" ||
    row.subdirectoryCollision ||
    row.noNameField ||
    row.nameFlagSessionOnly ||
    row.liveNotStale
  ) {
    verdict = "conflated";
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
    distinct: verdict === "distinct",
    conflated: verdict === "conflated" || verdict === SEEDED_WORD,
    diplopic: verdict === "diplopic" || verdict === PATH_WORD,
    webLabelFrom: row.webLabelFrom,
    mobileLabelFrom: row.mobileLabelFrom,
    webLabel: row.webLabel,
    mobileLabel: row.mobileLabel,
    directoryBasename: row.directoryBasename,
    gitRepoUrlBasename: row.gitRepoUrlBasename,
    subdirectoryCollision: row.subdirectoryCollision,
    webShows: row.webShows,
    mobileShows: row.mobileShows,
    noNameField: row.noNameField,
    nameFlagSessionOnly: row.nameFlagSessionOnly,
    liveNotStale: row.liveNotStale,
    bothLiveHealthy: row.bothLiveHealthy,
    cue: hold ? "distinct" : "conflated",
    event: row.event,
    t: row.t,
    cwd: row.cwd,
    sessions: row.sessions,
    phrase: hold ? "admit distinct" : "score conflated",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : DIPLOPIA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const conflated = scored.filter((row) => row.verdict === "conflated");
  const diplopic = scored.filter((row) => row.verdict === "diplopic");
  const distinct = scored.filter((row) => row.verdict === "distinct");
  const headline =
    scored.find((row) => row.event === "subdirectory-collision") ||
    scored.find((row) => row.event === "web-from-git-repo-url") ||
    scored.find((row) => row.event === "diplopic") ||
    conflated[conflated.length - 1];
  let verdict = "distinct";
  if (conflated.length) verdict = "conflated";
  else if (diplopic.length && !distinct.length) verdict = "diplopic";
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
    conflatedCount: conflated.length,
    diplopicCount: diplopic.length,
    distinctCount: distinct.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit distinct" : "score conflated",
    note: headline
      ? "web and mobile derive the environment label from different payload fields; subdirectory environments collide on web"
      : "published diplopia walk scored against distinct vs conflated",
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
    seeded !== "distinct" &&
    seeded !== "conflated" &&
    seeded !== "diplopic" &&
    ticket.webLabelFrom == null &&
    ticket.subdirectoryCollision == null &&
    ticket.noNameField == null &&
    ticket.nameFlagSessionOnly == null &&
    ticket.liveNotStale == null &&
    ticket.diplopic == null &&
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
    webLabelFrom: scored.webLabelFrom ?? null,
    subdirectoryCollision: scored.subdirectoryCollision ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.webLabelFrom === "directory" ? "web=directory" : "web=git_repo_url",
    result.mobileLabelFrom === "git_repo_url"
      ? "mobile=git_repo_url"
      : "mobile=directory",
    result.subdirectoryCollision ? "collision=subdirectory" : "collision=none",
    result.cue === "distinct" ? "cue=distinct" : "cue=conflated",
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
      bridgePath: BRIDGE_PATH,
      bridgeMethod: BRIDGE_METHOD,
      bridgeFields: [...BRIDGE_FIELDS],
      bridgeHasName: BRIDGE_HAS_NAME,
      workerType: WORKER_TYPE,
      maxSessions: MAX_SESSIONS,
      sessions: [WEB_SESSIONS, MOBILE_OR_PEER_SESSIONS],
      collisionTable: COLLISION_TABLE.map((row) => row.cwd),
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "Consistent labelling across web and mobile",
        "subdirectory environments distinguishable from the repo-root environment",
        "web falls back to or disambiguates with directory when git_repo_url collides on the same machine",
        "directory or branch shown as picker subtitle alongside machine_name",
        "--name does not become the environment label; an explicit environment name would",
      ],
      hypothesis:
        "web may derive the picker label from git_repo_url basename while mobile uses directory basename, and the bridge registration omits an explicit environment name — so subdirectory environments collide on web",
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
