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
  DESK_NAMES,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  AGRAPHIA_WALK,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MEASUREMENTS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_AGRAPHIA_PROOF,
  SEEDED_WORD,
  STATE,
  STOP_REASON_SHARES,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectChart,
  inspectHand,
  inspectPath,
  inspectQuill,
  inspectSeal,
  inspectSpeech,
  mapDesk,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAgraphia,
  seedHold,
  seedHookBlind,
  seedPenned,
  seedPreToolOmit,
  seedProduct,
  seedTextOmit,
} from "./agraphia.mjs";

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
  return fileURLToPath(new URL("./agraphia.mjs", import.meta.url));
}

test("idle penned is a hold; pre-tool text still written into JSONL", () => {
  const result = analyze(seedPenned());
  assert.equal(result.verdict, "penned");
  assert.equal(result.idleWord, "penned");
  assert.equal(IDLE_WORD, "penned");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.penned, true);
  assert.equal(result.phrase, "admit penned");
  assert.equal(result.agraphia, false);
  assert.equal(result.preToolOmit, false);
  assert.ok(HOLD_ALIASES.includes("recorded"));
  assert.ok(HOLD_ALIASES.includes("retained"));
  assert.ok(HOLD_ALIASES.includes("charted"));
  assert.ok(HOLD_ALIASES.includes("filed"));
  assert.ok(HOLD_ALIASES.includes("marked"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "inked");
  assert.notEqual(IDLE_WORD, "intact");
});

test("empty ticket and empty stdin classify penned", () => {
  assert.equal(classify(emptyTicket()), "penned");
  assert.equal(classify(""), "penned");
  assert.equal(classify(null), "penned");
  assert.equal(decide({}), "penned");
});

test("#94251 seeded path scores agraphia when JSONL omits pre-tool text", () => {
  const result = analyze(seedAgraphia());
  assert.equal(result.verdict, "agraphia");
  assert.equal(result.seededWord, "agraphia");
  assert.equal(SEEDED_WORD, "agraphia");
  assert.equal(PRODUCT_WORD, "agraphia");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.agraphia, true);
  assert.equal(result.phrase, "score agraphia");
  assert.equal(result.preToolOmit, true);
  assert.equal(result.textOmit, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "rasura");
  assert.notEqual(SEEDED_WORD, "rasure");
});

test("inspectors mark failed writing hand and lifted quill", () => {
  const hand = inspectHand({ agraphia: true, preToolOmit: true });
  assert.equal(hand.stamp, "hand-failed");
  assert.equal(hand.failed, true);
  const quill = inspectQuill({ agraphia: true, preToolOmit: true });
  assert.equal(quill.stamp, "quill-lift");
  assert.equal(quill.lifted, true);
  const scored = scoreGate({
    agraphia: true,
    preToolOmit: true,
    textOmit: true,
    cue: "agraphia",
  });
  assert.equal(scored.verdict, "agraphia");
  const open = inspectHand({ penned: true, agraphia: false });
  assert.equal(open.stamp, "hand-penned");
});

test("path word is pre-tool-omit; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "pre-tool-omit");
  const result = analyze(seedPreToolOmit());
  assert.equal(result.verdict, "pre-tool-omit");
  assert.equal(result.pathWord, "pre-tool-omit");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "pre-tool-omit",
      preferSeed: true,
      agraphia: true,
    }),
    "pre-tool-omit",
  );
  assert.equal(classify(seedTextOmit()), "text-omit");
  assert.equal(score(seedPreToolOmit()), "agraphia");
});

