import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CAP_TWO,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INTERRUPT_MARK,
  IRONS_WALK,
  ISSUE_URL,
  LABELS,
  MODEL,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RUN1_CHECKED,
  RUN1_ID,
  RUN1_STALL,
  RUN1_STARTED,
  RUN2_ID,
  RUN2_MESSAGES,
  RUN3_CHECKED,
  RUN3_CREATED,
  RUN3_ID,
  SAMPLE_CHRONOMETER,
  SAMPLE_HELM,
  SAMPLE_KITE,
  SAMPLE_LOG,
  SAMPLE_WIND,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  TRIGGER,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectChronometer,
  inspectHelm,
  inspectKite,
  inspectLog,
  inspectWind,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBecalmed,
  seedCapTwo,
  seedCronTrigger,
  seedCronWebsearch,
  seedFifthCallStall,
  seedFirstCallHang,
  seedHold,
  seedInteractiveOk,
  seedInterruptMidCall,
  seedIrons,
  seedLastActivityFreeze,
  seedNoTimeout,
  seedRunNow,
  seedScheduledTasksMcp,
  seedSessionRunning,
  seedUnderway,
  seedWebsearchHang,
  seedWindowsDesktop,
} from "./irons.mjs";

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
  return fileURLToPath(new URL("./irons.mjs", import.meta.url));
}

test("idle underway is a hold; interactive WebSearch returns in seconds", () => {
  const result = analyze(seedUnderway());
  assert.equal(result.verdict, "underway");
  assert.equal(result.idleWord, "underway");
  assert.equal(IDLE_WORD, "underway");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.underway, true);
  assert.equal(result.phrase, "admit underway");
  assert.equal(result.becalmed, false);
  assert.equal(result.cronWebsearch, false);
  assert.equal(result.interactiveOk, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify underway", () => {
  assert.equal(classify(emptyTicket()), "underway");
  assert.equal(classify(""), "underway");
  assert.equal(classify(null), "underway");
  assert.equal(decide({}), "underway");
});

test("#93615 seeded path scores irons when the scheduled kite never fills", () => {
  const result = analyze(seedBecalmed());
  assert.equal(result.verdict, "irons");
  assert.equal(result.seededWord, "becalmed");
  assert.equal(SEEDED_WORD, "becalmed");
  assert.equal(PRODUCT_WORD, "irons");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.becalmed, true);
  assert.equal(result.phrase, "score irons");
  assert.equal(result.websearchHang, true);
  assert.equal(result.noTimeout, true);
  assert.equal(result.lastActivityFreeze, true);
  assert.equal(result.cronWebsearch, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("WebSearch hang plus no-timeout is the #93615 irons", () => {
  const helm = inspectHelm({ becalmed: true, websearchHang: true });
  assert.equal(helm.stamp, "irons");
  assert.equal(helm.way, false);
  const scored = scoreGate({
    becalmed: true,
    websearchHang: true,
    noTimeout: true,
    lastActivityFreeze: true,
    sessionRunning: true,
    firstCallHang: true,
    cronWebsearch: true,
    cue: "becalmed",
    helm: SAMPLE_HELM,
    kite: SAMPLE_KITE,
  });
  assert.equal(scored.verdict, "irons");
  assert.equal(scored.cronWebsearch, true);
  const calm = inspectHelm({ underway: true, interactiveOk: true });
  assert.equal(calm.stamp, "underway");
});

test("path word is cron-websearch; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "cron-websearch");
  const result = analyze(seedCronWebsearch());
  assert.equal(result.verdict, "cron-websearch");
  assert.equal(result.pathWord, "cron-websearch");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "cron-websearch", preferSeed: true, becalmed: true }),
    "cron-websearch",
  );
  assert.equal(classify(seedWebsearchHang()), "websearch-hang");
});

