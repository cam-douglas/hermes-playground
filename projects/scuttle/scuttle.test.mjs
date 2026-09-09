import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  CHANNEL_ERROR,
  CHIPS,
  CLEANUP_LINE,
  CONTROLLER,
  COUSINS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEALTHY_AFTER_DROP_S,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LIVE_SESSIONS,
  LOCK_FILE,
  LOCK_FIELDS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PING_RPC,
  PROCESS_GROUPS,
  REAP_EXIT,
  REMOTE_CLI,
  REMOTE_OS,
  REMOTE_SSH,
  REMOTE_SSH_BUILT,
  SCUTTLE_WALK,
  SEEDED_WORD,
  SHUTDOWN_CLI,
  SHUTDOWN_RPC,
  STATE,
  TITLE,
  VERDICTS,
  WARMUP_ERROR,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedBridgeStartupTimeout,
  seedChannelClosedNoSocket,
  seedMoored,
  seedNoLivenessProbe,
  seedReattach,
  seedScuttle,
  seedScuttled,
  seedServerShutdown,
  seedSigkillChildren,
  seedTakeoverPathExists,
  seedWarmUpFailure,
} from "./scuttle.mjs";

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
  return fileURLToPath(new URL("./scuttle.mjs", import.meta.url));
}

test("idle moored is a hold; daemon stays healthy and reattaches", () => {
  const result = analyze(seedMoored());
  assert.equal(result.verdict, "moored");
  assert.equal(result.idleWord, "moored");
  assert.equal(IDLE_WORD, "moored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.moored, true);
  assert.equal(result.phrase, "admit moored");
  assert.equal(result.daemonAlive, true);
  assert.equal(result.reattach, true);
  assert.equal(result.shutdownIssued, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify moored", () => {
  assert.equal(classify(emptyTicket()), "moored");
  assert.equal(classify(""), "moored");
  assert.equal(classify(null), "moored");
  assert.equal(decide({}), "moored");
});

test("#93154 seeded path scores scuttled when shutdown SIGKILLs children", () => {
  const result = analyze(seedScuttled());
  assert.equal(result.verdict, "scuttled");
  assert.equal(result.seededWord, "scuttled");
  assert.equal(SEEDED_WORD, "scuttled");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scuttled, true);
  assert.equal(result.phrase, "score scuttled");
  assert.equal(result.shutdownIssued, true);
  assert.equal(result.sigkillChildren, true);
  assert.equal(result.warmupFailure, true);
  assert.equal(result.livenessProbe, false);
  assert.equal(result.childrenKilled, 42);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is scuttle; named scuttle seed holds the path", () => {
  assert.equal(PATH_WORD, "scuttle");
  const result = analyze(seedScuttle());
  assert.equal(result.verdict, "scuttle");
  assert.equal(result.pathWord, "scuttle");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("scuttle.json")), "scuttle");
});

test("HOLD includes moored / reattach / hold", () => {
  assert.ok(HOLD.includes("moored"));
  assert.ok(HOLD.includes("reattach"));
  assert.ok(HOLD.includes("hold"));
  const reattach = analyze(seedReattach());
  assert.equal(reattach.verdict, "reattach");
  assert.equal(reattach.hold, true);
  assert.equal(classify(readData("reattach.json")), "reattach");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: shutdown, timeout, channel, sigkill, warm-up, probe, takeover", () => {
  const stop = analyze(seedServerShutdown());
  assert.equal(stop.shutdownIssued, true);
  assert.equal(stop.shutdownRpc, SHUTDOWN_RPC);
  assert.equal(classify(readData("server-shutdown.json")), "server-shutdown");
  const timeout = analyze(seedBridgeStartupTimeout());
  assert.equal(timeout.warmupError, WARMUP_ERROR);
  assert.equal(classify(readData("bridge-startup-timeout.json")), "bridge-startup-timeout");
  const channel = analyze(seedChannelClosedNoSocket());
  assert.equal(channel.channelError, CHANNEL_ERROR);
  assert.equal(classify(readData("channel-closed-no-socket.json")), "channel-closed-no-socket");
  const kill = analyze(seedSigkillChildren());
  assert.equal(kill.childrenKilled, 42);
  assert.equal(classify(readData("sigkill-children.json")), "sigkill-children");
  const fail = analyze(seedWarmUpFailure());
  assert.equal(fail.warmupFailure, true);
  assert.equal(classify(readData("warm-up-failure.json")), "warm-up-failure");
  const probe = analyze(seedNoLivenessProbe());
  assert.equal(probe.livenessProbe, false);
  assert.equal(classify(readData("no-liveness-probe.json")), "no-liveness-probe");
  const takeover = analyze(seedTakeoverPathExists());
  assert.equal(takeover.takeoverPathExists, true);
  assert.equal(classify(readData("takeover-path-exists.json")), "takeover-path-exists");
});

