import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARTIFACT_COUNT,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COMMIT_STAMP,
  COUSINS,
  DESKTOP_BUILD,
  DISALLOW_LIST,
  DISTRIBUTION,
  FEATURE_FLAG,
  FEATURE_KEY,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FORCE_FLAG,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MCP_BASH,
  MCP_BASH_TOOL,
  MCP_WEB_FETCH,
  MCP_WEB_FETCH_COUNT,
  MODEL,
  MONSTRANCE_WALK,
  NATIVE_BASH,
  NATIVE_WEBFETCH,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  READ_COUNT,
  REFUSAL_BLAME,
  SANCTUARY_STATIONS,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  VERDICTS,
  WEBSEARCH_COUNT,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectHost,
  inspectLuna,
  inspectRays,
  inspectRibbon,
  inspectSacristy,
  readSanctuary,
  score,
  scoreGate,
  scoreWalk,
  seedArtifactPublish,
  seedArtifactRead,
  seedCodeSurface,
  seedCoworkSurface,
  seedCreatedSessionOk,
  seedDenyRuleAbsent,
  seedForceTrue,
  seedHold,
  seedHostWithdrawn,
  seedLaterSessionRefuse,
  seedLunaVeiled,
  seedMcpSubstitute,
  seedMonstrance,
  seedNativeBind,
  seedPhantomDeny,
  seedPhantomRibbon,
  seedSacristyUnused,
  seedViewed,
  seedWithheld,
} from "./monstrance.mjs";

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
  return fileURLToPath(new URL("./monstrance.mjs", import.meta.url));
}

test("idle viewed is a hold; live artifact readable via the fetch Cowork actually provides", () => {
  const result = analyze(seedViewed());
  assert.equal(result.verdict, "viewed");
  assert.equal(result.idleWord, "viewed");
  assert.equal(IDLE_WORD, "viewed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.viewed, true);
  assert.equal(result.phrase, "admit viewed");
  assert.equal(result.withheld, false);
  assert.equal(result.phantomDeny, false);
  assert.equal(result.mcpSubstituteUsed, true);
  assert.equal(result.artifactRead, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify viewed", () => {
  assert.equal(classify(emptyTicket()), "viewed");
  assert.equal(classify(""), "viewed");
  assert.equal(classify(null), "viewed");
  assert.equal(decide({}), "viewed");
});

test("#93563 seeded path scores withheld when native WebFetch is missing and content is withheld", () => {
  const result = analyze(seedWithheld());
  assert.equal(result.verdict, "withheld");
  assert.equal(result.seededWord, "withheld");
  assert.equal(SEEDED_WORD, "withheld");
  assert.equal(PRODUCT_WORD, "monstrance");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.withheld, true);
  assert.equal(result.phrase, "score monstrance");
  assert.equal(result.hostWithdrawn, true);
  assert.equal(result.nativeWebfetchMissing, true);
  assert.equal(result.artifactBoundNative, true);
  assert.equal(result.mcpSubstituteUnused, true);
  assert.equal(result.artifactReadRefused, true);
  assert.equal(result.phantomDeny, true);
  assert.equal(result.denyRuleAbsent, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("native bind plus unused substitute plus refused read is the #93563 monstrance", () => {
  const luna = inspectLuna({
    withheld: true,
    nativeWebfetchMissing: true,
  });
  assert.equal(luna.stamp, "veiled");
  assert.equal(luna.veiled, true);
  const scored = scoreGate({
    withheld: true,
    hostWithdrawn: true,
    nativeWebfetchMissing: true,
    artifactBoundNative: true,
    mcpSubstituteUnused: true,
    artifactReadRefused: true,
    phantomDeny: true,
    cue: "withheld",
  });
  assert.equal(scored.verdict, "withheld");
  assert.equal(scored.phantomDeny, true);
  const calm = inspectHost({
    viewed: true,
    artifactRead: true,
  });
  assert.equal(calm.stamp, "exposed");
});

test("path word is phantom-deny; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "phantom-deny");
  const result = analyze(seedPhantomDeny());
  assert.equal(result.verdict, "phantom-deny");
  assert.equal(result.pathWord, "phantom-deny");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "phantom-deny", preferSeed: true, withheld: true }),
    "phantom-deny",
  );
  assert.equal(classify(seedNativeBind()), "native-webfetch");
});

