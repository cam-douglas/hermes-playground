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
  CODE_BUILD,
  CODE_BUILD_OK,
  CODE_BUILD_STILL,
  COMMAND,
  COUSINS,
  PRECIS_WALK,
  DISTRIBUTION,
  EVIDENCE_ROWS,
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
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  ROW_KINDS,
  RULED_OUT,
  SAMPLE_PARAPHRASE_PROOF,
  SEEDED_WORD,
  SETTINGS_KEY,
  STATE,
  SURFACE,
  TERM,
  TERMINAL,
  TITLE,
  TUI_MODE,
  VERDICTS,
  WORKAROUND,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectParaphrase,
  inspectSummaryOnlyMark,
  inspectTokenBudgetMark,
  inspectTokenBudget,
  inspectInvokedSkills,
  inspectInvokedSkillsMark,
  inspectCompactManual,
  inspectCompactManualMark,
  inspectDocsReattach,
  inspectSkillBody,
  inspectSkillBodyMark,
  inspectInvokedBlock,
  mapPrecis,
  observeSkillDrop,
  readBooth,
  score,
  scoreGate,
  scoreSkillDrop,
  scoreWalk,
  seedParaphrase,
  seedSummaryOnly,
  seedGraftedSkill,
  seedInvokedSkills,
  seedCompactManual,
  seedCarried,
  seedSkillDrop,
  seedReknit,
  seedProduct,
  seedAttached,
} from "./precis.mjs";

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
  return fileURLToPath(new URL("./precis.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "21:10 precis: a precis / abstract / abridgement / skill-graft booth for #94564. After manual /compact, invoked skill content is not re-attached — only the compaction summary paraphrase survives (and can blur critical detail). Idle reknit / seeded paraphrase / path skill-drop. Score precis or admit reknit.";

test("idle reknit is a hold; click seats in the precis and the session opens", () => {
  const result = analyze(seedReknit());
  assert.equal(result.verdict, "reknit");
  assert.equal(result.idleWord, "reknit");
  assert.equal(IDLE_WORD, "reknit");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.reknit, true);
  assert.equal(result.phrase, "admit reknit");
  assert.equal(result.paraphrase, false);
  assert.equal(result.skillDrop, false);
  assert.ok(HOLD_ALIASES.includes("grafted-skill"));
  assert.ok(HOLD_ALIASES.includes("carried"));
  assert.ok(HOLD_ALIASES.includes("attached"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "seated");
  assert.notEqual(IDLE_WORD, "ascribed");
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "buoyed");
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "pledged");
});

test("empty ticket and empty stdin classify reknit", () => {
  assert.equal(classify(emptyTicket()), "reknit");
  assert.equal(classify(""), "reknit");
  assert.equal(classify(null), "reknit");
  assert.equal(decide({}), "reknit");
});

