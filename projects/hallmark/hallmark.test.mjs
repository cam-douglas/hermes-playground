import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTH,
  BETA_HEADER,
  CHIPS,
  CONTEXT_WINDOW_1M,
  CONTEXT_WINDOW_200K,
  COUSINS,
  DARWIN,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_PARTY_HOST,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HALLMARK_WALK,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MACOS,
  MODEL_BARE,
  MODEL_FRESH,
  NOT_PRODUCTS,
  PATH_WORD,
  PRODUCT,
  PROXY_BASE_URL,
  REPORTER,
  REPRO_RATE,
  SEEDED_WORD,
  SESSION_IDS_REPRODUCED,
  SETTINGS_MISMATCH_MODEL,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedDebased,
  seedRubbed,
  seedSterling,
} from "./hallmark.mjs";

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

function modelPath() {
  return fileURLToPath(new URL("./hallmark.mjs", import.meta.url));
}

test("idle sterling is a hold; resume keeps [1m], 1M window, and the beta header", () => {
  const result = analyze(seedSterling());
  assert.equal(result.verdict, "sterling");
  assert.equal(result.idleWord, "sterling");
  assert.equal(IDLE_WORD, "sterling");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sterling, true);
  assert.equal(result.phrase, "admit sterling");
  assert.equal(result.modelIdHas1mSuffix, true);
  assert.equal(result.contextWindow, 1000000);
  assert.equal(result.betaHeaderHasContext1m, true);
  assert.equal(result.transcriptModelIdHonored, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify sterling", () => {
  assert.equal(classify(emptyTicket()), "sterling");
  assert.equal(classify(""), "sterling");
  assert.equal(classify(null), "sterling");
  assert.equal(decide({}), "sterling");
});

test("#93021 seeded path scores debased from resume that loses [1m]", () => {
  const result = analyze(seedDebased());
  assert.equal(result.verdict, "debased");
  assert.equal(result.seededWord, "debased");
  assert.equal(SEEDED_WORD, "debased");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.debased, true);
  assert.equal(result.phrase, "score debased");
  assert.equal(result.modelIdHas1mSuffix, false);
  assert.equal(result.contextWindow, 200000);
  assert.equal(result.betaHeaderHasContext1m, false);
  assert.equal(result.firstPartyHost, false);
  assert.equal(result.settingsModelMatches, false);
  assert.equal(result.transcriptModelIdHonored, false);
  assert.equal(result.apiEchoedBareIdUsed, true);
  assert.equal(result.freshModelIdHas1m, true);
  assert.equal(result.baseUrl, "http://127.0.0.1:8798");
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is rubbed; named rubbed seed holds the path", () => {
  assert.equal(PATH_WORD, "rubbed");
  const result = analyze(seedRubbed());
  assert.equal(result.verdict, "rubbed");
  assert.equal(result.pathWord, "rubbed");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("rubbed.json")), "rubbed");
});

test("fixture toggle flips sterling vs debased", () => {
  const sterling = scoreGate(readData("sterling.json"));
  const debased = scoreGate(readData("debased.json"));
  assert.equal(sterling.verdict, "sterling");
  assert.equal(debased.verdict, "debased");
  assert.notEqual(sterling.verdict, debased.verdict);
  assert.equal(score(readData("sterling.json")), "sterling");
  assert.equal(score(readData("debased.json")), "debased");
  assert.equal(score(readData("93021.json")), "debased");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("bare-model-id.json")), "bare-model-id");
  assert.equal(classify(readData("missing-1m-suffix.json")), "missing-1m-suffix");
  assert.equal(classify(readData("context-window-200k.json")), "context-window-200k");
  assert.equal(classify(readData("beta-header-missing.json")), "beta-header-missing");
  assert.equal(classify(readData("non-first-party-base-url.json")), "non-first-party-base-url");
  assert.equal(classify(readData("settings-model-mismatch.json")), "settings-model-mismatch");
  assert.equal(classify(readData("transcript-modelId-ignored.json")), "transcript-modelId-ignored");
  assert.equal(classify(readData("api-echoed-bare-id.json")), "api-echoed-bare-id");
  assert.equal(classify(readData("proxy-masked-on-first-party.json")), "proxy-masked-on-first-party");
  assert.equal(classify(readData("matching-settings-keeps-1m.json")), "matching-settings-keeps-1m");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published hallmark walk scores debased after resume rubs [1m] off", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "debased");
  assert.ok(night.debasedCount >= 1);
  const gate = night.rows.find((row) => row.event === "non-first-party-base-url");
  assert.equal(gate.verdict, "debased");
  assert.equal(gate.firstPartyHost, false);
  assert.equal(gate.baseUrl, "http://127.0.0.1:8798");
  const settings = night.rows.find((row) => row.event === "settings-model-mismatch");
  assert.equal(settings.verdict, "debased");
  assert.equal(settings.settingsModelMatches, false);
  const transcript = night.rows.find((row) => row.event === "transcript-modelId-ignored");
  assert.equal(transcript.verdict, "debased");
  assert.equal(transcript.transcriptModelIdHonored, false);
  const bare = night.rows.find((row) => row.event === "bare-model-id");
  assert.equal(bare.verdict, "debased");
  assert.equal(bare.restoredModelId, "claude-fable-5-1");
  const suffix = night.rows.find((row) => row.event === "missing-1m-suffix");
  assert.equal(suffix.verdict, "debased");
  assert.equal(suffix.modelIdHas1mSuffix, false);
  const echo = night.rows.find((row) => row.event === "api-echoed-bare-id");
  assert.equal(echo.verdict, "debased");
  assert.equal(echo.apiEchoedBareIdUsed, true);
  const window = night.rows.find((row) => row.event === "context-window-200k");
  assert.equal(window.verdict, "debased");
  assert.equal(window.contextWindow, 200000);
  const beta = night.rows.find((row) => row.event === "beta-header-missing");
  assert.equal(beta.verdict, "debased");
  assert.equal(beta.betaHeaderHasContext1m, false);
});

