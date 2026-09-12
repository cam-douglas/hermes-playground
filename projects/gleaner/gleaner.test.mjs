import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  CORES_CONSUMED,
  COUSINS,
  DISTRIBUTION,
  ELAPSED,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_STRIPS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GLEANER_WALK,
  HOLD,
  HOLD_ALIASES,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NICE,
  NOT_PRODUCTS,
  PATH_WORD,
  PGID_A,
  PGID_B,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PPID,
  PRODUCT_WORD,
  REPRO,
  RULED_OUT,
  SAMPLE_ELAPSED,
  SAMPLE_FD,
  SAMPLE_GROUPS,
  SAMPLE_ORPHANED_FIELD,
  SAMPLE_PPID,
  SAMPLE_SIGNAL,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TASK_OUTPUT_FD,
  TITLE,
  VERDICTS,
  WORKTREE_CWD,
  YES_ALIVE,
  YES_SPAWNED,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectContainment,
  inspectFd,
  inspectGroups,
  inspectPpid,
  inspectSignal,
  inspectYesWall,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedEightHourSpin,
  seedGleaned,
  seedGleaner,
  seedHold,
  seedNiceFive,
  seedOrphaned,
  seedPpidOne,
  seedProcessGroup,
  seedSigkillEscalate,
  seedTaskOutputFd,
  seedUnreapedAmpersand,
  seedYesWall,
} from "./gleaner.mjs";

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
  return fileURLToPath(new URL("./gleaner.mjs", import.meta.url));
}

test("idle gleaned is a hold; process-group reaped; no orphan PPID-1 spinners", () => {
  const result = analyze(seedGleaned());
  assert.equal(result.verdict, "gleaned");
  assert.equal(result.idleWord, "gleaned");
  assert.equal(IDLE_WORD, "gleaned");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.gleaned, true);
  assert.equal(result.phrase, "admit gleaned");
  assert.equal(result.orphaned, false);
  assert.equal(result.unreapedAmpersand, false);
  assert.ok(HOLD_ALIASES.includes("gleaned"));
  assert.ok(HOLD_ALIASES.includes("reaped"));
  assert.ok(HOLD_ALIASES.includes("contained"));
  assert.ok(HOLD_ALIASES.includes("process-group"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify gleaned", () => {
  assert.equal(classify(emptyTicket()), "gleaned");
  assert.equal(classify(""), "gleaned");
  assert.equal(classify(null), "gleaned");
  assert.equal(decide({}), "gleaned");
});

test("#93794 seeded path scores gleaner when `&` jobs reparent to PID 1", () => {
  const result = analyze(seedOrphaned());
  assert.equal(result.verdict, "gleaner");
  assert.equal(result.seededWord, "orphaned");
  assert.equal(SEEDED_WORD, "orphaned");
  assert.equal(PRODUCT_WORD, "gleaner");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.orphaned, true);
  assert.equal(result.phrase, "score gleaner");
  assert.equal(result.unreapedAmpersand, true);
  assert.equal(result.yesWall, true);
  assert.equal(result.ppidOne, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("PPID 1 plus yes wall is the #93794 gleaner", () => {
  const ppid = inspectPpid({ orphaned: true, ppidOne: true });
  assert.equal(ppid.stamp, "ppid-1");
  assert.equal(ppid.allPpidOne, true);
  const scored = scoreGate({
    orphaned: true,
    unreapedAmpersand: true,
    ppidOne: true,
    yesWall: true,
    processGroupLeak: true,
    niceFive: true,
    taskOutputFd: true,
    eightHourSpin: true,
    sigkillEscalate: true,
    cue: "orphaned",
    field: SAMPLE_ORPHANED_FIELD,
    ppidInspect: SAMPLE_PPID,
    elapsed: SAMPLE_ELAPSED,
    fd: SAMPLE_FD,
  });
  assert.equal(scored.verdict, "gleaner");
  assert.equal(scored.unreapedAmpersand, true);
  const open = inspectPpid({ gleaned: true, ppidOne: false });
  assert.equal(open.stamp, "reaped");
});

test("path word is unreaped-ampersand; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "unreaped-ampersand");
  const result = analyze(seedUnreapedAmpersand());
  assert.equal(result.verdict, "unreaped-ampersand");
  assert.equal(result.pathWord, "unreaped-ampersand");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "unreaped-ampersand", preferSeed: true, orphaned: true }),
    "unreaped-ampersand",
  );
  assert.equal(classify(seedYesWall()), "yes-wall");
});

