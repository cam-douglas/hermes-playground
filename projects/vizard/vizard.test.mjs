import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARGUMENTS_EXAMPLE,
  CHIPS,
  CLI,
  COMMAND_FILE,
  COMPANION_WORK,
  COUSINS,
  DESKTOP,
  DESKTOP_BUILT,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PLANNING_SKILL,
  PROJECT_MARK,
  REMOTE_SPAWN,
  SEEDED_WORD,
  SHELL,
  STATE,
  TITLE,
  VERDICTS,
  VIZARD_WALK,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedArgumentsUnsent,
  seedBuiltInPlanMode,
  seedClientSideIntercept,
  seedCompanionWork,
  seedNoRoundTrip,
  seedPrecedence,
  seedProjectCommand,
  seedReadOnlyWrongMode,
  seedRemoteControlDesktop,
  seedUnmasked,
  seedVizard,
} from "./vizard.mjs";

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
  return fileURLToPath(new URL("./vizard.mjs", import.meta.url));
}

test("idle unmasked is a hold; project /plan wins with (project)", () => {
  const result = analyze(seedUnmasked());
  assert.equal(result.verdict, "unmasked");
  assert.equal(result.idleWord, "unmasked");
  assert.equal(IDLE_WORD, "unmasked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unmasked, true);
  assert.equal(result.phrase, "admit unmasked");
  assert.equal(result.projectCommandWins, true);
  assert.equal(result.descriptionShowsProject, true);
  assert.equal(result.builtInPlanMode, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify unmasked", () => {
  assert.equal(classify(emptyTicket()), "unmasked");
  assert.equal(classify(""), "unmasked");
  assert.equal(classify(null), "unmasked");
  assert.equal(decide({}), "unmasked");
});

test("#93190 seeded path scores vizard when Desktop intercepts /plan", () => {
  const result = analyze(seedVizard());
  assert.equal(result.verdict, "vizard");
  assert.equal(result.seededWord, "vizard");
  assert.equal(SEEDED_WORD, "vizard");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.vizard, true);
  assert.equal(result.phrase, "score vizard");
  assert.equal(result.builtInPlanMode, true);
  assert.equal(result.slashStripped, true);
  assert.equal(result.argumentsUnsent, true);
  assert.equal(result.noRoundTrip, true);
  assert.equal(result.clientSideIntercept, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is precedence; named precedence seed holds the path", () => {
  assert.equal(PATH_WORD, "precedence");
  const result = analyze(seedPrecedence());
  assert.equal(result.verdict, "precedence");
  assert.equal(result.pathWord, "precedence");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("precedence.json")), "precedence");
});

test("HOLD includes unmasked / project-command / hold", () => {
  assert.ok(HOLD.includes("unmasked"));
  assert.ok(HOLD.includes("project-command"));
  assert.ok(HOLD.includes("hold"));
  const project = analyze(seedProjectCommand());
  assert.equal(project.verdict, "project-command");
  assert.equal(project.hold, true);
  assert.equal(classify(readData("project-command.json")), "project-command");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: plan mode, intercept, desktop, args, trip, readonly, work", () => {
  const mode = analyze(seedBuiltInPlanMode());
  assert.equal(mode.builtInPlanMode, true);
  assert.equal(classify(readData("built-in-plan-mode.json")), "built-in-plan-mode");
  const intercept = analyze(seedClientSideIntercept());
  assert.equal(intercept.clientSideIntercept, true);
  assert.equal(classify(readData("client-side-intercept.json")), "client-side-intercept");
  const desktop = analyze(seedRemoteControlDesktop());
  assert.equal(desktop.remoteControlDesktop, true);
  assert.equal(classify(readData("remote-control-desktop.json")), "remote-control-desktop");
  const args = analyze(seedArgumentsUnsent());
  assert.equal(args.argumentsUnsent, true);
  assert.equal(classify(readData("arguments-unsent.json")), "arguments-unsent");
  const trip = analyze(seedNoRoundTrip());
  assert.equal(trip.noRoundTrip, true);
  assert.equal(classify(readData("no-round-trip.json")), "no-round-trip");
  const readonly = analyze(seedReadOnlyWrongMode());
  assert.equal(readonly.planModeReadOnly, true);
  assert.equal(classify(readData("read-only-wrong-mode.json")), "read-only-wrong-mode");
  const work = analyze(seedCompanionWork());
  assert.equal(work.companionWork, true);
  assert.equal(classify(readData("companion-work.json")), "companion-work");
});

