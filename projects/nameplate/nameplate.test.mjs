import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  BUILD_VERSION,
  CHIPS,
  CLI_VERSION,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HANDLE_ERROR,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_WORKING,
  MISSING_RENAME,
  NAMEPLATE_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PLATE_NAMES,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_NAMEPLATE_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  adoptPersistedTitle,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectChannel,
  inspectHeader,
  inspectLedger,
  inspectList,
  inspectRollback,
  inspectThrow,
  mapPlate,
  readBooth,
  renameSessionOnCli,
  score,
  scoreGate,
  scoreHeaderRename,
  scoreWalk,
  seedAffixed,
  seedHold,
  seedHeaderRename,
  seedNameplate,
  seedProduct,
  seedTypeerrorEscape,
} from "./nameplate.mjs";

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
  return fileURLToPath(new URL("./nameplate.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "04:50 nameplate: a brass nameplate / hotel door-plate booth for #94349. VS Code header rename shows the new session title for one frame then reverts because query.renameSession is missing on the SDK query class (sync TypeError escapes before .catch; renameBaseline rolls back) while the title is already persisted and list-rename works. Idle affixed / seeded nameplate / path header-rename. Score nameplate or admit affixed.";

test("idle affixed is a hold; header rename sticks; plate keeps the new engraving", () => {
  const result = analyze(seedAffixed());
  assert.equal(result.verdict, "affixed");
  assert.equal(result.idleWord, "affixed");
  assert.equal(IDLE_WORD, "affixed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.affixed, true);
  assert.equal(result.phrase, "admit affixed");
  assert.equal(result.nameplate, false);
  assert.equal(result.headerRename, false);
  assert.ok(HOLD_ALIASES.includes("engraved"));
  assert.ok(HOLD_ALIASES.includes("hung"));
  assert.ok(HOLD_ALIASES.includes("plated"));
  assert.ok(HOLD_ALIASES.includes("labeled"));
  assert.ok(HOLD_ALIASES.includes("titled"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "equated");
  assert.notEqual(IDLE_WORD, "penned");
});

test("empty ticket and empty stdin classify affixed", () => {
  assert.equal(classify(emptyTicket()), "affixed");
  assert.equal(classify(""), "affixed");
  assert.equal(classify(null), "affixed");
  assert.equal(decide({}), "affixed");
});

test("#94349 seeded path scores nameplate when the header plate snaps back", () => {
  const result = analyze(seedNameplate());
  assert.equal(result.verdict, "nameplate");
  assert.equal(result.seededWord, "nameplate");
  assert.equal(SEEDED_WORD, "nameplate");
  assert.equal(PRODUCT_WORD, "nameplate");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.nameplate, true);
  assert.equal(result.phrase, "score nameplate");
  assert.equal(result.headerRename, true);
  assert.equal(result.typeErrorEscape, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "matryoshka");
  assert.notEqual(SEEDED_WORD, "dragnet");
  assert.notEqual(SEEDED_WORD, "matricula");
});

test("educational rename helper encodes published header vs list paths", () => {
  assert.equal(MISSING_RENAME, "TypeError: J.query.renameSession is not a function");
  assert.deepEqual(HANDLE_ERROR, { type: "error" });
  assert.equal(LAST_WORKING, "2.1.267");
  assert.equal(BUILD_VERSION, "2.1.270");
  assert.equal(CLI_VERSION, "2.1.238");
  const header = renameSessionOnCli({
    channelOnSession: true,
    renameSessionExists: false,
  });
  assert.equal(header.threw, true);
  assert.equal(header.caught, false);
  assert.equal(header.rollback, true);
  assert.equal(header.persisted, true);
  assert.equal(header.error, MISSING_RENAME);
  const list = renameSessionOnCli({
    channelOnSession: false,
    renameSessionExists: false,
  });
  assert.equal(list.threw, false);
  assert.equal(list.headerSticks, true);
  const hold = renameSessionOnCli({
    channelOnSession: true,
    renameSessionExists: false,
    affixed: true,
  });
  assert.equal(hold.threw, false);
  assert.equal(hold.headerSticks, true);
  const echo = adoptPersistedTitle({ summary: "New Room", newTitle: "New Room" });
  assert.equal(echo.earlyReturn, true);
  assert.equal(echo.adopted, false);
  const scored = scoreHeaderRename({
    origin: "header",
    hasLiveChannel: true,
    renameSessionExists: false,
  });
  assert.equal(scored.nameplate, true);
  assert.equal(scored.typeErrorEscape, true);
  const listPath = scoreHeaderRename({ origin: "list" });
  assert.equal(listPath.nameplate, false);
  assert.equal(listPath.listRenameOk, true);
});

test("inspectors mark TypeError escape and renameBaseline rollback", () => {
  const thrown = inspectThrow({ nameplate: true, typeErrorEscape: true });
  assert.equal(thrown.stamp, "typeerror-escape");
  assert.equal(thrown.escaped, true);
  const rollback = inspectRollback({ nameplate: true, renameBaselineRollback: true });
  assert.equal(rollback.stamp, "rename-baseline");
  assert.equal(rollback.rolled, true);
  const scored = scoreGate({
    nameplate: true,
    headerRename: true,
    typeErrorEscape: true,
    cue: "nameplate",
  });
  assert.equal(scored.verdict, "nameplate");
  const open = inspectHeader({ affixed: true, nameplate: false });
  assert.equal(open.stamp, "plate-affixed");
});

test("path word is header-rename; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "header-rename");
  const result = analyze(seedHeaderRename());
  assert.equal(result.verdict, "header-rename");
  assert.equal(result.pathWord, "header-rename");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "header-rename",
      preferSeed: true,
      nameplate: true,
    }),
    "header-rename",
  );
  assert.equal(classify({ seed: "typeerror-escape", preferSeed: true }), "typeerror-escape");
  assert.equal(score(seedHeaderRename()), "nameplate");
});

