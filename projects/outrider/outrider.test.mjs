import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BOUND_STATUS,
  CHIPS,
  CLAUDE_VERSION,
  CLIENT_POST_AT,
  CLIENT_WAIT_S,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GATE_MARK,
  HELPER_ELAPSED_MS,
  HELPER_INVOKED_AT,
  HELPER_KIND,
  HELPER_RANGE,
  HELPER_RETURN_AT,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OUTRIDER_POUCHES,
  OUTRIDER_WALK,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  POST_STATUS,
  PRODUCT_WORD,
  RETRY_MS,
  RULED_OUT,
  SAMPLE_ACCESS,
  SAMPLE_CONNECT,
  SAMPLE_GATE,
  SAMPLE_HELPER,
  SAMPLE_RETRY,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  SURFACE,
  TIMEOUT_S,
  TITLE,
  TOO_LATE_MS,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAccess,
  inspectConnect,
  inspectGate,
  inspectHelper,
  inspectRetry,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAccessLogSplit,
  seedBarePost,
  seedConcurrentHelpers,
  seedCredentialed,
  seedDiscardedToken,
  seedEarlyConnect,
  seedHelperInvoked,
  seedHelperPending,
  seedHold,
  seedNeedsAuth,
  seedOutridden,
  seedOutrider,
  seedRetrySamePending,
  seedTenSecondTimeout,
} from "./outrider.mjs";

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
  return fileURLToPath(new URL("./outrider.mjs", import.meta.url));
}

test("idle credentialed is a hold; connect waits until headersHelper returns", () => {
  const result = analyze(seedCredentialed());
  assert.equal(result.verdict, "credentialed");
  assert.equal(result.idleWord, "credentialed");
  assert.equal(IDLE_WORD, "credentialed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.credentialed, true);
  assert.equal(result.phrase, "admit credentialed");
  assert.equal(result.outridden, false);
  assert.equal(result.earlyConnect, false);
  assert.equal(result.helperPending, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify credentialed", () => {
  assert.equal(classify(emptyTicket()), "credentialed");
  assert.equal(classify(""), "credentialed");
  assert.equal(classify(null), "credentialed");
  assert.equal(decide({}), "credentialed");
});

test("#93776 seeded path scores outrider when the pouch arrives too late", () => {
  const result = analyze(seedOutridden());
  assert.equal(result.verdict, "outrider");
  assert.equal(result.seededWord, "outridden");
  assert.equal(SEEDED_WORD, "outridden");
  assert.equal(PRODUCT_WORD, "outrider");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.outridden, true);
  assert.equal(result.phrase, "score outrider");
  assert.equal(result.earlyConnect, true);
  assert.equal(result.helperInvoked, true);
  assert.equal(result.barePost, true);
  assert.equal(result.discardedToken, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("early connect plus bare-post is the #93776 outrider", () => {
  const helper = inspectHelper({ outridden: true, helperPending: true });
  assert.equal(helper.stamp, "pouch-late");
  assert.equal(helper.pendingAtConnect, true);
  const scored = scoreGate({
    outridden: true,
    earlyConnect: true,
    helperInvoked: true,
    barePost: true,
    discardedToken: true,
    needsAuth: true,
    helperPending: true,
    tenSecondTimeout: true,
    concurrentHelpers: true,
    accessLogSplit: true,
    retrySamePending: true,
    cue: "outridden",
    helper: SAMPLE_HELPER,
    connect: SAMPLE_CONNECT,
    gate: SAMPLE_GATE,
  });
  assert.equal(scored.verdict, "outrider");
  assert.equal(scored.earlyConnect, true);
  const open = inspectHelper({ credentialed: true, helperPending: false });
  assert.equal(open.stamp, "pouch-bound");
});

test("path word is early-connect; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "early-connect");
  const result = analyze(seedEarlyConnect());
  assert.equal(result.verdict, "early-connect");
  assert.equal(result.pathWord, "early-connect");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "early-connect", preferSeed: true, outridden: true }),
    "early-connect",
  );
  assert.equal(classify(seedBarePost()), "bare-post");
});