test("#94564 seeded path scores paraphrase when the pin never seats", () => {
  const result = analyze(seedParaphrase());
  assert.equal(result.verdict, "paraphrase");
  assert.equal(result.seededWord, "paraphrase");
  assert.equal(SEEDED_WORD, "paraphrase");
  assert.equal(PRODUCT_WORD, "precis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.paraphrase, true);
  assert.equal(result.phrase, "score precis");
  assert.equal(result.skillDrop, true);
  assert.equal(result.invokedSkills, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "miscast");
  assert.notEqual(SEEDED_WORD, "slipped");
  assert.notEqual(SEEDED_WORD, "freshet");
  assert.notEqual(PATH_WORD, "advisor-shadow");
  assert.notEqual(PATH_WORD, "iface-swap");
  assert.notEqual(PATH_WORD, "ptmx-race");
});

test("educational skill-drop helpers encode published reknit vs paraphrase paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(CODE_BUILD_OK, "2.1.270");
  assert.equal(CODE_BUILD_STILL, "2.1.270");
  assert.equal(TERMINAL, "macOS");
  assert.equal(TERM, "project-skill");
  assert.equal(TUI_MODE, "manual-compact");
  assert.equal(SETTINGS_KEY, "compact");
  assert.equal(COMMAND, "/compact");
  assert.equal(WORKAROUND, "re-invoke skill after compact");
  assert.deepEqual([...ROW_KINDS], [
    "invoked_skills block",
    "skill body (5k cap)",
    "summary paraphrase",
    "docs re-attach path",
  ]);
  const wet = observeSkillDrop({ clickLanded: true, selectionOpened: false });
  assert.equal(wet.dead, true);
  const shut = observeSkillDrop({ reknit: true });
  assert.equal(shut.dead, false);
  const hit = inspectInvokedSkills({});
  assert.equal(hit.missed, true);
  const held = inspectInvokedSkills({ reknit: true });
  assert.equal(held.missed, false);
  const hover = inspectCompactManual({});
  assert.equal(hover.missed, true);
  const clean = inspectCompactManual({ reknit: true });
  assert.equal(clean.missed, false);
  const deaf = inspectParaphrase({});
  assert.equal(deaf.deaf, true);
  const keys = inspectDocsReattach({});
  assert.equal(keys.stillWorks, true);
  const full = inspectTokenBudget({});
  assert.equal(full.flagged, true);
  const row = inspectSkillBody({});
  assert.equal(row.flagged, true);
  const dispatch = inspectInvokedBlock({});
  assert.equal(dispatch.flagged, true);
  const scored = scoreSkillDrop({
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
  });
  assert.equal(scored.paraphrase, true);
  assert.equal(scored.skillDrop, true);
  const intactPath = scoreSkillDrop({ reknit: true });
  assert.equal(intactPath.paraphrase, false);
  assert.equal(intactPath.reknit, true);
});

test("inspectors mark invoked-skills and compact-manual", () => {
  const hit = inspectInvokedSkillsMark({ paraphrase: true, invokedSkills: true });
  assert.equal(hit.stamp, "invoked-skills");
  assert.equal(hit.flagged, true);
  const hover = inspectCompactManualMark({ paraphrase: true, compactManual: true });
  assert.equal(hover.stamp, "compact-manual");
  assert.equal(hover.missed, true);
  const scored = scoreGate({
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
    cue: "paraphrase",
  });
  assert.equal(scored.verdict, "paraphrase");
  const open = inspectInvokedSkillsMark({ reknit: true, paraphrase: false });
  assert.equal(open.stamp, "grafted-skill");
});

test("path word is skill-drop; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "skill-drop");
  const result = analyze(seedSkillDrop());
  assert.equal(result.verdict, "skill-drop");
  assert.equal(result.pathWord, "skill-drop");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "skill-drop",
      preferSeed: true,
      paraphrase: true,
    }),
    "skill-drop",
  );
  assert.equal(classify({ seed: "invoked-skills", preferSeed: true }), "invoked-skills");
  assert.equal(score(seedSkillDrop()), "precis");
});

test("HOLD includes reknit; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("reknit"));
  const graftedSkill = analyze(seedGraftedSkill());
  assert.equal(graftedSkill.verdict, "grafted-skill");
  assert.equal(classify({ seed: "carried", preferSeed: true }), "carried");
  assert.equal(classify({ seed: "attached", preferSeed: true }), "attached");
});

test("alarm chips: invoked-skills, compact-manual, paraphrase", () => {
  assert.equal(classify({ seed: "invoked-skills", preferSeed: true }), "invoked-skills");
  assert.equal(classify(seedSkillDrop()), "skill-drop");
  assert.equal(classify(seedProduct()), "paraphrase");
  assert.equal(classify(seedCompactManual()), "compact-manual");
  assert.equal(classify({ seed: "summary-only", preferSeed: true }), "summary-only");
});