test("HALLMARK_WALK constant matches the issue resume path", () => {
  assert.equal(HALLMARK_WALK[0].event, "non-first-party-base-url");
  assert.equal(HALLMARK_WALK[0].firstPartyHost, false);
  assert.equal(HALLMARK_WALK[0].baseUrl, "http://127.0.0.1:8798");
  const settings = HALLMARK_WALK.find((row) => row.event === "settings-model-mismatch");
  assert.equal(settings.settingsModel, "opus[1m]");
  assert.equal(settings.sessionModel, "claude-fable-5-1[1m]");
  const transcript = HALLMARK_WALK.find((row) => row.event === "transcript-modelId-ignored");
  assert.equal(transcript.freshModelId, "claude-fable-5-1[1m]");
  assert.equal(transcript.restoredModelId, "claude-fable-5-1");
  const window = HALLMARK_WALK.find((row) => row.event === "context-window-200k");
  assert.equal(window.contextWindow, 200000);
  const beta = HALLMARK_WALK.find((row) => row.event === "beta-header-missing");
  assert.equal(beta.betaHeaderHasContext1m, false);
});

test("issue constants encode only #93021 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93021);
  assert.ok(ISSUE_URL.includes("93021"));
  assert.match(TITLE, /--resume loses \[1m\]/);
  assert.match(TITLE, /non-first-party ANTHROPIC_BASE_URL/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("area:providers"));
  assert.equal(REPORTER, "DimitarKrastev");
  assert.equal(FILED_AT, "2026-09-09T07:47:27Z");
  assert.match(PRODUCT, /2\.1\.266/);
  assert.match(PRODUCT, /Terminal\.app/);
  assert.match(AUTH, /OAuth/);
  assert.equal(DARWIN, "25.4.0");
  assert.equal(MACOS, "26");
  assert.equal(SESSION_IDS_REPRODUCED, 3);
  assert.equal(REPRO_RATE, "100%");
  assert.equal(MODEL_FRESH, "claude-fable-5-1[1m]");
  assert.equal(MODEL_BARE, "claude-fable-5-1");
  assert.equal(CONTEXT_WINDOW_1M, 1000000);
  assert.equal(CONTEXT_WINDOW_200K, 200000);
  assert.equal(BETA_HEADER, "context-1m-2025-08-07");
  assert.equal(PROXY_BASE_URL, "http://127.0.0.1:8798");
  assert.equal(FIRST_PARTY_HOST, "api.anthropic.com");
  assert.equal(SETTINGS_MISMATCH_MODEL, "opus[1m]");
  assert.ok(HOLD.includes("sterling"));
  assert.ok(ALARM.includes("debased"));
  assert.ok(ALARM.includes("rubbed"));
  assert.ok(CHIPS.includes("bare-model-id"));
  assert.ok(VERDICTS.includes("missing-1m-suffix"));
  assert.ok(VERDICTS.includes("context-window-200k"));
  assert.ok(VERDICTS.includes("beta-header-missing"));
  assert.ok(VERDICTS.includes("walk"));
});

