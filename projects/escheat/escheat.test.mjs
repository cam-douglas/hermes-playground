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
  CLAUDE_VERSION,
  COFFER_SLIPS,
  COUSINS,
  DEAD_PID,
  ESCHEAT_WALK,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GIT_VERSION,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOCK_PATH,
  LOCK_TEXT,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  WORKTREE_BRANCH,
  analyze,
  classify,
  compareInquest,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readCoffer,
  readSeal,
  score,
  scoreGate,
  scoreWalk,
  seedDeadPid,
  seedEscheat,
  seedHold,
  seedLockUnreleased,
  seedPruneSkips,
  seedReleased,
  seedRemoveRefuses,
  seedResumeHidden,
  seedShutdownWrote,
  seedStale,
  seedWindowClose,
} from "./escheat.mjs";

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
  return fileURLToPath(new URL("./escheat.mjs", import.meta.url));
}

test("idle released is a hold; worktree lock given back on session end", () => {
  const result = analyze(seedReleased());
  assert.equal(result.verdict, "released");
  assert.equal(result.idleWord, "released");
  assert.equal(IDLE_WORD, "released");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.released, true);
  assert.equal(result.phrase, "admit released");
  assert.equal(result.windowClose, false);
  assert.equal(result.lockUnreleased, false);
  assert.equal(result.deadPid, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify released", () => {
  assert.equal(classify(emptyTicket()), "released");
  assert.equal(classify(""), "released");
  assert.equal(classify(null), "released");
  assert.equal(decide({}), "released");
});

test("#93231 seeded path scores escheat when window-close leaves a dead-PID lock", () => {
  const result = analyze(seedEscheat());
  assert.equal(result.verdict, "escheat");
  assert.equal(result.seededWord, "escheat");
  assert.equal(SEEDED_WORD, "escheat");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.escheat, true);
  assert.equal(result.phrase, "score escheat");
  assert.equal(result.windowClose, true);
  assert.equal(result.shutdownWrote, true);
  assert.equal(result.lockUnreleased, true);
  assert.equal(result.deadPid, true);
  assert.equal(result.pruneSkips, true);
  assert.equal(result.removeRefuses, true);
  assert.equal(result.resumeHidden, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is stale; named stale seed holds the path", () => {
  assert.equal(PATH_WORD, "stale");
  const result = analyze(seedStale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.pathWord, "stale");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("stale.json")), "stale");
});

