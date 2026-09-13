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
  PARABLEPSIS_WALK,
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
  SAMPLE_PARABLEPSIS_PROOF,
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
  inspectDecode,
  inspectWitness,
  inspectWipe,
  mapCollation,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedWholeFileWipe,
  seedParablepsis,
  seedDiplomatic,
  seedHold,
  seedLatin1EditWipe,
  seedProduct,
  seedReplacementChar,
} from "./parablepsis.mjs";

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
  return fileURLToPath(new URL("./parablepsis.mjs", import.meta.url));
}

test("idle diplomatic is a hold; byte-exact Latin-1 preserved", () => {
  const result = analyze(seedDiplomatic());
  assert.equal(result.verdict, "diplomatic");
  assert.equal(result.idleWord, "diplomatic");
  assert.equal(IDLE_WORD, "diplomatic");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.diplomatic, true);
  assert.equal(result.phrase, "admit diplomatic");
  assert.equal(result.parablepsis, false);
  assert.equal(result.latin1EditWipe, false);
  assert.ok(HOLD_ALIASES.includes("diplomatic"));
  assert.ok(HOLD_ALIASES.includes("byte-exact"));
  assert.ok(HOLD_ALIASES.includes("latin1-preserved"));
  assert.ok(HOLD_ALIASES.includes("charset-safe"));
  assert.ok(HOLD_ALIASES.includes("no-rewrite"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify diplomatic", () => {
  assert.equal(classify(emptyTicket()), "diplomatic");
  assert.equal(classify(""), "diplomatic");
  assert.equal(classify(null), "diplomatic");
  assert.equal(decide({}), "diplomatic");
});

test("#93954 seeded path scores parablepsis when Latin-1 is wiped", () => {
  const result = analyze(seedParablepsis());
  assert.equal(result.verdict, "parablepsis");
  assert.equal(result.seededWord, "parablepsis");
  assert.equal(SEEDED_WORD, "parablepsis");
  assert.equal(PRODUCT_WORD, "parablepsis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.parablepsis, true);
  assert.equal(result.phrase, "score parablepsis");
  assert.equal(result.latin1EditWipe, true);
  assert.equal(result.replacementChar, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark wiped witness and UTF-8 decode", () => {
  const holding = inspectWitness({ parablepsis: true, latin1EditWipe: true });
  assert.equal(holding.stamp, "witness-wiped");
  assert.equal(holding.wiped, true);
  const bind = inspectDecode({ parablepsis: true, editWriteDecode: true });
  assert.equal(bind.stamp, "edit-write-decode");
  assert.equal(bind.target, "utf-8");
  const write = inspectWipe({ parablepsis: true, replacementChar: true });
  assert.equal(write.stamp, "whole-file-wipe");
  const scored = scoreGate({
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    wholeFileWipe: true,
    cue: "parablepsis",
  });
  assert.equal(scored.verdict, "parablepsis");
  const open = inspectWitness({ diplomatic: true, parablepsis: false });
  assert.equal(open.stamp, "witness-diplomatic");
});

test("path word is latin1-edit-wipe; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "latin1-edit-wipe");
  const result = analyze(seedLatin1EditWipe());
  assert.equal(result.verdict, "latin1-edit-wipe");
  assert.equal(result.pathWord, "latin1-edit-wipe");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "latin1-edit-wipe", preferSeed: true, parablepsis: true }),
    "latin1-edit-wipe",
  );
  assert.equal(classify(seedReplacementChar()), "replacement-char");
});