test("HOLD includes penned / hold", () => {
  assert.ok(HOLD.includes("penned"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: text-omit, pre-tool-omit, agraphia, hook-blind", () => {
  assert.equal(classify(seedTextOmit()), "text-omit");
  assert.equal(classify(seedPreToolOmit()), "pre-tool-omit");
  assert.equal(classify(seedProduct()), "agraphia");
  assert.equal(classify(seedHookBlind()), "hook-blind");
});

test("booth fixtures flip penned vs agraphia vs pre-tool-omit", () => {
  const idle = scoreGate(seedPenned());
  const seeded = scoreGate(seedAgraphia());
  const penned = readData("penned.json");
  const agraphia = readData("agraphia.json");
  const path = readData("pre-tool-omit.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "penned");
  assert.equal(seeded.verdict, "agraphia");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPenned()), "penned");
  assert.equal(score(seedAgraphia()), "agraphia");
  assert.equal(score({ seed: "pre-tool-omit", preferSeed: true }), "agraphia");
  assert.equal(penned.preToolOmit, false);
  assert.equal(penned.penned, true);
  assert.equal(scoreGate(penned).verdict, "penned");
  assert.equal(agraphia.preToolOmit, true);
  assert.equal(agraphia.textOmit, true);
  assert.equal(classify(agraphia), "agraphia");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /penned|recorded|retained|charted|filed|marked/i);
  assert.match(path.paths[1].result, /pre-tool-omit|text-omit|2\.1\.270|JSONL/i);
  assert.equal(classify(path), "pre-tool-omit");
  assert.equal(agraphia.hubCount, "AGRAPHIA");
  assert.equal(agraphia.issue, 94251);
  assert.equal(agraphia.agraphia, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("recorded.json")), "recorded");
  assert.equal(classify(readData("retained.json")), "retained");
  assert.equal(classify(readData("charted.json")), "charted");
  assert.equal(classify(readData("filed.json")), "filed");
  assert.equal(classify(readData("marked.json")), "marked");
  assert.equal(classify(readData("text-omit.json")), "text-omit");
  assert.equal(classify(readData("hook-blind.json")), "hook-blind");
  assert.equal(classify(readData("pretool-empty.json")), "pretool-empty");
  assert.equal(classify(readData("quote-only.json")), "quote-only");
  assert.equal(classify(readData("share-drop.json")), "share-drop");
  assert.equal(classify(readData("haiku-ok.json")), "haiku-ok");
  assert.equal(classify(readData("end-of-turn.json")), "end-of-turn");
  assert.equal(classify(readData("profile-a.json")), "profile-a");
  assert.equal(classify(readData("profile-b.json")), "profile-b");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [65051, 76668]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  const pennedExcerpt = readData("penned-excerpt.json");
  const omitExcerpt = readData("agraphia-excerpt.json");
  assert.equal(pennedExcerpt.exampleData, true);
  assert.equal(omitExcerpt.exampleData, true);
  assert.match(pennedExcerpt.note, /example-data|synthetic/i);
  assert.match(omitExcerpt.note, /example-data|synthetic/i);
  assert.ok(pennedExcerpt.lines.some((line) => line.includes('"type":"text"')));
  assert.ok(omitExcerpt.lines.every((line) => !/"type":"text"/.test(line) || /thinking|tool_use/.test(line)));
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("penned"));
  assert.ok(CHIPS.includes("agraphia"));
  assert.ok(CHIPS.includes("pre-tool-omit"));
  assert.ok(CHIPS.includes("text-omit"));
  assert.ok(CHIPS.includes("hook-blind"));
  assert.ok(CHIPS.includes("recorded"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("agraphia"));
  assert.ok(ALARM.includes("pre-tool-omit"));
  assert.ok(ALARM.includes("text-omit"));
  assert.ok(ALARM.includes("hook-blind"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published agraphia walk scores agraphia after the idle hold", () => {
  const booth = scoreWalk({ rows: AGRAPHIA_WALK });
  assert.equal(booth.verdict, "agraphia");
  assert.ok(booth.agraphiaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "chart-penned");
  assert.equal(idle.penned, true);
  assert.equal(idle.verdict, "penned");
  const cut = booth.rows.find((row) => row.event === "pre-tool-omit");
  assert.equal(cut.preToolOmit, true);
  const path = booth.rows.find(
    (row) => row.event === "pre-tool-omit" && row.t === "path",
  );
  assert.equal(path.verdict, "pre-tool-omit");
});

test("AGRAPHIA_WALK constant matches the issue clinic walk", () => {
  assert.equal(AGRAPHIA_WALK[0].event, "chart-penned");
  const cut = AGRAPHIA_WALK.find((row) => row.event === "pre-tool-omit");
  assert.equal(cut.preToolOmit || cut.textOmit, true);
  const path = AGRAPHIA_WALK.find((row) => row.t === "path");
  assert.equal(path.agraphia, true);
  const scoreRow = AGRAPHIA_WALK.find((row) => row.event === "agraphia");
  assert.equal(scoreRow.agraphia, true);
  assert.equal(scoreRow.textOmit, true);
});

test("positive control penned chart stays penned", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "penned");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "penned");
  const hold = walk.rows.find((row) => row.event === "chart-penned");
  assert.equal(hold.penned, true);
  assert.equal(hold.verdict, "penned");
});

