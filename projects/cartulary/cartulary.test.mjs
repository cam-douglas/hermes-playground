import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CARTULARY_WALK,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CONNECTOR_COUNT,
  COUSINS,
  EXPIRES_AT_COUNT,
  FEATURED_ISSUE,
  FILED,
  FILE_SIZE_KB,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GROWTH_FROM,
  GROWTH_NEW,
  GROWTH_TO,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  KEY_PATTERN,
  LABELS,
  LECTERN_STATIONS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  RECORD_COUNT,
  RECORDS_PER_CONNECTOR,
  SEEDED_WORD,
  SERVER_URL_PATTERN,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectKeying,
  readLectern,
  readRegister,
  score,
  scoreGate,
  scoreWalk,
  seedAccreted,
  seedBound,
  seedCartulary,
  seedFreshKey,
  seedHold,
  seedIdenticalTokens,
  seedMcpOauth,
  seedNoExpires,
  seedRecords1681,
  seedSessionScoped,
  seedSessionUrl,
  seedTimes113,
} from "./cartulary.mjs";

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
  return fileURLToPath(new URL("./cartulary.mjs", import.meta.url));
}

test("idle bound is a hold; one record per connector keyed by mcp_server_id", () => {
  const result = analyze(seedBound());
  assert.equal(result.verdict, "bound");
  assert.equal(result.idleWord, "bound");
  assert.equal(IDLE_WORD, "bound");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bound, true);
  assert.equal(result.phrase, "admit bound");
  assert.equal(result.stableKey, true);
  assert.equal(result.onePerConnector, true);
  assert.equal(result.pruneEnded, true);
  assert.equal(result.tokensDeduped, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify bound", () => {
  assert.equal(classify(emptyTicket()), "bound");
  assert.equal(classify(""), "bound");
  assert.equal(classify(null), "bound");
  assert.equal(decide({}), "bound");
});

test("#93331 seeded path scores accreted when session-scoped serverUrl re-keys", () => {
  const result = analyze(seedAccreted());
  assert.equal(result.verdict, "accreted");
  assert.equal(result.seededWord, "accreted");
  assert.equal(SEEDED_WORD, "accreted");
  assert.equal(PRODUCT_WORD, "cartulary");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.accreted, true);
  assert.equal(result.phrase, "score cartulary");
  assert.equal(result.sessionScoped, true);
  assert.equal(result.freshKey, true);
  assert.equal(result.identicalTokens, true);
  assert.equal(result.noExpiresAt, true);
  assert.equal(result.times113, true);
  assert.equal(result.recordCount, 1681);
  assert.equal(result.fileSizeKb, 906);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("session-scoped URL plus identical tokens is the #93331 accretion", () => {
  const keying = inspectKeying({
    sessionScoped: true,
    freshKey: true,
  });
  assert.equal(keying.stamp, "accreted");
  assert.equal(keying.sessionScoped, true);
  const scored = scoreGate({
    accreted: true,
    sessionScoped: true,
    freshKey: true,
    identicalTokens: true,
    noExpiresAt: true,
    times113: true,
    recordCount: 1681,
    fileSizeKb: 906,
    cue: "accreted",
  });
  assert.equal(scored.verdict, "accreted");
  assert.equal(scored.sessionScoped, true);
  const calm = inspectKeying({
    stableKey: true,
    sessionScoped: false,
    freshKey: false,
  });
  assert.equal(calm.stamp, "bound");
});

test("path word is session-url; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "session-url");
  const result = analyze(seedSessionUrl());
  assert.equal(result.verdict, "session-url");
  assert.equal(result.pathWord, "session-url");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "session-url", preferSeed: true, accreted: true }),
    "session-url",
  );
  assert.equal(classify(seedFreshKey()), "fresh-key");
});

