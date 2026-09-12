import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENT_ID,
  AGENT_LABEL,
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LANE_COUNT,
  NAVE_PANELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESUME_BANNER,
  RULED_OUT,
  SAMPLE_COLLISION,
  SAMPLE_COPY,
  SAMPLE_PROGRESS,
  SAMPLE_RESUME,
  SAMPLE_SCHISMED_AGENT,
  SCHISM_WALK,
  SEEDED_WORD,
  SLEEP_SECONDS,
  STATE,
  SURFACE,
  TASK_TYPE_COPY,
  TITLE,
  VERDICTS,
  WORKFLOW_NAME,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCollision,
  inspectCopy,
  inspectLiveAgent,
  inspectProgress,
  inspectResume,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedConflictingEdits,
  seedDualWriter,
  seedFourLaneDup,
  seedHold,
  seedLive,
  seedLocalAgentCopy,
  seedResumeWhileLive,
  seedResumingBanner,
  seedSchism,
  seedSchismed,
  seedWorkflowProgressOnly,
} from "./schism.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./schism.mjs", import.meta.url));
}

test("idle live is a hold; one in-process workflow agent; singular writer", () => {
  const result = analyze(seedLive());
  assert.equal(result.verdict, "live");
  assert.equal(result.idleWord, "live");
  assert.equal(IDLE_WORD, "live");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.live, true);
  assert.equal(result.phrase, "admit live");
  assert.equal(result.schismed, false);
  assert.equal(result.resumeWhileLive, false);
  assert.ok(HOLD_ALIASES.includes("live"));
  assert.ok(HOLD_ALIASES.includes("singular"));
  assert.ok(HOLD_ALIASES.includes("in-process"));
  assert.ok(HOLD_ALIASES.includes("addressable"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify live", () => {
  assert.equal(classify(emptyTicket()), "live");
  assert.equal(classify(""), "live");
  assert.equal(classify(null), "live");
  assert.equal(decide({}), "live");
});

test("#93797 seeded path scores schism when a second copy resumes while live", () => {
  const result = analyze(seedSchismed());
  assert.equal(result.verdict, "schism");
  assert.equal(result.seededWord, "schismed");
  assert.equal(SEEDED_WORD, "schismed");
  assert.equal(PRODUCT_WORD, "schism");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.schismed, true);
  assert.equal(result.phrase, "score schism");
  assert.equal(result.resumeWhileLive, true);
  assert.equal(result.localAgentCopy, true);
  assert.equal(result.resumingBanner, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("resume banner plus local_agent copy is the #93797 schism", () => {
  const resume = inspectResume({ schismed: true, resumingBanner: true });
  assert.equal(resume.stamp, "resuming-agent");
  assert.equal(resume.fromTranscript, true);
  const scored = scoreGate({
    schismed: true,
    resumeWhileLive: true,
    workflowProgressOnly: true,
    resumingBanner: true,
    localAgentCopy: true,
    dualWriter: true,
    fourLaneDup: true,
    conflictingEdits: true,
    cue: "schismed",
    agent: SAMPLE_SCHISMED_AGENT,
    resume: SAMPLE_RESUME,
    copy: SAMPLE_COPY,
  });
  assert.equal(scored.verdict, "schism");
  assert.equal(scored.resumeWhileLive, true);
  const open = inspectResume({ live: true, resumingBanner: false });
  assert.equal(open.stamp, "no-resume");
});

test("path word is resume-while-live; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "resume-while-live");
  const result = analyze(seedResumeWhileLive());
  assert.equal(result.verdict, "resume-while-live");
  assert.equal(result.pathWord, "resume-while-live");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "resume-while-live", preferSeed: true, schismed: true }),
    "resume-while-live",
  );
  assert.equal(classify(seedLocalAgentCopy()), "local-agent-copy");
});

