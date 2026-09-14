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
  ABRIDGEMENT_SHAPES,
  RULED_OUT,
  EPITOME_WALK,
  SAMPLE_EPITOME_PROOF,
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
  inspectFlag,
  inspectFolio,
  inspectKnife,
  inspectPress,
  inspectSignature,
  mapDesk,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedDesktopInject,
  seedEmptyThinking,
  seedEpitome,
  seedFlag3531779070,
  seedHold,
  seedProduct,
  seedSummarizedThinkingForce,
  seedUnabridged,
} from "./epitome.mjs";

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
  return fileURLToPath(new URL("./epitome.mjs", import.meta.url));
}

test("idle unabridged is a hold; folio open and knife sheathed", () => {
  const result = analyze(seedUnabridged());
  assert.equal(result.verdict, "unabridged");
  assert.equal(result.idleWord, "unabridged");
  assert.equal(IDLE_WORD, "unabridged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unabridged, true);
  assert.equal(result.phrase, "admit unabridged");
  assert.equal(result.epitome, false);
  assert.equal(result.summarizedThinkingForce, false);
  assert.ok(HOLD_ALIASES.includes("unabridged"));
  assert.ok(HOLD_ALIASES.includes("full-chain"));
  assert.ok(HOLD_ALIASES.includes("verbatim"));
  assert.ok(HOLD_ALIASES.includes("open-folio"));
  assert.ok(HOLD_ALIASES.includes("intact-thinking"));
  assert.ok(HOLD_ALIASES.includes("chain-open"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify unabridged", () => {
  assert.equal(classify(emptyTicket()), "unabridged");
  assert.equal(classify(""), "unabridged");
  assert.equal(classify(null), "unabridged");
  assert.equal(decide({}), "unabridged");
});

test("#94032 seeded path scores epitome when thinking content is stripped", () => {
  const result = analyze(seedEpitome());
  assert.equal(result.verdict, "epitome");
  assert.equal(result.seededWord, "epitome");
  assert.equal(SEEDED_WORD, "epitome");
  assert.equal(PRODUCT_WORD, "epitome");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.epitome, true);
  assert.equal(result.phrase, "score epitome");
  assert.equal(result.summarizedThinkingForce, true);
  assert.equal(result.emptyThinking, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark abridged folio and cutting knife", () => {
  const folio = inspectFolio({ epitome: true, summarizedThinkingForce: true });
  assert.equal(folio.stamp, "folio-abridged");
  assert.equal(folio.abridged, true);
  const knife = inspectKnife({ epitome: true, summarizedThinkingForce: true });
  assert.equal(knife.stamp, "knife-cutting");
  assert.equal(knife.cutting, true);
  const press = inspectPress({ epitome: true, emptyThinking: true });
  assert.equal(press.stamp, "press-compressed");
  const scored = scoreGate({
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
    cue: "epitome",
  });
  assert.equal(scored.verdict, "epitome");
  const open = inspectFolio({ unabridged: true, epitome: false });
  assert.equal(open.stamp, "folio-open");
});

test("path word is summarized-thinking-force; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "summarized-thinking-force");
  const result = analyze(seedSummarizedThinkingForce());
  assert.equal(result.verdict, "summarized-thinking-force");
  assert.equal(result.pathWord, "summarized-thinking-force");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "summarized-thinking-force",
      preferSeed: true,
      epitome: true,
    }),
    "summarized-thinking-force",
  );
  assert.equal(classify(seedEmptyThinking()), "empty-thinking");
  assert.equal(score(seedSummarizedThinkingForce()), "epitome");
});