test("fixture toggle flips moored vs scuttled", () => {
  const moored = scoreGate(readData("moored.json"));
  const scuttled = scoreGate(readData("scuttled.json"));
  assert.equal(moored.verdict, "moored");
  assert.equal(scuttled.verdict, "scuttled");
  assert.notEqual(moored.verdict, scuttled.verdict);
  assert.equal(score(readData("moored.json")), "moored");
  assert.equal(score(readData("scuttled.json")), "scuttled");
  assert.equal(score(readData("93154.json")), "scuttled");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("server-shutdown.json")), "server-shutdown");
  assert.equal(classify(readData("bridge-startup-timeout.json")), "bridge-startup-timeout");
  assert.equal(classify(readData("channel-closed-no-socket.json")), "channel-closed-no-socket");
  assert.equal(classify(readData("sigkill-children.json")), "sigkill-children");
  assert.equal(classify(readData("warm-up-failure.json")), "warm-up-failure");
  assert.equal(classify(readData("no-liveness-probe.json")), "no-liveness-probe");
  assert.equal(classify(readData("takeover-path-exists.json")), "takeover-path-exists");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("reattach.json")), "reattach");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published scuttle walk scores scuttled after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "scuttled");
  assert.ok(night.scuttledCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-moored");
  assert.equal(idle.daemonAlive, true);
  assert.equal(idle.verdict, "moored");
  const channel = night.rows.find((row) => row.event === "channel-closed-no-socket");
  assert.equal(channel.channelError, "channel_closed_no_socket");
  const timeout = night.rows.find((row) => row.event === "bridge-startup-timeout");
  assert.equal(timeout.warmupError, "bridge_startup_timeout");
  const stop = night.rows.find((row) => row.event === "server-shutdown");
  assert.equal(stop.shutdownIssued, true);
  const kill = night.rows.find((row) => row.event === "sigkill-children");
  assert.equal(kill.childrenKilled, 42);
  const sink = night.rows.find((row) => row.event === "scuttled");
  assert.equal(sink.sigkillChildren, true);
  const path = night.rows.find((row) => row.event === "scuttle");
  assert.equal(path.verdict, "scuttle");
});

test("SCUTTLE_WALK constant matches the issue reconnect walk", () => {
  assert.equal(SCUTTLE_WALK[0].event, "cue-moored");
  const channel = SCUTTLE_WALK.find((row) => row.event === "channel-closed-no-socket");
  assert.equal(channel.channelError, "channel_closed_no_socket");
  const timeout = SCUTTLE_WALK.find((row) => row.event === "bridge-startup-timeout");
  assert.equal(timeout.warmupError, "bridge_startup_timeout");
  const stop = SCUTTLE_WALK.find((row) => row.event === "server-shutdown");
  assert.equal(stop.shutdownRpc, "server.shutdown");
  assert.equal(stop.shutdownCli, "server --stop");
  const evidence = SCUTTLE_WALK.find((row) => row.event === "daemon-still-healthy");
  assert.equal(evidence.healthyAfterDropS, 104);
  assert.equal(evidence.reapExit, 0);
  const kill = SCUTTLE_WALK.find((row) => row.event === "sigkill-children");
  assert.equal(kill.childrenKilled, 42);
  assert.equal(kill.liveSessions, 10);
  const takeover = SCUTTLE_WALK.find((row) => row.event === "takeover-path-exists");
  assert.equal(takeover.takeoverSigtermFirst, true);
});

