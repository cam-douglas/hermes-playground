import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ATTAINT_WALK,
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
  REROUTED_TO,
  RULED_OUT,
  SAMPLE_ATTAINT_PROOF,
  SEEDED_WORD,
  SELECTED_MODEL,
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
  inspectBlood,
  inspectFlag,
  inspectLineage,
  inspectModel,
  mapScope,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAttaint,
  seedFlagContaminates,
  seedHold,
  seedOpusReroute,
  seedOwnReleaseEng,
  seedProduct,
  seedSessionAttainder,
  seedUnattainted,
} from "./attaint.mjs";

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
  return fileURLToPath(new URL("./attaint.mjs", import.meta.url));
}

test("idle unattainted is a hold; Fable held; lineage clean", () => {
  const result = analyze(seedUnattainted());
  assert.equal(result.verdict, "unattainted");
  assert.equal(result.idleWord, "unattainted");
  assert.equal(IDLE_WORD, "unattainted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unattainted, true);
  assert.equal(result.phrase, "admit unattainted");
  assert.equal(result.attaint, false);
  assert.equal(result.sessionAttainder, false);
  assert.ok(HOLD_ALIASES.includes("unattainted"));
  assert.ok(HOLD_ALIASES.includes("blood-clear"));
  assert.ok(HOLD_ALIASES.includes("lineage-open"));
  assert.ok(HOLD_ALIASES.includes("fable-held"));
  assert.ok(HOLD_ALIASES.includes("writ-clean"));
  assert.ok(HOLD_ALIASES.includes("roll-open"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify unattainted", () => {
  assert.equal(classify(emptyTicket()), "unattainted");
  assert.equal(classify(""), "unattainted");
  assert.equal(classify(null), "unattainted");
  assert.equal(decide({}), "unattainted");
});

test("#93821 seeded path scores attaint when one flag stains the session", () => {
  const result = analyze(seedAttaint());
  assert.equal(result.verdict, "attaint");
  assert.equal(result.seededWord, "attaint");
  assert.equal(SEEDED_WORD, "attaint");
  assert.equal(PRODUCT_WORD, "attaint");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.attaint, true);
  assert.equal(result.phrase, "score attaint");
  assert.equal(result.sessionAttainder, true);
  assert.equal(result.flagContaminates, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark stained blood and Opus reroute", () => {
  const lineage = inspectLineage({ attaint: true, sessionAttainder: true });
  assert.equal(lineage.stamp, "lineage-attainted");
  assert.equal(lineage.stained, true);
  const flag = inspectFlag({ attaint: true, flagContaminates: true });
  assert.equal(flag.stamp, "flag-contaminates");
  const model = inspectModel({ attaint: true, opusReroute: true });
  assert.equal(model.stamp, "opus-reroute");
  const blood = inspectBlood({ attaint: true, sessionAttainder: true });
  assert.equal(blood.stamp, "corruption-of-blood");
  const scored = scoreGate({
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
    opusReroute: true,
    cue: "attaint",
  });
  assert.equal(scored.verdict, "attaint");
  const open = inspectModel({ unattainted: true, opusReroute: false });
  assert.equal(open.stamp, "fable-held");
});

test("path word is session-attainder; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "session-attainder");
  const result = analyze(seedSessionAttainder());
  assert.equal(result.verdict, "session-attainder");
  assert.equal(result.pathWord, "session-attainder");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "session-attainder", preferSeed: true, attaint: true }),
    "session-attainder",
  );
  assert.equal(classify(seedOpusReroute()), "opus-reroute");
});

