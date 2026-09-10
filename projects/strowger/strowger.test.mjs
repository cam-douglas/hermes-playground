import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BUNDLED_VERSIONS,
  CHIPS,
  CLI_TOOL_COUNT,
  COUSINS,
  DESKTOP_VERSION,
  DISALLOWED_FLAG,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FIRST_BROKEN,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_WORKING,
  LISTAGENTS_DESCRIPTION,
  NOT_PRODUCTS,
  PATH_WORD,
  PEER_DIRECTORY,
  PHRASE,
  SEEDED_WORD,
  SIX_MECHANISMS,
  STATE,
  STROWGER_WALK,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  compareExchange,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readDirectory,
  readTrunk,
  score,
  scoreGate,
  scoreWalk,
  seedCliStillHasTool,
  seedDisallowedTools,
  seedExchanged,
  seedHold,
  seedLauncherOnly,
  seedListagentsLists,
  seedNotifyWhenIdleGone,
  seedSendmessageCut,
  seedSixMechanisms,
  seedStrowger,
  seedTrunked,
} from "./strowger.mjs";

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
  return fileURLToPath(new URL("./strowger.mjs", import.meta.url));
}

test("idle trunked is a hold; SendMessage present; peers addressable", () => {
  const result = analyze(seedTrunked());
  assert.equal(result.verdict, "trunked");
  assert.equal(result.idleWord, "trunked");
  assert.equal(IDLE_WORD, "trunked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.trunked, true);
  assert.equal(result.phrase, "admit trunked");
  assert.equal(result.sendMessagePresent, true);
  assert.equal(result.peersAddressable, true);
  assert.equal(result.notifyWhenIdle, true);
  assert.equal(result.sendMessageCut, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify trunked", () => {
  assert.equal(classify(emptyTicket()), "trunked");
  assert.equal(classify(""), "trunked");
  assert.equal(classify(null), "trunked");
  assert.equal(decide({}), "trunked");
});

test("#93218 seeded path scores strowger when Desktop cuts SendMessage while ListAgents lists", () => {
  const result = analyze(seedStrowger());
  assert.equal(result.verdict, "strowger");
  assert.equal(result.seededWord, "strowger");
  assert.equal(SEEDED_WORD, "strowger");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.strowger, true);
  assert.equal(result.phrase, "score strowger");
  assert.equal(result.desktopLauncher, true);
  assert.equal(result.disallowedTools, true);
  assert.equal(result.listAgentsLists, true);
  assert.equal(result.sendMessageCut, true);
  assert.equal(result.sixMechanismsGone, true);
  assert.equal(result.cliStillHasTool, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is exchanged; named exchanged seed holds the path", () => {
  assert.equal(PATH_WORD, "exchanged");
  const result = analyze(seedExchanged());
  assert.equal(result.verdict, "exchanged");
  assert.equal(result.pathWord, "exchanged");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("exchanged.json")), "exchanged");
});

