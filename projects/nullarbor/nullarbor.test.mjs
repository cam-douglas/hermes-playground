import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  COUSINS,
  DISTRIBUTION,
  FAILED_VERSION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEADER_EMPTY,
  HEADER_TEMPLATE,
  HOLD,
  HTTP_EMPTY,
  HTTP_EXPANDED,
  HTTP_LITERAL,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_WORKING,
  MCP_TYPE,
  NOT_PRODUCTS,
  NULLARBOR_WALK,
  OS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REGRESSION_BRACKET,
  SAMPLE_BISECT,
  SAMPLE_HEADER,
  SAMPLE_HORIZON,
  SAMPLE_POSTS,
  SAMPLE_TICKET,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  PLAIN_STATIONS,
  VERDICTS,
  WORKING_VERSIONS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBisect,
  inspectBundle,
  inspectHeader,
  inspectHorizon,
  inspectTicket,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBearerEmpty,
  seedBisect260,
  seedByteIdentical,
  seedConnected,
  seedDesktopBundle,
  seedEmptied,
  seedEmptyExpand,
  seedFalseTokenCheck,
  seedHold,
  seedHttp200,
  seedHttp401,
  seedHttp403,
  seedLastWorking247,
  seedNoCompetingMcp,
  seedNotLiteral,
  seedNotTrailingBrace,
  seedNpmGlobal,
  seedNullarbor,
  seedOauthDisabled,
  seedPlainShell,
  seedPluginHttp,
  seedProcessEnv,
  seedRegression248260,
  seedStamped,
  seedTokenPresent,
  seedVarHeader,
} from "./nullarbor.mjs";

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
  return fileURLToPath(new URL("./nullarbor.mjs", import.meta.url));
}

test("idle stamped is a hold; ${VAR} expands; Bearer present; Connected; POST 200", () => {
  const result = analyze(seedStamped());
  assert.equal(result.verdict, "stamped");
  assert.equal(result.idleWord, "stamped");
  assert.equal(IDLE_WORD, "stamped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stamped, true);
  assert.equal(result.phrase, "admit stamped");
  assert.equal(result.emptied, false);
  assert.equal(result.emptyExpand, false);
  assert.equal(result.tokenPresent, true);
  assert.equal(result.connected, true);
  assert.equal(result.http200, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify stamped", () => {
  assert.equal(classify(emptyTicket()), "stamped");
  assert.equal(classify(""), "stamped");
  assert.equal(classify(null), "stamped");
  assert.equal(decide({}), "stamped");
});

test("#93595 seeded path scores emptied when 2.1.260 expands ${VAR} to empty", () => {
  const result = analyze(seedEmptied());
  assert.equal(result.verdict, "emptied");
  assert.equal(result.seededWord, "emptied");
  assert.equal(SEEDED_WORD, "emptied");
  assert.equal(PRODUCT_WORD, "nullarbor");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.emptied, true);
  assert.equal(result.phrase, "score nullarbor");
  assert.equal(result.bearerEmpty, true);
  assert.equal(result.http401, true);
  assert.equal(result.bisect260, true);
  assert.equal(result.emptyExpand, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("bearer empty plus HTTP 401 is the #93595 nullarbor", () => {
  const ticket = inspectTicket({ emptied: true, bearerEmpty: true });
  assert.equal(ticket.stamp, "emptied");
  assert.equal(ticket.bearerPresent, false);
  const scored = scoreGate({
    emptied: true,
    bearerEmpty: true,
    http401: true,
    emptyExpand: true,
    cue: "emptied",
    horizon: SAMPLE_HORIZON,
    ticket: SAMPLE_TICKET,
  });
  assert.equal(scored.verdict, "emptied");
  assert.equal(scored.emptyExpand, true);
  const calm = inspectTicket({ stamped: true, tokenPresent: true });
  assert.equal(calm.stamp, "stamped");
});

test("path word is empty-expand; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "empty-expand");
  const result = analyze(seedEmptyExpand());
  assert.equal(result.verdict, "empty-expand");
  assert.equal(result.pathWord, "empty-expand");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "empty-expand", preferSeed: true, emptied: true }),
    "empty-expand",
  );
  assert.equal(classify(seedHttp401()), "http-401");
});