test("HOLD includes gleaned / hold", () => {
  assert.ok(HOLD.includes("gleaned"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: ppid-one, process-group, nice-five, task-output-fd, sigkill-escalate, eight-hour-spin, yes-wall", () => {
  assert.equal(classify(seedPpidOne()), "ppid-one");
  assert.equal(classify(seedProcessGroup()), "process-group");
  assert.equal(classify(seedNiceFive()), "nice-five");
  assert.equal(classify(seedTaskOutputFd()), "task-output-fd");
  assert.equal(classify(seedSigkillEscalate()), "sigkill-escalate");
  assert.equal(classify(seedEightHourSpin()), "eight-hour-spin");
  assert.equal(classify(seedYesWall()), "yes-wall");
  assert.equal(classify(seedGleaner()), "gleaner");
});

test("booth fixtures flip gleaned vs orphaned vs unreaped-ampersand vs gleaner", () => {
  const idle = scoreGate(seedGleaned());
  const seeded = scoreGate(seedOrphaned());
  const gleaned = readData("gleaned.json");
  const orphaned = readData("orphaned.json");
  const path = readData("unreaped-ampersand.json");
  const product = readData("gleaner.json");
  const wall = readData("yes-wall.json");
  const ppid = readData("ppid-one.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "gleaned");
  assert.equal(seeded.verdict, "gleaner");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedGleaned()), "gleaned");
  assert.equal(score(seedOrphaned()), "gleaner");
  assert.equal(gleaned.ppidOne, false);
  assert.equal(gleaned.gleaned, true);
  assert.equal(scoreGate(gleaned).verdict, "gleaned");
  assert.equal(orphaned.unreapedAmpersand, true);
  assert.equal(orphaned.yesWall, true);
  assert.equal(orphaned.ppidOne, true);
  assert.equal(classify(orphaned), "orphaned");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /process group|setsid|kill/i);
  assert.match(path.paths[1].result, /PPID 1|reparent|orphaned/i);
  assert.equal(classify(path), "unreaped-ampersand");
  assert.equal(classify(product), "gleaner");
  assert.equal(product.hubCount, "GLEANER");
  assert.equal(orphaned.issue, 93794);
  assert.equal(orphaned.orphaned, true);
  assert.equal(classify(wall), "yes-wall");
  assert.equal(classify(ppid), "ppid-one");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("process-group.json")), "process-group");
  assert.equal(classify(readData("nice-five.json")), "nice-five");
  assert.equal(classify(readData("task-output-fd.json")), "task-output-fd");
  assert.equal(classify(readData("sigkill-escalate.json")), "sigkill-escalate");
  assert.equal(classify(readData("eight-hour-spin.json")), "eight-hour-spin");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("gleaned"));
  assert.ok(CHIPS.includes("orphaned"));
  assert.ok(CHIPS.includes("gleaner"));
  assert.ok(CHIPS.includes("unreaped-ampersand"));
  assert.ok(CHIPS.includes("ppid-one"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("orphaned"));
  assert.ok(ALARM.includes("unreaped-ampersand"));
  assert.ok(ALARM.includes("yes-wall"));
  assert.ok(ALARM.includes("gleaner"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published gleaner walk scores gleaner after the idle hold", () => {
  const booth = scoreWalk({ rows: GLEANER_WALK });
  assert.equal(booth.verdict, "gleaner");
  assert.ok(booth.orphanedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-gleaned");
  assert.equal(idle.gleaned, true);
  assert.equal(idle.verdict, "gleaned");
  const wall = booth.rows.find((row) => row.event === "yes-wall");
  assert.equal(wall.yesWall, true);
  const path = booth.rows.find((row) => row.event === "unreaped-ampersand" && row.t === "path");
  assert.equal(path.verdict, "unreaped-ampersand");
});

test("GLEANER_WALK constant matches the issue field walk", () => {
  assert.equal(GLEANER_WALK[0].event, "cue-gleaned");
  const wall = GLEANER_WALK.find((row) => row.event === "yes-wall");
  assert.equal(wall.yesWall, true);
  const path = GLEANER_WALK.find((row) => row.t === "path");
  assert.equal(path.orphaned, true);
  const scoreRow = GLEANER_WALK.find((row) => row.event === "gleaner");
  assert.equal(scoreRow.orphaned, true);
});

test("positive control process-group kill stays gleaned", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "gleaned");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "gleaned");
  const hold = walk.rows.find((row) => row.event === "cue-gleaned");
  assert.equal(hold.gleaned, true);
  assert.equal(hold.verdict, "gleaned");
});