test("HOLD includes viewed / hold", () => {
  assert.ok(HOLD.includes("viewed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: host-withdrawn, native-webfetch, mcp-substitute, force-true, later-session-refuse", () => {
  assert.equal(classify(seedHostWithdrawn()), "host-withdrawn");
  assert.equal(classify(seedNativeBind()), "native-webfetch");
  assert.equal(classify(seedMcpSubstitute()), "mcp-substitute");
  assert.equal(classify(seedForceTrue()), "force-true");
  assert.equal(classify(seedCreatedSessionOk()), "created-session-ok");
  assert.equal(classify(seedLaterSessionRefuse()), "later-session-refuse");
  assert.equal(classify(seedDenyRuleAbsent()), "deny-rule-absent");
  assert.equal(classify(seedArtifactRead()), "artifact-read");
  assert.equal(classify(seedArtifactPublish()), "artifact-publish");
  assert.equal(classify(seedLunaVeiled()), "luna-veiled");
  assert.equal(classify(seedSacristyUnused()), "sacristy-unused");
  assert.equal(classify(seedPhantomRibbon()), "phantom-ribbon");
  assert.equal(classify(seedCoworkSurface()), "cowork-surface");
  assert.equal(classify(seedCodeSurface()), "code-surface");
  assert.equal(classify(seedMonstrance()), "monstrance");
});

test("booth fixtures flip viewed vs withheld vs phantom-deny vs monstrance", () => {
  const idle = scoreGate(seedViewed());
  const seeded = scoreGate(readData("withheld.json"));
  const viewed = readData("viewed.json");
  const withheld = readData("withheld.json");
  const path = readData("phantom-deny.json");
  const product = readData("monstrance.json");
  const native = readData("native-webfetch.json");
  const mcp = readData("mcp-substitute.json");
  const force = readData("force-true.json");
  const created = readData("created-session-ok.json");
  const later = readData("later-session-refuse.json");
  const deny = readData("deny-rule-absent.json");
  assert.equal(idle.verdict, "viewed");
  assert.equal(seeded.verdict, "withheld");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedViewed()), "viewed");
  assert.equal(score(readData("withheld.json")), "withheld");
  assert.equal(viewed.mcpSubstituteUsed, true);
  assert.equal(viewed.viewed, true);
  assert.equal(scoreGate(viewed).verdict, "viewed");
  assert.equal(withheld.nativeWebfetchMissing, true);
  assert.equal(withheld.mcpSubstituteUnused, true);
  assert.equal(withheld.hostWithdrawn, true);
  assert.equal(classify(withheld), "withheld");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /native WebFetch/);
  assert.match(path.paths[2].result, /phantom DENY ribbon/);
  assert.equal(classify(path), "phantom-deny");
  assert.equal(classify(product), "monstrance");
  assert.equal(product.hubCount, "MONSTRANCE");
  assert.equal(withheld.issue, 93563);
  assert.equal(withheld.withheld, true);
  assert.equal(classify(native), "native-webfetch");
  assert.equal(classify(mcp), "mcp-substitute");
  assert.equal(mcp.mcpWebFetchCount, 1024);
  assert.equal(classify(force), "force-true");
  assert.equal(classify(created), "created-session-ok");
  assert.equal(classify(later), "later-session-refuse");
  assert.equal(classify(deny), "deny-rule-absent");
  assert.equal(deny.settingsHunt.length, 6);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("viewed"));
  assert.ok(CHIPS.includes("withheld"));
  assert.ok(CHIPS.includes("monstrance"));
  assert.ok(CHIPS.includes("phantom-deny"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("withheld"));
  assert.ok(ALARM.includes("phantom-deny"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published monstrance walk scores withheld after the idle hold", () => {
  const sanctuary = scoreWalk({ rows: MONSTRANCE_WALK });
  assert.equal(sanctuary.verdict, "withheld");
  assert.ok(sanctuary.withheldCount >= 1);
  const idle = sanctuary.rows.find((row) => row.event === "cue-viewed");
  assert.equal(idle.viewed, true);
  assert.equal(idle.verdict, "viewed");
  const withdraw = sanctuary.rows.find((row) => row.event === "host-withdrawn");
  assert.equal(withdraw.hostWithdrawn, true);
  const host = sanctuary.rows.find((row) => row.event === "withheld");
  assert.equal(host.withheld, true);
  const path = sanctuary.rows.find((row) => row.event === "phantom-deny");
  assert.equal(path.verdict, "phantom-deny");
});

test("MONSTRANCE_WALK constant matches the issue sanctuary walk", () => {
  assert.equal(MONSTRANCE_WALK[0].event, "cue-viewed");
  const withdraw = MONSTRANCE_WALK.find((row) => row.event === "host-withdrawn");
  assert.equal(withdraw.hostWithdrawn, true);
  const path = MONSTRANCE_WALK.find((row) => row.event === "phantom-deny");
  assert.equal(path.withheld, true);
  const scoreRow = MONSTRANCE_WALK.find((row) => row.event === "monstrance");
  assert.equal(scoreRow.withheld, true);
});

test("positive control code-surface stays viewed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "viewed");
  const code = walk.rows.find((row) => row.event === "code-surface");
  assert.equal(code.verdict, "viewed");
  const read = walk.rows.find((row) => row.event === "artifact-read");
  assert.equal(read.artifactRead, true);
  assert.equal(read.verdict, "viewed");
});

test("issue constants encode only #93563 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93563);
  assert.ok(ISSUE_URL.includes("93563"));
  assert.match(TITLE, /Artifact tool cannot read live artifacts/);
  assert.match(TITLE, /mcp__workspace__web_fetch/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.equal(CLAUDE_CODE_VERSION, "1.49585.0");
  assert.equal(OS, "macOS");
  assert.equal(CLIENT, "Cowork surface");
  assert.match(DESKTOP_BUILD, /1\.49585\.0/);
  assert.equal(COMMIT_STAMP, "2026-09-08");
  assert.equal(MODEL, "Opus");
  assert.equal(PLATFORM, "Anthropic API");
  assert.equal(NATIVE_BASH, 0);
  assert.equal(NATIVE_WEBFETCH, 0);
  assert.equal(MCP_BASH, 2935);
  assert.equal(MCP_WEB_FETCH_COUNT, 1024);
  assert.equal(WEBSEARCH_COUNT, 596);
  assert.equal(READ_COUNT, 414);
  assert.equal(ARTIFACT_COUNT, 21);
  assert.equal(MCP_WEB_FETCH, "mcp__workspace__web_fetch");
  assert.equal(MCP_BASH_TOOL, "mcp__workspace__bash");
  assert.deepEqual([...DISALLOW_LIST], [
    "Bash",
    "PowerShell",
    "NotebookEdit",
    "REPL",
    "JavaScript",
    "WebFetch",
  ]);
  assert.equal(FEATURE_FLAG, "coworkWebFetchViaApi");
  assert.equal(FEATURE_KEY, 1978029737);
  assert.equal(REFUSAL_BLAME, "your WebFetch deny rule (WebFetch)");
  assert.equal(FORCE_FLAG, "force: true");
  assert.match(DISTRIBUTION, /Cowork surface/);
  assert.match(SESSION_KIND, /native WebFetch/);
  assert.equal(SANCTUARY_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("phantom-deny"));
  assert.ok(FINGERPRINT_LINES.includes("withheld"));
  assert.match(PHRASE, /Score monstrance or admit viewed/);
});

test("has-repro fingerprints encode the published withheld luna", () => {
  const result = handle(readData("withheld.json"));
  assert.equal(result.published.claudeCodeVersion, "1.49585.0");
  assert.match(result.published.sessionKind, /mcp__workspace__web_fetch/);
  assert.equal(result.published.mcpWebFetch, "mcp__workspace__web_fetch");
  assert.match(
    fingerprint(seedWithheld()),
    /withheld\|luna=veiled\|rays=dim\|host=withheld\|sacristy=unused\|ribbon=deny\|path=phantom-deny\|cue=phantom-deny/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Compline and Cipherlock", () => {
  const required = [
    "compline",
    "lingering",
    "unrung",
    "closed",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
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
    "washed",
    "pontoon",
    "quietus",
    "reaped",
    "revenant",
    "hawser",
    "imprimatur",
    "ukase",
    "understudy",
    "fetch",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("viewed sanctuary flips withheld back when the substitute vessel is used", () => {
  const tape = {
    viewed: true,
    withheld: false,
    mcpSubstituteUsed: true,
    artifactRead: true,
    nativeWebfetchMissing: false,
    cue: "viewed",
  };
  assert.equal(scoreGate(tape).verdict, "viewed");
  tape.viewed = false;
  tape.withheld = true;
  tape.hostWithdrawn = true;
  tape.nativeWebfetchMissing = true;
  tape.artifactBoundNative = true;
  tape.mcpSubstituteUnused = true;
  tape.cue = "withheld";
  assert.equal(scoreGate(tape).verdict, "withheld");
  tape.viewed = true;
  tape.withheld = false;
  tape.nativeWebfetchMissing = false;
  tape.mcpSubstituteUsed = true;
  tape.mcpSubstituteUnused = false;
  tape.cue = "viewed";
  assert.equal(scoreGate(tape).verdict, "viewed");
});

test("luna, rays, host, sacristy, ribbon, and readSanctuary mark withheld after a veiled exposition", () => {
  const idle = inspectLuna({ viewed: true, nativeWebfetchMissing: false });
  assert.equal(idle.stamp, "clear");
  const luna = inspectLuna({
    withheld: true,
    nativeWebfetchMissing: true,
  });
  assert.equal(luna.stamp, "veiled");
  assert.equal(luna.veiled, true);
  const rays = inspectRays({
    withheld: true,
    hostWithdrawn: true,
  });
  assert.equal(rays.stamp, "dim");
  assert.equal(rays.dim, true);
  const host = inspectHost({
    withheld: true,
    laterSessionRefuse: true,
  });
  assert.equal(host.stamp, "withheld");
  assert.equal(host.occulted, true);
  const sacristy = inspectSacristy({
    withheld: true,
    mcpSubstituteUnused: true,
  });
  assert.equal(sacristy.stamp, "unused");
  assert.equal(sacristy.unused, true);
  const ribbon = inspectRibbon({
    phantomDeny: true,
    denyRuleAbsent: true,
  });
  assert.equal(ribbon.stamp, "deny");
  assert.equal(ribbon.accused, true);
  const sanctuary = readSanctuary({
    withheld: true,
    hostWithdrawn: true,
    nativeWebfetchMissing: true,
    mcpSubstituteUnused: true,
  });
  assert.equal(sanctuary.withheld, true);
  assert.equal(sanctuary.mark, "withheld");
  const calm = readSanctuary({
    viewed: true,
    withheld: false,
    mcpSubstituteUsed: true,
    artifactRead: true,
  });
  assert.equal(calm.withheld, false);
  assert.equal(calm.mark, "viewed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 12);
  assert.equal(COUSINS[0].issue, 89786);
  assert.equal(COUSINS[1].issue, 89990);
  assert.equal(COUSINS[2].issue, 90468);
  assert.equal(COUSINS[3].issue, 89793);
  assert.equal(COUSINS[4].issue, 91126);
  assert.equal(COUSINS[5].issue, 87734);
  assert.equal(COUSINS[6].issue, 87962);
  assert.equal(COUSINS[7].issue, 93005);
  assert.equal(COUSINS[8].issue, 92740);
  assert.equal(COUSINS[9].issue, 92833);
  assert.equal(COUSINS[10].issue, 92426);
  assert.equal(COUSINS[11].issue, 90755);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("compline"));
  assert.ok(NOT_PRODUCTS.includes("cipherlock"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("quietus"));
  assert.ok(NOT_PRODUCTS.includes("imprimatur"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.ok(NOT_PRODUCTS.includes("understudy"));
  assert.ok(NOT_PRODUCTS.includes("fetch"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93530);
  assert.equal(BACKUPS[1].issue, 93556);
  assert.equal(BACKUPS[9].issue, 93532);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/withheld.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "viewed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "withheld");
});

test("handle exposes published hypothesis and #93563 headline", () => {
  const result = handle(readData("withheld.json"));
  assert.equal(result.published.issue, 93563);
  assert.equal(result.published.claudeCodeVersion, "1.49585.0");
  assert.deepEqual(result.published.cousins, [
    89786, 89990, 90468, 89793, 91126, 87734, 87962, 93005, 92740, 92833, 92426, 90755,
  ]);
  assert.ok(result.published.backups.includes(93530));
  assert.ok(result.published.backups.includes(93556));
  assert.ok(result.published.backups.includes(93532));
  assert.match(result.published.hypothesis, /WebFetch/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a sanctuary monstrance / exposition booth, not cloister or vault", () => {
  const page = readPage();
  assert.match(page, /Gilda Display/);
  assert.match(page, /Mulish/);
  assert.match(page, /Anonymous Pro/);
  assert.match(page, /monstrance|luna|sacristy|gilt rays|altar step/i);
  assert.match(page, /#140E18|#D4A84B|#8C6A2F|#F4EBD8|#8B1E2D|#6B6570/i);
  assert.match(page, /\bviewed\b/);
  assert.match(page, /withheld/);
  assert.match(page, /phantom-deny/);
  assert.match(page, /Score monstrance or admit viewed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /17:50/);
  assert.match(page, /#289/);
  assert.match(page, /#93563/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /Cowork/);
  assert.match(page, /WebFetch/);
  assert.match(page, /mcp__workspace__web_fetch/);
  assert.match(page, /Expose the host/);
  assert.match(page, /Score monstrance/);
  assert.match(page, /Open the luna/);
  assert.match(page, /Compare viewed \/ withheld/);
  assert.match(page, /Pin idle viewed/);
  assert.match(page, /Pin seeded withheld/);
  assert.match(page, /Pin phantom-deny/);
  assert.match(page, /Clear the altar/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Old Standard TT/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /#1A1528/);
  assert.doesNotMatch(page, /#E8C872/);
  assert.doesNotMatch(page, /#EDE6D9/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#0E1218/);
  assert.doesNotMatch(page, /#C8A15A/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#F0E6A8/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F2C14E/);
  assert.doesNotMatch(page, /#FFB020/);
  assert.doesNotMatch(page, /#3ECFBF/);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\bblanked\b/);
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
  assert.doesNotMatch(page, /\blingering\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.match(page, /NOT Compline/i);
  assert.match(page, /NOT Cipherlock/i);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Imprimatur/i);
  assert.match(page, /NOT Ukase/i);
  assert.match(page, /NOT Understudy/i);
  assert.match(page, /NOT Fetch/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Monstrance/);
  assert.match(readme, /#93563/);
  assert.match(readme, /\bviewed\b/);
  assert.match(readme, /withheld/);
  assert.match(readme, /phantom-deny/);
  assert.match(readme, /Gilda Display/);
  assert.match(readme, /Mulish/);
  assert.match(readme, /Anonymous Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Compline/i);
  assert.match(readme, /NOT Cipherlock/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Imprimatur/i);
  assert.match(readme, /NOT Ukase/i);
  assert.match(readme, /1\.49585\.0/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/monstrance/);
  assert.match(readme, /node --test projects\/monstrance\/monstrance\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /sanctuary|monstrance|luna|sacristy|gilt rays/i);
  assert.match(readme, /#89786/);
  assert.match(readme, /#93005/);
  assert.match(readme, /WebFetch/);
  assert.match(readme, /mcp__workspace__web_fetch/);
  assert.match(readme, /Score monstrance or admit viewed/);
});

test("catalog features Monstrance only; Compline unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 289);
  assert.equal(hub.products.length, 289);
  assert.equal(catalog.products[0].name, "Monstrance");
  assert.equal(catalog.products[0].slug, "monstrance");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/monstrance/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /17:50/);
  assert.match(catalog.products[0].summary, /monstrance/);
  assert.match(catalog.products[0].summary, /#93563/);
  assert.match(catalog.products[0].summary, /\bviewed\b/);
  assert.match(catalog.products[0].summary, /withheld/);
  assert.match(catalog.products[0].summary, /phantom-deny/);
  assert.equal(hub.products[0].slug, "monstrance");
  assert.equal(hub.products[0].featured, true);
  const compline = catalog.products.find((row) => row.slug === "compline");
  assert.ok(compline);
  assert.equal(compline.featured, false);
  const cipherlock = catalog.products.find((row) => row.slug === "cipherlock");
  assert.ok(cipherlock);
  assert.equal(cipherlock.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "monstrance").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93563") && row.slug !== "monstrance"));
});

test("vercel rewrites monstrance to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/monstrance");
  assert.equal(vercel.rewrites[0].destination, "/projects/monstrance");
  assert.equal(vercel.rewrites[1].source, "/monstrance/");
  assert.equal(vercel.rewrites[1].destination, "/projects/monstrance");
  assert.equal(vercel.rewrites[2].source, "/monstrance/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/monstrance/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
