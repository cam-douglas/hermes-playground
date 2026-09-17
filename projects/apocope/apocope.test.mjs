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
  APOCOPE_WALK,
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
  SAMPLE_TRUNCATED_PROOF,
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
  inspectTruncated,
  inspectUnmarkedResultMark,
  inspectPercentKeptMark,
  inspectPercentKept,
  inspectWebfetch,
  inspectWebfetchMark,
  inspectToolDesc,
  inspectToolDescMark,
  inspectCurlRemedy,
  inspectRfc9110,
  inspectRfc9110Mark,
  inspectWebFetchSubagent,
  mapApocope,
  observeUnmarked,
  readBooth,
  score,
  scoreGate,
  scoreUnmarked,
  scoreWalk,
  seedTruncated,
  seedUnmarkedResult,
  seedDeclared,
  seedWebfetch,
  seedToolDesc,
  seedSignaled,
  seedUnmarked,
  seedFlagged,
  seedProduct,
  seedMarked,
} from "./apocope.mjs";

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
  return fileURLToPath(new URL("./apocope.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "21:10 apocope: a linguistic apocope / manuscript end-clip / elision / WebFetch-cut booth for #95127. WebFetch truncates long pages with no limit in the tool description and no truncation flag in the result; the web-fetch subagent has no Bash to curl the tail. Idle flagged / seeded truncated / path unmarked. Score apocope or admit flagged.";

test("idle flagged is a hold; truncation should be marked in the WebFetch result", () => {
  const result = analyze(seedFlagged());
  assert.equal(result.verdict, "flagged");
  assert.equal(result.idleWord, "flagged");
  assert.equal(IDLE_WORD, "flagged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flagged, true);
  assert.equal(result.phrase, "admit flagged");
  assert.equal(result.truncated, false);
  assert.equal(result.unmarked, false);
  assert.ok(HOLD_ALIASES.includes("declared"));
  assert.ok(HOLD_ALIASES.includes("signaled"));
  assert.ok(HOLD_ALIASES.includes("marked"));
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

test("empty ticket and empty stdin classify flagged", () => {
  assert.equal(classify(emptyTicket()), "flagged");
  assert.equal(classify(""), "flagged");
  assert.equal(classify(null), "flagged");
  assert.equal(decide({}), "flagged");
});

test("#95127 seeded path scores truncated when the pin never seats", () => {
  const result = analyze(seedTruncated());
  assert.equal(result.verdict, "truncated");
  assert.equal(result.seededWord, "truncated");
  assert.equal(SEEDED_WORD, "truncated");
  assert.equal(PRODUCT_WORD, "apocope");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.truncated, true);
  assert.equal(result.phrase, "score apocope");
  assert.equal(result.unmarked, true);
  assert.equal(result.webfetch, true);
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

test("educational unmarked helpers encode published flagged vs truncated paths", () => {
  assert.equal(CODE_BUILD, "2.1.274");
  assert.equal(CODE_BUILD_OK, "2.1.274");
  assert.equal(CODE_BUILD_STILL, "2.1.274");
  assert.equal(TERMINAL, "linux");
  assert.equal(TERM, "arm64");
  assert.equal(TUI_MODE, "webfetch");
  assert.equal(SETTINGS_KEY, "webfetch");
  assert.equal(COMMAND, "WebFetch");
  assert.match(WORKAROUND, /curl via Bash/i);
  assert.deepEqual([...ROW_KINDS], [
    "tool description (no limit)",
    "WebFetch result (unmarked)",
    "rfc9110 retained slice",
    "curl-via-Bash remedy (docs only)",
  ]);
  const wet = observeUnmarked({ clickLanded: true, selectionOpened: false });
  assert.equal(wet.dead, true);
  const shut = observeUnmarked({ hold: true });
  assert.equal(shut.dead, false);
  const hit = inspectWebfetch({});
  assert.equal(hit.missed, true);
  const held = inspectWebfetch({ hold: true });
  assert.equal(held.missed, false);
  const hover = inspectToolDesc({});
  assert.equal(hover.missed, true);
  const clean = inspectToolDesc({ hold: true });
  assert.equal(clean.missed, false);
  const deaf = inspectTruncated({});
  assert.equal(deaf.deaf, true);
  const keys = inspectCurlRemedy({});
  assert.equal(keys.stillWorks, true);
  const full = inspectPercentKept({});
  assert.equal(full.flagged, true);
  const row = inspectRfc9110({});
  assert.equal(row.flagged, true);
  const dispatch = inspectWebFetchSubagent({});
  assert.equal(dispatch.flagged, true);
  const scored = scoreUnmarked({
    truncated: true,
    unmarked: true,
    webfetch: true,
  });
  assert.equal(scored.truncated, true);
  assert.equal(scored.unmarked, true);
  const intactPath = scoreUnmarked({ flagged: true });
  assert.equal(intactPath.truncated, false);
  assert.equal(intactPath.flagged, true);
});

test("inspectors mark webfetch and tool-desc", () => {
  const hit = inspectWebfetchMark({ truncated: true, webfetch: true });
  assert.equal(hit.stamp, "webfetch");
  assert.equal(hit.flagged, true);
  const hover = inspectToolDescMark({ truncated: true, toolDesc: true });
  assert.equal(hover.stamp, "tool-desc");
  assert.equal(hover.missed, true);
  const scored = scoreGate({
    truncated: true,
    unmarked: true,
    webfetch: true,
    cue: "truncated",
  });
  assert.equal(scored.verdict, "truncated");
  const open = inspectWebfetchMark({ flagged: true, truncated: false });
  assert.equal(open.stamp, "declared");
});

test("path word is unmarked; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "unmarked");
  const result = analyze(seedUnmarked());
  assert.equal(result.verdict, "unmarked");
  assert.equal(result.pathWord, "unmarked");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "unmarked",
      preferSeed: true,
      truncated: true,
    }),
    "unmarked",
  );
  assert.equal(classify({ seed: "webfetch", preferSeed: true }), "webfetch");
  assert.equal(score(seedUnmarked()), "apocope");
});

test("HOLD includes flagged; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("flagged"));
  const graftedSkill = analyze(seedDeclared());
  assert.equal(graftedSkill.verdict, "declared");
  assert.equal(classify({ seed: "signaled", preferSeed: true }), "signaled");
  assert.equal(classify({ seed: "marked", preferSeed: true }), "marked");
});

test("alarm chips: webfetch, tool-desc, truncated", () => {
  assert.equal(classify({ seed: "webfetch", preferSeed: true }), "webfetch");
  assert.equal(classify(seedUnmarked()), "unmarked");
  assert.equal(classify(seedProduct()), "truncated");
  assert.equal(classify(seedToolDesc()), "tool-desc");
  assert.equal(classify({ seed: "unmarked-result", preferSeed: true }), "unmarked-result");
});

test("booth fixtures flip flagged vs truncated vs unmarked", () => {
  const idle = scoreGate(seedFlagged());
  const seeded = scoreGate(seedTruncated());
  const flagged = readData("flagged.json");
  const deaf = readData("truncated.json");
  const issued = readData("95127.json");
  const path = readData("unmarked.json");
  assert.equal(idle.verdict, "flagged");
  assert.equal(seeded.verdict, "truncated");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFlagged()), "flagged");
  assert.equal(score(seedTruncated()), "apocope");
  assert.equal(score({ seed: "unmarked", preferSeed: true }), "apocope");
  assert.equal(flagged.unmarked, false);
  assert.equal(flagged.flagged, true);
  assert.equal(scoreGate(flagged).verdict, "flagged");
  assert.equal(deaf.unmarked, true);
  assert.equal(deaf.webfetch, true);
  assert.equal(classify(deaf), "truncated");
  assert.equal(issued.issue, 95127);
  assert.equal(classify(issued), "truncated");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /flagged|declared|signaled|marked/i);
  assert.match(path.paths[1].result, /unmarked|webfetch|tool-desc|unmarked-result|truncated/i);
  assert.equal(classify(path), "unmarked");
  assert.equal(deaf.hubCount, "TRUNCATED");
  assert.equal(deaf.issue, 95127);
  assert.equal(deaf.truncated, true);
  assert.equal(classify(readData("declared.json")), "declared");
  assert.equal(classify(readData("signaled.json")), "signaled");
  assert.equal(classify(readData("marked.json")), "marked");
  assert.equal(classify(readData("webfetch.json")), "webfetch");
  assert.equal(classify(readData("tool-desc.json")), "tool-desc");
  assert.equal(classify(readData("unmarked-result.json")), "unmarked-result");
  assert.equal(classify(readData("percent-kept.json")), "percent-kept");
  assert.equal(classify(readData("rfc9110.json")), "rfc9110");
  assert.equal(classify(readData("curl-remedy.json")), "curl-remedy");
  assert.equal(classify(readData("web-fetch-subagent.json")), "web-fetch-subagent");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(readData("cousins.json").issues.length, 8);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("no-bash.json")), "no-bash");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("flagged"));
  assert.ok(CHIPS.includes("truncated"));
  assert.ok(CHIPS.includes("unmarked"));
  assert.ok(CHIPS.includes("webfetch"));
  assert.ok(CHIPS.includes("tool-desc"));
  assert.ok(CHIPS.includes("unmarked-result"));
  assert.ok(CHIPS.includes("marked"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("truncated"));
  assert.ok(ALARM.includes("unmarked"));
  assert.ok(ALARM.includes("webfetch"));
  assert.ok(ALARM.includes("tool-desc"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published apocope walk scores truncated after the flagged hold", () => {
  const booth = scoreWalk({ rows: APOCOPE_WALK });
  assert.equal(booth.verdict, "truncated");
  assert.ok(booth.truncatedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "atelier-bench");
  assert.equal(idle.flagged, true);
  assert.equal(idle.verdict, "flagged");
  const cut = booth.rows.find((row) => row.event === "unmarked");
  assert.equal(cut.unmarked, true);
  const path = booth.rows.find(
    (row) => row.event === "unmarked" && row.t === "path",
  );
  assert.equal(path.verdict, "unmarked");
});

test("APOCOPE_WALK constant matches the issue core walk", () => {
  assert.equal(APOCOPE_WALK[0].event, "atelier-bench");
  const cut = APOCOPE_WALK.find((row) => row.event === "unmarked");
  assert.equal(cut.unmarked || cut.webfetch, true);
  const path = APOCOPE_WALK.find((row) => row.t === "path");
  assert.equal(path.truncated, true);
  const scoreRow = APOCOPE_WALK.find((row) => row.event === "truncated");
  assert.equal(scoreRow.truncated, true);
  assert.equal(scoreRow.webfetch, true);
});

test("positive control atelier-bench stays flagged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "flagged");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "flagged");
  const hold = walk.rows.find((row) => row.event === "atelier-bench");
  assert.equal(hold.flagged, true);
  assert.equal(hold.verdict, "flagged");
});