test("HOLD includes affixed / hold", () => {
  assert.ok(HOLD.includes("affixed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: typeerror-escape, header-rename, nameplate", () => {
  assert.equal(classify({ seed: "typeerror-escape", preferSeed: true }), "typeerror-escape");
  assert.equal(classify(seedHeaderRename()), "header-rename");
  assert.equal(classify(seedProduct()), "nameplate");
  assert.equal(classify(seedTypeerrorEscape()), "typeerror-escape");
});

test("booth fixtures flip affixed vs nameplate vs header-rename", () => {
  const idle = scoreGate(seedAffixed());
  const seeded = scoreGate(seedNameplate());
  const affixed = readData("affixed.json");
  const nameplate = readData("nameplate.json");
  const issued = readData("94349.json");
  const path = readData("header-rename.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "affixed");
  assert.equal(seeded.verdict, "nameplate");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAffixed()), "affixed");
  assert.equal(score(seedNameplate()), "nameplate");
  assert.equal(score({ seed: "header-rename", preferSeed: true }), "nameplate");
  assert.equal(affixed.headerRename, false);
  assert.equal(affixed.affixed, true);
  assert.equal(scoreGate(affixed).verdict, "affixed");
  assert.equal(nameplate.headerRename, true);
  assert.equal(nameplate.typeErrorEscape, true);
  assert.equal(classify(nameplate), "nameplate");
  assert.equal(issued.issue, 94349);
  assert.equal(classify(issued), "nameplate");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /affixed|engraved|hung|plated|labeled|titled/i);
  assert.match(path.paths[1].result, /header-rename|TypeError|renameSession/i);
  assert.equal(classify(path), "header-rename");
  assert.equal(nameplate.hubCount, "NAMEPLATE");
  assert.equal(nameplate.issue, 94349);
  assert.equal(nameplate.nameplate, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("engraved.json")), "engraved");
  assert.equal(classify(readData("hung.json")), "hung");
  assert.equal(classify(readData("plated.json")), "plated");
  assert.equal(classify(readData("labeled.json")), "labeled");
  assert.equal(classify(readData("titled.json")), "titled");
  assert.equal(classify(readData("typeerror-escape.json")), "typeerror-escape");
  assert.equal(classify(readData("rename-baseline-rollback.json")), "rename-baseline-rollback");
  assert.equal(classify(readData("list-rename-ok.json")), "list-rename-ok");
  assert.equal(classify(readData("persisted-on-reload.json")), "persisted-on-reload");
  assert.equal(classify(readData("header-one-frame.json")), "header-one-frame");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94017, 94257, 94285, 88992]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("affixed"));
  assert.ok(CHIPS.includes("nameplate"));
  assert.ok(CHIPS.includes("header-rename"));
  assert.ok(CHIPS.includes("typeerror-escape"));
  assert.ok(CHIPS.includes("rename-baseline-rollback"));
  assert.ok(CHIPS.includes("engraved"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("nameplate"));
  assert.ok(ALARM.includes("header-rename"));
  assert.ok(ALARM.includes("typeerror-escape"));
  assert.ok(ALARM.includes("rename-baseline-rollback"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published nameplate walk scores nameplate after the idle hold", () => {
  const booth = scoreWalk({ rows: NAMEPLATE_WALK });
  assert.equal(booth.verdict, "nameplate");
  assert.ok(booth.nameplateCount >= 1);
  const idle = booth.rows.find((row) => row.event === "plate-affixed");
  assert.equal(idle.affixed, true);
  assert.equal(idle.verdict, "affixed");
  const cut = booth.rows.find((row) => row.event === "header-rename");
  assert.equal(cut.headerRename, true);
  const path = booth.rows.find(
    (row) => row.event === "header-rename" && row.t === "path",
  );
  assert.equal(path.verdict, "header-rename");
});

test("NAMEPLATE_WALK constant matches the issue corridor walk", () => {
  assert.equal(NAMEPLATE_WALK[0].event, "plate-affixed");
  const cut = NAMEPLATE_WALK.find((row) => row.event === "header-rename");
  assert.equal(cut.headerRename || cut.typeErrorEscape, true);
  const path = NAMEPLATE_WALK.find((row) => row.t === "path");
  assert.equal(path.nameplate, true);
  const scoreRow = NAMEPLATE_WALK.find((row) => row.event === "nameplate");
  assert.equal(scoreRow.nameplate, true);
  assert.equal(scoreRow.typeErrorEscape, true);
});

test("positive control affixed plate stays affixed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "affixed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "affixed");
  const hold = walk.rows.find((row) => row.event === "plate-affixed");
  assert.equal(hold.affixed, true);
  assert.equal(hold.verdict, "affixed");
});