test("HOLD includes unattainted / hold", () => {
  assert.ok(HOLD.includes("unattainted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: flag-contaminates, own-release-eng, attaint", () => {
  assert.equal(classify(seedFlagContaminates()), "flag-contaminates");
  assert.equal(classify(seedOwnReleaseEng()), "own-release-eng");
  assert.equal(classify(seedProduct()), "attaint");
});

test("booth fixtures flip unattainted vs attaint vs session-attainder", () => {
  const idle = scoreGate(seedUnattainted());
  const seeded = scoreGate(seedAttaint());
  const unattainted = readData("unattainted.json");
  const attaint = readData("attaint.json");
  const path = readData("session-attainder.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "unattainted");
  assert.equal(seeded.verdict, "attaint");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUnattainted()), "unattainted");
  assert.equal(score(seedAttaint()), "attaint");
  assert.equal(unattainted.sessionAttainder, false);
  assert.equal(unattainted.unattainted, true);
  assert.equal(scoreGate(unattainted).verdict, "unattainted");
  assert.equal(attaint.sessionAttainder, true);
  assert.equal(attaint.flagContaminates, true);
  assert.equal(attaint.opusReroute, true);
  assert.equal(classify(attaint), "attaint");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /unattainted|Fable|lineage clean|blood-clear/i);
  assert.match(path.paths[1].result, /contaminat|cannot restore|stain/i);
  assert.equal(classify(path), "session-attainder");
  assert.equal(attaint.hubCount, "ATTAINT");
  assert.equal(attaint.issue, 93821);
  assert.equal(attaint.attaint, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("blood-clear.json")), "blood-clear");
  assert.equal(classify(readData("lineage-open.json")), "lineage-open");
  assert.equal(classify(readData("fable-held.json")), "fable-held");
  assert.equal(classify(readData("writ-clean.json")), "writ-clean");
  assert.equal(classify(readData("roll-open.json")), "roll-open");
  assert.equal(classify(readData("opus-reroute.json")), "opus-reroute");
  assert.equal(classify(readData("flag-contaminates.json")), "flag-contaminates");
  assert.equal(classify(readData("own-release-eng.json")), "own-release-eng");
  assert.equal(classify(readData("symbol-strip.json")), "symbol-strip");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("unattainted"));
  assert.ok(CHIPS.includes("attaint"));
  assert.ok(CHIPS.includes("session-attainder"));
  assert.ok(CHIPS.includes("opus-reroute"));
  assert.ok(CHIPS.includes("flag-contaminates"));
  assert.ok(CHIPS.includes("fable-held"));
  assert.ok(CHIPS.includes("own-release-eng"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("attaint"));
  assert.ok(ALARM.includes("session-attainder"));
  assert.ok(ALARM.includes("opus-reroute"));
  assert.ok(ALARM.includes("flag-contaminates"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published attaint walk scores attaint after the idle hold", () => {
  const booth = scoreWalk({ rows: ATTAINT_WALK });
  assert.equal(booth.verdict, "attaint");
  assert.ok(booth.attaintCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-unattainted");
  assert.equal(idle.unattainted, true);
  assert.equal(idle.verdict, "unattainted");
  const cut = booth.rows.find((row) => row.event === "session-attainder");
  assert.equal(cut.sessionAttainder, true);
  const path = booth.rows.find((row) => row.event === "session-attainder" && row.t === "path");
  assert.equal(path.verdict, "session-attainder");
});

test("ATTAINT_WALK constant matches the issue court-roll walk", () => {
  assert.equal(ATTAINT_WALK[0].event, "cue-unattainted");
  const cut = ATTAINT_WALK.find((row) => row.event === "session-attainder");
  assert.equal(cut.sessionAttainder, true);
  const path = ATTAINT_WALK.find((row) => row.t === "path");
  assert.equal(path.attaint, true);
  const scoreRow = ATTAINT_WALK.find((row) => row.event === "attaint");
  assert.equal(scoreRow.attaint, true);
});

test("positive control unattainted roll stays unattainted", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "unattainted");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "unattainted");
  const hold = walk.rows.find((row) => row.event === "cue-unattainted");
  assert.equal(hold.unattainted, true);
  assert.equal(hold.verdict, "unattainted");
});

test("issue constants encode only #93821 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93821);
  assert.ok(ISSUE_URL.includes("93821"));
  assert.match(TITLE, /Cyber safeguard|Fable 5\.1|Opus 4\.8|release engineering/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Claude Code|macOS/);
  assert.equal(BUILD, "2.1.269");
  assert.equal(SURFACE, "session-attainder-cyber-safeguard");
  assert.equal(SELECTED_MODEL, "Fable 5.1 (claude-fable-5-1)");
  assert.equal(REROUTED_TO, "Opus 4.8");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:model",
    "area:security",
  ]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Oriel|#93809/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Attainder|#93529/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Fomite|#93423/i.test(row)));
  assert.ok(EXPECTED.some((row) => /Fable 5\.1|own build|contaminat/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|Fable 5\.1|Opus 4\.8|#63751|\/model fable/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("session-attainder"));
  assert.ok(FINGERPRINT_LINES.includes("attaint"));
  assert.equal(PHRASE, "Score attaint or admit unattainted.");
  assert.equal(SAMPLE_ATTAINT_PROOF.sessionAttainder, true);
});