test("issue constants encode only #93794 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93794);
  assert.ok(ISSUE_URL.includes("93794"));
  assert.match(TITLE, /Background|&|orphaned|yes/i);
  assert.match(TITLE, /8h42m|39/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:bash"));
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.267/);
  assert.match(SURFACE, /Darwin 25\.5\.0|arm64|14 cores|zsh/);
  assert.equal(YES_SPAWNED, 60);
  assert.equal(YES_ALIVE, 39);
  assert.equal(CORES_CONSUMED, 7);
  assert.equal(ELAPSED, "8h42m");
  assert.equal(NICE, 5);
  assert.equal(PGID_A, 40734);
  assert.equal(PGID_B, 42141);
  assert.equal(PPID, 1);
  assert.match(WORKTREE_CWD, /worktrees\/agent/);
  assert.match(TASK_OUTPUT_FD, /tasks\/<task-id>\.output/);
  assert.match(REPRO, /seq 1 5/);
  assert.match(REPRO, /yes > \/dev\/null &/);
  assert.equal(FIELD_STRIPS.length, 4);
  assert.ok(RULED_OUT.some((row) => /92583/i.test(row)));
  assert.ok(EXPECTED.some((row) => /process group|setsid|SIGKILL/i.test(row)));
  assert.match(DISTRIBUTION, /PPID 1|yes|8h42m|40734|42141|nice 5|tasks\/<task-id>\.output/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("unreaped-ampersand"));
  assert.ok(FINGERPRINT_LINES.includes("orphaned"));
  assert.equal(PHRASE, "Score gleaner or admit gleaned.");
  assert.equal(SAMPLE_ORPHANED_FIELD.ppidOne, true);
  assert.equal(SAMPLE_PPID.allPpidOne, true);
  assert.equal(SAMPLE_ELAPSED.alive, 39);
  assert.equal(SAMPLE_FD.nice, 5);
  assert.equal(SAMPLE_GROUPS.total, 39);
  assert.equal(SAMPLE_SIGNAL.neededKillNine, true);
});

