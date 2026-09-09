#!/usr/bin/env node
/**
 * Stereotype — letterpress / stereotype-plate foundry booth.
 *
 * Educational diagnostic model for a published Claude Code plugins defect:
 * a plugin update should keep installed plugin content FRESH (aligned to
 * the marketplace clone HEAD / pinned sha, not only the version string).
 * Instead the plate is STAMPED — `claude plugin update` and autoUpdate
 * compare only `plugin.json` version, report "already at the latest
 * version (0.1.0)", and never refresh content when authors ship commits
 * without bumping version.
 *
 *   node stereotype.mjs data/stamped.json
 *   echo '{"seed":"stamped"}' | node stereotype.mjs
 *
 * Idle word is fresh (HOLD: freshness against resolved source —
 * github/git installed commit vs marketplace clone HEAD; url+sha vs
 * pin — or at minimum `claude plugin update --force`).
 * Seeded word is stamped (#93108: version-string-only compare; cache
 * months behind marketplace HEAD e8f4120; autoUpdate:true never
 * re-pulled; only uninstall+reinstall works).
 * Path word is stereotype (a plugin update that only compares the
 * version string is not fresh — it is a stereotype).
 *
 * Encoded from anthropics/claude-code#93108 issue body only.
 * Hypothesis (NON-BINDING): plugin update / marketplace auto-update
 * may decide freshness by comparing the plugin.json version string
 * alone and never look at the resolved source commit, so content that
 * ships without a version bump stays stamped in the install cache.
 * Verify against #93108 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "fresh",
  "stamped",
  "stereotype",
  "hold",
  "version-only",
  "marketplace-head",
  "auto-update-true",
  "uninstall-reinstall",
  "pinned-sha",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "fresh";
export const PATH_WORD = "stereotype";
export const SEEDED_WORD = "stamped";
export const HOLD = Object.freeze(["fresh", "hold"]);
export const RECOVER = Object.freeze(["fresh", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "fresh" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "cleared",
  "distinct",
  "held",
  "raised",
  "sterling",
  "primed",
  "lodged",
  "mounded",
  "conflated",
  "steered",
  "fallen",
  "debased",
  "flashed",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
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
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "stamped"),
);

export const FEATURED_ISSUE = 93108;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93108";
export const TITLE =
  "[BUG] plugin update / auto-update compare only the version string, so plugins that ship new content without bumping version never refresh";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:plugins",
]);
export const PLUGIN = "langsmith-skills@langsmith-skills";
export const MARKETPLACE = "langchain-ai/langsmith-skills";
export const PLUGIN_VERSION = "0.1.0";
export const VERSION_SINCE = "2026-03-10";
export const SKILLS_COMMITS = 5;
export const MARKETPLACE_HEAD = "e8f4120";
export const HEAD_DATE = "2026-08-17";
export const SKILL_REWRITTEN = "langsmith-evaluator";
export const CACHE_OBSERVED = "2026-08-24";
export const CACHE_MONTHS_BEHIND = 4;
export const ALREADY_LATEST =
  "already at the latest version (0.1.0)";
export const AUTO_UPDATE_FILE = "known_marketplaces.json";
export const WORKAROUND = "uninstall then install";
export const PINNED_EXAMPLES = Object.freeze(["superpowers", "firecrawl"]);
export const PHRASE =
  "a plugin update that only compares the version string is not fresh — it is a stereotype. Score stamped or admit fresh.";

export const FINGERPRINT_LINES = Object.freeze([
  "already at the latest version (0.1.0)",
  "version string alone",
  "never look at the resolved source commit",
  "autoUpdate: true",
  "uninstall then install",
]);

export const COUSINS = Object.freeze([
  {
    issue: 86194,
    title:
      "plugin update leaves gitCommitSha stale for url-source marketplace entries",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "same comparison family — gitCommitSha in installed_plugins.json is unreliable, so pinned-sha staleness could not be independently verified; consequence of the same logic, not a separately verified repro; cite only; do not clone",
  },
  {
    issue: 91271,
    title: "Second marketplace add of same marketplace drops autoUpdate",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "autoUpdate flag dropped on a second add of the same marketplace, not version-string-only freshness; cite only; do not clone",
  },
  {
    issue: 86139,
    title:
      "marketplace auto-update silently disabled on non-native Homebrew installs despite autoUpdate:true",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "autoUpdate silently disabled on non-native Homebrew, not a version-string-only compare that skips HEAD; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "homestead",
  "shibboleth",
  "recension",
  "epitaph",
]);

/**
 * Published stereotype walk from #93108 only. Facts from the issue body.
 * A fresh plate aligns installed content to marketplace HEAD / pin.
 * A stamped plate reports already-latest from the version string alone.
 */
