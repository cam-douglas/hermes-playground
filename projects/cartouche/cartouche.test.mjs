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
  CARTOUCHE_WALK,
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
  SAMPLE_CARTOUCHE_PROOF,
  SEEDED_WORD,
  SELECTED_MODEL,
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
  inspectOval,
  inspectPoster,
  inspectProse,
  inspectType,
  mapScope,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCartouche,
  seedDiagrammed,
  seedHeadingBoxes,
  seedHold,
  seedInfographicRestate,
  seedProduct,
  seedSectionPoster,
} from "./cartouche.mjs";

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
  return fileURLToPath(new URL("./cartouche.mjs", import.meta.url));
}

test("idle diagrammed is a hold; nodes and edges inferred from subject", () => {
  const result = analyze(seedDiagrammed());
  assert.equal(result.verdict, "diagrammed");
  assert.equal(result.idleWord, "diagrammed");
  assert.equal(IDLE_WORD, "diagrammed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.diagrammed, true);
  assert.equal(result.phrase, "admit diagrammed");
  assert.equal(result.cartouche, false);
  assert.equal(result.sectionPoster, false);
  assert.ok(HOLD_ALIASES.includes("diagrammed"));
  assert.ok(HOLD_ALIASES.includes("nodal"));
  assert.ok(HOLD_ALIASES.includes("edged"));
  assert.ok(HOLD_ALIASES.includes("dataflow"));
  assert.ok(HOLD_ALIASES.includes("flow-inferred"));
  assert.ok(HOLD_ALIASES.includes("type-matched"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify diagrammed", () => {
  assert.equal(classify(emptyTicket()), "diagrammed");
  assert.equal(classify(""), "diagrammed");
  assert.equal(classify(null), "diagrammed");
  assert.equal(decide({}), "diagrammed");
});

test("#93772 seeded path scores cartouche when the oval restates headings", () => {
  const result = analyze(seedCartouche());
  assert.equal(result.verdict, "cartouche");
  assert.equal(result.seededWord, "cartouche");
  assert.equal(SEEDED_WORD, "cartouche");
  assert.equal(PRODUCT_WORD, "cartouche");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.cartouche, true);
  assert.equal(result.phrase, "score cartouche");
  assert.equal(result.sectionPoster, true);
  assert.equal(result.headingBoxes, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark sealed oval and section-poster columns", () => {
  const oval = inspectOval({ cartouche: true, sectionPoster: true });
  assert.equal(oval.stamp, "oval-sealed");
  assert.equal(oval.sealed, true);
  const poster = inspectPoster({ cartouche: true, headingBoxes: true });
  assert.equal(poster.stamp, "section-poster");
  assert.equal(poster.columns, 3);
  const type = inspectType({ cartouche: true, typeUnasked: true });
  assert.equal(type.stamp, "type-unasked");
  const prose = inspectProse({ cartouche: true, proseDuplicate: true });
  assert.equal(prose.stamp, "prose-duplicate");
  const scored = scoreGate({
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    infographicRestate: true,
    cue: "cartouche",
  });
  assert.equal(scored.verdict, "cartouche");
  const open = inspectOval({ diagrammed: true, cartouche: false });
  assert.equal(open.stamp, "oval-open");
});

test("path word is section-poster; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "section-poster");
  const result = analyze(seedSectionPoster());
  assert.equal(result.verdict, "section-poster");
  assert.equal(result.pathWord, "section-poster");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "section-poster", preferSeed: true, cartouche: true }),
    "section-poster",
  );
  assert.equal(classify(seedHeadingBoxes()), "heading-boxes");
});

