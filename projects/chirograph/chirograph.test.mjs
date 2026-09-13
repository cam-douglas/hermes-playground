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
  CHIROGRAPH_WALK,
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
  SAMPLE_CHIROGRAPH_PROOF,
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
  inspectFallback,
  inspectMoiety,
  inspectReclaim,
  inspectRecorded,
  inspectRename,
  mapCharter,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBranchM,
  seedChirograph,
  seedHold,
  seedInvalidReference,
  seedMatched,
  seedProduct,
  seedRecordedBranch,
  seedWorktreeRenameStale,
} from "./chirograph.mjs";

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
  return fileURLToPath(new URL("./chirograph.mjs", import.meta.url));
}

test("idle matched is a hold; moieties still correspond", () => {
  const result = analyze(seedMatched());
  assert.equal(result.verdict, "matched");
  assert.equal(result.idleWord, "matched");
  assert.equal(IDLE_WORD, "matched");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.matched, true);
  assert.equal(result.phrase, "admit matched");
  assert.equal(result.chirograph, false);
  assert.equal(result.worktreeRenameStale, false);
  assert.ok(HOLD_ALIASES.includes("matched"));
  assert.ok(HOLD_ALIASES.includes("bipartite"));
  assert.ok(HOLD_ALIASES.includes("moiety"));
  assert.ok(HOLD_ALIASES.includes("indenture"));
  assert.ok(HOLD_ALIASES.includes("current"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify matched", () => {
  assert.equal(classify(emptyTicket()), "matched");
  assert.equal(classify(""), "matched");
  assert.equal(classify(null), "matched");
  assert.equal(decide({}), "matched");
});

test("#94045 seeded path scores chirograph when recorded branch is stale after git branch -m", () => {
  const result = analyze(seedChirograph());
  assert.equal(result.verdict, "chirograph");
  assert.equal(result.seededWord, "chirograph");
  assert.equal(SEEDED_WORD, "chirograph");
  assert.equal(PRODUCT_WORD, "chirograph");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.chirograph, true);
  assert.equal(result.phrase, "score chirograph");
  assert.equal(result.worktreeRenameStale, true);
  assert.equal(result.recordedBranch, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark split moiety and recorded-branch", () => {
  const moiety = inspectMoiety({ chirograph: true, worktreeRenameStale: true });
  assert.equal(moiety.stamp, "moiety-split");
  assert.equal(moiety.split, true);
  const recorded = inspectRecorded({ chirograph: true, recordedBranch: true });
  assert.equal(recorded.stamp, "recorded-branch");
  assert.equal(recorded.stale, true);
  const reclaim = inspectReclaim({ chirograph: true, invalidReference: true });
  assert.equal(reclaim.stamp, "invalid-reference");
  const scored = scoreGate({
    chirograph: true,
    worktreeRenameStale: true,
    recordedBranch: true,
    invalidReference: true,
    cue: "chirograph",
  });
  assert.equal(scored.verdict, "chirograph");
  const open = inspectMoiety({ matched: true, chirograph: false });
  assert.equal(open.stamp, "moiety-matched");
});

test("path word is worktree-rename-stale; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "worktree-rename-stale");
  const result = analyze(seedWorktreeRenameStale());
  assert.equal(result.verdict, "worktree-rename-stale");
  assert.equal(result.pathWord, "worktree-rename-stale");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "worktree-rename-stale", preferSeed: true, chirograph: true }),
    "worktree-rename-stale",
  );
  assert.equal(classify(seedRecordedBranch()), "recorded-branch");
});