test("issue constants encode only #94251 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94251);
  assert.ok(ISSUE_URL.includes("94251"));
  assert.match(TITLE, /2\.1\.270|transcript|tool call|interactive CLI/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.270|macOS|iTerm2/i);
  assert.equal(BUILD, "Claude Code 2.1.270 (macOS interactive CLI)");
  assert.equal(SURFACE, "pre-tool-omit");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:core", "area:hooks", "regression"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(DESK_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Gauntlet|#94029/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Lictor|#94053/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Rasure|#93791/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Palilalia|#94041/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#65051/i.test(row)));
  assert.ok(EXPECTED.some((row) => /JSONL|transcript_path|PreToolUse|marker/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.267|2\.1\.270|26\.4%|12\.8%|27\.6%|2\.9%|51\.7%|13\.6%|53\.7%|1\.9%|transcript_path|PreToolUse|Haiku/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("pre-tool-omit"));
  assert.ok(FINGERPRINT_LINES.includes("agraphia"));
  assert.equal(PHRASE, "Score agraphia or admit penned.");
  assert.equal(SAMPLE_AGRAPHIA_PROOF.preToolOmit, true);
  assert.equal(SAMPLE_AGRAPHIA_PROOF.names.length, 6);
  assert.equal(MEASUREMENTS.length, 4);
  assert.equal(MEASUREMENTS[0].share, "26.4%");
  assert.equal(MEASUREMENTS[2].share, "12.8%");
  assert.equal(STOP_REASON_SHARES[0].from, "51.7%");
  assert.equal(STOP_REASON_SHARES[1].to, "1.9%");
});

test("has-repro fingerprints encode the published agraphia proof", () => {
  const result = handle(seedAgraphia());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "pre-tool-omit");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedAgraphia()),
    /agraphia\|kind=pre-tool-omit\|ref=text-omit\|path=pre-tool-omit\|cue=pre-tool-omit/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and rasura/rasure", () => {
  const required = [
    "inked",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "intact",
    "gauntlet",
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
    "rasure",
    "rasura",
    "attach-mouse",
    "picker-bypass",
    "bg-task-stale",
    "inherited-worktree-yank",
    "skill-row-carve",
    "skill-dollar-swap",
    "deny-list-hollow",
    "reminder-secret-bypass",
    "cannot-show-not-git",
    "goal-stop-refire",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("penned booth flips agraphia back when the chart admits penned", () => {
  const tape = {
    penned: true,
    agraphia: false,
    preToolOmit: false,
    cue: "penned",
  };
  assert.equal(scoreGate(tape).verdict, "penned");
  tape.penned = false;
  tape.agraphia = true;
  tape.preToolOmit = true;
  tape.cue = "agraphia";
  assert.equal(scoreGate(tape).verdict, "agraphia");
  tape.penned = true;
  tape.agraphia = false;
  tape.preToolOmit = false;
  tape.cue = "penned";
  assert.equal(scoreGate(tape).verdict, "penned");
});

test("chart, hand, quill, seal, and readBooth mark the agraphia proof", () => {
  const idle = inspectSpeech({ penned: true });
  assert.equal(idle.stamp, "speech-intact");
  const quill = inspectQuill({ agraphia: true, preToolOmit: true });
  assert.equal(quill.stamp, "quill-lift");
  assert.equal(quill.lifted, true);
  const chart = inspectChart({ agraphia: true, hookBlind: true });
  assert.equal(chart.stamp, "chart-blind");
  const booth = readBooth({
    agraphia: true,
    preToolOmit: true,
    textOmit: true,
  });
  assert.equal(booth.agraphia, true);
  assert.equal(booth.mark, "agraphia");
  const open = readBooth({
    penned: true,
    agraphia: false,
    preToolOmit: false,
  });
  assert.equal(open.agraphia, false);
  assert.equal(open.mark, "penned");
  assert.equal(inspectHand({ penned: true }).stamp, "hand-penned");
  assert.equal(inspectSeal({ agraphia: true, toolUseStop: true }).stamp, "seal-on-blank");
  assert.equal(inspectPath({ agraphia: true, preToolOmit: true }).stamp, "path-omit");
});

test("mapDesk encodes the published omitted chart", () => {
  const miss = mapDesk({ agraphia: true, preToolOmit: true });
  assert.equal(miss.stamp, "pre-tool-omit");
  assert.equal(miss.holdingLane, "text-omit");
  assert.equal(miss.ribbon, "agraphia");
  const clear = mapDesk({ penned: true, agraphia: false });
  assert.equal(clear.stamp, "penned-chart");
  assert.equal(clear.kindLane, "recorded");
  assert.equal(clear.holdingLane, "retained");
});

test("cousins cite #65051 #76668 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 65051);
  assert.equal(COUSINS[0].state, "OPEN");
  assert.equal(COUSINS[1].issue, 76668);
  assert.equal(COUSINS[1].state, "OPEN");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("lictor"));
  assert.ok(NOT_PRODUCTS.includes("lychgate"));
  assert.ok(NOT_PRODUCTS.includes("ouster"));
  assert.ok(NOT_PRODUCTS.includes("palilalia"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("rasura"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[11].issue, 94267);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94251));
  assert.ok(!BACKUPS.some((row) => row.issue === 65051));
  assert.ok(!BACKUPS.some((row) => row.issue === 76668));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/agraphia.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const pennedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/penned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(pennedFix.status, 0, pennedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const pennedOut = JSON.parse(pennedFix.stdout);
  assert.equal(idleOut.verdict, "penned");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "agraphia");
  assert.equal(seededOut.alarm, true);
  assert.equal(pennedOut.verdict, "penned");
  assert.equal(pennedOut.hold, true);
  assert.match(pennedOut.phrase, /admit penned/);
});

