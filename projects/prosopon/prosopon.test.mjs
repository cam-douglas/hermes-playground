import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ATTACHMENT_TYPE,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DISTRIBUTION,
  EVIDENCE_ROWS,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HAIKU_ADVISOR,
  HAIKU_MODEL,
  HAIKU_TURNS,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  OPUS_ADVISOR,
  OPUS_MODEL,
  OPUS_TURNS,
  PARENT_MODEL,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PROSOPON_WALK,
  RULED_OUT,
  SAMPLE_MISCAST_PROOF,
  SEEDED_WORD,
  SONNET_ADVISOR_A,
  SONNET_ADVISOR_B,
  SONNET_MODEL,
  SONNET_TURNS_A,
  SONNET_TURNS_B,
  STATE,
  SUBAGENT_COUNT,
  SUBAGENT_TYPE,
  SURFACE,
  TITLE,
  USER_CONCLUSION,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAdvisorAttachment,
  inspectAdvisorAttachmentMark,
  inspectFablePaint,
  inspectFablePaintMark,
  inspectHaikuTurn,
  inspectLabelLie,
  inspectLabelLieMark,
  inspectOpusTurn,
  inspectOverrideHonoured,
  inspectOverrideMark,
  inspectParentBadge,
  inspectParentBadgeMark,
  inspectSonnetTurn,
  mapProsopon,
  observeAdvisorShadow,
  readBooth,
  score,
  scoreAdvisorShadow,
  scoreGate,
  scoreWalk,
  seedAdvisorAttachment,
  seedAdvisorShadow,
  seedAscribed,
  seedBilled,
  seedCredited,
  seedFablePaint,
  seedMiscast,
  seedNamed,
  seedParentBadge,
  seedProduct,
} from "./prosopon.mjs";

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
  return fileURLToPath(new URL("./prosopon.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "05:50 prosopon: a Greek theatre / prosopon / tragic-mask / skene / orchestra booth for #94575. Background-agent view paints parent's advisor model (Fable) from advisor_tool attachment while subagent turns run on requested sonnet/opus/haiku. Idle ascribed / seeded miscast / path advisor-shadow. Score prosopon or admit ascribed.";

test("idle ascribed is a hold; badge shows the subagent's requested / running model", () => {
  const result = analyze(seedAscribed());
  assert.equal(result.verdict, "ascribed");
  assert.equal(result.idleWord, "ascribed");
  assert.equal(IDLE_WORD, "ascribed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.ascribed, true);
  assert.equal(result.phrase, "admit ascribed");
  assert.equal(result.miscast, false);
  assert.equal(result.advisorShadow, false);
  assert.ok(HOLD_ALIASES.includes("credited"));
  assert.ok(HOLD_ALIASES.includes("named"));
  assert.ok(HOLD_ALIASES.includes("billed"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "buoyed");
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
});

test("empty ticket and empty stdin classify ascribed", () => {
  assert.equal(classify(emptyTicket()), "ascribed");
  assert.equal(classify(""), "ascribed");
  assert.equal(classify(null), "ascribed");
  assert.equal(decide({}), "ascribed");
});

test("#94575 seeded path scores miscast when the advisor paints the mask", () => {
  const result = analyze(seedMiscast());
  assert.equal(result.verdict, "miscast");
  assert.equal(result.seededWord, "miscast");
  assert.equal(SEEDED_WORD, "miscast");
  assert.equal(PRODUCT_WORD, "prosopon");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.miscast, true);
  assert.equal(result.phrase, "score prosopon");
  assert.equal(result.advisorShadow, true);
  assert.equal(result.parentBadge, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "slipped");
  assert.notEqual(SEEDED_WORD, "freshet");
  assert.notEqual(SEEDED_WORD, "kintsugi");
  assert.notEqual(PATH_WORD, "iface-swap");
  assert.notEqual(PATH_WORD, "init-flood");
  assert.notEqual(PATH_WORD, "heal-abort");
});

test("educational advisor-shadow helpers encode published ascribed vs miscast paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(PARENT_MODEL, "claude-fable-5-1");
  assert.equal(SONNET_MODEL, "claude-sonnet-5");
  assert.equal(OPUS_MODEL, "claude-opus-5");
  assert.equal(HAIKU_MODEL, "claude-haiku-4-5-20251001");
  assert.equal(SUBAGENT_TYPE, "general-purpose");
  assert.equal(ATTACHMENT_TYPE, "advisor_tool");
  assert.equal(SUBAGENT_COUNT, 4);
  assert.equal(SONNET_TURNS_A, 83);
  assert.equal(SONNET_ADVISOR_A, 1);
  assert.equal(OPUS_TURNS, 86);
  assert.equal(OPUS_ADVISOR, 3);
  assert.equal(HAIKU_TURNS, 33);
  assert.equal(HAIKU_ADVISOR, 1);
  assert.equal(SONNET_TURNS_B, 27);
  assert.equal(SONNET_ADVISOR_B, 1);
  assert.match(USER_CONCLUSION, /not SONNET/i);
  const wet = observeAdvisorShadow({ advisorModel: PARENT_MODEL, ownModel: SONNET_MODEL });
  assert.equal(wet.shadowed, true);
  assert.equal(wet.badge, PARENT_MODEL);
  const shut = observeAdvisorShadow({ ascribed: true });
  assert.equal(shut.shadowed, false);
  const painted = inspectParentBadge({});
  assert.equal(painted.painted, true);
  const held = inspectParentBadge({ ascribed: true });
  assert.equal(held.painted, false);
  const paint = inspectFablePaint({});
  assert.equal(paint.painted, true);
  const clean = inspectFablePaint({ ascribed: true });
  assert.equal(clean.painted, false);
  const sonnet = inspectSonnetTurn({});
  assert.equal(sonnet.honoured, true);
  const opus = inspectOpusTurn({});
  assert.equal(opus.honoured, true);
  const haiku = inspectHaikuTurn({});
  assert.equal(haiku.honoured, true);
  const attached = inspectAdvisorAttachment({});
  assert.equal(attached.attached, true);
  const quiet = inspectAdvisorAttachment({ ascribed: true });
  assert.equal(quiet.attached, false);
  const lie = inspectLabelLie({});
  assert.equal(lie.lie, true);
  const honest = inspectLabelLie({ ascribed: true });
  assert.equal(honest.lie, false);
  const honoured = inspectOverrideHonoured({});
  assert.equal(honoured.honoured, true);
  const scored = scoreAdvisorShadow({
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
  });
  assert.equal(scored.miscast, true);
  assert.equal(scored.advisorShadow, true);
  const intactPath = scoreAdvisorShadow({ ascribed: true });
  assert.equal(intactPath.miscast, false);
  assert.equal(intactPath.ascribed, true);
});

test("inspectors mark parent-badge and fable-paint", () => {
  const badge = inspectParentBadgeMark({ miscast: true, parentBadge: true });
  assert.equal(badge.stamp, "parent-badge");
  assert.equal(badge.flagged, true);
  const paint = inspectFablePaintMark({ miscast: true, fablePaint: true });
  assert.equal(paint.stamp, "fable-paint");
  assert.equal(paint.missed, true);
  const scored = scoreGate({
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
    cue: "miscast",
  });
  assert.equal(scored.verdict, "miscast");
  const open = inspectParentBadgeMark({ ascribed: true, miscast: false });
  assert.equal(open.stamp, "credited");
});

test("path word is advisor-shadow; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "advisor-shadow");
  const result = analyze(seedAdvisorShadow());
  assert.equal(result.verdict, "advisor-shadow");
  assert.equal(result.pathWord, "advisor-shadow");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "advisor-shadow",
      preferSeed: true,
      miscast: true,
    }),
    "advisor-shadow",
  );
  assert.equal(classify({ seed: "parent-badge", preferSeed: true }), "parent-badge");
  assert.equal(score(seedAdvisorShadow()), "prosopon");
});

