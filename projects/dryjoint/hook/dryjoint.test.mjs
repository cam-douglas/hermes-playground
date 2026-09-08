import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  analyze,
  classify,
  score,
  scoreFields,
  handle,
  seeds,
  seedFused,
  seedDry,
  seedBonded,
  fingerprint,
  signals,
  fusedSignal,
  drySignal,
  bondedSignal,
  unwiredAnchorSignal,
  bridgeExistsUnusedSignal,
  silentBinaryRejectSignal,
  showTextDocumentNoCatchSignal,
  markdownMandateSignal,
  padBonded,
  jointWasDry,
  parseFileHref,
  hrefLooksLikeFileRef,
  anchorCallsBridge,
  bridgeExists,
  showTextDocumentHasCatch,
  binaryWouldReject,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  JOINT_LEDGER,
  REPRO_TABLE,
  OPEN_FILE_BRIDGE,
  SHOW_TEXT_DOCUMENT,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./dryjoint.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92809 fixture scores dry", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92809.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "dry");
  assert.equal(out.dry, true);
  assert.ok(out.chips.includes("dry"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is fused", () => {
  const out = decide({});
  assert.equal(out.verdict, "fused");
  assert.equal(out.fused, true);
  assert.equal(out.dry, false);
  assert.ok(HOLD.has("fused"));
  assert.equal(IDLE_WORD, "fused");
});

test("fused fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "fused.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "fused");
  assert.equal(out.fused, true);
  assert.ok(HOLD.has(out.verdict));
});

test("dry fixture scores dry", () => {
  const out = decide(seedDry());
  assert.equal(out.verdict, "dry");
  assert.equal(out.dry, true);
  assert.ok(out.chips.includes("dry"));
  assert.ok(out.chips.includes("unwired-anchor"));
  assert.ok(ALARM.has(out.verdict));
});

test("bonded seed is a hold", () => {
  const out = decide(seedBonded());
  assert.equal(out.verdict, "bonded");
  assert.equal(out.bonded, true);
  assert.equal(out.dry, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "dry");
  assert.equal(ADMIT_WORD, "bonded");
});

test("fused seed is idle hold", () => {
  const out = decide(seedFused());
  assert.equal(out.verdict, "fused");
  assert.equal(out.fused, true);
  assert.ok(HOLD.has("fused"));
});

test("unwired-anchor chip", () => {
  const out = decide({ seed: "unwired-anchor", unwiredAnchor: true });
  assert.equal(out.verdict, "unwired-anchor");
  assert.equal(out.dry, true);
  assert.match(out.reasons.join(" "), /never call openFile/);
  assert.match(out.reasons.join(" "), /silent no-op/);
});

test("bridge-exists-unused chip", () => {
  const out = decide({ seed: "bridge-exists-unused", bridgeExistsUnused: true });
  assert.equal(out.verdict, "bridge-exists-unused");
  assert.match(out.reasons.join(" "), /file chips/);
  assert.match(out.reasons.join(" "), /diff view/);
});

test("silent-binary-reject chip", () => {
  const out = decide({ seed: "silent-binary-reject", silentBinaryReject: true });
  assert.equal(out.verdict, "silent-binary-reject");
  assert.match(out.reasons.join(" "), /\.png/);
  assert.match(out.reasons.join(" "), /\.pdf/);
});

test("showTextDocument-no-catch chip", () => {
  const out = decide({ seed: "showTextDocument-no-catch", showTextDocumentNoCatch: true });
  assert.equal(out.verdict, "showTextDocument-no-catch");
  assert.match(out.reasons.join(" "), /showTextDocument\(uri\)\.then\(cb\)/);
  assert.match(out.reasons.join(" "), /no rejection handler/);
});

test("markdown-mandate chip", () => {
  const out = decide({ seed: "markdown-mandate", markdownMandate: true });
  assert.equal(out.verdict, "markdown-mandate");
  assert.match(out.reasons.join(" "), /Code References in Text/);
  assert.match(out.reasons.join(" "), /\[name\]\(path\)/);
});

test("cousins cite-only closed/locked neighbourhood", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /10846/);
  assert.match(out.reasons.join(" "), /92809/);
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[0].id, 10846);
  assert.equal(COUSINS[1].id, 16056);
  assert.equal(COUSINS[2].id, 44713);
  assert.equal(COUSINS[3].id, 51015);
  assert.equal(COUSINS[4].id, 57100);
  assert.equal(COUSINS[5].id, 72889);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "fused");
  assert.equal(score(seedBonded()).verdict, "bonded");
  assert.equal(handle('{"seed":"dry","dry":true}').verdict, "dry");
  assert.equal(handle({ seed: "bonded", bonded: true }).verdict, "bonded");
  const bag = seeds();
  assert.equal(decide(bag.fused).verdict, "fused");
  assert.equal(decide(bag.dry).verdict, "dry");
  assert.equal(decide(bag.bonded).verdict, "bonded");
  assert.equal(scoreFields(seedDry()).dry, true);
});