test("HOLD includes diplomatic / hold", () => {
  assert.ok(HOLD.includes("diplomatic"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: replacement-char, whole-file-wipe, parablepsis", () => {
  assert.equal(classify(seedReplacementChar()), "replacement-char");
  assert.equal(classify(seedWholeFileWipe()), "whole-file-wipe");
  assert.equal(classify(seedProduct()), "parablepsis");
});

test("booth fixtures flip diplomatic vs parablepsis vs latin1-edit-wipe", () => {
  const idle = scoreGate(seedDiplomatic());
  const seeded = scoreGate(seedParablepsis());
  const diplomatic = readData("diplomatic.json");
  const parablepsis = readData("parablepsis.json");
  const path = readData("latin1-edit-wipe.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "diplomatic");
  assert.equal(seeded.verdict, "parablepsis");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDiplomatic()), "diplomatic");
  assert.equal(score(seedParablepsis()), "parablepsis");
  assert.equal(diplomatic.latin1EditWipe, false);
  assert.equal(diplomatic.diplomatic, true);
  assert.equal(scoreGate(diplomatic).verdict, "diplomatic");
  assert.equal(parablepsis.latin1EditWipe, true);
  assert.equal(parablepsis.replacementChar, true);
  assert.equal(parablepsis.wholeFileWipe, true);
  assert.equal(classify(parablepsis), "parablepsis");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /diplomatic|byte-exact|latin1-preserved|charset-safe/i);
  assert.match(path.paths[1].result, /U\+FFFD|replacement|wipe|0xA2|latin-1/i);
  assert.equal(classify(path), "latin1-edit-wipe");
  assert.equal(parablepsis.hubCount, "PARABLEPSIS");
  assert.equal(parablepsis.issue, 93954);
  assert.equal(parablepsis.parablepsis, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("byte-exact.json")), "byte-exact");
  assert.equal(classify(readData("latin1-preserved.json")), "latin1-preserved");
  assert.equal(classify(readData("charset-safe.json")), "charset-safe");
  assert.equal(classify(readData("no-rewrite.json")), "no-rewrite");
  assert.equal(classify(readData("replacement-char.json")), "replacement-char");
  assert.equal(classify(readData("whole-file-wipe.json")), "whole-file-wipe");
  assert.equal(classify(readData("latin1-byte.json")), "latin1-byte");
  assert.equal(classify(readData("windows-1252.json")), "windows-1252");
  assert.equal(classify(readData("iso-8859-1.json")), "iso-8859-1");
  assert.equal(classify(readData("edit-write-decode.json")), "edit-write-decode");
  assert.equal(classify(readData("php-legacy.json")), "php-legacy");
  assert.equal(classify(readData("confirmed-162.json")), "confirmed-162");
  assert.equal(classify(readData("live-edit-wipe.json")), "live-edit-wipe");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("diplomatic"));
  assert.ok(CHIPS.includes("parablepsis"));
  assert.ok(CHIPS.includes("latin1-edit-wipe"));
  assert.ok(CHIPS.includes("replacement-char"));
  assert.ok(CHIPS.includes("whole-file-wipe"));
  assert.ok(CHIPS.includes("byte-exact"));
  assert.ok(CHIPS.includes("charset-safe"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("parablepsis"));
  assert.ok(ALARM.includes("latin1-edit-wipe"));
  assert.ok(ALARM.includes("replacement-char"));
  assert.ok(ALARM.includes("whole-file-wipe"));
  assert.ok(ALARM.includes("latin1-byte"));
  assert.ok(ALARM.includes("iso-8859-1"));
  assert.ok(ALARM.includes("edit-write-decode"));
  assert.ok(ALARM.includes("php-legacy"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published parablepsis walk scores parablepsis after the idle hold", () => {
  const booth = scoreWalk({ rows: PARABLEPSIS_WALK });
  assert.equal(booth.verdict, "parablepsis");
  assert.ok(booth.parablepsisCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-diplomatic");
  assert.equal(idle.diplomatic, true);
  assert.equal(idle.verdict, "diplomatic");
  const cut = booth.rows.find((row) => row.event === "latin1-edit-wipe");
  assert.equal(cut.latin1EditWipe, true);
  const path = booth.rows.find((row) => row.event === "latin1-edit-wipe" && row.t === "path");
  assert.equal(path.verdict, "latin1-edit-wipe");
});

test("PARABLEPSIS_WALK constant matches the issue collation walk", () => {
  assert.equal(PARABLEPSIS_WALK[0].event, "cue-diplomatic");
  const cut = PARABLEPSIS_WALK.find((row) => row.event === "latin1-edit-wipe");
  assert.equal(cut.latin1EditWipe, true);
  const path = PARABLEPSIS_WALK.find((row) => row.t === "path");
  assert.equal(path.parablepsis, true);
  const scoreRow = PARABLEPSIS_WALK.find((row) => row.event === "parablepsis");
  assert.equal(scoreRow.parablepsis, true);
});

test("positive control diplomatic folio stays diplomatic", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "diplomatic");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "diplomatic");
  const hold = walk.rows.find((row) => row.event === "cue-diplomatic");
  assert.equal(hold.diplomatic, true);
  assert.equal(hold.verdict, "diplomatic");
});

test("issue constants encode only #93954 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93954);
  assert.ok(ISSUE_URL.includes("93954"));
  assert.match(TITLE, /Latin-1|Windows-1252|byte corruption|single-byte/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Claude Code CLI/);
  assert.equal(BUILD, "2.1.269");
  assert.equal(SURFACE, "latin1-edit-wipe");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:macos", "area:tools"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Mojibake|#93848/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Crasis|#93960/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Demesne|#93989/i.test(row)));
  assert.ok(EXPECTED.some((row) => /byte-exact|diplomatic|U\+FFFD|refuse|charset=iso-8859-1/i.test(row)));
  assert.match(DISTRIBUTION, /Latin-1|0xA2|U\+FFFD|162|iso-8859-1|Edit\/Write/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("latin1-edit-wipe"));
  assert.ok(FINGERPRINT_LINES.includes("parablepsis"));
  assert.equal(PHRASE, "Score parablepsis or admit diplomatic.");
  assert.equal(SAMPLE_PARABLEPSIS_PROOF.latin1EditWipe, true);
});

