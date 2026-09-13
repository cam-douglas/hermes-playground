import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  APOGRAPH_WALK,
  BACKUPS,
  BIRTH_LAG_S,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  CLI_RESUMES,
  COMMAND,
  COUSINS,
  DESKTOP_VERSION,
  DISTRIBUTION,
  ENTRYPOINT,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FILE_COUNT,
  FINGERPRINT_LINES,
  FIRST_TS,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESUME_ROWS,
  RULED_OUT,
  SAMPLE_APOGRAPHED_QUIRE,
  SAMPLE_CLI_APPEND,
  SAMPLE_DESKTOP_FORK,
  SAMPLE_MB_CHAIN,
  SAMPLE_NO_FORK_FLAG,
  SAMPLE_SESSION_IDS,
  SAMPLE_SUPERSET_CHAIN,
  SEEDED_WORD,
  SIZE_CHAIN_MB,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDesktop,
  inspectSessionId,
  inspectSuperset,
  mapLeaves,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedApograph,
  seedApographed,
  seedDesktopFork,
  seedHold,
  seedReopenFork,
  seedSessionId,
  seedSingular,
} from "./apograph.mjs";

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
  return fileURLToPath(new URL("./apograph.mjs", import.meta.url));
}

test("idle singular is a hold; one conversation = one leaf", () => {
  const result = analyze(seedSingular());
  assert.equal(result.verdict, "singular");
  assert.equal(result.idleWord, "singular");
  assert.equal(IDLE_WORD, "singular");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.singular, true);
  assert.equal(result.phrase, "admit singular");
  assert.equal(result.apographed, false);
  assert.equal(result.reopenFork, false);
  assert.ok(HOLD_ALIASES.includes("singular"));
  assert.ok(HOLD_ALIASES.includes("cli-append"));
  assert.ok(HOLD_ALIASES.includes("one-leaf"));
  assert.ok(HOLD_ALIASES.includes("seal-intact"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify singular", () => {
  assert.equal(classify(emptyTicket()), "singular");
  assert.equal(classify(""), "singular");
  assert.equal(classify(null), "singular");
  assert.equal(decide({}), "singular");
});

test("#93859 seeded path scores apograph when the quire is apographed", () => {
  const result = analyze(seedApographed());
  assert.equal(result.verdict, "apograph");
  assert.equal(result.seededWord, "apographed");
  assert.equal(SEEDED_WORD, "apographed");
  assert.equal(PRODUCT_WORD, "apograph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.apographed, true);
  assert.equal(result.phrase, "score apograph");
  assert.equal(result.reopenFork, true);
  assert.equal(result.desktopFork, true);
  assert.equal(result.newSessionId, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("desktop-fork plus new session id is the #93859 apograph", () => {
  const desk = inspectDesktop({ apographed: true, desktopFork: true });
  assert.equal(desk.stamp, "desktop-fork");
  assert.equal(desk.newSessionId, true);
  const scored = scoreGate({
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    transcriptSuperset: true,
    cue: "apographed",
    desktop: SAMPLE_DESKTOP_FORK,
    session: SAMPLE_SESSION_IDS,
  });
  assert.equal(scored.verdict, "apograph");
  assert.equal(scored.reopenFork, true);
  const open = inspectDesktop({ singular: true, desktopFork: false });
  assert.equal(open.stamp, "cli-append");
});

test("path word is reopen-fork; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "reopen-fork");
  const result = analyze(seedReopenFork());
  assert.equal(result.verdict, "reopen-fork");
  assert.equal(result.pathWord, "reopen-fork");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "reopen-fork", preferSeed: true, apographed: true }),
    "reopen-fork",
  );
  assert.equal(classify(seedDesktopFork()), "desktop-fork");
});

test("HOLD includes singular / hold", () => {
  assert.ok(HOLD.includes("singular"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: desktop-fork, session-id, transcript-superset", () => {
  assert.equal(classify(seedDesktopFork()), "desktop-fork");
  assert.equal(classify(seedSessionId()), "session-id");
  assert.equal(classify(seedApograph()), "apograph");
});

test("booth fixtures flip singular vs apographed vs reopen-fork vs apograph", () => {
  const idle = scoreGate(seedSingular());
  const seeded = scoreGate(seedApographed());
  const singular = readData("singular.json");
  const apographed = readData("apographed.json");
  const path = readData("reopen-fork.json");
  const product = readData("apograph.json");
  const desk = readData("desktop-fork.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "singular");
  assert.equal(seeded.verdict, "apograph");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSingular()), "singular");
  assert.equal(score(seedApographed()), "apograph");
  assert.equal(singular.desktopFork, false);
  assert.equal(singular.singular, true);
  assert.equal(scoreGate(singular).verdict, "singular");
  assert.equal(apographed.reopenFork, true);
  assert.equal(apographed.desktopFork, true);
  assert.equal(apographed.newSessionId, true);
  assert.equal(classify(apographed), "apographed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /session ID|fork-session|resume/i);
  assert.match(path.paths[1].result, /7 jsonl|resume|title/i);
  assert.equal(classify(path), "reopen-fork");
  assert.equal(classify(product), "apograph");
  assert.equal(product.hubCount, "APOGRAPH");
  assert.equal(apographed.issue, 93859);
  assert.equal(apographed.apographed, true);
  assert.equal(classify(desk), "desktop-fork");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("session-id.json")), "session-id");
  assert.equal(classify(readData("transcript-superset.json")), "transcript-superset");
  assert.equal(classify(readData("custom-title.json")), "custom-title");
  assert.equal(classify(readData("resume-rows.json")), "resume-rows");
  assert.equal(classify(readData("entrypoint-desktop.json")), "entrypoint-desktop");
  assert.equal(classify(readData("no-fork-flag.json")), "no-fork-flag");
  assert.equal(classify(readData("mb-chain.json")), "mb-chain");
  assert.equal(classify(readData("cli-append.json")), "cli-append");
  assert.equal(classify(readData("one-leaf.json")), "one-leaf");
  assert.equal(classify(readData("seal-intact.json")), "seal-intact");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  const mb = readData("mb-chain.json");
  assert.deepEqual(mb.sizesMb, [1.5, 1.6, 2.2, 2.3, 3.1, 3.1, 4.6]);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("singular"));
  assert.ok(CHIPS.includes("apographed"));
  assert.ok(CHIPS.includes("apograph"));
  assert.ok(CHIPS.includes("reopen-fork"));
  assert.ok(CHIPS.includes("desktop-fork"));
  assert.ok(CHIPS.includes("session-id"));
  assert.ok(CHIPS.includes("transcript-superset"));
  assert.ok(CHIPS.includes("custom-title"));
  assert.ok(CHIPS.includes("resume-rows"));
  assert.ok(CHIPS.includes("entrypoint-desktop"));
  assert.ok(CHIPS.includes("no-fork-flag"));
  assert.ok(CHIPS.includes("mb-chain"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("apographed"));
  assert.ok(ALARM.includes("reopen-fork"));
  assert.ok(ALARM.includes("desktop-fork"));
  assert.ok(ALARM.includes("apograph"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published apograph walk scores apograph after the idle hold", () => {
  const booth = scoreWalk({ rows: APOGRAPH_WALK });
  assert.equal(booth.verdict, "apograph");
  assert.ok(booth.apographedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-singular");
  assert.equal(idle.singular, true);
  assert.equal(idle.verdict, "singular");
  const lie = booth.rows.find((row) => row.event === "desktop-fork");
  assert.equal(lie.desktopFork, true);
  const path = booth.rows.find((row) => row.event === "reopen-fork" && row.t === "path");
  assert.equal(path.verdict, "reopen-fork");
});

test("APOGRAPH_WALK constant matches the issue quire walk", () => {
  assert.equal(APOGRAPH_WALK[0].event, "cue-singular");
  const lie = APOGRAPH_WALK.find((row) => row.event === "desktop-fork");
  assert.equal(lie.desktopFork, true);
  const path = APOGRAPH_WALK.find((row) => row.t === "path");
  assert.equal(path.apographed, true);
  const scoreRow = APOGRAPH_WALK.find((row) => row.event === "apograph");
  assert.equal(scoreRow.apographed, true);
});

test("positive control one leaf stays singular", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "singular");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "singular");
  const hold = walk.rows.find((row) => row.event === "cue-singular");
  assert.equal(hold.singular, true);
  assert.equal(hold.verdict, "singular");
});

test("issue constants encode only #93859 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93859);
  assert.ok(ISSUE_URL.includes("93859"));
  assert.match(TITLE, /Desktop|session ID|transcript|\/resume|reopen/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.match(DESKTOP_VERSION, /1\.52386\.3/);
  assert.match(GOOD_VERSION, /resume|session ID|one transcript|\/resume/i);
  assert.equal(SURFACE, "desktop-sidebar-reopen");
  assert.equal(HOST, "macos-26.6.2");
  assert.match(INSTALL_PATH, /claude\/projects/);
  assert.match(COMMAND, /\/resume/);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:core",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /93797|Schism|dual-writer/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /fork-session|superseded|orphaned/i.test(row)));
  assert.ok(EXPECTED.some((row) => /session ID|one transcript|Desktop|sessions\.md/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|1\.52386\.3|7 separate|1\.5 MB|32|claude-desktop|#93797/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("reopen-fork"));
  assert.ok(FINGERPRINT_LINES.includes("apographed"));
  assert.equal(PHRASE, "Score apograph or admit singular.");
  assert.equal(SAMPLE_APOGRAPHED_QUIRE.fileCount, 7);
  assert.equal(SAMPLE_DESKTOP_FORK.newSessionId, true);
  assert.equal(SAMPLE_CLI_APPEND.permissionModeBlocks, 32);
  assert.equal(SAMPLE_SESSION_IDS.sharedFirstTimestamp, "2026-09-12T10:15:44Z");
  assert.equal(SAMPLE_SUPERSET_CHAIN.eachLaterIsSuperset, true);
  assert.equal(SAMPLE_MB_CHAIN.endMb, 4.6);
  assert.equal(SAMPLE_NO_FORK_FLAG.forkSessionFlag, false);
  assert.equal(FILE_COUNT, 7);
  assert.equal(RESUME_ROWS, 5);
  assert.equal(CLI_RESUMES, 32);
  assert.equal(FIRST_TS, "2026-09-12T10:15:44Z");
  assert.deepEqual([...SIZE_CHAIN_MB], [1.5, 1.6, 2.2, 2.3, 3.1, 3.1, 4.6]);
  assert.equal(BIRTH_LAG_S, 15);
  assert.equal(ENTRYPOINT, "claude-desktop");
});

test("has-repro fingerprints encode the published apographed quire", () => {
  const result = handle(seedApographed());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "desktop-sidebar-reopen");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedApographed()),
    /apograph\|desk=fork\|sid=new\|leaves=7\|path=reopen-fork\|cue=reopen-fork/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside", () => {
  const required = [
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "calibrated",
    "aneroided",
    "wrong-window-ring",
    "simulacrum",
    "tethered",
    "hollow",
    "phantom-navigate",
    "solenoid",
    "engaged",
    "inert",
    "warm-before-message",
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd-mislabel",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "pontoon",
    "washed",
    "outrider",
    "credentialed",
    "early-connect",
    "duplex",
    "simplexed",
    "simplex",
    "mobile-uplink-silent",
    "keyed",
    "deadkeyed",
    "deadkey",
    "esc-csi-dead",
    "gleaned",
    "orphaned",
    "gleaner",
    "unreaped-ampersand",
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
    "attested",
    "necrology",
    "named",
    "innominate",
    "lit",
    "snuffer",
    "pledged",
    "changeling",
    "distinct",
    "homograph",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
    "scapegoat",
    "galley",
    "stop-dirty",
    "primed",
    "warm",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("singular booth flips apographed back when Desktop reuses the session ID", () => {
  const tape = {
    singular: true,
    apographed: false,
    desktopFork: false,
    cue: "singular",
  };
  assert.equal(scoreGate(tape).verdict, "singular");
  tape.singular = false;
  tape.apographed = true;
  tape.reopenFork = true;
  tape.desktopFork = true;
  tape.newSessionId = true;
  tape.cue = "apographed";
  assert.equal(scoreGate(tape).verdict, "apograph");
  tape.singular = true;
  tape.apographed = false;
  tape.reopenFork = false;
  tape.desktopFork = false;
  tape.newSessionId = false;
  tape.cue = "singular";
  assert.equal(scoreGate(tape).verdict, "singular");
});

test("desktop, session, superset, and readBooth mark the apographed quire", () => {
  const idle = inspectDesktop({
    singular: true,
    desktop: { newSessionId: false, appendInPlace: true },
  });
  assert.equal(idle.stamp, "cli-append");
  const sid = inspectSessionId({ apographed: true, session: SAMPLE_SESSION_IDS });
  assert.equal(sid.stamp, "session-id");
  assert.equal(sid.reusedSessionId, false);
  const chain = inspectSuperset({ transcriptSuperset: true });
  assert.equal(chain.stamp, "transcript-superset");
  const booth = readBooth({
    apographed: true,
    desktopFork: true,
    desktop: SAMPLE_DESKTOP_FORK,
    session: SAMPLE_SESSION_IDS,
  });
  assert.equal(booth.apographed, true);
  assert.equal(booth.mark, "apographed");
  const open = readBooth({
    singular: true,
    apographed: false,
    desktopFork: false,
  });
  assert.equal(open.apographed, false);
  assert.equal(open.mark, "singular");
});

test("mapLeaves encodes the published Desktop fork stack", () => {
  const miss = mapLeaves({ apographed: true, fileCount: 7 });
  assert.equal(miss.stamp, "reopen-fork");
  assert.equal(miss.desktopLane, "fork-stack");
  assert.equal(miss.fileCount, 7);
  assert.equal(miss.seal, "split");
  const clear = mapLeaves({ singular: true, apographed: false });
  assert.equal(clear.stamp, "seal-intact");
  assert.equal(clear.desktopLane, "one-leaf");
  assert.ok(clear.fileCount < miss.fileCount);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 93797);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("simulacrum"));
  assert.ok(NOT_PRODUCTS.includes("solenoid"));
  assert.ok(NOT_PRODUCTS.includes("scotia"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93863);
  assert.equal(BACKUPS[5].issue, 93889);
  assert.equal(BACKUPS[6].issue, 93821);
  assert.equal(BACKUPS[7].issue, 93811);
  assert.equal(BACKUPS[8].issue, 93809);
  assert.equal(BACKUPS[9].issue, 93823);
  assert.equal(BACKUPS[10].issue, 93924);
  assert.equal(BACKUPS[11].issue, 93848);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93859));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/apographed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const singularFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/singular.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(singularFix.status, 0, singularFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const singularOut = JSON.parse(singularFix.stdout);
  assert.equal(idleOut.verdict, "singular");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "apographed");
  assert.equal(seededOut.alarm, true);
  assert.equal(singularOut.verdict, "singular");
  assert.equal(singularOut.hold, true);
});

test("handle exposes published hypothesis and #93859 headline", () => {
  const result = handle(seedApographed());
  assert.equal(result.published.issue, 93859);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93797]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(93848));
  assert.ok(!result.published.backups.includes(93859));
  assert.match(result.published.hypothesis, /Desktop|session ID|transcript|sidebar|reopen/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93859/);
  assert.equal(result.published.fileCount, 7);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a scriptorium / manuscript apograph booth, not airlock or scotoma", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /apograph|singular|apographed|reopen-fork|scriptorium|parchment|quire/i);
  assert.match(page, /#F6ECD4|#3D2A1A|#A31610|#8B6332|#1F1610/i);
  assert.match(page, /\bsingular\b/);
  assert.match(page, /\bapographed\b/);
  assert.match(page, /reopen-fork/);
  assert.match(page, /Score apograph or admit singular/i);
  assert.match(page, /#93797|cousin/i);
  assert.match(page, /#327/);
  assert.match(page, /#93859/);
  assert.match(page, /Admit singular/);
  assert.match(page, /Score apograph/);
  assert.match(page, /Walk reopen-fork/);
  assert.match(page, /Compare singular \/ apographed/);
  assert.match(page, /Pin idle singular/);
  assert.match(page, /Pin seeded apographed/);
  assert.match(page, /Pin reopen-fork/);
  assert.match(page, /Turn the leaf/);
  assert.match(page, /claude-desktop|\/resume|1\.5|4\.6|customTitle|2\.1\.269|1\.52386/i);
  assert.match(page, /CLI lane|Desktop lane|wax seal|MB chain/i);
  assert.doesNotMatch(page, /Quantico/);
  assert.doesNotMatch(page, /Rajdhani/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Orbitron/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /#081525/);
  assert.doesNotMatch(page, /#102033/);
  assert.doesNotMatch(page, /#4FD4E8/);
  assert.doesNotMatch(page, /#E89B1A/);
  assert.doesNotMatch(page, /#C4162A/);
  assert.doesNotMatch(page, /#0C1418/);
  assert.doesNotMatch(page, /#1E2C32/);
  assert.doesNotMatch(page, /#F3EBDA/);
  assert.doesNotMatch(page, /#D4A017/);
  assert.doesNotMatch(page, /#B81D45/);
  assert.doesNotMatch(page, /#2A8A7A/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|onQuitCleanup/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|headersHelper/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /remoteControlAtStartup|WarmLifecycle/);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /list_connected_browsers|Navigated to/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bwarm\b/);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Changeling/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Apograph/);
  assert.match(readme, /#93859/);
  assert.match(readme, /\bsingular\b/);
  assert.match(readme, /\bapographed\b/);
  assert.match(readme, /reopen-fork/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /Desktop|session ID|transcript|\/resume|2\.1\.269/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/apograph/);
  assert.match(readme, /node --test projects\/apograph\/apograph\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /apograph|scriptorium|manuscript|parchment/i);
  assert.match(readme, /Score apograph or admit singular/);
  assert.match(readme, /#93797/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93863|#93889|#93821|#93811|#93809|#93823|#93924|#93848/);
  assert.match(readme, /09:50/);
});

test("catalog features Apograph only; Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 327);
  assert.equal(hub.products.length, 327);
  assert.equal(catalog.products[0].name, "Apograph");
  assert.equal(catalog.products[0].slug, "apograph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/apograph/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /09:50 apograph|#93859|scriptorium|exact-copy/i);
  assert.match(catalog.products[0].summary, /\bsingular\b/);
  assert.match(catalog.products[0].summary, /\bapographed\b/);
  assert.match(catalog.products[0].summary, /reopen-fork/);
  assert.match(catalog.products[0].summary, /Score apograph or admit singular/);
  assert.equal(hub.products[0].slug, "apograph");
  assert.equal(hub.products[0].featured, true);
  const airlock = catalog.products.find((row) => row.slug === "airlock");
  assert.ok(airlock);
  assert.equal(airlock.featured, false);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const simulacrum = catalog.products.find((row) => row.slug === "simulacrum");
  assert.ok(simulacrum);
  assert.equal(simulacrum.featured, false);
  const solenoid = catalog.products.find((row) => row.slug === "solenoid");
  assert.ok(solenoid);
  assert.equal(solenoid.featured, false);
  const scotia = catalog.products.find((row) => row.slug === "scotia");
  assert.ok(scotia);
  assert.equal(scotia.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  const stet = catalog.products.find((row) => row.slug === "stet");
  assert.ok(stet);
  assert.equal(stet.featured, false);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "apograph").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93859") && row.slug !== "apograph"));
});

test("vercel rewrites apograph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/apograph");
  assert.equal(vercel.rewrites[0].destination, "/projects/apograph");
  assert.equal(vercel.rewrites[1].source, "/apograph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/apograph");
  assert.equal(vercel.rewrites[2].source, "/apograph/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/apograph/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
