import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARRAS_WALK,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  BUILD_VERSION,
  BYPASS_ERROR,
  CHIPS,
  CLASSIFIER_DENY_SAMPLE,
  COUSINS,
  CURTAIN_NAMES,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HONEST_INCOMPLETE,
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
  SAMPLE_ARRAS_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  TOOL_DENIAL_KIND,
  USER_REFUSAL,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAisle,
  inspectBypass,
  inspectCard,
  inspectDagger,
  inspectHang,
  inspectRefusal,
  mapArras,
  readBooth,
  renderApproval,
  score,
  scoreGate,
  scorePhantomPrompt,
  scoreWalk,
  seedArras,
  seedBypassLie,
  seedCancelled,
  seedCleared,
  seedHold,
  seedPhantomPrompt,
  seedProduct,
  switchBypass,
} from "./arras.mjs";

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
  return fileURLToPath(new URL("./arras.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "08:50 arras: a theater / tapestry / curtain-aisle / gallery-wing booth for #94348. Desktop Code tab Auto mode: classifier-escalated tool calls never render an approval prompt — no card, no notification; the call sits running until the next chat message kills it as toolDenialKind cancelled with a fake user-refusal string. Mid-session Bypass Permissions toggle writes config and shows Bypass selected while the CLI rejects (session was not launched with --dangerously-skip-permissions). Idle cleared / seeded arras / path phantom-prompt. Score arras or admit cleared.";

test("idle cleared is a hold; approval card surfaced; aisle clear", () => {
  const result = analyze(seedCleared());
  assert.equal(result.verdict, "cleared");
  assert.equal(result.idleWord, "cleared");
  assert.equal(IDLE_WORD, "cleared");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.cleared, true);
  assert.equal(result.phrase, "admit cleared");
  assert.equal(result.arras, false);
  assert.equal(result.phantomPrompt, false);
  assert.ok(HOLD_ALIASES.includes("draped-open"));
  assert.ok(HOLD_ALIASES.includes("card-shown"));
  assert.ok(HOLD_ALIASES.includes("prompt-visible"));
  assert.ok(HOLD_ALIASES.includes("aisle-clear"));
  assert.ok(HOLD_ALIASES.includes("curtain-raised"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "armed");
  assert.notEqual(IDLE_WORD, "affixed");
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
});

test("empty ticket and empty stdin classify cleared", () => {
  assert.equal(classify(emptyTicket()), "cleared");
  assert.equal(classify(""), "cleared");
  assert.equal(classify(null), "cleared");
  assert.equal(decide({}), "cleared");
});

test("#94348 seeded path scores arras when the card hangs behind the tapestry", () => {
  const result = analyze(seedArras());
  assert.equal(result.verdict, "arras");
  assert.equal(result.seededWord, "arras");
  assert.equal(SEEDED_WORD, "arras");
  assert.equal(PRODUCT_WORD, "arras");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.arras, true);
  assert.equal(result.phrase, "score arras");
  assert.equal(result.phantomPrompt, true);
  assert.equal(result.cardHidden, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "frangible");
  assert.notEqual(SEEDED_WORD, "nameplate");
  assert.notEqual(SEEDED_WORD, "matryoshka");
  assert.notEqual(SEEDED_WORD, "dragnet");
});

test("educational approval helper encodes published card-shown vs phantom-prompt paths", () => {
  assert.match(USER_REFUSAL, /doesn.t want to take this action/i);
  assert.equal(TOOL_DENIAL_KIND, "cancelled");
  assert.match(BYPASS_ERROR, /bypassPermissions/);
  assert.match(BYPASS_ERROR, /dangerously-skip-permissions/);
  assert.equal(CLASSIFIER_DENY_SAMPLE, "[Self-Modification]");
  assert.equal(HONEST_INCOMPLETE, "did not complete");
  assert.equal(BUILD_VERSION, "2.1.270");
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  const hung = renderApproval({ cleared: false, cardVisible: false });
  assert.equal(hung.cardVisible, false);
  assert.equal(hung.running, true);
  assert.equal(hung.cancelled, true);
  assert.equal(hung.denialKind, TOOL_DENIAL_KIND);
  assert.equal(hung.refusal, USER_REFUSAL);
  assert.equal(hung.honest, false);
  const control = renderApproval({ cleared: true, cardVisible: true });
  assert.equal(control.cardVisible, true);
  assert.equal(control.cancelled, false);
  assert.equal(control.honest, true);
  const hold = renderApproval({
    cleared: true,
    cardVisible: false,
  });
  assert.equal(hold.cardVisible, true);
  const scored = scorePhantomPrompt({
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
  });
  assert.equal(scored.arras, true);
  assert.equal(scored.cardHidden, true);
  const clearedPath = scorePhantomPrompt({ cleared: true });
  assert.equal(clearedPath.arras, false);
  assert.equal(clearedPath.cleared, true);
  const lie = switchBypass({ uiOn: true, launchedWithDangerouslySkip: false });
  assert.equal(lie.cliAccepted, false);
  assert.equal(lie.lie, true);
  assert.equal(lie.shouldShow, false);
  const honest = switchBypass({ uiOn: true, launchedWithDangerouslySkip: true });
  assert.equal(honest.cliAccepted, true);
  assert.equal(honest.lie, false);
});

test("inspectors mark card hidden and next-message dagger", () => {
  const card = inspectCard({ arras: true, cardHidden: true });
  assert.equal(card.stamp, "phantom-card");
  assert.equal(card.hidden, true);
  const dagger = inspectDagger({ arras: true, cancelled: true });
  assert.equal(dagger.stamp, "next-dagger");
  assert.equal(dagger.stabbed, true);
  const scored = scoreGate({
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
    cue: "arras",
  });
  assert.equal(scored.verdict, "arras");
  const open = inspectAisle({ cleared: true, arras: false });
  assert.equal(open.stamp, "aisle-cleared");
});

test("path word is phantom-prompt; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "phantom-prompt");
  const result = analyze(seedPhantomPrompt());
  assert.equal(result.verdict, "phantom-prompt");
  assert.equal(result.pathWord, "phantom-prompt");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "phantom-prompt",
      preferSeed: true,
      arras: true,
    }),
    "phantom-prompt",
  );
  assert.equal(classify({ seed: "cancelled", preferSeed: true }), "cancelled");
  assert.equal(score(seedPhantomPrompt()), "arras");
});

