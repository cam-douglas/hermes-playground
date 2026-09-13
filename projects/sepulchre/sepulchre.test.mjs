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
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_SEPULCHRE_PROOF,
  SEEDED_WORD,
  SEPULCHRE_WALK,
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
  inspectBinary,
  inspectFallback,
  inspectNul,
  inspectStream,
  inspectVault,
  mapVault,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBashNulPoison,
  seedHold,
  seedLiving,
  seedNulBytes,
  seedProduct,
  seedSepulchre,
  seedTwoStepPrompt,
} from "./sepulchre.mjs";

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
  return fileURLToPath(new URL("./sepulchre.mjs", import.meta.url));
}

test("idle living is a hold; vault still unsealed", () => {
  const result = analyze(seedLiving());
  assert.equal(result.verdict, "living");
  assert.equal(result.idleWord, "living");
  assert.equal(IDLE_WORD, "living");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.living, true);
  assert.equal(result.phrase, "admit living");
  assert.equal(result.sepulchre, false);
  assert.equal(result.bashNulPoison, false);
  assert.ok(HOLD_ALIASES.includes("living"));
  assert.ok(HOLD_ALIASES.includes("unsealed"));
  assert.ok(HOLD_ALIASES.includes("breathing"));
  assert.ok(HOLD_ALIASES.includes("open-vault"));
  assert.ok(HOLD_ALIASES.includes("intact"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify living", () => {
  assert.equal(classify(emptyTicket()), "living");
  assert.equal(classify(""), "living");
  assert.equal(classify(null), "living");
  assert.equal(decide({}), "living");
});

test("#94055 seeded path scores sepulchre when NUL cuts the JSON stream", () => {
  const result = analyze(seedSepulchre());
  assert.equal(result.verdict, "sepulchre");
  assert.equal(result.seededWord, "sepulchre");
  assert.equal(SEEDED_WORD, "sepulchre");
  assert.equal(PRODUCT_WORD, "sepulchre");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.sepulchre, true);
  assert.equal(result.phrase, "score sepulchre");
  assert.equal(result.bashNulPoison, true);
  assert.equal(result.truncatedBody, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark entombed vault and truncated stream", () => {
  const vault = inspectVault({ sepulchre: true, bashNulPoison: true });
  assert.equal(vault.stamp, "vault-entombed");
  assert.equal(vault.entombed, true);
  const nul = inspectNul({ sepulchre: true, nulBytes: true });
  assert.equal(nul.stamp, "nul-bytes");
  assert.equal(nul.present, true);
  const stream = inspectStream({ sepulchre: true, truncatedBody: true });
  assert.equal(stream.stamp, "truncated-body");
  const scored = scoreGate({
    sepulchre: true,
    bashNulPoison: true,
    truncatedBody: true,
    nulBytes: true,
    cue: "sepulchre",
  });
  assert.equal(scored.verdict, "sepulchre");
  const open = inspectVault({ living: true, sepulchre: false });
  assert.equal(open.stamp, "vault-unsealed");
});

test("path word is bash-nul-poison; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "bash-nul-poison");
  const result = analyze(seedBashNulPoison());
  assert.equal(result.verdict, "bash-nul-poison");
  assert.equal(result.pathWord, "bash-nul-poison");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "bash-nul-poison", preferSeed: true, sepulchre: true }),
    "bash-nul-poison",
  );
  assert.equal(classify(seedTwoStepPrompt()), "two-step-prompt");
});

