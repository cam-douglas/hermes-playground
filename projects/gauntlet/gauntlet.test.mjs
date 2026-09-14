import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GAUNTLET_WALK,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LISTS_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_GAUNTLET_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCuff,
  inspectGlove,
  inspectMail,
  inspectPaste,
  inspectPath,
  inspectYard,
  mapLists,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAttachIgnore,
  seedAttachMouse,
  seedGauntlet,
  seedHold,
  seedMouse1000,
  seedProduct,
  seedUngloved,
} from "./gauntlet.mjs";

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
  return fileURLToPath(new URL("./gauntlet.mjs", import.meta.url));
}

test("idle ungloved is a hold; DISABLE_MOUSE honored on direct launch", () => {
  const result = analyze(seedUngloved());
  assert.equal(result.verdict, "ungloved");
  assert.equal(result.idleWord, "ungloved");
  assert.equal(IDLE_WORD, "ungloved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.ungloved, true);
  assert.equal(result.phrase, "admit ungloved");
  assert.equal(result.gauntlet, false);
  assert.equal(result.attachMouse, false);
  assert.ok(HOLD_ALIASES.includes("barehanded"));
  assert.ok(HOLD_ALIASES.includes("opted"));
  assert.ok(HOLD_ALIASES.includes("native"));
  assert.ok(HOLD_ALIASES.includes("released"));
  assert.ok(HOLD_ALIASES.includes("openhand"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify ungloved", () => {
  assert.equal(classify(emptyTicket()), "ungloved");
  assert.equal(classify(""), "ungloved");
  assert.equal(classify(null), "ungloved");
  assert.equal(decide({}), "ungloved");
});

test("#94029 seeded path scores gauntlet when attach ignores DISABLE_MOUSE", () => {
  const result = analyze(seedGauntlet());
  assert.equal(result.verdict, "gauntlet");
  assert.equal(result.seededWord, "gauntlet");
  assert.equal(SEEDED_WORD, "gauntlet");
  assert.equal(PRODUCT_WORD, "gauntlet");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.gauntlet, true);
  assert.equal(result.phrase, "score gauntlet");
  assert.equal(result.attachMouse, true);
  assert.equal(result.attachIgnore, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark gloved yard and riveted cuff", () => {
  const yard = inspectYard({ gauntlet: true, attachMouse: true });
  assert.equal(yard.stamp, "yard-gloved");
  assert.equal(yard.gloved, true);
  const cuff = inspectCuff({ gauntlet: true, attachMouse: true });
  assert.equal(cuff.stamp, "cuff-riveted");
  assert.equal(cuff.riveted, true);
  const scored = scoreGate({
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
    cue: "gauntlet",
  });
  assert.equal(scored.verdict, "gauntlet");
  const open = inspectYard({ ungloved: true, gauntlet: false });
  assert.equal(open.stamp, "yard-ungloved");
});

test("path word is attach-mouse; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "attach-mouse");
  const result = analyze(seedAttachMouse());
  assert.equal(result.verdict, "attach-mouse");
  assert.equal(result.pathWord, "attach-mouse");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "attach-mouse",
      preferSeed: true,
      gauntlet: true,
    }),
    "attach-mouse",
  );
  assert.equal(classify(seedMouse1000()), "mouse-1000");
  assert.equal(score(seedAttachMouse()), "gauntlet");
});

