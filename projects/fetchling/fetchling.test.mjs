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
  SWAP_SHAPES,
  RULED_OUT,
  FETCHLING_WALK,
  SAMPLE_FETCHLING_PROOF,
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
  inspectClaudeMd,
  inspectDouble,
  inspectLedger,
  inspectMint,
  inspectMirror,
  inspectSkillPath,
  mapDesk,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedSkillDollarSwap,
  seedSilentCorruption,
  seedHold,
  seedProduct,
  seedFetchling,
  seedLiteral,
  seedSub119,
} from "./fetchling.mjs";

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
  return fileURLToPath(new URL("./fetchling.mjs", import.meta.url));
}

test("idle literal is a hold; mint tray face-value and ledger stays true", () => {
  const result = analyze(seedLiteral());
  assert.equal(result.verdict, "literal");
  assert.equal(result.idleWord, "literal");
  assert.equal(IDLE_WORD, "literal");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.literal, true);
  assert.equal(result.phrase, "admit literal");
  assert.equal(result.fetchling, false);
  assert.equal(result.skillDollarSwap, false);
  assert.ok(HOLD_ALIASES.includes("literal"));
  assert.ok(HOLD_ALIASES.includes("as-written"));
  assert.ok(HOLD_ALIASES.includes("face-value"));
  assert.ok(HOLD_ALIASES.includes("mint-true"));
  assert.ok(HOLD_ALIASES.includes("dollar-intact"));
  assert.ok(HOLD_ALIASES.includes("skill-verbatim"));
  assert.ok(HOLD_ALIASES.includes("ledger-true"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify literal", () => {
  assert.equal(classify(emptyTicket()), "literal");
  assert.equal(classify(""), "literal");
  assert.equal(classify(null), "literal");
  assert.equal(decide({}), "literal");
});

test("#94065 seeded path scores fetchling when $1–$19 swap on Skill load", () => {
  const result = analyze(seedFetchling());
  assert.equal(result.verdict, "fetchling");
  assert.equal(result.seededWord, "fetchling");
  assert.equal(SEEDED_WORD, "fetchling");
  assert.equal(PRODUCT_WORD, "fetchling");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.fetchling, true);
  assert.equal(result.phrase, "score fetchling");
  assert.equal(result.skillDollarSwap, true);
  assert.equal(result.sub119, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark swapped ledger and doubled twilight glass", () => {
  const mint = inspectMint({ fetchling: true, skillDollarSwap: true });
  assert.equal(mint.stamp, "mint-split");
  assert.equal(mint.swapped, true);
  const ledger = inspectLedger({ fetchling: true, skillDollarSwap: true });
  assert.equal(ledger.stamp, "ledger-swapped");
  assert.equal(ledger.swapped, true);
  const mirror = inspectMirror({ fetchling: true, conversationFragment: true });
  assert.equal(mirror.stamp, "mirror-double");
  const scored = scoreGate({
    fetchling: true,
    skillDollarSwap: true,
    sub119: true,
    cue: "fetchling",
  });
  assert.equal(scored.verdict, "fetchling");
  const open = inspectMint({ literal: true, fetchling: false });
  assert.equal(open.stamp, "mint-true");
});

test("path word is skill-dollar-swap; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "skill-dollar-swap");
  const result = analyze(seedSkillDollarSwap());
  assert.equal(result.verdict, "skill-dollar-swap");
  assert.equal(result.pathWord, "skill-dollar-swap");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "skill-dollar-swap",
      preferSeed: true,
      fetchling: true,
    }),
    "skill-dollar-swap",
  );
  assert.equal(classify(seedSub119()), "sub-1-19");
  assert.equal(score(seedSkillDollarSwap()), "fetchling");
});

