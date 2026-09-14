import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALLOGRAPH_WALK,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_PAIRS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_ALLOGRAPH_PROOF,
  SEEDED_WORD,
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
  inspectDeny,
  inspectLockout,
  inspectPath,
  inspectPrefix,
  inspectScratchpad,
  inspectWindowsPath,
  mapLedger,
  naivePrefixAllows,
  readBooth,
  score,
  scoreGate,
  scorePair,
  scoreWalk,
  scriptsWouldEquate,
  seedAllograph,
  seedDenyMessageOnly,
  seedEquated,
  seedHold,
  seedPrefixFail,
  seedProduct,
  seedSettingsLockout,
  seedWinPosixMismatch,
  unifyScript,
} from "./allograph.mjs";

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
  return fileURLToPath(new URL("./allograph.mjs", import.meta.url));
}

test("idle equated is a hold; paths compared after script unification would match", () => {
  const result = analyze(seedEquated());
  assert.equal(result.verdict, "equated");
  assert.equal(result.idleWord, "equated");
  assert.equal(IDLE_WORD, "equated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.equated, true);
  assert.equal(result.phrase, "admit equated");
  assert.equal(result.allograph, false);
  assert.equal(result.winPosixMismatch, false);
  assert.ok(HOLD_ALIASES.includes("matched"));
  assert.ok(HOLD_ALIASES.includes("congruent"));
  assert.ok(HOLD_ALIASES.includes("aligned"));
  assert.ok(HOLD_ALIASES.includes("normalized"));
  assert.ok(HOLD_ALIASES.includes("samepath"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "penned");
  assert.notEqual(IDLE_WORD, "ungloved");
  assert.notEqual(IDLE_WORD, "attested");
  assert.notEqual(IDLE_WORD, "reaped");
});

test("empty ticket and empty stdin classify equated", () => {
  assert.equal(classify(emptyTicket()), "equated");
  assert.equal(classify(""), "equated");
  assert.equal(classify(null), "equated");
  assert.equal(decide({}), "equated");
});

test("#94256 seeded path scores allograph when Windows vs POSIX prefix fails closed", () => {
  const result = analyze(seedAllograph());
  assert.equal(result.verdict, "allograph");
  assert.equal(result.seededWord, "allograph");
  assert.equal(SEEDED_WORD, "allograph");
  assert.equal(PRODUCT_WORD, "allograph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.allograph, true);
  assert.equal(result.phrase, "score allograph");
  assert.equal(result.winPosixMismatch, true);
  assert.equal(result.prefixFail, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "agraphia");
  assert.notEqual(SEEDED_WORD, "gauntlet");
  assert.notEqual(SEEDED_WORD, "lictor");
});

test("path unification proves D:\\\\proj and /d/proj are allographs that would equate", () => {
  assert.equal(unifyScript("D:\\Dropbox\\project\\doc.tex"), "/d/Dropbox/project/doc.tex");
  assert.equal(unifyScript("/d/Dropbox/project"), "/d/Dropbox/project");
  assert.equal(
    scriptsWouldEquate("D:\\Dropbox\\project\\doc.tex", "/d/Dropbox/project"),
    true,
  );
  assert.equal(
    naivePrefixAllows("D:\\Dropbox\\project\\doc.tex", ["/d/Dropbox/project", "/d/Dropbox/project/*"]),
    false,
  );
  const pair = scorePair({
    windows: "D:\\Dropbox\\project\\doc.tex",
    posix: "/d/Dropbox/project",
  });
  assert.equal(pair.naive, false);
  assert.equal(pair.unified, true);
  assert.equal(pair.allograph, true);
  const settings = scorePair({
    windows: "D:\\Dropbox\\project\\.claude\\settings.json",
    posix: "/d/Dropbox/project",
  });
  assert.equal(settings.naive, false);
  assert.equal(settings.unified, true);
  const scratch = scorePair({
    windows: "C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude\\scratch.md",
    posix: "/tmp/claude",
  });
  assert.equal(scratch.naive, false);
  assert.equal(scratch.unified, false);
});

test("inspectors mark prefix-fail and settings lockout", () => {
  const prefix = inspectPrefix({ allograph: true, prefixFail: true });
  assert.equal(prefix.stamp, "prefix-fail");
  assert.equal(prefix.failed, true);
  const lock = inspectLockout({ allograph: true, settingsLockout: true });
  assert.equal(lock.stamp, "settings-lockout");
  assert.equal(lock.locked, true);
  const scored = scoreGate({
    allograph: true,
    winPosixMismatch: true,
    prefixFail: true,
    cue: "allograph",
  });
  assert.equal(scored.verdict, "allograph");
  const open = inspectPrefix({ equated: true, allograph: false });
  assert.equal(open.stamp, "prefix-equated");
});

test("path word is win-posix-mismatch; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "win-posix-mismatch");
  const result = analyze(seedWinPosixMismatch());
  assert.equal(result.verdict, "win-posix-mismatch");
  assert.equal(result.pathWord, "win-posix-mismatch");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "win-posix-mismatch",
      preferSeed: true,
      allograph: true,
    }),
    "win-posix-mismatch",
  );
  assert.equal(classify(seedPrefixFail()), "prefix-fail");
  assert.equal(score(seedWinPosixMismatch()), "allograph");
});