test("issue constants encode only #94349 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94349);
  assert.ok(ISSUE_URL.includes("94349"));
  assert.match(TITLE, /Renaming a session|chat header|2\.1\.270/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.270|VS Code/i);
  assert.equal(BUILD, "VS Code extension 2.1.270 (CLI: 2.1.238)");
  assert.equal(SURFACE, "header-rename");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:ide", "platform:vscode", "regression"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(PLATE_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Matryoshka|#94350/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Dragnet|#94064/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Agraphia|#94251/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94336/i.test(row)));
  assert.ok(EXPECTED.some((row) => /header|persisted|renameSession|renameBaseline/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /renameSession|2\.1\.270|one frame|activity-bar|renameBaseline|TypeError/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("header-rename"));
  assert.ok(FINGERPRINT_LINES.includes("nameplate"));
  assert.equal(PHRASE, "Score nameplate or admit affixed.");
  assert.equal(SAMPLE_NAMEPLATE_PROOF.headerRename, true);
  assert.equal(SAMPLE_NAMEPLATE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published nameplate proof", () => {
  const result = handle(seedNameplate());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "header-rename");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedNameplate()),
    /nameplate\|kind=header-rename\|ref=rename-baseline-rollback\|path=header-rename\|cue=header-rename/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and unpacked/scoped/enrolled", () => {
  const required = [
    "unpacked",
    "descended",
    "recursed",
    "opened",
    "nested-ok",
    "walked-in",
    "scoped",
    "enrolled",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "intact",
    "matryoshka",
    "dragnet",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "frisket",
    "scant",
    "subst-nest",
    "root-find",
    "reload-blind",
    "win-posix-mismatch",
    "pre-tool-omit",
    "attach-mouse",
    "picker-bypass",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("affixed booth flips nameplate back when the plate admits affixed", () => {
  const tape = {
    affixed: true,
    nameplate: false,
    headerRename: false,
    cue: "affixed",
  };
  assert.equal(scoreGate(tape).verdict, "affixed");
  tape.affixed = false;
  tape.nameplate = true;
  tape.headerRename = true;
  tape.cue = "nameplate";
  assert.equal(scoreGate(tape).verdict, "nameplate");
  tape.affixed = true;
  tape.nameplate = false;
  tape.headerRename = false;
  tape.cue = "affixed";
  assert.equal(scoreGate(tape).verdict, "affixed");
});

test("header, ledger, throw, and readBooth mark the nameplate proof", () => {
  const header = inspectHeader({ nameplate: true });
  assert.equal(header.stamp, "header-plate");
  const thrown = inspectThrow({ nameplate: true, typeErrorEscape: true });
  assert.equal(thrown.stamp, "typeerror-escape");
  assert.equal(thrown.escaped, true);
  const ledger = inspectLedger({ nameplate: true, persistedOnReload: true });
  assert.equal(ledger.stamp, "front-desk");
  const booth = readBooth({
    nameplate: true,
    headerRename: true,
    typeErrorEscape: true,
  });
  assert.equal(booth.nameplate, true);
  assert.equal(booth.mark, "nameplate");
  const open = readBooth({
    affixed: true,
    nameplate: false,
    headerRename: false,
  });
  assert.equal(open.nameplate, false);
  assert.equal(open.mark, "affixed");
  assert.equal(inspectList({ nameplate: true, listRenameOk: true }).stamp, "activity-list");
  assert.equal(inspectRollback({ nameplate: true, renameBaselineRollback: true }).stamp, "rename-baseline");
  assert.equal(inspectChannel({ nameplate: true, liveChannel: true }).stamp, "live-channel");
});

test("mapPlate encodes the published header snap-back", () => {
  const miss = mapPlate({ nameplate: true, headerRename: true });
  assert.equal(miss.stamp, "header-rename");
  assert.equal(miss.holdingLane, "typeerror-escape");
  assert.equal(miss.ribbon, "nameplate");
  const clear = mapPlate({ affixed: true, nameplate: false });
  assert.equal(clear.stamp, "affixed-plate");
  assert.equal(clear.kindLane, "titled");
  assert.equal(clear.holdingLane, "engraved");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("matryoshka"));
  assert.ok(NOT_PRODUCTS.includes("dragnet"));
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[4].issue, 94348);
  assert.equal(BACKUPS[5].issue, 94336);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94349));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/nameplate.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const affixedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/affixed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(affixedFix.status, 0, affixedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const affixedOut = JSON.parse(affixedFix.stdout);
  assert.equal(idleOut.verdict, "affixed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "nameplate");
  assert.equal(seededOut.alarm, true);
  assert.equal(affixedOut.verdict, "affixed");
  assert.equal(affixedOut.hold, true);
  assert.match(affixedOut.phrase, /admit affixed/);
});

