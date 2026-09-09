import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BUNDLED_CLI,
  CHIPS,
  CLI_ACTION,
  CLI_DEFAULT_CHORD,
  CLI_QUEUE_SINCE,
  COUSINS,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GREENROOM_WALK,
  HOLD,
  IDLE_WORD,
  INTERRUPT_COPY,
  ISSUE_URL,
  KEYBINDINGS,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PRIOR_BUILD,
  PRODUCT,
  QUEUE_LABEL,
  QUEUE_MESSAGE_ID,
  REPORTER,
  SEEDED_WORD,
  SEND_BUTTON_TRIO,
  STATE,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedCtrlEnterInterrupt,
  seedEnterMidturn,
  seedGreenroomed,
  seedHeld,
  seedSteered,
} from "./greenroom.mjs";

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
  return fileURLToPath(new URL("./greenroom.mjs", import.meta.url));
}

test("idle held is a hold; cue waits until the entire turn ends", () => {
  const result = analyze(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.idleWord, "held");
  assert.equal(IDLE_WORD, "held");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.held, true);
  assert.equal(result.phrase, "admit held");
  assert.equal(result.queueUntilTurnEnd, true);
  assert.equal(result.interruptOnCtrlEnter, false);
  assert.equal(result.midTurnInject, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify held", () => {
  assert.equal(classify(emptyTicket()), "held");
  assert.equal(classify(""), "held");
  assert.equal(classify(null), "held");
  assert.equal(decide({}), "held");
});

test("#92988 seeded path scores steered when Queue for later is unreachable", () => {
  const result = analyze(seedSteered());
  assert.equal(result.verdict, "steered");
  assert.equal(result.seededWord, "steered");
  assert.equal(SEEDED_WORD, "steered");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.steered, true);
  assert.equal(result.phrase, "score steered");
  assert.equal(result.queueUntilTurnEnd, false);
  assert.equal(result.interruptOnCtrlEnter, true);
  assert.equal(result.midTurnInject, true);
  assert.equal(result.queueForLaterUnreachable, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is greenroomed; named greenroomed seed holds the path", () => {
  assert.equal(PATH_WORD, "greenroomed");
  const result = analyze(seedGreenroomed());
  assert.equal(result.verdict, "greenroomed");
  assert.equal(result.pathWord, "greenroomed");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("greenroomed.json")), "greenroomed");
});

test("enter-midturn and Ctrl+Enter Interrupt fixtures", () => {
  const enter = analyze(seedEnterMidturn());
  assert.equal(enter.midTurnInject, true);
  assert.equal(enter.queueUntilTurnEnd, false);
  assert.equal(classify(readData("enter-midturn.json")), "enter-midturn");
  const interrupt = analyze(seedCtrlEnterInterrupt());
  assert.equal(interrupt.interruptOnCtrlEnter, true);
  assert.equal(classify(readData("ctrl-enter-interrupt.json")), "ctrl-enter-interrupt");
});

test("fixture toggle flips held vs steered", () => {
  const held = scoreGate(readData("held.json"));
  const steered = scoreGate(readData("steered.json"));
  assert.equal(held.verdict, "held");
  assert.equal(steered.verdict, "steered");
  assert.notEqual(held.verdict, steered.verdict);
  assert.equal(score(readData("held.json")), "held");
  assert.equal(score(readData("steered.json")), "steered");
  assert.equal(score(readData("92988.json")), "steered");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("enter-midturn.json")), "enter-midturn");
  assert.equal(classify(readData("ctrl-enter-interrupt.json")), "ctrl-enter-interrupt");
  assert.equal(classify(readData("queue-for-later-unreachable.json")), "queue-for-later-unreachable");
  assert.equal(classify(readData("chat-queueSubmit-cli-only.json")), "chat-queueSubmit-cli-only");
  assert.equal(classify(readData("send-button-trio.json")), "send-button-trio");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published greenroom walk scores steered after the cue is steered", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "steered");
  assert.ok(night.steeredCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-held");
  assert.equal(idle.queueUntilTurnEnd, true);
  assert.equal(idle.verdict, "held");
  const enter = night.rows.find((row) => row.event === "enter-midturn");
  assert.equal(enter.verdict, "steered");
  assert.equal(enter.midTurnInject, true);
  const interrupt = night.rows.find((row) => row.event === "ctrl-enter-interrupt");
  assert.equal(interrupt.interruptOnCtrlEnter, true);
  const path = night.rows.find((row) => row.event === "greenroomed");
  assert.equal(path.verdict, "greenroomed");
});

