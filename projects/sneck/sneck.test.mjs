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
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_SNECK_PROOF,
  SEEDED_WORD,
  SNECK_WALK,
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
  inspectDismiss,
  inspectHide,
  inspectLatch,
  inspectSetting,
  inspectTab,
  mapStoop,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedChipDismissEphemeral,
  seedCleared,
  seedDismissSelection,
  seedHold,
  seedProduct,
  seedSneck,
  seedTabReturn,
} from "./sneck.mjs";

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
  return fileURLToPath(new URL("./sneck.mjs", import.meta.url));
}

test("idle cleared is a hold; Hide still held", () => {
  const result = analyze(seedCleared());
  assert.equal(result.verdict, "cleared");
  assert.equal(result.idleWord, "cleared");
  assert.equal(IDLE_WORD, "cleared");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.cleared, true);
  assert.equal(result.phrase, "admit cleared");
  assert.equal(result.sneck, false);
  assert.equal(result.chipDismissEphemeral, false);
  assert.ok(HOLD_ALIASES.includes("cleared"));
  assert.ok(HOLD_ALIASES.includes("undone"));
  assert.ok(HOLD_ALIASES.includes("open-latch"));
  assert.ok(HOLD_ALIASES.includes("stayed-off"));
  assert.ok(HOLD_ALIASES.includes("withheld"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify cleared", () => {
  assert.equal(classify(emptyTicket()), "cleared");
  assert.equal(classify(""), "cleared");
  assert.equal(classify(null), "cleared");
  assert.equal(decide({}), "cleared");
});

test("#94052 seeded path scores sneck when Hide is replaced by an ephemeral X", () => {
  const result = analyze(seedSneck());
  assert.equal(result.verdict, "sneck");
  assert.equal(result.seededWord, "sneck");
  assert.equal(SEEDED_WORD, "sneck");
  assert.equal(PRODUCT_WORD, "sneck");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.sneck, true);
  assert.equal(result.phrase, "score sneck");
  assert.equal(result.chipDismissEphemeral, true);
  assert.equal(result.tabReturn, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark sprung latch and tab-return", () => {
  const latch = inspectLatch({ sneck: true, chipDismissEphemeral: true });
  assert.equal(latch.stamp, "latch-sprung");
  assert.equal(latch.sprung, true);
  const dismiss = inspectDismiss({ sneck: true, dismissSelection: true });
  assert.equal(dismiss.stamp, "dismiss-selection");
  assert.equal(dismiss.ephemeral, true);
  const tab = inspectTab({ sneck: true, tabReturn: true });
  assert.equal(tab.stamp, "tab-return");
  const scored = scoreGate({
    sneck: true,
    chipDismissEphemeral: true,
    tabReturn: true,
    dismissSelection: true,
    cue: "sneck",
  });
  assert.equal(scored.verdict, "sneck");
  const open = inspectLatch({ cleared: true, sneck: false });
  assert.equal(open.stamp, "latch-undone");
});

test("path word is chip-dismiss-ephemeral; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "chip-dismiss-ephemeral");
  const result = analyze(seedChipDismissEphemeral());
  assert.equal(result.verdict, "chip-dismiss-ephemeral");
  assert.equal(result.pathWord, "chip-dismiss-ephemeral");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "chip-dismiss-ephemeral", preferSeed: true, sneck: true }),
    "chip-dismiss-ephemeral",
  );
  assert.equal(classify(seedTabReturn()), "tab-return");
});