test("HOLD includes living / hold", () => {
  assert.ok(HOLD.includes("living"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: nul-bytes, two-step-prompt, sepulchre", () => {
  assert.equal(classify(seedNulBytes()), "nul-bytes");
  assert.equal(classify(seedTwoStepPrompt()), "two-step-prompt");
  assert.equal(classify(seedProduct()), "sepulchre");
});

test("booth fixtures flip living vs sepulchre vs bash-nul-poison", () => {
  const idle = scoreGate(seedLiving());
  const seeded = scoreGate(seedSepulchre());
  const living = readData("living.json");
  const sepulchre = readData("sepulchre.json");
  const path = readData("bash-nul-poison.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "living");
  assert.equal(seeded.verdict, "sepulchre");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLiving()), "living");
  assert.equal(score(seedSepulchre()), "sepulchre");
  assert.equal(living.bashNulPoison, false);
  assert.equal(living.living, true);
  assert.equal(scoreGate(living).verdict, "living");
  assert.equal(sepulchre.bashNulPoison, true);
  assert.equal(sepulchre.truncatedBody, true);
  assert.equal(sepulchre.nulBytes, true);
  assert.equal(classify(sepulchre), "sepulchre");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /living|unsealed|breathing|open-vault|intact/i);
  assert.match(path.paths[1].result, /NUL|truncated|unexpected end|400/i);
  assert.equal(classify(path), "bash-nul-poison");
  assert.equal(sepulchre.hubCount, "SEPULCHRE");
  assert.equal(sepulchre.issue, 94055);
  assert.equal(sepulchre.sepulchre, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("unsealed.json")), "unsealed");
  assert.equal(classify(readData("breathing.json")), "breathing");
  assert.equal(classify(readData("open-vault.json")), "open-vault");
  assert.equal(classify(readData("intact.json")), "intact");
  assert.equal(classify(readData("nul-bytes.json")), "nul-bytes");
  assert.equal(classify(readData("truncated-body.json")), "truncated-body");
  assert.equal(classify(readData("unexpected-end.json")), "unexpected-end");
  assert.equal(classify(readData("session-dead.json")), "session-dead");
  assert.equal(classify(readData("model-fallback-useless.json")), "model-fallback-useless");
  assert.equal(classify(readData("binary-as-text.json")), "binary-as-text");
  assert.equal(classify(readData("two-step-prompt.json")), "two-step-prompt");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("living"));
  assert.ok(CHIPS.includes("sepulchre"));
  assert.ok(CHIPS.includes("bash-nul-poison"));
  assert.ok(CHIPS.includes("two-step-prompt"));
  assert.ok(CHIPS.includes("nul-bytes"));
  assert.ok(CHIPS.includes("unsealed"));
  assert.ok(CHIPS.includes("open-vault"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("sepulchre"));
  assert.ok(ALARM.includes("bash-nul-poison"));
  assert.ok(ALARM.includes("two-step-prompt"));
  assert.ok(ALARM.includes("nul-bytes"));
  assert.ok(ALARM.includes("session-dead"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published sepulchre walk scores sepulchre after the idle hold", () => {
  const booth = scoreWalk({ rows: SEPULCHRE_WALK });
  assert.equal(booth.verdict, "sepulchre");
  assert.ok(booth.sepulchreCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-living");
  assert.equal(idle.living, true);
  assert.equal(idle.verdict, "living");
  const cut = booth.rows.find((row) => row.event === "bash-nul-poison");
  assert.equal(cut.bashNulPoison, true);
  const path = booth.rows.find((row) => row.event === "bash-nul-poison" && row.t === "path");
  assert.equal(path.verdict, "bash-nul-poison");
});

test("SEPULCHRE_WALK constant matches the issue vault walk", () => {
  assert.equal(SEPULCHRE_WALK[0].event, "cue-living");
  const cut = SEPULCHRE_WALK.find((row) => row.event === "bash-nul-poison");
  assert.equal(cut.bashNulPoison || cut.truncatedBody, true);
  const path = SEPULCHRE_WALK.find((row) => row.t === "path");
  assert.equal(path.sepulchre, true);
  const scoreRow = SEPULCHRE_WALK.find((row) => row.event === "sepulchre");
  assert.equal(scoreRow.sepulchre, true);
});

test("positive control living vault stays living", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "living");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "living");
  const hold = walk.rows.find((row) => row.event === "cue-living");
  assert.equal(hold.living, true);
  assert.equal(hold.verdict, "living");
});