test("HOLD includes credentialed / hold", () => {
  assert.ok(HOLD.includes("credentialed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: helper-invoked, bare-post, discarded-token, needs-auth", () => {
  assert.equal(classify(seedHelperInvoked()), "helper-invoked");
  assert.equal(classify(seedBarePost()), "bare-post");
  assert.equal(classify(seedDiscardedToken()), "discarded-token");
  assert.equal(classify(seedNeedsAuth()), "needs-auth");
  assert.equal(classify(seedHelperPending()), "helper-pending");
  assert.equal(classify(seedTenSecondTimeout()), "ten-second-timeout");
  assert.equal(classify(seedConcurrentHelpers()), "concurrent-helpers");
  assert.equal(classify(seedAccessLogSplit()), "access-log-split");
  assert.equal(classify(seedRetrySamePending()), "retry-same-pending");
  assert.equal(classify(seedOutrider()), "outrider");
});

test("booth fixtures flip credentialed vs outridden vs early-connect vs outrider", () => {
  const idle = scoreGate(seedCredentialed());
  const seeded = scoreGate(seedOutridden());
  const credentialed = readData("credentialed.json");
  const outridden = readData("outridden.json");
  const path = readData("early-connect.json");
  const product = readData("outrider.json");
  const invoked = readData("helper-invoked.json");
  const bare = readData("bare-post.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "credentialed");
  assert.equal(seeded.verdict, "outrider");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedCredentialed()), "credentialed");
  assert.equal(score(seedOutridden()), "outrider");
  assert.equal(credentialed.helperPending, false);
  assert.equal(credentialed.credentialed, true);
  assert.equal(scoreGate(credentialed).verdict, "credentialed");
  assert.equal(outridden.earlyConnect, true);
  assert.equal(outridden.helperInvoked, true);
  assert.equal(outridden.barePost, true);
  assert.equal(classify(outridden), "outridden");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /do not send connect until helper resolves|timeout/i);
  assert.match(path.paths[1].result, /250ms|helper still running/i);
  assert.equal(classify(path), "early-connect");
  assert.equal(classify(product), "outrider");
  assert.equal(product.hubCount, "OUTRIDER");
  assert.equal(outridden.issue, 93776);
  assert.equal(outridden.outridden, true);
  assert.equal(classify(invoked), "helper-invoked");
  assert.equal(classify(bare), "bare-post");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("discarded-token.json")), "discarded-token");
  assert.equal(classify(readData("needs-auth.json")), "needs-auth");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("credentialed"));
  assert.ok(CHIPS.includes("outridden"));
  assert.ok(CHIPS.includes("outrider"));
  assert.ok(CHIPS.includes("early-connect"));
  assert.ok(CHIPS.includes("helper-invoked"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("outridden"));
  assert.ok(ALARM.includes("early-connect"));
  assert.ok(ALARM.includes("helper-invoked"));
  assert.ok(ALARM.includes("outrider"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published outrider walk scores outrider after the idle hold", () => {
  const booth = scoreWalk({ rows: OUTRIDER_WALK });
  assert.equal(booth.verdict, "outrider");
  assert.ok(booth.outriddenCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-credentialed");
  assert.equal(idle.credentialed, true);
  assert.equal(idle.verdict, "credentialed");
  const invoked = booth.rows.find((row) => row.event === "helper-invoked");
  assert.equal(invoked.helperInvoked, true);
  const path = booth.rows.find((row) => row.event === "early-connect" && row.t === "path");
  assert.equal(path.verdict, "early-connect");
});

test("OUTRIDER_WALK constant matches the issue dispatch walk", () => {
  assert.equal(OUTRIDER_WALK[0].event, "cue-credentialed");
  const invoked = OUTRIDER_WALK.find((row) => row.event === "helper-invoked");
  assert.equal(invoked.helperInvoked, true);
  const path = OUTRIDER_WALK.find((row) => row.t === "path");
  assert.equal(path.outridden, true);
  const scoreRow = OUTRIDER_WALK.find((row) => row.event === "outrider");
  assert.equal(scoreRow.outridden, true);
});

test("positive control await-helper stays credentialed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "credentialed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "credentialed");
  const hold = walk.rows.find((row) => row.event === "cue-credentialed");
  assert.equal(hold.credentialed, true);
  assert.equal(hold.verdict, "credentialed");
});