test("HOLD includes cleared / hold", () => {
  assert.ok(HOLD.includes("cleared"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: dismiss-selection, tab-return, sneck", () => {
  assert.equal(classify(seedDismissSelection()), "dismiss-selection");
  assert.equal(classify(seedTabReturn()), "tab-return");
  assert.equal(classify(seedProduct()), "sneck");
});

test("booth fixtures flip cleared vs sneck vs chip-dismiss-ephemeral", () => {
  const idle = scoreGate(seedCleared());
  const seeded = scoreGate(seedSneck());
  const cleared = readData("cleared.json");
  const sneck = readData("sneck.json");
  const path = readData("chip-dismiss-ephemeral.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "cleared");
  assert.equal(seeded.verdict, "sneck");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCleared()), "cleared");
  assert.equal(score(seedSneck()), "sneck");
  assert.equal(cleared.chipDismissEphemeral, false);
  assert.equal(cleared.cleared, true);
  assert.equal(scoreGate(cleared).verdict, "cleared");
  assert.equal(sneck.chipDismissEphemeral, true);
  assert.equal(sneck.tabReturn, true);
  assert.equal(sneck.dismissSelection, true);
  assert.equal(classify(sneck), "sneck");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /cleared|undone|open-latch|stayed-off|withheld/i);
  assert.match(path.paths[1].result, /dismissedSelection|applySelectionUpdate|same file|tab/i);
  assert.equal(classify(path), "chip-dismiss-ephemeral");
  assert.equal(sneck.hubCount, "SNECK");
  assert.equal(sneck.issue, 94052);
  assert.equal(sneck.sneck, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("undone.json")), "undone");
  assert.equal(classify(readData("open-latch.json")), "open-latch");
  assert.equal(classify(readData("stayed-off.json")), "stayed-off");
  assert.equal(classify(readData("withheld.json")), "withheld");
  assert.equal(classify(readData("hide-toggle.json")), "hide-toggle");
  assert.equal(classify(readData("dismiss-selection.json")), "dismiss-selection");
  assert.equal(classify(readData("dismissed-selection.json")), "dismissed-selection");
  assert.equal(classify(readData("apply-selection-update.json")), "apply-selection-update");
  assert.equal(classify(readData("per-file-scope.json")), "per-file-scope");
  assert.equal(classify(readData("tab-return.json")), "tab-return");
  assert.equal(classify(readData("composer-chip.json")), "composer-chip");
  assert.equal(classify(readData("no-setting.json")), "no-setting");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("cleared"));
  assert.ok(CHIPS.includes("sneck"));
  assert.ok(CHIPS.includes("chip-dismiss-ephemeral"));
  assert.ok(CHIPS.includes("tab-return"));
  assert.ok(CHIPS.includes("dismiss-selection"));
  assert.ok(CHIPS.includes("undone"));
  assert.ok(CHIPS.includes("open-latch"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("sneck"));
  assert.ok(ALARM.includes("chip-dismiss-ephemeral"));
  assert.ok(ALARM.includes("tab-return"));
  assert.ok(ALARM.includes("dismiss-selection"));
  assert.ok(ALARM.includes("no-setting"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published sneck walk scores sneck after the idle hold", () => {
  const booth = scoreWalk({ rows: SNECK_WALK });
  assert.equal(booth.verdict, "sneck");
  assert.ok(booth.sneckCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-cleared");
  assert.equal(idle.cleared, true);
  assert.equal(idle.verdict, "cleared");
  const cut = booth.rows.find((row) => row.event === "chip-dismiss-ephemeral");
  assert.equal(cut.chipDismissEphemeral, true);
  const path = booth.rows.find((row) => row.event === "chip-dismiss-ephemeral" && row.t === "path");
  assert.equal(path.verdict, "chip-dismiss-ephemeral");
});

test("SNECK_WALK constant matches the issue latch walk", () => {
  assert.equal(SNECK_WALK[0].event, "cue-cleared");
  const cut = SNECK_WALK.find((row) => row.event === "chip-dismiss-ephemeral");
  assert.equal(cut.chipDismissEphemeral || cut.applySelectionUpdate, true);
  const path = SNECK_WALK.find((row) => row.t === "path");
  assert.equal(path.sneck, true);
  const scoreRow = SNECK_WALK.find((row) => row.event === "sneck");
  assert.equal(scoreRow.sneck, true);
});

test("positive control cleared latch stays cleared", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "cleared");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "cleared");
  const hold = walk.rows.find((row) => row.event === "cue-cleared");
  assert.equal(hold.cleared, true);
  assert.equal(hold.verdict, "cleared");
});