test("HOLD includes bound / hold", () => {
  assert.ok(HOLD.includes("bound"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: mcp-oauth, session-scoped, fresh-key, tokens, expiry, ×113", () => {
  assert.equal(classify(seedMcpOauth()), "mcp-oauth");
  assert.equal(classify(seedSessionScoped()), "session-scoped");
  assert.equal(classify(seedFreshKey()), "fresh-key");
  assert.equal(classify(seedIdenticalTokens()), "identical-tokens");
  assert.equal(classify(seedNoExpires()), "no-expires");
  assert.equal(classify(seedTimes113()), "times-113");
  assert.equal(classify(seedRecords1681()), "records-1681");
  assert.equal(classify(seedCartulary()), "cartulary");
});

test("fixture toggle flips bound vs accreted", () => {
  const idle = scoreGate(seedBound());
  const seeded = scoreGate(readData("cartulary.json"));
  assert.equal(idle.verdict, "bound");
  assert.equal(seeded.verdict, "accreted");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedBound()), "bound");
  assert.equal(score(readData("cartulary.json")), "accreted");
  const fixture = readData("cartulary.json");
  assert.equal(fixture.sessionScoped, true);
  assert.equal(fixture.freshKey, true);
  assert.equal(fixture.identicalTokens, true);
  assert.equal(fixture.noExpiresAt, true);
  assert.equal(fixture.times113, true);
  assert.equal(fixture.recordCount, 1681);
  assert.equal(fixture.fileSizeKb, 906);
  assert.equal(fixture.issue, 93331);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("bound"));
  assert.ok(CHIPS.includes("accreted"));
  assert.ok(CHIPS.includes("cartulary"));
  assert.ok(CHIPS.includes("session-url"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("accreted"));
  assert.ok(ALARM.includes("session-url"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cartulary walk scores accreted after the idle hold", () => {
  const desk = scoreWalk({ rows: CARTULARY_WALK });
  assert.equal(desk.verdict, "accreted");
  assert.ok(desk.accretedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-bound");
  assert.equal(idle.bound, true);
  assert.equal(idle.verdict, "bound");
  const login = desk.rows.find((row) => row.event === "login-connectors");
  assert.equal(login.loginConnectors, true);
  const count = desk.rows.find((row) => row.event === "count-mcpoauth");
  assert.equal(count.countMcpOauth, true);
  const start = desk.rows.find((row) => row.event === "start-session");
  assert.equal(start.startSession, true);
  const ended = desk.rows.find((row) => row.event === "end-session");
  assert.equal(ended.endSession, true);
  const grow = desk.rows.find((row) => row.event === "count-increases");
  assert.equal(grow.countIncreases, true);
  const sid = desk.rows.find((row) => row.event === "new-session-id");
  assert.equal(sid.newSessionId, true);
  const tokens = desk.rows.find((row) => row.event === "tokens-match");
  assert.equal(tokens.identicalTokens, true);
  const url = desk.rows.find((row) => row.event === "session-scoped-url");
  assert.equal(url.sessionScoped, true);
  const key = desk.rows.find((row) => row.event === "fresh-key");
  assert.equal(key.freshKey, true);
  const exp = desk.rows.find((row) => row.event === "no-expiresAt");
  assert.equal(exp.noExpiresAt, true);
  const cut = desk.rows.find((row) => row.event === "accreted");
  assert.equal(cut.accreted, true);
  const path = desk.rows.find((row) => row.event === "session-url");
  assert.equal(path.verdict, "session-url");
});

test("CARTULARY_WALK constant matches the issue register walk", () => {
  assert.equal(CARTULARY_WALK[0].event, "cue-bound");
  const url = CARTULARY_WALK.find((row) => row.event === "session-scoped-url");
  assert.equal(url.sessionScoped, true);
  const cut = CARTULARY_WALK.find((row) => row.event === "accreted");
  assert.equal(cut.identicalTokens, true);
  assert.equal(cut.recordCount, 1681);
  const path = CARTULARY_WALK.find((row) => row.event === "session-url");
  assert.equal(path.accreted, true);
  const product = CARTULARY_WALK.find((row) => row.event === "cartulary");
  assert.equal(product.accreted, true);
});

test("issue constants encode only #93331 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93331);
  assert.ok(ISSUE_URL.includes("93331"));
  assert.match(TITLE, /mcpOAuth grows unbounded/);
  assert.match(TITLE, /session-scoped serverUrl/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:security"));
  assert.equal(AUTHOR, "kevinmcmurphy");
  assert.equal(FILED, "2026-09-10T11:40:38Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.265");
  assert.match(OS, /macOS 26/);
  assert.equal(RECORD_COUNT, 1681);
  assert.equal(FILE_SIZE_KB, 906);
  assert.equal(CONNECTOR_COUNT, 29);
  assert.equal(RECORDS_PER_CONNECTOR, 113);
  assert.equal(EXPIRES_AT_COUNT, 2);
  assert.equal(GROWTH_FROM, 1653);
  assert.equal(GROWTH_TO, 1681);
  assert.equal(GROWTH_NEW, 28);
  assert.match(KEY_PATTERN, /16-hex hash/);
  assert.match(SERVER_URL_PATTERN, /ccr-sessions/);
  assert.equal(LECTERN_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("session-scoped"));
  assert.ok(FINGERPRINT_LINES.includes("fresh-key"));
  assert.ok(FINGERPRINT_LINES.includes("identical-tokens"));
  assert.ok(FINGERPRINT_LINES.includes("times-113"));
  assert.match(PHRASE, /score cartulary or admit bound/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
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

test("bound register flips accreted back when keying is stable", () => {
  const tape = {
    bound: true,
    stableKey: true,
    onePerConnector: true,
    pruneEnded: true,
    tokensDeduped: true,
    accreted: false,
    cue: "bound",
  };
  assert.equal(scoreGate(tape).verdict, "bound");
  tape.bound = false;
  tape.accreted = true;
  tape.sessionScoped = true;
  tape.cue = "accreted";
  assert.equal(scoreGate(tape).verdict, "accreted");
  tape.bound = true;
  tape.accreted = false;
  tape.sessionScoped = false;
  tape.stableKey = true;
  tape.onePerConnector = true;
  tape.pruneEnded = true;
  tape.tokensDeduped = true;
  tape.cue = "bound";
  assert.equal(scoreGate(tape).verdict, "bound");
});

test("keying, register, and lectern mark accretion after session-url re-key", () => {
  const idle = inspectKeying({ stableKey: true });
  assert.equal(idle.stamp, "bound");
  assert.equal(idle.sessionScoped, false);
  const cut = inspectKeying({
    sessionScoped: true,
    freshKey: true,
  });
  assert.equal(cut.stamp, "accreted");
  const live = readRegister({ recordCount: 29, unbounded: false });
  assert.equal(live.stamp, "bound");
  const reject = readRegister({
    recordCount: 1681,
    fileSizeKb: 906,
    unbounded: true,
    noExpiresAt: true,
    expiresAtCount: 2,
  });
  assert.equal(reject.stamp, "accreted");
  assert.equal(reject.noExpiresAt, true);
  const desk = readLectern({
    accreted: true,
    sessionScoped: true,
    freshKey: true,
  });
  assert.equal(desk.accreted, true);
  assert.equal(desk.cue, "accreted");
  const calm = readLectern({
    bound: true,
    stableKey: true,
    accreted: false,
  });
  assert.equal(calm.accreted, false);
  assert.equal(calm.cue, "bound");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 9);
  assert.equal(COUSINS[0].issue, 91158);
  assert.equal(COUSINS[1].issue, 91180);
  assert.equal(COUSINS[2].issue, 92748);
  assert.equal(COUSINS[8].issue, 83707);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
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
    [modelPath(), fileURLToPath(new URL("./data/cartulary.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "bound");
  assert.equal(JSON.parse(seeded.stdout).verdict, "accreted");
});

test("handle exposes published hypothesis and #93331 headline", () => {
  const result = handle(readData("cartulary.json"));
  assert.equal(result.published.issue, 93331);
  assert.equal(result.published.claudeCodeVersion, "2.1.265");
  assert.equal(result.published.author, "kevinmcmurphy");
  assert.equal(result.published.recordCount, 1681);
  assert.equal(result.published.fileSizeKb, 906);
  assert.equal(result.published.recordsPerConnector, 113);
  assert.deepEqual(result.published.cousins, [
    91158, 91180, 92748, 88487, 91641, 89671, 87405, 74250, 83707,
  ]);
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93280));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /session-scoped CCR MCP URL/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedAccreted()),
    /accreted\|key=session-url\|tokens=identical\|expires=sparse\|dup=113\|cue=accreted/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a monastic cartulary desk, not a notarial wax chamber", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /cartulary|lectern|quire|inkhorn|register index/i);
  assert.match(page, /#1a1612|#4a6b5a|#c4923a/);
  assert.match(page, /bound/);
  assert.match(page, /accreted/);
  assert.match(page, /session-url/);
  assert.match(page, /score cartulary or admit bound/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /22:50/);
  assert.match(page, /#271/);
  assert.match(page, /#93331/);
  assert.match(page, /kevinmcmurphy/);
  assert.match(page, /2\.1\.265/);
  assert.match(page, /1,681|1681/);
  assert.match(page, /906/);
  assert.match(page, /Open the lectern/);
  assert.match(page, /Score cartulary/);
  assert.match(page, /Walk the quire/);
  assert.match(page, /Inspect the folio/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /DM Mono/);
  assert.doesNotMatch(page, /Sora/);
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
  assert.doesNotMatch(page, /#101318/);
  assert.doesNotMatch(page, /#dcc9a3/);
  assert.doesNotMatch(page, /#8e1a2a/);
  assert.doesNotMatch(page, /#b8924a/);
  assert.doesNotMatch(page, /#1c2228/);
  assert.doesNotMatch(page, /#6d7380/);
  assert.doesNotMatch(page, /#1a1016/);
  assert.doesNotMatch(page, /#d8b45c/);
  assert.doesNotMatch(page, /#b31b2e/);
  assert.doesNotMatch(page, /#efe4c8/);
  assert.doesNotMatch(page, /#3d1a28/);
  assert.doesNotMatch(page, /#6b2d4a/);
  assert.doesNotMatch(page, /#061018/);
  assert.doesNotMatch(page, /#2b1d12/);
  assert.doesNotMatch(page, /wax press|issuer ribbon|signature paraph|wax-seal crimson/i);
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
  assert.doesNotMatch(page, /\bparaph\b/);
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
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\bmismatched\b/);
  assert.doesNotMatch(page, /\bissuer\b/);
  assert.match(page, /NOT Paraph/i);
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
  assert.match(readme, /Cartulary/);
  assert.match(readme, /#93331/);
  assert.match(readme, /bound/);
  assert.match(readme, /accreted/);
  assert.match(readme, /session-url/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Paraph/i);
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
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cartulary/);
  assert.match(readme, /node --test projects\/cartulary\/cartulary\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /session-scoped CCR MCP URL/);
  assert.match(readme, /#93279/);
  assert.match(readme, /#91158/);
  assert.match(readme, /#91180/);
  assert.match(readme, /#92748/);
  assert.match(readme, /#93280/);
});

test("catalog #271 features Cartulary only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 271);
  assert.equal(catalog.products[0].name, "Cartulary");
  assert.equal(catalog.products[0].slug, "cartulary");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cartulary/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /22:50/);
  assert.match(catalog.products[0].summary, /cartulary/);
  assert.match(catalog.products[0].summary, /#93331/);
  assert.match(catalog.products[0].summary, /bound/);
  assert.match(catalog.products[0].summary, /accreted/);
  assert.match(catalog.products[0].summary, /session-url/);
  const paraph = catalog.products.find((row) => row.slug === "paraph");
  assert.ok(paraph);
  assert.equal(paraph.featured, false);
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
  assert.equal(catalog.products.filter((row) => row.slug === "cartulary").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93331") && row.slug !== "cartulary"));
});

test("vercel rewrites cartulary to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cartulary");
  assert.equal(vercel.rewrites[0].destination, "/projects/cartulary");
  assert.equal(vercel.rewrites[1].source, "/cartulary/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cartulary");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