test("HOLD includes equated / hold", () => {
  assert.ok(HOLD.includes("equated"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: prefix-fail, win-posix-mismatch, allograph, settings-lockout", () => {
  assert.equal(classify(seedPrefixFail()), "prefix-fail");
  assert.equal(classify(seedWinPosixMismatch()), "win-posix-mismatch");
  assert.equal(classify(seedProduct()), "allograph");
  assert.equal(classify(seedSettingsLockout()), "settings-lockout");
});

test("booth fixtures flip equated vs allograph vs win-posix-mismatch", () => {
  const idle = scoreGate(seedEquated());
  const seeded = scoreGate(seedAllograph());
  const equated = readData("equated.json");
  const allograph = readData("allograph.json");
  const issued = readData("94256.json");
  const path = readData("win-posix-mismatch.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "equated");
  assert.equal(seeded.verdict, "allograph");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEquated()), "equated");
  assert.equal(score(seedAllograph()), "allograph");
  assert.equal(score({ seed: "win-posix-mismatch", preferSeed: true }), "allograph");
  assert.equal(equated.winPosixMismatch, false);
  assert.equal(equated.equated, true);
  assert.equal(scoreGate(equated).verdict, "equated");
  assert.equal(allograph.winPosixMismatch, true);
  assert.equal(allograph.prefixFail, true);
  assert.equal(classify(allograph), "allograph");
  assert.equal(issued.issue, 94256);
  assert.equal(classify(issued), "allograph");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /equated|matched|congruent|aligned|normalized|samepath/i);
  assert.match(path.paths[1].result, /win-posix-mismatch|prefix-fail|D:\\|POSIX/i);
  assert.equal(classify(path), "win-posix-mismatch");
  assert.equal(allograph.hubCount, "ALLOGRAPH");
  assert.equal(allograph.issue, 94256);
  assert.equal(allograph.allograph, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("matched.json")), "matched");
  assert.equal(classify(readData("congruent.json")), "congruent");
  assert.equal(classify(readData("aligned.json")), "aligned");
  assert.equal(classify(readData("normalized.json")), "normalized");
  assert.equal(classify(readData("samepath.json")), "samepath");
  assert.equal(classify(readData("settings-lockout.json")), "settings-lockout");
  assert.equal(classify(readData("scratchpad-temp.json")), "scratchpad-temp");
  assert.equal(classify(readData("deny-message-only.json")), "deny-message-only");
  assert.equal(classify(readData("prefix-fail.json")), "prefix-fail");
  assert.equal(classify(readData("fail-closed.json")), "fail-closed");
  assert.equal(classify(readData("windows-path.json")), "windows-path");
  assert.equal(classify(readData("posix-shell.json")), "posix-shell");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [89392, 88578, 90122, 93356, 79414]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  const pairs = readData("windows-vs-posix.json");
  assert.ok(pairs.pairs.length >= 3);
  assert.ok(pairs.pairs.some((row) => /D:\\/.test(row.windows) && /\/d\//.test(row.posix)));
  assert.ok(pairs.pairs.every((row) => row.naive === false));
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("equated"));
  assert.ok(CHIPS.includes("allograph"));
  assert.ok(CHIPS.includes("win-posix-mismatch"));
  assert.ok(CHIPS.includes("prefix-fail"));
  assert.ok(CHIPS.includes("settings-lockout"));
  assert.ok(CHIPS.includes("matched"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("allograph"));
  assert.ok(ALARM.includes("win-posix-mismatch"));
  assert.ok(ALARM.includes("prefix-fail"));
  assert.ok(ALARM.includes("settings-lockout"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published allograph walk scores allograph after the idle hold", () => {
  const booth = scoreWalk({ rows: ALLOGRAPH_WALK });
  assert.equal(booth.verdict, "allograph");
  assert.ok(booth.allographCount >= 1);
  const idle = booth.rows.find((row) => row.event === "ledger-equated");
  assert.equal(idle.equated, true);
  assert.equal(idle.verdict, "equated");
  const cut = booth.rows.find((row) => row.event === "win-posix-mismatch");
  assert.equal(cut.winPosixMismatch, true);
  const path = booth.rows.find(
    (row) => row.event === "win-posix-mismatch" && row.t === "path",
  );
  assert.equal(path.verdict, "win-posix-mismatch");
});

test("ALLOGRAPH_WALK constant matches the issue foundry walk", () => {
  assert.equal(ALLOGRAPH_WALK[0].event, "ledger-equated");
  const cut = ALLOGRAPH_WALK.find((row) => row.event === "win-posix-mismatch");
  assert.equal(cut.winPosixMismatch || cut.prefixFail, true);
  const path = ALLOGRAPH_WALK.find((row) => row.t === "path");
  assert.equal(path.allograph, true);
  const scoreRow = ALLOGRAPH_WALK.find((row) => row.event === "allograph");
  assert.equal(scoreRow.allograph, true);
  assert.equal(scoreRow.prefixFail, true);
});

test("positive control equated ledger stays equated", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "equated");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "equated");
  const hold = walk.rows.find((row) => row.event === "ledger-equated");
  assert.equal(hold.equated, true);
  assert.equal(hold.verdict, "equated");
});

