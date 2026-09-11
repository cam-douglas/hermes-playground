import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BOOTH_STATIONS,
  CALENDS_WALK,
  CHIPS,
  CLUSTER_DAY,
  CLUSTER_END,
  CLUSTER_START,
  COUSINS,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOOKBACK_DAYS,
  MONDAY_CRON,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  SAMPLE_ACTA,
  SAMPLE_FASTI,
  SAMPLE_HAND,
  SAMPLE_KALENDS,
  SAMPLE_NUNDINAE,
  SCHEMA_FIELDS,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TASK_COUNT,
  TITLE,
  VERDICTS,
  WEDNESDAY_CRON,
  WEEKDAY_PLAQUES,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectActa,
  inspectFasti,
  inspectHand,
  inspectKalends,
  inspectNundinae,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCalends,
  seedCatchupDow,
  seedCronFullFields,
  seedDowIgnored,
  seedDue,
  seedHold,
  seedListTaskRuns,
  seedMisfired,
  seedNoDisableSetting,
  seedOutboundRisk,
  seedStatusSucceeded,
  seedWrongDayCluster,
} from "./calends.mjs";

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
  return fileURLToPath(new URL("./calends.mjs", import.meta.url));
}

test("idle due is a hold; catch-up only when DOW/date fields match", () => {
  const result = analyze(seedDue());
  assert.equal(result.verdict, "due");
  assert.equal(result.idleWord, "due");
  assert.equal(IDLE_WORD, "due");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.due, true);
  assert.equal(result.phrase, "admit due");
  assert.equal(result.misfired, false);
  assert.equal(result.catchupDow, false);
  assert.equal(result.cronFullFields, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify due", () => {
  assert.equal(classify(emptyTicket()), "due");
  assert.equal(classify(""), "due");
  assert.equal(classify(null), "due");
  assert.equal(decide({}), "due");
});

test("#93687 seeded path scores calends when the stone rings the wrong day", () => {
  const result = analyze(seedMisfired());
  assert.equal(result.verdict, "calends");
  assert.equal(result.seededWord, "misfired");
  assert.equal(SEEDED_WORD, "misfired");
  assert.equal(PRODUCT_WORD, "calends");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.misfired, true);
  assert.equal(result.phrase, "score calends");
  assert.equal(result.wrongDayCluster, true);
  assert.equal(result.statusSucceeded, true);
  assert.equal(result.dowIgnored, true);
  assert.equal(result.catchupDow, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("Friday cluster plus status-succeeded is the #93687 calends", () => {
  const fasti = inspectFasti({ misfired: true, wrongDayCluster: true });
  assert.equal(fasti.stamp, "struck");
  assert.equal(fasti.struckWrong, true);
  const scored = scoreGate({
    misfired: true,
    wrongDayCluster: true,
    statusSucceeded: true,
    noDisableSetting: true,
    dowIgnored: true,
    listTaskRuns: true,
    outboundRisk: true,
    catchupDow: true,
    cue: "misfired",
    fasti: SAMPLE_FASTI,
    hand: SAMPLE_HAND,
  });
  assert.equal(scored.verdict, "calends");
  assert.equal(scored.catchupDow, true);
  const open = inspectFasti({ due: true, cronFullFields: true });
  assert.equal(open.stamp, "marked");
});

test("path word is catchup-dow; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "catchup-dow");
  const result = analyze(seedCatchupDow());
  assert.equal(result.verdict, "catchup-dow");
  assert.equal(result.pathWord, "catchup-dow");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "catchup-dow", preferSeed: true, misfired: true }),
    "catchup-dow",
  );
  assert.equal(classify(seedWrongDayCluster()), "wrong-day-cluster");
});