test("HOLD includes ascribed; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("ascribed"));
  const credited = analyze(seedCredited());
  assert.equal(credited.verdict, "credited");
  assert.equal(classify({ seed: "named", preferSeed: true }), "named");
  assert.equal(classify({ seed: "billed", preferSeed: true }), "billed");
});

test("alarm chips: parent-badge, fable-paint, miscast", () => {
  assert.equal(classify({ seed: "parent-badge", preferSeed: true }), "parent-badge");
  assert.equal(classify(seedAdvisorShadow()), "advisor-shadow");
  assert.equal(classify(seedProduct()), "miscast");
  assert.equal(classify(seedFablePaint()), "fable-paint");
  assert.equal(classify({ seed: "advisor-attachment", preferSeed: true }), "advisor-attachment");
});

test("booth fixtures flip ascribed vs miscast vs advisor-shadow", () => {
  const idle = scoreGate(seedAscribed());
  const seeded = scoreGate(seedMiscast());
  const ascribed = readData("ascribed.json");
  const miscast = readData("miscast.json");
  const issued = readData("94575.json");
  const path = readData("advisor-shadow.json");
  assert.equal(idle.verdict, "ascribed");
  assert.equal(seeded.verdict, "miscast");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAscribed()), "ascribed");
  assert.equal(score(seedMiscast()), "prosopon");
  assert.equal(score({ seed: "advisor-shadow", preferSeed: true }), "prosopon");
  assert.equal(ascribed.advisorShadow, false);
  assert.equal(ascribed.ascribed, true);
  assert.equal(scoreGate(ascribed).verdict, "ascribed");
  assert.equal(miscast.advisorShadow, true);
  assert.equal(miscast.parentBadge, true);
  assert.equal(classify(miscast), "miscast");
  assert.equal(issued.issue, 94575);
  assert.equal(classify(issued), "miscast");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /ascribed|credited|named|billed/i);
  assert.match(path.paths[1].result, /advisor-shadow|parent-badge|fable-paint|advisor-attachment|label-lie/i);
  assert.equal(classify(path), "advisor-shadow");
  assert.equal(miscast.hubCount, "MISCAST");
  assert.equal(miscast.issue, 94575);
  assert.equal(miscast.miscast, true);
  assert.equal(classify(readData("credited.json")), "credited");
  assert.equal(classify(readData("named.json")), "named");
  assert.equal(classify(readData("billed.json")), "billed");
  assert.equal(classify(readData("parent-badge.json")), "parent-badge");
  assert.equal(classify(readData("fable-paint.json")), "fable-paint");
  assert.equal(classify(readData("sonnet-turn.json")), "sonnet-turn");
  assert.equal(classify(readData("opus-turn.json")), "opus-turn");
  assert.equal(classify(readData("haiku-turn.json")), "haiku-turn");
  assert.equal(classify(readData("advisor-attachment.json")), "advisor-attachment");
  assert.equal(classify(readData("label-lie.json")), "label-lie");
  assert.equal(classify(readData("override-honoured.json")), "override-honoured");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [76381]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("mask.json")), "label-lie");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("ascribed"));
  assert.ok(CHIPS.includes("miscast"));
  assert.ok(CHIPS.includes("advisor-shadow"));
  assert.ok(CHIPS.includes("parent-badge"));
  assert.ok(CHIPS.includes("fable-paint"));
  assert.ok(CHIPS.includes("advisor-attachment"));
  assert.ok(CHIPS.includes("billed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("miscast"));
  assert.ok(ALARM.includes("advisor-shadow"));
  assert.ok(ALARM.includes("parent-badge"));
  assert.ok(ALARM.includes("fable-paint"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published prosopon walk scores miscast after the ascribed hold", () => {
  const booth = scoreWalk({ rows: PROSOPON_WALK });
  assert.equal(booth.verdict, "miscast");
  assert.ok(booth.miscastCount >= 1);
  const idle = booth.rows.find((row) => row.event === "orchestra-pit");
  assert.equal(idle.ascribed, true);
  assert.equal(idle.verdict, "ascribed");
  const cut = booth.rows.find((row) => row.event === "advisor-shadow");
  assert.equal(cut.advisorShadow, true);
  const path = booth.rows.find(
    (row) => row.event === "advisor-shadow" && row.t === "path",
  );
  assert.equal(path.verdict, "advisor-shadow");
});

test("PROSOPON_WALK constant matches the issue core walk", () => {
  assert.equal(PROSOPON_WALK[0].event, "orchestra-pit");
  const cut = PROSOPON_WALK.find((row) => row.event === "advisor-shadow");
  assert.equal(cut.advisorShadow || cut.parentBadge, true);
  const path = PROSOPON_WALK.find((row) => row.t === "path");
  assert.equal(path.miscast, true);
  const scoreRow = PROSOPON_WALK.find((row) => row.event === "miscast");
  assert.equal(scoreRow.miscast, true);
  assert.equal(scoreRow.parentBadge, true);
});

test("positive control orchestra-pit stays ascribed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "ascribed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "ascribed");
  const hold = walk.rows.find((row) => row.event === "orchestra-pit");
  assert.equal(hold.ascribed, true);
  assert.equal(hold.verdict, "ascribed");
});

