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
  CHROME_VERSION,
  CLAUDE_CODE_VERSION,
  COUSINS,
  EXTENSION_VERSION,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GRANTED_HOST,
  HOLD,
  IDLE_WORD,
  INJECTION_PATHS,
  ISSUE_URL,
  LABELS,
  NAMED_DENY,
  NOT_PRODUCTS,
  OS,
  PAGE_TEXT_ERROR,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  READY_STATE,
  REPRO_TABLE,
  SCAPEGOAT_WALK,
  SCREENSHOT_TIMEOUT_MS,
  SEEDED_WORD,
  ALTAR_STATIONS,
  STATE,
  TEXT_TIMEOUT_MS,
  TITLE,
  UNGRANTED_HOST,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBlame,
  inspectGrant,
  inspectInjection,
  readAltar,
  score,
  scoreGate,
  scoreWalk,
  seedBatchBudget,
  seedDocumentIdle,
  seedExecuteScript,
  seedGrantCheck,
  seedHmacGrantLoss,
  seedHold,
  seedHonest,
  seedJavascriptOk,
  seedNamedDeny,
  seedPageBlame,
  seedScapegoat,
  seedScapegoated,
  seedUngranted,
} from "./scapegoat.mjs";

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
  return fileURLToPath(new URL("./scapegoat.mjs", import.meta.url));
}

test("idle honest is a hold; grant checked before document_idle", () => {
  const result = analyze(seedHonest());
  assert.equal(result.verdict, "honest");
  assert.equal(result.idleWord, "honest");
  assert.equal(IDLE_WORD, "honest");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.honest, true);
  assert.equal(result.phrase, "admit honest");
  assert.equal(result.grantCheck, true);
  assert.equal(result.namedDeny, true);
  assert.equal(result.hostNamed, true);
  assert.equal(result.siteAccessUi, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify honest", () => {
  assert.equal(classify(emptyTicket()), "honest");
  assert.equal(classify(""), "honest");
  assert.equal(classify(null), "honest");
  assert.equal(decide({}), "honest");
});

test("#93348 seeded path scores scapegoated when executeScript hangs and blames the page", () => {
  const result = analyze(seedScapegoated());
  assert.equal(result.verdict, "scapegoated");
  assert.equal(result.seededWord, "scapegoated");
  assert.equal(SEEDED_WORD, "scapegoated");
  assert.equal(PRODUCT_WORD, "scapegoat");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scapegoated, true);
  assert.equal(result.phrase, "score scapegoat");
  assert.equal(result.ungranted, true);
  assert.equal(result.executeScriptHang, true);
  assert.equal(result.documentIdleWait, true);
  assert.equal(result.pageBlame, true);
  assert.equal(result.javascriptOk, true);
  assert.equal(result.textTimeoutMs, 45000);
  assert.equal(result.screenshotTimeoutMs, 5000);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("ungranted host plus executeScript hang is the #93348 scapegoat", () => {
  const grant = inspectGrant({
    host: "example.com",
    ungranted: true,
    granted: false,
  });
  assert.equal(grant.stamp, "scapegoated");
  assert.equal(grant.ungranted, true);
  const scored = scoreGate({
    scapegoated: true,
    ungranted: true,
    executeScriptHang: true,
    documentIdleWait: true,
    pageBlame: true,
    javascriptOk: true,
    readyComplete: true,
    cue: "scapegoated",
  });
  assert.equal(scored.verdict, "scapegoated");
  assert.equal(scored.executeScriptHang, true);
  const calm = inspectGrant({
    granted: true,
    grantCheck: true,
    host: "www.google.com",
  });
  assert.equal(calm.stamp, "honest");
});

test("path word is ungranted; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "ungranted");
  const result = analyze(seedUngranted());
  assert.equal(result.verdict, "ungranted");
  assert.equal(result.pathWord, "ungranted");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "ungranted", preferSeed: true, scapegoated: true }),
    "ungranted",
  );
  assert.equal(classify(seedExecuteScript()), "execute-script");
});

