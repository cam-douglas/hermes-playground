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
  CLAUDE_VERSION,
  CONCORDAT_WALK,
  COUSINS,
  DESK_STATIONS,
  DESKTOP_VERSION,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEADER_NAME,
  HEADER_VERSION,
  HOLD,
  HTTP_STATUS,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  META_KEY,
  META_VERSION,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  REJECT_CODE,
  RELAY_CODE,
  SEEDED_WORD,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  compareInstruments,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readChancery,
  score,
  scoreGate,
  scoreWalk,
  seedBodyNew,
  seedConcordant,
  seedConcordat,
  seedConnectedLie,
  seedDiscord,
  seedDiscover,
  seedHeaderMismatch,
  seedHeaderStale,
  seedHold,
  seedLegacy,
  seedMismatched,
  seedRelay,
  seedSep2575,
  seedStatelessReject,
  stampSeal,
} from "./concordat.mjs";

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
  return fileURLToPath(new URL("./concordat.mjs", import.meta.url));
}

test("idle concordant is a hold; header and body versions agree", () => {
  const result = analyze(seedConcordant());
  assert.equal(result.verdict, "concordant");
  assert.equal(result.idleWord, "concordant");
  assert.equal(IDLE_WORD, "concordant");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.concordant, true);
  assert.equal(result.phrase, "admit concordant");
  assert.equal(result.headerVersion, META_VERSION);
  assert.equal(result.metaVersion, META_VERSION);
  assert.equal(result.toolsFail, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify concordant", () => {
  assert.equal(classify(emptyTicket()), "concordant");
  assert.equal(classify(""), "concordant");
  assert.equal(classify(null), "concordant");
  assert.equal(decide({}), "concordant");
});

test("#93290 seeded path scores mismatched when header and _meta disagree", () => {
  const result = analyze(seedMismatched());
  assert.equal(result.verdict, "mismatched");
  assert.equal(result.seededWord, "mismatched");
  assert.equal(SEEDED_WORD, "mismatched");
  assert.equal(PRODUCT_WORD, "concordat");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mismatched, true);
  assert.equal(result.phrase, "score concordat");
  assert.equal(result.headerVersion, "2025-11-25");
  assert.equal(result.metaVersion, "2026-07-28");
  assert.equal(result.toolsFail, true);
  assert.equal(result.connected, true);
  assert.equal(result.code, -32020);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("header/body disagreement is the #93290 discord", () => {
  const compared = compareInstruments({
    headerVersion: "2025-11-25",
    metaVersion: "2026-07-28",
  });
  assert.equal(compared.agree, false);
  assert.equal(compared.discord, true);
  assert.equal(compared.stamp, "mismatched");
  const scored = scoreGate({
    headerVersion: "2025-11-25",
    metaVersion: "2026-07-28",
    toolsFail: true,
    connected: true,
    code: -32020,
  });
  assert.equal(scored.verdict, "mismatched");
  assert.equal(scored.discord, true);
  assert.equal(scored.headerMismatch, true);
  const agree = compareInstruments({
    headerVersion: "2026-07-28",
    metaVersion: "2026-07-28",
  });
  assert.equal(agree.agree, true);
  assert.equal(agree.discord, false);
});

test("VS Code legacy path is a contrast: no _meta, tools work", () => {
  const result = analyze(seedLegacy());
  assert.equal(result.verdict, "legacy");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.client, "vscode");
  assert.equal(result.toolsFail, false);
  const live = scoreGate({
    client: "vscode",
    headerVersion: "2025-11-25",
    metaVersion: null,
    toolsFail: false,
    connected: true,
    event: "legacy",
  });
  assert.equal(live.verdict, "legacy");
  assert.equal(live.hold, true);
  assert.notEqual(live.verdict, "mismatched");
});

test("path word is header-mismatch; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "header-mismatch");
  const result = analyze(seedHeaderMismatch());
  assert.equal(result.verdict, "header-mismatch");
  assert.equal(result.pathWord, "header-mismatch");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "header-mismatch", preferSeed: true, headerMismatch: true }),
    "header-mismatch",
  );
  assert.equal(classify(seedDiscord()), "discord");
});