test("handle exposes published hypothesis and #94251 headline", () => {
  const result = handle(seedAgraphia());
  assert.equal(result.published.issue, 94251);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [65051, 76668]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(94267));
  assert.ok(!result.published.backups.includes(94251));
  assert.match(
    result.published.hypothesis,
    /2\.1\.267|2\.1\.270|transcript_path|NON-BINDING|#94251/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94251/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the penned page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("penned page is a clinical agraphia desk, not a gauntlet, rasure, or palilalia clinic", () => {
  const page = readPage();
  assert.match(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.match(page, /family=Outfit|Outfit/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /agraphia|penned|pre-tool-omit|writing-hand|chart-clipboard|quill-lift|tool-seal|clinic-desk/i,
  );
  assert.match(page, /#F4F1EA|#3A4F66|#14181F|#D4A04A|#6B8499/i);
  assert.match(page, /\bpenned\b/);
  assert.match(page, /\bagraphia\b/);
  assert.match(page, /pre-tool-omit/);
  assert.match(page, /Score agraphia or admit penned/i);
  assert.match(page, /#362/);
  assert.match(page, /#94251/);
  assert.match(page, /Admit penned/);
  assert.match(page, /Score agraphia/);
  assert.match(page, /Walk pre-tool-omit/);
  assert.match(page, /Compare penned \/ agraphia/);
  assert.match(page, /Pin idle penned/);
  assert.match(page, /Pin seeded agraphia/);
  assert.match(page, /Pin pre-tool-omit/);
  assert.match(page, /Lift the quill/);
  assert.match(page, /Score booth/);
  assert.match(page, /agraphia-score/);
  assert.match(
    page,
    /2\.1\.267|2\.1\.270|26\.4%|12\.8%|transcript_path|PreToolUse|Haiku/i,
  );
  assert.match(page, /speech-intact|writing-hand|chart-clipboard|quill-lift|tool-seal|clinic-desk/i);
  assert.match(
    page,
    /<svg[\s\S]*class="speech-balloon"|class="writing-hand"|class="chart-clipboard"|class="quill-lift"|class="tool-seal"|class="clinic-desk"/i,
  );
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /#8B1E2D|#1F2328/);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /creation-time-flip|secrets-folder/i);
  assert.doesNotMatch(page, /\/goal Stop|re-fire indefinitely/i);
  assert.doesNotMatch(page, /admit ungloved|Score gauntlet|idle ungloved/i);
  assert.doesNotMatch(page, /admit attested|Score lictor|idle attested/i);
  assert.doesNotMatch(page, /admit silenced|Score palilalia/i);
  assert.doesNotMatch(page, /admit intact|Score rasure|Score rasura/i);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\blictor\b/);
  assert.doesNotMatch(page, /\blychgate\b/);
  assert.doesNotMatch(page, /\bpalilalia\b/);
  assert.doesNotMatch(page, /\brasura\b/);
  assert.doesNotMatch(page, /attach-mouse/);
  assert.doesNotMatch(page, /picker-bypass/);
  assert.doesNotMatch(page, /goal-stop-refire/);
  assert.match(page, /NOT Gauntlet/i);
  assert.match(page, /NOT Lictor/i);
  assert.match(page, /NOT Palilalia/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /#65051/);
  assert.match(page, /#76668/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Agraphia/);
  assert.match(readme, /#94251/);
  assert.match(readme, /\bpenned\b/);
  assert.match(readme, /\bagraphia\b/);
  assert.match(readme, /pre-tool-omit/);
  assert.match(readme, /Crimson Pro/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Karla/);
  assert.doesNotMatch(readme, /Space Mono/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /2\.1\.267|2\.1\.270|transcript_path|PreToolUse/i);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Lictor\/#94053/);
  assert.match(readme, /NOT Palilalia\/#94041/);
  assert.match(readme, /NOT Rasure\/#93791/);
  assert.match(readme, /#65051/);
  assert.match(readme, /#76668/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/agraphia/);
  assert.match(readme, /node --test projects\/agraphia\/agraphia\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /writing-hand|chart-clipboard|quill-lift|clinic/i);
  assert.match(readme, /Score agraphia or admit penned/);
  assert.match(
    readme,
    /#93987|#93924|#93770|#93777|#94151|#94064|#94256|#94277|#94275|#94274|#94273|#94267/,
  );
  assert.doesNotMatch(readme, /backup #94251|#94251 as next/);
  assert.match(readme, /22:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\brasura\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Agraphia/);
  assert.match(runLog, /22:50/);
});

test("catalog features Agraphia only; Gauntlet unfeatured; product count 362", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 362);
  assert.equal(hub.products.length, 362);
  assert.equal(catalog.products[0].name, "Agraphia");
  assert.equal(catalog.products[0].slug, "agraphia");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/agraphia/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "22:50 agraphia: a clinical agraphia / neurology writing-desk booth for #94251. Interactive CLI 2.1.270 session transcript JSONL omits most assistant text written before a tool_use; terminal still shows the words; thinking and tool_use still written; hooks reading transcript_path go blind. Idle penned / seeded agraphia / path pre-tool-omit. Score agraphia or admit penned.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bpenned\b/);
  assert.match(catalog.products[0].summary, /\bagraphia\b/);
  assert.match(catalog.products[0].summary, /pre-tool-omit/);
  assert.match(catalog.products[0].summary, /Score agraphia or admit penned/);
  assert.match(catalog.products[0].summary, /#94251/);
  assert.equal(hub.products[0].slug, "agraphia");
  assert.equal(hub.products[0].featured, true);
  const gauntlet = catalog.products.find((row) => row.slug === "gauntlet");
  assert.ok(gauntlet);
  assert.equal(gauntlet.featured, false);
  const lictor = catalog.products.find((row) => row.slug === "lictor");
  assert.ok(lictor);
  assert.equal(lictor.featured, false);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  assert.ok(!catalog.products.some((row) => row.slug === "rasura"));
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "agraphia").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94251") && row.slug !== "agraphia",
    ),
  );
});

test("vercel rewrites agraphia to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/agraphia");
  assert.equal(vercel.rewrites[0].destination, "/projects/agraphia");
  assert.equal(vercel.rewrites[1].source, "/agraphia/");
  assert.equal(vercel.rewrites[1].destination, "/projects/agraphia");
  assert.equal(vercel.rewrites[2].source, "/agraphia/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/agraphia/:path*");
  assert.equal(vercel.rewrites[3].source, "/gauntlet");
  assert.equal(vercel.rewrites[3].destination, "/projects/gauntlet");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