test("HOLD includes unabridged / hold", () => {
  assert.ok(HOLD.includes("unabridged"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: empty-thinking, desktop-inject, epitome", () => {
  assert.equal(classify(seedEmptyThinking()), "empty-thinking");
  assert.equal(classify(seedDesktopInject()), "desktop-inject");
  assert.equal(classify(seedProduct()), "epitome");
  assert.equal(classify(seedFlag3531779070()), "flag-3531779070");
});

test("booth fixtures flip unabridged vs epitome vs summarized-thinking-force", () => {
  const idle = scoreGate(seedUnabridged());
  const seeded = scoreGate(seedEpitome());
  const unabridged = readData("unabridged.json");
  const epitome = readData("epitome.json");
  const path = readData("summarized-thinking-force.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "unabridged");
  assert.equal(seeded.verdict, "epitome");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUnabridged()), "unabridged");
  assert.equal(score(seedEpitome()), "epitome");
  assert.equal(
    score({ seed: "summarized-thinking-force", preferSeed: true }),
    "epitome",
  );
  assert.equal(unabridged.summarizedThinkingForce, false);
  assert.equal(unabridged.unabridged, true);
  assert.equal(scoreGate(unabridged).verdict, "unabridged");
  assert.equal(epitome.summarizedThinkingForce, true);
  assert.equal(epitome.emptyThinking, true);
  assert.equal(epitome.flag3531779070, true);
  assert.equal(classify(epitome), "epitome");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /unabridged|full-chain|verbatim|open-folio|intact-thinking|chain-open/i,
  );
  assert.match(
    path.paths[1].result,
    /summarized-thinking-force|empty|signature|3531779070/i,
  );
  assert.equal(classify(path), "summarized-thinking-force");
  assert.equal(epitome.hubCount, "EPITOME");
  assert.equal(epitome.issue, 94032);
  assert.equal(epitome.epitome, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("full-chain.json")), "full-chain");
  assert.equal(classify(readData("verbatim.json")), "verbatim");
  assert.equal(classify(readData("open-folio.json")), "open-folio");
  assert.equal(classify(readData("intact-thinking.json")), "intact-thinking");
  assert.equal(classify(readData("chain-open.json")), "chain-open");
  assert.equal(classify(readData("empty-thinking.json")), "empty-thinking");
  assert.equal(classify(readData("signature-only.json")), "signature-only");
  assert.equal(
    classify(readData("thinking-tokens-nonzero.json")),
    "thinking-tokens-nonzero",
  );
  assert.equal(
    classify(readData("show-summaries-toggle.json")),
    "show-summaries-toggle",
  );
  assert.equal(
    classify(readData("omitted-vs-summarized.json")),
    "omitted-vs-summarized",
  );
  assert.equal(classify(readData("continuation-full.json")), "continuation-full");
  assert.equal(classify(readData("desktop-inject.json")), "desktop-inject");
  assert.equal(classify(readData("flag-3531779070.json")), "flag-3531779070");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("unabridged"));
  assert.ok(CHIPS.includes("epitome"));
  assert.ok(CHIPS.includes("summarized-thinking-force"));
  assert.ok(CHIPS.includes("empty-thinking"));
  assert.ok(CHIPS.includes("flag-3531779070"));
  assert.ok(CHIPS.includes("full-chain"));
  assert.ok(CHIPS.includes("open-folio"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("epitome"));
  assert.ok(ALARM.includes("summarized-thinking-force"));
  assert.ok(ALARM.includes("empty-thinking"));
  assert.ok(ALARM.includes("desktop-inject"));
  assert.ok(ALARM.includes("flag-3531779070"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published epitome walk scores epitome after the idle hold", () => {
  const booth = scoreWalk({ rows: EPITOME_WALK });
  assert.equal(booth.verdict, "epitome");
  assert.ok(booth.epitomeCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-unabridged");
  assert.equal(idle.unabridged, true);
  assert.equal(idle.verdict, "unabridged");
  const cut = booth.rows.find((row) => row.event === "summarized-thinking-force");
  assert.equal(cut.summarizedThinkingForce, true);
  const path = booth.rows.find(
    (row) => row.event === "summarized-thinking-force" && row.t === "path",
  );
  assert.equal(path.verdict, "summarized-thinking-force");
});

test("EPITOME_WALK constant matches the issue desk walk", () => {
  assert.equal(EPITOME_WALK[0].event, "cue-unabridged");
  const cut = EPITOME_WALK.find(
    (row) => row.event === "summarized-thinking-force",
  );
  assert.equal(cut.summarizedThinkingForce || cut.emptyThinking, true);
  const path = EPITOME_WALK.find((row) => row.t === "path");
  assert.equal(path.epitome, true);
  const scoreRow = EPITOME_WALK.find((row) => row.event === "epitome");
  assert.equal(scoreRow.epitome, true);
});

test("positive control unabridged desk stays unabridged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "unabridged");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "unabridged");
  const hold = walk.rows.find((row) => row.event === "cue-unabridged");
  assert.equal(hold.unabridged, true);
  assert.equal(hold.verdict, "unabridged");
});

test("issue constants encode only #94032 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94032);
  assert.ok(ISSUE_URL.includes("94032"));
  assert.match(TITLE, /summarizedThinking|3531779070|thinking-display summarized/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos|ios/i);
  assert.match(HOST, /desktop|mobile|summarizedThinking|3531779070/i);
  assert.equal(BUILD, "Claude Code 2.1.247");
  assert.equal(SURFACE, "summarized-thinking-force");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "platform:ios", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(ABRIDGEMENT_SHAPES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Diabolica|#94040/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Afterimage|#92596/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Scrim/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /full thinking|opt out|thinkingDisplay|full/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /summarizedThinking|3531779070|--thinking-display summarized|thinking": ""|showThinkingSummaries|continuation|WC\(true\)|2\.1\.247|2026-08-25/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("summarized-thinking-force"));
  assert.ok(FINGERPRINT_LINES.includes("epitome"));
  assert.equal(PHRASE, "Score epitome or admit unabridged.");
  assert.equal(SAMPLE_EPITOME_PROOF.summarizedThinkingForce, true);
  assert.equal(SAMPLE_EPITOME_PROOF.shapes.length, 6);
});

test("has-repro fingerprints encode the published epitome proof", () => {
  const result = handle(seedEpitome());
  assert.equal(result.published.platform, "macos+ios");
  assert.equal(result.published.surface, "summarized-thinking-force");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedEpitome()),
    /epitome\|kind=summarized-thinking-force\|ref=signature\|path=summarized-thinking-force\|cue=summarized-thinking-force/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes innocent/sealed/cleared and recent catalog words", () => {
  const required = [
    "innocent",
    "sealed",
    "silenced",
    "living",
    "cleared",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "latent",
    "flushed",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "mondegreen",
    "afterimage",
    "phosphene",
    "scotoma",
    "scrim",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("unabridged booth flips epitome back when the desk admits unabridged", () => {
  const tape = {
    unabridged: true,
    epitome: false,
    summarizedThinkingForce: false,
    cue: "unabridged",
  };
  assert.equal(scoreGate(tape).verdict, "unabridged");
  tape.unabridged = false;
  tape.epitome = true;
  tape.summarizedThinkingForce = true;
  tape.cue = "epitome";
  assert.equal(scoreGate(tape).verdict, "epitome");
  tape.unabridged = true;
  tape.epitome = false;
  tape.summarizedThinkingForce = false;
  tape.cue = "unabridged";
  assert.equal(scoreGate(tape).verdict, "unabridged");
});

test("folio, knife, press, and readBooth mark the epitome proof", () => {
  const idle = inspectFolio({
    unabridged: true,
  });
  assert.equal(idle.stamp, "folio-open");
  const knife = inspectKnife({ epitome: true, summarizedThinkingForce: true });
  assert.equal(knife.stamp, "knife-cutting");
  assert.equal(knife.cutting, true);
  const press = inspectPress({ epitome: true, emptyThinking: true });
  assert.equal(press.stamp, "press-compressed");
  const booth = readBooth({
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
  });
  assert.equal(booth.epitome, true);
  assert.equal(booth.mark, "epitome");
  const open = readBooth({
    unabridged: true,
    epitome: false,
    summarizedThinkingForce: false,
  });
  assert.equal(open.epitome, false);
  assert.equal(open.mark, "unabridged");
  assert.equal(
    inspectSignature({ epitome: true, signatureOnly: true }).stamp,
    "signature-only",
  );
  assert.equal(inspectKnife({ unabridged: true }).stamp, "knife-sheathed");
  assert.equal(
    inspectFlag({ epitome: true, flag3531779070: true }).stamp,
    "flag-forced",
  );
});

test("mapDesk encodes the published open abridgement", () => {
  const miss = mapDesk({ epitome: true, summarizedThinkingForce: true });
  assert.equal(miss.stamp, "summarized-thinking-force");
  assert.equal(miss.holdingLane, "abridged");
  assert.equal(miss.ribbon, "epitome");
  const clear = mapDesk({ unabridged: true, epitome: false });
  assert.equal(clear.stamp, "unabridged-folio");
  assert.equal(clear.kindLane, "open-folio");
  assert.equal(clear.holdingLane, "verbatim");
});

test("cousins cite #49268 #77460 #31326 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 49268);
  assert.equal(COUSINS[1].issue, 77460);
  assert.equal(COUSINS[2].issue, 31326);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("scrim"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 94031);
  assert.equal(BACKUPS[7].issue, 94053);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94032));
  assert.ok(!BACKUPS.some((row) => row.issue === 49268));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/epitome.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unabridgedFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/unabridged.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(unabridgedFix.status, 0, unabridgedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const unabridgedOut = JSON.parse(unabridgedFix.stdout);
  assert.equal(idleOut.verdict, "unabridged");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "epitome");
  assert.equal(seededOut.alarm, true);
  assert.equal(unabridgedOut.verdict, "unabridged");
  assert.equal(unabridgedOut.hold, true);
  assert.match(unabridgedOut.phrase, /admit unabridged/);
});

