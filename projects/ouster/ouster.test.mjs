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
  OUSTER_WALK,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_OUSTER_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  WRIT_NAMES,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDesk,
  inspectDoor,
  inspectFlat,
  inspectKey,
  inspectRoll,
  inspectWrit,
  mapTenancy,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedChildRefusesCwd,
  seedHold,
  seedInheritedWorktreeYank,
  seedOuster,
  seedProduct,
  seedTenanted,
  seedWorktreeCleanlyRemoved,
} from "./ouster.mjs";

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
  return fileURLToPath(new URL("./ouster.mjs", import.meta.url));
}

test("idle tenanted is a hold; worktree stays while nested inheritor still runs", () => {
  const result = analyze(seedTenanted());
  assert.equal(result.verdict, "tenanted");
  assert.equal(result.idleWord, "tenanted");
  assert.equal(IDLE_WORD, "tenanted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.tenanted, true);
  assert.equal(result.phrase, "admit tenanted");
  assert.equal(result.ouster, false);
  assert.equal(result.inheritedWorktreeYank, false);
  assert.ok(HOLD_ALIASES.includes("occupied"));
  assert.ok(HOLD_ALIASES.includes("seated"));
  assert.ok(HOLD_ALIASES.includes("retained"));
  assert.ok(HOLD_ALIASES.includes("locked"));
  assert.ok(HOLD_ALIASES.includes("inhabited"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify tenanted", () => {
  assert.equal(classify(emptyTicket()), "tenanted");
  assert.equal(classify(""), "tenanted");
  assert.equal(classify(null), "tenanted");
  assert.equal(decide({}), "tenanted");
});

test("#94221 seeded path scores ouster when auto-clean yanks under a running child", () => {
  const result = analyze(seedOuster());
  assert.equal(result.verdict, "ouster");
  assert.equal(result.seededWord, "ouster");
  assert.equal(SEEDED_WORD, "ouster");
  assert.equal(PRODUCT_WORD, "ouster");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.ouster, true);
  assert.equal(result.phrase, "score ouster");
  assert.equal(result.inheritedWorktreeYank, true);
  assert.equal(result.worktreeCleanlyRemoved, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark served writ and kicked door", () => {
  const writ = inspectWrit({ ouster: true, inheritedWorktreeYank: true });
  assert.equal(writ.stamp, "writ-served");
  assert.equal(writ.served, true);
  const roll = inspectRoll({ ouster: true, inheritedWorktreeYank: true });
  assert.equal(roll.stamp, "roll-cleared");
  assert.equal(roll.yanked, true);
  const scored = scoreGate({
    ouster: true,
    inheritedWorktreeYank: true,
    worktreeCleanlyRemoved: true,
    cue: "ouster",
  });
  assert.equal(scored.verdict, "ouster");
  const open = inspectWrit({ tenanted: true, ouster: false });
  assert.equal(open.stamp, "writ-unserved");
});

test("path word is inherited-worktree-yank; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "inherited-worktree-yank");
  const result = analyze(seedInheritedWorktreeYank());
  assert.equal(result.verdict, "inherited-worktree-yank");
  assert.equal(result.pathWord, "inherited-worktree-yank");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "inherited-worktree-yank",
      preferSeed: true,
      ouster: true,
    }),
    "inherited-worktree-yank",
  );
  assert.equal(classify(seedWorktreeCleanlyRemoved()), "worktreeCleanlyRemoved");
  assert.equal(score(seedInheritedWorktreeYank()), "ouster");
});