test("booth fixtures flip reknit vs paraphrase vs skill-drop", () => {
  const idle = scoreGate(seedReknit());
  const seeded = scoreGate(seedParaphrase());
  const reknit = readData("reknit.json");
  const deaf = readData("paraphrase.json");
  const issued = readData("94564.json");
  const path = readData("skill-drop.json");
  assert.equal(idle.verdict, "reknit");
  assert.equal(seeded.verdict, "paraphrase");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedReknit()), "reknit");
  assert.equal(score(seedParaphrase()), "precis");
  assert.equal(score({ seed: "skill-drop", preferSeed: true }), "precis");
  assert.equal(reknit.skillDrop, false);
  assert.equal(reknit.reknit, true);
  assert.equal(scoreGate(reknit).verdict, "reknit");
  assert.equal(deaf.skillDrop, true);
  assert.equal(deaf.invokedSkills, true);
  assert.equal(classify(deaf), "paraphrase");
  assert.equal(issued.issue, 94564);
  assert.equal(classify(issued), "paraphrase");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /reknit|grafted-skill|carried|attached/i);
  assert.match(path.paths[1].result, /skill-drop|invoked-skills|compact-manual|summary-only|paraphrase/i);
  assert.equal(classify(path), "skill-drop");
  assert.equal(deaf.hubCount, "PARAPHRASE");
  assert.equal(deaf.issue, 94564);
  assert.equal(deaf.paraphrase, true);
  assert.equal(classify(readData("grafted-skill.json")), "grafted-skill");
  assert.equal(classify(readData("carried.json")), "carried");
  assert.equal(classify(readData("attached.json")), "attached");
  assert.equal(classify(readData("invoked-skills.json")), "invoked-skills");
  assert.equal(classify(readData("compact-manual.json")), "compact-manual");
  assert.equal(classify(readData("summary-only.json")), "summary-only");
  assert.equal(classify(readData("token-budget.json")), "token-budget");
  assert.equal(classify(readData("skill-body.json")), "skill-body");
  assert.equal(classify(readData("docs-reattach.json")), "docs-reattach");
  assert.equal(classify(readData("invoked-block.json")), "invoked-block");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, []);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("subagent-spawn.json")), "invoked-skills");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("reknit"));
  assert.ok(CHIPS.includes("paraphrase"));
  assert.ok(CHIPS.includes("skill-drop"));
  assert.ok(CHIPS.includes("invoked-skills"));
  assert.ok(CHIPS.includes("compact-manual"));
  assert.ok(CHIPS.includes("summary-only"));
  assert.ok(CHIPS.includes("attached"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("paraphrase"));
  assert.ok(ALARM.includes("skill-drop"));
  assert.ok(ALARM.includes("invoked-skills"));
  assert.ok(ALARM.includes("compact-manual"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published precis walk scores paraphrase after the reknit hold", () => {
  const booth = scoreWalk({ rows: PRECIS_WALK });
  assert.equal(booth.verdict, "paraphrase");
  assert.ok(booth.paraphraseCount >= 1);
  const idle = booth.rows.find((row) => row.event === "atelier-bench");
  assert.equal(idle.reknit, true);
  assert.equal(idle.verdict, "reknit");
  const cut = booth.rows.find((row) => row.event === "skill-drop");
  assert.equal(cut.skillDrop, true);
  const path = booth.rows.find(
    (row) => row.event === "skill-drop" && row.t === "path",
  );
  assert.equal(path.verdict, "skill-drop");
});

test("PRECIS_WALK constant matches the issue core walk", () => {
  assert.equal(PRECIS_WALK[0].event, "atelier-bench");
  const cut = PRECIS_WALK.find((row) => row.event === "skill-drop");
  assert.equal(cut.skillDrop || cut.invokedSkills, true);
  const path = PRECIS_WALK.find((row) => row.t === "path");
  assert.equal(path.paraphrase, true);
  const scoreRow = PRECIS_WALK.find((row) => row.event === "paraphrase");
  assert.equal(scoreRow.paraphrase, true);
  assert.equal(scoreRow.invokedSkills, true);
});

test("positive control atelier-bench stays reknit", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "reknit");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "reknit");
  const hold = walk.rows.find((row) => row.event === "atelier-bench");
  assert.equal(hold.reknit, true);
  assert.equal(hold.verdict, "reknit");
});

