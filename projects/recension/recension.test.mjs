import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTO_COMPACT_COUNT,
  AUTO_COMPACT_WINDOW,
  CHIPS,
  COUSINS,
  FEATURED_ISSUE,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEADLINE_EDITS_BEHIND,
  HEADLINE_LAG_MINUTES,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  SEEDED_WORD,
  TIMELINE,
  TITLE,
  USER_LEVEL_DISK_CHARS,
  USER_LEVEL_STALE_CHARS,
  VERDICTS,
  analyze,
  classify,
  decide,
  editsBehind,
  emptyTicket,
  fingerprint,
  handle,
  parseClock,
  score,
  scoreTimeline,
  scoreWitness,
  seedCollated,
  seedEmended,
  seedStereotyped,
  witnessHash,
} from "./recension.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./recension.mjs", import.meta.url));
}

test("idle collated is a hold; auto-compact matches the disk exemplar", () => {
  const result = analyze(seedCollated());
  assert.equal(result.verdict, "collated");
  assert.equal(result.idleWord, "collated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.collated, true);
  assert.equal(result.phrase, "admit collated");
  assert.equal(result.matchesDisk, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
  }
});

test("empty ticket and empty stdin classify collated", () => {
  assert.equal(classify(emptyTicket()), "collated");
  assert.equal(classify(""), "collated");
  assert.equal(classify(null), "collated");
  assert.equal(decide({}), "collated");
});

test("#92949 path scores stereotyped from the 22:49 compact row", () => {
  const result = analyze(seedStereotyped());
  assert.equal(result.verdict, "stereotyped");
  assert.equal(result.pathWord, "stereotyped");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.stereotyped, true);
  assert.equal(result.phrase, "score stereotyped");
  assert.equal(result.injected, "D");
  assert.equal(result.disk, "F");
  assert.equal(result.lastPrompt, "D");
  assert.equal(result.lagMinutes, HEADLINE_LAG_MINUTES);
  assert.equal(result.editsBehind, HEADLINE_EDITS_BEHIND);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips collated vs stereotyped", () => {
  const collated = scoreWitness(readData("collated.json"));
  const stereotyped = scoreWitness(readData("stereotyped.json"));
  assert.equal(collated.verdict, "collated");
  assert.equal(stereotyped.verdict, "stereotyped");
  assert.notEqual(collated.verdict, stereotyped.verdict);
  assert.equal(score(readData("collated.json")), "collated");
  assert.equal(score(readData("stereotyped.json")), "stereotyped");
  assert.equal(score(readData("92949.json")), "stereotyped");
});

test("emended is the late changed:true reason:compaction refresh", () => {
  const result = scoreWitness(readData("emended.json"));
  assert.equal(result.verdict, "emended");
  assert.equal(result.seededWord, "emended");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.changed, true);
  assert.equal(result.reason, "compaction");
  assert.equal(result.injected, "F");
  assert.equal(result.disk, "F");
  assert.equal(analyze(seedEmended()).verdict, "emended");
});

test("published A–F timeline scores stereotyped at 21:11, 21:55, 22:49", () => {
  const night = scoreTimeline(readData("timeline.json"));
  assert.equal(night.verdict, "stereotyped");
  assert.ok(night.stereotypedCount >= 3);
  const twentyFortyNine = night.rows.find((row) => row.t === "22:49");
  assert.equal(twentyFortyNine.verdict, "stereotyped");
  assert.equal(twentyFortyNine.injected, "D");
  assert.equal(twentyFortyNine.disk, "F");
  const prompt = night.rows.find((row) => row.t === "22:52");
  assert.equal(prompt.verdict, "emended");
  const start = night.rows.find((row) => row.t === "20:42");
  assert.equal(start.verdict, "collated");
});

test("TIMELINE constant matches the issue table versions", () => {
  assert.equal(TIMELINE[0].t, "20:42");
  assert.equal(TIMELINE[0].injected, "A");
  const compact2249 = TIMELINE.find((row) => row.t === "22:49");
  assert.equal(compact2249.injected, "D");
  assert.equal(compact2249.disk, "F");
  assert.equal(compact2249.changed, null);
  assert.equal(compact2249.lagMinutes, 40);
  assert.equal(compact2249.editsBehind, 2);
  const refresh = TIMELINE.find((row) => row.t === "22:52");
  assert.equal(refresh.changed, true);
  assert.equal(refresh.reason, "compaction");
  assert.equal(refresh.injected, "F");
});