test("fingerprint and signals detect dryjoint facts", () => {
  assert.equal(
    fusedSignal("idle pad is fused; pin idle fused; chat markdown file links call the existing open_file; binary opens have a catch"),
    true
  );
  assert.equal(
    drySignal("anchors stay dry; never call the existing open_file; binary showTextDocument rejects silent; click is a silent no-op"),
    true
  );
  assert.equal(bondedSignal("already bonded; anchors call existing openFile; rejection handler that falls back to vscode.open"), true);
  assert.equal(unwiredAnchorSignal("unwired-anchor rendered <a> never call openFile"), true);
  assert.equal(bridgeExistsUnusedSignal('bridge-exists-unused file chips and the diff view sendRequest({type:"open_file"}'), true);
  assert.equal(silentBinaryRejectSignal("silent-binary-reject non-text files .png/.pdf user sees nothing at all"), true);
  assert.equal(showTextDocumentNoCatchSignal("showTextDocument-no-catch showTextDocument(uri).then(cb) no rejection handler"), true);
  assert.equal(markdownMandateSignal("markdown-mandate Code References in Text [name](path) dead on arrival"), true);
  const hits = signals(seedDry());
  assert.equal(hits.dry || hits.unwiredAnchor || hits.bridgeExistsUnused, true);
  const print = fingerprint(seedDry());
  assert.equal(print.dryHit, true);
  assert.equal(print.jointDry, true);
});

