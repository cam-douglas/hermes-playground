import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CATHEAD_WALK,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DARWIN,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  KERNEL_LOG,
  KERNEL_MINOR,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PREGROW_COUNT,
  PTMX_GROW_VECTOR,
  RESPAWN_CMD,
  SAMPLE_GAUGE,
  SAMPLE_KERNEL,
  SAMPLE_PLACEHOLDER,
  SAMPLE_RESPAWN,
  SAMPLE_TIMBER,
  SEEDED_WORD,
  SESSION_KIND,
  SPAWN_FAILURES,
  SPLIT_CMD,
  STATE,
  TEAMMATE_MODE,
  TITLE,
  TMUX_VERSION,
  VERDICTS,
  XXX_COMMENT,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectGauge,
  inspectKernel,
  inspectPlaceholder,
  inspectRespawn,
  inspectTimber,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCathead,
  seedEnxio,
  seedForkptyRace,
  seedGrowSkipped,
  seedHold,
  seedInProcessMode,
  seedPisTotal,
  seedPlaceholderCat,
  seedPregrowWorkaround,
  seedPtmxRace,
  seedRaced,
  seedRespawnKill,
  seedSeated,
  seedSlotBoundary,
  seedVector16,
  seedWaitExitOk,
} from "./cathead.mjs";

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
  return fileURLToPath(new URL("./cathead.mjs", import.meta.url));
}

test("idle seated is a hold; cathead timber holds the new pane", () => {
  const result = analyze(seedSeated());
  assert.equal(result.verdict, "seated");
  assert.equal(result.idleWord, "seated");
  assert.equal(IDLE_WORD, "seated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.seated, true);
  assert.equal(result.phrase, "admit seated");
  assert.equal(result.raced, false);
  assert.equal(result.ptmxRace, false);
  assert.equal(result.waitExit, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify seated", () => {
  assert.equal(classify(emptyTicket()), "seated");
  assert.equal(classify(""), "seated");
  assert.equal(classify(null), "seated");
  assert.equal(decide({}), "seated");
});

test("#93624 seeded path scores cathead when the placeholder races the grow", () => {
  const result = analyze(seedRaced());
  assert.equal(result.verdict, "cathead");
  assert.equal(result.seededWord, "raced");
  assert.equal(SEEDED_WORD, "raced");
  assert.equal(PRODUCT_WORD, "cathead");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.raced, true);
  assert.equal(result.phrase, "score cathead");
  assert.equal(result.placeholderCat, true);
  assert.equal(result.respawnKill, true);
  assert.equal(result.enxio, true);
  assert.equal(result.ptmxRace, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("placeholder cat plus respawn-kill is the #93624 cathead", () => {
  const timber = inspectTimber({ raced: true, enxio: true });
  assert.equal(timber.stamp, "dropped");
  assert.equal(timber.seated, false);
  const scored = scoreGate({
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    slotBoundary: true,
    growSkipped: true,
    enxio: true,
    ptmxRace: true,
    cue: "raced",
    timber: SAMPLE_TIMBER,
    placeholder: SAMPLE_PLACEHOLDER,
  });
  assert.equal(scored.verdict, "cathead");
  assert.equal(scored.ptmxRace, true);
  const calm = inspectTimber({ seated: true, waitExit: true });
  assert.equal(calm.stamp, "seated");
});

test("path word is ptmx-race; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "ptmx-race");
  const result = analyze(seedPtmxRace());
  assert.equal(result.verdict, "ptmx-race");
  assert.equal(result.pathWord, "ptmx-race");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "ptmx-race", preferSeed: true, raced: true }),
    "ptmx-race",
  );
  assert.equal(classify(seedPlaceholderCat()), "placeholder-cat");
});