test("issue constants encode only #94564 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94564);
  assert.ok(ISSUE_URL.includes("94564"));
  assert.match(TITLE, /compact|skill|paraphrase/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.270|compact|5279/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "skill-drop");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:skills", "area:compaction"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].lane, "invoked_skills block");
  assert.equal(EVIDENCE_ROWS[1].lane, "skill body (5k cap)");
  assert.equal(EVIDENCE_ROWS[2].lane, "summary paraphrase");
  assert.equal(EVIDENCE_ROWS[3].lane, "docs re-attach path");
  assert.ok(RULED_OUT.some((row) => /#94565|Detent/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Dictabelt|verbatim/i.test(row)));
  assert.ok(EXPECTED.some((row) => /skill|re-attach|reknit/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.270|compact|invoked_skills|paraphrase|5k|25k/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("skill-drop"));
  assert.ok(FINGERPRINT_LINES.includes("precis"));
  assert.equal(PHRASE, "Score precis or admit reknit.");
  assert.equal(SAMPLE_PARAPHRASE_PROOF.skillDrop, true);
  assert.equal(SAMPLE_PARAPHRASE_PROOF.names.length, 6);
  assert.equal(seedAttached().seed, "attached");
  assert.equal(seedCarried().seed, "carried");
  assert.equal(seedInvokedSkills().seed, "invoked-skills");
  assert.equal(seedCompactManual().seed, "compact-manual");
  assert.equal(seedSummaryOnly().seed, "summary-only");
});

test("has-repro fingerprints encode the published precis proof", () => {
  const result = handle(seedParaphrase());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "skill-drop");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedParaphrase()),
    /paraphrase\|kind=skill-drop\|ref=invoked-skills\|path=skill-drop\|cue=skill-drop/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and seated/ascribed/moored", () => {
  const required = [
    "ascribed",
    "seated",
    "moored",
    "lashed",
    "warped",
    "fendered",
    "slipped",
    "iface-swap",
    "buoyed",
    "mended",
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "released",
    "lit",
    "primed",
    "raised",
    "preserved",
    "tokenized",
    "blazoned",
    "tabard",
    "freshet",
    "kintsugi",
    "cenotaph",
    "stratum",
    "tmesis",
    "vedette",
    "orloj",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "init-flood",
    "heal-abort",
    "dead-install",
    "layer-unsealed",
    "mid-inject",
    "idle-exit",
    "half-life",
    "fork-resume",
    "brief-echo",
    "background-reset",
    "advisor-shadow",
    "ptmx-race",
    "ungloved",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("reknit booth flips paraphrase back when the ratchet admits reknit", () => {
  const tape = {
    reknit: true,
    paraphrase: false,
    skillDrop: false,
    cue: "reknit",
  };
  assert.equal(scoreGate(tape).verdict, "reknit");
  tape.reknit = false;
  tape.paraphrase = true;
  tape.skillDrop = true;
  tape.cue = "paraphrase";
  assert.equal(scoreGate(tape).verdict, "paraphrase");
  tape.reknit = true;
  tape.paraphrase = false;
  tape.skillDrop = false;
  tape.cue = "reknit";
  assert.equal(scoreGate(tape).verdict, "reknit");
});

test("inspectors and readBooth mark the paraphrase proof", () => {
  const hit = inspectInvokedSkillsMark({ paraphrase: true });
  assert.equal(hit.stamp, "invoked-skills");
  const hover = inspectCompactManualMark({ paraphrase: true, compactManual: true });
  assert.equal(hover.stamp, "compact-manual");
  assert.equal(hover.missed, true);
  const booth = readBooth({
    paraphrase: true,
    skillDrop: true,
    invokedSkills: true,
  });
  assert.equal(booth.paraphrase, true);
  assert.equal(booth.mark, "paraphrase");
  const open = readBooth({
    reknit: true,
    paraphrase: false,
    skillDrop: false,
  });
  assert.equal(open.paraphrase, false);
  assert.equal(open.mark, "reknit");
  assert.equal(inspectSummaryOnlyMark({ paraphrase: true, summaryOnly: true }).stamp, "summary-only");
  assert.equal(inspectTokenBudgetMark({ paraphrase: true, tokenBudget: true }).stamp, "token-budget");
  assert.equal(inspectSkillBodyMark({ paraphrase: true, skillBody: true }).stamp, "skill-body");
});

test("mapPrecis encodes the published skill-drop", () => {
  const miss = mapPrecis({ paraphrase: true, skillDrop: true });
  assert.equal(miss.stamp, "skill-drop");
  assert.equal(miss.holdingLane, "paraphrase");
  assert.equal(miss.ribbon, "paraphrase");
  const clear = mapPrecis({ reknit: true, paraphrase: false });
  assert.equal(clear.stamp, "atelier-bench");
  assert.equal(clear.kindLane, "ratchet-wheel");
  assert.equal(clear.holdingLane, "atelier-bench");
});

test("cousins stay empty; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(NOT_PRODUCTS.includes("prosopon"));
  assert.ok(NOT_PRODUCTS.includes("slipway"));
  assert.ok(NOT_PRODUCTS.includes("freshet"));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 94565);
  assert.equal(BACKUPS[6].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94564));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/paraphrase.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const reknitFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/reknit.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(reknitFix.status, 0, reknitFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const reknitOut = JSON.parse(reknitFix.stdout);
  assert.equal(idleOut.verdict, "reknit");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "paraphrase");
  assert.equal(seededOut.alarm, true);
  assert.equal(reknitOut.verdict, "reknit");
  assert.equal(reknitOut.hold, true);
  assert.match(reknitOut.phrase, /admit reknit/);
});

