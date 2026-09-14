import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALLOWLISTED_PARTS,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  DOLL_NAMES,
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
  MATRYOSHKA_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PUBLISHED_REPROS,
  RULED_OUT,
  SAMPLE_MATRYOSHKA_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  UNHANDLED_SEMI,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  extractSubstBody,
  fingerprint,
  handle,
  hasNestedPipe,
  hasNestedSemicolon,
  inspectLeak,
  inspectOuter,
  inspectParts,
  inspectPath,
  inspectPipe,
  inspectSemi,
  mapDoll,
  readBooth,
  score,
  scoreGate,
  scoreRepro,
  scoreWalk,
  seedErrorLeak,
  seedHold,
  seedMatryoshka,
  seedProduct,
  seedSubstNest,
  seedUnpacked,
  walkPermission,
} from "./matryoshka.mjs";

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
  return fileURLToPath(new URL("./matryoshka.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "05:50 matryoshka: a lacquer nesting-doll / birch-workshop booth for #94350. Bash permission walker prompts on pipes/semicolons nested inside $(...) even when every component is allow-listed; semicolon case leaks \"Unhandled node type: ;\" into the permission prompt. Idle unpacked / seeded matryoshka / path subst-nest. Score matryoshka or admit unpacked.";

test("idle unpacked is a hold; walker would recurse into $(...) like top-level", () => {
  const result = analyze(seedUnpacked());
  assert.equal(result.verdict, "unpacked");
  assert.equal(result.idleWord, "unpacked");
  assert.equal(IDLE_WORD, "unpacked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unpacked, true);
  assert.equal(result.phrase, "admit unpacked");
  assert.equal(result.matryoshka, false);
  assert.equal(result.substNest, false);
  assert.ok(HOLD_ALIASES.includes("descended"));
  assert.ok(HOLD_ALIASES.includes("recursed"));
  assert.ok(HOLD_ALIASES.includes("opened"));
  assert.ok(HOLD_ALIASES.includes("nested-ok"));
  assert.ok(HOLD_ALIASES.includes("walked-in"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "equated");
  assert.notEqual(IDLE_WORD, "penned");
});

test("empty ticket and empty stdin classify unpacked", () => {
  assert.equal(classify(emptyTicket()), "unpacked");
  assert.equal(classify(""), "unpacked");
  assert.equal(classify(null), "unpacked");
  assert.equal(decide({}), "unpacked");
});

test("#94350 seeded path scores matryoshka when nested joints stay shut", () => {
  const result = analyze(seedMatryoshka());
  assert.equal(result.verdict, "matryoshka");
  assert.equal(result.seededWord, "matryoshka");
  assert.equal(SEEDED_WORD, "matryoshka");
  assert.equal(PRODUCT_WORD, "matryoshka");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.matryoshka, true);
  assert.equal(result.phrase, "score matryoshka");
  assert.equal(result.substNest, true);
  assert.equal(result.nestedPipe, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "dragnet");
  assert.notEqual(SEEDED_WORD, "matricula");
  assert.notEqual(SEEDED_WORD, "allograph");
});

test("educational walker encodes published repros only", () => {
  assert.deepEqual([...ALLOWLISTED_PARTS], ["cat", "wc", "echo", "pwd"]);
  assert.equal(UNHANDLED_SEMI, "Unhandled node type: ;");
  assert.equal(extractSubstBody('echo "x: $(pwd)"'), "pwd");
  assert.equal(hasNestedPipe('echo "x: $(cat file.txt | wc -l)"'), true);
  assert.equal(hasNestedSemicolon('echo "x: $(echo a; echo b)"'), true);
  const simple = walkPermission('echo "x: $(pwd)"');
  assert.equal(simple.prompts, false);
  assert.equal(simple.matryoshka, false);
  const redirect = walkPermission('echo "x: $(cat file.txt 2>/dev/null)"');
  assert.equal(redirect.prompts, false);
  const pipe = walkPermission('echo "x: $(cat file.txt | wc -l)"');
  assert.equal(pipe.prompts, true);
  assert.equal(pipe.nestedPipe, true);
  assert.equal(pipe.errorLeak, null);
  const semi = walkPermission('echo "x: $(echo a; echo b)"');
  assert.equal(semi.prompts, true);
  assert.equal(semi.errorLeak, UNHANDLED_SEMI);
  const hold = walkPermission('echo "x: $(echo a; echo b)"', { unpacked: true });
  assert.equal(hold.prompts, false);
  assert.equal(hold.unpacked, true);
  const scored = scoreRepro(PUBLISHED_REPROS[3]);
  assert.equal(scored.prompts, true);
  assert.equal(scored.errorLeak, UNHANDLED_SEMI);
});

test("inspectors mark nested joints and error leak", () => {
  const pipe = inspectPipe({ matryoshka: true, nestedPipe: true });
  assert.equal(pipe.stamp, "inner-joint-pipe");
  assert.equal(pipe.nested, true);
  const leak = inspectLeak({ matryoshka: true, errorLeak: true });
  assert.equal(leak.stamp, "error-leak");
  assert.equal(leak.leaked, true);
  const scored = scoreGate({
    matryoshka: true,
    substNest: true,
    nestedPipe: true,
    cue: "matryoshka",
  });
  assert.equal(scored.verdict, "matryoshka");
  const open = inspectOuter({ unpacked: true, matryoshka: false });
  assert.equal(open.stamp, "outer-unpacked");
});

test("path word is subst-nest; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "subst-nest");
  const result = analyze(seedSubstNest());
  assert.equal(result.verdict, "subst-nest");
  assert.equal(result.pathWord, "subst-nest");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "subst-nest",
      preferSeed: true,
      matryoshka: true,
    }),
    "subst-nest",
  );
  assert.equal(classify({ seed: "nested-pipe", preferSeed: true }), "nested-pipe");
  assert.equal(score(seedSubstNest()), "matryoshka");
});

