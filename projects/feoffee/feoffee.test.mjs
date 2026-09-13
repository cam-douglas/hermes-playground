import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTH_VALUE,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COMMAND,
  COUSINS,
  DEMESNE_PATH,
  DESKTOP_BUNDLE,
  DESKTOP_VERSION,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FEOFFEE_WALK,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GETCWD_ERROR,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAUNCH_FILE,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PYTHON_ERROR,
  RIVAL_BUNDLE,
  RULED_OUT,
  SAMPLE_GETCWD,
  SAMPLE_NAMED_LAUNCH,
  SAMPLE_RIVAL_BUNDLE,
  SAMPLE_TCC_DENY,
  SAMPLE_UNSEISED_CHARTER,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TCC_ROW,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectGetcwd,
  inspectRivalBundle,
  inspectTcc,
  mapDemesne,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedFeoffee,
  seedGetcwdEperm,
  seedHold,
  seedPreviewEperm,
  seedTccDeny,
  seedUnseised,
  seedVested,
} from "./feoffee.mjs";

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
  return fileURLToPath(new URL("./feoffee.mjs", import.meta.url));
}

test("idle vested is a hold; FDA reaches children under Documents", () => {
  const result = analyze(seedVested());
  assert.equal(result.verdict, "vested");
  assert.equal(result.idleWord, "vested");
  assert.equal(IDLE_WORD, "vested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.vested, true);
  assert.equal(result.phrase, "admit vested");
  assert.equal(result.unseised, false);
  assert.equal(result.previewEperm, false);
  assert.ok(HOLD_ALIASES.includes("vested"));
  assert.ok(HOLD_ALIASES.includes("letters-patent"));
  assert.ok(HOLD_ALIASES.includes("demesne-open"));
  assert.ok(HOLD_ALIASES.includes("rival-bundle-ok"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify vested", () => {
  assert.equal(classify(emptyTicket()), "vested");
  assert.equal(classify(""), "vested");
  assert.equal(classify(null), "vested");
  assert.equal(decide({}), "vested");
});

test("#93863 seeded path scores feoffee when the mesne is unseised", () => {
  const result = analyze(seedUnseised());
  assert.equal(result.verdict, "feoffee");
  assert.equal(result.seededWord, "unseised");
  assert.equal(SEEDED_WORD, "unseised");
  assert.equal(PRODUCT_WORD, "feoffee");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.unseised, true);
  assert.equal(result.phrase, "score feoffee");
  assert.equal(result.previewEperm, true);
  assert.equal(result.getcwdEperm, true);
  assert.equal(result.tccDeny, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("getcwd EPERM plus TCC deny is the #93863 feoffee", () => {
  const cwd = inspectGetcwd({ unseised: true, getcwdEperm: true });
  assert.equal(cwd.stamp, "getcwd-eperm");
  assert.equal(cwd.eperm, true);
  const scored = scoreGate({
    unseised: true,
    previewEperm: true,
    getcwdEperm: true,
    tccDeny: true,
    documentsDemesne: true,
    cue: "unseised",
    getcwd: SAMPLE_GETCWD,
    tcc: SAMPLE_TCC_DENY,
    launch: SAMPLE_NAMED_LAUNCH,
  });
  assert.equal(scored.verdict, "feoffee");
  assert.equal(scored.previewEperm, true);
  const open = inspectGetcwd({ vested: true, getcwdEperm: false });
  assert.equal(open.stamp, "getcwd-ok");
});

test("path word is preview-eperm; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "preview-eperm");
  const result = analyze(seedPreviewEperm());
  assert.equal(result.verdict, "preview-eperm");
  assert.equal(result.pathWord, "preview-eperm");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "preview-eperm", preferSeed: true, unseised: true }),
    "preview-eperm",
  );
  assert.equal(classify(seedGetcwdEperm()), "getcwd-eperm");
});

test("HOLD includes vested / hold", () => {
  assert.ok(HOLD.includes("vested"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: getcwd-eperm, tcc-deny, named-launch", () => {
  assert.equal(classify(seedGetcwdEperm()), "getcwd-eperm");
  assert.equal(classify(seedTccDeny()), "tcc-deny");
  assert.equal(classify(seedFeoffee()), "feoffee");
});

test("booth fixtures flip vested vs unseised vs preview-eperm vs feoffee", () => {
  const idle = scoreGate(seedVested());
  const seeded = scoreGate(seedUnseised());
  const vested = readData("vested.json");
  const unseised = readData("unseised.json");
  const path = readData("preview-eperm.json");
  const product = readData("feoffee.json");
  const cwd = readData("getcwd-eperm.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "vested");
  assert.equal(seeded.verdict, "feoffee");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedVested()), "vested");
  assert.equal(score(seedUnseised()), "feoffee");
  assert.equal(vested.getcwdEperm, false);
  assert.equal(vested.vested, true);
  assert.equal(scoreGate(vested).verdict, "vested");
  assert.equal(unseised.previewEperm, true);
  assert.equal(unseised.getcwdEperm, true);
  assert.equal(unseised.tccDeny, true);
  assert.equal(classify(unseised), "unseised");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /FDA|getcwd|Documents|preview_start/i);
  assert.match(path.paths[1].result, /EPERM|TCC|System Policy|getcwd/i);
  assert.equal(classify(path), "preview-eperm");
  assert.equal(classify(product), "feoffee");
  assert.equal(product.hubCount, "FEOFFEE");
  assert.equal(unseised.issue, 93863);
  assert.equal(unseised.unseised, true);
  assert.equal(classify(cwd), "getcwd-eperm");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("tcc-deny.json")), "tcc-deny");
  assert.equal(classify(readData("named-launch.json")), "named-launch");
  assert.equal(classify(readData("documents-demesne.json")), "documents-demesne");
  assert.equal(classify(readData("bash-python-child.json")), "bash-python-child");
  assert.equal(classify(readData("desktop-fda.json")), "desktop-fda");
  assert.equal(classify(readData("rival-bundle.json")), "rival-bundle");
  assert.equal(classify(readData("letters-patent.json")), "letters-patent");
  assert.equal(classify(readData("demesne.json")), "demesne-open");
  assert.equal(classify(readData("rival-bundle-ok.json")), "rival-bundle-ok");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("vested"));
  assert.ok(CHIPS.includes("unseised"));
  assert.ok(CHIPS.includes("feoffee"));
  assert.ok(CHIPS.includes("preview-eperm"));
  assert.ok(CHIPS.includes("getcwd-eperm"));
  assert.ok(CHIPS.includes("tcc-deny"));
  assert.ok(CHIPS.includes("named-launch"));
  assert.ok(CHIPS.includes("documents-demesne"));
  assert.ok(CHIPS.includes("letters-patent"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("unseised"));
  assert.ok(ALARM.includes("preview-eperm"));
  assert.ok(ALARM.includes("getcwd-eperm"));
  assert.ok(ALARM.includes("feoffee"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published feoffee walk scores feoffee after the idle hold", () => {
  const booth = scoreWalk({ rows: FEOFFEE_WALK });
  assert.equal(booth.verdict, "feoffee");
  assert.ok(booth.unseisedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-vested");
  assert.equal(idle.vested, true);
  assert.equal(idle.verdict, "vested");
  const cwd = booth.rows.find((row) => row.event === "getcwd-eperm");
  assert.equal(cwd.getcwdEperm, true);
  const path = booth.rows.find((row) => row.event === "preview-eperm" && row.t === "path");
  assert.equal(path.verdict, "preview-eperm");
});

test("FEOFFEE_WALK constant matches the issue chancery walk", () => {
  assert.equal(FEOFFEE_WALK[0].event, "cue-vested");
  const cwd = FEOFFEE_WALK.find((row) => row.event === "getcwd-eperm");
  assert.equal(cwd.getcwdEperm, true);
  const path = FEOFFEE_WALK.find((row) => row.t === "path");
  assert.equal(path.unseised, true);
  const scoreRow = FEOFFEE_WALK.find((row) => row.event === "feoffee");
  assert.equal(scoreRow.unseised, true);
});

test("positive control vested letters patent stay vested", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "vested");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "vested");
  const hold = walk.rows.find((row) => row.event === "cue-vested");
  assert.equal(hold.vested, true);
  assert.equal(hold.verdict, "vested");
});