test("handle exposes published hypothesis and #94564 headline", () => {
  const result = handle(seedParaphrase());
  assert.equal(result.published.issue, 94564);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(94565));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94564));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /compact|paraphrase|skill|re-attach|NON-BINDING|#94564/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94564/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the reknit page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("reknit page is an abstract abridgement booth, not detent or dictabelt", () => {
  const page = readPage();
  assert.match(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /precis|reknit|paraphrase|skill-drop|abstract-frame|graft-splice|summary-fold|skill-drop-zone/i,
  );
  assert.match(page, /#1a1d24|#5c4d7d|#4a6b5a|#c45c4a|#f4f0e8|#2d3142/i);
  assert.match(page, /\breknit\b/);
  assert.match(page, /paraphrase/);
  assert.match(page, /skill-drop/);
  assert.match(page, /Score precis or admit reknit/i);
  assert.match(page, /#389/);
  assert.match(page, /#94564/);
  assert.match(page, /Admit reknit/);
  assert.match(page, /Score precis/);
  assert.match(page, /Walk skill-drop/);
  assert.match(page, /Compare reknit \/ paraphrase/);
  assert.match(page, /Pin idle reknit/);
  assert.match(page, /Pin seeded paraphrase/);
  assert.match(page, /Pin skill-drop/);
  assert.match(page, /Stamp invoked-skills/);
  assert.match(page, /Score booth/);
  assert.match(page, /precis-score/);
  assert.match(
    page,
    /\/compact|2\.1\.270|invoked_skills|paraphrase|background subagent|213828|8106/i,
  );
  assert.match(page, /abstract-frame|graft-splice|summary-fold|skill-drop-zone/i);
  assert.match(
    page,
    /<svg[\s\S]*class="abstract-frame"|class="graft-splice"|class="summary-fold"|class="skill-drop-zone"/i,
  );
  assert.match(page, /body\.reknit|body\.paraphrase|body\.skill-drop/);
  assert.match(page, /evidence-table|invoked_skills|summary paraphrase|skill body/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#0B0A0F|#C4A574|#3F5E3A|#E2B457|#6B1E2A|#E8E0D4/);
  assert.doesNotMatch(page, /#06141F|#A34428|#EFA31A|#B7C2CC|#1E5346|#0C1C22/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /#1F2328|#8A9199|#8B1E2D|#E8E0D0|#B8953A|#2C3138/);
  assert.doesNotMatch(page, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /vacant sarcophagus|Portland-stone|memorial yard/i);
  assert.doesNotMatch(page, /keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i);
  assert.doesNotMatch(page, /clay-mask|olive-wreath|marble-plinth|night amphitheatre/i);
  assert.doesNotMatch(page, /admit ascribed|Score prosopon|idle ascribed/i);
  assert.doesNotMatch(page, /admit moored|Score slipway|idle moored/i);
  assert.doesNotMatch(page, /admit seated|Score cathead|idle seated/i);
  assert.doesNotMatch(page, /\bprosopon\b/);
  assert.doesNotMatch(page, /\bslipway\b/);
  assert.doesNotMatch(page, /\bfreshet\b/);
  assert.doesNotMatch(page, /\bkintsugi\b/);
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\bcathead\b/);
  assert.doesNotMatch(page, /advisor-shadow/);
  assert.doesNotMatch(page, /iface-swap/);
  assert.doesNotMatch(page, /init-flood/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /ptmx-race/);
  assert.doesNotMatch(page, /tabard|blazon|herald/i);
  assert.match(page, /NOT Prosopon/i);
  assert.match(page, /NOT Slipway/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT #94575/i);
  assert.match(page, /NOT #94458/i);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Precis/);
  assert.match(readme, /#94564/);
  assert.match(readme, /\breknit\b/);
  assert.match(readme, /paraphrase/);
  assert.match(readme, /skill-drop/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Plus Jakarta Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /\/compact|2\.1\.270|invoked_skills|paraphrase|skill-drop/i);
  assert.match(readme, /NOT Prosopon/);
  assert.match(readme, /NOT Slipway/);
  assert.match(readme, /NOT Cathead/);
  assert.match(readme, /NOT #94575/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/precis/);
  assert.match(readme, /node --test projects\/precis\/precis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /abstract|abridgement|skill-graft|precis booth/i);
  assert.match(readme, /Score precis or admit reknit/);
  assert.match(readme, /#94565|#94151|#94553|#94560/);
  assert.doesNotMatch(readme, /backup #94564 as next/i);
  assert.match(readme, /21:10/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bprosopon\b/);
  assert.doesNotMatch(readme, /\bslipway\b/);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-17 — Precis/);
  assert.match(runLog, /21:10/);
});

test("catalog features Precis only; Prosopon unfeatured; product count 389", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 389);
  assert.equal(hub.products.length, 389);
  assert.equal(catalog.products[0].name, "Precis");
  assert.equal(catalog.products[0].slug, "precis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/precis/");
  assert.equal(catalog.products[0].day, "2026-09-17");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\breknit\b/);
  assert.match(catalog.products[0].summary, /paraphrase/);
  assert.match(catalog.products[0].summary, /skill-drop/);
  assert.match(catalog.products[0].summary, /Score precis or admit reknit/);
  assert.match(catalog.products[0].summary, /#94564/);
  assert.match(catalog.products[0].summary, /21:10/);
  assert.equal(hub.products[0].slug, "precis");
  assert.equal(hub.products[0].featured, true);
  const prosopon = catalog.products.find((row) => row.slug === "prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.featured, false);
  const slipway = catalog.products.find((row) => row.slug === "slipway");
  assert.ok(slipway);
  assert.equal(slipway.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "precis" && row.featured).length,
    1,
  );
  const detent = catalog.products.find((row) => row.slug === "detent");
  assert.ok(detent);
  assert.equal(detent.featured, false);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94564") && row.slug !== "precis",
    ),
  );
});

test("vercel rewrites precis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/precis");
  assert.equal(vercel.rewrites[0].destination, "/projects/precis");
  assert.equal(vercel.rewrites[1].source, "/precis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/precis");
  assert.equal(vercel.rewrites[2].source, "/precis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/precis/:path*");
  const prosopon = vercel.rewrites.find((row) => row.source === "/prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.destination, "/projects/prosopon");
});

test("no leftover clone / theatre / dry-dock / masque content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque|copper-kettle|treacle-well|vacant sarcophagus|cracked-bowl|urushi-pot|kiln-mouth|gold-seam|hemp-rope winch|bollard-post|gangway-plank|keel-cradle|sodium-lamp|clay-mask|olive-wreath|marble-plinth/i);
  }
  assert.doesNotMatch(source, /staff gauge overtopped|floodplain plaque|urushi pot|cracked bowl|vacant sarcophagus|keel cradle|clay mask/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