test("issue constants encode only #93776 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93776);
  assert.ok(ISSUE_URL.includes("93776"));
  assert.match(TITLE, /headersHelper/i);
  assert.match(TITLE, /connect|auth header/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(PLATFORM, "windows");
  assert.match(CLAUDE_VERSION, /2\.1\.266/);
  assert.match(SURFACE, /Windows 11/);
  assert.equal(HELPER_KIND, "headersHelper");
  assert.equal(HELPER_INVOKED_AT, "05:57:47.227");
  assert.equal(CLIENT_POST_AT, "05:57:52.593");
  assert.equal(HELPER_RETURN_AT, "05:57:52.728");
  assert.equal(TOO_LATE_MS, 135);
  assert.equal(HELPER_ELAPSED_MS, 5501);
  assert.equal(CLIENT_WAIT_S, 5.37);
  assert.equal(RETRY_MS, 250);
  assert.equal(TIMEOUT_S, 10);
  assert.match(HELPER_RANGE, /1\.7/);
  assert.equal(POST_STATUS, 403);
  assert.equal(BOUND_STATUS, 400);
  assert.match(GATE_MARK, /requires authentication/);
  assert.equal(OUTRIDER_POUCHES.length, 4);
  assert.ok(RULED_OUT.some((row) => /84778|80635|93595/i.test(row)));
  assert.ok(EXPECTED.some((row) => /do not send connect|retry 401\/403|log line/i.test(row)));
  assert.match(DISTRIBUTION, /headersHelper|135ms|5,501|needs-auth|10s/);
  assert.match(SESSION_KIND, /2\.1\.266|Windows 11|headersHelper/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("early-connect"));
  assert.ok(FINGERPRINT_LINES.includes("outridden"));
  assert.equal(PHRASE, "Score outrider or admit credentialed.");
  assert.equal(SAMPLE_HELPER.pendingAtConnect, true);
  assert.equal(SAMPLE_CONNECT.authorization, false);
  assert.equal(SAMPLE_GATE.stamped, true);
  assert.equal(SAMPLE_RETRY.identicalFail, true);
  assert.equal(SAMPLE_ACCESS.split, true);
});