test("HOLD includes literal / hold", () => {
  assert.ok(HOLD.includes("literal"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: sub-1-19, silent-corruption, fetchling", () => {
  assert.equal(classify(seedSub119()), "sub-1-19");
  assert.equal(classify(seedSilentCorruption()), "silent-corruption");
  assert.equal(classify(seedProduct()), "fetchling");
});

test("booth fixtures flip literal vs fetchling vs skill-dollar-swap", () => {
  const idle = scoreGate(seedLiteral());
  const seeded = scoreGate(seedFetchling());
  const literal = readData("literal.json");
  const fetchling = readData("fetchling.json");
  const path = readData("skill-dollar-swap.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "literal");
  assert.equal(seeded.verdict, "fetchling");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLiteral()), "literal");
  assert.equal(score(seedFetchling()), "fetchling");
  assert.equal(
    score({ seed: "skill-dollar-swap", preferSeed: true }),
    "fetchling",
  );
  assert.equal(literal.skillDollarSwap, false);
  assert.equal(literal.literal, true);
  assert.equal(scoreGate(literal).verdict, "literal");
  assert.equal(fetchling.skillDollarSwap, true);
  assert.equal(fetchling.sub119, true);
  assert.equal(fetchling.conversationFragment, true);
  assert.equal(classify(fetchling), "fetchling");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /literal|as-written|face-value|mint-true|dollar-intact|skill-verbatim|ledger-true/i,
  );
  assert.match(
    path.paths[1].result,
    /skill-dollar-swap|sub-1-19|conversation-fragment|\$10|the/i,
  );
  assert.equal(classify(path), "skill-dollar-swap");
  assert.equal(fetchling.hubCount, "FETCHLING");
  assert.equal(fetchling.issue, 94065);
  assert.equal(fetchling.fetchling, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("as-written.json")), "as-written");
  assert.equal(classify(readData("face-value.json")), "face-value");
  assert.equal(classify(readData("mint-true.json")), "mint-true");
  assert.equal(classify(readData("dollar-intact.json")), "dollar-intact");
  assert.equal(classify(readData("skill-verbatim.json")), "skill-verbatim");
  assert.equal(classify(readData("ledger-true.json")), "ledger-true");
  assert.equal(classify(readData("claude-md-intact.json")), "claude-md-intact");
  assert.equal(classify(readData("skill-path-corrupt.json")), "skill-path-corrupt");
  assert.equal(classify(readData("sub-1-19.json")), "sub-1-19");
  assert.equal(classify(readData("intact-20-plus.json")), "intact-20-plus");
  assert.equal(classify(readData("same-line-mix.json")), "same-line-mix");
  assert.equal(classify(readData("conversation-fragment.json")), "conversation-fragment");
  assert.equal(classify(readData("silent-corruption.json")), "silent-corruption");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("literal"));
  assert.ok(CHIPS.includes("fetchling"));
  assert.ok(CHIPS.includes("skill-dollar-swap"));
  assert.ok(CHIPS.includes("sub-1-19"));
  assert.ok(CHIPS.includes("conversation-fragment"));
  assert.ok(CHIPS.includes("as-written"));
  assert.ok(CHIPS.includes("ledger-true"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("fetchling"));
  assert.ok(ALARM.includes("skill-dollar-swap"));
  assert.ok(ALARM.includes("sub-1-19"));
  assert.ok(ALARM.includes("same-line-mix"));
  assert.ok(ALARM.includes("silent-corruption"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published fetchling walk scores fetchling after the idle hold", () => {
  const booth = scoreWalk({ rows: FETCHLING_WALK });
  assert.equal(booth.verdict, "fetchling");
  assert.ok(booth.fetchlingCount >= 1);
  const idle = booth.rows.find((row) => row.event === "ledger-literal");
  assert.equal(idle.literal, true);
  assert.equal(idle.verdict, "literal");
  const cut = booth.rows.find((row) => row.event === "skill-dollar-swap");
  assert.equal(cut.skillDollarSwap, true);
  const path = booth.rows.find(
    (row) => row.event === "skill-dollar-swap" && row.t === "path",
  );
  assert.equal(path.verdict, "skill-dollar-swap");
});

test("FETCHLING_WALK constant matches the issue desk walk", () => {
  assert.equal(FETCHLING_WALK[0].event, "ledger-literal");
  const cut = FETCHLING_WALK.find(
    (row) => row.event === "skill-dollar-swap",
  );
  assert.equal(cut.skillDollarSwap || cut.sub119, true);
  const path = FETCHLING_WALK.find((row) => row.t === "path");
  assert.equal(path.fetchling, true);
  const scoreRow = FETCHLING_WALK.find((row) => row.event === "fetchling");
  assert.equal(scoreRow.fetchling, true);
});

test("positive control literal desk stays literal", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "literal");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "literal");
  const hold = walk.rows.find((row) => row.event === "ledger-literal");
  assert.equal(hold.literal, true);
  assert.equal(hold.verdict, "literal");
});