export const STEREOTYPE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-fresh",
    versionMatch: true,
    contentAligned: true,
    compareVersionOnly: false,
    marketplaceHeadMoved: false,
    cacheStale: false,
    reportsAlreadyLatest: false,
    cue: "fresh",
    note: "idle HOLD: freshness against resolved source; installed content aligned to marketplace clone HEAD / pinned sha",
  },
  {
    t: "compare",
    event: "version-only",
    compareVersionOnly: true,
    versionMatch: true,
    pluginVersion: PLUGIN_VERSION,
    cue: "stamped",
    note: "claude plugin update and auto-update decide freshness by comparing the version string alone",
  },
  {
    t: "head",
    event: "marketplace-head",
    marketplaceHead: MARKETPLACE_HEAD,
    marketplaceHeadMoved: true,
    headDate: HEAD_DATE,
    skillsCommits: SKILLS_COMMITS,
    skillRewritten: SKILL_REWRITTEN,
    cue: "stamped",
    note: "marketplace clone HEAD e8f4120 on 2026-08-17 rewrote langsmith-evaluator; five commits touching config/skills/",
  },
  {
    t: "auto",
    event: "auto-update-true",
    autoUpdateTrue: true,
    autoUpdatePulled: false,
    autoUpdateFile: AUTO_UPDATE_FILE,
    cue: "stamped",
    note: "marketplace entry had autoUpdate: true in known_marketplaces.json; auto-update never re-pulled",
  },
  {
    t: "stamp",
    event: "stamped",
    versionMatch: true,
    contentAligned: false,
    cacheStale: true,
    cacheObserved: CACHE_OBSERVED,
    cacheMonthsBehind: CACHE_MONTHS_BEHIND,
    reportsAlreadyLatest: true,
    alreadyLatest: ALREADY_LATEST,
    cue: "stamped",
    note: "on 2026-08-24 installed plugin cache still original install content, four months behind; already at the latest version (0.1.0)",
  },
  {
    t: "pin",
    event: "pinned-sha",
    pinnedShaMoved: true,
    versionMatch: true,
    reportsAlreadyLatest: true,
    independentlyVerified: false,
    pinnedExamples: [...PINNED_EXAMPLES],
    cue: "stamped",
    note: "same comparison affects official marketplace source:{url,sha} pins (superpowers, firecrawl); gitCommitSha unreliable (#86194) — consequence, not independently verified",
  },
  {
    t: "workaround",
    event: "uninstall-reinstall",
    uninstallReinstallOnly: true,
    workaround: WORKAROUND,
    cue: "stamped",
    note: "only workaround: uninstall then install",
  },
  {
    t: "path",
    event: "stereotype",
    stereotype: true,
    cue: "stamped",
    note: "a plugin update that only compares the version string is not fresh — it is a stereotype",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    versionMatch: true,
    contentAligned: true,
    compareVersionOnly: false,
    marketplaceHeadMoved: false,
    autoUpdateTrue: false,
    autoUpdatePulled: true,
    cacheStale: false,
    reportsAlreadyLatest: false,
    pinnedShaMoved: false,
    uninstallReinstallOnly: false,
    stereotype: false,
    cue: "fresh",
  };
}

export function seedFresh() {
  return { ...emptyTicket() };
}