test("issue constants encode only #93863 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93863);
  assert.ok(ISSUE_URL.includes("93863"));
  assert.match(TITLE, /preview_start|launch\.json|getcwd|EPERM|Full Disk Access/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(DESKTOP_VERSION, /1\.52386\.3/);
  assert.match(CLAUDE_VERSION, /1\.52386\.3/);
  assert.match(GOOD_VERSION, /FDA|getcwd|Documents|TCC/i);
  assert.equal(SURFACE, "preview_start-named-launch");
  assert.equal(HOST, "Darwin 25.6.0");
  assert.equal(DESKTOP_BUNDLE, "com.anthropic.claudefordesktop");
  assert.equal(RIVAL_BUNDLE, "com.anthropic.claude-code");
  assert.equal(TCC_ROW, "kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2");
  assert.equal(AUTH_VALUE, 2);
  assert.equal(DEMESNE_PATH, "~/Documents/...");
  assert.equal(LAUNCH_FILE, ".claude/launch.json");
  assert.match(COMMAND, /preview_start/);
  assert.match(GETCWD_ERROR, /getcwd|Operation not permitted/i);
  assert.match(PYTHON_ERROR, /Errno 1|Operation not permitted/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /permissions|ls -la|stat/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /iCloud|FileProvider|APFS/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Full Disk Access|TCC/i.test(row)));
  assert.ok(EXPECTED.some((row) => /preview_start|getcwd|Documents|TCC/i.test(row)));
  assert.match(DISTRIBUTION, /preview_start|Documents|getcwd|claudefordesktop|claude-code|System Policy|#93766/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("preview-eperm"));
  assert.ok(FINGERPRINT_LINES.includes("unseised"));
  assert.equal(PHRASE, "Score feoffee or admit vested.");
  assert.equal(SAMPLE_UNSEISED_CHARTER.tccDeny, true);
  assert.equal(SAMPLE_GETCWD.eperm, true);
  assert.equal(SAMPLE_TCC_DENY.kind, "System Policy");
  assert.equal(SAMPLE_NAMED_LAUNCH.file, ".claude/launch.json");
  assert.equal(SAMPLE_RIVAL_BUNDLE.bundle, "com.anthropic.claude-code");
});