test("GREENROOM_WALK constant matches the issue queue walk", () => {
  assert.equal(GREENROOM_WALK[0].event, "cue-held");
  const enter = GREENROOM_WALK.find((row) => row.event === "enter-midturn");
  assert.equal(enter.midTurnInject, true);
  const interrupt = GREENROOM_WALK.find((row) => row.event === "ctrl-enter-interrupt");
  assert.equal(interrupt.interruptOnCtrlEnter, true);
  const later = GREENROOM_WALK.find((row) => row.event === "queue-for-later-unreachable");
  assert.equal(later.queueMessageId, "8RUKIaTN4d");
  const cli = GREENROOM_WALK.find((row) => row.event === "chat-queueSubmit-cli-only");
  assert.equal(cli.chatQueueSubmitCli, true);
  assert.equal(cli.desktopShortcutParity, false);
});

test("issue constants encode only #92988 published facts", () => {
  assert.equal(FEATURED_ISSUE, 92988);
  assert.ok(ISSUE_URL.includes("92988"));
  assert.match(TITLE, /queue a message until the turn fully ends/);
  assert.match(TITLE, /Ctrl\+Enter is Interrupt/);
  assert.match(TITLE, /chat:queueSubmit/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("enhancement"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(REPORTER, "ahnbu");
  assert.equal(FILED_AT, "2026-09-09T03:38:25Z");
  assert.match(PRODUCT, /1\.49585\.0/);
  assert.equal(VERSION, "1.49585.0");
  assert.equal(BUNDLED_CLI, "2.1.260");
  assert.equal(PLATFORM, "windows");
  assert.equal(KEYBINDINGS, "empty");
  assert.equal(QUEUE_MESSAGE_ID, "8RUKIaTN4d");
  assert.equal(QUEUE_LABEL, "Queue for later");
  assert.equal(CLI_ACTION, "chat:queueSubmit");
  assert.equal(CLI_QUEUE_SINCE, "2.1.247");
  assert.equal(CLI_DEFAULT_CHORD, "Ctrl+X Enter");
  assert.equal(PRIOR_BUILD, "1.46388.4");
  assert.match(INTERRUPT_COPY, /Interrupts the current step/);
  assert.equal(SEND_BUTTON_TRIO.length, 3);
  assert.equal(SEND_BUTTON_TRIO[1].key, "Ctrl+Enter");
  assert.match(PHRASE, /cue is steered on mid-scene/);
  assert.ok(HOLD.includes("held"));
  assert.ok(ALARM.includes("steered"));
  assert.ok(ALARM.includes("greenroomed"));
  assert.ok(CHIPS.includes("queue-for-later-unreachable"));
  assert.ok(VERDICTS.includes("enter-midturn"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "raised",
    "fallen",
    "scaffold",
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
    "ferruled",
    "interlocked",
    "passable",
    "admitted",
    "deeded",
    "parked",
    "shibbolethed",
    "countersigned",
    "homesteaded",
    "staked",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring queue-until-turn-end flips steered to held", () => {
  const tape = {
    queueUntilTurnEnd: true,
    interruptOnCtrlEnter: false,
    midTurnInject: false,
    queueForLaterVisible: true,
  };
  assert.equal(scoreGate(tape).verdict, "held");
  tape.queueUntilTurnEnd = false;
  tape.interruptOnCtrlEnter = true;
  tape.midTurnInject = true;
  tape.queueForLaterVisible = false;
  tape.cue = "steered";
  assert.equal(scoreGate(tape).verdict, "steered");
  tape.queueUntilTurnEnd = true;
  tape.interruptOnCtrlEnter = false;
  tape.midTurnInject = false;
  tape.queueForLaterVisible = true;
  tape.cue = "held";
  assert.equal(scoreGate(tape).verdict, "held");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [77724, 71726],
  );
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 77724);
  assert.equal(COUSINS[1].issue, 71726);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const held = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/held.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const steered = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/steered.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(held.status, 0, held.stderr);
  assert.equal(steered.status, 0, steered.stderr);
  assert.equal(JSON.parse(held.stdout).verdict, "held");
  assert.equal(JSON.parse(steered.stdout).verdict, "steered");
});

test("handle exposes published hypothesis and #92988 headline", () => {
  const result = handle(readData("92988.json"));
  assert.equal(result.published.issue, 92988);
  assert.equal(result.published.queueMessageId, "8RUKIaTN4d");
  assert.equal(result.published.cliAction, "chat:queueSubmit");
  assert.equal(result.published.version, "1.49585.0");
  assert.equal(result.published.bundledCli, "2.1.260");
  assert.equal(result.published.reporter, "ahnbu");
  assert.deepEqual(result.published.cousins, [77724, 71726]);
  assert.match(result.published.hypothesis, /sendSteeredNow/);
  assert.match(
    fingerprint(seedSteered()),
    /steered\|queue=mid-turn\|ctrl-enter=interrupt\|later=unreachable/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a theater green room, not guillotine / entresol / hallmark / flashpan / secateurs", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /DM Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /green room|greenroom|velvet|tungsten|call sheet|cue light/i);
  assert.match(page, /#0b1912/);
  assert.match(page, /#e8a84a/);
  assert.match(page, /#efe6c8/);
  assert.match(page, /#c4923a/);
  assert.match(page, /#c44532/);
  assert.match(page, /held/);
  assert.match(page, /steered/);
  assert.match(page, /greenroomed/);
  assert.match(page, /Queue for later/i);
  assert.match(page, /score steered or admit held/i);
  assert.match(page, /script-clip|cue-clip|pigeonhole/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /20:50/);
  assert.match(page, /#247/);
  assert.match(page, /#92988/);
  assert.match(page, /chat:queueSubmit/);
  assert.match(page, /8RUKIaTN4d/);
  assert.match(page, /Ctrl\+Enter/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair Display|Outfit|Space Mono/);
  assert.doesNotMatch(page, /Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /EB Garamond|Barlow/);
  assert.doesNotMatch(page, /Bodoni Moda|Libre Caslon|Literata/);
  assert.doesNotMatch(page, /drop-zone|dropzone|drop zone/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Greenroom/);
  assert.match(readme, /#92988/);
  assert.match(readme, /held/);
  assert.match(readme, /steered/);
  assert.match(readme, /greenroomed/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Do NOT reuse Spectral/);
  assert.match(readme, /Do NOT reuse Cinzel/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/greenroom/);
  assert.match(readme, /node --test projects\/greenroom\/greenroom\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #247 features Greenroom; Guillotine stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 247);
  assert.equal(catalog.products[0].name, "Greenroom");
  assert.equal(catalog.products[0].slug, "greenroom");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/greenroom/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  assert.match(catalog.products[0].summary, /20:50 greenroom/);
  const guillotine = catalog.products.find((row) => row.slug === "guillotine");
  assert.ok(guillotine);
  assert.equal(guillotine.featured, false);
  const entresol = catalog.products.find((row) => row.slug === "entresol");
  assert.ok(entresol);
  assert.equal(entresol.featured, false);
  const hallmark = catalog.products.find((row) => row.slug === "hallmark");
  assert.ok(hallmark);
  assert.equal(hallmark.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites greenroom to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/greenroom");
  assert.equal(vercel.rewrites[0].destination, "/projects/greenroom");
  assert.equal(vercel.rewrites[1].source, "/greenroom/");
  assert.equal(vercel.rewrites[1].destination, "/projects/greenroom");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
