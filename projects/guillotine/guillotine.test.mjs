import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTO_ALLOW_ALREADY_SET,
  CHIPS,
  COUSINS,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GUILLOTINE_WALK,
  HANG_HOURS,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MAC_SURFACE,
  MODEL,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PRIOR_APPROVALS_ALREADY_SET,
  PRODUCT,
  REGRESSION,
  REPORTER,
  SEEDED_WORD,
  STATE,
  TITLE,
  VERDICTS,
  VERSION,
  WINDOWS_COMMENT_AT,
  WINDOWS_COMMENTER,
  WINDOWS_SURFACE,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedDenyOnly,
  seedFallen,
  seedRaised,
  seedScaffold,
  seedWinComputerRequest,
} from "./guillotine.mjs";

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
  return fileURLToPath(new URL("./guillotine.mjs", import.meta.url));
}

test("idle raised is a hold; Accept + Deny both available", () => {
  const result = analyze(seedRaised());
  assert.equal(result.verdict, "raised");
  assert.equal(result.idleWord, "raised");
  assert.equal(IDLE_WORD, "raised");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.raised, true);
  assert.equal(result.phrase, "admit raised");
  assert.equal(result.acceptAvailable, true);
  assert.equal(result.denyAvailable, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify raised", () => {
  assert.equal(classify(emptyTicket()), "raised");
  assert.equal(classify(""), "raised");
  assert.equal(classify(null), "raised");
  assert.equal(decide({}), "raised");
});

test("#92974 seeded path scores fallen when Accept is missing", () => {
  const result = analyze(seedFallen());
  assert.equal(result.verdict, "fallen");
  assert.equal(result.seededWord, "fallen");
  assert.equal(SEEDED_WORD, "fallen");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.fallen, true);
  assert.equal(result.phrase, "score fallen");
  assert.equal(result.acceptAvailable, false);
  assert.equal(result.denyAvailable, true);
  assert.equal(result.acceptMissing, true);
  assert.equal(result.hangWaiting, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is scaffold; named scaffold seed holds the path", () => {
  assert.equal(PATH_WORD, "scaffold");
  const result = analyze(seedScaffold());
  assert.equal(result.verdict, "scaffold");
  assert.equal(result.pathWord, "scaffold");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("scaffold.json")), "scaffold");
});

test("deny-only and Windows computer_request_access fixtures", () => {
  const deny = analyze(seedDenyOnly());
  assert.equal(deny.acceptAvailable, false);
  assert.equal(deny.denyAvailable, true);
  assert.equal(classify(readData("deny-only.json")), "deny-only");
  const win = analyze(seedWinComputerRequest());
  assert.equal(win.permissionKind, "computer_request_access");
  assert.equal(win.platform, "windows");
  assert.equal(win.checkboxDead, true);
  assert.equal(classify(readData("win-computer-request.json")), "win-computer-request");
});

test("fixture toggle flips raised vs fallen", () => {
  const raised = scoreGate(readData("raised.json"));
  const fallen = scoreGate(readData("fallen.json"));
  assert.equal(raised.verdict, "raised");
  assert.equal(fallen.verdict, "fallen");
  assert.notEqual(raised.verdict, fallen.verdict);
  assert.equal(score(readData("raised.json")), "raised");
  assert.equal(score(readData("fallen.json")), "fallen");
  assert.equal(score(readData("92974.json")), "fallen");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("deny-only.json")), "deny-only");
  assert.equal(classify(readData("accept-missing.json")), "accept-missing");
  assert.equal(classify(readData("checkbox-dead.json")), "checkbox-dead");
  assert.equal(classify(readData("mac-messages-perm.json")), "mac-messages-perm");
  assert.equal(classify(readData("win-computer-request.json")), "win-computer-request");
  assert.equal(classify(readData("auto-allow-ignored.json")), "auto-allow-ignored");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published guillotine walk scores fallen after the blade drops", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "fallen");
  assert.ok(night.fallenCount >= 1);
  const idle = night.rows.find((row) => row.event === "blade-raised");
  assert.equal(idle.acceptAvailable, true);
  assert.equal(idle.verdict, "raised");
  const deny = night.rows.find((row) => row.event === "deny-only");
  assert.equal(deny.verdict, "fallen");
  assert.equal(deny.acceptAvailable, false);
  const box = night.rows.find((row) => row.event === "checkbox-dead");
  assert.equal(box.checkboxClickable, false);
  const path = night.rows.find((row) => row.event === "scaffold");
  assert.equal(path.verdict, "scaffold");
});