test("HOLD includes tenanted / hold", () => {
  assert.ok(HOLD.includes("tenanted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: worktreeCleanlyRemoved, inherited-worktree-yank, ouster", () => {
  assert.equal(classify(seedWorktreeCleanlyRemoved()), "worktreeCleanlyRemoved");
  assert.equal(classify(seedInheritedWorktreeYank()), "inherited-worktree-yank");
  assert.equal(classify(seedProduct()), "ouster");
  assert.equal(classify(seedChildRefusesCwd()), "child-refuses-cwd");
});

test("booth fixtures flip tenanted vs ouster vs inherited-worktree-yank", () => {
  const idle = scoreGate(seedTenanted());
  const seeded = scoreGate(seedOuster());
  const tenanted = readData("tenanted.json");
  const ouster = readData("ouster.json");
  const path = readData("inherited-worktree-yank.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "tenanted");
  assert.equal(seeded.verdict, "ouster");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedTenanted()), "tenanted");
  assert.equal(score(seedOuster()), "ouster");
  assert.equal(
    score({ seed: "inherited-worktree-yank", preferSeed: true }),
    "ouster",
  );
  assert.equal(tenanted.inheritedWorktreeYank, false);
  assert.equal(tenanted.tenanted, true);
  assert.equal(scoreGate(tenanted).verdict, "tenanted");
  assert.equal(ouster.inheritedWorktreeYank, true);
  assert.equal(ouster.worktreeCleanlyRemoved, true);
  assert.equal(ouster.childRefusesCwd, true);
  assert.equal(classify(ouster), "ouster");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /tenanted|occupied|seated|retained|locked|inhabited/i,
  );
  assert.match(
    path.paths[1].result,
    /inherited-worktree-yank|worktreeCleanlyRemoved|Refusing to run there/i,
  );
  assert.equal(classify(path), "inherited-worktree-yank");
  assert.equal(ouster.hubCount, "OUSTER");
  assert.equal(ouster.issue, 94221);
  assert.equal(ouster.ouster, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("occupied.json")), "occupied");
  assert.equal(classify(readData("seated.json")), "seated");
  assert.equal(classify(readData("retained.json")), "retained");
  assert.equal(classify(readData("locked.json")), "locked");
  assert.equal(classify(readData("inhabited.json")), "inhabited");
  assert.equal(classify(readData("inheritedWorktreePath.json")), "inheritedWorktreePath");
  assert.equal(classify(readData("spawnDepth-2.json")), "spawnDepth-2");
  assert.equal(classify(readData("worktreeCleanlyRemoved.json")), "worktreeCleanlyRemoved");
  assert.equal(classify(readData("parent-no-changes.json")), "parent-no-changes");
  assert.equal(classify(readData("child-refuses-cwd.json")), "child-refuses-cwd");
  assert.equal(classify(readData("six-to-eight-seconds.json")), "six-to-eight-seconds");
  assert.equal(classify(readData("token-rerun-loss.json")), "token-rerun-loss");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [41010, 76377]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("tenanted"));
  assert.ok(CHIPS.includes("ouster"));
  assert.ok(CHIPS.includes("inherited-worktree-yank"));
  assert.ok(CHIPS.includes("worktreeCleanlyRemoved"));
  assert.ok(CHIPS.includes("child-refuses-cwd"));
  assert.ok(CHIPS.includes("occupied"));
  assert.ok(CHIPS.includes("inhabited"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("ouster"));
  assert.ok(ALARM.includes("inherited-worktree-yank"));
  assert.ok(ALARM.includes("worktreeCleanlyRemoved"));
  assert.ok(ALARM.includes("child-refuses-cwd"));
  assert.ok(ALARM.includes("token-rerun-loss"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published ouster walk scores ouster after the idle hold", () => {
  const booth = scoreWalk({ rows: OUSTER_WALK });
  assert.equal(booth.verdict, "ouster");
  assert.ok(booth.ousterCount >= 1);
  const idle = booth.rows.find((row) => row.event === "tenancy-held");
  assert.equal(idle.tenanted, true);
  assert.equal(idle.verdict, "tenanted");
  const cut = booth.rows.find((row) => row.event === "inherited-worktree-yank");
  assert.equal(cut.inheritedWorktreeYank, true);
  const path = booth.rows.find(
    (row) => row.event === "inherited-worktree-yank" && row.t === "path",
  );
  assert.equal(path.verdict, "inherited-worktree-yank");
});

test("OUSTER_WALK constant matches the issue tenancy walk", () => {
  assert.equal(OUSTER_WALK[0].event, "tenancy-held");
  const cut = OUSTER_WALK.find((row) => row.event === "inherited-worktree-yank");
  assert.equal(cut.inheritedWorktreeYank || cut.worktreeCleanlyRemoved, true);
  const path = OUSTER_WALK.find((row) => row.t === "path");
  assert.equal(path.ouster, true);
  const scoreRow = OUSTER_WALK.find((row) => row.event === "ouster");
  assert.equal(scoreRow.ouster, true);
  assert.equal(scoreRow.childRefusesCwd, true);
});

test("positive control tenanted roll stays tenanted", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "tenanted");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "tenanted");
  const hold = walk.rows.find((row) => row.event === "tenancy-held");
  assert.equal(hold.tenanted, true);
  assert.equal(hold.verdict, "tenanted");
});