test("has-repro fingerprints encode the published parablepsis proof", () => {
  const result = handle(seedParablepsis());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "latin1-edit-wipe");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedParablepsis()),
    /parablepsis\|kind=latin1-edit-wipe\|write=wiped\|path=latin1-edit-wipe\|cue=latin1-edit-wipe/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes demesne/cartouche/attaint and recent catalog words", () => {
  const required = [
    "demesned",
    "diagrammed",
    "cartouche",
    "section-poster",
    "unattainted",
    "attaint",
    "session-attainder",
    "reflowed",
    "oriel",
    "plan-no-reflow",
    "articulate",
    "anarthria",
    "dictation-paste-drop",
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "injective",
    "crased",
    "crasis",
    "unitary",
    "tessellated",
    "verbatim",
    "mojibaked",
    "plenary",
    "scisselled",
    "vested",
    "unseised",
    "feoffee",
    "singular",
    "apographed",
    "airlock",
    "equalized",
    "socat-race",
    "scotoma",
    "legible",
    "calibrated",
    "tethered",
    "engaged",
    "flush",
    "candid",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("diplomatic booth flips parablepsis back when the folio is byte-exact", () => {
  const tape = {
    diplomatic: true,
    parablepsis: false,
    latin1EditWipe: false,
    cue: "diplomatic",
  };
  assert.equal(scoreGate(tape).verdict, "diplomatic");
  tape.diplomatic = false;
  tape.parablepsis = true;
  tape.latin1EditWipe = true;
  tape.replacementChar = true;
  tape.cue = "parablepsis";
  assert.equal(scoreGate(tape).verdict, "parablepsis");
  tape.diplomatic = true;
  tape.parablepsis = false;
  tape.latin1EditWipe = false;
  tape.replacementChar = false;
  tape.cue = "diplomatic";
  assert.equal(scoreGate(tape).verdict, "diplomatic");
});

test("witness, decode, wipe, and readBooth mark the parablepsis proof", () => {
  const idle = inspectWitness({
    diplomatic: true,
  });
  assert.equal(idle.stamp, "witness-diplomatic");
  const bind = inspectDecode({ parablepsis: true, editWriteDecode: true });
  assert.equal(bind.stamp, "edit-write-decode");
  assert.equal(bind.target, "utf-8");
  const write = inspectWipe({ parablepsis: true, replacementChar: true });
  assert.equal(write.stamp, "whole-file-wipe");
  const booth = readBooth({
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
  });
  assert.equal(booth.parablepsis, true);
  assert.equal(booth.mark, "parablepsis");
  const open = readBooth({
    diplomatic: true,
    parablepsis: false,
    latin1EditWipe: false,
  });
  assert.equal(open.parablepsis, false);
  assert.equal(open.mark, "diplomatic");
});

test("mapCollation encodes the published wiped folio", () => {
  const miss = mapCollation({ parablepsis: true, latin1EditWipe: true });
  assert.equal(miss.stamp, "latin1-edit-wipe");
  assert.equal(miss.holdingLane, "wiped");
  assert.equal(miss.ribbon, "parablepsis");
  const clear = mapCollation({ diplomatic: true, parablepsis: false });
  assert.equal(clear.stamp, "diplomatic-folio");
  assert.equal(clear.kindLane, "byte-exact");
  assert.equal(clear.holdingLane, "diplomatic");
});

test("cousins cite #93848 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 93848);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93987);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93954));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/parablepsis.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const diplomaticFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/diplomatic.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(diplomaticFix.status, 0, diplomaticFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const diplomaticOut = JSON.parse(diplomaticFix.stdout);
  assert.equal(idleOut.verdict, "diplomatic");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "parablepsis");
  assert.equal(seededOut.alarm, true);
  assert.equal(diplomaticOut.verdict, "diplomatic");
  assert.equal(diplomaticOut.hold, true);
  assert.match(diplomaticOut.phrase, /admit diplomatic/);
});