test("HOLD includes unpacked / hold", () => {
  assert.ok(HOLD.includes("unpacked"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: unhandled-node, subst-nest, matryoshka, error-leak", () => {
  assert.equal(classify({ seed: "unhandled-node", preferSeed: true }), "unhandled-node");
  assert.equal(classify(seedSubstNest()), "subst-nest");
  assert.equal(classify(seedProduct()), "matryoshka");
  assert.equal(classify(seedErrorLeak()), "error-leak");
});

test("booth fixtures flip unpacked vs matryoshka vs subst-nest", () => {
  const idle = scoreGate(seedUnpacked());
  const seeded = scoreGate(seedMatryoshka());
  const unpacked = readData("unpacked.json");
  const matryoshka = readData("matryoshka.json");
  const issued = readData("94350.json");
  const path = readData("subst-nest.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "unpacked");
  assert.equal(seeded.verdict, "matryoshka");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUnpacked()), "unpacked");
  assert.equal(score(seedMatryoshka()), "matryoshka");
  assert.equal(score({ seed: "subst-nest", preferSeed: true }), "matryoshka");
  assert.equal(unpacked.substNest, false);
  assert.equal(unpacked.unpacked, true);
  assert.equal(scoreGate(unpacked).verdict, "unpacked");
  assert.equal(matryoshka.substNest, true);
  assert.equal(matryoshka.nestedPipe, true);
  assert.equal(classify(matryoshka), "matryoshka");
  assert.equal(issued.issue, 94350);
  assert.equal(classify(issued), "matryoshka");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /unpacked|descended|recursed|opened|nested-ok|walked-in/i);
  assert.match(path.paths[1].result, /subst-nest|Unhandled|pipe|semicolon|\$\(/i);
  assert.equal(classify(path), "subst-nest");
  assert.equal(matryoshka.hubCount, "MATRYOSHKA");
  assert.equal(matryoshka.issue, 94350);
  assert.equal(matryoshka.matryoshka, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("descended.json")), "descended");
  assert.equal(classify(readData("recursed.json")), "recursed");
  assert.equal(classify(readData("opened.json")), "opened");
  assert.equal(classify(readData("nested-ok.json")), "nested-ok");
  assert.equal(classify(readData("walked-in.json")), "walked-in");
  assert.equal(classify(readData("unhandled-node.json")), "unhandled-node");
  assert.equal(classify(readData("error-leak.json")), "error-leak");
  assert.equal(classify(readData("nested-pipe.json")), "nested-pipe");
  assert.equal(classify(readData("nested-semicolon.json")), "nested-semicolon");
  assert.equal(classify(readData("top-level-ok.json")), "top-level-ok");
  assert.equal(classify(readData("allowlisted-parts.json")), "allowlisted-parts");
  assert.equal(classify(readData("subst-body.json")), "subst-body");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [55170, 47752, 56019, 47701, 47706, 46868]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("unpacked"));
  assert.ok(CHIPS.includes("matryoshka"));
  assert.ok(CHIPS.includes("subst-nest"));
  assert.ok(CHIPS.includes("unhandled-node"));
  assert.ok(CHIPS.includes("error-leak"));
  assert.ok(CHIPS.includes("descended"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("matryoshka"));
  assert.ok(ALARM.includes("subst-nest"));
  assert.ok(ALARM.includes("unhandled-node"));
  assert.ok(ALARM.includes("error-leak"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published matryoshka walk scores matryoshka after the idle hold", () => {
  const booth = scoreWalk({ rows: MATRYOSHKA_WALK });
  assert.equal(booth.verdict, "matryoshka");
  assert.ok(booth.matryoshkaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "doll-unpacked");
  assert.equal(idle.unpacked, true);
  assert.equal(idle.verdict, "unpacked");
  const cut = booth.rows.find((row) => row.event === "subst-nest");
  assert.equal(cut.substNest, true);
  const path = booth.rows.find(
    (row) => row.event === "subst-nest" && row.t === "path",
  );
  assert.equal(path.verdict, "subst-nest");
});

test("MATRYOSHKA_WALK constant matches the issue nest walk", () => {
  assert.equal(MATRYOSHKA_WALK[0].event, "doll-unpacked");
  const cut = MATRYOSHKA_WALK.find((row) => row.event === "subst-nest");
  assert.equal(cut.substNest || cut.nestedPipe, true);
  const path = MATRYOSHKA_WALK.find((row) => row.t === "path");
  assert.equal(path.matryoshka, true);
  const scoreRow = MATRYOSHKA_WALK.find((row) => row.event === "matryoshka");
  assert.equal(scoreRow.matryoshka, true);
  assert.equal(scoreRow.errorLeak, true);
});

test("positive control unpacked doll stays unpacked", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "unpacked");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "unpacked");
  const hold = walk.rows.find((row) => row.event === "doll-unpacked");
  assert.equal(hold.unpacked, true);
  assert.equal(hold.verdict, "unpacked");
});

