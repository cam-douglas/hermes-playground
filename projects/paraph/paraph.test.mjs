import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  COUSINS,
  DESKTOP_BUILD,
  DESKTOP_VERSION,
  ERROR_TEXT,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OAUTH_MODE,
  OS,
  PARAPH_WALK,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  QUOTE_CLOSE_ARTIFACT,
  SEEDED_WORD,
  SEAL_STATIONS,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectQuotes,
  readInstrument,
  readPress,
  score,
  scoreGate,
  scoreWalk,
  seedByoOauth,
  seedCliOk,
  seedConfigInvariant,
  seedDesktopOnly,
  seedHold,
  seedInitializeFail,
  seedIssuer,
  seedMalformedTemplate,
  seedMismatched,
  seedNoBrowserWindow,
  seedParaph,
  seedPercent22,
  seedQuoted,
  seedSealed,
} from "./paraph.mjs";

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
  return fileURLToPath(new URL("./paraph.mjs", import.meta.url));
}

test("idle sealed is a hold; issuer strings compared with real quotes", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sealed, true);
  assert.equal(result.phrase, "admit sealed");
  assert.equal(result.realQuotes, true);
  assert.equal(result.oauthWindow, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify sealed", () => {
  assert.equal(classify(emptyTicket()), "sealed");
  assert.equal(classify(""), "sealed");
  assert.equal(classify(null), "sealed");
  assert.equal(decide({}), "sealed");
});

test("#93327 seeded path scores mismatched when quotes close with %22", () => {
  const result = analyze(seedMismatched());
  assert.equal(result.verdict, "mismatched");
  assert.equal(result.seededWord, "mismatched");
  assert.equal(SEEDED_WORD, "mismatched");
  assert.equal(PRODUCT_WORD, "paraph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mismatched, true);
  assert.equal(result.phrase, "score paraph");
  assert.equal(result.percent22, true);
  assert.equal(result.malformedTemplate, true);
  assert.equal(result.noBrowserWindow, true);
  assert.equal(result.initializeFail, true);
  assert.equal(result.cliOk, true);
  assert.equal(result.desktopOnly, true);
  assert.equal(result.byoOauth, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("percent-22 plus malformed template is the #93327 mismatch", () => {
  const quotes = inspectQuotes({
    expected: "https://<account>.snowflakecomputing.com/oauth%22",
    received: "https://<account>.snowflakecomputing.com/oauth%22",
    percent22: true,
    malformedTemplate: true,
    opensWithQuote: true,
    closesWithPercent22: true,
  });
  assert.equal(quotes.stamp, "mismatched");
  assert.equal(quotes.percent22, true);
  assert.equal(quotes.malformed, true);
  const scored = scoreGate({
    mismatched: true,
    percent22: true,
    malformedTemplate: true,
    noBrowserWindow: true,
    initializeFail: true,
    cliOk: true,
    cue: "mismatched",
  });
  assert.equal(scored.verdict, "mismatched");
  assert.equal(scored.percent22, true);
  const calm = inspectQuotes({
    realQuotes: true,
    percent22: false,
    malformedTemplate: false,
  });
  assert.equal(calm.stamp, "sealed");
});

test("path word is issuer; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "issuer");
  const result = analyze(seedIssuer());
  assert.equal(result.verdict, "issuer");
  assert.equal(result.pathWord, "issuer");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "issuer", preferSeed: true, mismatched: true }),
    "issuer",
  );
  assert.equal(classify(seedPercent22()), "percent-22");
});