test("has-repro fingerprints encode the published outridden ride", () => {
  const result = handle(seedOutridden());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.sessionKind, /headersHelper|2\.1\.266/);
  assert.equal(result.published.helperKind, HELPER_KIND);
  assert.match(
    fingerprint(seedOutridden()),
    /outrider\|pouch=discarded\|connect=bare\|helper=pending\|gate=needs-auth\|path=early-connect\|cue=early-connect/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Necrology and Innominate", () => {
  const required = [
    "attested",
    "necrologized",
    "necrology",
    "incomplete-listing",
    "named",
    "blank",
    "innominate",
    "icon-only",
    "lit",
    "snuffed",
    "snuffer",
    "ganged-or",
    "pledged",
    "swapped",
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "intact",
    "scraped",
    "rescript",
    "snapshot-write",
    "fresh",
    "residual",
    "monadnock",
    "submodule-base",
    "plain",
    "ridden",
    "attachment-rider",
    "rider",
    "dark",
    "spawn-mcp-focus",
    "followspot",
    "due",
    "misfired",
    "catchup-dow",
    "calends",
    "flowing",
    "dammed",
    "egress-allowlist",
    "weir",
    "underway",
    "becalmed",
    "cron-websearch",
    "irons",
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
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
    "primed",
    "flashed",
    "mirage",
    "lodged",
    "kindled",
    "flushed",
    "solitary",
    "hit",
    "dropped",
    "painted",
    "lagged",
    "twinlinked",
    "flattened",
    "held",
    "steered",
    "greenroomed",
    "palimpsest",
    "oubliette",
    "ephemera",
    "homonym",
    "quench",
    "stopcock",
    "hasp",
    "scuttle",
    "aphonia",
    "muzzle",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "knell",
    "wraith",
    "scrim",
    "knock",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("credentialed booth flips outridden back when the pouch stays bound", () => {
  const tape = {
    credentialed: true,
    outridden: false,
    helperPending: false,
    cue: "credentialed",
  };
  assert.equal(scoreGate(tape).verdict, "credentialed");
  tape.credentialed = false;
  tape.outridden = true;
  tape.earlyConnect = true;
  tape.barePost = true;
  tape.helperInvoked = true;
  tape.cue = "outridden";
  assert.equal(scoreGate(tape).verdict, "outrider");
  tape.credentialed = true;
  tape.outridden = false;
  tape.earlyConnect = false;
  tape.barePost = false;
  tape.helperInvoked = false;
  tape.cue = "credentialed";
  assert.equal(scoreGate(tape).verdict, "credentialed");
});

test("helper, connect, gate, retry, access, and readBooth mark the outridden ride", () => {
  const idle = inspectHelper({
    credentialed: true,
    helperPending: false,
    helper: { pendingAtConnect: false, discarded: false, validToken: true, cancelled: false },
  });
  assert.equal(idle.stamp, "pouch-bound");
  const connect = inspectConnect({ outridden: true, connect: SAMPLE_CONNECT });
  assert.equal(connect.stamp, "connect-bare");
  assert.equal(connect.authorization, false);
  const gate = inspectGate({
    needsAuth: true,
    gate: SAMPLE_GATE,
  });
  assert.equal(gate.stamp, "gate-needs-auth");
  const retry = inspectRetry({ outridden: true, retrySamePending: true });
  assert.equal(retry.stamp, "retry-same-pending");
  const access = inspectAccess({ outridden: true, accessLogSplit: true });
  assert.equal(access.stamp, "log-split");
  const booth = readBooth({
    outridden: true,
    barePost: true,
    helper: SAMPLE_HELPER,
    connect: SAMPLE_CONNECT,
  });
  assert.equal(booth.outridden, true);
  assert.equal(booth.mark, "outridden");
  const open = readBooth({
    credentialed: true,
    outridden: false,
    helperPending: false,
  });
  assert.equal(open.outridden, false);
  assert.equal(open.mark, "credentialed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 84778);
  assert.equal(COUSINS[1].issue, 80635);
  assert.equal(COUSINS[2].issue, 93595);
  assert.equal(COUSINS[3].issue, 84367);
  assert.equal(COUSINS[4].issue, 90677);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /84778|startup|terminal|rebuild/i);
  assert.match(COUSINS[1].why, /80635|needs-auth|poison/i);
  assert.match(COUSINS[2].why, /93595|\$\{VAR\}|empty/i);
  assert.match(COUSINS[3].why, /84367|badly built/i);
  assert.match(COUSINS[4].why, /90677|GitHub|badly formatted/i);
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("monadnock"));
  assert.ok(NOT_PRODUCTS.includes("rider"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("wraith"));
  assert.ok(NOT_PRODUCTS.includes("scrim"));
  assert.ok(NOT_PRODUCTS.includes("knock"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93766);
  assert.equal(BACKUPS[1].issue, 93764);
  assert.equal(BACKUPS[2].issue, 93754);
  assert.equal(BACKUPS[3].issue, 93751);
  assert.equal(BACKUPS[4].issue, 93744);
  assert.equal(BACKUPS[5].issue, 93772);
  assert.equal(BACKUPS[6].issue, 93770);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /OneDrive|musl|glibc/i);
  assert.match(BACKUPS[1].title, /DECSTBM/i);
  assert.match(BACKUPS[5].title, /diagram|poster/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/outridden.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const credentialedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/credentialed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(credentialedFix.status, 0, credentialedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "credentialed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "outridden");
  assert.equal(JSON.parse(credentialedFix.stdout).verdict, "credentialed");
});

test("handle exposes published hypothesis and #93776 headline", () => {
  const result = handle(seedOutridden());
  assert.equal(result.published.issue, 93776);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [84778, 80635, 93595, 84367, 90677]);
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(!result.published.backups.includes(93776));
  assert.ok(!result.published.backups.includes(93774));
  assert.match(result.published.hypothesis, /await|headersHelper|10s|401\/403/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93776/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a cavalry dispatch booth, not necrology or innominate", () => {
  const page = readPage();
  assert.match(page, /Archivo Black|Archivo\+Black/);
  assert.match(page, /Barlow/);
  assert.match(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.match(page, /outrider|outridden|dispatch|cavalry|pouch/i);
  assert.match(page, /#C4A574|#0B1C2C|#E8A317|#5C3A21|#F4EFE6|#3A4550/i);
  assert.match(page, /\bcredentialed\b/);
  assert.match(page, /\boutridden\b/);
  assert.match(page, /early-connect/);
  assert.match(page, /Score outrider or admit credentialed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#310/);
  assert.match(page, /#93776/);
  assert.match(page, /Hold the courier/);
  assert.match(page, /Score outrider/);
  assert.match(page, /Walk the early-connect/);
  assert.match(page, /Compare credentialed \/ outridden/);
  assert.match(page, /Pin idle credentialed/);
  assert.match(page, /Pin seeded outridden/);
  assert.match(page, /Pin early-connect/);
  assert.match(page, /Hold the credentialed/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#EDE3C8/);
  assert.doesNotMatch(page, /#1A1410/);
  assert.doesNotMatch(page, /#3F6B55/);
  assert.doesNotMatch(page, /#A02A38/);
  assert.doesNotMatch(page, /#8D8576/);
  assert.doesNotMatch(page, /#12141A/);
  assert.doesNotMatch(page, /#D7DCE5/);
  assert.doesNotMatch(page, /#0B0D12/);
  assert.doesNotMatch(page, /#2A9D8F/);
  assert.doesNotMatch(page, /#C1121F/);
  assert.doesNotMatch(page, /#F3E5C5/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#FFF8EC/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk|torn census/i);
  assert.doesNotMatch(page, /blank nameplate|UIA Name|sendIcon|WCAG 4\.1\.2/i);
  assert.doesNotMatch(page, /pledged heir|court ledger|cradle-swap|fairy-gold|swaddling/i);
  assert.doesNotMatch(page, /lemma slip|lexicographer|shelf mark|orphan quire/i);
  assert.doesNotMatch(page, /composing stick|wet-proof|wet proof|unbound-signature|pull press|type-rail|galley-bed/i);
  assert.doesNotMatch(page, /chancery|wax-seal|wax seal|scrolled-rescript|lectern/i);
  assert.doesNotMatch(page, /trig survey|trig cairn|residual peak|nested massif|fetch sill/i);
  assert.doesNotMatch(page, /clerk desk|bill-rider|parliamentary|staple-pin/i);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /artifact flame|scratchpad taper|brass snuffer|ganged-or bar/i);
  assert.doesNotMatch(page, /\battested\b/);
  assert.doesNotMatch(page, /\bnecrologized\b/);
  assert.doesNotMatch(page, /incomplete-listing/);
  assert.doesNotMatch(page, /\bnamed\b/);
  assert.doesNotMatch(page, /\bblank\b/);
  assert.doesNotMatch(page, /icon-only/);
  assert.doesNotMatch(page, /\bpledged\b/);
  assert.doesNotMatch(page, /\bswapped\b/);
  assert.doesNotMatch(page, /remote-reattach/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bcollided\b/);
  assert.doesNotMatch(page, /lossy-slug/);
  assert.doesNotMatch(page, /\bdry\b/);
  assert.doesNotMatch(page, /\bbilled\b/);
  assert.doesNotMatch(page, /stop-dirty/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\bscraped\b/);
  assert.doesNotMatch(page, /snapshot-write/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bresidual\b/);
  assert.doesNotMatch(page, /submodule-base/);
  assert.doesNotMatch(page, /\bplain\b/);
  assert.doesNotMatch(page, /\bridden\b/);
  assert.doesNotMatch(page, /attachment-rider/);
  assert.doesNotMatch(page, /\bdark\b/);
  assert.doesNotMatch(page, /spawn-mcp-focus/);
  assert.doesNotMatch(page, /\bdue\b/);
  assert.doesNotMatch(page, /\bmisfired\b/);
  assert.doesNotMatch(page, /catchup-dow/);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /greenroomed/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /ganged-or/);
  assert.match(page, /NOT Necrology/i);
  assert.match(page, /NOT Innominate/i);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Rescript/i);
  assert.match(page, /NOT Monadnock/i);
  assert.match(page, /NOT Rider/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Muzzle/i);
  assert.match(page, /NOT Escutcheon/i);
  assert.match(page, /NOT Lacuna/i);
  assert.match(page, /NOT Quench/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Outrider/);
  assert.match(readme, /#93776/);
  assert.match(readme, /\bcredentialed\b/);
  assert.match(readme, /\boutridden\b/);
  assert.match(readme, /early-connect/);
  assert.match(readme, /Archivo Black/);
  assert.match(readme, /Barlow/);
  assert.match(readme, /Share Tech Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Necrology/i);
  assert.match(readme, /NOT Innominate/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Rescript/i);
  assert.match(readme, /NOT Monadnock/i);
  assert.match(readme, /NOT Rider/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Aphonia/i);
  assert.match(readme, /NOT Quench/i);
  assert.match(readme, /#84778/);
  assert.match(readme, /#80635/);
  assert.match(readme, /#93595/);
  assert.match(readme, /#84367/);
  assert.match(readme, /#90677/);
  assert.match(readme, /headersHelper|135ms|needs-auth|Authorization/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/outrider/);
  assert.match(readme, /node --test projects\/outrider\/outrider\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /outrider|cavalry|dispatch|pouch/i);
  assert.match(readme, /Score outrider or admit credentialed/);
  assert.match(readme, /#93766|#93764|#93754|#93751|#93744|#93772|#93770/);
  assert.match(readme, /16:50/);
});

test("catalog features Outrider only; Necrology unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 310);
  assert.equal(hub.products.length, 310);
  assert.equal(catalog.products[0].name, "Outrider");
  assert.equal(catalog.products[0].slug, "outrider");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/outrider/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /16:50 outrider|#93776|cavalry outrider|dispatch-rider/i);
  assert.match(catalog.products[0].summary, /\bcredentialed\b/);
  assert.match(catalog.products[0].summary, /\boutridden\b/);
  assert.match(catalog.products[0].summary, /early-connect/);
  assert.match(catalog.products[0].summary, /Score outrider or admit credentialed/);
  assert.equal(hub.products[0].slug, "outrider");
  assert.equal(hub.products[0].featured, true);
  const necrology = catalog.products.find((row) => row.slug === "necrology");
  assert.ok(necrology);
  assert.equal(necrology.featured, false);
  const innominate = catalog.products.find((row) => row.slug === "innominate");
  assert.ok(innominate);
  assert.equal(innominate.featured, false);
  const snuffer = catalog.products.find((row) => row.slug === "snuffer");
  assert.ok(snuffer);
  assert.equal(snuffer.featured, false);
  const changeling = catalog.products.find((row) => row.slug === "changeling");
  assert.ok(changeling);
  assert.equal(changeling.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "outrider").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93776") && row.slug !== "outrider"));
});

test("vercel rewrites outrider to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/outrider");
  assert.equal(vercel.rewrites[0].destination, "/projects/outrider");
  assert.equal(vercel.rewrites[1].source, "/outrider/");
  assert.equal(vercel.rewrites[1].destination, "/projects/outrider");
  assert.equal(vercel.rewrites[2].source, "/outrider/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/outrider/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