test("GUILLOTINE_WALK constant matches the issue permission walk", () => {
  assert.equal(GUILLOTINE_WALK[0].event, "blade-raised");
  const mac = GUILLOTINE_WALK.find((row) => row.event === "mac-messages-perm");
  assert.equal(mac.permissionKind, "messages");
  assert.equal(mac.acceptAvailable, false);
  const win = GUILLOTINE_WALK.find((row) => row.event === "win-computer-request");
  assert.equal(win.permissionKind, "computer_request_access");
  const box = GUILLOTINE_WALK.find((row) => row.event === "checkbox-dead");
  assert.equal(box.checkboxClickable, false);
  assert.equal(box.checkboxChecked, false);
});

test("issue constants encode only #92974 published facts", () => {
  assert.equal(FEATURED_ISSUE, 92974);
  assert.ok(ISSUE_URL.includes("92974"));
  assert.match(TITLE, /background-mode permission dialog/);
  assert.match(TITLE, /only a Deny button/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:permissions"));
  assert.equal(REPORTER, "hommeboy");
  assert.equal(FILED_AT, "2026-09-09T02:33:12Z");
  assert.match(PRODUCT, /2\.1\.247/);
  assert.equal(VERSION, "2.1.247");
  assert.equal(PLATFORM, "macos");
  assert.equal(MODEL, "Sonnet (default)");
  assert.equal(REGRESSION, true);
  assert.equal(AUTO_ALLOW_ALREADY_SET, true);
  assert.equal(PRIOR_APPROVALS_ALREADY_SET, true);
  assert.equal(HANG_HOURS, 3);
  assert.equal(WINDOWS_COMMENTER, "dnhonjo-design");
  assert.equal(WINDOWS_COMMENT_AT, "2026-09-09T07:36:33Z");
  assert.equal(WINDOWS_SURFACE, "computer_request_access");
  assert.equal(MAC_SURFACE, "messages");
  assert.match(PHRASE, /blade has already fallen/);
  assert.ok(HOLD.includes("raised"));
  assert.ok(ALARM.includes("fallen"));
  assert.ok(ALARM.includes("scaffold"));
  assert.ok(CHIPS.includes("deny-only"));
  assert.ok(VERDICTS.includes("checkbox-dead"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "lodged",
    "bypassed",
    "cutaway",
    "sterling",
    "debased",
    "rubbed",
    "primed",
    "flashed",
    "flashpanned",
    "unshorn",
    "sheared",
    "secateured",
    "emended",
    "unretracted",
    "palinoded",
    "ephemeral",
    "voided",
    "fouled",
    "cold",
    "banked",
    "ferruled",
    "interlocked",
    "passable",
    "admitted",
    "deeded",
    "parked",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring Accept flips fallen to raised", () => {
  const tape = {
    acceptAvailable: true,
    denyAvailable: true,
    hangWaiting: false,
  };
  assert.equal(scoreGate(tape).verdict, "raised");
  tape.acceptAvailable = false;
  tape.acceptMissing = true;
  tape.hangWaiting = true;
  assert.equal(scoreGate(tape).verdict, "fallen");
  tape.acceptAvailable = true;
  tape.acceptMissing = false;
  tape.hangWaiting = false;
  assert.equal(scoreGate(tape).verdict, "raised");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [93048, 76718],
  );
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 93048);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const raised = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/raised.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const fallen = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/fallen.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(raised.status, 0, raised.stderr);
  assert.equal(fallen.status, 0, fallen.stderr);
  assert.equal(JSON.parse(raised.stdout).verdict, "raised");
  assert.equal(JSON.parse(fallen.stdout).verdict, "fallen");
});

test("handle exposes published hypothesis and #92974 headline", () => {
  const result = handle(readData("92974.json"));
  assert.equal(result.published.issue, 92974);
  assert.equal(result.published.macSurface, "messages");
  assert.equal(result.published.windowsSurface, "computer_request_access");
  assert.equal(result.published.version, "2.1.247");
  assert.equal(result.published.windowsCommenter, "dnhonjo-design");
  assert.deepEqual(result.published.cousins, [93048, 76718]);
  assert.match(result.published.hypothesis, /Deny-only card/);
  assert.match(
    fingerprint(seedFallen()),
    /fallen\|accept=missing\|deny=present/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a scaffold / guillotine booth, not entresol / hallmark / flashpan / secateurs", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Public Sans/);
  assert.match(page, /Cousine/);
  assert.match(page, /scaffold|guillotine|dark oak|steel uprights|crimson rope|pale chalk/i);
  assert.match(page, /#2a1c12/);
  assert.match(page, /#8b1e2d/);
  assert.match(page, /#efe8d8/);
  assert.match(page, /#6b7280/);
  assert.match(page, /raised/);
  assert.match(page, /fallen/);
  assert.match(page, /scaffold/);
  assert.match(page, /deny-only|Deny-only/i);
  assert.match(page, /score fallen or admit raised/i);
  assert.match(page, /drop-zone|dropzone|drop zone/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /19:50/);
  assert.match(page, /#246/);
  assert.match(page, /#92974/);
  assert.match(page, /computer_request_access/);
  assert.match(page, /Messages/);
  assert.match(page, /Claude wants to use Messages/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair Display|Outfit|Space Mono/);
  assert.doesNotMatch(page, /Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3/);
  assert.doesNotMatch(page, /Fraunces|Plus Jakarta/);
  assert.doesNotMatch(page, /EB Garamond|Barlow/);
  assert.doesNotMatch(page, /Bodoni Moda|Libre Caslon|Literata/);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Guillotine/);
  assert.match(readme, /#92974/);
  assert.match(readme, /raised/);
  assert.match(readme, /fallen/);
  assert.match(readme, /scaffold/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Public Sans/);
  assert.match(readme, /Cousine/);
  assert.match(readme, /Do NOT reuse Cinzel/);
  assert.match(readme, /Do NOT reuse Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/guillotine/);
  assert.match(readme, /node --test projects\/guillotine\/guillotine\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #246 features Guillotine; Entresol stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 246);
  assert.equal(catalog.products[0].name, "Guillotine");
  assert.equal(catalog.products[0].slug, "guillotine");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/guillotine/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  assert.match(catalog.products[0].summary, /19:50 guillotine/);
  const entresol = catalog.products.find((row) => row.slug === "entresol");
  assert.ok(entresol);
  assert.equal(entresol.featured, false);
  const hallmark = catalog.products.find((row) => row.slug === "hallmark");
  assert.ok(hallmark);
  assert.equal(hallmark.featured, false);
  const flashpan = catalog.products.find((row) => row.slug === "flashpan");
  assert.ok(flashpan);
  assert.equal(flashpan.featured, false);
  const secateurs = catalog.products.find((row) => row.slug === "secateurs");
  assert.ok(secateurs);
  assert.equal(secateurs.featured, false);
  const palinode = catalog.products.find((row) => row.slug === "palinode");
  assert.ok(palinode);
  assert.equal(palinode.featured, false);
  const ferrule = catalog.products.find((row) => row.slug === "ferrule");
  assert.ok(ferrule);
  assert.equal(ferrule.featured, false);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