test("HOLD includes released / hold", () => {
  assert.ok(HOLD.includes("released"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: window-close, lock, pid, prune, remove, resume, shutdown", () => {
  const close = analyze(seedWindowClose());
  assert.equal(close.windowClose, true);
  assert.equal(classify(readData("window-close.json")), "window-close");
  const lock = analyze(seedLockUnreleased());
  assert.equal(lock.lockUnreleased, true);
  assert.equal(classify(readData("lock-unreleased.json")), "lock-unreleased");
  const pid = analyze(seedDeadPid());
  assert.equal(pid.deadPid, true);
  assert.equal(classify(readData("dead-pid.json")), "dead-pid");
  const prune = analyze(seedPruneSkips());
  assert.equal(prune.pruneSkips, true);
  assert.equal(classify(readData("prune-skips.json")), "prune-skips");
  const remove = analyze(seedRemoveRefuses());
  assert.equal(remove.removeRefuses, true);
  assert.equal(classify(readData("remove-refuses.json")), "remove-refuses");
  const resume = analyze(seedResumeHidden());
  assert.equal(resume.resumeHidden, true);
  assert.equal(classify(readData("resume-hidden.json")), "resume-hidden");
  const shutdown = analyze(seedShutdownWrote());
  assert.equal(shutdown.shutdownWrote, true);
  assert.equal(classify(readData("shutdown-wrote.json")), "shutdown-wrote");
});

test("fixture toggle flips released vs escheat", () => {
  const released = scoreGate(readData("released.json"));
  const escheat = scoreGate(readData("escheat.json"));
  assert.equal(released.verdict, "released");
  assert.equal(escheat.verdict, "escheat");
  assert.notEqual(released.verdict, escheat.verdict);
  assert.equal(score(readData("released.json")), "released");
  assert.equal(score(readData("escheat.json")), "escheat");
  assert.equal(score(readData("93231.json")), "escheat");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("window-close.json")), "window-close");
  assert.equal(classify(readData("lock-unreleased.json")), "lock-unreleased");
  assert.equal(classify(readData("dead-pid.json")), "dead-pid");
  assert.equal(classify(readData("prune-skips.json")), "prune-skips");
  assert.equal(classify(readData("remove-refuses.json")), "remove-refuses");
  assert.equal(classify(readData("resume-hidden.json")), "resume-hidden");
  assert.equal(classify(readData("shutdown-wrote.json")), "shutdown-wrote");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published escheat walk scores escheat after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "escheat");
  assert.ok(night.escheatCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-released");
  assert.equal(idle.released, true);
  assert.equal(idle.verdict, "released");
  const close = night.rows.find((row) => row.event === "window-close");
  assert.equal(close.windowClose, true);
  const shutdown = night.rows.find((row) => row.event === "shutdown-wrote");
  assert.equal(shutdown.shutdownWrote, true);
  const lock = night.rows.find((row) => row.event === "lock-unreleased");
  assert.equal(lock.lockUnreleased, true);
  const pid = night.rows.find((row) => row.event === "dead-pid");
  assert.equal(pid.deadPid, true);
  const prune = night.rows.find((row) => row.event === "prune-skips");
  assert.equal(prune.pruneSkips, true);
  const remove = night.rows.find((row) => row.event === "remove-refuses");
  assert.equal(remove.removeRefuses, true);
  const resume = night.rows.find((row) => row.event === "resume-hidden");
  assert.equal(resume.resumeHidden, true);
  const hear = night.rows.find((row) => row.event === "escheat");
  assert.equal(hear.lockUnreleased, true);
  const path = night.rows.find((row) => row.event === "stale");
  assert.equal(path.verdict, "stale");
});

test("ESCHEAT_WALK constant matches the issue inquest walk", () => {
  assert.equal(ESCHEAT_WALK[0].event, "cue-released");
  const close = ESCHEAT_WALK.find((row) => row.event === "window-close");
  assert.equal(close.windowClose, true);
  const lock = ESCHEAT_WALK.find((row) => row.event === "lock-unreleased");
  assert.equal(lock.lockUnreleased, true);
  const hear = ESCHEAT_WALK.find((row) => row.event === "escheat");
  assert.equal(hear.deadPid, true);
  const path = ESCHEAT_WALK.find((row) => row.event === "stale");
  assert.equal(path.stale, true);
});