test("HOLD includes trunked / hold", () => {
  assert.ok(HOLD.includes("trunked"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: cut, lists, disallowed, notify, six, launcher, cli", () => {
  const cut = analyze(seedSendmessageCut());
  assert.equal(cut.sendMessageCut, true);
  assert.equal(classify(readData("sendmessage-cut.json")), "sendmessage-cut");
  const lists = analyze(seedListagentsLists());
  assert.equal(lists.listAgentsLists, true);
  assert.equal(classify(readData("listagents-lists.json")), "listagents-lists");
  const flag = analyze(seedDisallowedTools());
  assert.equal(flag.disallowedTools, true);
  assert.equal(classify(readData("disallowed-tools.json")), "disallowed-tools");
  const notify = analyze(seedNotifyWhenIdleGone());
  assert.equal(notify.notifyWhenIdleGone, true);
  assert.equal(classify(readData("notify-when-idle-gone.json")), "notify-when-idle-gone");
  const six = analyze(seedSixMechanisms());
  assert.equal(six.sixMechanismsGone, true);
  assert.equal(classify(readData("six-mechanisms.json")), "six-mechanisms");
  const launcher = analyze(seedLauncherOnly());
  assert.equal(launcher.launcherOnly, true);
  assert.equal(classify(readData("launcher-only.json")), "launcher-only");
  const cli = analyze(seedCliStillHasTool());
  assert.equal(cli.cliStillHasTool, true);
  assert.equal(classify(readData("cli-still-has-tool.json")), "cli-still-has-tool");
});

test("fixture toggle flips trunked vs strowger", () => {
  const trunked = scoreGate(readData("trunked.json"));
  const strowger = scoreGate(readData("strowger.json"));
  assert.equal(trunked.verdict, "trunked");
  assert.equal(strowger.verdict, "strowger");
  assert.notEqual(trunked.verdict, strowger.verdict);
  assert.equal(score(readData("trunked.json")), "trunked");
  assert.equal(score(readData("strowger.json")), "strowger");
  assert.equal(score(readData("93218.json")), "strowger");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("sendmessage-cut.json")), "sendmessage-cut");
  assert.equal(classify(readData("listagents-lists.json")), "listagents-lists");
  assert.equal(classify(readData("disallowed-tools.json")), "disallowed-tools");
  assert.equal(classify(readData("notify-when-idle-gone.json")), "notify-when-idle-gone");
  assert.equal(classify(readData("six-mechanisms.json")), "six-mechanisms");
  assert.equal(classify(readData("launcher-only.json")), "launcher-only");
  assert.equal(classify(readData("cli-still-has-tool.json")), "cli-still-has-tool");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published strowger walk scores strowger after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "strowger");
  assert.ok(night.strowgerCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-trunked");
  assert.equal(idle.trunked, true);
  assert.equal(idle.verdict, "trunked");
  const launch = night.rows.find((row) => row.event === "desktop-launcher");
  assert.equal(launch.desktopLauncher, true);
  const flag = night.rows.find((row) => row.event === "disallowed-tools");
  assert.equal(flag.disallowedTools, true);
  const lists = night.rows.find((row) => row.event === "listagents-lists");
  assert.equal(lists.listAgentsLists, true);
  const cut = night.rows.find((row) => row.event === "sendmessage-cut");
  assert.equal(cut.sendMessageCut, true);
  const six = night.rows.find((row) => row.event === "six-mechanisms");
  assert.equal(six.sixMechanismsGone, true);
  const cli = night.rows.find((row) => row.event === "cli-still-has-tool");
  assert.equal(cli.cliStillHasTool, true);
  const hear = night.rows.find((row) => row.event === "strowger");
  assert.equal(hear.sendMessageCut, true);
  const path = night.rows.find((row) => row.event === "exchanged");
  assert.equal(path.verdict, "exchanged");
});

test("STROWGER_WALK constant matches the issue cut-trunk walk", () => {
  assert.equal(STROWGER_WALK[0].event, "cue-trunked");
  const launch = STROWGER_WALK.find((row) => row.event === "desktop-launcher");
  assert.equal(launch.desktopLauncher, true);
  const flag = STROWGER_WALK.find((row) => row.event === "disallowed-tools");
  assert.equal(flag.flag, "--disallowedTools SendMessage");
  const lists = STROWGER_WALK.find((row) => row.event === "listagents-lists");
  assert.equal(lists.listAgentsLists, true);
  const hear = STROWGER_WALK.find((row) => row.event === "strowger");
  assert.equal(hear.sendMessageCut, true);
  const path = STROWGER_WALK.find((row) => row.event === "exchanged");
  assert.equal(path.exchanged, true);
});