test("issue constants encode only #94575 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94575);
  assert.ok(ISSUE_URL.includes("94575"));
  assert.match(TITLE, /Background-agent|advisor model|Fable|requested model/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.270|Darwin 25\.6\.0|claude-fable-5-1|general-purpose/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "advisor-shadow");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:macos", "area:agent-view"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].requested, "sonnet");
  assert.equal(EVIDENCE_ROWS[0].ownTurns, "claude-sonnet-5 x83");
  assert.equal(EVIDENCE_ROWS[1].ownTurns, "claude-opus-5 x86");
  assert.equal(EVIDENCE_ROWS[2].ownTurns, "claude-haiku-4-5-20251001 x33");
  assert.equal(EVIDENCE_ROWS[3].ownTurns, "claude-sonnet-5 x27");
  assert.ok(RULED_OUT.some((row) => /#76381/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94458/i.test(row)));
  assert.ok(EXPECTED.some((row) => /subagent runs on|distinct labels/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /claude-sonnet-5 x83|claude-opus-5 x86|claude-haiku-4-5-20251001 x33|the model launched was not SONNET|2\.1\.270/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("advisor-shadow"));
  assert.ok(FINGERPRINT_LINES.includes("prosopon"));
  assert.equal(PHRASE, "Score prosopon or admit ascribed.");
  assert.equal(SAMPLE_MISCAST_PROOF.advisorShadow, true);
  assert.equal(SAMPLE_MISCAST_PROOF.names.length, 6);
  assert.equal(seedBilled().seed, "billed");
  assert.equal(seedNamed().seed, "named");
  assert.equal(seedParentBadge().seed, "parent-badge");
  assert.equal(seedFablePaint().seed, "fable-paint");
  assert.equal(seedAdvisorAttachment().seed, "advisor-attachment");
});

test("has-repro fingerprints encode the published prosopon proof", () => {
  const result = handle(seedMiscast());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "advisor-shadow");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedMiscast()),
    /miscast\|kind=advisor-shadow\|ref=parent-badge\|path=advisor-shadow\|cue=advisor-shadow/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and moored/buoyed/mended", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("ascribed booth flips miscast back when the mask admits ascribed", () => {
  const tape = {
    ascribed: true,
    miscast: false,
    advisorShadow: false,
    cue: "ascribed",
  };
  assert.equal(scoreGate(tape).verdict, "ascribed");
  tape.ascribed = false;
  tape.miscast = true;
  tape.advisorShadow = true;
  tape.cue = "miscast";
  assert.equal(scoreGate(tape).verdict, "miscast");
  tape.ascribed = true;
  tape.miscast = false;
  tape.advisorShadow = false;
  tape.cue = "ascribed";
  assert.equal(scoreGate(tape).verdict, "ascribed");
});