test("HOLD includes matched / hold", () => {
  assert.ok(HOLD.includes("matched"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: recorded-branch, branch-m, chirograph", () => {
  assert.equal(classify(seedRecordedBranch()), "recorded-branch");
  assert.equal(classify(seedBranchM()), "branch-m");
  assert.equal(classify(seedInvalidReference()), "invalid-reference");
  assert.equal(classify(seedProduct()), "chirograph");
});

test("booth fixtures flip matched vs chirograph vs worktree-rename-stale", () => {
  const idle = scoreGate(seedMatched());
  const seeded = scoreGate(seedChirograph());
  const matched = readData("matched.json");
  const chirograph = readData("chirograph.json");
  const path = readData("worktree-rename-stale.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "matched");
  assert.equal(seeded.verdict, "chirograph");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedMatched()), "matched");
  assert.equal(score(seedChirograph()), "chirograph");
  assert.equal(matched.worktreeRenameStale, false);
  assert.equal(matched.matched, true);
  assert.equal(scoreGate(matched).verdict, "matched");
  assert.equal(chirograph.worktreeRenameStale, true);
  assert.equal(chirograph.recordedBranch, true);
  assert.equal(chirograph.invalidReference, true);
  assert.equal(classify(chirograph), "chirograph");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /matched|bipartite|moiety|indenture|current/i);
  assert.match(path.paths[1].result, /invalid reference|branch -m|recorded|fallback|uncommitted/i);
  assert.equal(classify(path), "worktree-rename-stale");
  assert.equal(chirograph.hubCount, "CHIROGRAPH");
  assert.equal(chirograph.issue, 94045);
  assert.equal(chirograph.chirograph, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("bipartite.json")), "bipartite");
  assert.equal(classify(readData("moiety.json")), "moiety");
  assert.equal(classify(readData("indenture.json")), "indenture");
  assert.equal(classify(readData("current.json")), "current");
  assert.equal(classify(readData("recorded-branch.json")), "recorded-branch");
  assert.equal(classify(readData("branch-m.json")), "branch-m");
  assert.equal(classify(readData("invalid-reference.json")), "invalid-reference");
  assert.equal(classify(readData("pool-re-lease-failed.json")), "pool-re-lease-failed");
  assert.equal(classify(readData("fallback-main-repo.json")), "fallback-main-repo");
  assert.equal(classify(readData("uncommitted-lost.json")), "uncommitted-lost");
  assert.equal(classify(readData("false-reassurance.json")), "false-reassurance");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("matched"));
  assert.ok(CHIPS.includes("chirograph"));
  assert.ok(CHIPS.includes("worktree-rename-stale"));
  assert.ok(CHIPS.includes("recorded-branch"));
  assert.ok(CHIPS.includes("branch-m"));
  assert.ok(CHIPS.includes("bipartite"));
  assert.ok(CHIPS.includes("moiety"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("chirograph"));
  assert.ok(ALARM.includes("worktree-rename-stale"));
  assert.ok(ALARM.includes("recorded-branch"));
  assert.ok(ALARM.includes("branch-m"));
  assert.ok(ALARM.includes("invalid-reference"));
  assert.ok(ALARM.includes("pool-re-lease-failed"));
  assert.ok(ALARM.includes("fallback-main-repo"));
  assert.ok(ALARM.includes("uncommitted-lost"));
  assert.ok(ALARM.includes("false-reassurance"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published chirograph walk scores chirograph after the idle hold", () => {
  const booth = scoreWalk({ rows: CHIROGRAPH_WALK });
  assert.equal(booth.verdict, "chirograph");
  assert.ok(booth.chirographCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-matched");
  assert.equal(idle.matched, true);
  assert.equal(idle.verdict, "matched");
  const cut = booth.rows.find((row) => row.event === "worktree-rename-stale");
  assert.equal(cut.worktreeRenameStale, true);
  const path = booth.rows.find((row) => row.event === "worktree-rename-stale" && row.t === "path");
  assert.equal(path.verdict, "worktree-rename-stale");
});

test("CHIROGRAPH_WALK constant matches the issue indenture walk", () => {
  assert.equal(CHIROGRAPH_WALK[0].event, "cue-matched");
  const cut = CHIROGRAPH_WALK.find((row) => row.event === "worktree-rename-stale");
  assert.equal(cut.worktreeRenameStale || cut.invalidReference, true);
  const path = CHIROGRAPH_WALK.find((row) => row.t === "path");
  assert.equal(path.chirograph, true);
  const scoreRow = CHIROGRAPH_WALK.find((row) => row.event === "chirograph");
  assert.equal(scoreRow.chirograph, true);
});

test("positive control matched indenture stays matched", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "matched");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "matched");
  const hold = walk.rows.find((row) => row.event === "cue-matched");
  assert.equal(hold.matched, true);
  assert.equal(hold.verdict, "matched");
});