test("handle exposes published hypothesis and #93954 headline", () => {
  const result = handle(seedParablepsis());
  assert.equal(result.published.issue, 93954);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93848]);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93987));
  assert.ok(!result.published.backups.includes(93954));
  assert.match(result.published.hypothesis, /UTF-8|Latin-1|U\+FFFD|NON-BINDING|#93954/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93954/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a collation-desk booth, not manor or temple oval", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /Source Serif 4|Source\+Serif\+4/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /parablepsis|diplomatic|latin1-edit-wipe|collation|apparatus|paleograph/i);
  assert.match(page, /#E2E6EC|#1F2B4D|#7C2434|#B8944A|#1A2034|#4D5A6A/i);
  assert.match(page, /\bdiplomatic\b/);
  assert.match(page, /\bparablepsis\b/);
  assert.match(page, /latin1-edit-wipe/);
  assert.match(page, /Score parablepsis or admit diplomatic/i);
  assert.match(page, /#340/);
  assert.match(page, /#93954/);
  assert.match(page, /Admit diplomatic/);
  assert.match(page, /Score parablepsis/);
  assert.match(page, /Walk latin1-edit-wipe/);
  assert.match(page, /Compare diplomatic \/ parablepsis/);
  assert.match(page, /Pin idle diplomatic/);
  assert.match(page, /Pin seeded parablepsis/);
  assert.match(page, /Pin latin1-edit-wipe/);
  assert.match(page, /Open the folio/);
  assert.match(page, /Score booth/);
  assert.match(page, /parablepsis-score/);
  assert.match(page, /Latin-1|0xA2|U\+FFFD|iso-8859-1|162/i);
  assert.match(page, /collation|apparatus|lemma|folio|paleograph/i);
  assert.doesNotMatch(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.doesNotMatch(page, /Epilogue/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /#E4D5B5/);
  assert.doesNotMatch(page, /#1A4A36/);
  assert.doesNotMatch(page, /#4A3018/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#1B3A6B/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7B1420/);
  assert.doesNotMatch(page, /#5C1A22/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#C41E6A/);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /foul-proof|geta-tofu|compositor/i);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /\bcartouche\b/);
  assert.doesNotMatch(page, /section-poster/);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Parablepsis/);
  assert.match(readme, /#93954/);
  assert.match(readme, /\bdiplomatic\b/);
  assert.match(readme, /\bparablepsis\b/);
  assert.match(readme, /latin1-edit-wipe/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Source Serif 4/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /UnifrakturMaguntia/);
  assert.doesNotMatch(readme, /Epilogue/);
  assert.doesNotMatch(readme, /Inconsolata/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /LATIN-1 EDIT WIPE|LATIN1-EDIT-WIPE/i);
  assert.match(readme, /NOT Mojibake\/#93848/);
  assert.match(readme, /NOT Crasis\/#93960/);
  assert.match(readme, /NOT Apograph\/#93859/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Cartouche\/#93772/);
  assert.match(readme, /NOT Attaint\/#93821/);
  assert.match(readme, /NOT Oriel\/#93809/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Trismus\/#93823/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /#93848/);
  assert.match(readme, /Latin-1|0xA2|U\+FFFD|iso-8859-1|162/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/parablepsis/);
  assert.match(readme, /node --test projects\/parablepsis\/parablepsis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /collation|apparatus|lemma|folio|paleograph/i);
  assert.match(readme, /Score parablepsis or admit diplomatic/);
  assert.match(readme, /#93770|#93777|#93811|#93924|#93925|#93967|#93957|#93987/);
  assert.match(readme, /23:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Parablepsis/);
  assert.match(runLog, /23:50/);
});

test("catalog features Parablepsis only; Demesne unfeatured; product count 340", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 340);
  assert.equal(hub.products.length, 340);
  assert.equal(catalog.products[0].name, "Parablepsis");
  assert.equal(catalog.products[0].slug, "parablepsis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/parablepsis/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "23:50 parablepsis: a paleography / collation-desk / apparatus-criticus booth for #93954. Edit/Write UTF-8-decodes Latin-1/Windows-1252 PHP files and silently wipes non-ASCII bytes (¢ ½ • ü) across the whole file — 162 chars / 11 files confirmed. Idle diplomatic / seeded parablepsis / path latin1-edit-wipe. Score parablepsis or admit diplomatic.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bdiplomatic\b/);
  assert.match(catalog.products[0].summary, /\bparablepsis\b/);
  assert.match(catalog.products[0].summary, /latin1-edit-wipe/);
  assert.match(catalog.products[0].summary, /Score parablepsis or admit diplomatic/);
  assert.equal(hub.products[0].slug, "parablepsis");
  assert.equal(hub.products[0].featured, true);
  const demesne = catalog.products.find((row) => row.slug === "demesne");
  assert.ok(demesne);
  assert.equal(demesne.featured, false);
  const cartouche = catalog.products.find((row) => row.slug === "cartouche");
  assert.ok(cartouche);
  assert.equal(cartouche.featured, false);
  const attaint = catalog.products.find((row) => row.slug === "attaint");
  assert.ok(attaint);
  assert.equal(attaint.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "parablepsis").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93954") && row.slug !== "parablepsis"));
});

test("vercel rewrites parablepsis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/parablepsis");
  assert.equal(vercel.rewrites[0].destination, "/projects/parablepsis");
  assert.equal(vercel.rewrites[1].source, "/parablepsis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/parablepsis");
  assert.equal(vercel.rewrites[2].source, "/parablepsis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/parablepsis/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
