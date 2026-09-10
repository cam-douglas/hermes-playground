import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BENCH_STATIONS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CONFIRMED_BINARY,
  COUNTERFOIL_WALK,
  COUSINS,
  CREDENTIAL_STORE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GITHUB_MCP_URL,
  HEADER_NAME,
  HEADER_VALUE,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  KEY_TABLE,
  LABELS,
  LOOKUP_KEY_PUBLISHED,
  LOOKUP_PAYLOAD,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  REJECT,
  SEEDED_WORD,
  SERVER_NAME,
  STALE_CLOSED,
  STALE_COUSIN,
  STALE_VERSION,
  STATE,
  STORE_KEY_PUBLISHED,
  STORE_PAYLOAD,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectKeys,
  inspectLookup,
  inspectStore,
  keyFor,
  keyPayload,
  readBench,
  score,
  scoreGate,
  scoreWalk,
  seedAddJson,
  seedClientSecret,
  seedCounterfoil,
  seedGithubMcp,
  seedHeadersHash,
  seedHeadersIncluded,
  seedHeadersStripped,
  seedHold,
  seedKeyFor,
  seedMatched,
  seedNoSecret,
  seedSkewed,
  seedStale67528,
  seedTokenExchange,
} from "./counterfoil.mjs";

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
  return fileURLToPath(new URL("./counterfoil.mjs", import.meta.url));
}

test("idle matched is a hold; store + login use same keyFor with full config incl. headers", () => {
  const result = analyze(seedMatched());
  assert.equal(result.verdict, "matched");
  assert.equal(result.idleWord, "matched");
  assert.equal(IDLE_WORD, "matched");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.matched, true);
  assert.equal(result.phrase, "admit matched");
  assert.equal(result.headersStripped, false);
  assert.equal(result.lookupMiss, false);
  assert.equal(result.noSecret, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify matched", () => {
  assert.equal(classify(emptyTicket()), "matched");
  assert.equal(classify(""), "matched");
  assert.equal(classify(null), "matched");
  assert.equal(decide({}), "matched");
});

test("#93446 seeded path scores skewed when headers-stripped store misses headers-included lookup", () => {
  const result = analyze(seedSkewed());
  assert.equal(result.verdict, "skewed");
  assert.equal(result.seededWord, "skewed");
  assert.equal(SEEDED_WORD, "skewed");
  assert.equal(PRODUCT_WORD, "counterfoil");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.skewed, true);
  assert.equal(result.phrase, "score counterfoil");
  assert.equal(result.headersStripped, true);
  assert.equal(result.headersIncluded, true);
  assert.equal(result.lookupMiss, true);
  assert.equal(result.noSecret, true);
  assert.equal(result.storeKey, STORE_KEY_PUBLISHED);
  assert.equal(result.lookupKey, LOOKUP_KEY_PUBLISHED);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("headers-stripped store plus headers-included lookup is the #93446 counterfoil", () => {
  const store = inspectStore({
    headersStripped: true,
    addJson: true,
  });
  assert.equal(store.stamp, "skewed");
  assert.equal(store.stripped, true);
  const scored = scoreGate({
    skewed: true,
    addJson: true,
    headersStripped: true,
    headersIncluded: true,
    lookupMiss: true,
    noSecret: true,
    cue: "skewed",
  });
  assert.equal(scored.verdict, "skewed");
  assert.equal(scored.lookupMiss, true);
  const calm = inspectLookup({ matched: true });
  assert.equal(calm.stamp, "matched");
});

test("path word is headers-hash; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "headers-hash");
  const result = analyze(seedHeadersHash());
  assert.equal(result.verdict, "headers-hash");
  assert.equal(result.pathWord, "headers-hash");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "headers-hash", preferSeed: true, skewed: true }),
    "headers-hash",
  );
  assert.equal(classify(seedHeadersStripped()), "headers-stripped");
});