test("issue constants encode only #94045 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94045);
  assert.ok(ISSUE_URL.includes("94045"));
  assert.match(TITLE, /Worktree branch rename|harness|main repo/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /worktree/i);
  assert.equal(BUILD, "2.1.269");
  assert.equal(SURFACE, "worktree-rename-stale");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:macos", "data-loss"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Mondegreen|#93193/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Monadnock/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Titulus|#94025/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Derelict|#93996/i.test(row)));
  assert.ok(EXPECTED.some((row) => /branch -m|recorded|invalid reference|uncommitted|claude\//i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|git branch -m|invalid reference|Pool re-lease|sweet-herschel|45 fallbacks/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("worktree-rename-stale"));
  assert.ok(FINGERPRINT_LINES.includes("chirograph"));
  assert.equal(PHRASE, "Score chirograph or admit matched.");
  assert.equal(SAMPLE_CHIROGRAPH_PROOF.worktreeRenameStale, true);
});

test("has-repro fingerprints encode the published chirograph proof", () => {
  const result = handle(seedChirograph());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "worktree-rename-stale");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedChirograph()),
    /chirograph\|kind=worktree-rename-stale\|ref=invalid\|path=worktree-rename-stale\|cue=worktree-rename-stale/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes inscribed/titulus/berthed/pegged and recent catalog words", () => {
  const required = [
    "inscribed",
    "titulus",
    "resume-stale-title",
    "plaque",
    "latest-wins",
    "synced",
    "pegged",
    "vestry",
    "mount-refcount-race",
    "tempered",
    "surfeit",
    "quota-spawn-cascade",
    "quiescent",
    "phosphene",
    "layer-tree-walk",
    "diplomatic",
    "parablepsis",
    "latin1-edit-wipe",
    "demesned",
    "demesne",
    "home-bind-overreach",
    "diagrammed",
    "cartouche",
    "section-poster",
    "unattainted",
    "attaint",
    "session-attainder",
    "reflowed",
    "oriel",
    "plan-no-reflow",
    "articulate",
    "anarthria",
    "dictation-paste-drop",
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "injective",
    "crased",
    "crasis",
    "unitary",
    "tessellated",
    "verbatim",
    "mojibaked",
    "afterimage",
    "scotoma",
    "followspot",
    "thrash",
    "solvent",
    "frugal",
    "circuit-held",
    "no-spawn",
    "vested",
    "plenary",
    "berthed",
    "derelict",
    "session-kill-orphan",
    "mondegreen",
    "monadnock",
    "escheat",
    "midden",
    "entresol",
    "deadletter",
    "gland",
    "diplopia",
    "fulcrum",
    "gleaner",
    "apograph",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("matched booth flips chirograph back when the indenture is matched", () => {
  const tape = {
    matched: true,
    chirograph: false,
    worktreeRenameStale: false,
    cue: "matched",
  };
  assert.equal(scoreGate(tape).verdict, "matched");
  tape.matched = false;
  tape.chirograph = true;
  tape.worktreeRenameStale = true;
  tape.recordedBranch = true;
  tape.cue = "chirograph";
  assert.equal(scoreGate(tape).verdict, "chirograph");
  tape.matched = true;
  tape.chirograph = false;
  tape.worktreeRenameStale = false;
  tape.recordedBranch = false;
  tape.cue = "matched";
  assert.equal(scoreGate(tape).verdict, "matched");
});

test("moiety, recorded, reclaim, and readBooth mark the chirograph proof", () => {
  const idle = inspectMoiety({
    matched: true,
  });
  assert.equal(idle.stamp, "moiety-matched");
  const recorded = inspectRecorded({ chirograph: true, recordedBranch: true });
  assert.equal(recorded.stamp, "recorded-branch");
  assert.equal(recorded.stale, true);
  const reclaim = inspectReclaim({ chirograph: true, invalidReference: true });
  assert.equal(reclaim.stamp, "invalid-reference");
  const booth = readBooth({
    chirograph: true,
    worktreeRenameStale: true,
    recordedBranch: true,
  });
  assert.equal(booth.chirograph, true);
  assert.equal(booth.mark, "chirograph");
  const open = readBooth({
    matched: true,
    chirograph: false,
    worktreeRenameStale: false,
  });
  assert.equal(open.chirograph, false);
  assert.equal(open.mark, "matched");
  assert.equal(inspectRename({ chirograph: true, branchM: true }).stamp, "branch-m");
  assert.equal(inspectFallback({ chirograph: true, fallbackMainRepo: true }).stamp, "fallback-main-repo");
});

test("mapCharter encodes the published split indenture", () => {
  const miss = mapCharter({ chirograph: true, worktreeRenameStale: true });
  assert.equal(miss.stamp, "worktree-rename-stale");
  assert.equal(miss.holdingLane, "split");
  assert.equal(miss.ribbon, "chirograph");
  const clear = mapCharter({ matched: true, chirograph: false });
  assert.equal(clear.stamp, "matched-indenture");
  assert.equal(clear.kindLane, "indenture");
  assert.equal(clear.holdingLane, "moiety");
});

test("cousins cite #54653 #53061 #85114 #85195 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 54653);
  assert.equal(COUSINS[1].issue, 53061);
  assert.equal(COUSINS[2].issue, 85114);
  assert.equal(COUSINS[3].issue, 85195);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("titulus"));
  assert.ok(NOT_PRODUCTS.includes("derelict"));
  assert.ok(NOT_PRODUCTS.includes("vestry"));
  assert.ok(NOT_PRODUCTS.includes("surfeit"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("monadnock"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("fulcrum"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[1].issue, 93924);
  assert.equal(BACKUPS[2].issue, 94032);
  assert.equal(BACKUPS[3].issue, 94029);
  assert.equal(BACKUPS[4].issue, 94031);
  assert.equal(BACKUPS[5].issue, 93770);
  assert.equal(BACKUPS[6].issue, 93777);
  assert.equal(BACKUPS[7].issue, 94040);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94045));
  assert.ok(!BACKUPS.some((row) => row.issue === 54653));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/chirograph.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const matchedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/matched.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(matchedFix.status, 0, matchedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const matchedOut = JSON.parse(matchedFix.stdout);
  assert.equal(idleOut.verdict, "matched");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "chirograph");
  assert.equal(seededOut.alarm, true);
  assert.equal(matchedOut.verdict, "matched");
  assert.equal(matchedOut.hold, true);
  assert.match(matchedOut.phrase, /admit matched/);
});

test("handle exposes published hypothesis and #94045 headline", () => {
  const result = handle(seedChirograph());
  assert.equal(result.published.issue, 94045);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [54653, 53061, 85114, 85195]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(94040));
  assert.ok(!result.published.backups.includes(94045));
  assert.match(result.published.hypothesis, /git branch -m|recorded|worktree add|NON-BINDING|#94045/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94045/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a medieval chirograph lectern booth, not Roman plaque or salvage pier or vestry", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(page, /chirograph|matched|worktree-rename-stale|indenture|moiety|lectern|parchment/i);
  assert.match(page, /#E8D7B0|#14110C|#A11F38|#3A6A52|#6A3D18|#F0E4C8|#B8A47A|#1B140E/i);
  assert.match(page, /\bmatched\b/);
  assert.match(page, /\bchirograph\b/);
  assert.match(page, /worktree-rename-stale/);
  assert.match(page, /Score chirograph or admit matched/i);
  assert.match(page, /#346/);
  assert.match(page, /#94045/);
  assert.match(page, /Admit matched/);
  assert.match(page, /Score chirograph/);
  assert.match(page, /Walk worktree-rename-stale/);
  assert.match(page, /Compare matched \/ chirograph/);
  assert.match(page, /Pin idle matched/);
  assert.match(page, /Pin seeded chirograph/);
  assert.match(page, /Pin worktree-rename-stale/);
  assert.match(page, /Seal the moieties/);
  assert.match(page, /Score booth/);
  assert.match(page, /chirograph-score/);
  assert.match(page, /git branch -m|invalid reference|Pool re-lease|claude\/|2\.1\.269|uncommitted|45 fallbacks/i);
  assert.match(page, /lectern|parchment|indenture|moiety|chirograph|gall|wax|oak/i);
  assert.doesNotMatch(page, /family=Forum|Forum/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /family=Spectral/);
  assert.doesNotMatch(page, /Nunito|family=Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Mono|family=Fira/);
  assert.doesNotMatch(page, /family=Cormorant\+Upright|Cormorant Upright/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /Fraunces|family=Fraunces/);
  assert.doesNotMatch(page, /Manrope|family=Manrope/);
  assert.doesNotMatch(page, /DM Mono|DM\+Mono/);
  assert.doesNotMatch(page, /Syne|family=Syne/);
  assert.doesNotMatch(page, /Sora|family=Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#8C6A3F/);
  assert.doesNotMatch(page, /#1F3A5F/);
  assert.doesNotMatch(page, /#8B3A2A/);
  assert.doesNotMatch(page, /#C5D0D4/);
  assert.doesNotMatch(page, /#D4A017/);
  assert.doesNotMatch(page, /sacristy|peg-rail|stole|acolyte|vestment|robe-rail/i);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|limestone/i);
  assert.doesNotMatch(page, /court roll|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /banquet cellar|empty cask|quota-spawn/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward/i);
  assert.doesNotMatch(page, /hawser|bosun|keel|berthed|maritime/i);
  assert.doesNotMatch(page, /funerary-titulus|bronze lettering|marble name-plaque/i);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.doesNotMatch(page, /\btitulus\b/);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /\btempered\b/);
  assert.doesNotMatch(page, /\bsurfeit\b/);
  assert.doesNotMatch(page, /\bpegged\b/);
  assert.doesNotMatch(page, /\bvestry\b/);
  assert.doesNotMatch(page, /\bderelict\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /quota-spawn-cascade/);
  assert.doesNotMatch(page, /mount-refcount-race/);
  assert.doesNotMatch(page, /resume-stale-title/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Titulus/i);
  assert.match(page, /NOT Derelict/i);
  assert.match(page, /NOT Vestry/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Monadnock/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Surfeit/i);
  assert.match(page, /NOT Phosphene/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Chirograph/);
  assert.match(readme, /#94045/);
  assert.match(readme, /\bmatched\b/);
  assert.match(readme, /\bchirograph\b/);
  assert.match(readme, /worktree-rename-stale/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Forum/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.doesNotMatch(readme, /Space Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Nunito/);
  assert.doesNotMatch(readme, /Fira/);
  assert.doesNotMatch(readme, /Cormorant Upright/);
  assert.doesNotMatch(readme, /Karla/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /EB Garamond/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /WORKTREE-RENAME-STALE|RECORDED BRANCH NEVER REFRESHED/i);
  assert.match(readme, /NOT Titulus\/#94025/);
  assert.match(readme, /NOT Derelict\/#93996/);
  assert.match(readme, /NOT Vestry\/#94008/);
  assert.match(readme, /NOT Mondegreen\/#93193/);
  assert.match(readme, /NOT Monadnock/);
  assert.match(readme, /NOT Escheat/);
  assert.match(readme, /NOT Midden/);
  assert.match(readme, /NOT Entresol/);
  assert.match(readme, /NOT Surfeit\/#94012/);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /#54653|#53061|#85114|#85195/);
  assert.match(readme, /2\.1\.269|git branch -m|invalid reference|Pool re-lease/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/chirograph/);
  assert.match(readme, /node --test projects\/chirograph\/chirograph\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /lectern|parchment|indenture|moiety|chirograph/i);
  assert.match(readme, /Score chirograph or admit matched/);
  assert.match(readme, /#93987|#93924|#94032|#94029|#94031|#93770|#93777|#94040/);
  assert.match(readme, /05:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Chirograph/);
  assert.match(runLog, /05:50/);
});

test("catalog features Chirograph only; Titulus unfeatured; product count 346", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 346);
  assert.equal(hub.products.length, 346);
  assert.equal(catalog.products[0].name, "Chirograph");
  assert.equal(catalog.products[0].slug, "chirograph");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/chirograph/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "05:50 chirograph: a medieval chirograph / bipartite-indenture booth for #94045. Desktop records the worktree branch at create and never refreshes after git branch -m; recycle recovery invalid-ref falls back to the main repo; uncommitted work is lost and the notice names a branch that no longer exists. Idle matched / seeded chirograph / path worktree-rename-stale. Score chirograph or admit matched.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bmatched\b/);
  assert.match(catalog.products[0].summary, /\bchirograph\b/);
  assert.match(catalog.products[0].summary, /worktree-rename-stale/);
  assert.match(catalog.products[0].summary, /Score chirograph or admit matched/);
  assert.equal(hub.products[0].slug, "chirograph");
  assert.equal(hub.products[0].featured, true);
  const titulus = catalog.products.find((row) => row.slug === "titulus");
  assert.ok(titulus);
  assert.equal(titulus.featured, false);
  const derelict = catalog.products.find((row) => row.slug === "derelict");
  assert.ok(derelict);
  assert.equal(derelict.featured, false);
  const vestry = catalog.products.find((row) => row.slug === "vestry");
  assert.ok(vestry);
  assert.equal(vestry.featured, false);
  const surfeit = catalog.products.find((row) => row.slug === "surfeit");
  assert.ok(surfeit);
  assert.equal(surfeit.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "chirograph").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94045") && row.slug !== "chirograph"));
});

test("vercel rewrites chirograph to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/chirograph");
  assert.equal(vercel.rewrites[0].destination, "/projects/chirograph");
  assert.equal(vercel.rewrites[1].source, "/chirograph/");
  assert.equal(vercel.rewrites[1].destination, "/projects/chirograph");
  assert.equal(vercel.rewrites[2].source, "/chirograph/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/chirograph/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