test("issue constants encode only #94055 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94055);
  assert.ok(ISSUE_URL.includes("94055"));
  assert.match(TITLE, /NUL|unexpected end of data|400/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux");
  assert.match(HOST, /Bash|CLI/i);
  assert.equal(BUILD, "2.1.270");
  assert.equal(SURFACE, "bash-nul-poison");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:linux", "area:bash"],
  );
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Sneck|#94052/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Drawbridge|#94049/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Nullarbor|#93595/i.test(row)));
  assert.ok(EXPECTED.some((row) => /strip|escape|control|recover|saniti[sz]e|binary/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /NUL|U\+0000|truncated|unexpected end|87869|88442|poison|\.lsp\.json|2\.1\.270|10\/10/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("bash-nul-poison"));
  assert.ok(FINGERPRINT_LINES.includes("sepulchre"));
  assert.equal(PHRASE, "Score sepulchre or admit living.");
  assert.equal(SAMPLE_SEPULCHRE_PROOF.bashNulPoison, true);
});

test("has-repro fingerprints encode the published sepulchre proof", () => {
  const result = handle(seedSepulchre());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "bash-nul-poison");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSepulchre()),
    /sepulchre\|kind=bash-nul-poison\|ref=nul\|path=bash-nul-poison\|cue=bash-nul-poison/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes cleared/spanned/matched and recent catalog words", () => {
  const required = [
    "cleared",
    "sneck",
    "chip-dismiss-ephemeral",
    "spanned",
    "drawbridge",
    "rc-bridge-update-drop",
    "matched",
    "chirograph",
    "worktree-rename-stale",
    "inscribed",
    "titulus",
    "berthed",
    "pegged",
    "tempered",
    "quiescent",
    "diplomatic",
    "demesned",
    "diagrammed",
    "unattainted",
    "reflowed",
    "articulate",
    "limber",
    "filiated",
    "injective",
    "unitary",
    "verbatim",
    "plenary",
    "vested",
    "sealed",
    "latched",
    "nullarbor",
    "sigil",
    "mondegreen",
    "diplopia",
    "fulcrum",
    "followspot",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("living booth flips sepulchre back when the vault is living", () => {
  const tape = {
    living: true,
    sepulchre: false,
    bashNulPoison: false,
    cue: "living",
  };
  assert.equal(scoreGate(tape).verdict, "living");
  tape.living = false;
  tape.sepulchre = true;
  tape.bashNulPoison = true;
  tape.truncatedBody = true;
  tape.cue = "sepulchre";
  assert.equal(scoreGate(tape).verdict, "sepulchre");
  tape.living = true;
  tape.sepulchre = false;
  tape.bashNulPoison = false;
  tape.truncatedBody = false;
  tape.cue = "living";
  assert.equal(scoreGate(tape).verdict, "living");
});

test("vault, nul, stream, and readBooth mark the sepulchre proof", () => {
  const idle = inspectVault({
    living: true,
  });
  assert.equal(idle.stamp, "vault-unsealed");
  const nul = inspectNul({ sepulchre: true, nulBytes: true });
  assert.equal(nul.stamp, "nul-bytes");
  assert.equal(nul.present, true);
  const stream = inspectStream({ sepulchre: true, truncatedBody: true });
  assert.equal(stream.stamp, "truncated-body");
  const booth = readBooth({
    sepulchre: true,
    bashNulPoison: true,
    truncatedBody: true,
  });
  assert.equal(booth.sepulchre, true);
  assert.equal(booth.mark, "sepulchre");
  const open = readBooth({
    living: true,
    sepulchre: false,
    bashNulPoison: false,
  });
  assert.equal(open.sepulchre, false);
  assert.equal(open.mark, "living");
  assert.equal(inspectBinary({ sepulchre: true, binaryAsText: true }).stamp, "binary-as-text");
  assert.equal(inspectFallback({ sepulchre: true, modelFallbackUseless: true }).stamp, "model-fallback-useless");
});

test("mapVault encodes the published entombed sepulchre", () => {
  const miss = mapVault({ sepulchre: true, bashNulPoison: true });
  assert.equal(miss.stamp, "bash-nul-poison");
  assert.equal(miss.holdingLane, "entombed");
  assert.equal(miss.ribbon, "sepulchre");
  const clear = mapVault({ living: true, sepulchre: false });
  assert.equal(clear.stamp, "living-vault");
  assert.equal(clear.kindLane, "open-vault");
  assert.equal(clear.holdingLane, "intact");
});

test("cousins cite #91003 #85842 #92562 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 91003);
  assert.equal(COUSINS[1].issue, 85842);
  assert.equal(COUSINS[2].issue, 92562);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("sneck"));
  assert.ok(NOT_PRODUCTS.includes("drawbridge"));
  assert.ok(NOT_PRODUCTS.includes("chirograph"));
  assert.ok(NOT_PRODUCTS.includes("titulus"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("sigil"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94059);
  assert.equal(BACKUPS[1].issue, 94053);
  assert.equal(BACKUPS[2].issue, 94041);
  assert.equal(BACKUPS[3].issue, 94032);
  assert.equal(BACKUPS[4].issue, 94031);
  assert.equal(BACKUPS[5].issue, 94029);
  assert.equal(BACKUPS[6].issue, 93987);
  assert.equal(BACKUPS[7].issue, 93924);
  assert.equal(BACKUPS[8].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94055));
  assert.ok(!BACKUPS.some((row) => row.issue === 91003));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sepulchre.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const livingFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/living.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(livingFix.status, 0, livingFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const livingOut = JSON.parse(livingFix.stdout);
  assert.equal(idleOut.verdict, "living");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "sepulchre");
  assert.equal(seededOut.alarm, true);
  assert.equal(livingOut.verdict, "living");
  assert.equal(livingOut.hold, true);
  assert.match(livingOut.phrase, /admit living/);
});