test("fingerprint scores bonded pad path", () => {
  const print = fingerprint(seedBonded());
  assert.equal(print.bondedClean, true);
  assert.equal(print.dryHit, false);
  const out = decide({ ...seedBonded(), seed: "bonded" });
  assert.equal(out.bonded, true);
  assert.equal(out.verdict, "bonded");
  assert.equal(padBonded(seedBonded()), true);
  assert.equal(padBonded(seedDry()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedDry());
  assert.equal(alarm.dry, true);
  const hold = classify(seedBonded());
  assert.equal(hold.bonded, true);
  const idle = classify(seedFused());
  assert.equal(idle.fused, true);
});

test("helpers encode unwired anchors + binary reject + href parse", () => {
  assert.equal(jointWasDry(seedDry()), true);
  assert.equal(jointWasDry(seedFused()), false);
  assert.equal(jointWasDry({ dry: true }), true);
  assert.equal(anchorCallsBridge(seedDry()), false);
  assert.equal(anchorCallsBridge(seedBonded()), true);
  assert.equal(bridgeExists(seedDry()), true);
  assert.equal(showTextDocumentHasCatch(SHOW_TEXT_DOCUMENT), false);
  assert.equal(showTextDocumentHasCatch("showTextDocument(uri).then(cb).catch(fallback)"), true);
  assert.equal(binaryWouldReject("docs/chart.png"), true);
  assert.equal(binaryWouldReject("docs/note.md"), false);
  const line = parseFileHref("docs/note.md#L42");
  assert.equal(line.path, "docs/note.md");
  assert.deepEqual(line.location, { start: 42 });
  const range = parseFileHref("docs/note.md#L42-L51");
  assert.deepEqual(range.location, { start: 42, end: 51 });
  assert.equal(hrefLooksLikeFileRef("docs/note.md"), true);
  assert.equal(hrefLooksLikeFileRef("https://example.com"), false);
  assert.equal(hrefLooksLikeFileRef("#fragment"), false);
  assert.match(OPEN_FILE_BRIDGE.webview, /open_file/);
  assert.match(OPEN_FILE_BRIDGE.host, /this\.openFile/);
});

test("joint ledger encodes the issue split", () => {
  assert.ok(JOINT_LEDGER.some((row) => row.id === "bridge" && /open_file/i.test(row.tally)));
  assert.ok(JOINT_LEDGER.some((row) => row.id === "anchor" && /never call openFile/i.test(row.tally)));
  assert.ok(JOINT_LEDGER.some((row) => row.id === "binary" && /no rejection handler/i.test(row.tally)));
  assert.ok(JOINT_LEDGER.length === 3);
  assert.equal(REPRO_TABLE.length, 4);
  assert.equal(REPRO_TABLE[0].mark, "[name](path)");
  assert.equal(REPRO_TABLE[3].mark, "open_file");
});

test("measured facts from #92809", () => {
  assert.equal(MEASURED.issue, 92809);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:vscode"]);
  assert.equal(MEASURED.filed, "2026-09-08T08:45:25Z");
  assert.equal(MEASURED.reporter, "0nelight");
  assert.match(MEASURED.extension, /2\.1\.263/);
  assert.equal(MEASURED.vscode, "1.132.0");
  assert.match(MEASURED.os, /Debian 13/);
  assert.equal(MEASURED.lastWorking, "2.1.4 (per #10846)");
  assert.equal(MEASURED.systemPrompt, "## Code References in Text");
  assert.equal(MEASURED.markdownFormat, "[name](path)");
  assert.equal(SHOW_TEXT_DOCUMENT, "vscode.window.showTextDocument(uri).then(cb)");
  assert.equal(IDLE_WORD, "fused");
  assert.equal(SEEDED_WORD, "dry");
  assert.equal(ADMIT_WORD, "bonded");
});

test("HOLD is fused/bonded; ALARM is dry family", () => {
  assert.ok(HOLD.has("fused"));
  assert.ok(HOLD.has("bonded"));
  assert.equal(ALARM.has("fused"), false);
  assert.equal(ALARM.has("bonded"), false);
  for (const chip of [
    "dry",
    "unwired-anchor",
    "bridge-exists-unused",
    "silent-binary-reject",
    "showTextDocument-no-catch",
    "markdown-mandate",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "fused",
    "dry",
    "bonded",
    "unwired-anchor",
    "bridge-exists-unused",
    "silent-binary-reject",
    "showTextDocument-no-catch",
    "markdown-mandate",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites closed/locked prior reports only", () => {
  assert.equal(COUSINS.length, 6);
  assert.ok(COUSINS.some((c) => c.id === 10846 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 16056 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 44713 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 51015 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 57100 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 72889 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "fused.json",
    "dry.json",
    "bonded.json",
    "92809.json",
    "unwired-anchor.json",
    "bridge-exists-unused.json",
    "silent-binary-reject.json",
    "showTextDocument-no-catch.json",
    "markdown-mandate.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92809|dryjoint|fused|dry|bonded/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "fused");
  assert.equal(index.narrativeNotFixture.seeded, "dry");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:vscode"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is an electronics dry-joint bench, not a clone", () => {
  assert.match(page, /Space Grotesk/);
  assert.match(page, /Manrope/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Zilla Slab/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.match(page, /\bdry\b/);
  assert.match(page, /bonded/);
  assert.match(page, /\bfused\b/);
  assert.match(page, /#92809/);
  assert.match(page, /Dryjoint/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /18:50 \/ hermes catalog #224 \/ #92809/);
  assert.match(page, /Score dry/);
  assert.match(page, /Admit bonded/);
  assert.match(page, /Pin idle fused/);
  assert.match(page, /Reset to fused/);
  assert.match(page, /open_file/);
  assert.match(page, /showTextDocument/);
  assert.match(page, /solder/);
  assert.match(page, /copper/);
  assert.match(page, /flux/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /twin-nameplate/i);
  assert.doesNotMatch(page, /lexicographer/i);
  assert.doesNotMatch(page, /iron-gall/i);
  assert.doesNotMatch(page, /marble cistern/i);
  assert.doesNotMatch(page, /water-clock/i);
  assert.doesNotMatch(page, /iron sconce/i);
  assert.doesNotMatch(page, /rush-pith/i);
  assert.doesNotMatch(page, /ivory-and-ebony/i);
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /piano cream/i);
  assert.doesNotMatch(page, /CRT phosphor/i);
  assert.doesNotMatch(page, /hairline-rule/i);
  assert.doesNotMatch(page, /compositor/i);
  assert.doesNotMatch(page, /zinc chase/i);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /\bkeyed\b/);
  assert.doesNotMatch(page, /\bdripping\b/);
  assert.doesNotMatch(page, /\barrested\b/);
  assert.doesNotMatch(page, /\bcredited\b/);
  assert.doesNotMatch(page, /\bchorded\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bmeshed\b/);
  assert.doesNotMatch(page, /\bpiped\b/);
  assert.doesNotMatch(page, /\bswallowed\b/);
  assert.doesNotMatch(page, /\bunbound\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bwaived\b/);
  assert.doesNotMatch(page, /\bbricked\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\bladen\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\brefused\b/);
  assert.doesNotMatch(page, /\bimprinted\b/);
  assert.doesNotMatch(page, /\bscored\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
  assert.doesNotMatch(page, /\bbanked\b/);
  assert.doesNotMatch(page, /\brewritten\b/);
  assert.doesNotMatch(page, /\bseeded\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /\btenured\b/);
  assert.doesNotMatch(page, /\bleaked\b/);
  assert.doesNotMatch(page, /\bbound\b/);
});

test("README anti-clone encodes the dryjoint thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /open_file/);
  assert.match(readme, /showTextDocument/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/dryjoint\//);
  assert.match(readme, /Score dry or admit bonded/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Dinkus/);
  assert.match(readme, /NOT Homonym/);
  assert.match(readme, /NOT Clepsydra/);
  assert.match(readme, /NOT Rushlight/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(readme, /#92788/);
  assert.match(readme, /#92794/);
  assert.match(readme, /#92801/);
  assert.match(hookReadme, /fused/);
  assert.match(hookReadme, /dry/);
  assert.match(hookReadme, /bonded/);
  assert.match(dataReadme, /fused/);
  assert.match(dataReadme, /dry/);
  assert.match(dataReadme, /bonded/);
});