test("issue constants encode only #94221 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94221);
  assert.ok(ISSUE_URL.includes("94221"));
  assert.match(TITLE, /Worktree auto-cleanup|nested background agent/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /inheritedWorktreePath|spawnDepth|isolation/i);
  assert.equal(BUILD, "Claude Code desktop 2.1.220 (macOS)");
  assert.equal(SURFACE, "inherited-worktree-yank");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:agents", "data-loss"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(WRIT_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Proscription|#94202/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Thimblerig|#94174/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Fetchling|#94065/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diabolica|#94040|cannot-show-not-git/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /auto-clean|worktree lock|inherited|nested/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /inheritedWorktreePath|spawnDepth: 2|worktreeCleanlyRemoved|Refusing to run there|2\.1\.220|06:44:58|tens of millions/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("inherited-worktree-yank"));
  assert.ok(FINGERPRINT_LINES.includes("ouster"));
  assert.equal(PHRASE, "Score ouster or admit tenanted.");
  assert.equal(SAMPLE_OUSTER_PROOF.inheritedWorktreeYank, true);
  assert.equal(SAMPLE_OUSTER_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published ouster proof", () => {
  const result = handle(seedOuster());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "inherited-worktree-yank");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedOuster()),
    /ouster\|kind=inherited-worktree-yank\|ref=cleared\|path=inherited-worktree-yank\|cue=inherited-worktree-yank/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and proscription/thimblerig", () => {
  const required = [
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
    "barred",
    "thimblerig",
    "fetchling",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "proscription",
    "skill-row-carve",
    "skill-dollar-swap",
    "app-switch-echo-loss",
    "summarized-thinking-force",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
    "deny-list-hollow",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("tenanted booth flips ouster back when the roll admits tenanted", () => {
  const tape = {
    tenanted: true,
    ouster: false,
    inheritedWorktreeYank: false,
    cue: "tenanted",
  };
  assert.equal(scoreGate(tape).verdict, "tenanted");
  tape.tenanted = false;
  tape.ouster = true;
  tape.inheritedWorktreeYank = true;
  tape.cue = "ouster";
  assert.equal(scoreGate(tape).verdict, "ouster");
  tape.tenanted = true;
  tape.ouster = false;
  tape.inheritedWorktreeYank = false;
  tape.cue = "tenanted";
  assert.equal(scoreGate(tape).verdict, "tenanted");
});

test("writ, roll, key, door, and readBooth mark the ouster proof", () => {
  const idle = inspectWrit({ tenanted: true });
  assert.equal(idle.stamp, "writ-unserved");
  const roll = inspectRoll({ ouster: true, inheritedWorktreeYank: true });
  assert.equal(roll.stamp, "roll-cleared");
  assert.equal(roll.yanked, true);
  const key = inspectKey({ ouster: true, inheritedWorktreeYank: true });
  assert.equal(key.stamp, "key-yanked");
  const booth = readBooth({
    ouster: true,
    inheritedWorktreeYank: true,
    worktreeCleanlyRemoved: true,
  });
  assert.equal(booth.ouster, true);
  assert.equal(booth.mark, "ouster");
  const open = readBooth({
    tenanted: true,
    ouster: false,
    inheritedWorktreeYank: false,
  });
  assert.equal(open.ouster, false);
  assert.equal(open.mark, "tenanted");
  assert.equal(
    inspectDoor({ ouster: true, inheritedWorktreeYank: true }).stamp,
    "door-kicked",
  );
  assert.equal(inspectRoll({ tenanted: true }).stamp, "roll-occupied");
  assert.equal(
    inspectFlat({ ouster: true }).stamp,
    "flat-cleared",
  );
  assert.equal(
    inspectDesk({ ouster: true }).stamp,
    "desk-evicting",
  );
});

test("mapTenancy encodes the published open yank", () => {
  const miss = mapTenancy({ ouster: true, inheritedWorktreeYank: true });
  assert.equal(miss.stamp, "inherited-worktree-yank");
  assert.equal(miss.holdingLane, "cleared");
  assert.equal(miss.ribbon, "ouster");
  const clear = mapTenancy({ tenanted: true, ouster: false });
  assert.equal(clear.stamp, "tenanted-roll");
  assert.equal(clear.kindLane, "occupied");
  assert.equal(clear.holdingLane, "seated");
});

test("cousins cite #41010 and #76377 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 41010);
  assert.equal(COUSINS[1].issue, 76377);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("proscription"));
  assert.ok(NOT_PRODUCTS.includes("thimblerig"));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[8].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94221));
  assert.ok(!BACKUPS.some((row) => row.issue === 94202));
  assert.ok(!BACKUPS.some((row) => row.issue === 41010));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/ouster.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const tenantedFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/tenanted.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(tenantedFix.status, 0, tenantedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const tenantedOut = JSON.parse(tenantedFix.stdout);
  assert.equal(idleOut.verdict, "tenanted");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "ouster");
  assert.equal(seededOut.alarm, true);
  assert.equal(tenantedOut.verdict, "tenanted");
  assert.equal(tenantedOut.hold, true);
  assert.match(tenantedOut.phrase, /admit tenanted/);
});