test("HOLD includes seated / hold", () => {
  assert.ok(HOLD.includes("seated"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: enxio, placeholder-cat, respawn-kill, slot-boundary", () => {
  assert.equal(classify(seedEnxio()), "enxio");
  assert.equal(classify(seedPlaceholderCat()), "placeholder-cat");
  assert.equal(classify(seedRespawnKill()), "respawn-kill");
  assert.equal(classify(seedSlotBoundary()), "slot-boundary");
  assert.equal(classify(seedGrowSkipped()), "grow-skipped");
  assert.equal(classify(seedPisTotal()), "pis-total");
  assert.equal(classify(seedVector16()), "vector-16");
  assert.equal(classify(seedForkptyRace()), "forkpty-race");
  assert.equal(classify(seedWaitExitOk()), "wait-exit-ok");
  assert.equal(classify(seedPregrowWorkaround()), "pregrow-workaround");
  assert.equal(classify(seedInProcessMode()), "in-process-mode");
  assert.equal(classify(seedCathead()), "cathead");
});

test("booth fixtures flip seated vs raced vs ptmx-race vs cathead", () => {
  const idle = scoreGate(seedSeated());
  const seeded = scoreGate(seedRaced());
  const seated = readData("seated.json");
  const raced = readData("raced.json");
  const path = readData("ptmx-race.json");
  const product = readData("cathead.json");
  const enxio = readData("enxio.json");
  const coil = readData("placeholder-cat.json");
  const lever = readData("respawn-kill.json");
  const boundary = readData("slot-boundary.json");
  const skipped = readData("grow-skipped.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "seated");
  assert.equal(seeded.verdict, "cathead");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSeated()), "seated");
  assert.equal(score(seedRaced()), "cathead");
  assert.equal(seated.waitExit, true);
  assert.equal(seated.seated, true);
  assert.equal(scoreGate(seated).verdict, "seated");
  assert.equal(raced.placeholderCat, true);
  assert.equal(raced.respawnKill, true);
  assert.equal(raced.enxio, true);
  assert.equal(classify(raced), "raced");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /ptmx/);
  assert.match(path.paths[1].result, /pis_free|grow/i);
  assert.equal(classify(path), "ptmx-race");
  assert.equal(classify(product), "cathead");
  assert.equal(product.hubCount, "CATHEAD");
  assert.equal(raced.issue, 93624);
  assert.equal(raced.raced, true);
  assert.equal(classify(enxio), "enxio");
  assert.equal(classify(coil), "placeholder-cat");
  assert.equal(classify(lever), "respawn-kill");
  assert.equal(classify(boundary), "slot-boundary");
  assert.equal(classify(skipped), "grow-skipped");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("seated"));
  assert.ok(CHIPS.includes("raced"));
  assert.ok(CHIPS.includes("cathead"));
  assert.ok(CHIPS.includes("ptmx-race"));
  assert.ok(CHIPS.includes("placeholder-cat"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("raced"));
  assert.ok(ALARM.includes("ptmx-race"));
  assert.ok(ALARM.includes("placeholder-cat"));
  assert.ok(ALARM.includes("cathead"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cathead walk scores cathead after the idle hold", () => {
  const booth = scoreWalk({ rows: CATHEAD_WALK });
  assert.equal(booth.verdict, "cathead");
  assert.ok(booth.racedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-seated");
  assert.equal(idle.seated, true);
  assert.equal(idle.verdict, "seated");
  const coil = booth.rows.find((row) => row.event === "placeholder-cat");
  assert.equal(coil.placeholderCat, true);
  const path = booth.rows.find((row) => row.event === "ptmx-race");
  assert.equal(path.verdict, "ptmx-race");
});

test("CATHEAD_WALK constant matches the issue PTY walk", () => {
  assert.equal(CATHEAD_WALK[0].event, "cue-seated");
  const coil = CATHEAD_WALK.find((row) => row.event === "placeholder-cat");
  assert.equal(coil.placeholderCat, true);
  const path = CATHEAD_WALK.find((row) => row.event === "ptmx-race");
  assert.equal(path.raced, true);
  const scoreRow = CATHEAD_WALK.find((row) => row.event === "cathead");
  assert.equal(scoreRow.raced, true);
});

test("positive control wait-exit stays seated", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "seated");
  const wait = walk.rows.find((row) => row.event === "wait-exit-ok");
  assert.equal(wait.verdict, "seated");
  const hold = walk.rows.find((row) => row.event === "cue-seated");
  assert.equal(hold.seated, true);
  assert.equal(hold.verdict, "seated");
});

test("issue constants encode only #93624 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93624);
  assert.ok(ISSUE_URL.includes("93624"));
  assert.match(TITLE, /Device not configured/i);
  assert.match(TITLE, /ptmx/);
  assert.match(TITLE, /respawn-pane -k/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.equal(PTMX_GROW_VECTOR, 16);
  assert.equal(KERNEL_MINOR, 96);
  assert.match(KERNEL_LOG, /ptmx_get_ioctl/);
  assert.match(KERNEL_LOG, /96/);
  assert.equal(DARWIN, "25.5.0");
  assert.equal(TMUX_VERSION, "3.6a");
  assert.equal(CLAUDE_VERSION, "2.1.268");
  assert.equal(TEAMMATE_MODE, "tmux");
  assert.match(SPLIT_CMD, /split-window/);
  assert.match(SPLIT_CMD, /cat/);
  assert.match(RESPAWN_CMD, /respawn-pane -k/);
  assert.equal(SPAWN_FAILURES, "6/6");
  assert.equal(PREGROW_COUNT, 512);
  assert.match(XXX_COMMENT, /fall off the end/i);
  assert.match(DISTRIBUTION, /PTMX_GROW_VECTOR/);
  assert.match(SESSION_KIND, /6\/6/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("ptmx-race"));
  assert.ok(FINGERPRINT_LINES.includes("raced"));
  assert.match(PHRASE, /Score cathead or admit seated/);
  assert.equal(SAMPLE_TIMBER.dropped, true);
  assert.equal(SAMPLE_GAUGE.vector, 16);
  assert.equal(SAMPLE_PLACEHOLDER.cat, true);
  assert.equal(SAMPLE_RESPAWN.kill, true);
  assert.equal(SAMPLE_KERNEL.minor, 96);
});

test("has-repro fingerprints encode the published ptmx race", () => {
  const result = handle(seedRaced());
  assert.equal(result.published.ptmxGrowVector, 16);
  assert.match(result.published.sessionKind, /6\/6/);
  assert.equal(result.published.kernelMinor, 96);
  assert.match(
    fingerprint(seedRaced()),
    /cathead\|timber=dropped\|gauge=boundary\|placeholder=cat\|respawn=kill\|kernel=enxio\|path=ptmx-race\|cue=ptmx-race/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Anachronism and Nullarbor", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("seated booth flips raced back when wait-exit holds", () => {
  const tape = {
    seated: true,
    raced: false,
    waitExit: true,
    cue: "seated",
  };
  assert.equal(scoreGate(tape).verdict, "seated");
  tape.seated = false;
  tape.raced = true;
  tape.placeholderCat = true;
  tape.respawnKill = true;
  tape.enxio = true;
  tape.cue = "raced";
  assert.equal(scoreGate(tape).verdict, "cathead");
  tape.seated = true;
  tape.raced = false;
  tape.placeholderCat = false;
  tape.respawnKill = false;
  tape.enxio = false;
  tape.cue = "seated";
  assert.equal(scoreGate(tape).verdict, "seated");
});

test("timber, gauge, placeholder, respawn, kernel, and readBooth mark the race", () => {
  const idle = inspectTimber({ seated: true, waitExit: true, timber: { seated: true, dropped: false, halfCatted: false } });
  assert.equal(idle.stamp, "seated");
  const gauge = inspectGauge({ raced: true, gauge: SAMPLE_GAUGE });
  assert.equal(gauge.stamp, "boundary");
  assert.equal(gauge.vector, 16);
  const coil = inspectPlaceholder({ placeholderCat: true, placeholder: SAMPLE_PLACEHOLDER });
  assert.equal(coil.stamp, "cat");
  const lever = inspectRespawn({ raced: true, respawnKill: true, respawn: SAMPLE_RESPAWN });
  assert.equal(lever.stamp, "kill");
  assert.equal(lever.forkptyImmediate, true);
  const kernel = inspectKernel({ raced: true, enxio: true });
  assert.equal(kernel.stamp, "enxio");
  const booth = readBooth({
    raced: true,
    placeholderCat: true,
    respawnKill: true,
    enxio: true,
    timber: SAMPLE_TIMBER,
    placeholder: SAMPLE_PLACEHOLDER,
  });
  assert.equal(booth.raced, true);
  assert.equal(booth.mark, "raced");
  const calm = readBooth({
    seated: true,
    raced: false,
    waitExit: true,
  });
  assert.equal(calm.raced, false);
  assert.equal(calm.mark, "seated");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 77211);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /77211|stale|ENXIO|Device not configured/i);
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("aposiopesis"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("analepsis"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93615);
  assert.equal(BACKUPS[1].issue, 93570);
  assert.equal(BACKUPS[2].issue, 93589);
  assert.equal(BACKUPS[3].issue, 93618);
  assert.equal(BACKUPS[4].issue, 93622);
  assert.equal(BACKUPS[5].issue, 93652);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /WebSearch/);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/raced.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "seated");
  assert.equal(JSON.parse(seeded.stdout).verdict, "raced");
});

