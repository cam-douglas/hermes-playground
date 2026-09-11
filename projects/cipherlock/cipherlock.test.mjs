import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTH_CACHE_AT,
  AUTH_CACHE_FILE,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CIPHERLOCK_WALK,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  DISTINCT_FROM,
  DISTRIBUTION,
  FALLBACK_STORE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEALTHY_REFRESH_AT,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  KEYCHAIN_ITEM,
  KEYCHAIN_REWRITE_AT,
  KILL_AFTER,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PROCESS_COUNT,
  PROCESS_VERSIONS,
  PRODUCT_WORD,
  REAUTH_COUNT,
  SEEDED_WORD,
  SERVERS,
  SESSION_KIND,
  STATE,
  TITLE,
  VAULT_STATIONS,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBox,
  inspectDial,
  inspectDoor,
  inspectSlot,
  readVault,
  score,
  scoreGate,
  scoreWalk,
  seedAuthCache,
  seedBlanked,
  seedCipherlock,
  seedConcurrentSessions,
  seedConcurrentWrite,
  seedEmptyTokens,
  seedHealthyRefresh,
  seedHold,
  seedKeychainRewrite,
  seedKilledMidRun,
  seedMcpList,
  seedNeedsAuth,
  seedNoClientId,
  seedPerEntryMerge,
  seedReReadBeforeWrite,
  seedSealed,
  seedSlackIntact,
  seedStubBlob,
  seedTokensHeld,
} from "./cipherlock.mjs";

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
  return fileURLToPath(new URL("./cipherlock.mjs", import.meta.url));
}

test("idle sealed is a hold; tokens held in Claude Code-credentials", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sealed, true);
  assert.equal(result.phrase, "admit sealed");
  assert.equal(result.blanked, false);
  assert.equal(result.concurrentWrite, false);
  assert.equal(result.tokensHeld, true);
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

test("#93537 seeded path scores blanked when concurrent writers zero valid refresh tokens", () => {
  const result = analyze(seedBlanked());
  assert.equal(result.verdict, "blanked");
  assert.equal(result.seededWord, "blanked");
  assert.equal(SEEDED_WORD, "blanked");
  assert.equal(PRODUCT_WORD, "cipherlock");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.blanked, true);
  assert.equal(result.phrase, "score cipherlock");
  assert.equal(result.concurrentSessions, true);
  assert.equal(result.mcpList, true);
  assert.equal(result.killedMidRun, true);
  assert.equal(result.keychainRewrite, true);
  assert.equal(result.emptyTokens, true);
  assert.equal(result.noClientId, true);
  assert.equal(result.slackIntact, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("concurrent sessions plus mcp list plus empty tokens is the #93537 cipherlock", () => {
  const door = inspectDoor({
    blanked: true,
    keychainRewrite: true,
  });
  assert.equal(door.stamp, "rewritten");
  assert.equal(door.rewritten, true);
  const scored = scoreGate({
    blanked: true,
    concurrentSessions: true,
    mcpList: true,
    killedMidRun: true,
    keychainRewrite: true,
    emptyTokens: true,
    noClientId: true,
    cue: "blanked",
  });
  assert.equal(scored.verdict, "blanked");
  assert.equal(scored.concurrentWrite, false);
  const calm = inspectBox({ sealed: true, tokensHeld: true, healthyRefresh: true });
  assert.equal(calm.stamp, "sealed");
});

test("path word is concurrent-write; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "concurrent-write");
  const result = analyze(seedConcurrentWrite());
  assert.equal(result.verdict, "concurrent-write");
  assert.equal(result.pathWord, "concurrent-write");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "concurrent-write", preferSeed: true, blanked: true }),
    "concurrent-write",
  );
  assert.equal(classify(seedMcpList()), "mcp-list");
});