test("handle exposes published hypothesis and #94055 headline", () => {
  const result = handle(seedSepulchre());
  assert.equal(result.published.issue, 94055);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [91003, 85842, 92562]);
  assert.ok(result.published.backups.includes(94059));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(!result.published.backups.includes(94055));
  assert.match(result.published.hypothesis, /NUL|truncated|poisoned|NON-BINDING|#94055/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94055/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a stone sepulchre vault, not cottage latch or castle or lectern", () => {
  const page = readPage();
  assert.match(page, /family=Cardo|Cardo/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(page, /sepulchre|living|bash-nul-poison|vault|ossuary|limestone|lintel/i);
  assert.match(page, /#D6C7A8|#161310|#C67A28|#2C241C|#3E434A|#EDE4D4|#8C6B48|#E8A44A/i);
  assert.match(page, /\bliving\b/);
  assert.match(page, /\bsepulchre\b/);
  assert.match(page, /bash-nul-poison/);
  assert.match(page, /Score sepulchre or admit living/i);
  assert.match(page, /#349/);
  assert.match(page, /#94055/);
  assert.match(page, /Admit living/);
  assert.match(page, /Score sepulchre/);
  assert.match(page, /Walk bash-nul-poison/);
  assert.match(page, /Compare living \/ sepulchre/);
  assert.match(page, /Pin idle living/);
  assert.match(page, /Pin seeded sepulchre/);
  assert.match(page, /Pin bash-nul-poison/);
  assert.match(page, /Kindle the lamp/);
  assert.match(page, /Score booth/);
  assert.match(page, /sepulchre-score/);
  assert.match(page, /NUL|U\+0000|truncated|unexpected end|87869|88442|poison|\.lsp\.json|2\.1\.270/i);
  assert.match(page, /ossuary|limestone|lintel|lamp|vault|bone|sepulchre/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Forum|Forum/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /#2F343B/);
  assert.doesNotMatch(page, /#8B6914/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#E8E0D5/);
  assert.doesNotMatch(page, /#5B7C99/);
  assert.doesNotMatch(page, /cottage|stoop|wool draft|oak plank/i);
  assert.doesNotMatch(page, /battlement|merlon|portcullis|bailey|gatehouse|crenel/i);
  assert.doesNotMatch(page, /lectern|indenture|moiety/i);
  assert.doesNotMatch(page, /night-latch/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.match(page, /NOT Sneck/i);
  assert.match(page, /NOT Drawbridge/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Sigil/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Sepulchre/);
  assert.match(readme, /#94055/);
  assert.match(readme, /\bliving\b/);
  assert.match(readme, /\bsepulchre\b/);
  assert.match(readme, /bash-nul-poison/);
  assert.match(readme, /Cardo/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /BASH-NUL-POISON|NUL|TRUNCATED/i);
  assert.match(readme, /NOT Sneck\/#94052/);
  assert.match(readme, /NOT Drawbridge\/#94049/);
  assert.match(readme, /NOT Nullarbor/);
  assert.match(readme, /#91003|#85842|#92562/);
  assert.match(readme, /NUL|U\+0000|truncated|87869|poison|\.lsp\.json/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/sepulchre/);
  assert.match(readme, /node --test projects\/sepulchre\/sepulchre\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /vault|ossuary|limestone|lamp|sepulchre/i);
  assert.match(readme, /Score sepulchre or admit living/);
  assert.match(readme, /#94059|#94053|#94041|#94032|#94031|#94029|#93987|#93924|#93770|#93777/);
  assert.match(readme, /08:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Sepulchre/);
  assert.match(runLog, /08:50/);
});

test("catalog features Sepulchre only; Sneck unfeatured; product count 349", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 349);
  assert.equal(hub.products.length, 349);
  assert.equal(catalog.products[0].name, "Sepulchre");
  assert.equal(catalog.products[0].slug, "sepulchre");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/sepulchre/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "08:50 sepulchre: a stone sepulchre / burial-vault / sealed-tomb / ossuary-niche / limestone-lintel / extinguished-lamp booth for #94055. If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body; server returns 400 invalid_request_error / unexpected end of data; the session never recovers — every following turn rebuilds the same poisoned body; automatic model fallback retries the same body against a second model and cannot help. Idle living / seeded sepulchre / path bash-nul-poison. Score sepulchre or admit living.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bliving\b/);
  assert.match(catalog.products[0].summary, /\bsepulchre\b/);
  assert.match(catalog.products[0].summary, /bash-nul-poison/);
  assert.match(catalog.products[0].summary, /Score sepulchre or admit living/);
  assert.equal(hub.products[0].slug, "sepulchre");
  assert.equal(hub.products[0].featured, true);
  const sneck = catalog.products.find((row) => row.slug === "sneck");
  assert.ok(sneck);
  assert.equal(sneck.featured, false);
  const drawbridge = catalog.products.find((row) => row.slug === "drawbridge");
  assert.ok(drawbridge);
  assert.equal(drawbridge.featured, false);
  const chirograph = catalog.products.find((row) => row.slug === "chirograph");
  assert.ok(chirograph);
  assert.equal(chirograph.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "sepulchre").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94055") && row.slug !== "sepulchre"));
});

test("vercel rewrites sepulchre to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/sepulchre");
  assert.equal(vercel.rewrites[0].destination, "/projects/sepulchre");
  assert.equal(vercel.rewrites[1].source, "/sepulchre/");
  assert.equal(vercel.rewrites[1].destination, "/projects/sepulchre");
  assert.equal(vercel.rewrites[2].source, "/sepulchre/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/sepulchre/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