test("HOLD includes matched / hold", () => {
  assert.ok(HOLD.includes("matched"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: add-json, client-secret, keyFor, headers-stripped, headers-included, token-exchange, no-secret, github-mcp, stale-67528", () => {
  assert.equal(classify(seedAddJson()), "add-json");
  assert.equal(classify(seedClientSecret()), "client-secret");
  assert.equal(classify(seedKeyFor()), "keyFor");
  assert.equal(classify(seedHeadersStripped()), "headers-stripped");
  assert.equal(classify(seedHeadersIncluded()), "headers-included");
  assert.equal(classify(seedTokenExchange()), "token-exchange");
  assert.equal(classify(seedNoSecret()), "no-secret");
  assert.equal(classify(seedGithubMcp()), "github-mcp");
  assert.equal(classify(seedStale67528()), "stale-67528");
  assert.equal(classify(seedCounterfoil()), "counterfoil");
});

test("booth fixtures flip matched vs skewed vs headers-hash", () => {
  const idle = scoreGate(seedMatched());
  const seeded = scoreGate(readData("skewed.json"));
  const matched = readData("matched.json");
  const skewed = readData("skewed.json");
  const path = readData("headers-hash.json");
  const product = readData("counterfoil.json");
  assert.equal(idle.verdict, "matched");
  assert.equal(seeded.verdict, "skewed");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedMatched()), "matched");
  assert.equal(score(readData("skewed.json")), "skewed");
  assert.equal(matched.storeHeaders, true);
  assert.equal(matched.matched, true);
  assert.equal(scoreGate(matched).verdict, "matched");
  assert.equal(skewed.storeKey, STORE_KEY_PUBLISHED);
  assert.equal(skewed.lookupKey, LOOKUP_KEY_PUBLISHED);
  assert.equal(skewed.headersStripped, true);
  assert.equal(skewed.headersIncluded, true);
  assert.equal(classify(skewed), "skewed");
  assert.equal(path.paths.length, 3);
  assert.equal(path.paths[0].rule, "keyFor(serverName, cfg) hashes {type,url,headers}");
  assert.equal(path.paths[1].result, "headers dropped → headers:{}");
  assert.equal(classify(path), "headers-hash");
  assert.equal(classify(product), "counterfoil");
  assert.equal(skewed.issue, 93446);
  assert.match(skewed.reject, /client_id and\/or client_secret/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("matched"));
  assert.ok(CHIPS.includes("skewed"));
  assert.ok(CHIPS.includes("counterfoil"));
  assert.ok(CHIPS.includes("headers-hash"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("skewed"));
  assert.ok(ALARM.includes("headers-hash"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published counterfoil walk scores skewed after the idle hold", () => {
  const desk = scoreWalk({ rows: COUNTERFOIL_WALK });
  assert.equal(desk.verdict, "skewed");
  assert.ok(desk.skewedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-matched");
  assert.equal(idle.matched, true);
  assert.equal(idle.verdict, "matched");
  const persist = desk.rows.find((row) => row.event === "add-json-persist");
  assert.equal(persist.addJson, true);
  const store = desk.rows.find((row) => row.event === "save-secret-stripped");
  assert.equal(store.headersStripped, true);
  const storeKey = desk.rows.find((row) => row.event === "store-key");
  assert.equal(storeKey.storeKey, STORE_KEY_PUBLISHED);
  const login = desk.rows.find((row) => row.event === "mcp-login");
  assert.equal(login.headersIncluded, true);
  const lookup = desk.rows.find((row) => row.event === "lookup-key");
  assert.equal(lookup.lookupKey, LOOKUP_KEY_PUBLISHED);
  const miss = desk.rows.find((row) => row.event === "lookup-miss");
  assert.equal(miss.lookupMiss, true);
  const exchange = desk.rows.find((row) => row.event === "token-exchange");
  assert.equal(exchange.noSecret, true);
  const reject = desk.rows.find((row) => row.event === "github-reject");
  assert.match(reject.reject, /client_id and\/or client_secret/);
  const stain = desk.rows.find((row) => row.event === "skewed");
  assert.equal(stain.skewed, true);
  const path = desk.rows.find((row) => row.event === "headers-hash");
  assert.equal(path.verdict, "headers-hash");
});

test("COUNTERFOIL_WALK constant matches the issue blotter walk", () => {
  assert.equal(COUNTERFOIL_WALK[0].event, "cue-matched");
  const store = COUNTERFOIL_WALK.find((row) => row.event === "store-key");
  assert.equal(store.storeKey, STORE_KEY_PUBLISHED);
  const stain = COUNTERFOIL_WALK.find((row) => row.event === "skewed");
  assert.equal(stain.headersStripped, true);
  assert.equal(stain.headersIncluded, true);
  const path = COUNTERFOIL_WALK.find((row) => row.event === "headers-hash");
  assert.equal(path.skewed, true);
  const scoreRow = COUNTERFOIL_WALK.find((row) => row.event === "counterfoil");
  assert.equal(scoreRow.skewed, true);
});

test("issue constants encode only #93446 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93446);
  assert.ok(ISSUE_URL.includes("93446"));
  assert.match(TITLE, /mcp add-json --client-secret/);
  assert.match(TITLE, /headers-stripped/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(AUTHOR, "medley56");
  assert.equal(FILED, "2026-09-10T18:54:06Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.197");
  assert.equal(CONFIRMED_BINARY, "2.1.267");
  assert.equal(STALE_COUSIN, 67528);
  assert.equal(STALE_VERSION, "2.1.173");
  assert.equal(STALE_CLOSED, "2026-07-22");
  assert.equal(OS, "Ubuntu/Debian Linux");
  assert.equal(SERVER_NAME, "github");
  assert.equal(GITHUB_MCP_URL, "https://api.githubcopilot.com/mcp/");
  assert.equal(HEADER_NAME, "X-MCP-Toolsets");
  assert.equal(HEADER_VALUE, "default,actions");
  assert.equal(STORE_KEY_PUBLISHED, "github|1eea5f274543f247");
  assert.equal(LOOKUP_KEY_PUBLISHED, "github|01759ec9120e7ef8");
  assert.equal(STORE_PAYLOAD, '{"type":"http","url":"https://api.githubcopilot.com/mcp/","headers":{}}');
  assert.equal(LOOKUP_PAYLOAD, '{"type":"http","url":"https://api.githubcopilot.com/mcp/","headers":{"X-MCP-Toolsets":"default,actions"}}');
  assert.equal(REJECT, "The client_id and/or client_secret passed are incorrect.");
  assert.equal(CREDENTIAL_STORE, "$CLAUDE_CONFIG_DIR/.credentials.json");
  assert.equal(KEY_TABLE.length, 2);
  assert.equal(KEY_TABLE[0].key, STORE_KEY_PUBLISHED);
  assert.equal(KEY_TABLE[1].key, LOOKUP_KEY_PUBLISHED);
  assert.equal(BENCH_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("headers-stripped"));
  assert.ok(FINGERPRINT_LINES.includes("headers-included"));
  assert.match(PHRASE, /score counterfoil or admit matched/);
});

test("has-repro fingerprints encode the published add-json window", () => {
  const result = handle(readData("skewed.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.197");
  assert.equal(result.published.confirmedBinary, "2.1.267");
  assert.equal(result.published.author, "medley56");
  assert.equal(result.published.os, "Ubuntu/Debian Linux");
  assert.equal(result.published.storeKey, STORE_KEY_PUBLISHED);
  assert.equal(result.published.lookupKey, LOOKUP_KEY_PUBLISHED);
  assert.equal(result.published.reject, REJECT);
  assert.match(
    fingerprint(seedSkewed()),
    /skewed\|store=stripped\|lookup=included\|lookup=miss\|secret=absent\|cue=skewed/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Lucida and Cartulary", () => {
  const required = [
    "traced",
    "pathless",
    "image-cache",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
    "gitignore",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
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
    "pontoon",
    "concordant",
    "reaped",
    "revenant",
    "oubliette",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("matched blotter flips skewed back when store and login share the full config", () => {
  const tape = {
    matched: true,
    storeHeaders: true,
    lookupHeaders: true,
    headersStripped: false,
    skewed: false,
    cue: "matched",
  };
  assert.equal(scoreGate(tape).verdict, "matched");
  tape.matched = false;
  tape.skewed = true;
  tape.headersStripped = true;
  tape.storeHeaders = false;
  tape.cue = "skewed";
  assert.equal(scoreGate(tape).verdict, "skewed");
  tape.matched = true;
  tape.skewed = false;
  tape.headersStripped = false;
  tape.storeHeaders = true;
  tape.cue = "matched";
  assert.equal(scoreGate(tape).verdict, "matched");
});

test("keyFor, store, lookup, and blotter mark skewed after headers drop", () => {
  const idle = inspectKeys({ matched: true, storeHeaders: true, lookupHeaders: true });
  assert.equal(idle.stamp, "matched");
  assert.equal(idle.same, true);
  const stripped = inspectStore({
    headersStripped: true,
    addJson: true,
  });
  assert.equal(stripped.stamp, "skewed");
  assert.equal(stripped.key, STORE_KEY_PUBLISHED);
  const lookup = inspectLookup({
    headersIncluded: true,
    lookupMiss: true,
    headersStripped: true,
  });
  assert.equal(lookup.stamp, "skewed");
  assert.equal(lookup.key, LOOKUP_KEY_PUBLISHED);
  const desk = readBench({
    skewed: true,
    headersStripped: true,
    addJson: true,
  });
  assert.equal(desk.skewed, true);
  assert.equal(desk.mark, "skewed");
  const calm = readBench({
    matched: true,
    storeHeaders: true,
    skewed: false,
  });
  assert.equal(calm.skewed, false);
  assert.equal(calm.mark, "matched");
  assert.equal(
    keyFor("github", { type: "http", url: GITHUB_MCP_URL, headers: {} }),
    STORE_KEY_PUBLISHED,
  );
  assert.equal(
    keyFor("github", {
      type: "http",
      url: GITHUB_MCP_URL,
      headers: { "X-MCP-Toolsets": "default,actions" },
    }),
    LOOKUP_KEY_PUBLISHED,
  );
  assert.match(keyPayload({ type: "http", url: GITHUB_MCP_URL, headers: {} }), /"headers":\{\}/);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 67528);
  assert.equal(COUSINS[1].issue, 89969);
  assert.equal(COUSINS[2].issue, 84839);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("lucida"));
  assert.ok(NOT_PRODUCTS.includes("fomite"));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.ok(NOT_PRODUCTS.includes("snubber"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93458);
  assert.equal(BACKUPS[1].issue, 92264);
  assert.equal(BACKUPS[2].issue, 86531);
  assert.equal(BACKUPS[3].issue, 93403);
  assert.equal(BACKUPS[4].issue, 93445);
  assert.equal(BACKUPS[5].issue, 93405);
  assert.equal(BACKUPS[6].issue, 93402);
  assert.equal(BACKUPS[7].issue, 93426);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/skewed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "matched");
  assert.equal(JSON.parse(seeded.stdout).verdict, "skewed");
});

test("handle exposes published hypothesis and #93446 headline", () => {
  const result = handle(readData("skewed.json"));
  assert.equal(result.published.issue, 93446);
  assert.equal(result.published.claudeCodeVersion, "2.1.197");
  assert.equal(result.published.confirmedBinary, "2.1.267");
  assert.equal(result.published.author, "medley56");
  assert.deepEqual(result.published.cousins, [67528, 89969, 84839]);
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(92264));
  assert.ok(result.published.backups.includes(86531));
  assert.match(result.published.hypothesis, /rebuilt \{type,url\}/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a cheque-counterfoil booth, not a cartulary scriptorium or paraph notary", () => {
  const page = readPage();
  assert.match(page, /Source Serif 4/);
  assert.match(page, /Libre Franklin/);
  assert.match(page, /Noto Sans Mono/);
  assert.match(page, /counterfoil|cheque|ticket-stub|brass grille|dating stamp|ledger blotter|perforat/i);
  assert.match(page, /#0d3b2e|#f4efe6|#9b1b1b|#b08d57/);
  assert.match(page, /matched/);
  assert.match(page, /skewed/);
  assert.match(page, /headers-hash/);
  assert.match(page, /score counterfoil or admit matched/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /05:50/);
  assert.match(page, /#278/);
  assert.match(page, /#93446/);
  assert.match(page, /medley56/);
  assert.match(page, /2\.1\.197/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /1eea5f274543f247/);
  assert.match(page, /01759ec9120e7ef8/);
  assert.match(page, /X-MCP-Toolsets/);
  assert.match(page, /Stamp the stub/);
  assert.match(page, /Score counterfoil/);
  assert.match(page, /Tear the perforation/);
  assert.match(page, /Audit the grille/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /#f3f7f6/);
  assert.doesNotMatch(page, /#0d7377/);
  assert.doesNotMatch(page, /#c99212/);
  assert.doesNotMatch(page, /#f7f0e4/);
  assert.doesNotMatch(page, /#5c4d8a/);
  assert.doesNotMatch(page, /oak lectern|quire|inkhorn|scriptorium/i);
  assert.doesNotMatch(page, /wax-seal|notarial|issuer-seal|paraph chamber/i);
  assert.doesNotMatch(page, /camera-lucida|drafting plate|tracing paper/i);
  assert.doesNotMatch(page, /culture dish|glass slide|agar|pathogen/i);
  assert.doesNotMatch(page, /pulse-damper|srt-mux|EPIPE/i);
  assert.doesNotMatch(page, /\blucida\b/);
  assert.doesNotMatch(page, /\bfomite\b/);
  assert.doesNotMatch(page, /\bcartulary\b/);
  assert.doesNotMatch(page, /\bparaph\b/);
  assert.doesNotMatch(page, /\btraced\b/);
  assert.doesNotMatch(page, /\bpathless\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Lucida/i);
  assert.match(page, /NOT Fomite/i);
  assert.match(page, /NOT Cartulary/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Vernier/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Counterfoil/);
  assert.match(readme, /#93446/);
  assert.match(readme, /matched/);
  assert.match(readme, /skewed/);
  assert.match(readme, /headers-hash/);
  assert.match(readme, /Source Serif 4/);
  assert.match(readme, /Libre Franklin/);
  assert.match(readme, /Noto Sans Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Lucida/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /NOT Cartulary/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /2\.1\.197/);
  assert.match(readme, /2\.1\.267/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/counterfoil/);
  assert.match(readme, /node --test projects\/counterfoil\/counterfoil\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /rebuilt \{type,url\}/);
  assert.match(readme, /#67528/);
  assert.match(readme, /#89969/);
  assert.match(readme, /#84839/);
  assert.match(readme, /#93331/);
  assert.match(readme, /#93327/);
  assert.match(readme, /cheque-counter/);
  assert.match(readme, /add-json/);
});

test("catalog features Counterfoil only; Lucida and Fomite unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 278);
  assert.equal(catalog.products[0].name, "Counterfoil");
  assert.equal(catalog.products[0].slug, "counterfoil");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/counterfoil/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /05:50/);
  assert.match(catalog.products[0].summary, /counterfoil/);
  assert.match(catalog.products[0].summary, /#93446/);
  assert.match(catalog.products[0].summary, /matched/);
  assert.match(catalog.products[0].summary, /skewed/);
  assert.match(catalog.products[0].summary, /headers-hash/);
  const lucida = catalog.products.find((row) => row.slug === "lucida");
  assert.ok(lucida);
  assert.equal(lucida.featured, false);
  const fomite = catalog.products.find((row) => row.slug === "fomite");
  assert.ok(fomite);
  assert.equal(fomite.featured, false);
  const snubber = catalog.products.find((row) => row.slug === "snubber");
  assert.ok(snubber);
  assert.equal(snubber.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "counterfoil").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93446") && row.slug !== "counterfoil"));
});

test("vercel rewrites counterfoil to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/counterfoil");
  assert.equal(vercel.rewrites[0].destination, "/projects/counterfoil");
  assert.equal(vercel.rewrites[1].source, "/counterfoil/");
  assert.equal(vercel.rewrites[1].destination, "/projects/counterfoil");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