test("HOLD includes sealed / hold", () => {
  assert.ok(HOLD.includes("sealed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: concurrent-sessions, mcp-list, killed-mid-run, keychain-rewrite, empty-tokens, concurrent-write", () => {
  assert.equal(classify(seedHealthyRefresh()), "healthy-refresh");
  assert.equal(classify(seedConcurrentSessions()), "concurrent-sessions");
  assert.equal(classify(seedMcpList()), "mcp-list");
  assert.equal(classify(seedKilledMidRun()), "killed-mid-run");
  assert.equal(classify(seedAuthCache()), "auth-cache");
  assert.equal(classify(seedStubBlob()), "stub-blob");
  assert.equal(classify(seedKeychainRewrite()), "keychain-rewrite");
  assert.equal(classify(seedEmptyTokens()), "empty-tokens");
  assert.equal(classify(seedSlackIntact()), "slack-intact");
  assert.equal(classify(seedNoClientId()), "no-client-id");
  assert.equal(classify(seedNeedsAuth()), "needs-auth");
  assert.equal(classify(seedReReadBeforeWrite()), "re-read-before-write");
  assert.equal(classify(seedPerEntryMerge()), "per-entry-merge");
  assert.equal(classify(seedTokensHeld()), "tokens-held");
  assert.equal(classify(seedCipherlock()), "cipherlock");
});

test("booth fixtures flip sealed vs blanked vs concurrent-write vs cipherlock", () => {
  const idle = scoreGate(seedSealed());
  const seeded = scoreGate(readData("blanked.json"));
  const sealed = readData("sealed.json");
  const blanked = readData("blanked.json");
  const path = readData("concurrent-write.json");
  const product = readData("cipherlock.json");
  assert.equal(idle.verdict, "sealed");
  assert.equal(seeded.verdict, "blanked");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSealed()), "sealed");
  assert.equal(score(readData("blanked.json")), "blanked");
  assert.equal(sealed.tokensHeld, true);
  assert.equal(sealed.sealed, true);
  assert.equal(scoreGate(sealed).verdict, "sealed");
  assert.equal(blanked.emptyTokens, true);
  assert.equal(blanked.keychainRewrite, true);
  assert.equal(blanked.concurrentSessions, true);
  assert.equal(classify(blanked), "blanked");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /Claude Code-credentials/);
  assert.match(path.paths[2].result, /keycard/);
  assert.equal(classify(path), "concurrent-write");
  assert.equal(classify(product), "cipherlock");
  assert.equal(product.hubCount, "CIPHERLOCK");
  assert.equal(blanked.issue, 93537);
  assert.equal(blanked.blanked, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("blanked"));
  assert.ok(CHIPS.includes("cipherlock"));
  assert.ok(CHIPS.includes("concurrent-write"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("blanked"));
  assert.ok(ALARM.includes("concurrent-write"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cipherlock walk scores blanked after the idle hold", () => {
  const vault = scoreWalk({ rows: CIPHERLOCK_WALK });
  assert.equal(vault.verdict, "blanked");
  assert.ok(vault.blankedCount >= 1);
  const idle = vault.rows.find((row) => row.event === "cue-sealed");
  assert.equal(idle.sealed, true);
  assert.equal(idle.verdict, "sealed");
  const sessions = vault.rows.find((row) => row.event === "concurrent-sessions");
  assert.equal(sessions.concurrentSessions, true);
  const list = vault.rows.find((row) => row.event === "mcp-list");
  assert.equal(list.blanked, true);
  const rewrite = vault.rows.find((row) => row.event === "keychain-rewrite");
  assert.equal(rewrite.keychainRewrite, true);
  const empty = vault.rows.find((row) => row.event === "empty-tokens");
  assert.equal(empty.emptyTokens, true);
  const path = vault.rows.find((row) => row.event === "concurrent-write");
  assert.equal(path.verdict, "concurrent-write");
});

test("CIPHERLOCK_WALK constant matches the issue vault walk", () => {
  assert.equal(CIPHERLOCK_WALK[0].event, "cue-sealed");
  const sessions = CIPHERLOCK_WALK.find((row) => row.event === "concurrent-sessions");
  assert.equal(sessions.concurrentSessions, true);
  const path = CIPHERLOCK_WALK.find((row) => row.event === "concurrent-write");
  assert.equal(path.blanked, true);
  const scoreRow = CIPHERLOCK_WALK.find((row) => row.event === "cipherlock");
  assert.equal(scoreRow.blanked, true);
});

test("positive control tokens-held stays sealed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "sealed");
  const held = walk.rows.find((row) => row.event === "tokens-held");
  assert.equal(held.verdict, "sealed");
  const refresh = walk.rows.find((row) => row.event === "healthy-refresh");
  assert.equal(refresh.healthyRefresh, true);
  assert.equal(refresh.verdict, "sealed");
});

test("issue constants encode only #93537 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93537);
  assert.ok(ISSUE_URL.includes("93537"));
  assert.match(TITLE, /concurrent claude processes/);
  assert.match(TITLE, /Keychain/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(AUTHOR, "DABH");
  assert.equal(FILED, "2026-09-11T04:52:54Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.268");
  assert.equal(OS, "macOS 26 (Darwin 25.6.0)");
  assert.equal(CLIENT, "native install");
  assert.match(DISTRIBUTION, /Claude Code-credentials/);
  assert.match(SESSION_KIND, /7 concurrent/);
  assert.equal(KEYCHAIN_ITEM, "Claude Code-credentials");
  assert.ok(SERVERS.some((row) => /notion/.test(row)));
  assert.ok(SERVERS.some((row) => /atlassian/.test(row)));
  assert.ok(SERVERS.some((row) => /slack/.test(row)));
  assert.equal(PROCESS_COUNT, 7);
  assert.match(PROCESS_VERSIONS, /2\.1\.206/);
  assert.equal(HEALTHY_REFRESH_AT, "04:29:47");
  assert.equal(AUTH_CACHE_AT, "04:32:14 and 04:39:19");
  assert.equal(KILL_AFTER, "~75s");
  assert.equal(KEYCHAIN_REWRITE_AT, "04:42:16");
  assert.equal(REAUTH_COUNT, 33);
  assert.equal(DISTINCT_FROM, 91009);
  assert.equal(FALLBACK_STORE, "~/.claude/.credentials.json");
  assert.equal(AUTH_CACHE_FILE, "~/.claude/mcp-needs-auth-cache.json");
  assert.equal(VAULT_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("concurrent-write"));
  assert.ok(FINGERPRINT_LINES.includes("blanked"));
  assert.match(PHRASE, /score cipherlock or admit sealed/);
});

test("has-repro fingerprints encode the published concurrent wipe", () => {
  const result = handle(readData("blanked.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "DABH");
  assert.match(result.published.sessionKind, /7 concurrent/);
  assert.equal(result.published.keychainItem, "Claude Code-credentials");
  assert.match(
    fingerprint(seedBlanked()),
    /blanked\|door=rewritten\|dial=spinning\|slot=swiped\|box=blanked\|slack=intact\|path=concurrent-write\|cue=blanked/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Attainder and Sourdine", () => {
  const required = [
    "untainted",
    "attainted",
    "attainder",
    "voiced",
    "muted",
    "sourdine",
    "kindled",
    "painted",
    "foxfire",
    "lodged",
    "dropped",
    "forksink",
    "flushed",
    "lagged",
    "pentimento",
    "solitary",
    "twinlinked",
    "vinculum",
    "hit",
    "flattened",
    "cachet",
    "steady",
    "strobing",
    "strobe",
    "matched",
    "skewed",
    "counterfoil",
    "traced",
    "pathless",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("sealed vault flips blanked back when tokens stay held", () => {
  const tape = {
    sealed: true,
    blanked: false,
    tokensHeld: true,
    healthyRefresh: true,
    emptyTokens: false,
    cue: "sealed",
  };
  assert.equal(scoreGate(tape).verdict, "sealed");
  tape.sealed = false;
  tape.blanked = true;
  tape.concurrentSessions = true;
  tape.mcpList = true;
  tape.killedMidRun = true;
  tape.keychainRewrite = true;
  tape.emptyTokens = true;
  tape.cue = "blanked";
  assert.equal(scoreGate(tape).verdict, "blanked");
  tape.sealed = true;
  tape.blanked = false;
  tape.emptyTokens = false;
  tape.keychainRewrite = false;
  tape.tokensHeld = true;
  tape.healthyRefresh = true;
  tape.cue = "sealed";
  assert.equal(scoreGate(tape).verdict, "sealed");
});

test("door, dial, slot, box, and readVault mark blanked after concurrent write", () => {
  const idle = inspectDoor({ sealed: true, keychainRewrite: false });
  assert.equal(idle.stamp, "held");
  const door = inspectDoor({
    blanked: true,
    keychainRewrite: true,
  });
  assert.equal(door.stamp, "rewritten");
  assert.equal(door.rewritten, true);
  const dial = inspectDial({
    blanked: true,
    concurrentSessions: true,
  });
  assert.equal(dial.stamp, "spinning");
  assert.equal(dial.concurrent, true);
  const slot = inspectSlot({
    blanked: true,
    mcpList: true,
    killedMidRun: true,
  });
  assert.equal(slot.stamp, "swiped");
  assert.equal(slot.listed, true);
  const box = inspectBox({
    blanked: true,
    emptyTokens: true,
    noClientId: true,
  });
  assert.equal(box.stamp, "blanked");
  assert.equal(box.empty, true);
  const vault = readVault({
    blanked: true,
    concurrentSessions: true,
    mcpList: true,
    keychainRewrite: true,
    emptyTokens: true,
  });
  assert.equal(vault.blanked, true);
  assert.equal(vault.mark, "blanked");
  const calm = readVault({
    sealed: true,
    blanked: false,
    tokensHeld: true,
    healthyRefresh: true,
  });
  assert.equal(calm.blanked, false);
  assert.equal(calm.mark, "sealed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 10);
  assert.equal(COUSINS[0].issue, 91009);
  assert.equal(COUSINS[1].issue, 91199);
  assert.equal(COUSINS[2].issue, 92839);
  assert.equal(COUSINS[3].issue, 89969);
  assert.equal(COUSINS[4].issue, 90647);
  assert.equal(COUSINS[5].issue, 91158);
  assert.equal(COUSINS[6].issue, 92149);
  assert.equal(COUSINS[7].issue, 87405);
  assert.equal(COUSINS[8].issue, 84274);
  assert.equal(COUSINS[9].issue, 84275);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("sump"));
  assert.ok(NOT_PRODUCTS.includes("spillway"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93475);
  assert.equal(BACKUPS[1].issue, 93439);
  assert.equal(BACKUPS[2].issue, 93438);
  assert.equal(BACKUPS[3].issue, 93466);
  assert.equal(BACKUPS[4].issue, 93495);
  assert.equal(BACKUPS[5].issue, 93508);
  assert.equal(BACKUPS[6].issue, 93530);
  assert.equal(BACKUPS[7].issue, 93536);
  assert.equal(BACKUPS[8].issue, 93534);
  assert.equal(BACKUPS[9].issue, 93532);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/blanked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "sealed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "blanked");
});

test("handle exposes published hypothesis and #93537 headline", () => {
  const result = handle(readData("blanked.json"));
  assert.equal(result.published.issue, 93537);
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.equal(result.published.author, "DABH");
  assert.deepEqual(result.published.cousins, [
    91009, 91199, 92839, 89969, 90647, 91158, 92149, 87405, 84274, 84275,
  ]);
  assert.ok(result.published.backups.includes(93475));
  assert.ok(result.published.backups.includes(93530));
  assert.ok(result.published.backups.includes(93536));
  assert.ok(result.published.backups.includes(93532));
  assert.match(result.published.hypothesis, /re-read-before-write/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a vault / bank-safe / cipher-lock booth, not parchment or concert mute", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /cipherlock|bank-safe|combination dial|steel door|keycard/i);
  assert.match(page, /#0E1218|#C8A15A|#2A313C|#3D7A78|#C0453A|#E8E2D4/i);
  assert.match(page, /\bsealed\b/);
  assert.match(page, /blanked/);
  assert.match(page, /concurrent-write/);
  assert.match(page, /score cipherlock or admit sealed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /15:50/);
  assert.match(page, /#287/);
  assert.match(page, /#93537/);
  assert.match(page, /DABH/);
  assert.match(page, /2\.1\.268/);
  assert.match(page, /Claude Code-credentials/);
  assert.match(page, /accessToken/);
  assert.match(page, /refreshToken/);
  assert.match(page, /notion/);
  assert.match(page, /atlassian/);
  assert.match(page, /Open the vault/);
  assert.match(page, /Score cipherlock/);
  assert.match(page, /Spin the dial/);
  assert.match(page, /Compare keycard \/ lock/);
  assert.match(page, /Pin idle sealed/);
  assert.match(page, /Pin seeded blanked/);
  assert.match(page, /Pin concurrent-write/);
  assert.match(page, /Clear the vault/);
  assert.doesNotMatch(page, /Old Standard TT/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Eczar/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#8B1E1E/);
  assert.doesNotMatch(page, /#F0E6A8/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F2C14E/);
  assert.doesNotMatch(page, /#FFB020/);
  assert.doesNotMatch(page, /#3ECFBF/);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\buntainted\b/);
  assert.doesNotMatch(page, /\battainted\b/);
  assert.doesNotMatch(page, /\bvoiced\b/);
  assert.doesNotMatch(page, /\bmuted\b/);
  assert.doesNotMatch(page, /\bmid-narration\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bdropped\b/);
  assert.doesNotMatch(page, /\bsource-fork\b/);
  assert.doesNotMatch(page, /\bkindled\b/);
  assert.doesNotMatch(page, /\bpainted\b/);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Cachet/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cipherlock/);
  assert.match(readme, /#93537/);
  assert.match(readme, /\bsealed\b/);
  assert.match(readme, /blanked/);
  assert.match(readme, /concurrent-write/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /2\.1\.268/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cipherlock/);
  assert.match(readme, /node --test projects\/cipherlock\/cipherlock\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /vault|bank-safe|cipher-lock|combination dial|steel door|keycard/i);
  assert.match(readme, /#91009/);
  assert.match(readme, /#87405/);
  assert.match(readme, /Claude Code-credentials/);
  assert.match(readme, /accessToken/);
});

test("catalog features Cipherlock only; Attainder unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 287);
  assert.equal(hub.products.length, 287);
  assert.equal(catalog.products[0].name, "Cipherlock");
  assert.equal(catalog.products[0].slug, "cipherlock");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cipherlock/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /15:50/);
  assert.match(catalog.products[0].summary, /cipherlock/);
  assert.match(catalog.products[0].summary, /#93537/);
  assert.match(catalog.products[0].summary, /\bsealed\b/);
  assert.match(catalog.products[0].summary, /blanked/);
  assert.match(catalog.products[0].summary, /concurrent-write/);
  assert.equal(hub.products[0].slug, "cipherlock");
  assert.equal(hub.products[0].featured, true);
  const attainder = catalog.products.find((row) => row.slug === "attainder");
  assert.ok(attainder);
  assert.equal(attainder.featured, false);
  const sourdine = catalog.products.find((row) => row.slug === "sourdine");
  assert.ok(sourdine);
  assert.equal(sourdine.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cipherlock").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93537") && row.slug !== "cipherlock"));
});

test("vercel rewrites cipherlock to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cipherlock");
  assert.equal(vercel.rewrites[0].destination, "/projects/cipherlock");
  assert.equal(vercel.rewrites[1].source, "/cipherlock/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cipherlock");
  assert.equal(vercel.rewrites[2].source, "/cipherlock/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cipherlock/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
