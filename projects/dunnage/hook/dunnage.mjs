/**
 * Dunnage — stevedore's dunnage crib / cargo-hold page ledger.
 *
 * RemoteTrigger action=list returns 20 routines plus has_more: true and a
 * next_cursor, but passing that next_cursor back as cursor returns HTTP 200
 * with exactly the same first page (same ids, created_at, prompts, same
 * byte size ~397 KB). There is no way to retrieve routines 21+ from
 * Claude Code. Tool description documents cursor for list_runs /
 * get_run_log; if list is intentionally not pageable, has_more /
 * next_cursor should not be returned for it.
 *
 * Encoded from anthropics/claude-code#92746 issue facts only.
 * Hypothesis (NON-BINDING): list endpoint may emit pagination metadata
 * shared with list_runs but never wire the cursor argument into the list
 * query. Invite verify against issue text only — do not invent source
 * claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "berthed",
  "echoed",
  "advanced",
  "same-page",
  "has-more-lied",
  "cursor-ignored",
  "twenty-cap",
  "pages-incomplete",
  "list-vs-list-runs",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["berthed", "advanced"]);

export const ALARM = new Set([
  "echoed",
  "same-page",
  "has-more-lied",
  "cursor-ignored",
  "twenty-cap",
  "pages-incomplete",
  "list-vs-list-runs",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "berthed";
export const SEEDED_WORD = "echoed";
export const ADMIT_WORD = "advanced";

export const MEASURED = {
  issue: 92746,
  title:
    "[BUG] RemoteTrigger action=list returns has_more/next_cursor but ignores the cursor argument, so routine lists beyond 20 cannot be paged",
  state: "open",
  labels: ["bug", "has repro", "platform:wsl", "area:routines"],
  filed: "2026-09-07T23:00:53Z",
  reporter: "happy-ryo",
  claude: "Claude Code CLI",
  os: "WSL2 (Linux 6.18, Ubuntu)",
  session: "interactive session with Fable 5.1, 2026-09-08",
  model: "Fable 5.1",
  surface: "RemoteTrigger action=list returns has_more/next_cursor but ignores the cursor so page 2+ never advances",
  action: "list",
  pageSize: 20,
  hasMore: true,
  nextCursorReturned: true,
  cursorIgnored: true,
  httpStatus: 200,
  sameFirstPage: true,
  sameIds: true,
  sameCreatedAt: true,
  samePrompts: true,
  observedByteSize: "~397 KB",
  unreachableFrom: 21,
  cursorDocumentedFor: ["list_runs", "get_run_log"],
  skill: "AAINC-LAB/cc-usage-insights",
  pagesComplete: false,
  expected:
    "page 2 (routines 21+), or an error if cursor is not accepted for list — or no has_more/next_cursor if list is not pageable",
  actual:
    "HTTP 200, identical to the first-page response (first element id / created_at / prompt match; response size identical, ~397 KB)",
  impact:
    "any consumer needing complete routine inventory (audits, usage analytics, cleanup) is capped at 20 and cannot tell which routines are missing"
};

export const PAGE_LEDGER = [
  {
    id: "page1",
    role: "first crib / action=list",
    tally: "20 routines",
    note: "has_more: true and next_cursor present — first bay of the hold"
  },
  {
    id: "reissued",
    role: "cursor page / same first id",
    tally: "same 20 · ~397 KB",
    note: "passing next_cursor as cursor reissues the identical first page"
  },
  {
    id: "advanced",
    role: "distinct bay / admit",
    tally: "page 2+ or no lie",
    note: "cursor yields a distinct page 2+ or API stops advertising has_more/next_cursor"
  }
];

export const COUSINS = [
  {
    id: 24785,
    state: "closed",
    title: "Claude Code does not follow MCP tools/list pagination (nextCursor)",
    note: "cite-only — same class, different surface (MCP tools/list)"
  },
  {
    id: 39586,
    state: "closed",
    title: "[BUG] Claude Code does not follow MCP tools/list pagination (nextCursor)",
    note: "cite-only — same class, different surface (MCP tools/list)"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "setoff",
    issue: 92750,
    note: "Setoff/#92750 already shipped — subagent MEMORY.md + skill_listing set-off. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  },
  {
    slug: "imprimatur",
    issue: 92740,
    note: "Imprimatur/#92740 already shipped — Skip Artifact first-publish. Do not touch."
  },
  {
    slug: "byname",
    issue: 92738,
    note: "Byname/#92738 already shipped. Do not touch."
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped. Do not touch."
  },
  {
    slug: "quietus",
    issue: 92716,
    note: "Quietus/#92716 already shipped. Do not touch."
  },
  {
    slug: "cribble",
    issue: 92684,
    note: "Cribble/#92684 already shipped. Do not touch."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675 already shipped. Do not touch."
  },
  {
    slug: "gangway",
    issue: 92662,
    note: "Gangway/#92662 already shipped. Do not touch."
  },
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624 already shipped. Do not touch."
  }
];

const CHIP_REASONS = {
  berthed:
    "HOLD: crib is berthed — list either fits on one page with has_more false, or cursor advances to a distinct next page. Score echoed or admit advanced",
  echoed:
    "ALARM: page echoed; RemoteTrigger action=list returns has_more/next_cursor but ignores the cursor so the identical first page is reissued (same ids, created_at, prompts, ~397 KB). Score echoed or admit advanced",
  advanced:
    "crib already advanced — cursor yields a distinct page 2+ or API stops advertising has_more/next_cursor when not pageable. Seeded admit word is advanced",
  "same-page":
    "same-page — passing next_cursor back as cursor returns HTTP 200 with exactly the same first page (same ids, created_at, prompts, same byte size ~397 KB)",
  "has-more-lied":
    "has-more-lied — response advertises has_more: true and a next_cursor, but the advertised next bay is unreachable because the cursor is ignored",
  "cursor-ignored":
    "cursor-ignored — the cursor argument is not applied to action=list; the first crib is reissued regardless of the token passed",
  "twenty-cap":
    "twenty-cap — action=list returns 20 routines and there is no way to retrieve routines 21+ from Claude Code",
  "pages-incomplete":
    "pages-incomplete — AAINC-LAB/cc-usage-insights now marks such lists pages_complete: false and degrades to a partial result",
  "list-vs-list-runs":
    "list-vs-list-runs — tool description documents cursor for list_runs / get_run_log; if list is intentionally not pageable, has_more / next_cursor should not be returned for it",
  cousins:
    "cite-only neighbourhood — #24785 CLOSED and #39586 CLOSED (MCP tools/list nextCursor not followed). Same class, different surface. Primary stays #92746",
  "has-clear-repro":
    "has-clear-repro — #92746 is labeled has repro: Claude Code CLI on WSL2 (Linux 6.18, Ubuntu), interactive session with Fable 5.1, 2026-09-08; filed 2026-09-07T23:00:53Z; labels bug, has repro, platform:wsl, area:routines"
};

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function berthedSignal(text = "") {
  return /idle crib is berthed|pin idle berthed|has_more false|cursor advances to a distinct/i.test(
    String(text || "")
  );
}

export function echoedSignal(text = "") {
  return /page echoed|identical first page|same first page|cursor ignored; identical/i.test(
    String(text || "")
  );
}

export function advancedSignal(text = "") {
  return /already advanced|crib advanced|distinct page 2|stops advertising has_more/i.test(
    String(text || "")
  );
}

export function samePageSignal(text = "") {
  const blob = String(text || "");
  if (/distinct page 2|already advanced/i.test(blob)) return false;
  return /same-page|exactly the same first page|same ids.*created_at|same first id/i.test(blob);
}

export function hasMoreLiedSignal(text = "") {
  return /has-more-lied|has_more: true|advertises has_more|next_cursor.*ignored/i.test(
    String(text || "")
  );
}

export function cursorIgnoredSignal(text = "") {
  return /cursor-ignored|ignores the cursor|cursor argument is not applied|cursor is ignored/i.test(
    String(text || "")
  );
}

export function twentyCapSignal(text = "") {
  return /twenty-cap|20 routines|routines 21\+|capped at 20/i.test(String(text || ""));
}

export function pagesIncompleteSignal(text = "") {
  return /pages-incomplete|pages_complete: false|partial result/i.test(String(text || ""));
}

export function listVsListRunsSignal(text = "") {
  return /list-vs-list-runs|list_runs|get_run_log|intentionally not pageable/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    berthed: berthedSignal(blob),
    echoed: echoedSignal(blob),
    advanced: advancedSignal(blob),
    samePage: samePageSignal(blob),
    hasMoreLied: hasMoreLiedSignal(blob),
    cursorIgnored: cursorIgnoredSignal(blob),
    twentyCap: twentyCapSignal(blob),
    pagesIncomplete: pagesIncompleteSignal(blob),
    listVsListRuns: listVsListRunsSignal(blob)
  };
}

export function sameFirstPage(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.sameFirstPage) || boolish(t.samePage) || boolish(t.identicalFirstPage)) {
    return true;
  }
  return samePageSignal(extractText(t));
}

export function cursorWasIgnored(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.cursorIgnored) || boolish(t.ignoresCursor) || boolish(t.cursorNotApplied)) {
    return true;
  }
  return cursorIgnoredSignal(extractText(t));
}

export function cribAdvanced(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.cribAdvanced) || (boolish(t.advanced) && !boolish(t.echoed))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const samePage = sameFirstPage(t) || hits.samePage;
  const cursorIgnored = cursorWasIgnored(t) || hits.cursorIgnored;
  const hasMoreLied = boolish(t.hasMoreLied) || t.hasMore === true || hits.hasMoreLied;
  const twentyCap = boolish(t.twentyCap) || t.pageSize === 20 || hits.twentyCap;
  const pagesIncomplete = boolish(t.pagesIncomplete) || t.pagesComplete === false || hits.pagesIncomplete;
  const listVsListRuns = boolish(t.listVsListRuns) || hits.listVsListRuns;
  const advancedClean = boolish(t.advanced) || cribAdvanced(t);
  const echoedHit =
    boolish(t.echoed) ||
    (samePage && cursorIgnored && !boolish(t.advanced) && !boolish(t.berthed));
  const berthedHit = boolish(t.berthed) || (hits.berthed && !echoedHit && !advancedClean);
  return {
    samePage,
    cursorIgnored,
    hasMoreLied,
    twentyCap,
    pagesIncomplete,
    listVsListRuns,
    advancedClean,
    echoedHit,
    berthedHit,
    cribAdvanced: cribAdvanced(t),
    pageReissued: samePage && cursorIgnored,
    pageAdvanced: advancedClean && !samePage,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const echoed = boolish(t.echoed) || (print.echoedHit && !boolish(t.advanced) && !boolish(t.berthed));
  const advanced = boolish(t.advanced) || (print.advancedClean && !boolish(t.echoed));
  const berthed = boolish(t.berthed) || (print.berthedHit && !echoed && !advanced);
  return {
    berthed,
    echoed,
    advanced,
    samePage: boolish(t.samePage) || print.samePage,
    hasMoreLied: boolish(t.hasMoreLied) || print.hasMoreLied,
    cursorIgnored: boolish(t.cursorIgnored) || print.cursorIgnored,
    twentyCap: boolish(t.twentyCap) || print.twentyCap,
    pagesIncomplete: boolish(t.pagesIncomplete) || print.pagesIncomplete,
    listVsListRuns: boolish(t.listVsListRuns) || print.listVsListRuns,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    claude: t.claude || MEASURED.claude,
    os: t.os || MEASURED.os
  };
}

export function seedBerthed() {
  return {
    seed: "berthed",
    issue: 92746,
    berthed: true,
    echoed: false,
    advanced: false,
    sameFirstPage: false,
    cursorIgnored: false,
    hasMore: false,
    outputText:
      "berthed; idle crib — list either fits on one page with has_more false, or cursor advances to a distinct next page"
  };
}

export function seedEchoed() {
  return {
    seed: "echoed",
    issue: 92746,
    berthed: false,
    echoed: true,
    advanced: false,
    samePage: true,
    sameFirstPage: true,
    identicalFirstPage: true,
    cursorIgnored: true,
    ignoresCursor: true,
    hasMoreLied: true,
    hasMore: true,
    nextCursorReturned: true,
    twentyCap: true,
    pageSize: 20,
    pagesIncomplete: true,
    pagesComplete: false,
    listVsListRuns: true,
    hasClearRepro: true,
    sameIds: true,
    sameCreatedAt: true,
    samePrompts: true,
    observedByteSize: MEASURED.observedByteSize,
    httpStatus: 200,
    outputText:
      "echoed; page echoed — cursor ignored; identical first page reissued (same ids, created_at, prompts, ~397 KB)",
    claude: MEASURED.claude
  };
}

export function seedAdvanced() {
  return {
    seed: "advanced",
    issue: 92746,
    berthed: false,
    echoed: false,
    advanced: true,
    cribAdvanced: true,
    cursorYieldsDistinctPage: true,
    hasMoreHonest: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    berthed: seedBerthed(),
    echoed: seedEchoed(),
    advanced: seedAdvanced(),
    "same-page": {
      seed: "same-page",
      issue: 92746,
      samePage: true,
      sameFirstPage: true,
      identicalFirstPage: true
    },
    "has-more-lied": {
      seed: "has-more-lied",
      issue: 92746,
      hasMoreLied: true,
      hasMore: true,
      nextCursorReturned: true
    },
    "cursor-ignored": {
      seed: "cursor-ignored",
      issue: 92746,
      cursorIgnored: true,
      ignoresCursor: true
    },
    "twenty-cap": {
      seed: "twenty-cap",
      issue: 92746,
      twentyCap: true,
      pageSize: 20
    },
    "pages-incomplete": {
      seed: "pages-incomplete",
      issue: 92746,
      pagesIncomplete: true,
      pagesComplete: false
    },
    "list-vs-list-runs": {
      seed: "list-vs-list-runs",
      issue: 92746,
      listVsListRuns: true
    },
    cousins: {
      seed: "cousins",
      issue: 92746,
      cousins: true,
      cousinsCiteOnly: COUSINS
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92746,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

const SPECIFIC_SEEDS = [
  "cousins",
  "same-page",
  "has-more-lied",
  "cursor-ignored",
  "twenty-cap",
  "pages-incomplete",
  "list-vs-list-runs",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "same-page": (t, c) => boolish(t.samePage) || boolish(t.sameFirstPage) || c.samePage,
  "has-more-lied": (t, c) => boolish(t.hasMoreLied) || c.hasMoreLied,
  "cursor-ignored": (t, c) => boolish(t.cursorIgnored) || c.cursorIgnored,
  "twenty-cap": (t, c) => boolish(t.twentyCap) || c.twentyCap,
  "pages-incomplete": (t, c) => boolish(t.pagesIncomplete) || c.pagesIncomplete,
  "list-vs-list-runs": (t, c) => boolish(t.listVsListRuns) || c.listVsListRuns,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const folio = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      berthed: false,
      echoed: true,
      advanced: false,
      chips: ["cousins", "echoed"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      berthed: false,
      echoed: true,
      advanced: false,
      chips: [seed, "echoed"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "echoed" &&
      seed !== "advanced" &&
      seed !== "berthed"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        berthed: false,
        echoed: true,
        advanced: false,
        chips: [name, "echoed"],
        folio
      };
    }
  }

  if (
    seed === "advanced" ||
    (t.advanced === true && t.echoed !== true && seed !== "echoed") ||
    (folio.advanced && !folio.echoed && seed !== "echoed")
  ) {
    reasons.push(CHIP_REASONS.advanced);
    return {
      verdict: "advanced",
      reasons,
      berthed: false,
      echoed: false,
      advanced: true,
      chips: ["advanced"],
      folio
    };
  }

  if (t.echoed === true || seed === "echoed" || (folio.echoed && !folio.advanced && !folio.berthed)) {
    reasons.push(CHIP_REASONS.echoed);
    const chips = ["echoed"];
    if (t.samePage === true || folio.samePage) chips.push("same-page");
    if (t.hasMoreLied === true || folio.hasMoreLied) chips.push("has-more-lied");
    if (t.cursorIgnored === true || folio.cursorIgnored) chips.push("cursor-ignored");
    if (t.twentyCap === true || folio.twentyCap) chips.push("twenty-cap");
    if (t.pagesIncomplete === true || folio.pagesIncomplete) chips.push("pages-incomplete");
    if (t.listVsListRuns === true || folio.listVsListRuns) chips.push("list-vs-list-runs");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "echoed",
      reasons,
      berthed: false,
      echoed: true,
      advanced: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "berthed" || t.berthed === true || folio.berthed) {
    reasons.push(CHIP_REASONS.berthed);
    return {
      verdict: "berthed",
      reasons,
      berthed: true,
      echoed: false,
      advanced: false,
      chips: ["berthed"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      berthed: false,
      echoed: true,
      advanced: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle crib is berthed — HOLD: list either fits on one page with has_more false, or cursor advances to a distinct next page"
  );
  return {
    verdict: "berthed",
    reasons,
    berthed: true,
    echoed: false,
    advanced: false,
    chips: ["berthed"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBerthed();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedBerthed();
  }
  return seedBerthed();
}

export async function main(argv = process.argv.slice(2)) {
  const { readFileSync } = await import("node:fs");
  const { stdin } = await import("node:process");
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stdin.on("error", reject);
    });
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "dunnage",
    issue: 92746,
    mark: "11:50 / hermes catalog #217 / #92746",
    alarm: ALARM.has(result.verdict),
    hold: HOLD.has(result.verdict),
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