test("HOLD includes due / hold", () => {
  assert.ok(HOLD.includes("due"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: wrong-day-cluster, status-succeeded, no-disable-setting, dow-ignored", () => {
  assert.equal(classify(seedWrongDayCluster()), "wrong-day-cluster");
  assert.equal(classify(seedStatusSucceeded()), "status-succeeded");
  assert.equal(classify(seedNoDisableSetting()), "no-disable-setting");
  assert.equal(classify(seedDowIgnored()), "dow-ignored");
  assert.equal(classify(seedCronFullFields()), "cron-full-fields");
  assert.equal(classify(seedListTaskRuns()), "list-task-runs");
  assert.equal(classify(seedOutboundRisk()), "outbound-risk");
  assert.equal(classify(seedCalends()), "calends");
});

test("booth fixtures flip due vs misfired vs catchup-dow vs calends", () => {
  const idle = scoreGate(seedDue());
  const seeded = scoreGate(seedMisfired());
  const due = readData("due.json");
  const misfired = readData("misfired.json");
  const path = readData("catchup-dow.json");
  const product = readData("calends.json");
  const cluster = readData("wrong-day-cluster.json");
  const status = readData("status-succeeded.json");
  const schema = readData("no-disable-setting.json");
  const dow = readData("dow-ignored.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "due");
  assert.equal(seeded.verdict, "calends");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDue()), "due");
  assert.equal(score(seedMisfired()), "calends");
  assert.equal(due.cronFullFields, true);
  assert.equal(due.due, true);
  assert.equal(scoreGate(due).verdict, "due");
  assert.equal(misfired.wrongDayCluster, true);
  assert.equal(misfired.statusSucceeded, true);
  assert.equal(misfired.dowIgnored, true);
  assert.equal(classify(misfired), "misfired");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /seven days|catch-up|missed/i);
  assert.match(path.paths[1].result, /Friday|DOW|full field/i);
  assert.equal(classify(path), "catchup-dow");
  assert.equal(classify(product), "calends");
  assert.equal(product.hubCount, "CALENDS");
  assert.equal(misfired.issue, 93687);
  assert.equal(misfired.misfired, true);
  assert.equal(classify(cluster), "wrong-day-cluster");
  assert.equal(classify(status), "status-succeeded");
  assert.equal(classify(schema), "no-disable-setting");
  assert.equal(classify(dow), "dow-ignored");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("due"));
  assert.ok(CHIPS.includes("misfired"));
  assert.ok(CHIPS.includes("calends"));
  assert.ok(CHIPS.includes("catchup-dow"));
  assert.ok(CHIPS.includes("wrong-day-cluster"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("misfired"));
  assert.ok(ALARM.includes("catchup-dow"));
  assert.ok(ALARM.includes("wrong-day-cluster"));
  assert.ok(ALARM.includes("calends"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published calends walk scores calends after the idle hold", () => {
  const booth = scoreWalk({ rows: CALENDS_WALK });
  assert.equal(booth.verdict, "calends");
  assert.ok(booth.misfiredCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-due");
  assert.equal(idle.due, true);
  assert.equal(idle.verdict, "due");
  const cluster = booth.rows.find((row) => row.event === "wrong-day-cluster");
  assert.equal(cluster.wrongDayCluster, true);
  const path = booth.rows.find((row) => row.event === "catchup-dow");
  assert.equal(path.verdict, "catchup-dow");
});

test("CALENDS_WALK constant matches the issue catch-up walk", () => {
  assert.equal(CALENDS_WALK[0].event, "cue-due");
  const cluster = CALENDS_WALK.find((row) => row.event === "wrong-day-cluster");
  assert.equal(cluster.wrongDayCluster, true);
  const path = CALENDS_WALK.find((row) => row.event === "catchup-dow");
  assert.equal(path.misfired, true);
  const scoreRow = CALENDS_WALK.find((row) => row.event === "calends");
  assert.equal(scoreRow.misfired, true);
});

test("positive control cron-full-fields stays due", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "due");
  const ok = walk.rows.find((row) => row.event === "cron-full-fields");
  assert.equal(ok.verdict, "due");
  const hold = walk.rows.find((row) => row.event === "cue-due");
  assert.equal(hold.due, true);
  assert.equal(hold.verdict, "due");
});

test("issue constants encode only #93687 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93687);
  assert.ok(ISSUE_URL.includes("93687"));
  assert.match(TITLE, /catch-up/i);
  assert.match(TITLE, /day-of-week/i);
  assert.match(TITLE, /wrong days/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(PLATFORM, "Windows");
  assert.equal(AUTHOR, "erikholz");
  assert.equal(CLUSTER_START, "12:15");
  assert.equal(CLUSTER_END, "12:19");
  assert.equal(CLUSTER_DAY, "Friday");
  assert.equal(TASK_COUNT, 5);
  assert.equal(LOOKBACK_DAYS, 7);
  assert.equal(MONDAY_CRON, "0 19 * * 1");
  assert.equal(WEDNESDAY_CRON, "45 18 * * 3");
  assert.ok(SCHEMA_FIELDS.includes("cronExpression"));
  assert.ok(SCHEMA_FIELDS.includes("enabled"));
  assert.ok(!SCHEMA_FIELDS.includes("catchUp"));
  assert.equal(WEEKDAY_PLAQUES.length, 5);
  assert.match(DISTRIBUTION, /12:15/);
  assert.match(SESSION_KIND, /list_task_runs|Thursday-only/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("catchup-dow"));
  assert.ok(FINGERPRINT_LINES.includes("misfired"));
  assert.match(PHRASE, /Score calends or admit due/);
  assert.equal(SAMPLE_FASTI.struckWrong, true);
  assert.equal(SAMPLE_HAND.skipDow, true);
  assert.equal(SAMPLE_NUNDINAE.dowHonored, false);
  assert.equal(SAMPLE_KALENDS.dateHonored, false);
  assert.equal(SAMPLE_ACTA.wrongDayFires, true);
});

test("has-repro fingerprints encode the published wrong-day catch-up", () => {
  const result = handle(seedMisfired());
  assert.equal(result.published.clusterDay, "Friday");
  assert.match(result.published.sessionKind, /12:15/);
  assert.match(result.published.mondayCron, /0 19 \* \* 1/);
  assert.match(
    fingerprint(seedMisfired()),
    /calends\|fasti=struck\|hand=skip-dow\|nundinae=ignored\|kalends=skipped\|acta=wrong-day\|path=catchup-dow\|cue=catchup-dow/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Weir and Irons", () => {
  const required = [
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

test("due booth flips misfired back when the weekday matches", () => {
  const tape = {
    due: true,
    misfired: false,
    cronFullFields: true,
    cue: "due",
  };
  assert.equal(scoreGate(tape).verdict, "due");
  tape.due = false;
  tape.misfired = true;
  tape.wrongDayCluster = true;
  tape.statusSucceeded = true;
  tape.dowIgnored = true;
  tape.cue = "misfired";
  assert.equal(scoreGate(tape).verdict, "calends");
  tape.due = true;
  tape.misfired = false;
  tape.wrongDayCluster = false;
  tape.statusSucceeded = false;
  tape.dowIgnored = false;
  tape.cue = "due";
  assert.equal(scoreGate(tape).verdict, "due");
});

test("fasti, hand, nundinae, kalends, acta, and readBooth mark the wrong day", () => {
  const idle = inspectFasti({
    due: true,
    cronFullFields: true,
    fasti: { marked: true, struckWrong: false },
  });
  assert.equal(idle.stamp, "marked");
  const hand = inspectHand({ misfired: true, hand: SAMPLE_HAND });
  assert.equal(hand.stamp, "skip-dow");
  assert.equal(hand.skipDow, true);
  const nundinae = inspectNundinae({
    dowIgnored: true,
    nundinae: SAMPLE_NUNDINAE,
  });
  assert.equal(nundinae.stamp, "ignored");
  const kalends = inspectKalends({ misfired: true, catchupDow: true });
  assert.equal(kalends.stamp, "skipped");
  const acta = inspectActa({ misfired: true, listTaskRuns: true });
  assert.equal(acta.stamp, "wrong-day");
  const booth = readBooth({
    misfired: true,
    wrongDayCluster: true,
    dowIgnored: true,
    fasti: SAMPLE_FASTI,
    hand: SAMPLE_HAND,
  });
  assert.equal(booth.misfired, true);
  assert.equal(booth.mark, "misfired");
  const open = readBooth({
    due: true,
    misfired: false,
    cronFullFields: true,
  });
  assert.equal(open.misfired, false);
  assert.equal(open.mark, "due");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 93015);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /93015|birth|Flashpan/i);
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("hangfire"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("gnomon"));
  assert.ok(NOT_PRODUCTS.includes("almanac"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93683);
  assert.equal(BACKUPS[1].issue, 93672);
  assert.equal(BACKUPS[2].issue, 93652);
  assert.equal(BACKUPS[3].issue, 93680);
  assert.equal(BACKUPS[4].issue, 93618);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /Rider|injection/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/misfired.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "due");
  assert.equal(JSON.parse(seeded.stdout).verdict, "misfired");
});

test("handle exposes published hypothesis and #93687 headline", () => {
  const result = handle(seedMisfired());
  assert.equal(result.published.issue, 93687);
  assert.equal(result.published.clusterDay, "Friday");
  assert.deepEqual(result.published.cousins, [93015]);
  assert.ok(result.published.backups.includes(93683));
  assert.ok(result.published.backups.includes(93618));
  assert.match(result.published.hypothesis, /HH:MM|DOW|DOM|time-of-day/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93687/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a stone calendar / fasti booth, not weir or flashpan", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Figtree/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.match(page, /#F7F4EC|#1C2430|#7A2E2E|#C6A15B|#8B8790|#3E5C76/i);
  assert.match(page, /\bdue\b/);
  assert.match(page, /\bmisfired\b/);
  assert.match(page, /catchup-dow/);
  assert.match(page, /Score calends or admit due/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /05:50/);
  assert.match(page, /#299/);
  assert.match(page, /#93687/);
  assert.match(page, /Mark the weekday/);
  assert.match(page, /Score calends/);
  assert.match(page, /Walk the fasti/);
  assert.match(page, /Compare due \/ misfired/);
  assert.match(page, /Pin idle due/);
  assert.match(page, /Pin seeded misfired/);
  assert.match(page, /Pin catchup-dow/);
  assert.match(page, /Hold the due/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /\bHind\b/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#2C2A26/);
  assert.doesNotMatch(page, /#3A6B7A/);
  assert.doesNotMatch(page, /#E7F0F2/);
  assert.doesNotMatch(page, /#4F6F52/);
  assert.doesNotMatch(page, /#8C4A3A/);
  assert.doesNotMatch(page, /#C4922A/);
  assert.doesNotMatch(page, /#F4F1EA/);
  assert.doesNotMatch(page, /#0A1628/);
  assert.doesNotMatch(page, /#E8F1F8/);
  assert.doesNotMatch(page, /#E0A100/);
  assert.doesNotMatch(page, /#1F6F5B/);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|flash without discharge/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /cron-websearch/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /ptmx-race/);
  assert.doesNotMatch(page, /\bstale\b/);
  assert.doesNotMatch(page, /prewarm-latch/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Hangfire/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Calends/);
  assert.match(readme, /#93687/);
  assert.match(readme, /\bdue\b/);
  assert.match(readme, /\bmisfired\b/);
  assert.match(readme, /catchup-dow/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /#93015/);
  assert.match(readme, /12:15|day-of-week|catch-up/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/calends/);
  assert.match(readme, /node --test projects\/calends\/calends\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /fasti|nundinal|kalends|acta/i);
  assert.match(readme, /Score calends or admit due/);
  assert.match(readme, /#93683|#93672|#93652|#93680|#93618/);
});

test("catalog lists Calends unfeatured after Followspot", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 300);
  assert.equal(hub.products.length, 300);
  assert.equal(catalog.products[0].name, "Followspot");
  assert.equal(catalog.products[0].slug, "followspot");
  assert.equal(catalog.products[0].featured, true);
  const calends = catalog.products.find((row) => row.slug === "calends");
  assert.ok(calends);
  assert.equal(calends.featured, false);
  assert.equal(calends.href, "/calends/");
  assert.equal(calends.day, "2026-09-12");
  assert.match(calends.summary, /05:50/);
  assert.match(calends.summary, /calends/);
  assert.match(calends.summary, /#93687/);
  assert.match(calends.summary, /\bdue\b/);
  assert.match(calends.summary, /\bmisfired\b/);
  assert.match(calends.summary, /catchup-dow/);
  const hubCalends = hub.products.find((row) => row.slug === "calends");
  assert.ok(hubCalends);
  assert.equal(hubCalends.featured, false);
  const weir = catalog.products.find((row) => row.slug === "weir");
  assert.ok(weir);
  assert.equal(weir.featured, false);
  const irons = catalog.products.find((row) => row.slug === "irons");
  assert.ok(irons);
  assert.equal(irons.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "calends").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93687") && row.slug !== "calends"));
});

test("vercel still rewrites calends to the project folder", () => {
  const vercel = readVercel();
  const sources = vercel.rewrites.filter((row) => String(row.source || "").startsWith("/calends"));
  assert.equal(sources[0].source, "/calends");
  assert.equal(sources[0].destination, "/projects/calends");
  assert.equal(sources[1].source, "/calends/");
  assert.equal(sources[1].destination, "/projects/calends");
  assert.equal(sources[2].source, "/calends/:path*");
  assert.equal(sources[2].destination, "/projects/calends/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