test("issue constants encode only #94256 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94256);
  assert.ok(ISSUE_URL.includes("94256"));
  assert.match(TITLE, /Windows|path-guard|D:\\|POSIX|Edit\/Write/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.270|Windows 10|Git Bash/i);
  assert.equal(BUILD, "Claude Code 2.1.270 (native Windows 10 Pro, Git Bash hooks)");
  assert.equal(SURFACE, "win-posix-mismatch");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:windows", "area:hooks"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Agraphia|#94251/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Gauntlet|#94029/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Lictor|#94053/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#89392/i.test(row)));
  assert.ok(EXPECTED.some((row) => /unify|settings\.json|scratchpad|D:\\/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /\$PWD|\$HOME|\/tmp\/claude|D:\\Dropbox|Git Bash|settings\.json|USER~1|deny/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("win-posix-mismatch"));
  assert.ok(FINGERPRINT_LINES.includes("allograph"));
  assert.equal(PHRASE, "Score allograph or admit equated.");
  assert.equal(SAMPLE_ALLOGRAPH_PROOF.winPosixMismatch, true);
  assert.equal(SAMPLE_ALLOGRAPH_PROOF.names.length, 6);
  assert.equal(PATH_PAIRS.length, 4);
  assert.equal(PATH_PAIRS[0].windows, "D:\\Dropbox\\project\\doc.tex");
  assert.equal(PATH_PAIRS[0].posix, "/d/Dropbox/project");
});