test("HOLD includes ungloved / hold", () => {
  assert.ok(HOLD.includes("ungloved"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: attach-ignore, attach-mouse, gauntlet, mouse-1000", () => {
  assert.equal(classify(seedMouse1000()), "mouse-1000");
  assert.equal(classify(seedAttachMouse()), "attach-mouse");
  assert.equal(classify(seedProduct()), "gauntlet");
  assert.equal(classify(seedAttachIgnore()), "attach-ignore");
});

test("booth fixtures flip ungloved vs gauntlet vs attach-mouse", () => {
  const idle = scoreGate(seedUngloved());
  const seeded = scoreGate(seedGauntlet());
  const ungloved = readData("ungloved.json");
  const gauntlet = readData("gauntlet.json");
  const path = readData("attach-mouse.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "ungloved");
  assert.equal(seeded.verdict, "gauntlet");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUngloved()), "ungloved");
  assert.equal(score(seedGauntlet()), "gauntlet");
  assert.equal(
    score({ seed: "attach-mouse", preferSeed: true }),
    "gauntlet",
  );
  assert.equal(ungloved.attachMouse, false);
  assert.equal(ungloved.ungloved, true);
  assert.equal(scoreGate(ungloved).verdict, "ungloved");
  assert.equal(gauntlet.attachMouse, true);
  assert.equal(gauntlet.attachIgnore, true);
  assert.equal(gauntlet.mouse1000, true);
  assert.equal(classify(gauntlet), "gauntlet");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /ungloved|barehanded|opted|native|released|openhand/i,
  );
  assert.match(
    path.paths[1].result,
    /attach-mouse|attach-ignore|1000h|emitted|DISABLE_MOUSE/i,
  );
  assert.equal(classify(path), "attach-mouse");
  assert.equal(gauntlet.hubCount, "GAUNTLET");
  assert.equal(gauntlet.issue, 94029);
  assert.equal(gauntlet.gauntlet, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("barehanded.json")), "barehanded");
  assert.equal(classify(readData("opted.json")), "opted");
  assert.equal(classify(readData("native.json")), "native");
  assert.equal(classify(readData("released.json")), "released");
  assert.equal(classify(readData("openhand.json")), "openhand");
  assert.equal(classify(readData("direct-honor.json")), "direct-honor");
  assert.equal(classify(readData("attach-ignore.json")), "attach-ignore");
  assert.equal(classify(readData("mouse-1000.json")), "mouse-1000");
  assert.equal(classify(readData("mouse-1002.json")), "mouse-1002");
  assert.equal(classify(readData("mouse-1003.json")), "mouse-1003");
  assert.equal(classify(readData("mouse-1006.json")), "mouse-1006");
  assert.equal(classify(readData("primary-paste.json")), "primary-paste");
  assert.equal(classify(readData("disable-mouse.json")), "disable-mouse");
  assert.equal(classify(readData("disable-clicks.json")), "disable-clicks");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [91142, 73443, 66957, 71687, 73320]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("ungloved"));
  assert.ok(CHIPS.includes("gauntlet"));
  assert.ok(CHIPS.includes("attach-mouse"));
  assert.ok(CHIPS.includes("attach-ignore"));
  assert.ok(CHIPS.includes("mouse-1000"));
  assert.ok(CHIPS.includes("barehanded"));
  assert.ok(CHIPS.includes("openhand"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("gauntlet"));
  assert.ok(ALARM.includes("attach-mouse"));
  assert.ok(ALARM.includes("attach-ignore"));
  assert.ok(ALARM.includes("mouse-1000"));
  assert.ok(ALARM.includes("primary-paste"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published gauntlet walk scores gauntlet after the idle hold", () => {
  const booth = scoreWalk({ rows: GAUNTLET_WALK });
  assert.equal(booth.verdict, "gauntlet");
  assert.ok(booth.gauntletCount >= 1);
  const idle = booth.rows.find((row) => row.event === "lists-ungloved");
  assert.equal(idle.ungloved, true);
  assert.equal(idle.verdict, "ungloved");
  const cut = booth.rows.find((row) => row.event === "attach-mouse");
  assert.equal(cut.attachMouse, true);
  const path = booth.rows.find(
    (row) => row.event === "attach-mouse" && row.t === "path",
  );
  assert.equal(path.verdict, "attach-mouse");
});

test("GAUNTLET_WALK constant matches the issue lists walk", () => {
  assert.equal(GAUNTLET_WALK[0].event, "lists-ungloved");
  const cut = GAUNTLET_WALK.find((row) => row.event === "attach-mouse");
  assert.equal(cut.attachMouse || cut.attachIgnore, true);
  const path = GAUNTLET_WALK.find((row) => row.t === "path");
  assert.equal(path.gauntlet, true);
  const scoreRow = GAUNTLET_WALK.find((row) => row.event === "gauntlet");
  assert.equal(scoreRow.gauntlet, true);
  assert.equal(scoreRow.mouse1000, true);
});

test("positive control ungloved yard stays ungloved", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "ungloved");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "ungloved");
  const hold = walk.rows.find((row) => row.event === "lists-ungloved");
  assert.equal(hold.ungloved, true);
  assert.equal(hold.verdict, "ungloved");
});