export function seedStamped() {
  return {
    seed: SEEDED_WORD,
    versionMatch: true,
    pluginVersion: PLUGIN_VERSION,
    versionSince: VERSION_SINCE,
    contentAligned: false,
    compareVersionOnly: true,
    marketplaceHead: MARKETPLACE_HEAD,
    marketplaceHeadMoved: true,
    headDate: HEAD_DATE,
    skillsCommits: SKILLS_COMMITS,
    skillRewritten: SKILL_REWRITTEN,
    cacheStale: true,
    cacheObserved: CACHE_OBSERVED,
    cacheMonthsBehind: CACHE_MONTHS_BEHIND,
    reportsAlreadyLatest: true,
    alreadyLatest: ALREADY_LATEST,
    autoUpdateTrue: true,
    autoUpdatePulled: false,
    plugin: PLUGIN,
    marketplace: MARKETPLACE,
    cue: "stamped",
    issue: FEATURED_ISSUE,
  };
}

export function seedStereotype() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    stereotype: true,
    cue: "stamped",
  };
}

export function seedVersionOnly() {
  return {
    seed: "version-only",
    compareVersionOnly: true,
    versionMatch: true,
    pluginVersion: PLUGIN_VERSION,
    cue: "stamped",
  };
}

export function seedMarketplaceHead() {
  return {
    seed: "marketplace-head",
    marketplaceHead: MARKETPLACE_HEAD,
    marketplaceHeadMoved: true,
    headDate: HEAD_DATE,
    skillsCommits: SKILLS_COMMITS,
    cue: "stamped",
  };
}

export function seedAutoUpdateTrue() {
  return {
    seed: "auto-update-true",
    autoUpdateTrue: true,
    autoUpdatePulled: false,
    autoUpdateFile: AUTO_UPDATE_FILE,
    cue: "stamped",
  };
}

export function seedUninstallReinstall() {
  return {
    seed: "uninstall-reinstall",
    uninstallReinstallOnly: true,
    workaround: WORKAROUND,
    cue: "stamped",
  };
}

export function seedPinnedSha() {
  return {
    seed: "pinned-sha",
    pinnedShaMoved: true,
    versionMatch: true,
    reportsAlreadyLatest: true,
    independentlyVerified: false,
    pinnedExamples: [...PINNED_EXAMPLES],
    cue: "stamped",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      versionMatch: false,
      contentAligned: false,
      compareVersionOnly: false,
      marketplaceHeadMoved: false,
      autoUpdateTrue: false,
      autoUpdatePulled: false,
      cacheStale: false,
      reportsAlreadyLatest: false,
      pinnedShaMoved: false,
      uninstallReinstallOnly: false,
      stereotype: false,
      independentlyVerified: null,
      pluginVersion: null,
      versionSince: null,
      marketplaceHead: null,
      headDate: null,
      skillsCommits: null,
      skillRewritten: null,
      cacheObserved: null,
      cacheMonthsBehind: null,
      alreadyLatest: null,
      autoUpdateFile: null,
      workaround: null,
      plugin: null,
      marketplace: null,
      pinnedExamples: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    versionMatch: raw.versionMatch === true,
    contentAligned: raw.contentAligned === true,
    compareVersionOnly: raw.compareVersionOnly === true,
    marketplaceHeadMoved: raw.marketplaceHeadMoved === true,
    autoUpdateTrue: raw.autoUpdateTrue === true,
    autoUpdatePulled: raw.autoUpdatePulled === true,
    cacheStale: raw.cacheStale === true,
    reportsAlreadyLatest: raw.reportsAlreadyLatest === true,
    pinnedShaMoved: raw.pinnedShaMoved === true,
    uninstallReinstallOnly: raw.uninstallReinstallOnly === true,
    stereotype: raw.stereotype === true,
    independentlyVerified:
      raw.independentlyVerified === true
        ? true
        : raw.independentlyVerified === false
          ? false
          : null,
    pluginVersion: raw.pluginVersion || raw.version || null,
    versionSince: raw.versionSince || null,
    marketplaceHead: raw.marketplaceHead || null,
    headDate: raw.headDate || null,
    skillsCommits: raw.skillsCommits ?? raw.commitsTouchingSkills ?? null,
    skillRewritten: raw.skillRewritten || null,
    cacheObserved: raw.cacheObserved || null,
    cacheMonthsBehind: raw.cacheMonthsBehind ?? null,
    alreadyLatest: raw.alreadyLatest || raw.alreadyLatestMessage || null,
    autoUpdateFile: raw.autoUpdateFile || null,
    workaround: raw.workaround || null,
    plugin: raw.plugin || null,
    marketplace: raw.marketplace || null,
    pinnedExamples: Array.isArray(raw.pinnedExamples)
      ? raw.pinnedExamples
      : null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.versionMatch != null ||
        ticket.contentAligned != null ||
        ticket.compareVersionOnly != null ||
        ticket.marketplaceHeadMoved != null ||
        ticket.autoUpdateTrue != null ||
        ticket.autoUpdatePulled != null ||
        ticket.cacheStale != null ||
        ticket.reportsAlreadyLatest != null ||
        ticket.pinnedShaMoved != null ||
        ticket.uninstallReinstallOnly != null ||
        ticket.stereotype != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.marketplaceHead != null ||
        ticket.cacheMonthsBehind != null),
  );
}