test("handle exposes published hypothesis and #94349 headline", () => {
  const result = handle(seedNameplate());
  assert.equal(result.published.issue, 94349);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [94017, 94257, 94285, 88992]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94348));
  assert.ok(result.published.backups.includes(94336));
  assert.ok(!result.published.backups.includes(94349));
  assert.match(
    result.published.hypothesis,
    /renameSession|TypeError|renameBaseline|NON-BINDING|#94349/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94349/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the affixed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("affixed page is a brass hotel door-plate, not matryoshka workshop or dragnet blotter", () => {
  const page = readPage();
  assert.match(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /Fragment\+Mono|Fragment Mono/);
  assert.match(
    page,
    /nameplate|affixed|header-rename|header-plate|front-desk|activity-list|typeerror-escape|rename-baseline|live-channel/i,
  );
  assert.match(page, /#B08D57|#F7F1E5|#3B1F14|#1A1A1A|#2F6F5E/i);
  assert.match(page, /\baffixed\b/);
  assert.match(page, /\bnameplate\b/);
  assert.match(page, /header-rename/);
  assert.match(page, /Score nameplate or admit affixed/i);
  assert.match(page, /#367/);
  assert.match(page, /#94349/);
  assert.match(page, /Admit affixed/);
  assert.match(page, /Score nameplate/);
  assert.match(page, /Walk header-rename/);
  assert.match(page, /Compare affixed \/ nameplate/);
  assert.match(page, /Pin idle affixed/);
  assert.match(page, /Pin seeded nameplate/);
  assert.match(page, /Pin header-rename/);
  assert.match(page, /Stamp TypeError/);
  assert.match(page, /Score booth/);
  assert.match(page, /nameplate-score/);
  assert.match(
    page,
    /renameSession|2\.1\.270|TypeError|one frame|activity-bar|renameBaseline/i,
  );
  assert.match(page, /header-plate|front-desk|activity-list|typeerror-escape|rename-baseline|live-channel/i);
  assert.match(
    page,
    /<svg[\s\S]*class="door-plate"|class="brass-screws"|class="hotel-corridor"|class="front-desk-ledger"|class="mahogany-door"|class="verdigris-hinge"/i,
  );
  assert.doesNotMatch(page, /family=Yeseva\+One|Yeseva One/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Archivo\+Black|Archivo Black/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#C41E3A|#F4E8D8|#1B2838|#D4A017|#2A2A2A/);
  assert.doesNotMatch(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/);
  assert.doesNotMatch(page, /lacquer nesting-doll|birch-workshop|gold leaf|indigo cloth/i);
  assert.doesNotMatch(page, /night blotter|caution tape|city-grid|police-fishing/i);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /admit unpacked|Score matryoshka|idle unpacked/i);
  assert.doesNotMatch(page, /admit scoped|Score dragnet|idle scoped/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /admit equated|Score allograph|idle equated/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /\bmatryoshka\b/);
  assert.doesNotMatch(page, /\bdragnet\b/);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /subst-nest/);
  assert.doesNotMatch(page, /root-find/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.match(page, /NOT Matryoshka/i);
  assert.match(page, /NOT Dragnet/i);
  assert.match(page, /NOT Matricula/i);
  assert.match(page, /NOT Allograph/i);
  assert.match(page, /#94017/);
  assert.match(page, /#94257/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Nameplate/);
  assert.match(readme, /#94349/);
  assert.match(readme, /\baffixed\b/);
  assert.match(readme, /\bnameplate\b/);
  assert.match(readme, /header-rename/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /Fragment Mono/);
  assert.doesNotMatch(readme, /Yeseva One/);
  assert.doesNotMatch(readme, /Archivo Black/);
  assert.doesNotMatch(readme, /Nunito/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /renameSession|2\.1\.270|TypeError|one frame/i);
  assert.match(readme, /NOT Matryoshka\/#94350/);
  assert.match(readme, /NOT Dragnet\/#94064/);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /#94017/);
  assert.match(readme, /#94257/);
  assert.match(readme, /#94285/);
  assert.match(readme, /no close cousins named|#94349/i);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/nameplate/);
  assert.match(readme, /node --test projects\/nameplate\/nameplate\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /brass|hotel|door-plate|mahogany|verdigris/i);
  assert.match(readme, /Score nameplate or admit affixed/);
  assert.match(readme, /#93924|#93770|#93777|#94151|#94348|#94336/);
  assert.doesNotMatch(readme, /backup #94349|#94349 as next/);
  assert.match(readme, /04:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bmatryoshka\b/);
  assert.doesNotMatch(readme, /\bdragnet\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Nameplate/);
  assert.match(runLog, /04:50/);
});

test("catalog features Nameplate only; Matryoshka unfeatured; product count 367", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 367);
  assert.equal(hub.products.length, 367);
  assert.equal(catalog.products[0].name, "Nameplate");
  assert.equal(catalog.products[0].slug, "nameplate");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/nameplate/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\baffixed\b/);
  assert.match(catalog.products[0].summary, /\bnameplate\b/);
  assert.match(catalog.products[0].summary, /header-rename/);
  assert.match(catalog.products[0].summary, /Score nameplate or admit affixed/);
  assert.match(catalog.products[0].summary, /#94349/);
  assert.equal(hub.products[0].slug, "nameplate");
  assert.equal(hub.products[0].featured, true);
  const matryoshka = catalog.products.find((row) => row.slug === "matryoshka");
  assert.ok(matryoshka);
  assert.equal(matryoshka.featured, false);
  const dragnet = catalog.products.find((row) => row.slug === "dragnet");
  assert.ok(dragnet);
  assert.equal(dragnet.featured, false);
  const matricula = catalog.products.find((row) => row.slug === "matricula");
  assert.ok(matricula);
  assert.equal(matricula.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "nameplate").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94349") && row.slug !== "nameplate",
    ),
  );
});

test("vercel rewrites nameplate to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/nameplate");
  assert.equal(vercel.rewrites[0].destination, "/projects/nameplate");
  assert.equal(vercel.rewrites[1].source, "/nameplate/");
  assert.equal(vercel.rewrites[1].destination, "/projects/nameplate");
  assert.equal(vercel.rewrites[2].source, "/nameplate/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/nameplate/:path*");
  assert.equal(vercel.rewrites[3].source, "/matryoshka");
  assert.equal(vercel.rewrites[3].destination, "/projects/matryoshka");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