test("HOLD includes live / hold", () => {
  assert.ok(HOLD.includes("live"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: dual-writer, resuming-banner, local-agent-copy, workflow-progress-only", () => {
  assert.equal(classify(seedDualWriter()), "dual-writer");
  assert.equal(classify(seedResumingBanner()), "resuming-banner");
  assert.equal(classify(seedLocalAgentCopy()), "local-agent-copy");
  assert.equal(classify(seedWorkflowProgressOnly()), "workflow-progress-only");
  assert.equal(classify(seedFourLaneDup()), "four-lane-dup");
  assert.equal(classify(seedConflictingEdits()), "conflicting-edits");
  assert.equal(classify(seedSchism()), "schism");
});

test("booth fixtures flip live vs schismed vs resume-while-live vs schism", () => {
  const idle = scoreGate(seedLive());
  const seeded = scoreGate(seedSchismed());
  const live = readData("live.json");
  const schismed = readData("schismed.json");
  const path = readData("resume-while-live.json");
  const product = readData("schism.json");
  const copy = readData("local-agent-copy.json");
  const banner = readData("resuming-banner.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "live");
  assert.equal(seeded.verdict, "schism");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLive()), "live");
  assert.equal(score(seedSchismed()), "schism");
  assert.equal(live.resumingBanner, false);
  assert.equal(live.live, true);
  assert.equal(scoreGate(live).verdict, "live");
  assert.equal(schismed.resumeWhileLive, true);
  assert.equal(schismed.localAgentCopy, true);
  assert.equal(schismed.resumingBanner, true);
  assert.equal(classify(schismed), "schismed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /refuse|queue|in_process/i);
  assert.match(path.paths[1].result, /Resuming agent|local_agent|transcript/i);
  assert.equal(classify(path), "resume-while-live");
  assert.equal(classify(product), "schism");
  assert.equal(product.hubCount, "SCHISM");
  assert.equal(schismed.issue, 93797);
  assert.equal(schismed.schismed, true);
  assert.equal(classify(copy), "local-agent-copy");
  assert.equal(classify(banner), "resuming-banner");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("dual-writer.json")), "dual-writer");
  assert.equal(classify(readData("workflow-progress-only.json")), "workflow-progress-only");
  assert.equal(classify(readData("four-lane-dup.json")), "four-lane-dup");
  assert.equal(classify(readData("conflicting-edits.json")), "conflicting-edits");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("live"));
  assert.ok(CHIPS.includes("schismed"));
  assert.ok(CHIPS.includes("schism"));
  assert.ok(CHIPS.includes("resume-while-live"));
  assert.ok(CHIPS.includes("dual-writer"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("schismed"));
  assert.ok(ALARM.includes("resume-while-live"));
  assert.ok(ALARM.includes("dual-writer"));
  assert.ok(ALARM.includes("schism"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published schism walk scores schism after the idle hold", () => {
  const booth = scoreWalk({ rows: SCHISM_WALK });
  assert.equal(booth.verdict, "schism");
  assert.ok(booth.schismedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-live");
  assert.equal(idle.live, true);
  assert.equal(idle.verdict, "live");
  const copy = booth.rows.find((row) => row.event === "local-agent-copy");
  assert.equal(copy.localAgentCopy, true);
  const path = booth.rows.find((row) => row.event === "resume-while-live" && row.t === "path");
  assert.equal(path.verdict, "resume-while-live");
});

test("SCHISM_WALK constant matches the issue nave walk", () => {
  assert.equal(SCHISM_WALK[0].event, "cue-live");
  const progress = SCHISM_WALK.find((row) => row.event === "workflow-progress-only");
  assert.equal(progress.workflowProgressOnly, true);
  const path = SCHISM_WALK.find((row) => row.t === "path");
  assert.equal(path.schismed, true);
  const scoreRow = SCHISM_WALK.find((row) => row.event === "schism");
  assert.equal(scoreRow.schismed, true);
});

test("positive control refuse-or-queue stays live", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "live");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "live");
  const hold = walk.rows.find((row) => row.event === "cue-live");
  assert.equal(hold.live, true);
  assert.equal(hold.verdict, "live");
});

test("issue constants encode only #93797 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93797);
  assert.ok(ISSUE_URL.includes("93797"));
  assert.match(TITLE, /SendMessage/i);
  assert.match(TITLE, /Resuming agent|LIVE Workflow|second copy/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:agents"));
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.match(SURFACE, /macOS|stream-json|-p/);
  assert.equal(AGENT_ID, "a55b7012793deae02");
  assert.equal(RESUME_BANNER, "Resuming agent a55b701");
  assert.equal(WORKFLOW_NAME, "dup-probe");
  assert.equal(AGENT_LABEL, "slowpoke");
  assert.equal(TASK_TYPE_COPY, "local_agent");
  assert.equal(SLEEP_SECONDS, 60);
  assert.equal(LANE_COUNT, 4);
  assert.equal(NAVE_PANELS.length, 4);
  assert.ok(RULED_OUT.some((row) => /91353/i.test(row)));
  assert.ok(EXPECTED.some((row) => /refuse|queue|in_process|live tasks/i.test(row)));
  assert.match(DISTRIBUTION, /SendMessage|Resuming agent|a55b7012793deae02|dup-probe|slowpoke|workflow_progress/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("resume-while-live"));
  assert.ok(FINGERPRINT_LINES.includes("schismed"));
  assert.equal(PHRASE, "Score schism or admit live.");
  assert.equal(SAMPLE_SCHISMED_AGENT.addressable, false);
  assert.equal(SAMPLE_RESUME.fromTranscript, true);
  assert.equal(SAMPLE_COPY.started, true);
  assert.equal(SAMPLE_PROGRESS.workflowProgressOnly, true);
  assert.equal(SAMPLE_COLLISION.duplicates, 4);
});