test("issue constants encode only #94065 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94065);
  assert.ok(ISSUE_URL.includes("94065"));
  assert.match(TITLE, /\$1-\$19|Skill loading|CLAUDE\.md is unaffected/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /Skill tool|\.claude\/skills/i);
  assert.equal(BUILD, "Skill tool (Windows 11)");
  assert.equal(SURFACE, "skill-dollar-swap");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:skills"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(SWAP_SHAPES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Aphonia|#92409/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sourdine|#93531/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /as written|\$5|\$19|CLAUDE\.md|silent corruption/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /\$5|\$19|\$20|\$25|\$13,961|CLAUDE\.md|Skill-tool|the|Windows 11|silent corruption/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("skill-dollar-swap"));
  assert.ok(FINGERPRINT_LINES.includes("fetchling"));
  assert.equal(PHRASE, "Score fetchling or admit literal.");
  assert.equal(SAMPLE_FETCHLING_PROOF.skillDollarSwap, true);
  assert.equal(SAMPLE_FETCHLING_PROOF.shapes.length, 6);
});

test("has-repro fingerprints encode the published fetchling proof", () => {
  const result = handle(seedFetchling());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "skill-dollar-swap");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedFetchling()),
    /fetchling\|kind=skill-dollar-swap\|ref=swapped\|path=skill-dollar-swap\|cue=skill-dollar-swap/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and echoing/souffleur", () => {
  const required = [
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
    "berthed",
    "pegged",
    "latent",
    "flushed",
    "articulate",
    "limber",
    "primed",
    "lit",
    "voiced",
    "mute",
    "rostered",
    "quieted",
    "unrung",
    "demesned",
    "diagrammed",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "mondegreen",
    "afterimage",
    "phosphene",
    "scotoma",
    "scrim",
    "aphonia",
    "sourdine",
    "anarthria",
    "app-switch-echo-loss",
    "summarized-thinking-force",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
    "dictation-paste-drop",
    "mid-narration",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("literal booth flips fetchling back when the desk admits literal", () => {
  const tape = {
    literal: true,
    fetchling: false,
    skillDollarSwap: false,
    cue: "literal",
  };
  assert.equal(scoreGate(tape).verdict, "literal");
  tape.literal = false;
  tape.fetchling = true;
  tape.skillDollarSwap = true;
  tape.cue = "fetchling";
  assert.equal(scoreGate(tape).verdict, "fetchling");
  tape.literal = true;
  tape.fetchling = false;
  tape.skillDollarSwap = false;
  tape.cue = "literal";
  assert.equal(scoreGate(tape).verdict, "literal");
});

test("mint, ledger, mirror, and readBooth mark the fetchling proof", () => {
  const idle = inspectMint({
    literal: true,
  });
  assert.equal(idle.stamp, "mint-true");
  const ledger = inspectLedger({ fetchling: true, skillDollarSwap: true });
  assert.equal(ledger.stamp, "ledger-swapped");
  assert.equal(ledger.swapped, true);
  const mirror = inspectMirror({ fetchling: true, conversationFragment: true });
  assert.equal(mirror.stamp, "mirror-double");
  const booth = readBooth({
    fetchling: true,
    skillDollarSwap: true,
    sub119: true,
  });
  assert.equal(booth.fetchling, true);
  assert.equal(booth.mark, "fetchling");
  const open = readBooth({
    literal: true,
    fetchling: false,
    skillDollarSwap: false,
  });
  assert.equal(open.fetchling, false);
  assert.equal(open.mark, "literal");
  assert.equal(
    inspectSkillPath({ fetchling: true, skillPathCorrupt: true }).stamp,
    "skill-path-corrupt",
  );
  assert.equal(inspectLedger({ literal: true }).stamp, "ledger-true");
  assert.equal(
    inspectClaudeMd({ fetchling: true, claudeMdIntact: true }).stamp,
    "claude-md-intact",
  );
  assert.equal(
    inspectDouble({ fetchling: true, conversationFragment: true }).stamp,
    "double-present",
  );
});

test("mapDesk encodes the published open swap", () => {
  const miss = mapDesk({ fetchling: true, skillDollarSwap: true });
  assert.equal(miss.stamp, "skill-dollar-swap");
  assert.equal(miss.holdingLane, "swapped");
  assert.equal(miss.ribbon, "fetchling");
  const clear = mapDesk({ literal: true, fetchling: false });
  assert.equal(clear.stamp, "literal-desk");
  assert.equal(clear.kindLane, "ledger-true");
  assert.equal(clear.holdingLane, "face-value");
});

test("cousins stay empty (none published); products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[9].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94065));
  assert.ok(!BACKUPS.some((row) => row.issue === 94031));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/fetchling.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const literalFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/literal.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(literalFix.status, 0, literalFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const literalOut = JSON.parse(literalFix.stdout);
  assert.equal(idleOut.verdict, "literal");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "fetchling");
  assert.equal(seededOut.alarm, true);
  assert.equal(literalOut.verdict, "literal");
  assert.equal(literalOut.hold, true);
  assert.match(literalOut.phrase, /admit literal/);
});