test("issue constants encode only #94029 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94029);
  assert.ok(ISSUE_URL.includes("94029"));
  assert.match(TITLE, /claude attach|DISABLE_MOUSE|mouse capture/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.270|DISABLE_MOUSE|Linux/i);
  assert.equal(BUILD, "Claude Code 2.1.270 (Linux)");
  assert.equal(SURFACE, "attach-mouse");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:tui", "regression", "area:agent-view"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LISTS_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Lychgate|#94059/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Ouster|#94221/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Lictor/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#73320/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /DISABLE_MOUSE|attached|direct/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /claude attach|1000h|1002h|1003h|1006h|DISABLE_MOUSE|Run D|Run E|Run G|2\.1\.270|PRIMARY/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("attach-mouse"));
  assert.ok(FINGERPRINT_LINES.includes("gauntlet"));
  assert.equal(PHRASE, "Score gauntlet or admit ungloved.");
  assert.equal(SAMPLE_GAUNTLET_PROOF.attachMouse, true);
  assert.equal(SAMPLE_GAUNTLET_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published gauntlet proof", () => {
  const result = handle(seedGauntlet());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "attach-mouse");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedGauntlet()),
    /gauntlet\|kind=attach-mouse\|ref=attach-ignore\|path=attach-mouse\|cue=attach-mouse/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and lictor/lychgate", () => {
  const required = [
    "reaped",
    "tenanted",
    "barred",
    "additive",
    "literal",
    "echoing",
    "unabridged",
    "innocent",
    "sealed",
    "silenced",
    "living",
    "cleared",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "vested",
    "plenary",
    "equalized",
    "legible",
    "calibrated",
    "engaged",
    "flush",
    "candid",
    "stetted",
    "sighted",
    "lictor",
    "lychgate",
    "ouster",
    "thimblerig",
    "fetchling",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "proscription",
    "bg-task-stale",
    "inherited-worktree-yank",
    "skill-row-carve",
    "skill-dollar-swap",
    "deny-list-hollow",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("ungloved booth flips gauntlet back when the lists admit ungloved", () => {
  const tape = {
    ungloved: true,
    gauntlet: false,
    attachMouse: false,
    cue: "ungloved",
  };
  assert.equal(scoreGate(tape).verdict, "ungloved");
  tape.ungloved = false;
  tape.gauntlet = true;
  tape.attachMouse = true;
  tape.cue = "gauntlet";
  assert.equal(scoreGate(tape).verdict, "gauntlet");
  tape.ungloved = true;
  tape.gauntlet = false;
  tape.attachMouse = false;
  tape.cue = "ungloved";
  assert.equal(scoreGate(tape).verdict, "ungloved");
});

test("yard, cuff, glove, mail, paste, and readBooth mark the gauntlet proof", () => {
  const idle = inspectYard({ ungloved: true });
  assert.equal(idle.stamp, "yard-ungloved");
  const cuff = inspectCuff({ gauntlet: true, attachMouse: true });
  assert.equal(cuff.stamp, "cuff-riveted");
  assert.equal(cuff.riveted, true);
  const glove = inspectGlove({ gauntlet: true, attachIgnore: true });
  assert.equal(glove.stamp, "glove-on");
  const booth = readBooth({
    gauntlet: true,
    attachMouse: true,
    attachIgnore: true,
  });
  assert.equal(booth.gauntlet, true);
  assert.equal(booth.mark, "gauntlet");
  const open = readBooth({
    ungloved: true,
    gauntlet: false,
    attachMouse: false,
  });
  assert.equal(open.gauntlet, false);
  assert.equal(open.mark, "ungloved");
  assert.equal(
    inspectPaste({ primaryPaste: true }).stamp,
    "paste-swallowed",
  );
  assert.equal(inspectCuff({ ungloved: true }).stamp, "cuff-open");
  assert.equal(
    inspectMail({ gauntlet: true, mouse1000: true }).stamp,
    "mail-on",
  );
  assert.equal(
    inspectPath({ gauntlet: true, attachMouse: true }).stamp,
    "path-gloved",
  );
});

test("mapLists encodes the published gloved lists", () => {
  const miss = mapLists({ gauntlet: true, attachMouse: true });
  assert.equal(miss.stamp, "attach-mouse");
  assert.equal(miss.holdingLane, "attach-ignore");
  assert.equal(miss.ribbon, "gauntlet");
  const clear = mapLists({ ungloved: true, gauntlet: false });
  assert.equal(clear.stamp, "ungloved-yard");
  assert.equal(clear.kindLane, "barehanded");
  assert.equal(clear.holdingLane, "released");
});

test("cousins cite #91142 #73443 #66957 #71687 #73320 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 91142);
  assert.equal(COUSINS[0].state, "OPEN");
  assert.equal(COUSINS[1].issue, 73443);
  assert.equal(COUSINS[1].state, "CLOSED");
  assert.equal(COUSINS[2].issue, 66957);
  assert.equal(COUSINS[2].state, "CLOSED");
  assert.equal(COUSINS[3].issue, 71687);
  assert.equal(COUSINS[4].issue, 73320);
  assert.equal(COUSINS[4].state, "OPEN");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("lictor"));
  assert.ok(NOT_PRODUCTS.includes("lychgate"));
  assert.ok(NOT_PRODUCTS.includes("ouster"));
  assert.ok(NOT_PRODUCTS.includes("proscription"));
  assert.ok(NOT_PRODUCTS.includes("thimblerig"));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[7].issue, 94256);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94029));
  assert.ok(!BACKUPS.some((row) => row.issue === 91142));
  assert.ok(!BACKUPS.some((row) => row.issue === 73443));
  assert.ok(!BACKUPS.some((row) => row.issue === 66957));
  assert.ok(!BACKUPS.some((row) => row.issue === 71687));
  assert.ok(!BACKUPS.some((row) => row.issue === 73320));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/gauntlet.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unglovedFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/ungloved.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(unglovedFix.status, 0, unglovedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const unglovedOut = JSON.parse(unglovedFix.stdout);
  assert.equal(idleOut.verdict, "ungloved");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "gauntlet");
  assert.equal(seededOut.alarm, true);
  assert.equal(unglovedOut.verdict, "ungloved");
  assert.equal(unglovedOut.hold, true);
  assert.match(unglovedOut.phrase, /admit ungloved/);
});