test("has-repro fingerprints encode the published schismed nave", () => {
  const result = handle(seedSchismed());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.surface, /2\.1\.269|stream-json/);
  assert.equal(result.published.agentId, AGENT_ID);
  assert.match(
    fingerprint(seedSchismed()),
    /schism\|writers=dual\|resume=while-live\|copy=local_agent\|registry=miss\|path=resume-while-live\|cue=resume-while-live/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Rasure and Ashpan", () => {
  const required = [
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
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "scraped",
    "rescript",
    "snapshot-write",
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
    "eidolon",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("live booth flips schismed back when the ghost twin stays silent", () => {
  const tape = {
    live: true,
    schismed: false,
    resumingBanner: false,
    cue: "live",
  };
  assert.equal(scoreGate(tape).verdict, "live");
  tape.live = false;
  tape.schismed = true;
  tape.resumeWhileLive = true;
  tape.resumingBanner = true;
  tape.localAgentCopy = true;
  tape.cue = "schismed";
  assert.equal(scoreGate(tape).verdict, "schism");
  tape.live = true;
  tape.schismed = false;
  tape.resumeWhileLive = false;
  tape.resumingBanner = false;
  tape.localAgentCopy = false;
  tape.cue = "live";
  assert.equal(scoreGate(tape).verdict, "live");
});

test("agent, resume, copy, progress, collision, and readBooth mark the schismed nave", () => {
  const idle = inspectLiveAgent({
    live: true,
    agent: { addressable: true, writers: 1 },
  });
  assert.equal(idle.stamp, "singular-choir");
  const resume = inspectResume({ schismed: true, resume: SAMPLE_RESUME });
  assert.equal(resume.stamp, "resuming-agent");
  assert.equal(resume.fromTranscript, true);
  const copy = inspectCopy({
    localAgentCopy: true,
    copy: SAMPLE_COPY,
  });
  assert.equal(copy.stamp, "local-agent-copy");
  const progress = inspectProgress({ schismed: true, workflowProgressOnly: true });
  assert.equal(progress.stamp, "progress-only");
  const collision = inspectCollision({ schismed: true, fourLaneDup: true });
  assert.equal(collision.stamp, "four-lane-dup");
  const booth = readBooth({
    schismed: true,
    resumingBanner: true,
    agent: SAMPLE_SCHISMED_AGENT,
    resume: SAMPLE_RESUME,
  });
  assert.equal(booth.schismed, true);
  assert.equal(booth.mark, "schismed");
  const open = readBooth({
    live: true,
    schismed: false,
    resumingBanner: false,
  });
  assert.equal(open.schismed, false);
  assert.equal(open.mark, "live");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 91353);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /91353|stalled|different mechanism|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("eidolon"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93794);
  assert.equal(BACKUPS[1].issue, 93788);
  assert.equal(BACKUPS[2].issue, 93766);
  assert.equal(BACKUPS[3].issue, 93764);
  assert.equal(BACKUPS[4].issue, 93754);
  assert.equal(BACKUPS[5].issue, 93751);
  assert.equal(BACKUPS[6].issue, 93744);
  assert.equal(BACKUPS[7].issue, 93772);
  assert.equal(BACKUPS[8].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93777);
  assert.equal(BACKUPS[10].issue, 93782);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/schismed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const liveFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/live.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(liveFix.status, 0, liveFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "live");
  assert.equal(JSON.parse(seeded.stdout).verdict, "schismed");
  assert.equal(JSON.parse(liveFix.stdout).verdict, "live");
});

test("handle exposes published hypothesis and #93797 headline", () => {
  const result = handle(seedSchismed());
  assert.equal(result.published.issue, 93797);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [91353]);
  assert.ok(result.published.backups.includes(93794));
  assert.ok(result.published.backups.includes(93788));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(!result.published.backups.includes(93797));
  assert.ok(!result.published.backups.includes(91353));
  assert.match(result.published.hypothesis, /task registry|task_started|resume-from-transcript/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93797/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an ecclesiastical schism twin-glass booth, not rasure or ashpan", () => {
  const page = readPage();
  assert.match(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.match(page, /Plus Jakarta Sans|Plus\+Jakarta\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /schism|schismed|twin|pulpit|nave|resume-while-live/i);
  assert.match(page, /#0B0A12|#E8E4F5|#1A1428|#6B3FA0|#3D9EBF|#C45C8A|#F2EDE4/i);
  assert.match(page, /\blive\b/);
  assert.match(page, /\bschismed\b/);
  assert.match(page, /resume-while-live/);
  assert.match(page, /Score schism or admit live/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#313/);
  assert.match(page, /#93797/);
  assert.match(page, /Admit live/);
  assert.match(page, /Score schism/);
  assert.match(page, /Walk resume-while-live/);
  assert.match(page, /Compare live \/ schismed/);
  assert.match(page, /Pin idle live/);
  assert.match(page, /Pin seeded schismed/);
  assert.match(page, /Pin resume-while-live/);
  assert.match(page, /Hold the live/);
  assert.match(page, /Resuming agent/);
  assert.match(page, /a55b7012793deae02/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /Old Standard TT|Old\+Standard\+TT/);
  assert.doesNotMatch(page, /#1A1A1A/);
  assert.doesNotMatch(page, /#9A9A94/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#8B4513/);
  assert.doesNotMatch(page, /#C4A574/);
  assert.doesNotMatch(page, /#0B1C2C/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /#5C3A21/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk/i);
  assert.doesNotMatch(page, /blank nameplate|UIA Name|sendIcon/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bswept\b/);
  assert.doesNotMatch(page, /\bashpanned\b/);
  assert.doesNotMatch(page, /orphan-jsonl/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\brasured\b/);
  assert.doesNotMatch(page, /creation-time-flip/);
  assert.doesNotMatch(page, /\bcredentialed\b/);
  assert.doesNotMatch(page, /\boutridden\b/);
  assert.doesNotMatch(page, /early-connect/);
  assert.doesNotMatch(page, /\battested\b/);
  assert.doesNotMatch(page, /\bnecrologized\b/);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Necrology/i);
  assert.match(page, /NOT Innominate/i);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Eidolon/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Schism/);
  assert.match(readme, /#93797/);
  assert.match(readme, /\blive\b/);
  assert.match(readme, /\bschismed\b/);
  assert.match(readme, /resume-while-live/);
  assert.match(readme, /Bodoni Moda/);
  assert.match(readme, /Plus Jakarta Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Necrology/i);
  assert.match(readme, /NOT Innominate/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Eidolon/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /#91353/);
  assert.match(readme, /SendMessage|Resuming agent|a55b7012793deae02|dup-probe|slowpoke|workflow_progress/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/schism/);
  assert.match(readme, /node --test projects\/schism\/schism\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /schism|twin|pulpit|nave|glass/i);
  assert.match(readme, /Score schism or admit live/);
  assert.match(readme, /#93794|#93788|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782/);
  assert.match(readme, /19:50/);
});

test("catalog features Schism only; Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 313);
  assert.equal(hub.products.length, 313);
  assert.equal(catalog.products[0].name, "Schism");
  assert.equal(catalog.products[0].slug, "schism");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/schism/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /19:50 schism|#93797|ecclesiastical schism|twin-authority/i);
  assert.match(catalog.products[0].summary, /\blive\b/);
  assert.match(catalog.products[0].summary, /\bschismed\b/);
  assert.match(catalog.products[0].summary, /resume-while-live/);
  assert.match(catalog.products[0].summary, /Score schism or admit live/);
  assert.equal(hub.products[0].slug, "schism");
  assert.equal(hub.products[0].featured, true);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  const outrider = catalog.products.find((row) => row.slug === "outrider");
  assert.ok(outrider);
  assert.equal(outrider.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "schism").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93797") && row.slug !== "schism"));
});

test("vercel rewrites schism to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/schism");
  assert.equal(vercel.rewrites[0].destination, "/projects/schism");
  assert.equal(vercel.rewrites[1].source, "/schism/");
  assert.equal(vercel.rewrites[1].destination, "/projects/schism");
  assert.equal(vercel.rewrites[2].source, "/schism/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/schism/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