test("handle exposes published hypothesis and #94065 headline", () => {
  const result = handle(seedFetchling());
  assert.equal(result.published.issue, 94065);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94065));
  assert.match(
    result.published.hypothesis,
    /regex|String\.replace|backref|\$\$|NON-BINDING|#94065/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94065/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the literal page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("literal page is a twilight coin-ledger desk, not a theatre prompt-corner", () => {
  const page = readPage();
  assert.match(page, /family=Lora|Lora/);
  assert.match(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.match(page, /Roboto\+Mono|Roboto Mono/);
  assert.match(
    page,
    /fetchling|literal|skill-dollar-swap|ledger|mint|mirror|twilight|coin/i,
  );
  assert.match(page, /#12101A|#D4A84B|#C8C2D4|#EDE8F5|#B84A6A|#5A5568|#2A9B8F/i);
  assert.match(page, /\bliteral\b/);
  assert.match(page, /\bfetchling\b/);
  assert.match(page, /skill-dollar-swap/);
  assert.match(page, /Score fetchling or admit literal/i);
  assert.match(page, /#355/);
  assert.match(page, /#94065/);
  assert.match(page, /Admit literal/);
  assert.match(page, /Score fetchling/);
  assert.match(page, /Walk skill-dollar-swap/);
  assert.match(page, /Compare literal \/ fetchling/);
  assert.match(page, /Pin idle literal/);
  assert.match(page, /Pin seeded fetchling/);
  assert.match(page, /Pin skill-dollar-swap/);
  assert.match(page, /Open the ledger/);
  assert.match(page, /Score booth/);
  assert.match(page, /fetchling-score/);
  assert.match(
    page,
    /Windows 11|\$5|\$19|\$25|CLAUDE\.md|Skill tool|\$13,961/i,
  );
  assert.match(page, /ledger|mint|mirror|twilight|coin|fetchling/i);
  assert.match(page, /<svg[\s\S]*class="coin-face"|class="mirror-glass"|class="ledger-rule"/i);
  assert.doesNotMatch(page, /family=Playfair\+Display|Playfair Display/);
  assert.doesNotMatch(page, /family=Literata|Literata/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /phosphor|\bCRT\b/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /folio-leaf|press-beam/);
  assert.doesNotMatch(page, /ENT roster|laryngology|concert mute/i);
  assert.doesNotMatch(page, /admit echoing|idle echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /\bechoing\b/);
  assert.doesNotMatch(page, /\bsouffleur\b/);
  assert.doesNotMatch(page, /app-switch-echo-loss/);
  assert.doesNotMatch(page, /summarized-thinking-force/);
  assert.doesNotMatch(page, /Score aphonia|admit rostered|idle articulate/i);
  assert.doesNotMatch(page, /Score sourdine|mid-narration mute booth/i);
  assert.doesNotMatch(page, /Score anarthria|dictation paste drop booth/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Anarthria/i);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Fetchling/);
  assert.match(readme, /#94065/);
  assert.match(readme, /\bliteral\b/);
  assert.match(readme, /\bfetchling\b/);
  assert.match(readme, /skill-dollar-swap/);
  assert.match(readme, /Lora/);
  assert.match(readme, /Plus Jakarta Sans/);
  assert.match(readme, /Roboto Mono/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.doesNotMatch(readme, /Literata/);
  assert.doesNotMatch(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /SKILL-DOLLAR-SWAP|\$1|\$19|CLAUDE\.md|Skill tool/i,
  );
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Aphonia\/#92409/);
  assert.match(readme, /NOT Sourdine\/#93531/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/fetchling/);
  assert.match(readme, /node --test projects\/fetchling\/fetchling\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /ledger|mint|mirror|twilight|coin/i);
  assert.match(readme, /Score fetchling or admit literal/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94059|#94053|#94174|#94151|#94064/,
  );
  assert.match(readme, /14:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Fetchling/);
  assert.match(runLog, /14:50/);
});

test("catalog features Fetchling only; Souffleur unfeatured; product count 355", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 355);
  assert.equal(hub.products.length, 355);
  assert.equal(catalog.products[0].name, "Fetchling");
  assert.equal(catalog.products[0].slug, "fetchling");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/fetchling/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "14:50 fetchling: a fae-twilight / shadow-double / coin-ledger / mirror-swap booth for #94065. Skill-tool load replaces literal $1–$19 in skill Markdown with unrelated conversation fragments while the disk file stays unmodified and CLAUDE.md $10 stays intact; $20+ survive; same line can mix ($19 gone, $25 lives). Idle literal / seeded fetchling / path skill-dollar-swap. Score fetchling or admit literal.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bliteral\b/);
  assert.match(catalog.products[0].summary, /\bfetchling\b/);
  assert.match(catalog.products[0].summary, /skill-dollar-swap/);
  assert.match(catalog.products[0].summary, /Score fetchling or admit literal/);
  assert.match(catalog.products[0].summary, /#94065/);
  assert.equal(hub.products[0].slug, "fetchling");
  assert.equal(hub.products[0].featured, true);
  const souffleur = catalog.products.find((row) => row.slug === "souffleur");
  assert.ok(souffleur);
  assert.equal(souffleur.featured, false);
  const epitome = catalog.products.find((row) => row.slug === "epitome");
  assert.ok(epitome);
  assert.equal(epitome.featured, false);
  const diabolica = catalog.products.find((row) => row.slug === "diabolica");
  assert.ok(diabolica);
  assert.equal(diabolica.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "fetchling").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94065") && row.slug !== "fetchling",
    ),
  );
});

test("vercel rewrites fetchling to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/fetchling");
  assert.equal(vercel.rewrites[0].destination, "/projects/fetchling");
  assert.equal(vercel.rewrites[1].source, "/fetchling/");
  assert.equal(vercel.rewrites[1].destination, "/projects/fetchling");
  assert.equal(vercel.rewrites[2].source, "/fetchling/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/fetchling/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