function isFresh(row) {
  if (row.stereotype) return false;
  if (row.cue === "stamped") return false;
  if (row.cacheStale) return false;
  if (row.reportsAlreadyLatest && row.marketplaceHeadMoved) return false;
  if (row.compareVersionOnly && row.marketplaceHeadMoved && !row.contentAligned) {
    return false;
  }
  if (
    row.contentAligned === true &&
    row.cacheStale !== true &&
    row.cue !== "stamped"
  ) {
    return true;
  }
  if (row.cue === "fresh" && row.cacheStale !== true) {
    return true;
  }
  return false;
}

function isStamped(row) {
  if (row.stereotype && row.cue !== "fresh") return false;
  if (row.cue === "stamped") return true;
  if (row.versionMatch && row.contentAligned === false) return true;
  if (row.compareVersionOnly && row.marketplaceHeadMoved) return true;
  if (row.reportsAlreadyLatest && (row.cacheStale || row.marketplaceHeadMoved)) {
    return true;
  }
  if (row.autoUpdateTrue && row.autoUpdatePulled === false && row.versionMatch) {
    return true;
  }
  return false;
}

function isStereotypePath(row) {
  return row.stereotype === true && !isFresh(row);
}

/**
 * Score one plugin-update freshness pass against the stereotype booth.
 * fresh: installed content aligned to marketplace HEAD / pinned sha.
 * stamped: version string matches; content stays original; already-latest.
 * stereotype: named path — version-string-only compare is not fresh.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isStereotypePath(row)) {
    verdict = "stereotype";
  } else if (isStamped(row)) {
    verdict = "stamped";
  } else if (isFresh(row)) {
    verdict = "fresh";
  } else if (
    row.compareVersionOnly ||
    row.marketplaceHeadMoved ||
    row.cacheStale ||
    row.reportsAlreadyLatest ||
    (row.autoUpdateTrue && row.autoUpdatePulled === false) ||
    row.pinnedShaMoved ||
    row.uninstallReinstallOnly
  ) {
    verdict = "stamped";
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
    fresh: verdict === "fresh",
    stamped: verdict === "stamped" || verdict === SEEDED_WORD,
    stereotype: verdict === "stereotype" || verdict === PATH_WORD,
    versionMatch: row.versionMatch,
    contentAligned: row.contentAligned,
    compareVersionOnly: row.compareVersionOnly,
    marketplaceHeadMoved: row.marketplaceHeadMoved,
    autoUpdateTrue: row.autoUpdateTrue,
    autoUpdatePulled: row.autoUpdatePulled,
    cacheStale: row.cacheStale,
    reportsAlreadyLatest: row.reportsAlreadyLatest,
    pinnedShaMoved: row.pinnedShaMoved,
    uninstallReinstallOnly: row.uninstallReinstallOnly,
    independentlyVerified: row.independentlyVerified,
    pluginVersion: row.pluginVersion,
    versionSince: row.versionSince,
    marketplaceHead: row.marketplaceHead,
    headDate: row.headDate,
    skillsCommits: row.skillsCommits,
    skillRewritten: row.skillRewritten,
    cacheObserved: row.cacheObserved,
    cacheMonthsBehind: row.cacheMonthsBehind,
    alreadyLatest: row.alreadyLatest,
    autoUpdateFile: row.autoUpdateFile,
    workaround: row.workaround,
    plugin: row.plugin,
    marketplace: row.marketplace,
    pinnedExamples: row.pinnedExamples,
    cue: hold ? "fresh" : "stamped",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit fresh" : "score stamped",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : STEREOTYPE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const stamped = scored.filter((row) => row.verdict === "stamped");
  const stereotype = scored.filter((row) => row.verdict === "stereotype");
  const fresh = scored.filter((row) => row.verdict === "fresh");
  const headline =
    scored.find((row) => row.event === "stamped") ||
    scored.find((row) => row.event === "version-only") ||
    scored.find((row) => row.event === "stereotype") ||
    stamped[stamped.length - 1];
  let verdict = "fresh";
  if (stamped.length) verdict = "stamped";
  else if (stereotype.length && !fresh.length) verdict = "stereotype";
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
    stampedCount: stamped.length,
    stereotypeCount: stereotype.length,
    freshCount: fresh.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit fresh" : "score stamped",
    note: headline
      ? "claude plugin update and auto-update compare only the version string; marketplace HEAD moved; cache stays original; already at the latest version (0.1.0)"
      : "published stereotype walk scored against fresh vs stamped",
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
    seeded !== "fresh" &&
    seeded !== "stamped" &&
    seeded !== "stereotype" &&
    ticket.compareVersionOnly == null &&
    ticket.marketplaceHeadMoved == null &&
    ticket.cacheStale == null &&
    ticket.reportsAlreadyLatest == null &&
    ticket.autoUpdateTrue == null &&
    ticket.pinnedShaMoved == null &&
    ticket.uninstallReinstallOnly == null &&
    ticket.stereotype == null &&
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
    compareVersionOnly: scored.compareVersionOnly ?? false,
    marketplaceHeadMoved: scored.marketplaceHeadMoved ?? false,
    cacheStale: scored.cacheStale ?? false,
    reportsAlreadyLatest: scored.reportsAlreadyLatest ?? false,
    autoUpdateTrue: scored.autoUpdateTrue ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.compareVersionOnly ? "compare=version-only" : "compare=source",
    result.marketplaceHeadMoved ? "head=moved" : "head=aligned",
    result.cacheStale ? "cache=stale" : "cache=fresh",
    result.cue === "fresh" ? "cue=fresh" : "cue=stamped",
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
      plugin: PLUGIN,
      marketplace: MARKETPLACE,
      pluginVersion: PLUGIN_VERSION,
      versionSince: VERSION_SINCE,
      skillsCommits: SKILLS_COMMITS,
      marketplaceHead: MARKETPLACE_HEAD,
      headDate: HEAD_DATE,
      skillRewritten: SKILL_REWRITTEN,
      cacheObserved: CACHE_OBSERVED,
      cacheMonthsBehind: CACHE_MONTHS_BEHIND,
      alreadyLatest: ALREADY_LATEST,
      autoUpdateFile: AUTO_UPDATE_FILE,
      workaround: WORKAROUND,
      pinnedExamples: [...PINNED_EXAMPLES],
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "freshness against resolved source (github/git: installed commit vs marketplace clone HEAD; url+sha: vs pin)",
        "or at minimum claude plugin update --force",
        "autoUpdate:true should apply the same resolved-source rule",
      ],
      hypothesis:
        "NON-BINDING: plugin update / marketplace auto-update may decide freshness by comparing the plugin.json version string alone and never look at the resolved source commit, so content that ships without a version bump stays stamped in the install cache",
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