test("HOLD includes honest / hold", () => {
  assert.ok(HOLD.includes("honest"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: execute-script, document-idle, page-blame, named-deny, js, batch, hmac", () => {
  assert.equal(classify(seedExecuteScript()), "execute-script");
  assert.equal(classify(seedDocumentIdle()), "document-idle");
  assert.equal(classify(seedPageBlame()), "page-blame");
  assert.equal(classify(seedGrantCheck()), "grant-check");
  assert.equal(classify(seedNamedDeny()), "named-deny");
  assert.equal(classify(seedJavascriptOk()), "javascript-ok");
  assert.equal(classify(seedBatchBudget()), "batch-budget");
  assert.equal(classify(seedHmacGrantLoss()), "hmac-grant-loss");
  assert.equal(classify(seedScapegoat()), "scapegoat");
});

test("grant/deny matrix fixtures flip honest vs scapegoated vs ungranted", () => {
  const idle = scoreGate(seedHonest());
  const seeded = scoreGate(readData("scapegoat.json"));
  const granted = readData("granted.json");
  const ungranted = readData("ungranted.json");
  const paths = readData("paths.json");
  assert.equal(idle.verdict, "honest");
  assert.equal(seeded.verdict, "scapegoated");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedHonest()), "honest");
  assert.equal(score(readData("scapegoat.json")), "scapegoated");
  assert.equal(granted.host, "www.google.com");
  assert.equal(granted.granted, true);
  assert.equal(granted.getPageTextOk, true);
  assert.equal(granted.screenshotOk, true);
  assert.equal(scoreGate(granted).verdict, "honest");
  assert.equal(ungranted.host, "example.com");
  assert.equal(ungranted.ungranted, true);
  assert.equal(ungranted.textTimeoutMs, 45000);
  assert.equal(ungranted.screenshotTimeoutMs, 5000);
  assert.equal(classify(ungranted), "ungranted");
  assert.equal(paths.paths.length, 3);
  assert.equal(paths.paths[0].onUngranted, "succeeds");
  assert.equal(paths.paths[1].onUngranted, "hangs to timeout");
  assert.equal(paths.paths[2].onUngranted, "denies immediately, by name");
  assert.equal(paths.batchError, "browser_batch did not respond in time");
  const fixture = readData("scapegoat.json");
  assert.equal(fixture.executeScriptHang, true);
  assert.equal(fixture.pageBlame, true);
  assert.equal(fixture.javascriptOk, true);
  assert.equal(fixture.issue, 93348);
  assert.match(fixture.pageTextError, /45000ms/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("honest"));
  assert.ok(CHIPS.includes("scapegoated"));
  assert.ok(CHIPS.includes("scapegoat"));
  assert.ok(CHIPS.includes("ungranted"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("scapegoated"));
  assert.ok(ALARM.includes("ungranted"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published scapegoat walk scores scapegoated after the idle hold", () => {
  const desk = scoreWalk({ rows: SCAPEGOAT_WALK });
  assert.equal(desk.verdict, "scapegoated");
  assert.ok(desk.scapegoatedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-honest");
  assert.equal(idle.honest, true);
  assert.equal(idle.verdict, "honest");
  const js = desk.rows.find((row) => row.event === "javascript-ok");
  assert.equal(js.javascriptOk, true);
  const inject = desk.rows.find((row) => row.event === "execute-script");
  assert.equal(inject.executeScriptHang, true);
  const idleWait = desk.rows.find((row) => row.event === "document-idle");
  assert.equal(idleWait.documentIdleWait, true);
  const blame = desk.rows.find((row) => row.event === "page-blame");
  assert.equal(blame.pageBlame, true);
  const shot = desk.rows.find((row) => row.event === "screenshot-timeout");
  assert.equal(shot.screenshotTimeout, true);
  const back = desk.rows.find((row) => row.event === "navigate-back");
  assert.equal(back.ungranted, true);
  const deny = desk.rows.find((row) => row.event === "named-deny");
  assert.equal(deny.namedDeny, true);
  const batch = desk.rows.find((row) => row.event === "batch-budget");
  assert.equal(batch.batchBudget, true);
  const hmac = desk.rows.find((row) => row.event === "hmac-grant-loss");
  assert.equal(hmac.hmacGrantLoss, true);
  const cut = desk.rows.find((row) => row.event === "scapegoated");
  assert.equal(cut.scapegoated, true);
  const path = desk.rows.find((row) => row.event === "ungranted");
  assert.equal(path.verdict, "ungranted");
});

test("SCAPEGOAT_WALK constant matches the issue altar walk", () => {
  assert.equal(SCAPEGOAT_WALK[0].event, "cue-honest");
  const blame = SCAPEGOAT_WALK.find((row) => row.event === "page-blame");
  assert.equal(blame.pageBlame, true);
  const cut = SCAPEGOAT_WALK.find((row) => row.event === "scapegoated");
  assert.equal(cut.javascriptOk, true);
  assert.equal(cut.executeScriptHang, true);
  const path = SCAPEGOAT_WALK.find((row) => row.event === "ungranted");
  assert.equal(path.scapegoated, true);
  const scoreRow = SCAPEGOAT_WALK.find((row) => row.event === "scapegoat");
  assert.equal(scoreRow.scapegoated, true);
});

test("issue constants encode only #93348 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93348);
  assert.ok(ISSUE_URL.includes("93348"));
  assert.match(TITLE, /UNGRANTED host/);
  assert.match(TITLE, /executeScript/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:browser-extension"));
  assert.ok(LABELS.includes("area:chrome"));
  assert.equal(AUTHOR, "frankacano-dev");
  assert.equal(FILED, "2026-09-10T12:54:24Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.267");
  assert.equal(EXTENSION_VERSION, "1.0.91");
  assert.equal(CHROME_VERSION, "152.0.7977.83");
  assert.match(OS, /macOS 26\.6\.2/);
  assert.equal(GRANTED_HOST, "www.google.com");
  assert.equal(UNGRANTED_HOST, "example.com");
  assert.equal(TEXT_TIMEOUT_MS, 45000);
  assert.equal(SCREENSHOT_TIMEOUT_MS, 5000);
  assert.equal(READY_STATE, "complete");
  assert.match(PAGE_TEXT_ERROR, /45000ms/);
  assert.equal(NAMED_DENY, "Permission denied for this action on this domain");
  assert.equal(REPRO_TABLE.length, 2);
  assert.equal(REPRO_TABLE[0].granted, true);
  assert.equal(REPRO_TABLE[1].getPageText, "45000ms timeout");
  assert.equal(INJECTION_PATHS.length, 3);
  assert.equal(ALTAR_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("execute-script"));
  assert.ok(FINGERPRINT_LINES.includes("page-blame"));
  assert.ok(FINGERPRINT_LINES.includes("named-deny"));
  assert.match(PHRASE, /score scapegoat or admit honest/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "bound",
    "accreted",
    "session-url",
    "cartulary",
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
    "pontoon",
    "concordant",
    "concordat",
    "reaped",
    "revenant",
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
    "scaffold",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("honest altar flips scapegoated back when grant is checked first", () => {
  const tape = {
    honest: true,
    grantCheck: true,
    namedDeny: true,
    hostNamed: true,
    siteAccessUi: true,
    scapegoated: false,
    cue: "honest",
  };
  assert.equal(scoreGate(tape).verdict, "honest");
  tape.honest = false;
  tape.scapegoated = true;
  tape.ungranted = true;
  tape.executeScriptHang = true;
  tape.cue = "scapegoated";
  assert.equal(scoreGate(tape).verdict, "scapegoated");
  tape.honest = true;
  tape.scapegoated = false;
  tape.ungranted = false;
  tape.executeScriptHang = false;
  tape.grantCheck = true;
  tape.namedDeny = true;
  tape.hostNamed = true;
  tape.siteAccessUi = true;
  tape.cue = "honest";
  assert.equal(scoreGate(tape).verdict, "honest");
});

test("grant, injection, blame, and altar mark scapegoat after page-blame", () => {
  const idle = inspectGrant({ granted: true, grantCheck: true });
  assert.equal(idle.stamp, "honest");
  assert.equal(idle.ungranted, false);
  const cut = inspectGrant({
    ungranted: true,
    host: "example.com",
    granted: false,
  });
  assert.equal(cut.stamp, "scapegoated");
  const live = inspectInjection({ namedDeny: true });
  assert.equal(live.stamp, "honest");
  const reject = inspectInjection({
    executeScriptHang: true,
    documentIdleWait: true,
    textTimeoutMs: 45000,
  });
  assert.equal(reject.stamp, "scapegoated");
  assert.equal(reject.executeScriptHang, true);
  const blame = inspectBlame({
    pageBlame: true,
    readyComplete: true,
    readyState: "complete",
    pageStillLoading: true,
  });
  assert.equal(blame.stamp, "scapegoated");
  const desk = readAltar({
    scapegoated: true,
    ungranted: true,
    executeScriptHang: true,
  });
  assert.equal(desk.scapegoated, true);
  assert.equal(desk.cue, "scapegoated");
  const calm = readAltar({
    honest: true,
    grantCheck: true,
    scapegoated: false,
  });
  assert.equal(calm.scapegoated, false);
  assert.equal(calm.cue, "honest");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 92370);
  assert.equal(COUSINS[1].issue, 50842);
  assert.equal(COUSINS[5].issue, 85999);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
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
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93345);
  assert.equal(BACKUPS[1].issue, 93279);
  assert.equal(BACKUPS[5].issue, 93280);
  assert.equal(BACKUPS[7].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scapegoat.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "honest");
  assert.equal(JSON.parse(seeded.stdout).verdict, "scapegoated");
});

test("handle exposes published hypothesis and #93348 headline", () => {
  const result = handle(readData("scapegoat.json"));
  assert.equal(result.published.issue, 93348);
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "frankacano-dev");
  assert.equal(result.published.extensionVersion, "1.0.91");
  assert.equal(result.published.chromeVersion, "152.0.7977.83");
  assert.equal(result.published.ungrantedHost, "example.com");
  assert.equal(result.published.textTimeoutMs, 45000);
  assert.deepEqual(result.published.cousins, [92370, 50842, 66074, 71813, 74696, 85999]);
  assert.ok(result.published.backups.includes(93345));
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /executeScript path does not consult host grant/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedScapegoated()),
    /scapegoated\|host=ungranted\|inject=hang\|blame=page\|js=ok\|cue=scapegoated/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a desert scapegoat altar, not an oak cartulary desk", () => {
  const page = readPage();
  assert.match(page, /Libre Bodoni/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /scapegoat|ash altar|goat-bell|bone linen|grant-table|rust-blood/i);
  assert.match(page, /#2a241c|#c4a35a|#e8e0d0|#8b3a2a|#1a1410/);
  assert.match(page, /honest/);
  assert.match(page, /scapegoated/);
  assert.match(page, /ungranted/);
  assert.match(page, /score scapegoat or admit honest/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /23:50/);
  assert.match(page, /#272/);
  assert.match(page, /#93348/);
  assert.match(page, /frankacano-dev/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /45000|45 000/);
  assert.match(page, /example\.com/);
  assert.match(page, /Ring the goat-bell/);
  assert.match(page, /Score scapegoat/);
  assert.match(page, /Walk the altar/);
  assert.match(page, /Inspect the grant/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Karla/);
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
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#0f0d0b/);
  assert.doesNotMatch(page, /#4a3420/);
  assert.doesNotMatch(page, /#5c3d22/);
  assert.doesNotMatch(page, /#e8dcc4/);
  assert.doesNotMatch(page, /#4a6b5a/);
  assert.doesNotMatch(page, /#c4923a/);
  assert.doesNotMatch(page, /#101318/);
  assert.doesNotMatch(page, /#dcc9a3/);
  assert.doesNotMatch(page, /#8e1a2a/);
  assert.doesNotMatch(page, /oak lectern|bound quires|inkhorn|register index/i);
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
  assert.doesNotMatch(page, /\bcartulary\b/);
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
  assert.doesNotMatch(page, /\bbound\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Cartulary/i);
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
  assert.match(readme, /Scapegoat/);
  assert.match(readme, /#93348/);
  assert.match(readme, /honest/);
  assert.match(readme, /scapegoated/);
  assert.match(readme, /ungranted/);
  assert.match(readme, /Libre Bodoni/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Cartulary/i);
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
  assert.match(readme, /hermes-playground-green\.vercel\.app\/scapegoat/);
  assert.match(readme, /node --test projects\/scapegoat\/scapegoat\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /executeScript path does not consult host grant/);
  assert.match(readme, /#93345/);
  assert.match(readme, /#92370/);
  assert.match(readme, /#50842/);
  assert.match(readme, /#85999/);
  assert.match(readme, /#93280/);
});

test("catalog #272 features Scapegoat only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 272);
  assert.equal(catalog.products[0].name, "Scapegoat");
  assert.equal(catalog.products[0].slug, "scapegoat");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/scapegoat/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /23:50/);
  assert.match(catalog.products[0].summary, /scapegoat/);
  assert.match(catalog.products[0].summary, /#93348/);
  assert.match(catalog.products[0].summary, /honest/);
  assert.match(catalog.products[0].summary, /scapegoated/);
  assert.match(catalog.products[0].summary, /ungranted/);
  const cartulary = catalog.products.find((row) => row.slug === "cartulary");
  assert.ok(cartulary);
  assert.equal(cartulary.featured, false);
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
  assert.equal(catalog.products.filter((row) => row.slug === "scapegoat").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93348") && row.slug !== "scapegoat"));
});

test("vercel rewrites scapegoat to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/scapegoat");
  assert.equal(vercel.rewrites[0].destination, "/projects/scapegoat");
  assert.equal(vercel.rewrites[1].source, "/scapegoat/");
  assert.equal(vercel.rewrites[1].destination, "/projects/scapegoat");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