test("has-repro fingerprints encode the published orphaned field", () => {
  const result = handle(seedOrphaned());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.surface, /2\.1\.267|Darwin/);
  assert.equal(result.published.yesAlive, YES_ALIVE);
  assert.match(
    fingerprint(seedOrphaned()),
    /gleaner\|ppid=1\|jobs=orphaned\|yes=39\|fd2=tasks\/output\|path=unreaped-ampersand\|cue=unreaped-ampersand/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Schism, Rasure and Ashpan", () => {
  const required = [
    "live",
    "schismed",
    "schism",
    "resume-while-live",
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

test("gleaned booth flips orphaned back when the stubble stays empty", () => {
  const tape = {
    gleaned: true,
    orphaned: false,
    ppidOne: false,
    cue: "gleaned",
  };
  assert.equal(scoreGate(tape).verdict, "gleaned");
  tape.gleaned = false;
  tape.orphaned = true;
  tape.unreapedAmpersand = true;
  tape.ppidOne = true;
  tape.yesWall = true;
  tape.cue = "orphaned";
  assert.equal(scoreGate(tape).verdict, "gleaner");
  tape.gleaned = true;
  tape.orphaned = false;
  tape.unreapedAmpersand = false;
  tape.ppidOne = false;
  tape.yesWall = false;
  tape.cue = "gleaned";
  assert.equal(scoreGate(tape).verdict, "gleaned");
});

test("containment, ppid, wall, fd, signal, groups, and readBooth mark the orphaned field", () => {
  const idle = inspectContainment({
    gleaned: true,
    field: { contained: true, orphans: 0 },
  });
  assert.equal(idle.stamp, "setsid-gate");
  const ppid = inspectPpid({ orphaned: true, ppidInspect: SAMPLE_PPID });
  assert.equal(ppid.stamp, "ppid-1");
  assert.equal(ppid.allPpidOne, true);
  const wall = inspectYesWall({
    yesWall: true,
    elapsed: SAMPLE_ELAPSED,
  });
  assert.equal(wall.stamp, "yes-wall");
  const fd = inspectFd({ orphaned: true, taskOutputFd: true });
  assert.equal(fd.stamp, "task-output-fd");
  const signal = inspectSignal({ orphaned: true, sigkillEscalate: true });
  assert.equal(signal.stamp, "term-fail-kill");
  const groups = inspectGroups({ orphaned: true, processGroupLeak: true });
  assert.equal(groups.stamp, "pgid-40734-42141");
  const booth = readBooth({
    orphaned: true,
    ppidOne: true,
    field: SAMPLE_ORPHANED_FIELD,
    ppidInspect: SAMPLE_PPID,
  });
  assert.equal(booth.orphaned, true);
  assert.equal(booth.mark, "orphaned");
  const open = readBooth({
    gleaned: true,
    orphaned: false,
    ppidOne: false,
  });
  assert.equal(open.orphaned, false);
  assert.equal(open.mark, "gleaned");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 92583);
  assert.equal(COUSINS[1].issue, 77593);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /92583|session-end|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("schism"));
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
  assert.ok(NOT_PRODUCTS.includes("snatch"));
  assert.ok(NOT_PRODUCTS.includes("stubble"));
  assert.equal(BACKUPS.length, 16);
  assert.equal(BACKUPS[0].issue, 93788);
  assert.equal(BACKUPS[1].issue, 93801);
  assert.equal(BACKUPS[2].issue, 93798);
  assert.equal(BACKUPS[3].issue, 93786);
  assert.equal(BACKUPS[4].issue, 93778);
  assert.equal(BACKUPS[5].issue, 93800);
  assert.equal(BACKUPS[6].issue, 93795);
  assert.equal(BACKUPS[7].issue, 93766);
  assert.equal(BACKUPS[8].issue, 93764);
  assert.equal(BACKUPS[9].issue, 93754);
  assert.equal(BACKUPS[10].issue, 93751);
  assert.equal(BACKUPS[11].issue, 93744);
  assert.equal(BACKUPS[12].issue, 93772);
  assert.equal(BACKUPS[13].issue, 93770);
  assert.equal(BACKUPS[14].issue, 93777);
  assert.equal(BACKUPS[15].issue, 93782);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/orphaned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const gleanedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/gleaned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(gleanedFix.status, 0, gleanedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "gleaned");
  assert.equal(JSON.parse(seeded.stdout).verdict, "orphaned");
  assert.equal(JSON.parse(gleanedFix.stdout).verdict, "gleaned");
});

test("handle exposes published hypothesis and #93794 headline", () => {
  const result = handle(seedOrphaned());
  assert.equal(result.published.issue, 93794);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [92583, 77593]);
  assert.ok(result.published.backups.includes(93788));
  assert.ok(result.published.backups.includes(93801));
  assert.ok(result.published.backups.includes(93798));
  assert.ok(result.published.backups.includes(93786));
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93800));
  assert.ok(result.published.backups.includes(93795));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(!result.published.backups.includes(93794));
  assert.ok(!result.published.backups.includes(92583));
  assert.match(result.published.hypothesis, /process group|PID 1|shell exit/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93794/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an agricultural gleaner's-field booth, not schism or rasure", () => {
  const page = readPage();
  assert.match(page, /Yrsa/);
  assert.match(page, /Mulish/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /gleaner|gleaned|orphaned|unreaped-ampersand|stubble|sickle|basket/i);
  assert.match(page, /#0E140C|#E8D9A8|#2A1F14|#C4A35A|#5B8C5A|#B85C38|#F4F0E6/i);
  assert.match(page, /\bgleaned\b/);
  assert.match(page, /\borphaned\b/);
  assert.match(page, /unreaped-ampersand/);
  assert.match(page, /Score gleaner or admit gleaned/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#314/);
  assert.match(page, /#93794/);
  assert.match(page, /Admit gleaned/);
  assert.match(page, /Score gleaner/);
  assert.match(page, /Walk unreaped-ampersand/);
  assert.match(page, /Compare gleaned \/ orphaned/);
  assert.match(page, /Pin idle gleaned/);
  assert.match(page, /Pin seeded orphaned/);
  assert.match(page, /Pin unreaped-ampersand/);
  assert.match(page, /Hold the gleaned/);
  assert.match(page, /PPID 1|ppid-1|ppid 1/i);
  assert.match(page, /40734/);
  assert.match(page, /42141/);
  assert.match(page, /8h42m/);
  assert.match(page, /yes×39|yes x 39|yes×39|yes × 39|yes×39/i);
  assert.doesNotMatch(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.doesNotMatch(page, /Plus Jakarta Sans|Plus\+Jakarta\+Sans/);
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
  assert.doesNotMatch(page, /Crimson Pro|Crimson\+Pro/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /#0B0A12/);
  assert.doesNotMatch(page, /#E8E4F5/);
  assert.doesNotMatch(page, /#6B3FA0/);
  assert.doesNotMatch(page, /#3D9EBF/);
  assert.doesNotMatch(page, /#C45C8A/);
  assert.doesNotMatch(page, /#1A1A1A/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#0B1C2C/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\blive\b/);
  assert.doesNotMatch(page, /\bschismed\b/);
  assert.doesNotMatch(page, /resume-while-live/);
  assert.doesNotMatch(page, /\bswept\b/);
  assert.doesNotMatch(page, /\bashpanned\b/);
  assert.doesNotMatch(page, /orphan-jsonl/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\brasured\b/);
  assert.doesNotMatch(page, /creation-time-flip/);
  assert.match(page, /NOT Schism/i);
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
  assert.match(readme, /Gleaner/);
  assert.match(readme, /#93794/);
  assert.match(readme, /\bgleaned\b/);
  assert.match(readme, /\borphaned\b/);
  assert.match(readme, /unreaped-ampersand/);
  assert.match(readme, /Yrsa/);
  assert.match(readme, /Mulish/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Schism/i);
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
  assert.match(readme, /#92583|#77593/);
  assert.match(readme, /PPID 1|yes|8h42m|40734|42141|nice 5/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/gleaner/);
  assert.match(readme, /node --test projects\/gleaner\/gleaner\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /gleaner|stubble|sickle|basket|harvest/i);
  assert.match(readme, /Score gleaner or admit gleaned/);
  assert.match(readme, /#93788|#93801|#93798|#93786|#93778|#93800|#93795|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782/);
  assert.match(readme, /20:50/);
});

test("catalog features Gleaner only; Schism, Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 314);
  assert.equal(hub.products.length, 314);
  assert.equal(catalog.products[0].name, "Gleaner");
  assert.equal(catalog.products[0].slug, "gleaner");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/gleaner/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /20:50 gleaner|#93794|gleaner's field|leftover-harvest/i);
  assert.match(catalog.products[0].summary, /\bgleaned\b/);
  assert.match(catalog.products[0].summary, /\borphaned\b/);
  assert.match(catalog.products[0].summary, /unreaped-ampersand/);
  assert.match(catalog.products[0].summary, /Score gleaner or admit gleaned/);
  assert.equal(hub.products[0].slug, "gleaner");
  assert.equal(hub.products[0].featured, true);
  const schism = catalog.products.find((row) => row.slug === "schism");
  assert.ok(schism);
  assert.equal(schism.featured, false);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "gleaner").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93794") && row.slug !== "gleaner"));
});

test("vercel rewrites gleaner to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/gleaner");
  assert.equal(vercel.rewrites[0].destination, "/projects/gleaner");
  assert.equal(vercel.rewrites[1].source, "/gleaner/");
  assert.equal(vercel.rewrites[1].destination, "/projects/gleaner");
  assert.equal(vercel.rewrites[2].source, "/gleaner/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/gleaner/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