test("issue constants encode only #94052 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94052);
  assert.ok(ISSUE_URL.includes("94052"));
  assert.match(TITLE, /Hide toggle|current-file chip|opt-out/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /VS Code|current-file chip/i);
  assert.equal(BUILD, "2.1.270");
  assert.equal(SURFACE, "chip-dismiss-ephemeral");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:windows", "area:ide", "platform:vscode"],
  );
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Drawbridge|#94049/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Chirograph|#94045/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Snib/i.test(row)));
  assert.ok(EXPECTED.some((row) => /Hide|persist|autoAttachActiveFile|setting/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.268|dismissSelection|applySelectionUpdate|a\.md|b\.ts|17 settings|Hide toggle/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("chip-dismiss-ephemeral"));
  assert.ok(FINGERPRINT_LINES.includes("sneck"));
  assert.equal(PHRASE, "Score sneck or admit cleared.");
  assert.equal(SAMPLE_SNECK_PROOF.chipDismissEphemeral, true);
});

test("has-repro fingerprints encode the published sneck proof", () => {
  const result = handle(seedSneck());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "chip-dismiss-ephemeral");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSneck()),
    /sneck\|kind=chip-dismiss-ephemeral\|ref=ephemeral\|path=chip-dismiss-ephemeral\|cue=chip-dismiss-ephemeral/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes spanned/matched/inscribed and recent catalog words", () => {
  const required = [
    "spanned",
    "drawbridge",
    "rc-bridge-update-drop",
    "matched",
    "chirograph",
    "worktree-rename-stale",
    "inscribed",
    "titulus",
    "berthed",
    "pegged",
    "tempered",
    "quiescent",
    "diplomatic",
    "demesned",
    "diagrammed",
    "unattainted",
    "reflowed",
    "articulate",
    "limber",
    "filiated",
    "injective",
    "unitary",
    "verbatim",
    "plenary",
    "vested",
    "snib",
    "hasp",
    "fibula",
    "cockade",
    "mondegreen",
    "diplopia",
    "fulcrum",
    "followspot",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("cleared booth flips sneck back when the latch is cleared", () => {
  const tape = {
    cleared: true,
    sneck: false,
    chipDismissEphemeral: false,
    cue: "cleared",
  };
  assert.equal(scoreGate(tape).verdict, "cleared");
  tape.cleared = false;
  tape.sneck = true;
  tape.chipDismissEphemeral = true;
  tape.tabReturn = true;
  tape.cue = "sneck";
  assert.equal(scoreGate(tape).verdict, "sneck");
  tape.cleared = true;
  tape.sneck = false;
  tape.chipDismissEphemeral = false;
  tape.tabReturn = false;
  tape.cue = "cleared";
  assert.equal(scoreGate(tape).verdict, "cleared");
});

test("latch, dismiss, tab, and readBooth mark the sneck proof", () => {
  const idle = inspectLatch({
    cleared: true,
  });
  assert.equal(idle.stamp, "latch-undone");
  const dismiss = inspectDismiss({ sneck: true, dismissSelection: true });
  assert.equal(dismiss.stamp, "dismiss-selection");
  assert.equal(dismiss.ephemeral, true);
  const tab = inspectTab({ sneck: true, tabReturn: true });
  assert.equal(tab.stamp, "tab-return");
  const booth = readBooth({
    sneck: true,
    chipDismissEphemeral: true,
    tabReturn: true,
  });
  assert.equal(booth.sneck, true);
  assert.equal(booth.mark, "sneck");
  const open = readBooth({
    cleared: true,
    sneck: false,
    chipDismissEphemeral: false,
  });
  assert.equal(open.sneck, false);
  assert.equal(open.mark, "cleared");
  assert.equal(inspectHide({ sneck: true, hideToggle: true }).stamp, "hide-toggle");
  assert.equal(inspectSetting({ sneck: true, noSetting: true }).stamp, "no-setting");
});

test("mapStoop encodes the published spring sneck", () => {
  const miss = mapStoop({ sneck: true, chipDismissEphemeral: true });
  assert.equal(miss.stamp, "chip-dismiss-ephemeral");
  assert.equal(miss.holdingLane, "spring");
  assert.equal(miss.ribbon, "sneck");
  const clear = mapStoop({ cleared: true, sneck: false });
  assert.equal(clear.stamp, "cleared-latch");
  assert.equal(clear.kindLane, "open-latch");
  assert.equal(clear.holdingLane, "stayed-off");
});

test("cousins cite #82492 #93667 #40869 #24726 #92516 #20886 #26577 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 82492);
  assert.equal(COUSINS[1].issue, 93667);
  assert.equal(COUSINS[2].issue, 40869);
  assert.equal(COUSINS[3].issue, 24726);
  assert.equal(COUSINS[4].issue, 92516);
  assert.equal(COUSINS[5].issue, 20886);
  assert.equal(COUSINS[6].issue, 26577);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("drawbridge"));
  assert.ok(NOT_PRODUCTS.includes("chirograph"));
  assert.ok(NOT_PRODUCTS.includes("titulus"));
  assert.ok(NOT_PRODUCTS.includes("snib"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("fibula"));
  assert.ok(NOT_PRODUCTS.includes("cockade"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("fulcrum"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94041);
  assert.equal(BACKUPS[1].issue, 94040);
  assert.equal(BACKUPS[2].issue, 94032);
  assert.equal(BACKUPS[3].issue, 94031);
  assert.equal(BACKUPS[4].issue, 94029);
  assert.equal(BACKUPS[5].issue, 93987);
  assert.equal(BACKUPS[6].issue, 93924);
  assert.equal(BACKUPS[7].issue, 93770);
  assert.equal(BACKUPS[8].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94052));
  assert.ok(!BACKUPS.some((row) => row.issue === 82492));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sneck.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const clearedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cleared.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(clearedFix.status, 0, clearedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const clearedOut = JSON.parse(clearedFix.stdout);
  assert.equal(idleOut.verdict, "cleared");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "sneck");
  assert.equal(seededOut.alarm, true);
  assert.equal(clearedOut.verdict, "cleared");
  assert.equal(clearedOut.hold, true);
  assert.match(clearedOut.phrase, /admit cleared/);
});

test("handle exposes published hypothesis and #94052 headline", () => {
  const result = handle(seedSneck());
  assert.equal(result.published.issue, 94052);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [82492, 93667, 40869, 24726, 92516, 20886, 26577]);
  assert.ok(result.published.backups.includes(94041));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(!result.published.backups.includes(94052));
  assert.match(result.published.hypothesis, /dismissSelection|applySelectionUpdate|per-file|NON-BINDING|#94052/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94052/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Northern cottage door booth, not castle gatehouse or lectern or snib", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.match(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.match(page, /sneck|cleared|chip-dismiss-ephemeral|cottage|stoop|brass/i);
  assert.match(page, /#2F343B|#8B6914|#C4A35A|#B08D57|#E8E0D5|#1C1F24|#5B7C99|#12141A/i);
  assert.match(page, /\bcleared\b/);
  assert.match(page, /\bsneck\b/);
  assert.match(page, /chip-dismiss-ephemeral/);
  assert.match(page, /Score sneck or admit cleared/i);
  assert.match(page, /#348/);
  assert.match(page, /#94052/);
  assert.match(page, /Admit cleared/);
  assert.match(page, /Score sneck/);
  assert.match(page, /Walk chip-dismiss-ephemeral/);
  assert.match(page, /Compare cleared \/ sneck/);
  assert.match(page, /Pin idle cleared/);
  assert.match(page, /Pin seeded sneck/);
  assert.match(page, /Pin chip-dismiss-ephemeral/);
  assert.match(page, /Lift the sneck/);
  assert.match(page, /Score booth/);
  assert.match(page, /sneck-score/);
  assert.match(page, /dismissSelection|applySelectionUpdate|a\.md|b\.ts|2\.1\.268|Hide toggle|17 settings/i);
  assert.match(page, /cottage|stoop|brass|wool|slate|oak plank|sneck/i);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Forum|Forum/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /#C9C2B2/);
  assert.doesNotMatch(page, /#8B3A2A/);
  assert.doesNotMatch(page, /#C9842A/);
  assert.doesNotMatch(page, /#E8D7B0/);
  assert.doesNotMatch(page, /#A11F38/);
  assert.doesNotMatch(page, /battlement|merlon|portcullis|bailey|gatehouse|crenel/i);
  assert.doesNotMatch(page, /lectern|parchment|indenture|moiety/i);
  assert.doesNotMatch(page, /night-latch/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.match(page, /NOT Drawbridge/i);
  assert.match(page, /NOT Chirograph/i);
  assert.match(page, /NOT Snib/i);
  assert.match(page, /NOT Titulus/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Sneck/);
  assert.match(readme, /#94052/);
  assert.match(readme, /\bcleared\b/);
  assert.match(readme, /\bsneck\b/);
  assert.match(readme, /chip-dismiss-ephemeral/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /CHIP-DISMISS-EPHEMERAL|HIDE TOGGLE REPLACED/i);
  assert.match(readme, /NOT Drawbridge\/#94049/);
  assert.match(readme, /NOT Chirograph\/#94045/);
  assert.match(readme, /NOT Snib/);
  assert.match(readme, /#82492|#93667|#40869|#24726|#92516|#20886|#26577/);
  assert.match(readme, /2\.1\.268|dismissSelection|a\.md|Hide toggle/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/sneck/);
  assert.match(readme, /node --test projects\/sneck\/sneck\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /cottage|stoop|brass|sneck/i);
  assert.match(readme, /Score sneck or admit cleared/);
  assert.match(readme, /#94041|#94040|#94032|#94031|#94029|#93987|#93924|#93770|#93777/);
  assert.match(readme, /07:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Sneck/);
  assert.match(runLog, /07:50/);
});

test("catalog features Sneck only; Drawbridge unfeatured; product count 348", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 348);
  assert.equal(hub.products.length, 348);
  assert.equal(catalog.products[0].name, "Sneck");
  assert.equal(catalog.products[0].slug, "sneck");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/sneck/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "07:50 sneck: a Northern cottage / workshop-door / brass-sneck-latch booth for #94052. VS Code 2.1.268 replaced the current-file chip Hide toggle with an X; dismissSelection stores dismissedSelection and applySelectionUpdate only suppresses re-attachment while that same file stays active, so a tab switch and return brings the chip back; there is no setting, command, keybinding, or env to stop auto-attach. Idle cleared / seeded sneck / path chip-dismiss-ephemeral. Score sneck or admit cleared.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bcleared\b/);
  assert.match(catalog.products[0].summary, /\bsneck\b/);
  assert.match(catalog.products[0].summary, /chip-dismiss-ephemeral/);
  assert.match(catalog.products[0].summary, /Score sneck or admit cleared/);
  assert.equal(hub.products[0].slug, "sneck");
  assert.equal(hub.products[0].featured, true);
  const drawbridge = catalog.products.find((row) => row.slug === "drawbridge");
  assert.ok(drawbridge);
  assert.equal(drawbridge.featured, false);
  const chirograph = catalog.products.find((row) => row.slug === "chirograph");
  assert.ok(chirograph);
  assert.equal(chirograph.featured, false);
  const titulus = catalog.products.find((row) => row.slug === "titulus");
  assert.ok(titulus);
  assert.equal(titulus.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "sneck").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94052") && row.slug !== "sneck"));
});

test("vercel rewrites sneck to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/sneck");
  assert.equal(vercel.rewrites[0].destination, "/projects/sneck");
  assert.equal(vercel.rewrites[1].source, "/sneck/");
  assert.equal(vercel.rewrites[1].destination, "/projects/sneck");
  assert.equal(vercel.rewrites[2].source, "/sneck/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/sneck/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