test("has-repro fingerprints encode the published unseised charter", () => {
  const result = handle(seedUnseised());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "preview_start-named-launch");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedUnseised()),
    /feoffee\|getcwd=eperm\|tcc=deny\|demesne=documents\|path=preview-eperm\|cue=preview-eperm/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Apograph, Airlock, Scotoma, Aneroid, Canard", () => {
  const required = [
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
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
    "gleaned",
    "orphaned",
    "inherited",
    "gleaner",
    "live",
    "schismed",
    "schism",
    "swept",
    "ashpanned",
    "ashpan",
    "seised",
    "disseised",
    "disseisin",
    "voiced",
    "muted",
    "sourdine",
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

test("vested booth flips unseised back when children inherit FDA", () => {
  const tape = {
    vested: true,
    unseised: false,
    getcwdEperm: false,
    cue: "vested",
  };
  assert.equal(scoreGate(tape).verdict, "vested");
  tape.vested = false;
  tape.unseised = true;
  tape.previewEperm = true;
  tape.getcwdEperm = true;
  tape.tccDeny = true;
  tape.cue = "unseised";
  assert.equal(scoreGate(tape).verdict, "feoffee");
  tape.vested = true;
  tape.unseised = false;
  tape.previewEperm = false;
  tape.getcwdEperm = false;
  tape.tccDeny = false;
  tape.cue = "vested";
  assert.equal(scoreGate(tape).verdict, "vested");
});

test("getcwd, tcc, rival, and readBooth mark the unseised charter", () => {
  const idle = inspectGetcwd({
    vested: true,
    getcwd: { eperm: false },
  });
  assert.equal(idle.stamp, "getcwd-ok");
  const tcc = inspectTcc({ unseised: true, tcc: SAMPLE_TCC_DENY });
  assert.equal(tcc.stamp, "tcc-deny");
  assert.equal(tcc.kind, "System Policy");
  const rival = inspectRivalBundle({ rival: SAMPLE_RIVAL_BUNDLE });
  assert.equal(rival.stamp, "rival-bundle-ok");
  const booth = readBooth({
    unseised: true,
    getcwdEperm: true,
    getcwd: SAMPLE_GETCWD,
    tcc: SAMPLE_TCC_DENY,
  });
  assert.equal(booth.unseised, true);
  assert.equal(booth.mark, "unseised");
  const open = readBooth({
    vested: true,
    unseised: false,
    getcwdEperm: false,
  });
  assert.equal(open.unseised, false);
  assert.equal(open.mark, "vested");
});

test("mapDemesne encodes the published Documents bar", () => {
  const miss = mapDemesne({ unseised: true, getcwdEperm: true });
  assert.equal(miss.stamp, "preview-eperm");
  assert.equal(miss.mesneLane, "barred");
  assert.equal(miss.seal, "unseised");
  const clear = mapDemesne({ vested: true, unseised: false });
  assert.equal(clear.stamp, "demesne-open");
  assert.equal(clear.mesneLane, "open");
  assert.equal(clear.rivalLane, "walks");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 93766);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("waif"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93889);
  assert.equal(BACKUPS[5].issue, 93821);
  assert.equal(BACKUPS[6].issue, 93811);
  assert.equal(BACKUPS[7].issue, 93809);
  assert.equal(BACKUPS[8].issue, 93823);
  assert.equal(BACKUPS[9].issue, 93924);
  assert.equal(BACKUPS[10].issue, 93848);
  assert.equal(BACKUPS[11].issue, 93929);
  assert.equal(BACKUPS[12].issue, 93915);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93863));
  assert.ok(!BACKUPS.some((row) => row.issue === 93766));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unseised.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const vestedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/vested.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(vestedFix.status, 0, vestedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const vestedOut = JSON.parse(vestedFix.stdout);
  assert.equal(idleOut.verdict, "vested");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "unseised");
  assert.equal(seededOut.alarm, true);
  assert.equal(vestedOut.verdict, "vested");
  assert.equal(vestedOut.hold, true);
});