test("has-repro fingerprints encode the published allograph proof", () => {
  const result = handle(seedAllograph());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "win-posix-mismatch");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedAllograph()),
    /allograph\|kind=win-posix-mismatch\|ref=prefix-fail\|path=win-posix-mismatch\|cue=win-posix-mismatch/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and agraphia/gauntlet/lictor", () => {
  const required = [
    "penned",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "intact",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "thimblerig",
    "fetchling",
    "palilalia",
    "sepulchre",
    "proscription",
    "rasure",
    "rasura",
    "pre-tool-omit",
    "attach-mouse",
    "picker-bypass",
    "sallyport",
    "anarthria",
    "wicket",
    "hasp",
    "ward",
    "veto",
    "interdict",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("equated booth flips allograph back when the ledger admits equated", () => {
  const tape = {
    equated: true,
    allograph: false,
    winPosixMismatch: false,
    cue: "equated",
  };
  assert.equal(scoreGate(tape).verdict, "equated");
  tape.equated = false;
  tape.allograph = true;
  tape.winPosixMismatch = true;
  tape.cue = "allograph";
  assert.equal(scoreGate(tape).verdict, "allograph");
  tape.equated = true;
  tape.allograph = false;
  tape.winPosixMismatch = false;
  tape.cue = "equated";
  assert.equal(scoreGate(tape).verdict, "equated");
});

test("lockout, prefix, scratchpad, deny, and readBooth mark the allograph proof", () => {
  const punch = inspectWindowsPath({ allograph: true });
  assert.equal(punch.stamp, "win-punch");
  const prefix = inspectPrefix({ allograph: true, prefixFail: true });
  assert.equal(prefix.stamp, "prefix-fail");
  assert.equal(prefix.failed, true);
  const lock = inspectLockout({ allograph: true, settingsLockout: true });
  assert.equal(lock.stamp, "settings-lockout");
  const booth = readBooth({
    allograph: true,
    winPosixMismatch: true,
    prefixFail: true,
  });
  assert.equal(booth.allograph, true);
  assert.equal(booth.mark, "allograph");
  const open = readBooth({
    equated: true,
    allograph: false,
    winPosixMismatch: false,
  });
  assert.equal(open.allograph, false);
  assert.equal(open.mark, "equated");
  assert.equal(inspectScratchpad({ allograph: true, scratchpadTemp: true }).stamp, "scratchpad-temp");
  assert.equal(inspectDeny({ allograph: true, denyMessageOnly: true }).stamp, "deny-message-only");
  assert.equal(inspectPath({ allograph: true, winPosixMismatch: true }).stamp, "path-mismatch");
});

test("mapLedger encodes the published unmatched allographs", () => {
  const miss = mapLedger({ allograph: true, winPosixMismatch: true });
  assert.equal(miss.stamp, "win-posix-mismatch");
  assert.equal(miss.holdingLane, "prefix-fail");
  assert.equal(miss.ribbon, "allograph");
  const clear = mapLedger({ equated: true, allograph: false });
  assert.equal(clear.stamp, "equated-ledger");
  assert.equal(clear.kindLane, "matched");
  assert.equal(clear.holdingLane, "samepath");
});

test("cousins cite #89392 #88578 #90122 #93356 #79414 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 89392);
  assert.equal(COUSINS[1].issue, 88578);
  assert.equal(COUSINS[2].issue, 90122);
  assert.equal(COUSINS[3].issue, 93356);
  assert.equal(COUSINS[4].issue, 79414);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("lictor"));
  assert.ok(NOT_PRODUCTS.includes("lychgate"));
  assert.ok(NOT_PRODUCTS.includes("palilalia"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[5].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94256));
  assert.ok(!BACKUPS.some((row) => row.issue === 89392));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
  assert.equal(classify(seedDenyMessageOnly()), "deny-message-only");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/allograph.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const equatedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/equated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(equatedFix.status, 0, equatedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const equatedOut = JSON.parse(equatedFix.stdout);
  assert.equal(idleOut.verdict, "equated");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "allograph");
  assert.equal(seededOut.alarm, true);
  assert.equal(equatedOut.verdict, "equated");
  assert.equal(equatedOut.hold, true);
  assert.match(equatedOut.phrase, /admit equated/);
});

