import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALLOWLIST,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_VERSION,
  CLAUDE_VARS,
  COGNATE_WALK,
  COUSINS,
  DESK_STATIONS,
  ERROR_CLOSED,
  ERROR_MODULE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LITERAL_ARG,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  SEEDED_WORD,
  SPEC,
  SPEC_VARS,
  STATE,
  TITLE,
  VERDICTS,
  WORKAROUND_ARG,
  analyze,
  classify,
  decide,
  emptyTicket,
  expandLemma,
  fingerprint,
  handle,
  markGloss,
  readDesk,
  score,
  scoreGate,
  scoreWalk,
  seedAllowlist,
  seedClaudeDialect,
  seedCognate,
  seedConnectionClosed,
  seedExpanded,
  seedHold,
  seedLiteral,
  seedModuleNotFound,
  seedNoHint,
  seedRelativeWorkaround,
  seedSpecAlias,
  seedUnexpanded,
} from "./cognate.mjs";

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

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./cognate.mjs", import.meta.url));
}

test("idle expanded is a hold; spec + Claude aliases both expand", () => {
  const result = analyze(seedExpanded());
  assert.equal(result.verdict, "expanded");
  assert.equal(result.idleWord, "expanded");
  assert.equal(IDLE_WORD, "expanded");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.expanded, true);
  assert.equal(result.phrase, "admit expanded");
  assert.equal(result.unexpanded, false);
  assert.equal(result.moduleNotFound, false);
  assert.equal(result.connectionClosed, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify expanded", () => {
  assert.equal(classify(emptyTicket()), "expanded");
  assert.equal(classify(""), "expanded");
  assert.equal(classify(null), "expanded");
  assert.equal(decide({}), "expanded");
});

test("#93250 seeded path scores cognate when ${PLUGIN_ROOT} is left literal", () => {
  const result = analyze(seedCognate());
  assert.equal(result.verdict, "cognate");
  assert.equal(result.seededWord, "cognate");
  assert.equal(SEEDED_WORD, "cognate");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.cognate, true);
  assert.equal(result.phrase, "score cognate");
  assert.equal(result.specPlaceholder, true);
  assert.equal(result.allowlistClaudeOnly, true);
  assert.equal(result.unexpanded, true);
  assert.equal(result.argsLiteral, true);
  assert.equal(result.envLiteral, true);
  assert.equal(result.cwdLiteral, true);
  assert.equal(result.moduleNotFound, true);
  assert.equal(result.connectionClosed, true);
  assert.equal(result.noHint, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is literal; named literal seed holds the path", () => {
  assert.equal(PATH_WORD, "literal");
  const result = analyze(seedLiteral());
  assert.equal(result.verdict, "literal");
  assert.equal(result.pathWord, "literal");
  assert.equal(result.hold, false);
  assert.equal(classify({ seed: "literal", preferSeed: true, literal: true }), "literal");
});