test("losing [1m] flips sterling to debased; restoring the mark recovers", () => {
  const tape = {
    modelIdHas1mSuffix: true,
    contextWindow: 1000000,
    betaHeaderHasContext1m: true,
    firstPartyHost: false,
    settingsModelMatches: false,
    transcriptModelIdHonored: true,
    apiEchoedBareIdUsed: false,
    freshModelIdHas1m: true,
  };
  assert.equal(scoreGate(tape).verdict, "sterling");
  tape.modelIdHas1mSuffix = false;
  tape.contextWindow = 200000;
  tape.betaHeaderHasContext1m = false;
  tape.transcriptModelIdHonored = false;
  tape.apiEchoedBareIdUsed = true;
  assert.equal(scoreGate(tape).verdict, "debased");
  tape.modelIdHas1mSuffix = true;
  tape.contextWindow = 1000000;
  tape.betaHeaderHasContext1m = true;
  tape.transcriptModelIdHonored = true;
  tape.apiEchoedBareIdUsed = false;
  assert.equal(scoreGate(tape).verdict, "sterling");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [64771, 60548, 80272, 67806, 81142, 88345, 81068, 90325, 90324],
  );
  assert.equal(COUSINS.length, 9);
  assert.equal(COUSINS[0].issue, 64771);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.equal(COUSINS[4].issue, 81142);
  assert.equal(COUSINS[4].state, "OPEN");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("assay"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const sterling = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sterling.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const debased = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/debased.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sterling.status, 0, sterling.stderr);
  assert.equal(debased.status, 0, debased.stderr);
  assert.equal(JSON.parse(sterling.stdout).verdict, "sterling");
  assert.equal(JSON.parse(debased.stdout).verdict, "debased");
});

test("handle exposes published hypothesis and #93021 headline", () => {
  const result = handle(readData("93021.json"));
  assert.equal(result.published.issue, 93021);
  assert.equal(result.published.contextWindow1m, 1000000);
  assert.equal(result.published.contextWindow200k, 200000);
  assert.equal(result.published.betaHeader, "context-1m-2025-08-07");
  assert.equal(result.published.proxyBaseUrl, "http://127.0.0.1:8798");
  assert.equal(result.published.sessionIdsReproduced, 3);
  assert.deepEqual(result.published.cousins, [
    64771, 60548, 80272, 67806, 81142, 88345, 81068, 90325, 90324,
  ]);
  assert.match(result.published.hypothesis, /API-echoed bare model id/);
  assert.match(
    fingerprint(seedDebased()),
    /debased\|mark=bare\|window=200000\|beta=missing\|host=non-first-party/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a silversmith hallmark booth, not flashpan / secateurs / assay furnace", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Lato/);
  assert.match(page, /Fira Code/);
  assert.match(page, /hallmark|assay booth|purity mark|silversmith/i);
  assert.match(page, /Assay the strike/);
  assert.match(page, /Pin idle sterling/);
  assert.match(page, /Pin seeded debased/);
  assert.match(page, /Admit sterling/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to sterling/);
  assert.match(page, /score debased or admit sterling/i);
  assert.match(page, /sterling/);
  assert.match(page, /debased/);
  assert.match(page, /rubbed/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /17:50/);
  assert.match(page, /#244/);
  assert.match(page, /#93021/);
  assert.match(page, /claude-fable-5-1\[1m\]/);
  assert.match(page, /context-1m-2025-08-07/);
  assert.match(page, /127\.0\.0\.1:8798/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Figtree|Roboto Mono/);
  assert.doesNotMatch(page, /Cardo|Nunito|IBM Plex/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3|Share Tech Mono/);
  assert.doesNotMatch(page, /Chakra Petch|\bHind\b/);
  assert.doesNotMatch(page, /Spectral|Fragment Mono/);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /gunmetal|oil-black|cyan instrument/i);
  assert.doesNotMatch(page, /plant-floor|E-stop|hazard stripe/i);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\bflashpanned\b/);
  assert.doesNotMatch(page, /\bsheared\b/);
  assert.doesNotMatch(page, /\bunretracted\b/);
  assert.doesNotMatch(page, /\bemended\b/);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Hallmark/);
  assert.match(readme, /#93021/);
  assert.match(readme, /sterling/);
  assert.match(readme, /debased/);
  assert.match(readme, /rubbed/);
  assert.match(readme, /\[1m\]/);
  assert.match(readme, /ANTHROPIC_BASE_URL/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /NOT Assay/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/hallmark/);
  assert.match(readme, /node --test projects\/hallmark\/hallmark\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #244 features Hallmark; Flashpan stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 244);
  assert.equal(catalog.products[0].name, "Hallmark");
  assert.equal(catalog.products[0].slug, "hallmark");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/hallmark/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  const flashpan = catalog.products.find((row) => row.slug === "flashpan");
  assert.ok(flashpan);
  assert.equal(flashpan.featured, false);
  const secateurs = catalog.products.find((row) => row.slug === "secateurs");
  assert.ok(secateurs);
  assert.equal(secateurs.featured, false);
});