test("handle exposes published hypothesis and #94256 headline", () => {
  const result = handle(seedAllograph());
  assert.equal(result.published.issue, 94256);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [89392, 88578, 90122, 93356, 79414]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94256));
  assert.match(
    result.published.hypothesis,
    /path-guard|POSIX|\$PWD|NON-BINDING|#94256/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94256/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the equated page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("equated page is a type-foundry dual-script ledger, not agraphia clinic or gauntlet", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /allograph|equated|win-posix-mismatch|win-punch|posix-matrix|prefix-fail|settings-lockout|scratchpad-temp|foundry-ledger/i,
  );
  assert.match(page, /#F3E6C9|#1C1612|#B87333|#3D5A73/i);
  assert.match(page, /\bequated\b/);
  assert.match(page, /\ballograph\b/);
  assert.match(page, /win-posix-mismatch/);
  assert.match(page, /Score allograph or admit equated/i);
  assert.match(page, /#363/);
  assert.match(page, /#94256/);
  assert.match(page, /Admit equated/);
  assert.match(page, /Score allograph/);
  assert.match(page, /Walk win-posix-mismatch/);
  assert.match(page, /Compare equated \/ allograph/);
  assert.match(page, /Pin idle equated/);
  assert.match(page, /Pin seeded allograph/);
  assert.match(page, /Pin win-posix-mismatch/);
  assert.match(page, /Cut the punch/);
  assert.match(page, /Score booth/);
  assert.match(page, /allograph-score/);
  assert.match(
    page,
    /D:\\Dropbox|\/d\/Dropbox|settings\.json|USER~1|\$PWD|Git Bash/i,
  );
  assert.match(page, /win-punch|posix-matrix|prefix-fail|settings-lockout|scratchpad-temp|foundry-ledger/i);
  assert.match(
    page,
    /<svg[\s\S]*class="win-punch"|class="posix-matrix"|class="prefix-fail"|class="settings-lockout"|class="scratchpad-temp"|class="foundry-ledger"/i,
  );
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /#F4F1EA|#D4A04A|#8B1E2D/);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /admit ungloved|Score gauntlet|idle ungloved/i);
  assert.doesNotMatch(page, /admit attested|Score lictor|idle attested/i);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\blictor\b/);
  assert.doesNotMatch(page, /\blychgate\b/);
  assert.doesNotMatch(page, /\bpalilalia\b/);
  assert.doesNotMatch(page, /pre-tool-omit/);
  assert.doesNotMatch(page, /attach-mouse/);
  assert.doesNotMatch(page, /picker-bypass/);
  assert.match(page, /NOT Agraphia/i);
  assert.match(page, /NOT Gauntlet/i);
  assert.match(page, /NOT Lictor/i);
  assert.match(page, /#89392/);
  assert.match(page, /#88578/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Allograph/);
  assert.match(readme, /#94256/);
  assert.match(readme, /\bequated\b/);
  assert.match(readme, /\ballograph\b/);
  assert.match(readme, /win-posix-mismatch/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Crimson Pro/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Karla/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /\$PWD|Git Bash|settings\.json|D:\\/i);
  assert.match(readme, /NOT Agraphia\/#94251/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Lictor\/#94053/);
  assert.match(readme, /#89392/);
  assert.match(readme, /#88578/);
  assert.match(readme, /#90122/);
  assert.match(readme, /#93356/);
  assert.match(readme, /#79414/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/allograph/);
  assert.match(readme, /node --test projects\/allograph\/allograph\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /punchcutter|type-foundry|dual-script/i);
  assert.match(readme, /Score allograph or admit equated/);
  assert.match(readme, /#93987|#93924|#93770|#93777|#94151|#94064/);
  assert.doesNotMatch(readme, /backup #94256|#94256 as next/);
  assert.match(readme, /23:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bagraphia\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Allograph/);
  assert.match(runLog, /23:50/);
});

test("catalog features Allograph only; Agraphia unfeatured; product count 363", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 363);
  assert.equal(hub.products.length, 363);
  assert.equal(catalog.products[0].name, "Allograph");
  assert.equal(catalog.products[0].slug, "allograph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/allograph/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "23:50 allograph: a type-foundry / punchcutter / dual-script ledger booth for #94256. Shared PreToolUse guard for Edit|Write|NotebookEdit allows only $PWD/*, $HOME/.claude/*, /tmp/claude-*. Works on Linux. On Windows+Git Bash, tool_input.file_path arrives as Windows paths (D:\\...) while $PWD/$HOME in the hook shell are POSIX (/d/...). String prefix match fails closed — every in-project Edit/Write denied, including .claude/settings.json. Idle equated / seeded allograph / path win-posix-mismatch. Score allograph or admit equated.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bequated\b/);
  assert.match(catalog.products[0].summary, /\ballograph\b/);
  assert.match(catalog.products[0].summary, /win-posix-mismatch/);
  assert.match(catalog.products[0].summary, /Score allograph or admit equated/);
  assert.match(catalog.products[0].summary, /#94256/);
  assert.equal(hub.products[0].slug, "allograph");
  assert.equal(hub.products[0].featured, true);
  const agraphia = catalog.products.find((row) => row.slug === "agraphia");
  assert.ok(agraphia);
  assert.equal(agraphia.featured, false);
  const gauntlet = catalog.products.find((row) => row.slug === "gauntlet");
  assert.ok(gauntlet);
  assert.equal(gauntlet.featured, false);
  const lictor = catalog.products.find((row) => row.slug === "lictor");
  assert.ok(lictor);
  assert.equal(lictor.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "allograph").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94256") && row.slug !== "allograph",
    ),
  );
});

test("vercel rewrites allograph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/allograph");
  assert.equal(vercel.rewrites[0].destination, "/projects/allograph");
  assert.equal(vercel.rewrites[1].source, "/allograph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/allograph");
  assert.equal(vercel.rewrites[2].source, "/allograph/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/allograph/:path*");
  assert.equal(vercel.rewrites[3].source, "/agraphia");
  assert.equal(vercel.rewrites[3].destination, "/projects/agraphia");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