test("HOLD includes expanded / hold", () => {
  assert.ok(HOLD.includes("expanded"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: spec-alias, claude-dialect, allowlist, unexpanded, module, closed, no-hint", () => {
  assert.equal(analyze(seedSpecAlias()).specPlaceholder, true);
  assert.equal(classify(seedSpecAlias()), "spec-alias");
  assert.equal(analyze(seedClaudeDialect()).allowlistClaudeOnly, true);
  assert.equal(classify(seedClaudeDialect()), "claude-dialect");
  assert.equal(analyze(seedAllowlist()).allowlistClaudeOnly, true);
  assert.equal(classify(seedAllowlist()), "allowlist");
  assert.equal(analyze(seedUnexpanded()).unexpanded, true);
  assert.equal(classify(seedUnexpanded()), "unexpanded");
  assert.equal(analyze(seedModuleNotFound()).moduleNotFound, true);
  assert.equal(classify(seedModuleNotFound()), "module-not-found");
  assert.equal(analyze(seedConnectionClosed()).connectionClosed, true);
  assert.equal(classify(seedConnectionClosed()), "connection-closed");
  assert.equal(analyze(seedNoHint()).noHint, true);
  assert.equal(classify(seedNoHint()), "no-hint");
  assert.equal(classify(seedRelativeWorkaround()), "relative-workaround");
});

test("fixture toggle flips expanded vs cognate", () => {
  const expanded = scoreGate(seedExpanded());
  const cognate = scoreGate(readData("cognate.json"));
  assert.equal(expanded.verdict, "expanded");
  assert.equal(cognate.verdict, "cognate");
  assert.notEqual(expanded.verdict, cognate.verdict);
  assert.equal(score(seedExpanded()), "expanded");
  assert.equal(score(readData("cognate.json")), "cognate");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("expanded"));
  assert.ok(CHIPS.includes("cognate"));
  assert.ok(CHIPS.includes("literal"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("cognate"));
  assert.ok(ALARM.includes("literal"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cognate walk scores cognate after the hold floods", () => {
  const desk = scoreWalk({ rows: COGNATE_WALK });
  assert.equal(desk.verdict, "cognate");
  assert.ok(desk.cognateCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-expanded");
  assert.equal(idle.expanded, true);
  assert.equal(idle.verdict, "expanded");
  const spec = desk.rows.find((row) => row.event === "spec-alias");
  assert.equal(spec.specPlaceholder, true);
  const dialect = desk.rows.find((row) => row.event === "claude-dialect");
  assert.equal(dialect.allowlistClaudeOnly, true);
  const allow = desk.rows.find((row) => row.event === "allowlist");
  assert.equal(allow.allowlistClaudeOnly, true);
  const gloss = desk.rows.find((row) => row.event === "unexpanded");
  assert.equal(gloss.unexpanded, true);
  const wire = desk.rows.find((row) => row.event === "literal-args");
  assert.equal(wire.argsLiteral, true);
  const missing = desk.rows.find((row) => row.event === "module-not-found");
  assert.equal(missing.moduleNotFound, true);
  const closed = desk.rows.find((row) => row.event === "connection-closed");
  assert.equal(closed.connectionClosed, true);
  const hint = desk.rows.find((row) => row.event === "no-hint");
  assert.equal(hint.noHint, true);
  const hear = desk.rows.find((row) => row.event === "cognate");
  assert.equal(hear.unexpanded, true);
  const path = desk.rows.find((row) => row.event === "literal");
  assert.equal(path.verdict, "literal");
});

test("COGNATE_WALK constant matches the issue desk walk", () => {
  assert.equal(COGNATE_WALK[0].event, "cue-expanded");
  const spec = COGNATE_WALK.find((row) => row.event === "spec-alias");
  assert.equal(spec.specPlaceholder, true);
  const gloss = COGNATE_WALK.find((row) => row.event === "unexpanded");
  assert.equal(gloss.unexpanded, true);
  const hear = COGNATE_WALK.find((row) => row.event === "cognate");
  assert.equal(hear.moduleNotFound, true);
  const path = COGNATE_WALK.find((row) => row.event === "literal");
  assert.equal(path.literal, true);
});

test("issue constants encode only #93250 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93250);
  assert.ok(ISSUE_URL.includes("93250"));
  assert.match(TITLE, /PLUGIN_ROOT/);
  assert.match(TITLE, /Agent Plugins spec/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:plugins"));
  assert.equal(AUTHOR, "joshyim");
  assert.equal(FILED, "2026-09-10T03:06:22Z");
  assert.equal(CLAUDE_VERSION, "2.1.260");
  assert.match(SPEC, /v1\.1\.0/);
  assert.ok(SPEC_VARS.includes("PLUGIN_ROOT"));
  assert.ok(SPEC_VARS.includes("PLUGIN_DATA"));
  assert.ok(CLAUDE_VARS.includes("CLAUDE_PLUGIN_ROOT"));
  assert.equal(ALLOWLIST, "^\\$\\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\\}$");
  assert.equal(LITERAL_ARG, "${PLUGIN_ROOT}/dist/index.js");
  assert.equal(WORKAROUND_ARG, "./dist/index.js");
  assert.equal(ERROR_MODULE, "MODULE_NOT_FOUND");
  assert.equal(ERROR_CLOSED, "CONNECTION_CLOSED");
  assert.equal(DESK_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("${PLUGIN_ROOT}"));
  assert.ok(FINGERPRINT_LINES.includes("MODULE_NOT_FOUND"));
  assert.match(PHRASE, /spec-standard \$\{PLUGIN_ROOT\} cognate literal/);
  assert.match(PHRASE, /score cognate or admit expanded/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "laid",
    "lemures",
    "remanent",
    "released",
    "escheat",
    "stale",
    "freehold",
    "mortmain",
    "phantom",
    "trunked",
    "strowger",
    "exchanged",
    "tokenized",
    "mondegreen",
    "parsed",
    "locked",
    "scratched",
    "derby",
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "moored",
    "scuttled",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "cleared",
    "mounded",
    "distinct",
    "held",
    "raised",
    "fallen",
    "primed",
    "flashed",
    "greenroomed",
    "scaffold",
    "stereotype",
    "parergon",
    "lacuna",
    "hangfire",
    "afterimage",
    "remora",
    "quieted",
    "unrung",
    "latent",
    "flushed",
    "collated",
    "stereotyped",
    "deadair",
    "squelch",
    "scuttle",
    "fresh",
    "stamped",
    "conflated",
    "steered",
    "vernier",
    "slider",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring an expanded desk flips cognate to expanded", () => {
  const tape = {
    expanded: true,
    unexpanded: false,
    specPlaceholder: false,
    moduleNotFound: false,
    cue: "expanded",
  };
  assert.equal(scoreGate(tape).verdict, "expanded");
  tape.expanded = false;
  tape.unexpanded = true;
  tape.specPlaceholder = true;
  tape.allowlistClaudeOnly = true;
  tape.cue = "cognate";
  assert.equal(scoreGate(tape).verdict, "cognate");
  tape.expanded = true;
  tape.unexpanded = false;
  tape.specPlaceholder = false;
  tape.allowlistClaudeOnly = false;
  tape.cue = "expanded";
  assert.equal(scoreGate(tape).verdict, "expanded");
});

test("lemma and gloss mark literal cognates after unexpanded spec alias", () => {
  const idleLemma = expandLemma({ expanded: true, unexpanded: false });
  assert.equal(idleLemma.rite, "expanded");
  assert.equal(idleLemma.args, "/plugins/my-plugin/dist/index.js");
  const cutLemma = expandLemma({ expanded: false, unexpanded: true });
  assert.equal(cutLemma.rite, "cognate");
  assert.equal(cutLemma.args, "${PLUGIN_ROOT}/dist/index.js");
  const live = markGloss({
    unexpanded: false,
    specPlaceholder: false,
    allowlistClaudeOnly: false,
  });
  assert.equal(live.glossed, false);
  assert.equal(live.lamp, "expanded");
  const cut = markGloss({
    unexpanded: true,
    specPlaceholder: true,
    allowlistClaudeOnly: true,
    moduleNotFound: true,
  });
  assert.equal(cut.lamp, "cognate");
  assert.equal(cut.moduleNotFound, true);
  const desk = readDesk({
    unexpanded: true,
    specPlaceholder: true,
    allowlistClaudeOnly: true,
    moduleNotFound: true,
  });
  assert.equal(desk.literalCognate, true);
  assert.equal(desk.cue, "cognate");
  const calm = readDesk({ expanded: true, unexpanded: false });
  assert.equal(calm.literalCognate, false);
  assert.equal(calm.cue, "expanded");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 93057);
  assert.equal(COUSINS[1].issue, 79889);
  assert.equal(COUSINS[2].issue, 78963);
  assert.equal(COUSINS[3].issue, 13452);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("calque"));
  assert.ok(NOT_PRODUCTS.includes("sigil"));
  assert.ok(NOT_PRODUCTS.includes("caret"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93219);
  assert.equal(BACKUPS[1].issue, 93207);
  assert.equal(BACKUPS[2].issue, 93239);
  assert.equal(BACKUPS[3].issue, 93259);
  assert.equal(BACKUPS[4].issue, 93257);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const expanded = spawnSync(
    process.execPath,
    [modelPath()],
    { encoding: "utf8" },
  );
  const cognate = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cognate.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(expanded.status, 0, expanded.stderr);
  assert.equal(cognate.status, 0, cognate.stderr);
  assert.equal(JSON.parse(expanded.stdout).verdict, "expanded");
  assert.equal(JSON.parse(cognate.stdout).verdict, "cognate");
});

test("handle exposes published hypothesis and #93250 headline", () => {
  const result = handle(readData("cognate.json"));
  assert.equal(result.published.issue, 93250);
  assert.equal(result.published.claudeVersion, "2.1.260");
  assert.equal(result.published.author, "joshyim");
  assert.equal(result.published.literalArg, "${PLUGIN_ROOT}/dist/index.js");
  assert.equal(result.published.errorModule, "MODULE_NOT_FOUND");
  assert.deepEqual(result.published.cousins, [93057, 79889, 78963, 13452]);
  assert.deepEqual(result.published.backups, [93219, 93207, 93239, 93259, 93257]);
  assert.match(result.published.hypothesis, /CLAUDE_\*/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedCognate()),
    /cognate\|spec=yes\|allow=claude\|expand=no\|args=literal\|mod=missing\|conn=closed\|cue=cognate/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a philology cognate desk, not a courtyard or chamber", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /philology|manuscript|cognate desk|lemma|ochre gloss|parchment/i);
  assert.match(page, /#f4ead6|#1c2744|#c47a2c|#f0d9a0/);
  assert.match(page, /expanded/);
  assert.match(page, /cognate/);
  assert.match(page, /literal/);
  assert.match(page, /score cognate or admit expanded/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /14:50/);
  assert.match(page, /#262/);
  assert.match(page, /#93250/);
  assert.match(page, /PLUGIN_ROOT/);
  assert.match(page, /PLUGIN_DATA/);
  assert.match(page, /CLAUDE_PLUGIN_ROOT/);
  assert.match(page, /MODULE_NOT_FOUND/);
  assert.match(page, /CONNECTION_CLOSED/);
  assert.match(page, /mcp\.json/);
  assert.match(page, /joshyim/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /Agent Plugins spec/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#0a0e1c/);
  assert.doesNotMatch(page, /#12151f/);
  assert.doesNotMatch(page, /#c3924a/);
  assert.doesNotMatch(page, /#efe6d4/);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles|bone-white masks/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID|iron coffer/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\blaid\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bremanent\b/);
  assert.doesNotMatch(page, /\bfreehold\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Ephemera/i);
  assert.match(page, /NOT Palimpsest/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Quietus/i);
  assert.match(page, /NOT Calque/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cognate/);
  assert.match(readme, /#93250/);
  assert.match(readme, /expanded/);
  assert.match(readme, /cognate/);
  assert.match(readme, /literal/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cognate/);
  assert.match(readme, /node --test projects\/cognate\/cognate\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /PLUGIN_ROOT/);
  assert.match(readme, /MODULE_NOT_FOUND/);
});

test("catalog #262 features Cognate; Lemures stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 262);
  assert.equal(catalog.products[0].name, "Cognate");
  assert.equal(catalog.products[0].slug, "cognate");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cognate/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /14:50/);
  assert.match(catalog.products[0].summary, /cognate/);
  assert.match(catalog.products[0].summary, /#93250/);
  assert.match(catalog.products[0].summary, /expanded/);
  const lemures = catalog.products.find((row) => row.slug === "lemures");
  assert.ok(lemures);
  assert.equal(lemures.featured, false);
  const escheat = catalog.products.find((row) => row.slug === "escheat");
  assert.ok(escheat);
  assert.equal(escheat.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cognate").length, 1);
});

test("vercel rewrites cognate to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cognate");
  assert.equal(vercel.rewrites[0].destination, "/projects/cognate");
  assert.equal(vercel.rewrites[1].source, "/cognate/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cognate");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