test("has-repro fingerprints encode the published attaint proof", () => {
  const result = handle(seedAttaint());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "session-attainder-cyber-safeguard");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedAttaint()),
    /attaint\|model=opus-4-8\|flag=stain\|path=session-attainder\|cue=session-attainder/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes reflowed/oriel/articulate and recent catalog words", () => {
  const required = [
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
    "store-slug-collide",
    "unitary",
    "tessellated",
    "tessera",
    "version-path-tcc",
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "untainted",
    "attainted",
    "attainder",
    "retire-parked",
    "scrubbed",
    "contaminated",
    "fomite",
    "stet",
    "rubric",
    "galley",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("unattainted booth flips attaint back when the lineage is clean", () => {
  const tape = {
    unattainted: true,
    attaint: false,
    sessionAttainder: false,
    cue: "unattainted",
  };
  assert.equal(scoreGate(tape).verdict, "unattainted");
  tape.unattainted = false;
  tape.attaint = true;
  tape.sessionAttainder = true;
  tape.flagContaminates = true;
  tape.cue = "attaint";
  assert.equal(scoreGate(tape).verdict, "attaint");
  tape.unattainted = true;
  tape.attaint = false;
  tape.sessionAttainder = false;
  tape.flagContaminates = false;
  tape.cue = "unattainted";
  assert.equal(scoreGate(tape).verdict, "unattainted");
});

test("lineage, flag, model, and readBooth mark the attaint proof", () => {
  const idle = inspectLineage({
    unattainted: true,
  });
  assert.equal(idle.stamp, "lineage-open");
  const flag = inspectFlag({ attaint: true, flagContaminates: true });
  assert.equal(flag.stamp, "flag-contaminates");
  assert.equal(flag.contaminates, true);
  const model = inspectModel({ attaint: true, opusReroute: true });
  assert.equal(model.stamp, "opus-reroute");
  const booth = readBooth({
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
  });
  assert.equal(booth.attaint, true);
  assert.equal(booth.mark, "attaint");
  const open = readBooth({
    unattainted: true,
    attaint: false,
    sessionAttainder: false,
  });
  assert.equal(open.attaint, false);
  assert.equal(open.mark, "unattainted");
});

test("mapScope encodes the published session stain", () => {
  const miss = mapScope({ attaint: true, sessionAttainder: true });
  assert.equal(miss.stamp, "session-attainder");
  assert.equal(miss.bloodLane, "stained");
  assert.equal(miss.ribbon, "attaint");
  const clear = mapScope({ unattainted: true, attaint: false });
  assert.equal(clear.stamp, "unattainted-roll");
  assert.equal(clear.modelLane, "fable-5-1");
  assert.equal(clear.bloodLane, "clear");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 63751);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("fomite"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[9].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93821));
  assert.ok(!BACKUPS.some((row) => row.issue === 63751));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/attaint.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unattaintedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unattainted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(unattaintedFix.status, 0, unattaintedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const unattaintedOut = JSON.parse(unattaintedFix.stdout);
  assert.equal(idleOut.verdict, "unattainted");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "attaint");
  assert.equal(seededOut.alarm, true);
  assert.equal(unattaintedOut.verdict, "unattainted");
  assert.equal(unattaintedOut.hold, true);
  assert.match(unattaintedOut.phrase, /admit unattainted/);
});