test("issue constants encode only #93231 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93231);
  assert.ok(ISSUE_URL.includes("93231"));
  assert.match(TITLE, /VS Code window close/);
  assert.match(TITLE, /dead PID/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:vscode"));
  assert.equal(AUTHOR, "cgopal");
  assert.equal(FILED, "2026-09-10T00:28:34Z");
  assert.equal(CLAUDE_VERSION, "2.1.118");
  assert.equal(OS, "Windows 11 Pro 10.0.26200");
  assert.equal(SURFACE, "VS Code 1.137.0 (entrypoint claude-vscode)");
  assert.equal(GIT_VERSION, "2.53.0.windows.1");
  assert.equal(DEAD_PID, 75688);
  assert.equal(LOCK_TEXT, "claude session feature-branch (pid 75688)");
  assert.equal(LOCK_PATH, ".git/worktrees/feature-branch/locked");
  assert.equal(WORKTREE_BRANCH, "worktree-feature-branch");
  assert.equal(COFFER_SLIPS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("bridge-session"));
  assert.ok(FINGERPRINT_LINES.includes("last-prompt"));
  assert.match(PHRASE, /window-close shutdown leaves the git worktree lock/);
  assert.match(PHRASE, /escheat never stays released/);
  assert.ok(HOLD.includes("released"));
  assert.ok(ALARM.includes("escheat"));
  assert.ok(ALARM.includes("stale"));
  assert.ok(CHIPS.includes("window-close"));
  assert.ok(VERDICTS.includes("walk"));
  assert.ok(VERDICTS.includes("backups"));
  assert.ok(VERDICTS.includes("lock-unreleased"));
  assert.ok(VERDICTS.includes("dead-pid"));
  assert.ok(VERDICTS.includes("prune-skips"));
  assert.ok(VERDICTS.includes("remove-refuses"));
  assert.ok(VERDICTS.includes("resume-hidden"));
  assert.ok(VERDICTS.includes("shutdown-wrote"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "freehold",
    "mortmain",
    "phantom",
    "trunked",
    "strowger",
    "exchanged",
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

test("restoring a released lock flips escheat to released", () => {
  const tape = {
    released: true,
    windowClose: false,
    lockUnreleased: false,
    deadPid: false,
    pruneSkips: false,
    removeRefuses: false,
    cue: "released",
  };
  assert.equal(scoreGate(tape).verdict, "released");
  tape.released = false;
  tape.windowClose = true;
  tape.lockUnreleased = true;
  tape.deadPid = true;
  tape.pruneSkips = true;
  tape.removeRefuses = true;
  tape.cue = "escheat";
  assert.equal(scoreGate(tape).verdict, "escheat");
  tape.released = true;
  tape.windowClose = false;
  tape.lockUnreleased = false;
  tape.deadPid = false;
  tape.pruneSkips = false;
  tape.removeRefuses = false;
  tape.cue = "released";
  assert.equal(scoreGate(tape).verdict, "released");
});

test("coffer lists orphan slips; seal takes on window-close + dead PID", () => {
  const coffer = readCoffer();
  assert.equal(coffer.slips, 3);
  assert.ok(coffer.paths.includes(".git/worktrees/feature-branch/locked"));
  assert.equal(coffer.deadPid, 75688);
  assert.equal(coffer.lockText, "claude session feature-branch (pid 75688)");
  const live = readSeal({
    windowClose: false,
    lockUnreleased: false,
    deadPid: false,
  });
  assert.equal(live.released, true);
  assert.equal(live.lamp, "released");
  const cut = readSeal({
    windowClose: true,
    lockUnreleased: true,
    deadPid: true,
  });
  assert.equal(cut.released, false);
  assert.equal(cut.lamp, "escheat");
  assert.equal(cut.pid, 75688);
  const inquest = compareInquest({
    windowClose: true,
    lockUnreleased: true,
    deadPid: true,
  });
  assert.equal(inquest.crownTakes, true);
  assert.equal(inquest.cue, "escheat");
  const idle = compareInquest({ windowClose: false });
  assert.equal(idle.crownTakes, false);
  assert.equal(idle.cue, "released");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [79888, 51643, 77268, 84787, 89199, 28546],
  );
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 79888);
  assert.equal(COUSINS[1].issue, 51643);
  assert.equal(COUSINS[5].issue, 28546);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("derby"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.equal(classify(cousins), "cousins");
  const backups = readData("backups.json");
  assert.equal(backups.verdict, "backups");
  assert.deepEqual(
    backups.backupsCiteOnly.map((row) => row.issue),
    [93219, 93207, 93198, 93177, 93210],
  );
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93219);
  assert.equal(classify(backups), "backups");
});

test("has-repro encodes published window-close / dead-PID walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /window/);
  assert.match(repro.note, /75688/);
  assert.match(repro.note, /cgopal/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const released = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/released.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const escheat = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/escheat.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(released.status, 0, released.stderr);
  assert.equal(escheat.status, 0, escheat.stderr);
  assert.equal(JSON.parse(released.stdout).verdict, "released");
  assert.equal(JSON.parse(escheat.stdout).verdict, "escheat");
});

test("handle exposes published hypothesis and #93231 headline", () => {
  const result = handle(readData("93231.json"));
  assert.equal(result.published.issue, 93231);
  assert.equal(result.published.claudeVersion, "2.1.118");
  assert.equal(result.published.deadPid, 75688);
  assert.equal(result.published.lockText, "claude session feature-branch (pid 75688)");
  assert.deepEqual(result.published.cousins, [79888, 51643, 77268, 84787, 89199, 28546]);
  assert.deepEqual(result.published.backups, [93219, 93207, 93198, 93177, 93210]);
  assert.match(result.published.hypothesis, /window-close/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedEscheat()),
    /escheat\|window=close\|shutdown=wrote\|lock=unreleased\|pid=dead\|prune=skips\|remove=refuses/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an escheat chamber, not a muniment room or ash-heap", () => {
  const page = readPage();
  assert.match(page, /Cardo/);
  assert.match(page, /Figtree/);
  assert.match(page, /Fragment Mono/);
  assert.match(page, /escheat chamber|escheator|inquisition|struck PID|orphan worktree|iron coffer|twilight/i);
  assert.match(page, /#0f1a22|#17303a|#1f3d48/);
  assert.match(page, /#d2e0d8|#c24e32|#3aa89a/);
  assert.match(page, /released/);
  assert.match(page, /escheat/);
  assert.match(page, /stale/);
  assert.match(page, /score escheat or admit released/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /12:50/);
  assert.match(page, /#260/);
  assert.match(page, /#93231/);
  assert.match(page, /75688/);
  assert.match(page, /bridge-session/);
  assert.match(page, /last-prompt/);
  assert.match(page, /feature-branch/);
  assert.match(page, /cgopal/);
  assert.match(page, /2\.1\.118/);
  assert.match(page, /1\.137\.0/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Playfair|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#16110c/);
  assert.doesNotMatch(page, /#241c14/);
  assert.doesNotMatch(page, /#32281e/);
  assert.doesNotMatch(page, /#cbb892/);
  assert.doesNotMatch(page, /#9a2434/);
  assert.doesNotMatch(page, /#c4a04a/);
  assert.doesNotMatch(page, /#3a2414/);
  assert.doesNotMatch(page, /#c8b89a/);
  assert.doesNotMatch(page, /#8a6a42/);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber|soil umber/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /racecourse|starting-gate|photo-finish|paddock|silk/i);
  assert.doesNotMatch(page, /masquerade|filigree|vizard atelier/i);
  assert.doesNotMatch(page, /ON.?AIR|vu-meter|copper mic/i);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bfreehold\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bphantom\b/);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\btokenized\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bunmasked\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bscratched\b/);
  assert.doesNotMatch(page, /\bderby\b/);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Derby/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Escheat/);
  assert.match(readme, /#93231/);
  assert.match(readme, /released/);
  assert.match(readme, /escheat/);
  assert.match(readme, /stale/);
  assert.match(readme, /Cardo/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Derby/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/escheat/);
  assert.match(readme, /node --test projects\/escheat\/escheat\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /bridge-session/);
  assert.match(readme, /75688/);
});

test("catalog #260 features Escheat; Mortmain stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 260);
  assert.equal(catalog.products[0].name, "Escheat");
  assert.equal(catalog.products[0].slug, "escheat");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/escheat/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /12:50/);
  assert.match(catalog.products[0].summary, /escheat/);
  assert.match(catalog.products[0].summary, /#93231/);
  assert.match(catalog.products[0].summary, /released/);
  const mortmain = catalog.products.find((row) => row.slug === "mortmain");
  assert.ok(mortmain);
  assert.equal(mortmain.featured, false);
  const midden = catalog.products.find((row) => row.slug === "midden");
  assert.ok(midden);
  assert.equal(midden.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "escheat").length, 1);
});

test("vercel rewrites escheat to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/escheat");
  assert.equal(vercel.rewrites[0].destination, "/projects/escheat");
  assert.equal(vercel.rewrites[1].source, "/escheat/");
  assert.equal(vercel.rewrites[1].destination, "/projects/escheat");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