test("HOLD includes cleared / hold", () => {
  assert.ok(HOLD.includes("cleared"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: cancelled, phantom-prompt, arras", () => {
  assert.equal(classify({ seed: "cancelled", preferSeed: true }), "cancelled");
  assert.equal(classify(seedPhantomPrompt()), "phantom-prompt");
  assert.equal(classify(seedProduct()), "arras");
  assert.equal(classify(seedCancelled()), "cancelled");
  assert.equal(classify(seedBypassLie()), "bypass-lie");
});

test("booth fixtures flip cleared vs arras vs phantom-prompt", () => {
  const idle = scoreGate(seedCleared());
  const seeded = scoreGate(seedArras());
  const cleared = readData("cleared.json");
  const arras = readData("arras.json");
  const issued = readData("94348.json");
  const path = readData("phantom-prompt.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "cleared");
  assert.equal(seeded.verdict, "arras");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCleared()), "cleared");
  assert.equal(score(seedArras()), "arras");
  assert.equal(score({ seed: "phantom-prompt", preferSeed: true }), "arras");
  assert.equal(cleared.phantomPrompt, false);
  assert.equal(cleared.cleared, true);
  assert.equal(scoreGate(cleared).verdict, "cleared");
  assert.equal(arras.phantomPrompt, true);
  assert.equal(arras.cardHidden, true);
  assert.equal(classify(arras), "arras");
  assert.equal(issued.issue, 94348);
  assert.equal(classify(issued), "arras");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /cleared|draped-open|card-shown|prompt-visible|aisle-clear|curtain-raised/i);
  assert.match(path.paths[1].result, /phantom-prompt|cancelled|card-hidden/i);
  assert.equal(classify(path), "phantom-prompt");
  assert.equal(arras.hubCount, "ARRAS");
  assert.equal(arras.issue, 94348);
  assert.equal(arras.arras, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("draped-open.json")), "draped-open");
  assert.equal(classify(readData("card-shown.json")), "card-shown");
  assert.equal(classify(readData("prompt-visible.json")), "prompt-visible");
  assert.equal(classify(readData("aisle-clear.json")), "aisle-clear");
  assert.equal(classify(readData("curtain-raised.json")), "curtain-raised");
  assert.equal(classify(readData("cancelled.json")), "cancelled");
  assert.equal(classify(readData("bypass-lie.json")), "bypass-lie");
  assert.equal(classify(readData("card-hidden.json")), "card-hidden");
  assert.equal(classify(readData("classifier-deny.json")), "classifier-deny");
  assert.equal(classify(readData("next-message.json")), "next-message");
  assert.equal(classify(readData("running-hang.json")), "running-hang");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [92053, 85588, 92817, 86478]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("cleared"));
  assert.ok(CHIPS.includes("arras"));
  assert.ok(CHIPS.includes("phantom-prompt"));
  assert.ok(CHIPS.includes("cancelled"));
  assert.ok(CHIPS.includes("bypass-lie"));
  assert.ok(CHIPS.includes("card-hidden"));
  assert.ok(CHIPS.includes("curtain-raised"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("arras"));
  assert.ok(ALARM.includes("phantom-prompt"));
  assert.ok(ALARM.includes("cancelled"));
  assert.ok(ALARM.includes("bypass-lie"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published arras walk scores arras after the idle hold", () => {
  const booth = scoreWalk({ rows: ARRAS_WALK });
  assert.equal(booth.verdict, "arras");
  assert.ok(booth.arrasCount >= 1);
  const idle = booth.rows.find((row) => row.event === "curtain-raised");
  assert.equal(idle.cleared, true);
  assert.equal(idle.verdict, "cleared");
  const cut = booth.rows.find((row) => row.event === "phantom-prompt");
  assert.equal(cut.phantomPrompt, true);
  const path = booth.rows.find(
    (row) => row.event === "phantom-prompt" && row.t === "path",
  );
  assert.equal(path.verdict, "phantom-prompt");
});

test("ARRAS_WALK constant matches the issue aisle walk", () => {
  assert.equal(ARRAS_WALK[0].event, "curtain-raised");
  const cut = ARRAS_WALK.find((row) => row.event === "phantom-prompt");
  assert.equal(cut.phantomPrompt || cut.cardHidden, true);
  const path = ARRAS_WALK.find((row) => row.t === "path");
  assert.equal(path.arras, true);
  const scoreRow = ARRAS_WALK.find((row) => row.event === "arras");
  assert.equal(scoreRow.arras, true);
  assert.equal(scoreRow.cancelled, true);
});

test("positive control raised curtain stays cleared", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "cleared");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "cleared");
  const hold = walk.rows.find((row) => row.event === "curtain-raised");
  assert.equal(hold.cleared, true);
  assert.equal(hold.verdict, "cleared");
});