test("HOLD includes underway / hold", () => {
  assert.ok(HOLD.includes("underway"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: websearch-hang, no-timeout, last-activity-freeze, first-call-hang", () => {
  assert.equal(classify(seedWebsearchHang()), "websearch-hang");
  assert.equal(classify(seedNoTimeout()), "no-timeout");
  assert.equal(classify(seedLastActivityFreeze()), "last-activity-freeze");
  assert.equal(classify(seedSessionRunning()), "session-running");
  assert.equal(classify(seedFirstCallHang()), "first-call-hang");
  assert.equal(classify(seedInteractiveOk()), "interactive-ok");
  assert.equal(classify(seedCapTwo()), "cap-two");
  assert.equal(classify(seedInterruptMidCall()), "interrupt-mid-call");
  assert.equal(classify(seedWindowsDesktop()), "windows-desktop");
  assert.equal(classify(seedScheduledTasksMcp()), "scheduled-tasks-mcp");
  assert.equal(classify(seedFifthCallStall()), "fifth-call-stall");
  assert.equal(classify(seedRunNow()), "run-now");
  assert.equal(classify(seedCronTrigger()), "cron-trigger");
  assert.equal(classify(seedIrons()), "irons");
});

test("booth fixtures flip underway vs becalmed vs cron-websearch vs irons", () => {
  const idle = scoreGate(seedUnderway());
  const seeded = scoreGate(seedBecalmed());
  const underway = readData("underway.json");
  const becalmed = readData("becalmed.json");
  const path = readData("cron-websearch.json");
  const product = readData("irons.json");
  const hang = readData("websearch-hang.json");
  const timeout = readData("no-timeout.json");
  const freeze = readData("last-activity-freeze.json");
  const first = readData("first-call-hang.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "underway");
  assert.equal(seeded.verdict, "irons");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUnderway()), "underway");
  assert.equal(score(seedBecalmed()), "irons");
  assert.equal(underway.interactiveOk, true);
  assert.equal(underway.underway, true);
  assert.equal(scoreGate(underway).verdict, "underway");
  assert.equal(becalmed.websearchHang, true);
  assert.equal(becalmed.noTimeout, true);
  assert.equal(becalmed.lastActivityFreeze, true);
  assert.equal(classify(becalmed), "becalmed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /WebSearch|scheduled|cron/i);
  assert.match(path.paths[1].result, /lastActivityAt|freeze|timeout/i);
  assert.equal(classify(path), "cron-websearch");
  assert.equal(classify(product), "irons");
  assert.equal(product.hubCount, "IRONS");
  assert.equal(becalmed.issue, 93615);
  assert.equal(becalmed.becalmed, true);
  assert.equal(classify(hang), "websearch-hang");
  assert.equal(classify(timeout), "no-timeout");
  assert.equal(classify(freeze), "last-activity-freeze");
  assert.equal(classify(first), "first-call-hang");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("underway"));
  assert.ok(CHIPS.includes("becalmed"));
  assert.ok(CHIPS.includes("irons"));
  assert.ok(CHIPS.includes("cron-websearch"));
  assert.ok(CHIPS.includes("websearch-hang"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("becalmed"));
  assert.ok(ALARM.includes("cron-websearch"));
  assert.ok(ALARM.includes("websearch-hang"));
  assert.ok(ALARM.includes("irons"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published irons walk scores irons after the idle hold", () => {
  const booth = scoreWalk({ rows: IRONS_WALK });
  assert.equal(booth.verdict, "irons");
  assert.ok(booth.becalmedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-underway");
  assert.equal(idle.underway, true);
  assert.equal(idle.verdict, "underway");
  const hang = booth.rows.find((row) => row.event === "websearch-hang");
  assert.equal(hang.websearchHang, true);
  const path = booth.rows.find((row) => row.event === "cron-websearch");
  assert.equal(path.verdict, "cron-websearch");
});

test("IRONS_WALK constant matches the issue WebSearch walk", () => {
  assert.equal(IRONS_WALK[0].event, "cue-underway");
  const hang = IRONS_WALK.find((row) => row.event === "websearch-hang");
  assert.equal(hang.websearchHang, true);
  const path = IRONS_WALK.find((row) => row.event === "cron-websearch");
  assert.equal(path.becalmed, true);
  const scoreRow = IRONS_WALK.find((row) => row.event === "irons");
  assert.equal(scoreRow.becalmed, true);
});

test("positive control interactive-ok stays underway", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "underway");
  const ok = walk.rows.find((row) => row.event === "interactive-ok");
  assert.equal(ok.verdict, "underway");
  const hold = walk.rows.find((row) => row.event === "cue-underway");
  assert.equal(hold.underway, true);
  assert.equal(hold.verdict, "underway");
});

test("issue constants encode only #93615 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93615);
  assert.ok(ISSUE_URL.includes("93615"));
  assert.match(TITLE, /Scheduled tasks/i);
  assert.match(TITLE, /WebSearch/);
  assert.match(TITLE, /hang indefinitely/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.equal(PLATFORM, "Windows");
  assert.match(MODEL, /Sonnet/);
  assert.match(TRIGGER, /scheduled-tasks MCP/);
  assert.match(RUN1_ID, /local_aa541c89/);
  assert.match(RUN2_ID, /local_3d6a8422/);
  assert.match(RUN3_ID, /local_7e5dc769/);
  assert.equal(RUN1_STARTED, "2026-09-11T08:55:28Z");
  assert.equal(RUN1_CHECKED, "2026-09-11T10:36:05Z");
  assert.match(RUN1_STALL, /5th/);
  assert.equal(RUN2_MESSAGES, "41->49");
  assert.equal(RUN3_CREATED, "2026-09-11T11:56:00Z");
  assert.equal(RUN3_CHECKED, "2026-09-11T12:13:19Z");
  assert.equal(CAP_TWO, 2);
  assert.match(INTERRUPT_MARK, /interrupted by user for tool use/);
  assert.match(DISTRIBUTION, /lastActivityAt/);
  assert.match(SESSION_KIND, /local_aa541c89/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("cron-websearch"));
  assert.ok(FINGERPRINT_LINES.includes("becalmed"));
  assert.match(PHRASE, /Score irons or admit underway/);
  assert.equal(SAMPLE_HELM.headToWind, true);
  assert.equal(SAMPLE_KITE.luffing, true);
  assert.equal(SAMPLE_CHRONOMETER.frozen, true);
  assert.equal(SAMPLE_WIND.interactiveBreeze, true);
  assert.equal(SAMPLE_LOG.running, true);
});

test("has-repro fingerprints encode the published cron hang", () => {
  const result = handle(seedBecalmed());
  assert.equal(result.published.capTwo, 2);
  assert.match(result.published.sessionKind, /local_aa541c89/);
  assert.match(result.published.run3Id, /local_7e5dc769/);
  assert.match(
    fingerprint(seedBecalmed()),
    /irons\|helm=irons\|kite=luff\|chrono=frozen\|wind=split\|log=stuck\|path=cron-websearch\|cue=cron-websearch/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Cathead and Anachronism", () => {
  const required = [
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("underway booth flips becalmed back when interactive kite fills", () => {
  const tape = {
    underway: true,
    becalmed: false,
    interactiveOk: true,
    cue: "underway",
  };
  assert.equal(scoreGate(tape).verdict, "underway");
  tape.underway = false;
  tape.becalmed = true;
  tape.websearchHang = true;
  tape.noTimeout = true;
  tape.lastActivityFreeze = true;
  tape.cue = "becalmed";
  assert.equal(scoreGate(tape).verdict, "irons");
  tape.underway = true;
  tape.becalmed = false;
  tape.websearchHang = false;
  tape.noTimeout = false;
  tape.lastActivityFreeze = false;
  tape.cue = "underway";
  assert.equal(scoreGate(tape).verdict, "underway");
});

test("helm, kite, chronometer, wind, log, and readBooth mark the hang", () => {
  const idle = inspectHelm({
    underway: true,
    interactiveOk: true,
    helm: { headToWind: false, way: true, sailsAback: false },
  });
  assert.equal(idle.stamp, "underway");
  const kite = inspectKite({ becalmed: true, kite: SAMPLE_KITE });
  assert.equal(kite.stamp, "luff");
  assert.equal(kite.result, false);
  const chrono = inspectChronometer({
    lastActivityFreeze: true,
    chronometer: SAMPLE_CHRONOMETER,
  });
  assert.equal(chrono.stamp, "frozen");
  const wind = inspectWind({ becalmed: true, interactiveOk: true, wind: SAMPLE_WIND });
  assert.equal(wind.stamp, "split");
  assert.equal(wind.interactiveBreeze, true);
  const session = inspectLog({ becalmed: true, sessionRunning: true });
  assert.equal(session.stamp, "stuck");
  const booth = readBooth({
    becalmed: true,
    websearchHang: true,
    lastActivityFreeze: true,
    helm: SAMPLE_HELM,
    kite: SAMPLE_KITE,
  });
  assert.equal(booth.becalmed, true);
  assert.equal(booth.mark, "becalmed");
  const calm = readBooth({
    underway: true,
    becalmed: false,
    interactiveOk: true,
  });
  assert.equal(calm.becalmed, false);
  assert.equal(calm.mark, "underway");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 89639);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /89639|scheduled|wedge/i);
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("aposiopesis"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("hangfire"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93570);
  assert.equal(BACKUPS[1].issue, 93589);
  assert.equal(BACKUPS[2].issue, 93618);
  assert.equal(BACKUPS[3].issue, 93622);
  assert.equal(BACKUPS[4].issue, 93652);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /shutdown/);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/becalmed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "underway");
  assert.equal(JSON.parse(seeded.stdout).verdict, "becalmed");
});

test("handle exposes published hypothesis and #93615 headline", () => {
  const result = handle(seedBecalmed());
  assert.equal(result.published.issue, 93615);
  assert.equal(result.published.capTwo, 2);
  assert.deepEqual(result.published.cousins, [
    89639, 83859, 91723, 81478, 89633, 85119, 47180,
  ]);
  assert.ok(result.published.backups.includes(93570));
  assert.ok(result.published.backups.includes(93652));
  assert.match(result.published.hypothesis, /WebSearch/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /timeout|egress|auth/i);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a sailing in-irons booth, not cathead or flashpan", () => {
  const page = readPage();
  assert.match(page, /Cardo/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /in irons|head-to-wind|WebSearch kite|chronometer|wind gauge/i);
  assert.match(page, /#0A1628|#E8F1F8|#4A5568|#E0A100|#1F6F5B|#8B3A2A/i);
  assert.match(page, /\bunderway\b/);
  assert.match(page, /\bbecalmed\b/);
  assert.match(page, /cron-websearch/);
  assert.match(page, /Score irons or admit underway/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /02:50/);
  assert.match(page, /#297/);
  assert.match(page, /#93615/);
  assert.match(page, /Fill the kite/);
  assert.match(page, /Score irons/);
  assert.match(page, /Sheet the headsail/);
  assert.match(page, /Compare underway \/ becalmed/);
  assert.match(page, /Pin idle underway/);
  assert.match(page, /Pin seeded becalmed/);
  assert.match(page, /Pin cron-websearch/);
  assert.match(page, /Hold the underway/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /\bHind\b/);
  assert.doesNotMatch(page, /Fira Mono|Fira\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#071828/);
  assert.doesNotMatch(page, /#9A6B3A/);
  assert.doesNotMatch(page, /#E23B3B/);
  assert.doesNotMatch(page, /#3BBFA0/);
  assert.doesNotMatch(page, /#D6B15A/);
  assert.doesNotMatch(page, /#12100E/);
  assert.doesNotMatch(page, /#1C1A17/);
  assert.doesNotMatch(page, /#E8E0D0/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#B83A3A/);
  assert.doesNotMatch(page, /#3A8F7A/);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|flash without discharge/i);
  assert.doesNotMatch(page, /heat-haze|false oasis|dispatch acknowledged/i);
  assert.doesNotMatch(page, /\btip\b/);
  assert.doesNotMatch(page, /\bstale\b/);
  assert.doesNotMatch(page, /prewarm-latch/);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bemptied\b/);
  assert.doesNotMatch(page, /empty-expand/);
  assert.doesNotMatch(page, /\bstanding\b/);
  assert.doesNotMatch(page, /\bhoisted\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfurled\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Hangfire/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Irons/);
  assert.match(readme, /#93615/);
  assert.match(readme, /\bunderway\b/);
  assert.match(readme, /\bbecalmed\b/);
  assert.match(readme, /cron-websearch/);
  assert.match(readme, /Cardo/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Mirage/i);
  assert.match(readme, /NOT Hangfire/i);
  assert.match(readme, /#89639/);
  assert.match(readme, /lastActivityAt|WebSearch/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/irons/);
  assert.match(readme, /node --test projects\/irons\/irons\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /in irons|head-to-wind|WebSearch kite|chronometer/i);
  assert.match(readme, /Score irons or admit underway/);
  assert.match(readme, /#93570|#93589|#93618|#93622|#93652/);
});

test("catalog features Irons only; Cathead unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 297);
  assert.equal(hub.products.length, 297);
  assert.equal(catalog.products[0].name, "Irons");
  assert.equal(catalog.products[0].slug, "irons");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/irons/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /02:50/);
  assert.match(catalog.products[0].summary, /irons/);
  assert.match(catalog.products[0].summary, /#93615/);
  assert.match(catalog.products[0].summary, /\bunderway\b/);
  assert.match(catalog.products[0].summary, /\bbecalmed\b/);
  assert.match(catalog.products[0].summary, /cron-websearch/);
  assert.equal(hub.products[0].slug, "irons");
  assert.equal(hub.products[0].featured, true);
  const cathead = catalog.products.find((row) => row.slug === "cathead");
  assert.ok(cathead);
  assert.equal(cathead.featured, false);
  const anachronism = catalog.products.find((row) => row.slug === "anachronism");
  assert.ok(anachronism);
  assert.equal(anachronism.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "irons").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93615") && row.slug !== "irons"));
});

test("vercel rewrites irons to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/irons");
  assert.equal(vercel.rewrites[0].destination, "/projects/irons");
  assert.equal(vercel.rewrites[1].source, "/irons/");
  assert.equal(vercel.rewrites[1].destination, "/projects/irons");
  assert.equal(vercel.rewrites[2].source, "/irons/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/irons/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