test("handle exposes published hypothesis and #94221 headline", () => {
  const result = handle(seedOuster());
  assert.equal(result.published.issue, 94221);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [41010, 76377]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94221));
  assert.match(
    result.published.hypothesis,
    /auto-clean|worktree lock|nested inheritor|NON-BINDING|#94221/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94221/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the tenanted page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("tenanted page is a Georgian bailiff desk, not a Roman tablet", () => {
  const page = readPage();
  assert.match(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /Fragment\+Mono|Fragment Mono/);
  assert.match(
    page,
    /ouster|tenanted|inherited-worktree-yank|bailiff|tenancy|writ|iron key|street door|lodger/i,
  );
  assert.match(page, /#F4EFE4|#1C1917|#B08D57|#8B1E1E|#3F4A56|#2A6F6F|#6B645A/i);
  assert.match(page, /\btenanted\b/);
  assert.match(page, /\bouster\b/);
  assert.match(page, /inherited-worktree-yank/);
  assert.match(page, /Score ouster or admit tenanted/i);
  assert.match(page, /#358/);
  assert.match(page, /#94221/);
  assert.match(page, /Admit tenanted/);
  assert.match(page, /Score ouster/);
  assert.match(page, /Walk inherited-worktree-yank/);
  assert.match(page, /Compare tenanted \/ ouster/);
  assert.match(page, /Pin idle tenanted/);
  assert.match(page, /Pin seeded ouster/);
  assert.match(page, /Pin inherited-worktree-yank/);
  assert.match(page, /Serve the writ/);
  assert.match(page, /Score booth/);
  assert.match(page, /ouster-score/);
  assert.match(
    page,
    /inheritedWorktreePath|spawnDepth|worktreeCleanlyRemoved|Refusing to run there|2\.1\.220|06:44:58/i,
  );
  assert.match(page, /bailiff|tenancy|writ|iron key|street door|lodger|ledger|wax-seal/i);
  assert.match(page, /<svg[\s\S]*class="iron-key"|class="wax-seal"|class="tenancy-roll"|class="street-door"|class="parchment-writ"/i);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Rye|Rye/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /family=Literata|Literata/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code|Fira\+Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /Libre\+Caslon|Libre Caslon/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /carnival|cups-and-pea|fairground/i);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /marble lintel|wax tablet|iron stylus|torch-lit senate/i);
  assert.doesNotMatch(page, /admit barred|Score proscription|idle barred/i);
  assert.doesNotMatch(page, /admit additive|Score thimblerig|idle additive/i);
  assert.doesNotMatch(page, /admit literal|Score fetchling|idle literal/i);
  assert.doesNotMatch(page, /admit echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\bthimblerig\b/);
  assert.doesNotMatch(page, /\bfetchling\b/);
  assert.doesNotMatch(page, /\bproscription\b/);
  assert.doesNotMatch(page, /skill-row-carve/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /app-switch-echo-loss/);
  assert.doesNotMatch(page, /summarized-thinking-force/);
  assert.doesNotMatch(page, /cannot-show-not-git/);
  assert.match(page, /NOT Proscription/i);
  assert.match(page, /NOT Thimblerig/i);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /#41010/);
  assert.match(page, /#76377/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Ouster/);
  assert.match(readme, /#94221/);
  assert.match(readme, /\btenanted\b/);
  assert.match(readme, /\bouster\b/);
  assert.match(readme, /inherited-worktree-yank/);
  assert.match(readme, /Instrument Serif/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /Fragment Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Rye/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /INHERITED-WORKTREE-YANK|inheritedWorktreePath|worktreeCleanlyRemoved|Refusing to run there/i,
  );
  assert.match(readme, /NOT Proscription\/#94202/);
  assert.match(readme, /NOT Thimblerig\/#94174/);
  assert.match(readme, /NOT Fetchling\/#94065/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /#41010/);
  assert.match(readme, /#76377/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/ouster/);
  assert.match(readme, /node --test projects\/ouster\/ouster\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /bailiff|tenancy|writ|iron key|street door|lodger/i);
  assert.match(readme, /Score ouster or admit tenanted/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94059|#94053|#94151|#94064/,
  );
  assert.match(readme, /19:00/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Ouster/);
  assert.match(runLog, /19:00/);
});

test("catalog features Ouster only; Proscription unfeatured; product count 358", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 358);
  assert.equal(hub.products.length, 358);
  assert.equal(catalog.products[0].name, "Ouster");
  assert.equal(catalog.products[0].slug, "ouster");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/ouster/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "19:00 ouster: a common-law ouster / Georgian bailiff-desk / tenancy-roll / wax-seal notice / occupied-flat / iron-key / parchment-writ / ink-stained ledger / street-door booth for #94221. A subagent launched with isolation worktree starts a background child; the child inherits the same worktree (inheritedWorktreePath, spawnDepth: 2); the parent finishes without changes; Claude Code auto-removes the worktree (worktreeCleanlyRemoved: true); ~6–8s later every tool call in the still-running child fails with working directory no longer exists / Refusing to run there. Observed twice on 2026-09-14, Claude Code desktop 2.1.220 (macOS), main Opus 5, subagents Sonnet 5. Idle tenanted / seeded ouster / path inherited-worktree-yank. Score ouster or admit tenanted.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\btenanted\b/);
  assert.match(catalog.products[0].summary, /\bouster\b/);
  assert.match(catalog.products[0].summary, /inherited-worktree-yank/);
  assert.match(catalog.products[0].summary, /Score ouster or admit tenanted/);
  assert.match(catalog.products[0].summary, /#94221/);
  assert.equal(hub.products[0].slug, "ouster");
  assert.equal(hub.products[0].featured, true);
  const proscription = catalog.products.find((row) => row.slug === "proscription");
  assert.ok(proscription);
  assert.equal(proscription.featured, false);
  const thimblerig = catalog.products.find((row) => row.slug === "thimblerig");
  assert.ok(thimblerig);
  assert.equal(thimblerig.featured, false);
  const fetchling = catalog.products.find((row) => row.slug === "fetchling");
  assert.ok(fetchling);
  assert.equal(fetchling.featured, false);
  const diabolica = catalog.products.find((row) => row.slug === "diabolica");
  assert.ok(diabolica);
  assert.equal(diabolica.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "ouster").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94221") && row.slug !== "ouster",
    ),
  );
});

test("vercel rewrites ouster to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/ouster");
  assert.equal(vercel.rewrites[0].destination, "/projects/ouster");
  assert.equal(vercel.rewrites[1].source, "/ouster/");
  assert.equal(vercel.rewrites[1].destination, "/projects/ouster");
  assert.equal(vercel.rewrites[2].source, "/ouster/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/ouster/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