test("handle exposes published hypothesis and #93863 headline", () => {
  const result = handle(seedUnseised());
  assert.equal(result.published.issue, 93863);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93766]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93929));
  assert.ok(result.published.backups.includes(93915));
  assert.ok(!result.published.backups.includes(93863));
  assert.match(result.published.hypothesis, /preview_start|Full Disk Access|child|TCC/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93863/);
  assert.equal(result.published.desktopBundle, "com.anthropic.claudefordesktop");
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a feoffment / livery-of-seisin chancery booth, not apograph or airlock", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /EB Garamond|EB\+Garamond/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /feoffee|vested|unseised|preview-eperm|feoffment|livery|chancery|demesne/i);
  assert.match(page, /#2C2118|#F3E6C8|#7A1F1F|#B08D57|#1A120C|#3F5D4A/i);
  assert.match(page, /\bvested\b/);
  assert.match(page, /\bunseised\b/);
  assert.match(page, /preview-eperm/);
  assert.match(page, /Score feoffee or admit vested/i);
  assert.match(page, /#93766|cousin/i);
  assert.match(page, /#328/);
  assert.match(page, /#93863/);
  assert.match(page, /Admit vested/);
  assert.match(page, /Score feoffee/);
  assert.match(page, /Walk preview-eperm/);
  assert.match(page, /Compare vested \/ unseised/);
  assert.match(page, /Pin idle vested/);
  assert.match(page, /Pin seeded unseised/);
  assert.match(page, /Pin preview-eperm/);
  assert.match(page, /Deliver seisin/);
  assert.match(page, /getcwd|Documents|claudefordesktop|claude-code|System Policy|1\.52386/i);
  assert.match(page, /letters patent|lord lane|mesne|rival bundle|demesne/i);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Quantico/);
  assert.doesNotMatch(page, /Rajdhani/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /#F6ECD4/);
  assert.doesNotMatch(page, /#3D2A1A/);
  assert.doesNotMatch(page, /#A31610/);
  assert.doesNotMatch(page, /#8B6332/);
  assert.doesNotMatch(page, /#081525/);
  assert.doesNotMatch(page, /#4FD4E8/);
  assert.doesNotMatch(page, /#E89B1A/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
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
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd-mislabel/);
  assert.match(page, /NOT Apograph/i);
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
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Waif/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Disseisin/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Feoffee/);
  assert.match(readme, /#93863/);
  assert.match(readme, /\bvested\b/);
  assert.match(readme, /\bunseised\b/);
  assert.match(readme, /preview-eperm/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /EB Garamond/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Apograph/i);
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
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Waif/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /preview_start|getcwd|Documents|Full Disk Access|TCC/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/feoffee/);
  assert.match(readme, /node --test projects\/feoffee\/feoffee\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /feoffee|feoffment|livery|chancery|demesne/i);
  assert.match(readme, /Score feoffee or admit vested/);
  assert.match(readme, /#93766/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93889|#93821|#93811|#93809|#93823|#93924|#93848|#93929|#93915/);
  assert.match(readme, /10:50/);
});

test("catalog features Feoffee only; Apograph, Airlock, Scotoma, Aneroid, Canard unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 328);
  assert.equal(hub.products.length, 328);
  assert.equal(catalog.products[0].name, "Feoffee");
  assert.equal(catalog.products[0].slug, "feoffee");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/feoffee/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /10:50 feoffee|#93863|feoffment|livery-of-seisin|chancery/i);
  assert.match(catalog.products[0].summary, /\bvested\b/);
  assert.match(catalog.products[0].summary, /\bunseised\b/);
  assert.match(catalog.products[0].summary, /preview-eperm/);
  assert.match(catalog.products[0].summary, /Score feoffee or admit vested/);
  assert.equal(hub.products[0].slug, "feoffee");
  assert.equal(hub.products[0].featured, true);
  const apograph = catalog.products.find((row) => row.slug === "apograph");
  assert.ok(apograph);
  assert.equal(apograph.featured, false);
  const airlock = catalog.products.find((row) => row.slug === "airlock");
  assert.ok(airlock);
  assert.equal(airlock.featured, false);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "feoffee").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93863") && row.slug !== "feoffee"));
});

test("vercel rewrites feoffee to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/feoffee");
  assert.equal(vercel.rewrites[0].destination, "/projects/feoffee");
  assert.equal(vercel.rewrites[1].source, "/feoffee/");
  assert.equal(vercel.rewrites[1].destination, "/projects/feoffee");
  assert.equal(vercel.rewrites[2].source, "/feoffee/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/feoffee/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