test("HOLD includes diagrammed / hold", () => {
  assert.ok(HOLD.includes("diagrammed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: heading-boxes, infographic-restate, cartouche", () => {
  assert.equal(classify(seedHeadingBoxes()), "heading-boxes");
  assert.equal(classify(seedInfographicRestate()), "infographic-restate");
  assert.equal(classify(seedProduct()), "cartouche");
});

test("booth fixtures flip diagrammed vs cartouche vs section-poster", () => {
  const idle = scoreGate(seedDiagrammed());
  const seeded = scoreGate(seedCartouche());
  const diagrammed = readData("diagrammed.json");
  const cartouche = readData("cartouche.json");
  const path = readData("section-poster.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "diagrammed");
  assert.equal(seeded.verdict, "cartouche");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDiagrammed()), "diagrammed");
  assert.equal(score(seedCartouche()), "cartouche");
  assert.equal(diagrammed.sectionPoster, false);
  assert.equal(diagrammed.diagrammed, true);
  assert.equal(scoreGate(diagrammed).verdict, "diagrammed");
  assert.equal(cartouche.sectionPoster, true);
  assert.equal(cartouche.headingBoxes, true);
  assert.equal(cartouche.infographicRestate, true);
  assert.equal(classify(cartouche), "cartouche");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /diagrammed|nodes|edges|dataflow/i);
  assert.match(path.paths[1].result, /poster|heading|infographic|no independent/i);
  assert.equal(classify(path), "section-poster");
  assert.equal(cartouche.hubCount, "CARTOUCHE");
  assert.equal(cartouche.issue, 93772);
  assert.equal(cartouche.cartouche, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("nodal.json")), "nodal");
  assert.equal(classify(readData("edged.json")), "edged");
  assert.equal(classify(readData("dataflow.json")), "dataflow");
  assert.equal(classify(readData("flow-inferred.json")), "flow-inferred");
  assert.equal(classify(readData("type-matched.json")), "type-matched");
  assert.equal(classify(readData("heading-boxes.json")), "heading-boxes");
  assert.equal(classify(readData("infographic-restate.json")), "infographic-restate");
  assert.equal(classify(readData("prose-duplicate.json")), "prose-duplicate");
  assert.equal(classify(readData("no-independent-info.json")), "no-independent-info");
  assert.equal(classify(readData("regenerate-same.json")), "regenerate-same");
  assert.equal(classify(readData("type-unasked.json")), "type-unasked");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("diagrammed"));
  assert.ok(CHIPS.includes("cartouche"));
  assert.ok(CHIPS.includes("section-poster"));
  assert.ok(CHIPS.includes("heading-boxes"));
  assert.ok(CHIPS.includes("infographic-restate"));
  assert.ok(CHIPS.includes("nodal"));
  assert.ok(CHIPS.includes("dataflow"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("cartouche"));
  assert.ok(ALARM.includes("section-poster"));
  assert.ok(ALARM.includes("heading-boxes"));
  assert.ok(ALARM.includes("infographic-restate"));
  assert.ok(ALARM.includes("prose-duplicate"));
  assert.ok(ALARM.includes("no-independent-info"));
  assert.ok(ALARM.includes("regenerate-same"));
  assert.ok(ALARM.includes("type-unasked"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cartouche walk scores cartouche after the idle hold", () => {
  const booth = scoreWalk({ rows: CARTOUCHE_WALK });
  assert.equal(booth.verdict, "cartouche");
  assert.ok(booth.cartoucheCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-diagrammed");
  assert.equal(idle.diagrammed, true);
  assert.equal(idle.verdict, "diagrammed");
  const cut = booth.rows.find((row) => row.event === "section-poster");
  assert.equal(cut.sectionPoster, true);
  const path = booth.rows.find((row) => row.event === "section-poster" && row.t === "path");
  assert.equal(path.verdict, "section-poster");
});

test("CARTOUCHE_WALK constant matches the issue temple-relief walk", () => {
  assert.equal(CARTOUCHE_WALK[0].event, "cue-diagrammed");
  const cut = CARTOUCHE_WALK.find((row) => row.event === "section-poster");
  assert.equal(cut.sectionPoster, true);
  const path = CARTOUCHE_WALK.find((row) => row.t === "path");
  assert.equal(path.cartouche, true);
  const scoreRow = CARTOUCHE_WALK.find((row) => row.event === "cartouche");
  assert.equal(scoreRow.cartouche, true);
});

test("positive control diagrammed relief stays diagrammed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "diagrammed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "diagrammed");
  const hold = walk.rows.find((row) => row.event === "cue-diagrammed");
  assert.equal(hold.diagrammed, true);
  assert.equal(hold.verdict, "diagrammed");
});

test("issue constants encode only #93772 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93772);
  assert.ok(ISSUE_URL.includes("93772"));
  assert.match(TITLE, /diagram|section-summary poster|diagram type/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "cli");
  assert.match(HOST, /Claude Code CLI/);
  assert.equal(BUILD, "cli");
  assert.equal(SURFACE, "wrong-diagram-type-section-poster");
  assert.equal(SELECTED_MODEL, "claude-fable-5");
  assert.deepEqual([...LABELS], ["bug", "area:model"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Attaint|#93821/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Oriel|#93809/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(EXPECTED.some((row) => /dataflow|flow diagram|infer|ask which type/i.test(row)));
  assert.match(DISTRIBUTION, /claude-fable-5|three-column|section headings|data flow|regeneration/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("section-poster"));
  assert.ok(FINGERPRINT_LINES.includes("cartouche"));
  assert.equal(PHRASE, "Score cartouche or admit diagrammed.");
  assert.equal(SAMPLE_CARTOUCHE_PROOF.sectionPoster, true);
});

test("has-repro fingerprints encode the published cartouche proof", () => {
  const result = handle(seedCartouche());
  assert.equal(result.published.platform, "cli");
  assert.equal(result.published.surface, "wrong-diagram-type-section-poster");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedCartouche()),
    /cartouche\|kind=section-poster\|type=unasked\|path=section-poster\|cue=section-poster/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes unattainted/attaint/reflowed and recent catalog words", () => {
  const required = [
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
    "store-slug-collide",
    "unitary",
    "tessellated",
    "tessera",
    "verbatim",
    "mojibaked",
    "mojibake",
    "plenary",
    "scisselled",
    "scissel",
    "vested",
    "unseised",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "airlock",
    "equalized",
    "scotoma",
    "attainder",
    "stet",
    "rubric",
    "galley",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("diagrammed booth flips cartouche back when the oval is open", () => {
  const tape = {
    diagrammed: true,
    cartouche: false,
    sectionPoster: false,
    cue: "diagrammed",
  };
  assert.equal(scoreGate(tape).verdict, "diagrammed");
  tape.diagrammed = false;
  tape.cartouche = true;
  tape.sectionPoster = true;
  tape.headingBoxes = true;
  tape.cue = "cartouche";
  assert.equal(scoreGate(tape).verdict, "cartouche");
  tape.diagrammed = true;
  tape.cartouche = false;
  tape.sectionPoster = false;
  tape.headingBoxes = false;
  tape.cue = "diagrammed";
  assert.equal(scoreGate(tape).verdict, "diagrammed");
});

test("oval, poster, type, and readBooth mark the cartouche proof", () => {
  const idle = inspectOval({
    diagrammed: true,
  });
  assert.equal(idle.stamp, "oval-open");
  const poster = inspectPoster({ cartouche: true, headingBoxes: true });
  assert.equal(poster.stamp, "section-poster");
  assert.equal(poster.columns, 3);
  const type = inspectType({ cartouche: true, typeUnasked: true });
  assert.equal(type.stamp, "type-unasked");
  const booth = readBooth({
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
  });
  assert.equal(booth.cartouche, true);
  assert.equal(booth.mark, "cartouche");
  const open = readBooth({
    diagrammed: true,
    cartouche: false,
    sectionPoster: false,
  });
  assert.equal(open.cartouche, false);
  assert.equal(open.mark, "diagrammed");
});

test("mapScope encodes the published sealed oval", () => {
  const miss = mapScope({ cartouche: true, sectionPoster: true });
  assert.equal(miss.stamp, "section-poster");
  assert.equal(miss.ovalLane, "sealed");
  assert.equal(miss.ribbon, "cartouche");
  const clear = mapScope({ diagrammed: true, cartouche: false });
  assert.equal(clear.stamp, "diagrammed-relief");
  assert.equal(clear.kindLane, "dataflow");
  assert.equal(clear.ovalLane, "open");
});

test("cousins stay empty rather than invented; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
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
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93987);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93772));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cartouche.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const diagrammedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/diagrammed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(diagrammedFix.status, 0, diagrammedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const diagrammedOut = JSON.parse(diagrammedFix.stdout);
  assert.equal(idleOut.verdict, "diagrammed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "cartouche");
  assert.equal(seededOut.alarm, true);
  assert.equal(diagrammedOut.verdict, "diagrammed");
  assert.equal(diagrammedOut.hold, true);
  assert.match(diagrammedOut.phrase, /admit diagrammed/);
});

test("handle exposes published hypothesis and #93772 headline", () => {
  const result = handle(seedCartouche());
  assert.equal(result.published.issue, 93772);
  assert.equal(result.published.platform, "cli");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93989));
  assert.ok(result.published.backups.includes(93987));
  assert.ok(!result.published.backups.includes(93772));
  assert.match(result.published.hypothesis, /section-summary|infographic|dataflow|NON-BINDING|#93772/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93772/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a temple cartouche booth, not court-roll or bay-window", () => {
  const page = readPage();
  assert.match(page, /Cinzel Decorative|Cinzel\+Decorative|family=Cinzel/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /cartouche|diagrammed|section-poster|name-oval|false door|hieroglyph/i);
  assert.match(page, /#E8DFC8|#1B3A6B|#C9A227|#1A1510|#8B6914|#9C4A3C|#2A6F6A/i);
  assert.match(page, /\bdiagrammed\b/);
  assert.match(page, /\bcartouche\b/);
  assert.match(page, /section-poster/);
  assert.match(page, /Score cartouche or admit diagrammed/i);
  assert.match(page, /#338/);
  assert.match(page, /#93772/);
  assert.match(page, /Admit diagrammed/);
  assert.match(page, /Score cartouche/);
  assert.match(page, /Walk section-poster/);
  assert.match(page, /Compare diagrammed \/ cartouche/);
  assert.match(page, /Pin idle diagrammed/);
  assert.match(page, /Pin seeded cartouche/);
  assert.match(page, /Pin section-poster/);
  assert.match(page, /Open the oval/);
  assert.match(page, /Score booth/);
  assert.match(page, /cartouche-score/);
  assert.match(page, /claude-fable-5|data flow|section headings|three-column/i);
  assert.match(page, /cartouche|name-oval|false door|lapis|limestone/i);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Old Standard TT|Old\+Standard\+TT/);
  assert.doesNotMatch(page, /Public Sans|Public\+Sans/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#14110C/);
  assert.doesNotMatch(page, /#7B1420/);
  assert.doesNotMatch(page, /#3B2A1A/);
  assert.doesNotMatch(page, /#5C1A22/);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /laryngoscope|voice-strip|glottis|phonat/i);
  assert.doesNotMatch(page, /mullion|leaded|sash|bay-window|fenestrat/i);
  assert.doesNotMatch(page, /\bunattainted\b/);
  assert.doesNotMatch(page, /\battaint\b/);
  assert.doesNotMatch(page, /session-attainder/);
  assert.doesNotMatch(page, /\breflowed\b/);
  assert.doesNotMatch(page, /\boriel\b/);
  assert.doesNotMatch(page, /plan-no-reflow/);
  assert.doesNotMatch(page, /\barticulate\b/);
  assert.doesNotMatch(page, /\banarthria\b/);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cartouche/);
  assert.match(readme, /#93772/);
  assert.match(readme, /\bdiagrammed\b/);
  assert.match(readme, /\bcartouche\b/);
  assert.match(readme, /section-poster/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /NOT Attaint/i);
  assert.match(readme, /NOT Oriel/i);
  assert.match(readme, /NOT Anarthria/i);
  assert.match(readme, /NOT Trismus/i);
  assert.match(readme, /NOT Foundling/i);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /claude-fable-5|data flow|section headings|three-column/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cartouche/);
  assert.match(readme, /node --test projects\/cartouche\/cartouche\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /name-oval|false door|temple|hieroglyph|limestone/i);
  assert.match(readme, /Score cartouche or admit diagrammed/);
  assert.match(readme, /#93770|#93777|#93811|#93924|#93925|#93954|#93967|#93957|#93989|#93987/);
  assert.match(readme, /21:50/);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Cartouche/);
  assert.match(runLog, /21:50/);
  assert.match(readme, /Do NOT implement a fix/i);
});

test("catalog features Cartouche only; Attaint unfeatured; product count 338", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 338);
  assert.equal(hub.products.length, 338);
  assert.equal(catalog.products[0].name, "Cartouche");
  assert.equal(catalog.products[0].slug, "cartouche");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cartouche/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "21:50 cartouche: an Egyptian cartouche / name-oval / temple-relief booth for #93772. Ask-for-diagram on a per-turn dataflow doc defaults to a section-summary poster (heading boxes) instead of nodes+edges. Idle diagrammed / seeded cartouche / path section-poster. Score cartouche or admit diagrammed.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bdiagrammed\b/);
  assert.match(catalog.products[0].summary, /\bcartouche\b/);
  assert.match(catalog.products[0].summary, /section-poster/);
  assert.match(catalog.products[0].summary, /Score cartouche or admit diagrammed/);
  assert.equal(hub.products[0].slug, "cartouche");
  assert.equal(hub.products[0].featured, true);
  const attaint = catalog.products.find((row) => row.slug === "attaint");
  assert.ok(attaint);
  assert.equal(attaint.featured, false);
  const oriel = catalog.products.find((row) => row.slug === "oriel");
  assert.ok(oriel);
  assert.equal(oriel.featured, false);
  const anarthria = catalog.products.find((row) => row.slug === "anarthria");
  assert.ok(anarthria);
  assert.equal(anarthria.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cartouche").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93772") && row.slug !== "cartouche"));
});

test("vercel rewrites cartouche to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cartouche");
  assert.equal(vercel.rewrites[0].destination, "/projects/cartouche");
  assert.equal(vercel.rewrites[1].source, "/cartouche/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cartouche");
  assert.equal(vercel.rewrites[2].source, "/cartouche/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cartouche/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
