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
  seedClear,
  seedAmbered,
  seedBynamed,
  fingerprint,
  signals,
  clearSignal,
  amberedSignal,
  bynamedSignal,
  bareSubmitWarnsSignal,
  namespacedCleanSignal,
  resolvesAnywaySignal,
  autocompleteOffersBareSignal,
  aliasMissingSignal,
  misleadingTerminalCopySignal,
  folioBynamed,
  columnWarns,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  NAME_COLUMNS,
  AUTOCOMPLETE,
  IDLE_WORD,
  SEEDED_WORD
} from "./byname.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92738 fixture scores ambered", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92738.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "ambered");
  assert.equal(out.ambered, true);
  assert.ok(out.chips.includes("ambered"));
});

test("empty / idle probe is clear", () => {
  const out = decide({});
  assert.equal(out.verdict, "clear");
  assert.equal(out.clear, true);
  assert.equal(out.ambered, false);
  assert.ok(HOLD.has("clear"));
  assert.equal(IDLE_WORD, "clear");
});

test("seeded ambered scores ambered", () => {
  const out = decide(seedAmbered());
  assert.equal(out.verdict, "ambered");
  assert.equal(out.ambered, true);
  assert.ok(out.chips.includes("ambered"));
  assert.ok(out.chips.includes("bare-submit-warns"));
  assert.ok(out.chips.includes("resolves-anyway"));
});

test("bynamed seed is a hold", () => {
  const out = decide(seedBynamed());
  assert.equal(out.verdict, "bynamed");
  assert.equal(out.bynamed, true);
  assert.equal(out.ambered, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "ambered");
});

test("clear seed is idle hold", () => {
  const out = decide(seedClear());
  assert.equal(out.verdict, "clear");
  assert.equal(out.clear, true);
  assert.ok(HOLD.has("clear"));
});