test("issue constants encode only #94350 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94350);
  assert.ok(ISSUE_URL.includes("94350"));
  assert.match(TITLE, /Unhandled node type|command substitution|pipe/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.126|WSL|Ubuntu/i);
  assert.equal(BUILD, "Claude Code 2.1.126 (WSL/Ubuntu)");
  assert.equal(SURFACE, "subst-nest");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:bash", "platform:wsl", "area:permissions"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(DOLL_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Dragnet|#94064/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Matricula|#93987/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Allograph|#94256/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Gauntlet|#94029/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#55170/i.test(row)));
  assert.ok(EXPECTED.some((row) => /recurse|Unhandled|allow-listed|\$\(/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /Unhandled node type|2\.1\.126|\$\(|pipeline|list|allow-listed/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("subst-nest"));
  assert.ok(FINGERPRINT_LINES.includes("matryoshka"));
  assert.equal(PHRASE, "Score matryoshka or admit unpacked.");
  assert.equal(SAMPLE_MATRYOSHKA_PROOF.substNest, true);
  assert.equal(SAMPLE_MATRYOSHKA_PROOF.names.length, 6);
  assert.equal(PUBLISHED_REPROS.length, 4);
  assert.match(PUBLISHED_REPROS[2].command, /\|/);
  assert.match(PUBLISHED_REPROS[3].leak, /Unhandled node type: ;/);
});

test("has-repro fingerprints encode the published matryoshka proof", () => {
  const result = handle(seedMatryoshka());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "subst-nest");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedMatryoshka()),
    /matryoshka\|kind=subst-nest\|ref=unhandled-node\|path=subst-nest\|cue=subst-nest/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and scoped/enrolled/fenced", () => {
  const required = [
    "scoped",
    "enrolled",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "barred",
    "fenced",
    "bounded",
    "warranted",
    "project-rooted",
    "cwd-scoped",
    "dragnet",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "proscription",
    "frisket",
    "scant",
    "root-find",
    "reload-blind",
    "win-posix-mismatch",
    "pre-tool-omit",
    "attach-mouse",
    "picker-bypass",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("unpacked booth flips matryoshka back when the nest admits unpacked", () => {
  const tape = {
    unpacked: true,
    matryoshka: false,
    substNest: false,
    cue: "unpacked",
  };
  assert.equal(scoreGate(tape).verdict, "unpacked");
  tape.unpacked = false;
  tape.matryoshka = true;
  tape.substNest = true;
  tape.cue = "matryoshka";
  assert.equal(scoreGate(tape).verdict, "matryoshka");
  tape.unpacked = true;
  tape.matryoshka = false;
  tape.substNest = false;
  tape.cue = "unpacked";
  assert.equal(scoreGate(tape).verdict, "unpacked");
});

test("outer, pipe, semi, leak, and readBooth mark the matryoshka proof", () => {
  const outer = inspectOuter({ matryoshka: true });
  assert.equal(outer.stamp, "outer-shut");
  const pipe = inspectPipe({ matryoshka: true, nestedPipe: true });
  assert.equal(pipe.stamp, "inner-joint-pipe");
  assert.equal(pipe.nested, true);
  const semi = inspectSemi({ matryoshka: true, nestedSemicolon: true });
  assert.equal(semi.stamp, "inner-joint-semi");
  const booth = readBooth({
    matryoshka: true,
    substNest: true,
    nestedPipe: true,
  });
  assert.equal(booth.matryoshka, true);
  assert.equal(booth.mark, "matryoshka");
  const open = readBooth({
    unpacked: true,
    matryoshka: false,
    substNest: false,
  });
  assert.equal(open.matryoshka, false);
  assert.equal(open.mark, "unpacked");
  assert.equal(inspectLeak({ matryoshka: true, errorLeak: true }).stamp, "error-leak");
  assert.equal(inspectParts({ matryoshka: true, allowlistedParts: true }).stamp, "allowlisted-parts");
  assert.equal(inspectPath({ matryoshka: true, substNest: true }).stamp, "path-nest");
});

test("mapDoll encodes the published nested-joint miss", () => {
  const miss = mapDoll({ matryoshka: true, substNest: true });
  assert.equal(miss.stamp, "subst-nest");
  assert.equal(miss.holdingLane, "unhandled-node");
  assert.equal(miss.ribbon, "matryoshka");
  const clear = mapDoll({ unpacked: true, matryoshka: false });
  assert.equal(clear.stamp, "unpacked-doll");
  assert.equal(clear.kindLane, "nested-ok");
  assert.equal(clear.holdingLane, "descended");
});

test("cousins cite CLOSED #55170 family only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 55170);
  assert.equal(COUSINS[1].issue, 47752);
  assert.equal(COUSINS[2].issue, 56019);
  assert.equal(COUSINS[3].issue, 47701);
  assert.equal(COUSINS[4].issue, 47706);
  assert.equal(COUSINS[5].issue, 46868);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => row.state === "CLOSED"));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("dragnet"));
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[4].issue, 94277);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94350));
  assert.ok(!BACKUPS.some((row) => row.issue === 55170));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/matryoshka.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unpackedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unpacked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(unpackedFix.status, 0, unpackedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const unpackedOut = JSON.parse(unpackedFix.stdout);
  assert.equal(idleOut.verdict, "unpacked");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "matryoshka");
  assert.equal(seededOut.alarm, true);
  assert.equal(unpackedOut.verdict, "unpacked");
  assert.equal(unpackedOut.hold, true);
  assert.match(unpackedOut.phrase, /admit unpacked/);
});