test("fixture toggle flips unmasked vs vizard", () => {
  const unmasked = scoreGate(readData("unmasked.json"));
  const vizard = scoreGate(readData("vizard.json"));
  assert.equal(unmasked.verdict, "unmasked");
  assert.equal(vizard.verdict, "vizard");
  assert.notEqual(unmasked.verdict, vizard.verdict);
  assert.equal(score(readData("unmasked.json")), "unmasked");
  assert.equal(score(readData("vizard.json")), "vizard");
  assert.equal(score(readData("93190.json")), "vizard");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("built-in-plan-mode.json")), "built-in-plan-mode");
  assert.equal(classify(readData("client-side-intercept.json")), "client-side-intercept");
  assert.equal(classify(readData("remote-control-desktop.json")), "remote-control-desktop");
  assert.equal(classify(readData("arguments-unsent.json")), "arguments-unsent");
  assert.equal(classify(readData("no-round-trip.json")), "no-round-trip");
  assert.equal(classify(readData("read-only-wrong-mode.json")), "read-only-wrong-mode");
  assert.equal(classify(readData("companion-work.json")), "companion-work");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("project-command.json")), "project-command");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published vizard walk scores vizard after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "vizard");
  assert.ok(night.vizardCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-unmasked");
  assert.equal(idle.projectCommandWins, true);
  assert.equal(idle.verdict, "unmasked");
  const project = night.rows.find((row) => row.event === "project-command");
  assert.equal(project.commandFile, ".claude/commands/plan.md");
  const intercept = night.rows.find((row) => row.event === "client-side-intercept");
  assert.equal(intercept.clientSideIntercept, true);
  const mode = night.rows.find((row) => row.event === "built-in-plan-mode");
  assert.equal(mode.builtInPlanMode, true);
  const stripped = night.rows.find((row) => row.event === "slash-stripped");
  assert.equal(stripped.slashStripped, true);
  const args = night.rows.find((row) => row.event === "arguments-unsent");
  assert.equal(args.argumentsExample, "foo bar");
  const trip = night.rows.find((row) => row.event === "no-round-trip");
  assert.equal(trip.noRoundTrip, true);
  const mask = night.rows.find((row) => row.event === "vizard");
  assert.equal(mask.builtInPlanMode, true);
  const path = night.rows.find((row) => row.event === "precedence");
  assert.equal(path.verdict, "precedence");
});

test("VIZARD_WALK constant matches the issue intercept walk", () => {
  assert.equal(VIZARD_WALK[0].event, "cue-unmasked");
  const project = VIZARD_WALK.find((row) => row.event === "project-command");
  assert.equal(project.commandFile, ".claude/commands/plan.md");
  assert.equal(project.planningSkill, "planning");
  const cli = VIZARD_WALK.find((row) => row.event === "cli-project");
  assert.equal(cli.argumentsExample, "foo bar");
  const desktop = VIZARD_WALK.find((row) => row.event === "remote-control-desktop");
  assert.equal(desktop.remoteSpawn, "claude --remote-control --spawn worktree");
  const intercept = VIZARD_WALK.find((row) => row.event === "client-side-intercept");
  assert.equal(intercept.noRoundTrip, true);
  const mode = VIZARD_WALK.find((row) => row.event === "built-in-plan-mode");
  assert.equal(mode.planModeReadOnly, true);
  const work = VIZARD_WALK.find((row) => row.event === "companion-work");
  assert.equal(work.companion, "/work <slug>");
});