test("inspectors and readBooth mark the miscast proof", () => {
  const badge = inspectParentBadgeMark({ miscast: true });
  assert.equal(badge.stamp, "parent-badge");
  const paint = inspectFablePaintMark({ miscast: true, fablePaint: true });
  assert.equal(paint.stamp, "fable-paint");
  assert.equal(paint.missed, true);
  const booth = readBooth({
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
  });
  assert.equal(booth.miscast, true);
  assert.equal(booth.mark, "miscast");
  const open = readBooth({
    ascribed: true,
    miscast: false,
    advisorShadow: false,
  });
  assert.equal(open.miscast, false);
  assert.equal(open.mark, "ascribed");
  assert.equal(inspectAdvisorAttachmentMark({ miscast: true, advisorAttachment: true }).stamp, "advisor-attachment");
  assert.equal(inspectLabelLieMark({ miscast: true, labelLie: true }).stamp, "label-lie");
  assert.equal(inspectOverrideMark({ miscast: true, overrideHonoured: true }).stamp, "override-honoured");
});

test("mapProsopon encodes the published advisor-shadow", () => {
  const miss = mapProsopon({ miscast: true, advisorShadow: true });
  assert.equal(miss.stamp, "advisor-shadow");
  assert.equal(miss.holdingLane, "fable-paint");
  assert.equal(miss.ribbon, "miscast");
  const clear = mapProsopon({ ascribed: true, miscast: false });
  assert.equal(clear.stamp, "orchestra-pit");
  assert.equal(clear.kindLane, "clay-mask");
  assert.equal(clear.holdingLane, "orchestra-pit");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.deepEqual(COUSINS.map((row) => row.issue), [76381]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("slipway"));
  assert.ok(NOT_PRODUCTS.includes("freshet"));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("brisure"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[6].issue, 94547);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94575));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.ok(!COUSINS.some((row) => row.issue === 94575));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/miscast.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const ascribedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/ascribed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(ascribedFix.status, 0, ascribedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const ascribedOut = JSON.parse(ascribedFix.stdout);
  assert.equal(idleOut.verdict, "ascribed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "miscast");
  assert.equal(seededOut.alarm, true);
  assert.equal(ascribedOut.verdict, "ascribed");
  assert.equal(ascribedOut.hold, true);
  assert.match(ascribedOut.phrase, /admit ascribed/);
});