test("HOLD includes sealed / hold", () => {
  assert.ok(HOLD.includes("sealed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: byo-oauth, percent-22, template, config, desktop, cli, window, init", () => {
  assert.equal(classify(seedByoOauth()), "byo-oauth");
  assert.equal(classify(seedPercent22()), "percent-22");
  assert.equal(classify(seedMalformedTemplate()), "malformed-template");
  assert.equal(classify(seedConfigInvariant()), "config-invariant");
  assert.equal(classify(seedDesktopOnly()), "desktop-only");
  assert.equal(classify(seedCliOk()), "cli-ok");
  assert.equal(classify(seedNoBrowserWindow()), "no-browser-window");
  assert.equal(classify(seedInitializeFail()), "initialize-fail");
  assert.equal(classify(seedParaph()), "paraph");
  assert.equal(classify(seedQuoted()), "quoted");
});

test("fixture toggle flips sealed vs mismatched", () => {
  const idle = scoreGate(seedSealed());
  const seeded = scoreGate(readData("paraph.json"));
  assert.equal(idle.verdict, "sealed");
  assert.equal(seeded.verdict, "mismatched");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSealed()), "sealed");
  assert.equal(score(readData("paraph.json")), "mismatched");
  const fixture = readData("paraph.json");
  assert.equal(fixture.percent22, true);
  assert.equal(fixture.malformedTemplate, true);
  assert.equal(fixture.noBrowserWindow, true);
  assert.equal(fixture.cliOk, true);
  assert.equal(fixture.byoOauth, true);
  assert.equal(fixture.issue, 93327);
  assert.match(fixture.expected, /oauth%22/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("mismatched"));
  assert.ok(CHIPS.includes("paraph"));
  assert.ok(CHIPS.includes("issuer"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("mismatched"));
  assert.ok(ALARM.includes("issuer"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published paraph walk scores mismatched after the idle hold", () => {
  const desk = scoreWalk({ rows: PARAPH_WALK });
  assert.equal(desk.verdict, "mismatched");
  assert.ok(desk.mismatchedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-sealed");
  assert.equal(idle.sealed, true);
  assert.equal(idle.verdict, "sealed");
  const byo = desk.rows.find((row) => row.event === "byo-oauth");
  assert.equal(byo.byoOauth, true);
  const sign = desk.rows.find((row) => row.event === "sign-in-test");
  assert.equal(sign.signInTest, true);
  const probe = desk.rows.find((row) => row.event === "version-negotiation-probe");
  assert.equal(probe.versionNegotiationProbe, true);
  const artifact = desk.rows.find((row) => row.event === "percent-22");
  assert.equal(artifact.percent22, true);
  const template = desk.rows.find((row) => row.event === "malformed-template");
  assert.equal(template.malformedTemplate, true);
  const config = desk.rows.find((row) => row.event === "config-invariant");
  assert.equal(config.configInvariant, true);
  const window = desk.rows.find((row) => row.event === "no-browser-window");
  assert.equal(window.noBrowserWindow, true);
  const init = desk.rows.find((row) => row.event === "initialize-fail");
  assert.equal(init.initializeFail, true);
  const cli = desk.rows.find((row) => row.event === "cli-ok");
  assert.equal(cli.cliOk, true);
  const cut = desk.rows.find((row) => row.event === "mismatched");
  assert.equal(cut.mismatched, true);
  const path = desk.rows.find((row) => row.event === "issuer");
  assert.equal(path.verdict, "issuer");
});

test("PARAPH_WALK constant matches the issue instrument walk", () => {
  assert.equal(PARAPH_WALK[0].event, "cue-sealed");
  const artifact = PARAPH_WALK.find((row) => row.event === "percent-22");
  assert.equal(artifact.percent22, true);
  const cut = PARAPH_WALK.find((row) => row.event === "mismatched");
  assert.equal(cut.cliOk, true);
  assert.equal(cut.noBrowserWindow, true);
  const path = PARAPH_WALK.find((row) => row.event === "issuer");
  assert.equal(path.mismatched, true);
  const score = PARAPH_WALK.find((row) => row.event === "paraph");
  assert.equal(score.mismatched, true);
});

test("issue constants encode only #93327 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93327);
  assert.ok(ISSUE_URL.includes("93327"));
  assert.match(TITLE, /Issuer mismatch/);
  assert.match(TITLE, /RFC 8414/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(AUTHOR, "Simonmaignan");
  assert.equal(FILED, "2026-09-10T10:44:19Z");
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.equal(DESKTOP_BUILD, "41ad1d");
  assert.match(OS, /Windows/);
  assert.match(OS, /macOS/);
  assert.equal(OAUTH_MODE, "byo");
  assert.equal(QUOTE_CLOSE_ARTIFACT, "%22");
  assert.match(ERROR_TEXT, /oauth%22/);
  assert.match(ERROR_TEXT, /Version negotiation probe failed/);
  assert.equal(SEAL_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("byo-oauth"));
  assert.ok(FINGERPRINT_LINES.includes("percent-22"));
  assert.ok(FINGERPRINT_LINES.includes("malformed-template"));
  assert.ok(FINGERPRINT_LINES.includes("no-browser-window"));
  assert.match(PHRASE, /score paraph or admit sealed/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "routed",
    "inherited",
    "cascade",
    "appanage",
    "afloat",
    "washed",
    "bridge-loss",
    "pontoon",
    "concordant",
    "mismatched-header",
    "header-mismatch",
    "concordat",
    "reaped",
    "revenant",
    "wedged",
    "restored",
    "expanded",
    "laid",
    "released",
    "freehold",
    "trunked",
    "tokenized",
    "locked",
    "scratched",
    "unmasked",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
    "held",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("sealed instrument flips mismatched back when quotes are real", () => {
  const tape = {
    sealed: true,
    realQuotes: true,
    matchingIssuers: true,
    oauthWindow: true,
    desktopMatchesCli: true,
    mismatched: false,
    cue: "sealed",
  };
  assert.equal(scoreGate(tape).verdict, "sealed");
  tape.sealed = false;
  tape.mismatched = true;
  tape.percent22 = true;
  tape.cue = "mismatched";
  assert.equal(scoreGate(tape).verdict, "mismatched");
  tape.sealed = true;
  tape.mismatched = false;
  tape.percent22 = false;
  tape.realQuotes = true;
  tape.matchingIssuers = true;
  tape.oauthWindow = true;
  tape.desktopMatchesCli = true;
  tape.cue = "sealed";
  assert.equal(scoreGate(tape).verdict, "sealed");
});

test("quotes, press, and instrument mark mismatch after %22 close", () => {
  const idle = inspectQuotes({ realQuotes: true });
  assert.equal(idle.stamp, "sealed");
  assert.equal(idle.percent22, false);
  const cut = inspectQuotes({
    percent22: true,
    malformedTemplate: true,
    expected: "https://<account>.snowflakecomputing.com/oauth%22",
  });
  assert.equal(cut.stamp, "mismatched");
  const live = readPress({ oauthWindow: true });
  assert.equal(live.stamp, "sealed");
  const reject = readPress({
    noBrowserWindow: true,
    oauthWindow: false,
    initializeFail: true,
  });
  assert.equal(reject.stamp, "mismatched");
  assert.equal(reject.noBrowserWindow, true);
  const desk = readInstrument({
    mismatched: true,
    percent22: true,
    noBrowserWindow: true,
  });
  assert.equal(desk.mismatched, true);
  assert.equal(desk.cue, "mismatched");
  const calm = readInstrument({
    sealed: true,
    realQuotes: true,
    mismatched: false,
  });
  assert.equal(calm.mismatched, false);
  assert.equal(calm.cue, "sealed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 87713);
  assert.equal(COUSINS[1].issue, 90970);
  assert.equal(COUSINS[2].issue, 88370);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("appanage"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("replevin"));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("scion"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93279);
  assert.equal(BACKUPS[4].issue, 93280);
  assert.equal(BACKUPS[6].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/paraph.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "sealed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "mismatched");
});

test("handle exposes published hypothesis and #93327 headline", () => {
  const result = handle(readData("paraph.json"));
  assert.equal(result.published.issue, 93327);
  assert.equal(result.published.desktopVersion, "1.49585.0");
  assert.equal(result.published.author, "Simonmaignan");
  assert.equal(result.published.oauthMode, "byo");
  assert.equal(result.published.quoteCloseArtifact, "%22");
  assert.deepEqual(result.published.cousins, [87713, 90970, 88370]);
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93280));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /hardcoded %22/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedMismatched()),
    /mismatched\|quotes=%22\|template=malformed\|window=dark\|cli=ok\|cue=mismatched/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a notarial issuer-seal chamber, not a heraldic grant desk", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Figtree/);
  assert.match(page, /Roboto Mono/);
  assert.match(page, /paraph|notarial|wax press|issuer ribbon|signature paraph/i);
  assert.match(page, /#101318|#dcc9a3|#8e1a2a|#b8924a|#1c2228|#6d7380/);
  assert.match(page, /sealed/);
  assert.match(page, /mismatched/);
  assert.match(page, /issuer/);
  assert.match(page, /score paraph or admit sealed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /20:50/);
  assert.match(page, /#270/);
  assert.match(page, /#93327/);
  assert.match(page, /Simonmaignan/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /%22/);
  assert.match(page, /Open the instrument/);
  assert.match(page, /Score paraph/);
  assert.match(page, /Walk the seal/);
  assert.match(page, /Inspect the issuer/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /DM Mono/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#1a1016/);
  assert.doesNotMatch(page, /#d8b45c/);
  assert.doesNotMatch(page, /#b31b2e/);
  assert.doesNotMatch(page, /#efe4c8/);
  assert.doesNotMatch(page, /#3d1a28/);
  assert.doesNotMatch(page, /#6b2d4a/);
  assert.doesNotMatch(page, /#061018/);
  assert.doesNotMatch(page, /#2b1d12/);
  assert.doesNotMatch(page, /séance|seance|process-tomb|graveyard|charcoal bone|cold violet/i);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /philology|ochre gloss|cognate desk/i);
  assert.doesNotMatch(page, /writ desk|bond parchment|court green|bronze seal/i);
  assert.doesNotMatch(page, /flintlock|flash-pan|priming-pan/i);
  assert.doesNotMatch(page, /water clock/);
  assert.doesNotMatch(page, /chancery|treaty-desk|protocol.desk|diplomatic|seal-wax/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|timber deck|salt fog|navigation lights/i);
  assert.doesNotMatch(page, /letters patent|heraldic|cadency|coronet/i);
  assert.doesNotMatch(page, /\bappanage\b/);
  assert.doesNotMatch(page, /\brouted\b/);
  assert.doesNotMatch(page, /\binherited\b/);
  assert.doesNotMatch(page, /\bcascade\b/);
  assert.doesNotMatch(page, /\bafloat\b/);
  assert.doesNotMatch(page, /\bwashed\b/);
  assert.doesNotMatch(page, /\bpontoon\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\breplevin\b/);
  assert.doesNotMatch(page, /\bcognate\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bexpanded\b/);
  assert.doesNotMatch(page, /\brestored\b/);
  assert.doesNotMatch(page, /\bconcordant\b/);
  assert.doesNotMatch(page, /\bconcordat\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.match(page, /NOT Appanage/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Concordat/i);
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Buoy/i);
  assert.match(page, /NOT Vernier/i);
  assert.match(page, /NOT Scion/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Paraph/);
  assert.match(readme, /#93327/);
  assert.match(readme, /sealed/);
  assert.match(readme, /mismatched/);
  assert.match(readme, /issuer/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Roboto Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Appanage/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT Replevin/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Buoy/i);
  assert.match(readme, /NOT Vernier/i);
  assert.match(readme, /NOT Scion/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/paraph/);
  assert.match(readme, /node --test projects\/paraph\/paraph\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /hardcoded %22/);
  assert.match(readme, /#93279/);
  assert.match(readme, /#87713/);
  assert.match(readme, /#90970/);
  assert.match(readme, /#88370/);
  assert.match(readme, /#93280/);
});

test("catalog #270 features Paraph only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 270);
  assert.equal(catalog.products[0].name, "Paraph");
  assert.equal(catalog.products[0].slug, "paraph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/paraph/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /20:50/);
  assert.match(catalog.products[0].summary, /paraph/);
  assert.match(catalog.products[0].summary, /#93327/);
  assert.match(catalog.products[0].summary, /sealed/);
  assert.match(catalog.products[0].summary, /mismatched/);
  assert.match(catalog.products[0].summary, /issuer/);
  const appanage = catalog.products.find((row) => row.slug === "appanage");
  assert.ok(appanage);
  assert.equal(appanage.featured, false);
  const pontoon = catalog.products.find((row) => row.slug === "pontoon");
  assert.ok(pontoon);
  assert.equal(pontoon.featured, false);
  const concordat = catalog.products.find((row) => row.slug === "concordat");
  assert.ok(concordat);
  assert.equal(concordat.featured, false);
  const revenant = catalog.products.find((row) => row.slug === "revenant");
  assert.ok(revenant);
  assert.equal(revenant.featured, false);
  const drift = catalog.products.find((row) => row.slug === "drift-radar");
  assert.ok(drift);
  assert.equal(drift.featured, false);
  const reorder = catalog.products.find((row) => row.slug === "reorder-radar");
  assert.ok(reorder);
  assert.equal(reorder.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "paraph").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93327") && row.slug !== "paraph"));
});

test("vercel rewrites paraph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/paraph");
  assert.equal(vercel.rewrites[0].destination, "/projects/paraph");
  assert.equal(vercel.rewrites[1].source, "/paraph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/paraph");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