test("witness hashes are stable and differ across versions A–F", () => {
  const hashes = ["A", "B", "C", "D", "E", "F"].map(witnessHash);
  assert.equal(new Set(hashes).size, 6);
  assert.equal(witnessHash("D"), witnessHash("D"));
  assert.notEqual(witnessHash("D"), witnessHash("F"));
  assert.equal(editsBehind("D", "F"), 2);
  assert.equal(editsBehind("A", "A"), 0);
});

test("clock parser reads the published UTC times", () => {
  assert.equal(parseClock("22:49"), ((22 * 60 + 49) * 60) * 1000);
  assert.equal(parseClock("20:42"), ((20 * 60 + 42) * 60) * 1000);
});

test("adding a disk re-read at compact flips stereotyped to collated", () => {
  const tape = {
    event: "auto-compact",
    t: "22:49",
    injected: "D",
    disk: "F",
    lastPrompt: "D",
  };
  assert.equal(scoreWitness(tape).verdict, "stereotyped");
  tape.injected = "F";
  tape.fromDisk = true;
  assert.equal(scoreWitness(tape).verdict, "collated");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [91243, 88886, 87937, 88023],
  );
  assert.equal(COUSINS.length, 4);
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("setoff"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92949", () => {
  assert.equal(FEATURED_ISSUE, 92949);
  assert.ok(ISSUE_URL.includes("92949"));
  assert.ok(/last user prompt/i.test(TITLE));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("memory"));
  assert.ok(HOLD.includes("collated"));
  assert.ok(ALARM.includes("stereotyped"));
  assert.ok(CHIPS.includes("emended"));
  assert.ok(VERDICTS.includes("late-refresh"));
  assert.equal(AUTO_COMPACT_WINDOW, 300000);
  assert.equal(AUTO_COMPACT_COUNT, 5);
  assert.equal(USER_LEVEL_STALE_CHARS, 3060);
  assert.equal(USER_LEVEL_DISK_CHARS, 2610);
});

test("CLI scores fixtures without a server", () => {
  const collated = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/collated.json", import.meta.url))], { encoding: "utf8" });
  const stereotyped = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/stereotyped.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(collated.status, 0, collated.stderr);
  assert.equal(stereotyped.status, 0, stereotyped.stderr);
  assert.equal(JSON.parse(collated.stdout).verdict, "collated");
  assert.equal(JSON.parse(stereotyped.stdout).verdict, "stereotyped");
});

test("handle exposes published hypothesis and 22:49 headline", () => {
  const result = handle(readData("92949.json"));
  assert.equal(result.published.issue, 92949);
  assert.equal(result.published.headline.injected, "D");
  assert.equal(result.published.headline.disk, "F");
  assert.equal(result.published.headline.lagMinutes, 40);
  assert.match(result.published.hypothesis, /last-prompt snapshot/);
  assert.match(fingerprint(seedStereotyped()), /stereotyped\|inj=D\|disk=F/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a scriptorium collation desk, not mirage desert or remora hull", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Public Sans/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /scriptorium|collation|stemma|exemplar|witness/i);
  assert.match(page, /score stereotyped or admit collated/i);
  assert.match(page, /emended/);
  assert.doesNotMatch(page, /Newsreader|Lexend|Fragment Mono/);
  assert.doesNotMatch(page, /Ibarra Real Nova|Red Hat Text|Vollkorn|Cabin|Ubuntu Mono/);
  assert.doesNotMatch(page, /desert observatory|heat-haze|hull-clinging remora|iron bed bench|cadastral surveyor|letterpress set-off/);
  assert.doesNotMatch(page, /\bconfirmed\b/);
  assert.doesNotMatch(page, /\bmiraged\b/);
  assert.doesNotMatch(page, /\bloosed\b/);
  assert.doesNotMatch(page, /\bclung\b/);
  assert.match(page, /#92949/);
  assert.match(page, /08:50/);
});