test("handle exposes published hypothesis and #94350 headline", () => {
  const result = handle(seedMatryoshka());
  assert.equal(result.published.issue, 94350);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [55170, 47752, 56019, 47701, 47706, 46868]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94277));
  assert.ok(!result.published.backups.includes(94350));
  assert.match(
    result.published.hypothesis,
    /command-substitution|list\/pipeline|NON-BINDING|#94350/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94350/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the unpacked page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("unpacked page is a lacquer nesting-doll workshop, not dragnet blotter or matricula desk", () => {
  const page = readPage();
  assert.match(page, /family=Yeseva\+One|Yeseva One/);
  assert.match(page, /family=Nunito|Nunito/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /matryoshka|unpacked|subst-nest|outer-doll|inner-joint|error-leak|allowlisted-parts|workshop-bench/i,
  );
  assert.match(page, /#C41E3A|#F4E8D8|#1B2838|#D4A017|#2A2A2A/i);
  assert.match(page, /\bunpacked\b/);
  assert.match(page, /\bmatryoshka\b/);
  assert.match(page, /subst-nest/);
  assert.match(page, /Score matryoshka or admit unpacked/i);
  assert.match(page, /#366/);
  assert.match(page, /#94350/);
  assert.match(page, /Admit unpacked/);
  assert.match(page, /Score matryoshka/);
  assert.match(page, /Walk subst-nest/);
  assert.match(page, /Compare unpacked \/ matryoshka/);
  assert.match(page, /Pin idle unpacked/);
  assert.match(page, /Pin seeded matryoshka/);
  assert.match(page, /Pin subst-nest/);
  assert.match(page, /Stamp unhandled node/);
  assert.match(page, /Score booth/);
  assert.match(page, /matryoshka-score/);
  assert.match(
    page,
    /Unhandled node type|2\.1\.126|\$\(|cat file\.txt|echo a; echo b/i,
  );
  assert.match(page, /outer-doll|inner-joint-pipe|inner-joint-semi|error-leak|allowlisted-parts|workshop-bench/i);
  assert.match(
    page,
    /<svg[\s\S]*class="outer-doll"|class="inner-joint"|class="gold-leaf"|class="birch-bench"|class="lacquer-ring"|class="indigo-cloth"/i,
  );
  assert.doesNotMatch(page, /family=Archivo\+Black|Archivo Black/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/);
  assert.doesNotMatch(page, /#F7F0E6|#1A211C|#3A6B4F|#C4A15A|#6B3E2E/);
  assert.doesNotMatch(page, /night blotter|caution tape|city-grid|police-fishing/i);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /admit scoped|Score dragnet|idle scoped/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /admit equated|Score allograph|idle equated/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /\bdragnet\b/);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /root-find/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.match(page, /NOT Dragnet/i);
  assert.match(page, /NOT Matricula/i);
  assert.match(page, /NOT Allograph/i);
  assert.match(page, /NOT Gauntlet/i);
  assert.match(page, /#55170/);
  assert.match(page, /#47752/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Matryoshka/);
  assert.match(readme, /#94350/);
  assert.match(readme, /\bunpacked\b/);
  assert.match(readme, /\bmatryoshka\b/);
  assert.match(readme, /subst-nest/);
  assert.match(readme, /Yeseva One/);
  assert.match(readme, /Nunito/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Archivo Black/);
  assert.doesNotMatch(readme, /Bitter/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /Unhandled node type|2\.1\.126|\$\(|allow-listed/i);
  assert.match(readme, /NOT Dragnet\/#94064/);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /#55170/);
  assert.match(readme, /#47752/);
  assert.match(readme, /#46868/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/matryoshka/);
  assert.match(readme, /node --test projects\/matryoshka\/matryoshka\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /nesting-doll|lacquer|birch|gold leaf|indigo/i);
  assert.match(readme, /Score matryoshka or admit unpacked/);
  assert.match(readme, /#93924|#93770|#93777|#94151|#94277/);
  assert.doesNotMatch(readme, /backup #94350|#94350 as next/);
  assert.match(readme, /05:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bdragnet\b/);
  assert.doesNotMatch(readme, /\bmatricula\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Matryoshka/);
  assert.match(runLog, /05:50/);
});

test("catalog features Matryoshka only; Dragnet unfeatured; product count 366", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 366);
  assert.equal(hub.products.length, 366);
  assert.equal(catalog.products[0].name, "Matryoshka");
  assert.equal(catalog.products[0].slug, "matryoshka");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/matryoshka/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bunpacked\b/);
  assert.match(catalog.products[0].summary, /\bmatryoshka\b/);
  assert.match(catalog.products[0].summary, /subst-nest/);
  assert.match(catalog.products[0].summary, /Score matryoshka or admit unpacked/);
  assert.match(catalog.products[0].summary, /#94350/);
  assert.equal(hub.products[0].slug, "matryoshka");
  assert.equal(hub.products[0].featured, true);
  const dragnet = catalog.products.find((row) => row.slug === "dragnet");
  assert.ok(dragnet);
  assert.equal(dragnet.featured, false);
  const matricula = catalog.products.find((row) => row.slug === "matricula");
  assert.ok(matricula);
  assert.equal(matricula.featured, false);
  const allograph = catalog.products.find((row) => row.slug === "allograph");
  assert.ok(allograph);
  assert.equal(allograph.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "matryoshka").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94350") && row.slug !== "matryoshka",
    ),
  );
});

test("vercel rewrites matryoshka to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/matryoshka");
  assert.equal(vercel.rewrites[0].destination, "/projects/matryoshka");
  assert.equal(vercel.rewrites[1].source, "/matryoshka/");
  assert.equal(vercel.rewrites[1].destination, "/projects/matryoshka");
  assert.equal(vercel.rewrites[2].source, "/matryoshka/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/matryoshka/:path*");
  assert.equal(vercel.rewrites[3].source, "/dragnet");
  assert.equal(vercel.rewrites[3].destination, "/projects/dragnet");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