test("HOLD includes stamped / hold", () => {
  assert.ok(HOLD.includes("stamped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: http-401, bearer-empty, bisect-260, desktop-bundle, plain-shell", () => {
  assert.equal(classify(seedTokenPresent()), "token-present");
  assert.equal(classify(seedConnected()), "connected");
  assert.equal(classify(seedHttp200()), "http-200");
  assert.equal(classify(seedHttp401()), "http-401");
  assert.equal(classify(seedHttp403()), "http-403");
  assert.equal(classify(seedBearerEmpty()), "bearer-empty");
  assert.equal(classify(seedNotLiteral()), "not-literal");
  assert.equal(classify(seedNotTrailingBrace()), "not-trailing-brace");
  assert.equal(classify(seedPluginHttp()), "plugin-http");
  assert.equal(classify(seedVarHeader()), "var-header");
  assert.equal(classify(seedProcessEnv()), "process-env");
  assert.equal(classify(seedDesktopBundle()), "desktop-bundle");
  assert.equal(classify(seedNpmGlobal()), "npm-global");
  assert.equal(classify(seedPlainShell()), "plain-shell");
  assert.equal(classify(seedBisect260()), "bisect-260");
  assert.equal(classify(seedLastWorking247()), "last-working-247");
  assert.equal(classify(seedRegression248260()), "regression-248-260");
  assert.equal(classify(seedFalseTokenCheck()), "false-token-check");
  assert.equal(classify(seedOauthDisabled()), "oauth-disabled");
  assert.equal(classify(seedByteIdentical()), "byte-identical");
  assert.equal(classify(seedNoCompetingMcp()), "no-competing-mcp");
  assert.equal(classify(seedNullarbor()), "nullarbor");
});

test("booth fixtures flip stamped vs emptied vs empty-expand vs nullarbor", () => {
  const idle = scoreGate(seedStamped());
  const seeded = scoreGate(readData("emptied.json"));
  const stamped = readData("stamped.json");
  const emptied = readData("emptied.json");
  const path = readData("empty-expand.json");
  const product = readData("nullarbor.json");
  const empty = readData("http-401.json");
  const literal = readData("http-403.json");
  const expanded = readData("http-200.json");
  const bearer = readData("bearer-empty.json");
  const bisect = readData("bisect-260.json");
  const last = readData("last-working-247.json");
  const desktop = readData("desktop-bundle.json");
  const npm = readData("npm-global.json");
  const shell = readData("plain-shell.json");
  const env = readData("process-env.json");
  assert.equal(idle.verdict, "stamped");
  assert.equal(seeded.verdict, "emptied");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedStamped()), "stamped");
  assert.equal(score(readData("emptied.json")), "emptied");
  assert.equal(stamped.tokenPresent, true);
  assert.equal(stamped.stamped, true);
  assert.equal(scoreGate(stamped).verdict, "stamped");
  assert.equal(emptied.bearerEmpty, true);
  assert.equal(emptied.http401, true);
  assert.equal(emptied.bisect260, true);
  assert.equal(classify(emptied), "emptied");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /\$\{VAR\}/);
  assert.match(path.paths[1].result, /401/);
  assert.equal(classify(path), "empty-expand");
  assert.equal(classify(product), "nullarbor");
  assert.equal(product.hubCount, "NULLARBOR");
  assert.equal(emptied.issue, 93595);
  assert.equal(emptied.emptied, true);
  assert.equal(classify(empty), "http-401");
  assert.equal(classify(literal), "http-403");
  assert.equal(classify(expanded), "http-200");
  assert.equal(classify(bearer), "bearer-empty");
  assert.equal(classify(bisect), "bisect-260");
  assert.equal(classify(last), "last-working-247");
  assert.equal(classify(desktop), "desktop-bundle");
  assert.equal(classify(npm), "npm-global");
  assert.equal(classify(shell), "plain-shell");
  assert.equal(classify(env), "process-env");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("stamped"));
  assert.ok(CHIPS.includes("emptied"));
  assert.ok(CHIPS.includes("nullarbor"));
  assert.ok(CHIPS.includes("empty-expand"));
  assert.ok(CHIPS.includes("http-401"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("emptied"));
  assert.ok(ALARM.includes("empty-expand"));
  assert.ok(ALARM.includes("http-401"));
  assert.ok(ALARM.includes("nullarbor"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published nullarbor walk scores emptied after the idle hold", () => {
  const plain = scoreWalk({ rows: NULLARBOR_WALK });
  assert.equal(plain.verdict, "emptied");
  assert.ok(plain.emptiedCount >= 1);
  const idle = plain.rows.find((row) => row.event === "cue-stamped");
  assert.equal(idle.stamped, true);
  assert.equal(idle.verdict, "stamped");
  const fail = plain.rows.find((row) => row.event === "bisect-260");
  assert.equal(fail.http401, true);
  const path = plain.rows.find((row) => row.event === "empty-expand");
  assert.equal(path.verdict, "empty-expand");
});

test("NULLARBOR_WALK constant matches the issue empty-plain walk", () => {
  assert.equal(NULLARBOR_WALK[0].event, "cue-stamped");
  const fail = NULLARBOR_WALK.find((row) => row.event === "bisect-260");
  assert.equal(fail.http401, true);
  const path = NULLARBOR_WALK.find((row) => row.event === "empty-expand");
  assert.equal(path.emptied, true);
  const scoreRow = NULLARBOR_WALK.find((row) => row.event === "nullarbor");
  assert.equal(scoreRow.emptied, true);
});

test("positive control expanded POST 200 stays stamped", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "stamped");
  const ok = walk.rows.find((row) => row.event === "http-200");
  assert.equal(ok.verdict, "stamped");
  const hold = walk.rows.find((row) => row.event === "cue-stamped");
  assert.equal(hold.connected, true);
  assert.equal(hold.verdict, "stamped");
});