test("issue constants encode only #93154 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93154);
  assert.ok(ISSUE_URL.includes("93154"));
  assert.match(TITLE, /Remote SSH daemon destroys all running sessions/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(AUTHOR, "gofanly-reviewer");
  assert.equal(FILED, "2026-09-09");
  assert.match(REMOTE_SSH, /4534d864/);
  assert.equal(REMOTE_SSH_BUILT, "2026-09-02");
  assert.equal(REMOTE_CLI, "ccd-cli 2.1.260");
  assert.equal(REMOTE_OS, "Linux x86-64");
  assert.equal(CHANNEL_ERROR, "channel_closed_no_socket");
  assert.equal(WARMUP_ERROR, "bridge_startup_timeout");
  assert.equal(SHUTDOWN_RPC, "server.shutdown");
  assert.equal(SHUTDOWN_CLI, "server --stop");
  assert.equal(CONTROLLER, "RemoteServerController");
  assert.equal(HEALTHY_AFTER_DROP_S, 104);
  assert.equal(REAP_EXIT, 0);
  assert.equal(LIVE_SESSIONS, 10);
  assert.equal(PROCESS_GROUPS, 42);
  assert.match(CLEANUP_LINE, /killed 42 child process group/);
  assert.equal(PING_RPC, "server.ping");
  assert.equal(LOCK_FILE, "daemon.lock");
  assert.deepEqual([...LOCK_FIELDS], ["pid", "instanceId", "startedAt"]);
  assert.ok(FINGERPRINT_LINES.includes("channel_closed_no_socket"));
  assert.match(PHRASE, /not a moored ship/);
  assert.ok(HOLD.includes("moored"));
  assert.ok(ALARM.includes("scuttled"));
  assert.ok(ALARM.includes("scuttle"));
  assert.ok(CHIPS.includes("server-shutdown"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "fresh",
    "stamped",
    "cleared",
    "mounded",
    "distinct",
    "conflated",
    "held",
    "steered",
    "raised",
    "fallen",
    "sterling",
    "primed",
    "lodged",
    "parergon",
    "stereotype",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring reattach flips scuttled to moored", () => {
  const tape = {
    daemonAlive: true,
    reattach: true,
    livenessProbe: true,
    shutdownIssued: false,
    sigkillChildren: false,
    warmupFailure: false,
    cue: "moored",
  };
  assert.equal(scoreGate(tape).verdict, "moored");
  tape.reattach = false;
  tape.livenessProbe = false;
  tape.shutdownIssued = true;
  tape.sigkillChildren = true;
  tape.warmupFailure = true;
  tape.cue = "scuttled";
  assert.equal(scoreGate(tape).verdict, "scuttled");
  tape.reattach = true;
  tape.livenessProbe = true;
  tape.shutdownIssued = false;
  tape.sigkillChildren = false;
  tape.warmupFailure = false;
  tape.cue = "moored";
  assert.equal(scoreGate(tape).verdict, "moored");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [85567, 92687, 49790, 84468, 50982, 34255],
  );
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 85567);
  assert.equal(COUSINS[1].issue, 92687);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  assert.ok(NOT_PRODUCTS.includes("fusee"));
  assert.ok(NOT_PRODUCTS.includes("wildcat"));
  assert.ok(NOT_PRODUCTS.includes("snatch"));
  assert.ok(NOT_PRODUCTS.includes("deadman"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published macos/linux core walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /2\.1\.260/);
  assert.match(repro.note, /4534d864/);
  assert.match(repro.note, /channel_closed_no_socket/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const moored = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/moored.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const scuttled = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scuttled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(moored.status, 0, moored.stderr);
  assert.equal(scuttled.status, 0, scuttled.stderr);
  assert.equal(JSON.parse(moored.stdout).verdict, "moored");
  assert.equal(JSON.parse(scuttled.stdout).verdict, "scuttled");
});

test("handle exposes published hypothesis and #93154 headline", () => {
  const result = handle(readData("93154.json"));
  assert.equal(result.published.issue, 93154);
  assert.equal(result.published.remoteCli, "ccd-cli 2.1.260");
  assert.equal(result.published.healthyAfterDropS, 104);
  assert.equal(result.published.processGroups, 42);
  assert.equal(result.published.liveSessions, 10);
  assert.deepEqual(result.published.cousins, [85567, 92687, 49790, 84468, 50982, 34255]);
  assert.match(result.published.hypothesis, /reattach\/reuse/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedScuttled()),
    /scuttled\|reattach=no\|probe=none\|stop=shutdown/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a naval shipyard booth, not a brass plumbing workshop", () => {
  const page = readPage();
  assert.match(page, /DM Serif Display/);
  assert.match(page, /Lexend/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /scuttle|shipyard|porthole|bilge|teak|floodlight/i);
  assert.match(page, /#ff4d14/);
  assert.match(page, /#071422/);
  assert.match(page, /#1a5c48/);
  assert.match(page, /#c4a05a/);
  assert.match(page, /moored/);
  assert.match(page, /scuttled/);
  assert.match(page, /scuttle/);
  assert.match(page, /score scuttled or admit moored/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /03:50/);
  assert.match(page, /#253/);
  assert.match(page, /#93154/);
  assert.match(page, /channel_closed_no_socket/);
  assert.match(page, /bridge_startup_timeout/);
  assert.match(page, /server\.shutdown/);
  assert.match(page, /42/);
  assert.match(page, /104/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Newsreader|Manrope|Figtree|Playfair|Outfit|Oswald|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#b87333/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#2d6a5a/);
  assert.doesNotMatch(page, /#1c2128/);
  assert.doesNotMatch(page, /parchment|iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bmounded\b/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bconflated\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bdiplopic\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\bstopcock\b/);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Clepsydra/i);
  assert.match(page, /NOT Fusee/i);
  assert.match(page, /NOT Wildcat/i);
  assert.match(page, /NOT Snatch/i);
  assert.match(page, /NOT Deadman/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Scuttle/);
  assert.match(readme, /#93154/);
  assert.match(readme, /moored/);
  assert.match(readme, /scuttled/);
  assert.match(readme, /scuttle/);
  assert.match(readme, /DM Serif Display/);
  assert.match(readme, /Lexend/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Stopcock/i);
  assert.match(readme, /NOT Parergon/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Clepsydra/i);
  assert.match(readme, /NOT Fusee/i);
  assert.match(readme, /NOT Wildcat/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/scuttle/);
  assert.match(readme, /node --test projects\/scuttle\/scuttle\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #253 features Scuttle; Stopcock stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 253);
  assert.equal(catalog.products[0].name, "Scuttle");
  assert.equal(catalog.products[0].slug, "scuttle");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/scuttle/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /03:50/);
  assert.match(catalog.products[0].summary, /shipyard/);
  assert.match(catalog.products[0].summary, /#93154/);
  const stopcock = catalog.products.find((row) => row.slug === "stopcock");
  assert.ok(stopcock);
  assert.equal(stopcock.featured, false);
  const parergon = catalog.products.find((row) => row.slug === "parergon");
  assert.ok(parergon);
  assert.equal(parergon.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites scuttle to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/scuttle");
  assert.equal(vercel.rewrites[0].destination, "/projects/scuttle");
  assert.equal(vercel.rewrites[1].source, "/scuttle/");
  assert.equal(vercel.rewrites[1].destination, "/projects/scuttle");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