test("bare-submit-warns chip", () => {
  const out = decide({ seed: "bare-submit-warns", bareSubmitWarns: true });
  assert.equal(out.verdict, "bare-submit-warns");
  assert.equal(out.ambered, true);
  assert.match(out.reasons.join(" "), /\/orc-version/);
  assert.match(out.reasons.join(" "), /isn't a recognized command/);
});

test("namespaced-clean chip", () => {
  const out = decide({ seed: "namespaced-clean", namespacedClean: true });
  assert.equal(out.verdict, "namespaced-clean");
  assert.match(out.reasons.join(" "), /\/orclab:orc-version/);
  assert.match(out.reasons.join(" "), /no warning/);
});

test("resolves-anyway chip", () => {
  const out = decide({ seed: "resolves-anyway", resolvesAnyway: true });
  assert.equal(out.verdict, "resolves-anyway");
  assert.match(out.reasons.join(" "), /resolves and runs/);
  assert.match(out.reasons.join(" "), /nothing in logs/);
});

test("autocomplete-offers-bare chip", () => {
  const out = decide({ seed: "autocomplete-offers-bare", autocompleteOffersBare: true });
  assert.equal(out.verdict, "autocomplete-offers-bare");
  assert.match(out.reasons.join(" "), /orclab:orc-version \(orc-version\)/);
});

test("alias-missing chip", () => {
  const out = decide({ seed: "alias-missing", aliasMissing: true });
  assert.equal(out.verdict, "alias-missing");
  assert.match(out.reasons.join(" "), /!p\(name\)/);
  assert.match(out.reasons.join(" "), /aliases/);
});

test("misleading-terminal-copy chip", () => {
  const out = decide({ seed: "misleading-terminal-copy", misleadingTerminalCopy: true });
  assert.equal(out.verdict, "misleading-terminal-copy");
  assert.match(out.reasons.join(" "), /\+9dhXtDFu6/);
  assert.match(out.reasons.join(" "), /Claude Code terminal/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [91005, 92675, 92646, 92459, 92518]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /Advowson/);
  assert.match(out.reasons.join(" "), /Springe/);
  assert.match(out.reasons.join(" "), /Speakpipe/);
  assert.match(out.reasons.join(" "), /Muzzle/);
  assert.match(out.reasons.join(" "), /Hangfire/);
  assert.match(out.reasons.join(" "), /Aphonia/);
  assert.match(out.reasons.join(" "), /Catachresis/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "clear");
  assert.equal(score(seedBynamed()).verdict, "bynamed");
  assert.equal(handle('{"seed":"ambered","ambered":true}').verdict, "ambered");
  assert.equal(handle({ seed: "bynamed", bynamed: true }).verdict, "bynamed");
  const bag = seeds();
  assert.equal(decide(bag.clear).verdict, "clear");
  assert.equal(decide(bag.ambered).verdict, "ambered");
  assert.equal(decide(bag.bynamed).verdict, "bynamed");
  assert.equal(scoreFields(seedAmbered()).ambered, true);
});

test("fingerprint and signals detect byname facts", () => {
  assert.equal(
    clearSignal("idle folio is clear; pin idle clear; no false warning; namespaced path or no bare submit"),
    true
  );
  assert.equal(
    amberedSignal("folio ambered; amber wax; isn't a recognized command; false warning"),
    true
  );
  assert.equal(bynamedSignal("folio already bynamed; bare epithet registered"), true);
  assert.equal(bareSubmitWarnsSignal("bare-submit-warns Escape dismiss bare /orc-version"), true);
  assert.equal(
    namespacedCleanSignal("namespaced-clean /orclab:orc-version accepting autocomplete"),
    true
  );
  assert.equal(resolvesAnywaySignal("resolves-anyway resolves and runs anyway"), true);
  assert.equal(
    autocompleteOffersBareSignal(
      "autocomplete-offers-bare orclab:orc-version (orc-version) secondary label"
    ),
    true
  );
  assert.equal(
    aliasMissingSignal("alias-missing !p(name) exact lowercase name/alias aliases"),
    true
  );
  assert.equal(
    misleadingTerminalCopySignal("misleading-terminal-copy +9dhXtDFu6 Claude Code terminal"),
    true
  );
  const hits = signals(seedAmbered());
  assert.equal(hits.ambered || hits.bareSubmitWarns || hits.resolvesAnyway, true);
  const print = fingerprint(seedAmbered());
  assert.equal(print.bareSubmitWarns, true);
  assert.equal(print.amberedHit, true);
});

test("fingerprint scores bynamed clean folio path", () => {
  const print = fingerprint(seedBynamed());
  assert.equal(print.bynamedClean, true);
  assert.equal(print.amberedHit, false);
  const out = decide({ ...seedBynamed(), seed: "bynamed" });
  assert.equal(out.bynamed, true);
  assert.equal(out.verdict, "bynamed");
  assert.equal(folioBynamed(seedBynamed()), true);
  assert.equal(folioBynamed(seedAmbered()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedAmbered());
  assert.equal(alarm.ambered, true);
  const hold = classify(seedBynamed());
  assert.equal(hold.bynamed, true);
  const idle = classify(seedClear());
  assert.equal(idle.clear, true);
});

test("columnWarns encodes byname vs namespaced", () => {
  assert.equal(columnWarns("byname"), true);
  assert.equal(columnWarns("primary"), false);
  assert.equal(columnWarns("unknown"), null);
});

test("name columns are primary / byname", () => {
  assert.ok(NAME_COLUMNS.length === 2);
  assert.ok(NAME_COLUMNS.some((row) => row.id === "byname" && row.warning === true && row.runs === true));
  assert.ok(NAME_COLUMNS.some((row) => row.id === "primary" && row.warning === false && row.runs === true));
});

test("autocomplete encodes secondary bare label", () => {
  assert.equal(AUTOCOMPLETE.offered, "orclab:orc-version (orc-version)");
  assert.equal(AUTOCOMPLETE.rewriteOnAccept, "/orclab:orc-version");
  assert.equal(AUTOCOMPLETE.remainsBareOnDismiss, "/orc-version");
});

test("measured facts from #92738", () => {
  assert.equal(MEASURED.issue, 92738);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:linux",
    "area:plugins",
    "area:desktop"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T21:33:00Z");
  assert.equal(MEASURED.updated, "2026-09-07T21:44:51Z");
  assert.equal(MEASURED.reporter, "artificialorctelligence");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.desktop, "Claude Desktop 1.46388.2 (deb)");
  assert.equal(MEASURED.os, "Linux Mint 22.3");
  assert.equal(MEASURED.platform, "linux");
  assert.equal(MEASURED.claudeCode, "2.1.241");
  assert.equal(MEASURED.pluginSource, "local-path marketplace");
  assert.equal(MEASURED.pluginName, "orclab");
  assert.equal(MEASURED.skillName, "orc-version");
  assert.equal(MEASURED.namespacedForm, "/orclab:orc-version");
  assert.equal(MEASURED.bareForm, "/orc-version");
  assert.equal(MEASURED.autocompleteLabel, "orclab:orc-version (orc-version)");
  assert.equal(MEASURED.i18nId, "+9dhXtDFu6");
  assert.equal(MEASURED.clientSideOnly, true);
  assert.equal(MEASURED.nothingInLogs, true);
  assert.equal(MEASURED.pluginSkillEntriesCarryOnlyNamespacedName, true);
  assert.equal(MEASURED.resolvesAndRunsAnyway, true);
  assert.equal(MEASURED.neverWorked, true);
  assert.equal(IDLE_WORD, "clear");
  assert.equal(SEEDED_WORD, "ambered");
});

test("HOLD is clear/bynamed; ALARM is ambered family", () => {
  assert.ok(HOLD.has("clear"));
  assert.ok(HOLD.has("bynamed"));
  assert.equal(ALARM.has("clear"), false);
  assert.equal(ALARM.has("bynamed"), false);
  for (const chip of [
    "ambered",
    "bare-submit-warns",
    "namespaced-clean",
    "resolves-anyway",
    "autocomplete-offers-bare",
    "alias-missing",
    "misleading-terminal-copy",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "clear",
    "ambered",
    "bynamed",
    "bare-submit-warns",
    "namespaced-clean",
    "resolves-anyway",
    "autocomplete-offers-bare",
    "alias-missing",
    "misleading-terminal-copy",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites why-not-clone products", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.slug),
    ["advowson", "springe", "speakpipe", "muzzle", "hangfire", "aphonia", "catachresis"]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "clear.json",
    "ambered.json",
    "bynamed.json",
    "92738.json",
    "bare-submit-warns.json",
    "namespaced-clean.json",
    "resolves-anyway.json",
    "autocomplete-offers-bare.json",
    "alias-missing.json",
    "misleading-terminal-copy.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92738|byname|clear|ambered|bynamed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "clear");
  assert.equal(index.narrativeNotFixture.seeded, "ambered");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:plugins"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:desktop"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a herald byname desk, not a clone", () => {
  assert.match(page, /Newsreader/);
  assert.match(page, /Sora/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Ibarra Real Nova/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Geist Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.match(page, /ambered/);
  assert.match(page, /bynamed/);
  assert.match(page, /\bclear\b/);
  assert.match(page, /#92738/);
  assert.match(page, /Byname/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /07:50 \/ hermes catalog #213 \/ #92738/);
  assert.match(page, /Score ambered/);
  assert.match(page, /Admit bynamed/);
  assert.match(page, /Pin idle clear/);
  assert.match(page, /Reset to clear/);
  assert.match(page, /orclab:orc-version \(orc-version\)/);
  assert.match(page, /isn't a recognized command here/);
  assert.match(page, /\+9dhXtDFu6/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /91005/);
  assert.match(page, /92675/);
  assert.match(page, /92646/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /mason's battlement/i);
  assert.doesNotMatch(page, /embrasure notch/i);
  assert.doesNotMatch(page, /registrar's quietus/i);
  assert.doesNotMatch(page, /death-knell ledger/i);
  assert.doesNotMatch(page, /muted bronze bell/i);
  assert.doesNotMatch(page, /miller's cribble/i);
  assert.doesNotMatch(page, /flour loft/i);
  assert.doesNotMatch(page, /oak cribble/i);
  assert.doesNotMatch(page, /iron wire mesh/i);
  assert.doesNotMatch(page, /trapper's springe/i);
  assert.doesNotMatch(page, /snare-setter/i);
  assert.doesNotMatch(page, /pier gangway/i);
  assert.doesNotMatch(page, /freight waybill/i);
  assert.doesNotMatch(page, /diocesan registry/i);
  assert.doesNotMatch(page, /\bbricked\b/);
  assert.doesNotMatch(page, /\bcrenelled\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.doesNotMatch(page, /\bquieted\b/);
  assert.doesNotMatch(page, /\bporous\b/);
  assert.doesNotMatch(page, /\bcribbed\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsprung\b/);
  assert.doesNotMatch(page, /\bsevered\b/);
  assert.doesNotMatch(page, /\bremoored\b/);
  assert.doesNotMatch(page, /\bmisrouted\b/);
  assert.doesNotMatch(page, /\baddressed\b/);
  assert.doesNotMatch(page, /\badrift\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\bcorked\b/);
  assert.doesNotMatch(page, /\brelayed\b/);
  assert.doesNotMatch(page, /\blatent\b/);
  assert.doesNotMatch(page, /\bflushed\b/);
  assert.doesNotMatch(page, /\bsilted\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bvacant\b/);
});

test("README anti-clone encodes the byname thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /orclab:orc-version \(orc-version\)/);
  assert.match(readme, /artificialorctelligence/);
  assert.match(readme, /#91005/);
  assert.match(readme, /#92675/);
  assert.match(readme, /#92646/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/byname\//);
  assert.match(readme, /Score ambered or admit bynamed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Advowson/);
  assert.match(readme, /NOT Springe/);
  assert.match(readme, /NOT Speakpipe/);
  assert.match(readme, /NOT Catachresis/);
  assert.match(readme, /NOT Crenel/);
  assert.match(hookReadme, /clear/);
  assert.match(hookReadme, /ambered/);
  assert.match(hookReadme, /bynamed/);
  assert.match(dataReadme, /clear/);
  assert.match(dataReadme, /ambered/);
  assert.match(dataReadme, /bynamed/);
});