test("issue constants encode only #93218 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93218);
  assert.ok(ISSUE_URL.includes("93218"));
  assert.match(TITLE, /disallowedTools/);
  assert.match(TITLE, /ListAgents/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:tools"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(AUTHOR, "harry930216");
  assert.equal(FILED, "2026-09-09T22:59:43Z");
  assert.equal(LAST_WORKING, "2.1.258");
  assert.equal(FIRST_BROKEN, "2.1.260");
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.deepEqual([...BUNDLED_VERSIONS], ["2.1.258", "2.1.260"]);
  assert.equal(CLI_TOOL_COUNT, 44);
  assert.equal(DISALLOWED_FLAG, "--disallowedTools SendMessage");
  assert.match(LISTAGENTS_DESCRIPTION, /SendMessage/);
  assert.equal(PEER_DIRECTORY.length, 3);
  assert.equal(SIX_MECHANISMS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("--disallowedTools SendMessage"));
  assert.match(PHRASE, /ListAgents still lists peers/);
  assert.match(PHRASE, /strowger never stays trunked/);
  assert.ok(HOLD.includes("trunked"));
  assert.ok(ALARM.includes("strowger"));
  assert.ok(ALARM.includes("exchanged"));
  assert.ok(CHIPS.includes("six-mechanisms"));
  assert.ok(VERDICTS.includes("walk"));
  assert.ok(VERDICTS.includes("backups"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "tokenized",
    "mondegreen",
    "parsed",
    "locked",
    "scratched",
    "derby",
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "deadair",
    "squelch",
    "moored",
    "scuttled",
    "scuttle",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "fresh",
    "stamped",
    "cleared",
    "mounded",
    "corked",
    "relayed",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring SendMessage flips strowger to trunked", () => {
  const tape = {
    trunked: true,
    sendMessagePresent: true,
    peersAddressable: true,
    notifyWhenIdle: true,
    desktopLauncher: false,
    disallowedTools: false,
    listAgentsLists: false,
    sendMessageCut: false,
    cue: "trunked",
  };
  assert.equal(scoreGate(tape).verdict, "trunked");
  tape.trunked = false;
  tape.sendMessagePresent = false;
  tape.peersAddressable = false;
  tape.notifyWhenIdle = false;
  tape.desktopLauncher = true;
  tape.disallowedTools = true;
  tape.listAgentsLists = true;
  tape.sendMessageCut = true;
  tape.cue = "strowger";
  assert.equal(scoreGate(tape).verdict, "strowger");
  tape.trunked = true;
  tape.sendMessagePresent = true;
  tape.peersAddressable = true;
  tape.notifyWhenIdle = true;
  tape.desktopLauncher = false;
  tape.disallowedTools = false;
  tape.listAgentsLists = false;
  tape.sendMessageCut = false;
  tape.cue = "trunked";
  assert.equal(scoreGate(tape).verdict, "trunked");
});

test("directory lists peers and names SendMessage; trunk lamp cuts on desktop", () => {
  const directory = readDirectory();
  assert.equal(directory.listed, 3);
  assert.ok(directory.names.includes("charter-f1"));
  assert.ok(directory.names.includes("<bg probe>"));
  assert.match(directory.address, /SendMessage/);
  const live = readTrunk({ desktopLauncher: false, disallowedTools: false });
  assert.equal(live.present, true);
  assert.equal(live.lamp, "trunked");
  const cut = readTrunk({ desktopLauncher: true, disallowedTools: true });
  assert.equal(cut.present, false);
  assert.equal(cut.lamp, "cut");
  assert.equal(cut.flag, "--disallowedTools SendMessage");
  const exchange = compareExchange({ desktopLauncher: true, disallowedTools: true });
  assert.equal(exchange.cutWhileListed, true);
  assert.equal(exchange.cue, "strowger");
  const idle = compareExchange({ desktopLauncher: false });
  assert.equal(idle.cutWhileListed, false);
  assert.equal(idle.cue, "trunked");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [92646, 92249, 90481],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 92646);
  assert.equal(COUSINS[1].issue, 92249);
  assert.equal(COUSINS[2].issue, 90481);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("derby"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("speakpipe"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("deadlight"));
  assert.equal(classify(cousins), "cousins");
  const backups = readData("backups.json");
  assert.equal(backups.verdict, "backups");
  assert.deepEqual(
    backups.backupsCiteOnly.map((row) => row.issue),
    [93219, 93207, 93182],
  );
  assert.equal(BACKUPS.length, 3);
  assert.equal(BACKUPS[0].issue, 93219);
  assert.equal(classify(backups), "backups");
});

test("has-repro encodes published Desktop --disallowedTools walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /disallowedTools/);
  assert.match(repro.note, /ListAgents/);
  assert.match(repro.note, /harry930216/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const trunked = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/trunked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const strowger = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/strowger.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(trunked.status, 0, trunked.stderr);
  assert.equal(strowger.status, 0, strowger.stderr);
  assert.equal(JSON.parse(trunked.stdout).verdict, "trunked");
  assert.equal(JSON.parse(strowger.stdout).verdict, "strowger");
});

test("handle exposes published hypothesis and #93218 headline", () => {
  const result = handle(readData("93218.json"));
  assert.equal(result.published.issue, 93218);
  assert.equal(result.published.lastWorking, "2.1.258");
  assert.equal(result.published.firstBroken, "2.1.260");
  assert.equal(result.published.cliToolCount, 44);
  assert.equal(result.published.disallowedFlag, "--disallowedTools SendMessage");
  assert.deepEqual(result.published.cousins, [92646, 92249, 90481]);
  assert.deepEqual(result.published.backups, [93219, 93207, 93182]);
  assert.match(result.published.hypothesis, /--disallowedTools SendMessage/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedStrowger()),
    /strowger\|launch=desktop\|flag=disallowed\|dir=lists\|trunk=cut\|mech=six-dead\|cli=44/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Strowger exchange booth, not a ballad sheet or racecourse", () => {
  const page = readPage();
  assert.match(page, /Syne/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /switchboard|exchange|strowger|directory|trunk|selector/i);
  assert.match(page, /#07090d|#10151c|#181f28/);
  assert.match(page, /#c8963e|#e39b24|#efe3c4|#e23b3b/);
  assert.match(page, /trunked/);
  assert.match(page, /strowger/);
  assert.match(page, /exchanged/);
  assert.match(page, /score strowger or admit trunked/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /10:50/);
  assert.match(page, /#258/);
  assert.match(page, /#93218/);
  assert.match(page, /--disallowedTools SendMessage/);
  assert.match(page, /ListAgents/);
  assert.match(page, /notify_when_idle/);
  assert.match(page, /charter-f1/);
  assert.match(page, /2\.1\.258/);
  assert.match(page, /2\.1\.260/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Playfair|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#120e18/);
  assert.doesNotMatch(page, /#1b1526/);
  assert.doesNotMatch(page, /#241c32/);
  assert.doesNotMatch(page, /#d4b46a/);
  assert.doesNotMatch(page, /#c45a78/);
  assert.doesNotMatch(page, /#7eb8a4/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /ON.?AIR|vu-meter|copper mic/i);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /masquerade|filigree|vizard atelier/i);
  assert.doesNotMatch(page, /racecourse|starting-gate|photo-finish|paddock|silk/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\btokenized\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bparsed\b/);
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bsquelch\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bunmasked\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\blocked\b/);
  assert.doesNotMatch(page, /\bscratched\b/);
  assert.doesNotMatch(page, /\bderby\b/);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Derby/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Speakpipe/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Annunciator/i);
  assert.match(page, /NOT Deadlight/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Strowger/);
  assert.match(readme, /#93218/);
  assert.match(readme, /trunked/);
  assert.match(readme, /strowger/);
  assert.match(readme, /exchanged/);
  assert.match(readme, /Syne/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Derby/i);
  assert.match(readme, /NOT Vizard/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /NOT Speakpipe/i);
  assert.match(readme, /NOT Aphonia/i);
  assert.match(readme, /NOT Annunciator/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/strowger/);
  assert.match(readme, /node --test projects\/strowger\/strowger\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /--disallowedTools SendMessage/);
  assert.match(readme, /ListAgents/);
});

test("catalog #258 features Strowger; Mondegreen stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 258);
  assert.equal(catalog.products[0].name, "Strowger");
  assert.equal(catalog.products[0].slug, "strowger");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/strowger/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /10:50/);
  assert.match(catalog.products[0].summary, /strowger/);
  assert.match(catalog.products[0].summary, /#93218/);
  assert.match(catalog.products[0].summary, /trunked/);
  const mondegreen = catalog.products.find((row) => row.slug === "mondegreen");
  assert.ok(mondegreen);
  assert.equal(mondegreen.featured, false);
  const derby = catalog.products.find((row) => row.slug === "derby");
  assert.ok(derby);
  assert.equal(derby.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "strowger").length, 1);
});

test("vercel rewrites strowger to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/strowger");
  assert.equal(vercel.rewrites[0].destination, "/projects/strowger");
  assert.equal(vercel.rewrites[1].source, "/strowger/");
  assert.equal(vercel.rewrites[1].destination, "/projects/strowger");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