test("issue constants encode only #95127 published facts", () => {
  assert.equal(FEATURED_ISSUE, 95127);
  assert.ok(ISSUE_URL.includes("95127"));
  assert.match(TITLE, /WebFetch|truncation|unmarked/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.274|rfc9110|39415|502907/i);
  assert.equal(BUILD, "Claude Code 2.1.274");
  assert.equal(SURFACE, "unmarked");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:tools"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].lane, "tool description");
  assert.equal(EVIDENCE_ROWS[1].lane, "WebFetch result");
  assert.equal(EVIDENCE_ROWS[2].lane, "rfc9110.txt retained");
  assert.equal(EVIDENCE_ROWS[3].lane, "curl-via-Bash remedy");
  assert.ok(RULED_OUT.some((row) => /Precis|#94564/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Dictabelt|verbatim/i.test(row)));
  assert.ok(EXPECTED.some((row) => /truncat|flagged|tool/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.274|WebFetch|rfc9110|truncated|39415|502907/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("unmarked"));
  assert.ok(FINGERPRINT_LINES.includes("apocope"));
  assert.equal(PHRASE, "Score apocope or admit flagged.");
  assert.equal(SAMPLE_TRUNCATED_PROOF.unmarked, true);
  assert.equal(SAMPLE_TRUNCATED_PROOF.names.length, 6);
  assert.equal(seedMarked().seed, "marked");
  assert.equal(seedSignaled().seed, "signaled");
  assert.equal(seedWebfetch().seed, "webfetch");
  assert.equal(seedToolDesc().seed, "tool-desc");
  assert.equal(seedUnmarkedResult().seed, "unmarked-result");
});

test("has-repro fingerprints encode the published apocope proof", () => {
  const result = handle(seedTruncated());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "unmarked");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedTruncated()),
    /truncated\|kind=unmarked\|ref=webfetch\|path=unmarked\|cue=unmarked/,
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

test("flagged booth flips truncated back when the ratchet admits flagged", () => {
  const tape = {
    flagged: true,
    truncated: false,
    unmarked: false,
    cue: "flagged",
  };
  assert.equal(scoreGate(tape).verdict, "flagged");
  tape.flagged = false;
  tape.truncated = true;
  tape.unmarked = true;
  tape.cue = "truncated";
  assert.equal(scoreGate(tape).verdict, "truncated");
  tape.flagged = true;
  tape.truncated = false;
  tape.unmarked = false;
  tape.cue = "flagged";
  assert.equal(scoreGate(tape).verdict, "flagged");
});

test("inspectors and readBooth mark the truncated proof", () => {
  const hit = inspectWebfetchMark({ truncated: true });
  assert.equal(hit.stamp, "webfetch");
  const hover = inspectToolDescMark({ truncated: true, toolDesc: true });
  assert.equal(hover.stamp, "tool-desc");
  assert.equal(hover.missed, true);
  const booth = readBooth({
    truncated: true,
    unmarked: true,
    webfetch: true,
  });
  assert.equal(booth.truncated, true);
  assert.equal(booth.mark, "truncated");
  const open = readBooth({
    flagged: true,
    truncated: false,
    unmarked: false,
  });
  assert.equal(open.truncated, false);
  assert.equal(open.mark, "flagged");
  assert.equal(inspectUnmarkedResultMark({ truncated: true, unmarkedResult: true }).stamp, "unmarked-result");
  assert.equal(inspectPercentKeptMark({ truncated: true, percentKept: true }).stamp, "percent-kept");
  assert.equal(inspectRfc9110Mark({ truncated: true, rfc9110: true }).stamp, "rfc9110");
});

test("mapApocope encodes the published unmarked", () => {
  const miss = mapApocope({ truncated: true, unmarked: true });
  assert.equal(miss.stamp, "unmarked");
  assert.equal(miss.holdingLane, "truncated");
  assert.equal(miss.ribbon, "truncated");
  const clear = mapApocope({ flagged: true, truncated: false });
  assert.equal(clear.stamp, "atelier-bench");
  assert.equal(clear.kindLane, "ratchet-wheel");
  assert.equal(clear.holdingLane, "atelier-bench");
});

test("cousins cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 8);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
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
  assert.ok(!BACKUPS.some((row) => row.issue === 95127));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/truncated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const flaggedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/flagged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(flaggedFix.status, 0, flaggedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const flaggedOut = JSON.parse(flaggedFix.stdout);
  assert.equal(idleOut.verdict, "flagged");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "truncated");
  assert.equal(seededOut.alarm, true);
  assert.equal(flaggedOut.verdict, "flagged");
  assert.equal(flaggedOut.hold, true);
  assert.match(flaggedOut.phrase, /admit flagged/);
});

test("handle exposes published hypothesis and #95127 headline", () => {
  const result = handle(seedTruncated());
  assert.equal(result.published.issue, 95127);
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.cousins.length, 8);
  assert.ok(result.published.backups.includes(94565));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(95127));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /compact|truncated|skill|re-attach|NON-BINDING|#95127/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#95127/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the flagged page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /\bfetch\s*\(\s*["'`]/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("flagged page is an elision booth, not precis or dictabelt", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Sora/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /apocope|flagged|truncated|unmarked|manuscript-frame|elision-knife|manuscript-tail|unmarked-zone/i,
  );
  assert.match(page, /#1a1d24|#5c4d7d|#4a6b5a|#c45c4a|#f4f0e8|#2d3142/i);
  assert.match(page, /\bflagged\b/);
  assert.match(page, /truncated/);
  assert.match(page, /unmarked/);
  assert.match(page, /Score apocope or admit flagged/i);
  assert.match(page, /#390/);
  assert.match(page, /#95127/);
  assert.match(page, /Admit flagged/);
  assert.match(page, /Score apocope/);
  assert.match(page, /Walk unmarked/);
  assert.match(page, /Compare flagged \/ truncated/);
  assert.match(page, /Pin idle flagged/);
  assert.match(page, /Pin seeded truncated/);
  assert.match(page, /Pin unmarked/);
  assert.match(page, /Stamp webfetch/);
  assert.match(page, /Score booth/);
  assert.match(page, /apocope-score/);
  assert.match(
    page,
    /WebFetch|2\.1\.274|rfc9110|39,?415|502,?907|truncated|no Bash/i,
  );
  assert.match(page, /manuscript-frame|elision-knife|manuscript-tail|unmarked-zone/i);
  assert.match(
    page,
    /<svg[\s\S]*class="manuscript-frame"|class="elision-knife"|class="manuscript-tail"|class="unmarked-zone"/i,
  );
  assert.match(page, /body\.flagged|body\.truncated|body\.unmarked/);
  assert.match(page, /evidence-table|tool description|WebFetch result|rfc9110/i);
  assert.doesNotMatch(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
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
  assert.match(page, /NOT Precis/i);
  assert.match(page, /NOT Slipway/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT #94575/i);
  assert.match(page, /NOT #94458/i);
  assert.doesNotMatch(page, /\bfetch\s*\(\s*["'`]/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Apocope/);
  assert.match(readme, /#95127/);
  assert.match(readme, /\bflagged\b/);
  assert.match(readme, /truncated/);
  assert.match(readme, /unmarked/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Sora/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /WebFetch|2\.1\.274|rfc9110|truncated|unmarked/i);
  assert.match(readme, /Precis.*#94564/);
  assert.match(readme, /Dictabelt.*#94406/);
  assert.match(readme, /#94564/);
  assert.match(readme, /do NOT rebuild|cite-only/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/apocope/);
  assert.match(readme, /node --test projects\/apocope\/apocope\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /manuscript end-clip|elision|apocope booth/i);
  assert.match(readme, /Score apocope or admit flagged/);
  assert.match(readme, /#51783|#90416|#73514/);
  assert.doesNotMatch(readme, /backup #95127 as next/i);
  assert.match(readme, /21:10/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bprosopon\b/);
  assert.doesNotMatch(readme, /\bslipway\b/);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-18 — Apocope/);
  assert.match(runLog, /21:10/);
});

test("catalog features Apocope only; Precis unfeatured; product count 390", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 390);
  assert.equal(hub.products.length, 390);
  assert.equal(catalog.products[0].name, "Apocope");
  assert.equal(catalog.products[0].slug, "apocope");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/apocope/");
  assert.equal(catalog.products[0].day, "2026-09-18");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bflagged\b/);
  assert.match(catalog.products[0].summary, /truncated/);
  assert.match(catalog.products[0].summary, /unmarked/);
  assert.match(catalog.products[0].summary, /Score apocope or admit flagged/);
  assert.match(catalog.products[0].summary, /#95127/);
  assert.match(catalog.products[0].summary, /21:10/);
  assert.equal(hub.products[0].slug, "apocope");
  assert.equal(hub.products[0].featured, true);
  const prosopon = catalog.products.find((row) => row.slug === "prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.featured, false);
  const slipway = catalog.products.find((row) => row.slug === "slipway");
  assert.ok(slipway);
  assert.equal(slipway.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "apocope" && row.featured).length,
    1,
  );

  const precis = catalog.products.find((row) => row.slug === "precis");
  assert.ok(precis);
  assert.equal(precis.featured, false);
  const detent = catalog.products.find((row) => row.slug === "detent");
  assert.ok(detent);
  assert.equal(detent.featured, false);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("95127") && row.slug !== "apocope",
    ),
  );
});

test("vercel rewrites apocope to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/apocope");
  assert.equal(vercel.rewrites[0].destination, "/projects/apocope");
  assert.equal(vercel.rewrites[1].source, "/apocope/");
  assert.equal(vercel.rewrites[1].destination, "/projects/apocope");
  assert.equal(vercel.rewrites[2].source, "/apocope/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/apocope/:path*");
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
  assert.doesNotMatch(source, /\bfetch\s*\(\s*["'`]/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