test("handle exposes published hypothesis and #93821 headline", () => {
  const result = handle(seedAttaint());
  assert.equal(result.published.issue, 93821);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [63751]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93967));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93821));
  assert.match(result.published.hypothesis, /classifier|release engineering|NON-BINDING|#93821/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93821/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a court-roll attainder booth, not bay-window or voice-clinic", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.match(page, /Manrope/);
  assert.match(page, /Fragment Mono|Fragment\+Mono/);
  assert.match(page, /attaint|unattainted|session-attainder|court roll|corruption of blood|wax/i);
  assert.match(page, /#F3E6C8|#14110C|#7B1420|#C9A227|#3B2A1A|#5C1A22/i);
  assert.match(page, /\bunattainted\b/);
  assert.match(page, /\battaint\b/);
  assert.match(page, /session-attainder/);
  assert.match(page, /Score attaint or admit unattainted/i);
  assert.match(page, /#63751|cousin/i);
  assert.match(page, /#337/);
  assert.match(page, /#93821/);
  assert.match(page, /Admit unattainted/);
  assert.match(page, /Score attaint/);
  assert.match(page, /Walk session-attainder/);
  assert.match(page, /Compare unattainted \/ attaint/);
  assert.match(page, /Pin idle unattainted/);
  assert.match(page, /Pin seeded attaint/);
  assert.match(page, /Pin session-attainder/);
  assert.match(page, /Clear the attainder/);
  assert.match(page, /Score booth/);
  assert.match(page, /attaint-score/);
  assert.match(page, /Fable 5\.1|Opus 4\.8|\/model fable|release engineering/i);
  assert.match(page, /court roll|wax|blood|lineage|attainder/i);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Old Standard TT|Old\+Standard\+TT/);
  assert.doesNotMatch(page, /Public Sans|Public\+Sans/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /#5C584F/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#1A1916/);
  assert.doesNotMatch(page, /#C9953A/);
  assert.doesNotMatch(page, /#3F6B58/);
  assert.doesNotMatch(page, /#A85A4A/);
  assert.doesNotMatch(page, /#2A6F6A/);
  assert.doesNotMatch(page, /#F7F3EB/);
  assert.doesNotMatch(page, /#1C1A17/);
  assert.doesNotMatch(page, /#C47A2C/);
  assert.doesNotMatch(page, /#A84B5B/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#8B1E1E/);
  assert.doesNotMatch(page, /laryngoscope|voice-strip|glottis|phonat/i);
  assert.doesNotMatch(page, /mullion|leaded|sash|bay-window|fenestrat/i);
  assert.doesNotMatch(page, /agar plate|culture dish|pathogen droplet|sterile-lab/i);
  assert.doesNotMatch(page, /parked-permission|toolDenialKind|user-rejected|retireParked/i);
  assert.doesNotMatch(page, /\breflowed\b/);
  assert.doesNotMatch(page, /\boriel\b/);
  assert.doesNotMatch(page, /plan-no-reflow/);
  assert.doesNotMatch(page, /\barticulate\b/);
  assert.doesNotMatch(page, /\banarthria\b/);
  assert.doesNotMatch(page, /dictation-paste-drop/);
  assert.doesNotMatch(page, /\blimber\b/);
  assert.doesNotMatch(page, /\btrismus\b/);
  assert.doesNotMatch(page, /\bfiliated\b/);
  assert.doesNotMatch(page, /\bfoundling\b/);
  assert.doesNotMatch(page, /\buntainted\b/);
  assert.doesNotMatch(page, /\battainted\b/);
  assert.doesNotMatch(page, /\bscrubbed\b/);
  assert.doesNotMatch(page, /\bcontaminated\b/);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Fomite/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Attaint/);
  assert.match(readme, /#93821/);
  assert.match(readme, /\bunattainted\b/);
  assert.match(readme, /\battaint\b/);
  assert.match(readme, /session-attainder/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /NOT Oriel/i);
  assert.match(readme, /NOT Anarthria/i);
  assert.match(readme, /NOT Trismus/i);
  assert.match(readme, /NOT Foundling/i);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /Fable 5\.1|Opus 4\.8|\/model fable|release engineering/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/attaint/);
  assert.match(readme, /node --test projects\/attaint\/attaint\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /court-roll|attainder|corruption of blood|wax/i);
  assert.match(readme, /Score attaint or admit unattainted/);
  assert.match(readme, /#63751/);
  assert.match(readme, /#93772|#93770|#93777|#93811|#93924|#93925|#93954|#93967|#93957|#93823/);
  assert.match(readme, /20:50/);
  assert.match(readme, /Do NOT implement a fix/i);
});

test("catalog features Attaint only; Oriel unfeatured; product count 337", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 337);
  assert.equal(hub.products.length, 337);
  assert.equal(catalog.products[0].name, "Attaint");
  assert.equal(catalog.products[0].slug, "attaint");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/attaint/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /20:50 attaint|#93821|court-roll|unattainted|session-attainder/i);
  assert.match(catalog.products[0].summary, /\bunattainted\b/);
  assert.match(catalog.products[0].summary, /\battaint\b/);
  assert.match(catalog.products[0].summary, /session-attainder/);
  assert.match(catalog.products[0].summary, /Score attaint or admit unattainted/);
  assert.equal(hub.products[0].slug, "attaint");
  assert.equal(hub.products[0].featured, true);
  const oriel = catalog.products.find((row) => row.slug === "oriel");
  assert.ok(oriel);
  assert.equal(oriel.featured, false);
  const anarthria = catalog.products.find((row) => row.slug === "anarthria");
  assert.ok(anarthria);
  assert.equal(anarthria.featured, false);
  const trismus = catalog.products.find((row) => row.slug === "trismus");
  assert.ok(trismus);
  assert.equal(trismus.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "attaint").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93821") && row.slug !== "attaint"));
});

test("vercel rewrites attaint to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/attaint");
  assert.equal(vercel.rewrites[0].destination, "/projects/attaint");
  assert.equal(vercel.rewrites[1].source, "/attaint/");
  assert.equal(vercel.rewrites[1].destination, "/projects/attaint");
  assert.equal(vercel.rewrites[2].source, "/attaint/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/attaint/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