test("issue constants encode only #93190 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93190);
  assert.ok(ISSUE_URL.includes("93190"));
  assert.match(TITLE, /Desktop app resolves \/plan to built-in plan mode/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:skills"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.match(CLI, /2\.1\.266/);
  assert.match(DESKTOP, /1\.49585\.0/);
  assert.match(DESKTOP, /41ad1d/);
  assert.equal(DESKTOP_BUILT, "2026-09-08");
  assert.equal(OS, "Windows 11 Pro 23H2 22631.3155");
  assert.equal(SHELL, "PowerShell");
  assert.equal(COMMAND_FILE, ".claude/commands/plan.md");
  assert.equal(PLANNING_SKILL, "planning");
  assert.equal(COMPANION_WORK, "/work <slug>");
  assert.equal(REMOTE_SPAWN, "claude --remote-control --spawn worktree");
  assert.equal(ARGUMENTS_EXAMPLE, "foo bar");
  assert.equal(PROJECT_MARK, "(project)");
  assert.ok(FINGERPRINT_LINES.includes("/plan stripped"));
  assert.match(PHRASE, /vizard over the project's command/);
  assert.ok(HOLD.includes("unmasked"));
  assert.ok(ALARM.includes("vizard"));
  assert.ok(ALARM.includes("precedence"));
  assert.ok(CHIPS.includes("client-side-intercept"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
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

test("restoring project precedence flips vizard to unmasked", () => {
  const tape = {
    projectCommandWins: true,
    descriptionShowsProject: true,
    argumentsRun: true,
    builtInPlanMode: false,
    slashStripped: false,
    argumentsUnsent: false,
    noRoundTrip: false,
    clientSideIntercept: false,
    cue: "unmasked",
  };
  assert.equal(scoreGate(tape).verdict, "unmasked");
  tape.projectCommandWins = false;
  tape.descriptionShowsProject = false;
  tape.argumentsRun = false;
  tape.builtInPlanMode = true;
  tape.slashStripped = true;
  tape.argumentsUnsent = true;
  tape.noRoundTrip = true;
  tape.clientSideIntercept = true;
  tape.cue = "vizard";
  assert.equal(scoreGate(tape).verdict, "vizard");
  tape.projectCommandWins = true;
  tape.descriptionShowsProject = true;
  tape.argumentsRun = true;
  tape.builtInPlanMode = false;
  tape.slashStripped = false;
  tape.argumentsUnsent = false;
  tape.noRoundTrip = false;
  tape.clientSideIntercept = false;
  tape.cue = "unmasked";
  assert.equal(scoreGate(tape).verdict, "unmasked");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [82676, 89398, 85654, 68252, 68102, 29156, 28379, 92138],
  );
  assert.equal(COUSINS.length, 8);
  assert.equal(COUSINS[0].issue, 82676);
  assert.equal(COUSINS[7].issue, 92138);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("understudy"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("trompe"));
  assert.ok(NOT_PRODUCTS.includes("homonym"));
  assert.ok(NOT_PRODUCTS.includes("shibboleth"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published windows desktop walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /2\.1\.266/);
  assert.match(repro.note, /1\.49585\.0/);
  assert.match(repro.note, /Windows 11 Pro 23H2/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const unmasked = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unmasked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const vizard = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/vizard.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(unmasked.status, 0, unmasked.stderr);
  assert.equal(vizard.status, 0, vizard.stderr);
  assert.equal(JSON.parse(unmasked.stdout).verdict, "unmasked");
  assert.equal(JSON.parse(vizard.stdout).verdict, "vizard");
});

test("handle exposes published hypothesis and #93190 headline", () => {
  const result = handle(readData("93190.json"));
  assert.equal(result.published.issue, 93190);
  assert.equal(result.published.cli, "Claude Code CLI 2.1.266");
  assert.equal(result.published.desktop, "Claude Desktop Windows 1.49585.0 (41ad1d)");
  assert.equal(result.published.commandFile, ".claude/commands/plan.md");
  assert.equal(result.published.argumentsExample, "foo bar");
  assert.deepEqual(result.published.cousins, [
    82676, 89398, 85654, 68252, 68102, 29156, 28379, 92138,
  ]);
  assert.match(result.published.hypothesis, /hard-binds \/plan/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedVizard()),
    /vizard\|project=lost\|mode=plan\|slash=stripped\|args=unsent\|trip=none/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a masquerade atelier, not a radio studio or shipyard", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Karla/);
  assert.match(page, /Azeret Mono/);
  assert.match(page, /masquerade|atelier|vizard|filigree|velvet/i);
  assert.match(page, /#2a0814|#3a0c1c|#4a1024/);
  assert.match(page, /#7a1428|#6b1220|#8b1a30/);
  assert.match(page, /#e6c36a|#dfc07a|#f0d78c|#e8c872/);
  assert.match(page, /#f3ead6|#f7f0dc|#f4ecd8/);
  assert.match(page, /unmasked/);
  assert.match(page, /vizard/);
  assert.match(page, /precedence/);
  assert.match(page, /score vizard or admit unmasked/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /06:50/);
  assert.match(page, /#255/);
  assert.match(page, /#93190/);
  assert.match(page, /\.claude\/commands\/plan\.md/);
  assert.match(page, /\(project\)/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /2\.1\.266/);
  assert.match(page, /foo bar/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Manrope|Figtree|Playfair|Outfit|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#c4a05a/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /#e8a317/);
  assert.doesNotMatch(page, /#6ee87a/);
  assert.doesNotMatch(page, /#121212/);
  assert.doesNotMatch(page, /#b87333/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#2d6a5a/);
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
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bsquelch\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
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
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Understudy/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Trompe/i);
  assert.match(page, /NOT Homonym/i);
  assert.match(page, /NOT Shibboleth/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Vizard/);
  assert.match(readme, /#93190/);
  assert.match(readme, /unmasked/);
  assert.match(readme, /vizard/);
  assert.match(readme, /precedence/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Azeret Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /NOT Scuttle/i);
  assert.match(readme, /NOT Stopcock/i);
  assert.match(readme, /NOT Parergon/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/vizard/);
  assert.match(readme, /node --test projects\/vizard\/vizard\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #255 features Vizard; Dead Air stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 255);
  assert.equal(catalog.products[0].name, "Vizard");
  assert.equal(catalog.products[0].slug, "vizard");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/vizard/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /06:50/);
  assert.match(catalog.products[0].summary, /vizard/);
  assert.match(catalog.products[0].summary, /#93190/);
  assert.match(catalog.products[0].summary, /unmasked/);
  const deadair = catalog.products.find((row) => row.slug === "deadair");
  assert.ok(deadair);
  assert.equal(deadair.featured, false);
  const scuttle = catalog.products.find((row) => row.slug === "scuttle");
  assert.ok(scuttle);
  assert.equal(scuttle.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites vizard to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/vizard");
  assert.equal(vercel.rewrites[0].destination, "/projects/vizard");
  assert.equal(vercel.rewrites[1].source, "/vizard/");
  assert.equal(vercel.rewrites[1].destination, "/projects/vizard");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