test("issue constants encode only #94348 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94348);
  assert.ok(ISSUE_URL.includes("94348"));
  assert.match(TITLE, /Desktop Code tab|Auto mode|permission prompt|cancelled/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.270|1\.52386\.6/i);
  assert.equal(BUILD, "CLI/core 2.1.270; Desktop app 1.52386.6");
  assert.equal(SURFACE, "phantom-prompt");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:macos", "area:permissions", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(CURTAIN_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Frangible|#94362/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Nameplate|#94349/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Matryoshka|#94350/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#92053/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94336/i.test(row)));
  assert.ok(EXPECTED.some((row) => /approval|bypassPermissions|did not complete/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /Auto permission mode|toolDenialKind|cancelled|bypassPermissions|Bash\(grep:\*\)/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("phantom-prompt"));
  assert.ok(FINGERPRINT_LINES.includes("arras"));
  assert.equal(PHRASE, "Score arras or admit cleared.");
  assert.equal(SAMPLE_ARRAS_PROOF.phantomPrompt, true);
  assert.equal(SAMPLE_ARRAS_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published arras proof", () => {
  const result = handle(seedArras());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "phantom-prompt");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedArras()),
    /arras\|kind=phantom-prompt\|ref=cancelled\|path=phantom-prompt\|cue=phantom-prompt/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and armed/affixed/unpacked/scoped/enrolled", () => {
  const required = [
    "armed",
    "sealed",
    "latched",
    "guarded",
    "executable",
    "affixed",
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
    "frangible",
    "nameplate",
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
    "knock",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
    "root-find",
    "reload-blind",
    "win-posix-mismatch",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("cleared booth flips arras back when the aisle admits cleared", () => {
  const tape = {
    cleared: true,
    arras: false,
    phantomPrompt: false,
    cue: "cleared",
  };
  assert.equal(scoreGate(tape).verdict, "cleared");
  tape.cleared = false;
  tape.arras = true;
  tape.phantomPrompt = true;
  tape.cue = "arras";
  assert.equal(scoreGate(tape).verdict, "arras");
  tape.cleared = true;
  tape.arras = false;
  tape.phantomPrompt = false;
  tape.cue = "cleared";
  assert.equal(scoreGate(tape).verdict, "cleared");
});

test("aisle, card, dagger, and readBooth mark the arras proof", () => {
  const aisle = inspectAisle({ arras: true });
  assert.equal(aisle.stamp, "curtain-aisle");
  const card = inspectCard({ arras: true, cardHidden: true });
  assert.equal(card.stamp, "phantom-card");
  assert.equal(card.hidden, true);
  const booth = readBooth({
    arras: true,
    phantomPrompt: true,
    cardHidden: true,
  });
  assert.equal(booth.arras, true);
  assert.equal(booth.mark, "arras");
  const open = readBooth({
    cleared: true,
    arras: false,
    phantomPrompt: false,
  });
  assert.equal(open.arras, false);
  assert.equal(open.mark, "cleared");
  assert.equal(inspectDagger({ arras: true, cancelled: true }).stamp, "next-dagger");
  assert.equal(inspectBypass({ arras: true, bypassLie: true }).stamp, "bypass-footlight");
  assert.equal(inspectHang({ arras: true, runningHang: true }).stamp, "running-hang");
  assert.equal(inspectRefusal({ arras: true, cancelled: true }).stamp, "cancelled-as-refusal");
});

test("mapArras encodes the published phantom-prompt", () => {
  const miss = mapArras({ arras: true, phantomPrompt: true });
  assert.equal(miss.stamp, "phantom-prompt");
  assert.equal(miss.holdingLane, "card-hidden");
  assert.equal(miss.ribbon, "arras");
  const clear = mapArras({ cleared: true, arras: false });
  assert.equal(clear.stamp, "curtain-raised");
  assert.equal(clear.kindLane, "card-shown");
  assert.equal(clear.holdingLane, "curtain-raised");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [92053, 85588, 92817, 86478]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.ok(NOT_PRODUCTS.includes("matryoshka"));
  assert.ok(NOT_PRODUCTS.includes("dragnet"));
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.ok(NOT_PRODUCTS.includes("knock"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[3].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94348));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.ok(!COUSINS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/arras.json", import.meta.url))],
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
  assert.equal(seededOut.verdict, "arras");
  assert.equal(seededOut.alarm, true);
  assert.equal(clearedOut.verdict, "cleared");
  assert.equal(clearedOut.hold, true);
  assert.match(clearedOut.phrase, /admit cleared/);
});

test("handle exposes published hypothesis and #94348 headline", () => {
  const result = handle(seedArras());
  assert.equal(result.published.issue, 94348);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [92053, 85588, 92817, 86478]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94348));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /classifier-escalated|cancelled|bypass|NON-BINDING|#94348/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94348/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the cleared page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("cleared page is a theater aisle, not frangible wax-seal or nameplate hotel", () => {
  const page = readPage();
  assert.match(page, /family=Playfair\+Display|Playfair Display/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /arras|cleared|phantom-prompt|curtain-aisle|phantom-card|next-dagger|bypass-footlight|gallery-wing/i,
  );
  assert.match(page, /#1A0F1C|#C9A227|#F3EDE0|#8B1E3F|#4ECDC4/i);
  assert.match(page, /\bcleared\b/);
  assert.match(page, /\barras\b/);
  assert.match(page, /phantom-prompt/);
  assert.match(page, /Score arras or admit cleared/i);
  assert.match(page, /#369/);
  assert.match(page, /#94348/);
  assert.match(page, /Admit cleared/);
  assert.match(page, /Score arras/);
  assert.match(page, /Walk phantom-prompt/);
  assert.match(page, /Compare cleared \/ arras/);
  assert.match(page, /Pin idle cleared/);
  assert.match(page, /Pin seeded arras/);
  assert.match(page, /Pin phantom-prompt/);
  assert.match(page, /Stamp cancelled/);
  assert.match(page, /Score booth/);
  assert.match(page, /arras-score/);
  assert.match(
    page,
    /toolDenialKind|bypassPermissions|dangerously-skip-permissions|approval (card|prompt)|Bash\(grep:\*\)/i,
  );
  assert.match(page, /curtain-aisle|phantom-card|next-dagger|bypass-footlight|cancelled-as-refusal/i);
  assert.match(
    page,
    /<svg[\s\S]*class="arras-curtain"|class="gallery-wing"|class="phantom-card"|class="next-dagger"|class="footlight"|class="playbill"/i,
  );
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Yeseva\+One|Yeseva One/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Archivo\+Black|Archivo Black/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /#1E1740|#E09A3A|#F6EFD8|#3DD6D0|#120E28/);
  assert.doesNotMatch(page, /#B08D57|#F7F1E5|#3B1F14|#1A1A1A|#2F6F5E/);
  assert.doesNotMatch(page, /#C41E3A|#F4E8D8|#1B2838|#D4A017|#2A2A2A/);
  assert.doesNotMatch(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/);
  assert.doesNotMatch(page, /wax-seal atelier|glass ampule|shear-pin|wax press/i);
  assert.doesNotMatch(page, /hotel door-plate|mahogany door|front-desk ledger|verdigris hinge/i);
  assert.doesNotMatch(page, /lacquer nesting-doll|birch-workshop|gold leaf|indigo cloth/i);
  assert.doesNotMatch(page, /night blotter|caution tape|city-grid|police-fishing/i);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /admit armed|Score frangible|idle armed/i);
  assert.doesNotMatch(page, /admit affixed|Score nameplate|idle affixed/i);
  assert.doesNotMatch(page, /admit unpacked|Score matryoshka|idle unpacked/i);
  assert.doesNotMatch(page, /admit scoped|Score dragnet|idle scoped/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /\bfrangible\b/);
  assert.doesNotMatch(page, /\bnameplate\b/);
  assert.doesNotMatch(page, /\bmatryoshka\b/);
  assert.doesNotMatch(page, /\bdragnet\b/);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /chmod-failopen/);
  assert.doesNotMatch(page, /header-rename/);
  assert.doesNotMatch(page, /subst-nest/);
  assert.doesNotMatch(page, /root-find/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.match(page, /NOT Frangible/i);
  assert.match(page, /NOT Nameplate/i);
  assert.match(page, /NOT Matryoshka/i);
  assert.match(page, /NOT Dragnet/i);
  assert.match(page, /NOT Knock/i);
  assert.match(page, /#92053/);
  assert.match(page, /#85588/);
  assert.match(page, /#92817/);
  assert.match(page, /#86478/);
  assert.doesNotMatch(page, /#94336/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Arras/);
  assert.match(readme, /#94348/);
  assert.match(readme, /\bcleared\b/);
  assert.match(readme, /\barras\b/);
  assert.match(readme, /phantom-prompt/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /toolDenialKind|bypassPermissions|approval (card|prompt)|Auto mode/i);
  assert.match(readme, /NOT Frangible\/#94362/);
  assert.match(readme, /NOT Nameplate\/#94349/);
  assert.match(readme, /NOT Matryoshka\/#94350/);
  assert.match(readme, /NOT Dragnet\/#94064/);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /#92053/);
  assert.match(readme, /#85588/);
  assert.match(readme, /#92817/);
  assert.match(readme, /#86478/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /do NOT pick #94336|#94336/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/arras/);
  assert.match(readme, /node --test projects\/arras\/arras\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /theater|tapestry|curtain|gallery|Polonius|arras/i);
  assert.match(readme, /Score arras or admit cleared/);
  assert.match(readme, /#93924|#93770|#93777|#94151/);
  assert.doesNotMatch(readme, /backup #94348|#94348 as next/);
  assert.match(readme, /08:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bfrangible\b/);
  assert.doesNotMatch(readme, /\bnameplate\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Arras/);
  assert.match(runLog, /08:50/);
});

test("catalog features Arras only; Frangible unfeatured; product count 369", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 369);
  assert.equal(hub.products.length, 369);
  assert.equal(catalog.products[0].name, "Arras");
  assert.equal(catalog.products[0].slug, "arras");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/arras/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bcleared\b/);
  assert.match(catalog.products[0].summary, /\barras\b/);
  assert.match(catalog.products[0].summary, /phantom-prompt/);
  assert.match(catalog.products[0].summary, /Score arras or admit cleared/);
  assert.match(catalog.products[0].summary, /#94348/);
  assert.equal(hub.products[0].slug, "arras");
  assert.equal(hub.products[0].featured, true);
  const frangible = catalog.products.find((row) => row.slug === "frangible");
  assert.ok(frangible);
  assert.equal(frangible.featured, false);
  const nameplate = catalog.products.find((row) => row.slug === "nameplate");
  assert.ok(nameplate);
  assert.equal(nameplate.featured, false);
  const matryoshka = catalog.products.find((row) => row.slug === "matryoshka");
  assert.ok(matryoshka);
  assert.equal(matryoshka.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "arras").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94348") && row.slug !== "arras",
    ),
  );
});

test("vercel rewrites arras to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/arras");
  assert.equal(vercel.rewrites[0].destination, "/projects/arras");
  assert.equal(vercel.rewrites[1].source, "/arras/");
  assert.equal(vercel.rewrites[1].destination, "/projects/arras");
  assert.equal(vercel.rewrites[2].source, "/arras/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/arras/:path*");
  assert.equal(vercel.rewrites[3].source, "/frangible");
  assert.equal(vercel.rewrites[3].destination, "/projects/frangible");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