test("issue constants encode only #93595 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93595);
  assert.ok(ISSUE_URL.includes("93595"));
  assert.match(TITLE, /\$\{VAR\}/);
  assert.match(TITLE, /2\.1\.260/);
  assert.match(TITLE, /2\.1\.247/);
  assert.match(TITLE, /bearer token never sent/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("area:plugins"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.260");
  assert.equal(FAILED_VERSION, "2.1.260");
  assert.equal(LAST_WORKING, "2.1.247");
  assert.equal(REGRESSION_BRACKET, "2.1.248–2.1.260");
  assert.deepEqual([...WORKING_VERSIONS], ["2.1.223", "2.1.247"]);
  assert.equal(OS, "Windows 11 Pro 10.0.26200");
  assert.equal(MCP_TYPE, "http");
  assert.equal(HEADER_TEMPLATE, "Bearer ${SONAR_TOKEN}");
  assert.equal(HEADER_EMPTY, "Bearer ");
  assert.equal(HTTP_EXPANDED, 200);
  assert.equal(HTTP_LITERAL, 403);
  assert.equal(HTTP_EMPTY, 401);
  assert.match(DISTRIBUTION, /2\.1\.260/);
  assert.match(SESSION_KIND, /2\.1\.260/);
  assert.equal(PLAIN_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("empty-expand"));
  assert.ok(FINGERPRINT_LINES.includes("emptied"));
  assert.match(PHRASE, /Score nullarbor or admit stamped/);
  assert.equal(SAMPLE_TICKET.emptied, true);
  assert.equal(SAMPLE_HEADER.empty, true);
  assert.equal(SAMPLE_HORIZON.match, "empty");
  assert.equal(SAMPLE_POSTS.length, 3);
  assert.equal(SAMPLE_POSTS[0].http, 200);
  assert.equal(SAMPLE_POSTS[1].http, 403);
  assert.equal(SAMPLE_POSTS[2].http, 401);
  assert.equal(SAMPLE_BISECT[2].version, "2.1.260");
  assert.equal(SAMPLE_BISECT[2].http, 401);
});

test("has-repro fingerprints encode the published empty expand", () => {
  const result = handle(readData("emptied.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.match(result.published.sessionKind, /HTTP 401/);
  assert.equal(result.published.httpEmpty, 401);
  assert.match(
    fingerprint(seedEmptied()),
    /emptied\|ticket=emptied\|horizon=401\|header=empty\|bisect=failed-260\|bundle=desktop-260\|path=empty-expand\|cue=empty-expand/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Petard and Aposiopesis", () => {
  const required = [
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("stamped plain flips emptied back when the bearer holds", () => {
  const tape = {
    stamped: true,
    emptied: false,
    tokenPresent: true,
    connected: true,
    http200: true,
    cue: "stamped",
  };
  assert.equal(scoreGate(tape).verdict, "stamped");
  tape.stamped = false;
  tape.emptied = true;
  tape.bearerEmpty = true;
  tape.http401 = true;
  tape.cue = "emptied";
  assert.equal(scoreGate(tape).verdict, "emptied");
  tape.stamped = true;
  tape.emptied = false;
  tape.bearerEmpty = false;
  tape.http401 = false;
  tape.cue = "stamped";
  assert.equal(scoreGate(tape).verdict, "stamped");
});

test("ticket, horizon, header, bisect, bundle, and readBooth mark the empty expand", () => {
  const idle = inspectTicket({ stamped: true, tokenPresent: true, ticket: { stamped: true, emptied: false, bearerPresent: true, impression: "brass" } });
  assert.equal(idle.stamp, "stamped");
  const horizon = inspectHorizon({ emptied: true, horizon: SAMPLE_HORIZON });
  assert.equal(horizon.stamp, "empty");
  assert.equal(horizon.match, "empty");
  const header = inspectHeader({ bearerEmpty: true, header: SAMPLE_HEADER });
  assert.equal(header.stamp, "empty");
  const bisect = inspectBisect({ emptied: true, bisect260: true, bisect: SAMPLE_BISECT });
  assert.equal(bisect.stamp, "failed-260");
  assert.equal(bisect.failed, true);
  const bundle = inspectBundle({ emptied: true, desktopBundle: true });
  assert.equal(bundle.stamp, "bundled-260");
  const booth = readBooth({
    emptied: true,
    bearerEmpty: true,
    http401: true,
    emptyExpand: true,
    ticket: SAMPLE_TICKET,
    horizon: SAMPLE_HORIZON,
  });
  assert.equal(booth.emptied, true);
  assert.equal(booth.mark, "emptied");
  const calm = readBooth({
    stamped: true,
    emptied: false,
    tokenPresent: true,
    connected: true,
    http200: true,
  });
  assert.equal(calm.emptied, false);
  assert.equal(calm.mark, "stamped");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 84367);
  assert.equal(COUSINS[1].issue, 84314);
  assert.equal(COUSINS[2].issue, 90074);
  assert.equal(COUSINS[3].issue, 91307);
  assert.equal(COUSINS[4].issue, 90677);
  assert.equal(COUSINS[5].issue, 90050);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /400/);
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("aposiopesis"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("counterfoil"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("cipherlock"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93585);
  assert.equal(BACKUPS[1].issue, 93570);
  assert.equal(BACKUPS[2].issue, 93589);
  assert.equal(BACKUPS[3].issue, 93618);
  assert.equal(BACKUPS[4].issue, 93615);
  assert.equal(BACKUPS[5].issue, 93622);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/emptied.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "stamped");
  assert.equal(JSON.parse(seeded.stdout).verdict, "emptied");
});

test("handle exposes published hypothesis and #93595 headline", () => {
  const result = handle(readData("emptied.json"));
  assert.equal(result.published.issue, 93595);
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.deepEqual(result.published.cousins, [84367, 84314, 90074, 91307, 90677, 90050]);
  assert.ok(result.published.backups.includes(93585));
  assert.ok(result.published.backups.includes(93570));
  assert.ok(result.published.backups.includes(93622));
  assert.match(result.published.hypothesis, /2\.1\.260/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /\$\{VAR\}/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Nullarbor Plain booth, not siege petard or speech-break", () => {
  const page = readPage();
  assert.match(page, /Teko/);
  assert.match(page, /Hind/);
  assert.match(page, /Fira Mono|Fira\+Mono/);
  assert.match(page, /nullarbor|saltbush|ticket booth|horizon|Eyre|brass stamp/i);
  assert.match(page, /#1A1F18|#C4A574|#E8E4D9|#2C3E50|#B33A3A|#3D7A6A|#B89A3A/i);
  assert.match(page, /\bstamped\b/);
  assert.match(page, /emptied/);
  assert.match(page, /empty-expand/);
  assert.match(page, /Score nullarbor or admit stamped/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /22:50/);
  assert.match(page, /#294/);
  assert.match(page, /#93595/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /Bearer/);
  assert.match(page, /Stamp the ticket/);
  assert.match(page, /Score nullarbor/);
  assert.match(page, /Empty the plain/);
  assert.match(page, /Compare stamped \/ emptied/);
  assert.match(page, /Pin idle stamped/);
  assert.match(page, /Pin seeded emptied/);
  assert.match(page, /Pin empty-expand/);
  assert.match(page, /Hold the bearer/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Crimson Pro/);
  assert.doesNotMatch(page, /Red Hat/);
  assert.doesNotMatch(page, /Ubuntu Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#0B0F14/);
  assert.doesNotMatch(page, /#E85D04/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#9B1D20/);
  assert.doesNotMatch(page, /#F7F1E6/);
  assert.doesNotMatch(page, /#1C1917/);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /cheque-counterfoil|headers-hash/i);
  assert.doesNotMatch(page, /wax-cachet|string-carrier/i);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfurled\b/);
  assert.doesNotMatch(page, /\bseised\b/);
  assert.doesNotMatch(page, /\bdisseised\b/);
  assert.doesNotMatch(page, /\bstanding\b/);
  assert.doesNotMatch(page, /\bhoisted\b/);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Aposiopesis/i);
  assert.match(page, /NOT Disseisin/i);
  assert.match(page, /NOT Cipherlock/i);
  assert.match(page, /NOT Counterfoil/i);
  assert.match(page, /NOT Cachet/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Nullarbor/);
  assert.match(readme, /#93595/);
  assert.match(readme, /\bstamped\b/);
  assert.match(readme, /emptied/);
  assert.match(readme, /empty-expand/);
  assert.match(readme, /Teko/);
  assert.match(readme, /Hind/);
  assert.match(readme, /Fira Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Aposiopesis/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /NOT Cipherlock/i);
  assert.match(readme, /NOT Counterfoil/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /#84367/);
  assert.match(readme, /2\.1\.260/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/nullarbor/);
  assert.match(readme, /node --test projects\/nullarbor\/nullarbor\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Nullarbor Plain|saltbush|ticket booth|horizon|Eyre|brass stamp/i);
  assert.match(readme, /Bearer/);
  assert.match(readme, /Score nullarbor or admit stamped/);
});

test("catalog features Nullarbor only; Petard unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 294);
  assert.equal(hub.products.length, 294);
  assert.equal(catalog.products[0].name, "Nullarbor");
  assert.equal(catalog.products[0].slug, "nullarbor");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/nullarbor/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /22:50/);
  assert.match(catalog.products[0].summary, /nullarbor/);
  assert.match(catalog.products[0].summary, /#93595/);
  assert.match(catalog.products[0].summary, /\bstamped\b/);
  assert.match(catalog.products[0].summary, /emptied/);
  assert.match(catalog.products[0].summary, /empty-expand/);
  assert.equal(hub.products[0].slug, "nullarbor");
  assert.equal(hub.products[0].featured, true);
  const petard = catalog.products.find((row) => row.slug === "petard");
  assert.ok(petard);
  assert.equal(petard.featured, false);
  const aposiopesis = catalog.products.find((row) => row.slug === "aposiopesis");
  assert.ok(aposiopesis);
  assert.equal(aposiopesis.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "nullarbor").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93595") && row.slug !== "nullarbor"));
});

test("vercel rewrites nullarbor to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/nullarbor");
  assert.equal(vercel.rewrites[0].destination, "/projects/nullarbor");
  assert.equal(vercel.rewrites[1].source, "/nullarbor/");
  assert.equal(vercel.rewrites[1].destination, "/projects/nullarbor");
  assert.equal(vercel.rewrites[2].source, "/nullarbor/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/nullarbor/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