test("handle exposes published hypothesis and #93624 headline", () => {
  const result = handle(seedRaced());
  assert.equal(result.published.issue, 93624);
  assert.equal(result.published.ptmxGrowVector, 16);
  assert.deepEqual(result.published.cousins, [77211]);
  assert.ok(result.published.backups.includes(93615));
  assert.ok(result.published.backups.includes(93570));
  assert.ok(result.published.backups.includes(93652));
  assert.match(result.published.hypothesis, /respawn-pane -k/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /split-window/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a bow cathead timber booth, not continuity or saltbush", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Sora/);
  assert.match(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.match(page, /cathead|anchor-timber|slot-vector|placeholder|respawn|ENXIO|ptmx/i);
  assert.match(page, /#071828|#9A6B3A|#2C3036|#E23B3B|#3BBFA0|#D6B15A/i);
  assert.match(page, /\bseated\b/);
  assert.match(page, /\braced\b/);
  assert.match(page, /ptmx-race/);
  assert.match(page, /Score cathead or admit seated/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /01:50/);
  assert.match(page, /#296/);
  assert.match(page, /#93624/);
  assert.match(page, /Seat the cathead/);
  assert.match(page, /Score cathead/);
  assert.match(page, /Coil the cat line/);
  assert.match(page, /Compare seated \/ raced/);
  assert.match(page, /Pin idle seated/);
  assert.match(page, /Pin seeded raced/);
  assert.match(page, /Pin ptmx-race/);
  assert.match(page, /Hold the seated/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /\bHind\b/);
  assert.doesNotMatch(page, /Fira Mono|Fira\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#12100E/);
  assert.doesNotMatch(page, /#1C1A17/);
  assert.doesNotMatch(page, /#E8E0D0/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#B83A3A/);
  assert.doesNotMatch(page, /#3A8F7A/);
  assert.doesNotMatch(page, /#1A1F18/);
  assert.doesNotMatch(page, /#C4A574/);
  assert.doesNotMatch(page, /#E8E4D9/);
  assert.doesNotMatch(page, /#2C3E50/);
  assert.doesNotMatch(page, /#0B0F14/);
  assert.doesNotMatch(page, /#E85D04/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#9B1D20/);
  assert.doesNotMatch(page, /#F7F1E6/);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /\btip\b/);
  assert.doesNotMatch(page, /\bstale\b/);
  assert.doesNotMatch(page, /prewarm-latch/);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bemptied\b/);
  assert.doesNotMatch(page, /empty-expand/);
  assert.doesNotMatch(page, /\bstanding\b/);
  assert.doesNotMatch(page, /\bhoisted\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfurled\b/);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Aposiopesis/i);
  assert.match(page, /NOT Disseisin/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cathead/);
  assert.match(readme, /#93624/);
  assert.match(readme, /\bseated\b/);
  assert.match(readme, /\braced\b/);
  assert.match(readme, /ptmx-race/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Sora/);
  assert.match(readme, /Red Hat Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Aposiopesis/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /#77211/);
  assert.match(readme, /PTMX_GROW_VECTOR|vector_size|16-slot/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cathead/);
  assert.match(readme, /node --test projects\/cathead\/cathead\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /cathead|anchor-timber|slot-vector|placeholder|respawn|ENXIO/i);
  assert.match(readme, /respawn-pane -k/);
  assert.match(readme, /Score cathead or admit seated/);
});

test("catalog features Cathead only; Anachronism unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 296);
  assert.equal(hub.products.length, 296);
  assert.equal(catalog.products[0].name, "Cathead");
  assert.equal(catalog.products[0].slug, "cathead");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cathead/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /01:50/);
  assert.match(catalog.products[0].summary, /cathead/);
  assert.match(catalog.products[0].summary, /#93624/);
  assert.match(catalog.products[0].summary, /\bseated\b/);
  assert.match(catalog.products[0].summary, /\braced\b/);
  assert.match(catalog.products[0].summary, /ptmx-race/);
  assert.equal(hub.products[0].slug, "cathead");
  assert.equal(hub.products[0].featured, true);
  const anachronism = catalog.products.find((row) => row.slug === "anachronism");
  assert.ok(anachronism);
  assert.equal(anachronism.featured, false);
  const nullarbor = catalog.products.find((row) => row.slug === "nullarbor");
  assert.ok(nullarbor);
  assert.equal(nullarbor.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cathead").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93624") && row.slug !== "cathead"));
});

test("vercel rewrites cathead to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cathead");
  assert.equal(vercel.rewrites[0].destination, "/projects/cathead");
  assert.equal(vercel.rewrites[1].source, "/cathead/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cathead");
  assert.equal(vercel.rewrites[2].source, "/cathead/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cathead/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