test("handle exposes published hypothesis and #94032 headline", () => {
  const result = handle(seedEpitome());
  assert.equal(result.published.issue, 94032);
  assert.equal(result.published.platform, "macos+ios");
  assert.deepEqual(result.published.cousins, [49268, 77460, 31326]);
  assert.ok(result.published.backups.includes(94031));
  assert.ok(result.published.backups.includes(94053));
  assert.ok(!result.published.backups.includes(94032));
  assert.match(
    result.published.hypothesis,
    /summarizedThinking|buildBaseExtraArgs|NON-BINDING|#94032/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94032/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the unabridged page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("unabridged page is a scriptorium desk, not court or CRT or fortress", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /epitome|unabridged|summarized-thinking-force|folio|quill-knife|binding-press|gold-rule|scriptorium/i,
  );
  assert.match(page, /#1A1410|#F3E6C8|#2A1C12|#C4A35A|#8B4513|#6B7F8A|#A63D40/i);
  assert.match(page, /\bunabridged\b/);
  assert.match(page, /\bepitome\b/);
  assert.match(page, /summarized-thinking-force/);
  assert.match(page, /Score epitome or admit unabridged/i);
  assert.match(page, /#353/);
  assert.match(page, /#94032/);
  assert.match(page, /Admit unabridged/);
  assert.match(page, /Score epitome/);
  assert.match(page, /Walk summarized-thinking-force/);
  assert.match(page, /Compare unabridged \/ epitome/);
  assert.match(page, /Pin idle unabridged/);
  assert.match(page, /Pin seeded epitome/);
  assert.match(page, /Pin summarized-thinking-force/);
  assert.match(page, /Open the folio/);
  assert.match(page, /Score booth/);
  assert.match(page, /epitome-score/);
  assert.match(
    page,
    /summarizedThinking|3531779070|--thinking-display summarized|thinking": ""|showThinkingSummaries|continuation/i,
  );
  assert.match(page, /folio|knife|press|vellum|gold-rule|quill/i);
  assert.match(page, /<svg[\s\S]*folio|class="folio-leaf"|class="press-beam"/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /phosphor|\bCRT\b/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /bailey|merlon|crenel|gatehouse/i);
  assert.doesNotMatch(page, /phonograph|wax-cylinder|stylus/i);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished lamp/i);
  assert.doesNotMatch(page, /admit innocent|idle innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|idle sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\binnocent\b/);
  assert.doesNotMatch(page, /\bsilenced\b/);
  assert.doesNotMatch(page, /\bliving\b/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Scrim/i);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Epitome/);
  assert.match(readme, /#94032/);
  assert.match(readme, /\bunabridged\b/);
  assert.match(readme, /\bepitome\b/);
  assert.match(readme, /summarized-thinking-force/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Fira Code/);
  assert.doesNotMatch(readme, /Newsreader/);
  assert.doesNotMatch(readme, /Public Sans/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /JetBrains/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /SUMMARIZED-THINKING-FORCE|abridgement|summarizedThinking|3531779070/i,
  );
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /NOT Afterimage\/#92596/);
  assert.match(readme, /#49268|#77460|#31326/);
  assert.match(
    readme,
    /summarizedThinking|3531779070|--thinking-display summarized|thinking": ""/i,
  );
  assert.match(readme, /hermes-playground-green\.vercel\.app\/epitome/);
  assert.match(readme, /node --test projects\/epitome\/epitome\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /folio|knife|press|vellum|gold-rule|scriptorium/i);
  assert.match(readme, /Score epitome or admit unabridged/);
  assert.match(
    readme,
    /#94031|#94029|#93987|#93924|#93770|#93777|#94059|#94053/,
  );
  assert.match(readme, /12:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Epitome/);
  assert.match(runLog, /12:50/);
});

test("catalog features Epitome only; Diabolica unfeatured; product count 353", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 353);
  assert.equal(hub.products.length, 353);
  assert.equal(catalog.products[0].name, "Epitome");
  assert.equal(catalog.products[0].slug, "epitome");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/epitome/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "12:50 epitome: a classical scriptorium / abridger's-desk / folio-compress / quill-knife / binding-press booth for #94032. Desktop & mobile hardcoded summarizedThinking (3531779070) injects --thinking-display summarized so thinking blocks arrive with empty content; showThinkingSummaries only toggles summarized↔omitted — no full-chain opt-out. Idle unabridged / seeded epitome / path summarized-thinking-force. Score epitome or admit unabridged.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bunabridged\b/);
  assert.match(catalog.products[0].summary, /\bepitome\b/);
  assert.match(catalog.products[0].summary, /summarized-thinking-force/);
  assert.match(catalog.products[0].summary, /Score epitome or admit unabridged/);
  assert.match(catalog.products[0].summary, /#94032/);
  assert.equal(hub.products[0].slug, "epitome");
  assert.equal(hub.products[0].featured, true);
  const diabolica = catalog.products.find((row) => row.slug === "diabolica");
  assert.ok(diabolica);
  assert.equal(diabolica.featured, false);
  const sallyport = catalog.products.find((row) => row.slug === "sallyport");
  assert.ok(sallyport);
  assert.equal(sallyport.featured, false);
  const afterimage = catalog.products.find((row) => row.slug === "afterimage");
  assert.ok(afterimage);
  assert.equal(afterimage.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "epitome").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94032") && row.slug !== "epitome",
    ),
  );
});

test("vercel rewrites epitome to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/epitome");
  assert.equal(vercel.rewrites[0].destination, "/projects/epitome");
  assert.equal(vercel.rewrites[1].source, "/epitome/");
  assert.equal(vercel.rewrites[1].destination, "/projects/epitome");
  assert.equal(vercel.rewrites[2].source, "/epitome/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/epitome/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