test("handle exposes published hypothesis and #94029 headline", () => {
  const result = handle(seedGauntlet());
  assert.equal(result.published.issue, 94029);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [91142, 73443, 66957, 71687, 73320]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(94256));
  assert.ok(!result.published.backups.includes(94029));
  assert.match(
    result.published.hypothesis,
    /attach|DISABLE_MOUSE|Run E|Run D|NON-BINDING|#94029/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94029/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the ungloved page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("ungloved page is a tilting-yard gauntlet, not a porch or fasces aisle", () => {
  const page = readPage();
  assert.match(page, /family=Cinzel|Cinzel/);
  assert.match(page, /family=Karla|Karla/);
  assert.match(page, /Space\+Mono|Space Mono/);
  assert.match(
    page,
    /gauntlet|ungloved|attach-mouse|tilting-yard|iron glove|riveted cuff|mail sleeve|open-hand|PRIMARY/i,
  );
  assert.match(page, /#1F2328|#8A9199|#8B1E2D|#E8E0D0|#B8953A|#2C3138/i);
  assert.match(page, /\bungloved\b/);
  assert.match(page, /\bgauntlet\b/);
  assert.match(page, /attach-mouse/);
  assert.match(page, /Score gauntlet or admit ungloved/i);
  assert.match(page, /#361/);
  assert.match(page, /#94029/);
  assert.match(page, /Admit ungloved/);
  assert.match(page, /Score gauntlet/);
  assert.match(page, /Walk attach-mouse/);
  assert.match(page, /Compare ungloved \/ gauntlet/);
  assert.match(page, /Pin idle ungloved/);
  assert.match(page, /Pin seeded gauntlet/);
  assert.match(page, /Pin attach-mouse/);
  assert.match(page, /Glove the lists/);
  assert.match(page, /Score booth/);
  assert.match(page, /gauntlet-score/);
  assert.match(
    page,
    /DISABLE_MOUSE|1000h|1002h|1003h|1006h|PRIMARY|2\.1\.270|Run D|Run E|Run G/i,
  );
  assert.match(page, /tilting-yard|iron glove|riveted cuff|mail sleeve|open-hand|attach-path/i);
  assert.match(page, /<svg[\s\S]*class="iron-gauntlet"|class="riveted-cuff"|class="mail-sleeve"|class="tilting-yard"|class="open-hand"|class="attach-path"/i);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Rye|Rye/);
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /carnival|cups-and-pea|fairground/i);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /marble lintel|wax tablet|iron stylus|torch-lit senate/i);
  assert.doesNotMatch(page, /bailiff|tenancy roll|street door|wax-seal|lodger/i);
  assert.doesNotMatch(page, /parish roll|coffin rest|burial path|churchyard/i);
  assert.doesNotMatch(page, /fasces|lictors? aisle|purple aisle/i);
  assert.doesNotMatch(page, /admit tenanted|Score ouster|idle tenanted/i);
  assert.doesNotMatch(page, /admit barred|Score proscription|idle barred/i);
  assert.doesNotMatch(page, /admit additive|Score thimblerig|idle additive/i);
  assert.doesNotMatch(page, /admit literal|Score fetchling|idle literal/i);
  assert.doesNotMatch(page, /admit echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|Score sallyport/i);
  assert.doesNotMatch(page, /admit reaped|Score lychgate|idle reaped/i);
  assert.doesNotMatch(page, /\bthimblerig\b/);
  assert.doesNotMatch(page, /\bfetchling\b/);
  assert.doesNotMatch(page, /\bproscription\b/);
  assert.doesNotMatch(page, /\bouster\b/);
  assert.doesNotMatch(page, /\blychgate\b/);
  assert.doesNotMatch(page, /\blictor\b/);
  assert.doesNotMatch(page, /skill-row-carve/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /inherited-worktree-yank/);
  assert.doesNotMatch(page, /deny-list-hollow/);
  assert.doesNotMatch(page, /bg-task-stale/);
  assert.match(page, /NOT Lictor/i);
  assert.match(page, /NOT Lychgate/i);
  assert.match(page, /NOT Ouster/i);
  assert.match(page, /NOT Proscription/i);
  assert.match(page, /NOT Thimblerig/i);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /#91142/);
  assert.match(page, /#73443/);
  assert.match(page, /#66957/);
  assert.match(page, /#71687/);
  assert.match(page, /#73320/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Gauntlet/);
  assert.match(readme, /#94029/);
  assert.match(readme, /\bungloved\b/);
  assert.match(readme, /\bgauntlet\b/);
  assert.match(readme, /attach-mouse/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Space Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /ATTACH-MOUSE|DISABLE_MOUSE|1000h|1002h|PRIMARY|claude attach/i,
  );
  assert.match(readme, /NOT Lictor/);
  assert.match(readme, /NOT Lychgate\/#94059/);
  assert.match(readme, /NOT Ouster\/#94221/);
  assert.match(readme, /NOT Proscription\/#94202/);
  assert.match(readme, /NOT Thimblerig\/#94174/);
  assert.match(readme, /NOT Fetchling\/#94065/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /#91142/);
  assert.match(readme, /#73443/);
  assert.match(readme, /#66957/);
  assert.match(readme, /#71687/);
  assert.match(readme, /#73320/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/gauntlet/);
  assert.match(readme, /node --test projects\/gauntlet\/gauntlet\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /tilting-yard|iron glove|riveted cuff|mail sleeve|open-hand/i);
  assert.match(readme, /Score gauntlet or admit ungloved/);
  assert.match(
    readme,
    /#93987|#93924|#93770|#93777|#94151|#94064|#94251|#94256/,
  );
  assert.doesNotMatch(readme, /backup #94029|#94029 as next/);
  assert.match(readme, /21:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Gauntlet/);
  assert.match(runLog, /21:50/);
});

test("catalog features Gauntlet only; Lictor unfeatured; product count 361", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 361);
  assert.equal(hub.products.length, 361);
  assert.equal(catalog.products[0].name, "Gauntlet");
  assert.equal(catalog.products[0].slug, "gauntlet");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/gauntlet/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "21:50 gauntlet: a medieval tournament gauntlet / iron glove / riveted cuff / tilting-yard booth for #94029. Attached background sessions (`claude attach`) enable xterm mouse reporting unconditionally, ignoring CLAUDE_CODE_DISABLE_MOUSE and CLAUDE_CODE_DISABLE_MOUSE_CLICKS; direct launch honors DISABLE_MOUSE=1 (zero enables). Idle ungloved / seeded gauntlet / path attach-mouse. Score gauntlet or admit ungloved.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bungloved\b/);
  assert.match(catalog.products[0].summary, /\bgauntlet\b/);
  assert.match(catalog.products[0].summary, /attach-mouse/);
  assert.match(catalog.products[0].summary, /Score gauntlet or admit ungloved/);
  assert.match(catalog.products[0].summary, /#94029/);
  assert.equal(hub.products[0].slug, "gauntlet");
  assert.equal(hub.products[0].featured, true);
  const lictor = catalog.products.find((row) => row.slug === "lictor");
  assert.ok(lictor);
  assert.equal(lictor.featured, false);
  const lychgate = catalog.products.find((row) => row.slug === "lychgate");
  assert.ok(lychgate);
  assert.equal(lychgate.featured, false);
  const ouster = catalog.products.find((row) => row.slug === "ouster");
  assert.ok(ouster);
  assert.equal(ouster.featured, false);
  const proscription = catalog.products.find((row) => row.slug === "proscription");
  assert.ok(proscription);
  assert.equal(proscription.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "gauntlet").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94029") && row.slug !== "gauntlet",
    ),
  );
});

test("vercel rewrites gauntlet to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/gauntlet");
  assert.equal(vercel.rewrites[0].destination, "/projects/gauntlet");
  assert.equal(vercel.rewrites[1].source, "/gauntlet/");
  assert.equal(vercel.rewrites[1].destination, "/projects/gauntlet");
  assert.equal(vercel.rewrites[2].source, "/gauntlet/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/gauntlet/:path*");
  assert.equal(vercel.rewrites[3].source, "/lictor");
  assert.equal(vercel.rewrites[3].destination, "/projects/lictor");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