test("HOLD includes concordant / hold / legacy", () => {
  assert.ok(HOLD.includes("concordant"));
  assert.ok(HOLD.includes("hold"));
  assert.ok(HOLD.includes("legacy"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: discover, header-stale, body-new, reject, relay, lie", () => {
  assert.equal(classify(seedDiscover()), "discover");
  assert.equal(classify(seedHeaderStale()), "header-stale");
  assert.equal(classify(seedBodyNew()), "body-new");
  assert.equal(classify(seedStatelessReject()), "stateless-reject");
  assert.equal(analyze(seedStatelessReject()).code, -32020);
  assert.equal(classify(seedRelay()), "relay-32603");
  assert.equal(classify(seedConnectedLie()), "connected-lie");
  assert.equal(classify(seedSep2575()), "sep-2575");
  assert.equal(classify(seedConcordat()), "concordat");
});

test("fixture toggle flips concordant vs mismatched", () => {
  const idle = scoreGate(seedConcordant());
  const seeded = scoreGate(readData("concordat.json"));
  assert.equal(idle.verdict, "concordant");
  assert.equal(seeded.verdict, "mismatched");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedConcordant()), "concordant");
  assert.equal(score(readData("concordat.json")), "mismatched");
  const fixture = readData("concordat.json");
  assert.equal(fixture.headerVersion, "2025-11-25");
  assert.equal(fixture.metaVersion, "2026-07-28");
  assert.equal(fixture.code, -32020);
  assert.equal(fixture.connected, true);
  assert.equal(fixture.toolsFail, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("concordant"));
  assert.ok(CHIPS.includes("mismatched"));
  assert.ok(CHIPS.includes("concordat"));
  assert.ok(CHIPS.includes("header-mismatch"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("mismatched"));
  assert.ok(ALARM.includes("header-mismatch"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published concordat walk scores mismatched after the idle hold", () => {
  const desk = scoreWalk({ rows: CONCORDAT_WALK });
  assert.equal(desk.verdict, "mismatched");
  assert.ok(desk.mismatchedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-concordant");
  assert.equal(idle.concordant, true);
  assert.equal(idle.verdict, "concordant");
  const discover = desk.rows.find((row) => row.event === "discover");
  assert.equal(discover.sep2575, true);
  const header = desk.rows.find((row) => row.event === "header-stale");
  assert.equal(header.headerVersion, "2025-11-25");
  const body = desk.rows.find((row) => row.event === "body-new");
  assert.equal(body.metaVersion, "2026-07-28");
  const reject = desk.rows.find((row) => row.event === "stateless-reject");
  assert.equal(reject.code, -32020);
  const relay = desk.rows.find((row) => row.event === "relay-32603");
  assert.equal(relay.relayCode, -32603);
  const lie = desk.rows.find((row) => row.event === "connected-lie");
  assert.equal(lie.connected, true);
  assert.equal(lie.toolsFail, true);
  const cut = desk.rows.find((row) => row.event === "mismatched");
  assert.equal(cut.headerMismatch, true);
  const path = desk.rows.find((row) => row.event === "header-mismatch");
  assert.equal(path.verdict, "header-mismatch");
  const legacy = desk.rows.find((row) => row.event === "legacy");
  assert.equal(legacy.client, "vscode");
  assert.equal(legacy.hold, true);
});

test("CONCORDAT_WALK constant matches the issue chancery walk", () => {
  assert.equal(CONCORDAT_WALK[0].event, "cue-concordant");
  const header = CONCORDAT_WALK.find((row) => row.event === "header-stale");
  assert.equal(header.headerVersion, "2025-11-25");
  const body = CONCORDAT_WALK.find((row) => row.event === "body-new");
  assert.equal(body.metaVersion, "2026-07-28");
  const cut = CONCORDAT_WALK.find((row) => row.event === "mismatched");
  assert.equal(cut.toolsFail, true);
  const path = CONCORDAT_WALK.find((row) => row.event === "header-mismatch");
  assert.equal(path.headerMismatch, true);
});

test("issue constants encode only #93290 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93290);
  assert.ok(ISSUE_URL.includes("93290"));
  assert.match(TITLE, /Mcp-Protocol-Version: 2025-11-25/);
  assert.match(TITLE, /2026-07-28/);
  assert.match(TITLE, /-32020/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(AUTHOR, "StephaneBernard");
  assert.equal(FILED, "2026-09-10T07:30:40Z");
  assert.equal(CLAUDE_VERSION, "2.1.267");
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.match(OS, /macOS/);
  assert.equal(HEADER_VERSION, "2025-11-25");
  assert.equal(META_VERSION, "2026-07-28");
  assert.equal(HEADER_NAME, "Mcp-Protocol-Version");
  assert.equal(META_KEY, "io.modelcontextprotocol/protocolVersion");
  assert.equal(REJECT_CODE, -32020);
  assert.equal(RELAY_CODE, -32603);
  assert.equal(HTTP_STATUS, 400);
  assert.equal(DESK_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("Mcp-Protocol-Version: 2025-11-25"));
  assert.ok(FINGERPRINT_LINES.includes("-32020"));
  assert.match(PHRASE, /score concordat or admit concordant/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "reaped",
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
    "revenant",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("agreeing instruments flip mismatched back to concordant", () => {
  const tape = {
    concordant: true,
    headerVersion: "2026-07-28",
    metaVersion: "2026-07-28",
    headerMismatch: false,
    toolsFail: false,
    cue: "concordant",
  };
  assert.equal(scoreGate(tape).verdict, "concordant");
  tape.concordant = false;
  tape.headerVersion = "2025-11-25";
  tape.headerMismatch = true;
  tape.toolsFail = true;
  tape.code = -32020;
  tape.cue = "mismatched";
  assert.equal(scoreGate(tape).verdict, "mismatched");
  tape.concordant = true;
  tape.headerVersion = "2026-07-28";
  tape.headerMismatch = false;
  tape.toolsFail = false;
  tape.code = 0;
  tape.cue = "concordant";
  assert.equal(scoreGate(tape).verdict, "concordant");
});

test("instruments, seal, and pouch mark discord after header/body split", () => {
  const idle = compareInstruments({
    headerVersion: "2026-07-28",
    metaVersion: "2026-07-28",
  });
  assert.equal(idle.stamp, "concordant");
  assert.equal(idle.discord, false);
  const cut = compareInstruments({
    headerVersion: "2025-11-25",
    metaVersion: "2026-07-28",
  });
  assert.equal(cut.stamp, "mismatched");
  const live = stampSeal({
    headerVersion: "2026-07-28",
    metaVersion: "2026-07-28",
  });
  assert.equal(live.cracked, false);
  assert.equal(live.stamp, "concordant");
  const reject = stampSeal({
    headerVersion: "2025-11-25",
    metaVersion: "2026-07-28",
    code: -32020,
  });
  assert.equal(reject.stamp, "mismatched");
  assert.equal(reject.code, -32020);
  assert.equal(reject.http, 400);
  const desk = readChancery({
    headerVersion: "2025-11-25",
    metaVersion: "2026-07-28",
    connected: true,
    toolsFail: true,
    code: -32020,
  });
  assert.equal(desk.discord, true);
  assert.equal(desk.cue, "mismatched");
  const calm = readChancery({
    headerVersion: "2026-07-28",
    metaVersion: "2026-07-28",
    toolsFail: false,
  });
  assert.equal(calm.discord, false);
  assert.equal(calm.cue, "concordant");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 92835);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("replevin"));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 2);
  assert.equal(BACKUPS[0].issue, "go-sdk#1162");
  assert.equal(BACKUPS[1].issue, "go-sdk#1164");
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/concordat.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "concordant");
  assert.equal(JSON.parse(seeded.stdout).verdict, "mismatched");
});

test("handle exposes published hypothesis and #93290 headline", () => {
  const result = handle(readData("concordat.json"));
  assert.equal(result.published.issue, 93290);
  assert.equal(result.published.claudeVersion, "2.1.267");
  assert.equal(result.published.author, "StephaneBernard");
  assert.equal(result.published.headerVersion, "2025-11-25");
  assert.equal(result.published.metaVersion, "2026-07-28");
  assert.equal(result.published.rejectCode, -32020);
  assert.equal(result.published.relayCode, -32603);
  assert.deepEqual(result.published.cousins, [92835]);
  assert.deepEqual(result.published.backups, ["go-sdk#1162", "go-sdk#1164"]);
  assert.match(result.published.hypothesis, /stale 2025-11-25 header/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedMismatched()),
    /mismatched\|header=2025-11-25\|meta=2026-07-28\|tools=fail\|ui=connected\|cue=mismatched/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a treaty chancery / protocol desk, not a séance parlor", () => {
  const page = readPage();
  assert.match(page, /Vollkorn/);
  assert.match(page, /DM Sans/);
  assert.match(page, /Inconsolata/);
  assert.match(page, /chancery|treaty-desk|protocol.desk|diplomatic/i);
  assert.match(page, /#f7e8c8|#a11f32|#1a140e|#d4b05a/);
  assert.match(page, /concordant/);
  assert.match(page, /mismatched/);
  assert.match(page, /header-mismatch/);
  assert.match(page, /score concordat or admit concordant/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /17:50/);
  assert.match(page, /#267/);
  assert.match(page, /#93290/);
  assert.match(page, /Mcp-Protocol-Version/);
  assert.match(page, /2025-11-25/);
  assert.match(page, /2026-07-28/);
  assert.match(page, /-32020/);
  assert.match(page, /StephaneBernard/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /Read the header/);
  assert.match(page, /Score concordat/);
  assert.match(page, /Press the seal/);
  assert.match(page, /Compare the instruments/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /DM Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
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
  assert.doesNotMatch(page, /#0c0a0d/);
  assert.doesNotMatch(page, /#cfc6b8/);
  assert.doesNotMatch(page, /#6e5a9a/);
  assert.doesNotMatch(page, /#b34728/);
  assert.doesNotMatch(page, /#e6d5b8/);
  assert.doesNotMatch(page, /#1b4d3e/);
  assert.doesNotMatch(page, /#a86b32/);
  assert.doesNotMatch(page, /#f4ead6/);
  assert.doesNotMatch(page, /#1c2744/);
  assert.doesNotMatch(page, /#c47a2c/);
  assert.doesNotMatch(page, /#f0d9a0/);
  assert.doesNotMatch(page, /#0a0e1c/);
  assert.doesNotMatch(page, /#12151f/);
  assert.doesNotMatch(page, /#c3924a/);
  assert.doesNotMatch(page, /#efe6d4/);
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
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Clepsydra/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Concordat/);
  assert.match(readme, /#93290/);
  assert.match(readme, /concordant/);
  assert.match(readme, /mismatched/);
  assert.match(readme, /header-mismatch/);
  assert.match(readme, /Vollkorn/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /Inconsolata/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT Replevin/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Clepsydra/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/concordat/);
  assert.match(readme, /node --test projects\/concordat\/concordat\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Mcp-Protocol-Version/);
  assert.match(readme, /2026-07-28/);
  assert.match(readme, /-32020/);
});

test("catalog #267 features Concordat only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 267);
  assert.equal(catalog.products[0].name, "Concordat");
  assert.equal(catalog.products[0].slug, "concordat");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/concordat/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /17:50/);
  assert.match(catalog.products[0].summary, /concordat/);
  assert.match(catalog.products[0].summary, /#93290/);
  assert.match(catalog.products[0].summary, /concordant/);
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
  assert.equal(catalog.products.filter((row) => row.slug === "concordat").length, 1);
});

test("vercel rewrites concordat to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/concordat");
  assert.equal(vercel.rewrites[0].destination, "/projects/concordat");
  assert.equal(vercel.rewrites[1].source, "/concordat/");
  assert.equal(vercel.rewrites[1].destination, "/projects/concordat");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