test("handle exposes published hypothesis and #94575 headline", () => {
  const result = handle(seedMiscast());
  assert.equal(result.published.issue, 94575);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [76381]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94547));
  assert.ok(!result.published.backups.includes(94575));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /advisor_tool\.attachment\.model|message\.model|NON-BINDING|#94575/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94575/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the ascribed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("ascribed page is a Greek theatre night amphitheatre, not a dry-dock or Renaissance masque", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Infant|Cormorant Infant/);
  assert.match(page, /family=Sora|Sora/);
  assert.match(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /prosopon|ascribed|miscast|advisor-shadow|clay-mask|olive-wreath|torch|marble-plinth|skene|orchestra/i,
  );
  assert.match(page, /#0B0A0F|#C4A574|#3F5E3A|#E2B457|#6B1E2A|#E8E0D4/i);
  assert.match(page, /\bascribed\b/);
  assert.match(page, /\bmiscast\b/);
  assert.match(page, /advisor-shadow/);
  assert.match(page, /Score prosopon or admit ascribed/i);
  assert.match(page, /#387/);
  assert.match(page, /#94575/);
  assert.match(page, /Admit ascribed/);
  assert.match(page, /Score prosopon/);
  assert.match(page, /Walk advisor-shadow/);
  assert.match(page, /Compare ascribed \/ miscast/);
  assert.match(page, /Pin idle ascribed/);
  assert.match(page, /Pin seeded miscast/);
  assert.match(page, /Pin advisor-shadow/);
  assert.match(page, /Stamp advisor-attachment/);
  assert.match(page, /Score booth/);
  assert.match(page, /prosopon-score/);
  assert.match(
    page,
    /advisor_tool|claude-fable-5-1|claude-sonnet-5|the model launched was not SONNET|background-agent/i,
  );
  assert.match(page, /clay-mask|olive-wreath|torch|marble-plinth|skene|orchestra/i);
  assert.match(
    page,
    /<svg[\s\S]*class="skene"|class="clay-mask"|class="olive-wreath"|class="torch"|class="marble-plinth"|class="advisor-shadow"/i,
  );
  assert.match(page, /body\.ascribed|body\.miscast|body\.advisor-shadow/);
  assert.match(page, /evidence-table|claude-sonnet-5 x83|claude-opus-5 x86|advisor_tool/i);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /#06141F|#A34428|#EFA31A|#B7C2CC|#1E5346|#0C1C22/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /vacant sarcophagus|Portland-stone|memorial yard/i);
  assert.doesNotMatch(page, /keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i);
  assert.doesNotMatch(page, /admit moored|Score slipway|idle moored/i);
  assert.doesNotMatch(page, /admit buoyed|Score freshet|idle buoyed/i);
  assert.doesNotMatch(page, /admit mended|Score kintsugi|idle mended/i);
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
  assert.doesNotMatch(page, /iface-swap/);
  assert.doesNotMatch(page, /init-flood/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /tabard|blazon|herald/i);
  assert.match(page, /NOT Slipway/i);
  assert.match(page, /NOT Freshet/i);
  assert.match(page, /NOT Kintsugi/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT #94458/i);
  assert.match(page, /NOT #76381/i);
  assert.match(page, /#76381/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Prosopon/);
  assert.match(readme, /#94575/);
  assert.match(readme, /\bascribed\b/);
  assert.match(readme, /\bmiscast\b/);
  assert.match(readme, /advisor-shadow/);
  assert.match(readme, /Cormorant Infant/);
  assert.match(readme, /Sora/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /advisor_tool|claude-fable-5-1|the model launched was not SONNET|background-agent/i);
  assert.match(readme, /NOT #76381/);
  assert.match(readme, /NOT Slipway/);
  assert.match(readme, /NOT Vizard/);
  assert.match(readme, /#76381/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/prosopon/);
  assert.match(readme, /node --test projects\/prosopon\/prosopon\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Greek theatre|prosopon|tragic-mask|skene|orchestra/i);
  assert.match(readme, /Score prosopon or admit ascribed/);
  assert.match(readme, /#93924|#94547/);
  assert.doesNotMatch(readme, /backup #94575|#94575 as next/);
  assert.match(readme, /05:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bslipway\b/);
  assert.doesNotMatch(readme, /\bfreshet\b/);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-16 — Prosopon/);
  assert.match(runLog, /05:50/);
});

test("catalog features Prosopon only; Slipway unfeatured; product count 387", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 387);
  assert.equal(hub.products.length, 387);
  assert.equal(catalog.products[0].name, "Prosopon");
  assert.equal(catalog.products[0].slug, "prosopon");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/prosopon/");
  assert.equal(catalog.products[0].day, "2026-09-16");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bascribed\b/);
  assert.match(catalog.products[0].summary, /\bmiscast\b/);
  assert.match(catalog.products[0].summary, /advisor-shadow/);
  assert.match(catalog.products[0].summary, /Score prosopon or admit ascribed/);
  assert.match(catalog.products[0].summary, /#94575/);
  assert.match(catalog.products[0].summary, /05:50/);
  assert.equal(hub.products[0].slug, "prosopon");
  assert.equal(hub.products[0].featured, true);
  const slipway = catalog.products.find((row) => row.slug === "slipway");
  assert.ok(slipway);
  assert.equal(slipway.featured, false);
  const freshet = catalog.products.find((row) => row.slug === "freshet");
  assert.ok(freshet);
  assert.equal(freshet.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "prosopon" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94575") && row.slug !== "prosopon",
    ),
  );
});

test("vercel rewrites prosopon to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/prosopon");
  assert.equal(vercel.rewrites[0].destination, "/projects/prosopon");
  assert.equal(vercel.rewrites[1].source, "/prosopon/");
  assert.equal(vercel.rewrites[1].destination, "/projects/prosopon");
  assert.equal(vercel.rewrites[2].source, "/prosopon/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/prosopon/:path*");
  assert.equal(vercel.rewrites[3].source, "/slipway");
  assert.equal(vercel.rewrites[3].destination, "/projects/slipway");
});

test("no leftover clone / dry-dock / masque / herald content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque|copper-kettle|treacle-well|vacant sarcophagus|cracked-bowl|urushi-pot|kiln-mouth|gold-seam|hemp-rope winch|bollard-post|gangway-plank|keel-cradle|sodium-lamp/i);
  }
  assert.doesNotMatch(source, /staff gauge overtopped|floodplain plaque|urushi pot|cracked bowl|vacant sarcophagus|keel cradle/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
